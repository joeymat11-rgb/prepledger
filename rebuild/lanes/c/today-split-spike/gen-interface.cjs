#!/usr/bin/env node
/* gen-interface.cjs - THE FIFTH GENERATOR (part 2, the big cut).
 *
 * WHAT PROBLEM THIS SOLVES. Part 1 cut two small regions and hand-declared six `replace`
 * rows for the released half of gym-app.mjs. today-app.cjs's released half holds 166
 * references to sealed bindings on 111 distinct lines, and `DECISIONS:574` rules that
 * released lines outside any region are handled by DECLARED REPLACE REGIONS and never by
 * a sixth instrument. 111 hand-written rows is exactly the hand census that failed twice
 * before (`DECISIONS:550`'s diagnosis), so the rows are GENERATED: this reads the crossing
 * census's own reference POSITIONS out of the scope analysis and rewrites each reference
 * in place, leaving every other byte of the line alone.
 *
 * IT IS A GENERATOR AND NOT A CHECK. Its output is `replace` rows in regions.json, which
 * cut.cjs then witnesses like any other declared text (R1 NOTE-1, R2 F4): the pre-image is
 * hashed at both named refs and the replacement text is hashed as authored bytes. So the
 * table it writes is reviewed exactly the way a hand-written one is, and re-taking it is a
 * visible diff. S-R19's rule holds: nothing here is its own check.
 *
 * THE MAP IS DECLARED, NOT INFERRED. Three rules and nothing else:
 *   read  of a sealed binding N   ->  facade.N()
 *   call  of a sealed function N  ->  hooks.N(   (or facade.N( for the PURE READS below)
 *   write or update of a sealed binding  ->  REFUSED. Every one of those is an
 *     S-R17 (g) seam whose disposition B.5 designs by hand; this instrument will not
 *     invent one. It prints them as STOPS and leaves their lines alone.
 * A name whose interface spelling differs from its source spelling is a declared RENAME
 * row, and there is a list of them below with the spec section that rules each.
 *
 * Usage:
 *   node gen-interface.cjs --root <pre-cut tree> --file today-app.cjs [--json rows.json]
 *                          [--regions regions.json] [--write]
 */
"use strict";
const fs = require("fs");
const path = require("path");

const INSTR = process.env.CENSUS_INSTRUMENT || "/home/claude/farm/tools/census/node_modules";
const acorn = require(path.join(INSTR, "acorn"));
const walk = require(path.join(INSTR, "acorn-walk"));
const escope = require(path.join(INSTR, "eslint-scope"));

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 ? argv[i + 1] : d; };
const ROOT = opt("root");
const FILE = opt("file", "today-app.cjs");
const REGIONS = opt("regions", path.join(__dirname, "regions.json"));
const JSONOUT = opt("json");
const WRITE = argv.includes("--write");
if (!ROOT) { console.error("usage: gen-interface.cjs --root <pre-cut tree> [--file today-app.cjs]"); process.exit(2); }

const table = JSON.parse(fs.readFileSync(REGIONS, "utf8"));
const TODAY = table.today;
const resolveAnchors = require("./resolve.cjs");
const IFACE = table.interface || {};
const FACADE = IFACE.facade || "facade";
const HOOKS = IFACE.callbacks || "hooks";

/* THE FOUR PURE READS (spec B.3). They are CALLS in the census and they change nothing, so
   they sit on the read-only facade rather than on the callback table. A fifth name here
   would be a capability handed out as a getter, so the list is closed and stated. */
const PURE_READ_CALLS = new Set(["session", "checkinSummary", "firstRun", "sleepNightDate"]);

/* DECLARED RENAMES: a name whose interface spelling is not its source spelling.
   THE LIST IS EMPTY, AND THAT IS A DECISION THIS ROUND MAKES AND REPORTS.
   Spec B.6 renames `sleepErrorText` to `sleepOutcome` and turns the eleven sentences
   recordSleep composes into a closed set of outcome shapes mapped in the view. Every one
   of those is a STATEMENT REWRITE INSIDE A MOVED REGION, and D.1 declares only the
   `sleepErrorText = <expression>` family (W5) - not recordIntake's two food sentences in
   TA-S23, and not the view-side mapper. DECISIONS:584 rules that any statement rewrite
   outside the pre-ruled families STOPS that region. Renaming here would therefore have
   stopped TA-S23, TA-S29 and TA-S30 - the food writer, the sleep read retry and the sleep
   writer, the three regions this whole part exists to move.
   So B.6 IS NOT BUILT in part 2. The twelve copy constants cross as INJECTED READ-ONLY
   VALUES named in the factory signature, every copy byte stays exactly where it is, the
   sealed module holds ZERO string literals (which is what S-R13's law actually asserts),
   and the outcome discipline is reported as its own ticket. A rename with no build behind
   it would have been a silent behaviour change inside a pure move. */
const RENAME = {};

