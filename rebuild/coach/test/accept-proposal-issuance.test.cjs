"use strict";

/* P6-COACH-WIRE-2 (DECISIONS:456) BAR CELLS. accept_proposal now records the
 * issuance and passes the whole thing to respond(), in that order. Every
 * cell here runs over the REAL rebuild/client createClient (real digest,
 * real store) so a passing test proves the wire, not a stub's opinion of it;
 * a subset also wraps that real client in a recording proxy so call ORDER
 * and ARGUMENTS are asserted directly rather than inferred from outcomes. */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const T = require("../tools.cjs");
const Client = require("../../client/index.cjs");
const O = require("../../conform/lib/ops.cjs");
const { createTodayModel } = require("../../m3/w7-preview/today/today-model.cjs");
const { ENGINE_REVISION } = require("../engine-revision.cjs");

const DAY = "2030-02-04";
const CLOCK = { now: () => DAY + "T13:00:00.000Z", today: () => DAY, tz: "+00:00", monotonicMs: () => 0 };
const LEASE = () => O.lease("dev-A", { not_before: "2030-01-01T00:00:00Z", not_after: "2030-12-31T00:00:00Z", issued: "2030-01-01T00:00:00Z" });
function realClient() {
  const backend = Client.memoryBackend();
  const client = Client.createClient({ deviceId: "dev-A", athleteId: "ath-1", identityKey: O.K_IDENTITY,
    authorityKey: O.AUTH_KEY, backend, clock: CLOCK, lease: LEASE(), online: false,
    contract: { client: "1", required: "1" }, standing: "enrolled" });
  client.boot();
  return { backend, client };
}

/* records the exact call order and arguments tools.cjs sends, then forwards
   to the real client so the outcome (acknowledged / stored / digest) is the
   real client's own, not a fake's guess of it */
function recordingConsent(client, opts) {
  const calls = [];
  const tamperReason = opts && opts.tamperReason;
  return {
    calls,
    recordIssuance: (arg) => { calls.push({ fn: "recordIssuance", args: [arg] }); return client.recordIssuance(arg); },
    respond: (id, answer, issuance) => {
      calls.push({ fn: "respond", args: [id, answer, issuance] });
      const forwarded = (tamperReason && issuance) ? { ...issuance, reason: issuance.reason + " (tampered)" } : issuance;
      return client.respond(id, answer, forwarded);
    },
    face: (...a) => client.face(...a),
  };
}

/* recordIssuance reports stored:false; respond must never be reached */
function brokenConsent() {
  let respondCalled = false;
  return {
    recordIssuance: () => ({ stored: false }),
    respond: () => { respondCalled = true; return { acknowledged: true, op_id: "should-not-happen" }; },
    respondCalled: () => respondCalled,
  };
}

