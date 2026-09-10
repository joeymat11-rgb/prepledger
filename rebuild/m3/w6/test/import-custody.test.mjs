import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {IDBFactory} from 'fake-indexeddb';
import {fixture, deferred} from './support.mjs';
import {openRepository} from '../repository.mjs';
import {parseStrictJson} from '../strict-json.mjs';

const P = 'earned/local-import-custody/v1', id = 'synthetic-source-A', encode = value => new TextEncoder().encode(value);
const material = () => ({sourceBytes: encode(' {"v":60,"note":"SYNTHETIC café e\u0301"}\r\n'),
  candidateBytes: encode('{"v":60,"note":"SYNTHETIC candidate"}'), localBytes: null,
  engineContextJson: '{"build":"synthetic-test","clock":"2030-02-04"}'});
const custody = (repo, validateContext = () => null) => repo.importCustody({parseStrictJson, validateContext});
async function raw(f, callback, mode = 'readonly') {
  const db = await new Promise((resolve, reject) => {
    const req = f.indexedDB.open(f.setup.databaseName, 1);
    req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
  });
  try { return await new Promise((resolve, reject) => {
    const tx = db.transaction('generations', mode); let result;
    callback(tx.objectStore('generations'), value => { result = value; });
    tx.oncomplete = () => resolve(result); tx.onabort = () => reject(tx.error);
  }); } finally { db.close(); }
}

test('named custody survives two later actual T2 saves and fresh reopen while previous rotates', async () => {
  const f = await fixture(); await f.seed();
  assert.equal((await f.bridge.execute('weighIn', {date: '2026-09-04', lb: 170})).acknowledged, true);
  const before = await f.repo.load(), input = material(), c = custody(f.repo);
  const staged = await c.stage(id, before, input);
  assert.deepEqual(staged, {source_id: id, checkpoint_revision: before.revision, staged: true, activation: 'pending'});
  assert.deepEqual(await f.repo.load(), before, 'Staging changes neither active nor its outbox');
  for (const lb of [171, 172]) assert.equal((await f.bridge.execute('weighIn', {date: '2026-09-04', lb})).acknowledged, true);
  const later = await f.repo.load();
  assert.equal(Object.keys(later.generation.collections.outbox).length, 3);
  const previous = await raw(f, (s, done) => { s.get('previous').onsuccess = e => done(e.target.result); });
  assert.equal(previous.revision, before.revision + 1, 'Rotating previous no longer holds the checkpoint');
  f.repo.close(); const fresh = await f.fresh(), reopened = custody(fresh.repository);
  let saved;
  await assert.doesNotReject(async () => { saved = await reopened.load(id); }, 'Named original survives later saves/reopen');
  assert.deepEqual(saved.sourceBytes, input.sourceBytes); assert.deepEqual(saved.candidateBytes, input.candidateBytes);
  assert.deepEqual(saved.checkpoint, before, 'Named checkpoint still contains its full original outbox and metadata');
  assert.deepEqual(await fresh.repository.load(), later, 'Later operations remain active byte-for-byte');
  assert.deepEqual(await reopened.stage(id, before, input), staged, 'Repeat uses immutable original binding even after later saves');
  assert.equal((await fresh.bridge.reopen()).refusal, null);
  fresh.repository.close();
});

test('checkpoint is read from the actual repository; exposed snapshots and input buffers do not alias it', async () => {
  const f = await fixture(); await f.seed(); const before = await f.repo.load(), fake = structuredClone(before), input = material();
  fake.generation.collections = {}; const c = custody(f.repo);
  const operation = c.stage(id, fake, input);
  const sourceBefore = input.sourceBytes.slice(); input.sourceBytes.fill(0); input.engineContextJson = '{}';
  await operation;
  const a = await c.load(id); assert.deepEqual(a.sourceBytes, sourceBefore); assert.deepEqual(a.checkpoint, before);
  a.sourceBytes.fill(0); a.checkpoint.generation.collections = {}; a.engineContextJson = '{}';
  const b = await c.load(id); assert.deepEqual(b.sourceBytes, sourceBefore); assert.deepEqual(b.checkpoint, before);
  f.repo.close();
});

