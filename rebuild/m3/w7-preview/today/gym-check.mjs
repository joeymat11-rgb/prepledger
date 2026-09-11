// OPTIONAL, PC-only: drive the WHOLE gym-card journey in a real Chromium, on a
// PERSISTENT browser profile, and prove the things a Node test cannot —
//   Today -> Start -> active set -> log a set -> saved-set/rest -> Undo -> next set
//   -> finish -> Today reflects it,
// across a genuine reload, a genuinely new page, and a genuine PROCESS KILL (the
// browser is closed and relaunched over the same profile directory, so the whole
// journey has to come back out of this device's own encrypted IndexedDB store).
//
// It also measures what only a browser can: the single primary action is inside the
// 390x844 viewport in every gym state, every input renders at 16px or more, nothing
// overflows horizontally, and the page requests nothing off this local origin.
//
// It installs nothing. Point W7_BROWSER_BIN at an existing Chromium/Chrome
// executable; without it the check says so and exits 0 with a clear NOT RUN line, so
// it can never be mistaken for a pass.
//
//   node rebuild/m3/w7-preview/today/build.mjs
//   set W7_BROWSER_BIN=C:\Users\<you>\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe
//   node rebuild/m3/w7-preview/today/gym-check.mjs
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
  console.log("A2 GYM BROWSER CHECK NOT RUN — set W7_BROWSER_BIN to a Chromium executable. "
    + "This is not a pass.");
  process.exit(0);
}
const require = createRequire(path.join(here, "../../w6/package.json"));
const { chromium } = require("playwright-core");

const VIEWPORT = { width: 390, height: 844 };
// Figures out of the approved prototype. Its numbers are fictional; this synthetic
// athlete's engine cannot produce them, so one on screen means template text survived.
const FICTIONAL = ["135 lb", "9 reps", "2:30", "+30 seconds", "Exercise 1 of 9", "All 9",
  "Chest press complete", "Machine fly"];

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "a2-gym-profile-"));
const server = await startServer({ port: 0 });
const url = `http://127.0.0.1:${server.address().port}/`;
const problems = [];
const notes = [];
let failures = 0;

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
async function launch() {
  const context = await chromium.launchPersistentContext(profile, { executablePath, headless: true, viewport: VIEWPORT });
  const page = watch(context.pages()[0] || await context.newPage());
  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector('[data-slot="primary-label"]');
  return { context, page };
}

/* A REAL PROCESS KILL (review B2). context.close() is a graceful shutdown: the
   browser gets to flush everything it was holding, which is exactly the case that
   HIDES the defect this check exists to catch. iOS terminating a backgrounded tab
   does not ask politely, and neither does this: every chrome.exe whose command line
   names this profile directory is killed with `taskkill /F /T`, and the kill is
   verified before the next launch. Nothing the browser had not already committed to
   disk survives it. */
