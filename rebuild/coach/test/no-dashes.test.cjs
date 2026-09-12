"use strict";

/* THE OWNER'S NO-DASH RULE (DECISIONS:114 (1), owner verbatim: "no ai dashes are
 * allowed in the ui").
 *
 * The coach's spoken text IS the UI. So no en dash (U+2013) and no em dash
 * (U+2014) may appear in anything this lane writes for the athlete: a template's
 * own words, a tier-3 explanation, a refusal sentence, a cap or opt-in reason, a
 * scripted question. A colon, a comma or a new sentence says the same thing.
 *
 * CODE COMMENTS ARE NOT UI and keep their dashes; this file strips them before
 * scanning source.
 *
 * WHAT THIS LANE CANNOT FIX, stated rather than hidden: the engine's own prose
 * (rebuild/engine, rebuild/m3) is carried VERBATIM by design, dashes included,
 * and rebuild/engine is outside this lane's write scope. So the transcript check
 * below subtracts every tagged value the tools returned and asserts THE COACH'S
 * OWN CONNECTIVE TEXT is dash-free. Measured at the start of round 3: 19 dashes
 * in the 25-turn transcript, 18 of them inside engine prose and 1 authored here
 * (the protein template). That 1 is what this file drives to 0. */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const T = require("../tools.cjs");
const C = require("../coach-text.cjs");
const { createTodayModel } = require("../../m3/w7-preview/today/today-model.cjs");

const DASH = /[–—]/;
const DASH_G = /[–—]/g;
const dashes = (s) => (String(s === null || s === undefined ? "" : s).match(DASH_G) || []);
const at = (p) => path.join(__dirname, "..", p);
const coach = () => T.createCoachTools({ today: createTodayModel({}) });

/* Comments are not UI. Block first, then line comments, with `://` spared so a
   url inside a string is not mistaken for one. */
