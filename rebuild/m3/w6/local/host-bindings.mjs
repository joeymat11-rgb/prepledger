// host-bindings.mjs — THE LOCAL ERA, SPOKEN AS A DURABLE-CLIENT SCOPE.
//
// C1 built one factory a host can open for durable local save. A0 built the
// real host composition (rebuild/m3/w6/host/workout-host.mjs), which is BINDING
// ONLY: every collaborator is injected, and its own test injects SYNTHETIC ones
// (a synthetic identity, signing key and lease, a pass-through observation
// guard, validateCommit () => null). The host page says "the page's own
// bootstrap supplies the repository, keys, clock, engine and athlete setup" and
// nothing real supplied them. This module is that bootstrap's local half: it
// returns EXACTLY the twelve-member durable-client scope
// createDurablePublicClient / composeWorkoutHost need, every member of it an
// honest local-era value rather than a test stand-in.
//
// THE ONE THING THIS MODULE HAD TO DECIDE, stated up front. The durable public
// client verifies `generation.metadata.authorityLease` with a W5 P-256 verifier
// on EVERY staged command (public-client.mjs stageVerified: LEASE_PROOF_UNPROVEN
// / 18), and composeWorkoutHost refuses an empty `keys` array by name. So a
// local era that wants the public client cannot hand it "no keys": it has to
// hold a P-256 lease. It issues one TO ITSELF, exactly as local-era.mjs already
// issues its HMAC lease to itself, with the SAME lease_id "local-era:<eraId>",
// the same range and the same window. The pinned key is therefore this device's
// own verification key — the integrity pin for a record it signed — and NEVER a
// stand-in for a hosted authority's decision. Two things keep that honest:
//   * the observation guard runs only the three purely-local kinds and refuses
//     EVERYTHING ELSE BY DEFAULT, before any verification (LOCAL_ERA_NO_INBOUND,
//     state 12), so this key can never be the thing that admits a disposition,
//     pull, snapshot, lease, time or anything added later; and
//   * the lease mirrors the era lease field for field, so "Saved" still means
//     DURABLY-COMMITTED-ON-THIS-PHONE and nothing more.
// The private half lives in generation.metadata.localHostAuthority, i.e. inside
// the same sealed generation it authorizes — encrypted at rest under the device
// key by repository.mjs, never in plaintext storage and never logged.
//
// This module imports local-client.mjs and local-client.mjs imports this one.
// The cycle is safe and deliberate: neither side touches the other's bindings at
// module-evaluation time, only inside functions called later.
import Stage from "../t2-stage.cjs";
import Canonical from "../../../authority/canonical.cjs";
import { StorageFailure } from "../repository.mjs";
import { localEraConfig, readLocalEra, leaseExpired, leaseRenewalDue, renewLocalEraLease } from "./local-era.mjs";
import { openLocalDurableClient, LOCAL_SCOPE, opsBasis, commitFailure, DERIVED } from "./local-client.mjs";

export const LOCAL_HOST_AUTHORITY_PROFILE = "earned/local-host-authority/v1";
export const LOCAL_HOST_CLIENT = Symbol("local-host-client");
export const LOCAL_HOST_INSTALL = Symbol("local-host-install");
export const localHostAuthorityKid = eraId => `local-era-${eraId}`;

const LEASE_DOMAIN = "earned/lease/v1";
const ORDER = BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551");
const HALF = ORDER / 2n;
const LEASE_FIELDS = ["lease_id", "athlete_id", "device_id", "range", "not_before", "not_after", "schema_version"];
// C1b review F1. THIS IS AN ALLOWLIST, AND IT HAS TO BE.
//
// It was a denylist of the seven inbound kinds, which was correct on the day it
// was written and unsafe as a shape: any kind not on the list PASSED. The list
// lived here while the kinds live in public-client.mjs, so a kind added there
// later would have run — reaching verification against this device's own pinned
// key — with every test in this branch still green. A security-relevant guard
// must not depend on two files staying in step.
//
// So: these three are the kinds that ask a purely LOCAL question of a purely
// local generation — build a recovery basis from what is on this disk, read this
// device's workout history, read it again to address a correction. They are the
// only ones allowed to run. Everything else, known inbound kind or a kind that
// does not exist yet, refuses by default.
export const LOCAL_OBSERVATION_KINDS = Object.freeze(["local-recovery-basis", "workout-history", "workout-edit-history"]);
// The seven inbound kinds as public-client.mjs passes them TODAY. This is not
// what the guard decides on — the allowlist above is — it is the other half of
// the pin: test/local-host-journey.test.mjs reads public-client.mjs and fails if
// the kinds it can pass are not exactly these two lists together.
export const INBOUND_OBSERVATION_KINDS = Object.freeze(["disposition", "pull", "snapshot", "lease", "time",
  "current-head-exchange", "time-exchange"]);
