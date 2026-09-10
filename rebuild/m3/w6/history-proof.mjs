import W5 from "../w5/public-client.cjs";

const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const PROFILE = "earned/challenge-head/v1";

// Historical authentication only. This never reconstructs a pending challenge,
// asserts freshness, moves a frontier or grants permission to issue a question.
export async function verifyHistoricalHead(verifier, record, athleteId, deviceId) {
  if (!object(record) || typeof verifier.verifyCurrentHead !== "function" ||
      record.history_profile !== PROFILE || record.wire_version !== W5.WIRE_VERSION ||
      record.athlete_id !== athleteId || record.device_id !== deviceId ||
      W5.decodeSignature(record.authority_signature)?.kid !== record.key_epoch ||
      typeof record.challenge !== "string" || !/^[A-Za-z0-9_-]{42}[AEIMQUYcgkosw048]$/.test(record.challenge) ||
      !Number.isSafeInteger(record.after) || record.after < 0 ||
      !Number.isSafeInteger(record.head) || record.head < record.after || record.through !== record.head ||
      !Array.isArray(record.receipts) || record.receipts.length !== record.head - record.after ||
      !await verifier.verifyCurrentHead(record)) return false;
  const identities = new Set();
  for (const [index, receipt] of record.receipts.entries()) {
    if (!object(receipt) || receipt.seq !== record.after + index + 1 || !object(receipt.op) ||
        receipt.op.athlete_id !== athleteId || typeof receipt.op_id !== "string" ||
        receipt.op_id !== receipt.op.op_id || identities.has(receipt.op_id) ||
        typeof receipt.canonical_content_commitment !== "string" ||
        receipt.canonical_content_commitment !== receipt.op.canonical_content_commitment ||
        !await verifier.verifyReceipt(receipt)) return false;
    identities.add(receipt.op_id);
  }
  return true;
}

// Compare original typed content; canonical normalization could hide different
// recorded strings. Property insertion order alone is not a different operation.
export function sameRecordedValue(a, b) {
  if (Object.is(a, b)) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object" || Array.isArray(a) !== Array.isArray(b)) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every(key => Object.hasOwn(b, key) && sameRecordedValue(a[key], b[key]));
}
