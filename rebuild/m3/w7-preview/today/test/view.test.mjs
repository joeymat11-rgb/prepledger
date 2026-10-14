/* A1 — the view: the owner-approved 2026-09-08 Today screen bound to the real adapter.
   These tests prove that every figure on screen came from the engine or a stored
   operation, that the engine's own reading note is shown rather than dropped (review F1),
   that the screens this slice does not build say so, and that every text input the page
   actually renders is at least 16px (the iOS zoom rule, review F4).

   A2 review B2: the weigh-in's store of record is now the accepted encrypted
   repository (reading-host.mjs), so this file drives the real durable lane over
   fake-indexeddb and awaits the transaction, exactly as the page does. It needs
   rebuild/m3/w6's own dependencies for that. */

import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import fs from "node:fs";
import { JSDOM } from "jsdom";
import { faultDatabase } from "../../../w6/test/support.mjs";
import { createReadingHost } from "../reading-host.mjs";
import { DATABASE, RESTORE_REQUIRED } from "../gym-host.mjs";
import { boot } from "../today-entry.mjs";
import Engine from "../../../../engine/index.cjs";
import app from "../today-app.cjs";
import TodayModel from "../today-model.cjs";
import design from "../design.cjs";
/* P1 (DECISIONS:114 (1)): the engine's own words reach the slot through the render
   boundary, so a slot is compared with plainCopy(the engine's value), never with a
   sentence typed into this file. The comparison is still against the engine. */
import PlainCopy from "../plain-copy.cjs";

const { createEngine } = Engine;
const { plainCopy } = PlainCopy;
const { mountToday, morningLine, trendLine, calorieBand, calorieHeadline } = app;
const { createTodayModel, createBasisState, engineClockFor, SYNTHETIC_DAY } = TodayModel;

const DAY = SYNTHETIC_DAY;
const money = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/* The approved prototypes' numbers are fictional (rebuild/m1/MOCK.md). These particular
   figures cannot be a value this synthetic athlete's engine produces, so seeing one means
   template text survived instead of being bound. Substring checks, not word-boundary
   regexes: "2,300 kcal" has no word boundary after the 0 in some renderings, and a \b
   test there silently passes whatever is on screen.

   The REAL guard is stronger and lives in two places: every figure on Today is asserted
   equal to the reference engine's own value slot by slot, and no digit at all may appear
   outside a bound slot. A number the engine also happens to produce (the rounded calorie
   headline really is 2,300 for this fixture) is therefore allowed to appear, because the
   slot test proves where it came from. */
const FICTIONAL = ["2,252", "2,344", "235 g", "180.9 lb", "181.3 lb", "135 lb",
  "About 60 min", "9 exercises", "9 reps", "1.1 lb/week"];

function shell() {
  return design.shellHtml().replace("<!-- APPROVED_TEMPLATES -->", design.templateHtml());
}
/* C4b: no page-minted device keys — the host opens this device's own local era
   (one installation per IndexedDB factory), so one factory is one device. */
async function lane(options = {}) {
  const fault = options.fault || faultDatabase();
  const open = () => createReadingHost({ day: DAY, indexedDB: fault.indexedDB, crypto: webcrypto });
  return { fault, open, readings: await open() };
}
async function setup(options = {}) {
  const dom = new JSDOM(shell(), { url: "http://127.0.0.1:4178/" });
  const doc = dom.window.document;
  const store = options.lane || await lane();
  const model = options.model || createTodayModel({ today: DAY, readings: store.readings });
  const api = mountToday(doc, model, options.mount || {});
  API.set(doc, api);
  return { dom, doc, model, api, lane: store, close: () => store.readings.close() };
}
/* S12b R6 (DECISIONS:915 (4)): Start no longer opens the weigh-in sheet. The sheet is still the page's
   (openWeighIn, the same one write site), so the cells that drive it open it through the api the page
   returns; the weigh-in a man reaches on Today is the morning card's own form (the R6 cells below). */
const API = new WeakMap();
const phoneText = (doc) => doc.getElementById("phone").textContent;
const slot = (doc, name) => doc.querySelector(`[data-slot="${name}"]`);
/* P9 (PM, the Today repeats; supersession pending in the ledger). Call 6: Today's five quiet links are the More
   sheet's rows, so a cell that tapped a link on Today's face taps Today's one More row and then the row, as the
   athlete does. Call 2: the Recovery row is gone, so a cell that tapped it taps the Log today card and its Check in
   row; back from the check-in, Today opens that sheet again (POLISH 7), and backToToday closes it with Done. */
function viaMore(doc, selector) {
  const more = doc.querySelector('[data-slot="more-entry"]');
  assert(more, "Today carries its one More row");
  more.click();
  const row = doc.querySelector('[data-slot="more-sheet"] ' + selector);
  assert(row, "the More sheet carries " + selector);
  row.click();
}
function viaLogToday(doc) {
  const card = doc.querySelector("#card-log");
  assert(card && !card.hidden, "Today carries the Log today card");
  card.click();
  const row = doc.querySelector('[data-slot="log-sheet"] [data-slot="log-checkin-go"]');
  assert(row, "the Log today sheet carries its Check in row");
  row.click();
}
function backToToday(doc) {
  doc.querySelector('[data-go="today"]').click();
  const done = doc.querySelector('[data-slot="log-sheet"] [data-slot="log-done"]');
  if (done) done.click();
}

/* S12 SC-9 (red first: the PM's runs s12-pmrun2 at 96551fb and s12-pmrun1 at the S12 head,
   view.test.mjs:101 'CLOSE THE BOOKS FIRST' !== 'Chest', :148 'NOTHING NEEDS YOU' !== 'Chest',
   :492 the same "before"). The look's demo basis carries the board's ONE open proposal
   (today-model.cjs withBoardProposal, C-UI-3 R1, DECISIONS:826; SC-9's fixture consumers), and
   the engine makes the first open card's title its move. Today gives that card its own proposal
   card and keeps the headline the engine's OWN move over the SAME state with its proposals set
   aside (today-model.cjs planMove; DECISIONS:534 (a); adapter.test.mjs assertHeadlineLaw). The
   bare identity these cells asserted is the proposal-free half of that law; so each now compares
   with the reference engine over the state with its proposals set aside, and first says that the
   state really does carry exactly that one card and that the engine really would have put it on
   the move, so the comparison cannot pass by accident. */
const BOARD_CARD_TITLE = "Chest";
function engineHeadline(reference, state) {
  const open = (state.proposals || []).filter((p) => p && !p.resolved);
  assert.equal(open.length + (state.agentProposals || []).length, 1,
    "the demo state carries the board's one open proposal (C-UI-3 R1)");
  assert.equal(open[0].title, BOARD_CARD_TITLE, "and it is the board's card");
  assert.equal(reference.nowModel(state).move.title, BOARD_CARD_TITLE,
    "the engine no longer puts the open card's title on its move, so this law guards nothing");
  const bare = JSON.parse(JSON.stringify(state));
  bare.proposals = [];
  bare.agentProposals = [];
  const title = reference.nowModel(bare).move.title;
  assert.notEqual(title, BOARD_CARD_TITLE, "the card's title would be the headline");
  return title;
}

/* The sheet's submit handler awaits a real encrypted transaction, so the test has
   to wait for it too — the same wait a person makes. */
async function settle(doc) {
  for (let tick = 0; tick < 200; tick++) {
    await new Promise((resolve) => setTimeout(resolve, 2));
    const open = doc.querySelector('[role="dialog"]');
    if (!open) return;
    if (doc.getElementById("weigh-error").textContent.trim().length > 0) return;
  }
  throw new Error("the weigh-in never settled");
}
async function weighIn(dom, doc, value) {
  API.get(doc).openWeighIn();   /* S12b R6: was slot(doc, "primary").click() while the weight was owed */
  const sheet = doc.querySelector('[role="dialog"]');
  doc.getElementById("morning-weight").value = String(value);
  sheet.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
  await settle(doc);
  return sheet;
}

test("Today paints the approved design from engine values only", async () => {
  const kit = await setup();
  const { doc, model } = kit;
  const view = model.read();
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const state = createBasisState(DAY);

  assert.equal(doc.querySelector(".brand").textContent, "Earned");
  assert.equal(doc.querySelector(".label").textContent, "Your plan for today");
  assert.equal(slot(doc, "instruction").textContent, plainCopy(engineHeadline(reference, state)));   /* S12 SC-9 */
  /* S9-TODAY-CARRY, S2 (DECISIONS:534 (b)). The slot carries the engine's WHOLE marching
     order - the cue, the action it belongs under and the reason - and not the reason
     alone, which is a subordinate clause and read on the owner's phone as a sentence
     starting in its middle. Composed here from the REFERENCE engine's own parts. */
  const order = reference.marchingOrder(state);
  assert.equal(slot(doc, "instruction-why").textContent,
    plainCopy(order.ifText + ", " + order.thenText + ": " + order.why));
  assert.notEqual(slot(doc, "instruction-why").textContent, plainCopy(order.why),
    "the slot is back to printing the clause alone");
  assert.equal(slot(doc, "workout-title").textContent, plainCopy(reference.nowModel(state).workout.title));
  assert.equal(slot(doc, "workout-count").textContent,
    reference.genSession(state, DAY, null).ex.length + " exercises · Your set targets are ready");
  assert.equal(slot(doc, "kcal-note").textContent, calorieBand(reference.calorieTarget(state)));
  assert.equal(slot(doc, "protein").textContent, money.format(reference.proteinTarget(state).g));
  assert.equal(slot(doc, "morning").textContent, "This morning: not logged yet");
  assert.equal(view.hasReadToday, false);
  for (const figure of FICTIONAL) assert(!phoneText(doc).includes(figure), "prototype figure on screen: " + figure);
  kit.close();
});

