"use strict";
/* store.cjs — the DURABLE LOCAL STORE: real all-or-nothing transactions over a pluggable BACKEND.

   BACKEND INTERFACE (what a persistence layer must implement — SQLite, IndexedDB, files, or the in-memory backend
   shipped below):
     begin() → handle                         start a transaction
     write(handle, collection, key, value)    stage a durable write INSIDE the transaction (may throw: storage full,
                                              denied, corrupt — the store then rolls the whole transaction back)
     remove(handle, collection, key)          stage a durable delete inside the transaction
     commit(handle)                           make every staged write durable, all at once (may throw → rolled back)
     rollback(handle)                         discard every write staged in the transaction
     get(collection, key) · keys(collection)  reads (a transaction's own staged writes are visible to it)
     clear(collection)                        erase a collection outright (D2 erasure; also how a test injects loss)
   The store never reads or writes outside this interface, and it contains no test hooks: fault injection is done by
   handing createClient() a backend that fails (see README.md).

   TRANSACTIONS: store.transaction(fn) runs fn(txn) with txn.put / txn.del / txn.get / txn.keys. Every put/del goes to
   the backend immediately inside the open transaction; if fn throws, or ANY backend call throws, the store calls
   backend.rollback and reports { ok: false, error } — nothing staged survives. On success the store also writes the
   integrity CHECKPOINT (record counts of the durability-critical collections) inside the same transaction, so that a
   later boot can tell an intact store from an evicted one (state 18). */

const CHECKPOINT_COLLECTION = "meta", CHECKPOINT_KEY = "checkpoint";

function memoryBackend(seedData) {
  const data = new Map();   /* collection → Map(key → value) */
  const col = (c) => { let m = data.get(c); if (!m) { m = new Map(); data.set(c, m); } return m; };
  const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  if (seedData) for (const c of Object.keys(seedData)) for (const k of Object.keys(seedData[c])) col(c).set(k, clone(seedData[c][k]));
  let open = null;
  const journal = [];      /* undo log of the open transaction: {collection, key, had, prior} */
  return {
    begin() { if (open) throw new Error("memory backend: a transaction is already open"); open = { id: Symbol("txn") }; journal.length = 0; return open; },
    write(h, c, k, v) { if (h !== open) throw new Error("memory backend: write outside the open transaction"); const m = col(c); journal.push({ collection: c, key: k, had: m.has(k), prior: m.get(k) }); m.set(k, clone(v)); },
    remove(h, c, k) { if (h !== open) throw new Error("memory backend: remove outside the open transaction"); const m = col(c); journal.push({ collection: c, key: k, had: m.has(k), prior: m.get(k) }); m.delete(k); },
    commit(h) { if (h !== open) throw new Error("memory backend: commit of an unknown transaction"); open = null; journal.length = 0; },
    rollback(h) { if (h !== open) return; for (let i = journal.length - 1; i >= 0; i--) { const j = journal[i]; const m = col(j.collection); if (j.had) m.set(j.key, j.prior); else m.delete(j.key); } journal.length = 0; open = null; },
    get(c, k) { const m = data.get(c); return m && m.has(k) ? clone(m.get(k)) : undefined; },
    keys(c) { const m = data.get(c); return m ? Array.from(m.keys()) : []; },
    clear(c) { data.delete(c); },
    collections() { return Array.from(data.keys()); },
  };
}

class Store {
  constructor(backend, options = {}) {
    if (!backend || typeof backend.begin !== "function" || typeof backend.write !== "function" || typeof backend.commit !== "function" || typeof backend.rollback !== "function" || typeof backend.get !== "function" || typeof backend.keys !== "function") throw new Error("store: backend does not implement begin/write/remove/commit/rollback/get/keys");
    this.backend = backend;
    this.checkpointed = options.checkpoint || ["ops", "outbox"];
  }
  get(collection, key) { return this.backend.get(collection, key); }
  keys(collection) { return this.backend.keys(collection); }
  list(collection) { return this.keys(collection).map((k) => this.backend.get(collection, k)); }
  count(collection) { return this.keys(collection).length; }
  /* ONE durable local transaction: everything fn stages, or nothing */
  transaction(fn) {
    let handle;
    try { handle = this.backend.begin(); } catch (e) { return { ok: false, error: e, stage: "begin" }; }
    const b = this.backend;
    const txn = {
      put: (c, k, v) => { if (v === undefined) throw new Error("store: refusing to write an absent value (" + c + "/" + k + ")"); b.write(handle, c, k, v); },
      del: (c, k) => b.remove(handle, c, k),
      get: (c, k) => b.get(c, k),
      keys: (c) => b.keys(c),
    };
    let value;
    try {
      value = fn(txn);
      const counts = {}; for (const c of this.checkpointed) counts[c] = b.keys(c).length;
      b.write(handle, CHECKPOINT_COLLECTION, CHECKPOINT_KEY, { counts });
      b.commit(handle);
    } catch (e) {
      try { b.rollback(handle); } catch (_) { /* the backend could not even roll back: the store still reports failure */ }
      return { ok: false, error: e, stage: "write" };
    }
    return { ok: true, value };
  }
  /* INTEGRITY: compare the checkpoint against what is actually there. A store with no checkpoint and no data is FRESH
     (first boot on this device); a checkpoint that disagrees with the data is EVICTED (state 18). */
  integrity() {
    const cp = this.backend.get(CHECKPOINT_COLLECTION, CHECKPOINT_KEY);
    const actual = {}; for (const c of this.checkpointed) actual[c] = this.backend.keys(c).length;
    if (!cp) { const any = Object.values(actual).some((n) => n > 0); return any ? { intact: false, reason: "data without a checkpoint", checkpoint: null, actual } : { intact: true, fresh: true, checkpoint: null, actual }; }
    const damaged = this.checkpointed.filter((c) => (cp.counts[c] || 0) !== actual[c]);
    return { intact: damaged.length === 0, reason: damaged.length ? "checkpoint disagrees with " + damaged.join(",") : null, checkpoint: cp.counts, actual, damaged };
  }
}

module.exports = { Store, memoryBackend, CHECKPOINT_COLLECTION, CHECKPOINT_KEY };
