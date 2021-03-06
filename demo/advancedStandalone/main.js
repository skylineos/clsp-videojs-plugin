'use strict';

import './styles.scss';

import '@babel/polyfill';

import $ from 'jquery';
import moment from 'moment';
import humanize from 'humanize';

import packageJson from '~root/package.json';

window.CLSP_DEMO_VERSION = packageJson.version;

const defaultWallUrls = [
  'clsp://172.28.12.248/testpattern',
  'clsp://172.28.12.247/testpattern',
  'clsps://sky-qa-dionysus.qa.skyline.local/testpattern',
  'clsp://172.28.12.57:9001/FairfaxVideo0520',
  'clsp://172.28.12.57:9001/40004',
];

let wallInterval = null;

let wallPlayers = [];

function destroyAllWallPlayers () {
  for (let i = 0; i < wallPlayers.length; i++) {
    const player = wallPlayers[i];

    player.destroy();
  }

  wallPlayers = [];
}

function initializeWall () {
  async function createVideoPlayer (index, playerOptions) {
    const videoId = `wall-video-${index}`;

    const $container = $('#videowall')
      .append(document.getElementById('wall-video-template').innerHTML)
      .find('#wall-container-null');

    const $video = $container.find('video');
    const url = playerOptions.sources[0].src;

    $video.attr('id', videoId);

    $container.attr('id', `wall-container-${index}`);
    $container.find('.video-stream .index').text(index);
    $container.find('.video-stream .url').text(url);

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

    var iovCollection = window.IovCollection.asSingleton();

    const iov = await iovCollection.create(url, $video[0]);

    iov.play();

    wallPlayers.push(iov);

    // iov.on('metric', (event, { metric }) => {
    //   $videoMetrics.find(`.${metric.type.replace(new RegExp(/\./, 'g'), '-')} .value`)
    //     .attr('title', metric.value)
    //     .html(metric.value);
    // });

    $container.find('.video-stream .close').on('click', () => {
      $('#wallTotalVideos').text(parseInt($('#wallTotalVideos').text(), 10) - 1);
      iovCollection.remove(iov.id);
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
          poster: '../skyline_logo.png',
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

      if (window.performance && window.performance.memory) {
        $('#wallHeapSizeLimit').text(humanize.filesize(window.performance.memory.jsHeapSizeLimit));
        $('#wallTotalHeapSize').text(humanize.filesize(window.performance.memory.totalJSHeapSize));
        $('#wallUsedHeapSize').text(humanize.filesize(window.performance.memory.usedJSHeapSize));
      }
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

$(() => {
  const pageTitle = `CLSP ${window.CLSP_DEMO_VERSION} Demo Page`;
  document.title = pageTitle;
  $('#page-title-version').html(window.CLSP_DEMO_VERSION);

  initializeWall();
});
