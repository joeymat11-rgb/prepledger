// OPTIONAL, PC-only: the one claim a Node test cannot make — in a REAL browser, over the
// REAL response headers, the built folder installs its service worker, and then, with the
// network switched off, Earned still opens and a weigh-in is still recorded and survives a
// reload.
//
// It installs nothing. Point W7_BROWSER_BIN at an existing Chromium/Chrome executable (the
// same variable A1's browser check uses); without it this says so and exits 0 with a clear
// NOT RUN line, so it can never be mistaken for a pass. playwright-core comes from
// rebuild/m3/w6's own dependencies.
//
//   node rebuild/slice/pwa/build-pwa.mjs
//   set W7_BROWSER_BIN=C:\Users\<you>\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe
//   node rebuild/slice/pwa/browser-offline-check.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "./serve-pwa.mjs";
import { buildSite } from "./build-pwa.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const executablePath = process.env.W7_BROWSER_BIN;
if (!executablePath) {
  console.log("A5 OFFLINE LAUNCH CHECK NOT RUN — set W7_BROWSER_BIN to a Chromium executable. "
    + "This is not a pass.");
  process.exit(0);
}
const require = createRequire(path.join(here, "../../m3/w6/package.json"));
const { chromium } = require("playwright-core");

const VIEWPORT = { width: 390, height: 844 };
const site = await buildSite();
const server = await startServer({ port: 0 });
const url = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({ executablePath, headless: true });
let failures = 0;
const problems = [];

const readState = (page) => page.evaluate(() => ({
  state: document.querySelector('[data-pwa="state"]').textContent.trim(),
  ready: document.querySelector('[data-pwa="state"]').getAttribute("data-ready"),
  detail: document.querySelector('[data-pwa="detail"]').textContent.trim(),
  install: !document.querySelector('[data-pwa="install"]').hidden,
}));

