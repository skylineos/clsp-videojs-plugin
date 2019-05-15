'use strict';

import uuidv4 from 'uuid/v4';

import Conduit from '../conduit/Conduit';
import IOVPlayer from './player';
import MSEWrapper from './MSEWrapper';
import utils from '../utils';
import Logger from '../utils/logger';

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

export default class IOV {
  static EVENT_NAMES = [
    'metric',
    'unsupportedMimeCodec',
    'firstFrameShown',
    'videoReceived',
    'videoInfoReceived',
  ];

  static METRIC_TYPES = [];

  static generateConfigFromUrl (url) {
    if (!url) {
      throw new Error('No source was given to be parsed!');
    }

    // We use an anchor tag here beacuse, when an href is added to
    // an anchor dom Element, the parsing is done for you by the
    // browser.
    const parser = document.createElement('a');

    let useSSL;
    let default_port;
    let jwtUrl;
    let b64_jwt_access_url = '';
    let jwt = '';

    // Chrome is the only browser that allows non-http protocols in
    // the anchor tag's href, so change them all to http here so we
    // get the benefits of the anchor tag's parsing
    if (url.substring(0, 9).toLowerCase() === 'clsps-jwt') {
      useSSL = true;
      parser.href = url.replace('clsps-jwt', 'https');
      default_port = 443;
      jwtUrl = true;
    }
    else if (url.substring(0, 8).toLowerCase() === 'clsp-jwt') {
      useSSL = false;
      parser.href = url.replace('clsp-jwt', 'http');
      default_port = 9001;
      jwtUrl = true;
    }
    else if (url.substring(0, 5).toLowerCase() === 'clsps') {
      useSSL = true;
      parser.href = url.replace('clsps', 'https');
      default_port = 443;
      jwtUrl = false;
    }
    else if (url.substring(0, 4).toLowerCase() === 'clsp') {
      useSSL = false;
      parser.href = url.replace('clsp', 'http');
      default_port = 9001;
      jwtUrl = false;
    }
    else {
      throw new Error('The given source is not a clsp url, and therefore cannot be parsed.');
    }

    const paths = parser.pathname.split('/');
    const streamName = paths[paths.length - 1];

    let hostname = parser.hostname;
    let port = parser.port;

    if (port.length === 0) {
      port = default_port;
    }

    port = parseInt(port);

    // @ is a special address meaning the server that loaded the web page.
    if (hostname === '@') {
      hostname = window.location.hostname;
    }

    // if jwt extract required url parameters.
    if (jwtUrl === true) {
      // Url: clsp[s]-jwt://<sfs addr>[:9001]/<jwt>?Start=...&End=...
      const qp_offset = url.indexOf(parser.pathname)+parser.pathname.length;

      const qr_args = url.substr(qp_offset).split('?')[1];
      const query = {};

      const pairs = qr_args.split('&');
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      }

      if (typeof query.Start === 'undefined') {
        throw new Error("Required 'Start' query parameter not defined for a clsp[s]-jwt");
      }

      if (typeof query.End === 'undefined') {
        throw new Error("Required 'End' query parameter not defined for a clsp[s]-jwt");
      }

      const protocol = useSSL
        ? 'clsps-jwt'
        : 'clsp-jwt';

      const url = `${protocol}://${hostname}:${port}/jwt?Start=${query.Start}&End=${query.End}`;

      b64_jwt_access_url = window.btoa(url);
      jwt = query.token;
    }

    return {
      wsbroker: hostname,
      wsport: port,
      streamName,
      useSSL,
      b64_jwt_access_url,
      jwt,
    };
  }

  static factory (videoElement, config = {}) {
    return new IOV(videoElement, config);
  }

  static fromUrl (
    url,
    videoElement,
    config = {}
  ) {
    return IOV.factory(videoElement, {
      ...config,
      ...IOV.generateConfigFromUrl(url),
    });
  }

  constructor (videoElement, config) {
    if (!utils.supported()) {
      throw new Error('You are using an unsupported browser - Unable to play CLSP video');
    }

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
    this.onReadyAlreadyCalled = false;
    this.videoElement = videoElement;
    this.eid = this.videoElement.id;

    this.config = {
      clientId: this.id,
      wsbroker: config.wsbroker,
      wsport: config.wsport,
      useSSL: config.useSSL,
      streamName: config.streamName,
      appStart: config.appStart,
      jwt: config.jwt,
      b64_jwt_access_url: config.b64_jwt_access_url,
    };

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

    this.player = IOVPlayer.factory(
      this,
      this.videoElement,
      {
        id: this.id,
      }
    );

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

    this.conduit = Conduit.factory(this.config.clientId, {
      wsbroker: this.config.wsbroker,
      wsport: this.config.wsport,
      useSSL: this.config.useSSL,
      b64_jwt_access_url: this.config.b64_jwt_access_url,
      jwt: this.config.jwt,
    });

    await this.conduit.initialize(videoElementParent);
  }

  clone (config) {
    this.logger.debug('clone');

    const clonedConfig = {
      ...config,
    };

    // @todo - is it possible to reuse the iov player?
    return IOV.factory(this.videoElement, clonedConfig);
  }

  cloneFromUrl (url, config = {}) {
    this.logger.debug('cloneFromUrl');

    return this.clone({
      ...IOV.generateConfigFromUrl(url),
      ...config,
    });
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

  async _play (onMoov, onMoof) {
    if (this.player.stopped) {
      return;
    }

    const {
      // guid,
      mimeCodec,
      moov,
    } = await this.conduit.play(this.config.streamName, onMoof);

    if (!MSEWrapper.isMimeCodecSupported(mimeCodec)) {
      this.trigger('unsupportedMimeCodec', `Unsupported mime codec: ${mimeCodec}`);
      this.stop();
    }

    if (onMoov) {
      onMoov(mimeCodec, moov);
    }
  }

  _stop () {
    this.conduit.stop();
  }

  resyncStream (cb) {
    this.conduit.resyncStream(cb);
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
