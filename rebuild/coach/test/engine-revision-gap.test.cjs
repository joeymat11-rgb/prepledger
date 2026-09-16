"use strict";

/* P6-COACH-WIRE STOP EVIDENCE (round 2, review R1 findings 3 and 4).
 *
 * These cells are the red proof the round 1 report only argued in prose:
 * they fail if any of the seams the STOP relies on quietly grow a revision,
 * a clock, or a store that accepts a proposal without one. Same fixtures as
 * tiers.test.cjs (real rebuild/client, synthetic conform/lib/ops device). */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const T = require("../tools.cjs");
const Client = require("../../client/index.cjs");
const O = require("../../conform/lib/ops.cjs");
const { createTodayModel } = require("../../m3/w7-preview/today/today-model.cjs");

const SRC = fs.readFileSync(path.join(__dirname, "..", "tools.cjs"), "utf8");
const DAY = "2030-02-04";
const CLOCK = { now: () => DAY + "T13:00:00.000Z", today: () => DAY, tz: "+00:00", monotonicMs: () => 0 };
const LEASE = () => O.lease("dev-A", { not_before: "2030-01-01T00:00:00Z", not_after: "2030-12-31T00:00:00Z", issued: "2030-01-01T00:00:00Z" });

function world() {
  const backend = Client.memoryBackend();
  const client = Client.createClient({ deviceId: "dev-A", athleteId: "ath-1", identityKey: O.K_IDENTITY,
    authorityKey: O.AUTH_KEY, backend, clock: CLOCK, lease: LEASE(), online: false,
    contract: { client: "1", required: "1" }, standing: "enrolled" });
  client.boot();
  const today = createTodayModel({});
  return { backend, client, today, coach: T.createCoachTools({ today, consent: client }) };
}

/* R1: the call site still issues with no producer/revision, and no clock
   has been added to the coach's world. */
test("R1 accept_proposal still calls respond and recordIssuance without an issuance", () => {
  assert.equal(SRC.includes('consent.respond(id, "accept")'), true, "respond call site changed");
  assert.equal(SRC.includes("recordIssuance({ id, accepted: true, instance: null })"), true,
    "recordIssuance call site changed");
  assert.equal(/recordIssuance\([^)]*producer/.test(SRC), false, "producer now passed to recordIssuance?");
  assert.equal(/world\.clock|deps\.clock/.test(SRC), false, "a coach clock seam appeared?");
});

/* R2: end to end with the real client, the P6 carry-over is still open:
   after a real yes the reason is not on disk and reasonFor says so. */
test("R2 real client: accept_proposal stores no reason (carry-over open)", async () => {
  const w = world();
  const t1 = w.coach.openTurn("turn-req");
  const r = await t1.call.request_replan({ fact: "volume" });
  assert.equal(r.ok, true, JSON.stringify(r.unavailable || {}));
  const id = r.values.proposalId.value;
  const t2 = w.coach.openTurn("turn-yes");
  const a = await t2.call.accept_proposal({ proposal_id: id, confirmed: true });
  assert.equal(a.ok, true, JSON.stringify(a.unavailable || {}));
  const back = w.client.reasonFor(id);
  assert.equal(back.recorded, false, "reason unexpectedly on disk");
  assert.equal(back.reason, null);
  assert.equal(back.revision, null);
});

/* R3: the gap is a real blocker, not a hypothetical one - the real client
   refuses an otherwise perfect issuance whose revision is missing, empty,
   or the wrong type, and acknowledges once revision is a real string. */
test("R3 the client refuses an issuance without a real string revision", async () => {
  const w = world();
  const t1 = w.coach.openTurn("turn-req2");
  const r = await t1.call.request_replan({ fact: "volume" });
  const id = r.values.proposalId.value;
  const rec = r.proposal;
  const whole = { producer: rec.producer, body: rec.body, reason: rec.reason,
    revision: "rebuild/engine/volume.cjs@deadbeef", source: "turn-yes", moment: CLOCK.now() };
  for (const bad of [undefined, "", 1]) {
    const iss = { ...whole, revision: bad };
    const out = w.client.respond(id, "accept", iss);
    assert.equal(out.acknowledged, false, "a revision of " + JSON.stringify(bad) + " was accepted");
  }
  const good = w.client.respond(id, "accept", whole);
  assert.equal(good.acknowledged, true, JSON.stringify(good));
  const back = w.client.reasonFor(id);
  assert.equal(back.reason, rec.reason);
  assert.equal(back.revision, whole.revision);
});

/* R4: neither seam PM's follow-up needs exists today - not a revision, and
   not a clock. `source` (turn_id) is fine; `moment` has nothing to read
   from either, since verifyCostCap's `new Date()` default (tools.cjs:938)
   is unrelated to proposal issuance and today-model's own engine clock
   (today-model.cjs) is never exposed on the today adapter the coach holds.
   This is why the PM follow-up is TWO seams: revision AND a coach clock. */
test("R4 no engine revision and no clock reach the coach's world", () => {
  const today = createTodayModel({});
  assert.equal(today.revision, undefined);
  assert.equal(today.clock, undefined);
  assert.equal(today.engine.revision, undefined);
  assert.equal(today.engine.version, undefined);
  const rt = require("../../m4/workout/engine-runtime.cjs");
  assert.equal(rt.COMPOSITION.revision, undefined);
  assert.equal(Object.keys(require("../../engine/index.cjs")).join(","), "createEngine");
});
