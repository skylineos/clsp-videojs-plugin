import Debug from 'debug';

const DEBUG_PREFIX = 'skyline:clsp:iov';

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

      var clientId = event.data.clientId;

      if (!this.exists(clientId)) {
        return;
      }

      var conduit = this.getById(clientId);
      var iov = conduit.iov;
      var eventType = event.data.event;

      iov.debug('message received', event.data);

      switch (eventType) {
        case 'data': {
          conduit.inboundHandler(event.data);
          break;
        }
        case 'ready': {
          if (iov.config.videoElement.parentNode !== null) {
            iov.config.videoElementParentId = iov.config.videoElement.parentNode.id;
          }
          conduit.onReady();
          break;
        }
        case 'fail': {
          iov.debug('network error', event.data.reason);
          iov.playerInstance.trigger('network-error', event.data.reason);
          break;
        }
        default: {
          console.error(`No match for event: ${eventType}`);
        }
      }
    });
  }

  set (id, conduit) {
    this.debug('setting...', id, conduit);

    this._conduits[id] = conduit;

    return conduit;
  }

  addFromIov (iov) {
    this.debug('adding from iov...', iov);

    const conduit = window.mqttConduit(iov, () => {
      this.debug('onReady...', iov.config.clientId);

      iov.config.appStart(iov);

      // the mse service will stop streaming to us if we don't send
      // a message to iov/stats within 1 minute.
      iov._statsTimer = setInterval(() => {
        iov.statsMsg.inkbps = (iov.statsMsg.byteCount * 8) / 30000.0;
        iov.statsMsg.byteCount = 0;

        this.getById(iov.config.clientId).publish('iov/stats', iov.statsMsg);

        this.debug('iov status', iov.statsMsg);
      }, 5000);
    });

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
