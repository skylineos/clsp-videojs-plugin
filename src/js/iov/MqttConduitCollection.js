import Debug from 'debug';

const DEBUG_PREFIX = 'skyline:clsp:iov';

export default class MqttConduitCollection {
  constructor (id) {
    this.id = id;
    this.debug = Debug(`${DEBUG_PREFIX}:${this.id}:MqttConduitCollection`);

    this.debug('constructing...');

    this._conduits = {};
  }

  set (id, conduit) {
    this.debug('setting...', id, conduit);

    this._conduits[id] = conduit;

    return conduit;
  }

  addFromIov (transport, iov) {
    this.debug('adding from iov...', iov);

    return this.set(iov.config.clientId, window.mqttConduit(iov.config, () => {
      this.debug('onReady...', iov.config.clientId);

      iov.config.appStart(iov);

      // the mse service will stop streaming to us if we don't send
      // a message to iov/stats within 1 minute.
      iov._statsTimer = setInterval(() => {
        iov.statsMsg.inkbps = (iov.statsMsg.byteCount * 8) / 30000.0;
        iov.statsMsg.byteCount = 0;

        transport.publish('iov/stats', iov.statsMsg);

        this.debug('iov status', iov.statsMsg);
      }, 5000);
    }));
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
