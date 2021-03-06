'use strict';

import defaults from 'lodash/defaults';

import MSEWrapper from './MSEWrapper';
import Logger from '../utils/logger';

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
export default class IOVPlayer {
  static EVENT_NAMES = [
    'metric',
    'firstFrameShown',
    'videoReceived',
    'videoInfoReceived',
  ];

  static METRIC_TYPES = [
    'sourceBuffer.bufferTimeEnd',
    'video.currentTime',
    'video.drift',
    'video.driftCorrection',
    'video.segmentInterval',
    'video.segmentIntervalAverage',
  ];

  static SEGMENT_INTERVAL_SAMPLE_SIZE = 5;
  static DRIFT_CORRECTION_CONSTANT = 2;

  static factory (
    iov,
    videoElement,
    options = {}
  ) {
    return new IOVPlayer(
      iov,
      videoElement,
      options
    );
  }

  constructor (
    iov,
    videoElement,
    options
  ) {
    this.logger = Logger().factory(`IOV Player ${iov.id}`);

    this.logger.debug('constructor');

    this.metrics = {};

    // @todo - there must be a more proper way to do events than this...
    this.events = {};

    for (let i = 0; i < IOVPlayer.EVENT_NAMES.length; i++) {
      this.events[IOVPlayer.EVENT_NAMES[i]] = [];
    }

    this.iov = iov;
    this.videoElement = videoElement;

    this.options = defaults(
      {},
      options,
      {
        segmentIntervalSampleSize: IOVPlayer.SEGMENT_INTERVAL_SAMPLE_SIZE,
        driftCorrectionConstant: IOVPlayer.DRIFT_CORRECTION_CONSTANT,
        enableMetrics: false,
      }
    );

    this.firstFrameShown = false;
    this.stopped = false;

    // Used for determining the size of the internal buffer hidden from the MSE
    // api by recording the size and time of each chunk of video upon buffer append
    // and recording the time when the updateend event is called.
    this.LogSourceBuffer = false;
    this.LogSourceBufferTopic = null;

    this.latestSegmentReceived = null;
    this.segmentIntervalAverage = null;
    this.segmentInterval = null;
    this.segmentIntervals = [];

    this.mseWrapper = null;
    this.moovBox = null;
  }

