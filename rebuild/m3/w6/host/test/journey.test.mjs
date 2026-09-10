// End-to-end synthetic journey through the REAL host composition.
//
// Real: repository (AES-GCM over fake-indexeddb, the same storage the browser
// host uses), T2 stage, public durable client, v2 source-aware capture
// validator, the accepted L null-lane registrar and composite reader, the
// engine capture adapter, the engine history projector, and the accepted L
// prescription runtime.
// Synthetic and labelled as such: the athlete setup, the identity
// (synthetic-test-identity), the signing key and lease, and the observation /
// currentness guards. No network, no private input, no athlete data.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { webcrypto } from 'node:crypto';
import { fixture, initial, config, O, createT2Stage } from '../../test/support.mjs';
import { createDurablePublicClient } from '../../public-client.mjs';
import { parseStrictJson } from '../../strict-json.mjs';
import { projectWorkoutRecords } from '../../../../m4/workout/project-history.mjs';
import { composeWorkoutHost, createUnavailableNativeTrendContext } from '../workout-host.mjs';

const require = createRequire(import.meta.url);
const Sign = require('../../../w5/crypto.cjs');
const Source = require('../../../w5/source/codec.cjs');
const Capture = require('../../../../m4/workout/capture.cjs');
const Commands = require('../../../../m4/workout/commands.cjs');
const Adapter = require('../../../../m4/workout/engine-capture.cjs');
const History = require('../../../../m4/workout/engine-history.cjs');
const SourceProjection = require('../../../../m4/workout/source-projection.cjs');
const { createCleanInitState } = require('../../../../m4/workout/athlete-state.cjs');
const { createNullLaneWorkoutBasis, createUnavailableStringLaneResolver } = require('../../../../m4/workout/workout-basis.cjs');
const { createWorkoutResumePolicy } = require('../../../../m4/workout/resume-policy.cjs');
const { materializeEngineRoot } = require('../../../../m4/spec/native-next-target-candidate/engine-root.cjs');

// 2026-09-04 is a Friday. The Joe-shaped fallback week in
// rebuild/engine/plan.cjs dayType would call a Friday an L day; this athlete's
// OWN split calls it U. Every assertion about which lifts appear is therefore
// also an assertion that the fallback week was never consulted.
const DAY = '2026-09-04';
const SETUP = Object.freeze({
  athlete_label: 'synthetic-test-identity',
  split: { from: '2026-08-31', map: { 0: 'REST', 1: 'REST', 2: 'REST', 3: 'REST', 4: 'REST', 5: 'U', 6: 'L' } },
  exercises: [
    { id: 'db-bench', n: 'Dumbbell bench press', mg: 'chest', day: 'U', sets: 3, hi: 10, inc: 5, steps: [20, 25, 30, 35, 40, 45, 50] },
    { id: 'lat-pulldown', n: 'Lat pulldown', mg: 'back', day: 'U', sets: 2, hi: 12, inc: 10, steps: [50, 60, 70, 80, 90] },
    { id: 'leg-press', n: 'Leg press', mg: 'quads', day: 'L', sets: 3, hi: 12, inc: 10, steps: [90, 100, 110, 120] },
  ],
  priority_muscles: ['chest', 'back'],
});
const PRODUCER = Object.freeze({ app_build: 'synthetic-test-identity', engine_build: 'native-candidate-L',
  rule_profile: Adapter.PROFILE, source_schema: 'synthetic-clean-init' });
const RESUME_REASON = 'Current assessment recomputed by this host from the same clean-init state; not a personal prescription.';
const PLAN_BASIS = 'NO_ACCEPTED_PLAN';
const INPUT_BASIS = 'native-only/zero-import';
const SLOT = 'synthetic-slot';

const { runtimeModule, pins } = materializeEngineRoot();
const { createEngineRuntime } = require(runtimeModule);
const emptyPrefix = () => Source.basis({ W: 0, log_digest: Source.createPrefixHasher().digest(), selection_id: null });
const clockFor = day => ({ today: () => day, nowISO: () => day + 'T12:00:00.000Z',
  nowMs: () => Date.parse(day + 'T12:00:00.000Z'), hour: () => 12, dow: () => new Date(day + 'T00:00:00Z').getUTCDay() });

