// local-client.mjs — ONE factory a host can open for durable local save.
//
// Composition only. Nothing here reimplements durability: openRepository
// (sealed IndexedDB generations) + createT2Stage (the real rebuild/client on a
// memory backend) + createBridge (load → stage → validate → commit → publish)
// are used UNCHANGED. What C1 supplies is the four collaborators every existing
// W6 test injected synthetically: a key provider (local-keys.mjs), an enrollment
// authorizer (local first-run evidence), a lease source (local-era.mjs) and a
// synchronous reject-only commit validator (below).
//
// "Saved" here means DURABLY-COMMITTED-ON-THIS-PHONE — see local-era.mjs. The
// bridge publishes only after the IDB transaction completes; that guard is the
// bridge's, and local-bite.cjs proves this module depends on it.
//
// OPS ARE TRUTH, derived is a cache — and that holds IN CODE, not just in this
// comment. collections.derived is a host-owned sidecar riding in the same durable
// commit as the operation; C1 computes its basis and never interprets its value.
// A malformed or basis-mismatched cache NEVER vetoes a durable save: it is carried
// through unchanged and boot() reports derived:null, derivedStale:true and a reason
// code so the host rebuilds from ops. The commit validator judges the sidecar only
// when a projector produced it IN THIS COMMIT — that is the only sidecar this
// commit is claiming anything about.
import { openRepository, StorageFailure } from "../repository.mjs";
import { createBridge } from "../bridge.mjs";
import Stage from "../t2-stage.cjs";
import Client from "../../../client/index.cjs";
import { openLocalKeys, probeRecord, keysPresent } from "./local-keys.mjs";
import { createLocalEra, localEraConfig, readLocalEra, publicEra,
  leaseExpired, leaseRenewalDue, renewLocalEraLease } from "./local-era.mjs";

const GENERATIONS_STORE = "generations";
const ACTIVE = "active";
const MARKER_STORE = "markers";
const ENROLLED = "enrolled";
const MARKER_VERSION = 1;
export const LOCAL_GENERATION_PROFILE = "earned/local-generation-metadata/v1";
export const markerDatabaseName = databaseName => `${databaseName}-local`;
export const DERIVED = "derived";
const COMMANDS = new Set(["weighIn", "logSet", "logSession", "finishSession", "workout"]);
// Every collection rebuild/client/README.md lists. enroll() seals all of them
// EMPTY so a fresh install and a migrated one have the same shape.
export const COLLECTIONS = ["ops", "outbox", "dispositions", "rejected", "receipts", "planTxns", "plan",
  "planTransactions", "planHistory", "suspensions", "issuances", "sessionStarts", "sessionResolutions",
  "drafts", "sync", "meta"];
const clone = value => structuredClone(value);
const hex = (crypto, bytes) => Array.from(crypto.getRandomValues(new Uint8Array(bytes)), b => b.toString(16).padStart(2, "0")).join("");

// The candidate's own operations, in a stable order (device_seq, then op_id).
export function opsBasis(generation) {
  const ops = generation?.collections?.ops || {};
  const rows = Object.entries(ops).map(([id, op]) => [id, Number.isSafeInteger(op?.device_seq) ? op.device_seq : -1]);
  rows.sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return { opCount: rows.length, lastOpId: rows.length ? rows[rows.length - 1][0] : null, opIds: rows.map(row => row[0]) };
}

