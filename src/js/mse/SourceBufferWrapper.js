'use strict';

import defaults from 'lodash/defaults';
import ListenerBaseClass from '~/utils/ListenerBaseClass';
// import { mp4toJSON } from '~/utils/mp4-inspect';

export default class SourceBufferWrapper extends ListenerBaseClass {
  static DEBUG_NAME = 'skyline:clsp:mse:SourceBufferWrapper';

  static DEFAULT_OPTIONS = {
    // These default buffer value provide the best results in my testing.
    // It keeps the memory usage as low as is practical, and rarely causes
    // the video to stutter
    bufferSizeLimit: 90 + Math.floor(Math.random() * (200)),
    bufferTruncateFactor: 2,
    bufferTruncateValue: null,
    driftThreshold: 2000,
    minimumBufferIncrementSize: 0.5,
  };

  static EVENT_NAMES = [
    ...ListenerBaseClass.EVENT_NAMES,
    'appendStart',
    'appendFinish',
    'removeFinish',
    'appendError',
    'removeError',
    'streamFrozen',
    'error',
  ];

  static METRIC_TYPES = [
    'sourceBuffer.instances',
    'sourceBuffer.created',
    'sourceBuffer.destroyed',
    'sourceBuffer.queue.added',
    'sourceBuffer.queue.removed',
    'sourceBuffer.append',
    'sourceBuffer.append.error',
    'sourceBuffer.frameDrop.hiddenTab',
    'sourceBuffer.queue.mediaSourceNotReady',
    'sourceBuffer.queue.sourceBufferNotReady',
    'sourceBuffer.queue.shift',
    'sourceBuffer.queue.append',
    'sourceBuffer.lastKnownBufferSize',
    'sourceBuffer.insufficientBufferAppends',
    'sourceBuffer.trim',
    'sourceBuffer.trim.error',
    'sourceBuffer.updateEnd',
    'sourceBuffer.updateEnd.bufferLength.empty',
    'sourceBuffer.updateEnd.bufferLength.error',
    'sourceBuffer.updateEnd.removeEvent',
    'sourceBuffer.updateEnd.appendEvent',
    'sourceBuffer.updateEnd.bufferFrozen',
    'sourceBuffer.abort',
    'sourceBuffer.abort.error',
    'sourceBuffer.lastMoofSize',
  ];

  static factory (mediaSource, options = {}) {
    // @todo - do a type check here
    if (!mediaSource) {
      throw new Error('A mediaSource object is required to create a sourceBuffer.');
    }

    return new SourceBufferWrapper(mediaSource, options);
  }

  constructor (mediaSource, options) {
    super(SourceBufferWrapper.DEBUG_NAME, options);

    if (!this.options.bufferTruncateValue) {
      this.options.bufferTruncateValue = parseInt(this.options.bufferSizeLimit / this.options.bufferTruncateFactor);
    }

    this.mediaSource = mediaSource;

    // @todo - don't use the mediaSource internal property
    this.sourceBuffer = this.mediaSource.mediaSource.addSourceBuffer(this.mediaSource.mimeCodec);
    this.sourceBuffer.mode = 'sequence';

    this.segmentQueue = [];
    this.sequenceNumber = 0;
    this.timeBuffered = null;
    this.previousTimeEnd = null;

    // @todo - can probably use the on method here rather than having this
    // special property
    this.eventListeners = {
      onUpdateEnd: () => {
        this.onUpdateEnd();
      },
      onAppendStart: (moof) => {
        this.trigger('appendStart', moof);
      },
      onAppendFinish: (info) => {
        this.trigger('appendFinish', info);
      },
      onAppendError: (error) => {
        this.trigger('appendError', error);
      },
      onRemoveFinish: (info) => {
        this.trigger('removeFinish', info);
      },
      onRemoveError: (error) => {
        this.trigger('removeError', error);
      },
      onStreamFrozen: () => {
        this.trigger('streamFrozen');
      },
      onError: (error) => {
        this.trigger('error', error);
      },
    };

    // Supported Events
    this.sourceBuffer.addEventListener('updateend', this.eventListeners.onUpdateEnd);
    this.sourceBuffer.addEventListener('error', this.eventListeners.onError);
  }

