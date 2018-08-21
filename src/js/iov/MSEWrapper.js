'use strict';

import Debug from 'debug';
import defaults from 'lodash/defaults';
import noop from 'lodash/noop';

const DEBUG_PREFIX = 'skyline:clsp:iov';

const debug = Debug(`${DEBUG_PREFIX}:MSEWrapper`);
const silly = Debug(`silly:${DEBUG_PREFIX}:MSEWrapper`);

export default class MSEWrapper {
  static EVENT_NAMES = [
    'metric',
  ];

  static METRIC_TYPES = [
    'mediaSource.created',
    'mediaSource.destroyed',
    'objectURL.created',
    'objectURL.revoked',
    'mediaSource.reinitialized',
    'sourceBuffer.created',
    'sourceBuffer.destroyed',
    'queue.added',
    'queue.removed',
    'sourceBuffer.append',
    'error.sourceBuffer.append',
    'frameDrop.hiddenTab',
    'queue.mediaSourceNotReady',
    'queue.sourceBufferNotReady',
    'queue.shift',
    'queue.append',
    'sourceBuffer.lastKnownBufferSize',
    'sourceBuffer.trim',
    'sourceBuffer.trim.error',
    'sourceBuffer.updateEnd',
    'sourceBuffer.updateEnd.bufferLength.empty',
    'sourceBuffer.updateEnd.bufferLength.error',
    'sourceBuffer.updateEnd.removeEvent',
    'sourceBuffer.updateEnd.appendEvent',
    'sourceBuffer.updateEnd.bufferFrozen',
    'sourceBuffer.abort',
    'error.sourceBuffer.abort',
  ];

  static isMimeCodecSupported (mimeCodec) {
    return (window.MediaSource && window.MediaSource.isTypeSupported(mimeCodec));
  }

  static factory (videoElement, options = {}) {
    return new MSEWrapper(videoElement, options);
  }

  constructor (videoElement, options = {}) {
    debug('Constructing...');

    if (!videoElement) {
      throw new Error('videoElement is required to construct an MSEWrapper.');
    }

    this.destroyed = false;

    this.videoElement = videoElement;

    this.options = defaults({}, options, {
      // These default buffer value provide the best results in my testing.
      // It keeps the memory usage as low as is practical, and rarely causes
      // the video to stutter
      bufferSizeLimit: 90 + Math.floor(Math.random() * (200)),
      bufferTruncateFactor: 2,
      bufferTruncateValue: null,
      driftThreshold: 2000,
      duration: 10,
      enableMetrics: true,
    });

    this.segmentQueue = [];

    this.mediaSource = null;
    this.sourceBuffer = null;
    this.objectURL = null;
    this.timeBuffered = null;

    if (!this.options.bufferTruncateValue) {
      this.options.bufferTruncateValue = parseInt(this.options.bufferSizeLimit / this.options.bufferTruncateFactor);
    }

    this.metrics = {};

    // @todo - there must be a more proper way to do events than this...
    this.events = {};

    for (let i = 0; i < MSEWrapper.EVENT_NAMES.length; i++) {
      this.events[MSEWrapper.EVENT_NAMES[i]] = [];
    }

    this.eventListeners = {
      mediaSource: {},
      sourceBuffer: {},
    };

    this.onSourceBufferUpdateEnd = this.onSourceBufferUpdateEnd.bind(this);
  }

