// look-cui2.test.mjs - C-UI-2 static cells for the Today face's own preview.css block.
// Reads bytes only: preview.css (the C-UI-2 BEGIN/END block) and the pinned pack app.css.
// No DOM, no engine, no network. Fix round 2 (review REVIEW-LOOK-C-UI-2-l1 M1, N1).
// Round 3 (DECISIONS:820): the template's #greeting and #status-line, the board's words on
// Today, and the status line's words per state. Still bytes only: the status line block of
// today-app.cjs is evaluated alone in a bare vm context (no require, no engine).
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const TODAY = path.resolve(import.meta.dirname, "..");
const PREVIEW_CSS = path.join(TODAY, "preview.css");
const PACK_CSS = path.resolve(TODAY, "../../../m1/approved-2026-09-18/app/app.css");

function rules(css) {
  const out = [];
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of bare.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const decls = {};
    for (const part of m[2].split(";")) {
      const i = part.indexOf(":");
      if (i > 0) decls[part.slice(0, i).trim()] = part.slice(i + 1).trim();
    }
    for (const sel of m[1].split(",")) out.push({ selector: sel.trim().replace(/\s+/g, " "), decls });
  }
  return out;
}

function cui2Block() {
  const css = fs.readFileSync(PREVIEW_CSS, "utf8");
  const begin = css.indexOf("/* C-UI-2 BEGIN");
  const end = css.indexOf("/* C-UI-2 END */");
  assert(begin >= 0 && end > begin, "preview.css carries one delimited C-UI-2 block");
  return rules(css.slice(css.indexOf("*/", begin) + 2, end));
}

const STACK_HOST = ".scene-frame > .view.ui:has(> .stack)";

test("C-UI-2 M1: the weigh-in sheet paints above the fixed stack inside the chassis host", () => {
  const pack = rules(fs.readFileSync(PACK_CSS, "utf8"));
  const stack = pack.filter((r) => r.selector === ".screen .ui > .stack" && r.decls["z-index"] !== undefined);
  assert.equal(stack.length, 1, "the pinned pack gives the fixed stack exactly one z-index");
  const stackZ = Number(stack[0].decls["z-index"]);
  const preview = rules(fs.readFileSync(PREVIEW_CSS, "utf8"));
  const panel = preview.filter((r) => r.selector === ".sheet-panel" && r.decls.position !== undefined);
  assert.equal(panel.length, 1, "preview.css draws the sheet once");
  assert.equal(panel[0].decls.position, "absolute", "the sheet is positioned, so its z-index applies");
  const lift = cui2Block().filter((r) => r.selector === STACK_HOST + " > .sheet-panel");
  assert.equal(lift.length, 1, "the C-UI-2 block lifts the sheet inside the stack host");
  const sheetZ = Number(lift[0].decls["z-index"]);
  assert(Number.isInteger(sheetZ) && sheetZ > stackZ,
    `the sheet's z-index (${lift[0].decls["z-index"]}) is above the stack's (${stackZ})`);
});

test("C-UI-2 N1: the Start border override leaves the pack's disabled edge standing", () => {
  const pack = rules(fs.readFileSync(PACK_CSS, "utf8"));
  const disabled = pack.filter((r) => r.selector === ".primary:disabled" && r.decls.border !== undefined);
  assert.equal(disabled.length, 1, "the pinned pack draws the disabled Start edge once");
  assert.equal(disabled[0].decls.border, "1px solid var(--line-soft)");
  const primary = cui2Block().filter((r) => /\.primary\b/.test(r.selector));
  assert(primary.length > 0, "the C-UI-2 block still restyles Start");
  for (const r of primary) {
    const touchesBorder = Object.keys(r.decls).some((k) => k === "border" || k.startsWith("border-"));
    if (touchesBorder) assert(r.selector.includes(":not(:disabled)"),
      "a C-UI-2 border rule on Start is scoped away from the disabled state: " + r.selector);
  }
  const weight = primary.filter((r) => r.decls["font-weight"] === "inherit");
  assert.equal(weight.length, 1, "Start still takes the pack's inherited weight");
});

const TEMPLATE = path.join(TODAY, "screens.template.html");
const APP = path.join(TODAY, "today-app.cjs");
const DESIGN = path.join(TODAY, "design.cjs");
const PACK_HTML = path.resolve(TODAY, "../../../m1/approved-2026-09-18/app/app.html");
const PACK_TODAY = path.resolve(TODAY, "../../../m1/approved-2026-09-18/app/states-today.js");

function templateBlock(id) {
  const html = fs.readFileSync(TEMPLATE, "utf8");
  const at = html.indexOf(`<template id="${id}">`);
  assert(at >= 0, id + " is in the template");
  return html.slice(at, html.indexOf("</template>", at));
}

test("C-UI-2 R3: Today carries the pack's #greeting (the engine's instruction slot) and #status-line", () => {
  const today = templateBlock("t-today");
  const h1 = today.match(/<h1\b[^>]*>/g) || [];
  assert.equal(h1.length, 1, "one headline on Today, no second instruction h1");
  assert.match(h1[0], /\bclass="greeting"/);
  assert.match(h1[0], /\bid="greeting"/);
  assert.match(h1[0], /\bdata-slot="instruction"/, "the greeting IS the instruction slot, not an alias of it");
  const status = today.match(/<p\b[^>]*\bid="status-line"[^>]*>/g) || [];
  assert.equal(status.length, 1, "one status line");
  assert.match(status[0], /\bclass="status-line"/);
  assert.match(status[0], /\bdata-slot="status-line"/);
  assert(today.indexOf(status[0]) > today.indexOf(h1[0]), "the status line sits under the greeting");
  const app = fs.readFileSync(APP, "utf8");
  assert(app.includes('map.get("status-line").textContent = plainOrDrop(statusLine('), "renderToday binds the status line");
});