  onFirstMetricListenerRegistered () {
    super.onFirstMetricListenerRegistered();

    this.metric('sourceBuffer.created', 1);
  }

  isReady () {
    return this.sourceBuffer && this.sourceBuffer.updating === false;
  }

  queueSegment (segment) {
    this.debug(`Queueing segment.  The queue now has ${this.segmentQueue.length} segments.`);

    this.metric('sourceBuffer.queue.added', 1);

    this.segmentQueue.push({
      timestamp: Date.now(),
      moof: segment,
    });
  }

  abort () {
    this.debug('Aborting current sourceBuffer operation');

    try {
      this.metric('sourceBuffer.abort', 1);

      this.sourceBuffer.abort();
    }
    catch (error) {
      this.metric('sourceBuffer.abort.error', 1);

      // Somehow, this can be become undefined...
      if (this.eventListeners.onAbortError) {
        this.eventListeners.onAbortError(error);
      }
    }
  }

  processNextInQueue () {
    this.silly('processNextInQueue');

    if (document.visibilityState === 'hidden') {
      this.debug('Tab not in focus - dropping frame...');
      this.metric('sourceBuffer.frameDrop.hiddenTab', 1);
      this.metric('sourceBuffer.queue.cannotProcessNext', 1);
      return;
    }

    // I have come across the mediaSource not existing...
    if (!this.mediaSource || !this.mediaSource.isReady()) {
      this.debug('The mediaSource is not ready');
      this.metric('sourceBuffer.queue.mediaSourceNotReady', 1);
      this.metric('sourceBuffer.queue.cannotProcessNext', 1);
      return;
    }

    if (!this.isReady()) {
      this.debug('The sourceBuffer is busy');
      this.metric('sourceBuffer.queue.sourceBufferNotReady', 1);
      this.metric('sourceBuffer.queue.cannotProcessNext', 1);
      return;
    }

    if (this.segmentQueue.length > 0) {
      this.metric('sourceBuffer.queue.shift', 1);
      this.metric('sourceBuffer.queue.canProcessNext', 1);
      this._append(this.segmentQueue.shift());
    }
  }

  formatMoof (moof) {
    // We must overwrite the sequence number locally, because it
    // the sequence that comes from the server will not necessarily
    // start at zero.  It should start from zero locally.  This
    // requirement may have changed with more recent versions of the
    // browser, but it appears to make the video play a little more
    // smoothly
    moof[20] = (this.sequenceNumber & 0xFF000000) >> 24;
    moof[21] = (this.sequenceNumber & 0x00FF0000) >> 16;
    moof[22] = (this.sequenceNumber & 0x0000FF00) >> 8;
    moof[23] = this.sequenceNumber & 0xFF;

    return moof;
  }

  appendMoov (moov) {
    this.debug('appendMoov');

    this.metric('sourceBuffer.lastMoovSize', moov.length);

    // Sometimes this can get hit after destroy is called
    if (!this.eventListeners.onAppendStart) {
      return;
    }

    this.debug('appending moov...');
    this.queueSegment(moov);

    this.processNextInQueue();
  }

  append (moof) {
    this.silly('Append');

    this.metric('sourceBuffer.lastMoofSize', moof.length);

    // console.log(mp4toJSON(moof));

    // Sometimes this can get hit after destroy is called
    if (!this.eventListeners.onAppendStart) {
      return;
    }

    this.eventListeners.onAppendStart(moof);

    this.metric('sourceBuffer.queue.append', 1);

    this.queueSegment(this.formatMoof(moof));
    this.sequenceNumber++;

    this.processNextInQueue();
  }

