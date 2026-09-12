// OPTIONAL, PC-only: drive N1's nutrition entry in a real Chromium, on a PERSISTENT
// browser profile, and prove the things a Node test cannot:
//   ?screen=nutrition opens its own food lane -> an intake is recorded -> the screen
//   says what the ENGINE holds -> a genuine reload -> a genuine PROCESS KILL -> the
//   figure is still there, out of this device's own encrypted IndexedDB store.
//
// It also measures what only a browser can: the entry and its primary action are in
// view at 390x844 and at 320px with no sideways scroll, every box renders at 16px or
// more, every tap target is at least 44px high, no U+2013 or U+2014 is rendered in
// anything N1 owns, and the page requests nothing off this local origin.
//
// THE KILL IS THE POINT. context.close() is a graceful shutdown: the browser flushes
// what it was holding, which is exactly the case that HIDES a lane that only ever
// lived in memory. A taskkill /F /T is what makes "it is recorded" a fact about the
// store rather than about the screen.
//
// It installs nothing. Point W7_BROWSER_BIN at an existing Chromium/Chrome/Edge
// executable; without it the check says so and exits 0 with a clear NOT RUN line, so
// it can never be mistaken for a pass.
//
//   node rebuild/m3/w7-preview/today/build.mjs
//   set W7_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
//   node rebuild/m3/w7-preview/today/food-check.mjs
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
  console.log("N1 NUTRITION BROWSER CHECK NOT RUN - set W7_BROWSER_BIN to a Chromium executable. "
    + "This is not a pass.");
  process.exit(0);
}
/* The process this check kills is the one W7_BROWSER_BIN actually names: on a machine
   whose Chromium is Edge, a literal "chrome.exe" would find nothing and the kill would
   prove nothing. */
const PROCESS_NAME = path.basename(executablePath);
const require = createRequire(path.join(here, "../../w6/package.json"));
const { chromium } = require("playwright-core");

const VIEWPORT = { width: 390, height: 844 };
const NARROW = { width: 320, height: 844 };
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "n1-food-profile-"));
const server = await startServer({ port: 0 });
const url = `http://127.0.0.1:${server.address().port}/`;
const problems = [];
const notes = [];
let kills = 0;

function watch(page) {
  page.on("pageerror", (error) => problems.push("pageerror: " + error.message));
  /* An unhandled rejection is not a pageerror, and every control here is an async
     click handler, so a throw inside one would otherwise be a silent no-op. */
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

let live = null;
/* THE LANE IS OPENED BY THE SCREEN, asynchronously and failing closed, so "the entry
   is on the page" is the signal that this device really did give the page an encrypted
   store. Waiting for it is therefore the check's first assertion, not its setup. */
async function launch(viewport = VIEWPORT) {
  const context = await chromium.launchPersistentContext(profile, { executablePath, headless: true, viewport });
  const page = watch(context.pages()[0] || await context.newPage());
  await page.goto(url + "?screen=nutrition", { waitUntil: "load" });
  await page.waitForSelector('#phone [data-slot="food-entry"]:not([hidden])', { timeout: 20000 });
  return { context, page };
}
async function relaunch(viewport = VIEWPORT) {
  const opened = await launch(viewport);
  live = opened.context;
  return opened;
}

function browserProcessesForProfile() {
  const script = "Get-CimInstance Win32_Process -Filter \"Name='" + PROCESS_NAME + "'\" | "
    + "Where-Object { $_.CommandLine -like '*" + profile.replace(/'/g, "''") + "*' } | "
    + "Select-Object -ExpandProperty ProcessId";
  try {
    const out = execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script],
      { encoding: "utf8", timeout: 30000 });
    return out.split(/\r?\n/).map(line => Number(line.trim())).filter(Number.isSafeInteger).filter(pid => pid > 0);
  } catch (_) { return []; }
}
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
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.equal(browserProcessesForProfile().length, 0, "the browser survived taskkill /F /T");
  try { await context.close(); } catch (_) { /* already gone - that is the point */ }
  kills += 1;
  await new Promise(resolve => setTimeout(resolve, 250));
}

