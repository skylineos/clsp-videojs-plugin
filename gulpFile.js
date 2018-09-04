'use strict';

const gulp = require('gulp');
const webpack = require('webpack');
const serve = require('webpack-serve');

const rm = require('gulp-rm');
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

function webpackBuild (pathToConfig) {
  const webpackConfig = require(pathToConfig);

  return asPromise(webpack, webpackConfig)
    .then((stats) => {
      console.log(`${stats.toString()}\n`);
    })
    .catch((err) => {
      throw err;
    });
}

gulp.task('pre-build', () => {
  return gulp.src('dist/**/*', { read: false })
    .pipe(rm());
});

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

gulp.task('start-dev', (done) => {
  const webpackConfig = require('./webpack.config');

  serve({}, {
    compiler: webpack(webpackConfig),
    port: 9999,
    content: __dirname,
    clipboard: false,
    hotClient: false,
  });
});

gulp.task('build', () => asPromise(
  runSequence,
  'pre-build',
  'generate-clsp-conduit',
  'build-dev',
  'build-prod'
));
