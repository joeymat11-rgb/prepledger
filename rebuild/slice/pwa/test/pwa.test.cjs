"use strict";

/* A5 — the PWA shell, tested WITHOUT a bundler.

   Everything here runs under the repository's own lockfile: pwa.cjs, shell.cjs and
   icons.cjs depend on node:crypto/fs/path/zlib and nothing else, and the service worker
   is exercised as the real emitted source inside a node:vm sandbox with a fake
   ServiceWorkerGlobalScope. The build-output half (A1's bundle, the real folder, the
   local host) is in ./package.test.cjs, which needs rebuild/m3/w6's dependencies.

   The claim this file exists to execute: the cache name is derived from the built bytes,
   nothing cross-origin is ever cached, nothing but GET is ever intercepted, the response
   headers say what they must, and the private guard really fires. */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const pwa = require("../pwa.cjs");
const shell = require("../shell.cjs");
const icons = require("../icons.cjs");
const design = require("../../../m3/w7-preview/today/design.cjs");

const ROOT = pwa.ROOT;
const SCOPE = "https://earned.example.invalid/";

// A precache manifest shaped exactly like a real one, but written here so the unit tests
// never need a bundle.
const FIXTURE = Object.freeze([
  { path: "app.1111111111111111.js", sha256: "a".repeat(64) },
  { path: "index.html", sha256: "b".repeat(64) },
  { path: "styles.2222222222222222.css", sha256: "c".repeat(64) },
]);

/* ----------------------------------------------------------- a worker, in a sandbox --
   The REAL emitted bytes are evaluated against a fake global. Nothing is stubbed that the
   worker's own logic depends on: the cache is a Map, and fetch is a spy whose answer each
   test chooses. */
function fakeCaches() {
  const store = new Map();
  const api = {
    store,
    async open(name) {
      if (!store.has(name)) store.set(name, new Map());
      const entries = store.get(name);
      return {
        async addAll(requests) { for (const r of requests) entries.set(String(r.url), { tag: "cached", url: String(r.url) }); },
        async match(url) { return entries.get(String(url)); },
        async put(url, response) { entries.set(String(url), response); },
      };
    },
    async keys() { return [...store.keys()]; },
    async delete(name) { return store.delete(name); },
  };
  return api;
}

class FakeEvent {
  constructor(request, extra = {}) {
    Object.assign(this, extra);
    this.request = request;
    this.response = undefined;
    this.waited = [];
  }
  respondWith(promise) { this.response = promise; }
  waitUntil(promise) { this.waited.push(promise); }
}

function loadWorker({ manifest = FIXTURE, scope = SCOPE, fetchImpl } = {}) {
  const cache = pwa.cacheName(manifest);
  const source = shell.serviceWorker(manifest, cache);
  const listeners = new Map();
  const calls = [];
  const caches = fakeCaches();
  const self = {
    registration: { scope },
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, []); listeners.get(type).push(fn); },
    skipWaiting: async () => { self.skipped = true; },
    clients: { claim: async () => { self.claimed = true; } },
  };
  const fetchSpy = async (request) => {
    calls.push(String(request && request.url ? request.url : request));
    if (!fetchImpl) throw new Error("network refused by the test");
    return fetchImpl(request);
  };
  const context = vm.createContext({ self, caches, fetch: fetchSpy, Response, Request, URL,
    setTimeout, clearTimeout, Promise, Error, console });
  vm.runInContext(source, context, { filename: "sw.js" });
  const dispatch = async (type, event) => {
    const handlers = listeners.get(type) || [];
    assert(handlers.length === 1, `the worker registers exactly one ${type} handler`);
    handlers[0](event);
    await Promise.all(event.waited);
    return event;
  };
  return { source, cache, self, caches, calls, listeners, dispatch, manifest, scope };
}

const urlFor = (worker, name) => new URL(name, worker.scope).href;

async function installed(options) {
  const worker = loadWorker(options);
  await worker.dispatch("install", new FakeEvent(undefined));
  await worker.dispatch("activate", new FakeEvent(undefined));
  return worker;
}

/* ------------------------------------------------------------------ the cache name -- */

test("the cache name is derived from the built bytes — a rebuilt asset cannot leave it behind", () => {
  const before = pwa.cacheName(FIXTURE);
  assert.match(before, /^earned-slice-[0-9a-f]{32}$/);
  // One byte of one asset changes => a different sha256 => a different cache.
  const rebuilt = FIXTURE.map((e) => (e.path === "index.html" ? { ...e, sha256: "b".repeat(63) + "c" } : e));
  assert.notEqual(pwa.cacheName(rebuilt), before);
  // A renamed asset counts too: the name is part of what is hashed.
  const renamed = FIXTURE.map((e) => (e.path.startsWith("app.") ? { ...e, path: "app.3333333333333333.js" } : e));
  assert.notEqual(pwa.cacheName(renamed), before);
  // ... and the SAME bytes always give the SAME name, whatever order they arrive in.
  assert.equal(pwa.cacheName([...FIXTURE].reverse()), before);
  assert.equal(pwa.cacheName(FIXTURE.map((e) => ({ ...e }))), before);
});

