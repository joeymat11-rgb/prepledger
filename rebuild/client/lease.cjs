"use strict";
/* lease.cjs — the OFFLINE-WRITE LEASE (sheet A2, state 20).
   A lease is authority-signed: signature = HMAC(authority key, "earned/lease/v1" || canonical_encode(lease minus
   signature)). It authorizes this device to write, for this athlete, device_seq within [range[0], range[1]], between
   not_before and not_after by the local clock. Outside that — or with no lease, a forged lease, another device's lease —
   new writes are NOT acknowledged (state 20: "Never 'Saved' for an operation the authority could refuse"). */
const { signatureOver } = require("./ops.cjs");
const DOMAIN = "earned/lease/v1";

const parseTime = (iso) => { const t = Date.parse(iso); if (Number.isNaN(t)) throw new Error("lease: unparseable time " + iso); return t; };

function verifySignature(lease, authorityKey) {
  return !!lease && typeof lease.signature === "string" && lease.signature === signatureOver(authorityKey, DOMAIN, lease, "signature");
}

/* check(lease, { authorityKey, deviceId, athleteId, nowIso, nextSeq }) → { valid, reason, not_after } */
function check(lease, ctx) {
  if (!lease) return { valid: false, reason: "no lease", not_after: null };
  if (!verifySignature(lease, ctx.authorityKey)) return { valid: false, reason: "lease signature does not verify", not_after: lease.not_after || null };
  if (ctx.deviceId && lease.device_id !== ctx.deviceId) return { valid: false, reason: "lease issued to another device", not_after: lease.not_after };
  if (ctx.athleteId && lease.athlete_id && lease.athlete_id !== ctx.athleteId) return { valid: false, reason: "lease issued for another athlete", not_after: lease.not_after };
  const now = parseTime(ctx.nowIso);
  if (lease.not_before && now < parseTime(lease.not_before)) return { valid: false, reason: "lease not yet valid", not_after: lease.not_after };
  if (!lease.not_after || now > parseTime(lease.not_after)) return { valid: false, reason: "lease expired", not_after: lease.not_after || null, expired: true };
  if (Array.isArray(lease.range) && ctx.nextSeq != null && (ctx.nextSeq < lease.range[0] || ctx.nextSeq > lease.range[1])) return { valid: false, reason: "device_seq outside the authorized range", not_after: lease.not_after };
  return { valid: true, reason: null, not_after: lease.not_after, lease_id: lease.lease_id };
}

module.exports = { check, verifySignature, DOMAIN };
