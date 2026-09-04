"use strict";
/* reduce.cjs — the ATHLETE LOG (state 15/16): one strictly increasing athlete_log_seq per athlete, an append-only entry
   per accepted operation (and per consented plan effect, so the seq space has no holes a client's contiguous frontier
   could stall on), the frontier W, receipts for a pulling client, and the state-16 export pinned to W.
   Semantic order is causal_parents only: admission (admit.cjs) never accepts a child before its parents, so the log
   order is a topological order of the causal graph and two arrival orders reduce identically. */
const { rowKey, rowPrefix, pad } = require("./store.cjs");
function make(ctx) {
  const seqRow = (A) => rowKey(A, "seq");
  const frontier = (t, A) => (t.get("meta", seqRow(A)) || { n: 0 }).n;
  function nextSeq(t, A) { const n = frontier(t, A) + 1; t.put("meta", seqRow(A), { n }); return n; }
  function appendEntry(t, A, entry) { t.put("entries", rowKey(A, pad(entry.seq)), entry); return entry; }
  function entries(t, A) { const pre = rowPrefix(A); return t.keys("entries").filter((k) => k.startsWith(pre)).map((k) => t.get("entries", k)); }
  const opOf = (t, A, op_id) => { const row = t.get("ops", rowKey(A, op_id)); return row ? row.op : null; };
  function logOps(t, A) { const out = []; for (const e of entries(t, A)) if (e.type === "op") { const op = opOf(t, A, e.op_id); if (op) out.push(op); } return out; }
  function logCount(t, A) { let n = 0; for (const e of entries(t, A)) if (e.type === "op") n++; return n; }
  /* receipts a client pulls beyond its frontier: every consumed seq is accounted for, so W can advance contiguously */
  function receiptsAfter(t, A, W) {
    const out = [];
    for (const e of entries(t, A)) {
      if (!(e.seq > (W || 0))) continue;
      if (e.type === "op") out.push({ seq: e.seq, op_id: e.op_id, canonical_content_commitment: e.canonical_content_commitment, accepted_at: e.accepted_at, op: opOf(t, A, e.op_id) });
      else out.push({ seq: e.seq, op_id: null, canonical_content_commitment: null, accepted_at: e.accepted_at, plan_transaction_id: e.txn_id || null });
    }
    return out;
  }
  function exportSnapshot(t, A, o) {
    const opts = o || {}; const W = frontier(t, A); const pending = opts.outboxPending || 0; const partial = pending > 0;
    return {
      W, partial, pending,
      label: partial ? `Partial export — this device's watermark ${W}, ${pending} entr${pending === 1 ? "y" : "ies"} still pending` : `Complete through W${W} for all synced records`,
      rejectedAppendix: (opts.rejected || []).slice(),
      otherDeviceNote: "Entries still saved only on another device are not included. Sync that device first to include them.",
      records: logCount(t, A),
    };
  }
  return { frontier, nextSeq, appendEntry, entries, logOps, logCount, receiptsAfter, exportSnapshot };
}
module.exports = { make };
