'use strict';

import Paho from 'paho-mqtt';

import Conduit from './Conduit';
import Logger from '../utils/logger';

// Even though the export of paho-mqtt is { Client, Message }, there is an
// internal reference that the library makes to itself, and it expects
// itself to exist at Paho.MQTT.  FIRED!
window.Paho = {
  MQTT: Paho,
};

let collection;

export default class ConduitCollection {
  static asSingleton () {
    if (!collection) {
      collection = ConduitCollection.factory();
    }

    return collection;
  }

  static factory () {
    return new ConduitCollection();
  }

  /**
   * @private
   */
  constructor () {
    this.logger = Logger().factory('ConduitCollection');
    this.logger.debug('Constructing...');

    this.conduits = {};
    this.deletedConduitClientIds = [];

    window.addEventListener('message', this._onWindowMessage);
  }

  /**
   * @private
   *
   * The listener for the "message" event on the window.  Its job is to
   * identify messages that are intended for a specific Conduit / stream and
   * route them to the correct one.  The most common example of this is when a
   * Router receives a moof/segment from a server, and posts a message to the
   * window.  This listener will route that moof/segment to the proper Conduit.
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

    if (!this.has(clientId)) {
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
      if (this.deletedConduitClientIds.includes(clientId)) {
        this.logger.warn(`Received a message for deleted conduit ${clientId}`);
        return;
      }

      throw new Error(`Unable to route message of type ${eventType} for Conduit with clientId "${clientId}".  A Conduit with that clientId does not exist.`);
    }

    // If the document is hidden, don't execute the onMessage handler.  If the
    // handler is executed, for some reason, the conduit will continue to
    // request/receive data from the server, which will eventually result in
    // unconstrained resource utilization, and ultimately a browser crash
    if (document.hidden) {
      return;
    }

    const conduit = this.get(clientId);

    conduit.onMessage(event);
  };

  /**
   * Create a Conduit for a specific stream, and add it to this collection.
   *
   * @param {String} clientId
   * @param {DOMNode} config
   *
   * @returns {Conduit}
   */
  async create (iovId, clientId, config) {
    this.logger.debug(`creating a conduit with iovId ${iovId} and clientId ${clientId}`);

    const conduit = Conduit.factory(iovId, clientId, config);

    this.add(conduit);

    return conduit;
  }

  /**
   * Add a Conduit instance to this collection.
   *
   * @param {Conduit} conduit
   *   The conduit instance to add
   *
   * @returns {this}
   */
  add (conduit) {
    const clientId = conduit.clientId;

    this.conduits[clientId] = conduit;

    return this;
  }

  /**
   * Determine whether or not a Conduit with the passed clientId exists in this
   * collection.
   *
   * @param {String} clientId
   *   The clientId of the conduit to find
   *
   * @returns {Boolean}
   *   True if the conduit with the given clientId exists
   *   False if the conduit with the given clientId does not exist
   */
  has (clientId) {
    return this.conduits.hasOwnProperty(clientId);
  }

  /**
   * Get a Conduit with the passed clientId from this collection.
   *
   * @param {String} clientId
   *   The clientId of the conduit instance to get
   *
   * @returns {Conduit|undefined}
   *   If a Conduit with this clientId doest not exist, undefined is returned.
   */
  get (clientId) {
    return this.conduits[clientId];
  }

  /**
   * Remove a conduit instance from this collection and destroy it.
   *
   * @param {String} clientId
   *   The clientId of the conduit to remove and destroy
   *
   * @returns {this}
   */
  remove (clientId) {
    const conduit = this.get(clientId);

    if (!conduit) {
      return;
    }

    delete this.conduits[clientId];

    conduit.destroy();

    this.deletedConduitClientIds.push(clientId);

    return this;
  }

  /**
   * Destroy this collection and destroy all conduit instances in it.
   *
   * @returns {void}
   */
  destroy() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    window.removeEventListener('message', this._onWindowMessage);

    for (let clientId in this.conduits) {
      this.remove(clientId);
    }

    this.conduits = null;
    this.deletedConduitClientIds = null;
  }
}
