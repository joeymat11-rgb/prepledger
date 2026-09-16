// measure-host.mjs - round 2, closing reviewer finding 1 ("nothing records" -
// waist had no command, no host, no op, no store write). SAME store the
// weigh-in, the workout, the check-in, the first run and sleep are in (C4c,
// DECISIONS:106 b): one sealed generation, one lease, one device sequence.
// Opens through the same extension point sleep-host.mjs uses -
// `client.hostBindings({ workoutCommands })` - so this file needs no change
// to any pinned path. The ONE thing this lane supplies is its command
// producer (measure-commands.cjs).
import { openTodayHosts, DATABASE, NAMESPACE } from '../today/gym-host.mjs';
import { createDurablePublicClient } from '../../w6/public-client.mjs';
import { LOCAL_ERA_SCHEMA_VERSION } from '../../w6/local/local-era.mjs';
/* The food lane's OWN read-back, imported rather than restated: logging
   adherence counts the days the athlete recorded an intake on, and there is
   exactly one definition of what such a record is (N1, food-host.mjs). */
import { foodDaysIn } from '../today/food-host.mjs';
import MeasureCommands from './measure-commands.cjs';

const { createMeasureCommands, PROFILE, OP_CLASS, OP_KIND, MARKERS_PROFILE,
  TRIAL_PROFILE } = MeasureCommands;

export { PROFILE, OP_CLASS, OP_KIND, MARKERS_PROFILE, TRIAL_PROFILE };
/* The first-run record's own profile, as setup-commands.mjs names it. Read, not
   written: this lane never enrols anything. */
export const SETUP_PROFILE = 'earned/first-run-setup/v1';
export const MEASURE_SCHEMA_VERSION = LOCAL_ERA_SCHEMA_VERSION;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/* The generation's LIVE operations: neither rejected by the store nor retired
   by a tombstone. Every reader below narrows this same list, so no reader can
   quietly disagree with another about what this device still holds. */
export function liveOps(generation) {
  const collections = (generation && generation.collections) || {};
  const rejected = collections.rejected || {};
  const all = Object.values(collections.ops || {}).filter((op) => op && typeof op === 'object');
  const dead = new Set(all
    .filter((op) => op.kind === 'tombstone' && typeof op.target_op_id === 'string')
    .map((op) => op.target_op_id));
  return all.filter((op) => !rejected[op.op_id] && !dead.has(op.op_id));
}
const bySeq = (a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1);

/* The read-back: durable operations of this class/profile, oldest to newest by
   device sequence then op id, rejected and tombstoned operations excluded.
   measure-model.mjs projectWaist() then picks the LAST row per date, which is
   this array's own append order - the same convention sleepNightsIn/
   projectWaist already share. */
export function waistRowsIn(generation, profile = PROFILE) {
  const collections = (generation && generation.collections) || {};
  const rejected = collections.rejected || {};
  const dead = new Set(Object.values(collections.ops || {})
    .filter((op) => op && op.kind === 'tombstone' && typeof op.target_op_id === 'string')
    .map((op) => op.target_op_id));
  return Object.values(collections.ops || {})
    .filter((op) => op && op.kind === OP_KIND && op.class === OP_CLASS
      && op.payload && op.payload.profile === profile && op.payload.entry
      && typeof op.payload.entry === 'object'
      && typeof op.payload.entry.date === 'string' && DAY_RE.test(op.payload.entry.date)
      && typeof op.payload.entry.in === 'number' && Number.isFinite(op.payload.entry.in)
      && !rejected[op.op_id] && !dead.has(op.op_id))
    .sort((a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1))
    .map((op) => Object.freeze({
      op_id: op.op_id,
      device_id: typeof op.device_id === 'string' ? op.device_id : '',
      device_seq: op.device_seq || 0,
      date: op.payload.entry.date, in: op.payload.entry.in,
    }));
}

/* The markers pick, read back the durable way: the LAST accepted operation of
   this profile (there is meant to be exactly one - measureMarkersIn returns
   every accepted one so a caller can see a correction the same way a stale
   sleep night would show, but save() below refuses a second write while one
   stands). */
export function measureMarkersIn(generation, profile = MARKERS_PROFILE) {
  const collections = (generation && generation.collections) || {};
  const rejected = collections.rejected || {};
  const dead = new Set(Object.values(collections.ops || {})
    .filter((op) => op && op.kind === 'tombstone' && typeof op.target_op_id === 'string')
    .map((op) => op.target_op_id));
  return Object.values(collections.ops || {})
    .filter((op) => op && op.kind === OP_KIND && op.class === OP_CLASS
      && op.payload && op.payload.profile === profile && Array.isArray(op.payload.markers)
      && !rejected[op.op_id] && !dead.has(op.op_id))
    .sort((a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1))
    .map((op) => Object.freeze({ op_id: op.op_id, markers: [...op.payload.markers] }));
}

