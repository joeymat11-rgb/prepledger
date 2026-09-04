"use strict";
/* sync.cjs — SEND, DISPOSITIONS, RECEIPTS, THE FRONTIER AND REDUCTION (sheet A1 109–111, states 2/6/19, copy law).
   · syncOnce(): every eligible outbox entry is sent (the SAME op_id, attempts counted with backoff); a transport may
     answer synchronously with a disposition, which goes through the same verified path as one delivered later.
   · deliverDisposition(d): AUTHENTICATED — signature = HMAC(authority key, "earned/disposition/v1" ||
     canonical_encode(d minus authority_signature)); the op_id must be an outbox entry of this device and
     canonical_content_commitment must equal the stored op's. WAITING → stored, not drained. ACCEPTED → stored +
     drained in one transaction. REJECTED | REJECTED_DEPENDENCY → ONE atomic local transaction: disposition +
     rejected-ledger entry + outbox removal, or truth paint is BLOCKED behind idempotent recovery.
   · deliverReceipts(list): receipts are stored; the FRONTIER W is the CONTIGUOUS reduced-through watermark — an
     out-of-order receipt never advances it. A receipt may carry the accepted operation (a pulled log entry).
   · reduceThroughW(): pull what the transport has beyond W, then fold every ACCEPTED plan transaction whose record is
     durably held into the local plan projection ("Applied" = committed + EFFECTIVE + durably received). */
const { signatureOver } = require("./ops.cjs");
const DISPOSITION_DOMAIN = "earned/disposition/v1";
const STATUSES = new Set(["WAITING", "ACCEPTED", "REJECTED", "REJECTED_DEPENDENCY"]);