try {
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  page.on("pageerror", (error) => problems.push("pageerror: " + error.message));
  // §1 below deliberately asks the PAGE to fetch its own manifest, to watch the deployed
  // connect-src 'none' refuse it. Those two refusals are the probe's result, not a fault.
  const refusals = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const where = (message.location() && message.location().url) || "";
    if (/favicon/.test(where) || /favicon/.test(message.text())) return;
    if (/connect-src 'none'|Refused to connect/.test(message.text())) { refusals.push(message.text()); return; }
    problems.push("console: " + message.text() + " @ " + where);
  });
  page.on("request", (request) => {
    if (!request.url().startsWith(url) && !request.url().startsWith("data:")) {
      problems.push("offsite request: " + request.url());
    }
  });

  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector('[data-slot="instruction"]');

  // 1 — the manifest the browser actually parsed.
  const manifestHref = await page.getAttribute('link[rel="manifest"]', "href");
  assert.equal(manifestHref, "manifest.webmanifest");
  const manifest = await page.evaluate(async (href) => (await (await fetch(href)).json()), manifestHref)
    .catch(() => null);
  // connect-src 'none' means the PAGE may not fetch; read the manifest over the wire instead.
  const manifestBody = await (await context.request.get(url + "manifest.webmanifest")).json();
  assert.equal(manifestBody.display, "standalone");
  assert.equal(manifestBody.name, "Earned");
  assert(manifest === null, "the page's own connect-src 'none' still holds");
  assert(refusals.length > 0, "the browser did not report refusing the page's fetch — is the policy applied?");

  // 2 — the worker really registered, and the preflight says offline-ready only once the
  // cache is genuinely complete.
  await page.waitForFunction(() =>
    document.querySelector('[data-pwa="state"]').getAttribute("data-ready") === "yes",
    undefined, { timeout: 20000 });
  const preflight = await readState(page);
  assert.match(preflight.state, /offline-ready/);
  assert.match(preflight.detail, new RegExp("All " + site.precache.length + " files"));
  assert.equal(preflight.install, true, "the Add to Home Screen guidance is shown in a browser tab");

  const workers = context.serviceWorkers();
  assert.equal(workers.length, 1, "exactly one service worker");
  const cacheNames = await page.evaluate(() => caches.keys());
  assert.deepEqual(cacheNames, [site.cache], "the cache is named for these built bytes");

  // 3 — OFFLINE. Everything below happens with the network switched off.
  await context.setOffline(true);
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-slot="instruction"]');
  const offlineInstruction = (await page.textContent('[data-slot="instruction"]')).trim();
  assert(offlineInstruction.length > 0, "Today rendered its instruction with no network");
  assert.equal((await page.textContent('[data-slot="morning"]')).trim(), "This morning — not logged yet");
  const kcal = (await page.textContent('[data-slot="kcal"]')).trim();
  assert.match(kcal, /\d/, "the engine's calorie figure is on screen offline");

  // 4 — a weigh-in, logged OFFLINE, reaches the screen through the real engine.
  await page.click('[data-slot="primary"]');
  await page.waitForSelector("#morning-weight");
  await page.fill("#morning-weight", "178.2");
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('[data-slot="morning"]');
  const logged = (await page.textContent('[data-slot="morning"]')).trim();
  assert.match(logged, /^This morning ✓ 178\.2 lb/, "the offline weigh-in reached the screen: " + logged);
  const trend = (await page.textContent('[data-slot="trend"]')).trim();
  const after = (await page.textContent('[data-slot="instruction"]')).trim();
  assert.notEqual(after, offlineInstruction, "the engine's instruction changed offline");

  // 5 — and survives a reload that has no network to fall back on.
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-slot="morning"]');
  assert.equal((await page.textContent('[data-slot="morning"]')).trim(), logged, "the offline reading survived");
  assert.equal((await page.textContent('[data-slot="trend"]')).trim(), trend, "the trend survived");
  const relaunched = await context.newPage();       // the app-kill path, still offline
  await relaunched.goto(url, { waitUntil: "load" });
  await relaunched.waitForSelector('[data-slot="morning"]');
  assert.equal((await relaunched.textContent('[data-slot="morning"]')).trim(), logged,
    "a new page, offline, sees the same reading");
  await relaunched.close();
  const fonts = await page.evaluate(() => document.fonts.size);
  assert(fonts >= 2, "both inlined typefaces are registered offline");

  /* 6 — THE CONTROL. Without the worker the same folder cannot open offline, so the pass
     above is not a property of the browser's HTTP cache. */
  const blocked = await browser.newContext({ viewport: VIEWPORT, serviceWorkers: "block" });
  await blocked.setOffline(true);
  const blockedPage = await blocked.newPage();
  let reached = false;
  try { await blockedPage.goto(url, { waitUntil: "load", timeout: 8000 }); reached = true; } catch { /* expected */ }
  assert.equal(reached, false, "the folder opened offline WITHOUT a service worker — the check proves nothing");
  await blocked.close();

  /* 7 — the worker's own answer, asked directly: it is a verified count, not a flag. */
  const status = await page.evaluate(() => new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => resolve(event.data);
    navigator.serviceWorker.controller.postMessage({ type: "EARNED_CACHE_STATUS" }, [channel.port2]);
  }));
  assert.equal(status.ready, true);
  assert.equal(status.total, site.precache.length);
  assert.deepEqual(status.missing, []);
  assert.equal(status.cache, site.cache);

  await context.setOffline(false);
  assert.deepEqual(problems, [], "no page error, console error or offsite request");
  console.log(`A5 OFFLINE LAUNCH CHECK PASS — installed one worker over the host's own headers; `
    + `cache ${site.cache} holds all ${site.precache.length} files; preflight read "${preflight.state}" `
    + `only after verifying them; with the network OFF Today rendered from the engine, a weigh-in `
    + `(${logged}) was recorded and survived a reload and a new page; the same folder with the worker `
    + `blocked could not open offline at all; no page error and no offsite request.`);
} catch (error) {
  failures = 1;
  console.error("A5 OFFLINE LAUNCH CHECK FAIL — " + error.message);
  for (const problem of problems) console.error("  " + problem);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
process.exitCode = failures;
