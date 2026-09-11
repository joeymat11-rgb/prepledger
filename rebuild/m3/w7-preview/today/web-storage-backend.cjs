"use strict";

/* web-storage-backend.cjs — a DURABLE backend for rebuild/client's Store over any
   synchronous Web Storage (the browser's localStorage on the phone/PC preview, or an
   injected equivalent in tests).

   It implements exactly the BACKEND INTERFACE documented in rebuild/client/store.cjs:
   begin / write / remove / commit / rollback / get / keys / clear, with the same
   write-immediately + undo-journal rollback strategy the shipped memoryBackend uses
   (rebuild/client/README.md blesses that strategy: "the shipped in-memory backend
   applies writes immediately and keeps an undo journal, so a rollback genuinely
   reverts partial work").

   It adds NO test hook and NO product rule. Values are stored as JSON under
   `${prefix}:${collection}:${key}`; the separator is a character the client's
   collection and key names never contain (collections are fixed identifiers and keys
   are op ids / fixed names), and `keys()` enumerates by prefix.

   A Storage that throws (quota exceeded, denied in private browsing) propagates the
   throw, which is precisely how store.transaction() detects failure and rolls back —
   the client then reports state 3 and nothing is recorded. */

const SEP = ":";

function encodeKey(prefix, collection, key) {
  return prefix + SEP + collection + SEP + key;
}

function createWebStorageBackend(storage, options = {}) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function" ||
      typeof storage.removeItem !== "function" || typeof storage.key !== "function") {
    throw new Error("web-storage backend: a synchronous Storage (getItem/setItem/removeItem/key/length) is required");
  }
  const prefix = options.prefix || "earned.today.v1";
  const head = prefix + SEP;
  let open = null;
  const journal = [];

  const rawKeys = () => {
    const out = [];
    for (let i = 0; i < storage.length; i++) {
      const k = storage.key(i);
      if (typeof k === "string" && k.startsWith(head)) out.push(k);
    }
    return out;
  };
  const readRaw = (full) => {
    const text = storage.getItem(full);
    if (text === null || text === undefined) return undefined;
    return JSON.parse(text);
  };

  return {
    begin() {
      if (open) throw new Error("web-storage backend: a transaction is already open");
      open = { id: {} };
      journal.length = 0;
      return open;
    },
    write(handle, collection, key, value) {
      if (handle !== open) throw new Error("web-storage backend: write outside the open transaction");
      const full = encodeKey(prefix, collection, key);
      const prior = storage.getItem(full);
      journal.push({ full, prior });
      storage.setItem(full, JSON.stringify(value));
    },
    remove(handle, collection, key) {
      if (handle !== open) throw new Error("web-storage backend: remove outside the open transaction");
      const full = encodeKey(prefix, collection, key);
      journal.push({ full, prior: storage.getItem(full) });
      storage.removeItem(full);
    },
    commit(handle) {
      if (handle !== open) throw new Error("web-storage backend: commit of an unknown transaction");
      open = null;
      journal.length = 0;
    },
    rollback(handle) {
      if (handle !== open) return;
      for (let i = journal.length - 1; i >= 0; i--) {
        const entry = journal[i];
        if (entry.prior === null || entry.prior === undefined) storage.removeItem(entry.full);
        else storage.setItem(entry.full, entry.prior);
      }
      journal.length = 0;
      open = null;
    },
    get(collection, key) {
      return readRaw(encodeKey(prefix, collection, key));
    },
    keys(collection) {
      const collectionHead = head + collection + SEP;
      return rawKeys().filter((k) => k.startsWith(collectionHead)).map((k) => k.slice(collectionHead.length));
    },
    clear(collection) {
      const collectionHead = head + collection + SEP;
      for (const k of rawKeys()) if (k.startsWith(collectionHead)) storage.removeItem(k);
    },
    collections() {
      const names = new Set();
      for (const k of rawKeys()) {
        const rest = k.slice(head.length);
        const cut = rest.indexOf(SEP);
        if (cut > 0) names.add(rest.slice(0, cut));
      }
      return Array.from(names);
    },
  };
}

/* A synchronous in-process Storage, for tests and for a browser that denies storage.
   It is NOT durable; callers that use it must say so on screen. */
function createMemoryStorage(seed) {
  const map = new Map(seed ? Object.entries(seed) : []);
  return {
    get length() { return map.size; },
    key(i) { return Array.from(map.keys())[i] ?? null; },
    getItem(k) { return map.has(k) ? map.get(k) : null; },
    setItem(k, v) { map.set(String(k), String(v)); },
    removeItem(k) { map.delete(String(k)); },
    clear() { map.clear(); },
    snapshot() { return Object.fromEntries(map); },
  };
}

module.exports = { createWebStorageBackend, createMemoryStorage, SEP };
