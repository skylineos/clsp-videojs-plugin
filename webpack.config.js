'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const packageJson = require('./package.json');

const name = packageJson.name;
const destination = path.resolve(__dirname, 'dist');

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = [
  {
    name,
    entry: {
      [name]: `./src/js/${name}.js`,
    },
    output: {
      filename: '[name].js',
      path: destination,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader?cacheDirectory=true',
          options: {
            plugins: [
              'transform-object-rest-spread',
              'transform-class-properties',
            ],
            presets: [['env', { modules: false }]],
          },
        },
        {
          test: /\.scss$/,
          use: extractSass.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader' },
              { loader: 'sass-loader' },
            ],
          }),
        },
      ],
    },
    plugins: [
      extractSass,
    ],
    externals: {
      'video.js': 'videojs',
    },
    devServer: {
      contentBase: path.join(__dirname, 'demo'),
      compress: true,
      port: 9999,
    },
  },
];
