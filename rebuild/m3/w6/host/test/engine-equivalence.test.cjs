'use strict';
// The host-owned runtime (rebuild/m3/w6/host/engine-runtime-host.cjs) exists
// only because rebuild/m4/workout/engine-runtime.cjs cannot be bundled, and its
// bytes are pinned by the accepted M2-NATIVE-CARRIERS package. Two files that
// must behave identically are a drift hazard, so this test is the thing that
// makes the duplication safe: it composes BOTH over the same twelve
// rebuild/engine modules and proves they agree on what they compose and on
// what they answer.
//
// If anyone edits either file's module list, order, provider wiring or exposed
// surface, this test fails. It reads no athlete data and writes nothing.
const test = require('node:test');
const assert = require('node:assert/strict');
const Accepted = require('../../../../m4/workout/engine-runtime.cjs');
const Host = require('../engine-runtime-host.cjs');
const { createCleanInitState } = require('../../../../m4/workout/athlete-state.cjs');
const { SETUP, DAY, clockFor, refusingTrendContext } = require('./journey-fixture.cjs');

const runtimes = () => {
  const options = { clock: clockFor(DAY), nativeTrendContext: refusingTrendContext() };
  return { accepted: Accepted.createEngineRuntime(options), host: Host.createEngineRuntime(options) };
};

test('host runtime composes exactly the accepted runtime\'s modules, in order', () => {
  assert.deepEqual(Host.MODULES, Accepted.COMPOSITION.modules);
  assert.deepEqual(Host.EXPOSED, Accepted.COMPOSITION.exposed);
  assert.equal(Host.MODULES.length, 12);
  // Order matters: the factories are applied in sequence onto one table, so a
  // permutation would compose a different engine while passing a set compare.
  Host.MODULES.forEach((name, index) => assert.equal(name, Accepted.COMPOSITION.modules[index], 'position ' + index));
  assert.deepEqual(Host.COMPOSITION.forbiddenImports.slice(0, 3), Accepted.COMPOSITION.forbiddenImports.slice(0, 3));
});

test('host runtime withholds the same seed-owned providers', () => {
  for (const name of ['HISTORY', 'ROLLUPS']) {
    for (const provider of [Accepted.absentProvider(name), Host.absentProvider(name)]) {
      assert.throws(() => provider.map(x => x), { code: 'ENGINE_RUNTIME_' + name + '_PROVIDER_REQUIRED' });
      assert.throws(() => [...provider], { code: 'ENGINE_RUNTIME_' + name + '_PROVIDER_REQUIRED' });
      assert.throws(() => provider.length, { code: 'ENGINE_RUNTIME_' + name + '_PROVIDER_REQUIRED' });
    }
  }
});

test('both runtimes refuse the same missing/invalid arguments', () => {
  for (const create of [Accepted.createEngineRuntime, Host.createEngineRuntime]) {
    assert.throws(() => create(), TypeError);
    assert.throws(() => create({}), TypeError);
    assert.throws(() => create({ clock: clockFor(DAY), nativeTrendContext: 'not a function' }), TypeError);
  }
  const { accepted, host } = runtimes();
  assert.deepEqual(Object.keys(accepted).sort(), Object.keys(host).sort());
  assert(Object.isFrozen(accepted) && Object.isFrozen(host));
});

test('both runtimes answer identically on the journey fixture', () => {
  const { accepted, host } = runtimes();
  const state = createCleanInitState({ setup: SETUP });
  // The journey's own day, and a day the athlete's split calls REST, so both
  // the session path and the no-session path are compared.
  for (const day of [DAY, '2026-09-06', '2026-09-07']) {
    const a = accepted.genSession(structuredClone(state), day, undefined);
    const h = host.genSession(structuredClone(state), day, undefined);
    assert.deepEqual(h, a, 'genSession on ' + day);
    if (!a) continue;
    for (const card of a.ex) {
      const original = state.exercises.find(e => e.id === card.id);
      const ea = accepted.rirPlan(structuredClone(state), { ...card, holdFlag: original.holdFlag }, undefined);
      const eh = host.rirPlan(structuredClone(state), { ...card, holdFlag: original.holdFlag }, undefined);
      assert.deepEqual(eh, ea, 'rirPlan for ' + card.id + ' on ' + day);
    }
  }
});

test('a session really is produced, so the comparison above is not comparing two nulls', () => {
  const { accepted } = runtimes();
  const session = accepted.genSession(structuredClone(createCleanInitState({ setup: SETUP })), DAY, undefined);
  assert(session, 'the journey day produces a session');
  assert.deepEqual(session.ex.map(card => card.id), ['db-bench', 'lat-pulldown']);
  assert(session.ex.every(card => card.baselineAsk === true && card.w === null), 'the DEBUT path is the one compared');
});
