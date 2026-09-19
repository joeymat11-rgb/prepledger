#!/usr/bin/env node
/* instruments.test.cjs - THE INSTRUMENTS' OWN CELL (S-R19, S-R20, S-R21, S-R23).
 *
 * THIS CELL IS NOT A CI CELL AND MUST NEVER BECOME ONE. It requires acorn, acorn-walk and
 * eslint-scope, which are a DEV INSTRUMENT the PM installed in the farm outside the
 * repository, required by absolute path. They are never a CI dependency and never copied
 * into any node_modules the repository uses. No step in .github/workflows/rebuild.yml names
 * this file and none may. It runs in a farm scratch:
 *
 *   cd <scratch worktree>
 *   MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York \
 *     node --test rebuild/lanes/c/today-split-spike/test/instruments.test.cjs
 *
 * WHY IT EXISTS. R3 attacked the instruments by hand and found that two of the things the
 * spec says they do, they did not do: the verbatim check was unreachable code, and the last
 * anchor had no ambiguity check while 24 move regions end on a bare two-space brace. Both
 * attacks were one-off commands in a scratch directory that died with the review. Every one
 * of them is a row here, so the next hand re-runs them in twenty seconds instead of
 * believing a report.
 *
 * EVERY RED ROW BELOW WAS RUN AGAINST THE COMMITTED INSTRUMENTS FIRST AND PASSED THERE -
 * that is, the cut exited 0 and the tamper went through. The rows are written so that they
 * fail if that ever becomes true again.
 *
 * R1 BLOCKING-1, AND WHY THE SOURCES COME FROM GIT AND NOT FROM THE WORKING TREE. The first
 * author's tmpTree() copied the three files out of the WORKING TREE. The moment the build's
 * own product commit cut gym-app.mjs, GA-S01's first anchor stopped existing in it, and every
 * row that runs the full table refused: the cell shipped at 10 of 14 and could never be
 * re-run. That is structural, not a typo - part 2 cuts today-app.cjs and would take the
 * remaining ten rows dark the same way. The sources are now read with `git show <ref>:<path>`
 * at a ref the witness block itself NAMES, so this cell keeps running after the files it
 * measures have been cut, and it measures the same bytes the witness was taken on.
 *
 *   SPLIT_TEST_REF=tip node --test ...     to run the whole cell at the chain tip form instead
 */
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const SPIKE = path.join(__dirname, "..");
const resolveAnchors = require(path.join(SPIKE, "resolve.cjs"));
const table = JSON.parse(fs.readFileSync(path.join(SPIKE, "regions.json"), "utf8"));

/* The repository root: walk up until the region table's own `today` directory is under it. */
function repoRoot() {
  let d = SPIKE;
  for (let i = 0; i < 8; i += 1) {
    if (fs.existsSync(path.join(d, table.today, "today-app.cjs"))) return d;
    d = path.dirname(d);
  }
  throw new Error("cannot find " + table.today + " above " + SPIKE);
}
const ROOT = repoRoot();
const FILES = Object.keys(table.files);

/* THE REF THIS CELL MEASURES AT (R1 BLOCKING-1). It is one of the witness block's own named
   refs, so the cell cannot drift from the table: `s9` is the S9 lane head, which is this
   build's base and the form the product cut was taken from. */
const REF_NAME = process.env.SPLIT_TEST_REF || "s9";
const REF_ROW = (table.witness.refs || []).find((r) => r.name === REF_NAME);
if (!REF_ROW) {
  throw new Error("SPLIT_TEST_REF=" + REF_NAME + " is not a ref the witness block names (" +
    (table.witness.refs || []).map((r) => r.name).join(", ") + ")");
}

function gitShow(ref, rel) {
  const res = spawnSync("git", ["-C", ROOT, "show", ref + ":" + rel],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (res.status !== 0) {
    throw new Error("cannot read " + rel + " at " + REF_NAME + " (" + ref + "): " +
      (res.stderr || "").trim() + "\nThis cell reads its sources from a NAMED REF, not from " +
      "the working tree (R1 BLOCKING-1). Run it in a worktree whose git objects hold " + ref + ".");
  }
  return res.stdout;
}

/* The PRE-CUT sources at the named ref, written to a throwaway tree. Nothing here ever
   reads the working tree's copies of the three files, so a cut file in the tree is
   invisible to every row below. */
function tmpTreeAt(refName) {
  const row = (table.witness.refs || []).find((r) => r.name === refName);
  if (!row) throw new Error("no witnessed ref named " + refName);
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "splitb-atk-"));
  fs.mkdirSync(path.join(d, table.today), { recursive: true });
  for (const f of FILES) {
    fs.writeFileSync(path.join(d, table.today, f), gitShow(row.ref, table.today + "/" + f));
  }
  return d;
}
function tmpTree() { return tmpTreeAt(REF_NAME); }