/* ---- THE HAND-DESIGNED ROWS (spec B.5's RELEASED ASSIGNS A SEALED BINDING class) -------
 * Every one of these is a released line that DECIDES WHAT IS STORED or what is re-read, and
 * the generator refuses to invent a disposition for one. They are written here, by hand, in
 * the one place a reviewer can read them beside the pre-image they replace, and the
 * generator's job is to ANCHOR them by content, check that they cover exactly the lines it
 * stopped on, and put them in regions.json where cut.cjs witnesses their text like any
 * other declared row. `why` names the spec row that rules each.
 *
 * THE RULE THEY ALL FOLLOW: the released half keeps its DOM work and its guards and loses
 * the assignment. The sealed half mints the promise or the flag and assigns it, so that
 * after the cut no released line assigns a binding declared at factory scope in the seal -
 * which is B.5's PASS condition and H.2 STOP 11, measured by census.cjs and not by reading.
 */
const HAND = [
  { why: "NOT a B.5 assignment row, and the only hand row that is not. `sleepDraft` is a " +
      "RELEASED const object this file mutates in place and never reassigns, and the seal " +
      "reads it once, in recordSleep. It cannot be a factory argument: the factory is " +
      "composed at TA-S01, above this declaration, because the boot statement at :422 must " +
      "run where it runs today (spec B.3's boot order), so at composition time this binding " +
      "is still in its temporal dead zone. It is handed over HERE, immediately after it " +
      "exists and long before any gesture, and the seal holds the SAME object, so every " +
      "keystroke the view records is the keystroke the writer reads.",
    from: ['  const sleepDraft = { mode: "times", bed: "", wake: "", awake_min: "", hours: "",',
           '    awakeOpen: false, from_checkin_op_id: "" };'],
    to: ['  const sleepDraft = { mode: "times", bed: "", wake: "", awake_min: "", hours: "",',
         '    awakeOpen: false, from_checkin_op_id: "" };',
         "  /* THE SPLIT (spec B.5). The sealed writer reads this object once, in recordSleep;",
         "     it is the SAME object, not a copy, so it sees every keystroke. */",
         "  hooks.bindSleepDraft(sleepDraft);"] },
  { why: "B.5 TA-M01: the released route stops owning the measure screen cache. The seal mints it and keeps it; the released half keeps its own `Screen` import and its token guard.",
    from: ["    if (!measureScreen) measureScreen = Screen.createMeasureScreen(measureDeps());"],
    to: ["    hooks.mintMeasureScreen(Screen);"] },
  { why: "B.5 TA-M02: the import screen twin. R2 BLOCKING-8's finding is that :718-:719 go with it, and they do: gen-interface rewrites both through the facade.",
    from: ["    if (!importScreen) importScreen = Screen.createImportScreen(importDeps());"],
    to: ["    hooks.mintImportScreen(Screen);"] },
  { why: "B.5 RELEASED body: the retry click handed the in-flight promise to a released binding. The seal mints and assigns it; the released half keeps the listener and the guard.",
    from: ['      if (foodReadBack) retry.addEventListener("click", () => { foodSaving = retryFoodRead(); });'],
    to: ['      if (facade.foodReadBack()) hooks.listen(retry, "click", () => { hooks.retryFoodRead(); });'] },
  { why: "B.5 RELEASED body: the food save click. The DOM arguments are UNCHANGED, because changing recordIntake's signature would rewrite a moved region and that is an undeclared statement rewrite (S-R17 (g)); B.3's `no entry takes a DOM node` is therefore NOT met by this part and is reported as a STOP.",
    from: ['    save.addEventListener("click", () => { foodSaving = recordIntake(save, cal, pro, error); });'],
    to: ['    hooks.listen(save, "click", () => { hooks.recordIntake(save, cal, pro, error); });'] },
  { why: "B.5 TA-M07 / R2 BLOCKING-1: the seal mints the read handle and assigns it; the `.then` body below is PURE PAINT, stays released byte-identical, and is handed to the hook as a closure. Only this one line changes.",
    from: ["    sleepCheckInViewPending = Promise.all([loadCheckInKit(), readSleepCheckIn(date, true)]).then(() => {"],
    to: ["    hooks.readSleepCheckInView(date, () => {"] },
  { why: "B.5 TA-M08 / SEAM 9a: eight assignments in one gesture. hooks.sleepNightChosen(rawDate) takes the RAW field value and the seal does all eight, including B.6's outcome reset.",
    from: ["        sleepNightChoice = dateBox.value || null;",
           "        sleepRollover = null;",
           "        sleepOpenedDay = sleepToday(); sleepOpenedNight = sleepNightDate();",
           '        sleepAck = null; sleepReadBack = null; sleepCorrecting = false; sleepErrorText = "";'],
    to: ["        hooks.sleepNightChosen(dateBox.value || null);"] },
  { why: "B.5 TA-M09 / SEAM 9b: four assignments, no argument at all. The night the seal keeps is the seal's own rollover value.",
    from: ["        sleepNightChoice = sleepRollover || sleepNightDate();",
           "        sleepRollover = null;",
           "        sleepOpenedDay = sleepToday(); sleepOpenedNight = sleepNightDate();"],
    to: ["        hooks.keepNight();"] },
  { why: "B.5 RELEASED body: the sleep read retry, the twin of the food one.",
    from: ['      retry.addEventListener("click", () => { sleepSaving = retrySleepRead(); });'],
    to: ['      hooks.listen(retry, "click", () => { hooks.retrySleepRead(); });'] },
  { why: "B.5 RELEASED body: sleepCorrecting = true is a sealed flag. hooks.sleepCorrect(flag) takes it; the repaint stays released, which is where the router lives.",
    from: ['      change.addEventListener("click", () => { sleepCorrecting = true; render("sleep", false); });'],
    to: ['      hooks.listen(change, "click", () => { hooks.sleepCorrect(true); render("sleep", false); });'] },
  { why: "B.5 RELEASED body: the cancel path, the same flag the other way. clearSleepDraft and render are RELEASED and stay released: the draft is the screen's own transient state (the file says so at :475).",
    from: ['        sleepCorrecting = false; clearSleepDraft(); render("sleep", false);'],
    to: ['        hooks.sleepCorrect(false); clearSleepDraft(); render("sleep", false);'] },
  { why: "B.5 RELEASED body: the sleep save click, the one gesture that writes a night. Same DOM-argument qualification as the food save.",
    from: ['    save.addEventListener("click", () => { sleepSaving = recordSleep(map); });'],
    to: ['    hooks.listen(save, "click", () => { hooks.recordSleep(map); });'] },
  { why: "B.5 TA-M10 / SEAM 10: the check-in read cache is cleared when the athlete leaves for the sleep screen. mountToken += 1 on the line above stays RELEASED (S-R15), because it is a paint concern and the file says so at :2289-:2294.",
    from: ['      if (next === "sleep") { sleepCheckInDay = null; sleepCheckInPending = null; }'],
    to: ['      if (next === "sleep") hooks.forgetCheckInRead();'] },
  { why: "B.5 TA-M11 / B.3 consequence 3: the setup done chain assigns the sealed `ready`. The seal takes the adopting flag, mints the chain and assigns; the `return ready;` two lines below is rewritten through the facade by gen-interface.",
    from: ["          ready = settleAdoption(adopting ? adoptAthleteState() : Promise.resolve(), adopting);"],
    to: ["          hooks.settleAdoption(adopting);"] },
];

