'use strict';

/**
 * Creates a hidden iframe that is used to establish a dedicated mqtt websocket
 * for a single video. This is basically an in-browser micro service which
 * uses cross-document communication to route data to and from the iframe.
 *
 * This code is a layer of abstraction on top of the mqtt router, and the
 * controller of the iframe that contains the router.
 */

import Router from './Router';
import Logger from '../utils/logger';

export default class Conduit {
  static factory (clientId, {
    wsbroker,
    wsport,
    useSSL,
    b64_jwt_access_url,
    jwt,
  }) {
    return new Conduit(clientId, {
      wsbroker,
      wsport,
      useSSL,
      b64_jwt_access_url,
      jwt,
    });
  }

  /**
   * @private
   */
  constructor (clientId, {
    wsbroker,
    wsport,
    useSSL,
    b64_jwt_access_url,
    jwt,
  }) {
    this.clientId = clientId;

    this.logger = Logger().factory(`Conduit ${this.clientId}`);
    this.logger.debug('Constructing...');

    this.wsbroker = wsbroker;
    this.wsport = wsport;
    this.useSSL = useSSL;
    this.b64_jwt_access_url = b64_jwt_access_url;
    this.jwt = jwt;

    this.statsMsg = {
      byteCount: 0,
      inkbps: 0,
      host: document.location.host,
      clientId: this.clientId,
    };

    this.handlers = {};

    this.reconnectionAttempts = 0;

    this.connected = false;
  }

