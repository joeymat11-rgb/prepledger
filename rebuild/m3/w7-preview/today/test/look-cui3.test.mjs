// look-cui3.test.mjs - C-UI-3 static cells: the proposal card (T-40, T-40b..e, the kinds of
// T-40f/g), its status line, "Applied" only from stored engine evidence, the gold edge only
// while open, the inline weigh-in (T-42..T-51) and the earned-weight card's styling.
// Reads bytes only. The delimited C-UI-3 blocks of today-app.cjs and today-model.cjs are
// evaluated alone in a bare vm context (no require, no engine, no DOM, no network).
// Round 2 (Fable l1 F1, F6, F7; PM rulings R1, R2) also requires two pure modules, never an
// engine module: plain-copy.cjs (the page's own dash rule) and ../fixtures.cjs (the invented
// synthetic athlete, data only).
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const TODAY = path.resolve(import.meta.dirname, "..");
const PACK = path.resolve(TODAY, "../../../m1/approved-2026-09-18");
const read = (p) => fs.readFileSync(p, "utf8");
const TEMPLATE = path.join(TODAY, "screens.template.html");
const APP = path.join(TODAY, "today-app.cjs");
const MODEL = path.join(TODAY, "today-model.cjs");
const DESIGN = path.join(TODAY, "design.cjs");
const PREVIEW_CSS = path.join(TODAY, "preview.css");
const PROTO = read(path.join(PACK, "app/states-today.js"));
const BOARD = read(path.join(PACK, "app/app.html"));
const PACK_CSS = read(path.join(PACK, "app/app.css")) + "\n" + read(path.join(PACK, "app/states.css"));
const requireHere = createRequire(import.meta.url);
const { plainOrDrop } = requireHere(path.join(TODAY, "plain-copy.cjs"));
const Fixtures = requireHere(path.join(TODAY, "../fixtures.cjs"));
const WRITERS = read(path.resolve(TODAY, "../../../engine/writers.cjs")); // read as text, never loaded
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);
const DASHES = new RegExp("[" + EN + EM + "]");

function block(src, begin, end) {
  const b = src.indexOf(begin);
  const e = src.indexOf(end);
  assert(b >= 0 && e > b, "one delimited block: " + begin);
  assert.equal(src.indexOf(begin, b + 1), -1, "the block is delimited once: " + begin);
  return src.slice(b, e);
}
function evaluate(src, names) {
  const ctx = vm.createContext({});
  vm.runInContext(src + "\n;" + names.map((n) => `globalThis.${n} = ${n};`).join(""), ctx);
  return ctx;
}
function todayTemplate() {
  const html = read(TEMPLATE);
  const at = html.indexOf('<template id="t-today">');
  assert(at >= 0);
  return html.slice(at, html.indexOf("</template>", at));
}
function rules(css) {
  const out = [];
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const decls = {};
    for (const part of m[2].split(";")) { const i = part.indexOf(":"); if (i > 0) decls[part.slice(0, i).trim()] = part.slice(i + 1).trim(); }
    for (const sel of m[1].split(",")) out.push({ selector: sel.trim().replace(/\s+/g, " "), decls });
  }
  return out;
}
const inProto = (w) => PROTO.includes("'" + w + "'") || PROTO.includes(w);

test("C-UI-3 T-40: Today carries the board's proposal card with the real, bound #proposal-lift", () => {
  const today = todayTemplate();
  const card = block(today, "<!-- C-UI-3 BEGIN (the proposal card", "<!-- C-UI-3 END (the proposal card) -->");
  const open = card.match(/<div\b[^>]*\bid="card-proposal"[^>]*>/g) || [];
  assert.equal(open.length, 1, "one proposal card");
  assert.match(open[0], /\bclass="tcard proposal"/, "the board's classes, so the pack draws it");
  const lift = today.match(/<[^>]+\bid="proposal-lift"[^>]*>/g) || [];
  assert.equal(lift.length, 1, "exactly one #proposal-lift on Today");
  assert.match(lift[0], /\bclass="lift"/);
  assert.match(lift[0], /\bdata-slot="proposal-lift"/, "the identity is a bound slot, not an alias");
  assert(card.includes(lift[0]), "#proposal-lift lives in the card");
  assert(!/data-slot="[^"]*"[^>]*\bid="proposal-lift"[^>]*>[^<]+</.test(card), "the lift carries no literal");
  for (const n of ["105", "115", "Bench", "Chest"]) assert(!card.includes(n), "no board example in the card: " + n);
  const timeline = today.slice(today.indexOf('<div class="timeline">'));
  assert(timeline.indexOf('id="card-train"') < timeline.indexOf('id="card-proposal"'), "the card follows Train, as the board draws it");
  const serif = rules(PACK_CSS).filter((r) => r.selector === ".proposal .lift" && r.decls["font-family"]);
  assert.equal(serif.length, 1);
  assert.equal(serif[0].decls["font-family"], "var(--serif)", "the pack sets the lift in the serif");
  const app = read(APP);
  assert(app.includes('map.get("proposal-lift").textContent = plainOrDrop(face.lift, "proposal-lift")'), "renderToday binds the lift from the engine's card");
});

