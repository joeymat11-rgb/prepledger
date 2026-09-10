import Canonical from "../../authority/canonical.cjs";
const bytes = value => Canonical.canonicalEncode(value);
// Internal trusted verifier result, never a persisted flag or a wire-exposed API.
export function createCandidateGrant({ lease, disposition = null, expectedOperation = null, scope, isCurrent }) {
  const boundScope = bytes(structuredClone(scope)), leaseBytes = bytes(structuredClone(lease));
  const dispositionBytes = disposition === null ? null : bytes(structuredClone(disposition));
  const opBytes = expectedOperation === null ? null : bytes(structuredClone(expectedOperation));
  let alive = true;
  const matches = (record, encoded) => { try { return alive && isCurrent() === true && encoded !== null && bytes(record) === encoded; } catch { return false; } };
  return Object.freeze({
    verifyLease: record => matches(record, leaseBytes),
    verifyDisposition: (record, op) => matches(record, dispositionBytes) && matches(op, opBytes),
    matchesScope: current => matches(current, boundScope),
    retire() { alive = false; },
  });
}