/* The ref the PRODUCT files of part 1 were cut from. It is not SPLIT_TEST_REF: the two refs
   differ in today-model.cjs by the plan-sentence block, so only one of them can reproduce a
   committed product file byte for byte, and it is this one. */
const BUILD_REF = "s9";
function readLines(tree, file) {
  return fs.readFileSync(path.join(tree, table.today, file), "utf8").split("\n");
}
function writeLines(tree, file, lines) {
  fs.writeFileSync(path.join(tree, table.today, file), lines.join("\n"));
}
function regionOf(id) {
  for (const [file, rs] of Object.entries(table.files)) {
    const r = rs.find((x) => x.id === id);
    if (r) return { file, r };
  }
  throw new Error("no region " + id);
}
function resolveIn(tree, id) {
  const { file, r } = regionOf(id);
  const lines = readLines(tree, file);
  const at = resolveAnchors(lines, r, file, (m) => { throw new Error("REFUSED: " + m); });
  return { file, r, lines, ...at };
}
function runCut(tree, extra) {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "splitb-out-"));
  const res = spawnSync(process.execPath,
    [path.join(SPIKE, "cut.cjs"), "--root", tree, "--out", out].concat(extra || []),
    { encoding: "utf8" });
  return { status: res.status, stdout: res.stdout || "", stderr: res.stderr || "", out };
}
function runNode(script, args) {
  const res = spawnSync(process.execPath, [path.join(SPIKE, script)].concat(args), { encoding: "utf8" });
  return { status: res.status, stdout: res.stdout || "", stderr: res.stderr || "" };
}

/* ---- S-R19: the witness exists and is recorded at named refs ------------------------- */

test("S-R19 the witness block records a sha256 and a line count per move and replace region, at named refs", () => {
  assert.ok(table.witness, "regions.json carries no witness block");
  const refs = table.witness.refs.map((r) => r.name);
  assert.ok(refs.length >= 2, "the witness must be taken at BOTH the chain tip form and the S9 lane head form");
  for (const r of table.witness.refs) {
    assert.match(r.ref, /^[0-9a-f]{40}$/, "ref " + r.name + " is not a full commit sha");
    assert.ok(r.branch, "ref " + r.name + " has no branch recorded");
  }
  let n = 0;
  for (const rs of Object.values(table.files)) {
    for (const r of rs) {
      if (r.kind !== "move" && r.kind !== "replace") continue;
      n += 1;
      const w = table.witness.regions[r.id];
      assert.ok(w, r.id + " has no witness");
      for (const name of refs) {
        assert.match(String(w[name].sha256), /^[0-9a-f]{64}$/, r.id + " at " + name);
        assert.ok(w[name].lines > 0, r.id + " at " + name + " has no line count");
      }
    }
  }
  assert.ok(n >= 45, "expected at least 45 witnessed regions, saw " + n);
  for (const name of refs) {
    for (const f of FILES) {
      assert.ok(typeof table.witness.movedLines[name][f] === "number",
        "no per-file moved-line total for " + f + " at " + name + " (S-R20)");
    }
  }
});

test("the cut refuses outright when regions.json carries no witness (a generator cannot be its own check)", () => {
  const tree = tmpTree();
  const bare = JSON.parse(JSON.stringify(table));
  delete bare.witness;
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bare));
  const r = runCut(tree, ["--regions", rf]);
  assert.notStrictEqual(r.status, 0);
  assert.match(r.stderr, /carries no witness/);
});

/* ---- the baseline: the untampered tree passes --------------------------------------- */

