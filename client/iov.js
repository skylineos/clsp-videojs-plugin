/**
Internet of Video client. This module uses the MediaSource API to deliver
video content streamed through MQTT from distributed sources. 

Dependancies:
    mqttws31.js


Message Topics:

  iov/video/name/request { clientId, resp_topic }
    server sends the mimeCodec to the resp_topic
  iov/video/guid/play { clientId, resp_topic }
    server sends the initSegment (containing moov) to resp_topic
  iov/video/guid/stop { clientId }
    server decrements a reference count for this stream if configured for
    on demand stops playing.

  iov/video/list
    return a list of video titles 
  iov/video/publish
    publish a video url 



<video autoplay id="required-id"></video>
   

*/

// polyfill for older browsers.
if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}

// Not a true UUID but a best attempt at a unique identfier 
function fake_guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}


/**
   Sets up communication between MQTT and this module. 
*/
var _mqtt_transport = function(iov) {
    var self = this;

    // see if the global singleton created by mqttws31.js exists
    if (typeof MQTTClient === "undefined") {
        MQTTClient = new Paho.MQTT.Client(
            iov.config.wsbroker, 
            iov.config.wsport, 
            iov.config.clientId
        ); 
        // fatal event, connection to remote mqtt daemon has been lost
        MQTTClient.onConnectionLost = iov.events.connection_lost;

        // perhaps the busiest function in this module ;)
        MQTTClient.onMessageArrived = function(message) {
            //console.log(message);
            try {
                iov.events.on_message(message);
            }catch(e) {
                if (e) {
                    console.log(e.message);
                }
            }
        };
         
       
        // setup connection options
        var options = {
            timeout: 3,
            onSuccess: function () {
                iov.events.appStart(iov);   
            },
            onFailure: function (message) {
                iov.events.exception(message);
            }
        };
        // last will message sent on disconnect        
        var willmsg = new Paho.MQTT.Message(JSON.stringify({
            clientId: self.clientId
        }));
        willmsg.qos = 2;
        willmsg.destinationName = "iov/clientDisconnect";
        willmsg.retained = true;
        options.willMessage = willmsg;
        MQTTClient.connect(options);
    }

    // create a temporary resp_topic to receive a query response 
    // upon response remove the temporary topic. Assume both request
    // and response are json formateed text.  
    self.transaction = function( topic, callback, data ) {
        data.resp_topic = iov.config.clientId + "/response/"+parseInt(Math.random()*1000000);
        var mqtt_msg = new Paho.MQTT.Message(JSON.stringify(data));
        mqtt_msg.destinationName = topic;
                  
        self.subscribe(data.resp_topic,function(mqtt_resp){
            //call user specified callback to handle response from remote process
            var resp = JSON.parse(mqtt_resp.payloadString);
            // call user specified callback to handle response
            callback(resp);
            // cleanup.
            self.unsubscribe(data.resp_topic); 
        });

        // start transaction 
        MQTTClient.send(mqtt_msg);
    };

    self.subscribe = function( topic, callback ) {
        iov.mqttTopicHandlers.register(topic, callback);
        //console.log("subscribing to " + topic); 
        MQTTClient.subscribe(topic);
    };

    self.unsubscribe = function(topic) {
        //console.log("unsubscribing to " + topic); 
        MQTTClient.unsubscribe(topic);  
        iov.mqttTopicHandlers.unregister(topic);
    };

    self.publish = function(topic, data) {
        var mqtt_msg = new Paho.MQTT.Message(JSON.stringify(data));
        mqtt_msg.destinationName = topic;
        MQTTClient.send(mqtt_msg);
    };

    return self;
};

/**
    route inbound messages/data to player's event handlers.
*/
var _mqtt_topic_handlers = function(iov) {
    var self = this;
    
    self.topic_handlers = {};

    self.register = function(topic, callback) {
        self.topic_handlers[topic] = callback;

    };
    self.unregister = function(topic) {
        if(typeof self.topic_handlers[topic] !== "undefined") {
            delete self.topic_handlers[topic];
        }   
    };

    // central entry point for all MQTT inbound traffic.
    self.msghandler = function(message) {
        var topic = message.destinationName;
        var callback = self.topic_handlers[topic];
        if (typeof callback !== "undefined"){
            // execute outside of MQTT handler, ensure that we are outside of any 
            // javascript libraries.
            setTimeout(function(){ 
                try {
                    callback(message);
                } catch(e) {
                    iov.events.exception(topic+" handler exception", e); 
                }
            },0);
        } else {
            console.log("No handler for " + topic);
            console.log("message dropped");
            console.log(message);
        }   
    };  

    return self;
}

