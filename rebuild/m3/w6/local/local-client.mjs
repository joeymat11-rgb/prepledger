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
// OPS ARE TRUTH, derived is a cache. collections.derived is a host-owned
// sidecar riding in the same durable commit as the operation; C1 computes its
// basis and never interprets its value. On boot a basis that disagrees with the
// actual ops is reported as derivedStale and the host must rebuild from ops.
import { openRepository, StorageFailure } from "../repository.mjs";
import { createBridge } from "../bridge.mjs";
import Stage from "../t2-stage.cjs";
import Client from "../../../client/index.cjs";
import { openLocalKeys, probeRecord, keysPresent } from "./local-keys.mjs";
import { createLocalEra, localEraConfig, readLocalEra, publicEra } from "./local-era.mjs";

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

// Reject-only. A basis BEHIND the ops is legal (a carried cache the host has not
// refreshed) and surfaces as derivedStale; a basis AHEAD of them is a cache
// claiming operations the candidate does not have, and never reaches disk.
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

export function sidecarStale(sidecar, basis) {
  if (!sidecar || typeof sidecar !== "object" || Array.isArray(sidecar)) return true;
  const claimed = sidecar.basis;
  if (!claimed || typeof claimed !== "object") return true;
  return claimed.opCount !== basis.opCount || claimed.lastOpId !== basis.lastOpId;
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
    try { await repository.load(); }
    catch (error) { status = { state: "restore-required", code: error?.code || "STORED_INTEGRITY_UNPROVEN" }; }
  }

  // No authority issues sessions in the local era, so the session epoch is
  // instance-scoped: it proves a commit belongs to THIS open client, nothing more.
  const sessionEpoch = hex(crypto, 8);
  let attempt = 0, pending = null, closed = false;
  const refusal = (state, code) => ({ acknowledged: false, state, code,
    copy: state === 18 ? Client.copy.RESTORE_REQUIRED : Client.copy.SAVE_FAILED });

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
    let sidecar;
    if (projector) {
      let value;
      try { value = projector(clone(candidate.generation), { command, args: clone(args), ops: clone(candidate.generation.collections.ops || {}) }); }
      catch { throw new StorageFailure("LOCAL_PROJECTOR_FAILED", 3); }
      if (value && typeof value.then === "function") throw new StorageFailure("LOCAL_PROJECTOR_ASYNC", 3);
      sidecar = { basis: { opCount: basis.opCount, lastOpId: basis.lastOpId }, value: value === undefined ? null : clone(value) };
    } else {
      // No projector: carry whatever is there unchanged. It then reads stale on
      // boot, which is the honest answer — nothing recomputed the cache.
      const carried = candidate.generation.collections[DERIVED];
      sidecar = carried === undefined ? { basis: { opCount: basis.opCount, lastOpId: basis.lastOpId }, value: null } : clone(carried);
    }
    candidate.generation.collections[DERIVED] = sidecar;
    pending = { id, sidecar: clone(sidecar), basis };
    return { ...candidate, context };
  }

  // Synchronous, reject-only, inside the durable transaction. It can refuse; it
  // can never write, and it never returns a promise (repository refuses one).
  function validateCommit(context) {
    if (context.namespace !== namespace) return { state: 18, code: "LOCAL_NAMESPACE_MISMATCH" };
    if (context.sessionEpoch !== sessionEpoch) return { state: 17, code: "LOCAL_SESSION_CHANGED" };
    const staged = pending;
    if (!staged || staged.id !== attempt) return { state: 3, code: "LOCAL_SIDECAR_UNPROVEN" };
    return sidecarFailure(staged.sidecar, staged.basis);
  }

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
    // is no longer whole, and C1 has no restore path — that is C2's port.
    if (status.state === "restore-required") return { ready: false, ...refusal(18, status.code) };
    const reopened = await bridge.reopen();
    if (!reopened.view) {
      status = { state: "restore-required", code: reopened.refusal?.code || "RESTORE_UNPROVEN" };
      return { ready: false, ...refusal(reopened.refusal?.state ?? 18, status.code) };
    }
    const snapshot = await repository.load();
    const basis = opsBasis(snapshot.generation), sidecar = snapshot.generation.collections[DERIVED];
    status = { state: "ready", code: "LOCAL_READY" };
    return { ready: true, view: reopened.view, revision: snapshot.revision, ops: basis.opCount,
      derived: sidecar === undefined || sidecar.value === undefined ? null : clone(sidecar.value),
      derivedStale: sidecarStale(sidecar, basis), ...publicEra(readLocalEra(snapshot.generation.metadata)) };
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
      if (status.state !== "ready") return Promise.resolve(refusal(18, status.code));
      return bridge.execute(command, args).then(result => {
        if (result?.state === 18) status = { state: "restore-required", code: result.code || "RESTORE_UNPROVEN" };
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
