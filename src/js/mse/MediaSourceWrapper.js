'use strict';

import defaults from 'lodash/defaults';
import noop from 'lodash/noop';

import ListenerBaseClass from '~/utils/ListenerBaseClass';
import SourceBufferWrapper from './SourceBufferWrapper';

export default class MediaSourceWrapper extends ListenerBaseClass {
  static DEFAULT_OPTIONS = {
    duration: 10,
    readyRetryInterval: 500,
    readyRetryMax: 100,
  };

  static EVENT_NAMES = [
    ...ListenerBaseClass.EVENT_NAMES,
    'sourceOpen',
    'sourceEnded',
    'error',
    'sourceOpenFailure',
  ];

  static METRIC_TYPES = [
    'mediaSource.instances',
    'mediaSource.created',
    'mediaSource.destroyed',
    'mediaSource.reinitialized',
    'mediaSource.objectURL.created',
    'mediaSource.objectURL.revoked',
    'mediaSource.endOfStream.error',
  ];

  static isMimeCodecSupported (mimeCodec) {
    return (window.MediaSource && window.MediaSource.isTypeSupported(mimeCodec));
  }

  static factory (videoElement, options = {}) {
    return new MediaSourceWrapper(videoElement, options);
  }

  constructor (videoElement, options = {}) {
    if (!videoElement) {
      throw new Error('videoElement is required to construct an MediaSourceWrapper.');
    }

    super(options);

    this.videoElement = videoElement;

    this.mediaSource = null;
    this.sourceBuffer = null;
    this.objectURL = null;
    this.readyRetries = 0;

    // @todo - can probably use the on method here rather than having this
    // special property
    this.eventListeners = {
      sourceopen: () => {
        if (this.isReady()) {
          this._onSourceOpen();
          return;
        }

        const interval = setInterval(() => {
          if (this.destroyed) {
            console.warn('Media source was destroyed before it was ready.');
            clearInterval(interval);
            // this.trigger('sourceOpenFailure');
            return;
          }

          if (this.readyRetries >= this.options.readyRetryMax) {
            console.warn('Media source failed to become ready.');
            clearInterval(interval);
            this.trigger('sourceOpenFailure');
            return;
          }

          if (!this.isReady()) {
            this.readyRetries++;
            return;
          }

          this._onSourceOpen();

          clearInterval(interval);
        }, this.options.readyRetryInterval);
      },
      sourceended: () => {
        this.trigger('sourceEnded');
      },
      error: (error) => {
        this.trigger('error', error);
      },
    };
  }

  onFirstMetricListenerRegistered () {
    super.onFirstMetricListenerRegistered();

    this.metric('mediaSource.instances', 1);
  }

  _onSourceOpen () {
    // This can only be set when the media source is open.
    // @todo - does this do memory management for us so we don't have
    // to call remove on the buffer, which is expensive?  It seems
    // like it...
    this.mediaSource.duration = this.options.duration;

    this.trigger('sourceOpen');

    // We originally were having the moov appended by the iov player,
    // but I think it is more proper to do it here, however, can we
    // mandate that the moov exist prior to the sourceopen event? If
    // so, then we should be strict about the moov needing to exist
    // here, rather than checking for its existence.
    if (this.moov) {
      this.sourceBuffer.appendMoov(this.moov);
    }
  }

  async initializeMediaSource (options = {}) {
    this.debug('Initializing mediaSource...');

    options = defaults({}, options, {
      onSourceOpen: noop,
      onSourceEnded: noop,
      onError: noop,
    });

    this.metric('mediaSource.created', 1);

    // Kill the existing media source
    await this.destroyMediaSource();

    this.mediaSource = new window.MediaSource();

    this.mediaSource.addEventListener('sourceopen', this.eventListeners.sourceopen);
    this.mediaSource.addEventListener('sourceended', this.eventListeners.sourceended);
    this.mediaSource.addEventListener('error', this.eventListeners.error);
  }

  registerMimeCodec (mimeCodec) {
    if (!MediaSourceWrapper.isMimeCodecSupported(mimeCodec)) {
      throw new Error(`Mime codec of "${mimeCodec}" is not supported.`);
    }

    this.mimeCodec = mimeCodec;
  }

  getVideoElementSrc () {
    this.debug('getVideoElementSrc...');

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
      this.metric('mediaSource.objectURL.created', 1);

      this.objectURL = window.URL.createObjectURL(this.mediaSource);
    }

