/* S9, THE SEALED-INVENTORY FENCE. rebuild/lanes/b/S9-RELEASE-SPEC.md (v4) section D.2,
   as rebuild/lanes/b/S9-RELEASE-SPEC-REVIEW-R4.md leaves it.

   THE HOLE IT CLOSES (D.1, measured there). "Lane C touched only released paths" is a
   promise today, not a check. fidelity() (b-package.cjs:2005) walks a diff restricted to
   rebuild/engine, rebuild/conform, rebuild/m4/spec and rebuild/lanes/b/tooling, so ALL of
   rebuild/m3 is outside it; product() (:1970) proves BYTES and only when somebody runs
   --ci --package S<N>; and measure/test/boundary.test.mjs:128 walks S4's inventory, two
   generations stale by design. Nothing asks the question this cell asks: OF THE PATHS
   THIS BRANCH TOUCHED, WHICH ARE IN THE CURRENT SEALED INVENTORY AND NOT RELEASED.

   WHY THE INVENTORY IS READ OUT OF GIT AT THE CHAIN REF AND NEVER FROM THE WORKTREE
   (R1 BLOCKING-2). A fence whose fenceposts move with the animal is not a fence. The
   worktree is the branch's own, so a branch that wanted to touch a sealed path could add
   that path to the artifact's released block, or drop it out of product, and the fence
   would measure the change against an inventory the change itself wrote. Nothing else
   catches that: the artifact is not a key of its own product map, fidelity() :2010
   exempts f === ARTIFACT from UNLISTED-SOURCE-CHANGE, and sealedRunReceipt() :2963 only
   reports SEALED-RUN-RECEIPT-VOID. So the inventory comes from
   refs/remotes/origin/rebuild/t2-client-core, the same ref the runner fixes at
   b-package.cjs:189, re-read on every call with no cache (the r10 F4 lesson, :1195-:1200).

   WHAT ACTUALLY HOLDS THE RESEAL-CHILD GATE, said once so no reader mistakes it (R3 N4).
   THE SEAL BEHIND THE FENCE HOLDS IT, NOT THE FENCE. Conditions (1), (2) and (5) below
   are values a forging branch can copy out of the chain, and (3) is a fact about the
   chain rather than a cost. The only condition that COSTS anything is (4): the branch
   must put its id into IDS in b-package.cjs, a SEALED byte, which the same CI run refuses
   at fidelity() :2011 and at the runner pin :2012-:2013.

   WHAT THIS CELL IS NOT (R2 N1). It is not a check that lane C touched nothing that
   matters. It asks whether a touched path is IN the sealed inventory, and
   today-model.cjs:378 (weighIn through :395) writes an athlete's weight reading from
   OUTSIDE that inventory, so until TODAY-SPLIT seals its writer this fence passes a
   branch that rewrites the weigh-in admission bounds. The general form is the
   WRITER-FENCE of D.4, which TODAY-SPLIT owns and S9 does not build.

   RED FIRST, AND THE ORDER IS THE SPEC'S. Row (6), the worktree-artifact tamper, is
   written first and committed against a fence that reads the inventory from the worktree,
   because that row is the whole proof the fence is not self-certifying (F.1 R10).

   THE ROWS BUILD THEIR OWN THROWAWAY GIT REPOSITORIES. fence() below is a function of
   (repo root, chain ref) and nothing else, so the real row and every fixture row run the
   SAME code. No fixture row ever touches this repository's refs. */

import assert from "node:assert/strict";
import test, { after } from "node:test";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
/* rebuild/lanes/c/ui-port -> the repository root. */
const REPO = path.resolve(HERE, "..", "..", "..", "..");
const CHAIN_REF = "refs/remotes/origin/rebuild/t2-client-core";
const SPEC_DIR = "rebuild/m4/spec/";
const RUNNER = "rebuild/lanes/b/tooling/b-package.cjs";
const PACKAGES = "rebuild/lanes/b/tooling/packages/";
/* b-package.cjs:1071, copied BY VALUE because a cell that audits the sealed set must not
   import the thing it audits. */
const SPEC_KEYS = ["version", "lanePackage", "packageId", "status", "brief", "sourceBase",
  "dIds", "laws", "carriedAcceptedIds", "privateLiveTriggered", "parent", "tooling",
  "product", "coverage", "carrierSuccessor", "witnessFlips", "protectedSurfaces",
  "authorizations", "artifact", "children", "notes"];

/* ------------------------------------------------------------------ git, as bytes.
   encoding "buffer" on purpose: the artifact comparison below is byte-exact, and a
   string round trip through the default encoding is not. Forward slashes come out of
   git on both operating systems, so no path.join touches a repository-relative path. */
