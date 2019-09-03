'use strict';

/**
 * Creates a hidden iframe that is used to establish a dedicated mqtt websocket
 * for a connection to a single mqtt host (or, more commonly, a single video).
 * This is basically an in-browser micro service which uses cross-document
 * communication to route data to and from the iframe.
 *
 * This code is a layer of abstraction on top of the mqtt router, and the
 * controller of the iframe that contains the router.
 *
 * Note that when connected to an mqtt host, the Router can request more than
 * one stream.
 */

import uuidv4 from 'uuid/v4';

import ActiveStream from './ActiveStream';
import Router from './Router';
import Logger from '../../utils/logger';

const MAX_RECONNECTION_ATTEMPTS = 200;

export default class Conduit {
  static factory (host, port, useSSL) {
    return new Conduit(host, port, useSSL);
  }

  /**
   * @private
   */
  constructor (host, port, useSSL) {
    // This MUST be globally unique!  The MQTT server will broadcast the stream
    // to a topic that contains this id, so if there is ANY other client
    // connected that has the same id anywhere in the world, the stream to all
    // clients that use that topic will fail.  This is why we use uuids rather
    // than an incrementing integer.
    this.clientId = uuidv4();

    // The internal logger
    this.logger = Logger().factory(`Conduit ${this.clientId}`);
    this.logger.debug('Constructing...');

    this.host = host;
    this.port = port;
    this.useSSL = useSSL;

    // A stats tracker that can be sent back to the server
    this.statsMsg = {
      byteCount: 0,
      inkbps: 0,
      host: document.location.host,
      clientId: this.clientId,
    };

    // Most topics are event based.  This object will contain one handler
    // function per topic.
    // @todo - handlers probably aren't necessary - each caller of a particular
    // event coudl provide their own single-use callback, which means that in
    // most places where these topicHandlers are used, a promise could be used
    // instead!
    this.topicHandlers = {};

    // Tracks the number of connection attempts to ensure that the limit is
    // not exceeded.
    this.reconnectionAttempts = 0;

    // Internal state representing whether or not a connection to the mqtt
    // host has been made and is still alive.
    this.connected = false;
  }

  /**
   * @private
   *
   * When the Router needs to transmit information, it can only communicate
   * through the iframe via a window message.  This is the listener for that
   * window message.
   *
   * @param {Object} event
   *   We expect event to have "data.event", which represents the event that
   *   occurred relative to the clsp stream.  "ready" means the stream is ready,
   *   "fail" means there was an error, "data" means a video segment / moof was
   *   sent.
   */
  _onRouterMessage = (event) => {
    const clientId = event.data.clientId;
    const eventType = event.data.event;

    if (this.destroyed) {
      // console.log(`Destroyed Conduit ${this.clientId} is still listening for messages!`);
    }

    if (!clientId) {
      // A window message was received that is not related to CLSP
      return;
    }

    // this.logger.debug('window on message');

    // Do not throw an error on disconnection
    if (eventType === 'disconnect_success') {
      this.logger.debug(`Disconnection event message for Conduit ${this.clientId}`);
      return;
    }

    // When the mqtt connection is interupted due to a listener being removed,
    // a fail event is always sent.  It is not necessary to log this as an error
    // in the console, because it is not an error.
    // @todo - the fail event no longer exists - what is the name of the new
    // corresponding event?
    if (eventType === 'fail') {
      return;
    }

    // If the document is hidden, don't execute the onRouterMessage handler.
    // If the handler is executed, the conduit will continue to
    // request/receive data from the server, which will eventually result in
    // unconstrained resource utilization, and ultimately a browser crash
    if (document.hidden) {
      return;
    }

    this.logger.debug(`Message received for "${eventType}" event`);

    switch (eventType) {
      case 'mqtt_data': {
        this._onMqttData(event.data);
        break;
      }
      case 'connection_lost': {
        this.disconnect();
        this._reconnect();
        break;
      }
      case 'window_message_fail': {
        // @todo - do we really need to disconnect?
        this.disconnect();
        break;
      }
      case 'connect_success': {
        // @todo - Do some changeSrc stuff here...
        break;
      }
      case 'router_created':
      case 'disconnect_success': {
        break;
      }
      default: {
        this.logger.error(`No match for event: ${eventType}`);
      }
    }
  };

