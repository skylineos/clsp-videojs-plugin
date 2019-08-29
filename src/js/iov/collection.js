'use strict';

import Paho from 'paho-mqtt';
import uuidv4 from 'uuid/v4';
import defaults from 'lodash/defaults';

import IOV from './IOV';
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
 * functions it is meant to perform, such as generating the guids that are
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
   *
   * Note that this should ONLY be used as a singleton because it currently
   * uses a window event for receiving clsp video segments.  Therefore, if you
   * use more than one, you run the risk of having more than one IOV listening
   * for segments using the same clientId.
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
    this.iovsByClientId = {};
    this.deletedIovIds = [];

    window.addEventListener('message', this._onWindowMessage);
  }

  _getNextId () {
    return (++totalIovCount).toString();
  }

  /**
   * @private
   *
   * The listener for the "message" event on the window.  It's job is to
   * identify messages that are intended for an IOV and route them to the
   * correct one.  The most common example of this is when a Router receives
   * a moof/segment from a server, and posts a message to the window.  This
   * listener will route that moof/segment to the IOV it was intended for.
   *
   * @param {Object} event
   *   The window message event
   *
   * @returns {void}
   */
  _onWindowMessage = (event) => {
    const clientId = event.data.clientId;
    const eventType = event.data.event;

    if (!clientId) {
      // A window message was received that is not related to CLSP
      return;
    }

    this.logger.debug('window on message');

    if (!this.hasByClientId(clientId)) {
      // When the mqtt connection is interupted due to a listener being removed,
      // a fail event is always sent.  It is not necessary to log this as an error
      // in the console, because it is not an error.
      // @todo - the fail event no longer exists - what is the name of the new
      // corresponding event?
      if (eventType === 'fail') {
        return;
      }

      // Do not throw an error on disconnection
      if (eventType === 'disconnect_success') {
        return;
      }

      // Don't show an error for iovs that have been deleted
      if (this.deletedIovIds.includes(clientId)) {
        this.logger.warn(`Received a message for deleted iov ${clientId}`);
        return;
      }

      const iovClientIdMismatchMessage = `Unable to route message of type ${eventType} for IOV with clientId "${clientId}".  An IOV for that clientId does not exist.`;

      this.logger.warn(iovClientIdMismatchMessage);
      // throw new Error(iovClientIdMismatchMessage);

      return;
    }

    // If the document is hidden, don't execute the onMessage handler.  If the
    // handler is executed, for some reason, the conduit will continue to
    // request/receive data from the server, which will eventually result in
    // unconstrained resource utilization, and ultimately a browser crash
    if (document.hidden) {
      return;
    }

    this.getByClientId(clientId).conduit.onMessage(event);
  };

  /**
   * Create an IOV for a specific stream, and add it to this collection.
   *
   * @param {String} url
   *   The url to the clsp stream
   * @param {DOMNode} videoElement
   *   The video element that will serve as the video player in the DOM
   *
   * @returns {IOV}
   */
  async create (url, videoElement) {
    const iov = IOV.fromUrl(
      url,
      videoElement,
      {
        id: this._getNextId(),
        clientId: uuidv4(),
      }
    );

    this.add(iov);

    await iov.initialize();

    return iov;
  }

  /**
   * Add an IOV instance to this collection.  It can then be accessed by its id
   * or its clientId.
   *
   * @param {IOV} iov
   *   The iov instance to add
   *
   * @returns {this}
   */
  add (iov) {
    const id = iov.id;
    const clientId = iov.clientId;

    this.iovs[id] = iov;
    this.iovsByClientId[clientId] = iov;

    return this;
  }

  async changeSource (id, url) {
    if (!this.has(id)) {
      throw new Error(`IOV with id ${id} does not exist!`);
    }

    if (!url || !url.startsWith('clsp')) {
      throw new Error(`Cannot change source on IOV ${id} with invalid url "${url}"`);
    }

    const iov = this.get(id);
    const cloneId = this._getNextId();
    const clone = iov.cloneFromUrl(url, { id: cloneId });

    await clone.initialize();

    clone.play();

    let isDone = false;

    return new Promise((resolve, reject) => {
      const onDone = () => {
        if (isDone) {
          return;
        }

        isDone = true;

        this.remove(id);
        this.add(clone);

        resolve(cloneId);
      };

      // When the tab is not in focus, chrome doesn't handle things the same
      // way as when the tab is in focus, and it seems that the result of that
      // is that the "firstFrameShown" event never fires.  Having the IOV be
      // updated on a delay in case the "firstFrameShown" takes too long will
      // ensure that the old IOVs are destroyed, ensuring that unnecessary
      // socket connections, etc. are not being used, as this can cause the
      // browser to crash.
      // Note that if there is a better way to do this, it would likely reduce
      // the number of try/catch blocks and null checks in the IOVPlayer and
      // MSEWrapper, but I don't think that is likely to happen until the MSE
      // is standardized, and even then, we may be subject to non-intuitive
      // behavior based on tab switching, etc.
      setTimeout(onDone, this.changeSourceMaxWait);

      // Under normal circumstances, meaning when the tab is in focus, we want
      // to respond by switching the IOV when the new IOV Player has something
      // to display
      clone.player.on('firstFrameShown', onDone);
    });
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
    return this.iovs.hasOwnProperty(id);
  }

  /**
   * Determine whether or not an iov with the passed clientId exists in this
   * collection.
   *
   * @param {String} clientId
   *   The clientId of the iov to find
   *
   * @returns {Boolean}
   *   True if the iov with the given clientId exists
   *   False if the iov with the given clientId does not exist
   */
  hasByClientId (clientId) {
    return this.iovsByClientId.hasOwnProperty(clientId);
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
   * Get an iov with the passed clientId from this collection.
   *
   * @param {String} clientId
   *   The clientId of the iov instance to get
   *
   * @returns {IOV|undefined}
   *   If an iov with this clientId doest not exist, undefined is returned.
   */
  getByClientId (clientId) {
    return this.iovsByClientId[clientId];
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
    delete this.iovsByClientId[iov.clientId];

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

    window.removeEventListener('message', this._onWindowMessage);

    for (let id in this.iovs) {
      this.remove(id);
    }

    this.iovs = null;
    this.iovsByClientId = null;
  }
}
