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
 *
 * @todo - should all thrown errors send a message to the parent Conduit?
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
   * host and port, using a conduit-provided clientId that will be a part of every
   * message that is passed from this iframe window to the parent window, so
   * that the conduit can identify what client the message is for.
   *
   * @param {String} clientId
   *   the uuid to be used to construct the topic
   * @param {String} willMessageRoute
   *   the route that paho mqtt needs to send its last will message
   * @param {String} host
   *   the host (url or ip) of the SFS that is providing the stream
   * @param {Number} port
   *   the port the stream is served over
   * @param {Boolean} useSSL
   *   true to request the stream over clsps, false to request the stream over clsp
   */
  function Router (
    clientId,
    willMessageRoute,
    host,
    port,
    useSSL
  ) {
    try {
      this.logger = window.Logger().factory(`Router ${this.clientId}`);

      this.clientId = clientId;
      this.willMessageRoute = willMessageRoute;
      this.host = host;
      this.port = port;
      this.useSSL = useSSL;

      this.logger.debug('Constructing...');

      this.retryInterval = 2000;
      this.Reconnect = null;
      this.connectionTimeout = 120;

      // @todo - there is a "private" method named "_doConnect" in the paho mqtt
      // library that is responsible for instantiating the WebSocket.  We have
      // seen at least 1 instance where the instantiation of the WebSocket fails
      // which was due to the error "ERR_NAME_NOT_RESOLVED", but it does not
      // seem like this error is "passed" up to the caller (e.g. Router.connect)
      // and therefore we cannot respond to it.  If we could, perhaps we could
      // attempt to reconnect, or at least send a message to Router's parent.
      // Given this, should we override Paho.MQTT.Client._doConnect and wrap
      // the original prototype method call in a try/catch that we can control
      // and respond to?  I'm not even sure that that would solve the problem.
      // Presumably, the instantiation of the WebSocket would throw, which would
      // be caught by our Router.connect try/catch block...
      this.mqttClient = new Paho.MQTT.Client(
        this.host,
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
   *
   * @param {Object} message
   *   The message to send to the parent window
   *
   * @returns {void}
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

    try {
      window.parent.postMessage(message, '*');
    }
    catch (error) {
      // When the connection to the SFS fails, and the conduit is destroyed,
      // there is still a message that is attempted to be sent to the parent.
      // In this case, the only way this "orphaned" iframe object can
      // communicate with the console is by throwing an error.  Therefore, it is
      // difficult to debug and I do not know what the final message is.  Having
      // the error written to the console here will still allow errors under
      // "normal" operations to be written to the console, but will suppress the
      // final unwanted error.
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  /**
   * @private
   *
   * To be called when a message has arrived in this Paho.MQTT.client
   *
   * The idea here is that when the server sends an mqtt message, whether a
   * moof, moov, or something else, that data needs to be sent to the appropriate
   * player (client).  So when this router gets that chunk of data, it sends it
   * back to the conduit with the clientId, and the conduit is then responsible
   * for passing it to the appropriate player.
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {Object} mqttMessage
   *   The incoming message
   *
   * @returns {void}
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
   *
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */
  Router.prototype._onConnectionLost = function (response) {
    this.logger.warn('MQTT connection lost!');

    var errorCode = parseInt(response.errorCode);

    if (errorCode === 0) {
      // The connection was "properly" terminated
      this._sendToParent({
        event: 'disconnect_success',
      });

      return;
    }

    this._sendToParent({
      event: 'connection_lost',
      reason: 'connection lost error code "' + errorCode + '" with message: ' + response.errorMessage,
    });
  };

  /**
   * @private
   *
   * Any time a "message" event occurs on the window respond to it by inspecting
   * the messages "method" property and taking the appropriate action.
   *
   * @param {Object} event
   *   The window message event
   *
   * @returns {void}
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
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */
  Router.prototype._connect_onSuccess = function (response) {
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
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */
  Router.prototype._connect_onFailure = function (response) {
    this.logger.info('MQTT Connection Failure!');
    this._sendToParent({
      event: 'connect_failure',
      reason: 'Connection Failed - Error code ' + parseInt(response.errorCode) + ': ' + response.errorMessage,
    });
  };

  /**
   * @private
   *
   * Success handler for "subscribe".
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {String} topic
   *   The topic that was successfully subscribed to
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */
  Router.prototype._subscribe_onSuccess = function (topic, response) {
    this.logger.debug('Successfully subscribed to topic "' + topic + '"');
    // @todo
  };

  /**
   * @private
   *
   * Failure handler for "subscribe".  Sends a "fail" message to the parent
   * window
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {String} topic
   *   The topic that was attempted to be subscribed to
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */
  Router.prototype._subscribe_onFailure = function (topic, response) {
    this.logger.error('Failed to subscribe to topic "' + topic + '"');

    this._sendToParent({
      event: 'subscribe_failure',
      reason: 'Subscribe Failed - Error code ' + parseInt(response.errorCode) + ': ' + response.errorMessage,
    });
  };

  /**
   * @private
   *
   * Start receiving messages for the given topic
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {String} topic
   *   The topic to subscribe to
   *
   * @returns {void}
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
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {String} topic
   *   The topic that was successfully unsubscribed from
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */
  Router.prototype._unsubscribe_onSuccess = function (topic, response) {
    this.logger.debug('Successfully unsubscribed from topic "' + topic + '"');
    // @todo
  };

  /**
   * @private
   *
   * Failure handler for "unsubscribe".  Sends a "fail" message to the parent
   * window
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {String} topic
   *   The topic that was successfully subscribed to
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */
  Router.prototype._unsubscribe_onFailure = function (topic, response) {
    this.logger.debug('Failed to unsubscribe from topic "' + topic + '"');

    this._sendToParent({
      event: 'unsubscribe_failure',
      reason: 'Unsubscribe Failed - Error code ' + parseInt(response.errorCode) + ': ' + response.errorMessage,
    });
  };

  /**
   * @private
   *
   * Stop receiving messages for the given topic
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {String} topic
   *   The topic to unsubscribe from
   *
   * @returns {void}
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
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Message.html
   *
   * @param {String|ArrayBuffer} payload
   *   The message data to be sent
   * @param {String} topic
   *   The topic to publish to
   *
   * @returns {void}
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
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Message.html
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @returns {void}
   */
  Router.prototype.connect = function () {
    this.logger.info('Connecting...');

    // last will message sent on disconnect
    var willMessage = new Paho.MQTT.Message(JSON.stringify({
      clientId: this.clientId,
    }));

    willMessage.destinationName = this.willMessageRoute;

    var connectionOptions = {
      timeout: this.connectionTimeout,
      onSuccess: this._connect_onSuccess.bind(this),
      onFailure: this._connect_onFailure.bind(this),
      willMessage: willMessage,
      // @todo - should `reconnect` be set here?
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
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @returns {void}
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
          window.mqttRouterConfig.willMessageRoute,
          window.mqttRouterConfig.host,
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

      // @todo - do we need destroy logic?  or does the destruction of the
      // iframe handle all dereferences for us?
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
