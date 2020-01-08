function onPlay () {
  if (!window.iov) {
    return;
  }

  window.iov.play();
}

function onStop () {
  if (!window.iov) {
    return;
  }

  window.iov.stop();
}

function onFullscreen () {
  if (!window.iov) {
    return;
  }

  window.iov.toggleFullscreen();
}

function onDestroy() {
  if (!window.iov) {
    return;
  }

  window.iovCollection.remove(window.iov.id);
  window.iov = null;
}

function main () {
  document.getElementById('version').innerHTML += window.clspUtils.version;

  var element = document.getElementById('my-video');
  var url = element.children[0].getAttribute('src');

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
