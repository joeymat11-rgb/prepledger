"use strict";

/* C6 Part A, the seven tools themselves: checks A4 to A13 except the two parity
 * checks, which have their own file.
 *
 * Every tool here drives the SCREENS' OWN setters. So what these tests hold is
 * not "the coach does something reasonable" but "the coach does exactly what a
 * tap does, and nothing a tap cannot do". */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const T = require("../tools.cjs");
const O = require("../onboarding-tools.cjs");
const X = require("../onboarding-text.cjs");

const DAY = "2030-02-04";
const EFFECTIVE = { local_date: DAY, local_time: "13:00", utc_offset: "-05:00" };
const at = (p) => path.join(__dirname, "..", p);

async function kit(options = {}) {
  const model = (await import("../../m3/w7-preview/today/setup-model.mjs")).default;
  const catalogue = await import("../../m3/w7-preview/today/exercise-catalogue.mjs");
  const commands = await import("../../m3/w7-preview/today/setup-commands.mjs");
  const setup = model.createSetupModel({ today: DAY });
  const tools = O.createOnboardingTools({ setup, catalogue, model, commands,
    effective: EFFECTIVE, host: options.host || null });
  return { model, catalogue, commands, setup, tools,
    call: (name, args) => tools.dispatch(name, args, options.turn || "turn-1") };
}
/* A host that records, so submit can be exercised without a store. The durable
   path is A2's, in onboarding-parity.test.cjs. */
function fakeHost() {
  const ops = [];
  return { ops, async save(setup, tags) {
    if (ops.length) return { ok: false, state: 0, copy: null, code: "SETUP_ALREADY_RECORDED", op_id: null };
    ops.push({ setup, tags });
    return { ok: true, state: 0, copy: null, code: null, op_id: "op-dev-A-" + ops.length };
  } };
}
const FIXTURE = () => X.loadScript().fixtures.find((f) => f.id === "two_day");

/* --------------------------------------------------- A6: the spoken yes --- */

for (const name of ["set_name", "set_days", "add_exercise_from_catalogue",
  "set_machine_settings", "set_priorities", "submit"]) {
  test("A6 " + name + " records nothing without a confirmation", async () => {
    const k = await kit({ host: fakeHost() });
    const before = JSON.stringify(k.setup.answers());
    const r = await k.call(name, { name: "Dad", days: ["1"], day: "U", priorities: ["chest"] });
    assert.equal(r.ok, false, name + " wrote a fact with no yes");
    assert.equal(r.unavailable.code, T.CODES.CONFIRMATION_REQUIRED);
    assert.equal(r.tier, O.TIER.FACT);
    assert.equal(r.state_unchanged, true);
    assert.equal(JSON.stringify(k.setup.answers()), before, name + " changed an answer anyway");
  });
}

test("A6 the confirm refusal NAMES the value it is waiting on", async () => {
  const k = await kit();
  const said = {};
  for (const name of ["set_name", "set_days", "set_priorities", "submit"]) {
    said[name] = (await k.call(name, {})).unavailable.reason;
  }
  assert.match(said.set_name, /a name/);
  assert.match(said.set_days, /training days/);
  assert.match(said.set_priorities, /matters most/);
  assert.match(said.submit, /your week/);
  for (const reason of Object.values(said)) assert.match(reason, /until you say yes/i);
});

test("A6 review is tier 0 and needs no yes: reading back changes nothing", async () => {
  const k = await kit();
  const before = JSON.stringify(k.setup.answers());
  const r = await k.call("review", {});
  assert.equal(r.ok, true);
  assert.equal(r.tier, O.TIER.READ);
  assert.equal(JSON.stringify(k.setup.answers()), before);
});

/* ------------------------------------------------------- the six answers -- */

