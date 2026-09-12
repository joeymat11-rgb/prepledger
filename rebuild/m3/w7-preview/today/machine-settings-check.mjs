// OPTIONAL, PC-only: drive the gym card's machine-settings block and its capture in a
// real Chromium, on a PERSISTENT browser profile, and prove the things a Node test
// cannot:
//   the active set opens with "No settings saved yet." and no figure -> the capture
//   records -> the block shows it back verbatim -> a genuine reload -> a genuine
//   PROCESS KILL -> it is still there, out of this device's own encrypted IndexedDB.
//
// It also measures what only a browser can: the block and the editor fit at 390x844
// and at 320px with no sideways scroll, every box renders at 16px or more, every tap
// target is at least 44px high, the set's ONE primary action stays in view with the
// editor open, and no U+2013 or U+2014 is rendered in anything this build owns.
//
// It installs nothing. Point W7_BROWSER_BIN at an existing Chromium/Chrome/Edge
// executable; without it the check says so and exits 0 with a clear NOT RUN line.
//
//   node rebuild/m3/w7-preview/today/build.mjs
//   set W7_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
//   node rebuild/m3/w7-preview/today/machine-settings-check.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "./serve.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const executablePath = process.env.W7_BROWSER_BIN;
if (!executablePath) {
  console.log("GYM-CARD MACHINE SETTINGS BROWSER CHECK NOT RUN - set W7_BROWSER_BIN to a "
    + "Chromium executable. This is not a pass.");
  process.exit(0);
}
const PROCESS_NAME = path.basename(executablePath);
const require = createRequire(path.join(here, "../../w6/package.json"));
const { chromium } = require("playwright-core");

const VIEWPORT = { width: 390, height: 844 };
const NARROW = { width: 320, height: 844 };
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "gym-settings-profile-"));
const server = await startServer({ port: 0 });
const url = `http://127.0.0.1:${server.address().port}/`;
const problems = [];
const notes = [];
let kills = 0;
let live = null;

function watch(page) {
  page.on("pageerror", (error) => problems.push("pageerror: " + error.message));
  page.addInitScript(() => {
    window.addEventListener("unhandledrejection", (event) => {
      const reason = event.reason;
      console.error("unhandledrejection: " + ((reason && (reason.stack || reason.message)) || String(reason)));
    });
  });
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const where = (message.location() && message.location().url) || "";
    if (/favicon/.test(where) || /favicon/.test(message.text())) return;
    problems.push("console: " + message.text() + " @ " + where);
  });
  page.on("request", (request) => {
    if (!request.url().startsWith(url) && !request.url().startsWith("data:")) {
      problems.push("offsite request: " + request.url());
    }
  });
  return page;
}

function browserProcessesForProfile() {
  const script = "Get-CimInstance Win32_Process -Filter \"Name='" + PROCESS_NAME + "'\" | "
    + "Where-Object { $_.CommandLine -like '*" + profile.replace(/'/g, "''") + "*' } | "
    + "Select-Object -ExpandProperty ProcessId";
  try {
    const out = execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script],
      { encoding: "utf8", timeout: 30000 });
    return out.split(/\r?\n/).map((line) => Number(line.trim())).filter(Number.isSafeInteger).filter((pid) => pid > 0);
  } catch (_) { return []; }
}
/* A REAL PROCESS KILL. context.close() is a graceful shutdown: the browser flushes
   what it was holding, which is exactly the case that hides a setting that only ever
   lived in memory. */