test("S12b R6: before a weigh-in the primary action is Start, and the engine's marching order is the sentence under the instruction", async () => {
  const kit = await setup();
  const view = kit.model.read();
  /* S12b R6 (DECISIONS:915 (4); this cell pinned the P0-C gate: the label was the marching order's
     thenText and the click opened the weigh-in sheet). The weigh-in no longer gates the workout: the
     label names the workout, never the weigh-in, the click opens the workout, and the weigh-in is the
     morning card's own form. The marching order keeps its place, whole, under the instruction. */
  assert.equal(view.hasReadToday, false, "the morning really is owed");
  /* P9 round 2 (DECISIONS:1003 (1); was: the label is plainCopy("Start " + view.workout.title)): the workout is named
     once, by the card Start sits in, in the engine's own words, and Start names the tap. */
  assert.equal(slot(kit.doc, "primary-label").textContent, app.START_WORKOUT);
  assert.equal(app.START_WORKOUT, "Start workout");
  assert.equal(slot(kit.doc, "workout-title").textContent, plainCopy(view.workout.title), "the card names the workout");
  assert(slot(kit.doc, "primary").closest("#card-train") === kit.doc.querySelector("#card-train"), "and Start is that card's");
  assert(!slot(kit.doc, "primary-label").textContent.includes(view.workout.title), "the workout is not named twice");
  assert.notEqual(slot(kit.doc, "primary-label").textContent.toLowerCase(), view.marchingOrder.thenText.toLowerCase(),
    "the engine's marching order no longer heads Start");
  assert(kit.doc.querySelector('#card-weigh [data-slot="weigh-form"] #weight'), "the weigh-in is one tap away on the morning card");
  slot(kit.doc, "primary").click();
  assert.equal(kit.doc.querySelector('[role="dialog"]'), null, "Start opens no weigh-in sheet");
  assert.equal(kit.api.screen(), "workout", "Start opens the workout with the weight owed");
  kit.api.render("today");
  /* S9-TODAY-CARRY, S2. Same law at the other end of the same binding: whole sentence,
     the engine's own words, and never the clause on its own. */
  const order = view.marchingOrder;
  assert.equal(slot(kit.doc, "instruction-why").textContent,
    plainCopy(order.ifText + ", " + order.thenText + ": " + order.why));
  assert.match(slot(kit.doc, "instruction-why").textContent, /^[A-Z]/,
    "the sentence under the instruction still starts mid clause");
  assert.notEqual(slot(kit.doc, "instruction-why").textContent, plainCopy(order.why),
    "the slot is back to printing the clause alone");
  kit.close();
});

test("a weigh-in through the sheet rebinds every engine-derived value on Today", async () => {
  const kit = await setup();
  const { dom, doc, model } = kit;
  await weighIn(dom, doc, 179.4);
  assert.equal(doc.querySelector('[role="dialog"]'), null, "the sheet closed");
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const state = reference.applyRead(createBasisState(DAY), DAY, 179.4, { hour: 8 });
  assert.match(slot(doc, "morning").textContent, /^This morning ✓ 179\.4 lb/);
  assert.equal(slot(doc, "trend").textContent,
    "Weight trend " + reference.nowModel(state).headed.weight.toFixed(1) + " lb");
  assert.equal(slot(doc, "instruction").textContent, plainCopy(engineHeadline(reference, state)));   /* S12 SC-9 */
  assert.match(slot(doc, "primary-label").textContent, /^Start /);
  assert.equal(model.read().hasReadToday, true);
  for (const figure of FICTIONAL) assert(!phoneText(doc).includes(figure), "prototype figure on screen: " + figure);
  kit.close();
});

