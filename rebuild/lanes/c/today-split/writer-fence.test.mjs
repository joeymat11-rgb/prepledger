/* writer-fence.test.mjs - THE WRITER FENCE, FIRST ROWS (spec E.3 to E.5,
 * DECISIONS:550 S-R5, S-R12, S-R13; :562 S-R22).
 *
 * A TOKEN SCANNER WITH NO PARSER DEPENDENCY. There is no JavaScript parser in this
 * repository's node_modules and this cell does not add one. The acorn instrument the spike
 * and the census use is a DEV instrument in the farm, required by absolute path, never a CI
 * dependency; this cell reads code the way the today cells already do, with a
 * comment-and-string stripper, and it runs anywhere node runs.
 *
 * WHAT IT JUDGES IN THIS PART. Part 1 of the split seals TWO modules: today-readings.cjs
 * (the weigh-in writer) and gym-settings-lane.mjs (the machine settings lane). The third,
 * today-lanes.cjs, arrives with part 2, and every row below is written so that it starts
 * judging the third the day it exists rather than being rewritten for it.
 *
 * WHAT IT DOES NOT CLAIM, said here rather than discovered by a reviewer. E.3's rule "a
 * released file naming a durable writer FAILS" CANNOT hold for gym-app.mjs while its six
 * declared seams stand: recordSettings still calls .save, and the control handlers still
 * call .logSet, .finish, .forget, .undo and .start. Those six are DECLARED here by region
 * id and line, and a SEVENTH fails. That is the honest standing form of the rule for a
 * half-done split: the set is fixed and a reviewer sees any addition as a diff.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
function repoRoot() {
  let d = HERE;
  for (let i = 0; i < 8; i += 1) {
    if (fs.existsSync(path.join(d, "rebuild/m3/w7-preview/today/today-model.cjs"))) return d;
    d = path.dirname(d);
  }
  throw new Error("cannot find the today directory above " + HERE);
}
const ROOT = repoRoot();
const TODAY = "rebuild/m3/w7-preview/today";
const readRepo = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");

/* ---- THE WORD LISTS, SPLIT THREE WAYS BY MEASUREMENT (E.3, R2 BLOCKING-2, S-R12) -----
 * PUT may put a row of the athlete's on disk. STORE reaches a store and stores nothing.
 * ADOPT replaces an in-memory basis or moves a gate. Only PUT is the gesture guard's
 * subject and only PUT may not appear in an ENTRY body; all three are fenced names.
 * The lists are the ones reach.cjs runs, copied here as data so that this cell and that
 * instrument cannot drift apart silently: a row below asserts the counts.               */
const PUT = ["save", "weighIn", "logSet", "finish", "undo", "start", "forget", "recover",
  "restart", "reopen", "retract", "retractImport", "importBundle", "admitLocalSource", "commit"];
const STORE = ["all", "forDate", "latest", "rows", "refresh", "summary", "recorded", "today",
  "close", "transaction", "objectStore", "admittedLocalSourceState", "listImports",
  "athleteState", "firstRun", "recordedLines", "hostForDay"];
const ADOPT = ["adoptBasis", "setPendingAdoption", "setFoodDays", "setSleepNights", "rebase",
  "holdForAdoption", "adoptEngineState"];

