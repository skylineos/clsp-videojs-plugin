'use strict';

/**
 * Creates a hidden iframe that is used to establish a dedicated mqtt websocket
 * for a connection to a single mqtt host (or, more commonly, a single video).
 * This is basically an in-browser micro service which uses cross-document
 * communication to route data to and from the iframe.
 *
 * This code is a layer of abstraction on top of the mqtt router, and the
 * controller of the iframe that contains the router.
 */

import uuidv4 from 'uuid/v4';
// @todo - why doesn't this work?
// import noop from 'lodash/noop';

import Source from '../Source';
import Sources from '../Sources';
import ActiveStream from './ActiveStream';
import ActiveStreams from './ActiveStreams';
import Router from './Router';
import Logger from '../../utils/logger';

const MAX_RECONNECTION_ATTEMPTS = 200;

const noop = () => {};

export default class Conduit {
  static factory (source) {
    return new Conduit(source);
  }

  /**
   * @private
   */
  constructor () {
    // This MUST be globally unique!  The MQTT server will broadcast the stream
    // to a topic that contains this id, so if there is ANY other client
    // connected that has the same id anywhere in the world, the stream to all
    // clients that use that topic will fail.  This is why we use uuids rather
    // than an incrementing integer.
    this.clientId = uuidv4();

    // The internal logger
    this.logger = Logger().factory(`Conduit ${this.clientId}`);
    this.logger.debug('Constructing...');

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

    // When connected to an mqtt host, the Router can request more than one
    // stream.  This object will track of the currently active streams.
    this.activeStreams = ActiveStreams.factory();

    // The stream that was most recently requested and successfully connected
    this.lastActiveStream = null;

    // The stream sources that this conduit is aware of
    this.sources = Sources.factory([], { strict: true });
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
   * @private
   *
   * Send stats to the server for the purpose of ensuring the server does not
   * disconnect us for "inactivity".
   *
   * @returns {void}
   */
  _publishStats() {
    this.statsMsg.inkbps = (this.statsMsg.byteCount * 8) / 30000.0;
    this.statsMsg.byteCount = 0;

    this.logger.debug('iov status', this.statsMsg);

    this.publish(ActiveStream.STATS_ROUTE, this.statsMsg);
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

  addSource (source) {
    this.addSources(source);

    return this;
  }

  addSources (sources) {
    this.sources.add(sources);

    return this;
  }

  getMostRecentSource () {
    if (this.lastActiveStream) {
      return this.lastActiveStream.source;
    }

    const firstSource = this.sources.first();

    if (firstSource) {
      return firstSource;
    }

    return null;
  }

  /**
   * Register a listener for the moov.  We can only do this once we have
   * requested the stream from the server.  This listener will only be fired
   * once when the current source is first played.  This listener will
   * unregister itself as soon as the moov is received, since the moov only
   * gets sent from the server once.
   *
   * @param {String} initSegmentTopic
   *   The topic that is going to publish the moov once the server has started
   *   to play the stream
   * @param {ActiveStream} activeStream
   *   The stream that is currently playing
   * @param {Function} onMoov
   *   The handler for when the moov is received
   *   @todo - since the caller can respond to the moov being received, remove
   *     this callback, and instead resolve all information necessary for the
   *     caller to know the activeStream and whether or not this is the first
   *     source.
   * @param {Boolean} isFirstSource
   *   Is the moov that is being received the moov for the first source for this
   *   conduit?
   */
  registerMoovListener (initSegmentTopic, activeStream, onMoov, isFirstSource) {
    return new Promise((resolve, reject) => {
      try {
        // First, we set up a listner for the initSegmentTopic.  When the server
        // starts broadcasting on this topic, this listener will first process
        // the moov, then subscribe to the moofs.
        this.subscribe(initSegmentTopic, async ({ payloadBytes }) => {
          // Once this callback is called, we have the moov
          activeStream.setMoov(payloadBytes);

          this.unsubscribe(initSegmentTopic);

          if (isFirstSource) {
            onMoov(activeStream);
          }

          resolve(activeStream);

          // @todo
          // resolve({
          //   isFirstMoof,
          //   activeStream,
          // });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Register a listener for the moofs.  We can only do this once we have the
   * stream guid from the server.  This listener will be fired on every moof
   * (which is frequent).
   *
   * @param {ActiveStream} previousStream
   * @param {ActiveStream} activeStream
   * @param {Function} onMoof
   * @param {Function} onChange
   */
  registerMoofListener (previousStream, activeStream, onMoof, onChange) {
    let isFirstMoof = true;

    this.subscribe(activeStream.moofRoute, (mqttMessage) => {
      // @todo - perhaps the first moof is what counts as "isPlaying"?
      onMoof(activeStream, mqttMessage);

      // @todo - WIP - why are there still black frames between streams???
      if (isFirstMoof) {
        isFirstMoof = false;

        setTimeout(() => {
          // self.reinitializeMse();
          onChange(previousStream, activeStream);
          this.unsubscribe(previousStream.moofRoute);

          // destroy the previousStream's iframe (only when there is a different host!)

          this.activeStreams.remove(previousStream);
        }, 500);
      }
    });
  }

  /**
   * Called once per stream, once the moov is received
   *
   * @callback Conduit-onMoov
   * @param {ActiveStream} activeStream
   *   The ActiveStream record of the stream to which this moov belongs.  The
   *   ActiveStream record contains the moov.
   */

  /**
   * Called many times, each time a moof is received
   *
   * @callback Conduit-onMoof
   * @param {ActiveStream} activeStream
   *   The ActiveStream record of the stream to which this moof belongs
   * @param {any} mqttMessage
   *   The stream segment / packet / moof
   */

  /**
   * Called any time, a source is added via a play call with a different source
   *
   * @callback Conduit-onChange
   * @param {ActiveStream} previousStream
   *   The ActiveStream record of the stream that was playing prior to the new
   *   stream being played
   * @param {ActiveStream} activeStream
   *   The ActiveStream record of the stream that is about to be played
   */

  /**
   * Perform the necessary conduit operations to retrieve stream segments
   * (moofs).  The actual "playing" occurs in the player, since it involves
   * taking those received stream segments and using the browser's MSE to
   * display them.
   *
   * @param {Source} source
   *   the Source of the stream
   * @param {Conduit-onMoov} onMoov
   * @param {Conduit-onMoof} onMoof
   * @param {Conduit-onChange} onChange
   */
  async play (
    source = this.getMostRecentSource(),
    onMoov = noop,
    onMoof = noop,
    onChange = noop
  ) {
    // If we cannot retrieve the last active source or the first source that
    // was added, throw an error
    if (!Source.isSource(source)) {
      throw new Error('Cannot play without valid source');
    }

    // Do not proceed if a stream with this name on the current mqtt host is
    // already active
    if (this.activeStreams.hasByStreamName(source.streamName)) {
      console.log(`"${source.streamName} is already an active stream`)
      // @todo - should this throw? maybe not, because it should continue playing
      return;
    }

    // We do this here because there is no reason for the conduit to be
    // connected prior to playing.  And if there is an edge case where this is
    // needed, the caller can choose to do it.
    await this.connect();

    if (source.usingJwt) {
      streamName = await this.validateJwt(source);
    }

    if (source.usingHash) {
      streamName = await this.validateHash(source);
    }

    // Request the stream from the server, which will give us the guid we need
    // to listen for it
    const {
      guid,
      mimeCodec,
    } = await this.request(source);

    const activeStream = this.activeStreams.add(
      source,
      guid,
      mimeCodec,
    );

    const previousStream = this.lastActiveStream;
    const isFirstSource = !Boolean(previousStream);
    this.lastActiveStream = activeStream;

    // After we get the moov from the server, handle the actual video segments
    this.registerMoofListener(
      previousStream,
      activeStream,
      onMoof,
      onChange
    );

    // Do our best to ask for a unique stream to minimize "snooping".
    // clientId is already a uuid, so this does a decent job of ensuring
    // randomness per clientId.
    // @todo - can we use a uuid here instead of Math.random?
    const initSegmentTopic = `${this.clientId}/init-segment/${parseInt(Math.random() * 1000000)}`;

    // After we ask the server to play stream, handle the moov.  Once the moov
    // has been received, the play method is considered to have completed,
    // therefore we will capture this promise and return it.
    const moovPromise = this.registerMoovListener(
      initSegmentTopic,
      previousStream,
      activeStream,
      onMoov,
      isFirstSource
    );

    // Ask the server to play the stream for us, which will ultimately trigger
    // the moov, and subsequently the moofs
    this.publish(activeStream.playRoute, {
      initSegmentTopic,
      clientId: this.clientId,
      jwt: source.jwt,
    });

    // Allow the caller to respond to the moov being received.
    return moovPromise;
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
   * Stop the playing stream
   *
   * @todo - make this async and await the disconnection, and maybe even the
   * unsubscribes
   */
  stop (source = this.getMostRecentSource(), disconnect = true) {
    // If we cannot retrieve the last active source or the first source that
    // was added, throw an error
    if (!Source.isSource(source)) {
      throw new Error('Cannot play without valid source');
    }

    const activeStream = this.activeStreams.getByStreamName(source.streamName);

    if (!activeStream) {
      this.logger.warn(`No active stream with name "${source.streamName}", so not stopping`);
      return;
    }

    console.log('stopping', activeStream)
    this.logger.debug(`Stopping stream for ${activeStream.guid}...`);

    // Stop listening for moofs
    this.unsubscribe(activeStream.moofRoute);

    // Stop listening for resync events
    this.unsubscribe(activeStream.resyncRoute);

    // Tell the server we've stopped
    this.publish(stopRoute, { clientId: this.clientId });

    this.activeStreams.remove(activeStream);

    if (disconnect && this.activeStreams.isEmpty()) {
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
  async validateJwt (source) {
    this.logger.debug('Validating JWT...');

    if (!Source.isSource(source)) {
      throw new Error('Cannot play without valid source');
    }

    const response = await this.transaction(ActiveStream.JWT_VALIDATE_ROUTE, {
      b64_access_url: source.b64_jwt_access_url,
      token: source.jwt,
    });

    return Source.getStreamNameFromJWTValidate(response);
  }

  /**
   * Validate the hash that this conduit was constructed with.
   *
   * @returns Promise
   *   Resolves the streamName when the response is received AND is successful.
   *   Rejects if the transaction fails or if the response code is not 200.
   */
  async validateHash (source) {
    this.logger.debug('Validating Hash...');

    if (!Source.isSource(source)) {
      throw new Error('Cannot play without valid source');
    }

    // response ->  {"status": 200, "target_url": "clsp://sfs1/fakestream", "error": null}
    const response = await this.transaction(ActiveStream.HASH_VALIDATE_ROUTE, {
      b64HashURL: source.b64_hash_access_url,
      token: source.hash,
    });

    return Source.getStreamNameFromHashValidate(response);
  }

  /**
   * Get the `guid` and `mimeCodec` for the stream
   *
   * @todo - return a Promise
   *
   * @param {Source} source
   *   The source record for the stream
   *
   * @returns {Promise}
   */
  async request (source) {
    this.logger.debug('Requesting Stream...');

    if (!Source.isSource(source)) {
      throw new Error('Cannot play without valid source');
    }

    const {
      error,
      guid,
      mimeCodec
    } = await this.transaction(
      ActiveStream.getRequestRouteFromSource(source),
      { clientId: this.clientId }
    );

    if (error) {
      throw new Error(error);
    }

    return {
      guid,
      mimeCodec,
    };
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

    // @todo - should there be something similar to getMostRecentSource for guids?

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
    this.subscribe(activeStream.resyncRoute, cb);
  }

  /**
   * Get the list of available CLSP streams from the SFS
   */
  async getStreamList () {
    this.logger.debug('Getting Stream List...');

    const args = await this.transaction(ActiveStream.LIST_ROUTE);

    // @todo - what is returned here?
    // @todo - what is the reject condition?
    return args;
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
   * To be called when a segment / moof is "shown".
   * In practice, this is meant to be called when the moof is appended to the
   * MSE SourceBuffer.
   * This method is meant to update stats.
   *
   * @param {Array} byteArray
   *   The raw segment / moof
   */
  segmentUsed (byteArray) {
    // @todo - it appears that this is never used, because LogSourceBuffer is
    // never defined!
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
    this.logger.debug(`directSend for topic "${topic}"...`);

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
  transaction (topic, messageData = {}) {
    this.logger.debug('transaction...');

    // Do our due diligence in creating a topic that cannot be guessed so that
    // we are the only ones who receive it!
    // @todo - can we use uuid here instead of Math.random?
    messageData.resp_topic = `${this.clientId}/response/${parseInt(Math.random() * 1000000)}`;

    return new Promise((resolve, reject) => {
      this.subscribe(messageData.resp_topic, (response) => {
        const value = JSON.parse(response.payloadString);

        // @todo - should the resolve occur after the unsubscribe?
        // @todo - what is the reject condition?
        resolve(value);

        this.unsubscribe(messageData.resp_topic);
      });

      this.publish(topic, messageData);
    })
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
  destroy() {
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

    // Destroy iframe
    this.iframe.parentNode.removeChild(this.iframe);
    // this.iframe.remove();
    this.iframe.srcdoc = '';
    this.iframe = null;

    this.topicHandlers = null;
    this.reconnectionAttempts = null;

    this.activeStreams.destroy();
    this.activeStreams = null;
    this.lastActiveStream = null;

    this.sourceAdded = null;
    this.useSSL = null;
    this.protocol = null;
    this.host = null;
    this.port = null;
  }
}
