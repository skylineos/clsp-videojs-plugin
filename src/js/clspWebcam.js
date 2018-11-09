/**
Use the MediaRecorder object to publish h264 video to the SFS so that it can be
broadcasted out to wowza and thus any customer using the SFS.

Given: The user has an apiKey that allows them to publish, right now
       this parameter is not checked

*/



class ClspWebcam {
    
    constructor(conf) {
        this.video = document.getElementById(conf.video_eid);
        this.apiKey = conf.apiKey;
        this.streamName = conf.streamName;
        this.sfsIp = conf.sfsIpAddr;
        this.mqttPort = 9001;   
        this.isSupported = false;
        this.streaming = false;
        this.reconnect = -1; 
        this.mime = "video/webm;codecs=h264"; // most common supported codec
        this.state = "idle"; 
        this.mediaRecorder = null;
        this.kbps = 0;
        this.bytecount = 0;
        this.statTimer = -1;
        this.statTimerInterval = 2000;
        this.location = {
            timer: null,
            lat: null,
            lng: null 
        };   

        window.StreamName =  conf.streamName;

        // browser check 
        try {
            navigator.getMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || null
            ;
         
        } catch(e) {
            navigator.getMedia = null;
        }
        
        if (navigator.getMedia === null) {
            console.log("getMedia not supported");
        }        
        else if (typeof window.MediaRecorder === 'undefined') {
            console.log("MediaRecorder not supported");
        } 
        else if(!MediaRecorder.isTypeSupported(this.mime)){
            console.log("Mime type "+this.mime+" not supported");
        } else {
            this.isSupported = true;  
        } 

        this._on_getMedia_success = this._on_getMedia_success.bind(this);
        this.play = this.play.bind(this);
    }

    getLatLong() {
        return {'lat': this.location.lat, 'lng': this.location.lng};
    }

    _on_getMedia_success (mediaStream) {
        var webcam = this;

        if (webcam.statTimer === -1) {
            webcam.statTimer = setInterval( () => {
                //Note: time interval in milliseconds 
                webcam.kbps = (8 * webcam.bytecount) / webcam.statTimerInterval;
                webcam.bytecount = 0;
                //console.log(webcam.streamName + " kbps: " + parseFloat(webcam.kbps));
            }, webcam.statTimerInterval ); 
        }  

        console.log("now playing");
        this.state = 'playing';
        this.bytecount = 0; 

        if (typeof this.video.srcObject !== 'undefined') {
            this.video.srcObject = mediaStream;
        } else {
            // depricated as of July 2018
            this.video.src = window.URL.createObjectURL(mediaStream);
        }

        
        this.mediaRecorder =
            new MediaRecorder(mediaStream, {mimeType: this.mime});
        
        var fileReader = new FileReader();
        var utf8Enc = new TextEncoder('utf-8');
        var streaming = false;

        fileReader.onload = function(x) {
            var packet = this.result;
            var mqtt_msg = new Paho.MQTT.Message(packet);
                           
            webcam.bytecount += mqtt_msg.payloadBytes.byteLength;                           
            mqtt_msg.destinationName = "webcam/"+window.StreamName;
            //console.log("sending data to " +  mqtt_msg.destinationName);
            MQTTClient.send(mqtt_msg);
        };

        this.mediaRecorder.ondataavailable = function (e) {
            //console.log("ondataavailable"); 
            
            // route to mqtt 
            if ( fileReader.readyState !== fileReader.LOADING ) {
                fileReader.readAsArrayBuffer(e.data);
            }
        };

        console.log("this.mediaRecorder");
        this.mediaRecorder.start(500);
        this.video.play();

    }

    stop() {
        if (this.state === 'playing') {
            if (this.mediaRecorder !== null) {
                this.mediaRecorder.stop();
                this.mediaRecorder = null;
            } 
            if (this.statTimer === -1) {
                clearInterval(this.statTimer);
                this.bytecount = 0; 
            }  
            this.state = 'stopped';
        }  
    }

    play() {
        var self = this; 

        if (this.state === 'playing') {
            console.log("Ignore play, we are already playing camcorder");
            return;     
        }


        if (this.isSupported === false) {
            throw new "Media Recorder not supported!"; 
        } 

        if ((this.location.timer === null) && navigator.geolocation) {

             function getLocation() {
                 navigator.geolocation.getCurrentPosition(function(position){
                     self.location.lat = position.coords.latitude
                     self.location.lng = position.coords.longitude; 
                 })           
             } 
             getLocation();

             this.location.timer = setInterval(function() {
                 if (self.state === 'playing') {
                     getLocation();
                 } 
             }, 30000 );
        }

        
        if (typeof window.MQTTClient !== 'undefined') {
 
            // already connected to MQTT, go directly to accessing camera
            navigator.getMedia(
                    // constraints
                    {video:true, audio:true},

                    // success callback
                    this._on_getMedia_success,

                    function(err) {
                        console.log(err);
                    }
                );
            return;
        }


        function fake_guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
               var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
               return v.toString(16);
            });
        }
        window.MQTTClient = new Paho.MQTT.Client(
            this.sfsIp,
            this.mqttPort,
            fake_guid()
        );


 
        var mqtt_opts = {
            timeout: 120,
            useSSL: false,
            onSuccess:  () => {
                this.state = 'connected';

                // if we have reconnected stop connect timer and return
                if (this.reconnect !== -1) {
                    clearInterval(this.reconnect);
                    this.reconnect = -1;
                    return;
                }
                
                navigator.getMedia(
                    // constraints
                    {video:true, audio:true},

                    // success callback
                    this._on_getMedia_success,

                    function(err) {
                        console.log(err);
                    }
                );
            },
            onFailure: function(err) {
                console.log(err);
            }
        };
        window.MQTTClient.connect(mqtt_opts);
        window.MQTTClient.onConnectionLost = (e) => {
            if (this.reconnect === -1) {
                this.state = 'reconnecting';
                this.reconnect = setInterval(function(){
                    window.MQTTClient.connect(mqtt_opts);
                },2000); 
            }
        };
        this.state = 'connecting'; 

    }

}


window.videojs.clspWebcam = ClspWebcam;

