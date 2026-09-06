"use strict";

// Browser-safe public verification boundary. This module imports no authority
// signer, private-key code or shared authority HMAC key. W6 supplies durable
// staged client callbacks; every envelope is copied and fully authenticated
// before the first callback capable of draining an outbox or moving a frontier.
const { canonicalEncode } = require("../../authority/canonical.cjs");
const WIRE_VERSION = "earned/w5-http/v1";
const TIME_PROFILE = "earned/challenge-time/v1";
const MAX_TIME_ROUND_TRIP_MS = 30000;
const ORDER = BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551");
const DOMAINS = Object.freeze({ disposition: "earned/disposition/v1", receipt: "earned/receipt/v1",
  pull: "earned/pull/v1", snapshot: "earned/snapshot/v1", lease: "earned/lease/v1", serverTime: "earned/server-time/v1" });
const STATUSES = new Set(["WAITING", "ACCEPTED", "REJECTED", "REJECTED_DEPENDENCY"]);
const copy = value => JSON.parse(JSON.stringify(value));
const unsigned = (record, field) => Object.fromEntries(Object.keys(record).filter(k => k !== field).map(k => [k, record[k]]));
const object = value => !!value && typeof value === "object" && !Array.isArray(value);
const integer = bytes => bytes.reduce((n, b) => (n << 8n) | BigInt(b), 0n);
const fail = reason => ({ accepted: false, stored: false, state: 12, reason });
const utcInstant = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) &&
  Number.isFinite(Date.parse(value)) && new Date(Date.parse(value)).toISOString() === (value.includes(".") ? value : value.replace("Z", ".000Z"));

