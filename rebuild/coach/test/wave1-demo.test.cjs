"use strict";

/* COACH WAVE ONE, checks W1 to W12 and W16 to W17: the five-step demo.
 *
 * The bar is DECISIONS:140's own script (COACH-EXPERIENCE-BRIEF.md): open, "what
 * am I hitting today" with the why, "what's my seat on the chest press", "one-ten
 * for eight", "why is today lighter". W1 is that script run end to end over the
 * REAL local-era world, in order, in ONE run. */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { webcrypto } = require("node:crypto");
const T = require("../tools.cjs");
const W = require("../wave1-tools.cjs");
const X = require("../wave1-text.cjs");
const MS = require("../machine-settings-commands.cjs");

const DAY = "2030-02-04";
const at = (p) => path.join(__dirname, "..", p);
const DASH = /[–—]/;

/* The real world: sealed IndexedDB generations, the accepted client, the gym card
   composed over this installation's own bindings. Nothing is stubbed. */
async function demoWorld(label, options = {}) {
  const support = await import("../../m3/w6/test/support.mjs");
  const gymHost = await import("../../m3/w7-preview/today/gym-host.mjs");
  const gymModel = await import("../../m3/w7-preview/today/gym-model.mjs");
  const { openCoachWorld } = await import("../local-world.mjs");
  const pair = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
  const jwk = await webcrypto.subtle.exportKey("jwk", pair.publicKey);
  const storeKey = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const keys = { kid: gymHost.AUTHORITY_KID, storeKey, signingKey: pair.privateKey,
    publicKey: { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y, key_ops: ["verify"], ext: true } };
  const fault = support.faultDatabase();
  const world = await openCoachWorld({ indexedDB: fault.indexedDB, crypto: webcrypto, day: DAY,
    checkInDeviceKeys: keys, withCheckIn: false,
    databaseName: "earned-demo-" + label, namespace: "earned-demo/" + label });
  const coach = T.createCoachTools(world);
  const tools = W.createWave1Tools({ world, coach, reasons: options.reasons || null,
    effortChoices: gymModel.EFFORT_CHOICES.map((c) => ({ label: c.label, reserve: c.reserve })),
    effortWords: gymModel.effortWords });
  return { world, coach, tools, gymModel, close: () => world.close() };
}
/* A planted reason ON DISK, which is what W4's second half needs until P6 lands. */
const plantedReason = (why) => ({ forTopic: () => ({ why, source: "engine.reason.planted" }) });

/* ------------------------------------------------------------ W1: the run --- */

test("W1 the five-step demo runs end to end over the REAL local-era world, in order", async () => {
  const d = await demoWorld("w1");
  try {
    await d.world.gym.start();
    const run = await X.runDemo(d.tools);
    const script = X.loadScript();
    assert.equal(run.steps.length, script.steps.length);
    assert.deepEqual(run.steps.map((s) => s.id), script.steps.map((s) => s.id));
    assert.deepEqual(run.steps.map((s) => s.step), [1, 2, 3, 3, 3, 4, 5]);
    /* every step answered with a sentence, and the demo really says figures */
    for (const step of run.steps) assert.ok(step.answer.length > 10, step.id + " said nothing");
    assert.ok(T.numericTokens(run.text).length > 5, "a demo with no figures proves nothing");
    /* the owner's five questions, in the owner's order */
    assert.match(run.steps[1].ask, /what am i hitting today/i);
    assert.match(run.steps[2].ask, /seat on the chest press/i);
    assert.match(run.steps[5].ask, /one-ten for eight/i);
    assert.match(run.steps[6].ask, /why is today lighter/i);
  } finally { d.close(); }
});

/* ------------------------------------------------- W2, W3, W4: the day and why */

