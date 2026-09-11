// local-host-journey.test.mjs — the PM's REAL host composition over the LOCAL ERA.
//
// rebuild/m3/w6/host/test/journey.test.mjs composes composeWorkoutHost over
// SYNTHETIC collaborators: a synthetic identity, a synthetic signing key, a
// synthetic lease, a pass-through observation guard and validateCommit
// () => null. That is the right test for a binding-only module. This is the
// other half: the SAME composeWorkoutHost, the SAME engine runtime and the same
// clean-init athlete, over collaborators that came out of a real first-run
// installation — rebuild/m3/w6/local/host-bindings.mjs — with nothing synthetic
// injected into the durable client scope at all.
//
// What is still test-supplied and labelled as such: the athlete setup and the
// producer identity (SETUP / PRODUCER, shared with the host's own fixture) and
// fake-indexeddb standing in for the phone's IndexedDB. The identity key, the
// lease, the authority key, the session epoch, the commit validator and the
// observation guard are the installation's own — step 8 asserts that nothing
// test-owned reached the sealed generation's metadata.
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { webcrypto } from 'node:crypto';
import { createRequire } from 'node:module';
import { createDurablePublicClient } from '../public-client.mjs';
import { parseStrictJson } from '../strict-json.mjs';
import { projectWorkoutRecords } from '../../../m4/workout/project-history.mjs';
import { composeWorkoutHost, createUnavailableNativeTrendContext } from '../host/workout-host.mjs';
import { openLocalDurableClient, DERIVED, markerDatabaseName } from '../local/local-client.mjs';
import { localHostBindings, localHostAuthorityKid, readLocalHostAuthority,
  LOCAL_HOST_CLIENT, LOCAL_HOST_INSTALL, LOCAL_HOST_AUTHORITY_PROFILE,
  LOCAL_OBSERVATION_KINDS, INBOUND_OBSERVATION_KINDS } from '../local/host-bindings.mjs';
import { readFileSync } from 'node:fs';
import { readLocalEra, localEraLeaseId, leaseRenewalDue } from '../local/local-era.mjs';
import { keysDatabaseName } from '../local/local-keys.mjs';

const require = createRequire(import.meta.url);
const W5 = require('../../w5/public-client.cjs');
const Ops = require('../../../client/ops.cjs');
const Source = require('../../w5/source/codec.cjs');
const Capture = require('../../../m4/workout/capture.cjs');
const Commands = require('../../../m4/workout/commands.cjs');
const Adapter = require('../../../m4/workout/engine-capture.cjs');
const History = require('../../../m4/workout/engine-history.cjs');
const SourceProjection = require('../../../m4/workout/source-projection.cjs');
const { createCleanInitState } = require('../../../m4/workout/athlete-state.cjs');
const { createNullLaneWorkoutBasis } = require('../../../m4/workout/workout-basis.cjs');
const { createWorkoutResumePolicy } = require('../../../m4/workout/resume-policy.cjs');
const { createEngineRuntime } = require('../../../m4/workout/engine-runtime.cjs');
// The host's own fixture, imported rather than copied: one athlete, one day.
const { DAY, SETUP, clockFor } = require('../host/test/journey-fixture.cjs');

const DB = 'earned-local-host-test', NS = 'joe/phone-A', ATHLETE = 'ath-1', DEVICE = 'dev-phone-A';
const ENROLLED_AT = DAY + 'T08:00:00.000Z', DAY_MS = 86_400_000;
const PRODUCER = Object.freeze({ app_build: 'synthetic-test-identity', engine_build: 'native-candidate-L',
  rule_profile: Adapter.PROFILE, source_schema: 'synthetic-clean-init' });
const RESUME_REASON = 'Current assessment recomputed by this host from the same clean-init state; not a personal prescription.';
const PLAN_BASIS = 'NO_ACCEPTED_PLAN', INPUT_BASIS = 'native-only/zero-import', SLOT = 'synthetic-slot';
const SCOPE_MEMBERS = ['repository', 'stage', 'namespace', 'athleteId', 'deviceId', 'sessionEpoch',
  'isCurrentSession', 'observationEpoch', 'observationGuard', 'validateCommit', 'keys', 'crypto'];

