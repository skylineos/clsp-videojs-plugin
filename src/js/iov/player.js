import Debug from 'debug';
import videojs from 'video.js';
import debounce from 'lodash/debounce';

const DEBUG_PREFIX = 'skyline:clsp:iov';
const debug = Debug(`${DEBUG_PREFIX}:IOVPlayer`);
const silly = Debug(`silly:${DEBUG_PREFIX}:IOVPlayer`);

const DEBOUNCE_INTERVAL_SAMPLE_SIZE = 10;

/**
 * Responsible for receiving stream input and routing it to the media source
 * buffer for rendering on the video tag. There is some 'light' reworking of
 * the binary data that is required.
 *
 * var player = IOVPlayer.factory(iov);
 * player.play( video_element_id, stream_name );
*/
export default class IOVPlayer {
  static factory (iov) {
    return new IOVPlayer(iov);
  }

  static generateIOVConfigFromCLSPURL (_src) {
    debug('generateIOVConfigFromCLSPURL');

    if (!_src) {
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
    if (_src.substring(0, 5).toLowerCase() === 'clsps') {
      useSSL = true;
      parser.href = _src.replace('clsps', 'https');
      default_port = 443;
    }
    else if (_src.substring(0, 4).toLowerCase() === 'clsp') {
      useSSL = false;
      parser.href = _src.replace('clsp', 'http');
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

    this.iov = iov;

    this.MAX_SEQ_PROC = 2;

    // Used for determining the size of the internal buffer hidden from the MSE
    // api by recording the size and time of each chunk of video upon buffer append
    // and recording the time when the updateend event is called.
    this.LogSourceBuffer = false;
    this.LogSourceBufferTopic = null;

    this.resetPlayState();

    this.moovBox = null;
    this.moofBox = null;

    this.lastAppendAttemptTime = null;
    this.appendInterval = null;
    this.moofSplits = [];

    this.timeBuffered = 0;

    // We determined that these debounce settings are "good enough"
    // for the append interval debounce.
    this.appendIntervalTolerance = 0.5;
    this.appendIntervalSettings = {
      leading: true,
      trailing: false,
    };

    this.appendBuffer = (moofBox) => this._appendBuffer(moofBox);
    this.vqueue = []; // used if the media source buffer is busy

    // -1 is forever
    this.retry_count = 3;

    this._start_play = this._start_play.bind(this);
    this._on_sourceopen = this._on_sourceopen.bind(this);
    this._on_sourceended = this._on_sourceended.bind(this);
    this._on_moof = this._on_moof.bind(this);
    this._on_updateend = this._on_updateend.bind(this);
    this.onTransportTransaction = this.onTransportTransaction.bind(this);
  }

  resetPlayState () {
    this.state = 'idle';
    this.seqnum = 1;
    this.seqnumProcessed = 1; // last sequence number processed
    this.source_buffer_ready = false;
    this.dropCounter = 0;
  }

  isMimeCodecSupported (mimeCodec) {
    if (!window.MediaSource || !window.MediaSource.isTypeSupported(mimeCodec)) {
      // the browser does not support this video format
      this._fault(`Unsupported mime codec: ${mimeCodec}`);

      return false;
    }

    return true;
  }

  onTransportTransaction (iov, response) {
    const new_mimeCodec = response.mimeCodec;
    const new_guid = response.guid; // stream guid

    if (!this.isMimeCodecSupported(new_mimeCodec)) {
      return;
    }

    const initSegmentTopic = `${this.iov.config.clientId}/init-segment/${parseInt(Math.random() * 1000000)}`;

    const transport = (iov === null)
      ? this.iov.transport
      : iov.transport;

    transport.subscribe(initSegmentTopic, (mqtt_msg) => {
      const moov = mqtt_msg.payloadBytes; // store new MOOV atom.

      transport.unsubscribe(initSegmentTopic);

      const oldTopic = `iov/video/${this.guid}/live`;
      const newTopic = `iov/video/${new_guid}/live`;

      transport.subscribe(newTopic, (moof_mqtt_msg) => {
        const moofBox = moof_mqtt_msg.payloadBytes;

        // this.vqueue.push(moofBox.slice(0));

        // unsubscribe to existing live
        // 1) unsubscribe to remove avoid callback
        transport.unsubscribe(newTopic);

        // 2) unsubscribe to live callback for the old stream
        this.iov.transport.unsubscribe(oldTopic);

        // 3) resubscribe with different callback
        transport.subscribe(newTopic, this._on_moof);

        // alter object properties to reflect new stream
        this.guid = new_guid;
        this.moovBox = moov;
        this.mimeCodec = new_mimeCodec;

        // remove media source buffer, reinitialize
        this.reinitializeMse();

        if (!iov) {
          return;
        }

        if (iov.config.parentNodeId !== null) {
          var iframe_elm = document.getElementById(this.iov.config.clientId);
          var parent = document.getElementById(iov.config.parentNodeId);

          if (parent) {
            parent.removeChild(iframe_elm);
          }

          // remove code from iframe.
          iframe_elm.srcdoc = '';
        }

        // replace iov variable with the new one created.
        this.iov = iov;
      });
    });

    const play_request_topic = `iov/video/${new_guid}/play`;

    transport.publish(play_request_topic, {
      initSegmentTopic,
      clientId: (iov === null)
        ? this.iov.config.clientId
        : iov.config.clientId,
    });
  }

  change (newStream, iov) {
    debug('change');

    const request = { clientId: this.iov.config.clientId };
    const topic = `iov/video/${window.btoa(newStream)}/request`;

    if (iov) {
      iov.transport.transaction(topic, (...args) => this.onTransportTransaction(iov, ...args), request);
      return;
    }

    this.iov.transport.transaction(topic, (...args) => this.onTransportTransaction(iov, ...args), request);
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
    this.play(this.eid, this.streamName, this.onFirstChunk, this.onVideoRecv);
  }

  play (eid, streamName, onFirstChunk, onVideoRecv) {
    debug('play');

    this.video = document.getElementById(eid);

    this.eid = eid;
    this.id = eid.replace('_html5_api', '');
    this.streamName = streamName;
    this.onFirstChunk = onFirstChunk;
    this.onVideoRecv = onVideoRecv;
    this.videoPlayer = videojs.getPlayer(this.id);

    if (typeof this.video === 'undefined') {
      this._fault("Unable to match id '" + eid + "'");
      return;
    }

    const request = { clientId: this.iov.config.clientId };
    const topic = `iov/video/${window.btoa(this.streamName)}/request`;

    this.iov.transport.transaction(topic, this._start_play, request);
  }

  resume (onFirstChunk, onVideoRecv) {
    debug('resume');

    const self = this;

    self.onFirstChunk = onFirstChunk;
    self.onVideoRecv = onVideoRecv;

    var request = { clientId: self.iov.config.clientId };
    var topic = "iov/video/" + window.btoa(self.streamName) + "/request";
    self.iov.transport.transaction(topic, self._start_play, request);
  }

  _appendBuffer_event (bytearray) {
    silly('_appendBuffer_event');

    const self = this;

    if ((self.LogSourceBuffer === true) &&
      (self.LogSourceBufferTopic !== null)) {
      //debug("recording "+parseInt(bytearray.length)+" bytes of data");
      var mqtt_msg = new Paho.MQTT.Message(bytearray);
      mqtt_msg.destinationName = self.LogSourceBufferTopic;
      MQTTClient.send(mqtt_msg);
    }

    self.onVideoRecv();

    // increment bytecount stats
    self.iov.statsMsg.byteCount += bytearray.length;
  }

  stop () {
    debug('stop');

    const self = this;

    // stop streaming live video
    if (typeof self.guid !== 'undefined') {
      self.iov.transport.unsubscribe("iov/video/" + self.guid + "/live");
    }

    self.state = "idle";

    // free resources associated with player
    self.seqnum = 1;
    self.moovBox = null;
    self.moofBox = null;

    var request = { clientId: self.iov.config.clientId };
    self.iov.transport.publish("iov/video/" + self.guid + "/stop", request);
  }

  _start_play (resp) {
    debug('_start_play');

    const self = this;

    self.mimeCodec = resp.mimeCodec;
    self.guid = resp.guid; // stream guid

    if ('MediaSource' in window && MediaSource.isTypeSupported(self.mimeCodec)) {
      var initseg_topic = self.iov.config.clientId + "/init-segment/" +
        parseInt(Math.random() * 1000000);

      self._async_play_loop(resp, initseg_topic);
      var play_request_topic = "iov/video/" + self.guid + "/play";
      self.iov.transport.publish(play_request_topic, {
        initSegmentTopic: initseg_topic,
        clientId: self.iov.config.clientId
      });
    } else {
      // the browser does not support this video format
      self._fault("Unsupported mime codec " + self.mimeCodec);
    }
  }

  _async_play_loop (resp, initSegmentTopic) {
    debug('_async_play_loop');

    const self = this;

    // setup handlers for video

    self.state = "waiting-for-moov";

    self.iov.transport.subscribe(initSegmentTopic, function (mqtt_msg) {

      // capture the initial segment
      self.moovBox = mqtt_msg.payloadBytes;
      //debug(typeof mqtt_msg.payloadBytes);
      //debug("received moov from server");


      self.state = "waiting-for-moof";
      // unsubscribe to this group
      self.iov.transport.unsubscribe(initSegmentTopic);

      // subscribe to the live video topic.
      self.state = "playing";
      self.iov.transport.subscribe("iov/video/" + self.guid + "/live", self._on_moof);
      // create media source buffer and start routing video traffic.


      self.onFirstChunk(); // first chunk of video received.

      self.mediaSource = new MediaSource();

      // when videojs initializes the video element (or something like that),
      // it creates events and listeners on that element that it uses, however
      // these events interfere with our ability to play clsp streams.  Cloning
      // the element like this and reinserting it is a blunt instrument to remove
      // all of the videojs events so that we are in control of the player.
      var clone = self.video.cloneNode();
      var parent = self.video.parentNode;

      if (parent !== null) {
        parent.replaceChild(clone, self.video);
        self.video = clone;
      }

      self.videoPlayer.on('changesrc', function (event, { eid, url }) {
        debug(`iov-change-src on id ${self.videoPlayer.id()}`);

        if (!url) {
          throw new Error('Unable to process change event because there is no url!');
        }

        // parse url, extract the ip of the sfs and the port as well as useSSL
        const new_cfg = IOVPlayer.generateIOVConfigFromCLSPURL(url);

        if (new_cfg.address === self.iov.config.wsbroker) {
          self.change(new_cfg.streamName, null);
          return;
        }

        new_cfg.initialize = false;
        new_cfg.videoElement = self.iov.config.videoElement;
        new_cfg.appStart = (iov) => {
          // conected to new mqtt
          self.change(new_cfg.streamName, iov);
        };

        self.iov.clone(new_cfg);
      });

      self.mediaSource.addEventListener('sourceopen', self._on_sourceopen);
      self.mediaSource.addEventListener('sourceended', self._on_sourceended);
      self.mediaSource.addEventListener('error', function (e) {
        console.error("MSE error");
        console.error(e);
      });

      // now assign media source extensions
      //debug("Disregard: The play() request was interrupted ... its not an error!");
      self.video.src = URL.createObjectURL(self.mediaSource);

      // subscribe to a sync topic that will be called if the stream that is feeding
      // the mse service dies and has to be restarted that this player should restart the stream
      var resync_topic = "iov/video/" + self.guid + "/resync";
      debug("Call " + resync_topic + " to resync stream");
      self.iov.transport.subscribe(resync_topic,
        function (mqtt_msg) {
          debug("sync received re-initialize media source buffer");
          self.reinitializeMse();
        }
      );

    });
  }

  _appendBuffer (moofBox) {
    if (self.source_buffer_ready == false) {
      debug("media source not yet open dropping frame");
      //this.vqueue.push(moofBox);
      return;
    }
    if (this.sourceBuffer.updating !== false) {
      if (document.visibilityState !== 'hidden')
      {
         debug("Pushing fragment onto the vqueue because source buffer was busy");
         this.vqueue.push(moofBox);
         debug("Vqueue has " + this.vqueue.length + " elements");
      }
      return;
    }

    try {
      // debug(typeof moofBox);
      // debug("calling append buffer");
      if (this.vqueue.length == 0)
      {
         //debug("appending directly to the source buffer");
         this._appendBuffer_event(moofBox);
         this.sourceBuffer.appendBuffer(moofBox);
         this.seqnum += 1; // increment sequence number for next chunk
      }
      else
      {
         debug("appending queue contents to the source buffer");
         this._appendBuffer_event(this.vqueue[0]);
         this.sourceBuffer.appendBuffer(this.vqueue[0]);
         this.seqnum += 1; // increment sequence number for next chunk
         this.vqueue.shift();
         //drop the current moof.  Vqueue size indicates we fell behind.  Fogetaboutit!
         debug("dropped current moof box.  Choppy video or drift, you decide.");
         //this.vqueue.push(moofBox);
      }
      // console.log('Actually appended moof at ' + Date.now())
    }
    catch (e) {
      console.error("Excetion thrown from appendBuffer", e);
      this.videoPlayer.error({ code: 3 });
      this.reinitializeMse();
    }
  }

  _on_moof (mqtt_msg) {
    silly('_on_moof');

    const self = this;


    /**
        Enqueues or sends to the media source buffer an MP4 moof atom. This contains a
        chunk of video/audio tracks.
      */
    // pace control. Allow a maximum of MAX_SEQ_PROC MOOF boxes to be held within
    // the source buffer.
    if ((self.seqnum - self.seqnumProcessed) > self.MAX_SEQ_PROC) {
      debug("DROPPING FRAME DRIFT TOO HIGH, dropCounter = " + parseInt(self.dropCounter));
      return; // DROP this frame since the borwser is falling
    }

    var moofBox = mqtt_msg.payloadBytes;
    moofBox[20] = (self.seqnum & 0xFF000000) >> 24;
    moofBox[21] = (self.seqnum & 0x00FF0000) >> 16;
    moofBox[22] = (self.seqnum & 0x0000FF00) >> 8;
    moofBox[23] = self.seqnum & 0xFF;

    /*
    if (!this.appendInterval && this.moofSplits.length < DEBOUNCE_INTERVAL_SAMPLE_SIZE) {
      const currentAppendTime = Date.now();
      const moofSplit = this.lastAppendAttemptTime
        ? currentAppendTime - this.lastAppendAttemptTime
        : 0;

      this.lastAppendAttemptTime = currentAppendTime;

      if (moofSplit) {
        this.moofSplits.push(moofSplit);
      }

      if (this.moofSplits.length === DEBOUNCE_INTERVAL_SAMPLE_SIZE) {
        let moofSplitSum = 0;

        for (let i = 0; i < this.moofSplits.length; i++) {
          moofSplitSum += this.moofSplits[i];
        }

        const moofSplitAverage = moofSplitSum / DEBOUNCE_INTERVAL_SAMPLE_SIZE;

        this.appendInterval = Math.round(moofSplitAverage * this.appendIntervalTolerance);
        this.moofSplits = null;

        debug('set append debounce interval', this.appendInterval)

        this.appendBuffer = debounce((moofBox) => {
          this._appendBuffer(moofBox);
        }, this.appendInterval, this.appendIntervalSettings);
      }
    }*/

    // console.log('tried to append at ' + this.lastAppendAttemptTime, );
    this.appendBuffer(moofBox);
  }

  // found when stress testing many videos, it is possible for the
  // media source ready state not to be open even though
  // source open callback is being called.
  _on_sourceopen () {
    debug('_on_sourceopen');

    const self = this;

    if (self.mediaSource.readyState === "open") {
      self._do_on_sourceopen();
      return;
    }

    var t = setInterval(function () {
      if (self.mediaSource.readyState === "open") {
        self._do_on_sourceopen();
        clearInterval(t);
      }
    }, 1000);
  }

  _do_on_sourceopen () {
    debug('_do_on_sourceopen');

    const self = this;

    /** New media source opened. Add a buffer and append the moov MP4 video data.
    */

    // add buffer
    self.sourceBuffer = self.mediaSource.addSourceBuffer(self.mimeCodec);
    self.sourceBuffer.mode = 'sequence';
    self.sourceBuffer.addEventListener('updateend', self._on_updateend);

    self.sourceBuffer.addEventListener('error', function (e) {
      console.error("MSE sourceBffer error");
      console.error(e);
    });

    // we are now able to process video
    self.source_buffer_ready = true;

    self._appendBuffer_event(self.moovBox);
    self.sourceBuffer.appendBuffer(self.moovBox);
  }

  _on_sourceended () {
    debug('_on_sourceended');

    const self = this;

    // @todo - do we need to clear the buffer manually?
    self.stop();
    self.source_buffer_ready = false;
  }

  _on_updateend () {
    silly('_on_updateend');

    const self = this;

    // identify what seqnum of the MOOF message has actually been processed.
    self.seqnumProcessed += 1;

    if (self.video.paused === true) {
      try {
        // console.log("video paused calling video.play()", self.videoPlayer.id());
        var promise = self.video.play();
        // console.log("video.play() called", self.videoPlayer.id());
        if (typeof promise !== 'undefined') {
          promise.then(function (_) { }).catch(function (e) { });
        }
      } catch (ex) {
        console.error("Exception while trying to play:" + ex.message);
      }
      //debug("setting video player from paused to play");
    }

    /*
    var logmsg =
        "_on_updateend: " +
        ((self.video.paused) ? " video is paused,": "video is playing,")   +
        " ready state = '" + self.mediaSource.readyState + "', " +
        " video queue size = " + parseInt(self.vqueue.length)
    ;
    debug(logmsg);
    */
    if (self.mediaSource.readyState === "open") {
      if (self.sourceBuffer.buffered.length > 0) {
        var start = self.sourceBuffer.buffered.start(0);
        var end = self.sourceBuffer.buffered.end(0);
        var time_buffered = end - start;
        var limit = 15;

        //callback reached as the result of remove
        if (this.timeBuffered > time_buffered)
        {
          debug("Remove event. Buffer size: " + time_buffered);
          this.timeBuffered = time_buffered;
          //wait around for 3 seconds to simulate unpredictable browser interruptions.
          var now = new Date().getTime();
          for (var i = 0; i < 1e7; i++)
          {
            var diff = new Date().getTime() - now;
            if (diff > 1000)
            {
              debug("breaking out of 1 second sleep");
              break;
            }
          }
          return;
        }
        //callbackreached as the result of an add
        else
        {
          //data exists on the queue because it couldn't be added directly.  process now.. maybe drop some
          //in order to catch up
          //debug("Add event. Buffer size: " + time_buffered);
          if (this.vqueue.length > 0)
            debug("vqueue length: " + self.vqueue.length);
          if (self.vqueue.length > 0) {

            setTimeout(function () {
            // deqeue next prepared moof atom
            if (self.sourceBuffer.updating === false) {
              try {
                self._appendBuffer_event(self.vqueue[0]);
                self.sourceBuffer.appendBuffer(self.vqueue[0]);
                self.seqnum++;
              } catch (ex) {
                // internal error, this has been observed to happen the tab
                // in the browser where this video player lives is hidden
                // then reselected. 'ex' is undefined the error is bug
                // within the MSE C++ implementation in the browser.
                self.reinitializeMse();
              }
            }
            // regardless we must proceed to the frame.
            self.vqueue = self.vqueue.slice(1);
           }, 0);
         }
        }
        this.timeBuffered = time_buffered;

        //over 30 seconds of video, so chop off 15
        if (time_buffered > 30.0) {
          try {
            // observed this fail during a memry snapshot in chrome
            // otherwise no observed failure, so ignore exception.
            self.sourceBuffer.remove(start, start + limit);
          } catch (e) {
            console.log('error while removing', self.videoPlayer.id())
            console.error(e)
          }
        }
      }
    }
    else
    {
      debug("buffer wasn't in ready state on end");
    }
  }
};
