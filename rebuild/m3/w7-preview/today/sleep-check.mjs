// sleep-check.mjs - N2's row in a REAL browser (DECISIONS:167). It serves the built
// page over 127.0.0.1, drives it in a persistent browser profile, and proves the things
// a Node test cannot:
//   ?screen=sleep opens its own sleep lane -> a night is recorded from bed and wake
//   times -> the screen says what the ENGINE derived -> a genuine reload -> a genuine
//   PROCESS KILL -> the night is still there, out of this device's own encrypted
//   IndexedDB store -> and the recovery check-in, on the SAME page, stops asking for
//   the duration and offers that night for confirmation instead.
//
// It also measures what only a browser can: the entry and its one primary action are in
// view at 390x844 and at 320px with no sideways scroll, every box renders at 16px or
// more, every tap target is at least 44px high, no U+2013 or U+2014 is rendered in
// anything N2 owns, and the page requests nothing off this local origin.
//
// THE KILL IS THE POINT. context.close() is a graceful shutdown: the browser flushes
// what it was holding, which is exactly the case that HIDES a lane that only ever lived
// in memory. A taskkill /F /T is what makes "it is recorded" a fact about the store.
//
// It installs nothing. Point W7_BROWSER_BIN at an existing Chromium/Chrome/Edge
// executable; without it the check says so and exits 0 with a clear NOT RUN line.
//
//   node rebuild/m3/w7-preview/today/build.mjs
//   set W7_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
//   node rebuild/m3/w7-preview/today/sleep-check.mjs
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
  console.log("N2 SLEEP BROWSER CHECK NOT RUN - set W7_BROWSER_BIN to a Chromium executable. "
    + "This is not a pass.");
  process.exit(0);
}
const PROCESS_NAME = path.basename(executablePath);
const require = createRequire(path.join(here, "../../w6/package.json"));
const { chromium } = require("playwright-core");

const VIEWPORT = { width: 390, height: 844 };
const NARROW = { width: 320, height: 844 };
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "n2-sleep-profile-"));
const server = await startServer({ port: 0 });
const url = `http://127.0.0.1:${server.address().port}/`;
const problems = [];
const notes = [];
let kills = 0;

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

let live = null;
/* THE LANE IS OPENED BY THE SCREEN, asynchronously and failing closed, so "the entry is
   on the page" is the signal that this device really did give the page a store. */
