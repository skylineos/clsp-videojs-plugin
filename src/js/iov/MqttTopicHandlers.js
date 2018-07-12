import Debug from 'debug';

const DEBUG_PREFIX = 'skyline:clsp:iov';

/**
 * route inbound messages/data to player's event handlers.
 */
export default class MqttTopicHandlers {
  constructor (id, iov) {
    this.id = id;
    this.debug = Debug(`${DEBUG_PREFIX}:${this.id}:MqttTopicHandlers`);

    this.debug('constructing...');

    this.iov = iov;
    this._handlers = {};
  }

  get (topic) {
    this.debug('getting...', topic);

    return this._handlers[topic];
  }

  register (topic, callback) {
    this.debug('register...', topic);

    this._handlers[topic] = (...args) => {
      this.debug('executing handler...', topic);

      callback(...args);
    };
  }

  unregister (topic) {
    this.debug('unregistering...', topic);

    if (this.exists(topic)) {
      delete this._handlers[topic];
    }
  }

  exists (topic) {
    this.debug('exists?', topic);

    return this._handlers.hasOwnProperty(topic);
  }

  // central entry point for all MQTT inbound traffic.
  msghandler (message) {
    this.debug('msghandler...', message);

    var topic = message.destinationName;

    if (!this.exists(topic)) {
      debug(`No handler for ${topic} - message dropped`, message);

      return;
    }

    try {
      this.get(topic)(message);
    } catch (e) {
      this.iov.events.exception(`${topic} handler exception`, e);
    }
  }
}