/* THE HAND ROWS ARE ANCHORED BY CONTENT, NOT BY LINE NUMBER, and this is not a nicety:
   the first cut of this table used line numbers and produced a DIFFERENT set of anchors at
   the two named refs, because today-app.cjs gains one line below :869 between them. Eleven
   of the thirteen rows would have been anchored on the wrong line at the tip - one of them
   on a bare `    }` that occurs 42 times - and cut.cjs's witness would have refused, which
   is R3's finding working as designed. Each row now names its exact pre-image and is
   located by it, and a run that matches zero places or more than one REFUSES here. */
function locateHand(h) {
  const hits = [];
  for (let i = 0; i + h.from.length <= lines.length; i += 1) {
    let ok = true;
    for (let j = 0; j < h.from.length; j += 1) if (lines[i + j] !== h.from[j]) { ok = false; break; }
    if (ok) hits.push(i + 1);
  }
  if (hits.length !== 1) {
    fail(FILE + ": the hand-designed row " + JSON.stringify(h.from[0].trim().slice(0, 60)) +
      " matches " + hits.length + " places" + (hits.length ? " (:" + hits.join(" :") + ")" : "") +
      ". A row that decides what is stored is located by its own bytes and by nothing else" +
      " (S-R20); re-read the source before re-anchoring it.");
  }
  return [hits[0], hits[0] + h.from.length - 1];
}

const GLOBALS = new Set([
  "Object", "Array", "String", "Number", "Boolean", "Symbol", "Math", "JSON", "Date",
  "RegExp", "Error", "TypeError", "RangeError", "Promise", "Map", "Set", "WeakMap",
  "WeakSet", "Proxy", "Reflect", "Intl", "globalThis", "undefined", "NaN", "Infinity",
  "isNaN", "isFinite", "parseInt", "parseFloat", "encodeURIComponent", "decodeURIComponent",
  "console", "require", "module", "exports", "__dirname", "__filename", "process",
  "setTimeout", "clearTimeout", "setInterval", "clearInterval", "queueMicrotask",
  "URL", "URLSearchParams", "TextEncoder", "TextDecoder", "structuredClone", "Function",
  "arguments", "AggregateError", "BigInt",
]);

const srcPath = path.join(ROOT, TODAY, FILE);
const src = fs.readFileSync(srcPath, "utf8");
const lines = src.split("\n");

/* ---- the regions, through the ONE resolver ------------------------------------------ */
const fail = (m) => { console.error("REFUSED: " + m); process.exit(1); };
/* The rows THIS generator wrote on a previous run are re-derived from scratch every time,
   so they are dropped before the table is resolved: resolving a stale row would make the
   generator refuse on its own previous output instead of replacing it. */
const regions = (table.files[FILE] || []).filter((r) => !/^TA-[IW]/.test(r.id)).map((r) => {
  const { start, end } = resolveAnchors(lines, r, FILE, fail);
  return { ...r, start, end };
});
const moveRegions = regions.filter((r) => r.kind === "move");
const replaceRegions = regions.filter((r) => r.kind === "replace");
function regionAt(line) { for (const r of regions) if (line >= r.start && line <= r.end) return r; return null; }
/* A line is SEALED if it sits in a move region: after the cut it lives in today-lanes.cjs.
   A line is ALREADY DECLARED if it sits in a replace region: its rewrite is the table's. */
