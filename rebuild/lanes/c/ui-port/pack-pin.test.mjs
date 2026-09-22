/* PACK-PIN (S9 hunk H19; S9-RELEASE-SPEC.md C.5.1, PM-R6'(i)) - the WHOLE owner-approved
   design pack pinned by a literal, sorted (path, sha256) list read from the WORKING TREE.

   WHY THIS CELL EXISTS. After S9 the acceptance of every lane C look ticket IS the design
   gates being green (DECISIONS:536 (4)). A gate that judges a ticket must not be editable
   by the ticket it judges, so the gate code under quality/, its per-platform screen
   baselines and its state records are INSIDE this pin, not outside it. Today nothing in
   the tree notices a pack file moving: design.test.cjs:15-:20 compares each approved file
   to a constant in design.cjs and both sides are unsealed, and rebuild/m1/ appears nowhere
   in the S8 sealed inventory.

   WHAT IT READS. The working tree at run time, which on a GitHub runner is the
   actions/checkout tree of the branch being pushed. Never an object at a fixed commit: at
   a fixed commit the value can never change, the red rows below are unreachable by
   construction, and the commit the pack was measured at sits on an unmerged lane branch a
   runner does not fetch (R3 BLOCKING-F).

   WHAT IT HOLDS. The full list, one line per file, and not one composite sha256 over the
   whole serialisation. Holding the list is what lets a refusal NAME THE PATH (R3 N5).

   BOTH OPERATING SYSTEMS, as a requirement and not an aspiration (R4 N1.1, ADOPTED).
   Every path this cell emits or compares is pack-root-relative with FORWARD SLASHES on
   every OS, and every sort is by path BYTES (Buffer.compare), never the default string
   sort. The literal is generated from git, which spells paths with forward slashes; a walk
   that handed back the platform separator would mismatch every line on windows-latest.

   LINKS ARE NOT FOLLOWED (R4 N1.2, ADOPTED). Every entry is lstat'ed. Anything that is
   neither a regular file nor a plain directory refuses PACK-PIN NOT-A-REGULAR-FILE <path>,
   and is neither read nor descended into. That closes the one green-while-changed R4
   found: a tracked pack file replaced by a link to a copy of the same bytes reads green
   under readFileSync, which follows links, while git cat-file blob does not.

   AN UNREADABLE FILE IS THE SEVENTH REFUSAL (the PM's ruling on the author's Q2, taken in
   round 3 because from S9 the vocabulary is sealed bytes and a later addition costs a
   reseal child). R1 N3 measured the hole on the PC with a DENY ACE: readFileSync THREW, so
   the cell went loudly red with a message that was none of its refusals and the walk
   stopped before every later path. Now the walk refuses PACK-PIN UNREADABLE <path> AND
   CONTINUES, so a second defect further down is still named in the same run.

   TWO RESIDUALS THIS CELL DOES NOT CLOSE, NAMED HERE SO THEY ARE NOT DISCOVERED LATER.
   (a) A file inside a __pycache__ DIRECTORY inside the pack is invisible to this pin by
   construction, and python will import it if sys.path reaches it. A row below records that
   as a decision. Closing it would mean un-ignoring the caches a design machine really does
   leave behind, which is the worse trade. (b) An unreadable DIRECTORY still throws out of
   readdirSync: that is the LOUD RED the file case used to be, it is never a silent green,
   and closing it would mean a second optional reader for directories. Both are in the
   integrator list of S9-PREP-PACK-AUTHOR-REPORT.md.

   THE LITERAL IS EMPTY ON THIS BRANCH AND THE PACK IS NOT IN THIS CHECKOUT.
   rebuild/m1/approved-2026-09-18/ lives on the design lane's branches and has not merged,
   so the REAL ROW at the bottom FAILS BY NAME today. That is the point of it: it never
   skips and it never passes vacuously. Which of the two refusals it prints is measured in
   S9-PREP-PACK-AUTHOR-REPORT.md and stated at the row.

   On a case-sensitive system a case-only rename is already MISSING by lstat; the exact-spelling clause is held by rows on Windows only.

   Empty directories, hard links and NTFS streams are outside Git's byte inventory and C.5.1.

   NO OWNER DATA. Every fixture below is built by this file in a mkdtemp folder out of
   bytes it writes itself, and removed again. It reads no measurement of any kind. */

import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const conditionIsNotCancelled = (cond) =>
  /^\s*if:\s*\$\{\{\s*!cancelled\(\)\s*\}\}\s*$/.test(cond);

function assertConditionedRun(yml, file, label) {
  const owners = [];
  for (let nameAt = 0; nameAt < yml.length; nameAt += 1) {
    const named = /^(\s*)-\s+name:/.exec(yml[nameAt]);
    if (!named) continue;
    const stepIndent = named[1].length;
    let end = nameAt + 1;
    while (end < yml.length && (!yml[end].trim()
      || /^\s*/.exec(yml[end])[0].length > stepIndent)) end += 1;
    const block = yml.slice(nameAt, end);
    for (const line of block) {
      const run = /^(\s*)run:\s*node\s+--test\s+(.+?)\s*$/.exec(line);
      if (!run || run[1].length !== stepIndent + 2) continue;
      const files = run[2].split(/\s+/);
      if (files.includes(file)) owners.push({ block, runIndent: run[1].length, line });
    }
  }
  assert.equal(owners.length, 1, "expected exactly one node --test step for " + file);
  const { block, runIndent, line } = owners[0];
  assert.equal(/[*?]/.test(line), false,
    "the step globs instead of naming its files: " + line.trim());
  const continueKeys = block.filter((entry) => {
    const match = /^(\s*)continue-on-error\s*:/.exec(entry);
    return match && match[1].length === runIndent;
  });
  assert.equal(continueKeys.length, 0,
    "STEP-CONTINUE-ON-ERROR-FORBIDDEN " + label + ": "
    + continueKeys.map((entry) => entry.trim()).join(" / "));
  const conditions = block.filter((entry) => {
    const match = /^(\s*)if:/.exec(entry);
    return match && match[1].length === runIndent;
  });
  assert.equal(conditions.length, 1,
    label + " must carry exactly one step-level `if:`: "
    + block.map((entry) => entry.trim()).join(" / "));
  assert.equal(conditionIsNotCancelled(conditions[0]), true,
    "the condition is not `not cancelled`: " + conditions[0].trim());
}

function decoyWorkflows(file) {
  const run = "        run: node --test " + file;
  return {
    control: ["      - name: target", "        if: ${{ !cancelled() }}", run],
    grouped: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        run: node --test synthetic-control.test.mjs " + file],
    siblingContinue: ["      - name: sibling", "        continue-on-error: true",
      "        run: echo sibling", "      - name: target", "        if: ${{ !cancelled() }}", run],
    nestedContinue: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        env:", "          continue-on-error: true", "        with:",
      "          continue-on-error: false", run],
    continueTrue: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        continue-on-error: true", run],
    continueFalse: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        continue-on-error: false", run],
    quotedDoubleTrue: ["      - name: target", "        if: ${{ !cancelled() }}",
      '        "continue-on-error": true', run],
    quotedDoubleFalse: ["      - name: target", "        if: ${{ !cancelled() }}",
      '        "continue-on-error": false', run],
    quotedSingleTrue: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        'continue-on-error': true", run],
    quotedSingleFalse: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        'continue-on-error': false", run],
    quotedIf: ["      - name: target", '        "if": ${{ !cancelled() }}', run],
    quotedSiblingContinue: ["      - name: sibling", '        "continue-on-error": true',
      "        run: echo sibling", "      - name: target", "        if: ${{ !cancelled() }}", run],
    quotedNestedContinue: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        env:", '          "continue-on-error": true', "        with:",
      "          'continue-on-error': false", run],
    D: ["      - name: target", "        env:", "          if: ${{ !cancelled() }}", run],
    E: ["      - name: target", "        env:", "          if: ${{ !cancelled() }}",
      "        if: ${{ false }}", run],
    F: ["      - name: decoy", "        if: ${{ !cancelled() }}", "        run: echo " + file,
      "      - name: target", "        if: ${{ false }}", run],
    afterRun: ["      - name: target", run, "        env:", "          if: ${{ false }}",
      "        if: ${{ !cancelled() }}"],
    duplicateCondition: ["      - name: target", "        if: ${{ !cancelled() }}",
      "        if: ${{ !cancelled() }}", run],
    duplicateRunner: ["      - name: first", "        if: ${{ !cancelled() }}", run,
      "      - name: second", "        if: ${{ false }}", run],
    siblingPath: ["      - name: target", "        if: ${{ !cancelled() }}",
      run + ".bak"],
  };
}

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "../../../..");

/* The owner-approved design of record, DECISIONS:530, pack tree 6d7710467408f69e61a2917c583540fc2336a3fa. */
const PACK_ROOT_REL = "rebuild/m1/approved-2026-09-18";
const PACK_ROOT_ABS = path.join(REPO_ROOT, ...PACK_ROOT_REL.split("/"));

/* THE LITERAL. One line per file, "<pack-root-relative path> <space> <64-hex sha256>",
   sorted by path BYTES ascending. */
const LITERAL = Object.freeze([
  /* EMPTY ON PURPOSE, AND THIS COMMENT IS THE WHOLE OF WHAT FILLS IT. The S9 INTEGRATOR
     fills this list ONCE, at the S9 head, AFTER C-UI-0's second teeth audit and C-UI-1's
     seal (DECISIONS:531) and after every platform of record's baseline directory is
     present and set (R4 N2), by C.5.1's five-step procedure and never by copying a value
     out of S9-RELEASE-SPEC.md: (1) git ls-tree -r --name-only HEAD -- <pack root>/ ;
     (2) sha256 over `git cat-file blob HEAD:<path>` for each; (3) emit one line
     "<path with the pack root and its slash removed> <space> <64-hex>", sorted by path
     BYTES ascending; (4) paste the sorted lines here; (5) re-run this cell against the
     WORKING TREE, ON WINDOWS as well as on linux, and require zero MISMATCH, MISSING,
     ADDED and NOT-A-REGULAR-FILE. Step 5 is not ceremony: it is what proves a git walk and
     a working-tree walk agree, which is the .gitattributes argument taken as a
     measurement. v3's 53-file value 6121aa91... is SUPERSEDED and must not be used. */
]);

