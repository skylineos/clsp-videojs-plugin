'use strict';

import ActiveStream from './ActiveStream';

export default class ActiveStreams {
  static factory () {
    return new ActiveStreams();
  }

  constructor () {
    this.activeStreams = [];
    this.activeStreamsByStreamName = {};
    this.activeStreamsByGuid = {};
  }

  add (name, guid, mimeCodec, moov) {
    const activeStream = ActiveStream.factory(name, guid, mimeCodec, moov);

    this.activeStreams.push(activeStream);
    this.activeStreamsByStreamName[name] = activeStream;
    this.activeStreamsByGuid[guid] = activeStream;

    return activeStream;
  }

  first () {
    return this.activeStreams[0];
  }

  isEmpty () {
    return !Boolean(this.activeStreams.length);
  }

  getByStreamName (name) {
    return this.activeStreamsByStreamName[name];
  }

  getByGuid (guid) {
    return this.activeStreamsByGuid[guid];
  }

  hasByStreamName (name) {
    return this.activeStreamsByStreamName.hasOwnProperty(name);
  }

  hasByGuid (guid) {
    return this.activeStreamsByGuid.hasOwnProperty(guid);
  }

  removeByName (name) {
    const activeStream = this.activeStreamsByStreamName[name];

    return this.remove(activeStream);
  }

  removeByGuid (guid) {
    const activeStream = this.activeStreamsByGuid[guid];

    return this.remove(activeStream);
  }

  remove (activeStream) {
    const index = this.activeStreams.indexOf(activeStream);
    const exists = (index > -1);

    if (!exists) {
      throw new Error('Cannot remove this active stream because it does not exist');
    }

    this.activeStreams.splice(index, 1);

    delete this.activeStreamsByGuid[activeStream.guid];
    delete this.activeStreamsByStreamName[activeStream.name];

    return activeStream;
  }

  destroy () {
    this.activeStreams = null;
    this.activeStreamsByStreamName = null;
    this.activeStreamsByGuid = null;
  }
}
