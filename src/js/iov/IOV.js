'use strict';

// Needed for crossbrowser iframe support
// @todo - isn't this needed in conduit or something?
import 'srcdoc-polyfill';

import ListenerBaseClass from '~/utils/ListenerBaseClass';
import IOVPlayer from './Player';

const DEFAULT_NON_SSL_PORT = 9001;
const DEFAULT_SSL_PORT = 443;

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

//  @todo - should this be the videojs component?  it seems like the
// mqttHandler does nothing, and that this could replace it
export default class IOV extends ListenerBaseClass {
  static DEFAULT_OPTIONS = {
    // autoplay: false,
    changeSourceImmediately: false,
    changeSourceWait: true,
    changeSourceMaxWait: 15 * 1000,
    changeSourceReadyDelay: 1.5 * 1000,
    statsInterval: 30 * 1000,
    defaultNonSslPort: DEFAULT_NON_SSL_PORT,
    defaultSslPort: DEFAULT_SSL_PORT,
  };

  static EVENT_NAMES = [
    ...ListenerBaseClass.EVENT_NAMES,
    'onReadyCalledMultipleTimes',
    'handlerError',
    'criticalError',
  ];

  // @todo - implement some metrics
  static METRIC_TYPES = [
    'iov.instances',
    'iov.clientId',
  ];