test('same name cannot replace bytes or retarget a checkpoint; separate names retain separate originals', async () => {
  const f = await fixture(); await f.seed(); const before = await f.repo.load(), c = custody(f.repo), input = material();
  await c.stage(id, before, input);
  await assert.rejects(c.stage(id, before, {...input, candidateBytes: encode('{}')}), {code: 'IMPORT_CUSTODY_ID_CONFLICT'});
  await f.bridge.execute('weighIn', {date: '2026-09-04', lb: 171}); const later = await f.repo.load();
  await assert.rejects(c.stage(id, later, input), {code: 'IMPORT_CUSTODY_ID_CONFLICT'});
  await c.stage('synthetic-source-B', later, input);
  assert.deepEqual((await c.load(id)).checkpoint, before);
  assert.deepEqual((await c.load('synthetic-source-B')).checkpoint, later);
  f.repo.close();
});

test('another real commit during encryption makes staging stale instead of binding an old snapshot', async () => {
  const gate = deferred(), entered = deferred(); let armed = false;
  const crypto = {getRandomValues: webcrypto.getRandomValues.bind(webcrypto), subtle: new Proxy(webcrypto.subtle, {
    get(target, property) {
      if (property === 'encrypt') return async (...args) => {
        if (armed) { armed = false; entered.resolve(); await gate.promise; }
        return target.encrypt(...args);
      };
      const value = target[property]; return typeof value === 'function' ? value.bind(target) : value;
    },
  })};
  const f = await fixture({crypto}); await f.seed(); const before = await f.repo.load(), c = custody(f.repo);
  armed = true; const attempt = c.stage(id, before, material()); const refusal = assert.rejects(attempt, {code: 'IMPORT_CUSTODY_STALE_BASIS'});
  await entered.promise;
  assert.equal((await f.bridge.execute('weighIn', {date: '2026-09-04', lb: 172})).acknowledged, true);
  const later = await f.repo.load(); gate.resolve(); await refusal;
  await assert.rejects(c.load(id), {code: 'IMPORT_CUSTODY_MISSING'});
  assert.deepEqual(await f.repo.load(), later); f.repo.close();
});

test('guard revocation at the final transaction refuses a staged record; reads also check current context', async () => {
  const f = await fixture(); await f.seed(); const before = await f.repo.load(); let calls = 0;
  const c = custody(f.repo, () => ++calls >= 2 ? {code: 'SYNTHETIC_SIGNED_OUT', state: 17} : null);
  await assert.rejects(c.stage(id, before, material()), {code: 'SYNTHETIC_SIGNED_OUT', state: 17});
  await assert.rejects(custody(f.repo).load(id), {code: 'IMPORT_CUSTODY_MISSING'});
  await custody(f.repo).stage(id, before, material());
  await assert.rejects(c.load(id), {code: 'SYNTHETIC_SIGNED_OUT', state: 17});
  const asyncGuard = custody(f.repo, async () => null);
  await assert.rejects(asyncGuard.load(id), {code: 'IMPORT_CUSTODY_ASYNC_GUARD'});
  assert.deepEqual(await f.repo.load(), before); f.repo.close();
});

test('invalid custody input and thrown guard prose refuse without any active write', async () => {
  const f = await fixture(); await f.seed(); const before = await f.repo.load(), c = custody(f.repo);
  await assert.rejects(c.stage('../invalid', before, material()), {code: 'IMPORT_CUSTODY_INPUT'});
  await assert.rejects(c.stage(id, before, {...material(), candidateBytes: encode('{"v":60,"v":59}')}), {code: 'IMPORT_CUSTODY_JSON_INVALID'});
  await assert.rejects(c.stage(id, before, {...material(), sourceBytes: new Uint8Array([255])}), {code: 'IMPORT_CUSTODY_JSON_INVALID'});
  const throwing = custody(f.repo, () => { throw Error('SYNTHETIC private context detail'); });
  await assert.rejects(throwing.stage(id, before, material()), error => error.code === 'IMPORT_CUSTODY_GUARD_FAILED' && !error.cause);
  await assert.rejects(c.load(id), {code: 'IMPORT_CUSTODY_MISSING'});
  assert.deepEqual(await f.repo.load(), before); f.repo.close();
});

