"use strict";
/* outbox.cjs — the OUTBOX (sheet states 1/2, lines 349–358).
   Durable entries are op_id-keyed and written in the SAME local transaction as the operation (the client does that;
   this module owns the accounting): attempts, the retry schedule with backoff [0, 1000, 2000, 4000] ms (the last
   step repeats), retry of the SAME op_id on an eligible tick, and the sent log ("Sent" = left the phone).
   The DRAIN POINT is not here: an entry leaves the outbox only when the client durably stores the authenticated
   disposition for its op_id (sync.cjs). Send completion never drains. */
const DEFAULT_BACKOFF = [0, 1000, 2000, 4000];

class Outbox {
  constructor({ backoff } = {}) {
    this.backoff = (backoff || DEFAULT_BACKOFF).slice();
    this.entries = new Map();   /* op_id → { op_id, order, attempts, nextRetryAt, enqueued } (order = durable enqueue order) */
    this.sent = [];             /* [{ op_id, attempt, at }] — the sent log */
    this.order = 0;
  }
  load(durableEntries) { this.entries.clear(); for (const e of durableEntries.slice().sort((a, b) => a.order - b.order)) { this.entries.set(e.op_id, { op_id: e.op_id, order: e.order, attempts: 0, nextRetryAt: 0, enqueued: e.enqueued }); this.order = Math.max(this.order, e.order); } }
  nextOrder() { return this.order + 1; }
  /* the durable record the client writes next to the operation, in the same transaction */
  durableEntry(op_id, enqueued) { return { op_id, order: this.nextOrder(), enqueued }; }
  /* called only after that transaction committed */
  add(op_id, order, enqueued) { this.entries.set(op_id, { op_id, order, attempts: 0, nextRetryAt: 0, enqueued }); this.order = Math.max(this.order, order); }
  remove(op_id) { this.entries.delete(op_id); }
  has(op_id) { return this.entries.has(op_id); }
  get(op_id) { return this.entries.get(op_id); }
  size() { return this.entries.size; }
  list() { return Array.from(this.entries.values()).sort((a, b) => a.order - b.order); }
  ids() { return this.list().map((e) => e.op_id); }
  eligible(op_id, nowMs) { const e = this.entries.get(op_id); return !!e && nowMs >= e.nextRetryAt; }
  /* record one send attempt of the SAME op_id; schedule the next eligible tick */
  markSent(op_id, nowMs) {
    const e = this.entries.get(op_id); if (!e) throw new Error("outbox: markSent of an unknown op " + op_id);
    e.attempts += 1; e.lastSentAt = nowMs;
    e.nextRetryAt = nowMs + this.backoff[Math.min(e.attempts, this.backoff.length - 1)];
    const item = { op_id, attempt: e.attempts, at: nowMs }; this.sent.push(item); return item;
  }
  everSent(op_id) { const e = this.entries.get(op_id); return !!e && e.attempts > 0; }
  sentLog() { return this.sent.map((s) => ({ ...s })); }
}
module.exports = { Outbox, DEFAULT_BACKOFF };