// A clock whose day this test can move, so the era's self-renewal can be
// reached without waiting 200 days.
function movableClock() {
  const state = { offset: 0 };
  const iso = () => new Date(Date.parse(ENROLLED_AT) + state.offset * DAY_MS).toISOString();
  return { state, clock: { now: iso, today: () => iso().slice(0, 10), tz: '+00:00', monotonicMs: () => 0 } };
}
const capture = () => Capture.createPrescriptionCapture({ parseStrictJson, profile: Capture.SOURCE_PROFILE, sourceCodec: Source });

async function openClient(indexedDB, clock, prescriptionCapture) {
  return openLocalDurableClient({ indexedDB, crypto: webcrypto, databaseName: DB, namespace: NS,
    athleteId: ATHLETE, deviceId: DEVICE, clock,
    workoutCommands: Commands.createWorkoutCommands({ prescriptionCapture }) });
}

// composeWorkoutHost, over the local-era bindings and nothing else. Every
// durable-client member comes from `bindings`; the rest are the same product
// constructors the host's own journey names.
function hostOver(bindings, { prescriptionCapture, engineState, resolveWorkoutBasis }) {
  return composeWorkoutHost({
    ...bindings,
    createDurablePublicClient,
    createNullSelectionRegistrar: SourceProjection.createNullSelectionRegistrar,
    createSourceProjectionReader: SourceProjection.createSourceProjectionReader,
    createEngineWorkoutCapture: Adapter.createEngineWorkoutCapture,
    createEngineHistoryProjector: History.createEngineHistoryProjector,
    createWorkoutResumePolicy, parseStrictJson, projectWorkoutRecords,
    prescriptionCapture, sourceCodec: Source,
    engine: createEngineRuntime({ clock: clockFor(DAY), nativeTrendContext: createUnavailableNativeTrendContext() }),
    engineState, clock: clockFor(DAY), workoutProducerIdentity: PRODUCER,
    resolveWorkoutBasis, resumeReason: RESUME_REASON, plannedSplitSlotId: SLOT,
  });
}
const opsOf = async repository => Object.values((await repository.load()).generation.collections.ops || {});
function eraseRecord(indexedDB, name, store, key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result, tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(key);
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
  });
}

