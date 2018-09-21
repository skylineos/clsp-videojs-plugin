'use strict';

import uuidv4 from 'uuid/v4';
import defaults from 'lodash/defaults';
import debounce from 'lodash/debounce';

import ListenerBaseClass from '~/utils/ListenerBaseClass';
import MediaSourceWrapper from '~/mse/MediaSourceWrapper';

/**
 * Responsible for receiving stream input and routing it to the media source
 * buffer for rendering on the video tag. There is some 'light' reworking of
 * the binary data that is required.
 *
 * @todo - this class should have no knowledge of videojs or its player, since
 * it is supposed to be capable of playing video by itself.  The plugin that
 * uses this player should have all of the videojs logic, and none should
 * exist here.
 *
 * var player = IOVPlayer.factory(iov);
 * player.play( video_element_id, stream_name );
*/
export default class IOVPlayer extends ListenerBaseClass {
  static DEBUG_NAME = 'skyline:clsp:iov:player';

  static EVENT_NAMES = [
    'metric',
    'firstFrameShown',
    'videoReceived',
    'videoInfoReceived',
  ];

  static METRIC_TYPES = [
    'iovPlayer.moofWaitExceeded',
    'iovPlayer.video.currentTime',
    'iovPlayer.video.drift',
    'iovPlayer.video.driftCorrection',
    'iovPlayer.video.segmentInterval',
    'iovPlayer.video.segmentIntervalAverage',
    'iovPlayer.mediaSource.sourceBuffer.bufferTimeEnd',
    'iovPlayer.mediaSource.sourceBuffer.genericErrorRestartCount',
  ];

  static factory (iov, playerInstance, options = {}) {
    return new IOVPlayer(iov, playerInstance, options);
  }

  constructor (iov, playerInstance, options) {
    super(IOVPlayer.DEBUG_NAME);

    this.debug('constructor');

    this._id = uuidv4();
    this.iov = iov;
    this.playerInstance = playerInstance;
    this.eid = this.playerInstance.el().firstChild.id;
    this.id = this.eid.replace('_html5_api', '');
    this.videoId = `clsp-video-${this._id}`;

    this.initializeVideoElement();

    this.options = defaults({}, options, {
      maxMoofWait: 30 * 1000,
      segmentIntervalSampleSize: 5,
      driftCorrectionConstant: 2,
      maxMediaSourceWrapperGenericErrorRestartCount: 50,
      enableMetrics: false,
    });

    this.firstFrameShown = false;

    // Used for determining the size of the internal buffer hidden from the MSE
    // api by recording the size and time of each chunk of video upon buffer append
    // and recording the time when the updateend event is called.
    this.LogSourceBuffer = false;
    this.LogSourceBufferTopic = null;

    this.latestSegmentReceived = null;
    this.segmentIntervalAverage = null;
    this.segmentInterval = null;
    this.segmentIntervals = [];
    this.moofWaitReset = null;

    if (this.options.maxMoofWait) {
      this.moofWaitReset = debounce(() => {
        this.metric('iovPlayer.moofWaitExceeded', 1);

        // When we stop receiving moofs, reinitializing the mediasource will not
        // be enough - we have to kill the player completely, then re-subscribe
        // via the conduit
        this.restart();
      }, this.options.maxMoofWait);
    }

    this.mediaSourceWrapper = null;
    this.moov = null;
    this.mimeCodec = null;
  }

  _onError (type, message, error) {
    console.error(type, message);
    console.error(error);
  }