test("set_name writes the name the screens write, and refuses an empty one", async () => {
  const k = await kit();
  const bad = await k.call("set_name", { name: "   ", confirmed: true });
  assert.equal(bad.ok, false);
  assert.equal(bad.unavailable.code, O.C6_CODES.ANSWER_INVALID);
  assert.equal(bad.unavailable.reason, k.model.VALIDATION.name);
  assert.equal(k.setup.answers().name, "");

  const good = await k.call("set_name", { name: "Dad", confirmed: true });
  assert.equal(good.ok, true);
  assert.equal(k.setup.answers().name, "Dad");
  assert.equal(good.values.name.display, "Dad");
});

test("set_days toggles the days he picked and refuses a weekday the model has no key for", async () => {
  const k = await kit();
  const bad = await k.call("set_days", { days: ["7", "Monday"], confirmed: true });
  assert.equal(bad.ok, false);
  assert.equal(bad.unavailable.code, O.C6_CODES.ANSWER_INVALID);
  assert.deepEqual(k.setup.answers().days, k.model.createSetupAnswers().days);

  const good = await k.call("set_days", { days: ["1", "4"], confirmed: true });
  assert.equal(good.ok, true);
  const days = k.setup.answers().days;
  assert.equal(days["1"] !== null, true);
  assert.equal(days["4"] !== null, true);
  assert.equal(days["2"], null);
});

test("A4 set_days reads EARNED's proposal back; the coach chose no kind", async () => {
  const k = await kit();
  await k.call("set_days", { days: ["1", "4"], confirmed: true });
  const proposed = k.model.default ? null : null;
  const split = await import("../../m3/w7-preview/today/split-kinds.mjs");
  const earned = split.proposeKinds([1, 4]);
  const days = k.setup.answers().days;
  assert.equal(days["1"], earned[1]);
  assert.equal(days["4"], earned[4]);
  assert.equal(proposed, null);
  /* and the sentence it reads back is setup-model's own rule, not the coach's */
  const r = await k.call("set_days", { days: ["1", "4"], confirmed: true });
  assert.equal(r.values.rule.display, k.model.COPY.screen2Rule);
});

test("add_exercise_from_catalogue takes a catalogue id and lands the catalogue's own row", async () => {
  const k = await kit();
  const r = await k.call("add_exercise_from_catalogue",
    { day: "U", catalogue_id: "chest_press_machine", confirmed: true });
  assert.equal(r.ok, true);
  const entry = k.catalogue.byId("chest_press_machine");
  const row = k.setup.answers().exercises[0];
  assert.equal(row.n, entry.n);
  assert.equal(row.mg, entry.mg);
  assert.equal(row.head, entry.head);
  assert.deepEqual(row.secondary, entry.secondary.map((s) => ({ mg: s.mg, lend: s.lend })));
});

test("add_exercise_from_catalogue refuses an id the catalogue does not have", async () => {
  const k = await kit();
  const r = await k.call("add_exercise_from_catalogue",
    { day: "U", catalogue_id: "the_one_by_the_window", confirmed: true });
  assert.equal(r.ok, false);
  assert.equal(r.unavailable.code, O.C6_CODES.CATALOGUE_ENTRY_UNKNOWN);
  assert.equal(k.setup.answers().exercises.length, 0);
});

test("add_exercise_from_catalogue refuses a day kind the model has no name for", async () => {
  const k = await kit();
  for (const day of ["X", "upper", "", null, 1]) {
    const r = await k.call("add_exercise_from_catalogue", { day, catalogue_id: "chest_press_machine", confirmed: true });
    assert.equal(r.ok, false, JSON.stringify(day) + " was accepted as a day kind");
    assert.equal(r.unavailable.code, O.C6_CODES.ANSWER_INVALID);
  }
  assert.equal(k.setup.answers().exercises.length, 0);
});

test("a lift not in the catalogue takes the name he uses and the engine's own label", async () => {
  const k = await kit();
  await k.call("add_exercise_from_catalogue",
    { day: "L", name: "The sled thing", mg: "quads", confirmed: true });
  const row = k.setup.answers().exercises[0];
  assert.equal(row.n, "The sled thing");
  assert.equal(row.mg, "quads");
  assert.equal(row.mgSource, "label");
});

