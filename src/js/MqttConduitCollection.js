import Debug from 'debug';

const DEBUG_PREFIX = 'skyline:clsp';

let singleton;

export default class MqttConduitCollection {
  static factory () {
    if (!singleton) {
      singleton = new MqttConduitCollection();
    }

    return singleton;
  }

  constructor () {
    this.debug = Debug(`${DEBUG_PREFIX}:MqttConduitCollection`);

    this.debug('constructing...');

    this._conduits = {};

    window.addEventListener('message', (event) => {
      this.debug('window on message');

      const clientId = event.data.clientId;
      console.log(event.data.event, 'message for', clientId)

      if (!this.exists(clientId)) {
        console.error(`No conduit with id "${clientId}" exists!`);
        return;
      }

      const conduit = this.getById(clientId);
      const iov = conduit.iov;

      iov.onMessage(event);
    });
  }

  set (id, conduit) {
    this.debug('setting...', id, conduit);

    this._conduits[id] = conduit;

    return conduit;
  }

  remove (id) {
    delete this._conduits[id];
  }

  addFromIov (iov) {
    this.debug('adding from iov...', iov);

    const conduit = this.exists(iov.config.clientId)
      ? this.getById(iov.config.clientId)
      : window.mqttConduit(iov);

    return this.set(iov.config.clientId, conduit);
  }

  getById (id) {
    this.debug('getting...', id);

    return this._conduits[id];
  }

  exists (id) {
    this.debug('exists?', id);

    return this._conduits.hasOwnProperty(id);
  }
}