function movedAt(line) { for (const r of moveRegions) if (line >= r.start && line <= r.end) return r; return null; }
function declaredAt(line) { for (const r of replaceRegions) if (line >= r.start && line <= r.end) return r; return null; }
/* A `replace` row may REMOVE a declaration: `TA-S38`'s pre-image is
   `let ready = settleAdoption(...)` and its replacement is `hooks.bootSettleAdoption();`,
   which declares nothing, so after the cut `ready` is declared at factory scope inside the
   seal (spec B.3 consequence 3, the whole reason S-R21 gave the boot statements their own
   kind). The row says so in its own `declaresSealed` field rather than this instrument
   inferring it from the absence of a `let`: an inference there would silently re-class a
   binding, which is what R3 BLOCKING-5 caught B.3's prose doing. */
function sealedByReplace(line) {
  for (const r of replaceRegions) {
    if (line < r.start || line > r.end) continue;
    if (Array.isArray(r.declaresSealed) && r.declaresSealed.length) return r;
  }
  return null;
}
const SEALED_BY_REPLACE = new Map();   /* name -> the replace row that seals it */
for (const r of replaceRegions) {
  for (const n of (r.declaresSealed || [])) SEALED_BY_REPLACE.set(n, r);
}

/* ---- THE SEALED -> RELEASED DIRECTION: the PAINT HANDLE -------------------------------
 * The other direction of the cut. Spec B.4 bounds it to a frozen paint handle, and D.1
 * declares the rewrites that make it work IN ADVANCE, as the W families, so they are
 * pre-ruled statement and call-target rewrites and not discoveries (DECISIONS:584).
 * Everything the handle does NOT carry crosses as an INJECTED read-only value named in the
 * factory signature, where a moved byte keeps its own spelling and nothing is rewritten at
 * all - the road part 1 took for today-readings.cjs's seven injections.
 *
 * Each name below produces a `substitutions` row per affected LINE, with the whole line as
 * `from` and the rewritten line as `to`, scoped to the region it sits in. A whole line is
 * the safest `from` cut.cjs's plain string split can take: a bare identifier as `from`
 * would also hit `sleepCheckInScreen`, a property key and the inside of a literal.
 */
/* ---- ONE MORE DECLARED SUBSTITUTION, AND THE FENCE IS WHY IT EXISTS --------------------
 * `sleepDraft` is declared at factory scope in BOTH halves after the cut: the released view
 * owns `const sleepDraft = { ... }` and mutates it in place, and the seal holds a binding of
 * the same name that `hooks.bindSleepDraft` fills. That is not a capability leak - the seal
 * only ever receives the object - but the writer fence's
 * FENCE-SEALED-BINDING-ASSIGNED row reads the released `const sleepDraft = {` as the
 * released half assigning a name the seal declares, and it is RIGHT to: two bindings with
 * one name across the seam is exactly the shape that would hide a real assignment.
 * So the SEALED one takes a different name. It is a BARE IDENTIFIER rewrite, which D.1
 * calls ORDINARY, and it touches one occurrence in one moved region.
 */
const W10 = { id: "W10", file: FILE, region: "TA-S30",
  from: "    const entry = { ...sleepDraft, date };",
  to: "    const entry = { ...sleepDraftHeld, date };",
  kind: "bare identifier rewrite",
  why: "spec B.5: sleepDraft crosses SEALED -> RELEASED as a callback argument. It is bound " +
    "by hooks.bindSleepDraft and held under a name of its own inside the seal, so that no " +
    "name is declared at factory scope on both sides of the cut and the fence's " +
    "FENCE-SEALED-BINDING-ASSIGNED row stays a measurement rather than a declared exception." };

const PAINT = {
  render:          { id: "W1", to: "painter.repaint",         kind: "call-target rewrite", stop: false },
  clearSleepDraft: { id: "W3", to: "painter.clearDraft",      kind: "call-target rewrite", stop: false },
  paintTodayEntry: { id: "W9", to: "painter.paintTodayEntry", kind: "call-target rewrite", stop: false },
  mountToken:      { id: "W2", to: "painter.token()",         kind: "binding read to a call", stop: true },
  screen:          { id: "W4", to: "painter.screenNow()",     kind: "binding read to a call", stop: true },
};

/* ---- the scope analysis, over the UNCUT source --------------------------------------- */
const module_ = FILE.endsWith(".mjs");
const ast = acorn.parse(src, { ecmaVersion: 2022, sourceType: module_ ? "module" : "script",
  locations: true, ranges: true });
const manager = escope.analyze(ast, { ecmaVersion: 2022, sourceType: module_ ? "module" : "script",
  nodejsScope: !module_, ignoreEval: true });

const callees = new Set();
walk.simple(ast, {
  CallExpression(n) { if (n.callee.type === "Identifier") callees.add(n.callee.start); },
  NewExpression(n) { if (n.callee.type === "Identifier") callees.add(n.callee.start); },
});

/* Every reference to every variable declared inside a MOVE region, taken from the scope
   tree so that a shadowed name in an unrelated closure can never be picked up by text. */