function faceModule() {
  const src = block(read(APP), "/* C-UI-3 PROPOSAL CARD BEGIN", "/* C-UI-3 PROPOSAL CARD END */");
  return evaluate(src, ["proposalFace"]).proposalFace;
}
const SETS = { id: "p1", source: "proposal", title: "ENGINE TITLE", why: "Your chest lifts are holding while the scale falls.", kind: "sets", delta: 1, lift: "Incline press" };

test("C-UI-3 T-40..T-40e: each state says the prototype's words, bound to the engine's card", () => {
  const face = faceModule();
  const open = face(SETS, {}, undefined, null);
  assert.equal(open.state, "open");
  assert.equal(open.kind, "One call needs you");
  assert.equal(open.lift, "Incline press", "the lift is the engine's lift name");
  assert.equal(open.change, "Add one set this week");
  assert.equal(open.reason, SETS.why + " Nothing changes until you say yes.");
  assert.equal(open.yes, "Yes, add it");
  assert.equal(open.no, "No, keep it as is");
  assert.equal(open.className, "tcard proposal");
  const noLift = face({ ...SETS, lift: null }, {}, undefined, null);
  assert.equal(noLift.lift, "ENGINE TITLE", "without a named lift, the engine's own card title");
  const recorded = face(SETS, {}, "yes", "p1");
  assert.deepEqual([recorded.state, recorded.kind, recorded.stateWord, recorded.stateText, recorded.undo, recorded.yes],
    ["recorded", "Your call", "You said yes.", "It applies when your plan is next built.", "Change my answer", null]);
  const declined = face(SETS, {}, "no", "p1");
  assert.deepEqual([declined.state, declined.kind, declined.stateWord, declined.stateText, declined.undo],
    ["declined", "Your call", "You said no.", "Nothing changes.", "Change my answer"]);
  const applied = face(null, { p1: { status: "applied", title: "ENGINE TITLE", lift: "Incline press" } }, undefined, "p1");
  assert.deepEqual([applied.state, applied.kind, applied.stateWord, applied.undo, applied.lift],
    ["applied", "Applied", "You said yes.", null, "Incline press"]);
  const withdrawn = face(null, { p1: { status: "withdrawn", title: "ENGINE TITLE", lift: null } }, "yes", "p1");
  assert.deepEqual([withdrawn.state, withdrawn.kind, withdrawn.stateWord, withdrawn.stateText, withdrawn.undo],
    ["withdrawn", "Withdrawn", "Withdrawn.", "Your plan was rebuilt and this proposal no longer applies.", null]);
  const storedNo = face(null, { p1: { status: "declined", title: "T", lift: null } }, undefined, "p1");
  assert.deepEqual([storedNo.state, storedNo.undo], ["declined", null], "a stored decline has no path back from here, so no control");
  for (const f of [open, recorded, declined, applied, withdrawn]) {
    for (const w of [f.kind, f.change, f.yes, f.no, f.stateWord, f.stateText, f.undo]) if (w) assert(inProto(w), "the prototype draws: " + w);
  }
  const brk = face({ ...SETS, kind: "break", delta: null, lift: null, title: "DIET BREAK" }, {}, undefined, null);
  assert.deepEqual([brk.yes, brk.no, brk.change], ["Yes, take the break", "No, keep cutting", ""]);
  const ladder = face({ ...SETS, kind: "ladder", delta: null }, {}, undefined, null);
  assert.deepEqual([ladder.yes, ladder.no, ladder.change], ["Yes, use them", "No, keep the plan’s steps", "Use the machine’s own steps"]);
  for (const other of [{ kind: "cal", delta: null }, { kind: "sets", delta: -1 }, { kind: "sets", delta: 2 }, { kind: "volume", delta: null }]) {
    const f = face({ ...SETS, ...other }, {}, undefined, null);
    assert.deepEqual([f.yes, f.no, f.change], [null, null, ""], "no decision words the prototype does not draw for " + JSON.stringify(other));
    assert.equal(f.reason, SETS.why, "and no invitation to a yes that cannot be given");
    /* F7 (Fable l1, PM ruling): the prototype draws no card without decisions (every open
       state in app/states-today.js T-40, T-40f, T-40g, T-40h carries yes and no), so it has no
       eyebrow for one; such a card takes no eyebrow at all, never "One call needs you". */
    assert.equal(f.kind, "", "F7: no eyebrow that invites a call on a card with no decisions: " + JSON.stringify(other));
  }
  for (const k of ["sets", "break", "ladder"]) {
    const f = face({ ...SETS, kind: k, delta: k === "sets" ? 1 : null }, {}, undefined, null);
    assert.equal(f.kind, "One call needs you", "a kind the prototype draws decisions for keeps its eyebrow: " + k);
  }
  assert.equal(face(null, {}, undefined, null), null, "no open proposal and nothing stored: no card");
  assert.equal(face(null, {}, undefined, "p9"), null, "a card id the record does not hold: no card");
});