test("DECISIONS:115 a muscle he names himself is stored VERBATIM and unmapped", async () => {
  const k = await kit();
  await k.call("add_exercise_from_catalogue",
    { day: "L", name: "The sled thing", mg_other: "shins", confirmed: true });
  const row = k.setup.answers().exercises[0];
  assert.equal(row.mg, "shins");
  assert.equal(row.mgSource, "other");
});

test("A7 an exercise he has not named STAYS unnamed, and the summary names the gap", async () => {
  const k = await kit();
  const r = await k.call("add_exercise_from_catalogue", { day: "U", confirmed: true });
  assert.equal(r.ok, true);
  const row = k.setup.answers().exercises[0];
  assert.equal(row.n, "");
  assert.equal(r.values.name.display, k.model.COPY.unnamedExercise);
  const review = await k.call("review", {});
  assert.ok(review.missingCodes.includes("CLEAN_INIT_EXERCISE_REQUIRED"));
  assert.ok(review.values.missing.some((m) => /no name/i.test(m.display)));
});

test("set_machine_settings writes the lightest setting, the jump and an uneven stack", async () => {
  const k = await kit();
  const added = await k.call("add_exercise_from_catalogue",
    { day: "U", catalogue_id: "chest_press_machine", confirmed: true });
  await k.call("set_machine_settings", { key: added.key, first: "20", inc: "2.5", confirmed: true });
  let row = k.setup.answers().exercises[0];
  assert.equal(row.first, "20");
  assert.equal(row.inc, "2.5");
  await k.call("set_machine_settings", { key: added.key, rungs: "10, 25, 45", confirmed: true });
  row = k.setup.answers().exercises[0];
  assert.deepEqual(k.model.parseRungs(row.rungs), [10, 25, 45]);
});

test("A7 I DO NOT KNOW writes nothing at all, and no default is invented", async () => {
  const k = await kit();
  const added = await k.call("add_exercise_from_catalogue",
    { day: "U", catalogue_id: "chest_press_machine", confirmed: true });
  const before = JSON.stringify(k.setup.answers());
  const r = await k.call("set_machine_settings",
    { key: added.key, first: "20", inc: "5", rungs: "10,20", unknown: true, confirmed: true });
  assert.equal(r.ok, true);
  assert.equal(r.recorded, false, "an unknown answer recorded something");
  assert.deepEqual(r.wrote, []);
  assert.equal(JSON.stringify(k.setup.answers()), before, "an unknown answer changed a value");
  assert.equal(r.values.first.blank, true);
  assert.equal(r.values.unknown.value, true);
  /* and the gap is NAMED rather than silently filled */
  const review = await k.call("review", {});
  assert.ok(review.values.missing.some((m) => /lightest setting/i.test(m.display)));
});

test("A5 the standard step is READ BACK from setup-model when the jump is blank", async () => {
  const k = await kit();
  const added = await k.call("add_exercise_from_catalogue",
    { day: "U", catalogue_id: "chest_press_machine", confirmed: true });
  const blank = await k.call("set_machine_settings", { key: added.key, first: "20", confirmed: true });
  assert.equal(blank.values.standardStep.display, k.model.standardStepLine());
  const own = await k.call("set_machine_settings", { key: added.key, inc: "2.5", confirmed: true });
  assert.equal(own.values.standardStep.display, "", "his own jump still quoted Earned's standard");
});

test("set_priorities records the engine's own labels and refuses anything else", async () => {
  const k = await kit();
  const bad = await k.call("set_priorities", { priorities: ["abs", "willpower"], confirmed: true });
  assert.equal(bad.ok, false);
  assert.equal(bad.unavailable.code, O.C6_CODES.ANSWER_INVALID);
  assert.deepEqual(k.setup.answers().priorities, [], "a refused list wrote a priority anyway");

  const good = await k.call("set_priorities", { priorities: ["chest", "back"], confirmed: true });
  assert.equal(good.ok, true);
  assert.deepEqual(k.setup.answers().priorities, ["chest", "back"]);
});

