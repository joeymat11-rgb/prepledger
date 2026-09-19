/* EW2 BUILD BRIEF, LOOP ROUND 1 FIX - THE MEASURING SCAFFOLD FOR B2.

   Throwaway. It is NOT a copy of `ew2r6-support.mjs`: that scaffold hides the
   era's durable client and its `hostBindings` inside a closure, and the fact
   under measurement here is exactly what a LANE can reach with zero product
   bytes. Every released lane on this page opens its own bindings off the ONE
   era client (`machine-settings-host.mjs:72`, `food-host.mjs:85`,
   `sleep-host.mjs:106`: `era.client.hostBindings({ workoutCommands })`), so a
   measurement that quietly opened a SECOND durable client would be measuring a
   route no lane takes. This scaffold therefore opens ONE client and hands it
   back, together with the one bindings object the host is built on.

   Nothing here is product code and nothing here ships.                       */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash, webcrypto } from 'node:crypto';
import { openLocalDurableClient } from '../../../m3/w6/local/local-client.mjs';
import { createDurablePublicClient } from '../../../m3/w6/public-client.mjs';
import { createSetupCommands } from '../../../m3/w7-preview/today/setup-commands.mjs';
import { ENGINE_MG, REGION_MG } from '../../../m3/w7-preview/today/exercise-catalogue.mjs';
import { createPlanEditHost } from '../../../m3/w6/host/plan-edit-host.mjs';

const require = createRequire(import.meta.url);
const w6Require = createRequire(new URL('../../../m3/w6/package.json', import.meta.url));
export const { IDBFactory } = w6Require('fake-indexeddb');
export const { createCleanInitState } = require('../../../m4/workout/athlete-state.cjs');
export const Model = require('../../../m4/workout/plan-edit-model.cjs');
export const Commands = require('../../../m4/workout/plan-edit-commands.cjs');
export const tagProjector = require('./f2-tag-adapter.cjs')
  .createSetupTagProjector({ taxonomy: { muscles: ENGINE_MG, regions: REGION_MG } });
export { createDurablePublicClient };

export const DAY = '2026-09-14', NEXT = '2026-09-15';
export const hashBasis = text => createHash('sha256').update(text, 'utf8').digest('hex');
const EX = (id, day, mg) => ({ id, n: 'Synthetic ' + id, day, mg, sets: 2, hi: 9,
  inc: 2.75, steps: [11, 13.75, 16.5] });
export const setup = () => ({ athlete_label: 'synthetic-plan-edit-durable',
  split: { from: DAY, map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'L', 5: 'REST', 6: 'REST' } },
  exercises: [EX('press-old', 'U', 'chest'), EX('row-old', 'U', 'back'), EX('squat-old', 'L', 'quads')],
  priority_muscles: ['chest', 'quads'] });
export const update = (changes, exercise_id = 'press-old') => ({ kind: 'update', exercise_id, changes });

export async function laneScaffold({ tag = 'b2' } = {}) {
  const time = { iso: DAY + 'T12:00:00.000Z' };
  const clock = { now: () => time.iso, today: () => time.iso.slice(0, 10), tz: '+00:00', monotonicMs: () => 0 };
  const options = { indexedDB: new IDBFactory(), crypto: webcrypto,
    databaseName: 'w6-ew2b-fix-' + tag, namespace: 'synthetic-plan-edit/device-A',
    athleteId: 'synthetic-plan-edit-athlete', deviceId: 'synthetic-plan-edit-device', clock };
  const client = await openLocalDurableClient(options);
  assert.equal((await client.enroll()).enrolled, true);
  assert.equal((await client.boot()).ready, true);

  /* THE ONE BINDINGS OBJECT, opened exactly the way every released lane opens
     its own: `era.client.hostBindings({ workoutCommands })`. Every durable
     `repository.load()` taken through it is counted. */
  const reads = { load: 0, hostLoad: 0 };
  const counted = (b, counter) => ({ ...b, repository: { ...b.repository,
    async load(...args) { reads[counter] += 1; return b.repository.load(...args); } } });
  const real = await client.hostBindings({ workoutCommands: createSetupCommands(), clock });
  const bindings = counted(real, 'load');

  const setupClient = createDurablePublicClient({ ...bindings, schemaVersion: 2 });
  assert.equal((await setupClient.reopen()).refusal, null);
  const document = setup();
  const tags = Object.fromEntries(document.exercises.map(ex => [ex.id, { head: null, secondary: [] }]));
  const first = await setupClient.execute('workout', { action: 'first-run-setup', input: { setup: document, tags } });
  assert.equal(first.acknowledged, true, first.code);
  const setupOperation = (await bindings.repository.load()).generation.collections.ops[first.op_id];
  const basisState = tagProjector.projectSetupTags(createCleanInitState({ setup: document }),
    { setup: document, tags, op_id: setupOperation.op_id, date: DAY });

  const handles = [];
  let serial = 0;
  async function host(override = {}) {
    /* The HOST opens its own bindings off the SAME era client, with its OWN
       workout commands, exactly as `createPlanEditHost` expects. Its durable
       loads are counted separately from the lane's. */
    const args = { client: { hostBindings: async (o) => counted(await client.hostBindings(o), 'hostLoad') },
      clock, basisState, setupOperation,
      validateTags: tagProjector.validateExerciseTags,
      projectNewExerciseTags: tagProjector.projectNewExerciseTags,
      athleteLabel: document.athlete_label, namespace: options.namespace,
      liveDay: () => time.iso.slice(0, 10),
      newIntentId: () => 'ew2b-fix-intent-' + (++serial) };
    Object.assign(args, override);
    const handle = await createPlanEditHost(args);
    handles.push(handle); return handle;
  }
  return { client, bindings, repository: bindings.repository, reads, clock, time, options,
    document, tags, basisState, setupOperation, host,
    async generation() { return (await bindings.repository.load()).generation; },
    async tamper(mutator) {
      const before = await bindings.repository.load(), next = structuredClone(before.generation);
      mutator(next); await bindings.repository.commit(before, next, () => null);
    },
    close() { handles.forEach(h => h.close()); client.close(); } };
}
