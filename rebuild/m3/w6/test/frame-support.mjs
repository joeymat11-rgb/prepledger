import { REF_NAMES } from "../frame-format.mjs";
export const frame = patch => ({ kind: 2, guard: 0, state: 18, allowanceInvalidated: 0, H: 0, W_last: 0, U: 0, leaseTimeHigh: null, observationCounter: 0,
  firstSequence: 0, lastSequence: 0, batchCount: 0, ...Object.fromEntries(REF_NAMES.map(name => [name, null])), ...patch });
export const record = patch => ({ format: 2, namespace: "synthetic-install", commitRevision: 1, body: { format: 2, keyEpoch: 1, aadRevision: 1, iv: new Uint8Array(12), ciphertext: new ArrayBuffer(16) },
  frameKeyEpoch: 1, frameNonce: new Uint8Array(12), frameCiphertext: new Uint8Array(368), previousRecordDigest: new Uint8Array(32), ...patch });
