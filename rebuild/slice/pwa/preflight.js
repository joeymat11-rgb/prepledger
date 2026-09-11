'use strict';
/* A5 · the preflight's only script: register the launch worker, and say — honestly —
   whether this device can open Earned with no network.

   It never claims readiness it has not verified. "offline-ready" appears only when the
   service worker that CONTROLS this page reports that every file in its own precache
   manifest is actually present in its own cache. No controller, no answer, a partial
   install, an unsupported browser: all of those read "not yet", with the reason.

   It touches no athlete data, fetches nothing, and stores nothing of its own. */
(function () {
  var panel = document.getElementById('pwa-preflight');
  if (!panel) return;
  var stateEl = panel.querySelector('[data-pwa="state"]');
  var detailEl = panel.querySelector('[data-pwa="detail"]');
  var installEl = panel.querySelector('[data-pwa="install"]');

  var standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
    || window.navigator.standalone === true;
  if (installEl) installEl.hidden = standalone;

  function say(ready, state, detail) {
    stateEl.textContent = state;
    if (ready) stateEl.setAttribute('data-ready', 'yes');
    else stateEl.removeAttribute('data-ready');
    detailEl.textContent = detail || '';
  }

  if (!('serviceWorker' in navigator)) {
    say(false, 'not yet', 'This browser does not offer an offline launch. Everything else on this page still works, and nothing is lost.');
    return;
  }
  if (!window.isSecureContext) {
    say(false, 'not yet', 'An offline launch needs a secure origin (https, or 127.0.0.1). This page is not on one.');
    return;
  }

  function ask() {
    return new Promise(function (resolve) {
      var worker = navigator.serviceWorker.controller;
      if (!worker) return resolve(null);
      var channel = new MessageChannel();
      var timer = setTimeout(function () { resolve(null); }, 3000);
      channel.port1.onmessage = function (event) { clearTimeout(timer); resolve(event.data); };
      worker.postMessage({ type: 'EARNED_CACHE_STATUS' }, [channel.port2]);
    });
  }

  var attempts = 0;
  function refresh() {
    attempts++;
    ask().then(function (status) {
      if (status && status.ready) {
        // What is VERIFIED is the cache, so that is what the line says. It does not
        // promise what the next launch will do; the worker having every file is the
        // fact, and it is the fact this device can check.
        say(true, 'offline-ready ✓',
          'All ' + status.total + ' files of this build are stored on this device — everything the launch needs is here.');
        return;
      }
      if (status) {
        say(false, 'not yet',
          'Storing this build on this device: ' + status.present + ' of ' + status.total + ' files.');
      } else if (!navigator.serviceWorker.controller) {
        say(false, 'not yet',
          'This page is not being served by its offline copy yet. Reload once, with a connection, to finish.');
      } else {
        say(false, 'not yet', 'The offline copy did not answer. Reload once, with a connection.');
      }
      if (attempts < 12) setTimeout(refresh, 2000);
    });
  }

  navigator.serviceWorker.addEventListener('controllerchange', function () { attempts = 0; refresh(); });
  navigator.serviceWorker.register('sw.js', { scope: './' }).then(function () {
    refresh();
  }, function (error) {
    say(false, 'not yet', 'The offline copy could not be installed: ' + (error && error.message ? error.message : error));
  });
})();
