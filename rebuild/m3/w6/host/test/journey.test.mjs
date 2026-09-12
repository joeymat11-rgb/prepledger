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
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { webcrypto, createHash } from 'node:crypto';
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
const { createCleanInitState, SCHEMA_V, AUTONOMY_FLOOR,
  BLACKOUT_MEMBERS, MODEL_MEMBERS } = require('../../../../m4/workout/athlete-state.cjs');
const { createNullLaneWorkoutBasis, createUnavailableStringLaneResolver } = require('../../../../m4/workout/workout-basis.cjs');
const { createWorkoutResumePolicy } = require('../../../../m4/workout/resume-policy.cjs');
// B-NTC — the qualified nativeTrendContext provider (step 17).
const { createNativeTrendContextBinding, createEmptyHistoryDayFacts } = require('../../../../m4/workout/native-trend-context.cjs');
// The engine carriers landed in rebuild/engine with M2-NATIVE-CARRIERS, so the
// journey now composes the ACCEPTED runtime straight off disk; the scratch
// composition root this test used to build is gone. The host's bundleable
// mirror is covered by engine-equivalence.test.cjs.
const AcceptedRuntime = require('../../../../m4/workout/engine-runtime.cjs');
const HostRuntime = require('../engine-runtime-host.cjs');
const { DAY, SETUP, clockFor } = require('./journey-fixture.cjs');

const PRODUCER = Object.freeze({ app_build: 'synthetic-test-identity', engine_build: 'native-candidate-L',
  rule_profile: Adapter.PROFILE, source_schema: 'synthetic-clean-init' });
const RESUME_REASON = 'Current assessment recomputed by this host from the same clean-init state; not a personal prescription.';
const PLAN_BASIS = 'NO_ACCEPTED_PLAN';
const INPUT_BASIS = 'native-only/zero-import';
const SLOT = 'synthetic-slot';