  /**
   * @returns Promise
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

        // Filter out all other window messages
        if (eventType !== 'router_created' && eventType !== 'router_create_failure') {
          return;
        }

        this.logger.debug(`Message received for "${eventType}" event`);

        // Whether success or failure, remove the event listener
        window.removeEventListener('message', this._onRouterCreate);
        this._onRouterCreate = null;

        if (eventType === 'router_create_failure') {
          return reject(event.data.reason);
        }

        resolve();
      };

      window.addEventListener('message', this._onRouterCreate);

      this.iframe = this._generateIframe();

      videoElementParent.appendChild(this.iframe);
    });
  }

  /**
   * @returns Promise
   */
  connect () {
    this.logger.debug('Connecting to MQTT server...');

    return new Promise((resolve, reject) => {
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

        // Filter out all other window messages
        if (eventType !== 'connect_success' && eventType !== 'connect_failure') {
          return;
        }

        this.logger.debug(`Message received for "${eventType}" event`);

        // Whether success or failure, remove the event listener
        window.removeEventListener('message', this._onConnect);
        this._onConnect = null;

        if (eventType === 'connect_failure') {
          this.logger.error(new Error(event.data.reason));

          this._reconnect()
            .then(resolve)
            .catch(reject);

          return;
        }

        // the mse service will stop streaming to us if we don't send
        // a message to iov/stats within 1 minute.
        this._statsTimer = setInterval(() => {
          this._publishStats();
        }, 5000);

        this.connected = true;

        resolve();
      };

      window.addEventListener('message', this._onConnect);

      this._command({
        method: 'connect',
      });
    });
  }

  /**
   * Called many times, each time a moof (segment) is received
   *
   * @callback Conduit-onMoof
   * @param {any} moof - a stream segment
   */

  /**
   * If the JWT is valid or if we are not using a JWT, perform the necessary
   * conduit operations to retrieve stream segments (moofs).  The actual
   * "playing" occurs in the player, since it involves taking those received
   * stream segments and using MSE to display them.
   *
   * @param {string} streamName - the name of the stream to get segments for
   * @param {Conduit-onMoof} onMoof - the function that will handle the moof
   */
  async play (streamName, onMoof) {
    await this.connect();

    if (this.jwt.length > 0) {
      // start transaction, decrypt token
      const response = await this.validateJwt();

      if (response.status !== 200) {
        if (response.status === 403) {
          throw new Error('JwtUnAuthorized');
        }

        throw new Error('JwtInvalid');
      }

      //TODO, figure out how to handle a change in the sfs url from the
      // clsp-jwt from the target url returned from decrypting the jwt
      // token.
      // Example:
      //    user enters 'clsp-jwt://sfs1/jwt?Start=0&End=...' for source
      //    clspUrl = 'clsp://SFS2/streamOnDifferentSfs
      // --- due to the videojs architecture i don't see a clean way of doing this.
      // ==============================================================================
      //    The only way I can see doing this cleanly is to change videojs itself to
      //    allow the 'canHandleSource' function in MqttSourceHandler to return a
      //    promise not a value, then ascychronously find out if it can play this
      //    source after making the call to decrypt the jwt token.22
      // =============================================================================
      // Note: this could go away in architecture 2.0 if MQTT was a cluster in this
      // case what is now the sfs ip address in clsp url will always be the same it will
      // be the public ip of cluster gateway.
      const t = response.target_url.split('/');

      // get the actual stream name
      streamName = t[t.length - 1];
    }

    return new Promise((resolve, reject) => {
      try {
        this.requestStream(streamName, ({
          mimeCodec,
          guid,
        }) => {
          this.guid = guid;

          const initSegmentTopic = `${this.clientId}/init-segment/${parseInt(Math.random() * 1000000)}`;

          // Set up the listener for the stream init
          this.subscribe(initSegmentTopic, async ({
            payloadBytes,
          }) => {
            const moov = payloadBytes;

            this.unsubscribe(initSegmentTopic);

            const newTopic = `iov/video/${guid}/live`;

            // Set up the listener for the stream itself
            this.subscribe(newTopic, (mqttMessage) => {
              if (onMoof) {
                onMoof(mqttMessage);
              }
            });

            resolve({
              guid,
              mimeCodec,
              moov,
            });
          });

          // Ask the server for the stream
          this.publish(`iov/video/${this.guid}/play`, {
            initSegmentTopic,
            clientId: this.clientId,
            jwt: this.jwt,
          });
        });
      }
      catch (error) {
        reject(error);
      }
    });
  }

  disconnect () {
    this.logger.debug('Disconnecting...');

    this.connected = false;

    // when a stream fails, it no longer needs to send stats to the
    // server, and it may not even be connected to the server
    clearInterval(this._statsTimer);

    this._command({
      method: 'disconnect',
    });
  }

  stop () {
    this.logger.debug('Stopping stream...');

    if (!this.guid) {
      this.logger.warn('No guid, so not stopping stream...');
      return;
    }

    // Stop listening for moofs
    this.unsubscribe(`iov/video/${this.guid}/live`);

    // Stop listening for resync events
    this.unsubscribe(`iov/video/${this.guid}/resync`);

    // Tell the server we've stopped
    this.publish(`iov/video/${this.guid}/stop`, {
      clientId: this.clientId,
    });

    this.disconnect();
  }

  /**
   * Validate the jwt that this conduit was constructed with.
   */
  validateJwt () {
    this.logger.debug('Validating JWT...');

    return new Promise((resolve, reject) => {
      try {
        this.transaction(
          'iov/jwtValidate',
          {
            b64_access_url: this.b64_jwt_access_url,
            token: this.jwt,
          },
          (response) => {
            //response ->  {"status": 200, "target_url": "clsp://sfs1/fakestream", "error": null}
            resolve(response);
          }
        );
      }
      catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get the `guid` and `mimeCodec` for the stream
   *
   * @todo - should this be renamed "play"?
   *
   * @param {string} streamName - the name of the stream
   * @param {Conduit-requestStreamCallback} cb
   *
   * @returns {void}
   */
  requestStream (streamName, cb) {
    this.logger.debug('Requesting Stream...');

    this.transaction(
      `iov/video/${window.btoa(streamName)}/request`,
      {
        clientId: this.clientId,
      },
      cb
    );
  }

  resyncStream (cb) {
    // subscribe to a sync topic that will be called if the stream that is feeding
    // the mse service dies and has to be restarted that this player should restart the stream
    this.subscribe(`iov/video/${this.guid}/resync`, cb);
  }

  /**
   * @callback Conduit-getStreamListCallback
   * @param {any} - the list of available CLSP streams on the SFS
   */

  /**
   * Get the list of available CLSP streams from the SFS
   *
   * @param {Conduit-getStreamListCallback} cb
   *
   * @returns {void}
   */
  getStreamList (cb) {
    this.logger.debug('Getting Stream List...');

    this.transaction(
      'iov/video/list', {},
      cb
    );
  }

  /**
   * Clean up and dereference the necessary properties.  Will also disconnect
   * and destroy the iframe.
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
    this.wsbroker = null;
    this.wsport = null;
    this.useSSL = null;
    this.b64_jwt_access_url = null;
    this.jwt = null;

    // Destroy iframe
    this.iframe.parentNode.removeChild(this.iframe);
    // this.iframe.remove();
    this.iframe.srcdoc = '';
    this.iframe = null;

    this.handlers = null;
    this.reconnectionAttempts = null;
  }

  /**
   * Handler for an iframe window message.
   *
   * @param {Object} event
   *   We expect event to have "data.event", which represents the event that
   *   occurred relative to the clsp stream.  "ready" means the stream is ready,
   *   "fail" means there was an error, "data" means a video segment / moof was
   *   sent.
   */
  onMessage (event) {
    const eventType = event.data.event;

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
      case 'router_created':
      case 'connect_success':
      case 'disconnect_success': {
        break;
      }
      default: {
        this.logger.error(`No match for event: ${eventType}`);
      }
    }
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

    const handler = this.handlers[topic];

    if (!handler) {
      throw new Error(`No handler for ${topic}`);
    }

    handler(message);
  }

  subscribe (topic, handler) {
    this.logger.debug(`Subscribing to topic "${topic}"`);

    this.handlers[topic] = handler;

    this._command({
      method: 'subscribe',
      topic,
    });
  }

  unsubscribe (topic) {
    this.logger.debug(`Unsubscribing from topic "${topic}"`);

    delete this.handlers[topic];

    this._command({
      method: 'unsubscribe',
      topic,
    });
  }

  publish (topic, data) {
    this.logger.debug(`Publishing to topic "${topic}"`);

    this._command({
      method: 'publish',
      topic,
      data,
    });
  }

  directSend (topic, byteArray) {
    this.logger.debug('directSend...');

    this._command({
      method: 'send',
      topic,
      byteArray,
    });
  }

  transaction (
    topic,
    messageData = {},
    onSubscribe = () => {}
  ) {
    this.logger.debug('transaction...');

    messageData.resp_topic = `${this.clientId}/response/${parseInt(Math.random() * 1000000)}`;

    this.subscribe(messageData.resp_topic, (response) => {
      onSubscribe(JSON.parse(response.payloadString));

      this.unsubscribe(messageData.resp_topic);
    });

    this.publish(topic, messageData);
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
              ip: '${this.wsbroker}',
              port: ${this.wsport},
              useSSL: ${this.useSSL},
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

  async _reconnect () {
    this.reconnectionAttempts++;

    if (this.reconnectionAttempts > 20) {
      throw new Error(`Failed to reconnect after ${this.reconnectionAttempts} attempts.`);
    }

    try {
      await this.connect();

      this.reconnectionAttempts = 0;
    }
    catch (error) {
      this.logger.error(error);
      this._reconnect();
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
   * @private
   *
   * Send stats to the server
   */
  _publishStats () {
    this.statsMsg.inkbps = (this.statsMsg.byteCount * 8) / 30000.0;
    this.statsMsg.byteCount = 0;

    this.publish('iov/stats', this.statsMsg);

    this.logger.debug('iov status', this.statsMsg);
  }
}
