'use strict';

/**
 * This is the lowest level controller of the actual mqtt connection.
 *
 * Note that this is the code that gets duplicated in each iframe.
 * Keep the contents of the exported function light and ES5 only.
 *
 * @todo - have a custom loader for webpack that can convert this to ES5 and
 * minify it in a self-contained way at the time it is required so that we can
 * use ES6 and multiple files.
 */

/**
 * This router will manage an MQTT connection for a given clientId, and pass
 * the relevant data and messages back up to the conduit.
 *
 * @see - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
 * @see - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body
 * @see - https://www.eclipse.org/paho/files/jsdoc/index.html
 *
 * The following events are sent to the parent window:
 *
 * router_created
 *   when the router creation is finished.
 *   can only happen at time of router instantiation.
 * router_create_failure
 *   when the router creation fails.
 *   can only happen at time of router instantiation.
 * mqtt_data
 *   when a segment / moof is transmitted.
 *   can happen for as long as the connection is open.
 * connect_success
 *   when the connection to the mqtt server is established.can only happen at time of connection.
 * connect_failure
 *   when trying to connect to the mqtt server fails.
 *   can only happen at time of connection.
 * connection_lost
 *   when the connection to the mqtt server has been established, but is later lost.
 *   can happen for as long as the connection is open.
 * disconnect_success
 *   when the connection to the mqtt server is terminated normally.
 *   can only happen at time of disconnection.
 * subscribe_failure
 *   when trying to subscribe to a topic fails.
 *   can only happen when a subscribe is attempted.
 * unsubscribe_failure
 *   when trying to unsubscribe from a topic fails.
 *   can only happen when an unsubscribe is attempted.
 * window_message_fail
 *   when an error is encountered while processing window messages.
 *   can happen any time.
 *
 * @export - the function that provides the Router and constants
 */