test("W2 step 2 reads the day back from today_plan, and every figure is that turn's", async () => {
  const d = await demoWorld("w2");
  try {
    await d.world.gym.start();
    const run = await X.runDemo(d.tools);
    const step = run.steps.find((s) => s.id === "s2");
    const plan = step.results.find((r) => r.tool === "today_plan");
    assert.ok(plan && plan.ok, "step 2 did not read today_plan");
    assert.deepEqual(step.untraceable, [], JSON.stringify(step.untraceable));
    /* the figures in the sentence are the engine's, tagged in this turn */
    assert.ok(step.answer.includes(plan.values.kcalLo.display));
    assert.ok(step.answer.includes(plan.values.proteinG.display));
  } finally { d.close(); }
});

test("W3 the WHY SLOT exists on step 2 and step 5, asserted structurally", async () => {
  const d = await demoWorld("w3");
  try {
    await d.world.gym.start();
    const run = await X.runDemo(d.tools);
    for (const id of ["s2", "s5"]) {
      const step = run.steps.find((s) => s.id === id);
      assert.equal(step.whySlot, true, id + " has no why slot");
      assert.ok(step.why, id + " carries no why value");
      assert.equal(typeof step.why.why.display, "string");
      assert.ok(step.why.why.display.length > 0, id + " why slot is empty");
      assert.equal(typeof step.whyRecorded, "boolean");
      /* the slot is a TAGGED value, so whatever fills it has a source */
      assert.equal(typeof step.why.why.source, "string");
      assert.ok(step.why.why.source.length > 0);
    }
  } finally { d.close(); }
});

test("W4 with NO reason on disk the slot reads exactly `not recorded`", async () => {
  const d = await demoWorld("w4a");
  try {
    await d.world.gym.start();
    const run = await X.runDemo(d.tools);
    for (const id of ["s2", "s5"]) {
      const step = run.steps.find((s) => s.id === id);
      assert.equal(step.whyRecorded, false);
      assert.equal(step.why.why.display, "not recorded");
      assert.equal(step.why.why.display, W.NOT_RECORDED);
      assert.equal(step.why.why.display, X.NOT_RECORDED);
    }
    assert.match(run.steps.find((s) => s.id === "s5").answer, /^Why: not recorded\.$/);
  } finally { d.close(); }
});

test("W4 with a reason ON DISK the slot reads the engine's own words, VERBATIM", async () => {
  const ENGINE_WORDS = "Rows went up: you hit the target two sessions running.";
  const d = await demoWorld("w4b", { reasons: plantedReason(ENGINE_WORDS) });
  try {
    await d.world.gym.start();
    const run = await X.runDemo(d.tools);
    for (const id of ["s2", "s5"]) {
      const step = run.steps.find((s) => s.id === id);
      assert.equal(step.whyRecorded, true, id + " said nothing is recorded when a reason is on disk");
      assert.equal(step.why.why.display, ENGINE_WORDS, id + " paraphrased the engine");
      assert.notEqual(step.why.why.display, "not recorded");
      assert.match(step.why.why.source, /planted|engine/);
      assert.ok(step.answer.includes(ENGINE_WORDS), id + " did not speak the recorded reason");
    }
  } finally { d.close(); }
});

test("W4 the why is NEVER composed from the plan numbers", async () => {
  const d = await demoWorld("w4c");
  try {
    await d.world.gym.start();
    const run = await X.runDemo(d.tools);
    const step = run.steps.find((s) => s.id === "s5");
    /* step 5 is the why ALONE. If the why were built out of the plan it would
       carry the plan's figures, and it carries none. */
    assert.deepEqual(T.numericTokens(step.why.why.display), []);
    assert.deepEqual(T.numericTokens(step.answer), []);
    assert.deepEqual(step.untraceable, []);
    /* and the source names the coach's own "not recorded", not an engine reader */
    assert.match(step.why.why.source, /not-recorded/);
  } finally { d.close(); }
});

/* -------------------------------------------- W5, W6: the machine settings --- */

