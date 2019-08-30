'use strict';

export default class ActiveStream {
  static factory (name, guid, mimeCodec, moov) {
    return new ActiveStream(name, guid, mimeCodec, moov);
  }

  constructor (name, guid, mimeCodec, moov) {
    // The name of the stream, which is used in the url as the stream identifier
    this.name = name;

    // The guid of the active stream, which is given to the client by the
    // mqtt server, which identifies a particular connection to a particular
    // stream
    this.guid = guid;

    //
    this.mimeCodec = mimeCodec;

    // The moov is the initial frame or packet that contains stream metadata?
    // @todo - confirm this description
    this.moov = moov;
  };
}
