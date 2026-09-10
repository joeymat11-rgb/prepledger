"use strict";
// R3 CONTRACT MODEL ONLY: JSON synthetic values and an atomic memory generation.
// This is not encryption, IndexedDB, production K1 ingress or a clock solution.
// Real HTTP proofs enter only after the test's public verifier succeeds. Each
// controlled observation is pre-armed; no assertion covers unfenced channels.
const C = require("../reconciliation/codec.cjs"), P = require("../reconciliation/project.cjs");
const copy = value => structuredClone(value);
const NOTICE = "The synced record differs from this phone's saved copy. Restore the synced record; keep this phone's copy for review.";
class SimulatedKill extends Error { constructor(cut) { super("synthetic kill at " + cut); this.code = "SIMULATED_KILL"; } }
function createDisk(initial) {
  let durable = copy(initial), fault = null, commits = 0;
  return {
    read: () => copy(durable), commits: () => commits,
    inject: cut => { fault = cut; },
    async commit(label, next) {
      if (fault === label + ":before") throw new SimulatedKill(fault);
      await Promise.resolve();
      if (fault === label + ":during") throw new SimulatedKill(fault);
      durable = copy(next); commits++;
      if (fault === label + ":after") throw new SimulatedKill(fault);
    },
  };
}
function createConsumer(disk) {
  let value = disk.read(), dead = false;
  const alive = () => { if (dead) throw new SimulatedKill("dead-process"); };
  const face = () => {
    const known = value.knownStates;
    return { state: known.includes(17) ? 17 : known.includes(19) ? 19 : known.includes(20) ? 20 : value.obligation ? 18 : null,
      recoveryState: value.obligation ? 18 : null, knownStates: copy(known),
      view: known.includes(17) || value.obligation ? null : copy(value.acceptedFacts), notices: copy(value.notices) };
  };
  async function persist(label, next) {
    try { await disk.commit(label, next); value = copy(next); }
    catch (error) { dead = true; throw error; }
  }
  function validate(replay, complete, localB64, basis) {
    if (replay?.verified !== true || complete?.verified !== true || basis !== value.basisDigest || !value.keysAvailable)
      throw new Error("complete verified evidence, current basis and local keys required");
    const localBytes = C.decode64(localB64), local = C.parse(localBytes), digest = C.hash("operation", localBytes);
    const payload = replay.value.payload, inventory = complete.value.payload;
    if (payload.outcome !== "ENVELOPE_MISMATCH" || payload.original_envelope_digest !== digest || !payload.authority_record)
      throw new Error("specific mismatch evidence required");
    const claim = inventory.claims.find(item => item.requested_envelope_digest === digest && item.outcome === "ENVELOPE_MISMATCH");
    if (!claim || !C.fullEqual(claim.stored_operation_row, payload.authority_record.operation_row) ||
        !C.fullEqual(claim.history_rows, payload.authority_record.history_rows)) throw new Error("same complete snapshot required");
    const row = P.readRow(claim.stored_operation_row);
    if (row.op.op_id !== local.op_id || row.commitment !== local.canonical_content_commitment || C.fullEqual(row.op, local))
      throw new Error("exact divergent local copy required");
    if (!P.STATUSES.has(row.disposition.status)) throw new Error("retained status required");
    return { digest, localB64, local, row, authorityRecord: copy(payload.authority_record), inventory: copy(inventory) };
  }
  return {
    current() { alive(); return { ...face(), stateBytes: copy(value) }; },
    async arm(localB64) {
      alive(); const digest = C.hash("operation", C.decode64(localB64));
      if (value.obligation && value.obligation.digest !== digest) throw new Error("another observation is unresolved");
      await persist("arm", { ...value, obligation: { status: "OPEN", digest, basisDigest: value.basisDigest, raw: null, evidence: null } });
      return face();
    },
    async observe({ replay, complete, localB64, basisDigest }) {
      alive();
      const digest = C.hash("operation", C.decode64(localB64));
      if (!value.obligation || value.obligation.digest !== digest) throw new Error("durable arm required");
      // Raw capture is persisted separately, and cannot itself clear OPEN.
      await persist("raw", { ...value, obligation: { ...value.obligation, raw: copy({ replay, complete, localB64, basisDigest }) } });
      const evidence = validate(replay, complete, localB64, basisDigest);
      await persist("observe", { ...value, obligation: { ...value.obligation, status: "MISMATCH", evidence } });
      return { ...face(), accepted: false, synced: false, canRestore: true, message: NOTICE };
    },
    async reprove() {
      alive();
      if (!value.obligation?.raw) return { ...face(), canRestore: false };
      const { replay, complete, localB64, basisDigest } = value.obligation.raw;
      const evidence = validate(replay, complete, localB64, basisDigest);
      await persist("observe", { ...value, obligation: { ...value.obligation, status: "MISMATCH", evidence } });
      return { ...face(), canRestore: true };
    },
    async restore({ explicit = false } = {}) {
      alive();
      if (!explicit) return { ...face(), restored: false, reason: "EXPLICIT_RESTORE_REQUIRED" };
      if (!value.obligation) return { ...face(), restored: value.recoveryLedger.length > 0, already: true };
      const obligation = value.obligation;
      if (obligation.status !== "MISMATCH" || !obligation.raw) return { ...face(), restored: false, reason: "EVIDENCE_REQUIRED" };
      const { replay, complete, localB64, basisDigest } = obligation.raw;
      const evidence = validate(replay, complete, localB64, basisDigest);
      const indexes = value.outbox.flatMap((entry, index) => entry.envelope_b64 === evidence.localB64 ? [index] : []);
      if (indexes.length !== 1) throw new Error("exactly one retained local retry entry required");
      const ledger = { digest: evidence.digest, envelope_b64: evidence.localB64, op_id: evidence.local.op_id,
        status: "LOCAL_COPY_NEEDS_REVIEW", authority_status: evidence.row.disposition.status,
        authority_record: evidence.authorityRecord };
      const next = { ...value, obligation: null,
        outbox: value.outbox.filter((entry, index) => index !== indexes[0]),
        recoveryLedger: [...value.recoveryLedger, ledger], authorityRows: evidence.inventory.retained_rows,
        acceptedFacts: evidence.inventory.accepted.rows.map(dto => P.readRow(dto).op),
        notices: [...value.notices, { digest: evidence.digest, status: "LOCAL_COPY_NEEDS_REVIEW", message: NOTICE }] };
      await persist("restore", next);
      return { ...face(), restored: true, durable: true, synced: false, localCopyStatus: "LOCAL_COPY_NEEDS_REVIEW" };
    },
  };
}
module.exports = { createDisk, createConsumer, SimulatedKill, NOTICE };