test("the untampered tree passes the witness, and every file agrees on one recorded ref", () => {
  const tree = tmpTree();
  const r = runCut(tree);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.match(r.stdout, /WITNESS CHECK \(S-R19, S-R20\)/);
  assert.match(r.stdout, /every one matched, every file agreed on one ref/);
  for (const f of FILES) {
    assert.match(r.stdout, new RegExp(f.replace(/\./g, "\\.") + "\\s+witnessed at "));
  }
});

/* ---- RED 1: S-R19, R3's own attack -------------------------------------------------- */

test("RED S-R19: weakening the sleep writer's double-write fence inside TA-S30 is REFUSED by region id", () => {
  const tree = tmpTree();
  const { file, lines, start, end } = resolveIn(tree, "TA-S30");
  const FENCE = "    if (sleepBusy || sleepUnknown || sleepReadBack) return;";
  const at = lines.slice(start - 1, end).indexOf(FENCE);
  assert.ok(at >= 0, "the sleep writer's fence line is not inside TA-S30 any more; re-read the region");
  lines[start - 1 + at] = "    if (sleepBusy) return;";
  writeLines(tree, file, lines);
  const r = runCut(tree);
  assert.strictEqual(r.status, 1, "THE CUT EXITED 0 ON A WEAKENED DOUBLE-WRITE FENCE. " +
    "That is exactly R3's BLOCKING-1 and the witness is not being compared. " + r.stdout);
  assert.match(r.stderr, /REFUSED: today-app\.cjs TA-S30: BYTES DO NOT MATCH THE WITNESS/);
});

/* ---- RED 2 and 3: S-R20, R3's two last-anchor attacks -------------------------------- */

test("RED S-R20 (a): two statement-aligned lines inserted inside TA-S19 leave a writer released and are REFUSED", () => {
  const tree = tmpTree();
  const { file, lines, start } = resolveIn(tree, "TA-S19");
  lines.splice(start, 0, "  if (options.debugHook) {", "  }");
  writeLines(tree, file, lines);
  const r = runCut(tree);
  assert.strictEqual(r.status, 1, "THE CUT EXITED 0 WITH TA-S19 SHRUNK AND measureDeps LEFT RELEASED. " + r.stdout);
  assert.match(r.stderr, /REFUSED: today-app\.cjs TA-S19: LAST ANCHOR IS AMBIGUOUS/);
  assert.match(r.stderr, /the witness records/);
});

test("RED S-R20 (b): one space added to TA-S24's own closing brace drags released code into the seal and is REFUSED", () => {
  const tree = tmpTree();
  const { file, lines, end } = resolveIn(tree, "TA-S24");
  assert.strictEqual(lines[end - 1], "  }", "TA-S24 no longer ends on a bare two-space brace");
  lines[end - 1] = "  }  ";
  writeLines(tree, file, lines);
  const r = runCut(tree);
  assert.strictEqual(r.status, 1, "THE CUT EXITED 0 WITH TA-S24 EXTENDED OVER reasonOf. " + r.stdout);
  assert.match(r.stderr, /REFUSED: today-app\.cjs TA-S24: LAST ANCHOR IS AMBIGUOUS/);
});

/* ---- RED 4 and 5: the first anchor, kept from D.1's red-first test 2 ------------------ */

test("RED: a first anchor altered by one character is REFUSED naming the region", () => {
  const tree = tmpTree();
  const { file, r, lines, start } = resolveIn(tree, "TA-S13");
  lines[start - 1] = lines[start - 1] + " ";
  writeLines(tree, file, lines);
  const res = runCut(tree);
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, new RegExp("REFUSED: " + file.replace(/\./g, "\\.") + " " + r.id +
    ": first anchor matches ZERO places"));
});

test("RED: a first anchor duplicated so it matches twice is REFUSED as ambiguous", () => {
  const tree = tmpTree();
  const { file, r, lines, start } = resolveIn(tree, "TA-S09");
  lines.splice(start - 1, 0, lines[start - 1]);
  writeLines(tree, file, lines);
  const res = runCut(tree);
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, new RegExp("REFUSED: " + file.replace(/\./g, "\\.") + " " + r.id +
    ": first anchor matches 2 places and the table gives no disambiguating index"));
});

/* ---- RED 6: S-R21, the third kind ---------------------------------------------------- */