test("the cache name refuses a precache list it cannot stand behind", () => {
  assert.throws(() => pwa.cacheName([]), /CACHE-NAME FAIL/);
  assert.throws(() => pwa.cacheName([{ path: "a.js", sha256: "short" }]), /CACHE-NAME FAIL/);
  assert.throws(() => pwa.cacheName([{ path: "../escape.js", sha256: "a".repeat(64) }]), /CACHE-NAME FAIL/);
  assert.throws(() => pwa.cacheName([FIXTURE[0], FIXTURE[0]]), /appears twice/);
});

test("the emitted worker carries that exact name and no placeholder", () => {
  const worker = loadWorker();
  assert(worker.source.includes(`"${worker.cache}"`), "the cache name is a literal in the worker");
  assert.doesNotMatch(worker.source, /__EARNED_/);
  for (const entry of FIXTURE) assert(worker.source.includes(entry.sha256), entry.path);
  // The placeholders are filled by a replacement that must match EXACTLY once, so a
  // future edit that drops or duplicates one fails the build instead of shipping a
  // worker with a literal "__EARNED_CACHE_NAME__" for a cache.
  assert(shell.workerSource().includes('"__EARNED_CACHE_NAME__"'));
  assert.throws(() => shell.once("no placeholder here", "__EARNED_PRECACHE__", "x", "probe"),
    /SHELL-EDIT FAIL: probe matched 0 times/);
  assert.throws(() => shell.once("x __EARNED_PRECACHE__ y __EARNED_PRECACHE__", "__EARNED_PRECACHE__", "z", "probe"),
    /SHELL-EDIT FAIL: probe matched 2 times/);
});

/* ------------------------------------------------------------- the worker's behaviour -- */

test("install precaches exactly the manifest, from the network, and nothing else", async () => {
  const worker = await installed();
  const entries = worker.caches.store.get(worker.cache);
  assert.deepEqual([...entries.keys()].sort(), FIXTURE.map((e) => urlFor(worker, e.path)).sort());
  assert.deepEqual([...worker.caches.store.keys()], [worker.cache], "one cache, named for these bytes");
  assert.equal(worker.self.skipped, true);
  assert.equal(worker.self.claimed, true);
});

test("activating a new build deletes the old build's cache and leaves other origins' alone", async () => {
  const worker = loadWorker();
  await worker.caches.open("earned-slice-" + "0".repeat(32));
  await worker.caches.open("some-other-app-v3");
  await worker.dispatch("install", new FakeEvent(undefined));
  await worker.dispatch("activate", new FakeEvent(undefined));
  assert.deepEqual((await worker.caches.keys()).sort(), [worker.cache, "some-other-app-v3"].sort());
});

test("a non-GET request is never intercepted", async () => {
  const worker = await installed();
  for (const method of ["POST", "PUT", "DELETE", "HEAD"]) {
    const event = new FakeEvent({ method, url: urlFor(worker, "index.html"), mode: "cors" });
    await worker.dispatch("fetch", event);
    assert.equal(event.response, undefined, method + " was intercepted");
  }
  assert.deepEqual(worker.calls.filter((u) => !u.startsWith(worker.scope)), []);
});

test("nothing cross-origin is ever answered or stored", async () => {
  const worker = await installed();
  const before = [...worker.caches.store.get(worker.cache).keys()].length;
  for (const url of ["https://fonts.googleapis.com/css2?family=X", "https://earned.example.invalid.evil/app.js",
    "http://earned.example.invalid/index.html", "https://other.invalid/index.html"]) {
    const event = new FakeEvent({ method: "GET", url, mode: "no-cors" });
    await worker.dispatch("fetch", event);
    assert.equal(event.response, undefined, url + " was intercepted");
    const navigation = new FakeEvent({ method: "GET", url, mode: "navigate" });
    await worker.dispatch("fetch", navigation);
    assert.equal(navigation.response, undefined, url + " was intercepted as a navigation");
  }
  assert.equal([...worker.caches.store.get(worker.cache).keys()].length, before, "the cache grew");
});

test("a same-origin URL this build does not precache is left to the browser", async () => {
  const worker = await installed();
  for (const name of ["not-in-this-build.js", "sw.js", "_headers", "app.9999999999999999.js"]) {
    const event = new FakeEvent({ method: "GET", url: urlFor(worker, name), mode: "cors" });
    await worker.dispatch("fetch", event);
    assert.equal(event.response, undefined, name + " was intercepted");
  }
});

test("a precached asset is served from the cache without touching the network", async () => {
  const worker = await installed();
  const calls = worker.calls.length;
  for (const name of ["app.1111111111111111.js", "styles.2222222222222222.css"]) {
    const event = new FakeEvent({ method: "GET", url: urlFor(worker, name), mode: "cors" });
    await worker.dispatch("fetch", event);
    const response = await event.response;
    assert.equal(response.url, urlFor(worker, name));
    assert.equal(response.tag, "cached");
  }
  assert.equal(worker.calls.length, calls, "a cache-first asset went to the network");
});