  /**
   * After constructing, call this to initialize the conduit, which will create
   * the iframe and the Router needed to get the stream from the server.
   *
   * @returns Promise
   *   Resolves when the Router has been successfully created.
   *   Rejects upon failure to create the Router.
   */
  initialize (videoElementParent) {
    this.logger.debug('Initializing...');

    return new Promise((resolve, reject) => {
      this._onRouterCreate = (event) => {
        const clientId = event.data.clientId;

        // A window message was received that is not related to CLSP
        if (!clientId) {
          return;
        }

        // This message was intended for another conduit
        if (this.clientId !== clientId) {
          return;
        }

        const eventType = event.data.event;

        // Filter out any window messages that are not related to router
        // creation
        if (eventType !== 'router_created' && eventType !== 'router_create_failure') {
          return;
        }

        this.logger.debug(`Message received for "${eventType}" event`);

        // Whether success or failure, remove the event listener
        window.removeEventListener('message', this._onRouterCreate);
        this._onRouterCreate = null;

        if (eventType === 'router_create_failure') {
          return reject(new Error(event.data.reason));
        }

        // Now that we are sure that the Router was created successfully, we
        // will set up a listener for all further Router communication
        window.addEventListener('message', this._onRouterMessage);

        resolve(this);
      };

      // When the Router in the iframe connects, it will broadcast a message
      // letting us know it connected, or letting us know it failed.
      window.addEventListener('message', this._onRouterCreate);

      this.iframe = this._generateIframe();

      videoElementParent.appendChild(this.iframe);
    });
  }

  /**
   * To be called when a segment / moof is "shown".  In realistic terms, this is
   * meant to be called when the moof is appended to the MSE SourceBuffer.  This
   * method is meant to update stats.
   *
   * @param {Array} byteArray
   *   The raw segment / moof
   */
  segmentUsed (byteArray) {
    // @todo - it appears that this is never used!
    if ((this.LogSourceBuffer === true) && (this.LogSourceBufferTopic !== null)) {
      this.directSend({
        method: 'send',
        topic: this.LogSourceBufferTopic,
        byteArray,
      });
    }

    this.statsMsg.byteCount += byteArray.length;
  }

  /**
   * @private
   *
   * Send stats to the server for the purpose of ensuring the server does not
   * disconnect us for "inactivity".
   *
   * @returns {void}
   */
  _publishStats () {
    this.statsMsg.inkbps = (this.statsMsg.byteCount * 8) / 30000.0;
    this.statsMsg.byteCount = 0;

    this.logger.debug('iov status', this.statsMsg);

    this.publish(ActiveStream.STATS_TOPIC, this.statsMsg);
  }

  /**
   * @private
   *
   * Send stats to the server.  The mse service will stop streaming to us if we
   * don't send a stats message within 1 minute.
   *
   * @todo - 1 minute after connection? after last communication?
   *
   * @see - https: //en.wikipedia.org/wiki/Heartbeat_(computing)
   *
   * @returns {void}
   */
  _registerHeartbeat () {
    this._statsTimer = setInterval(() => {
      this._publishStats();
    }, 5000);
  }

