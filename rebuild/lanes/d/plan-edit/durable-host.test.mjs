// PUBLIC SYNTHETIC: real local-era enrollment, encrypted W6 repository,
// public-client, T2 producer stage and transaction/CAS; no fake committer.
// IndexedDB and clock are controlled test surfaces. No native/gym/phone proof.
import test from 'node:test';
import assert from 'node:assert/strict';
import Module, { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createHash, webcrypto } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { openLocalDurableClient } from '../../../m3/w6/local/local-client.mjs';
import { createDurablePublicClient } from '../../../m3/w6/public-client.mjs';
import { StorageFailure } from '../../../m3/w6/repository.mjs';
import { faultDatabase, deferred, mutateActive } from '../../../m3/w6/test/support.mjs';
import { createSetupCommands } from '../../../m3/w7-preview/today/setup-commands.mjs';
import { ENGINE_MG, REGION_MG } from '../../../m3/w7-preview/today/exercise-catalogue.mjs';
import { createMachineSettingsHost } from '../../../coach/local-world.mjs';
const require = createRequire(import.meta.url);
const w6Require = createRequire(new URL('../../../m3/w6/package.json', import.meta.url));
const { IDBFactory } = w6Require('fake-indexeddb');
const { createCleanInitState } = require('../../../m4/workout/athlete-state.cjs');
// F2's setup-tags.cjs is not on rebuild/t2-client-core (it is lane D's unmerged
// F2 package). The tag validator/projector are INJECTED collaborators, so this
// lane keeps a byte-identical copy of the public F2 source at f3e9561 beside its
// cells; PE-f2-identity below proves that copy against the public blob, and no
// plan-edit runtime file imports either one.
function tagSource() {
  if (!process.env.PE_F2_PUBLIC_REF) return require('./f2-tag-adapter.cjs');
  // Construction-only exact public companion, kept so a verifier can re-run
  // these cells against the published F2 blob instead of the lane copy.
  assert.equal(process.env.PE_F2_PUBLIC_REF, 'f3e9561', 'closed F2 public source allowlist');
  const source = execFileSync('git', ['show', 'f3e9561:rebuild/m4/workout/setup-tags.cjs'], { encoding: 'utf8' });
  assert.equal(/\brequire\s*\(/.test(source), false, 'F2 projection has no imports');
  const module = new Module('public-f3e9561-setup-tags.cjs'); module._compile(source, module.id); return module.exports;
}
const tagProjector = tagSource().createSetupTagProjector({ taxonomy: { muscles: ENGINE_MG, regions: REGION_MG } });
const hostURL = new URL('../../../m3/w6/host/plan-edit-host.mjs', import.meta.url);
async function subject() {
  // Proof-only source override: the normal published path always loads the
  // actual same-tree host. Mutation runners own any scratch module supplied.
  if (process.env.PLAN_EDIT_HOST_MODULE) {
    const target = process.env.PLAN_EDIT_HOST_MODULE;
    return import(target.startsWith('file:') ? new URL(target) : pathToFileURL(target));
  }
  if (!process.env.PE_HOST_MUTANT) return import(hostURL);
  assert.equal(process.env.PE_HOST_MUTANT, 'drop-local-auth', 'closed mutant allowlist');
  let source = readFileSync(hostURL, 'utf8').replaceAll('\r\n', '\n');
  const from = 'const candidate = bindings.stage(generation,command,args,{ ...integration,\n        historyAuthentication:integration?.historyAuthentication || { signedOperationIds:[] } });';
  assert.equal(source.split(from).length - 1, 1, 'PE_MUTANT_ANCHOR_COUNT');
  source = source.replace(from, 'const candidate = bindings.stage(generation,command,args,integration);');
  source = source.replace(/from '([^']+)'/g, (match, specifier) =>
    specifier.startsWith('.') ? "from '" + new URL(specifier, hostURL).href + "'" : match);
  return import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
}
const { createPlanEditHost } = await subject();
const DAY = '2026-09-14', NEXT = '2026-09-15', DB = 'w6-synthetic';
const HASH = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const EX = (id, day, mg) => ({ id, n: 'Synthetic ' + id, day, mg, sets: 2, hi: 9,
  inc: 2.75, steps: [11, 13.75, 16.5] });
const setup = () => ({ athlete_label: 'synthetic-plan-edit-durable',
  split: { from: DAY, map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'L', 5: 'REST', 6: 'REST' } },
  exercises: [EX('press-old', 'U', 'chest'), EX('row-old', 'U', 'back'), EX('squat-old', 'L', 'quads')],
  priority_muscles: ['chest', 'quads'] });
const validateTags = tagProjector.validateExerciseTags;
const update = (changes, exercise_id = 'press-old') => ({ kind: 'update', exercise_id, changes });
const exOf = (read, id = 'press-old') => read.state.exercises.find(e => e.id === id);
const planOps = snapshot => Object.values(snapshot.generation.collections.ops).filter(op => op.kind === 'plan-mutation');
const counts = snapshot => Object.fromEntries(['ops', 'outbox'].map(k => [k, Object.keys(snapshot.generation.collections[k]).length]));
const expectSame = (actual, expected, why) => assert.equal(HASH(actual), HASH(expected), why);

