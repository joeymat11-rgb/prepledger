"use strict";
/* crypto.cjs — the authority's HMAC-SHA256 primitives. Every signed or digested record goes through ONE function,
   signRecord(): strip the signature field, encode canonically, HMAC under a domain-separated pre-image.
     dispositions  "earned/disposition/v1"   signed with the authority key; the client verifies with the same key
     leases        "earned/lease/v1"         issued by the authority; verified here (admission) and on the device (committer)
     op identity   "earned/op/v1"            the client's commitment (A1) — re-derived only when an identity key is configured
     effect digest / group commitment / conflict basis / instance identity — internal digests the authority hands out
     and later compares against what a client echoes back (undo eligibility, conflict selection, issuance identity) */
const nodeCrypto = require("node:crypto");
const { encode } = require("./canonical.cjs");
const DOMAINS = { op: "earned/op/v1", disposition: "earned/disposition/v1", lease: "earned/lease/v1", members: "earned/members/v1", effect: "earned/plan-effect/v1", group: "earned/plan-group/v1", basis: "earned/conflict-basis/v1", instance: "earned/instance/v1" };
const AUTHORITY_METADATA = new Set(["canonical_content_commitment", "authority_signature", "athlete_log_seq", "accepted_at", "decided_at", "sealing_transitions", "sealed"]);
const hmacHex = (key, text) => nodeCrypto.createHmac("sha256", String(key)).update(text, "utf8").digest("hex");
function signRecord(key, domain, record, signatureField) {
  const pre = {}; for (const k of Object.keys(record)) if (k !== signatureField && record[k] !== undefined) pre[k] = record[k];
  return hmacHex(key, domain + encode(pre));
}
const constantEqual = (a, b) => typeof a === "string" && typeof b === "string" && a.length === b.length && nodeCrypto.timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
function commitmentOf(op, identityKey) { const pre = {}; for (const k of Object.keys(op)) if (!AUTHORITY_METADATA.has(k)) pre[k] = op[k]; return hmacHex(identityKey, DOMAINS.op + encode(pre)); }
const signDisposition = (key, d) => ({ ...d, authority_signature: signRecord(key, DOMAINS.disposition, d, "authority_signature") });
const verifyDisposition = (key, d) => !!d && typeof d === "object" && constantEqual(d.authority_signature, signRecord(key, DOMAINS.disposition, d, "authority_signature"));
const signLease = (key, lease) => ({ ...lease, signature: signRecord(key, DOMAINS.lease, lease, "signature") });
const verifyLease = (key, lease) => !!lease && typeof lease === "object" && constantEqual(lease.signature, signRecord(key, DOMAINS.lease, lease, "signature"));
const effectDigest = (key, plan) => hmacHex(key, DOMAINS.effect + encode(plan));
const groupCommitment = (key, before) => hmacHex(key, DOMAINS.group + encode(before));
const basisOf = (key, domainId, maxima) => hmacHex(key, DOMAINS.basis + encode({ domain: domainId, maxima: maxima.slice().sort() }));
const membersCommitment = (key, members) => hmacHex(key, DOMAINS.members + encode(members));
const instanceId = (key, iss) => "inst-" + hmacHex(key, DOMAINS.instance + encode({ family: iss.proposal_family_id, generation: iss.evidence_generation, offer: iss.offer_digest })).slice(0, 16);
module.exports = { DOMAINS, AUTHORITY_METADATA, hmacHex, signRecord, commitmentOf, signDisposition, verifyDisposition, signLease, verifyLease, effectDigest, groupCommitment, basisOf, membersCommitment, instanceId };
