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
      device_seq: op.device_seq || 0,
      savedDate: op.effective.local_date,
      savedTime: op.effective.local_time || null,
      savedOffset: op.effective.utc_offset || null,
      night: JSON.parse(JSON.stringify(op.payload.night)),
    }));
}

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
      async all() { return sleepNightsIn((await bindings.repository.load()).generation, PROFILE); },
      async forDate(date) {
        if (typeof date !== 'string' || !DAY_RE.test(date)) throw new TypeError('forDate requires a date');
        return (await handle.all()).filter((row) => row.night.date === date);
      },
      /* ONE op per save, and a correction is a NEW op (N2 brief). Nothing is updated
         and nothing is deleted; the projector decides which op wins. */
      async save(night) {
        if (!alive) return { ok: false, state: 3, copy: null, code: 'LOCAL_CLIENT_CLOSED', op_id: null };
        let result;
        try {
          result = await sleepClient.execute('workout', { action: ACTION, input: { night } });
        } catch (error) {
          const code = (error && error.message) || 'SLEEP_WRITE_REFUSED';
          return { ok: false, state: 3, copy: null, code, op_id: null };
        }
        return { ok: result.acknowledged === true, state: result.state, copy: result.copy,
          code: result.code || null, op_id: result.op_id || null };
      },
      async restart() { return sleepClient.reopen(); },
      face() { const current = sleepClient.current(); return current && current.view ? current.view : null; },
      close() { alive = false; if (!given) era.close(); },
    };
    return Object.freeze(handle);
  } catch (error) { if (!given) era.close(); throw error; }
}

export default { createSleepHost, sleepNightsIn, PROFILE, OP_CLASS, OP_KIND, SLEEP_SCHEMA_VERSION };
