'use strict';

import Debug from 'debug';

import Conduit from '~/iov/Conduit';

let singleton;

export default class ConduitCollection {
  static factory () {
    if (!singleton) {
      singleton = new ConduitCollection();
    }

    return singleton;
  }

  constructor () {
    this.debug = Debug('skyline:clsp:plugin:ConduitCollection');
    this.silly = Debug('skyline:silly:clsp:plugin:ConduitCollection');

    this.debug('constructing...');

    this._conduits = {};
    this._unassignedConduits = {};

    const iframeCollection = document.createElement('div');

    iframeCollection.setAttribute('id', 'clsp-conduit-iframe-collection');

    // @todo - don't actually attach this to the body, just leave it as an
    // orphan, if possible
    document.body.appendChild(iframeCollection);

    window.addEventListener('message', this.onMessage);
  }

  onMessage = (event) => {
    this.silly('window on message');

    const conduitId = event.data.conduitId;

    if (!this.exists(conduitId)) {
      // When the mqtt connection is interupted due to a listener being removed,
      // a fail event is always sent.  It is not necessary to log this as an error
      // in the console, because it is not an error.
      if (!event.data.event === 'fail') {
        console.error(`No conduit with id "${conduitId}" exists!`);
      }

      return;
    }

    const conduit = this.getById(conduitId);

    if (event.data.event === 'loaded') {
      conduit.command({ method: 'ready' });
      conduit.iframeLoaded = true;

      return;
    }

    // @todo - this may need to become the responsibility of the iov
    conduit.iov.onMessage(event);
  }

  set (conduit) {
    this.debug('setting...', conduit);

    this._conduits[conduit.id] = conduit;

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
    const conduit = this._conduits[id];

    delete this._conduits[id];

    const conduitProfileKey = `${conduit.config.wsbroker}|${conduit.config.wsport}|${conduit.config.useSSL}`;

    conduit.unassign();

    // Ensure there is a category in the unassigned conduits
    if (!this._unassignedConduits[conduitProfileKey]) {
      this._unassignedConduits[conduitProfileKey] = [];
    }

    // Save it for later use
    this._unassignedConduits[conduitProfileKey].push(conduit);
  }

  addFromIov (iov, options) {
    this.debug(`adding from iov ${iov.id}...`);

    const conduitProfileKey = `${iov.config.wsbroker}|${iov.config.wsport}|${iov.config.useSSL}`;

    let conduit;

    // Create the unassigned conduit category for this iov
    if (!this._unassignedConduits[conduitProfileKey]) {
      this._unassignedConduits[conduitProfileKey] = [];
    }

    // Use an unassigned conduit that was instantiated with the same conduit profile,
    // if one is available
    if (this._unassignedConduits[conduitProfileKey].length) {
      conduit = this._unassignedConduits[conduitProfileKey].pop();

      // Don't use conduits that are destroyed
      if (conduit.destroyed || conduit.destroying) {
        conduit = null;
      }
      else {
        this.debug(`reusing an unassigned ${conduitProfileKey} conduit ${conduit.id} for iov ${iov.id}`);

        conduit.assign(iov);
      }
    }

    // At this point, there is no conduit that can be reused, so create a new one
    if (!conduit) {
      this.debug(`creating a brand new conduit for iov ${iov.id}...`);
      conduit = Conduit.factory(iov, options);
    }

    if (!conduit) {
      throw new Error('Unable to create conduit!');
    }

    this.set(conduit);

    if (conduit.iframeLoaded) {
      conduit.command({ method: 'ready' });
    }

    return conduit;
  }

  destroy () {
    this.debug('destroying...');

    // @todo - should all conduits be destroyed?
    this._conduits = null;

    this.debug = null;
    this.silly = null;

    window.removeEventListener('message', this.onMessage);
  }
}
