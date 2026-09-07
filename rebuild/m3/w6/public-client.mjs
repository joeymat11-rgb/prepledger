import W5 from "../w5/public-client.cjs";
import { createBridge } from "./bridge.mjs";
import { StorageFailure } from "./repository.mjs";
import { createCandidateGrant } from "./candidate-grant.mjs";
import Canonical from "../../authority/canonical.cjs";
const copy = value => structuredClone(value);
const refusal = (state, code, reason) => ({ stored: false, durable: false, state, code, reason });
const reasonFor = state => ({ 17: "This installation needs sign-in or enrollment recovery.", 18: "Stored truth needs recovery before it can be used.",
  19: "A rejected update needs durable recovery.", 20: "The write allowance needs a verified reconnect." }[state] || "The update was not durably stored.");

// No production observation/fence policy is supplied here. The owner must inject
// a reviewed guard covering verification through durable outcome; tests label theirs synthetic.
export function createDurablePublicClient({ repository, stage, namespace, athleteId, deviceId, sessionEpoch,
  isCurrentSession, observationEpoch, observationGuard, validateCommit, keys, subtle, crypto, monotonicMs,
  maxTimeRoundTripMs, schemaVersion = 1, permissionNowIso } = {}) {
  if (!repository || typeof stage !== "function" || !namespace || !athleteId || !deviceId || sessionEpoch === undefined ||
      typeof isCurrentSession !== "function" || typeof observationEpoch !== "function" || typeof observationGuard?.run !== "function" || typeof validateCommit !== "function") throw new TypeError("Explicit durable client scope, staging, observation guard and validator required");
  const verifier = W5.createPublicVerifier({ keys, subtle });
  let tail = Promise.resolve(), activeProof = null, activeGrant = null, activeContext = null, visibleEpoch = null, lateRefusal = null, timeInFlight = false;
  const current = () => isCurrentSession(sessionEpoch) === true;
  const enqueue = action => { const task = tail.then(action); tail = task.catch(() => {}); return task; };
  function contextFailure(epoch) {
    try {
      if (!current()) return refusal(17, "SESSION_CHANGED", reasonFor(17));
      if (epoch !== null && epoch !== observationEpoch()) return refusal(18, "OBSERVATION_CHANGED", reasonFor(18));
      return null;
    } catch { return refusal(18, "CONTEXT_UNPROVEN", reasonFor(18)); }
  }
  function completedOutcome(result) {
    const changed = contextFailure(activeContext?.observationEpoch ?? null);
    if (changed && result.durableRevision) {
      lateRefusal = { ...changed, stored: true, durable: true, confirmed: false, acknowledged: false, committed: true, committedRevision: result.durableRevision };
      return lateRefusal; // Disk committed; the changed context receives no Saved result or old truth.
    }
    if (result.durableRevision) visibleEpoch = activeContext?.observationEpoch ?? null;
    return result;
  }
  async function verifiedHistory(generation) {
    const families = generation.metadata.wireProofs || {};
    const methods = { disposition: "verifyDisposition", pull: "verifyPull", snapshot: "verifySnapshot", lease: "verifyLease", time: "verifyServerTime" };
    for (const [kind, records] of Object.entries(families)) {
      if (!Object.hasOwn(methods, kind)) return false;
      const method = methods[kind];
      if (!method || !records || typeof records !== "object" || Array.isArray(records)) return false;
      for (const record of Object.values(records)) {
        if (!await verifier[method](record)) return false;
        if (kind !== "disposition" && (record.athlete_id !== athleteId || record.device_id !== deviceId)) return false;
        if (kind === "disposition") {
          const op = generation.collections.ops?.[record.op_id];
          if (!op || op.athlete_id !== athleteId || op.device_id !== deviceId || record.device_id !== deviceId || record.device_seq !== op.device_seq || record.canonical_content_commitment !== op.canonical_content_commitment) return false;
        }
        if (kind === "pull" || kind === "snapshot") {
          const receipts = kind === "pull" ? record.receipts : record.entries;
          if (!Array.isArray(receipts)) return false;
          for (const receipt of receipts) if (!await verifier.verifyReceipt(receipt) || receipt.op?.athlete_id !== athleteId) return false;
        }
      }
    }
    return true;
  }
  const bridge = createBridge({ repository, validateCommit(context) {
    const failure = contextFailure(context.observationEpoch); if (failure) return failure;
    return validateCommit(context);
  }, stage: async (generation, command, args) => {
    activeGrant?.retire(); activeGrant = null;
    if (!current()) throw new StorageFailure("SESSION_CHANGED", 17);
    const epoch = observationEpoch();
    if (!await verifiedHistory(generation)) throw new StorageFailure("HISTORICAL_PROOF_UNPROVEN", 18);
    const lease = copy(command === "@lease" ? activeProof?.record : generation.metadata.authorityLease);
    if (!lease || !await verifier.verifyLease(lease) || lease.athlete_id !== athleteId || lease.device_id !== deviceId || lease.schema_version !== schemaVersion) throw new StorageFailure("LEASE_PROOF_UNPROVEN", 18);
    if (command === "@lease" && generation.metadata.authorityLease && Canonical.canonicalEncode(lease) !== Canonical.canonicalEncode(generation.metadata.authorityLease)) throw new StorageFailure("LEASE_RENEWAL_UNIMPLEMENTED", 18);
    let expectedOperation = null, disposition = null;
    if (command === "@disposition") {
      disposition = copy(activeProof.record); expectedOperation = copy(generation.collections.ops?.[disposition.op_id]);
      if (!expectedOperation || !await verifier.verifyDisposition(disposition)) throw new StorageFailure("DISPOSITION_PROOF_UNPROVEN", 18);
    }
    const scope = { namespace, athleteId, deviceId, sessionEpoch, observationEpoch: epoch };
    activeContext = scope;
    activeGrant = createCandidateGrant({ lease, disposition, expectedOperation, scope, isCurrent: () => current() && epoch === observationEpoch() });
    const grant = activeGrant;
    const config = { authorityKey: undefined, lease, authorityVerification: { verifyLease: grant.verifyLease, verifyDisposition: grant.verifyDisposition } };
    if (permissionNowIso !== undefined) {
      let sample;
      try { sample = permissionNowIso(); } catch { sample = undefined; }
      config.permissionNowIso = () => sample;
    }
    const candidate = copy(stage(generation, command, args, { config, record: activeProof?.record, proof: activeProof?.proof }));
    // The configured/verifying schema is not evidence of the actual writer's schema.
    // Inspect the immutable candidate before any sealing, durable write or Saved.
    if (candidate.result?.acknowledged === true && candidate.commit?.kind === "local-operation" &&
        Array.isArray(candidate.commit.batch?.operations) &&
        candidate.commit.batch.operations.some(op => op.schema_version !== lease.schema_version)) {
      const failure = contextFailure(epoch);
      if (failure) throw new StorageFailure(failure.code, failure.state);
      throw new StorageFailure("OPERATION_SCHEMA_MISMATCH", 20);
    }
    return { ...candidate, context: { namespace, sessionEpoch, observationEpoch: epoch } };
  } });
  async function sink(command, record) {
    try {
      if (!current()) return refusal(17, "SESSION_CHANGED", reasonFor(17));
      activeProof = { ...activeProof, record: copy(record) };
      const result = completedOutcome(await bridge.execute(command, null));
      if (result.committed) return { stored: true, durable: true, confirmed: false, committed: true, committedRevision: result.committedRevision,
        state: result.state, code: result.code, reason: result.reason };
      if (result.stored === true && result.durableRevision) return { stored: true, durable: true, revision: result.durableRevision, result: result.result };
      const state = [17, 18, 19, 20].includes(result.state) ? result.state : 3;
      return refusal(state, result.code || "DURABLE_SINK_REFUSED", reasonFor(state));
    } catch (error) {
      const state = [17, 18, 19, 20].includes(error.state) ? error.state : 3;
      return refusal(state, error instanceof StorageFailure ? error.code : "DURABLE_SINK_FAILED", reasonFor(state));
    }
  }
  const boundary = W5.createPublicBoundary({ keys, athleteId, deviceId, subtle, crypto, monotonicMs, maxTimeRoundTripMs, schemaVersion,
    client: Object.freeze({ deliverDisposition: record => sink("@disposition", record), deliverReceipts: records => sink("@pull", records),
      receiveSnapshot: record => sink("@snapshot", record), receiveLease: record => sink("@lease", record), syncedServerTime: record => sink("@time", record) }) });
  const normalize = result => result?.accepted === false && (result.result?.stored === false || result.result?.confirmed === false) ? { ...result, state: result.result.state, reason: result.result.reason, code: result.result.code } : result;
  async function accept(kind, record, extra) {
    try {
      if (!current()) return refusal(17, "SESSION_CHANGED", reasonFor(17));
      const input = copy(record); activeProof = { proof: input };
      return normalize(await observationGuard.run(kind, async () => {
        if (!current()) return refusal(17, "SESSION_CHANGED", reasonFor(17));
        const method = { disposition: "acceptDisposition", pull: "acceptPull", snapshot: "acceptSnapshot", lease: "acceptLease", time: "acceptServerTime" }[kind];
        if (kind === "disposition") {
          const snapshot = await repository.load(); extra = copy(snapshot.generation.collections.ops?.[input.op_id]);
        }
        return boundary[method](input, extra);
      }));
    } catch (error) { const state = [17, 18, 19, 20].includes(error.state) ? error.state : 3; return refusal(state, "PUBLIC_CLIENT_FAILED", reasonFor(state)); }
    finally { activeGrant?.retire(); activeGrant = null; activeProof = null; }
  }
  return Object.freeze({
    current() {
      const value = bridge.current(), failure = contextFailure(visibleEpoch) || lateRefusal;
      if (failure) return { view: null, retainedInput: failure.state === 17 ? null : value.retainedInput, refusal: copy(failure) };
      return [17, 18, 19].includes(value.refusal?.state) ? { ...value, view: null } : value;
    },
    execute(command, args) { const input = copy(args); return enqueue(async () => {
      try {
        if (lateRefusal) return { ...refusal(lateRefusal.state, "RECOVERY_REQUIRED", lateRefusal.reason), acknowledged: false, priorCommittedRevision: lateRefusal.committedRevision };
        return completedOutcome(await bridge.execute(command, input));
      } finally { activeGrant?.retire(); activeGrant = null; }
    }); },
    reopen() { return enqueue(async () => {
      try {
        if (lateRefusal) return { view: null, retainedInput: null, refusal: copy(lateRefusal) };
        const result = await bridge.reopen(), failure = contextFailure(activeContext?.observationEpoch ?? null);
        if (failure) return { view: null, retainedInput: null, refusal: failure };
        if (!result.refusal) visibleEpoch = activeContext?.observationEpoch ?? null;
        return result;
      } finally { activeGrant?.retire(); activeGrant = null; }
    }); },
    acceptResponse(kind, { wireVersion, body } = {}, expectedWatermark) {
      if (wireVersion !== W5.WIRE_VERSION || !["disposition", "pull", "snapshot", "lease"].includes(kind)) return Promise.resolve(refusal(12, "WIRE_VERSION_OR_KIND", "The response format is not supported."));
      const record = copy(kind === "disposition" ? body?.disposition : kind === "lease" ? body?.lease : body);
      return enqueue(() => accept(kind, record, expectedWatermark));
    },
    async exchangeServerTime(request) {
      if (timeInFlight) return refusal(12, "TIME_EXCHANGE_PENDING", "A fresh-time exchange is already unresolved.");
      timeInFlight = true;
      try {
        return await observationGuard.run("time-exchange", async () => {
          if (!current()) return refusal(17, "SESSION_CHANGED", reasonFor(17));
          const challenge = await enqueue(() => boundary.beginTimeChallenge());
          // Network waiting does not own the stage/sink queue: B11 local writes may proceed.
          const response = await request(challenge);
          if (response?.wireVersion !== W5.WIRE_VERSION) return refusal(12, "WIRE_VERSION", "The response format is not supported.");
          const proof = copy(response.body);
          return enqueue(async () => {
            try {
              if (!current()) return refusal(17, "SESSION_CHANGED", reasonFor(17));
              activeProof = { proof };
              return normalize(await boundary.acceptServerTime(proof));
            } finally { activeGrant?.retire(); activeGrant = null; activeProof = null; }
          });
        });
      } catch (error) { const state = [17, 18, 19, 20].includes(error.state) ? error.state : 3; return refusal(state, "TIME_EXCHANGE_FAILED", reasonFor(state)); }
      finally { timeInFlight = false; }
    },
  });
}