async function hardKill(context) {
  const pids = browserProcessesForProfile();
  assert(pids.length > 0,
    "no " + PROCESS_NAME + " process was found for this profile - the kill would prove nothing");
  for (const pid of pids) {
    try { execFileSync("taskkill.exe", ["/F", "/T", "/PID", String(pid)], { stdio: "ignore", timeout: 30000 }); }
    catch (_) { /* a child may already be gone with its parent */ }
  }
  for (let tick = 0; tick < 100; tick++) {
    if (browserProcessesForProfile().length === 0) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(browserProcessesForProfile().length, 0, "the browser survived taskkill /F /T");
  try { await context.close(); } catch (_) { /* already gone - that is the point */ }
  kills += 1;
  await new Promise((resolve) => setTimeout(resolve, 250));
}

const text = (page, selector) => page.textContent(selector).then((value) => (value || "").trim());

/* Today -> the weigh-in -> Start -> the ACTIVE SET, which is where the block lives.
   The weigh-in is only owed on the first launch of a fresh profile. */
async function toActiveSet(viewport = VIEWPORT) {
  const context = await chromium.launchPersistentContext(profile, { executablePath, headless: true, viewport });
  const page = watch(context.pages()[0] || await context.newPage());
  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector('[data-slot="primary-label"]');
  /* The morning is owed on a fresh profile, and Today's primary action is the weigh-in
     until it is in. The label for it is the approved design's own ("Log the scale"), so
     this branch is taken on anything that is NOT already a workout action rather than on
     a sentence this file would otherwise have to keep in step with the design. */
  if (!/^(Start|Resume|Review) /.test(await text(page, '[data-slot="primary-label"]'))) {
    await page.click('[data-slot="primary"]');
    await page.waitForSelector("#morning-weight");
    await page.fill("#morning-weight", "179.4");
    await page.click('[role="dialog"] button[type="submit"]');
    await page.waitForSelector('[role="dialog"]', { state: "detached" });
    await page.waitForFunction(() => /✓/.test(document.querySelector('[data-slot="morning"]').textContent));
  }
  await openCard(page);
  live = context;
  return { context, page };
}

/* FROM TODAY TO THE ACTIVE SET. Today's primary action opens the workout once the
   morning is in: "Start ..." on a fresh day, "Resume ..." after a kill or a reload
   mid-session. Waiting for the LABEL rather than assuming it is what stops this walk
   from re-opening the weigh-in sheet. */
async function openCard(page) {
  await page.waitForFunction(() =>
    /^(Start|Resume|Review) /.test(document.querySelector('[data-slot="primary-label"]').textContent.trim()),
  null, { timeout: 20000 });
  await page.click('[data-slot="primary"]');
  await page.waitForSelector('[data-slot="plan"]', { timeout: 20000 });
  /* The lane is opened by gym-app.mjs itself, asynchronously and failing closed, so
     the block appearing IS the evidence that this device gave the page a store. */
  await page.waitForSelector('[data-slot="settings-block"]:not([hidden])', { timeout: 20000 });
}

const block = (page) => text(page, '[data-slot="settings-block"]');
const storedPairs = (page) => page.evaluate(() =>
  [...document.querySelectorAll('[data-slot="settings-list"] .row')]
    .map((row) => [row.querySelector("strong").textContent, row.querySelector("span").textContent]));

/* MEASURED, never asserted: the set's one primary action is still in view with the
   editor open, the screen never scrolls sideways, and every target is big enough. */
async function measure(page, label) {
  const box = await page.evaluate(() => {
    const view = document.querySelector(".view");
    const cta = document.querySelector('#phone [data-slot="log"]');
    cta.scrollIntoView({ block: "end" });
    const frame = view.getBoundingClientRect();
    const rect = cta.getBoundingClientRect();
    return { top: Math.round(rect.top - frame.top), bottom: Math.round(rect.bottom - frame.top),
      viewport: Math.round(view.clientHeight), overflow: Math.round(view.scrollWidth - view.clientWidth),
      ctas: document.querySelectorAll("#phone .cta").length };
  });
  assert(box.bottom <= box.viewport + 1,
    `${label}: the set's primary action is not in view (${box.bottom} > ${box.viewport})`);
  assert(box.top >= 0, `${label}: the set's primary action is cut off at the top`);
  assert(box.overflow <= 0, `${label}: the screen scrolls sideways by ${box.overflow}px`);
  assert.equal(box.ctas, 1, `${label}: the active set has ${box.ctas} primary actions, not one`);
  const targets = await page.evaluate(() => [...document.querySelectorAll(
    '#phone [data-slot="settings-block"] button, #phone [data-slot="settings-editor"] button')]
    .filter((el) => !el.hidden && el.offsetParent !== null)
    .map((el) => ({ id: el.textContent.trim().slice(0, 24), h: Math.round(el.getBoundingClientRect().height) })));
  for (const entry of targets) {
    assert(entry.h >= 44, `${label}: tap target "${entry.id}" is ${entry.h}px high`);
  }
  const boxes = await page.evaluate(() => [...document.querySelectorAll(
    '#phone [data-slot="settings-editor"] input')]
    .map((el) => Math.round(parseFloat(getComputedStyle(el).fontSize))));
  for (const size of boxes) assert(size >= 16, `${label}: a settings box renders at ${size}px`);
  notes.push(`${label}: log action ${box.top}-${box.bottom} in a ${box.viewport}px viewport, `
    + `${targets.length} target(s) >= 44px, ${boxes.length} box(es) >= 16px, no sideways scroll`);
  return box;
}

/* The owner's rule, scoped to what this build owns. The two marks are passed in as
   code points so this file stays free of them too. */
async function noDashes(page, label) {
  const hits = await page.evaluate(([em, en]) => {
    const roots = [document.querySelector('[data-slot="settings-block"]'),
      document.querySelector('[data-slot="settings-editor"]')].filter(Boolean);
    const bad = [];
    for (const root of roots) {
      for (const node of [root, ...root.querySelectorAll("*")]) {
        for (const value of [node.textContent, node.getAttribute("placeholder"),
          node.getAttribute("aria-label"), node.getAttribute("title")]) {
          if (value && (value.includes(em) || value.includes(en))) bad.push(value.slice(0, 60));
        }
      }
    }
    return [...new Set(bad)];
  }, [EM, EN]);
  assert.deepEqual(hits, [], label + " renders an ai dash: " + hits.join(" | "));
}

/* Fill one row of the editor the way a thumb does. */
const typeRow = (page, index, name, value) => page.evaluate(([i, n, v]) => {
  const set = (attr, text) => {
    const box = document.querySelector('[data-settings-' + attr + '="' + i + '"]');
    box.value = text;
    box.dispatchEvent(new Event("input", { bubbles: true }));
  };
  set("name", n);
  set("value", v);
}, [String(index), name, value]);

let failures = 0;
try {
  /* ---------- launch 1: the empty state, then a capture ---------- */
  let { context, page } = await toActiveSet();
  assert.match(await block(page), /No settings saved yet\./,
    "a machine this device holds nothing for says so");
  assert.doesNotMatch(await block(page), /\d/, "the empty block invented a figure");
  await measure(page, "the active set, nothing stored");
  await noDashes(page, "the active set, nothing stored");

  await page.click('[data-action="settings-open"]');
  await page.waitForSelector('[data-settings-name="0"]');
  await measure(page, "the active set, editor open at 390");
  await noDashes(page, "the active set, editor open at 390");

  /* Nothing at all refuses, and writes nothing. */
  await page.click('[data-slot="settings-save"]');
  await page.waitForFunction(() =>
    document.querySelector('[data-slot="settings-error"]').textContent.trim().length > 0);
  const refusal = await text(page, '[data-slot="settings-error"]');
  assert.match(refusal, /Nothing was recorded\./, refusal);
  notes.push("an empty capture was refused: " + refusal);

  await typeRow(page, 0, "Seat", "four");
  await page.click('[data-action="settings-add"]');
  await page.waitForSelector('[data-settings-name="1"]');
  await typeRow(page, 1, "Pin", "three");
  await page.evaluate(() => {
    const cue = document.querySelector('[data-slot="settings-cue"]');
    cue.value = "Elbows in, and stop one short.";
    cue.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.click('[data-slot="settings-save"]');
  await page.waitForFunction(() =>
    document.querySelectorAll('[data-slot="settings-list"] .row').length === 2);
  assert.deepEqual(await storedPairs(page), [["Seat", "four"], ["Pin", "three"]],
    "the block shows what was captured, verbatim and in the order given");
  assert.match(await block(page), /Elbows in, and stop one short\./);
  assert.doesNotMatch(await block(page), /\b4\b/, '"four" was turned into a figure');
  notes.push("captured two settings and a cue from the active set, shown back verbatim");
  await measure(page, "the active set, settings stored");
  await noDashes(page, "the active set, settings stored");

  /* ---------- a genuine reload ----------
     A reload lands on Today, not on the card: the route is not in the URL. The walk
     back is the athlete's own, and the workout is in progress, so the primary action
     resumes it. */
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-slot="primary-label"]');
  await openCard(page);
  assert.deepEqual(await storedPairs(page), [["Seat", "four"], ["Pin", "three"]],
    "the reload lost the settings");

  /* ---------- A REAL PROCESS KILL ---------- */
  await hardKill(context);
  ({ context, page } = await toActiveSet());
  assert.deepEqual(await storedPairs(page), [["Seat", "four"], ["Pin", "three"]],
    "a real taskkill lost the settings");
  assert.match(await block(page), /Elbows in, and stop one short\./);
  notes.push("survived a real taskkill /F /T with the settings intact");

  /* ---------- A CORRECTION REPLACES THE MACHINE ----------
     The winning op carries the whole machine, so a dropped row is dropped rather
     than surviving from the op it replaced. */
  await page.click('[data-action="settings-open"]');
  await page.waitForSelector('[data-settings-name="0"]');
  await page.evaluate(() => document.querySelector('[data-settings-remove="1"]').click());
  await page.waitForFunction(() =>
    !document.querySelector('[data-settings-name="1"]'));
  await typeRow(page, 0, "Seat", "five");
  await page.click('[data-slot="settings-save"]');
  await page.waitForFunction(() =>
    document.querySelectorAll('[data-slot="settings-list"] .row').length === 1);
  assert.deepEqual(await storedPairs(page), [["Seat", "five"]], "the latest capture wins");
  assert.doesNotMatch(await block(page), /Pin/, "a replaced row survived from an earlier op");
  notes.push("a correction replaced the whole machine: the dropped row is gone, not stale");

  /* ---------- CANCELLING WRITES NOTHING ---------- */
  await page.click('[data-action="settings-open"]');
  await page.waitForSelector('[data-settings-name="0"]');
  await typeRow(page, 0, "Seat", "nine");
  await page.click('[data-action="settings-cancel"]');
  await page.waitForFunction(() => document.querySelector('[data-slot="settings-editor"]').hidden);
  assert.deepEqual(await storedPairs(page), [["Seat", "five"]], "cancelling changed the record");
  notes.push("cancelling wrote nothing and left the record as it was");

  /* ---------- D2 ROUND 2, R2-1: BACK KEEPS TODAY ----------
     The card's settings read is a background read, and a mount that has been left
     must never repaint over the screen the athlete went to. In a real browser the
     read is usually already finished, so this is a floor rather than a race: press
     Back, land on Today, and hold there while any deferred work could still settle. */
  await page.click('[data-action="back"]');
  await page.waitForSelector('[data-slot="primary-label"]');
  await page.waitForTimeout(1000);
  assert.equal(await page.$('[data-slot="log"]'), null,
    "the gym card repainted itself over Today after Back");
  assert.equal(await page.$('[data-slot="settings-block"]'), null,
    "the settings block repainted itself over Today after Back");
  assert(await page.$('[data-slot="primary-label"]'), "Today did not survive Back");
  notes.push("Back landed on Today and NOTHING deferred repainted the card over it");
  await openCard(page);
  await page.waitForSelector('[data-slot="settings-block"]');

  /* ---------- THE SET STILL LOGS, with the editor open ---------- */
  await page.click('[data-action="settings-open"]');
  await page.waitForSelector('[data-settings-name="0"]');
  await page.click('.choice:nth-child(5)');
  await page.click('[data-slot="log"]');
  await page.waitForSelector('[data-slot="saved-facts"]');
  notes.push("a set logged normally with the capture editor open");

  /* ---------- 320px ---------- */
  await hardKill(context);
  ({ context, page } = await toActiveSet(NARROW));
  assert.deepEqual(await storedPairs(page), [["Seat", "five"]], "the narrow relaunch lost the record");
  await measure(page, "the active set at 320");
  await page.click('[data-action="settings-open"]');
  await page.waitForSelector('[data-settings-name="0"]');
  await measure(page, "the active set, editor open at 320");
  await noDashes(page, "the active set, editor open at 320");
  await hardKill(context);
} catch (error) {
  failures += 1;
  problems.push(error && error.message ? error.message : String(error));
} finally {
  /* Shutting down has to be bounded. A context this check KILLED is a corpse whose
     close() can never answer, and a keep-alive socket from a browser that is still up
     on a failed run would hold server.close() open for ever - which turned a failing
     run into a hang rather than a red line. Both are raced against a timeout, and the
     sockets are dropped rather than drained. */
  const bounded = (work) => Promise.race([work.catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 5000))]);
  if (live) await bounded(Promise.resolve().then(() => live.close()));
  if (typeof server.closeAllConnections === "function") server.closeAllConnections();
  await bounded(new Promise((resolve) => server.close(resolve)));
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) {}
}

if (problems.length || failures) {
  console.error("GYM-CARD MACHINE SETTINGS BROWSER CHECK FAIL:\n  " + problems.join("\n  "));
  process.exitCode = 1;
} else {
  console.log("GYM-CARD MACHINE SETTINGS BROWSER CHECK PASS - the active set opened with the "
    + "honest empty state and no figure -> an empty capture refused -> two settings and a cue "
    + "captured and shown back verbatim -> a genuine reload -> a correction that replaced the "
    + "whole machine -> cancelling wrote nothing -> Back landed on Today and no deferred read "
    + "repainted the card over it -> the set still logged with the editor open "
    + `-> the same record at 320px, across ${kills} REAL PROCESS KILLS (taskkill /F /T, each `
    + "verified dead); no off-origin request, no horizontal overflow at 390px or 320px, every "
    + "settings box >= 16px, every settings target >= 44px, exactly ONE primary action on the "
    + "active set at every state, and no U+2013 or U+2014 rendered in anything this build owns."
    + "\n  " + notes.join("\n  "));
}
/* A killed browser can leave a handle this process cannot drain. The verdict is
   printed; nothing may keep the run alive after it. */
process.exit(process.exitCode || 0);
