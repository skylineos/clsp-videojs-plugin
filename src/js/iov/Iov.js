'use strict';

import uuidv4 from 'uuid/v4';

import IovPlayer from './IovPlayer';
import utils from '../utils';
import Logger from '../utils/logger';
import StreamConfiguration from './StreamConfiguration';

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

export default class Iov {
  static EVENT_NAMES = [
    'metric',
    'unsupportedMimeCodec',
    'firstFrameShown',
    'videoReceived',
    'videoInfoReceived',
  ];

  static METRIC_TYPES = [];

  static factory (videoElementId, streamConfiguration, options) {
    return new Iov(videoElementId, streamConfiguration, options);
  }

  constructor (videoElementId, streamConfiguration, options = {}) {
    if (!utils.supported()) {
      throw new Error('You are using an unsupported browser - Unable to play CLSP video');
    }

    if (!videoElementId) {
      throw new Error('videoElementId is required to construct an Iov');
    }

    if (!StreamConfiguration.isStreamConfiguration(streamConfiguration)) {
      throw new Error('invalid streamConfiguration passed to iov constructor');
    }

    // This should be unique - it is only used for logging
    this.id = options.id || uuidv4();

    this.streamConfiguration = streamConfiguration;

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
        }, 2000);
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
      }, 1000);

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

  async initialize () {
    this.logger.debug('Initializing...');

    const clspVideoElement = this._prepareVideoElement();
    const iovPlayer = IovPlayer.factory(this.id, clspVideoElement);

    this._registerPlayerListeners(iovPlayer);

    await iovPlayer.initialize(this.streamConfiguration);

    this.iovPlayer = iovPlayer;
  }

  async changeSrc (url, onPlayerVisible = () => {}) {
    this.logger.debug('Changing Stream...');

    const clspVideoElement = this._prepareVideoElement();
    const iovPlayer = IovPlayer.factory(this.id, clspVideoElement);
    const streamConfiguration = StreamConfiguration.fromUrl(url);

    this._registerPlayerListeners(iovPlayer);

    await iovPlayer.initialize(streamConfiguration);

    iovPlayer.on('firstFrameShown', () => {
      setTimeout(() => {
        this.iovPlayer.stop();
        this.iovPlayer.destroy();
        this.streamConfiguration.destroy();

        this.streamConfiguration = streamConfiguration;
        this.iovPlayer = iovPlayer;

        onPlayerVisible();
      }, 0.5 * 1000);
    });

    await iovPlayer.play();
  }

  clone (streamConfiguration) {
    this.logger.debug('clone');

    const newStreamConfiguration = streamConfiguration.clone();

    // @todo - is it possible to reuse the iov player?
    return Iov.factory(this.videoElement, newStreamConfiguration);
  }

  cloneFromUrl (url) {
    this.logger.debug('cloneFromUrl');

    const clone = this.clone(StreamConfiguration.generateConfigFromUrl(url));

    return clone;
  }

  async play () {
    await this.iovPlayer.play();
  }

  async stop () {
    await this.iovPlayer.stop();
  }

  async restart () {
    await this.iovPlayer.restart();
  }

  enterFullscreen () {
    this.iovPlayer.enterFullscreen();
  }

  exitFullscreen () {
    this.iovPlayer.exitFullscreen();
  }

  toggleFullscreen () {
    this.iovPlayer.toggleFullscreen();
  }

  /**
   * Dereference the necessary properties, clear any intervals and timeouts, and
   * remove any listeners.  Will also destroy the player.
   *
   * @returns {void}
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

    this.iovPlayer.destroy();
    this.iovPlayer = null;

    this.videoElement = null;
    this.videoElementParent = null;

    this.events = null;
    this.metrics = null;
  }
}