test('local-era host journey — first run, workout through the public client, relaunch, resume, one generation', async t => {
  const indexedDB = new IDBFactory();
  const { clock } = movableClock();
  const prescriptionCapture = capture();
  let client = await openClient(indexedDB, clock, prescriptionCapture);
  const engineState = createCleanInitState({ setup: SETUP });
  let parentIds = [];
  const resolveWorkoutBasis = createNullLaneWorkoutBasis({ sourceCodec: Source,
    planBasis: PLAN_BASIS, inputBasis: INPUT_BASIS, causalParents: () => parentIds });
  let bindings = null, host = null, era = null, enrolled = null;
  let startId = null, setIds = [], originalCapture = null;

  await t.test('1. first run enrolls, boots, and the bindings install the era\'s own P-256 lease', async () => {
    assert.deepEqual(client.status(), { state: 'first-run', code: 'LOCAL_FIRST_RUN' });
    // The scope cannot exist before boot(): boot is where the era's lease
    // self-renewal runs, and the public client's bridge never calls it.
    await assert.rejects(() => client.hostBindings(), { code: 'LOCAL_HOST_BINDINGS_BOOT_REQUIRED', state: 18 });
    enrolled = await client.enroll({ profile: 'host-clean-init' });
    assert.equal(enrolled.enrolled, true);
    assert.equal(enrolled.leaseId, localEraLeaseId(enrolled.eraId));
    await assert.rejects(() => client.hostBindings(), { code: 'LOCAL_HOST_BINDINGS_BOOT_REQUIRED' });
    const booted = await client.boot();
    assert.equal(booted.ready, true);
    assert.equal(booted.revision, 1);

    bindings = await client.hostBindings();
    assert.deepEqual(Object.keys(bindings), SCOPE_MEMBERS, 'exactly the durable-client scope, no thirteenth member');
    assert.equal(bindings[LOCAL_HOST_CLIENT], client);
    assert.equal(bindings[LOCAL_HOST_INSTALL].installed, true);
    assert.equal(bindings.namespace, NS);
    assert.equal(bindings.athleteId, ATHLETE);
    assert.equal(bindings.deviceId, DEVICE);
    assert.equal(typeof bindings.sessionEpoch, 'string');
    assert.equal(bindings.isCurrentSession(bindings.sessionEpoch), true);
    assert.equal(bindings.isCurrentSession('other'), false);
    assert.equal(bindings.observationEpoch(), bindings.sessionEpoch);
    assert.equal(bindings.validateCommit({ batch: null }).code, 'LOCAL_SIDECAR_UNPROVEN',
      'the validator fails closed when it is reached without this attempt\'s stage record');

    const sealed = (await bindings.repository.load()).generation;
    era = readLocalEra(sealed.metadata);
    const authority = readLocalHostAuthority(sealed.metadata, era.eraId);
    assert.equal(authority.profile, LOCAL_HOST_AUTHORITY_PROFILE);
    assert.equal(authority.kid, localHostAuthorityKid(era.eraId));
    assert.deepEqual(bindings.keys, [{ kid: authority.kid, publicKey: authority.publicJwk }]);
    assert.equal(bindings.keys[0].publicKey.d, undefined, 'only the public half is pinned');
    // The W5 lease is the era lease, field for field, with the same lease_id.
    const lease = sealed.metadata.authorityLease;
    assert.equal(lease.lease_id, localEraLeaseId(era.eraId));
    assert.equal(lease.schema_version, 2);
    assert.equal(lease.not_after, era.lease.not_after);
    assert.equal(lease.not_before, era.lease.not_before);
    assert.deepEqual(lease.range, era.lease.range);
    assert.match(lease.signature, new RegExp(`^ES256\\.${authority.kid}\\.[A-Za-z0-9_-]{86}$`));
    // It verifies under the UNCHANGED W5 phone verifier, and under nothing else.
    const verifier = W5.createPublicVerifier({ keys: bindings.keys, subtle: webcrypto.subtle });
    assert.equal(await verifier.verifyLease(lease), true);
    assert.equal(await verifier.verifyLease({ ...lease, device_id: 'dev-other' }), false);
    assert.deepEqual(sealed.collections.sync.frontier, { W: 0, authorityW: 0 });
  });

  await t.test('2. a second hostBindings() over an installed era writes nothing', async () => {
    const before = await bindings.repository.load();
    const again = await client.hostBindings();
    assert.equal(again[LOCAL_HOST_INSTALL].installed, false);
    const after = await bindings.repository.load();
    assert.equal(after.revision, before.revision);
    assert.equal(after.token, before.token);
    bindings = again;
  });

  await t.test('3. the host prepares and starts today\'s workout through the public client', async () => {
    host = hostOver(bindings, { prescriptionCapture, engineState, resolveWorkoutBasis });
    const prepared = await host.client.prepareWorkout({ planned_split_slot_id: SLOT });
    assert(prepared.prepared, prepared.code);
    assert.deepEqual([...new Set(prepared.view.slots.map(s => s.lift_lineage_id))], ['db-bench', 'lat-pulldown'],
      'this athlete\'s own U day, not the engine\'s fallback week');
    assert.equal(prepared.view.slots.length, 5);
    const start = await host.client.startPreparedWorkout({ preparedId: prepared.preparedId });
    assert(start.acknowledged, start.code);
    startId = start.op_id; parentIds = [start.op_id];
    const ops = await opsOf(bindings.repository);
    const startOp = ops.find(o => o.op_id === startId);
    originalCapture = JSON.stringify(startOp.prescription_capture);
    assert.equal(startOp.kind, 'session-start');
    assert.equal(startOp.schema_version, 2);
    // THE POINT OF THE WHOLE FILE: a real operation, in the sealed generation,
    // carrying this installation's own lease_id.
    assert.equal(startOp.lease_id, localEraLeaseId(era.eraId));
    assert.equal(JSON.parse(originalCapture).profile, 'earned/workout-prescription/v2');
  });

  await t.test('4. record three sets through the host client', async () => {
    const view = JSON.parse(originalCapture);
    for (const [index, value] of [[0, 9], [1, 8], [2, 7]]) {
      const slot = view.slots[index];
      const result = await host.client.execute('workout', { action: 'set', input: {
        session_start_op_id: startId, logical_set_slot: slot.logical_set_slot,
        lift_lineage_id: slot.lift_lineage_id, load: { value: 35, unit: 'lb' },
        reps: { value, unit: 'rep' } } });
      assert(result.acknowledged, result.code);
      setIds.push(result.op_id);
    }
    const ops = await opsOf(bindings.repository);
    assert.equal(ops.filter(o => o.kind === 'session-set').length, 3);
    assert(ops.every(o => o.lease_id === localEraLeaseId(era.eraId)));
  });

  await t.test('5. a weighIn through the C1 path and the workout share ONE generation', async () => {
    const saved = await client.execute('weighIn', { date: DAY, lb: 170.6 });
    assert(saved.acknowledged, saved.code);
    const loaded = await bindings.repository.load();
    const ops = Object.values(loaded.generation.collections.ops);
    assert.equal(ops.length, 5, 'one start, three sets, one reading — in one generation');
    assert.equal(ops.filter(o => o.class === 'reading').length, 1);
    assert.equal(ops.filter(o => o.class === 'session').length, 4);
    // One checkpoint, and it describes the WHOLE generation, not one writer's half.
    assert.deepEqual(loaded.generation.collections.meta.checkpoint.counts,
      { ops: ops.length, outbox: Object.keys(loaded.generation.collections.outbox).length });
    assert.equal(loaded.generation.collections.meta.device.seq, ops.length);
    assert.deepEqual([...new Set(ops.map(o => o.lease_id))], [localEraLeaseId(era.eraId)],
      'one lease_id across both write paths');
    assert.deepEqual([...new Set(ops.map(o => o.device_seq))].sort((a, b) => a - b), [1, 2, 3, 4, 5]);
    // The sidecar C1 owns was carried, not authored, by the host writes: its
    // basis is behind the ops, which boot() reports as stale rather than damage.
    const booted = await client.boot();
    assert.deepEqual(booted.derived, { profile: 'host-clean-init' });
    assert.equal(booted.derivedStale, true);
    assert.equal(booted.derivedCode, null);
    assert.equal(booted.ops, 5);
    assert.deepEqual(loaded.generation.collections[DERIVED].basis, { opCount: 0, lastOpId: null });
  });

  await t.test('6. close the app; the closed session is no longer current and a late host write is refused', async () => {
    const stale = host;
    client.close();
    // The scope's own currentness answer. composeWorkoutHost consumes exactly
    // this, and the public client asks it in stageVerified and again in
    // completedOutcome, so a write that outlives its session cannot be Saved.
    assert.equal(bindings.isCurrentSession(bindings.sessionEpoch), false);
    const late = await stale.client.execute('workout', { action: 'set', input: {
      session_start_op_id: startId, logical_set_slot: 'x', lift_lineage_id: 'db-bench',
      load: { value: 35, unit: 'lb' }, reps: { value: 5, unit: 'rep' } } });
    assert.equal(late.acknowledged, false);
    // In practice the closed repository handle answers first (state 18 needs
    // recovery, which a reopened factory performs); the session fence above is
    // what stops a still-open store accepting a retired session's write.
    assert.equal(late.state, 18, 'late write: ' + JSON.stringify(late));
    assert.equal(typeof late.code, 'string');
    assert.equal(late.durableRevision, undefined);
  });

  await t.test('7. RELAUNCH a new factory over the same store — ops survive and resume works', async () => {
    client = await openClient(indexedDB, clock, prescriptionCapture);
    assert.deepEqual(client.status(), { state: 'ready', code: 'LOCAL_PRESENT' });
    const booted = await client.boot();
    assert.equal(booted.ready, true);
    assert.equal(booted.ops, 5);
    assert.equal(booted.eraId, enrolled.eraId);
    bindings = await client.hostBindings();
    assert.equal(bindings[LOCAL_HOST_INSTALL].installed, false, 'a relaunch re-installs nothing');
    host = hostOver(bindings, { prescriptionCapture, engineState, resolveWorkoutBasis });

    const read = await host.client.readWorkoutHistory();
    assert(read.read, read.code);
    assert.equal(read.history.sessions.length, 1);
    assert.equal(read.history.sessions[0].start.operation.op_id, startId);
    assert.equal(JSON.stringify(read.history.sessions[0].start.operation.prescription_capture), originalCapture,
      'the original instructions survive the relaunch byte for byte');

    const resumed = await host.client.prepareWorkoutContinuation({ session_start_op_id: startId });
    assert(resumed.prepared, resumed.code);
    assert.deepEqual(resumed.view.allowed_actions, ['set', 'skip', 'close']);
    assert.equal(resumed.view.slots.filter(s => s.completion).length, 3, 'the three recorded sets are recovered');
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
    assert.equal((await opsOf(bindings.repository)).filter(o => o.kind === 'session-start').length, 1,
      'resuming created no second Start');
    // C1's own resume face still reads the same store.
    const local = await client.resumeAfterKill();
    assert.equal(local.state, undefined);
    assert.equal(typeof local.revision, 'number');
  });

  await t.test('8. finish, correct one set, and nothing synthetic is in the sealed metadata', async () => {
    const close = await host.client.execute('workout', { action: 'close', input: {
      session_start_op_id: startId, completion_kind: 'normal', causal_parents: [startId, ...setIds] } });
    assert(close.acknowledged, close.code);
    // The correction path — reachable only because the bindings sealed the zero
    // frontier a local era actually has.
    const prepared = await host.client.prepareWorkoutEdit({ target_op_id: setIds[0] });
    assert(prepared.prepared, prepared.code);
    const committed = await host.client.commitWorkoutEdit({ editId: prepared.editId, action: 'correct',
      change: { reps: { value: 10, unit: 'rep' } } });
    assert(committed.acknowledged, committed.code);
    const after = await host.client.readWorkoutHistory();
    const corrected = after.history.sessions[0].projection.facts.find(x => x.source_op_id === setIds[0]);
    assert.equal(corrected.original.reps.value, 9);
    assert.equal(corrected.current.reps.value, 10);
  });

  await t.test('9. NOTHING SYNTHETIC reached the sealed generation metadata', async () => {
    const sealed = (await bindings.repository.load()).generation;
    const metadata = JSON.stringify(sealed.metadata);
    const O = require('../../../conform/lib/ops.cjs');
    // The fixture key and lease every other W6 test injects are nowhere here.
    for (const fixtureValue of [O.AUTH_KEY, O.K_IDENTITY, 'L-dev-A', 'synthetic-enrollment-only'])
      assert.equal(metadata.includes(fixtureValue), false, fixtureValue);
    for (const word of ['synthetic', 'fixture', 'test-identity'])
      assert.equal(metadata.toLowerCase().includes(word), false, word);
    // Every lease-shaped record in metadata is THIS era's, and the one pinned kid
    // names this era too.
    assert.deepEqual([...new Set([sealed.metadata.authorityLease.lease_id, sealed.metadata.localEra.lease.lease_id])],
      [localEraLeaseId(era.eraId)]);
    assert.equal(sealed.metadata.localHostAuthority.kid, localHostAuthorityKid(era.eraId));
    assert.equal(sealed.metadata.wireProofs, undefined, 'no inbound proof was ever admitted');
    // And the identity every stored commitment was taken under is the era's own,
    // not a fixture's: recompute all five-plus commitments from the sealed key.
    const ops = Object.values(sealed.collections.ops);
    assert(ops.length >= 8);
    for (const op of ops)
      assert.equal(Ops.commitmentOf(op, sealed.metadata.localEra.identityKey), op.canonical_content_commitment, op.op_id);
  });

  // C1b review F2. All SEVEN inbound kinds, each asserting the inner function
  // NEVER RAN — a refusal that still ran the callback would have verified an
  // inbound record against this device's own pinned key before answering.
  await t.test('10. all seven inbound kinds refuse without running the inner work, and the guard is an allowlist', () => {
    const guard = bindings.observationGuard;
    const probe = async kind => {
      let ran = false;
      const result = await guard.run(kind, async () => { ran = true; return { accepted: true }; });
      return { ran, result };
    };
    return Promise.all([...INBOUND_OBSERVATION_KINDS, 'a-kind-that-does-not-exist-yet', ''].map(async kind => {
      const { ran, result } = await probe(kind);
      assert.equal(ran, false, `inner ran for ${kind}`);
      assert.equal(result.code, 'LOCAL_ERA_NO_INBOUND', kind);
      assert.equal(result.state, 12, kind);
      assert.equal(result.stored, false, kind);
      assert.equal(result.accepted, false, kind);
    })).then(() => Promise.all(LOCAL_OBSERVATION_KINDS.map(async kind => {
      // The three purely-local kinds DO run: the guard is not a blanket refusal.
      const { ran, result } = await probe(kind);
      assert.equal(ran, true, `local kind ${kind} must run`);
      assert.deepEqual(result, { accepted: true }, kind);
    })));
  });

  await t.test('11. the reachable inbound entry points refuse cleanly and write nothing', async () => {
    const before = await bindings.repository.load();
    const refusals = [];
    for (const kind of ['disposition', 'pull', 'snapshot', 'lease'])
      refusals.push(await host.client.acceptResponse(kind, { wireVersion: W5.WIRE_VERSION,
        body: kind === 'lease' ? { lease: before.generation.metadata.authorityLease } : { anything: true } }));
    refusals.push(await host.client.exchangeServerTime(async () => ({ wireVersion: W5.WIRE_VERSION, body: {} })));
    refusals.push(await host.client.exchangeCurrentHead(async () => ({ wireVersion: W5.WIRE_VERSION, body: {} }),
      { issuanceAttempt: 'local-era-probe' }));
    // 'time' has no caller-reachable entry point — acceptResponse refuses the
    // kind before the guard is asked — so it is covered by case 10's direct
    // probe and named here rather than silently skipped.
    for (const refused of refusals) {
      assert.equal(refused.code, 'LOCAL_ERA_NO_INBOUND', JSON.stringify(refused));
      assert.equal(refused.state, 12);
      assert.equal(refused.stored, false);
    }
    // Even a lease this device really did sign is refused: the guard answers
    // before the pinned key is consulted, so the key can admit nothing.
    const after = await bindings.repository.load();
    assert.equal(after.revision, before.revision);
    assert.equal(after.token, before.token);
    client.close();
  });
});

