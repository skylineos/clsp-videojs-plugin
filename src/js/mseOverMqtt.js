import videojs from 'video.js';

import {version as VERSION} from '../../package.json';
import utils from './utils';

export default function (defaults, SrcsLookupTable, onPlayerReady) {
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

        if (utils.supported() === false) {
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

    mseOverMqtt.VERSION = VERSION;
    mseOverMqtt.utils = utils;

    return mseOverMqtt;
}