test("C-UI-3 LOCKED: a tap alone never shows Applied; only the stored record does", () => {
  const face = faceModule();
  for (const answer of ["yes", "no", undefined]) {
    const f = face(SETS, {}, answer, "p1");
    assert.notEqual(f.state, "applied");
    assert.notEqual(f.kind, "Applied");
  }
  const src = block(read(MODEL), "/* C-UI-3 BEGIN (the proposal card", "/* C-UI-3 END */");
  const m = evaluate(src, ["storedProposalAnswers", "openProposalCard"]);
  const ex = [{ id: "e1", n: "Incline press" }];
  const base = (p, adjustments) => ({ exercises: ex, proposals: [p], adjustments });
  const P = { id: "p1", rid: "r1", title: "T", why: "W", apply: { kind: "sets", exId: "e1", delta: 1 } };
  assert.deepEqual({ ...m.storedProposalAnswers(base({ ...P, resolved: false }, [])) }, {}, "an open proposal is not an answer");
  assert.equal(m.storedProposalAnswers(base({ ...P, resolved: true }, [{ rid: "r1" }])).p1.status, "applied");
  assert.equal(m.storedProposalAnswers(base({ ...P, resolved: true }, [{ rid: "r1", undone: true }])).p1, undefined, "an undone adjustment is not applied");
  assert.equal(m.storedProposalAnswers(base({ ...P, resolved: true }, [])).p1, undefined, "resolved with no adjustment row is not applied");
  assert.equal(m.storedProposalAnswers(base({ ...P, resolved: true, dismissed: true }, [{ rid: "r1", dismissed: true }])).p1.status, "declined");
  assert.equal(m.storedProposalAnswers(base({ ...P, resolved: true, superseded: true }, [])).p1.status, "withdrawn");
  assert.equal(m.storedProposalAnswers(base({ ...P, resolved: true, resolvedHow: "withdrawn - x" }, [{ rid: "r1" }])).p1.status, "withdrawn");
  const card = m.openProposalCard({ exercises: ex, proposals: [{ ...P, resolved: true, id: "old" }, { ...P, resolved: false }], agentProposals: [{ id: "a1", title: "AGENT" }] });
  assert.deepEqual([card.id, card.source, card.kind, card.delta, card.lift, card.title, card.why], ["p1", "proposal", "sets", 1, "Incline press", "T", "W"]);
  const agent = m.openProposalCard({ proposals: [], agentProposals: [{ id: "a1", kind: "volume", title: "AGENT", why: "Y" }] });
  assert.deepEqual([agent.id, agent.source, agent.kind, agent.title], ["a1", "agent", "volume", "AGENT"]);
  assert.equal(m.openProposalCard({ proposals: [], agentProposals: [] }), null);
});

