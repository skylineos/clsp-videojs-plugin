'use strict';

import defaults from 'lodash/defaults';
import noop from 'lodash/noop';
import ListenerBaseClass from '~/utils/ListenerBaseClass';
// import { mp4toJSON } from '~/utils/mp4-inspect';

export default class MediaSourceWrapper extends ListenerBaseClass {
  static DEBUG_NAME = 'skyline:clsp:mse:MediaSourceWrapper';

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
    'sourceBuffer.lastMoofSize',
    'error.mediaSource.endOfStream',
  ];

}
