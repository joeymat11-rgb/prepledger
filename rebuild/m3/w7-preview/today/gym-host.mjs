// gym-host.mjs — ONE STORE (C4b). The page's workout host, over THIS DEVICE'S
// OWN LOCAL ERA, and nothing else.
//
// WHAT THIS FILE USED TO BE, and why it is not that any more. It minted the
// page's whole enrolment: a constant identity key, a static enrolment evidence
// string that any partial erasure would silently re-enrol over, an AES/P-256
// device key pair, a never-renewed fixed-window lease, and a SECOND encrypted
// generation beside the weigh-in's — because one generation carries one lease
// with one schema_version. Lane C's accepted local era (rebuild/m3/w6/local/)
// answers every one of those, and the schema question turned out to be about
// the CLIENT, not the store: rebuild/client gates only a WORKOUT on the lease
// schema (index.cjs:206), so a schema-1 reading rides the era's schema-2 lease
// into the SAME generation through C1's bridge. The proof is
// rebuild/m3/w6/test/local-schema-probe.mjs; the composition is
// rebuild/m3/w6/local/today-bindings.mjs.
//
// So this module now binds and does not invent — and there is nothing synthetic
// left in it to label. No key is generated here, no lease is signed here, no
// enrolment evidence is asserted here, and there is no second generation.
//
// THE PAGE'S IDENTITY. One installation per (indexedDB, database, namespace),
// memoized and reference-counted by openTodayInstallation so that the weigh-in
// host, the gym card and the transient host used to retire an abandoned session
// all hold the SAME client. The athlete is "owner" (one athlete on one phone,
// until Dad's A4 first-run setup names a second). The device id is minted once
// at random and kept in the key database beside the non-extractable store key
// (local-keys.mjs openLocalDeviceIdentity), because the era's sealed lease names
// a device and refuses any other.
import { openTodayInstallation, causalTips, startOrderRefusalOf,
  TODAY_DATABASE, TODAY_NAMESPACE, TODAY_ATHLETE,
  PLAN_BASIS, INPUT_BASIS, RESUME_REASON, PRODUCER } from '../../w6/local/today-bindings.mjs';

/* Re-exported, not restated: the causal frontier functions, the producer
   identity and the basis labels are the local era's own, so there is exactly one
   copy of each in the tree and `GymHost.causalTips === causalTips` is an
   identity rather than a source comparison. */
export { causalTips, startOrderRefusalOf, PLAN_BASIS, INPUT_BASIS, RESUME_REASON, PRODUCER };
/* rebuild/client's own words for a state-18 refusal, carried through w6 so the
   page never writes its own sentence for one. */
export { RESTORE_REQUIRED } from '../../w6/local/today-bindings.mjs';

export const DATABASE = TODAY_DATABASE;
export const NAMESPACE = TODAY_NAMESPACE;
export const ATHLETE_ID = TODAY_ATHLETE;

/* THE PAGE'S INSTALLATION. Every host in this page comes from one of these, and
   close() detaches one holder — the last one out closes the client, which is
   what makes the next open a real relaunch off disk. */
export function openTodayHosts({ indexedDB, crypto, databaseName = DATABASE,
  namespace = NAMESPACE, athleteId = ATHLETE_ID, deviceId, day, clock } = {}) {
  /* The installation's clock is the PAGE'S OWN DAY, exactly as this module's
     stage clock always was (`day + 'T13:00:00.000Z'`) — the page's day is its
     today, and an operation has to be stamped on the day the screen is standing
     on or the accepted resume policy reads yesterday's open session as
     unfinished. `day` is passed AS A DAY, not pre-baked into a clock, so that a
     later boot in the same page load (day 2) is ADOPTED and recorded on
     `clockAdoptions()` rather than silently dropped — C4b review D1. */
  return openTodayInstallation({ indexedDB, crypto, databaseName, namespace, athleteId, deviceId,
    day: typeof day === 'string' ? day : undefined, ...(clock ? { clock } : {}) });
}

/* A handle that owns its share of the installation: closing it detaches the
   host AND releases the installation holder it was opened with. Callers that
   already hold an installation (today-entry.mjs boot(), which opens one and
   passes it to both hosts) never come through here. */
function owning(era, handle) {
  return Object.freeze({ ...handle, athleteId: era.athleteId, deviceId: era.deviceId,
    close() { handle.close(); era.close(); } });
}

export async function createGymHost({ day, engineState, plannedSplitSlotId,
  indexedDB, crypto, deviceKeys, databaseName = DATABASE, namespace = NAMESPACE } = {}) {
  const era = await openTodayHosts({ indexedDB, crypto, databaseName, namespace, day });
  try {
    return owning(era, await era.createGymHost({ day, engineState, plannedSplitSlotId,
      ...(deviceKeys !== undefined ? { deviceKeys } : {}) }));
  } catch (error) { era.close(); throw error; }
}