/**
   Responsible for receiving stream input and routing it to the media source
   buffer for rendering on the video tag. There is some 'light' reworking of
   the binary data that is required.

   var p = iov.player();
   // play live stream.
   p.play( video_element_id, stream_name );
     

*/
var _player = function(iov){
    var self = this;
        
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

    

    self._fault = function(err) {
        //TODO: Change the video poster to a failure image
        console.log(err);
        self.state = "fault"; 
    }

    self.play = function(eid, streamName) {
        self.eid = eid;
        self.streamName = streamName;
        self.video = document.getElementById( eid );
        if (typeof self.video === 'undefined') {
            self._fault("Unable to match id '"+eid+"'");
            return;
        } 
        var request = { clientId: iov.config.clientId };
        var topic = "iov/video/"+window.btoa(self.streamName)+"/request";
        self.transport.transaction(topic,self._start_play,request);
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
    };  


    self.stop = function() {
        // stop streaming live video 
        if (typeof self.guid !== 'undefined') {
            iov.transport.unsubscribe("iov/video/"+self.guid+"/live");
        }
        self.state = "idle";
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
        
            self.mediaSource = new MediaSource();
            self.video.src = URL.createObjectURL(mediaSource);
            self.mediaSource.addEventListener('sourceopen' ,self._on_sourceopen);  
            self.mediaSource.addEventListener('sourceended',self._on_sourceended);
            self.mediaSource.addEventListener('error',function(e) {
                console.log("MSE error");
                console.log(e);
            });
        });

         
    };

    self._on_moof = function(mqtt_msg) {
        /**
            Enqueues or sends to the media source buffer an MP4 moof atom. This contains a 
            chunk of video/audio tracks.  
         */

        // pace control. Allow a maximum of MAX_SEQ_PROC MOOF boxes to be held within
        // the source buffer.
        if ((self.seqnum - self.seqnumProcessed) > self.MAX_SEQ_PROC) {
            console.log("DROPPING FRAME DRIFT TOO HIGH, dropCounter = " + parseInt(self.dropCounter));
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
            }
        } else {
            self.vqueue.push( moofBox.slice(0) );
        }             
         
    };

    self._on_sourceopen = function() {
        /** New media source opened. Add a buffer and append the moov MP4 video data. 
        */
        //console.log("sourceopen"); 
        self.sourceBuffer = mediaSource.addSourceBuffer(self.mimeCodec);
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
        self._appendBuffer_event(self.moovBox);
        self.sourceBuffer.appendBuffer( self.moovBox );
    };

    self._on_sourceended = function() {
        //console.log("sourceended");
        self.stop();   
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
                    self.video.play();
                } catch( ex ) {
                    console.log("Exception while trying to play:" + ex.message );
                }
                //console.log("setting video player from paused to play"); 
            } 
        }
    };
    
    return self;
};

var IOV = function(config) {
    var self = this;
    

    // default configuration 
    self.config = Object.assign({
        // web socket address defaults to the address of the server that loaded this page.
        wsbroker: window.location.hostname,   
        // default port number
        wsport: 9001,
        // default clientId 
        clientId: fake_guid(),
        // to be overriden by user.
        appStart: function(self) {}  
    }, config);

    // handle inbound messages from MQTT, including video 
    // and distributes them to players.
    self.mqttTopicHandlers = _mqtt_topic_handlers(self);

    self.events = Object.assign({
        connection_lost : function(responseObject) {
            //TODO close all players and display an error message
            console.log("MQTT connection lost");  
        },
        on_message: self.mqttTopicHandlers.msghandler,
        // generic exception handler
        exception: function(text,e) {
            console.log(text)
            console.log(e.stack); 
        }
    }, config);
    
    // return an instance of a player
    self.player = function() {
        console.log("creating player");  
        return self._player(self);
    };

    self.transport = _mqtt_transport(self);

    // query remote server and get a list of all stream names 
    self.getAvailableStreams = function(respHandler) {
        self.transport.transaction("iov/video/list",respHandler,{});
    };

    return self;
};




