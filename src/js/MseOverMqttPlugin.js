import Debug from 'debug';
import videojs from 'video.js';

import { version as VERSION } from '../../package.json';
import MqttSourceHandler from './MqttSourceHandler';
import MqttConduitCollection from './MqttConduitCollection';
import utils from './utils';

const Plugin = videojs.getPlugin('plugin');

const DEBUG_PREFIX = 'skyline:clsp';

let registered = false;

export default function (defaults = {}) {
  class MseOverMqttPlugin extends Plugin {
    static register () {
      if (registered) {
        throw new Error('You can only register the clsp plugin once, and it has already been registered.');
      }

      // @todo - there is likely some way for videojs to tell us that the plugin has already
      // been registered, or perhaps videojs itself will not let you register a plugin twice
      registered = true;

      videojs.getTech('Html5').registerSourceHandler(MqttSourceHandler()('html5', MqttConduitCollection.factory()), 0);
      videojs.registerPlugin(MseOverMqttPlugin.pluginName, MseOverMqttPlugin);

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
      player.currentTime = () => {
        return player._currentTime++;
      };

      player.on('firstplay', (event) => {
        this.debug('on firstplay');

        // @todo - the use of the tech here is discouraged.  What is the "right" way to
        // get the information from the mqttHandler?
        const mqttHandler = player.tech(true).mqtt;

        if (!mqttHandler) {
          return console.error('src not in lookup table');
        }

        mqttHandler.createIOV(player);

        mqttHandler.iov.player.on('metric', (metric) => {
          // @see - https://docs.videojs.com/tutorial-plugins.html#events
          this.trigger('metric', { metric });
        });
      });
    }
  }

  MseOverMqttPlugin.pluginName = 'clsp';
  MseOverMqttPlugin.VERSION = VERSION;
  MseOverMqttPlugin.utils = utils;

  return MseOverMqttPlugin;
};