test("S-R21: the five boot seams are declared `replace` rows, each with its replacement text", () => {
  const rows = [];
  for (const [file, rs] of Object.entries(table.files)) {
    for (const r of rs) if (r.kind === "replace") rows.push({ file, r });
  }
  const boot = rows.filter(({ r }) => /BOOT SEAM/.test(r.note || ""));
  assert.strictEqual(boot.length, 5, "S-R21 rules FIVE boot seams as replace regions, saw " + boot.length);
  for (const { r } of rows) {
    assert.ok(Array.isArray(r.replacement) && r.replacement.length,
      r.id + " is kind replace with no declared replacement row");
    assert.ok(r.note, r.id + " has no note saying what it is");
  }
  /* The gym cut's own released rewrites are replace rows too, and every one of them is a
     declared statement rewrite the build report lists. They are counted separately from the
     five boot seams so that a later round cannot quietly turn one into the other. */
  assert.ok(rows.length > boot.length, "the gym cut's released rewrites are replace rows as well");
});

test("RED S-R21: a `replace` region with no declared replacement is REFUSED", () => {
  const tree = tmpTree();
  const bad = JSON.parse(JSON.stringify(table));
  let id = null;
  for (const rs of Object.values(bad.files)) {
    for (const r of rs) if (r.kind === "replace" && !id) { id = r.id; delete r.replacement; }
  }
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf]);
  assert.strictEqual(r.status, 1);
  assert.match(r.stderr, new RegExp(id + ': kind "replace" with no declared `replacement` row'));
});

/* ---- S-R23: the interface names are chosen by measurement ---------------------------- */

test("S-R23: the three interface names are declared in the table and `on` is recorded as rejected", () => {
  const i = table.interface;
  assert.ok(i, "regions.json carries no interface block");
  assert.ok(i.facade && i.callbacks && i.painter, "the three names are not all declared");
  assert.ok(i.rejected && i.rejected.on, "`on` must be recorded as rejected with its measurement (R3 BLOCKING-4)");
  assert.match(i.rejected.on, /2027/, "the rejection must cite the lines the parser found");
});

test("S-R23 RED: the name census says `on` is NOT free and says where, and says the three chosen names are", () => {
  const tree = tmpTree();
  const cut = runCut(tree);
  assert.strictEqual(cut.status, 0, cut.stderr);
  const names = [table.interface.facade, table.interface.callbacks, table.interface.painter, "on"];
  const r = runNode("capture.cjs", ["--root", tree, "--out", cut.out, "--names", names.join(",")]);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.match(r.stdout, /\| on \| 2 \|/, "THE NAME CENSUS SAYS `on` IS FREE. R3 measured two occurrences " +
    "in code position at today-app.cjs:2027-:2028, inside the MOVE region TA-S33. " + r.stdout);
  assert.match(r.stdout, /NOT FREE: today-lanes\.cjs:\d+ today-lanes\.cjs:\d+/);
  for (const n of names.slice(0, 3)) {
    assert.match(r.stdout, new RegExp("\\| " + n + " \\| 0 \\|"), n + " is not free in code position");
  }
});

test("S-R23: capture.cjs reports ZERO name captures on the cut's own output", () => {
  const tree = tmpTree();
  const cut = runCut(tree);
  assert.strictEqual(cut.status, 0, cut.stderr);
  const r = runNode("capture.cjs", ["--root", tree, "--out", cut.out]);
  assert.strictEqual(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /NAME CAPTURES \(resolves to a different declaration after the cut\): 0/);
});

/* ---- S-R23 / R3 NOTE-2: the census runs on ANY output directory ---------------------- */

