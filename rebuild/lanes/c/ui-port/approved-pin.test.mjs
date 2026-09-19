/* APPROVED-PIN (S9 hunk H19b; S9-RELEASE-SPEC.md C.5.3, PM-R6'(i) second half) - whatever
   files design.APPROVED names at the S9 head, pinned by content, PARAMETRICALLY.

   THE HOLE IT CLOSES, measured rather than asserted. design.test.cjs:15-:20 hashes each
   approved reference and compares it to entry.sha256, which comes from design.APPROVED
   inside design.cjs. BOTH SIDES ARE UNSEALED: rebuild/m1/ appears nowhere in the S8
   product or executionPins maps, and design.cjs is not sealed either (PM-R6 declines to
   seal it, because the design lane edits it in most tickets). So a branch that edits an
   approved reference and updates design.cjs's matching constant in the same commit is
   green in CI, green under --ci --package S8 and green under the D.2 fence. APPROVED-PIN
   supplies the THIRD, SEALED side: its own literal, which the coordinated edit does not
   touch. The row "the coordinated edit" below is that pair, executed.

   PARAMETRIC, and this is R12. The cell reads design.APPROVED AT RUN TIME, ON EVERY RUN,
   for its FILE LIST ONLY - never cached, never copied into the cell, the same rule
   CHAIN_REF follows at b-package.cjs:1201. It NEVER reads design.APPROVED[n].sha256; the
   engine's signature cannot see one, because it takes a list of PATHS. If C-UI-1 moves the
   pins into the 09-18 pack, this cell follows the move and says so by name instead of
   going quietly green over two files nothing points at any more.

   THE FIVE REFUSALS. LIST-EMPTY (design.APPROVED names nothing, so the cell refuses rather
   than passing over an empty loop), UNLISTED (a named file with no literal entry: R4 N8,
   ADOPTED, and it is the refusal C-UI-1's own move creates), MISSING (a named file that is
   not on disk), NOT-A-REGULAR-FILE (R4 N1.2, ADOPTED: lstat, never follow a link) and
   MISMATCH. One refusal per named file, in that order, so one defect prints one line.

   BOTH OPERATING SYSTEMS (R4 N1.1, ADOPTED). Every path this cell prints is spelled the
   way design.APPROVED spells it: repository-root-relative, forward slashes, on every OS.
   It joins with the platform separator only to open the file and never to name it. The
   refusals come back in design.APPROVED's OWN ORDER, which is identical on both operating
   systems and is the order design.cjs's own asserts speak in (approved[0], approved[1]);
   the one place this cell sorts, the literal map's key order, sorts by path BYTES.

   THE LITERAL IS EMPTY ON THIS BRANCH, so the REAL ROW at the bottom FAILS BY NAME today:
   every file design.APPROVED names is UNLISTED. It does not skip and it cannot pass
   vacuously. The exact text is in rebuild/lanes/b/S9-PREP-PACK-AUTHOR-REPORT.md.

   NO OWNER DATA. Every fixture is built by this file in a mkdtemp folder out of bytes it
   writes itself, and removed again. */

import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "../../../..");

/* READ, NOT COPIED, and required here so a broken design.cjs is a loud failure of this
   cell rather than a silent skip. Only APPROVED is touched, and only for its file names. */
const design = require(path.join(REPO_ROOT, "rebuild", "m3", "w7-preview", "today", "design.cjs"));

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const byteCompare = (a, b) => Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));

/* THE LITERAL MAP, path to sha256. Key order does not matter to the engine; it is held in
   path BYTE order so a reader can diff two generations of it (R4 N1.1). */