  initializeVideoElement () {
    this.videoJsVideoElement = document.getElementById(this.eid);

    if (!this.videoJsVideoElement) {
      throw new Error(`Unable to find an element in the DOM with id "${this.eid}".`);
    }

    // when videojs initializes the video element (or something like that),
    // it creates events and listeners on that element that it uses, however
    // these events interfere with our ability to play clsp streams.  Cloning
    // the element like this and reinserting it is a blunt instrument to remove
    // all of the videojs events so that we are in control of the player.
    // this.videoElement = this.videoJsVideoElement.cloneNode();
    this.videoElement = this.videoJsVideoElement.cloneNode();
    this.videoElement.setAttribute('id', this.videoId);
    this.videoElement.classList.add('clsp-video');

    this.videoElementParent = this.videoJsVideoElement.parentNode;

    this.on('firstFrameShown', () => {
      // @todo - this may be overkill given the IOV changeSourceMaxWait...
      // When the video is ready to be displayed, swap out the video player if
      // the source has changed.  This is what allows tours to switch to the next
      if (this.videoElementParent !== null) {
        try {
          this.videoElementParent.insertBefore(this.videoElement, this.videoJsVideoElement);

          let videos = this.videoElementParent.getElementsByTagName('video');

          for (let i = 0; i < videos.length; i++) {
            let video = videos[i];
            const id = video.getAttribute('id');

            if (id !== this.eid && id !== this.videoId) {
              // video.pause();
              // video.removeAttribute('src');
              // video.load();
              // video.style.display = 'none';
              this.videoElementParent.removeChild(video);
              video.remove();
              video = null;
              videos = null;
              break;
            }
          }

          // this.videoElementParent.replaceChild(this.videoElement, this.videoJsVideoElement);
          // is there still a reference to this element?
          // this.videoJsVideoElement = null;
        }
        catch (e) {
          console.error(e);
        }
      }
    });
  }