test("S-R23: census.cjs takes its pairs from the table and runs on a directory with no line map", () => {
  const tree = tmpTree();
  const cut = runCut(tree);
  assert.strictEqual(cut.status, 0, cut.stderr);
  const withMap = runNode("census.cjs", ["--root", tree, "--out", cut.out]);
  assert.strictEqual(withMap.status, 0, withMap.stderr);
  assert.match(withMap.stdout, /the instrument's own residue \(unresolved AND not declared in the source file either\): 0/);

  const noMap = fs.mkdtempSync(path.join(os.tmpdir(), "splitb-nomap-"));
  for (const f of fs.readdirSync(cut.out)) {
    if (f === "linemap.json" || f === "cut-report.json") continue;
    fs.copyFileSync(path.join(cut.out, f), path.join(noMap, f));
  }
  const r = runNode("census.cjs", ["--root", tree, "--out", noMap]);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.match(r.stdout, /crossings: \d+ references/);
});

/* ---- R1 BLOCKING-1: this cell survives the cut it measures ---------------------------- */

test("R1 BLOCKING-1: the sources come from the NAMED REF, so this cell still runs after a file has been cut", () => {
  const tree = tmpTree();
  /* The proof is a difference: the working tree's gym-app.mjs HAS been cut, the ref's has
     not, and this cell reads the ref's. A cell that read the working tree would see the cut
     file here and every full-table row would refuse on GA-S01's first anchor, which is
     exactly the state R1 measured at the shipped head. */
  const fromTree = fs.readFileSync(path.join(ROOT, table.today, "gym-app.mjs"), "utf8");
  const fromRef = fs.readFileSync(path.join(tree, table.today, "gym-app.mjs"), "utf8");
  assert.notStrictEqual(fromRef, fromTree,
    "the working tree's gym-app.mjs and the ref's are identical, so this row proves nothing " +
    "here; it is written for the tree AFTER the cut, which is where R1 found the cell dark");
  assert.ok(fromRef.includes("  let settingsLane = settings || null;"),
    "GA-S01's first anchor is not in the source at " + REF_NAME + "; the ref or the table is wrong");
  assert.strictEqual(fromTree.includes("  let settingsLane = settings || null;"), false,
    "gym-app.mjs in the working tree still holds GA-S01's first anchor, so it has not been cut");
  const r = runCut(tree);
  assert.strictEqual(r.status, 0, r.stderr);
});

/* ---- R1 NOTE-2 and R1's own check 4: the product cut IS the bytes that ship ------------ */

test("the PRODUCT cut at the build's base ref reproduces the four committed product files BYTE FOR BYTE", () => {
  const tree = tmpTreeAt(BUILD_REF);
  const r = runCut(tree, ["--product", "--only", "today-model.cjs,gym-app.mjs"]);
  assert.strictEqual(r.status, 0, r.stderr);
  const crypto = require("crypto");
  const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
  const PRODUCT_FILES = ["today-model.cjs", "today-readings.cjs", "gym-app.mjs", "gym-settings-lane.mjs"];
  const rows = [];
  for (const f of PRODUCT_FILES) {
    const built = path.join(r.out, f);
    const shipped = path.join(ROOT, table.today, f);
    assert.ok(fs.existsSync(built), "the product cut wrote no " + f);
    assert.ok(fs.existsSync(shipped), "the tree holds no " + f);
    const a = sha(built), b = sha(shipped);
    rows.push("    " + f.padEnd(24) + (a === b ? "IDENTICAL " : "DIFFERS   ") + a.slice(0, 16) + "...");
    assert.strictEqual(a, b,
      "THE COMMITTED " + f + " IS NOT WHAT THE CODEMOD PRODUCES FROM " + BUILD_REF + ". Either a " +
      "hand edited a product file outside the declared table, or the table changed under it. " +
      "This row is the mechanical form of R1's own check 4 (\"an unlisted hand-written line\"), " +
      "and it is what lets capture.cjs run on the bytes that ship (R1 NOTE-2): the line map in " +
      "this output directory is the line map OF THOSE BYTES.");
  }
  console.log("  product cut at " + REF_NAME + " vs the committed files:");
  for (const l of rows) console.log(l);
  /* And therefore capture.cjs, run here, is run on the shipped bytes with a line map. */
  const cap = runNode("capture.cjs", ["--root", tree, "--out", r.out]);
  assert.strictEqual(cap.status, 0, cap.stdout + cap.stderr);
  assert.match(cap.stdout, /NAME CAPTURES \(resolves to a different declaration after the cut\): 0/);
  assert.doesNotMatch(cap.stdout, /NO LINE MAP/,
    "R1 NOTE-2: capture.cjs must run its comparison, not skip it for want of a line map");
});

/* ---- R1 NOTE-1: the DECLARED TEXT is witnessed too ------------------------------------ */

test("R1 NOTE-1: the declared-text witness covers every substitution row and every replacement row", () => {
  const D = table.witness.declared;
  assert.ok(D, "regions.json carries no declared-text witness block");
  const subs = table.substitutions || [];
  assert.strictEqual(D.counts.substitutions, subs.length);
  for (const row of subs) {
    assert.match(String((D.substitutions[row.id] || {}).sha256), /^[0-9a-f]{64}$/, row.id);
  }
  let n = 0;
  for (const [file, rs] of Object.entries(table.files)) {
    for (const r of rs) {
      if (r.kind !== "replace") continue;
      n += 1;
      assert.match(String((D.replacements[r.id] || {}).sha256), /^[0-9a-f]{64}$/, r.id + " in " + file);
    }
  }
  assert.strictEqual(D.counts.replacements, n);
});

test("RED R1 NOTE-1: rewriting W6d's `to` so the seal reports success whatever the client answered is REFUSED by row id", () => {
  const tree = tmpTree();
  const bad = JSON.parse(JSON.stringify(table));
  const row = bad.substitutions.find((s) => s.id === "W6d");
  assert.ok(row, "W6d is not in the table any more; re-read section 5 of the build report");
  /* R1's own attack, verbatim: every moved byte stays verbatim and the pre-image witness
     cannot see it, because the pre-image was never touched. */
  row.to = "    setMessage({ ok: true, state: result.state, copy: result.copy });";
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf, "--product", "--only", "today-model.cjs,gym-app.mjs"]);
  assert.strictEqual(r.status, 1, "THE CUT EXITED 0 ON A REWRITTEN SUBSTITUTION AND PUT THE " +
    "TAMPERED LINE INTO today-readings.cjs. That is R1 NOTE-1 exactly. " + r.stdout);
  assert.match(r.stderr, /REFUSED: substitution row W6d \(today-model\.cjs TM-S02\): DECLARED TEXT DOES NOT MATCH THE WITNESS/);
});