function cryptoControl() {
  let gate = null;
  const subtle = new Proxy(webcrypto.subtle, { get(target, key) {
    if (key === 'encrypt' || key === 'decrypt') return async (...args) => {
      const held = gate;
      if (held && held.method === key && held.remaining > 0) {
        if (--held.remaining === 0) held.entered.resolve();
        await held.release.promise;
      }
      return target[key](...args);
    };
    const value = Reflect.get(target, key); return typeof value === 'function' ? value.bind(target) : value;
  } });
  return { crypto: { subtle, getRandomValues: webcrypto.getRandomValues.bind(webcrypto) },
    hold(n = 1, method = 'encrypt') { gate = { remaining: n, method, entered: deferred(), release: deferred() }; return gate; },
    release() { gate?.release.resolve(); gate = null; } };
}
async function scaffold({ indexedDB = new IDBFactory() } = {}) {
  const crypt = cryptoControl(), time = { iso: DAY + 'T12:00:00.000Z' }, live = { day: null };
  const clock = { now: () => time.iso, today: () => time.iso.slice(0, 10), tz: '+00:00', monotonicMs: () => 0 };
  const options = { indexedDB, crypto: crypt.crypto, databaseName: DB, namespace: 'synthetic-plan-edit/device-A',
    athleteId: 'synthetic-plan-edit-athlete', deviceId: 'synthetic-plan-edit-device', clock };
  let client = await openLocalDurableClient(options), serial = 0, repository;
  assert.equal((await client.enroll()).enrolled, true); assert.equal((await client.boot()).ready, true);
  const bindings = await client.hostBindings({ workoutCommands: createSetupCommands(), clock });
  repository = bindings.repository;
  const setupClient = createDurablePublicClient({ ...bindings, schemaVersion: 2 });
  assert.equal((await setupClient.reopen()).refusal, null);
  const document = setup(), tags = Object.fromEntries(document.exercises.map(ex => [ex.id, { head: null, secondary: [] }]));
  const first = await setupClient.execute('workout', { action: 'first-run-setup', input: { setup: document, tags } });
  assert.equal(first.acknowledged, true, first.code);
  const setupOperation = (await repository.load()).generation.collections.ops[first.op_id];
  const basisState = tagProjector.projectSetupTags(createCleanInitState({ setup: document }),
    { setup: document, tags, op_id: setupOperation.op_id, date: DAY }), handles = [];
  const hooks = { validate: null, loseConfirmation: false, commitAttempts: 0 };
  const adapter = () => ({ async hostBindings(options) {
    const real = await client.hostBindings(options);
    return { ...real, repository: { ...real.repository, async commit(...args) {
      hooks.commitAttempts++;
      const result = await real.repository.commit(...args);
      // Fault AFTER the actual encrypted IDB transaction. No synthetic ack or write.
      if (hooks.loseConfirmation) { hooks.loseConfirmation = false; throw new StorageFailure('SYNTHETIC_CONFIRMATION_LOST', 3); }
      return result;
    } }, validateCommit(context) {
      const decision = real.validateCommit(context); hooks.validate?.(context); return decision;
    } };
  } });
  async function host({ projectNewExerciseTags = tagProjector.projectNewExerciseTags,
    basisState: basis = basisState, ...identity } = {}) {
    // `...identity` overrides even with an explicit undefined, so a cell can
    // construct the host with the installation identity genuinely absent.
    const handle = await createPlanEditHost({ client: adapter(), clock, basisState: basis, setupOperation, validateTags,
      projectNewExerciseTags, athleteLabel: setup().athlete_label, namespace: options.namespace, ...identity,
      /* S4 LIVE DAY. In the page this is today-bindings openTodayInstallation's
         `liveDay()`; `clock` is the client's stamp clock, which in the page is
         clientClockFor(day, live) and whose day NEVER moves on its own. Here the
         two agree by default (every existing cell moves `time.iso` and both
         follow), and `live.day` pins the athlete-local calendar day on its own so
         a cell can put the two into the disagreement a frozen page really has. */
      liveDay: () => (live.day === null ? time.iso.slice(0, 10) : live.day),
      newIntentId: () => 'synthetic-plan-edit-intent-' + (++serial) });
    handles.push(handle); return handle;
  }
  return { host, clock, time, live, crypt, hooks, setupOperation, basisState, indexedDB,
    snapshot: () => repository.load(), client: () => client,
    async tamper(mutator) { const before = await repository.load(), next = structuredClone(before.generation); mutator(next);
      await repository.commit(before, next, () => null); },
    async reopen() { handles.forEach(h => h.close()); client.close();
      client = await openLocalDurableClient(options); assert.equal((await client.boot()).ready, true);
      repository = (await client.hostBindings({ clock })).repository; return host(); },
    close() { crypt.release(); handles.forEach(h => h.close()); client.close(); } };
}
async function reviewed(host, changes, id) {
  const result = await host.review(update(changes, id)); assert.equal(result.reviewed, true, result.code); return result;
}
async function reachedEncryption(gate, saving) {
  assert.equal(await Promise.race([gate.entered.promise.then(() => true), saving.then(() => false)]), true,
    'the actual candidate must reach repository encryption before applying this fault');
}

test('PE01 durable read, preview and cancel write nothing; review captures non-chip fields', async () => {
  const h = await scaffold(); try {
    const host = await h.host(), before = await h.snapshot(), original = await host.read();
    assert.equal(original.read, true, original.code);
    const changes = { inc: 1.375, steps: [11, 12.375, 13.75], hi: 13 };
    const preview = await reviewed(host, changes); changes.inc = 99;
    assert.equal(preview.starts_on, NEXT); assert.equal(preview.after.exercises[0].inc, 1.375);
    expectSame(preview.current, h.basisState, 'preview leaves current state intact');
    expectSame(await h.snapshot(), before, 'opening and previewing do not commit');
    host.cancel(preview.review_id);
    assert.equal((await host.save(preview.review_id)).code, 'PLAN_EDIT_REVIEW_REQUIRED');
    expectSame(await h.snapshot(), before, 'cancel cannot write');
  } finally { h.close(); }
});

