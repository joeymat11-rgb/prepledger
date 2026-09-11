"use strict";

/* A1 — the shipped package: three assets, a pinned approved design, a bundle that
   carries the real engine and the real client and nothing forbidden, and a local server
   that cannot reach the repository.

   This file needs rebuild/m3/w6's own dependencies (the browser build and the SHA-256
   boundary the phone host already uses). It is NOT part of the root-lockfile CI job for
   the same reason the W6 browser build is not; it is run on the PC and reported there. */

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const fss = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { test, before, after } = require("node:test");

let build, result, serve, server, port;

before(async () => {
  build = await import(pathToFileURL(path.resolve(__dirname, "../build.mjs")).href);
  result = await build.buildToday();
  serve = await import(pathToFileURL(path.resolve(__dirname, "../serve.mjs")).href);
  server = await serve.startServer({ port: 0 });
  port = server.address().port;
});
after(async () => { if (server) await new Promise((res, rej) => server.close((e) => (e ? rej(e) : res()))); });

function request(target, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port, path: target, method }, (response) => {
      const chunks = [];
      response.on("data", (c) => chunks.push(c));
      response.on("end", () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks).toString("utf8") }));
    });
    req.on("error", reject);
    req.end();
  });
}

test("the built package is exactly the three reviewed assets", async () => {
  assert.deepEqual((await fs.readdir(build.DIST)).sort(), ["app.js", "index.html", "styles.css"]);
  assert.deepEqual(result.assets, ["index.html", "styles.css", "app.js"]);
});

test("the approved design is pinned by sha256 and a changed byte fails the build", async () => {
  const approved = await build.readApproved();
  assert.equal(approved.length, 2);
  assert.deepEqual(result.approved, build.APPROVED.map((a) => a.sha256));
  const html = await fs.readFile(path.join(build.DIST, "index.html"), "utf8");
  for (const id of ["t-today", "t-weigh", "t-why", "t-nutrition", "t-recovery", "t-coach", "t-workout"]) {
    assert(html.includes(`<template id="${id}">`), id);
  }
});