test("W5 step 3 with nothing captured gives the brief's own sentence and writes nothing", async () => {
  const d = await demoWorld("w5");
  try {
    await d.world.gym.start();
    const before = (await d.world.machineSettings.all()).length;
    const turn = d.tools.openTurn("turn-miss");
    const r = await turn.call.machine_settings({ exercise_id: "chest-press" });
    assert.equal(r.ok, false);
    assert.equal(r.unavailable.code, W.W1_CODES.MACHINE_SETTINGS_ABSENT);
    assert.match(r.unavailable.reason, /do not have it yet/i);
    assert.match(r.unavailable.reason, /tell me while you are there/i);
    assert.equal(r.state_unchanged, true);
    assert.equal((await d.world.machineSettings.all()).length, before, "a miss wrote something");
  } finally { d.close(); }
});

test("W6 step 3 after a capture returns the stored settings as TAGGED values, in order", async () => {
  const d = await demoWorld("w6");
  try {
    await d.world.gym.start();
    const run = await X.runDemo(d.tools);
    const miss = run.steps.find((s) => s.id === "s3a");
    const kept = run.steps.find((s) => s.id === "s3b");
    const recall = run.steps.find((s) => s.id === "s3c");
    assert.equal(miss.found, false);
    assert.equal(kept.recorded, true);
    assert.equal(recall.found, true);

    const read = recall.results.find((r) => r.tool === "machine_settings");
    assert.deepEqual(read.values.settings.map((s) => s.name.display), ["seat", "pin"]);
    assert.deepEqual(read.values.settings.map((s) => s.value.display), ["four", "three"]);
    /* EVERY value names the OP it came from, so a recalled setting traces like an
       engine number does */
    for (const pair of read.values.settings) {
      assert.match(pair.name.source, /^machine-settings\.op /);
      assert.match(pair.value.source, /^machine-settings\.op /);
      assert.ok(pair.value.source.includes(kept.opId), "the tag does not name the op it came from");
    }
    assert.equal(read.opId, kept.opId);
    assert.ok(recall.answer.includes("seat four"));
    assert.ok(recall.answer.includes("pin three"));
  } finally { d.close(); }
});

test("W6 the recall is FOR THAT EXERCISE ID and no other", async () => {
  const d = await demoWorld("w6b");
  try {
    await d.world.machineSettings.save({ exercise_id: "chest-press", settings: [{ name: "seat", value: "four" }] });
    await d.world.machineSettings.save({ exercise_id: "leg-press", settings: [{ name: "seat", value: "nine" }] });
    const turn = d.tools.openTurn("turn-keyed");
    const press = await turn.call.machine_settings({ exercise_id: "chest-press" });
    const legs = await turn.call.machine_settings({ exercise_id: "leg-press" });
    const other = await turn.call.machine_settings({ exercise_id: "lat-pulldown" });
    assert.equal(press.values.settings[0].value.display, "four");
    assert.equal(legs.values.settings[0].value.display, "nine");
    assert.equal(other.ok, false);
    assert.equal(other.unavailable.code, W.W1_CODES.MACHINE_SETTINGS_ABSENT);
    /* and a blank id is a question, not a wildcard */
    const blank = await turn.call.machine_settings({ exercise_id: "  " });
    assert.equal(blank.ok, false);
    assert.equal(blank.unavailable.code, W.W1_CODES.MACHINE_SETTINGS_INVALID);
  } finally { d.close(); }
});

test("W6 nothing is interpreted: his words come back exactly as he said them (D10)", async () => {
  const d = await demoWorld("w6c");
  try {
    const turn = d.tools.openTurn("turn-verbatim");
    const saved = await turn.call.record_machine_settings({ exercise_id: "chest-press",
      settings: [{ name: "seat", value: "four" }, { name: "pin", value: "three" }], confirmed: true });
    assert.equal(saved.ok, true, JSON.stringify(saved.unavailable || {}));
    const row = await d.world.machineSettings.latest("chest-press");
    assert.equal(row.machine.settings[0].value, "four");
    assert.equal(typeof row.machine.settings[0].value, "string");
    assert.notEqual(row.machine.settings[0].value, 4);
    assert.notEqual(row.machine.settings[0].value, "4");
  } finally { d.close(); }
});

