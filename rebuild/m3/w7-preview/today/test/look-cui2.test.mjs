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
  /* S12b R6 (DECISIONS:915 (3); red first: the R6 run r1, this cell's old pin "on the shipped template: Talk
     through today's plan"). The Coach entry (the board's Talk row) has left Today until a live coach exists,
     so its words are no longer the shipped Today's; the other board words are pinned as before, and the Talk
     row's absence is pinned below, together with the Coach screen it used to open, which is still shipped. */
  const words = ["Recovery check in", "Optional. How are you feeling?",
    "example", "Example numbers, not your data", "Your weight in pounds", "Your weight"];
  for (const w of words) {
    assert(board.includes(w), "on the approved board: " + w);
    assert(today.includes(w) || weigh.includes(w), "on the shipped template: " + w);
    const decl = design.indexOf(JSON.stringify(w));
    assert(decl >= 0 && design.lastIndexOf("DECISIONS:820", decl) >= 0, "declared in design.cjs under :820: " + w);
  }
  /* COACH V1 (owner ruling 2026-10-12, "No-AI coach first"; red first on the S19 template): the Coach entry is back
     on Today because the coach now answers from the device's records. COACH V1 POLISH (the PM's polish batch, ui-pass7
     shot 02: the quiet link sat below Start, off the first screen): it is ONE compact row in the feed, in the food
     card's own look (tcard nav, the feed's dot, a chevron), one preview-owned line "Ask Coach", so it is above Start and
     nothing sits under Start. The board's Talk row (#talk-today, its orb and mic, its second line and its coach-state
     marker) stays off Today, and so do its words now; design.cjs declares the entry's one line as preview copy. */
  const entry = /<button class="tcard nav" id="card-coach" type="button" data-go="coach" data-slot="coach-entry">([\s\S]*?)<\/button>/.exec(today);
  assert(entry, "Today carries one compact row to the Coach screen");
  assert.match(entry[1], /^\s*<span class="tdot" aria-hidden="true"><\/span>\s*<div class="title">Ask Coach<\/div>\s*<span class="chev" aria-hidden="true">/,
    "the feed's dot, one line, and a chevron");
  const timeline = today.slice(today.indexOf('<div class="timeline">'), today.indexOf('<span data-slot="sleep-entry-label">'));
  assert(timeline.includes(entry[0]), "inside the feed");
  assert(today.indexOf(entry[0]) < today.indexOf('<div class="stack">'), "above Start's stack");
  const declared = design.indexOf(JSON.stringify("Ask Coach"));
  const preview = design.indexOf("const PREVIEW_COPY"), approved = design.indexOf("const APPROVED_COPY");
  assert(declared > preview && declared < approved, "declared in design.cjs as preview copy");
  assert(!board.includes("Ask Coach"), "which the approved board does not already say");
  assert.equal((today.match(/data-go="coach"/g) || []).length, 1, "exactly one route to the Coach screen");
  assert(!today.includes("Talk through today\u2019s plan"), "the Talk row's words left Today with the old link");
  assert(!design.includes(JSON.stringify("Talk through today\u2019s plan")), "and are no longer declared");
  assert(!today.includes("Your plan, progress and the reasons behind it."), "the Talk row's second line stays off Today");
  assert(!design.includes(JSON.stringify("Your plan, progress and the reasons behind it.")), "and is not declared");
  assert(board.includes('id="talk-today"'), "the board still draws the Talk row");
  assert.doesNotMatch(today, /id="talk-today"|data-slot="coach-state"/, "the row itself and its marker stay off Today");
  assert(templateBlock("t-coach").includes("Talk through today\u2019s plan."), "the Coach screen itself is shipped");
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

/* COACH V1 BATCH 2 (PM item 3; red first on 0ccc74d's preview.css). Today's quiet links under the cards read at
   secondary-text contrast over the scene and are never drawn faded above Start. Measured at the builder seat in Chromium
   (the foot probe: each link's words against the brightest 5% of the pixels behind them, 4.5:1 or more, at 390x844 and
   430x932, top and end of the scroll); held here in the stylesheet: every quiet link takes the pack's protective cloud
   for a tertiary link over the art (app.css .links .link::before, the same shape) and --text-soft, its quiet marker
   too, and Today's bottom fade runs only in the band under the stack's edge. */
