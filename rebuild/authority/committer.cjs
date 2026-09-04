"use strict";
/* committer.cjs — the LOCAL COMMITTER (state 20): the client-side validator the authority hands out with a lease.
   A device may durably commit an operation under its lease only while every check passes:
     signature   the lease was signed by the authority key
     binding     lease.device_id === this device === op.device_id; lease.athlete_id === this athlete === op.athlete_id;
                 lease.lease_id === op.lease_id
     schema      lease.schema_version === the device's schema version ("update Earned" otherwise)
     continuity  after a restore/reboot clock continuity is unproven until a signed server time arrives
     time        not_before ≤ now ≤ not_after by a MONOTONIC HIGH-WATER clock: advance() raises it, rollback() never
                 lowers it, so a clock set backwards cannot revive an expired lease
     range       device_seq inside lease.range
   The committer holds no authority state and touches no store: it is pure logic over the lease and the clock facts. */
const crypto = require("./crypto.cjs");
function createLocalCommitter(o) {
  const opts = o || {}; const lease = opts.lease; if (!lease || typeof lease !== "object") throw new Error("createLocalCommitter: a lease");
  if (!opts.authorityKey) throw new Error("createLocalCommitter: the authority key the lease was signed with");
  const start = opts.mono || opts.now || "1970-01-01T00:00:00Z";
  const c = { mono: start, highWater: opts.highWater && opts.highWater > start ? opts.highWater : start, serverTime: opts.serverTime || null, continuityProven: opts.continuityProven !== false, device: opts.device_id || lease.device_id, athlete: opts.athlete_id || lease.athlete_id, schema: opts.schema_version == null ? 1 : opts.schema_version };
  const saved = [];
  const refuse = (reason) => ({ saved: false, state: 20, reason });
  return {
    advance(t) { c.mono = t; if (t > c.highWater) c.highWater = t; },
    rollback(t) { c.mono = t; },   /* the high-water mark stays */
    restore(r) { c.continuityProven = !!(r && r.proven); },
    syncedServerTime(t) { c.serverTime = t; if (t > c.highWater) c.highWater = t; c.continuityProven = true; },
    commitLocal(op) {
      const now = c.highWater;
      if (!crypto.verifyLease(opts.authorityKey, lease)) return refuse("no valid lease (signature)");
      if (lease.device_id !== c.device || lease.device_id !== op.device_id || lease.athlete_id !== c.athlete || lease.athlete_id !== op.athlete_id || lease.lease_id !== op.lease_id) return refuse("lease not bound to this device/athlete/op");
      if (lease.schema_version !== c.schema) return refuse("schema lease mismatch — update Earned");
      if (!c.continuityProven) return refuse("clock continuity unproven — waiting for a signed server time");
      if (now < lease.not_before) return refuse("before not_before");
      if (now > lease.not_after) return refuse("expired");
      if (!Array.isArray(lease.range) || op.device_seq < lease.range[0] || op.device_seq > lease.range[1]) return refuse("range exhausted");
      saved.push(op.op_id); return { saved: true };
    },
    saved: () => saved.slice(),
    facts: () => ({ ...c }),
  };
}
module.exports = { createLocalCommitter };