/* ------------------------------------------------ W7, W8: hands-free logging --- */

test("W7 step 4 logs through the GYM CARD'S write path, byte-identical to gym-model", async () => {
  const spoken = await demoWorld("w7-voice");
  const tapped = await demoWorld("w7-tap");
  try {
    await spoken.world.gym.start();
    await tapped.world.gym.start();

    /* the coach's way */
    const turn = spoken.tools.openTurn("turn-log");
    const r = await turn.call.log_set({ load: "110", reps: "8", effort: "two", confirmed: true });
    assert.equal(r.ok, true, JSON.stringify(r.unavailable || {}));

    /* the gym card's own way, the same set, the same choice */
    const view = await tapped.world.gym.read();
    const choice = tapped.gymModel.EFFORT_CHOICES.find((c) => c.label === "2");
    const direct = await tapped.world.gym.logSet({ startId: view.startId, slot: view.set.slot,
      lift: view.set.lift, load: "110", reps: "8", effort: choice.reserve });
    assert.equal(direct.ok, true, JSON.stringify(direct));

    /* THE CLAIM: the operation the store holds is the same operation */
    const payloadOf = async (world, opId) => {
      const ops = (await world.bindings.repository.load()).generation.collections.ops;
      const op = ops[opId];
      assert.ok(op, "the logged operation is not in the generation");
      return JSON.stringify({ kind: op.kind, class: op.class, payload: op.payload });
    };
    assert.equal(await payloadOf(spoken.world, r.opId), await payloadOf(tapped.world, direct.opId));
  } finally { spoken.close(); tapped.close(); }
});

test("W8 step 4 refuses GYM_SESSION_ABSENT when no set is active, and writes nothing", async () => {
  const d = await demoWorld("w8a");
  try {
    /* the session is merely READY: nothing has started, so there is nothing to log */
    const view = await d.world.gym.read();
    assert.notEqual(view.phase, "active");
    const before = Object.keys((await d.world.bindings.repository.load()).generation.collections.ops || {}).length;
    const turn = d.tools.openTurn("turn-nosession");
    const r = await turn.call.log_set({ load: "110", reps: "8", effort: "two", confirmed: true });
    assert.equal(r.ok, false);
    assert.equal(r.unavailable.code, T.CODES.GYM_SESSION_ABSENT);
    assert.equal(r.state_unchanged, true);
    const after = Object.keys((await d.world.bindings.repository.load()).generation.collections.ops || {}).length;
    assert.equal(after, before, "a refused log wrote an operation");
  } finally { d.close(); }
});

test("W8 step 4 refuses without the confirm, and the confirm NAMES the weight and the reps (D5, D6)", async () => {
  const d = await demoWorld("w8b");
  try {
    await d.world.gym.start();
    const before = Object.keys((await d.world.bindings.repository.load()).generation.collections.ops || {}).length;
    const turn = d.tools.openTurn("turn-noyes");
    const r = await turn.call.log_set({ load: "110", reps: "8", effort: "two" });
    assert.equal(r.ok, false);
    assert.equal(r.unavailable.code, T.CODES.CONFIRMATION_REQUIRED);
    /* D6: the sentence carries BOTH figures, so a yes is a yes to these numbers */
    assert.match(r.unavailable.reason, /110/);
    assert.match(r.unavailable.reason, /8/);
    assert.match(r.unavailable.reason, /nothing is recorded yet/i);
    const after = Object.keys((await d.world.bindings.repository.load()).generation.collections.ops || {}).length;
    assert.equal(after, before, "a log without a yes wrote an operation");
  } finally { d.close(); }
});