const git = (root, args) =>
  execFileSync("git", ["-c", "core.quotepath=false", ...args],
    { cwd: root, encoding: "buffer", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "pipe"] });
const gitText = (root, args) => git(root, args).toString("utf8");
const gitLines = (root, args) => gitText(root, args).split(/\r?\n/).filter((l) => l !== "");
const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");
const ancestorOf = (root, a, b) => {
  try { git(root, ["merge-base", "--is-ancestor", a, b]); return true; } catch { return false; }
};
/* IDS out of a b-package.cjs source text. \b refuses RETIRED_IDS, whose "IDS" is
   preceded by an underscore and therefore carries no word boundary. */
const idsOf = (src) => {
  const m = /\bIDS\s*=\s*\[([^\]]*)\]/.exec(src);
  return m === null ? [] : [...m[1].matchAll(/'([^']*)'|"([^"]*)"/g)].map((x) => x[1] ?? x[2]);
};
const fsBytes = (p) => { try { return fs.readFileSync(p); } catch { return null; } };

/* ------------------------------------------------------------------- THE FENCE.
   A function of (repository root, chain ref) and of nothing else, so the real row and
   every throwaway fixture repository run the same code. It carries no hash and no path
   list of its own, which is why it cannot go stale the way boundary.test.mjs did. */