/* ---- review F1: the engine's reading note is shown, not dropped ---- */
test("a spike reading renders the ENGINE's own note beside it; a quiet reading renders none", async () => {
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const spikeState = reference.applyRead(createBasisState(DAY), DAY, 191.7, { hour: 8 });
  const spikeNote = spikeState.reads.at(-1).note;
  assert(spikeNote && spikeNote.length > 0, "the accepted writer really does attach a note to a spike");

  const spike = await setup();
  await weighIn(spike.dom, spike.doc, 191.7);
  const shown = slot(spike.doc, "morning").textContent;
  /* P1: the note is the ENGINE's, still shown whole, with its dash rewritten at the
     render boundary (DECISIONS:114 (1)). "spike — damped in trend" is the brief's own
     worked example and lands as "spike: damped in trend". */
  assert.equal(shown, plainCopy("This morning ✓ 191.7 lb · " + spikeNote));
  assert(spikeNote.includes("—") || spikeNote.includes("–")
    ? shown.includes(plainCopy(spikeNote)) : shown.includes(spikeNote),
    "the engine's note is on screen, dash and all rewritten");
  assert.match(spike.doc.getElementById("phone").textContent,
    new RegExp(plainCopy(spikeNote).slice(0, 12).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  spike.close();

  const quietState = reference.applyRead(createBasisState(DAY), DAY, 179.4, { hour: 8 });
  assert.equal(quietState.reads.at(-1).note, "", "this reading carries no note");
  const quiet = await setup();
  await weighIn(quiet.dom, quiet.doc, 179.4);
  assert.equal(slot(quiet.doc, "morning").textContent, "This morning ✓ 179.4 lb");
  assert(!slot(quiet.doc, "morning").textContent.includes("·"), "no separator is printed with no note");
  quiet.close();
});

test("morningLine and trendLine carry no words of their own beyond the approved labels", () => {
  const note = "spike — damped in trend";
  assert.equal(morningLine({ morningRead: { lb: 190, note } }), "This morning ✓ 190.0 lb · " + note);
  assert.equal(morningLine({ morningRead: { lb: 190, note: "" } }), "This morning ✓ 190.0 lb");
  assert.equal(morningLine({ morningRead: null }), "This morning: not logged yet");
  assert.equal(trendLine({ nowModel: { headed: { weight: 180.1 } } }), "Weight trend 180.1 lb");   /* polish 5 (item 8): Why this plan? is its own row */
  assert.match(trendLine({ nowModel: { headed: { weight: null } } }), /Not available yet/);
});

/* ---- review F8: an impossible weight is refused in words, never silently ---- */
test("an impossible weight is refused with an honest message and records nothing", async () => {
  const kit = await setup();
  const { dom, doc, model } = kit;
  for (const value of ["10000", "0", "-5", "59.9", "400.1", "180.01"]) {
    const sheet = await weighIn(dom, doc, value);
    const message = doc.getElementById("weigh-error").textContent;
    assert(message.length > 0, "refused " + value + " in words");
    assert.match(message, /Nothing was recorded/);
    assert(doc.querySelector('[role="dialog"]'), "the sheet stays open on a refusal");
    doc.querySelector('[data-action="cancel"]').click();
    assert.equal(sheet.isConnected, false);
  }
  assert.equal(model.read().hasReadToday, false);
  const ops = (await kit.lane.readings.repository.load()).generation.collections.ops || {};
  assert.equal(Object.keys(ops).length, 0, "no impossible weight reached the log");
  // And the bound is a FORM bound, not a claim about the engine: a weight inside it works.
  await weighIn(dom, doc, "179.4");
  assert.equal(model.read().hasReadToday, true);
  kit.close();
});

test("an empty box is refused by the CLIENT, in the client's own words", async () => {
  const kit = await setup();
  await weighIn(kit.dom, kit.doc, "");
  const message = kit.doc.getElementById("weigh-error").textContent;
  assert.match(message, /A weight is required/);
  assert.doesNotMatch(message, /\d+\.\d/, "a refusal carries no weight");
  assert.equal(kit.model.read().hasReadToday, false);
  kit.close();
});

test("a refused weigh-in leaves Today exactly as it was", async () => {
  const kit = await setup();
  const before = phoneText(kit.doc);
  await weighIn(kit.dom, kit.doc, "10000");
  kit.doc.querySelector('[data-action="cancel"]').click();
  assert.equal(phoneText(kit.doc), before, "nothing on Today changed");
  assert.equal(kit.model.read().hasReadToday, false);
  kit.close();
});

test("a reload of the page restores the stored weigh-in on screen", async () => {
  const store = await lane();
  const first = await setup({ lane: store });
  await first.model.weighIn(177.6);
  first.api.render("today");
  const shown = slot(first.doc, "trend").textContent;
  store.readings.close();

  const reopened = await lane({ fault: store.fault, keys: store.keys });
  const second = await setup({ lane: reopened });
  assert.match(slot(second.doc, "morning").textContent, /^This morning ✓ 177\.6 lb/);
  assert.equal(slot(second.doc, "trend").textContent, shown);
  second.close();
});

test("Why this plan shows only the engine's own explanations", async () => {
  const kit = await setup();
  const { doc, model } = kit;
  viaMore(doc, '[data-go="why"]');   /* P9 (call 6): was Today's own Why this plan? link */
  assert.equal(slot(doc, "more-sheet"), null, "the sheet closes as its row opens the screen");
  const view = model.read();
  const bodies = [...doc.querySelectorAll(".macro-row p")].map((p) => p.textContent);
  assert.equal(bodies.length, view.why.length);
  assert.equal(bodies[0], plainCopy(view.calorieTarget.why));
  assert.equal(bodies[1], plainCopy(view.proteinTarget.why));
  assert.equal(slot(doc, "why-lead").textContent, plainCopy(view.nowModel.move.body));
  doc.querySelector('[data-go="today"]').click();
  assert(slot(doc, "instruction"), "Back returns to Today");
  kit.close();
});

test("every screen this slice does not build says so and shows no invented value", async () => {
  const kit = await setup();
  const { doc } = kit;

  doc.querySelector('[data-go="nutrition"]').click();
  assert.match(phoneText(doc), /not wired yet/);
  const rows = [...doc.querySelectorAll(".macro-row")].map((r) => r.textContent);
  assert.equal(rows.length, 4);
  assert.match(rows[2], /Carbohydrate/);
  assert.match(rows[2], /Not prescribed/);
  assert.match(rows[3], /Fat/);
  assert.doesNotMatch(rows[2] + rows[3], /\d/, "no carbohydrate or fat figure is invented");

  /* A3 — the recovery check-in IS wired now, so it no longer says "not wired yet".
     With no check-in lane on this device (which is what a jsdom mount with no host
     is) the screen shows the approved questions, keeps every answer blank, makes
     every control inert, and says in the capture layer's own terms that nothing here
     can be recorded. It must never claim the feature is unbuilt. */
  doc.querySelector('[data-go="today"]').click();
  viaLogToday(doc);   /* P9 (call 2): was Today's Recovery row */
  assert.doesNotMatch(phoneText(doc), /not wired yet/, "the check-in is wired");
  assert.match(phoneText(doc), /no check-in can be recorded here/);
  assert.match(phoneText(doc), /A quick check-in\./);
  const options = [...doc.querySelectorAll(".option")];
  assert(options.length >= 9);
  for (const option of options) {
    assert.equal(option.getAttribute("aria-pressed"), "false", "every answer starts blank");
    assert.equal(option.disabled, true, "nothing here can be recorded");
  }
  for (const select of doc.querySelectorAll("#phone select")) {
    assert.equal(select.value, "", "every conditional detail starts unanswered");
  }
  assert.doesNotMatch(phoneText(doc), /\d/, "no figure is shown on a blank check-in");

  /* S12 SC-5 (red first: the PM's runs s12-pmrun2 and s12-pmrun1, view.test.mjs:302 no
     "not wired yet" on the coach screen; DECISIONS:820 R2 names :301-303 as a cell that encodes
     the old look; REVIEW-LOOK-C-UI-6-l1 F11). The Coach route now paints the approved board's
     #screen-coach (C-UI-6, coach-app.mjs): the board's three EXAMPLE prompts (one of them is a
     question about the chest press), the "example" pill, and no answer. With no live coach in
     this build, asking in any way is answered by the board's own refusal card for exactly that
     fact (C-61). So the screen still says it is not live, in the board's words, the moment he
     asks, and no scripted answer and no figure is ever shown: before he asks the screen holds
     no digit at all (stronger than the old /135/), "chest press" occurs only inside a prompt,
     and the refusal invents nothing either. Today's face still marks the entry "Not wired yet"
     (the next test). */
  backToToday(doc);   /* P9: back from the check-in Today opens the Log today sheet again; Done closes it */
  /* COACH V1 (owner ruling 2026-10-12): the Coach entry is back on Today (it left at DECISIONS:915 (3) until a
     live coach existed), so the screen is opened here from Today's own link, as the athlete opens it. */
  const coachEntry = doc.querySelector('[data-go="coach"]');
  assert(coachEntry, "the Coach entry is on Today");
  coachEntry.click();
  const coach = doc.getElementById("phone");
  assert.equal(coach.querySelector("#coach-answer").hidden, true, "no answer is shown before he asks");
  /* COACH V1 (owner ruling 2026-10-12, "No-AI coach first"; red first on the S19 page). The board's three example
     prompts and its "example" pill were the honest face of a screen with no coach behind it. The screen now answers
     from this device's records, so it shows the coach's own tap-to-ask questions instead and drops the example
     pill; it still shows no answer and no figure before he asks, and asking by typing says those come later. A
     tapped question is answered with this athlete's own figures, each one a tool result of that turn (coach.test.mjs
     CV1-2); here the first question is asked and its answer is checked against the Today model it was read from. */
  assert.equal(coach.querySelector('.pill[title="Example numbers, not your data"]').hidden, true, "no example pill over real answers");
  assert.doesNotMatch(phoneText(doc), /\d/, "no figure is shown on the coach screen before he asks");
  const prompts = [...coach.querySelectorAll("#prompts .prompt")];
  /* The seat read (PM ruling option A, red at 38ee0e5: this cell still counted six) adds the seventh question,
     "Where's my seat set?". The cell names all seven, in order, which is the count and more. */
  assert.equal(prompts.length, 7, "the coach's seven questions (piece 2 added How did my week go?, the seat read Where's my seat set?)");
  assert.deepEqual(prompts.map((p) => p.getAttribute("data-intent")),
    ["today_plan", "why_weight", "last_time", "weight_trend", "my_checkin", "week_review", "machine_seat"], "the seven, in order");
  assert.equal(prompts[6].textContent.replace(/\s+/g, " ").trim(), "Where's my seat set?");
  assert.equal(prompts[0].getAttribute("data-intent"), "today_plan");
  prompts[0].click();
  for (let at = 0; at < 200 && coach.querySelector("#coach-answer").hidden; at += 1) await new Promise((r) => setTimeout(r, 5));
  assert.equal(coach.querySelector("#coach-answer").hidden, false, "asking is answered");
  const told = coach.querySelector("#coach-answer-text").textContent;
  const todayView = kit.model.read();
  /* COACH V1 POLISH (plain answers): today's plan names the workout and each exercise's set target, so its figures are
     the Today model's own calorie band and protein target AND the engine's own session cards (sessionPlan). */
  const plan = kit.model.sessionPlan();
  const own = [todayView.calorieTarget && todayView.calorieTarget.lo, todayView.calorieTarget && todayView.calorieTarget.hi,
    todayView.proteinTarget && todayView.proteinTarget.g,
    ...plan.exercises.flatMap((ex) => [ex.sets, ...ex.reps, ex.weight, ex.repTop])].filter((v) => v !== null && v !== undefined).map(String);
  for (const figure of told.match(/\d+(?:\.\d+)?/g) || []) {
    assert(own.includes(figure), "every figure in the answer is the Today model's own: " + figure);
  }
  /* COACH V1 POLISH (shot 04): v1 is tap to ask only, so the text mode, the tap link and the mic are hidden with their
     stack; reached anyway, typing still says it is not a question yet. */
  assert.equal(coach.querySelector(".stack").hidden, true, "no text mode and no mic on the live screen");
  coach.querySelector("#coach-text-mode").click();
  coach.querySelector("#coach-text button").click();
  assert.match(coach.querySelector("#coach-answer").textContent, /Typed and spoken questions come later\./, "typing is not a question yet");
  assert.match(coach.querySelector("#coach-answer").textContent, /Nothing changed\./);
  doc.querySelector('[data-go="today"]').click();
  kit.close();
});

/* A2 made the workout entry point real. With NO workout host injected — which is
   exactly what a browser that will not give the page an encrypted local store
   looks like — the entry point must say that plainly, name what is missing, and
   show no prescription and no figure. It must NOT claim the feature is unbuilt, and
   it must not fabricate a session. The wired path is proved end to end, over the
   real durable store, in test/gym.test.mjs. */
test("with no encrypted local store, the workout entry point says so and shows no figure", async () => {
  const kit = await setup();
  const { dom, doc, model } = kit;
  await weighIn(dom, doc, 180.2);
  slot(doc, "primary").click();
  assert.match(phoneText(doc), /could not be opened on this device, and nothing was recorded/);
  assert.match(phoneText(doc), /encrypted local store/);
  assert.doesNotMatch(phoneText(doc), /not wired yet/, "the gym card is wired; this device has no store");
  assert.equal(slot(doc, "workout-title").textContent, model.read().workout.title);
  assert.doesNotMatch(phoneText(doc), /\d/, "not one figure appears when the workout cannot be opened");
  kit.close();
});

/* A2 — the injected workout host is what Today reads its workout state from. A
   Today with no host must never invent one, and the four states must come from
   that host and nowhere else. (The states themselves are read off the real durable
   log in test/gym.test.mjs; this checks Today cannot make one up.) */
test("Today's workout state comes from the injected host, never from the page", async () => {
  const plain = await setup();
  assert.match(slot(plain.doc, "workout-count").textContent, /Your set targets are ready$/);
  plain.close();

  for (const [phase, expected] of [["active", app.WORKOUT_IN_PROGRESS], ["finished", app.WORKOUT_RECORDED_TODAY]]) {
    let opened = 0;
    const kit = await setup({ mount: { workout: { summary: () => ({ phase, sets: 0 }), open: () => { opened += 1; } } } });
    const { doc, model, api } = kit;
    assert.match(slot(doc, "workout-count").textContent, new RegExp(expected + "$"), phase);
    /* S12b R6 (DECISIONS:915 (4); this cell pinned the P0-C gate: a finished workout did not displace the
       morning weigh-in from the primary, "Log the scale"). With the gate gone, the primary names the
       workout's own action in both phases while the weight is still owed, and the weigh-in stays on the
       morning card. */
    assert.equal(model.read().hasReadToday, false, phase + ": the morning is owed");
    assert(doc.querySelector('#card-weigh [data-slot="weigh-form"]'), phase + ": the weigh-in stays on the morning card");
    /* P9 round 2 (DECISIONS:1003 (1); was "Resume " + the workout's title while active): Resume names the tap, as
       Review does, and the card above it names the workout. */
    assert.equal(slot(doc, "primary-label").textContent,
      phase === "active" ? app.RESUME_TODAYS_WORKOUT : app.REVIEW_WORKOUT, phase);
    assert.equal(slot(doc, "workout-title").textContent, model.read().workout.title, phase + ": the card names the workout");
    assert(!slot(doc, "primary-label").textContent.includes(model.read().workout.title), phase + ": once");
    slot(doc, "primary").click();
    assert.equal(opened, 1, phase + ": the primary action opens the injected gym card");
    kit.close();
  }
});

/* REVIEW B1 — Today must never offer "ready" and "Start" for a workout the accepted
   layer has already refused to prepare. The probe's refusal is shown in plain words
   with the layer's own code exactly once, and never as a fault of the device. */
test("a refused preparation is shown on Today, with the layer's code once and no device blame", async () => {
  let opened = 0;
  const kit = await setup({ mount: { workout: {
    summary: () => ({ phase: "blocked", sets: 0, code: "PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED" }),
    open: () => { opened += 1; } } } });
  const { doc, model, api } = kit;
  await model.weighIn(179.4);
  api.render("today");

  const line = slot(doc, "workout-count").textContent;
  assert(!line.includes("Your set targets are ready"), "a refused workout is never called ready: " + line);
  assert(line.includes(app.WORKOUT_CANNOT_OPEN), line);
  assert.equal(line.split("PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED").length, 2,
    "the code appears exactly once: " + line);
  assert(!phoneText(doc).includes(app.NO_LOCAL_STORE), "an engine refusal never blames the device");

  const label = slot(doc, "primary-label").textContent;
  assert.equal(label, app.WHY_WORKOUT_CANNOT_OPEN);
  assert(!label.startsWith("Start "), "Start is not offered for a workout that cannot be prepared");
  slot(doc, "primary").click();
  assert.equal(opened, 1, "the athlete can still read the whole refusal");
  kit.close();
});

/* REVIEW ROUND 2, point 3 — a session abandoned on an earlier day is a state the
   athlete can get OUT of. Today names the day and the primary action performs the
   accepted close; it never re-renders from optimism. */
test("an unfinished earlier workout is named on Today, and the primary action closes it", async () => {
  let recovered = 0;
  let phase = "unfinished";
  const kit = await setup({ mount: { workout: {
    summary: () => (phase === "unfinished"
      ? { phase: "unfinished", sets: 0, code: "WORKOUT_HISTORY_RECONCILIATION_REQUIRED",
          unfinished: { startId: "op-1", day: "2030-02-04", sets: 1 } }
      : { phase: "ready", sets: 0, code: null }),
    recover: async () => { recovered += 1; phase = "ready"; return { ok: true }; },
    open: () => {} } } });
  const { doc, model, api } = kit;
  await model.weighIn(179.4);
  api.render("today");

  const line = slot(doc, "workout-count").textContent;
  assert(line.includes(app.UNFINISHED_WORKOUT), line);
  assert(line.includes("2030-02-04"), "the day it belongs to is named: " + line);
  assert(!line.includes("Your set targets are ready"), line);
  assert(!phoneText(doc).includes(app.NO_LOCAL_STORE), "this is not a fault of the device");

  const button = slot(doc, "primary");
  assert.equal(slot(doc, "primary-label").textContent, app.CLOSE_UNFINISHED_WORKOUT);
  button.click();
  await settle(doc);
  assert.equal(recovered, 1, "the accepted close ran once");
  assert.match(slot(doc, "primary-label").textContent, /^Start /,
    "and Today repainted from what the layer answered");
  kit.close();
});

/* C4b — an untrusted local record is RESTORE-REQUIRED, not a blocked face.
   A2's two synthetic hosts re-opened a damaged store and painted a blocked
   screen off it. The local era refuses to open one at all: state 18, the code
   named, and — the part that matters — it never re-enrols over the record it
   could not read, because first-run evidence exists only where C1 observed all
   three signals absent. So the claim is made where the behaviour now is: the
   page says what rebuild/client says, no reading is claimed, and the damaged
   generation is still on disk untouched. */
test("an untrusted local record is refused by name, never re-enrolled over, and claims no reading", async () => {
  const store = await lane();
  const seeded = createTodayModel({ today: DAY, readings: store.readings });
  await seeded.weighIn(181.9);
  const era = (await store.readings.repository.load()).generation.metadata.localEra;
  // Corrupt the stored operation collection under the page.
  const snapshot = await store.readings.repository.load();
  const damaged = JSON.parse(JSON.stringify(snapshot.generation));
  damaged.collections.ops = {};
  await store.readings.repository.commit({ revision: snapshot.revision, token: snapshot.token }, damaged, () => null);
  store.readings.close();

  const refused = await store.open().then(() => null, (error) => error);
  assert(refused, "a damaged installation must not open");
  assert.equal(refused.state, 18, refused.code);
  assert.match(String(refused.code), /T2_INTEGRITY_UNPROVEN|STORED_INTEGRITY_UNPROVEN|RESTORE_UNPROVEN/);

  const dom = new JSDOM(shell(), { url: "http://127.0.0.1:4178/" });
  const doc = dom.window.document;
  const booted = await boot({ document: doc, today: DAY,
    indexedDB: store.fault.indexedDB, crypto: webcrypto });
  assert.equal(booted.restoreRequired, refused.code, "the page names the client's own code");
  assert.equal(doc.getElementById("today-status").textContent,
    plainCopy(RESTORE_REQUIRED + " (" + refused.code + ")"),
    "and says what rebuild/client says, not its own sentence");
  assert.equal(booted.readings, null, "no store opened");
  assert.equal(booted.model.read().morningRead, null, "nothing on screen claims a reading");
  assert.equal(booted.model.read().hasReadToday, false);
  assert.equal(booted.model.read().storedReadCount, 0);
  /* The PLAN still renders — it is the engine's own basis, and A1's accepted
     behaviour with no store at all (see adapter.test.mjs). What must never
     appear is a figure taken from the record that would not authenticate. */
  assert.doesNotMatch(phoneText(doc), /181\.9/, "no figure from the unreadable record reaches the screen");
  const noStore = new JSDOM(shell(), { url: "http://127.0.0.1:4178/" }).window.document;
  mountToday(noStore, createTodayModel({ today: DAY }), {});
  assert.equal(slot(doc, "trend").textContent, slot(noStore, "trend").textContent,
    "the screen is exactly the no-store screen: the basis, and not one byte of the damaged record");

  // NOT RE-ENROLLED: the damaged generation is still the one on disk.
  const after = await new Promise((resolve, reject) => {
    const open = store.fault.indexedDB.open(DATABASE, 1);
    open.onsuccess = () => { const db = open.result; const tx = db.transaction("generations", "readonly");
      const get = tx.objectStore("generations").get("active");
      let value; get.onsuccess = () => { value = get.result; };
      tx.oncomplete = () => { db.close(); resolve(value); };
      tx.onabort = () => { db.close(); reject(tx.error); }; };
    open.onerror = () => reject(open.error);
  });
  assert(after, "the record is still there — nothing deleted it");
  const reopened = await lane({ fault: store.fault }).then(() => null, (error) => error);
  assert(reopened && reopened.state === 18, "and it still refuses, rather than starting a second life");
  assert(era && era.eraId, "the era this test damaged really was sealed in the generation");
});

/* ---- the strong guard: every figure on Today is a bound engine value ---- */
test("every figure on Today equals the reference engine's own value, slot by slot", async () => {
  const kit = await setup();
  const { dom, doc } = kit;
  const reference = createEngine({ clock: engineClockFor(DAY) });
  for (const [state, label] of [[createBasisState(DAY), "before"],
    [reference.applyRead(createBasisState(DAY), DAY, 176.2, { hour: 8 }), "after"]]) {
    if (label === "after") await weighIn(dom, doc, 176.2);
    const calories = reference.calorieTarget(state);
    const protein = reference.proteinTarget(state);
    assert.equal(slot(doc, "kcal").textContent, calorieHeadline(calories), label);
    assert.equal(slot(doc, "kcal-note").textContent, calorieBand(calories), label);
    assert.equal(slot(doc, "protein").textContent, money.format(protein.g), label);
    assert.equal(slot(doc, "trend").textContent,
      "Weight trend " + reference.nowModel(state).headed.weight.toFixed(1) + " lb", label);
    assert.equal(slot(doc, "instruction").textContent, engineHeadline(reference, state), label);   /* S12 SC-9 */
    assert.equal(slot(doc, "workout-count").textContent,
      reference.genSession(state, DAY, null).ex.length + " exercises · Your set targets are ready", label);
  }
  assert.match(slot(doc, "morning").textContent, /^This morning ✓ 176\.2 lb/);
  kit.close();
});

/* review D-2: the athlete must not have to tap to discover an entry point is unwired. */
test("every unwired entry point says so on Today's own face, in secondary text", async () => {
  const kit = await setup();
  const { doc } = kit;
  /* A3 — recovery is no longer in this list: the check-in is WIRED. Today's recovery
     entry now carries the durable fact instead (see the assertion below), and with no
     check-in lane at all it says that, never "not wired yet". */
  /* S12b R6 (DECISIONS:915 (3); red first: this cell's old pins of coach-state on Today). The Coach entry has
     left Today until a live coach exists, so the unwired entry Today still carries is the nutrition plan's;
     the Coach marker, the Talk row and every route to the Coach screen are absent from Today (asserted). */
  assert.equal(slot(doc, "coach-state"), null, "no Coach marker on Today");
  /* COACH V1 (owner ruling 2026-10-12): one route to the Coach screen is back, a quiet link with no marker. */
  assert.equal(doc.querySelectorAll('[data-go="coach"]').length, 1, "one route to the Coach screen on Today");
  for (const name of ["nutrition-state"]) {
    const el = slot(doc, name);
    assert(el, name + " is on Today");
    assert.equal(el.textContent, app.NOT_WIRED);
    assert.equal(el.closest("[data-go]") !== null, true, name + " sits inside its own entry point");
  }
  assert(slot(doc, "nutrition-state").classList.contains("muted"));
  /* P9 (PM, the Today repeats; call 2; supersession pending): was `recovery-state` in secondary text on Today's
     Recovery row. The row is gone; the check-in is the Log today card's Check in, one tap from Today's face, and the
     same durable fact is said in that sheet's Check in row, in its secondary text (asserted below). */
  assert.equal(slot(doc, "recovery-state"), null, "P9: no Recovery row on Today");
  const face = phoneText(doc);
  /* S12 SC-14 (red first: the PM's runs s12-pmrun2 and s12-pmrun1, view.test.mjs:519 "Ask your
     coach"; rev8 s3b SC-14, FCR D-CMP-3). Under DECISIONS:820 O2 the approved board's words won on
     Today: the coach entry is the board's Talk row, "Talk through today's plan" (the
     template's #talk-today), and Today's face no longer says "Ask your coach". The label moves to
     the board's; the marker, its .sub placement (asserted above), app.NOT_WIRED and the
     120-character window are unchanged. */
  /* COACH V1 POLISH (the PM's polish batch, ui-pass7 shot 02): the entry is the compact feed row, one preview-owned line
     "Ask Coach"; the Talk row's words left Today with the old link, and the row and its marker stay off Today (above). */
  assert(face.includes("Ask Coach"), "the Coach entry says its one line");
  assert(!face.includes("Talk through today\u2019s plan"), "the Talk row's words left Today");
  for (const label of ["Your full nutrition plan"]) {
    const at = face.indexOf(label);
    assert(at >= 0, label);
    assert(face.slice(at, at + 120).includes(app.NOT_WIRED), label + " is not marked on Today's face");
  }
  /* A3 — the recovery entry is marked with the DURABLE fact, never "not wired yet".
     With no check-in lane the marker names the device, and a lane that holds nothing
     for today says NOTHING: a blank check-in is blank, never "none".
     P9 (call 2; supersession pending). Was: Today's Recovery row said the fact (`recovery-state`), under the board's
     row title "Recovery check in" (S12 SC-16), with no NOT_WIRED in the 120 characters after it. Now: Today's face
     carries the entry one tap away (the Log today card, whose line names "Check in" and does not tick it, since
     nothing is recorded), and the sheet that tap opens says the same durable fact in its Check in row's secondary
     text, with no NOT_WIRED in that row. The board's row title is no longer on Today. */
  assert(!face.includes("Recovery check in"), "P9: the Recovery row's title left Today with the row");
  const logCard = doc.querySelector("#card-log");
  assert(logCard && !logCard.hidden && logCard.textContent.includes("Check in"), "P9: Today's face carries the Check in entry");
  assert.equal(logCard.querySelector('[data-item="checkin"][data-done]'), null, "P9: and does not tick it with nothing recorded");
  logCard.click();
  const checkinState = slot(doc, "log-checkin-state");
  assert(checkinState, "P9: one tap opens the sheet with its Check in row");
  assert.equal(checkinState.textContent, app.CHECKIN_NO_STORE_SHORT, "P9: the row says the durable fact");
  assert(checkinState.classList.contains("muted") && checkinState.classList.contains("small"), "P9: in secondary text");
  assert(!slot(doc, "log-checkin").textContent.includes(app.NOT_WIRED), "P9: the check-in is wired");
  slot(doc, "log-done").click();
  assert.equal(slot(doc, "log-sheet"), null, "P9: Done closes the sheet");
  for (const screen of ["nutrition", "coach"]) {
    /* S12b R6 opened the Coach screen through the page's router, because nothing on Today linked to it. COACH V1
       (owner ruling 2026-10-12, DECISIONS:963): Today's own link is back, so it is opened from there. */
    doc.querySelector(`[data-go="${screen}"]`).click();
    if (screen === "coach") {
      /* S12 SC-5 (DECISIONS:820 R2) pinned the board's C-61 here, "There is no live coach in this build.", because the
         screen had no coach behind it. COACH V1 WIRES IT (red first: the PM's seat run at 9e41ef3, this assertion), so
         the cell now holds the wired fact the way it holds the check-in's: a tapped question is answered on the
         screen (SC-5 above checks every figure in the answer against the Today model), and the screen says neither
         C-61 nor "not wired yet". */
      doc.querySelector("#prompts .prompt").click();
      for (let at = 0; at < 200 && doc.querySelector("#coach-answer").hidden; at += 1) await new Promise((r) => setTimeout(r, 5));
      assert.equal(doc.querySelector("#coach-answer").hidden, false, "a tapped question is answered");
      assert.doesNotMatch(phoneText(doc), /There is no live coach in this build\./, screen);
      assert.doesNotMatch(phoneText(doc), /not wired yet/, screen);
    } else {
      assert.match(phoneText(doc), /not wired yet/, screen);
    }
    doc.querySelector('[data-go="today"]').click();
  }
  viaLogToday(doc);   /* P9 (call 2): was Today's Recovery row */
  assert.doesNotMatch(phoneText(doc), /not wired yet/, "recovery");
  backToToday(doc);
  kit.close();
});

test("the wired action is NOT marked unwired", async () => {
  const kit = await setup();
  assert(!slot(kit.doc, "primary-label").textContent.includes("not wired"));
  assert(!slot(kit.doc, "morning").textContent.includes("not wired"));
  kit.close();
});

/* review D-1: the fitter is a no-op where there is no layout, and never truncates. */
test("the headline fitter cannot truncate engine text and stays off without layout", { timeout: 60000 }, async () => {
  const kit = await setup();
  const { doc } = kit;
  const longest = design.headlineVocabulary()[0];
  const headline = slot(doc, "instruction");
  headline.textContent = longest;
  assert.equal(headline.textContent, longest, "engine text is never shortened");
  assert.doesNotMatch(headline.textContent, /…|\.\.\./, "no ellipsis is ever added");
  assert.equal(doc.querySelector(".page").style.getPropertyValue("--headline"), "");
  assert.equal(app.HEADLINE_BASE, 47);
  assert.equal(app.HEADLINE_FLOOR, 33);
  /* S12 SC-26 (PROPOSED id; red first: the PM's runs %TEMP%\s12-pmrun2 at 96551fb and
     %TEMP%\s12-pmrun1 at the S12 head, view.test.mjs "47px is C's own headline size"). The two
     lines this replaces anchored the fitter's 47px base and 33px floor in the 2026-09-08
     Additions C stylesheet, which is no longer the design of record (DECISIONS:817, :820;
     design.cjs APPROVED is the four 2026-09-18 stylesheets, none of which declares 47px or
     33px). Under the approved board the instruction is the pack's #greeting (C-UI-2, D:820 O1)
     at the board's own size, and the fit is superseded by ruling 4: Start sits in the fixed
     .stack, so no title can push it out of view (Fable REVIEW-LOOK-C-UI-2-l1 N2, listed as pack
     edit P6, inventory T-39). What the two lines protected, that the page never puts a size of
     its own on the approved headline, is now asserted on the approved design itself: the slot
     is the board's h1.greeting, the pinned app.css gives .greeting its 52px, and no rule the
     page ships that reads the fitter's --headline matches the headline, so the fitter's
     47px to 33px range cannot reach it. The no-truncation, no-ellipsis and stays-off checks
     above and the two constants are unchanged. */
  assert(headline.matches("h1.greeting#greeting"), "the instruction slot is the board's greeting");
  const approved = design.readApproved();
  const appCss = approved.find((a) => a.file === "rebuild/m1/approved-2026-09-18/app/app.css");
  assert(appCss && /\.greeting\s*\{[^}]*font-size:\s*52px/.test(appCss.styles), "52px is the board's own greeting size");
  /* S12 R5b: the rules are cut LINEARLY (split on braces), never with a backtracking regex: the shipped
     stylesheet inlines the fonts and the scene images as data URLs hundreds of KB long, and a
     /([^{}]+)\{([^{}]*var\(--headline...)\}/g scan backtracks quadratically through every such body (the
     PM-seat hang of s12-pmrun3, this cell spinning at 100% CPU). */
  const shipped = design.composeStyles(approved, design.chromeCss(), []).replace(/\/\*[\s\S]*?\*\//g, " ");
  const fitted = [];
  for (const chunk of shipped.split("}")) {
    const parts = chunk.split("{");
    if (parts.length < 2 || !parts[parts.length - 1].includes("var(--headline")) continue;
    fitted.push(...parts[parts.length - 2].split(",").map((s) => s.trim()).filter(Boolean));
  }
  assert(fitted.length > 0, "the shipped stylesheet carries the fitter's --headline rule, so this check is not vacuous");
  /* The fitter terminates: its only loop steps the size down by one pixel per pass and stops at the
     floor, so it runs at most HEADLINE_BASE - HEADLINE_FLOOR passes, whatever the layout says; and it
     writes only the page's --headline, never the headline it observes, so it cannot re-trigger itself. */
  const appSource = fs.readFileSync(new URL("../today-app.cjs", import.meta.url), "utf8");
  const fitter = appSource.slice(appSource.indexOf("function fitHeadline(view, root) {"));
  const fitterBody = fitter.slice(0, fitter.indexOf("\n}\n"));
  assert.equal((fitterBody.match(/\bwhile\b|\bfor\b|requestAnimationFrame|ResizeObserver|setTimeout/g) || []).join(","), "while",
    "the fitter has exactly one loop and schedules nothing");
  assert(fitterBody.includes("while (room() < 0 && size > HEADLINE_FLOOR) {\n    size -= 1;"),
    "the fitter's one loop is bounded by the floor and steps down by one each pass");
  assert(app.HEADLINE_BASE - app.HEADLINE_FLOOR <= 14, "at most 14 passes");
  /* S12b R6 (DECISIONS:915 (4), audit F2; red first: the R6 build, this cell's old pin "no --headline
     rule matches the greeting"). SC-26 read the fit as superseded because Start sits in the fixed stack,
     but the 52px greeting then pushed today's workout card off the first screen at 360x780 and 390x844
     (audit key-content-not-seen #card-train). The fit is re-aimed: it finds Start on the whole view (it
     looked inside the .body, where Start no longer is) and steps the headline down until #card-train
     is wholly above Start; and the page now gives the greeting the fitter's size, capped at
     HEADLINE_BASE. Pinned exactly: ONE shipped selector reads --headline AND reaches the greeting, its
     fallback is HEADLINE_BASE (so the board's 52px is capped at 47px and never grows), and the fitter
     looks up Start on the view and measures the workout card. */
  /* (The live host's .ui and .scene-frame are scene.mjs's, which this jsdom page does not install, so the
     greeting rule is read by its selector; every OTHER --headline rule must still miss the headline.) */
  const reaching = fitted.filter((selector) => /\.greeting\b/.test(selector));
  assert.deepEqual(reaching, [".scene-frame > .view.ui .greeting"], "one --headline rule reaches the greeting");
  assert(headline.classList.contains("greeting"), "and the instruction slot is that greeting");
  for (const selector of fitted.filter((s) => !reaching.includes(s))) {
    let hit = false;
    try { hit = headline.matches(selector); } catch { hit = false; }
    assert.equal(hit, false, "a second --headline rule reaches the headline through " + selector);
  }
  const greetingRule = shipped.split("}").map((chunk) => chunk.split("{"))
    .filter((p) => p.length >= 2 && p[p.length - 2].trim() === ".scene-frame > .view.ui .greeting");
  assert.equal(greetingRule.length, 1, "the greeting's fitted size is declared once");
  assert.equal(greetingRule[0][greetingRule[0].length - 1].trim(), "font-size: var(--headline, " + app.HEADLINE_BASE + "px);",
    "the greeting is capped at HEADLINE_BASE");
  assert(fitterBody.includes("view.querySelector('[data-slot=\"primary\"]')"), "the fitter finds Start on the whole view");
  assert(fitterBody.includes('root.querySelector("#card-train")'), "the fitter measures today's workout card");
  kit.close();
});

test("not one digit appears on Today outside a bound slot", async () => {
  const kit = await setup();
  const clone = kit.doc.getElementById("phone").cloneNode(true);
  for (const bound of clone.querySelectorAll("[data-slot]")) bound.textContent = "";
  assert.doesNotMatch(clone.textContent, /\d/,
    "a figure survived in the template instead of being bound: " + clone.textContent.replace(/\s+/g, " ").trim());
  kit.close();
});

/* ---- review F4: the iOS zoom rule, on the inputs the page ACTUALLY renders ---- */
function cascade(css) {
  // Comments MUST go first. Without that, the comment before a rule is swallowed into its
  // selector, el.matches() throws on the nonsense, the rule is silently skipped and the
  // test measures the approved 14px instead of the 16px correction — which is how the
  // first version of this test passed while proving nothing.
  const flat = css.replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/@font-face\{[^{}]*\}/g, " ")
    .replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, " ");
  const rules = [];
  for (const match of flat.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const body = match[2];
    const explicit = body.match(/(?:^|;)\s*font-size\s*:\s*(\d+(?:\.\d+)?)px/);
    const shorthand = body.match(/(?:^|;)\s*font\s*:\s*(?:[^;]*?\s)?(\d+(?:\.\d+)?)px/);
    const size = explicit ? Number(explicit[1]) : shorthand ? Number(shorthand[1]) : null;
    if (size === null) continue;
    for (const selector of match[1].split(",")) rules.push({ selector: selector.trim(), size });
  }
  return rules;
}
const VENDOR = /::-webkit-|::-moz-|::backdrop|:focus-visible/;
function fontSizeOf(el, rules) {
  let size = 16;
  for (const rule of rules) {
    try { if (el.matches(rule.selector)) size = rule.size; }
    catch (error) {
      assert.match(rule.selector, VENDOR, "unparseable selector in the shipped stylesheet: " + rule.selector);
    }
  }
  return size;
}

test("every text input the page actually renders is 16px or more", async () => {
  const rules = cascade(design.composeStyles(design.readApproved(), design.chromeCss(), []));
  const kit = await setup();
  const { doc } = kit;
  const seen = [];
  const sweep = (where) => {
    for (const el of doc.querySelectorAll("input, select, textarea")) {
      const size = fontSizeOf(el, rules);
      seen.push([where, el.id || el.tagName, size]);
      assert(size >= 16, `${where}: ${el.id || el.tagName} renders at ${size}px`);
    }
  };
  for (const screen of ["nutrition", "recovery", "coach", "why"]) {
    /* S12b R6 (DECISIONS:915 (3)): the Coach screen is opened through the page's router; Today has no entry to it. */
    if (screen === "coach") kit.api.render("coach", true);
    /* P9 (calls 2 and 6): the check-in is reached through Log today, and Why this plan? through the More sheet */
    else if (screen === "recovery") viaLogToday(doc);
    else if (screen === "why") viaMore(doc, '[data-go="why"]');
    else doc.querySelector(`[data-go="${screen}"]`).click();
    sweep(screen);
    backToToday(doc);
  }
  sweep("today");
  /* P9 (call 6): the report's box left Today's face for the More sheet, so the sheet is swept as Today was */
  kit.api.openMore();
  sweep("more");
  assert(seen.some(([where, name]) => where === "more" && name === "TEXTAREA"), "the report's box is swept in the More sheet");
  slot(doc, "more-done").click();
  /* S12b R6 (DECISIONS:915 (4)): Start no longer opens the sheet; the sheet is opened through the page's api,
     and Today's own weigh-in box (the morning card's #weight, swept above) is held to the same 16px. */
  kit.api.openWeighIn();
  sweep("weigh-in");

  const inputs = seen.filter(([, name]) => name === "morning-weight");
  assert.equal(inputs.length, 1, "the sheet's weigh-in box is rendered once: " + JSON.stringify(seen));
  assert(inputs[0][2] >= 16, "the weigh-in box is at least 16px");
  const inline = seen.filter(([where, name]) => where === "today" && name === "weight");
  assert.equal(inline.length, 1, "the morning card's weigh-in box is on Today: " + JSON.stringify(seen));
  assert(inline[0][2] >= 16, "the morning card's weigh-in box is at least 16px");
  kit.close();
});

test("the 16px correction really would raise the approved sub-16px fields A3 will render", async () => {
  const rules = cascade(design.composeStyles(design.readApproved(), design.chromeCss(), []));
  const kit = await setup();
  const { doc } = kit;
  const view = doc.querySelector(".view");
  const cases = [
    ['<div class="followup"><input id="probe-a"></div>', "probe-a"],
    ['<div class="followup"><select id="probe-b"></select></div>', "probe-b"],
    ['<form class="composer"><input id="probe-c"></form>', "probe-c"],
    ['<input class="hours" id="probe-d">', "probe-d"],
    ['<textarea id="probe-e"></textarea>', "probe-e"],
  ];
  for (const [html, id] of cases) {
    const host = doc.createElement("div");
    host.innerHTML = html;
    view.append(host);
    const el = doc.getElementById(id);
    assert(fontSizeOf(el, rules) >= 16, id + " would render below 16px");
    host.remove();
  }
  const approvedOnly = cascade(design.composeStyles(design.readApproved(), "", []));
  const host = doc.createElement("div");
  host.innerHTML = '<div class="followup"><input id="probe-f"></div>';
  view.append(host);
  assert(fontSizeOf(doc.getElementById("probe-f"), approvedOnly) < 16,
    "the approved reference really does set this field below 16px");
  host.remove();
  kit.close();
});

/* ---------------- S12 ROUND 3 (DECISIONS:906, PM ruling): ONE weigh-in write site, both entry points ----------------
   The look's inline weigh form (C-UI-3, the board's #weigh-form) and the sheet Start opens while the weight is owed both
   submit through today-app.cjs submitWeighIn, the one model.weighIn call (look-cui3.test.mjs "S12 R3" holds that
   statically). This is the runtime half, over the real encrypted lane this file already drives: each entry point
   stores exactly ONE op per submit, and the two ops have the same shape (the sheet's is the pre-S12 path). */
const r3OpsOf = async (kit) => (await kit.lane.readings.repository.load()).generation.collections.ops || {};
const r3ShapeOf = (v) => (v === null ? "null" : Array.isArray(v) ? [v.length ? r3ShapeOf(v[0]) : "empty"]
  : typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, r3ShapeOf(v[k])])) : typeof v);
