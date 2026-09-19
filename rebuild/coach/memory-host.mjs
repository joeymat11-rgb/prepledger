// memory-host.mjs - the coach's durable lane for `earned/coach-memory/v1`.
//
// It is createMachineSettingsHost's lane, opened the same way and for the same
// reason (local-world.mjs:147-195). `workout` is the only producer-injected
// command the accepted stage takes, and `client.hostBindings({ workoutCommands })`
// is where a lane hands its own producer in. So this factory supplies
// memory-commands.cjs and the profile its facts carry, and NOTHING under
// rebuild/m3, rebuild/m4 or rebuild/client is touched to make it work.
//
// IT IS THIS INSTALLATION'S. The same repository, the same lease, the same one
// generation the weigh-in, the workout and the machine settings are in, and a
// fresh hostBindings() like the gym card's so the lanes serialise on the
// repository's own compare-and-swap rather than sharing staging state. There is
// no second database, no second enrolment and no synthetic identity here: this
// host takes an ALREADY OPEN client and refuses to be given anything else.
//
// NO CLOCK. This module declares none, so the installation's own clock stamps
// the operation: the era's day and the era's offset, never the process's and
// never a second one invented here. It is the same posture sleep-host.mjs and
// machine-settings-host.mjs already take, and a cell scans this file to prove it.
//
// ABSENCE AND UNREADABILITY ARE DIFFERENT ANSWERS. read() returns the rows from
// the AUTHENTICATED view, or a named refusal. It never answers an empty list for
// a store it could not read: the athlete is told which of the two happened.
import { createDurablePublicClient } from '../m3/w6/public-client.mjs';
import { LOCAL_ERA_SCHEMA_VERSION } from '../m3/w6/local/local-era.mjs';
import Memory from './memory-commands.cjs';

const { createMemoryCommands, readMemories, memoriesIn, forTopic, PROFILE, ACTION } = Memory;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export { PROFILE, ACTION, readMemories, memoriesIn, forTopic };
export const MEMORY_SCHEMA_VERSION = LOCAL_ERA_SCHEMA_VERSION;

export async function createMemoryHost({ client, day } = {}) {
  if (!client || typeof client.hostBindings !== 'function') {
    throw new TypeError('createMemoryHost requires the local durable client');
  }
  if (typeof day !== 'string' || !DAY_RE.test(day)) {
    throw new TypeError('createMemoryHost requires day');
  }
  const bindings = await client.hostBindings({ workoutCommands: createMemoryCommands() });
  const laneClient = createDurablePublicClient({ ...bindings, schemaVersion: LOCAL_ERA_SCHEMA_VERSION });
  const opened = await laneClient.reopen();
  let alive = true;

  const handle = Object.freeze({
    repository: bindings.repository, client: laneClient, day, profile: PROFILE,
    openedRefusal: opened && opened.refusal ? { ...opened.refusal } : null,

    /* THE AUTHENTICATED VIEW, or a named refusal. The repository's own load()
       is what authenticates; a store it will not vouch for throws its own code
       here and that code travels, rather than becoming an empty list.
       `skipped` is the number of memory operations in the authenticated view
       that the producer's OWN gate refused (P-F3). It is part of the answer: a
       view with nothing to show and rows it could not read is not the same
       answer as a view with nothing in it. */
    async read() {
      if (!alive) return { ok: false, code: 'LOCAL_CLIENT_CLOSED', copy: null, rows: null, skipped: null };
      let loaded;
      try { loaded = await bindings.repository.load(); }
      catch (error) {
        return { ok: false, rows: null, skipped: null,
          code: (error && error.code) || 'COACH_MEMORY_STORE_UNREADABLE',
          copy: (error && error.message) || null };
      }
      const view = readMemories(loaded.generation);
      return { ok: true, code: null, copy: null, rows: view.rows, skipped: view.skipped };
    },

    /* Every stored memory in this generation, oldest first. It THROWS when the
       store cannot be authenticated, because a caller that wanted a list and got
       one must be able to trust it. */
    async all() {
      const read = await handle.read();
      if (!read.ok) { const error = new Error(read.code); error.code = read.code; throw error; }
      return read.rows;
    },

    /* One topic, through the producer's own topic rule. `rows: null` means the
       topic itself was not a topic, which is not the same as no memories. */
    async forTopic(topic) {
      const read = await handle.read();
      if (!read.ok) return read;
      const rows = forTopic(read.rows, topic);
      return rows === null
        ? { ok: false, code: 'COACH_MEMORY_TOPIC_REQUIRED', copy: null, rows: null, skipped: read.skipped }
        : { ok: true, code: null, copy: null, rows, skipped: read.skipped };
    },

    /* ONE op per confirmed memory. The request goes through the producer
       untouched: this file adds no member, normalises no word and stamps no
       date. A producer refusal or a storage refusal comes back as the accepted
       layer's OWN code and copy, never a friendlier sentence invented here. */
    async save(memory, options = {}) {
      if (!alive) return { ok: false, state: 3, copy: null, code: 'LOCAL_CLIENT_CLOSED', op_id: null };
      const input = { memory };
      if (options && options.parents !== undefined) input.parents = options.parents;
      let result;
      try { result = await laneClient.execute('workout', { action: ACTION, input }); }
      catch (error) {
        return { ok: false, state: 3, copy: null,
          code: (error && error.message) || 'COACH_MEMORY_WRITE_REFUSED', op_id: null };
      }
      return { ok: result.acknowledged === true, state: result.state, copy: result.copy,
        code: result.code || null, op_id: result.op_id || null };
    },

    async restart() { return laneClient.reopen(); },
    face() { const current = laneClient.current(); return current && current.view ? current.view : null; },
    // Detaches THIS handle only, exactly as the other lanes' close() does.
    close() { alive = false; },
  });
  return handle;
}

export default { createMemoryHost, readMemories, memoriesIn, forTopic, PROFILE, ACTION, MEMORY_SCHEMA_VERSION };
