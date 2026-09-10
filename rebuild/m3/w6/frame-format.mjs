import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { StorageFailure } from "./repository.mjs";

export const FRAME_BYTES = 352, FRAME_CIPHERTEXT_BYTES = 368, REVISION_WINDOW = 2 ** 24;
export const REF_NAMES = Object.freeze(["checkpointRef", "leaseRef", "batchRef", "guardRef", "sessionRef", "permissionRef", "standingRef", "recoveryRef"]);
export const FRAME_KEYS = Object.freeze(["kind", "guard", "state", "allowanceInvalidated", "H", "W_last", "U", "leaseTimeHigh", "observationCounter", "firstSequence", "lastSequence", "batchCount", ...REF_NAMES]);
const encoder = new TextEncoder(), MAX_TIME = 8640000000000000;
const typedPrototype = Object.getPrototypeOf(Uint8Array.prototype);
const realLength = Object.getOwnPropertyDescriptor(typedPrototype, "length").get;
const realBuffer = Object.getOwnPropertyDescriptor(typedPrototype, "buffer").get;
const realBufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get;
const typedSet = Uint8Array.prototype.set;
export const fail = (code = "FRAME_INTEGRITY_UNPROVEN", state = 18) => { throw new StorageFailure(code, state); };
export function exactObject(value, keys) {
  if (!value || typeof value !== "object" || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) fail();
  const names = Reflect.ownKeys(value);
  if (names.length !== keys.length || names.some(name => typeof name !== "string" || !keys.includes(name))) fail();
  for (const name of names) { const descriptor = Object.getOwnPropertyDescriptor(value, name); if (!descriptor || !Object.hasOwn(descriptor, "value") || !descriptor.enumerable) fail(); }
  return value;
}
export function ownedBytes(value, length) {
  if (!(value instanceof Uint8Array) || Object.getPrototypeOf(value) !== Uint8Array.prototype) fail();
  let actual, buffer;
  try { actual = Reflect.apply(realLength, value, []); buffer = Reflect.apply(realBuffer, value, []); } catch { fail(); }
  bufferLength(buffer);
  if (length !== undefined && actual !== length) fail();
  const keys = Reflect.ownKeys(value);
  if (keys.length !== actual || keys.some(key => typeof key !== "string" || !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= actual)) fail();
  const copied = new Uint8Array(actual); Reflect.apply(typedSet, copied, [value]); return copied;
}
function bufferLength(value) {
  if (!(value instanceof ArrayBuffer) || Object.getPrototypeOf(value) !== ArrayBuffer.prototype || Reflect.ownKeys(value).length !== 0) fail();
  try { return Reflect.apply(realBufferLength, value, []); } catch { fail(); }
}
export function safe(value, positive = false) { if (!Number.isSafeInteger(value) || value < (positive ? 1 : 0)) fail(); return value; }
function time(value) { if (!Number.isSafeInteger(value) || Math.abs(value) > MAX_TIME) fail(); return value; }
export function namespaceBytes(namespace) {
  if (typeof namespace !== "string" || !namespace || /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(namespace)) fail("FRAME_NAMESPACE_INVALID");
  const bytes = encoder.encode(namespace); if (bytes.length > 768) fail("FRAME_NAMESPACE_INVALID"); return bytes;
}
export function concat(...values) { const size = values.reduce((sum, v) => sum + v.length, 0); const out = new Uint8Array(size); let at = 0; for (const v of values) { out.set(v, at); at += v.length; } return out; }
export function integerBytes(value, length) { safe(value); const out = new Uint8Array(length), view = new DataView(out.buffer); if (length === 2) { if (value > 65535) fail(); view.setUint16(0, value); } else view.setBigUint64(0, BigInt(value)); return out; }
export const digest = bytes => sha256(bytes);
export const digestHex = bytes => bytesToHex(digest(bytes));
export function sameBytes(a, b) { if (a.length !== b.length) return false; let changed = 0; for (let i = 0; i < a.length; i++) changed |= a[i] ^ b[i]; return changed === 0; }
export const allZero = bytes => bytes.every(byte => byte === 0);
function fromHex(hex) { if (typeof hex !== "string" || !/^[0-9a-f]{64}$/.test(hex)) fail(); return Uint8Array.from(hex.match(/../g), value => parseInt(value, 16)); }
export function validateFrame(fields) {
  exactObject(fields, FRAME_KEYS);
  if (![0, 1, 2, 3].includes(fields.kind) || ![0, 1, 2].includes(fields.guard) || ![0, 17, 18, 19, 20].includes(fields.state) || ![0, 1].includes(fields.allowanceInvalidated)) fail();
  for (const name of ["H", "U", "observationCounter", "firstSequence", "lastSequence", "batchCount"]) safe(fields[name]);
  time(fields.W_last); if (fields.leaseTimeHigh !== null) time(fields.leaseTimeHigh);
  for (const name of REF_NAMES) if (fields[name] !== null && allZero(fromHex(fields[name]))) fail();
  if (fields.kind === 0) {
    if (!fields.batchRef || fields.batchCount < 1 || fields.firstSequence < 1 || BigInt(fields.lastSequence) - BigInt(fields.firstSequence) + 1n !== BigInt(fields.batchCount)) fail();
  } else if (fields.batchRef !== null || fields.batchCount !== 0 || fields.firstSequence !== 0 || fields.lastSequence !== 0) fail();
  return fields;
}
export function encodeFrame(fields) {
  validateFrame(fields); const bytes = new Uint8Array(FRAME_BYTES), v = new DataView(bytes.buffer);
  bytes.set(encoder.encode("EWF2")); v.setUint16(4, 1); v.setUint16(6, FRAME_BYTES);
  ["kind", "guard", "state", "allowanceInvalidated"].forEach((name, i) => v.setUint8(8 + i, fields[name]));
  let presence = fields.leaseTimeHigh === null ? 0 : 256;
  REF_NAMES.forEach((name, i) => { if (fields[name] !== null) { presence |= 1 << i; bytes.set(fromHex(fields[name]), 80 + 32 * i); } });
  v.setUint16(12, presence);
  v.setBigUint64(16, BigInt(fields.H)); v.setBigInt64(24, BigInt(fields.W_last)); v.setBigUint64(32, BigInt(fields.U));
  v.setBigInt64(40, BigInt(fields.leaseTimeHigh ?? 0)); v.setBigUint64(48, BigInt(fields.observationCounter));
  ["firstSequence", "lastSequence", "batchCount"].forEach((name, i) => v.setBigUint64(56 + 8 * i, BigInt(fields[name])));
  return bytes;
}
export function decodeFrame(input) {
  const bytes = ownedBytes(input, FRAME_BYTES), v = new DataView(bytes.buffer);
  if (!sameBytes(bytes.subarray(0, 4), encoder.encode("EWF2")) || v.getUint16(4) !== 1 || v.getUint16(6) !== FRAME_BYTES || v.getUint16(14) !== 0 || !allZero(bytes.subarray(336))) fail();
  const presence = v.getUint16(12); if (presence & ~511) fail();
  const fields = { kind: v.getUint8(8), guard: v.getUint8(9), state: v.getUint8(10), allowanceInvalidated: v.getUint8(11),
    H: Number(v.getBigUint64(16)), W_last: Number(v.getBigInt64(24)), U: Number(v.getBigUint64(32)),
    leaseTimeHigh: presence & 256 ? Number(v.getBigInt64(40)) : null, observationCounter: Number(v.getBigUint64(48)),
    firstSequence: Number(v.getBigUint64(56)), lastSequence: Number(v.getBigUint64(64)), batchCount: Number(v.getBigUint64(72)) };
  if (!(presence & 256) && !allZero(bytes.subarray(40, 48))) fail();
  REF_NAMES.forEach((name, i) => { const ref = bytes.subarray(80 + i * 32, 112 + i * 32); if (!(presence & (1 << i)) && !allZero(ref)) fail(); fields[name] = presence & (1 << i) ? bytesToHex(ref) : null; });
  return validateFrame(fields);
}
const BODY_KEYS = ["format", "keyEpoch", "aadRevision", "iv", "ciphertext"];
const RECORD_KEYS = ["format", "namespace", "commitRevision", "body", "frameKeyEpoch", "frameNonce", "frameCiphertext", "previousRecordDigest"];
export function validateBodyRecord(body) {
  exactObject(body, BODY_KEYS); if (body.format !== 2) fail(); safe(body.keyEpoch, true); safe(body.aadRevision, true); ownedBytes(body.iv, 12);
  if (bufferLength(body.ciphertext) < 16) fail(); return body;
}
export function validateRecord(record) {
  exactObject(record, RECORD_KEYS); if (record.format !== 2) fail(); namespaceBytes(record.namespace); safe(record.commitRevision, true); safe(record.frameKeyEpoch, true);
  validateBodyRecord(record.body); if (record.body.aadRevision > record.commitRevision) fail(); ownedBytes(record.frameNonce, 12); ownedBytes(record.frameCiphertext, FRAME_CIPHERTEXT_BYTES); ownedBytes(record.previousRecordDigest, 32); return record;
}
export function validateV1Record(record) {
  exactObject(record, ["format", "namespace", "revision", "iv", "ciphertext"]); if (record.format !== 1) fail(); namespaceBytes(record.namespace); safe(record.revision, true); ownedBytes(record.iv, 12);
  if (bufferLength(record.ciphertext) < 16) fail(); return record;
}
export function recordBytes(record) {
  const version = record && typeof record === "object" ? Object.getOwnPropertyDescriptor(record, "format")?.value : undefined;
  if (version === 1) validateV1Record(record); else validateRecord(record);
  const ns = namespaceBytes(record.namespace);
  if (record.format === 1) { validateV1Record(record); return concat(encoder.encode("earned/local-record/v1"), integerBytes(1, 2), integerBytes(ns.length, 2), ns, integerBytes(record.revision, 8), record.iv, integerBytes(record.ciphertext.byteLength, 8), new Uint8Array(record.ciphertext)); }
  validateRecord(record); const b = record.body;
  return concat(encoder.encode("earned/local-record/v2"), integerBytes(2, 2), integerBytes(ns.length, 2), ns, integerBytes(record.commitRevision, 8), integerBytes(b.format, 2), integerBytes(b.keyEpoch, 8), integerBytes(b.aadRevision, 8), b.iv, integerBytes(b.ciphertext.byteLength, 8), new Uint8Array(b.ciphertext), integerBytes(record.frameKeyEpoch, 8), record.frameNonce, record.frameCiphertext, record.previousRecordDigest);
}
export function pairToken(active, previous) { return bytesToHex(concat(integerBytes(recordBytes(active).length, 8), recordBytes(active), new Uint8Array([previous === undefined ? 0 : 1]), ...(previous === undefined ? [] : [integerBytes(recordBytes(previous).length, 8), recordBytes(previous)]))); }
export function frameAad(record, preparedBodyDigest) {
  validateRecord(record); const ns = namespaceBytes(record.namespace), b = record.body;
  return concat(encoder.encode("earned/local-permission-frame/v2"), integerBytes(2, 2), integerBytes(ns.length, 2), ns, integerBytes(record.commitRevision, 8), integerBytes(record.frameKeyEpoch, 8), integerBytes(b.format, 2), integerBytes(b.keyEpoch, 8), integerBytes(b.aadRevision, 8), b.iv, integerBytes(b.ciphertext.byteLength, 8), preparedBodyDigest === undefined ? digest(new Uint8Array(b.ciphertext)) : ownedBytes(preparedBodyDigest, 32), record.previousRecordDigest);
}
export function keyMaterial(value, epoch, revision, writing = false) {
  exactObject(value, ["keyEpoch", "keyBytes", "revisionStart"]); safe(epoch, true); safe(revision, true); safe(value.revisionStart, true); safe(value.revisionStart + REVISION_WINDOW, true);
  if (value.keyEpoch !== epoch) fail("FRAME_KEY_UNAVAILABLE");
  const keyBytes = ownedBytes(value.keyBytes, 32);
  if (revision < value.revisionStart || revision >= value.revisionStart + REVISION_WINDOW) { keyBytes.fill(0); fail("FRAME_KEY_WINDOW", writing ? 3 : 18); }
  return keyBytes;
}
