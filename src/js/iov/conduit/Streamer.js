'use strict';

// @todo - why doesn't this work?
// import noop from 'lodash/noop';
import uuidv4 from 'uuid/v4';

import Conduit from './Conduit';
import Source from '../Source';
import Sources from '../Sources';
import ActiveStream from './ActiveStream';
import ActiveStreams from './ActiveStreams';
import Logger from '../../utils/logger';

const noop = () => {};

export default class Streamer {
  static factory (host, port, useSSL) {
    return new Streamer(host, port, useSSL);
  }

  static fromSource (source) {
    if (!Source.isSource(source)) {
      throw new Error('Cannot create a Streamer from an invalid Source instance.');
    }

    const streamer = Streamer.factory(source.host, source.port, source.useSSL);

    streamer.addSource(source);

    return streamer;
  }

  constructor (host, port, useSSL) {
    this.id = uuidv4();

    // The internal logger
    this.logger = Logger().factory(`Streamer ${this.id}`);
    this.logger.debug('Constructing...');

    this.host = host;
    this.port = port;
    this.useSSL = useSSL;
    this.videoElementParent = null;

    // When connected to an mqtt host, the Router can request more than one
    // stream.  This object will track of the currently active streams.
    this.activeStreams = ActiveStreams.factory();

    // The stream that was most recently requested and successfully connected
    this.lastActiveStream = null;

    // The stream sources that this Streamer is aware of
    this.sources = Sources.factory([], { strict: true });

    this.conduit = Conduit.factory(this.host, this.port, this.useSSL);
  }

  async initialize (videoElementParent) {
    if (!videoElementParent) {
      throw new Error('videoElementParent is required to initialize a Streamer');
    }

    this.videoElementParent = videoElementParent;

    await this.conduit.initialize(this.videoElementParent);
    await this.conduit.connect();
  }

  addSource (source) {
    this.sources.add(source);

    return this;
  }

  addSources (sources) {
    this.sources.add(sources);

    return this;
  }

