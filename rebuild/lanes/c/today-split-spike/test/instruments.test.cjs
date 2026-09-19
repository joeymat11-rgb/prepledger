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

function tmpTree() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "splitb-atk-"));
  fs.mkdirSync(path.join(d, table.today), { recursive: true });
  for (const f of FILES) {
    fs.copyFileSync(path.join(ROOT, table.today, f), path.join(d, table.today, f));
  }
  return d;
}
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
  assert.strictEqual(rows.length, 5, "S-R21 rules FIVE boot seams as replace regions, saw " + rows.length);
  for (const { r } of rows) {
    assert.ok(Array.isArray(r.replacement) && r.replacement.length,
      r.id + " is kind replace with no declared replacement row");
    assert.ok(r.note && /BOOT SEAM/.test(r.note), r.id + " does not say which boot seam it is");
  }
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
