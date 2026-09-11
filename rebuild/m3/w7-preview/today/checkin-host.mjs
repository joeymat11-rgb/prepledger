// checkin-host.mjs — the recovery check-in's durable store of record.
//
// The THIRD lane on this device, composed exactly as reading-host.mjs composes the
// second: the accepted encrypted IndexedDB repository, the accepted T2 stage over
// rebuild/client, the accepted durable public client. Nothing here is a second
// client, a second store format or a second durability rule; the ONE thing this
// lane supplies that the other two do not is its command producer
// (./checkin-commands.cjs), which the accepted stage takes as an argument.
//
// WHY IT IS ITS OWN LANE, EXECUTED NOT ASSUMED. One generation carries ONE authority
// lease with ONE schema_version, and the durable client refuses any operation whose
// schema differs from the lease it verified. The check-in's operations are written
// through the client's producer-injected command, which the client stamps
// schema_version 2 — so this lane's lease is schema 2 and it cannot live in the
// reading lane (schema 1). It is not the WORKOUT lane either: its own database, its
// own namespace, its own generation and its own producer, so a check-in can never
// enter the workout log and a workout can never enter this one. When a future engine
// package gives rebuild/client a real non-workout fact command (seam S1, see
// checkin-commands.cjs), this module keeps its shape and loses that indirection.
//
// Everything real here is the accepted code; everything synthetic is the SAME
// labelled device enrolment gym-host.mjs mints (see its header) — one device key
// store, one signing key, three lanes.

import { openRepository } from '../../w6/repository.mjs';
import { createDurablePublicClient } from '../../w6/public-client.mjs';
import T2Stage from '../../w6/t2-stage.cjs';
import CheckInCommands from './checkin-commands.cjs';
import { openDeviceKeys, signRecord, initialGeneration, mintLease,
  DEVICE_ID, ATHLETE_ID, IDENTITY_KEY, ENROLMENT_EVIDENCE, LEASE_DOMAIN } from './gym-host.mjs';

const { createT2Stage } = T2Stage;
const { createCheckInCommands, PROFILE } = CheckInCommands;

export const CHECKIN_DATABASE = 'earned-today-preview-checkins';
export const CHECKIN_NAMESPACE = 'earned-today-preview/device-A/checkins';
/* The schema the accepted client stamps on a producer-injected command, and so the
   schema this lane's lease must carry. Not a claim about the content. */
export const CHECKIN_SCHEMA_VERSION = 2;
export { PROFILE };