function fence(root, chainRef) {
  const out = (status, refusals, rest) => ({ status, refusals, artifactPath: null, artifactSha256: null, reason: null, touched: null, ...rest });
  const no = (refusal, rest) => out("fail", [refusal], rest);

  /* D.2, "what it does with no network": the ref is absent on a shallow clone, and the
     cell FAILS rather than passing vacuously. rebuild.yml:35 sets fetch-depth: 0. */
  try { git(root, ["rev-parse", "--verify", "--quiet", chainRef + "^{commit}"]); }
  catch { return no("FENCE-CHAIN-REF-ABSENT " + chainRef); }

  /* THE INVENTORY, OUT OF GIT AT THE CHAIN REF. The integer after "acceptance-s" and
     the NUMERIC maximum of it, because a lexical walk puts s10 before s9 (R1 N9). */
  const cands = [];
  for (const f of gitLines(root, ["ls-tree", "--name-only", chainRef, SPEC_DIR])) {
    const m = /^rebuild\/m4\/spec\/acceptance-s(\d+)-[^/]*\.json$/.exec(f);
    if (m !== null) cands.push({ n: Number.parseInt(m[1], 10), path: f });
  }
  if (cands.length === 0) return no("FENCE-NO-INVENTORY-AT-CHAIN-REF " + chainRef + ":" + SPEC_DIR);
  const top = Math.max(...cands.map((c) => c.n));
  const chosen = cands.filter((c) => c.n === top).map((c) => c.path).sort();
  if (chosen.length > 1) return no("FENCE-AMBIGUOUS-INVENTORY " + chosen.join(" "));
  const artifactPath = chosen[0];
  const chainBytes = git(root, ["show", chainRef + ":" + artifactPath]);
  const artifactSha256 = sha256(chainBytes);
  const here = { artifactPath, artifactSha256 };
  const inv = JSON.parse(chainBytes.toString("utf8"));
  const sealed = new Set([...Object.keys(inv.product || {}), ...Object.keys(inv.executionPins || {})]);
  const released = new Set(Object.keys(inv.released || {}));

  /* THE DIFF, --name-status and not --name-only: the skip below needs the status letter
     and a deletion counts as touching, so one diff serves both (R3 N3). A rename is
     both a deletion of the old path and an addition of the new one. */
  const base = gitText(root, ["merge-base", chainRef, "HEAD"]).trim();
  const touched = [];
  for (const line of gitLines(root, ["diff", "--name-status", base, "HEAD"])) {
    const parts = line.split("\t");
    if (/^[RC]/.test(parts[0])) { touched.push({ status: "D", path: parts[1] }); touched.push({ status: "A", path: parts[2] }); }
    else touched.push({ status: parts[0][0], path: parts[1] });
  }

  /* THE RESEAL-CHILD CLAIM, and its DEFAULT IS FAIL (R2 BLOCKING-A, PM-R4). */
  const specRe = /^rebuild\/lanes\/b\/tooling\/packages\/([^/]+)\.json$/;
  const added = touched.filter((t) => t.status === "A" && specRe.test(t.path));
  if (added.length > 0) {
    const bad = (n, why) => no("FENCE-RESEAL-CHILD-UNVERIFIED (" + n + ") " + why, here);
    if (added.length !== 1)
      return bad(1, "the diff adds " + added.length + " spec files at status A: " + added.map((t) => t.path).sort().join(" "));
    const specPath = added[0].path;
    const id = specRe.exec(specPath)[1];
    let spec = null;
    try { spec = JSON.parse(git(root, ["show", "HEAD:" + specPath]).toString("utf8")); } catch { spec = null; }
    if (spec === null || typeof spec !== "object" || Array.isArray(spec))
      return bad(1, specPath + " does not parse as a JSON object");
    if (Object.keys(spec).sort().join(",") !== [...SPEC_KEYS].sort().join(","))
      return bad(1, specPath + " is not the runner's own SPEC_KEYS key closure (b-package.cjs:1071)");

    const parent = spec.parent === null || typeof spec.parent !== "object" ? {} : spec.parent;
    const option = (Array.isArray(parent.options) ? parent.options : []).find((o) => o !== null && typeof o === "object" && o.id === parent.chosen) ?? null;
    if (option === null) return bad(2, specPath + " names no parent option " + JSON.stringify(parent.chosen ?? null));
    if (option.artifact !== artifactPath)
      return bad(2, specPath + " binds parent artifact " + String(option.artifact) + "; the fence read " + artifactPath + " at " + chainRef);
    if (option.sha256 !== artifactSha256)
      return bad(2, specPath + " carries parent sha256 " + String(option.sha256).slice(0, 12) + "; the fence measures " + artifactSha256.slice(0, 12) + " over " + artifactPath + " at " + chainRef);

    /* (3), with R3 N4's after-the-merge clause: absent from IDS at the chain ref (an
       unmerged new child), OR present there AND the inventory the fence just read is
       that child's own (it has merged, and the fence is reading what it sealed). */
    /* MEASURED, and it is not what the spec's prose implies: the artifact's packageId is
       the THEME name ("M2-S8-REAL-SHAPE") and its lanePackage is the id IDS and
       packages/<ID>.json carry ("S8"). "That child's own" is therefore lanePackage. */
    const mergedAlready = idsOf(git(root, ["show", chainRef + ":" + RUNNER]).toString("utf8")).includes(id);
    if (mergedAlready && inv.lanePackage !== id)
      return bad(3, id + " is already in IDS at " + chainRef + ", and the inventory there is lanePackage " + JSON.stringify(inv.lanePackage ?? null) + " rather than this child's own");

    /* (4), THE ONLY CONDITION THAT COSTS ANYTHING: a sealed byte of b-package.cjs. */
    if (!touched.some((t) => t.path === RUNNER))
      return bad(4, "the diff does not touch " + RUNNER + ", the one runner hunk no reseal child can skip");
    if (!idsOf(git(root, ["show", "HEAD:" + RUNNER]).toString("utf8")).includes(id))
      return bad(4, id + " is not in IDS in this branch's own " + RUNNER);

    if (typeof spec.sourceBase !== "string" || !ancestorOf(root, spec.sourceBase, "HEAD"))
      return bad(5, "sourceBase " + JSON.stringify(spec.sourceBase ?? null) + " is not an ancestor of HEAD");

    return out("skip", [], { ...here, touched: touched.length,
      reason: "FENCE-RESEAL-CHILD " + id + " " + specPath + " stood aside on " + artifactPath + " " + artifactSha256 + " at " + chainRef });
  }

  const refusals = [];
  /* THE ARTIFACT-TAMPER CHECK. A branch legitimately changing a sealed artifact is a
     reseal child, which the claim above has already handled, so the two do not collide. */
  const worktree = fsBytes(path.join(root, ...artifactPath.split("/")));
  if (worktree === null || !worktree.equals(chainBytes))
    refusals.push("FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + artifactPath);
  for (const t of touched)
    if (sealed.has(t.path) && !released.has(t.path))
      refusals.push("FENCE-SEALED-PATH-TOUCHED " + t.status + " " + t.path);
  return out(refusals.length === 0 ? "pass" : "fail", refusals, { ...here, touched: touched.length });
}

/* ------------------------------------------------- throwaway repositories, ours alone.
   Every fixture repository is created by mkdtemp, carries its own
   refs/remotes/origin/rebuild/t2-client-core made with update-ref, and is removed at the
   end of the run. core.autocrlf is forced off and .gitattributes carries eol=lf, so the
   byte-exact artifact comparison means the same thing on ubuntu-latest and on
   windows-latest (the repository itself carries the same rule, .gitattributes:12). */
const MADE = [];
after(() => { for (const d of MADE) { try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* the OS will */ } } });

