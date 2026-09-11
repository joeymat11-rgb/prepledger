// gym-host.mjs — the ONE place this page composes the accepted W6 workout host.
//
// It binds, it does not invent. Every collaborator below is the accepted module
// the A0 host journey binds (rebuild/m3/w6/host/test/journey.test.mjs), passed to
// the accepted rebuild/m3/w6/host/workout-host.mjs composeWorkoutHost. There is no
// second engine (the prescription runtime is the host's own accepted mirror
// rebuild/m3/w6/host/engine-runtime-host.cjs) and no second capture path (the
// validator is rebuild/m4/workout/capture.cjs at the v2 source-aware profile).
//
// WHAT IS SYNTHETIC, AND SAID SO. This preview has no enrolment: no authority
// issues it a lease and no server knows it. So the page mints its OWN device
// enrolment on first launch — an AES-GCM key for the encrypted local store and a
// P-256 key pair that signs one offline-write lease for this device. Both are
// generated ON THE DEVICE, are non-extractable, never leave it, and authorize
// nothing anywhere else. They are labelled synthetic everywhere they appear. A
// real enrolment (Dad's first run, A4) replaces this whole module's first half.
//
// WHAT IS REAL. The encrypted IndexedDB repository, the T2 stage over
// rebuild/client, the durable public client, the v2 prescription capture, the
// null-lane registrar and composite reader, the engine capture adapter, the
// engine history projector, the accepted prescription runtime, and every
// operation those write.

import { openRepository } from '../../w6/repository.mjs';
import { createDurablePublicClient } from '../../w6/public-client.mjs';
import { parseStrictJson } from '../../w6/strict-json.mjs';
import { projectWorkoutRecords } from '../../../m4/workout/project-history.mjs';
import { composeWorkoutHost } from '../../w6/host/workout-host.mjs';
// CommonJS collaborators are taken as DEFAULT imports, the way the accepted
// host entry (rebuild/m3/w6/host/host-entry.mjs) takes them: createRequire is a
// Node builtin and the accepted browser build refuses every Node import.
import Source from '../../w5/source/codec.cjs';
import Capture from '../../../m4/workout/capture.cjs';
import Commands from '../../../m4/workout/commands.cjs';
import Adapter from '../../../m4/workout/engine-capture.cjs';
import History from '../../../m4/workout/engine-history.cjs';
import SourceProjection from '../../../m4/workout/source-projection.cjs';
import WorkoutBasis from '../../../m4/workout/workout-basis.cjs';
import ResumePolicy from '../../../m4/workout/resume-policy.cjs';
import NativeTrend from '../../../m4/workout/native-trend-context.cjs';
import HostRuntime from '../../w6/host/engine-runtime-host.cjs';
import T2Stage from '../../w6/t2-stage.cjs';
import Canonical from '../../../authority/canonical.cjs';

const { createNullLaneWorkoutBasis } = WorkoutBasis;
const { createWorkoutResumePolicy } = ResumePolicy;
const { createNativeTrendContextBinding, createDayFactsReader } = NativeTrend;
const { createT2Stage } = T2Stage;

/* Synthetic, public, non-secret preview labels — the same posture and the same
   naming as A1's today-model.cjs. There is no real credential in this file: the
   two private keys are generated on the device and are non-extractable. */
export const DEVICE_ID = 'earned-today-preview-device';
export const ATHLETE_ID = 'earned-today-preview-athlete';
export const NAMESPACE = 'earned-today-preview/device-A';
export const DATABASE = 'earned-today-preview-workout';
export const KEY_DATABASE = 'earned-today-preview-device-keys';
export const IDENTITY_KEY = 'synthetic-preview-identity-not-a-credential';
export const AUTHORITY_KID = 'synthetic-preview-authority';
export const ENROLMENT_EVIDENCE = 'synthetic-preview-enrolment-only';
export const PLAN_BASIS = 'NO_ACCEPTED_PLAN';
export const INPUT_BASIS = 'native-only/zero-import';
export const RESUME_REASON =
  'Recomputed on this device from the same stored plan; the instructions you started with are unchanged.';

export const PRODUCER = Object.freeze({ app_build: 'earned-today-preview',
  engine_build: 'accepted-native-carriers', rule_profile: Adapter.PROFILE,
  source_schema: 'w7-preview-synthetic' });

