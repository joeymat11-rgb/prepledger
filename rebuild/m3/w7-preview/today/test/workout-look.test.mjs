/* C-UI-4 (look lane, S12) - INSIDE THE WORKOUT, the static half of the port.
   The gate (PACK/quality/gate.py) measures the rendered screen on CI; this cell pins, in
   the shipped bytes, the structure that measurement depends on, so a later edit cannot
   quietly move it: the chassis (a .body and a .stack as the template's only two
   elements), the seven workout font identities as REAL bound elements (no alias: the
   #log-label the gate reads is the same element the card writes its label into), the
   Log button in the stack with nothing below it but the one link row on BOTH the set and
   the rest screen (so Log keeps its edge), and the label carrying the multiplication sign.
   Fix round 2 (REVIEW-LOOK-C-UI-4-l1 F1 to F7) adds one cell per finding.
   It reads files only: no DOM, no engine, no store. */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TODAY = path.join(HERE, "..");
const template = fs.readFileSync(path.join(TODAY, "screens.template.html"), "utf8");
const gymApp = fs.readFileSync(path.join(TODAY, "gym-app.mjs"), "utf8");
const previewCss = fs.readFileSync(path.join(TODAY, "preview.css"), "utf8");
const designSource = fs.readFileSync(path.join(TODAY, "design.cjs"), "utf8");

function section(id) {
  const start = template.indexOf('<template id="' + id + '">');
  assert(start >= 0, id + " is in the shipped template");
  const end = template.indexOf("</template>", start);
  return template.slice(start + ('<template id="' + id + '">').length, end);
}
/* The element's own opening tag, found by an attribute it must carry. */
function tagWith(html, attr) {
  const at = html.indexOf(attr);
  assert(at >= 0, attr + " is present");
  const open = html.lastIndexOf("<", at);
  return html.slice(open, html.indexOf(">", at) + 1);
}
/* The whole element (opening tag to its balanced close) that carries `attr`. */
function elementWith(html, attr) {
  const at = html.indexOf(attr);
  assert(at >= 0, attr + " is present");
  const open = html.lastIndexOf("<", at);
  const name = html.slice(open + 1).match(/^[a-z0-9]+/)[0];
  const re = new RegExp("<(/?)" + name + "\\b[^>]*>", "g");
  re.lastIndex = open;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return html.slice(open, m.index + m[0].length);
  }
  throw new Error("unbalanced " + name);
}
/* The top-level elements of a template body: depth-0 opening tags, comments ignored. */
function topLevel(html) {
  const tags = [...html.replace(/<!--[\s\S]*?-->/g, "").matchAll(/<(\/?)([a-z0-9]+)([^>]*?)(\/?)>/g)];
  const VOID = new Set(["input", "br", "img", "path", "circle", "rect"]);
  let depth = 0; const out = [];
  for (const [, close, name, attrs, self] of tags) {
    if (close) { depth -= 1; continue; }
    if (depth === 0) out.push(name + attrs);
    if (!self && !VOID.has(name)) depth += 1;
  }
  assert.equal(depth, 0, "the template's elements balance");
  return out;
}
/* The rules of the delimited C-UI-4 block of preview.css, comments removed. */
function lookBlock() {
  const begin = previewCss.indexOf("C-UI-4 (look lane, S12) · INSIDE THE WORKOUT: BEGIN");
  const end = previewCss.indexOf("C-UI-4 (look lane, S12) · INSIDE THE WORKOUT: END");
  assert(begin >= 0 && end > begin, "the delimited C-UI-4 block is in preview.css");
  const from = previewCss.indexOf("*/", begin) + 2, to = previewCss.lastIndexOf("/*", end);
  return previewCss.slice(from, to).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ");
}