test("C-UI-3 T-40: the status line says the prototype's words while a proposal is open", () => {
  const src = block(read(APP), "/* C-UI-2 STATUS LINE BEGIN", "/* C-UI-2 STATUS LINE END */");
  const statusLine = evaluate(src, ["statusLine"]).statusLine;
  const DOT = " · ";
  const view = (n, over) => Object.assign({ blocked: false, workout: { title: "UPPER BODY" + DOT + "TODAY", today: true, exerciseCount: 4, unavailableReason: null },
    nowModel: { decisionsN: n }, calorieTarget: { mid: 2300 } }, over);
  const rows = [
    ["T-40 open", view(1), null, false, "open", "Upper body today. One change to review."],
    ["T-40b recorded", view(1), null, false, "recorded", "Upper body today. One answer recorded."],
    ["T-40d declined", view(1), null, false, "declined", "Upper body today. Nothing to decide."],
    ["two open proposals: the prototype has no line", view(2), null, false, "open", ""],
    ["a logged session with an open card: no line", view(1), { phase: "finished" }, false, "open", ""],
    /* R1 consequence (round 2): the prototype's T-02 does not hide the card (app/states-today.js
       T-02 calls no noProposal), so the board's sample face draws the open card UNDER T-02's
       own line; the demo athlete now carries that card at the board date. */
    ["T-02 sample athlete with the open card: T-02's line", view(1), null, true, "open", "Upper body today. Sample data."],
    ["sample athlete with two open proposals: no line", view(2), null, true, "open", ""],
    ["sample athlete, no card state handed in: no line", view(1), null, true, undefined, ""],
    ["no card state handed in: no line", view(1), null, false, undefined, ""],
  ];
  /* L2-1 (Fable l2, PM ruling round 3): the pending-adoption gate (today-model.cjs read())
     evaluated alone over the sample athlete's view, which carries the fixture's one open card
     and its count. The gate hides the count together with the card, so the line is the
     recorded departure F4 (T-12's words), never an empty line. */
  const gate = block(read(MODEL), "if (pendingAdoption) {", "/* S2. The whole sentence");
  const gctx = vm.createContext({ pendingAdoption: true, basis: {}, clone: (x) => JSON.parse(JSON.stringify(x)),
    E: { statusFace: () => ({}) }, view: view(1, { proposal: { id: "p1" }, proposalStored: {}, marchingOrder: {} }) });
  vm.runInContext(gate, gctx);
  const live = evaluate(block(read(APP), "/* C-UI-3 PROPOSAL CARD BEGIN", "/* C-UI-3 PROPOSAL CARD END */"), ["liveProposalFace"]).liveProposalFace;
  const gface = live(gctx.view.proposal || null, gctx.view.proposalStored || {}, null, plainOrDrop);
  rows.push(["F4 pending adoption: the fixture's card and its count are hidden, T-12's line", gctx.view, null, false,
    gface ? gface.state : undefined, "Nothing scheduled today, so there is nothing to start."]);
  for (const [label, v, session, sample, card, want] of rows) {
    assert.equal(statusLine(v, session, sample, card), want, label);
    if (want) assert(PROTO.includes("'" + want + "'"), label + ": the prototype draws exactly these words");
  }
  assert(read(APP).includes("statusLine(view, today, sample, face ? face.state : undefined)"), "renderToday hands the card's state to the line");
});

test("C-UI-3: the gold edge only while open (the pack's rules, the card's classes)", () => {
  const face = faceModule();
  const r = rules(PACK_CSS);
  const gold = r.filter((x) => x.selector === ".proposal" && x.decls["border-color"] === "var(--line-gold)");
  assert(gold.length >= 1, "the pack draws the proposal edge gold");
  const soft = new Set(r.filter((x) => x.decls["border-color"] === "var(--line-soft)").map((x) => x.selector));
  const states = [face(SETS, {}, "yes", "p1"), face(SETS, {}, "no", "p1"),
    face(null, { p1: { status: "applied", title: "T" } }, undefined, "p1"), face(null, { p1: { status: "withdrawn", title: "T" } }, undefined, "p1")];
  for (const f of states) {
    const cls = f.className.split(" ").find((c) => c.startsWith("is-"));
    assert(cls && soft.has(".proposal." + cls), f.state + " takes a pack class that lowers the edge: " + f.className);
  }
  assert.equal(face(SETS, {}, undefined, null).className, "tcard proposal", "the open card keeps the gold edge");
  const css = block(read(PREVIEW_CSS), "/* C-UI-3 BEGIN", "/* C-UI-3 END */");
  for (const r of rules(css)) assert(!/\.proposal\b/.test(r.selector), "C-UI-3 adds no rule of its own to the proposal card: " + r.selector);
});

