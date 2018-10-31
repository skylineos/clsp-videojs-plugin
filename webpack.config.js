'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const packageJson = require('./package.json');

const pluginName = packageJson.name;
const conduitName = 'clspConduit.generated';

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = () => [
  {
    mode: 'development',
    devtool: 'source-map',
    name: pluginName,
    entry: {
      // @see - https://github.com/webpack-contrib/webpack-serve/issues/27
      [pluginName]: [`./src/js/${pluginName}.js`],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
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
    externals: {
      'video.js': 'videojs',
    },
    plugins: [
      extractSass,
    ],
  },
  {
    mode: 'development',
    name: conduitName,
    entry: {
      // @see - https://github.com/webpack-contrib/webpack-serve/issues/27
      [conduitName]: [`./src/js/conduit/${conduitName}.js`],
    },
    output: {
      filename: '[name].min.js',
      path: path.resolve(__dirname, 'src/js/conduit'),
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
      ],
    },
  },
  {
    mode: 'development',
    devtool: 'source-map',
    name: 'demo',
    entry: {
      // @see - https://github.com/webpack-contrib/webpack-serve/issues/27
      demo: [path.resolve(__dirname, 'demo', 'src', 'js', 'demo.js')],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
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
          // Loader for the style fonts
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'url-loader',
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
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src', 'js'),
        '~styles': path.resolve(__dirname, 'src', 'styles'),
        '~root': __dirname,
      },
    },
    plugins: [
      extractSass,
      new WriteFilePlugin(),
    ],
  },
];
