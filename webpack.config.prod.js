'use strict';

const config = require('./webpack.config.dev');
const webpack = require('webpack');

// Minify
config[0].output.filename = 'videojs-clsp.min.js'
config[0].plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    dead_code: true,
    conditionals: true,
    // @see - https://github.com/videojs/videojs-contrib-hls/issues/600#issuecomment-332627109
    comparisons: false,
    evaluate: true,
    unused: true,
    if_return: true,
    join_vars: true,
    warnings: true,
  },
  output: {
    comments: false,
  },
}));

module.exports = config;
