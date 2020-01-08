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

  static factory (videoElement, streamConfiguration, options) {
    return new Iov(videoElement, streamConfiguration, options);
  }

  constructor (videoElement, streamConfiguration, options = {}) {
    if (!utils.supported()) {
      throw new Error('You are using an unsupported browser - Unable to play CLSP video');
    }

    if (!videoElement) {
      throw new Error('videoElement is required to construct an Iov');
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
    this.videoElement = videoElement;

    // Store this value in case the DOM element becomes unavailable
    this.eid = this.videoElement.id;

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
      if (this.player.stopped) {
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

    if (this.player.stopped) {
      this.logger.debug('Playing because tab became visible...');
      this.play();
    }
  };

  async initialize () {
    this.logger.debug('Initializing...');

    if (!this.videoElement) {
      throw new Error(`Unable to find an element in the DOM with id "${this.eid}".`);
    }

    this.videoElement.classList.add('clsp-video');

    const videoElementParent = this.videoElement.parentNode;

    if (!videoElementParent) {
      throw new Error('There is no iframe container element to attach the iframe to!');
    }

    this.player = IovPlayer.factory(this.id, this.videoElement);

    // @todo - this seems to be videojs specific, and should be removed or moved
    // somewhere else
    this.player.on('firstFrameShown', () => {
      // @todo - this may be overkill given the changeSourceMaxWait...
      // When the video is ready to be displayed, swap out the video player if
      // the source has changed.  This is what allows tours to switch to the next
      try {
        let videos = videoElementParent.getElementsByTagName('video');

        for (let i = 0; i < videos.length; i++) {
          let video = videos[i];
          const id = video.getAttribute('id');

          if (id !== this.eid) {
            // video.pause();
            // video.removeAttribute('src');
            // video.load();
            // video.style.display = 'none';
            videoElementParent.removeChild(video);
            video.remove();
            video = null;
            videos = null;
            break;
          }
        }

        // videoElementParent.replaceChild(this.videoElement, this.videoJsVideoElement);
        // is there still a reference to this element?
        // this.videoJsVideoElement = null;
      }
      catch (error) {
        this.logger.error(error);
      }

      this.trigger('firstFrameShown');
    });

    this.player.on('videoReceived', () => {
      this.trigger('videoReceived');
    });

    this.player.on('videoInfoReceived', () => {
      this.trigger('videoInfoReceived');
    });

    await this.player.initialize(this.streamConfiguration);
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
    await this.player.play();
  }

  async stop () {
    await this.player.stop();
  }

  async restart () {
    await this.stop();
    await this.play();
  }

  async _changeSrcConfig (streamConfiguration) {
    const videoElementParent = this.videoElement.parentNode;

    if (!videoElementParent) {
      throw new Error('There is no iframe container element to attach the iframe to!');
    }

    // const clientId = uuidv4();

    // this.player.initialize(streamConfiguration);

    // // @todo - this seems to be videojs specific, and should be removed or moved
    // // somewhere else
    // player.on('firstFrameShown', () => {
    //   // @todo - this may be overkill given the changeSourceMaxWait...
    //   // When the video is ready to be displayed, swap out the video player if
    //   // the source has changed.  This is what allows tours to switch to the next
    //   try {
    //     let videos = videoElementParent.getElementsByTagName('video');

    //     for (let i = 0; i < videos.length; i++) {
    //       let video = videos[i];
    //       const id = video.getAttribute('id');

    //       if (id !== this.eid) {
    //         // video.pause();
    //         // video.removeAttribute('src');
    //         // video.load();
    //         // video.style.display = 'none';
    //         videoElementParent.removeChild(video);
    //         video.remove();
    //         video = null;
    //         videos = null;
    //         break;
    //       }
    //     }

    //     // videoElementParent.replaceChild(this.videoElement, this.videoJsVideoElement);
    //     // is there still a reference to this element?
    //     // this.videoJsVideoElement = null;
    //   } catch (error) {
    //     this.logger.error(error);
    //   }

    //   this.trigger('firstFrameShown');
    // });

    // player.on('videoReceived', () => {
    //   this.trigger('videoReceived');
    // });

    // player.on('videoInfoReceived', () => {
    //   this.trigger('videoInfoReceived');
    // });

    // console.log('READY');

    // if (this.player) {
    //   this.player.stop();
    // }

    // await this.player.play();

    // ConduitCollection.asSingleton().remove(this.clientId);

    // this.player = player;
    // this.clientId = clientId;
  }

  async changeSrc (url) {
    const streamConfiguration = StreamConfiguration.generateConfigFromUrl(url);

    await this._changeSrcConfig(streamConfiguration);
  }

  enterFullscreen () {
    if (!document.fullscreenElement) {
      this.videoElement.requestFullscreen();
    }
  }

  exitFullscreen () {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  toggleFullscreen () {
    if (!document.fullscreenElement) {
      this.enterFullscreen();
    }
    else {
      this.exitFullscreen();
    }
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

    this.player.destroy();
    this.player = null;

    this.events = null;
    this.metrics = null;
  }
}
