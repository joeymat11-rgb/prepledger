/* ======================================================================================
   THE CROSS-LANE RELEASE-OBJECT CELL. M2-S9-UI-PINS, written at integration by the
   integration hand, under the PM's ruling P-S9-6 (DECISIONS:627): "the cross-lane
   release-object cell is the integration's own". DECISIONS:559 ordered the compatibility
   check and said no preparation lane owns it, because neither lane can build the other's
   input: lane B writes the artifact and lane C reads it, and until the artifact exists
   nobody had both halves in one place.

   WHAT IT ASKS. The runner declares `released` as the ONE OPTIONAL key of the acceptance
   artifact (H11) and builds its value in proposed(); the sealed-inventory fence reads that
   value with one line, `new Set(Object.keys(inv.released || {}))`, and uses it to decide
   which sealed paths a branch may touch. If those two ever disagree about the SHAPE of
   that key, the failure is silent and it fails OPEN: a released path that the fence does
   not read as released stays fenced (loud, safe), but a shape that yields keys which are
   not paths releases NOTHING while looking like it releases something.

   AND IT IS BUILT OUT OF BOTH SIDES' OWN CODE, NEVER OUT OF A HAND-WRITTEN SHAPE. Every
   fixture row below constructs its artifact half by EVALUATING THE RUNNER'S OWN TWO
   EXPRESSIONS, lifted out of rebuild/lanes/b/tooling/b-package.cjs by exact text, and
   reads it back by EVALUATING THE FENCE'S OWN ONE LINE, lifted out of
   sealed-inventory-fence.test.mjs the same way. Each fragment is asserted to occur
   EXACTLY ONCE in its file, so the day either side changes its construction this cell
   goes red instead of quietly testing a copy of something that no longer exists.

   ITS OWN rebuild.yml STEP CARRIES if: ${{ !cancelled() }}, the same string the fence's
   step and the pack's step carry, for the same reason: the standing --ci --package step
   fails on every branch that is not the chain tip, and a gate that is skipped in the
   world it was written for is not a gate. Row (7) reads that line back. */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SELF = "rebuild/lanes/c/ui-port/release-object.test.mjs";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../..");
const RUNNER = "rebuild/lanes/b/tooling/b-package.cjs";
const FENCE = "rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs";

/* THE REAL ARTIFACT THIS PACKAGE WILL WRITE, and the closed list of two the PM's
   RELEASE-FROM-SEAL line may name (brief section 1, DECISIONS:536). Neither value is
   invented here: the artifact path is the one the runner's own ARTIFACT constant will
   resolve to for this package id, and the two paths are the brief's closed list. */
const ARTIFACT = "rebuild/m4/spec/acceptance-s9-ui-pins.json";
const CSS = "rebuild/m3/w7-preview/today/preview.css";
const BUILD = "rebuild/m3/w7-preview/today/build.mjs";
/* S8's own posts for the two, measured by the brief's author at chain tip 789baf6e
   against the parent artifact and used here ONLY as fixture bytes: this cell pins no
   sha256 of its own and part 2 measures the declaration. */
const CSS_PRE = "7cf97598c2c2cb2390dd0a7a855f322b68b27f4fa801df3e23536e4846126ea1";
const BUILD_PRE = "d04a10ef406708b801749b1118246e82fecc53bbbafe1ac11068eb24bc52cf9c";
const RULING = "b".repeat(64);
const ZERO = "0".repeat(64);

const read = (rel) => fs.readFileSync(path.join(REPO, ...rel.split("/")), "utf8");
const RUNNER_SRC = read(RUNNER);
const FENCE_SRC = read(FENCE);

/* The lift. A fragment that is not present, or present twice, is a change of the thing
   this cell exists to compare, and it is refused here rather than worked around. */
function only(source, where, fragment) {
  const hits = source.split(fragment).length - 1;
  assert.equal(hits, 1,
    where + " does not carry this cell's anchor EXACTLY once (" + hits + " occurrences), so "
    + "the code path this cell claims to be testing is no longer the one that is there:\n"
    + fragment);
  return fragment;
}

