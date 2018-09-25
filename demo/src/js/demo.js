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

    $container.find('.video-stream .index').text(cellId);
    $container.find('.video-stream .url').text(src);

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

    const cell = document.getElementById(`video-${cellId}`);

    if (!cell) {
      window.alert(`No match for element "video-${parseInt(cellId)}"`);
    }

    const player = window.videojs(cell, {
      autoplay: true,
      muted: true,
      preload: 'auto',
      poster: 'skyline_logo.png',
      clsp: {
        enableMetrics: true,
      },
    });

    $container.find('.video-stream .close').on('click', () => {
      $('#wallTotalVideos').text(parseInt($('#wallTotalVideos').text(), 10) - 1);
      player.dispose();
    });

    const tech = player.clsp();

    const $videoMetricContainer = $container.find('.video-metrics');

    tech.on('metric', (event, { metric }) => {
      $videoMetricContainer.find(`.${metric.type.replace(new RegExp(/\./, 'g'), '-')} .value`)
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

    $('#wallTotalVideos').text(cellIndex);
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
  $('#page-title').html(pageTitle);

  window.HELP_IMPROVE_VIDEOJS = false;

  initializeWall();
});