/* THE IGNORE LIST, the cell's OWN and ANCHORED AT THE PACK ROOT (C.5.1; R3 N5 second half;
   R16). It is NOT read from .gitignore: .gitignore is in neither S8 map, so a branch that
   could widen the ignore file could widen the pin. These two entries live inside a cell S9
   declares role "new", so from S9 on widening them is a sealed byte move product() :1970
   and :1972 refuse. ANCHORED means matched from the first character of the pack-root
   relative path, so a file placed at app/quality/run/x.js does NOT leave the pin. The
   __pycache__ rule is a SEGMENT rule, because Python writes one beside every package. */
const IGNORE_PREFIX = "quality/run/";
const PYCACHE_SEGMENT = "__pycache__";

const toPosix = (p) => p.split(path.sep).join("/");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

/* SORTED BY PATH BYTES, never by the default string sort (R4 N1.1, ADOPTED). The default
   sort compares UTF-16 code units, which orders a supplementary character BELOW U+E000
   because its surrogate pair starts at 0xD800; UTF-8 bytes order it ABOVE. The real pack's
   904 paths are all ASCII, where the two agree, so this is a guard rather than a fix, and
   the row "the comparator is byte-wise" below proves it is the guard it claims to be. */
const byteCompare = (a, b) => Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
const sortByBytes = (paths) => [...paths].sort(byteCompare);

/* What a refusal calls the pack root: its repository-relative path when it is inside this
   checkout, and its own absolute path when it is a mkdtemp fixture. */
function label(root) {
  const rel = path.relative(REPO_ROOT, root);
  return rel && !rel.startsWith("..") && !path.isAbsolute(rel) ? toPosix(rel) : toPosix(root);
}

/* BOTH CLAUSES ARE C.5.1's WORDS AND NOT ONE CHARACTER WIDER (R1 BLOCKING-2). The spec
   skips a path that BEGINS "quality/run/" and one that contains a "__pycache__/" SEGMENT:
   both are written with the trailing slash and both are about DIRECTORIES. So the prefix
   is matched with its slash and never against the bare path "quality/run", and the segment
   rule excludes the FINAL segment. A regular FILE at either place is an ordinary pack file
   and stays pinned. The directory cases are unchanged: the walk lstats quality/run,
   descends it as a plain directory and skips every child by the prefix; it descends a
   __pycache__ directory and skips every child by the segment rule. */
function isIgnored(rel) {
  if (rel.startsWith(IGNORE_PREFIX)) return true;
  return rel.split("/").slice(0, -1).includes(PYCACHE_SEGMENT);
}

/* NO LEADING OR TRAILING SPACE IN THE PATH (R1 N4). The first build's ".+" was greedy, so
   two spaces between the path and the hex parsed as a path ENDING in a space and a typo in
   this cell's own constant was reported as two facts about the tree. */
const LITERAL_LINE = /^(\S(?:.*\S)?) ([0-9a-f]{64})$/;

/* A literal line that is not "<path> <space> <64-hex>" is a defect in this cell's own
   constant and not a fact about the tree, so it fails hard here rather than joining the
   refusal vocabulary. The same for a path listed twice. */
function parseLiteral(lines) {
  const out = [];
  const seen = new Set();
  for (const raw of lines) {
    const line = String(raw);
    if (line.trim() === "") continue;
    const m = LITERAL_LINE.exec(line);
    assert.ok(m, 'PACK-PIN literal line is not "<path> <space> <64-hex sha256>": ' + line);
    assert.ok(!m[1].includes("\\"), "PACK-PIN literal path must use forward slashes: " + m[1]);
    assert.ok(!seen.has(m[1]), "PACK-PIN literal names the same path twice: " + m[1]);
    seen.add(m[1]);
    out.push({ file: m[1], sha256: m[2] });
  }
  /* ASSERTED, NEVER RE-SORTED (R1 BLOCKING-3, R1 N4). The first build sorted the parsed
     lines, so an unsorted literal was accepted in silence and the cell could not claim the
     pasted lines were the ones C.5.1 step 3 emitted. Sortedness is a property of this
     cell's own constant, so it fails hard here exactly as a malformed line does, and the
     literal walk below is in path byte order because the literal IS. */
  for (let i = 1; i < out.length; i++) {
    assert.ok(byteCompare(out[i - 1].file, out[i].file) < 0,
      "PACK-PIN literal is not sorted by path bytes: " + out[i].file + " follows " + out[i - 1].file);
  }
  return out;
}

/* C.5.1's serialisation, the one step 3 of the procedure emits and step 4 pastes. */
const serialise = (entries) =>
  [...entries].sort((a, b) => byteCompare(a.file, b.file))
    .map((e) => e.file + " " + e.sha256 + "\n").join("");

/* THE ENGINE, and the only thing in this file that judges anything. It is a function of
   (trusted root, pinned relative pack path, literal lines) so that the fixture rows and the REAL ROW run the same code
   over different inputs: a fixture row that exercised a different engine would prove
   nothing about the real one. It returns the refusals as an array of strings, so a row can
   assert the EXACT text, and an empty array is the only green.

   AN ENTRY IS NAMED ONCE. An irregular entry refuses NOT-A-REGULAR-FILE, and an unreadable
   one refuses UNREADABLE; both take no part in the MISSING and ADDED comparisons, so one
   defect prints one line. The order is MISMATCH and MISSING walking the literal in byte
   order, then ADDED in byte order, then NOT-A-REGULAR-FILE, then UNREADABLE, each in byte
   order, which is stable whatever order readdir hands back. */
function walk(root, rel, observed, irregular, unreadable, readFile, names) {
  const dirAbs = rel === "" ? root : path.join(root, ...rel.split("/"));
  /* The root listing is already guarded by judge; interior directories retain the declared residual. */
  for (const name of names === undefined ? fs.readdirSync(dirAbs) : names) {
    const childRel = rel === "" ? name : rel + "/" + name;
    if (isIgnored(childRel)) continue;
    const abs = path.join(dirAbs, name);
    const st = fs.lstatSync(abs);
    if (st.isDirectory()) { walk(root, childRel, observed, irregular, unreadable, readFile); continue; }
    if (!st.isFile()) { irregular.add(childRel); continue; }
    /* NAMED, AND THE WALK GOES ON (the PM's ruling on Q2). A file the walk cannot read used
       to throw out of here, which stopped the run before every later path; now it is one
       more refusal and every later path is still judged in the same run. */
    let bytes = null;
    try { bytes = readFile(abs); } catch { unreadable.add(childRel); continue; }
    observed.set(childRel, sha256(bytes));
  }
}

/* readFile is the OPTIONAL READER of the PM's Q2 ruling: the file system's own by default,
   and passed only by the fixture rows that need an unreadable file on a machine where one
   cannot be built (Windows without a DENY ACE, and a farm scratch running as root). The
   REAL ROW passes none, and a row below asserts that by reading this file's own source. */
function judge(root, packRootRel, literalLines, readFile) {
  /* P-PACK-5: the caller supplies the trusted root and exact relative spelling.
     Real and synthetic inputs enter this single walk; no absolute-path comparison
     selects a boundary. The trusted root itself is not inspected as a component. */
  const parts = packRootRel.split("/");
  const packRoot = path.join(root, ...parts);
  let dir = root;
  let st = null;
  for (let i = 0; i < parts.length; i++) {
    const component = path.join(dir, parts[i]);
    try { st = fs.lstatSync(component); } catch { st = null; }
    if (st === null) return ["PACK-PIN PACK-ROOT-ABSENT " + label(packRoot)];
    if (i < parts.length - 1 && !st.isDirectory()) {
      return ["PACK-PIN NOT-A-REGULAR-FILE " + label(component)];
    }
    let names;
    try { names = fs.readdirSync(dir); } catch { return ["PACK-PIN UNREADABLE " + label(dir)]; }
    if (!names.includes(parts[i])) return ["PACK-PIN PACK-ROOT-ABSENT " + label(packRoot)];
    dir = component;
  }
  if (st === null || !st.isDirectory()) return ["PACK-PIN PACK-ROOT-ABSENT " + label(packRoot)];

  let rootNames;
  try { rootNames = fs.readdirSync(packRoot); } catch { return ["PACK-PIN UNREADABLE " + label(packRoot)]; }

  const literal = parseLiteral(literalLines);
  if (literal.length === 0) return ["PACK-PIN LITERAL-EMPTY"];

  const observed = new Map();
  const irregular = new Set();
  const unreadable = new Set();
  walk(packRoot, "", observed, irregular, unreadable, readFile, rootNames);

  const refusals = [];
  for (const e of literal) {
    if (irregular.has(e.file) || unreadable.has(e.file)) continue;
    const got = observed.get(e.file);
    if (got === undefined) refusals.push("PACK-PIN MISSING " + e.file);
    else if (got !== e.sha256) refusals.push("PACK-PIN MISMATCH " + e.file);
  }
  const listed = new Set(literal.map((e) => e.file));
  for (const rel of sortByBytes([...observed.keys()])) {
    if (!listed.has(rel)) refusals.push("PACK-PIN ADDED " + rel);
  }
  /* R3's DISPUTE, UPHELD BY THE PM AND RECORDED AS A DECISION RATHER THAN AN OVERSIGHT.
     The byte sorts on these two output lists have NO row and will not get one. Killing
     either deterministically needs a fixture in which the walk's insertion order provably
     differs from byte order, and insertion order is readdir order, which neither operating
     system guarantees: such a row is a flake generator on a PC six lanes share. Neither
     sort can produce a false green or a wrong name - both lines are printed either way and
     only their order moves - and the comparator itself is proven by the row "the comparator
     is byte-wise" below. The ADDED list's sort above has a row on Windows; Linux readdir order may
     already match byte order, so Linux cannot reliably hold removal of that sort. */
  for (const rel of sortByBytes([...irregular])) refusals.push("PACK-PIN NOT-A-REGULAR-FILE " + rel);
  for (const rel of sortByBytes([...unreadable])) refusals.push("PACK-PIN UNREADABLE " + rel);
  return refusals;
}

