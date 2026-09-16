'use strict';
// TEST ONLY. All reference data below is invented from the two licensed public fixtures.
// Never imported by a production entry or used as actual C2 producer evidence.
const F = require('../../../../m3/w7-preview/fixtures.cjs');
const modules = [
  require('../../../../engine/dates.cjs'),
  require('../../../../engine/constants.cjs'),
  require('../../../../engine/performed.cjs'),
  require('../../../../engine/plan.cjs'),
  require('../../../../engine/progression.cjs'),
  require('../../../../engine/sleep.cjs'),
  require('../../../../engine/energy.cjs'),
  require('../../../../engine/policy.cjs'),
  require('../../../../engine/today.cjs'),
  require('../../../../engine/volume.cjs'),
  require('../../../../engine/migrate.cjs'),
  require('../../../../engine/earn.cjs'),
  require('../../../../engine/merge.cjs'),
  require('../../../../engine/writers.cjs'),
];
function createEngine({clock, ids, drafts, seed, history, rollups, nativeTrendContext} = {}) {
  if (!clock || typeof clock.today !== 'function') throw TypeError('Synthetic engine requires explicit clock');
  const state = F.createSyntheticState(clock.today());
  const SEED = structuredClone(seed === undefined ? {...state, exOrder: state.exercises.map(e => e.id), insertions: {fly: '2026-08-01', hipthrust: '2026-08-01'}} : seed);
  const E = {SEED, HISTORY: structuredClone(history === undefined ? [] : history), ROLLUPS: structuredClone(rollups === undefined ? [] : rollups), exById: (s,id) => s.exercises.find(e => e.id === id)};
  const deps = {clock, ids, drafts: drafts === undefined ? Object.freeze({length: 0, key: () => null}) : drafts, nativeTrendContext};
  for (const factory of modules) Object.assign(E, factory(E, deps));
  return {...E, __test: {...E}};
}
module.exports = {createEngine, synthetic: true};