const put = (root, rel, text) => {
  const p = path.join(root, ...rel.split("/"));
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, text);
};
const drop = (root, rel) => fs.rmSync(path.join(root, ...rel.split("/")));
const commit = (root, msg) => { git(root, ["add", "-A"]); git(root, ["commit", "-q", "-m", msg]); };

function emptyRepo() {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "s9-fence-")));
  MADE.push(root);
  git(root, ["-c", "init.defaultBranch=main", "init", "-q"]);
  git(root, ["config", "user.email", "fence@example.invalid"]);
  git(root, ["config", "user.name", "fence fixture"]);
  git(root, ["config", "core.autocrlf", "false"]);
  git(root, ["config", "commit.gpgsign", "false"]);
  put(root, ".gitattributes", "* text=auto eol=lf\n");
  return root;
}

const ZERO = "0".repeat(64);
function inventory({ packageId = "M2-S8-FIXTURE", lanePackage = "S8", product = [], executionPins = [], released = null }) {
  const obj = { version: 1, packageId, lanePackage, product: {}, executionPins: {} };
  for (const p of product) obj.product[p] = { pre: ZERO, post: ZERO, role: "carried" };
  for (const p of executionPins) obj.executionPins[p] = ZERO;
  if (released !== null) {
    obj.released = {};
    for (const p of released) obj.released[p] =
      { role: "released", lastSealedSha256: ZERO, sealedBy: packageId, tokenLineSha256: ZERO };
  }
  return JSON.stringify(obj, null, 1) + "\n";
}
const runnerStub = (ids) =>
  "// fixture stand-in for " + RUNNER + "\n" +
  "const SPEC_DIR = 'packages', IDS = [" + ids.map((i) => "'" + i + "'").join(", ") + "];\n" +
  "const RETIRED_IDS = ['B-LOM'];\n";

/* The chain: one commit carrying an inventory, a runner stub and every file the
   inventory pins, with the chain ref pointed at it. Nothing here is this repository. */
function chain({ artifacts = null, product = [], executionPins = [], released = null,
                 packageId = "M2-S8-FIXTURE", lanePackage = "S8", ids = ["S7", "S8"], free = [] } = {}) {
  const root = emptyRepo();
  const set = artifacts === null
    ? [["acceptance-s8-fixture.json", inventory({ packageId, lanePackage, product, executionPins, released })]]
    : artifacts;
  for (const [name, body] of set) put(root, SPEC_DIR + name, body);
  put(root, RUNNER, runnerStub(ids));
  for (const p of [...product, ...executionPins, ...free]) put(root, p, "the chain's bytes\n");
  commit(root, "the chain");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);
  return root;
}
/* A lane branch on top of it: one commit that edits, adds or deletes whatever it is
   given. edits are path -> text, adds are path -> text, kills are paths. */
function branch(root, { edits = {}, kills = [] } = {}) {
  for (const [p, text] of Object.entries(edits)) put(root, p, text);
  for (const p of kills) drop(root, p);
  commit(root, "the lane branch");
  return root;
}
/* A spec file of the runner's own SPEC_KEYS key closure, so condition (1) can pass and
   every other condition can be failed on purpose one at a time. */
function specFile({ packageId, parentId, artifact, sha256: s, sourceBase }) {
  const obj = {};
  for (const k of SPEC_KEYS) obj[k] = null;
  obj.version = 1;
  obj.lanePackage = packageId;
  obj.packageId = "M2-" + packageId + "-FIXTURE";
  obj.sourceBase = sourceBase;
  obj.parent = { decided: true, chosen: parentId,
    options: [{ id: parentId, artifact, sha256: s, review: SPEC_DIR + "review-fixture.json",
      reviewSha256: ZERO, receiptLedgerLine: 1, note: "fixture" }] };
  obj.product = {};
  return JSON.stringify(obj, null, 1) + "\n";
}
const shaOfBlob = (root, ref, p) => sha256(git(root, ["show", ref + ":" + p]));
const headOf = (root) => gitText(root, ["rev-parse", "HEAD"]).trim();
const names = (r) => r.refusals.join(" | ");

const APP = "rebuild/m3/w7-preview/today/today-app.cjs";
const CSS = "rebuild/m3/w7-preview/today/preview.css";
const BUILD = "rebuild/m3/w7-preview/today/build.mjs";
const TEMPLATE = "rebuild/m3/w7-preview/today/screens.template.html";
const PINNED = "rebuild/m3/w7-preview/today/test/package.test.cjs";

