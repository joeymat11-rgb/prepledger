"use strict";
/* reason-on-disk.test.cjs: P6, the engine's reason and proposal body ON DISK with the
   consent (rebuild/slice/P6-REASON-ON-DISK-BRIEF.md, DECISIONS:117 (3)). r2: binds the
   stored issuance to the engine's own digest (tools.cjs prop-<sha256{producer,body,reason}>)
   and derives every "not recorded" date from the store itself, never a literal.
   Self-contained: no reference to rebuild/conform, matching this module's own "loads on
   its own" claim (README.md). The lease is signed here with a throwaway authority key. */
const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const cp = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
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

function openClient(backend, ClientMod, deviceId) {
  const M = ClientMod || Client;
  const c = M.createClient({ deviceId: deviceId || "dev-A", athleteId: "ath-1", identityKey: IDENTITY_KEY,
    authorityKey: AUTH_KEY, backend, clock: CLOCK, lease: lease(deviceId || "dev-A"), online: false,
    contract: { client: "1", required: "1" }, standing: "enrolled" });
  c.boot();
  return c;
}

function dump(backend) {
  const out = {};
  for (const c of backend.collections().sort()) { out[c] = {}; for (const k of backend.keys(c).sort()) out[c][k] = backend.get(c, k); }
  return JSON.stringify(out);
}

/* the exact digest rebuild/coach/tools.cjs:770 derives a proposal id from */
function engineProposalId(producer, body, reason) {
  return "prop-" + crypto.createHash("sha256").update("earned/coach/proposal/v1" + JSON.stringify({ producer, body, reason })).digest("hex").slice(0, 16);
}

const PRODUCER = "volume.volumeImbalance";
const BODY = Object.freeze({ kind: "sets", muscle: "quads", weeklySetsNow: 10, addWeeklySets: 3, expectedGainPct: 4.2 });
const REASON = "Weekly volume for quads sits below the smallest detectable gain. Adding 3 sets closes it.";
const REAL_ID = engineProposalId(PRODUCER, BODY, REASON);
const ISSUANCE = Object.freeze({ producer: PRODUCER, body: BODY, reason: REASON,
  revision: "rebuild/engine/volume.cjs@8f1c2a9", source: "coach", moment: "2026-09-15T09:30:00.000Z" });

test("B1: the engine's own issuance is accepted and read back byte-for-byte, under its own digest-bound id", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const r = client.respond(REAL_ID, "accept", ISSUANCE);
  assert.equal(r.acknowledged, true, JSON.stringify(r));

  const stored = backend.get("ops", r.op_id);
  assert.deepEqual(stored.payload, { proposal_id: REAL_ID, answer: "accept", issuance: JSON.parse(JSON.stringify(ISSUANCE)) });

  const back = client.reasonFor(REAL_ID);
  assert.equal(back.recorded, true);
  assert.equal(back.reason, REASON);
  assert.deepEqual(back.body, BODY);
  assert.equal(back.producer, PRODUCER);
  assert.equal(back.revision, ISSUANCE.revision);
  assert.equal(back.source, "coach");
  assert.equal(back.moment, ISSUANCE.moment);
  assert.equal(back.opId, r.op_id);
});

test("B1: a WHOLLY MODEL-AUTHORED issuance under the engine's real proposal id is refused, store byte-identical", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const before = dump(backend);
  const forged = { producer: PRODUCER, reason: "I think you should add ninety nine sets because you look strong today.",
    body: { kind: "sets", muscle: "quads", weeklySetsNow: 10, addWeeklySets: 99 },
    revision: ISSUANCE.revision, source: "coach", moment: ISSUANCE.moment };
  const r = client.respond(REAL_ID, "accept", forged);
  assert.equal(r.acknowledged, false, "a model-authored issuance was accepted under the real id");
  assert.equal(r.state, 3);
  assert.equal(dump(backend), before);
  assert.equal(client.reasonFor(REAL_ID), null);
});

test("B1: a ONE-NUMBER-CHANGED engine body under the real proposal id is refused, store byte-identical", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const before = dump(backend);
  const altered = Object.assign({}, ISSUANCE, { body: Object.assign({}, BODY, { addWeeklySets: 13 }) });
  const r = client.respond(REAL_ID, "accept", altered);
  assert.equal(r.acknowledged, false, "an altered body was accepted under the unaltered id");
  assert.equal(dump(backend), before);
});

test("B1: a SWAPPED reason under the real proposal id is refused, store byte-identical", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const before = dump(backend);
  const swapped = Object.assign({}, ISSUANCE, { reason: "A completely different sentence the engine never said." });
  const r = client.respond(REAL_ID, "accept", swapped);
  assert.equal(r.acknowledged, false, "a swapped reason was accepted under the unswapped id");
  assert.equal(dump(backend), before);
});

