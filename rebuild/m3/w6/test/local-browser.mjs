// local-browser.mjs — the LOCAL-ERA client in a REAL browser on REAL IndexedDB.
//
// What only a browser can show: that the durable save survives the whole
// browser context going away and a new one opening on the same profile
// directory (the kill/reopen proof), and that two tabs of the same installation
// racing one revision lose no operation. Exit 2 = BLOCKED (no browser), never a
// silent pass.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { buildLocalBrowser } from "../local/build.mjs";
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let chromium;
try { ({ chromium } = require(process.env.W6_PLAYWRIGHT_DIR || "playwright-core")); }
catch { console.log("W6 LOCAL-BROWSER BLOCKED — pinned playwright-core unavailable"); process.exit(2); }
const executablePath = process.env.W6_BROWSER_BIN;
if (!executablePath || !fs.existsSync(executablePath)) {
  console.log("W6 LOCAL-BROWSER BLOCKED — set W6_BROWSER_BIN to an installed Chromium/Edge executable"); process.exit(2);
}

const scratch = path.join(root, ".tmp/local-browser");
fs.rmSync(scratch, { recursive: true, force: true });
fs.mkdirSync(scratch, { recursive: true });
const bundle = path.join(scratch, "local.js");
const built = await buildLocalBrowser({ outfile: bundle });
const profile = fs.mkdtempSync(path.join(scratch, "profile-"));
const source = fs.readFileSync(bundle);

const server = http.createServer((request, response) => {
  if (request.url === "/local.js") {
    response.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-store" });
    response.end(source); return;
  }
  if (request.url === "/") {
    response.writeHead(200, { "Content-Type": "text/html", "Cache-Control": "no-store" });
    response.end("<!doctype html><title>W6 local-era durable save</title><p>Local durable save test only</p>"); return;
  }
  response.writeHead(404); response.end();
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const SETUP = { databaseName: "earned-local-browser", namespace: "joe/phone-A", athleteId: "ath-1", deviceId: "dev-phone-A" };

let context = null, cases = 0;
const passed = () => { cases++; };
async function open(dayOffset = 0) {
  context = await chromium.launchPersistentContext(profile, { executablePath, headless: true });
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  return attach(await context.newPage(), dayOffset);
}
async function attach(page, dayOffset = 0) {
  await page.goto(origin);
  await page.evaluate(async ({ setup, dayOffset }) => {
    const { openLocalDurableClient } = await import("/local.js");
    // The clock is built here: functions cannot cross the evaluate boundary.
    // dayOffset moves this context's wall clock forward, which is how the lease
    // self-renewal is exercised against a real durable commit.
    const at = () => new Date(Date.now() + dayOffset * 86400000).toISOString();
    window.client = await openLocalDurableClient({ ...setup,
      clock: { now: at, today: () => at().slice(0, 10), tz: "+00:00", monotonicMs: () => performance.now() } });
  }, { setup: SETUP, dayOffset });
  return page;
}
try {
  let page = await open();
  const version = context.browser().version();

  assert.deepEqual(await page.evaluate(() => client.status()), { state: "first-run", code: "LOCAL_FIRST_RUN" });
  const enrolled = await page.evaluate(() => client.enroll({ profile: "host-clean-init" }));
  assert.equal(enrolled.enrolled, true);
  assert.equal(enrolled.leaseId, `local-era:${enrolled.eraId}`); passed();

  const saved = await page.evaluate(() => client.execute("weighIn", { lb: 170.6 }));
  assert.equal(saved.acknowledged, true);
  assert.equal(saved.durableRevision, 2);
  assert.equal(saved.op_id, "op-dev-phone-A-1"); passed();

  // The whole browser context goes away — process, page, every in-memory handle.
  await context.close(); context = null;
  page = await open();
  assert.deepEqual(await page.evaluate(() => client.status()), { state: "ready", code: "LOCAL_PRESENT" });
  const booted = await page.evaluate(() => client.boot());
  assert.equal(booted.ready, true);
  assert.equal(booted.revision, 2);
  assert.equal(booted.ops, 1);
  assert.equal(booted.eraId, enrolled.eraId);
  assert.deepEqual(booted.derived, { profile: "host-clean-init" });
  assert.deepEqual(booted.view.layer1.reads.map(read => read.lb), [170.6]); passed();
  assert.equal((await page.evaluate(() => client.enroll())).enrolled, false); passed();

  // Two tabs of the same installation, each with its own factory, racing one
  // revision. Neither operation may be lost.
  const second = await attach(await context.newPage());
  const race = await Promise.all([[page, 171.1], [second, 171.2]].map(([target, lb]) =>
    target.evaluate(value => client.execute("weighIn", { lb: value }), lb)));
  assert.deepEqual(race.map(result => result.acknowledged), [true, true]);
  const after = await page.evaluate(() => client.boot());
  assert.equal(after.ops, 3);
  assert.equal(after.revision, 4);
  assert.deepEqual(after.view.layer1.reads.map(read => read.lb).sort(), [170.6, 171.1, 171.2]); passed();

  // A read after the tabs close, from a third context: still every operation.
  await context.close(); context = null;
  page = await open();
  const final = await page.evaluate(() => client.boot());
  assert.equal(final.ops, 3);
  assert.equal(final.revision, 4);
  const resumed = await page.evaluate(() => client.resumeAfterKill());
  assert.equal(resumed.line, "No sets saved yet.");
  assert.equal(resumed.ghost, false); passed();

  // Day 201 in a real browser: the still-valid lease is re-signed for another 400
  // days and that renewal is a genuine durable commit on this profile.
  await context.close(); context = null;
  page = await open(201);
  const renewed = await page.evaluate(() => client.boot());
  assert.equal(renewed.ready, true);
  assert.equal(renewed.leaseRenewalCode, null);
  assert.equal(typeof renewed.leaseRenewedUntil, "string");
  assert.ok(Date.parse(renewed.leaseRenewedUntil) > Date.parse(final.notAfter));
  assert.equal(renewed.leaseId, enrolled.leaseId);
  assert.equal(renewed.revision, final.revision + 1);
  assert.equal((await page.evaluate(() => client.execute("weighIn", { lb: 171.3 }))).acknowledged, true); passed();

  // Day 402 — past the original cliff, on a real browser, with the renewal durable.
  await context.close(); context = null;
  page = await open(402);
  assert.deepEqual(await page.evaluate(() => client.status()), { state: "ready", code: "LOCAL_PRESENT" });
  const past = await page.evaluate(() => client.boot());
  assert.equal(past.ready, true);
  assert.equal(past.ops, 4);
  assert.equal((await page.evaluate(() => client.execute("weighIn", { lb: 171.4 }))).acknowledged, true); passed();

  console.log(`W6 LOCAL-BROWSER PASS — ${cases}/8 real IndexedDB cases; ${version}; ` +
    `enroll + durable save, whole-context reopen, two-tab race, third-context read, durable lease renewal past day 401; ` +
    `${built.inventory.length} pinned bundle inputs`);
  console.log("W6 iPhone / iOS Safari acceptance NOT RUN — Chromium-family evidence only (C3)");
} catch (error) {
  console.log("W6 LOCAL-BROWSER FAIL — " + (error?.message || error?.name || "Error"));
  process.exitCode = 1;
} finally {
  if (context) await context.close();
  await new Promise(resolve => server.close(resolve));
}
