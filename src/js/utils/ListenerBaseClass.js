'use strict';

import Debug from 'debug';

export default class ListenerBaseClass {
  static DEBUG_NAME = 'skyline:clsp:utils:ListenerBaseClass';

  static EVENT_NAMES = [
    'metric',
  ];

  static METRIC_TYPES = [];

  constructor (debugName) {
    this.debug = Debug(debugName);
    this.silly = Debug(`silly:${debugName}`);

    this.metrics = {};
    this.events = {};

    for (let i = 0; i < this.constructor.EVENT_NAMES.length; i++) {
      this.events[this.constructor.EVENT_NAMES[i]] = [];
    }

    this.firstMetricListenerRegistered = false;
  }

  onFirstMetricListenerRegistered () {
    this.debug('onFirstMetricListenerRegistered...');

    this.firstMetricListenerRegistered = true;
  }

  on (name, action) {
    this.debug(`Registering Listener for ${name} event...`);

    if (!this.constructor.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    this.events[name].push(action);

    if (name === 'metric' && !this.firstMetricListenerRegistered) {
      this.onFirstMetricListenerRegistered();
    }
  }

  trigger (name, value) {
    if (name === 'metric') {
      this.silly(`Triggering ${name} event...`);
    }
    else {
      this.debug(`Triggering ${name} event...`);
    }

    if (!this.constructor.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    for (let i = 0; i < this.events[name].length; i++) {
      this.events[name][i](value, this);
    }
  }

  metric (type, value, skipValidTypeCheck = false) {
    if (!this.options || !this.options.enableMetrics) {
      return;
    }

    if (!skipValidTypeCheck && !this.constructor.METRIC_TYPES.includes(type)) {
      // @todo - should this throw?
      return;
    }

    // @todo - decouple these metric types - will that be possible with
    // skipValidTypeCheck, since this base class won't know the originating
    // metric instance?
    switch (type) {
      case 'iov.clientId':
      case 'iovConduit.clientId':
      case 'iovConduit.guid':
      case 'iovConduit.mimeCodec':
      case 'iovPlayer.clientId':
      case 'iovPlayer.video.currentTime':
      case 'iovPlayer.video.drift':
      case 'iovPlayer.video.segmentInterval':
      case 'iovPlayer.video.segmentIntervalAverage':
      case 'iovPlayer.mediaSource.sourceBuffer.bufferTimeEnd':
      case 'iovPlayer.mediaSource.sourceBuffer.genericErrorRestartCount':
      case 'sourceBuffer.lastKnownBufferSize':
      case 'sourceBuffer.lastMoofSize': {
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

  destroy () {
    this.firstMetricListenerRegistered = null;

    // @todo - since so much of what is going on with this plugin is
    // asynchronous and pub/sub, wait a full ten seconds before
    // dereferencing these, in case there are a few outstanding
    // events or method calls.
    // There must be a more proper way to do this, but for now it works
    setTimeout(() => {
      this.metrics = null;
      this.events = null;
      this.debug = null;
      this.silly = null;
    }, 10000);
  }
}