  getMostRecentSource () {
    // @todo - is it possible to have the lastActiveStream source not be in
    // this.sources?
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
   * @param {ActiveStream} previousStream
   *   The stream that was previously playing, if it exists
   */
  async registerMoovListener (initSegmentTopic, activeStream, onMoov, previousStream) {
    // First, we set up a listner for the initSegmentTopic.  When the server
    // starts broadcasting on this topic, this listener will first process
    // the moov, then subscribe to the moofs.
    const { payloadBytes } = await this.conduit.serverInitiatedTransaction(initSegmentTopic);

    activeStream.setMoov(payloadBytes);

    // Only call onMoov if we are dealing with the first stream
    if (!previousStream) {
      await onMoov(activeStream);
    }

    // @todo
    // return {
    //   isFirstMoof,
    //   activeStream,
    // };

    return activeStream;
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

    this.conduit.subscribe(activeStream.moofTopic, (mqttMessage) => {
      // @todo - perhaps the first moof is what counts as "isPlaying"?
      onMoof(activeStream, mqttMessage);

      // @todo - WIP - why are there still black frames between streams???
      if (isFirstMoof) {
        isFirstMoof = false;

        setTimeout(() => {
          // self.reinitializeMse();
          onChange(previousStream, activeStream);
          if (previousStream) {
            this.conduit.unsubscribe(previousStream.moofTopic);
          }

          // destroy the previousStream's iframe (only when there is a different host!)

          this.activeStreams.remove(previousStream);
        }, 500);
      }
    });
  }

  /**
   * Validate the jwt of the given source
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

    const response = await this.conduit.clientInitiatedTransaction(ActiveStream.JWT_VALIDATE_TOPIC, {
      b64_access_url: source.b64_jwt_access_url,
      token: source.jwt,
    });

    return Source.getStreamNameFromJWTValidate(response);
  }

  /**
   * Validate the hash of the given source
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
    const response = await this.conduit.clientInitiatedTransaction(ActiveStream.HASH_VALIDATE_TOPIC, {
      b64HashURL: source.b64_hash_access_url,
      token: source.hash,
    });

    return Source.getStreamNameFromHashValidate(response);
  }

  /**
   * Called once per stream, once the moov is received
   *
   * @callback Streamer-onMoov
   * @param {ActiveStream} activeStream
   *   The ActiveStream record of the stream to which this moov belongs.  The
   *   ActiveStream record contains the moov.
   */

  /**
   * Called many times, each time a moof is received
   *
   * @callback Streamer-onMoof
   * @param {ActiveStream} activeStream
   *   The ActiveStream record of the stream to which this moof belongs
   * @param {any} mqttMessage
   *   The stream segment / packet / moof
   */

  /**
   * Called any time, a source is added via a play call with a different source
   *
   * @callback Streamer-onChange
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
   * @param {Streamer-onMoov} onMoov
   * @param {Streamer-onMoof} onMoof
   * @param {Streamer-onChange} onChange
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
      // @todo - should this throw? maybe not, because it should continue playing
      return;
    }

    // @todo - these need to be re-implemented!!!
    // if (source.usingJwt) {
    //   streamName = await this.validateJwt(source);
    // }

    // if (source.usingHash) {
    //   streamName = await this.validateHash(source);
    // }

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
    this.lastActiveStream = activeStream;

    // After we get the moov from the server, handle the actual video segments
    this.registerMoofListener(
      previousStream,
      activeStream,
      onMoof,
      onChange
    );

    const initSegmentTopic = ActiveStream.generateInitSegmentTopic(this.conduit.clientId);

    // After we ask the server to play stream, handle the moov.  Once the moov
    // has been received, the play method is considered to have completed,
    // therefore we will capture this promise and return it.
    const moovPromise = this.registerMoovListener(
      initSegmentTopic,
      activeStream,
      onMoov,
      previousStream
    );

    // Ask the server to play the stream for us, which will ultimately trigger
    // the moov, and subsequently the moofs
    this.conduit.publish(activeStream.playTopic, {
      initSegmentTopic,
      clientId: this.conduit.clientId,
      jwt: source.jwt,
    });

    // Allow the caller to respond to the moov being received.
    return moovPromise;
  }

  /**
   * Stop the playing stream
   *
   * @todo - make this async and await the disconnection, and maybe even the
   * unsubscribes
   */
  stop (disconnect = true) {
    const source = this.getMostRecentSource();
    const activeStream = this.activeStreams.getByStreamName(source.streamName);

    if (!activeStream) {
      this.logger.warn(`No active stream with name "${source.streamName}", so not stopping`);
      return;
    }

    this.logger.debug(`Stopping stream for ${activeStream.guid}...`);

    // Stop listening for moofs
    this.conduit.unsubscribe(activeStream.moofTopic);

    // Stop listening for resync events
    this.conduit.unsubscribe(activeStream.resyncTopic);

    // Tell the server we've stopped
    this.conduit.publish(activeStream.stopTopic, { clientId: this.conduit.clientId });

    this.activeStreams.remove(activeStream);

    if (disconnect && this.activeStreams.isEmpty()) {
      this.conduit.disconnect();
    }
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
      mimeCodec,
    } = await this.conduit.clientInitiatedTransaction(
      ActiveStream.getRequestTopicFromSource(source),
      { clientId: this.conduit.clientId }
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
   * @callback Streamer-resync-cb
   * @param {any} - @todo - document this
   */

  /**
   * @todo - provide method description
   *
   * @todo - return a Promise
   *
   * @param {Streamer-resync-cb} cb
   *   The callback for the resync operation
   */
  resync (guid, cb) {
    let activeStream;

    // @todo - should there be something similar to getMostRecentSource for guids?

    if (guid) {
      activeStream = this.activeStreams.getByGuid(guid);

      if (!activeStream) {
        this.logger.warn(`No active stream with guid "${guid}", so not resyncing`);
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

    // subscribe to a sync topic that will be called if the stream that is
    // feeding the mse service dies and has to be restarted that this player
    // should restart the stream
    this.conduit.subscribe(activeStream.resyncTopic, cb);
  }

  /**
   * The conduit needs to be notified every time a video segment is played.
   *
   * @param {Array} byteArray
   *   The raw segment / moof
   */
  segmentUsed (byteArray) {
    this.conduit.segmentUsed(byteArray);
  }

  destroy () {
    this.logger.debug('Destroying...');

    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.host = null;
    this.port = null;
    this.useSSL = null;

    this.activeStreams.destroy();
    this.activeStreams = null;
    this.lastActiveStream = null;

    this.sources.destroy();
    this.sources = null;

    this.conduit.destroy();
    this.conduit = null;

    this.videoElementParent = null;
  }
}
