// machine-settings-host.mjs - the gym card's durable lane for
// `earned/machine-settings/v1`, which is the SAME store the weigh-in, the workout, the
// check-in and the first run are in (C4c, DECISIONS:106 b): one sealed generation of
// this device's local era, one lease, one device sequence.
//
// ONE WRITE PATH, AND IT IS NOT THIS FILE'S (brief section 2). The producer, the caps,
// the profile string, the at-least-one-answer rule, the read-back filter and the
// latest-wins rule all live in rebuild/coach/machine-settings-commands.cjs and are
// IMPORTED here. This module declares no shape of its own: a second validator or a
// "gym-card flavour" of the payload is exactly the defect mutants S-M4 and S-M5 exist
// to catch, and there is nothing here for them to mutate.
//
// WHY THIS LANE OPENS ITSELF INSTEAD OF ASKING W6 FOR A FACTORY. The other four lanes
// are opened by today-entry.mjs boot() through rebuild/m3/w6/local/today-bindings.mjs.
// today-entry.mjs is sha-pinned by local-today-journey.test.mjs PAGE_PINS and
// today-bindings.mjs is pinned ON DISK by the merged B-NTC artifact (DECISIONS:144,
// rebuild/conform/v4/postfix/legacy-gates.cjs:12-16), so a fifth factory cannot be
// added to either until DECISIONS:154 (5) unpins them. This lane therefore takes the
// same honest extension point setup-host.mjs and the coach's machine-settings lane
// use: the era's own client, and `client.hostBindings({ workoutCommands })`
// (rebuild/m3/w6/local/local-client.mjs:395). Every piece below is w6's or the
// accepted client's - the era, the repository, the lease, the durable public client,
// the schema version. The ONE thing this lane supplies is the coach's producer.
//
// AND WHY IT IS NOT rebuild/coach/local-world.mjs's createMachineSettingsHost, which
// opens the identical lane over the identical producer. That module also composes the
// whole coach world, and one of its requires is rebuild/m4/workout/engine-runtime.cjs -
// which build.mjs FORBIDS in this page's graph by name (its single non-literal require
// glob-expands over the whole of rebuild/engine, dragging seed/migrate/merge/index and
// the Node-only test harnesses into the bundle). Importing the coach's host would
// therefore turn the page build red. The thirty lines below are that duplication, and
// it is deliberately kept to the OPENING of the lane: the op, the caps, the profile,
// the read-back and the latest-wins rule are one definition, imported, and a test
// asserts the op this file writes is byte-identical to the op the coach's tool writes
// for the same answer.
//
// NO SECOND CLOCK EITHER (FOOD-LIVE-SAVE). This lane used to hand hostBindings a
// `clientClockFor(day)` built with no live instant provider, which is the PINNED
// PREVIEW instant (day + 'T13:00:00.000Z', -05:00). On the shipped build the
// installation is opened LIVE (S4, DECISIONS:455-457) and its write lease is issued
// not_before the real instant the installation was opened, so 13:00Z on that day fell
// OUTSIDE the window and every machine note was refused state 20 with nothing
// written. This lane still says nothing about how an installation begins. The
// instant half of a host's clock is the installation's to answer, never this file's;
// `live` lives inside the installation and today-bindings.mjs is pinned on disk, so
// the way a lane outside it says "use the era's own clock" is to declare none - which
// is what sleep-host.mjs and measure/measure-host.mjs already do. The DAY half is
// unchanged: openTodayHosts passes this host's `day` to the installation, which adopts
// it and reports it on clockAdoptions(), so clock.today() is still this host's day.
import { openTodayHosts, DATABASE, NAMESPACE } from './gym-host.mjs';
import { createDurablePublicClient } from '../../w6/public-client.mjs';
import { LOCAL_ERA_SCHEMA_VERSION } from '../../w6/local/local-era.mjs';
import MachineSettings from '../../../coach/machine-settings-commands.cjs';

const { createMachineSettingsCommands, machineSettingsIn, latestFor, PROFILE, ACTION,
  MACHINE_SETTINGS_SCHEMA_VERSION, EXERCISE_ID_MAX, SETTINGS_MAX, SETTING_TEXT_MAX, TEXT_MAX } = MachineSettings;

export { PROFILE, ACTION, MACHINE_SETTINGS_SCHEMA_VERSION, machineSettingsIn, latestFor,
  EXERCISE_ID_MAX, SETTINGS_MAX, SETTING_TEXT_MAX, TEXT_MAX };
export const SETTINGS_SCHEMA_VERSION = LOCAL_ERA_SCHEMA_VERSION;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function createMachineSettingsHost({ day, indexedDB, crypto, era: given,
  databaseName = DATABASE, namespace = NAMESPACE } = {}) {
  if (typeof day !== 'string' || !DAY_RE.test(day)) throw new TypeError('createMachineSettingsHost requires day');
  const era = given || await openTodayHosts({ indexedDB, crypto, databaseName, namespace, day });
  try {
    /* NO `clock` HERE (FOOD-LIVE-SAVE): with none declared host-bindings.mjs:244 uses
       `scope.clock`, the installation's own, so this lane stamps the era's instant and
       the era's offset - live on the shipped build, byte-for-byte the pinned preview
       instant on every declared-day fixture. */
    const bindings = await era.client.hostBindings({ workoutCommands: createMachineSettingsCommands() });
    const lease = (await bindings.repository.load()).generation.metadata.authorityLease;
    const client = createDurablePublicClient({ ...bindings, schemaVersion: LOCAL_ERA_SCHEMA_VERSION });
    const opened = await client.reopen();
    let alive = true;

    const handle = {
      repository: bindings.repository, client, day, namespace, databaseName, lease,
      athleteId: era.athleteId, deviceId: era.deviceId,
      openedRefusal: opened && opened.refusal ? { ...opened.refusal } : null,
      /* Every machine-settings fact in the one generation, in the log's own order.
         The filter is the coach's, imported, so the two halves of wave one cannot
         disagree about what a machine-settings op is. */
      async all() { return machineSettingsIn((await bindings.repository.load()).generation); },
      /* THE LATEST for one exercise id, decided by the coach's own `latestFor`. Null
         means this device holds nothing for this lift, which is a fact the screen
         says in words rather than a zero it invents. */
      async latest(exercise_id) { return latestFor(await handle.all(), exercise_id); },
      /* ONE op per change (brief section 2). Nothing is updated and nothing is
         deleted; the reader takes the latest. The request goes through the coach's
         producer untouched - this file adds no member and normalises no word. */
      async save(machine) {
        if (!alive) return { ok: false, state: 3, copy: null, code: 'LOCAL_CLIENT_CLOSED', op_id: null };
        let result;
        try {
          result = await client.execute('workout', { action: ACTION, input: { machine } });
        } catch (error) {
          const code = (error && error.message) || 'MACHINE_SETTINGS_WRITE_REFUSED';
          return { ok: false, state: 3, copy: null, code, op_id: null };
        }
        return { ok: result.acknowledged === true, state: result.state, copy: result.copy,
          code: result.code || null, op_id: result.op_id || null };
      },
      async restart() { return client.reopen(); },
      close() { alive = false; if (!given) era.close(); },
    };
    return Object.freeze(handle);
  } catch (error) { if (!given) era.close(); throw error; }
}

export default { createMachineSettingsHost, machineSettingsIn, latestFor, PROFILE, ACTION,
  SETTINGS_SCHEMA_VERSION, EXERCISE_ID_MAX, SETTINGS_MAX, SETTING_TEXT_MAX, TEXT_MAX };