  async reinitializeMseWrapper () {
    if (this.mediaSourceWrapper) {
      this.mediaSourceWrapper.destroy();
    }

    this.mediaSourceWrapperGenericErrorRestartCount = 0;
    this.mediaSourceWrapper = MediaSourceWrapper.factory(this.videoElement, {
      enableMetrics: this.options.enableMetrics,
    });
    this.mediaSourceWrapper.moov = this.moov;

    try {
      this.mediaSourceWrapper.registerMimeCodec(this.mimeCodec);
    }
    catch (error) {
      const message = `Unsupported mime codec: ${this.mimeCodec}`;

      this.videoPlayer.errors.extend({
        PLAYER_ERR_IOV: {
          headline: 'Error Playing Stream',
          message,
        },
      });

      this.videoPlayer.error({ code: 'PLAYER_ERR_IOV' });

      throw new Error(message);
    }

    this.mediaSourceWrapper.on('metric', ({ type, value }) => {
      this.trigger('metric', { type, value });
    });

    this.mediaSourceWrapper.on('sourceOpen', async () => {
      this.debug('on mediaSource sourceopen');

      // @todo - shouldn't the mediaSource pass this option?
      await this.mediaSourceWrapper.initializeSourceBuffer({
        enableMetrics: this.options.enableMetrics,
      });

      // @todo - shouldn't sourceBuffer metrics come from the "parent"
      // mediaSourceWrapper?
      this.mediaSourceWrapper.sourceBuffer.on('metric', ({ type, value }) => {
        this.trigger('metric', { type, value });
      });

      this.mediaSourceWrapper.sourceBuffer.on('appendStart', (moof) => {
        this.silly('On Append Start...');

        if ((this.LogSourceBuffer === true) && (this.LogSourceBufferTopic !== null)) {
          this.debug(`Recording ${parseInt(moof.length)} bytes of data.`);

          const mqtt_msg = new window.Paho.MQTT.Message(moof);
          mqtt_msg.destinationName = this.LogSourceBufferTopic;
          window.MQTTClient.send(mqtt_msg);
        }

        this.iov.statsMsg.byteCount += moof.length;
      });

      this.mediaSourceWrapper.sourceBuffer.on('appendFinish', (info) => {
        this.silly('On Append Finish...');

        if (!this.firstFrameShown) {
          this.firstFrameShown = true;
          this.trigger('firstFrameShown');
        }

        this.drift = info.bufferTimeEnd - this.videoElement.currentTime;

        this.metric('iovPlayer.mediaSource.sourceBuffer.bufferTimeEnd', info.bufferTimeEnd);
        this.metric('iovPlayer.video.currentTime', this.videoElement.currentTime);
        this.metric('iovPlayer.video.drift', this.drift);

        if (this.drift > ((this.segmentIntervalAverage / 1000) + this.options.driftCorrectionConstant)) {
          this.metric('iovPlayer.video.driftCorrection', 1);
          this.videoElement.currentTime = info.bufferTimeEnd;
        }

        if (this.videoElement.paused === true) {
          this.debug('Video is paused!');

          try {
            const promise = this.videoElement.play();

            if (typeof promise !== 'undefined') {
              promise.catch((error) => {
                this._onError(
                  'videojs.play.promise',
                  'Error while trying to play videojs player',
                  error
                );
              });
            }
          }
          catch (error) {
            this._onError(
              'videojs.play.notPromise',
              'Error while trying to play videojs player',
              error
            );
          }
        }
      });

      this.mediaSourceWrapper.sourceBuffer.on('appendError', async (error) => {
        // Can occur when the tab in the browser where this video player
        // lives is hidden, then shown after about 10 seconds or more.
        // Can occur when "The SourceBuffer is full, and cannot free space to append additional buffers."
        // Can occur when "The HTMLMediaElement.error attribute is not null."
        this._onError(
          'sourceBuffer.append',
          'Error while appending to sourceBuffer',
          error
        );

        // @todo - can we just restart here instead of creating a new wrapper?
        await this.reinitializeMseWrapper();
      });

      this.mediaSourceWrapper.sourceBuffer.on('removeFinish', (info) => {
        this.debug('onRemoveFinish');
      });

      this.mediaSourceWrapper.sourceBuffer.on('removeError', (error) => {
        if (error.constructor.name === 'DOMException') {
          // @todo - every time the mediaSourceWrapper is destroyed, there is a
          // sourceBuffer error.  No need to log that, but you should fix it
          return;
        }

        // observed this fail during a memry snapshot in chrome
        // otherwise no observed failure, so ignore exception.
        this._onError(
          'sourceBuffer.remove',
          'Error while removing segments from sourceBuffer',
          error
        );
      });

      this.mediaSourceWrapper.sourceBuffer.on('streamFrozen', async () => {
        this.debug('stream appears to be frozen - reinitializing...');

        // @todo - can we just restart here instead of creating a new wrapper?
        await this.reinitializeMseWrapper();
      });

      this.mediaSourceWrapper.sourceBuffer.on('error', (error) => {
        this.mediaSourceWrapperGenericErrorRestartCount++;

        // Sometimes, when we receive this error, it is due to a bad segment
        // at or near the beginning of the stream.  In those instances, restarting
        // the stream may fix the issue, so try it a few times.
        if (this.mediaSourceWrapperGenericErrorRestartCount <= this.options.maxMediaSourceWrapperGenericErrorRestartCount) {
          this.metric('iovPlayer.mediaSource.sourceBuffer.genericErrorRestartCount', this.mediaSourceWrapperGenericErrorRestartCount);

          this.restart();
        }

        this._onError(
          'mediaSource.sourceBuffer.generic',
          'mediaSource sourceBuffer error',
          error
        );
      });

      this.trigger('videoInfoReceived');
    });

    this.mediaSourceWrapper.on('sourceEnded', () => {
      this.debug('on mediaSource sourceended');

      // @todo - do we need to clear the buffer manually?
      this.stop();
    });

    this.mediaSourceWrapper.on('error', (error) => {
      this._onError(
        'mediaSource.generic',
        'mediaSource error',
        error
      );
    });

    await this.mediaSourceWrapper.initializeMediaSource();

    if (!this.mediaSourceWrapper.mediaSource || !this.videoElement) {
      throw new Error('The video element or mediaSource is not ready!');
    }

    this.mediaSourceWrapper.reinitializeVideoElementSrc();
  }

