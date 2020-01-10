'use strict';

var textAreaId = 'stream-src';
var videoElementId = 'my-video';

var durationDisplayInterval = null;
var tourInterval = null;
var currentTourIndex = 0;

function previous () {
  if (currentTourIndex === 0) {
    currentTourIndex = urls.length - 2;
  }
  else if (currentTourIndex === 1) {
    currentTourIndex = urls.length - 1;
  }
  else {
    currentTourIndex -= 2;
  }

  window.clspControls.next(true);
}

function next (resetTimer) {
  // Start the tour list over again once the end of the stream list is reached
  if (currentTourIndex === window.urls.length) {
    currentTourIndex = 0;
  }

  var url = window.urls[currentTourIndex];

  // console.log('Tour at index ' + currentTourIndex + ', changing url to ' + url);

  currentTourIndex++;

  iov.changeSrc(url, function () {
    window.document.getElementById('current-stream-url').innerHTML = url + ' (' + currentTourIndex + '/' + window.urls.length + ')';
  });

  if (resetTimer) {
    clearInterval(tourInterval);

    tourInterval = setInterval(() => {
      window.clspControls.next();
    }, 10 * 1000);
  }
}

function resumeTour (force, wait) {
  if (!force && tourInterval) {
    return;
  }

  // console.log('resuming tour at index ' + currentTourIndex);

  if (!wait) {
    window.clspControls.next();
  }

  tourInterval = setInterval(() => {
    window.clspControls.next();
  }, 10 * 1000);
}

function pauseTour () {
  if (!tourInterval) {
    return;
  }

  // console.log('pausing tour at index ' + (currentTourIndex - 1));

  clearInterval(tourInterval);

  tourInterval = null;
}

function fullscreen () {
  if (!window.iov) {
    return;
  }

  // console.log('toggling fullscreen');

  window.iov.toggleFullscreen();
}

function destroy () {
  if (!window.iov) {
    return;
  }

  // console.log('destroying...');

  window.clspControls.pauseTour();
  window.document.getElementById('current-stream-url').innerHTML = '';

  window.iovCollection.remove(window.iov.id);
  window.iov = null;
}

function _getTourList () {
  window.urls = document.getElementById(textAreaId).value
    .split('\n')
    .map((url) => url.trim())
    .filter((url) => Boolean(url));

  return window.urls;
}

function resetTour () {
  window.clspControls.pauseTour();

  _getTourList();

  currentTourIndex = window.urls.length;

  window.clspControls.resumeTour(true);
}

function initialize () {
  document.getElementById('version').innerHTML += window.clspUtils.version;

  var date = new Date();

  document.getElementById('tourStartTime').innerText = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  var pageLoadStartTime = Date.now();

  if (durationDisplayInterval) {
    clearInterval(durationDisplayInterval);
  }

  durationDisplayInterval = setInterval(() => {
    var secondsElapsedSinceStart = (Date.now() - pageLoadStartTime) / 1000;

    var displayHours = Math.floor(secondsElapsedSinceStart / 60 / 60);
    var displayMinutes = Math.floor(secondsElapsedSinceStart / 60) - (displayHours * 60);
    var displaySeconds = Math.floor(secondsElapsedSinceStart) - (displayHours * 60 * 60) - (displayMinutes * 60);


    document.getElementById('tourDuration').innerText = displayHours + ' hours ' + displayMinutes + ' minutes ' + displaySeconds + ' seconds';

    if (window.performance && window.performance.memory) {
      document.getElementById('tourHeapSizeLimit').innerText = humanize.filesize(window.performance.memory.jsHeapSizeLimit);
      document.getElementById('tourTotalHeapSize').innerText = humanize.filesize(window.performance.memory.totalJSHeapSize);
      document.getElementById('tourUsedHeapSize').innerText = humanize.filesize(window.performance.memory.usedJSHeapSize);
    }
  }, 1000);

  _getTourList();

  currentTourIndex = window.urls.length;

  window.iovCollection = window.IovCollection.asSingleton();

  window.iovCollection.create(videoElementId, window.urls[0])
    .then(function (iov) {
      window.iov = iov;
      window.clspControls.resumeTour();
    })
    .catch(function (error) {
      document.getElementById('browser-not-supported').style.display = 'block';
      document.getElementById(videoElementId).style.display = 'none';
      console.error(error);
    });
}

window.clspControls = {
  resumeTour: resumeTour,
  pauseTour: pauseTour,
  previous: previous,
  next: next,
  destroy: destroy,
  fullscreen: fullscreen,
  resetTour: resetTour,
  initialize: initialize,
};