test("C-UI-3 T-42..T-51: the weigh-in is inline on the card, as the board draws it", () => {
  const today = todayTemplate();
  const weigh = block(today, "<!-- C-UI-3 BEGIN (the inline weigh-in", "<!-- C-UI-3 END (the inline weigh-in) -->");
  const card = today.slice(today.indexOf('id="card-weigh"'), today.indexOf('id="card-eat"'));
  assert(card.includes(weigh), "the form sits in #card-weigh");
  assert.match(weigh, /<form class="weigh-row" id="weigh-form" data-slot="weigh-form" novalidate>/);
  assert.match(weigh, /<label for="weight" class="visually-hidden">Your weight in pounds<\/label>/);
  assert.match(weigh, /<input id="weight" type="text" inputmode="decimal" placeholder="Your weight" autocomplete="off">/);
  assert.match(weigh, /<span class="unit">lb<\/span>/);
  assert.match(weigh, /<button class="save" type="submit" id="save-weight" data-slot="weigh-save"><\/button>/);
  assert.match(weigh, /<div class="weigh-note" id="weigh-note" data-slot="weigh-note" role="alert" hidden><\/div>/);
  for (const w of ["Your weight in pounds", "Your weight", "lb"]) assert(BOARD.includes(w), "the board's word: " + w);
  const src = block(read(APP), "/* C-UI-3 WEIGH-IN BEGIN", "/* C-UI-3 WEIGH-IN END */");
  const m = evaluate(src, ["WEIGH_SAVE", "WEIGH_SAVING", "weighNamesTheField"]);
  assert.equal(m.WEIGH_SAVE, "Save");
  assert.equal(m.WEIGH_SAVING, "Saving");
  assert(PROTO.includes("a.text('#save-weight', 'Saving')"), "T-44 draws Saving");
  const OOR = "A morning weight is recorded between 60 and 400 lb, to one decimal place. Nothing was recorded.";
  assert(PROTO.includes(OOR), "T-45's words are the model's own");
  assert.equal(m.weighNamesTheField("20", OOR, OOR), true, "T-45 flags the field");
  assert.equal(m.weighNamesTheField("", "A weight is required.", OOR), true, "T-46 flags the field");
  assert.equal(m.weighNamesTheField("181.4", "This weight could not be recorded, and nothing was recorded.", OOR), false, "T-49 does not");
  assert.equal(m.weighNamesTheField("181.4", "x", OOR), false, "T-47/T-48 do not");
  const app = read(APP);
  assert(app.includes('field.classList.toggle("is-invalid", weighNamesTheField(raw, result.copy, model.OUT_OF_RANGE))'), "the refusal flags the field it names");
  assert(app.includes('note.className = "weigh-note refusal"'), "the refusal is placed in the card's note");
  assert(app.includes("save.textContent = plainOrDrop(WEIGH_SAVING"), "Save reads Saving while the write is in flight");
  const flag = rules(PACK_CSS).filter((x) => x.selector === ".weigh-row .field.is-invalid");
  assert.equal(flag.length, 1, "the pack draws the flagged field");
});

test("C-UI-3: the earned-weight card is styled like the proposal card, no new colour or type size", () => {
  const css = block(read(PREVIEW_CSS), "/* C-UI-3 BEGIN", "/* C-UI-3 END */");
  const mine = rules(css.slice(css.indexOf("*/") + 2));
  const offer = mine.filter((x) => x.selector === '[data-native-load="offer"]');
  assert.equal(offer.length, 1, "one rule draws the card");
  const o = offer[0].decls;
  assert.equal(o.border, "1px solid var(--line-gold)", "the proposal card's gold edge (app.css .proposal)");
  assert.equal(o.background, "var(--card)");
  assert.equal(o["border-radius"], "var(--radius-card)");
  const buttons = mine.filter((x) => x.selector === '[data-native-load="offer"] > button[data-native-load]');
  assert.equal(buttons.length, 1, "the yes and not-now buttons take the decision button");
  assert.equal(buttons[0].decls.background, "var(--decision)");
  const packSizes = new Set([...PACK_CSS.matchAll(/font-size:\s*([\d.]+px)/g)].map((x) => x[1]));
  const packVars = new Set([...PACK_CSS.matchAll(/(--[\w-]+)\s*:/g)].map((x) => x[1]));
  for (const r of mine) {
    for (const [k, v] of Object.entries(r.decls)) {
      if (k === "font-size") assert(packSizes.has(v), "a pack type size: " + r.selector + " " + v);
      if (k === "font-family") assert.equal(v, "var(--sans)", "sans only: the card adds no serif identity (gate.py SERIF_SELECTORS)");
      if (/colou?r|background|border/.test(k)) {
        assert(!/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(v), "no new colour: " + r.selector + " " + k + ": " + v);
        for (const t of v.matchAll(/var\((--[\w-]+)\)/g)) assert(packVars.has(t[1]), "a pack token: " + t[1]);
      }
    }
  }
});

test("C-UI-3: every word the card and the weigh-in add is declared in design.cjs under C-UI-3", () => {
  const design = read(DESIGN);
  const at = design.indexOf("C-UI-3 (pack README C-UI-3");
  assert(at > 0, "design.cjs carries the C-UI-3 declaration");
  const words = ["One call needs you", "Your call", "Applied", "Withdrawn", "Nothing changes until you say yes.",
    "You said yes.", "It applies when your plan is next built.", "You said no.", "Nothing changes.", "Withdrawn.",
    "Your plan was rebuilt and this proposal no longer applies.", "Change my answer", "Yes, add it", "No, keep it as is",
    "Add one set this week", "Yes, take the break", "No, keep cutting", "Yes, use them", "No, keep the plan’s steps",
    "Use the machine’s own steps", " today. One change to review.", " today. One answer recorded.", "Saving"];
  for (const w of words) {
    const decl = design.indexOf(JSON.stringify(w), at);
    assert(decl > at, "declared under C-UI-3: " + w);
    assert(PROTO.includes(w), "the prototype's own word: " + w);
  }
});