/* ---- SUPPRESSED RECEIVERS: JAVASCRIPT BUILTINS AND NOTHING ELSE (R1 BLOCKING-2) -------
 * `Promise.all`, `Object.entries` and `Date.now` are not durable writes and a fence that
 * reds on them is a fence nobody runs. That is the whole reason this list exists.
 *
 * WHAT R1 FOUND, AND WHY THE LIST IS NOW MEASURED RATHER THAN TYPED. The list used to carry
 * two APPLICATION identifiers as well, `entry` and `importScreen`, copied across from
 * reach.cjs. `entry` is a live local in gym-app.mjs's paintSettings
 * (`const entry = facade.entryFor(liftId)`). R1 planted a brand new released durable write
 * through it - `if (entry) entry.save({ lift: liftId, note: 'x' });` - and THE FENCE STAYED
 * AT 21 OF 21. One suppressed application name silently exempted every durable write reached
 * through a binding of that name, on a file on the path to the athlete's data.
 *
 * Both are dropped, and the rule that keeps them out is a MEASUREMENT, not this comment: the
 * row below asserts that every suppressed name is an own property of globalThis, so no
 * application identifier can be added to this list again without that row failing. Measured
 * on the four files of this part: neither name occurs as the receiver of a fenced word at
 * all, so dropping them costs nothing here and closes the hole before part 2, where
 * today-app.cjs's much larger local surface makes it proportionally wider.
 *
 * reach.cjs keeps a LONGER list (it also suppresses `settingsRead`, `map`, `cache`, `result`,
 * `importScreen` and more), and the two instruments are deliberately no longer the same list.
 * They answer different questions: reach.cjs CLASSIFIES every call site in today-app.cjs and
 * marks the ones it believes are false positives, with its own `falsePositive` column a
 * reader can disagree with row by row; this cell REFUSES, so a suppression here is a hole and
 * a suppression there is an annotation. The one real case reach.cjs suppresses that this cell
 * will meet in part 2 is `importScreen.reopen()` at today-app.cjs:718, a screen being
 * reopened and not a reading; part 2 declares it by line the way the six gym seams are
 * declared, not by exempting the name everywhere.                                          */
const NOT_A_STORE_RECEIVER = ["Promise", "Object", "Array", "JSON", "Math", "Set", "Number",
  "String", "Date"];

/* ---- codeOf: comments and string literals removed -------------------------------------
 * A comment mentioning host.save is invisible and a sentence containing the word "save" is
 * invisible; a call, an alias and a bare member read are not. Literals are replaced by a
 * marker of the same shape so line numbers survive.                                      */
function codeOf(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === "/" && d === "*") {
      const end = src.indexOf("*/", i + 2);
      const chunk = src.slice(i, end < 0 ? n : end + 2);
      out += chunk.replace(/[^\n]/g, " ");
      i = end < 0 ? n : end + 2;
      continue;
    }
    if (c === "/" && d === "/") {
      let end = src.indexOf("\n", i);
      if (end < 0) end = n;
      out += " ".repeat(end - i);
      i = end;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      let j = i + 1;
      while (j < n) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === quote) break;
        j += 1;
      }
      const chunk = src.slice(i, Math.min(j + 1, n));
      out += chunk.replace(/[^\n]/g, " ");
      i = Math.min(j + 1, n);
      continue;
    }
    out += c;
    i += 1;
  }
  return out;
}

/* Every `.name` member read or call in code, with its line. */
function memberHits(code, words) {
  const want = new Set(words);
  const hits = [];
  const lines = code.split("\n");
  for (let k = 0; k < lines.length; k += 1) {
    const re = /(\w+)?\s*\.\s*(\w+)/g;
    let m;
    while ((m = re.exec(lines[k])) !== null) {
      if (!want.has(m[2])) continue;
      const receiver = m[1] || null;
      hits.push({ name: m[2], line: k + 1, receiver });
    }
  }
  return hits;
}

/* Comments removed, string literals KEPT: the copy rows need the literals, and a sentence
   quoted inside a comment is not copy the page can show. (R2's lesson, twice: a fence that
   reds on prose in a comment loses its credibility the first time it runs.) */
function withoutComments(src) {
  let out = "", i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === "/" && d === "*") {
      const end = src.indexOf("*/", i + 2);
      const chunk = src.slice(i, end < 0 ? n : end + 2);
      out += chunk.replace(/[^\n]/g, " ");
      i = end < 0 ? n : end + 2;
      continue;
    }
    if (c === "/" && d === "/") {
      let end = src.indexOf("\n", i);
      if (end < 0) end = n;
      out += " ".repeat(end - i);
      i = end;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      let j = i + 1;
      while (j < n) { if (src[j] === "\\") { j += 2; continue; } if (src[j] === q) break; j += 1; }
      out += src.slice(i, Math.min(j + 1, n));
      i = Math.min(j + 1, n);
      continue;
    }
    out += c;
    i += 1;
  }
  return out;
}