test("B1: a revision that disagrees with what recordIssuance already registered for this id is refused", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  client.recordIssuance({ id: REAL_ID, accepted: false, instance: null, producer: PRODUCER, revision: "an-earlier-registered-revision" });
  const before = dump(backend);
  const r = client.respond(REAL_ID, "accept", ISSUANCE); // digest matches; revision does not agree with the prior registration
  assert.equal(r.acknowledged, false, "a disagreeing revision was accepted");
  assert.equal(dump(backend), before);
});

test("an un-encodable body refuses cleanly (state 3), it does not throw, and the store stays byte-identical", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const before = dump(backend);
  const bigBody = { kind: "sets", weeklySetsNow: 10n };
  assert.doesNotThrow(() => {
    const r = client.respond("prop-anything", "accept", Object.assign({}, ISSUANCE, { body: bigBody }));
    assert.equal(r.acknowledged, false);
    assert.equal(r.state, 3);
  });
  assert.equal(dump(backend), before);
});

test("all-or-nothing: dropping any one field of the issuance (including producer) refuses the whole write", () => {
  for (const field of ["producer", "body", "reason", "revision", "source", "moment"]) {
    const backend = Client.memoryBackend();
    const client = openClient(backend);
    const before = dump(backend);
    const broken = Object.assign({}, ISSUANCE); delete broken[field];
    const r = client.respond(REAL_ID, "accept", broken);
    assert.equal(r.acknowledged, false, "missing " + field + " should have refused");
    assert.equal(r.state, 3);
    assert.equal(dump(backend), before, "a partial write reached disk for missing " + field);
    assert.equal(client.reasonFor(REAL_ID), null);
  }
});

test("an issuance travels only with an accept; a decline carrying one refuses and leaves the store byte-identical", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const before = dump(backend);
  const r = client.respond(REAL_ID, "reject", ISSUANCE);
  assert.equal(r.acknowledged, false);
  assert.equal(dump(backend), before, "a decline wrote something while carrying an issuance");
});

test("moment must be a parseable date string; a garbage moment refuses the whole write", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const before = dump(backend);
  const r = client.respond(REAL_ID, "accept", Object.assign({}, ISSUANCE, { moment: "not-a-date" }));
  assert.equal(r.acknowledged, false);
  assert.equal(dump(backend), before);
});

test("a plain respond(proposalId, answer) with no issuance is unchanged: payload carries exactly two fields", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const r = client.respond("prop-z", "reject");
  assert.equal(r.acknowledged, true, JSON.stringify(r));
  assert.deepEqual(backend.get("ops", r.op_id).payload, { proposal_id: "prop-z", answer: "reject" });
});

test("reasonFor returns null for a proposal id nothing ever answered", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  assert.equal(client.reasonFor("never-issued"), null);
});

function freshClient(backend, deviceId, clock) {
  const c = Client.createClient({ deviceId, athleteId: "ath-1", identityKey: IDENTITY_KEY,
    authorityKey: AUTH_KEY, backend, clock, lease: lease(deviceId), online: false,
    contract: { client: "1", required: "1" }, standing: "enrolled" });
  c.boot();
  return c;
}

/* B2: "not recorded before <date>" must derive from the store's own records, never a literal.
   Both records below sit far past any date this feature could plausibly have shipped on -
   if the derivation ever fell back to a hardcoded constant, this cell would show it. */
test("B2: notRecordedBefore is the store's own earliest issuance-bearing record, not a literal", () => {
  const backend = Client.memoryBackend();
  const OLD_CLOCK = { now: () => "2050-01-01T00:00:00.000Z", today: () => "2050-01-01", tz: "+00:00", monotonicMs: () => 0 };
  const NEW_CLOCK = { now: () => "2050-06-01T00:00:00.000Z", today: () => "2050-06-01", tz: "+00:00", monotonicMs: () => 1 };
  const oldClient = freshClient(backend, "dev-A", OLD_CLOCK);
  const rOld = oldClient.respond("prop-far-old", "accept");
  assert.equal(rOld.acknowledged, true, JSON.stringify(rOld));

  const newClient = freshClient(backend, "dev-A", NEW_CLOCK);
  const issuanceFar = Object.assign({}, ISSUANCE, { moment: "2050-06-01T00:00:00.000Z" });
  const rNew = newClient.respond(REAL_ID, "accept", issuanceFar);
  assert.equal(rNew.acknowledged, true, JSON.stringify(rNew));

  const back = newClient.reasonFor("prop-far-old");
  assert.equal(back.recorded, false);
  assert.equal(back.notRecordedBefore, "2050-06-01",
    "the cutover must be this store's actual earliest issuance record, never the 2026-09-15 literal");
  assert.ok(back.copy.indexOf("2050-06-01") >= 0, back.copy);
});