/* ---------------- Round 2 (Fable l1 NOT READY; PM rulings F1, R1, R2, F6, F7) ---------------- */
const UNTIL_YES = "Nothing changes until you say yes.";
function round2Module() {
  const src = block(read(APP), "/* C-UI-3 PROPOSAL CARD BEGIN", "/* C-UI-3 PROPOSAL CARD END */");
  return evaluate(src, ["proposalFace", "liveProposalFace"]);
}

test("C-UI-3 F1: an engine reason drops alone and the pack sentence stays; an empty lift draws no card", () => {
  const { proposalFace: face } = round2Module();
  /* Engine-shaped strings (writers.cjs:1899-1900 volpush title and reason, :1939 owner's call
     range): every one carries U+2014 or U+2013. plainCopy rewrites these three shapes. */
  const engineTitle = "Chest " + EM + " EARNED VOLUME: 10 → 12 WEEKLY SETS";
  const engineWhy = "Your own measured state earned this through the stall arm: the scale is stalled with nothing looking wrong "
    + EM + " lifts not falling, recovery GREEN " + EM + " and a stalled scale with clean instruments still earns the question.";
  const rangeWhy = "Approving adds 1 set each upper session " + EM + " roughly 5" + EN + "10 weekly sets.";
  /* A dash in no shape plainCopy rewrites: plainOrDrop refuses it and the slot is dropped. */
  const refusedWhy = "Your chest lifts are holding" + EM + "the scale falls.";
  const refusedTitle = "BANDTOP" + EM + "REDLINE";
  const rewritten = face({ ...SETS, why: engineWhy }, {}, undefined, null, plainOrDrop);
  assert.equal(rewritten.reason, plainOrDrop(engineWhy, "t") + " " + UNTIL_YES, "the engine's reason, its dash taken out, then the pack sentence");
  assert(!DASHES.test(rewritten.reason));
  const range = face({ ...SETS, why: rangeWhy }, {}, undefined, null, plainOrDrop);
  assert.equal(range.reason, "Approving adds 1 set each upper session: roughly 5 to 10 weekly sets. " + UNTIL_YES);
  const dropped = face({ ...SETS, why: refusedWhy }, {}, undefined, null, plainOrDrop);
  assert.equal(dropped.reason, UNTIL_YES, "a reason the page cannot print is dropped ALONE; the pack sentence is always shown");
  const titled = face({ ...SETS, lift: null, title: engineTitle }, {}, undefined, null, plainOrDrop);
  assert.equal(titled.lift, "Chest: EARNED VOLUME: 10 → 12 WEEKLY SETS", "the engine's own title, its dash taken out");
  assert.equal(face({ ...SETS, lift: null, title: refusedTitle, kind: "cal", delta: null }, {}, undefined, null, plainOrDrop), null,
    "no card at all when the bound lift name is empty after the drop");
  assert.equal(face(null, { p1: { status: "withdrawn", title: refusedTitle, lift: null } }, undefined, "p1", plainOrDrop), null,
    "a stored outcome whose lift name drops draws no card either");
  for (const f of [rewritten, range, dropped, titled]) {
    for (const v of Object.values(f)) if (typeof v === "string") assert(!DASHES.test(v), "no dash reaches a slot: " + v);
  }
  assert(read(APP).includes("liveProposalFace(view.proposal || null, view.proposalStored || {}, proposalShown, plainOrDrop)"),
    "the page hands its own plainOrDrop to the face, so the drop happens per field");
});

