/* S9-TODAY-CARRY, S2. DECISIONS:534 (b); P3-TODAY-COPY-DIAG section S2.

   THE DEFECT, on the owner's own phone (DECISIONS:533, defect 2): the body text under
   "Your plan for today" was a sentence that starts in its middle, "bed, wake, and how long
   you took to drop off: the body-composition read leans on this harder than anything else
   you enter". Nothing was truncated. today-app.cjs:868-870 bound marchingOrder.why ALONE,
   and the engine writes a marching order in four parts (rebuild/engine/today.cjs
   marchingOrder: a cue, the action, the why, the target line) of which the why is a
   subordinate clause. The sleep rung came first because an imported history has no last
   night on record - which no fixture could reach: the synthetic athlete writes a night for
   all 28 prior days (fixtures.cjs:22).

   WHAT THESE CELLS PIN, and why they are not the implementation restated (review R1, M2):
   the SENTENCE, over the real imported shape built from the fixture of record and over
   every marching-order shape the engine can produce - that it is whole, that it is the
   engine's own words in the engine's own order, and that a state with no order at all
   leaves the slot a complete sentence rather than a fragment.

   FIGURES ARE SYNTHETIC. rebuild/lanes/d/p3-real-shape/legacy-fixture.cjs is the fixture of
   record for the imported shape and carries not one of the owner's measurements. */

import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const TODAY = "../../../m3/w7-preview/today/";
const M = require(TODAY + "today-model.cjs");
const { createTodayEngine } = require(TODAY + "today-engine.cjs");
const { plainCopy } = require(TODAY + "plain-copy.cjs");
const design = require(TODAY + "design.cjs");
const Fixture = require("../../d/p3-real-shape/legacy-fixture.cjs");

/* The day the import lands in lane D's own harness (real-shape-support.mjs IMPORT_DAY). */
const IMPORT_DAY = "2026-09-17";
const DAY = M.SYNTHETIC_DAY;
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);
const ARROW = String.fromCharCode(0x2192);
/* Built rather than typed: DECISIONS:114 forbids either dash in a source file. */
const DASH = new RegExp("[" + EN + EM + "]");
const WORDS = new RegExp("[\\s" + EN + EM + "]+");

/* THE GOLDEN. The whole sentence the owner's own screen shape produces, written out here
   rather than composed from the engine at test time: a cell that rebuilt it from the same
   parts the product uses would restate the implementation and could not fail (R1 M2). */
const GOLDEN = "Before coffee, log last night: bed, wake, and how long you took to drop "
  + "off: the body-composition read leans on this harder than anything else you enter";

/* The owner's own headline, built rather than typed (DECISIONS:114 forbids U+2014 in a
   source file): the card title rebuild/engine/writers.cjs:1899 composes. */
const OWNER_TITLE = "Side delt " + EM + " EARNED VOLUME: 10 " + ARROW + " 12 WEEKLY SETS";
const proposal = (day) => ({
  id: "volpush_sidedelt_" + day, rid: "volpush_sidedelt_" + day, d: day, resolved: false,
  title: OWNER_TITLE, why: "Side delt has earned more weekly volume. Nothing else moves this week.",
});

