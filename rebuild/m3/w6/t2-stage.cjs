"use strict";
/* Actual T2 runs against an isolated memory backend. Browser crypto is resolved only
   by the declared build boundary; optional trusted integration never substitutes a committer. */
const Client = require("../../client/index.cjs");
const Ops = require("../../client/ops.cjs");
const {createWorkoutCommands}=require("../../m4/workout/commands.cjs");
const workoutCommands=createWorkoutCommands();
const clone = value => structuredClone(value);
const COMMANDS = new Set(["weighIn", "logSet", "logSession", "finishSession", "workout"]);

function snapshotBackend(backend, seededNames = []) {
  const collections = Object.create(null);
  for (const name of new Set([...seededNames, ...backend.collections()])) {
    const collection = Object.create(null);
    for (const key of backend.keys(name)) collection[key] = backend.get(name, key);
    collections[name] = collection;
  }
  return collections;
}
function createT2Stage(configProvider, { allowInbound = false, workoutCommands: selectedWorkoutCommands = workoutCommands } = {}) {
  if (typeof configProvider !== "function") throw new Error("T2 configuration provider required");
  return (generation, command, args, integration) => {
    const backend = Client.memoryBackend(clone(generation.collections));
    const checkpoint = backend.get("meta", "checkpoint");
    let intact = false;
    try {
      intact = checkpoint && checkpoint.counts && ["ops", "outbox"].every(name =>
        Number.isSafeInteger(checkpoint.counts[name]) && checkpoint.counts[name] >= 0) && new Client.Store(backend).integrity().intact;
    } catch {}
    if (!intact) return { generation: clone(generation), result: { acknowledged: false, state: 18,
      code: "T2_INTEGRITY_UNPROVEN", copy: Client.copy.RESTORE_REQUIRED }, view: null };
    const config = configProvider(clone(generation.metadata));
    let prepared = null;
    const trusted = allowInbound && integration ? integration : {};
    // The public boundary has verified these exact signed records. Everything
    // else read as local history must still match the existing identity HMAC;
    // authenticated storage alone cannot establish an immutable operation.
    if (integration?.historyAuthentication) {
      const signed = new Set(trusted.historyAuthentication?.signedOperationIds || []);
      // T2 still needs its configured current identity for construction. Signed
      // old records do not need to match that current key; unproved old local
      // records require recovery of their matching identity before this read.
      let verified = allowInbound && !!trusted.historyAuthentication && typeof config.identityKey === "string" && !!config.identityKey;
      try {
        for (const [id, op] of Object.entries(generation.collections.ops || {})) {
          if (signed.has(id)) continue;
          if (!op || id !== op.op_id || op.athlete_id !== config.athleteId || op.device_id !== config.deviceId ||
              typeof config.identityKey !== "string" || !config.identityKey ||
              Ops.commitmentOf(op, config.identityKey) !== op.canonical_content_commitment) { verified = false; break; }
        }
      } catch { verified = false; }
      if (!verified) return { generation: clone(generation), result: { acknowledged: false, state: 18,
        code: "LOCAL_HISTORY_IDENTITY_UNPROVEN", copy: Client.copy.RESTORE_REQUIRED }, view: null };
    }
    const observe = config.onPreparedBatch;
    // No transport is installed: this slice must not observe inbound authority facts.
    const client = Client.createClient({ ...config, ...trusted.config, backend, transport: undefined, workoutCommands: selectedWorkoutCommands,
      onPreparedBatch(batch) { prepared = batch; if (observe) return observe(batch); } });
    client.boot();
    const metadata = clone(generation.metadata);
    let result, kind = "local-operation";
    if (command === null) result = { acknowledged: false, readOnly: true };
    else if (COMMANDS.has(command)) result = client[command](args);
    else if (allowInbound && trusted.record && trusted.proof && ["@disposition", "@pull", "@snapshot", "@lease", "@time", "@currentHead"].includes(command)) {
      kind = "inbound-proof";
      try {
        let actual;
        if (command === "@disposition") actual = client.deliverDisposition(trusted.record);
        if (command === "@pull") actual = client.deliverReceipts(trusted.record);
        if (command === "@currentHead") actual = client.deliverReceipts(trusted.record.receipts);
        // A W5 accepted-log snapshot is history, never T2's derived product projection.
        if (command === "@snapshot") actual = client.deliverReceipts(trusted.record.entries);
        if (command === "@lease") { metadata.authorityLease = clone(trusted.record); actual = { stored: true }; }
        if (command === "@time") { metadata.authenticatedTimeSample = clone(trusted.record); actual = { stored: true }; }
        const stored = command === "@currentHead" ? Number.isSafeInteger(actual) && actual === trusted.record.head :
          command === "@pull" || command === "@snapshot" ? Number.isSafeInteger(actual) && actual >= 0 : actual?.stored === true;
        result = stored ? { stored: true, result: clone(actual) } : { stored: false, state: actual?.blocked ? 19 : 3, code: "T2_SINK_REFUSED", reason: "The verified update could not be staged." };
        if (stored) {
          const proofs = metadata.wireProofs || (metadata.wireProofs = {});
          const name = command.slice(1), records = proofs[name] || (proofs[name] = {});
          records[trusted.proof.authority_signature || trusted.proof.signature] = clone(trusted.proof);
        }
      } catch { result = { stored: false, state: 3, code: "T2_SINK_FAILED", reason: "The verified update could not be staged." }; }
    } else throw new Error("Unsupported staged command");
    const next = { collections: snapshotBackend(backend, Object.keys(generation.collections)), metadata };
    const commit = command === null ? undefined : { kind, batch: kind === "local-operation" ? clone(prepared) : null };
    return { generation: next, result: clone(result), view: clone(client.face()), ...(commit ? { commit } : {}) };
  };
}
// Internal recovery projection over an already authenticated local generation
// and fully verified indexed source. This is NOT a durable repository commit,
// a current-plan projection, a permission grant or an activation API.
async function prepareRecoveryProjection(generation, source) {
  const { equal, fail, assertContext, operations, accepted, W, athleteId, archiveProof } = source;
  assertContext();
  const backend = Client.memoryBackend(generation.collections), metadata = clone(generation.metadata);
  const checkpoint = backend.get("meta", "checkpoint"), frontier = backend.get("sync", "frontier");
  if (!checkpoint?.counts || !["ops", "outbox"].every(c => Number.isSafeInteger(checkpoint.counts[c]) && checkpoint.counts[c] >= 0) ||
      !new Client.Store(backend).integrity().intact) fail("RECOVERY_CANDIDATE_INTEGRITY");
  if (!Number.isSafeInteger(W) || W < 0 || !frontier || ![frontier.W, frontier.authorityW].every(n => Number.isSafeInteger(n) && n >= 0) ||
      frontier.W > W || frontier.authorityW > W) fail("RECOVERY_FRONTIER_REGRESSION");
  const terminal = d => d && ["ACCEPTED", "REJECTED", "REJECTED_DEPENDENCY"].includes(d.status);
  // Hold only the isolated synchronous MEMORY backend handle across awaits.
  // Store.transaction(async ...) would commit before the callback completes.
  const tx = backend.begin();
  try {
    await operations(async (op, disposition) => {
      assertContext();
      const id = op.op_id, retained = backend.get("ops", id), prior = backend.get("dispositions", id);
      if (retained && !equal(retained, op)) fail("RECOVERY_ORIGINAL_DISAGREEMENT");
      if (terminal(prior) && !equal(prior, disposition)) fail("LOCAL_TERMINAL_DISAGREEMENT");
      // A rejected/uncreated remote request is evidence, not a local fact. In
      // particular it must not consume this device's next sequence on T2 boot.
      if (!retained && disposition.status !== "ACCEPTED") return;
      if (op.athlete_id !== athleteId) fail("RECOVERY_ORIGINAL_SCOPE");
      if (!retained) backend.write(tx, "ops", id, op);
      backend.write(tx, "dispositions", id, disposition);
      const rejected = backend.get("rejected", id);
      if (["REJECTED", "REJECTED_DEPENDENCY"].includes(disposition.status)) {
        // Exact DTO from the actual T2 rejection transaction (sync.cjs).
        const record = { op_id: id, commitment: op.canonical_content_commitment,
          reason: disposition.rejection_code || disposition.status, status: disposition.status,
          decided_at: disposition.decided_at || null, kind: op.kind, class: op.class };
        if (rejected && !equal(rejected, record)) fail("LOCAL_REJECTION_DISAGREEMENT");
        backend.write(tx, "rejected", id, record);
      } else if (rejected) fail("LOCAL_REJECTION_DISAGREEMENT");
      if (terminal(disposition)) backend.remove(tx, "outbox", id);
    });
    assertContext();
    let ordinal = 0;
    await accepted(async row => {
      assertContext();
      const op = backend.get("ops", row.op.op_id);
      if (row.seq !== ++ordinal || !op || !equal(op, row.op)) fail("RECOVERY_RECEIPT_ORIGINAL");
      const rec = { seq: row.seq, op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment,
        accepted_at: row.accepted_at == null ? null : row.accepted_at };
      const prior = backend.get("receipts", String(row.seq));
      if (prior && (Object.keys(rec).some(k => !equal(prior[k], rec[k])) ||
          (Object.hasOwn(prior, "op") && !equal(prior.op, op)))) fail("RECOVERY_RECEIPT_DISAGREEMENT");
      if (!prior) backend.write(tx, "receipts", String(row.seq), rec);
    });
    if (ordinal !== W || backend.keys("receipts").length !== W) fail("RECOVERY_RECEIPT_FRONTIER");
    backend.write(tx, "sync", "frontier", { ...frontier, W, authorityW: W });
    // Preserve all other collections and fields, including local consent, plan,
    // leases, budget and high-water. Those are not derived from an ACK here.
    backend.write(tx, "meta", "checkpoint", { ...checkpoint, counts: { ...checkpoint.counts,
      ops: backend.keys("ops").length, outbox: backend.keys("outbox").length } });
    const proofs = metadata.recoveryArchives || (metadata.recoveryArchives = []);
    if (!Array.isArray(proofs)) fail("RECOVERY_ARCHIVE_CONFIGURATION");
    const priorProof = proofs.find(p => equal(p.reference, archiveProof.reference));
    if (priorProof && !equal(priorProof, archiveProof)) fail("RECOVERY_ARCHIVE_DISAGREEMENT");
    if (!priorProof) proofs.push(clone(archiveProof));
    assertContext();
    backend.commit(tx);
    return { collections: snapshotBackend(backend, Object.keys(generation.collections)), metadata };
  } catch (error) { backend.rollback(tx); throw error; }
}
module.exports = { createT2Stage, snapshotBackend, prepareRecoveryProjection };