/* R2 N2. EVERY REFUSAL THIS FILE EMITS IS RECORDED AS IT IS RETURNED, so the last row can
   DERIVE the vocabulary from what the rows above actually produced instead of asserting
   the shape of a constant and calling that reachability. Recording is a harness concern
   and never a verdict: packPin returns exactly what the engine returned, unchanged, and
   every caller - the fixture rows and the REAL ROW alike - goes through this one door. */
const EMITTED = new Set();

function packPin(root, packRootRel, literalLines, readFile = fs.readFileSync) {
  const refusals = judge(root, packRootRel, literalLines, readFile);
  for (const r of refusals) EMITTED.add(r.split(" ", 2).join(" "));
  return refusals;
}

/* Fixture-only conversion: every caller constructs its pack below os.tmpdir().
   It supplies that trusted root explicitly; this helper does not select a boundary. */
const s9PackRel = (packRoot) => packRoot.slice(os.tmpdir().length + 1).split(path.sep).join("/");

/* THE THROWAWAY FIXTURE PACK: the real pack's shape in miniature, built by this file in a
   mkdtemp folder and removed again. It holds a board under ref/, an app file, a gate
   script and a baseline PNG and a state record under quality/, README.md, the untracked
   run output and __pycache__ a machine that has RUN the gates leaves behind, and the DECOY
   at app/quality/run/x.js which an unanchored ignore rule would drop out of the pin.

   The literal comes from the MANIFEST, not from a walk of what was written: a fixture that
   generated its own expectation with the code under test would assert nothing. */
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const png = (s) => Buffer.concat([PNG_SIG, Buffer.from(s, "utf8")]);
const txt = (s) => Buffer.from(s, "utf8");

const FIXTURE = Object.freeze([
  { file: "README.md", tracked: true, bytes: txt("# the pack\n") },
  { file: "app/states-today.js", tracked: true, bytes: txt("export const T = 1;\n") },
  { file: "app/quality/run/x.js", tracked: true, bytes: txt("// the decoy: NOT ignored\n") },
  { file: "quality/STANDARD.md", tracked: true, bytes: txt("# the standard\n") },
  { file: "quality/gate.py", tracked: true, bytes: txt("TOL = 0.001\n") },
  { file: "quality/baseline/linux/ENV.txt", tracked: true, bytes: txt("linux\n") },
  { file: "quality/baseline/states/C-02-dawn.json", tracked: true, bytes: txt('{"text":"dawn"}\n') },
  { file: "quality/baseline/screens/T-01.png", tracked: true, bytes: png("T-01") },
  { file: "ref/ink-board.png", tracked: true, bytes: png("ink-board") },
  { file: "states/STATE-INVENTORY-DRAFT.md", tracked: true, bytes: txt("# states\n") },
  { file: "quality/run/last-run.json", tracked: false, bytes: txt('{"ran":true}\n') },
  { file: "quality/__pycache__/common.cpython-311.pyc", tracked: false, bytes: txt("cache\n") },
  { file: "quality/baseline/__pycache__/x.cpython-311.pyc", tracked: false, bytes: txt("cache\n") },
]);

function writeAt(root, rel, bytes) {
  const full = path.join(root, ...rel.split("/"));
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, bytes);
  return full;
}

/* Builds the fixture, hands (root, literal lines) to the body, and removes it again. */
function withPack(body) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-pack-"));
  try {
    for (const e of FIXTURE) writeAt(root, e.file, e.bytes);
    const lines = FIXTURE.filter((e) => e.tracked)
      .map((e) => ({ file: e.file, sha256: sha256(e.bytes) }));
    lines.sort((a, b) => byteCompare(a.file, b.file));
    return body(root, lines.map((e) => e.file + " " + e.sha256));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

/* Replaces one line of a literal with the same path at a different sha256, which is what a
   moved file looks like to the cell without having to know the new bytes. */
const moved = (lines, file) =>
  lines.map((l) => (l.startsWith(file + " ") ? file + " " + "0".repeat(64) : l));
const without = (lines, file) => lines.filter((l) => !l.startsWith(file + " "));

test("GREEN CONTROL: the fixture pack as built, against its own literal, refuses nothing", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
  });
});

test("B.8 (1) a board moved FAILS PACK-PIN MISMATCH ref/ink-board.png", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), moved(lines, "ref/ink-board.png")),
      ["PACK-PIN MISMATCH ref/ink-board.png"]);
  });
});

test("B.8 (2) an app file moved FAILS PACK-PIN MISMATCH app/states-today.js", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), moved(lines, "app/states-today.js")),
      ["PACK-PIN MISMATCH app/states-today.js"]);
  });
});

/* The row v3's quality/** exclusion would have passed, and the whole point of PM-R6'(i):
   a gate that judges every post-S9 look ticket must not be editable by the ticket. */
test("B.8 (3) a gate script moved FAILS PACK-PIN MISMATCH quality/gate.py", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), moved(lines, "quality/gate.py")),
      ["PACK-PIN MISMATCH quality/gate.py"]);
  });
});

test("B.8 (4) a baseline moved FAILS PACK-PIN MISMATCH naming the state record", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), moved(lines, "quality/baseline/states/C-02-dawn.json")),
      ["PACK-PIN MISMATCH quality/baseline/states/C-02-dawn.json"]);
  });
});

test("B.8 (5) a file added FAILS PACK-PIN ADDED naming the new state record", () => {
  withPack((root, lines) => {
    writeAt(root, "quality/baseline/states/C-99-dawn.json", txt('{"text":"dusk"}\n'));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines),
      ["PACK-PIN ADDED quality/baseline/states/C-99-dawn.json"]);
  });
});

test("B.8 (6) a file removed FAILS PACK-PIN MISSING naming the state inventory", () => {
  withPack((root, lines) => {
    fs.rmSync(path.join(root, "states", "STATE-INVENTORY-DRAFT.md"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines),
      ["PACK-PIN MISSING states/STATE-INVENTORY-DRAFT.md"]);
  });
});

/* B.8's seventh row, the green control the ignore list exists for: the design gates are
   run on the design lane's own machine, and a checkout they have run in carries untracked
   output inside the pack. It must not read as ADDED. */
test("GREEN CONTROL: untracked run output and __pycache__ inside the pack change nothing", () => {
  withPack((root, lines) => {
    writeAt(root, "quality/run/2026-09-19/report.html", txt("<p>run</p>\n"));
    writeAt(root, "quality/run/latest.png", png("latest"));
    writeAt(root, "app/__pycache__/helper.cpython-311.pyc", txt("cache\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
  });
});

/* THE ANCHOR. An unanchored segment match would drop a file placed at app/quality/run/x.js
   out of the pin for ever, which is a place to hide a change (R3 N5, second half). */
test("THE ANCHOR: the decoy at app/quality/run/x.js is pinned, and a move of it is named", () => {
  withPack((root, lines) => {
    assert.ok(lines.some((l) => l.startsWith("app/quality/run/x.js ")),
      "the decoy must be in the fixture literal, or this row proves nothing");
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), moved(lines, "app/quality/run/x.js")),
      ["PACK-PIN MISMATCH app/quality/run/x.js"]);
  });
});

test("THE ANCHOR, the other half: a file at the anchored prefix IS skipped", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
    writeAt(root, "quality/run/x.js", txt("// skipped\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
  });
});

/* R4 N1.1, ADOPTED, and the row that proves it on the machine that would break it. A walk
   built on the platform separator spells the same path with a backslash on windows-latest
   and mismatches every one of the 904 literal lines. This row keeps ONE literal line and
   reads every other pack file back out of the ADDED refusals, so it sees exactly what the
   walk emits, in the order it emits it. */
test("R4 N1.1: every path the walk emits is pack-root-relative, forward-slashed, byte-sorted", () => {
  withPack((root, lines) => {
    const keep = lines.filter((l) => l.startsWith("README.md "));
    assert.equal(keep.length, 1);
    const refusals = packPin(os.tmpdir(), s9PackRel(root), keep);
    const expected = sortByBytes(
      FIXTURE.filter((e) => e.tracked && e.file !== "README.md").map((e) => e.file),
    ).map((f) => "PACK-PIN ADDED " + f);
    assert.deepEqual(refusals, expected);
    for (const r of refusals) assert.ok(!r.includes("\\"), "a path came back with a backslash: " + r);
  });
});

/* The comparator, on its own, because the real pack's 904 paths are all ASCII and ASCII is
   the one alphabet where the default sort and a byte sort agree. */
test("R4 N1.1: the comparator is byte-wise, and the default string sort would differ", () => {
  /* Built rather than typed, so the two characters are TEXT in this file and not the
     invisible things they name: U+E000 is one UTF-16 code unit and three UTF-8 bytes
     starting 0xEE; U+10000 is a surrogate pair starting 0xD800 and four UTF-8 bytes
     starting 0xF0. UTF-16 puts the surrogate first; the bytes put it second. */
  const a = String.fromCharCode(0xe000) + ".json";
  const b = String.fromCodePoint(0x10000) + ".json";
  assert.deepEqual(sortByBytes([b, a]), [a, b]);
  assert.deepEqual([b, a].sort(), [b, a]);
  assert.notDeepEqual([b, a].sort(), sortByBytes([b, a]));
});

