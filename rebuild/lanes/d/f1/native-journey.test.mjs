// F1 public native-host mechanism proof. All athlete/equipment values are invented.
// Real repository, encryption, durable client, commands, host, engine and native
// trend binding. No private data, seed, migration or imported athlete records.
// The raw constructor preparation is separate from the known-load mechanism
// fixture: adoption of recorded loads into config remains an explicit parent
// seam, not an F1 fix or evidence that load adoption works end to end.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { webcrypto } from 'node:crypto';
import { fixture, faultDatabase, initial, config, O, createT2Stage } from '../../../m3/w6/test/support.mjs';
import { createDurablePublicClient } from '../../../m3/w6/public-client.mjs';
import { parseStrictJson } from '../../../m3/w6/strict-json.mjs';
import { projectWorkoutRecords } from '../../../m4/workout/project-history.mjs';
import { composeWorkoutHost } from '../../../m3/w6/host/workout-host.mjs';

const require = createRequire(import.meta.url);
const Sign = require('../../../m3/w5/crypto.cjs');
const Source = require('../../../m3/w5/source/codec.cjs');
const Capture = require('../../../m4/workout/capture.cjs');
const Commands = require('../../../m4/workout/commands.cjs');
const Adapter = require('../../../m4/workout/engine-capture.cjs');
const History = require('../../../m4/workout/engine-history.cjs');
const SourceProjection = require('../../../m4/workout/source-projection.cjs');
const { createCleanInitState } = require('../../../m4/workout/athlete-state.cjs');
const { createNullLaneWorkoutBasis } = require('../../../m4/workout/workout-basis.cjs');
const { createWorkoutResumePolicy } = require('../../../m4/workout/resume-policy.cjs');
const { createNativeTrendContextBinding, createEmptyHistoryDayFacts } = require('../../../m4/workout/native-trend-context.cjs');
const { createEngineRuntime } = require('../../../m4/workout/engine-runtime.cjs');
const FIRST = '2026-09-04', NEXT = '2026-09-07', REPEAT = '2026-09-11';
const SLOT = 'synthetic-f1-slot';
const PRODUCER = Object.freeze({ app_build: 'synthetic-f1-journey', engine_build: 'f1-candidate',
  rule_profile: Adapter.PROFILE, source_schema: 'synthetic-clean-init' });
const clockFor = day => ({ today: () => day, nowISO: () => day + 'T12:00:00.000Z',
  nowMs: () => Date.parse(day + 'T12:00:00.000Z'), hour: () => 12,
  dow: () => new Date(day + 'T00:00:00Z').getUTCDay() });
const setupFor = mixed => ({
  athlete_label: 'synthetic-f1-journey',
  split: { from: '2026-08-31', map: { 0: 'REST', 1: 'F', 2: 'REST', 3: 'REST', 4: 'REST', 5: 'F', 6: mixed ? 'U' : 'REST' } },
  exercises: [
    { id: 'f1-press', n: 'Synthetic press', mg: 'chest', day: 'U', sets: 2, hi: 10, inc: 5, steps: [30, 35, 40] },
    { id: 'f1-row', n: 'Synthetic row', mg: 'back', day: 'U', sets: 1, hi: 10, inc: 5, steps: [30, 35, 40] },
    { id: 'f1-squat', n: 'Synthetic squat', mg: 'quads', day: 'L', sets: 2, hi: 10, inc: 10, steps: [90, 100, 110] },
  ], priority_muscles: ['chest', 'quads'],
});
const opsOf = async repository => Object.values((await repository.load()).generation.collections.ops || {});

