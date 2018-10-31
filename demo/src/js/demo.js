'use strict';

import '../styles/demo.scss';

import 'babel-polyfill';

import $ from 'jquery';
import videojs from 'video.js';
import moment from 'moment';
import 'videojs-errors';

import packageJson from '~root/package.json';

// import ClspPlugin from '~/plugin/ClspPlugin';
// import IOV from '~/iov/IOV';
// import Conduit from '~/iov/Conduit';
// import IOVPlayer from '~/iov/Player';
// import MediaSourceWrapper from '~/mse/MediaSourceWrapper';
// import SourceBufferWrapper from '~/mse/SourceBufferWrapper';

window.videojs = videojs;
window.CLSP_DEMO_VERSION = packageJson.version;

const defaultWallUrls = [
  'clsp://172.28.12.248/testpattern',
  'clsp://172.28.12.247/testpattern',
  'clsps://sky-qa-dionysus.qa.skyline.local/testpattern',
  'clsp://172.28.12.57:9001/FairfaxVideo0520',
  'clsp://172.28.12.57:9001/40004',
];

const defaultTourUrls = [
  ...defaultWallUrls,
];

let wallInterval = null;
let tourInterval = null;

const wallPlayers = [];
const tourPlayers = [];

function destroyAllWallPlayers () {
  for (let i = 0; i < wallPlayers.length; i++) {
    const player = wallPlayers[i];

    player.dispose();
  }
}

function destroyAllTourPlayers () {
  for (let i = 0; i < tourPlayers.length; i++) {
    const player = tourPlayers[i];

    player.dispose();
  }
}

