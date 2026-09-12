// P2 — the two host/ seams lane C asked the PM for in C1-REPORT "REQUEST TO PM".
//
// (1) composeWorkoutHost forwards an injected `subtle` to
//     createDurablePublicClient, so the WebCrypto that VERIFIES the authority
//     lease is the one the host was handed and never a globalThis read.
// (2) host-entry.mjs re-exports lane C's local factory surface
//     (openLocalDurableClient / localHostBindings) as re-export BINDINGS, so a
//     phone bundle built from host-entry reaches the ONE store rather than a
//     second path to it.
//
// Real here: the repository (AES-GCM over fake-indexeddb), the T2 stage, the
// public durable client, the v2 capture validator, the accepted registrar and
// reader, the engine capture adapter and the accepted engine runtime — the same
// composition journey.test.mjs uses. Synthetic and labelled as such: the athlete
// setup, the identity, the signing key and lease, and the guards. No network, no
// private input, no athlete data.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire, registerHooks } from 'node:module';
import { webcrypto } from 'node:crypto';
import { fixture, initial, config, O, createT2Stage } from '../../test/support.mjs';
import { createDurablePublicClient } from '../../public-client.mjs';
import { parseStrictJson } from '../../strict-json.mjs';
import { projectWorkoutRecords } from '../../../../m4/workout/project-history.mjs';
import { composeWorkoutHost, createUnavailableNativeTrendContext } from '../workout-host.mjs';
import * as LocalClientModule from '../../local/local-client.mjs';
import * as HostBindingsModule from '../../local/host-bindings.mjs';

// host-entry.mjs is a BUNDLE entry: through browser-entry.mjs it reaches
// rebuild/m4/workout/typography.mjs, which imports the pinned .woff2/.txt font
// assets that rebuild/m3/w6/build-browser.mjs loads as `binary`/`text`. Node has
// no loader for those extensions, so the entry cannot be imported here without
// one — that is true on the base commit too and is nothing this branch changed.
// The shim below gives Node the same shape esbuild gives the bundle and NOTHING
// else: the asset becomes an inert value. No product byte is touched, and only
// non-JavaScript assets are affected.
assert.equal(typeof registerHooks, 'function', 'node:module registerHooks is required to import a bundle entry here');
registerHooks({
  load(url, context, nextLoad) {
    if (/\.(woff2?|ttf|otf|txt|css|svg|png)$/.test(new URL(url).pathname))
      return { format: 'module', shortCircuit: true, source: 'export default "";' };
    return nextLoad(url, context);
  },
});
const HostEntry = await import('../host-entry.mjs');
const LocalHostBrowserEntry = await import('../../local/host-browser-entry.mjs');
const TodayBrowserEntry = await import('../../local/today-browser-entry.mjs');

const require = createRequire(import.meta.url);
const Sign = require('../../../w5/crypto.cjs');
const Source = require('../../../w5/source/codec.cjs');
const Capture = require('../../../../m4/workout/capture.cjs');
const Commands = require('../../../../m4/workout/commands.cjs');
const Adapter = require('../../../../m4/workout/engine-capture.cjs');
const History = require('../../../../m4/workout/engine-history.cjs');
const SourceProjection = require('../../../../m4/workout/source-projection.cjs');
const { createCleanInitState } = require('../../../../m4/workout/athlete-state.cjs');
const { createNullLaneWorkoutBasis } = require('../../../../m4/workout/workout-basis.cjs');
const { createWorkoutResumePolicy } = require('../../../../m4/workout/resume-policy.cjs');
const { createEngineRuntime } = require('../../../../m4/workout/engine-runtime.cjs');
const { DAY, SETUP, clockFor } = require('./journey-fixture.cjs');

const PRODUCER = Object.freeze({ app_build: 'synthetic-test-identity', engine_build: 'native-candidate-L',
  rule_profile: Adapter.PROFILE, source_schema: 'synthetic-clean-init' });
const RESUME_REASON = 'Current assessment recomputed by this host from the same clean-init state; not a personal prescription.';
const SLOT = 'synthetic-slot';

// The same scaffold journey.test.mjs builds: one real repository over
// fake-indexeddb, one synthetic schema-2 lease, one accepted engine runtime.
async function scaffold() {
  const signing = Sign.generateSigningKey('synthetic-host-seams');
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
  return { f, stage, keys: [Sign.publicKeyOf(signing)], capture, engine };
}

