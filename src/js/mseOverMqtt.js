import videojs from 'video.js';

import utils from './utils';


window.iov_events = {};

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
  const mseOverMqtt = function (options) {
    this.errors({
      errors: {
        PLAYER_ERR_NOT_COMPAT: {
          headline: 'This browser is unsupported.',
          message: 'Chrome 52+ is required.'
        }
      },
      timeout: 120 * 1000
    });

    if (utils.supported() === false) {
      this.error({code: 'PLAYER_ERR_NOT_COMPAT', dismiss: false});
      return;
    }

    this.on('changesrc', function(evt, data) {
      var velm = document.getElementById(data.eid + '_html5_api');

      var event = document.createEvent('Event');
      event.initEvent('iov-change-src', true, true);

      event.detail = data;
      velm.dispatchEvent(new CustomEvent('iov-change-src', event));
    });



    this.on('firstplay', function (e) {
      var spinner = this.player_.loadingSpinner;
      var videojs_player = this.player_;

      //TODO: This seems to screw up the video js error function.  Is this necessary?
      // work around bogus error code.
      /*var old_error = Object.assign({}, videojs_player.error());
      videojs_player.error = function (evt) {
        if (typeof evt === 'undefined') {
          return old_error;
        }

        if (evt === null) {
          return;
        }

        if (evt.code !== -2) {
          videojs_player.old_error(evt);
        }
      };*/

      var source_tag = this.currentSource();
      if (!(source_tag.src in SrcsLookupTable)) {
        console.error('src not in lookup table');
        return;
      }

      var h = SrcsLookupTable[source_tag.src];
      // setup mqtt connection, callback called when connection
      // made and a new iov_player created.
      h.launchIovPlayer(function (iov_player) {
        if (iov_player === null || iov_player.playing === true) {
          return;
        }

        iov_player.playing = true;

        // dynamically alter the control bar below the video tag.
        function setupControlBar () {
          videojs_player.controlBar.addClass('vjs-live');

          var playToggle = videojs_player.controlBar.children_[0].el_;
          playToggle.addEventListener('click', function () {
            // @todo - is this setTimeout necessary?
            setTimeout(function () {
              if (iov_player.playing === true) {
                iov_player.stop();
                iov_player.playing = false;
                videojs_player.controlBar.playToggle.handlePause();
                return;
              }

              spinner.show();

              iov_player.resume(function () {
                // @todo - is this setTimeout necessary?
                setTimeout(function () {
                  spinner.hide();
                }, 0);
              }, function () {
                // reset the timeout monitor
                videojs_player.trigger('timeupdate');
              });

              iov_player.playing = true;
              videojs_player.controlBar.playToggle.handlePlay();
            }, 0);
          });
        }


        // start playing video
        iov_player.play(
          e.target.firstChild.id,
          h.streamName,
          function () {
            // @todo - is this setTimeout necessary?
            // dispose of spinner after page refresh.
            setTimeout(function () {
              // spinner.dispose();
              spinner.hide();
              // toggle play button
              videojs_player.controlBar.playToggle.handlePlay();
              // alter the control bar
              setupControlBar();
            }, 0);
          },
          function () {
            // reset the timeout monitor
            videojs_player.trigger('timeupdate');
          }
        );
      });
    });

    this.ready(() => {
      const videoTag = this.children()[0];
      // var playButton = this.bigPlayButton;

      videoTag.addEventListener('mqttReady', (event) => {
        if (videoTag.getAttribute('autoplay') !== null) {
          // playButton.trigger('click');
          this.trigger('play', videoTag);
        }
      });

      onPlayerReady(this, videojs.mergeOptions(defaults, options));
    });
  };

  return mseOverMqtt;
}