test("the bundle carries the real engine and the real client and nothing forbidden", () => {
  const inputs = result.inputs;
  for (const required of ["rebuild/engine/today.cjs", "rebuild/engine/energy.cjs", "rebuild/engine/writers.cjs",
    "rebuild/client/index.cjs", "rebuild/client/ops.cjs", "rebuild/client/store.cjs"]) {
    assert(inputs.includes(required), required);
  }
  assert.equal(inputs.filter((p) => p.startsWith("rebuild/engine/")).length, 13);
  assert.equal(inputs.filter((p) => p.startsWith("rebuild/client/")).length, 12);
  for (const forbidden of ["rebuild/engine/seed.cjs", "rebuild/engine/migrate.cjs", "rebuild/engine/merge.cjs",
    "rebuild/engine/index.cjs"]) assert(!inputs.includes(forbidden), forbidden);
  assert(!inputs.some((p) => /^rebuild\/engine\/test\//.test(p)));
  assert(!inputs.some((p) => /^rebuild\/authority\//.test(p) && p !== "rebuild/authority/canonical.cjs"));
  assert(!inputs.some((p) => /^ledger\//.test(p) || p === "src/history.js"));
  // Third-party code is limited to the SHA-256 primitive the accepted W6 boundary
  // already substitutes for node:crypto.
  for (const p of inputs.filter((p) => /node_modules/.test(p))) assert.match(p, /@noble[+/]hashes/);
  assert.throws(() => build.assertBundleInputs([{ path: "rebuild/engine/seed.cjs" }]), /BUNDLE-INPUTS FAIL/);
  assert.throws(() => build.assertBundleInputs(result.inputs.map((p) => ({ path: p })).concat([{ path: "node_modules/left-pad/index.js" }])), /unapproved dependency/);
});

test("the page fetches nothing: no remote origin in any shipped asset (review F9)", async () => {
  const html = await fs.readFile(path.join(build.DIST, "index.html"), "utf8");
  const css = await fs.readFile(path.join(build.DIST, "styles.css"), "utf8");
  const app = await fs.readFile(path.join(build.DIST, "app.js"), "utf8");
  for (const [name, text] of [["index.html", html], ["styles.css", css]]) {
    assert.doesNotMatch(text, /https?:\/\//, name + " references a remote origin");
    assert.doesNotMatch(text, /@import/, name + " imports another stylesheet");
  }
  assert.doesNotMatch(app, /fonts\.(?:googleapis|gstatic)\.com/);
  assert.equal((css.match(/@font-face/g) || []).length, 2, "both typefaces are inlined");
  assert.match(css, /src:url\(data:font\/woff2;base64,/);
  assert.equal(result.fonts.length, 2);
  for (const font of result.fonts) assert.match(font.sha256, /^[0-9a-f]{64}$/);
});

/* review D-4: the "no network reference" claim is EXECUTED by the build, and the check
   itself is shown to be able to fail. */
test("the build refuses any network reference in a shipped asset", () => {
  assert.equal(typeof build.assertNoNetworkReference, "function");
  assert.doesNotThrow(() => build.assertNoNetworkReference([["ok.css", ".a{color:#fff}"]]));
  // A data: payload is not a reference, however many slashes it contains.
  assert.doesNotThrow(() => build.assertNoNetworkReference(
    [["fonts.css", "@font-face{src:url(data:font/woff2;base64,AA//BB//CC)}"]]));
  for (const bad of [
    '<link href="https://fonts.googleapis.com/css2?family=X">',
    '<script src="http://example.com/a.js">',
    '@import url(//cdn.example.com/x.css);',
    ".a{background:url(https://example.org/b.png)}",
  ]) assert.throws(() => build.assertNoNetworkReference([["probe", bad]]), /NETWORK-REFERENCE FAIL/, bad);
});

test("no athlete data and no credential is shipped in the bundle", async () => {
  const app = await fs.readFile(path.join(build.DIST, "app.js"), "utf8");
  assert(!/ledger\/state\.json/.test(app));
  assert(!/src\/history\.js/.test(app));
  /* C4b — the last synthetic enrolment label is GONE. A2 shipped a constant
     identity key in the page and this assertion used to require it to be there
     and to say so in its own name; the local era's identity and authority keys
     are generated on the device by getRandomValues and sealed inside the
     generation they authorize, so there is nothing left to name. */
  assert(!app.includes("synthetic-preview-identity-not-a-credential"),
    "the synthetic identity label must not survive the ONE STORE swap");
  assert(!app.includes("synthetic-preview-enrolment-only"), "nor the static enrolment evidence");
  assert(!app.includes("synthetic-preview-authority"), "nor the synthetic authority kid");
  assert(!app.includes("synthetic-preview-lease"), "nor the synthetic lease id");
  /* There is no key LITERAL in the page at all: the store key is generated by
     WebCrypto on the device and is non-extractable, so nothing that could be
     copied off the device is ever written down. */
  assert(!/"d"\s*:/.test(app), "no JWK private component is shipped");
  assert(!/privateKey\s*:\s*["'`]/.test(app), "no private key literal is shipped");
  assert(!/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(app), "no PEM private key is shipped");
  for (const call of [/generateKey\(/, /"AES-GCM"|'AES-GCM'/, /getRandomValues\(/]) {
    assert(call.test(app), "the page generates its own key material: " + call);
  }
  // The generated store key is not extractable — the third argument is false.
  assert(/generateKey\(\s*\{\s*name:\s*["']AES-GCM["'],\s*length:\s*256\s*\},\s*(?:!1|false)/.test(app)
    || /generateKey\([^)]*,\s*(?:!1|false)\s*,/.test(app), "the generated key is non-extractable");
});

test("an extra build asset blocks serving and a rebuild removes only that extra file", async () => {
  const extra = path.join(build.DIST, "unapproved-test-asset.txt");
  await fs.writeFile(extra, "package boundary probe");
  try {
    await assert.rejects(serve.startServer({ port: 0 }), /unapproved assets/);
    await build.buildToday();
    await assert.rejects(fs.access(extra), { code: "ENOENT" });
    assert.deepEqual((await fs.readdir(build.DIST)).sort(), ["app.js", "index.html", "styles.css"]);
  } finally {
    await fs.unlink(extra).catch((e) => { if (e.code !== "ENOENT") throw e; });
  }
});

test("the local server serves the three assets on 127.0.0.1 with no application network", async () => {
  assert.equal(server.address().address, "127.0.0.1");
  for (const name of ["/", "/index.html", "/styles.css", "/app.js"]) {
    const response = await request(name);
    assert.equal(response.status, 200, name);
    assert.match(response.headers["cache-control"], /no-store/);
    const csp = response.headers["content-security-policy"];
    assert.match(csp, /connect-src 'none'/);
    assert.match(csp, /worker-src 'none'/);
    // review F9: the policy names no external origin, which is also the proof that an
    // offline launch has nothing left to fetch.
    assert.doesNotMatch(csp, /https?:/, name + " policy still names a remote origin");
    assert.match(csp, /font-src data:/);
    assert.equal(response.headers["x-content-type-options"], "nosniff");
  }
  const head = await request("/", "HEAD");
  assert.equal(head.status, 200);
  assert.equal(head.body, "");
});

test("source, private paths, traversal and writes cannot reach the repository", async () => {
  for (const target of ["/ledger/state.json", "/src/app.jsx", "/src/history.js", "/rebuild/engine/seed.cjs",
    "/package.json", "/app.js.map", "/sw.js", "/.env"]) {
    const response = await request(target);
    assert.equal(response.status, 404, target);
    assert.equal(response.body, "Not found");
  }
  for (const target of ["/../ledger/state.json", "/%2e%2e/ledger/state.json", "/%2E%2E%2Fledger/state.json",
    "/%5c..%5cledger/state.json", "/%00", "/%zz", "//outside/app.js"]) {
    const response = await request(target);
    assert.equal(response.status, 400, target);
    assert.equal(response.body, "Invalid request path");
  }
  const write = await request("/", "POST");
  assert.equal(write.status, 405);
  assert.equal(write.headers.allow, "GET, HEAD");
});

test("the sibling w7-preview package is untouched by this build", async () => {
  const preview = await import(pathToFileURL(path.resolve(__dirname, "../../build.mjs")).href);
  assert.equal(preview.MOCK_SHA256, "e742d6b89cfc34d0a23004fd9257252136adb1f44e38a4a2a41aa9ba6f617563");
  assert.notEqual(path.resolve(preview.DIST), path.resolve(build.DIST), "the two builds own different folders");
  assert(fss.existsSync(path.join(path.resolve(__dirname, "../../test"), "package.test.cjs")));
});