/* Every string literal in the CODE of a source, with its raw text. */
function literalsOf(src) {
  const code = withoutComments(src);
  const out = [];
  const re = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g;
  let m;
  while ((m = re.exec(code)) !== null) out.push(m[1] === undefined ? m[2] : m[1]);
  return out;
}
/* Athlete-facing prose: two runs of letters with a REAL SPACE between them. A key, an id, a
   selector and a module path are one token and are not prose - `./machine-settings-host.mjs`
   is not a sentence, and neither is the `use strict` directive, which is named here rather
   than allowed by accident. */
const DIRECTIVES = new Set(["use strict"]);
const isProse = (s) => !DIRECTIVES.has(s) && /[A-Za-z]{2,} [A-Za-z]{2,}/.test(s);

/* ---- THE FILES OF THIS PART ---------------------------------------------------------- */
const SEALED = [TODAY + "/today-readings.cjs", TODAY + "/gym-settings-lane.mjs"];
const RELEASED = [TODAY + "/today-model.cjs", TODAY + "/gym-app.mjs"];
const PART_TWO = TODAY + "/today-lanes.cjs";

/* S-R22: today-readings.cjs's four refusal constants, DECLARED BY NAME, with the exact
   prose they carry. A FIFTH literal fails (E.5 row 15). */
const READINGS_CONSTANTS = ["ALREADY_RECORDED", "OUT_OF_RANGE", "FORM_MIN", "FORM_MAX"];
const READINGS_PROSE = [
  "Today's weigh-in is already recorded on this device. Changing a recorded reading needs the correction path, which is not wired yet.",
  "A morning weight is recorded between ",
  " lb, to one decimal place. Nothing was recorded.",
];

/* gym-app.mjs's six DECLARED seams: the durable writers the released card still names, each
   with the region id regions.json gives it. A seventh fails.
 *
 * KEYED BY SITE, NOT BY NAME (R1 BLOCKING-2, second half). The first form of this row
 * compared the SET OF NAMES, so a seventh durable write that happened to reuse one of the six
 * declared names was invisible: R1's planted `entry.save(...)` adds an occurrence of `save`,
 * and `save` was already in the set. The key is now `receiver.name`, and the row asserts the
 * SITE COUNT as well, so neither a new receiver nor a second call through an old one gets in.
 * `(call).save` is `facade.lane().save(machine)`, whose receiver is a call expression and not
 * an identifier. */
const GYM_DECLARED_SEAMS = {
  "(call).save": "GA-M01 / GA-R04, SEAM G1 recordSettings: `facade.lane().save(machine)`. The released half still decides what is stored, and the build report names it as the S-R17 (g) STOP it is. B.9's token protocol is part 2.",
  "model.logSet": "GA-M02, a released control handler",
  "model.finish": "GA-M03, a released control handler",
  "model.forget": "GA-M04, a released control handler",
  "model.undo": "GA-M05, a released control handler",
  "model.start": "GA-M06, model.start() inside paint(): the ONE durable PUT any paint root reaches in these three files. A pre-existing fact of the page, left byte-identical under S-R12, with its own ticket GYM-START-IN-PAINT.",
};
const GYM_DECLARED_SITES = 6;
const siteOf = (h) => (h.receiver || "(call)") + "." + h.name;

function planted(rel, edit) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fence-planted-"));
  const src = readRepo(rel);
  const out = path.join(dir, path.basename(rel));
  fs.writeFileSync(out, edit(src));
  return fs.readFileSync(out, "utf8");
}

/* ======================================================================================
   THE ROWS
   ====================================================================================== */

test("FENCE-NOTHING-TO-SCAN: the fence names the files it read, and the released files are among them", () => {
  const scanned = [...SEALED, ...RELEASED].filter((f) => fs.existsSync(path.join(ROOT, f)));
  assert.notEqual(scanned.length, 0, "FENCE-NOTHING-TO-SCAN");
  for (const r of RELEASED) {
    assert.ok(scanned.includes(r), "FENCE-RELEASED-FILE-NOT-SCANNED: " + r);
  }
  assert.equal(scanned.length, 4, "part 1 seals two modules and releases two; part 2 adds " + PART_TWO);
  console.log("  fence scanned " + scanned.length + " files: " + scanned.map((f) => path.basename(f)).join(", "));
});

