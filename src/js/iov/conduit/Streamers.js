'use strict';

import Streamer from './Streamer';

/**
 * A collection of Streamer instances.
 */
export default class Streamers {
  static factory (options = {}) {
    return new Streamers();
  }

  static getStreamerHostFromSource (source) {
    // Do not do a Source.isSource check here because we will not necessarily
    // always have a source before we have a streamer
    if (!source || !source.host || !source.port) {
      throw new Error('Cannot get host with an invalid Source');
    }

    return `${source.host}:${source.port}`;
  }

  constructor (options = {}) {
    // If strict mode is enabled, only Streamers with identical hosts will be
    // allowed to be added to this collection
    this.strict = Boolean(options.strict);

    this.streamers = [];
    this.streamersByHost = {};

    this.destroyed = false;
  }

  add (host, port, useSSL) {
    const streamer = Streamer.factory(host, port, useSSL);

    if (this.strict) {
      // Don't allow multiple streamers that use the same host.
      // The caller must re-use the streamer
      if (this.hasByHost({ host, port })) {
        throw new Error('You may not add two streamers that use the same host.');
      }
    }

    const streamerHost = Streamers.getStreamerHostFromSource({ host, port });

    this.streamers.push(streamer);
    // @todo - do we need to take useSSL into account here?
    this.streamersByHost[streamerHost] = streamer;

    return streamer;
  }

  addSource (source) {
    const streamer = this.getByHost(source);

    streamer.addSource(source);
  }

  hasByHost (source) {
    try {
      this.getByHost(source);
      return true;
    }
    catch (error) {
      return false;
    }
  }

  getByHost (source) {
    const host = Streamers.getStreamerHostFromSource(source);
    const streamer = this.streamersByHost[host];

    if (!streamer) {
      throw new Error(`No streamer with host ${host} exists in this collection`);
    }

    return streamer;
  }

  /**
   * Get the most recently added Streamer.
   *
   * @returns {Streamer}
   *   The most recently added Streamer
   */
  first () {
    return this.streamers[0];
  }

  isEmpty () {
    // eslint-disable-next-line no-extra-boolean-cast
    return !Boolean(this.streamers.length);
  }

  remove (streamer) {
    const index = this.streamers.indexOf(streamer);
    const exists = (index > -1);

    if (!exists) {
      throw new Error('Cannot remove this active stream because it does not exist');
    }

    this.streamers.splice(index, 1);

    return streamer;
  }

  forEach (func) {
    const promises = [];

    for (let i = 0; i < this.streamers.length; i++) {
      const response = func(this.streamers[i], i, this.streamers, this);

      // Allow early exit
      if (response === false) {
        return;
      }

      // properly handle promises
      // @todo - is there a way to make the for loop wait for the promise?  That
      // way the caller has the option to run this in parallel or in series
      if (response && response.then && typeof response.then === 'function') {
        promises.push(response);
      }
    }

    if (promises.length) {
      // handle them in parallel
      return Promise.all(promises);
    }
  }

  destroy () {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.streamers.forEach((streamer) => streamer.destroy());

    this.streamers = null;
  }
}
