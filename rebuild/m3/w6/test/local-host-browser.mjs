// local-host-browser.mjs — the PM's HOST COMPOSITION, in a REAL browser, on
// REAL IndexedDB, over the LOCAL ERA.
//
// The A0 merge recorded "browser journey NOT RUN (retained Chromium harness
// fails to fetch repository.mjs — Track C/host follow-on)" (DECISIONS:98). This
// is that follow-on. The harness fault is fixed in test/static-modules.mjs (the
// server was serving one filename while repository.mjs had grown two relative
// imports); this file is the journey it was blocking.
//
// What only a browser can show: that a workout logged through
// composeWorkoutHost survives the whole browser context going away — process,
// page, every in-memory handle — and is still there when a new context opens on
// the same profile directory. Everything the page composes is product code out
// of one bundle; the only test-supplied values are the athlete setup and the
// producer identity, and they are labelled synthetic.
//
// Exit 2 = BLOCKED (no browser), never a silent pass.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { buildLocalHostBrowser } from "../local/build.mjs";
import { startModuleServer } from "./static-modules.mjs";
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { DAY, SETUP } = require("../host/test/journey-fixture.cjs");

let chromium;
try { ({ chromium } = require(process.env.W6_PLAYWRIGHT_DIR || "playwright-core")); }
catch { console.log("W6 LOCAL-HOST-BROWSER BLOCKED — pinned playwright-core unavailable"); process.exit(2); }
const executablePath = process.env.W6_BROWSER_BIN;
if (!executablePath || !fs.existsSync(executablePath)) {
  console.log("W6 LOCAL-HOST-BROWSER BLOCKED — set W6_BROWSER_BIN to an installed Chromium/Edge executable"); process.exit(2);
}

const scratch = path.join(root, ".tmp/local-host-browser");
fs.rmSync(scratch, { recursive: true, force: true });
fs.mkdirSync(scratch, { recursive: true });
const bundle = path.join(scratch, "host.js");
const built = await buildLocalHostBrowser({ outfile: bundle });
const profile = fs.mkdtempSync(path.join(scratch, "profile-"));
const { origin, close: closeServer } = await startModuleServer({ root,
  files: { "/host.js": fs.readFileSync(bundle) },
  index: "<!doctype html><meta charset=\"utf-8\"><title>W6 local-era workout host</title><main id=\"root\"></main>" });

const SETUP_OPTIONS = { databaseName: "earned-local-host-browser", namespace: "joe/phone-A",
  athleteId: "ath-1", deviceId: "dev-phone-A" };
const PRODUCER = { app_build: "synthetic-test-identity", engine_build: "native-candidate-L",
  source_schema: "synthetic-clean-init" };

// Everything below runs INSIDE the page. Functions cannot cross the evaluate
// boundary, so the clocks, the capture runtime and the whole host composition
// are built there, from the one bundle, exactly as a real host page would.
const BOOTSTRAP = async ({ options, setup, day, producer }) => {
  const M = await import("/host.js");
  const iso = day + "T08:00:00.000Z";
  const clock = { now: () => iso, today: () => day, tz: "+00:00", monotonicMs: () => performance.now() };
  const engineClock = { today: () => day, nowISO: () => day + "T12:00:00.000Z",
    nowMs: () => Date.parse(day + "T12:00:00.000Z"), hour: () => 12,
    dow: () => new Date(day + "T00:00:00Z").getUTCDay() };
  const capture = M.PrescriptionCapture.createPrescriptionCapture({ parseStrictJson: M.parseStrictJson,
    profile: M.PrescriptionCapture.SOURCE_PROFILE, sourceCodec: M.SourceCodec });
  const client = await M.openLocalDurableClient({ ...options, clock,
    workoutCommands: M.WorkoutCommands.createWorkoutCommands({ prescriptionCapture: capture }) });
  window.M = M; window.client = client; window.parents = [];
  window.compose = async () => {
    const bindings = await M.localHostBindings(client);
    const engineState = M.AthleteState.createCleanInitState({ setup });
    window.host = M.composeWorkoutHost({
      ...bindings,
      createDurablePublicClient: M.createDurablePublicClient,
      createNullSelectionRegistrar: M.SourceProjection.createNullSelectionRegistrar,
      createSourceProjectionReader: M.SourceProjection.createSourceProjectionReader,
      createEngineWorkoutCapture: M.EngineCapture.createEngineWorkoutCapture,
      createEngineHistoryProjector: M.EngineHistory.createEngineHistoryProjector,
      createWorkoutResumePolicy: M.ResumePolicy.createWorkoutResumePolicy,
      parseStrictJson: M.parseStrictJson, projectWorkoutRecords: M.projectWorkoutRecords,
      prescriptionCapture: capture, sourceCodec: M.SourceCodec,
      engine: M.EngineRuntime.createEngineRuntime({ clock: engineClock,
        nativeTrendContext: M.createUnavailableNativeTrendContext() }),
      engineState, clock: engineClock,
      workoutProducerIdentity: { ...producer, rule_profile: M.EngineCapture.PROFILE },
      resolveWorkoutBasis: M.WorkoutBasis.createNullLaneWorkoutBasis({ sourceCodec: M.SourceCodec,
        planBasis: "NO_ACCEPTED_PLAN", inputBasis: "native-only/zero-import", causalParents: () => window.parents }),
      resumeReason: "Current assessment recomputed by this host from the same clean-init state; not a personal prescription.",
      plannedSplitSlotId: "synthetic-slot",
    });
    return { members: Object.keys(bindings), kid: bindings.keys[0].kid,
      installed: bindings[M.LOCAL_HOST_INSTALL].installed, leaseId: bindings[M.LOCAL_HOST_INSTALL].leaseId };
  };
};

