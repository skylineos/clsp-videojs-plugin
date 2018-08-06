import Debug from 'debug';
import videojs from 'video.js';

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
  static factory (iov) {
    return new IOVPlayer(iov);
  }

  static generateIOVConfigFromCLSPURL (clspUrl) {
    debug('generateIOVConfigFromCLSPURL');

    if (!clspUrl) {
      throw new Error('No source was given to be parsed!');
    }

    // We use an anchor tag here beacuse, when an href is added to
    // an anchor dom Element, the parsing is done for you by the
    // browser.
    const parser = document.createElement('a');

    let useSSL;
    let default_port;

    // Chrome is the only browser that allows non-http protocols in
    // the anchor tag's href, so change them all to http here so we
    // get the benefits of the anchor tag's parsing
    if (clspUrl.substring(0, 5).toLowerCase() === 'clsps') {
      useSSL = true;
      parser.href = clspUrl.replace('clsps', 'https');
      default_port = 443;
    }
    else if (clspUrl.substring(0, 4).toLowerCase() === 'clsp') {
      useSSL = false;
      parser.href = clspUrl.replace('clsp', 'http');
      default_port = 9001;
    }
    else {
      throw new Error('The given source is not a clsp url, and therefore cannot be parsed.');
    }

    const paths = parser.pathname.split('/');
    const streamName = paths[paths.length - 1];

    let hostname = parser.hostname;
    let port = parser.port;

    if (port.length === 0) {
      port = default_port;
    }

    // @ is a special address meaning the server that loaded the web page.
    if (hostname === '@') {
      hostname = window.location.hostname;
    }

    return {
      port: parseInt(port),
      address: hostname,
      streamName,
      useSSL,
    };
  };

  constructor (iov) {
    debug('constructor');

    this.MAX_SEQ_PROC = 2;
    this.BUFFER_LIMIT = 15;

    this.iov = iov;

    // @todo - there must be a more proper way to do this...
    this.events = {
      firstChunk: [],
      videoReceived: [],
      videoInfoReceived: [],
    };

    // Used for determining the size of the internal buffer hidden from the MSE
    // api by recording the size and time of each chunk of video upon buffer append
    // and recording the time when the updateend event is called.
    this.LogSourceBuffer = false;
    this.LogSourceBufferTopic = null;

    this.resetPlayState();

    this.moovBox = null;

    // -1 is forever
    this.retry_count = 3;

    this.on('firstChunk', () => {

    });

    this._on_updateend = this._on_updateend.bind(this);
  }

  on (name, action) {
    debug(`Registering Listener for ${name} event...`);

    switch (name) {
      case 'firstChunk':
      case 'videoReceived':
      case 'videoInfoReceived': {
        this.events[name].push(action);
        break;
      }
      default: {
        throw new Error(`"${name}" is not a valid event."`);
      }
    }
  }

  trigger (name) {
    debug(`Triggering ${name} event...`);

    switch (name) {
      case 'firstChunk':
      case 'videoReceived':
      case 'videoInfoReceived': {
        for (let i = 0; i < this.events[name].length; i++) {
          this.events[name][i](this);
        }
        break;
      }
      default: {
        throw new Error(`"${name}" is not a valid event."`);
      }
    }
  }

  _fault (message) {
    debug('_fault');

    this.videoPlayer.errors.extend({
      PLAYER_ERR_IOV: {
        headline: 'Error Playing Stream',
        message,
      },
    });

    this.videoPlayer.error({ code: 'PLAYER_ERR_IOV' });
    this.state = 'fault';
  }

  resetPlayState () {
    debug('resetPlayState');

    this.state = 'idle';
    this.numFramesReceived = 1;
    this.numFramesProcessed = 1; // last sequence number processed
    this.source_buffer_ready = false;
  }

  isMimeCodecSupported (mimeCodec) {
    if (!window.MediaSource || !window.MediaSource.isTypeSupported(mimeCodec)) {
      // the browser does not support this video format
      this._fault(`Unsupported mime codec: ${mimeCodec}`);

      return false;
    }

    return true;
  }

  // @todo - review
  onTransportTransaction (current_iov, { mimeCodec, guid }) {
    debug('onTransportTransaction');

    if (!this.isMimeCodecSupported(mimeCodec)) {
      return;
    }

    const initSegmentTopic = `${this.iov.config.clientId}/init-segment/${parseInt(Math.random() * 1000000)}`;

    current_iov.transport.subscribe(initSegmentTopic, ({ payloadBytes }) => {
      const moov = payloadBytes;

      current_iov.transport.unsubscribe(initSegmentTopic);

      const oldTopic = `iov/video/${this.guid}/live`;
      const newTopic = `iov/video/${guid}/live`;

      current_iov.transport.subscribe(newTopic, ({ payloadBytes }) => {
        const moofBox = payloadBytes;

        // @todo - why are we adding this to the queue here? we have an "onMoof" method - can we use it?
        // If we need this to display the first frame, can we just "drop"
        // this first frame to simplify the logic?
        // this.vqueue.push(moofBox.slice(0));

        // unsubscribe to existing live
        // 1) unsubscribe to remove avoid callback
        current_iov.transport.unsubscribe(newTopic);

        // 2) unsubscribe to live callback for the old stream
        this.iov.transport.unsubscribe(oldTopic);

        // 3) resubscribe with different callback
        current_iov.transport.subscribe(newTopic, (...args) => this.onMoof(...args));

        // alter object properties to reflect new stream
        this.guid = guid;
        this.moovBox = moov;
        this.mimeCodec = mimeCodec;

        // remove media source buffer, reinitialize
        this.reinitializeMse();

        // Was the IOV updated?
        if (this.iov === current_iov) {
          return;
        }

        if (current_iov.config.parentNodeId !== null) {
          var iframe_elm = document.getElementById(this.iov.config.clientId);
          var parent = document.getElementById(current_iov.config.parentNodeId);

          if (parent) {
            parent.removeChild(iframe_elm);
          }

          // remove code from iframe.
          iframe_elm.srcdoc = '';
        }

        this.iov = current_iov;
      });
    });

    current_iov.transport.publish(`iov/video/${guid}/play`, {
      initSegmentTopic,
      clientId: current_iov.config.clientId,
    });
  }

  change (newStream, iov) {
    // @todo - is there a way to set up the changeSrc logic to never need
    // to pass its own iov?
    debug('change');

    const next_iov = iov || null;
    const current_iov = iov || this.iov;

    current_iov.transport.transaction(
      `iov/video/${window.btoa(newStream)}/request`,
      (...args) => this.onTransportTransaction(next_iov, ...args),
      { clientId: this.iov.config.clientId }
    );
  }

  reinitializeMse () {
    debug('reinitializeMse');

    this.resetPlayState();

    // free resource
    if (this.mediaSource) {
      URL.revokeObjectURL(this.mediaSource);

      // reallocate, this will call media source open which will
      // append the MOOV atom.
      this.video.src = URL.createObjectURL(this.mediaSource);
    }
  }

  restart () {
    debug('restart');

    this.stop();
    this.play();
  }

  // @todo - we should be able to make the eid and streamName passed
  // at time of instantiation rather than at time of play
  play (eid, streamName) {
    debug('play');

    if (eid) {
      this.video = document.getElementById(eid);
      this.id = eid.replace('_html5_api', '');
      this.videoPlayer = videojs.getPlayer(this.id);
    }

    if (!this.video) {
      return this._fault(`Unable to find an element in the DOM with id "${eid}".`);
    }

    this.iov.transport.transaction(
      `iov/video/${window.btoa(streamName)}/request`,
      (...args) => this.onIovPlay(...args),
      { clientId: this.iov.config.clientId }
    );
  }

  formatMoof (payloadBytes) {
    var moofBox = payloadBytes;

    moofBox[20] = (this.numFramesReceived & 0xFF000000) >> 24;
    moofBox[21] = (this.numFramesReceived & 0x00FF0000) >> 16;
    moofBox[22] = (this.numFramesReceived & 0x0000FF00) >> 8;
    moofBox[23] = this.numFramesReceived & 0xFF;

    return moofBox;
  }

  // @todo - it seems like a lot of the logic here is relative to something
  // inside of the IOV class - does the IOV instance mutate some of our properties?
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

  appendInfo () {
    debug('Appending moov info...');

    if (!this.moovBox) {
      console.warn('Cannot use empty moov...');
      return;
    }

    this.onBeforeAppendBuffer(this.moovBox);
    this.sourceBuffer.appendBuffer(this.moovBox);

    this.trigger('videoInfoReceived');
  }

  appendNextInQueue () {
    debug('Appending next moof in queue...');

    if (this.vqueue.length < 1) {
      console.warn('There is no moof in the queue!');
      return;
    }

    if (this.sourceBuffer.updating === true) {
      debug('SourceBuffer is updating, cannot append next moof, dropping it...');
      this.vqueue = this.vqueue.slice(1);
      return;
    }

    this.appendVideo(this.vqueue[0]);
  }

  /**
   *
   * @param {Object} moofBox
   *   A "moofBox" object - @see this.formatMoof
   */
  appendVideo (moofBox) {
    debug('Appending moof data...');

    if (!moofBox) {
      console.warn('Cannot use empty moof...');
      return;
    }

    // Add the moof to the queue if we're in the middle of an update
    if (this.sourceBuffer.updating === true) {
      silly('queueing moof...');
      this.vqueue.push(moofBox.slice(0));
      return;
    }

    try {
      silly('appending moof to sourceBuffer...');
      this.onBeforeAppendBuffer(moofBox);
      this.sourceBuffer.appendBuffer(moofBox);
      this.numFramesProcessed++;
    }
    catch (e) {
      // internal error, this has been observed to happen the tab
      // in the browser where this video player lives is hidden
      // then reselected. 'e' is undefined the error is bug
      // within the MSE C++ implementation in the browser.

      console.error('Excetion thrown from appendBuffer', e);
      this.videoPlayer.error({ code: 3 });
      this.reinitializeMse();
    }
  }

  truncateBuffer () {
    silly('truncateBuffer');

    if (this.sourceBuffer.buffered.length <= 0) {
      return;
    }

    const start = this.sourceBuffer.buffered.start(0);
    const end = this.sourceBuffer.buffered.end(0);
    const time_buffered = end - start;

    if (time_buffered <= 30) {
      return;
    }

    debug('About to truncate the buffer...');

    try {
      // observed this fail during a memry snapshot in chrome
      // otherwise no observed failure, so ignore exception.
      this.sourceBuffer.remove(start, start + this.BUFFER_LIMIT);
    }
    catch (e) {
      console.error('error while removing', this.videoPlayer.id(), e);
    }
  }

  stop () {
    debug('stop');

    // @todo - should this happen in resetPlayState?
    this.moovBox = null;

    // @todo - should this happen in resetPlayState?
    if (this.guid !== undefined) {
      this.iov.transport.unsubscribe(`iov/video/${this.guid}/live`);
    }

    this.resetPlayState();

    this.iov.transport.publish(
      `iov/video/${this.guid}/stop`,
      { clientId: this.iov.config.clientId }
    );
  }

  resyncStream () {
    // subscribe to a sync topic that will be called if the stream that is feeding
    // the mse service dies and has to be restarted that this player should restart the stream
    debug('Trying to resync stream...');

    this.iov.transport.subscribe(`iov/video/${this.guid}/resync`, () => {
      debug('sync received re-initialize media source buffer');
      this.reinitializeMse();
    });
  }

  initializeMediaSource () {
    // create media source buffer and start routing video traffic.
    this.mediaSource = new window.MediaSource();

    this.mediaSource.addEventListener('sourceopen', (...args) => {
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
    });

    this.mediaSource.addEventListener('sourceended', (...args) => {
      debug('onSourceEnded');

      // @todo - do we need to clear the buffer manually?
      this.stop();
      this.source_buffer_ready = false;
    });

    this.mediaSource.addEventListener('error', (e) => {
      console.error('MSE error');
      console.error(e);
    });
  }

  onIovPlay ({ mimeCodec, guid }) {
    debug('onIovPlay');

    if (!this.isMimeCodecSupported(mimeCodec)) {
      return;
    }

    this.mimeCodec = mimeCodec;
    this.guid = guid;

    const initSegmentTopic = `${this.iov.config.clientId}/init-segment/${parseInt(Math.random() * 1000000)}`;

    this.vqueue = []; // used if the media source buffer is busy

    this.state = 'waiting-for-moov';

    // @todo - this is at least paritally duplicated in onTransportTransaction
    this.iov.transport.subscribe(initSegmentTopic, ({ payloadBytes }) => {
      debug(`this.iov.transport.subscribe ${initSegmentTopic} listener fired`);
      debug(`received moov of type "${typeof payloadBytes}" from server`);

      // capture the initial segment
      this.moovBox = payloadBytes;
      this.state = 'waiting-for-moof';

      // unsubscribe to this group
      this.iov.transport.unsubscribe(initSegmentTopic);

      // subscribe to the live video topic.
      this.state = 'playing';
      this.iov.transport.subscribe(
        `iov/video/${this.guid}/live`,
        (...args) => this.onMoof(...args)
      );

      this.trigger('firstChunk');

      // when videojs initializes the video element (or something like that),
      // it creates events and listeners on that element that it uses, however
      // these events interfere with our ability to play clsp streams.  Cloning
      // the element like this and reinserting it is a blunt instrument to remove
      // all of the videojs events so that we are in control of the player.
      var clone = this.video.cloneNode();
      var parent = this.video.parentNode;

      if (parent !== null) {
        parent.replaceChild(clone, this.video);
        this.video = clone;
      }

      this.videoPlayer.on('changesrc', (event, { url }) => {
        debug(`iov-change-src on id ${this.videoPlayer.id()}`);

        if (!url) {
          throw new Error('Unable to process change event because there is no url!');
        }

        // parse url, extract the ip of the sfs and the port as well as useSSL
        const new_cfg = IOVPlayer.generateIOVConfigFromCLSPURL(url);

        if (new_cfg.address === this.iov.config.wsbroker) {
          this.change(new_cfg.streamName);
          return;
        }

        new_cfg.initialize = false;
        new_cfg.videoElement = this.iov.config.videoElement;
        new_cfg.appStart = (iov) => {
          // conected to new mqtt
          this.change(new_cfg.streamName, iov);
        };

        // @todo - so here, we clone the iov instance - is it possible to handle
        // the "clean up" of the old iov instance here, so that in all subsequent
        // logic we can use ONLY the new iov instance?  That would eliminate some
        // conditions based on the iov instance in other places.
        this.iov.clone(new_cfg);
      });

      // @todo - need to revisit the logic below...

      this.initializeMediaSource();

      // now assign media source extensions
      // debug("Disregard: The play() request was interrupted ... its not an error!");
      this.video.src = URL.createObjectURL(this.mediaSource);

      this.resyncStream();
    });

    this.iov.transport.publish(`iov/video/${this.guid}/play`, {
      initSegmentTopic,
      clientId: this.iov.config.clientId,
    });
  }

  onMoof ({ payloadBytes }) {
    silly('onMoof');

    if (this.source_buffer_ready === false) {
      debug('media source not yet open - dropping frame');
      return;
    }

    if (this.numFramesReceived !== this.numFramesProcessed) {
      debug(`The frame count is falling behind: processed ${this.numFramesProcessed} out of ${this.numFramesReceived} received.`);
    }

    this.numFramesReceived++;
    silly(this.numFramesReceived);

    this.trigger('videoReceived');

    // Enqueues or sends to the media source buffer an MP4 moof atom. This contains a
    // chunk of video/audio tracks.

    // pace control. Allow a maximum of MAX_SEQ_PROC MOOF boxes to be held within
    // the source buffer.  In other words, drop frames when we aren't processing
    // the video fast enough.
    if ((this.numFramesReceived - this.numFramesProcessed) > this.MAX_SEQ_PROC) {
      debug('Dropping frame...');
      return;
    }

    this.appendVideo(this.formatMoof(payloadBytes));
  }

  // @todo - need a method to properly destroy source buffer
  initializeSourceBuffer () {
    debug('initializeSourceBuffer');

    // New media source opened. Add a buffer and append the moov MP4 video data.

    // add buffer
    this.sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeCodec);
    this.sourceBuffer.mode = 'sequence';

    this.sourceBuffer.addEventListener('updateend', this._on_updateend);

    this.sourceBuffer.addEventListener('error', function (e) {
      console.error('MSE sourceBffer error');
      console.error(e);
    });

    // we are now able to process video
    this.source_buffer_ready = true;

    this.appendInfo();
  }

  _on_updateend (...args) {
    console.log(args)
    silly('_on_updateend');

    if (this.video.paused === true) {
      debug('Video is paused!');

      try {
        const promise = this.video.play();

        if (promise) {
          // Handle promise errors
          promise.catch((error) => {
            console.error('Couldn\'t play the paused stream...', error);
          });
        }
      }
      catch (error) {
        console.error('Couldn\'t play the paused stream...', error);
      }

      return;
    }

    if (this.mediaSource.readyState === 'open') {
      this.appendNextInQueue();
      this.truncateBuffer();
    }
  }
};
