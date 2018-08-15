import Debug from 'debug';
import videojs from 'video.js';

import MSEWrapper from './MSEWrapper';

const DEBUG_PREFIX = 'skyline:clsp:iov';
const debug = Debug(`${DEBUG_PREFIX}:IOVPlayer`);
const silly = Debug(`silly:${DEBUG_PREFIX}:IOVPlayer`);

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

    // Used for determining the size of the internal buffer hidden from the MSE
    // api by recording the size and time of each chunk of video upon buffer append
    // and recording the time when the updateend event is called.
    this.LogSourceBuffer = false;
    this.LogSourceBufferTopic = null;

    this.state = 'idle';

    this.moovBox = null;

    this.accumulatedErrors = {};

    // @todo - there must be a more proper way to do events than this...
    this.events = {};

    this.EVENT_NAMES = [
      'metric',
    ];

    this.timeVideoCurrentTimeShifted = 0;

    for (let i = 0; i < this.EVENT_NAMES.length; i++) {
      this.events[this.EVENT_NAMES[i]] = [];
    }

    this.METRIC_TYPES = [
      'sourceBuffer.bufferTimeEnd',
      'video.currentTime',
      'video.drift',
      'video.driftCorrection',
    ];

    this.metrics = {};

    this.mseWrapper = null;
  }

  on (name, action) {
    debug(`Registering Listener for ${name} event...`);

    if (!this.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    this.events[name].push(action);
  }

  trigger (name, value) {
    debug(`Triggering ${name} event...`);

    if (!this.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    for (let i = 0; i < this.events[name].length; i++) {
      this.events[name][i](value, this);
    }
  }

  metric (type, value) {
    // if (!this.options.enableMetrics) {
    //   return;
    // }

    if (!this.METRIC_TYPES.includes(type)) {
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

  isMimeCodecSupported (mimeCodec) {
    if (MSEWrapper.isMimeCodecSupported(mimeCodec)) {
      return true;
    }

    // the browser does not support this video format
    this.displayVideoJsError(`Unsupported mime codec: ${mimeCodec}`);

    return false;
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

        // unsubscribe to existing live
        // 1) unsubscribe to remove avoid callback
        transport.unsubscribe(newTopic);

        // 2) unsubscribe to live callback for the old stream
        this.iov.transport.unsubscribe(oldTopic);

        // 3) resubscribe with different callback
        transport.subscribe(newTopic, (mqtt_msg) => {
          this.mseWrapper.append(mqtt_msg.payloadBytes);
        });

        // alter object properties to reflect new stream
        this.guid = new_guid;
        this.moovBox = moov;
        this.mimeCodec = new_mimeCodec;

        // remove media source buffer, reinitialize
        this.reinitializeMseWrapper(this.mimeCodec);

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

  _onError (type, message, error) {
    if (!this.accumulatedErrors[type]) {
      this.accumulatedErrors[type] = 0;
    }

    this.accumulatedErrors[type]++;

    console.error(message);
    console.error(error);
  }

  displayVideoJsError (message) {
    debug('displayVideoJsError');

    this.videoPlayer.errors.extend({
      PLAYER_ERR_IOV: {
        headline: 'Error Playing Stream',
        message,
      },
    });

    this.videoPlayer.error({ code: 'PLAYER_ERR_IOV' });
    this.state = 'fault';
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
      throw new Error("Unable to match id '" + eid + "'");
    }

    const request = { clientId: this.iov.config.clientId };
    const topic = `iov/video/${window.btoa(this.streamName)}/request`;

    this.iov.transport.transaction(topic, (...args) => this._start_play(...args), request);
  }

  resume (onFirstChunk, onVideoRecv) {
    debug('resume');

    this.onFirstChunk = onFirstChunk;
    this.onVideoRecv = onVideoRecv;

    var request = { clientId: this.iov.config.clientId };
    var topic = "iov/video/" + window.btoa(this.streamName) + "/request";
    this.iov.transport.transaction(topic, (...args) => this._start_play(...args), request);
  }

  reinitializeMseWrapper (mimeCodec) {
    if (this.mseWrapper) {
      this.mseWrapper.destroy();
    }

    this.mseWrapper = MSEWrapper.factory();

    this.mseWrapper.on('metric', ({ type, value }) => {
      this.trigger('metric', { type, value });
    });

    this.mseWrapper.initializeMediaSource({
      onSourceOpen: () => {
        debug('on mediaSource sourceopen');

        this.mseWrapper.initializeSourceBuffer(mimeCodec, {
          onAppendStart: (byteArray) => {
            silly('On Append Start...');

            if ((this.LogSourceBuffer === true) && (this.LogSourceBufferTopic !== null)) {
              debug(`Recording ${parseInt(byteArray.length)} bytes of data.`);

              const mqtt_msg = new window.Paho.MQTT.Message(byteArray);
              mqtt_msg.destinationName = this.LogSourceBufferTopic;
              window.MQTTClient.send(mqtt_msg);
            }

            this.onVideoRecv();

            this.iov.statsMsg.byteCount += byteArray.length;
          },
          onAppendFinish: (info) => {
            silly('On Append Finish...');

            this.drift = info.bufferTimeEnd - this.video.currentTime;

            this.metric('sourceBuffer.bufferTimeEnd', info.bufferTimeEnd);
            this.metric('video.currentTime', this.video.currentTime);
            this.metric('video.drift', this.drift);

            if (this.drift > 3) {
              this.metric('video.driftCorrection', 1);
              this.video.currentTime = info.bufferTimeEnd;
              // return this.reinitializeMse();
            }

            if (this.video.paused === true) {
              debug('Video is paused!');

              try {
                const promise = this.video.play();

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

            // wait around for 3 seconds to simulate unpredictable browser interruptions.
            var now = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
              var diff = new Date().getTime() - now;
              if (diff > 1000) {
                debug("breaking out of 1 second sleep");
                break;
              }
            }
          },
          onAppendError: (error) => {
            // internal error, this has been observed to happen the tab
            // in the browser where this video player lives is hidden
            // then reselected. 'ex' is undefined the error is bug
            // within the MSE C++ implementation in the browser.
            this._onError(
              'sourceBuffer.append',
              'Error while appending to sourceBuffer',
              error
            );

            // @todo - now that we are reinitializing the mseWrapper,
            // do we need this videojs error?
            // this.videoPlayer.error({ code: 3 });
            this.reinitializeMseWrapper(mimeCodec);
          },
          onAbortError: (error) => {
            this._onError(
              'sourceBuffer.abort',
              'Error while aborting sourceBuffer operation',
              error
            );

            // @todo - now that we are reinitializing the mseWrapper,
            // do we need this videojs error?
            // this.videoPlayer.error({ code: 3 });
            this.reinitializeMseWrapper(mimeCodec);
          },
          onRemoveError: (error) => {
            // observed this fail during a memry snapshot in chrome
            // otherwise no observed failure, so ignore exception.
            this._onError(
              'sourceBuffer.remove',
              'Error while removing segments from sourceBuffer',
              error
            );
          },
          onStreamFrozen: () => {
            debug('stream appears to be frozen - reinitializing...');

            this.reinitializeMseWrapper(mimeCodec);
          },
          onError: (error) => {
            this._onError(
              'mediaSource.sourceBuffer.generic',
              'mediaSource sourceBuffer error',
              error
            );
          },
        });

        this.mseWrapper.append(this.moovBox);
      },
      onSourceEnded: () => {
        debug('on mediaSource sourceended');

        // @todo - do we need to clear the buffer manually?
        this.stop();
      },
      onError: (error) => {
        this._onError(
          'mediaSource.generic',
          'mediaSource error',
          error
        );
      },
    });

    if (this.mseWrapper.mediaSource && this.video) {
      this.video.src = this.mseWrapper.reinitializeVideoElementSrc();
    }
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
    self.moovBox = null;

    var request = { clientId: self.iov.config.clientId };
    self.iov.transport.publish("iov/video/" + self.guid + "/stop", request);
  }

  _start_play ({ mimeCodec, guid }) {
    debug('_start_play');

    if (!this.isMimeCodecSupported(mimeCodec)) {
      return;
    }

    this.mimeCodec = mimeCodec;
    this.guid = guid;

    const initSegmentTopic = `${this.iov.config.clientId}/init-segment/${parseInt(Math.random() * 1000000)}`;

    const self = this;

    self.state = 'waiting-for-moov';

    self.iov.transport.subscribe(initSegmentTopic, (mqtt_msg) => {
      // capture the initial segment
      self.moovBox = mqtt_msg.payloadBytes;
      // debug(typeof mqtt_msg.payloadBytes);
      // debug("received moov from server");

      self.state = "waiting-for-moof";
      // unsubscribe to this group
      self.iov.transport.unsubscribe(initSegmentTopic);

      // subscribe to the live video topic.
      self.state = "playing";
      self.iov.transport.subscribe("iov/video/" + self.guid + "/live", (mqtt_msg) => {
        this.mseWrapper.append(mqtt_msg.payloadBytes);
      });
      // create media source buffer and start routing video traffic.

      self.onFirstChunk(); // first chunk of video received.

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

      this.reinitializeMseWrapper(mimeCodec);

      // subscribe to a sync topic that will be called if the stream that is feeding
      // the mse service dies and has to be restarted that this player should restart the stream
      var resync_topic = "iov/video/" + self.guid + "/resync";
      debug("Call " + resync_topic + " to resync stream");
      self.iov.transport.subscribe(resync_topic,
        function (mqtt_msg) {
          debug("sync received re-initialize media source buffer");
          self.reinitializeMseWrapper(mimeCodec);
        }
      );
    });

    const play_request_topic = `iov/video/${this.guid}/play`;

    this.iov.transport.publish(play_request_topic, {
      initSegmentTopic,
      clientId: this.iov.config.clientId,
    });
  }
};
