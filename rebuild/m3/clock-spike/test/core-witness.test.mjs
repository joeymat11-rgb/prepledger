import test from "node:test";
import assert from "node:assert/strict";
import Client from "../../../client/index.cjs";
import Authority from "../../../authority/index.cjs";
import Crypto from "../../../authority/crypto.cjs";

// These RED WITNESS tests preserve observable gaps in the unchanged T2 core.
// Their passing assertions mean the gap was reproduced, not that C11 passed.
// All identities, keys, timestamps and entries below are invented. No suite,
// reference model, private fixture or alternate client implementation is used.
const AUTHORITY_KEY = "clock-spike-synthetic-authority";
const IDENTITY_KEY = "clock-spike-synthetic-identity";
const ATHLETE = "ath-clock-spike", DEVICE = "dev-clock-spike";
const CUTOFF = "2026-10-03T12:00:00.000Z";

function fixture(options = {}) {
  const time = { now: options.now || "2026-09-03T12:00:00.000Z", monotonic: 0 };
  const clock = {
    now: () => time.now, today: () => "2026-09-03", tz: "+00:00",
    monotonicMs: () => time.monotonic,
    // T3's committer supports these fields. T2 does not read them; that is the seam.
    highWater: options.highWater, continuityProven: options.continuityProven,
  };
  const lease = Crypto.signLease({
    lease_id: "clock-spike-synthetic-lease", athlete_id: ATHLETE, device_id: DEVICE,
    schema_version: 1, not_before: "2026-09-01T00:00:00.000Z", not_after: CUTOFF,
    range: options.range || [1, 100],
  }, AUTHORITY_KEY);
  const backend = Client.memoryBackend();
  const config = { deviceId: DEVICE, athleteId: ATHLETE, identityKey: IDENTITY_KEY,
    authorityKey: AUTHORITY_KEY, clock, lease, backend, online: false };
  const client = Client.createClient(config); client.boot();
  const authority = () => Authority.createAuthority({
    authorityKey: AUTHORITY_KEY, identityKeys: { [ATHLETE]: IDENTITY_KEY },
    // Receipt time is well after the capability's local write cutoff.
    clock: () => "2026-12-01T12:00:00.000Z",
    athletes: { [ATHLETE]: { devices: { [DEVICE]: { lease } } } },
  });
  return { time, backend, config, client, authority };
}
const write = (client, lb = 170) => client.weighIn({ date: "2026-09-03", lb });
const backendSnapshot = backend => Object.fromEntries(backend.collections().map(collection =>
  [collection, Object.fromEntries(backend.keys(collection).map(key => [key, backend.get(collection, key)]))]));

test("RED WITNESS: T2 wall rollback reopens an already expired lease", () => {
  const f = fixture({ now: "2026-10-03T12:00:00.001Z" });
  const expired = write(f.client);
  assert.equal(expired.acknowledged, false);
  assert.equal(expired.state, 20);
  f.time.now = "2026-10-03T11:59:59.999Z";
  f.time.monotonic += 3_600_000;
  assert.equal(write(f.client).acknowledged, true);
  // index.cjs:112 uses clock.now(); lease.cjs:24 does not remember expiry.
});

test("RED WITNESS: T2 restored boot ignores highWater and unproven continuity", () => {
  const f = fixture({ highWater: "2026-12-01T00:00:00.000Z", continuityProven: false });
  assert.equal(write(f.client).acknowledged, true);
  const rebooted = Client.createClient(f.config); rebooted.boot();
  assert.equal(write(rebooted, 171).acknowledged, true);
  assert.equal(f.backend.get("meta", "highWater"), undefined);
  // index.cjs:49–75 restores no clock record; 112 passes neither continuity nor highWater.
});

test("RED WITNESS: T2 total local erasure is treated as fresh and reuses sequence one", () => {
  const f = fixture(); const original = write(f.client);
  assert.equal(original.acknowledged, true);
  // A separate empty backend models all local collections lost, without deleting a file.
  const lost = Client.createClient({ ...f.config, backend: Client.memoryBackend() }); lost.boot();
  assert.equal(lost.model.integrity.fresh, true);
  assert.notEqual(lost.face().state, 18);
  const recreated = write(lost, 171);
  assert.equal(recreated.acknowledged, true);
  assert.equal(recreated.op_id, original.op_id);
  assert.equal(lost.store.get("ops", recreated.op_id).device_seq, 1);
  // store.cjs:83 treats absent checkpoint + absent rows as first boot.
});

