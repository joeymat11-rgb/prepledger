// checkin-host.mjs — the recovery check-in's durable store of record, which is
// the SAME store the weigh-in and the workout are in (C4c, DECISIONS:106 b).
//
// WHAT A3 BUILT, AND WHY IT IS NOT A THIRD GENERATION ANY MORE. A3 composed this
// lane exactly as reading-host.mjs composed the second: its own encrypted
// repository, its own self-issued lease, its own generation. Its reason was
// sound and is quoted here because it is still half true: "the check-in's
// operations are written through the client's producer-injected command, which
// the client stamps schema_version 2 — so this lane's lease is schema 2 and it
// cannot live in the reading lane (schema 1)". It cannot live in a SCHEMA-1
// lane. This device's local era carries ONE lease at schema 2
// (rebuild/m3/w6/local/local-era.mjs LOCAL_ERA_SCHEMA_VERSION), so a schema-2
// producer command rides it exactly as a workout set does, and the check-in
// belongs in the one generation the other two lanes are in — one op log, one
// checkpoint, one lease_id, one device sequence.
//
// So this module now binds and does not invent. There is no repository here, no
// lease minted here, no enrolment asserted here and no device key taken here.
// The ONE thing this lane still supplies, because it is the only thing that is
// genuinely its own, is its command producer (./checkin-commands.cjs) and the
// profile its facts carry — both passed as arguments, so that w6 never depends
// on this page.
//
// A3's read-back is unchanged in what it does: the accepted client publishes no
// face for a check-in (A3 seam S1), so the rows come out of the durable
// generation the repository just authenticated, as a FILTER and never an
// interpretation. In one generation the profile match is also what keeps a
// weigh-in and a workout set out of the list.
//
// A3's F2 is closed in the same change: causalTips() is class-scoped now
// (rebuild/m3/w6/local/today-bindings.mjs WORKOUT_ORDER_CLASS), so a check-in
// fact can never be taken as a causal tip and no Start can descend from one.
import { openTodayHosts, DATABASE, NAMESPACE } from './gym-host.mjs';
import CheckInCommands from './checkin-commands.cjs';

const { createCheckInCommands, PROFILE } = CheckInCommands;

/* The era's lease schema, which is what the check-in's producer-injected command
   is stamped with. Kept as a named export because A3's tests read it. */
export { PROFILE };
export const CHECKIN_SCHEMA_VERSION = 2;

export async function createCheckInHost({ day, indexedDB, crypto, deviceKeys,
  databaseName = DATABASE, namespace = NAMESPACE } = {}) {
  const era = await openTodayHosts({ indexedDB, crypto, databaseName, namespace, day });
  try {
    const handle = await era.createCheckInHost({ day,
      commands: createCheckInCommands(), profile: PROFILE,
      ...(deviceKeys !== undefined ? { deviceKeys } : {}) });
    return Object.freeze({ ...handle, athleteId: era.athleteId, deviceId: era.deviceId,
      /* Detaches this host and releases its share of the installation. The
         weigh-in and the gym card, if they are holding one too, keep the store
         open. */
      close() { handle.close(); era.close(); } });
  } catch (error) { era.close(); throw error; }
}

export default { createCheckInHost, CHECKIN_SCHEMA_VERSION, PROFILE };