/* The persisted trial start, read back the durable way: the FIRST accepted
   operation of this profile wins, so a second one (which save refuses anyway)
   could never re-base a window that is already running. */
export function trialStartIn(generation, profile = TRIAL_PROFILE) {
  const rows = liveOps(generation)
    .filter((op) => op.kind === OP_KIND && op.class === OP_CLASS
      && op.payload && op.payload.profile === profile
      && typeof op.payload.start === 'string' && DAY_RE.test(op.payload.start))
    .sort(bySeq);
  return rows.length ? rows[0].payload.start : null;
}

/* THE FIRST ENROLLED RECORD'S OWN LOCAL DATE (ticket BUILD (3)). The enrolment
   record is the first-run setup fact; with none on this device yet, the
   earliest accepted operation of any kind is the first record this
   installation holds. Nothing here reads a clock. */
export function firstEnrolledDateIn(generation) {
  const live = liveOps(generation).sort(bySeq);
  const dateOf = (op) => (op.effective && typeof op.effective.local_date === 'string'
    && DAY_RE.test(op.effective.local_date) ? op.effective.local_date : null);
  const setup = live.find((op) => op.kind === 'fact' && op.class === 'event'
    && op.payload && op.payload.profile === SETUP_PROFILE);
  if (setup && dateOf(setup)) return dateOf(setup);
  const dates = live.map(dateOf).filter((d) => d !== null).sort();
  return dates.length ? dates[0] : null;
}

/* THE SETS THIS DEVICE RECORDED (ticket BUILD (1), "gym sets" through the
   EXISTING entry path). The gym card writes schema-2 `session-set` operations
   through the accepted workout stack; this reads them back exactly as they were
   written - lift lineage, load and reps - and interprets nothing. A set the
   athlete later removed through the card's own undo is the TARGET of a later
   operation and is dropped; a corrected one takes its replacement values, the
   same way rebuild/client's own reading projection applies a correction. */
export function sessionSetsIn(generation) {
  const live = liveOps(generation);
  const edits = live.filter((op) => typeof op.target_op_id === 'string');
  const removed = new Set(edits.filter((op) => !op.payload || !op.payload.replacement_fields)
    .map((op) => op.target_op_id));
  const replaced = new Map();
  for (const op of edits.sort(bySeq)) {
    if (op.payload && op.payload.replacement_fields) replaced.set(op.target_op_id, op.payload.replacement_fields);
  }
  const valueOf = (field) => (field && typeof field.value === 'number' && Number.isFinite(field.value)
    ? field.value : null);
  return live
    .filter((op) => op.kind === 'session-set' && op.class === 'session'
      && typeof op.lift_lineage_id === 'string' && op.payload
      && !removed.has(op.op_id)
      && op.effective && DAY_RE.test(op.effective.local_date || ''))
    .sort(bySeq)
    .map((op) => {
      const fields = { ...op.payload, ...(replaced.get(op.op_id) || {}) };
      return { date: op.effective.local_date, marker: op.lift_lineage_id,
        load: valueOf(fields.load), reps: valueOf(fields.reps), op_id: op.op_id };
    })
    .filter((row) => row.load !== null && row.reps !== null);
}

/* TRAINING ADHERENCE, numerator. A date this device recorded at least one set
   on is a session performed that day: the operation log's own evidence that
   the athlete trained, rather than a start he may have abandoned. */
export function sessionDatesIn(generation) {
  return [...new Set(sessionSetsIn(generation).map((row) => row.date))].sort();
}