/* proposed()'s own construction of the released half, verbatim. */
const RELEASED_MAP = only(RUNNER_SRC, RUNNER, [
  "  const releasedMap = Object.fromEntries(declaredPins.filter(([, p]) => p.role === 'released')",
  "    .map(([file, p]) => [file, { role: 'released', lastSealedSha256: p.pre,",
  "      sealedBy: bound.acceptance.packageId, rulingLineSha256: s.release.rulingLineSha256 }]));",
].join("\n"));
/* proposed()'s own emission of it into the artifact object, verbatim, including the
   condition that leaves the key out entirely when nothing is released (H11). */
const EMIT = only(RUNNER_SRC, RUNNER,
  "    ...(release.declared.length ? { released: releasedMap } : {}),");
/* The fence's own reading of it, verbatim. */
const FENCE_READ = only(FENCE_SRC, FENCE,
  "  const released = new Set(Object.keys(inv.released || {}));");

const runnerReleasedMap = new Function("declaredPins", "bound", "s", RELEASED_MAP + "\n  return releasedMap;");
const runnerEmit = new Function("release", "releasedMap", "return {\n" + EMIT + "\n};");
const fenceReadsReleased = new Function("inv", FENCE_READ + "\n  return released;");
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

/* One package's declaration list, through the runner's own two expressions, ending in the
   half of the artifact object this cell is about. `declared` is [path, pre] pairs; the
   edited pin below is there so every row measures that the FILTER is doing work and that
   a non-released declaration never reaches the released block. */
function runnerReleasedHalf(declared, packageId = "M2-S9-UI-PINS") {
  const product = {};
  for (const [file, pre] of declared) product[file] = { role: "released", pre, post: null };
  product["rebuild/m3/w7-preview/today/today-app.cjs"] = { role: "edited", pre: ZERO, post: RULING };
  const s = { product, release: { rulingLineSha256: RULING } };
  const bound = { acceptance: { packageId } };
  const releasedMap = runnerReleasedMap(Object.entries(product), bound, s);
  return runnerEmit({ declared: declared.map(([file]) => file) }, releasedMap);
}

/* (1) THE COMPATIBILITY ROW ITSELF: both closed-list paths are present as KEYS of the
   block the runner builds, and the fence's own line reads exactly those two paths out of
   it. This is the sentence DECISIONS:559 asked for, executed on both halves at once. */
test("(1) the runner's released block, read by the fence's own line, yields exactly the two released paths", () => {
  const half = runnerReleasedHalf([[CSS, CSS_PRE], [BUILD, BUILD_PRE]]);
  assert.deepEqual(Object.keys(half), ["released"], "the emission produced something other than one released key");
  assert.deepEqual(Object.keys(half.released).sort(), [BUILD, CSS].sort(),
    "the released block is not keyed by the two released paths");
  assert.deepEqual([...fenceReadsReleased(half)].sort(), [BUILD, CSS].sort(),
    "the fence's own reading of the runner's own block does not name the two released paths");
});

/* (2) The VALUE shape, also from the runner's own expression: E fact 15's four fields,
   the parent as sealedBy, the parent's own post as lastSealedSha256, and the PM line's
   sha256. A non-released declaration is not in the block at all. */
test("(2) each released entry carries role, lastSealedSha256, sealedBy and rulingLineSha256, and nothing else is in the block", () => {
  const half = runnerReleasedHalf([[CSS, CSS_PRE], [BUILD, BUILD_PRE]], "M2-S8-REAL-SHAPE");
  for (const [file, pre] of [[CSS, CSS_PRE], [BUILD, BUILD_PRE]]) {
    assert.deepEqual(Object.keys(half.released[file]).sort(),
      ["lastSealedSha256", "role", "rulingLineSha256", "sealedBy"]);
    assert.equal(half.released[file].role, "released");
    assert.equal(half.released[file].lastSealedSha256, pre);
    assert.equal(half.released[file].sealedBy, "M2-S8-REAL-SHAPE");
    assert.equal(half.released[file].rulingLineSha256, RULING);
  }
  assert.equal("rebuild/m3/w7-preview/today/today-app.cjs" in half.released, false,
    "an `edited` declaration reached the released block");
});

