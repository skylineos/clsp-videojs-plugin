'use strict';

import uuidv4 from 'uuid/v4';

import Source from './Source';
import Sources from './Sources';
import Streamers from './conduit/Streamers';
import Player from './Player';
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

    this.metrics = {};

    // @todo - there must be a more proper way to do events than this...
    this.events = {};

    for (let i = 0; i < IOV.EVENT_NAMES.length; i++) {
      this.events[IOV.EVENT_NAMES[i]] = [];
    }

    this.destroyed = false;
    this.stopped = true;
    this.player = null;
    this.currentSource = null;
    this.videoElement = videoElement;
    // Cache this in the event that the video element is destroyed or detached
    this.eid = this.videoElement.id;

    const { visibilityChangeEventName } = utils.windowStateNames;

    if (visibilityChangeEventName) {
      document.addEventListener(visibilityChangeEventName, this.onVisibilityChange, false);
    }

    window.addEventListener('online', this.onConnectionChange, false);
    window.addEventListener('offline', this.onConnectionChange, false);

    this.sources = Sources.factory();
    this.streamers = Streamers.factory({ strict: true });
    this.player = Player.factory(this.videoElement, { id: this.id });
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

  onConnectionChange = () => {
    if (window.navigator.onLine) {
      this.logger.debug('Back online...');
      if (this.stopped) {
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

    if (this.stopped) {
      this.logger.debug('Playing because tab became visible...');
      this.play();
    }
  };

  addSource (source) {
    if (!Source.isSource(source)) {
      throw new Error('Cannot add an invalid Source to this IOV');
    }

    // If this is the first time we're getting a source for a particular host,
    // we must add a streamer for that host.
    if (!this.streamers.hasByHost(source)) {
      this.streamers.add(source.host, source.port, source.useSSL);
    }

    // Add the source to the streamers first so that if it fails, we do not have
    // an orphaned source in our internal sources collection
    this.streamers.addSource(source);
    this.sources.add(source);
  }

  async initialize () {
    this.logger.debug('Initializing...');

    if (!this.videoElement) {
      throw new Error(`Unable to find an element in the DOM with id "${this.eid}".`);
    }

    if (this.sources.count() === 0) {
      throw new Error('Unable to initialize IOV without a source.  Have you called addSource yet?');
    }

    this.videoElement.classList.add('clsp-video');

    // @todo - do we need to track this DOM element on this instance?
    const videoElementParent = this.videoElement.parentNode;

    if (!videoElementParent) {
      throw new Error('There is no iframe container element to attach the iframe to!');
    }

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

    this.player.on('segmentUsed', ({ activeStream, byteArray }) => {
      this.streamers.getByHost(activeStream.source).segmentUsed(byteArray);
    });

    this.player.on('stop', () => {
      // There may be times when the player encounters an error and needs to
      // stop itself.  In these instances, also call .stop on this IOV, if it
      // has not already been stopped.
      if (!this.stopped) {
        this.stop();
      }
    });

    // Initialize the streamers
    await this.streamers.forEach(async (streamer) => {
      await streamer.initialize(videoElementParent);
    });

    return this;
  }

  async stop () {
    this.streamer.stop();

    this.stopped = true;

    await this.player.stop();
  }

  async restart () {
    await this.stop();
    await this.play();
  }

  async play (
    source,
    onMoov = this.player.onMoov,
    onMoof = this.player.onMoof,
    onChange = this.player.onChange
  ) {
    // If a source was not passed, but a stream has been played, use the most
    // recently played stream source.
    if (!source && this.activeStream) {
      source = this.activeStream.source;
    }

    // If the source was not passed and there is not a recently played stream
    // source, try the first one that was added, if it exists.
    if (!source) {
      source = this.sources.first();
    }

    if (!Source.isSource(source)) {
      throw new Error('A valid source is required to play');
    }

    if (!this.sources.has(source)) {
      throw new Error('You must add this source to this IOV before this IOV can play it');
    }

    this.currentSource = source;

    // @todo - should this go after streamer.play?
    this.stopped = false;

    const streamer = await this.streamers.getByHost(this.currentSource);

    const activeStream = streamer.play(
      this.currentSource,
      async (activeStream) => {
        // @todo - this seems like a hack...
        if (this.stopped) {
          return;
        }

        await onMoov(activeStream);

        // @todo - this seems too tightly coupled, maybe it's not though, since
        // it is a resync event listener...
        streamer.resync(activeStream.guid, () => {
          // console.log('sync received re-initialize media source buffer');
          this.player.reinitializeMseWrapper(activeStream);
        });
      },
      (activeStream, mqttMessage) => {
        // @todo - this seems like a hack...
        if (this.stopped) {
          return;
        }

        onMoof(activeStream, mqttMessage);
      },
      onChange
    );

    this.activeStream = activeStream;

    return activeStream;
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

    this.streamers.destroy();
    this.streamers = null;

    this.sources.destroy();
    this.sources = null;

    this.events = null;
    this.metrics = null;

    this.currentSource = null;
    this.stopped = null;
  }
}
