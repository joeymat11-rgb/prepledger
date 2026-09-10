"use strict";
const { signDisposition, commitmentOf, verifyLease, hmac } = require("./crypto.cjs");
const { canonicalEncode } = require("./canonical.cjs");
const { validShape, validReclassification, PLAN_KINDS } = require("./validate.cjs");
const plan = require("./plan.cjs");
const issue = require("./issue.cjs");

const slotId = op => JSON.stringify([op.device_id, op.device_seq]);
function makeAdmission({ store, authorityKey, identityKey, now, athleteIds, resolveIssuedLease, workoutProfile }) {
  if (resolveIssuedLease !== undefined && typeof resolveIssuedLease !== "function")
    throw new TypeError("resolveIssuedLease must be a synchronous function");
  const signed = (op, status, extra = {}) => signDisposition({
    op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment,
    device_id: op.device_id, device_seq: op.device_seq, status, decided_at: now(), ...extra,
  }, authorityKey);

  function workoutInvalid(value, message) {
    // An accidental native Promise is still refused synchronously. Observe its
    // rejection so a broken configured dependency cannot crash the host later.
    try { Promise.prototype.then.call(value, undefined, () => {}); } catch (_) {}
    throw new TypeError(message);
  }
  function workoutBoolean(method, op, readOperation) {
    try {
      if (!workoutProfile || typeof workoutProfile[method] !== "function")
        throw new TypeError("Workout profile unavailable");
      const value = workoutProfile[method](op, readOperation);
      if (typeof value !== "boolean") workoutInvalid(value, "Workout profile must be synchronous boolean");
      return value;
    } catch (_) {
      // Never pass a dependency's rejectionCode to attempt()'s terminal path.
      throw new TypeError("Workout profile unavailable");
    }
  }
  function workoutReferences(op) {
    try {
      if (!workoutProfile || typeof workoutProfile.references !== "function")
        throw new TypeError("Workout profile unavailable");
      const value = workoutProfile.references(op);
      if (!Array.isArray(value)) workoutInvalid(value, "Workout references must be synchronous identifiers");
      const refs = [];
      for (let i = 0; i < value.length; i++) {
        if (!Object.hasOwn(value, i) || typeof value[i] !== "string" || !value[i].trim())
          workoutInvalid(value, "Workout references must be dense identifiers");
        refs.push(value[i]);
      }
      return refs;
    } catch (_) {
      throw new TypeError("Workout profile unavailable");
    }
  }

  function retain(tx, op, disposition) {
    const previous = tx.get("operations", op.op_id);
    if (previous && previous.disposition.status !== "WAITING") return previous.disposition;
    const slot = slotId(op), occupant = tx.get("slots", slot);
    const count = (previous && previous.historyCount || 0) + 1;
    tx.insert("history", JSON.stringify([op.op_id, count]), disposition);
    tx.put("operations", op.op_id, { op, commitment: op.canonical_content_commitment, disposition, historyCount: count });
    if (!occupant) tx.insert("slots", slot, { op_id: op.op_id });
    if (!tx.get("ownership", op.op_id)) tx.insert("ownership", op.op_id, { present: true });
    return disposition;
  }
  const reject = (tx, op, code, status = "REJECTED") => retain(tx, op, signed(op, status, { rejection_code: code }));
  function decide(tx, athlete, op, reconsider) {
    const state = tx.get("metadata", "state");
    if (!state) throw new Error("unknown athlete");
    const known = tx.get("operations", op.op_id);
    if (known) {
      if (known.commitment !== op.canonical_content_commitment) return signed(op, "REJECTED", { rejection_code: "IDENTITY_COLLISION" });
      if (!reconsider || known.disposition.status !== "WAITING") return known.disposition;
    }
    if (op.athlete_id !== athlete || !validShape(op)) return reject(tx, op, "MALFORMED");
    const key = identityKey(athlete);
    let digest;
    try { digest = commitmentOf(op, key); } catch (_) { return reject(tx, op, "MALFORMED"); }
    if (digest !== op.canonical_content_commitment) return reject(tx, op, "MALFORMED");
    if (op.kind === "plan-mutation" && op.member_set_commitment !== hmac(key, "earned/members/v1" + canonicalEncode(op.members)))
      return reject(tx, op, "MALFORMED");
    const device = state.devices[op.device_id];
    // The optional resolver reads this same staged transaction. Reconsidered
    // WAITING entries reach this identical cut; renewal never substitutes a
    // different capability for the operation's original lease identifier.
    const lease = device && (resolveIssuedLease === undefined ? device.lease
      : resolveIssuedLease(tx, athlete, op.device_id, op.lease_id));
    if (resolveIssuedLease !== undefined && device && lease !== undefined &&
        (!lease || typeof lease !== "object" || Array.isArray(lease) ||
         typeof lease.then === "function" || typeof lease.lease_id !== "string" || !lease.lease_id))
      throw new TypeError("issued lease resolver returned an invalid synchronous result");
    if (!lease || lease.lease_id !== op.lease_id) return reject(tx, op, "LEASE_UNKNOWN");
    if (!verifyLease(lease, authorityKey) || lease.device_id !== op.device_id || lease.athlete_id !== athlete)
      return reject(tx, op, "LEASE_FORGED");
    if (lease.schema_version !== op.schema_version) return reject(tx, op, "MALFORMED");
    const revocation = tx.get("revocations", op.device_id);
    if (revocation && op.device_seq > revocation.barrier) return reject(tx, op, "LEASE_REVOKED_BEYOND_BARRIER");
    if (!Array.isArray(lease.range) || op.device_seq < lease.range[0] || op.device_seq > lease.range[1]) return reject(tx, op, "DEVICE_SEQ_OUT_OF_RANGE");
    // Expiry gates LOCAL commitment. Late delivery cannot revoke an acknowledged save.
    const occupied = tx.get("slots", slotId(op));
    if (occupied && occupied.op_id !== op.op_id) return reject(tx, op, "DEVICE_SEQ_REUSE");
    const workout = lease.schema_version === 2;
    if (workout && !workoutBoolean("validateShape", op)) return reject(tx, op, "MALFORMED");
    const refs = [...new Set([...op.causal_parents, ...(op.target_op_id ? [op.target_op_id] : []),
      ...(workout ? workoutReferences(op) : [])])];
    let pending = false;
    for (const ref of refs) {
      const parent = tx.get("operations", ref);
      if (!parent && tx.owners(ref).some(owner => owner !== athlete)) return reject(tx, op, "CROSS_ATHLETE_REFERENCE");
      if (parent && ["REJECTED", "REJECTED_DEPENDENCY"].includes(parent.disposition.status)) return reject(tx, op, "REJECTED_DEPENDENCY", "REJECTED_DEPENDENCY");
      if (!parent || parent.disposition.status === "WAITING") pending = true;
    }
    if (pending) return known ? known.disposition : retain(tx, op, signed(op, "WAITING"));
    if (op.kind === "reclassification" && !validReclassification(op, tx.get("operations", op.target_op_id).op)) return reject(tx, op, "MALFORMED");
    if (workout && !workoutBoolean("validateRelations", op, id => tx.get("operations", id)?.op))
      return reject(tx, op, "MALFORMED");
    const seq = state.seq + 1, accepted_at = now();
    tx.insert("log", String(seq), { seq, op, accepted_at });
    tx.put("metadata", "state", { ...state, seq });
    let extra = {};
    if (PLAN_KINDS.has(op.kind)) {
      extra = plan.admitPlan(tx, op, seq) || {};
      if (extra.rejection_code) {
        const error = new Error(extra.rejection_code); error.rejectionCode = extra.rejection_code; throw error;
      }
    }
    if (op.kind === "proposal-response") {
      extra = issue.acceptedResponse(tx, op);
    }
    tx.put("lastAccepted", op.device_id, { seq: Math.max(seqOf(tx.get("lastAccepted", op.device_id)), op.device_seq) });
    return retain(tx, op, signed(op, "ACCEPTED", { athlete_log_seq: seq, accepted_at, ...extra }));
  }
  function attempt(athlete, op, reconsider = false) {
    const r = store.transaction(athlete, tx => decide(tx, athlete, op, reconsider));
    if (r.ok) return r.value;
    if (r.error.rejectionCode) {
      const rejected = store.transaction(athlete, tx => reject(tx, op, r.error.rejectionCode));
      if (rejected.ok) return rejected.value;
    }
    return { status: "UNAVAILABLE", retry: true, op_id: op.op_id };
  }
  function drainWaiting() {
    let progressed;
    do {
      progressed = false;
      for (const athlete of athleteIds) {
        const waiting = store.read(athlete, tx => tx.scan("operations").map(r => r.value).filter(r => r.disposition.status === "WAITING"));
        for (const entry of waiting) {
          const d = attempt(athlete, entry.op, true);
          if (!["WAITING", "UNAVAILABLE"].includes(d.status)) progressed = true;
        }
      }
    } while (progressed);
  }
  return function admit(athlete, op) {
    if (!op || typeof op !== "object") throw new TypeError("operation must be an object");
    if (!athleteIds.includes(athlete)) throw new Error("unknown athlete");
    const known = store.read(athlete, tx => tx.get("operations", op.op_id));
    if (known && known.commitment === op.canonical_content_commitment && known.disposition.status !== "WAITING") return known.disposition;
    const result = attempt(athlete, op, !!known);
    if (result.status !== "UNAVAILABLE") drainWaiting();
    return result;
  };
}
const seqOf = record => record ? record.seq : 0;
module.exports = { makeAdmission, slotId };
