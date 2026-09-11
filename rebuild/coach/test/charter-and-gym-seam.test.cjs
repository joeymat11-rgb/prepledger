"use strict";

/* CHARTER LINT, and the one read seam that needs the real gym.
 *
 * Charter: "No urgency, streaks, gamification, nudging or dark patterns in the
 * coach's voice; misses are stated plainly, never softened or dramatized."
 * The banned list is literal (tools.CHARTER_BANNED) and it is run over the whole
 * transcript, plus over the coach's own fixed copy.
 *
 * Gym seam: current_set / next_set / last_comparable_performance read the
 * ACCEPTED capture layer through gym-model.mjs over the accepted encrypted
 * repository. This composes it for real — the same fake-indexeddb the A2 suite
 * uses, through rebuild/m3/w6/test/support.mjs (which is where fake-indexeddb
 * resolves from; nothing is installed here). */

const test = require("node:test");
const assert = require("node:assert/strict");
const { webcrypto } = require("node:crypto");
const T = require("../tools.cjs");
const C = require("../coach-text.cjs");
const { createTodayModel } = require("../../m3/w7-preview/today/today-model.cjs");

const DAY = "2030-02-04";
const SLOT = "earned-today-preview/" + DAY;

test("the transcript carries no urgency, streak or gamification vocabulary", async () => {
  const run = await C.runScript(T.createCoachTools({ today: createTodayModel({}) }));
  assert.deepEqual(run.charter, [], "charter violations: " + JSON.stringify(run.charter));
});

test("the coach's own fixed copy is clean too", () => {
  const copy = Object.values(T.NEVER_VIA_COACH).join(" ")
    + " " + Object.values(C.ALL_TEMPLATES).map((f) => String(f)).join(" ");
  assert.deepEqual(T.charterViolations(copy), []);
});

test("the charter lint actually fires (and does not fire on ordinary words)", () => {
  assert.deepEqual(T.charterViolations("Nice — that is a 4 day streak, keep it going!"),
    ["streak", "keep it going"]);
  assert.deepEqual(T.charterViolations("You're on fire. Level up for a bonus badge."),
    ["you're on fire", "on fire", "level up", "badge", "bonus"]);
  /* "explain" contains "xp"; "combobulate" contains "combo". A lint that fires on
     those is a lint that gets deleted. */
  assert.deepEqual(T.charterViolations("I can explain what it did; nothing is discombobulated."), []);
  assert.ok(T.CHARTER_BANNED.length >= 30, "the banned list is written down, not implied");
});