/* ============================ RED-FIRST ROW (6), WRITTEN AND COMMITTED FIRST ==========
   R1 BLOCKING-2, and F.1 R10. A branch edits the sealed artifact IN ITS OWN WORKTREE to
   widen released (and to drop a path out of product) and then touches that path. It must
   FAIL twice over: the inventory the fence judges by is the one at the chain ref, so the
   widening buys nothing, AND the worktree artifact differs from the chain's, which is
   itself a refusal. This is the row that proves the fence is not self-certifying. */
test("D.2 (6) - a branch that widens released in its OWN worktree and then touches that path FAILS", () => {
  const root = chain({ product: [APP, CSS] });
  const widened = inventory({ product: [CSS], released: [APP] });
  branch(root, { edits: { [APP]: "the branch's bytes\n", [SPEC_DIR + "acceptance-s8-fixture.json"]: widened } });
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail", "the fence read the branch's own inventory: " + names(r));
  assert.ok(r.refusals.some((x) => x.startsWith("FENCE-INVENTORY-DIFFERS-FROM-CHAIN")),
    "no artifact-tamper refusal: " + names(r));
  assert.ok(r.refusals.includes("FENCE-SEALED-PATH-TOUCHED M " + APP),
    "the widened released block excused the touch: " + names(r));
});

/* Dropping the path out of product instead of widening released is the same attack with
   the other hand, and it is refused for the same two reasons. */
test("D.2 (6b) - a branch that DROPS a path out of product in its own worktree FAILS the same way", () => {
  const root = chain({ product: [APP, CSS] });
  branch(root, { edits: { [APP]: "the branch's bytes\n",
    [SPEC_DIR + "acceptance-s8-fixture.json"]: inventory({ product: [CSS] }) } });
  const r = fence(root, CHAIN_REF);
  assert.ok(r.refusals.some((x) => x.startsWith("FENCE-INVENTORY-DIFFERS-FROM-CHAIN")), names(r));
  assert.ok(r.refusals.includes("FENCE-SEALED-PATH-TOUCHED M " + APP), names(r));
});

/* ============================================== THE REST OF D.2's RED-FIRST LIST ====== */

test("D.2 (1) - a branch touching today-app.cjs FAILS, and the refusal names that path", () => {
  const root = chain({ product: [APP, CSS], free: [TEMPLATE] });
  branch(root, { edits: { [APP]: "a lane C edit\n" } });
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail");
  assert.deepEqual(r.refusals, ["FENCE-SEALED-PATH-TOUCHED M " + APP]);
});

test("D.2 (1b) - an execution pin is inventory too: touching one FAILS naming it", () => {
  const root = chain({ product: [APP], executionPins: [PINNED] });
  branch(root, { edits: { [PINNED]: "a lane C edit\n" } });
  assert.deepEqual(fence(root, CHAIN_REF).refusals, ["FENCE-SEALED-PATH-TOUCHED M " + PINNED]);
});

/* D.2: "A deletion (status D) of a sealed path counts as touching it". This is the row
   --name-status buys that --name-only could not spell. */
test("D.2 (1c) - a DELETION of a sealed path counts as touching it, at status D", () => {
  const root = chain({ product: [APP, CSS] });
  branch(root, { kills: [APP] });
  assert.deepEqual(fence(root, CHAIN_REF).refusals, ["FENCE-SEALED-PATH-TOUCHED D " + APP]);
});

test("D.2 (2) - preview.css FAILS before S9 and PASSES after it, and nothing else moves", () => {
  const before = chain({ product: [APP, CSS] });
  branch(before, { edits: { [CSS]: ".a{color:#fff}\n" } });
  assert.deepEqual(fence(before, CHAIN_REF).refusals, ["FENCE-SEALED-PATH-TOUCHED M " + CSS],
    "preview.css is free before S9 releases it");

  const after = chain({ product: [APP, CSS, BUILD], released: [CSS, BUILD] });
  branch(after, { edits: { [CSS]: ".a{color:#fff}\n", [BUILD]: "// a lane C edit\n" } });
  assert.deepEqual(fence(after, CHAIN_REF).refusals, [], "the released block did not release");
  assert.equal(fence(after, CHAIN_REF).status, "pass");

  /* and the release is NARROW: the third path in the same map is still fenced. */
  const narrow = chain({ product: [APP, CSS, BUILD], released: [CSS, BUILD] });
  branch(narrow, { edits: { [APP]: "a lane C edit\n" } });
  assert.deepEqual(fence(narrow, CHAIN_REF).refusals, ["FENCE-SEALED-PATH-TOUCHED M " + APP]);
});

