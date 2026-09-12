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
// P1 (DECISIONS:114 (1)): every state this check reaches is also swept for an em or en
// dash in the REAL rendered DOM.
import { assertNoDashOnScreen } from "./dash-check.mjs";

/* A2 review B2 — a REAL process kill needs the pids of the browser processes
   that opened a given profile directory. `context.close()` is a graceful
   shutdown and hides exactly the defect this check exists to catch.

   C4b review D3: the name was the literal "chrome.exe", so on a machine whose
   W7_BROWSER_BIN is Edge this failed at the kill rather than reporting NOT RUN.
   It is derived from the executable now, as local-today-browser.mjs does. */
function chromeProcessesForProfile(profile) {
  const script = "Get-CimInstance Win32_Process -Filter \"Name='" + PROCESS_NAME + "'\" | "
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
// C4b review D3 — the kill must name THIS browser, not a hardcoded chrome.exe.
const PROCESS_NAME = path.basename(executablePath);

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
  assert.equal((await page.textContent('[data-slot="morning"]')).trim(), "This morning: not logged yet",
    "a fresh browser profile holds no reading");

  const dashStates = [];
  const sweepForDashes = async (target, where) => {
    await assertNoDashOnScreen(target, where);
    dashStates.push(where);
  };
  await sweepForDashes(page, "Today, before a weigh-in");

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

  await sweepForDashes(page, "Today, with a reading recorded");

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
  /* NOT swept for dashes in this state: the layout sweep writes the engine's RAW titles
     into the headline slot by hand, deliberately bypassing the page's own binding (and
     so the render boundary) to measure the worst case. Reload, so the screen is the
     page's own again, and sweep that. */
  await sweepPage.reload({ waitUntil: "load" });
  await sweepPage.waitForSelector('[data-slot="primary"]');
  await sweepForDashes(sweepPage, "Today, reloaded with a reading");
  await sweepContext.close();

  /* review D-2: the unwired entry points say so on Today's own face. A3 wired the
     recovery check-in, so it is no longer one of them: its marker carries the durable
     fact instead, and says NOTHING at all while nothing is recorded. */
  for (const name of ["nutrition-state", "coach-state"]) {
    const text = (await page.textContent('[data-slot="' + name + '"]')).trim();
    assert.equal(text, "Not wired yet", name + " does not say so on Today's face");
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
  /* P1: the engine's own note is the sharpest case for the owner's rule, because the
     accepted writer really does write "spike — damped in trend". */
  await sweepForDashes(spikePage, "Today, with the engine's spike note beside the reading");
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
  await sweepForDashes(refusePage, "the weigh-in sheet, refusing an impossible weight");
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
  await sweepForDashes(page, "Today, after a real reload");
  await sweepForDashes(relaunched, "Today, on a genuinely new page");
  /* Every screen this page can route to from Today, in the real browser. */
  for (const [route, where] of [["why", "Why this plan"], ["nutrition", "the nutrition entry"],
    ["coach", "the coach entry"], ["recovery", "the recovery check-in"]]) {
    await relaunched.click('[data-go="' + route + '"]');
    await relaunched.waitForFunction(() => !document.querySelector('[data-slot="kcal-note"]'));
    await sweepForDashes(relaunched, where);
    await relaunched.goto(url, { waitUntil: "load" });
    await relaunched.waitForSelector('[data-slot="morning"]');
  }

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

  /* REPORT A PROBLEM (DECISIONS:140 (3)), in the real browser. The control is tapped
     and the FALLBACK BOX is read: whether the clipboard took the block is the one
     thing this repository cannot decide (no iPhone has run this build), so what is
     measured is the thing that does not depend on it. The block must be the eight
     fields, must name this build, and opening it must not make the page scroll
     sideways at either width. */
  await page.click('[data-slot="problem-entry"]');
  await page.waitForSelector('[data-slot="problem-text"]', { state: "visible" });
  await page.waitForFunction(() => {
    const area = document.querySelector('[data-slot="problem-text"]');
    return !!area && area.value.length > 0;
  });
  /* Review round 1, C4: the single primary action is still IN VIEW with the box
     open. Measured against the phone element's own box, which is the viewport the
     design is held to (review F2), at both widths. */
  const problemView = () => page.evaluate(() => {
    const area = document.querySelector('[data-slot="problem-text"]');
    const control = document.querySelector('[data-slot="problem-entry"]');
    const said = document.querySelector('[data-slot="problem-said"]');
    const primary = document.querySelector('[data-slot="primary"]');
    const view = document.querySelector(".view") || document.documentElement;
    const frame = view.getBoundingClientRect();
    const box = primary.getBoundingClientRect();
    return { block: area.value, said: said.textContent.trim(),
      tap: Math.round(control.getBoundingClientRect().height),
      font: Math.round(parseFloat(getComputedStyle(area).fontSize)),
      scrollWidth: view.scrollWidth, clientWidth: view.clientWidth,
      selected: area.selectionEnd - area.selectionStart,
      open: !document.querySelector('[data-slot="problem-box"]').hidden,
      primaryTop: Math.round(box.top - frame.top), primaryBottom: Math.round(box.bottom - frame.top),
      viewport: Math.round(view.clientHeight) };
  });
  const problem = await problemView();
  const problemFields = problem.block.split("\n").map((line) => line.slice(0, line.indexOf(":")));
  assert.deepEqual(problemFields, ["screen", "lane open", "enrolment", "offline-ready",
    "build", "device", "user agent", "at"], "the block the browser shows: " + problem.block);
  assert.match(problem.block, /\nbuild: earned-[0-9a-f]{12}\n/, "the block names this build");
  assert.match(problem.block, /\ndevice: (device-[0-9a-f]{8}|none)\n/, "eight hex, or none");
  assert.equal(/\b[0-9a-f]{32}\b/.test(problem.block), false, "no full device id reaches the block");
  assert(problem.said.length > 0, "the control says what happened");
  assert(problem.tap >= 44, "the control is a 44px tap target: " + problem.tap);
  assert(problem.font >= 16, "the box is 16px or more: " + problem.font);
  assert.equal(problem.selected, problem.block.length, "the block is pre-selected, whole");
  assert(problem.scrollWidth <= problem.clientWidth,
    "the open box made the page scroll sideways: " + problem.scrollWidth + " > " + problem.clientWidth);
  assert(problem.primaryBottom <= problem.viewport,
    "C4: the primary action left the viewport with the box open at " + VIEWPORT.width + "px: bottom "
    + problem.primaryBottom + " of " + problem.viewport);
  assert(problem.primaryTop >= 0, "C4: the primary action is above the viewport at " + VIEWPORT.width + "px");
  /* And at the narrowest width the brief names, with the box still open. */
  await page.setViewportSize({ width: 320, height: VIEWPORT.height });
  const narrow = await problemView();
  assert.equal(narrow.open, true, "the box is still open at the narrow width");
  assert(narrow.scrollWidth <= narrow.clientWidth,
    "sideways scroll at 320px with the box open: " + narrow.scrollWidth + " > " + narrow.clientWidth);
  assert(narrow.primaryBottom <= narrow.viewport && narrow.primaryTop >= 0,
    "C4: the primary action left the viewport with the box open at 320px: " + narrow.primaryTop
    + " to " + narrow.primaryBottom + " of " + narrow.viewport);
  await page.setViewportSize(VIEWPORT);
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-slot="morning"]');

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
    assert(pids.length > 0, "no " + PROCESS_NAME + " process was found for this profile — the kill would prove nothing");
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
    + `the reading survived a REAL process kill (taskkill /F /T on ${killed} ${PROCESS_NAME} of a persistent profile, `
    + `kill verified) and localStorage holds nothing; no network request; no prototype figure on screen; `
    + `${sweptBefore.count} engine headline titles swept in both states — worst headroom `
    + `${sweptBefore.worst.room}px before / ${sweptAfter.worst.room}px after; `
    + `${sweptBefore.shrunk.length} title(s) fitted down to ${[...new Set(sweptBefore.shrunk.map((r) => r.size))].join("/") || "none"}px `
    + `(33px floor never reached); unwired entry points labelled on Today's face; `
    + `no em/en dash in the rendered DOM of ${dashStates.length} screen states (DECISIONS:114): `
    + dashStates.join(", ")
    + `; "Report a problem" copied its eight-field block (${problem.tap}px tap target, ${problem.font}px box, `
    + `pre-selected whole, no full device id, no sideways scroll at 390px or 320px) and said "${problem.said}"; `
    + `with the box OPEN the primary action is still in view at both widths `
    + `(390px: ${problem.primaryTop} to ${problem.primaryBottom} of ${problem.viewport}; `
    + `320px: ${narrow.primaryTop} to ${narrow.primaryBottom} of ${narrow.viewport})`);
} catch (error) {
  failures = 1;
  console.error("A1 TODAY BROWSER CHECK FAIL — " + error.message);
  for (const problem of problems) console.error("  " + problem);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
process.exitCode = failures;
