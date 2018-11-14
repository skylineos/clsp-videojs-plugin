import Debug from 'debug';
import videojs from 'video.js';

import IOV from './iov/IOV';

const Component = videojs.getComponent('Component');

const DEBUG_PREFIX = 'skyline:clsp';

export default class MqttHandler extends Component {
  constructor (source, tech, mqttConduitCollection, options) {
    super(tech, options.mqtt);

    this.debug = Debug(`${DEBUG_PREFIX}:MqttHandler`);
    this.debug('constructor');

    this.tech_ = tech;
    this.source_ = source;

    // @todo - is there a better way to do this where we don't pollute the
    // top level namespace?
    this.iov = null;
    this.mqttConduitCollection = mqttConduitCollection;
  }

  async createIOV (player) {
    this.debug('createIOV');

    await this.updateIOV(IOV.fromUrl(
      this.source_.src,
      this.mqttConduitCollection,
      player
    ));

    this.iov.initialize();
  }

  async updateIOV (iov) {
    this.debug('updateIOV');

    if (this.iov) {
      // If the IOV is the same, do nothing
      if (this.iov.id === iov.id) {
        return;
      }

      await this.iov.destroy();
    }

    this.iov = iov;
  }
};