async function launch(viewport = VIEWPORT) {
  const context = await chromium.launchPersistentContext(profile, { executablePath, headless: true, viewport });
  const page = watch(context.pages()[0] || await context.newPage());
  await page.goto(url + "?screen=sleep", { waitUntil: "load" });
  await page.waitForSelector('#phone [data-slot="sleep-entry-form"]:not([hidden])', { timeout: 20000 });
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

const recorded = (page) => page.textContent('[data-slot="sleep-recorded"]').then(v => v || "");
const estimate = (page) => page.textContent('[data-slot="sleep-estimate"]').then(v => v || "");

/* Type the way a thumb does: set the value and dispatch the platform's own event. */
async function typeTimes(page, bed, wake) {
  await page.evaluate(([b, w]) => {
    for (const [id, value] of [["sleep-bed", b], ["sleep-wake", w]]) {
      const box = document.getElementById(id);
      box.value = value;
      box.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }, [bed, wake]);
}
async function typeHours(page, hours) {
  await page.evaluate((h) => {
    const box = document.getElementById("sleep-hours");
    box.value = h;
    box.dispatchEvent(new Event("input", { bubbles: true }));
  }, hours);
}
const tapSave = (page) => page.click('#phone [data-slot="sleep-save"]');

async function reachable(page, label) {
  const box = await page.evaluate(() => {
    const view = document.querySelector(".view");
    const cta = document.querySelector('#phone [data-slot="sleep-save"]');
    if (!cta) return null;
    cta.scrollIntoView({ block: "end" });
    const rect = cta.getBoundingClientRect(), frame = view.getBoundingClientRect();
    return { top: Math.round(rect.top - frame.top), bottom: Math.round(rect.bottom - frame.top),
      height: Math.round(rect.height), viewport: Math.round(view.clientHeight),
      primaries: document.querySelectorAll("#phone .primary").length,
      overflow: Math.round(view.scrollWidth - view.clientWidth) };
  });
  assert(box, label + ": no save control on screen");
  assert(box.bottom <= box.viewport + 1,
    `${label}: the save control is not fully visible (${box.bottom} > ${box.viewport})`);
  assert(box.height >= 44, `${label}: the save control is ${box.height}px high`);
  assert(box.overflow <= 0, `${label}: the screen scrolls sideways by ${box.overflow}px`);
  assert.equal(box.primaries, 1, `${label}: ${box.primaries} primary actions, not one`);
  notes.push(`${label}: save control ${box.top}-${box.bottom} in a ${box.viewport}px viewport, `
    + `${box.height}px high, ONE primary action, no sideways scroll`);
  return box;
}
async function boxesAreLargeEnough(page, label) {
  const sizes = await page.evaluate(() => [...document.querySelectorAll('#phone [data-slot="sleep-entry-form"] input')]
    .filter(el => el.offsetParent !== null)
    .map(el => ({ id: el.id, size: Math.round(parseFloat(getComputedStyle(el).fontSize)),
      h: Math.round(el.getBoundingClientRect().height) })));
  assert(sizes.length >= 1, label + ": no visible box on the entry");
  for (const entry of sizes) {
    assert(entry.size >= 16, `${label}: ${entry.id} renders at ${entry.size}px`);
    assert(entry.h >= 44, `${label}: ${entry.id} is ${entry.h}px high`);
  }
  notes.push(`${label}: ${sizes.length} visible box(es), each >= 16px text and >= 44px high`);
  return sizes;
}
/* THE OWNER'S RULE, AT RENDER TIME (DECISIONS:114 (1)), scoped to what N2 owns. */
async function noDashes(page, label) {
  const hits = await page.evaluate(([em, en]) => {
    const roots = [document.querySelector('[data-slot="sleep-entry-form"]'),
      document.querySelector('[data-slot="sleep-note"]'),
      document.querySelector('[data-slot="sleep-night"]')].filter(Boolean);
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
  assert.match(opened, /Night of \d{4}-\d{2}-\d{2}/, "the night label is the NIGHT's own date");
  /* The preview athlete arrives with an imported basis of nights, so this launch reads
     one back. It carries NO provenance, because no operation on this device made it. */
  const basisLine = await recorded(page);
  assert.match(basisLine, /^\d+(\.\d+)? h$/,
    "an imported basis night shows its figure and claims nothing else: " + basisLine);
  notes.push("the imported basis night is shown with no invented provenance: " + basisLine.trim());
  assert.equal(await page.getAttribute('[data-slot="sleep-mode-times"]', "aria-pressed"), "true",
    "bed and wake times is the first mode");
  await reachable(page, "sleep at 390");
  await boxesAreLargeEnough(page, "sleep at 390");
  await noDashes(page, "sleep at 390");

  /* ---------- the estimate is the ENGINE's, shown as an estimate ---------- */
  await typeTimes(page, "23:00", "06:30");
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-slot="sleep-estimate"]');
    return el && /Estimate from clock times/.test(el.textContent);
  }, null, { timeout: 20000 });
  const shown = await estimate(page);
  assert.match(shown, /7\.5 h/, "23:00 to 06:30 is the engine's own 7.5 h: " + shown);
  notes.push("the clock-time estimate is the engine's own span: " + shown.trim());

  /* ---------- the night is recorded ---------- */
  await tapSave(page);
  /* Wait for the line to carry the PROVENANCE of a night this device recorded: the
     imported basis night was already on the screen, so "not empty" proves nothing. */
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-slot="sleep-recorded"]');
    return el && !el.hidden && /From bed and wake times\./.test(el.textContent);
  }, null, { timeout: 20000 });
  let line = await recorded(page);
  assert.match(line, /^7\.5 h/, "the recorded line leads with the engine's hours: " + line);
  assert.match(line, /From bed and wake times\./, "and says which shape it came from");
  assert.match(line, /Recorded \d{4}-\d{2}-\d{2} at \d{2}:\d{2}/, "with the stamp on the operation");
  assert.equal(await page.inputValue("#sleep-bed"), "", "the boxes are clear for the next correction");
  notes.push("a night recorded from bed and wake times: " + line.trim());

  /* ---------- a genuine reload ---------- */
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('#phone [data-slot="sleep-entry-form"]:not([hidden])', { timeout: 20000 });
  assert.match(await recorded(page), /7\.5 h/, "the reload lost the night");

  /* ---------- A REAL PROCESS KILL ---------- */
  await hardKill(context);
  ({ context, page } = await relaunch());
  assert.match(await recorded(page), /7\.5 h/, "a real taskkill lost the night");
  notes.push("survived a real taskkill /F /T with the night intact");

  /* ---------- THE CHECK-IN STOPS ASKING TWICE, ON THE SAME PAGE ----------
     No reload between the save and the check-in: the route rebinds the check-in over
     the SAME host and the CURRENT projected state, which is the journey D2's own
     correction 1 asks for. */
  await page.click('#phone [data-go="today"]');
  await page.waitForSelector('#phone [data-go="recovery"]');
  await page.click('#phone [data-go="recovery"]');
  await page.waitForSelector('#phone [data-slot="sleep-known"], #phone .option', { timeout: 20000 });
  const sheet = await page.textContent("#phone");
  assert.match(sheet, /7\.5/, "the check-in did not offer the night N2 recorded: " + sheet.slice(0, 200));
  notes.push("the recovery check-in offered the recorded night on the SAME page, with no reload");
  await page.click('#phone [data-go="today"]');
  await page.waitForSelector('#phone [data-go="sleep"]');
  assert.match(await page.textContent('#phone [data-slot="sleep-state"]'), /7\.5 h/,
    "Today's own sleep line is the durable record");

  /* ---------- A CORRECTION REPLACES THE NIGHT, and the clock fields are GONE ---------- */
  await page.click('#phone [data-go="sleep"]');
  await page.waitForSelector('#phone [data-slot="sleep-entry-form"]:not([hidden])');
  await page.click('#phone [data-action="sleep-mode-hours"]');
  await page.waitForSelector('#phone #sleep-hours');
  await typeHours(page, "5.5");
  await tapSave(page);
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-slot="sleep-recorded"]');
    return el && el.textContent.includes("5.5 h");
  }, null, { timeout: 20000 });
  line = await recorded(page);
  assert.match(line, /Entered as an approximate duration\./, "the corrected shape is named");
  assert.doesNotMatch(line, /From bed and wake times/, "the replaced shape is gone, not stale");
  notes.push("a correction replaced the night: " + line.trim());

  /* ---------- A REFUSAL RECORDS NOTHING ---------- */
  await typeHours(page, "25");
  await tapSave(page);
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-slot="sleep-error"]');
    return el && el.textContent.trim().length > 0;
  }, null, { timeout: 20000 });
  const refusal = (await page.textContent('[data-slot="sleep-error"]')) || "";
  assert.match(refusal, /Nothing was recorded\./);
  assert.match(await recorded(page), /5\.5 h/, "the refused entry changed the record");
  notes.push("an out-of-range duration was refused and changed nothing: " + refusal.trim());
  await noDashes(page, "sleep, refused");

  /* ---------- 320px ---------- */
  await hardKill(context);
  ({ context, page } = await relaunch(NARROW));
  assert.match(await recorded(page), /5\.5 h/, "the narrow relaunch lost the record");
  await reachable(page, "sleep at 320");
  await boxesAreLargeEnough(page, "sleep at 320");
  await noDashes(page, "sleep at 320");
  await hardKill(context);
} catch (error) {
  failures += 1;
  problems.push(error && error.message ? error.message : String(error));
} finally {
  const bounded = (work) => Promise.race([work.catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 5000))]);
  if (live) await bounded(Promise.resolve().then(() => live.close()));
  if (typeof server.closeAllConnections === "function") server.closeAllConnections();
  await bounded(new Promise((resolve) => server.close(resolve)));
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) {}
}

if (problems.length || failures) {
  console.error("N2 SLEEP BROWSER CHECK FAIL:\n  " + problems.join("\n  "));
  process.exitCode = 1;
} else {
  console.log("N2 SLEEP BROWSER CHECK PASS - ?screen=sleep opened its own sleep lane -> the "
    + "engine's own clock-time estimate -> a night recorded with its provenance -> a genuine "
    + "reload -> the recovery check-in offered that night on the SAME page with no reload -> a "
    + "correction that replaced the whole night -> an out-of-range duration refused with nothing "
    + `written -> the same record at 320px, across ${kills} REAL PROCESS KILLS (taskkill /F /T, `
    + "each verified dead); no off-origin request, no horizontal overflow at 390px or 320px, "
    + "every visible box >= 16px and >= 44px, exactly ONE primary action, and no U+2013 or "
    + "U+2014 rendered in anything N2 owns.\n  " + notes.join("\n  "));
}
/* A killed browser can leave a handle this process cannot drain. */
process.exit(process.exitCode || 0);
