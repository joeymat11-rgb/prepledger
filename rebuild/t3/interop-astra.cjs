"use strict";

const assert = require("node:assert/strict");
const { createAuthority, memoryBackend } = require("../authority/index.cjs");
const { signLease } = require("../authority/crypto.cjs");
const { localTransport } = require("../authority/transport.cjs");
const { createClient, ops: clientOps } = require("../client/index.cjs");

function issuanceEdges(config) {
  let edgeBackend;
  const make = () => { edgeBackend = memoryBackend(); return createAuthority({ ...config, backend: edgeBackend }); };
  const storedResult = () => edgeBackend.snapshot().find(([key]) => {
    const [athlete, table, id] = JSON.parse(key);
    return athlete === "first" && table === "applies" && id === "apply-1";
  })[1].result;
  const issuance = (a, id = "i", offer = "o") => ({ issuance_id: id, proposal_family_id: "family",
    evidence_generation: 1, offer_digest: offer, computed_through_watermark: a.frontier("first"),
    apply_members: [{ field: "protein_g", value: 160, provenance: "inherited" }] });
  const answer = (a, device, id, issued, outcome, parents = []) => a.admit("first", clientOps.build({
    op_id: id, athlete_id: "first", device_id: device, device_seq: 1, predecessor: null, parents,
    kind: "proposal-response", class: "plan", lease_id: "lease-" + device,
    effective: { local_date: "2026-09-04", local_time: "12:00", utc_offset: "-04:00" },
    payload: { issuance_id: issued, chosen_outcome_id: outcome, consent_digest: "consent" },
  }, config.identityKeys.first));
  let a = make();
  for (const [i, invalidW] of [999, NaN, -1].entries()) {
    const invalid = { ...issuance(a), issuance_id: "invalid-" + i, computed_through_watermark: invalidW };
    assert.deepEqual(a.issue("first", invalid), { accepted: false, reason_code: "INVALID_WATERMARK" });
    assert.equal(a.instanceOf("first", invalid.issuance_id), undefined);
  }
  let issued = a.issue("first", issuance(a));
  answer(a, "a", "r1", "i", "APPLY");
  const request = { apply_request_id: "apply-1", response_op_id: "r1" };
  const success = a.apply("first", request);
  assert.equal(success.status, "effective");
  assert.deepEqual(a.apply("first", request), success);
  assert.equal(issued.instance.length, "inst-".length + 64);
  answer(a, "b", "r2", "i", "NO");
  assert.equal(a.plan("first").protein_g, 150);
  assert.equal(a.apply("first", request).status, "conflict_suspended");
  assert.deepEqual(storedResult(), success);
  assert.equal(a.instanceState("first", issued.instance).status, "conflict_suspended");
  assert.equal(a.apply("first", { ...request, apply_request_id: "apply-2" }).status, "conflict_suspended");
  assert.equal(a.plan("first").protein_g, 150);

  a = make(); a.issue("first", issuance(a)); answer(a, "a", "r1", "i", "APPLY");
  a.apply("first", request);
  const put = edgeBackend.put;
  let failSuspension = true;
  edgeBackend.put = (key, value) => {
    if (failSuspension && JSON.parse(key)[1] === "suspensions") throw new Error("suspension write failed");
    return put(key, value);
  };
  assert.equal(answer(a, "b", "r2", "i", "NO").status, "UNAVAILABLE");
  assert.equal(a.frontier("first"), 1); assert.equal(a.plan("first").protein_g, 160);
  failSuspension = false;
  assert.equal(answer(a, "b", "r2", "i", "NO").status, "ACCEPTED");
  assert.equal(a.frontier("first"), 2); assert.equal(a.plan("first").protein_g, 150);

  a = make(); const original = issuance(a); a.issue("first", original);
  assert.equal(a.issue("first", { ...original, issuance_id: "alias", apply_members: [{ field: "protein_g", value: 900, provenance: "inherited" }] }).reason_code, "INSTANCE_COLLISION");
  const malformed = answer(a, "a", "r1", "i", "ARBITRARY");
  assert.equal(malformed.status, "REJECTED"); assert.equal(malformed.rejection_code, "MALFORMED");
  assert.equal(a.apply("first", request).reason_code, "UNKNOWN_RESPONSE");
  assert.equal(a.planTransactions("first").length, 0);

  a = make();
  const early = answer(a, "a", "r1", "later", "APPLY");
  assert.equal(early.status, "ACCEPTED"); assert.equal(early.reason_code, "UNKNOWN_ISSUANCE");
  issued = a.issue("first", issuance(a, "later"));
  assert.equal(a.apply("first", request).reason_code, "UNKNOWN_RESPONSE");
  assert.equal(a.planTransactions("first").length, 0);
  assert.equal(a.instanceState("first", issued.instance).responses.length, 0);
  assert.deepEqual(a.disposition("first", "a", 1), early);
  answer(a, "b", "r2", "later", "APPLY");
  assert.equal(a.apply("first", { apply_request_id: "apply-2", response_op_id: "r2" }).status, "effective");

  a = make(); a.issue("first", issuance(a));
  answer(a, "a", "r1", "i", "APPLY"); answer(a, "b", "r2", "i", "KEEP", ["r1"]);
  assert.equal(a.apply("first", { ...request, response_op_id: "r2" }).status, "decision_settled_no_effect");

  a = make(); issued = a.issue("first", issuance(a)); answer(a, "a", "r1", "i", "APPLY");
  const beforeSupersession = a.apply("first", request);
  a.confirmBasis("first", issued.instance, false);
  assert.equal(a.apply("first", request).status, "terminally_superseded");
  assert.deepEqual(storedResult(), beforeSupersession);

  a = make(); a.issue("first", issuance(a)); a.issue("first", issuance(a, "j", "other"));
  answer(a, "a", "r1", "i", "APPLY"); answer(a, "b", "r2", "j", "KEEP");
  assert.equal(a.apply("first", request).reason_code, "PAUSED_COVERAGE");
  return "PASS";
}