  static generateConfigFromUrl (url, options = {}) {
    if (!url) {
      throw new Error('No source was given to be parsed!');
    }

    // We use an anchor tag here beacuse, when an href is added to
    // an anchor dom Element, the parsing is done for you by the
    // browser.
    const parser = document.createElement('a');

    let useSSL;
    let default_port;

    // Chrome is the only browser that allows non-http protocols in
    // the anchor tag's href, so change them all to http here so we
    // get the benefits of the anchor tag's parsing
    if (url.substring(0, 5).toLowerCase() === 'clsps') {
      useSSL = true;
      parser.href = url.replace('clsps', 'https');
      default_port = options.defaultSslPort || DEFAULT_SSL_PORT;
    }
    else if (url.substring(0, 4).toLowerCase() === 'clsp') {
      useSSL = false;
      parser.href = url.replace('clsp', 'http');
      default_port = options.defaultNonSslPort || DEFAULT_NON_SSL_PORT;
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

    // @ is a special address meaning the server that loaded the web page.
    if (hostname === '@') {
      hostname = window.location.hostname;
    }

    return {
      // url,
      wsbroker: hostname,
      wsport: parseInt(port),
      streamName,
      useSSL,
    };
  }

  static factory (mqttConduitCollection, player, config = {}, options = {}) {
    return new IOV(
      mqttConduitCollection,
      player,
      config,
      options
    );
  }

  static fromUrl (url, mqttConduitCollection, player, config = {}, options = {}) {
    return IOV.factory(
      mqttConduitCollection,
      player,
      {
        ...config,
        ...IOV.generateConfigFromUrl(url, options),
      },
      options
    );
  }

  constructor (mqttConduitCollection, player, config, options) {
    super(options);

    this.onReadyCalledMultipleTimes = false;
    // @todo - there must be a way to look this up on the player
    this.videoId = `${player.id()}_html5_api`;
    this.videoJsElement = document.getElementById(this.videoId);
    this.videoJsPlayer = player;
    this.videoElement = this.videoJsPlayer.el();
    this.firstFrameShown = false;

    this.config = {
      clientId: this.id,
      wsbroker: config.wsbroker,
      wsport: config.wsport,
      useSSL: config.useSSL,
      streamName: config.streamName,
      videoElementParent: config.videoElementParent || null,
    };

    // @todo - this needs to be a global service or something
    this.mqttConduitCollection = mqttConduitCollection;
  }

  onFirstMetricListenerRegistered () {
    super.onFirstMetricListenerRegistered();

    this.metric('iov.instances', 1);
    this.metric('iov.clientId', this.id);
  }

  initialize () {
    this.debug('initializing...');

    this.conduit = this.mqttConduitCollection.addFromIov(this, { enableMetrics: this.options.enableMetrics });

    this.conduit.on('metric', ({ type, value }) => {
      this.metric(type, value, true);
    });

    this.player = IOVPlayer.factory(this, { enableMetrics: this.options.enableMetrics });

    this.player.on('metric', ({ type, value }) => {
      this.metric(type, value, true);
    });

    this.player.on('maxMediaSourceRetriesExceeded', () => {
      this.trigger('criticalError');
    });

    this.player.on('videoReceived', () => {
      // reset the timeout monitor from videojs-errors
      this.videoJsPlayer.trigger('timeupdate');
    });

    this.player.on('videoInfoReceived', () => {
      // reset the timeout monitor from videojs-errors
      this.videoJsPlayer.trigger('timeupdate');
    });

    this.videoJsPlayer.on('changesrc', this.onChangeSource);

    this.videoElement.addEventListener('mse-error-event', this.onMseError, false);

    this.shouldPlayNext = true;

    if (this.options.changeSourceWait) {
      const changeSourceTimeout = setTimeout(() => {
        if (this.destroyed) {
          return;
        }

        this.shouldPlayNext = false;

        if (changeSourceTimeout) {
          clearTimeout(changeSourceTimeout);
        }

        if (!this.firstFrameShown) {
          // @todo - if the FIRST video in the tour fails, this should
          // trigger changeSourceImmediately instead...
          this.videoJsPlayer.trigger('readyForNextSource', true);
          this.player.trigger('readyForNextSource', true);
        }
      }, this.options.changeSourceMaxWait);
    }

    this.player.on('firstFrameShown', () => {
      if (!this.shouldPlayNext) {
        return;
      }

      this.firstFrameShown = true;

      // @todo - need to figure out when to show it
      this.videoJsPlayer.loadingSpinner.hide();

      setTimeout(() => {
        if (document.hidden) {
          return;
        }

        this.videoJsPlayer.trigger('readyForNextSource');
        this.player.trigger('readyForNextSource');
      }, this.options.changeSourceReadyDelay);
    });

    if (this.options.changeSourceImmediately) {
      // @todo - we probably should not mutate the options
      this.options.changeSourceImmediately = false;
      this.videoJsPlayer.trigger('changeSourceImmediately');
    }

    return this;
  }

  clone (config, options) {
    this.debug('cloning...');

    const cloneConfig = {
      ...config,
      videoElementParent: this.config.videoElementParent,
    };

    const clone = IOV.factory(
      this.mqttConduitCollection,
      this.videoJsPlayer,
      cloneConfig,
      options
    );

    return clone;
  }

  changeSource ({ src, type }) {
    this.debug(`changeSource on player "${this.id}""`);

    if (!src) {
      throw new Error('Unable to change source because there is no src!');
    }

    // @todo - the old tour/changesrc logic was able to reuse the existing
    // mqtt connection rather than creating a new one then destroying the
    // old one...  seems that that would be more efficient
    const clone = this.clone(IOV.generateConfigFromUrl(src, this.options), this.options);

    clone.initialize();

    clone.player.videoElement.style.display = 'none';

    clone.onVisibilityChange = () => {
      if (!document.hidden) {
        return;
      }

      document.removeEventListener('visibilitychange', clone.onVisibilityChange);

      try {
        this.destroy();
        clone.destroy();
      }
      catch (error) {
        console.error(error);
      }
    };

    document.addEventListener('visibilitychange', clone.onVisibilityChange);

    clone.player.on('readyForNextSource', (failure) => {
      if (clone.destroyed) {
        return;
      }

      if (failure) {
        clone.videoJsPlayer.error({
          code: 0,
          type: 'MEDIA_SOURCE_LOAD_FAILED',
          headline: 'MEDIA_SOURCE_LOAD_FAILED',
          message: `Unable to retrieve source: ${src}`,
        });

        this.player.destroy();
        clone.destroy();
      }
    });

    clone.player.on('firstFrameShown', () => {
      if (!clone.shouldPlayNext) {
        return;
      }

      // Make it visible right away to ensure there is no black frame
      // shown when the video elements transition
      setTimeout(() => {
        clone.player.videoElement.style.display = 'initial';
      }, clone.options.changeSourceReadyDelay / 2);

      setTimeout(() => {
        if (clone.destroyed) {
          return;
        }

        // At this point, the clone's videoElement should be showing
        // frames, which means the old iov player should be ready to
        // be hidden.  The player/videoElement may not exist if there
        // was a problem loading the previous stream
        if (this.player && this.player.videoElement) {
          this.player.videoElement.classList.add('hide');
        }

        clone.videoJsPlayer.tech(true).mqtt.updateIOV(clone);
        clone.videoJsPlayer.error(null);
        clone.videoJsPlayer.errorDisplay.close();
      }, clone.options.changeSourceReadyDelay);
    });

    // When the tab is not in focus, chrome doesn't handle things the same
    // way as when the tab is in focus, and it seems that the result of that
    // is that the "firstFrameShown" event never fires.  Having the IOV be
    // updated on a delay in case the "firstFrameShown" takes too long will
    // ensure that the old IOVs are destroyed, ensuring that unnecessary
    // socket connections, etc. are not being used, as this can cause the
    // browser to crash.
    // Note that if there is a better way to do this, it would likely reduce
    // the number of try/catch blocks and null checks in the IOVPlayer and
    // MSEWrapper, but I don't think that is likely to happen until the MSE
    // is standardized, and even then, we may be subject to non-intuitive
    // behavior based on tab switching, etc.

    // Under normal circumstances, meaning when the tab is in focus, we want
    // to respond by switching the IOV when the new IOV Player has something
    // to display
    // clone.player.on('firstFrameShown', () => {
    //   if (!iovUpdated) {
    //     clone.videoJsPlayer.tech(true).mqtt.updateIOV(clone);
    //   }
    // });
  }

  onMseError = () => {
    this.player.restart();
  };

  onChangeSource = (event, source) => {
    if (this.destroyed) {
      console.warn('tried to change source on a dead iov', this.id);
      this.videoJsPlayer.off('changesrc', this.onChangeSource);
      return;
    }

    return this.changeSource(source);
  }

  onReady (event) {
    this.debug('onReady');

    // @todo - why is this necessary?
    if (this.videoElement.parentNode !== null) {
      this.config.videoElementParentId = this.videoElement.parentNode.id;
    }

    if (this.onReadyCalledMultipleTimes) {
      console.error('tried to use this player more than once...');

      this.trigger('onReadyCalledMultipleTimes');

      return;
    }

    this.onReadyCalledMultipleTimes = true;

    // @todo - is this needed?  If so, it is in the wrong place.  This should
    // trigger "ready" if anything
    // if (this.options.autoplay) {
    //   this.videoJsPlayer.trigger('play');
    // }

    // @todo - this should never happen...
    if (this.player.destroyed) {
      return;
    }

    this.player.play(this.videoElement.firstChild.id, this.config.streamName);
  }

  onFail (event) {
    this.debug('onFail');

    this.debug('network error', event.data.reason);
    this.videoJsPlayer.trigger('network-error', event.data.reason);
  }

  onData (event) {
    this.silly('onData');

    const message = event.data;
    const topic = message.destinationName;

    try {
      const handler = this.conduit.getTopicHandler(topic);

      handler(message);
    }
    catch (error) {
      this.trigger('handlerError', error);
    }
  }

  onMessage (event) {
    if (this.destroyed) {
      return;
    }

    const eventType = event.data.event;

    this.silly('onMessage', eventType);

    switch (eventType) {
      case 'ready': {
        this.onReady(event);
        break;
      }
      case 'fail': {
        this.onFail(event);
        break;
      }
      case 'data': {
        this.onData(event);
        break;
      }
      default: {
        console.error(`No match for event: ${eventType}`);
      }
    }
  }

  destroy () {
    if (this.destroyed) {
      return;
    }

    console.log('destroying iov...')

    this.destroyed = true;

    this.debug('destroying...');

    // If the tab is not in focus, do not remove this event listener, because
    // that will prevent it from executing when it is supposed to.  It will
    // remove itself when it runs
    if (this.onVisibilityChange && !document.hidden) {
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }

    // For whatever reason, the things must be destroyed in this order
    this.player.destroy();
    this.player = null;

    this.mqttConduitCollection.remove(this.id);
    this.conduit.destroy();
    this.conduit = null;

    this.videoElement.removeEventListener('mse-error-event', this.onMseError);
    this.videoJsPlayer.off('changesrc', this.onChangeSource);
    this.videoJsPlayer = null;

    super.destroy();
  }
};
