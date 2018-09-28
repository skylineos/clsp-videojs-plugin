'use strict';

import '../styles/demo.scss';

import 'babel-polyfill';

import $ from 'jquery';
import videojs from 'video.js';
import moment from 'moment';
import 'videojs-errors';

import packageJson from '~root/package.json';

import ClspPlugin from '~/plugin/ClspPlugin';
import IOV from '~/iov/IOV';
import Conduit from '~/iov/Conduit';
import IOVPlayer from '~/iov/Player';
import MediaSourceWrapper from '~/mse/MediaSourceWrapper';
import SourceBufferWrapper from '~/mse/SourceBufferWrapper';

window.videojs = videojs;
window.CLSP_DEMO_VERSION = packageJson.version;

const defaultWallUrls = [
  'clsp://172.28.12.248/testpattern',
  'clsp://172.28.12.247/testpattern',
  'clsps://sky-qa-dionysus.qa.skyline.local/testpattern',
  'clsp://172.28.12.57:9001/FairfaxVideo0520',
  'clsp://172.28.12.57:9001/40004',
];

let wallInterval = null;

function initializeWall () {
  function createVideoPlayer (index, playerOptions) {
    const videoId = `video-${index}`;

    const $container = $('#videowall')
      .append(document.getElementById('video-template').innerHTML)
      .find('#container-null');

    const $video = $container.find('video');

    $video.attr('id', videoId);

    $container.attr('id', `container-${index}`);
    $container.find('.video-stream .index').text(index);
    $container.find('.video-stream .url').text(playerOptions.sources[0].src);
    $container.find('.video-stream .close').on('click', () => {
      $('#wallTotalVideos').text(parseInt($('#wallTotalVideos').text(), 10) - 1);
      player.dispose();
    });

    const $videoMetrics = $container.find('.video-metrics');

    const metricTypes = [
      ClspPlugin().METRIC_TYPES,
      IOV.METRIC_TYPES,
      Conduit.METRIC_TYPES,
      IOVPlayer.METRIC_TYPES,
      MediaSourceWrapper.METRIC_TYPES,
      SourceBufferWrapper.METRIC_TYPES,
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

    player.on('changesrc', (event, source) => {
      console.log(source.src)
      $container.find('.video-stream .url').text(source.src);
    });

    const tech = player.clsp();

    tech.on('metric', (event, { metric }) => {
      $videoMetrics.find(`.${metric.type.replace(new RegExp(/\./, 'g'), '-')} .value`)
        .attr('title', metric.value)
        .html(metric.value);
    });
  }

  function destroyAllPlayers () {
    const players = videojs.getAllPlayers();

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      player.dispose();
    }
  }

  function toggleControls () {
    $('#controls-toggle').attr('data-state') === 'hidden'
      ? showControls()
      : hideControls();
  }

  function showControls () {
    const $controls = $('.wall .controls');
    const $controlsToggle = $('#controls-toggle');

    $controls.show();
    $controlsToggle.attr('data-state', 'shown');
    $controlsToggle.text('Hide Controls');
  }

  function hideControls () {
    const $controls = $('.wall .controls');
    const $controlsToggle = $('#controls-toggle');

    $controls.hide();
    $controlsToggle.attr('data-state', 'hidden');
    $controlsToggle.text('Show Controls');
  }

  function setMetricsVisibility () {
    if ($('#showMetrics').prop('checked')) {
      $('.video-metrics').show();
    }
    else {
      $('.video-metrics').hide();
    }
  }

  function onclick () {
    destroyAllPlayers();

    const urlList = window.localStorage.getItem('skyline.clspPlugin.wallUrls').split('\n');
    const timesToReplicate = $('#wallReplicate').val();

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
          tourDuration: $('#tourDuration').val() * 1000,
          enableMetrics: $('#enableMetrics').prop('checked'),
        },
      };

      createVideoPlayer(videoIndex, playerOptions);

      videoIndex++;
    }

    const now = Date.now();

    document.getElementById('videowall').style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(timesToReplicate))}, 1fr)`;
    document.getElementById('videowall').style.gridTemplateRows = `repeat(${Math.ceil(Math.sqrt(timesToReplicate))}, 1fr)`;
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

  if (!window.localStorage.getItem('skyline.clspPlugin.wallUrls')) {
    window.localStorage.setItem('skyline.clspPlugin.wallUrls', defaultWallUrls.join('\n'));
  }

  $('#walltest').click(onclick);
  $('#controls-toggle').click(toggleControls);
  $('#showMetrics').on('change', setMetricsVisibility);

  const $wallUrls = $('#wallUrls');

  $wallUrls.val(window.localStorage.getItem('skyline.clspPlugin.wallUrls'));

  $wallUrls.on('change', () => {
    window.localStorage.setItem('skyline.clspPlugin.wallUrls', $wallUrls.val().trim());
  });
}

$(() => {
  const pageTitle = `CLSP ${window.CLSP_DEMO_VERSION} Demo Page`;
  document.title = pageTitle;
  $('#page-title-version').html(window.CLSP_DEMO_VERSION);

  window.HELP_IMPROVE_VIDEOJS = false;

  initializeWall();
});
