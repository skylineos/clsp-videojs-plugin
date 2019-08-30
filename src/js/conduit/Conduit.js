'use strict';

/**
 * Creates a hidden iframe that is used to establish a dedicated mqtt websocket
 * for a single video. This is basically an in-browser micro service which
 * uses cross-document communication to route data to and from the iframe.
 *
 * This code is a layer of abstraction on top of the mqtt router, and the
 * controller of the iframe that contains the router.
 */

// @todo - why doesn't this work?
// import noop from 'lodash/noop';

import ActiveStreams from './ActiveStreams';
import Router from './Router';
import Logger from '../utils/logger';

const MAX_RECONNECTION_ATTEMPTS = 200;

const noop = () => {};

export default class Conduit {
  static factory (
    clientId,
    iovId,
    source,
  ) {
    return new Conduit(
      clientId,
      iovId,
      source,
    );
  }

  /**
   * @private
   *
   * clientId - the uuid to be used to construct the topic
   * iovId - the ID of the parent iov, used for logging purposes
   */
  constructor (
    clientId,
    iovId,
    source,
  ) {
    this.clientId = clientId;
    this.iovId = iovId;

    this.logger = Logger().factory(`Conduit ${this.iovId}`);
    this.logger.debug('Constructing...');

    this.source = source;

    this.statsMsg = {
      byteCount: 0,
      inkbps: 0,
      host: document.location.host,
      clientId: this.clientId,
    };

    this.handlers = {};

    this.reconnectionAttempts = 0;

    this.connected = false;

    // When connected to an mqtt host, the Router can request more than one
    // stream.  This object will track of the currently active streams.
    this.activeStreams = ActiveStreams.factory();
    this.currentStream = null;
  }

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

      // When the Router in the iframe connects, it will broadcast a message
      // letting us know it connected, or letting us know it failed.
      window.addEventListener('message', this._onRouterCreate);

      this.iframe = this._generateIframe();

