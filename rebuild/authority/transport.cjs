"use strict";
/* transport.cjs — localTransport(authority, athleteId): the T2 client's transport shape over an in-process authority.
     send(op)  → { disposition } | undefined     admit the op; a storage outage (UNAVAILABLE) is a lost acknowledgement:
                                                 the client retries the SAME op_id on its next eligible tick
     pull(W)   → { receipts }                    every log entry beyond W: { seq, op_id, canonical_content_commitment,
                                                 accepted_at, op } — the client stores other devices' ops from the receipt
   Dispositions are signed with the authority's key; a client configured with a different key drains nothing. */
function localTransport(authority, athleteId) {
  return {
    send(op) { const d = authority.admit(athleteId, op); if (!d || d.status === "UNAVAILABLE") return undefined; return { disposition: d }; },
    pull(W) { return { receipts: authority.receiptsAfter(athleteId, W || 0) }; },
  };
}
module.exports = { localTransport };