// Is this sidecar USABLE as a cache of these ops? A basis BEHIND the ops is legal
// (a cache the host has not refreshed) and merely stale; a basis AHEAD of them, or
// a malformed record, is unusable. This answers "may the host trust it", which is
// why boot() reports it — it is NOT a veto over the athlete's save.
export function sidecarFailure(sidecar, basis) {
  if (!sidecar || typeof sidecar !== "object" || Array.isArray(sidecar) || !Object.hasOwn(sidecar, "value"))
    return { state: 3, code: "DERIVED_SIDECAR_MALFORMED" };
  const claimed = sidecar.basis;
  if (!claimed || typeof claimed !== "object" || Array.isArray(claimed) ||
      !Number.isSafeInteger(claimed.opCount) || claimed.opCount < 0 ||
      !(claimed.lastOpId === null || typeof claimed.lastOpId === "string"))
    return { state: 3, code: "DERIVED_SIDECAR_MALFORMED" };
  if (claimed.opCount > basis.opCount) return { state: 3, code: "DERIVED_BASIS_AHEAD_OF_OPS" };
  if (claimed.lastOpId !== null && !basis.opIds.includes(claimed.lastOpId)) return { state: 3, code: "DERIVED_BASIS_AHEAD_OF_OPS" };
  return null;
}

// Stale means "the host must rebuild from ops". Anything sidecarFailure refuses is
// also stale, so boot() can never report an unusable cache as fresh.
export function sidecarStale(sidecar, basis) {
  if (sidecarFailure(sidecar, basis) !== null) return true;
  return sidecar.basis.opCount !== basis.opCount || sidecar.basis.lastOpId !== basis.lastOpId;
}

// The whole commit decision, synchronous and reject-only, as a pure function so it
// can be judged on its own. `staged` is what the stage recorded for THIS attempt.
//
// Which checks can fire, and on what:
//   LOCAL_SIDECAR_UNPROVEN  — the validator was reached without this attempt's
//     record (no stage record, or one from a superseded attempt). Fails closed.
//   nothing at all          — a CARRIED sidecar. The cache is the host's, this
//     commit claims nothing about it, and ops are truth.
//   DERIVED_*               — an AUTHORED sidecar that does not describe this
//     candidate, or does not describe THIS batch. A correct stage satisfies both
//     by construction, so these are invariant assertions inside the durable
//     transaction: they fire when the stage is wrong. local-bite.cjs breaks the
//     stage to prove each one is load-bearing rather than decorative.
export function commitFailure({ staged, attempt, batch }) {
  if (!staged || staged.id !== attempt) return { state: 3, code: "LOCAL_SIDECAR_UNPROVEN" };
  if (!staged.authored) return null;
  const failure = sidecarFailure(staged.sidecar, staged.basis);
  if (failure) return failure;
  const operations = batch?.operations;
  if (!Array.isArray(operations) || !operations.length) return { state: 3, code: "DERIVED_BASIS_WITHOUT_BATCH" };
  const last = operations[operations.length - 1];
  if (staged.sidecar.basis.lastOpId !== last.op_id || staged.sidecar.basis.opCount < operations.length)
    return { state: 3, code: "DERIVED_BASIS_NOT_THE_COMMITTED_BATCH" };
  return null;
}

function writeMarker({ indexedDB, databaseName, at }) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(markerDatabaseName(databaseName), MARKER_VERSION);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(MARKER_STORE)) request.result.createObjectStore(MARKER_STORE); };
    request.onerror = () => reject(new StorageFailure("LOCAL_MARKER_OPEN_FAILED", 18));
    request.onblocked = () => reject(new StorageFailure("LOCAL_MARKER_BLOCKED", 18));
    request.onsuccess = () => {
      const db = request.result; db.onversionchange = () => db.close();
      let tx;
      try { tx = db.transaction(MARKER_STORE, "readwrite"); tx.objectStore(MARKER_STORE).put({ at }, ENROLLED); }
      catch { db.close(); reject(new StorageFailure("LOCAL_MARKER_WRITE_FAILED", 18)); return; }
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onabort = () => { db.close(); reject(new StorageFailure("LOCAL_MARKER_WRITE_FAILED", 18)); };
      tx.onerror = () => {};
    };
  });
}

