'use strict';

import { version } from '../../package.json';

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

function browserIsCompatable () {
  const isChrome = Boolean(window.chrome);

  if (!isChrome) {
    return false;
  }

  // For the MAC
  window.MediaSource = window.MediaSource || window.WebKitMediaSource;

  if (!window.MediaSource) {
    console.error('Media Source Extensions not supported in your browser: Claris Live Streaming will not work!');

    return false;
  }

  try {
    return (parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2], 10) >= MINIMUM_CHROME_VERSION);
  }
  catch (error) {
    console.error(error);

    return false;
  }
}

function isSupportedMimeType (mimeType) {
  return mimeType === SUPPORTED_MIME_TYPE;
}

let hiddenStateName;
let visibilityChangeEventName;

function getWindowStateNames () {
  if (!hiddenStateName) {
    // @see - https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
    if (typeof document.hidden !== 'undefined') {
      hiddenStateName = 'hidden';
      visibilityChangeEventName = 'visibilitychange';
    }
    else if (typeof document.msHidden !== 'undefined') {
      hiddenStateName = 'msHidden';
      visibilityChangeEventName = 'msvisibilitychange';
    }
    else if (typeof document.webkitHidden !== 'undefined') {
      hiddenStateName = 'webkitHidden';
      visibilityChangeEventName = 'webkitvisibilitychange';
    }
  }

  return {
    hiddenStateName,
    visibilityChangeEventName,
  };
}

export default {
  version,
  name: PLUGIN_NAME,
  supported: browserIsCompatable,
  isSupportedMimeType,
  getWindowStateNames,
};
