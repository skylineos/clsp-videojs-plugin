'use strict';

import Debug from 'debug';
import uuidv4 from 'uuid/v4';
import defaults from 'lodash/defaults';

// Needed for crossbrowser iframe support
import 'srcdoc-polyfill';

import IOVPlayer from './Player';

const DEFAULT_NON_SSL_PORT = 9001;
const DEFAULT_SSL_PORT = 443;

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

//  @todo - should this be the videojs component?  it seems like the
// mqttHandler does nothing, and that this could replace it
export default class IOV {
  static DEBUG_NAME = 'skyline:clsp:iov:iov';

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
    this.id = uuidv4();

    const debugName = `${IOV.DEBUG_NAME}:${this.id}:main`;

    this.debug = Debug(debugName);
    this.silly = Debug(`silly:${debugName}`);

    this.debug('constructor');

    this.destroyed = false;
    this.onReadyAlreadyCalled = false;
    this.playerInstance = player;
    this.videoElement = this.playerInstance.el();

    this.options = defaults({}, options, {
      changeSourceMaxWait: 9750,
      statsInterval: 30000,
      enableMetrics: false,
      defaultNonSslPort: DEFAULT_NON_SSL_PORT,
      defaultSslPort: DEFAULT_SSL_PORT,
    });

    this.config = {
      clientId: this.id,
      wsbroker: config.wsbroker,
      wsport: config.wsport,
      useSSL: config.useSSL,
      streamName: config.streamName,
      videoElementParent: config.videoElementParent || null,
    };

    this.statsMsg = {
      byteCount: 0,
      inkbps: 0,
      host: document.location.host,
      clientId: this.config.clientId,
    };

    // @todo - this needs to be a global service or something
    this.mqttConduitCollection = mqttConduitCollection;
  }

  initialize () {
    this.debug('initializing...');

    this.conduit = this.mqttConduitCollection.addFromIov(this);
    this.player = IOVPlayer.factory(
      this,
      this.playerInstance,
      {
        enableMetrics: this.options.enableMetrics,
      }
    );

    return this;
  }

  clone (config, options) {
    this.debug('cloning...');

    const cloneConfig = {
      ...config,
      videoElementParent: this.config.videoElementParent,
    };

    return IOV.factory(
      this.mqttConduitCollection,
      this.playerInstance,
      cloneConfig,
      options
    );
  }

  changeSource (url) {
    this.debug(`changeSource on player "${this.id}""`);

    if (!url) {
      throw new Error('Unable to change source because there is no url!');
    }

    let iovUpdated = false;

    const clone = this.clone(IOV.generateConfigFromUrl(url, this.options), this.options);

    clone.initialize();

    clone.player.videoElement.style.display = 'none';

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
    setTimeout(() => {
      if (!iovUpdated) {
        clone.playerInstance.tech(true).mqtt.updateIOV(clone);
        clone.player.videoElement.style.display = 'initial';
      }
    }, clone.options.changeSourceMaxWait);

    // Under normal circumstances, meaning when the tab is in focus, we want
    // to respond by switching the IOV when the new IOV Player has something
    // to display
    // clone.player.on('firstFrameShown', () => {
    //   if (!iovUpdated) {
    //     clone.playerInstance.tech(true).mqtt.updateIOV(clone);
    //   }
    // });
  }

  onChangeSource = (event, data) => {
    return this.changeSource(data.url);
  }

  onReady (event) {
    this.debug('onReady');

    // @todo - why is this necessary?
    if (this.videoElement.parentNode !== null) {
      this.config.videoElementParentId = this.videoElement.parentNode.id;
    }

    const videoTag = this.playerInstance.children()[0];

    // @todo - there must be a better way to determine autoplay...
    if (videoTag.getAttribute('autoplay') !== null) {
      // playButton.trigger('click');
      this.playerInstance.trigger('play', videoTag);
    }

    if (this.onReadyAlreadyCalled) {
      console.error('tried to use this player more than once...');
      return;
    }

    this.onReadyAlreadyCalled = true;

    this.player.on('firstFrameShown', () => {
      // @todo - it doesn't seem like anything in this listener is necessary
      // @todo - need to figure out when to show it
      this.playerInstance.loadingSpinner.hide();

      videoTag.style.display = 'none';
    });

    this.player.on('videoReceived', () => {
      // reset the timeout monitor from videojs-errors
      this.playerInstance.trigger('timeupdate');
    });

    this.player.on('videoInfoReceived', () => {
      // reset the timeout monitor from videojs-errors
      this.playerInstance.trigger('timeupdate');
    });

    this.playerInstance.on('changesrc', this.onChangeSource);

    this.player.play(this.videoElement.firstChild.id, this.config.streamName);

    this.videoElement.addEventListener('mse-error-event', (e) => {
      this.player.restart();
    }, false);
  }

  onFail (event) {
    this.debug('onFail');

    this.debug('network error', event.data.reason);
    this.playerInstance.trigger('network-error', event.data.reason);
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
      console.error(error);
    }
  }

  onMessage (event) {
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
    this.debug('destroying...');

    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.player.destroy();
    this.player = null;

    this.conduit.destroy();
    this.mqttConduitCollection.remove(this.id);

    this.playerInstance.off('changesrc', this.onChangeSource);
    this.playerInstance = null;

    const iframe = document.getElementById(this.config.clientId);
    iframe.parentNode.removeChild(iframe);
    iframe.srcdoc = '';
  }
};
