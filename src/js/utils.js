import { version } from '../../package.json';

const PLUGIN_NAME = 'clsp';
const MINIMUM_CHROME_VERSION = 52;
const SUPPORTED_MIME_TYPE = "video/mp4; codecs='avc1.42E01E'";

function browserIsCompatable () {
  // Chrome 1+
  const isChrome = (Boolean(window.chrome) && Boolean(window.chrome.webstore));

  if (!isChrome) {
    return false;
  }

  try {
    return (parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2], 10) >= MINIMUM_CHROME_VERSION);
  }
  catch (error) {
    return false;
  }
}

function isSupportedMimeType (mimeType) {
  return mimeType === SUPPORTED_MIME_TYPE;
}

export default {
  version,
  name: PLUGIN_NAME,
  supported: browserIsCompatable,
  isSupportedMimeType,
};
