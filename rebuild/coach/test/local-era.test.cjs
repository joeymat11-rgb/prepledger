"use strict";

/* THE COACH OVER THE LOCAL ERA (C1/C4's one store).
 *
 * Nothing is stubbed here: openLocalDurableClient enrols and boots a real sealed
 * IndexedDB installation, the morning reading and the workout go through the SAME
 * client and share ONE generation, and the recovery check-in is the accepted A3
 * lane writing one dated operation per day.
 *
 * fake-indexeddb resolves from rebuild/m3/w6's own node_modules, reached through
 * rebuild/m3/w6/test/support.mjs exactly as the A2 and C4 suites reach it.
 * Nothing is installed. */

const test = require("node:test");
const assert = require("node:assert/strict");
const { webcrypto } = require("node:crypto");
const T = require("../tools.cjs");
const C = require("../coach-text.cjs");

const DAY = "2030-02-04";

async function world(options = {}) {
  const support = await import("../../m3/w6/test/support.mjs");
  const { openCoachWorld } = await import("../local-world.mjs");
  const host = await import("../../m3/w7-preview/today/gym-host.mjs");
  const fault = support.faultDatabase();
  const pair = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
  const jwk = await webcrypto.subtle.exportKey("jwk", pair.publicKey);
  const storeKey = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const checkInDeviceKeys = { kid: host.AUTHORITY_KID, storeKey, signingKey: pair.privateKey,
    publicKey: { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y, key_ops: ["verify"], ext: true } };
  const opened = await openCoachWorld({ indexedDB: fault.indexedDB, crypto: webcrypto, day: DAY,
    checkInDeviceKeys, ...options });
  return { ...opened, coach: T.createCoachTools(opened) };
}

test("the world opens on ONE local installation: era enrolled, booted, ready", async () => {
  const w = await world();
  try {
    assert.deepEqual(w.client.status(), { state: "ready", code: "LOCAL_READY" });
    assert.equal(w.era.revision >= 1, true);
    /* exactly the durable-client scope the C4 journey names — no thirteenth member */
    assert.deepEqual(Object.keys(w.bindings).sort(), ["athleteId", "crypto", "deviceId", "isCurrentSession",
      "keys", "namespace", "observationEpoch", "observationGuard", "repository", "sessionEpoch",
      "stage", "validateCommit"]);
  } finally { w.close(); }
});

test("the local era does NOT widen the staged command set", async () => {
  const w = await world();
  try {
    const refused = await w.client.execute("respond", { proposalId: "p", answer: "accept" });
    assert.equal(refused.acknowledged, false);
    assert.equal(refused.code, "LOCAL_COMMAND_UNSUPPORTED");
    assert.equal(refused.state, 3);
    /* which is exactly why accept_proposal needs an injected consent surface */
    const turn = w.coach.openTurn("turn-consent");
    const issued = await turn.call.request_replan({ fact: "volume" });
    const tried = await turn.call.accept_proposal({ proposal_id: issued.proposal.proposal_id, confirmed: true });
    assert.equal(tried.ok, false);
    assert.equal(tried.unavailable.code, T.CODES.CONSENT_SURFACE_ABSENT);
  } finally { w.close(); }
});

