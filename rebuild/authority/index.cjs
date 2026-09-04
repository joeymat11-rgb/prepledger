"use strict";
const { Store, memoryBackend } = require("./store.cjs");
const { makeAdmission } = require("./admit.cjs");
const crypto = require("./crypto.cjs"), plan = require("./plan.cjs"), issue = require("./issue.cjs"), reduce = require("./reduce.cjs");
const { createLocalCommitter } = require("./committer.cjs");

function createAuthority(config) {
  if (!config || !config.authorityKey || !config.clock) throw new TypeError("authorityKey and clock are required");
  const store = config.store || new Store(config.backend || memoryBackend());
  const now = typeof config.clock === "function" ? config.clock : () => config.clock.now();
  const identityKey = athlete => {
    const keys = config.identityKeys;
    const key = typeof keys === "function" ? keys(athlete) : keys && keys[athlete];
    if (key == null) throw new Error("identity key unavailable");
    return key;
  };
  const athleteIds = Object.keys(config.athletes || {});
  for (const athlete of athleteIds) {
    const setup = config.athletes[athlete];
    const r = store.transaction(athlete, tx => {
      if (!tx.get("metadata", "state")) tx.insert("metadata", "state", {
        seq: 0, devices: setup.devices || {}, initialPlan: { ...setup.plan },
      });
    });
    if (!r.ok) throw r.error;
  }
  const read = (athlete, fn) => {
    if (!athleteIds.includes(athlete)) throw new Error("unknown athlete");
    return store.read(athlete, fn);
  };
  const write = (athlete, fn) => {
    if (!athleteIds.includes(athlete)) throw new Error("unknown athlete");
    const r = store.transaction(athlete, fn);
    return r.ok ? r.value : { status: "UNAVAILABLE", retry: true };
  };
  const api = {
    admit: makeAdmission({ store, authorityKey: config.authorityKey, identityKey, now, athleteIds }),
    log: athlete => read(athlete, tx => reduce.receipts(tx).map(r => r.op)),
    receipts: (athlete, W = 0) => read(athlete, tx => reduce.receipts(tx).filter(r => r.seq > W)),
    frontier: athlete => read(athlete, reduce.frontier),
    disposition: (athlete, device, seq) => read(athlete, tx => {
      const slot = tx.get("slots", JSON.stringify([device, seq]));
      return slot && tx.get("operations", slot.op_id).disposition;
    }),
    dispositionHistory: (athlete, device, seq) => read(athlete, tx => {
      const slot = tx.get("slots", JSON.stringify([device, seq]));
      if (!slot) return [];
      const count = tx.get("operations", slot.op_id).historyCount;
      return Array.from({ length: count }, (_, i) => tx.get("history", JSON.stringify([slot.op_id, i + 1])));
    }),
    verifyDisposition: d => crypto.verifyDisposition(d, config.authorityKey),
    revokeDevice: (athlete, device) => write(athlete, tx => {
      if (!tx.get("metadata", "state").devices[device]) throw new Error("unknown device");
      const existing = tx.get("revocations", device);
      if (existing) return existing;
      const record = { barrier: (tx.get("lastAccepted", device) || {}).seq || 0, declared_loss: true,
        copy: "This phone was removed from your account — unsynced entries on this phone will be lost." };
      tx.insert("revocations", device, record); return record;
    }),
    localCommitter: (lease, clock) => createLocalCommitter(lease, clock, config.authorityKey),
    exportSnapshot: (athlete, options) => read(athlete, tx => reduce.exportSnapshot(tx, options)),
  };
  for (const name of ["plan", "planTransactions", "planState", "planOfDomain", "txnDigests"])
    api[name] = (athlete, ...args) => read(athlete, tx => plan[name](tx, ...args));
  for (const name of ["issue", "apply", "confirmBasis"])
    api[name] = (athlete, ...args) => write(athlete, tx => issue[name](tx, ...args));
  for (const name of ["instanceOf", "instanceState"])
    api[name] = (athlete, ...args) => read(athlete, tx => issue[name](tx, ...args));
  return api;
}
module.exports = { createAuthority, Store, memoryBackend };
