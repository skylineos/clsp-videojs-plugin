# videojs-mse-over-clsp

A videojs plugin that adds support for video served over the `clsp` protocol.
Currently, this protocol is available only via Skyline SFS solutions.

Note - this plugin currently only works in Chrome.

The new network protocol is handled by specifying the following URI format:

`clsp:// sfs-ip-address : port-number-of-web-socket / stream-id`

* the ip address is that of the SFS
* the web socket port is 9001
* the stream name as defined on the SFS

On the HTML `video` tag, the `type` attribute must be the following:

```
video/mp4; codecs='avc1.42E01E'
```

This tells the browser exactly what codec to use to decode and play the video.
H.264 baseline 3.0 is a least common denominator codec supported on all browsers
(according to the MSE development page).


## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [`<style>` Tag](#style-tag)
  - [`<script>` Tag](#script-tag)
  - [Webpack](#webpack)
  - [Browserify/CommonJS](#browserifycommonjs)
  - [RequireJS/AMD](#requirejsamd)
- [License](#license)
- [@todos](#@todos)


## Requirements

### Browsers

Chrome 52+ is required to run this videojs extension.  All other browsers are currently not supported.


### VideoJS

VideoJS version >= 5 are supported.


### Development Environment

Node 8.9.x is required to run the necessary build and development scripts.

One option for installing node in a development environment is to use the
node version manager ["n"](https://github.com/tj/n).  If you're using
Windows, you can get an installer from [Node's website](https://nodejs.org/en/download/).


## Installation

```
git clone https://github.com/skylineos/clsp-videojs-plugin.git
cd clsp-videojs-plugin
npm install
```

## Build

After making changes to the plugin, build the project to generate a distributable, standalone file:

```
npm run build
```

The generated files will be available in the `dist` directory.


## Run test server

1. `npm run start-dev`
1. navigate to [http://localhost:9999](http://localhost:9999) in Chrome
1. add a `clsp` url to any of the inputs, then click submit
1. click play on the video element (if not using an autoplay player)

Note that this dev server will NOT re-generate the `clspConduit.generated.js` file.
If you make changes to this file, you will need to run `npm run build` and then
restart the dev server to get your changes to be recognized:

`npm run build && npm run start-dev`

This is expected to be fixed in an upcoming release.


## Usage

To include videojs-mse-over-clsp on your website or web application, use any of the following methods.

### `<style>` Tag

In the `<head>` of your page, include a line for the videojs and the clsp plugin styles:

```html
<head>
  <link href="//vjs.zencdn.net/6.2.5/video-js.min.css" rel="stylesheet">
  <link href="//path/to/node_modules/clsp-videojs-plugin/dist/videojs-mse-over-clsp.min.css" rel="stylesheet">
<head>
```

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<video
  id="my-video"
  width="352"
  height="240"
  class="video-js vjs-default-skin"
  controls
>
  <!-- standard streaming over TCP port 9001 -->
  <source
    src="clsp://<SFS IP address>:9001/<stream name>"
    type="video/mp4; codecs='avc1.42E01E'"
  />
 
  <!-- secure streaming over TCP port 9003 -->
  <source
    src="clsp://<SFS IP address>:9003/<stream name>?secure=1"
    type="video/mp4; codecs='avc1.42E01E'"
  />
  
  
</video>

<script src="//vjs.zencdn.net/6.2.5/video.min.js"></script>
<script src="//path/to/node_modules/clsp-videojs-plugin/dist/videojs-mse-over-clsp.min.js"></script>

<script>
  var player = videojs('my-video');

  player.clsp();
</script>
```

### Webpack

When using with Webpack, you will need to register the global videojs in your `webpack.config.js` file:

```javascript
{
  // ...
  alias: {
    'video.js$': 'video.js/dist/video.cjs.js',
  }
}
```

In your code, you will need to set videojs on the window prior to requiring this plugin:

```javascript
import videojs from 'video.js';

window.videojs = videojs;

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-mse-over-clsp');

const player = videojs('my-video');

player.clsp();
```

### Browserify/CommonJS

When using with Browserify, install videojs-mse-over-clsp via npm and `require` the plugin as you would any other module.

```javascript
const videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-mse-over-clsp');

var player = videojs('my-video');

player.clsp();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-mse-over-clsp'], function(videojs) {
  var player = videojs('my-video');

  player.clsp();
});
```

## License

See the LICENSE file at the root of this repository.


## @todos

* expose utils
* create demo for failover
* add lint precommit
* minify css
* minify conduit
