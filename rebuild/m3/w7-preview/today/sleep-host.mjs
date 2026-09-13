// sleep-host.mjs - N2's durable store of record, which is the SAME store the weigh-in,
// the workout, the check-in, the first run and N1's intake are in (C4c, DECISIONS:106 b):
// one sealed generation of this device's local era, one lease, one device sequence.
//
// WHY THIS LANE OPENS ITSELF. today-entry.mjs boot() opens the other lanes, and BOTH it
// and rebuild/m3/w6/local/today-bindings.mjs are PINNED ON DISK by the merged B-NTC
// artifact (DECISIONS:144, checked twice by rebuild/conform/v4/postfix/legacy-gates.cjs:12-16;
// the pin-class transition is lane B's first tooling round after H3, DECISIONS:154 (5)).
// Neither can gain a sixth factory however well licensed the change is. N2 therefore
// opens its own lane through the SAME honest extension point N1, the machine-settings
// lane and A4b's setup producer use: the era's own client, and
// `client.hostBindings({ workoutCommands })` (rebuild/m3/w6/local/local-client.mjs:395,
// confirmed by D2's N2-SOURCE-ERRATUM.md). Every piece below is w6's or the accepted
// client's; the ONE thing this lane supplies is its command producer.
//
// NO SECOND STORE, NO SECOND LEASE, NO SECOND CLOCK.
import { openTodayHosts, DATABASE, NAMESPACE } from './gym-host.mjs';
import { clientClockFor } from '../../w6/local/today-bindings.mjs';
import { createDurablePublicClient } from '../../w6/public-client.mjs';
import { LOCAL_ERA_SCHEMA_VERSION } from '../../w6/local/local-era.mjs';
import SleepCommands from './sleep-commands.cjs';

const { createSleepCommands, PROFILE, ACTION, OP_CLASS, OP_KIND } = SleepCommands;

export { PROFILE, OP_CLASS, OP_KIND };
export const SLEEP_SCHEMA_VERSION = LOCAL_ERA_SCHEMA_VERSION;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/* The read-back. The accepted client publishes no face for a sleep night (seam S2), so
   the rows come out of the durable generation the repository has just authenticated, as
   a FILTER and never an interpretation: this lane's class and profile are what keep a
   weigh-in, a workout set, a check-in, a first run and a food day out of the list.
   Order is the log's own - device sequence, then op id - which is what makes "the last
   row for a night" a fact about the log rather than about the order this page read it.
   Rejected and tombstoned operations are excluded, so a refused write can never win. */
export function sleepNightsIn(generation, profile = PROFILE) {
  const collections = (generation && generation.collections) || {};
  const rejected = collections.rejected || {};
  const dead = new Set(Object.values(collections.ops || {})
    .filter((op) => op && op.kind === 'tombstone' && typeof op.target_op_id === 'string')
    .map((op) => op.target_op_id));
  return Object.values(collections.ops || {})
    .filter((op) => op && op.kind === OP_KIND && op.class === OP_CLASS
      && op.payload && op.payload.profile === profile && op.payload.night
      && typeof op.payload.night === 'object'
      && typeof op.payload.night.date === 'string' && DAY_RE.test(op.payload.night.date)
      && op.effective && typeof op.effective.local_date === 'string'
      && !rejected[op.op_id] && !dead.has(op.op_id))
    .sort((a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1))
    .map((op) => Object.freeze({
      op_id: op.op_id,
      /* D2 ROUND 1, FINDING 4 - the sequence is only an order WITHIN one device, so the
         device that issued an op travels with it and the projector can tell an ordered
         pair from an unordered one instead of guessing. */
      device_id: typeof op.device_id === 'string' ? op.device_id : '',
      device_seq: op.device_seq || 0,
      savedDate: op.effective.local_date,
      savedTime: op.effective.local_time || null,
      savedOffset: op.effective.utc_offset || null,
      night: JSON.parse(JSON.stringify(op.payload.night)),
    }));
}

/* D2 ROUND 1, FINDING 1 - A CITATION IS ONLY A CITATION IF THE THING CITED IS THERE.
   `from_checkin_op_id` is a claim that this night came out of a check-in the athlete
   answered. Until now the producer accepted any non-empty string, so a forged id, a
   deleted check-in, or one whose hours say something else entirely all read back on the
   screen as provenance. The claim is now AUTHENTICATED against the same authenticated
   generation the night is written into: the op must be present, be a check-in of this
   profile, not be rejected or tombstoned, have been effective the MORNING AFTER the
   night it is cited for, carry a sleep-hours answer EQUAL to the one being written, and
   have that answer's source be "entered" - a confirmation of an existing record is not
   the origin of one. Anything else is refused before a write, not decorated after. */
