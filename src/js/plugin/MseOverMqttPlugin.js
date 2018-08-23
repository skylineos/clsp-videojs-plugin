import Debug from 'debug';

// This is configured as an external library by webpack, so the caller must
// provide videojs on `window`
import videojs from 'video.js';

// @todo - can this be up to the caller?
import 'videojs-errors';

// @todo - can webpack be configured to process this without having
// include it like this?
import '../../styles/videojs-mse-over-clsp.scss';

// @todo - can webpack be configured to process this without having
// include it like this?
import '../conduit/clspConduit.generated.js';

import utils from '../utils';
import MqttSourceHandler from './MqttSourceHandler';
import MqttConduitCollection from './MqttConduitCollection';

const Plugin = videojs.getPlugin('plugin');

const DEBUG_PREFIX = 'skyline:clsp';

export default (defaults = {}) => class MseOverMqttPlugin extends Plugin {
  static VERSION = utils.version;

  static utils = utils;

  static conduits = MqttConduitCollection.factory();

  static register () {
    if (videojs.getPlugin(utils.name)) {
      throw new Error('You can only register the clsp plugin once, and it has already been registered.');
    }

    videojs.getTech('Html5').registerSourceHandler(MqttSourceHandler.factory('html5', MseOverMqttPlugin.conduits), 0);
    videojs.registerPlugin(utils.name, MseOverMqttPlugin);

    return MseOverMqttPlugin;
  }

  constructor (player, options) {
    super(player, options);

    this.debug = Debug(`${DEBUG_PREFIX}:MseOverMqttPlugin`);
    this.debug('constructor');

    options = videojs.mergeOptions(defaults, options);

    player.addClass('vjs-mse-over-mqtt');

    if (options.customClass) {
      player.addClass(options.customClass);
    }

    player.errors({
      errors: {
        PLAYER_ERR_NOT_COMPAT: {
          headline: 'This browser is unsupported.',
          message: 'Chrome 52+ is required.',
        },
      },
      timeout: 120 * 1000,
    });

    if (!utils.supported()) {
      return player.error({
        code: 'PLAYER_ERR_NOT_COMPAT',
        dismiss: false,
      });
    }

    // Needed to make videojs-errors think that the video is progressing
    // If we do not do this, videojs-errors will give us a timeout error
    player._currentTime = 0;
    player.currentTime = () => player._currentTime++;

    // @todo - we are currently creating the IOV for this player on `firstplay`
    // but we could do it on the `ready` event.  However, in order to support
    // this, we need to make the IOV and its player able to be instantiated
    // without automatically playing AND without automatically listening via
    // a conduit
    player.on('firstplay', (event) => {
      this.debug('on firstplay');

      const mqttHandler = player.tech(true).mqtt;

      if (!mqttHandler) {
        throw new Error(`VideoJS Player ${player.id()} does not have mqtt tech!`);
      }

      mqttHandler.createIOV(player);

      // Any time a metric is received, let the caller know
      mqttHandler.iov.player.on('metric', (metric) => {
        // @see - https://docs.videojs.com/tutorial-plugins.html#events
        // Note that I originally tried to trigger this event on the player
        // rather than the tech, but that causes the video not to play...
        this.trigger('metric', { metric });
      });
    });
  }

  destroy () {
    this.debug = null;
  }
};