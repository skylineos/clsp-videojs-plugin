const MINIMUM_CHROME_VERSION = 52;

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






export default {
  supported: browserIsCompatable,
};