export const LEASE_DOMAIN = 'earned/lease/v1';
const ORDER = BigInt('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551');

/* The exact ES256 signature encoding rebuild/m3/w5/public-client.cjs decodes:
   "ES256.<kid>.<base64url(r||s)>", 32 bytes each, low-s. WebCrypto ECDSA already
   emits raw r||s; only the low-s normalisation is added here. This is a FORMAT
   binding, not a new crypto rule, and rebuild/m3/w5/crypto.cjs (the Node signer)
   is deliberately NOT imported: the accepted browser build forbids it. */
function base64url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
const toBigInt = bytes => bytes.reduce((n, b) => (n << 8n) | BigInt(b), 0n);
function toBytes(value) {
  const out = new Uint8Array(32);
  let n = value;
  for (let i = 31; i >= 0; i--) { out[i] = Number(n & 255n); n >>= 8n; }
  return out;
}
export async function signRecord(record, { domain, field, privateKey, kid, crypto }) {
  const unsigned = Object.fromEntries(Object.keys(record).filter(k => k !== field).map(k => [k, record[k]]));
  const message = new TextEncoder().encode(domain + Canonical.canonicalEncode(unsigned));
  const raw = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privateKey, message));
  if (raw.length !== 64) throw new Error('GYM_LEASE_SIGNATURE_UNSUPPORTED');
  const r = toBigInt(raw.slice(0, 32));
  let s = toBigInt(raw.slice(32));
  if (s > ORDER / 2n) s = ORDER - s;
  const out = new Uint8Array(64);
  out.set(toBytes(r), 0);
  out.set(toBytes(s), 32);
  return { ...record, [field]: 'ES256.' + kid + '.' + base64url(out) };
}

/* The device key store. Both keys are generated here, are non-extractable, and
   are kept as CryptoKey objects in this device's own IndexedDB — so the page can
   reopen its encrypted store after a reload, a new tab, a browser restart or a
   power cut, and nothing that could be copied off the device is ever produced.
   A browser that will not keep them REFUSES; it never falls back to an
   extractable key or to an unencrypted store. */
function idbRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('GYM_DEVICE_KEYS_UNAVAILABLE'));
  });
}
export async function openDeviceKeys({ indexedDB, crypto, databaseName = KEY_DATABASE } = {}) {
  if (!indexedDB || !crypto?.subtle) throw new Error('GYM_DEVICE_KEYS_UNAVAILABLE');
  const open = indexedDB.open(databaseName, 1);
  open.onupgradeneeded = () => {
    if (!open.result.objectStoreNames.contains('keys')) open.result.createObjectStore('keys');
  };
  const db = await idbRequest(open);
  try {
    const existing = await new Promise((resolve, reject) => {
      const tx = db.transaction('keys', 'readonly');
      const get = tx.objectStore('keys').get('device');
      let value;
      get.onsuccess = () => { value = get.result; };
      tx.oncomplete = () => resolve(value);
      tx.onabort = () => reject(new Error('GYM_DEVICE_KEYS_UNAVAILABLE'));
      tx.onerror = () => {};
    });
    if (existing) return existing;
    const storeKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify']);
    const jwk = await crypto.subtle.exportKey('jwk', pair.publicKey);
    const record = { kid: AUTHORITY_KID, storeKey, signingKey: pair.privateKey,
      publicKey: { kty: 'EC', crv: 'P-256', x: jwk.x, y: jwk.y, key_ops: ['verify'], ext: true } };
    await new Promise((resolve, reject) => {
      const tx = db.transaction('keys', 'readwrite');
      tx.objectStore('keys').put(record, 'device');
      tx.oncomplete = resolve;
      tx.onabort = () => reject(new Error('GYM_DEVICE_KEYS_UNAVAILABLE'));
      tx.onerror = () => {};
    });
    return record;
  } finally { db.close(); }
}

/* The one offline-write lease this device issues itself, for the lane whose
   operations carry `schemaVersion`. The durable public client verifies its
   signature against the device's own public key and refuses any operation whose
   schema differs from it, which is why the schema is a parameter and not a
   constant: the workout lane is 2 and the reading lane is 1. */
