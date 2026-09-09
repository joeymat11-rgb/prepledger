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
module.exports = { createT2Stage, snapshotBackend };
