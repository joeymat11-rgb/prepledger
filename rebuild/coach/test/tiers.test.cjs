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
const fs = require("node:fs");
const path = require("node:path");
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
  const open = () => {
    const c = Client.createClient({ deviceId: "dev-A", athleteId: "ath-1", identityKey: O.K_IDENTITY,
      authorityKey: O.AUTH_KEY, backend, clock: CLOCK, lease: LEASE(), online: false,
      contract: { client: "1", required: "1" }, standing: "enrolled" });
    c.boot();
    return c;
  };
  const client = open();
  const today = createTodayModel({});
  const dump = () => {
    const out = {};
    for (const c of backend.collections().sort()) { out[c] = {}; for (const k of backend.keys(c).sort()) out[c][k] = backend.get(c, k); }
    return JSON.stringify(out);
  };
  return { backend, client, today, dump, reboot: open,
    coach: T.createCoachTools({ today, consent: client }) };
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

/* C5 review round 1, C3. This test used to be headed "the reason is stored" and
   proved it against `done.accepted.reason` — a field on an in-memory Map that
   dies with the process. THE REASON IS NOT ON DISK. rebuild/client's existing
   proposal-response path has no reason slot (index.cjs:271 respond() commits
   `payload: {proposal_id, answer}`; :338 recordIssuance() writes
   `{id, accepted, instance}`; :161 answers() reads them back), so all that
   survives a restart is that SOME id was accepted. The brief names that existing
   path, so this is a gap in rebuild/client, not in the coach — and the lane lead
   has put "does 'recorded with the reason' mean on disk?" to the PM. Until that
   is answered, this test states the gap instead of hiding it: it asserts exactly
   what the durable store holds, and asserts that the reason is NOT in it. It
   goes RED the day a durable reason lands, which is the point. */
test("tier 2: WITH A YES the accepted proposal equals the engine's proposal exactly (in memory)", async () => {
  const w = world();
  const t1 = w.coach.openTurn("turn-a");
  const issued = await t1.call.request_replan({ fact: "volume" });
  const engineProposal = JSON.parse(JSON.stringify(issued.proposal));

  const t2 = w.coach.openTurn("turn-b");
  const done = await t2.call.accept_proposal({ proposal_id: issued.proposal.proposal_id, confirmed: true });
  assert.equal(done.ok, true, JSON.stringify(done.unavailable || {}));
  assert.equal(done.recorded, true);

  /* exactly — not a paraphrase, not a re-derivation. IN THIS PROCESS. */
  assert.deepEqual(JSON.parse(JSON.stringify(done.accepted.proposal)), engineProposal);
  assert.equal(done.accepted.reason, engineProposal.reason);
  assert.ok(done.accepted.reason && done.accepted.reason.length > 40, "the engine's reason is a stub");

  /* and it went through the EXISTING consent path, not a side door */
  const answers = w.client.face().answers;
  assert.equal(answers.length, 1);
  assert.equal(answers[0].proposal, engineProposal.proposal_id);
  assert.equal(answers[0].answer, "accept");
  assert.equal(done.accepted.op_id, answers[0].op_id);
  assert.equal(w.client.issuedInstance(engineProposal.proposal_id), null);
  assert.equal(done.accepted.issuance_stored, true);
});

