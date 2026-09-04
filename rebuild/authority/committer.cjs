"use strict";
const { verifyLease, verifyServerTime } = require("./crypto.cjs");

const instant = value => typeof value === "number" ? value : typeof value === "string" ? Date.parse(value) : NaN;
const refused = reason => ({ saved: false, state: 20, reason });

// Local capability validation. The client still owns its durable operation +
// outbox transaction. Persist snapshot() alongside that transaction so reboot
// can supply highWater, or call restore({proven:false}) when continuity is lost.
function createLocalCommitter(inputLease, clock = {}, authorityKey) {
  const lease = inputLease && { ...inputLease, range: Array.isArray(inputLease.range) ? inputLease.range.slice() : inputLease.range };
  const readClock = typeof clock.now === "function" ? () => clock.now() : null;
  let mono = instant(clock.mono ?? (readClock ? readClock() : clock.highWater));
  let highWater = Math.max(mono, instant(clock.highWater ?? mono));
  let continuous = clock.continuityProven !== false;
  const device = clock.device_id ?? (lease && lease.device_id);
  const athlete = clock.athlete_id ?? (lease && lease.athlete_id);
  const schema = clock.schema_version ?? 1;
  const accepted = [];

  function observe(value) {
    const time = instant(value);
    if (!Number.isFinite(time)) { continuous = false; return false; }
    mono = time;
    highWater = Number.isFinite(highWater) ? Math.max(highWater, time) : time;
    return true;
  }

  return {
    advance: observe,
    // Even a caller that labels a forward jump "rollback" cannot hide it.
    rollback: observe,
    restore: state => { continuous = !!(state && state.proven); },
    syncedServerTime: record => {
      if (!verifyServerTime(record, authorityKey) || !Number.isFinite(instant(record.server_time))) return { confirmed: false };
      if ((record.device_id !== undefined && record.device_id !== device) ||
          (record.athlete_id !== undefined && record.athlete_id !== athlete)) return { confirmed: false };
      observe(record.server_time);
      continuous = true;
      return { confirmed: true };
    },
    snapshot: () => ({ mono, highWater, continuityProven: continuous, device_id: device, athlete_id: athlete, schema_version: schema }),
    saved: () => accepted.slice(),
    commitLocal: operation => {
      if (readClock) observe(readClock());
      if (!verifyLease(lease, authorityKey)) return refused("no valid lease (signature)");
      if (!operation || lease.device_id !== device || lease.device_id !== operation.device_id ||
          lease.athlete_id !== athlete || lease.athlete_id !== operation.athlete_id || lease.lease_id !== operation.lease_id)
        return refused("lease not bound to this device/athlete/op");
      if (lease.schema_version !== schema || operation.schema_version !== schema) return refused("schema lease mismatch — update Earned");
      if (!continuous || !Number.isFinite(highWater)) return refused("clock continuity unproven");
      const start = instant(lease.not_before), end = instant(lease.not_after);
      if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) return refused("invalid lease time window");
      if (highWater < start) return refused("before not_before");
      if (highWater > end) return refused("expired");
      if (!Array.isArray(lease.range) || lease.range.length !== 2 || !lease.range.every(Number.isSafeInteger) ||
          lease.range[0] < 1 || lease.range[1] < lease.range[0] || !Number.isSafeInteger(operation.device_seq) ||
          operation.device_seq < lease.range[0] || operation.device_seq > lease.range[1]) return refused("range exhausted");
      accepted.push(operation.op_id);
      return { saved: true };
    },
  };
}

module.exports = { createLocalCommitter };
