'use strict';

// @todo - some of the debounces in here can lead to things occurring at
// unexpected times.  Try to find a more proper solution
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
  static DEFAULT_OPTIONS = {
    maxMoofWait: 30 * 1000,
    segmentIntervalSampleSize: 5,
    driftCorrectionConstant: 2,
    maxMediaSourceWrapperGenericErrorRestartCount: 50,
    // The options below control the "insufficient resources"
    // detection, which has the event name "maxMediaSourceRetriesExceeded".
    // The relationship of all of them to one another
    // is important, and using values other than the defaults is
    // discouraged.  These values seemed to perform the best on
    // moderate hardware, though individual results will vary.
    // The intervals and delays reduce the seizure-inducing
    // effect of the players flashing.  These values and their
    // uses are great and all, but if they are not used in
    // conjunction with a "global" event that resets the retry
    // counters of all of the other video players, it is not
    // very useful.
    // These settings were tested against 32 "high quality" streams
    maxMediaSourceRetries: 15,
    maxMediaSourceRetryInterval: 15 * 1000,
    mediaSourceRetryInterval: 0.5 * 1000,
    restartDelay: 0.5 * 1000,
  };

  static EVENT_NAMES = [
    ...ListenerBaseClass.EVENT_NAMES,
    'firstFrameShown',
    'videoReceived',
    'videoInfoReceived',
    'maxMediaSourceRetriesExceeded',
    'noMimeCodec',
    'readyForNextSource',
  ];

  static METRIC_TYPES = [
    'iovPlayer.instances',
    'iovPlayer.iov.id',
    'iovPlayer.moofWaitExceeded',
    'iovPlayer.video.currentTime',
    'iovPlayer.video.drift',
    'iovPlayer.video.driftCorrection',
    'iovPlayer.video.segmentInterval',
    'iovPlayer.video.segmentIntervalAverage',
    'iovPlayer.mediaSource.sourceBuffer.bufferTimeEnd',
    'iovPlayer.mediaSource.sourceBuffer.genericErrorRestartCount',
  ];

  static factory (iov, options = {}) {
    return new IOVPlayer(iov, options);
  }

  constructor (iov, options) {
    super(options);

    // The parent IOV that this player belongs to
    this.iov = iov;
    // The ID we will use for the `video` DOM element that will be
    // used to show the clsp stream video (which is NOT the same
    // `video` DOM element as the one that videojs initializes)
    this.videoId = `clsp-video-${this.iov.conduit.id}`;

    this.initializeVideoElement();

    this.firstFrameShown = false;

    this.latestSegmentReceived = null;
    this.segmentIntervalAverage = null;
    this.segmentInterval = null;
    this.segmentIntervals = [];
    this.moofWaitReset = null;
    this.retryCount = 0;
    this.resetRetryCount = null;

    if (this.options.maxMoofWait) {
      this.moofWaitReset = debounce(() => {
        if (this.destroyed) {
          return;
        }

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

    // @todo - don't use a window event unless you really have to...
    window.addEventListener('maxMediaSourceRetriesExceeded', this.onMaxMediaSourceRetriesExceeded);
  }

  onMaxMediaSourceRetriesExceeded = () => {
    // @todo - there is no need to do this for the instance that triggered the event
    // perhaps send the eid, and compare it to this.eid
    this.retryCount = 0;
  };

  onFirstMetricListenerRegistered () {
    super.onFirstMetricListenerRegistered();

    this.metric('iovPlayer.instances', 1);
    this.metric('iovPlayer.iov.id', this.iov.id);
  }

  _onError (type, message, error) {
    console.error(type, message);
    console.error(error);
  }

  initializeVideoElement () {
    // If using a single source, this will be the video DOM element that videojs is aware of.
    // If using tours, on all but the first source, this will be the video DOM element of the
    // previous video in the tour.
    const previousVideoId = this.iov.videoElement.firstChild.id;
    const previousVideoElement = document.getElementById(previousVideoId);

    if (!previousVideoElement) {
      throw new Error(`Unable to find an element in the DOM with id "${previousVideoId}".`);
    }

    const videoElementParent = previousVideoElement.parentNode;

    // when videojs initializes the video element (or something like that),
    // it creates events and listeners on that element that it uses, however
    // these events interfere with our ability to play clsp streams.  Cloning
    // the element like this and reinserting it is a blunt instrument to remove
    // all of the videojs events so that we are in control of the player.
    this.videoElement = this.iov.videoJsElement.cloneNode();
    this.videoElement.setAttribute('id', this.videoId);
    this.videoElement.classList.add('clsp-video');
    this.videoElement.classList.remove('hide');

    // @todo - since this only matters for clones in tours, move it to where
    // the clone logic is
    this.on('firstFrameShown', () => {
      if (!videoElementParent) {
        return;
      }

      // @todo - this may be overkill given the IOV changeSourceMaxWait...
      // When the video is ready to be displayed, swap out the video player if
      // the source has changed.  This is what allows tours to switch to the next
      try {
        let videos = videoElementParent.getElementsByTagName('video');

        videoElementParent.insertBefore(this.videoElement, previousVideoElement);

        for (let i = 0; i < videos.length; i++) {
          const video = videos[i];
          const id = video.getAttribute('id');

          // Do not process the current video or the videojs video DOM element
          if (id === this.videoId || id === this.iov.videoId || id === previousVideoId) {
            continue;
          }

          // Remove any other video elements
          videoElementParent.removeChild(video);
          video.remove();
        }

        videos = null;
      }
      catch (e) {
        console.error(e);
      }
    });
  }

  reinitializeMseWrapper = debounce(() => {
    if (this.destroyed) {
      return;
    }

    if (this.retryCount >= this.options.maxMediaSourceRetries) {
      this.trigger('maxMediaSourceRetriesExceeded');
      window.dispatchEvent(new window.Event('maxMediaSourceRetriesExceeded'));
      return;
    }

    this.retryCount++;

    if (this.resetRetryCount) {
      clearTimeout(this.resetRetryCount);
    }

    this.resetRetryCount = setTimeout(() => {
      this.retryCount = 0;
    }, this.options.maxMediaSourceRetryInterval);

    if (this.mediaSourceWrapper) {
      this.mediaSourceWrapper.destroy();
    }

    if (!this.mimeCodec) {
      // @todo - this should never happen - need to investigate
      console.warn('mime codec not available yet...');
      return;
    }

    this.mediaSourceWrapperGenericErrorRestartCount = 0;

    this.mediaSourceWrapper = MediaSourceWrapper.factory(this.videoElement, {
      enableMetrics: this.options.enableMetrics,
    });

    this.mediaSourceWrapper.moov = this.moov;
    this.mediaSourceWrapper.registerMimeCodec(this.mimeCodec);

    this.mediaSourceWrapper.on('metric', ({ type, value }) => {
      this.metric(type, value, true);
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
        this.metric(type, value, true);
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

      this.mediaSourceWrapper.sourceBuffer.on('appendError', (error) => {
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
        // await this.reinitializeMseWrapper();
        this.restart();
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

      this.mediaSourceWrapper.sourceBuffer.on('streamFrozen', () => {
        this.debug('stream appears to be frozen - reinitializing...');

        this.restart();
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
        else {
          // @todo - what should we do when we exceed the maxMediaSourceWrapperGenericErrorRestartCount?
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

    this.mediaSourceWrapper.on('sourceOpenFailure', () => {
      this.debug('media source failed to become ready');

      this.restart();
    });

    this.mediaSourceWrapper.on('error', (error) => {
      this._onError(
        'mediaSource.generic',
        'mediaSource error',
        error
      );
    });

    this.mediaSourceWrapper.initializeMediaSource().then(() => {
      if (!this.mediaSourceWrapper.mediaSource || !this.videoElement) {
        throw new Error('The video element or mediaSource is not ready!');
      }

      this.mediaSourceWrapper.reinitializeVideoElementSrc();
    });
  }, this.options.mediaSourceRetryInterval, { leading: true });

  play (streamName) {
    this.debug('play');

    if (this.destroyed) {
      return;
    }

    this.iov.conduit.start((mimeCodec, moov) => {
      if (this.destroyed) {
        return;
      }

      // These are needed for reinitializeMseWrapper
      this.mimeCodec = mimeCodec;
      this.moov = moov;

      this.iov.conduit.stream((moof) => {
        if (this.destroyed) {
          return;
        }

        this.trigger('videoReceived');
        this.calculateSegmentIntervalMetrics();

        if (document.hidden) {
          return;
        }

        if (this.options.maxMoofWait) {
          this.moofWaitReset();
        }

        // @todo - somehow, this can be called when either the
        // mediaSourceWrapper or the sourceBuffer doesn't exist
        try {
          if (!this.mediaSourceWrapper || !this.mediaSourceWrapper.sourceBuffer) {
            this.restart();

            return;
          }

          this.mediaSourceWrapper.sourceBuffer.append(moof);
        }
        catch (error) {
          console.error(error);
        }
      });

      this.iov.conduit.onResync(() => {
        if (this.destroyed) {
          return;
        }

        this.debug('sync event received');

        this.reinitializeMseWrapper();
      });

      this.reinitializeMseWrapper();
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

  restart = debounce(() => {
    if (this.destroyed) {
      return;
    }

    this.debug('restart');

    this.stop();
    this.play();
  }, this.options.restartDelay, { leading: true });

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
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.debug('destroying');

    this.stop();

    window.removeEventListener('maxMediaSourceRetriesExceeded', this.onMaxMediaSourceRetriesExceeded);

    // Note you will need to destroy the iov yourself.  The child should
    // probably not destroy the parent
    this.iov = null;

    this.firstFrameShown = null;

    if (this.resetRetryCount) {
      clearTimeout(this.resetRetryCount);
    }
    this.resetRetryCount = null;
    this.retryCount = null;

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
    // @see - https://bugs.chromium.org/p/chromium/issues/detail?id=637284
    this.videoElement.src = '';
    this.videoElement = null;

    if (this.moofWaitReset) {
      this.moofWaitReset.cancel();
      this.moofWaitReset = null;
    }

    super.destroy();
  }
};
