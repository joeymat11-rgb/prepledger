"use strict";
// The only platform-specific boundary. A Worker deployment may replace these
// primitives without changing the signed domains or the canonical byte profile.
const { createHmac, timingSafeEqual } = require("node:crypto");
const { canonicalEncode } = require("./canonical.cjs");

const AUTHORITY_METADATA = new Set([
  "canonical_content_commitment", "authority_signature", "athlete_log_seq",
  "accepted_at", "decided_at", "sealing_transitions", "sealed",
]);

function hmac(key, text) {
  if (key == null) throw new TypeError("signing key required");
  return createHmac("sha256", String(key)).update(text, "utf8").digest("hex");
}

function without(record, excluded) {
  const entries = Object.keys(record).filter(key => !excluded.has(key)).map(key => [key, record[key]]);
  return Object.fromEntries(entries);
}

function commitmentOf(operation, identityKey) {
  return hmac(identityKey, "earned/op/v1" + canonicalEncode(without(operation, AUTHORITY_METADATA)));
}

function signatureOver(record, key, domain, field) {
  return hmac(key, domain + canonicalEncode(without(record, new Set([field]))));
}

function verifyRecord(record, key, domain, field) {
  if (!record || typeof record !== "object" || typeof record[field] !== "string" || !/^[0-9a-f]{64}$/.test(record[field])) return false;
  try {
    return timingSafeEqual(Buffer.from(record[field], "hex"), Buffer.from(signatureOver(record, key, domain, field), "hex"));
  } catch (_) { return false; }
}

const signDisposition = (record, key) => ({ ...record, authority_signature: signatureOver(record, key, "earned/disposition/v1", "authority_signature") });
const verifyDisposition = (record, key) => verifyRecord(record, key, "earned/disposition/v1", "authority_signature");
const signLease = (record, key) => ({ ...record, signature: signatureOver(record, key, "earned/lease/v1", "signature") });
const verifyLease = (record, key) => verifyRecord(record, key, "earned/lease/v1", "signature");
const signServerTime = (record, key) => ({ ...record, authority_signature: signatureOver(record, key, "earned/server-time/v1", "authority_signature") });
const verifyServerTime = (record, key) => verifyRecord(record, key, "earned/server-time/v1", "authority_signature");

module.exports = { hmac, commitmentOf, signDisposition, verifyDisposition, signLease,
  verifyLease, leaseValid: verifyLease, signServerTime, verifyServerTime };
