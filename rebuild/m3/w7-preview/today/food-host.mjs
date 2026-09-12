// food-host.mjs - N1's durable store of record, which is the SAME store the weigh-in,
// the workout, the check-in and the first run are in (C4c, DECISIONS:106 b): one
// sealed generation of this device's local era, one lease, one device sequence.
//
// WHY THIS LANE OPENS ITSELF INSTEAD OF ASKING W6 FOR A FACTORY. The other four lanes
// call `era.createReadingHost` / `createGymHost` / `createCheckInHost` /
// `createSetupHost`, which live in rebuild/m3/w6/local/today-bindings.mjs. That file is
// PINNED ON DISK by the merged B-NTC artifact (DECISIONS:144, checked twice by
// rebuild/conform/v4/postfix/legacy-gates.cjs:12-16), so a fifth factory cannot be
// added there without turning the gate red however well licensed the change is. N1
// therefore opens its own lane through the SAME honest extension point the coach's
// machine-settings lane and A4b's setup producer use: the era's own client, and
// `client.hostBindings({ workoutCommands })` (rebuild/m3/w6/local/local-client.mjs:395).
// Every piece below is w6's or the accepted client's - the era, the repository, the
// lease, the durable public client, the schema version. The ONE thing this lane
// supplies is its command producer (./food-commands.cjs) and the profile its facts
// carry, because w6 must not depend on this page.
//
// NO SECOND STORE, NO SECOND LEASE, NO SECOND CLOCK. The bindings come from the era's
// client, so the compare-and-swap that serialises the other four lanes serialises this
// one too.
import { openTodayHosts, DATABASE, NAMESPACE } from './gym-host.mjs';
import { clientClockFor } from '../../w6/local/today-bindings.mjs';
import { createDurablePublicClient } from '../../w6/public-client.mjs';
import { LOCAL_ERA_SCHEMA_VERSION } from '../../w6/local/local-era.mjs';
import FoodCommands from './food-commands.cjs';

const { createFoodCommands, PROFILE, ACTION, OP_CLASS, OP_KIND } = FoodCommands;

export { PROFILE, OP_CLASS, OP_KIND };
export const FOOD_SCHEMA_VERSION = LOCAL_ERA_SCHEMA_VERSION;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/* The read-back. The accepted client publishes no face for a food day (the same seam
   the check-in named S1), so the rows come out of the durable generation the
   repository has just authenticated, as a FILTER and never an interpretation: this
   lane's class and profile are what keep a weigh-in, a workout set, a check-in and a
   first run out of the list. Order is the log's own - device sequence, then op id -
   which is what makes "the last row for a date" a fact about the log rather than about
   the order this page happened to read it in. */
export function foodDaysIn(generation, profile = PROFILE) {
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

export async function createFoodHost({ day, indexedDB, crypto, era: given,
  databaseName = DATABASE, namespace = NAMESPACE } = {}) {
  if (typeof day !== 'string' || !DAY_RE.test(day)) throw new TypeError('createFoodHost requires day');
  const era = given || await openTodayHosts({ indexedDB, crypto, databaseName, namespace, day });
  try {
    const bindings = await era.client.hostBindings({ workoutCommands: createFoodCommands(),
      clock: clientClockFor(day) });
    const lease = (await bindings.repository.load()).generation.metadata.authorityLease;
    const foodClient = createDurablePublicClient({ ...bindings,
      schemaVersion: LOCAL_ERA_SCHEMA_VERSION });
    const opened = await foodClient.reopen();
    let alive = true;

    const handle = {
      repository: bindings.repository, client: foodClient, day, namespace, databaseName, lease,
      athleteId: era.athleteId, deviceId: era.deviceId,
      device: null, deviceKeyCustody: 'local-keys.mjs',
      openedRefusal: opened && opened.refusal ? { ...opened.refusal } : null,
      async all() { return foodDaysIn((await bindings.repository.load()).generation, PROFILE); },
      async forDate(date) {
        if (typeof date !== 'string' || !DAY_RE.test(date)) throw new TypeError('forDate requires a date');
        return (await handle.all()).filter((row) => row.date === date);
      },
      /* ONE op per save, and a correction is a NEW op (N1 brief section 3). Nothing
         is updated and nothing is deleted; the projector decides which op wins. */
      async save(dayValues) {
        if (!alive) return { ok: false, state: 3, copy: null, code: 'LOCAL_CLIENT_CLOSED', op_id: null };
        let result;
        try {
          result = await foodClient.execute('workout', { action: ACTION, input: { day: dayValues } });
        } catch (error) {
          const code = (error && error.message) || 'FOOD_WRITE_REFUSED';
          return { ok: false, state: 3, copy: null, code, op_id: null };
        }
        return { ok: result.acknowledged === true, state: result.state, copy: result.copy,
          code: result.code || null, op_id: result.op_id || null };
      },
      async restart() { return foodClient.reopen(); },
      face() { const current = foodClient.current(); return current && current.view ? current.view : null; },
      /* Detaches this host and releases its share of the installation, exactly as the
         other four lanes do. The last holder out closes the client. */
      close() { alive = false; if (!given) era.close(); },
    };
    return Object.freeze(handle);
  } catch (error) { if (!given) era.close(); throw error; }
}

export default { createFoodHost, foodDaysIn, PROFILE, OP_CLASS, OP_KIND, FOOD_SCHEMA_VERSION };