async function r3Until(check, what) {
  for (let tick = 0; tick < 400; tick++) {
    if (await check()) return;
    await new Promise((resolve) => setTimeout(resolve, 2));
  }
  throw new Error("S12 R3: never " + what);
}
test("S12 R3 (DECISIONS:906): the inline weigh form and the Start sheet each store ONE reading op, of the same shape", async () => {
  const inline = await setup();
  const form = slot(inline.doc, "weigh-form");
  assert(form, "the inline weigh form is on Today while this morning's weight is owed");
  form.querySelector("#weight").value = "179.4";
  form.dispatchEvent(new inline.dom.window.Event("submit", { bubbles: true, cancelable: true }));
  await r3Until(async () => Object.keys(await r3OpsOf(inline)).length > 0 && inline.model.read().hasReadToday,
    "stored the inline weigh-in");
  const fromForm = Object.values(await r3OpsOf(inline));
  assert.equal(fromForm.length, 1, "one stored op for one inline submit");

  const sheet = await setup();
  await weighIn(sheet.dom, sheet.doc, 179.4);
  const fromSheet = Object.values(await r3OpsOf(sheet));
  assert.equal(fromSheet.length, 1, "one stored op for one sheet submit");
  assert.deepEqual(r3ShapeOf(fromForm[0]), r3ShapeOf(fromSheet[0]), "the same op shape from both entry points");
  assert.equal(sheet.model.read().hasReadToday, true);
  inline.close();
  sheet.close();
});