test("B2: a no-issuance record dated AFTER the store's cutover reports its own record date, not a before-cutover claim", () => {
  const backend = Client.memoryBackend();
  const early = freshClient(backend, "dev-A", CLOCK); // DAY = 2026-09-15
  const rIssued = early.respond(REAL_ID, "accept", ISSUANCE);
  assert.equal(rIssued.acknowledged, true);

  const LATER_CLOCK = { now: () => "2030-01-01T00:00:00.000Z", today: () => "2030-01-01", tz: "+00:00", monotonicMs: () => 1 };
  const later = freshClient(backend, "dev-A", LATER_CLOCK);
  const rNoReason = later.respond("prop-later-no-reason", "accept");
  assert.equal(rNoReason.acknowledged, true);

  const back = later.reasonFor("prop-later-no-reason");
  assert.equal(back.recorded, false);
  assert.equal(back.notRecordedBefore, null, "this record is not before the cutover, so it must not carry that claim");
  assert.equal(back.recordDate, "2030-01-01");
  assert.ok(back.copy.indexOf("2030-01-01") >= 0, back.copy);
});

/* B2, mutant-killing: every cell above seeds an issuance somewhere in the store before calling
   reasonFor, so firstIssuanceRecordDate() never actually returns null in this suite - a mutant
   that changes its `return earliest;` to `return earliest || "2026-09-15"` (the exact r1
   BLOCKING literal) survives every cell above untouched. This is the real product's most common
   shape: a store that has never recorded a single issuance. */
test("B2: a store with no issuance anywhere reports the record's own date, never the r1 literal", () => {
  const backend = Client.memoryBackend();
  const EARLY_CLOCK = { now: () => "2020-01-01T00:00:00.000Z", today: () => "2020-01-01", tz: "+00:00", monotonicMs: () => 0 };
  const client = freshClient(backend, "dev-A", EARLY_CLOCK);
  const r = client.respond("prop-never-issued", "accept"); // pre-P6 shape: no third argument, ever
  assert.equal(r.acknowledged, true, JSON.stringify(r));

  const back = client.reasonFor("prop-never-issued");
  assert.equal(back.recorded, false);
  assert.equal(back.notRecordedBefore, null,
    "with no issuance anywhere in the store, there is no cutover to compare against - " +
    "a fallback literal would wrongly claim this record predates 2026-09-15");
  assert.equal(back.recordDate, "2020-01-01");
  assert.ok(back.copy.indexOf("2020-01-01") >= 0, back.copy);
});

/* M1: a later plain two-arg accept of the same id must not erase an already-recorded reason. */
test("M1: a later plain accept of the same id does not erase a previously recorded reason", () => {
  const backend = Client.memoryBackend();
  const client = openClient(backend);
  const r1 = client.respond(REAL_ID, "accept", ISSUANCE);
  assert.equal(r1.acknowledged, true);
  const r2 = client.respond(REAL_ID, "accept"); // pre-P6-shaped plain accept of the SAME id
  assert.equal(r2.acknowledged, true, "a plain accept must still be recordable (append-only ops)");

  const back = client.reasonFor(REAL_ID);
  assert.equal(back.recorded, true, "a later plain accept erased the previously recorded reason");
  assert.equal(back.reason, REASON);
  assert.deepEqual(back.body, BODY);
});

/* Bar item 2, red-first: a pre-P6-shaped op log (no issuance anywhere) must still replay to a
   byte-identical projection across a real restart, and old records must report the store's own
   derived cutover - never a re-derivation of what the answer WAS. */
test("bar-2: a pre-P6-shaped op log replays to a byte-identical projection across a real restart", () => {
  const backend = Client.memoryBackend();
  const first = openClient(backend);
  first.respond("prop-r1", "accept");   // pre-P6 shape throughout: no third argument
  first.respond("prop-r2", "reject");

  const LATER_CLOCK = { now: () => "2026-09-20T00:00:00.000Z", today: () => "2026-09-20", tz: "+00:00", monotonicMs: () => 5 };
  const later = freshClient(backend, "dev-A", LATER_CLOCK);
  const issuanceLater = Object.assign({}, ISSUANCE, { moment: "2026-09-20T00:00:00.000Z" });
  const rLater = later.respond(REAL_ID, "accept", issuanceLater);
  assert.equal(rLater.acknowledged, true);

  const answersBefore = later.face().answers;
  const dumpBefore = dump(backend);

  const second = openClient(backend);   // the real reload: same backend, a brand new client
  assert.equal(dump(backend), dumpBefore, "booting a second client over the same store changed it");
  assert.deepEqual(second.face().answers, answersBefore);

  const r1back = second.reasonFor("prop-r1");
  assert.equal(r1back.recorded, false);
  assert.equal(r1back.notRecordedBefore, "2026-09-20", "must be this store's own cutover, not a literal");
  assert.equal(second.reasonFor("prop-r2"), null, "a decline was never accepted");
});