  /**
   * After initialization, call this to establish the connection to the server.
   *
   * Note that this is called within the play method, so you shouldn't ever need
   * to manually call `connect`.
   *
   * @returns Promise
   *   Resolves when the connection is successfully established.
   *   Rejects upon failure to connect after the configured max number of
   *     retries.
   */
  connect () {
    this.logger.debug('Connecting to MQTT server...');

    return new Promise((resolve, reject) => {
      // Don't attempt to connect if we're already connected.
      // Also, paho mqtt doesn't handle this gracefully.
      if (this.connected) {
        return resolve(this);
      }

      this._onConnect = (event) => {
        const clientId = event.data.clientId;

        // A window message was received that is not related to CLSP
        if (!clientId) {
          return;
        }

        // This message was intended for another conduit
        if (this.clientId !== clientId) {
          return;
        }

        const eventType = event.data.event;

        // Filter out any window messages not related to router connection
        if (eventType !== 'connect_success' && eventType !== 'connect_failure') {
          return;
        }

        this.logger.debug(`Message received for "${eventType}" event`);

        // Whether success or failure, remove the event listener
        window.removeEventListener('message', this._onConnect);
        this._onConnect = null;

        if (eventType === 'connect_failure') {
          this.logger.error(new Error(event.data.reason));

          return this._reconnect()
            .then(resolve)
            .catch(reject);
        }

        this._registerHeartbeat();

        this.connected = true;

        resolve();
      };

      window.addEventListener('message', this._onConnect);

      this._command({ method: 'connect' });
    });
  }

  /**
   * Disconnect from the mqtt server
   *
   * @todo - return a promise that resolves when the disconnection is complete
   */
  disconnect () {
    this.logger.debug('Disconnecting...');

    this.connected = false;

    // when a stream fails, it no longer needs to send stats to the
    // server, and it may not even be connected to the server
    clearInterval(this._statsTimer);

    this._command({ method: 'disconnect' });
  }

  /**
   * @private
   *
   * Every time a segment / moof is received from the server, it should be
   * passed to this method
   *
   * @param {*} message
   */
  _onMqttData (message) {
    const topic = message.destinationName;

    this.logger.debug(`Handling message for topic "${topic}"`);

    if (!topic) {
      throw new Error('Message contained no topic to handle!');
    }

    const topicHandler = this.topicHandlers[topic];

    if (!topicHandler) {
      throw new Error(`No handler for ${topic}`);
    }

    topicHandler(message);
  }

  /**
   * @todo - provide method description
   *
   * @todo - return a Promise
   *
   * @param {String} topic
   *   The topic to subscribe to
   * @param {Conduit-subscribeCb} cb
   *   The callback for the subscribe operation
   */
  subscribe (topic, handler) {
    this.logger.debug(`Subscribing to topic "${topic}"`);

    this.topicHandlers[topic] = handler;

    this._command({
      method: 'subscribe',
      topic,
    });
  }

  /**
   * @todo - provide method description
   *
   * @todo - return a Promise
   *
   * @param {String} topic
   *   The topic to unsubscribe from
   */
  unsubscribe (topic) {
    this.logger.debug(`Unsubscribing from topic "${topic}"`);

    delete this.topicHandlers[topic];

    this._command({
      method: 'unsubscribe',
      topic,
    });
  }

  /**
   * Publish to a topic on the server.
   *
   * @todo - return a Promise
   *
   * @param {String} topic
   *   The topic to publish to
   * @param {Object} data
   *   The data to publish
   */
  publish (topic, data) {
    this.logger.debug(`Publishing to topic "${topic}"`);

    this._command({
      method: 'publish',
      topic,
      data,
    });
  }

  /**
   * Listen to a topic for a one-time response from the server.
   *
   * @param {String} topic
   *   The topic that the server will be publishing to
   */
  serverInitiatedTransaction (topic) {
    return new Promise((resolve, reject) => {
      // Set up the listener for when the server responds
      this.subscribe(topic, (response) => {
        // Since this is a one time response from the server, unsubscribe
        // immediately
        this.unsubscribe(topic);

        // @todo - what is the reject condition?  maybe a timeout that gets set
        // up after the publish?
        resolve(response);
      });
    });
  }

  /**
   * Publish to a topic with a one-time response from the server.
   *
   * @param {String} topic
   *   The topic to perform a transaction on
   * @param {Object} messageData
   *   The data to be published
   */
  async clientInitiatedTransaction (topic, messageData = {}) {
    this.logger.debug('transaction...');

    // The topic that we instruct the server to publish its response to our
    // topic request on.
    // Do our due diligence in creating a topic that cannot be guessed so that
    // we are the only ones who receive it!
    // @todo - can we use uuid here instead of Math.random?
    const responseTopic = `${this.clientId}/response/${parseInt(Math.random() * 1000000)}`;

    const serverInitiatedTransaction = this.serverInitiatedTransaction(responseTopic);

    // Now that we have set up our listener, we can publish to the topic on
    // the server
    this.publish(topic, {
      ...messageData,
      resp_topic: responseTopic,
    });

    const response = await serverInitiatedTransaction;

    return JSON.parse(response.payloadString);
  }

