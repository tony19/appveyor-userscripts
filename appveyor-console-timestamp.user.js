// ==UserScript==
// @name         AppVeyor Console Timestamp
// @version      0.5
// @description  Displays line timestamps in the job console
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @namespace    http://github.com/tony19
// @match        https://ci.appveyor.com/*/build/job/*
// @grant        GM_addStyle
// @run-at       document-idle
// @author       tony19@gmail.com
// @updateURL    https://cdn.rawgit.com/tony19/appveyor-userscripts/7cfa0062/appveyor-console-timestamp.user.js
// @downloadURL  https://cdn.rawgit.com/tony19/appveyor-userscripts/7cfa0062/appveyor-console-timestamp.user.js
// ==/UserScript==
/* global GM_addStyle */
/* jshint esnext:true, unused:true */
(() => {
  'use strict';

  GM_addStyle(`
    div[title] a:first-child {
      width: 140px !important;
      background-color: black;
    }
    div[title] span:first-child {
      padding-left: 100px !important;
    }
    .job-console {
      background-color: black;
    }
    a.late {
      color: red;
    }
  `);

  // number of seconds between timestamps that indicate excessive time spent
  const HIGH_WATERMARK = 3;
  let lastTime = '';

  const timerId = setInterval(() => {
    const divs = $('div[title]:has(a):not([data-ts])');
    if (!divs || !divs.length) { return; }

    divs.each((index, div) => {
      const timestamp = div.getAttribute('title');
      const anchor = $(div).find('a:first-child').append(` - ${timestamp}`);
      processLine(anchor, timestamp);
    });
    divs.attr('data-ts', '');
  }, 2000);

  function processLine(anchor, timestamp) {
    const seconds = toSeconds(timestamp);
    if (seconds - lastTime >= HIGH_WATERMARK) {
      $(anchor).addClass('late');
    }
    lastTime = seconds;
  }

  function toSeconds(hms) {
    const a = hms.split(':');
    const seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    return seconds;
  }
})();