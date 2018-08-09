'use strict';

import Debug from 'debug';
import defaults from 'lodash/defaults';
import noop from 'lodash/noop';

const DEBUG_PREFIX = 'skyline:clsp:iov';

const debug = Debug(`${DEBUG_PREFIX}:MSEWrapper`);
const silly = Debug(`silly:${DEBUG_PREFIX}:MSEWrapper`);

export default class MSEWrapper {
  static isMimeCodecSupported (mimeCodec) {
    return (window.MediaSource && window.MediaSource.isTypeSupported(mimeCodec));
  }

  static factory (options = {}) {
    return new MSEWrapper(options);
  }

  constructor (options = {}) {
    debug('Constructing...');

    this.options = defaults({}, options, {
      bufferSizeLimit: 30,
      bufferTruncateFactor: 2,
    });

    this.segmentQueue = [];

    this.mediaSource = null;
    this.sourceBuffer = null;
    this.objectURL = null;
    this.timeBuffered = null;

    this.options.bufferTruncateValue = parseInt(this.options.bufferSizeLimit / this.options.bufferTruncateFactor);
  }

  initializeMediaSource (options = {}) {
    debug('Initializing mediaSource...');

    options = defaults({}, options, {
      onSourceOpen: noop,
      onSourceEnded: noop,
      onError: noop,
    });

    // Kill the existing media source
    this.destroyMediaSource();

    this.mediaSource = new window.MediaSource();

    this.mediaSource.addEventListener('sourceopen', options.onSourceOpen);
    this.mediaSource.addEventListener('sourceended', options.onSourceEnded);
    this.mediaSource.addEventListener('error', options.onError);
  }

  destroyMediaSource () {
    debug('Destroying mediaSource...');

    if (!this.mediaSource) {
      return;
    }
  }

  getVideoElementSrc () {
    debug('getVideoElementSrc...');

    if (!this.mediaSource) {
      // @todo - should this throw?
      return;
    }

    // @todo - should multiple calls to this method with the same mediaSource
    // result in multiple objectURLs being created?  The docs for this say that
    // it creates something on the document, which lives until revokeObjectURL
    // is called on it.  Does that mean we should only ever have one per
    // this.mediaSource?  It seems like it, but I do not know.  Having only one
    // seems more predictable, and more memory efficient.

    // Ensure only a single objectURL exists at one time
    if (!this.objectURL) {
      this.objectURL = window.URL.createObjectURL(this.mediaSource);
    }

    return this.objectURL;
  }

  destroyVideoElementSrc () {
    debug('destroyVideoElementSrc...');

    if (!this.mediaSource) {
      // @todo - should this throw?
      return;
    }

    if (!this.objectURL) {
      // @todo - should this throw?
      return;
    }

    return window.URL.revokeObjectURL(this.mediaSource);
  }

  isMediaSourceReady () {
    // found when stress testing many videos, it is possible for the
    // media source ready state not to be open even though
    // source open callback is being called.
    return this.mediaSource && this.mediaSource.readyState === 'open';
  }

  isSourceBufferReady () {
    return this.sourceBuffer && this.sourceBuffer.updating === false;
  }

  initializeSourceBuffer (mimeCodec, options = {}) {
    debug('initializeSourceBuffer...');

    options = defaults({}, options, {
      onAppendStart: noop,
      onAppendFinish: noop,
      onRemoveFinish: noop,
      onAppendError: noop,
      onRemoveError: noop,
      onError: noop,
      retry: true,
    });

    if (!this.isMediaSourceReady()) {
      throw new Error('Cannot create the sourceBuffer if the mediaSource is not ready.');
    }

    // Kill the existing source buffer
    this.destroySourceBuffer();

    this.sourceBuffer = this.mediaSource.addSourceBuffer(mimeCodec);
    this.sourceBuffer.mode = 'sequence';

    // Supported Events
    this.sourceBuffer.addEventListener('updateend', () => this.onSourceBufferUpdateEnd());
    this.sourceBuffer.addEventListener('error', options.onError);

    // Custom Events
    this.options.onAppendStart = options.onAppendStart;
    this.options.onAppendError = options.onAppendError;
    this.options.onRemoveFinish = options.onRemoveFinish;
    this.options.onAppendFinish = options.onAppendFinish;
    this.options.onRemoveError = options.onRemoveError;
  }

  destroySourceBuffer () {
    debug('destroySourceBuffer...');

    if (!this.sourceBuffer) {
      return;
    }
  }

  queueSegment (segment) {
    debug(`Queueing segment.  The queue now has ${this.segmentQueue.length} segments.`);

    // this.segmentQueue.push(segment);
  }

  _append (byteArray) {
    silly('Appending to the sourceBuffer...');

    try {
      this.sourceBuffer.appendBuffer(byteArray);
    }
    catch (error) {
      this.options.onAppendError(error, byteArray);
    }
  }

  append (byteArray) {
    silly('Append');

    this.options.onAppendStart(byteArray);

    if (document.visibilityState === 'hidden') {
      debug('Tab not in focus - dropping frame...');
      return;
    }

    if (!this.isMediaSourceReady()) {
      debug('The mediaSource is not ready');
      this.queueSegment(byteArray);
      return;
    }

    if (!this.sourceBuffer) {
      debug('The sourceBuffer has not been initialized');
      this.queueSegment(byteArray);
      return;
    }

    if (!this.isSourceBufferReady()) {
      debug('The sourceBuffer is busy');
      this.queueSegment(byteArray);
      return;
    }

    // if (this.segmentQueue.length > 0) {
    //   debug('The queue is not empty.  Adding the current byteArray to the queue, then processing the first segment in the queue.');

    //   this._append(this.segmentQueue.shift());

    //   this.segmentQueue = [];

    //   this.queueSegment(byteArray);

    //   return;
    // }

    this._append(byteArray);
  }

  getBufferTimes () {
    const previousBufferSize = this.timeBuffered;
    const bufferTimeStart = this.sourceBuffer.buffered.start(0);
    const bufferTimeEnd = this.sourceBuffer.buffered.end(0);
    this.timeBuffered = bufferTimeEnd - bufferTimeStart;

    const info = {
      previousBufferSize,
      currentBufferSize: this.timeBuffered,
      bufferTimeStart,
      bufferTimeEnd,
    };

    return info;
  }

  trimBuffer (info = this.getBufferTimes()) {
    // over 30 seconds of video, so chop off 15
    if (this.timeBuffered > this.options.bufferSizeLimit && this.isSourceBufferReady()) {
      debug('Removing old stuff from sourceBuffer...');

      try {
        this.sourceBuffer.remove(info.bufferTimeStart, info.bufferTimeStart + this.options.bufferTruncateValue);
      }
      catch (error) {
        this.options.onRemoveError(error);
      }
    }
  }

  onSourceBufferUpdateEnd () {
    silly('onUpdateEnd');

    if (this.sourceBuffer.buffered.length <= 0) {
      debug('After updating, the sourceBuffer has no length!');
      return;
    }

    const info = this.getBufferTimes();

    if (info.previousBufferSize !== null && info.previousBufferSize > this.timeBuffered) {
      debug('On remove finish...');
      this.options.onRemoveFinish(info);
    }
    else {
      debug('On append finish...');
      this.options.onAppendFinish(info);
      this.trimBuffer(info);
    }

    // @todo - should we attempt to
    if (this.segmentQueue.length === 0) {
      debug('Nothing on the queue to process...');
      return;
    }

    debug(`Segment Queue Length: ${this.segmentQueue.length}`);

    this.append(this.segmentQueue.shift());
  }
}