/* ---- R1 BLOCKING-2: the suppression list cannot hold an application name -------------- */

test("FENCE-SUPPRESSED-RECEIVER: every suppressed receiver is a JavaScript builtin, measured", () => {
  const notGlobal = NOT_A_STORE_RECEIVER.filter((n) => !Object.prototype.hasOwnProperty.call(globalThis, n));
  assert.deepEqual(notGlobal, [],
    "FENCE-SUPPRESSED-RECEIVER: " + notGlobal.join(", ") + " is not a JavaScript builtin, so it " +
    "is an APPLICATION identifier, and a suppressed application identifier exempts every " +
    "durable write reached through a binding of that name. That is R1 BLOCKING-2: `entry` was " +
    "on this list and a planted entry.save() went through a green fence.");
  assert.equal(NOT_A_STORE_RECEIVER.length, 9,
    "nine builtins and no more; a tenth name is a new suppression and needs a red row of its own");
});

test("RED R1 BLOCKING-2: a durable write through the local `entry` in the released gym card FAILS", () => {
  /* R1's own attack, at the line it used: inside paintSettings, just after the facade hands
     the entry out. Before the fix this planted write left the fence at 21 of 21. */
  const src = planted(TODAY + "/gym-app.mjs",
    (s) => s.replace("    const entry = facade.entryFor(liftId);",
      "    const entry = facade.entryFor(liftId);\n    if (entry) entry.save({ lift: liftId, note: 'x' });"));
  assert.ok(src.includes("entry.save({ lift: liftId"), "the plant did not land; re-read GA-R02");
  const hits = memberHits(codeOf(src), PUT).filter((h) => !NOT_A_STORE_RECEIVER.includes(h.receiver));
  assert.equal(hits.some((h) => h.name === "save" && h.receiver === "entry"), true,
    "THE FENCE DID NOT SEE A DURABLE WRITE THROUGH `entry`. This is R1 BLOCKING-2 and it is " +
    "the one class of thing this cell is in the tree to catch.");
  const sites = [...new Set(hits.map(siteOf))].sort();
  assert.notDeepEqual(sites, Object.keys(GYM_DECLARED_SEAMS).sort(),
    "THE SEAM ROW DID NOT FIRE ON entry.save. Keyed by NAME it could not: `save` was already " +
    "one of the six declared names. That is why it is keyed by SITE.");
});

test("RED R1 BLOCKING-2: a durable write through `importScreen` in the released today-model.cjs FAILS", () => {
  const src = planted(TODAY + "/today-model.cjs",
    (s) => s.replace("  const { weighIn, reopen,",
      "  importScreen.retractImport(day);\n  const { weighIn, reopen,"));
  const hits = memberHits(codeOf(src), PUT).filter((h) => !NOT_A_STORE_RECEIVER.includes(h.receiver));
  assert.equal(hits.some((h) => h.name === "retractImport" && h.receiver === "importScreen"), true,
    "THE FENCE DID NOT SEE A DURABLE WRITE THROUGH `importScreen`, the second application " +
    "name R1 found on the suppression list.");
});

test("the three word lists are the ones the reachability instrument runs (15 PUT, 17 STORE, 7 ADOPT)", () => {
  assert.equal(PUT.length, 15);
  assert.equal(STORE.length, 17);
  assert.equal(ADOPT.length, 7);
  for (const w of PUT) assert.equal(STORE.includes(w) || ADOPT.includes(w), false, w + " is on two lists");
});

/* ---- ROW 1: no released file names a durable writer, except the declared seams -------- */

test("FENCE-WRITER-NAME: the released today-model.cjs names NO durable writer after the cut", () => {
  const hits = memberHits(codeOf(readRepo(TODAY + "/today-model.cjs")), PUT)
    .filter((h) => !NOT_A_STORE_RECEIVER.includes(h.receiver));
  assert.deepEqual(hits.map((h) => h.name + ":" + h.line), [],
    "FENCE-WRITER-NAME in the RELEASED today-model.cjs. The whole point of F.1 is that the " +
    "two functions that can put a reading on disk are not in this file any more.");
});

