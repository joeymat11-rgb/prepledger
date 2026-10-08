/* C-UI-4 (look lane, S12) - INSIDE THE WORKOUT, the static half of the port.
   The gate (PACK/quality/gate.py) measures the rendered screen on CI; this cell pins, in
   the shipped bytes, the structure that measurement depends on, so a later edit cannot
   quietly move it: the chassis (a .body and a .stack as the template's only two
   elements), the seven workout font identities as REAL bound elements (no alias: the
   #log-label the gate reads is the same element the card writes its label into), the
   Log button in the stack with nothing below it but the one link row on BOTH the set and
   the rest screen (so Log keeps its edge), and the label carrying the multiplication sign.
   Fix round 2 (REVIEW-LOOK-C-UI-4-l1 F1 to F7) adds one cell per finding.
   It reads files only: no DOM, no engine, no store. The S12 C-2 cells at the end are the
   one exception: they run the real scene.mjs over the real shell and templates in jsdom
   (still no engine, no store, no network). */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import design from "../design.cjs";

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

/* ---------------- S12 C-2 (STOP-S12-NLMOUNT, SC-19): THE NATIVE-LOAD MOUNT ----------------
   S11 (FA02, sealed) opens the Workout screen through today-entry.mjs open(): #phone gets a
   section[data-native-load="region"] (the native-load panel: Check next weight, its status,
   the held-lift notice and the offer cards with Yes / Not now, the Undo card among them) and
   a div[data-native-load="gym"], and the gym view is mounted INSIDE that div. That is sealed
   BEHAVIOUR and wins (owner priority); the look adapts its own files. These cells run the
   real scene.mjs over the real shell and templates in jsdom, build #phone exactly as open()
   :451-459 does, mount the chassis into the child exactly as gym-app.mjs show() does, and
   then require the look to apply: the frame is dressed as Workout, the gym view's .body
   gets the scroll fades, and every declaration the cascade gives the screen's elements on
   the plain mount (chassis directly under #phone) is the declaration it gives them under
   the S11 mount. No engine, no store, no today-entry.mjs import: S11's bytes are only READ,
   to pin that the replica below is still the shape open() and show() mount. */
const ENTRY_SOURCE = fs.readFileSync(path.join(TODAY, "today-entry.mjs"), "utf8");
const SCENE_SOURCE = fs.readFileSync(path.join(TODAY, "scene.mjs"), "utf8");
const NL_COPY = (() => {
  const block = ENTRY_SOURCE.slice(ENTRY_SOURCE.indexOf("export const NATIVE_LOAD_COPY"),
    ENTRY_SOURCE.indexOf("export const NATIVE_LOAD_PROPOSED_COPY"));
  const copy = {};
  for (const m of block.matchAll(/^\s+(\w+): "([^"]*)",?\r?$/gm)) copy[m[1]] = m[2];
  return copy;
})();

test("S12 C-2 the replica is S11's mount: open() pre-splits #phone, show() mounts into the child", () => {
  const open = ENTRY_SOURCE.slice(ENTRY_SOURCE.indexOf("open({ doc, phone, back, checkIn }) {"));
  for (const line of ['const region = doc.createElement("section");',
    'region.setAttribute("data-native-load", "region");',
    'const child = doc.createElement("div");',
    'child.setAttribute("data-native-load", "gym");',
    "phone.replaceChildren(region, child);",
    "nativeLoad.mount(doc, region);",
    "return mountGym(doc, child, {"]) assert(open.includes(line), "today-entry.mjs open(): " + line);
  for (const line of ['make("button", { type: "button", "data-native-load": "check", class: "btn" }, NATIVE_LOAD_COPY.check);',
    'make("div", { "data-native-load": "offer", "data-lift": offer.lift, "data-kind": offer.kind, "data-proposal": offer.proposalId });',
    'make("p", { "data-native-load": "notice", "data-lift": notice.lift }',
    'make("p", { "data-native-load": "status", role: "status" }, view.copy)']) {
    assert(ENTRY_SOURCE.includes(line), "today-entry.mjs paint(): " + line);
  }
  assert(gymApp.includes("phone.replaceChildren(root);"), "gym-app.mjs show() replaces its container");
  assert(gymApp.includes("phone.classList.toggle('w-rest', rest === true);"), "the rest class sits on the container");
  assert.equal(NL_COPY.check, "Check next weight");
});

