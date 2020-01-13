'use strict';

import uuidv4 from 'uuid/v4';

import Logger from '../utils/logger';
import utils from '../utils';

import IovPlayer from './IovPlayer';
import StreamConfiguration from './StreamConfiguration';

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

export default class Iov {
  static CONNECTION_CHANGE_PLAY_DELAY = 2;
  static VISIBILITY_CHANGE_STOP_DELAY = 1;
  static SHOW_NEXT_VIDEO_DELAY = 0.25;

  static EVENT_NAMES = [
    'metric',
    'unsupportedMimeCodec',
    'firstFrameShown',
    'videoReceived',
    'videoInfoReceived',
  ];

  static METRIC_TYPES = [];

  static factory (videoElementId, options) {
    return new Iov(videoElementId, options);
  }

  /**
   * @param {String} videoElementId
   * @param {Object} [options]
   */
  constructor (videoElementId, options = {}) {
    if (!utils.supported()) {
      throw new Error('You are using an unsupported browser - Unable to play CLSP video');
    }

    if (!videoElementId) {
      throw new Error('videoElementId is required to construct an Iov');
    }

    // This should be unique - it is only used for logging
    this.id = options.id || uuidv4();

    this.logger = Logger().factory(`Iov ${this.id}`);
    this.logger.debug('Constructing...');

    this.metrics = {};

    // @todo - there must be a more proper way to do events than this...
    this.events = {};

    for (let i = 0; i < Iov.EVENT_NAMES.length; i++) {
      this.events[Iov.EVENT_NAMES[i]] = [];
    }

    this.destroyed = false;
    this.onReadyAlreadyCalled = false;
    this.videoElementId = videoElementId;
    this.videoElementParent = null;
    this.iovPlayerCount = 0;

    const {
      visibilityChangeEventName,
    } = utils.windowStateNames;

    if (visibilityChangeEventName) {
      document.addEventListener(
        visibilityChangeEventName,
        this.onVisibilityChange,
        false
      );
    }

    window.addEventListener(
      'online',
      this.onConnectionChange,
      false
    );

    window.addEventListener(
      'offline',
      this.onConnectionChange,
      false
    );
  }