const ALLOWED_KINDS = new Set(LOCAL_OBSERVATION_KINDS);
const clone = value => structuredClone(value);
const encode = value => Canonical.canonicalEncode(value);

// --- W5 ES256 signature production, to the phone verifier's exact grammar ---
// public-client.cjs decodeSignature accepts ES256.<kid>.<86 base64url chars>
// only, with 0 < r < n and 0 < s <= n/2. WebCrypto returns raw r||s with no
// low-S normalisation, so about half of all signatures would be rejected by the
// very verifier they are meant for. Normalising here is what makes the record
// verifiable by the UNCHANGED rebuild/m3/w5/public-client.cjs.
const toBigInt = bytes => bytes.reduce((n, b) => (n << 8n) | BigInt(b), 0n);
function base64url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function canonicalSignature(raw) {
  if (raw.length !== 64) return null;
  const r = toBigInt(raw.subarray(0, 32));
  let s = toBigInt(raw.subarray(32));
  if (r <= 0n || r >= ORDER || s <= 0n || s >= ORDER) return null;
  if (s <= HALF) return raw;
  s = ORDER - s;
  const out = Uint8Array.from(raw);
  for (let index = 63; index >= 32; index--) { out[index] = Number(s & 0xffn); s >>= 8n; }
  return out;
}
async function signHostLease({ crypto, kid, privateJwk, lease }) {
  const key = await crypto.subtle.importKey("jwk", clone(privateJwk), { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const bytes = new TextEncoder().encode(LEASE_DOMAIN + encode(lease));
  // A rejected (high-S is normalised; zero r/s is not) signature is re-drawn
  // rather than shipped: an unverifiable lease would be state 18 on every save.
  for (let attempt = 0; attempt < 8; attempt++) {
    const normalized = canonicalSignature(new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, bytes)));
    if (normalized) return { ...clone(lease), signature: `ES256.${kid}.${base64url(normalized)}` };
  }
  throw new StorageFailure("LOCAL_HOST_LEASE_SIGNATURE_FAILED", 18);
}

// --- the era's own P-256 half ---
// Minted once per era and then left alone. Re-minting loses nothing and is
// therefore the safe answer to a missing or malformed record: no operation is
// bound to the kid. Operations carry lease_id ("local-era:<eraId>"), which is
// the ERA's identity and is unchanged by a re-mint, so a re-mint can never
// orphan a stored operation or make one look like it came from elsewhere.
export async function createLocalHostAuthority({ crypto, eraId } = {}) {
  if (!crypto?.subtle || typeof eraId !== "string" || !/^[0-9a-f]{32}$/.test(eraId))
    throw new StorageFailure("LOCAL_HOST_AUTHORITY_CONFIGURATION_REQUIRED", 18);
  const pair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const [priv, pub] = await Promise.all([crypto.subtle.exportKey("jwk", pair.privateKey),
    crypto.subtle.exportKey("jwk", pair.publicKey)]);
  if (typeof priv?.d !== "string" || typeof pub?.x !== "string" || typeof pub?.y !== "string")
    throw new StorageFailure("LOCAL_HOST_AUTHORITY_UNUSABLE", 18);
  return { profile: LOCAL_HOST_AUTHORITY_PROFILE, eraId, kid: localHostAuthorityKid(eraId),
    privateJwk: { kty: "EC", crv: "P-256", d: priv.d, x: priv.x, y: priv.y },
    publicJwk: { kty: "EC", crv: "P-256", x: pub.x, y: pub.y, key_ops: ["verify"], ext: true } };
}

const jwkShape = (value, wantPrivate) => !!value && typeof value === "object" && !Array.isArray(value) &&
  value.kty === "EC" && value.crv === "P-256" && typeof value.x === "string" && typeof value.y === "string" &&
  (wantPrivate ? typeof value.d === "string" : value.d === undefined);