/* The cascade, as the browser resolves it for the declarations these cells compare: every
   rule of the shipped stylesheet (design.composeStyles, in order), each selector matched by
   jsdom, the winner by !important, then specificity, then order. */
const COMPOSED = design.composeStyles(design.readApproved(), design.chromeCss(), design.readFonts(),
  design.readSceneAssets());
function splitTop(text) {
  const out = []; let depth = 0, from = 0;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "(" || ch === "[") depth += 1;
    else if (ch === ")" || ch === "]") depth -= 1;
    else if (ch === "," && depth === 0) { out.push(text.slice(from, i)); from = i + 1; }
  }
  out.push(text.slice(from));
  return out.map((s) => s.trim()).filter(Boolean);
}
function specificity(selector) {
  let a = 0, b = 0, c = 0, i = 0;
  const s = selector;
  const add = (x) => { a += x[0]; b += x[1]; c += x[2]; };
  const max = (list) => list.map(specificity).reduce((m, x) =>
    (x[0] > m[0] || (x[0] === m[0] && (x[1] > m[1] || (x[1] === m[1] && x[2] > m[2])))) ? x : m, [0, 0, 0]);
  while (i < s.length) {
    const ch = s[i];
    if (ch === "#") { a += 1; i += 1; while (i < s.length && /[\w-]/.test(s[i])) i += 1; }
    else if (ch === ".") { b += 1; i += 1; while (i < s.length && /[\w-]/.test(s[i])) i += 1; }
    else if (ch === "[") { b += 1; let d = 0; for (; i < s.length; i += 1) { if (s[i] === "[") d += 1; if (s[i] === "]") { d -= 1; if (d === 0) { i += 1; break; } } } }
    else if (ch === ":") {
      if (s[i + 1] === ":") { c += 1; i += 2; while (i < s.length && /[\w-]/.test(s[i])) i += 1; continue; }
      i += 1; let name = "";
      while (i < s.length && /[\w-]/.test(s[i])) { name += s[i]; i += 1; }
      if (s[i] === "(") {
        let d = 0, start = i + 1;
        for (; i < s.length; i += 1) { if (s[i] === "(") d += 1; if (s[i] === ")") { d -= 1; if (d === 0) break; } }
        const inner = s.slice(start, i); i += 1;
        if (name === "where") continue;
        if (name === "is" || name === "not" || name === "has") add(max(splitTop(inner)));
        else b += 1;
      } else b += 1;
    } else if (/[a-zA-Z]/.test(ch)) { c += 1; while (i < s.length && /[\w-]/.test(s[i])) i += 1; }
    else i += 1;
  }
  return [a, b, c];
}
const RULES = (() => {
  const out = [];
  let order = 0;
  for (const m of COMPOSED.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = splitTop(m[1].replace(/\s+/g, " ")).filter((s) => !s.startsWith("@") && !s.includes("::"));
    if (!selectors.length) continue;
    const decls = [];
    for (const part of m[2].split(";")) {
      const at = part.indexOf(":");
      if (at <= 0) continue;
      let value = part.slice(at + 1).trim();
      const important = /!important$/.test(value);
      if (important) value = value.replace(/\s*!important$/, "");
      decls.push([part.slice(0, at).trim(), value.replace(/\s+/g, " "), important]);
    }
    order += 1;
    out.push({ selectors, decls, order });
  }
  return out;
})();
function compareKeys(x, y) {
  for (let n = 0; n < x.length; n += 1) if (x[n] !== y[n]) return x[n] - y[n];
  return 0;
}
function winners(el) {
  const won = new Map();
  for (const rule of RULES) for (const selector of rule.selectors) {
    let hit = false;
    try { hit = el.matches(selector); } catch { continue; }
    if (!hit) continue;
    const sp = specificity(selector);
    for (const [prop, value, important] of rule.decls) {
      const key = [important ? 1 : 0, ...sp, rule.order];
      const prev = won.get(prop);
      if (!prev || compareKeys(key, prev.key) >= 0) won.set(prop, { value, key, selector });
    }
  }
  return won;
}

