"use strict";
/* store.cjs — the STORE the authority runs on: rows of text keyed (collection, key), written only inside a transaction
   that commits whole or leaves nothing. This is the seam a Cloudflare D1 / SQLite backend implements.
   BACKEND interface (everything the authority ever asks of storage):
     begin() → handle                         open a transaction
     read(handle | null, collection, key)     → the stored text | undefined (inside a transaction: reads see its own writes)
     keys(handle | null, collection)          → every key in the collection, sorted (inside a transaction: writes included)
     write(handle, collection, key, text)     stage a row (may throw a storage error → the transaction fails whole)
     remove(handle, collection, key)          stage a deletion
     commit(handle)                           make every staged write durable, all-or-nothing
     rollback(handle)                         discard every staged write
   Values cross the seam as JSON text: nothing in the authority relies on object identity surviving a write, so a
   backend over SQL rows (one writer, BEGIN/COMMIT) behaves exactly like the in-memory one below.
   The in-memory backend stages writes in the handle and applies them at commit — a thrown storage error before commit
   leaves the committed rows untouched, which is the A5 "both or neither" the laws demand. */
const TOMB = Symbol("deleted");
class StorageError extends Error { constructor(msg) { super("storage: " + msg); this.storage = true; } }
function memoryBackend() {
  const cols = new Map();
  const col = (c) => { if (!cols.has(c)) cols.set(c, new Map()); return cols.get(c); };
  const staged = (h, c) => { if (!h || !h.open) throw new StorageError("transaction is closed"); if (!h.writes.has(c)) h.writes.set(c, new Map()); return h.writes.get(c); };
  return {
    begin() { return { writes: new Map(), open: true }; },
    read(h, c, k) { if (h && h.writes.has(c) && h.writes.get(c).has(k)) { const v = h.writes.get(c).get(k); return v === TOMB ? undefined : v; } const m = cols.get(c); return m ? m.get(k) : undefined; },
    keys(h, c) { const s = new Set(cols.has(c) ? cols.get(c).keys() : []); if (h && h.writes.has(c)) for (const [k, v] of h.writes.get(c)) { if (v === TOMB) s.delete(k); else s.add(k); } return Array.from(s).sort(); },
    write(h, c, k, text) { if (typeof text !== "string") throw new StorageError("rows are text"); staged(h, c).set(k, text); },
    remove(h, c, k) { staged(h, c).set(k, TOMB); },
    commit(h) { if (!h || !h.open) throw new StorageError("transaction is closed"); for (const [c, m] of h.writes) { const target = col(c); for (const [k, v] of m) { if (v === TOMB) target.delete(k); else target.set(k, v); } } h.open = false; h.writes = new Map(); },
    rollback(h) { if (h) { h.open = false; h.writes = new Map(); } },
    /* introspection for operators and tests; a D1 backend would query its tables instead */
    dump() { const out = {}; for (const [c, m] of cols) out[c] = Object.fromEntries(m); return out; },
  };
}
/* createStore(backend) → { transaction(fn), view() }
     transaction(fn): fn(t) runs with t = { get, put, del, keys } over one backend transaction; returns { ok: true, value }
     after commit, or { ok: false, error } after rollback when a STORAGE error was thrown or the commit failed. Any other
     exception propagates after the rollback — that is a bug in the caller, not an outage, and must not be masked.
     view(): a read-only { get, keys } over the committed rows. */
function createStore(backend) {
  const parse = (text) => (text === undefined ? undefined : JSON.parse(text));
  const handle = (h) => ({
    get: (c, k) => parse(backend.read(h, c, k)),
    keys: (c) => backend.keys(h, c),
    put: (c, k, v) => { if (v === undefined) throw new StorageError("cannot store undefined"); backend.write(h, c, k, JSON.stringify(v)); },
    del: (c, k) => backend.remove(h, c, k),
  });
  function transaction(fn) {
    const h = backend.begin(); const t = handle(h);
    let value;
    try { value = fn(t); }
    catch (e) { try { backend.rollback(h); } catch (_) { /* the transaction is already dead */ } if (e && e.storage) return { ok: false, error: e }; throw e; }
    try { backend.commit(h); }
    catch (e) { try { backend.rollback(h); } catch (_) { /* already rolled back */ } if (e && e.storage) return { ok: false, error: e }; throw e; }
    return { ok: true, value };
  }
  const view = () => { const t = handle(null); return { get: t.get, keys: t.keys }; };
  return { transaction, view };
}
/* row-key helpers shared by every module: rows are scoped by athlete first, so a per-athlete export or purge is a prefix */
const rowKey = (athleteId, ...parts) => [athleteId, ...parts].join("|");
const rowPrefix = (athleteId) => athleteId + "|";
const pad = (n) => String(n).padStart(12, "0");
module.exports = { createStore, memoryBackend, StorageError, rowKey, rowPrefix, pad };
