import videojs from 'video.js';
import videojsErrors from 'videojs-errors';

import './srcdoc-polyfill';
import clspConduit from './clspConduit.generated.js';


import {version as VERSION} from '../package.json';
import IOV from './iov/IOV';

import './videojs-mse-over-clsp.scss';

/*
   source handler for the source tag in html5:
   <video><source src="..." type="..."></video>

   mqttSourceHandler = {
       canPlayType: function(type) {
           // only the canned type for MediaSource entensions
           // use media source extensions to determine if
           // it can play it. MQTT/video
       },
       canHandleSource: function(source, options) {
           // check for mqtt:// .... as a protocol
       },
       handleSource : function(source, tech, options) {
       },
       dispose: function() {
           // destructor.
       }
   }

   Html5 = videojs.getTech('Html5');
   Html5.registerSourceHandler(mqttSourceHandler);

*/

const Component = videojs.getComponent('Component');

const SrcsLookupTable = {};

class MqttHandler extends Component {

    constructor(source, tech, options) {
        super(tech,options.mqtt);
        this.tech_ = tech;
        this.source_ = source;
        this.enabled = false;
        this.playing = false;
    }

    src(_src) {
        if (!_src) {
             return;
        }
        var parser = document.createElement('a');

        // firefox/ie hack!
        var kluged_src = _src.replace('clsp','http');


        parser.href = kluged_src;
        //parser.href = "http:" + parser.pathname;

        var hostname = parser.hostname;
        var port = parser.port;
        var t = parser.pathname.split("/");
        var streamName = t[t.length-1];

        this.useSSL = false;

        // clsp://.../name?[secure=1]
        parser.search.substr(1).split('&').forEach(function(item){
            var t = item.split('=');
            var n = t[0];
            var v = t[1];
            if ( n === 'secure' && v !== '0' )
            {
                useSSL = true;
            }
        });


        if (port.length === 0) {
            port = "9001";
        }

        // @ is a special address maening the server that loaded the web page.
        if (hostname === '@') {
            hostname = window.location.hostname;
        }

        this.mqtt_player = null;
        this.port = parseInt(port);
        this.address = hostname;
        this.streamName = streamName;
        this.enabled = true;

        SrcsLookupTable[_src] = this;
    }


    launchIovPlayer(onMqttReady) {

        var velm = this.player().el();


        var iov = new IOV({
            port: this.port,
            address: this.address,
            appStart: (iov) => {
                // connected to MQTT procede to setting up callbacks
                //console.log("iov.player() called")
                var mqtt_player = iov.player();
                var evt = new CustomEvent("mqttReady");
                this.player().el().dispatchEvent( evt );
                onMqttReady(mqtt_player);

                velm.addEventListener("mse-error-event",function(e){
                    mqtt_player.restart();
                },false);


            },
            useSSL: this.useSSL,
            videoElement: velm
        });

        iov.initialize();
    }



};


function browserIsCompatable() {
    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    var r = false;

    function getChromeVersion() {
        var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

        return raw ? parseInt(raw[2], 10) : -1;
    }

    // chrome version 52 or greater
    if (isChrome === true) {
        if (getChromeVersion() >= 52) {
            r = true;
        }
    }

    return r;
}

const MqttSourceHandler = function(mode) {
    var obj = {
        canPlayType: function(type){
            var r = '';
            if ('MediaSource' in window) {
                if (type === "video/mp4; codecs='avc1.42E01E'") {
                    r = 'maybe';
                } else {
                    console.log("clsp type='" + type + "' rejected");
                }
            }
            return r;
        },
        canHandleSource: function(srcObj, options={}){
            /* This method is used to determin if the following html5 tag can be used
               as a video source:

               <source src="clsp://<ip addr>:<ws port>/<mqtt topic>"
                       type="video/mp4; codecs='avc1.42E01E'" />
            */
            let localOptions =
                 videojs.mergeOptions(videojs.options, options);

            if (!srcObj.src) {
                console.log("srcObj doesn't contain src");
                console.log(srcObj);
                return false;
            }


            if (srcObj.src.startsWith("clsp:") === false) {
                console.log("srcObj.src is not clsp protocol");
                return false;
            }

            /// restrict to chrome version 52 or greater
            if (browserIsCompatable() === false) {
                console.log("Browser not supported. Chrome 52+ is required.");
                return false;
            }

            return obj.canPlayType(srcObj.type);
        },
        handleSource: function(srcObj, tech, options={})  {
            let localOptions = videojs.mergeOptions(videojs.options, options, {mqtt: {mode}});

            tech.mqtt = new MqttHandler(srcObj,tech,localOptions);
            tech.mqtt.src(srcObj.src);
            return tech.mqtt;
        }
    };
    return obj;
};