for (const id of ["t-gym", "t-rest"]) {
  test(`C-UI-4 ${id} is the pack's chassis: a .body and a .stack, nothing else at the top`, () => {
    const top = topLevel(section(id));
    assert.deepEqual(top.map((t) => t.match(/class="([^"]*)"/)?.[1]), ["body", "stack"]);
  });
}

test("C-UI-4 the seven workout identities are real, bound elements in the pack's classes", () => {
  const gym = section("t-gym");
  const [bodyAt, stackAt] = [gym.indexOf('<div class="body">'), gym.indexOf('<div class="stack">')];
  assert(bodyAt >= 0 && stackAt > bodyAt);
  const body = gym.slice(bodyAt, stackAt), stack = gym.slice(stackAt);
  assert.match(tagWith(body, 'class="screen-title"'), /^<h1 class="screen-title" data-slot="lift">$/);
  assert.match(tagWith(body, 'id="set-count"'), /data-slot="set-count"/);
  assert.match(body, /<span class="count">[^]*?id="set-count"/, "#set-count sits in the session row's count");
  for (const [id, input] of [["w-value", "gym-weight"], ["r-value", "gym-reps"]]) {
    assert.equal(tagWith(body, 'id="' + id + '"'), '<div class="value" id="' + id + '">');
    assert(body.includes('<div class="value" id="' + id + '"><input id="' + input + '"'),
      "#" + id + " holds the real entry box the set is logged from");
  }
  assert.match(body, /<div class="numerals" id="numerals">[^]*?<div class="times" aria-hidden="true">×<\/div>/);
  assert.match(tagWith(body, 'id="machine"'), /class="machine rowcard"/);
  /* F3: the row's serif title is its own bound element (the setting itself, or the open
     label while there is no setting to show), never the view module's legacy list. */
  assert.match(body, /id="machine"[^]*?<span class="title setting" data-slot="machine-setting"><\/span>/);
  /* #log-label: ONE element, the Log button's own label, in the stack. The card's
     data-slot for the label is on the SAME element, never a second one standing in. */
  assert.equal((gym.match(/id="log-label"/g) || []).length, 1);
  assert.equal((gym.match(/data-slot="log-label"/g) || []).length, 1);
  assert.equal(tagWith(stack, 'id="log-label"'), '<span id="log-label" data-slot="log-label">');
  assert.match(stack, /<button class="log" type="button" id="log" data-slot="log"><span id="log-label"/);
});

test("C-UI-4 Log keeps its edge: below it only the one link row, on the set AND the rest screen", () => {
  for (const id of ["t-gym", "t-rest"]) {
    const stack = section(id).slice(section(id).indexOf('<div class="stack">'));
    const top = topLevel(stack.replace(/^<div class="stack">/, "").replace(/<\/div>\s*$/, ""));
    const classes = top.map((t) => t.match(/class="([^"]*)"/)?.[1]);
    assert.deepEqual(classes.slice(-2), ["log-row", "links bottom"], id + " ends Log row, link row");
  }
  const rest = section("t-rest");
  assert.match(rest, /<button class="edit" type="button" id="edit" data-action="undo">Undo<\/button>/,
    "Undo takes the Edit button's place beside Log on the rest screen");
  assert.doesNotMatch(section("t-gym") + rest, /timer|Skip this set/i, "no rest timer, no skip (ruling 6)");
});

test("C-UI-4 the Log label carries the multiplication sign, and the RIR chips keep the lock", () => {
  assert(gymApp.includes("'Log ' + load.value.trim() + ' × ' + reps.value.trim()"),
    "the label is the set it will record, with ×");
  assert.doesNotMatch(gymApp, /'Log ' \+[^;\n]*' x '/, "never the letter x");
  assert(gymApp.includes("button.className = 'chip choice' + (unsure ? ' unsure' : '');"));
  assert(gymApp.includes("button.setAttribute('data-rir', unsure ? 'unsure' : choice.label);"));
});

/* ---------------- fix round 2 (REVIEW-LOOK-C-UI-4-l1) ---------------- */

test("C-UI-4 F1 the workout host takes the pack's WORKOUT chassis values, not the base .ui ones", () => {
  const css = lookBlock();
  const rule = css.match(/\.scene-frame\.screen-workout > \.view\.ui \{([^}]*)\}/);
  assert(rule, "the chassis rule is in the block");
  /* app.css:852 `.screen .ui { overflow: hidden }` and :862 `.screen-workout .ui { padding-bottom: 0 }` */
  assert.match(rule[1], /padding: 0 var\(--inset\) 0;/);
  assert.match(rule[1], /overflow: hidden;/);
  assert.doesNotMatch(rule[1], /overflow-y: auto|24px/, "the base .ui values are not the workout's");
});

test("C-UI-4 F2 the rest screen is the same set card repainted: numerals kept, .w-facts for #last-time", () => {
  const rest = section("t-rest");
  const card = elementWith(rest, 'id="setcard"');
  assert.match(card, /<div class="numerals" id="numerals">[^]*?<div class="value" id="w-value" data-slot="rest-load"><\/div>[^]*?<div class="times" aria-hidden="true">×<\/div>[^]*?<div class="value" id="r-value" data-slot="rest-reps"><\/div>/);
  assert.match(card, /<div class="divider"><\/div>\s*<div class="w-facts" data-slot="saved-facts"><\/div>/,
    "the saved facts take the last-time line's place under the divider");
  assert.doesNotMatch(card, /last-time/);
  assert(gymApp.includes("put(map, 'rest-load', logged ? logged[1] : '');"), "the numerals are the stored set's own figures");
});

