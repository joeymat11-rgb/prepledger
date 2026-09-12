// setup-host.mjs - A4's durable lane, which is the SAME lane the weigh-in, the
// workout and the recovery check-in are in (C4c, DECISIONS:106 b / :111).
//
// This module binds and does not invent. There is no repository here, no lease
// minted here, no enrolment asserted here and no device key taken here: it opens
// this device's installation (or takes an injected one) and asks it for a setup
// host. The ONE thing this lane genuinely supplies is its command producer
// (./setup-commands.mjs) and the profile its fact carries, both passed as
// arguments so that w6 never depends on this page.
//
// RESTORE-REQUIRED NEVER RE-ENROLS (BUILD-BRIEF 2.3, S14). Opening the era is what
// refuses a damaged installation, with C1's own state 18 and code; this module adds
// nothing to that and offers no second path. First run is the other side of the
// same call: C1 enrols only when it observed all three signals absent.
import { openTodayHosts, DATABASE, NAMESPACE } from './gym-host.mjs';
import { createSetupCommands, PROFILE, SETUP_SCHEMA_VERSION } from './setup-commands.mjs';

export { PROFILE, SETUP_SCHEMA_VERSION };

export async function createSetupHost({ day, indexedDB, crypto, deviceKeys,
  databaseName = DATABASE, namespace = NAMESPACE } = {}) {
  const era = await openTodayHosts({ indexedDB, crypto, databaseName, namespace, day });
  try {
    const handle = await era.createSetupHost({ day,
      commands: createSetupCommands(), profile: PROFILE,
      ...(deviceKeys !== undefined ? { deviceKeys } : {}) });
    return Object.freeze({ ...handle, athleteId: era.athleteId, deviceId: era.deviceId,
      /* Detaches this host and releases its share of the installation. The other
         three lanes, if they are holding one too, keep the store open. */
      close() { handle.close(); era.close(); } });
  } catch (error) { era.close(); throw error; }
}

export default { createSetupHost, PROFILE, SETUP_SCHEMA_VERSION };
