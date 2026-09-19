/* EW2 SPIKE SUPPORT - throwaway. A copy of durable-host.test.mjs's scaffold with
   knobs the measurement needs: the tag collaborators can be withheld, the basis
   can be left UNPROJECTED (what today-entry.mjs really hands over), the clock can
   be the real clientClockFor, and every durable repository.load() is counted.
   Nothing here is product code and nothing here ships. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash, webcrypto } from 'node:crypto';
import { openLocalDurableClient } from '../../../m3/w6/local/local-client.mjs';
import { createDurablePublicClient } from '../../../m3/w6/public-client.mjs';
import { createSetupCommands } from '../../../m3/w7-preview/today/setup-commands.mjs';
import { ENGINE_MG, REGION_MG } from '../../../m3/w7-preview/today/exercise-catalogue.mjs';
import { createPlanEditHost } from '../../../m3/w6/host/plan-edit-host.mjs';
import { clientClockFor } from '../../../m3/w6/local/today-bindings.mjs';

const require = createRequire(import.meta.url);
const w6Require = createRequire(new URL('../../../m3/w6/package.json', import.meta.url));
export const { IDBFactory } = w6Require('fake-indexeddb');
export const { createCleanInitState } = require('../../../m4/workout/athlete-state.cjs');
export const Model = require('../../../m4/workout/plan-edit-model.cjs');
export const Commands = require('../../../m4/workout/plan-edit-commands.cjs');
export const tagProjector = require('./f2-tag-adapter.cjs')
  .createSetupTagProjector({ taxonomy: { muscles: ENGINE_MG, regions: REGION_MG } });
export { createPlanEditHost, clientClockFor };

export const DAY = '2026-09-14', NEXT = '2026-09-15', DB = 'w6-ew2-spike';
export const hashBasis = text => createHash('sha256').update(text, 'utf8').digest('hex');
export const EX = (id, day, mg) => ({ id, n: 'Synthetic ' + id, day, mg, sets: 2, hi: 9,
  inc: 2.75, steps: [11, 13.75, 16.5] });
export const setup = () => ({ athlete_label: 'synthetic-plan-edit-durable',
  split: { from: DAY, map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'L', 5: 'REST', 6: 'REST' } },
  exercises: [EX('press-old', 'U', 'chest'), EX('row-old', 'U', 'back'), EX('squat-old', 'L', 'quads')],
  priority_muscles: ['chest', 'quads'] });

/* WHERE a refusal was raised. plan-edit-commands.cjs:5 mints every TypeError, so
   the frame that MATTERS is the first one above it. Reported as file:line. */