export default function () {
  // The error code from paho mqtt that represents the socket not being
  // connected
  var PAHO_MQTT_ERROR_CODE_NOT_CONNECTED = 'AMQJS0011E';
  var PAHO_MQTT_ERROR_CODE_ALREADY_CONNECTED = 'AMQJS0011E';
  var Paho = window.parent.Paho;

  /**
   * @todo - define this as a class, and in a different file.  This will require
   * a change the way webpack processes the file though...
   *
   * A Router that can be used to set up an MQTT connection to the specified
   * ip and port, using a conduit-provided clientId that will be a part of every
   * message that is passed from this iframe window to the parent window, so
   * that the conduit can identify what client the message is for.
   */
  function Router (
    clientId,
    ip,
    port,
    useSSL
  ) {
    try {
      this.clientId = clientId;

      this.logger = window.Logger().factory(`Router ${this.clientId}`);

      this.ip = ip;
      this.port = port;
      this.useSSL = useSSL;

      this.logger.debug('Constructing...');

      this.retryInterval = 2000;
      this.Reconnect = null;
      this.connectionTimeout = 120;

      this.mqttClient = new Paho.MQTT.Client(
        this.ip,
        this.port,
        '/mqtt',
        this.clientId
      );

      this.mqttClient.onConnectionLost = this._onConnectionLost.bind(this);
      this.mqttClient.onMessageArrived = this._onMessageArrived.bind(this);

      this.boundWindowMessageEventHandler = this._windowMessageEventHandler.bind(this);

      window.addEventListener(
        'message',
        this.boundWindowMessageEventHandler,
        false
      );
    }
    catch (error) {
      this.logger.error('IFRAME error for clientId: ' + clientId);
      this.logger.error(error);
    }
  }

  /**
   * @private
   *
   * Post a "message" with the current `clientId` to the parent window.
   */
  Router.prototype._sendToParent = function (message) {
    this.logger.debug('Sending message to parent window...');

    if (typeof message !== 'object') {
      throw new Error('_sendToParent must be passed an object');
    }

    message.clientId = this.clientId;

    switch (message.event) {
      case 'router_created':
      case 'connect_success':
      case 'disconnect_success': {
        // no validation needed
        break;
      }
      case 'mqtt_data': {
        if (!message.hasOwnProperty('destinationName') || !message.hasOwnProperty('payloadString') || !message.hasOwnProperty('payloadBytes')) {
          throw new Error('improperly formatted "data" message sent to _sendToParent');
        }
        break;
      }
      case 'connect_failure':
      case 'connection_lost':
      case 'subscribe_failure':
      case 'unsubscribe_failure':
      case 'window_message_fail': {
        if (!message.hasOwnProperty('reason')) {
          throw new Error('improperly formatted "fail" message sent to _sendToParent');
        }
        break;
      }
      default: {
        throw new Error('Unknown event ' + message.event + ' sent to _sendToParent');
      }
    }

    window.parent.postMessage(message, '*');
  };

  /**
   * @private
   *
   * Called when a message has arrived in this Paho.MQTT.client
   *
   * The idea here is that when the server sends an mqtt message, whether a
   * moof, moov, or something else, that data needs to be sent to the appropriate
   * player (client).  So when this router gets that chunk of data, it sends it
   * back to the conduit with the clientId, and the conduit is then responsible
   * for passing it to the appropriate player.
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   */
  Router.prototype._onMessageArrived = function (mqttMessage) {
    this.logger.debug('Received MQTT message...');

    try {
      var payloadString = '';

      try {
        payloadString = mqttMessage.payloadString;
      }
      catch (error) {
        // I have no idea what is going on here, but every single time we do the
        // assignment above, an error is thrown.  When I console.log(payloadString)
        // it appears to be an empty string.  However, if that assignment is not
        // done, no video gets displayed!!
        // There should be some way to only use the payloadBytes here...
      }

      this._sendToParent({
        event: 'mqtt_data',
        destinationName: mqttMessage.destinationName,
        payloadString: payloadString, // @todo - why is this necessary when it doesn't exist?
        payloadBytes: mqttMessage.payloadBytes || null,
      });
    }
    catch (error) {
      this.logger.error(error);
    }
  };

  /**
   * @private
   *
   * called when an mqttClient connection has been lost, or after a connect()
   * method has succeeded.
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   */
  Router.prototype._onConnectionLost = function (responseObject) {
    this.logger.warn('MQTT connection lost!');

    var errorCode = parseInt(responseObject.errorCode);

    if (errorCode === 0) {
      // The connection was "properly" terminated
      this._sendToParent({
        event: 'disconnect_success',
      });

      return;
    }

    this._sendToParent({
      event: 'connection_lost',
      reason: 'connection lost error code ' + errorCode,
    });
  };

  /**
   * @private
   *
   * Any time a "message" event occurs on the window respond to it by inspecting
   * the messages "method" property and taking the appropriate action.
   */
  Router.prototype._windowMessageEventHandler = function (event) {
    var message = event.data;
    var method = message.method;

    this.logger.debug('Handling incoming window message for "' + method + '"...');

    try {
      switch (method) {
        case 'subscribe': {
          this._subscribe(message.topic);
          break;
        }
        case 'unsubscribe': {
          this._unsubscribe(message.topic);
          break;
        }
        case 'publish': {
          var payload = null;

          try {
            payload = JSON.stringify(message.data);
          }
          catch (error) {
            this.logger.error('ERROR: Unable to handle the "publish" window message event!');
            this.logger.error('json stringify error: ' + message.data);

            // @todo - should we throw here?
            // throw error;
            return;
          }

          this._publish(payload, message.topic);
          break;
        }
        case 'connect': {
          this.connect();
          break;
        }
        case 'disconnect': {
          this.disconnect();
          break;
        }
        case 'send': {
          this._publish(message.byteArray, message.topic);
          break;
        }
        default: {
          this.logger.error('unknown message method: ' + method);
        }
      }
    }
    catch (error) {
      this.logger.error(error);

      this._sendToParent({
        event: 'window_message_fail',
        reason: 'window message event failure',
      });
    }
  };

  /**
   * @private
   *
   * Success handler for "connect".  Registers the window message event handler,
   * and notifies the parent window that this client is "ready".
   *
   * @todo - track the "connected" status to prevent multiple window message
   * event handlers from being attached
   */
  Router.prototype._connect_onSuccess = function () {
    this.logger.info('Successfully established MQTT connection');

    this._sendToParent({
      event: 'connect_success',
    });
  };

  /**
   * @private
   *
   * Failure handler for "connect".  Sends a "fail" message to the parent
   * window
   */
  Router.prototype._connect_onFailure = function (message) {
    this.logger.info('MQTT Connection Failure!');
    this._sendToParent({
      event: 'connect_failure',
      reason: 'Error code ' + parseInt(message.errorCode) + ': ' + message.errorMessage,
    });
  };

  /**
   * @private
   *
   * Success handler for "subscribe".
   */
  Router.prototype._subscribe_onSuccess = function (topic, message) {
    this.logger.debug('Successfully subscribed to topic "' + topic + '"');
    // @todo
  };

  /**
   * @private
   *
   * Failure handler for "subscribe".  Sends a "fail" message to the parent
   * window
   */
  Router.prototype._subscribe_onFailure = function (topic, message) {
    this.logger.error('Failed to subscribe to topic "' + topic + '"');

    this._sendToParent({
      event: 'subscribe_failure',
      reason: 'subscribe failed',
    });
  };

  /**
   * @private
   *
   * Start receiving messages for the given topic
   */
  Router.prototype._subscribe = function (topic) {
    this.logger.debug('Subscribing to topic "' + topic + '"');

    if (!topic) {
      throw new Error('topic is a required argument when subscribing');
    }

    this.mqttClient.subscribe(topic, {
      onSuccess: this._subscribe_onSuccess.bind(this, topic),
      onFailure: this._subscribe_onFailure.bind(this, topic),
    });
  };

  /**
   * @private
   *
   * Success handler for "unsubscribe".
   */
  Router.prototype._unsubscribe_onSuccess = function (topic, message) {
    this.logger.debug('Successfully unsubscribed from topic "' + topic + '"');
    // @todo
  };

  /**
   * @private
   *
   * Failure handler for "unsubscribe".  Sends a "fail" message to the parent
   * window
   */
  Router.prototype._unsubscribe_onFailure = function (topic, message) {
    this.logger.debug('Failed to unsubscribe from topic "' + topic + '"');

    this._sendToParent({
      event: 'unsubscribe_failure',
      reason: 'unsubscribe failed',
    });
  };

  /**
   * @private
   *
   * Stop receiving messages for the given topic
   */
  Router.prototype._unsubscribe = function (topic) {
    this.logger.debug('Unsubscribing from topic "' + topic + '"');

    if (!topic) {
      throw new Error('topic is a required argument when unsubscribing');
    }

    this.mqttClient.unsubscribe(topic, {
      onSuccess: this._unsubscribe_onSuccess.bind(this, topic),
      onFailure: this._unsubscribe_onFailure.bind(this, topic),
    });
  };

  /**
   * @private
   *
   * Publish a message to the clients that are listening for the given topic
   */
  Router.prototype._publish = function (payload, topic) {
    this.logger.debug('Publishing to topic "' + topic + '"');

    if (!payload) {
      throw new Error('payload is a required argument when publishing');
    }

    if (!topic) {
      throw new Error('topic is a required argument when publishing');
    }

    var mqttMessage = new Paho.MQTT.Message(payload);

    mqttMessage.destinationName = topic;

    this.mqttClient.send(mqttMessage);
  };

  /**
   * Connect this Messaging client to its server
   */
  Router.prototype.connect = function () {
    this.logger.info('Connecting...');

    // last will message sent on disconnect
    var willMessage = new Paho.MQTT.Message(JSON.stringify({
      clientId: this.clientId,
    }));

    willMessage.destinationName = 'iov/clientDisconnect';

    var connectionOptions = {
      timeout: this.connectionTimeout,
      onSuccess: this._connect_onSuccess.bind(this),
      onFailure: this._connect_onFailure.bind(this),
      willMessage: willMessage,
    };

    if (this.useSSL === true) {
      connectionOptions.useSSL = true;
    }

    try {
      this.mqttClient.connect(connectionOptions);
      this.logger.info('Connected');
    }
    catch (error) {
      if (error.message.startsWith(PAHO_MQTT_ERROR_CODE_ALREADY_CONNECTED)) {
        // if we're already connected, there's no error to report
        return;
      }

      this.logger.error('Failed to connect', error);

      this._sendToParent({
        event: 'connect_failure',
        reason: 'General error when trying to connect.',
      });
    }
  };

  /**
   * Disconnect the messaging client from the server
   */
  Router.prototype.disconnect = function () {
    this.logger.info('Disconnecting');
    try {
      this.mqttClient.disconnect();
    }
    catch (error) {
      if (error.message.startsWith(PAHO_MQTT_ERROR_CODE_NOT_CONNECTED)) {
        // if we're not connected when we attempted to disconnect, there's no
        // error to report
        return;
      }

      this.logger.error('ERROR while disconnecting');
      this.logger.error(error);

      throw error;
    }
  };

  // This is a series of "controllers" to keep the conduit's iframe as dumb as
  // possible.  Call each of these in the corresponding attribute on the
  // "body" tag.
  return {
    onload: function () {
      try {
        window.router = new Router(
          window.mqttRouterConfig.clientId,
          window.mqttRouterConfig.ip,
          window.mqttRouterConfig.port,
          window.mqttRouterConfig.useSSL,
        );

        window.router._sendToParent({
          event: 'router_created',
        });

        window.router.logger.info('onload - Router created');
      }
      catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        window.parent.postMessage({
          event: 'router_create_failure',
          reason: error,
        }, '*');
      }
    },
    onunload: function () {
      if (!window.router) {
        return;
      }

      try {
        window.router.logger.info('onunload - Router disconnecting in onunload...');
        window.router.disconnect();
        window.router.logger.info('onunload - Router disconnected in onunload');
      }
      catch (error) {
        if (error.message.startsWith(PAHO_MQTT_ERROR_CODE_NOT_CONNECTED)) {
          // if there wasn't a connection, do not show an error
          return;
        }

        window.router.logger.error(error);
      }
    },
  };
}
