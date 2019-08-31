'use strict';

import uuidv4 from 'uuid/v4';

import Source from './Source';
import Conduit from './conduit/Conduit';
import IOVPlayer from './player';
import utils from '../utils';
import Logger from '../utils/logger';

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

export default class IOV {
  static EVENT_NAMES = [
    'metric',
    'firstFrameShown',
    'videoReceived',
    'videoInfoReceived',
  ];

  static METRIC_TYPES = [];

  static factory (videoElement, config = {}) {
    return new IOV(videoElement, config);
  }

  static fromSource (source, videoElement, config = {}) {
    const iov = IOV.factory(videoElement, config);

    iov.addSource(source);

    return iov;
  }

  constructor (videoElement, config) {
    if (!utils.supported()) {
      throw new Error('You are using an unsupported browser - Unable to play CLSP video');
    }

    // The ID of the IOV can be controlled by the called (for now) because there
    // are use cases when clone where the ID needs to be the same.  Also, the
    // IOV Collection instance that controls this IOV creates the IDs
    // sequentially, and therefore can and should control them.
    this.id = config.id || uuidv4();
    this.logger = Logger().factory(`IOV ${this.id}`);

    this.logger.debug('Constructing...');

    this.conduit = Conduit.factory();
    this.sources = [];
    this.metrics = {};

    // @todo - there must be a more proper way to do events than this...
    this.events = {};

    for (let i = 0; i < IOV.EVENT_NAMES.length; i++) {
      this.events[IOV.EVENT_NAMES[i]] = [];
    }

    this.destroyed = false;
    this.onReadyAlreadyCalled = false;
    this.videoElement = videoElement;
    this.eid = this.videoElement.id;

    const { visibilityChangeEventName } = utils.windowStateNames;

    if (visibilityChangeEventName) {
      document.addEventListener( visibilityChangeEventName, this.onVisibilityChange, false);
    }

    window.addEventListener('online', this.onConnectionChange, false);
    window.addEventListener('offline', this.onConnectionChange, false);
  }

  on (name, action) {
    this.logger.debug(`Registering Listener for ${name} event...`);

    if (!IOV.EVENT_NAMES.includes(name)) {
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

    if (!IOV.EVENT_NAMES.includes(name)) {
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

    if (!IOV.METRIC_TYPES.includes(type)) {
      // @todo - should this throw?
      return;
    }

    this.metrics[type] = value;

    this.trigger('metric', {
      type,
      value: this.metrics[type],
    });
  }

  addSource (source, play = true) {
    this.sources.push(source);

    if (play) {
      return this.play(source);
    }

    return this;
  }

  addSources (sources) {
    if (!Array.isArray(sources)) {
      throw new Error('Sources must be an array');
    }

    sources.forEach((source) => {
      this.addSource(source, false);
    })

    return this;
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

    this.player = IOVPlayer.factory(this, this.videoElement);

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

    await this.conduit.initialize(videoElementParent);

    return this;
  }

  clone (config = {}) {
    this.logger.debug('clone');

    // @todo - is it possible to reuse the iov player?
    const iov = IOV.factory(
      this.videoElement,
      {
        ...config,
      }
    );

    // @todo - do we need to worry about the fact that we are reusing these
    // source objects and not cloning them?
    iov.addSources(this.sources);

    return iov;
  }

  async play (source) {
    // If a source was not passed, but a stream has been played, use the most
    // recently played stream source.
    if (!source && this.activeStream) {
      source = this.activeStream.source;
    }

    // If the source was not passed and there is not a recently played stream
    // source, try the first one that was added, if it exists.
    if (!source) {
      source = this.sources[0];
    }

    if (!Source.isSource(source)) {
      throw new Error('A valid source is required to play');
    }

    await this.player.play(source);
  }

  async stop () {
    await this.player.stop();
  }

  async restart () {
    await this.stop();
    await this.play();
  }

  async _play (source, onMoov, onMoof, onChange) {
    if (!Source.isSource(source)) {
      throw new Error('A valid source is required to _play');
    }

    if (this.player.stopped) {
      return;
    }

    const activeStream = await this.conduit.play(source, onMoov, onMoof, onChange);

    this.activeStream = activeStream;

    return activeStream;
  }

  _stop () {
    this.conduit.stop();
  }

  resyncStream (activeStreamGuid, cb) {
    this.conduit.resyncStream(activeStreamGuid, cb);
  }

  onAppendStart (byteArray) {
    this.conduit.segmentUsed(byteArray);
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
   * remove any listeners.  Will also destroy the player and the conduit.
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

    this.conduit.destroy();
    this.conduit = null;

    this.events = null;
    this.metrics = null;
  }
}
