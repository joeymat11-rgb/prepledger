// local-today-browser.mjs — C4 ONE STORE, in a REAL browser, on REAL IndexedDB,
// through a REAL process kill.
//
// A2's own browser evidence (gym-check.mjs) proved the weigh-in survives
// `taskkill /F /T` because it is in an encrypted repository rather than
// localStorage — but it proved it across TWO generations. This proves the same
// thing across ONE: the morning reading and the logged set are both in a single
// sealed generation of the local era, and both are there when a new browser
// process opens the same profile directory.
//
// Everything the page runs is product code out of one pinned bundle: the page's
// own today-model.cjs and gym-model.mjs (imported, never re-implemented) over
// rebuild/m3/w6/local/today-bindings.mjs.
//
// Exit 2 = BLOCKED (no browser), never a silent pass.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { buildTodayBrowser } from "../local/build.mjs";
import { startModuleServer } from "./static-modules.mjs";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let chromium;
try { ({ chromium } = require(process.env.W6_PLAYWRIGHT_DIR || "playwright-core")); }
catch { console.log("W6 LOCAL-TODAY-BROWSER BLOCKED — pinned playwright-core unavailable"); process.exit(2); }
const executablePath = process.env.W6_BROWSER_BIN;
if (!executablePath || !fs.existsSync(executablePath)) {
  console.log("W6 LOCAL-TODAY-BROWSER BLOCKED — set W6_BROWSER_BIN to an installed Chromium/Edge executable");
  process.exit(2);
}
const processName = path.basename(executablePath);

const scratch = path.join(root, ".tmp/local-today-browser");
fs.rmSync(scratch, { recursive: true, force: true });
fs.mkdirSync(scratch, { recursive: true });
const bundle = path.join(scratch, "today.js");
const built = await buildTodayBrowser({ outfile: bundle });
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "c4-today-profile-"));
const { origin, close: closeServer } = await startModuleServer({ root,
  files: { "/today.js": fs.readFileSync(bundle) },
  index: "<!doctype html><meta charset=\"utf-8\"><title>C4 one store</title><main id=\"root\"></main>" });

const OPTIONS = { databaseName: "c4-one-store-browser", namespace: "earned/one-store",
  athleteId: "joe", deviceId: "phone-A" };

/* THE WHOLE PAGE, built inside the browser from the one bundle: the drop-in
   opens the local era, and the PAGE'S OWN adapters bind to it unchanged. */
const BOOTSTRAP = async ({ options }) => {
  const M = await import("/today.js");
  const day = M.TodayModel.SYNTHETIC_DAY;
  const clock = { now: () => day + "T08:00:00.000Z", today: () => day, tz: "-05:00",
    monotonicMs: () => performance.now() };
  const era = await M.openTodayOverLocalEra({ ...options, clock,
    indexedDB: window.indexedDB, crypto: window.crypto });
  const readings = await era.createReadingHost({ day });
  const today = M.TodayModel.createTodayModel({ today: day, readings });
  const gymHost = await era.createGymHost({ day, engineState: today.stateFromOps(),
    plannedSplitSlotId: "earned-today-preview/" + day });
  Object.assign(window, { M, era, readings, today, gymHost, day,
    gym: M.createGymModel({ gymHost, sessionTitle: "T" }) });
  const generation = (await era.generation()).generation;
  return { day, ops: Object.values(generation.collections.ops || {}).length,
    leaseId: generation.metadata.authorityLease.lease_id,
    schema: generation.metadata.authorityLease.schema_version,
    storage: Object.keys(window.localStorage).length };
};
const SNAPSHOT = async () => {
  const generation = (await window.era.generation()).generation;
  const ops = Object.values(generation.collections.ops || {});
  return { ops: ops.length, classes: ops.map(op => op.class), schemas: ops.map(op => op.schema_version),
    leases: [...new Set(ops.map(op => op.lease_id))],
    checkpoint: generation.collections.meta.checkpoint.counts.ops,
    seq: generation.collections.meta.device.seq,
    read: window.today.read().morningRead, storage: Object.keys(window.localStorage).length };
};

/* A REAL PROCESS KILL, not context.close(). A graceful shutdown lets the browser
   flush what it was holding, which is exactly the case that hides the defect this
   check exists to catch; iOS terminating a backgrounded tab does not ask politely.
   Every browser process whose command line names this profile is killed with
   `taskkill /F /T`, and the kill is verified before the next launch. */
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