test('partial local erasure stays restore-required: the host scope is refused, and no re-enrollment happens', async () => {
  const prescriptionCapture = capture();
  for (const [label, erase] of [
    ['the enrollment marker', db => eraseRecord(db, markerDatabaseName(DB), 'markers', 'enrolled')],
    ['the device key', db => eraseRecord(db, keysDatabaseName(DB), 'keys', 'active')],
  ]) {
    const indexedDB = new IDBFactory();
    const { clock } = movableClock();
    const first = await openClient(indexedDB, clock, prescriptionCapture);
    assert.equal((await first.enroll({ profile: 'host-clean-init' })).enrolled, true);
    assert.equal((await first.boot()).ready, true);
    await first.hostBindings();
    first.close();

    await erase(indexedDB);
    const broken = await openClient(indexedDB, clock, prescriptionCapture);
    assert.equal(broken.status().state, 'restore-required', label);
    const booted = await broken.boot();
    assert.equal(booted.ready, false, label);
    assert.equal(booted.state, 18, label);
    await assert.rejects(() => broken.hostBindings(), { code: 'LOCAL_HOST_BINDINGS_BOOT_REQUIRED', state: 18 }, label);
    // Still no reseed over an existing installation.
    assert.equal((await broken.enroll()).enrolled, false, label);
    broken.close();
  }
});