test('PE07 real built member commits one intent and outbox, today is unchanged and tomorrow applies', async () => {
  const h = await scaffold(); try {
    const host = await h.host(), before = await h.snapshot(), preview = await reviewed(host, { n: 'Synthetic renamed', inc: 1.375 });
    const saved = await host.save(preview.review_id); assert.equal(saved.ok, true,
      JSON.stringify({ code: saved.code, state: saved.state, reason: saved.reason, keys: Object.keys(saved) }));
    assert.equal(saved.acknowledged, true); assert(saved.durableRevision > before.revision);
    const after = await h.snapshot(); assert.deepEqual(counts(after), { ops: counts(before).ops + 1, outbox: counts(before).outbox + 1 });
    const op = planOps(after)[0]; assert.equal(op.op_id, saved.op_id); assert.equal(op.payload, null);
    assert.equal(op.class, 'plan'); assert.equal(op.conflict_domain_id, 'training');
    assert.equal(op.athlete_id, h.setupOperation.athlete_id); assert.equal(op.device_id, h.setupOperation.device_id);
    assert.equal(op.effective.local_date, DAY); assert.equal(op.seen_plan_basis, preview.plan_basis);
    assert.deepEqual(op.causal_parents, [h.setupOperation.op_id]);
    assert.deepEqual(op.members, [{ field: 'training.exercise-edit', unit: 'record', provenance: 'athlete_edited',
      value: { profile: 'earned/plan-edit/v1', intent_id: preview.intent_id, starts_on: NEXT, edit: preview.edit } }]);
    assert.equal(Object.hasOwn(op, 'group_provenance'), false);
    assert(Object.hasOwn(after.generation.collections.outbox, saved.op_id));
    expectSame(after.generation.collections.ops[h.setupOperation.op_id], h.setupOperation, 'original setup is immutable');
    const today = await host.read(DAY), tomorrow = await host.read(NEXT);
    assert.equal(exOf(today).n, 'Synthetic press-old'); assert.equal(exOf(tomorrow).n, 'Synthetic renamed');
    assert.deepEqual(exOf(tomorrow).renames, [{ from: NEXT, prevN: 'Synthetic press-old' }]);
    assert.equal(exOf(tomorrow).w, null); assert.deepEqual(exOf(tomorrow).forks, []);
    assert.equal(today.plan_basis, tomorrow.plan_basis); assert.deepEqual(today.pending_dates, [NEXT]);
    assert.deepEqual(today.applied_ids, []); assert.deepEqual(tomorrow.applied_ids, [saved.op_id]);
    expectSame(exOf(tomorrow, 'row-old'), exOf(today, 'row-old'), 'unrelated exercise is unchanged');
    assert.deepEqual(await host.save(preview.review_id), saved, 'retry returns the same committed result');
    expectSame(await h.snapshot(), after, 'retry is not a second write');
  } finally { h.close(); }
});

test('PE09 quota abort retains all durable bytes and retry commits the same intent once', async () => {
  const fault = faultDatabase(), h = await scaffold({ indexedDB: fault.indexedDB }); try {
    const host = await h.host(), preview = await reviewed(host, { sets: 3 }), before = await h.snapshot();
    fault.state.mode = 'quota'; fault.state.armed = true;
    const failed = await host.save(preview.review_id); fault.state.armed = false;
    assert.equal(failed.acknowledged, false); assert.equal(failed.ok, false);
    assert.match(failed.code, /^TRANSACTION_(WRITE_FAILED|ABORTED)$/);
    expectSame(await h.snapshot(), before, 'failed transaction has no operation or outbox');
    const saved = await host.save(preview.review_id); assert.equal(saved.ok, true, saved.code);
    assert.equal(saved.intent_id, preview.intent_id); assert.equal(planOps(await h.snapshot()).length, 1);
  } finally { fault.state.armed = false; h.close(); }
});

test('PE08 two hosts race through real CAS and stale loser cannot silently rebase', { timeout: 10000 }, async () => {
  const h = await scaffold(); try {
    const [a, b] = await Promise.all([h.host(), h.host()]);
    const pa = await reviewed(a, { sets: 3 }), pb = await reviewed(b, { hi: 14 }, 'row-old');
    const before = await h.snapshot(), gate = h.crypt.hold(2);
    const outcomes = Promise.all([a.save(pa.review_id), b.save(pb.review_id)]);
    await reachedEncryption(gate, outcomes); h.crypt.release(); const values = await outcomes;
    assert.equal(values.filter(x => x.ok).length, 1); assert.equal(values.find(x => !x.ok).code, 'PLAN_EDIT_REVIEW_STALE');
    assert(h.hooks.commitAttempts >= 2, 'both staged candidates reached actual repository commit');
    const after = await h.snapshot(); assert.equal(planOps(after).length, 1);
    assert.deepEqual(counts(after), { ops: counts(before).ops + 1, outbox: counts(before).outbox + 1 });
    const loser = values[0].ok ? b : a, lost = values[0].ok ? pb : pa;
    assert.equal((await loser.save(lost.review_id)).code, 'PLAN_EDIT_REVIEW_STALE');
    expectSame(await h.snapshot(), after, 'stale retry preserves winner');
  } finally { h.close(); }
});