const importedShape = () => Fixture.legacyState();
const viewOf = (state, day) => M.createTodayModel({ today: day, basisState: state }).read();
const clockAt = (day, hour) => ({ ...M.engineClockFor(day), hour: () => hour });
const engineAt = (day, hour) => createTodayEngine({ clock: clockAt(day, hour) });
const yesterdayOf = (day) => {
  const d = new Date(day + "T12:00:00.000Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
};

test("S2 golden - the real imported shape reads as one whole sentence", () => {
  const view = viewOf(importedShape(), IMPORT_DAY);
  const order = view.marchingOrder;

  /* The defect is REACHABLE on this shape, so this cell is not asserting into thin air:
     the engine's first owed rung really is the night, and its why really does begin in
     the middle of a sentence. */
  assert.equal(order.owed, true, "the imported shape owes something on the day it lands");
  assert.equal(order.kind, "night", "the night rung is still first for a history with no last night");
  assert.match(order.why, /^[a-z]/, "the engine's why is still a subordinate clause");

  assert.equal(plainCopy(view.orderSentence), GOLDEN);
  assert.notEqual(plainCopy(view.orderSentence), plainCopy(order.why),
    "the slot still shows the clause alone");
});

test("S2 - an open proposal changes neither the sentence nor the engine's headline", () => {
  const state = importedShape();
  state.proposals = [proposal(IMPORT_DAY)];
  const view = viewOf(state, IMPORT_DAY);

  assert.equal(plainCopy(view.orderSentence), GOLDEN, "S2 does not depend on S1");
  /* S1 (the hotfix, DECISIONS:534 (a)) over the same imported shape: the headline is an
     engine title the layout gate knows, never the proposal's card title. */
  assert.notEqual(view.nowModel.move.title, OWNER_TITLE);
  assert(design.headlineVocabulary().includes(view.nowModel.move.title),
    "the headline is not a string the layout is measured against: " + view.nowModel.move.title);
  assert.equal(view.nowModel.decisionsN, 1, "the count of what is waiting is still the real state's");
});

/* EVERY MARCHING-ORDER SHAPE THE ENGINE CAN PRODUCE. rebuild/engine/today.cjs nowFocus
   pushes four owed rungs (night, weight, day, yesterday) and marchingOrder falls through
   to its standing if-then when nothing is owed. Each state below is built from a fixture
   basis and driven only by the accepted engine (applyRead) or by the day's own log, and
   each is read at the hour that rung belongs to. */
function shapes() {
  const engineMorning = engineAt(DAY, 8);
  const weighed = engineMorning.applyRead(M.createBasisState(DAY), DAY, 179.4, { hour: 8 });
  const dayClosed = JSON.parse(JSON.stringify(weighed));
  dayClosed.dailyLogs = { ...(dayClosed.dailyLogs || {}) };
  dayClosed.dailyLogs[DAY] = { cal: 2200, pro: 160, steps: 9000 };
  delete dayClosed.dailyLogs[yesterdayOf(DAY)];
  const allClosed = JSON.parse(JSON.stringify(dayClosed));
  allClosed.dailyLogs[yesterdayOf(DAY)] = { cal: 2150, pro: 158, steps: 8800 };
  return [
    { name: "night", state: importedShape(), day: IMPORT_DAY, hour: 8 },
    { name: "weight", state: M.createBasisState(DAY), day: DAY, hour: 8 },
    { name: "day", state: weighed, day: DAY, hour: 19 },
    { name: "yesterday", state: dayClosed, day: DAY, hour: 19 },
    { name: "nothing owed", state: allClosed, day: DAY, hour: 19 },
  ];
}

test("S2 - every marching-order shape composes one whole sentence, and drops no engine word", () => {
  const seen = [];
  for (const shape of shapes()) {
    const order = engineAt(shape.day, shape.hour).marchingOrder(shape.state);
    const sentence = M.marchingOrderSentence(order);
    const where = shape.name + " (kind " + order.kind + ", owed " + order.owed + ")";
    seen.push(shape.name === "nothing owed" ? "nothing owed" : order.kind);

    assert.equal(typeof sentence, "string", where + ": no sentence was composed");
    assert.match(sentence, /^[A-Z]/, where + ": the sentence still starts mid clause");
    assert(sentence.startsWith(order.ifText), where + ": the engine's cue is not what it opens with");
    assert(sentence.includes(order.thenText), where + ": the action the cue belongs under is missing");
    assert(sentence.endsWith(order.why), where + ": the engine's reason is not carried whole");
    assert.notEqual(sentence, order.why, where + ": the clause is still printed alone");

    const plain = plainCopy(sentence, "instruction-why");
    assert.equal(DASH.test(plain), false, where + ": a dash reached the athlete");
    for (const word of sentence.split(WORDS).filter(Boolean)) {
      assert(plain.includes(word), where + ': the normaliser dropped "' + word + '"');
    }
  }
  assert.deepEqual(seen, ["night", "weight", "day", "yesterday", "nothing owed"],
    "a marching-order shape this cell claims to walk was not reached: " + seen.join(", "));
});

test("S2 - with no marching order there is no half sentence, so the slot falls back whole", () => {
  /* today-model.cjs empties marchingOrder while a real athlete's own state is still being
     adopted (P0-B r3 N3), and today-app.cjs then prints statusFace.cause, which is a whole
     engine sentence. A composer that returned a half line here would put the fragment back
     by another door. */
  for (const order of [undefined, null, {}, { owed: true, kind: "night" },
    { owed: true, ifText: "Before coffee", thenText: "", why: "bed, wake" },
    { owed: true, ifText: "", thenText: "log last night", why: "bed, wake" },
    { owed: true, ifText: "Before coffee", thenText: "log last night", why: "" }]) {
    assert.equal(M.marchingOrderSentence(order), null,
      "a part is missing and a sentence was composed anyway: " + JSON.stringify(order));
  }
  const view = M.createTodayModel({ today: DAY }).read();
  assert.equal(typeof view.orderSentence, "string", "the fixture shape still composes one");
});

/* The LITERAL RUNS of a vocabulary entry: the words an athlete reads whatever the entry's
   ${...} placeholders resolve to. `covers` asks whether one entry's literal runs appear, in
   order, inside a headline the product actually rendered. */
const literalRuns = (entry) => entry.split(/\$\{[^}]*\}/)
  .map((run) => plainCopy(run, "instruction").trim().toUpperCase())
  .filter((run) => run.length >= 3);