let context = null, cases = 0;
const passed = () => { cases++; };
async function open() {
  context = await chromium.launchPersistentContext(profile, { executablePath, headless: true });
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const failures = [];
  page.on("pageerror", error => failures.push(String(error)));
  await page.goto(origin);
  const opened = await page.evaluate(BOOTSTRAP, { options: OPTIONS });
  if (failures.length) throw new Error("page error: " + failures[0]);
  return { page, opened };
}

try {
  let { page, opened } = await open();
  const version = context.browser().version();

  // 1. First run in a real browser: ONE generation, ONE self-issued schema-2
  //    lease, and nothing of record in localStorage.
  assert.equal(opened.ops, 0, "a fresh install holds no operation");
  assert.match(opened.leaseId, /^local-era:[0-9a-f]{32}$/, "the era's own lease, not a synthetic one");
  assert.equal(opened.schema, 2);
  assert.equal(opened.storage, 0, "nothing of record is in localStorage"); passed();

  // 2. The morning weigh-in, through the page's own today-model.cjs.
  const weighed = await page.evaluate(() => window.today.weighIn(179.4));
  assert.equal(weighed.ok, true, weighed.copy || weighed.state);
  assert.equal((await page.evaluate(() => window.today.read())).morningRead.lb, 179.4); passed();

  // 3. Start and log ONE set, through the page's own gym-model.mjs.
  const started = await page.evaluate(() => window.gym.start());
  assert.equal(started.ok, true, started.code);
  const logged = await page.evaluate(async () => {
    const view = await window.gym.read();
    return window.gym.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
      load: String(view.entry.load), reps: String(view.entry.reps),
      effort: window.M.EFFORT_CHOICES.find(choice => choice.label === '2').reserve });
  });
  assert.equal(logged.ok, true, logged.code);
  const before = await page.evaluate(SNAPSHOT);
  assert.equal(before.ops, 3, "one reading, one Start, one set");
  assert.deepEqual(before.classes.slice().sort(), ["reading", "session", "session"]);
  assert.deepEqual(before.schemas.slice().sort(), [1, 2, 2], "schema 1 and schema 2 in ONE generation");
  assert.equal(before.leases.length, 1, "one lease_id across both write paths");
  assert.equal(before.checkpoint, 3, "one checkpoint describes the whole generation");
  assert.equal(before.seq, 3);
  assert.equal(before.storage, 0); passed();

  // 4. taskkill /F /T — the whole browser dies without flushing anything.
  const killed = await hardKill(context); context = null;

  // 5. A NEW browser process over the SAME profile: both lanes are still there,
  //    in the SAME single generation, and the workout resumes at the next set.
  ({ page, opened } = await open());
  assert.equal(opened.ops, 3, "the generation survived the kill intact");
  assert.equal(opened.leaseId, before.leases[0], "the same era, not a re-enrolment");
  const after = await page.evaluate(SNAPSHOT);
  assert.deepEqual(after.classes.slice().sort(), before.classes.slice().sort());
  assert.equal(after.read.lb, 179.4, "the morning reading survived a REAL process kill");
  assert.equal(after.checkpoint, 3);
  assert.equal(after.storage, 0); passed();

  const resumed = await page.evaluate(() => window.gym.read());
  assert.equal(resumed.phase, "active", resumed.code || "");
  assert.equal(resumed.done, 1, "the logged set survived the kill");
  assert.equal(resumed.set.position, 2, "and the session resumes at the next set");
  assert.equal((await page.evaluate(SNAPSHOT)).ops, 3, "reading and resuming wrote nothing"); passed();

  assert.equal(cases, 5, "every case must have run");
  console.log(`W6 LOCAL-TODAY-BROWSER PASS — ${cases}/5 real IndexedDB cases; ${version}; `
    + `killed ${killed.length} ${processName} process(es) with taskkill /F /T; `
    + `weigh-in + workout in ONE sealed generation, one lease, one checkpoint; `
    + `${built.inventory.length} pinned bundle inputs`);
  console.log("W6 iPhone / iOS Safari acceptance NOT RUN — Chromium-family evidence only (C3)");
} catch (error) {
  console.log("W6 LOCAL-TODAY-BROWSER FAIL — " + (error?.message || error?.name || "Error"));
  process.exitCode = 1;
} finally {
  if (context) await context.close();
  await closeServer();
}
