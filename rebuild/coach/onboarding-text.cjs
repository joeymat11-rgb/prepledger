"use strict";

/* onboarding-text.cjs - the TEXT REHEARSAL of the voice onboarding (C6 Part A).
 *
 * THERE IS NO MODEL HERE AND NO NETWORK. A fixture file
 * (scripts/onboarding-script.json) holds one set of answers per athlete; a
 * scripted driver reads it and calls the seven tools, and a TEMPLATE renders what
 * the coach says. This is exactly the C5 shape (coach-text.cjs) applied to the
 * six setup questions, and it is the bar a later GPT-Live-1 adapter has to clear.
 *
 * ONE SET OF ANSWERS, TWO PATHS. `driveByTap` calls the screens' own setters and
 * `driveByVoice` calls the tools, and BOTH read the same fixture object. Nothing
 * can drift between them, because there is only one copy of the answers, and
 * test/onboarding-parity.test.cjs compares the ops they produce byte for byte.
 *
 * THE TEMPLATES CONTAIN NO DIGITS and no dash. Every figure arrives through
 * `d(tag, unit)`, which prints a tagged value's display and asserts the unit it
 * is being spoken into, so tools.untraceable() can decide mechanically whether a
 * sentence is allowed.
 */

const fs = require("node:fs");
const path = require("node:path");
const T = require("./tools.cjs");
const C = require("./coach-text.cjs");

const d = C.d;
const has = C.has;
const join = C.join;
const list = (parts) => parts.filter((p) => p !== "").join(", ");

const SCRIPT_PATH = path.join(__dirname, "scripts", "onboarding-script.json");
function loadScript(file) {
  return JSON.parse(fs.readFileSync(file || SCRIPT_PATH, "utf8"));
}

/* ------------------------------------------------------------ templates -- */

const TEMPLATES = Object.freeze({
  name: (v) => join(["Good to meet you, ", d(v.name, "text"), "."]),
  days: (v) => join([
    /* NOT "days a week": that reads as a rate (day/wk) and the tag is a plain
       count of days. The checker is right and the sentence changes. */
    "That is ", d(v.dayCount, "day"), " days in the gym: ",
    list(v.days.map((t) => d(t, "text"))), ". ",
    "Earned says: ", list(v.kinds.map((t) => d(t, "text"))), ". ",
    d(v.rule, "text"),
  ]),
  exercise: (v) => join([
    d(v.name, "text"), " on your ", d(v.day, "text"), " day. It works ", d(v.works, "text"), ".",
  ]),
  settings: (v) => join([
    d(v.name, "text"), ": ",
    has(v.first) ? "lightest setting " + d(v.first, "lb") + " lb" : "lightest setting not answered yet",
    has(v.inc) ? ", smallest jump " + d(v.inc, "lb") + " lb. " : ". ",
    v.rungs && v.rungs.length
      ? "The whole stack, smallest first: " + list(v.rungs.map((r) => d(r, "lb") + " lb")) + ". "
      : "",
    /* Earned's own sentence about its standard step, read back verbatim. */
    has(v.standardStep) ? d(v.standardStep, "text") : "",
  ]),
  priorities: (v) => join(["What matters most: ", list(v.priorities.map((p) => d(p, "text"))), "."]),
  review: (v) => join([
    has(v.name) ? d(v.name, "text") + ", here is your week. " : "Here is your week. ",
    list(v.days.map((t) => d(t, "text"))), ". ",
    v.exercises.map((e) => d(e.name, "text") + " on your " + d(e.day, "text")
      + " day, " + d(e.setsLine, "text") + ". ").join(""),
    "Earned's standard start: ", d(v.standardStart, "text"), " ",
    "What matters most: ", list(v.priorities.map((p) => d(p, "text"))), ". ",
    d(v.noLoad, "text"), " ",
    v.missing.length
      ? "Still to answer: " + list(v.missing.map((m) => d(m, "text"))) + " "
      : "",
  ]),
  submitted: (v) => join(["Recorded. ", d(v.start, "text"), "."]),
  refused: (v) => join([has(v.explanation) ? d(v.explanation, "text") : "",
    " Your week is unchanged."]),
  unavailable: (u) => {
    const said = typeof u.reason === "string" && u.reason ? u.reason : "I cannot answer that from what the app holds.";
    return join([said, /unchanged|nothing was recorded|not recorded/i.test(said) ? "" : " Nothing was recorded."]);
  },
});

