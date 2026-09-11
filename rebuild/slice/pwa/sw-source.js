'use strict';
/* The Earned slice service worker. ONE job: launch the exact built assets when there is
   no network. It is emitted by rebuild/slice/pwa/build-pwa.mjs from this source, with the
   two placeholders below replaced by the built bytes' own hashes — never edit the built
   copy, and never hand-write a version here.

   WHAT IT DOES NOT DO, deliberately (DECISIONS:88 — "no service-worker cleverness beyond
   launch"): no background sync, no push, no periodic sync, no cache of anything it did
   not precache, no cache of any other origin, no interception of anything but GET, no
   offline write queue. The athlete's durable record is rebuild/client's own local
   storage; this worker never reads or writes it.

   POLICY, and why it cannot serve stale bytes:
     * the document (a navigation) is NETWORK-FIRST with a short timeout, so an athlete
       with a signal always gets the deployed index.html, and the cached one only when the
       network does not answer;
     * every other precached asset is CACHE-FIRST, which is safe because those URLs carry
       their own content hash — a given URL's bytes never change, so "cached" and "fresh"
       are the same bytes by construction;
     * the cache NAME is a hash of the whole precache manifest, so a rebuilt asset lands
       in a new cache, installed whole, and the old one is deleted on activation. There is
       no version constant for anyone to forget to bump. */

const CACHE = "__EARNED_CACHE_NAME__";
const MANIFEST = __EARNED_PRECACHE__;
const SHELL = "index.html";
const NAVIGATION_TIMEOUT_MS = 4000;

const scopeUrl = () => new URL(self.registration.scope);
const urlFor = (name) => new URL(name, self.registration.scope).href;
const precached = () => MANIFEST.map((entry) => urlFor(entry.path));

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // cache:'reload' so the install reads the deployed bytes, never the HTTP cache.
    await cache.addAll(precached().map((url) => new Request(url, { cache: 'reload', credentials: 'omit' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name !== CACHE && name.indexOf('earned-slice-') === 0) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('offline')), ms);
    promise.then((value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); });
  });
}

async function navigateNetworkFirst(request) {
  try {
    const fresh = await withTimeout(fetch(request), NAVIGATION_TIMEOUT_MS);
    if (fresh && (fresh.ok || fresh.status === 304)) return fresh;
  } catch (error) { /* no network: fall through to the launch copy */ }
  const cached = await (await caches.open(CACHE)).match(urlFor(SHELL));
  if (cached) return cached;
  return new Response('Earned has not finished storing itself on this device yet. Open it once with a connection.',
    { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

async function assetCacheFirst(href, request) {
  const cached = await (await caches.open(CACHE)).match(href);
  if (cached) return cached;
  /* A URL this build precached but this device has not stored (an interrupted install).
     Go to the network and do NOT write it here: this cache holds one build, whole. */
  return fetch(request);
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  // Never intercept anything but GET: a POST is nobody's cache business.
  if (request.method !== 'GET') return;
  let url;
  try { url = new URL(request.url); } catch (error) { return; }
  const scope = scopeUrl();
  // Never touch another origin, in either direction: not answered, not stored.
  if (url.origin !== scope.origin) return;
  if (url.pathname.indexOf(scope.pathname) !== 0) return;
  if (request.mode === 'navigate') { event.respondWith(navigateNetworkFirst(request)); return; }
  const href = url.origin + url.pathname;
  if (precached().indexOf(href) === -1) return;  // not ours; the browser's own business
  event.respondWith(assetCacheFirst(href, request));
});

/* The page's offline-ready indicator asks HERE rather than guessing. The answer is a
   verified fact: every precached URL is looked up in this cache, and "ready" means every
   single one came back. A worker that is installed but not finished says so. */
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'EARNED_CACHE_STATUS' || !event.ports || !event.ports[0]) return;
  const port = event.ports[0];
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const missing = [];
    let present = 0;
    for (const entry of MANIFEST) {
      if (await cache.match(urlFor(entry.path))) present++;
      else missing.push(entry.path);
    }
    port.postMessage({ type: 'EARNED_CACHE_STATUS', cache: CACHE, total: MANIFEST.length,
      present: present, missing: missing, ready: missing.length === 0 });
  })());
});