/* ---- P9 (PM, the Today repeats, 2026-10-13; supersession pending in the ledger) ----
   The replacements for the cells P9 moved, as cells of their own: each states the user promise the old cell held and
   holds it in the new shape. */
const withView = (model, change) => { const m = Object.create(model); m.read = () => change(model.read()); return m; };

test("P9 call 1: the workout is named once, with Start as its card's own primary; no fixed stack on Today", async () => {
  const kit = await setup();
  const { doc } = kit;
  const card = doc.querySelector("#card-train");
  const start = slot(doc, "primary");
  assert(start && card.contains(start), "Start is inside the workout card");
  assert.equal(start.id, "start", "the same #start");
  assert.equal(doc.querySelectorAll("#phone .stack").length, 0, "no fixed stack on Today");
  assert.equal(doc.querySelectorAll("#phone .primary").length, 1, "one primary action on Today");
  assert.equal(card.querySelectorAll('[data-slot="workout-title"]').length, 1, "the card names the workout");
  start.click();
  assert.equal(kit.api.screen(), "workout", "the card's Start opens the workout");
  kit.close();
});

test("P9 call 3: the inline weigh-in shows only while owed; after the save Log today ticks Weight and its sheet says the value and the engine's note", async () => {
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const spikeNote = reference.applyRead(createBasisState(DAY), DAY, 191.7, { hour: 8 }).reads.at(-1).note;
  assert(spikeNote, "the accepted writer attaches a note to this reading");
  const kit = await setup();
  const { dom, doc } = kit;
  assert.equal(doc.querySelector("#card-weigh").hidden, false, "owed: the morning card is drawn");
  assert(doc.querySelector('#card-weigh [data-slot="weigh-form"] #weight'), "owed: with its inline row");
  assert.equal(doc.querySelector('[data-slot="log-ticks"] [data-item="weight"][data-done]'), null, "owed: Weight is not ticked");
  await weighIn(dom, doc, 191.7);
  assert.equal(doc.querySelector("#card-weigh").hidden, true, "saved: the morning card is not drawn");
  assert.equal(doc.querySelector("#weigh-form"), null, "saved: its inline row is gone");
  assert(doc.querySelector('[data-slot="log-ticks"] [data-item="weight"][data-done] [data-tick]'), "saved: Log today ticks Weight");
  doc.querySelector("#card-log").click();
  assert.equal(slot(doc, "log-weight-state").textContent, plainCopy("191.7 lb \u00b7 " + spikeNote),
    "review F1, held in the sheet: the kept value and the ENGINE's own note, its dash rewritten");
  assert.equal(slot(doc, "log-weight-form"), null, "the sheet's weight entry is replaced by the kept value");
  slot(doc, "log-done").click();
  kit.close();
  /* P9 round 4 (Fable B3; the cell above is a save through the weigh-in sheet, which the sheet confirms): a save on the
     morning card's OWN row is confirmed on that card for the rest of that Today visit, in its saved state, the reading
     and the engine's note and no box; the next fresh Today (back from another screen) draws no card, and Log today
     ticks Weight. */
  const inline = await setup();
  const d2 = inline.doc;
  const box = d2.querySelector('#card-weigh [data-slot="weigh-form"] #weight');
  assert(box, "owed: the card's own row");
  box.value = "191.7";
  d2.querySelector('#card-weigh [data-slot="weigh-form"]').dispatchEvent(new inline.dom.window.Event("submit", { bubbles: true, cancelable: true }));
  for (let at = 0; at < 200 && d2.querySelector("#weigh-form"); at += 1) await new Promise((r) => setTimeout(r, 5));
  assert.equal(d2.querySelector("#weigh-form"), null, "saved on the card: its box is gone");
  assert.equal(d2.querySelector("#card-weigh").hidden, false, "and the card stays, in its saved state");
  assert.equal(slot(d2, "morning").textContent, plainCopy("This morning \u2713 191.7 lb \u00b7 " + spikeNote),
    "saying the saved reading and the ENGINE's own note on it");
  assert(d2.querySelector('[data-slot="log-ticks"] [data-item="weight"][data-done]'), "Log today ticks Weight beside it");
  inline.api.render("nutrition", true);
  inline.api.render("today", true);
  assert.equal(d2.querySelector("#card-weigh").hidden, true, "the next fresh Today draws no card");
  assert.equal(d2.querySelector("#weigh-form"), null, "and asks for nothing");
  assert(d2.querySelector('[data-slot="log-ticks"] [data-item="weight"][data-done] [data-tick]'), "Log today ticks Weight");
  inline.close();
});