test("C-UI-3 R2: the live card draws no decision and no answered state until an answer is stored", () => {
  const { liveProposalFace: live, proposalFace: face } = round2Module();
  assert.equal(live.length, 4, "the live face takes no answer: nothing on this page holds one");
  const open = live(SETS, {}, null, plainOrDrop);
  assert.deepEqual([open.state, open.yes, open.no, open.kind, open.lift, open.change],
    ["open", null, null, "", "Incline press", "Add one set this week"], "open, with no decisions and so no eyebrow that invites a call");
  /* L2-2 (PM ruling round 3): no yes can be given on the live route, so the live open card
     drops the pack sentence that invites one (the principle of R2 and DECISIONS:820 R4); the
     review faces keep it. */
  assert.equal(open.reason, SETS.why, "L2-2: the engine's reason alone on the live card");
  assert(!open.reason.includes(UNTIL_YES), "L2-2: no invitation to a yes the live card cannot take");
  assert.equal(live({ ...SETS, why: "Your chest lifts are holding" + EM + "the scale falls." }, {}, null, plainOrDrop).reason, "",
    "L2-2: a dropped engine reason leaves the live card no reason at all");
  assert.equal(face(SETS, {}, undefined, null).reason, SETS.why + " " + UNTIL_YES, "the review face keeps the pack sentence (PM F1)");
  for (const status of ["applied", "declined"]) {
    assert.equal(live(null, { p1: { status, title: "T", lift: "Incline press" } }, "p1", plainOrDrop), null, status + " is drawn by the state registry only");
  }
  const withdrawn = live(null, { p1: { status: "withdrawn", title: "T", lift: "Incline press" } }, "p1", plainOrDrop);
  assert.equal(withdrawn.state, "withdrawn", "a withdrawal is the stored record's, not an answer");
  /* The registry faces (T-40b recorded, T-40c applied, T-40d declined) stay drawn by proposalFace. */
  assert.equal(face(SETS, {}, "yes", "p1").state, "recorded");
  assert.equal(face(SETS, {}, "no", "p1").state, "declined");
  const app = read(APP);
  const bind = block(app, "/* C-UI-3 BEGIN (binding", "/* C-UI-3 END */");
  assert(!bind.includes("proposalAnswers"), "no page-held answers");
  assert(!bind.includes("proposal-yes") && !bind.includes("proposal-undo\").textContent"), "no decision or Change my answer is bound live");
  assert(bind.includes("map.get(\"proposal-decisions\").remove()"), "the decisions are removed from the live card");
  assert(!bind.includes("It applies when your plan is next built."), "the live route never says it applies");
  const liveSrc = block(app, "/* R2 (PM ruling 2026-09-25; debt D-CUI3-RECORD", "/* C-UI-3 PROPOSAL CARD END */");
  assert(liveSrc.includes("function liveProposalFace(open, stored, shownId, plain) {"), "the debt is named where the rule is");
});

test("C-UI-3 R1: the demo athlete's board-date Today carries exactly one open proposal of the ruled shape", () => {
  const day = Fixtures.SYNTHETIC_DAY;
  const model = read(MODEL);
  assert(model.includes("function createBasisState(day) {\n  const state = withBoardProposal(createSyntheticState(day), day);"),
    "Today's basis is the synthetic athlete plus its one proposal");
  const m = evaluate(block(model, "/* C-UI-3 BEGIN (the proposal card", "/* C-UI-3 END */"),
    ["withBoardProposal", "openProposalCard", "storedProposalAnswers"]);
  const state = m.withBoardProposal(Fixtures.createSyntheticState(day), day);
  const open = state.proposals.filter((p) => p && !p.resolved);
  assert.equal(open.length, 1, "exactly one open proposal");
  assert.equal(state.agentProposals.length, 0);
  const p = open[0];
  /* propose()'s exact shape (writers.cjs:1672) and the owner's-call apply (writers.cjs:1956). */
  assert(WRITERS.includes("s.proposals.push({ rid, id: `${rid}_${todayISO}`, d: todayISO, title, why, apply, resolved: false, pg: s.planGen || 0 });"));
  assert(WRITERS.includes("{ kind: \"sets\", exId: oc.exId, delta: 1, mg: oc.mg, owner: true }"));
  assert.deepEqual(Object.keys(p), ["rid", "id", "d", "title", "why", "apply", "resolved", "pg"]);
  const [y, mo, d] = day.split("-").map(Number);
  const monday = new Date(Date.UTC(y, mo - 1, d - ((new Date(Date.UTC(y, mo - 1, d)).getUTCDay() + 6) % 7))).toISOString().slice(0, 10);
  assert.equal(p.rid, "volpush_chest_" + monday, "the owner's-call rid family (writers.cjs:1954)");
  assert.equal(p.id, p.rid + "_" + day);
  assert.equal(p.d, day);
  assert.equal(p.resolved, false);
  assert.equal(p.pg, 0);
  assert.deepEqual({ ...p.apply }, { kind: "sets", exId: "demo-press", delta: 1, mg: "chest", owner: true });
  assert(PROTO.includes("title: '" + p.title + "'"), "the title is the prototype's (T-40 SET)");
  assert(PROTO.includes("reason: '" + p.why + " ' + UNTIL_YOU_SAY_YES"), "the reason is the prototype's (T-40 SET)");
  assert.equal(m.withBoardProposal(state, day).proposals.length, 1, "filed once: the producer's own seen guard (writers.cjs:1948-1950)");
  const card = m.openProposalCard(state);
  assert.deepEqual([card.id, card.source, card.kind, card.delta, card.lift], [p.id, "proposal", "sets", 1, "Chest press"]);
  const { liveProposalFace: live } = round2Module();
  const f = live(card, m.storedProposalAnswers(state), null, plainOrDrop);
  assert.equal(f.lift, "Chest press", "#proposal-lift renders the lift name");
  assert.equal(f.reason, p.why, "the prototype's T-40 reason, word for word, without the pack sentence on the live card (L2-2)");
  assert(read(APP).includes('map.get("proposal-lift").textContent = plainOrDrop(face.lift, "proposal-lift")'));
});