// null, never a throw: absent/malformed is a thing this module repairs in the
// same durable commit that refreshes the lease, not an installation fault.
export function readLocalHostAuthority(metadata, eraId) {
  const authority = metadata?.localHostAuthority;
  if (!authority || typeof authority !== "object" || Array.isArray(authority) ||
      authority.profile !== LOCAL_HOST_AUTHORITY_PROFILE || authority.eraId !== eraId ||
      authority.kid !== localHostAuthorityKid(eraId) ||
      !jwkShape(authority.privateJwk, true) || !jwkShape(authority.publicJwk, false)) return null;
  return authority;
}

// The W5 lease is the era lease, field for field. One window, one range, one
// lease_id — so a weighIn written through C1's own bridge and a workout set
// written through the public client carry the SAME lease_id, and the era's
// self-renewal is the only thing that ever moves either window.
const hostLeaseFields = era => ({ lease_id: era.lease.lease_id, athlete_id: era.lease.athlete_id,
  device_id: era.lease.device_id, range: era.lease.range.slice(), not_before: era.lease.not_before,
  not_after: era.lease.not_after, schema_version: era.lease.schema_version });
const mirrorsEra = (lease, wanted, kid) => !!lease && typeof lease === "object" && !Array.isArray(lease) &&
  typeof lease.signature === "string" && lease.signature.startsWith(`ES256.${kid}.`) &&
  LEASE_FIELDS.every(field => encode(lease[field]) === encode(wanted[field]));

// WHERE RENEWAL RUNS, AND WHO COMMITS.
// C1's boot() is what keeps writing alive: inside the last 200 days it re-signs
// the still-valid era lease for another 400 and commits it. When the HOST does
// the writing, the writer is the public client's own bridge, which never calls
// boot(). So the rule is made explicit here rather than assumed: hostBindings()
// refuses outright unless boot() has already reported ready (the C1 semantics
// hold), and then runs the SAME renewal check itself inside the one durable
// commit that installs or refreshes the host lease. If boot's own renewal
// attempt failed — C1 treats that as non-fatal and reports leaseRenewalCode —
// this is the second chance, and it happens BEFORE the scope exists, therefore
// before the public client's first write. An expired era is refused here, not
// discovered on the first save.
async function installHostAuthority({ repository, crypto, clock, athleteId, deviceId, alive }) {
  const nowIso = clock.now();
  if (typeof nowIso !== "string" || !Number.isFinite(Date.parse(nowIso))) throw new StorageFailure("LOCAL_CLOCK_UNUSABLE", 3);
  const snapshot = await repository.load();
  let era = readLocalEra(snapshot.generation.metadata);
  if (era.lease.athlete_id !== athleteId || era.lease.device_id !== deviceId) throw new StorageFailure("LOCAL_ERA_SCOPE_MISMATCH", 18);
  if (leaseExpired(era.lease, nowIso)) throw new StorageFailure("LOCAL_LEASE_EXPIRED", 20);
  const next = clone(snapshot.generation);
  let renewedUntil = null, changed = false;
  // THE ZERO FRONTIER, stated rather than left absent. C1 seals `sync` empty,
  // which is right for its own path (rebuild/client boots an absent frontier as
  // {W:0, authorityW:0}) but leaves the host's correction path unreachable:
  // public-client.mjs prepareWorkoutEdit compares
  // collections.sync.frontier.authorityW against the history's own W, and
  // `undefined !== 0` refuses WORKOUT_EDIT_PREFIX_INCOMPLETE/18. Writing the
  // zero frontier is not an invention — it is the one frontier a local era can
  // have, it is exactly what T2 already defaults to, and it says the true thing:
  // no authority has accepted anything here, because there is no authority.
  if (!next.collections.sync || typeof next.collections.sync !== "object" || Array.isArray(next.collections.sync))
    { next.collections.sync = {}; changed = true; }
  if (next.collections.sync.frontier === undefined) { next.collections.sync.frontier = { W: 0, authorityW: 0 }; changed = true; }
  if (leaseRenewalDue(era.lease, nowIso)) {
    era = renewLocalEraLease(era, nowIso);
    next.metadata.localEra = era; renewedUntil = era.lease.not_after; changed = true;
  }
  let authority = readLocalHostAuthority(next.metadata, era.eraId);
  if (!authority) { authority = await createLocalHostAuthority({ crypto, eraId: era.eraId }); next.metadata.localHostAuthority = authority; changed = true; }
  const wanted = hostLeaseFields(era);
  const minted = !mirrorsEra(next.metadata.authorityLease, wanted, authority.kid);
  if (minted) next.metadata.authorityLease = await signHostLease({ crypto, kid: authority.kid, privateJwk: authority.privateJwk, lease: wanted });
  // Nothing to say, nothing written: a second hostBindings() over an installed
  // era must not move the revision.
  if (!changed && !minted) return { authority, era, renewedUntil, revision: snapshot.revision, installed: false };
  const commit = await repository.commit(snapshot, next, () => (alive() ? null : { state: 3, code: "LOCAL_CLIENT_CLOSED" }));
  return { authority, era, renewedUntil, revision: commit.revision, installed: true };
}

