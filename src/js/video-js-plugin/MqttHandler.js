import Debug from 'debug';
import videojs from 'video.js';

import IovCollection from '../iov/collection';

const Component = videojs.getComponent('Component');

const DEBUG_PREFIX = 'skyline:clsp';

export default class MqttHandler extends Component {
  constructor (source, tech, options) {
    super(tech, options.mqtt);

    this.debug = Debug(`${DEBUG_PREFIX}:MqttHandler`);
    this.debug('constructor');

    this.tech_ = tech;
    this.source_ = source;

    // @todo - is there a better way to do this where we don't pollute the
    // top level namespace?
    this.iov = null;
  }

  createIOV (player) {
    this.debug('createIOV');

    const iov = IovCollection.asSingleton().create(this.source_.src, player);

    this.updateIOV(iov);
  }

  updateIOV (iov) {
    this.debug('updateIOV');

    if (this.iov) {
      // If the IOV is the same, do nothing
      if (this.iov.id === iov.id) {
        return;
      }

      IovCollection.asSingleton()
        .remove(this.iov.id)
        .add(iov.id, iov);
    }

    this.iov = iov;
  }
}
