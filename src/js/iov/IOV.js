import Debug from 'debug';
import uuidv4 from 'uuid/v4';

import MqttTopicHandlers from './MqttTopicHandlers';
import MqttConduitCollection from './MqttConduitCollection';
import MqttTransport from './MqttTransport';
import IOVPlayer from './player';

const DEBUG_PREFIX = 'skyline:clsp:iov';

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

export default class IOV {
  static compatibilityCheck () {
    // @todo - shouldn't this be done in the utils function?
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

  static factory (player, config) {
    return new IOV(player, config);
  }

  constructor (player, config) {
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

    // handle inbound messages from MQTT, including video
    // and distributes them to players.
    this.mqttTopicHandlers = new MqttTopicHandlers(this.id, this);
    this.mqttConduitCollection = config.mqttConduitCollection || new MqttConduitCollection(this.id);
    this.transport = new MqttTransport(this.id, this);

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

    if (config.initialize) {
      this.initialize();
    }
  }

  clone (config) {
    return IOV.factory(this.playerInstance, {
      ...config,
      mqttConduitCollection: this.mqttConduitCollection,
      videoElementParent: this.config.videoElementParent,
    });
  }

  initialize () {
    IOV.compatibilityCheck();

    // @todo - this listener has no concept of this instance, so it should be
    // moved elsewhere, or restructured
    // route inbound data from a frame running mqtt to the appropriate player
    window.addEventListener('message', (event) => {
      this.debug('message received', event.data)

      var clientId = event.data.clientId;

      if (!this.mqttConduitCollection.exists(clientId)) {
        return;
      }

      var conduit = this.mqttConduitCollection.getById(clientId);
      var eventType = event.data.event;

      switch (eventType) {
        case 'data': {
          conduit.inboundHandler(event.data);
          break;
        }
        case 'ready': {
          if (this.config.videoElement.parentNode !== null) {
            this.config.videoElementParentId = this.config.videoElement.parentNode.id;
          }
          conduit.onReady();
          break;
        }
        case 'fail': {
          this.debug('network error', event.data.reason);
          this.playerInstance.trigger('network-error', event.data.reason);
          break;
        }
        default: {
          console.error(`No match for event: ${eventType}`);
        }
      }
    });

    return this;
  }

  // query remote server and get a list of all stream names
  getAvailableStreams (callback) {
    this.transport.transaction('iov/video/list', callback, {});
  }
}
