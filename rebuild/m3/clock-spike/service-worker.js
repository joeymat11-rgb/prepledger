'use strict';
const BUILD = 'clock-spike-v1';
const CACHE = BUILD + ':' + self.registration.scope;
const urls = ['index.html', 'app.mjs', 'store.mjs', 'styles.css', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png']
  .map(name => new URL(name, self.registration.scope).href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(urls.map(url => new Request(url, { cache: 'reload', credentials: 'omit' })))));
});
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const url = new URL(event.request.url), scope = new URL(self.registration.scope);
    if (event.request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return Response.error();
    const wanted = event.request.mode === 'navigate' ? new URL('index.html', scope).href : url.href;
    if (!urls.includes(wanted)) return new Response('Not in this diagnostic build.', { status: 503 });
    return (await (await caches.open(CACHE)).match(wanted)) || new Response('Diagnostic shell missing. Preserve the off-device receipt; do not initialize a replacement run.', { status: 503 });
  })());
});
self.addEventListener('message', event => {
  if (event.data !== 'CLOCK_CACHE_STATUS' || !event.ports[0]) return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const entries = await Promise.all(urls.map(url => cache.match(url)));
    event.ports[0].postMessage({ build: BUILD, ready: entries.every(Boolean) });
  })());
});
