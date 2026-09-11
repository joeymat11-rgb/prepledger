// OPTIONAL, PC-only: open the built Today page in a real browser and prove four things a
// Node test cannot — the bundle executes, the durable record survives a genuine page
// reload, the single primary action is inside the first 390x844 viewport in BOTH states
// (review F2), and the page fetches nothing over the network (review F9).
//
// It installs nothing. Point W7_BROWSER_BIN at an existing Chromium/Chrome executable;
// without it the check says so and exits 0 with a clear NOT RUN line, so it can never be
// mistaken for a pass. playwright-core comes from rebuild/m3/w6's own dependencies, the
// same ones the W6 browser build uses.
//
//   node rebuild/m3/w7-preview/today/build.mjs
//   set W7_BROWSER_BIN=C:\Users\<you>\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe
//   node rebuild/m3/w7-preview/today/browser-check.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "./serve.mjs";
import design from "./design.cjs";

/* A2 review B2 — a REAL process kill needs the pids of the chrome processes that
   opened a given profile directory. `context.close()` is a graceful shutdown and
   hides exactly the defect this check exists to catch. */
function chromeProcessesForProfile(profile) {
  const script = "Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | "
    + "Where-Object { $_.CommandLine -like '*" + profile.replace(/'/g, "''") + "*' } | "
    + "Select-Object -ExpandProperty ProcessId";
  try {
    const out = execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script],
      { encoding: "utf8", timeout: 30000 });
    return out.split(/\r?\n/).map((line) => Number(line.trim())).filter(Number.isSafeInteger).filter((pid) => pid > 0);
  } catch (_) { return []; }
}

const here = path.dirname(fileURLToPath(import.meta.url));
const executablePath = process.env.W7_BROWSER_BIN;
if (!executablePath) {
  console.log("A1 TODAY BROWSER CHECK NOT RUN — set W7_BROWSER_BIN to a Chromium executable. "
    + "This is not a pass.");
  process.exit(0);
}

const require = createRequire(path.join(here, "../../w6/package.json"));
const { chromium } = require("playwright-core");

// Every instruction title the engine can put in the headline slot, read out of the engine
// source at run time so a title added tomorrow is covered without anyone listing it here.
const HEADLINES = design.headlineVocabulary();

// Figures this synthetic athlete's engine cannot produce. The rounded calorie headline
// really is 2,300 for this fixture, so that one is NOT a prototype tell; the Node view
// tests prove slot by slot where every figure came from.
const FICTIONAL = ["2,252", "2,344", "235 g", "180.9 lb", "181.3 lb", "135 lb", "About 60 min", "9 exercises"];
const VIEWPORT = { width: 390, height: 844 };

/* A2 review B2: the weigh-in is a real encrypted-repository transaction now, so the
   check waits for the sheet to close and the reading to appear rather than for a
   selector that was already on screen. */
const recorded = async (page) => {
  await page.waitForSelector('[role="dialog"]', { state: "detached" });
  await page.waitForFunction(() => /\u2713/.test(document.querySelector('[data-slot="morning"]').textContent));
};