test("a cache-busting query does not defeat the pinned asset, and does not become a second entry", async () => {
  const worker = await installed();
  const event = new FakeEvent({ method: "GET", url: urlFor(worker, "app.1111111111111111.js") + "?v=2", mode: "cors" });
  await worker.dispatch("fetch", event);
  assert.equal((await event.response).tag, "cached");
  assert.equal(worker.caches.store.get(worker.cache).size, FIXTURE.length);
});

test("a navigation is NETWORK-FIRST: online it is the deployed page, not the stored one", async () => {
  const fresh = new Response("<!doctype html><title>fresh</title>", { status: 200 });
  const worker = await installed({ fetchImpl: async () => fresh });
  const event = new FakeEvent({ method: "GET", url: worker.scope, mode: "navigate" });
  await worker.dispatch("fetch", event);
  const response = await event.response;
  assert.equal(response, fresh, "the cached shell was served while the network was up");
  assert.equal(await response.clone().text(), "<!doctype html><title>fresh</title>");
});

test("a navigation falls back to the stored shell only when the network does not answer", async () => {
  const worker = await installed();   // no fetchImpl: every fetch throws
  const event = new FakeEvent({ method: "GET", url: worker.scope + "?from=home-screen", mode: "navigate" });
  await worker.dispatch("fetch", event);
  const response = await event.response;
  assert.equal(response.url, urlFor(worker, "index.html"), "the launch copy answered");
  assert.equal(response.tag, "cached");
});

test("a navigation before the shell is stored says so instead of pretending", async () => {
  const worker = loadWorker();        // never installed
  const event = new FakeEvent({ method: "GET", url: worker.scope, mode: "navigate" });
  await worker.dispatch("fetch", event);
  const response = await event.response;
  assert.equal(response.status, 503);
  assert.match(await response.text(), /has not finished storing itself/);
});

test("a server error online is not mistaken for a fresh page", async () => {
  const worker = await installed({ fetchImpl: async () => new Response("gone", { status: 500 }) });
  const event = new FakeEvent({ method: "GET", url: worker.scope, mode: "navigate" });
  await worker.dispatch("fetch", event);
  assert.equal((await event.response).tag, "cached", "a 500 was served as the page");
});

test("the offline-ready answer is a verified fact, not a claim", async () => {
  const worker = await installed();
  const ask = async () => {
    const seen = [];
    const event = new FakeEvent(undefined, { data: { type: "EARNED_CACHE_STATUS" },
      ports: [{ postMessage: (m) => seen.push(m) }] });
    await worker.dispatch("message", event);
    return seen[0];
  };
  const ready = await ask();
  assert.equal(ready.ready, true);
  assert.equal(ready.total, FIXTURE.length);
  assert.equal(ready.present, FIXTURE.length);
  assert.deepEqual([...ready.missing], []);
  assert.equal(ready.cache, worker.cache);

  // Evict ONE file and the answer must change. This is the whole point: the indicator
  // reads the cache, it does not remember what the worker intended to store.
  worker.caches.store.get(worker.cache).delete(urlFor(worker, "styles.2222222222222222.css"));
  const partial = await ask();
  assert.equal(partial.ready, false);
  assert.equal(partial.present, FIXTURE.length - 1);
  assert.deepEqual([...partial.missing], ["styles.2222222222222222.css"]);
});

test("the worker answers no other message and opens no other channel", async () => {
  const worker = await installed();
  const seen = [];
  for (const data of [null, "CACHE_STATUS", { type: "SKIP_WAITING" }, { type: "EARNED_CACHE_STATUS" }]) {
    const event = new FakeEvent(undefined, { data, ports: data && data.type === "EARNED_CACHE_STATUS"
      ? [] : [{ postMessage: (m) => seen.push(m) }] });
    await worker.dispatch("message", event);
  }
  assert.deepEqual(seen, [], "the worker replied to something it should have ignored");
  for (const forbidden of ["periodicsync", "push", "sync", "backgroundfetch"]) {
    assert(!worker.listeners.has(forbidden), "the worker listens for " + forbidden);
  }
  assert.deepEqual([...worker.listeners.keys()].sort(), ["activate", "fetch", "install", "message"]);
});

test("a deeper scope confines the worker to its own folder", async () => {
  const worker = await installed({ scope: "https://earned.example.invalid/slice/" });
  const outside = new FakeEvent({ method: "GET", url: "https://earned.example.invalid/other/app.js", mode: "cors" });
  await worker.dispatch("fetch", outside);
  assert.equal(outside.response, undefined, "a sibling folder was intercepted");
  const inside = new FakeEvent({ method: "GET", url: "https://earned.example.invalid/slice/index.html", mode: "cors" });
  await worker.dispatch("fetch", inside);
  assert.equal((await inside.response).tag, "cached");
});

/* ------------------------------------------------------------------ the _headers file -- */