export function mintLease(schemaVersion) {
  return { lease_id: 'synthetic-preview-lease', device_id: DEVICE_ID, athlete_id: ATHLETE_ID,
    schema_version: schemaVersion, range: [1, 1000000],
    not_before: '1970-01-01T00:00:00Z', not_after: '9999-12-31T00:00:00Z',
    issued_server_time: '1970-01-01T00:00:00Z' };
}

export function initialGeneration(lease) {
  return { collections: { meta: { checkpoint: { counts: { ops: 0, outbox: 0 } } },
    sync: { snapshot: { plan: {}, reads: [] }, frontier: { W: 0, authorityW: 0 } } },
    metadata: { schema: 1, checkpoint: 'synthetic-preview', authorityLease: lease } };
}

/* ---------------------------------------------------------------------------
   THE CAUSAL FRONTIER, READ OFF THE DURABLE LOG. Pure, so the same functions the
   host runs can be checked against a generation a test writes by hand.
   --------------------------------------------------------------------------- */
const graphOps = generation => Object.values(generation?.collections?.ops || {})
  .filter(op => op && typeof op.op_id === 'string' && Array.isArray(op.causal_parents));

/* The tips of the stored causal graph: every op no other op names as a parent.
   For a store holding one closed session that is exactly the close operation;
   for an empty store it is []. Ordered by the device's own sequence so the
   result is stable, and by op_id when a device_seq is absent. */
export function causalTips(generation) {
  const rows = graphOps(generation);
  const claimed = new Set();
  for (const op of rows) for (const parent of op.causal_parents) claimed.add(parent);
  return rows.filter(op => !claimed.has(op.op_id))
    .sort((a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1))
    .map(op => op.op_id);
}

function reachedFrom(generation, parents) {
  const ops = generation?.collections?.ops || {};
  const seen = new Set(), stack = Array.isArray(parents) ? parents.slice() : [];
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    const op = ops[id];
    if (op && Array.isArray(op.causal_parents)) stack.push(...op.causal_parents);
  }
  return seen;
}

/* THE PRE-WRITE ORDER GUARD (review round 2, point 3). A Start that does not
   descend from every Start already on disk cannot be recovered once it is
   written: rebuild/m4/workout/engine-order.cjs cannot order it, so
   readWorkoutHistory refuses, so the resume and close paths that would retire it
   refuse too. There is no accepted recovery left to offer — so a Start like that
   must be refused BEFORE the write.

   This is deliberately NOT a restatement of causalTips(). It takes the parents
   the accepted resolver ACTUALLY produced for this generation — the exact bytes
   the client is about to store as causal_parents — and checks them against the
   Starts the log already holds. Derivation and check are two independent
   computations, so a resolver that drifts back to a remembered frontier, an
   empty one, or an invented id is caught here rather than on disk. */
export function startOrderRefusalOf(generation, resolvedParents) {
  const starts = graphOps(generation).filter(op => op.kind === 'session-start');
  if (!starts.length) return null;              // nothing on disk to descend from
  const reached = reachedFrom(generation, resolvedParents);
  const orphans = starts.filter(op => !reached.has(op.op_id));
  if (!orphans.length) return null;
  return Object.freeze({ code: 'WORKOUT_START_ORDER_UNPROVEN',
    reason: 'this session would not descend from ' + orphans.length
      + ' session(s) already recorded on this device, and the accepted order resolver cannot order it' });
}

/* One live host over one repository handle, with every provider named here and
   only here. composeWorkoutHost binds them; it invents nothing. */
