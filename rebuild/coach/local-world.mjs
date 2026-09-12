// local-world.mjs — the coach's world, opened over the LOCAL ERA.
//
// C5 was first written against the tip that had no `rebuild/m3/w6/local`. That
// half of lane C has since landed, so the store of record is now C1's one local
// installation: openLocalDurableClient (sealed IndexedDB generations, the real
// rebuild/client on a memory backend, the bridge that publishes only after the
// IDB transaction completes) and the era it enrols.
//
// ONE CLIENT, ONE GENERATION. The morning reading and the workout are written
// through the SAME local client — `execute('weighIn', …)` and, through
// `hostBindings()`, the accepted composeWorkoutHost. That is the whole point of
// C4: a weigh-in and a set share one generation, one lease and one durable
// commit path, so nothing can be saved in one place and lost in another.
//
// WHAT IS STILL SYNTHETIC, AND SAID SO. The athlete basis is
// rebuild/m3/w7-preview/fixtures.cjs, the invented athlete. The recovery
// check-in rides its own A3 lane (checkin-host.mjs), which still mints its own
// synthetic era rather than reading this one — that is a lane-c-today merge
// away, and it is disclosed rather than hidden.
//
// This module composes; it computes nothing. Every refusal it can hit belongs to
// the accepted layer and is returned with that layer's own code.

import { createRequire } from 'node:module';
import { openLocalDurableClient } from '../m3/w6/local/local-client.mjs';
import { createDurablePublicClient } from '../m3/w6/public-client.mjs';
import { parseStrictJson } from '../m3/w6/strict-json.mjs';
import { composeWorkoutHost, createUnavailableNativeTrendContext } from '../m3/w6/host/workout-host.mjs';
import { projectWorkoutRecords } from '../m4/workout/project-history.mjs';
import { causalTips, startOrderRefusalOf } from '../m3/w7-preview/today/gym-host.mjs';
import { createGymModel } from '../m3/w7-preview/today/gym-model.mjs';
import { createCheckInHost } from '../m3/w7-preview/today/checkin-host.mjs';
import CheckInModel from '../m3/w7-preview/today/checkin-model.mjs';
/* C6 Part A. The first-run lane, opened the same way the other three are: this
   module composes and does not invent, so the producer command and the profile
   are setup-host.mjs's own and nothing here shapes an op. */
import { createSetupHost } from '../m3/w7-preview/today/setup-host.mjs';
/* Coach wave one. The era's own lease schema, which is what the accepted client
   stamps every producer-injected command with. */
import { LOCAL_ERA_SCHEMA_VERSION } from '../m3/w6/local/local-era.mjs';

const require = createRequire(import.meta.url);
const Capture = require('../m4/workout/capture.cjs');
const Commands = require('../m4/workout/commands.cjs');
const Adapter = require('../m4/workout/engine-capture.cjs');
const History = require('../m4/workout/engine-history.cjs');
const Source = require('../m3/w5/source/codec.cjs');
const SourceProjection = require('../m4/workout/source-projection.cjs');
const { createWorkoutResumePolicy } = require('../m4/workout/resume-policy.cjs');
const { createEngineRuntime } = require('../m4/workout/engine-runtime.cjs');
const { createNullLaneWorkoutBasis } = require('../m4/workout/workout-basis.cjs');
const TodayModel = require('../m3/w7-preview/today/today-model.cjs');
const MachineSettings = require('./machine-settings-commands.cjs');

const { createCheckInModel } = CheckInModel;
const { createTodayModel, SYNTHETIC_DAY } = TodayModel;

export const COACH_DATABASE = 'earned-coach-local';
export const COACH_NAMESPACE = 'earned-coach/device-A';
export const COACH_ATHLETE = 'earned-coach-athlete';
export const COACH_DEVICE = 'earned-coach-device';
export const PLAN_BASIS = 'NO_ACCEPTED_PLAN';
export const INPUT_BASIS = 'native-only/zero-import';
export const RESUME_REASON =
  'Current assessment recomputed by this host from the same state; not a personal prescription.';