  _append ({ timestamp, moof }) {
    this.silly('Appending to the sourceBuffer...');

    try {
      const estimatedDrift = Date.now() - timestamp;

      if (estimatedDrift > this.options.driftThreshold) {
        this.debug(`Estimated drift of ${estimatedDrift} is above the ${this.options.driftThreshold} threshold.  Flushing queue...`);
        // @todo - perhaps we should re-add the last segment to the queue with a fresh
        // timestamp?  I think one cause of stream freezing is the sourceBuffer getting
        // starved, but I don't know if that's correct
        this.metric('queue.removed', this.segmentQueue.length + 1);
        this.segmentQueue = [];
        return;
      }

      this.debug(`Appending to the buffer with an estimated drift of ${estimatedDrift}`);

      this.metric('sourceBuffer.append', 1);

      this.sourceBuffer.appendBuffer(moof);
    }
    catch (error) {
      this.metric('sourceBuffer.append.error', 1);

      this.eventListeners.onAppendError(error, moof);
    }
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

  trimBuffer (info, force = false) {
    this.metric('sourceBuffer.lastKnownBufferSize', this.timeBuffered);

    try {
      if (!info) {
        info = this.getBufferTimes();
      }

      if (force || (this.timeBuffered > this.options.bufferSizeLimit && this.isReady())) {
        this.debug('Removing old stuff from sourceBuffer...');

        // @todo - this is the biggest performance problem we have with this player.
        // Can you figure out how to manage the memory usage without causing the streams
        // to stutter?
        this.metric('sourceBuffer.trim', this.options.bufferTruncateValue);
        this.sourceBuffer.remove(info.bufferTimeStart, info.bufferTimeStart + this.options.bufferTruncateValue);
      }
    }
    catch (error) {
      this.metric('sourceBuffer.trim.error', 1);
      this.eventListeners.onRemoveError(error);
    }
  }

  onRemoveFinish (info = this.getBufferTimes()) {
    this.debug('On remove finish...');

    this.metric('sourceBuffer.updateEnd.removeEvent', 1);
    this.eventListeners.onRemoveFinish(info);
  }

  onAppendFinish (info = this.getBufferTimes()) {
    this.silly('On append finish...');

    this.metric('sourceBuffer.updateEnd.appendEvent', 1);

    // The current buffer size should always be bigger.If it isn't, there is a problem,
    // and we need to reinitialize or something.
    if (this.previousTimeEnd && info.bufferTimeEnd <= this.previousTimeEnd) {
      this.metric('sourceBuffer.updateEnd.bufferFrozen', 1);
      this.eventListeners.onStreamFrozen();
      return;
    }

    if (info.previousBufferSize && (info.currentBufferSize - info.previousBufferSize < this.options.minimumBufferIncrementSize)) {
      this.metric('sourceBuffer.insufficientBufferAppends', 1);
    }

    this.previousTimeEnd = info.bufferTimeEnd;
    this.eventListeners.onAppendFinish(info);
    this.trimBuffer(info);
  }

  onUpdateEnd () {
    this.silly('onUpdateEnd');

    this.metric('sourceBuffer.updateEnd', 1);

    try {
      // Sometimes the mediaSource is removed while an update is being
      // processed, resulting in an error when trying to read the
      // "buffered" property.
      if (this.sourceBuffer.buffered.length <= 0) {
        this.metric('sourceBuffer.updateEnd.bufferLength.empty', 1);
        this.debug('After updating, the sourceBuffer has no length!');
        return;
      }
    }
    catch (error) {
      // @todo - do we need to handle this?
      this.metric('sourceBuffer.updateEnd.bufferLength.error', 1);
      this.debug('The mediaSource was removed while an update operation was occurring.');
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

  destroy () {
    return new Promise((resolve, reject) => {
      if (this.destroyed) {
        return resolve();
      }

      this.destroyed = true;

      this.debug('destroying...');

      this.abort();

      this.sourceBuffer.removeEventListener('updateend', this.eventListeners.onUpdateEnd);
      this.sourceBuffer.removeEventListener('error', this.eventListeners.onError);

      this.sourceBuffer.addEventListener('updateend', () => {
        resolve();
      });

      this.trimBuffer(undefined, true);

      this.timeBuffered = null;
      this.previousTimeEnd = null;
      this.segmentQueue = null;

      this.eventListeners = null;

      this.mediaSource = null;
      this.sourceBuffer = null;

      super.destroy();
    });
  }
}