test("RED R1 NOTE-1: a replacement row's text rewritten is REFUSED by row id", () => {
  const tree = tmpTree();
  const bad = JSON.parse(JSON.stringify(table));
  let id = null;
  for (const rs of Object.values(bad.files)) {
    for (const r of rs) {
      if (r.kind === "replace" && Array.isArray(r.replacement) && !id) {
        id = r.id;
        r.replacement = r.replacement.map((l) => l.replace("hooks.", "hooksTampered."));
      }
    }
  }
  assert.ok(id, "no replacement row to tamper");
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf]);
  assert.strictEqual(r.status, 1, r.stdout);
  assert.match(r.stderr, new RegExp("REFUSED: replacement row " + id + " .*DECLARED TEXT DOES NOT MATCH THE WITNESS"));
});

test("RED R1 NOTE-1: a substitution row ADDED to the table is REFUSED by the recorded row count", () => {
  const tree = tmpTree();
  const bad = JSON.parse(JSON.stringify(table));
  bad.substitutions.push({ id: "W9z", file: "today-model.cjs", region: "TM-S02",
    from: "if (adoptedRead)", to: "if (false)", kind: "statement rewrite", why: "planted" });
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf]);
  assert.strictEqual(r.status, 1, "A NEW SUBSTITUTION ROW REACHED A PRODUCT FILE UNWITNESSED. " + r.stdout);
  assert.match(r.stderr, /the table declares 8 substitution rows; the declared-text witness records 7/);
});

/* ---- R2 F4: the PRODUCT and COMPOSE blocks are witnessed the same way ------------------
 * R1 NOTE-1 closed the silent path through a substitution's `to`. R2 drove a line through
 * the block beside it: it dropped `Object.freeze(` from gym-settings-lane.mjs's read-only
 * facade in regions.json's `product` block, changed no source byte, and the cut wrote an
 * UNFROZEN facade and exited 0. Those two blocks carry more authored bytes than every
 * substitution row put together, and part 2's interface over 679 moved lines puts the same
 * hole on a much larger surface. The rows below are R2's own attack and its twin.        */

test("R2 F4: the declared-text witness covers every product block and every compose block", () => {
  const D = table.witness.declared;
  assert.ok(D, "regions.json carries no declared-text witness block");
  const prods = Object.keys(table.product || {});
  const comps = Object.keys(table.compose || {});
  assert.strictEqual(D.counts.products, prods.length, "product block count");
  assert.strictEqual(D.counts.composes, comps.length, "compose block count");
  for (const dest of prods) {
    assert.match(String((D.products[dest] || {}).sha256), /^[0-9a-f]{64}$/, dest);
  }
  for (const file of comps) {
    assert.match(String((D.composes[file] || {}).sha256), /^[0-9a-f]{64}$/, file);
  }
});