/* C.5.1 step 3 and step 5 as one row: what the procedure emits is what the cell reads. */
test("C.5.1: the serialisation round-trips through parseLiteral unchanged", () => {
  withPack((root, lines) => {
    const parsed = parseLiteral(lines);
    const text = serialise(parsed);
    assert.equal(text, lines.join("\n") + "\n");
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), text.split("\n")), []);
  });
});

function tryLink(target, linkPath, type) {
  try { fs.symlinkSync(target, linkPath, type); return null; }
  catch (e) { return e.code || String(e); }
}

/* R4 N1.2, ADOPTED, and R4 section 2's only green-while-changed. readFileSync FOLLOWS a
   link; git cat-file blob does not. So a tracked pack file replaced by a link to a copy of
   the SAME BYTES reads green under a naive walk while the tree has changed, and the same
   commit checks out on Windows as a text file holding the target path, which is red there
   and green on linux. lstat closes it on both.

   WHAT EACH OS'S ROW PROVES, exactly, because the two OS do not allow the same things:
   an unprivileged process on linux may create a FILE symlink; an unprivileged process on
   Windows may NOT (measured on the PC: EPERM, no Developer Mode), but it may create a
   DIRECTORY JUNCTION, which needs no privilege. So the file-link half is proved on linux
   and recorded as unbuildable on Windows, and the junction half is proved on BOTH. */
test("R4 N1.2 (a): a FILE link over a pinned file refuses NOT-A-REGULAR-FILE, naming it", () => {
  withPack((root, lines) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-twin-"));
    try {
      const twin = path.join(outside, "ink-board.png");
      fs.writeFileSync(twin, png("ink-board"));
      const target = path.join(root, "ref", "ink-board.png");
      fs.rmSync(target);
      const err = tryLink(twin, target, "file");
      if (err === null) {
        assert.equal(sha256(fs.readFileSync(target)), sha256(png("ink-board")),
          "the link must read back as the SAME bytes, or this row is not the attack");
        assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), ["PACK-PIN NOT-A-REGULAR-FILE ref/ink-board.png"]);
      } else {
        assert.equal(process.platform, "win32",
          "a file link must be buildable by an unprivileged process off win32, got " + err);
        /* R1 N6: the CODE is recorded, not pinned. It is EPERM on this PC with no
           Developer Mode, and windows-latest is a different account this branch has never
           run on. A row that pinned the errno would go red on a runner for a reason that
           is not a defect in the pin; a runner that SUCCEEDS takes the branch above and
           runs the whole attack, which is the outcome to prefer. */
        assert.equal(typeof err, "string");
        assert.ok(err.length > 0, "a failed link must report a code");
        console.log("PACK-PIN file-link on win32 is unbuildable unprivileged, code: " + err);
      }
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

test("R4 N1.2 (b): a DIRECTORY link over a pinned directory refuses it and is not descended", () => {
  withPack((root, lines) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-twin-"));
    try {
      fs.mkdirSync(path.join(outside, "states"));
      fs.writeFileSync(path.join(outside, "states", "C-02-dawn.json"), txt('{"text":"dawn"}\n'));
      const target = path.join(root, "quality", "baseline", "states");
      fs.rmSync(target, { recursive: true });
      const err = tryLink(path.join(outside, "states"), target, "junction");
      assert.equal(err, null, "a directory junction needs no privilege on either OS, got " + err);
      assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), [
        "PACK-PIN MISSING quality/baseline/states/C-02-dawn.json",
        "PACK-PIN NOT-A-REGULAR-FILE quality/baseline/states",
      ]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

/* THE TWO REFUSALS THE REAL ROW CAN PRINT BEFORE THE S9 HEAD EXISTS, and their order.
   PACK-ROOT-ABSENT is a fact about the checkout and LITERAL-EMPTY is a fact about this
   cell, so the checkout is judged first: on this branch the pack has not merged, when it
   merges the refusal becomes LITERAL-EMPTY, and when the integrator runs C.5.1 it goes
   green. Three states, in that order, each with a name. */
test("PACK-ROOT-ABSENT: a pack root that is not in the checkout refuses, naming the root", () => {
  const gone = path.join(os.tmpdir(), "s9cpin-no-such-pack-" + process.pid);
  assert.ok(!fs.existsSync(gone));
  assert.deepEqual(packPin(os.tmpdir(), s9PackRel(gone), ["README.md " + "a".repeat(64)]),
    ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(gone)]);
});

test("PACK-ROOT-ABSENT: a pack root that is a FILE is absent too, not walked", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-notdir-"));
  try {
    const f = path.join(dir, "pack");
    fs.writeFileSync(f, txt("not a directory\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(f), ["README.md " + "a".repeat(64)]),
      ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(f)]);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("LITERAL-EMPTY: a present pack and an unfilled literal refuses, and never passes", () => {
  withPack((root) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), []), ["PACK-PIN LITERAL-EMPTY"]);
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), ["", "   "]), ["PACK-PIN LITERAL-EMPTY"]);
  });
});

test("the two refusals do not both fire: an absent root is judged before an empty literal", () => {
  const gone = path.join(os.tmpdir(), "s9cpin-no-such-pack-b-" + process.pid);
  assert.ok(!fs.existsSync(gone));
  assert.deepEqual(packPin(os.tmpdir(), s9PackRel(gone), []), ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(gone)]);
});

test("a literal line that is not the serialisation fails hard rather than being skipped", () => {
  withPack((root, lines) => {
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), [...lines, "quality/gate.py deadbeef"]),
      /literal line is not/);
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), [...lines, lines[0]]),
      /names the same path twice/);
  });
});

/* THE DAY-OF COST, measured rather than assumed. At ecbef86a the real pack holds 904
   git-tracked files, so this row builds 904 and walks them. It asserts the SHAPE (green
   over 904 lines, one line per file) and PRINTS the elapsed time; it asserts no threshold,
   because a threshold on a PC shared with six other lanes is a flake generator. The
   fixture's bytes are small, which is the right shape for this measurement: the cost of
   this cell is 904 lstat-and-read round trips, not the sha256 of a few megabytes. */
function withBigPack(body) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-904-"));
  try {
    const entries = [{ file: "README.md", bytes: txt("# the pack\n") }];
    const add = (f, b) => entries.push({ file: f, bytes: b });
    for (let i = 0; i < 8; i++) add("ref/board-" + String(i).padStart(2, "0") + ".png", png("ref" + i));
    for (let i = 0; i < 42; i++) add("app/mod-" + String(i).padStart(2, "0") + ".js", txt("export const M" + i + " = " + i + ";\n"));
    for (let i = 0; i < 3; i++) add("states/STATE-" + i + ".md", txt("# state " + i + "\n"));
    for (const n of ["STANDARD.md", "common.py", "gate.py", "phonesheet.py", "statesheet.py", "teeth.py"]) add("quality/" + n, txt("# " + n + "\n"));
    for (let i = 0; i < 6; i++) add("quality/baseline/linux/L-" + i + ".png", png("linux" + i));
    add("quality/baseline/linux/ENV.txt", txt("linux\n"));
    for (let i = 0; i < 419; i++) add("quality/baseline/states/S-" + String(i).padStart(3, "0") + ".json", txt('{"text":"state ' + i + '"}\n'));
    for (let i = 0; i < 418; i++) add("quality/baseline/screens/T-" + String(i).padStart(3, "0") + ".png", png("screen-" + i + "-".repeat(512)));
    for (const e of entries) writeAt(root, e.file, e.bytes);
    const lines = entries.map((e) => ({ file: e.file, sha256: sha256(e.bytes) }));
    lines.sort((a, b) => byteCompare(a.file, b.file));
    return body(root, lines.map((e) => e.file + " " + e.sha256), entries.length);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test("SCALE: 904 files, the shape of the real pack, green and timed", () => {
  withBigPack((root, lines, count) => {
    assert.equal(count, 904);
    assert.equal(lines.length, 904);
    const started = process.hrtime.bigint();
    const refusals = packPin(os.tmpdir(), s9PackRel(root), lines);
    const ms = Number(process.hrtime.bigint() - started) / 1e6;
    assert.deepEqual(refusals, []);
    console.log("PACK-PIN over 904 files on " + process.platform + ": " + ms.toFixed(0) + " ms");
  });
});

test("SCALE: one moved byte among 904 is named, and nothing else is", () => {
  withBigPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), moved(lines, "quality/baseline/states/S-207.json")),
      ["PACK-PIN MISMATCH quality/baseline/states/S-207.json"]);
  });
});

/* THE WORKING TREE, AT RUN TIME. Nothing is cached between calls: the same (root, literal)
   pair is green, then red the moment a byte moves on disk, then green again. This is what
   makes the red rows reachable at all, and it is what a value taken at a fixed commit
   could not do (R3 BLOCKING-F). */