/* P9 round 2 (DECISIONS:1003 (4) and (7); was: "a rest day keeps its status line under the headline"): the status line
   is not drawn on either kind of day, its words unchanged in its slot; what it said is said by the workout card, once. */
test("P9 call 4: the status line is not drawn on a training day or a rest day; the workout card says the day, once", async () => {
  const kit = await setup();
  const { doc } = kit;
  assert.equal(doc.querySelector("#phone .body").getAttribute("data-day"), "train", "the fixture day is a training day");
  assert.equal(slot(doc, "status-line").hidden, true, "a training day draws no status line");
  kit.close();
  const store = await lane();
  const real = createTodayModel({ today: DAY, readings: store.readings });
  const rest = await setup({ lane: store, model: withView(real, restDay) });
  assert.equal(rest.doc.querySelector("#phone .body").getAttribute("data-day"), "rest");
  assert.equal(slot(rest.doc, "status-line").hidden, true, "a rest day draws no status line");
  assert.equal(slot(rest.doc, "status-line").textContent, "Nothing scheduled today, so there is nothing to start.",
    "its words are unchanged in the slot (T-12)");
  assert.equal(slot(rest.doc, "workout-count").textContent, "No session is scheduled today.", "the workout card says it");
  assert.equal(slot(rest.doc, "workout-count").hidden, false, "and is drawn");
  rest.close();
});

