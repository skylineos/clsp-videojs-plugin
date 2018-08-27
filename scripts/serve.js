#!/usr/bin/env node

const path = require('path');
const serve = require('webpack-serve');
const webpack = require('webpack');

const webpackConfig = require('../webpack.config');

const host = process.env.hasOwnProperty('HOST')
  ? process.env.HOST
  : 'localhost';

const port = process.env.hasOwnProperty('PORT')
  ? parseInt(process.env.PORT, 10)
  : 9999;

serve({}, {
  compiler: webpack(webpackConfig),
  port,
  host,
  content: path.join(__dirname, '..'),
  clipboard: false,
  hotClient: false,
});
