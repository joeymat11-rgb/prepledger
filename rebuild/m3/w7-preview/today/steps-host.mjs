// steps-host.mjs - N2 "Log today", the steps lane's durable store of record: the SAME store the weigh-in, the
// workout, the check-in, the food day and the night are in (one sealed generation of this device's local era, one
// lease, one device sequence). It is food-host.mjs's shape, line for line, and for the same reasons:
//
// WHY THIS LANE OPENS ITSELF. rebuild/m3/w6/local/today-bindings.mjs is PINNED ON DISK by the merged B-NTC
// artifact (DECISIONS:144), so no new factory is added there. This lane opens through the honest extension point
// the food, sleep and machine-settings lanes use: the era's own client and
// `client.hostBindings({ workoutCommands })`. Every piece is w6's or the accepted client's; the ONE thing this lane
// supplies is its command producer (./steps-commands.cjs) and the profile its facts carry.
//
// NO SECOND STORE, NO SECOND LEASE, NO SECOND CLOCK. No `clock` is handed to hostBindings, so the installation's
// own is used (FOOD-LIVE-SAVE; rebuild/m3/w6/host/test/food-live-save.test.mjs FLS/5 holds this file to it).
import { openTodayHosts, DATABASE, NAMESPACE } from './gym-host.mjs';
import { createDurablePublicClient } from '../../w6/public-client.mjs';
import { LOCAL_ERA_SCHEMA_VERSION } from '../../w6/local/local-era.mjs';
import StepsCommands from './steps-commands.cjs';

const { createStepsCommands, PROFILE, ACTION, OP_CLASS, OP_KIND } = StepsCommands;

export { PROFILE, OP_CLASS, OP_KIND };
export const STEPS_SCHEMA_VERSION = LOCAL_ERA_SCHEMA_VERSION;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/* The read-back, as a FILTER and never an interpretation (food-host.mjs foodDaysIn): this lane's class and profile
   keep every other lane's ops out, a rejected or tombstoned op is never a row, and the order is the log's own -
   device sequence, then op id - so "the last row for a date" is a fact about the log. */
export function stepDaysIn(generation, profile = PROFILE) {
  const collections = (generation && generation.collections) || {};
  const rejected = collections.rejected || {};
  const dead = new Set(Object.values(collections.ops || {})
    .filter((op) => op && op.kind === 'tombstone' && typeof op.target_op_id === 'string')
    .map((op) => op.target_op_id));
  return Object.values(collections.ops || {})
    .filter((op) => op && op.kind === OP_KIND && op.class === OP_CLASS
      && op.payload && op.payload.profile === profile && op.payload.day
      && typeof op.payload.day === 'object'
      && op.effective && typeof op.effective.local_date === 'string'
      && DAY_RE.test(op.effective.local_date)
      && !rejected[op.op_id] && !dead.has(op.op_id))
    .sort((a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1))
    .map((op) => Object.freeze({
      op_id: op.op_id,
      date: op.effective.local_date,
      time: op.effective.local_time || null,
      offset: op.effective.utc_offset || null,
      day: JSON.parse(JSON.stringify(op.payload.day)),
    }));
}

export async function createStepsHost({ day, indexedDB, crypto, era: given,
  databaseName = DATABASE, namespace = NAMESPACE } = {}) {
  if (typeof day !== 'string' || !DAY_RE.test(day)) throw new TypeError('createStepsHost requires day');
  const era = given || await openTodayHosts({ indexedDB, crypto, databaseName, namespace, day });
  try {
    const bindings = await era.client.hostBindings({ workoutCommands: createStepsCommands() });
    const lease = (await bindings.repository.load()).generation.metadata.authorityLease;
    const stepsClient = createDurablePublicClient({ ...bindings,
      schemaVersion: LOCAL_ERA_SCHEMA_VERSION });
    const opened = await stepsClient.reopen();
    let alive = true;

    const handle = {
      repository: bindings.repository, client: stepsClient, day, namespace, databaseName, lease,
      athleteId: era.athleteId, deviceId: era.deviceId,
      device: null, deviceKeyCustody: 'local-keys.mjs',
      openedRefusal: opened && opened.refusal ? { ...opened.refusal } : null,
      async all() { return stepDaysIn((await bindings.repository.load()).generation, PROFILE); },
      async forDate(date) {
        if (typeof date !== 'string' || !DAY_RE.test(date)) throw new TypeError('forDate requires a date');
        return (await handle.all()).filter((row) => row.date === date);
      },
      /* ONE op per save, and a correction is a NEW op; nothing is updated or deleted. */
      async save(dayValues) {
        if (!alive) return { ok: false, state: 3, copy: null, code: 'LOCAL_CLIENT_CLOSED', op_id: null };
        let result;
        try {
          result = await stepsClient.execute('workout', { action: ACTION, input: { day: dayValues } });
        } catch (error) {
          const code = (error && error.message) || 'STEPS_WRITE_REFUSED';
          return { ok: false, state: 3, copy: null, code, op_id: null };
        }
        return { ok: result.acknowledged === true, state: result.state, copy: result.copy,
          code: result.code || null, op_id: result.op_id || null };
      },
      async restart() { return stepsClient.reopen(); },
      face() { const current = stepsClient.current(); return current && current.view ? current.view : null; },
      close() { alive = false; if (!given) era.close(); },
    };
    return Object.freeze(handle);
  } catch (error) { if (!given) era.close(); throw error; }
}

export default { createStepsHost, stepDaysIn, PROFILE, OP_CLASS, OP_KIND, STEPS_SCHEMA_VERSION };
