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

/* THE ONE ENTRY POINT. Opens (and on first run enrols) the local installation,
   boots it, and returns the world tools.cjs takes: today + gym + check-in, all
   over real durable storage. `consent` stays injectable — the consent write is
   not a staged command on this tip (see TOOL-CONTRACT.md). */
export async function openCoachWorld({ indexedDB, crypto, day = SYNTHETIC_DAY,
  databaseName = COACH_DATABASE, namespace = COACH_NAMESPACE,
  athleteId = COACH_ATHLETE, deviceId = COACH_DEVICE,
  checkInDeviceKeys, withCheckIn = true, consent = null } = {}) {
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

  return Object.freeze({
    client, bindings, today, gym, gymHost, checkin, checkInHost, consent, day, readings,
    era: { eraId: booted.eraId || null, leaseId: booted.leaseId || null, revision: booted.revision },
    checkInOnLocalEra: false,
    close() { try { client.close(); } catch {} if (checkInHost) { try { checkInHost.close(); } catch {} } },
  });
}

export default { openCoachWorld, COACH_DATABASE, COACH_NAMESPACE, COACH_ATHLETE, COACH_DEVICE };