test("a miss is stated plainly: the coach never softens a refusal into encouragement", async () => {
  const run = await C.runScript(T.createCoachTools({ today: createTodayModel({}) }));
  const refusals = run.turns.filter((t) => /Nothing changed|cannot|not wired|no accepted/i.test(t.answer));
  assert.ok(refusals.length >= 6, "the honest answers are the majority of this script");
  for (const turn of refusals) {
    assert.deepEqual(T.charterViolations(turn.answer), []);
    assert.ok(!/sorry|unfortunately|great news|don't worry/i.test(turn.answer), turn.id + " softened a refusal");
  }
});

test("every tool is tiered, and the tier list matches the brief", () => {
  const coach = T.createCoachTools({ today: createTodayModel({}) });
  assert.deepEqual(Object.keys(coach.TOOLS).sort(), Object.keys(coach.TIERS).sort());
  assert.equal(coach.TIERS.record_pain_or_soreness, T.TIER.FACT);
  assert.equal(coach.TIERS.correct_set, T.TIER.FACT);
  assert.equal(coach.TIERS.request_replan, T.TIER.PROPOSAL);
  assert.equal(coach.TIERS.accept_proposal, T.TIER.PROPOSAL);
  assert.equal(coach.TIERS.cannot_change_via_coach, T.TIER.REFUSED);
  for (const read of ["today_plan", "current_set", "next_set", "last_comparable_performance",
    "weight_trend", "today_checkin", "why_this_instruction"]) {
    assert.equal(coach.TIERS[read], T.TIER.READ, read);
  }
});

test("with no gym session composed, the gym reads refuse rather than describe a set", async () => {
  const coach = T.createCoachTools({ today: createTodayModel({}) });
  const turn = coach.openTurn("turn-nogym");
  for (const name of ["current_set", "next_set", "last_comparable_performance"]) {
    const r = await turn.call[name]({});
    assert.equal(r.ok, false);
    assert.equal(r.unavailable.code, T.CODES.GYM_SESSION_ABSENT);
  }
  const checkin = await turn.call.today_checkin({});
  assert.equal(checkin.unavailable.code, T.CODES.CHECKIN_SURFACE_ABSENT);
});

/* ---------------------------------------------- the real gym read seam -- */

/* Composed exactly as the A2 suite composes it: the accepted encrypted
   repository over fake-indexeddb, the T2 stage over rebuild/client, the accepted
   durable public client, the accepted capture. Nothing is stubbed, and the coach
   reads it through gym-model.read() — the same adapter the screen reads. */
async function realGym() {
  const support = await import("../../m3/w6/test/support.mjs");
  const host = await import("../../m3/w7-preview/today/gym-host.mjs");
  const model = await import("../../m3/w7-preview/today/gym-model.mjs");
  const pair = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
  const jwk = await webcrypto.subtle.exportKey("jwk", pair.publicKey);
  const storeKey = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const deviceKeys = { kid: host.AUTHORITY_KID, storeKey, signingKey: pair.privateKey,
    publicKey: { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y, key_ops: ["verify"], ext: true } };
  const fault = support.faultDatabase();
  const today = createTodayModel({});
  const gymHost = await host.createGymHost({ day: DAY, engineState: today.stateFromOps(),
    indexedDB: fault.indexedDB, crypto: webcrypto, deviceKeys, plannedSplitSlotId: SLOT });
  return { today, gymHost, gym: model.createGymModel({ gymHost, sessionTitle: today.read().workout.title }) };
}

test("current_set and next_set are the ACCEPTED capture's own cells, and they are traceable", async () => {
  const { today, gym } = await realGym();
  const ready = await gym.read();
  assert.equal(ready.phase, "ready", JSON.stringify({ phase: ready.phase, code: ready.code, copy: ready.copy }));
  const started = await gym.start();
  assert.equal(started.ok, true, JSON.stringify(started));

  const coach = T.createCoachTools({ today, gym });
  const turn = coach.openTurn("turn-gym");
  const current = await turn.call.current_set({});
  assert.equal(current.ok, true, JSON.stringify(current.unavailable || {}));
  assert.equal(current.tier, T.TIER.READ);

  /* the same values the screen would print, cell for cell */
  const live = await gym.read();
  assert.equal(current.values.liftLabel.display, live.lift.label);
  assert.equal(current.values.prescription.display, live.prescription.line);
  assert.equal(current.values.setPosition.value, live.set.position);
  assert.equal(current.values.setCount.value, live.set.count);
  assert.match(current.values.prescription.source, /gym-model\.prescriptionLine/);

  const spoken = C.ALL_TEMPLATES.current_set(current.values);
  assert.deepEqual(turn.untraceable(spoken), [], "the spoken set line said an untagged number");
  assert.ok(/\d/.test(spoken), "a set line with no numbers is not a set line");

  const next = await turn.call.next_set({});
  assert.equal(next.ok, true, JSON.stringify(next.unavailable || {}));
  assert.deepEqual(turn.untraceable(C.ALL_TEMPLATES.next_set(next.values)), []);
});

test("no qualified comparison is an ANSWER, not a gap to fill", async () => {
  const { today, gym } = await realGym();
  await gym.start();
  const coach = T.createCoachTools({ today, gym });
  const turn = coach.openTurn("turn-prev");
  const prev = await turn.call.last_comparable_performance({});
  /* On this synthetic athlete the accepted engine returns card.prev = null, so
     the honest answer is the refusal — never an invented "last time". */
  if (prev.ok) {
    assert.match(prev.values.line.source, /genSession card\.prev/);
    assert.deepEqual(turn.untraceable(C.ALL_TEMPLATES.last_comparable(prev.values)), []);
  } else {
    assert.equal(prev.unavailable.code, T.CODES.NO_QUALIFIED_COMPARISON);
    assert.match(prev.unavailable.source, /today\.cjs:63/);
  }
});