videojs.mqttSupported = true;
videojs.mqttHandler =  MqttHandler;
videojs.mqttSourceHandler = MqttSourceHandler;
videojs.getTech('Html5').registerSourceHandler(MqttSourceHandler('html5'), 0);


// Default options for the plugin.
const defaults = {};

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
const onPlayerReady = (player, options) => {
  player.addClass('vjs-mse-over-mqtt');
};



/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function mseOverMqtt
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const mseOverMqtt = function(options) {
    var onMseFault = null;

    this.errors({
      errors: {
		PLAYER_ERR_NOT_COMPAT: {
			headline: 'This browser is unsupported.',
			message: 'Chrome 52+ is required.'
		}
      }
    });

    if (browserIsCompatable() === false) {
        this.error({code: 'PLAYER_ERR_NOT_COMPAT', dismiss: false});
        return;
    }

    this.on('play', function(e) {
        //console.log("play");
        var spinner = this.player_.loadingSpinner;
        var videojs_player = this.player_;

        // work around bogus error code.
        var old_error = Object.assign({}, videojs_player.error());
        videojs_player.error = function(evt) {
            if (typeof evt === 'undefined') {
                return old_error;
            }
            else if (evt === null) {
                return;
            }
            else if (evt.code !== -2) {
                videojs_player.old_error(evt);
            }
        };


        var source_tag = this.currentSource();
        if (source_tag.src in SrcsLookupTable) {
            var h = SrcsLookupTable[source_tag.src];
            // setup mqtt connection, callback called when connection
            // made and a new iov_player created.
            h.launchIovPlayer(function(iov_player) {

                if (iov_player === null || iov_player.playing === true) {
                    return;
                }
                iov_player.playing = true;

                // dynamically alter the control bar below the video tag.
                function setupControlBar() {
                    videojs_player.controlBar.addClass('vjs-live');
                    window._ThePlayer = videojs_player;

                    var playToggle = videojs_player.controlBar.children_[0].el_;
                    playToggle.addEventListener("click", function() {
                        setTimeout(function() {
                            if (iov_player.playing === true) {
                                iov_player.stop();
                                iov_player.playing = false;
                                videojs_player.controlBar.playToggle.handlePause();
                            } else {
                                spinner.show();
                                iov_player.resume(function() {
                                    setTimeout(function() {
                                        spinner.hide();
                                    }, 0);
                                }, function() {
                                    // reset the timeout monitor
                                    videojs_player.trigger('timeupdate');
                                });
                                iov_player.playing = true;
                                videojs_player.controlBar.playToggle.handlePlay();
                            }
                        }, 0);
                    });
                }

                // start playing video
                iov_player.play(e.target.firstChild.id, h.streamName, function() {
                    var player_html = document.getElementById(e.target.id);
                    var video_tag = document.getElementById(e.target.firstChild.id);

                    // dispose of spinner after page refresh.
                    setTimeout(function() {
                        //spinner.dispose();
                        spinner.hide();
                        // toggle play button
                        videojs_player.controlBar.playToggle.handlePlay();
                        // alter the control bar
                        setupControlBar();
                    }, 0);

                }, function() {
                    // reset the timeout monitor
                    videojs_player.trigger('timeupdate');
                });
            });

        } else {
            console.log("src not in lookup table");
        }
    });

    this.ready(() => {
        var videoTag = this.children()[0];
        //var playButton = this.bigPlayButton;
        var player = this;
        videoTag.addEventListener("mqttReady", function(evt) {
            if (videoTag.getAttribute('autoplay') !== null) {
                //playButton.trigger('click');
                player.trigger('play', videoTag);
            }
        });

        onPlayerReady(this, videojs.mergeOptions(defaults, options));
    });

};



// Register the plugin with video.js.
registerPlugin('clsp', mseOverMqtt);

// Include the version number.
mseOverMqtt.VERSION = VERSION;

export default mseOverMqtt;
