// local-today-browser.mjs — C4b ONE STORE, in a REAL browser, on REAL IndexedDB,
// through a REAL process kill, driving THE ACTUAL BUILT PAGE.
//
// WHAT CHANGED IN C4b. The C4 version of this file built its own W6 bundle and
// called the drop-in from `page.evaluate` — a faithful composition, but a
// stand-in: the page the athlete opens was never launched. The swap is applied
// now, so there is nothing to stand in for. This runs
// `rebuild/m3/w7-preview/today/build.mjs`, serves its three approved assets
// through the page's own `serve.mjs`, and drives the SHIPPED screen: the
// weigh-in sheet, the gym card, the buttons.
//
// What it proves that a Node test cannot:
//   1. a fresh install opens ONE encrypted generation of this device's own local
//      era — no second store, no page-minted key database, nothing in localStorage;
//   2. a weigh-in and a logged set, entered through the real UI, are BOTH in it;
//   3. they both survive `taskkill /F /T` — no graceful flush, which is what an
//      iOS tab termination is — and the session resumes at the next set;
//   4. TWO TRAINING DAYS in ONE page load, with the first installation holder
//      still open — the shape the shipped page is actually in, because it
//      auto-boots at module load and never releases it. Day 2 must recover the
//      abandoned day-1 session, Start, and reach a LOGGED SET, leaving no Start
//      the accepted resolver cannot order (C4b review D1) — with a RECOVERY
//      CHECK-IN between the two sessions and a second on the same day as a
//      Start, in the same generation, causing neither of them (C4c, A3 review F2);
//   5. PARTIAL ERASURE (the device key record removed under the page) is
//      RESTORE-REQUIRED: the page prints rebuild/client's own copy, claims no
//      reading, and never re-enrols over the record it could not read.
//
// Exit 2 = BLOCKED (no browser), never a silent pass.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { buildToday } from "../../w7-preview/today/build.mjs";
import { startServer } from "../../w7-preview/today/serve.mjs";
import { DATABASE, RESTORE_REQUIRED } from "../../w7-preview/today/gym-host.mjs";
import { PROFILE as CHECKIN_PROFILE } from "../../w7-preview/today/checkin-host.mjs";
import TodayModel from "../../w7-preview/today/today-model.cjs";
import { EFFORT_CHOICES } from "../../w7-preview/today/gym-model.mjs";
import { markerDatabaseName } from "../local/local-client.mjs";
import { keysDatabaseName } from "../local/local-keys.mjs";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require(process.env.W6_PLAYWRIGHT_DIR || "playwright-core")); }
catch { console.log("W6 LOCAL-TODAY-BROWSER BLOCKED — pinned playwright-core unavailable"); process.exit(2); }
const executablePath = process.env.W6_BROWSER_BIN;
if (!executablePath || !fs.existsSync(executablePath)) {
  console.log("W6 LOCAL-TODAY-BROWSER BLOCKED — set W6_BROWSER_BIN to an installed Chromium/Edge executable");
  process.exit(2);
}
const processName = path.basename(executablePath);
void fileURLToPath;
// The page's own day, and the next one — for the two-day case (review D1).
const DAY = TodayModel.SYNTHETIC_DAY;
const NEXT_DAY = (() => {
  const [year, month, date] = DAY.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, date + 1)).toISOString().slice(0, 10);
})();

const built = await buildToday();
const server = await startServer({ port: 0 });
const origin = `http://127.0.0.1:${server.address().port}/`;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "c4b-today-profile-"));

/* A REAL PROCESS KILL, not context.close(). A graceful shutdown lets the browser
   flush what it was holding, which is exactly the case that hides the defect this
   check exists to catch. Every browser process whose command line names this
   profile is killed with `taskkill /F /T`, and the kill is verified. */