  on (name, action) {
    debug(`Registering Listener for ${name} event...`);

    if (!MSEWrapper.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    this.events[name].push(action);
  }

  trigger (name, value) {
    if (name === 'metric') {
      silly(`Triggering ${name} event...`);
    }
    else {
      debug(`Triggering ${name} event...`);
    }

    if (!MSEWrapper.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    for (let i = 0; i < this.events[name].length; i++) {
      this.events[name][i](value, this);
    }
  }

  metric (type, value) {
    if (!this.options || !this.options.enableMetrics) {
      return;
    }

    if (!MSEWrapper.METRIC_TYPES.includes(type)) {
      // @todo - should this throw?
      return;
    }

    switch (type) {
      case 'sourceBuffer.lastKnownBufferSize': {
        this.metrics[type] = value;
        break;
      }
      default: {
        if (!this.metrics.hasOwnProperty(type)) {
          this.metrics[type] = 0;
        }

        this.metrics[type] += value;
      }
    }

    this.trigger('metric', {
      type,
      value: this.metrics[type],
    });
  }

  initializeMediaSource (options = {}) {
    debug('Initializing mediaSource...');

    options = defaults({}, options, {
      onSourceOpen: noop,
      onSourceEnded: noop,
      onError: noop,
    });

    this.metric('mediaSource.created', 1);

    // Kill the existing media source
    this.destroyMediaSource();

    this.mediaSource = new window.MediaSource();

    this.eventListeners.mediaSource.sourceopen = () => {
      // This can only be set when the media source is open.
      // @todo - does this do memory management for us so we don't have
      // to call remove on the buffer, which is expensive?  It seems
      // like it...
      this.mediaSource.duration = this.options.duration;

      options.onSourceOpen();
    };
    this.eventListeners.mediaSource.sourceended = options.onSourceEnded;
    this.eventListeners.mediaSource.error = options.onError;

    this.mediaSource.addEventListener('sourceopen', this.eventListeners.mediaSource.sourceopen);
    this.mediaSource.addEventListener('sourceended', this.eventListeners.mediaSource.sourceended);
    this.mediaSource.addEventListener('error', this.eventListeners.mediaSource.error);
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
      this.metric('objectURL.created', 1);

      this.objectURL = window.URL.createObjectURL(this.mediaSource);
    }

    this.videoElement.src = this.objectURL;
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

    // this.metric('objectURL.revoked', 1);

    this.objectURL = null;

    if (this.sourceBuffer) {
      this.sourceBufferAbort();
    }

    // free the resource
    return window.URL.revokeObjectURL(this.videoElement.src);
  }

  reinitializeVideoElementSrc () {
    this.metric('mediaSource.reinitialized', 1);

    this.destroyVideoElementSrc();

    // reallocate, this will call media source open which will
    // append the MOOV atom.
    return this.getVideoElementSrc();
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

  async initializeSourceBuffer (mimeCodec, options = {}) {
    debug('initializeSourceBuffer...');

    options = defaults({}, options, {
      onAppendStart: noop,
      onAppendFinish: noop,
      onRemoveFinish: noop,
      onAppendError: noop,
      onRemoveError: noop,
      onStreamFrozen: noop,
      onError: noop,
      retry: true,
    });

    if (!this.isMediaSourceReady()) {
      throw new Error('Cannot create the sourceBuffer if the mediaSource is not ready.');
    }

    // Kill the existing source buffer
    await this.destroySourceBuffer();

    this.metric('sourceBuffer.created', 1);

    this.sourceBuffer = this.mediaSource.addSourceBuffer(mimeCodec);
    this.sourceBuffer.mode = 'sequence';

    // Custom Events
    this.eventListeners.sourceBuffer.onAppendStart = options.onAppendStart;
    this.eventListeners.sourceBuffer.onAppendError = options.onAppendError;
    this.eventListeners.sourceBuffer.onRemoveFinish = options.onRemoveFinish;
    this.eventListeners.sourceBuffer.onAppendFinish = options.onAppendFinish;
    this.eventListeners.sourceBuffer.onRemoveError = options.onRemoveError;
    this.eventListeners.sourceBuffer.onStreamFrozen = options.onStreamFrozen;
    this.eventListeners.sourceBuffer.onError = options.onError;

    // Supported Events
    this.sourceBuffer.addEventListener('updateend', this.onSourceBufferUpdateEnd);
    this.sourceBuffer.addEventListener('error', this.eventListeners.sourceBuffer.onError);
  }

  queueSegment (segment) {
    debug(`Queueing segment.  The queue now has ${this.segmentQueue.length} segments.`);

    this.metric('queue.added', 1);

    this.segmentQueue.push({
      timestamp: Date.now(),
      byteArray: segment,
    });
  }

  sourceBufferAbort () {
    debug('Aborting current sourceBuffer operation');

    try {
      this.metric('sourceBuffer.abort', 1);

      this.sourceBuffer.abort();
    }
    catch (error) {
      this.metric('error.sourceBuffer.abort', 1);

      // Somehow, this can be become undefined...
      if (this.eventListeners.sourceBuffer.onAbortError) {
        this.eventListeners.sourceBuffer.onAbortError(error);
      }
    }
  }

  _append ({ timestamp, byteArray }) {
    silly('Appending to the sourceBuffer...');

    try {
      const estimatedDrift = Date.now() - timestamp;

      if (estimatedDrift > this.options.driftThreshold) {
        debug(`Estimated drift of ${estimatedDrift} is above the ${this.options.driftThreshold} threshold.  Flushing queue...`);
        // @todo - perhaps we should re-add the last segment to the queue with a fresh
        // timestamp?  I think one cause of stream freezing is the sourceBuffer getting
        // starved, but I don't know if that's correct
        this.metric('queue.removed', this.segmentQueue.length + 1);
        this.segmentQueue = [];
        return;
      }

      debug(`Appending to the buffer with an estimated drift of ${estimatedDrift}`);

      this.metric('sourceBuffer.append', 1);

      this.sourceBuffer.appendBuffer(byteArray);
    }
    catch (error) {
      this.metric('error.sourceBuffer.append', 1);

      this.eventListeners.sourceBuffer.onAppendError(error, byteArray);
    }
  }

  processNextInQueue () {
    silly('processNextInQueue');

    if (document.visibilityState === 'hidden') {
      debug('Tab not in focus - dropping frame...');
      this.metric('frameDrop.hiddenTab', 1);
      this.metric('queue.cannotProcessNext', 1);
      return;
    }

    if (!this.isMediaSourceReady()) {
      debug('The mediaSource is not ready');
      this.metric('queue.mediaSourceNotReady', 1);
      this.metric('queue.cannotProcessNext', 1);
      return;
    }

    if (!this.isSourceBufferReady()) {
      debug('The sourceBuffer is busy');
      this.metric('queue.sourceBufferNotReady', 1);
      this.metric('queue.cannotProcessNext', 1);
      return;
    }

    if (this.segmentQueue.length > 0) {
      this.metric('queue.shift', 1);
      this.metric('queue.canProcessNext', 1);
      this._append(this.segmentQueue.shift());
    }
  }

  append (byteArray) {
    silly('Append');

    // Sometimes this can get hit after destroy is called
    if (!this.eventListeners.sourceBuffer.onAppendStart) {
      return;
    }

    this.eventListeners.sourceBuffer.onAppendStart(byteArray);

    this.metric('queue.append', 1);
    this.queueSegment(byteArray);

    this.processNextInQueue();
  }

  getBufferTimes () {
    const previousBufferSize = this.timeBuffered;
    const bufferTimeStart = this.sourceBuffer.buffered.start(0);
    const bufferTimeEnd = this.sourceBuffer.buffered.end(0);
    const currentBufferSize = bufferTimeEnd - bufferTimeStart;

    const info = {
      previousBufferSize,
      currentBufferSize,
      bufferTimeStart,
      bufferTimeEnd,
    };

    return info;
  }

  trimBuffer (info = this.getBufferTimes(), force = false) {
    this.metric('sourceBuffer.lastKnownBufferSize', this.timeBuffered);

    if (!info) {
      // @todo - should this be handled in some way?
      return;
    }

    if (force || (this.timeBuffered > this.options.bufferSizeLimit && this.isSourceBufferReady())) {
      debug('Removing old stuff from sourceBuffer...');

      try {
        // @todo - this is the biggest performance problem we have with this player.
        // Can you figure out how to manage the memory usage without causing the streams
        // to stutter?
        this.metric('sourceBuffer.trim', this.options.bufferTruncateValue);
        this.sourceBuffer.remove(info.bufferTimeStart, info.bufferTimeStart + this.options.bufferTruncateValue);
      }
      catch (error) {
        this.metric('sourceBuffer.trim.error', 1);
        this.eventListeners.sourceBuffer.onRemoveError(error);
      }
    }
  }

  onRemoveFinish (info = this.getBufferTimes()) {
    debug('On remove finish...');

    this.metric('sourceBuffer.updateEnd.removeEvent', 1);
    this.eventListeners.sourceBuffer.onRemoveFinish(info);
  }

  onAppendFinish (info = this.getBufferTimes()) {
    silly('On append finish...');

    this.metric('sourceBuffer.updateEnd.appendEvent', 1);

    // The current buffer size should always be bigger.If it isn't, there is a problem,
    // and we need to reinitialize or something.
    if (this.previousTimeEnd && info.bufferTimeEnd <= this.previousTimeEnd) {
      this.metric('sourceBuffer.updateEnd.bufferFrozen', 1);
      this.eventListeners.sourceBuffer.onStreamFrozen();
      return;
    }

    this.previousTimeEnd = info.bufferTimeEnd;

    this.eventListeners.sourceBuffer.onAppendFinish(info);
    this.trimBuffer(info);
  }

  onSourceBufferUpdateEnd () {
    silly('onUpdateEnd');

    this.metric('sourceBuffer.updateEnd', 1);

    try {
      // Sometimes the mediaSource is removed while an update is being
      // processed, resulting in an error when trying to read the
      // "buffered" property.
      if (this.sourceBuffer.buffered.length <= 0) {
        this.metric('sourceBuffer.updateEnd.bufferLength.empty', 1);
        debug('After updating, the sourceBuffer has no length!');
        return;
      }
    }
    catch (error) {
      // @todo - do we need to handle this?
      this.metric('sourceBuffer.updateEnd.bufferLength.error', 1);
      debug('The mediaSource was removed while an update operation was occurring.');
      return;
    }

    const info = this.getBufferTimes();

    this.timeBuffered = info.currentBufferSize;

    if (info.previousBufferSize !== null && info.previousBufferSize > this.timeBuffered) {
      this.onRemoveFinish(info);
    }
    else {
      this.onAppendFinish(info);
    }

    this.processNextInQueue();
  }

  destroySourceBuffer () {
    return new Promise((resolve, reject) => {
      if (!this.sourceBuffer) {
        return resolve();
      }

      this.sourceBufferAbort();

      this.sourceBuffer.removeEventListener('updateend', this.onSourceBufferUpdateEnd);
      this.sourceBuffer.removeEventListener('error', this.eventListeners.sourceBuffer.onError);

      this.sourceBuffer.addEventListener('updateend', () => {
        resolve();
      });

      try {
        this.trimBuffer(undefined, true);
      }
      catch (e) {
        console.error(e);
      }
    });
  }

  destroyMediaSource () {
    this.metric('sourceBuffer.destroyed', 1);

    debug('Destroying mediaSource...');

    if (!this.mediaSource) {
      return;
    }

    this.mediaSource.removeEventListener('sourceopen', this.eventListeners.mediaSource.sourceopen);
    this.mediaSource.removeEventListener('sourceended', this.eventListeners.mediaSource.sourceended);
    this.mediaSource.removeEventListener('error', this.eventListeners.mediaSource.error);

    // let sourceBuffers = this.mediaSource.sourceBuffers;

    // if (sourceBuffers.SourceBuffers) {
    //   // @see - https://developer.mozilla.org/en-US/docs/Web/API/MediaSource/sourceBuffers
    //   sourceBuffers = sourceBuffers.SourceBuffers();
    // }

    // for (let i = 0; i < sourceBuffers.length; i++) {
    // this.mediaSource.removeSourceBuffer(sourceBuffers[i]);
    // }

    this.mediaSource.endOfStream();
    this.mediaSource.removeSourceBuffer(this.sourceBuffer);

    // @todo - is this happening at the right time, or should it happen
    // prior to removing the source buffers?
    this.destroyVideoElementSrc();

    this.metric('mediaSource.destroyed', 1);
  }

  async destroy () {
    debug('destroySourceBuffer...');

    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.destroyMediaSource();
    await this.destroySourceBuffer();

    this.mediaSource = null;
    this.sourceBuffer = null;
    this.videoElement = null;

    this.timeBuffered = null;
    this.previousTimeEnd = null;
    this.segmentQueue = null;

    this.options = null;
    this.metrics = null;
    this.events = null;
    this.eventListeners = null;
    this.onSourceBufferUpdateEnd = null;
  }
}