/* P9 round 2 (DECISIONS:1003 (7)): a rest day's face is the training day's. The large plan headline and its label give
   way (the stylesheet's rest rules, routine.test RT-12), the engine's advice under it is the same node, whole, directly
   under the workout card, and the weigh-in is asked for once, by the morning card's own row, not by a second button. */
const restDay = (view) => ({ ...view, workout: { ...view.workout, today: false, available: false, unavailableReason: null, exerciseCount: null } });
test("P9 round 2 rest day: the advice is a whole line under the workout card, and the weigh-in is asked once", async () => {
  const store = await lane();
  const real = createTodayModel({ today: DAY, readings: store.readings });
  const restModel = withView(real, restDay);
  const kit = await setup({ lane: store, model: restModel });
  const { doc } = kit;
  const view = restModel.read();
  assert.equal(view.hasReadToday, false, "the morning is owed");
  const card = doc.querySelector("#card-train");
  const why = slot(doc, "instruction-why");
  /* P9 round 3 (the PM's style call; was: a line of its own directly under the card): the card's third line, under its
     no-session line, in that line's own secondary class */
  assert.equal(why.parentElement, card, "the engine's advice is a line of the workout card");
  assert.equal(why.previousElementSibling, slot(doc, "workout-count"), "its third line, under the no-session line");
  assert.equal(why.className, slot(doc, "workout-count").className, "in that line's own secondary style (.sub)");
  assert.equal(doc.querySelector("#greeting").parentElement.contains(why), false, "and no longer under the plan headline");
  assert.equal(doc.querySelectorAll('[data-slot="instruction-why"]').length, 1, "one node, moved, not copied");
  assert.equal(why.textContent, plainCopy(view.orderSentence || view.statusFace.cause), "the engine's own sentence, whole");
  assert.equal(why.hidden, false, "and drawn");
  assert.equal(slot(doc, "instruction").textContent, plainCopy(view.nowModel.move.title), "the headline slot keeps its words for every reader");
  const form = doc.querySelector('#card-weigh [data-slot="weigh-form"]');
  assert(form && form.querySelector("#weight"), "the morning card's own row asks for the weight");
  assert.equal(slot(doc, "weigh-save").disabled, false, "and its Save can be pressed: one tap");
  assert.equal(slot(doc, "primary").hidden, true, "no second weigh-in button on the workout card");
  assert.equal(slot(doc, "primary").disabled, true, "and nothing behind it can be pressed");
  /* the row's Save goes through the page's one weigh-in write site, which answers in words (an empty box is refused) */
  form.dispatchEvent(new kit.dom.window.Event("submit", { cancelable: true }));
  for (let at = 0; at < 200 && slot(doc, "weigh-note").hidden !== false; at += 1) await new Promise((r) => setTimeout(r, 5));
  assert.equal(slot(doc, "weigh-note").hidden, false, "the one write site answered the row's Save");
  kit.close();
});