// One live host over one repository handle. Providers are named here and only
// here; composeWorkoutHost binds them and invents nothing.
function hostOver(repository, { engineState, resolveWorkoutBasis, parents, stage }) {
  return composeWorkoutHost({
    repository, stage, namespace: 'synthetic-athlete/device-A', athleteId: 'ath-1', deviceId: 'dev-A',
    sessionEpoch: 1, isCurrentSession: x => x === 1, observationEpoch: () => 1,
    observationGuard: { run: async (_kind, fn) => fn() }, validateCommit: () => null,
    keys: parents.keys, crypto: webcrypto,
    createDurablePublicClient,
    createNullSelectionRegistrar: SourceProjection.createNullSelectionRegistrar,
    createSourceProjectionReader: SourceProjection.createSourceProjectionReader,
    createEngineWorkoutCapture: Adapter.createEngineWorkoutCapture,
    createEngineHistoryProjector: History.createEngineHistoryProjector,
    createWorkoutResumePolicy, parseStrictJson, projectWorkoutRecords,
    prescriptionCapture: parents.capture, sourceCodec: Source,
    engine: parents.engine, engineState, clock: clockFor(DAY),
    workoutProducerIdentity: PRODUCER, resolveWorkoutBasis, resumeReason: RESUME_REASON,
    plannedSplitSlotId: SLOT,
  });
}

async function scaffold() {
  const signing = Sign.generateSigningKey('synthetic-host-journey');
  const lease = Sign.signLease({ ...O.lease('dev-A'), schema_version: 2 }, signing);
  const capture = Capture.createPrescriptionCapture({ parseStrictJson, profile: Capture.SOURCE_PROFILE, sourceCodec: Source });
  const commands = Commands.createWorkoutCommands({ prescriptionCapture: capture });
  const stage = createT2Stage(() => ({ ...config(), clock: { ...config().clock, today: () => DAY } }),
    { allowInbound: true, workoutCommands: commands });
  const engine = createEngineRuntime({ clock: clockFor(DAY),
    nativeTrendContext: createUnavailableNativeTrendContext() });
  const f = await fixture();
  const generation = initial();
  generation.metadata.authorityLease = lease;
  await f.repo.initialize(generation, 'synthetic-enrollment-only');
  return { f, stage, parents: { keys: [Sign.publicKeyOf(signing)], capture, engine }, signing };
}

const opsOf = async repository => Object.values((await repository.load()).generation.collections.ops || {});
const kindsOf = ops => ops.map(o => o.kind).sort();

