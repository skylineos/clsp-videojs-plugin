#!/usr/bin/env node
'use strict';

const path = require('path');
const serve = require('webpack-serve');
const webpack = require('webpack');

const devConfigs = require('../webpack.dev');

const host = process.env.hasOwnProperty('HOST')
  ? process.env.HOST
  : '0.0.0.0';

const port = process.env.hasOwnProperty('PORT')
  ? parseInt(process.env.PORT, 10)
  : 9999;

serve({}, {
  compiler: webpack(devConfigs()),
  port,
  host,
  content: path.join(__dirname, '..'),
  clipboard: false,
  hotClient: false,
});
