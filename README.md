# videojs-mse-over-clsp

This plugin adds a new network protocol for the videojs player. It is activated by adding
the following source tag to your video tag in HTML5:

Example:

```html
 <video ... >
    <source
       src="clsp://<SFS IP address>:9001/<SFS stream name>"
       type="video/mp4; codecs='avc1.42E01E'"
    >
 </video>

```

The new network protocol is handled by specifying the following URI format:

clsp:// ip-address-of-the-clsp-service : port-number-of-web-socket / stream-id

In the above case, the clsp service lives on a Skyline SFS.  In this case, the ip
address is the SFS's ip address, the web socket port is 9001, and the stream name
on the SFS is called "mse".

The `type` attribute must be the following string:

```
video/mp4; codecs='avc1.42E01E'
```

which tells the browser exactly what codec to use to decode and play the video.
H.264 baseline 3.0 is a least common denominator codec supported on all browsers
(according to the MSE development page).

To run the development server:

1. edit `demo/index.html` and change the `src` attribute if needed
2. npm run build-dev
3. launch a browsers and goto http://localhost:9999
4. click play on the video element


## Table of Contents

## Installation

- [Installation](#installation)
- [Usage](#usage)
  - [`<style>` Tag](#style-tag)
  - [`<script>` Tag](#script-tag)
  - [Webpack](#webpack)
  - [Browserify/CommonJS](#browserifycommonjs)
  - [RequireJS/AMD](#requirejsamd)
- [License](#license)

## Installation

```
git clone https://gitlab.skylinenet.net/dschere/videojs.git
cd videojs
npm install
```

## Build

After making changes to the plugin, build the project to generate a distributable, standalone file:

```
npm run build
```

The generated files will be available in the `dist` directory.

## Run test server

```
cp webpack.config.dev.js webpack.config.js
npm run build-dev

This starts a development server on port 9999 to access the demos:

http://localhost:9999 >>> interactive demo site 

http://localhost:9999/walltest.html plays a 4x4 video wall using 
   a feed clsp://172.29.7.15:9001/SCDOT10022. 

```

## Usage

To include videojs-mse-over-clsp on your website or web application, use any of the following methods.

### `<style>` Tag

In the `<head>` of your page, include a line for the videojs and videojs-mse-over-clsp styles:

```html
<head>
  <link href="//path/to/videojs.min.css" rel="stylesheet">
  <link href="//path/to/videojs-clsp.min.css" rel="stylesheet">
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
   <source  src="clsp://<the ip address of sfs>:9001/<stream name>" type="video/mp4; codecs='avc1.42E01E'"/>

 </video>



<script src="//path/to/videojs.min.js"></script>
<script src="//path/to/videojs-clsp.min.js"></script>



<script>
  var player = videojs('my-video');

  player.clsp();
</script>
```

### Webpack

When using with Webpack, you will need to need to register the global videojs in your `webpack.config.js` file:

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
