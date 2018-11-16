import Debug from 'debug';
import uuidv4 from 'uuid/v4';
import defaults from 'lodash/defaults';

import MSEWrapper from './MSEWrapper';

const DEBUG_PREFIX = 'skyline:clsp:iov';
const debug = Debug(`${DEBUG_PREFIX}:IOVPlayer`);
const silly = Debug(`silly:${DEBUG_PREFIX}:IOVPlayer`);

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

  static factory (iov, playerInstance, options = {}) {
    return new IOVPlayer(iov, playerInstance, options);
  }

  constructor (iov, playerInstance, options) {
    debug('constructor');

    this.metrics = {};

    // @todo - there must be a more proper way to do events than this...
    this.events = {};

    for (let i = 0; i < IOVPlayer.EVENT_NAMES.length; i++) {
      this.events[IOVPlayer.EVENT_NAMES[i]] = [];
    }

    this._id = uuidv4();
    this.iov = iov;
    this.playerInstance = playerInstance;
    this.eid = this.playerInstance.el().firstChild.id;
    this.id = this.eid.replace('_html5_api', '');

    this.initializeVideoElement();

    this.options = defaults({}, options, {
      segmentIntervalSampleSize: IOVPlayer.SEGMENT_INTERVAL_SAMPLE_SIZE,
      driftCorrectionConstant: IOVPlayer.DRIFT_CORRECTION_CONSTANT,
      enableMetrics: false,
    });

    this.state = 'initializing';
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
    this.guid = null;
    this.mimeCodec = null;

    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  on (name, action) {
    debug(`Registering Listener for ${name} event...`);

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
      silly(`Triggering ${name} event...`);
    }
    else {
      debug(`Triggering ${name} event...`);
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

  _onError (type, message, error) {
    console.warn(type, ':', message);
    console.error(error);
  }

  assertMimeCodecSupported (mimeCodec) {
    if (!MSEWrapper.isMimeCodecSupported(mimeCodec)) {
      this.state = 'unsupported-mime-codec';

      const message = `Unsupported mime codec: ${mimeCodec}`;

      this.videoPlayer.errors.extend({
        PLAYER_ERR_IOV: {
          headline: 'Error Playing Stream',
          message,
        },
      });

      this.videoPlayer.error({ code: 'PLAYER_ERR_IOV' });

      throw new Error(message);
    }
  }

  initializeVideoElement () {
    this.videoJsVideoElement = document.getElementById(this.eid);

    if (!this.videoJsVideoElement) {
      throw new Error(`Unable to find an element in the DOM with id "${this.eid}".`);
    }

    const videoId = `clsp-video-${this._id}`;

    // when videojs initializes the video element (or something like that),
    // it creates events and listeners on that element that it uses, however
    // these events interfere with our ability to play clsp streams.  Cloning
    // the element like this and reinserting it is a blunt instrument to remove
    // all of the videojs events so that we are in control of the player.
    // this.videoElement = this.videoJsVideoElement.cloneNode();
    this.videoElement = this.videoJsVideoElement.cloneNode();
    this.videoElement.setAttribute('id', videoId);
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

            if (id !== this.eid && id !== videoId) {
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

  async reinitializeMseWrapper (mimeCodec) {
    if (this.mseWrapper) {
      await this.mseWrapper.destroy();
    }

    this.mseWrapper = MSEWrapper.factory(this.videoElement);

    this.mseWrapper.on('metric', ({ type, value }) => {
      this.trigger('metric', { type, value });
    });

    this.mseWrapper.initializeMediaSource({
      onSourceOpen: async () => {
        debug('on mediaSource sourceopen');

        await this.mseWrapper.initializeSourceBuffer(mimeCodec, {
          onAppendStart: (byteArray) => {
            silly('On Append Start...');

            if ((this.LogSourceBuffer === true) && (this.LogSourceBufferTopic !== null)) {
              debug(`Recording ${parseInt(byteArray.length)} bytes of data.`);

              const mqtt_msg = new window.Paho.MQTT.Message(byteArray);
              mqtt_msg.destinationName = this.LogSourceBufferTopic;
              window.MQTTClient.send(mqtt_msg);
            }

            this.iov.statsMsg.byteCount += byteArray.length;
          },
          onAppendFinish: (info) => {
            silly('On Append Finish...');

            if (!this.firstFrameShown) {
              this.firstFrameShown = true;
              this.playerInstance.trigger('firstFrameShown');
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
              debug('Video is paused!');

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
          },
          onRemoveFinish: (info) => {
            debug('onRemoveFinish');
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
            debug('stream appears to be frozen - reinitializing...');

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
        this.mseWrapper.appendMoov(this.moovBox);
      },
      onSourceEnded: async () => {
        debug('on mediaSource sourceended');

        await this.stop();
      },
      onError: (error) => {
        this._onError(
          'mediaSource.generic',
          'mediaSource error',
          error
        );
      },
    });

    if (!this.mseWrapper.mediaSource || !this.videoElement) {
      throw new Error('The video element or mediaSource is not ready!');
    }

    this.mseWrapper.reinitializeVideoElementSrc();
  }

  resyncStream (mimeCodec) {
    // subscribe to a sync topic that will be called if the stream that is feeding
    // the mse service dies and has to be restarted that this player should restart the stream
    debug('Trying to resync stream...');

    this.iov.conduit.subscribe(`iov/video/${this.guid}/resync`, async () => {
      debug('sync received re-initialize media source buffer');
      await this.reinitializeMseWrapper(mimeCodec);
    });
  }

  async restart () {
    debug('restart');

    await this.stop();

    this.play();
  }

  play () {
    debug('play');

    this.stopped = false;

    // @todo - why doesn't this play/stop connect/disconnect work?
    // this.iov.conduit.connect();

    this.iov.conduit.transaction(
      `iov/video/${window.btoa(this.iov.config.streamName)}/request`,
      (...args) => this.onIovPlayTransaction(...args),
      { clientId: this.iov.config.clientId }
    );
  }

  stop () {
    debug('stop...');

    this.stopped = true;
    this.moovBox = null;

    if (this.guid) {
      // Stop listening for moofs
      this.iov.conduit.unsubscribe(`iov/video/${this.guid}/live`);

      // Stop listening for resync events
      this.iov.conduit.unsubscribe(`iov/video/${this.guid}/resync`);

      // Tell the server we've stopped
      this.iov.conduit.publish(
        `iov/video/${this.guid}/stop`,
        { clientId: this.iov.config.clientId }
      );

      // @todo - why doesn't this play/stop connect/disconnect work?
      // this.iov.conduit.disconnect();
    }

    debug('stop about to finish synchronous operations and return promise...');

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
            debug('stop succeeded asynchronously...');
            resolve();
          })
          .catch((error) => {
            this.mseWrapper = null;
            debug('stop failed asynchronously...');
            reject(error);
          });
      }
      else {
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

  onVisibilityChange = () => {
    // @todo - the timeout value will be created every time this function is
    // executed, which means that if you switch tabs and come back faster than
    // one second, the timeout from the tab switch will never be cleared (because
    // it is no longer in scope), and the video will be stopped and never re-played
    let timeout;

    if (document.hidden) {
      timeout = setTimeout(async () => {
        await this.stop();
      }, 1000);
    }
    else {
      clearTimeout(timeout);
      this.play();
    }
  };

  // @todo - there is much shared between this and onChangeSourceTransaction
  onIovPlayTransaction ({ mimeCodec, guid }) {
    if (this.stopped) {
      return;
    }

    debug('onIovPlayTransaction');

    this.assertMimeCodecSupported(mimeCodec);

    const initSegmentTopic = `${this.iov.config.clientId}/init-segment/${parseInt(Math.random() * 1000000)}`;

    this.state = 'waiting-for-first-moov';

    this.iov.conduit.subscribe(initSegmentTopic, async ({ payloadBytes }) => {
      if (this.stopped) {
        return;
      }

      debug(`onIovPlayTransaction ${initSegmentTopic} listener fired`);
      debug(`received moov of type "${typeof payloadBytes}" from server`);

      const moov = payloadBytes;

      this.state = 'waiting-for-first-moof';

      this.iov.conduit.unsubscribe(initSegmentTopic);

      const newTopic = `iov/video/${guid}/live`;

      // subscribe to the live video topic.
      this.iov.conduit.subscribe(newTopic, (mqtt_msg) => {
        if (this.stopped) {
          return;
        }

        this.trigger('videoReceived');
        this.getSegmentIntervalMetrics();
        this.mseWrapper.append(mqtt_msg.payloadBytes);
      });

      this.guid = guid;
      this.moovBox = moov;
      this.mimeCodec = mimeCodec;

      // this.trigger('firstChunk');

      await this.reinitializeMseWrapper(mimeCodec);
      this.resyncStream(mimeCodec);
    });

    this.iov.conduit.publish(`iov/video/${guid}/play`, {
      initSegmentTopic,
      clientId: this.iov.config.clientId,
    });
  }

  _freeAllResources () {
    debug('_freeAllResources...');

    // Note you will need to destroy the iov yourself.  The child should
    // probably not destroy the parent
    this.iov = null;

    this.state = null;
    this.firstFrameShown = null;

    this.playerInstance = null;
    this.videoJsVideoElement = null;
    this.videoElementParent = null;

    this.events = null;
    this.metrics = null;

    this.LogSourceBuffer = null;
    this.LogSourceBufferTopic = null;

    this.latestSegmentReceived = null;
    this.segmentIntervalAverage = null;
    this.segmentInterval = null;
    this.segmentIntervals = null;

    this.guid = null;
    this.moovBox = null;
    this.mimeCodec = null;

    debug('_freeAllResources finished...');
  }

  destroy () {
    debug('destroy...');

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
    debug('about to stop...');
    this.stop()
      .then(() => {
        debug('stopped successfully...');
        this._freeAllResources();
        debug('destroy successfully finished...');
      })
      .catch((error) => {
        debug('stopped unsuccessfully...');
        console.error('Error while destroying the iov player!');
        console.error(error);
        this._freeAllResources();
        debug('destroy unsuccessfully finished...');
      });

    // This MUST be executed immediately after the stop command issues its
    // conduit commands.  If it is not, meaning the stop operation was waited
    // for, then we run the risk of the iframe being destroyed by the caller
    // before we can properly disconnect from the server.
    debug('disconnecting from server...');
    this.iov.conduit.disconnect();

    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    // Setting the src of the video element to an empty string is
    // the only reliable way we have found to ensure that MediaSource,
    // SourceBuffer, and various Video elements are properly dereferenced
    // to avoid memory leaks
    this.videoElement.src = '';
    this.videoElement = null;

    debug('exiting destroy, asynchronous destroy logic in progress...');
  }
};