test('the era lease is renewed before the host scope exists, and an expired era refuses the scope', async () => {
  const indexedDB = new IDBFactory();
  const { state, clock } = movableClock();
  const prescriptionCapture = capture();
  const client = await openClient(indexedDB, clock, prescriptionCapture);
  assert.equal((await client.enroll()).enrolled, true);
  // Boot on day 0: nothing is due, so boot renews nothing.
  const booted = await client.boot();
  assert.equal(booted.leaseRenewedUntil, null);
  const first = await client.hostBindings();
  const beforeIso = clock.now();
  const sealedBefore = (await first.repository.load()).generation.metadata;
  assert.equal(leaseRenewalDue(readLocalEra(sealedBefore).lease, beforeIso), false);

  // Day 201, with NO second boot(). Only hostBindings() can renew now — and it
  // must, because the scope it returns is what the public client writes through.
  state.offset = 201;
  const renewed = await client.hostBindings();
  assert.equal(renewed[LOCAL_HOST_INSTALL].installed, true);
  assert.equal(typeof renewed[LOCAL_HOST_INSTALL].leaseRenewedUntil, 'string');
  const sealedAfter = (await renewed.repository.load()).generation.metadata;
  const eraAfter = readLocalEra(sealedAfter);
  assert.ok(Date.parse(eraAfter.lease.not_after) > Date.parse(readLocalEra(sealedBefore).lease.not_after));
  assert.equal(leaseRenewalDue(eraAfter.lease, clock.now()), false, 'the scope never exists over a lease still due for renewal');
  // The W5 lease follows the era lease exactly; one window, not two.
  assert.equal(sealedAfter.authorityLease.not_after, eraAfter.lease.not_after);
  assert.equal(await W5.createPublicVerifier({ keys: renewed.keys, subtle: webcrypto.subtle })
    .verifyLease(sealedAfter.authorityLease), true);

  // Day 401 past the renewed window is still inside it; day 1000 is not.
  state.offset = 1000;
  await assert.rejects(() => client.hostBindings(), { code: 'LOCAL_LEASE_EXPIRED', state: 20 });
  client.close();
});

