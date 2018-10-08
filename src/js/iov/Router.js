// @see - http://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html

// Note that this is the code that gets duplicated in each iframe.
// Keep the contents of the exported function light and ES5 only
// with the exception of the main export.
export default function () {
  function Router (conduitId, wsbroker, wsport, useSSL, connectionTimeout) {
    this.conduitId = conduitId;
    this.wsbroker = wsbroker;
    this.wsport = wsport;
    this.useSSL = useSSL;
    this.connectionTimeout = connectionTimeout;
    this.reconnectIntervalTime = 2 * 1000;

    this.mqttClient = null;
    this.reconnectInterval = null;
    this.isConnected = false;

    this.parent = window.parent;

    this.onMessageFromParent = this.onMessageFromParent.bind(this);
    this.onMessageFromParent = this.onMessageFromParent.bind(this);
    this.onConnectionLost = this.onConnectionLost.bind(this);
    this.onMqttMessageArrived = this.onMqttMessageArrived.bind(this);
    this.onConnectSuccess = this.onConnectSuccess.bind(this);
    this.onConnectFailure = this.onConnectFailure.bind(this);
  }

  Router.factory = function (conduitId, wsbroker, wsport, useSSL, connectionTimeout) {
    return new Router(conduitId, wsbroker, wsport, useSSL, connectionTimeout);
  };

  Router.prototype.debug = function debug () {
    // @todo
  };

  Router.prototype.silly = function silly () {
    // @todo
  };

  Router.prototype.error = function error (message, error) {
    // @todo - should post to parent rather than polluting the console
    console.warn('Error for ' + this.conduitId + ':');
    console.warn(message);

    if (error) {
      console.error(error);
    }
  };

  Router.prototype.initialize = function () {
    if (window.addEventListener) {
      window.addEventListener('message', this.onMessageFromParent, false);
    }
    else {
      window.attachEvent('onmessage', this.onMessageFromParent);
    }

    try {
      this.mqttClient = new this.parent.Paho.Client(
        this.wsbroker,
        this.wsport,
        this.conduitId
      );

      this.mqttClient.onConnectionLost = this.onConnectionLost;
      this.mqttClient.onMessageArrived = this.onMqttMessageArrived;

      this.postToParent({ event: 'loaded' });
    }
    catch (error) {
      this.error('Failed to load the mqtt client', error);
    }
  };

  /**
   * Send a message from this iframe to the main window
   */
  Router.prototype.postToParent = function postToParent (message) {
    try {
      // route message to parent window
      message.conduitId = this.conduitId;

      this.parent.postMessage(message, '*');
    }
    catch (error) {
      this.error('Error while executing "postMessage"...', error);
    }
  };

  Router.prototype.disconnect = function disconnect () {
    if (!this.mqttClient) {
      return;
    }

    this.isConnected = false;

    var failed = false;

    try {
      // @see - https://github.com/eclipse/paho.mqtt.javascript/blob/v1.1.0/src/paho-mqtt.js#L991
      this.mqttClient.disconnect();
    }
    catch (error) {
      // "AMQJS0011E" means the client is already disconnected, and we
      // do not need to treat it as an error
      if (!error.message.startsWith('AMQJS0011E')) {
        this.error('Error while trying to disconnect...', error);

        failed = true;
      }
    }

    this.postToParent({
      event: 'disconnect',
      failed: failed,
    });
  };

  /**
   * Send a message via this iframe's MQTTClient instance
   */
  Router.prototype.sendMessage = function sendMessage (topic, message) {
    try {
      var mqtt_msg = new this.parent.Paho.Message(message);

      mqtt_msg.destinationName = topic;

      this.mqttClient.send(mqtt_msg);
    }
    catch (error) {
      this.error('Error while sending mqtt message...', error);
    }
  };

  Router.prototype.onMqttMessageArrived = function onMqttMessageArrived (message) {
    var payloadString = '';

    try {
      // Note that simply accessing this payloadString property can
      // have unintended consequences (such as causing streams to fail
      // completely!), so be careful
      payloadString = message.payloadString;
    }
    catch (error) {
      // @todo - bogus excepton?
      // logError('Error while getting payloadString from message...', error);
    }

    this.postToParent({
      event: 'data',
      destinationName: message.destinationName,
      payloadString: payloadString,
      payloadBytes: message.payloadBytes || null,
    });
  };

  Router.prototype.onMessageFromParent = function onMessageFromParent (event) {
    var message = event.data;
    console.log(message.method, message.topic);

    try {
      switch (message.method) {
        case 'ready': {
          console.log('isConnected', this.isConnected);
          if (this.isConnected) {
            this.triggerReady();
          }
          else {
            this.connect();
          }

          break;
        }

        case 'destroy': {
          if (!this.mqttClient) {
            throw new Error('mqtt client not yet created!');
          }

          this.disconnect();
          break;
        }

        case 'subscribe': {
          if (!this.mqttClient) {
            throw new Error('mqtt client not yet created!');
          }

          this.mqttClient.subscribe(message.topic);
          break;
        }

        case 'unsubscribe': {
          if (!this.mqttClient) {
            throw new Error('mqtt client not yet created!');
          }

          this.mqttClient.unsubscribe(message.topic);
          break;
        }

        case 'publish': {
          if (!this.mqttClient) {
            throw new Error('mqtt client not yet created!');
          }

          try {
            this.sendMessage(message.topic, JSON.stringify(message.data));
          }
          catch (json_error) {
            // @todo - this error is never truly handled - can it be handled?
            // Other errors in this function end up posting a network failure
            // message.  Should this do something similar?
            this.error('Unable to parse message data...');
            this.error(message.data);
            return;
          }

          break;
        }
        default: {
          this.error('Unknown message method "' + message.method + '" received...');
        }
      }
    }
    catch (error) {
      if (error.message.startsWith('AMQJS0011E')) {
        this.error('Unable to send message due to disconnection, attempting to reconnect...', error);
        this.startTryingToReconnect();
        return;
      }

      this.error('Unknown onMessage error...', error);

      // we are dead!
      this.postToParent({
        event: 'fail',
        reason: 'network failure',
      });

      this.disconnect();
    }
  };

  Router.prototype.startTryingToReconnect = function startTryingToReconnect () {
    try {
      this.disconnect();
    }
    catch (error) {
      // if the connection hasn't been made yet, that's ok
    }

    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(function () {
        this.connect();
      }, this.reconnectIntervalTime);
    }
  };

  Router.prototype.stopTryingToReconnect = function stopTryingToReconnect () {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  };

  Router.prototype.triggerReady = function triggerReady () {
    this.stopTryingToReconnect();
    this.postToParent({ event: 'ready' });
  };

  Router.prototype.onConnectSuccess = function onConnectSuccess () {
    this.isConnected = true;

    this.triggerReady();
  };

  Router.prototype.onConnectFailure = function onConnectFailure (message) {
    this.isConnected = false;

    var failureMessage = 'Failed to connect: Error code ' + parseInt(message.errorCode) + ': ' + message.errorMessage;

    this.error(failureMessage);

    this.postToParent({
      event: 'fail',
      reason: failureMessage,
    });

    // @todo - should we try to reconnect here?
    this.startTryingToReconnect();
  };

  Router.prototype.onConnectionLost = function onConnectionLost (message) {
    // We disconnected properly
    if (message.errorCode === 0) {
      return;
    }

    var failureMessage = 'Lost connection: Error code ' + parseInt(message.errorCode) + ': ' + message.errorMessage;

    this.error(failureMessage);

    this.postToParent({
      event: 'fail',
      reason: failureMessage,
    });

    this.startTryingToReconnect();
  };

  Router.prototype.connect = function connect () {
    this.stopTryingToReconnect();

    // last will message sent on disconnect
    var willMessage = new this.parent.Paho.Message(JSON.stringify({ clientId: this.conduitId }));

    willMessage.destinationName = 'iov/clientDisconnect';

    try {
      // @see - https://github.com/eclipse/paho.mqtt.javascript/blob/v1.1.0/src/paho-mqtt.js#L863
      this.mqttClient.connect({
        willMessage: willMessage,
        useSSL: this.useSSL,
        timeout: this.connectionTimeout,
        onSuccess: this.onConnectSuccess,
        onFailure: this.onConnectFailure,
      });
    }
    catch (error) {
      this.error('Unknown connection failure...', error);

      this.postToParent({
        event: 'fail',
        reason: 'connect failed',
      });
    }
  };

  Router.prototype.destroy = function () {
    // @todo - need to properly destroy
    this.disconnect();
  };

  return Router;
}
