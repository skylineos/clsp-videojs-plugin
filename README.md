# videojs-mse-over-clsp

A videojs plugin that adds support for video served over the `clsp` protocol.
Currently, this protocol is available only via Skyline SFS solutions.

Note - this plugin currently only works in Chrome.
Note - this highest keyframe/iframe segment frequency this plugin currently supports is 2 per second.

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


### Dependencies

`babel-polyfill` `6.26.0` is required.

`video.js` `7.3.0` is the recommended version required.  Version `6.x` is not recommended due to it being less performant over time.

If using `videojs-errors`, which is recommended, `4.2.0` is the recommended version, as it allows us to re-register successive errors to respond to successfive failures as necessary to support stream recovery.


### Development Environment

Node 10.15.x is required to run the necessary build and development scripts.

One option for installing node in a development environment is to use the node version manager ["n"](https://github.com/tj/n).  If you're using Windows, you can get an installer from [Node's website](https://nodejs.org/en/download/).

#### Vagrant

1. `cd` into the parent directory of the CLSP project
1. `cp scripts/deploy/Vagrantfile .`
1. `vagrant destroy -f && vagrant up && vagrant ssh`
1. `cd /vagrant/clsp-videojs-plugin`
1. `rm -rf node_modules`
1. `yarn install`
1. `yarn run serve:vagrant`


## Installation

```
git clone https://github.com/skylineos/clsp-videojs-plugin.git
cd clsp-videojs-plugin
yarn install
```

## Build

Note: If you ae installing on ubuntu the package for nodejs is way out of date, you will need to follow the instructions here to upgrade node: https://github.com/tj/n

After making changes to the plugin, build the project to generate a distributable, standalone file:

```
yarn run build
```

The generated files will be available in the `dist` directory.


## Run test server

1. `yarn run serve`
1. navigate to [http://localhost:9999](http://localhost:9999) in Chrome
1. add a `clsp` url to any of the inputs, then click submit
1. click play on the video element (if not using an autoplay player)

Note that this dev server will NOT re-generate the `clspConduit.generated.js` file.
If you make changes to this file, you will need to run `yarn run build` and then
restart the dev server to get your changes to be recognized:

`yarn run build && yarn run serve`

This is expected to be fixed in an upcoming release.


## Usage

To include videojs-mse-over-clsp on your website or web application, use any of the following methods.

### `<style>` Tag

In the `<head>` of your page, include a line for the videojs and the clsp plugin styles:

```html
<head>
  <link
    rel="stylesheet"
    href="//vjs.zencdn.net/7.3.0/video-js.min.css"
  >
  <link
    rel="stylesheet"
    href="../dist/videojs-mse-over-clsp.min.css"
  >
  <script
    type="text/javascript"
    src="//cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.min.js"
  ></script>
<head>
```

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

See `dist/simple.html` for an example.

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

  <!-- or for secure clsp -->
  <source
    src="clsps://<SFS IP address>[:443]/<stream name>"
    type="video/mp4; codecs='avc1.42E01E'"
  />
</video>

<script src="//vjs.zencdn.net/7.3.0/video.min.js"></script>
<script src="//path/to/node_modules/videojs-mse-over-clsp/dist/videojs-mse-over-clsp.min.js"></script>

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
    'video.js$': path.resolve(__dirname, 'node_modules', 'video.js'),
  }
}
```

In your code, you will need to set videojs on the window prior to requiring this plugin:

```javascript
import 'babel-polyfill';
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

When using with Browserify, install videojs-mse-over-clsp via yarn or npm and `require` the plugin as you would any other module.

```javascript
require('babel-polyfill');

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
require(['video.js', 'babel-polyfill', 'videojs-mse-over-clsp'], function(videojs) {
  var player = videojs('my-video');

  player.clsp();
});
```

## License

See the LICENSE file at the root of this repository.


## @todos

* create dispose methods for all classes
* make iov initialize execute once, and by default
* create demo for failover
* add lint precommit
* minify css
* minify conduit
