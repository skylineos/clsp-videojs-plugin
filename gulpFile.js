'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ lazy: true });
const runSequence = require('run-sequence');
const webpack = require('webpack');
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

gulp.task('build-dev', () => webpackBuild('./webpack.config'));

gulp.task('build-prod', () => webpackBuild('./webpack.config.prod'));

gulp.task('build', () => asPromise(
  runSequence,
  'pre-build',
  'build-dev',
  'build-prod'
));
