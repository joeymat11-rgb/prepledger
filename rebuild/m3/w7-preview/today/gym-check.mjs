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
// C4b review D3 — the kill must name THIS browser, not a hardcoded chrome.exe.
const PROCESS_NAME = path.basename(executablePath);

const VIEWPORT = { width: 390, height: 844 };
// Figures out of the approved prototype. Its numbers are fictional; this synthetic
// athlete's engine cannot produce them, so one on screen means template text survived.
const FICTIONAL = ["135 lb", "9 reps", "2:30", "+30 seconds", "Exercise 1 of 9", "All 9",
  "Chest press complete", "Machine fly"];

// The SECOND training day, for the multi-day run below. The page's own entry
// point takes the day; nothing about the product changes to reach it.
const hereRequire = createRequire(import.meta.url);
const DAY_ONE = hereRequire("./today-model.cjs").SYNTHETIC_DAY;
// C4b: the ONE store's database name, taken from the page rather than restated.
const { DATABASE: LOCAL_DATABASE } = await import("./gym-host.mjs");
const DAY_TWO = (() => {
  const [y, m, d] = DAY_ONE.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
})();

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
   does not ask politely, and neither does this: every process of THIS BROWSER
   whose command line names this profile directory is killed with `taskkill /F
   /T`, and the kill is verified before the next launch. Nothing the browser had
   not already committed to disk survives it.

   C4b review D3: the name used to be the literal "chrome.exe", so on a machine
   whose W7_BROWSER_BIN is Edge the check did not report NOT RUN — it FAILED at
   the first kill, "no chrome process was found for this profile", before any of
   the assertions below could run. It is derived from the executable now, exactly
   as rebuild/m3/w6/test/local-today-browser.mjs already derives it. */
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
  assert(pids.length > 0, "no " + PROCESS_NAME + " process was found for this profile — the kill would prove nothing");
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

  /* ---------- REVIEW ROUND 2: THE SECOND TRAINING DAY ----------
     The athlete does not live inside one page load. This opens the page's OWN
     entry point on the next day, over the same device storage, and conducts a
     whole second session: weigh in, Start, every set, Finish. Round 1's build
     wrote a Start here that could never be ordered again, and every later day
     refused WORKOUT_HISTORY_RECONCILIATION_REQUIRED for good. */
  /* First, the SHIPPED fixture's own day 2. This preview athlete carries a ported
     (legacy) session log, so the ENGINE refuses every later scheduled day with its
     own code until a legacy-order-mapping provider exists (report §9.1). The point
     here is that it refuses, in the layer's words, and writes NOTHING. */
  const shippedDayTwo = await page.evaluate(async (day) => {
    const mod = await import(new URL("app.js", location.href).href);
    const booted = await mod.boot({ today: day });
    const ops = Object.values((await booted.workout.gymHost.repository.load()).generation.collections.ops || {});
    return { summary: booted.workout.summary(), ops: ops.length,
      workoutOps: ops.filter((op) => op.class === "session").length,
      readingOps: ops.filter((op) => op.class === "reading").length,
      dayTwoOps: ops.filter((op) => op.effective && op.effective.local_date === day).length };
  }, DAY_TWO);
  assert.equal(shippedDayTwo.summary.phase, "blocked", JSON.stringify(shippedDayTwo.summary));
  assert.equal(shippedDayTwo.summary.code, "PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED",
    "the ported-log athlete is walled by the ENGINE, in its own words: " + shippedDayTwo.summary.code);
  /* C4b — ONE STORE moved this number, and only this number. Day 1 left EIGHT
     WORKOUT operations: a Start, the set that was logged and then undone, its
     removal edit, the four sets that stand, and the close. It also logged one
     morning weigh-in, which before the swap lived in a second generation
     (earned-today-preview-readings) and is now in the SAME one — so the
     generation holds 9 — and every one of them is DAY ONE's.

     C4c, review round 2 nit 4: this comment used to promise the claim was made
     "against the count taken before the refused day" while the assertion under
     it compared a literal 9 and carried the message "a refused day writes
     nothing". 9 is the composition of day one, not evidence about day two, so
     the message described something the assertion was not testing. The claim is
     made directly now — nothing in the generation is stamped on the refused day
     — and the composition of day one keeps its own message. */
  assert.equal(shippedDayTwo.dayTwoOps, 0,
    "A REFUSED DAY WRITES NOTHING: no operation in the generation is stamped "
    + DAY_TWO + ", but " + shippedDayTwo.dayTwoOps + " are");
  assert.equal(shippedDayTwo.workoutOps, 8, "day 1's eight workout operations: " + shippedDayTwo.workoutOps);
  assert.equal(shippedDayTwo.readingOps, 1, "and the one morning, now in the SAME generation");
  assert.equal(shippedDayTwo.ops, 9,
    "which is all there is — day one's eight sets-and-session operations plus its one morning: "
    + shippedDayTwo.ops);

  /* Now the athlete S2 actually ships to. DECISIONS:100 has Joe starting FRESH, so
     the daily path that matters is the one without a ported log — same device, same
     encrypted stores, same page entry point, same durable session day 1 left. */
  const dayTwo = await page.evaluate(async (day) => {
    const mod = await import(new URL("app.js", location.href).href);
    const fresh = mod.createTodayModel({}).stateFromOps();
    fresh.sessionLog = {};
    const booted = await mod.boot({ today: day, basisState: fresh });
    return { failures: booted.failures, summary: booted.workout ? booted.workout.summary() : null };
  }, DAY_TWO);
  assert.deepEqual(dayTwo.failures, [], "day 2 opened both durable lanes: " + JSON.stringify(dayTwo.failures));
  assert(dayTwo.summary, "day 2 has a workout entry");
  assert.equal(dayTwo.summary.phase, "ready",
    "day 2 prepares on the same device, over day 1's stored session: " + JSON.stringify(dayTwo.summary));

  await page.waitForSelector('[data-slot="morning"]');
  assert.equal(await text(page, '[data-slot="morning"]'), "This morning — not logged yet",
    "day 2 has its own morning, and yesterday's reading is not reused");
  await page.click('[data-slot="primary"]');
  await page.waitForSelector("#morning-weight");
  await page.fill("#morning-weight", "178.9");
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('[role="dialog"]', { state: "detached" });
  await page.waitForFunction(() => /✓/.test(document.querySelector('[data-slot="morning"]').textContent));
  assert.match(await text(page, '[data-slot="primary-label"]'), /^Start /,
    "day 2 offers Start, not a refusal");

  await page.click('[data-slot="primary"]');
  await page.waitForSelector('[data-slot="log"]');
  let dayTwoGuard = 0;
  while (await seen(page, '[data-slot="log"]')) {
    if (dayTwoGuard++ > 20) throw new Error("day 2 never finished");
    await page.click('.choice:nth-child(3)');
    await page.click('[data-slot="log"]');
    await page.waitForSelector('[data-slot="primary-label"]');
    const label = await text(page, '[data-slot="primary-label"]');
    if (label === "Finish this workout") break;
    assert.match(label, /^Ready for set /, "day 2, set " + dayTwoGuard + ": " + label);
    await page.click('[data-slot="primary"]');
    await page.waitForSelector('[data-slot="log"]');
  }
  assert.equal(await text(page, '[data-slot="primary-label"]'), "Finish this workout");
  await page.click('[data-slot="primary"]');
  await page.waitForSelector('[data-slot="workout-count"]');
  assert.match(await text(page, '[data-slot="workout-count"]'), /Workout recorded$/,
    "day 2 recorded a whole second session");

  /* ---------- a THIRD real kill, then read both days back ---------- */
  await hardKill(context);
  ({ context, page } = await launch());
  const bothDays = await page.evaluate(async (day) => {
    const mod = await import(new URL("app.js", location.href).href);
    const fresh = mod.createTodayModel({}).stateFromOps();
    fresh.sessionLog = {};
    const booted = await mod.boot({ today: day, basisState: fresh });
    const read = await booted.workout.gymHost.host.client.readWorkoutHistory();
    const ops = Object.values((await booted.workout.gymHost.repository.load()).generation.collections.ops || {});
    const starts = ops.filter((op) => op.kind === "session-start");
    return { read: read.read, sessions: read.read ? read.history.sessions.length : null,
      summary: booted.workout.summary(), morning: booted.readings ? (await booted.readings.reads()).length : null,
      ops: ops.length,
      workoutOps: ops.filter((op) => op.class === "session").length,
      readingOps: ops.filter((op) => op.class === "reading").length,
      leases: [...new Set(ops.map((op) => op.lease_id))].length,
      startDays: starts.map((op) => op.effective.local_date).sort(),
      orphanStarts: starts.filter((op) => (op.causal_parents || []).length === 0).length,
      startParents: starts.map((start) => (start.causal_parents || [])
        .map((id) => { const parent = ops.find((op) => op.op_id === id); return parent ? parent.kind : "?"; })),
      startParentClasses: starts.map((start) => (start.causal_parents || [])
        .map((id) => { const parent = ops.find((op) => op.op_id === id); return parent ? parent.class : "?"; })) };
  }, DAY_TWO);
  assert.equal(bothDays.read, true, "the durable history still reads after the third REAL kill");
  assert.equal(bothDays.sessions, 2, "BOTH training days are on disk: " + bothDays.sessions);
  assert.equal(bothDays.summary.phase, "finished", "day 2 is still recorded: " + JSON.stringify(bothDays.summary));
  /* C4b — the second number ONE STORE moved. Day 1's eight workout operations
     plus day 2's six is still 14; the two mornings used to be 2 operations in a
     SECOND generation and are now in this one, so the generation holds 16 under
     ONE lease. Both halves are asserted separately rather than as one literal,
     so a future change to either journey says which half moved. */
  assert.equal(bothDays.workoutOps, 14, "day 1's eight workout operations plus day 2's six: " + bothDays.workoutOps);
  assert.equal(bothDays.readingOps, 2, "and both mornings, in the SAME generation: " + bothDays.readingOps);
  assert.equal(bothDays.ops, 16, "ONE generation holds all of it: " + bothDays.ops);
  assert.equal(bothDays.leases, 1, "under ONE lease_id across both write paths");
  /* C4b review D1 — each Start is stamped on the day its own host stood on.
     This is the invariant that, when it broke, left a Start on disk that no
     accepted resolver could order. */
  assert.deepEqual(bothDays.startDays, [DAY_ONE, DAY_TWO].sort(),
    "each Start is stamped on its own day: " + JSON.stringify(bothDays.startDays));
  /* C4b/C4c — THE THIRD NUMBER ONE STORE MOVED, and the most interesting one.
     This used to read "exactly one Start descends from nothing — the first".
     Under TWO generations the workout log began with the first Start, so that
     Start had no parent. C4b put the morning weigh-in in the SAME generation and
     the first Start briefly descended from it.

     C4c PUT THAT BACK, deliberately (A3 review F2). Three lanes now share this
     generation — sets, weigh-ins and recovery check-ins — and the WORKOUT ORDER
     is not "everything on disk": it is the ops of class `session`. A Start's
     causal parents are drawn from that class alone, so a morning reading and a
     check-in are in the generation, ordered by the device sequence, and are not
     causes of a workout. Day 1's Start is therefore an orphan again — the log of
     workouts genuinely begins there — and day 2's descends from day 1's close
     and the Undo's tombstone, which is the ordering claim that matters. */
  assert.equal(bothDays.orphanStarts, 1,
    "exactly one Start descends from nothing — the first, because the workout order begins there: "
    + bothDays.orphanStarts);
  assert.deepEqual(bothDays.startParents.map((kinds) => kinds.slice().sort()),
    [[], ["session-close", "tombstone"]],
    "day 1's Start opens the workout order; day 2's descends from every WORKOUT tip the log "
    + "then held — day 1's close and the Undo's tombstone — and from no reading or check-in: "
    + JSON.stringify(bothDays.startParents));
  assert.deepEqual(bothDays.startParentClasses.flat().filter((klass) => klass !== "session"), [],
    "and every causal parent of a Start belongs to the workout order: "
    + JSON.stringify(bothDays.startParentClasses));
  assert(bothDays.startParents[1].includes("session-close"),
    "and day 2 descends from day 1's close, which is the ordering claim that matters");
  assert.equal(bothDays.morning, 2, "both mornings are readable through the reading host");

  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-slot="workout-count"]');
  assert.match(await text(page, '[data-slot="workout-count"]'), /Workout recorded$/,
    "and day 1 is still recorded on a plain reload");
  const finalText = await page.textContent("#phone");
  for (const figure of FICTIONAL) assert(!finalText.includes(figure), "prototype figure on screen: " + figure);

  // The durable store really is this device's own encrypted IndexedDB.
  const databases = await page.evaluate(() => indexedDB.databases().then((list) => list.map((d) => d.name)));
  /* C4b — ONE STORE. There is no second generation and no page-minted key store:
     the weigh-in and the workout are both in this device's own local era
     (rebuild/m3/w6/local/), with key custody in its `-keys` database and the
     enrolment marker in its `-local` one. */
  assert(databases.includes(LOCAL_DATABASE), "the one store is on this device: " + databases);
  assert(databases.includes(LOCAL_DATABASE + "-keys"), "this device kept its own key: " + databases);
  for (const gone of ["earned-today-preview-workout", "earned-today-preview-readings",
    "earned-today-preview-device-keys"])
    assert(!databases.includes(gone), "the page's old synthetic store must not exist: " + gone);
  // Nothing of record is in localStorage any more (review B2).
  const local = await page.evaluate(() => Object.keys(localStorage));
  assert.deepEqual(local, [], "nothing of record is kept in localStorage: " + JSON.stringify(local));
  await context.close();

  assert.equal(kills, 3, "three REAL process kills were executed");
  assert.deepEqual(problems, [], "no page error, console error or offsite request");
  console.log("A2 GYM BROWSER CHECK PASS — TWO TRAINING DAYS across three REAL process kills. DAY 1: "
    + "Today -> weigh-in -> Start -> active set (prescription shown separately from editable performed values, "
    + "no effort preselected) -> refusal without an effort answer -> logged with an explicit unknown effort -> "
    + "saved facts + Undo + rest + next set -> Undo removed it -> relogged -> REAL PROCESS KILL (taskkill /F /T "
    + "on every " + PROCESS_NAME + " of the persistent profile, kill verified) -> the weigh-in AND the in-progress workout "
    + "both came back out of the encrypted store and the session resumed at the next set -> finished -> Today "
    + "says recorded, through a reload, a new page and a SECOND real kill. DAY 2 (" + DAY_TWO + ", the page's own "
    + "entry point over the same device storage): prepares -> weigh-in -> Start -> every set -> finished; a THIRD "
    + "real kill, and the history still reads with BOTH sessions. ONE STORE (C4b): 16 operations in ONE sealed "
    + "generation under ONE lease — 14 workout and both mornings; each Start stamped on its own day; the "
    + "workout order is KIND-AWARE (C4c), so day 1's Start opens it and day 2's descends from day 1's close "
    + "and the Undo's tombstone, and every causal parent of a Start is a workout operation. "
    + "localStorage holds nothing. Headroom: "
    + notes.join(", ")
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
