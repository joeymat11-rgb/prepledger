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
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const SPIKE = path.join(__dirname, "..");
const resolveAnchors = require(path.join(SPIKE, "resolve.cjs"));
/* the DEV instrument, exactly as cut.cjs locates it: outside the repository, by absolute
   path, never a CI dependency and never copied into a node_modules this repository uses. */
const INSTRUMENT = process.env.CENSUS_INSTRUMENT || "/home/claude/farm/tools/census/node_modules";
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
function gitBlob(ref, rel) {
  const res = spawnSync("git", ["-C", ROOT, "rev-parse", ref + ":" + rel],
    { encoding: "utf8" });
  if (res.status !== 0) throw new Error("cannot identify " + rel + " at " + ref);
  return res.stdout.trim();
}
function rawGitBlob(bytes) {
  return crypto.createHash("sha1").update(Buffer.from("blob " + bytes.length + "\0", "utf8"))
    .update(bytes).digest("hex");
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

/* ---- S-R31: the whole SOURCE blob is pinned before anchor resolution ---------------- */

test("RED S-R31: every named ref records the complete Git blob identity of every cut source", () => {
  const sources = table.witness.sourceBlobs;
  assert.ok(sources, "the witness records no SOURCE blob identities");
  for (const ref of table.witness.refs) {
    assert.deepStrictEqual(Object.keys(sources[ref.name] || {}).sort(), FILES.slice().sort(),
      "the SOURCE blob inventory is incomplete at " + ref.name);
    for (const file of FILES) {
      const row = sources[ref.name][file];
      assert.ok(row, file + " has no SOURCE blob identity at " + ref.name);
      assert.strictEqual(row.path, table.today + "/" + file, file + " path at " + ref.name);
      assert.match(String(row.oid), /^[0-9a-f]{40}$/, file + " Git blob oid at " + ref.name);
      assert.strictEqual(row.oid, gitBlob(ref.ref, row.path), file + " Git blob oid at " + ref.name);
    }
  }
});

test("RED S-R31: gen-witness records the complete SOURCE blob inventory for its named ref", () => {
  const tree = tmpTreeAt("s9");
  const bad = JSON.parse(JSON.stringify(table));
  bad.witness.sourceBlobs = JSON.parse(JSON.stringify(bad.witness.sourceBlobs || {}));
  delete bad.witness.sourceBlobs.s9;
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const ref = table.witness.refs.find((x) => x.name === "s9");
  const w = runNode("gen-witness.cjs", ["--root", tree, "--ref-name", ref.name,
    "--ref", ref.ref, "--branch", ref.branch, "--regions", rf, "--write"]);
  assert.strictEqual(w.status, 0, w.stderr);
  const made = JSON.parse(fs.readFileSync(rf, "utf8"));
  assert.deepStrictEqual(Object.keys((made.witness.sourceBlobs || {}).s9 || {}).sort(),
    FILES.slice().sort(), "gen-witness did not record every cut source at s9");
  for (const file of FILES) {
    const row = made.witness.sourceBlobs.s9[file];
    assert.strictEqual(row.path, table.today + "/" + file, file + " source path");
    assert.strictEqual(row.oid, gitBlob(ref.ref, table.today + "/" + file), file);
  }
});

test("RED S-R31: a missing SOURCE identity is refused by name at the door before anchors resolve", () => {
  const tree = tmpTreeAt("s9");
  const bad = JSON.parse(JSON.stringify(table));
  bad.witness.sourceBlobs = JSON.parse(JSON.stringify(bad.witness.sourceBlobs || {}));
  if (bad.witness.sourceBlobs.s9) delete bad.witness.sourceBlobs.s9["today-app.cjs"];
  bad.files["today-app.cjs"][0].first.text = "PLANTED ANCHOR THAT CANNOT RESOLVE";
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf, "--witness", "s9", "--only", "today-app.cjs"]);
  assert.strictEqual(r.status, 1, "a cut with no SOURCE identity exited 0");
  assert.match(r.stderr, /REFUSED: SOURCE BLOB IDENTITY MISSING: today-app\.cjs at s9/);
  assert.doesNotMatch(r.stderr, /anchor/i, "anchor resolution ran before the SOURCE door");
});

test("S-R31: an invalid SOURCE path is refused by file and ref at the door", () => {
  const tree = tmpTreeAt("s9");
  const bad = JSON.parse(JSON.stringify(table));
  bad.witness.sourceBlobs.s9["today-app.cjs"].path = "wrong/today-app.cjs";
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf, "--witness", "s9", "--only", "today-app.cjs"]);
  assert.strictEqual(r.status, 1, "an invalid SOURCE path exited 0");
  assert.match(r.stderr, /REFUSED: SOURCE BLOB IDENTITY INVALID: today-app\.cjs at s9/);
  assert.doesNotMatch(r.stderr, /anchor/i, "anchor resolution ran before the SOURCE door");
});

test("S-R31: all cut sources must identify one common named ref", () => {
  const tree = tmpTreeAt("s9");
  const tip = table.witness.refs.find((x) => x.name === "tip");
  fs.writeFileSync(path.join(tree, table.today, "today-model.cjs"),
    gitShow(tip.ref, table.today + "/today-model.cjs"));
  const r = runCut(tree);
  assert.strictEqual(r.status, 1, "a mixed-ref source tree exited 0");
  assert.match(r.stderr, /SOURCE BLOB IDENTITIES do not agree on one named ref across the cut sources/);
  assert.doesNotMatch(r.stderr, /anchor/i, "anchor resolution ran before the SOURCE door");
});

test("S-R31: region witnesses are restricted to the ref identified by the complete source", () => {
  const tree = tmpTreeAt("s9");
  const bad = JSON.parse(JSON.stringify(table));
  bad.witness.regions["TA-S01"].s9.sha256 = "0".repeat(64);
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf, "--only", "today-app.cjs"]);
  assert.strictEqual(r.status, 1, "the s9 source borrowed tip's region witness");
  assert.match(r.stderr, /TA-S01: the file's regions do not agree on one witnessed ref\. This region matches tip; the regions before it matched s9/);
});