test("the cell reads the WORKING TREE on every call and caches nothing", () => {
  withPack((root, lines) => {
    const p = path.join(root, "quality", "gate.py");
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
    fs.writeFileSync(p, txt("TOL = 0.002\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), ["PACK-PIN MISMATCH quality/gate.py"]);
    fs.writeFileSync(p, txt("TOL = 0.001\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
  });
});

/* ============================ R1 FIX ROUND ============================
   Every row below closes a finding of rebuild/lanes/b/S9-PREP-PACK-REVIEW-R1.md. Each one
   names the finding it closes, so a later reader can tell which rows exist because
   something was measured wrong rather than because it was designed. */
/* R1 BLOCKING-2. C.5.1's skip is "a pack-root-relative path BEGINS quality/run/ or
   contains a __pycache__/ SEGMENT". Both are written WITH the trailing slash and both are
   about DIRECTORIES. A regular FILE at quality/run, and a regular FILE whose LAST segment
   is __pycache__, are ordinary files sitting inside the owner-approved pack; they are not
   the gate's untracked output and nothing in .gitignore keeps them out of a commit. R1
   measured that the first build swallowed both. They are pinned. */
test("R1 B2: a regular FILE at quality/run is ADDED, not swallowed by the ignore prefix", () => {
  withPack((root, lines) => {
    fs.rmSync(path.join(root, "quality", "run"), { recursive: true });
    writeAt(root, "quality/run", txt("// a FILE at the prefix, not the output directory\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), ["PACK-PIN ADDED quality/run"]);
  });
});

test("R1 B2: a regular FILE named __pycache__ is ADDED, while the DIRECTORY stays ignored", () => {
  withPack((root, lines) => {
    writeAt(root, "app/__pycache__", txt("// a FILE, not a python cache directory\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), ["PACK-PIN ADDED app/__pycache__"]);
  });
});

/* R1 B2, THE CONSEQUENCE, STATED RATHER THAN DISCOVERED. Dropping the "quality/run exactly"
   clause means the walk now lstats that path instead of skipping it, so a LINK standing
   there is an irregular entry and is named. That is the spec's shape: quality/run is only
   invisible to the pin as a plain directory whose CHILDREN begin quality/run/. A design
   machine that symlinks its own output directory gets one loud line naming it, which is
   the behaviour this cell chose and the PM can overrule with a sealed byte move. */
test("R1 B2: a LINK at quality/run is an irregular entry and is named, not treated as output", () => {
  withPack((root, lines) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-twin-"));
    try {
      fs.mkdirSync(path.join(outside, "run"));
      fs.rmSync(path.join(root, "quality", "run"), { recursive: true });
      const err = tryLink(path.join(outside, "run"), path.join(root, "quality", "run"), "junction");
      assert.equal(err, null, "a directory junction needs no privilege on either OS, got " + err);
      assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), ["PACK-PIN NOT-A-REGULAR-FILE quality/run"]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});
/* R1 BLOCKING-3, first of three uncovered guards. label()'s repo-relative branch is the
   only code that produces the refusal text the S9 integrator will read on the day the pack
   has not merged, and R1 measured that no row asserted it. label() is pure path arithmetic
   and touches no disk, so this row is stable whether or not the pack is in the checkout. */
test("R1 B3: label() names a root inside this checkout repo-relatively and one outside it absolutely", () => {
  assert.equal(label(PACK_ROOT_ABS), PACK_ROOT_REL);
  assert.equal(label(path.join(REPO_ROOT, "rebuild", "m1")), "rebuild/m1");
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-label-"));
  try {
    assert.equal(label(out), toPosix(out));
    assert.notEqual(label(out), PACK_ROOT_REL);
    assert.ok(!label(out).includes("\\"), "a label came back with a backslash: " + label(out));
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});

/* R1 BLOCKING-3, second: the literal-side half of R4 N1.1. A literal generated on Windows
   by a procedure that used the platform separator would spell every path with a backslash,
   and this cell's own constant would then disagree with its own walk on one OS only. The
   backslash is built from its code point so it is TEXT in this file. */
test("R1 B3: a literal path spelled with a BACKSLASH fails hard (R4 N1.1, the literal side)", () => {
  withPack((root, lines) => {
    const bs = String.fromCharCode(92);
    const bad = "quality" + bs + "gate.py " + "a".repeat(64);
    assert.ok(bad.includes(bs), "this row must carry a real backslash, or it proves nothing");
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), [...lines, bad]), /must use forward slashes/);
  });
});

/* R1 BLOCKING-3, third, and R1 N4's first half. The first build RE-SORTED an unsorted
   literal in silence, so the cell could not claim the pasted lines were the ones C.5.1
   step 3 emitted. An unsorted literal is a defect in this cell's own constant, exactly
   like a malformed line or a duplicate path, and it now fails hard in the same way. */
test("R1 B3 / R1 N4: an UNSORTED literal fails hard rather than being silently re-sorted", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
    const swapped = [...lines];
    const first = swapped[0];
    swapped[0] = swapped[1];
    swapped[1] = first;
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), swapped), /not sorted by path bytes/);
  });
});

test("the refusals walk the literal in path BYTE order, one line per moved file", () => {
  withPack((root, lines) => {
    const two = moved(moved(lines, "ref/ink-board.png"), "app/states-today.js");
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), two), [
      "PACK-PIN MISMATCH app/states-today.js",
      "PACK-PIN MISMATCH ref/ink-board.png",
    ]);
  });
});
/* R1 BLOCKING-3's fourth point, and the one row that changes a mutation's verdict rather
   than only its count. R1 measured that "an entry is named ONCE" (the skip of an irregular
   entry in the literal walk) is killed on linux only, because the directory-link row pins a
   FILE UNDER the junction and never the junction itself, and the file-link row cannot be
   built on Windows. A DIRECTORY JUNCTION can be created AT the path of a pinned FILE, and
   that needs no privilege on either OS. So this row puts an irregular entry exactly where
   the literal names a file, on BOTH operating systems: one line, NOT_A_REGULAR_FILE, and no
   MISSING beside it. It is the Windows half the first build did not have. */
test("R4 N1.2 (c): a DIRECTORY link AT a pinned FILE refuses ONCE, on both operating systems", () => {
  withPack((root, lines) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-twin-"));
    try {
      fs.mkdirSync(path.join(outside, "d"));
      fs.writeFileSync(path.join(outside, "d", "decoy.txt"), txt("not in the pack\n"));
      const target = path.join(root, "ref", "ink-board.png");
      fs.rmSync(target);
      const err = tryLink(path.join(outside, "d"), target, "junction");
      assert.equal(err, null, "a directory junction needs no privilege on either OS, got " + err);
      assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), ["PACK-PIN NOT-A-REGULAR-FILE ref/ink-board.png"]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

/* R1 N4's second half. Two spaces between the path and the hex were read as a path with a
   TRAILING SPACE, so a typo in this cell's own constant was reported as two facts about
   the tree (a MISSING file with a space in its name and an ADDED one without). It is a
   defect in the constant and it fails hard. */
test("R1 N4: two spaces between the path and the hex fails hard, not as a trailing-space path", () => {
  withPack((root) => {
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), ["quality/gate.py  " + "a".repeat(64)]),
      /literal line is not/);
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), [" quality/gate.py " + "a".repeat(64)]),
      /literal line is not/);
  });
});

/* R1 N5(a), RECORDED AS A DECISION AND NOT LEFT TO BE DISCOVERED. A python module placed
   inside a __pycache__ DIRECTORY inside the pack is invisible to this pin by construction,
   and python will import it if sys.path reaches it. The ignore list cannot close this
   without un-ignoring the caches the design machine really does leave behind, which is the
   opposite trade. This row exists so the hole is a sealed, named fact: if a later round
   narrows the ignore list, this row goes red and somebody has to think. */
test("RESIDUAL (R1 N5a): a file inside a __pycache__ DIRECTORY is invisible to the pin, by construction", () => {
  withPack((root, lines) => {
    writeAt(root, "quality/__pycache__/teeth.py", txt("# a module the pin cannot see\n"));
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
  });
});

/* ============================ R2 FIX ROUND ============================
   Every row below closes a finding of rebuild/lanes/b/S9-PREP-PACK-REVIEW-R2.md or takes a
   PM ruling on a question the author asked, and names which. */

/* R2 BLOCKING-1. packPin opens with lstatSync(packRoot) and the comment above it says why,
   and R2 measured that NOTHING exercised that sentence: lstat -> stat turned no row red on
   either operating system. The two PACK-ROOT-ABSENT rows above use a path that does not
   exist and a path that is a regular FILE, and stat and lstat agree on both. This is R4
   section 2's green-while-changed one level up: not a pinned file replaced by a link to a
   twin, but the WHOLE PACK replaced by one, and the pack root is the one entry the walk
   never sees. A directory junction needs no privilege on either operating system, so the
   row is the same construction on both, which is what makes it the Windows row too. */
test("R2 B1: a LINK standing AT the pack root is ABSENT, even over a twin that matches", () => {
  withPack((root, lines) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "s9cpin-hold-"));
    try {
      const link = path.join(outside, "approved-2026-09-18");
      const err = tryLink(root, link, "junction");
      assert.equal(err, null, "a directory junction needs no privilege on either OS, got " + err);
      assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), [],
        "the fixture must be green through its own root, or this row is not the attack");
      assert.equal(sha256(fs.readFileSync(path.join(link, "README.md"))), sha256(txt("# the pack\n")),
        "the twin must read back the SAME bytes through the link, or this row is not the attack");
      assert.deepEqual(packPin(os.tmpdir(), s9PackRel(link), lines), ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(link)]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

/* R2 N3, SAID RATHER THAN LEFT TO BE REDISCOVERED. A LITERAL LINE NAMING A PATH OUTSIDE
   THE PACK IS BENIGN BY CONSTRUCTION, and the reason is the engine's shape: it never OPENS
   a literal path, it only asks the Map the walk built, and the walk only ever puts
   pack-root-relative paths in it. So "..", a leading slash, a drive letter and "./" are
   each a MISSING line naming the path and no traversal is reachable from any of them.
   That is not an inconsistency with the backslash clause above, which fails HARD: a
   backslash is a spelling defect that would make this cell's own constant disagree with
   its own walk on ONE operating system, which is the class of defect the parser exists to
   catch, while a path outside the pack is simply a line about a file that is not there. */
test("R2 N3: a literal path OUTSIDE the pack is benign: it is MISSING, and is never opened", () => {
  withPack((root, lines) => {
    const hex = "a".repeat(64);
    const bs = String.fromCharCode(92);
    const outsiders = ["../../etc/hosts", "./x", "/etc/hosts", "C:/Windows/win.ini"];
    assert.deepEqual([...outsiders].sort(byteCompare), outsiders,
      "the four must already be in path byte order, or the literal is unsorted and fails hard");
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), [...outsiders.map((p) => p + " " + hex), ...lines]),
      outsiders.map((p) => "PACK-PIN MISSING " + p));
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), ["C:" + bs + "Windows " + hex, ...lines]),
      /must use forward slashes/);
  });
});

