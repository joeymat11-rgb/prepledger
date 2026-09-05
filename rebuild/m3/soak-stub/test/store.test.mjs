import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import test from 'node:test';
import { IDBFactory } from 'fake-indexeddb';
import { canonical, COLLECTIONS, makeSeed, openStore, readRows, seedStore,
  inspectStore, runStore } from '../store.mjs';

// These are synthetic API/transaction tests, not evidence of Safari durability,
// storage-pressure survival, installation, or 30 elapsed idle days.
const metadata = {
  seededAt: '2026-09-05T10:00:00.000Z', device: 'synthetic test phone',
  os: 'synthetic OS', userAgent: 'node synthetic harness', platform: 'test',
  standalone: true, persistence: 'granted', origin: 'https://soak.example.test',
};
const crypto = webcrypto;

// Explicit test substitute for same-origin Web Locks. It serializes callbacks per
// name; tests below still run the real marker and IndexedDB protocol inside them.
function lockManager() {
  const tails = new Map();
  return { request(name, options, callback) {
    assert.equal(options.mode, 'exclusive');
    const run = (tails.get(name) ?? Promise.resolve()).catch(() => {}).then(callback);
    tails.set(name, run);
    return run;
  } };
}
const locks = lockManager();

function markers() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    clear: () => values.clear(),
  };
}

async function fixture(t) {
  const factory = new IDBFactory(), name = t.name;
  const db = await openStore(factory, name, { create: true });
  t.after(() => db.close());
  return { factory, name, db, rows: makeSeed(metadata) };
}

function change(db, collection, action) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(collection, 'readwrite');
    tx.oncomplete = resolve;
    tx.onabort = () => reject(tx.error ?? new Error('Test mutation aborted'));
    action(tx.objectStore(collection));
  });
}

function deleteDatabase(factory, name) {
  return new Promise((resolve, reject) => {
    const request = factory.deleteDatabase(name);
    request.onsuccess = resolve;
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Test left an open connection'));
  });
}

function state18(result) {
  assert.equal(result.ok, false);
  assert.equal(result.state, 18);
  assert.equal(result.reason, 'STORE MISSING/CHANGED');
  assert.equal(result.rows, undefined, 'failed integrity must not expose rows for truth paint');
  assert.equal(result.seed, undefined, 'failed integrity must not expose seed as verified');
}

test('seed commit and a new connection return identical bytes/hash; inspection is one read-only transaction', async t => {
  const { factory, name, db, rows } = await fixture(t);
  const seeded = await seedStore(db, rows, crypto);
  assert.equal(seeded.ok, true);
  assert.match(seeded.hash, /^[a-f0-9]{64}$/);
  assert.deepEqual(seeded.rows, rows);
  const stored = await readRows(db);
  assert.equal(stored.filter(r => r.collection === 'ops').length, 3);
  assert.equal(stored.filter(r => r.collection === 'outbox').length, 2);
  assert.deepEqual(stored.filter(r => r.collection === 'meta').map(r => r.key).sort(), ['checkpoint', 'seed']);
  db.close();
  const reopened = await openStore(factory, name);
  t.after(() => reopened.close());
  const transactions = [], original = reopened.transaction.bind(reopened);
  reopened.transaction = (...args) => {
    transactions.push({ stores: [...args[0]].sort(), mode: args[1] });
    return original(...args);
  };
  const inspected = await inspectStore(reopened, crypto);
  assert.deepEqual(inspected, seeded);
  assert.deepEqual(transactions, [{ stores: [...COLLECTIONS].sort(), mode: 'readonly' }]);
});

test('a same-count value alteration fails checksum validation', async t => {
  const { db, rows } = await fixture(t);
  await seedStore(db, rows, crypto);
  const op = rows.find(r => r.collection === 'ops');
  const altered = JSON.parse(op.value);
  altered.payload.note = 'changed but not removed';
  await change(db, 'ops', store => store.put(canonical(altered), op.key));
  assert.equal((await readRows(db)).filter(r => r.collection === 'ops').length, 3);
  state18(await inspectStore(db, crypto));
});

test('checkpoint whitespace tampering fails even when parsed JSON is unchanged', async t => {
  const { db, rows } = await fixture(t);
  await seedStore(db, rows, crypto);
  const checkpoint = (await readRows(db)).find(row => row.collection === 'meta' && row.key === 'checkpoint');
  const altered = checkpoint.value + '\n';
  assert.deepEqual(JSON.parse(altered), JSON.parse(checkpoint.value));
  await change(db, 'meta', store => store.put(altered, 'checkpoint'));
  state18(await inspectStore(db, crypto));
});