async function scaffold(state, options = {}) {
  const f = await fixture(options);
  let repository = f.repo, day = FIRST, parents = [], projectionFailure = null;
  const signing = Sign.generateSigningKey('synthetic-f1-native-journey');
  const generation = initial();
  generation.metadata.authorityLease = Sign.signLease({ ...O.lease('dev-A'), schema_version: 2 }, signing);
  await repository.initialize(generation, 'synthetic-enrollment-only');
  const capture = Capture.createPrescriptionCapture({ parseStrictJson, profile: Capture.SOURCE_PROFILE, sourceCodec: Source });
  const stage = createT2Stage(() => ({ ...config(), clock: { ...config().clock, today: () => day } }),
    { allowInbound: true, workoutCommands: Commands.createWorkoutCommands({ prescriptionCapture: capture }) });
  const basis = createNullLaneWorkoutBasis({ sourceCodec: Source, planBasis: 'NO_ACCEPTED_PLAN',
    inputBasis: 'synthetic-f1/zero-import', causalParents: () => parents });
  const hostAt = date => {
    day = date;
    const binding = createNativeTrendContextBinding({ dayFacts: createEmptyHistoryDayFacts({ state }) });
    return composeWorkoutHost({ repository, stage, namespace: 'synthetic-athlete/device-A', athleteId: 'ath-1', deviceId: 'dev-A',
      sessionEpoch: 1, isCurrentSession: value => value === 1, observationEpoch: () => 1,
      observationGuard: { run: async (_kind, fn) => fn() }, validateCommit: () => null,
      keys: [Sign.publicKeyOf(signing)], crypto: webcrypto, createDurablePublicClient,
      createNullSelectionRegistrar: SourceProjection.createNullSelectionRegistrar,
      createSourceProjectionReader: SourceProjection.createSourceProjectionReader,
      createEngineWorkoutCapture: Adapter.createEngineWorkoutCapture,
      createEngineHistoryProjector: options => {
        const real = History.createEngineHistoryProjector(options);
        return { ...real, project(...args) {
          try { return real.project(...args); }
          catch (error) { projectionFailure = error.code || error.message; throw error; }
        } };
      },
      createWorkoutResumePolicy, parseStrictJson, projectWorkoutRecords,
      prescriptionCapture: capture, sourceCodec: Source,
      engine: createEngineRuntime({ clock: clockFor(date), nativeTrendContext: binding.resolve }),
      engineState: state, clock: clockFor(date), nativeTrendBinding: binding,
      workoutProducerIdentity: PRODUCER, resolveWorkoutBasis: basis,
      resumeReason: 'Synthetic F1 current assessment recomputed over the same public fixture.', plannedSplitSlotId: SLOT });
  };
  return { hostAt, ops: () => opsOf(repository), snapshot: () => repository.load(), parents: ids => { parents = ids; },
    addParents: ids => { parents = [...new Set([...parents, ...ids])]; }, projectionFailure: () => projectionFailure,
    async relaunch() { repository.close(); repository = (await f.fresh()).repository; },
    close: () => repository.close() };
}

test('F1 raw clean init: F debut prepares without invented initialization fields', async () => {
  const state = createCleanInitState({ setup: setupFor(false) });
  assert(!Object.hasOwn(state, 'blackout'));
  assert(!Object.hasOwn(state, 'model'));
  const h = await scaffold(state);
  try {
    const host = h.hostAt(FIRST), before = await h.ops();
    const prepared = await host.client.prepareWorkout({ planned_split_slot_id: SLOT });
    assert.equal(prepared.prepared, true, prepared.code);
    assert.equal(prepared.view.session.instruction.display, 'FULL BODY');
    assert.equal(host.lastProducerRefusal(), null);
    assert(prepared.view.slots.every(x => x.load.state === 'not_prescribed' && x.reps.state === 'not_prescribed'));
    assert.deepEqual(await h.ops(), before, 'raw constructor preparation writes no operations');
  } finally { h.close(); }
});

test('F1 failed set save preserves operations and outbox; retry records exactly once', async () => {
  const fault = faultDatabase();
  const state = createCleanInitState({ setup: setupFor(false) });
  const h = await scaffold(state, { indexedDB: fault.indexedDB });
  try {
    const host = h.hostAt(FIRST);
    const prepared = await host.client.prepareWorkout({ planned_split_slot_id: SLOT });
    assert(prepared.prepared, prepared.code);
    assert.equal(prepared.view.session.instruction.display, 'FULL BODY');
    const start = await host.client.startPreparedWorkout({ preparedId: prepared.preparedId });
    assert(start.acknowledged, start.code);
    const slot = prepared.view.slots.find(x => x.lift_lineage_id === 'f1-squat');
    const input = { session_start_op_id: start.op_id, logical_set_slot: slot.logical_set_slot,
      lift_lineage_id: slot.lift_lineage_id, load: { value: 100, unit: 'lb' },
      reps: { value: 9, unit: 'rep' }, reserve: { tag: 'exact', value: 1, unit: 'rep' } };
    const before = await h.snapshot();
    const beforeOps = JSON.stringify(before.generation.collections.ops);
    const beforeOutbox = JSON.stringify(before.generation.collections.outbox);
    // Existing public support injects QuotaExceededError at the IDB active
    // generation write, outside the product. The transaction must not commit.
    fault.state.mode = 'quota'; fault.state.armed = true;
    const failed = await host.client.execute('workout', { action: 'set', input });
    fault.state.armed = false;
    assert.notEqual(failed.acknowledged, true, 'failed storage cannot acknowledge the set');
    assert.match(failed.code, /^TRANSACTION_(ABORTED|WRITE_FAILED)$/);
    const after = await h.snapshot();
    assert.equal(after.revision, before.revision);
    assert.equal(JSON.stringify(after.generation.collections.ops), beforeOps);
    assert.equal(JSON.stringify(after.generation.collections.outbox), beforeOutbox);
    const retry = await host.client.execute('workout', { action: 'set', input });
    assert(retry.acknowledged, retry.code);
    const saved = await h.snapshot();
    assert.equal(Object.keys(saved.generation.collections.ops).length, Object.keys(before.generation.collections.ops).length + 1);
    assert.equal(Object.keys(saved.generation.collections.outbox).length, Object.keys(before.generation.collections.outbox).length + 1);
    assert.equal(Object.values(saved.generation.collections.ops).filter(x => x.kind === 'session-set').length, 1);
    assert(Object.hasOwn(saved.generation.collections.ops, retry.op_id));
    assert(Object.hasOwn(saved.generation.collections.outbox, retry.op_id));
  } finally { fault.state.armed = false; h.close(); }
});