test('host journey — clean init, record, relaunch, resume, finish, history, correct, next targets', async t => {
  const { f, stage, parents } = await scaffold();
  const engineState = createCleanInitState({ setup: SETUP });
  let parentIds = [];
  const resolveWorkoutBasis = createNullLaneWorkoutBasis({ sourceCodec: Source,
    planBasis: PLAN_BASIS, inputBasis: INPUT_BASIS, causalParents: () => parentIds });
  let repository = f.repo;
  let host = hostOver(repository, { engineState, resolveWorkoutBasis, parents, stage });
  let startId = null, setIds = [], originalCapture = null, originalStartOp = null;

  await t.test('1. clean-init state carries this athlete\'s own split and no history', () => {
    assert.equal(engineState.athlete_label, 'synthetic-test-identity');
    assert.deepEqual(engineState.sessionLog, {});
    assert.deepEqual(engineState.reads, []);
    assert.deepEqual(engineState.queue, []);
    assert.deepEqual(engineState.sleep, { nights: [] });
    assert.deepEqual(engineState.priority_muscles, ['chest', 'back']);
    assert.equal(engineState.split.length, 1);
    assert.equal(engineState.split[0].map['5'], 'U');
    assert(engineState.exercises.every(e => e.w === null), 'every lift starts with no working load');
    assert(engineState.exercises.every(e => Array.isArray(e.steps) && e.steps.length), 'real available loads are supplied');
    assert(Object.isFrozen(engineState));
    // No seed/migrate/merge import: the state has none of the members those add.
    for (const absent of ['trend', 'model', 'blackout', 'feedRules']) assert(!Object.hasOwn(engineState, absent), absent);
  });

  await t.test('2. clean-init refuses rather than falling back', () => {
    const without = key => { const s = structuredClone(SETUP); delete s[key]; return s; };
    assert.throws(() => createCleanInitState({ setup: without('split') }), { code: 'CLEAN_INIT_SETUP_REQUIRED' });
    assert.throws(() => createCleanInitState({ setup: without('exercises') }), { code: 'CLEAN_INIT_SETUP_REQUIRED' });
    assert.throws(() => createCleanInitState({ setup: without('priority_muscles') }), { code: 'CLEAN_INIT_SETUP_REQUIRED' });
    assert.throws(() => createCleanInitState({}), { code: 'CLEAN_INIT_SETUP_REQUIRED' });
    const noSteps = structuredClone(SETUP); delete noSteps.exercises[0].steps;
    assert.throws(() => createCleanInitState({ setup: noSteps }), { code: 'CLEAN_INIT_EXERCISE_REQUIRED' });
    const preset = structuredClone(SETUP); preset.exercises[0].w = 40;
    assert.throws(() => createCleanInitState({ setup: preset }), { code: 'CLEAN_INIT_EXERCISE_REQUIRED' });
  });

  await t.test('3. composeWorkoutHost refuses a missing provider by name', () => {
    const good = { repository, stage, namespace: 'n', athleteId: 'a', deviceId: 'd', sessionEpoch: 1,
      isCurrentSession: () => true, observationEpoch: () => 1, observationGuard: { run: async (_k, fn) => fn() },
      validateCommit: () => null, keys: parents.keys, crypto: webcrypto, createDurablePublicClient,
      createNullSelectionRegistrar: SourceProjection.createNullSelectionRegistrar,
      createSourceProjectionReader: SourceProjection.createSourceProjectionReader,
      createEngineWorkoutCapture: Adapter.createEngineWorkoutCapture,
      createEngineHistoryProjector: History.createEngineHistoryProjector,
      createWorkoutResumePolicy, parseStrictJson, projectWorkoutRecords,
      prescriptionCapture: parents.capture, sourceCodec: Source, engine: parents.engine,
      engineState, clock: clockFor(DAY), workoutProducerIdentity: PRODUCER,
      resolveWorkoutBasis, resumeReason: RESUME_REASON, plannedSplitSlotId: SLOT };
    for (const name of ['repository', 'engine', 'engineState', 'sourceCodec', 'resolveWorkoutBasis',
      'workoutProducerIdentity', 'clock', 'resumeReason', 'prescriptionCapture', 'createEngineWorkoutCapture']) {
      const missing = { ...good }; delete missing[name];
      assert.throws(() => composeWorkoutHost(missing), error =>
        error instanceof TypeError && error.message.includes(name), name);
    }
    // A v1 capture profile is refused outright rather than silently downgraded.
    assert.throws(() => composeWorkoutHost({ ...good,
      prescriptionCapture: Capture.createPrescriptionCapture({ parseStrictJson }) }), TypeError);
  });

  await t.test('4. open today\'s workout — DEBUT asks for a working load', async () => {
    const prepared = await host.client.prepareWorkout({ planned_split_slot_id: SLOT });
    assert(prepared.prepared, prepared.code);
    const lifts = [...new Set(prepared.view.slots.map(s => s.lift_lineage_id))];
    assert.deepEqual(lifts, ['db-bench', 'lat-pulldown'], 'the athlete\'s own U day, not the fallback week\'s Friday L');
    assert.equal(prepared.view.slots.length, 5);
    for (const slot of prepared.view.slots) {
      assert.deepEqual(slot.load, { state: 'not_prescribed', display: 'Find a working load', source_json: null });
      assert.deepEqual(slot.reps, { state: 'not_prescribed', display: 'Record the reps performed', source_json: null });
      assert.equal(slot.effort.state, 'specified');
      assert(slot.reason.display.includes('DEBUT'), 'the debut reason is carried through');
    }
    assert.deepEqual(prepared.view.source_basis, emptyPrefix());
    const start = await host.client.startPreparedWorkout({ preparedId: prepared.preparedId });
    assert(start.acknowledged, start.code);
    startId = start.op_id; parentIds = [start.op_id];
    const ops = await opsOf(repository);
    originalStartOp = ops.find(o => o.op_id === startId);
    originalCapture = JSON.stringify(originalStartOp.prescription_capture);
  });

  await t.test('5. the stored Start carries the null-lane empty-prefix source_basis', () => {
    const stored = JSON.parse(originalCapture);
    assert.equal(stored.profile, 'earned/workout-prescription/v2');
    assert.deepEqual(stored.source_basis, emptyPrefix());
    assert.equal(stored.source_basis.W, 0);
    assert.equal(stored.source_basis.selection_id, null);
    assert.equal(stored.basis.plan_basis, PLAN_BASIS);
    assert.equal(stored.basis.input_basis, INPUT_BASIS);
    assert.deepEqual(stored.producer, PRODUCER);
  });

  await t.test('6. record three sets, including one unknown effort', async () => {
    const values = [
      { slot: 0, load: 35, reps: 9, reserve: { tag: 'exact', value: 2, unit: 'rep' } },
      { slot: 1, load: 35, reps: 8, reserve: { tag: 'at_least', value: 3, unit: 'rep' } },
      { slot: 2, load: 35, reps: 7 },   // effort not recorded — an unknown effort, never a guessed one
    ];
    const prepared = host.adapter; void prepared;
    const view = JSON.parse(originalCapture);
    for (const v of values) {
      const slot = view.slots[v.slot];
      const result = await host.client.execute('workout', { action: 'set', input: {
        session_start_op_id: startId, logical_set_slot: slot.logical_set_slot,
        lift_lineage_id: slot.lift_lineage_id, load: { value: v.load, unit: 'lb' },
        reps: { value: v.reps, unit: 'rep' }, ...(v.reserve ? { reserve: v.reserve } : {}) } });
      assert(result.acknowledged, result.code);
      setIds.push(result.op_id);
    }
    assert.equal(setIds.length, 3);
    const ops = await opsOf(repository);
    assert.equal(ops.filter(o => o.kind === 'session-set').length, 3);
    assert.equal(ops.filter(o => o.kind === 'session-start').length, 1);
  });

  await t.test('7. close the app and RELAUNCH over the same encrypted store', async () => {
    const before = await opsOf(repository);
    repository.close();
    const fresh = await f.fresh();
    repository = fresh.repository;
    host = hostOver(repository, { engineState, resolveWorkoutBasis, parents, stage });
    const after = await opsOf(repository);
    assert.equal(after.length, before.length, 'relaunch itself writes nothing');
    assert.equal(JSON.stringify(after.find(o => o.op_id === startId)), JSON.stringify(originalStartOp),
      'the Start operation is byte-identical after relaunch');
  });

  await t.test('8. resume the SAME session — no duplicate Start, instructions unchanged', async () => {
    const resumed = await host.client.prepareWorkoutContinuation({ session_start_op_id: startId });
    assert(resumed.prepared, resumed.code);
    assert.deepEqual(resumed.view.allowed_actions, ['set', 'skip', 'close']);
    assert.equal(resumed.view.current_reason, RESUME_REASON);
    assert.equal(resumed.view.slots.length, 5);
    assert.equal(resumed.view.slots.filter(s => s.completion).length, 3, 'three recorded sets are recovered');
    // Today's re-assessment is a separate object; the stored original is untouched.
    assert.equal(resumed.view.current.profile, 'earned/workout-prescription/v2');
    assert.deepEqual(resumed.view.current.source_basis, emptyPrefix());
    const ops = await opsOf(repository);
    assert.equal(ops.filter(o => o.kind === 'session-start').length, 1, 'resuming creates no second Start');
    assert.equal(JSON.stringify(ops.find(o => o.op_id === startId).prescription_capture), originalCapture,
      'the historical instructions are unchanged by resuming');
    // Two remaining slots recorded through the resumed handle.
    for (const slot of resumed.view.slots.filter(s => !s.completion)) {
      const handle = await host.client.prepareWorkoutContinuation({ session_start_op_id: startId });
      assert(handle.prepared, handle.code);
      const result = await host.client.executeResumedWorkout({ resumeId: handle.resumeId, action: 'set', input: {
        session_start_op_id: startId, logical_set_slot: slot.logical_set_slot,
        lift_lineage_id: slot.lift_lineage_id, load: { value: 60, unit: 'lb' }, reps: { value: 11, unit: 'rep' } } });
      assert(result.acknowledged, result.code);
      setIds.push(result.op_id);
    }
    assert.equal(setIds.length, 5);
  });

  await t.test('9. finish the workout', async () => {
    const close = await host.client.execute('workout', { action: 'close', input: {
      session_start_op_id: startId, completion_kind: 'normal', causal_parents: [startId, ...setIds] } });
    assert(close.acknowledged, close.code);
    parentIds = [close.op_id];
    const ops = await opsOf(repository);
    assert.deepEqual(kindsOf(ops.filter(o => o.class === 'session')),
      ['session-close', 'session-set', 'session-set', 'session-set', 'session-set', 'session-set', 'session-start']);
    assert.equal(ops.find(o => o.kind === 'session-close').payload.completion_kind, 'normal');
    assert(ops.filter(o => o.kind === 'session-set').every(o => o.session_start_op_id === startId));
  });

  await t.test('10. reopen history on a fresh client — byte-identical reads', async () => {
    repository.close();
    const fresh = await f.fresh();
    repository = fresh.repository;
    host = hostOver(repository, { engineState, resolveWorkoutBasis, parents, stage });
    const read = await host.client.readWorkoutHistory();
    assert(read.read, read.code);
    assert.equal(read.history.sessions.length, 1);
    const session = read.history.sessions[0];
    assert.equal(session.start.operation.op_id, startId);
    assert.equal(JSON.stringify(session.start.operation.prescription_capture), originalCapture,
      'the original capture survives two relaunches byte for byte');
    const again = await host.client.readWorkoutHistory();
    assert.equal(JSON.stringify(again.history), JSON.stringify(read.history), 'repeated reads are identical');
    const ops = await opsOf(repository);
    assert.equal(ops.filter(o => o.kind === 'session-start').length, 1, 'reading history writes nothing');
  });

  await t.test('11. apply one correction; the original stays immutable', async () => {
    const read = await host.client.readWorkoutHistory();
    const fact = read.history.sessions[0].projection.facts.find(x => x.source_op_id === setIds[0]);
    assert(fact, 'the first recorded set is addressable');
    assert.equal(fact.current.reps.value, 9);
    const before = (await opsOf(repository)).find(o => o.op_id === setIds[0]);
    const prepared = await host.client.prepareWorkoutEdit({ target_op_id: setIds[0] });
    assert(prepared.prepared, prepared.code);
    const committed = await host.client.commitWorkoutEdit({ editId: prepared.editId, action: 'correct',
      change: { reps: { value: 10, unit: 'rep' } } });
    assert(committed.acknowledged, committed.code);
    parentIds = [...parentIds, committed.op_id];
    const ops = await opsOf(repository);
    assert.equal(JSON.stringify(ops.find(o => o.op_id === setIds[0])), JSON.stringify(before),
      'the corrected set operation itself is unchanged');
    const after = await host.client.readWorkoutHistory();
    const corrected = after.history.sessions[0].projection.facts.find(x => x.source_op_id === setIds[0]);
    assert.equal(corrected.original.reps.value, 9);
    assert.equal(corrected.current.reps.value, 10);
    assert(corrected.edit_op_ids.includes(committed.op_id));
  });

  await t.test('12. next-target capture is produced, saved and reopened', async () => {
    repository.close();
    const fresh = await f.fresh();
    repository = fresh.repository;
    host = hostOver(repository, { engineState, resolveWorkoutBasis, parents, stage });
    const prepared = await host.client.prepareWorkout({ planned_split_slot_id: SLOT });
    // Either a v2 capture on the empty prefix, or the contained refusal that
    // the native trend context is unavailable. Both are acceptable outcomes;
    // a fabricated numeric trend is not.
    if (!prepared.prepared) {
      assert.match(String(prepared.code), /NATIVE_TREND_CONTEXT|PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED|WORKOUT_PREPARATION_INVALID/);
      const ops = await opsOf(repository);
      assert.equal(ops.filter(o => o.kind === 'session-start').length, 1, 'a refusal stores nothing');
      t.diagnostic('next prepare refused: ' + prepared.code);
      return;
    }
    assert.deepEqual(prepared.view.source_basis, emptyPrefix());
    assert.equal(prepared.view.profile, 'earned/workout-prescription/v2');
    const start = await host.client.startPreparedWorkout({ preparedId: prepared.preparedId });
    assert(start.acknowledged, start.code);
    const storedNext = JSON.stringify((await opsOf(repository)).find(o => o.op_id === start.op_id).prescription_capture);
    repository.close();
    const again = await f.fresh();
    repository = again.repository;
    host = hostOver(repository, { engineState, resolveWorkoutBasis, parents, stage });
    const reread = (await opsOf(repository)).find(o => o.op_id === start.op_id);
    assert.equal(JSON.stringify(reread.prescription_capture), storedNext, 'the next-target capture reopens byte-identically');
    const history = await host.client.readWorkoutHistory();
    assert.equal(history.history.sessions.length, 2, 'the second session is visible in history');
  });

  await t.test('13. unavailable providers refuse explicitly and store nothing', async () => {
    const before = await opsOf(repository);
    // (a) string-lane basis: no assembled recovery handle exists in this host.
    const stringLane = createUnavailableStringLaneResolver();
    assert.throws(() => stringLane(), { code: 'SOURCE_WORKOUT_BASIS_UNAVAILABLE' });
    const refusingHost = hostOver(repository, { engineState, resolveWorkoutBasis: stringLane, parents, stage });
    const refused = await refusingHost.client.prepareWorkout({ planned_split_slot_id: SLOT });
    assert.equal(refused.prepared, undefined);
    assert(refused.code, 'the refusal names a code');
    assert.deepEqual(await opsOf(repository), before, 'the string-lane refusal wrote nothing');
    // (b) native trend context: the refusal resolver never answers.
    const trend = createUnavailableNativeTrendContext();
    assert.throws(() => trend({ start_op_id: 'x', source_revision: 1, effective: {} }),
      { code: 'NATIVE_TREND_CONTEXT_UNAVAILABLE' });
    // (c) the null lane refuses a generation that is not zero-import.
    const withImport = { collections: { [Source.COLLECTION]: { 'row-1': {} }, sync: { frontier: { W: 0 } } } };
    assert.throws(() => resolveWorkoutBasis(withImport), { code: 'WORKOUT_BASIS_IMPORT_PRESENT' });
    const withPrefix = { collections: { sync: { frontier: { W: 3 } } } };
    assert.throws(() => resolveWorkoutBasis(withPrefix), { code: 'WORKOUT_BASIS_FRONTIER_UNPROVEN' });
    // (d) a string claim with no string lane composed is refused by the composite.
    assert.throws(() => refusingHost.reader.workoutInput({}, { W: 0, log_digest: 'x', selection_id: 'source-A' }),
      { code: 'SOURCE_PROJECTION_LANE_UNAVAILABLE' });
    assert.deepEqual(await opsOf(repository), before, 'no refusal in this step wrote anything');
  });

  await t.test('14. the composed engine root is the accepted L candidate at its accepted bytes', () => {
    assert.equal(pins['rebuild/engine/performed.cjs'], '2372e66ba4e31f7229c870e4d1e2e95855d7a49ee705394c23b53b84ec249f3a');
    for (const name of ['plan.cjs', 'progression.cjs', 'sleep.cjs', 'today.cjs', 'writers.cjs'])
      assert(pins['rebuild/engine/' + name], name);
    // engine-runtime.cjs carries this branch's single literal-require change
    // (accepted L bytes were 9be21897…); see its SLICE-A0 comment.
    assert.equal(pins['rebuild/m4/workout/engine-runtime.cjs'], '4d48a9b13557072284cc017c132b32cc15ea08c9107120baf6fa85c496ea50f0');
  });

  repository.close();
});
