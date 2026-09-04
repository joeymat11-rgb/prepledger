"use strict";

function receipts(tx) { return tx.scan("log").map(r => r.value).sort((a, b) => a.seq - b.seq); }
function frontier(tx) {
  const available = new Set(receipts(tx).map(r => r.seq));
  let W = 0;
  while (available.has(W + 1)) W++;
  return W;
}
function exportSnapshot(tx, options = {}) {
  const W = frontier(tx), pending = options.outboxPending || 0;
  if (!Number.isSafeInteger(pending) || pending < 0) throw new TypeError("invalid pending count");
  const entries = receipts(tx).filter(r => r.seq <= W);
  return {
    W, partial: pending > 0, pending,
    label: pending > 0
      ? `Partial export — this device's watermark ${W}, ${pending} entr${pending === 1 ? "y" : "ies"} still pending`
      : `Complete through W${W} for all synced records`,
    rejectedAppendix: options.rejected || [],
    otherDeviceNote: "Entries still saved only on another device are not included. Sync that device first to include them.",
    records: entries.length, entries,
  };
}
module.exports = { receipts, frontier, exportSnapshot };