test("C-UI-2 R3: the board's words on Today (DECISIONS:820 (2))", () => {
  const board = fs.readFileSync(PACK_HTML, "utf8");
  const design = fs.readFileSync(DESIGN, "utf8");
  const today = templateBlock("t-today");
  const weigh = templateBlock("t-weigh");
  const words = ["Recovery check in", "Optional. How are you feeling?", "Talk through today\u2019s plan",
    "example", "Example numbers, not your data", "Your weight in pounds", "Your weight"];
  for (const w of words) {
    assert(board.includes(w), "on the approved board: " + w);
    assert(today.includes(w) || weigh.includes(w), "on the shipped template: " + w);
    const decl = design.indexOf(JSON.stringify(w));
    assert(decl >= 0 && design.lastIndexOf("DECISIONS:820", decl) >= 0, "declared in design.cjs under :820: " + w);
  }
  assert.match(today, /<span class="pill"[^>]*title="Example numbers, not your data"[^>]*>example<\/span>/);
  assert.match(weigh, /placeholder="Your weight"/);
  for (const old of ["How are you feeling today?", "Ask your coach"]) assert(!today.includes(old), "the app's words gave way on Today: " + old);
  assert(fs.readFileSync(APP, "utf8").includes('put(map, "weigh-submit", "Save")'), "the weigh-in submits with the board's Save");
});

function statusModule() {
  const src = fs.readFileSync(APP, "utf8");
  const begin = src.indexOf("/* C-UI-2 STATUS LINE BEGIN");
  const end = src.indexOf("/* C-UI-2 STATUS LINE END */");
  assert(begin >= 0 && end > begin, "today-app.cjs carries one delimited status line block");
  const ctx = vm.createContext({});
  vm.runInContext(src.slice(begin, end) + "\n;globalThis.statusLine = statusLine;", ctx);
  return ctx.statusLine;
}

test("C-UI-2 R3: the status line says the prototype's words for each state, and nothing it has none for", () => {
  const statusLine = statusModule();
  const proto = fs.readFileSync(PACK_TODAY, "utf8");
  const DOT = " \u00b7 ";
  const day = (over) => Object.assign({ blocked: false, workout: { title: "UPPER BODY" + DOT + "TODAY", today: true, exerciseCount: 4, unavailableReason: null },
    nowModel: { decisionsN: 0 }, calorieTarget: { mid: 2300, lo: 2100, hi: 2500 } }, over);
  const rows = [
    ["default (owner's pattern)", day(), null, false, "Upper body today. Nothing to decide."],
    ["T-06 blocked", { blocked: true }, null, false, "This device\u2019s record did not verify. Nothing on this screen is a value."],
    ["T-17 stranded", day(), { phase: "unfinished", unfinished: { day: "x" } }, false, "An earlier workout is still open."],
    ["T-14 in progress", day(), { phase: "active" }, false, "Upper body is under way."],
    ["T-15 recorded", day(), { phase: "finished" }, false, "Upper body logged. Nothing to decide."],
    ["T-16 cannot open", day(), { phase: "blocked", code: "WORKOUT_PREPARATION_UNAVAILABLE" }, false, "Today\u2019s workout cannot open."],
    ["T-13 exercises not available", day({ workout: { title: "UPPER BODY" + DOT + "TODAY", today: true, exerciseCount: null, unavailableReason: "X" } }), null, false,
      "Today\u2019s exercises are not available, so there is nothing to start."],
    ["T-11 rest day", day({ workout: { title: "LOWER BODY" + DOT + "TOMORROW", today: false, exerciseCount: 4, unavailableReason: null } }), null, false,
      "Nothing to decide. Next: lower body, tomorrow."],
    ["T-12 nothing scheduled", day({ workout: { title: "UPPER BODY" + DOT + "TODAY", today: true, exerciseCount: null, unavailableReason: null } }), null, false,
      "Nothing scheduled today, so there is nothing to start."],
    ["T-02 sample", day(), null, true, "Upper body today. Sample data."],
    ["T-19 gated calorie band", day({ calorieTarget: { gated: true } }), null, false, "Upper body today. Your calorie range is not available yet."],
    ["open proposal, no card until C-UI-3", day({ nowModel: { decisionsN: 1 } }), null, false, ""],
    ["in progress on a later day", day({ workout: { title: "UPPER BODY" + DOT + "TOMORROW", today: false, exerciseCount: 4, unavailableReason: null } }), { phase: "active" }, false, ""],
    /* Round 4 (Fable l3 F1, PM ruling): T-11's line is drawn only for a TOMORROW stamp; the
       prototype draws no line for a later day, so a later stamp says nothing. */
    ["rest day, a later stamp (the prototype draws no line)", day({ workout: { title: "LOWER BODY" + DOT + "MON 9/21", today: false, exerciseCount: 4, unavailableReason: null } }), null, false, ""],
    /* Round 4 (Fable l3 F2, PM ruling): the open-proposal guard stands ahead of the phase
       branches, so no line says "Nothing to decide." while a proposal is open (empty until
       C-UI-3 binds T-40). */
    ["open proposal after the session is logged", day({ nowModel: { decisionsN: 1 } }), { phase: "finished" }, false, ""],
    ["open proposal on a rest day", day({ workout: { title: "LOWER BODY" + DOT + "TOMORROW", today: false, exerciseCount: 4, unavailableReason: null }, nowModel: { decisionsN: 1 } }), null, false, ""],
  ];
  for (const [label, view, session, sample, want] of rows) {
    const got = statusLine(view, session, sample);
    assert.equal(got, want, label);
    if (want) assert(proto.includes("'" + want + "'"), label + ": the prototype draws exactly these words");
  }
});
