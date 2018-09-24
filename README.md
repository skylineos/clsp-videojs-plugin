# videojs-clsp

A [video.js](https://github.com/videojs/video.js) plugin to support real-time video streams served over Skyline's `clsp` protocol.

The CLSP protocol was designed by Skyline's appliance and web engineers to serve as a "closer-to-real-time" replacement for the more commonly used RTMP streams.  With Google's decision to deprecate Flash in Chrome over the next few years, we needed a live streaming solution that was a worthy successor to RTMP.

To contact Skyline about utilizing this protocol to serve your live-streaming needs, please visit our website at [https://www.skylinenet.net/](https://www.skylinenet.net/).


## Requirements

### Client

#### Browser

Google Chrome >= 52

Currently, this plugin is only supported in Chrome.  We have demonstrated a proof of concept in other browsers, but we are focusing our efforts on and only supporting Chrome since the other browsers are not yet deprecating Flash.  In the future, we plan to support all other major browsers.

#### video.js

Video JS 6.7.1 is required.  Currently, this is the last version that correctly implements autoplay.  The CLSP plugin is compatible with the 7.x version of video.js, but due to the missing autoplay feature, its use is not recommended.

#### babel-polyfill

This project is written using ES6, so even when including the distributable version of the plugin in your project, you will need to include the `babel-polyfill` dist as well.  See [https://babeljs.io/docs/en/babel-polyfill](https://babeljs.io/docs/en/babel-polyfill) and the examples below for more information.


### Server

Skyline SFS Appliance >= 4.5.4

Currently, the only server application capable of streaming live video over CLSP is Skyline's own SFS Appliance.


## Development

Run `npm run serve`, then navigate to [http://localhost:9999](http://localhost:9999) in Chrome.

### Prerequisites

Node 8.9.x is required to run the necessary build and development scripts.

Our recommended option for installing node in a development environment is to use the node version manager ["n"](https://github.com/tj/n).  Other node version managers exist, and there are other ways of installing a specific node version, so use whichever method you prefer.  If you're using Windows, you can get an installer from [Node's website](https://nodejs.org/en/download/).

### Installation

```
git clone https://github.com/skylineos/clsp-videojs-plugin.git
cd clsp-videojs-plugin
npm i
```

### NPM Scripts

#### `npm run serve`

As you make changes, the project will re-transpile, and will be ready upon page reload.

#### `npm run build`

Transpile the source into distributable, standalone js and css files that will be available in the `dist` directory.

#### `npm version`

We have implemented a `version` hook that will build the project upon versioning, and a `post-version` hook that will commit and push to github upon versioning.


### URL Format

`(clsp|clsps)://[sfs-host][:port]/[stream]`

* `protocol` - use `clsps` for streams served over SSL (recommended), or `clsp` for non-secure streams
* `sfs-host` - the domain or ip address of the SFS
* `port` - the SFS port to connect to.  This will default to `443` for secure or `9001` for non-secure if no port is provided
* `stream` - the SFS stream name


### Supported Codec

Currently, only the `video/mp4; codecs='avc1.42E01E'` (H.264 baseline 3.0) codec is supported.


## Usage

### Getting Started

```html
<html>
  <head>
    <link
      rel="stylesheet"
      href="//vjs.zencdn.net/6.7.1/video-js.min.css"
    >
    <link
      rel="stylesheet"
      href="//path/to/node_modules/clsp-videojs-plugin/dist/clsp-videojs-plugin.min.css"
    >
    <script
      type="text/javascript"
      src="//cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.0.0/polyfill.min.js"
    ></script>
    <script
      type="text/javascript"
      src="//vjs.zencdn.net/6.7.1/video.min.js"
    ></script>
  </head>
  <body>
    <video
      id="my-video"
      class="video-js vjs-default-skin"
      controls
    >
      <source
        src="clsps://192.168.1.1/ViconHQ"
        type="video/mp4; codecs='avc1.42E01E'"
      />
    </video>

    <script
      type="text/javascript"
      src="//path/to/node_modules/clsp-videojs-plugin/dist/clsp-videojs-plugin.min.js"
    ></script>
    <script type="text/javascript">
      var player = videojs('my-video');

      player.clsp();
    </script>
  </body>
</html>
```

### Webpack and ES6

When using with Webpack, you will need to register the global `videojs` in your `webpack.config.js` file:

```javascript
{
  // ...
  resolve: {
    alias: {
      // @see - https://github.com/videojs/videojs-contrib-hls/issues/600#issuecomment-321281442
      'video.js$': 'video.js/dist/video.cjs.js',
    },
  },
}
```

In your code, you will need to set videojs on the window prior to requiring this plugin:

```javascript
/**
 * initialize videojs properly as a singleton that is
 * available on the window, as is the current best practice.
 *
 * @see - https://github.com/videojs/videojs-contrib-hls/issues/600#issuecomment-321281442
 */
import videojs from 'video.js';

window.videojs = videojs;

// Need to use require rather than import here because we have to execute
// the window.videojs assignment before these are requried... or do we?
require('videojs-mse-over-clsp');

const player = videojs('my-video');

player.clsp();
```

## License

See the LICENSE file at the root of this repository.


## Resources

* [https://www.skylinenet.net/](https://www.skylinenet.net/)
* [https://github.com/videojs/video.js](https://github.com/videojs/video.js)
* [https://github.com/videojs/videojs-contrib-hls](https://github.com/videojs/videojs-contrib-hls)
* [https://github.com/video-dev/hls.js](https://github.com/video-dev/hls.js)
* [https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API)
* [https://developers.google.com/web/updates/2017/07/chrome-61-media-updates](https://developers.google.com/web/updates/2017/07/chrome-61-media-updates)