test("an empty screen 5 is an ANSWER, not a gap", async () => {
  const k = await kit();
  const r = await k.call("set_priorities", { priorities: [], confirmed: true });
  assert.equal(r.ok, true);
  assert.deepEqual(k.setup.answers().priorities, []);
  assert.equal(r.values.priorities[0].display, k.model.COPY.screen6Nothing);
  const review = await k.call("review", {});
  assert.equal(review.missingCodes.includes("CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED"), false);
});

/* --------------------------------------------- A4 and A5: what is EARNED's */

test("A5 review reads Earned's standard start back VERBATIM", async () => {
  const k = await kit();
  const r = await k.call("review", {});
  assert.equal(r.values.standardStart.display, k.model.standardStartLine());
  assert.equal(r.values.standardStep.display, k.model.standardStepLine());
  assert.equal(r.values.sets.value, k.model.STANDARD_SETS);
  assert.equal(r.values.hi.value, k.model.STANDARD_HI);
  assert.match(r.values.sets.source, /setup-model/);
});

test("A5 the standard lines are NOT re-authored inside the coach module", () => {
  const src = fs.readFileSync(at("onboarding-tools.cjs"), "utf8");
  for (const fragment of ["sets, aim for", "standard step", "aim for "]) {
    assert.ok(!src.includes('"' + fragment), "onboarding-tools.cjs re-authors: " + fragment);
  }
  assert.ok(src.includes("model.standardStartLine()"), "review must call setup-model's own line");
  assert.ok(src.includes("model.standardStepLine()"));
  /* and no digit is hard-coded as a set count or a rep target */
  assert.ok(!/\bsets\s*[:=]\s*\d/.test(src), "a set count is written in the coach module");
  assert.ok(!/\bhi\s*[:=]\s*\d/.test(src), "a rep target is written in the coach module");
});

test("A4 NO tool writes sets, hi or a day kind: asserted by source", () => {
  const src = fs.readFileSync(at("onboarding-tools.cjs"), "utf8");
  assert.deepEqual(O.NEVER_SET_BY_COACH.slice(), ["sets", "hi", "day_kind"]);
  /* the setters that would do it are never called */
  for (const setter of ["chooseSets", "chooseHi", "setDayKind"]) {
    assert.ok(!src.includes("setup." + setter), "a tool calls setup." + setter);
  }
  /* and neither is reachable through the dispatcher */
  for (const name of ["chooseSets", "chooseHi", "setDayKind", "set_sets", "set_day_kind"]) {
    assert.ok(!(name in O.TIERS), name + " is a registered tool");
  }
});

test("A4 a transcript that asks for sets, hi or a day kind is REFUSED and sets nothing", async () => {
  const k = await kit();
  await k.call("set_days", { days: ["1", "4"], confirmed: true });
  const before = JSON.stringify(k.setup.answers());
  for (const topic of ["sets", "hi", "day_kind", "standard_start"]) {
    const r = await k.call("cannot_set_via_coach", { topic });
    assert.equal(r.ok, true);
    assert.equal(r.tier, O.TIER.REFUSED);
    assert.equal(r.refused, true);
    assert.equal(r.state_unchanged, true);
    assert.equal(r.values.explanation.display, O.NEVER_VIA_COACH_SETUP[topic]);
    assert.ok(r.values.explanation.display.length > 40, topic + " was refused without an explanation");
  }
  assert.equal(JSON.stringify(k.setup.answers()), before, "a tier-3 refusal changed an answer");
});

test("A8 every daily tier-3 topic is carried through and refused by name", async () => {
  const k = await kit();
  for (const topic of T.TIER3_TOPICS) {
    assert.ok(topic in O.NEVER_VIA_COACH_SETUP, topic + " lost its sentence on the way to C6");
    const r = await k.call("cannot_set_via_coach", { topic });
    assert.equal(r.values.explanation.display, T.NEVER_VIA_COACH[topic]);
    assert.equal(r.values.topic.display, topic);
  }
  /* an unknown topic still refuses, and still changes nothing */
  const unknown = await k.call("cannot_set_via_coach", { topic: "the weather" });
  assert.equal(unknown.refused, true);
  assert.equal(unknown.state_unchanged, true);
});