/* THE PM'S RULING ON THE AUTHOR'S Q2: UNREADABLE JOINS THE VOCABULARY NOW, as the seventh
   refusal, because from S9 the vocabulary is sealed bytes and a refusal added later costs
   a reseal child. R1 N3 measured the hole on the PC with a DENY ACE: a pinned file the
   walk cannot read made readFileSync THROW, so the cell went loudly red with a message
   that is none of its refusals AND the walk stopped before every later path. Now the walk
   NAMES it and CONTINUES, so a second defect further down is still named in the same run.
   R1's DENY-ACE measurement is the one real-file witness and it is WINDOWS ONLY; the
   author report says so.

   HOW THE ROW IS BUILT ON BOTH OPERATING SYSTEMS AND UNDER uid 0. A real unreadable file
   needs a DENY ACE on Windows and cannot be built at all in a farm scratch, which runs as
   root, where chmod proves nothing. So THE ENGINE TAKES AN OPTIONAL READER AS ITS LAST
   PARAMETER, defaulting to the file system's own, and ONLY FIXTURE ROWS PASS ONE. The last
   row of this block scans this file's own source and asserts the REAL ROW passes none, so
   the option can never become the way the real pin reads.

   ONE RESIDUAL, NAMED RATHER THAN DISCOVERED: an unreadable DIRECTORY still throws out of
   readdirSync. That is the same LOUD RED the file case used to be, it is not a silent
   green, and closing it would mean a second optional reader for directories. It is in the
   author report's integrator list. */
const readerRefusing = (root, ...rels) => {
  const denied = new Set(rels.map((r) => path.join(root, ...r.split("/"))));
  return (abs) => {
    if (!denied.has(abs)) return fs.readFileSync(abs);
    const e = new Error("EACCES: permission denied, open " + abs);
    e.code = "EACCES";
    throw e;
  };
};

test("R2 Q2 / UNREADABLE: a pinned file the walk cannot read is NAMED, not thrown over", () => {
  withPack((root, lines) => {
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines, readerRefusing(root, "quality/gate.py")),
      ["PACK-PIN UNREADABLE quality/gate.py"]);
  });
});

test("R2 Q2 / UNREADABLE: the walk CONTINUES, so a later defect is named in the same run", () => {
  withPack((root, lines) => {
    assert.deepEqual(
      packPin(os.tmpdir(), s9PackRel(root), moved(lines, "ref/ink-board.png"), readerRefusing(root, "app/states-today.js")),
      ["PACK-PIN MISMATCH ref/ink-board.png", "PACK-PIN UNREADABLE app/states-today.js"]);
  });
});

/* An unreadable entry is a thing this cell cannot speak about, exactly as an irregular one
   is, so it takes no part in the MISSING and ADDED comparisons: one defect, one line,
   whether or not the literal names the path. */
test("R2 Q2 / UNREADABLE: an unreadable entry is named ONCE, never also MISSING or ADDED", () => {
  withPack((root, lines) => {
    const reader = readerRefusing(root, "quality/gate.py", "app/quality/run/x.js");
    const expected = [
      "PACK-PIN UNREADABLE app/quality/run/x.js",
      "PACK-PIN UNREADABLE quality/gate.py",
    ];
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines, reader), expected);
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), without(lines, "quality/gate.py"), reader), expected);
  });
});

test("R2 Q2: the OPTIONAL reader is a fixture affordance, and the REAL ROW passes none", () => {
  const src = fs.readFileSync(fileURLToPath(import.meta.url), "utf8");
  assert.equal(packPin.length, 3,
    "the reader must be OPTIONAL: packPin declares three parameters before its default");
  assert.match(src, /readFile = fs\.readFileSync/,
    "the default reader must be the file system's own");
  /* Built from two pieces so this row's own source does not match the pattern it searches
     for, which would make the row pass on itself. */
  const realCall = "packPin(" + "REPO_ROOT, PACK_ROOT_REL, LITERAL);";
  assert.deepEqual(src.match(/packPin\(REPO_ROOT.*/g), [realCall],
    "the real row must call the engine over the real pack with NO reader");
});


/* Astra P-PACK-1/2: synthetic paths and independently verified byte digests.
   certutil SHA256 verified the five nonempty vectors; .NET SHA256 verified empty.
   Expectations below never call the cell's sha256 helper. */
const S9_HEX = Object.freeze({
  empty: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  ascii: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  lf: "5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03",
  crlf: "cd2eca3535741f27a8ae40c31b0c41d4057a7a7b912b33b9aed86485d1c84676",
  invalid: "eddf68639913a3cb8331cdfe7f87559e0beccf2c289c0d90ac4d89b3204004f8",
  replacement: "2d4bf56bf338c578dae8b2b20d4d8b28801557d4c38e1d7c6699abddf69fee8d",
});
function s9WithRoot(body) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "s9-astra-"));
  try { return body(root); }
  finally { fs.rmSync(root, { recursive: true, force: true }); }
}


/* Hooks watch only fs.lstatSync and fs.readdirSync; statSync, opendirSync, async
   readdir and fs.promises.readdir are not observed. Restore before any assertion. */
function s9NoDescents(blocked, body) {
  const lstat = fs.lstatSync;
  const readdir = fs.readdirSync;
  const attempts = [];
  const inside = (abs) => {
    const rel = path.relative(blocked, abs);
    return rel !== "" && rel.split(path.sep)[0] !== ".." && !path.isAbsolute(rel);
  };
  fs.lstatSync = (abs, ...args) => { if (inside(abs)) attempts.push("lstat"); return lstat(abs, ...args); };
  fs.readdirSync = (abs, ...args) => { if (abs === blocked || inside(abs)) attempts.push("readdir"); return readdir(abs, ...args); };
  let result;
  let failed = false;
  let bodyError;
  try { result = body(); }
  catch (error) { failed = true; bodyError = error; }
  finally {
    fs.lstatSync = lstat;
    fs.readdirSync = readdir;
  }
  if (failed) throw bodyError;
  assert.deepEqual(attempts, [], "refusal must precede metadata descent");
  return result;
}

for (const [name, bytes] of [
  ["empty", Buffer.alloc(0)], ["ascii", txt("abc")],
  ["lf", txt("hello\n")], ["crlf", txt("hello\r\n")],
  ["invalid", Buffer.from([0xc3, 0x28])], ["replacement", Buffer.from([0xef, 0xbf, 0xbd, 0x28])],
]) {
  test("Astra P-PACK-2: independent digest vector " + name, () => {
    s9WithRoot((root) => {
      writeAt(root, "a.txt", bytes);
      assert.deepEqual(s9Pin(root, "a.txt", S9_HEX[name]), []);
    });
  });
}

test("Astra P-PACK-2: LF and CRLF differ against one unchanged literal", () => {
  s9WithRoot((root) => {
    writeAt(root, "a.txt", txt("hello\n"));
    assert.deepEqual(s9Pin(root, "a.txt", S9_HEX.lf), []);
    writeAt(root, "a.txt", txt("hello\r\n"));
    assert.deepEqual(s9Pin(root, "a.txt", S9_HEX.lf), [S9_NAME + " MISMATCH a.txt"]);
  });
});

test("Astra P-PACK-2: invalid UTF-8 and its replacement decoding differ", () => {
  s9WithRoot((root) => {
    const invalid = Buffer.from([0xc3, 0x28]);
    const decoded = Buffer.from([0xef, 0xbf, 0xbd, 0x28]);
    assert.equal(invalid.toString("utf8"), decoded.toString("utf8"));
    writeAt(root, "a.txt", invalid);
    assert.deepEqual(s9Pin(root, "a.txt", S9_HEX.invalid), []);
    writeAt(root, "a.txt", decoded);
    assert.deepEqual(s9Pin(root, "a.txt", S9_HEX.invalid), [S9_NAME + " MISMATCH a.txt"]);
  });
});

test("Astra P-PACK-1: ordinary nested path stays green", () => {
  s9WithRoot((root) => {
    const file = "one/two/a.txt";
    writeAt(root, file, txt("abc"));
    assert.deepEqual(s9Pin(root, file, S9_HEX.ascii), []);
  });
});

/* L2 N4: pure budget arithmetic, also used by the actual long-path row. */
function s9LongPath(rootLength) {
  const tail = "/a.txt";
  const remaining = 455 - rootLength - 1 - tail.length;
  const first = "d".repeat(120) + "/" + "e".repeat(120) + "/";
  if (remaining <= first.length) return null;
  return first + "f".repeat(remaining - first.length) + tail;
}

test("Astra P-PACK-1: a 455-character absolute path stays green", (t) => {
  s9WithRoot((root) => {
    const file = s9LongPath(root.length);
    if (file === null) { t.skip("455-character path: temp root leaves no filename budget"); return; }
    assert.equal(path.join(root, ...file.split("/")).length, 455);
    writeAt(root, file, txt("abc"));
    assert.deepEqual(s9Pin(root, file, S9_HEX.ascii), []);
  });
});

test("Astra P-PACK-1: composed and decomposed names stay distinct and green", () => {
  s9WithRoot((root) => {
    const composed = String.fromCharCode(0xe9) + ".txt";
    const decomposed = "e" + String.fromCharCode(0x301) + ".txt";
    writeAt(root, composed, txt("abc"));
    writeAt(root, decomposed, txt("abc"));
    assert.deepEqual(s9Pair(root, [decomposed, composed]), []);
  });
});

const S9_NAME = "PACK-PIN";
const s9Pin = (root, file, hex) => packPin(os.tmpdir(), s9PackRel(root), [file + " " + hex]);
const s9Pair = (root, files) => packPin(os.tmpdir(), s9PackRel(root), files.map((file) => file + " " + S9_HEX.ascii));

