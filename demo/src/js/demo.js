'use strict';

import '../styles/demo.scss';

import $ from 'jquery';
import videojs from 'video.js';
import moment from 'moment';
import 'babel-polyfill';

import packageJson from '../../../package.json';

window.videojs = videojs;
window.CLSP_DEMO_VERSION = packageJson.version;

const defaultTourUrls = [
  'clsp://172.28.12.247/testpattern',
  'clsp://172.28.12.57:9001/FairfaxVideo0520',
  'clsp://172.28.12.57:9001/40004',
];

const defaultWallUrls = [
  'clsp://172.28.12.248/testpattern',
  'clsp://172.28.12.247/testpattern',
  'clsps://sky-qa-dionysus.qa.skyline.local/testpattern',
  'clsp://172.28.12.57:9001/FairfaxVideo0520',
  'clsp://172.28.12.57:9001/40004',
];

let wallInterval = null;

function initializeWall () {
  function setupVwallCell (eid, src, cellId) {
    const $container = $(`#${eid}`);

    if (!$container.length) {
      window.alert(`No match for element "${eid}"`);
      return;
    }

    const html = document.getElementById('cell').innerHTML
      .replace(/\$cellId/g, cellId)
      .replace('$src', src);

    $container.html(html);

    const cell = document.getElementById(`video-${cellId}`);

    if (!cell) {
      window.alert(`No match for element "video-${parseInt(cellId)}"`);
    }

    const player = window.videojs(cell);
    const tech = player.clsp();

    const $videoMetricContainer = $container.find('.video-metrics');

    tech.on('metric', (event, { metric }) => {
      $videoMetricContainer.find(`.${metric.type.replace(/\./g, '-')} .value`).html(metric.value);
    });
  }

  function onclick () {
    const urlList = window.localStorage.getItem('skyline.clspPlugin.wallUrls').split('\n');
    const timesToReplicate = $('#wallReplicate').val();

    let html = '<table>';
    let cellIndex = 0;

    for (let i = 0; i < timesToReplicate; i++) {
      for (let j = 0; j < urlList.length; j++) {
        if (cellIndex % 4 === 0) {
          html += '<tr>';
        }

        html += `<td id="vwcell-${cellIndex}"></td>`;

        if (cellIndex % 4 === 3) {
          html += '</tr>';
        }

        cellIndex++;
      }
    }

    if (urlList.length < 4) {
      html += '</tr>';
    }

    html += '</table>';

    $(`#videowall`).html(html);

    for (let i = 0; i < cellIndex; i++) {
      const urlListIndex = i % urlList.length;

      setupVwallCell(`vwcell-${i}`, urlList[urlListIndex], i);
    }

    const now = Date.now();

    $('#tourTotalVideos').html(`Total videos playing: ${cellIndex}`);
    $('#tourStartTime').html(`Time Started: ${moment(now).format('MMMM Do YYYY, h:mm:ss a')}`);

    if (wallInterval) {
      window.clearInterval(wallInterval);
    }

    wallInterval = setInterval(() => {
      const hoursFromStart = Math.floor(moment.duration(Date.now() - now).asHours());
      const minutesFromStart = Math.floor(moment.duration(Date.now() - now).asMinutes()) - (hoursFromStart * 60);
      const secondsFromStart = Math.floor(moment.duration(Date.now() - now).asSeconds()) - (hoursFromStart * 60 * 60) - (minutesFromStart * 60);

      $('#tourDuration').html(`This tour has been running for ${hoursFromStart} hours ${minutesFromStart} minutes ${secondsFromStart} seconds`);
    }, 1000);
  }

  if (!window.localStorage.getItem('skyline.clspPlugin.wallUrls')) {
    window.localStorage.setItem('skyline.clspPlugin.wallUrls', defaultWallUrls.join('\n'));
  }

  $('#walltest').click(onclick);

  const $showMetrics = $('#showMetrics');
  const $wallUrls = $('#wallUrls');

  $showMetrics.on('change', () => {
    if ($showMetrics.prop('checked')) {
      $('.video-metrics').show();
    }
    else {
      $('.video-metrics').hide();
    }
  });

  $wallUrls.val(window.localStorage.getItem('skyline.clspPlugin.wallUrls'));

  $wallUrls.on('change', () => {
    window.localStorage.setItem('skyline.clspPlugin.wallUrls', $wallUrls.val().trim());
  });
}

function initializeTours () {
  if (!window.localStorage.getItem('skyline.clspPlugin.tourUrls')) {
    window.localStorage.setItem('skyline.clspPlugin.tourUrls', defaultTourUrls.join('\n'));
  }

  const tour = {
    player: null,
    plist: [],
    interval: 10,
    counter: 0,
    timer: null,
  };

  $('#start-tour').on('click', () => {
    tour.interval = parseInt($('#tour-switch-interval').val());
    tour.plist = [];

    const tourUrls = window.localStorage.getItem('skyline.clspPlugin.tourUrls').split('\n');

    for (let i = 0; i < tourUrls.length; i++) {
      if (tourUrls[i].length > 0) {
        tour.plist.push(tourUrls[i]);
      }
    }

    if (tour.plist.length < 2) {
      window.alert('at least two source needed!');
      return;
    }

    $('#tour-first-source').attr('src', tour.plist[0]);

    tour.counter = 1;
    tour.player = null;

    if (tour.timer !== null) {
      clearInterval(tour.timer);
    }

    tour.player = window.videojs('#tour-video');
    tour.player.clsp(); // start playing first stream
    $('#now-playing').html(tour.plist[0]);

    tour.player.on('network-error', (evt, message) => {
      // console.log('!!!!! Handled network-error', evt);
      // console.log(message);
    });

    tour.timer = setInterval(() => {
      const url = tour.plist[tour.counter % tour.plist.length];
      $('#now-playing').html('switching to ' + tour.plist[tour.counter % tour.plist.length] + 'on next the h264 iframe');

      tour.counter += 1;
      // console.log('selected url', url, tour.plist);

      tour.player.trigger('changesrc', {
        eid: 'tour-video',
        url,
      });
    }, tour.interval * 1000);
  });

  const $tourUrls = $('#tour-list');

  $tourUrls.val(window.localStorage.getItem('skyline.clspPlugin.tourUrls'));

  $tourUrls.on('change', () => {
    window.localStorage.setItem('skyline.clspPlugin.tourUrls', $tourUrls.val());
  });
}

function initializeHeadless () {
  $('#headless_play').click(function () {
    ////////////////////////////////////////////////
    // headless play demo
    ////////////////////////////////////////////////
    var src = $('#headless_url').val();
    var iov_config = parseUrl(src);

    iov_config.videoElement = document.getElementById('headless');
    iov_config.appStart = function (iov) {
      iovPlayer = iov.player();
      iovPlayer.play('headless', iov_config.streamName,
        function () {
          console.log("first chunk of video received, remove poster if its playing");
        },
        function () {
          console.log("video received");
        }
      );
    };

    var IOV = videojs.getPlugin('clsp').clsp_IOV;
    var iov = new IOV(iov_config);
    iov.initialize();
    /////////////////////////////////////////////////
  });
}

$(() => {
  const pageTitle = `CLSP ${window.CLSP_DEMO_VERSION} Demo Page`;
  document.title = pageTitle;
  $('#page-title').html(pageTitle);

  initializeWall();
  initializeTours();
  initializeHeadless();
});