function run() {
  // Deliberately distinct, arbitrary keys: this rig imports no suite fixtures.
  const authorityKey = "interop-authority-astra", wrongKey = "interop-forged-authority";
  const identityKeys = { first: "interop-identity-first", second: "interop-identity-second" };
  const clock = { now: () => "2026-09-04T16:00:00Z", today: () => "2026-09-04", tz: "-04:00", monotonicMs: () => 1000 };
  const makeLease = (athlete, device, key = authorityKey) => signLease({
    lease_id: "lease-" + device, athlete_id: athlete, device_id: device, schema_version: 1,
    range: [1, 50], not_before: "2026-09-01T00:00:00Z", not_after: "2026-10-01T00:00:00Z",
    issued_server_time: "2026-09-01T00:00:00Z",
  }, key);
  const leases = { a: makeLease("first", "a"), b: makeLease("first", "b"), c: makeLease("second", "c"), forged: makeLease("first", "forged") };
  const backend = memoryBackend();
  const config = { authorityKey, identityKeys, clock, backend, athletes: {
    first: { plan: { protein_g: 150, steps: 8000 }, devices: { a: { lease: leases.a }, b: { lease: leases.b }, forged: { lease: leases.forged } } },
    second: { plan: { protein_g: 150, steps: 8000 }, devices: { c: { lease: leases.c } } },
  } };
  const authority = createAuthority(config);
  const client = (athleteId, deviceId, key = authorityKey, lease = leases[deviceId]) => {
    const result = createClient({ athleteId, deviceId, identityKey: identityKeys[athleteId], authorityKey: key,
      clock, lease, transport: localTransport(authority, athleteId) });
    result.boot(); return result;
  };
  const a = client("first", "a"), b = client("first", "b"), c = client("second", "c");
  function saveAndSync(device, lb, expectedW) {
    const action = device.weighIn({ lb });
    assert.equal(action.acknowledged, true);
    assert.equal(device.outboxRetained(), 1);
    device.syncOnce();
    assert.equal(device.outboxRetained(), 0);
    device.reduceThroughW();
    assert.equal(device.frontier(), expectedW);
    return action;
  }
  saveAndSync(a, 161, 1);
  saveAndSync(b, 162, 2);
  a.reduceThroughW(); assert.equal(a.frontier(), 2);
  saveAndSync(c, 190, 1);
  const firstRows = localTransport(authority, "first").pull(0).receipts;
  const secondRows = localTransport(authority, "second").pull(0).receipts;
  assert.equal(firstRows.length, 2); assert.equal(secondRows.length, 1);
  assert(firstRows.every(row => row.op.athlete_id === "first"));
  assert(secondRows.every(row => row.op.athlete_id === "second"));
  assert.equal(localTransport(authority, "first").pull(2).receipts.length, 0);
  const replay = localTransport(authority, "first").send(firstRows[0].op);
  assert.equal(replay.disposition.status, "ACCEPTED");
  assert.equal(authority.frontier("first"), 2);

  // A forged client trust key must not accept a real authority disposition.
  // Its local lease matches that key so an operation actually reaches send().
  const forged = client("first", "forged", wrongKey, makeLease("first", "forged", wrongKey));
  assert.equal(forged.weighIn({ lb: 163 }).acknowledged, true);
  forged.syncOnce();
  assert.equal(authority.disposition("first", "forged", 1).status, "ACCEPTED");
  assert.equal(forged.outboxRetained(), 1);
  assert.equal(forged.frontier(), 0);
  const reopened = createAuthority({ ...config, backend: memoryBackend(backend.snapshot()) });
  assert.equal(reopened.frontier("first"), 3);
  assert.equal(reopened.frontier("second"), 1);
  const summary = { status: "PASS", twoDevices: [a.frontier(), b.frontier()], secondAthlete: c.frontier(),
    acceptedWithForgedVerifier: authority.disposition("first", "forged", 1).status,
    forgedOutboxRetained: forged.outboxRetained(), replayAddedRows: 0, reopenedFrontiers: [reopened.frontier("first"), reopened.frontier("second")],
    issuanceEdges: issuanceEdges(config) };
  console.log("INTEROP " + JSON.stringify(summary));
  return summary;
}

if (require.main === module) run();
module.exports = { run };
