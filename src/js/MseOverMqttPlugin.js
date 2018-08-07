import videojs from 'video.js';

import { version as VERSION } from '../../package.json';
import MqttSourceHandler from './MqttSourceHandler';
import MqttConduitCollection from './MqttConduitCollection';
import IOV from './iov/IOV';
import utils from './utils';

const Plugin = videojs.getPlugin('plugin');

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

      videojs.getTech('Html5').registerSourceHandler(MqttSourceHandler()('html5'), 0);
      videojs.registerPlugin(MseOverMqttPlugin.pluginName, MseOverMqttPlugin);

      return MseOverMqttPlugin;
    }

    constructor (player, options) {
      super(player, options);

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

      player.currentTime = function () {
        // Needed to make videojs-errors think that the video is progressing
        // If we do not do this, videojs-errors will give us a timeout error
        // filthy hack - two objects will never be equal to one another
        return {};
      };

      player.on('firstplay', function (e) {
        // @todo - the use of the tech here is discouraged.  What is the "right" way to
        // get the information from the mqttHandler?
        // And, really, all this does is parse the clsp url - do we really need a
        // dedicated handler for that?  Can't we parse the url ourselves?
        const mqttHandler = player.tech(true).mqtt;

        if (!mqttHandler) {
          return console.error('src not in lookup table');
        }

        var videoElement = player.el();

        player.tech(true).mqtt.iov = IOV.factory(MseOverMqttPlugin.mqttConduitCollection, player, {
          initialize: true,
          port: mqttHandler.port,
          address: mqttHandler.address,
          useSSL: mqttHandler.useSSL,
          videoElement,
          appStart: (iov) => {
            // connected to MQTT procede to setting up callbacks
            // debug("iov.player() called")
            const mqtt_player = iov.player;

            if (!mqtt_player) {
              throw new Error('mqtt_player not available!');
            }

            const videoTag = player.children()[0];

            // @todo - there must be a better way to determine autoplay...
            if (videoTag.getAttribute('autoplay') !== null) {
              // playButton.trigger('click');
              player.trigger('play', videoTag);
            }

            if (mqtt_player.playing) {
              console.warn('tried to use this player more than once...')
              return;
            }

            mqtt_player.playing = true;

            mqtt_player.on('firstChunk', () => {
              player.loadingSpinner.hide();
            });

            mqtt_player.on('videoReceived', () => {
              // reset the timeout monitor from videojs-errors
              player.trigger('timeupdate');
            });

            mqtt_player.on('videoInfoReceived', () => {
              // reset the timeout monitor from videojs-errors
              player.trigger('timeupdate');
            });

            // start playing video
            mqtt_player.play(e.target.firstChild.id, mqttHandler.streamName);

            videoElement.addEventListener('mse-error-event', (e) => {
              mqtt_player.restart();
            }, false);
          },
        });
      });
    }
  }

  MseOverMqttPlugin.pluginName = 'clsp';
  MseOverMqttPlugin.mqttConduitCollection = MqttConduitCollection.factory();
  MseOverMqttPlugin.VERSION = VERSION;
  MseOverMqttPlugin.utils = utils;

  return MseOverMqttPlugin;
};
