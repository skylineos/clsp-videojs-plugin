'use strict';

/**
 * The Conduit a hidden iframe that is used to establish a dedicated mqtt
 * websocket for a single video. This is basically an in-browser micro service
 * which uses cross-document communication to route data to and from the iframe.
 *
 * This code is a layer of abstraction on top of the mqtt router, and the
 * controller of the iframe that contains the router.
 */

import Router from './Router';
import Logger from '../utils/logger';
import StreamConfiguration from '../iov/StreamConfiguration';

const MAX_RECONNECTION_ATTEMPTS = 200;

export default class Conduit {
  static MOOV_TIMEOUT_DURATION = 30; // seconds
  static FIRST_MOOF_TIMEOUT_DURATION = 45; // seconds
  static PUBLISH_STATS_INTERVAL = 5; // seconds

  static iframeCommands = {
    SUBSCRIBE: 'subscribe',
    UNSUBSCRIBE: 'unsubscribe',
    PUBLISH: 'publish',
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    SEND: 'send',
  };

  static routerEvents = Router().Router.events;

  static factory (iovId, clientId, streamConfiguration, containerElement) {
    return new Conduit(iovId, clientId, streamConfiguration, containerElement);
  }

  /**
   * @private
   *
   * @param {String} iovId
   *   the ID of the parent iov, used ONLY for logging purposes
   * @param {String} clientId
   *   the guid to be used to construct the topic
   * @param {StreamConfiguration} streamConfiguration
   *   The stream configuration to pull from the CLSP server / SFS
   * @param {Element} containerElement
   *   The container of the video element and where the Conduit's iframe will be
   *   inserted
   */
  constructor (iovId, clientId, streamConfiguration, containerElement) {
    if (!iovId) {
      throw new Error('iovId is required to construct a new Conduit instance.');
    }

    if (!clientId) {
      throw new Error('clientId is required to construct a new Conduit instance.');
    }

    if (!StreamConfiguration.isStreamConfiguration(streamConfiguration)) {
      throw new Error('invalid streamConfiguration passed to Conduit constructor');
    }

    if (!containerElement) {
      throw new Error('containerElement is required to construct a new Conduit instance');
    }

    this.iovId = iovId;
    this.clientId = clientId;
    this.streamConfiguration = streamConfiguration;
    this.containerElement = containerElement;

    this.streamName = this.streamConfiguration.streamName;
    this.guid = null;

    this.logger = Logger().factory(`Conduit ${this.iovId}`);
    this.logger.debug('Constructing...');

    this.statsMsg = {
      byteCount: 0,
      inkbps: 0,
      host: document.location.host,
      clientId: this.clientId,
    };

    this.handlers = {};

    this.reconnectionAttempts = 0;

    this.connected = false;

    this.statsInterval = null;
    this.moovTimeout = null;
    this.firstMoofTimeout = null;

    this.moovRequestTopic = `${this.clientId}/init-segment/${parseInt(Math.random() * 1000000)}`;
  }

