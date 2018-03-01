'use strict';

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = require('./webpack.config');

const uglifyPlugin = new UglifyJsPlugin({
  uglifyOptions: {
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
  },
});

function minifyConfig (config) {
  config.output.filename = '[name].min.js';

  if (!config.plugins) {
    config.plugins = [];
  }

  config.plugins.push(uglifyPlugin);
}

minifyConfig(config[0]);
minifyConfig(config[1]);

module.exports = config;