test("tier 2: EXACTLY what the durable store keeps after a yes — and the reason is NOT on disk", async () => {
  const w = world();
  const t1 = w.coach.openTurn("turn-a");
  const issued = await t1.call.request_replan({ fact: "volume" });
  const engineProposal = JSON.parse(JSON.stringify(issued.proposal));
  const t2 = w.coach.openTurn("turn-b");
  const done = await t2.call.accept_proposal({ proposal_id: engineProposal.proposal_id, confirmed: true });
  assert.equal(done.ok, true, JSON.stringify(done.unavailable || {}));

  const store = JSON.parse(w.dump());

  /* ONE operation, and its payload is exactly two fields */
  const ops = Object.values(store.ops);
  assert.equal(ops.length, 1);
  assert.equal(ops[0].kind, "proposal-response");
  assert.deepEqual(ops[0].payload, { proposal_id: engineProposal.proposal_id, answer: "accept" });
  assert.equal(ops[0].op_id, done.accepted.op_id);

  /* and ONE issuance, of exactly three fields */
  assert.deepEqual(Object.values(store.issuances),
    [{ id: engineProposal.proposal_id, accepted: true, instance: null }]);

  /* THE GAP, stated rather than hidden: the engine's reason, the proposal body
     and the producer name never reach disk, because the existing
     proposal-response payload has no slot for any of them. */
  const raw = w.dump();
  assert.ok(!raw.includes(engineProposal.reason), "the engine's reason IS on disk — update this test and C3");
  assert.ok(!raw.includes(engineProposal.producer), "the producer name is on disk");
  assert.ok(!raw.includes("weeklySetsNow"), "the proposal body is on disk");

  /* a freshly booted client over the SAME backend keeps the answer and loses the
     rest — this is what survives a restart, in full */
  const fresh = w.reboot();
  assert.deepEqual(fresh.face().answers.map((a) => ({ proposal: a.proposal, answer: a.answer, op_id: a.op_id })),
    [{ proposal: engineProposal.proposal_id, answer: "accept", op_id: done.accepted.op_id }]);
  assert.equal(fresh.issuedInstance(engineProposal.proposal_id), null);

  /* and a coach rebuilt over that fresh client knows nothing about the proposal */
  const rebuilt = T.createCoachTools({ today: w.today, consent: fresh });
  assert.deepEqual(rebuilt.acceptedProposals(), []);
  assert.deepEqual(rebuilt.issuedProposals(), []);
  assert.deepEqual(rebuilt.consentLedger(), []);
});