export const PRODUCER = Object.freeze({ app_build: 'earned-coach-local',
  engine_build: 'native-candidate-L', rule_profile: Adapter.PROFILE, source_schema: 'synthetic-basis' });

/* The reading lane, as today-model.cjs wants it, over the LOCAL client. It is a
   shape adapter and nothing more: every value is the client's own published face
   and every refusal is the client's own answer, unedited. */
function readingLane(client) {
  const view = () => { const current = client.current(); return current && current.view ? current.view : null; };
  return Object.freeze({
    face: view,
    reads() {
      const v = view();
      const rows = v && v.layer1 && Array.isArray(v.layer1.reads) ? v.layer1.reads : [];
      return rows
        .filter(r => r && typeof r.date === 'string' && typeof r.lb === 'number' && Number.isFinite(r.lb))
        .slice()
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    },
    paint() { const v = view(); return v ? v.paint : null; },
    label() { const v = view(); return (v && v.layer1 && v.layer1.label) || ''; },
    blockedCopy() {
      const v = view();
      if (!v) return null;
      return (v.layer2 && v.layer2.copy) || (v.layer1 && v.layer1.label) || null;
    },
    outboxRetained() {
      const v = view();
      return v && v.layer1 && Number.isSafeInteger(v.layer1.outbox) ? v.layer1.outbox : null;
    },
    async weighIn({ date, lb }) {
      const result = await client.execute('weighIn', { date, lb });
      return { ok: result.acknowledged === true, state: result.state, copy: result.copy,
        code: result.code || null, op_id: result.op_id || null };
    },
    async restart() { return client.boot(); },
  });
}

/* composeWorkoutHost over the local-era bindings and nothing else — the same
   twelve collaborators the C4 journey names, plus the same product constructors
   gym-host.mjs names. The causal parents are DERIVED from the generation at the
   moment of resolution (gym-host.mjs's own rule: a per-host closure seeded []
   strands the store on day two), through the accepted causalTips(). */
function gymOver(bindings, { day, engineState, prescriptionCapture, plannedSplitSlotId }) {
  let lastResolved = [];
  const nullLaneBasis = createNullLaneWorkoutBasis({ sourceCodec: Source,
    planBasis: PLAN_BASIS, inputBasis: INPUT_BASIS, causalParents: () => lastResolved.slice() });
  const resolveWorkoutBasis = (generation, ...rest) => {
    lastResolved = causalTips(generation);
    return nullLaneBasis(generation, ...rest);
  };
  const engine = createEngineRuntime({
    clock: { today: () => day, hour: () => 8, now: () => new Date(day + 'T13:00:00.000Z'), stamp: () => day + 'T13:00:00.000Z' },
    nativeTrendContext: createUnavailableNativeTrendContext() });
  const host = composeWorkoutHost({
    ...bindings,
    createDurablePublicClient,
    createNullSelectionRegistrar: SourceProjection.createNullSelectionRegistrar,
    createSourceProjectionReader: SourceProjection.createSourceProjectionReader,
    createEngineWorkoutCapture: Adapter.createEngineWorkoutCapture,
    createEngineHistoryProjector: History.createEngineHistoryProjector,
    createWorkoutResumePolicy, parseStrictJson, projectWorkoutRecords,
    prescriptionCapture, sourceCodec: Source, engine, engineState,
    clock: { today: () => day }, workoutProducerIdentity: PRODUCER,
    resolveWorkoutBasis, resumeReason: RESUME_REASON, plannedSplitSlotId });
  return { host, engine, day, plannedSplitSlotId,
    causalParents: () => lastResolved.slice(),
    async startOrderRefusal() {
      return startOrderRefusalOf((await bindings.repository.load()).generation, lastResolved.slice());
    } };
}

