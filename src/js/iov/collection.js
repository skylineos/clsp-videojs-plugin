'use strict';

import Paho from 'paho-mqtt';
import IOV from './IOV';
import Logger from '../utils/logger';

// Even though the export of paho-mqtt is { Client, Message }, there is an
// internal reference that the library makes to itself, and it expects
// itself to exist at Paho.MQTT.  FIRED!
window.Paho = {
  MQTT: Paho,
};

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
   *
   * Note that this should ONLY be used as a singleton because it currently
   * uses a window event for receiving clsp video segments.  Therefore, if you
   * use more than one, you run the risk of having more than one IOV listening
   * for segments using the same clientId.
   */
  constructor () {
    this.logger = Logger.factory('IovCollection');
    this.logger.debug('Constructing...');

    this.iovs = {};

    window.addEventListener('message', (event) => {
      this.logger.debug('window on message');

      const clientId = event.data.clientId;

      if (!this.has(clientId)) {
        // When the mqtt connection is interupted due to a listener being removed,
        // a fail event is always sent.  It is not necessary to log this as an error
        // in the console, because it is not an error.
        if (event.data.event === 'fail') {
          return;
        }

        throw new Error(`Unable to route message for IOV with clientId "${clientId}".  An IOV for that clientId does not exist.`);
      }

      // If the document is hidden, don't execute the onMessage handler.  If the
      // handler is executed, for some reason, the conduit will continue to
      // request/receive data from the server, which will eventually result in
      // unconstrained resource utilization, and ultimately a browser crash
      if (document.hidden) {
        return;
      }

      this.get(clientId).onMessage(event);
    });
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

  has (id) {
    return this.iovs.hasOwnProperty(id);
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
