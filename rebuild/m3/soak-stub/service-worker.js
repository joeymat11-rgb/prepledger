'use strict';
const CACHE = 'earned-soak-stub-v1:' + self.registration.scope;
const ASSETS = ['index.html', 'styles.css', 'app.mjs', 'store.mjs', 'manifest.webmanifest',
  'icon-180.png', 'icon-192.png', 'icon-512.png'];
const urls = ASSETS.map(name => new URL(name, self.registration.scope).href);

// The only application-initiated asset network work: one complete installation.
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(
    urls.map(url => new Request(url, { cache: 'reload', credentials: 'omit' }))
  )));
});
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });

// No network fallback, polling, periodic sync, push, update(), or cache cleanup.
// Browser-originated service-worker update checks are outside this handler.
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const url = new URL(event.request.url);
    const scope = new URL(self.registration.scope);
    if (event.request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return Response.error();
    const wanted = event.request.mode === 'navigate' ? new URL('index.html', scope).href : url.href;
    if (!urls.includes(wanted)) return new Response('Unavailable in the pinned offline shell.', { status: 503 });
    const cached = await (await caches.open(CACHE)).match(wanted);
    return cached || new Response('STORE MISSING/CHANGED — OFFLINE SHELL MISSING. Do not restart this experiment.',
      { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  })());
});

self.addEventListener('message', event => {
  if (event.data !== 'CACHE_STATUS' || !event.ports[0]) return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const present = await Promise.all(urls.map(url => cache.match(url)));
    event.ports[0].postMessage({ ready: present.every(Boolean), build: 'soak-stub-v1' });
  })());
});