  /**
   * After constructing, call this to initialize the conduit, which will create
   * the iframe and the Router needed to get the stream from the server.
   *
   * @returns Promise
   *   Resolves when the Router has been successfully created.
   *   Rejects upon failure to create the Router.
   */
  initialize () {
    this.logger.debug('Initializing...');

    return new Promise((resolve, reject) => {
      this._onRouterCreate = (event) => {
        const clientId = event.data.clientId;

        // A window message was received that is not related to CLSP
        if (!clientId) {
          return;
        }

        // This message was intended for another Conduit instance
        if (this.clientId !== clientId) {
          return;
        }

        const eventType = event.data.event;

        // Filter out all other window messages from the Router
        if (eventType !== Conduit.routerEvents.CREATED && eventType !== Conduit.routerEvents.CREATE_FAILURE) {
          return;
        }

        this.logger.debug(`initialize "${eventType}" event`);

        // Whether success or failure, remove the event listener
        window.removeEventListener('message', this._onRouterCreate);

        // Once the event listener is removed, remove the listener handler,
        // since it will not be used again and to prevent the `destroy` method
        // from trying to unregister it.
        this._onRouterCreate = null;

        if (eventType === Conduit.routerEvents.CREATE_FAILURE) {
          return reject(event.data.reason);
        }

        resolve();
      };

      // When the Router in the iframe connects, it will broadcast a message
      // letting us know it connected, or letting us know it failed.
      window.addEventListener('message', this._onRouterCreate);

      this.iframe = this._generateIframe();

      // @todo - if the Iov were to create a wrapper around the video element
      // that it manages (rather than expecting one to already be there), each
      // video element and iframe could be contained in a single container,
      // rather than potentially having multiple video elements and multiple
      // iframes contained in a single parent.
      this.containerElement.appendChild(this.iframe);
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
        if (eventType !== Conduit.routerEvents.CONNECT_SUCCESS && eventType !== Conduit.routerEvents.CONNECT_FAILURE) {
          return;
        }

        this.logger.debug(`connect "${eventType}" event`);

        // Whether success or failure, remove the event listener
        window.removeEventListener('message', this._onConnect);
        this._onConnect = null;

        if (eventType === Conduit.routerEvents.CONNECT_FAILURE) {
          this.logger.error(new Error(event.data.reason));

          this._reconnect()
            .then(resolve)
            .catch(reject);

          return;
        }

        // the mse service will stop streaming to us if we don't send
        // a message to iov/stats within 1 minute.
        this.statsInterval = setInterval(() => {
          this.publishStats();
        }, Conduit.PUBLISH_STATS_INTERVAL * 1000);

        this.connected = true;

        this.logger.info('Connected');
        resolve();
      };

      window.addEventListener('message', this._onConnect);

      this._command({
        method: Conduit.iframeCommands.CONNECT,
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
   * @async
   *
   * @param {Conduit-onMoof} onMoof
   *   the function that will handle the moof
   *
   * @returns {Promise}
   *   * Resolves once the first moof has been received
   *   * Rejects if the moov or first moof time out
   */
  async play (onMoof) {
    this.logger.info('Playing...');

    // @todo - should we have a check to confirm that the conduit has been initialized?
    // @todo - should connect be called here?
    await this.connect();

    if (this.streamConfiguration.jwt && this.streamConfiguration.jwt.length > 0) {
      this.streamName = await this.validateJwt();
    }

    if (this.streamConfiguration.hash && this.streamConfiguration.hash.length > 0) {
      this.streamName = await this.validateHash();
    }

    this.logger.info('Play is requesting stream...');

    const {
      guid,
      mimeCodec,
    } = await this.requestStreamData();

    this.guid = guid;

    // Get the moov first
    const { moov } = await this.requestMoov();

    // Set up the listener for the moofs
    await this.requestMoofs(onMoof);

    return {
      guid,
      mimeCodec,
      moov,
    };
  }

  /**
   * Disconnect from the mqtt server
   *
   * @todo - return a promise that resolves when the disconnection is complete!
   */
  disconnect () {
    this.logger.debug('Disconnecting...');

    this.connected = false;

    // when a stream fails, it no longer needs to send stats to the
    // server, and it may not even be connected to the server
    this.clearStatsInterval();

    this._command({
      method: Conduit.iframeCommands.DISCONNECT,
    });
  }

  /**
   * Stop the playing stream
   *
   * @todo - make this async and await the disconnection, and maybe even the
   * unsubscribes
   */
  stop () {
    this.logger.debug('Stopping stream...');

    if (!this.guid) {
      this.logger.warn('No guid, so not stopping stream...');
      return Promise.resolve();
    }

    // Clear all timeouts
    this.clearMoovTimeout();
    this.clearFirstMoofTimeout();

    // Stop listening for the moov
    this.unsubscribe(this.moovRequestTopic);

    // Stop listening for moofs
    this.unsubscribe(`iov/video/${this.guid}/live`);

    // Stop listening for resync events
    this.unsubscribe(`iov/video/${this.guid}/resync`);

    // Tell the server we've stopped
    this.publish(`iov/video/${this.guid}/stop`, {
      clientId: this.clientId,
    });

    this.disconnect();

    return Promise.resolve();
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
            b64_access_url: this.streamConfiguration.b64_jwt_access_url,
            token: this.streamConfiguration.jwt,
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
            b64HashURL: this.streamConfiguration.b64_hash_access_url,
            token: this.streamConfiguration.hash,
          },
          (response) => {
            // response ->  {"status": 200, "target_url": "clsp://sfs1/fakestream", "error": null}

            if (response.status !== 200) {
              if (response.status === 403) {
                return reject(new Error('HashUnAuthorized'));
              }

              return reject(new Error('HashInvalid'));
            }

            //TODO, figure out how to handle a change in the sfs url from the
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
   * Get the `guid` and `mimeCodec` for the stream.  The guid serves as a stream
   * instance for a given camera or video feed, and is needed to make requests
   * for the stream instance.
   *
   * @returns {Promise}
   */
  requestStreamData () {
    this.logger.debug('Requesting Stream...');

    return new Promise((resolve, reject) => {
      this.transaction(
        `iov/video/${window.btoa(this.streamName)}/request`,
        {
          clientId: this.clientId,
        },
        ({
          mimeCodec,
          guid,
        }) => {
          // @todo - is it possible to do better error handling here?
          if (!mimeCodec) {
            return reject('Error while requesting stream: mimeCodec was not recevied!');
          }

          if (!guid) {
            return reject('Error while requesting stream: guid was not recevied!');
          }

          resolve({
            mimeCodec,
            guid,
          });
        }
      );
    });
  }

  clearStatsInterval () {
    if (this.statsInterval) {
      clearTimeout(this.statsInterval);
      this.statsInterval = null;
    }
  }

  clearMoovTimeout () {
    if (this.moovTimeout) {
      clearTimeout(this.moovTimeout);
      this.moovTimeout = null;
    }
  }

  clearFirstMoofTimeout () {
    if (this.firstMoofTimeout) {
      clearTimeout(this.firstMoofTimeout);
      this.firstMoofTimeout = null;
    }
  }

  /**
   * Request the moov from the SFS
   *
   * @todo - why is the clientId used here rather than the stream guid?
   *
   * @returns {Promise}
   *   * Resolves when the moov is received
   *   * Rejects if the moov is not recevied within the time defined by
   *     MOOV_TIMEOUT_DURATION
   */
  async requestMoov () {
    this.logger.info('Requesting the moov...');

    if (!this.guid) {
      throw new Error('The guid must be set before requesting moofs');
    }

    return new Promise((resolve, reject) => {
      let hasMoovTimedOut = false;

      this.moovTimeout = setTimeout(() => {
        hasMoovTimedOut = true;

        // @todo - we could retry
        this.stop();

        reject(new Error(`Moov for stream ${this.streamName} timed out after ${Conduit.MOOV_TIMEOUT_DURATION} seconds`));
      }, Conduit.MOOV_TIMEOUT_DURATION * 1000);

      this.subscribe(this.moovRequestTopic, ({ payloadBytes }) => {
        // If we received the moov after the timeout, do nothing
        if (hasMoovTimedOut) {
          this.logger.info('Recevied moov, but moofTimeout has already occurred...');
          return;
        }

        this.clearMoovTimeout();

        const moov = payloadBytes;

        // @todo - in our error handling, we do not unsubscribe from this
        // topic - does that have a negative effect on the SFS?

        // @todo - what if the unsubscribe fails?

        // Once we have the moov, we don't need to listen for it anymore
        this.logger.info('Play is unsubscribing from the moov topic...');
        this.unsubscribe(this.moovRequestTopic);

        resolve({ moov });
      });

      const readyToRecevieMoofsTopic = `iov/video/${this.guid}/play`;

      // Once we are listening for the moov, tell the server (by publishing to
      // it) to start sending the CLSP stream.
      this.publish(readyToRecevieMoofsTopic, {
        initSegmentTopic: this.moovRequestTopic,
        clientId: this.clientId,
        jwt: this.streamConfiguration.jwt,
      });
    });
  }

  /**
   * Request moofs from the SFS.  Should only be called after getting the moov.
   *
   * @param {Function} onMoof
   *   The function to call when a moof is recevied
   *
   * @returns {Promise}
   *   * Resolves when the first moof is received
   *   * Rejects if the first moof is not recevied within the time defined by
   *     FIRST_MOOF_TIMEOUT_DURATION
   */
  async requestMoofs (onMoof = () => {}) {
    this.logger.info('Setting up moof listener...');

    if (!this.guid) {
      throw new Error('The guid must be set before requesting moofs');
    }

    return new Promise((resolve, reject) => {
      let hasFirstMoofTimedOut = false;
      let hasReceviedFirstMoof = false;

      this.firstMoofTimeout = setTimeout(() => {
        hasFirstMoofTimedOut = true;

        // @todo - we could retry
        this.stop();

        reject(new Error(`First moof for stream ${this.streamName} timed out after ${Conduit.FIRST_MOOF_TIMEOUT_DURATION} seconds`));
      }, Conduit.FIRST_MOOF_TIMEOUT_DURATION * 1000);

      const moofReceivedTopic = `iov/video/${this.guid}/live`;

      // Set up the listener for the stream itself (the moof video segments)
      this.subscribe(moofReceivedTopic, (mqttMessage) => {
        if (!hasReceviedFirstMoof) {
          // If we received the first moof after the timeout, do nothing
          if (hasFirstMoofTimedOut) {
            this.logger.info('Recevied first moof, but moofTimeout has already occurred...');
            return;
          }

          // If the firstMoofTimeout still exists, cancel it, since the request
          // did not timeout
          this.clearFirstMoofTimeout();

          // Since this is the first moof, resolve
          hasReceviedFirstMoof = true;
          resolve({
            moofReceivedTopic,
          });
        }

        // @todo - should we have a timeout that checks time between moofs?
        // e.g. if we are getting moofs, then after 30 seconds we haven't
        // received another moof, should that throw an error?

        onMoof(mqttMessage);
      });
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

  _freeAllResources() {
    this.iovId = null;
    this.clientId = null;
    this.guid = null;
    // The caller must destroy the streamConfiguration
    this.streamConfiguration = null;
    this.containerElement = null;

    // The Router will be destroyed along with the iframe
    this.iframe.parentNode.removeChild(this.iframe);
    // this.iframe.remove();
    this.iframe.srcdoc = '';
    this.iframe = null;

    this.handlers = null;
    this.reconnectionAttempts = null;

    this.connected = null;
    this.moovTimeout = null;
    this.firstMoofTimeout = null;

    this.moovRequestTopic = null;

    this.statsMsg = null;
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

    if (this._onConnect) {
      window.removeEventListener('message', this._onConnect);
      this._onConnect = null;
    }

    if (this._onRouterCreate) {
      window.removeEventListener('message', this._onRouterCreate);
      this._onRouterCreate = null;
    }

    const stopPromise = this.stop();

    return stopPromise
      .then(() => {
        this.logger.debug('stopped successfully...');
        this._freeAllResources();
        this.logger.debug('destroy successfully finished...');
      })
      .catch((error) => {
        this.logger.debug('stopped unsuccessfully...');
        this.logger.error('Error while destroying the Conduit!');
        this.logger.error(error);
        this._freeAllResources();
        this.logger.debug('destroy unsuccessfully finished...');
      });
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
      case Conduit.routerEvents.DATA_RECEIVED: {
        this._onMqttData(event.data);
        break;
      }
      case Conduit.routerEvents.CONNECTION_LOST: {
        this.disconnect();
        this._reconnect();
        break;
      }
      case Conduit.routerEvents.WINDOW_MESSAGE_FAIL: {
        // @todo - do we really need to disconnect?
        this.disconnect();
        break;
      }
      case Conduit.routerEvents.CREATED:
      case Conduit.routerEvents.CONNECT_SUCCESS:
      case Conduit.routerEvents.DISCONNECT_SUCCESS: {
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
        method: Conduit.iframeCommands.SEND,
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
      method: Conduit.iframeCommands.SUBSCRIBE,
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
      method: Conduit.iframeCommands.UNSUBSCRIBE,
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
      method: Conduit.iframeCommands.PUBLISH,
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
      method: Conduit.iframeCommands.SEND,
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
    this.logger.debug(`transaction for ${topic}...`);

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
              host: '${this.streamConfiguration.host}',
              port: ${this.streamConfiguration.port},
              useSSL: ${this.streamConfiguration.useSSL},
            };

            window.conduitCommands = ${JSON.stringify(Conduit.iframeCommands)};

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
   * @async
   */
  async _reconnect () {
    this.logger.info('Reconnecting...');

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
  publishStats () {
    this.statsMsg.inkbps = (this.statsMsg.byteCount * 8) / 30000.0;
    this.statsMsg.byteCount = 0;

    this.publish('iov/stats', this.statsMsg);

    this.logger.debug('iov status', this.statsMsg);
  }
}
