"use strict";
/* reason-on-disk.test.cjs: P6, the engine's reason and proposal body ON DISK with the
   consent (rebuild/slice/P6-REASON-ON-DISK-BRIEF.md, DECISIONS:117 (3)).
   Self-contained: no reference to rebuild/conform, matching this module's own "loads on
   its own" claim (README.md). The lease is signed here with a throwaway authority key. */
const test = require("node:test");
const assert = require("node:assert/strict");
const Client = require("../index.cjs");
const Ops = require("../ops.cjs");

const DAY = "2026-09-15";
const CLOCK = { now: () => DAY + "T12:00:00.000Z", today: () => DAY, tz: "+00:00", monotonicMs: () => 0 };
const AUTH_KEY = "p6-authority-key";
const IDENTITY_KEY = "p6-identity-key";

function lease(deviceId) {
  const base = { lease_id: "lease-" + deviceId, device_id: deviceId, athlete_id: "ath-1",
    not_before: "2020-01-01T00:00:00Z", not_after: "2099-01-01T00:00:00Z", range: [1, 1000000],
    issued: "2020-01-01T00:00:00Z" };
  base.signature = Ops.signatureOver(AUTH_KEY, "earned/lease/v1", base, "signature");
  return base;
}

function openClient(backend, ClientMod) {
  const M = ClientMod || Client;
  const c = M.createClient({ deviceId: "dev-A", athleteId: "ath-1", identityKey: IDENTITY_KEY,
    authorityKey: AUTH_KEY, backend, clock: CLOCK, lease: lease("dev-A"), online: false,
    contract: { client: "1", required: "1" }, standing: "enrolled" });
  c.boot();
  return c;
}

function dump(backend) {
  const out = {};
  for (const c of backend.collections().sort()) { out[c] = {}; for (const k of backend.keys(c).sort()) out[c][k] = backend.get(c, k); }
  return JSON.stringify(out);
}

const ISSUANCE = Object.freeze({
  body: Object.freeze({ kind: "sets", muscle: "quads", weeklySetsNow: 10, addWeeklySets: 3, expectedGainPct: 4.2 }),
  reason: "Weekly volume for quads sits below the smallest detectable gain. Adding 3 sets closes it.",
  revision: "rebuild/engine/volume.cjs@8f1c2a9",
  source: "coach",
  moment: "2026-09-15T09:30:00.000Z",
});

test("respond() with a full issuance stores it byte-for-byte, all-or-nothing with the answer", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const r = client.respond("prop-1", "accept", ISSUANCE);
  assert.equal(r.acknowledged, true, JSON.stringify(r));

  const stored = backend.get("ops", r.op_id);
  assert.deepEqual(stored.payload, { proposal_id: "prop-1", answer: "accept", issuance: JSON.parse(JSON.stringify(ISSUANCE)) });

  const back = client.reasonFor("prop-1");
  assert.equal(back.recorded, true);
  assert.equal(back.reason, ISSUANCE.reason);
  assert.deepEqual(back.body, ISSUANCE.body);
  assert.equal(back.revision, ISSUANCE.revision);
  assert.equal(back.source, ISSUANCE.source);
  assert.equal(back.moment, ISSUANCE.moment);
  assert.equal(back.opId, r.op_id);
});

test("stored and read back after a real reload of the repository", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const r = client.respond("prop-2", "accept", ISSUANCE);
  assert.equal(r.acknowledged, true, JSON.stringify(r));

  /* a real reload: the raw store round-tripped through JSON (no live object survives
     the trip), the module re-required, a fresh client over that plain data. */
  delete require.cache[require.resolve("../index.cjs")];
  const Reloaded = require("../index.cjs");
  const plain = JSON.parse(dump(backend));
  const freshBackend = Reloaded.memoryBackend(plain);
  const fresh = openClient(freshBackend, Reloaded);

  const back = fresh.reasonFor("prop-2");
  assert.deepEqual(back, { proposalId: "prop-2", opId: r.op_id, recorded: true,
    reason: ISSUANCE.reason, body: JSON.parse(JSON.stringify(ISSUANCE.body)),
    revision: ISSUANCE.revision, source: ISSUANCE.source, moment: ISSUANCE.moment });
});