test("C-UI-4 F3 the machine row is the pack's: a title, one sub line, no legacy list inside the button", () => {
  const gym = section("t-gym");
  const row = elementWith(gym, 'id="machine"');
  assert.match(row, /<span class="text"><span class="title setting" data-slot="machine-setting"><\/span><span class="sub when" data-slot="machine-when"><\/span>/);
  assert.doesNotMatch(row, /<div|<p\b|data-slot="settings-list"|data-slot="settings-open-label"/,
    "no block-level element and no legacy list slot inside the button");
  /* W-36: the unread sentence's action half is the pack's note block under the row. */
  assert.match(gym, /<\/button>\s*<div class="note-block" data-slot="machine-note" hidden><\/div>/);
  /* W-06: the stored setting is the title and the open label the sub line; the label
     is the title only in W-33 / W-34 / W-36. */
  assert(gymApp.includes("put(map, 'machine-setting', shown ? shown : SETTINGS_OPEN);"));
  assert(gymApp.includes("put(map, 'machine-when', shown ? SETTINGS_OPEN : when);"));
});

test("C-UI-4 F4 W-08/W-09: the gold × of the pack's line, and no blank underline box outside W-19", () => {
  assert(gymApp.includes("times.className = 'w-presc-x';"), "the line's × is the pack's gold .w-presc-x");
  assert.doesNotMatch(gymApp, /toggle\('w-blank'/, "an empty box is not dressed as the W-19 mark");
  assert(gymApp.includes("box.classList.add('w-blank', 'is-invalid');"), "the mark is W-19's alone");
});

test("C-UI-4 F5 the last-time line has no action, so it draws no chevron", () => {
  const last = elementWith(section("t-gym"), 'id="last-time"');
  assert.doesNotMatch(last, /row-chev|<svg/);
  assert.doesNotMatch(last, /^<button/);
});

test("C-UI-4 F6 the legacy leaks are restated to the pack's values inside the block", () => {
  const css = lookBlock();
  const notEditor = ':where(:not([data-slot="settings-editor"] *))';
  assert(css.includes(':where(.scene-frame.screen-workout) :is(button, input)' + notEditor
    + ':focus-visible { outline: revert; outline-offset: revert; }'), "the green focus outline goes back to the UA ring");
  assert(css.includes(':where(.scene-frame.screen-workout) button' + notEditor + ' { min-height: auto; }'),
    "the 44 px legacy button floor goes back to the initial value");
  assert.match(css, /:where\(\.scene-frame\.screen-workout\) \.link \{ padding: 0; \}/);
  assert.match(css, /\.scene-frame\.screen-workout #machine \{ min-height: 60px; \}/);
  assert.match(css, /\.scene-frame\.screen-workout \.set-dots i \{ padding: 0; \}/);
});

test("C-UI-4 F7 the composed fragments are declared, and the W-19 mark clears on input", () => {
  const list = designSource.slice(designSource.indexOf("const RUNTIME_COPY = Object.freeze(["),
    designSource.indexOf("const CHECKIN_RUNTIME_COPY"));
  assert(list.includes('"Set "') && list.includes('"Log "'), "Set and Log are declared runtime fragments");
  assert(gymApp.includes("if (refused === 'entry') clearRefusal();"), "typing clears the entry refusal");
});

test("C-UI-4 ruling R2 the set dots keep the card's .slot hook beside the pack's dot classes", () => {
  assert(gymApp.includes("dot.className = 'slot' + (entryOf.done"), "one .slot per set, as gym.test:494 reads");
});

/* ---------------- round 3 (DECISIONS:820 (2) to (4): the board's words win on Workout) ----------------
   Each new visible string is the board's own (app/app.html #screen-workout, app/states-workout.js),
   declared in design.cjs with :820 and its state id; nothing is drawn that cannot act. */

test("C-UI-4 R3-1 the board's set-card words: the example pill, Today’s set, Unlogged / Logged, RIR (clean reps left)", () => {
  const gym = section("t-gym"), rest = section("t-rest");
  for (const [id, html] of [["t-gym", gym], ["t-rest", rest]]) {
    assert(html.includes('<div class="right"><span class="pill" title="Example numbers, not your data">example</span></div>'),
      id + " carries the board's header pill (W-06)");
  }
  assert.match(elementWith(gym, 'id="setcard"'),
    /<div class="top"><span class="eyebrow" data-slot="entry-title">Today’s set<\/span><span class="state" id="set-state"><span class="ring" aria-hidden="true"><\/span><span id="set-state-text">Unlogged<\/span><\/span><\/div>/);
  assert.match(elementWith(rest, 'id="setcard"'),
    /<div class="top"><span class="eyebrow" data-slot="entry-title"><\/span><span class="state logged" id="set-state"><span class="ring" aria-hidden="true"><\/span><span id="set-state-text">Logged<\/span><\/span><\/div>/);
  assert(gym.includes('<span class="h" id="gym-rir-head">RIR (clean reps left)</span>'));
  assert.doesNotMatch(gym, />Clean reps left</);
  assert.doesNotMatch(gymApp, /put\(map, 'entry-title', 'What you did · Set ' \+ view\.set\.position\)/,
    "the active eyebrow is the board's; the set's position is #set-count");
});

test("C-UI-4 R3-2 the rest screen's primary is the board's Start set N (W-22)", () => {
  assert(gymApp.includes("put(map, 'primary-label', next ? 'Start set ' + next.position : FINISH_WORKOUT);"));
  assert.doesNotMatch(gymApp, /Ready for set/);
  const list = designSource.slice(designSource.indexOf("const RUNTIME_COPY = Object.freeze(["),
    designSource.indexOf("const CHECKIN_RUNTIME_COPY"));
  assert(list.includes('"Start set "') && !list.includes('"Ready for set "'));
});

test("C-UI-4 R3-3 W-18: the board's hint under the numerals, only when no load step is on file; no +/- steps", () => {
  const card = elementWith(section("t-gym"), 'id="setcard"');
  assert.match(card, /<div class="unit">reps<\/div><\/div>\s*<\/div>\s*<div class="w-hint" data-slot="step-hint" hidden>No load step is on file for this machine\. Type the load you used\.<\/div>/);
  assert(gymApp.includes("map.get('step-hint').hidden = view.entry.step !== null;"));
  assert.doesNotMatch(section("t-gym"), /pstep|w-step/, "no +/- step buttons (DECISIONS:820 (4))");
});

test("C-UI-4 R3-4 W-21: a set the layer refused is said in the board's words, the layer's reason in the tail", () => {
  assert(gymApp.includes("export const SET_NOT_RECORDED = 'This set could not be recorded on this device, and no part of it was recorded.';"));
  assert(gymApp.includes("export const LAYER_REASON = 'The layer’s own reason: ';"));
  assert(gymApp.includes("lead.className = 'refusal-text';") && gymApp.includes("tail.className = 'refusal-tail';"));
  assert(gymApp.includes("refuse(result, !!result.code);"), "only a coded logSet refusal takes W-21's dress");
});

test("C-UI-4 R3-5 the coach pill opens Coach and is drawn only with that route; no Edit on the set", () => {
  for (const id of ["t-gym", "t-rest"]) {
    const voice = elementWith(section(id), 'id="workout-voice"');
    assert.match(voice, /^<div id="workout-voice" hidden>/, id);
    assert.match(voice, /<button class="talk" type="button" id="talk-workout" data-action="coach"><span class="orb" aria-hidden="true"><\/span><span class="label" id="talk-workout-label">Earned is here<\/span><span class="mic" aria-hidden="true"><svg/, id);
    assert.doesNotMatch(voice, /Use text mode|I’ll tap instead|text-mode/, id + ": no text or voice lane to switch");
  }
  assert(gymApp.includes("voice.hidden = typeof onCoach !== 'function';"));
  assert(gymApp.includes("leaveCard(() => onCoach())"));
  assert.doesNotMatch(section("t-gym"), /id="edit"/, "no Edit on the set: gym-model has no edit of an unlogged set");
});

test("C-UI-4 R3-6 each new board string is declared approved copy citing DECISIONS:820", () => {
  const approved = designSource.slice(designSource.indexOf("const APPROVED_COPY = Object.freeze(["),
    designSource.indexOf("const RUNTIME_COPY = Object.freeze(["));
  const runtime = designSource.slice(designSource.indexOf("const RUNTIME_COPY = Object.freeze(["),
    designSource.indexOf("const CHECKIN_RUNTIME_COPY"));
  for (const s of ["Today’s set", "Unlogged", "Logged", "RIR (clean reps left)", "example", "Earned is here",
    "No load step is on file for this machine. Type the load you used."]) assert(approved.includes('"' + s + '"'), s);
  for (const s of ["Start set ", "This set could not be recorded on this device, and no part of it was recorded.",
    "The layer’s own reason: "]) assert(runtime.includes('"' + s + '"'), s);
  assert.match(approved, /DECISIONS:820/);
  assert.match(runtime, /DECISIONS:820/);
});
