'use strict';

import IOV from './IOV';

let collection;

export default class IovCollection {
  static asSingleton () {
    if (!collection) {
      collection = IovCollection.factory();
    }

    return collection;
  }

  static factory () {
    return new IovCollection();
  }

  /**
   * @private
   */
  constructor () {
    this.iovs = {};
  }

  create (url, videoElement) {
    const iov = IOV.fromUrl(url, videoElement);

    iov.initialize();

    this.add(iov.id, iov);

    return iov;
  }

  add (id, iov) {
    this.iovs[id] = iov;

    return this;
  }

  get (id) {
    return this.iovs[id];
  }

  remove (id) {
    const iov = this.get(id);

    if (!iov) {
      return;
    }

    iov.destroy();

    delete this.iovs[id];

    return this;
  }

  destroy () {
    for (let id in this.iovs) {
      this.destroy(id);
    }

    this.iovs = null;
  }
}