function chromeProcessesForProfile() {
  const script = "Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | "
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
  assert(pids.length > 0, "no chrome process was found for this profile — the kill would prove nothing");
  for (const pid of pids) {
    try { execFileSync("taskkill.exe", ["/F", "/T", "/PID", String(pid)], { stdio: "ignore", timeout: 30000 }); }
    catch (_) { /* a child may already be gone with its parent */ }
  }
  // The browser must really be dead before anything reopens the profile.
  for (let tick = 0; tick < 100; tick++) {
    if (chromeProcessesForProfile().length === 0) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.equal(chromeProcessesForProfile().length, 0, "the browser survived taskkill /F /T");
  // Playwright's handle is now pointing at a corpse; let it clean up quietly.
  try { await context.close(); } catch (_) { /* already gone — that is the point */ }
  kills += 1;
  // A killed Chromium leaves its singleton lock behind; a fresh profile lock is
  // what the next launch needs, and Chromium reclaims a stale one itself.
  await new Promise(resolve => setTimeout(resolve, 250));
}
let kills = 0;
const text = (page, selector) => page.textContent(selector).then((value) => (value || "").trim());
const seen = (page, selector) => page.$(selector).then((handle) => !!handle);

/* The one primary action of whatever screen is showing must be inside the scrolling
   viewport, and the page must not scroll sideways. Measured, never asserted. */
async function reachable(page, selector, label) {
  const box = await page.evaluate((sel) => {
    const view = document.querySelector(".view");
    const cta = document.querySelector(sel);
    if (!cta) return null;
    const top = view.getBoundingClientRect().top;
    const rect = cta.getBoundingClientRect();
    return { bottom: Math.round(rect.bottom - top), viewport: Math.round(view.clientHeight),
      overflow: Math.round(view.scrollWidth - view.clientWidth) };
  }, selector);
  assert(box, label + ": no primary action on screen");
  assert(box.bottom <= box.viewport,
    `${label}: the primary action is below the fold (bottom ${box.bottom} > ${box.viewport})`);
  assert(box.overflow <= 0, `${label}: the screen scrolls sideways by ${box.overflow}px`);
  notes.push(`${label} ${box.viewport - box.bottom}px headroom`);
  return box;
}
async function inputsAreLargeEnough(page, label) {
  const sizes = await page.evaluate(() => [...document.querySelectorAll("#phone input, #phone select, #phone textarea")]
    .map((el) => ({ id: el.id || el.tagName, size: Math.round(parseFloat(getComputedStyle(el).fontSize)) })));
  for (const entry of sizes) assert(entry.size >= 16, `${label}: ${entry.id} renders at ${entry.size}px`);
  return sizes;
}

try {
  /* ---------- launch 1: weigh in, open the gym card, log, undo, log again ---------- */
  let { context, page } = await launch();
  assert.equal(await text(page, '[data-slot="morning"]'), "This morning — not logged yet",
    "a fresh profile holds no reading");
  /* The sheet awaits a real encrypted-repository transaction now (review B2), so the
     check waits for the sheet to close and the reading to appear, not for a selector
     that was already on screen. */
  await page.click('[data-slot="primary"]');
  await page.waitForSelector("#morning-weight");
  await page.fill("#morning-weight", "179.4");
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('[role="dialog"]', { state: "detached" });
  await page.waitForFunction(() => /✓/.test(document.querySelector('[data-slot="morning"]').textContent));
  const startLabel = await text(page, '[data-slot="primary-label"]');
  assert.match(startLabel, /^Start /, "after the weigh-in the primary action starts today's workout: " + startLabel);
  const sessionTitle = startLabel.replace(/^Start /, "");
  assert.match(await text(page, '[data-slot="workout-count"]'), /Your set targets are ready$/);

  await page.click('[data-slot="primary"]');
  await page.waitForSelector('[data-slot="plan"]');
  const plan = await text(page, '[data-slot="plan"]');
  const effortTarget = await text(page, '[data-slot="effort-target"]');
  assert.match(plan, /^\d+(\.\d+)? lb × \d+ reps$/, "the active set shows the engine's prescription: " + plan);
  assert.match(effortTarget, /^Aim to finish with \d+ clean reps left\.$/, effortTarget);
  assert.equal(await text(page, '[data-slot="entry-title"]'), "What you did · Set 1");
  const prescribedLoad = await page.inputValue("#gym-weight");
  const prescribedReps = await page.inputValue("#gym-reps");
  assert.equal(plan, prescribedLoad + " lb × " + prescribedReps + " reps",
    "the performed boxes open at the prescription, shown separately above them");
  const pressed = await page.evaluate(() => [...document.querySelectorAll(".choice")]
    .map((b) => ({ label: b.textContent, pressed: b.getAttribute("aria-pressed") })));
  assert.equal(pressed.length, 5);
  assert.deepEqual(pressed.map((p) => p.label), ["0", "1", "2", "3+", "Unsure"]);
  for (const choice of pressed) assert.equal(choice.pressed, "false", "no effort answer is preselected");
  await reachable(page, '[data-slot="log"]', "active set");
  await inputsAreLargeEnough(page, "active set");

  // An entry with no effort answer is refused in words and records nothing.
  await page.click('[data-slot="log"]');
  await page.waitForFunction(() => document.querySelector("#gym-error").textContent.trim().length > 0);
  assert.match(await text(page, "#gym-error"), /Choose clean reps left, or Unsure\./);
  assert(await seen(page, '[data-slot="log"]'), "the screen stays on the active set");

  // Log set 1 with an explicit UNKNOWN effort, and an edited performed weight/reps.
  await page.fill("#gym-weight", "45");
  await page.fill("#gym-reps", "11");
  await page.click('.choice:nth-child(5)');
  await page.click('[data-slot="log"]');
  await page.waitForSelector('[data-slot="saved-facts"]');
  assert.equal(await text(page, '[data-slot="saved-title"]'), "Set 1 logged");
  assert.equal(await text(page, '[data-slot="saved-facts"]'), "45 lb × 11 reps · Effort unknown",
    "the saved screen shows exactly the stored facts, and an unknown effort as unknown");
  assert.equal(await text(page, '[data-slot="rest-note"]'), "Your plan does not set a rest length.");
  assert.match(await text(page, '[data-slot="next-label"]'), /^Next · Set 2 of /);
  assert.match(await text(page, '[data-slot="next-plan"]'), /^\d+(\.\d+)? lb × \d+ reps$/);
  assert.equal(await text(page, '[data-slot="primary-label"]'), "Ready for set 2");
  assert(await seen(page, '[data-action="undo"]'), "Undo is on the saved-set screen");
  await reachable(page, '[data-slot="primary"]', "saved set");

  // UNDO really removes it: the screen goes back to set 1 with nothing logged.
  await page.click('[data-action="undo"]');
  await page.waitForSelector('[data-slot="log"]');
  assert.equal(await text(page, '[data-slot="entry-title"]'), "What you did · Set 1",
    "Undo put the athlete back on the set that was undone");
  const stripAfterUndo = await page.evaluate(() => [...document.querySelectorAll(".slot")]
    .map((s) => ({ done: s.classList.contains("done"), text: s.textContent.trim() })));
  assert.equal(stripAfterUndo.filter((s) => s.done).length, 0, "no set is marked logged after Undo");

  // Log set 1 again, this time with a stated effort, then rest.
  await page.click('.choice:nth-child(3)');
  await page.click('[data-slot="log"]');
  await page.waitForSelector('[data-slot="saved-facts"]');
  const firstFacts = await text(page, '[data-slot="saved-facts"]');
  assert.match(firstFacts, /clean reps left$/, firstFacts);

  /* ---------- THE PROCESS KILL — taskkill /F /T, not a graceful close ---------- */
  await hardKill(context);
  ({ context, page } = await launch());
  assert.match(await text(page, '[data-slot="workout-count"]'), /Workout in progress$/,
    "Today knows a workout is in progress after the browser was KILLED");
  const resumeLabel = await text(page, '[data-slot="primary-label"]');
  assert.equal(resumeLabel, "Resume " + sessionTitle, "the resume action is on Today: " + resumeLabel);
  assert.equal(await text(page, '[data-slot="morning"]'), "This morning ✓ 179.4 lb",
    "REVIEW B2: the morning reading survived the kill because it is in the encrypted store");
  assert.match(await text(page, '[data-slot="trend"]'), /^Weight trend \d+\.\d lb/,
    "and the engine recomputed the trend from that surviving reading");

  await page.click('[data-slot="primary"]');
  await page.waitForSelector('[data-slot="log"]');
  assert.equal(await text(page, '[data-slot="entry-title"]'), "What you did · Set 2",
    "the session resumed at the next set, out of this device's own store");
  const resumedStrip = await page.evaluate(() => [...document.querySelectorAll(".slot")]
    .map((s) => ({ done: s.classList.contains("done"), text: s.textContent.trim() })));
  assert.equal(resumedStrip.filter((s) => s.done).length, 1, "the recorded set came back");
  assert.match(resumedStrip[0].text, /logged$/, resumedStrip[0].text);

  /* ---------- finish the workout ---------- */
  let guard = 0;
  while (await seen(page, '[data-slot="log"]')) {
    if (guard++ > 20) throw new Error("the workout never finished");
    await reachable(page, '[data-slot="log"]', "active set " + guard);
    await page.click('.choice:nth-child(3)');
    await page.click('[data-slot="log"]');
    await page.waitForSelector('[data-slot="primary-label"]');
    const label = await text(page, '[data-slot="primary-label"]');
    await reachable(page, '[data-slot="primary"]', "saved set " + guard);
    if (label === "Finish this workout") break;
    assert.match(label, /^Ready for set /, label);
    await page.click('[data-slot="primary"]');
    await page.waitForSelector('[data-slot="log"]');
  }
  assert.equal(await text(page, '[data-slot="primary-label"]'), "Finish this workout");
  await page.click('[data-slot="primary"]');
  await page.waitForSelector('[data-slot="workout-count"]');
  assert.match(await text(page, '[data-slot="workout-count"]'), /Workout recorded$/,
    "Today reflects the finished workout");
  assert.equal(await text(page, '[data-slot="primary-label"]'), "Review today’s workout");
  await reachable(page, '[data-slot="primary"]', "Today, workout recorded");

  /* ---------- a real reload, a genuinely new page, and one more kill ---------- */
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-slot="workout-count"]');
  assert.match(await text(page, '[data-slot="workout-count"]'), /Workout recorded$/, "survived a reload");
  const fresh = watch(await context.newPage());
  await fresh.goto(url, { waitUntil: "load" });
  await fresh.waitForSelector('[data-slot="workout-count"]');
  assert.match(await text(fresh, '[data-slot="workout-count"]'), /Workout recorded$/, "a new page agrees");
  await hardKill(context);

  ({ context, page } = await launch());
  assert.match(await text(page, '[data-slot="workout-count"]'), /Workout recorded$/,
    "the finished workout survived a second REAL process kill");
  assert.equal(await text(page, '[data-slot="morning"]'), "This morning ✓ 179.4 lb",
    "and so did the morning reading");
  const finalText = await page.textContent("#phone");
  for (const figure of FICTIONAL) assert(!finalText.includes(figure), "prototype figure on screen: " + figure);

  // The durable store really is this device's own encrypted IndexedDB.
  const databases = await page.evaluate(() => indexedDB.databases().then((list) => list.map((d) => d.name)));
  assert(databases.includes("earned-today-preview-workout"), "the workout store is on this device: " + databases);
  assert(databases.includes("earned-today-preview-readings"), "so is the weigh-in store: " + databases);
  assert(databases.includes("earned-today-preview-device-keys"), "this device kept its own keys: " + databases);
  // Nothing of record is in localStorage any more (review B2).
  const local = await page.evaluate(() => Object.keys(localStorage));
  assert.deepEqual(local, [], "nothing of record is kept in localStorage: " + JSON.stringify(local));
  await context.close();

  assert.equal(kills, 2, "two REAL process kills were executed");
  assert.deepEqual(problems, [], "no page error, console error or offsite request");
  console.log("A2 GYM BROWSER CHECK PASS — Today -> Start -> active set (prescription shown separately from "
    + "editable performed values, no effort preselected) -> refusal without an effort answer -> logged with an "
    + "explicit unknown effort -> saved facts + Undo + rest + next set -> Undo removed it -> relogged -> "
    + "REAL PROCESS KILL (taskkill /F /T on every chrome.exe of the persistent profile, kill verified) -> the "
    + "weigh-in AND the in-progress workout both came back out of the encrypted store and the session resumed at "
    + "the next set -> finished -> Today says recorded, through a reload, a new page and a SECOND real kill. "
    + "localStorage holds nothing. Headroom: " + notes.join(", ")
    + ". No network request; no prototype figure on screen; every input >= 16px; no horizontal overflow.");
} catch (error) {
  failures = 1;
  console.error("A2 GYM BROWSER CHECK FAIL — " + error.message);
  for (const problem of problems) console.error("  " + problem);
} finally {
  await new Promise((resolve) => server.close(resolve));
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) { /* the profile is a temp dir */ }
}
process.exitCode = failures;
