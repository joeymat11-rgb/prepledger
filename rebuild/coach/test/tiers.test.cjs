"use strict";

/* ACCEPTANCE (b) TIER 2 and (c) TIER 3.
 *
 * (b) "A plan-change request without a recorded yes leaves the plan byte-identical;
 *      with a yes, the accepted proposal equals the engine's proposal exactly and
 *      the reason is stored."
 * (c) "Requests to change phase / floors / rules are refused and explained; state
 *      unchanged."
 *
 * The consent surface here is the REAL one — rebuild/client/index.cjs respond()
 * and recordIssuance() over its own durable store — so "byte-identical" is a
 * dump of that store, not a promise. The device enrolment is the synthetic
 * fixture rebuild/conform/lib/ops.cjs, the same one W6's own tests use. */

const test = require("node:test");
const assert = require("node:assert/strict");
const T = require("../tools.cjs");
const C = require("../coach-text.cjs");
const Client = require("../../client/index.cjs");
const O = require("../../conform/lib/ops.cjs");
const { createTodayModel } = require("../../m3/w7-preview/today/today-model.cjs");

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
  const dump = () => {
    const out = {};
    for (const c of backend.collections().sort()) { out[c] = {}; for (const k of backend.keys(c).sort()) out[c][k] = backend.get(c, k); }
    return JSON.stringify(out);
  };
  return { backend, client, today, dump, coach: T.createCoachTools({ today, consent: client }) };
}

test("tier 2: a plan-change REQUEST issues the engine's own proposal and changes nothing", async () => {
  const w = world();
  const before = w.dump();
  const turn = w.coach.openTurn("turn-req");
  const r = await turn.call.request_replan({ fact: "volume" });
  assert.equal(r.ok, true, JSON.stringify(r.unavailable || {}));
  assert.equal(r.awaiting_yes, true);
  assert.equal(r.state_unchanged, true);
  assert.equal(w.dump(), before, "issuing a proposal wrote something");

  /* it is the ENGINE's proposal, recomputed independently from the same state */
  const v = w.today.engine.volumeImbalance(w.today.stateFromOps());
  assert.equal(r.proposal.body.muscle, v.taker.mg);
  assert.equal(r.proposal.body.addWeeklySets, v.need);
  assert.equal(r.proposal.body.weeklySetsNow, v.taker.sets);
  assert.equal(r.proposal.reason, v.why);
  assert.equal(r.proposal.producer, "volume.volumeImbalance");
});

test("tier 2: NO YES leaves the store byte-identical", async () => {
  const w = world();
  const t1 = w.coach.openTurn("turn-a");
  const issued = await t1.call.request_replan({ fact: "volume" });
  const before = w.dump();

  const t2 = w.coach.openTurn("turn-b");
  const refused = await t2.call.accept_proposal({ proposal_id: issued.proposal.proposal_id });   /* no confirmed */
  assert.equal(refused.ok, false);
  assert.equal(refused.unavailable.code, T.CODES.CONFIRMATION_REQUIRED);
  assert.equal(refused.state_unchanged, true);
  assert.equal(w.dump(), before, "a plan change happened without a yes");
  assert.deepEqual(w.coach.acceptedProposals(), []);
  assert.deepEqual(w.client.face().answers, []);
});

test("tier 2: WITH A YES the accepted proposal equals the engine's proposal exactly, and the reason is stored", async () => {
  const w = world();
  const t1 = w.coach.openTurn("turn-a");
  const issued = await t1.call.request_replan({ fact: "volume" });
  const engineProposal = JSON.parse(JSON.stringify(issued.proposal));

  const t2 = w.coach.openTurn("turn-b");
  const done = await t2.call.accept_proposal({ proposal_id: issued.proposal.proposal_id, confirmed: true });
  assert.equal(done.ok, true, JSON.stringify(done.unavailable || {}));
  assert.equal(done.recorded, true);

  /* exactly — not a paraphrase, not a re-derivation */
  assert.deepEqual(JSON.parse(JSON.stringify(done.accepted.proposal)), engineProposal);
  assert.equal(done.accepted.reason, engineProposal.reason);
  assert.ok(done.accepted.reason && done.accepted.reason.length > 40, "the engine's reason is stored, not a stub");

  /* and it went through the EXISTING consent path, not a side door */
  const answers = w.client.face().answers;
  assert.equal(answers.length, 1);
  assert.equal(answers[0].proposal, engineProposal.proposal_id);
  assert.equal(answers[0].answer, "accept");
  assert.equal(done.accepted.op_id, answers[0].op_id);
  assert.equal(w.client.issuedInstance(engineProposal.proposal_id), null);
  assert.equal(done.accepted.issuance_stored, true);
});