const refs = [];
for (const scope of manager.scopes) {
  for (const v of scope.variables) {
    if (!v.defs.length) continue;
    const declLine = v.defs[0].name.loc.start.line;
    const declIn = movedAt(declLine) || SEALED_BY_REPLACE.get(v.name) || null;
    if (!declIn) continue;                        /* not a sealed binding */
    if (declIn.kind === "replace" && sealedByReplace(declLine) !== declIn) continue;
    if (GLOBALS.has(v.name)) continue;
    for (const ref of v.references) {
      const id = ref.identifier;
      const line = id.loc.start.line;
      if (movedAt(line)) continue;                /* the reference goes with the seal */
      if (declaredAt(line) && declaredAt(line) === declIn) continue;   /* its own pre-image */
      const kind = ref.isWriteOnly() ? "write" : ref.isReadWrite() ? "update"
        : callees.has(id.start) ? "call" : "read";
      refs.push({ name: v.name, kind, line, col: id.loc.start.column,
        start: id.start, end: id.end, declLine, declIn: declIn.id,
        already: declaredAt(line) ? declaredAt(line).id : null });
    }
  }
}
refs.sort((a, b) => a.start - b.start);

/* The SEALED half's references to RELEASED bindings, by the same scope analysis and the
   same position-exact rewriting. A reference INSIDE a move region whose declaration is
   OUTSIDE every move region is a sealed-to-released crossing; only the five names the
   paint handle carries are rewritten, and every other one is injected. */
const sealedRefs = [];
for (const scope of manager.scopes) {
  for (const v of scope.variables) {
    if (!v.defs.length) continue;
    const declLine = v.defs[0].name.loc.start.line;
    if (movedAt(declLine)) continue;              /* declared in the seal: not a crossing */
    if (GLOBALS.has(v.name)) continue;
    if (!PAINT[v.name]) continue;                 /* injected, not rewritten */
    for (const ref of v.references) {
      const id = ref.identifier;
      const line = id.loc.start.line;
      const inMove = movedAt(line);
      if (!inMove) continue;                      /* stays released */
      const kind = ref.isWriteOnly() ? "write" : ref.isReadWrite() ? "update"
        : callees.has(id.start) ? "call" : "read";
      sealedRefs.push({ name: v.name, kind, line, start: id.start, end: id.end, region: inMove.id });
    }
  }
}
sealedRefs.sort((a, b) => a.start - b.start);

/* ---- E.6's LISTENER SHIM: every released listener goes through the seal ----------------
 * The runtime gesture guard can only be sound if the seal knows when a DOM event is being
 * dispatched, and it only knows that if EVERY listener the released view installs goes
 * through its shim. That is not a judgement either: the sites are taken from the AST, the
 * rewrite is position-exact like every other one here, and the fence asserts afterwards
 * that the released file contains ZERO remaining addEventListener - so a listener the
 * generator missed is a RED ROW and not a silent hole.
 *
 * removeEventListener goes with it. today-app.cjs removes the phone keydown handler on
 * dispose, and with a shim in place the handler actually registered is the WRAPPER, so a
 * bare removeEventListener would stop removing anything. The seal keeps the wrapper in a
 * WeakMap keyed by the function, hands the same one back, and the dispose site removes the
 * same object it added.
 */
const LISTEN_SITES = [];
walk.simple(ast, {
  CallExpression(n) {
    if (n.callee.type !== "MemberExpression" || n.callee.computed) return;
    const prop = n.callee.property.name;
    if (prop !== "addEventListener" && prop !== "removeEventListener") return;
    const line = n.loc.start.line;
    if (movedAt(line)) return;                    /* the seal installs none today */
    if (n.callee.object.loc.start.line !== line) return;   /* object not on this line */
    LISTEN_SITES.push({ line, prop,
      objStart: n.callee.object.start, objEnd: n.callee.object.end,
      callStart: n.start, argsStart: n.arguments.length ? n.arguments[0].start : n.end });
  },
});
LISTEN_SITES.sort((a, b) => a.callStart - b.callStart);

/* Rewrite one LINE's listener calls, right to left, given that line's own text and the
   character offset the line starts at in the source. `el.addEventListener(type, fn)`
   becomes `hooks.listen(el, type, fn)` and the remove twin becomes `hooks.unlisten(...)`,
   and every other byte of the line is untouched. */
function rewriteListeners(lineNo, text, base) {
  const here = LISTEN_SITES.filter((x) => x.line === lineNo);
  if (!here.length) return { text, n: 0 };
  let out = text;
  for (const x of here.slice().sort((a, b) => b.callStart - a.callStart)) {
    const obj = src.slice(x.objStart, x.objEnd);
    const a = x.callStart - base, b = x.argsStart - base;
    const head = HOOKS + "." + (x.prop === "addEventListener" ? "listen" : "unlisten") + "(" + obj + ", ";
    if (out.slice(a, b).indexOf("." + x.prop + "(") < 0) {
      fail(FILE + ":" + lineNo + ": the listener site the parser found is not where the " +
        "line holds it: " + JSON.stringify(out.slice(a, b)));
    }
    out = out.slice(0, a) + head + out.slice(b);
  }
  return { text: out, n: here.length };
}

/* ---- the three rules ------------------------------------------------------------------ */
const STOPS = [];
function rewriteOf(r) {
  const name = RENAME[r.name] ? RENAME[r.name].to : r.name;
  if (r.kind === "read") return FACADE + "." + name + "()";
  if (r.kind === "call") return (PURE_READ_CALLS.has(r.name) ? FACADE : HOOKS) + "." + name;
  return null;      /* write or update: not this instrument's to invent */
}