/* COACH WAVE ONE: the machine-settings lane, opened the way the check-in lane is
   opened, and for the same reason. `workout` is the only producer-injected
   command the accepted stage takes (checkin-commands.cjs:11-19), and
   `client.hostBindings({ workoutCommands })` is where a lane hands its own
   producer in. So this factory supplies machine-settings-commands.cjs and the
   profile its facts carry, and NOTHING under rebuild/m3/w7-preview or
   rebuild/client is touched to make it work.

   It is THIS installation's: the same repository, the same lease, the same one
   generation the weigh-in and the workout are in, and a fresh hostBindings()
   like the gym card's so the lanes serialise on the repository's own
   compare-and-swap rather than sharing staging state. */
export async function createMachineSettingsHost({ client, day }) {
  if (!client || typeof client.hostBindings !== 'function') {
    throw new TypeError('createMachineSettingsHost requires the local durable client');
  }
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    throw new TypeError('createMachineSettingsHost requires day');
  }
  const bindings = await client.hostBindings({
    workoutCommands: MachineSettings.createMachineSettingsCommands() });
  const laneClient = createDurablePublicClient({ ...bindings, schemaVersion: LOCAL_ERA_SCHEMA_VERSION });
  const opened = await laneClient.reopen();
  let alive = true;

  const handle = Object.freeze({
    repository: bindings.repository, client: laneClient, day,
    profile: MachineSettings.PROFILE,
    openedRefusal: opened && opened.refusal ? { ...opened.refusal } : null,
    /* Every stored machine fact in this generation, oldest first. */
    async all() { return MachineSettings.machineSettingsIn((await bindings.repository.load()).generation); },
    /* The LATEST for one exercise id, and nothing else. */
    async latest(exercise_id) { return MachineSettings.latestFor(await handle.all(), exercise_id); },
    /* ONE op per change. A correction is a new op; there is no update here
       because there is none in an append-only log. */
    async save(machine) {
      if (!alive) return { ok: false, state: 3, copy: null, code: 'LOCAL_CLIENT_CLOSED', op_id: null };
      const result = await laneClient.execute('workout',
        { action: MachineSettings.ACTION, input: { machine } });
      return { ok: result.acknowledged === true, state: result.state, copy: result.copy,
        code: result.code || null, op_id: result.op_id || null };
    },
    async restart() { return laneClient.reopen(); },
    face() { const current = laneClient.current(); return current && current.view ? current.view : null; },
    // Detaches THIS handle only, exactly as the other lanes' close() does.
    close() { alive = false; },
  });
  return handle;
}

/* THE ONE ENTRY POINT. Opens (and on first run enrols) the local installation,
   boots it, and returns the world tools.cjs takes: today + gym + check-in, all
   over real durable storage. `consent` stays injectable — the consent write is
   not a staged command on this tip (see TOOL-CONTRACT.md). */
