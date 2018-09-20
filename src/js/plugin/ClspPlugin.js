'use strict';

// @todo - can webpack be configured to process this without having
// include it like this?
import '~styles/clsp-videojs-plugin.scss';

import Debug from 'debug';
import Paho from 'paho-client';

// This is configured as an external library by webpack, so the caller must
// provide videojs on `window`
import videojs from 'video.js';

import utils from '~/utils/utils';
import MqttSourceHandler from './MqttSourceHandler';
import MqttConduitCollection from './MqttConduitCollection';

const Plugin = videojs.getPlugin('plugin');

export default (defaults = {}) => class ClspPlugin extends Plugin {
  static VERSION = utils.version;

  static utils = utils;

  static conduits = MqttConduitCollection.factory();

  static METRIC_TYPES = [
    'videojs.errorRetriesCount',
  ];

  static register () {
    if (videojs.getPlugin(utils.name)) {
      throw new Error('You can only register the clsp plugin once, and it has already been registered.');
    }

    window.Paho = Paho;

    const sourceHandler = MqttSourceHandler.factory('html5', ClspPlugin.conduits);

    videojs.getTech('Html5').registerSourceHandler(sourceHandler, 0);
    videojs.registerPlugin(utils.name, ClspPlugin);

    return ClspPlugin;
  }

  static getDefaultOptions () {
    return {
      /**
       * The number of times to retry playing the video when there is an error
       * that we know we can recover from.
       *
       * If a negative number is passed, retry indefinitely
       * If 0 is passed, never retry
       * If a positive number is passed, retry that many times
       */
      maxRetriesOnError: -1,
      enableMetrics: false,
    };
  }

  constructor (player, options) {
    super(player, options);

    this.debug = Debug('skyline:clsp:plugin:ClspPlugin');
    this.debug('constructing...');

    this.options = videojs.mergeOptions({
      ...this.constructor.getDefaultOptions(),
      ...defaults,
      ...(player.options().clsp || {})
    }, options);

    player.addClass('vjs-clsp');

    if (this.options.customClass) {
      player.addClass(this.options.customClass);
    }

    // Support for the videojs-errors library
    if (player.errors) {
      player.errors({
        errors: {
          PLAYER_ERR_NOT_COMPAT: {
            type: 'PLAYER_ERR_NOT_COMPAT',
            headline: 'This browser is unsupported.',
            message: 'Chrome 52+ is required.',
          },
        },
        timeout: 120 * 1000,
      });
    }

    // @todo - this error doesn't work or display the way it's intended to
    if (!utils.supported()) {
      return player.error({
        code: 'PLAYER_ERR_NOT_COMPAT',
        type: 'PLAYER_ERR_NOT_COMPAT',
        dismiss: false,
      });
    }

    // for debugging...
    /*
    const oldTrigger = player.trigger.bind(player);
    player.trigger = (eventName, ...args) => {
      console.log(eventName);
      console.log(...args);
      oldTrigger(eventName, ...args);
    };
    */

    // Track the number of times we've retried on error
    player._errorRetriesCount = 0;

    // Needed to make videojs-errors think that the video is progressing
    // If we do not do this, videojs-errors will give us a timeout error
    player._currentTime = 0;
    player.currentTime = () => player._currentTime++;

    // @todo - are we not using videojs properly?
    // @see - https://github.com/videojs/video.js/issues/5233
    // @see - https://jsfiddle.net/karstenlh/96hrzp5w/
    // This is currently needed for autoplay.
    player.on('ready', () => {
      if (this.options.autoplay || player.getAttribute('autoplay') === 'true') {
        // Even though the "ready" event has fired, it's not actually ready...
        setTimeout(() => {
          player.play();
        });
      }
    });

    // @todo - this seems like we aren't using videojs properly
    player.on('error', (event) => {
      const error = player.error();

      switch (error.code) {
        case 4:
        case 5:
        case 'PLAYER_ERR_IOV': {
          break;
        }
        default: {
          if (this.options.maxRetriesOnError === 0) {
            break;
          }

          if (this.options.maxRetriesOnError < 0 || player._errorRetriesCount <= this.options.maxRetriesOnError) {
            // @todo - when can we reset this to zero?
            player._errorRetriesCount++;

            this.metric({
              type: 'videojs.errorRetriesCount',
              value: player._errorRetriesCount,
            });

            // @see - https://github.com/videojs/video.js/issues/4401
            player.error(null);
            player.errorDisplay.close();
            player.tech(true).mqtt.iov.player.restart();
          }
        }
      }
    });

    // @todo - we are currently creating the IOV for this player on `firstplay`
    // but we could do it on the `ready` event.  However, in order to support
    // this, we need to make the IOV and its player able to be instantiated
    // without automatically playing AND without automatically listening via
    // a conduit
    player.on('firstplay', (event) => {
      this.debug('on player firstplay');

      const mqttHandler = player.tech(true).mqtt;

      if (!mqttHandler) {
        throw new Error(`VideoJS Player ${player.id()} does not have mqtt tech!`);
      }

      mqttHandler.createIOV(player, {
        enableMetrics: this.options.enableMetrics,
      });

      // Any time a metric is received, let the caller know
      mqttHandler.iov.player.on('metric', (metric) => {
        // @see - https://docs.videojs.com/tutorial-plugins.html#events
        // Note that I originally tried to trigger this event on the player
        // rather than the tech, but that causes the video not to play...
        this.metric(metric);
      });
    });

    player.on('dispose', () => {
      const mqttHandler = player.tech(true).mqtt;

      if (!mqttHandler) {
        throw new Error(`VideoJS Player ${player.id()} does not have mqtt tech!`);
      }

      mqttHandler.destroy();
    });
  }

  metric (metric) {
    if (this.options.enableMetrics) {
      this.trigger('metric', { metric });
    }
  }

  destroy () {
    this.debug('destroying...');

    this.debug = null;
  }
};