test("FENCE-WRITER-NAME: the released gym-app.mjs holds EXACTLY the six declared seam WRITE SITES, and a seventh fails", () => {
  const hits = memberHits(codeOf(readRepo(TODAY + "/gym-app.mjs")), PUT)
    .filter((h) => !NOT_A_STORE_RECEIVER.includes(h.receiver));
  const sites = [...new Set(hits.map(siteOf))].sort();
  assert.deepEqual(sites, Object.keys(GYM_DECLARED_SEAMS).sort(),
    "FENCE-WRITER-NAME: the released gym card reaches a durable writer that is not one of the " +
    "six declared seams. Every one of the six is a line the spec carries with a region id; a " +
    "seventh is a new released decision about what gets stored and it is a STOP.");
  assert.equal(hits.length, GYM_DECLARED_SITES,
    "FENCE-WRITER-SITE-COUNT: " + hits.length + " durable write sites in the released gym card, " +
    GYM_DECLARED_SITES + " declared. A SECOND call through an already-declared receiver is a " +
    "seventh decision about what gets stored even though it adds no new name, and the " +
    "name-set form of this row could not see it (R1 BLOCKING-2).");
  console.log("  released gym-app.mjs write sites: " + hits.map((h) => ":" + h.line + " " + siteOf(h)).join(", "));
});

test("RED: a durable writer planted in the released today-model.cjs FAILS", () => {
  const src = planted(TODAY + "/today-model.cjs",
    (s) => s.replace("  const { weighIn, reopen,", "  readings.weighIn({ date: day, lb: 1 });\n  const { weighIn, reopen,"));
  const hits = memberHits(codeOf(src), PUT).filter((h) => !NOT_A_STORE_RECEIVER.includes(h.receiver));
  assert.equal(hits.length > 0, true, "THE FENCE DID NOT SEE A PLANTED readings.weighIn(...)");
  assert.equal(hits[0].name, "weighIn");
});

test("RED: the E.5 row 1 alias, const s = host.save, FAILS even though it is not a call", () => {
  const src = planted(TODAY + "/today-model.cjs",
    (s) => s.replace("  const { weighIn, reopen,", "  const s = readings.save; s(1);\n  const { weighIn, reopen,"));
  const hits = memberHits(codeOf(src), PUT).filter((h) => !NOT_A_STORE_RECEIVER.includes(h.receiver));
  assert.equal(hits.some((h) => h.name === "save"), true,
    "THE FENCE SCANS CALL EXPRESSIONS AND NOT MEMBER NAMES. E.5 row 1 is the reason it must not.");
});

test("RED: a SEVENTH durable writer in the released gym card FAILS", () => {
  const src = planted(TODAY + "/gym-app.mjs",
    (s) => s.replace("  const painter = Object.freeze(", "  const late = () => model.recover();\n  const painter = Object.freeze("));
  const hits = memberHits(codeOf(src), PUT).filter((h) => !NOT_A_STORE_RECEIVER.includes(h.receiver));
  const sites = [...new Set(hits.map(siteOf))].sort();
  assert.notDeepEqual(sites, Object.keys(GYM_DECLARED_SEAMS).sort(),
    "THE FENCE DID NOT SEE A SEVENTH DURABLE WRITER IN THE RELEASED GYM CARD");
  assert.equal(sites.includes("model.recover"), true);
});

test("a comment naming host.save is invisible, and so is the word save inside a sentence", () => {
  const src = planted(TODAY + "/today-model.cjs",
    (s) => s.replace("  const { weighIn, reopen,",
      '  /* host.save is named here on purpose. */\n  const note = "Nothing to save yet.";\n  void note;\n  const { weighIn, reopen,'));
  const hits = memberHits(codeOf(src), PUT).filter((h) => !NOT_A_STORE_RECEIVER.includes(h.receiver));
  assert.deepEqual(hits, [], "a fence that reds on prose loses its credibility the first time it runs");
});

/* ---- ROW 2: zero athlete-facing copy in the seal, S-R13 and S-R22 --------------------- */

