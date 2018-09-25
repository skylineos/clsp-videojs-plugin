'use strict';

import Debug from 'debug';
import defaults from 'lodash/defaults';

export default class ListenerBaseClass {
  static DEBUG_NAME = 'skyline:clsp:utils:ListenerBaseClass';

  static DEFAULT_OPTIONS = {
    enableMetrics: false,
    destroyWait: 60 * 1000,
  };

  static EVENT_NAMES = [
    'metric',
  ];

  static METRIC_TYPES = [];

  constructor (debugName, options) {
    this.debug = Debug(debugName);
    this.silly = Debug(`silly:${debugName}`);

    this.debug('Constructing...');

    this.options = defaults({}, options, this.constructor.DEFAULT_OPTIONS);

    this.metrics = {};
    this.events = {};

    for (let i = 0; i < this.constructor.EVENT_NAMES.length; i++) {
      this.events[this.constructor.EVENT_NAMES[i]] = [];
    }

    this.firstMetricListenerRegistered = false;
    this.destroyed = false;
  }

  /**
   * There are some cases where metrics need to be captured at the
   * time of instantiation.  However, at that time, the metric event
   * listener has not been registered.  Override this method, being
   * sure to call super, to perform metrics that are meant to set at
   * the time of instantiation.
   *
   * @todo - this is not a proper solution.  If there are multiple
   * metric event listeners, only the first one will ever recieve
   * the constructor metrics.  Find a better way to do this.
   */
  onFirstMetricListenerRegistered () {
    this.debug('onFirstMetricListenerRegistered...');

    this.firstMetricListenerRegistered = true;
  }

  on (name, action) {
    this.debug(`Registering Listener for ${name} event...`);

    if (!this.constructor.EVENT_NAMES.includes(name)) {
      console.warn(`"${name}" is not a valid event."`);
      return;
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

  /**
   * Destroy the instance by dereferencing all of its instance properties.
   * Note that this will wait to dereference things that affect event
   * listeners, in case there are some that are still being cleaned up.
   * Also note that it is up to the caller to set `destroyed` to false.
   */
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
      this.options = null;
    }, this.options.destroyWait);
  }
}