function initializeWall () {
  function createVideoPlayer (index, playerOptions) {
    const videoId = `wall-video-${index}`;

    const $container = $('#videowall')
      .append(document.getElementById('wall-video-template').innerHTML)
      .find('#wall-container-null');

    const $video = $container.find('video');

    $video.attr('id', videoId);

    $container.attr('id', `wall-container-${index}`);
    $container.find('.video-stream .index').text(index);
    $container.find('.video-stream .url').text(playerOptions.sources[0].src);
    $container.find('.video-stream .close').on('click', () => {
      $('#wallTotalVideos').text(parseInt($('#wallTotalVideos').text(), 10) - 1);
      player.dispose();
    });

    const $videoMetrics = $container.find('.wall-video-metrics');

    const metricTypes = [
      // ClspPlugin().METRIC_TYPES,
      // IOV.METRIC_TYPES,
      // Conduit.METRIC_TYPES,
      // IOVPlayer.METRIC_TYPES,
      // MediaSourceWrapper.METRIC_TYPES,
      // SourceBufferWrapper.METRIC_TYPES,
    ];

    for (let i = 0; i < metricTypes.length; i++) {
      const metricType = metricTypes[i];

      for (let j = 0; j < metricType.length; j++) {
        const text = metricType[j];
        const name = text.replace(new RegExp(/\./, 'g'), '-');
        const $metric = $('<div/>', { class: `metric ${name}` });

        $metric.append($('<span/>', { class: 'value' }));
        $metric.append($('<span/>', {
          class: 'type',
          title: text,
          text,
        }));

        $videoMetrics.append($metric);
      }
    }

    const player = window.videojs(videoId, playerOptions);

    wallPlayers.push(player);

    const tech = player.clsp();

    tech.on('metric', (event, { metric }) => {
      $videoMetrics.find(`.${metric.type.replace(new RegExp(/\./, 'g'), '-')} .value`)
        .attr('title', metric.value)
        .html(metric.value);
    });
  }

  const $controls = $('.wall .controls');
  const $controlsToggle = $('#wall-controls-toggle');

  function toggleControls () {
    $controlsToggle.attr('data-state') === 'hidden'
      ? showControls()
      : hideControls();
  }

  function showControls () {
    $controls.show();
    $controlsToggle.attr('data-state', 'shown');
    $controlsToggle.text('Hide Controls');
  }

  function hideControls () {
    $controls.hide();
    $controlsToggle.attr('data-state', 'hidden');
    $controlsToggle.text('Show Controls');
  }

  function setMetricsVisibility () {
    if ($('#wallShowMetrics').prop('checked')) {
      $('.wall-video-metrics').show();
    }
    else {
      $('.wall-video-metrics').hide();
    }
  }

  function onclick () {
    destroyAllWallPlayers();

    const urlList = window.localStorage.getItem('skyline.clspPlugin.wallUrls').split('\n');
    const timesToReplicate = window.localStorage.getItem('skyline.clspPlugin.wallReplicate');

    let videoIndex = 0;

    for (let i = 0; i < timesToReplicate; i++) {
      for (let j = 0; j < urlList.length; j++) {
        const playerOptions = {
          autoplay: true,
          muted: true,
          preload: 'auto',
          poster: 'skyline_logo.png',
          controls: true,
          sources: [
            {
              src: urlList[j % urlList.length],
              type: "video/mp4; codecs='avc1.42E01E'",
            },
          ],
          clsp: {
            enableMetrics: $('#wallEnableMetrics').prop('checked'),
          },
        };

        createVideoPlayer(videoIndex, playerOptions);

        videoIndex++;
      }
    }

    const now = Date.now();

    document.getElementById('videowall').style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(videoIndex + 1))}, 1fr)`;
    $('#wallTotalVideos').text(videoIndex);
    $('#wallStartTime').text(moment(now).format('MMMM Do YYYY, h:mm:ss a'));

    if (wallInterval) {
      window.clearInterval(wallInterval);
    }

    $('#wallDuration').text('0 hours 0 minutes 0 seconds');

    wallInterval = setInterval(() => {
      const hoursFromStart = Math.floor(moment.duration(Date.now() - now).asHours());
      const minutesFromStart = Math.floor(moment.duration(Date.now() - now).asMinutes()) - (hoursFromStart * 60);
      const secondsFromStart = Math.floor(moment.duration(Date.now() - now).asSeconds()) - (hoursFromStart * 60 * 60) - (minutesFromStart * 60);

      $('#wallDuration').text(`${hoursFromStart} hours ${minutesFromStart} minutes ${secondsFromStart} seconds`);
    }, 1000);

    hideControls();
    setMetricsVisibility();
  }

  $('#wallCreate').click(onclick);
  $('#wall-controls-toggle').click(toggleControls);
  $('#wallShowMetrics').on('change', setMetricsVisibility);

  const $wallUrls = $('#wallUrls');

  if (!window.localStorage.getItem('skyline.clspPlugin.wallUrls')) {
    window.localStorage.setItem('skyline.clspPlugin.wallUrls', defaultWallUrls.join('\n'));
  }

  $wallUrls.val(window.localStorage.getItem('skyline.clspPlugin.wallUrls'));

  $wallUrls.on('change', () => {
    window.localStorage.setItem('skyline.clspPlugin.wallUrls', $wallUrls.val().trim());
  });

  const $wallReplicate = $('#wallReplicate');

  if (!window.localStorage.getItem('skyline.clspPlugin.wallReplicate')) {
    window.localStorage.setItem('skyline.clspPlugin.wallReplicate', 1);
  }

  $wallReplicate.val(window.localStorage.getItem('skyline.clspPlugin.wallReplicate'));

  $wallReplicate.on('change', () => {
    window.localStorage.setItem('skyline.clspPlugin.wallReplicate', $wallReplicate.val().trim());
  });
}

function initializeTour () {
  function createVideoPlayer (index, playerOptions) {
    const videoId = `tour-video-${index}`;

    const $container = $('#tourwall')
      .append(document.getElementById('tour-video-template').innerHTML)
      .find('#tour-container-null');

    const $video = $container.find('video');

    $video.attr('id', videoId);

    $container.attr('id', `tour-container-${index}`);
    $container.find('.video-stream .index').text(index);
    $container.find('.video-stream .url').text(playerOptions.sources[0].src);
    $container.find('.video-stream .close').on('click', () => {
      $('#tourTotalVideos').text(parseInt($('#tourTotalVideos').text(), 10) - 1);
      player.dispose();
    });

    const $videoMetrics = $container.find('.tour-video-metrics');

    const metricTypes = [
      // ClspPlugin().METRIC_TYPES,
      // IOV.METRIC_TYPES,
      // Conduit.METRIC_TYPES,
      // IOVPlayer.METRIC_TYPES,
      // MediaSourceWrapper.METRIC_TYPES,
      // SourceBufferWrapper.METRIC_TYPES,
    ];

    for (let i = 0; i < metricTypes.length; i++) {
      const metricType = metricTypes[i];

      for (let j = 0; j < metricType.length; j++) {
        const text = metricType[j];
        const name = text.replace(new RegExp(/\./, 'g'), '-');
        const $metric = $('<div/>', { class: `metric ${name}` });

        $metric.append($('<span/>', { class: 'value' }));
        $metric.append($('<span/>', {
          class: 'type',
          title: text,
          text,
        }));

        $videoMetrics.append($metric);
      }
    }

    const player = window.videojs(videoId, playerOptions);

    tourPlayers.push(player);

    player.on('changesrc', (event, source) => {
      $container.find('.video-stream .url').text(source.src);
    });

    const tech = player.clsp();

    tech.on('metric', (event, { metric }) => {
      $videoMetrics.find(`.${metric.type.replace(new RegExp(/\./, 'g'), '-')} .value`)
        .attr('title', metric.value)
        .html(metric.value);
    });
  }

  const $controls = $('.tour .controls');
  const $controlsToggle = $('#tour-controls-toggle');

  function toggleControls () {
    $controlsToggle.attr('data-state') === 'hidden'
      ? showControls()
      : hideControls();
  }

  function showControls () {
    $controls.show();
    $controlsToggle.attr('data-state', 'shown');
    $controlsToggle.text('Hide Controls');
  }

  function hideControls () {
    $controls.hide();
    $controlsToggle.attr('data-state', 'hidden');
    $controlsToggle.text('Show Controls');
  }

  function setMetricsVisibility () {
    const $tourMetrics = $('.tour-video-metrics');

    if ($('#tourShowMetrics').prop('checked')) {
      $tourMetrics.show();
    }
    else {
      $tourMetrics.hide();
    }
  }

  function onclick () {
    destroyAllTourPlayers();

    const urlList = window.localStorage.getItem('skyline.clspPlugin.tourUrls').split('\n');
    const timesToReplicate = window.localStorage.getItem('skyline.clspPlugin.tourReplicate');
    const tourDurationValue = window.localStorage.getItem('skyline.clspPlugin.tourDurationValue');

    let videoIndex = 0;

    for (let i = 0; i < timesToReplicate; i++) {
      let sources = [];
      const type = "video/mp4; codecs='avc1.42E01E'";

      for (let j = 0; j < urlList.length; j++) {
        sources.push({
          src: urlList[j],
          type,
        });
      }

      const playerOptions = {
        autoplay: true,
        muted: true,
        preload: 'auto',
        poster: 'skyline_logo.png',
        controls: true,
        sources,
        clsp: {
          tourDuration: tourDurationValue * 1000,
          enableMetrics: $('#tourEnableMetrics').prop('checked'),
        },
      };

      createVideoPlayer(videoIndex, playerOptions);

      videoIndex++;
    }

    const now = Date.now();

    document.getElementById('tourwall').style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(timesToReplicate))}, 1fr)`;
    document.getElementById('tourwall').style.gridTemplateRows = `repeat(${Math.ceil(Math.sqrt(timesToReplicate))}, 1fr)`;

    $('#tourTotalVideos').text(`${videoIndex} x ${urlList.length} (${videoIndex * urlList.length})`);
    $('#tourStartTime').text(moment(now).format('MMMM Do YYYY, h:mm:ss a'));

    if (tourInterval) {
      window.clearInterval(tourInterval);
    }

    $('#tourDuration').text('0 hours 0 minutes 0 seconds');

    tourInterval = setInterval(() => {
      const hoursFromStart = Math.floor(moment.duration(Date.now() - now).asHours());
      const minutesFromStart = Math.floor(moment.duration(Date.now() - now).asMinutes()) - (hoursFromStart * 60);
      const secondsFromStart = Math.floor(moment.duration(Date.now() - now).asSeconds()) - (hoursFromStart * 60 * 60) - (minutesFromStart * 60);

      $('#tourDuration').text(`${hoursFromStart} hours ${minutesFromStart} minutes ${secondsFromStart} seconds`);
    }, 1000);

    hideControls();
    setMetricsVisibility();
  }

  $('#tourCreate').click(onclick);
  $('#tour-controls-toggle').click(toggleControls);
  $('#tourShowMetrics').on('change', setMetricsVisibility);

  const $tourUrls = $('#tourUrls');

  if (!window.localStorage.getItem('skyline.clspPlugin.tourUrls')) {
    window.localStorage.setItem('skyline.clspPlugin.tourUrls', defaultTourUrls.join('\n'));
  }

  $tourUrls.val(window.localStorage.getItem('skyline.clspPlugin.tourUrls'));

  $tourUrls.on('change', () => {
    window.localStorage.setItem('skyline.clspPlugin.tourUrls', $tourUrls.val().trim());
  });

  const $tourReplicate = $('#tourReplicate');

  if (!window.localStorage.getItem('skyline.clspPlugin.tourReplicate')) {
    window.localStorage.setItem('skyline.clspPlugin.tourReplicate', 12);
  }

  $tourReplicate.val(window.localStorage.getItem('skyline.clspPlugin.tourReplicate'));

  $tourReplicate.on('change', () => {
    window.localStorage.setItem('skyline.clspPlugin.tourReplicate', $tourReplicate.val().trim());
  });

  const $tourDurationValue = $('#tourDurationValue');

  if (!window.localStorage.getItem('skyline.clspPlugin.tourDurationValue')) {
    window.localStorage.setItem('skyline.clspPlugin.tourDurationValue', 10);
  }

  $tourDurationValue.val(window.localStorage.getItem('skyline.clspPlugin.tourDurationValue'));

  $tourDurationValue.on('change', () => {
    window.localStorage.setItem('skyline.clspPlugin.tourDurationValue', $tourDurationValue.val().trim());
  });
}

$(() => {
  const pageTitle = `CLSP ${window.CLSP_DEMO_VERSION} Demo Page`;
  document.title = pageTitle;
  $('#page-title-version').html(window.CLSP_DEMO_VERSION);

  window.HELP_IMPROVE_VIDEOJS = false;

  initializeWall();
  initializeTour();
});