test("D.2 (3) - a branch touching screens.template.html PASSES: nothing ever sealed it", () => {
  const root = chain({ product: [APP, CSS], free: [TEMPLATE] });
  branch(root, { edits: { [TEMPLATE]: "<template id=\"t-today\"></template>\n" } });
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "pass", names(r));
});

/* D.2: "if that ref is absent (a shallow clone) the cell FAILS with FENCE-CHAIN-REF-ABSENT
   rather than passing vacuously". rebuild.yml:35 sets fetch-depth: 0 so it should never
   happen on a runner, which is exactly why a silent pass would never be noticed. */
test("D.2 (4) - a deleted chain ref FAILS with FENCE-CHAIN-REF-ABSENT, it does not pass", () => {
  const root = chain({ product: [APP, CSS] });
  branch(root, { edits: { [TEMPLATE]: "harmless\n" } });
  git(root, ["update-ref", "-d", CHAIN_REF]);
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail");
  assert.deepEqual(r.refusals, ["FENCE-CHAIN-REF-ABSENT " + CHAIN_REF]);
});

/* R1 N9: the artifact is chosen by the NUMERIC maximum of the integer after
   "acceptance-s", because a lexical walk puts s10 before s9. */
test("D.2 (7) - the inventory is the NUMERIC maximum, so s10 beside s9 selects s10", () => {
  const root = chain({ artifacts: [
    ["acceptance-s9-ui-pins.json", inventory({ packageId: "M2-S9-UI-PINS", product: [APP, CSS] })],
    ["acceptance-s10-split.json", inventory({ packageId: "M2-S10-SPLIT", product: [APP, CSS], released: [CSS] })],
  ], product: [], free: [APP, CSS] });
  branch(root, { edits: { [CSS]: ".a{color:#fff}\n" } });
  const r = fence(root, CHAIN_REF);
  assert.equal(r.artifactPath, SPEC_DIR + "acceptance-s10-split.json",
    "a lexical walk took s9: " + r.artifactPath);
  assert.equal(r.status, "pass", "s10 releases preview.css and s9 does not: " + names(r));
});

test("D.2 (7b) - two artifacts at the SAME N FAIL FENCE-AMBIGUOUS-INVENTORY naming both", () => {
  const root = chain({ artifacts: [
    ["acceptance-s8-real-shape.json", inventory({ product: [APP] })],
    ["acceptance-s8-rival.json", inventory({ product: [APP] })],
  ], product: [], free: [APP] });
  branch(root, { edits: { [APP]: "a lane C edit\n" } });
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail");
  assert.equal(r.refusals.length, 1, names(r));
  assert.match(r.refusals[0], /^FENCE-AMBIGUOUS-INVENTORY /);
  assert.ok(r.refusals[0].includes(SPEC_DIR + "acceptance-s8-real-shape.json"), names(r));
  assert.ok(r.refusals[0].includes(SPEC_DIR + "acceptance-s8-rival.json"), names(r));
});

/* ====================== D.2 (8) THE RESEAL-CHILD SKIP, WHOSE DEFAULT IS FAIL ==========
   R2 BLOCKING-A, PM-R4. v2 skipped on the mere presence of a packages/S<N+1>.json in the
   diff, so a lane C branch that wanted to touch today-app.cjs could add an empty one and
   the fence would stand aside. The skip is now derived from the CHAIN and every row below
   is a way of not earning it. */
const FIX_ART = SPEC_DIR + "acceptance-s8-fixture.json";
function child(root, o = {}) {
  const id = o.id ?? "S9";
  const artifact = o.artifact ?? FIX_ART;
  const sha = o.sha ?? shaOfBlob(root, CHAIN_REF, FIX_ART);
  const sourceBase = o.sourceBase ?? gitText(root, ["rev-parse", CHAIN_REF]).trim();
  const edits = {};
  edits[PACKAGES + id + ".json"] = o.specBody ?? specFile(
    { packageId: id, parentId: o.parentId ?? "S8", artifact, sha256: sha, sourceBase });
  if (o.runnerInDiff !== false) edits[RUNNER] = runnerStub(o.branchIds ?? ["S7", "S8", id]);
  for (const [k, v] of Object.entries(o.alsoTouch ?? {})) edits[k] = v;
  for (const [k, v] of Object.entries(o.alsoAdd ?? {})) edits[k] = v;
  branch(root, { edits });
  return root;
}
const unverified = (r, n) => {
  assert.equal(r.status, "fail", "it SKIPPED: " + JSON.stringify(r.reason));
  assert.equal(r.refusals.length, 1, names(r));
  assert.match(r.refusals[0], new RegExp("^FENCE-RESEAL-CHILD-UNVERIFIED \\(" + n + "\\) "), names(r));
};