function createSync(ctx) {
  const { store, model, outbox, authorityKey, clock } = ctx;
  const pendingRecovery = [];   /* rejected dispositions whose atomic transaction could not complete yet */

  function verify(d) {
    if (!d || typeof d !== "object") return { ok: false, reason: "no disposition" };
    if (typeof d.op_id !== "string") return { ok: false, reason: "disposition names no op_id" };
    if (!STATUSES.has(d.status)) return { ok: false, reason: "unknown disposition status " + d.status };
    const op = model.ops.get(d.op_id);
    if (!op || op.device_id !== model.deviceId) return { ok: false, reason: "unknown op_id" };
    if (typeof d.authority_signature !== "string" || d.authority_signature !== signatureOver(authorityKey, DISPOSITION_DOMAIN, d, "authority_signature")) return { ok: false, reason: "signature does not verify" };
    if (d.canonical_content_commitment !== op.canonical_content_commitment) return { ok: false, reason: "commitment mismatch" };
    if (d.device_id !== undefined && d.device_id !== op.device_id) return { ok: false, reason: "device mismatch" };
    if (d.device_seq !== undefined && d.device_seq !== op.device_seq) return { ok: false, reason: "device_seq mismatch" };
    if (d.status === "ACCEPTED" && d.athlete_log_seq !== undefined && !(Number.isInteger(d.athlete_log_seq) && d.athlete_log_seq > 0)) return { ok: false, reason: "athlete_log_seq must be a positive integer" };
    return { ok: true, op };
  }

  function deliverDisposition(d) {
    const v = verify(d); if (!v.ok) return { stored: false, reason: v.reason };
    const existing = model.dispositions.get(d.op_id);
    if (!outbox.has(d.op_id)) {
      if (existing && existing.status === d.status && existing.canonical_content_commitment === d.canonical_content_commitment) return { stored: true, drained: d.status !== "WAITING", duplicate: true };
      return { stored: false, reason: "op_id is not in the outbox" };
    }
    if (d.status === "WAITING") {
      const r = store.transaction((t) => { t.put("dispositions", d.op_id, d); });
      if (!r.ok) return { stored: false, reason: "could not store the disposition: " + r.error.message };
      model.dispositions.set(d.op_id, d); return { stored: true, drained: false };
    }
    if (d.status === "ACCEPTED") {
      const authorityW = Math.max(model.authorityW, d.athlete_log_seq || 0);
      const r = store.transaction((t) => { t.put("dispositions", d.op_id, d); t.del("outbox", d.op_id); t.put("sync", "frontier", { W: model.W, authorityW }); });
      if (!r.ok) return { stored: false, reason: "could not store the disposition: " + r.error.message };
      model.dispositions.set(d.op_id, d); outbox.remove(d.op_id); model.authorityW = authorityW;
      return { stored: true, drained: true };
    }
    return rejectAtomically(d, v.op);
  }
  /* REJECTED | REJECTED_DEPENDENCY: one atomic local transaction, idempotent under recovery */
  function rejectAtomically(d, op) {
    const entry = { op_id: d.op_id, commitment: op.canonical_content_commitment, reason: d.rejection_code || d.status, status: d.status, decided_at: d.decided_at || null, kind: op.kind, class: op.class };
    const r = store.transaction((t) => { t.put("dispositions", d.op_id, d); t.put("rejected", d.op_id, entry); t.del("outbox", d.op_id); });
    if (!r.ok) { if (!pendingRecovery.some((p) => p.op_id === d.op_id)) pendingRecovery.push(d); return { stored: false, blocked: true, reason: require("./copy.cjs").REJECTED_BLOCKED + ": " + r.error.message }; }
    model.dispositions.set(d.op_id, d); model.rejected.set(d.op_id, entry); outbox.remove(d.op_id);
    const i = pendingRecovery.findIndex((p) => p.op_id === d.op_id); if (i >= 0) pendingRecovery.splice(i, 1);
    return { stored: true, drained: true, rejected: true };
  }
  /* idempotent recovery: retried before every truth paint */
  function recover() { for (const d of pendingRecovery.slice()) { const op = model.ops.get(d.op_id); if (!op || !outbox.has(d.op_id)) { pendingRecovery.splice(pendingRecovery.indexOf(d), 1); continue; } rejectAtomically(d, op); } return pendingRecovery.length === 0; }
  const paintBlocked = () => pendingRecovery.length > 0;

  function contiguous(from, have) { let w = from; while (have.has(w + 1)) w++; return w; }
  function deliverReceipts(list) {
    if (!Array.isArray(list)) throw new Error("deliverReceipts: a list of receipts");
    const fresh = list.filter((r) => Number.isInteger(r.seq) && r.seq > 0 && !model.receipts.has(r.seq));
    const have = new Set(model.receipts.keys()); for (const r of fresh) have.add(r.seq);
    const W = contiguous(model.W, have); const authorityW = Math.max(model.authorityW, W, ...fresh.map((r) => r.seq));
    const r = store.transaction((t) => { for (const rc of fresh) { const rec = { seq: rc.seq, op_id: rc.op_id == null ? null : rc.op_id, canonical_content_commitment: rc.canonical_content_commitment == null ? null : rc.canonical_content_commitment, accepted_at: rc.accepted_at == null ? null : rc.accepted_at }; t.put("receipts", String(rc.seq), rec); if (rc.op && typeof rc.op === "object" && typeof rc.op.op_id === "string" && !model.ops.has(rc.op.op_id)) t.put("ops", rc.op.op_id, rc.op); } t.put("sync", "frontier", { W, authorityW }); });
    if (!r.ok) throw new Error("deliverReceipts: could not store receipts: " + r.error.message);
    for (const rc of fresh) { model.receipts.set(rc.seq, { seq: rc.seq, op_id: rc.op_id || null }); if (rc.op && typeof rc.op === "object" && typeof rc.op.op_id === "string" && !model.ops.has(rc.op.op_id)) model.ops.set(rc.op.op_id, rc.op); }
    model.W = W; model.authorityW = authorityW;
    return model.W;
  }
  /* an authority plan-transaction record for one of our plan mutations (from the pulled log) */
  function receivePlanTransaction(op_id, rec) {
    const prior = model.planTxns.get(op_id) || {};
    const next = { op_id, committed: !!rec.committed, effective: !!rec.effective, at: rec.at || prior.at || null, status: rec.status || null, received: false };
    const r = store.transaction((t) => { t.put("planTxns", op_id, next); });
    if (!r.ok) return { stored: false, reason: r.error.message };
    model.planTxns.set(op_id, next); return { stored: true };
  }
  function reduceThroughW() {
    if (ctx.transport && typeof ctx.transport.pull === "function" && ctx.isOnline()) { const pulled = ctx.transport.pull(model.W); if (pulled && Array.isArray(pulled.receipts) && pulled.receipts.length) deliverReceipts(pulled.receipts); }
    const folded = [];
    for (const [op_id, pt] of model.planTxns) {
      const d = model.dispositions.get(op_id); if (!d || d.status !== "ACCEPTED") continue;
      if (pt.received) continue;
      const seq = d.athlete_log_seq; if (Number.isInteger(seq) && seq > model.W) continue;   /* not yet reduced through W */
      folded.push(op_id);
    }
    if (folded.length) {
      const r = store.transaction((t) => { const out = {}; for (const id of folded) { const pt = { ...model.planTxns.get(id), received: true }; t.put("planTxns", id, pt); if (pt.committed && pt.effective && ctx.onFold) out[id] = ctx.onFold(t, id); } t.put("sync", "frontier", { W: model.W, authorityW: model.authorityW }); return out; });
      if (r.ok) for (const id of folded) { model.planTxns.set(id, { ...model.planTxns.get(id), received: true }); if (ctx.onFolded) ctx.onFolded(id, r.value[id]); }
    }
    model.reductions += 1;
    return model.W;
  }
  function syncOnce() {
    if (!ctx.isOnline() || ctx.isPaused()) return [];
    const now = clock.monotonicMs(); const sentNow = [];
    for (const e of outbox.list()) {
      if (!outbox.eligible(e.op_id, now)) continue;
      const item = outbox.markSent(e.op_id, now); sentNow.push({ op_id: item.op_id, attempt: item.attempt, at: item.at });
      if (ctx.transport && typeof ctx.transport.send === "function") { let res; try { res = ctx.transport.send(model.ops.get(e.op_id)); } catch (_) { res = undefined; /* a lost acknowledgement: the SAME op_id retries on the next eligible tick */ } if (res && res.disposition) deliverDisposition(res.disposition); }
    }
    return sentNow;
  }
  function faceLabel(op_id) {
    const COPY = require("./copy.cjs");
    const d = model.dispositions.get(op_id);
    if (outbox.has(op_id) && !outbox.everSent(op_id)) return COPY.SAVED;
    if (!d || d.status === "WAITING" || outbox.size() > 0 || model.authorityW > model.W) return COPY.SENT;
    if (d.status === "ACCEPTED") { const pt = model.planTxns.get(op_id); if (pt && pt.committed && pt.effective && pt.received) return COPY.APPLIED(pt.at); return COPY.SYNCED(d.decided_at); }
    return COPY.REJECTED;
  }
  return { verify, deliverDisposition, deliverReceipts, receivePlanTransaction, reduceThroughW, syncOnce, faceLabel, recover, paintBlocked, DISPOSITION_DOMAIN };
}
module.exports = { createSync, DISPOSITION_DOMAIN };