export async function openLocalDurableClient({ indexedDB = globalThis.indexedDB, crypto = globalThis.crypto,
  databaseName, namespace, athleteId, deviceId, clock, workoutCommands, projector } = {}) {
  if (!indexedDB || !crypto?.subtle || !crypto?.getRandomValues || !databaseName || typeof namespace !== "string" || !namespace ||
      !athleteId || !deviceId || typeof clock?.now !== "function" || typeof clock?.today !== "function" ||
      typeof clock?.monotonicMs !== "function") throw new StorageFailure("LOCAL_CLIENT_CONFIGURATION_REQUIRED", 18);
  if (projector !== undefined && typeof projector !== "function") throw new StorageFailure("LOCAL_PROJECTOR_INVALID", 18);

  // Probe BEFORE opening anything: opening creates empty databases, and the
  // question is whether this device already holds an installation.
  const present = {
    store: await probeRecord({ indexedDB, name: databaseName, store: GENERATIONS_STORE, key: ACTIVE }),
    keys: await keysPresent({ indexedDB, databaseName }),
    marker: await probeRecord({ indexedDB, name: markerDatabaseName(databaseName), store: MARKER_STORE, key: ENROLLED }),
  };
  const nothing = !present.store && !present.keys && !present.marker;
  // First-run evidence exists ONLY because this open observed all three absent.
  // authorizeEnrollment accepts nothing else, so no caller can assert first run.
  const firstRunEvidence = nothing ? hex(crypto, 32) : null;
  let status = nothing ? { state: "first-run", code: "LOCAL_FIRST_RUN" }
    : !present.store ? { state: "restore-required", code: "STORE_MISSING" }
    : !present.keys ? { state: "restore-required", code: "KEY_MISSING" }
    : !present.marker ? { state: "restore-required", code: "ENROLLMENT_MARKER_MISSING" }
    : { state: "ready", code: "LOCAL_PRESENT" };

  const keys = await openLocalKeys({ indexedDB, crypto, databaseName });
  const repository = await openRepository({ indexedDB, crypto, databaseName, namespace, keyProvider: keys.keyProvider,
    authorizeEnrollment: evidence => firstRunEvidence !== null && evidence === firstRunEvidence });
  if (status.state === "ready") {
    // status() must never say "ready" about an installation that cannot be written
    // to, so the lease window is read here and not only at boot.
    try {
      const era = readLocalEra((await repository.load()).generation.metadata);
      if (leaseExpired(era.lease, clock.now())) status = { state: "restore-required", code: "LOCAL_LEASE_EXPIRED" };
    }
    catch (error) { status = { state: "restore-required", code: error?.code || "STORED_INTEGRITY_UNPROVEN" }; }
  }

  // Carried in the stage context for shape-compatibility with the bridge (and any
  // future validator that has something else to compare against). It is NOT a
  // check: nothing but this closure can set it, so it cannot disagree with itself.
  const sessionEpoch = hex(crypto, 8);
  let attempt = 0, pending = null, closed = false;
  const LEASE_EXPIRED_COPY = "Saving is paused: this phone's local era has lapsed. Your saved entries are intact.";
  // lease.cjs returns these exact reasons; the real client passes them through as
  // `reason` on its state-20 refusal, with no code. Naming them is what lets a host
  // tell an expired local era from any other state 20.
  const LEASE_CODES = { "lease expired": "LOCAL_LEASE_EXPIRED", "lease not yet valid": "LOCAL_LEASE_NOT_YET_VALID",
    "device_seq outside the authorized range": "LOCAL_LEASE_RANGE_EXHAUSTED", "no lease": "LOCAL_LEASE_MISSING",
    "lease signature does not verify": "LOCAL_LEASE_UNPROVEN", "lease issued to another device": "LOCAL_LEASE_SCOPE",
    "lease issued for another athlete": "LOCAL_LEASE_SCOPE", "permission time unavailable": "LOCAL_CLOCK_UNUSABLE" };
  const refusal = (state, code) => ({ acknowledged: false, state, code,
    copy: code === "LOCAL_LEASE_EXPIRED" ? LEASE_EXPIRED_COPY
      : state === 18 ? Client.copy.RESTORE_REQUIRED : Client.copy.SAVE_FAILED });

  const t2 = Stage.createT2Stage(metadata => localEraConfig(metadata, { athleteId, deviceId, clock }), { workoutCommands });

  // The stage the bridge sees: the real T2 stage, plus the context the bridge
  // hands the validator, plus the derived sidecar written into the candidate
  // BEFORE the seal so it rides in the same repository.commit as the operation.
  function stage(generation, command, args) {
    const id = ++attempt;
    pending = null;
    const candidate = t2(generation, command, args);
    const context = { namespace, sessionEpoch, observationEpoch: sessionEpoch };
    if (command === null || !candidate?.generation || candidate.result?.acknowledged !== true) return { ...candidate, context };
    const basis = opsBasis(candidate.generation);
    // `authored` = did THIS commit write the sidecar (projector output, or a fresh
    // empty cache where none existed)? Only an authored sidecar is something this
    // commit is claiming; a carried one is the host's and is never judged here.
    let sidecar, authored = true;
    if (projector) {
      let value;
      try { value = projector(clone(candidate.generation), { command, args: clone(args), ops: clone(candidate.generation.collections.ops || {}) }); }
      catch { throw new StorageFailure("LOCAL_PROJECTOR_FAILED", 3); }
      if (value && typeof value.then === "function") throw new StorageFailure("LOCAL_PROJECTOR_ASYNC", 3);
      sidecar = { basis: { opCount: basis.opCount, lastOpId: basis.lastOpId }, value: value === undefined ? null : clone(value) };
    } else {
      // No projector: carry whatever is there UNCHANGED — including a cache that is
      // stale or malformed. C1 owns the basis it writes, never the host's value, so
      // it neither rewrites nor discards a record it did not produce. The commit is
      // not claiming the cache is good; boot() says whether it is.
      const carried = candidate.generation.collections[DERIVED];
      if (carried === undefined) sidecar = { basis: { opCount: basis.opCount, lastOpId: basis.lastOpId }, value: null };
      else { sidecar = clone(carried); authored = false; }
    }
    candidate.generation.collections[DERIVED] = sidecar;
    pending = { id, sidecar: clone(sidecar), basis, authored };
    return { ...candidate, context };
  }

  // Synchronous, reject-only, inside the durable transaction. It can refuse; it
  // can never write, and it never returns a promise (repository refuses one).
  const validateCommit = context => commitFailure({ staged: pending, attempt, batch: context.batch });

  const bridge = createBridge({ repository, stage, validateCommit });

  // The null-lane clean init on the T2 side: every collection present and EMPTY,
  // an intact checkpoint, this device's record, and the era sealed in metadata.
  function seedGeneration(era, enrolledAt, cleanInit) {
    const collections = {};
    for (const name of COLLECTIONS) collections[name] = {};
    collections.meta = { checkpoint: { counts: { ops: 0, outbox: 0 } },
      device: { device_id: deviceId, athlete_id: athleteId, seq: 0 } };
    collections[DERIVED] = { basis: { opCount: 0, lastOpId: null }, value: cleanInit === undefined ? null : clone(cleanInit) };
    return { collections, metadata: { profile: LOCAL_GENERATION_PROFILE, namespace, enrolledAt, localEra: era } };
  }

  async function enroll(cleanInit) {
    if (closed) return { enrolled: false, ...refusal(3, "LOCAL_CLIENT_CLOSED") };
    if (status.state !== "first-run") return { enrolled: false, ...refusal(18, status.code) };
    const enrolledAt = clock.now();
    if (typeof enrolledAt !== "string" || !Number.isFinite(Date.parse(enrolledAt)))
      return { enrolled: false, ...refusal(3, "LOCAL_CLOCK_UNUSABLE") };
    try {
      const era = createLocalEra({ crypto, athleteId, deviceId, enrolledAt });
      // Key generated in memory and persisted only AFTER revision 1 is sealed:
      // a failed initialize leaves no key beside no generation (still first run),
      // and a failed persist leaves a generation with no key (state 18), never a
      // second key and never a reseed.
      const key = await keys.generate();
      await repository.initialize(seedGeneration(era, enrolledAt, cleanInit), firstRunEvidence);
      await keys.persist(key);
      await writeMarker({ indexedDB, databaseName, at: enrolledAt });
      status = { state: "ready", code: "LOCAL_ENROLLED" };
      return { enrolled: true, revision: 1, ...publicEra(era) };
    } catch (error) {
      if (error instanceof StorageFailure && error.code === "ALREADY_INITIALIZED") status = { state: "restore-required", code: error.code };
      return { enrolled: false, ...refusal(error?.state ?? 3, error?.code || "LOCAL_ENROLLMENT_FAILED") };
    }
  }

  async function boot() {
    if (closed) return { ready: false, ...refusal(3, "LOCAL_CLIENT_CLOSED") };
    if (status.state === "first-run") return { ready: false, firstRun: true, ...refusal(18, "LOCAL_FIRST_RUN") };
    // A restore-required verdict is NOT re-derived from whether the bytes decrypt.
    // Partial local erasure (a missing key database or enrollment marker beside a
    // perfectly readable generation) must stay restore-required: the installation
    // is no longer whole, and C1 has no restore path — that is C2's port. An expired
    // era is the exception: the data is readable, so boot still reports it.
    if (status.state === "restore-required" && status.code !== "LOCAL_LEASE_EXPIRED")
      return { ready: false, ...refusal(18, status.code) };

    let snapshot, era;
    try { snapshot = await repository.load(); era = readLocalEra(snapshot.generation.metadata); }
    catch (error) {
      status = { state: "restore-required", code: error?.code || "STORED_INTEGRITY_UNPROVEN" };
      return { ready: false, ...refusal(error?.state ?? 18, status.code) };
    }
    // SELF-RENEWAL. Opening the app is what keeps writing alive: inside the last
    // 200 days the still-valid lease is re-signed for another 400 and committed
    // durably, so the next stage reads it straight off disk. A renewal that fails
    // is NOT fatal — the surviving lease has 200 days left — but it is reported.
    const nowIso = clock.now();
    let renewedUntil = null, renewalCode = null;
    if (!leaseExpired(era.lease, nowIso) && leaseRenewalDue(era.lease, nowIso)) {
      try {
        const next = clone(snapshot.generation);
        next.metadata.localEra = renewLocalEraLease(era, nowIso);
        await repository.commit(snapshot, next, () => (closed ? { state: 3, code: "LOCAL_CLIENT_CLOSED" } : null));
        snapshot = await repository.load();
        era = readLocalEra(snapshot.generation.metadata);
        renewedUntil = era.lease.not_after;
      } catch (error) { renewalCode = error?.code || "LOCAL_LEASE_RENEWAL_FAILED"; }
    }
    const reopened = await bridge.reopen();
    if (!reopened.view) {
      status = { state: "restore-required", code: reopened.refusal?.code || "RESTORE_UNPROVEN" };
      return { ready: false, ...refusal(reopened.refusal?.state ?? 18, status.code) };
    }
    const basis = opsBasis(snapshot.generation), sidecar = snapshot.generation.collections[DERIVED];
    const unusable = sidecarFailure(sidecar, basis);
    const payload = { view: reopened.view, revision: snapshot.revision, ops: basis.opCount,
      derived: unusable || sidecar?.value === undefined ? null : clone(sidecar.value),
      derivedStale: sidecarStale(sidecar, basis), derivedCode: unusable ? unusable.code : null,
      leaseRenewedUntil: renewedUntil, leaseRenewalCode: renewalCode, ...publicEra(era) };
    // Readable but not writable: the era lapsed, which takes 400 days of not
    // opening the app. Named, never a bare state 20 with status() saying "ready".
    if (leaseExpired(era.lease, nowIso)) {
      status = { state: "restore-required", code: "LOCAL_LEASE_EXPIRED" };
      return { ready: false, readable: true, leaseExpired: true, ...refusal(20, "LOCAL_LEASE_EXPIRED"), ...payload };
    }
    status = { state: "ready", code: "LOCAL_READY" };
    return { ready: true, leaseExpired: false, ...payload };
  }

  return Object.freeze({
    status: () => ({ ...status }),
    enroll,
    boot,
    // The bridge's own result, unwrapped: acknowledged only after the IDB
    // transaction completed, with durableRevision and the reported durability.
    execute(command, args) {
      if (closed) return Promise.resolve(refusal(3, "LOCAL_CLIENT_CLOSED"));
      if (!COMMANDS.has(command)) return Promise.resolve(refusal(3, "LOCAL_COMMAND_UNSUPPORTED"));
      if (status.state !== "ready")
        return Promise.resolve(refusal(status.code === "LOCAL_LEASE_EXPIRED" ? 20 : 18, status.code));
      return bridge.execute(command, args).then(async result => {
        if (result?.state === 18) status = { state: "restore-required", code: result.code || "RESTORE_UNPROVEN" };
        // The real client refuses a lapsed lease with state 20 and NO code — and
        // often no `reason` either, because the face's write-state precedence
        // answers before lease.cjs is asked. So the sealed lease itself is read and
        // the condition named, which is what lets a host tell an expired local era
        // from any other state 20 and write honest copy for it.
        if (result?.acknowledged !== true && result?.state === 20 && !result.code) {
          let code = LEASE_CODES[result.reason] || "LOCAL_LEASE_REFUSED";
          try {
            const era = readLocalEra((await repository.load()).generation.metadata);
            if (leaseExpired(era.lease, clock.now())) code = "LOCAL_LEASE_EXPIRED";
          } catch { /* an unreadable generation is a state-18 problem, not this one */ }
          if (code === "LOCAL_LEASE_EXPIRED") status = { state: "restore-required", code };
          return { ...result, code, ...(code === "LOCAL_LEASE_EXPIRED" ? { copy: LEASE_EXPIRED_COPY } : {}) };
        }
        return result;
      });
    },
    current: () => bridge.current(),
    // The client's own resume face, read from the freshly loaded generation. A
    // read: it builds the unchanged client over the loaded collections and never
    // commits, so no repository write and no sequence is consumed.
    async resumeAfterKill() {
      if (closed) return { ...refusal(3, "LOCAL_CLIENT_CLOSED"), line: Client.copy.RESTORE_REQUIRED, draftLine: null, ghost: false };
      try {
        const snapshot = await repository.load();
        const client = Client.createClient({ ...localEraConfig(snapshot.generation.metadata, { athleteId, deviceId, clock }),
          backend: Client.memoryBackend(snapshot.generation.collections) });
        client.boot();
        const resumed = client.resumeAfterKill();
        if (resumed.state === 18) status = { state: "restore-required", code: "T2_INTEGRITY_UNPROVEN" };
        return { ...resumed, revision: snapshot.revision };
      } catch (error) {
        status = { state: "restore-required", code: error?.code || "RESTORE_UNPROVEN" };
        return { ...refusal(error?.state ?? 18, status.code), line: Client.copy.RESTORE_REQUIRED, draftLine: null, ghost: false };
      }
    },
    close() {
      if (closed) return;
      closed = true; pending = null;
      try { repository.close(); } catch {}
      keys.close();
      status = { state: "closed", code: "LOCAL_CLIENT_CLOSED" };
    },
  });
}
