'use strict';

import Source from './Source';

/**
 * A collection of Source instances.
 */
export default class Sources {
  static factory (sources = [], config = {}) {
    return new Sources(sources, config);
  }

  constructor (sources = [], config = {}) {
    if (!Array.isArray(sources)) {
      throw new Error('To create a Sources instance, sources must be an array');
    }

    // Controls whether or not all sources must have the same host.  This is
    // useful because a single conduit can only connect to a single mqtt host,
    // therefore restricting sources in a single collection to a particular host
    // has value.
    this.strict = config.strict || false;

    this.sources = [];

    // @private
    // Used internally to track the original host information
    this._firstSource = null;

    this.add(sources);

    this.destroyed = false;
  }

  add (source) {
    if (Array.isArray(source)) {
      source.forEach((source) => this.add(source));

      return this;
    }

    if (!Source.isSource(source)) {
      throw new Error('Cannot add an invalid source to a Sources instance');
    }

    // If this is the first source added, then this source's host information
    // will be set on this colleciton, regardless of strict mode.
    if (!this._firstSource) {
      this._firstSource = source.clone();

      this.sources.push(source);

      return this;
    }

    // If strict mode is not enabled, add the source
    if (!this.strict) {
      this.sources.push(source);

      return this;
    }

    // With strict mode enabled, the source must have the same host information
    // as the first source
    if (this._firstSource.hostsMatch(source)) {
      this.sources.push(source);

      return this;
    }

    throw new Error('Strict mode is enabled for this sources collection, and the source does not use the same mqtt host');
  }

  count () {
    return this.sources.length;
  }

  has (source) {
    if (this.sources.indexOf(source) === -1) {
      return false;
    }

    return true;
  }

  first () {
    return this.sources[0];
  }

  destroy () {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    // Note that we do not destroy the source here because it is not exclusively
    // used here.
    this.sources = [];

    this.strict = null;
    this._firstSource.destroy();
    this._firstSource = null;
  }
}
