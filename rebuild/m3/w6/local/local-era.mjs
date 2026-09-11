// local-era.mjs — THE LOCAL ERA: the era material one phone issues to itself.
//
// THE RULE THIS MODULE EXISTS UNDER, stated once here and again in C1-REPORT.md:
// in the local era NOTHING CAN REFUSE AN OPERATION. There is no authority to
// accept, reject or reconcile, so "Saved" means DURABLY-COMMITTED-ON-THIS-PHONE
// and nothing more — never authority-accepted. The lease below is SELF-ISSUED:
// it is signed with a locally generated authority key that lives inside the same
// sealed generation it authorizes, so it proves the integrity of that sealed
// record, NOT permission from anyone. Its whole job is to let the unchanged
// rebuild/client (lease.cjs check + ops.cjs signatureOver) run with no edit.
//
// Every operation therefore carries lease_id = "local-era:<eraId>", so a future
// hosted onboarding can IDENTIFY local-era operations and decide what to do with
// them. That adoption is deferred with hosted sync (DECISIONS:88) and is NOT
// designed here: this module issues an era, it does not migrate one.
//
// The era carries key material (identityKey, authorityKey). It is written ONLY
// into generation.metadata.localEra, i.e. encrypted at rest under the device key
// by repository.mjs. It is never placed in plaintext storage and never logged.
import Lease from "../../../client/lease.cjs";
import Ops from "../../../client/ops.cjs";
import { StorageFailure } from "../repository.mjs";

export const LOCAL_ERA_PROFILE = "earned/local-era/v1";
export const LOCAL_ERA_DAYS = 400;
export const LOCAL_ERA_SCHEMA_VERSION = 2;
const SEQ_CEILING = 2 ** 31 - 1;
const DAY_MS = 86_400_000;
export const localEraLeaseId = eraId => `local-era:${eraId}`;
const hex = (crypto, bytes) => Array.from(crypto.getRandomValues(new Uint8Array(bytes)), b => b.toString(16).padStart(2, "0")).join("");

export function createLocalEra({ crypto, athleteId, deviceId, enrolledAt }) {
  const at = Date.parse(enrolledAt);
  if (!crypto?.getRandomValues || !athleteId || !deviceId || !Number.isFinite(at))
    throw new StorageFailure("LOCAL_ERA_CONFIGURATION_REQUIRED", 18);
  const eraId = hex(crypto, 16);                       // 128-bit era identity
  const identityKey = hex(crypto, 32);                 // T2 K_identity (ops.cjs commitmentOf)
  const authorityKey = hex(crypto, 32);                // the local, self-held lease signer
  const lease = { lease_id: localEraLeaseId(eraId), athlete_id: athleteId, device_id: deviceId,
    range: [1, SEQ_CEILING], not_before: enrolledAt, not_after: new Date(at + LOCAL_ERA_DAYS * DAY_MS).toISOString(),
    schema_version: LOCAL_ERA_SCHEMA_VERSION };
  lease.signature = Ops.signatureOver(authorityKey, Lease.DOMAIN, lease, "signature");
  return { profile: LOCAL_ERA_PROFILE, eraId, identityKey, authorityKey, lease, enrolledAt };
}

// Read the era back out of an authenticated (already decrypted and validated)
// generation's metadata. Every refusal is state 18: an installation whose era is
// missing or malformed needs recovery, it must never be re-enrolled over.
export function readLocalEra(metadata) {
  const era = metadata?.localEra;
  if (!era || typeof era !== "object" || Array.isArray(era) || era.profile !== LOCAL_ERA_PROFILE)
    throw new StorageFailure("LOCAL_ERA_UNAVAILABLE", 18);
  const hexish = value => typeof value === "string" && /^[0-9a-f]+$/.test(value);
  if (!hexish(era.eraId) || era.eraId.length !== 32 || !hexish(era.identityKey) || !hexish(era.authorityKey))
    throw new StorageFailure("LOCAL_ERA_MALFORMED", 18);
  const lease = era.lease;
  if (!lease || typeof lease !== "object" || Array.isArray(lease) || lease.lease_id !== localEraLeaseId(era.eraId) ||
      lease.schema_version !== LOCAL_ERA_SCHEMA_VERSION || !Array.isArray(lease.range) || lease.range.length !== 2)
    throw new StorageFailure("LOCAL_ERA_MALFORMED", 18);
  // Integrity of the sealed record, not authority: the signer key sits beside it.
  if (!Lease.verifySignature(lease, era.authorityKey)) throw new StorageFailure("LOCAL_ERA_LEASE_UNPROVEN", 18);
  return era;
}