async function issueVolumeProposal(coach) {
  const turn = coach.openTurn("turn-req-" + Math.random().toString(36).slice(2));
  const r = await turn.call.request_replan({ fact: "volume" });
  assert.equal(r.ok, true, "fixture could not issue a proposal: " + JSON.stringify(r.unavailable || {}));
  return r;
}
test("a/b/e: recordIssuance runs BEFORE respond, respond receives (id,\"accept\",issuance) with all six fields, and the real client acknowledges", async () => {
  const { client } = realClient();
  const consent = recordingConsent(client);
  const today = createTodayModel({});
  const coach = T.createCoachTools({ today, consent });
  const issued = await issueVolumeProposal(coach);
  const id = issued.values.proposalId.value;
  const record = issued.proposal;

  const t = coach.openTurn("turn-yes");
  const done = await t.call.accept_proposal({ proposal_id: id, confirmed: true });
  assert.equal(done.ok, true, JSON.stringify(done.unavailable || {}));

  assert.equal(consent.calls.length, 2, "expected exactly recordIssuance then respond");
  assert.equal(consent.calls[0].fn, "recordIssuance");
  assert.equal(consent.calls[1].fn, "respond");

  /* (b) recordIssuance's own arguments */
  const ri = consent.calls[0].args[0];
  assert.equal(ri.id, id);
  assert.equal(ri.accepted, true);
  assert.equal(ri.instance, null);
  assert.equal(ri.producer, record.producer);
  assert.equal(ri.revision, ENGINE_REVISION);

  /* (a) respond's own arguments: (id, "accept", issuance) with all six fields */
  const [rid, ranswer, issuance] = consent.calls[1].args;
  assert.equal(rid, id);
  assert.equal(ranswer, "accept");
  assert.deepEqual(Object.keys(issuance).sort(), ["body", "moment", "producer", "reason", "revision", "source"]);
  assert.deepEqual(issuance.body, record.body);
  assert.equal(issuance.reason, record.reason);
  assert.equal(issuance.producer, record.producer);
  assert.equal(issuance.revision, ENGINE_REVISION);

  /* (e) moment is the world's today.today, source is the accepting turn_id */
  assert.equal(issuance.moment, today.today);
  assert.equal(issuance.source, "turn-yes");

  /* the real client actually acknowledged it - this is not a fake's opinion */
  assert.equal(done.recorded, true);
  assert.equal(done.accepted.issuance_stored, true);
});
test("c: recordIssuance stored:false leaves respond uncalled, refuses with CONSENT_ISSUANCE_NOT_STORED and the new copy, and touches no ledger", async () => {
  const today = createTodayModel({});
  const consent = brokenConsent();
  const coach = T.createCoachTools({ today, consent });
  const issued = await issueVolumeProposal(coach);
  const id = issued.values.proposalId.value;

  const t = coach.openTurn("turn-yes");
  const done = await t.call.accept_proposal({ proposal_id: id, confirmed: true });

  assert.equal(consent.respondCalled(), false, "respond was called despite stored:false");
  assert.equal(done.ok, false);
  assert.equal(done.unavailable.code, "CONSENT_ISSUANCE_NOT_STORED");
  assert.equal(done.unavailable.reason, "Your yes could not be recorded on this device. Nothing changed.");
  assert.equal(done.state_unchanged, true);
  assert.deepEqual(coach.acceptedProposals(), []);
  assert.deepEqual(coach.consentLedger(), []);
});
test("d: a tampered reason is refused by the real client's own digest check, surfaced unchanged, and touches no ledger", async () => {
  const { client } = realClient();
  const consent = recordingConsent(client, { tamperReason: true });
  const today = createTodayModel({});
  const coach = T.createCoachTools({ today, consent });
  const issued = await issueVolumeProposal(coach);
  const id = issued.values.proposalId.value;

  const t = coach.openTurn("turn-yes");
  const done = await t.call.accept_proposal({ proposal_id: id, confirmed: true });

  assert.equal(done.ok, false);
  /* the client's refusal shape carries no `code`, so the coach's own
     fallback applies, same as any other unacknowledged respond(); the
     COPY is the client's own words for THIS refusal, not a made-up one */
  assert.equal(done.unavailable.code, "PLAN_CONSENT_NOT_ACKNOWLEDGED");
  assert.equal(done.unavailable.reason, Client.copy.SAVE_FAILED_INVALID(Client.copy.ISSUANCE_NOT_ENGINE_ISSUED));
  assert.deepEqual(coach.acceptedProposals(), []);
  assert.deepEqual(coach.consentLedger(), []);
  /* recordIssuance still ran (it seeds the prior the tamper is caught
     against) but no accepted proposal-response op reached the client's own
     durable store */
  assert.deepEqual(client.face().answers, [], "an accept was recorded despite the refusal");
});
test("f: after accept, the real client's reasonFor(id) returns the stored reason and revision === ENGINE_REVISION", async () => {
  const { client } = realClient();
  const today = createTodayModel({});
  const coach = T.createCoachTools({ today, consent: client });
  const issued = await issueVolumeProposal(coach);
  const id = issued.values.proposalId.value;
  const record = issued.proposal;

  const t = coach.openTurn("turn-yes");
  const done = await t.call.accept_proposal({ proposal_id: id, confirmed: true });
  assert.equal(done.ok, true, JSON.stringify(done.unavailable || {}));

  const back = client.reasonFor(id);
  assert.equal(back.recorded, true);
  assert.equal(back.reason, record.reason);
  assert.equal(back.revision, ENGINE_REVISION);
  assert.equal(back.producer, record.producer);
  assert.equal(back.source, "turn-yes");
  assert.equal(back.moment, today.today);
});

/* g: engine-revision.test.cjs is a sibling file in this same glob
   (rebuild/coach/test/*.test.cjs) and is asserted green in the same run;
   this cell only checks the two files agree on the constant they share. */
test("g: this file and engine-revision.test.cjs agree on ENGINE_REVISION's shape", () => {
  assert.match(ENGINE_REVISION, /^[^@]+@[0-9a-f]{16}$/);
});

test("h: the new CONSENT_ISSUANCE_NOT_STORED code and copy carry no long dash", () => {
  const copy = "Your yes could not be recorded on this device. Nothing changed.";
  assert.equal(T.CODES.CONSENT_ISSUANCE_NOT_STORED, "CONSENT_ISSUANCE_NOT_STORED");
  /* built from code points, never typed literally, so this cell cannot
     itself be the one place a long dash sneaks into the file */
  const banned = [0x2013, 0x2014].map((cp) => String.fromCharCode(cp));
  for (const s of [copy, T.CODES.CONSENT_ISSUANCE_NOT_STORED, ENGINE_REVISION]) {
    for (const ch of banned) assert.equal(s.includes(ch), false, "long dash found in: " + s);
  }
});
