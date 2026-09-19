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
   AND THE HONEST SENTENCE THE REVIEWER ASKED FOR (R2 N4): once the five conditions hold,
   the skip returns before the sealed-path loop, so A VERIFIED RESEAL CHILD IS FENCED BY
   THE SEAL AND BY fidelity(), AND BY THIS CELL NOT AT ALL. The one thing this cell still
   holds against such a child is the artifact-tamper check, which R2 N4 moved ABOVE the
   claim so that a child rewriting its PARENT's sealed artifact cannot stand aside.

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

/* R1 N2. A runner with no git must not be told that the CHAIN REF is missing: those are
   different worlds and the reader needs the right one. execFileSync raises ENOENT when
   the binary cannot be spawned at all and a non-zero exit status when the ref is simply
   not there, so the two are distinguishable and the mapping is its own named function -
   which is how row (10) can measure it with a REAL ENOENT raised by the same API instead
   of unsetting PATH. (An unusable cwd raises the same ENOENT, which is why the name says
   "could not be spawned" rather than "is not installed".) */
const chainRefRefusal = (e, chainRef) =>
  (e !== null && typeof e === "object" && e.code === "ENOENT")
    ? "FENCE-GIT-UNAVAILABLE git could not be spawned: " + String(e.syscall ?? "spawnSync git")
    : "FENCE-CHAIN-REF-ABSENT " + chainRef;

/* ------------------------------------------------------------------- THE FENCE.
   A function of (repository root, chain ref) and of nothing else, so the real row and
   every throwaway fixture repository run the same code. It carries no hash and no path
   list of its own, which is why it cannot go stale the way boundary.test.mjs did. */