const entryText = (page) => page.textContent('[data-slot="food-entry"]').then(v => v || "");
const recorded = (page) => page.textContent('[data-slot="food-recorded"]').then(v => v || "");

/* Type into the two boxes the way a thumb does: the value is set and the platform's
   own input event is dispatched, so the screen sees exactly what a tap would give it. */
async function typeIntake(page, cal, pro) {
  await page.evaluate(([c, p]) => {
    for (const [id, value] of [["food-cal", c], ["food-pro", p]]) {
      const box = document.getElementById(id);
      box.value = value;
      box.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }, [cal, pro]);
}
const tapSave = (page) => page.click('#phone [data-slot="food-save"]');

/* Reachability, MEASURED, never asserted: the entry's primary action must be fully
   visible once it is scrolled to, and the screen must never scroll sideways. */
async function reachable(page, label) {
  const box = await page.evaluate(() => {
    const view = document.querySelector(".view");
    const cta = document.querySelector('#phone [data-slot="food-save"]');
    if (!cta) return null;
    cta.scrollIntoView({ block: "end" });
    const rect = cta.getBoundingClientRect(), frame = view.getBoundingClientRect();
    return { top: Math.round(rect.top - frame.top), bottom: Math.round(rect.bottom - frame.top),
      height: Math.round(rect.height), viewport: Math.round(view.clientHeight),
      content: Math.round(view.scrollHeight), overflow: Math.round(view.scrollWidth - view.clientWidth) };
  });
  assert(box, label + ": no record control on screen");
  assert(box.bottom <= box.viewport + 1,
    `${label}: the record control is not fully visible (${box.bottom} > ${box.viewport})`);
  assert(box.top >= 0, `${label}: the record control is cut off at the top`);
  assert(box.height >= 44, `${label}: the record control is ${box.height}px high`);
  assert(box.overflow <= 0, `${label}: the screen scrolls sideways by ${box.overflow}px`);
  notes.push(`${label}: record control ${box.top}-${box.bottom} in a ${box.viewport}px viewport, `
    + `${box.height}px high, no sideways scroll`);
  return box;
}
async function boxesAreLargeEnough(page, label) {
  const sizes = await page.evaluate(() => [...document.querySelectorAll('#phone [data-slot="food-entry"] input')]
    .map(el => ({ id: el.id, size: Math.round(parseFloat(getComputedStyle(el).fontSize)),
      h: Math.round(el.getBoundingClientRect().height) })));
  assert.equal(sizes.length, 2, label + ": the entry has two boxes, not " + sizes.length);
  for (const entry of sizes) {
    assert(entry.size >= 16, `${label}: ${entry.id} renders at ${entry.size}px`);
    assert(entry.h >= 44, `${label}: ${entry.id} is ${entry.h}px high`);
  }
  return sizes;
}

/* THE OWNER'S RULE, AT RENDER TIME (DECISIONS:114 (1)), scoped to what N1 owns: the
   entry and the sentence above it. The rest of the nutrition screen is A1's and the
   PM's P1 sweep, not N1's to churn. The two marks are passed in as code points so
   this file stays free of them too. */
async function noDashes(page, label) {
  const hits = await page.evaluate(([em, en]) => {
    const roots = [document.querySelector('[data-slot="food-entry"]'),
      document.querySelector('[data-slot="stub-note"]')].filter(Boolean);
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

let failures = 0;
try {
  /* ---------- launch 1: the screen opened its own lane ---------- */
  let { context, page } = await relaunch();
  const opened = await page.textContent("#phone");
  assert.doesNotMatch(opened, /not wired yet/,
    "the food lane opened, so the A1 marker is gone from this screen");
  assert.match(opened, /Not prescribed/,
    "carbohydrate and fat are named as not prescribed (DECISIONS:143)");
  await reachable(page, "nutrition at 390");
  await boxesAreLargeEnough(page, "nutrition at 390");
  await noDashes(page, "nutrition at 390");
  assert.equal(await recorded(page), "", "nothing is recorded on a fresh installation");

  /* ---------- the intake is recorded, and the screen says what the ENGINE holds ---------- */
  await typeIntake(page, "2100", "150");
  await tapSave(page);
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-slot="food-recorded"]');
    return el && !el.hidden && el.textContent.trim().length > 0;
  }, null, { timeout: 20000 });
  let line = await recorded(page);
  assert.match(line, /Recorded today/);
  assert.match(line, /2,100 kcal/);
  assert.match(line, /150 g protein/);
  assert.match(line, /replaces today/);
  assert.equal(await page.inputValue("#food-cal"), "", "the boxes are clear for the next correction");
  notes.push("2100 kcal and 150 g recorded and read back off the engine: " + line.trim());

  /* ---------- a genuine reload ---------- */
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('#phone [data-slot="food-entry"]:not([hidden])', { timeout: 20000 });
  assert.match(await recorded(page), /2,100 kcal/, "the reload lost the intake");

  /* ---------- A REAL PROCESS KILL ---------- */
  await hardKill(context);
  ({ context, page } = await relaunch());
  line = await recorded(page);
  assert.match(line, /2,100 kcal/, "a real taskkill lost the intake");
  assert.match(line, /150 g protein/);
  notes.push("survived a real taskkill /F /T with the figures intact");

  /* ---------- A CORRECTION REPLACES THE DAY, and the replaced figure is GONE ----------
     The winning operation carries the WHOLE day, so calories entered on their own do
     not leave yesterday's protein standing beside them. This is the one behaviour a
     partial-merge writer would get wrong in exactly the way nobody notices. */
  await typeIntake(page, "1900", "");
  await tapSave(page);
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-slot="food-recorded"]');
    return el && el.textContent.includes("1,900 kcal");
  }, null, { timeout: 20000 });
  line = await recorded(page);
  assert.doesNotMatch(line, /g protein/, "the corrected day still shows the protein it replaced");
  notes.push("a correction replaced the day: " + line.trim());

  /* ---------- A REFUSAL RECORDS NOTHING, and says so in the screen's own words ---------- */
  await typeIntake(page, "20001", "");
  await tapSave(page);
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-slot="food-error"]');
    return el && el.textContent.trim().length > 0;
  }, null, { timeout: 20000 });
  const refusal = (await page.textContent('[data-slot="food-error"]')) || "";
  assert.match(refusal, /Nothing was recorded\./);
  assert.doesNotMatch(refusal, /[0-9],[0-9]/, "a refusal never quotes a figure back as recorded");
  assert.match(await recorded(page), /1,900 kcal/, "the refused entry changed the record");
  notes.push("an out-of-range entry was refused and changed nothing: " + refusal.trim());
  await noDashes(page, "nutrition, refused");

  /* ---------- 320px: the narrow phone, with the record already on it ---------- */
  await hardKill(context);
  ({ context, page } = await relaunch(NARROW));
  assert.match(await recorded(page), /1,900 kcal/, "the narrow relaunch lost the record");
  await reachable(page, "nutrition at 320");
  await boxesAreLargeEnough(page, "nutrition at 320");
  await noDashes(page, "nutrition at 320");
  assert.match(await entryText(page), /intake/i, "the entry is the same entry at 320px");
  await hardKill(context);
} catch (error) {
  failures += 1;
  problems.push(error && error.message ? error.message : String(error));
} finally {
  try { if (live) await live.close(); } catch (_) { /* already killed, which is the point */ }
  await new Promise(resolve => server.close(resolve));
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) {}
}

if (problems.length || failures) {
  console.error("N1 NUTRITION BROWSER CHECK FAIL:\n  " + problems.join("\n  "));
  process.exitCode = 1;
} else {
  console.log("N1 NUTRITION BROWSER CHECK PASS - ?screen=nutrition opened its own food lane -> "
    + "an intake recorded and read back off the engine -> a genuine reload -> a correction that "
    + "replaced the whole day -> an out-of-range entry refused with nothing written -> the same "
    + `record at 320px, across ${kills} REAL PROCESS KILLS (taskkill /F /T, each verified dead); `
    + "no off-origin request, no horizontal overflow at 390px or 320px, both boxes >= 16px and "
    + ">= 44px, the record control fully in view at both widths, and no U+2013 or U+2014 "
    + "rendered in anything N1 owns.\n  " + notes.join("\n  "));
}
