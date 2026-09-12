"use strict";

/* C6 Part A, check A3: THE TOOL LIST IS CLOSED.
 *
 * The safety argument in BRIEF-C6 section 2.1 is structural, not promised: a
 * model cannot change what it has no tool to call. That argument is worth exactly
 * as much as the closure of the list, so this file enumerates the registry at
 * TEST time and asserts it is the eight names the brief names. A tool added to
 * the module without a brief amendment fails here. */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const O = require("../onboarding-tools.cjs");

/* The seven, verbatim from DECISIONS:134 by way of BRIEF-C6 section 2.1. */
const SEVEN = ["set_name", "set_days", "add_exercise_from_catalogue", "set_machine_settings",
  "set_priorities", "review", "submit"];
const EIGHTH = "cannot_set_via_coach";

const tools = async () => {
  const model = (await import("../../m3/w7-preview/today/setup-model.mjs")).default;
  const catalogue = await import("../../m3/w7-preview/today/exercise-catalogue.mjs");
  const commands = await import("../../m3/w7-preview/today/setup-commands.mjs");
  return O.createOnboardingTools({ setup: model.createSetupModel({ today: "2030-02-04" }),
    catalogue, model, commands });
};

test("the registry is exactly the seven onboarding tools plus the tier-3 refusal", () => {
  assert.deepEqual(Object.keys(O.TIERS), SEVEN.concat([EIGHTH]));
  assert.equal(Object.keys(O.TIERS).length, 8);
});

test("the exported seven are the DECISIONS:134 names, in the order the questions are asked", () => {
  assert.deepEqual(O.ONBOARDING_TOOLS.slice(), SEVEN);
  assert.equal(O.ONBOARDING_TOOLS.length, 7);
});

test("the registry and the exported list cannot drift apart", () => {
  for (const name of O.ONBOARDING_TOOLS) assert.ok(name in O.TIERS, name + " is listed but not registered");
  for (const name of Object.keys(O.TIERS)) {
    assert.ok(name === EIGHTH || O.ONBOARDING_TOOLS.includes(name), name + " is registered but not listed");
  }
});

test("the registry is frozen, and so is the list", () => {
  assert.ok(Object.isFrozen(O.TIERS));
  assert.ok(Object.isFrozen(O.ONBOARDING_TOOLS));
  assert.throws(() => { "use strict"; O.TIERS.set_rep_target = 1; }, TypeError);
});

test("the tiers are the brief's tiers: review reads, the refusal refuses, the rest are facts", () => {
  assert.equal(O.TIERS.review, O.TIER.READ);
  assert.equal(O.TIERS[EIGHTH], O.TIER.REFUSED);
  for (const name of SEVEN) {
    if (name === "review") continue;
    assert.equal(O.TIERS[name], O.TIER.FACT, name + " is not a tier-1 fact");
  }
  assert.equal(Object.values(O.TIERS).filter((t) => t === O.TIER.READ).length, 1);
  assert.equal(Object.values(O.TIERS).filter((t) => t === O.TIER.REFUSED).length, 1);
  assert.equal(Object.values(O.TIERS).filter((t) => t === O.TIER.PROPOSAL).length, 0);
});

test("an unknown name is refused by CODE, and the refusal NAMES the tool that was tried", async () => {
  const t = await tools();
  const r = await t.dispatch("set_rep_target", { hi: 12 }, "turn-x");
  assert.equal(r.ok, false);
  assert.equal(r.code, O.C6_CODES.TOOL_NOT_IN_LIST);
  assert.equal(r.code, "ONBOARDING_TOOL_NOT_IN_LIST");
  assert.equal(r.tool, "set_rep_target");
  assert.match(r.reason, /^set_rep_target is not one of the seven onboarding tools$/);
});

test("the refusal lists the seven, so a transcript is diagnosable without a debugger", async () => {
  const t = await tools();
  const r = await t.dispatch("set_sets", {}, "turn-x");
  assert.deepEqual(r.allowed, SEVEN);
  assert.equal(r.state_unchanged, true);
  assert.equal(r.unavailable.code, "ONBOARDING_TOOL_NOT_IN_LIST");
  assert.match(r.unavailable.reason, /set_sets/);
});

test("there is NO default handler: every unknown name refuses, none falls through", async () => {
  const t = await tools();
  const invented = ["set_rep_target", "set_sets", "set_day_kind", "setName", "SET_NAME", "submit ",
    "review()", "", "__proto__", "constructor", "toString", "hasOwnProperty", "valueOf"];
  for (const name of invented) {
    const r = await t.dispatch(name, {}, "turn-x");
    assert.equal(r.ok, false, name + " reached a handler");
    assert.equal(r.code, "ONBOARDING_TOOL_NOT_IN_LIST", name + " got a different refusal");
    assert.equal(r.tool, name);
  }
});

test("inherited Object properties are not tools: the registry is checked with hasOwnProperty", async () => {
  const t = await tools();
  for (const name of ["toString", "constructor", "__proto__", "isPrototypeOf"]) {
    const r = await t.dispatch(name, {}, "turn-x");
    assert.equal(r.code, "ONBOARDING_TOOL_NOT_IN_LIST");
  }
});

test("the dispatcher never throws past the caller, whatever it is handed", async () => {
  const t = await tools();
  for (const name of [null, undefined, 42, {}, [], true, Symbol.iterator]) {
    const r = await t.dispatch(name, {}, "turn-x");
    assert.equal(r.ok, false);
    assert.equal(r.code, "ONBOARDING_TOOL_NOT_IN_LIST");
  }
  /* and a real tool handed rubbish refuses rather than throwing */
  for (const args of [null, undefined, 42, "x", []]) {
    const r = await t.dispatch("set_name", args, "turn-x");
    assert.equal(r.ok, false);
    assert.ok(r.unavailable.code);
  }
});

test("dispatch requires a turn id: provenance is not optional", async () => {
  const t = await tools();
  await assert.rejects(() => t.dispatch("review", {}, ""), /turn_id/);
  await assert.rejects(() => t.dispatch("review", {}, null), /turn_id/);
  assert.throws(() => t.openTurn(""), /turn_id/);
});

test("dispatch is the ONLY entry point: no tool is exported for direct call", () => {
  const exported = Object.keys(module.require("../onboarding-tools.cjs"));
  for (const name of SEVEN.concat([EIGHTH])) {
    assert.ok(!exported.includes(name), name + " is reachable without the dispatcher");
  }
  assert.ok(exported.includes("createOnboardingTools"));
});

test("the brief and the module agree on the seven names, read out of the brief itself", () => {
  const brief = fs.readFileSync(path.join(__dirname, "..", "BRIEF-C6-VOICE-ONBOARDING.md"), "utf8");
  for (const name of SEVEN.concat([EIGHTH])) {
    assert.ok(brief.includes("`" + name + "`"), "the brief does not name " + name);
  }
  /* and a name the brief does not carry is not in the registry */
  for (const invented of ["set_rep_target", "set_sets", "set_day_kind"]) {
    assert.ok(!(invented in O.TIERS), invented + " is registered and the brief does not name it");
  }
});
