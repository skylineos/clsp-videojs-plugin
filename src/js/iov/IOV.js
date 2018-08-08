import Debug from 'debug';
import uuidv4 from 'uuid/v4';

import MqttTopicHandlers from './MqttTopicHandlers';
import IOVPlayer from './player';

const DEBUG_PREFIX = 'skyline:clsp:iov';

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

//  @todo - should this be the videojs component?  it seems like the
// mqttHandler does nothing, and that this could replace it
export default class IOV {
  static compatibilityCheck () {
    // @todo - shouldn't this be done in the utils function?
    // @todo - does this need to throw an error?
    // For the MAC
    var NoMediaSourceAlert = false;

    window.MediaSource = window.MediaSource || window.WebKitMediaSource;

    if (!window.MediaSource) {
      if (NoMediaSourceAlert === false) {
        window.alert('Media Source Extensions not supported in your browser: Claris Live Streaming will not work!');
      }

      NoMediaSourceAlert = true;
    }
  }

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

    // Chrome is the only browser that allows non-http protocols in
    // the anchor tag's href, so change them all to http here so we
    // get the benefits of the anchor tag's parsing
    if (url.substring(0, 5).toLowerCase() === 'clsps') {
      useSSL = true;
      parser.href = url.replace('clsps', 'https');
      default_port = 443;
    }
    else if (url.substring(0, 4).toLowerCase() === 'clsp') {
      useSSL = false;
      parser.href = url.replace('clsp', 'http');
      default_port = 9001;
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

  static factory (mqttConduitCollection, player, config = {}) {
    return new IOV(mqttConduitCollection, player, config);
  }

  static fromUrl (url, mqttConduitCollection, player, config = {}) {
    return IOV.factory(mqttConduitCollection, player, {
      ...config,
      ...IOV.generateConfigFromUrl(url),
    });
  }

  constructor (mqttConduitCollection, player, config) {
    IOV.compatibilityCheck();

    this.id = uuidv4();

    this.debug = Debug(`${DEBUG_PREFIX}:${this.id}:main`);
    this.debug('constructor');

    this.destroyed = false;
    this.onReadyAlreadyCalled = false;
    this.playerInstance = player;
    this.videoElement = this.playerInstance.el();

    this.config = {
      clientId: this.id,
      wsbroker: config.wsbroker,
      wsport: config.wsport,
      useSSL: config.useSSL,
      streamName: config.streamName,
      appStart: config.appStart,
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

    // handle inbound messages from MQTT, including video
    // and distributes them to players.
    this.mqttTopicHandlers = new MqttTopicHandlers(this.id, this);
    this.conduit = this.mqttConduitCollection.addFromIov(this);

    this.events = {
      connection_lost : (responseObject) => {
        // @todo - close all players and display an error message
        console.error('MQTT connection lost');
        console.error(responseObject);
      },

      // @todo - does this ever get fired?
      on_message: this.mqttTopicHandlers.msghandler,

      // generic exception handler
      exception: (text, e) => {
        console.error(text);
        if (typeof e !== 'undefined') {
          console.error(e.stack);
        }
      },
    };

    this.player = IOVPlayer.factory(this, this.playerInstance);
  }

  clone (config) {
    this.debug('clone');

    const cloneConfig = {
      ...config,
      videoElementParent: this.config.videoElementParent,
    };

    // @todo - is it possible to reuse the iov player?
    return IOV.factory(
      this.mqttConduitCollection,
      this.playerInstance,
      cloneConfig
    );
  }

  cloneFromUrl (url, config = {}) {
    this.debug('cloneFromUrl');

    return this.clone({
      ...IOV.generateConfigFromUrl(url),
      ...config,
    });
  }

  // query remote server and get a list of all stream names
  getAvailableStreams (callback) {
    this.debug('getAvailableStreams');

    this.conduit.transaction('iov/video/list', callback, {});
  }

  onChangeSource (url) {
    this.debug(`changeSource on player "${this.id}""`);

    if (!url) {
      throw new Error('Unable to change source because there is no url!');
    }

    // // @todo - it is possible to keep an IOV instance if the host for the
    // // stream is the same.
    // if (iovConfig.hostname === this.iov.config.wsbroker) {
    //   this.iov.conduit.transaction(
    //     topic,
    //     (...args) => this.onChangeSourceTransaction(this.iov, ...args),
    //     request
    //   );
    //   return;
    // }

    const clone = this.cloneFromUrl(url);

    // @todo - why is this needed?
    if (this.config.parentNodeId !== null) {
      var iframe_elm = document.getElementById(this.config.clientId);
      var parent = document.getElementById(clone.config.parentNodeId);

      if (parent) {
        parent.removeChild(iframe_elm);
      }

      // remove code from iframe.
      iframe_elm.srcdoc = '';
    }

    clone.player.on('firstChunk', () => {
      this.updateIOV(clone);
      this.destroy();
    });
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
      console.warn('tried to use this player more than once...');
      return;
    }

    this.onReadyAlreadyCalled = true;

    this.player.on('firstChunk', () => {
      this.playerInstance.loadingSpinner.hide();
    });

    this.player.on('videoReceived', () => {
      // reset the timeout monitor from videojs-errors
      this.playerInstance.trigger('timeupdate');
    });

    this.player.on('videoInfoReceived', () => {
      // reset the timeout monitor from videojs-errors
      this.playerInstance.trigger('timeupdate');
    });

    this.playerInstanceEventListeners = {
      changesrc: (event, { url }) => this.onChangeSource(url),
    };

    this.playerInstance.on('changesrc', this.playerInstanceEventListeners.changesrc);

    this.player.play(this.videoElement.firstChild.id, this.config.streamName);

    this.videoElement.addEventListener('mse-error-event', (e) => {
      this.player.restart();
    }, false);

    // the mse service will stop streaming to us if we don't send
    // a message to iov/stats within 1 minute.
    this._statsTimer = setInterval(() => {
      this.statsMsg.inkbps = (this.statsMsg.byteCount * 8) / 30000.0;
      this.statsMsg.byteCount = 0;

      this.conduit.publish('iov/stats', this.statsMsg);

      this.debug('iov status', this.statsMsg);
    }, 5000);
  }

  onFail (event) {
    this.debug('onFail');

    this.debug('network error', event.data.reason);
    this.playerInstance.trigger('network-error', event.data.reason);
  }

  onData (event) {
    this.debug('onData');

    this.conduit.inboundHandler(event.data);
  }

  onMessage (event) {
    const eventType = event.data.event;

    this.debug('onMessage', eventType);

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

  updateIOV (iov) {
    this.playerInstance.tech(true).mqtt.updateIOV(iov);
  }

  destroy () {
    this.debug('destroy');

    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    clearInterval(this._statsTimer);

    this.conduit.unsubscribe(`iov/video/${this.player.guid}/live`);

    this.playerInstance.off('changesrc', this.playerInstanceEventListeners.changesrc);

    this.player.destroy();

    this.playerInstance = null;
    this.player = null;

    // @todo
  }
};
