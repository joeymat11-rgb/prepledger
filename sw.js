/* Measured service worker — bump CACHE on every redeploy */
const CACHE = "measured-v6.1.0";
const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./fonts.css",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png",
  "./icon-mono-512.png",
  "./favicon-32.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  let u9; try { u9 = new URL(e.request.url); if (u9.hostname === "api.github.com" || u9.hostname.endsWith("githubusercontent.com")) return; } catch (err) {}
  if (u9 && u9.origin === self.location.origin && /^\/ledger\//.test(u9.pathname)) { e.respondWith(fetch(e.request)); return; }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(e.request)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
            return res;
          })
          .catch(() => caches.match("./index.html"))
    )
  );
});
