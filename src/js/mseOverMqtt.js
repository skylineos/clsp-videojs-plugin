import videojs from 'video.js';

import { version as VERSION } from '../../package.json';
import utils from './utils';

const Plugin = videojs.getPlugin('plugin');

export default function (defaults, SrcsLookupTable) {
  class MseOverMqttPlugin extends Plugin {
    constructor (player, options) {
      super(player, options);

      options = videojs.mergeOptions(defaults, options);

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

      player.on('firstplay', function (e) {
        var mqttHandler = SrcsLookupTable[this.currentSource().src];

        if (!mqttHandler) {
          return console.error('src not in lookup table');
        }

        // setup mqtt connection, callback called when connection
        // made and a new iov_player created.
        mqttHandler.launchIovPlayer(player, function (iov_player) {
          if (!iov_player) {
            throw new Error('iov_player not available!');
          }

          if (iov_player.playing) {
            console.warn('tried to use this player more than once...')
            return;
          }

          iov_player.playing = true;

          // start playing video
          iov_player.play(
            e.target.firstChild.id,
            mqttHandler.streamName,
            function () {
              player.loadingSpinner.hide();
            },
            function () {
              // reset the timeout monitor
              player.trigger('timeupdate');
            }
          );
        });
      });

      player.ready(() => {
        const videoTag = player.children()[0];
        // var playButton = this.bigPlayButton;

        videoTag.addEventListener('mqttReady', (event) => {
          if (videoTag.getAttribute('autoplay') !== null) {
            // playButton.trigger('click');
            player.trigger('play', videoTag);
          }
        });
      });
    }
  }

  MseOverMqttPlugin.pluginName = 'clsp';
  MseOverMqttPlugin.VERSION = VERSION;
  MseOverMqttPlugin.utils = utils;

  return MseOverMqttPlugin;
};
