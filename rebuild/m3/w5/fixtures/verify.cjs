"use strict";

// Synthetic vectors only. Every cryptographic keypair is generated for this
// invocation and remains in memory; the tracked JSON contains no key material.
const assert = require("node:assert/strict");
const { webcrypto } = require("node:crypto");
const crypto = require("../crypto.cjs");
const browser = require("../public-client.cjs");
const original = require("../../../authority/crypto.cjs");
const fixtures = require("./contract-v1.json");

async function run() {
  assert.equal(crypto.PROFILE, fixtures.profile);
  assert.deepEqual(crypto.DOMAINS, fixtures.domains);
  for (const vector of fixtures.canonicalVectors) {
    const nativeBytes = crypto.canonicalBytes(vector.record, vector.domain, vector.field);
    const webBytes = browser.canonicalBytes(vector.record, vector.domain, vector.field);
    assert.equal(nativeBytes.toString("utf8"), vector.canonicalText);
    assert.equal(nativeBytes.toString("hex"), vector.utf8Hex);
    assert.deepEqual(Buffer.from(webBytes), nativeBytes);
  }
  for (const vector of fixtures.encodingVectors) {
    assert.equal(Buffer.from(vector.rawHex, "hex").toString("base64url"), vector.signature.split(".")[2]);
    assert.equal(crypto.parseSignature(vector.signature, vector.kid).toString("hex"), vector.rawHex);
    assert.equal(Buffer.from(browser.decodeSignature(vector.signature).raw).toString("hex"), vector.rawHex);
  }
  const signingKey = crypto.generateSigningKey("run-epoch-1"), other = crypto.generateSigningKey("run-epoch-2");
  const publicKey = crypto.publicKeyOf(signingKey), foreignPublic = crypto.publicKeyOf(other);
  assert(!("privateKey" in publicKey)); assert(!("d" in publicKey.publicKey));
  assert.deepEqual(publicKey.publicKey.key_ops, ["verify"]);
  assert.throws(() => browser.createPublicVerifier({ keys: [signingKey], subtle: webcrypto.subtle }));
  assert.throws(() => browser.createPublicVerifier({ keys: [publicKey, publicKey], subtle: webcrypto.subtle }));
  const verifier = browser.createPublicVerifier({ keys: [publicKey], subtle: webcrypto.subtle });
  const wrong = browser.createPublicVerifier({ keys: [foreignPublic], subtle: webcrypto.subtle });
  for (const kind of Object.keys(crypto.DOMAINS)) {
    const suffix = kind[0].toUpperCase() + kind.slice(1), field = kind === "lease" ? "signature" : "authority_signature";
    const record = crypto["sign" + suffix]({ n: 3, text: "Café", causal_parents: ["b", "a", "b"] }, signingKey);
    assert.equal(crypto["verify" + suffix](record, publicKey), true);
    assert.equal(await verifier["verify" + suffix](record), true);
    assert.equal(await wrong["verify" + suffix](record), false);
    assert.equal(await verifier["verify" + suffix]({ ...record, n: 4 }), false);
    assert.equal(crypto["verify" + suffix]({ ...record, [field]: record[field] + "=" }, publicKey), false);
    assert.equal(await verifier["verify" + suffix]({ ...record, [field]: record[field].replace("ES256", "HS256") }), false);
    const raw = crypto.parseSignature(record[field], signingKey.kid);
    const order = BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551");
    const s = BigInt("0x" + raw.subarray(32).toString("hex"));
    Buffer.from((order - s).toString(16).padStart(64, "0"), "hex").copy(raw, 32);
    const high = { ...record, [field]: "ES256." + signingKey.kid + "." + raw.toString("base64url") };
    assert.equal(crypto["verify" + suffix](high, publicKey), false);
    assert.equal(await verifier["verify" + suffix](high), false);
    for (const otherKind of Object.keys(crypto.DOMAINS).filter(k => k !== kind))
      assert.equal(await verifier.verifyRecord(record, crypto.DOMAINS[otherKind], field), false);
  }
  const operation = { athlete_id: "athlete-a", device_id: "phone-a", device_seq: 1, op_id: "op-a",
    payload: { lb: { value: 165.5, unit: "lb" } }, causal_parents: ["b", "a", "a"], text: "Cafe\u0301" };
  operation.canonical_content_commitment = crypto.commitmentOf(operation, "synthetic-identity-contract");
  assert.equal(operation.canonical_content_commitment, original.commitmentOf(operation, "synthetic-identity-contract"));
  assert.equal(crypto.commitmentOf({ ...operation, authority_signature: "metadata", accepted_at: "metadata" }, "synthetic-identity-contract"),
    operation.canonical_content_commitment);
  let mono = 5000;
  const calls = [];
  const client = Object.fromEntries(["deliverDisposition", "deliverReceipts", "receiveSnapshot", "receiveLease", "syncedServerTime"]
    .map(name => [name, record => { calls.push({ name, record }); return { stored: true }; }]));
  const boundary = browser.createPublicBoundary({ keys: [publicKey], athleteId: "athlete-a", deviceId: "phone-a", client,
    subtle: webcrypto.subtle, crypto: webcrypto, monotonicMs: () => mono, maxTimeRoundTripMs: 1000 });
  const disposition = crypto.signDisposition({ op_id: operation.op_id, device_id: "phone-a", device_seq: 1,
    canonical_content_commitment: operation.canonical_content_commitment, status: "ACCEPTED", athlete_log_seq: 1 }, signingKey);
  const receipt = crypto.signReceipt({ seq: 1, op_id: operation.op_id,
    canonical_content_commitment: operation.canonical_content_commitment, accepted_at: "2026-09-03T12:00:00Z", op: operation }, signingKey);
  const wire = { wire_version: browser.WIRE_VERSION, key_epoch: signingKey.kid };
  const pull = crypto.signPull({ ...wire, athlete_id: "athlete-a", device_id: "phone-a", after: 0, through: 1, receipts: [receipt] }, signingKey);
  const snapshot = crypto.signSnapshot({ ...wire, athlete_id: "athlete-a", device_id: "phone-a", W: 1, records: 1, entries: [receipt] }, signingKey);
  const lease = crypto.signLease({ athlete_id: "athlete-a", device_id: "phone-a", lease_id: "lease-a", schema_version: 1,
    range: [1, 5], not_before: "2026-09-01T00:00:00Z", not_after: "2026-10-01T00:00:00Z" }, signingKey);
  assert.equal((await boundary.acceptDisposition(disposition, operation)).accepted, true);
  assert.equal((await boundary.acceptPull(pull)).accepted, true);
  assert.equal((await boundary.acceptSnapshot(snapshot, 1)).accepted, true);
  assert.equal((await boundary.acceptLease(lease)).accepted, true);
  const challenge = boundary.beginTimeChallenge();
  const time = crypto.signServerTime({ ...wire, time_profile: browser.TIME_PROFILE, athlete_id: "athlete-a", device_id: "phone-a",
    ...challenge, server_time: "2026-09-03T12:00:00Z" }, signingKey);
  assert.equal((await boundary.acceptServerTime(time)).accepted, true);
  const count = calls.length;
  assert.equal(count, 5);
  assert.equal((await boundary.acceptServerTime(time)).accepted, false);
  assert.equal((await boundary.acceptDisposition({ ...disposition, authority_signature: undefined }, operation)).accepted, false);
  assert.equal((await boundary.acceptDisposition(disposition, { ...operation, device_seq: 2 })).accepted, false);
  assert.equal((await boundary.acceptDisposition(disposition, { ...operation, athlete_id: "foreign" })).accepted, false);
  assert.equal((await boundary.acceptPull({ ...pull, through: 2 })).accepted, false);
  assert.equal((await boundary.acceptPull(crypto.signPull({ ...pull, through: 2 }, signingKey))).accepted, false);
  assert.equal((await boundary.acceptPull(crypto.signPull({ ...pull, receipts: [{ ...receipt, authority_signature: undefined }] }, signingKey))).accepted, false);
  assert.equal((await boundary.acceptPull(crypto.signPull({ ...pull, athlete_id: "foreign" }, signingKey))).accepted, false);
  assert.equal((await boundary.acceptSnapshot(snapshot, 0)).accepted, false);
  assert.equal((await boundary.acceptSnapshot(crypto.signSnapshot({ ...snapshot, records: 2 }, signingKey))).accepted, false);
  assert.equal((await boundary.acceptLease({ ...lease, signature: undefined })).accepted, false);
  assert.equal((await boundary.acceptLease(crypto.signLease({ ...lease, device_id: "foreign" }, signingKey))).accepted, false);
  assert.equal((await boundary.acceptLease(crypto.signLease({ ...lease, schema_version: 2 }, signingKey))).accepted, false);
  assert.equal((await boundary.acceptLease(crypto.signLease({ ...lease, not_after: "2026-10-01" }, signingKey))).accepted, false);
  assert.equal((await boundary.acceptPull(crypto.signPull({ ...pull, key_epoch: "different" }, signingKey))).accepted, false);
  assert.equal((await boundary.acceptPull(crypto.signPull({ ...pull, wire_version: "future-wire" }, signingKey))).accepted, false);
  const versionChallenge = boundary.beginTimeChallenge();
  for (const overrides of [{ wire_version: "future-wire" }, { time_profile: "future-time" }, { key_epoch: "different" },
    { server_time: "2026-09-03" }, { server_time: "2026-02-30T12:00:00Z" }])
    assert.equal((await boundary.acceptServerTime(crypto.signServerTime({ ...time, ...versionChallenge, ...overrides }, signingKey))).accepted, false);
  const expiredChallenge = boundary.beginTimeChallenge();
  const expiredTime = crypto.signServerTime({ ...time, ...expiredChallenge }, signingKey);
  mono += 1001;
  assert.equal((await boundary.acceptServerTime(expiredTime)).accepted, false);
  const rollbackChallenge = boundary.beginTimeChallenge();
  mono -= 1;
  assert.equal((await boundary.acceptServerTime(crypto.signServerTime({ ...time, ...rollbackChallenge }, signingKey))).accepted, false);
  assert.equal(calls.length, count);
  const lateMutation = JSON.parse(JSON.stringify(pull));
  const verified = boundary.acceptPull(lateMutation);
  lateMutation.receipts[0].op.payload.lb.value = 999;
  assert.equal((await verified).accepted, true);
  assert.equal(calls.at(-1).record[0].op.payload.lb.value, 165.5);
  const storageFailure = browser.createPublicBoundary({ keys: [publicKey], athleteId: "athlete-a", deviceId: "phone-a",
    client: { deliverDisposition: () => ({ stored: false }) }, subtle: webcrypto.subtle, crypto: webcrypto });
  const refused = await storageFailure.acceptDisposition(disposition, operation);
  assert.equal(refused.accepted, false); assert.equal(refused.verified, true); assert.equal(refused.state, 3);
  const missingSink = browser.createPublicBoundary({ keys: [publicKey], athleteId: "athlete-a", deviceId: "phone-a", subtle: webcrypto.subtle });
  assert.equal((await missingSink.acceptPull(pull)).accepted, false);
  let timeCommits = 0;
  const timeOptions = { keys: [publicKey], athleteId: "athlete-a", deviceId: "phone-a", subtle: webcrypto.subtle,
    crypto: webcrypto, monotonicMs: () => mono, maxTimeRoundTripMs: 1000,
    client: { syncedServerTime: () => { timeCommits++; return { confirmed: true }; } } };
  const timeBoundary = browser.createPublicBoundary(timeOptions);
  const firstChallenge = timeBoundary.beginTimeChallenge(), secondChallenge = timeBoundary.beginTimeChallenge();
  assert.notEqual(firstChallenge.challenge, secondChallenge.challenge);
  assert.equal((await timeBoundary.acceptServerTime(crypto.signServerTime({ ...time, ...firstChallenge }, signingKey))).accepted, false);
  const finalValidTime = crypto.signServerTime({ ...time, ...secondChallenge }, signingKey);
  mono += 1000;
  const simultaneous = await Promise.all([timeBoundary.acceptServerTime(finalValidTime), timeBoundary.acceptServerTime(finalValidTime)]);
  assert.equal(simultaneous.filter(r => r.accepted).length, 1);
  assert.equal(timeCommits, 1);
  const newExecution = browser.createPublicBoundary(timeOptions);
  assert.equal((await newExecution.acceptServerTime(finalValidTime)).accepted, false);
  assert.equal(timeCommits, 1);
  const line = "PUBLIC-CRYPTO PASS (6 signed domains; Node/WebCrypto; canonical/encoding vectors; scope/time/durability refusals)";
  console.log(line);
  return line;
}
if (require.main === module) run().catch(error => { console.error("PUBLIC-CRYPTO FAIL " + error.message); process.exitCode = 1; });
module.exports = { run };