/* (3) H11's OTHER HALF, and it is the case every artifact sealed before this role existed
   is in: a package that releases nothing emits NO `released` key at all, and the fence's
   own line reads that as the EMPTY set rather than throwing. `|| {}` is the clause doing
   it, and this row is what fails if anyone removes it. */
test("(3) a package that releases nothing emits no released key, and the fence reads the empty set", () => {
  const half = runnerReleasedHalf([]);
  assert.deepEqual(Object.keys(half), [], "the runner emitted a released key for a package that released nothing");
  assert.equal("released" in half, false);
  assert.deepEqual([...fenceReadsReleased(half)], [],
    "the fence's reading of an artifact with no released block is not the empty set");
});

/* (4) THE EXECUTED COUNTEREXAMPLE, and the reason this cell exists rather than a sentence
   in a report. If `released` were ever a LIST of paths instead of an object keyed by path,
   the fence's own line would yield the ARRAY INDICES "0" and "1" as its released set, so
   BOTH released paths would stay fenced while the artifact looked as though it had
   released them. This row builds that wrong shape by hand ON PURPOSE - it is the one
   place in this file where a shape is hand-written, and it is hand-written because the
   runner cannot produce it - and measures the damage. The second half is why the runner
   cannot: Object.fromEntries over [file, value] pairs always yields an object keyed by
   the pair's first element. */
test("(4) counterexample: a released ARRAY releases NOTHING through the fence's reading, and the runner cannot produce one", () => {
  const wrong = { released: [CSS, BUILD] };
  const seen = [...fenceReadsReleased(wrong)];
  assert.deepEqual(seen, ["0", "1"], "the array shape did not read as indices: " + JSON.stringify(seen));
  assert.equal(seen.includes(CSS), false, "the array shape released a path after all");
  assert.equal(seen.includes(BUILD), false, "the array shape released a path after all");
  const half = runnerReleasedHalf([[CSS, CSS_PRE], [BUILD, BUILD_PRE]]);
  assert.equal(Array.isArray(half.released), false, "the runner's own expression produced an array");
  assert.equal(Object.prototype.toString.call(half.released), "[object Object]");
});

/* (5) `released` IS the artifact's one optional key, and it is closed in envelope() by the
   freeze pattern rather than by being absent from the closed list. Read out of the
   runner's own source: the key stands last in ARTIFACT_KEYS, and envelope() nulls it
   before the closed-key check. If either line goes, an artifact with no released block
   stops recomputing, or a released block stops being checked. */
test("(5) `released` is the last ARTIFACT_KEYS entry and envelope() closes it by the freeze pattern", () => {
  only(RUNNER_SRC, RUNNER, "  'released'];");
  only(RUNNER_SRC, RUNNER,
    "  keys({ ...m, released: null }, ARTIFACT_KEYS, 'Closed acceptance-artifact keys'); // H11, the freeze pattern");
});

/* (6) THE REAL ROW, and it runs against the repository this file is IN. Rows (1) to (5)
   run against fixtures this file built out of both sides' own code; this one reads the
   REAL artifact path this package will write and says, in one named sentence, whether the
   thing the runner actually produced satisfies the thing the fence actually reads.

   IT IS EXPECTED TO BE RED UNTIL THE SEAL, exactly as the fence's real row and the two
   pack real rows are, and for the same reason: rebuild/m4/spec/acceptance-s9-ui-pins.json
   does not exist until proposed() writes it at integration part 2, and nothing in this
   round exports, writes or seals an artifact. The refusal names the missing path, so the
   CI log says WHY rather than merely failing.

   THE LADDER OUT OF RED, for whoever does part 2:
     RELEASE-OBJECT ARTIFACT-ABSENT rebuild/m4/spec/acceptance-s9-ui-pins.json
        the artifact has not been proposed yet
     RELEASE-OBJECT RELEASED-BLOCK-ABSENT / RELEASED-MISSING <path>
        it has, but the closed list of two is not in it
     (nothing)
        the runner's released block and the fence's reading of it agree in both directions
   Anyone who makes this row green by any other means has removed the cell. */