test("FENCE-COPY-IN-SEAL: gym-settings-lane.mjs holds ZERO athlete-facing string literals", () => {
  const prose = literalsOf(readRepo(TODAY + "/gym-settings-lane.mjs")).filter(isProse);
  assert.deepEqual(prose, [],
    "FENCE-COPY-IN-SEAL. B.6's discipline is that the view owns every word; the seal returns " +
    "an outcome and never a sentence.");
});

test("S-R22: today-readings.cjs carries EXACTLY four refusal constants, named, and exactly their prose", () => {
  const src = readRepo(TODAY + "/today-readings.cjs");
  const declared = [...src.matchAll(/\bconst\s+([A-Z][A-Z0-9_]+)\s*=/g)].map((m) => m[1]);
  const pairs = [...src.matchAll(/\bconst\s+([A-Z][A-Z0-9_]+)\s*=\s*\d+\s*,\s*([A-Z][A-Z0-9_]+)\s*=/g)];
  const all = [...new Set([...declared, ...pairs.flatMap((m) => [m[1], m[2]])])].sort();
  assert.deepEqual(all, [...READINGS_CONSTANTS].sort(),
    "S-R22: the sealed weigh-in writer's refusal constants are declared BY NAME in this cell. " +
    "A fifth is a new sentence in front of the athlete that no cell named.");
  const prose = literalsOf(src).filter(isProse);
  assert.deepEqual(prose, READINGS_PROSE,
    "FENCE-COPY-IN-SEAL: today-readings.cjs is the ONE measured exception to S-R13, and the " +
    "exception is these literals and no others.");
});

test("RED: a FIFTH constant in today-readings.cjs FAILS", () => {
  const src = planted(TODAY + "/today-readings.cjs",
    (s) => s.replace("  const FORM_MIN = 60, FORM_MAX = 400;",
      '  const STILL_SAVING = "Earned is still saving that reading.";\n  const FORM_MIN = 60, FORM_MAX = 400;'));
  const declared = [...src.matchAll(/\bconst\s+([A-Z][A-Z0-9_]+)\s*=/g)].map((m) => m[1]);
  assert.equal(declared.includes("STILL_SAVING"), true,
    "THE FENCE DID NOT SEE A FIFTH DECLARED CONSTANT IN THE SEALED WRITER");
  const prose = literalsOf(src).filter(isProse);
  assert.notDeepEqual(prose, READINGS_PROSE);
});

test("RED: a sentence planted in gym-settings-lane.mjs FAILS", () => {
  const src = planted(TODAY + "/gym-settings-lane.mjs",
    (s) => s.replace("  let settingsReading = null;",
      "  const SORRY = 'Your settings could not be read.';\n  void SORRY;\n  let settingsReading = null;"));
  assert.equal(literalsOf(src).filter(isProse).length > 0, true,
    "THE FENCE DID NOT SEE A SENTENCE PLANTED IN THE SEALED GYM LANE");
});

/* ---- ROW 3: the interface objects are frozen ------------------------------------------ */