for (const missing of ['outbox', 'checkpoint']) {
  test(`a missing ${missing} row fails integrity before returning data`, async t => {
    const { db, rows } = await fixture(t);
    await seedStore(db, rows, crypto);
    if (missing === 'outbox') {
      await change(db, 'outbox', store => store.delete(rows.find(r => r.collection === 'outbox').key));
    } else {
      await change(db, 'meta', store => store.delete('checkpoint'));
    }
    state18(await inspectStore(db, crypto));
  });
}

test('an extra stored entry fails integrity', async t => {
  const { db, rows } = await fixture(t);
  await seedStore(db, rows, crypto);
  await change(db, 'ops', store => store.add(canonical({ invented: 'extra' }), 'extra-operation'));
  state18(await inspectStore(db, crypto));
});

test('two connections racing to seed have exactly one winner without replacing its rows', async t => {
  const { factory, name, db, rows } = await fixture(t);
  const other = await openStore(factory, name);
  t.after(() => other.close());
  const alternative = makeSeed({ ...metadata, device: 'different synthetic candidate' });
  const attempts = await Promise.allSettled([seedStore(db, rows, crypto), seedStore(other, alternative, crypto)]);
  assert.equal(attempts.filter(x => x.status === 'fulfilled').length, 1);
  assert.equal(attempts.filter(x => x.status === 'rejected').length, 1);
  const winner = attempts.find(x => x.status === 'fulfilled').value;
  assert.deepEqual(await inspectStore(db, crypto), winner);
  await assert.rejects(seedStore(other, rows, crypto), /already exists/);
  assert.deepEqual(await inspectStore(other, crypto), winner);
});

test('abort after the first successful row write rolls back the entire seed on reopen', async t => {
  const { factory, name, db, rows } = await fixture(t);
  const original = db.transaction.bind(db);
  let successfulWrites = 0, aborted = false;
  // External backend fault: abort a real fake-IDB transaction after a request has
  // succeeded, not before any work starts. No product fault hook is introduced.
  db.transaction = (...args) => {
    const tx = original(...args);
    if (args[1] === 'readwrite') {
      const objectStore = tx.objectStore.bind(tx);
      tx.objectStore = name => {
        const store = objectStore(name), add = store.add.bind(store);
        if (!store.testFaultWrapped) {
          store.testFaultWrapped = true;
          store.add = (...values) => {
            const request = add(...values);
            request.addEventListener('success', () => {
              successfulWrites++;
              if (!aborted) { aborted = true; tx.abort(); }
            });
            return request;
          };
        }
        return store;
      };
    }
    return tx;
  };
  await assert.rejects(seedStore(db, rows, crypto), /aborted/);
  assert.equal(aborted, true);
  assert.ok(successfulWrites >= 1);
  db.close();
  const reopened = await openStore(factory, name);
  t.after(() => reopened.close());
  assert.deepEqual(await readRows(reopened), []);
  state18(await inspectStore(reopened, crypto));
});

test('seed acknowledgement follows transaction completion and completed readback', async t => {
  const { db, rows } = await fixture(t);
  const original = db.transaction.bind(db);
  let writeComplete = false, readbackComplete = false, resolved = false;
  db.transaction = (...args) => {
    const tx = original(...args);
    tx.addEventListener('complete', () => {
      if (args[1] === 'readwrite') writeComplete = true;
      else readbackComplete = true;
    });
    return tx;
  };
  const pending = seedStore(db, rows, crypto).then(receipt => {
    resolved = true;
    assert.equal(writeComplete, true, 'request success is not durable transaction completion');
    assert.equal(readbackComplete, true, 'acknowledgement requires completed readback');
    return receipt;
  });
  await Promise.resolve();
  assert.equal(resolved, false);
  assert.equal((await pending).ok, true);
});

test('opening a missing store without explicit creation aborts its upgrade', async () => {
  const factory = new IDBFactory(), name = 'unknown-origin';
  await assert.rejects(openStore(factory, name), /MISSING/);
  assert.deepEqual(await factory.databases(), [], 'verification must not materialize an empty replacement database');
});