function releaseObjectRefusals(abs, artifact = ARTIFACT) {
  const refusals = [];
  let inv = null;
  let parsed = false;
  if (!fs.existsSync(abs)) refusals.push("RELEASE-OBJECT ARTIFACT-ABSENT " + artifact);
  else {
    try { inv = JSON.parse(fs.readFileSync(abs, "utf8")); parsed = true; }
    catch (e) { refusals.push("RELEASE-OBJECT ARTIFACT-NOT-JSON " + artifact + ": " + String(e.message).split("\n")[0]); }
    if (parsed && (inv === null || typeof inv !== "object" || Array.isArray(inv))) {
      refusals.push("RELEASE-OBJECT ARTIFACT-NOT-JSON " + artifact + ": it parses, but not as a JSON object");
      inv = null;
    }
  }
  if (inv !== null) {
    if (!Object.prototype.hasOwnProperty.call(inv, "released")) refusals.push("RELEASE-OBJECT RELEASED-BLOCK-ABSENT " + artifact);
    else if (inv.released === null || typeof inv.released !== "object" || Array.isArray(inv.released))
      refusals.push("RELEASE-OBJECT RELEASED-NOT-AN-OBJECT-KEYED-BY-PATH " + artifact);
    else {
      const seen = fenceReadsReleased(inv);
      for (const file of [CSS, BUILD]) {
        if (!Object.prototype.hasOwnProperty.call(inv.released, file)) { refusals.push("RELEASE-OBJECT RELEASED-MISSING " + file); continue; }
        if (inv.released[file].role !== "released") refusals.push("RELEASE-OBJECT RELEASED-ROLE " + file);
        if (!seen.has(file)) refusals.push("RELEASE-OBJECT FENCE-DOES-NOT-READ " + file);
        if (Object.prototype.hasOwnProperty.call(inv.product || {}, file)) refusals.push("RELEASE-OBJECT RELEASED-ALSO-IN-PRODUCT " + file);
        if (Object.prototype.hasOwnProperty.call(inv.executionPins || {}, file)) refusals.push("RELEASE-OBJECT RELEASED-ALSO-AN-EXECUTION-PIN " + file);
      }
      for (const file of Object.keys(inv.released))
        if (file !== CSS && file !== BUILD) refusals.push("RELEASE-OBJECT RELEASED-UNEXPECTED " + file);
    }
  }
  return refusals;
}

test("REAL ROW: the released block of the real acceptance artifact, against the fence's own reading", () => {
  const abs = path.join(REPO, ...ARTIFACT.split("/"));
  const refusals = releaseObjectRefusals(abs);
  assert.deepEqual(refusals, [],
    "the release object and the fence's reading of it do not agree at this head. Refusals:\n  "
    + refusals.join("\n  ")
    + "\n(Before the seal the single refusal ARTIFACT-ABSENT is EXPECTED and is the red this"
    + " row was written for: nothing in integration part 1 writes an artifact.)");
});

test("D-NULL-ARTIFACT: JSON null is refused by the real release-object reader", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "s9-null-artifact-"));
  t.after(() => fs.rmSync(dir, { recursive: true }));
  const artifact = "synthetic-null.json";
  const abs = path.join(dir, artifact);
  fs.writeFileSync(abs, "null\n");
  assert.deepEqual(releaseObjectRefusals(abs, artifact), [
    "RELEASE-OBJECT ARTIFACT-NOT-JSON " + artifact + ": it parses, but not as a JSON object",
  ]);
});

/* (7) THIS CELL'S OWN STEP IN rebuild.yml, and the condition on it. Same rule, same
   method and same regex as the fence's row (18) and the pack's own condition row: read
   the workflow as TEXT out of the WORKING TREE, find the step by THIS FILE'S OWN PATH,
   never glob, and require `!cancelled()`. Without it this cell is skipped behind the
   standing step on every branch that is not the chain tip, which is every branch it will
   ever run on before the S9 fast-forward. */
