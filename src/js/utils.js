'use strict';

import {
  version,
} from '../../package.json';
import Logger from './logger';

const PLUGIN_NAME = 'clsp';
const MINIMUM_CHROME_VERSION = 52;

// @todo - this mime type, though used in the videojs plugin, and
// seemingly enforced, is not actually enforced.  The only enforcement
// done is requiring the user provide this string on the video element
// in the DOM.  The codecs that are supplied by the SFS's vary.  Here
// are some "valid", though not enforced mimeCodec values I have come
// across:
// video/mp4; codecs="avc1.4DE016"
// video/mp4; codecs="avc1.42E00C"
// video/mp4; codecs="avc1.42E00D"
const SUPPORTED_MIME_TYPE = "video/mp4; codecs='avc1.42E01E'";

const logger = Logger.factory();

function browserIsCompatable () {
  const isChrome = Boolean(window.chrome);
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  if (!isFirefox && !isChrome) {
    logger.debug('Unsupported browser');
    return false;
  }

  // For the MAC
  window.MediaSource = window.MediaSource || window.WebKitMediaSource;

  if (!window.MediaSource) {
    logger.error('Media Source Extensions not supported in your browser: Claris Live Streaming will not work!');

    return false;
  }

  // no specific version of firefox required for now.
  if (isFirefox === true) {
    logger.debug('Detected Firefox browser');
    return true;
  }

  try {
    const chromeVersion = parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2], 10);

    logger.debug(`Detected Chrome version ${chromeVersion}`);

    return chromeVersion >= MINIMUM_CHROME_VERSION;
  }
  catch (error) {
    logger.error(error);

    return false;
  }
}

function compatibilityCheck () {
  // @todo - does this need to throw an error?
  // For the MAC
  var NoMediaSourceAlert = false;

  window.MediaSource = window.MediaSource || window.WebKitMediaSource;

  if (!window.MediaSource) {
    if (NoMediaSourceAlert === false) {
      window.alert('Media Source Extensions not supported in your browser: Claris Live Streaming will not work!');
    }

    NoMediaSourceAlert = true;
  }
}

function isSupportedMimeType (mimeType) {
  return mimeType === SUPPORTED_MIME_TYPE;
}

function _getWindowStateNames () {
  logger.debug('Determining Page_Visibility_API property names.');

  // @see - https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  if (typeof document.hidden !== 'undefined') {
    logger.debug('Using standard Page_Visibility_API property names.');
    return {
      hiddenStateName: 'hidden',
      visibilityChangeEventName: 'visibilitychange',
    };
  }

  if (typeof document.msHidden !== 'undefined') {
    logger.debug('Using Microsoft Page_Visibility_API property names.');
    return {
      hiddenStateName: 'msHidden',
      visibilityChangeEventName: 'msvisibilitychange',
    };
  }

  if (typeof document.webkitHidden !== 'undefined') {
    logger.debug('Using Webkit Page_Visibility_API property names.');
    return {
      hiddenStateName: 'webkitHidden',
      visibilityChangeEventName: 'webkitvisibilitychange',
    };
  }

  logger.error('Unable to use the page visibility api - switching tabs and minimizing the page may result in slow downs and page crashes.');

  return {
    hiddenStateName: '',
    visibilityChangeEventName: '',
  };
}

export default {
  version,
  name: PLUGIN_NAME,
  supported: browserIsCompatable,
  compatibilityCheck,
  isSupportedMimeType,
  windowStateNames: _getWindowStateNames(),
};
