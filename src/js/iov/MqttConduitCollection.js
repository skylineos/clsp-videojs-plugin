import Debug from 'debug';

const DEBUG_PREFIX = 'clsp:iov';

export default class MqttConduitCollection {
  constructor (id, MqttConduitLookup) {
    this.id = id;
    this.debug = Debug(`${DEBUG_PREFIX}:${this.id}:MqttConduitCollection`);

    this.debug('constructing...');

    this.MqttConduitLookup = MqttConduitLookup;
  }

  set (id, conduit) {
    this.debug('setting...', id, conduit);

    this.MqttConduitLookup[id] = conduit;

    return conduit;
  }

  addFromIov (transport, iov) {
    console.log('add from IOV')
    this.debug('adding from iov...', iov);

    console.log(iov.config.clientId)

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

    return this.MqttConduitLookup[id];
  }

  exists (id) {
    this.debug('exists?', id);

    return this.MqttConduitLookup.hasOwnProperty(id);
  }
}