test("W8 the effort word maps onto the ACCEPTED choices only, with nothing preselected", async () => {
  const d = await demoWorld("w8c");
  try {
    await d.world.gym.start();
    const turn = d.tools.openTurn("turn-effort");
    /* no effort at all: nothing is preselected, so nothing is written */
    const none = await turn.call.log_set({ load: "110", reps: "8", confirmed: true });
    assert.equal(none.ok, false);
    assert.equal(none.unavailable.code, W.W1_CODES.EFFORT_REQUIRED);
    /* a word the accepted layer has no choice for */
    const odd = await turn.call.log_set({ load: "110", reps: "8", effort: "brutal", confirmed: true });
    assert.equal(odd.ok, false);
    assert.equal(odd.unavailable.code, W.W1_CODES.EFFORT_REQUIRED);
    /* and every mapped word names a label the accepted set really carries */
    const labels = d.gymModel.EFFORT_CHOICES.map((c) => c.label);
    for (const label of Object.values(W.EFFORT_WORDS)) {
      assert.ok(labels.includes(label), "the map names a choice the accepted layer does not have: " + label);
    }
    assert.ok(Object.values(W.EFFORT_WORDS).includes("Unsure"), "unsure must be sayable, explicitly");
    /* the weight and the reps are required too, in the layer's own words */
    const empty = await turn.call.log_set({ load: "", reps: "8", effort: "two", confirmed: true });
    assert.equal(empty.ok, false);
    assert.equal(empty.unavailable.code, W.W1_CODES.SET_NOT_RECORDED);
  } finally { d.close(); }
});

test("W8 step 4 names the set it logged and the set that is next", async () => {
  const d = await demoWorld("w8d");
  try {
    await d.world.gym.start();
    const run = await X.runDemo(d.tools);
    const step = run.steps.find((s) => s.id === "s4");
    assert.equal(step.logged, true);
    const logged = step.results.find((r) => r.tool === "log_set");
    assert.equal(logged.values.setNumber.value, 1);
    assert.equal(logged.values.load.value, 110);
    assert.equal(logged.values.reps.value, 8);
    assert.ok(logged.values.nextPosition.value >= 1, "the next set was not named");
    assert.match(step.answer, /Logged set/);
    assert.match(step.answer, /Next is/);
    assert.deepEqual(step.untraceable, []);
  } finally { d.close(); }
});

/* ------------------------------------------- W9 to W12: the rules, unchanged --- */

test("W9 every numeric token in every one of the five answers is traceable", async () => {
  const d = await demoWorld("w9");
  try {
    await d.world.gym.start();
    const run = await X.runDemo(d.tools);
    assert.deepEqual(run.untraceable, [], JSON.stringify(run.untraceable));
    /* stored machine settings included: the recall really says figures and they
       are the store's, not the coach's */
    const recall = run.steps.find((s) => s.id === "s3c");
    assert.deepEqual(recall.untraceable, []);
    assert.deepEqual(run.charter, [], JSON.stringify(run.charter));
  } finally { d.close(); }
});

test("W9 FAIL-CLOSED: a setting the store does not hold turns the check RED (D7)", async () => {
  const d = await demoWorld("w9b");
  try {
    await d.world.gym.start();
    const tampered = Object.assign({}, X.TEMPLATES, {
      machine_settings: (v) => "Seat " + X.d(v.settings[0].value, "text") + ", pin 9 on the stack.",
    });
    const run = await X.runDemo(d.tools, { templates: tampered });
    const bad = run.untraceable.find((u) => u.id === "s3c");
    assert.ok(bad, "a spoken setting the store does not hold was not reported");
    assert.deepEqual(bad.tokens, ["9"]);
  } finally { d.close(); }
});

test("W9 no wave-one template carries a digit: every figure arrives through a tagged value", () => {
  const STRING_LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g;
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
  for (const [name, fn] of Object.entries(X.TEMPLATES)) {
    for (const lit of strip(String(fn)).match(STRING_LITERAL) || []) {
      assert.ok(!/\d/.test(lit), "wave-one template " + name + " carries a literal number: " + lit);
    }
  }
});