const { createEngineRuntime } = AcceptedRuntime;
// Pinned here so a silent edit to the host's bundleable mirror is a test
// failure; its behavioural equivalence is engine-equivalence.test.cjs's job.
// Re-pinned once, with the accepted runtime it mirrors, under DECISIONS:109 —
// see step 14 for the reason and for the parent refusal it does not restate.
const HOST_RUNTIME_SHA256 = 'e210bfa04ce61ef64cc1cc3244d4af4545ca99a0a8610608bae2dccf821b1b4d';
const emptyPrefix = () => Source.basis({ W: 0, log_digest: Source.createPrefixHasher().digest(), selection_id: null });

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
    // No seed/migrate/merge import: the state has none of the members those add
    // and nothing here needs. `trend` stays absent because this athlete has
    // declared no bodyweight and nothing may invent one.
    for (const absent of ['trend', 'feedRules']) assert(!Object.hasOwn(engineState, absent), absent);
    /* H3 (DECISIONS:124) MOVED THIS CELL, deliberately. `model` and `blackout`
       used to be absent too, and that absence is exactly what made the accepted
       engine throw for a brand-new athlete (energy.cjs:370, then energy.cjs:84).
       The constructor now writes both. The cell therefore asserts the stronger
       thing: they are present, closed over the member sets the module itself
       declares, and every value is this athlete's own setup date or an explicit
       absence — still no import, and still not one number. */
    assert.deepEqual(Reflect.ownKeys(engineState.blackout), BLACKOUT_MEMBERS);
    assert.deepEqual(Reflect.ownKeys(engineState.model), MODEL_MEMBERS);
    assert.equal(engineState.model.anchorISO, engineState.split[0].from, 'anchored on his own setup date');
    assert.equal(engineState.model.drip, null);
    assert.equal(engineState.model.src, null);
    assert(engineState.blackout.until < engineState.split[0].from, 'no blackout in force from day one');
    assert.equal(Object.hasOwn(engineState.model, 'lean'), false, 'no body-composition anchor is invented');
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

  await t.test('14. the engine this host composed is the accepted runtime, at the bytes its package pins', () => {
    const sha = file => createHash('sha256')
      .update(readFileSync(fileURLToPath(new URL(file, import.meta.url)))).digest('hex');
    /* A0 still does not change these files. The pin below MOVED ONCE, and only
       for the reason the ledger records: DECISIONS:109 (PATH A) rules that the
       M2-B-NTC child package re-pins engine-runtime.cjs and the EXPOSED set, so
       the accepted surface is now
       ['genSession','rirPlan','dayWeather','cleanAtDate'] — the two day
       predicates the B-NTC nativeTrendContext provider asks rather than
       restates. The parent M2-NATIVE-CARRIERS profile keeps its own pin at the
       old bytes and therefore refuses; that refusal is the child's to supersede
       and is not re-stated here. The bundleable variant is the separate
       host-owned mirror below, and engine-equivalence.test.cjs proves the two
       still agree name for name. */
    assert.equal(sha('../../../../m4/workout/engine-runtime.cjs'),
      'c03732e896a9596a06edd304bb8f23f2340c29b5e036043a4205f225916be936',
      'accepted engine-runtime.cjs is at the M2-B-NTC re-pinned bytes');
    assert.equal(sha('../engine-runtime-host.cjs'), HOST_RUNTIME_SHA256, 'host runtime is at its pinned bytes');
    // The runtime the journey actually ran is the accepted one.
    assert.deepEqual(AcceptedRuntime.COMPOSITION.modules, HostRuntime.MODULES);
    assert.equal(AcceptedRuntime.COMPOSITION.modules.length, 12);
    assert.deepEqual(AcceptedRuntime.COMPOSITION.exposed.slice().sort(),
      ['cleanAtDate', 'dayWeather', 'genSession', 'rirPlan'], 'the re-pinned EXPOSED surface');
    for (const forbidden of ['seed.cjs', 'migrate.cjs', 'merge.cjs'])
      assert(AcceptedRuntime.COMPOSITION.forbiddenImports.includes(forbidden), forbidden);
  });

  // A0 review R1 / reviewer probe P1. A split whose `from` is one day AFTER
  // the host's day is well formed, so createCleanInitState accepts it — and
  // rebuild/engine/plan.cjs dayType finds no entry with from <= today and
  // falls back to a fixed Mon/Thu=U, Tue/Fri=L, Wed=REFEED week. On 2026-09-04
  // (a Friday) that fallback serves 'leg-press'. This step proves both halves:
  // the fallback really is what the engine would serve, and the host refuses
  // before it can be served.
  await t.test('15. a split not yet in force is refused, not served from the fallback week', async () => {
    // Its own clean store, so this step depends on nothing the journey left behind.
    const own = await scaffold();
    const basisFor = () => createNullLaneWorkoutBasis({ sourceCodec: Source,
      planBasis: PLAN_BASIS, inputBasis: INPUT_BASIS, causalParents: () => [] });
    try {
      const future = structuredClone(SETUP);
      future.split.from = '2026-09-05';           // one day after DAY
      const futureState = createCleanInitState({ setup: future });
      assert.equal(futureState.split[0].from, '2026-09-05', 'the state itself is well formed and accepted');

      // What the engine would do unguarded: the fallback week's Friday = L.
      const unguarded = own.parents.engine.genSession(structuredClone(futureState), DAY, undefined);
      assert(unguarded, 'the fallback week does produce a session');
      assert.deepEqual(unguarded.ex.map(card => card.id), ['leg-press'],
        'unguarded, the engine serves the fallback week, not this athlete\'s Friday');

      // What the host does: refuse, and store nothing.
      const before = await opsOf(own.f.repo);
      const guarded = hostOver(own.f.repo, { engineState: futureState,
        resolveWorkoutBasis: basisFor(), parents: own.parents, stage: own.stage });
      assert.throws(() => guarded.workoutProducer({ collections: {} }, { basis: {}, source_basis: emptyPrefix() }),
        { code: 'WORKOUT_SPLIT_NOT_IN_FORCE' }, 'the producer refuses directly');
      const refused = await guarded.client.prepareWorkout({ planned_split_slot_id: SLOT });
      assert.notEqual(refused.prepared, true, 'prepareWorkout does not prepare a fallback-week session');
      assert(refused.code, 'the refusal names a code');
      assert.deepEqual(await opsOf(own.f.repo), before, 'the refusal stored nothing');

      // The same split, once in force, is served normally — the guard is about
      // the day, not about rejecting this athlete.
      const inForce = structuredClone(SETUP);
      inForce.split.from = DAY;                    // in force exactly today
      const okHost = hostOver(own.f.repo, { engineState: createCleanInitState({ setup: inForce }),
        resolveWorkoutBasis: basisFor(), parents: own.parents, stage: own.stage });
      const prepared = await okHost.client.prepareWorkout({ planned_split_slot_id: SLOT });
      assert(prepared.prepared, prepared.code);
      assert.deepEqual([...new Set(prepared.view.slots.map(s => s.lift_lineage_id))], ['db-bench', 'lat-pulldown']);
    } finally { own.f.repo.close(); }
  });

  // A0 review R2. The two engine-owned literals in athlete-state.cjs are
  // checked against the engine itself, so a drift is a test failure rather
  // than a silent divergence. athlete-state.cjs still imports no engine file.
  await t.test('16. the clean-init state\'s engine-owned literals match the engine', () => {
    const constants = require('../../../../engine/constants.cjs')({}, {});
    assert.equal(SCHEMA_V, constants.SCHEMA_V, 'v is the engine\'s SCHEMA_V (constants.cjs)');
    assert.equal(createCleanInitState({ setup: SETUP }).v, constants.SCHEMA_V);
    assert.equal(AUTONOMY_FLOOR, constants.AUTONOMY_LEVELS[0],
      'the autonomy floor is the engine\'s most-supervised level (constants.cjs AUTONOMY_LEVELS)');
    const plan = createCleanInitState({ setup: SETUP }).plan;
    assert.deepEqual(Object.keys(plan), ['autonomy'], 'no invented plan member');
    assert.equal(plan.autonomy, 'propose');
    assert(!Object.hasOwn(plan, 'mode'), 'plan.mode is not engine vocabulary and is not written');
  });

  // B-NTC. The second training day on the SAME lift is the wall DECISIONS:102
  // records: with A0's createUnavailableNativeTrendContext the engine reaches
  // liftTrend over a native row, asks for a trend context, gets a throw, and
  // refuses PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED before any write. This
  // step runs that day twice over the SAME stored history — once with A0's
  // refusal and once with the qualified provider — and asserts both halves:
  // the wall is real, and the provider is what removes it.
  await t.test('17. the second day on the same lift: refused without a trend context, prepared with one', async () => {
    const NEXT = '2026-09-11';                       // DAY + 7, the same Friday U day
    const LIFT = 'db-bench';
    // Its own clean store, conducted from nothing, so this step depends on no
    // state the rest of the journey left behind.
    const own = await scaffold();
    try {
      // The clean-init athlete's every lift starts at `w: null`, which
      // rebuild/engine/today.cjs genSession reads as a permanent DEBUT — and a
      // DEBUT never reaches liftTrend, which is why steps 4-12 above never ask
      // for a trend context at all (A0-REPORT §"not qualified" 5). This host
      // does not write `w` back to the state; the frozen engine's
      // writers.completeSession is what sets it in the real app. So this step
      // states that one fact explicitly: ONE lift carries a working load taken
      // from its own declared `steps`, which is the athlete DECISIONS:102
      // describes (a lift with a recorded load, coming back for its second
      // session). Nothing else about the clean-init state is changed.
      const state = structuredClone(createCleanInitState({ setup: SETUP }));
      state.exercises.find(e => e.id === 'db-bench').w = 35;
      let ids = [], stageDay = DAY;
      // One stage whose clock follows the conducted day, so each session's
      // stored `effective.local_date` is the day it was actually trained.
      const ownStage = createT2Stage(() => ({ ...config(), clock: { ...config().clock, today: () => stageDay } }),
        { allowInbound: true, workoutCommands: Commands.createWorkoutCommands({ prescriptionCapture: own.parents.capture }) });
      const basis = createNullLaneWorkoutBasis({ sourceCodec: Source,
        planBasis: PLAN_BASIS, inputBasis: INPUT_BASIS, causalParents: () => ids });
      const hostAt = (day, nativeTrendContext, nativeTrendBinding) => composeWorkoutHost({
        repository: own.f.repo, stage: ownStage, namespace: 'synthetic-athlete/device-A',
        athleteId: 'ath-1', deviceId: 'dev-A',
        sessionEpoch: 1, isCurrentSession: x => x === 1, observationEpoch: () => 1,
        observationGuard: { run: async (_kind, fn) => fn() }, validateCommit: () => null,
        keys: own.parents.keys, crypto: webcrypto,
        createDurablePublicClient,
        createNullSelectionRegistrar: SourceProjection.createNullSelectionRegistrar,
        createSourceProjectionReader: SourceProjection.createSourceProjectionReader,
        createEngineWorkoutCapture: Adapter.createEngineWorkoutCapture,
        createEngineHistoryProjector: History.createEngineHistoryProjector,
        createWorkoutResumePolicy, parseStrictJson, projectWorkoutRecords,
        prescriptionCapture: own.parents.capture, sourceCodec: Source,
        engine: createEngineRuntime({ clock: clockFor(day), nativeTrendContext }),
        engineState: state, clock: clockFor(day),
        workoutProducerIdentity: PRODUCER, resolveWorkoutBasis: basis, resumeReason: RESUME_REASON,
        plannedSplitSlotId: SLOT, ...(nativeTrendBinding ? { nativeTrendBinding } : {}),
      });

      // The athlete's own two training days, conducted through the product
      // entry point exactly as A2 conducts them: Friday U, Saturday L. Day
      // 2026-09-11 then comes back to the Friday lifts — DECISIONS:102's day+3.
      async function conduct(day) {
        stageDay = day;
        const host9 = hostAt(day, createUnavailableNativeTrendContext());
        const p = await host9.client.prepareWorkout({ planned_split_slot_id: SLOT });
        assert(p.prepared, day + ' prepares for this athlete: ' + p.code);
        const s = await host9.client.startPreparedWorkout({ preparedId: p.preparedId });
        assert(s.acknowledged, s.code);
        ids = [s.op_id];
        const sets = [];
        for (const slot of p.view.slots) {
          const r = await host9.client.execute('workout', { action: 'set', input: {
            session_start_op_id: s.op_id, logical_set_slot: slot.logical_set_slot,
            lift_lineage_id: slot.lift_lineage_id, load: { value: 35, unit: 'lb' },
            reps: { value: 9, unit: 'rep' }, reserve: { tag: 'exact', value: 2, unit: 'rep' } } });
          assert(r.acknowledged, r.code);
          sets.push(r.op_id);
        }
        assert(sets.length, day + ' recorded every prescribed slot');
        const c = await host9.client.execute('workout', { action: 'close', input: {
          session_start_op_id: s.op_id, completion_kind: 'normal',
          causal_parents: [s.op_id, ...sets] } });
        assert(c.acknowledged, c.code);
        ids = [c.op_id];
        return p.view.slots.map(x => x.lift_lineage_id);
      }
      await conduct(DAY);            // Friday — db-bench, lat-pulldown
      await conduct('2026-09-05');   // Saturday — leg-press
      stageDay = NEXT;
      const after = await opsOf(own.f.repo);

      // (a) DAY TWO, A0's honest refusal — the S2 wall through the product entry point.
      let asked = 0;
      const refusing = createUnavailableNativeTrendContext();
      const walled = hostAt(NEXT, r => { asked++; return refusing(r); });
      const refused = await walled.client.prepareWorkout({ planned_split_slot_id: SLOT });
      t.diagnostic('day two: asked=' + asked + ' prepared=' + refused.prepared + ' code=' + refused.code +
        ' producer=' + JSON.stringify(walled.lastProducerRefusal()));
      assert.notEqual(refused.prepared, true, 'the unqualified host does not prepare the second same-lift day');
      assert.equal(walled.lastProducerRefusal()?.code, 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED');
      assert.equal(walled.lastProducerRefusal().reason, 'resolver_failed');
      assert.deepEqual(await opsOf(own.f.repo), after, 'the refusal stored nothing');

      // (b) The same day, the same history, the qualified provider.
      const binding = createNativeTrendContextBinding({
        dayFacts: createEmptyHistoryDayFacts({ state }) });
      const open = hostAt(NEXT, binding.resolve, binding);
      const prepared = await open.client.prepareWorkout({ planned_split_slot_id: SLOT });
      assert(prepared.prepared, 'the qualified host prepares the day the wall refused: ' + prepared.code);
      assert.equal(open.lastProducerRefusal(), null, 'no producer refusal on the qualified path');
      assert.equal(prepared.view.profile, 'earned/workout-prescription/v2');
      assert(prepared.view.slots.some(s => s.lift_lineage_id === LIFT), 'the prepared day carries ' + LIFT);
      assert.deepEqual(await opsOf(own.f.repo), after, 'preparing still writes nothing until Start');

      // (c) The binding does not outlive the preparation it was made for.
      assert.equal(binding.bound(), null, 'the producer unbound the facts when it returned');
      assert.throws(() => binding.resolve({ start_op_id: 'x', source_revision: 1, effective: {} }),
        { code: 'NATIVE_TREND_CONTEXT_UNQUALIFIED', reason: 'no_bound_source_facts' });

      // (d) A context bound to the wrong revision is refused, never answered:
      //     the engine's own PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED comes back.
      const stale = createNativeTrendContextBinding({
        dayFacts: createEmptyHistoryDayFacts({ state }) });
      const staleHost = hostAt(NEXT,
        request => stale.resolve({ ...request, source_revision: request.source_revision + 1 }), stale);
      const staleRefusal = await staleHost.client.prepareWorkout({ planned_split_slot_id: SLOT });
      assert.notEqual(staleRefusal.prepared, true, 'a stale-revision context does not prepare');
      assert.equal(staleHost.lastProducerRefusal()?.code, 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED');
      assert.deepEqual(await opsOf(own.f.repo), after, 'the stale refusal stored nothing');

      // (e) An athlete who has recorded a sleep night is refused, not guessed
      //     about: the day-facts reader cannot qualify hard/debt for a native
      //     session yet, so the whole preparation fails closed (PM Q1).
      const withNight = structuredClone(state);
      withNight.sleep = { nights: [{ d: '2026-09-10', h: 5 }] };
      const nightBinding = createNativeTrendContextBinding({
        dayFacts: createEmptyHistoryDayFacts({ state: withNight }) });
      const nightHost = hostAt(NEXT, nightBinding.resolve, nightBinding);
      const nightRefusal = await nightHost.client.prepareWorkout({ planned_split_slot_id: SLOT });
      assert.notEqual(nightRefusal.prepared, true, 'a recorded sleep night is not silently read as clean');
      assert.equal(nightHost.lastProducerRefusal()?.code, 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED');
      assert.deepEqual(await opsOf(own.f.repo), after, 'that refusal stored nothing either');
    } finally { own.f.repo.close(); }
  });

  repository.close();
});