for (const mixed of [false, true]) test('F1 ' + (mixed ? 'mixed U/F' : 'F-only') + ': native mechanism with explicit recorded-load adoption', async t => {
  const state = structuredClone(createCleanInitState({ setup: setupFor(mixed) }));
  const h = await scaffold(state);
  let host = h.hostAt(FIRST), startId, originalCapture, slots, kept = [], undoneId;
  const loadFor = id => id === 'f1-squat' ? 100 : 35;
  const inputFor = (slot, start = startId) => ({ session_start_op_id: start,
    logical_set_slot: slot.logical_set_slot, lift_lineage_id: slot.lift_lineage_id,
    load: { value: loadFor(slot.lift_lineage_id), unit: 'lb' }, reps: { value: 9, unit: 'rep' },
    reserve: { tag: 'exact', value: 1, unit: 'rep' } });
  async function record(slot, { resume = false, start = startId } = {}) {
    const input = inputFor(slot, start);
    let result;
    if (resume) {
      const handle = await host.client.prepareWorkoutContinuation({ session_start_op_id: start });
      assert(handle.prepared, handle.code);
      result = await host.client.executeResumedWorkout({ resumeId: handle.resumeId, action: 'set', input });
    } else result = await host.client.execute('workout', { action: 'set', input });
    assert(result.acknowledged, result.code);
    return result.op_id;
  }
  async function close(start, setIds, extra = []) {
    const result = await host.client.execute('workout', { action: 'close', input: {
      session_start_op_id: start, completion_kind: 'normal', causal_parents: [start, ...setIds, ...extra] } });
    assert(result.acknowledged, result.code);
    h.parents([result.op_id]);
  }
  try {
    await t.test('open F with both pools once, record a partial session, undo one set', async () => {
      const prepared = await host.client.prepareWorkout({ planned_split_slot_id: SLOT });
      assert(prepared.prepared, prepared.code);
      assert.equal(prepared.view.session.instruction.display, 'FULL BODY');
      slots = prepared.view.slots;
      assert.equal(slots.length, 5);
      assert.deepEqual([...new Set(slots.map(x => x.lift_lineage_id))], ['f1-press', 'f1-squat', 'f1-row']);
      assert(slots.every(x => x.load.state === 'not_prescribed' && x.reps.state === 'not_prescribed'));
      const started = await host.client.startPreparedWorkout({ preparedId: prepared.preparedId });
      assert(started.acknowledged, started.code);
      startId = started.op_id; h.parents([startId]);
      originalCapture = JSON.stringify((await h.ops()).find(x => x.op_id === startId).prescription_capture);
      kept.push(await record(slots[0]), await record(slots[2]));
      const temporary = await record(slots[3]);
      const edit = await host.client.prepareWorkoutEdit({ target_op_id: temporary });
      assert(edit.prepared, edit.code);
      const undone = await host.client.commitWorkoutEdit({ editId: edit.editId, action: 'remove', change: 'Synthetic undo of an accidental tap' });
      assert(undone.acknowledged, undone.code); undoneId = undone.op_id;
      assert((await h.ops()).some(x => x.op_id === temporary), 'undo preserves original operation');
      const read = await host.client.readWorkoutHistory();
      assert(read.read, read.code);
      const fact = read.history.sessions[0].projection.facts.find(x => x.source_op_id === temporary);
      assert.equal(fact.included, false, 'undone set is retained but excluded from performed facts');
    });

    await t.test('relaunch and resume the same capture, finish both families, leave one exercise unperformed', async () => {
      const before = await h.ops(); await h.relaunch(); host = h.hostAt(FIRST);
      assert.deepEqual(await h.ops(), before);
      const resumed = await host.client.prepareWorkoutContinuation({ session_start_op_id: startId });
      assert(resumed.prepared, resumed.code);
      assert.equal(resumed.view.slots.filter(x => x.completion).length, 2);
      assert.equal((await h.ops()).filter(x => x.kind === 'session-start').length, 1);
      assert.equal(JSON.stringify((await h.ops()).find(x => x.op_id === startId).prescription_capture), originalCapture);
      kept.push(await record(slots[1], { resume: true }), await record(slots[3], { resume: true }));
      await close(startId, kept, [undoneId]);
      const read = await host.client.readWorkoutHistory(); assert(read.read, read.code);
      const facts = read.history.sessions[0].projection.facts.filter(x => x.included !== false);
      assert.equal(facts.length, 4);
      assert.deepEqual([...new Set(facts.map(x => x.lift_lineage_id))].sort(), ['f1-press', 'f1-squat']);
      assert(!facts.some(x => x.lift_lineage_id === 'f1-row'), 'close invents no unperformed exercise');
    });

    await t.test('history and correction persist after restart without rewriting the original set', async () => {
      await h.relaunch(); host = h.hostAt(FIRST);
      const before = (await h.ops()).find(x => x.op_id === kept[0]);
      const edit = await host.client.prepareWorkoutEdit({ target_op_id: kept[0] });
      assert(edit.prepared, edit.code);
      const result = await host.client.commitWorkoutEdit({ editId: edit.editId, action: 'correct', change: { reps: { value: 10, unit: 'rep' } } });
      assert(result.acknowledged, result.code); h.addParents([result.op_id]);
      assert.deepEqual((await h.ops()).find(x => x.op_id === kept[0]), before);
      await h.relaunch(); host = h.hostAt(FIRST);
      const read = await host.client.readWorkoutHistory(); assert(read.read, read.code);
      const corrected = read.history.sessions[0].projection.facts.find(x => x.source_op_id === kept[0]);
      assert.equal(corrected.original.reps.value, 9); assert.equal(corrected.current.reps.value, 10);
      assert.equal(JSON.stringify(read.history.sessions[0].start.operation.prescription_capture), originalCapture);
    });

    await t.test('second F exposure and day seven keep qualified targets for both families', async () => {
      // The host intentionally does not apply completeSession to config. This is
      // the existing A0 journey's explicit working-load seam, now for both families.
      assert(state.exercises.every(x => x.w === null));
      for (const ex of state.exercises.filter(x => x.id !== 'f1-row')) ex.w = loadFor(ex.id);
      async function conduct(day, fullBody) {
        host = h.hostAt(day);
        const before = await h.ops(), prepared = await host.client.prepareWorkout({ planned_split_slot_id: SLOT });
        assert(prepared.prepared, day + ': ' + prepared.code + '; producer=' + host.lastProducerRefusal()?.code + '; projection=' + h.projectionFailure());
        assert.equal(host.lastProducerRefusal(), null);
        assert.deepEqual(await h.ops(), before, 'preparation is read-only');
        if (fullBody) {
          assert.equal(prepared.view.session.instruction.display, 'FULL BODY');
          assert.equal(prepared.view.slots.length, 5);
          for (const id of ['f1-press', 'f1-squat']) {
            const own = prepared.view.slots.filter(x => x.lift_lineage_id === id);
            assert.equal(own.length, 2);
            assert(own.every(x => x.load.state === 'specified' && x.reps.state === 'specified'));
            assert(own.every(x => JSON.parse(x.reps.source_json).value > 0), 'F label never restarts targets at zero');
            assert(own.every(x => !x.reason.display.includes('DEBUT')));
          }
        } else assert.deepEqual([...new Set(prepared.view.slots.map(x => x.lift_lineage_id))], ['f1-press', 'f1-row']);
        const started = await host.client.startPreparedWorkout({ preparedId: prepared.preparedId });
        assert(started.acknowledged, started.code); h.parents([started.op_id]);
        const sets = [];
        for (const slot of prepared.view.slots.filter(x => x.lift_lineage_id !== 'f1-row')) sets.push(await record(slot, { start: started.op_id }));
        await close(started.op_id, sets);
        return prepared.view;
      }
      if (mixed) await conduct('2026-09-05', false);
      await conduct(NEXT, true);
      await h.relaunch(); await conduct(REPEAT, true);
      const history = await host.client.readWorkoutHistory(); assert(history.read, history.code);
      assert.equal(history.history.sessions.length, mixed ? 4 : 3);
      assert.equal(JSON.stringify(history.history.sessions.find(x => x.start.operation.op_id === startId).start.operation.prescription_capture), originalCapture);
    });
  } finally { h.close(); }
});