test("tier 2: the model may never construct the numbers", async () => {
  const w = world();
  const before = w.dump();
  const turn = w.coach.openTurn("turn-x");
  const numeric = await turn.call.request_replan({ fact: "volume", addWeeklySets: 7 });
  assert.equal(numeric.ok, false);
  assert.equal(numeric.unavailable.code, T.CODES.PROPOSAL_NOT_ENGINE_ISSUED);

  const invented = await turn.call.accept_proposal({ proposal_id: "prop-the-model-made-this-up", confirmed: true });
  assert.equal(invented.ok, false);
  assert.equal(invented.unavailable.code, T.CODES.PROPOSAL_NOT_ENGINE_ISSUED);
  assert.equal(w.dump(), before);
});

test("tier 2: a fact the engine has no re-plan entry point for is refused, not improvised", async () => {
  const w = world();
  const before = w.dump();
  const turn = w.coach.openTurn("turn-y");
  for (const fact of ["pain", "equipment", "time_away", undefined]) {
    const r = await turn.call.request_replan({ fact });
    assert.equal(r.ok, false);
    assert.equal(r.unavailable.code, T.CODES.REPLAN_ENTRY_ABSENT);
  }
  assert.equal(w.dump(), before);
});

test("tier 3: phase, floors, progression rules and consent policy are refused, explained, and change nothing", async () => {
  const w = world();
  const before = w.dump();
  for (const topic of T.TIER3_TOPICS) {
    const turn = w.coach.openTurn("turn-" + topic);
    const r = await turn.call.cannot_change_via_coach({ topic });
    assert.equal(r.ok, true);
    assert.equal(r.tier, T.TIER.REFUSED);
    assert.equal(r.refused, true);
    assert.equal(r.state_unchanged, true);
    assert.equal(r.values.explanation.display, T.NEVER_VIA_COACH[topic]);
    assert.ok(r.values.explanation.display.length > 40, topic + " was refused without an explanation");
  }
  assert.equal(w.dump(), before, "a tier-3 refusal wrote something");
  assert.deepEqual(w.client.face().answers, []);
});

test("tier 1: a fact tool without a recorded yes records nothing and says so", async () => {
  const w = world();
  const before = w.dump();
  const turn = w.coach.openTurn("turn-fact");
  for (const name of ["record_pain_or_soreness", "equipment_unavailable_today", "time_away", "answer_checkin", "correct_set"]) {
    const r = await turn.call[name]({});
    assert.equal(r.ok, false, name + " accepted a fact with no yes");
    assert.equal(r.unavailable.code, T.CODES.CONFIRMATION_REQUIRED);
    assert.equal(r.tier, T.TIER.FACT);
  }
  assert.equal(w.dump(), before);
});

test("tier 1: with a yes, the three unwired facts refuse by NAMING the missing command", async () => {
  const w = world();
  const turn = w.coach.openTurn("turn-fact2");
  for (const name of ["record_pain_or_soreness", "equipment_unavailable_today", "time_away", "answer_checkin"]) {
    const r = await turn.call[name]({ confirmed: true, note: "synthetic" });
    assert.equal(r.ok, false);
    assert.equal(r.unavailable.code, T.CODES.FACT_COMMAND_ABSENT);
    assert.match(r.unavailable.source, /t2-stage\.cjs:9/);
  }
});

test("the whole script over the real consent surface stays traceable and honest", async () => {
  const w = world();
  const run = await C.runScript(w.coach);
  assert.deepEqual(run.untraceable, []);
  assert.deepEqual(run.charter, []);
  /* q18 says yes to the proposal q17 issued; q19 asks and then does not */
  assert.equal(w.coach.acceptedProposals().length, 1);
  assert.match(run.turns.find((t) => t.id === "q19").answer, /nothing changes/i);
  assert.match(run.turns.find((t) => t.id === "q18").answer, /Recorded\./);
});