/* The page: the real shell and templates, the real scene installed first (as the shipped
   app.js does), then the Workout screen mounted plain or under S11's pre-split. */
async function workoutPage({ native, screen }) {
  const dom = new JSDOM(design.shellHtml().replace("<!-- APPROVED_TEMPLATES -->", design.templateHtml()),
    { url: "http://127.0.0.1:4178/" });
  const win = dom.window, doc = win.document;
  win.__earnedSceneAssets = { mist: "data:image/png;base64,AA", grain: "data:image/png;base64,AA",
    plateInk: "data:image/jpeg;base64,AA", plateDawn: "data:image/jpeg;base64,AA" };
  win.matchMedia = () => ({ matches: true });   /* reduced motion: one still, nothing scheduled */
  win.HTMLCanvasElement.prototype.getContext = () => ({});
  const PreviousImage = globalThis.Image;
  globalThis.Image = class { set src(value) { this.url = value; } };
  try {
    const { installScene } = await import("data:text/javascript;base64,"
      + Buffer.from(SCENE_SOURCE + "\nexport { installScene };\n").toString("base64"));
    assert(installScene(win, doc), "the scene installs");
  } finally {
    globalThis.Image = PreviousImage;
  }
  const phone = doc.getElementById("phone");
  const make = (tag, attrs = {}, text) => {
    const el = doc.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (text !== undefined) el.textContent = text;
    return el;
  };
  let container = phone, region = null;
  if (native) {
    /* today-entry.mjs open() :451-459 */
    region = make("section", { "data-native-load": "region", "aria-label": NL_COPY.check });
    container = make("div", { "data-native-load": "gym" });
    phone.replaceChildren(region, container);
    /* paint() :268-296: the check, a status line, a held-lift notice, an offer card */
    const offer = make("div", { "data-native-load": "offer", "data-lift": "lift-a", "data-kind": "earn", "data-proposal": "p1" });
    const list = make("ul", { "aria-label": "Offered weight for each set" });
    const item = make("li", {}, "Set 1: ");
    item.append(make("span", { "data-native-load": "set-load" }, "45 lb"));
    list.append(item);
    offer.append(make("h3", {}, "Lift A: next weight"), list, make("p", { "data-native-load": "reason" }, "Reason."),
      make("button", { type: "button", "data-native-load": "yes", class: "btn" }, NL_COPY.yes),
      make("button", { type: "button", "data-native-load": "decline", class: "btn" }, NL_COPY.decline));
    region.replaceChildren(make("button", { type: "button", "data-native-load": "check", class: "btn" }, NL_COPY.check),
      make("p", { "data-native-load": "status", role: "status" }, NL_COPY.none),
      make("p", { "data-native-load": "notice", "data-lift": "lift-b" }, "Lift B: held."), offer);
  }
  /* gym-app.mjs chassis(id) then show(root, rest) */
  container.replaceChildren(doc.getElementById(screen).content.cloneNode(true));
  container.classList.toggle("w-rest", screen === "t-rest");
  await new Promise((resolve) => setTimeout(resolve, 0));
  return { doc, phone, container, region, frame: doc.querySelector(".scene-frame") };
}