function processesForProfile() {
  const script = "Get-CimInstance Win32_Process -Filter \"Name='" + processName + "'\" | "
    + "Where-Object { $_.CommandLine -like '*" + profile.replace(/'/g, "''") + "*' } | "
    + "Select-Object -ExpandProperty ProcessId";
  try {
    const out = execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script],
      { encoding: "utf8", timeout: 30000 });
    return out.split(/\r?\n/).map(line => Number(line.trim())).filter(Number.isSafeInteger).filter(pid => pid > 0);
  } catch (_) { return []; }
}
async function hardKill(context) {
  const pids = processesForProfile();
  assert(pids.length > 0, "no browser process was found for this profile — the kill would prove nothing");
  for (const pid of pids) {
    try { execFileSync("taskkill.exe", ["/F", "/T", "/PID", String(pid)], { stdio: "ignore", timeout: 30000 }); }
    catch (_) { /* a child may already be gone with its parent */ }
  }
  for (let tick = 0; tick < 100; tick++) {
    if (processesForProfile().length === 0) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.equal(processesForProfile().length, 0, "the browser survived taskkill /F /T");
  try { await context.close(); } catch (_) { /* already gone — that is the point */ }
  await new Promise(resolve => setTimeout(resolve, 250));
  return pids;
}

let context = null, cases = 0, kills = 0;
const passed = () => { cases++; };
const problems = [];
const text = (page, selector) => page.textContent(selector).then(value => (value || "").trim());

async function open() {
  context = await chromium.launchPersistentContext(profile,
    { executablePath, headless: true, viewport: { width: 390, height: 844 } });
  const page = context.pages()[0] || await context.newPage();
  page.on("pageerror", error => problems.push("pageerror: " + error.message));
  page.on("request", request => {
    if (!request.url().startsWith(origin) && !request.url().startsWith("data:"))
      problems.push("offsite request: " + request.url());
  });
  await page.goto(origin, { waitUntil: "load" });
  await page.waitForSelector('[data-slot="primary-label"]');
  return page;
}
const databases = page => page.evaluate(() => indexedDB.databases().then(list => list.map(d => d.name).sort()));
const storageKeys = page => page.evaluate(() => Object.keys(localStorage));

/* The whole sealed generation, read out of the page's own store in the browser.
   It opens the encrypted database READ-ONLY through the page's own module rather
   than parsing bytes, so what is asserted is what the page itself would read. */
const snapshot = page => page.evaluate(async () => {
  const mod = await import(new URL("app.js", location.href).href);
  const booted = await mod.boot({});
  const generation = (await booted.hosts.generation()).generation;
  const ops = Object.values(generation.collections.ops || {});
  const out = { ops: ops.length, classes: ops.map(op => op.class).sort(),
    schemas: ops.map(op => op.schema_version).sort(),
    leases: [...new Set(ops.map(op => op.lease_id))],
    checkpoint: generation.collections.meta.checkpoint.counts.ops,
    seq: generation.collections.meta.device.seq,
    lease: generation.metadata.authorityLease.lease_id,
    schema: generation.metadata.authorityLease.schema_version,
    restoreRequired: booted.restoreRequired };
  booted.hosts.close();
  return out;
});

try {
  let page = await open();

  /* 1. FIRST RUN IN A REAL BROWSER. The page enrolled itself silently — one
     encrypted generation, one self-issued schema-2 lease — and the two
     databases beside it are the era's own key custody and enrolment marker.
     None of the page's three old synthetic stores exists. */
  assert.equal(await text(page, '[data-slot="morning"]'), "This morning — not logged yet",
    "a fresh profile holds no reading");
  const fresh = await databases(page);
  assert.deepEqual(fresh, [DATABASE, keysDatabaseName(DATABASE), markerDatabaseName(DATABASE)].sort(),
    "the local era's three databases and nothing else: " + JSON.stringify(fresh));
  for (const gone of ["earned-today-preview-workout", "earned-today-preview-readings",
    "earned-today-preview-device-keys"]) assert(!fresh.includes(gone), gone + " must not exist");
  assert.deepEqual(await storageKeys(page), [], "nothing of record is in localStorage");
  const first = await snapshot(page);
  assert.equal(first.ops, 0, "a fresh install holds no operation");
  assert.match(first.lease, /^local-era:[0-9a-f]{32}$/, "the era's own lease, not a synthetic one");
  assert.equal(first.schema, 2);
  assert.equal(first.restoreRequired, null, "a fresh phone opens silently — it is first run, not restore");
  passed();

  /* 2. THE MORNING WEIGH-IN, through the shipped sheet. */
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-slot="primary-label"]');
  await page.click('[data-slot="primary"]');
  await page.waitForSelector("#morning-weight");
  await page.fill("#morning-weight", "179.4");
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('[role="dialog"]', { state: "detached" });
  await page.waitForFunction(() => /✓/.test(document.querySelector('[data-slot="morning"]').textContent));
  assert.equal(await text(page, '[data-slot="morning"]'), "This morning ✓ 179.4 lb");
  const startLabel = await text(page, '[data-slot="primary-label"]');
  assert.match(startLabel, /^Start /, startLabel);
  passed();

  /* 3. START AND ONE SET, through the shipped gym card. Both write paths have
     now run in the same page load, into the same sealed generation. */
  const sessionTitle = startLabel.replace(/^Start /, "");
  await page.click('[data-slot="primary"]');
  await page.waitForSelector('[data-slot="log"]');
  await page.click(".choice:nth-child(3)");
  await page.click('[data-slot="log"]');
  await page.waitForSelector('[data-slot="saved-facts"]');
  assert.equal(await text(page, '[data-slot="saved-title"]'), "Set 1 logged");
  const before = await snapshot(page);
  assert.equal(before.ops, 3, "one reading, one Start, one set — in ONE generation");
  assert.deepEqual(before.classes, ["reading", "session", "session"]);
  assert.deepEqual(before.schemas, [1, 2, 2], "schema 1 and schema 2 under ONE lease");
  assert.equal(before.leases.length, 1, "one lease_id across both write paths");
  assert.equal(before.leases[0], before.lease);
  assert.equal(before.checkpoint, 3, "one checkpoint describes the whole generation");
  assert.equal(before.seq, 3);
  assert.deepEqual(await storageKeys(page), []);
  passed();

  /* 4. taskkill /F /T — the whole browser dies without flushing anything. */
  const killed = await hardKill(context); context = null; kills += 1;

  /* 5. A NEW BROWSER PROCESS over the SAME profile: BOTH are still there, in the
     SAME single generation, and the workout resumes at the next set. */
  page = await open();
  assert.equal(await text(page, '[data-slot="morning"]'), "This morning ✓ 179.4 lb",
    "the morning reading survived a REAL process kill");
  assert.match(await text(page, '[data-slot="workout-count"]'), /Workout in progress$/,
    "and so did the workout");
  assert.equal(await text(page, '[data-slot="primary-label"]'), "Resume " + sessionTitle);
  await page.click('[data-slot="primary"]');
  await page.waitForSelector('[data-slot="log"]');
  assert.equal(await text(page, '[data-slot="entry-title"]'), "What you did · Set 2",
    "the session resumed at the next set, out of this device's own store");
  const after = await snapshot(page);
  assert.equal(after.ops, 3, "the generation survived the kill intact, and reading it wrote nothing");
  assert.equal(after.lease, before.lease, "the same era — not a re-enrolment");
  assert.deepEqual(await storageKeys(page), []);
  passed();

  /* 6. TWO TRAINING DAYS IN ONE PAGE LOAD (C4b review D1), on the BUILT page.
     The shipped page auto-boots at module load and never releases its
     installation, so day 2 is conducted the way A2's own gym-check.mjs conducts
     it — boot({ today }) again in the SAME page load, with that first holder
     still open. Before the fix, day 2's Start was written stamped day 1 and the
     very next read refused it WORKOUT_HISTORY_RECONCILIATION_REQUIRED with
     startOrderRefusal() = WORKOUT_START_ORDER_UNPROVEN: a Start on disk no
     accepted resolver could order. It must now reach a logged set, and leave
     nothing stranded. */
  const twoDays = await page.evaluate(async ({ day, nextDay, effort, checkInProfile }) => {
    const mod = await import(new URL("app.js", location.href).href);
    const out = {};
    /* C4c/F2 — A RECOVERY CHECK-IN BETWEEN THE SESSIONS, written through the
       page's own entry on day 1, into the SAME installation and the SAME sealed
       generation. It is the newest operation on disk when day 2's Start is
       composed, which is exactly the position a kind-blind causal frontier would
       hand to that Start as its parent. */
    const dayOne = await mod.boot({ today: day });
    out.checkInOne = await dayOne.checkin.host.save({ energy: "Low", stress: "High" });
    out.checkInOneRead = (await dayOne.checkin.refresh()).recorded;
    dayOne.hosts.close();

    const fresh = mod.createTodayModel({}).stateFromOps();
    fresh.sessionLog = {};
    const booted = await mod.boot({ today: nextDay, basisState: fresh });
    out.failures = booted.failures;
    out.adoptions = booted.hosts.clockAdoptions();
    out.liveDay = booted.hosts.liveDay();
    // And a second check-in on the SAME DAY as a Start, written before it.
    out.checkInTwo = await booted.checkin.host.save({ sleep_quality: "Good", soreness: "None" });
    out.checkInTwoRead = (await booted.checkin.refresh()).recorded;
    if (booted.workout.summary().unfinished) out.recover = await booted.workout.recover();
    out.summary = booted.workout.summary();
    out.start = await booted.workout.gym.start();
    const view = await booted.workout.gym.read();
    out.read = { phase: view.phase, code: view.code || null, unfinished: view.unfinished || null };
    out.set = view.phase === "active"
      ? await booted.workout.gym.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
          load: String(view.entry.load), reps: String(view.entry.reps), effort })
      : "NOT REACHED";
    out.orderRefusal = await booted.workout.gymHost.startOrderRefusal();
    const generation = (await booted.hosts.generation()).generation;
    const ops = Object.values(generation.collections.ops);
    const starts = ops.filter(op => op.kind === "session-start");
    out.startDays = starts.map(op => op.effective.local_date).sort();
    out.leases = [...new Set(ops.map(op => op.lease_id))].length;
    /* C4c/F2 — the WORKOUT ORDER, read off the disk the page just wrote. */
    const checkIns = ops.filter(op => op.kind === "fact" && op.class === "event"
      && op.payload && op.payload.profile === checkInProfile);
    out.checkInDays = checkIns.map(op => op.effective.local_date).sort();
    const checkInIds = new Set(checkIns.map(op => op.op_id));
    out.startsCausedByCheckIn = starts
      .filter(start => (start.causal_parents || []).some(id => checkInIds.has(id))).length;
    out.startParentClasses = starts.map(start => (start.causal_parents || [])
      .map(id => { const parent = ops.find(op => op.op_id === id); return parent ? parent.class : "?"; }));
    booted.hosts.close();
    return out;
  }, { day: DAY, nextDay: NEXT_DAY, checkInProfile: CHECKIN_PROFILE,
    effort: EFFORT_CHOICES.find(choice => choice.label === "2").reserve });
  assert.deepEqual(twoDays.failures, [], JSON.stringify(twoDays.failures));
  assert.deepEqual(twoDays.adoptions, [{ from: DAY, to: NEXT_DAY, adopted: true }],
    "the later day is ADOPTED by name, never silently dropped: " + JSON.stringify(twoDays.adoptions));
  assert.equal(twoDays.liveDay, NEXT_DAY);
  assert.equal(twoDays.recover && twoDays.recover.ok, true,
    "day 1's abandoned session is retired through the accepted close: " + JSON.stringify(twoDays.recover));
  assert.equal(twoDays.start.ok, true, "day 2 Start: " + JSON.stringify(twoDays.start));
  assert.equal(twoDays.read.phase, "active",
    "day 2 must be usable after its own Start: " + JSON.stringify(twoDays.read));
  assert.equal(twoDays.set.ok, true, "day 2 first set: " + JSON.stringify(twoDays.set));
  assert.equal(twoDays.orderRefusal, null, "nothing on disk is a Start the resolver cannot order");
  assert.deepEqual(twoDays.startDays, [DAY, NEXT_DAY].sort(),
    "each Start is stamped on the day its own host stood on: " + JSON.stringify(twoDays.startDays));
  assert.equal(twoDays.leases, 1, "still ONE lease across both days and all THREE write paths");
  /* C4c/F2 — the check-ins are in the shared generation and are NOT causes of a
     workout. Both were the newest operation on disk at the moment a Start was
     composed, so a kind-blind frontier would have named one as a parent. */
  assert.equal(twoDays.checkInOne.ok, true, "day 1's check-in: " + JSON.stringify(twoDays.checkInOne));
  assert.equal(twoDays.checkInTwo.ok, true, "day 2's check-in: " + JSON.stringify(twoDays.checkInTwo));
  assert.equal(twoDays.checkInOneRead, true, "and Today reads day 1's back off disk");
  assert.equal(twoDays.checkInTwoRead, true, "and day 2's");
  assert.deepEqual(twoDays.checkInDays, [DAY, NEXT_DAY].sort(),
    "one check-in between the sessions and one on the same day as a Start, in the SAME generation: "
    + JSON.stringify(twoDays.checkInDays));
  assert.equal(twoDays.startsCausedByCheckIn, 0,
    "no Start is caused by a check-in — the workout order is kind-aware");
  assert.deepEqual(twoDays.startParentClasses.flat().filter(klass => klass !== "session"), [],
    "every causal parent of a Start belongs to the workout order: "
    + JSON.stringify(twoDays.startParentClasses));
  passed();

  /* 7. PARTIAL ERASURE. The device key record is removed under the page — the
     shape a browser leaves behind when it evicts part of a site's data. The
     installation is no longer whole, so the page must REFUSE by name, print
     rebuild/client's own RESTORE_REQUIRED copy, claim no reading, and leave the
     record on disk for a real restore path to find. It must never re-enrol. */
  await page.evaluate(async (name) => {
    await new Promise((resolve, reject) => {
      const open = indexedDB.open(name);
      open.onsuccess = () => {
        const db = open.result, tx = db.transaction("keys", "readwrite");
        tx.objectStore("keys").delete("active");
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onabort = () => { db.close(); reject(tx.error); };
      };
      open.onerror = () => reject(open.error);
    });
  }, keysDatabaseName(DATABASE));

  await page.reload({ waitUntil: "load" });
  await page.waitForSelector("#today-status");
  await page.waitForFunction(() => document.getElementById("today-status").textContent.trim().length > 0);
  const status = await text(page, "#today-status");
  assert.equal(status, RESTORE_REQUIRED + " (KEY_MISSING)",
    "the page says what rebuild/client says, and names the code: " + status);
  assert.equal(await text(page, '[data-slot="morning"]'), "This morning — not logged yet",
    "nothing on screen claims a reading it cannot read");
  // The record is still on disk, and the era is not replaced.
  const survivors = await databases(page);
  assert(survivors.includes(DATABASE), "the athlete's record is still there: " + JSON.stringify(survivors));
  const stillRefused = await page.evaluate(async () => {
    const mod = await import(new URL("app.js", location.href).href);
    const booted = await mod.boot({});
    return { restoreRequired: booted.restoreRequired, hosts: booted.hosts === null,
      readings: booted.readings === null };
  });
  assert.equal(stillRefused.restoreRequired, "KEY_MISSING", "it still refuses on the next open");
  assert.equal(stillRefused.hosts, true, "no installation was opened");
  assert.equal(stillRefused.readings, true, "and no store");
  assert.deepEqual(await storageKeys(page), [], "and nothing was written to localStorage instead");
  passed();

  assert.equal(cases, 6, "every case must have run");
  assert.deepEqual(problems, [], "no page error and no offsite request: " + JSON.stringify(problems));
  console.log(`W6 LOCAL-TODAY-BROWSER PASS — ${cases}/6 real IndexedDB cases against THE BUILT PAGE `
    + `(${built.assets.length} approved assets, ${built.inputs.length} pinned inputs); `
    + `${context ? context.browser().version() : "chromium"}; killed ${killed.length} ${processName} `
    + `process(es) with taskkill /F /T (${kills} kill); weigh-in + workout entered through the shipped UI `
    + `into ONE sealed generation, one lease, one checkpoint; TWO TRAINING DAYS in one page load with the `
    + `first holder still open (the later day ADOPTED by name, each Start stamped on its own day, `
    + `startOrderRefusal() null); a recovery check-in between the sessions and one on the same day as `
    + `a Start, in the SAME generation, causing neither; `
    + `partial erasure is RESTORE_REQUIRED by name and never a re-enrolment; `
    + `localStorage holds nothing.`);
  console.log("W6 iPhone / iOS Safari acceptance NOT RUN — Chromium-family evidence only (C3)");
} catch (error) {
  console.log("W6 LOCAL-TODAY-BROWSER FAIL — " + (error?.message || error?.name || "Error"));
  for (const problem of problems) console.log("  " + problem);
  process.exitCode = 1;
} finally {
  if (context) { try { await context.close(); } catch (_) { /* already gone */ } }
  await new Promise(resolve => server.close(resolve));
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) { /* a temp dir */ }
}