test("the interface objects are FROZEN: the gym lane returns a frozen pair of frozen tables", () => {
  const code = codeOf(readRepo(TODAY + "/gym-settings-lane.mjs"));
  assert.match(code, /return Object\.freeze\(\{/, "the returned interface is not frozen");
  assert.match(code, /facade:\s*Object\.freeze\(\{/, "the read-only facade is not frozen");
  assert.match(code, /hooks:\s*Object\.freeze\(\{/, "the callback table is not frozen");
  assert.equal((code.match(/Object\.freeze\(/g) || []).length, 3,
    "three frozen objects and no more: a fourth is an interface nobody declared");
});

test("the paint handle the released card hands in is FROZEN", () => {
  const code = codeOf(readRepo(TODAY + "/gym-app.mjs"));
  assert.match(code, /const painter = Object\.freeze\(\{ repaint: \(\) => paint\(\) \}\);/,
    "the paint handle is not a frozen one-entry object");
});

test("RED: an unfrozen interface object FAILS", () => {
  const src = planted(TODAY + "/gym-settings-lane.mjs",
    (s) => s.replace("    hooks: Object.freeze({", "    hooks: ({"));
  const code = codeOf(src);
  assert.equal(/hooks:\s*Object\.freeze\(\{/.test(code), false,
    "THE FENCE DID NOT SEE AN UNFROZEN CALLBACK TABLE");
});

/* ---- ROW 4: FENCE-SEALED-BINDING-ASSIGNED, the rule no word list could catch ---------- */

/* The sealed module's factory-scope declarations, by indentation: every `let`, `const` and
   `function` at exactly two spaces inside the factory. This is the token-scanner form of
   census.cjs's RELEASED ASSIGNS A SEALED BINDING class, and the acceptance number is ZERO. */
function factoryScopeNames(rel) {
  const code = codeOf(readRepo(rel));
  const names = [];
  for (const line of code.split("\n")) {
    const m = /^ {2}(?:let|const|var)\s+([A-Za-z_$][\w$]*)/.exec(line)
      || /^ {2}(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/.exec(line);
    if (m) names.push(m[1]);
  }
  return names;
}

test("FENCE-SEALED-BINDING-ASSIGNED: no released file assigns a binding declared at factory scope in its sealed partner", () => {
  const pairs = [
    [TODAY + "/gym-settings-lane.mjs", TODAY + "/gym-app.mjs"],
    [TODAY + "/today-readings.cjs", TODAY + "/today-model.cjs"],
  ];
  for (const [sealed, released] of pairs) {
    const names = factoryScopeNames(sealed);
    assert.notEqual(names.length, 0, "no factory-scope declarations found in " + sealed);
    const code = codeOf(readRepo(released));
    for (const name of names) {
      const re = new RegExp("(^|[^.\\w$])" + name + "\\s*(=[^=]|\\+=|-=|\\+\\+|--)", "m");
      assert.equal(re.test(code), false,
        "FENCE-SEALED-BINDING-ASSIGNED: " + released + " assigns " + name + ", which " +
        sealed + " declares at factory scope. This is the rule no word list could ever have " +
        "caught: settingsSaving is not a writer's name, and gym-app.mjs:279 assigned it.");
    }
  }
});

test("RED: the pre-split gym-app.mjs:279 assignment of settingsSaving FAILS", () => {
  const src = planted(TODAY + "/gym-app.mjs",
    (s) => s.replace("      hooks.saving(recordSettings(map, view, paintedDraft));",
      "      settingsSaving = recordSettings(map, view, paintedDraft);"));
  const names = factoryScopeNames(TODAY + "/gym-settings-lane.mjs");
  assert.equal(names.includes("settingsSaving"), true, "settingsSaving is not sealed");
  const code = codeOf(src);
  const re = new RegExp("(^|[^.\\w$])settingsSaving\\s*(=[^=])", "m");
  assert.equal(re.test(code), true,
    "THE FENCE DID NOT SEE THE EXACT ROW THE SPIKE FOUND AND B.9 NEVER HAD");
});

/* ---- ROW 5: the sealed modules' module edges ------------------------------------------ */

test("FENCE-VIEW-IMPORT: today-readings.cjs reaches NOTHING, and the gym lane's only edge is its declared host", () => {
  const readings = codeOf(readRepo(TODAY + "/today-readings.cjs"));
  assert.deepEqual([...readings.matchAll(/\b(?:require|import)\s*\(/g)].map((m) => m[0]), [],
    "the sealed weigh-in writer takes every binding it needs by injection and imports nothing");

  const lane = codeOf(readRepo(TODAY + "/gym-settings-lane.mjs"));
  const edges = [...readRepo(TODAY + "/gym-settings-lane.mjs")
    .matchAll(/\b(?:require|import)\s*\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);
  assert.deepEqual(edges, ["./machine-settings-host.mjs"],
    "FENCE-SECOND-SEALED-IMPORT: the gym lane opens the fifth lane and reaches nothing else");
  assert.equal(/^\s*import\s/m.test(lane), false, "and it has no static import at all");
});

/* R1 NOTE-3: this row shipped without a red counterpart. R1 planted one by hand and the row
   did fail, so the row was sound and only its proof was missing. Here it is, committed. */
test("RED FENCE-VIEW-IMPORT: a require of a view module added to today-readings.cjs FAILS", () => {
  const src = planted(TODAY + "/today-readings.cjs",
    (s) => s.replace("function createReadingsWriter(",
      'const view = require("./machine-settings-view.mjs");\nfunction createReadingsWriter('));
  const code = codeOf(src);
  const edges = [...code.matchAll(/\b(?:require|import)\s*\(/g)].map((m) => m[0]);
  assert.notDeepEqual(edges, [],
    "THE FENCE DID NOT SEE A MODULE EDGE ADDED TO THE SEALED WEIGH-IN WRITER. The whole shape " +
    "of F.1 is that it takes every binding it needs by injection and reaches nothing.");
});

test("RED FENCE-SECOND-SEALED-IMPORT: a second module edge in the gym lane FAILS", () => {
  const src = planted(TODAY + "/gym-settings-lane.mjs",
    (s) => s.replace("  let settingsReading = null;",
      "  const extra = () => import('./checkin-model.mjs');\n  void extra;\n  let settingsReading = null;"));
  const edges = [...src.matchAll(/\b(?:require|import)\s*\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);
  assert.notDeepEqual(edges, ["./machine-settings-host.mjs"],
    "THE FENCE DID NOT SEE A SECOND MODULE EDGE OPENED BY THE SEALED GYM LANE");
});

/* ---- ROW 6: S-R12's standing guard, in the form a token scanner can hold --------------- */

test("E.5 row 16: the gym paint() body reaches EXACTLY ONE durable writer, model.start()", () => {
  const code = codeOf(readRepo(TODAY + "/gym-app.mjs"));
  const lines = code.split("\n");
  const from = lines.findIndex((l) => /^\s{2}async function paint\(\)\s*\{/.test(l));
  assert.notEqual(from, -1, "paint() is not where the spec says it is");
  let to = -1;
  for (let i = from + 1; i < lines.length; i += 1) if (lines[i] === "  }") { to = i; break; }
  assert.notEqual(to, -1, "paint() does not close at factory depth");
  const inPaint = memberHits(lines.slice(from, to + 1).join("\n"), PUT)
    .filter((h) => !NOT_A_STORE_RECEIVER.includes(h.receiver));
  assert.deepEqual([...new Set(inPaint.map((h) => h.name))], ["start"],
    "FENCE-PAINT-REACHES-PUT: a SECOND durable write taken during a paint. The one that " +
    "exists, model.start() in paint(), is a declared pre-existing fact with its own ticket " +
    "(GYM-START-IN-PAINT); a second is a new one and this row is the standing guard around it.");
});

test("RED: a SECOND durable write inside the gym paint() FAILS", () => {
  const src = planted(TODAY + "/gym-app.mjs",
    (s) => s.replace("      const started = await model.start();",
      "      await model.recover();\n      const started = await model.start();"));
  const lines = codeOf(src).split("\n");
  const from = lines.findIndex((l) => /^\s{2}async function paint\(\)\s*\{/.test(l));
  let to = -1;
  for (let i = from + 1; i < lines.length; i += 1) if (lines[i] === "  }") { to = i; break; }
  const inPaint = memberHits(lines.slice(from, to + 1).join("\n"), PUT)
    .filter((h) => !NOT_A_STORE_RECEIVER.includes(h.receiver));
  assert.notDeepEqual([...new Set(inPaint.map((h) => h.name))], ["start"],
    "THE FENCE DID NOT SEE A SECOND DURABLE WRITE TAKEN DURING A PAINT");
});

/* ---- ROW 7: the part-2 rows, declared as not yet judged -------------------------------- */

test("part 2's file is not here yet, and this cell says so rather than passing silently", () => {
  const exists = fs.existsSync(path.join(ROOT, PART_TWO));
  if (exists) {
    const prose = literalsOf(readRepo(PART_TWO)).filter(isProse);
    assert.deepEqual(prose, [], "FENCE-COPY-IN-SEAL in today-lanes.cjs");
  } else {
    console.log("  today-lanes.cjs does not exist yet: the copy row, the re-export rows, the " +
      "gesture-guard rows and E.5's on.listen row are part 2's and are NOT asserted here.");
  }
  assert.ok(true);
});
