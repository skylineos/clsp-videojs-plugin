'use strict';

var textAreaId = 'stream-src';
var videoElementId = 'my-video';

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

  console.log('Tour at index ' + currentTourIndex + ', changing url to ' + url);

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

  console.log('resuming tour at index ' + currentTourIndex);

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

  console.log('pausing tour at index ' + (currentTourIndex - 1));

  clearInterval(tourInterval);

  tourInterval = null;
}

function fullscreen () {
  if (!window.iov) {
    return;
  }

  console.log('toggling fullscreen');

  window.iov.toggleFullscreen();
}

function destroy () {
  if (!window.iov) {
    return;
  }

  console.log('destroying...');

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