test("C-UI batch 2: Today's quiet links take the pack's protective cloud and are never faded above Start", () => {
  const css = fs.readFileSync(PREVIEW_CSS, "utf8");
  const pack = fs.readFileSync(PACK_CSS, "utf8");
  assert.match(pack, /\.links \.link::before[^{]*\{ content: ""; position: absolute; left: -26px; right: -26px; top: -10px; bottom: -10px; z-index: -1;/,
    "the pack's own cloud for a tertiary link over the art");
  /* Fable 4713c98f D2 (seat batch): plain selector lists, one selector per link, and no :is() list in the block. */
  const LINKS = ['button.day-foot', '[data-slot="measure-tile"]', '[data-slot="import-entry"]', '[data-slot="routine-entry"]'];
  const cloud = LINKS.map((l) => ':root[data-fade="full"] .scene-frame > .view.ui > .body > ' + l + '::before').join(",\n") + " {";
  const at = css.indexOf(cloud);
  assert(at >= 0, "every quiet link on Today carries the cloud");
  const rule = css.slice(at, css.indexOf("}", at));
  for (const want of ['content: ""', "position: absolute", "left: -26px", "right: -26px", "top: -10px", "bottom: -10px", "z-index: -1",
    "pointer-events: none", "radial-gradient(ellipse 50% 50% at 50% 50%", "var(--surface)"]) assert(rule.includes(want), "the cloud is the pack's shape: " + want);
  assert(css.includes(LINKS.map((l) => ".scene-frame > .view.ui > .body > " + l).join(",\n") + " {\n  position: relative; isolation: isolate; color: var(--text-soft); }"),
    "the cloud sits under its own link, which reads in --text-soft");
  const block = css.slice(css.indexOf("/* ===== COACH V1 BATCH 2 (PM"), css.indexOf("/* ===== COACH V1 BATCH 2: END ===== */"));
  assert.doesNotMatch(block.replace(/\/\*[\s\S]*?\*\//g, ""), /:is\(/, "no :is() list in the batch-2 block");
  assert(css.includes(".scene-frame > .view.ui > .body > button.day-foot .muted { color: var(--text-soft); }"), "its quiet marker too");
  assert(css.includes(".scene-frame.screen-today > .view.ui > .body.can-scroll:not(.at-end) { --fade-bot: calc(100% - var(--fade-bot-inset, 0px)); --fade-bot-end: 100%; }"),
    "Today's bottom fade runs only under the stack's edge");
  assert.match(css, /\.scene-frame\.screen-today > \.view\.ui > \.body \{ padding-bottom: 34px; --fade-bot-inset: 14px; \}/,
    "inside the band S18 keeps under the stack");
});

/* POLISH 3 (PM, ui-pass9; red first on 9e2227a's preview.css). Measured at the builder seat in Chromium: the live
   Coach screen's seven questions all on the first screen at 390x844, clear of the bottom fade, each still the pack's
   60 px row; Today's six quiet links 52 px apart, all six gaps 8 px. Held here in the stylesheet. */
test("C-UI polish 3: the live coach compacts only itself, the settings form is dark, the review's Why? and the quiet links read evenly", () => {
  const css = fs.readFileSync(PREVIEW_CSS, "utf8");
  const block = css.slice(css.indexOf("/* ===== POLISH 3 (PM"), css.indexOf("/* ===== POLISH 3: END ===== */"));
  assert(block.length > 0, "the polish 3 block");
  const LIVE = ".scene-frame.screen-coach > .view.ui > .body:has(#prompts > .prompt[data-intent])";
  for (const rule of [" .orb-wrap { margin-top: 14px; height: 72px; }", " .orb { width: 72px; height: 72px; }", " .coach-title { font-size: 40px; margin-top: 14px; }"]) {
    assert(block.includes(LIVE + rule), "only the live screen is compacted: " + rule);
  }
  assert.equal(/(^|\n)\.(orb|orb-wrap|coach-title|prompts?)\b/.test(block), false, "no unscoped rule moves the pack's board");
  const code = block.replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(code, /\.prompt\s*\{/, "no question row is resized");
  assert.deepEqual([...code.matchAll(/min-height:\s*([^;]+);/g)].map((m) => m[1].trim()), ["var(--hit)"],
    "the only height the block sets is the 44 px tap row of the quiet links");
  assert(block.includes(".view [data-slot=\"settings-editor\"] input[type=\"text\"] {\n  padding: 9px 12px; border-radius: 8px; border: 1px solid var(--line);\n  background: color-mix(in srgb, var(--card) 86%, transparent); color: var(--text); }"),
    "the settings boxes take the routine editor's dark field look");
  assert(css.includes("  min-height: 44px;\n  font-size: 16px;\n}"), "and keep their 44 px height and 16 px type");
  assert(block.includes(".view [data-action=\"settings-add\"] { color: var(--text-soft);"), "Add another setting at secondary contrast");
  assert(block.includes(".scene-frame > .view.ui [data-slot=\"week-review\"] .reason { color: var(--text-soft); }"), "the review's Why? text too");
  assert(block.includes("  min-height: var(--hit); margin-top: 8px; margin-bottom: 0; padding-top: 0; padding-bottom: 0; }"), "one rhythm for the quiet links");
  assert.doesNotMatch(block.replace(/\/\*[\s\S]*?\*\//g, ""), /:is\(/, "plain selectors, no :is() list");
});

/* POLISH 4 (PM, the owner's 7-lift Upper/Lower week; red first on 469eb7b's preview.css). Measured at the builder seat in
   Chromium over the real booted page with a 7-exercise workout and ten lifts last week: collapsed, the workout card, the
   weekly card and the row after it all sit above the Start bar at 390x844, and every control on the card is a 44 px row.
   Held here in the stylesheet. */
test("C-UI polish 4: the weekly review's See details and and N more are quiet 44 px rows of their own", () => {
  const css = fs.readFileSync(PREVIEW_CSS, "utf8");
  const block = css.slice(css.indexOf("/* ===== POLISH 4 (PM"), css.indexOf("/* ===== POLISH 4: END ===== */"));
  assert(block.length > 0, "the polish 4 block");
  assert(block.includes(".view [data-slot=\"week-review-toggle\"],\n.view [data-slot=\"week-review-more\"] { display: block; min-height: var(--hit); padding: 0; background: none; border: 0;\n  text-align: left; color: var(--text-soft); }"),
    "each control is a block row of its own, the 44 px tap row, at secondary-text contrast, like Why?");
  const code = block.replace(/\/\*[\s\S]*?\*\//g, "");
  assert.deepEqual([...code.matchAll(/min-height:\s*([^;]+);/g)].map((m) => m[1].trim()), ["var(--hit)"], "no other height");
  assert.doesNotMatch(code, /font-size|max-height|overflow|line-clamp|display:\s*none/, "no text is shrunk, clamped or hidden by the stylesheet");
  assert.doesNotMatch(code, /:is\(/, "plain selectors, no :is() list");
  assert(css.includes(".view [data-slot=\"week-review-why\"] { display: block; min-height: var(--hit);"), "Why? keeps its own row");
});