const LITERAL = Object.freeze({
  /* EMPTY ON PURPOSE, AND THIS COMMENT IS THE WHOLE OF WHAT FILLS IT. The S9 INTEGRATOR
     fills this map ONCE, at the S9 head, AFTER lane C-UI has answered OQ-2 and after every
     platform of record's baseline directory is present and set (R4 N2), by C.5.3's
     five-step list: (1) read design.APPROVED at the S9 head and write down the file list;
     (2) sha256 each named file FROM GIT at that head, never from a report, and paste
     "<path>": "<64-hex>" here in path byte order; (3) re-decide E fact 17's four
     pinned-unchanged paths against that list, adding ADDITIONS-C-APPROVED-HANDOFF.md and
     rebuild/m1/MOCK.md, which design.test.cjs reads by hard-coded path; (4) record whether
     C-UI-1 had to edit the SEALED design.test.cjs (:17, :25, :26, :184) and name the
     hunks - if that edit cannot be made honestly, F.2 STOP-10 stops the round; (5) take
     lane C-UI's answer to OQ-2 before any of the above. Never a value from a report. */
});

/* THE FILE LIST, READ AT RUN TIME. It takes the NAMES and nothing else: design.APPROVED's
   own sha256 fields are deliberately dropped here so that no path exists by which this
   cell could satisfy itself from the constant it is checking. */
function namesOf(mod) {
  const list = mod && mod.APPROVED;
  if (!Array.isArray(list)) return [];
  return list.map((e) => (e && typeof e.file === "string" ? e.file : String(e)));
}

/* THE ENGINE, a function of (root, the file list, the literal map), shared by every
   fixture row and by the REAL ROW. It returns refusals as strings so a row can assert the
   EXACT text; an empty array is the only green.

   ONE REFUSAL PER NAMED FILE, in the order UNLISTED, MISSING, NOT-A-REGULAR-FILE,
   MISMATCH. UNLISTED comes first because a path this cell holds no literal for is a path
   it can say nothing at all about: whether the bytes are there, and what they are, are
   questions that only mean something once the path is pinned. */
function approvedPin(root, files, literal) {
  if (!Array.isArray(files) || files.length === 0) return ["APPROVED-PIN LIST-EMPTY"];
  const refusals = [];
  for (const file of files) {
    if (!Object.hasOwn(literal, file)) { refusals.push("APPROVED-PIN UNLISTED " + file); continue; }
    const full = path.join(root, ...file.split("/"));
    let st = null;
    try { st = fs.lstatSync(full); } catch { st = null; }
    if (st === null) { refusals.push("APPROVED-PIN MISSING " + file); continue; }
    if (!st.isFile()) { refusals.push("APPROVED-PIN NOT-A-REGULAR-FILE " + file); continue; }
    if (sha256(fs.readFileSync(full)) !== literal[file]) refusals.push("APPROVED-PIN MISMATCH " + file);
  }
  return refusals;
}

const txt = (s) => Buffer.from(s, "utf8");

/* A throwaway approved set: two reference files under a fixture root, with the pack-shaped
   09-18 pair beside them for the C.5.3 row. */
const REF_A = "rebuild/m1/approved-2026-09-08/Earned-refinement-A.html";
const REF_C = "rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html";
const PACK_A = "rebuild/m1/approved-2026-09-18/ref/prototype.html";
const PACK_C = "rebuild/m1/approved-2026-09-18/ref/additions.html";

const BODY = Object.freeze({
  [REF_A]: "<html><body>Refinement A</body></html>\n",
  [REF_C]: "<html><body>Additions C</body></html>\n",
  [PACK_A]: "<html><body>the 09-18 prototype</body></html>\n",
  [PACK_C]: "<html><body>the 09-18 additions</body></html>\n",
});

function writeAt(root, rel, bytes) {
  const full = path.join(root, ...rel.split("/"));
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, bytes);
  return full;
}

/* Builds the four files and the literal map over the TWO 09-08 references, which is what
   design.APPROVED names today. The literal comes from BODY, not from a read of what was
   written: an expectation generated by the code under test asserts nothing. */