test("tier 2: the model may never construct the numbers", async () => {
  const w = world();
  const before = w.dump();
  const turn = w.coach.openTurn("turn-x");
  /* C5 review round 1, C6(i): the guard used to read only the TOP LEVEL, so a
     number one step down walked straight past it. It now walks the payload. */
  for (const args of [
    { fact: "volume", addWeeklySets: 7 },
    { fact: "volume", note: { sets: 7 } },
    { fact: "volume", n: [7] },
    { fact: "volume", deep: { a: { b: { c: [{ d: 7 }] } } } },
  ]) {
    const numeric = await turn.call.request_replan(args);
    assert.equal(numeric.ok, false, JSON.stringify(args) + " carried a number past the guard");
    assert.equal(numeric.unavailable.code, T.CODES.PROPOSAL_NOT_ENGINE_ISSUED);
  }

  /* A NUMERIC STRING is not refused, and does not need to be: it is free text the
     engine never reads as a quantity, and the issued proposal is byte-identical
     to the clean call either way. That is what the report now says. */
  const clean = await turn.call.request_replan({ fact: "volume" });
  const wordy = await turn.call.request_replan({ fact: "volume", addWeeklySets: "7", note: "make it 7 sets" });
  assert.equal(wordy.ok, true, JSON.stringify(wordy.unavailable || {}));
  assert.deepEqual(JSON.parse(JSON.stringify(wordy.proposal)), JSON.parse(JSON.stringify(clean.proposal)),
    "a free-text argument reached the engine's proposal");

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

test("tier 1: equipment-unavailable has no field anywhere and refuses by naming that", async () => {
  const w = world();
  const turn = w.coach.openTurn("turn-fact2");
  const r = await turn.call.equipment_unavailable_today({ confirmed: true, note: "synthetic" });
  assert.equal(r.ok, false);
  assert.equal(r.unavailable.code, T.CODES.FACT_COMMAND_ABSENT);
  assert.match(r.unavailable.source, /checkin-commands\.cjs FIELDS/);
  assert.match(r.unavailable.source, /t2-stage\.cjs:9/);
});

test("tier 1: the check-in facts refuse when no check-in lane is open — they do not invent one", async () => {
  const w = world();                               /* no checkin injected */
  const turn = w.coach.openTurn("turn-fact3");
  for (const name of ["record_pain_or_soreness", "time_away", "answer_checkin"]) {
    const r = await turn.call[name]({ confirmed: true });
    assert.equal(r.ok, false);
    assert.equal(r.unavailable.code, T.CODES.CHECKIN_SURFACE_ABSENT);
  }
});

test("the staged command set is NOT widened by the local era", () => {
  const read = (p) => fs.readFileSync(path.join(__dirname, "..", "..", p), "utf8");
  const setOf = (src) => {
    const m = /const COMMANDS = new Set\((\[[^\]]*\])\)/.exec(src);
    assert.ok(m, "COMMANDS set not found");
    return JSON.parse(m[1].replace(/'/g, '"')).slice().sort();
  };
  const stage = setOf(read("m3/w6/t2-stage.cjs"));
  const local = setOf(read("m3/w6/local/local-client.mjs"));
  assert.deepEqual(stage, ["finishSession", "logSession", "logSet", "weighIn", "workout"]);
  assert.deepEqual(local, stage, "local-client.mjs widened the staged command set");
  /* `workout` is the one PRODUCER-INJECTED command, and that — not a wider set —
     is how a dated non-workout fact reaches disk. Pinned on CODE, not on comment
     prose (review round 2, C10): the stage's own signature takes the provider,
     and checkin-host.mjs passes the check-in's provider down to the one local
     era instead of composing a store of its own. */
  assert.match(read("m3/w6/t2-stage.cjs"),
    /function createT2Stage\(configProvider, \{[^}]*workoutCommands: selectedWorkoutCommands = workoutCommands/);
  assert.match(read("m3/w7-preview/today/checkin-host.mjs"), /commands: createCheckInCommands\(\)/);
});

/* C5 review round 2, C10. Two of the three assertions above used to match COMMENT
   PROSE, which can drift from the code it describes. This one EXECUTES the
   injection: the producer — not the client — authors the operation's class, kind
   and payload for a `workout` command, which is exactly what "producer-injected"
   means and exactly why a check-in can reach disk without widening the staged
   command set or editing rebuild/client. */
test("the check-in's producer, EXECUTED: it authors the op the client will write", () => {
  const CheckIn = require("../../m3/w7-preview/today/checkin-commands.cjs");
  const producer = CheckIn.createCheckInCommands();

  /* the accepted client stamps a producer-injected command schema_version 2 */
  assert.equal(producer.schemaVersion, 2);
  assert.equal(typeof producer.prepare, "function");
  assert.equal(typeof producer.validate, "function");

  /* RUN IT. The class, the kind and the payload are the producer's, not the
     client's — the client authors none of these for `workout`. */
  const authored = producer.prepare({ action: "checkin",
    input: { answers: { soreness: "Mild" },
      effective: { local_date: DAY, local_time: "13:00", utc_offset: "+00:00" } } });
  assert.equal(authored.class, "event");
  assert.equal(authored.kind, "fact");
  assert.equal(authored.payload.profile, CheckIn.PROFILE);
  assert.deepEqual(authored.payload.answers, { soreness: "Mild" });
  assert.deepEqual(authored.parents, []);
  assert.equal(authored.effective.local_date, DAY);

  /* and it is CLOSED: it authors a check-in and refuses everything else, so the
     injection point cannot be used as a general write channel */
  assert.throws(() => producer.prepare({ action: "logSet", input: {} }), /CHECKIN_INPUT_INVALID/);
  assert.throws(() => producer.prepare({ action: "checkin", input: { answers: { energy: "Amazing" } } }),
    /CHECKIN_INPUT_INVALID/);

  /* the same producer re-checks the envelope the client actually builds */
  const op = { kind: "fact", class: "event", athlete_id: "ath-1", causal_parents: [],
    effective: { local_date: DAY, local_time: "13:00", utc_offset: "+00:00" },
    payload: authored.payload };
  assert.equal(producer.validate(op, () => null), true);
  assert.equal(producer.validate(Object.assign({}, op, { kind: "reading" }), () => null), false);
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