// Every provider composeWorkoutHost names, with NOTHING for `subtle`: the base
// case whose behaviour must not move.
function scopeOver({ f, stage, keys, capture, engine }, overrides = {}) {
  const engineState = createCleanInitState({ setup: SETUP });
  return {
    repository: f.repo, stage, namespace: 'synthetic-athlete/device-A', athleteId: 'ath-1', deviceId: 'dev-A',
    sessionEpoch: 1, isCurrentSession: x => x === 1, observationEpoch: () => 1,
    observationGuard: { run: async (_kind, fn) => fn() }, validateCommit: () => null,
    keys, crypto: webcrypto,
    createDurablePublicClient,
    createNullSelectionRegistrar: SourceProjection.createNullSelectionRegistrar,
    createSourceProjectionReader: SourceProjection.createSourceProjectionReader,
    createEngineWorkoutCapture: Adapter.createEngineWorkoutCapture,
    createEngineHistoryProjector: History.createEngineHistoryProjector,
    createWorkoutResumePolicy, parseStrictJson, projectWorkoutRecords,
    prescriptionCapture: capture, sourceCodec: Source, engine, engineState,
    clock: clockFor(DAY), workoutProducerIdentity: PRODUCER,
    resolveWorkoutBasis: createNullLaneWorkoutBasis({ sourceCodec: Source,
      planBasis: 'NO_ACCEPTED_PLAN', inputBasis: 'native-only/zero-import', causalParents: () => [] }),
    resumeReason: RESUME_REASON, plannedSplitSlotId: SLOT,
    ...overrides,
  };
}

// A SubtleCrypto that is not globalThis.crypto.subtle: it records what the
// verifier asked it and, when `verifyAnswer` is set, answers that instead.
function fakeSubtle(inner, { verifyAnswer = null } = {}) {
  const calls = [];
  return {
    calls,
    importKey: (...args) => { calls.push('importKey'); return inner.importKey(...args); },
    verify: async (...args) => { calls.push('verify');
      const real = await inner.verify(...args);
      return verifyAnswer === null ? real : verifyAnswer; },
    digest: (...args) => inner.digest(...args),
    sign: (...args) => inner.sign(...args),
    exportKey: (...args) => inner.exportKey(...args),
    deriveBits: (...args) => inner.deriveBits(...args),
    encrypt: (...args) => inner.encrypt(...args),
    decrypt: (...args) => inner.decrypt(...args),
    generateKey: (...args) => inner.generateKey(...args),
  };
}

const opsOf = async repository => Object.values((await repository.load()).generation.collections.ops || {});

test('P2 (1) — composeWorkoutHost accepts subtle and forwards it to createDurablePublicClient', async t => {
  await t.test('a. the injected subtle reaches the client scope by identity, and nothing else moves', async () => {
    const parents = await scaffold();
    const seen = [];
    const capturing = scope => { seen.push(scope); return {}; };
    const subtle = fakeSubtle(webcrypto.subtle);

    composeWorkoutHost(scopeOver(parents, { createDurablePublicClient: capturing, subtle }));
    composeWorkoutHost(scopeOver(parents, { createDurablePublicClient: capturing }));

    assert.equal(seen.length, 2);
    const [withSubtle, without] = seen;
    // The supplied object arrives unwrapped and unsubstituted.
    assert.equal(withSubtle.subtle, subtle, 'the very object the caller supplied');
    // Not supplied: the property is the absent value the client already
    // destructures, so W5.createPublicVerifier still takes its own default.
    assert.equal(without.subtle, undefined);
    assert.equal(Object.hasOwn(without, 'subtle'), true);
    // Every other member of the scope is identical between the two calls, so
    // `subtle` is the only thing this seam changed.
    const keysOf = scope => Object.keys(scope).sort();
    assert.deepEqual(keysOf(withSubtle), keysOf(without));
    for (const key of keysOf(without)) {
      if (key === 'subtle') continue;
      if (typeof without[key] === 'function' || typeof without[key] === 'object') continue;
      assert.deepEqual(withSubtle[key], without[key], key);
    }
    assert.equal(without.schemaVersion, 2);
    assert.equal(withSubtle.schemaVersion, 2);
  });

  await t.test('b. the injected subtle is the one that VERIFIES — a real Start goes through it', async () => {
    const parents = await scaffold();
    const subtle = fakeSubtle(webcrypto.subtle);
    const host = composeWorkoutHost(scopeOver(parents, { subtle }));

    const prepared = await host.client.prepareWorkout({ planned_split_slot_id: SLOT });
    assert(prepared.prepared, prepared.code);
    const start = await host.client.startPreparedWorkout({ preparedId: prepared.preparedId });
    assert(start.acknowledged, start.code);

    assert(subtle.calls.includes('importKey'), 'the pinned key was imported through the injected subtle');
    assert(subtle.calls.includes('verify'), 'the lease proof was checked through the injected subtle');
    const ops = await opsOf(parents.f.repo);
    assert.equal(ops.length, 1);
    assert.equal(ops[0].op_id, start.op_id);
  });

  await t.test('c. a subtle that refuses makes the client refuse — globalThis is not consulted behind it', async () => {
    const parents = await scaffold();
    const subtle = fakeSubtle(webcrypto.subtle, { verifyAnswer: false });
    const host = composeWorkoutHost(scopeOver(parents, { subtle }));

    const prepared = await host.client.prepareWorkout({ planned_split_slot_id: SLOT });
    const outcome = prepared.prepared
      ? await host.client.startPreparedWorkout({ preparedId: prepared.preparedId })
      : prepared;
    assert.notEqual(outcome.acknowledged, true, 'a lease this subtle will not prove cannot be acted on');
    assert.equal(outcome.code, 'LEASE_PROOF_UNPROVEN');
    assert(subtle.calls.includes('verify'));
    assert.deepEqual(await opsOf(parents.f.repo), [], 'and nothing was stored');
  });

  await t.test('d. a supplied non-WebCrypto subtle is refused by name; an absent one never is', async () => {
    const parents = await scaffold();
    // P2 review F1: the last two are the cases the first version of this guard
    // let through — half a SubtleCrypto, which composed and then refused
    // LEASE_PROOF_UNPROVEN without saying why. The verifier needs BOTH members.
    const bads = [{}, null, 'globalThis.crypto.subtle', 7, { verify: 'no' },
      { verify: async () => true }, { importKey: webcrypto.subtle.importKey.bind(webcrypto.subtle) }];
    for (const [index, bad] of bads.entries()) {
      assert.throws(() => composeWorkoutHost(scopeOver(parents, { subtle: bad })), error =>
        error instanceof TypeError && error.message.includes('subtle'), 'bad subtle #' + index);
    }
    // undefined is the absent value, and absence is not a refusal.
    assert.doesNotThrow(() => composeWorkoutHost(scopeOver(parents, { subtle: undefined })));
    assert.doesNotThrow(() => composeWorkoutHost(scopeOver(parents)));
  });
});

