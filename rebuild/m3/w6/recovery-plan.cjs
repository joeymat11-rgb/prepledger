"use strict";
// Read-only projection of verified staged source rows, using the accepted
// authority's actual reader. No admission, consent, local folding or activation.
const { canonicalEncode } = require("../../authority/canonical.cjs");
const { createHmac } = require("./node-sha256-browser.mjs");
// Public fixed labels used by the existing plan reader, not authority signing
// keys. The existing browser crypto implementation also serves T2 operations.
const hmac = (key, text) => createHmac("sha256", String(key)).update(text, "utf8").digest("hex");
const Plan = require("./recovery-plan-reader.cjs")({ hmac, canonicalEncode });

async function projectRecoveryPlan({ initialPlan, each, assertStable, W }) {
  await assertStable();
  // Retain only plan graph inputs, never the full operation/history payloads.
  // This is not a constant-memory claim; supported phone capacity is still a gate.
  const transactions = [], suspensions = new Map();
  await each("transactions", (key, value) => transactions.push({ key, value }));
  await each("suspensions", (key, value) => suspensions.set(key, value));
  await assertStable();
  const tx = Object.freeze({
    scan(collection) {
      if (collection !== "transactions") throw Error("RECOVERY_PLAN_UNEXPECTED_SCAN");
      return transactions;
    },
    get(collection, key) {
      if (collection === "metadata" && key === "state") return { initialPlan };
      if (collection === "suspensions") return suspensions.get(key);
      throw Error("RECOVERY_PLAN_UNEXPECTED_READ");
    }
  });
  const domains = [...new Set(transactions.map(row => row.value.domain))].sort();
  const ordered = Plan.planTransactions(tx);
  const result = {
    profile: "earned/recovered-source-plan/v1", W,
    plan: Plan.plan(tx),
    domains: Object.fromEntries(domains.map(domain => [domain, Plan.planState(tx, domain)])),
    // IDs identify actual admitted effects; an accepted no-effect selection has
    // no transaction and must never appear here just because it was receipted.
    transactionIds: ordered.map(row => row.txn_id),
    transactionSources: ordered.map(row => ({ txn_id: row.txn_id, op_id: row.op_id })),
    suspendedTransactionIds: [...suspensions.keys()].sort()
  };
  await assertStable();
  return structuredClone(result);
}

module.exports = { projectRecoveryPlan };