test('PE08 unrelated durable reading permits CAS restage after recomputing the same plan basis', { timeout: 10000 }, async () => {
  const h = await scaffold(); try {
    const host = await h.host(), preview = await reviewed(host, { hi: 13 }), gate = h.crypt.hold();
    const saving = host.save(preview.review_id); await reachedEncryption(gate, saving);
    const reading = await h.client().execute('weighIn', { date: DAY, lb: 171.25 }); assert.equal(reading.acknowledged, true);
    const storedReading = (await h.snapshot()).generation.collections.ops[reading.op_id];
    h.crypt.release(); const result = await saving; assert.equal(result.ok, true, result.code);
    assert(h.hooks.commitAttempts >= 2, 'CAS retry uses the real repository');
    const after = await h.snapshot(); assert.equal(planOps(after).length, 1);
    expectSame(after.generation.collections.ops[reading.op_id], storedReading, 'factual record survives restage');
  } finally { h.close(); }
});

test('PE14 midnight after review and inside the final validator refuses without durable change', async () => {
  for (const boundary of ['before-save', 'second-validator']) {
    const h = await scaffold(); try {
      const host = await h.host(), preview = await reviewed(host, { sets: 3 }), before = await h.snapshot();
      if (boundary === 'before-save') h.time.iso = NEXT + 'T00:00:00.000Z';
      else { let calls = 0; h.hooks.validate = () => { if (++calls === 2) h.time.iso = NEXT + 'T00:00:00.000Z'; }; }
      const result = await host.save(preview.review_id); assert.equal(result.ok, false, boundary);
      assert.equal(result.code, 'PLAN_EDIT_REVIEW_STALE'); expectSame(await h.snapshot(), before, boundary);
    } finally { h.close(); }
  }
});

for (const action of ['cancel', 'close', 'installation-close']) test('PE09 ' + action + ' during encryption retires the in-flight review', { timeout: 10000 }, async () => {
  const h = await scaffold(); try {
    const host = await h.host(), preview = await reviewed(host, { sets: 3 }), before = await h.snapshot(), gate = h.crypt.hold();
    const saving = host.save(preview.review_id); await reachedEncryption(gate, saving);
    if (action === 'cancel') host.cancel(preview.review_id);
    else if (action === 'close') host.close(); else h.client().close();
    h.crypt.release(); const result = await saving; assert.equal(result.ok, false); assert.equal(result.acknowledged, false);
    if (action === 'installation-close') await h.reopen();
    expectSame(await h.snapshot(), before, action + ' cannot write after encryption resumes');
  } finally { h.close(); }
});

test('PE10 completed transaction with lost confirmation reconciles once and survives new host process state', async () => {
  const h = await scaffold(); try {
    const host = await h.host(), preview = await reviewed(host, { sets: 3 });
    h.hooks.loseConfirmation = true;
    const result = await host.save(preview.review_id); assert.equal(result.ok, true, result.code); assert.equal(result.recovered, true);
    const committed = await h.snapshot(); assert.equal(planOps(committed).length, 1);
    assert.equal((await host.save(preview.review_id)).op_id, result.op_id);
    const reopened = await h.reopen(), read = await reopened.read(NEXT); assert.equal(read.read, true, read.code);
    assert.equal(exOf(read).sets, 3); assert.equal(read.intents.filter(x => x.intent_id === preview.intent_id).length, 1);
    assert.equal((await reopened.save(preview.review_id)).code, 'PLAN_EDIT_REVIEW_REQUIRED');
    expectSame(await h.snapshot(), committed, 'process-state loss does not create an editor collection or operation');
  } finally { h.close(); }
});

test('PE10-retry closed installation cannot reaffirm a previously acknowledged save', async () => {
  const h = await scaffold(); try {
    const host = await h.host(), preview = await reviewed(host, { sets: 3 });
    assert.equal((await host.save(preview.review_id)).acknowledged, true);
    h.client().close();
    assert.equal((await host.read()).read, false, 'the actual installation has closed');
    const retry = await host.save(preview.review_id);
    assert.equal(retry.acknowledged, false, 'PE10_RETRY_CLOSED_INSTALLATION_REFUSED');
    assert.equal(retry.ok, false);
  } finally { h.close(); }
});

test('PE10-retry cancellation during authenticated reread cannot return cached acknowledgement', async () => {
  const h = await scaffold(); try {
    const host = await h.host(), preview = await reviewed(host, { sets: 3 });
    assert.equal((await host.save(preview.review_id)).acknowledged, true);
    const before = await h.snapshot(), gate = h.crypt.hold(1, 'decrypt');
    const retry = host.save(preview.review_id);
    assert.equal(await Promise.race([gate.entered.promise.then(() => true), retry.then(() => false)]), true,
      'retry must reach the actual encrypted repository read');
    host.cancel(preview.review_id); h.crypt.release();
    const result = await retry; assert.equal(result.acknowledged, false);
    assert.equal(result.code, 'PLAN_EDIT_REVIEW_REQUIRED');
    expectSame(await h.snapshot(), before, 'cancelled retry preserves the historical commit without another write');
  } finally { h.close(); }
});