test("S-R31: SOURCE identity covers raw CRLF bytes before newline normalization", () => {
  const tree = tmpTreeAt("s9");
  const file = path.join(tree, table.today, "today-app.cjs");
  const raw = fs.readFileSync(file);
  const lf = raw.indexOf(10);
  assert.ok(lf >= 0 && raw[lf - 1] !== 13, "the fixture has no LF-only boundary to test");
  fs.writeFileSync(file, Buffer.concat([raw.subarray(0, lf), Buffer.from("\r\n"), raw.subarray(lf + 1)]));
  const r = runCut(tree, ["--witness", "s9", "--only", "today-app.cjs"]);
  assert.strictEqual(r.status, 1, "a raw LF-to-CRLF byte change exited 0");
  assert.match(r.stderr, /REFUSED: SOURCE BLOB IDENTITY MISMATCH: today-app\.cjs at s9/);
  assert.doesNotMatch(r.stderr, /anchor/i, "newline normalization happened before the SOURCE door");
});

test("S-R31: gen-witness refuses changed source under an old ref and requires a new ref", () => {
  const tree = tmpTreeAt("s9");
  const file = path.join(tree, table.today, "today-app.cjs");
  fs.appendFileSync(file, "// SYNTHETIC SOURCE CHANGE\n");
  const bad = JSON.parse(JSON.stringify(table));
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const ref = table.witness.refs.find((x) => x.name === "s9");
  const w = runNode("gen-witness.cjs", ["--root", tree, "--ref-name", ref.name,
    "--ref", ref.ref, "--branch", ref.branch, "--regions", rf, "--write"]);
  assert.strictEqual(w.status, 1, "changed source was re-witnessed under the old ref");
  assert.match(w.stderr, /SOURCE BLOB IDENTITY MISMATCH: today-app\.cjs at s9/);
  assert.match(w.stderr, /requires a new ref/);
});

test("RED S-R31: the exact L3 binding plant is refused at the SOURCE door at both refs", () => {
  const shadow = [
    "function astraShadow() {",
    "  const sleepNightDate = () => \"LOCAL\";",
    "  function renderSleep(focus) {",
    "    const root = template(\"t-sleep\");",
    "    const map = slots(root);",
    "    const date = sleepNightDate();",
    "    readSleepCheckIn(date);",
    "    put(map, \"sleep-title\", SLEEP_TITLE);",
    "    return date;",
    "  }",
    "  return renderSleep(false);",
    "}",
    ""];
  for (const refName of table.witness.refs.map((x) => x.name)) {
    const tree = tmpTreeAt(refName);
    const lines = readLines(tree, "today-app.cjs");
    for (const original of ["    const date = sleepNightDate();", "    readSleepCheckIn(date);"]) {
      const at = lines.indexOf(original);
      assert.ok(at >= 0, original + " is absent at " + refName);
      lines[at] = " " + lines[at];
    }
    writeLines(tree, "today-app.cjs", shadow.concat(lines));
    const r = runCut(tree, ["--witness", refName, "--only", "today-app.cjs"]);
    assert.strictEqual(r.status, 1, "the L3 SOURCE plant exited 0 at " + refName);
    assert.match(r.stderr, new RegExp("REFUSED: SOURCE BLOB IDENTITY MISMATCH: today-app\\.cjs at " + refName));
    assert.doesNotMatch(r.stderr, /TA-I042|anchor/i, "the L3 plant reached anchor resolution at " + refName);
  }
});

test("S-R31: a visible re-witness of the L3 plant is caught by product byte equality", () => {
  const tree = tmpTreeAt("s9");
  const lines = readLines(tree, "today-app.cjs");
  const shadow = [
    "function astraShadow() {",
    "  const sleepNightDate = () => \"LOCAL\";",
    "  function renderSleep(focus) {",
    "    const root = template(\"t-sleep\");",
    "    const map = slots(root);",
    "    const date = sleepNightDate();",
    "    readSleepCheckIn(date);",
    "    put(map, \"sleep-title\", SLEEP_TITLE);",
    "    return date;",
    "  }",
    "  return renderSleep(false);",
    "}",
    ""];
  for (const original of ["    const date = sleepNightDate();", "    readSleepCheckIn(date);"]) {
    const at = lines.indexOf(original);
    assert.ok(at >= 0, original);
    lines[at] = " " + lines[at];
  }
  writeLines(tree, "today-app.cjs", shadow.concat(lines));
  const bad = JSON.parse(JSON.stringify(table));
  const source = fs.readFileSync(path.join(tree, table.today, "today-app.cjs"));
  bad.witness.sourceBlobs.s9["today-app.cjs"].oid = rawGitBlob(source);
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf, "--witness", "s9", "--only", "today-app.cjs", "--product"]);
  assert.strictEqual(r.status, 0, r.stderr);
  const emitted = fs.readFileSync(path.join(r.out, "today-app.cjs"));
  const shipped = fs.readFileSync(path.join(ROOT, table.today, "today-app.cjs"));
  assert.notStrictEqual(crypto.createHash("sha256").update(emitted).digest("hex"),
    crypto.createHash("sha256").update(shipped).digest("hex"),
    "the L3 plant survived a visible re-witness and product equality did not catch it");
});

test("RED S-R31: --unpinned-input is visibly first in the report and can never make a product cut", () => {
  const tree = tmpTreeAt("s9");
  const r = runCut(tree, ["--witness", "s9", "--only", "today-app.cjs", "--unpinned-input"]);
  assert.strictEqual(r.status, 0, r.stderr);
  const raw = fs.readFileSync(path.join(r.out, "cut-report.json"), "utf8");
  const rep = JSON.parse(raw);
  assert.strictEqual(Object.keys(rep)[0], "inputMode", "unpinned input is not at the report top");
  assert.strictEqual(rep.inputMode, "UNPINNED INSTRUMENT INPUT");
  const product = runCut(tree, ["--witness", "s9", "--only", "today-app.cjs",
    "--unpinned-input", "--product"]);
  assert.strictEqual(product.status, 1, "--unpinned-input combined with --product exited 0");
  assert.match(product.stderr, /REFUSED: --unpinned-input is an instrument mode and cannot be combined with --product/);
});

/* ---- the baseline: the untampered tree passes --------------------------------------- */

