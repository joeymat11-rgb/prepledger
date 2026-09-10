import { gcmsiv } from "@noble/ciphers/aes.js";
import { FRAME_BYTES, FRAME_CIPHERTEXT_BYTES, fail, ownedBytes } from "./frame-format.mjs";

// Public RFC test vectors use the primitive directly; application frames always use this fixed profile.
export function createFrameAttempt(key32, crypto = globalThis.crypto) {
  const key = ownedBytes(key32, 32); let nonce, used = false;
  try { nonce = ownedBytes(crypto.getRandomValues(new Uint8Array(12)), 12); }
  catch { key.fill(0); fail("FRAME_RANDOMNESS_UNAVAILABLE", 3); }
  return Object.freeze({
    nonce: () => nonce.slice(),
    encrypt(aadInput, plaintextInput) {
      if (used) fail("FRAME_ATTEMPT_CONSUMED", 3); used = true;
      try {
        const aad = ownedBytes(aadInput), plaintext = ownedBytes(plaintextInput, FRAME_BYTES);
        if (aad.length > 1024) fail();
        const ciphertext = gcmsiv(key, nonce, aad).encrypt(plaintext);
        return ownedBytes(ciphertext, FRAME_CIPHERTEXT_BYTES);
      } catch { fail("FRAME_ENCRYPT_FAILED", 3); }
      finally { key.fill(0); }
    },
    discard() { used = true; key.fill(0); },
  });
}
export function decryptFrame(key32, nonce12, aadInput, ciphertextInput) {
  const key = ownedBytes(key32, 32), nonce = ownedBytes(nonce12, 12), aad = ownedBytes(aadInput), ciphertext = ownedBytes(ciphertextInput, FRAME_CIPHERTEXT_BYTES);
  try { if (aad.length > 1024) fail(); return ownedBytes(gcmsiv(key, nonce, aad).decrypt(ciphertext), FRAME_BYTES); }
  catch { fail("FRAME_AUTHENTICATION_FAILED"); }
  finally { key.fill(0); }
}