const CHECKIN_PROFILE = 'earned/recovery-checkin/v1';
const dayAfter = (iso) => {
  const t = Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) + 86400000;
  return new Date(t).toISOString().slice(0, 10);
};
export function checkInSourceFault(generation, night) {
  const id = night && night.from_checkin_op_id;
  if (typeof id !== 'string' || id === '') return null;          // no claim, nothing to authenticate
  const collections = (generation && generation.collections) || {};
  const ops = collections.ops || {};
  const rejected = collections.rejected || {};
  const dead = new Set(Object.values(ops)
    .filter((op) => op && op.kind === 'tombstone' && typeof op.target_op_id === 'string')
    .map((op) => op.target_op_id));
  const op = ops[id];
  if (!op || rejected[id] || dead.has(id)) return 'SLEEP_SOURCE_MISSING';
  if (op.kind !== 'fact' || op.class !== 'event') return 'SLEEP_SOURCE_NOT_CHECKIN';
  if (!op.payload || op.payload.profile !== CHECKIN_PROFILE) return 'SLEEP_SOURCE_NOT_CHECKIN';
  const answers = op.payload.answers;
  if (!answers || typeof answers !== 'object') return 'SLEEP_SOURCE_NOT_CHECKIN';
  if (!op.effective || op.effective.local_date !== dayAfter(night.date)) return 'SLEEP_SOURCE_WRONG_NIGHT';
  const hours = answers.sleep_hours;
  if (!hours || typeof hours !== 'object' || hours.value !== night.hours) return 'SLEEP_SOURCE_WRONG_HOURS';
  if (answers.sleep_hours_source !== 'entered') return 'SLEEP_SOURCE_NOT_ENTERED';
  return null;
}

/* D2 ROUND 2, FINDING 6 - THE ERA'S SLEEP ROWS, WHERE ANY CONSUMER ON THIS DEVICE CAN
   READ THEM SYNCHRONOUSLY. A projector is synchronous and a repository read is not, so
   a consumer that is handed a state - the coach's Today, its gym, its check-in - cannot
   await the log at the moment it is asked. This register is written by the only thing
   that changes the answer, the writer itself: `createSleepHost` primes it from the
   durable read when it opens, and refreshes it after every committed night and every
   `all()`. It is keyed on the ERA (one device, one generation, one lease) and holds
   nothing but rows that were read back out of that generation. It is a cache of a
   durable read, never a second store, and a consumer that has no era registered gets
   an empty list and says so rather than guessing. */
const ERA_ROWS = new WeakMap();
/* The era's CLIENT is the identity that matters: two callers may hold two era handles
   over one installation (the coach holds its own, a host opened beside it holds
   another), and both are the same generation only because they are the same client. */
const eraKey = (era) => {
  if (!era || typeof era !== 'object') return null;
  return era.client && typeof era.client === 'object' ? era.client : era;
};
const rememberRows = (era, rows) => { const key = eraKey(era); if (key) ERA_ROWS.set(key, rows); };
export function sleepRowsOn(era) {
  const key = eraKey(era);
  const rows = key ? ERA_ROWS.get(key) : null;
  return Array.isArray(rows) ? rows : [];
}
export function forgetSleepRows(era) { const key = eraKey(era); if (key) ERA_ROWS.delete(key); }