/* ------------------------------------------------------- the two drivers -- */

/* PATH ONE: the screens' own setters, exactly as A4's six screens call them.
   No coach code runs here at all. */
function driveByTap(setup, fixture, { catalogue }) {
  setup.setName(fixture.name);
  for (const day of fixture.days) setup.toggleDay(String(day));
  for (const ex of fixture.exercises || []) {
    let row;
    if (ex.catalogue_id) row = setup.addFromCatalogue(ex.day, catalogue.byId(ex.catalogue_id));
    else {
      row = setup.addExercise(ex.day);
      if (row && typeof ex.name === "string" && ex.name) setup.setExerciseField(row.key, "n", ex.name);
      if (row && typeof ex.mg === "string" && ex.mg) setup.chooseMg(row.key, ex.mg);
      else if (row && typeof ex.mg_other === "string" && ex.mg_other) {
        setup.chooseMgOther(row.key);
        setup.setMgOther(row.key, ex.mg_other);
      }
    }
    /* "I don't know" writes nothing, on both paths. */
    if (row && ex.unknown !== true) {
      for (const field of ["first", "inc", "rungs"]) {
        if (typeof ex[field] === "string" && ex[field] !== "") setup.setExerciseField(row.key, field, ex[field]);
      }
    }
  }
  for (const label of fixture.priorities || []) setup.togglePriority(label);
  return setup.document();
}

/* PATH TWO: the seven tools, from the SAME fixture. Every tier-1 call carries the
   harness's own record of the spoken yes, never the model's. */
async function driveByVoice(tools, fixture, options = {}) {
  const tpl = options.templates || TEMPLATES;
  const say = [];
  const step = async (id, name, args, render) => {
    const turn = tools.openTurn("turn-" + fixture.id + "-" + id);
    const r = await turn.call(name, args);
    const line = r.ok ? render(r) : tpl.unavailable(r.unavailable);
    say.push({ id, tool: name, answer: line, turn_id: turn.turn_id,
      results: turn.results.slice(), untraceable: turn.untraceable(line), ok: r.ok === true, result: r });
    return r;
  };

  await step("q1", "set_name", { name: fixture.name, confirmed: true }, (r) => tpl.name(r.values));
  await step("q2", "set_days", { days: fixture.days.map(String), confirmed: true }, (r) => tpl.days(r.values));

  let n = 0;
  for (const ex of fixture.exercises || []) {
    n += 1;
    const added = await step("q3." + n, "add_exercise_from_catalogue", {
      day: ex.day, catalogue_id: ex.catalogue_id, name: ex.name, mg: ex.mg, mg_other: ex.mg_other,
      confirmed: true,
    }, (r) => tpl.exercise(r.values));
    await step("q4." + n, "set_machine_settings", {
      key: added.key, first: ex.first, inc: ex.inc, rungs: ex.rungs,
      unknown: ex.unknown === true, confirmed: true,
    }, (r) => tpl.settings(r.values));
  }

  await step("q5", "set_priorities", { priorities: (fixture.priorities || []).slice(), confirmed: true },
    (r) => tpl.priorities(r.values));
  const reviewed = await step("q6", "review", {}, (r) => tpl.review(r.values));
  const submitted = await step("q6.submit", "submit", { confirmed: true },
    (r) => tpl.submitted(r.values));

  const text = say.map((t) => t.answer).join("\n");
  return {
    turns: say, text, review: reviewed, submit: submitted,
    untraceable: say.filter((t) => t.untraceable.length).map((t) => ({ id: t.id, tokens: t.untraceable })),
    charter: T.charterViolations(text),
  };
}

module.exports = {
  TEMPLATES, ALL_TEMPLATES: TEMPLATES, loadScript, SCRIPT_PATH,
  driveByTap, driveByVoice, d, has, join, list,
};