test("RED R2 F4: dropping Object.freeze from the read-only facade in the product block is REFUSED by name", () => {
  const tree = tmpTree();
  const bad = JSON.parse(JSON.stringify(table));
  const P = bad.product["gym-settings-lane.mjs"];
  assert.ok(P && Array.isArray(P.close), "no product block for gym-settings-lane.mjs");
  const i = P.close.findIndex((l) => /facade: Object\.freeze\(\{/.test(l));
  assert.ok(i >= 0, "the read-only facade line is not in the product block any more");
  /* R2's attack, verbatim. */
  P.close[i] = P.close[i].replace("Object.freeze({", "({");
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf, "--product", "--only", "gym-app.mjs"]);
  assert.strictEqual(r.status, 1, "THE CUT WROTE AN UNFROZEN READ-ONLY FACADE AND EXITED 0. " +
    "That is R2 F4 exactly. " + r.stdout);
  assert.match(r.stderr, /REFUSED: product block gym-settings-lane\.mjs: DECLARED TEXT DOES NOT MATCH THE WITNESS/);
  assert.ok(!fs.existsSync(path.join(tree, "..", "nope")), "no output was written");
});

test("RED R2 F4: a compose line rewritten so the released half composes the seal differently is REFUSED by name", () => {
  const tree = tmpTree();
  const bad = JSON.parse(JSON.stringify(table));
  const w = bad.compose["today-model.cjs"];
  assert.ok(w && Array.isArray(w.insert), "no compose block for today-model.cjs");
  const i = w.insert.findIndex((l) => l.indexOf("setMessage:") >= 0);
  assert.ok(i >= 0, "the setMessage injection is not in the compose block any more");
  /* The one road by which the seal sets the released lastMessage, silently cut. */
  w.insert[i] = w.insert[i].replace("setMessage: (m) => { lastMessage = m; }", "setMessage: () => {}");
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf, "--product", "--only", "today-model.cjs"]);
  assert.strictEqual(r.status, 1, "THE CUT WROTE A RELEASED HALF THAT NEVER HEARS THE SEAL'S " +
    "REFUSALS AND EXITED 0. " + r.stdout);
  assert.match(r.stderr, /REFUSED: compose block today-model\.cjs: DECLARED TEXT DOES NOT MATCH THE WITNESS/);
});

test("RED R2 F4: a product block ADDED to the table is REFUSED, by name and then by the recorded count", () => {
  const tree = tmpTree();
  const planted = { why: "planted", head: ['"use strict";'],
    open: "function createPlanted() {", close: ["}"] };
  /* (a) with no witness of its own, it is refused BY NAME. */
  const bad = JSON.parse(JSON.stringify(table));
  bad.product["planted-lane.cjs"] = JSON.parse(JSON.stringify(planted));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-"));
  const rf = path.join(dir, "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf]);
  assert.strictEqual(r.status, 1, "A NEW PRODUCT BLOCK REACHED THE TABLE UNWITNESSED. " + r.stdout);
  assert.match(r.stderr, /REFUSED: product block planted-lane\.cjs: NO DECLARED WITNESS/);
  /* (b) and with a CORRECT digest forged for it - the attacker computing the block's own
     sha256 the way the generator would - the RECORDED COUNT still refuses it, so adding a
     digest beside a new block cannot smuggle it in without re-taking the counts, which is
     a visible diff in regions.json. */
  const worse = JSON.parse(JSON.stringify(bad));
  const crypto = require("crypto");
  const sha = crypto.createHash("sha256").update(JSON.stringify(
    ["planted-lane.cjs", planted.head, planted.open, planted.close]), "utf8").digest("hex");
  worse.witness.declared.products["planted-lane.cjs"] =
    { sha256: sha, headLines: 1, closeLines: 1 };
  const rf2 = path.join(dir, "regions-2.json");
  fs.writeFileSync(rf2, JSON.stringify(worse));
  const r2 = runCut(tree, ["--regions", rf2]);
  assert.strictEqual(r2.status, 1, r2.stdout);
  assert.match(r2.stderr, /the table declares 3 product blocks; the declared-text witness records 2/);
});
