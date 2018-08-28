import uuidv4 from 'uuid/v4';
import defaults from 'lodash/defaults';

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
    'iovPlayer.sourceBuffer.bufferTimeEnd',
    'iovPlayer.video.currentTime',
    'iovPlayer.video.drift',
    'iovPlayer.video.driftCorrection',
    'iovPlayer.video.segmentInterval',
    'iovPlayer.video.segmentIntervalAverage',
  ];

  static SEGMENT_INTERVAL_SAMPLE_SIZE = 5;
  static DRIFT_CORRECTION_CONSTANT = 2;

  static factory (iov, playerInstance, options = {}) {
    return new IOVPlayer(iov, playerInstance, options);
  }

  constructor (iov, playerInstance, options) {
    super(IOVPlayer.DEBUG_NAME);

    this.debug('constructor');

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
    });

    this.state = 'initializing';
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

    this.mediaSourceWrapper = null;
    this.moovBox = null;
    this.guid = null;
  }

  _onError (type, message, error) {
    console.error(message);
    console.error(error);
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

  async reinitializeMseWrapper () {
    if (this.mediaSourceWrapper) {
      this.mediaSourceWrapper.destroy();
    }

    this.mediaSourceWrapper = MediaSourceWrapper.factory(this.videoElement);

    this.mediaSourceWrapper.on('metric', ({ type, value }) => {
      this.trigger('metric', { type, value });
    });

    this.mediaSourceWrapper.on('sourceOpen', async () => {
      this.debug('on mediaSource sourceopen');

      await this.mediaSourceWrapper.initializeSourceBuffer();

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

        this.metric('iovPlayer.sourceBuffer.bufferTimeEnd', info.bufferTimeEnd);
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
        // internal error, this has been observed to happen the tab
        // in the browser where this video player lives is hidden
        // then reselected. 'ex' is undefined the error is bug
        // within the MSE C++ implementation in the browser.
        this._onError(
          'sourceBuffer.append',
          'Error while appending to sourceBuffer',
          error
        );
        // this.videoPlayer.error({ code: 3 });
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

        await this.reinitializeMseWrapper();
      });

      this.mediaSourceWrapper.sourceBuffer.on('error', (error) => {
        this._onError(
          'mediaSource.sourceBuffer.generic',
          'mediaSource sourceBuffer error',
          error
        );
      });

      this.trigger('videoInfoReceived');
      this.mediaSourceWrapper.sourceBuffer.appendMoov(this.moovBox);
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

  resyncStream () {
    // subscribe to a sync topic that will be called if the stream that is feeding
    // the mse service dies and has to be restarted that this player should restart the stream
    this.debug('Trying to resync stream...');

    this.iov.conduit.subscribe(`iov/video/${this.guid}/resync`, async () => {
      this.debug('sync received re-initialize media source buffer');
      await this.reinitializeMseWrapper();
    });
  }

  restart () {
    this.debug('restart');

    this.stop();
    this.play();
  }

  play (streamName) {
    this.debug('play');

    this.iov.conduit.transaction(
      `iov/video/${window.btoa(this.iov.config.streamName)}/request`,
      (...args) => this.onIovPlayTransaction(...args),
      {
        clientId: this.iov.config.clientId,
        resp_topic: `${this.iov.config.clientId}'/response/'${parseInt(Math.random() * 1000000)}`,
      },
    );
  }

  stop () {
    this.debug('stop');

    this.moovBox = null;

    if (this.guid !== undefined) {
      this.iov.conduit.unsubscribe(`iov/video/${this.guid}/live`);
    }

    this.iov.conduit.publish(
      `iov/video/${this.guid}/stop`,
      { clientId: this.iov.config.clientId }
    );
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

      this.metric('iovPlayer.video.segmentInterval', this.segmentInterval);
      this.metric('iovPlayer.video.segmentIntervalAverage', this.segmentIntervalAverage);
    }
  }

  /**
   * Before we can set up a listener for the moofs, we must first set up a few
   * initialization listeners, one for the stream request, and one for the moov.
   *
   * This method is what is executed when we first request a stream.  This should only
   * ever be executed once per stream.  Once this is executed, it unregisters
   * itself as a listener, and registers an init-segment listener, which also
   * only runs once, then unregisters itself.  The init-segment payload is the
   * moov.  Once we receive the moov, we can start listening for moofs.  The
   * listener for moofs runs indefinitely, until it is commanded to stop.
   *
   * @param {Object}
   *   The payload returned by the server.  This object contains the following properties:
   *   mimeCodec - the mime type for the stream
   *   guid - the unique id for this iov conduit connection
   */
  onIovPlayTransaction ({ mimeCodec, guid }) {
    this.debug('onIovPlayTransaction');

    const initSegmentTopic = `${this.iov.config.clientId}/init-segment/${parseInt(Math.random() * 1000000)}`;

    this.state = 'waiting-for-first-moov';

    this.iov.conduit.subscribe(initSegmentTopic, async ({ payloadBytes }) => {
      this.debug(`onIovPlayTransaction ${initSegmentTopic} listener fired`);
      this.debug(`received moov of type "${typeof payloadBytes}" from server`);

      const moov = payloadBytes;

      this.state = 'waiting-for-first-moof';

      this.iov.conduit.unsubscribe(initSegmentTopic);

      const newTopic = `iov/video/${guid}/live`;

      // subscribe to the live video topic.
      this.iov.conduit.subscribe(newTopic, (mqtt_msg) => {
        this.trigger('videoReceived');
        this.getSegmentIntervalMetrics();
        this.mediaSourceWrapper.sourceBuffer.append(mqtt_msg.payloadBytes);
      });

      this.guid = guid;
      this.moovBox = moov;

      // this.trigger('firstChunk');

      await this.reinitializeMseWrapper();

      try {
        this.mediaSourceWrapper.registerMimeCodec(mimeCodec);
      }
      catch (error) {
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

      this.resyncStream();
    });

    this.iov.conduit.publish(`iov/video/${guid}/play`, {
      initSegmentTopic,
      clientId: this.iov.config.clientId,
    });
  }

  destroy () {
    if (this.destroyed) {
      return;
    }

    super.destroy();

    this.destroyed = true;

    this.stop();

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

    this.mediaSourceWrapper.destroy();
    this.mediaSourceWrapper = null;

    // Setting the src of the video element to an empty string is
    // the only reliable way we have found to ensure that MediaSource,
    // SourceBuffer, and various Video elements are properly dereferenced
    // to avoid memory leaks
    this.videoElement.src = '';
    this.videoElement = null;
  }
};