test('localHostBindings accepts an open client or the open options, and returns the same scope', async () => {
  const indexedDB = new IDBFactory();
  const { clock } = movableClock();
  const prescriptionCapture = capture();
  const client = await openClient(indexedDB, clock, prescriptionCapture);
  assert.equal((await client.enroll()).enrolled, true);
  assert.equal((await client.boot()).ready, true);
  const viaClient = await localHostBindings(client);
  assert.deepEqual(Object.keys(viaClient), SCOPE_MEMBERS);
  assert.equal(viaClient[LOCAL_HOST_CLIENT], client);
  client.close();

  const viaOptions = await localHostBindings({ indexedDB, crypto: webcrypto, databaseName: DB, namespace: NS,
    athleteId: ATHLETE, deviceId: DEVICE, clock,
    workoutCommands: Commands.createWorkoutCommands({ prescriptionCapture }) });
  assert.deepEqual(Object.keys(viaOptions), SCOPE_MEMBERS);
  assert.equal(viaOptions.sessionEpoch === viaClient.sessionEpoch, false, 'a new open is a new session');
  assert.equal(viaOptions[LOCAL_HOST_INSTALL].installed, false, 'the era it found was already installed');
  viaOptions[LOCAL_HOST_CLIENT].close();

  // A first-run installation has no scope to give: the options form refuses too.
  await assert.rejects(() => localHostBindings({ indexedDB: new IDBFactory(), crypto: webcrypto,
    databaseName: DB, namespace: NS, athleteId: ATHLETE, deviceId: DEVICE, clock }),
    { code: 'LOCAL_FIRST_RUN' });
});