test("the untampered tree passes the witness, and every file agrees on one recorded ref", () => {
  const tree = tmpTree();
  const r = runCut(tree);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.match(r.stdout, /WITNESS CHECK \(S-R19, S-R20\)/);
  assert.match(r.stdout, /every one matched, every file agreed on one ref/);
  const rep = JSON.parse(fs.readFileSync(path.join(r.out, "cut-report.json"), "utf8"));
  assert.strictEqual(Object.keys(rep)[0], "inputMode", "pinned input is not at the report top");
  assert.strictEqual(rep.inputMode, "PINNED SOURCE BLOBS");
  assert.deepStrictEqual(rep.witness.sourceRefs, [REF_NAME], "the report lost the binding source ref");
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
  const r = runCut(tree, ["--unpinned-input"]);
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
  const r = runCut(tree, ["--unpinned-input"]);
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
  const r = runCut(tree, ["--unpinned-input"]);
  assert.strictEqual(r.status, 1, "THE CUT EXITED 0 WITH TA-S24 EXTENDED OVER reasonOf. " + r.stdout);
  assert.match(r.stderr, /REFUSED: today-app\.cjs TA-S24: LAST ANCHOR IS AMBIGUOUS/);
});

/* ---- RED 4 and 5: the first anchor, kept from D.1's red-first test 2 ------------------ */

test("RED: a first anchor altered by one character is REFUSED naming the region", () => {
  const tree = tmpTree();
  const { file, r, lines, start } = resolveIn(tree, "TA-S13");
  lines[start - 1] = lines[start - 1] + " ";
  writeLines(tree, file, lines);
  const res = runCut(tree, ["--unpinned-input"]);
  assert.strictEqual(res.status, 1);
  assert.match(res.stderr, new RegExp("REFUSED: " + file.replace(/\./g, "\\.") + " " + r.id +
    ": first anchor matches ZERO places"));
});

test("RED: a first anchor duplicated so it matches twice is REFUSED as ambiguous, AND by the recorded count", () => {
  const tree = tmpTree();
  const { file, r, lines, start } = resolveIn(tree, "TA-S09");
  lines.splice(start - 1, 0, lines[start - 1]);
  writeLines(tree, file, lines);
  const res = runCut(tree, ["--unpinned-input"]);
  assert.strictEqual(res.status, 1);
  /* Since loop round 1 the RECORDED COUNT refuses this first, because it is the stronger of
     the two rules: it catches a second occurrence whether or not the row carries an index.
     Both rules are still live, so this row now proves both - the count here, and the older
     ambiguity rule below with the count stripped from that one row. */
  assert.match(res.stderr, new RegExp("REFUSED: " + file.replace(/\./g, "\\.") + " " + r.id +
    ": first anchor matches 2 places and the table RECORDED 1 at its named refs"));
  const bare = JSON.parse(JSON.stringify(table));
  const row = bare.files[file].find((x) => x.id === r.id);
  delete row.first.occurrences;
  for (const n of Object.keys(bare.witness.regions[r.id])) delete bare.witness.regions[r.id][n].occurrences;
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bare));
  const res2 = runCut(tree, ["--regions", rf, "--unpinned-input"]);
  assert.strictEqual(res2.status, 1);
  assert.match(res2.stderr, new RegExp("REFUSED: " + file.replace(/\./g, "\\.") + " " + r.id +
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
  /* THE RESIDUE IS DERIVED, NOT PINNED AT ZERO (loop round 1, blind review F4's class).
     This row asserted a literal 0 and part 2 made it 1: `sleepDraftHeld` is a binding the
     product block's own `open` declares, so it resolves in the OUTPUT and not in the
     SOURCE the census reads its scopes from, which is exactly what "residue" means. A
     literal count makes the receipt wrong the first time the seal declares a binding of
     its own; what has to stay true is that every residue name is one the table DECLARED.
     A name the table never declared still turns this row red. */
  const declaredNew = new Set();
  for (const dest of Object.keys(table.product || {})) {
    for (const l of (table.product[dest].open || []).concat(table.product[dest].head || [])) {
      const m = /^\s*(?:let|const|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)/.exec(l);
      if (m) declaredNew.add(m[1]);
    }
  }
  const res = /the instrument's own residue \(unresolved AND not declared in the source file either\): (\d+)(?: \(([^)]*)\))?/
    .exec(withMap.stdout);
  assert.ok(res, "the census did not print a residue line at all. " + withMap.stdout);
  const residue = (res[2] || "").split(/,\s*/).filter(Boolean);
  assert.strictEqual(residue.length, Number(res[1]), "the census's residue count and its list disagree");
  for (const name of residue) {
    assert.ok(declaredNew.has(name), "THE CENSUS FOUND A RESIDUE NAME THE TABLE NEVER DECLARED: " +
      name + ". Every unresolved name in the seal must be a binding the product block's own " +
      "head or open declares, or the cut has left a name behind. " + withMap.stdout);
  }

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
  /* DERIVED, NOT PINNED (blind review F4). This row named "8 ... 7" from the day part 1 had
     seven substitution rows. Part 2 has forty-eight, so the row failed on its own arithmetic
     while the checker it measures was refusing correctly, and a receipt that says 26/26 was
     wrong about these bytes. The baseline comes from the table the cell actually loaded; the
     +1 is still the whole point of the assertion. */
  const nsubs = table.substitutions.length;
  assert.match(r.stderr, new RegExp("the table declares " + (nsubs + 1) +
    " substitution rows; the declared-text witness records " + nsubs));
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
  /* DERIVED, NOT PINNED (blind review F4), for the reason the substitution row above gives:
     part 1 had two product blocks and part 2 has three. */
  const nprod = Object.keys(table.product).length;
  assert.match(r2.stderr, new RegExp("the table declares " + (nprod + 1) +
    " product blocks; the declared-text witness records " + nprod));
});

/* ---- part 2: the REPLACE kind's own check is the OUTPUT'S PARSE ------------------------
 * The alignment check refuses a region whose BOUNDARY falls inside a statement, because a
 * MOVE there leaves half a statement behind. A one-line `replace` puts its own line back at
 * the same position, so no half is left anywhere, and part 2's interface rows rewrite lines
 * like `if (!foodLane) {` that open a block on purpose. The rule is therefore a move's; what
 * has to hold for a replace is that the bytes the cut WRITES still parse, and that is
 * checked on the output rather than argued from the table.                                */