test("C-UI-3 F6: T-40h's departure is the prototype's dormancy, not an engine absence", () => {
  const src = block(read(APP), "/* C-UI-3 PROPOSAL CARD BEGIN", "/* C-UI-3 PROPOSAL CARD END */");
  assert(!src.includes("the engine issues no weight-change proposal"), "the inaccurate reason is gone");
  assert(src.includes("DORMANT in the prototype (app/states-today.js:159)"));
  assert(src.includes("writers.cjs:1544"), "the engine's reset card with newW is named");
  assert(PROTO.includes("status: 'DORMANT'"));
});

/* ---------------- Round 3 (Fable l2 NOT READY; PM rulings STOP1, L2-1, L2-2) ---------------- */
test("C-UI-3 STOP1: the demo proposal never reaches an adopted athlete's own Today (adoptBasis carries no board proposal)", () => {
  const day = Fixtures.SYNTHETIC_DAY;
  const model = read(MODEL);
  /* The one filer is createBasisState, and createBasisState is only the fixture default. */
  assert.equal([...model.matchAll(/withBoardProposal\(/g)].length, 2, "withBoardProposal: its definition and ONE call");
  assert(model.includes("function createBasisState(day) {\n  const state = withBoardProposal(createSyntheticState(day), day);"));
  assert.equal([...model.matchAll(/createBasisState\(/g)].length, 2, "createBasisState: its definition and ONE call");
  assert(model.includes("let basis = options.basisState ? clone(options.basisState) : createBasisState(day);"),
    "that call is the fixture default, taken only when no basis is supplied");
  /* adoptBasis evaluated alone, over a basis that carries the board proposal. */
  const m = evaluate(block(model, "/* C-UI-3 BEGIN (the proposal card", "/* C-UI-3 END */"),
    ["withBoardProposal", "openProposalCard", "storedProposalAnswers"]);
  const adopt = block(model, "function adoptBasis(state) {", "function setPendingAdoption(flag) {");
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const ctx = vm.createContext({ basis: m.withBoardProposal(Fixtures.createSyntheticState(day), day), pendingAdoption: true, clone });
  vm.runInContext(adopt + "\n;globalThis.adoptBasis = adoptBasis;", ctx);
  assert(m.openProposalCard(ctx.basis), "the fixture basis carries the board's card before adoption");
  const own = { ...Fixtures.createSyntheticState(day), proposals: [], agentProposals: [] };
  const out = ctx.adoptBasis(own);
  assert.deepEqual(out, clone(own), "adoptBasis hands back his own state, nothing added");
  assert.deepEqual(ctx.basis, clone(own), "and Today's basis is his own state, nothing added");
  assert.equal(ctx.pendingAdoption, false);
  assert.equal(m.openProposalCard(ctx.basis), null, "no board card on his own Today");
  assert(!ctx.basis.proposals.some((p) => /^volpush_chest_/.test(p.rid)), "no board proposal in his basis");
  /* His own open proposal is his, kept exactly, and the board's is not added beside it. */
  const his = { ...own, proposals: [{ rid: "r_his", id: "r_his_" + day, d: day, title: "T", why: "W",
    apply: { kind: "sets", exId: "demo-press", delta: 1 }, resolved: false, pg: 0 }] };
  ctx.adoptBasis(his);
  assert.deepEqual(ctx.basis.proposals, clone(his.proposals), "his own proposals exactly, one card, his");
  /* The adoption path hands adoptBasis setup's or the admitted source's state, never the fixture's. */
  const lanes = read(path.join(TODAY, "today-lanes.cjs"));
  assert(lanes.includes("model.adoptBasis(state);"));
  assert(lanes.includes("return imported || setup.athleteState();"));
  for (const f of ["today-lanes.cjs", "local-source-basis.mjs"]) {
    assert(!/createBasisState|withBoardProposal/.test(read(path.join(TODAY, f))), f + " never builds the fixture basis");
  }
});