test("(7) this cell's own step in rebuild.yml exists, names it by exact path and carries the not-cancelled condition", () => {
  const yml = fs.readFileSync(path.join(REPO, ".github", "workflows", "rebuild.yml"), "utf8").split(/\r?\n/);
  assertConditionedRun(yml, SELF, "this cell's step");
});

test("D-S9G-DECOY: release-object reader refuses D, E and F workflow decoys", () => {
  const worlds = decoyWorkflows(SELF);
  assert.doesNotThrow(() => assertConditionedRun(worlds.control, SELF, "control"));
  assert.doesNotThrow(() => assertConditionedRun(worlds.afterRun, SELF, "after run"));
  for (const id of ["D", "E", "F"])
    assert.throws(() => assertConditionedRun(worlds[id], SELF, id), undefined, id);
  for (const id of ["duplicateCondition", "duplicateRunner", "siblingPath"])
    assert.throws(() => assertConditionedRun(worlds[id], SELF, id), undefined, id);
});

test("D-S9G-CONTINUE: release-object reader refuses a direct continue-on-error key", () => {
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

test("D-S9G-QUOTED-KEY: release-object reader refuses paired quoted continue-on-error keys", () => {
  const worlds = decoyWorkflows(SELF);
  for (const id of ["control", "grouped", "siblingContinue", "nestedContinue",
    "quotedSiblingContinue", "quotedNestedContinue"])
    assert.doesNotThrow(() => assertConditionedRun(worlds[id], SELF, id), undefined, id);
  assert.throws(() => assertConditionedRun(worlds.quotedIf, SELF, "quotedIf"), (error) =>
    error instanceof assert.AssertionError
      && !String(error.message).includes("STEP-CONTINUE-ON-ERROR-FORBIDDEN"));
  const real = fs.readFileSync(path.join(REPO, ".github", "workflows", "rebuild.yml"), "utf8")
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

test("D-CONDITION-MATCHER: release-object requires the whole permitted expression", () => {
  assert.equal(conditionIsNotCancelled("  if: ${{ !cancelled() }}"), true);
  assert.equal(conditionIsNotCancelled("  if: ${{ !cancelled() && false }}"), false);
  assert.equal(conditionIsNotCancelled("  if: ${{ false || !cancelled() }}"), false);
  assert.equal(conditionIsNotCancelled("  if: ${{ !cancelled() || true }}"), false);
});

/* The refusal vocabulary of the real row, named so it is readable from outside and
   cannot drift in silence. Every one of these is emitted by the real row's own code
   above and by nothing else in this file. */
export const REFUSALS = Object.freeze([
  "RELEASE-OBJECT ARTIFACT-ABSENT",
  "RELEASE-OBJECT ARTIFACT-NOT-JSON",
  "RELEASE-OBJECT RELEASED-BLOCK-ABSENT",
  "RELEASE-OBJECT RELEASED-NOT-AN-OBJECT-KEYED-BY-PATH",
  "RELEASE-OBJECT RELEASED-MISSING",
  "RELEASE-OBJECT RELEASED-ROLE",
  "RELEASE-OBJECT FENCE-DOES-NOT-READ",
  "RELEASE-OBJECT RELEASED-ALSO-IN-PRODUCT",
  "RELEASE-OBJECT RELEASED-ALSO-AN-EXECUTION-PIN",
  "RELEASE-OBJECT RELEASED-UNEXPECTED",
]);

test("(8) the refusal vocabulary is exactly ten, unique, and every word of it is spelled in the real row", () => {
  assert.equal(REFUSALS.length, 10);
  assert.deepEqual(REFUSALS, [...new Set(REFUSALS)]);
  for (const r of REFUSALS) assert.match(r, /^RELEASE-OBJECT [A-Z-]+$/);
  const self = fs.readFileSync(fileURLToPath(import.meta.url), "utf8");
  for (const r of REFUSALS)
    assert.equal(self.split('"' + r + ' "').length >= 2 || self.split('"' + r + ' " +').length >= 2, true,
      r + " is exported but is spelled by no refusal in the real row");
});
