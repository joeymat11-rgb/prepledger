"use strict";

// The athlete is bound when the transport is created. An HTTP boundary must
// supply that binding from its authenticated session, never an operation body.
function localTransport(authority, athleteId) {
  return {
    send(op) { return { disposition: authority.admit(athleteId, op) }; },
    pull(W = 0) {
      if (!Number.isSafeInteger(W) || W < 0) throw new TypeError("invalid receipt watermark");
      return { receipts: authority.receipts(athleteId, W).map(row => ({
        seq: row.seq, op_id: row.op.op_id,
        canonical_content_commitment: row.op.canonical_content_commitment,
        accepted_at: row.accepted_at, op: row.op,
      })) };
    },
  };
}

module.exports = { localTransport };