test('P2 (2) — host-entry re-exports the local factory surface, same object identity', async t => {
  await t.test('a. the two names are the local modules\' own bindings, not copies or wrappers', () => {
    assert.equal(typeof HostEntry.openLocalDurableClient, 'function');
    assert.equal(typeof HostEntry.localHostBindings, 'function');
    assert.equal(HostEntry.openLocalDurableClient, LocalClientModule.openLocalDurableClient);
    assert.equal(HostEntry.localHostBindings, HostBindingsModule.localHostBindings);
  });

  await t.test('b. no second path to the store: lane C\'s own entries expose the SAME functions', () => {
    // local/host-browser-entry.mjs and local/today-browser-entry.mjs export these
    // names explicitly; an explicit re-export shadows the `export *` from
    // host-entry rather than colliding with it, and both resolve to one binding.
    assert.equal(LocalHostBrowserEntry.openLocalDurableClient, HostEntry.openLocalDurableClient);
    assert.equal(LocalHostBrowserEntry.localHostBindings, HostEntry.localHostBindings);
    assert.equal(TodayBrowserEntry.openLocalDurableClient, HostEntry.openLocalDurableClient);
    assert.equal(TodayBrowserEntry.localHostBindings, HostEntry.localHostBindings);
    // C4's one-store entry point (today-bindings.mjs, DECISIONS:111) rides the
    // same module instance: it is reachable from the same entry, and it is the
    // ONLY factory beside these two.
    assert.equal(typeof TodayBrowserEntry.openTodayOverLocalEra, 'function');
    assert.notEqual(TodayBrowserEntry.openTodayOverLocalEra, HostEntry.openLocalDurableClient);
  });

  await t.test('c. host-entry still adds no store of its own', async () => {
    // The local era adds exactly two names to this entry, and each one IS the
    // local module's binding. The other factory-shaped names host-entry carries
    // (openRepository, openFrameRepository) are browser-entry.mjs's own and
    // predate this branch — they are not a local-store path.
    const added = Object.keys(HostEntry)
      .filter(name => LocalClientModule[name] !== undefined || HostBindingsModule[name] !== undefined);
    assert.deepEqual(added.sort(), ['localHostBindings', 'openLocalDurableClient']);
    for (const name of added)
      assert(LocalClientModule[name] === HostEntry[name] || HostBindingsModule[name] === HostEntry[name], name);
    const BrowserEntry = await import('../../browser-entry.mjs');
    for (const name of ['openRepository', 'openFrameRepository'])
      assert.equal(HostEntry[name], BrowserEntry[name], name + ' is browser-entry.mjs\'s, unchanged');
    // The host composition itself is unchanged and still binding-only.
    assert.equal(HostEntry.composeWorkoutHost, composeWorkoutHost);
  });
});
