import Debug from 'debug';
import uuidv4 from 'uuid/v4';

import MqttTopicHandlers from './MqttTopicHandlers';
import IOVPlayer from './player';

const DEBUG_PREFIX = 'skyline:clsp:iov';

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

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

  static factory (mqttConduitCollection, player, config) {
    return new IOV(mqttConduitCollection, player, config);
  }

  constructor (mqttConduitCollection, player, config) {
    IOV.compatibilityCheck();

    this.id = uuidv4();
    this.debug = Debug(`${DEBUG_PREFIX}:${this.id}:main`);

    this.playerInstance = player;

    this.config = {
      // web socket address defaults to the address of the server that loaded this page.
      wsbroker: config.address,
      // default port number
      wsport: config.port,
      // default clientId
      clientId: this.id,
      // to be overriden by user.
      appStart: config.appStart,
      useSSL: config.useSSL || false,
      videoElement: config.videoElement,
      videoElementParent: null,
    };

    this.statsMsg = {
      byteCount: 0,
      inkbps: 0,
      host: document.location.host,
      clientId: this.config.clientId,
    };

    // handle inbound messages from MQTT, including video
    // and distributes them to players.
    this.mqttTopicHandlers = new MqttTopicHandlers(this.id, this);
    this.mqttConduitCollection = mqttConduitCollection;
    this.conduit = mqttConduitCollection.addFromIov(this);

    this.events = {
      connection_lost : function (responseObject) {
        // @todo - close all players and display an error message
        console.error('MQTT connection lost');
        console.error(responseObject);
      },

      on_message: this.mqttTopicHandlers.msghandler,

      // generic exception handler
      exception: function (text, e) {
        console.error(text);
        if (typeof e !== 'undefined') {
          console.error(e.stack);
        }
      },
    };

    this.player = IOVPlayer.factory(this, this.playerInstance);
  }

  clone (config) {
    const cloneConfig = {
      ...config,
      videoElementParent: this.config.videoElementParent,
    };

    return IOV.factory(
      this.mqttConduitCollection,
      this.playerInstance,
      cloneConfig
    );
  }

  // query remote server and get a list of all stream names
  getAvailableStreams (callback) {
    this.conduit.transaction('iov/video/list', callback, {});
  }
};
