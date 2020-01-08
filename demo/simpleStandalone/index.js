'use strict';

function play () {
  if (!window.iov) {
    return;
  }

  window.iov.play();
}

function stop () {
  if (!window.iov) {
    return;
  }

  window.iov.stop();
}

function fullscreen () {
  if (!window.iov) {
    return;
  }

  window.iov.toggleFullscreen();
}

function destroy () {
  if (!window.iov) {
    return;
  }

  window.iovCollection.remove(window.iov.id);
  window.iov = null;
}

function changeSrc () {
  var streamUrl = document.getElementById('stream-src').value;

  window.iov.changeSrc(streamUrl);
}

function initialize () {
  document.getElementById('version').innerHTML += window.clspUtils.version;

  var element = document.getElementById('my-video');
  var url = element.children[0].getAttribute('src');

  document.getElementById('stream-src').value = url;

  window.iovCollection = window.IovCollection.asSingleton();

  window.iovCollection.create(url, element)
    .then(function (iov) {
      window.iov = iov;
      iov.play();
    })
    .catch(function (error) {
      document.getElementById('browser-not-supported').style.display = 'block';
      document.getElementById('my-video').style.display = 'none';
      console.error(error);
    });
}

window.clspControls = {
  play: play,
  stop: stop,
  fullscreen: fullscreen,
  destroy: destroy,
  changeSrc: changeSrc,
  initialize: initialize,
};