test("part 2: a one-line `replace` row that opens a block is cut and the output parses", () => {
  const tree = tmpTree();
  const r = runCut(tree, ["--only", "today-app.cjs"]);
  assert.strictEqual(r.status, 0, r.stderr);
  /* The row that used to be refused by the move-boundary rule. */
  assert.match(r.stdout, /today-app\.cjs\s+-> today-lanes\.cjs/);
  const released = fs.readFileSync(path.join(r.out, "today-app.cjs"), "utf8");
  assert.ok(released.indexOf("if (!facade.foodLane()) {") >= 0,
    "the generated interface row for the food lane guard did not reach the released file");
  assert.strictEqual(released.indexOf("if (!foodLane) {"), -1,
    "the pre-image of that row is still in the released file");
});

test("RED part 2: a replacement that drops a brace is REFUSED because the OUTPUT does not parse", () => {
  const tree = tmpTree();
  const bad = JSON.parse(JSON.stringify(table));
  const rows = bad.files["today-app.cjs"];
  const row = rows.find((x) => x.kind === "replace" && Array.isArray(x.replacement)
    && x.replacement.length === 1 && /\{\s*$/.test(x.replacement[0]));
  assert.ok(row, "no block-opening interface row in the table to tamper");
  row.replacement = [row.replacement[0].replace(/\{\s*$/, "")];
  /* Re-bless the declared text, so the refusal under test is the PARSE and not the witness:
     this is the attack of a hand that re-takes the witness after editing a row. Since loop
     round 1 the row must ALSO claim `statementRewrite`, because dropping a brace changes the
     control-flow profile and the new comparison would otherwise refuse first - which makes
     this row stronger, not weaker: it now proves that even a row that has BOUGHT the
     statement-rewrite exemption cannot write a file that does not parse. */
  row.statementRewrite = true;
  const crypto = require("crypto");
  bad.witness.declared.replacements[row.id].sha256 = crypto.createHash("sha256")
    .update(JSON.stringify([row.id, "today-app.cjs", row.replacement, true]), "utf8").digest("hex");
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf, "--only", "today-app.cjs"]);
  assert.strictEqual(r.status, 1, "THE CUT WROTE A RELEASED FILE THAT DOES NOT PARSE AND " +
    "EXITED 0. " + r.stdout);
  assert.match(r.stderr, /THE OUTPUT DOES NOT PARSE/);
  assert.match(r.stderr, /look at this file's declared `replace` rows/);
});

/* ---- LOOP ROUND 1: the blind review's and the incremental review's executed attacks -----
 * Every row below was run against the UNCHANGED instruments first and the attack went
 * through there - that is what "RED FIRST" means here and it is what the two reviewers
 * measured. The commit before this one carries the failure list.                        */

test("RED blind F5 / incremental F1: a COMPETING OCCURRENCE of a content anchor is REFUSED by the recorded occurrence count", () => {
  /* The reviewer prepended a five-line helper that declares its OWN `sleepNightDate` and its
     own `    const date = sleepNightDate();`. That text became occurrence #1 of TA-I042's
     anchor, the real target slid to #2, and the cut exited 0 at BOTH refs having rewritten
     the WRONG lexical binding: run with a facade returning "SEALED" the output returned
     "SEALED" where the input returned "LOCAL". No digest of one line can see it, because the
     two lines ARE the same line. What sees it is that there were two and now there are three. */
  const shadow = [
    "function astraShadow() {",
    "  const sleepNightDate = () => \"LOCAL\";",
    "    const date = sleepNightDate();",
    "  return date;",
    "}",
    ""];
  const tree = tmpTree();
  const before = readLines(tree, "today-app.cjs");
  writeLines(tree, "today-app.cjs", shadow.concat(before));
  const r = runCut(tree, ["--only", "today-app.cjs", "--unpinned-input"]);
  assert.strictEqual(r.status, 1, "A COMPETING OCCURRENCE OF A CONTENT ANCHOR REWROTE ANOTHER " +
    "BINDING AND THE CUT EXITED 0. " + r.stdout);
  assert.match(r.stderr, /TA-I042: first anchor matches 3 places and the table RECORDED 2 at its named refs/);
  /* And the same number is witnessed from the git objects of the named refs, so a table
     field bumped to 3 to match the plant does not get past cut.cjs either. */
  const bad = JSON.parse(JSON.stringify(table));
  bad.files["today-app.cjs"].find((x) => x.id === "TA-I042").first.occurrences = 3;
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r2 = runCut(tree, ["--regions", rf, "--only", "today-app.cjs", "--unpinned-input"]);
  assert.strictEqual(r2.status, 1, "BUMPING THE TABLE'S OWN COUNT GOT THE PLANT THROUGH. " + r2.stdout);
  assert.match(r2.stderr, /TA-I042: THE FIRST ANCHOR MATCHES 3 PLACES/);
  assert.match(r2.stderr, /the witness records .*=2/);
});

test("the recorded occurrence count is taken at BOTH named refs and they agree", () => {
  const names = (table.witness.refs || []).map((x) => x.name);
  let withCount = 0;
  for (const [file, regions] of Object.entries(table.files)) {
    for (const reg of regions) {
      if (reg.kind !== "move" && reg.kind !== "replace") continue;
      const w = table.witness.regions[reg.id];
      const rec = names.filter((n) => w && w[n] && typeof w[n].occurrences === "number");
      assert.ok(rec.length === names.length, file + " " + reg.id +
        ": the first anchor's occurrence count is not recorded at every named ref");
      const set = new Set(rec.map((n) => w[n].occurrences));
      assert.strictEqual(set.size, 1, file + " " + reg.id +
        ": the named refs disagree on the anchor's occurrence count");
      assert.strictEqual(reg.first.occurrences, w[names[0]].occurrences, file + " " + reg.id +
        ": the table's first.occurrences and the witness disagree");
      withCount += 1;
    }
  }
  assert.ok(withCount >= 180, "only " + withCount + " regions carry a recorded occurrence count");
});

test("RED blind F6 / incremental F4: a RE-WITNESSED replacement that adds an early `return` is REFUSED by the control-flow comparison", () => {
  /* The reviewer changed TA-I018 to `    if (!facade.foodLane()) { return;`, ran the REAL
     gen-witness --declared --write on that table, and both cuts exited 0. Executed, the
     original guard emits one put(map,"stub-note",...) and the changed one emits none and
     returns undefined: a refusal became silence, behind a digest that had just been re-taken
     and an output that still parsed. */
  const tree = tmpTree();
  const bad = JSON.parse(JSON.stringify(table));
  const row = bad.files["today-app.cjs"].find((x) => x.id === "TA-I018");
  assert.ok(row && Array.isArray(row.replacement), "TA-I018 is not a replacement row any more");
  assert.deepStrictEqual(row.replacement, ["    if (!facade.foodLane()) {"],
    "TA-I018 is no longer the food-lane guard opener this attack targets");
  row.replacement = ["    if (!facade.foodLane()) { return;"];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-"));
  const rf = path.join(dir, "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const first = runCut(tree, ["--regions", rf, "--only", "today-app.cjs"]);
  assert.strictEqual(first.status, 1, "the declared-text witness did not even refuse the edit");
  assert.match(first.stderr, /TA-I018.*DECLARED TEXT DOES NOT MATCH THE WITNESS/);
  /* Now the attacker re-takes the witness with the REAL generator, exactly as the reviewer
     did. Re-blessing must no longer be enough. */
  const w = runNode("gen-witness.cjs", ["--declared", "--regions", rf, "--write"]);
  assert.strictEqual(w.status, 0, w.stderr);
  const r = runCut(tree, ["--regions", rf, "--only", "today-app.cjs"]);
  assert.strictEqual(r.status, 1, "A RE-WITNESSED EARLY RETURN TURNED A REFUSAL INTO SILENCE " +
    "AND THE CUT EXITED 0. " + r.stdout);
  assert.match(r.stderr, /TA-I018: THE REPLACEMENT CHANGES CONTROL FLOW/);
  assert.match(r.stderr, /return: pre-image 0, replacement 1/);
});

test("RED: `statementRewrite` is inside the declared-text witness, so the exemption cannot be added for free", () => {
  const tree = tmpTree();
  const bad = JSON.parse(JSON.stringify(table));
  const row = bad.files["today-app.cjs"].find((x) => x.id === "TA-I018");
  row.statementRewrite = true;
  row.replacement = ["    if (!facade.foodLane()) { return;"];
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf, "--only", "today-app.cjs"]);
  assert.strictEqual(r.status, 1, "A ROW BOUGHT THE STATEMENT-REWRITE EXEMPTION WITHOUT A WITNESS. " + r.stdout);
  assert.match(r.stderr, /TA-I018.*DECLARED TEXT DOES NOT MATCH THE WITNESS/);
});

