'use strict';

import Source from '../Source';

// All CLSP stream topics start with this prefix
const IOV_PREFIX = 'iov';
// Most CLSP topics that are stream-specific start with this
const IOV_VIDEO_PREFIX = `${IOV_PREFIX}/video`;

/**
 * A stream that is currently being published to an MQTT topic from the server.
 * An ActiveStream instance is intended to keep track of a playing stream and
 * provide the necessary data and topics for that stream.
 */
export default class ActiveStream {
  // The topic at which to publish playing stream stats
  static STATS_TOPIC = `${IOV_PREFIX}/stats`;
  // The topic that validates a JWT
  static JWT_VALIDATE_TOPIC = `${IOV_PREFIX}/jwtValidate`;
  // The topic that validates a hash
  static HASH_VALIDATE_TOPIC = `${IOV_PREFIX}/hashValidate`;
  // The topic for the paho mqtt will message
  static WILL_MESSAGE_TOPIC = `${IOV_PREFIX}/clientDisconnect`;

  static getRequestTopicFromSource (source) {
    if (!Source.isSource(source)) {
      throw new Error('Cannot get request topic from invalid source');
    }

    // @todo - should this be isomorphic?
    return `${IOV_VIDEO_PREFIX}/${window.btoa(source.streamName)}/request`;
  }

  static generateInitSegmentTopic (clientId) {
    // Do our best to ask for a unique stream to minimize "snooping".
    // clientId is already a uuid, so this does a decent job of ensuring
    // randomness per clientId.
    // @todo - can we use another uuid here instead of Math.random?
    return `${clientId}/init-segment/${parseInt(Math.random() * 1000000)}`;
  }

  /**
   * Process the response from the JWT_VALIDATE_TOPIC transaction to retrieve
   * the stream name from the returned target_url.
   *
   * @param {Object} response
   *   The response from the transaction to the JWT_VALIDATE_TOPIC topic
   *
   * @returns {Object}
   *   target_url - the target url provided by the server
   *   streamName - the streamName extracted from the target_url
   */
  static getStreamNameFromJWTValidate ({ error, status, target_url } = {}) {
    if (error) {
      throw new Error(error);
    }

    if (status !== 200) {
      if (status === 403) {
        throw new Error('JwtUnAuthorized');
      }

      throw new Error(`JwtInvalid: ${status}`);
    }

    // TODO, figure out how to handle a change in the sfs url from the
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
    const targetUrlParts = target_url.split('/');

    // get the actual stream name
    const streamName = targetUrlParts[targetUrlParts.length - 1];

    // @todo - could we do target_url.split('/').pop()?
    return {
      target_url,
      streamName,
    };
  }

  /**
   * Process the response from the JWT_VALIDATE_TOPIC transaction to retrieve
   * the stream name from the returned target_url.
   *
   * @param {Object} response
   *   The response from the transaction to the JWT_VALIDATE_TOPIC topic
   *
   * @returns {Object}
   *   target_url - the target url provided by the server
   *   streamName - the streamName extracted from the target_url
   */
  static getStreamNameFromHashValidate ({ error, status, target_url } = {}) {
    if (error) {
      throw new Error(error);
    }

    if (status !== 200) {
      if (status === 403) {
        throw new Error('HashUnAuthorized');
      }

      throw new Error(`HashInvalid: ${status}`);
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
    const targetUrlParts = target_url.split('/');

    // get the actual stream name
    const streamName = targetUrlParts[targetUrlParts.length - 1];

    // @todo - could we do target_url.split('/').pop()?
    return {
      target_url,
      streamName,
    };
  }

  static factory (source, guid, mimeCodec, moov) {
    return new ActiveStream(source, guid, mimeCodec, moov);
  }

  constructor (source, guid, mimeCodec, moov) {
    if (!Source.isSource(source)) {
      throw new Error('Cannot create an ActiveStream with an invalid source');
    }

    // The stream Source
    this.source = source;

    // The guid of the active stream, which is given to the client by the
    // mqtt server, which identifies a particular connection to a particular
    // stream
    this.guid = guid;

    //
    this.mimeCodec = mimeCodec;

    // The moov is the initial frame or packet that contains stream metadata?
    // @todo - confirm this description
    this.moov = moov;

    this.destroyed = false;
  }

  get moofTopic () {
    return `${IOV_VIDEO_PREFIX}/${this.guid}/live`;
  }

  get resyncTopic () {
    return `${IOV_VIDEO_PREFIX}/${this.guid}/resync`;
  }

  get stopTopic () {
    return `${IOV_VIDEO_PREFIX}/${this.guid}/stop`;
  }

  get playTopic () {
    return `${IOV_VIDEO_PREFIX}/${this.guid}/play`;
  }

  setMoov (moov) {
    this.moov = moov;
  }

  destroy () {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    // Note that we do not destroy the source here because it is not exclusively
    // used here.
    this.source = null;
    this.guid = null;
    this.mimeCodec = null;
    this.moov = null;
  }
}