test("D.2 (8e) - the green control: a real reseal child SKIPS and prints id, artifact and sha256", () => {
  const root = chain({ product: [APP, CSS] });
  child(root, { alsoTouch: { [APP]: "the reseal child's own edit\n" } });
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "skip", names(r));
  assert.deepEqual(r.refusals, []);
  assert.ok(r.reason.includes("S9"), r.reason);
  assert.ok(r.reason.includes(FIX_ART), r.reason);
  assert.ok(r.reason.includes(r.artifactSha256), r.reason);
  assert.equal(r.artifactSha256, shaOfBlob(root, CHAIN_REF, FIX_ART));
});

test("D.2 (8a) - an empty or non-spec JSON file does not earn the skip: condition (1)", () => {
  const empty = chain({ product: [APP] });
  child(empty, { specBody: "{}\n", alsoTouch: { [APP]: "a lane C edit\n" } });
  unverified(fence(empty, CHAIN_REF), 1);

  const rubbish = chain({ product: [APP] });
  child(rubbish, { specBody: "not a spec at all\n", alsoTouch: { [APP]: "a lane C edit\n" } });
  unverified(fence(rubbish, CHAIN_REF), 1);

  /* and TWO added specs are not "exactly one" either. */
  const two = chain({ product: [APP] });
  child(two, { alsoAdd: { [PACKAGES + "S10.json"]: "{}\n" }, alsoTouch: { [APP]: "a lane C edit\n" } });
  unverified(fence(two, CHAIN_REF), 1);
});

test("D.2 (8b) - a spec naming a DIFFERENT artifact than the one read at the chain ref: condition (2)", () => {
  const root = chain({ product: [APP] });
  child(root, { artifact: SPEC_DIR + "acceptance-s7-somewhere-else.json",
    sha: ZERO, alsoTouch: { [APP]: "a lane C edit\n" } });
  const r = fence(root, CHAIN_REF);
  unverified(r, 2);
  assert.ok(r.refusals[0].includes("acceptance-s7-somewhere-else.json"), names(r));
});

test("D.2 (8c) - the right artifact and a sha256 the fence does not measure: condition (2)", () => {
  const root = chain({ product: [APP] });
  child(root, { sha: "f".repeat(64), alsoTouch: { [APP]: "a lane C edit\n" } });
  unverified(fence(root, CHAIN_REF), 2);
});

test("D.2 (8d) - an id that is not in IDS in the branch's OWN b-package.cjs: condition (4)", () => {
  const root = chain({ product: [APP] });
  child(root, { branchIds: ["S7", "S8"], alsoTouch: { [APP]: "a lane C edit\n" } });
  unverified(fence(root, CHAIN_REF), 4);

  /* and the same condition refuses a branch that never touches the runner at all: that
     is the one hunk no reseal child can skip, and it is the only condition that costs. */
  const untouched = chain({ product: [APP] });
  child(untouched, { runnerInDiff: false, alsoTouch: { [APP]: "a lane C edit\n" } });
  unverified(fence(untouched, CHAIN_REF), 4);
});

test("D.2 (8f) - a sourceBase that is not an ancestor of HEAD: condition (5)", () => {
  const root = chain({ product: [APP] });
  child(root, { sourceBase: "f".repeat(40), alsoTouch: { [APP]: "a lane C edit\n" } });
  unverified(fence(root, CHAIN_REF), 5);
});

/* R3 N4, second half, AND WHAT THE MEASUREMENT SAYS ABOUT IT. Condition (3) requires the
   id to be ABSENT from IDS at the chain ref, which stops being true the moment the child
   merges; without the clause a later push to the same lane branch would fail for a branch
   that had done nothing wrong. This row builds that exact world: the branch is cut at A,
   the chain then takes S9 by a commit that is not on the branch, so the merge-base is
   still A and packages/S9.json is still at status A in the diff.

   MEASURED, AND REPORTED TO THE PM RATHER THAN PAPERED OVER: the clause does what R3 N4
   says of condition (3), and the branch is refused one condition earlier anyway, at (2).
   A child's parent.chosen option names its PARENT's artifact by construction, and after
   the merge the artifact the fence reads at the chain ref is the CHILD'S OWN, so those
   two can never be the same path. Nothing here is softened to hide that: the row asserts
   the refusal the fence as specified actually gives, and asserts that it is NOT (3),
   which is the proof the clause is live rather than dead. If the PM wants the
   after-the-merge case to skip, condition (2) needs the same second limb and that is a
   spec change, not an author's edit. */