export function raisedAt(error, depth = 4) {
  return String(error?.stack || '').split('\n').slice(1, 1 + depth)
    .map(line => (line.match(/\(?([^()\s]+\/(?:rebuild)\/[^():\s]+:\d+:\d+)\)?/) || [, line.trim()])[1])
    .map(s => s.replace(/^.*\/rebuild\//, 'rebuild/'));
}
export function caught(fn) {
  try { return { ok: true, value: fn() }; }
  catch (error) { return { ok: false, code: error.code || error.message, at: raisedAt(error) }; }
}
export async function caughtAsync(fn) {
  try { return { ok: true, value: await fn() }; }
  catch (error) { return { ok: false, code: error.code || error.message, at: raisedAt(error) }; }
}

export async function scaffold({ indexedDB = new IDBFactory(), projectBasis = true, tag = 'a',
  document: customDocument = null, day = null } = {}) {
  const DAY0 = day || DAY;
  const time = { iso: DAY0 + 'T12:00:00.000Z' }, live = { day: null };
  const clock = { now: () => time.iso, today: () => time.iso.slice(0, 10), tz: '+00:00', monotonicMs: () => 0 };
  const options = { indexedDB, crypto: webcrypto, databaseName: DB + '-' + tag,
    namespace: 'synthetic-plan-edit/device-A', athleteId: 'synthetic-plan-edit-athlete',
    deviceId: 'synthetic-plan-edit-device', clock };
  let client = await openLocalDurableClient(options), serial = 0;
  assert.equal((await client.enroll()).enrolled, true);
  assert.equal((await client.boot()).ready, true);
  const bindings = await client.hostBindings({ workoutCommands: createSetupCommands(), clock });
  const repository = bindings.repository;
  const setupClient = createDurablePublicClient({ ...bindings, schemaVersion: 2 });
  assert.equal((await setupClient.reopen()).refusal, null);
  const document = customDocument || setup();
  const tags = Object.fromEntries(document.exercises.map(ex => [ex.id, { head: null, secondary: [] }]));
  const first = await setupClient.execute('workout', { action: 'first-run-setup', input: { setup: document, tags } });
  assert.equal(first.acknowledged, true, first.code);
  const setupOperation = (await repository.load()).generation.collections.ops[first.op_id];
  /* THE TWO BASES THE PRODUCT CAN HAND OVER.
     rawBasis  = today-entry.mjs:127-130 setup.athleteState() -> createCleanInitState({setup}).
     taggedBasis = the same state with F2's projectSetupTags run over it (what the
     lane cells and the two Astra annexes build, and what NO product path builds). */
  const rawBasis = createCleanInitState({ setup: document });
  const taggedBasis = tagProjector.projectSetupTags(createCleanInitState({ setup: document }),
    { setup: document, tags, op_id: setupOperation.op_id, date: DAY0 });
  const basisState = projectBasis ? taggedBasis : rawBasis;
  const handles = [];
  const reads = { load: 0 };
  const hooks = { afterCommit: null };
  const adapter = () => ({ async hostBindings(o) {
    const real = await client.hostBindings(o);
    return { ...real, repository: { ...real.repository,
      async load(...args) { reads.load++; return real.repository.load(...args); },
      async commit(...args) { const out = await real.repository.commit(...args); if (hooks.afterCommit) await hooks.afterCommit(out); return out; } } };
  } });
  async function host(override = {}) {
    // Object.assign, not a destructuring default: a cell must be able to withhold
    // a collaborator by passing it EXPLICITLY undefined.
    const args = { client: adapter(), clock, basisState,
      setupOperation, validateTags: tagProjector.validateExerciseTags,
      projectNewExerciseTags: tagProjector.projectNewExerciseTags,
      athleteLabel: document.athlete_label, namespace: options.namespace,
      liveDay: () => (live.day === null ? time.iso.slice(0, 10) : live.day),
      newIntentId: () => 'ew2-spike-intent-' + (++serial) };
    Object.assign(args, override);
    const handle = await createPlanEditHost(args);
    handles.push(handle); return handle;
  }
  return { host, hooks, clock, time, live, reads, setupOperation, basisState, rawBasis, taggedBasis,
    document, tags, options, indexedDB, repository, DAY0,
    snapshot: () => repository.load(),
    async generation() { return (await repository.load()).generation; },
    async tamper(mutator) { const before = await repository.load(), next = structuredClone(before.generation);
      mutator(next); await repository.commit(before, next, () => null); },
    close() { handles.forEach(h => h.close()); client.close(); } };
}

/* PE16's own admitted-import builder, lifted verbatim from durable-host.test.mjs.
   NOTE FOR THE TABLE: this makes an IMPORTED installation inside the farm, with
   no sealed bundle and no port. */
export function admitState(generation, state, { namespace, selection = 'local-source:synthetic-plan-edit' } = {}) {
  const basis = { profile: 'earned/local-source-basis/v1', installation_id: namespace, local_selection_id: selection };
  generation.metadata.localSources = { selections: { [selection]: { id: selection } }, active: selection };
  generation.metadata.localSourceApplication = { selection_id: selection, core_complete: true, basis: structuredClone(basis) };
  generation.collections.derived = { localSource: { basis: structuredClone(basis),
    view: { ready: true, pending: false, issues: [], basis: structuredClone(basis), state: structuredClone(state) } } };
}
export function importedOf(basisState) {
  const imported = structuredClone(basisState);
  imported.exercises[0].n = 'Flat bench';
  imported.exercises[0].renames = [{ from: '2026-08-20', prevN: 'Bench press' }];
  imported.reads = [{ d: '2026-08-01', w: 181.2 }];
  return imported;
}
export const update = (changes, exercise_id = 'press-old') => ({ kind: 'update', exercise_id, changes });
export const addEdit = (id = 'new-lift') => ({ kind: 'add',
  exercise: { ...EX(id, 'U', 'chest') }, tags: { head: null, secondary: [] } });
export const replaceEdit = (id = 'new-press') => ({ kind: 'replace', exercise_id: 'press-old',
  exercise: { ...EX(id, 'U', 'chest') }, tags: { head: null, secondary: [] } });
export const removeEdit = (exercise_id = 'row-old') => ({ kind: 'remove', exercise_id });