  on (name, action) {
    this.logger.debug(`Registering Listener for ${name} event...`);

    if (!IOVPlayer.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    if (this.destroyed) {
      return;
    }

    this.events[name].push(action);
  }

  trigger (name, value) {
    const sillyMetrics = [
      'metric',
      'videoReceived',
    ];

    if (sillyMetrics.includes(name)) {
      this.logger.silly(`Triggering ${name} event...`);
    }
    else {
      this.logger.debug(`Triggering ${name} event...`);
    }

    if (this.destroyed) {
      return;
    }

    if (!IOVPlayer.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    for (let i = 0; i < this.events[name].length; i++) {
      this.events[name][i](value, this);
    }
  }

  metric (type, value) {
    if (!this.options.enableMetrics) {
      return;
    }

    if (!IOVPlayer.METRIC_TYPES.includes(type)) {
      // @todo - should this throw?
      return;
    }

    switch (type) {
      case 'video.driftCorrection': {
        if (!this.metrics[type]) {
          this.metrics[type] = 0;
        }

        this.metrics[type] += value;

        break;
      }
      default: {
        this.metrics[type] = value;
      }
    }

    this.trigger('metric', {
      type,
      value: this.metrics[type],
    });
  }

  _onError (
    type,
    message,
    error
  ) {
    this.logger.warn(
      type,
      ':',
      message
    );
    this.logger.error(error);
  }

  _html5Play () {
    // @see - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
    try {
      const promise = this.videoElement.play();

      if (typeof promise !== 'undefined') {
        promise.catch((error) => {
          this._onError(
            'play.promise',
            'Error while trying to play clsp video',
            error
          );
        });
      }
    }
    catch (error) {
      this._onError(
        'play.notPromise',
        'Error while trying to play clsp video - the play operation was NOT a promise!',
        error
      );
    }
  }

  async reinitializeMseWrapper (mimeCodec) {
    if (this.mseWrapper) {
      await this.mseWrapper.destroy();
    }

    this.mseWrapper = MSEWrapper.factory(this.videoElement);

    this.mseWrapper.on('metric', ({
      type,
      value,
    }) => {
      this.trigger('metric', {
        type,
        value,
      });
    });

    this.mseWrapper.initializeMediaSource({
      onSourceOpen: async () => {
        this.logger.debug('on mediaSource sourceopen');

        await this.mseWrapper.initializeSourceBuffer(mimeCodec, {
          onAppendStart: (byteArray) => {
            this.logger.silly('On Append Start...');

            this.iov.onAppendStart(byteArray);
          },
          onAppendFinish: (info) => {
            this.logger.silly('On Append Finish...');

            if (!this.firstFrameShown) {
              this.firstFrameShown = true;
              this.trigger('firstFrameShown');
            }

            this.drift = info.bufferTimeEnd - this.videoElement.currentTime;

            this.metric('sourceBuffer.bufferTimeEnd', info.bufferTimeEnd);
            this.metric('video.currentTime', this.videoElement.currentTime);
            this.metric('video.drift', this.drift);

            if (this.drift > ((this.segmentIntervalAverage / 1000) + this.options.driftCorrectionConstant)) {
              this.metric('video.driftCorrection', 1);
              this.videoElement.currentTime = info.bufferTimeEnd;
            }

            if (this.videoElement.paused === true) {
              this.logger.debug('Video is paused!');

              this._html5Play();
            }
          },
          onRemoveFinish: (info) => {
            this.logger.debug('onRemoveFinish');
          },
          onAppendError: async (error) => {
            // internal error, this has been observed to happen the tab
            // in the browser where this video player lives is hidden
            // then reselected. 'ex' is undefined the error is bug
            // within the MSE C++ implementation in the browser.
            this._onError(
              'sourceBuffer.append',
              'Error while appending to sourceBuffer',
              error
            );

            await this.reinitializeMseWrapper(mimeCodec);
          },
          onRemoveError: (error) => {
            if (error.constructor.name === 'DOMException') {
              // @todo - every time the mseWrapper is destroyed, there is a
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
          },
          onStreamFrozen: async () => {
            this.logger.debug('stream appears to be frozen - reinitializing...');

            await this.reinitializeMseWrapper(mimeCodec);
          },
          onError: async (error) => {
            this._onError(
              'mediaSource.sourceBuffer.generic',
              'mediaSource sourceBuffer error',
              error
            );

            await this.reinitializeMseWrapper(mimeCodec);
          },
        });

        this.trigger('videoInfoReceived');

        // @todo - the moovBox is currently set in the IOV - do something else
        this.mseWrapper.appendMoov(this.moovBox);
      },
      onSourceEnded: async () => {
        this.logger.debug('on mediaSource sourceended');

        await this.stop();
      },
      onError: (error) => {
        this._onError(
          'mediaSource.generic',
          'mediaSource error',
          // @todo - sometimes, this error is an event rather than an error!
          // If different onError calls use different method signatures, that
          // needs to be accounted for in the MSEWrapper, and the actual error
          // that was thrown must ALWAYS be the first argument here.  As a
          // shortcut, we can log `...args` here instead.
          error
        );
      },
    });

    if (!this.mseWrapper.mediaSource || !this.videoElement) {
      throw new Error('The video element or mediaSource is not ready!');
    }

    this.mseWrapper.reinitializeVideoElementSrc();
  }

  async restart () {
    this.logger.debug('restart');

    await this.iov.stop();
    await this.iov.play();
  }

  onMoov = async (mimeCodec, moov) => {
    // @todo - this seems like a hack...
    if (this.stopped) {
      return;
    }

    this.moovBox = moov;

    // this.trigger('firstChunk');

    await this.reinitializeMseWrapper(mimeCodec);

    this.iov.resyncStream(() => {
      // console.log('sync received re-initialize media source buffer');
      this.reinitializeMseWrapper(mimeCodec);
    });
  };

  onMoof = (mqttMessage) => {
    // @todo - this seems like a hack...
    if (this.stopped) {
      return;
    }

    this.trigger('videoReceived');
    this.getSegmentIntervalMetrics();
    this.mseWrapper.append(mqttMessage.payloadBytes);
  };

  async play () {
    this.logger.debug('play');

    this.stopped = false;

    await this.iov._play(this.onMoov, this.onMoof);
  }

  stop () {
    this.logger.debug('stop...');

    this.stopped = true;
    this.moovBox = null;

    this.iov._stop();

    this.logger.debug('stop about to finish synchronous operations and return promise...');

    // The logic above MUST be run synchronously when called, therefore,
    // we cannot use async to define the stop method, and must return a
    // promise here rather than using await.  We return this promise so
    // that the caller has the option of waiting, but is not forced to
    // wait.
    return new Promise((resolve, reject) => {
      // Don't wait until the next play event or the destruction of this player
      // to clear the MSE
      if (this.mseWrapper) {
        this.mseWrapper.destroy()
          .then(() => {
            this.mseWrapper = null;
            this.logger.debug('stop succeeded asynchronously...');
            resolve();
          })
          .catch((error) => {
            this.mseWrapper = null;
            this.logger.error('stop failed asynchronously...');
            reject(error);
          });
      }
      else {
        this.logger.debug('stop succeeded asynchronously...');
        resolve();
      }
    });
  }

  getSegmentIntervalMetrics () {
    const previousSegmentReceived = this.latestSegmentReceived;
    this.latestSegmentReceived = Date.now();

    if (previousSegmentReceived) {
      this.segmentInterval = this.latestSegmentReceived - previousSegmentReceived;
    }

    if (this.segmentInterval) {
      if (this.segmentIntervals.length >= this.options.segmentIntervalSampleSize) {
        this.segmentIntervals.shift();
      }

      this.segmentIntervals.push(this.segmentInterval);

      let segmentIntervalSum = 0;

      for (let i = 0; i < this.segmentIntervals.length; i++) {
        segmentIntervalSum += this.segmentIntervals[i];
      }

      this.segmentIntervalAverage = segmentIntervalSum / this.segmentIntervals.length;

      this.metric('video.segmentInterval', this.segmentInterval);
      this.metric('video.segmentIntervalAverage', this.segmentIntervalAverage);
    }
  }

  _freeAllResources () {
    this.logger.debug('_freeAllResources...');

    // Note you will need to destroy the iov yourself.  The child should
    // probably not destroy the parent
    this.iov = null;

    this.firstFrameShown = null;

    this.events = null;
    this.metrics = null;

    this.LogSourceBuffer = null;
    this.LogSourceBufferTopic = null;

    this.latestSegmentReceived = null;
    this.segmentIntervalAverage = null;
    this.segmentInterval = null;
    this.segmentIntervals = null;

    this.moovBox = null;

    this.logger.debug('_freeAllResources finished...');
  }

  destroy () {
    this.logger.debug('destroy...');

    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    // Note that we DO NOT wait for the stop command to finish execution,
    // because this destroy method MUST be treated as a synchronous operation
    // to ensure that the caller is not forced to wait on destruction.  This
    // allows us to properly support client side libraries and frameworks that
    // do not support asynchronous destruction.  See the comments in the destroy
    // method on the MSEWrapper for a more detailed explanation.
    this.logger.debug('about to stop...');
    this.stop()
      .then(() => {
        this.logger.debug('stopped successfully...');
        this._freeAllResources();
        this.logger.debug('destroy successfully finished...');
      })
      .catch((error) => {
        this.logger.debug('stopped unsuccessfully...');
        this.logger.error('Error while destroying the iov player!');
        this.logger.error(error);
        this._freeAllResources();
        this.logger.debug('destroy unsuccessfully finished...');
      });

    // Setting the src of the video element to an empty string is
    // the only reliable way we have found to ensure that MediaSource,
    // SourceBuffer, and various Video elements are properly dereferenced
    // to avoid memory leaks
    this.videoElement.src = '';
    this.videoElement = null;

    this.logger.debug('exiting destroy, asynchronous destroy logic in progress...');
  }
}
