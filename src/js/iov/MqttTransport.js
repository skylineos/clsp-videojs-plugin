import Debug from 'debug';

const DEBUG_PREFIX = 'skyline:clsp:iov';

export default class MqttTransport {
  constructor (id, iov) {
    this.id = id;
    this.debug = Debug(`${DEBUG_PREFIX}:${this.id}:MqttConduitCollection`);

    this.debug('constructing...');

    // setup stats
    iov.statsMsg = {
      byteCount: 0,
      inkbps: 0,
      host: document.location.host,
      clientId: iov.config.clientId
    };

    this.clientId = iov.config.clientId;
    this.iov = iov;

    this.debug('looking for useSSL', iov);
    this.conduit = iov.mqttConduitCollection.addFromIov(this, iov);
  }

  // create a temporary resp_topic to receive a query response
  // upon response remove the temporary topic. Assume both request
  // and response are json formateed text.
  transaction (topic, callback, data) {
    this.debug('transaction...');

    this.conduit.transaction(topic, (event) => {
      this.debug('transaction callback...', event);
      if (callback) {
        callback(event);
      }
    }, data);
  }

  subscribe (topic, callback) {
    this.debug('subscribe...');

    this.conduit.subscribe(topic, (event) => {
      this.debug('subscribe callback...', event);
      if (callback) {
        callback(event);
      }
    });
  }

  unsubscribe (topic, callback) {
    this.debug('unsubscribe...');

    this.conduit.unsubscribe(topic, (event) => {
      this.debug('unsubscribe callback...', event);
      if (callback) {
        callback(event);
      }
    });
  }

  publish (topic, data, callback) {
    this.debug('publish...');

    this.conduit.publish(topic, data, (event) => {
      this.debug('publish callback...', event);
      if (callback) {
        callback(event);
      }
    });
  }
}