test('encrypted custody binds source name and namespace, rejects tampering, and cannot become active', async () => {
  const f = await fixture(); await f.seed(); const before = await f.repo.load(), c = custody(f.repo);
  await c.stage(id, before, material());
  const record = await raw(f, (s, done) => { s.get([P, id]).onsuccess = e => done(e.target.result); });
  assert.deepEqual(Object.keys(record), ['profile', 'source_id', 'iv', 'ciphertext']);
  assert(!JSON.stringify(record).includes('café'));
  await raw(f, s => s.put({...record, source_id: 'synthetic-source-B'}, [P, 'synthetic-source-B']), 'readwrite');
  await assert.rejects(c.load('synthetic-source-B'), {code: 'IMPORT_CUSTODY_INTEGRITY'});
  const wrong = await openRepository({...f.setup, namespace: 'synthetic-other-athlete'});
  await assert.rejects(custody(wrong).load(id), {code: 'IMPORT_CUSTODY_INTEGRITY'}); wrong.close();
  const broken = structuredClone(record); new Uint8Array(broken.ciphertext)[0] ^= 1;
  await raw(f, s => s.put(broken, [P, id]), 'readwrite');
  await assert.rejects(c.load(id), {code: 'IMPORT_CUSTODY_INTEGRITY'});
  await raw(f, s => s.put(record, 'active'), 'readwrite');
  await assert.rejects(f.repo.load(), {code: 'STORED_INTEGRITY_UNPROVEN'});
  f.repo.close();
});

function faults() {
  const inner = new IDBFactory(), entered = deferred();
  const control = {armed: false, release: false, mode: 'delay', tx: null};
  return {control, entered, indexedDB: {open(...args) {
    const request = inner.open(...args);
    request.addEventListener('success', () => {
      const db = request.result, transaction = db.transaction.bind(db);
      db.transaction = (...args) => {
        const tx = transaction(...args);
        if (args[1] !== 'readwrite' || !control.armed) return tx;
        control.tx = tx;
        const store = tx.objectStore('generations'), add = store.add.bind(store);
        store.add = (value, key) => {
          entered.resolve();
          if (control.mode === 'quota') throw new DOMException('Synthetic quota', 'QuotaExceededError');
          return add(value, key);
        };
        tx.objectStore = () => store;
        if (control.mode === 'delay') {
          const hold = () => { if (!control.release) { try { store.get('active').onsuccess = hold; } catch {} } };
          hold();
        }
        return tx;
      };
    }); return request;
  }}};
}
for (const action of ['complete', 'abort', 'quota']) test('real custody transaction ' + action + ' has no early/partial success', async () => {
  const fault = faults(), f = await fixture({indexedDB: fault.indexedDB}); await f.seed();
  const before = await f.repo.load(), c = custody(f.repo); fault.control.armed = true;
  fault.control.mode = action === 'quota' ? 'quota' : 'delay'; let succeeded = false;
  const promise = c.stage(id, before, material()).then(out => { succeeded = true; return out; });
  const result = action === 'complete' ? promise : assert.rejects(promise, {code: action === 'quota' ? 'IMPORT_CUSTODY_WRITE_FAILED' : 'IMPORT_CUSTODY_ABORTED'});
  result.catch(() => {}); // Keep deliberate early-result faults handled until the assertion below.
  try {
    await fault.entered.promise; assert.equal(succeeded, false);
    if (action === 'abort') fault.control.tx.abort();
    fault.control.release = true; await result; fault.control.armed = false;
    assert.equal(succeeded, action === 'complete'); assert.deepEqual(await f.repo.load(), before);
    f.repo.close(); const fresh = await f.fresh();
    try {
      if (action === 'complete') assert.deepEqual((await custody(fresh.repository).load(id)).checkpoint, before);
      else await assert.rejects(custody(fresh.repository).load(id), {code: 'IMPORT_CUSTODY_MISSING'});
    } finally { fresh.repository.close(); }
  } finally {
    fault.control.release = true;
    await result.catch(() => {});
    f.repo.close();
  }
});

test('simultaneous staging never overwrites an immutable named original and can retry the same request', async () => {
  const f = await fixture(); await f.seed(); const before = await f.repo.load(), c = custody(f.repo), input = material();
  const results = await Promise.allSettled([c.stage(id, before, input), c.stage(id, before, input)]);
  assert(results.some(r => r.status === 'fulfilled'));
  for (const result of results) if (result.status === 'rejected') assert.equal(result.reason.code, 'IMPORT_CUSTODY_CHANGED');
  assert.equal((await c.stage(id, before, input)).staged, true);
  assert.deepEqual((await c.load(id)).checkpoint, before); f.repo.close();
});