export async function createSleepHost({ day, indexedDB, crypto, era: given,
  databaseName = DATABASE, namespace = NAMESPACE } = {}) {
  if (typeof day !== 'string' || !DAY_RE.test(day)) throw new TypeError('createSleepHost requires day');
  const era = given || await openTodayHosts({ indexedDB, crypto, databaseName, namespace, day });
  try {
    const bindings = await era.client.hostBindings({ workoutCommands: createSleepCommands(),
      clock: clientClockFor(day) });
    const lease = (await bindings.repository.load()).generation.metadata.authorityLease;
    const sleepClient = createDurablePublicClient({ ...bindings,
      schemaVersion: LOCAL_ERA_SCHEMA_VERSION });
    const opened = await sleepClient.reopen();
    let alive = true;

    const handle = {
      repository: bindings.repository, client: sleepClient, day, namespace, databaseName, lease,
      athleteId: era.athleteId, deviceId: era.deviceId,
      device: null, deviceKeyCustody: 'local-keys.mjs',
      openedRefusal: opened && opened.refusal ? { ...opened.refusal } : null,
      async all() {
        const rows = sleepNightsIn((await bindings.repository.load()).generation, PROFILE);
        rememberRows(era, rows);       // every read refreshes what the era's consumers see
        return rows;
      },
      async forDate(date) {
        if (typeof date !== 'string' || !DAY_RE.test(date)) throw new TypeError('forDate requires a date');
        return (await handle.all()).filter((row) => row.night.date === date);
      },
      /* ONE op per save, and a correction is a NEW op (N2 brief). Nothing is updated
         and nothing is deleted; the projector decides which op wins.
         D2 ROUND 1, FINDING 1 - two preconditions are checked against the generation as
         it stands NOW, before anything is written. (a) A cited check-in must really be
         that check-in (checkInSourceFault). (b) A CORRECTION must supersede cleanly: the
         caller passes the op it believes it is correcting, and if the winning op for that
         night is no longer that op - another save landed first, or the night it thought
         it was correcting is gone - the write is refused as SLEEP_STALE_NIGHT rather than
         silently becoming the winner over a night the athlete never saw. */
      async save(night, { supersedes } = {}) {
        if (!alive) return { ok: false, state: 3, copy: null, code: 'LOCAL_CLIENT_CLOSED', op_id: null };
        const refuse = (code) => ({ ok: false, state: 3, copy: null, code, op_id: null });
        const date = night && night.date;
        let generation;
        try { generation = (await bindings.repository.load()).generation; }
        catch { return refuse('SLEEP_PRECONDITION_UNREADABLE'); }
        const fault = checkInSourceFault(generation, night);
        if (fault) return refuse(fault);
        /* The pre-read still runs, because it names the refusal in this lane's own
           words and costs one read. It is no longer what ENFORCES the expectation:
           D2 round 2, finding 1 - the enforcement is inside the commit, where the
           producer's validate re-asks the same question of the generation actually
           being written (sleep-commands.cjs revisionIsCurrent). */
        const winner = (held) => (held.length === 0 ? null : held[held.length - 1].op_id);
        if (supersedes !== undefined) {
          const held = sleepNightsIn(generation, PROFILE).filter((row) => row.night.date === date);
          if (winner(held) !== supersedes) return refuse('SLEEP_STALE_NIGHT');
        }
        let result;
        const input = supersedes === undefined ? { night } : { night, supersedes };
        try {
          result = await sleepClient.execute('workout', { action: ACTION, input });
        } catch (error) {
          const code = (error && error.message) || 'SLEEP_WRITE_REFUSED';
          return { ok: false, state: 3, copy: null, code, op_id: null };
        }
        if (result.acknowledged !== true) {
          /* A refusal from the commit itself. The client reports an invalid envelope
             without this lane's vocabulary, so the log is asked why: if the night has
             moved on since this write was prepared, that is a STALE correction and is
             named as one. Nothing was written either way. */
          if (supersedes !== undefined) {
            try {
              const now = (await bindings.repository.load()).generation;
              const held = sleepNightsIn(now, PROFILE).filter((row) => row.night.date === date);
              if (winner(held) !== supersedes) return refuse('SLEEP_STALE_NIGHT');
            } catch { /* the reason stays the client's own */ }
          }
          return { ok: false, state: result.state, copy: result.copy,
            code: result.code || 'SLEEP_WRITE_REFUSED', op_id: null };
        }
        /* THE ERA'S ROWS, kept current for every consumer on this device the moment a
           night is committed (D2 round 2, finding 6). */
        try { rememberRows(era, sleepNightsIn((await bindings.repository.load()).generation, PROFILE)); }
        catch { /* the register simply stays where it was */ }
        return { ok: true, state: result.state, copy: result.copy,
          code: result.code || null, op_id: result.op_id || null };
      },
      async restart() { return sleepClient.reopen(); },
      face() { const current = sleepClient.current(); return current && current.view ? current.view : null; },
      close() { alive = false; if (!given) era.close(); },
    };
    /* Primed from the DURABLE read, once, at open: a consumer that reads the register
       before anything is written on this run still sees what the store holds. */
    try { rememberRows(era, await handle.all()); } catch { /* the lane still opens */ }
    return Object.freeze(handle);
  } catch (error) { if (!given) era.close(); throw error; }
}

export default { createSleepHost, sleepNightsIn, checkInSourceFault, sleepRowsOn,
  forgetSleepRows, PROFILE, OP_CLASS, OP_KIND, SLEEP_SCHEMA_VERSION };
