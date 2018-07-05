import Debug from 'debug';
import uuidv4 from 'uuid/v4';

import MqttTopicHandlers from './MqttTopicHandlers';
import MqttConduitCollection from './MqttConduitCollection';
import MqttTransport from './MqttTransport';
import _player from './player';

const DEBUG_PREFIX = 'clsp:iov';

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

export default class IOV {
  static compatibilityCheck () {
    // For the MAC
    var NoMediaSourceAlert = false;

    window.MediaSource = window.MediaSource || window.WebKitMediaSource;

    if (!window.MediaSource){
      if (NoMediaSourceAlert === false) {
        alert("Media Source Extensions not supported in your browser"+
           ": Claris Live Streaming will not work!");
      }

      NoMediaSourceAlert = true;
    }
  }

  constructor (config) {
    this.id = uuidv4();
    this.debug = Debug(`${DEBUG_PREFIX}:${this.id}:main`);

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
      videoElement: config.videoElement
    };

    // handle inbound messages from MQTT, including video
    // and distributes them to players.
    this.mqttTopicHandlers = new MqttTopicHandlers(this.id, this);
    this.mqttConduitCollection = new MqttConduitCollection(this.id);
    this.transport = new MqttTransport(this.id, this);

    this.events = {
      connection_lost : function(responseObject) {
        //TODO close all players and display an error message
        console.log("MQTT connection lost");
        console.log(responseObject);
      },

      on_message: this.mqttTopicHandlers.msghandler,

      // generic exception handler
      exception: function(text,e) {
        console.log(text);
        if (typeof e !== 'undefined') {
          console.log(e.stack);
        }
      }
    };
  }

  initialize () {
    IOV.compatibilityCheck();

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
        case 'data':
          conduit.inboundHandler(event.data);
          break;
        case 'ready':
          conduit.onReady();
          break;
        case 'fail':
          console.error('network error', event.reason);
          break;
        default:
          console.log("No match for event = " + eventType);
      }
    });
  }

  player () {
    return _player(this);
  }

  // query remote server and get a list of all stream names
  getAvailableStreams (callback) {
    this.transport.transaction('iov/video/list', callback, {});
  }
}