let context = null, cases = 0;
const passed = () => { cases++; };
async function open() {
  context = await chromium.launchPersistentContext(profile, { executablePath, headless: true });
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const failures = [];
  page.on("pageerror", error => failures.push(String(error)));
  await page.goto(origin);
  await page.evaluate(BOOTSTRAP, { options: SETUP_OPTIONS, setup: SETUP, day: DAY, producer: PRODUCER });
  if (failures.length) throw new Error("page error: " + failures[0]);
  return page;
}

try {
  let page = await open();
  const version = context.browser().version();

  // 1. First run in a real browser: enroll, boot, and the bindings install the
  //    era's own P-256 lease into the sealed generation.
  assert.deepEqual(await page.evaluate(() => client.status()), { state: "first-run", code: "LOCAL_FIRST_RUN" });
  const enrolled = await page.evaluate(() => client.enroll({ profile: "host-clean-init" }));
  assert.equal(enrolled.enrolled, true);
  assert.equal((await page.evaluate(() => client.boot())).ready, true);
  const composed = await page.evaluate(() => compose());
  assert.deepEqual(composed.members, ["repository", "stage", "namespace", "athleteId", "deviceId", "sessionEpoch",
    "isCurrentSession", "observationEpoch", "observationGuard", "validateCommit", "keys", "crypto"]);
  assert.equal(composed.installed, true);
  assert.equal(composed.leaseId, `local-era:${enrolled.eraId}`);
  assert.equal(composed.kid, `local-era-${enrolled.eraId}`); passed();

  // 2. The real host prepares today's workout off the athlete's own split.
  const prepared = await page.evaluate(() => host.client.prepareWorkout({ planned_split_slot_id: "synthetic-slot" }));
  assert.equal(prepared.prepared, true, prepared.code);
  assert.deepEqual([...new Set(prepared.view.slots.map(s => s.lift_lineage_id))], ["db-bench", "lat-pulldown"]);
  assert.equal(prepared.view.slots.length, 5); passed();

  // 3. Start, then log ONE set — a real durable commit through the public
  //    client, sealed by the real repository, into real IndexedDB.
  const start = await page.evaluate(id => host.client.startPreparedWorkout({ preparedId: id }), prepared.preparedId);
  assert.equal(start.acknowledged, true, start.code);
  const slot = prepared.view.slots[0];
  const logged = await page.evaluate(async ({ startId, slot }) => {
    window.parents = [startId];
    return host.client.execute("workout", { action: "set", input: { session_start_op_id: startId,
      logical_set_slot: slot.logical_set_slot, lift_lineage_id: slot.lift_lineage_id,
      load: { value: 35, unit: "lb" }, reps: { value: 9, unit: "rep" } } });
  }, { startId: start.op_id, slot });
  assert.equal(logged.acknowledged, true, logged.code);
  const afterWrite = await page.evaluate(() => client.boot());
  assert.equal(afterWrite.ops, 2, "one Start and one set are on disk");
  assert.equal(afterWrite.leaseId, `local-era:${enrolled.eraId}`); passed();

  // 4. THE WHOLE BROWSER CONTEXT GOES AWAY. New process, new page, same profile
  //    directory — and the workout is still there, byte for byte.
  await context.close(); context = null;
  page = await open();
  assert.deepEqual(await page.evaluate(() => client.status()), { state: "ready", code: "LOCAL_PRESENT" });
  const rebooted = await page.evaluate(() => client.boot());
  assert.equal(rebooted.ready, true);
  assert.equal(rebooted.ops, 2);
  assert.equal(rebooted.eraId, enrolled.eraId);
  const recomposed = await page.evaluate(() => compose());
  assert.equal(recomposed.installed, false, "a reopen re-installs nothing");
  assert.equal(recomposed.kid, composed.kid); passed();

  const history = await page.evaluate(() => host.client.readWorkoutHistory());
  assert.equal(history.read, true, history.code);
  assert.equal(history.history.sessions.length, 1);
  assert.equal(history.history.sessions[0].start.operation.op_id, start.op_id);
  assert.equal(JSON.stringify(history.history.sessions[0].start.operation.prescription_capture),
    JSON.stringify(prepared.view), "the prescription reopens byte-identically");
  const facts = history.history.sessions[0].projection.facts;
  assert.equal(facts.length, 1);
  assert.equal(facts[0].current.reps.value, 9, "the logged set survived the context dying"); passed();

  // 5. The set can be continued from, in the new context, with no second Start.
  const resumed = await page.evaluate(id => host.client.prepareWorkoutContinuation({ session_start_op_id: id }), start.op_id);
  assert.equal(resumed.prepared, true, resumed.code);
  assert.equal(resumed.view.slots.filter(s => s.completion).length, 1);
  assert.equal((await page.evaluate(() => client.boot())).ops, 2, "reading and resuming wrote nothing"); passed();

  console.log(`W6 LOCAL-HOST-BROWSER PASS — ${cases}/6 real IndexedDB cases; ${version}; ` +
    `composeWorkoutHost over the local era: enroll, self-issued P-256 lease, prepared workout, durable set, ` +
    `whole-context reopen, history and resume; ${built.inventory.length} pinned bundle inputs`);
  console.log("W6 iPhone / iOS Safari acceptance NOT RUN — Chromium-family evidence only (C3)");
} catch (error) {
  console.log("W6 LOCAL-HOST-BROWSER FAIL — " + (error?.message || error?.name || "Error"));
  process.exitCode = 1;
} finally {
  if (context) await context.close();
  await closeServer();
}
