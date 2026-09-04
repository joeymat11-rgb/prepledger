"use strict";
const { createAuthority, memoryBackend } = require("../../authority/index.cjs");
const { copy } = require("../../authority/store.cjs");
const { signLease, verifyLease, signServerTime } = require("../../authority/crypto.cjs");
const { AUTH_KEY, K_IDENTITY } = require("../lib/ops.cjs");

function create(cfg = {}, hooks) {
  const athletes = copy(cfg.athletes || {});
  // ATH() gives the second athlete a correctly signed lease for the first.
  // Normalize that fixture here; product capability binding stays strict.
  for (const [athlete, setup] of Object.entries(athletes)) {
    setup.plan = { protein_g: 150, steps: 8000, ...setup.plan };
    for (const device of Object.values(setup.devices || {})) {
      if (verifyLease(device.lease, AUTH_KEY) && device.lease.athlete_id !== athlete)
        device.lease = signLease({ ...device.lease, athlete_id: athlete }, AUTH_KEY);
    }
  }
  const backend = memoryBackend();
  let fault = null;
  const failingBackend = {
    ...backend,
    put(key, value) {
      const [, table] = JSON.parse(key);
      if (table === "transactions" && (
        fault === "between-admission-and-plan-transaction" && value.kind === "plan-mutation" ||
        fault === "between-admission-and-selection-commit" && value.kind === "conflict-selection"
      )) throw new Error("storage write interrupted");
      backend.put(key, value);
    },
  };
  const authority = createAuthority({
    athletes, authorityKey: AUTH_KEY, identityKeys: () => K_IDENTITY,
    backend: failingBackend, clock: { now: () => "2026-09-03T00:00:00Z" },
  });
  const local = authority.localCommitter;
  return {
    ...authority,
    injectCrash(point) { fault = point; },
    clearCrash() { fault = null; },
    localCommitter(lease, clock = {}) {
      const committer = local(lease, { mono: "2026-09-03T00:00:00Z", ...clock });
      return { ...committer, syncedServerTime(time) {
        return committer.syncedServerTime(signServerTime({ server_time: time }, AUTH_KEY));
      } };
    },
  };
}
module.exports = { create };
