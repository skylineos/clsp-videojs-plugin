'use strict';

import ActiveStream from './ActiveStream';

/**
 * A collection of ActiveStream instances.
 */
export default class ActiveStreams {
  static factory () {
    return new ActiveStreams();
  }

  constructor () {
    this.activeStreams = [];
    this.activeStreamsByStreamName = {};
    this.activeStreamsByGuid = {};

    this.destroyed = false;
  }

  add (source, guid, mimeCodec, moov) {
    const activeStream = ActiveStream.factory(source, guid, mimeCodec, moov);

    this.activeStreams.push(activeStream);
    this.activeStreamsByStreamName[source.streamName] = activeStream;
    this.activeStreamsByGuid[guid] = activeStream;

    return activeStream;
  }

  /**
   * Get the most recently added ActiveStream.
   *
   * @returns {ActiveStream}
   *   The most recently added ActiveStream
   */
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
    return Object.prototype.hasOwnProperty.call(this.activeStreamsByStreamName, name);
  }

  hasByGuid (guid) {
    return Object.prototype.hasOwnProperty.call(this.activeStreamsByGuid, guid);
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
    delete this.activeStreamsByStreamName[activeStream.source.name];

    return activeStream;
  }

  destroy () {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.activeStreams.forEach((activeStream) => activeStream.destroy());

    this.activeStreams = null;
    this.activeStreamsByStreamName = null;
    this.activeStreamsByGuid = null;
  }
}
