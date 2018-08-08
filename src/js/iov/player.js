import Debug from 'debug';
import debounce from 'lodash/debounce';

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
  static factory (iov, playerInstance) {
    return new IOVPlayer(iov, playerInstance);
  }

  constructor (iov, playerInstance) {
    debug('constructor');

    this.state = 'initializing';

    this.MAX_SEQ_PROC = 2;
    this.BUFFER_LIMIT = 6;
    this.EVENT_NAMES = [
      'firstChunk',
      'videoReceived',
      'videoInfoReceived',
    ];

    this.iov = iov;
    this.playerInstance = playerInstance;
    this.eid = this.playerInstance.el().firstChild.id;
    this.id = this.eid.replace('_html5_api', '');
    this.videoElement = document.getElementById(this.eid);

    if (!this.videoElement) {
      throw new Error(`Unable to find an element in the DOM with id "${this.eid}".`);
    }

    this.mediaSourceEventListeners = {
      sourceopen: (...args) => {
        debug('onSourceOpen');

        if (this.mediaSource.readyState === 'open') {
          this.initializeSourceBuffer();
          return;
        }

        // found when stress testing many videos, it is possible for the
        // media source ready state not to be open even though
        // source open callback is being called.
        const intervalToRetry = setInterval(() => {
          if (this.mediaSource.readyState === 'open') {
            this.initializeSourceBuffer();
            clearInterval(intervalToRetry);
          }
        }, 1000);
      },
      sourceended: (...args) => {
        debug('onSourceEnded');

        // @todo - do we need to clear the buffer manually?
        this.stop();
        this.source_buffer_ready = false;
      },
      error: (e) => {
        console.error('MSE error');
        console.error(e);
      },
    };

    this.sourceBufferEventListeners = {
      updateend: (...args) => this.onUpdateEnd(...args),
      error: (e) => {
        console.error('MSE sourceBuffer error');
        console.error(e);
      },
    };

    this.documentEventListeners = {
      visibilitychange: debounce(
        () => this.reinitializeMse(),
        2000,
        {
          leading: true,
          trailing: false,
        }
      ),
    };

    this.events = {};
    this.vqueue = []; // used if the media source buffer is busy

    // @todo - there must be a more proper way to do this...
    for (let i = 0; i < this.EVENT_NAMES.length; i++) {
      this.events[this.EVENT_NAMES[i]] = [];
    }

    // Used for determining the size of the internal buffer hidden from the MSE
    // api by recording the size and time of each chunk of video upon buffer append
    // and recording the time when the updateend event is called.
    this.LogSourceBuffer = false;
    this.LogSourceBufferTopic = null;

    this.moovBox = null;
    this.guid = null;
    this.mimeCodec = null;

    this.resetPlayState();
  }

  on (name, action) {
    debug(`Registering Listener for ${name} event...`);

    if (!this.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    this.events[name].push(action);
  }

  trigger (name) {
    debug(`Triggering ${name} event...`);

    if (!this.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    for (let i = 0; i < this.events[name].length; i++) {
      this.events[name][i](this);
    }
  }

  resetPlayState () {
    debug('resetPlayState');

    this.state = 'idle';
    this.source_buffer_ready = false;
  }

  assertMimeCodecSupported (mimeCodec) {
    if (!window.MediaSource || !window.MediaSource.isTypeSupported(mimeCodec)) {
      this.state = 'unsupported-mime-codec';

      const message = `Unsupported mime codec: ${mimeCodec}`;

      // the browser does not support this video format
      // @todo - the IOV player should have no knowledge of the videojs player
      this.playerInstance.errors.extend({
        PLAYER_ERR_IOV: {
          headline: 'Error Playing Stream',
          message,
        },
      });

      this.playerInstance.error({ code: 'PLAYER_ERR_IOV' });

      throw new Error(message);
    }
  }

  reinitializeMse () {
    debug('reinitializeMse');

    this.resetPlayState();

    if (this.mediaSource) {
      // free resource
      URL.revokeObjectURL(this.mediaSource);

      // reallocate, this will call media source open which will
      // append the MOOV atom.
      this.videoElement.src = URL.createObjectURL(this.mediaSource);
    }
  }

  restart () {
    debug('restart');

    this.stop();
    this.play();
  }

  play (streamName) {
    debug('play');

    this.iov.conduit.transaction(
      `iov/video/${window.btoa(this.iov.config.streamName)}/request`,
      (...args) => this.onIovPlayTransaction(...args),
      { clientId: this.iov.config.clientId }
    );
  }

  // @todo - it seems like a lot of the logic here is relative to something
  // inside of the IOV class - does the IOV instance mutate some of our properties?
  // Should this logic be moved to the IOV class?
  onBeforeAppendBuffer (bytearray) {
    silly('onBeforeAppendBuffer');

    if ((this.LogSourceBuffer === true) && (this.LogSourceBufferTopic !== null)) {
      silly(`recording ${bytearray.length} bytes of data...`);

      const mqtt_msg = new window.Paho.MQTT.Message(bytearray);
      mqtt_msg.destinationName = this.LogSourceBufferTopic;
      window.MQTTClient.send(mqtt_msg);
    }

    // increment bytecount stats
    this.iov.statsMsg.byteCount += bytearray.length;
  }

  appendVideo (moofBox) {
    silly('Appending moof data...');

    if (!moofBox) {
      console.warn('Cannot use empty moof...');
      return;
    }

    // If the buffer is busy, we'll try on the next call, and drop the frame
    if (this.sourceBuffer.updating === true) {
      debug('Dropping frame because the buffer is busy...');
      return;
    }

    try {
      debug('appending moof to sourceBuffer...');
      this.onBeforeAppendBuffer(moofBox);
      this.sourceBuffer.appendBuffer(moofBox);
    }
    catch (e) {
      // internal error, this has been observed to happen the tab
      // in the browser where this video player lives is hidden
      // then reselected. 'e' is undefined the error is bug
      // within the MSE C++ implementation in the browser.

      console.error('Excetion thrown from appendBuffer', e);
      this.reinitializeMse();
    }
  }

  stop () {
    debug('stop');

    this.moovBox = null;

    if (this.guid !== undefined) {
      this.iov.conduit.unsubscribe(`iov/video/${this.guid}/live`);
    }

    this.resetPlayState();

    this.iov.conduit.publish(
      `iov/video/${this.guid}/stop`,
      { clientId: this.iov.config.clientId }
    );
  }

  resyncStream () {
    // subscribe to a sync topic that will be called if the stream that is feeding
    // the mse service dies and has to be restarted that this player should restart the stream
    debug('Trying to resync stream...');

    this.iov.conduit.subscribe(`iov/video/${this.guid}/resync`, () => {
      debug('sync received re-initialize media source buffer');
      this.reinitializeMse();
    });
  }

  // @todo - there is much shared between this and onChangeSourceTransaction
  onIovPlayTransaction ({ mimeCodec, guid }) {
    debug('onIovPlayTransaction');

    this.assertMimeCodecSupported(mimeCodec);

    const initSegmentTopic = `${this.iov.config.clientId}/init-segment/${parseInt(Math.random() * 1000000)}`;

    this.state = 'waiting-for-first-moov';

    this.iov.conduit.subscribe(initSegmentTopic, ({ payloadBytes }) => {
      debug(`onIovPlayTransaction ${initSegmentTopic} listener fired`);
      debug(`received moov of type "${typeof payloadBytes}" from server`);

      const moov = payloadBytes;

      this.state = 'waiting-for-first-moof';

      this.iov.conduit.unsubscribe(initSegmentTopic);

      const newTopic = `iov/video/${guid}/live`;

      // subscribe to the live video topic.
      this.iov.conduit.subscribe(
        newTopic,
        (...args) => this.onMoof(...args)
      );

      this.guid = guid;
      this.moovBox = moov;
      this.mimeCodec = mimeCodec;

      document.addEventListener('visibilitychange', this.documentEventListeners.visibilitychange);

      this.trigger('firstChunk');

      // when videojs initializes the video element (or something like that),
      // it creates events and listeners on that element that it uses, however
      // these events interfere with our ability to play clsp streams.  Cloning
      // the element like this and reinserting it is a blunt instrument to remove
      // all of the videojs events so that we are in control of the player.
      var clone = this.videoElement.cloneNode();
      var parent = this.videoElement.parentNode;

      if (parent !== null) {
        parent.replaceChild(clone, this.videoElement);
        this.videoElement = clone;
      }

      // @todo - need to revisit the logic below... how does this stuff relate to
      // reinitializeMse?

      this.initializeMediaSource();

      // now assign media source extensions
      // debug("Disregard: The play() request was interrupted ... its not an error!");
      this.videoElement.src = URL.createObjectURL(this.mediaSource);

      this.resyncStream();
    });

    this.iov.conduit.publish(`iov/video/${guid}/play`, {
      initSegmentTopic,
      clientId: this.iov.config.clientId,
    });
  }

  onMoof ({ payloadBytes }) {
    silly('onMoof');

    this.state = 'playing';

    if (this.source_buffer_ready === false) {
      debug('media source not yet open - dropping frame');
      return;
    }

    this.trigger('videoReceived');

    this.appendVideo(payloadBytes);
  }

  // @todo - need a method to properly destroy source buffer
  initializeSourceBuffer () {
    debug('initializeSourceBuffer');

    // New media source opened. Add a buffer and append the moov MP4 video data.
    this.sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeCodec);
    this.sourceBuffer.mode = 'sequence';

    // this.sourceBuffer.addEventListener('updateend', this.sourceBufferEventListeners.updateend);
    this.sourceBuffer.addEventListener('error', this.sourceBufferEventListeners.error);

    // we are now able to process video
    this.source_buffer_ready = true;

    if (!this.moovBox) {
      // @todo - should this throw?
      return;
    }

    this.onBeforeAppendBuffer(this.moovBox);
    this.sourceBuffer.appendBuffer(this.moovBox);

    this.trigger('videoInfoReceived');
  }

  initializeMediaSource () {
    if (this.mediaSource) {
      this.destroyMediaSource();
    }

    // create media source buffer and start routing video traffic.
    this.mediaSource = new window.MediaSource();

    this.mediaSource.addEventListener('sourceopen', this.mediaSourceEventListeners.sourceopen);
    this.mediaSource.addEventListener('sourceended', this.mediaSourceEventListeners.sourceended);
    this.mediaSource.addEventListener('error', this.mediaSourceEventListeners.error);
  }

  destroySourceBuffer () {
    if (!this.sourceBuffer) {
      return;
    }

    this.sourceBuffer.abort();

    // this.sourceBuffer.removeEventListener('updateend', this.sourceBufferEventListeners.updateend);
    this.sourceBuffer.removeEventListener('error', this.sourceBufferEventListeners.error);

    this.sourceBuffer = null;
    this.source_buffer_ready = false;
  }

  destroyMediaSource () {
    if (!this.mediaSource) {
      return;
    }

    this.mediaSource.removeEventListener('sourceopen', this.mediaSourceEventListeners.sourceopen);
    this.mediaSource.removeEventListener('sourceended', this.mediaSourceEventListeners.sourceended);
    this.mediaSource.removeEventListener('error', this.mediaSourceEventListeners.error);

    let sourceBuffers = this.mediaSource.sourceBuffers;

    if (sourceBuffers.SourceBuffers) {
      // @see - https://developer.mozilla.org/en-US/docs/Web/API/MediaSource/sourceBuffers
      sourceBuffers = sourceBuffers.SourceBuffers();
    }

    for (let i = 0; i < sourceBuffers.length; i++) {
      this.mediaSource.removeSourceBuffer(sourceBuffers[i]);
    }

    this.mediaSource = null;
  }

  destroy () {
    this.stop();

    document.removeEventListener('visibilitychange', this.documentEventListeners.visibilitychange);

    this.iov = null;
    this.playerInstance = null;
    this.videoElement = null;
    this.events = null;
    this.vqueue = null;
    this.LogSourceBuffer = null;
    this.LogSourceBufferTopic = null;
    this.guid = null;
    this.moovBox = null;
    this.mimeCodec = null;

    this.destroySourceBuffer();
    this.destroyMediaSource();

    this.sourceBufferEventListeners = null;
    this.mediaSourceEventListeners = null;
    this.documentEventListeners = null;
  }
};
