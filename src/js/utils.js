function browserIsCompatable() {
    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    var r = false;

    function getChromeVersion() {
        var raw = window.navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

        return raw
            ? parseInt(raw[2], 10)
            : -1;
    }

    // chrome version 52 or greater
    if (isChrome === true) {
        if (getChromeVersion() >= 52) {
            r = true;
        }
    }

    return r;
}

export default {
    supported: browserIsCompatable,
};