/* ------------------------------------------------- A12, A13: the ONE op --- */

test("submit refuses while anything is still missing, and writes nothing", async () => {
  const host = fakeHost();
  const k = await kit({ host });
  await k.call("set_name", { name: "Dad", confirmed: true });
  const r = await k.call("submit", { confirmed: true });
  assert.equal(r.ok, false);
  assert.equal(r.unavailable.code, O.C6_CODES.SETUP_INCOMPLETE);
  assert.match(r.unavailable.reason, new RegExp(k.model.COPY.refusalHead.slice(0, 20)));
  assert.equal(host.ops.length, 0);
  assert.equal(k.tools.ops(), 0);
});

test("submit refuses when there is no durable lane, rather than pretending it stored anything", async () => {
  const k = await kit();
  const f = FIXTURE();
  X.driveByTap(k.setup, f, { catalogue: k.catalogue });
  const r = await k.call("submit", { confirmed: true });
  assert.equal(r.ok, false);
  assert.equal(r.unavailable.code, O.C6_CODES.SETUP_HOST_ABSENT);
  assert.equal(r.unavailable.reason, k.model.COPY.saveRefused);
});

test("A12 a complete transcript writes exactly ONE operation", async () => {
  const host = fakeHost();
  const k = await kit({ host });
  const run = await X.driveByVoice(k.tools, FIXTURE());
  assert.equal(run.submit.ok, true, JSON.stringify(run.submit.unavailable || {}));
  assert.equal(host.ops.length, 1);
  assert.equal(k.tools.ops(), 1);
  /* nine turns, one write */
  assert.ok(run.turns.length >= 9);
  assert.equal(run.turns.filter((t) => t.tool === "submit").length, 1);
});

test("A12 a transcript ABANDONED before submit writes zero, leaving no partial athlete", async () => {
  const host = fakeHost();
  const k = await kit({ host });
  const f = FIXTURE();
  await k.call("set_name", { name: f.name, confirmed: true });
  await k.call("set_days", { days: f.days, confirmed: true });
  await k.call("add_exercise_from_catalogue", { day: "U", catalogue_id: "chest_press_machine", confirmed: true });
  await k.call("review", {});
  assert.equal(host.ops.length, 0, "a half-finished conversation wrote something");
  assert.equal(k.tools.ops(), 0);
});

test("A13 first run happens ONCE: a second submit refuses with the screens' own code", async () => {
  const host = fakeHost();
  const k = await kit({ host });
  const first = await X.driveByVoice(k.tools, FIXTURE());
  assert.equal(first.submit.ok, true);
  const again = await k.call("submit", { confirmed: true });
  assert.equal(again.ok, false);
  assert.equal(again.unavailable.code, "SETUP_ALREADY_RECORDED");
  assert.equal(again.unavailable.reason, k.model.COPY.alreadyRecorded);
  assert.equal(host.ops.length, 1, "a second athlete was constructed");
});

/* ------------------------------------------ A9, A10, A11: how it speaks --- */

test("A9 every number the coach says traces to a tool result in the same turn", async () => {
  const host = fakeHost();
  const k = await kit({ host });
  const run = await X.driveByVoice(k.tools, FIXTURE());
  assert.deepEqual(run.untraceable, [], JSON.stringify(run.untraceable));
  assert.ok(T.numericTokens(run.text).length > 5, "a transcript with no figures proves nothing");
});

test("A9 FAIL-CLOSED: a template that says a number the tools did not return turns RED", async () => {
  const host = fakeHost();
  const k = await kit({ host });
  const tampered = Object.assign({}, X.TEMPLATES, {
    priorities: () => "What matters most: all 47 of them.",
  });
  const run = await X.driveByVoice(k.tools, FIXTURE(), { templates: tampered });
  const bad = run.untraceable.find((u) => u.id === "q5");
  assert.ok(bad, "the injected number was not reported");
  assert.deepEqual(bad.tokens, ["47"]);
});