function fence(root, chainRef) {
  const out = (status, refusals, rest) => ({ status, refusals, artifactPath: null, artifactSha256: null, reason: null, touched: null, chainCommit: null, ...rest });
  const no = (refusal, rest) => out("fail", [refusal], rest);

  /* D.2, "what it does with no network": the ref is absent on a shallow clone, and the
     cell FAILS rather than passing vacuously. rebuild.yml:35 sets fetch-depth: 0. */
  let chainCommit = null;
  try { chainCommit = git(root, ["rev-parse", "--verify", "--quiet", chainRef + "^{commit}"]).toString("utf8").trim(); }
  catch (e) { return no(chainRefRefusal(e, chainRef)); }
  /* R1 N10: the chain ref is a REMOTE-TRACKING ref and only a fetch moves it. In CI
     :35's fetch-depth: 0 makes it fresh; on a developer PC the fence judges against
     whatever was last fetched. Every outcome below carries the commit it judged by, so
     the CI log and the local run are self-describing rather than a mystery. */

  /* THE INVENTORY, OUT OF GIT AT THE CHAIN REF. The integer after "acceptance-s" and
     the NUMERIC maximum of it, because a lexical walk puts s10 before s9 (R1 N9). */
  const cands = [];
  for (const f of gitLines(root, ["ls-tree", "--name-only", chainRef, SPEC_DIR])) {
    const m = /^rebuild\/m4\/spec\/acceptance-s(\d+)-[^/]*\.json$/.exec(f);
    if (m !== null) cands.push({ n: Number.parseInt(m[1], 10), path: f });
  }
  if (cands.length === 0) return no("FENCE-NO-INVENTORY-AT-CHAIN-REF " + chainRef + ":" + SPEC_DIR, { chainCommit });
  const top = Math.max(...cands.map((c) => c.n));
  const chosen = cands.filter((c) => c.n === top).map((c) => c.path).sort();
  if (chosen.length > 1) return no("FENCE-AMBIGUOUS-INVENTORY " + chosen.join(" "), { chainCommit });
  const artifactPath = chosen[0];
  const chainBytes = git(root, ["show", chainRef + ":" + artifactPath]);
  const artifactSha256 = sha256(chainBytes);
  const here = { artifactPath, artifactSha256, chainCommit };
  /* R2 N2, third of three. JSON.parse threw a raw SyntaxError here, and the ARRAY case
     was worse than a throw: an array parses, inv.product is undefined, the sealed set
     comes out EMPTY and the branch PASSES VACUOUSLY. Row (15) holds both halves. */
  let inv = null;
  try { inv = JSON.parse(chainBytes.toString("utf8")); }
  catch (e) { return no("FENCE-INVENTORY-NOT-JSON " + artifactPath + " at " + chainRef + ": " + String(e.message).split("\n")[0], here); }
  if (inv === null || typeof inv !== "object" || Array.isArray(inv))
    return no("FENCE-INVENTORY-NOT-JSON " + artifactPath + " at " + chainRef + ": it parses, but not as a JSON object", here);
  const sealed = new Set([...Object.keys(inv.product || {}), ...Object.keys(inv.executionPins || {})]);
  /* R1 N1: E fact 15 says released is an OBJECT keyed by path, and Object.keys of any
     other shape yields keys that are not paths, so a released block of the wrong shape
     releases NOTHING and the sealed path stays fenced. That is the direction to fail in
     and row (12) measures it rather than leaving it to be discovered. */
  const released = new Set(Object.keys(inv.released || {}));

  /* THE DIFF, --name-status and not --name-only: the skip below needs the status letter
     and a deletion counts as touching, so one diff serves both (R3 N3). A rename is
     both a deletion of the old path and an addition of the new one.

     AND IT IS DIFFED FROM THE MERGE BASE, NOT FROM THE CHAIN REF (R1 BLOCKING-A). A
     two-dot diff against the chain ref would also report every sealed path the CHAIN has
     moved since this branch was cut, and refuse a branch that is merely BEHIND for paths
     it never touched. Row (9) builds that world and is the only row where the chain ref
     and the merge base differ.

     R2 N2, first of three: an unrelated history has NO merge base, git exits non-zero and
     this threw a raw "Command failed". Row (13), and the fence still never passes.

     WHAT --name-status GIVES AND WHAT IT DOES NOT (R2 N5, and -z is NOT adopted here).
     -c core.quotepath=false closes the NON-ASCII case (row (1d)) and only that case: a
     path carrying a double quote or a TAB is still quoted by git, and a TAB additionally
     breaks the split below so parts[1] is a truncated path. Windows forbids BOTH bytes in
     a file name and this repository must check out on Windows, so no such path can exist
     in it. -z is the complete answer the day that changes, and it costs per-record field
     counting, because under -z a rename is three NUL-separated fields and everything else
     is two. */
  let base = null;
  try { base = gitText(root, ["merge-base", chainRef, "HEAD"]).trim(); }
  catch { return no("FENCE-NO-MERGE-BASE " + chainRef + " and HEAD share no history", here); }
  const touched = [];
  for (const line of gitLines(root, ["diff", "--name-status", base, "HEAD"])) {
    const parts = line.split("\t");
    /* R2 N3: the A record of a rename is SYNTHESISED here and the branch authored no such
       file. renamedFrom is what lets condition (1) tell the two apart; nothing else reads
       it, so the sealed-path loop below still counts both ends of a rename as touches. */
    if (/^[RC]/.test(parts[0])) { touched.push({ status: "D", path: parts[1] }); touched.push({ status: "A", path: parts[2], renamedFrom: parts[1] }); }
    else touched.push({ status: parts[0][0], path: parts[1] });
  }

  /* THE ARTIFACT-TAMPER CHECK, AND R2 N4 MOVED IT ABOVE THE RESEAL CLAIM, FOR EVERY
     BRANCH. It used to sit after the claim's return, so a child that satisfied all five
     conditions AND rewrote its PARENT's sealed artifact in its own worktree stood aside
     in silence. Condition (2) binds the spec to the sha the fence measures AT THE CHAIN
     REF, so the tamper bought that child nothing - but the cell that exists to notice
     artifact tampering did not notice it, and the CI log said nothing. A RESEAL CHILD HAS
     NO BUSINESS CHANGING ITS PARENT'S SEALED ARTIFACT: one that does is not entered into
     the claim at all and is fenced as an ordinary branch, which is F3's rule applied a
     second time - fewer ways to stand aside is the safer fence. Row (17).

     THE null LIMB IS NOT DEFENSIVE PROGRAMMING (R1 BLOCKING-C): it is the only thing
     that notices a branch DELETING the sealed artifact from its worktree, and that
     deletion is invisible to FENCE-SEALED-PATH-TOUCHED because the artifact is not a key
     of its own product map (D.2 says so). "Delete the artifact, then do as you like" is
     row (6) with the other hand, and row (6c) measures it.

     AND IT IS ASKED ONLY OF A BRANCH THAT CARRIED THE ARTIFACT TO BEGIN WITH, which is
     why the check sits below the diff and not above it (author finding F9, measured: it
     turned row (8g) red the moment N4's move put a branch through it). A branch cut
     BEFORE the chain sealed the artifact the fence is now reading does not carry that
     path at all, and the null limb read that absence as a deletion: from the day S9 seals,
     EVERY lane branch cut before it would have been accused of tampering with a file it
     has never seen. The question the check must ask is whether THIS BRANCH MOVED IT, so
     the comparison is asked only where the merge base already held the chain's own bytes.
     This costs the fence nothing it was relying on: the inventory is read out of Git at
     the chain ref whatever the worktree says, so a widened worktree copy changes no
     verdict here - the refusal is the DIAGNOSTIC that names the tamper, and R1
     BLOCKING-2's guarantee lives in the read, not in this comparison. Row (19). */
  const baseArtifact = (() => {
    try { return git(root, ["show", base + ":" + artifactPath]); } catch { return null; }
  })();
  const carriedAtBase = baseArtifact !== null && baseArtifact.equals(chainBytes);
  const worktree = fsBytes(path.join(root, ...artifactPath.split("/")));
  const tampered = carriedAtBase && (worktree === null || !worktree.equals(chainBytes));
  const refusals = [];
  if (tampered) refusals.push("FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + artifactPath);

  /* THE RESEAL-CHILD CLAIM, and its DEFAULT IS FAIL (R2 BLOCKING-A, PM-R4). */
  const specRe = /^rebuild\/lanes\/b\/tooling\/packages\/([^/]+)\.json$/;
  const added = touched.filter((t) => t.status === "A" && specRe.test(t.path));
  /* R2 N4: a TAMPERED branch never enters the claim. It is fenced as an ordinary branch,
     so both the tamper and its own sealed touches are named. Row (17). */
  if (!tampered && added.length > 0) {
    const bad = (n, why) => no("FENCE-RESEAL-CHILD-UNVERIFIED (" + n + ") " + why, here);
    if (added.length !== 1)
      return bad(1, "the diff adds " + added.length + " spec files at status A: " + added.map((t) => t.path).sort().join(" "));
    const specPath = added[0].path;
    /* R2 N3: CONDITION (1) REQUIRES A GENUINE ADD. The [RC] split synthesises an A record
       for the new path of a rename, so "git mv packages/S8.json packages/S10.json"
       presented a spec the branch never wrote. R2 built it and measured a SKIP. It was
       not exploitable against today's chain - a child's spec names its PARENT's artifact
       and the top artifact is its parent's successor, so condition (2) refused it - but a
       fence held by the shape of the chain rather than by a clause comes undone the day
       the shape moves. Row (16). */
    if (added[0].renamedFrom !== undefined)
      return bad(1, specPath + " reached status A only as the new path of a rename from "
        + added[0].renamedFrom + ": a reseal child is authored, and moving an existing spec does not earn the skip");
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
    /* R2 N2, second of three: the first limb above is satisfied by a DELETION, and this
       limb then read HEAD:<runner> on a path HEAD does not carry and threw. Deleting the
       runner does not earn the skip and must not throw either. Row (14). */
    let branchRunner = null;
    try { branchRunner = git(root, ["show", "HEAD:" + RUNNER]).toString("utf8"); } catch { branchRunner = null; }
    if (branchRunner === null)
      return bad(4, "this branch's HEAD does not carry " + RUNNER + " at all: the diff touches it by DELETING it");
    if (!idsOf(branchRunner).includes(id))
      return bad(4, id + " is not in IDS in this branch's own " + RUNNER);

    if (typeof spec.sourceBase !== "string" || !ancestorOf(root, spec.sourceBase, "HEAD"))
      return bad(5, "sourceBase " + JSON.stringify(spec.sourceBase ?? null) + " is not an ancestor of HEAD");

    return out("skip", [], { ...here, touched: touched.length,
      reason: "FENCE-RESEAL-CHILD " + id + " " + specPath + " stood aside on " + artifactPath
        + " " + artifactSha256 + " at " + chainRef + " (" + chainCommit + ")" });
  }

  /* F3, RULED AND NOT ADDED, and the reason belongs in the file rather than in a review.
     Condition (2) gets NO second limb for the after-the-merge case. Once a child has
     merged, a later push to the same lane branch no longer carries its spec at status A
     in the merge-base diff, so the reseal claim is not entered at all and the branch is
     fenced as an ordinary one. That is the right outcome, and row (8g) is the measurement
     of it. Fewer ways to stand aside is the safer fence. */

  /* BYTE-EXACT SET MEMBERSHIP, AND IT IS DELIBERATE (R1 N8). Not a prefix scan, not a
     substring scan and NOT case-folded: an inventory key is a repository path and the
     seal is over those exact bytes, so today-app.cjsx is not today-app.cjs and a
     case-only rename of a sealed path is a touch. Do not "fix" a Windows case complaint
     by lowercasing either side; that would admit a sealed path under another spelling on
     one operating system and not the other. Row (1d) holds both halves on BOTH systems:
     the extension half (today-app.cjsx is not today-app.cjs) and the case half, built
     WITHOUT a case-only rename - the sealed key is a spelling the tree does not carry at
     all, so the two never have to coexist on a case-insensitive filesystem. */
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
/* R1 N7: the failure line the real row prints counts the SEALED-PATH TOUCHES, not every
   refusal. refusals can also hold FENCE-INVENTORY-DIFFERS-FROM-CHAIN, which is not a
   sealed-path touch, and the old line called it one. R1 N10: it names the chain ref's
   COMMIT too, so a stale remote-tracking ref reads as a stale ref and not as a mystery.
   It is a function so that row (6c) can measure the counting on a real mixed result. */
const refusalLine = (r) => {
  const touches = r.refusals.filter((x) => x.startsWith("FENCE-SEALED-PATH-TOUCHED ")).length;
  return "this change drew " + r.refusals.length + " refusal(s), " + touches +
    " of them sealed path(s) that " + String(r.artifactPath) + " at " + CHAIN_REF +
    " (" + String(r.chainCommit) + ") does not release";
};

const APP = "rebuild/m3/w7-preview/today/today-app.cjs";
const CSS = "rebuild/m3/w7-preview/today/preview.css";
const BUILD = "rebuild/m3/w7-preview/today/build.mjs";
const TEMPLATE = "rebuild/m3/w7-preview/today/screens.template.html";
const PINNED = "rebuild/m3/w7-preview/today/test/package.test.cjs";
/* Built with String.fromCharCode on purpose, so THIS source file stays pure ASCII: a
   literal non-ASCII byte here could be normalised away by an editor, a checkout or a
   transport before the row ever runs, and the row would then measure nothing. 0xe9 is
   LATIN SMALL LETTER E WITH ACUTE, one code point, two bytes in UTF-8. */
const NONASCII = "rebuild/m3/w7-preview/today/caf" + String.fromCharCode(0xe9) + "-host.mjs";

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

/* R1 BLOCKING-C, RX7. THE SAME ATTACK WITH THE THIRD HAND, and it is the one the other
   two do not cover: instead of editing the sealed artifact the branch DELETES it from
   its worktree. FENCE-SEALED-PATH-TOUCHED cannot see that, because the artifact is not a
   key of its own product map, so the worktree === null limb of the tamper check at :183
   is the only thing between "delete the artifact" and "then do as you like". It had no
   row, and its removal turned nothing red.

   The row also carries R1 N7: refusalLine counts the SEALED-PATH TOUCHES and not every
   refusal, and this is the mixed result that measures the difference - two refusals, one
   of them a touch. */
test("D.2 (6c) - a branch that DELETES the sealed artifact from its worktree FAILS by name", () => {
  const root = chain({ product: [APP, CSS] });
  branch(root, { edits: { [APP]: "the branch's bytes\n" }, kills: [FIX_ART] });
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail", "deleting the inventory bought the branch a pass: " + names(r));
  assert.ok(r.refusals.includes("FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + FIX_ART),
    "the deletion of the artifact is invisible: " + names(r));
  assert.ok(r.refusals.includes("FENCE-SEALED-PATH-TOUCHED M " + APP), names(r));
  assert.equal(r.refusals.length, 2, names(r));

  /* R1 N7, measured on this result rather than argued. */
  const line = refusalLine(r);
  assert.match(line, /^this change drew 2 refusal\(s\), 1 of them sealed path\(s\) /,
    "the failure line counts a non-touch refusal as a sealed-path touch: " + line);
  /* R1 N10: and it names the commit the chain ref stood at. */
  assert.equal(r.chainCommit, gitText(root, ["rev-parse", CHAIN_REF]).trim());
  assert.ok(line.includes(r.chainCommit), line);
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

/* R1 BLOCKING-C, RX4. git QUOTES and octal-escapes a non-ASCII path by default, and a
   quoted string never matches an inventory key, so a sealed path carrying one non-ASCII
   byte would walk straight through the fence. -c core.quotepath=false (:73) is the only
   thing that stops it, and nothing measured it. Measured with the clause dropped:
     DEFAULT:                    M  "rebuild/m3/w7-preview/today/caf\303\251-host.mjs"
     core.quotepath=false:       M  rebuild/m3/w7-preview/today/cafe-host.mjs (with the real byte)
   The second half of the row is the BYTE-EXACTNESS control of R1 N8 that CAN be run on
   both operating systems: a path that merely EXTENDS a sealed one is not sealed, so the
   lookup is Set membership and not a prefix or substring scan. */
test("D.2 (1d) - a sealed path with a non-ASCII byte is refused BY NAME, and the lookup is byte-exact", () => {
  const root = chain({ product: [NONASCII, CSS] });
  branch(root, { edits: { [NONASCII]: "a lane C edit\n" } });
  const r = fence(root, CHAIN_REF);
  assert.deepEqual(r.refusals, ["FENCE-SEALED-PATH-TOUCHED M " + NONASCII],
    "git quoted the path: -c core.quotepath=false is what stops that. " + names(r));

  /* and a path that only EXTENDS a sealed one is NOT in the inventory. */
  const near = chain({ product: [APP], free: [APP + "x"] });
  branch(near, { edits: { [APP + "x"]: "a lane C edit\n" } });
  const rn = fence(near, CHAIN_REF);
  assert.equal(rn.status, "pass", "the sealed-path lookup is a prefix scan, not a Set: " + names(rn));

  /* AND THE CASE HALF OF R1 N8, on BOTH operating systems. A case-only RENAME cannot be
     built on a case-insensitive filesystem, so the two spellings are never both on disk
     here: the sealed key is one the tree does not carry at all, and the branch touches
     the other spelling. Under any case folding the touch would match the key and the
     branch would be refused for a path nothing sealed. It must PASS. */
  const cased = chain({ artifacts: [["acceptance-s8-fixture.json",
    inventory({ product: ["rebuild/m3/w7-preview/today/TODAY-APP.cjs", CSS] })]],
    product: [], free: [APP, CSS] });
  branch(cased, { edits: { [APP]: "a lane C edit\n" } });
  const rc = fence(cased, CHAIN_REF);
  assert.equal(rc.status, "pass",
    "the sealed-path lookup case-folds: a path nothing sealed was refused. " + names(rc));
});

/* R1 BLOCKING-C, RX1. git diff --name-status reports a rename as one record,
   "R100<TAB>old<TAB>new". The [RC] split at :128 reads it as a DELETION of the old path
   plus an ADDITION of the new one (author finding F5). Both halves are load-bearing and
   only the first had a row: without the split's second half parts[2] is never looked at
   at all, so a file renamed ONTO a sealed path was asserted by nothing. */
test("D.2 (1e) - a RENAME is read at BOTH ends: the old path at D and the NEW path at A", () => {
  const away = chain({ product: [APP, CSS] });
  git(away, ["mv", APP, APP + "2"]);
  commit(away, "the lane branch renames a sealed path away");
  const ra = fence(away, CHAIN_REF);
  assert.ok(gitLines(away, ["diff", "--name-status", CHAIN_REF, "HEAD"]).some((l) => /^R/.test(l)),
    "the fixture did not produce a rename record at all");
  assert.deepEqual(ra.refusals, ["FENCE-SEALED-PATH-TOUCHED D " + APP], names(ra));

  /* and ONTO: the sealed path is a key of the inventory that does not exist in the tree,
     so the rename lands on it at status A. Only parts[2] can see this. */
  const onto = chain({ artifacts: [["acceptance-s8-fixture.json", inventory({ product: [APP, CSS] })]],
    product: [], free: [TEMPLATE, CSS] });
  git(onto, ["mv", TEMPLATE, APP]);
  commit(onto, "the lane branch renames another file ONTO a sealed path");
  const ro = fence(onto, CHAIN_REF);
  assert.ok(ro.refusals.includes("FENCE-SEALED-PATH-TOUCHED A " + APP),
    "the NEW path of a rename was never examined: " + names(ro));
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

/* R1 BLOCKING-B. The sibling of row (4), and it had no row at all. The chain ref is
   THERE and its rebuild/m4/spec/ holds no acceptance artifact: the fence must FAIL by
   name rather than fall back to refs/heads, to the worktree, or to a vacuous pass, which
   is the rule D.2 applies to every other outcome. This refusal name is the author's
   (F4), not the spec's, and the PM may rename it; nothing depends on the spelling. The
   row also holds the FILE-NAME rule: a .json.bak beside the real thing is not parsed. */
test("D.2 (4b) - a chain ref whose spec directory holds NO acceptance artifact FAILS by name", () => {
  const root = chain({ artifacts: [
    ["review-fixture.json", "{}\n"],
    ["acceptance-s8-old.json.bak", inventory({ product: [APP] })],
  ], product: [], free: [APP, CSS] });
  branch(root, { edits: { [APP]: "a lane C edit\n" } });
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail", "an empty inventory directory passed vacuously: " + JSON.stringify(r.status));
  assert.deepEqual(r.refusals, ["FENCE-NO-INVENTORY-AT-CHAIN-REF " + CHAIN_REF + ":" + SPEC_DIR]);
  assert.equal(r.artifactPath, null, "it chose an artifact anyway: " + String(r.artifactPath));
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

  /* and TWO specs that would EACH pass on their own are still not exactly one. Without
     this sub-row the "exactly one" clause is untestable: the key closure catches every
     malformed second file, so nothing measures the clause itself. */
  const both = chain({ product: [APP] });
  const artSha = shaOfBlob(both, CHAIN_REF, FIX_ART);
  const base = gitText(both, ["rev-parse", CHAIN_REF]).trim();
  child(both, {
    alsoAdd: { [PACKAGES + "S10.json"]: specFile({ packageId: "S10", parentId: "S8", artifact: FIX_ART, sha256: artSha, sourceBase: base }) },
    branchIds: ["S7", "S8", "S9", "S10"],
    alsoTouch: { [APP]: "a lane C edit\n" } });
  unverified(fence(both, CHAIN_REF), 1);
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
  /* the runner IS in the diff, and carries some other id instead. Without the second
     limb of (4) this branch would walk through, so the two limbs are measured apart. */
  const root = chain({ product: [APP] });
  child(root, { branchIds: ["S7", "S8", "B1"], alsoTouch: { [APP]: "a lane C edit\n" } });
  unverified(fence(root, CHAIN_REF), 4);

  /* and the same condition refuses a branch that never touches the runner at all: that
     is the one hunk no reseal child can skip, and it is the only condition that costs. */
  const untouched = chain({ product: [APP] });
  child(untouched, { runnerInDiff: false, alsoTouch: { [APP]: "a lane C edit\n" } });
  unverified(fence(untouched, CHAIN_REF), 4);

  /* AND THE ROW THAT MAKES THE FIRST LIMB OF (4) MEAN SOMETHING ON ITS OWN. Here the
     chain ALREADY carries the id in IDS, so a branch that adds the spec and never opens
     b-package.cjs would inherit the id from the chain and satisfy the second limb. The
     first limb - the runner must be IN THE DIFF - is the only thing left, and it is the
     one that costs a sealed byte. */
  const inherited = chain({
    artifacts: [["acceptance-s9-fixture.json",
      inventory({ packageId: "M2-S9-FIXTURE", lanePackage: "S9", product: [APP] })]],
    product: [], free: [APP], ids: ["S7", "S8", "S9"] });
  const art = SPEC_DIR + "acceptance-s9-fixture.json";
  child(inherited, { id: "S9", artifact: art, sha: shaOfBlob(inherited, CHAIN_REF, art),
    runnerInDiff: false, alsoTouch: { [APP]: "a lane C edit\n" } });
  unverified(fence(inherited, CHAIN_REF), 4);
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

/* ================== THE ROWS R1 ASKED FOR THAT ARE NOT IN D.2's OWN LIST ==============
   Each one exists because a guard clause of fence() survived removal with not a single
   row changing colour. A clause nothing measures is a clause nobody can rely on, so the
   answer to a surviving mutant is another row and never a weaker claim. */

/* R1 BLOCKING-A, AND IT IS THE CLAUSE THAT GOVERNS THE NORMAL CASE. :124 diffs from
   merge-base(chainRef, HEAD), not from the chain ref. In every other row of this file the
   chain ref IS the merge base, so the two forms agree and the clause is invisible; here
   the branch is cut at A, touches ONE file nothing ever sealed, and the chain then moves
   TWO SEALED PATHS on a line of its own. The branch is merely BEHIND.

   MEASURED ON THE REAL REPOSITORY the day this row was written, so the world it guards
   is not hypothetical: the chain ref stood 8 commits ahead of this branch's merge base,
   git diff --name-status <merge-base> HEAD reported 32 paths and the two-dot form
   reported 34. The two extra were unsealed that day; the chain moves a sealed byte on
   its next reseal. */
test("D.2 (9) - a branch merely BEHIND the chain PASSES: the diff runs from the MERGE BASE", () => {
  const root = chain({ product: [APP, CSS], free: [TEMPLATE] });
  const A = headOf(root);
  branch(root, { edits: { [TEMPLATE]: "<template id=\"t-today\"></template>\n" } });
  const HEAD = headOf(root);
  /* the chain moves two SEALED paths, on a line of its own, so the merge base stays A */
  git(root, ["checkout", "-q", "-b", "chainline", A]);
  put(root, APP, "the chain's next bytes\n");
  put(root, CSS, ".chain{color:#000}\n");
  commit(root, "the chain moves two sealed paths");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);
  git(root, ["checkout", "-q", "main"]);
  assert.equal(headOf(root), HEAD, "the fixture moved the branch");

  /* the fixture really does build the world: the two-dot diff DOES name the sealed
     paths, and the merge-base diff names only the branch's own unsealed change. */
  const twoDot = gitLines(root, ["diff", "--name-status", CHAIN_REF, "HEAD"]).map((l) => l.split("\t")[1]);
  assert.ok(twoDot.includes(APP) && twoDot.includes(CSS),
    "the fixture does not build the world the merge-base clause guards: " + twoDot.join(" "));
  const fromBase = gitLines(root, ["diff", "--name-status",
    gitText(root, ["merge-base", CHAIN_REF, "HEAD"]).trim(), "HEAD"]).map((l) => l.split("\t")[1]);
  assert.deepEqual(fromBase, [TEMPLATE], "the merge-base diff is not the branch's own change");

  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "pass",
    "a branch that is merely BEHIND the chain was refused for paths it never touched: " + names(r));
  assert.deepEqual(r.refusals, []);
  assert.equal(r.touched, 1, "the fence read more than the branch's own change: " + String(r.touched));
});

/* R1 N2. A runner with no git must not be told the CHAIN REF is missing: :99's try/catch
   swallowed ENOENT into the ref-absent name, so a machine without git reported a world
   that was not the one it was in. The mapping is chainRefRefusal() and this row measures
   it with a REAL ENOENT raised by the same API - execFileSync on a binary that is not
   there - and with a REAL non-zero exit from a ref that is genuinely gone. The property
   that matters is unchanged either way: the fence never passes. */
test("R1 N2 (10) - a git that cannot be spawned is NOT reported as a missing chain ref", () => {
  let spawnFail = null;
  try { execFileSync("git-s9-fence-is-not-a-binary", ["--version"], { stdio: ["ignore", "pipe", "pipe"] }); }
  catch (e) { spawnFail = e; }
  assert.notEqual(spawnFail, null, "the probe did not raise at all");
  assert.equal(spawnFail.code, "ENOENT", "the probe did not raise a real ENOENT: " + String(spawnFail.code));
  assert.match(chainRefRefusal(spawnFail, CHAIN_REF), /^FENCE-GIT-UNAVAILABLE /,
    "a missing git reads as a missing chain ref: " + chainRefRefusal(spawnFail, CHAIN_REF));

  const root = chain({ product: [APP] });
  branch(root, { edits: { [TEMPLATE]: "harmless\n" } });
  git(root, ["update-ref", "-d", CHAIN_REF]);
  let refGone = null;
  try { git(root, ["rev-parse", "--verify", "--quiet", CHAIN_REF + "^{commit}"]); }
  catch (e) { refGone = e; }
  assert.notEqual(refGone, null, "a deleted ref did not raise");
  assert.notEqual(refGone.code, "ENOENT", "a deleted ref raised ENOENT: the two cannot be told apart");
  assert.equal(chainRefRefusal(refGone, CHAIN_REF), "FENCE-CHAIN-REF-ABSENT " + CHAIN_REF);
  assert.equal(fence(root, CHAIN_REF).status, "fail");
});

/* R1 N1. E fact 15 says the released block is an OBJECT keyed by path. Nothing on either
   side of that asserts the shape, and the S9 sealer is the thing that will write it, so
   this row states the DIRECTION the fence fails in if the shape is ever wrong: an array
   releases nothing, because its Object.keys are "0", "1", ... and no index is a path.
   Fail closed, measured, rather than a mystery red on the day it happens. */
test("R1 N1 (12) - a released block of the WRONG SHAPE releases nothing: the fence fails CLOSED", () => {
  const good = JSON.parse(inventory({ product: [APP, CSS], released: [CSS] }));
  const arrayed = { ...good, released: [CSS] };
  const root = chain({ artifacts: [["acceptance-s8-fixture.json", JSON.stringify(arrayed, null, 1) + "\n"]],
    product: [], free: [APP, CSS] });
  branch(root, { edits: { [CSS]: ".a{color:#fff}\n" } });
  assert.deepEqual(fence(root, CHAIN_REF).refusals, ["FENCE-SEALED-PATH-TOUCHED M " + CSS],
    "an array-valued released block admitted a sealed path");

  /* the same inventory with the shape E fact 15 specifies DOES release it, so the row
     above is measuring the shape and not some other difference. */
  const ok = chain({ product: [APP, CSS], released: [CSS] });
  branch(ok, { edits: { [CSS]: ".a{color:#fff}\n" } });
  assert.equal(fence(ok, CHAIN_REF).status, "pass", names(fence(ok, CHAIN_REF)));
});

/* ============== R2's NOTES, AND THE PM's OWN FINDING: SIX MORE ROWS ==================
   R2 was ACCEPT WITH NOTES and the PM ruled four of them into the cell. Each one below is
   a world the shipped fence got WRONG IN ITS OUTPUT rather than in its verdict: three
   raw stack traces (N2), a skip nobody authored (N3), a skip that stood aside over a
   tampered parent artifact (N4), and a step that never runs in CI at all (P-FENCE-1).
   None of them was a bypass; every one of them costs a reader the line this cell is for. */

/* R2 N2, first of three. An unrelated history has no merge base, git merge-base exits
   non-zero and execFileSync threw a raw "Command failed: git ... merge-base" at :151.
   It is not a bypass - the row went red either way - but the CI log said nothing a human
   could act on, and D.2's governing property is that every outcome is a NAMED refusal. */
test("R2 N2 (13) - a chain ref and a HEAD sharing NO history is a NAMED refusal, not a stack", () => {
  const root = chain({ product: [APP] });
  git(root, ["checkout", "-q", "--orphan", "unrelated"]);
  put(root, TEMPLATE, "an unrelated history\n");
  commit(root, "an unrelated history");
  assert.throws(() => git(root, ["merge-base", CHAIN_REF, "HEAD"]),
    "the fixture did not build an unrelated history at all");
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail");
  assert.equal(r.refusals.length, 1, names(r));
  assert.match(r.refusals[0], /^FENCE-NO-MERGE-BASE /, names(r));
  assert.ok(r.refusals[0].includes(CHAIN_REF), names(r));
});

/* R2 N2, second of three. Condition (4)'s FIRST limb ("the diff touches the runner") is
   satisfied by a DELETION, and the second limb then read HEAD:<runner> on a path HEAD
   does not carry. Deleting b-package.cjs must not earn the skip and must not throw:
   it is refused at (4), by name, saying which. */
test("R2 N2 (14) - a reseal child that DELETES b-package.cjs is refused BY NAME at condition (4)", () => {
  const root = chain({ product: [APP] });
  const sha = shaOfBlob(root, CHAIN_REF, FIX_ART);
  const base = gitText(root, ["rev-parse", CHAIN_REF]).trim();
  branch(root, {
    edits: {
      [PACKAGES + "S9.json"]: specFile({ packageId: "S9", parentId: "S8",
        artifact: FIX_ART, sha256: sha, sourceBase: base }),
      [APP]: "a lane C edit\n",
    },
    kills: [RUNNER],
  });
  const r = fence(root, CHAIN_REF);
  unverified(r, 4);
  assert.ok(r.refusals[0].includes(RUNNER), names(r));
});

/* R2 N2, third of three. JSON.parse at :134 threw on an artifact that is not JSON. The
   ARRAY half is the one that matters most: an array parses, inv.product is undefined,
   the sealed set is EMPTY and the branch passes vacuously - which is the one outcome D.2
   refuses everywhere else. Both halves are one refusal now. */
test("R2 N2 (15) - an artifact at the chain ref that is not a JSON OBJECT is a NAMED refusal", () => {
  const root = chain({ artifacts: [["acceptance-s8-fixture.json", "not json at all\n"]],
    product: [], free: [APP] });
  branch(root, { edits: { [APP]: "a lane C edit\n" } });
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail");
  assert.equal(r.refusals.length, 1, names(r));
  assert.match(r.refusals[0], /^FENCE-INVENTORY-NOT-JSON /, names(r));
  assert.ok(r.refusals[0].includes(SPEC_DIR + "acceptance-s8-fixture.json"), names(r));

  const arr = chain({ artifacts: [["acceptance-s8-fixture.json", "[]\n"]],
    product: [], free: [APP] });
  branch(arr, { edits: { [APP]: "a lane C edit\n" } });
  const ra = fence(arr, CHAIN_REF);
  assert.equal(ra.status, "fail",
    "an ARRAY-valued inventory passed vacuously: nothing was in the sealed set. " + names(ra));
  assert.match(ra.refusals[0], /^FENCE-INVENTORY-NOT-JSON /, names(ra));
});

/* R2 N3, ADOPTED AS A FIX AND NOT AS A SENTENCE. :161 filters the diff for status "A",
   and the [RC] split synthesises an "A" record for the NEW path of a rename. So
   "git mv packages/S8.json packages/S10.json" presented a spec file the branch never
   wrote as an ADDED spec, and R2 built it and measured a SKIP. It was not exploitable
   against today's chain - a child's spec names its PARENT's artifact and the top artifact
   is its parent's successor, so condition (2) refused it - but a fence held by the shape
   of the chain rather than by a clause is a fence that comes undone the day the shape
   moves. Condition (1) now requires a GENUINE add. */
test("R2 N3 (16) - a spec that reached status A by git mv does NOT earn the skip: condition (1)", () => {
  const root = chain({ product: [APP] });
  const first = headOf(root);
  const sha = shaOfBlob(root, CHAIN_REF, FIX_ART);
  put(root, PACKAGES + "S8.json", specFile({ packageId: "S8", parentId: "S8",
    artifact: FIX_ART, sha256: sha, sourceBase: first }));
  commit(root, "the chain carries its own spec");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);

  /* the branch authors NOTHING: it renames the ancestor spec onto a new id, puts that id
     in its own runner stub, and touches a sealed path. Every other condition holds. */
  git(root, ["mv", PACKAGES + "S8.json", PACKAGES + "S10.json"]);
  put(root, RUNNER, runnerStub(["S7", "S8", "S10"]));
  put(root, APP, "a lane C edit\n");
  commit(root, "the lane branch renames an ancestor spec onto a new id");
  const mb = gitText(root, ["merge-base", CHAIN_REF, "HEAD"]).trim();
  assert.ok(gitLines(root, ["diff", "--name-status", mb, "HEAD"]).some((l) => /^R/.test(l)),
    "the fixture did not produce a rename record at all, so it measures nothing");

  const r = fence(root, CHAIN_REF);
  unverified(r, 1);
  assert.ok(r.refusals[0].includes(PACKAGES + "S8.json"),
    "the refusal does not name what the spec was renamed FROM: " + names(r));
  assert.ok(r.refusals[0].includes(PACKAGES + "S10.json"), names(r));
});

/* R2 N4, ADOPTED. The verified skip used to return BEFORE the artifact-tamper check, so a
   child that satisfied all five conditions AND widened its PARENT's sealed artifact in
   its worktree stood aside in silence. Condition (2) binds the spec to the sha the fence
   measures AT THE CHAIN REF, so the tamper bought the child nothing - but the cell that
   exists to notice artifact tampering did not notice it. THE TAMPER CHECK NOW RUNS FIRST,
   FOR EVERY BRANCH: a reseal child has no business changing its parent's sealed artifact,
   and one that does is not entered into the claim at all. It is fenced as an ordinary
   branch, which is F3's rule applied a second time: fewer ways to stand aside. */
test("R2 N4 (17) - a child that would otherwise be VERIFIED, tampering with its parent's artifact, FAILS", () => {
  /* the green control first, so the row measures the tamper and not the child. */
  const clean = chain({ product: [APP, CSS] });
  child(clean, { alsoTouch: { [APP]: "the reseal child's own edit\n" } });
  const rc = fence(clean, CHAIN_REF);
  assert.equal(rc.status, "skip", "the control child does not skip at all: " + names(rc));

  const root = chain({ product: [APP, CSS] });
  child(root, { alsoTouch: { [APP]: "the reseal child's own edit\n",
    [FIX_ART]: inventory({ product: [CSS], released: [APP] }) } });
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail",
    "a child widened its parent's inventory in its worktree and still stood aside: " + JSON.stringify(r.reason));
  assert.equal(r.reason, null, "it printed a stand-aside reason anyway: " + String(r.reason));
  assert.ok(r.refusals.includes("FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + FIX_ART), names(r));
  /* and, being fenced as an ordinary branch, its own sealed touch is named too. */
  assert.ok(r.refusals.includes("FENCE-SEALED-PATH-TOUCHED M " + APP), names(r));
});

/* AUTHOR FINDING F9, AND IT IS THE ONE R2 N4's MOVE UNCOVERED rather than caused. The
   tamper check's worktree === null limb read "this branch does not carry the artifact" as
   "this branch deleted the artifact". A branch cut BEFORE the chain sealed the artifact
   the fence now reads carries no such path, and from the day S9 seals that is EVERY lane
   branch cut before it. Measured, at the commit that moved the check and nowhere else:

     D.2 (8g) ... AssertionError: FENCE-INVENTORY-DIFFERS-FROM-CHAIN
       rebuild/m4/spec/acceptance-s9-fixture.json | FENCE-SEALED-PATH-TOUCHED M ...
       2 !== 1

   Row (8g) is not edited for it and is green again on its own assertions; this row is the
   world stated directly, with the half that must STILL be refused beside it so the limb
   cannot be widened into an excuse. */
test("F9 (19) - a branch cut BEFORE the chain sealed this artifact is not accused of tampering", () => {
  const root = chain({ product: [APP, CSS] });
  const A = headOf(root);
  branch(root, { edits: { [TEMPLATE]: "<template id=\"t-today\"></template>\n" } });
  /* the chain seals a NEW artifact, on a line of its own, so the merge base stays at A
     and the branch's worktree never carries acceptance-s9-fixture.json at all. */
  git(root, ["checkout", "-q", "-b", "chainline", A]);
  put(root, SPEC_DIR + "acceptance-s9-fixture.json",
    inventory({ packageId: "M2-S9-FIXTURE", lanePackage: "S9", product: [APP, CSS] }));
  commit(root, "the chain seals a new artifact");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);
  git(root, ["checkout", "-q", "main"]);

  const r = fence(root, CHAIN_REF);
  assert.equal(r.artifactPath, SPEC_DIR + "acceptance-s9-fixture.json", "the chain did not advance");
  assert.equal(fs.existsSync(path.join(root, ...r.artifactPath.split("/"))), false,
    "the fixture does not build the world at all: the branch DOES carry the new artifact");
  assert.equal(r.status, "pass",
    "a branch that predates the chain's newest artifact was accused of tampering with it: " + names(r));

  /* AND THE HALF THAT MUST STILL BE REFUSED, so the limb is not an excuse: the same
     branch, carrying the chain's own artifact and deleting it, is still a tamper. */
  const del = chain({ product: [APP, CSS] });
  branch(del, { edits: { [APP]: "the branch's bytes\n" }, kills: [FIX_ART] });
  assert.ok(fence(del, CHAIN_REF).refusals.includes("FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + FIX_ART),
    "the carried-at-base limb excused a real deletion: " + names(fence(del, CHAIN_REF)));
});

/* THE PM's OWN FINDING P-FENCE-1, AND IT IS ABOUT CI AND NOT ABOUT fence(). GitHub skips
   every step after a failed one, and rebuild.yml carried no step condition anywhere. The
   standing step at :150 (b-package.cjs --ci --package S8) FAILS on exactly the branches
   this fence exists for: one carrying undeclared sealed edits prints
   SEALED-PROFILE-RECOMPUTATION with local diagnostics withheld, naming nothing, and one
   that does not contain the chain tip prints SEAL-BASE-IS-NOT-THE-CHAIN-TIP
   (DECISIONS:554). The fence's step sits after it, so in the world D.2 wrote it for the
   fence was SKIPPED and its one readable sentence never printed. The step now carries
   "if: ${{ !cancelled() }}" - it runs after an earlier failure, and not when the run was
   cancelled - and THIS ROW is what says so the day somebody takes it out again. It reads
   rebuild.yml as TEXT, finds the step by this file's own path rather than by a line
   number, and never globs. */
test("P-FENCE-1 (18) - this cell's own step in rebuild.yml carries the not-cancelled condition", () => {
  const SELF = path.relative(REPO, fileURLToPath(import.meta.url)).split(path.sep).join("/");
  const yml = fs.readFileSync(path.join(REPO, ".github", "workflows", "rebuild.yml"), "utf8")
    .split(/\r?\n/);
  const runAt = yml.findIndex((l) => l.trim().startsWith("run:") && l.includes(SELF));
  assert.notEqual(runAt, -1, "no step in rebuild.yml runs " + SELF + " at all");
  let nameAt = runAt;
  while (nameAt > 0 && !/^\s*-\s+name:/.test(yml[nameAt])) nameAt -= 1;
  assert.ok(/^\s*-\s+name:/.test(yml[nameAt]), "the run: line sits in no named step");
  const block = yml.slice(nameAt, runAt + 1);
  const cond = block.find((l) => /^\s*if:/.test(l));
  assert.notEqual(cond, undefined,
    "the fence's own step carries no `if:` at all, so GitHub skips it after the standing "
    + "step at :150 fails - which is every branch this fence exists for (P-FENCE-1): "
    + block.map((l) => l.trim()).join(" / "));
  assert.match(cond, /!\s*cancelled\(\)/,
    "the condition is not `not cancelled`, so the step either never runs after a failure "
    + "or runs after a cancellation: " + cond.trim());
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
  assert.deepEqual(r.refusals, [], refusalLine(r));
});
