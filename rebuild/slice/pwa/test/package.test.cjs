"use strict";

/* A5 — the deployable folder itself: what the build really emits, what the host really
   sends, and the one claim that matters most — the service worker's cache name is a
   function of the built bytes, so a rebuilt asset can never be served from an old cache.

   This file needs rebuild/m3/w6's own dependencies (A1's build runs the same browser
   build the phone host uses), exactly as A1's own package test does. The lockfile-free
   half is ./pwa.test.cjs. */

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const fss = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { test, before, after } = require("node:test");

const pwa = require("../pwa.cjs");
const shell = require("../shell.cjs");

let build, site, serve, server, port, a1;

before(async () => {
  build = await import(pathToFileURL(path.resolve(__dirname, "../build-pwa.mjs")).href);
  site = await build.buildSite();
  a1 = site.today;
  serve = await import(pathToFileURL(path.resolve(__dirname, "../serve-pwa.mjs")).href);
  server = await serve.startServer({ port: 0 });
  port = server.address().port;
});
after(async () => { if (server) await new Promise((res, rej) => server.close((e) => (e ? rej(e) : res()))); });

function request(target, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port, path: target, method }, (response) => {
      const chunks = [];
      response.on("data", (c) => chunks.push(c));
      response.on("end", () => resolve({ status: response.statusCode, headers: response.headers,
        body: Buffer.concat(chunks) }));
    });
    req.on("error", reject);
    req.end();
  });
}

test("the deployable folder is exactly the files this build declares", async () => {
  const onDisk = (await fs.readdir(build.DIST)).sort();
  assert.deepEqual(onDisk, [...site.files.keys()].sort());
  for (const name of onDisk) {
    assert.equal(pwa.sha256(await fs.readFile(path.join(build.DIST, name))), site.sha256[name], name);
  }
  // The shell, the worker, the manifest, the headers, four icons and the SVG, plus the
  // four content-hashed assets.
  assert(onDisk.includes("index.html") && onDisk.includes("sw.js"));
  assert(onDisk.includes(pwa.MANIFEST_FILE) && onDisk.includes(pwa.HEADERS_FILE));
  for (const icon of pwa.ICON_FILES) assert(onDisk.includes(icon.name), icon.name);
  assert.equal(onDisk.filter((n) => /\.[0-9a-f]{16}\.(js|css)$/.test(n)).length, 4);
});

test("the precache list IS the build output — no drift is possible", async () => {
  const served = (await fs.readdir(build.DIST)).filter((n) => n !== pwa.SERVICE_WORKER && n !== pwa.HEADERS_FILE);
  assert.deepEqual(site.precache.map((e) => e.path).sort(), served.sort());
  for (const entry of site.precache) {
    assert.equal(entry.sha256, pwa.sha256(await fs.readFile(path.join(build.DIST, entry.path))), entry.path);
  }
  // The worker never precaches itself (it is served no-store) and never the headers
  // (Netlify reads those as configuration and never serves them).
  assert(!site.precache.some((e) => e.path === pwa.SERVICE_WORKER || e.path === pwa.HEADERS_FILE));
});

test("the cache name in the shipped worker is derived from the shipped bytes", async () => {
  const fromDisk = [];
  for (const entry of [...site.precache].sort((x, y) => (x.path < y.path ? -1 : 1))) {
    fromDisk.push({ path: entry.path, sha256: pwa.sha256(await fs.readFile(path.join(build.DIST, entry.path))) });
  }
  const derived = pwa.cacheName(fromDisk);
  assert.equal(derived, site.cache);
  const worker = await fs.readFile(path.join(build.DIST, pwa.SERVICE_WORKER), "utf8");
  assert(worker.includes(`"${derived}"`), "the worker names a cache these bytes did not produce");
  assert.doesNotMatch(worker, /__EARNED_/);
  // The whole APP_V bug class in one assertion: change any shipped byte, and the name
  // this test recomputes stops matching the one in the worker.
  const tampered = fromDisk.map((e, i) => (i === 0 ? { ...e, sha256: "0".repeat(64) } : e));
  assert.notEqual(pwa.cacheName(tampered), derived);
});

test("REBUILDING a changed asset changes the cache name, the file name and the page", async () => {
  // A1's three built assets are copied, ONE byte is added to the bundle, and the same
  // compose step runs again. Nothing in A1's own folder is touched.
  const probe = path.join(build.ROOT, ".tmp/a5-rebuild-probe");
  await fs.rm(probe, { recursive: true, force: true });
  await fs.mkdir(probe, { recursive: true });
  for (const name of ["index.html", "styles.css", "app.js"]) {
    await fs.copyFile(path.join(a1.dist, name), path.join(probe, name));
  }
  await fs.appendFile(path.join(probe, "app.js"), "\n// one more byte\n");
  const rebuilt = await build.composeSite({ a1: { dist: probe } });
  try {
    assert.notEqual(rebuilt.cache, site.cache, "a rebuilt asset left the cache name behind");
    assert.notEqual(rebuilt.names.app, site.names.app, "the bundle kept its URL after changing");
    const before = site.files.get("index.html").toString("utf8");
    const after = rebuilt.files.get("index.html").toString("utf8");
    assert.notEqual(after, before, "the page still points at the old bundle");
    assert(after.includes(rebuilt.names.app) && !after.includes(site.names.app));
    // Everything that did NOT change keeps its URL, so a returning device re-downloads
    // only what actually moved.
    assert.equal(rebuilt.names.styles, site.names.styles);
    assert.equal(rebuilt.names.preflightJs, site.names.preflightJs);
    // ... and the old cache is not merely renamed: the new worker deletes it on activate.
    assert(rebuilt.files.get(pwa.SERVICE_WORKER).toString("utf8").includes("caches.delete"));
  } finally {
    await fs.rm(probe, { recursive: true, force: true });
  }
});