test('PE10-retry durable authenticated retraction defeats an earlier save acknowledgement', async () => {
  const h = await scaffold(); try {
    const host = await h.host(), preview = await reviewed(host, { sets: 3 });
    const saved = await host.save(preview.review_id); assert.equal(saved.acknowledged, true);
    // Test-only retraction producer uses the actual client envelope/HMAC and
    // encrypted repository. It creates no operation or acknowledgement itself.
    const retract = { schemaVersion: 2,
      prepare(request) {
        assert.deepEqual(request, { action: 'synthetic-retract', input: { target: saved.op_id } });
        return { kind: 'tombstone', class: 'plan', target: saved.op_id,
          parents: [saved.op_id], payload: { reason: 'Synthetic reviewed retraction' } };
      },
      validate(op, readOperation) {
        return op.kind === 'tombstone' && op.class === 'plan' && op.target_op_id === saved.op_id &&
          op.causal_parents.length === 1 && op.causal_parents[0] === saved.op_id &&
          readOperation(saved.op_id)?.members?.[0]?.value?.intent_id === preview.intent_id;
      }
    };
    const bindings = await h.client().hostBindings({ workoutCommands: retract, clock: h.clock });
    const writer = createDurablePublicClient({ ...bindings, schemaVersion: 2 });
    assert.equal((await writer.reopen()).refusal, null);
    const removed = await writer.execute('workout', { action: 'synthetic-retract', input: { target: saved.op_id } });
    assert.equal(removed.acknowledged, true, removed.code);
    const current = await host.read(NEXT); assert.equal(current.read, true, current.code);
    assert.equal(current.intents.find(x => x.intent_id === preview.intent_id).status, 'tombstoned');
    assert.equal(exOf(current).sets, 2);
    const before = await h.snapshot(), retry = await host.save(preview.review_id);
    assert.equal(retry.acknowledged, false, 'PE10_RETRY_RETRACTED_INTENT_REFUSED');
    assert.equal(retry.ok, false); assert.equal(retry.code, 'PLAN_EDIT_INTENT_CONFLICT');
    expectSame(await h.snapshot(), before, 'retry creates no replacement operation or outbox item');
  } finally { h.close(); }
});

test('PE09-rejection unproved encrypted rejection cannot remove an authenticated plan edit', async () => {
  const h = await scaffold(); try {
    const host = await h.host(), preview = await reviewed(host, { sets: 3 });
    const saved = await host.save(preview.review_id); assert.equal(saved.acknowledged, true);
    const committed = await h.snapshot();
    await h.tamper(generation => { generation.collections.rejected[saved.op_id] = { op_id: saved.op_id }; });
    const faulted = await h.snapshot();
    expectSame(faulted.generation.collections.ops, committed.generation.collections.ops, 'operation bytes and HMAC remain exact');
    assert.equal(Object.keys(faulted.generation.metadata.wireProofs?.disposition || {}).length, 0);
    const current = await host.read(NEXT);
    assert.equal(current.read, false, 'PE09_UNPROVED_REJECTION_REFUSED');
    assert.equal(current.code, 'PLAN_EDIT_REJECTION_UNPROVEN');
    const retry = await host.save(preview.review_id);
    assert.equal(retry.acknowledged, false); assert.equal(retry.code, 'PLAN_EDIT_REJECTION_UNPROVEN');
    expectSame(await h.snapshot(), faulted, 'refusal does not delete, repair or replace stored facts');
  } finally { h.close(); }
});

test('PE07 hostile descriptors never execute and invalid equipment shapes do not write', async () => {
  const h = await scaffold(); try {
    const host = await h.host(), before = await h.snapshot(); let getters = 0;
    const getter = { enumerable: true, get() { getters++; throw Error('executed getter'); } };
    const onEdit = update({ sets: 3 }); Object.defineProperty(onEdit, 'exercise_id', getter);
    const onChanges = update({}); Object.defineProperty(onChanges.changes, 'sets', getter);
    const symbol = update({ sets: 3 }); symbol[Symbol('extra')] = true;
    const inherited = Object.assign(Object.create({ inherited: true }), update({ sets: 3 }));
    const hole = [11, 13.75, 16.5]; delete hole[1];
    for (const edit of [onEdit, onChanges, symbol, inherited, update({}), update({ day: 'F' }),
      update({ steps: hole }), update({ steps: [11, 11] }), update({ steps: [13, 11] }), update({ inc: Infinity }),
      update({ sets: 1.5 }), update({ w: 35 })]) {
      const result = await host.review(edit); assert.equal(result.reviewed, false);
    }
    assert.equal(getters, 0); expectSame(await h.snapshot(), before, 'invalid review is pure');
  } finally { h.close(); }
});

test('PE09-auth encrypted storage alone cannot authenticate a tampered unrelated local operation', async () => {
  const h = await scaffold(); try {
    const reading = await h.client().execute('weighIn', { date: DAY, lb: 171.25 }); assert.equal(reading.acknowledged, true);
    const host = await h.host(); assert.equal((await host.read()).read, true);
    await h.tamper(generation => { generation.collections.ops[reading.op_id].payload.lb.value = 172.5; });
    const before = await h.snapshot(), result = await host.read();
    assert.equal(result.read, false, 'valid ciphertext is not proof of immutable local identity');
    assert.equal(result.code, 'LOCAL_HISTORY_IDENTITY_UNPROVEN');
    const review = await host.review(update({ sets: 3 })); assert.equal(review.reviewed, false);
    expectSame(await h.snapshot(), before, 'unproven local history cannot grant a write');
  } finally { h.close(); }
});

test('PE09 changed ciphertext refuses integrity before review and never repairs by reenrollment', async () => {
  const indexedDB = new IDBFactory(), h = await scaffold({ indexedDB }); try {
    const host = await h.host(); await mutateActive(indexedDB, record => {
      const next = structuredClone(record); new Uint8Array(next.ciphertext)[0] ^= 1; return next;
    });
    const result = await host.review(update({ sets: 3 })); assert.equal(result.reviewed, false);
    assert.equal(result.state, 18); assert.equal((await h.client().enroll()).enrolled, false);
  } finally { h.close(); }
});