test("all-or-nothing: dropping any one field of the issuance refuses the whole write", () => {
  for (const field of ["body", "reason", "revision", "source", "moment"]) {
    const backend = Client.memoryBackend();
    const client = openClient(backend);
    const before = dump(backend);
    const broken = Object.assign({}, ISSUANCE); delete broken[field];
    const r = client.respond("prop-x", "accept", broken);
    assert.equal(r.acknowledged, false, "missing " + field + " should have refused");
    assert.equal(r.state, 3);
    assert.equal(dump(backend), before, "a partial write reached disk for missing " + field);
    assert.equal(client.reasonFor("prop-x"), null);
  }
});

test("an issuance travels only with an accept; a decline carrying one refuses and leaves the store byte-identical", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const before = dump(backend);
  const r = client.respond("prop-y", "reject", ISSUANCE);
  assert.equal(r.acknowledged, false);
  assert.equal(dump(backend), before, "a decline wrote something while carrying an issuance");
});

test("moment must be a parseable date string; a garbage moment refuses the whole write", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const before = dump(backend);
  const r = client.respond("prop-bad-moment", "accept", Object.assign({}, ISSUANCE, { moment: "not-a-date" }));
  assert.equal(r.acknowledged, false);
  assert.equal(dump(backend), before);
});

test("a plain respond(proposalId, answer) with no issuance is unchanged: payload carries exactly two fields", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const r = client.respond("prop-z", "reject");
  assert.equal(r.acknowledged, true, JSON.stringify(r));
  assert.deepEqual(backend.get("ops", r.op_id).payload, { proposal_id: "prop-z", answer: "reject" });
  assert.equal(client.reasonFor("prop-z"), null, "a decline is never accepted, so it carries no reason");
});

test("reasonFor gives the honest not-recorded line for an accepted record with no issuance (pre-P6 shape)", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const r = client.respond("prop-old", "accept");   /* the exact pre-P6 call: two arguments */
  assert.equal(r.acknowledged, true);
  assert.deepEqual(backend.get("ops", r.op_id).payload, { proposal_id: "prop-old", answer: "accept" });

  const back = client.reasonFor("prop-old");
  assert.equal(back.recorded, false);
  assert.equal(back.reason, null);
  assert.equal(back.notRecordedBefore, "2026-09-15");
  assert.ok(back.copy.indexOf("2026-09-15") >= 0, back.copy);
  assert.equal(back.copy.indexOf(String.fromCharCode(0x2013)), -1, "en dash in a user-facing string");
  assert.equal(back.copy.indexOf(String.fromCharCode(0x2014)), -1, "em dash in a user-facing string");
});

test("reasonFor returns null for a proposal id nothing ever answered", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  assert.equal(client.reasonFor("never-issued"), null);
});

/* red-first cell: a pre-P6 op log (no issuance anywhere) must still project byte-identically
   across a real restart. This proves P6 is purely additive over the existing read model -
   nothing here changed how boot(), face() or answers() interpret an operation that has no
   issuance slot at all. */
test("a pre-P6 op log replays to a byte-identical projection across a real restart", () => {
  const backend = Client.memoryBackend();
  const first = openClient(backend);
  first.respond("prop-r1", "accept");   /* pre-P6 shape throughout: no third argument */
  first.respond("prop-r2", "reject");
  const answersBefore = first.face().answers;
  const dumpBefore = dump(backend);

  const second = openClient(backend);   /* the real reload: same backend, a brand new client */
  assert.equal(dump(backend), dumpBefore, "booting a second client over the same store changed it");
  assert.deepEqual(second.face().answers, answersBefore);
  assert.equal(second.reasonFor("prop-r1").recorded, false);
  assert.equal(second.reasonFor("prop-r1").notRecordedBefore, "2026-09-15");
  assert.equal(second.reasonFor("prop-r2"), null, "a decline was never accepted");
});

test("no em or en dash in the new P6 copy", () => {
  const Copy = require("../copy.cjs");
  for (const s of [Copy.REASON_NOT_RECORDED("2026-09-15"), Copy.ISSUANCE_INCOMPLETE]) {
    assert.equal(s.indexOf(String.fromCharCode(0x2013)), -1, s);
    assert.equal(s.indexOf(String.fromCharCode(0x2014)), -1, s);
  }
});