  on (name, action) {
    this.logger.debug(`Registering Listener for ${name} event...`);

    if (!Iov.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    if (this.destroyed) {
      return;
    }

    this.events[name].push(action);
  }

  trigger (name, value) {
    const sillyMetrics = [];

    if (sillyMetrics.includes(name)) {
      this.logger.silly(`Triggering ${name} event...`);
    }
    else {
      this.logger.debug(`Triggering ${name} event...`);
    }

    if (this.destroyed) {
      return;
    }

    if (!Iov.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    for (let i = 0; i < this.events[name].length; i++) {
      this.events[name][i](value, this);
    }
  }

  metric (type, value) {
    if (!this.options.enableMetrics) {
      return;
    }

    if (!Iov.METRIC_TYPES.includes(type)) {
      // @todo - should this throw?
      return;
    }

    this.metrics[type] = value;

    this.trigger('metric', {
      type,
      value: this.metrics[type],
    });
  }

  onConnectionChange = () => {
    if (window.navigator.onLine) {
      this.logger.debug('Back online...');
      if (this.iovPlayer.stopped) {
        // Without this timeout, the video appears blank.  Not sure if there is
        // some race condition...
        setTimeout(() => {
          this.play();
        }, Iov.CONNECTION_CHANGE_PLAY_DELAY * 1000);
      }
    }
    else {
      this.logger.debug('Offline!');
      this.stop();
    }
  };

  onVisibilityChange = () => {
    const {
      hiddenStateName,
    } = utils.windowStateNames;

    if (document[hiddenStateName]) {
      // Stop playing when tab is hidden or window is minimized
      this.visibilityChangeTimeout = setTimeout(async () => {
        this.logger.debug('Stopping because tab is not visible...');
        await this.stop();
      }, Iov.VISIBILITY_CHANGE_STOP_DELAY * 1000);

      return;
    }

    if (this.visibilityChangeTimeout) {
      clearTimeout(this.visibilityChangeTimeout);
    }

    if (this.iovPlayer.stopped) {
      this.logger.debug('Playing because tab became visible...');
      this.play();
    }
  };

  _prepareVideoElement () {
    const videoElement = window.document.getElementById(this.videoElementId);

    // If we have no elements to work with, throw an error
    if (!videoElement) {
      throw new Error(`Unable to find an element in the DOM with id "${this.videoElementId}".`);
    }

    if (!this.videoElementParent) {
      videoElement.style.display = 'none';
      this.videoElementParent = videoElement.parentNode;
    }

    if (!this.videoElementParent) {
      throw new Error('There is no iframe container element to attach the iframe to!');
    }

    this.videoElementParent.classList.add('clsp-video-container');

    const clspVideoElement = window.document.createElement('video');
    clspVideoElement.classList.add('clsp-video');
    clspVideoElement.muted = true;

    // @todo - is it ok that the most recent video is always first?  what about
    // the spinner or the not-supported text
    this.videoElementParent.insertBefore(clspVideoElement, this.videoElementParent.childNodes[0]);

    return clspVideoElement;
  }

  _registerPlayerListeners (iovPlayer) {
    // @todo - this seems to be videojs specific, and should be removed or moved
    // somewhere else
    iovPlayer.on('firstFrameShown', () => {
      this.trigger('firstFrameShown');
    });

    iovPlayer.on('videoReceived', () => {
      this.trigger('videoReceived');
    });

    iovPlayer.on('videoInfoReceived', () => {
      this.trigger('videoInfoReceived');
    });
  }

  generatePlayerLogId () {
    return `iov:${this.id}.player:${++this.iovPlayerCount}`;
  }

  /**
   * @param {StreamConfiguration|String} url
   *   The StreamConfiguration or url of the new stream
   */
  async changeSrc (url) {
    this.logger.debug('Changing Stream...');

    if (!url) {
      throw new Error('url is required to changeSrc');
    }

    // Handle the case of multiple changeSrc requests.  Only change to the last
    // stream that was requested
    if (this.pendingChangeSrcIovPlayer) {
      clearTimeout(this.changeSrcTimeout);
      this.changeSrcTimeout = null;

      // @todo - should we await this?
      this.pendingChangeSrcIovPlayer.destroy();
      this.pendingChangeSrcIovPlayer = null;
    }

    const clspVideoElement = this._prepareVideoElement();
    const iovPlayer = IovPlayer.factory(
      this.generatePlayerLogId(),
      clspVideoElement,
      () => this.changeSrc(this.streamConfiguration)
    );

    this.pendingChangeSrcIovPlayer = iovPlayer;

    this._registerPlayerListeners(iovPlayer);

    const streamConfiguration = StreamConfiguration.isStreamConfiguration(url)
      ? url
      : StreamConfiguration.fromUrl(url);

    await iovPlayer.initialize(streamConfiguration);

    const firstFramePromise = new Promise((resolve, reject) => {
      iovPlayer.on('firstFrameShown', () => {
        this.changeSrcTimeout = setTimeout(() => {
          this.logger.debug('Destroying old player...');

          if (this.iovPlayer) {
            // async, but we don't need to wait for it
            this.iovPlayer.destroy();
          }

          this.iovPlayer = iovPlayer;
          this.streamConfiguration = streamConfiguration;

          this.changeSrcTimeout = null;
          this.pendingChangeSrcIovPlayer = false;

          resolve();
        }, Iov.SHOW_NEXT_VIDEO_DELAY * 1000);
      });
    });

    // @todo - should the play method only resolve once the first frame has
    // been shown?  right now it resolves on first moof recevied
    await this.play(iovPlayer);

    return firstFramePromise;
  }

  /**
   * @param {StreamConfiguration|url} streamConfiguration
   *   The StreamConfiguration or url of the stream to use with the cloned
   *   player
   */
  clone (streamConfiguration = this.streamConfiguration) {
    this.logger.debug('clone');

    const newStreamConfiguration = StreamConfiguration.isStreamConfiguration(streamConfiguration)
      ? streamConfiguration.clone()
      : StreamConfiguration.fromUrl(streamConfiguration);

    // @todo - is it possible to reuse the iov player?
    return Iov.factory(this.videoElement, newStreamConfiguration);
  }

  async play (iovPlayer = this.iovPlayer) {
    this.logger.debug('Play');

    try {
      await iovPlayer.play();
    }
    catch (error) {
      this.logger.debug('Play error - destroying');
      // @todo - display a message in the page saying that the stream couldn't
      // be played
      await iovPlayer.destroy();

      throw error;
    }
  }

  async stop (iovPlayer = this.iovPlayer) {
    this.logger.debug('Stop');
    await iovPlayer.stop();
  }

  enterFullscreen (iovPlayer = this.iovPlayer) {
    this.logger.debug('Enter fullscreen');
    iovPlayer.enterFullscreen();
  }

  exitFullscreen (iovPlayer = this.iovPlayer) {
    this.logger.debug('Exit fullscreen');
    iovPlayer.exitFullscreen();
  }

  toggleFullscreen (iovPlayer = this.iovPlayer) {
    this.logger.debug('Toggle fullscreen');
    iovPlayer.toggleFullscreen();
  }

  /**
   * Dereference the necessary properties, clear any intervals and timeouts, and
   * remove any listeners.  Will also destroy the player.
   *
   * @returns {Promise}
   */
  destroy () {
    this.logger.debug('destroy');

    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    const {
      visibilityChangeEventName,
    } = utils.windowStateNames;

    if (visibilityChangeEventName) {
      document.removeEventListener(visibilityChangeEventName, this.onVisibilityChange);
    }

    window.removeEventListener('online', this.onConnectionChange);
    window.removeEventListener('offline', this.onConnectionChange);

    const iovPlayerDestroyPromise = this.iovPlayer
      ? this.iovPlayer.destroy()
      : Promise.resolve();

    this.iovPlayer = null;
    this.streamConfiguration = null;

    this.videoElement = null;
    this.videoElementParent = null;

    this.events = null;
    this.metrics = null;

    return iovPlayerDestroyPromise;
  }
}