export async function createMeasureHost({ day, indexedDB, crypto, era: given,
  databaseName = DATABASE, namespace = NAMESPACE } = {}) {
  if (typeof day !== 'string' || !DAY_RE.test(day)) throw new TypeError('createMeasureHost requires day');
  const era = given || await openTodayHosts({ indexedDB, crypto, databaseName, namespace, day });
  try {
    const bindings = await era.client.hostBindings({ workoutCommands: createMeasureCommands() });
    const lease = (await bindings.repository.load()).generation.metadata.authorityLease;
    const measureClient = createDurablePublicClient({ ...bindings,
      schemaVersion: LOCAL_ERA_SCHEMA_VERSION });
    const opened = await measureClient.reopen();
    let alive = true;

    const handle = {
      repository: bindings.repository, client: measureClient, day, namespace, databaseName, lease,
      today: () => typeof era.liveDay === 'function' ? era.liveDay() : day,
      athleteId: era.athleteId, deviceId: era.deviceId,
      device: null, deviceKeyCustody: 'local-keys.mjs',
      openedRefusal: opened && opened.refusal ? { ...opened.refusal } : null,
      async all() {
        if (!alive) throw new Error('LOCAL_CLIENT_CLOSED');
        return waistRowsIn((await bindings.repository.load()).generation, PROFILE);
      },
      /* ONE op per save (N2's shape, adapted): a correction is a NEW op, never
         an update and never a delete. The projector (measure-model.mjs
         projectWaist) decides which row wins for a date. */
      async save(entry) {
        if (!alive) return { ok: false, state: 3, copy: null, code: 'LOCAL_CLIENT_CLOSED', op_id: null };
        let result;
        try {
          result = await measureClient.execute('workout', { action: 'waist-entry', input: { entry } });
        } catch (error) {
          const code = (error && error.message) || 'WAIST_WRITE_REFUSED';
          return { ok: false, state: 3, copy: null, code, op_id: null };
        }
        if (result.acknowledged !== true) {
          return { ok: false, state: result.state, copy: result.copy,
            code: result.code || 'WAIST_WRITE_REFUSED', op_id: null };
        }
        return { ok: true, state: result.state, copy: result.copy,
          code: result.code || null, op_id: result.op_id || null };
      },
      /* THE MARKERS PICK, ROUND 2 FINDING 8: a fixed pick stored on device, read
         back from the durable record, never a value the caller invents fresh
         each time. */
      async markers() {
        if (!alive) throw new Error('LOCAL_CLIENT_CLOSED');
        const rows = measureMarkersIn((await bindings.repository.load()).generation, MARKERS_PROFILE);
        return rows.length ? rows[rows.length - 1].markers : null;
      },
      /* Chosen ONCE (plan section 2, "chosen once"): a second attempt while a
         pick already stands is refused before it reaches the client, the same
         re-read-before-write setup-host.mjs's first run uses. */
      async saveMarkers(markers) {
        if (!alive) return { ok: false, state: 3, copy: null, code: 'LOCAL_CLIENT_CLOSED', op_id: null };
        if (await handle.markers()) {
          return { ok: false, state: 0, copy: null, code: 'MEASURE_MARKERS_ALREADY_RECORDED', op_id: null };
        }
        let result;
        try {
          result = await measureClient.execute('workout', { action: 'measure-markers-pick', input: { markers } });
        } catch (error) {
          const code = (error && error.message) || 'MEASURE_MARKERS_WRITE_REFUSED';
          return { ok: false, state: 3, copy: null, code, op_id: null };
        }
        if (result.acknowledged !== true) {
          return { ok: false, state: result.state, copy: result.copy,
            code: result.code || 'MEASURE_MARKERS_WRITE_REFUSED', op_id: null };
        }
        return { ok: true, state: result.state, copy: result.copy,
          code: result.code || null, op_id: result.op_id || null };
      },
      /* THE SETS AND THE SESSION DATES this device recorded through the gym
         card, read out of the SAME generation everything else here is read
         from. No second store and no second lane. */
      async sets() {
        if (!alive) throw new Error('LOCAL_CLIENT_CLOSED');
        return sessionSetsIn((await bindings.repository.load()).generation);
      },
      async sessionDates() {
        if (!alive) throw new Error('LOCAL_CLIENT_CLOSED');
        return sessionDatesIn((await bindings.repository.load()).generation);
      },
      async foodDays() {
        if (!alive) throw new Error('LOCAL_CLIENT_CLOSED');
        return foodDaysIn((await bindings.repository.load()).generation);
      },
      /* TRIAL DAY ONE (review R2 finding 2). Read first, written once, never
         re-based: a device that already carries a trial start returns it
         unchanged whatever today is. */
      async trialStart() {
        if (!alive) throw new Error('LOCAL_CLIENT_CLOSED');
        return trialStartIn((await bindings.repository.load()).generation, TRIAL_PROFILE);
      },
      async firstEnrolledDate() {
        if (!alive) throw new Error('LOCAL_CLIENT_CLOSED');
        return firstEnrolledDateIn((await bindings.repository.load()).generation);
      },
      /* Persists day one ONCE, from the first enrolled record's own local date.
         With nothing enrolled yet there is no trial to date and nothing is
         written. A start already recorded is returned as it stands. */
      async ensureTrialStart() {
        if (!alive) return null;
        const already = await handle.trialStart();
        if (already) return already;
        const first = await handle.firstEnrolledDate();
        if (!first) return null;
        let result;
        try {
          result = await measureClient.execute('workout',
            { action: 'measure-trial-start', input: { start: first } });
        } catch (_) { return null; }
        if (result.acknowledged !== true) return null;
        return handle.trialStart();
      },
      async restart() { return measureClient.reopen(); },
      face() { const current = measureClient.current(); return current && current.view ? current.view : null; },
      close() { alive = false; if (!given) era.close(); },
    };
    return Object.freeze(handle);
  } catch (error) { if (!given) era.close(); throw error; }
}

export default { createMeasureHost, waistRowsIn, measureMarkersIn, liveOps,
  trialStartIn, firstEnrolledDateIn, sessionSetsIn, sessionDatesIn,
  PROFILE, OP_CLASS, OP_KIND, MARKERS_PROFILE, TRIAL_PROFILE, SETUP_PROFILE,
  MEASURE_SCHEMA_VERSION };
