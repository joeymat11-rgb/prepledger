import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";

// Deliberately only the Node subset used by client/ops.cjs and client/plan.cjs.
function state(hash) {
  let finished = false;
  const api = {
    update(text, encoding) {
      if (finished || typeof text !== "string" || (encoding !== undefined && encoding !== "utf8")) throw new TypeError("Unsupported SHA-256 update");
      hash.update(utf8ToBytes(text));
      return api;
    },
    digest(encoding) {
      if (finished || encoding !== "hex") throw new TypeError("Unsupported SHA-256 digest");
      finished = true;
      return bytesToHex(hash.digest());
    },
  };
  return Object.freeze(api);
}
export function createHash(algorithm) {
  if (algorithm !== "sha256") throw new TypeError("Only SHA-256 is available");
  return state(sha256.create());
}
export function createHmac(algorithm, key) {
  if (algorithm !== "sha256" || typeof key !== "string") throw new TypeError("Only string-key SHA-256 HMAC is available");
  return state(hmac.create(sha256, utf8ToBytes(key)));
}
