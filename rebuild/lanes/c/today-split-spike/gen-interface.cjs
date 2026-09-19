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

/* DECLARED RENAMES: a name whose interface spelling is not its source spelling. Each row
   names the spec section that rules it. The list is EMPTY of anything the spec does not
   rule; an unruled rename would be a silent behaviour change inside a pure move. */
const RENAME = {
  /* spec B.6: the released half stops reading a composed SENTENCE and starts reading an
     OUTCOME. This is the one rename in the file and it is the whole of B.6's call site. */
  sleepErrorText: { to: "sleepOutcome", why: "spec B.6: the writer returns an outcome and the view owns every word" },
};

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
  { why: "B.5 TA-M01: the released route stops owning the measure screen cache. The seal mints it and keeps it; the released half keeps its own `Screen` import and its token guard.",
    from: ["    if (!measureScreen) measureScreen = Screen.createMeasureScreen(measureDeps());"],
    to: ["    hooks.mintMeasureScreen(Screen);"] },
  { why: "B.5 TA-M02: the import screen twin. R2 BLOCKING-8's finding is that :718-:719 go with it, and they do: gen-interface rewrites both through the facade.",
    from: ["    if (!importScreen) importScreen = Screen.createImportScreen(importDeps());"],
    to: ["    hooks.mintImportScreen(Screen);"] },
  { why: "B.5 RELEASED body: the retry click handed the in-flight promise to a released binding. The seal mints and assigns it; the released half keeps the listener and the guard.",
    from: ['      if (foodReadBack) retry.addEventListener("click", () => { foodSaving = retryFoodRead(); });'],
    to: ['      if (facade.foodReadBack()) retry.addEventListener("click", () => { hooks.retryFoodRead(); });'] },
  { why: "B.5 RELEASED body: the food save click. The DOM arguments are UNCHANGED, because changing recordIntake's signature would rewrite a moved region and that is an undeclared statement rewrite (S-R17 (g)); B.3's `no entry takes a DOM node` is therefore NOT met by this part and is reported as a STOP.",
    from: ['    save.addEventListener("click", () => { foodSaving = recordIntake(save, cal, pro, error); });'],
    to: ['    save.addEventListener("click", () => { hooks.recordIntake(save, cal, pro, error); });'] },
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
    to: ['      retry.addEventListener("click", () => { hooks.retrySleepRead(); });'] },
  { why: "B.5 RELEASED body: sleepCorrecting = true is a sealed flag. hooks.sleepCorrect(flag) takes it; the repaint stays released, which is where the router lives.",
    from: ['      change.addEventListener("click", () => { sleepCorrecting = true; render("sleep", false); });'],
    to: ['      change.addEventListener("click", () => { hooks.sleepCorrect(true); render("sleep", false); });'] },
  { why: "B.5 RELEASED body: the cancel path, the same flag the other way. clearSleepDraft and render are RELEASED and stay released: the draft is the screen's own transient state (the file says so at :475).",
    from: ['        sleepCorrecting = false; clearSleepDraft(); render("sleep", false);'],
    to: ['        hooks.sleepCorrect(false); clearSleepDraft(); render("sleep", false);'] },
  { why: "B.5 RELEASED body: the sleep save click, the one gesture that writes a night. Same DOM-argument qualification as the food save.",
    from: ['    save.addEventListener("click", () => { sleepSaving = recordSleep(map); });'],
    to: ['    save.addEventListener("click", () => { hooks.recordSleep(map); });'] },
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
  let out = lines[line - 1];
  /* Right to left, so an earlier replacement cannot move a later one's offsets. */
  for (const r of rs.slice().sort((a, b) => b.start - a.start)) {
    const to = rewriteOf(r);
    if (to === null) continue;
    const a = r.start - base, b = r.end - base;
    if (out.slice(a, b) !== r.name) {
      fail(FILE + ":" + line + ": the scope analysis puts " + JSON.stringify(r.name) +
        " at columns " + a + "-" + b + " and the line holds " + JSON.stringify(out.slice(a, b)) +
        ". The generator will not rewrite a position it cannot see.");
    }
    out = out.slice(0, a) + to + out.slice(b);
  }
  rows.push({ line, from: lines[line - 1], to: out,
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
      r.names.join(", ") + " (" + r.kinds.join(", ") + ") " +
      (r.region ? "inside the seam " + r.region : "in the released body") +
      ". Rule: a read becomes " + FACADE + ".<name>(), a call becomes " + HOOKS +
      ".<name>( unless it is one of B.3's four pure reads." +
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
};
if (JSONOUT) fs.writeFileSync(JSONOUT, JSON.stringify({ report, rows: ALL }, null, 1) + "\n");

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
console.log("  ambiguous one-line anchors (carried by occurrence index): " + ambiguous);
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
if (WRITE) {
  const existing = (table.files[FILE] || []).filter((r) => !/^TA-[IW]/.test(r.id));
  table.files[FILE] = existing.concat(ALL);
  fs.writeFileSync(REGIONS, JSON.stringify(table, null, 1) + "\n");
  console.log("  " + ALL.length + " rows written into " + REGIONS +
    " (any previous TA-I and TA-W rows replaced). Re-take the witness: " +
    "gen-witness.cjs at both refs and --declared.");
} else {
  console.log("  (dry run: pass --write to record the rows in regions.json)");
}