for (const dangling of [false, true]) {
  test("Astra P-PACK-1: pack root ancestor junction " + (dangling ? "dangling" : "same-byte"), () => {
    s9WithRoot((root) => {
      const actual = path.join(root, "actual");
      const alias = path.join(root, "alias");
      writeAt(actual, "pack/a.txt", txt("abc"));
      assert.deepEqual(s9Pin(path.join(actual, "pack"), "a.txt", S9_HEX.ascii), []);
      assert.equal(tryLink(actual, alias, "junction"), null);
      if (dangling) fs.rmSync(actual, { recursive: true });
      assert.equal(fs.lstatSync(alias).isSymbolicLink(), true);
      let reads = 0;
      const refusals = s9NoDescents(alias, () =>
        packPin(os.tmpdir(), s9PackRel(path.join(alias, "pack")), ["a.txt " + S9_HEX.ascii], () => { reads++; return txt("abc"); }));
      assert.deepEqual(refusals, ["PACK-PIN NOT-A-REGULAR-FILE " + toPosix(alias)]);
      assert.equal(reads, 0, "a rejected ancestor must prevent all file reads");
    });
  });
}

test("Astra P-PACK-1: pack root ancestors and root require exact spelling", () => {
  s9WithRoot((root) => {
    writeAt(root, "nested/pack/a.txt", txt("abc"));
    const pack = path.join(root, "nested", "pack");
    assert.deepEqual(s9Pin(pack, "a.txt", S9_HEX.ascii), []);
    fs.renameSync(path.join(root, "nested"), path.join(root, "NESTED"));
    assert.deepEqual(s9Pin(pack, "a.txt", S9_HEX.ascii), ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(pack)]);
    const correct = path.join(root, "NESTED", "pack");
    fs.renameSync(correct, path.join(root, "NESTED", "PACK"));
    assert.deepEqual(s9Pin(correct, "a.txt", S9_HEX.ascii), ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(correct)]);
  });
});

test("Astra P-PACK-3: literal parsing and serialise use explicit UTF-8 byte order", () => {
  s9WithRoot((root) => {
    const lo = String.fromCharCode(0xe000) + ".txt";
    const hi = String.fromCodePoint(0x10000) + ".txt";
    for (const file of [hi, lo]) writeAt(root, file, txt("abc"));
    const lines = [lo + " " + S9_HEX.ascii, hi + " " + S9_HEX.ascii];
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []);
    assert.throws(() => packPin(os.tmpdir(), s9PackRel(root), [lines[1], lines[0]]), /not sorted by path bytes/);
    const entries = [{ file: hi, sha256: S9_HEX.ascii }, { file: lo, sha256: S9_HEX.ascii }];
    const emitted = serialise(entries);
    assert.equal(emitted, lines[0] + "\n" + lines[1] + "\n");
    assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), emitted.split("\n")), []);
  });
});

test("Astra P-PACK-3: ADDED uses explicit U+E000 then U+10000 order", () => {
  s9WithRoot((root) => {
    const lo = String.fromCharCode(0xe000) + ".txt";
    const hi = String.fromCodePoint(0x10000) + ".txt";
    for (const file of ["a.txt", hi, lo]) writeAt(root, file, txt("abc"));
    assert.deepEqual(s9Pin(root, "a.txt", S9_HEX.ascii), ["PACK-PIN ADDED " + lo, "PACK-PIN ADDED " + hi]);
  });
});


test("Astra P-PACK-1: missing pack ancestor stops before descent", () => {
  s9WithRoot((root) => {
    const missing = path.join(root, "missing");
    const pack = path.join(missing, "pack");
    const refused = s9NoDescents(missing, () => s9Pin(pack, "a.txt", S9_HEX.ascii));
    assert.deepEqual(refused, ["PACK-PIN PACK-ROOT-ABSENT " + toPosix(pack)]);
  });
});


/* R6 listing stub: only the named synthetic directory is denied; restore on every exit. */
function s9DenyListing(denied, body) {
  const original = fs.readdirSync;
  fs.readdirSync = (dir, ...args) => {
    if (dir === denied) throw Object.assign(new Error("synthetic listing denial"), { code: "EACCES" });
    return original(dir, ...args);
  };
  try { return body(); }
  finally { fs.readdirSync = original; }
}

/* Windows-only permission witness: whoami/icacls child processes mutate ACLs only
   on this row's disposable fixture. RD denies listing, and finally clears the deny. */
function s9DenyListAcl(denied, body) {
  const identity = spawnSync("whoami.exe", [], { encoding: "utf8", windowsHide: true });
  assert.equal(identity.status, 0, "whoami must identify the actual test process account");
  const principal = identity.stdout.trim();
  try {
    const set = spawnSync("icacls.exe", [denied, "/deny", principal + ":(RD)"], { encoding: "utf8", windowsHide: true });
    assert.equal(set.status, 0, "icacls deny: " + set.stdout + set.stderr);
    return body();
  } finally {
    const clear = spawnSync("icacls.exe", [denied, "/remove:d", principal], { encoding: "utf8", windowsHide: true });
    assert.equal(clear.status, 0, "icacls remove deny: " + clear.stdout + clear.stderr);
  }
}

test("R6 N5: no-descent hooks restore and preserve the body's own error", () => {
  s9WithRoot((root) => {
    writeAt(root, "a.txt", txt("abc"));
    const lstat = fs.lstatSync;
    const readdir = fs.readdirSync;
    const own = new Error("body's original error");
    assert.throws(() => s9NoDescents(root, () => {
      fs.lstatSync(path.join(root, "a.txt"));
      fs.readdirSync(root);
      throw own;
    }), (error) => error === own);
    assert.equal(fs.lstatSync, lstat);
    assert.equal(fs.readdirSync, readdir);
    assert.throws(() => s9NoDescents(root, () => fs.readdirSync(root)), /refusal must precede metadata descent/);
    assert.equal(fs.readdirSync, readdir);
    assert.equal(s9NoDescents(root, () => 42), 42);
  });
});

for (const location of ["ancestor", "root"]) {
  for (const acl of [false, true]) {
    test("R6 P-PACK-4: unlistable pack " + location + (acl ? " Windows ACL" : " injected"),
      { skip: acl && process.platform !== "win32" ? "Windows list-directory ACL row; Linux permission run belongs to PM" : false }, () => {
      s9WithRoot((root) => {
        const pack = path.join(root, "parent", "pack");
        writeAt(pack, "a.txt", txt("abc"));
        const denied = location === "root" ? pack : path.join(root, "parent");
        const child = location === "root" ? path.join(pack, "a.txt") : pack;
        const apply = acl ? s9DenyListAcl : s9DenyListing;
        apply(denied, () => {
          assert.ok(fs.lstatSync(child), "known child remains traversable");
          assert.throws(() => fs.readdirSync(denied), (e) => ["EPERM", "EACCES"].includes(e.code));
          let reads = 0;
          assert.deepEqual(packPin(os.tmpdir(), s9PackRel(pack), ["a.txt " + S9_HEX.ascii], () => { reads++; return txt("abc"); }),
            ["PACK-PIN UNREADABLE " + toPosix(denied)]);
          assert.equal(reads, 0);
        });
      });
    });
  }
}


test("L2 P-PACK-5: the supplied trusted root bounds the exact component walk", () => {
  s9WithRoot((root) => {
    const pack = path.join(root, "parent", "pack");
    const file = writeAt(pack, "a.txt", txt("abc"));
    const lstat = fs.lstatSync;
    const readdir = fs.readdirSync;
    const visits = [];
    fs.lstatSync = (p, ...args) => { visits.push(["lstat", p]); return lstat(p, ...args); };
    fs.readdirSync = (p, ...args) => { visits.push(["readdir", p]); return readdir(p, ...args); };
    try {
      assert.deepEqual(packPin(root, "parent/pack", ["a.txt " + S9_HEX.ascii]), []);
    } finally { fs.lstatSync = lstat; fs.readdirSync = readdir; }
    assert.deepEqual(visits, [
      ["lstat", path.join(root, "parent")], ["readdir", root],
      ["lstat", pack], ["readdir", path.join(root, "parent")],
      ["readdir", pack], ["lstat", file],
    ]);
  });
});

test("L2 P-PACK-5: synthetic different-drive roots use one arm without absolute differencing", () => {
  const roots = process.platform === "win32" ? ["Q:\\s9-root", "R:\\s9-root"] : ["/s9-root-a", "/s9-root-b"];
  const lstat = fs.lstatSync;
  const readdir = fs.readdirSync;
  const readFile = fs.readFileSync;
  const relative = path.relative;
  try {
    path.relative = () => { throw new Error("absolute-path differencing is not a trust decision"); };
    for (const root of roots) {
      const pack = path.join(root, "pack");
      const file = path.join(pack, "a.txt");
      const visits = [];
      fs.lstatSync = (p) => {
        visits.push(["lstat", p]);
        assert.ok(p === pack || p === file, "only pinned components below the supplied root");
        return { isDirectory: () => p === pack, isFile: () => p === file };
      };
      fs.readdirSync = (p) => {
        visits.push(["readdir", p]);
        assert.ok(p === root || p === pack, "only the supplied root and pack are listed");
        return p === root ? ["pack"] : ["a.txt"];
      };
      fs.readFileSync = (p) => { visits.push(["read", p]); assert.equal(p, file); return txt("abc"); };
      assert.deepEqual(packPin(root, "pack", ["a.txt " + S9_HEX.ascii]), []);
      assert.deepEqual(visits, [["lstat", pack], ["readdir", root], ["readdir", pack], ["lstat", file], ["read", file]]);
    }
  } finally {
    fs.lstatSync = lstat; fs.readdirSync = readdir; fs.readFileSync = readFile; path.relative = relative;
  }
});

