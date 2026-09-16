// measure-host.mjs - round 2, closing reviewer finding 1 ("nothing records" -
// waist had no command, no host, no op, no store write). SAME store the
// weigh-in, the workout, the check-in, the first run and sleep are in (C4c,
// DECISIONS:106 b): one sealed generation, one lease, one device sequence.
// Opens through the same extension point sleep-host.mjs uses -
// `client.hostBindings({ workoutCommands })` - so this file needs no change
// to any pinned path. The ONE thing this lane supplies is its command
// producer (measure-commands.cjs).
import { openTodayHosts, DATABASE, NAMESPACE } from './gym-host.mjs';
import { createDurablePublicClient } from '../../w6/public-client.mjs';
import { LOCAL_ERA_SCHEMA_VERSION } from '../../w6/local/local-era.mjs';
import MeasureCommands from './measure-commands.cjs';

const { createMeasureCommands, PROFILE, OP_CLASS, OP_KIND, MARKERS_PROFILE } = MeasureCommands;

export { PROFILE, OP_CLASS, OP_KIND, MARKERS_PROFILE };
export const MEASURE_SCHEMA_VERSION = LOCAL_ERA_SCHEMA_VERSION;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

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
      async restart() { return measureClient.reopen(); },
      face() { const current = measureClient.current(); return current && current.view ? current.view : null; },
      close() { alive = false; if (!given) era.close(); },
    };
    return Object.freeze(handle);
  } catch (error) { if (!given) era.close(); throw error; }
}

export default { createMeasureHost, waistRowsIn, measureMarkersIn,
  PROFILE, OP_CLASS, OP_KIND, MARKERS_PROFILE, MEASURE_SCHEMA_VERSION };