for (const screen of ["t-gym", "t-rest"]) {
  test(`S12 C-2 ${screen} under S11's native-load mount is dressed as Workout, with the .body's scroll fades`, async () => {
    const { doc, container, frame } = await workoutPage({ native: true, screen });
    assert.equal(container.parentElement, doc.getElementById("phone"), "the gym view sits in S11's child, not under #phone");
    assert.equal(doc.documentElement.dataset.screen, "workout", "the page is the workout screen");
    assert(frame.classList.contains("screen-workout"), "the frame wears .screen-workout");
    assert(!frame.classList.contains("screen-today"), "and not Today's dress");
    const body = container.querySelector(":scope > .body");
    assert.equal(typeof body.__earnedFades, "function", "the gym view's scrolling .body has the ruled fades");
  });
}

/* The elements whose dress the gate and the boards read on the set and rest screens. */
const TARGETS = {
  "t-gym": [".body", ".stack", ".header", ".header .back", ".wordmark", "h1.screen-title", ".session-row",
    "#setcard", "#gym-weight", "#rir", "#log", "#log-label", ".links.bottom .link", "#machine"],
  "t-rest": [".body", ".stack", ".header .back", "h1.screen-title", "#setcard", ".w-rest-line", "#log",
    "#log-label", "#edit", ".links.bottom .link"],
};
for (const screen of ["t-gym", "t-rest"]) {
  test(`S12 C-2 ${screen}: every declaration the plain mount resolves is the one S11's mount resolves`, async () => {
    const plain = await workoutPage({ native: false, screen });
    const nl = await workoutPage({ native: true, screen });
    const missing = [];
    const compare = (label, a, b) => {
      const wa = winners(a), wb = winners(b);
      for (const [prop, { value, selector }] of wa) {
        const got = wb.get(prop);
        if (!got || got.value !== value) missing.push(`${label} ${prop}: ${value} (${selector}) -> ${got ? got.value + " (" + got.selector + ")" : "nothing"}`);
      }
    };
    compare("#phone", plain.phone, nl.phone);
    for (const scroll of [false, true]) {
      for (const page of [plain, nl]) {
        const body = page.container.querySelector(":scope > .body");
        body.classList.toggle("can-scroll", scroll);
        body.classList.toggle("at-start", false);
        body.classList.toggle("at-end", false);
      }
      for (const sel of TARGETS[screen]) {
        const a = plain.container.querySelector(sel), b = nl.container.querySelector(sel);
        assert(a && b, sel + " is on both mounts");
        compare((scroll ? "[scrolling] " : "") + sel, a, b);
      }
    }
    assert.deepEqual(missing, [], "the look misses under S11's mount:\n" + missing.join("\n"));
  });
}

test("S12 C-2 the panel sits between the scrolling body and the fixed stack, dressed in the pack's own values", async () => {
  const { container, region } = await workoutPage({ native: true, screen: "t-gym" });
  const w = (el) => winners(el);
  assert.equal(w(container).get("display")?.value, "contents", "S11's child box gives its two chassis parts to the host");
  assert.equal(w(region).get("order")?.value, "1", "the panel follows the scrolling body");
  assert.equal(w(container.querySelector(":scope > .stack")).get("order")?.value, "1", "and Log keeps its edge below it");
  assert.equal(w(container.querySelector(":scope > .body")).get("order"), undefined, "the body stays first");
  const check = region.querySelector('[data-native-load="check"]');
  for (const [prop, value] of [["min-height", "var(--hit)"], ["font-size", "13.5px"], ["color", "var(--text-soft)"]]) {
    assert.equal(w(check).get(prop)?.value, value, "Check next weight is the pack's quiet link: " + prop);
  }
  const notice = region.querySelector('[data-native-load="notice"]');
  assert.equal(w(notice).get("border")?.value, "1px solid var(--line-soft)", "a held lift is a card with the answered edge");
  assert.equal(w(notice).get("border-radius")?.value, "var(--radius-card)");
  const offer = region.querySelector('[data-native-load="offer"]');
  assert.equal(w(offer).get("border")?.value, "1px solid var(--line-gold)", "the open offer keeps C-UI-3's gold edge");
  const status = region.querySelector('[data-native-load="status"]');
  assert.equal(w(status).get("color")?.value, "var(--muted)", "the status line is the reason line's quiet text");
});