  play (streamName) {
    this.debug('play');

    this.iov.conduit.start(async (mimeCodec, moov) => {
      // These are needed for reinitializeMseWrapper
      this.mimeCodec = mimeCodec;
      this.moov = moov;

      this.iov.conduit.stream((moof) => {
        this.trigger('videoReceived');
        this.calculateSegmentIntervalMetrics();

        if (document.hidden || this.destroyed) {
          return;
        }

        if (this.options.maxMoofWait) {
          this.moofWaitReset();
        }

        // @todo - somehow, this can be called when either the
        // mediaSourceWrapper or the sourceBuffer doesn't exist
        try {
          this.mediaSourceWrapper.sourceBuffer.append(moof);
        }
        catch (error) {
          console.error(error);
        }
      });

      this.iov.conduit.onResync(async () => {
        this.debug('sync event received');

        await this.reinitializeMseWrapper();
      });

      await this.reinitializeMseWrapper();
    });
  }

  stop () {
    this.debug('stop');

    // When stopping the player, we will always need to re-request the stream's moov
    // if we want to start playing the stream again.  Discarding it here forces us to
    // re-request it later.
    this.moov = null;
    this.mimeCodec = null;

    try {
      this.iov.conduit.stop();
    }
    catch (error) {
      console.error(error);
    }
  }

  restart () {
    this.debug('restart');

    this.stop();
    this.play();
  }

  /**
   * To be run every time a moof is received.
   *
   * This method captures metrics on segments intervals - the amount of time
   * between moofs.  This metric has been helpful in allowing us to identify
   * certain stream behavior, and is needed when calculating the thresholds
   * that allow us to determine when a stream is "frozen".  It has also helped
   * us identify what guarantees we can make about how close to real-time any
   * given stream can be.
   */
  calculateSegmentIntervalMetrics () {
    const previousSegmentReceived = this.latestSegmentReceived;

    this.latestSegmentReceived = Date.now();

    if (!previousSegmentReceived) {
      return;
    }

    this.segmentInterval = this.latestSegmentReceived - previousSegmentReceived;

    if (!this.segmentInterval) {
      return;
    }

    // Ensure we only ever keep a limited number of segment intervals.
    if (this.segmentIntervals.length >= this.options.segmentIntervalSampleSize) {
      this.segmentIntervals.shift();
    }

    this.segmentIntervals.push(this.segmentInterval);

    let segmentIntervalSum = 0;

    for (let i = 0; i < this.segmentIntervals.length; i++) {
      segmentIntervalSum += this.segmentIntervals[i];
    }

    this.segmentIntervalAverage = segmentIntervalSum / this.segmentIntervals.length;

    this.metric('iovPlayer.video.segmentInterval', this.segmentInterval);
    this.metric('iovPlayer.video.segmentIntervalAverage', this.segmentIntervalAverage);
  }

  destroy () {
    this.debug('destroying');

    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.stop();

    // Note you will need to destroy the iov yourself.  The child should
    // probably not destroy the parent
    this.iov = null;

    this.firstFrameShown = null;

    this.playerInstance = null;
    this.videoJsVideoElement = null;
    this.videoElementParent = null;

    this.LogSourceBuffer = null;
    this.LogSourceBufferTopic = null;

    this.latestSegmentReceived = null;
    this.segmentIntervalAverage = null;
    this.segmentInterval = null;
    this.segmentIntervals = null;

    if (this.mediaSourceWrapper) {
      this.mediaSourceWrapper.destroy();
    }

    this.mediaSourceWrapper = null;
    this.mediaSourceWrapperGenericErrorRestartCount = null;

    // Setting the src of the video element to an empty string is
    // the only reliable way we have found to ensure that MediaSource,
    // SourceBuffer, and various Video elements are properly dereferenced
    // to avoid memory leaks
    this.videoElement.src = '';
    this.videoElement = null;

    if (this.moofWaitReset) {
      this.moofWaitReset.cancel();
      this.moofWaitReset = null;
    }

    super.destroy();
  }
};