  /**
   * @todo - provide method description
   *
   * @todo - return a Promise
   *
   * @param {String} topic
   *   The topic to send to
   * @param {Array} byteArray
   *   The raw data to send
   */
  directSend (topic, byteArray) {
    this.logger.debug('directSend...');

    this._command({
      method: 'send',
      topic,
      byteArray,
    });
  }

  /**
   * @private
   *
   * Generate an iframe with an embedded mqtt router.  The router will be what
   * this Conduit instance communicates with in subsequent commands.
   *
   * @returns Element
   */
  _generateIframe () {
    this.logger.debug('Generating Iframe...');

    const iframe = document.createElement('iframe');

    iframe.setAttribute('id', this.clientId);

    // This iframe should be invisible
    iframe.width = 0;
    iframe.height = 0;
    iframe.setAttribute('style', 'display:none;');

    iframe.srcdoc = `
      <html>
        <head>
          <script type="text/javascript">
            // Include the logger
            window.Logger = ${Logger.toString()};

            // Configure the CLSP properties
            window.mqttRouterConfig = {
              clientId: '${this.clientId}',
              willMessageTopic: '${ActiveStream.WILL_MESSAGE_TOPIC}',
              useSSL: ${this.useSSL},
              host: '${this.host}',
              port: ${this.port},
            };

            window.iframeEventHandlers = ${Router.toString()}();
          </script>
        </head>
        <body
          onload="window.iframeEventHandlers.onload();"
          onunload="window.iframeEventHandlers.onunload();"
        >
          <div id="message"></div>
        </body>
      </html>
    `;

    return iframe;
  }

  /**
   * Attempt to reconnect a certain number of times
   *
   * @returns Promise
   *   Resolves when the connection is successfully established
   *   Rejects when the connection fails
   */
  async _reconnect () {
    this.reconnectionAttempts++;

    if (this.reconnectionAttempts > MAX_RECONNECTION_ATTEMPTS) {
      throw new Error(`Failed to reconnect after ${this.reconnectionAttempts} attempts.`);
    }

    try {
      await this.connect();

      this.reconnectionAttempts = 0;

      return this;
    }
    catch (error) {
      this.logger.error(error);
      return this._reconnect();
    }
  }

  /**
   * @private
   *
   * Pass an mqtt command to the iframe.
   *
   * @param {Object} message
   */
  _command (message) {
    this.logger.debug('Sending a message to the iframe...');

    try {
      // @todo - we should not be dispatching to '*' - we should provide the SFS
      // host here instead
      // @see - https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
      this.iframe.contentWindow.postMessage(message, '*');
    }
    catch (error) {
      // @todo - we should probably throw here...
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  /**
   * Clean up and dereference the necessary properties.  Will also disconnect
   * and destroy the iframe.
   *
   * @todo - return a Promise, but do not wait for the promise to resolve to
   * continue the destroy logic.  the promise should resolve/reject based on
   * the disconnect method call
   *
   * @returns {void}
   */
  destroy () {
    this.logger.debug('Destroying...');

    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    clearInterval(this._statsTimer);

    window.removeEventListener('message', this._onRouterMessage);

    if (this._onConnect) {
      window.removeEventListener('message', this._onConnect);
      this._onConnect = null;
    }

    if (this._onRouterCreate) {
      window.removeEventListener('message', this._onRouterCreate);
      this._onRouterCreate = null;
    }

    this.disconnect();

    this.clientId = null;

    // Destroy iframe
    this.iframe.parentNode.removeChild(this.iframe);
    // this.iframe.remove();
    this.iframe.srcdoc = '';
    this.iframe = null;

    this.topicHandlers = null;
    this.reconnectionAttempts = null;

    this.host = null;
    this.port = null;
    this.useSSL = null;
  }
}