export async function createGymHost({ day, engineState, indexedDB, crypto, deviceKeys,
  databaseName = DATABASE, namespace = NAMESPACE, plannedSplitSlotId,
  /* B-NTC, the S2 path — OFF by default and off on the shipped page.
     With it false (or with the engine's two day predicates absent from the
     pinned EXPOSED surface, which is the case on this tree) the qualified
     provider uses the empty-history day reader, so an athlete carrying recorded
     nights or events refuses exactly as he does today. With it true AND a
     runtime that exposes dayWeather + cleanAtDate, recorded nights and events
     are mapped through the ENGINE's own predicates. Nothing here decides that;
     it reports which reader it got on the handle below. */
  mapRecordedDaysWithEnginePredicates = false } = {}) {
  const web = crypto || globalThis.crypto;
  const idb = indexedDB || globalThis.indexedDB;
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new TypeError('createGymHost requires day');
  if (!engineState || !Array.isArray(engineState.exercises)) throw new TypeError('createGymHost requires engineState');
  if (typeof plannedSplitSlotId !== 'string' || !plannedSplitSlotId.trim()) throw new TypeError('createGymHost requires plannedSplitSlotId');
  if (!idb || !web?.subtle) throw new Error('GYM_DEVICE_STORE_UNAVAILABLE');

  const device = deviceKeys || await openDeviceKeys({ indexedDB: idb, crypto: web });
  const keys = [{ kid: device.kid, publicKey: device.publicKey }];
  const repository = await openRepository({ indexedDB: idb, crypto: web, databaseName, namespace,
    keyProvider: () => device.storeKey,
    authorizeEnrollment: evidence => evidence === ENROLMENT_EVIDENCE });

  let lease;
  try { await repository.load(); }
  catch (error) {
    if (error?.code !== 'STORE_MISSING') { repository.close(); throw error; }
    lease = await signRecord(mintLease(2),
      { domain: LEASE_DOMAIN, field: 'signature', privateKey: device.signingKey, kid: device.kid, crypto: web });
    await repository.initialize(initialGeneration(lease), ENROLMENT_EVIDENCE);
  }
  if (!lease) lease = (await repository.load()).generation.metadata.authorityLease;

  const prescriptionCapture = Capture.createPrescriptionCapture({ parseStrictJson,
    profile: Capture.SOURCE_PROFILE, sourceCodec: Source });
  const workoutCommands = Commands.createWorkoutCommands({ prescriptionCapture });
  const clock = { today: () => day, now: () => day + 'T13:00:00.000Z', tz: '-05:00', monotonicMs: () => 0 };
  const stage = createT2Stage(() => ({ deviceId: DEVICE_ID, athleteId: ATHLETE_ID, identityKey: IDENTITY_KEY,
    clock, lease, online: false, contract: { client: '1', required: '1' }, standing: 'enrolled' }),
    { allowInbound: true, workoutCommands });

  /* B-NTC — THE QUALIFIED nativeTrendContext PROVIDER, wired here and nowhere
     else. A0's createUnavailableNativeTrendContext always threw, which is why a
     fresh athlete's second day on a trained lift could not be prepared at all
     (DECISIONS:102). This composes the real provider instead: a binding whose
     window says WHICH facts object an engine read is over, and a day reader
     that derives hard/debt from a fact the athlete recorded — or refuses.

     The day reader needs the runtime (for the engine's own two predicates) and
     the runtime needs the resolver, so the reader is late-bound through one
     thunk that REFUSES until composition finishes. Composition is synchronous,
     so no caller can observe the gap. */
  let dayReader = null;
  const trendBinding = createNativeTrendContextBinding({
    dayFacts: iso => {
      if (!dayReader) throw new Error('GYM_NATIVE_TREND_DAY_READER_UNCOMPOSED');
      return dayReader.dayFacts(iso);
    } });
  const runtime = HostRuntime.createEngineRuntime({
    clock: { today: () => day, hour: () => 8, now: () => new Date(day + 'T13:00:00.000Z'), stamp: () => day + 'T13:00:00.000Z' },
    nativeTrendContext: trendBinding.resolve });
  dayReader = createDayFactsReader({ state: engineState, engine: runtime,
    mapRecordedDaysWithEnginePredicates });

  /* THE BIND WINDOW, AROUND EVERY ENGINE READ OVER THE SAME FACTS — not just
     the producer's (review r1, F3). gym-model.readPrevious() re-runs this very
     reader over the reconstructed lastProjection() input AFTER the producer has
     returned; with a window that lived only inside workoutProducer, that read
     threw PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED, gym-model.mjs:136 swallowed
     it, and the card showed no previous performance on exactly the days this
     package unblocks. So the window travels with the engine handle.

     It opens only when the state being read carries facts of its own, and
     `withFacts` RESTORES the previous window rather than clearing it, so the
     producer's own window is not disarmed by a nested read. */
  const scoped = (facts, run) => (facts ? trendBinding.withFacts(facts, run) : run());
  const engine = Object.freeze({
    genSession: (s, iso, slp) => scoped(s && s.workoutFacts, () => runtime.genSession(s, iso, slp)),
    rirPlan: (s, ex, slp) => scoped(s && s.workoutFacts, () => runtime.rirPlan(s, ex, slp)) });

  /* THE CAUSAL FRONTIER, DERIVED FROM THE DURABLE LOG ON EVERY RESOLUTION.
     ----------------------------------------------------------------------
     Review round 2 found this: round 1 kept the causal parents of the next
     write in a per-host closure seeded []. A host lives for one page load, so
     the SECOND training day — a new page, a new host — started from [] and its
     Start did not descend from the first day's close. Two Starts then sit
     concurrent in the accepted order resolver
     (rebuild/m4/workout/engine-order.cjs): `ready.length > 1` with no receipt
     sequence on either (an offline generation has W 0), so it refuses
     WORKOUT_ORDER_CONCURRENT_LOCAL_UNRESOLVED, and because that Start is
     already on disk every later read refuses
     WORKOUT_HISTORY_RECONCILIATION_REQUIRED — permanently.

     The log already carries the lineage, so nothing needs to be remembered
     between page loads and nothing may be invented. The accepted resolver is
     handed the very generation the client is about to write against, so the
     parents are derived FROM THAT GENERATION at the moment of resolution: the
     causal TIPS of the stored graph — every op no other op names as a parent.
     After a closed session that is exactly the close operation; on an empty
     store it is []; there is no third source of truth and no closure to go
     stale across a reload, a relaunch or a kill. */
  let lastResolved = [];
  const nullLaneBasis = createNullLaneWorkoutBasis({ sourceCodec: Source,
    planBasis: PLAN_BASIS, inputBasis: INPUT_BASIS, causalParents: () => lastResolved.slice() });
  function resolveWorkoutBasis(generation, ...rest) {
    lastResolved = causalTips(generation);
    return nullLaneBasis(generation, ...rest);
  }

  const host = composeWorkoutHost({ repository, stage, namespace, athleteId: ATHLETE_ID, deviceId: DEVICE_ID,
    sessionEpoch: 1, isCurrentSession: epoch => epoch === 1, observationEpoch: () => 1,
    observationGuard: { run: async (_kind, run) => run() }, validateCommit: () => null,
    keys, crypto: web,
    createDurablePublicClient,
    createNullSelectionRegistrar: SourceProjection.createNullSelectionRegistrar,
    createSourceProjectionReader: SourceProjection.createSourceProjectionReader,
    createEngineWorkoutCapture: Adapter.createEngineWorkoutCapture,
    createEngineHistoryProjector: History.createEngineHistoryProjector,
    createWorkoutResumePolicy, parseStrictJson, projectWorkoutRecords,
    prescriptionCapture, sourceCodec: Source, engine, engineState, clock: { today: () => day },
    workoutProducerIdentity: PRODUCER, resolveWorkoutBasis, resumeReason: RESUME_REASON,
    plannedSplitSlotId, nativeTrendBinding: trendBinding });

  /* The guard, over the live store, against the parents the accepted resolver
     produced most recently — which, at both call sites (right after the probe's
     prepareWorkout, and again immediately before startPreparedWorkout writes),
     are exactly the causal_parents the Start will carry. */
  async function startOrderRefusal() {
    return startOrderRefusalOf((await repository.load()).generation, lastResolved.slice());
  }

  return Object.freeze({ host, repository, engine, day, plannedSplitSlotId, device,
    /* The trend binding and WHICH day reader it got, so a caller can report the
       truth instead of assuming it. `enginePredicates` is false on this tree
       because EXPOSED is ['genSession','rirPlan']; it becomes true only if a
       re-seal adds dayWeather + cleanAtDate AND the option above is on. */
    trendBinding, trendDayReader: () => Object.freeze({
      enginePredicates: dayReader.enginePredicates,
      enginePredicatesAvailable: dayReader.enginePredicatesAvailable,
      optionRequested: dayReader.optionRequested }),
    // The causal parents the accepted resolver last derived, for tests and for
    // the report. Reading it never changes it; it is not a store.
    causalParents: () => lastResolved.slice(),
    causalTipsNow: async () => causalTips((await repository.load()).generation),
    startOrderRefusal,
    close() { repository.close(); } });
}
