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
        this.isSupported = false;
        this.streaming = false;
        this.mime = "video/webm;codecs=h264"; // most common supported codec


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

    _on_getMedia_success (mediaStream) {

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
            console.log(packet);
        };

        this.mediaRecorder.ondataavailable = function (e) {
            console.log("ondataavailable");
            // route to mqtt 
            if ( fileReader.readyState !== fileReader.LOADING ) {
                fileReader.readAsArrayBuffer(e.data);
            }
        };
     

        this.mediaRecorder.start(500);
        this.video.play();
 


    }

    play() {
        if (this.isSupported === false) {
            throw new "Media Recorder not supported!"; 
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
    }

}


window.videojs.clspWebcam = ClspWebcam;