const server = await startServer({ port: 0 });
const url = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({ executablePath, headless: true });
let failures = 0;
const problems = [];
try {
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  page.on("pageerror", (error) => problems.push("pageerror: " + error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const where = (message.location() && message.location().url) || "";
    // The page ships no icon; a favicon 404 is the browser asking, not the page failing.
    if (/favicon/.test(where) || /favicon/.test(message.text())) return;
    problems.push("console: " + message.text() + " @ " + where);
  });
  // review F9: nothing outside this local origin may be requested at all.
  page.on("request", (request) => {
    if (!request.url().startsWith(url) && !request.url().startsWith("data:")) {
      problems.push("offsite request: " + request.url());
    }
  });

  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector('[data-slot="instruction"]');

  /* review F2: the ONE primary action must be reachable without scrolling, in both
     states. Measured against the scrolling viewport, not the document. */
  const primaryBox = () => page.evaluate(() => {
    const view = document.querySelector(".view");
    const cta = document.querySelector('[data-slot="primary"]');
    const top = view.getBoundingClientRect().top;
    const box = cta.getBoundingClientRect();
    return { top: Math.round(box.top - top), bottom: Math.round(box.bottom - top),
      viewport: Math.round(view.clientHeight), label: cta.textContent.trim() };
  });

  const first = await page.textContent("#phone");
  assert(!/Today could not open/.test(first), "the page mounted");
  const instruction = await page.textContent('[data-slot="instruction"]');
  assert.equal((await page.textContent('[data-slot="morning"]')).trim(), "This morning — not logged yet",
    "a fresh browser profile holds no reading");

  const before = await primaryBox();
  assert(before.bottom <= before.viewport,
    `the primary action is below the fold before a weigh-in: bottom ${before.bottom} > ${before.viewport}`);

  // Log a weigh-in through the real sheet.
  await page.click('[data-slot="primary"]');
  await page.waitForSelector("#morning-weight");
  await page.fill("#morning-weight", "179.4");
  await page.click('[role="dialog"] button[type="submit"]');
  await recorded(page);
  const logged = (await page.textContent('[data-slot="morning"]')).trim();
  assert.equal(logged, "This morning ✓ 179.4 lb", "the weigh-in reached the screen");
  const trend = (await page.textContent('[data-slot="trend"]')).trim();
  const after = (await page.textContent('[data-slot="instruction"]')).trim();
  assert.notEqual(after, instruction.trim(), "the engine's instruction changed");

  const afterBox = await primaryBox();
  assert(afterBox.bottom <= afterBox.viewport,
    `the primary action is below the fold after a weigh-in: bottom ${afterBox.bottom} > ${afterBox.viewport}`);

  /* review D-1: the layout must hold the ONE primary action inside the viewport for EVERY
     title the engine can put in the headline slot — not only the one this fixture happens
     to produce. Four of them run to three lines. The title is written into the slot and
     the page's own fitter reacts to it through exactly the path a real engine title would
     take; nothing here reaches into the fitter or fakes a measurement. */
  const sweep = async (target, label) => {
    const rows = [];
    for (const title of HEADLINES) {
      const row = await target.evaluate(async (text) => {
        const view = document.querySelector(".view");
        const headline = document.querySelector('[data-slot="instruction"]');
        const cta = document.querySelector('[data-slot="primary"]');
        headline.textContent = text;
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const top = view.getBoundingClientRect().top;
        const box = cta.getBoundingClientRect();
        return { bottom: Math.round(box.bottom - top), viewport: Math.round(view.clientHeight),
          size: Math.round(parseFloat(getComputedStyle(headline).fontSize)),
          height: Math.round(headline.getBoundingClientRect().height) };
      }, title);
      assert(row.bottom <= row.viewport,
        label + ': "' + title + '" pushes the primary action out of the viewport (bottom '
        + row.bottom + " > " + row.viewport + ", headline at " + row.size + "px)");
      assert(row.size >= 33,
        label + ': "' + title + '" drove the headline below the 33px floor (' + row.size + "px)");
      rows.push({ title, room: row.viewport - row.bottom, size: row.size });
    }
    const worst = rows.reduce((a, b) => (a.room <= b.room ? a : b));
    const shrunk = rows.filter((r) => r.size < 47);
    return { worst, shrunk, count: rows.length };
  };

  const sweepContext = await browser.newContext({ viewport: VIEWPORT });
  const sweepPage = await sweepContext.newPage();
  await sweepPage.goto(url, { waitUntil: "load" });
  await sweepPage.waitForSelector('[data-slot="primary"]');
  const sweptBefore = await sweep(sweepPage, "before a weigh-in");
  await sweepPage.reload({ waitUntil: "load" });
  await sweepPage.waitForSelector('[data-slot="primary"]');
  await sweepPage.click('[data-slot="primary"]');
  await sweepPage.fill("#morning-weight", "180.6");
  await sweepPage.click('[role="dialog"] button[type="submit"]');
  await recorded(sweepPage);
  const sweptAfter = await sweep(sweepPage, "after a weigh-in");
  await sweepContext.close();

  /* review D-2: the unwired entry points say so on Today's own face. A3 wired the
     recovery check-in, so it is no longer one of them: its marker carries the durable
     fact instead, and says NOTHING at all while nothing is recorded. */
  for (const name of ["nutrition-state", "coach-state"]) {
    const text = (await page.textContent('[data-slot="' + name + '"]')).trim();
    assert.equal(text, "— not wired yet", name + " does not say so on Today's face");
  }
  assert.equal((await page.textContent('[data-slot="recovery-state"]')).trim(), "",
    "a blank check-in must be blank on Today's face, never 'none' and never 'not wired'");

  /* review F1: a spike reading must carry the engine's own note beside it. Checked on a
     second browser profile so it does not disturb the reading above. */
  const spikeContext = await browser.newContext({ viewport: VIEWPORT });
  const spikePage = await spikeContext.newPage();
  await spikePage.goto(url, { waitUntil: "load" });
  await spikePage.waitForSelector('[data-slot="primary"]');
  await spikePage.click('[data-slot="primary"]');
  await spikePage.fill("#morning-weight", "191.7");
  await spikePage.click('[role="dialog"] button[type="submit"]');
  await recorded(spikePage);
  const spikeLine = (await spikePage.textContent('[data-slot="morning"]')).trim();
  assert.match(spikeLine, /^This morning ✓ 191\.7 lb · .+/,
    "a spike reading shows the engine's note beside it, not a bare number: " + spikeLine);
  // review F8: an impossible weight is refused in words and recorded nowhere.
  await spikeContext.close();

  const refuseContext = await browser.newContext({ viewport: VIEWPORT });
  const refusePage = await refuseContext.newPage();
  await refusePage.goto(url, { waitUntil: "load" });
  await refusePage.waitForSelector('[data-slot="primary"]');
  await refusePage.click('[data-slot="primary"]');
  await refusePage.fill("#morning-weight", "10000");
  await refusePage.click('[role="dialog"] button[type="submit"]');
  await refusePage.waitForFunction(() => document.querySelector("#weigh-error").textContent.trim().length > 0);
  const refusal = (await refusePage.textContent("#weigh-error")).trim();
  assert(refusal.length > 0, "an impossible weight is refused in words, not silently");
  assert.match(refusal, /Nothing was recorded/);
  assert(await refusePage.$('[role="dialog"]'), "the sheet stays open on a refusal");
  await refuseContext.close();

  // A REAL reload of a REAL browser.
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-slot="morning"]');
  assert.equal((await page.textContent('[data-slot="morning"]')).trim(), logged, "the reading survived the reload");
  assert.equal((await page.textContent('[data-slot="trend"]')).trim(), trend, "the trend survived the reload");

  // A genuinely new page in the same origin (the app-kill path).
  const relaunched = await context.newPage();
  await relaunched.goto(url, { waitUntil: "load" });
  await relaunched.waitForSelector('[data-slot="morning"]');
  assert.equal((await relaunched.textContent('[data-slot="morning"]')).trim(), logged, "a new page sees the same reading");

  const text = await page.textContent("#phone");
  for (const figure of FICTIONAL) assert(!text.includes(figure), "prototype figure on screen: " + figure);

  // The approved typefaces really loaded, from the inlined bytes and not the network.
  const fonts = await page.evaluate(() => document.fonts.size);
  assert(fonts >= 2, "both inlined typefaces are registered on the document");

  /* A2 review B2: the store of record is this origin's ENCRYPTED IndexedDB, and
     localStorage holds nothing at all. */
  const databases = await page.evaluate(() => indexedDB.databases().then((list) => list.map((d) => d.name)));
  /* C4b — ONE STORE: the reading lives in this device's own local era, beside the
     workout, under the key custody in its `-keys` database. */
  const { DATABASE: LOCAL_DATABASE } = await import("./gym-host.mjs");
  assert(databases.includes(LOCAL_DATABASE), "the one store is on this device: " + databases);
  assert(databases.includes(LOCAL_DATABASE + "-keys"), "this device kept its own key: " + databases);
  assert(!databases.includes("earned-today-preview-readings"),
    "the page's old synthetic reading store must not exist: " + databases);
  const local = await page.evaluate(() => Object.keys(localStorage));
  assert.deepEqual(local, [], "nothing of record is kept in localStorage: " + JSON.stringify(local));

  /* THE REAL PROCESS KILL (review B2). Everything above ran on a throwaway context;
     this runs on a PERSISTENT profile and kills every chrome.exe of it with
     `taskkill /F /T` — no graceful flush, which is what an iOS tab termination is —
     then relaunches and requires the reading to still be there. */
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "a1-today-profile-"));
  let killed = 0;
  try {
    const first = await chromium.launchPersistentContext(profile, { executablePath, headless: true, viewport: VIEWPORT });
    const killPage = first.pages()[0] || await first.newPage();
    await killPage.goto(url, { waitUntil: "load" });
    await killPage.waitForSelector('[data-slot="primary"]');
    await killPage.click('[data-slot="primary"]');
    await killPage.waitForSelector("#morning-weight");
    await killPage.fill("#morning-weight", "178.9");
    await killPage.click('[role="dialog"] button[type="submit"]');
    await recorded(killPage);
    const killedLine = (await killPage.textContent('[data-slot="morning"]')).trim();
    const killedTrend = (await killPage.textContent('[data-slot="trend"]')).trim();

    const pids = chromeProcessesForProfile(profile);
    assert(pids.length > 0, "no chrome process was found for this profile — the kill would prove nothing");
    for (const pid of pids) {
      try { execFileSync("taskkill.exe", ["/F", "/T", "/PID", String(pid)], { stdio: "ignore", timeout: 30000 }); }
      catch (_) { /* a child may already be gone with its parent */ }
    }
    for (let tick = 0; tick < 100; tick++) {
      if (chromeProcessesForProfile(profile).length === 0) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.equal(chromeProcessesForProfile(profile).length, 0, "the browser survived taskkill /F /T");
    killed = pids.length;
    try { await first.close(); } catch (_) { /* already gone — that is the point */ }
    await new Promise((resolve) => setTimeout(resolve, 250));

    const second = await chromium.launchPersistentContext(profile, { executablePath, headless: true, viewport: VIEWPORT });
    const after = second.pages()[0] || await second.newPage();
    await after.goto(url, { waitUntil: "load" });
    await after.waitForSelector('[data-slot="morning"]');
    assert.equal((await after.textContent('[data-slot="morning"]')).trim(), killedLine,
      "the reading survived a REAL process kill");
    assert.equal((await after.textContent('[data-slot="trend"]')).trim(), killedTrend,
      "and the engine recomputed the same trend from it");
    await second.close();
  } finally {
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) { /* temp dir */ }
  }

  assert.deepEqual(problems, [], "no page error, console error or offsite request");
  console.log(`A1 TODAY BROWSER CHECK PASS — mounted, weighed in (${logged}), spike note shown, impossible weight `
    + `refused, survived a real reload and a new page; primary action inside the ${VIEWPORT.width}x${VIEWPORT.height} `
    + `viewport in both states (bottom ${before.bottom} and ${afterBox.bottom} of ${before.viewport}; `
    + `${before.viewport - before.bottom}px and ${afterBox.viewport - afterBox.bottom}px of headroom); `
    + `the reading survived a REAL process kill (taskkill /F /T on ${killed} chrome.exe of a persistent profile, `
    + `kill verified) and localStorage holds nothing; no network request; no prototype figure on screen; `
    + `${sweptBefore.count} engine headline titles swept in both states — worst headroom `
    + `${sweptBefore.worst.room}px before / ${sweptAfter.worst.room}px after; `
    + `${sweptBefore.shrunk.length} title(s) fitted down to ${[...new Set(sweptBefore.shrunk.map((r) => r.size))].join("/") || "none"}px `
    + `(33px floor never reached); unwired entry points labelled on Today's face`);
} catch (error) {
  failures = 1;
  console.error("A1 TODAY BROWSER CHECK FAIL — " + error.message);
  for (const problem of problems) console.error("  " + problem);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
process.exitCode = failures;
