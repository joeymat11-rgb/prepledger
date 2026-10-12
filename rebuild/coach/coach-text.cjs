"use strict";

/* coach-text.cjs — the TEXT-FIRST coach the brief sequences before the voice
 * layer. There is NO model in here and no network: a fixed script of questions
 * (scripts/questions.json) is routed to a fixed intent, the intent calls the
 * tools, and the answer is rendered by a TEMPLATE that can only interpolate
 * tagged tool values.
 *
 * THE TEMPLATES CONTAIN NO NUMBERS. Not "about 2,300", not "roughly a pound" —
 * no digit appears in any template string, and templates.test proves it by
 * scanning their own source. Every figure in a transcript therefore arrives
 * through d(), which prints a tagged value's `display` and nothing else, and
 * tools.untraceable() can then decide mechanically whether the sentence is
 * allowed. That is the whole point: this prototype is the bar a later
 * GPT-Live-1 adapter has to clear, expressed as running code rather than prose.
 *
 * Blank is unknown. A tagged value with no display takes the template's blank
 * branch — a sentence that says the app does not know — never a zero, never a
 * filled-in default.
 */

const fs = require("node:fs");
const path = require("node:path");
const T = require("./tools.cjs");

/* COACH V1: the templates, the intent routing and answerOne() MOVED, byte for byte, to coach-intents.cjs (the
   browser-safe half, which the page bundles). This file keeps the script harness, which reads off disk, and
   re-exports the same objects under the same names. */
const I = require("./coach-intents.cjs");
const { d, has, join, TEMPLATES, TEMPLATES_2, ALL_TEMPLATES, READ_INTENTS, FACT_INTENTS, TIER3_INTENTS, answerOne } = I;

/* --------------------------------------------------------- the harness -- */

const SCRIPT_PATH = path.join(__dirname, "scripts", "questions.json");
function loadScript(file) {
  return JSON.parse(fs.readFileSync(file || SCRIPT_PATH, "utf8"));
}

/* Runs the whole script and returns a transcript plus the traceability verdict
   for every turn. Nothing here decides anything: the verdict is computed by
   tools.untraceable(), the same function the tests call. */
async function runScript(coach, options) {
  const opts = options || {};
  const script = opts.script || loadScript(opts.scriptPath);
  const templates = opts.templates || ALL_TEMPLATES;
  const memory = {};
  const turns = [];
  for (const question of script.questions) turns.push(await answerOne(coach, question, memory, templates));
  const text = turns.map((t) => t.ask + "\n" + t.answer).join("\n\n");
  return {
    turns, text,
    untraceable: turns.filter((t) => t.untraceable.length).map((t) => ({ id: t.id, tokens: t.untraceable })),
    charter: T.charterViolations(text),
  };
}

/* The per-turn context budget the brief demands ("send only what the question
   needs"). It is measured here, not asserted: a turn's context is exactly the
   question plus the tool results it actually called. */
function turnContextBytes(turn) {
  return Buffer.byteLength(JSON.stringify({ ask: turn.ask, results: turn.results }), "utf8");
}

module.exports = {
  ALL_TEMPLATES, TEMPLATES, TEMPLATES_2, READ_INTENTS, FACT_INTENTS, TIER3_INTENTS,
  answerOne, runScript, loadScript, turnContextBytes, SCRIPT_PATH, d, has, join,
};

/* Run it: node rebuild/coach/coach-text.cjs  — prints the transcript and the
   verdict. It composes the slice's REAL today adapter with no durable reading
   lane (readings: null), which is the honest offline shape: every engine number
   is real, and a weigh-in would be refused in words rather than written
   somewhere that can lose it. */
if (require.main === module) {
  const { createTodayModel } = require("../m3/w7-preview/today/today-model.cjs");
  const coach = T.createCoachTools({ today: createTodayModel({}) });
  runScript(coach).then((run) => {
    for (const turn of run.turns) {
      process.stdout.write("\n> " + turn.ask + "\n  " + turn.answer + "\n");
      if (turn.untraceable.length) process.stdout.write("  !! UNTRACEABLE: " + turn.untraceable.join(", ") + "\n");
    }
    process.stdout.write("\nturns: " + run.turns.length
      + " · untraceable turns: " + run.untraceable.length
      + " · charter violations: " + run.charter.length + "\n");
    process.exitCode = run.untraceable.length || run.charter.length ? 1 : 0;
  }).catch((error) => { process.stderr.write(String(error && error.stack) + "\n"); process.exitCode = 1; });
}
