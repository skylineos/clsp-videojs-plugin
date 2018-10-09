// @see - http://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html

// Note that this is the code that gets duplicated in each iframe.
// Keep the contents of the exported function light and ES5 only
// with the exception of the main export.  Perhaps more ES6 things
// can be used here, but they must not require any polyfills or
// libraries to ensure the code stays minimal.
export default function () {
  /**
   * This is meant to be placed into an iframe to establish a socket connection to a
   * CLSP stream on a Skyline SFS.  Chrome has a socket connection limit (@todo citation
   * needed) that will not allow a significant number of socket connections from a
   * standard browser window.  We get around that limitation by establishing socket
   * connections in iframes, which then send the clsp stream segments back up to the
   * parent window to allow a user to play a substantial number of videos in a single
   * browser window.
   *
   * Intended usage:
   *
   * ```javascript
   * var router = Router.factory(
   *   conduitId,
   *   wsbroker,
   *   wsport,
   *   useSSL,
   *   {
   *     connectionTimeout,
   *     reconnectIntervalTime,
   *   }
   * );
   *
   * document.body.onload = router.initialize;
   * document.body.onunload = router.destroy;
   * ```
   *
   * @see ~/iov/Conduit.js for a usage example
   *
   * @param {String} conduitId
   *   The ID of the conduit that needs to receive the messages that are sent to this router
   * @param {String} wsbroker
   *   The host of the clsp url
   * @param {Number} wsport
   *   The port of the clsp url
   * @param {Boolean} useSSL
   *   Whether or not clsp will be served over SSL
   * @param {Number} options.connectionTimeout
   *   The number of seconds to wait before considering an mqtt socket connection as timed out
   */
  function Router (conduitId, wsbroker, wsport, useSSL, options) {
    this.conduitId = conduitId;
    this.wsbroker = wsbroker;
    this.wsport = wsport;
    this.useSSL = useSSL;
    this.options = {
      connectionTimeout: options.connectionTimeout || 180,
      reconnectIntervalTime: options.reconnectIntervalTime || 2 * 1000,
      // logLevel: options.logLevel || 'debug',
      logLevel: options.logLevel || false,
    };

    this.mqttClient = null;
    this.reconnectInterval = null;
    this.isConnected = false;

    this.parent = window.parent;

    this.connect = this.connect.bind(this);
    this.onMessageFromParent = this.onMessageFromParent.bind(this);
    this.onConnectionLost = this.onConnectionLost.bind(this);
    this.onMqttMessageArrived = this.onMqttMessageArrived.bind(this);
    this.onConnectSuccess = this.onConnectSuccess.bind(this);
    this.onConnectFailure = this.onConnectFailure.bind(this);
  }

  Router.factory = function (conduitId, wsbroker, wsport, useSSL, options) {
    return new Router(conduitId, wsbroker, wsport, useSSL, options);
  };

  Router.prototype.debug = function debug (...args) {
    if (this.options.logLevel === true || this.options.logLevel === 'silly' || this.options.logLevel === 'debug') {
      console.log('Router', this.conduitId, ...args);
    }
  };

  Router.prototype.silly = function silly (...args) {
    if (this.options.logLevel === true || this.options.logLevel === 'silly') {
      console.log('Router', this.conduitId, ...args);
    }
  };

  /**
   * For any error that occurs in this iframe, catch it here, and either
   * send it back up to the parent or handle it consistently.  If errors
   * in this iframe are not caught inside the iframe code, they can never
   * be handled.
   *
   * @param {String} message
   *   A message about the error
   * @param {Error|String} error
   *   The error itself
   */
  Router.prototype.error = function error (message, error) {
    // @todo - should post to parent rather than polluting the console
    console.warn('Error for ' + this.conduitId + ':');
    console.warn(message);

    if (error) {
      console.error(error);
    }
  };

  Router.prototype.initialize = function initialize () {
    this.debug('initializing...');

    window.addEventListener('message', this.onMessageFromParent);

    try {
      this.mqttClient = new this.parent.Paho.Client(
        this.wsbroker,
        this.wsport,
        this.conduitId
      );

      this.debug('mqtt client successfully created...');

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
    this.silly('sending "' + message.event + '" message to parent...');

    try {
      // route message to parent window
      message.conduitId = this.conduitId;

      this.parent.postMessage(message, '*');
    }
    catch (error) {
      this.error('Error while executing "postMessage"...', error);
    }
  };

  Router.prototype.createMessage = function createMessage (topic, message) {
    const mqttMessage = new this.parent.Paho.Message(JSON.stringify(message));

    mqttMessage.destinationName = topic;

    return mqttMessage;
  };

  Router.prototype.onMqttMessageArrived = function onMqttMessageArrived (message) {
    this.silly('mqtt message received');

    var payloadString = '';

    try {
      // !!!!!!
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
    this.debug('received "' + event.data.method + '" message from parent window');

    var message = event.data;

    try {
      switch (message.method) {
        case 'ready': {
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

          this.destroy();
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
            this.mqttClient.send(this.createMessage(message.topic, message.data));
          }
          catch (error) {
            // @todo - this error is never truly handled - can it be handled?
            // Other errors in this function end up posting a network failure
            // message.  Should this do something similar?
            this.debug(message.data);
            this.error('Unable to parse message data...', error);
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

  Router.prototype.triggerReady = function triggerReady () {
    this.debug('triggering ready message to parent...');

    if (this.isConnected) {
      this.stopTryingToReconnect();
      this.postToParent({ event: 'ready' });
    }
    else {
      // @todo - seems like this could result in an infinite call stack or something
      this.connect();
    }
  };

  Router.prototype.onConnectSuccess = function onConnectSuccess () {
    this.debug('connection was successful!');

    this.isConnected = true;

    this.triggerReady();
  };

  Router.prototype.onConnectFailure = function onConnectFailure (message) {
    this.debug('connection failed!');

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

    this.debug('connection lost!');

    var failureMessage = 'Lost connection: Error code ' + parseInt(message.errorCode) + ': ' + message.errorMessage;

    this.error(failureMessage);

    this.postToParent({
      event: 'fail',
      reason: failureMessage,
    });

    this.startTryingToReconnect();
  };

  Router.prototype.connect = function connect () {
    this.debug('connecting...');

    try {
      // @see - https://github.com/eclipse/paho.mqtt.javascript/blob/v1.1.0/src/paho-mqtt.js#L863
      this.mqttClient.connect({
        // "last will" message sent on disconnect
        willMessage: this.createMessage('iov/clientDisconnect', { clientId: this.conduitId }),
        useSSL: this.useSSL,
        timeout: this.options.connectionTimeout,
        onSuccess: this.onConnectSuccess,
        onFailure: this.onConnectFailure,
      });
    }
    catch (error) {
      if (error.message.startsWith('AMQJS0011E')) {
        this.debug('tried to connect, but was already connected...');
        this.stopTryingToReconnect();
        return;
      }

      this.error('Unknown connection failure...', error);

      this.postToParent({
        event: 'fail',
        reason: 'connect failed',
      });
    }
  };

  Router.prototype.disconnect = function disconnect () {
    if (!this.mqttClient) {
      return;
    }

    this.debug('disconnecting...');

    this.isConnected = false;

    this.stopTryingToReconnect();

    var disconnectFailed = false;

    try {
      // @see - https://github.com/eclipse/paho.mqtt.javascript/blob/v1.1.0/src/paho-mqtt.js#L991
      this.mqttClient.disconnect();
      this.debug('disconnected gracefully...');
    }
    catch (error) {
      // "AMQJS0011E" means the client is already disconnected, and we
      // do not need to treat it as an error
      if (!error.message.startsWith('AMQJS0011E')) {
        this.error('Error while trying to disconnect...', error);

        disconnectFailed = true;
      }
      else {
        this.debug('tried to disconnect, but was already disconnected...');
      }
    }

    this.postToParent({
      event: 'disconnect',
      failed: disconnectFailed,
    });
  };

  Router.prototype.startTryingToReconnect = function startTryingToReconnect () {
    this.debug('trying to reconnect...');

    try {
      this.disconnect();
    }
    catch (error) {
      // if the connection hasn't been made yet, that's ok
    }

    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(this.connect, this.options.reconnectIntervalTime);
    }
  };

  Router.prototype.stopTryingToReconnect = function stopTryingToReconnect () {
    this.debug('stopping reconnection attempts...');

    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  };

  /**
   * Unregister the necessary things, including disconnecting from the mqtt client.
   *
   * @returns void
   */
  Router.prototype.destroy = function destroy () {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.debug('destroying...');

    window.removeEventListener('message', this.onMessageFromParent);

    this.disconnect();

    this.conduitId = null;
    this.wsbroker = null;
    this.wsport = null;
    this.useSSL = null;
    this.options = null;

    this.mqttClient = null;
    this.reconnectInterval = null;
    this.isConnected = null;

    this.parent = null;

    // @todo - is it possible to "clean up" or destroy the mqttClient?
  };

  return Router;
}