test("incremental F5: REVERSING the table's row order changes neither acceptance nor one output byte", () => {
  /* Reversing files["today-app.cjs"] and changing nothing else used to exit 1 with
     `regions TA-I004 [718,718] and TA-M03 [718,719] OVERLAP`: the sort was by start alone
     and containment was tested against whichever row happened to be adjacent, so a nested
     replace that sorted ahead of its enclosing seam became the pair's `prev`. A table's
     acceptance must not depend on the order of its rows. */
  const tree = tmpTree();
  const base = runCut(tree, ["--only", "today-app.cjs", "--product"]);
  assert.strictEqual(base.status, 0, base.stderr);
  const bad = JSON.parse(JSON.stringify(table));
  bad.files["today-app.cjs"].reverse();
  const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
  fs.writeFileSync(rf, JSON.stringify(bad));
  const r = runCut(tree, ["--regions", rf, "--only", "today-app.cjs", "--product"]);
  assert.strictEqual(r.status, 0, "REVERSING THE ROW ORDER TURNED AN ACCEPTED CUT INTO A " +
    "REFUSAL. " + r.stderr);
  for (const f of ["today-lanes.cjs", "today-app.cjs"]) {
    assert.strictEqual(fs.readFileSync(path.join(r.out, f), "utf8"),
      fs.readFileSync(path.join(base.out, f), "utf8"),
      "the reversed table produced different " + f + " bytes");
  }
});

test("incremental F3: gen-interface.cjs is actually RUN, and its rows are the rows in the table", () => {
  /* The reviewer changed one clause of the generator at a time - the read rewrite's FACADE
     to HOOKS, W12's `next === "sleep"` to `!==`, W10's sleepCorrect(false) to (true) - and
     the whole cell stayed green at both refs for all eight, because NO ROW INVOKED
     gen-interface.cjs AT ALL. Every row compared generated output to hashes re-taken from
     that same output. This row runs the real generator against the real source at the named
     ref and compares its rows, anchor for anchor and replacement line for replacement line,
     with the rows the table committed. A single changed clause in the generator now moves a
     row's text and this goes red. */
  const tree = tmpTree();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "splitb-gen-"));
  const rf = path.join(dir, "regions.json");
  const jf = path.join(dir, "rows.json");
  fs.writeFileSync(rf, JSON.stringify(table));
  const g = runNode("gen-interface.cjs",
    ["--root", tree, "--file", "today-app.cjs", "--regions", rf, "--json", jf]);
  assert.strictEqual(g.status, 0, "the generator did not run: " + g.stderr);
  const out = JSON.parse(fs.readFileSync(jf, "utf8"));
  const made = new Map(out.rows.map((r) => [r.id, r]));
  const have = table.files["today-app.cjs"].filter((r) => /^TA-[IW]/.test(r.id));
  assert.ok(have.length >= 100, "the table has only " + have.length + " generated rows");
  assert.strictEqual(made.size, have.length,
    "THE GENERATOR PRODUCES " + made.size + " ROWS AND THE TABLE HOLDS " + have.length);
  for (const r of have) {
    const m = made.get(r.id);
    assert.ok(m, "the generator no longer produces " + r.id);
    assert.strictEqual(m.first.text, r.first.text, r.id + ": the generator's first anchor moved");
    assert.strictEqual(m.last.text, r.last.text, r.id + ": the generator's last anchor moved");
    assert.deepStrictEqual(m.replacement, r.replacement,
      r.id + ": THE GENERATOR NOW WRITES DIFFERENT BYTES THAN THE TABLE COMMITTED");
  }
  /* The paint-handle substitution rows are generated by the same run and get the same check. */
  const madeSubs = new Map(out.subs.map((s) => [s.id, s]));
  for (const s of table.substitutions.filter((x) => x.file === "today-app.cjs")) {
    const m = madeSubs.get(s.id);
    if (!m) continue;                       /* W10 is appended by the generator's own tail */
    assert.strictEqual(m.from, s.from, s.id + ": the generator's pre-image moved");
    assert.strictEqual(m.to, s.to, s.id + ": THE GENERATOR NOW WRITES A DIFFERENT SUBSTITUTION");
  }
});

