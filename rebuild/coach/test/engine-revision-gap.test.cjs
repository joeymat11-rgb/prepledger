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

/* R1 and R2 asserted the gap (no revision reached the call site; the real
   client stored no reason after a yes). P6-COACH-WIRE-2 (DECISIONS:456)
   closed it - see rebuild/coach/test/accept-proposal-issuance.test.cjs for
   the bar cells proving the call site now works, and tiers.test.cjs for the
   durable-store proof that superseded R2. R1 and R2 are deleted rather than
   inverted: they tested the ABSENCE of a seam, and that seam now exists by
   design, not by accident this file should keep re-discovering. */

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

/* R4, rewritten as a contract cell (P6-COACH-WIRE-2, reviewer note 5): the
   engine itself still exposes no revision or clock of its own - that has not
   changed and must not - so ENGINE_REVISION (a sealed-receipt LABEL, not a
   runtime read) is the only revision source tools.cjs is allowed to use, and
   no clock reaches the coach: the only Date construction anywhere in
   tools.cjs is verifyCostCap's documented default at its own line, never
   inside accept_proposal or its issuance. */
test("R4 ENGINE_REVISION is the only revision source, and no clock reaches the coach", () => {
  const today = createTodayModel({});
  assert.equal(today.revision, undefined);
  assert.equal(today.clock, undefined);
  assert.equal(today.engine.revision, undefined);
  assert.equal(today.engine.version, undefined);
  const rt = require("../../m4/workout/engine-runtime.cjs");
  assert.equal(rt.COMPOSITION.revision, undefined);
  assert.equal(Object.keys(require("../../engine/index.cjs")).join(","), "createEngine");

  const { ENGINE_REVISION } = require("../engine-revision.cjs");
  assert.equal(typeof ENGINE_REVISION, "string");
  assert.ok(ENGINE_REVISION.length > 0);

  /* the call site reads the constant, never a literal of its own and never
     any other property named revision/version on the world it holds */
  assert.equal(SRC.includes("revision: ENGINE_REVISION"), true, "accept_proposal no longer uses ENGINE_REVISION");
  assert.equal(/revision:\s*(?!ENGINE_REVISION)[a-zA-Z0-9_.]+/.test(SRC), false,
    "some other value is assigned to a revision field");

  /* every `new Date`/`Date.now()` in tools.cjs lives inside verifyCostCap's
     own documented default (:938's line) and nowhere else - no coach clock
     seam appeared. Attribute each site to its nearest enclosing top-level
     `function NAME(` declaration rather than pinning a line number, so the
     cell survives unrelated reflow of this file. */
  const lines = SRC.split("\n");
  const fnAt = lines.map((line) => { const m = /^function\s+([A-Za-z0-9_]+)\s*\(/.exec(line); return m ? m[1] : null; });
  let enclosing = null;
  const dateSites = [];
  lines.forEach((line, i) => {
    if (fnAt[i]) enclosing = fnAt[i];
    if (/\bnew Date\(|\bDate\.now\(/.test(line)) dateSites.push({ line: i + 1, fn: enclosing, text: line.trim() });
  });
  assert.ok(dateSites.length > 0, "no Date construction found at all - has verifyCostCap moved its default?");
  for (const site of dateSites) {
    assert.equal(site.fn, "verifyCostCap",
      "unexpected Date construction outside verifyCostCap at tools.cjs:" + site.line + " (in " + site.fn + "): " + site.text);
  }
});