function withRefs(body) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "s9c-approved-"));
  try {
    for (const rel of Object.keys(BODY)) writeAt(root, rel, txt(BODY[rel]));
    const literal = {};
    for (const rel of [REF_A, REF_C].sort(byteCompare)) literal[rel] = sha256(txt(BODY[rel]));
    return body(root, [REF_A, REF_C], Object.freeze(literal));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test("GREEN CONTROL: the two named references against their own literals refuse nothing", () => {
  withRefs((root, files, literal) => {
    assert.deepEqual(approvedPin(root, files, literal), []);
  });
});

/* R12's mitigation, and the reason the cell refuses rather than looping over nothing. */
test("LIST-EMPTY: an empty design.APPROVED refuses, and never passes vacuously", () => {
  withRefs((root, files, literal) => {
    void files;
    assert.deepEqual(approvedPin(root, [], literal), ["APPROVED-PIN LIST-EMPTY"]);
    assert.deepEqual(approvedPin(root, namesOf({}), literal), ["APPROVED-PIN LIST-EMPTY"]);
    assert.deepEqual(approvedPin(root, namesOf({ APPROVED: [] }), literal), ["APPROVED-PIN LIST-EMPTY"]);
  });
});

test("MISMATCH: a named file whose bytes moved is refused, naming the path", () => {
  withRefs((root, files, literal) => {
    writeAt(root, REF_C, txt("<html><body>Additions C, edited</body></html>\n"));
    assert.deepEqual(approvedPin(root, files, literal), ["APPROVED-PIN MISMATCH " + REF_C]);
  });
});

test("MISSING: a named file that is not on disk is refused rather than skipped", () => {
  withRefs((root, files, literal) => {
    fs.rmSync(path.join(root, ...REF_A.split("/")));
    assert.deepEqual(approvedPin(root, files, literal), ["APPROVED-PIN MISSING " + REF_A]);
  });
});

/* R4 N8, ADOPTED. Reading the list at run time is necessary and not sufficient: without
   this refusal a list that moved to files the literal has never heard of passes over a
   loop that checks nothing. */
test("UNLISTED: a named file with no literal entry is refused, naming the path", () => {
  withRefs((root, files, literal) => {
    void files;
    const narrowed = Object.freeze({ [REF_A]: literal[REF_A] });
    assert.deepEqual(approvedPin(root, [REF_A, REF_C], narrowed), ["APPROVED-PIN UNLISTED " + REF_C]);
    assert.deepEqual(approvedPin(root, [REF_A, REF_C], Object.freeze({})),
      ["APPROVED-PIN UNLISTED " + REF_A, "APPROVED-PIN UNLISTED " + REF_C]);
  });
});

/* THE CASE C.5.3 IS WRITTEN FOR. On the day C-UI-1 seals inside this package,
   design.APPROVED may have moved to the 09-18 pack. Both new files EXIST, so MISSING
   cannot fire and MISMATCH cannot fire; without R4 N8's UNLISTED the cell would run a loop
   over two files it has no literal for and report nothing at all. It refuses, by name,
   twice, which is what turns a silent pin move into a named one. */
test("C.5.3: design.APPROVED moved to two DIFFERENT files that exist refuses both", () => {
  withRefs((root, files, literal) => {
    void files;
    for (const rel of [PACK_A, PACK_C]) {
      assert.ok(fs.existsSync(path.join(root, ...rel.split("/"))),
        "both moved files must EXIST, or this row proves only MISSING");
    }
    assert.deepEqual(approvedPin(root, [PACK_A, PACK_C], literal),
      ["APPROVED-PIN UNLISTED " + PACK_A, "APPROVED-PIN UNLISTED " + PACK_C]);
  });
});

/* B.8's fourth row for this cell, and the pair that makes it worth having: the coordinated
   edit R1 BLOCKING-4 found. The reference's bytes move AND design.cjs's matching constant
   moves with them, in one commit. The design.test.cjs:15-:20 shape - hash the file, compare
   it to the module's own constant - is reproduced here and PASSES; readApproved's assert
   (design.cjs:338-:341) is the same comparison and passes too. This cell refuses. */
test("THE COORDINATED EDIT: file and design.cjs constant moved together, and only this cell refuses", () => {
  withRefs((root, files, literal) => {
    const edited = "<html><body>Refinement A, quietly restyled</body></html>\n";
    writeAt(root, REF_A, txt(edited));
    /* design.cjs after the same commit: the constant moved with the file. */
    const moduleAfter = { APPROVED: [{ file: REF_A, sha256: sha256(txt(edited)) },
      { file: REF_C, sha256: sha256(txt(BODY[REF_C])) }] };

    for (const entry of moduleAfter.APPROVED) {
      const bytes = fs.readFileSync(path.join(root, ...entry.file.split("/")));
      assert.equal(sha256(bytes), entry.sha256,
        "the design.test.cjs:15-:20 shape must PASS here, or the row is not the attack");
    }
    assert.deepEqual(approvedPin(root, namesOf(moduleAfter), literal),
      ["APPROVED-PIN MISMATCH " + REF_A]);
  });
});

/* The structural half of the same point: the engine is handed PATHS, so a design.APPROVED
   whose sha256 agrees with the file cannot make this cell agree with either of them. */
test("the verdict comes from THIS cell's literal, never from design.APPROVED's sha256", () => {
  withRefs((root, files, literal) => {
    void files;
    const lying = Object.freeze({ ...literal, [REF_A]: "b".repeat(64) });
    const mod = { APPROVED: [{ file: REF_A, sha256: sha256(txt(BODY[REF_A])) }] };
    assert.deepEqual(approvedPin(root, namesOf(mod), lying), ["APPROVED-PIN MISMATCH " + REF_A]);
  });
});

function tryLink(target, linkPath, type) {
  try { fs.symlinkSync(target, linkPath, type); return null; }
  catch (e) { return e.code || String(e); }
}

/* R4 N1.2, ADOPTED, and the same attack PACK-PIN closes: readFileSync follows a link and
   git cat-file blob does not, so an approved reference replaced by a link to a copy of the
   same bytes would read green while the tree had changed.

   WHAT EACH OS'S ROW PROVES. An unprivileged process on linux may create a FILE symlink;
   on Windows it may NOT (measured on the PC: EPERM, no Developer Mode) but it may create a
   DIRECTORY JUNCTION, which needs no privilege. So the file-link half is proved on linux
   and recorded as EPERM on Windows, and the junction half - a directory standing where a
   named file should be - is proved on BOTH. */
test("R4 N1.2 (a): a FILE link in place of a named reference refuses NOT-A-REGULAR-FILE", () => {
  withRefs((root, files, literal) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "s9c-twin-"));
    try {
      const twin = path.join(outside, "twin.html");
      fs.writeFileSync(twin, txt(BODY[REF_A]));
      const target = path.join(root, ...REF_A.split("/"));
      fs.rmSync(target);
      const err = tryLink(twin, target, "file");
      if (err === null) {
        assert.equal(sha256(fs.readFileSync(target)), sha256(txt(BODY[REF_A])),
          "the link must read back as the SAME bytes, or this row is not the attack");
        assert.deepEqual(approvedPin(root, files, literal),
          ["APPROVED-PIN NOT-A-REGULAR-FILE " + REF_A]);
      } else {
        assert.equal(process.platform, "win32",
          "a file link must be buildable by an unprivileged process off win32, got " + err);
        assert.equal(err, "EPERM");
      }
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

test("R4 N1.2 (b): a DIRECTORY link where a named reference should be refuses, on both OS", () => {
  withRefs((root, files, literal) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "s9c-twin-"));
    try {
      fs.mkdirSync(path.join(outside, "d"));
      const target = path.join(root, ...REF_A.split("/"));
      fs.rmSync(target);
      const err = tryLink(path.join(outside, "d"), target, "junction");
      assert.equal(err, null, "a directory junction needs no privilege on either OS, got " + err);
      assert.deepEqual(approvedPin(root, files, literal),
        ["APPROVED-PIN NOT-A-REGULAR-FILE " + REF_A]);
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

/* AT RUN TIME, ON EVERY RUN, NEVER CACHED. The list is re-read from the module object each
   time, so a pin move is followed rather than missed. */
test("the file list is re-read on every call, and the refusals follow it", () => {
  withRefs((root, files, literal) => {
    void files;
    const mod = { APPROVED: [{ file: REF_A }, { file: REF_C }] };
    assert.deepEqual(approvedPin(root, namesOf(mod), literal), []);
    mod.APPROVED = [{ file: PACK_A }, { file: PACK_C }];
    assert.deepEqual(approvedPin(root, namesOf(mod), literal),
      ["APPROVED-PIN UNLISTED " + PACK_A, "APPROVED-PIN UNLISTED " + PACK_C]);
    mod.APPROVED = [];
    assert.deepEqual(approvedPin(root, namesOf(mod), literal), ["APPROVED-PIN LIST-EMPTY"]);
  });
});

test("the refusals come back in design.APPROVED's own order, the same on every OS", () => {
  withRefs((root, files, literal) => {
    void files;
    void literal;
    const none = Object.freeze({});
    assert.deepEqual(approvedPin(root, [REF_A, REF_C], none),
      ["APPROVED-PIN UNLISTED " + REF_A, "APPROVED-PIN UNLISTED " + REF_C]);
    assert.deepEqual(approvedPin(root, [REF_C, REF_A], none),
      ["APPROVED-PIN UNLISTED " + REF_C, "APPROVED-PIN UNLISTED " + REF_A]);
  });
});

/* PARAMETRIC means this row pins no count and no filename: it measures only that the list
   this cell reads is a list of repository-relative, forward-slashed paths. A row that
   pinned "two" or "Earned-refinement-A.html" here would be the fixed-path cell R12 names. */
test("design.APPROVED is readable at run time and is a list of forward-slashed paths", () => {
  const names = namesOf(design);
  assert.ok(Array.isArray(names) && names.length > 0, "design.APPROVED names nothing");
  for (const n of names) {
    assert.equal(typeof n, "string");
    assert.ok(!n.includes("\\"), "a path came back with a backslash: " + n);
    assert.ok(!path.isAbsolute(n), "a path came back absolute: " + n);
  }
  assert.deepEqual([...names], [...new Set(names)], "design.APPROVED names a file twice");
});

test("the literal map, once filled, is held in path byte order", () => {
  const keys = Object.keys(LITERAL);
  assert.deepEqual(keys, [...keys].sort(byteCompare));
  for (const k of keys) assert.match(LITERAL[k], /^[0-9a-f]{64}$/);
});

/* THE REAL ROW. The SAME engine the fixture rows run, over the real repository root, the
   real design.APPROVED read at run time, and this cell's own literal. It is RED on this
   branch by construction: the literal is unfilled, so every file the list names is
   UNLISTED. It does not skip, it is not conditional, and it cannot pass vacuously, because
   an empty list is itself a refusal and an unlisted file is itself a refusal.

   THE LADDER OUT OF RED, for the S9 integrator, in order:
     APPROVED-PIN UNLISTED <each named file>   the literal is unfilled
     (nothing)                                 C.5.3's five steps are done
   Anyone who makes this row green by any other means has removed the cell. */
test("REAL ROW: whatever design.APPROVED names at this head, against this cell's literal", () => {
  const refusals = approvedPin(REPO_ROOT, namesOf(design), LITERAL);
  assert.deepEqual(refusals, [],
    "APPROVED-PIN is not satisfied at this head. Refusals:\n  " + refusals.join("\n  ") +
    "\n(On rebuild/b-s9-prep-pack this is EXPECTED and is the red the cell was written for:" +
    " the literal is unfilled, so every named file is UNLISTED. C.5.3 fills it.)");
});

/* Named so the refusal vocabulary is readable from outside and cannot drift in silence:
   any change to this list is a change to a sealed cell's bytes. */
export const REFUSALS = Object.freeze([
  "APPROVED-PIN LIST-EMPTY",
  "APPROVED-PIN UNLISTED",
  "APPROVED-PIN MISSING",
  "APPROVED-PIN NOT-A-REGULAR-FILE",
  "APPROVED-PIN MISMATCH",
]);

test("the refusal vocabulary is exactly five, and every one of them is reachable above", () => {
  assert.equal(REFUSALS.length, 5);
  assert.deepEqual(REFUSALS, [...new Set(REFUSALS)]);
  for (const r of REFUSALS) assert.match(r, /^APPROVED-PIN [A-Z-]+$/);
});