const NAMES = Object.freeze({ index: "index.html", styles: "styles.aaaaaaaaaaaaaaaa.css",
  app: "app.bbbbbbbbbbbbbbbb.js", preflightCss: "preflight.cccccccccccccccc.css",
  preflightJs: "preflight.dddddddddddddddd.js" });
const SERVED = Object.freeze(["index.html", NAMES.styles, NAMES.app, NAMES.preflightCss, NAMES.preflightJs,
  pwa.MANIFEST_FILE, pwa.SERVICE_WORKER, ...pwa.ICON_FILES.map((i) => i.name), pwa.ICON_SVG]);

test("the response headers carry the lockdown, and the service worker is never stored", () => {
  const rules = shell.headerRules(NAMES);
  assert.equal(shell.assertHeaderRules(rules, SERVED), rules.length);
  const by = Object.fromEntries(rules.map((r) => [r.path, r.headers]));
  assert.equal(by["/sw.js"]["Cache-Control"], "no-store");
  assert.equal(by["/" + NAMES.app]["Cache-Control"], shell.IMMUTABLE);
  assert.equal(by["/index.html"]["Cache-Control"], "no-cache");
  assert.equal(by["/"]["Content-Security-Policy"], by["/index.html"]["Content-Security-Policy"]);
  // The page cannot be made to talk to anything; only the worker script may fetch.
  assert.match(by["/index.html"]["Content-Security-Policy"], /connect-src 'none'/);
  assert.match(by["/sw.js"]["Content-Security-Policy"], /connect-src 'self'/);
  // ... and the page must be allowed to READ the manifest and START the worker, which
  // default-src 'none' alone forbids.
  assert.match(by["/index.html"]["Content-Security-Policy"], /manifest-src 'self'/);
  assert.match(by["/index.html"]["Content-Security-Policy"], /worker-src 'self'/);
  for (const rule of rules) assert.doesNotMatch(rule.headers["Content-Security-Policy"], /https?:/);
});

test("every served file has a rule of its own and no two rules can stack", () => {
  const rules = shell.headerRules(NAMES);
  assert.throws(() => shell.assertHeaderRules(rules, [...SERVED, "orphan.js"]),
    /orphan\.js is served with no rule of its own/);
  assert.throws(() => shell.assertHeaderRules([...rules, { path: "/index.html", headers: rules[0].headers }], SERVED),
    /two rules match \/index\.html/);
  assert.throws(() => shell.assertHeaderRules([{ path: "/*", headers: rules[0].headers }], []),
    /not an exact path/);
  assert.throws(() => shell.assertHeaderRules([{ path: "/x", headers: { ...shell.COMMON,
    "Content-Security-Policy": "default-src https://cdn.example.com" } }], []), /names a remote origin/);
  assert.throws(() => shell.assertHeaderRules(rules.map((r) => (r.path === "/sw.js"
    ? { ...r, headers: { ...r.headers, "Cache-Control": "max-age=60" } } : r)), SERVED), /the worker is storable/);
});

test("the emitted _headers is a file the host can actually read back", () => {
  const rules = shell.headerRules(NAMES);
  const text = shell.headersFile(rules);
  for (const rule of rules) {
    assert(text.includes("\n" + rule.path + "\n"), rule.path);
    for (const [name, value] of Object.entries(rule.headers)) assert(text.includes(`  ${name}: ${value}`), name);
  }
  assert.match(text, /^#/, "the file explains itself");
  assert.doesNotMatch(text, /\r/, "LF only");
});

/* ------------------------------------------------------------------- the manifest -- */

test("the web app manifest is valid, installable and says only true things", () => {
  const manifest = JSON.parse(pwa.webManifest());
  assert.equal(manifest.name, "Earned");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.scope, "./");
  assert.equal(manifest.id, "./");
  assert.equal(manifest.start_url, "./index.html");
  assert.equal(manifest.theme_color, pwa.THEME_COLOR);
  assert.equal(manifest.background_color, pwa.BACKGROUND_COLOR);
  for (const key of ["name", "short_name", "start_url", "scope", "display", "icons"]) {
    assert(key in manifest, "a required member is missing: " + key);
  }
  // start_url must be inside scope, or the installed app opens somewhere else.
  const scope = new URL(manifest.scope, "https://host.invalid/");
  assert(new URL(manifest.start_url, "https://host.invalid/").href.startsWith(scope.href));
  // Installability: at least one icon of 192 and one of 512, plus a maskable one.
  const sizes = manifest.icons.map((i) => i.sizes);
  assert(sizes.includes("192x192") && sizes.includes("512x512"));
  assert(manifest.icons.some((i) => i.purpose === "maskable"));
  for (const icon of manifest.icons) {
    assert.equal(icon.type, "image/png");
    assert(pwa.ICON_FILES.some((f) => "./" + f.name === icon.src), icon.src + " is not a file this build emits");
  }
  assert.doesNotMatch(pwa.webManifest(), /https?:/, "the manifest names a remote origin");
});