test("D.2 (8g) - after the merge R3 N4's clause DOES satisfy condition (3), and condition (2) refuses anyway: measured", () => {
  const root = chain({ product: [APP, CSS] });
  const A = headOf(root);
  child(root, { alsoTouch: { [APP]: "the reseal child's own edit\n" } });
  /* the chain takes S9, on a line of its own, so the merge-base stays at A */
  git(root, ["checkout", "-q", "-b", "chainline", A]);
  put(root, RUNNER, runnerStub(["S7", "S8", "S9"]));
  put(root, SPEC_DIR + "acceptance-s9-fixture.json",
    inventory({ packageId: "M2-S9-FIXTURE", lanePackage: "S9", product: [APP, CSS] }));
  commit(root, "the chain takes S9");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);
  git(root, ["checkout", "-q", "main"]);
  const r = fence(root, CHAIN_REF);
  assert.equal(r.artifactPath, SPEC_DIR + "acceptance-s9-fixture.json", "the chain did not advance");
  unverified(r, 2);
  assert.ok(!r.refusals[0].startsWith("FENCE-RESEAL-CHILD-UNVERIFIED (3)"),
    "the after-the-merge clause is dead code: " + names(r));
});

test("D.2 (8h) - an id already in IDS at the chain ref over SOMEBODY ELSE'S inventory: condition (3)", () => {
  const root = chain({ packageId: "M2-S8-FIXTURE", ids: ["S7", "S8", "S9"], product: [APP] });
  child(root, { id: "S9", branchIds: ["S7", "S8", "S9"], alsoTouch: { [APP]: "a re-run of a sealed child\n" } });
  unverified(fence(root, CHAIN_REF), 3);
});

/* A MODIFIED ancestor spec is expected and ignored. E fact 7 re-pins the runner sha in
   packages/H3.json, S3, S4, S5, S6, S7 and S8, so a real reseal child's diff carries
   EIGHT packages/*.json paths: one added and seven modified. Under --name-only
   condition (1) would read eight and refuse S9's own diff (R3 N3). */
test("D.2 (8i) - seven MODIFIED ancestor specs beside the one ADDED spec still SKIP", () => {
  const ancestors = ["H3", "S3", "S4", "S5", "S6", "S7", "S8"];
  const root = chain({ product: [APP] });
  for (const a of ancestors) put(root, PACKAGES + a + ".json", "{\n \"tooling\": 1\n}\n");
  commit(root, "the ancestors");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);
  const bumped = {};
  for (const a of ancestors) bumped[PACKAGES + a + ".json"] = "{\n \"tooling\": 2\n}\n";
  child(root, { alsoTouch: { [APP]: "the reseal child's own edit\n", ...bumped } });
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "skip", names(r));
});

/* ================================================================ THE REAL ROW ========
   Everything above runs against a repository this file built. This one runs against the
   repository this file is IN, and it is the whole point of the cell: on every push to a
   rebuild/** branch, rebuild.yml names it and it says in one line which sealed paths the
   branch touched.

   IT IS EXPECTED TO BE RED ON rebuild/b-s9-prep-cells AND THAT IS NOT A DEFECT. This
   preparation branch edits .github/workflows/rebuild.yml, today/test/package.test.cjs
   and measure/test/boundary.test.mjs, all three of them sealed by
   acceptance-s8-real-shape.json, and it carries the two accepted lanes S9-TODAY-CARRY and
   PASSPHRASE-NORMALIZE, whose declarations move sealed bytes too. It carries no
   rebuild/lanes/b/tooling/packages/S9.json yet, so it makes no reseal-child claim and
   the fence has nothing to verify one against. THE S9 PACKAGE ITSELF IS WHAT TURNS THIS
   ROW INTO A VERIFIED SKIP: the moment S9.json is added at status A with its parent bound
   to the artifact at the chain ref and 'S9' in IDS in this branch's own b-package.cjs,
   every one of the five conditions holds and this row prints its reason instead.
   No skip, no environment switch and no softening is added here to make it green: a cell
   that could be turned off by the branch it fences is the thing D.2 exists to refuse. */
test("THE REAL ROW - this branch touched no sealed path the chain has not released", () => {
  const r = fence(REPO, CHAIN_REF);
  if (r.status === "skip") {
    assert.deepEqual(r.refusals, []);
    return;   /* a verified reseal child; the reason is in r.reason and in the CI log */
  }
  assert.deepEqual(r.refusals, [],
    "this change touched " + r.refusals.length + " sealed path(s) that " +
    String(r.artifactPath) + " at " + CHAIN_REF + " does not release");
});
