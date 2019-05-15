# videojs-mse-over-clsp

A videojs plugin that adds support for video served over the `clsp` protocol.
Currently, this protocol is available only via Skyline's SFS solutions.

Note - this plugin currently only works in Chrome and Firefox.  Chrome is recommended for performance.
Note - this highest h.264 keyframe/iframe segment frequency this plugin currently supports is 2 per second.  This is different from frames per second.

## Table of Contents

- [URL structure](#url-structure)
- [Installation](#installation)
  - [Via NPM](#via-npm)
  - [Via Git](#via-git)
- [Usage](#usage)
  - [`<head>` Tag](#head-tag)
  - [`<video>` Tag](#video-tag)
  - [`<script>` Tag](#script-tag)
- [Supported Browsers](#supported-browsers)
- [Dependencies](#dependencies)
- [License](#license)

## URL Structure

The new network protocol is handled by specifying the following URI format:

`[clsp protocol] :// [sfs-ip-address] : [port-number-of-web-socket] / [stream-id]`

* clsp or clsps
* the ip address is that of the SFS
* the port is not necessary unless it is something other than 80 or 443
* the stream name as defined on the SFS

Example stream url:

`clsp://172.28.12.57:9001/FairfaxVideo0520`


## Installation

### Via NPM

Add the following entry to your `package.json` `dependencies` object:

```javascript
"dependencies": {
  // ...
  "videojs-mse-over-clsp": "git+https://github.com/skylineos/clsp-videojs-plugin.git#v0.15.0",
}
```

This plugin is not currently published on NPM.  We will be publishing it soon.


### Via Git

```
git clone https://github.com/skylineos/clsp-videojs-plugin.git
cd clsp-videojs-plugin
yarn install
```

## Usage

`@babel/polyfill` and `video.js` MUST be sourced/included prior to the plugin.

See `demo/simpleWithVideoJs.html` for a full example.

### `<head>` Tag

In the `<head>` of your page, include a line for the videojs and the clsp plugin styles:

```html
<head>
  <!-- VideoJS styles -->
  <link
    rel="stylesheet"
    href="//vjs.zencdn.net/7.5.4/video-js.min.css"
  >
  <!-- CLSP styles -->
  <link
    rel="stylesheet"
    href="../dist/videojs-mse-over-clsp.css"
  >
  <!-- Babel Polyfill -->
  <script
    type="text/javascript"
    src="//cdn.jsdelivr.net/npm/@babel/polyfill@7.4.4/dist/polyfill.min.js"
  ></script>
<head>
```


### `<video>` tag

On the HTML `video` tag, the `type` attribute must be the following:

`video/mp4; codecs='avc1.42E01E'`

This tells the browser exactly what codec to use to decode and play the video.
H.264 baseline 3.0 is a least common denominator codec supported on all browsers
(according to the MSE development page).

Here is a sample video element that defines a CLSP and an HLS stream

```html
<video
  id="my-video"
  class="video-js vjs-default-skin"
  controls
>
  <!-- CLSP Stream -->
  <source
    src="clsp://8.15.251.53/FairfaxVideo0510"
    type="video/mp4; codecs='avc1.42E01E'"
  />
  <!-- HLS Stream -->
  <source
    src="http://8.15.251.53:1935/rtplive/FairfaxVideo0510/playlist.m3u8"
    type="application/x-mpegURL"
  />
</video>
```


### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<!-- VideoJS -->
<script src="//vjs.zencdn.net/7.5.4/video.min.js"></script>
<!-- CLSP Plugin -->
<script src="../dist/videojs-mse-over-clsp.min.js"></script>

<script>
  // construct the player
  var player = videojs('my-video');

  // Only use CLSP if in a supported browser
  if (window.clspUtils.supported()) {
    // Note - This must be executed prior to playing the video for CLSP streams
    player.clsp();
  }
</script>
```


## Supported Browsers

Chrome 52+ or Firefox are the browsers that this plugin currently supports.  All other browsers are currently not supported.


## Dependencies

`@babel/polyfill` `7.4.4` is required.

`video.js` `7.5.4` is the recommended version.  Version `6.x` is not recommended due to it being less performant over time.

If using `videojs-errors`, which is recommended, `4.2.0` is the recommended version, as it allows us to re-register successive errors to respond to successfive failures as necessary to support stream recovery.


## License

See the LICENSE file at the root of this repository.