export async function openCoachWorld({ indexedDB, crypto, day = SYNTHETIC_DAY,
  databaseName = COACH_DATABASE, namespace = COACH_NAMESPACE,
  athleteId = COACH_ATHLETE, deviceId = COACH_DEVICE,
  checkInDeviceKeys, withCheckIn = true, consent = null,
  /* C6 Part A: the first-run lane. Off by default, because the coach's daily
     world is a world that is ALREADY set up, and opening a setup host there
     would say otherwise. */
  withSetup = false, setupDeviceKeys, setupDatabaseName, setupNamespace,
  /* Coach wave one: the machine-settings lane, on by default because step 3 of
     the demo is a read the coach makes every time it is asked. */
  withMachineSettings = true } = {}) {
  const web = crypto || globalThis.crypto;
  const idb = indexedDB || globalThis.indexedDB;
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new TypeError('openCoachWorld requires day');
  if (!idb || !web?.subtle) throw new Error('COACH_DEVICE_STORE_UNAVAILABLE');

  const clock = { now: () => day + 'T13:00:00.000Z', today: () => day, tz: '-05:00', monotonicMs: () => 0 };
  const prescriptionCapture = Capture.createPrescriptionCapture({ parseStrictJson,
    profile: Capture.SOURCE_PROFILE, sourceCodec: Source });
  const client = await openLocalDurableClient({ indexedDB: idb, crypto: web, databaseName, namespace,
    athleteId, deviceId, clock, workoutCommands: Commands.createWorkoutCommands({ prescriptionCapture }) });

  if (client.status().state === 'first-run') {
    const enrolled = await client.enroll({ profile: 'earned-coach-local' });
    if (enrolled.enrolled !== true) { client.close(); throw new Error(enrolled.code || 'COACH_LOCAL_ENROLMENT_FAILED'); }
  }
  const booted = await client.boot();
  if (booted.ready !== true) { client.close(); throw new Error(booted.code || 'COACH_LOCAL_BOOT_FAILED'); }

  const readings = readingLane(client);
  const today = createTodayModel({ today: day, readings });
  const bindings = await client.hostBindings();
  const gymHost = gymOver(bindings, { day, engineState: today.stateFromOps(), prescriptionCapture,
    plannedSplitSlotId: 'earned-coach-local/' + day });
  const gym = createGymModel({ gymHost, sessionTitle: today.read().workout.title });

  /* The recovery check-in. It is REAL and durable — the accepted A3 lane, its own
     database, namespace and producer (checkin-commands.cjs), one operation per
     check-in. It is NOT yet on this era: checkin-host.mjs mints its own lease,
     which is a lane-c-today merge away. Disclosed, not hidden. */
  let checkInHost = null, checkin = null;
  if (withCheckIn) {
    checkInHost = await createCheckInHost({ day, indexedDB: idb, crypto: web, deviceKeys: checkInDeviceKeys });
    checkin = createCheckInModel({ host: checkInHost, day, engineState: today.stateFromOps() });
    await checkin.refresh();
  }

  /* THE FIRST-RUN LANE (C6 Part A). Like the check-in, it is the accepted lane's
     own host: setup-host.mjs mints nothing here, supplies setup-commands.mjs as
     the producer and the profile its fact carries, and answers "has this device
     been set up?" from the DURABLE record rather than a flag. It is NOT yet on
     this era either, for the same reason the check-in is not: setup-host.mjs
     opens its own installation through gym-host.mjs openTodayHosts. Disclosed,
     not hidden, and it is the same lane-c-today merge away. */
  let setupHost = null;
  if (withSetup) {
    setupHost = await createSetupHost({ day, indexedDB: idb, crypto: web,
      deviceKeys: setupDeviceKeys,
      ...(setupDatabaseName ? { databaseName: setupDatabaseName } : {}),
      ...(setupNamespace ? { namespace: setupNamespace } : {}) });
  }

  /* Wave one's machine-settings lane, which IS on this era: it is opened from
     THIS client's own hostBindings, so a stored setting shares the generation,
     the lease and the commit path with the weigh-in and the workout. */
  const machineSettings = withMachineSettings
    ? await createMachineSettingsHost({ client, day })
    : null;

  return Object.freeze({
    client, bindings, today, gym, gymHost, checkin, checkInHost, setupHost, machineSettings,
    consent, day, readings,
    era: { eraId: booted.eraId || null, leaseId: booted.leaseId || null, revision: booted.revision },
    checkInOnLocalEra: false,
    setupOnLocalEra: false,
    machineSettingsOnLocalEra: !!machineSettings,
    close() {
      try { client.close(); } catch {}
      if (checkInHost) { try { checkInHost.close(); } catch {} }
      if (setupHost) { try { setupHost.close(); } catch {} }
      if (machineSettings) { try { machineSettings.close(); } catch {} }
    },
  });
}

export default { openCoachWorld, COACH_DATABASE, COACH_NAMESPACE, COACH_ATHLETE, COACH_DEVICE };