test("W10 the tier map carries the four new tools, at the tiers the brief names (D11)", async () => {
  const d = await demoWorld("w10");
  try {
    assert.deepEqual(Object.keys(W.WAVE1_TIERS),
      ["plan_why", "machine_settings", "record_machine_settings", "log_set"]);
    assert.equal(W.WAVE1_TIERS.plan_why, W.TIER.READ);
    assert.equal(W.WAVE1_TIERS.machine_settings, W.TIER.READ);
    assert.equal(W.WAVE1_TIERS.record_machine_settings, W.TIER.FACT);
    assert.equal(W.WAVE1_TIERS.log_set, W.TIER.FACT);
    assert.ok(Object.isFrozen(W.WAVE1_TIERS));
    /* and the merged map still carries the C5 fifteen, unchanged */
    for (const name of Object.keys(d.coach.TIERS)) {
      assert.equal(d.tools.TIERS[name], d.coach.TIERS[name], name + " changed tier");
    }
    assert.equal(Object.keys(d.tools.TIERS).length, Object.keys(d.coach.TIERS).length + 4);
    /* an unknown name is refused, never dispatched */
    const unknown = await d.tools.dispatch("set_the_plan", {}, "turn-x");
    assert.equal(unknown.ok, false);
    assert.equal(unknown.code, "WAVE1_TOOL_NOT_IN_LIST");
  } finally { d.close(); }
});

/* WAVE1 review, C1. The reviewer found TIERS advertising nineteen names while
   dispatch served four: the C5 fifteen came back WAVE1_TOOL_NOT_IN_LIST through
   dispatch and worked through openTurn().call. These two enumerate BOTH lists
   rather than sampling, so the two can never drift apart again. */
test("W10 C1 the ADVERTISED list and the SERVED list are one list, enumerated", async () => {
  const d = await demoWorld("w10c1");
  try {
    const advertised = Object.keys(d.tools.TIERS).slice().sort();
    const served = d.tools.tools().slice().sort();
    assert.deepEqual(served, advertised, "tools() advertises something dispatch does not serve");
    /* the union is exactly the C5 fifteen plus these four, nothing invented */
    const union = Object.keys(d.coach.TIERS).concat(Object.keys(W.WAVE1_TIERS)).sort();
    assert.deepEqual(advertised, union);
    assert.equal(advertised.length, 19);
    /* EVERY advertised name is dispatchable: none is refused as "not in list",
       and each answers about ITSELF at the tier the merged map names. */
    for (const name of advertised) {
      const r = await d.tools.dispatch(name, {}, "turn-c1-" + name);
      assert.notEqual(r.code, "WAVE1_TOOL_NOT_IN_LIST", name + " is advertised but not served");
      assert.equal(r.tool, name, name + " answered as a different tool");
      assert.equal(r.tier, d.tools.TIERS[name], name + " answered at the wrong tier");
    }
  } finally { d.close(); }
});

test("W10 C1 the same name through dispatch and through openTurn().call is the SAME tool", async () => {
  const d = await demoWorld("w10c1b");
  try {
    await d.world.gym.start();
    const turn = d.tools.openTurn("turn-doors");
    /* a C5 read and a wave-one read, each through both doors */
    for (const name of ["today_plan", "current_set", "plan_why", "machine_settings"]) {
      assert.equal(typeof turn.call[name], "function", name + " is missing from openTurn().call");
      const viaDispatch = await d.tools.dispatch(name, {}, "turn-doors");
      const viaCall = await turn.call[name]({});
      assert.equal(viaDispatch.tool, viaCall.tool, name + " disagrees between doors");
      assert.equal(viaDispatch.tier, viaCall.tier, name + " changes tier between doors");
      assert.equal(viaDispatch.ok, viaCall.ok, name + " succeeds one way and refuses the other");
    }
    /* the refusal a genuinely unknown name gets names the WHOLE list it could
       have used, not the four */
    const unknown = await d.tools.dispatch("set_the_plan", {}, "turn-doors");
    assert.equal(unknown.code, "WAVE1_TOOL_NOT_IN_LIST");
    assert.equal(unknown.allowed.length, 19);
    assert.ok(unknown.allowed.includes("today_plan"));
    assert.ok(unknown.allowed.includes("log_set"));
  } finally { d.close(); }
});

