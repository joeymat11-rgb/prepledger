"use strict";

// W5 replaces only the authority's declared crypto boundary. Canonical v1,
// operation HMAC and all existing signed domains remain the accepted T3 ones.
// The private signing primitive is Node/Workers native ECDSA, never JavaScript
// scalar arithmetic. The staged authority persists signed dispositions before
// replying, so exact accepted replays return those same durable signature bytes.
const { createHmac, createPrivateKey, createPublicKey, generateKeyPairSync,
  sign, verify } = require("node:crypto");
const { canonicalEncode } = require("../../authority/canonical.cjs");

const PROFILE = "earned/p256-sha256-p1363-low-s/v1";
const ORDER = BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551");
const AUTHORITY_METADATA = new Set([
  "canonical_content_commitment", "authority_signature", "athlete_log_seq",
  "accepted_at", "decided_at", "sealing_transitions", "sealed",
]);
const DOMAINS = Object.freeze({
  disposition: "earned/disposition/v1", lease: "earned/lease/v1",
  serverTime: "earned/server-time/v1", receipt: "earned/receipt/v1",
  pull: "earned/pull/v1", snapshot: "earned/snapshot/v1",
});
const FIELDS = Object.freeze({ lease: "signature" });

function hmac(key, text) {
  if (key == null) throw new TypeError("signing key required");
  return createHmac("sha256", String(key)).update(text, "utf8").digest("hex");
}
function without(record, excluded) {
  return Object.fromEntries(Object.keys(record).filter(k => !excluded.has(k)).map(k => [k, record[k]]));
}
function commitmentOf(operation, identityKey) {
  return hmac(identityKey, "earned/op/v1" + canonicalEncode(without(operation, AUTHORITY_METADATA)));
}
function canonicalBytes(record, domain, field = "authority_signature") {
  return Buffer.from(domain + canonicalEncode(without(record, new Set([field]))), "utf8");
}
function checkKid(key) {
  if (!key || typeof key !== "object" || !/^[A-Za-z0-9_-]{1,64}$/.test(key.kid || ""))
    throw new TypeError("a pinned P-256 key and kid are required");
}
function keyObject(key, privatePart) {
  checkKid(key);
  const source = privatePart ? key.privateKey : key.publicKey;
  if (!source) throw new TypeError(privatePart ? "private signing key required" : "public verification key required");
  const value = source.kty ? (privatePart ? createPrivateKey : createPublicKey)({ key: source, format: "jwk" })
    : source.type === (privatePart ? "private" : "public") ? source
      : (privatePart ? createPrivateKey : createPublicKey)(source);
  if (value.asymmetricKeyType !== "ec" || value.asymmetricKeyDetails.namedCurve !== "prime256v1")
    throw new TypeError("only P-256 verification/signing keys are accepted");
  return value;
}
function isKeyring(key) {
  return !!key && typeof key === "object" &&
    (Object.hasOwn(key, "activeSigningKey") || Object.hasOwn(key, "verificationKeys"));
}
function keyring(key) {
  if (Array.isArray(key) || Object.keys(key).some(name => !["activeSigningKey", "verificationKeys"].includes(name)) ||
      !Array.isArray(key.verificationKeys) || !key.verificationKeys.length)
    throw new TypeError("an active signing key and unique public verification pins are required");
  checkKid(key.activeSigningKey);
  if (typeof key.activeSigningKey.kid !== "string") throw new TypeError("active kid must be a string");
  const pins = new Map();
  for (const pin of key.verificationKeys) {
    checkKid(pin);
    if (typeof pin.kid !== "string" || Array.isArray(pin) || Object.keys(pin).some(name => !["kid", "publicKey"].includes(name)) ||
        pins.has(pin.kid) || !pin.publicKey || pin.publicKey.d !== undefined || pin.publicKey.type === "private" ||
        (pin.publicKey.key_ops !== undefined && (!Array.isArray(pin.publicKey.key_ops) ||
          pin.publicKey.key_ops.length !== 1 || pin.publicKey.key_ops[0] !== "verify")) ||
        (typeof pin.publicKey === "string" && /PRIVATE KEY/.test(pin.publicKey)))
      throw new TypeError("verification pins must be unique public P-256 keys");
    const object = keyObject(pin, false);
    // Do not accept private key material in alternative Node key-input forms.
    if (pin.publicKey.key !== undefined || Buffer.isBuffer(pin.publicKey))
      throw new TypeError("verification pins must contain public key objects, JWKs or public PEM");
    pins.set(pin.kid, { pin, object });
  }
  const active = pins.get(key.activeSigningKey.kid);
  if (!active || !active.object.export({ format: "der", type: "spki" }).equals(
    keyObject(key.activeSigningKey, false).export({ format: "der", type: "spki" })))
    throw new TypeError("active signing key must match its public verification pin");
  return { active: key.activeSigningKey, pins };
}
function activeKeyId(key) {
  if (isKeyring(key)) return keyring(key).active.kid;
  checkKid(key);
  return key.kid;
}
const integer = bytes => BigInt("0x" + bytes.toString("hex"));
function lowS(bytes) {
  if (bytes.length !== 64) throw new TypeError("P-256 requires a 64-byte P1363 signature");
  const result = Buffer.from(bytes);
  const s = integer(result.subarray(32));
  if (s > ORDER / 2n) Buffer.from((ORDER - s).toString(16).padStart(64, "0"), "hex").copy(result, 32);
  return result;
}
function parseSignature(signature, kid) {
  if (typeof signature !== "string") return null;
  const match = /^ES256\.([A-Za-z0-9_-]{1,64})\.([A-Za-z0-9_-]{86})$/.exec(signature);
  if (!match || match[1] !== kid) return null;
  const raw = Buffer.from(match[2], "base64url");
  if (raw.length !== 64 || raw.toString("base64url") !== match[2]) return null;
  const r = integer(raw.subarray(0, 32)), s = integer(raw.subarray(32));
  if (r <= 0n || r >= ORDER || s <= 0n || s > ORDER / 2n) return null;
  return raw;
}
function signatureOver(record, key, domain, field = "authority_signature") {
  const ring = isKeyring(key) ? keyring(key) : null;
  if (ring) key = ring.active;
  const signingKey = keyObject(key, true);
  if (ring && !createPublicKey(signingKey).export({ format: "der", type: "spki" }).equals(
      ring.pins.get(key.kid).object.export({ format: "der", type: "spki" })))
    throw new TypeError("active private key must match its public verification pin");
  // workerd rejects a KeyObject nested in sign/verify options. Native PEM
  // export is an in-memory adapter; no key bytes enter a response or fixture.
  const bytes = sign("sha256", canonicalBytes(record, domain, field), {
    key: signingKey.export({ format: "pem", type: "pkcs8" }), dsaEncoding: "ieee-p1363",
  });
  return "ES256." + key.kid + "." + lowS(bytes).toString("base64url");
}
function verifyRecord(record, key, domain, field = "authority_signature") {
  if (!record || typeof record !== "object" || Array.isArray(record)) return false;
  try {
    if (isKeyring(key)) {
      const ring = keyring(key);
      const match = typeof record[field] === "string" && /^ES256\.([A-Za-z0-9_-]{1,64})\./.exec(record[field]);
      const found = match && ring.pins.get(match[1]);
      if (!found) return false;
      key = found.pin;
    }
    checkKid(key);
    const raw = parseSignature(record[field], key.kid);
    return !!raw && verify("sha256", canonicalBytes(record, domain, field),
      { key: keyObject(key, false).export({ format: "pem", type: "spki" }), dsaEncoding: "ieee-p1363" }, raw);
  } catch (_) { return false; }
}
function publicKeyOf(key) {
  if (isKeyring(key)) key = keyring(key).active;
  const publicKey = keyObject(key, false).export({ format: "jwk" });
  return { kid: key.kid, publicKey: { kty: "EC", crv: "P-256", x: publicKey.x, y: publicKey.y, key_ops: ["verify"], ext: true } };
}
function generateSigningKey(kid = "local-run") {
  const pair = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const key = { kid, privateKey: pair.privateKey.export({ format: "jwk" }), publicKey: pair.publicKey.export({ format: "jwk" }) };
  checkKid(key);
  return key;
}
const api = { PROFILE, DOMAINS, canonicalBytes, hmac, commitmentOf, signatureOver, verifyRecord,
  parseSignature, publicKeyOf, generateSigningKey, activeKeyId };
for (const [kind, domain] of Object.entries(DOMAINS)) {
  const suffix = kind[0].toUpperCase() + kind.slice(1), field = FIELDS[kind] || "authority_signature";
  api["sign" + suffix] = (record, key) => ({ ...record, [field]: signatureOver(record, key, domain, field) });
  api["verify" + suffix] = (record, key) => verifyRecord(record, key, domain, field);
}
api.leaseValid = api.verifyLease;
module.exports = api;
