// reading-host.mjs — ONE STORE (C4b). The morning weigh-in's durable store of
// record, which is now the SAME store the workout is in.
//
// A1 kept the weigh-in in localStorage. Review B2 executed a real `taskkill /F
// /T` and found what that costs: Chromium buffers localStorage in the renderer
// and flushes it asynchronously, so a hard kill (which is exactly what iOS tab
// termination is) loses recent readings while the encrypted IndexedDB workout
// survives. So the store of record moved into the accepted encrypted repository.
//
// WHY IT IS NO LONGER A SECOND REPOSITORY. This file used to open its own
// generation, and said why: one generation carries ONE authority lease with ONE
// schema_version, and rebuild/client stamps a reading `schema_version: 1` and a
// workout `schema_version: 2`. That is true of the PUBLIC client and false of
// the store. rebuild/client/index.cjs:206 gates only a WORKOUT on the lease
// schema (`if (workout && cfg.lease.schema_version !== 2)`); a reading is not
// gated at all, so it rides the local era's schema-2 lease into the SAME sealed
// generation through C1's bridge. Executed, not assumed:
// rebuild/m3/w6/test/local-schema-probe.mjs, and again as cases in
// rebuild/m3/w6/test/local-today-journey.test.mjs.
//
// One installation, one generation, one checkpoint, one lease_id, TWO write
// paths — the weigh-in through the local client's execute(), the workout through
// composeWorkoutHost over the same client's hostBindings().
import { openTodayHosts, DATABASE, NAMESPACE } from './gym-host.mjs';
import { LOCAL_ERA_SCHEMA_VERSION } from '../../w6/local/local-era.mjs';

/* The schema rebuild/client stamps on a READING OPERATION (ops.cjs
   SCHEMA_VERSION = 1). It is deliberately NOT the lease's — that is
   ERA_SCHEMA_VERSION below, and the gap between the two is the whole point. */
export const READING_SCHEMA_VERSION = 1;
export const ERA_SCHEMA_VERSION = LOCAL_ERA_SCHEMA_VERSION;

export async function createReadingHost({ day, indexedDB, crypto, deviceKeys,
  databaseName = DATABASE, namespace = NAMESPACE } = {}) {
  const era = await openTodayHosts({ indexedDB, crypto, databaseName, namespace, day });
  try {
    const handle = await era.createReadingHost({ day,
      ...(deviceKeys !== undefined ? { deviceKeys } : {}) });
    return Object.freeze({ ...handle, athleteId: era.athleteId, deviceId: era.deviceId,
      /* Detaches this host and releases its share of the installation. The gym
         card, if it is holding one too, keeps the store open. */
      close() { handle.close(); era.close(); } });
  } catch (error) { era.close(); throw error; }
}