// THE LEASE IS SELF-RENEWING. A fixed 400-day window from enrollment is a cliff:
// the athlete opens the app on day 401 and every save is refused, with the data
// intact and nothing to reconnect to. So while the lease is still VALID and inside
// its last 200 days, boot() re-signs it: same lease_id, same range, not_before
// unchanged, not_after = now + 400 days. Opening the app is what keeps writing
// alive, and that is the honest local-era rule — there is no authority to ask.
//
// An EXPIRED lease is never renewed. Renewal extends a live authorization; it does
// not resurrect a dead one. So the cliff still exists and is reachable by exactly
// one route: not opening the app for 400 days. It is then named
// (LOCAL_LEASE_EXPIRED, state 20) rather than silent.
export const LOCAL_ERA_RENEW_WITHIN_DAYS = 200;

// Matches lease.cjs exactly: `now > not_after` is expired, so now === not_after is
// still valid. An unparseable window reads as expired, never as valid.
export function leaseExpired(lease, nowIso) {
  const at = Date.parse(nowIso), until = Date.parse(lease?.not_after);
  return !Number.isFinite(at) || !Number.isFinite(until) || at > until;
}
export function leaseRenewalDue(lease, nowIso) {
  const at = Date.parse(nowIso), until = Date.parse(lease?.not_after);
  if (!Number.isFinite(at) || !Number.isFinite(until)) return false;
  return until - at < LOCAL_ERA_RENEW_WITHIN_DAYS * DAY_MS;
}
export function renewLocalEraLease(era, nowIso) {
  const at = Date.parse(nowIso);
  if (!Number.isFinite(at)) throw new StorageFailure("LOCAL_CLOCK_UNUSABLE", 3);
  if (leaseExpired(era.lease, nowIso)) throw new StorageFailure("LOCAL_LEASE_EXPIRED", 20);
  const lease = { lease_id: era.lease.lease_id, athlete_id: era.lease.athlete_id, device_id: era.lease.device_id,
    range: era.lease.range.slice(), not_before: era.lease.not_before,
    not_after: new Date(at + LOCAL_ERA_DAYS * DAY_MS).toISOString(), schema_version: era.lease.schema_version };
  lease.signature = Ops.signatureOver(era.authorityKey, Lease.DOMAIN, lease, "signature");
  return { ...era, lease };
}

// The createClient/t2-stage configuration for this era. `transport` is never set
// (t2-stage forces it undefined anyway) and `online` is false: there is no
// authority to be online to, and the face must not claim a pending sync.
export function localEraConfig(metadata, { athleteId, deviceId, clock }) {
  const era = readLocalEra(metadata);
  if (era.lease.athlete_id !== athleteId || era.lease.device_id !== deviceId)
    throw new StorageFailure("LOCAL_ERA_SCOPE_MISMATCH", 18);
  return { deviceId, athleteId, identityKey: era.identityKey, authorityKey: era.authorityKey,
    clock, lease: era.lease, online: false, standing: "enrolled", signInRequired: false };
}

// What may be shown or logged about an era: an identifier and a window. Never
// identityKey, never authorityKey, never the signature.
export function publicEra(era) {
  return { eraId: era.eraId, leaseId: era.lease.lease_id, notBefore: era.lease.not_before, notAfter: era.lease.not_after };
}