test("the two colours are the approved design's own, read back from it at build time", () => {
  const seen = pwa.assertApprovedColours(ROOT);
  assert.equal(seen.theme, "#E7E1D4");
  assert.equal(seen.background, "#F4F0E8");
  assert.equal(seen.field, "#2E5A3C");
  // A design change upstream must not leave the splash and the icon quietly wrong.
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "a5-colour-"));
  const file = path.join(temp, pwa.APPROVED_REFERENCE);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const original = fs.readFileSync(path.join(ROOT, pwa.APPROVED_REFERENCE), "utf8");
  fs.writeFileSync(file, original.replace("--ground:#E7E1D4", "--ground:#123456"));
  assert.throws(() => pwa.assertApprovedColours(temp), /APPROVED-COLOUR FAIL: --ground/);
  fs.writeFileSync(file, original);
  assert.doesNotThrow(() => pwa.assertApprovedColours(temp));
  fs.rmSync(temp, { recursive: true, force: true });
});

/* -------------------------------------------------------------- the private guard -- */

const CLEAN = () => [
  ["index.html", "<!doctype html><title>Earned</title>"],
  ["app.1111111111111111.js", "const key='synthetic-preview-identity-not-a-credential';"],
  ["styles.2222222222222222.css", "@font-face{src:url(data:font/woff2;base64,AA//BB//CC)}"],
];

test("the private guard passes a clean folder and refuses a planted one", () => {
  const report = pwa.assertNothingPrivate(CLEAN(), { "index.html": "rebuild/m3/w7-preview/today/index.html" });
  assert.equal(report.files, 3);
  assert(report.shapes >= 8 && report.roots >= 4);

  // (1) a file copied OUT of a private place
  assert.throws(() => pwa.assertNothingPrivate(CLEAN(), { "index.html": "ledger/state.json" }),
    /PRIVATE-GUARD FAIL: index\.html was copied from ledger\/state\.json/);
  assert.throws(() => pwa.assertNothingPrivate(CLEAN(), { "x.json": "rebuild/conform/private/live.json" }),
    /PRIVATE-GUARD FAIL/);
  assert.throws(() => pwa.assertNothingPrivate(CLEAN(), { "h.js": "src/history.js" }), /PRIVATE-GUARD FAIL/);

  // (2) a file that landed in the output UNDER a private path
  assert.throws(() => pwa.assertNothingPrivate([...CLEAN(), ["ledger/state.json", "{}"]]),
    /the output contains a private path/);

  // (3) a shipped byte that NAMES a private artefact
  for (const planted of ["fetch('ledger/state.json')", "// see src/history.js", "rebuild/conform/private/live.json"]) {
    assert.throws(() => pwa.assertNothingPrivate([...CLEAN(), ["planted.js", planted]]),
      /PRIVATE-GUARD FAIL: planted\.js names/, planted);
  }
});

test("the private guard fires on every credential shape it claims to know", () => {
  /* THE PROBES ARE ASSEMBLED, NEVER WRITTEN OUT. Every value below is built from
     fragments at run time, so this file contains no string that is itself shaped like a
     credential. That is not cosmetic: a literal probe here is indistinguishable from a
     real leak to the host's own push protection, which refuses the push — and a builder
     who then asks for an exception has trained everyone to wave one through. None of
     these is anyone's token; they are the published PREFIXES plus filler. */
  const join = (...parts) => parts.join("");
  const filler = "A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8";   // 36 chars, no checksum
  const planted = {
    "GitHub personal access token": join("const t='", "gh", "p_", filler, "';"),
    "GitHub fine-grained token": join("git", "hub_pat_", "11ABCDEFG0", "abcdefghijklmnopqrstuvwxyz012345"),
    "GitHub OAuth/app/refresh token": join("gh", "s_", filler),
    "Netlify personal access token": join("nf", "p_", "a".repeat(40)),
    "Slack token": join("xo", "x", "b-", "123456789012", "-", "abcdefghijklmnop"),
    "AWS access key id": join("AK", "IA", "IOSFODNN7EXAMPLE"),
    "Google API key": join("AI", "za", "a".repeat(35)),
    "PEM private key": join("-----", "BEGIN RSA PRIVATE KEY", "-----"),
    "JSON Web Token": join("ey", "JhbGciOiJI.", "ey", "JzdWIiOiIx.", "dBjftJeZ4CVP"),
    "a secret assigned in source": join("const NETLIFY = { auth", "_token: \"", "0123456789abcdef0123", "\" };"),
  };
  const known = pwa.TOKEN_SHAPES.map(([label]) => label);
  assert.deepEqual(Object.keys(planted).sort(), [...known].sort(), "a shape is claimed but never probed");
  for (const [label, text] of Object.entries(planted)) {
    assert.throws(() => pwa.assertNothingPrivate([...CLEAN(), ["planted.js", text]]),
      new RegExp("looks like a " + label.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&")), label);
  }
  // ... and does NOT fire on what this folder legitimately ships.
  assert.doesNotThrow(() => pwa.assertNothingPrivate([
    ["styles.css", "src:url(data:font/woff2;base64," + "QUJD".repeat(400) + ")"],
    ["app.js", "const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5];const IV='0123456789abcdef0123456789abcdef';"],
  ]));
});

test("the guard is really run by the build, over the headers as well", () => {
  // _headers is generated text, not a copied file, and it is scanned like everything else.
  const rules = shell.headerRules(NAMES);
  assert.doesNotThrow(() => pwa.assertNothingPrivate([[pwa.HEADERS_FILE, shell.headersFile(rules)]]));
  assert.throws(() => pwa.assertNothingPrivate([[pwa.HEADERS_FILE,
    shell.headersFile(rules) + "\n/x\n  Authorization: ghp_" + "Z".repeat(36) + "\n"]]), /PRIVATE-GUARD FAIL/);
});

/* ------------------------------------------------------------------------ the icons -- */

function readPng(bytes) {
  assert.deepEqual([...bytes.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], "PNG signature");
  assert.equal(bytes.subarray(12, 16).toString("latin1"), "IHDR");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), depth: bytes[24], colour: bytes[25],
    chunks: [...bytes.toString("latin1").matchAll(/IHDR|IDAT|IEND/g)].map((m) => m[0]) };
}

