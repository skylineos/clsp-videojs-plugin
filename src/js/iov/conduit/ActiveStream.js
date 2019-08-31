'use strict';

import Source from "../Source";

const IOV_PREFIX = 'iov';
const IOV_VIDEO_PREFIX = `${IOV_PREFIX}/video`;

export default class ActiveStream {
  static LIST_ROUTE = `${IOV_VIDEO_PREFIX}/list`;
  static STATS_ROUTE = `${IOV_PREFIX}/stats`;
  static JWT_VALIDATE_ROUTE = `${IOV_PREFIX}/jwtValidate`;
  static HASH_VALIDATE_ROUTE = `${IOV_PREFIX}/hashValidate`;
  static WILL_MESSAGE_ROUTE = `${IOV_PREFIX}/clientDisconnect`;

  static getRequestRouteFromSource (source) {
    if (!Source.isSource(source)) {
      throw new Error('Cannot get request route from invalid source');
    }

    // @todo - should this be isomorphic?
    return `${IOV_VIDEO_PREFIX}/${window.btoa(source.streamName)}/request`;
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

  get moofRoute () {
    return `${IOV_VIDEO_PREFIX}/${this.guid}/live`;
  }

  get resyncRoute () {
    return `${IOV_VIDEO_PREFIX}/${this.guid}/resync`;
  }

  get stopRoute () {
    return `${IOV_VIDEO_PREFIX}/${this.guid}/stop`;
  }

  get playRoute () {
    return `${IOV_VIDEO_PREFIX}/${this.guid}/play`;
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
