'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ lazy: true });
const runSequence = require('run-sequence');
const webpack = require('webpack');
const jsStringEscape = require('js-string-escape');
const fs = require('fs');


function webpackBuild (pathToConfig, done) {
  const webpackConfig = require(pathToConfig);

  webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw new $.util.PluginError('webpack', err);
    }

    console.log(`${stats.toString()}\n`);

    done();
  });
}




gulp.task('build-dev', (done) => {
  webpackBuild('./webpack.config.dev', done);
});

gulp.task('build-prod', (done) => {
  webpackBuild('./webpack.config.prod', done);
});

gulp.task('build', (done) => {
  fs.readFile('src/iframe.html', (err,iframeCode_)=>{
    if (err) throw err; 
    var iframeCode = iframeCode_.toString('utf8');

    fs.readFile('src/mqttConduit.template', (err, mqttConduitCode_)=>{
      if (err) throw err; 
      var mqttConduitCode = mqttConduitCode_.toString('utf8'); 

      var token = "__IFRAME_CODE__";
      var frame_code = jsStringEscape(iframeCode);
      var code = mqttConduitCode.replace(token,frame_code);

      fs.writeFile('src/mqttConduit.js', code, (err)=>{
        if (err) throw err; 

        // src/mqttConduit.js generated
        runSequence(
          'build-dev',
          'build-prod'
        );
         
      });    
    });
  });      

});
