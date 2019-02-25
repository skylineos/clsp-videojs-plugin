#!/usr/bin/env node
'use strict';

const webpack = require('webpack');

const devConfig = require('../webpack.config')();
const prodConfig = require('../webpack.config.prod')();

// @see - https://webpack.js.org/api/node/
webpack([
  ...devConfig,
  ...prodConfig,
], (err, stats) => {
  if (err) {
    console.error(err.stack || err);

    if (err.details) {
      console.error(err.details);
    }

    process.exit(1);
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }

  process.stdout.write(stats.toString() + '\n');

  process.exit(0);
});