      console.log(`About to append iframe for iov ${this.iovId}`);
      videoElementParent.appendChild(this.iframe);
    });
  }

  /**
   * After initialization, call this to establish the connection to the server.
   *
   * Note that this is called within the play method, so you shouldn't ever need
   * to manually call `connect`.
   *
   * @returns Promise
   *   Resolves when the connection is successfully established.
   *   Rejects upon failure to connect after a number of retries.
   */
  connect () {
    this.logger.debug('Connecting to MQTT server...');

    return new Promise((resolve, reject) => {
      if (this.connected) {
        return resolve();
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
  async play (streamName, onMoov = noop, onMoof = noop, onChange = noop) {
    // This particular stream is already active
    if (this.activeStreams.hasByStreamName(streamName)) {
      console.log(`"${streamName} is already an active stream`)
      // @todo - should this throw?
      return;
    }

    // @todo - should we have a check to confirm that the conduit has been initialized?
    // @todo - should connect be called here?
    await this.connect();

    if (this.source.jwt.length > 0) {
      streamName = await this.validateJwt();
    }
    else if (this.source.hash.length > 0) {
      streamName = await this.validateHash();
    }

    const {
      error,
      guid,
      mimeCodec,
    } = await this.requestStream(streamName);

    if (error) {
      throw new Error(error);
    }

    const initSegmentTopic = `${this.clientId}/init-segment/${parseInt(Math.random() * 1000000)}`;

    return new Promise((resolve, reject) => {
      try {
        // Set up the listener for the stream init
        this.subscribe(initSegmentTopic, async ({
          payloadBytes,
        }) => {
          const moov = payloadBytes;
          const activeStream = this.activeStreams.add(
            streamName,
            guid,
            mimeCodec,
            moov
          );

          let previousStream = this.currentStream;
          this.currentStream = activeStream;

          this.unsubscribe(initSegmentTopic);

          // Set up the listener for the stream itself
          this.subscribe(`iov/video/${activeStream.guid}/live`, (mqttMessage) => {
            onMoof(activeStream, mqttMessage);

            if (previousStream) {
              let _previousStream = previousStream;
              previousStream = null;

              setTimeout(() => {

                // self.reinitializeMse();
                onChange(_previousStream, activeStream);
                this.unsubscribe(`iov/video/${_previousStream.guid}/live`);

                // destroy the _previousStream's iframe (only when there is a different host!)

                this.activeStreams.remove(_previousStream);
              }, 500);
            }
          });

          if (!previousStream) {
            onMoov(activeStream);
          }

          resolve(activeStream);
        });

        // Ask the server for the stream
        this.publish(`iov/video/${guid}/play`, {
          initSegmentTopic,
          clientId: this.clientId,
          jwt: this.source.jwt,
        });
      }
      catch (error) {
        reject(error);
      }
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

    this._command({
      method: 'disconnect',
    });
  }

  /**
   * Stop the playing stream
   *
   * @todo - make this async and await the disconnection, and maybe even the
   * unsubscribes
   */
  stop (streamName) {
    console.log(`stopping ${streamName}...`)
    let activeStream;

    if (streamName) {
      activeStream = this.activeStreams.getByStreamName(streamName);

      if (!activeStream) {
        this.logger.warn('No active stream with name "${streamName}", so not stopping');
        return;
      }
    }

    if (!activeStream) {
      activeStream = this.activeStreams.first();

      if (!activeStream) {
        this.logger.warn('No active streams exist, so not stopping');
        return;
      }
    }
    console.log('stopping', activeStream)
    this.logger.debug(`Stopping stream for ${activeStream.guid}...`);

    // Stop listening for moofs
    this.unsubscribe(`iov/video/${activeStream.guid}/live`);

    // Stop listening for resync events
    this.unsubscribe(`iov/video/${activeStream.guid}/resync`);

    // Tell the server we've stopped
    this.publish(`iov/video/${activeStream.guid}/stop`, {
      clientId: this.clientId,
    });

    this.activeStreams.remove(activeStream);

    if (this.activeStreams.isEmpty()) {
      console.log('no active streams!')
      this.disconnect();
    }
  }

  /**
   * Validate the jwt that this conduit was constructed with.
   *
   * @returns Promise
   *   Resolves the streamName when the response is received AND is successful.
   *   Rejects if the transaction fails or if the response code is not 200.
   */
  validateJwt () {
    this.logger.debug('Validating JWT...');

    return new Promise((resolve, reject) => {
      try {
        this.transaction(
          'iov/jwtValidate',
          {
            b64_access_url: this.source.b64_jwt_access_url,
            token: this.source.jwt,
          },
          (response) => {
            // response ->  {"status": 200, "target_url": "clsp://sfs1/fakestream", "error": null}

            if (response.status !== 200) {
              if (response.status === 403) {
                return reject(new Error('JwtUnAuthorized'));
              }

              return reject(new Error('JwtInvalid'));
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
            const streamName = t[t.length - 1];

            resolve(streamName);
          }
        );
      }
      catch (error) {
        reject(error);
      }
    });
  }
  /**
   * Validate the hash that this conduit was constructed with.
   *
   * @returns Promise
   *   Resolves the streamName when the response is received AND is successful.
   *   Rejects if the transaction fails or if the response code is not 200.
   */
  validateHash () {
    this.logger.debug('Validating Hash...');

    return new Promise((resolve, reject) => {
      try {
        this.transaction(
          'iov/hashValidate',
          {
            b64HashURL: this.source.b64_hash_access_url,
            token: this.source.hash,
          },
          (response) => {
            // response ->  {"status": 200, "target_url": "clsp://sfs1/fakestream", "error": null}

            if (response.status !== 200) {
              if (response.status === 403) {
                return reject(new Error('HashUnAuthorized'));
              }

              return reject(new Error('HashInvalid'));
            }

            // TODO, figure out how to handle a change in the sfs url from the
            // clsp-hash from the target url returned from decrypting the hash
            // token.
            // Example:
            //    user enters 'clsp-hash://sfs1/hash?start=0&end=...&token=...' for source
            //    clspUrl = 'clsp://SFS2/streamOnDifferentSfs
            // --- due to the videojs architecture i don't see a clean way of doing this.
            // ==============================================================================
            //    The only way I can see doing this cleanly is to change videojs itself to
            //    allow the 'canHandleSource' function in MqttSourceHandler to return a
            //    promise not a value, then ascychronously find out if it can play this
            //    source after making the call to decrypt the hash token.22
            // =============================================================================
            // Note: this could go away in architecture 2.0 if MQTT was a cluster in this
            // case what is now the sfs ip address in clsp url will always be the same it will
            // be the public ip of cluster gateway.
            const t = response.target_url.split('/');

            // get the actual stream name
            const streamName = t[t.length - 1];

            resolve(streamName);
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
   * @todo - return a Promise
   *
   * @param {string} streamName - the name of the stream
   *
   * @returns {Promise}
   */
  requestStream (streamName) {
    this.logger.debug('Requesting Stream...');

    return new Promise((resolve, reject) => {
      this.transaction(
        `iov/video/${window.btoa(streamName)}/request`,
        {
          clientId: this.clientId,
        },
        ({
          error,
          guid,
          mimeCodec,
        }) => {
          resolve({
            error,
            guid,
            mimeCodec,
          });
        }
      );
    });
  }

  /**
   * @callback Conduit-resyncStreamCb
   * @param {any} - @todo - document this
   */

  /**
   * @todo - provide method description
   *
   * @todo - return a Promise
   *
   * @param {Conduit-resyncStreamCb} cb
   *   The callback for the resync operation
   */
  resyncStream (guid, cb) {
    let activeStream;

    if (guid) {
      activeStream = this.activeStreams.getByGuid(guid);

      if (!activeStream) {
        this.logger.warn('No active stream with guid "${guid}", so not resyncing');
        return;
      }
    }

    if (!activeStream) {
      activeStream = this.activeStreams.first();

      if (!activeStream) {
        this.logger.warn('No active streams exist, so not resyncing');
        return;
      }
    }

    // subscribe to a sync topic that will be called if the stream that is feeding
    // the mse service dies and has to be restarted that this player should restart the stream
    this.subscribe(`iov/video/${activeStream.guid}/resync`, cb);
  }

  /**
   * @callback Conduit-getStreamListCallback
   * @param {any} - the list of available CLSP streams on the SFS
   */

  /**
   * Get the list of available CLSP streams from the SFS
   *
   * @todo - return a Promise
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
    this.source = null;

    // Destroy iframe
    this.iframe.parentNode.removeChild(this.iframe);
    // this.iframe.remove();
    this.iframe.srcdoc = '';
    this.iframe = null;

    this.handlers = null;
    this.reconnectionAttempts = null;

    this.activeStreams.destroy();
    this.activeStreams = null;
    this.currentStream = null;
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

    this.handlers[topic] = handler;

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

    delete this.handlers[topic];

    this._command({
      method: 'unsubscribe',
      topic,
    });
  }

  /**
   * @todo - provide method description
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
   * @todo - provide method description
   *
   * @todo - return a Promise
   *
   * @param {String} topic
   *   The topic to perform a transaction on
   * @param {Object} messageData
   *   The data to be published
   * @param {Conduit-transactionCb} cb
   */
  transaction (
    topic,
    messageData = {},
    cb
  ) {
    this.logger.debug('transaction...');

    messageData.resp_topic = `${this.clientId}/response/${parseInt(Math.random() * 1000000)}`;

    this.subscribe(messageData.resp_topic, (response) => {
      if (cb) {
        cb(JSON.parse(response.payloadString));
      }

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
              iovId: '${this.iovId}',
              clientId: '${this.clientId}',
              useSSL: ${this.source.useSSL},
              host: '${this.source.host}',
              port: ${this.source.port},
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