test('PE09 a lapsed local era or closed installation cannot save a reviewed edit', async () => {
  for (const boundary of ['expired', 'closed']) {
    const h = await scaffold(); try {
      const host = await h.host(), preview = await reviewed(host, { hi: 13 });
      if (boundary === 'expired') h.time.iso = '2028-01-01T12:00:00.000Z'; else h.client().close();
      const result = await host.save(preview.review_id); assert.equal(result.ok, false, boundary); assert.equal(result.acknowledged, false);
      if (boundary === 'expired') assert.equal(planOps(await h.snapshot()).length, 0);
    } finally { h.close(); }
  }
});

test('PE06 real machine-settings host keeps notes by ID across two dated renames and refuses final-empty note', async () => {
  const h = await scaffold(); let notes; try {
    notes = await createMachineSettingsHost({ client: h.client(), day: DAY });
    const machine = { exercise_id: 'press-old', settings: [{ name: 'Seat', value: '4' }], cues: 'Synthetic setup cue' };
    assert.equal((await notes.save(machine)).ok, true);
    const note = await notes.latest('press-old'), host = await h.host();
    const first = await reviewed(host, { n: 'Synthetic first rename' }); assert.equal((await host.save(first.review_id)).ok, true);
    const second = await reviewed(host, { n: 'Synthetic final rename' }); assert.equal((await host.save(second.review_id)).ok, true);
    const next = await host.read(NEXT); assert.equal(exOf(next).n, 'Synthetic final rename');
    assert.equal(exOf(await host.read(DAY)).n, 'Synthetic press-old');
    expectSame(await notes.latest('press-old'), note, 'rename changes no machine-settings operation');
    const before = await h.snapshot(), empty = await notes.save({ exercise_id: 'press-old' });
    assert.equal(empty.ok, false); expectSame(await h.snapshot(), before, 'clearing the last answer is deferred');
  } finally { notes?.close(); h.close(); }
});

test('PE04 add and replace bind real F2 snapshots to the built operation and retain the old ID and notes', async () => {
  const h = await scaffold(); let notes; try {
    notes = await createMachineSettingsHost({ client: h.client(), day: DAY });
    assert.equal((await notes.save({ exercise_id: 'row-old', cues: 'Synthetic old machine cue' })).ok, true);
    const note = await notes.latest('row-old'), projected = [];
    const host = await h.host({ projectNewExerciseTags(row, tags, context) {
      projected.push(structuredClone({ row, tags, context }));
      return tagProjector.projectNewExerciseTags(row, tags, context);
    } });
    const initial = await h.snapshot(), old = exOf(await host.read(DAY), 'row-old');
    const add = { kind: 'add', exercise: EX('synthetic-added', 'U', 'chest'),
      tags: { head: null, secondary: [{ mg: 'delts', lend: 0.5, head: 'delts_front' }, { mg: 'back', lend: 0.25 }] } };
    const preview = await host.review(add); assert.equal(preview.reviewed, true, preview.code);
    assert.equal(projected.length, 0, 'preview does not manufacture an operation identity');
    const added = await host.save(preview.review_id); assert.equal(added.ok, true, added.code);
    const tomorrow = await host.read(NEXT), addedRow = exOf(tomorrow, add.exercise.id);
    assert.equal(exOf(await host.read(DAY), add.exercise.id), undefined);
    assert.equal(addedRow.w, null); assert.deepEqual(addedRow.forks, []);
    assert.deepEqual(addedRow.secondary, add.tags.secondary); assert.equal(addedRow.volumeTags.op_id, added.op_id);
    assert.equal(addedRow.volumeTags.date, NEXT); assert.equal(addedRow.volumeTags.profile, 'earned/setup-volume-tags/v1');
    assert.deepEqual(addedRow.volumeTags.regionsByMuscle.back, ['lats', 'upper_back', 'traps', 'lower_back']);
    assert(projected.length > 0); assert(projected.every(p => Object.keys(p.row).length === 8 && p.context.op_id === added.op_id));
    const replacement = { kind: 'replace', exercise_id: 'row-old', exercise: EX('synthetic-replacement', 'U', 'back'),
      tags: { head: 'lats', secondary: [] } };
    const replacePreview = await host.review(replacement); assert.equal(replacePreview.reviewed, true, replacePreview.code);
    const replaced = await host.save(replacePreview.review_id); assert.equal(replaced.ok, true, replaced.code);
    const future = await host.read(NEXT), row = exOf(future, replacement.exercise.id);
    assert.equal(row.volumeTags.op_id, replaced.op_id); assert.equal(row.head, 'lats'); assert.deepEqual(row.secondary, []);
    assert.equal(row.w, null); assert.deepEqual(row.forks, []);
    assert.equal(future.state.retirements['row-old'], replaced.op_id);
    expectSame(exOf(future, 'row-old'), old, 'replacement retains original exercise snapshot');
    expectSame(await notes.latest('row-old'), note, 'retirement retains machine note under old stable ID');
    assert.equal(await notes.latest(replacement.exercise.id), null, 'new identity inherits no machine note');
    const after = await h.snapshot(); assert.equal(planOps(after).length, 2);
    assert.deepEqual(counts(after), { ops: counts(initial).ops + 2, outbox: counts(initial).outbox + 2 });
    assert.deepEqual(planOps(after).map(op => op.members[0].value.edit.tags), [add.tags, replacement.tags]);
    const reopened = await h.reopen(); assert.equal(exOf(await reopened.read(NEXT), replacement.exercise.id).head, 'lats');
  } finally { notes?.close(); h.close(); }
});