test("W10 the two tier-1 tools refuse without a yes, and write nothing", async () => {
  const d = await demoWorld("w10b");
  try {
    await d.world.gym.start();
    const before = Object.keys((await d.world.bindings.repository.load()).generation.collections.ops || {}).length;
    const turn = d.tools.openTurn("turn-noyes");
    const kept = await turn.call.record_machine_settings({ exercise_id: "chest-press",
      settings: [{ name: "seat", value: "four" }] });
    assert.equal(kept.ok, false);
    assert.equal(kept.unavailable.code, T.CODES.CONFIRMATION_REQUIRED);
    assert.equal(kept.tier, W.TIER.FACT);
    const logged = await turn.call.log_set({ load: "110", reps: "8", effort: "two" });
    assert.equal(logged.ok, false);
    assert.equal(logged.unavailable.code, T.CODES.CONFIRMATION_REQUIRED);
    const after = Object.keys((await d.world.bindings.repository.load()).generation.collections.ops || {}).length;
    assert.equal(after, before, "a tier-1 tool wrote without a yes");
    /* the two tier-0 reads need no yes and change nothing */
    const read = await turn.call.machine_settings({ exercise_id: "chest-press" });
    assert.equal(read.tier, W.TIER.READ);
    const why = await turn.call.plan_why({ topic: "instruction" });
    assert.equal(why.tier, W.TIER.READ);
    assert.equal(why.ok, true);
  } finally { d.close(); }
});

test("W11 tier 3 is unchanged, and the new tools give no way round one", async () => {
  const d = await demoWorld("w11");
  try {
    await d.world.gym.start();
    const before = Object.keys((await d.world.bindings.repository.load()).generation.collections.ops || {}).length;
    const turn = d.tools.openTurn("turn-tier3");
    for (const topic of T.TIER3_TOPICS) {
      const r = await turn.call.cannot_change_via_coach({ topic });
      assert.equal(r.ok, true);
      assert.equal(r.tier, T.TIER.REFUSED);
      assert.equal(r.refused, true);
      assert.equal(r.state_unchanged, true);
      assert.equal(r.values.explanation.display, T.NEVER_VIA_COACH[topic]);
    }
    /* the new tools cannot be pointed at a tier-3 topic: a machine setting is a
       machine setting, and a set is a set */
    const smuggle = await turn.call.record_machine_settings({ exercise_id: "calorie_floor",
      settings: [{ name: "floor", value: "1200" }], confirmed: true });
    assert.equal(smuggle.ok, true, "the capture refused a legitimate exercise id");
    /* it stored a MACHINE fact, not a floor: the engine reads none of this */
    const row = await d.world.machineSettings.latest("calorie_floor");
    assert.equal(row.machine.exercise_id, "calorie_floor");
    assert.equal(JSON.stringify(row.machine).includes("calorieTarget"), false);
    const after = Object.keys((await d.world.bindings.repository.load()).generation.collections.ops || {}).length;
    assert.equal(after, before + 1, "the tier-3 sweep wrote more than the one capture");
  } finally { d.close(); }
});

