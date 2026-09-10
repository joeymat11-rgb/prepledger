import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gcmsiv } from "@noble/ciphers/aes.js";
import { hexToBytes, bytesToHex } from "@noble/hashes/utils.js";
import { createFrameAttempt, decryptFrame } from "../frame-crypto.mjs";
import { encodeFrame, decodeFrame, frameAad, recordBytes, digest, pairToken, keyMaterial } from "../frame-format.mjs";
import { frame, record } from "./frame-support.mjs";
const vectors = JSON.parse(readFileSync(new URL("fixtures/rfc8452-aes256.json", import.meta.url)));
test("RFC8452 C.2/C.3 AES256 vectors pin encryption/decryption including counter-wrap", () => {
  for (const v of vectors.vectors) {
    const key = hexToBytes(v.key), nonce = hexToBytes(v.nonce), aad = hexToBytes(v.aad), plaintext = hexToBytes(v.plaintext), expected = hexToBytes(v.ciphertext);
    assert.deepEqual(gcmsiv(key, nonce, aad).encrypt(plaintext), expected);
    assert.deepEqual(gcmsiv(key, nonce, aad).decrypt(expected), plaintext);
  }
  assert(vectors.vectors.length >= 26); console.log(`W6 FRAME RFC8452 PASS — ${vectors.vectors.length} AES256/counter-wrap vectors`);
});
test("closed352 frame and maximum922 AAD round-trip, exact reserved/absent encodings", () => {
  const f = frame({ H: 86400000, W_last: -123, U: 64, leaseTimeHigh: 86400000, observationCounter: 2 });
  assert.equal(encodeFrame(f).length, 352); assert.deepEqual(decodeFrame(encodeFrame(f)), f);
  assert.equal(bytesToHex(encodeFrame(frame())), "455746320001016002001200" + "00".repeat(340));
  assert.equal(frameAad(record({ namespace: "x".repeat(768) })).length, 922);
  for (const offset of [0, 4, 6, 14, 15, 40, 80, 336, 351]) { const bytes = encodeFrame(frame()); bytes[offset] ^= 1; assert.throws(() => decodeFrame(bytes)); }
  assert.throws(() => decodeFrame(new Uint8Array(353))); assert.throws(() => encodeFrame({ ...f, extra: true }));
});
test("frame schema refuses unsafe/fractional values, illegal state, partial batch and ambiguous namespace", () => {
  for (const patch of [{ H: NaN }, { H: -1 }, { H: 1.5 }, { H: Number.MAX_SAFE_INTEGER + 1 }, { W_last: 8640000000000001 }, { state: 11 }, { guard: 3 }, { checkpointRef: "00".repeat(32) }, { kind: 0, batchCount: 2, firstSequence: 1, lastSequence: 1, batchRef: "ab".repeat(32) }]) assert.throws(() => encodeFrame(frame(patch)));
  for (const namespace of ["", "x".repeat(769), "\ud800", "\udc00"]) assert.throws(() => frameAad(record({ namespace })));
  assert.doesNotThrow(() => frameAad(record({ namespace: "🧪" })));
  const getter = frame(); Object.defineProperty(getter, "H", { enumerable: true, get() { throw new Error("accessor must not be invoked"); } }); assert.throws(() => encodeFrame(getter), e => e.state === 18);
});
test("fixed AES256 nonce12 wrapper refuses library extensions; attempts burn before throw and keys are owned", () => {
  for (const size of [16, 24]) assert.throws(() => createFrameAttempt(new Uint8Array(size)));
  for (const size of [11, 13, 16]) assert.throws(() => createFrameAttempt(new Uint8Array(32), { getRandomValues: () => new Uint8Array(size) }));
  const key = new Uint8Array(32), original = key.slice(), a = createFrameAttempt(key), nonce = a.nonce(); key[0] = 1;
  const plaintext = encodeFrame(frame()), aad = frameAad(record()), sealed = a.encrypt(aad, plaintext);
  assert.deepEqual(decryptFrame(original, nonce, aad, sealed), plaintext); assert.throws(() => a.encrypt(aad, plaintext), e => e.code === "FRAME_ATTEMPT_CONSUMED");
  const b = createFrameAttempt(original); assert.throws(() => b.encrypt(aad, new Uint8Array(1))); assert.throws(() => b.encrypt(aad, plaintext), e => e.code === "FRAME_ATTEMPT_CONSUMED");
  for (const size of [11, 13, 16]) assert.throws(() => decryptFrame(original, new Uint8Array(size), aad, sealed));
  for (const size of [16, 24]) assert.throws(() => decryptFrame(new Uint8Array(size), nonce, aad, sealed));
});
test("full predecessor serialization and AAD cover every previous field including nested body and parentdigest", () => {
  const previous = record(), active = record({ commitRevision: 2, previousRecordDigest: digest(recordBytes(previous)) });
  const original = pairToken(active, previous), bound = frameAad(active);
  const mutations = [r => r.namespace += "x", r => r.commitRevision++, r => r.frameKeyEpoch++, r => r.frameNonce[0]++, r => r.frameCiphertext[0]++, r => r.previousRecordDigest[0]++,
    r => r.body.keyEpoch++, r => r.body.aadRevision++, r => r.body.iv[0]++, r => new Uint8Array(r.body.ciphertext)[0]++];
  for (const mutate of mutations) { const p = structuredClone(previous); mutate(p); if (p.body.aadRevision > p.commitRevision) p.commitRevision = p.body.aadRevision; assert.notEqual(pairToken(active, p), original); assert.notDeepEqual(frameAad({ ...active, previousRecordDigest: digest(recordBytes(p)) }), bound); }
  const old = { format: 1, namespace: previous.namespace, revision: 1, iv: new Uint8Array(12), ciphertext: new ArrayBuffer(16) };
  assert(recordBytes(old).length > 40); assert.notEqual(bytesToHex(digest(recordBytes(old))), "00".repeat(32));
});
test("operational key revision window includes last boundary and excludes next, not an attempt budget", () => {
  const material = { keyEpoch: 1, keyBytes: new Uint8Array(32), revisionStart: 1 };
  assert.equal(keyMaterial(material, 1, 2 ** 24).length, 32);
  assert.throws(() => keyMaterial(material, 1, 2 ** 24 + 1, true), e => e.state === 3);
  assert.throws(() => keyMaterial(material, 1, 2 ** 24 + 1), e => e.state === 18);
  assert.equal(keyMaterial({ ...material, keyEpoch: 2, revisionStart: 2 ** 24 + 1 }, 2, 2 ** 24 + 1).length, 32);
  for (let i = 0; i < 5; i++) { const attempt = createFrameAttempt(keyMaterial(material, 1, 1)); assert.throws(() => attempt.encrypt(new Uint8Array(), new Uint8Array())); }
  assert.equal(keyMaterial(material, 1, 1).length, 32, "aborted attempts do not consume revision window: security budget remains OPEN");
});
test("intrinsic sizes and owned copies refuse shadowed length/buffer/slice and decorated ciphertext buffers", () => {
  const small = new Uint8Array(16); Object.defineProperty(small, "length", { value: 32 }); assert.throws(() => createFrameAttempt(small));
  const key = new Uint8Array(32); Object.defineProperty(key, "slice", { value: () => key }); assert.throws(() => createFrameAttempt(key)); assert.equal(key.length, 32);
  for (const field of ["buffer", "byteLength", "byteOffset", "slice"]) { const nonce = new Uint8Array(12); Object.defineProperty(nonce, field, { get() { throw new Error("must not invoke getter"); } }); assert.throws(() => createFrameAttempt(new Uint8Array(32), { getRandomValues: () => nonce }), e => e.state === 3); }
  const buffer = new ArrayBuffer(16); Object.defineProperty(buffer, "byteLength", { value: 32 }); const r = record(); r.body.ciphertext = buffer; assert.throws(() => recordBytes(r), e => e.state === 18);
  const tagged = new Uint8Array(32); tagged[Symbol("extra")] = true; assert.throws(() => createFrameAttempt(tagged));
});