export async function createCheckInHost({ day, indexedDB, crypto, deviceKeys,
  databaseName = CHECKIN_DATABASE, namespace = CHECKIN_NAMESPACE } = {}) {
  const web = crypto || globalThis.crypto;
  const idb = indexedDB || globalThis.indexedDB;
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new TypeError('createCheckInHost requires day');
  if (!idb || !web?.subtle) throw new Error('CHECKIN_DEVICE_STORE_UNAVAILABLE');

  const device = deviceKeys || await openDeviceKeys({ indexedDB: idb, crypto: web });
  const keys = [{ kid: device.kid, publicKey: device.publicKey }];
  const repository = await openRepository({ indexedDB: idb, crypto: web, databaseName, namespace,
    keyProvider: () => device.storeKey,
    authorizeEnrollment: evidence => evidence === ENROLMENT_EVIDENCE });

  let lease;
  try { await repository.load(); }
  catch (error) {
    if (error?.code !== 'STORE_MISSING') { repository.close(); throw error; }
    lease = await signRecord(mintLease(CHECKIN_SCHEMA_VERSION),
      { domain: LEASE_DOMAIN, field: 'signature', privateKey: device.signingKey, kid: device.kid, crypto: web });
    await repository.initialize(initialGeneration(lease), ENROLMENT_EVIDENCE);
  }
  if (!lease) lease = (await repository.load()).generation.metadata.authorityLease;

  /* The clock this lane dates by. It is the page's own preview clock — the same
     fixed synthetic instant today-model.cjs runs on — so a check-in recorded today
     is still dated today after a reload, a relaunch or a kill, and the provenance
     line on screen is that clock's, never the renderer's. */
  const clock = { today: () => day, now: () => day + 'T13:00:00.000Z', tz: '-05:00', monotonicMs: () => 0 };
  const stage = createT2Stage(() => ({ deviceId: DEVICE_ID, athleteId: ATHLETE_ID, identityKey: IDENTITY_KEY,
    clock, lease, online: false, contract: { client: '1', required: '1' }, standing: 'enrolled' }),
    { allowInbound: true, workoutCommands: createCheckInCommands() });

  const client = createDurablePublicClient({ repository, stage, namespace, athleteId: ATHLETE_ID, deviceId: DEVICE_ID,
    sessionEpoch: 1, isCurrentSession: epoch => epoch === 1, observationEpoch: () => 1,
    observationGuard: { run: async (_kind, run) => run() }, validateCommit: () => null,
    keys, crypto: web, schemaVersion: CHECKIN_SCHEMA_VERSION });

  const opened = await client.reopen();

  /* THE READ-BACK. The client publishes its own face for the facts it projects, and a
     check-in is not one of them (seam S1: the client has no check-in projector any
     more than it has a check-in command). So the read is taken from the DURABLE
     GENERATION the repository just authenticated — the same place gym-host.mjs reads
     its causal frontier from — and it is a filter, never an interpretation: the
     operations this producer wrote, minus anything the log itself marks rejected or
     tombstoned. */
  function checkInsIn(generation) {
    const collections = generation?.collections || {};
    const rejected = collections.rejected || {};
    const dead = new Set(Object.values(collections.ops || {})
      .filter(op => op && op.kind === 'tombstone' && typeof op.target_op_id === 'string')
      .map(op => op.target_op_id));
    return Object.values(collections.ops || {})
      .filter(op => op && op.kind === 'fact' && op.class === 'event'
        && op.payload && op.payload.profile === PROFILE
        && op.effective && typeof op.effective.local_date === 'string'
        && !rejected[op.op_id] && !dead.has(op.op_id))
      .sort((a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1))
      .map(op => Object.freeze({
        op_id: op.op_id,
        date: op.effective.local_date,
        time: op.effective.local_time || null,
        offset: op.effective.utc_offset || null,
        answers: JSON.parse(JSON.stringify(op.payload.answers)),
      }));
  }

  return Object.freeze({
    repository, client, device, day, namespace, databaseName, lease,
    openedRefusal: opened && opened.refusal ? { ...opened.refusal } : null,
    /* Every check-in this device holds, in write order. */
    async all() { return checkInsIn((await repository.load()).generation); },
    /* THE DATE LAW. A check-in belongs to the day it was effective for, and to no
       other. This asks for ONE date and returns only operations effective for it, so
       yesterday's answers can never be painted as today's and a denial recorded
       yesterday is never carried into today. */
    async forDate(date) {
      if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new TypeError('forDate requires a date');
      return (await this.all()).filter(row => row.date === date);
    },
    /* ONE durable transaction, written by rebuild/client inside the staged
       generation and sealed by the repository: the check-in operation and its outbox
       entry, or neither. The client's answer is returned unedited. */
    async save(answers) {
      const result = await client.execute('workout', { action: 'checkin', input: { answers } });
      return { ok: result.acknowledged === true, state: result.state, copy: result.copy,
        code: result.code || null, op_id: result.op_id || null };
    },
    async restart() { return client.reopen(); },
    face() { const current = client.current(); return current && current.view ? current.view : null; },
    paint() { const view = this.face(); return view ? view.paint : null; },
    blockedCopy() {
      const view = this.face();
      if (!view) return null;
      return (view.layer2 && view.layer2.copy) || (view.layer1 && view.layer1.label) || null;
    },
    outboxRetained() {
      const view = this.face();
      return view && view.layer1 && Number.isSafeInteger(view.layer1.outbox) ? view.layer1.outbox : null;
    },
    close() { repository.close(); },
  });
}

export default { createCheckInHost, CHECKIN_DATABASE, CHECKIN_NAMESPACE, CHECKIN_SCHEMA_VERSION, PROFILE };
