import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { randomBytes } from "node:crypto";
import { initial, config, createT2Stage } from "./support.mjs";
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let chromium;
try { ({ chromium } = require(process.env.W6_PLAYWRIGHT_DIR || "playwright-core")); }
catch { console.log("W6 BROWSER-REPOSITORY BLOCKED — pinned playwright-core unavailable"); process.exit(2); }
const executablePath = process.env.W6_BROWSER_BIN;
if (!executablePath || !fs.existsSync(executablePath)) {
  console.log("W6 BROWSER-REPOSITORY BLOCKED — set W6_BROWSER_BIN to an installed Chromium browser executable"); process.exit(2);
}

const scratch = path.join(root, ".tmp"); fs.mkdirSync(scratch, { recursive: true });
const profile = fs.mkdtempSync(path.join(scratch, "browser-repository-"));
const rawKey = Array.from(randomBytes(32)); // Per-run synthetic key, kept in process memory only.
const seed = initial(), stage = createT2Stage(config);
const candidate = JSON.parse(JSON.stringify(stage(seed, "weighIn", { lb: 170.6 }).generation));
const server = http.createServer((request, response) => {
  if (request.url === "/repository.mjs") {
    response.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-store" });
    response.end(fs.readFileSync(path.join(root, "repository.mjs"))); return;
  }
  if (request.url === "/") { response.writeHead(200, { "Content-Type": "text/html", "Cache-Control": "no-store" }); response.end("<!doctype html><title>W6 synthetic repository test</title><p>Storage test only</p>"); return; }
  response.writeHead(404); response.end();
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let context;
let cases = 0;
const passed = () => { cases++; };
async function launch() {
  context = await chromium.launchPersistentContext(profile, { executablePath, headless: true });
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  return setup(await context.newPage());
}
async function setup(page) {
  await page.goto(origin);
  await page.evaluate(async ({ rawKey }) => {
    const { openRepository } = await import("/repository.mjs");
    const key = await crypto.subtle.importKey("raw", new Uint8Array(rawKey), { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
    window.repo = await openRepository({ databaseName: "w6-synthetic", namespace: "synthetic-athlete/device-A", keyProvider: () => key,
      authorizeEnrollment: evidence => evidence === "synthetic-enrollment-only" });
  }, { rawKey });
  return page;
}
try {
  let page = await launch();
  const version = context.browser().version();
  assert.equal(await page.evaluate(async () => { try { await repo.load(); return null; } catch (error) { return error.state; } }), 18); passed();
  await page.evaluate(async seed => repo.initialize(seed, "synthetic-enrollment-only"), seed);
  const commit = await page.evaluate(async next => repo.commit(await repo.load(), next), candidate);
  assert.equal(commit.revision, 2); assert.equal(commit.durability.requested, "strict");
  assert.deepEqual(await page.evaluate(async () => (await repo.load()).generation), candidate); passed();
  await context.close(); context = null;
  page = await launch();
  assert.deepEqual(await page.evaluate(async () => (await repo.load()).generation), candidate); passed();

  // Distinct tabs/connections stage from the same revision. Only one full candidate may commit.
  const second = await setup(await context.newPage());
  await Promise.all([page, second].map(p => p.evaluate(async () => { window.loaded = await repo.load(); })));
  const nextA = JSON.parse(JSON.stringify(stage(candidate, "weighIn", { lb: 170.7 }).generation));
  const nextB = JSON.parse(JSON.stringify(stage(candidate, "weighIn", { lb: 170.8 }).generation));
  const race = await Promise.all([[page, nextA], [second, nextB]].map(([p, next]) => p.evaluate(async value => {
    try { return { ok: true, result: await repo.commit(loaded, value) }; }
    catch (error) { return { ok: false, code: error.code, state: error.state }; }
  }, next)));
  assert.equal(race.filter(result => result.ok).length, 1);
  assert.equal(race.find(result => !result.ok).code, "STALE_REVISION"); passed();

  const beforeAbort = await page.evaluate(async () => await repo.load());
  const aborted = await page.evaluate(async () => {
    try { await repo.commit(await repo.load(), loaded.generation, () => ({ state: 17, code: "SYNTHETIC_STANDING_FAULT" })); return null; }
    catch (error) { return { code: error.code, state: error.state }; }
  });
  assert.equal(aborted.state, 17);
  assert.deepEqual(await page.evaluate(async () => await repo.load()), beforeAbort); passed();

  // Corrupt the real on-disk ciphertext, close the process, then prove state18 on a fresh process.
  await page.evaluate(async () => {
    const database = await new Promise((resolve, reject) => { const r = indexedDB.open("w6-synthetic", 1); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
    await new Promise((resolve, reject) => {
      const tx = database.transaction("generations", "readwrite"), store = tx.objectStore("generations"), request = store.get("active");
      request.onsuccess = () => { const value = request.result; new Uint8Array(value.ciphertext)[0] ^= 1; store.put(value, "active"); };
      tx.oncomplete = resolve; tx.onabort = () => reject(tx.error);
    }); database.close();
  });
  await context.close(); context = null; page = await launch();
  assert.equal(await page.evaluate(async () => { try { await repo.load(); return null; } catch (error) { return error.state; } }), 18); passed();
  console.log(`W6 BROWSER-REPOSITORY PASS — ${cases}/6 real IndexedDB cases; Chromium ${version}; persistent process reopen, two-tab CAS, abort and tamper18`);
  console.log("W6 browser-T2 / iPhone / CLOCK acceptance NOT RUN — repository-only synthetic evidence");
} catch (error) {
  console.log("W6 BROWSER-REPOSITORY FAIL — " + (error.name || "Error"));
  process.exitCode = 1;
} finally {
  if (context) await context.close();
  await new Promise(resolve => server.close(resolve));
}
