import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { prepare } from '../../../m3/w7-preview/today/setup-commands.mjs';
import { ENGINE_MG, REGION_MG } from '../../../m3/w7-preview/today/exercise-catalogue.mjs';
const require = createRequire(import.meta.url);
const { createSetupTagProjector } = require('../../../m4/workout/setup-tags.cjs');
const { loadProduct, setup, exercise, DAY } = require('./product-fixture.cjs');
const P = loadProduct(), E = P.engine(), projector = createSetupTagProjector({ taxonomy: { muscles: ENGINE_MG, regions: REGION_MG } });
const slp = { clean: true, last: 8, mean3: 8, debt: 0, over: 0 };
function saved() {
  const document = setup({ 1: 'F', 4: 'F' }, [exercise('renamed-pull', 'U', 3, 'back'),
    exercise('press', 'U', 1, 'chest'), exercise('hinge', 'L', 2, 'hams')]);
  const tags = { 'renamed-pull': { head: 'upper_back', secondary: [{ mg: 'biceps', lend: 0.5 }] },
    press: { head: null, secondary: [] }, hinge: { head: 'hams', secondary: [{ mg: 'back', lend: 0.25 }] } };
  const action = prepare({ action: 'first-run-setup', input: { setup: document, tags } });
  // This is the real producer followed by a serialization boundary, NOT a claim
  // of C's repository/Today companion, native history or phone integration.
  return JSON.parse(JSON.stringify(action));
}
function project(action) {
  const { setup, tags } = action.payload;
  return projector.projectSetupTags(P.createCleanInitState({ setup }), { setup, tags, op_id: 'synthetic-prepared-setup', date: DAY });
}
test('F2 composed producer snapshot -> projector -> engine, including [] and unresolved quarter credit', () => {
  const action = saved(), before = JSON.stringify(action), state = project(action);
  const rows = E.programmeVolume(state);
  const value = mg => rows.find(row => row.mg === mg);
  assert.equal(value('upper_back').sets, 6); assert.equal(value('biceps').sets, 3);
  assert.equal(value('chest').sets, 2); assert.equal(value('hams').sets, 4);
  assert.equal(value('back').sets, 1); assert.equal(value('back').qualified, false);
  assert.equal(value('back').zone, null); assert.equal(value('back').tier, null);
  assert.equal(value('triceps'), undefined); assert.equal(value('delts_front'), undefined);
  assert.equal(JSON.stringify(action), before); assert.equal(Object.isFrozen(state), true);
});
test('F2 enriched fresh basis preserves generated target slots, loads, histories and caller bytes', () => {
  const action = saved(), clean = P.createCleanInitState({ setup: action.payload.setup });
  const enriched = project(action), before = JSON.stringify(enriched);
  const slots = state => P.host(DAY).genSession(state, DAY, slp).ex.map(ex => ({ id: ex.id, tgt: ex.tgt }));
  assert.deepEqual(slots(enriched), slots(clean));
  assert.equal(slots(enriched).reduce((n, ex) => n + ex.tgt.length, 0), 6);
  for (const key of ['reads','sessionLog','dailyLogs','queue','sleep']) assert.deepEqual(enriched[key], clean[key]);
  assert.deepEqual(enriched.exercises.map(ex => ex.w), [null,null,null]);
  assert.equal(JSON.stringify(enriched), before);
});
test('F2 metadata stays with saved ids when source order and new authoring values change', () => {
  const action = saved(), old = project(action);
  action.payload.setup.exercises.reverse();
  const reordered = project(action);
  assert.deepEqual(E.programmeVolume(reordered).map(r => [r.mg,r.sets]), E.programmeVolume(old).map(r => [r.mg,r.sets]));
  action.payload.tags['renamed-pull'].secondary = [];
  const future = project(action);
  assert.equal(E.programmeVolume(future).some(r => r.mg === 'biceps'), false);
  assert.equal(E.programmeVolume(old).find(r => r.mg === 'biceps').sets, 3);
});