/* ---- group by line and build the replacement text ------------------------------------- */
for (const h of HAND) h.lines = locateHand(h);
function handAt(line) { for (const h of HAND) if (line >= h.lines[0] && line <= h.lines[1]) return h; return null; }
/* THE STOP LIST IS TAKEN FIRST AND INDEPENDENTLY OF THE HAND TABLE, so that "covered" is a
   measurement and not a tautology: every released line that ASSIGNS a sealed binding is
   recorded here whether or not a hand row happens to own it, and the coverage line below
   compares the two lists. */
const allByLine = new Map();
for (const r of refs) {
  if (r.already) continue;                        /* the table already declares this line */
  if (!allByLine.has(r.line)) allByLine.set(r.line, []);
  allByLine.get(r.line).push(r);
}
for (const [line, rs] of allByLine) {
  const writes = rs.filter((r) => r.kind === "write" || r.kind === "update");
  if (!writes.length) continue;
  STOPS.push({ line, region: (regionAt(line) || {}).id || "RELEASED-body",
    names: writes.map((w) => w.name), text: lines[line - 1] });
}
STOPS.sort((a, b) => a.line - b.line);
const byLine = new Map();
for (const [line, rs] of allByLine) {
  if (handAt(line)) continue;                     /* a hand-designed row owns this line */
  byLine.set(line, rs);
}
/* E.6: a released line whose ONLY change is a listener still needs a row. Hand rows own
   their own listener rewrites (they are authored text and a reader reads them whole). */
for (const x of LISTEN_SITES) {
  if (handAt(x.line)) continue;
  if (declaredAt(x.line)) continue;
  if (!byLine.has(x.line)) byLine.set(x.line, []);
}

const rows = [];
const lineOffset = [];
{ let off = 0; for (const l of lines) { lineOffset.push(off); off += l.length + 1; } }

for (const [line, rs] of [...byLine.entries()].sort((a, b) => a[0] - b[0])) {
  /* S-R17 (g). A line that ASSIGNS a sealed binding DECIDES WHAT IS STORED or what is
     re-read, and B.5 designs a named callback for each. A generator that guessed one would
     be inventing a durable writer, which is the one thing a pure move may not do, so such
     a line is left alone here and reported. */
  if (rs.some((r) => r.kind === "write" || r.kind === "update")) continue;
  const base = lineOffset[line - 1];
  /* ONE right-to-left pass over BOTH kinds of edit, so an earlier rewrite can never move a
     later one's offsets: the crossing rewrites (a name becomes a facade getter or a hook)
     and E.6's listener rewrites are merged into one list first and applied together. */
  const edits = [];
  for (const r of rs) {
    const to = rewriteOf(r);
    if (to === null) continue;
    edits.push({ start: r.start - base, end: r.end - base, text: to, want: r.name });
  }
  let listeners = 0;
  for (const x of LISTEN_SITES) {
    if (x.line !== line) continue;
    listeners += 1;
    edits.push({ start: x.callStart - base, end: x.argsStart - base,
      text: HOOKS + "." + (x.prop === "addEventListener" ? "listen" : "unlisten") + "(" +
        src.slice(x.objStart, x.objEnd) + ", ", want: null, listener: x.prop });
  }
  let out = lines[line - 1];
  for (const e of edits.sort((a, b) => b.start - a.start)) {
    if (e.want !== null && out.slice(e.start, e.end) !== e.want) {
      fail(FILE + ":" + line + ": the scope analysis puts " + JSON.stringify(e.want) +
        " at columns " + e.start + "-" + e.end + " and the line holds " +
        JSON.stringify(out.slice(e.start, e.end)) +
        ". The generator will not rewrite a position it cannot see.");
    }
    if (e.want === null && out.slice(e.start, e.end).indexOf("." + e.listener + "(") < 0) {
      fail(FILE + ":" + line + ": the listener site the parser found is not where the line " +
        "holds it: " + JSON.stringify(out.slice(e.start, e.end)));
    }
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
  }
  rows.push({ line, from: lines[line - 1], to: out, listeners,
    names: [...new Set(rs.map((r) => r.name))],
    kinds: [...new Set(rs.map((r) => r.kind))],
    region: (regionAt(line) || {}).id || null });
}

/* ---- the rows, as content-anchored `replace` regions ----------------------------------- */
function anchorFor(n) {
  const text = lines[n - 1];
  let nth = 0, total = 0;
  for (let i = 0; i < n; i += 1) if (lines[i] === text) nth += 1;
  for (const l of lines) if (l === text) total += 1;
  return { text, nth, total };
}
/* The LAST anchor of a multi-line hand row is counted FORWARD FROM THE FIRST, which is what
   makes a bare closing brace usable (S-R20, and the same rule gen-regions.cjs uses). */
function lastAnchorFrom(a, b) {
  const text = lines[b - 1];
  let nthFrom = 0;
  for (let i = a - 1; i < b; i += 1) if (lines[i] === text) nthFrom += 1;
  return { text, nthFrom };
}
const out = [];
let ambiguous = 0;
/* The hand rows go in FIRST, in source order, so a reviewer reading regions.json meets the
   thirteen that decide what is stored before the ninety-odd mechanical ones. */