// C1b review F1. The guard is an allowlist, so a kind added to public-client.mjs
// later fails closed rather than passing. That is only half the protection: this
// case is the other half, and it fails in BOTH directions — a new kind over
// there that neither list here names, and a stale entry here that no longer
// exists over there. Without it the two files could drift silently.
test('the observation guard allowlist is pinned to the kinds public-client.mjs can actually pass', () => {
  const source = readFileSync(new URL('../public-client.mjs', import.meta.url), 'utf8');
  const calls = [...source.matchAll(/observationGuard\s*\.\s*run\s*\(\s*([^,]+?)\s*,/g)].map(m => m[1].trim());
  assert.equal(calls.length, 6, 'the number of guard call sites moved: ' + calls.join(' | '));
  const literals = [], variables = [];
  for (const argument of calls) {
    const literal = /^(["'`])([^"'`]+)\1$/.exec(argument);
    if (literal) literals.push(literal[2]); else variables.push(argument);
  }
  // Exactly one call site passes a variable, and it is `kind` inside accept().
  // Any other shape means this pin is no longer reading the whole truth.
  assert.deepEqual(variables, ['kind'], 'an unmodelled guard call shape appeared: ' + variables.join(', '));
  const map = /const method = \{([^}]+)\}\[kind\]/.exec(source);
  assert(map, "accept()'s kind map is no longer where this pin reads it");
  const mapped = [...map[1].matchAll(/([A-Za-z][\w-]*)\s*:/g)].map(m => m[1]);
  const declared = [...new Set([...literals, ...mapped])].sort();
  const modelled = [...new Set([...LOCAL_OBSERVATION_KINDS, ...INBOUND_OBSERVATION_KINDS])].sort();
  assert.deepEqual(declared, modelled,
    'public-client.mjs and host-bindings.mjs disagree about the observation kinds');
  // The two halves are disjoint, and neither is empty: a kind cannot be both a
  // local question and an inbound record.
  for (const kind of LOCAL_OBSERVATION_KINDS) assert.equal(INBOUND_OBSERVATION_KINDS.includes(kind), false, kind);
  assert.equal(LOCAL_OBSERVATION_KINDS.length, 3);
  assert.equal(INBOUND_OBSERVATION_KINDS.length, 7);
});

// C1b review F3. The module header promises an expired era is refused at the
// bindings, not discovered on the first save. On a FRESH open of a lapsed
// installation the boot fence used to answer first with the generic
// LOCAL_HOST_BINDINGS_BOOT_REQUIRED / 18 — which says "stored truth needs
// recovery" about data that is perfectly readable. State 20 is the truth: the
// data is fine, the write allowance ran out.
test('a lapsed era refuses the host scope with LOCAL_LEASE_EXPIRED / 20, not the generic boot fence', async () => {
  const indexedDB = new IDBFactory();
  const { state, clock } = movableClock();
  const prescriptionCapture = capture();
  const first = await openClient(indexedDB, clock, prescriptionCapture);
  assert.equal((await first.enroll()).enrolled, true);
  assert.equal((await first.boot()).ready, true);
  await first.hostBindings();
  first.close();

  state.offset = 1000;
  const lapsed = await openClient(indexedDB, clock, prescriptionCapture);
  assert.deepEqual(lapsed.status(), { state: 'restore-required', code: 'LOCAL_LEASE_EXPIRED' });
  const booted = await lapsed.boot();
  assert.equal(booted.ready, false);
  assert.equal(booted.readable, true, 'the data is readable; only writing lapsed');
  assert.equal(booted.leaseExpired, true);
  assert.equal(booted.state, 20);
  await assert.rejects(() => lapsed.hostBindings(), { code: 'LOCAL_LEASE_EXPIRED', state: 20 });
  // The options form says the same thing rather than a second vocabulary.
  await assert.rejects(() => localHostBindings({ indexedDB, crypto: webcrypto, databaseName: DB, namespace: NS,
    athleteId: ATHLETE, deviceId: DEVICE, clock,
    workoutCommands: Commands.createWorkoutCommands({ prescriptionCapture }) }),
    { code: 'LOCAL_LEASE_EXPIRED', state: 20 });
  lapsed.close();
});