const stripComments = (src) => src
  .replace(/\/\*[\s\S]*?\*\//g, " ")
  .replace(/(^|[^:])\/\/[^\n]*/g, "$1");

test("no dash survives in any source string this lane writes for the athlete", () => {
  for (const file of ["tools.cjs", "coach-text.cjs", "local-world.mjs",
    /* C6 Part A: the onboarding modules are athlete-facing too. */
    "onboarding-tools.cjs", "onboarding-text.cjs",
    /* Coach wave one: so are the demo's. */
    "wave1-tools.cjs", "wave1-text.cjs", "machine-settings-commands.cjs"]) {
    const code = stripComments(fs.readFileSync(at(file), "utf8"));
    const offending = code.split("\n")
      .map((line, i) => [i + 1, line])
      .filter(([, line]) => DASH.test(line));
    assert.deepEqual(offending, [], file + " carries a dash outside a comment: "
      + JSON.stringify(offending.slice(0, 4)));
  }
});

test("no dash in any template's own words", () => {
  /* the same scan the digit test uses, with comments removed first */
  const STRING_LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g;
  for (const [name, fn] of Object.entries(C.ALL_TEMPLATES)) {
    for (const lit of stripComments(String(fn)).match(STRING_LITERAL) || []) {
      assert.ok(!DASH.test(lit), "template " + name + " carries a dash: " + lit);
    }
  }
});

/* C6 Part A, check A10. The onboarding coach is athlete-facing copy the same way
   the daily coach is, and it reads setup-model.mjs's own sentences back, so the
   rule has to hold over the whole rehearsal and not only over this lane's files. */
test("no dash in the onboarding tools, templates, fixtures or transcripts", async () => {
  const OB = require("../onboarding-tools.cjs");
  const OT = require("../onboarding-text.cjs");
  const STRING_LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g;

  for (const [name, fn] of Object.entries(OT.TEMPLATES)) {
    for (const lit of stripComments(String(fn)).match(STRING_LITERAL) || []) {
      assert.ok(!DASH.test(lit), "onboarding template " + name + " carries a dash: " + lit);
    }
  }
  for (const [topic, why] of Object.entries(OB.NEVER_VIA_COACH_SETUP)) {
    assert.deepEqual(dashes(why), [], "onboarding tier-3 " + topic + " carries a dash: " + why);
  }
  assert.deepEqual(dashes(fs.readFileSync(at("scripts/onboarding-script.json"), "utf8")), []);

  /* and the rehearsal itself, every fixture, every spoken line */
  const model = (await import("../../m3/w7-preview/today/setup-model.mjs")).default;
  const catalogue = await import("../../m3/w7-preview/today/exercise-catalogue.mjs");
  const commands = await import("../../m3/w7-preview/today/setup-commands.mjs");
  const host = () => { const ops = []; return { async save() { ops.push(1); return { ok: ops.length === 1, state: 0, code: ops.length === 1 ? null : "SETUP_ALREADY_RECORDED", copy: null, op_id: "op-1" }; } }; };
  let lines = 0;
  for (const fixture of OT.loadScript().fixtures) {
    const tools = OB.createOnboardingTools({ setup: model.createSetupModel({ today: "2030-02-04" }),
      catalogue, model, commands, effective: { local_date: "2030-02-04", local_time: "13:00", utc_offset: "-05:00" },
      host: host() });
    const run = await OT.driveByVoice(tools, fixture);
    for (const turn of run.turns) {
      lines += 1;
      assert.deepEqual(dashes(turn.answer), [], fixture.id + " " + turn.id + " speaks a dash: " + turn.answer);
    }
  }
  assert.ok(lines >= 48, "the sweep did not reach the transcripts");
});

test("no dash in the tier-3 explanations or the scripted questions", () => {
  for (const [topic, why] of Object.entries(T.NEVER_VIA_COACH)) {
    assert.deepEqual(dashes(why), [], "tier-3 " + topic + " carries a dash: " + why);
  }
  const script = C.loadScript();
  for (const q of script.questions) {
    assert.deepEqual(dashes(JSON.stringify(q)), [], q.id + " carries a dash: " + q.ask);
  }
});

test("no dash in any refusal the athlete can reach", async () => {
  const c = coach();
  const said = [];
  const collect = (r) => {
    if (r && r.unavailable) said.push(r.unavailable.reason, r.unavailable.source);
    if (r && r.values) for (const tag of T.collectTagged(r)) said.push(tag.display);
  };

  const turn = c.openTurn("turn-refusals");
  /* every tier-3 topic, named and unknown */
  for (const topic of T.TIER3_TOPICS.concat(["phase_override", "nonsense"])) {
    collect(await turn.call.cannot_change_via_coach({ topic }));
  }
  /* every tier-1 tool with no yes, and then with a yes but no lane */
  for (const name of ["record_pain_or_soreness", "equipment_unavailable_today", "time_away",
    "answer_checkin", "correct_set"]) {
    collect(await turn.call[name]({}));
    collect(await turn.call[name]({ confirmed: true }));
  }
  /* the gym and check-in reads with nothing composed */
  for (const name of ["current_set", "next_set", "last_comparable_performance", "today_checkin"]) {
    collect(await turn.call[name]({}));
  }
  /* tier 2: no entry point, a number in the payload, an id nobody issued, no consent surface */
  for (const args of [{ fact: "pain" }, {}, { fact: "volume", note: { sets: 7 } }]) {
    collect(await turn.call.request_replan(args));
  }
  collect(await turn.call.accept_proposal({ proposal_id: "prop-invented", confirmed: true }));
  const issued = await turn.call.request_replan({ fact: "volume" });
  collect(await turn.call.accept_proposal({ proposal_id: issued.proposal.proposal_id, confirmed: true }));
  /* why_this_instruction on a topic it does not answer */
  collect(await turn.call.why_this_instruction({ topic: "the weather" }));

  /* and the sentence the harness actually speaks for each of them */
  for (const r of turn.results) {
    if (!r.ok) said.push(C.ALL_TEMPLATES.unavailable(r.unavailable));
    else if (r.refused) said.push(C.ALL_TEMPLATES.refused(r.values));
  }

  const engineProse = new Set(turn.results.flatMap((r) =>
    T.collectTagged(r).filter((t) => /^(today|energy|gym-model|checkin-model|progression|volume|policy)/.test(t.source))
      .map((t) => t.display)));
  for (const line of said) {
    if (!line || !DASH.test(line)) continue;
    assert.ok([...engineProse].some((p) => p && line.includes(p) && DASH.test(p)),
      "the coach wrote a dash of its own: " + line);
  }
});

test("no dash in any cost-cap or opt-in reason", () => {
  const NOW = "2030-02-04T13:00:00.000Z";
  const example = JSON.parse(fs.readFileSync(at("cap.example.json"), "utf8"));
  const good = () => {
    const r = JSON.parse(JSON.stringify(example));
    for (const k of Object.keys(r)) if (k.charAt(0) === "_") delete r[k];
    return r;
  };
  const optIn = { user: "joe", accepted: true, accepted_at: "2030-02-01T09:00:00.000Z",
    screen_version: "coach-opt-in-v1", wording: "Your voice audio and the text of this conversation "
      + "leave this phone and are sent to OpenAI's API so it can answer you." };

  const reasons = [];
  for (const record of [undefined, null, {}, [], example, Object.assign(good(), { verified: false }),
    Object.assign(good(), { cap_usd_session: 999 }), Object.assign(good(), { verified_at: "last Tuesday" }),
    Object.assign(good(), { verified_at: "2029-01-01T00:00:00.000Z" }),
    Object.assign(good(), { notes: "sk-ABCDEFGHIJKLMNOPQRSTUV" }), good()]) {
    reasons.push(T.verifyCostCap(record, { now: NOW }).reason);
  }
  for (const call of [
    { cap: good(), now: NOW },
    { cap: good(), now: NOW, optIn: true, user: "joe" },
    { cap: good(), now: NOW, optIn, user: "dad" },
    { cap: good(), now: NOW, optIn, user: "mum" },
    { cap: good(), now: NOW, optIn: Object.assign({}, optIn, { wording: "Turn it on." }), user: "joe" },
    { cap: good(), now: NOW, optIn: Object.assign({}, optIn, { accepted: "yes" }), user: "joe" },
    { cap: good(), now: NOW, optIn: Object.assign({}, optIn, { screen_version: "" }), user: "joe" },
    { cap: good(), now: NOW, optIn, user: "joe" },
  ]) {
    reasons.push(T.startLiveSession(call).reason);
  }
  for (const reason of reasons) {
    assert.deepEqual(dashes(reason), [], "a gate refused with a dash: " + reason);
  }
  assert.ok(reasons.filter(Boolean).length >= 15, "the sweep did not reach the refusals");
});

test("the 25-turn transcript carries no dash the COACH wrote", async () => {
  const run = await C.runScript(coach());

  let total = 0, own = 0;
  for (const turn of run.turns) {
    total += dashes(turn.answer).length;
    /* subtract every tagged value and every carried refusal sentence: what is
       left is the coach's own connective text */
    let rest = turn.answer;
    const carried = [];
    for (const r of turn.results) {
      for (const tag of T.collectTagged(r)) if (tag.display) carried.push(tag.display);
      if (r.unavailable && r.unavailable.reason) carried.push(r.unavailable.reason);
    }
    carried.sort((a, b) => b.length - a.length);
    for (const piece of carried) {
      const flat = String(piece).replace(/\s+/g, " ").trim();
      if (flat && rest.includes(flat)) rest = rest.split(flat).join(" ");
    }
    const mine = dashes(rest);
    own += mine.length;
    assert.deepEqual(mine, [], turn.id + " speaks a dash the coach wrote: " + JSON.stringify(rest.slice(0, 160)));
  }
  assert.equal(own, 0);
  /* the engine's own prose still carries dashes, and that is a rebuild/engine
     change this lane may not make. The number is recorded so it cannot drift
     upward unnoticed, and so the residual is visible rather than implied. */
  assert.ok(total <= 17, "engine prose dashes rose to " + total + "; re-check what the coach is carrying");
});
