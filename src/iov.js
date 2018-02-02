import Debug from 'debug';
import uuidv4 from 'uuid/v4';

const DEBUG_PREFIX = 'clsp:iov:';
const debug = Debug(`${DEBUG_PREFIX}:main`);

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

function mediaSourceCheck () {
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

class MqttConduitCollection {
  constructor () {
    this._conduits = {};
  }

  set (id, conduit) {
    this._conduits[id] = conduit;
  }

  addFromIov (iov) {
    this.set(iov.config.clientId, mqttConduit(iov.config, () => {
      iov.config.appStart(iov);

      // the mse service will stop streaming to us if we don't send
      // a message to iov/stats within 1 minute.
      iov._statsTimer = setInterval(() => {
        iov.statsMsg.inkbps = (iov.statsMsg.byteCount * 8) / 30000.0;
        iov.statsMsg.byteCount = 0;

        self.publish("iov/stats",iov.statsMsg);

        debug('iov status', iov.statsMsg);
      }, 5000);
    }));
  }

  getById (id) {
    return this._conduits[id];
  }

  exists (id) {
    return this._conduits.hasOwnProperty(id);
  }
}

class MqttTransport {
  constructor (iov) {
    this.debug = Debug(`${DEBUG_PREFIX}:MqttTransport`);

    this.debug('constructing...');

    // setup stats
    iov.statsMsg = {
      byteCount: 0,
      inkbps: 0,
      host: document.location.host,
      clientId: iov.config.clientId
    };

    this.clientId = iov.config.clientId;
    this.iov = iov;

    this.conduit = iov.mqttConduitCollection.addFromIov(iov);
  }

  // create a temporary resp_topic to receive a query response
  // upon response remove the temporary topic. Assume both request
  // and response are json formateed text.
  transaction (topic, callback, data) {
    this.debug('transaction...');

    this.conduit.transaction(topic, (event) => {
      this.debug('transaction callback...', event);
      if (callback) {
        callback(event);
      }
    }, data);
  }

  subscribe (topic, callback) {
    this.debug('subscribe...');

    this.conduit.subscribe(topic, (event) => {
      this.debug('subscribe callback...', event);
      if (callback) {
        callback(event);
      }
    });
  }

  unsubscribe (topic, callback) {
    this.debug('unsubscribe...');

    this.conduit.unsubscribe(topic, (event) => {
      this.debug('unsubscribe callback...', event);
      if (callback) {
        callback(event);
      }
    });
  }

  publish (topic, data, callback) {
    this.debug('publish...');

    this.conduit.publish(topic, data, (event) => {
      this.debug('publish callback...', event);
      if (callback) {
        callback(event);
      }
    });
  }
}

/**
 * route inbound messages/data to player's event handlers.
 */
class MqttTopicHandlers {
  constructor (iov) {
    this.iov = iov;
    this._handlers = {};
  }

  get (topic) {
    return this._handlers[topic];
  }

  register (topic, callback) {
    this._handlers[topic] = callback;
  }

  unregister (topic) {
    if (this.exists(topic)) {
      delete this._handlers[topic];
    }
  }

  exists (topic) {
    return this._handlers.hasOwnProperty(topic);
  }

  // central entry point for all MQTT inbound traffic.
  msghandler (message) {
    var topic = message.destinationName;

    if (!this.exists(topic)) {
      console.log("No handler for " + topic);
      console.log("message dropped");
      console.log(message);

      return;
    }

    try {
      this.get(topic)(message);
    } catch (e) {
      this.iov.events.exception(`${topic} handler exception`, e);
    }
  }
}

/**
 * Responsible for receiving stream input and routing it to the media source
 * buffer for rendering on the video tag. There is some 'light' reworking of
 * the binary data that is required.
 *
 * var player = iov.player();
 * player.play( video_element_id, stream_name );
*/
var _player = function(iov){
    var self = {};

    /*
    Used for determining the size of the internal buffer hidden from the MSE
    api by recording the size and time of each chunk of video upon buffer append
    and recording the time when the updateend event is called.

     */

    self.LogSourceBuffer = false;
    self.LogSourceBufferTopic = null;
    self.state = "idle";
    self.seqnum = 1;
    self.seqnumProcessed = 1; // last sequence number processed
    self.MAX_SEQ_PROC = 2;
    self.dropCounter = 0;

    self.moovBox = null;
    self.moofBox = null;
    // -1 is forever
    self.retry_count = 3;
    self.source_buffer_ready = false;


    self._fault = function(err) {
        //TODO: Change the video poster to a failure image
        console.log(err);
        self.state = "fault";
    }

    self.restart = function() {
        self.stop();
        self.play(self.eid, self.streamName, self.onFirstChunk, self.onVideoRecv);
    };

    self.play = function(eid, streamName, onFirstChunk, onVideoRecv) {
        self.eid = eid;
        self.streamName = streamName;
        self.onFirstChunk = onFirstChunk;
        self.video = document.getElementById( eid );
        self.onVideoRecv = onVideoRecv;

        if (typeof self.video === 'undefined') {
            self._fault("Unable to match id '"+eid+"'");
            return;
        }
        var request = { clientId: iov.config.clientId };
        var topic = "iov/video/"+window.btoa(self.streamName)+"/request";
        iov.transport.transaction(topic,self._start_play,request);
    };

    self.resume = function(onFirstChunk, onVideoRecv) {
        self.onFirstChunk = onFirstChunk;
        self.onVideoRecv = onVideoRecv;

        var request = { clientId: iov.config.clientId };
        var topic = "iov/video/"+window.btoa(self.streamName)+"/request";
        iov.transport.transaction(topic,self._start_play,request);
    };

    self._appendBuffer_event = function(bytearray) {
        if ((self.LogSourceBuffer === true) &&
            (self.LogSourceBufferTopic !== null))
        {
            //console.log("recording "+parseInt(bytearray.length)+" bytes of data");
            var mqtt_msg = new Paho.MQTT.Message(bytearray);
            mqtt_msg.destinationName = self.LogSourceBufferTopic;
            MQTTClient.send(mqtt_msg);
        }
        // increment bytecount stats
        iov.statsMsg.byteCount += bytearray.length;
    };


    self.stop = function() {
        // stop streaming live video
        if (typeof self.guid !== 'undefined') {
            iov.transport.unsubscribe("iov/video/"+self.guid+"/live");
        }

        self.state = "idle";

        // free resources associated with player
        self.seqnum = 1;
        self.moovBox = null;
        self.moofBox = null;
        if (typeof self.video !== 'undefined') {
            self.video.paused = true;
        }
        var request = { clientId: iov.config.clientId };
        iov.transport.publish("iov/video/"+self.guid+"/stop",request);
    };

    self._start_play = function(resp) {
        self.mimeCodec = resp.mimeCodec;
        self.guid = resp.guid; // stream guid

        if ('MediaSource' in window && MediaSource.isTypeSupported(self.mimeCodec)) {
            var initseg_topic = iov.config.clientId + "/init-segment/" +
                parseInt(Math.random()*1000000);

            self._async_play_loop(resp, initseg_topic);
            var play_request_topic = "iov/video/"+self.guid+"/play";
            iov.transport.publish(play_request_topic,{
                initSegmentTopic: initseg_topic,
                clientId: iov.config.clientId
            });
        } else {
            // the browser does not support this video format
            self._fault("Unsuppored mime codec " + self.mimeCodec);
        }
    };


    self._async_play_loop = function(resp, initSegmentTopic) {
        // setup handlers for video
        self.vqueue = []; // used if the media source buffer is busy

        self.state = "waiting-for-moov";

        iov.transport.subscribe(initSegmentTopic, function(mqtt_msg) {

            // capture the initial segment
            self.moovBox = mqtt_msg.payloadBytes;
            //console.log(typeof mqtt_msg.payloadBytes);
            //console.log("received moov from server");


            self.state = "waiting-for-moof";
            // unsubscribe to this group
            iov.transport.unsubscribe(initSegmentTopic);

            // subscribe to the live video topic.
            self.state = "playing";
            iov.transport.subscribe("iov/video/"+self.guid+"/live", self._on_moof);
            // create media source buffer and start routing video traffic.


            self.onFirstChunk(); // first chunk of video received.

            self.mediaSource = new MediaSource();


            var clone = self.video.cloneNode();
            var parent = self.video.parentNode;
            if (parent !== null) {
                parent.replaceChild(clone,self.video);
                self.video = clone;
            }


            self.mediaSource.addEventListener('sourceopen' ,self._on_sourceopen);
            self.mediaSource.addEventListener('sourceended',self._on_sourceended);
            self.mediaSource.addEventListener('error',function(e) {
                console.log("MSE error");
                console.log(e);
            });

            // now assign media source extensions
            //console.log("Disregard: The play() request was interrupted ... its not an error!");
            self.video.src = URL.createObjectURL(self.mediaSource);


        });


    };

    self._on_moof = function(mqtt_msg) {


        if (self.source_buffer_ready == false) {
            //console.log("media source not yet open dropping frame");
            return;
        }

        /**
            Enqueues or sends to the media source buffer an MP4 moof atom. This contains a
            chunk of video/audio tracks.
         */
        // pace control. Allow a maximum of MAX_SEQ_PROC MOOF boxes to be held within
        // the source buffer.
        if ((self.seqnum - self.seqnumProcessed) > self.MAX_SEQ_PROC) {
            //console.log("DROPPING FRAME DRIFT TOO HIGH, dropCounter = " + parseInt(self.dropCounter));
            return; // DROP this frame since the borwser is falling
        }



        var moofBox = mqtt_msg.payloadBytes;
        moofBox[20] = (self.seqnum & 0xFF000000) >> 24;
        moofBox[21] = (self.seqnum & 0x00FF0000) >> 16;
        moofBox[22] = (self.seqnum & 0x0000FF00) >> 8;
        moofBox[23] = self.seqnum & 0xFF;

        //console.log("moof handler: data seqnum chunk ");
        //console.log(self.seqnum);

        if ( self.sourceBuffer.updating === false ) {
            try {
                //console.log(typeof moofBox);
                //console.log("calling append buffer");
                self._appendBuffer_event(moofBox);
                self.sourceBuffer.appendBuffer( moofBox );
                self.seqnum += 1; // increment sequence number for next chunk
            } catch(e) {
                self.stop();
                console.log(e.stack);
                //var mseErrorEvt = new Event("mse-error-event");
                //self.video.dispatchEvent(mseErrorEvt);
            }
        } else {
            self.vqueue.push( moofBox.slice(0) );
        }

    };

    // found when stress testing many videos, it is possible for the
    // media source ready state not to be open even though
    // source open callback is being called.
    self._on_sourceopen = function() {
        if (self.mediaSource.readyState === "open") {
            self._do_on_sourceopen();
            return;
        }

        var t = setInterval(function(){
            if (self.mediaSource.readyState === "open") {
                self._do_on_sourceopen();
                clearInterval(t);
            }
        },  1000);
    };

    self._do_on_sourceopen = function() {
        /** New media source opened. Add a buffer and append the moov MP4 video data.
        */

        // add buffer
        self.sourceBuffer = self.mediaSource.addSourceBuffer(self.mimeCodec);
        self.sourceBuffer.mode = "sequence";
        self.sourceBuffer.addEventListener('updateend', self._on_updateend);
        self.sourceBuffer.addEventListener('update', function() {
            if ( (self.sourceBuffer.updating === false) && (self.vqueue.length > 0) ) {
                self._appendBuffer_event(self.vqueue[0]);
                self.sourceBuffer.appendBuffer( self.vqueue[0] );
                self.vqueue = self.vqueue.slice(1);
            }
        });

        self.sourceBuffer.addEventListener('updatestart',function(){
            //console.log("On update start");
        });

        self.sourceBuffer.addEventListener('error',function(e){
            console.log("MSE sourceBffer error");
            console.log(e);
        });

        // send ftype+moov segments of video
        //console.log("sending moov atom ");

        // we are now able to process video
        self.source_buffer_ready = true;

        self._appendBuffer_event(self.moovBox);
        self.sourceBuffer.appendBuffer( self.moovBox );
    };

    self._on_sourceended = function() {
        //console.log("sourceended");
        self.stop();
        self.source_buffer_ready = false;
    };

    self._on_updateend = function() {

        // identify what seqnum of the MOOF message has actually been processed.
        self.seqnumProcessed += 1;


        /*
        var logmsg =
           "_on_updateend: " +
           ((self.video.paused) ? " video is paused,": "video is playing,")   +
           " ready state = '" + self.mediaSource.readyState + "', " +
           " video queue size = " + parseInt(self.vqueue.length)
        ;
        console.log(logmsg);
        */
        if (self.mediaSource.readyState === "open") {
            if (self.vqueue.length > 0){
                self._appendBuffer_event(self.vqueue[0]);
                setTimeout(function() {
                    // deqeue next prepared moof atom
                    if (self.sourceBuffer.updating === false) {
                        try {
                            self.sourceBuffer.appendBuffer(self.vqueue[0]);
                        } catch( ex ) {
                            // internal error, this has been observed to happen the tab
                            // in the browser where this video player lives is hidden
                            // then reselected. 'ex' is undefined the error is bug
                            // within the MSE C++ implementation in the browser.
                        }
                    }
                    // regardless we must proceed to the frame.
                    self.vqueue = self.vqueue.slice(1);
                },0);
            }


            if (self.video.paused === true) {
                try {
                    var promise = self.video.play();
                    if (typeof promise !== 'undefined') {
                        promise.then(function(_){}).catch(function(e){});
                    }
                } catch( ex ) {
                    console.log("Exception while trying to play:" + ex.message );
                }
                //console.log("setting video player from paused to play");
            }

        }
    };

    return self;
};

export default class IOV {
  constructor (config) {
    this.config = {
      // web socket address defaults to the address of the server that loaded this page.
      wsbroker: config.address,
      // default port number
      wsport: config.port,
      // default clientId
      clientId: uuidv4(),
      // to be overriden by user.
      appStart: config.appStart,
      useSSL: config.useSSL || false,
      videoElement: config.videoElement
    };

    // handle inbound messages from MQTT, including video
    // and distributes them to players.
    this.mqttTopicHandlers = new MqttTopicHandlers(this);

    this.mqttConduitCollection = new MqttConduitCollection();
    this.transport = new MqttTransport(this);

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
    mediaSourceCheck();

    // route inbound data from a frame running mqtt to the appropriate player
    window.addEventListener('message', (event) => {
      debug('message received', event.data)

      var clientId = event.data.clientId;

      if (!this.mqttConduitCollection.exists(clientId)) {
        return;
      }

      var conduit = this.mqttConduitCollection.get(clientId);
      var eventType = event.data.event;

      switch (eventType) {
        case 'data':
          conduit.inboundHandler(event.data);
          break;
        case 'ready':
          conduit.onReady();
          break;
        case 'fail':
          console.error('Failure Message!');
          console.error(event);
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