test("W12 the opt-in and cost-cap gates are untouched, and no new path starts a session", async () => {
  const NOW = "2030-02-04T13:00:00.000Z";
  const example = JSON.parse(fs.readFileSync(at("cap.example.json"), "utf8"));
  const good = () => { const r = JSON.parse(JSON.stringify(example));
    for (const k of Object.keys(r)) if (k.charAt(0) === "_") delete r[k]; return r; };
  const optIn = { user: "joe", accepted: true, accepted_at: "2030-02-01T09:00:00.000Z",
    screen_version: "coach-opt-in-v1", wording: "Your voice audio and the text of this conversation "
      + "leave this phone and are sent to OpenAI's API so it can answer you." };
  /* exactly as they behave today */
  assert.equal(T.verifyCostCap(example, { now: NOW }).ok, false);
  assert.equal(T.verifyCostCap(good(), { now: NOW }).ok, true);
  assert.equal(T.startLiveSession({ cap: good(), now: NOW, optIn: true, user: "joe" }).code, "COACH_OPT_IN_REQUIRED");
  assert.equal(T.startLiveSession({ cap: good(), now: NOW, optIn, user: "dad" }).code, "COACH_OPT_IN_REQUIRED");
  assert.equal(T.startLiveSession({ cap: good(), now: NOW, optIn, user: "joe" }).code, "COACH_NO_LIVE_ADAPTER");
  assert.equal(T.startLiveSession({ cap: good(), now: NOW, optIn, user: "joe" }).started, false);
  /* and nothing in the new modules starts one */
  for (const file of ["wave1-tools.cjs", "wave1-text.cjs", "machine-settings-commands.cjs"]) {
    const src = fs.readFileSync(at(file), "utf8");
    assert.ok(!src.includes("startLiveSession"), file + " reaches the live-session gate");
    assert.ok(!/started:\s*true/.test(src), file + " reports a started session");
  }
});

test("W16 no dash reaches the athlete in any wave-one string or transcript (D12)", async () => {
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
  for (const file of ["wave1-tools.cjs", "wave1-text.cjs", "machine-settings-commands.cjs"]) {
    assert.ok(!DASH.test(strip(fs.readFileSync(at(file), "utf8"))), file + " carries a dash outside a comment");
  }
  assert.ok(!DASH.test(fs.readFileSync(at("scripts/wave1-script.json"), "utf8")));
  const d = await demoWorld("w16");
  try {
    await d.world.gym.start();
    const run = await X.runDemo(d.tools);
    for (const step of run.steps) {
      assert.ok(!DASH.test(step.answer), step.id + " speaks a dash: " + step.answer);
    }
    assert.ok(!DASH.test(run.text));
  } finally { d.close(); }
});

test("W17 no network and no model in any wave-one module", () => {
  for (const file of ["wave1-tools.cjs", "wave1-text.cjs", "machine-settings-commands.cjs"]) {
    const src = fs.readFileSync(at(file), "utf8");
    for (const forbidden of ["node:http", "node:https", "node:net", "node:tls", "node:dgram",
      "fetch(", "WebSocket", "XMLHttpRequest", "api.openai.com", "OPENAI_API_KEY", "process.env",
      "child_process", "https://", "http://"]) {
      assert.ok(!src.includes(forbidden), file + " reaches outside the process via " + forbidden);
    }
  }
  /* the driver's only input is a file */
  assert.ok(fs.existsSync(X.SCRIPT_PATH));
  assert.equal(typeof X.loadScript, "function");
});

test("the five-step script is the owner's script, and it names why each step is there", () => {
  const script = X.loadScript();
  assert.equal(script.steps.length, 7, "five steps, three of which are step 3's ask, keep and ask again");
  assert.deepEqual([...new Set(script.steps.map((s) => s.step))], [1, 2, 3, 4, 5]);
  for (const step of script.steps) {
    assert.equal(typeof step.ask, "string");
    assert.ok(step.why.length > 20, step.id + " does not say what it is for");
    assert.ok(!DASH.test(step.ask + step.why));
  }
  assert.equal(typeof script.exercise_id, "string");
});

test("the fact class is disclosed in the module that writes it", () => {
  const src = fs.readFileSync(at("machine-settings-commands.cjs"), "utf8");
  assert.ok(src.includes(MS.PROFILE));
  assert.ok(src.includes("checkin-commands.cjs"), "the seam it rides is not cited");
  assert.ok(src.includes("INVENTED"), "what is invented is not declared");
});
