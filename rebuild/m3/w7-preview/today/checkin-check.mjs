// OPTIONAL, PC-only: drive the WHOLE recovery check-in journey in a real Chromium, on
// a PERSISTENT browser profile, and prove the things a Node test cannot —
//   Today -> "How are you feeling today?" -> a blank sheet -> answers tapped, one
//   cleared again, a conditional branch opened -> "Add today's context" -> the screen
//   reads today's answers back with their provenance -> Today says so,
// across a genuine reload, a genuinely new page, and a genuine PROCESS KILL (the
// browser is closed and relaunched over the same profile directory, so the check-in
// has to come back out of this device's own encrypted IndexedDB store), and across a
// genuine CHANGE OF DAY, where yesterday's answers must not reappear as today's.
//
// It also measures what only a browser can: nothing overflows horizontally, every
// input renders at 16px or more, every tap target is at least 44px high, the primary
// action is reachable in every branch state, and the page requests nothing off this
// local origin.
//
// THE VIEWPORT MEASUREMENT, HONESTLY. The approved recovery screen is a FORM, and the
// approved reference itself is taller than a 390x844 viewport: it scrolls. So this
// check does not assert that the primary action sits above the fold unscrolled — that
// would require shrinking or hiding part of the approved design. It asserts (a) that
// the primary action is fully visible once scrolled to, in EVERY branch state, (b)
// that the page never scrolls sideways, and (c) that this page is no more than a
// bounded, NAMED allowance taller than the approved reference's own recovery screen
// rendered at the same size — measured, from the pinned approved bytes, in this same
// browser. The allowance is the sleep record offered for confirmation with its
// provenance (which the approved prototype cannot have, because it stores nothing)
// plus the 16px floor on the conditional fields.
//
// It installs nothing. Point W7_BROWSER_BIN at an existing Chromium/Chrome
// executable; without it the check says so and exits 0 with a clear NOT RUN line, so
// it can never be mistaken for a pass.
//
//   node rebuild/m3/w7-preview/today/build.mjs
//   set W7_BROWSER_BIN=C:\Users\<you>\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe
//   node rebuild/m3/w7-preview/today/checkin-check.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "./serve.mjs";
// P1 (DECISIONS:114 (1)): every check-in state this check reaches is swept for an em or
// en dash in the REAL rendered DOM.
import { assertNoDashOnScreen } from "./dash-check.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const executablePath = process.env.W7_BROWSER_BIN;
if (!executablePath) {
  console.log("A3 CHECK-IN BROWSER CHECK NOT RUN — set W7_BROWSER_BIN to a Chromium executable. "
    + "This is not a pass.");
  process.exit(0);
}
/* C4c, minimal and disclosed (lane C): the process this check kills is the one
   W7_BROWSER_BIN actually names. It was the literal "chrome.exe", so on a machine
   whose Chromium is Edge the kill found nothing and the check failed on its own
   guard — the same defect C4b review D3 fixed in gym-check.mjs and
   browser-check.mjs. Nothing else in this file is touched. */
const PROCESS_NAME = path.basename(executablePath);
const require = createRequire(path.join(here, "../../w6/package.json"));
const hereRequire = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const VIEWPORT = { width: 390, height: 844 };
const DAY_ONE = hereRequire("./today-model.cjs").SYNTHETIC_DAY;
const DAY_TWO = (() => {
  const [y, m, d] = DAY_ONE.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
})();
// Figures out of the approved prototype. Its numbers are fictional; nothing this page
// stores can produce them, so one on screen means template text survived.
const FICTIONAL = ["135 lb", "9 reps", "2:30", "2,300", "160 g protein"];

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "a3-checkin-profile-"));
const server = await startServer({ port: 0 });
const url = `http://127.0.0.1:${server.address().port}/`;
const problems = [];
const notes = [];
let kills = 0;

