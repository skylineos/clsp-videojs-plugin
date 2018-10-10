'use strict';

const gulp = require('gulp');
const webpack = require('webpack');

const runSequence = require('run-sequence');
const jsStringEscape = require('js-string-escape');
const fs = require('fs');

function asPromise (fn, ...args) {
  return new Promise((resolve, reject) => {
    Reflect.apply(fn, undefined, [...args, (err, ...cbArgs) => {
      if (err) {
        return reject(err);
      }

      if (cbArgs.length === 0) {
        return resolve();
      }

      if (cbArgs.length === 1) {
        return resolve(cbArgs[0]);
      }

      resolve(cbArgs);
    }]);
  });
}

// @see - https://webpack.js.org/api/node/#error-handling
function webpackBuild (pathToConfig) {
  const webpackConfig = require(pathToConfig)();

  return asPromise(webpack, webpackConfig)
    .then((stats) => {
      const info = stats.toJson();

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }

      if (stats.hasErrors()) {
        console.error(info.errors);

        throw new Error('Webpack build failed!');
      }

      console.log(`${stats.toString()}\n`);
    })
    .catch((err) => {
      console.error(err.stack || err);

      if (err.details) {
        console.error(err.details);
      }

      throw err;
    });
}

gulp.task('generate-clsp-conduit', async () => {
  // Construct the iframe contents
  const mqttLibrary = fs.readFileSync('./node_modules/paho-mqtt/paho-mqtt-min.js', { encoding: 'utf8' });
  const clspRouterLibrary = fs.readFileSync('./src/js/conduit/clspRouter.js', { encoding: 'utf8' });
  const iframeContents = jsStringEscape(mqttLibrary + '\n' + clspRouterLibrary);

  // Insert the iframe contents into the clsp conduit library
  const clspConduitLibraryTemplate = fs.readFileSync('./src/js/conduit/clspConduit.js', { encoding: 'utf8' });
  const clspConduitLibrary = clspConduitLibraryTemplate.replace("__IFRAME_CODE__", iframeContents);

  // Put the resulting library code in /src
  fs.writeFileSync('src/js/conduit/clspConduit.generated.js', clspConduitLibrary);
});

gulp.task('build-dev', () => webpackBuild('./webpack.config'));

gulp.task('build-prod', () => webpackBuild('./webpack.config.prod'));

gulp.task('build', () => asPromise(
  runSequence,
  'generate-clsp-conduit',
  'build-dev',
  'build-prod'
));