test("RED incremental F7: an UNCOVERED released assignment makes gen-interface.cjs REFUSE and write nothing", () => {
  /* gen-interface.cjs printed its S-R17 (g) STOPS and then wrote the whole table anyway and
     exited 0, so a released line that ASSIGNS a sealed binding with no hand row produced a
     table that looked successfully generated. Deciding what becomes of such a line is a
     durable-writer decision; a generator that cannot express it must not hand back a table. */
  const tree = tmpTree();
  const lines = readLines(tree, "today-app.cjs");
  const at = lines.findIndex((l) => l.indexOf("  if (foodLane && typeof model.setFoodDays") === 0);
  assert.ok(at > 0, "cannot find the mount-level line to plant beside");
  lines.splice(at, 0, "  foodSaving = Promise.resolve();");
  writeLines(tree, "today-app.cjs", lines);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "splitb-gen-"));
  const rf = path.join(dir, "regions.json");
  const jf = path.join(dir, "rows.json");
  fs.writeFileSync(rf, JSON.stringify(table));
  const before = fs.readFileSync(rf, "utf8");
  const g = runNode("gen-interface.cjs",
    ["--root", tree, "--file", "today-app.cjs", "--regions", rf, "--json", jf, "--write"]);
  assert.notStrictEqual(g.status, 0, "THE GENERATOR WROTE A TABLE OVER AN UNCOVERED RELEASED " +
    "ASSIGNMENT AND EXITED 0. " + g.stdout);
  assert.match(g.stderr, /assign a sealed binding with no hand row/);
  assert.strictEqual(fs.readFileSync(rf, "utf8"), before, "it wrote the table anyway");
  assert.ok(!fs.existsSync(jf), "it wrote the rows file anyway");
});

test("RED blind F2: the cut DECLARES every moved initializer that crosses a boot seam, and there is exactly one", () => {
  /* The five S-R21 boot seams keep the seven boot STATEMENTS where they stand. They cannot
     keep a moved INITIALIZER where it stands, because everything inside the factory runs at
     the factory's one call site, above every seam. cut.cjs used to treat
     `let sleepLane = options.sleep || null;` as inert - its initializer is a
     LogicalExpression - so that line was not even in the boot-order list, and the reviewer
     measured PRE api.sleepLane() === the injected lane and POST null. The rule is now "an
     initializer that READS anything is executable", with function BODIES excluded because
     they do not run at declaration, and every crossing is listed by physical line. */
  const tree = tmpTree();
  const r = runCut(tree, ["--only", "today-app.cjs", "--product"]);
  assert.strictEqual(r.status, 0, r.stderr);
  const rep = JSON.parse(fs.readFileSync(path.join(r.out, "cut-report.json"), "utf8"));
  const cross = (rep.bootCrossings || {})["today-app.cjs"] || [];
  assert.deepStrictEqual(cross.map((x) => x.region + "@" + x.line), ["TA-S06@432"],
    "THE SET OF MOVED INITIALIZERS THAT CROSS A BOOT SEAM CHANGED. Every one of them runs " +
    "at a different moment after the cut than it does in the source, and each needs a " +
    "declared disposition before it ships. Found: " + JSON.stringify(cross, null, 1));
  assert.strictEqual(cross[0].text, "  let sleepLane = options.sleep || null;");
  assert.deepStrictEqual(cross[0].seamsCrossed, [422]);
  /* And the fix for that one is in the table, not in the output: bootFoodDays acquires the
     option again at its original initialization point. */
  const sealed = fs.readFileSync(path.join(r.out, "today-lanes.cjs"), "utf8");
  assert.ok(sealed.indexOf("sleepLane = options.sleep || null; },") > 0,
    "the declared re-acquisition is not in the sealed file");
  const boot = sealed.slice(sealed.indexOf("bootFoodDays:"));
  assert.ok(boot.indexOf("model.setFoodDays(foodLane)") < boot.indexOf("sleepLane = options.sleep"),
    "the re-acquisition must come AFTER the setFoodDays call, which is where :432 stands");
});

/* ---- LOOP ROUND 2: the re-check's two blocking inputs, each run RED FIRST -------------
 * Both were measured against the UNCHANGED instruments of c38ed5fb at BOTH named refs and
 * both exited 0 there. The commit before this one carries that failure list.            */

test("RED L2 B1: a COUNT-PRESERVING competing occurrence is REFUSED by the witnessed enclosing context", () => {
  /* The reviewer kept the witnessed occurrence count at 2 by adding one occurrence and
     taking one away: prepend a helper holding TA-I042's anchor text, and add ONE LEADING
     SPACE to the real target so it stops matching. The count check saw two, the ordinal
     `nth: 1` named the PLANT, and at both refs the cut exited 0: the emitted helper called
     with facade.sleepNightDate = () => "SEALED" returned "SEALED" where the input returned
     "LOCAL", and the real released call stayed bare after its binding had moved into the
     seal, so api.render("sleep") threw "sleepNightDate is not defined" on the composed
     page. An ordinal among identical lines is not a binding. */
  const shadow = [
    "function astraShadow() {",
    "  const sleepNightDate = () => \"LOCAL\";",
    "    const date = sleepNightDate();",
    "  return date;",
    "}",
    ""];
  for (const refName of (table.witness.refs || []).map((x) => x.name)) {
    const tree = tmpTreeAt(refName);
    const lines = readLines(tree, "today-app.cjs");
    const anchor = table.files["today-app.cjs"].find((x) => x.id === "TA-I042").first.text;
    const hit = lines.findIndex((l) => l === anchor);
    assert.ok(hit >= 0, "TA-I042's anchor is not in the source at " + refName);
    lines[hit] = " " + lines[hit];
    writeLines(tree, "today-app.cjs", shadow.concat(lines));
    const after = shadow.concat(lines).filter((l) => l === anchor).length;
    assert.strictEqual(after, 2, "the input must PRESERVE the witnessed count of 2 at " + refName);
    const r = runCut(tree, ["--only", "today-app.cjs", "--unpinned-input"]);
    assert.strictEqual(r.status, 1, "A COUNT-PRESERVING PLANT TOOK TA-I042's ORDINAL AND THE " +
      "CUT EXITED 0 AT " + refName + ". " + r.stdout);
    assert.match(r.stderr, /TA-I042: the declared `first\.context` matches 0 of the 2 occurrences/);
  }
});