test("a weigh-in and the workout share ONE generation, and the coach reads both", async () => {
  const w = await world();
  try {
    const saved = await w.today.weighIn(179.4);
    assert.equal(saved.ok, true, JSON.stringify(saved));

    const before = (await w.bindings.repository.load()).generation;
    const readingOps = Object.values(before.collections.ops || {}).length;
    assert.equal(readingOps, 1, "the reading landed in the shared generation");

    const ready = await w.gym.read();
    assert.equal(ready.phase, "ready", JSON.stringify({ phase: ready.phase, code: ready.code }));
    const started = await w.gym.start();
    assert.equal(started.ok, true, JSON.stringify(started));
    const after = (await w.bindings.repository.load()).generation;
    assert.equal(Object.values(after.collections.ops || {}).length, 2,
      "the Start landed in the SAME generation as the reading");

    const turn = w.coach.openTurn("turn-both");
    const trend = await turn.call.weight_trend({});
    assert.equal(trend.ok, true);
    assert.equal(trend.values.latestLb.value, 179.4);
    assert.equal(trend.values.hasReadToday.value, true);
    assert.match(trend.values.trend.source, /writers\.applyRead/);

    const set = await turn.call.current_set({});
    assert.equal(set.ok, true, JSON.stringify(set.unavailable || {}));
    const live = await w.gym.read();
    assert.equal(set.values.prescription.display, live.prescription.line);
    assert.deepEqual(turn.untraceable(C.ALL_TEMPLATES.current_set(set.values)), []);
    assert.deepEqual(turn.untraceable(C.ALL_TEMPLATES.weight_trend(trend.values)), []);
  } finally { w.close(); }
});

test("tier 1: pain and soreness are RECORDED durably through the check-in lane, after a yes", async () => {
  const w = await world();
  try {
    const blank = w.coach.openTurn("turn-blank");
    const before = await blank.call.today_checkin({});
    assert.equal(before.ok, true);
    assert.equal(before.values.answered.value, false);
    assert.deepEqual(before.values.lines, []);
    assert.equal(before.values.provenance.blank, true, "blank is unknown, never a filled-in default");

    /* no yes → nothing recorded */
    const noYes = w.coach.openTurn("turn-noyes");
    const refused = await noYes.call.record_pain_or_soreness({ soreness: "Mild" });
    assert.equal(refused.unavailable.code, T.CODES.CONFIRMATION_REQUIRED);
    assert.equal((await w.checkInHost.forDate(DAY)).length, 0);

    const turn = w.coach.openTurn("turn-pain");
    const done = await turn.call.record_pain_or_soreness({ confirmed: true,
      soreness: "Mild", soreness_location: "Right shoulder", soreness_impact: "A little",
      pain: true, pain_location: "Front of the right shoulder on the chest press",
      pain_change: "New", pain_impact: "I change how I move" });
    assert.equal(done.ok, true, JSON.stringify(done.unavailable || {}));
    assert.equal(done.recorded, true);
    assert.equal(done.tier, T.TIER.FACT);

    /* ONE dated operation, on disk, read back through the accepted host */
    const rows = await w.checkInHost.forDate(DAY);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].answers.soreness, "Mild");
    assert.deepEqual(rows[0].answers.issues, ["pain"]);
    assert.equal(rows[0].answers.pain_change, "New");
    assert.equal(rows[0].answers.energy, undefined, "an unanswered question is ABSENT, not null");

    /* and the consequence is stated, not implied by the word "saved" */
    assert.match(done.values.consequence.display, /plan is unchanged/i);
    assert.deepEqual(turn.untraceable(C.ALL_TEMPLATES.recorded(done.values)), []);

    const after = w.coach.openTurn("turn-after");
    const read = await after.call.today_checkin({});
    assert.equal(read.values.answered.value, true);
    assert.ok(read.values.lines.length >= 4);
    assert.deepEqual(after.untraceable(C.ALL_TEMPLATES.checkin(read.values)), []);
  } finally { w.close(); }
});

test("tier 1: time away is recorded through the same lane", async () => {
  const w = await world();
  try {
    const turn = w.coach.openTurn("turn-away");
    const done = await turn.call.time_away({ confirmed: true, days: 7, reason: "Travelling" });
    assert.equal(done.ok, true, JSON.stringify(done.unavailable || {}));
    const rows = await w.checkInHost.forDate(DAY);
    assert.equal(rows.length, 1);
    assert.deepEqual(rows[0].answers.issues, ["away"]);
    assert.deepEqual(rows[0].answers.away_days, { value: 7, unit: "day" });
    assert.equal(rows[0].answers.away_reason, "Travelling");
  } finally { w.close(); }
});

