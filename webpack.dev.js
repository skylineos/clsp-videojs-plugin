'use strict';

const webpack = require('webpack');
const webpackConfigs = require('./webpack.common');

const devHost = '0.0.0.0';
const devPort = '8080';

function devConfig (webpackConfig) {
  return {
    ...webpackConfig,
    mode: 'development',
    // cache: true,
    // watch: true,
    devtool: 'source-map',
    // devtool: 'eval-source-map',
    entry: {
      ...webpackConfig.entry,
      // @todo - these need to be documented
      [`${webpackConfig.name}.0`]: `webpack-dev-server/client?http://${devHost}:${devPort}`,
      // [`${webpackConfig.name}.1`]: 'webpack/hot/only-dev-server',
    },
    output: {
      ...webpackConfig.output,
      pathinfo: true,
    },
    plugins: [
      ...webpackConfig.plugins,
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
        },
      }),
      // new webpack.HotModuleReplacementPlugin(),
    ],
  };
}

module.exports = function () {
  return webpackConfigs().map((webpackConfig) => devConfig(webpackConfig)).reverse();
};
