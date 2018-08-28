'use strict';

const gulp = require('gulp');
const webpack = require('webpack');

const rm = require('gulp-rm');
const runSequence = require('run-sequence');

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
  return gulp
    .src('dist/**/*', { read: false })
    .pipe(rm());
});

gulp.task('build-dev', () => webpackBuild('./webpack.config'));

gulp.task('build-prod', () => webpackBuild('./webpack.config.prod'));

gulp.task('build', () => asPromise(
  runSequence,
  'pre-build',
  'build-dev',
  'build-prod'
));
