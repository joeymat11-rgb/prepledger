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

test("no athlete data and no credential is shipped in the bundle", async () => {
  const app = await fs.readFile(path.join(build.DIST, "app.js"), "utf8");
  assert(!/ledger\/state\.json/.test(app));
  assert(!/src\/history\.js/.test(app));
  // Every key in the page is a synthetic literal that says so in its own name.
  for (const marker of ["synthetic-preview-identity-not-a-credential", "synthetic-preview-authority-not-a-credential"]) {
    assert(app.includes(marker), marker);
  }
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
    assert.match(response.headers["content-security-policy"], /connect-src 'none'/);
    assert.match(response.headers["content-security-policy"], /worker-src 'none'/);
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
