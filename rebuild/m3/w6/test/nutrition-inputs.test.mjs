import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { webcrypto } from 'node:crypto';
import { openTodayInstallation } from '../local/today-bindings.mjs';
import { createLocalCalendar } from '../local/calendar.mjs';
import { faultDatabase } from './support.mjs';
import { createGymModel, EFFORT_CHOICES } from '../../w7-preview/today/gym-model.mjs';
import Athlete from '../../../m4/workout/athlete-state.cjs';
import Wire from '../../../m4/nutrition/inputs-wire.cjs';
import Validator from '../../../authority/validate.cjs';
import Ops from '../../../client/ops.cjs';
const day = '2026-09-11';
const setup = { athlete_label: 'synthetic-nutrition', split: { from: day, map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'REST', 5: 'U', 6: 'REST' } }, exercises: [{ id: 'synthetic-press', n: 'Synthetic press', mg: 'chest', day: 'U', sets: 1, hi: 10, inc: 5, steps: [20, 25, 30, 35, 40, 45] }], priority_muscles: [] };
const unknown = () => ({ goal: { kind: 'unknown' }, existing_plan: { kind: 'unknown' } });
const declared = () => ({ goal: { kind: 'declared', statement: 'Maintain my current weight while getting stronger.', phase: 'maintenance' }, existing_plan: { kind: 'unknown' } });
const amount = (value, unit) => ({ value, unit });
const plan = () => ({ kind: 'recorded', source: 'My existing agreed plan', agreed_date: day, fields: {
  calories: { kind: 'target', amount: amount(2300, 'kcal/day') }, protein: { kind: 'minimum', amount: amount(140, 'g/day') },
  carbohydrate: { kind: 'range', lower: amount(200, 'g/day'), upper: amount(260, 'g/day'), lower_inclusive: true, upper_inclusive: false }, fat: { kind: 'not_prescribed' },
} });
const proposal = (inputs = declared(), supersedes = null, change = supersedes === null ? 'assert' : 'update') => ({ effective: { local_date: day, local_time: '08:00', utc_offset: '+00:00' }, change, supersedes, inputs });
async function harness({ indexedDB = new IDBFactory(), crypto = webcrypto, athleteId } = {}) {
  const state = Athlete.createCleanInitState({ setup }); let now = `${day}T08:00:00Z`;
  const calendar = createLocalCalendar({ now: () => new Date(now), offsetMinutes: () => 0 });
  let fresh = true;
  const open = () => { const first = fresh; fresh = false; return openTodayInstallation({ indexedDB, crypto, day: calendar.sample().day, calendar, ...(athleteId ? { athleteId } : {}), ...(first ? { initialSetup: setup } : {}) }); };
  let era = await open(), reading = await era.createReadingHost({ day });
  return { indexedDB, state, calendar, get era() { return era; }, get reading() { return reading; }, get repository() { return reading.repository; },
    setNow(value) { now = value; },
    async reopen() { reading.close(); era.close(); era = await open(); reading = await era.createReadingHost({ day: calendar.sample().day }); },
    close() { reading.close(); era.close(); },
  };
}
async function prepare(h, p = proposal()) {
  const read = await h.era.readNutritionInputs(); assert.equal(read.read, true, read.code);
  const prepared = await h.era.prepareNutritionInputs({ expectedRevision: read.revision, proposal: p }); assert.equal(prepared.prepared, true, prepared.code);
  return prepared;
}
async function save(h, p = proposal()) { const prepared = await prepare(h, p); const result = await h.era.commitNutritionInputs({ preparedId: prepared.preparedId }); assert.equal(result.acknowledged, true, result.code); return result; }
test('actual C4 empty → prepared goal/plan → local durable save → weight/workout → reopen/cache loss; one identity', async () => {
  const h = await harness(); try {
    const before = await h.repository.load(), empty = await h.era.readNutritionInputs(); assert.equal(empty.view.local.current, null);
    assert.equal((await h.repository.load()).revision, before.revision, 'read is not a commit or re-enrollment');
    const p = proposal({ ...declared(), existing_plan: plan() }), prepared = await prepare(h, p);
    p.inputs.goal.phase = 'changed after review'; p.inputs.existing_plan.fields.calories.amount.value = 9999;
    assert.equal(prepared.view.inputs.goal.phase, 'maintenance'); assert(Object.isFrozen(prepared.view.inputs));
    const saved = await h.era.commitNutritionInputs({ preparedId: prepared.preparedId }); assert.equal(saved.acknowledged, true, saved.code);
    let read = await h.era.readNutritionInputs(); assert.equal(read.view.local.current.inputs.existing_plan.fields.calories.amount.value, 2300);
    assert.equal(read.view.accepted.current, null); assert.equal(read.view.effectivePlan, null); assert.equal(read.view.advice, 'not_qualified');
    assert.equal((await h.reading.weighIn({ date: day, lb: 170 })).ok, true);
    const gym = await h.era.createGymHost({ day, engineState: h.state, plannedSplitSlotId: `synthetic/${day}` });
    const model = createGymModel({ gymHost: gym, sessionTitle: 'Synthetic' }); assert.equal((await model.start()).ok, true);
    const v = await model.read(); assert.equal((await model.logSet({ startId: v.startId, slot: v.set.slot, lift: v.set.lift, load: '40', reps: '10', effort: EFFORT_CHOICES.find(x => x.label === '2').reserve })).ok, true);
    assert.equal((await model.finish({ startId: v.startId })).ok, true); gym.close();
    const stored = await h.repository.load(), ops = Object.values(stored.generation.collections.ops), note = ops.find(op => op.payload?.profile === Wire.PROFILE);
    assert.equal(Validator.validShape(note), true); assert.equal(Wire.validate(note, id => stored.generation.collections.ops[id]), true);
    assert.equal(note.kind, 'fact'); assert.equal(note.class, 'setup-note'); assert.equal(note.schema_version, 1);
    assert.equal(stored.generation.metadata.authorityLease.schema_version, 2);
    assert.equal(new Set(ops.map(op => op.athlete_id)).size, 1); assert.equal(new Set(ops.map(op => op.device_id)).size, 1); assert.equal(new Set(ops.map(op => op.lease_id)).size, 1);
    assert.equal(ops.filter(op => op.class === 'reading').length, 1); assert.equal(ops.filter(op => op.kind === 'session-close').length, 1);
    const withoutCache = structuredClone(stored.generation); delete withoutCache.collections.derived; await h.repository.commit(stored, withoutCache, null);
    const expected = (await h.era.readNutritionInputs()).view; await h.reopen(); read = await h.era.readNutritionInputs(); assert.deepEqual(read.view, expected);
    assert.equal((await h.era.initialSetup()).configured, true); assert.equal(h.state.model, undefined);
    const next = await h.era.createGymHost({ day, engineState: h.state, plannedSplitSlotId: `synthetic/${day}` });
    assert.equal((await next.host.client.readWorkoutHistory()).read, true); next.close();
    h.setNow('2026-09-14T08:00:00Z');
    const following = await h.era.createGymHost({ day: '2026-09-14', engineState: h.state, plannedSplitSlotId: 'synthetic/2026-09-14' });
    const followingModel = createGymModel({ gymHost: following, sessionTitle: 'Synthetic' }), nextView = await followingModel.read();
    assert.equal(nextView.phase, 'ready', nextView.code); assert.match(nextView.prescription.line, /40 lb/);
    assert.equal((await followingModel.start()).ok, true); following.close();
  } finally { h.close(); }
});
test('complete updates/corrections/clears retain original source and do not rewrite an agreed plan', async () => {
  const h = await harness(); try {
    const first = await save(h, proposal({ ...declared(), existing_plan: plan() }));
    const inputs = (await h.era.readNutritionInputs()).view.local.current.inputs;
    const updated = structuredClone(inputs); updated.goal = { kind: 'declared', statement: 'I want a recovery phase.', phase: 'recovery' };
    const second = await save(h, proposal(updated, first.op_id));
    let view = (await h.era.readNutritionInputs()).view; assert.deepEqual(view.local.current.inputs.existing_plan, inputs.existing_plan);
    assert.equal(view.records[0].original.payload.inputs.goal.phase, 'maintenance');
    const corrected = structuredClone(updated); corrected.existing_plan.fields.fat = { kind: 'unavailable', reason: 'I cannot remember the agreed fat field.' };
    const third = await save(h, proposal(corrected, second.op_id, 'correction'));
    const cleared = { goal: { kind: 'cleared', reason: 'Withdraw my earlier goal.' }, existing_plan: { kind: 'cleared', reason: 'Withdraw that recorded plan.' } };
    await save(h, proposal(cleared, third.op_id)); await h.reopen(); view = (await h.era.readNutritionInputs()).view;
    assert.deepEqual(view.local.current.inputs, cleared); assert.equal(view.records.length, 4);
    assert.equal(view.records[0].original.payload.inputs.existing_plan.fields.fat.kind, 'not_prescribed');
    assert.equal(view.records[2].original.payload.inputs.existing_plan.fields.fat.kind, 'unavailable');
  } finally { h.close(); }
});
test('invalid/partial/wrong-unit inputs and bypassed preparation consume no durable sequence', async () => {
  const h = await harness(); try {
    const before = await h.repository.load();
    for (const edit of [p => { p.inputs.goal = null; }, p => { p.inputs.extra = 1; }, p => { p.athleteId = 'other'; },
      p => { p.inputs.existing_plan = plan(); delete p.inputs.existing_plan.fields.fat; }, p => { p.inputs.existing_plan = plan(); p.inputs.existing_plan.fields.protein.amount.unit = 'lb'; },
      p => { p.inputs.existing_plan = plan(); p.inputs.existing_plan.fields.calories.amount.value = NaN; }]) {
      const p = proposal(); edit(p); assert.equal((await h.era.prepareNutritionInputs({ expectedRevision: before.revision, proposal: p })).prepared, false);
    }
    const direct = await h.era.client.execute('nutritionInputs', proposal()); assert.equal(direct.acknowledged, false);
    const after = await h.repository.load(); assert.equal(after.revision, before.revision); assert.deepEqual(after.generation.collections.meta.device, before.generation.collections.meta.device);
    assert.deepEqual(after.generation.collections.ops, before.generation.collections.ops);
  } finally { h.close(); }
});
test('stale review after weight save cannot apply to a new generation; exact retry is idempotent', async () => {
  const h = await harness(); try {
    const old = await prepare(h); await h.reading.weighIn({ date: day, lb: 170 });
    const failed = await h.era.commitNutritionInputs({ preparedId: old.preparedId }); assert.equal(failed.code, 'NUTRITION_INPUT_STALE');
    assert.equal((await h.era.readNutritionInputs()).view.local.current, null);
    const fresh = await prepare(h), saved = await h.era.commitNutritionInputs({ preparedId: fresh.preparedId }); assert.equal(saved.acknowledged, true);
    const revision = (await h.repository.load()).revision, retried = await h.era.commitNutritionInputs({ preparedId: fresh.preparedId });
    assert.equal(retried.op_id, saved.op_id); assert.equal((await h.repository.load()).revision, revision);
  } finally { h.close(); }
});
test('real encrypted quota failure keeps prior inputs and reviewed retry saves once', async () => {
  const fault = faultDatabase(), h = await harness({ indexedDB: fault.indexedDB }); try {
    const first = await save(h), old = (await h.era.readNutritionInputs()).view.local.current;
    const p = await prepare(h, proposal(unknown(), first.op_id)); fault.state.mode = 'quota'; fault.state.armed = true;
    const failed = await h.era.commitNutritionInputs({ preparedId: p.preparedId }); assert.equal(failed.acknowledged, false);
    fault.state.armed = false; assert.deepEqual((await h.era.readNutritionInputs()).view.local.current, old);
    const retried = await h.era.commitNutritionInputs({ preparedId: p.preparedId }); assert.equal(retried.acknowledged, true, retried.code);
    await h.reopen(); assert.equal((await h.era.readNutritionInputs()).view.records.length, 2);
  } finally { fault.state.release = true; fault.state.armed = false; h.close(); }
});
test('delayed encrypted transaction never reports Saved before completion', async () => {
  const fault = faultDatabase(), h = await harness({ indexedDB: fault.indexedDB }); try {
    const p = await prepare(h); fault.state.mode = 'delay'; fault.state.armed = true;
    let settled = false; const pending = h.era.commitNutritionInputs({ preparedId: p.preparedId }).then(r => { settled = true; return r; });
    await fault.state.write.promise; assert.equal(settled, false); fault.state.release = true;
    assert.equal((await pending).acknowledged, true);
  } finally { fault.state.release = true; fault.state.armed = false; h.close(); }
});
test('expired lease and closed context refuse, preserving prior input', async () => {
  const h = await harness();
  const first = await save(h), p = await prepare(h, proposal(unknown(), first.op_id));
  h.setNow('2030-01-01T08:00:00Z'); const expired = await h.era.commitNutritionInputs({ preparedId: p.preparedId });
  assert.equal(expired.acknowledged, false); assert.equal(expired.state, 20); assert.equal(expired.code, 'LOCAL_LEASE_EXPIRED');
  h.close(); const closed = await h.era.commitNutritionInputs({ preparedId: p.preparedId }); assert.equal(closed.acknowledged, false);
});
test('existing session-scoped preparation cannot be replayed in another athlete installation', async () => {
  const a = await harness({ athleteId: 'nutrition-athlete-A' }), b = await harness({ athleteId: 'nutrition-athlete-B' });
  try {
    const pa = await prepare(a), pb = await prepare(b); assert.notEqual(pa.preparedId, pb.preparedId);
    const result = await b.era.commitNutritionInputs({ preparedId: pa.preparedId }); assert.equal(result.acknowledged, false);
    assert.equal((await b.era.readNutritionInputs()).view.local.current, null);
    assert.equal((await b.era.commitNutritionInputs({ preparedId: pb.preparedId })).acknowledged, true);
  } finally { a.close(); b.close(); }
});
test('postcommit context loss cannot report Saved; durable original is recovered on reopen', async () => {
  const fault = faultDatabase(), h = await harness({ indexedDB: fault.indexedDB });
  try {
    const p = await prepare(h); fault.state.mode = 'delay'; fault.state.armed = true;
    const pending = h.era.commitNutritionInputs({ preparedId: p.preparedId }); await fault.state.write.promise;
    fault.state.tx.addEventListener('complete', () => h.close()); fault.state.release = true;
    const result = await pending; assert.equal(result.acknowledged, false); assert.equal(result.committed, true); assert.equal(result.code, 'LOCAL_CLIENT_CLOSED');
    fault.state.armed = false; await h.reopen(); const view = (await h.era.readNutritionInputs()).view;
    assert.equal(view.records.length, 1); assert.equal(view.local.current.sourceOpId, result.op_id);
    assert.equal((await h.era.commitNutritionInputs({ preparedId: p.preparedId })).acknowledged, false, 'reopened session cannot replay the old review');
  } finally { fault.state.release = true; fault.state.armed = false; h.close(); }
});
test('authenticated but wrong-scope originals and damaged checkpoints refuse read rather than becoming empty setup', async () => {
  for (const wrongScope of [false, true]) {
    const h = await harness(); try {
      await save(h); const snapshot = await h.repository.load(), g = structuredClone(snapshot.generation);
      if (wrongScope) { const op = Object.values(g.collections.ops)[0]; op.athlete_id = 'another-athlete'; op.canonical_content_commitment = Ops.commitmentOf(op, g.metadata.localEra.identityKey); }
      else g.collections.meta.checkpoint.counts.ops++;
      await h.repository.commit(snapshot, g, null);
      const failed = await h.era.readNutritionInputs(); assert.equal(failed.read, false); assert.equal(failed.state, 18);
      assert.equal(failed.code, wrongScope ? 'LOCAL_HISTORY_IDENTITY_UNPROVEN' : 'T2_INTEGRITY_UNPROVEN');
      assert.equal((await h.repository.load()).generation.collections.initialSetup?.current?.athlete_id, g.collections.initialSetup?.current?.athlete_id);
    } finally { h.close(); }
  }
});
test('reviewed commit owns its actual Today invocation against an immediately queued matching raw request', async t => {
  const h = await harness(); try {
    const p = proposal(), prepared = await prepare(h, p), before = await h.repository.load();
    const intended = h.era.commitNutritionInputs({ preparedId: prepared.preparedId });
    const raw = h.era.client.execute('nutritionInputs', p);
    const [saved, bypass] = await Promise.all([intended, raw]), after = await h.repository.load();
    t.diagnostic(JSON.stringify({ intended: { acknowledged: saved.acknowledged, code: saved.code }, raw: { acknowledged: bypass.acknowledged, code: bypass.code }, committedNotes: Object.values(after.generation.collections.ops).filter(op => op.payload?.profile === Wire.PROFILE).length }));
    assert.equal(bypass.acknowledged, false, 'raw request must not borrow the active review');
    assert.equal(saved.acknowledged, true, saved.code);
    assert.equal(after.revision, before.revision + 1);
    assert.equal(after.generation.collections.meta.device.seq, before.generation.collections.meta.device.seq + 1);
    assert.equal(Object.keys(after.generation.collections.ops).length, 1);
    assert.equal((await h.era.readNutritionInputs()).view.local.current.sourceOpId, saved.op_id);
  } finally { h.close(); }
});
test('raw requests before reviewed invocation and differing concurrent payloads cannot claim its authorization', async () => {
  for (const [rawFirst, matching] of [[true, true], [true, false], [false, false]]) {
    const h = await harness(); try {
      const p = await prepare(h), before = await h.repository.load();
      const rawCall = () => h.era.client.execute('nutritionInputs', proposal(matching ? declared() : unknown()), p.preparedId);
      const reviewedCall = () => h.era.commitNutritionInputs({ preparedId: p.preparedId });
      let raw, reviewed;
      if (rawFirst) { raw = rawCall(); reviewed = reviewedCall(); }
      else { reviewed = reviewedCall(); raw = rawCall(); }
      assert.equal((await raw).code, 'NUTRITION_INPUT_PREPARATION_REQUIRED');
      const saved = await reviewed; assert.equal(saved.acknowledged, true, saved.code);
      const after = await h.repository.load(); assert.equal(after.revision, before.revision + 1);
      assert.equal(after.generation.collections.meta.device.seq, before.generation.collections.meta.device.seq + 1);
      assert.equal(Object.keys(after.generation.collections.ops).length, 1);
      assert.deepEqual((await h.era.readNutritionInputs()).view.local.current.inputs, declared());
    } finally { h.close(); }
  }
});
test('raw requests during encrypted commit fail promptly while repeated reviewed commits save exactly once', async () => {
  const fault = faultDatabase(), h = await harness({ indexedDB: fault.indexedDB });
  try {
    const p = await prepare(h), before = await h.repository.load(); fault.state.mode = 'delay'; fault.state.armed = true;
    let settled = false;
    const first = h.era.commitNutritionInputs({ preparedId: p.preparedId }).then(result => { settled = true; return result; });
    await fault.state.write.promise;
    for (const inputs of [declared(), unknown()]) {
      const raw = await h.era.client.execute('nutritionInputs', proposal(inputs));
      assert.equal(raw.acknowledged, false); assert.equal(raw.code, 'NUTRITION_INPUT_PREPARATION_REQUIRED');
    }
    const repeated = h.era.commitNutritionInputs({ preparedId: p.preparedId });
    assert.equal(settled, false, 'raw rejection must not release Saved or wait for the held transaction');
    fault.state.release = true;
    const [saved, retry] = await Promise.all([first, repeated]);
    assert.equal(saved.acknowledged, true); assert.equal(retry.acknowledged, true); assert.equal(retry.op_id, saved.op_id);
    const after = await h.repository.load(); assert.equal(after.revision, before.revision + 1);
    assert.equal(after.generation.collections.meta.device.seq, before.generation.collections.meta.device.seq + 1);
    fault.state.armed = false; await h.reopen(); assert.equal((await h.era.readNutritionInputs()).view.records.length, 1);
  } finally { fault.state.release = true; fault.state.armed = false; h.close(); }
});
test('actual competing weight commit during nutrition sealing remains usable and invalidates the reviewed generation', async () => {
  let armed = false, enter, release;
  const entered = new Promise(resolve => { enter = resolve; }), hold = new Promise(resolve => { release = resolve; });
  const crypto = { getRandomValues: webcrypto.getRandomValues.bind(webcrypto), subtle: new Proxy(webcrypto.subtle, { get(target, key) {
    if (key === 'encrypt') return async (...args) => { if (armed) { armed = false; enter(); await hold; } return target.encrypt(...args); };
    const value = target[key]; return typeof value === 'function' ? value.bind(target) : value;
  } }) };
  const h = await harness({ crypto }); let second, other;
  try {
    const calendar = createLocalCalendar({ now: () => new Date(`${day}T08:00:00Z`), offsetMinutes: () => 0 });
    second = await openTodayInstallation({ indexedDB: new Proxy(h.indexedDB, { get(target, key) { const value = target[key]; return typeof value === 'function' ? value.bind(target) : value; } }), crypto: webcrypto, day, calendar });
    other = await second.createReadingHost({ day });
    const p = await prepare(h), before = await h.repository.load(); armed = true;
    const pending = h.era.commitNutritionInputs({ preparedId: p.preparedId }); await entered;
    assert.equal((await other.weighIn({ date: day, lb: 171 })).ok, true, 'unrelated real write is not locked behind nutrition');
    release(); const stale = await pending; assert.equal(stale.acknowledged, false); assert.equal(stale.code, 'NUTRITION_INPUT_STALE');
    const after = await h.repository.load(); assert.equal(after.revision, before.revision + 1);
    assert.equal(after.generation.collections.meta.device.seq, before.generation.collections.meta.device.seq + 1);
    const ops = Object.values(after.generation.collections.ops); assert.equal(ops.length, 1); assert.equal(ops[0].payload.lb.value, 171);
    assert.equal((await h.era.readNutritionInputs()).view.local.current, null);
    const fresh = await prepare(h), saved = await h.era.commitNutritionInputs({ preparedId: fresh.preparedId }); assert.equal(saved.acknowledged, true, saved.code);
    assert.equal((await h.repository.load()).generation.collections.meta.device.seq, before.generation.collections.meta.device.seq + 2);
  } finally { release(); other?.close(); second?.close(); h.close(); }
});