const handRows = [];
for (const h of HAND) {
  const a = anchorFor(h.lines[0]);
  if (a.total !== 1) ambiguous += 1;
  handRows.push({
    id: "TA-W" + String(handRows.length + 1).padStart(2, "0"),
    kind: "replace", dest: null,
    note: "part 2 HAND-DESIGNED interface row (spec B.5, RELEASED ASSIGNS A SEALED BINDING). " +
      h.why + " Each is an S-R17 (g) statement rewrite, declared here in advance.",
    tipLines: [h.lines[0], h.lines[1]],
    first: { text: a.text, nth: a.nth },
    last: lastAnchorFrom(h.lines[0], h.lines[1]),
    replacement: h.to,
  });
}
for (const r of rows) {
  const a = anchorFor(r.line);
  if (a.total !== 1) {
    /* A one-line region's first anchor IS its last anchor, so an ambiguous line must carry
       its occurrence index. resolve.cjs takes `nth`; the count is recorded so a reader can
       see which rows are not unique in the file. */
    ambiguous += 1;
  }
  /* A one-line region's first anchor IS its last anchor, so a line whose text occurs more
     than once cannot be told apart by the resolver's usual rule. The occurrence index is a
     MEASUREMENT here (the scope analysis gave the line), so the row declares it, records
     every competing occurrence by line, and acknowledges the ambiguity explicitly rather
     than letting the resolver pick silently - which is the refusal S-R20 added. */
  const others = [];
  for (let i = 0; i < lines.length; i += 1) if (lines[i] === a.text && i + 1 !== r.line) others.push(i + 1);
  const row = {
    id: "TA-I" + String(out.length + 1).padStart(3, "0"),
    kind: "replace",
    dest: null,
    note: "part 2 interface row, GENERATED by gen-interface.cjs from the scope analysis: " +
      (r.names.length ? r.names.join(", ") + " (" + r.kinds.join(", ") + ") " : "E.6 listener shim ") +
      (r.region ? "inside the seam " + r.region : "in the released body") +
      ". Rule: a read becomes " + FACADE + ".<name>(), a call becomes " + HOOKS +
      ".<name>( unless it is one of B.3's four pure reads." +
      (r.listeners ? " E.6: " + r.listeners + " listener call(s) on this line go through " +
        HOOKS + ".listen so the seal knows when a DOM event is being dispatched." : "") +
      (others.length ? " THIS LINE'S TEXT OCCURS " + (others.length + 1) + " TIMES (also at :" +
        others.join(" :") + "); the occurrence index below is the scope analysis's own, and the" +
        " other occurrence(s) hold no released reference to a sealed binding - they sit inside" +
        " a move region and go with the seal." : ""),
    tipLines: [r.line, r.line],
    first: { text: a.text, nth: a.nth },
    last: { text: a.text, nthFrom: 1 },
    replacement: [r.to],
  };
  if (others.length) { row.first.ambiguousOk = true; row.otherOccurrences = others; }
  out.push(row);
}

/* ---- the substitution rows for the paint handle ---------------------------------------- */
const subByLine = new Map();
for (const r of sealedRefs) {
  if (!subByLine.has(r.line)) subByLine.set(r.line, []);
  subByLine.get(r.line).push(r);
}
const subs = [];
const subStops = [];
for (const [line, rs] of [...subByLine.entries()].sort((a, b) => a[0] - b[0])) {
  const base = lineOffset[line - 1];
  let text = lines[line - 1];
  const ids = [];
  for (const r of rs.slice().sort((a, b) => b.start - a.start)) {
    if (r.kind === "write" || r.kind === "update") {
      /* The SEAL assigning a RELEASED binding is the other direction of B.5's hardest
         class and nothing in D.1 declares a rewrite for it. Reported, and left alone. */
      subStops.push({ line, name: r.name, region: r.region, text: lines[line - 1] });
      ids.length = 0;
      break;
    }
    const a = r.start - base, b = r.end - base;
    if (text.slice(a, b) !== r.name) {
      fail(FILE + ":" + line + ": the scope analysis puts " + JSON.stringify(r.name) +
        " at columns " + a + "-" + b + " and the line holds " + JSON.stringify(text.slice(a, b)) + ".");
    }
    text = text.slice(0, a) + PAINT[r.name].to + text.slice(b);
    ids.push(PAINT[r.name].id);
  }
  if (!ids.length) continue;
  const names = [...new Set(rs.map((r) => r.name))];
  const fam = [...new Set(rs.map((r) => PAINT[r.name].id))].sort();
  /* THE ID CARRIES NO LINE NUMBER. It is the W family plus a counter in SOURCE ORDER, so
     the row's identity is the same at both named refs - and it has to be, because the
     declared-text witness hashes [id, file, region, from, to, kind] and a witness taken at
     one ref would otherwise refuse at the other, which is the same class of defect the
     line-anchored hand table had. */
  subs.push({ id: fam.join("+") + "#" + String(subs.length + 1).padStart(2, "0"),
    file: FILE, region: rs[0].region,
    from: lines[line - 1], to: text,
    kind: [...new Set(rs.map((r) => PAINT[r.name].kind))].join(" + "),
    why: "spec B.4 / D.1 " + fam.join(", ") + ": " + names.join(", ") + " crosses SEALED -> " +
      "RELEASED and the frozen paint handle carries it. " +
      (rs.some((r) => PAINT[r.name].stop)
        ? "S-R17 (g) STATEMENT REWRITE, pre-ruled by D.1 and by DECISIONS:584."
        : "Call-target rewrite, ordinary.") });
}