test('PE09-projection actual pending candidate refuses an invalid new-row binder before durable commit', async () => {
  const h = await scaffold(); try {
    // Fault a source-owned companion after its actual projection. Preview has
    // no operation ID; only the real staged replay can reject this corruption.
    const host = await h.host({ projectNewExerciseTags(row, tags, context) {
      return { ...tagProjector.projectNewExerciseTags(row, tags, context), w: 99 };
    } });
    const preview = await host.review({ kind: 'add', exercise: EX('synthetic-invalid-binder', 'U', 'chest'),
      tags: { head: null, secondary: [] } });
    assert.equal(preview.reviewed, true, preview.code);
    const before = await h.snapshot(), saved = await host.save(preview.review_id);
    assert.equal(saved.ok, false, 'PE09_PROJECTION_INVALID_CANDIDATE_REFUSED');
    assert.equal(saved.acknowledged, false); assert.equal(saved.code, 'PLAN_EDIT_NEW_TAG_PROJECTION_INVALID');
    expectSame(await h.snapshot(), before, 'invalid tagged candidate writes no operation or outbox');
  } finally { h.close(); }
});

test('PE04 missing new-tag companion and incompatible secondary heads refuse without durable change', async () => {
  const h = await scaffold(); try {
    const missing = await h.host({ projectNewExerciseTags: null }), before = await h.snapshot();
    const add = { kind: 'add', exercise: EX('synthetic-missing-companion', 'U', 'chest'), tags: { head: null, secondary: [] } };
    const absent = await missing.review(add); assert.equal(absent.reviewed, false);
    assert.equal(absent.code, 'PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE');
    const host = await h.host(), bad = structuredClone(add); bad.tags.secondary = [{ mg: 'back', lend: 0.5, head: 'delts_front' }];
    assert.equal((await host.review(bad)).reviewed, false);
    expectSame(await h.snapshot(), before, 'missing or contradictory anatomy evidence cannot write');
  } finally { h.close(); }
});

/* ===== PE15 / S4 REAL DAY (DECISIONS:437/:451/:467) =====
   TOMORROW comes from the installation's live athlete-local day, the same value
   today-bindings.mjs openTodayInstallation reports as liveDay() and Today stands
   on. A host's own clock.today() is its FROZEN `day` argument, so a page that
   opened yesterday must not date an edit from it. Here `live.day` is that live
   value and `time.iso` drives the client's stamp clock, exactly as the two move
   apart on a real device between local midnight and the page's next adoption. */
test('PE15 tomorrow is the live athlete-local day plus one, not the host clock day', async () => {
  const h = await scaffold(); try {
    const host = await h.host();
    assert.equal((await reviewed(host, { sets: 3 })).starts_on, NEXT, 'the two agree on the opening day');
    // Local midnight passed. The installation adopted the new day; the page's own
    // stamp clock has not moved, which is the :437 shape exactly.
    h.live.day = '2026-09-15';
    const later = await host.review(update({ hi: 11 }, 'row-old'));
    assert.equal(later.reviewed, true, later.code);
    assert.equal(later.starts_on, '2026-09-16', 'the athlete is shown the date his own calendar is on');
    const read = await host.read();
    assert.equal(read.read, true, read.code);
    assert.deepEqual(read.pending_dates, [], 'and nothing has been written to reach it');
  } finally { h.close(); }
});
test('PE15 a live day that has moved past the review refuses and shows the new result', async () => {
  const h = await scaffold(); try {
    const host = await h.host(), before = await h.snapshot();
    const review = await reviewed(host, { sets: 3 });
    assert.equal(review.starts_on, NEXT);
    h.live.day = '2026-09-15';
    const refused = await host.save(review.review_id);
    assert.equal(refused.acknowledged, false); assert.equal(refused.code, 'PLAN_EDIT_REVIEW_STALE');
    // NOT just "no": the plan that is actually there, and the date a fresh
    // review would now offer, come back with the refusal.
    assert.equal(refused.starts_on, '2026-09-16');
    assert.equal(refused.plan_basis, (await host.read()).plan_basis);
    expectSame(refused.current, h.basisState, 'the unedited plan is what is shown');
    expectSame(await h.snapshot(), before, 'a stale review writes nothing');
  } finally { h.close(); }
});
test('PE15 stamp-clock disagreement is named PLAN_EDIT_DAY_TURNED before anything is built', async () => {
  const h = await scaffold(); try {
    const host = await h.host(), before = await h.snapshot();
    const review = await reviewed(host, { sets: 3 });
    /* The athlete is still on his own 14th (live.day), but the instant the
       client stamps with has crossed UTC midnight. In the page these agree by
       construction (clientClockFor takes the host's own day); if they ever do
       not, the operation would carry a date the review was never authored on.
       R1 finding 5: nothing was ever written either way, but the client's own
       closed validator can only say WORKOUT_INPUT_INVALID / "Nothing was
       recorded", which is not what happened. The host names it first. */
    h.live.day = DAY; h.time.iso = '2026-09-15T01:30:00.000Z';
    assert.equal(h.clock.today(), '2026-09-15'); assert.equal(h.live.day, DAY);
    const refused = await host.save(review.review_id);
    assert.equal(refused.acknowledged, false, JSON.stringify(refused));
    assert.equal(refused.ok, false, JSON.stringify(refused));
    assert.equal(refused.code, 'PLAN_EDIT_DAY_TURNED', JSON.stringify(refused));
    assert.equal(refused.message,
      'The day changed while this was open. Review the latest week before saving.');
    assert.equal(refused.invalid, undefined, 'the client was never asked to build this operation');
    assert.equal([...refused.message].some(c => c.codePointAt(0) >= 0x2010 && c.codePointAt(0) <= 0x2015),
      false, 'no dash in athlete-facing copy');
    expectSame(await h.snapshot(), before, 'no operation and no outbox entry');
    assert.equal(planOps(await h.snapshot()).length, 0);
    // Put the two back in step and the SAME review still saves: this refusal is
    // about the disagreement, not about the review having been spent.
    h.time.iso = DAY + 'T23:45:00.000Z';
    const saved = await host.save(review.review_id);
    assert.equal(saved.acknowledged, true, saved.code);
    assert.equal(planOps(await h.snapshot())[0].effective.local_date, DAY);
  } finally { h.close(); }
});
/* R1 note 6. admittedLocalSourceBasis narrows the admitted import to THIS
   athlete's label in THIS namespace. Defaulted to null the P2 predicate reads
   "any admitted import", so the host refuses to exist without them. */