test('default protocol on a blank origin fails closed and creates no seed or marker', async () => {
  const factory = new IDBFactory(), name = 'blank-default', local = markers();
  state18(await runStore({ factory, markers: local, name, crypto }));
  assert.equal(local.getItem(name + ':receipt'), null);
  assert.deepEqual(await factory.databases(), []);
});

test('explicit setup is verifiable by default, but repeated setup cannot replace it', async () => {
  const factory = new IDBFactory(), name = 'explicit-setup', local = markers();
  const seeded = await runStore({ factory, markers: local, metadata, name, crypto, locks });
  assert.equal(seeded.ok, true);
  assert.deepEqual(await runStore({ factory, markers: local, name, crypto }), seeded);
  state18(await runStore({ factory, markers: local, metadata: { ...metadata, device: 'replacement' }, name, crypto, locks }));
  assert.deepEqual(await runStore({ factory, markers: local, name, crypto }), seeded);
});

test('complete IDB and marker loss remains restore-required on the default path', async () => {
  const factory = new IDBFactory(), name = 'complete-loss', local = markers();
  assert.equal((await runStore({ factory, markers: local, metadata, name, crypto, locks })).ok, true);
  await deleteDatabase(factory, name);
  local.clear();
  state18(await runStore({ factory, markers: local, name, crypto }));
  assert.deepEqual(await factory.databases(), []);
  assert.equal(local.getItem(name + ':receipt'), null);
});

test('loss of the external receipt alone cannot bless intact IDB as a fresh seed', async () => {
  const factory = new IDBFactory(), name = 'receipt-loss', local = markers();
  const seeded = await runStore({ factory, markers: local, metadata, name, crypto, locks });
  assert.equal(seeded.ok, true);
  local.clear();
  state18(await runStore({ factory, markers: local, name, crypto }));
  state18(await runStore({ factory, markers: local, metadata, name, crypto, locks }));
  const db = await openStore(factory, name);
  try { assert.deepEqual(await inspectStore(db, crypto), seeded); } finally { db.close(); }
});

test('a failed setup attempt leaves a durable marker that refuses a repeated attempt', async () => {
  const factory = new IDBFactory(), name = 'failed-attempt', local = markers();
  const unavailable = { open() { throw new Error('injected unavailable database'); } };
  state18(await runStore({ factory: unavailable, markers: local, metadata, name, crypto, locks }));
  assert.equal(local.getItem(name + ':receipt'), 'seed-attempted');
  state18(await runStore({ factory, markers: local, metadata, name, crypto, locks }));
  assert.deepEqual(await factory.databases(), []);
});

for (const mode of ['read throws', 'write throws', 'write silently lost']) {
  test(`unavailable markers (${mode}) deny setup before IDB creation`, async () => {
    const factory = new IDBFactory(), name = 'marker-' + mode;
    const unavailable = {
      getItem() { if (mode === 'read throws') throw new Error('denied'); return null; },
      setItem() { if (mode === 'write throws') throw new Error('denied'); },
    };
    state18(await runStore({ factory, markers: unavailable, metadata, name, crypto, locks }));
    assert.deepEqual(await factory.databases(), []);
  });
}

test('setup without a Web Locks capability fails before markers or IDB are created', async () => {
  const factory = new IDBFactory(), name = 'missing-locks', local = markers();
  state18(await runStore({ factory, markers: local, metadata, name, crypto }));
  assert.deepEqual(await factory.databases(), []);
  assert.equal(local.getItem(name + ':receipt'), null);
});

test('concurrent protocol setup preserves the single winner and its final marker', async () => {
  const factory = new IDBFactory(), name = 'protocol-race', local = markers(), sharedLocks = lockManager();
  const attempts = await Promise.all([
    runStore({ factory, markers: local, metadata, name, crypto, locks: sharedLocks }),
    runStore({ factory, markers: local, metadata: { ...metadata, device: 'other contender' }, name, crypto, locks: sharedLocks }),
  ]);
  assert.equal(attempts.filter(result => result.ok).length, 1);
  state18(attempts.find(result => !result.ok));
  const winner = attempts.find(result => result.ok);
  assert.equal(local.getItem(name + ':receipt'), canonical({ hash: winner.hash, seededAt: winner.seed.seededAt }));
  assert.deepEqual(await runStore({ factory, markers: local, name, crypto }), winner);
});
