"use strict";

// Rows cross the backend boundary by value. No caller receives a stored object.
function copy(value) {
  if (value === undefined || value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(copy);
  const result = {};
  for (const key of Object.keys(value)) Object.defineProperty(result, key, {
    value: copy(value[key]), enumerable: true, configurable: true, writable: true,
  });
  return result;
}
const rowKey = (athlete, table, key) => JSON.stringify([athlete, table, String(key)]);

// One writer, staged row writes, atomic publication. A SQLite implementation can
// translate begin/get/scan/put/commit/rollback to an ordinary SQL transaction.
function memoryBackend(snapshot = []) {
  let rows = new Map(snapshot.map(([key, value]) => [key, copy(value)]));
  let pending = null;
  return {
    begin() { if (pending) throw new Error("writer already active"); pending = new Map(); },
    get(key) { return copy(pending && pending.has(key) ? pending.get(key) : rows.get(key)); },
    scan() { return [...new Map([...rows, ...(pending || [])])].map(([key, value]) => ({ key, value: copy(value) })); },
    put(key, value) { if (!pending) throw new Error("write outside transaction"); pending.set(key, copy(value)); },
    commit() { if (!pending) throw new Error("no transaction"); rows = new Map([...rows, ...pending]); pending = null; },
    rollback() { pending = null; },
    snapshot() { return [...rows].map(([key, value]) => [key, copy(value)]); },
  };
}

class Store {
  constructor(backend = memoryBackend()) { this.backend = backend; }
  view(athlete, writable = false) {
    const backend = this.backend;
    const get = (table, key) => backend.get(rowKey(athlete, table, key));
    const scan = (table) => backend.scan().flatMap((r) => {
      const [owner, collection, key] = JSON.parse(r.key);
      return owner === athlete && collection === table ? [{ key, value: copy(r.value) }] : [];
    });
    return {
      get, scan,
      owners(opId) { return backend.scan().flatMap((r) => {
        const [owner, table, key] = JSON.parse(r.key);
        return table === "ownership" && key === opId ? [owner] : [];
      }); },
      put(table, key, value) {
        if (!writable) throw new Error("read-only snapshot");
        if (["log", "history", "transactions", "ownership"].includes(table) && get(table, key) !== undefined)
          throw new Error("append-only row already exists: " + table);
        backend.put(rowKey(athlete, table, key), copy(value));
      },
      insert(table, key, value) {
        if (!writable) throw new Error("read-only snapshot");
        if (get(table, key) !== undefined) throw new Error("duplicate row: " + table);
        backend.put(rowKey(athlete, table, key), copy(value));
      },
    };
  }
  read(athlete, fn) { return copy(fn(this.view(athlete))); }
  transaction(athlete, fn) {
    let began = false;
    try {
      this.backend.begin(); began = true;
      const value = fn(this.view(athlete, true));
      if (value && typeof value.then === "function") throw new Error("asynchronous transaction callback unsupported");
      this.backend.commit(); return { ok: true, value: copy(value) };
    } catch (error) {
      if (began) this.backend.rollback();
      return { ok: false, error };
    }
  }
}
module.exports = { Store, memoryBackend, copy, rowKey };
