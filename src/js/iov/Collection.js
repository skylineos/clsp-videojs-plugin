'use strict';

import Paho from 'paho-mqtt';
import defaults from 'lodash/defaults';

import IOV from './IOV';
import Source from './Source';
import Logger from '../utils/logger';

// Even though the export of paho-mqtt is { Client, Message }, there is an
// internal reference that the library makes to itself, and it expects
// itself to exist at Paho.MQTT.  FIRED!
window.Paho = {
  MQTT: Paho,
};

const DEFAULT_CHANGE_SOURCE_MAX_WAIT = 5000;

// @todo - this could cause an overflow!
let totalIovCount = 0;
let collection;

/**
 * The IOV Collection is meant ot be a singleton, and is meant to manage all
 * IOVs in a given browser window/document.  There are certain centralized
 * functions it is meant to perform, such as generating the uuids that are
 * needed to establish a connection to a unique topic on the SFS, and to listen
 * to window messages and route the relevant messages to the appropriate IOV
 * instance.
 */
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
  constructor (options = {}) {
    this.logger = Logger().factory('IovCollection');
    this.logger.debug('Constructing...');

    defaults(
      {},
      options,
      {
        changeSourceMaxWait: DEFAULT_CHANGE_SOURCE_MAX_WAIT,
      }
    );

    this.iovs = {};
    this.deletedIovIds = [];
  }

  _getNextId () {
    return (++totalIovCount).toString();
  }

  async create (source, videoElement) {
    const iov = IOV.factory(videoElement, { id: this._getNextId() });

    this.add(iov);

    iov.addSource(source);

    await iov.initialize();

    return iov;
  }

  /**
   * Add an IOV instance to this collection.
   *
   * @param {IOV} iov
   *   The iov instance to add
   *
   * @returns {this}
   */
  add (iov) {
    const id = iov.id;

    this.iovs[id] = iov;

    return this;
  }

  async changeSourceUrl (id, url) {
    if (!this.has(id)) {
      throw new Error(`IOV with id ${id} does not exist!`);
    }

    if (!url || !url.startsWith('clsp')) {
      throw new Error(`Cannot change source on IOV ${id} with invalid url "${url}"`);
    }

    const source = Source.fromUrl(url);

    return this.changeSource(id, source);
  }

  async changeSource (id, source) {
    if (!this.has(id)) {
      throw new Error(`IOV with id ${id} does not exist!`);
    }

    if (!source) {
      throw new Error(`Cannot change source on IOV ${id} without a source`);
    }

    const iov = this.get(id);

    iov.addSource(source);
    await iov.play(source);

    return iov.id;

    // const cloneId = this._getNextId();
    // const clone = iov.clone({ id: cloneId });

    // await clone.initialize();

    // clone.play();

    // let isDone = false;

    // return new Promise((resolve, reject) => {
    //   const onDone = () => {
    //     if (isDone) {
    //       return;
    //     }

    //     isDone = true;

    //     this.remove(id);
    //     this.add(clone);

    //     resolve(cloneId);
    //   };

    //   // When the tab is not in focus, chrome doesn't handle things the same
    //   // way as when the tab is in focus, and it seems that the result of that
    //   // is that the "firstFrameShown" event never fires.  Having the IOV be
    //   // updated on a delay in case the "firstFrameShown" takes too long will
    //   // ensure that the old IOVs are destroyed, ensuring that unnecessary
    //   // socket connections, etc. are not being used, as this can cause the
    //   // browser to crash.
    //   // Note that if there is a better way to do this, it would likely reduce
    //   // the number of try/catch blocks and null checks in the Player and
    //   // MSEWrapper, but I don't think that is likely to happen until the MSE
    //   // is standardized, and even then, we may be subject to non-intuitive
    //   // behavior based on tab switching, etc.
    //   setTimeout(onDone, this.changeSourceMaxWait);

    //   // Under normal circumstances, meaning when the tab is in focus, we want
    //   // to respond by switching the IOV when the new IOV Player has something
    //   // to display
    //   clone.player.on('firstFrameShown', onDone);
    // });
  }

  /**
   * Determine whether or not an iov with the passed id exists in this
   * collection.
   *
   * @param {String} id
   *   The id of the iov to find
   *
   * @returns {Boolean}
   *   True if the iov with the given id exists
   *   False if the iov with the given id does not exist
   */
  has (id) {
    return Object.prototype.hasOwnProperty.call(this.iovs, id);
  }

  /**
   * Get an iov with the passed id from this collection.
   *
   * @param {String} id
   *   The id of the iov instance to get
   *
   * @returns {IOV|undefined}
   *   If an iov with this id doest not exist, undefined is returned.
   */
  get (id) {
    return this.iovs[id];
  }

  /**
   * Remove an iov instance from this collection and destroy it.
   *
   * @param {String} id
   *   The id of the iov to remove and destroy
   *
   * @returns {this}
   */
  remove (id) {
    const iov = this.get(id);

    if (!iov) {
      return;
    }

    delete this.iovs[id];

    iov.destroy();

    this.deletedIovIds.push(id);

    return this;
  }

  /**
   * Destroy this collection and destroy all iov instances in this collection.
   *
   * @returns {void}
   */
  destroy () {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    for (let id in this.iovs) {
      this.remove(id);
    }

    this.iovs = null;
  }
}