test("no em or en dash in the new P6 copy", () => {
  const Copy = require("../copy.cjs");
  const strings = [Copy.REASON_NOT_RECORDED_BEFORE("2026-09-15"), Copy.REASON_NOT_RECORDED_FOR_RECORD("2026-09-15"),
    Copy.ISSUANCE_INCOMPLETE, Copy.ISSUANCE_NOT_ENGINE_ISSUED, Copy.ISSUANCE_UNENCODABLE];
  for (const s of strings) {
    assert.equal(s.indexOf(String.fromCharCode(0x2013)), -1, s);
    assert.equal(s.indexOf(String.fromCharCode(0x2014)), -1, s);
  }
});

/* MINOR, cross-build parity: this must be a real regression fix on the reverted (pre-P6)
   product, not a self-compare. The base index.cjs/copy.cjs are frozen fixtures under
   test/fixtures/ (checked-in snapshots, not read from git history, so this suite runs
   hermetically in any checkout - including a shallow, single-commit one - and never breaks
   on a rebase); every other file in rebuild/client is byte-identical at that revision
   (confirmed once, by hand, against the pre-P6 tree: only README.md, copy.cjs, index.cjs
   and this test differ). Exercised in a fresh child process. */
test("cross-build parity: the reverted pre-fix product accepts a forged issuance under the real id (red-first, not a self-compare)", () => {
  const repoRoot = path.join(__dirname, "..", "..", "..");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p6-parity-"));
  try {
    fs.cpSync(path.join(repoRoot, "rebuild", "client"), tmp, { recursive: true });
    fs.rmSync(path.join(tmp, "test"), { recursive: true, force: true });
    const oldIndex = fs.readFileSync(path.join(__dirname, "fixtures", "base-index.cjs"), "utf8");
    const oldCopy = fs.readFileSync(path.join(__dirname, "fixtures", "base-copy.cjs"), "utf8");
    fs.writeFileSync(path.join(tmp, "index.cjs"), oldIndex);
    fs.writeFileSync(path.join(tmp, "copy.cjs"), oldCopy);

    const script = "const Client = require(" + JSON.stringify(path.join(tmp, "index.cjs")) + ");" +
      "const Ops = require(" + JSON.stringify(path.join(tmp, "ops.cjs")) + ");" +
      "const AUTH_KEY = " + JSON.stringify(AUTH_KEY) + ";" +
      "const IDENTITY_KEY = " + JSON.stringify(IDENTITY_KEY) + ";" +
      "const base = { lease_id: 'lease-dev-A', device_id: 'dev-A', athlete_id: 'ath-1', not_before: '2020-01-01T00:00:00Z', not_after: '2099-01-01T00:00:00Z', range: [1, 1000000], issued: '2020-01-01T00:00:00Z' };" +
      "base.signature = Ops.signatureOver(AUTH_KEY, 'earned/lease/v1', base, 'signature');" +
      "const clock = { now: () => '2026-09-15T12:00:00.000Z', today: () => '2026-09-15', tz: '+00:00', monotonicMs: () => 0 };" +
      "const backend = Client.memoryBackend();" +
      "const c = Client.createClient({ deviceId: 'dev-A', athleteId: 'ath-1', identityKey: IDENTITY_KEY, authorityKey: AUTH_KEY, backend, clock, lease: base, online: false, contract: { client: '1', required: '1' }, standing: 'enrolled' });" +
      "c.boot();" +
      "const forged = { body: { kind: 'sets', muscle: 'quads', weeklySetsNow: 10, addWeeklySets: 99 }, reason: 'I think you should add ninety nine sets because you look strong today.', revision: 'rebuild/engine/volume.cjs@8f1c2a9', source: 'coach', moment: '2026-09-15T09:30:00.000Z' };" +
      "const r = c.respond(" + JSON.stringify(REAL_ID) + ", 'accept', forged);" +
      "process.stdout.write(JSON.stringify({ acknowledged: r.acknowledged }));";
    const out = cp.execFileSync(process.execPath, ["-e", script], { encoding: "utf8" });
    const result = JSON.parse(out);
    assert.equal(result.acknowledged, true,
      "the reverted pre-fix product refused a forged issuance - this parity check is not exercising the real regression");
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
