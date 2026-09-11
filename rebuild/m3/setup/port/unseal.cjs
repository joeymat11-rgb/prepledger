'use strict';
/* rebuild/m3/setup/port/unseal.cjs — the REFERENCE DECODER for the sealed port
   bundle, and the single source of the sealing parameters. port.cjs seals with
   the constants exported here; C2b (the phone side) re-implements the same
   parameters on WebCrypto and must agree with this file byte for byte.

   Envelope (a plain JSON file, safe to move over iCloud/OneDrive/e-mail):
     { profile, sealedAt, kdf:{name,hash,iterations,salt}, cipher:{name,keyBits,
       ivBytes,tagBits,iv}, aad:[profile, sourceSha256], ciphertext }
   salt / iv / ciphertext are base64. ciphertext is AES-GCM output with the
   16-byte tag APPENDED (the WebCrypto convention, so the phone can hand the
   whole buffer to crypto.subtle.decrypt unchanged).

   Every structural, key or tag failure raises the SAME code, BUNDLE_AUTH_FAILED.
   A decoder that distinguishes "bad passphrase" from "bad bytes" tells an
   attacker which half to keep working on, and tells Joe nothing useful either. */
const { createDecipheriv, pbkdf2Sync } = require('node:crypto');

const PROFILE = 'earned/local-import-bundle/v1';
const KDF = Object.freeze({ name: 'PBKDF2', hash: 'SHA-256', iterations: 600000, saltBytes: 16, keyBits: 256 });
const CIPHER = Object.freeze({ name: 'AES-GCM', keyBits: 256, ivBytes: 12, tagBits: 128 });
const TAG_BYTES = CIPHER.tagBits / 8;
const FAILURE = 'BUNDLE_AUTH_FAILED';

function fail(code) { const error = new Error(code); error.code = code; throw error; }

/* The additional authenticated data binds the sealed payload to the ORIGINAL
   source bytes: re-pointing a bundle at a different ledger changes sourceSha256
   and the tag stops verifying. */
function aadBytes(sourceSha256) {
  if (typeof sourceSha256 !== 'string' || !/^[0-9a-f]{64}$/.test(sourceSha256)) fail('BUNDLE_AAD_INVALID');
  return Buffer.from(JSON.stringify([PROFILE, sourceSha256]), 'utf8');
}

/* NFKD so a passphrase typed on the phone keyboard derives the same key as one
   typed on the PC. The word list is plain ASCII, so this is belt and braces. */
function deriveKey(passphrase, salt, iterations = KDF.iterations) {
  if (typeof passphrase !== 'string' || !passphrase) fail(FAILURE);
  if (!Buffer.isBuffer(salt) || salt.length !== KDF.saltBytes) fail(FAILURE);
  if (!Number.isSafeInteger(iterations) || iterations !== KDF.iterations) fail(FAILURE);
  return pbkdf2Sync(Buffer.from(passphrase.normalize('NFKD'), 'utf8'), salt, iterations, KDF.keyBits / 8, 'sha256');
}

function b64(value, bytes) {
  if (typeof value !== 'string') fail(FAILURE);
  let out;
  try { out = Buffer.from(value, 'base64'); } catch { fail(FAILURE); }
  // Buffer.from is lenient; round-trip so a mangled field cannot silently shrink.
  if (out.toString('base64') !== value) fail(FAILURE);
  if (bytes !== undefined && out.length !== bytes) fail(FAILURE);
  return out;
}

function unseal(bundleBytes, passphrase) {
  let text;
  if (Buffer.isBuffer(bundleBytes) || bundleBytes instanceof Uint8Array) text = Buffer.from(bundleBytes).toString('utf8');
  else if (typeof bundleBytes === 'string') text = bundleBytes;
  else fail(FAILURE);
  let env;
  try { env = JSON.parse(text); } catch { fail(FAILURE); }
  if (!env || typeof env !== 'object' || Array.isArray(env)) fail(FAILURE);
  if (env.profile !== PROFILE) fail(FAILURE);
  const kdf = env.kdf, cipher = env.cipher;
  if (!kdf || !cipher || kdf.name !== KDF.name || kdf.hash !== KDF.hash ||
      cipher.name !== CIPHER.name || cipher.keyBits !== CIPHER.keyBits ||
      cipher.ivBytes !== CIPHER.ivBytes || cipher.tagBits !== CIPHER.tagBits) fail(FAILURE);
  if (!Array.isArray(env.aad) || env.aad.length !== 2 || env.aad[0] !== PROFILE ||
      typeof env.aad[1] !== 'string' || !/^[0-9a-f]{64}$/.test(env.aad[1])) fail(FAILURE);
  const salt = b64(kdf.salt, KDF.saltBytes);
  const iv = b64(cipher.iv, CIPHER.ivBytes);
  const sealed = b64(env.ciphertext);
  if (sealed.length <= TAG_BYTES) fail(FAILURE);
  const body = sealed.subarray(0, sealed.length - TAG_BYTES);
  const tag = sealed.subarray(sealed.length - TAG_BYTES);
  const key = deriveKey(passphrase, salt, kdf.iterations);
  let plain;
  try {
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAAD(aadBytes(env.aad[1]));
    decipher.setAuthTag(tag);
    plain = Buffer.concat([decipher.update(body), decipher.final()]);
  } catch { fail(FAILURE); }
  let payload;
  try { payload = JSON.parse(plain.toString('utf8')); } catch { fail(FAILURE); }
  // The tag already proves these agree; checking anyway keeps a future encoder
  // from shipping a bundle whose envelope and payload disagree about the source.
  if (!payload || payload.profile !== PROFILE || !payload.source ||
      payload.source.sha256 !== env.aad[1]) fail(FAILURE);
  return payload;
}

module.exports = { PROFILE, KDF, CIPHER, TAG_BYTES, FAILURE, aadBytes, deriveKey, unseal };
