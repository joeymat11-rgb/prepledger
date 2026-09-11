// reading-host.mjs — the morning weigh-in's durable store of record.
//
// A1 kept the weigh-in in localStorage. Review B2 executed a real `taskkill /F /T`
// and found what that costs: Chromium buffers localStorage in the renderer and
// flushes it asynchronously, so a hard kill (which is exactly what iOS tab
// termination is) loses recent readings while the encrypted IndexedDB workout
// survives. A reading that the screen said was saved must not be able to
// disappear, so the store of record moves here: the SAME accepted machinery the
// gym card uses — the encrypted repository, the T2 stage over rebuild/client, and
// the accepted durable public client — and localStorage is gone from the product
// entirely, not demoted to a cache (a second source of truth for a value that is
// already cheap to read is a liability, not a convenience).
//
// WHY IT IS A SECOND REPOSITORY, AND NOT THE WORKOUT'S. Executed, not assumed:
// one generation carries ONE authority lease with ONE schema_version, and
// rebuild/client stamps a reading `schema_version: 1` and a workout
// `schema_version: 2` (index.cjs: `schema_version: workout ? 2 : undefined`,
// ops.cjs: `SCHEMA_VERSION = 1`). Writing a weigh-in through the workout's
// schema-2 client is refused by the accepted layer with
// OPERATION_SCHEMA_MISMATCH, state 20, and stores nothing — there is a test for
// exactly that. Both files are pinned, so the reading lane gets its own
// generation, on the same device, under the same device store key. When a future
// engine package unifies the two schemas this module collapses into gym-host.mjs.
//
// Everything real here is the accepted code; everything synthetic is the same
// labelled device enrolment gym-host.mjs mints (see its header).

import { openRepository } from '../../w6/repository.mjs';
import { createDurablePublicClient } from '../../w6/public-client.mjs';
import T2Stage from '../../w6/t2-stage.cjs';
import { openDeviceKeys, signRecord, initialGeneration, mintLease,
  DEVICE_ID, ATHLETE_ID, IDENTITY_KEY, ENROLMENT_EVIDENCE, LEASE_DOMAIN } from './gym-host.mjs';

const { createT2Stage } = T2Stage;

export const READING_DATABASE = 'earned-today-preview-readings';
export const READING_NAMESPACE = 'earned-today-preview/device-A/readings';
/* The reading lane's operations are schema 1, so its lease must be schema 1 —
   the durable client refuses any operation whose schema differs from the lease it
   verified, and that guard is the point of this whole arrangement. */
export const READING_SCHEMA_VERSION = 1;

export async function createReadingHost({ day, indexedDB, crypto, deviceKeys,
  databaseName = READING_DATABASE, namespace = READING_NAMESPACE } = {}) {
  const web = crypto || globalThis.crypto;
  const idb = indexedDB || globalThis.indexedDB;
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new TypeError('createReadingHost requires day');
  if (!idb || !web?.subtle) throw new Error('READING_DEVICE_STORE_UNAVAILABLE');

  const device = deviceKeys || await openDeviceKeys({ indexedDB: idb, crypto: web });
  const keys = [{ kid: device.kid, publicKey: device.publicKey }];
  const repository = await openRepository({ indexedDB: idb, crypto: web, databaseName, namespace,
    keyProvider: () => device.storeKey,
    authorizeEnrollment: evidence => evidence === ENROLMENT_EVIDENCE });

  let lease;
  try { await repository.load(); }
  catch (error) {
    if (error?.code !== 'STORE_MISSING') { repository.close(); throw error; }
    lease = await signRecord(mintLease(READING_SCHEMA_VERSION),
      { domain: LEASE_DOMAIN, field: 'signature', privateKey: device.signingKey, kid: device.kid, crypto: web });
    await repository.initialize(initialGeneration(lease), ENROLMENT_EVIDENCE);
  }
  if (!lease) lease = (await repository.load()).generation.metadata.authorityLease;

  const clock = { today: () => day, now: () => day + 'T13:00:00.000Z', tz: '-05:00', monotonicMs: () => 0 };
  const stage = createT2Stage(() => ({ deviceId: DEVICE_ID, athleteId: ATHLETE_ID, identityKey: IDENTITY_KEY,
    clock, lease, online: false, contract: { client: '1', required: '1' }, standing: 'enrolled' }),
    { allowInbound: true });

  const client = createDurablePublicClient({ repository, stage, namespace, athleteId: ATHLETE_ID, deviceId: DEVICE_ID,
    sessionEpoch: 1, isCurrentSession: epoch => epoch === 1, observationEpoch: () => 1,
    observationGuard: { run: async (_kind, run) => run() }, validateCommit: () => null,
    keys, crypto: web, schemaVersion: READING_SCHEMA_VERSION });

  // Publish the client's own face from disk before anything reads it.
  const opened = await client.reopen();

  /* The synchronous face the screen reads. It is the CLIENT'S own published view
     (bridge.current()), republished by the same stage that writes, so a read can
     never disagree with what was written and nothing here parses an operation. */
  function face() {
    const current = client.current();
    return current && current.view ? current.view : null;
  }
  function reads() {
    const view = face();
    const rows = view && view.layer1 && Array.isArray(view.layer1.reads) ? view.layer1.reads : [];
    return rows
      .filter(row => row && typeof row.date === 'string' && typeof row.lb === 'number' && Number.isFinite(row.lb))
      .slice()
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  }

  return Object.freeze({
    repository, client, device, day, namespace, databaseName, lease,
    openedRefusal: opened && opened.refusal ? { ...opened.refusal } : null,
    face, reads,
    paint: () => { const view = face(); return view ? view.paint : null; },
    label: () => { const view = face(); return (view && view.layer1 && view.layer1.label) || ''; },
    blockedCopy: () => {
      const view = face();
      if (!view) return null;
      return (view.layer2 && view.layer2.copy) || (view.layer1 && view.layer1.label) || null;
    },
    /* ONE durable transaction, written by rebuild/client inside the staged
       generation and sealed by the repository: the reading operation and its
       outbox entry, or neither. The client's answer is returned unedited. */
    async weighIn({ date, lb }) {
      const result = await client.execute('weighIn', { date, lb });
      return { ok: result.acknowledged === true, state: result.state, copy: result.copy,
        code: result.code || null, op_id: result.op_id || null };
    },
    async restart() { return client.reopen(); },
    outboxRetained() {
      const view = face();
      return view && view.layer1 && Number.isSafeInteger(view.layer1.outbox) ? view.layer1.outbox : null;
    },
    close() { repository.close(); },
  });
}