test("RED WITNESS: T2 coherent old restore acknowledges a slot that T3 rejects as a collision", () => {
  const f = fixture(), authority = f.authority();
  const first = write(f.client);
  assert.equal(authority.admit(ATHLETE, f.backend.get("ops", first.op_id)).status, "ACCEPTED");
  const old = backendSnapshot(f.backend);
  const second = write(f.client, 171);
  assert.equal(authority.admit(ATHLETE, f.backend.get("ops", second.op_id)).status, "ACCEPTED");
  const restored = Client.createClient({ ...f.config, backend: Client.memoryBackend(old) }); restored.boot();
  assert.equal(restored.model.integrity.intact, true);
  const replacement = write(restored, 172);
  assert.equal(replacement.acknowledged, true);
  assert.equal(replacement.op_id, second.op_id);
  const disposition = authority.admit(ATHLETE, restored.store.get("ops", replacement.op_id));
  assert.equal(disposition.status, "REJECTED");
  assert.equal(disposition.rejection_code, "IDENTITY_COLLISION");
  // index.cjs:55 derives the next slot entirely from the rolled-back local image.
});

test("RED WITNESS: T2 exhaustion refuses in state20 while its governing face stays state1", () => {
  const f = fixture({ range: [1, 1] });
  assert.equal(write(f.client).acknowledged, true); // last authorized slot
  const firstInvalid = write(f.client, 171);
  assert.equal(firstInvalid.acknowledged, false);
  assert.equal(firstInvalid.state, 20);
  assert.equal(f.client.model.fields.weighIn, 171);
  assert.equal(f.backend.keys("ops").length, 1);
  assert.equal(f.backend.get("meta", "device").seq, 1);
  assert.equal(f.client.face().state, 1);
  // commitBatch checks first/last sequence (index.cjs:136–138); face's leaseNow
  // binding at129 omits the next sequence, so face.cjs:25 cannot see exhaustion.
});

test("CONTROL: actual T3 admits a valid-cutoff operation arriving after expiry and replays once", () => {
  const f = fixture({ now: CUTOFF }), saved = write(f.client), authority = f.authority();
  assert.equal(saved.acknowledged, true); // cutoff itself is valid; only > cutoff is invalid
  const operation = f.backend.get("ops", saved.op_id);
  const disposition = authority.admit(ATHLETE, operation);
  assert.equal(disposition.status, "ACCEPTED");
  assert.ok(Date.parse(disposition.decided_at) > Date.parse(CUTOFF));
  assert.deepEqual(authority.admit(ATHLETE, operation), disposition);
  assert.equal(authority.log(ATHLETE).length, 1);
});

test("CONTROL: actual T3 declared revocation preserves its accepted barrier and rejects beyond it", () => {
  const f = fixture(), authority = f.authority();
  const first = write(f.client), firstOperation = f.backend.get("ops", first.op_id);
  const accepted = authority.admit(ATHLETE, firstOperation);
  assert.equal(accepted.status, "ACCEPTED");
  const unsynced = write(f.client, 171), unsyncedOperation = f.backend.get("ops", unsynced.op_id);
  assert.equal(unsynced.acknowledged, true);
  const revocation = authority.revokeDevice(ATHLETE, DEVICE);
  assert.equal(revocation.barrier, 1);
  assert.equal(revocation.declared_loss, true);
  assert.match(revocation.copy, /unsynced entries.*lost/);
  const rejected = authority.admit(ATHLETE, unsyncedOperation);
  assert.equal(rejected.status, "REJECTED");
  assert.equal(rejected.rejection_code, "LEASE_REVOKED_BEYOND_BARRIER");
  assert.deepEqual(authority.admit(ATHLETE, firstOperation), accepted);
  assert.equal(authority.log(ATHLETE).length, 1);
});