test("the icons are authored here, valid PNGs at the sizes the manifest declares, and deterministic", () => {
  for (const icon of pwa.ICON_FILES) {
    const bytes = icons.png(icon.size, { purpose: icon.purpose });
    const header = readPng(bytes);
    assert.equal(header.width, icon.size, icon.name);
    assert.equal(header.height, icon.size, icon.name);
    assert.equal(header.depth, 8);
    assert.equal(header.colour, 6, "truecolour with alpha");
    assert.deepEqual(header.chunks, ["IHDR", "IDAT", "IEND"]);
    // The same size must always produce the same bytes, or the cache name would churn
    // on every build and every athlete would re-download the whole shell.
    assert.equal(pwa.sha256(bytes), pwa.sha256(icons.png(icon.size, { purpose: icon.purpose })), icon.name);
  }
});

test("the icon is drawn from the approved design's own two colours, and is opaque", () => {
  const { pixels, size } = icons.raster(64, { purpose: "any" });
  const at = (x, y) => [...pixels.subarray((y * size + x) * 4, (y * size + x) * 4 + 4)];
  assert.deepEqual(at(32, 12), [...icons.GREEN, 255], "the field is the approved --green");
  assert.deepEqual(at(0, 0), [...icons.PAPER, 255], "the corner is the approved --paper, and opaque");
  // The figure: the check's middle vertex is paper on green.
  const [vx, vy] = icons.CHECK[1];
  assert.deepEqual(at(Math.round(vx * size), Math.round(vy * size)), [...icons.PAPER, 255]);
  for (let i = 3; i < pixels.length; i += 4) assert.equal(pixels[i], 255, "an icon pixel is transparent");
});

test("the maskable icon keeps its whole mark inside the safe zone", () => {
  const { pixels, size } = icons.raster(96, { purpose: "maskable" });
  const inset = icons.INSET.maskable;
  const low = Math.floor(((1 - inset) / 2) * size);
  const high = Math.ceil((1 - (1 - inset) / 2) * size);
  let outside = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const green = pixels[(y * size + x) * 4] === icons.GREEN[0] && pixels[(y * size + x) * 4 + 1] === icons.GREEN[1];
      if (green && (x < low || x > high || y < low || y > high)) outside++;
    }
  }
  assert.equal(outside, 0, "the maskable mark leaves the 80% safe zone and would be cropped");
  // The "any" icon deliberately does fill its canvas, so the two are not the same image.
  assert.notEqual(pwa.sha256(icons.png(96, { purpose: "maskable" })), pwa.sha256(icons.png(96, { purpose: "any" })));
  assert.throws(() => icons.raster(96, { purpose: "invented" }), /ICON-PURPOSE FAIL/);
});