function covers(entry, rendered) {
  const runs = literalRuns(entry);
  if (!runs.length) return false;
  let at = 0;
  for (const run of runs) {
    const found = rendered.indexOf(run, at);
    if (found < 0) return false;
    at = found + run.length;
  }
  return true;
}

test("S2 - the headline vocabulary now sees the title the owner actually read", () => {
  /* DECISIONS:534 (b). design.cjs harvested only quoted `title:` literals, so the volume
     push card's title - a template literal passed as propose()'s second argument, and the
     45-character all-caps string on his own screen - was measured by neither the copy gate
     (copy.test.mjs) nor the fluid-floor layout check (browser-check.mjs). */
  const titles = design.headlineVocabulary();
  const earned = titles.filter((t) => t.includes("EARNED VOLUME:"));
  assert.equal(earned.length > 0, true, "the EARNED VOLUME card title is still invisible to the layout gate");
  assert(titles.some((t) => t.includes("VOLUME +1")), "a template-literal title is still unseen");

  /* REVIEW R1, NOTE N7. What stood here - every entry equals its own upper case - could not
     fail: headlineVocabulary upper-cases each entry as it collects it (design.cjs, the
     `.toUpperCase()` on the add), so the assertion was satisfied by construction, which is
     the exact flaw R1 M2 raised against the S1 cell. Two falsifiable questions replace it.
     First: do the vocabulary's own literal words cover the headline the owner READ? The
     tip's collector finds 15 entries and not one of them covers it; this branch's finds 30
     and one does, so this assertion is red against the unchanged design.cjs. */
  const rendered = plainCopy(OWNER_TITLE, "instruction").toUpperCase();
  assert(titles.some((t) => covers(t, rendered)),
    "no entry's literal words cover the headline the owner read: " + rendered);

  /* Second: the headline the product actually puts in the slot, for every shape this cell
     walks and for the imported shape with a decision open, is a string the approved layout
     is measured against. This ties the S1 fix to the gate: a projection that let a card
     title through again renders a string no entry carries, and this goes red. */
  const waiting = importedShape();
  waiting.proposals = [proposal(IMPORT_DAY)];
  const walked = [...shapes(), { name: "imported + open proposal", state: waiting, day: IMPORT_DAY }];
  for (const shape of walked) {
    const headline = viewOf(shape.state, shape.day).nowModel.move.title;
    assert(titles.includes(headline),
      shape.name + ": the headline is outside the measured vocabulary: " + headline);
  }

  for (const title of titles) {
    const plain = plainCopy(title, "instruction");
    assert.equal(DASH.test(plain), false, "a dash survives the normaliser: " + title);
  }
});