test("A9 no onboarding template carries a digit: every figure arrives through a tagged value", () => {
  const STRING_LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g;
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
  for (const [name, fn] of Object.entries(X.TEMPLATES)) {
    for (const lit of strip(String(fn)).match(STRING_LITERAL) || []) {
      assert.ok(!/\d/.test(lit), "template " + name + " carries a literal number: " + lit);
    }
  }
});

test("A9 every interpolation declares the unit it speaks into", async () => {
  const host = fakeHost();
  const k = await kit({ host });
  const r = await k.call("review", {});
  assert.throws(() => X.d(r.values.sets), /declare the unit/);
  assert.throws(() => X.d(r.values.sets, "rep"), /COACH_UNIT_MISMATCH/);
  assert.equal(X.d(r.values.sets, "set"), String(k.model.STANDARD_SETS));
});

test("A10 no dash reaches the athlete, in any onboarding string", async () => {
  const DASH = /[–—]/;
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
  for (const file of ["onboarding-tools.cjs", "onboarding-text.cjs"]) {
    assert.ok(!DASH.test(strip(fs.readFileSync(at(file), "utf8"))), file + " carries a dash outside a comment");
  }
  assert.ok(!DASH.test(fs.readFileSync(at("scripts/onboarding-script.json"), "utf8")));
  for (const [topic, why] of Object.entries(O.NEVER_VIA_COACH_SETUP)) {
    assert.ok(!DASH.test(why), "tier-3 " + topic + " carries a dash");
  }
  const host = fakeHost();
  const k = await kit({ host });
  const run = await X.driveByVoice(k.tools, FIXTURE());
  assert.ok(!DASH.test(run.text), "the transcript carries a dash");
});

test("A11 no network and no model: the new modules open no socket and read a file", () => {
  for (const file of ["onboarding-tools.cjs", "onboarding-text.cjs"]) {
    const src = fs.readFileSync(at(file), "utf8");
    for (const forbidden of ["node:http", "node:https", "node:net", "node:tls", "node:dgram",
      "fetch(", "WebSocket", "XMLHttpRequest", "api.openai.com", "OPENAI_API_KEY", "process.env",
      "child_process", "https://", "http://"]) {
      assert.ok(!src.includes(forbidden), file + " reaches outside the process via " + forbidden);
    }
  }
  /* the driver's only input is a file */
  assert.equal(typeof X.loadScript, "function");
  assert.ok(fs.existsSync(X.SCRIPT_PATH));
});

test("the charter holds over an onboarding transcript too", async () => {
  const host = fakeHost();
  const k = await kit({ host });
  const run = await X.driveByVoice(k.tools, FIXTURE());
  assert.deepEqual(run.charter, [], JSON.stringify(run.charter));
});

test("a turn scopes its own provenance: another turn's results do not license this one", async () => {
  const host = fakeHost();
  const k = await kit({ host });
  const a = k.tools.openTurn("turn-A");
  await a.call("set_days", { days: ["1", "4"], confirmed: true });
  const b = k.tools.openTurn("turn-B");
  await b.call("review", {});
  assert.deepEqual(T.untraceable("That is 2 days in the gym.", a.results, "turn-A"), []);
  assert.deepEqual(T.untraceable("That is 2 days in the gym.", a.results.concat(b.results), "turn-B"), ["2"]);
});

test("the script file holds at least six fixtures, and each one is named and explained", () => {
  const script = X.loadScript();
  assert.ok(script.fixtures.length >= 6, "the brief's floor is six answer fixtures");
  const ids = script.fixtures.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const f of script.fixtures) {
    assert.equal(typeof f.why, "string");
    assert.ok(f.why.length > 10, f.id + " does not say what it is for");
    assert.equal(typeof f.complete, "boolean");
    assert.ok(Array.isArray(f.days) && f.days.length >= 1);
  }
  assert.equal(script.questions.length, 6, "six questions, the same six the screens ask");
});