test("RED L2 B1 (b): a plant that copies the WHOLE witnessed context is refused by a context line that is itself an anchor", () => {
  /* The context is chosen so that copying it cannot be free: `    readSleepCheckIn(date);`
     is TA-I043's own first anchor, witnessed once. A plant that reproduces the enclosing
     header, the two lines before and the two after therefore duplicates ANOTHER region's
     anchor and is refused by the recorded occurrence count before it can be resolved. */
  const tree = tmpTreeAt("s9");
  const lines = readLines(tree, "today-app.cjs");
  const ctx = table.files["today-app.cjs"].find((x) => x.id === "TA-I042").first.context;
  assert.ok(ctx && ctx.before && ctx.after && ctx.enclosing, "TA-I042 carries no first.context");
  const hit = lines.findIndex((l) => l === table.files["today-app.cjs"].find((x) => x.id === "TA-I042").first.text);
  lines[hit] = " " + lines[hit];
  const plant = [ctx.enclosing].concat(ctx.before,
    [table.files["today-app.cjs"].find((x) => x.id === "TA-I042").first.text], ctx.after, ["  }", ""]);
  writeLines(tree, "today-app.cjs", plant.concat(lines));
  const r = runCut(tree, ["--only", "today-app.cjs", "--unpinned-input"]);
  assert.strictEqual(r.status, 1, "A FULL-CONTEXT PLANT GOT THROUGH. " + r.stdout);
  assert.match(r.stderr, /TA-I043: first anchor matches 2 places and the table RECORDED 1/);
});

test("L2 B1: TA-I042's context is witnessed at BOTH named refs, and it is the only ambiguous anchor", () => {
  const names = (table.witness.refs || []).map((x) => x.name);
  let withContext = 0, ambiguous = 0;
  for (const [file, regions] of Object.entries(table.files)) {
    for (const reg of regions) {
      if (reg.kind !== "move" && reg.kind !== "replace") continue;
      if (reg.first.occurrences > 1) {
        ambiguous += 1;
        assert.ok(reg.first.context, file + " " + reg.id +
          ": an anchor that matches more than once and declares no context");
      }
      if (!reg.first.context) continue;
      withContext += 1;
      for (const n of names) {
        assert.strictEqual(typeof table.witness.regions[reg.id][n].contextSha, "string",
          file + " " + reg.id + ": no witnessed contextSha at " + n);
      }
    }
  }
  assert.strictEqual(ambiguous, 1, "the number of ambiguous anchors changed");
  assert.strictEqual(withContext, 1, "the number of rows carrying a context changed");
});

test("RED L2 B2 (a): a return HIDDEN INSIDE A STRING is REFUSED by the parsed-structure comparison", () => {
  /* `    if (!facade.foodLane()) { "//"; return;` - the token profile strips line comments
     BEFORE strings, so the `//` inside the string swallowed `; return;` and the counts came
     out equal, while the emitted JavaScript parses and really does return. Measured on the
     emitted guard with no food lane: the control emits one put(map,"stub-note",...) and the
     mutant emits none; the composed page loses the stub-note and the food-save elements.
     The reviewer ran the REAL gen-witness --declared --write and the REAL cut at both refs
     and got exit 0 twice. */
  for (const refName of (table.witness.refs || []).map((x) => x.name)) {
    const tree = tmpTreeAt(refName);
    const bad = JSON.parse(JSON.stringify(table));
    const row = bad.files["today-app.cjs"].find((x) => x.id === "TA-I018");
    assert.deepStrictEqual(row.replacement, ["    if (!facade.foodLane()) {"],
      "TA-I018 is no longer the food-lane guard opener this attack targets");
    assert.ok(!row.statementRewrite, "TA-I018 must not be an exempt row");
    row.replacement = ["    if (!facade.foodLane()) { \"//\"; return;"];
    const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
    fs.writeFileSync(rf, JSON.stringify(bad));
    const w = runNode("gen-witness.cjs", ["--declared", "--regions", rf, "--write"]);
    assert.strictEqual(w.status, 0, w.stderr);
    const r = runCut(tree, ["--regions", rf, "--only", "today-app.cjs"]);
    assert.strictEqual(r.status, 1, "A RETURN HIDDEN IN A STRING SILENCED A REFUSAL AND THE " +
      "CUT EXITED 0 AT " + refName + ". " + r.stdout);
    assert.match(r.stderr, /TA-I018: THE REPLACEMENT CHANGES CONTROL FLOW/);
    assert.match(r.stderr, /PARSED STRUCTURE DIFFERS/);
  }
});

test("RED L2 B2 (b): a SINGLE-CLAUSE false predicate is REFUSED by the parsed-structure comparison", () => {
  /* `    if (!facade.foodLane() && false) {` adds no control-flow token at all, so no token
     profile can see it. Same zero puts; the real page instead displays exactly
     "Not prescribed. The engine issues no carbohydrate or fat target." */
  for (const refName of (table.witness.refs || []).map((x) => x.name)) {
    const tree = tmpTreeAt(refName);
    const bad = JSON.parse(JSON.stringify(table));
    const row = bad.files["today-app.cjs"].find((x) => x.id === "TA-I018");
    row.replacement = ["    if (!facade.foodLane() && false) {"];
    const rf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "splitb-reg-")), "regions.json");
    fs.writeFileSync(rf, JSON.stringify(bad));
    const w = runNode("gen-witness.cjs", ["--declared", "--regions", rf, "--write"]);
    assert.strictEqual(w.status, 0, w.stderr);
    const r = runCut(tree, ["--regions", rf, "--only", "today-app.cjs"]);
    assert.strictEqual(r.status, 1, "A FALSE PREDICATE ERASED A REFUSAL AND THE CUT EXITED 0 AT " +
      refName + ". " + r.stdout);
    assert.match(r.stderr, /TA-I018: THE REPLACEMENT CHANGES CONTROL FLOW/);
    assert.match(r.stderr, /pre-image "UnaryExpression", replacement "LogicalExpression"/);
  }
});