test("the SVG draws the same geometry as the raster and names nothing but itself", () => {
  const svg = icons.svg();
  assert.match(svg, /^<svg /);
  assert(svg.includes(icons.GREEN_HEX) && svg.includes(icons.PAPER_HEX));
  for (const [x] of icons.CHECK) assert(svg.includes((x * 512).toFixed(1)), String(x));
  assert.equal((svg.match(/https?:\/\//g) || []).length, 1, "only the SVG namespace");
  assert(svg.includes(shell.SVG_NAMESPACE));
  // ... and the one permitted URL is permitted by exact value, in that one file only.
  assert.doesNotThrow(() => shell.assertNoNetworkReference([[pwa.ICON_SVG, svg]]));
  assert.throws(() => shell.assertNoNetworkReference([[pwa.ICON_SVG,
    svg.replace("</svg>", '<image href="https://example.com/a.png"/></svg>')]]), /NETWORK-REFERENCE FAIL/);
  assert.throws(() => shell.assertNoNetworkReference([["index.html", '<svg xmlns="' + shell.SVG_NAMESPACE + '">']]),
    /NETWORK-REFERENCE FAIL/, "the exception is not folder-wide");
});

/* ------------------------------------------------------- the preflight, on the page -- */

test("the preflight uses the approved design's own classes and secondary type", () => {
  const approved = design.readApproved(ROOT);
  const css = approved.map((a) => a.styles).join("\n");
  const fragment = shell.preflightHtml();
  for (const token of design.classTokens(fragment)) {
    const selector = new RegExp("\\." + token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\w-])");
    assert(selector.test(css), `CLASS-BINDING FAIL: .${token} is not in the approved stylesheets`);
  }
  // .review IS the approved secondary voice: 13px, var(--muted). The preflight inherits it.
  assert.match(css, /\.review\{[^}]*font-size:13px[^}]*color:var\(--muted\)/);
  assert(fragment.includes('class="review"'), "the preflight is that same aside");
  // A5's own stylesheet introduces no colour, size or spacing value of its own.
  const chrome = shell.preflightCss().replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(chrome, /#[0-9a-f]{3,8}\b/i, "a raw colour was invented");
  assert.doesNotMatch(chrome, /rgba?\(/i, "a raw colour was invented");
  assert.match(chrome, /var\(--green\)/, "the one colour it sets is the approved --green");
  // Every measurement it does set is a value the approved stylesheets already declare.
  const declared = [...chrome.matchAll(/:\s*(\d+px|\d{3})\b/g)].map((m) => m[1]);
  assert(declared.length > 0, "the check has nothing to check");
  for (const value of new Set(declared)) {
    assert(css.includes(value), `SPACING FAIL: ${value} is not a value the approved design declares`);
  }
});

test("the preflight carries no figure of its own: every number on it comes from this device", () => {
  for (const line of design.textOf(shell.preflightHtml())) {
    assert.doesNotMatch(line, /\d/, `the preflight carries a literal figure: "${line}"`);
  }
});

test("the preflight never says offline-ready without a verified answer", () => {
  // Comments are stripped: what runs is what is checked.
  const source = shell.preflightJs().replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  assert.equal((source.match(/offline-ready/g) || []).length, 1, "'offline-ready' is written in one place only");
  assert.equal((source.match(/say\(true,/g) || []).length, 1, "there is exactly one path to a ready state");
  // The one true-state call sits inside the branch that has a status object AND its ready flag.
  const ready = source.indexOf("if (status && status.ready)");
  assert(ready > 0 && source.indexOf("say(true,") > ready, "the ready state is not gated on a verified status");
  assert(source.indexOf("say(true,") < source.indexOf("if (status) {"), "the gate is the wrong branch");
  // Every other outcome — no support, no secure context, no controller, no answer,
  // a partial install — says "not yet" and gives the reason.
  assert.equal((source.match(/'not yet'/g) || []).length, 6);
  assert(source.includes("EARNED_CACHE_STATUS"), "it asks the worker rather than guessing");
  assert.doesNotMatch(source, /localStorage|indexedDB|fetch\(/, "the preflight touches the athlete's record");
});

test("the iOS guidance is the one thing the approved design cannot supply, and it says so", () => {
  const fragment = shell.preflightHtml();
  assert.match(fragment, /Add to Home Screen/);
  assert.match(fragment, /Safari/);
  const approved = design.readApproved(ROOT).map((a) => a.html).join("\n");
  assert(!approved.includes("Add to Home Screen"),
    "if the approved design ever gains this screen, bind to it instead of owning the words");
  /* review F5: it is GUIDANCE — where the control is — and must promise nothing about
     what happens after the tap. No iPhone has confirmed this build's installed behaviour,
     so the page may not describe it. */
  const guidance = design.textOf(fragment).find((line) => /Add to Home Screen/.test(line));
  assert.equal(guidance, "On iPhone: in Safari, tap Share, then Add to Home Screen.");
  for (const claim of [/launch/i, /\bwill\b/i, /signal/i, /offline/i, /work/i, /then opens/i]) {
    assert.doesNotMatch(guidance, claim, "the guidance claims a result: " + guidance);
  }
  // It is hidden once Earned already launches from the Home Screen.
  assert.match(shell.preflightCss(), /@media \(display-mode: standalone\)/);
  assert.match(shell.preflightJs(), /display-mode: standalone/);
});

/* ------------------------------------------------- the two edits to A1's built page -- */

const A1_SHELL = fs.readFileSync(path.join(ROOT, "rebuild/m3/w7-preview/today/index.shell.html"), "utf8")
  .replace("<!-- APPROVED_TEMPLATES -->", "<template id=\"t-today\"></template>");

test("the built page becomes installable: a manifest, an icon, a worker and the preflight", () => {
  const html = shell.installableHtml(A1_SHELL, NAMES);
  assert(html.includes(`<link rel="manifest" href="${pwa.MANIFEST_FILE}">`));
  assert(html.includes(`<meta name="theme-color" content="${pwa.THEME_COLOR}">`));
  assert(html.includes('<link rel="apple-touch-icon" href="icon-180.png">'));
  assert(html.includes(`<script src="${NAMES.preflightJs}" defer></script>`));
  assert(html.includes(`<script type="module" src="${NAMES.app}"></script>`));
  assert(html.includes('id="pwa-preflight"'));
  // The unhashed names are gone, so nothing can be served stale from a shared URL.
  assert(!html.includes('href="styles.css"') && !html.includes('src="app.js"'));
  // A1's own page is otherwise byte-for-byte what it was.
  assert(html.includes('<div class="view" id="phone">'));
  /* P1 (DECISIONS:114 (1)): A1's tab title lost its em dash in the no-dashes sweep. This
     pin moves with it and stays a LITERAL title, because its job is to fail when A1's
     shell moves. */
  assert(html.includes("<title>Earned: Today</title>"));
  assert.equal(html.split("<template").length, A1_SHELL.split("<template").length);
});

/* P1 (DECISIONS:114 (1), owner verbatim "no ai dashes are allowed in the ui"): A5 ships
   the SAME page, so the owner's rule does not stop at A1's folder. Every string A5 emits
   into the installable HTML, the manifest and the preflight is its own copy, and none of
   it may carry U+2013 or U+2014. Comments are exempt by the brief, exactly as A1's own
   build guard exempts them. */
const AI_DASH = /[–—]/;
const outsideComments = (text, kind) => (kind === "html"
  ? text.replace(/<!--[\s\S]*?-->/g, " ")
  : text.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " "));

const dashCount = (text, kind) => (outsideComments(String(text), kind).match(/[–—]/g) || []).length;

/* TWO EXCEPTIONS, PINNED RATHER THAN HIDDEN. A5's own preflight copy carries two
   user-facing dashes of its own:
     preflight.html  "<strong>Offline launch</strong> — <span data-pwa="state">..."
     preflight.js    "...are stored on this device — everything the launch needs is here."
   P1's custody for this fix is THESE TWO TEST FILES only (the PM's ruling on the P1
   review), so P1 does not rewrite A5's source. They are pinned at exactly two here, so a
   THIRD one fails this suite, and they are named for the A5 lane in
   rebuild/slice/P1-REPORT.md. Everything else A5 emits must be clean now. */
const A5_OWN_PREFLIGHT_DASHES = 1;   // in each of preflight.html and preflight.js

test("no em dash and no en dash in anything A5 puts on the athlete's screen", () => {
  const html = shell.installableHtml(A1_SHELL, NAMES);
  assert.equal(dashCount(A1_SHELL, "html"), 0, "AI DASH in A1's shell as A5 reads it (DECISIONS:114)");
  assert.equal(dashCount(pwa.webManifest(), "js"), 0, "AI DASH in the manifest A5 writes");
  assert.equal(dashCount(shell.preflightCss(), "js"), 0, "AI DASH in A5's preflight stylesheet");
  // The two A5-owned lines, pinned: exactly one each, no more.
  assert.equal(dashCount(shell.preflightHtml(), "html"), A5_OWN_PREFLIGHT_DASHES,
    "A5's preflight markup gained or lost a dash; see P1-REPORT.md (A5-lane item)");
  assert.equal(dashCount(shell.preflightJs(), "js"), A5_OWN_PREFLIGHT_DASHES,
    "A5's preflight script gained or lost a dash; see P1-REPORT.md (A5-lane item)");
  /* The page A5 emits = A1's page + A5's preflight block. So the ONLY dash it may carry
     is the one A5's own preflight markup contributes, and none from A1. */
  assert.equal(dashCount(html, "html"), A5_OWN_PREFLIGHT_DASHES,
    "AI DASH in the installable HTML A5 emits, beyond A5's own pinned preflight line");
  /* ... and that one dash is A5's own "Offline launch" line, not something from A1. */
  const page = outsideComments(html, "html");
  const at = page.search(/[–—]/);
  assert(at > 0 && page.slice(Math.max(0, at - 60), at).includes("Offline launch"),
    "the page's one dash is not A5's pinned preflight line: " + JSON.stringify(page.slice(at - 60, at + 60)));
  // RED FIRST: the sweep really would catch one more.
  assert.equal(dashCount(html.replace("<title>", "<title>—"), "html"), A5_OWN_PREFLIGHT_DASHES + 1);
});

test("an upstream change to A1's shell fails this build instead of shipping a page with no worker", () => {
  for (const broken of [
    A1_SHELL.replace('<link rel="stylesheet" href="styles.css">', '<link rel="stylesheet" href="main.css">'),
    A1_SHELL.replace('<script type="module" src="app.js"></script>', "<script src=\"app.js\"></script>"),
    A1_SHELL.replace("</main>", "</div>"),
    A1_SHELL + A1_SHELL,
  ]) {
    assert.throws(() => shell.installableHtml(broken, NAMES), /SHELL-EDIT FAIL/);
  }
  assert.throws(() => shell.headerRules({ ...NAMES, index: "home.html" }), /the shell must stay index\.html/);
});
