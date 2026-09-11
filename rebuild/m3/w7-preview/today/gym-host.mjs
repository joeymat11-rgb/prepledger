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
import { composeWorkoutHost, createUnavailableNativeTrendContext } from '../../w6/host/workout-host.mjs';
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
import HostRuntime from '../../w6/host/engine-runtime-host.cjs';
import T2Stage from '../../w6/t2-stage.cjs';
import Canonical from '../../../authority/canonical.cjs';

const { createNullLaneWorkoutBasis } = WorkoutBasis;
const { createWorkoutResumePolicy } = ResumePolicy;
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

export function initialGeneration(lease) {
  return { collections: { meta: { checkpoint: { counts: { ops: 0, outbox: 0 } } },
    sync: { snapshot: { plan: {}, reads: [] }, frontier: { W: 0, authorityW: 0 } } },
    metadata: { schema: 1, checkpoint: 'synthetic-preview', authorityLease: lease } };
}

/* One live host over one repository handle, with every provider named here and
   only here. composeWorkoutHost binds them; it invents nothing. */
export async function createGymHost({ day, engineState, indexedDB, crypto, deviceKeys,
  databaseName = DATABASE, namespace = NAMESPACE, plannedSplitSlotId } = {}) {
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
    lease = await signRecord({ lease_id: 'synthetic-preview-lease', device_id: DEVICE_ID, athlete_id: ATHLETE_ID,
      schema_version: 2, range: [1, 1000000],
      not_before: '1970-01-01T00:00:00Z', not_after: '9999-12-31T00:00:00Z',
      issued_server_time: '1970-01-01T00:00:00Z' },
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

  const engine = HostRuntime.createEngineRuntime({
    clock: { today: () => day, hour: () => 8, now: () => new Date(day + 'T13:00:00.000Z'), stamp: () => day + 'T13:00:00.000Z' },
    nativeTrendContext: createUnavailableNativeTrendContext() });

  // The causal parents of the NEXT durable write, kept by the caller through
  // setCausalParents(); the basis resolver reads them and nothing else invents one.
  let causalParents = [];
  const resolveWorkoutBasis = createNullLaneWorkoutBasis({ sourceCodec: Source,
    planBasis: PLAN_BASIS, inputBasis: INPUT_BASIS, causalParents: () => causalParents.slice() });

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
    plannedSplitSlotId });

  return Object.freeze({ host, repository, engine, day, plannedSplitSlotId, device,
    setCausalParents(ids) { causalParents = Array.isArray(ids) ? ids.slice() : []; },
    causalParents: () => causalParents.slice(),
    close() { repository.close(); } });
}