test("L2 B2: the rows EXEMPT from the structural comparison are exactly the declared twenty-five", () => {
  /* The exemption's only effect is to move a row from "refused" to "printed by id in the
     cut's report for the PM's read". This pins the set so that widening it is a visible
     diff in a cell and not a quiet field. */
  const exempt = [];
  for (const [file, regions] of Object.entries(table.files)) {
    for (const r of regions) if (r.statementRewrite) exempt.push(file + " " + r.id);
  }
  assert.deepStrictEqual(exempt.sort(), [
    "gym-app.mjs GA-R01", "gym-app.mjs GA-R02", "gym-app.mjs GA-R03", "gym-app.mjs GA-R04",
    "gym-app.mjs GA-R05", "gym-app.mjs GA-R06",
    "today-app.cjs TA-S05", "today-app.cjs TA-S10", "today-app.cjs TA-S16",
    "today-app.cjs TA-S35b", "today-app.cjs TA-S38",
    "today-app.cjs TA-W01", "today-app.cjs TA-W02", "today-app.cjs TA-W03",
    "today-app.cjs TA-W04", "today-app.cjs TA-W05", "today-app.cjs TA-W06",
    "today-app.cjs TA-W07", "today-app.cjs TA-W08", "today-app.cjs TA-W09",
    "today-app.cjs TA-W10", "today-app.cjs TA-W11", "today-app.cjs TA-W12",
    "today-app.cjs TA-W13", "today-app.cjs TA-W14"].sort(),
    "THE SET OF ROWS EXEMPT FROM THE CONTROL-FLOW COMPARISON CHANGED.");
  /* and every one of them is printed by id, with its from and its to, in the cut's report */
  const tree = tmpTreeAt("s9");
  const r = runCut(tree, ["--only", "today-app.cjs", "--product"]);
  assert.strictEqual(r.status, 0, r.stderr);
  const rep = JSON.parse(fs.readFileSync(path.join(r.out, "cut-report.json"), "utf8"));
  const printed = rep.statementRewrites.map((x) => x.id).sort();
  assert.deepStrictEqual(printed, ["TA-S05", "TA-S10", "TA-S16", "TA-S35b", "TA-S38",
    "TA-W01", "TA-W02", "TA-W03", "TA-W04", "TA-W05", "TA-W06", "TA-W07", "TA-W08",
    "TA-W09", "TA-W10", "TA-W11", "TA-W12", "TA-W13", "TA-W14"].sort(),
    "the cut's report does not print every declared statement rewrite of today-app.cjs");
  for (const x of rep.statementRewrites) {
    assert.ok(Array.isArray(x.from) && Array.isArray(x.to) && x.from.length && x.to.length,
      x.id + ": the report does not carry the row's from and to for the PM's read");
  }
});

test("L2 B3: the corrected banner says what the file is, measured against the file itself", () => {
  /* Three statements of the banner were false in a file that will be SEALED. The
     corrections are declared rows of regions.json's product block; these are the
     measurements they now have to match. */
  const tree = tmpTreeAt(BUILD_REF);
  const r = runCut(tree, ["--only", "today-app.cjs", "--product"]);
  assert.strictEqual(r.status, 0, r.stderr);
  const src = fs.readFileSync(path.join(r.out, "today-lanes.cjs"), "utf8");
  const acorn = require(path.join(INSTRUMENT, "acorn"));
  const ast = acorn.parse(src, { ecmaVersion: 2022, sourceType: "script", locations: true });
  const head = table.product["today-lanes.cjs"].head.length +
    (table.product["today-lanes.cjs"].open || []).length;
  const close = src.split("\n").length - (table.product["today-lanes.cjs"].close || []).length - 1;
  let total = 0, authored = 0;
  (function walk(n) {
    if (!n || typeof n !== "object") return;
    if (n.type === "Literal" && typeof n.value === "string") {
      total += 1;
      if (n.loc.start.line <= head || n.loc.start.line >= close) authored += 1;
    }
    for (const k of Object.keys(n)) {
      if (k === "loc") continue;
      const v = n[k];
      if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === "object" && v.type) walk(v);
    }
  })(ast);
  assert.strictEqual(total, 127, "the banner's string-literal count is not the file's");
  assert.strictEqual(authored, 10, "the banner's count of AUTHORED string literals is not the file's");
  assert.ok(src.indexOf(" * families. Forty of them rewrite a paint handle") > 0,
    "the banner still calls every substitution a paint-handle rewrite (B3)");
  assert.ok(src.indexOf(" * THE SEVEN DECLARATIONS AFTER IT") > 0,
    "the banner still says FOUR authored declarations where seven stand (B3)");
  assert.ok(src.indexOf("this file and 117 of them are moved bytes") > 0,
    "the banner still claims zero string literals of its own (B3)");
  /* and the seven are really there, in order, before the first moved region */
  const upto = src.slice(0, src.indexOf("/* TA-S01"));
  for (const name of ["sleepDraftHeld", "willAdopt", "ready", "gestures", "wrapped", "wrapFor", "gesture"]) {
    assert.ok(new RegExp("(let|const) " + name + "\\b").test(upto),
      "the banner names " + name + " as an authored declaration and it is not declared before TA-S01");
  }
});

test("RED S-R32: the table banner states the copy boundary and makes no undefined sentence count", () => {
  const banner = table.product["today-lanes.cjs"].head.join("\n");
  assert.match(banner, /twelve injected copy constants stay in the released view/i,
    "the banner does not state where the twelve injected copy constants stay");
  assert.match(banner, /moved fallback reason literals and sentence assembly remain in this sealed file/i,
    "the banner hides the fallback reasons and sentence assembly that moved into the seal");
  assert.doesNotMatch(banner, /eleven sentences/i,
    "the undefined eleven-sentences count must be enumerated or struck; this round strikes it");
  assert.doesNotMatch(banner, /every copy byte the athlete reads\s+\*\s+stayed in the released view/i,
    "the banner still makes L3 B3's false every-copy-byte claim");
});