function encode64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function decodeSignature(signature) {
  if (typeof signature !== "string") return null;
  const match = /^ES256\.([A-Za-z0-9_-]{1,64})\.([A-Za-z0-9_-]{86})$/.exec(signature);
  if (!match) return null;
  try {
    const raw = Uint8Array.from(atob(match[2].replace(/-/g, "+").replace(/_/g, "/") + "=="), c => c.charCodeAt(0));
    if (raw.length !== 64 || encode64(raw) !== match[2]) return null;
    const r = integer(raw.slice(0, 32)), s = integer(raw.slice(32));
    if (r <= 0n || r >= ORDER || s <= 0n || s > ORDER / 2n) return null;
    return { kid: match[1], raw };
  } catch (_) { return null; }
}
function canonicalBytes(record, domain, field = "authority_signature") {
  return new TextEncoder().encode(domain + canonicalEncode(unsigned(record, field)));
}
function createPublicVerifier({ keys, subtle = globalThis.crypto && globalThis.crypto.subtle } = {}) {
  if (!subtle || !Array.isArray(keys) || !keys.length) throw new TypeError("WebCrypto and pinned public verification keys required");
  const pinned = new Map();
  for (const key of keys) {
    if (!object(key) || key.privateKey || !/^[A-Za-z0-9_-]{1,64}$/.test(key.kid || "") || pinned.has(key.kid))
      throw new TypeError("unique pinned public keys only");
    const jwk = key.publicKey;
    if (!object(jwk) || jwk.d !== undefined || jwk.kty !== "EC" || jwk.crv !== "P-256" ||
        typeof jwk.x !== "string" || typeof jwk.y !== "string" ||
        (jwk.key_ops && (jwk.key_ops.length !== 1 || jwk.key_ops[0] !== "verify")))
      throw new TypeError("phone accepts P-256 verification JWKs only");
    pinned.set(key.kid, { jwk: { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y, key_ops: ["verify"], ext: true }, imported: null });
  }
  async function verifyRecord(record, domain, field = "authority_signature") {
    if (!object(record)) return false;
    try {
      const signature = decodeSignature(record[field]);
      const pin = signature && pinned.get(signature.kid);
      if (!pin) return false;
      // Lazy import keeps malformed configured keys fail-closed without an
      // unhandled rejected promise, including in Workers and browser harnesses.
      if (!pin.imported) pin.imported = await subtle.importKey("jwk", pin.jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
      return await subtle.verify({ name: "ECDSA", hash: "SHA-256" }, pin.imported, signature.raw, canonicalBytes(record, domain, field));
    } catch (_) { return false; }
  }
  const api = { verifyRecord };
  for (const [kind, domain] of Object.entries(DOMAINS)) {
    const suffix = kind[0].toUpperCase() + kind.slice(1);
    api["verify" + suffix] = record => verifyRecord(record, domain, kind === "lease" ? "signature" : "authority_signature");
  }
  return Object.freeze(api);
}

function createPublicBoundary({ keys, athleteId, deviceId, client = {}, subtle, crypto = globalThis.crypto,
  monotonicMs = () => globalThis.performance.now(), maxTimeRoundTripMs = MAX_TIME_ROUND_TRIP_MS,
  schemaVersion = 1 } = {}) {
  if (typeof athleteId !== "string" || !athleteId || typeof deviceId !== "string" || !deviceId)
    throw new TypeError("authenticated athlete/device binding required");
  if (!Number.isFinite(maxTimeRoundTripMs) || maxTimeRoundTripMs <= 0 || maxTimeRoundTripMs > MAX_TIME_ROUND_TRIP_MS)
    throw new TypeError("invalid time challenge lifetime");
  if (!Number.isSafeInteger(schemaVersion) || schemaVersion < 1) throw new TypeError("supported schema version required");
  const verifier = createPublicVerifier({ keys, subtle });
  let pendingTime = null;
  const scoped = record => record.athlete_id === athleteId && record.device_id === deviceId;
  const currentEnvelope = record => record.wire_version === WIRE_VERSION &&
    decodeSignature(record.authority_signature)?.kid === record.key_epoch;
  const receiptShape = receipt => object(receipt) && Number.isSafeInteger(receipt.seq) && receipt.seq > 0 &&
    object(receipt.op) && receipt.op.athlete_id === athleteId && receipt.op_id === receipt.op.op_id &&
    typeof receipt.canonical_content_commitment === "string" &&
    receipt.canonical_content_commitment === receipt.op.canonical_content_commitment;
  async function validReceipts(receipts, after, through) {
    if (!Array.isArray(receipts) || receipts.length !== through - after) return false;
    const positions = new Set(), identities = new Set();
    for (const [index, receipt] of receipts.entries()) {
      if (!receiptShape(receipt) || receipt.seq <= after || receipt.seq > through ||
          receipt.seq !== after + index + 1 || positions.has(receipt.seq) || identities.has(receipt.op_id) ||
          !await verifier.verifyReceipt(receipt)) return false;
      positions.add(receipt.seq); identities.add(receipt.op_id);
    }
    return true;
  }
  const forward = async (name, value) => {
    if (typeof client[name] !== "function") return fail("durable client callback is not installed");
    const result = await client[name](value);
    if (result === false || (object(result) && ["stored", "durable", "confirmed"].some(k => result[k] === false)))
      return { accepted: false, verified: true, stored: false, state: 3, reason: "durable client commit failed", result };
    return { accepted: true, ...(result === undefined ? {} : { result }) };
  };
  const safely = fn => async (...args) => {
    try { return await fn(...args); } catch (_) { return fail("verification or durable client commit failed"); }
  };
  const api = {
    verifier,
    acceptDisposition: safely(async (input, expectedOperation) => {
      const disposition = copy(input);
      const op = copy(expectedOperation || (typeof client.envelope === "function" && client.envelope(disposition.op_id)));
      if (!object(op) || op.athlete_id !== athleteId || op.device_id !== deviceId ||
          disposition.op_id !== op.op_id || disposition.device_id !== deviceId || disposition.device_seq !== op.device_seq ||
          disposition.canonical_content_commitment !== op.canonical_content_commitment || !STATUSES.has(disposition.status) ||
          (disposition.status === "ACCEPTED" && (!Number.isSafeInteger(disposition.athlete_log_seq) || disposition.athlete_log_seq < 1)) ||
          !await verifier.verifyDisposition(disposition)) return fail("disposition signature, identity or scope does not verify");
      return forward("deliverDisposition", disposition);
    }),
    acceptPull: safely(async input => {
      const envelope = copy(input);
      if (!scoped(envelope) || !currentEnvelope(envelope) || !Number.isSafeInteger(envelope.after) || envelope.after < 0 ||
          !Number.isSafeInteger(envelope.through) || envelope.through < envelope.after ||
          !await verifier.verifyPull(envelope) || !await validReceipts(envelope.receipts, envelope.after, envelope.through))
        return fail("pull envelope or receipts do not verify");
      return forward("deliverReceipts", envelope.receipts);
    }),
    acceptSnapshot: safely(async (input, expectedWatermark) => {
      const snapshot = copy(input);
      if (!scoped(snapshot) || !currentEnvelope(snapshot) || !Number.isSafeInteger(snapshot.W) || snapshot.W < 0 ||
          (expectedWatermark !== undefined && snapshot.W !== expectedWatermark) || snapshot.records !== snapshot.W ||
          !Array.isArray(snapshot.entries) || snapshot.entries.length !== snapshot.W ||
          !await verifier.verifySnapshot(snapshot) || !await validReceipts(snapshot.entries, 0, snapshot.W))
        return fail("snapshot signature, watermark or records do not verify");
      return forward("receiveSnapshot", snapshot);
    }),
    acceptLease: safely(async input => {
      const lease = copy(input);
      if (!scoped(lease) || typeof lease.lease_id !== "string" || !lease.lease_id ||
          lease.schema_version !== schemaVersion || !Array.isArray(lease.range) || lease.range.length !== 2 ||
          !lease.range.every(Number.isSafeInteger) || lease.range[0] < 1 || lease.range[1] < lease.range[0] ||
          !utcInstant(lease.not_before) || !utcInstant(lease.not_after) ||
          Date.parse(lease.not_before) > Date.parse(lease.not_after) || !await verifier.verifyLease(lease))
        return fail("lease signature, scope, schema or range does not verify");
      return forward("receiveLease", lease);
    }),
    beginTimeChallenge: () => {
      const started = monotonicMs();
      if (!crypto || typeof crypto.getRandomValues !== "function" || !Number.isFinite(started))
        throw new Error("fresh random challenge and monotonic continuity required");
      const challenge = encode64(crypto.getRandomValues(new Uint8Array(32)));
      pendingTime = { challenge, started };
      return { challenge };
    },
    acceptServerTime: safely(async input => {
      const record = copy(input), challenge = pendingTime;
      if (!challenge || !scoped(record) || !currentEnvelope(record) || record.time_profile !== TIME_PROFILE ||
          record.challenge !== challenge.challenge || !utcInstant(record.server_time) || !await verifier.verifyServerTime(record))
        return fail("fresh server time signature or challenge does not verify");
      const elapsed = monotonicMs() - challenge.started;
      if (pendingTime !== challenge || !Number.isFinite(elapsed) || elapsed < 0 || elapsed > maxTimeRoundTripMs)
        return fail("server time challenge expired or continuity lost");
      pendingTime = null; // consume before the callback; simultaneous replays cannot both succeed
      // This is an authenticated sampled clock reading, not a certified UTC
      // interval or reconciled checkpoint. A monotonic timer's observed RTT
      // alone does not establish its rate across suspend or a server error/drift
      // bound. W6 must not infer Tlo/Thi or CLOCK PASS from this callback.
      return forward("syncedServerTime", record);
    }),
  };
  return Object.freeze(api);
}

module.exports = { createPublicVerifier, createPublicBoundary, canonicalBytes, decodeSignature, DOMAINS,
  WIRE_VERSION, TIME_PROFILE, MAX_TIME_ROUND_TRIP_MS };