    this.videoElement.src = this.objectURL;
  }

  destroyVideoElementSrc () {
    this.debug('destroyVideoElementSrc...');

    if (!this.mediaSource) {
      // @todo - should this throw?
      return;
    }

    if (!this.objectURL) {
      // @todo - should this throw?
      return;
    }

    this.metric('mediaSource.objectURL.revoked', 1);

    this.objectURL = null;

    try {
      // @todo - need to check the updating property of the source buffer
      if (this.sourceBuffer) {
        this.sourceBuffer.abort();
      }
    }
    catch (error) {
      // @todo - metric
    }

    // free the resource
    // @todo - should we also set this.videoElement.src equal to an empty string here?
    return window.URL.revokeObjectURL(this.videoElement.src);
  }

  reinitializeVideoElementSrc () {
    this.metric('mediaSource.reinitialized', 1);

    this.destroyVideoElementSrc();

    // reallocate, this will call media source open which will
    // append the MOOV atom.
    return this.getVideoElementSrc();
  }

  isReady () {
    // found when stress testing many videos, it is possible for the
    // media source ready state not to be open even though
    // source open callback is being called.
    return this.mediaSource && this.mediaSource.readyState === 'open';
  }

  async initializeSourceBuffer (options) {
    if (!this.mimeCodec) {
      throw new Error('You must register a valid mime codec first.');
    }

    // @todo - should we try again after 1 second or something?
    if (!this.isReady()) {
      throw new Error('Cannot create the sourceBuffer if the mediaSource is not ready.');
    }

    if (this.sourceBuffer) {
      // Kill the existing source buffer
      await this.sourceBuffer.destroy();
    }

    this.sourceBuffer = SourceBufferWrapper.factory(this, options);
  }

  async destroyMediaSource () {
    if (!this.mediaSource || this.destroyed) {
      return;
    }

    this.debug('Destroying mediaSource...');

    this.mediaSource.removeEventListener('sourceopen', this.eventListeners.sourceopen);
    this.mediaSource.removeEventListener('sourceended', this.eventListeners.sourceended);
    this.mediaSource.removeEventListener('error', this.eventListeners.error);

    // let sourceBuffers = this.mediaSource.sourceBuffers;

    // if (sourceBuffers.SourceBuffers) {
    //   // @see - https://developer.mozilla.org/en-US/docs/Web/API/MediaSource/sourceBuffers
    //   sourceBuffers = sourceBuffers.SourceBuffers();
    // }

    // for (let i = 0; i < sourceBuffers.length; i++) {
    // this.mediaSource.removeSourceBuffer(sourceBuffers[i]);
    // }

    // @todo - if either the media source or the source buffer isn't ready
    // at this point, does it matter?  is endOfStream necessary?  if so, we
    // need to be able to guarantee that it can be called.  This will likely
    // require tracking whether or not this has been called
    if (this.isReady() && this.sourceBuffer.isReady()) {
      try {
        this.mediaSource.endOfStream();
      }
      catch (error) {
        this.debug(error);
        this.metric('mediaSource.endOfStream.error', 1);
      }
    }

    // @todo - should the sourceBuffer do this?
    // @todo - there should not be a scenario where this.sourceBuffer is
    // not defined
    if (this.sourceBuffer) {
      this.mediaSource.removeSourceBuffer(this.sourceBuffer.sourceBuffer);
    }

    // @todo - is this happening at the right time, or should it happen
    // prior to removing the source buffers?
    this.destroyVideoElementSrc();

    await this.sourceBuffer.destroy();

    this.metric('mediaSource.destroyed', 1);

    this.sourceBuffer = null;
    this.mediaSource = null;
  }

  destroy () {
    if (this.destroyed || this.destroying) {
      return;
    }

    this.debug('destroySourceBuffer...');

    // Note that the destroy method must be defined as synchronous,
    // even though it performs asynchronous operations, to ensure
    // that as soon as destroy is called, the destroying property
    // is set to true. This is needed and is time-sensitive because
    // multiple calls to destroy are possible, and subsequent calls
    // may occur before the destroying property is set here if the
    // destroy method is defined as asynchronous
    this.destroying = true;

    this.moov = null;

    return this.destroyMediaSource().then(() => {
      this.destroyed = true;

      this.videoElement = null;

      this.eventListeners = null;

      super.destroy();
    });
  }
}