test("L2 N2: the guarded pack-root listing is consumed exactly once", () => {
  withPack((root, lines) => {
    const original = fs.readdirSync;
    let listings = 0;
    fs.readdirSync = (dir, ...args) => {
      if (dir === root) listings++;
      return original(dir, ...args);
    };
    try { assert.deepEqual(packPin(os.tmpdir(), s9PackRel(root), lines), []); }
    finally { fs.readdirSync = original; }
    assert.equal(listings, 1);
  });
});


test("L2 N4: the 455-character budget holds both sides of its boundary", () => {
  const first = "d".repeat(120) + "/" + "e".repeat(120) + "/";
  assert.equal(s9LongPath(205), first + "f/a.txt");
  assert.equal(s9LongPath(206), null);
  assert.equal(s9LongPath(207), null);
});

test("L2 N5: denied-listing hook restores after a throwing body", () => {
  const original = fs.readdirSync;
  const own = new Error("listing body's original error");
  try {
    assert.throws(() => s9DenyListing("synthetic-denied", () => {
      assert.notEqual(fs.readdirSync, original);
      throw own;
    }), (error) => error === own);
    assert.equal(fs.readdirSync, original);
    assert.equal(s9DenyListing("synthetic-denied", () => 42), 42);
    assert.equal(fs.readdirSync, original);
  } finally { fs.readdirSync = original; }
});

/* THE REAL ROW. It runs the SAME engine the fixture rows run, over the real pack root and
   this cell's own literal, and it is RED on this branch by construction: the pack is on
   the design lane's branches and the literal is unfilled. It does not skip, it is not
   conditional on the pack being present, and it cannot pass vacuously, because an empty
   literal is itself a refusal. The exact text it prints today is in
   rebuild/lanes/b/S9-PREP-PACK-AUTHOR-REPORT.md.

   THE LADDER OUT OF RED, for the S9 integrator, in order:
     PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18   the pack has not merged
     PACK-PIN LITERAL-EMPTY                                     it has, the literal has not
     (nothing)                                                  C.5.1's five steps are done
   Anyone who makes this row green by any other means has removed the cell. */
test("REAL ROW: the owner-approved pack at this head, against this cell's own literal", () => {
  const refusals = packPin(REPO_ROOT, PACK_ROOT_REL, LITERAL);
  assert.deepEqual(refusals, [],
    "PACK-PIN is not satisfied at this head. Refusals:\n  " + refusals.join("\n  ") +
    "\n(On rebuild/b-s9-prep-pack this is EXPECTED and is the red the cell was written for:" +
    " " + PACK_ROOT_REL + " has not merged and the literal is unfilled. C.5.1 fills it.)");
});

/* P-FENCE-1, EXTENDED TO THIS STEP BY DECISIONS:559 ("the pack-pin step of S9-PREP-C
   needs the same condition and the PM adds it as integrator") AND GIVEN A ROW OF ITS OWN
   BY DECISIONS:570 ("plus its own row"). The brief's section 9 item 3 is explicit that
   the row lives HERE and not as a second row inside the fence cell, because a cell that
   reads another cell's step is a cell nobody edits when that step moves.

   THE REASON THE CONDITION IS NEEDED, in one sentence: GitHub skips every step after a
   failed one; the standing step `b-package.cjs --ci --package S8` at rebuild.yml:150
   fails on exactly the branches this cell exists for, because a branch that does not
   contain the chain tip is refused SEAL-BASE-IS-NOT-THE-CHAIN-TIP by the runner's own
   rule of DECISIONS:135 (4); and a gate that is skipped in the world it was written for
   is not a gate. `!cancelled()` runs the step after an earlier failure and NOT when the
   run was cancelled, so a cancelled run still stops. It does not make the job green: this
   step's own exit status is still the job's.

   The row reads rebuild.yml as TEXT out of the WORKING TREE, finds the step by THIS
   FILE'S OWN PATH rather than by a line number, and never globs - the same three rules
   the fence's row (18) follows, so the two cannot drift apart in method. The step names
   this cell and approved-pin.test.mjs together; either spelling finds the same block. */
test("P-FENCE-1 / DECISIONS:570 - this cell's own step in rebuild.yml carries the not-cancelled condition", () => {
  const SELF = path.relative(REPO_ROOT, fileURLToPath(import.meta.url)).split(path.sep).join("/");
  const yml = fs.readFileSync(path.join(REPO_ROOT, ".github", "workflows", "rebuild.yml"), "utf8")
    .split(/\r?\n/);
  assertConditionedRun(yml, SELF, "the pack step");
});

test("D-S9G-DECOY: pack reader refuses D, E and F workflow decoys", () => {
  const SELF = path.relative(REPO_ROOT, fileURLToPath(import.meta.url)).split(path.sep).join("/");
  const worlds = decoyWorkflows(SELF);
  assert.doesNotThrow(() => assertConditionedRun(worlds.control, SELF, "control"));
  assert.doesNotThrow(() => assertConditionedRun(worlds.afterRun, SELF, "after run"));
  for (const id of ["D", "E", "F"])
    assert.throws(() => assertConditionedRun(worlds[id], SELF, id), undefined, id);
  for (const id of ["duplicateCondition", "duplicateRunner", "siblingPath"])
    assert.throws(() => assertConditionedRun(worlds[id], SELF, id), undefined, id);
});

test("D-S9G-CONTINUE: pack reader refuses a direct continue-on-error key", () => {
  const SELF = path.relative(REPO_ROOT, fileURLToPath(import.meta.url)).split(path.sep).join("/");
  const worlds = decoyWorkflows(SELF);
  for (const id of ["control", "grouped", "siblingContinue", "nestedContinue"])
    assert.doesNotThrow(() => assertConditionedRun(worlds[id], SELF, id), undefined, id);
  const outcomes = ["continueTrue", "continueFalse"].map((id) => {
    try { assertConditionedRun(worlds[id], SELF, id); return id + ": accepted"; }
    catch (e) {
      return id + (e instanceof assert.AssertionError
        && String(e.message).includes("STEP-CONTINUE-ON-ERROR-FORBIDDEN")
        ? ": refused by name" : ": wrong refusal");
    }
  });
  assert.deepEqual(outcomes, ["continueTrue: refused by name", "continueFalse: refused by name"]);
});

test("D-S9G-QUOTED-KEY: pack reader refuses paired quoted continue-on-error keys", () => {
  const SELF = path.relative(REPO_ROOT, fileURLToPath(import.meta.url)).split(path.sep).join("/");
  const worlds = decoyWorkflows(SELF);
  for (const id of ["control", "grouped", "siblingContinue", "nestedContinue",
    "quotedSiblingContinue", "quotedNestedContinue"])
    assert.doesNotThrow(() => assertConditionedRun(worlds[id], SELF, id), undefined, id);
  assert.throws(() => assertConditionedRun(worlds.quotedIf, SELF, "quotedIf"), (error) =>
    error instanceof assert.AssertionError
      && !String(error.message).includes("STEP-CONTINUE-ON-ERROR-FORBIDDEN"));
  const real = fs.readFileSync(path.join(REPO_ROOT, ".github", "workflows", "rebuild.yml"), "utf8")
    .split(/\r?\n/);
  assert.doesNotThrow(() => assertConditionedRun(real, SELF, "real workflow"));
  const ids = ["continueTrue", "continueFalse", "quotedDoubleTrue", "quotedDoubleFalse",
    "quotedSingleTrue", "quotedSingleFalse"];
  const outcomes = ids.map((id) => {
    try { assertConditionedRun(worlds[id], SELF, id); return id + ": accepted"; }
    catch (error) {
      return id + (error instanceof assert.AssertionError
        && String(error.message).includes("STEP-CONTINUE-ON-ERROR-FORBIDDEN")
        ? ": refused by name" : ": wrong refusal");
    }
  });
  assert.deepEqual(outcomes, ids.map((id) => id + ": refused by name"));
});

test("D-CONDITION-MATCHER: pack reader requires the whole permitted expression", () => {
  assert.equal(conditionIsNotCancelled("  if: ${{ !cancelled() }}"), true);
  assert.equal(conditionIsNotCancelled("  if: ${{ !cancelled() && false }}"), false);
  assert.equal(conditionIsNotCancelled("  if: ${{ false || !cancelled() }}"), false);
  assert.equal(conditionIsNotCancelled("  if: ${{ !cancelled() || true }}"), false);
});

/* Named so the refusal vocabulary is readable from outside and cannot drift in silence:
   any change to this list is a change to a sealed cell's bytes. */
export const REFUSALS = Object.freeze([
  "PACK-PIN PACK-ROOT-ABSENT",
  "PACK-PIN LITERAL-EMPTY",
  "PACK-PIN MISMATCH",
  "PACK-PIN MISSING",
  "PACK-PIN ADDED",
  "PACK-PIN NOT-A-REGULAR-FILE",
  "PACK-PIN UNREADABLE",
]);

/* R2 N2, AND THE TITLE IS NOW A CLAIM THE ROW MAKES. The old row asserted the length, the
   uniqueness and the SHAPE of the strings and called that reachability, which is a claim it
   did not make. This one DERIVES the set of verbs the engine actually emitted over every
   row above - packPin records each refusal as it hands it back - and compares that set with
   the exported vocabulary. So the export is the drift detector the comment above says it
   is, in both directions: a refusal no row reaches, and a refusal a row emits that the
   export does not carry, each go red here. Top-level rows in a node:test file run in
   order, so this row, written last, sees every emission above it; if that ever stopped
   being true this row would go RED, which is the safe direction. */
test("the refusal vocabulary is exactly seven, and every one was EMITTED by a row above", () => {
  assert.equal(REFUSALS.length, 7);
  assert.deepEqual(REFUSALS, [...new Set(REFUSALS)]);
  for (const r of REFUSALS) assert.match(r, /^PACK-PIN [A-Z-]+$/);
  assert.deepEqual([...EMITTED].sort(), [...REFUSALS].sort(),
    "the vocabulary and what the rows above emitted must be the same set");
});