test('PE17 a host without the installation identity refuses to be constructed', async () => {
  const h = await scaffold(); try {
    for (const missing of [{ athleteLabel: undefined }, { namespace: undefined },
      { athleteLabel: '  ' }, { namespace: null }, { athleteLabel: 7 }]) {
      await assert.rejects(() => h.host(missing), { code: 'PLAN_EDIT_HOST_INCOMPLETE' },
        JSON.stringify(Object.keys(missing)));
    }
    assert.equal((await (await h.host()).read()).read, true, 'and with both it opens');
  } finally { h.close(); }
});
test('PE15 with the two in step across a local midnight the edit commits for the right date', async () => {
  const h = await scaffold(); try {
    h.time.iso = DAY + 'T23:45:00.000Z'; h.live.day = DAY;
    const host = await h.host(), review = await reviewed(host, { sets: 3 });
    assert.equal(review.starts_on, NEXT);
    const saved = await host.save(review.review_id);
    assert.equal(saved.acknowledged, true, saved.code);
    assert.equal(saved.starts_on, NEXT);
    const op = planOps(await h.snapshot())[0];
    assert.equal(op.effective.local_date, DAY, 'stamped on the day it was authored');
    assert.equal(op.members[0].value.starts_on, NEXT);
    // Today is unchanged until his own calendar reaches it.
    assert.equal(exOf(await host.read()).sets, 2);
    h.live.day = NEXT; h.time.iso = NEXT + 'T00:15:00.000Z';
    assert.equal(exOf(await host.read()).sets, 3, 'and on the new local day it is in force');
  } finally { h.close(); }
});

/* ===== PE16 / P0-B + P2. THE ADOPTED BASIS, THROUGH THE REAL STORE ===== */
function admitState(generation, state, { namespace, selection = 'local-source:synthetic-plan-edit' } = {}) {
  const basis = { profile: 'earned/local-source-basis/v1', installation_id: namespace, local_selection_id: selection };
  generation.metadata.localSources = { selections: { [selection]: { id: selection } }, active: selection };
  generation.metadata.localSourceApplication = { selection_id: selection, core_complete: true, basis: structuredClone(basis) };
  generation.collections.derived = { localSource: { basis: structuredClone(basis),
    view: { ready: true, pending: false, issues: [], basis: structuredClone(basis), state: structuredClone(state) } } };
}
function importedOf(basisState) {
  const imported = structuredClone(basisState);
  imported.exercises[0].n = 'Flat bench';
  imported.exercises[0].renames = [{ from: '2026-08-20', prevN: 'Bench press' }];
  imported.reads = [{ d: '2026-08-01', w: 181.2 }];
  return imported;
}
test('PE16 an admitted import in the real generation is the basis the companion edits', async () => {
  const h = await scaffold(); try {
    const imported = importedOf(h.basisState);
    await h.tamper(next => admitState(next, imported, { namespace: 'synthetic-plan-edit/device-A' }));
    const host = await h.host({ basisState: imported }), read = await host.read();
    assert.equal(read.read, true, read.code);
    assert.equal(read.state.exercises[0].n, 'Flat bench', 'his own imported name, not the setup document');
    assert.deepEqual(read.state.reads, [{ d: '2026-08-01', w: 181.2 }], 'his imported readings survive');
    const review = await reviewed(host, { sets: 3 });
    const saved = await host.save(review.review_id);
    assert.equal(saved.acknowledged, true, saved.code);
    const tomorrow = await host.read(NEXT);
    assert.equal(exOf(tomorrow).sets, 3);
    assert.equal(exOf(tomorrow).n, 'Flat bench', 'the edit composes onto HIS row');
    assert.deepEqual(exOf(tomorrow).renames, [{ from: '2026-08-20', prevN: 'Bench press' }]);
  } finally { h.close(); }
});
test('PE16 the clean-init state is refused over an admitted import and never substituted', async () => {
  const h = await scaffold(); try {
    const imported = importedOf(h.basisState), before = await h.snapshot();
    await h.tamper(next => admitState(next, imported, { namespace: 'synthetic-plan-edit/device-A' }));
    const wrong = await h.host(), read = await wrong.read();
    assert.equal(read.read, false);
    assert.equal(read.code, 'PLAN_EDIT_IMPORTED_BASIS_MISMATCH');
    assert.equal((await wrong.review(update({ sets: 3 }))).reviewed, false);
    expectSame(planOps(await h.snapshot()), planOps(before), 'a refused basis writes nothing');
  } finally { h.close(); }
});
test('PE16 an import that was never admitted refuses instead of projecting a plan', async () => {
  const h = await scaffold(); try {
    const imported = importedOf(h.basisState);
    await h.tamper(next => { admitState(next, imported, { namespace: 'synthetic-plan-edit/device-A' });
      next.collections.derived.localSource.view.ready = false; });
    for (const basis of [imported, h.basisState]) {
      const host = await h.host({ basisState: basis }), read = await host.read();
      assert.equal(read.read, false);
      assert.equal(read.code, 'PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE');
    }
  } finally { h.close(); }
});
