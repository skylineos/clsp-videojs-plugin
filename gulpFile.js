'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ lazy: true });
const runSequence = require('run-sequence');
const webpack = require('webpack');
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
      throw new $.util.PluginError('webpack', err);
    });
}

gulp.task('pre-build', () => {
  return gulp.src('dist/**/*', { read: false })
    .pipe($.rm())
});

gulp.task('generate-clsp-conduit', async () => {
  // Construct the iframe contents
  const mqttLibrary = fs.readFileSync('./node_modules/paho-mqtt/mqttws31-min.js', { encoding: 'utf8' });
  const clspRouterLibrary = fs.readFileSync('./src/clspRouter.js', { encoding: 'utf8' });
  const iframeContents = jsStringEscape(mqttLibrary + '\n' + clspRouterLibrary);

  // Insert the iframe contents into the clsp conduit library
  const clspConduitLibraryTemplate = fs.readFileSync('./src/clspConduit.js', { encoding: 'utf8' });
  const clspConduitLibrary = clspConduitLibraryTemplate.replace("__IFRAME_CODE__", iframeContents);

  // Put the resulting library code in /src
  fs.writeFileSync('src/clspConduit.generated.js', clspConduitLibrary);
});

gulp.task('build-dev', () => webpackBuild('./webpack.config'));

gulp.task('build-prod', () => webpackBuild('./webpack.config.prod'));

gulp.task('build', () => asPromise(
  runSequence,
  'pre-build',
  'generate-clsp-conduit',
  'build-dev',
  'build-prod'
));
