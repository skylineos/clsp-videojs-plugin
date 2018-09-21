'use strict';

import Debug from 'debug';

import Conduit from '~/iov/Conduit';

let singleton;

export default class MqttConduitCollection {
  static factory () {
    if (!singleton) {
      singleton = new MqttConduitCollection();
    }

    return singleton;
  }

  constructor () {
    this.debug = Debug('skyline:clsp:plugin:MqttConduitCollection');
    this.silly = Debug('skyline:silly:clsp:plugin:MqttConduitCollection');

    this.debug('constructing...');

    this._conduits = {};

    window.addEventListener('message', this.onMessage);
  }

  onMessage = (event) => {
    this.silly('window on message');

    const clientId = event.data.clientId;

    if (!this.exists(clientId)) {
      // When the mqtt connection is interupted due to a listener being removed,
      // a fail event is always sent.  It is not necessary to log this as an error
      // in the console, because it is not an error.
      if (!event.data.event === 'fail') {
        console.error(`No conduit with id "${clientId}" exists!`);
      }

      return;
    }

    this.getById(clientId).iov.onMessage(event);
  }

  set (id, conduit) {
    this.debug('setting...', id, conduit);

    this._conduits[id] = conduit;

    return conduit;
  }

  getById (id) {
    this.silly('getting...', id);

    return this._conduits[id];
  }

  exists (id) {
    this.silly('exists?', id);

    return this._conduits.hasOwnProperty(id);
  }

  remove (id) {
    delete this._conduits[id];
  }

  addFromIov (iov) {
    this.debug('adding from iov...', iov);

    const conduit = this.exists(iov.config.clientId)
      ? this.getById(iov.config.clientId)
      : Conduit.factory(iov);

    return this.set(iov.config.clientId, conduit);
  }

  destroy () {
    this.debug('destroying...');

    // @todo - should all conduits be destroyed?
    this._conduits = null;

    window.removeEventListener('message', this.onMessage);
  }
}