test("tier 1: the coach cannot invent a check-in answer the approved sheet does not have", async () => {
  const w = await world();
  try {
    const turn = w.coach.openTurn("turn-bad");
    const bad = await turn.call.answer_checkin({ confirmed: true, energy: "Amazing" });
    assert.equal(bad.ok, false);
    assert.equal(bad.unavailable.code, "CHECKIN_INPUT_INVALID");
    assert.equal((await w.checkInHost.forDate(DAY)).length, 0, "a refused answer wrote nothing");

    const good = await turn.call.answer_checkin({ confirmed: true, energy: "Moderate",
      sleep_quality: "Good", stress: "Low", sleep_hours: 8 });
    assert.equal(good.ok, true, JSON.stringify(good.unavailable || {}));
    const rows = await w.checkInHost.forDate(DAY);
    assert.deepEqual(rows[0].answers.sleep_hours, { value: 8, unit: "h" });
    assert.equal(rows[0].answers.sleep_hours_source, "entered");
  } finally { w.close(); }
});

test("sleep is not asked twice: the dated night on file is CONFIRMED, with its provenance", async () => {
  const w = await world();
  try {
    /* the synthetic athlete's sleep record already holds last night */
    const look = w.coach.openTurn("turn-sleep");
    const before = await look.call.today_checkin({});
    assert.equal(before.values.sleepRecordHours.blank, undefined);
    assert.equal(before.values.sleepRecordDate.display, "2030-02-03");
    assert.deepEqual(look.untraceable(C.ALL_TEMPLATES.checkin(before.values)), []);

    const turn = w.coach.openTurn("turn-confirm");
    const done = await turn.call.answer_checkin({ confirmed: true, energy: "Moderate", confirm_sleep_record: true });
    assert.equal(done.ok, true, JSON.stringify(done.unavailable || {}));
    const rows = await w.checkInHost.forDate(DAY);
    assert.equal(rows[0].answers.sleep_hours_source, "existing-record");
    assert.equal(rows[0].answers.sleep_hours_record_date, "2030-02-03",
      "the date of the confirmed night travels with the answer");
  } finally { w.close(); }
});

test("tier 1: equipment unavailable STILL has nowhere to go, and says so", async () => {
  const w = await world();
  try {
    const turn = w.coach.openTurn("turn-kit");
    const r = await turn.call.equipment_unavailable_today({ confirmed: true, note: "leg press taken" });
    assert.equal(r.ok, false);
    assert.equal(r.unavailable.code, T.CODES.FACT_COMMAND_ABSENT);
    assert.equal((await w.checkInHost.forDate(DAY)).length, 0);
  } finally { w.close(); }
});

test("the whole script over the LOCAL era stays traceable and charter-clean", async () => {
  const w = await world();
  try {
    await w.gym.start();
    const run = await C.runScript(w.coach);
    assert.deepEqual(run.untraceable, [], JSON.stringify(run.untraceable));
    assert.deepEqual(run.charter, []);
    assert.ok(run.turns.length >= 12);
    /* q14 records the pain/soreness check-in; q16b reads it back */
    assert.match(run.turns.find((t) => t.id === "q14").answer, /^Recorded\./);
    assert.match(run.turns.find((t) => t.id === "q16b").answer, /Right shoulder/);
    /* q16 then meets the sheet's own one-per-day rule, in the model's own words */
    assert.match(run.turns.find((t) => t.id === "q16").answer, /already recorded/i);
    /* q15 still has nowhere to put equipment */
    assert.match(run.turns.find((t) => t.id === "q15").answer, /no accepted durable field/i);
    for (const turn of run.turns) assert.ok(C.turnContextBytes(turn) < 8192, turn.id + " sent too much context");
  } finally { w.close(); }
});
