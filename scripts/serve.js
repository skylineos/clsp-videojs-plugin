#!/usr/bin/env node

const path = require('path');
const serve = require('webpack-serve');
const webpack = require('webpack');

const devConfig = require('../webpack.config')();

const host = process.env.hasOwnProperty('HOST')
  ? process.env.HOST
  : '0.0.0.0';

const port = process.env.hasOwnProperty('PORT')
  ? parseInt(process.env.PORT, 10)
  : 9999;

serve({}, {
  compiler: webpack(devConfig),
  port,
  host,
  content: path.join(__dirname, '..'),
  clipboard: false,
  hotClient: false,
});