// C1b review F3. A LAPSED ERA IS A DIFFERENT ANSWER FROM "YOU HAVE NOT BOOTED".
//
// The module header promises "an expired era is refused here, not discovered on
// the first save", and installHostAuthority does throw LOCAL_LEASE_EXPIRED / 20.
// But on a FRESH OPEN of a lapsed installation boot() fails first, so the boot
// fence used to answer with the generic LOCAL_HOST_BINDINGS_BOOT_REQUIRED / 18 —
// the common path produced a less specific code than the header promised, and 18
// says "stored truth needs recovery" about data that is perfectly readable. The
// truth is state 20: the data is fine, the write allowance ran out.
//
// So the era is read from disk BEFORE the boot fence, and only when it is
// genuinely readable. An unreadable or absent generation (first run, an erased
// device key) throws here and is swallowed, so those keep the boot fence's 18.
async function refuseLapsedEra({ repository, clock }) {
  let era;
  try { era = readLocalEra((await repository.load()).generation.metadata); }
  catch { return; } // Not readable: this is not the lapsed case. The boot fence answers.
  if (leaseExpired(era.lease, clock.now())) throw new StorageFailure("LOCAL_LEASE_EXPIRED", 20);
}

// The scope itself. Twelve members, no thirteenth: composeWorkoutHost names
// every one of these and refuses a missing one by name, so anything extra here
// would be a member nobody asked for.
export async function buildLocalHostBindings(scope, { workoutCommands } = {}) {
  const { repository, crypto, clock, namespace, athleteId, deviceId, sessionEpoch, alive, booted, client } = scope;
  if (typeof booted !== "function" || booted() !== true) {
    await refuseLapsedEra(scope);
    throw new StorageFailure("LOCAL_HOST_BINDINGS_BOOT_REQUIRED", 18);
  }
  const install = await installHostAuthority(scope);
  const commands = workoutCommands === undefined ? scope.workoutCommands : workoutCommands;

  // The real T2 stage over the local era's own configuration — the same
  // configProvider C1's bridge uses, so both write paths read one era from one
  // place. allowInbound is true because the public client hands the stage a
  // `historyAuthentication` set on every workout read; with it false, t2-stage
  // refuses that read LOCAL_HISTORY_IDENTITY_UNPROVEN/18 before the host sees
  // it. It does NOT open an inbound door: an inbound command still needs a
  // verified record+proof, and observationGuard refuses every inbound kind
  // before one can exist.
  const t2 = Stage.createT2Stage(metadata => localEraConfig(metadata, { athleteId, deviceId, clock }),
    { allowInbound: true, ...(commands === undefined ? {} : { workoutCommands: commands }) });
  let attempt = 0, pending = null;
  // The derived sidecar is CARRIED, never authored, on this path: the host's own
  // derived state is the engine history projector's, computed from ops, and a
  // projector configured for C1's commands knows nothing about a workout batch.
  // So a host write leaves C1's cache exactly as it found it and merely older
  // than the ops — which boot() already reports as derivedStale rather than
  // treating as damage. Ops are truth; the cache is the host's.
  function stage(generation, command, args, integration) {
    const id = ++attempt;
    pending = null;
    const candidate = t2(generation, command, args, integration);
    const context = { namespace, sessionEpoch, observationEpoch: sessionEpoch };
    if (command === null || !candidate?.generation || candidate.result?.acknowledged !== true) return { ...candidate, context };
    const basis = opsBasis(candidate.generation);
    const carried = candidate.generation.collections[DERIVED];
    const sidecar = carried === undefined ? { basis: { opCount: basis.opCount, lastOpId: basis.lastOpId }, value: null } : clone(carried);
    candidate.generation.collections[DERIVED] = sidecar;
    pending = { id, sidecar: clone(sidecar), basis, authored: carried === undefined };
    return { ...candidate, context };
  }
  const validateCommit = context => commitFailure({ staged: pending, attempt, batch: context.batch });

  // K1 IS NOT APPLICABLE HERE, and that is why this records nothing. The fence
  // exists to stop a client acting on knowledge it got from a hosted authority
  // between verification and durable outcome. No hosted knowledge exists on this
  // phone: there is nothing to have learned and nothing to fence. So the guard
  // passes local work straight through and keeps no state — a recorder that only
  // ever had one observer to record would be theatre.
  //
  // What it DOES do is refuse everything that is not one of the three local
  // kinds, before the pinned key is ever consulted — see LOCAL_OBSERVATION_KINDS
  // above for why that is an allowlist and not a denylist. That is the honest
  // local-era answer to "what verifies a W5 response here": nothing does,
  // because none is admitted. State 12 is the client's own "this protocol is not
  // installed", not a storage fault.
  const observationGuard = Object.freeze({
    run(kind, run) {
      if (ALLOWED_KINDS.has(kind)) return run();
      return Promise.resolve({ accepted: false, stored: false, durable: false, confirmed: false,
        state: 12, code: "LOCAL_ERA_NO_INBOUND",
        reason: "This installation is a local era: there is no authority to accept, reject or reconcile, so no inbound record is admitted." });
    },
  });

  // This device's own verification key, pinned so the UNCHANGED W5 verifier can
  // check the lease this device signed. Not an authority pin: see the header.
  const keys = Object.freeze([Object.freeze({ kid: install.authority.kid, publicKey: Object.freeze({ ...install.authority.publicJwk }) })]);
  // A closed client is not the current session. A late write therefore refuses
  // SESSION_CHANGED/17 instead of reaching a closed repository handle.
  const isCurrentSession = epoch => alive() === true && epoch === sessionEpoch;
  const observationEpoch = () => sessionEpoch;

  const bindings = { repository, stage, namespace, athleteId, deviceId, sessionEpoch,
    isCurrentSession, observationEpoch, observationGuard, validateCommit, keys, crypto };
  // Symbol-keyed, so Object.keys(bindings) is exactly the twelve the client and
  // the host name. These are for the caller that opened it, not for the client.
  Object.defineProperty(bindings, LOCAL_HOST_CLIENT, { value: client, enumerable: false });
  Object.defineProperty(bindings, LOCAL_HOST_INSTALL, { enumerable: false, value: Object.freeze({
    kid: install.authority.kid, eraId: install.era.eraId, leaseId: install.era.lease.lease_id,
    notBefore: install.era.lease.not_before, notAfter: install.era.lease.not_after,
    revision: install.revision, installed: install.installed, leaseRenewedUntil: install.renewedUntil }) });
  return Object.freeze(bindings);
}

// The one entry point a host page calls. It takes either an already-open C1
// client (the usual case: the page enrolls and boots, then asks for bindings) or
// the same options openLocalDurableClient takes, for a page that only wants the
// host half. The options form still goes through enroll/boot semantics — it
// boots, and refuses exactly as hostBindings() would if this installation is
// first-run or needs restore. The client it opened is reachable at
// bindings[LOCAL_HOST_CLIENT] so the caller can close it.
export async function localHostBindings(input, options = {}) {
  if (input && typeof input === "object" && input[LOCAL_SCOPE] === true) return buildLocalHostBindings(input, options);
  if (input && typeof input.hostBindings === "function") return input.hostBindings(options);
  const client = await openLocalDurableClient(input);
  try {
    const ready = await client.boot();
    if (ready.ready !== true) throw new StorageFailure(ready.code || "LOCAL_HOST_BINDINGS_BOOT_REQUIRED", ready.state ?? 18);
    return await client.hostBindings(options);
  } catch (error) { client.close(); throw error; }
}
