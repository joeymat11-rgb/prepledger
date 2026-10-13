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
  /* N2 "LOG TODAY" (Part B): this slice used to end at the quiet Sleep link's label, which Part B folds into the Log
     today card, so that anchor is gone (indexOf -1 would have sliced to the template's last character and kept this
     cell green for the wrong reason). It now ends at the trend row, the first thing after the feed closes, and the
     anchor's presence is asserted, so a lost anchor is red and not a wider slice. */
  const feedEnd = today.indexOf('<div class="on-scene day-foot" data-slot="trend-row">');
  assert(feedEnd > today.indexOf('<div class="timeline">'), "the trend row still follows the feed");
  const timeline = today.slice(today.indexOf('<div class="timeline">'), feedEnd);
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

test("N2 LOG TODAY: one card in the feed, above Start, preview-owned, and the weigh-in and the check-in stay where C-UI-2 holds them", () => {
  const board = fs.readFileSync(PACK_HTML, "utf8");
  const today = templateBlock("t-today");
  const card = /<button class="tcard nav" id="card-log" type="button" data-slot="log-entry">([\s\S]*?)<\/button>/.exec(today);
  assert(card, "Today carries one Log today card");
  assert.match(card[1], /^\s*<span class="tdot" aria-hidden="true"><\/span>\s*<div class="title" data-slot="log-title"><\/div>\s*<div class="sub" data-slot="log-ticks"><\/div>\s*<span class="chev" aria-hidden="true">/,
    "the feed's dot, a title and one line of ticks, a chevron, and no literal word");
  const feedStart = today.indexOf('<div class="timeline">');
  const feedEnd = today.indexOf('<div class="on-scene day-foot" data-slot="trend-row">');
  assert(feedStart >= 0 && feedEnd > feedStart, "the feed and the trend row that follows it are both there");
  const at = today.indexOf(card[0]);
  assert(at > feedStart && at < feedEnd, "inside the feed");
  assert(at > today.indexOf('id="card-train"'), "after today's workout, so the card Start opens stays beside Start");
  assert(at < today.indexOf('<div class="stack">'), "above Start's stack");
  assert.equal((today.match(/id="card-log"/g) || []).length, 1, "exactly one Log today card");
  assert(!board.includes('id="card-log"'), "which the approved board does not draw");
  /* the two folds C-UI-2 does NOT allow: ruling 5 keeps the weigh-in the board's inline card, and ruling 4 keeps the
     stack Start, Recovery and nothing else. The third fold, the quiet Sleep link (DECISIONS:167, preview-owned), is done. */
  assert(today.includes('id="card-weigh"') && today.includes('id="weigh-form"'), "the inline weigh-in card stays (ruling 5, C-UI-2 LOCKED, C-UI-3)");
  const stack = today.slice(today.indexOf('<div class="stack">'));
  assert(stack.includes('id="start"') && stack.includes('id="recovery"'), "the stack is still Start and the check-in (ruling 4, C-UI-2 LOCKED)");
  assert.doesNotMatch(today, /data-slot="sleep-entry"/, "the quiet Sleep link has folded into the card");
  const sheet = templateBlock("t-log");
  for (const slot of ["log-weight", "log-food", "log-steps", "log-sleep", "log-checkin", "log-done"])
    assert(sheet.includes('data-slot="' + slot + '"'), "the Log today sheet carries its " + slot + " row");
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
    /* DECISIONS:980 (the owner's ruling, "Labelled estimate"): while the band is the engine's own labelled estimate
       (gated, from "mass-estimate", both ends figures) the line says the ruling's words, which supersede T-19's for
       that state only; a gated band that is not that estimate still says T-19's. */
    ["DECISIONS:980 the engine's labelled estimate", day({ calorieTarget: { gated: true, from: "mass-estimate", lo: 1886, hi: 2011 } }), null, false,
      "Upper body today. Your calorie range is an estimate for now.", "DECISIONS:980"],
    ["DECISIONS:980 one figure is still the estimate", day({ calorieTarget: { gated: true, from: "mass-estimate", lo: 1700, hi: 1700 } }), null, false,
      "Upper body today. Your calorie range is an estimate for now.", "DECISIONS:980"],
    ["T-19 a gated band with no estimate figures", day({ calorieTarget: { gated: true, from: "mass-estimate", lo: null, hi: null } }), null, false,
      "Upper body today. Your calorie range is not available yet."],
    ["T-19 no bodyweight yet", day({ calorieTarget: { gated: true, from: "none", lo: null, hi: null } }), null, false, "Upper body today. Your calorie range is not available yet."],
    ["T-02 sample over an estimate: the sample line", day({ calorieTarget: { gated: true, from: "mass-estimate", lo: 1886, hi: 2011 } }), null, true, "Upper body today. Sample data."],
  ];
  const app = fs.readFileSync(APP, "utf8");
  for (const [label, view, session, sample, want, ruling] of rows) {
    const got = statusLine(view, session, sample);
    assert.equal(got, want, label);
    if (want && !ruling) assert(proto.includes("'" + want + "'"), label + ": the prototype draws exactly these words");
    if (ruling) {
      /* the ruling's words, not the prototype's: the departure is real, and the line that carries them cites the ruling */
      assert.equal(proto.includes(want.replace(/^Upper body/, "")), false, label + ": the prototype does not draw these words");
      assert(app.includes('const STATUS_CALORIE_ESTIMATE = "' + want.replace(/^Upper body/, "") + '"; // ' + ruling), label + ": declared under " + ruling);
    }
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

/* POLISH 5 (PM, the owner's 7-lift world, ui-pass11; red first on df7ad22's preview.css). Measured at the builder seat in
   Chromium (week probe): the set screen's last row clears the RIR panel and its fade at the end of the scroll; the weekly
   card's place is held by a placeholder of the same height until the review lands; its controls are the gold accent
   with a chevron, "and N more" inline and still a 44 px tap row; the weight trend is a 44 px line in the quiet links'
   rhythm. Held here in the stylesheet. */
test("C-UI polish 5: the set screen's room under the last row, the quiet Undo, the held weekly place, tappable toggles, the trend line", () => {
  const css = fs.readFileSync(PREVIEW_CSS, "utf8");
  const block = css.slice(css.indexOf("/* ===== POLISH 5 (PM"), css.indexOf("/* ===== POLISH 5: END ===== */"));
  assert(block.length > 0, "the polish 5 block");
  const code = block.replace(/\/\*[\s\S]*?\*\//g, "");
  assert(code.includes(".scene-frame.screen-workout .ui > [data-native-load=\"gym\"] > .body,\n.scene-frame.screen-workout .ui > .body { padding-bottom: 56px; }"),
    "room under the last row: the fade band (20 px), its inset (20 px) and 16 px clear, on both mounts alike");
  assert(code.includes("[data-native-load=\"offer\"][data-kind=\"compensate\"] > button[data-native-load=\"yes\"] {\n  background: none; border: 1px solid var(--line); color: var(--text-soft); }"),
    "the undo is the quieter button");
  assert(code.includes("[data-slot=\"week-review-pending\"] { display: block; min-height: 2lh; }") && code.includes("[data-slot=\"week-review-room\"] { min-height: var(--hit); }"),
    "the held place is the collapsed card's two lines and its toggle row");
  assert(code.includes(".view [data-slot=\"week-review-toggle\"],\n.view [data-slot=\"week-review-more\"] { color: var(--gold); }"), "the toggles in the accent");
  assert(code.includes("border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; transform: rotate(45deg);"), "with a chevron");
  assert(code.includes("[aria-expanded=\"true\"]::after { transform: rotate(-135deg);"), "that turns when it opens");
  assert(code.includes("display: inline-flex; align-items: center; min-height: var(--hit); margin: calc((1lh - var(--hit)) / 2) 0;"),
    "and N more inline, still a 44 px tap row, its extra height taken back so the line does not open");
  assert(code.includes(".scene-frame > .view.ui > .body > div.day-foot {\n  display: flex; align-items: center; min-height: var(--hit); margin-top: 8px;"),
    "the trend line in the quiet links' rhythm");
  assert.deepEqual([...code.matchAll(/min-height:\s*([^;]+);/g)].map((m) => m[1].trim()).sort(), ["2lh", "var(--hit)", "var(--hit)", "var(--hit)"].sort(),
    "no other height");
  assert.doesNotMatch(code, /:is\(|display:\s*none|line-clamp|max-height/, "plain selectors; nothing hidden, clamped or capped");
});

/* POLISH 6 (PM, ui-pass12; red first on 4ba1ce5's preview.css). Measured at the builder seat in Chromium: a coach answer
   comes wholly into view, its source line included, clear of the bottom fade, at 390 and 430 (coach-scroll probe); an
   undo card's two buttons look alike and neither has a fill, while a new weight's card keeps its pair (undo probe); the
   "Show fewer" chevron sits as close to its words as "Hide details" has it, and the open control is a row of its own
   under the names at every width (week-more probe). Held here in the stylesheet. */
test("C-UI polish 6: the coach answer's scroll room, the quiet undo card, Show fewer on its own row", () => {
  const css = fs.readFileSync(PREVIEW_CSS, "utf8");
  const block = css.slice(css.indexOf("/* ===== POLISH 6 (PM"), css.indexOf("/* ===== POLISH 6: END ===== */"));
  assert(block.length > 0, "the polish 6 block");
  const code = block.replace(/\/\*[\s\S]*?\*\//g, "");
  assert(code.includes(".scene-frame.screen-coach > .view.ui #coach-answer {\n  scroll-margin-bottom: calc(20px + var(--fade-bot-inset, 22px));\n"
    + "  scroll-margin-top: calc(max(47px, env(safe-area-inset-top, 0px)) + 32px); }"),
    "the answer keeps the bottom fade band over the body's inset, and the scrolled top fade's band, as scroll room");
  assert(code.includes("[data-native-load=\"offer\"][data-kind=\"compensate\"] > button[data-native-load=\"decline\"] {\n"
    + "  background: none; border: 1px solid var(--line); color: var(--text-soft); }"),
    "an undo card's Not now is as quiet as its Undo");
  assert(css.includes("[data-native-load=\"offer\"][data-kind=\"compensate\"] > button[data-native-load=\"yes\"] {\n"
    + "  background: none; border: 1px solid var(--line); color: var(--text-soft); }"), "polish 5's quiet Undo stands");
  assert(code.includes(".view [data-slot=\"week-review-steady\"] > [data-slot=\"week-review-more\"] { gap: 0; justify-content: flex-start; }"),
    "the chevron at the words");
  assert(code.includes(".view [data-slot=\"week-review-steady\"] > [data-slot=\"week-review-more\"][aria-expanded=\"true\"] {\n"
    + "  display: flex; width: fit-content; margin: 0; }"), "the open control on a row of its own");
  assert.doesNotMatch(code, /:is\(|display:\s*none|line-clamp|max-height|min-height|font-size/,
    "plain selectors; nothing hidden, clamped, capped, resized or shrunk");
});