function watch(page) {
  page.on("pageerror", (error) => problems.push("pageerror: " + error.message));
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
async function launch(query = "") {
  const context = await chromium.launchPersistentContext(profile, { executablePath, headless: true, viewport: VIEWPORT });
  const page = watch(context.pages()[0] || await context.newPage());
  await page.goto(url + query, { waitUntil: "load" });
  await page.waitForSelector('[data-slot="primary-label"]');
  return { context, page };
}

/* A REAL PROCESS KILL. context.close() is a graceful shutdown: the browser gets to
   flush everything it was holding, which is exactly the case that HIDES the defect
   this check exists to catch. iOS terminating a backgrounded tab does not ask
   politely, and neither does this. */
function chromeProcessesForProfile() {
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
  const pids = chromeProcessesForProfile();
  assert(pids.length > 0,
    "no " + PROCESS_NAME + " process was found for this profile — the kill would prove nothing");
  for (const pid of pids) {
    try { execFileSync("taskkill.exe", ["/F", "/T", "/PID", String(pid)], { stdio: "ignore", timeout: 30000 }); }
    catch (_) { /* a child may already be gone with its parent */ }
  }
  for (let tick = 0; tick < 100; tick++) {
    if (chromeProcessesForProfile().length === 0) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.equal(chromeProcessesForProfile().length, 0, "the browser survived taskkill /F /T");
  try { await context.close(); } catch (_) { /* already gone — that is the point */ }
  kills += 1;
  await new Promise(resolve => setTimeout(resolve, 250));
}

const text = (page, selector) => page.textContent(selector).then(v => (v || "").trim());
const phone = page => page.textContent("#phone").then(v => v || "");
const pressed = (page, label) => page.evaluate(l => {
  const b = [...document.querySelectorAll("#phone .option")].find(x => x.textContent.trim() === l);
  return b ? b.getAttribute("aria-pressed") : null;
}, label);
const tap = (page, label) => page.evaluate(l => {
  const b = [...document.querySelectorAll("#phone .option")].find(x => x.textContent.trim() === l);
  if (!b) throw new Error("no option " + l);
  b.click();
}, label);

/* Reachability, measured, never asserted: the primary action must be fully visible
   once it is scrolled to, and the page must never scroll sideways. */
async function reachable(page, label) {
  const box = await page.evaluate(() => {
    const view = document.querySelector(".view");
    const cta = document.querySelector('#phone [data-slot="primary"]');
    if (!cta) return null;
    cta.scrollIntoView({ block: "end" });
    const rect = cta.getBoundingClientRect(), frame = view.getBoundingClientRect();
    return { top: Math.round(rect.top - frame.top), bottom: Math.round(rect.bottom - frame.top),
      viewport: Math.round(view.clientHeight), content: Math.round(view.scrollHeight),
      overflow: Math.round(view.scrollWidth - view.clientWidth) };
  });
  assert(box, label + ": no primary action on screen");
  assert(box.bottom <= box.viewport + 1, `${label}: the primary action is not fully visible (${box.bottom} > ${box.viewport})`);
  assert(box.top >= 0, `${label}: the primary action is cut off at the top`);
  assert(box.overflow <= 0, `${label}: the screen scrolls sideways by ${box.overflow}px`);
  notes.push(`${label} content ${box.content}px in a ${box.viewport}px viewport`);
  /* P1 (DECISIONS:114 (1)): every state this check measures is also swept for a dash. */
  await noDashes(page, label);
  return box;
}
/* P1: the owner's no-dashes rule, at every state this check walks through. */
const dashStates = [];
async function noDashes(page, where) {
  await assertNoDashOnScreen(page, where);
  dashStates.push(where);
}
async function inputsAreLargeEnough(page, label) {
  const sizes = await page.evaluate(() => [...document.querySelectorAll("#phone input, #phone select, #phone textarea")]
    .map(el => ({ id: el.id || el.tagName, size: Math.round(parseFloat(getComputedStyle(el).fontSize)) })));
  for (const entry of sizes) assert(entry.size >= 16, `${label}: ${entry.id} renders at ${entry.size}px`);
  const targets = await page.evaluate(() => [...document.querySelectorAll("#phone button")]
    .filter(el => !el.hidden && el.offsetParent !== null)
    .map(el => ({ id: el.textContent.trim().slice(0, 24), h: Math.round(el.getBoundingClientRect().height) })));
  for (const entry of targets) assert(entry.h >= 44, `${label}: tap target "${entry.id}" is ${entry.h}px high`);
  return { inputs: sizes.length, targets: targets.length };
}
/* The approved reference's OWN recovery screen, rendered from its pinned bytes in this
   same browser at the same size. Its one Google-Fonts <link> is removed because this
   check has no network, so both pages fall back to the same system fonts and the
   comparison is like for like. */
async function approvedHeight(context) {
  const root = path.resolve(here, "../../../..");
  const file = path.join(root, "rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html");
  const html = fs.readFileSync(file, "utf8").replace(/<link rel="stylesheet"[^>]*>/g, "");
  const local = http.createServer((_req, res) => {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html);
  });
  await new Promise(resolve => local.listen(0, "127.0.0.1", resolve));
  const page = await context.newPage();
  try {
    await page.goto(`http://127.0.0.1:${local.address().port}/?screen=recovery`, { waitUntil: "load" });
    await page.waitForSelector(".checkin");
    return await page.evaluate(() => {
      const view = document.querySelector(".view");
      return { content: Math.round(view.scrollHeight), viewport: Math.round(view.clientHeight) };
    });
  } finally { await page.close(); local.close(); }
}

let failures = 0;
try {
  /* ---------- launch 1: a blank sheet, answered, one answer cleared ---------- */
  let { context, page } = await launch();

  assert.equal(await text(page, '[data-slot="recovery-state"]'), "",
    "a fresh device says nothing at all about the check-in");
  await page.click('[data-go="recovery"]');
  await page.waitForSelector("#phone .checkin");
  assert.match(await phone(page), /A quick check-in\./);

  const blank = await page.evaluate(() => ({
    pressed: [...document.querySelectorAll("#phone .option")].filter(b => b.getAttribute("aria-pressed") === "true").length,
    options: document.querySelectorAll("#phone .option").length,
    selects: [...document.querySelectorAll("#phone select")].filter(s => s.value !== "").length,
    filled: [...document.querySelectorAll("#phone input, #phone textarea")].filter(i => i.value !== "").length,
    open: [...document.querySelectorAll("#phone [data-follow]")].filter(b => !b.hidden).length,
  }));
  assert.equal(blank.pressed, 0, "every answer starts unselected");
  assert.equal(blank.selects, 0, "every conditional detail starts unanswered");
  assert.equal(blank.filled, 0, "no field is prefilled");
  assert.equal(blank.open, 0, "no detail branch is open");
  assert(blank.options >= 17, "the approved question set is on screen");
  notes.push(`blank sheet: ${blank.options} options, none pressed`);
  const blankHeight = (await reachable(page, "blank sheet")).content;
  await inputsAreLargeEnough(page, "blank sheet");

  /* The existing dated sleep record is offered for confirmation, not asked again. */
  assert.match(await phone(page), /Your sleep record already has last night\./);
  assert.match(await phone(page), /From your sleep record for /);
  assert.equal(await page.evaluate(() => document.querySelector('#phone [data-slot="sleep-ask"]').hidden), true,
    "the hours box is not shown while the record stands");

  /* Tap, then tap again: the answer clears and its branch closes with it. */
  await tap(page, "Mild");
  assert.equal(await pressed(page, "Mild"), "true");
  assert.equal(await page.evaluate(() => document.querySelector('#phone [data-follow="soreness"]').hidden), false);
  await reachable(page, "soreness detail open");
  await tap(page, "Mild");
  assert.equal(await pressed(page, "Mild"), "false", "a second tap clears the answer");
  assert.equal(await page.evaluate(() => document.querySelector('#phone [data-follow="soreness"]').hidden), true);
  assert.equal(await page.evaluate(() => document.querySelector("#sore-location").value), "",
    "the hidden detail is cleared, not merely hidden");

  /* Nothing answered at all is refused in words, and records nothing. */
  await page.click('#phone [data-slot="primary"]');
  await page.waitForFunction(() => document.querySelector("#checkin-error").textContent.trim().length > 0);
  assert.match(await text(page, "#checkin-error"), /Answer at least one question/);

  /* Now a real check-in: confirm the sleep record, answer three questions, open the
     pain branch and fill it. */
  await page.click('#phone [data-confirm="sleep"]');
  await tap(page, "Okay");
  await tap(page, "Significant");
  await page.fill("#sore-location", "quads and glutes");
  await page.selectOption("#sore-impact", "A little");
  await tap(page, "Pain");
  await page.fill("#pain-location", "left knee, on the press");
  await page.selectOption("#pain-change", "New");
  await page.selectOption("#pain-impact", "I change how I move");
  await reachable(page, "every branch open");
  await inputsAreLargeEnough(page, "every branch open");

  await page.click('#phone [data-slot="primary"]');
  await page.waitForFunction(() => document.querySelector("#phone").textContent.includes("Recorded today at "));
  const recorded = await phone(page);
  assert.match(recorded, /Recorded today at \d\d:\d\d/);
  assert.match(recorded, /Muscle soreness right now: Significant/);
  assert.match(recorded, /Which muscles\?: quads and glutes/);
  assert.match(recorded, /Where, and during which movement\?: left knee, on the press/);
  assert.match(recorded, /Your plan is unchanged/);
  assert.doesNotMatch(recorded, /readiness|score|out of|points/i, "no readiness word appears anywhere");
  await reachable(page, "recorded");
  notes.push("recorded and read back with provenance");

  /* ---------- the reload ---------- */
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-slot="primary-label"]');
  assert.equal(await text(page, '[data-slot="recovery-state"]'), "Recorded today");
  await page.click('[data-go="recovery"]');
  await page.waitForSelector("#phone .checkin");
  assert.match(await phone(page), /Recorded today at \d\d:\d\d/);
  assert.match(await phone(page), /already recorded on this device/);
  await noDashes(page, "the check-in read back after a reload");

  /* ---------- a genuinely new page ---------- */
  const second = watch(await context.newPage());
  await second.goto(url, { waitUntil: "load" });
  await second.waitForSelector('[data-slot="primary-label"]');
  assert.equal(await text(second, '[data-slot="recovery-state"]'), "Recorded today");
  await noDashes(second, "Today, on a new page, with the check-in recorded");
  await second.close();

  /* ---------- THE PROCESS KILL — taskkill /F /T, not a graceful close ---------- */
  await hardKill(context);
  ({ context, page } = await launch());
  assert.equal(await text(page, '[data-slot="recovery-state"]'), "Recorded today",
    "the check-in did not survive a real process kill");
  await page.click('[data-go="recovery"]');
  await page.waitForSelector("#phone .checkin");
  const afterKill = await phone(page);
  assert.match(afterKill, /Recorded today at \d\d:\d\d/);
  assert.match(afterKill, /Which muscles\?: quads and glutes/);
  await noDashes(page, "the check-in read back after a real process kill");
  notes.push("survived a real taskkill /F /T");

  /* ---------- the height comparison against the approved reference ---------- */
  const mine = await page.evaluate(() => {
    const view = document.querySelector(".view");
    return { content: Math.round(view.scrollHeight), viewport: Math.round(view.clientHeight) };
  });
  const theirs = await approvedHeight(context);
  assert(theirs.content > theirs.viewport,
    "the approved reference's own recovery screen fits the viewport — this page must then fit too");
  /* THE ALLOWANCE, NAMED AND BOUNDED. This page is taller than the approved reference
     by exactly the elements the approved prototype cannot have — the sleep record
     offered for confirmation with its provenance (approved handoff item 4; the
     prototype stores nothing, so it has no record to reuse), the state sentence, and
     the 16px floor the approved handoff's own verification asks for on the
     conditional fields. Bounded so that "a bit taller" can never quietly become a
     different screen. */
  assert(blankHeight - theirs.content <= 250,
    `the check-in has grown ${blankHeight - theirs.content}px beyond the approved reference`);
  notes.push(`blank screen ${blankHeight}px vs the approved reference ${theirs.content}px, recorded `
    + `${mine.content}px (viewport ${mine.viewport}px): the approved design is itself a scrolling form`);

  /* ---------- THE CHANGE OF DAY: yesterday is never today ---------- */
  await hardKill(context);
  ({ context, page } = await launch());
  /* The page's OWN entry point, standing on the next day over the same device
     storage. Nothing about the product changes to reach it. */
  await page.evaluate(async (day) => {
    const mod = await import(new URL("app.js", location.href).href);
    await mod.boot({ today: day });
  }, DAY_TWO);
  await page.waitForSelector('[data-slot="primary-label"]');
  const today = await text(page, '[data-slot="recovery-state"]');
  assert.equal(today, "", "yesterday's check-in is not today's");
  await page.click('[data-go="recovery"]');
  await page.waitForSelector("#phone .checkin");
  const day2 = await phone(page);
  assert.doesNotMatch(day2, /Recorded today at/, "yesterday's answers are not shown as today's");
  assert.doesNotMatch(day2, /quads and glutes/, "yesterday's detail is not carried forward");
  assert.doesNotMatch(day2, /left knee/, "yesterday's pain report is not carried forward");
  assert.equal(await page.evaluate(() =>
    [...document.querySelectorAll("#phone .option")].filter(b => b.getAttribute("aria-pressed") === "true").length), 0,
    "day two starts blank; a denial is never carried forward");
  assert.match(day2, /Nothing is recorded yet/);
  await reachable(page, "day two, blank");
  notes.push("day two starts blank over the same device storage");

  const face = await page.textContent("body");
  for (const fictional of FICTIONAL) {
    assert(!face.includes(fictional), "a fictional prototype figure is on screen: " + fictional);
  }
  await hardKill(context);
} catch (error) {
  failures += 1;
  problems.push(error && error.message ? error.message : String(error));
} finally {
  await new Promise(resolve => server.close(resolve));
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) {}
}

if (problems.length || failures) {
  console.error("A3 CHECK-IN BROWSER CHECK FAIL:\n  " + problems.join("\n  "));
  process.exitCode = 1;
} else {
  console.log("A3 CHECK-IN BROWSER CHECK PASS — blank sheet -> tap and clear -> conditional "
    + "branches -> sleep record confirmed with provenance -> recorded -> read back -> reload "
    + `-> new page -> ${kills} REAL PROCESS KILLS (taskkill /F /T, each verified dead) -> `
    + "a new day starts blank; no off-origin request, no horizontal overflow, every input "
    + ">= 16px, every tap target >= 44px, the primary action reachable in every branch state; "
    + `no em/en dash in the rendered DOM at any of the ${dashStates.length} states walked (DECISIONS:114).\n  `
    + notes.join("\n  "));
}