/* P9 round 2 (DECISIONS:1003 (2); test added): on a Today with no Log today card (a blocked record), the check-in is still
   one tap from the face's More row: the sheet's FIRST row is the board's "Recovery check in", which opens the recovery
   screen. Where Log today is on the face the row is not drawn (the check-in is Log today's). */
test("P9 round 2 blocked Today: the More sheet's first row is Recovery check in, and it opens the check-in", async () => {
  const store = await lane();
  const real = createTodayModel({ today: DAY, readings: store.readings });
  const kit = await setup({ lane: store, model: withView(real, (view) => ({ ...view, blocked: true,
    blockedCopy: "This device\u2019s record did not verify. Nothing on this screen is a value." })) });
  const { doc } = kit;
  assert.equal(doc.querySelector("#card-log").hidden, true, "precondition: no Log today card on a blocked Today");
  slot(doc, "more-entry").click();
  const rows = [...slot(doc, "more-sheet").querySelectorAll(".tcard.nav")];
  assert.equal(rows[0].getAttribute("data-slot"), "recovery-entry", "the first row is the check-in");
  assert.equal(rows[0].textContent.trim(), "Recovery check in", "in the board's words");
  assert.deepEqual(rows.map((r) => r.textContent.trim()), ["Recovery check in", app.PROBLEM_ENTRY],
    "and nothing that would read the untrusted record");
  rows[0].click();
  assert.equal(slot(doc, "more-sheet"), null, "the sheet closes");
  assert.equal(kit.api.screen(), "recovery", "one tap from the sheet opens the check-in");
  kit.close();
  const plain = await setup();
  plain.doc.querySelector('[data-slot="more-entry"]').click();
  assert.equal(slot(plain.doc, "more-sheet").querySelector('[data-slot="recovery-entry"]'), null,
    "with Log today on the face the sheet draws no Recovery row");
  assert(plain.doc.querySelector("#card-log") && !plain.doc.querySelector("#card-log").hidden, "the check-in is Log today's there");
  slot(plain.doc, "more-done").click();
  plain.close();
});

test("P9 call 5: the weight trend is drawn only with a trend figure, as the same line from the same slot", async () => {
  assert.equal(app.trendFigure({ nowModel: { headed: { weight: 180.1 } } }), 180.1);
  assert.equal(app.trendFigure({ nowModel: { headed: { weight: null } } }), null);
  assert.equal(app.trendFigure({ nowModel: null }), null);
  const kit = await setup();
  const view = kit.model.read();
  assert(Number.isFinite(view.nowModel.headed.weight), "the fixture holds a trend figure");
  assert.equal(slot(kit.doc, "trend-row").hidden, false, "with a figure the line is drawn");
  assert.equal(slot(kit.doc, "trend").textContent, trendLine(view), "and says exactly trendLine's words and figure");
  kit.close();
  const store = await lane();
  const real = createTodayModel({ today: DAY, readings: store.readings });
  const none = await setup({ lane: store, model: withView(real, (v) => ({ ...v, nowModel: { ...v.nowModel, headed: { ...v.nowModel.headed, weight: null } } })) });
  assert.equal(slot(none.doc, "trend-row").hidden, true, "with no figure the line is not drawn");
  assert.doesNotMatch(phoneText(none.doc), /Weight trend/, "and Not available yet is not said for it");
  none.close();
});

test("P9 call 6: one More row opens a sheet whose rows, in the PM's order, open exactly what the links opened", async () => {
  const kit = await setup();
  const { doc } = kit;
  for (const gone of ['[data-go="why"]', '[data-slot="problem-entry"]', '[data-slot="measure-tile"]', '[data-slot="import-entry"]', '[data-slot="routine-entry"]'])
    assert.equal(doc.querySelector("#phone .body " + gone), null, "off Today's face: " + gone);
  const more = slot(doc, "more-entry");
  assert.equal(more.textContent, app.MORE_ENTRY, "one quiet row, More");
  more.click();
  const sheet = slot(doc, "more-sheet");
  assert(sheet && sheet.getAttribute("role") === "dialog", "the sheet is a dialog");
  assert.equal(sheet.getAttribute("aria-label"), app.MORE_ENTRY);
  assert.equal(doc.querySelector("#phone .body").inert, true, "Today is inert under it");
  /* the rows Today drew (Measure, Why this plan? and Report a problem always; the Import and routine entries on their
     own gates, which the route and routine suites drive), in the PM's order */
  const rows = [...sheet.querySelectorAll(".tcard.nav")].map((b) => b.textContent.trim());
  const ORDER = ["Measure", "Change my routine", "Why this plan?", "Import my history", "History imported", app.PROBLEM_ENTRY];
  assert.deepEqual(rows, ORDER.filter((r) => rows.includes(r)), "the PM's order: " + JSON.stringify(rows));
  for (const r of ["Measure", "Why this plan?", app.PROBLEM_ENTRY]) assert(rows.includes(r), "the sheet carries " + r);
  assert.equal(rows.length, new Set(rows).size, "each once");
  slot(doc, "more-close").click();
  assert.equal(slot(doc, "more-sheet"), null, "the close control closes it");
  assert.equal(doc.activeElement, slot(doc, "more-entry"), "and hands focus back to More");
  more.click();
  slot(doc, "more-sheet").dispatchEvent(new kit.dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  assert.equal(slot(doc, "more-sheet"), null, "Escape closes it");
  viaMore(doc, '[data-slot="measure-tile"]');
  assert.equal(kit.api.screen(), "measure", "Measure opens Measure");
  kit.api.render("today", true);
  viaMore(doc, '[data-go="why"]');
  assert.equal(kit.api.screen(), "why", "Why this plan? opens Why this plan?");
  doc.querySelector('[data-go="today"]').click();
  slot(doc, "more-entry").click();
  slot(doc, "problem-entry").click();
  for (let at = 0; at < 200 && slot(doc, "problem-box").hidden; at += 1) await new Promise((r) => setTimeout(r, 5));
  assert.equal(slot(doc, "problem-box").hidden, false, "Report a problem opens its box, in the sheet");
  assert.match(slot(doc, "problem-text").value, /\S/, "with the diagnostic block in it");
  assert.equal(slot(doc, "problem-said").hidden, false, "and says what to do with it");
  assert.equal(kit.api.screen(), "today", "and stays on Today");
  slot(doc, "more-done").click();
  kit.close();
});
