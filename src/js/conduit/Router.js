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
      this.ip = ip;
      this.port = port;
      this.useSSL = useSSL;

      var self = this;

      // @todo - it would be nice to be able to import this
      this.logger = {
        _format: function (logMessage) {
          return self.clientId + ': ' + logMessage;
        },
        debug: function (logMessage) {
          if (window.parent.skyline.clspPlugin.logLevel >= 4) {
            console.log(self.logger._format(logMessage));
          }
        },
        info: function (logMessage) {
          if (window.parent.skyline.clspPlugin.logLevel >= 3) {
            console.log(self.logger._format(logMessage));
          }
        },
        warn: function (logMessage) {
          if (window.parent.skyline.clspPlugin.logLevel >= 2) {
            console.warn(self.logger._format(logMessage));
          }
        },
        error: function (logMessage) {
          if (window.parent.skyline.clspPlugin.logLevel >= 1) {
            console.error(self.logger._format(logMessage));
          }
        },
      };

      this.logger.debug('Constructing router');

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
    }
    catch (e) {
      console.error('IFRAME error for clientId: ' + clientId);
      console.error(e);
    }
  }

  /**
   * @private
   *
   * Post a "message" with the current `clientId` to the parent window.
   */
  Router.prototype._sendToParent = function (message) {
    this.logger.debug('_sendToParent');

    if (typeof message !== 'object') {
      throw new Error('_sendToParent must be passed an object!');
    }

    message.clientId = this.clientId;

    switch (message.event) {
      case 'ready': {
        // no validation needed
        break;
      }
      case 'data': {
        if (!message.hasOwnProperty('destinationName') || !message.hasOwnProperty('payloadString') || !message.hasOwnProperty('payloadBytes')) {
          throw new Error('improperly formatted "data" message sent to _sendToParent');
        }
        break;
      }
      case 'fail': {
        if (!message.hasOwnProperty('reason')) {
          throw new Error('improperly formatted "fail" message sent to _sendToParent');
        }
        break;
      }
      default: {
        throw new Error(`Unknown event "${message.event}" sent to _sendToParent`);
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
    this.logger.debug('_onMessageArrived');
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
        event: 'data',
        destinationName: mqttMessage.destinationName,
        payloadString: payloadString, // @todo - why is this necessary when it doesn't exist?
        payloadBytes: mqttMessage.payloadBytes || null,
      });
    }
    catch (e) {
      console.error(e);
    }
  };

  /**
   * @private
   *
   * called when an mqttClient connection has been lost, or after a connect()
   * method has succeeded.
   *
   * If the connection termination was not "proper", attempt to reconnect.
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   */
  Router.prototype._onConnectionLost = function (responseObject) {
    this.logger.debug('_onConnectionLost');
    this.logger.info('_onConnectionLost');

    var errorCode = parseInt(responseObject.errorCode);

    if (errorCode === 0) {
      // The connection was "properly" terminated
      return;
    }

    this._sendToParent({
      event: 'fail',
      reason: 'connection lost error code ' + errorCode,
    });

    if (this.Reconnect) {
      // A reconnection attempt is already in progress
      return;
    }

    var self = this;

    this.Reconnect = setInterval(function () {
      self.logger.info('connect_retrying');
      self.connect();
      clearInterval(self.Reconnect);
      self.Reconnect = null;
    }, this.retryInterval);
  };

  /**
   * @private
   *
   * Any time a "message" event occurs on the window respond to it by inspecting
   * the messages "method" property and taking the appropriate action.
   */
  Router.prototype._windowMessageEventHandler = function (event) {
    this.logger.debug('_windowMessageEventHandler');
    var message = event.data;

    try {
      switch (message.method) {
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
            console.error('ERROR: Unable to handle the "publish" window message event!')
            console.error('json stringify error: ' + message.data);

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
          console.error('unknown message method: ' + message.method);
        }
      }
    }
    catch (e) {
      // we are dead!
      this._sendToParent({
        event: 'fail',
        reason: 'window message event failure',
      });

      this.disconnect();
    }
  };

  /**
   * @private
   *
   * Success handler for "connect".  Registers the window message event handler,
   * and notifies the parent window that this client is "ready".  All subsequent
   * reconnection attempts will be cancelled.
   *
   * @todo - track the "connected" status to prevent multiple window message
   * event handlers from being attached
   */
  Router.prototype._connect_onSuccess = function () {
    this.logger.debug('_connect_onSuccess');
    this.logger.info('_connect_onSuccess');

    // Remove any existing listeners
    window.removeEventListener('message', this.boundWindowMessageEventHandler);

    window.addEventListener(
      'message',
      this.boundWindowMessageEventHandler,
      false
    );

    this._sendToParent({
      event: 'ready',
    });

    if (this.Reconnect) {
      clearInterval(this.Reconnect);
      this.Reconnect = null;
    }
  };

  /**
   * @private
   *
   * Failure handler for "connect".  Sends a "fail" message to the parent
   * window
   */
  Router.prototype._connect_onFailure = function (message) {
    this.logger.debug('_connect_onFailure');
    this.logger.info('_connect_onFailure');
    this._sendToParent({
      event: 'fail',
      reason: 'Error code ' + parseInt(message.errorCode) + ': ' + message.errorMessage,
    });
  };

  /**
   * @private
   *
   * Success handler for "subscribe".
   */
  Router.prototype._subscribe_onSuccess = function (message) {
    this.logger.debug('_subscribe_onSuccess');
    // @todo
  };

  /**
   * @private
   *
   * Failure handler for "subscribe".  Sends a "fail" message to the parent
   * window
   */
  Router.prototype._subscribe_onFailure = function (message) {
    this.logger.debug('_subscribe_onFailure');
    this._sendToParent({
      event: 'fail',
      reason: 'subscribe failed',
    });
  };

  /**
   * @private
   *
   * Start receiving messages for the given topic
   */
  Router.prototype._subscribe = function (topic) {
    this.logger.debug('_subscribe');
    if (!topic) {
      throw new Error('topic is a required argument when subscribing');
    }

    this.mqttClient.subscribe(topic, {
      onSuccess: this._subscribe_onSuccess.bind(this),
      onFailure: this._subscribe_onFailure.bind(this),
    });
  };

  /**
   * @private
   *
   * Success handler for "unsubscribe".
   */
  Router.prototype._unsubscribe_onSuccess = function (message) {
    this.logger.debug('_unsubscribe_onSuccess');
    // @todo
  };

  /**
   * @private
   *
   * Failure handler for "unsubscribe".  Sends a "fail" message to the parent
   * window
   */
  Router.prototype._unsubscribe_onFailure = function (message) {
    this.logger.debug('_unsubscribe_onFailure');
    this._sendToParent({
      event: 'fail',
      reason: 'unsubscribe failed',
    });
  };

  /**
   * @private
   *
   * Stop receiving messages for the given topic
   */
  Router.prototype._unsubscribe = function (topic) {
    this.logger.debug('_unsubscribe');
    if (!topic) {
      throw new Error('topic is a required argument when unsubscribing');
    }

    this.mqttClient.unsubscribe(topic, {
      onSuccess: this._unsubscribe_onSuccess.bind(this),
      onFailure: this._unsubscribe_onFailure.bind(this),
    });
  };

  /**
   * @private
   *
   * Publish a message to the clients that are listening for the given topic
   */
  Router.prototype._publish = function (payload, topic) {
    this.logger.debug('_publish');
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
    this.logger.debug('connect');
    this.logger.info('connect');
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
      this.logger.info('connected');
    }
    catch (error) {
      if (error.message.startsWith(PAHO_MQTT_ERROR_CODE_ALREADY_CONNECTED)) {
        // if we're already connected, there's no error to report
        return;
      }

      console.error('connect failed', error);

      this._sendToParent({
        event: 'fail',
        reason: 'connect failed',
      });
    }
  };

  /**
   * Disconnect the messaging client from the server
   */
  Router.prototype.disconnect = function () {
    this.logger.debug('disconnect');
    try {
      this.mqttClient.disconnect();
    }
    catch (error) {
      if (error.message.startsWith(PAHO_MQTT_ERROR_CODE_NOT_CONNECTED)) {
        // if we're not connected when we attempted to disconnect, there's no
        // error to report
        return;
      }

      console.error('ERROR while disconnecting');
      console.error(error);

      throw error;
    }
  };

  // This is a series of "controllers" to keep the conduit's iframe as dumb as
  // possible.  Call each of these in the corresponding attribute on the
  // "body" tag.
  return {
    onload: function () {
      window.router = new Router(
        window.mqttRouterConfig.clientId,
        window.mqttRouterConfig.ip,
        window.mqttRouterConfig.port,
        window.mqttRouterConfig.useSSL,
      );

      window.router.logger.info('Router created in onload');

      window.router.connect();
    },
    onunload: function () {
      if (!window.router) {
        return;
      }

      try {
        window.router.logger.info('Router disconnecting in onunload...');
        window.router.disconnect();
        window.router.logger.info('Router disconnected in onunload');
      }
      catch (error) {
        if (error.message.startsWith(PAHO_MQTT_ERROR_CODE_NOT_CONNECTED)) {
          // if there wasn't a connection, do not show an error
          return;
        }

        console.error(error);
      }
    },
    ononline: function () {
      if (!window.router) {
        return;
      }

      window.router.logger.info('Router trying to connect in ononline...');
      window.router.connect();
    },
    onoffline: function () {
      if (!window.router) {
        return;
      }

      window.router.logger.info('Router trying to disconnect in onoffline...');
      window.router.disconnect();
    },
  };
}