test("the private guard runs on the real folder and would refuse a planted file", async () => {
  const real = [];
  for (const name of await fs.readdir(build.DIST)) real.push([name, await fs.readFile(path.join(build.DIST, name))]);
  assert.doesNotThrow(() => pwa.assertNothingPrivate(real, site.sources));
  assert.equal(pwa.assertNothingPrivate(real, site.sources).files, real.length);
  // Everything A1 copied in came from A1's own build folder, nothing private.
  for (const from of Object.values(site.sources)) assert.match(from, /^\.tmp\/w7-today-dist\//);
  // Plant a credential and a private path IN THE FOLDER and watch the build refuse.
  for (const planted of [["leak.js", "const t='ghp_" + "A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8" + "';"],
    ["notes.txt", "copied out of ledger/state.json"],
    ["rebuild/conform/private/live.json", "{}"]]) {
    assert.throws(() => pwa.assertNothingPrivate([...real, planted], site.sources), /PRIVATE-GUARD FAIL/, planted[0]);
  }
  assert.throws(() => pwa.assertNothingPrivate(real, { ...site.sources, "index.html": "ledger/state.json" }),
    /PRIVATE-GUARD FAIL/);
});

test("no shipped byte in the whole folder names an address the browser could act on", async () => {
  const files = [];
  for (const name of await fs.readdir(build.DIST)) files.push([name, await fs.readFile(path.join(build.DIST, name))]);
  assert.equal(shell.assertNoNetworkReference(files), files.length);
  const svg = await fs.readFile(path.join(build.DIST, pwa.ICON_SVG), "utf8");
  assert.equal((svg.match(/https?:\/\//g) || []).length, 1, "only the SVG namespace, and only there");
});

test("the host sends exactly the headers the _headers file declares", async () => {
  const rules = serve.parseHeaders(await fs.readFile(path.join(build.DIST, pwa.HEADERS_FILE), "utf8"));
  for (const [target, declared] of rules) {
    const response = await request(target);
    assert.equal(response.status, 200, target);
    for (const [name, value] of Object.entries(declared)) {
      assert.equal(response.headers[name.toLowerCase()], value, `${target} ${name}`);
    }
  }
  const worker = await request("/" + pwa.SERVICE_WORKER);
  assert.equal(worker.headers["cache-control"], "no-store");
  assert.match(worker.headers["content-security-policy"], /connect-src 'self'/);
  assert.equal(worker.headers["content-type"], "text/javascript; charset=utf-8");
  const page = await request("/");
  assert.equal(page.headers["content-type"], "text/html; charset=utf-8");
  assert.match(page.headers["content-security-policy"], /worker-src 'self'/);
  assert.match(page.headers["content-security-policy"], /connect-src 'none'/);
  const manifest = await request("/" + pwa.MANIFEST_FILE);
  assert.equal(manifest.headers["content-type"], "application/manifest+json; charset=utf-8");
  JSON.parse(manifest.body.toString("utf8"));
  const immutable = await request("/" + site.names.app);
  assert.equal(immutable.headers["cache-control"], shell.IMMUTABLE);
});

test("the host serves the folder and nothing else, and answers no write", async () => {
  assert.equal(server.address().address, "127.0.0.1");
  // _headers is configuration: Netlify never serves it and neither does this host.
  for (const target of ["/_headers", "/ledger/state.json", "/src/history.js", "/package.json",
    "/rebuild/engine/seed.cjs", "/styles.css", "/app.js"]) {
    assert.equal((await request(target)).status, 404, target);
  }
  for (const target of ["/../ledger/state.json", "/%2e%2e/ledger/state.json", "/%00", "//outside/app.js"]) {
    assert.equal((await request(target)).status, 400, target);
  }
  assert.equal((await request("/", "POST")).status, 405);
});

test("A1's own package is untouched: three assets, its own folder, its own names", async () => {
  assert.deepEqual((await fs.readdir(a1.dist)).sort(), ["app.js", "index.html", "styles.css"]);
  assert.notEqual(path.resolve(a1.dist), path.resolve(build.DIST), "the two builds own different folders");
  // This step ADDS a folder; it does not edit A1's source.
  const today = path.resolve(__dirname, "../../../m3/w7-preview/today");
  const names = fss.readdirSync(today).sort();
  assert(!names.some((n) => /pwa|manifest|sw\.js|_headers/.test(n)), "A5 wrote into A1's folder");
  assert(names.includes("build.mjs") && names.includes("browser-check.mjs"));
  // A1's page bytes go through unchanged except the two named edits.
  const before = (await fs.readFile(path.join(a1.dist, "index.html"), "utf8"));
  const after = site.files.get("index.html").toString("utf8");
  for (const marker of ["<title>Earned — Today</title>", '<div class="view" id="phone">', "<template id=\"t-today\">"]) {
    assert(before.includes(marker) && after.includes(marker), marker);
  }
  assert.equal(site.files.get(site.names.styles).equals(await fs.readFile(path.join(a1.dist, "styles.css"))), true);
  assert.equal(site.files.get(site.names.app).equals(await fs.readFile(path.join(a1.dist, "app.js"))), true);
});

test("the build's own summary is true: counts, colours and the guard", () => {
  assert.equal(site.files.size, 13);
  assert.equal(site.precache.length, 11);
  assert.equal(site.rules.length, 13);
  assert.equal(site.colours.theme, pwa.THEME_COLOR);
  assert.equal(site.guard.files, 13);
  assert.equal(site.guard.shapes, pwa.TOKEN_SHAPES.length);
  assert.match(site.cache, /^earned-slice-[0-9a-f]{32}$/);
});