/* EVERY STOP MUST BE COVERED BY A HAND ROW, or it is reported and the line is left alone.
   This is the check that keeps the two lists honest: a new assignment appearing in the
   source (a look ticket adding one) shows up here as an uncovered STOP rather than being
   silently carried into the released file. */
const uncovered = STOPS.filter((s) => !handAt(s.line));
const covered = STOPS.filter((s) => handAt(s.line));
const ALL = handRows.concat(out);

const report = {
  file: FILE, root: ROOT,
  references: refs.length,
  referencesAlreadyDeclared: refs.filter((r) => r.already).length,
  handRows: handRows.length,
  generatedRows: out.length,
  rows: ALL.length,
  ambiguousAnchors: ambiguous,
  stopsCovered: covered.length,
  stopsUncovered: uncovered,
  paintSubstitutions: subs.length,
  paintReferences: sealedRefs.length,
  paintSubstitutionStops: subStops,
};

console.log("GEN-INTERFACE over " + path.join(ROOT, TODAY, FILE));
console.log("  references to sealed bindings from released lines: " + refs.length +
  " (" + report.referencesAlreadyDeclared + " already covered by a declared replace row)");
console.log("  lines rewritten into GENERATED `replace` rows: " + out.length);
console.log("  HAND-DESIGNED `replace` rows (B.5's assignment class): " + handRows.length +
  ", covering " + covered.length + " of " + STOPS.length + " stopped lines");
for (const h of handRows) {
  console.log("    " + h.id + "  :" + String(h.tipLines[0]).padStart(4) +
    (h.tipLines[1] !== h.tipLines[0] ? "-:" + h.tipLines[1] : "      ") +
    "  " + (h.tipLines[1] - h.tipLines[0] + 1) + " line(s) -> " + h.replacement.length);
  for (const l of h.replacement) console.log("        + " + l);
}
console.log("  E.6 listener sites rewritten through " + HOOKS + ".listen / .unlisten: " +
  LISTEN_SITES.length + " (" + LISTEN_SITES.filter((x) => x.prop === "addEventListener").length +
  " add, " + LISTEN_SITES.filter((x) => x.prop === "removeEventListener").length + " remove)");
console.log("  ambiguous one-line anchors (carried by occurrence index): " + ambiguous);
console.log("  PAINT-HANDLE substitution rows (spec B.4, D.1's W families): " + subs.length +
  " lines, " + sealedRefs.length + " references");
{
  const byId = {};
  for (const r of sealedRefs) {
    const k = PAINT[r.name].id + " " + r.name;
    byId[k] = (byId[k] || 0) + 1;
  }
  for (const [k, n] of Object.entries(byId).sort()) console.log("    " + k.padEnd(24) + " " + n + " reference(s)");
}
if (subStops.length) {
  console.log("  SEALED ASSIGNS A RELEASED BINDING, no declared rewrite, REPORTED: " + subStops.length);
  for (const x of subStops) console.log("    :" + x.line + "  " + x.region + "  " + x.name);
}
if (uncovered.length) {
  console.log("  S-R17 (g) STOPS WITH NO HAND ROW, left alone and REPORTED: " + uncovered.length);
  for (const s of uncovered) {
    console.log("    :" + String(s.line).padStart(4) + "  " + String(s.region).padEnd(14) +
      "  " + s.names.join(", "));
  }
} else {
  console.log("  S-R17 (g) STOPS with no hand row: NONE. Every released assignment to a " +
    "sealed binding has a declared disposition.");
}
/* INCREMENTAL REVIEW F7. Until loop round 1 this generator PRINTED the uncovered stops and
   then wrote the whole table anyway and exited 0, so a released `foodSaving = ...` with no
   hand row produced a table that looked successfully generated and a cut that ran. An
   uncovered stop is a line that ASSIGNS A SEALED BINDING with nothing saying what becomes
   of it; a generator that cannot express it must not hand back a table as though it had.
   It refuses BEFORE any JSON reaches regions.json or stdout. */
if (uncovered.length || subStops.length) {
  console.error("REFUSED: " + uncovered.length + " released line(s) assign a sealed binding " +
    "with no hand row, and " + subStops.length + " sealed line(s) assign a released binding " +
    "with no declared rewrite. Every one of them is a durable-writer decision this generator " +
    "may not invent (S-R17 (g)). Declare a hand row for each, or stop the region. No table " +
    "was written (incremental review F7).");
  process.exit(1);
}
if (JSONOUT) fs.writeFileSync(JSONOUT, JSON.stringify({ report, rows: ALL, subs }, null, 1) + "\n");
if (WRITE) {
  const existing = (table.files[FILE] || []).filter((r) => !/^TA-[IW]/.test(r.id));
  table.files[FILE] = existing.concat(ALL);
  /* The paint-handle substitutions replace this generator's previous ones for this file
     and leave every other file's rows alone. */
  table.substitutions = (table.substitutions || []).filter((r) => r.file !== FILE).concat(subs).concat([W10]);
  fs.writeFileSync(REGIONS, JSON.stringify(table, null, 1) + "\n");
  console.log("  " + ALL.length + " rows written into " + REGIONS +
    " (any previous TA-I and TA-W rows replaced). Re-take the witness: " +
    "gen-witness.cjs at both refs and --declared.");
} else {
  console.log("  (dry run: pass --write to record the rows in regions.json)");
}
