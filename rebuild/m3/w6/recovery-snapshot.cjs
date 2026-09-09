"use strict";
// Closed historical projection. Cached machine output belongs in retained
// local history; no current instruction, basis or provenance follows from this.
function recoveredSnapshotFields(sourcePlan, reference) {
  return structuredClone({
    plan: sourcePlan.plan,
    planTransactionIds: sourcePlan.transactionIds,
    planTransactionSources: sourcePlan.transactionSources,
    planSuspendedTransactionIds: sourcePlan.suspendedTransactionIds,
    planVersion: null, planProvenance: null, planBasis: null,
    recoveryPlan: { profile: "earned/recovered-plan-snapshot/v1", reference, W: sourcePlan.W }
  });
}
module.exports = { recoveredSnapshotFields };
