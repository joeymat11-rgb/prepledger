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
   AND THE HONEST SENTENCE THE REVIEWER ASKED FOR (R2 N4, corrected by R3 BLOCKING-2):
   once the five conditions hold, the skip returns before the sealed-path loop, so A
   VERIFIED RESEAL CHILD IS FENCED BY THE SEAL AND BY fidelity(), AND BY THIS CELL NOT AT
   ALL. The one thing this cell still holds against such a child is the artifact-tamper
   check, which R2 N4 moved ABOVE the claim so that a child rewriting its PARENT's sealed
   artifact cannot stand aside - and it holds it now WHEREVER THE BRANCH WAS CUT, because
   the check asks THE DIFF and not the merge base's bytes (rows (21) and (22): until R3
   measured them, a child cut one reseal earlier stood aside anyway). What remains is the
   limit stated the other way round, and it is the whole of it: a branch whose own diff
   never touches the artifact is never accused of tampering with it, and a byte-equal copy
   of the chain's bytes is a touch and not a tamper.

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

const conditionIsNotCancelled = (cond) =>
  /^\s*if:\s*\$\{\{\s*!cancelled\(\)\s*\}\}\s*$/.test(cond);

const HERE = path.dirname(fileURLToPath(import.meta.url));
/* rebuild/lanes/c/ui-port -> the repository root. */
const REPO = path.resolve(HERE, "..", "..", "..", "..");
const CHAIN_REF = "refs/remotes/origin/rebuild/t2-client-core";
const SPEC_DIR = "rebuild/m4/spec/";
const RUNNER = "rebuild/lanes/b/tooling/b-package.cjs";
const PACKAGES = "rebuild/lanes/b/tooling/packages/";
/* b-package.cjs:1172-1183 (runner 5321181a), copied BY VALUE because a cell that audits
   the sealed set must not import the thing it audits. It mirrors H5 exactly: twenty-two
   keys, of which `release` (:1183) is the ONE optional key and every other key is
   required. spec() closes it at :1852 with the freeze pattern,
   keys({ ...s, release: null }, SPEC_KEYS, ...), and condition (1) below applies the same
   pattern, so an absent release and a present one are both admitted and a key that is
   neither is refused. Until S9 round 6 this copy was the twenty-one keys of the old
   :1071 without `release`, and packages/S9.json's release block (6dc2596) was refused at
   (1): Fable l1 D1, row (33). */
const SPEC_KEYS = ["version", "lanePackage", "packageId", "status", "brief", "sourceBase",
  "dIds", "laws", "carriedAcceptedIds", "privateLiveTriggered", "parent", "tooling",
  "product", "coverage", "carrierSuccessor", "witnessFlips", "protectedSurfaces",
  "authorizations", "artifact", "children", "notes", "release"];

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

     THE null LIMB IS NOT DEFENSIVE PROGRAMMING (R1 BLOCKING-C): it notices a branch
     DELETING the sealed artifact from its worktree even if HEAD still carries it, and that
     deletion is invisible to FENCE-SEALED-PATH-TOUCHED because the artifact is not a key
     of its own product map (D.2 says so). "Delete the artifact, then do as you like" is
     row (6) with the other hand, and row (6c) measures it.

     AND IT ASKS EXACTLY ONE QUESTION: DID THIS BRANCH MOVE THE ARTIFACT. That is why the
     check sits below the diff and not above it (author finding F9, narrowed to this by
     R3 BLOCKING-2). A branch cut BEFORE the chain sealed the artifact the fence is now
     reading does not carry that path at all, and the null limb alone read that absence as
     a deletion: from the day S9 seals, EVERY lane branch cut before it would have been
     accused of tampering with a file it has never seen. F9's first answer asked instead
     whether the MERGE BASE already held the chain's CURRENT bytes, and that is a DIFFERENT
     question - it is false for every branch cut before the chain last moved that artifact,
     so inside that window the tamper check was simply OFF. R3 built the window and
     measured three branches inside it: a verified child widening a NEWLY sealed artifact
     (row (21)) and a verified child widening a RE-sealed one (row (22)) both SKIPPED,
     which is what R2 N4 ruled out, and an ordinary branch FORGING the chain's newest
     artifact with released = every path (row (23)) PASSED with no refusal at all.
     The limb is now the DIFF itself, which is the question the sentence above asks: a path
     the branch's own merge-base diff never touched is never accused (F9 stays closed, row
     (19) and row (23)'s second half), a DELETION is a touch because a D record is a touch
     (row (6c)), and a cherry-picked byte-equal copy is a touch that is not a tamper.
     This costs the fence nothing it was relying on: the inventory is read out of Git at
     the chain ref whatever the worktree says, so a widened worktree copy changes no
     verdict here - the refusal is the DIAGNOSTIC that names the tamper, and R1
     BLOCKING-2's guarantee lives in the read, not in this comparison. Row (19). */
  const worktree = fsBytes(path.join(root, ...artifactPath.split("/")));
  /* ASTRA R4 FINDING 1: on a case-insensitive disk the old spelling can still read
     equal bytes after a case-only rename. Ask Git for the exact HEAD path INSIDE the
     touch guard, so an older branch that never touched this inventory stays innocent.
     ls-tree plus exact membership does not inherit core.ignorecase's disk aliases.
     Rows (24)-(25), and row (6d) holds the byte-equal touch in the PASS direction.

     R5 N1, PM RULING: the reviewer found no reachable world where this query fails:
     rev-parse on the chain ref and merge-base against HEAD have already succeeded,
     and the diff that computed the touch has already walked the same trees. No row
     can therefore hold the catch; Y9 rewrote it to fail OPEN with tampered = false
     and left all 43 rows green on both systems. Without a catch, an unexpected Git
     failure THROWS, the calling row goes red with Git's own message, and the fence
     fails CLOSED by construction with no catch clause left to weaken. N4's null
     touched count on that refusal path disappears with the path. */
  const tampered = touched.some((t) => t.path === artifactPath)
    && (!gitText(root, ["ls-tree", "--name-only", "-z", "HEAD", "--", artifactPath])
      .split("\0").includes(artifactPath) || worktree === null || !worktree.equals(chainBytes));
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
    /* H5's freeze pattern (b-package.cjs:1852): release optional, every other key exact. */
    if (Object.keys({ ...spec, release: null }).sort().join(",") !== [...SPEC_KEYS].sort().join(","))
      return bad(1, specPath + " is not the runner's own SPEC_KEYS key closure (b-package.cjs:1172-1183, closed at :1852)");

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
/* R3 M43, ADOPTED: RETIRED_IDS comes FIRST. idsOf's `\b` word boundary is equivalent
   today only because the real runner declares IDS at b-package.cjs:173 and RETIRED_IDS at
   :185, so the leftmost match is the right one either way and the guard measured nothing.
   With the retired list ahead of it, EVERY reseal row in this file measures the boundary
   for free: drop the `\b` and idsOf reads ['B-LOM'] instead of the branch's own ids, and
   condition (4) refuses every child. Two lines, no new row. */
const runnerStub = (ids) =>
  "// fixture stand-in for " + RUNNER + "\n" +
  "const RETIRED_IDS = ['B-LOM'];\n" +
  "const SPEC_DIR = 'packages', IDS = [" + ids.map((i) => "'" + i + "'").join(", ") + "];\n";

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

/* R5 X5, AND IT IS THE ONLY WORLD THE null LIMB STILL HAS. Exact HEAD absence now covers
   every COMMITTED deletion of the inventory (row (6c)), so what is left to the null limb
   is the UNCOMMITTED one: HEAD carries the path, the branch's own diff touches it with
   the chain's exact bytes, and the file is gone from the disk the fence reads. Remove the
   limb and the byte comparison dereferences null and THROWS, so this row goes red. (When
   review R5 wrote this row a catch turned that throw into FENCE-INVENTORY-HEAD-UNREADABLE,
   naming a Git failure for a world in which Git answered perfectly well; the PM removed
   that catch in the same round, see the comment at the check.) THE CONTROL HALF IS THE OTHER HALF OF THE ROW: a branch
   that touches the inventory path with the CHAIN'S OWN BYTES is a touch and not a tamper
   (the sentence the check's own comment ends on), and until this row nothing measured the
   new HEAD-presence limb in the direction that lets an innocent branch through. */
test("R5 (6d) - a byte-equal touch PASSES, and an UNCOMMITTED worktree deletion of it is a TAMPER", () => {
  const root = chain({ product: [APP, CSS] });
  git(root, ["checkout", "-q", "-b", "chainline"]);
  put(root, FIX_ART, inventory({ product: [APP, CSS], released: [CSS] }));
  commit(root, "the chain re-seals its inventory");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);
  const sealed = git(root, ["show", "HEAD:" + FIX_ART]).toString("utf8");
  git(root, ["checkout", "-q", "main"]);
  put(root, FIX_ART, sealed);
  commit(root, "the branch cherry-picks the chain's exact bytes");
  const base = gitText(root, ["merge-base", CHAIN_REF, "HEAD"]).trim();
  assert.deepEqual(gitLines(root, ["diff", "--name-status", base, "HEAD"]), ["M\t" + FIX_ART],
    "the fixture did not touch the inventory with byte-equal bytes");
  const control = fence(root, CHAIN_REF);
  assert.equal(control.status, "pass",
    "a byte-equal copy of the chain's own bytes was accused of tampering: " + names(control));
  assert.deepEqual(control.refusals, [], names(control));
  assert.equal(control.touched, 1, names(control));
  drop(root, FIX_ART);
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail", "the deleted worktree copy bought the branch a pass: " + names(r));
  assert.deepEqual(r.refusals, ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + FIX_ART], names(r));
  assert.equal(r.touched, 1, names(r));
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
  const rr = fence(rubbish, CHAIN_REF);
  unverified(rr, 1);
  /* R3 M29, ADOPTED: `catch { spec = null }` on the `git show HEAD:<spec>` read can be
     changed to `catch { spec = {} }` and the VERDICT does not move - `{}` then fails the
     SPEC_KEYS closure and the branch is still refused at (1). What moves is the sentence
     a human reads: a file that is not JSON at all would be reported as "not the runner's
     own SPEC_KEYS key closure". That is R3-B one level down, inside the fix for R3-B, and
     the answer is the same: an assertion, not a weaker claim. */
  assert.ok(rr.refusals[0].includes("does not parse"),
    "a body that is not JSON is reported as a key-closure miss: " + names(rr));

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
  /* AND IT MUST SAY WHICH WORLD IT IS IN. Reported as measured: with only the two
     assertions above, removing the branchRunner === null limb SURVIVED my sweep
     (mutation R3-B). idsOf(null) returns [] by way of exec coercing null to "null", so
     the second limb refuses at (4) anyway - with the wrong sentence, "S9 is not in IDS
     in this branch's own b-package.cjs", about a file the branch deleted. The verdict was
     never wrong; the one line this cell exists to print was. That is N2's whole complaint
     one level down, so the answer is this assertion and not a weaker claim. */
  assert.ok(r.refusals[0].includes("DELETING it"),
    "the refusal reads as an IDS miss rather than as the deletion it is: " + names(r));
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
  assertNotCancelled(YML_LINES(), SELF);
});

test("D-CONDITION-MATCHER: fence readers require the whole permitted expression", () => {
  assert.equal(conditionIsNotCancelled("  if: ${{ !cancelled() }}"), true);
  assert.equal(conditionIsNotCancelled("  if: ${{ !cancelled() && false }}"), false);
  assert.equal(conditionIsNotCancelled("  if: ${{ false || !cancelled() }}"), false);
  assert.equal(conditionIsNotCancelled("  if: ${{ !cancelled() || true }}"), false);
});

test("D-S9G-DECOY: all three fence-owned readers refuse D, E and F workflow decoys", () => {
  const files = [
    path.relative(REPO, fileURLToPath(import.meta.url)).split(path.sep).join("/"),
    "rebuild/lanes/c/passphrase-normalize/helper.test.mjs",
    "rebuild/m3/w6/test/local-import.test.mjs",
  ];
  for (const file of files) {
    const worlds = decoyWorkflows(file);
    assert.doesNotThrow(() => assertNotCancelled(worlds.control, file), file + " control");
    assert.doesNotThrow(() => assertNotCancelled(worlds.afterRun, file), file + " after run");
    for (const id of ["D", "E", "F"])
      assert.throws(() => assertNotCancelled(worlds[id], file), undefined, file + " " + id);
    for (const id of ["duplicateCondition", "duplicateRunner", "siblingPath"])
      assert.throws(() => assertNotCancelled(worlds[id], file), undefined, file + " " + id);
  }
});

test("D-S9G-CONTINUE: all three fence-owned readers refuse a direct continue-on-error key", () => {
  const files = [
    path.relative(REPO, fileURLToPath(import.meta.url)).split(path.sep).join("/"),
    "rebuild/lanes/c/passphrase-normalize/helper.test.mjs",
    "rebuild/m3/w6/test/local-import.test.mjs",
  ];
  const outcomes = [];
  for (const file of files) {
    const worlds = decoyWorkflows(file);
    for (const id of ["control", "grouped", "siblingContinue", "nestedContinue"])
      assert.doesNotThrow(() => assertNotCancelled(worlds[id], file), undefined, file + " " + id);
    for (const id of ["continueTrue", "continueFalse"]) {
      try { assertNotCancelled(worlds[id], file); outcomes.push(file + " " + id + ": accepted"); }
      catch (e) {
        outcomes.push(file + " " + id + (e instanceof assert.AssertionError
          && String(e.message).includes("STEP-CONTINUE-ON-ERROR-FORBIDDEN")
          ? ": refused by name" : ": wrong refusal"));
      }
    }
  }
  assert.deepEqual(outcomes, files.flatMap((file) => [
    file + " continueTrue: refused by name", file + " continueFalse: refused by name",
  ]));
});

test("D-S9G-QUOTED-KEY: all three fence readers refuse paired quoted continue-on-error keys", () => {
  const files = [
    path.relative(REPO, fileURLToPath(import.meta.url)).split(path.sep).join("/"),
    "rebuild/lanes/c/passphrase-normalize/helper.test.mjs",
    "rebuild/m3/w6/test/local-import.test.mjs",
  ];
  const ids = ["continueTrue", "continueFalse", "quotedDoubleTrue", "quotedDoubleFalse",
    "quotedSingleTrue", "quotedSingleFalse"];
  const outcomes = [];
  for (const file of files) {
    const worlds = decoyWorkflows(file);
    for (const id of ["control", "grouped", "siblingContinue", "nestedContinue",
      "quotedSiblingContinue", "quotedNestedContinue"])
      assert.doesNotThrow(() => assertNotCancelled(worlds[id], file), undefined, file + " " + id);
    assert.throws(() => assertNotCancelled(worlds.quotedIf, file), (error) =>
      error instanceof assert.AssertionError
        && !String(error.message).includes("STEP-CONTINUE-ON-ERROR-FORBIDDEN"));
    assert.doesNotThrow(() => assertNotCancelled(YML_LINES(), file), undefined, file + " real workflow");
    for (const id of ids) {
      try { assertNotCancelled(worlds[id], file); outcomes.push(file + " " + id + ": accepted"); }
      catch (error) {
        outcomes.push(file + " " + id + (error instanceof assert.AssertionError
          && String(error.message).includes("STEP-CONTINUE-ON-ERROR-FORBIDDEN")
          ? ": refused by name" : ": wrong refusal"));
      }
    }
  }
  assert.deepEqual(outcomes, files.flatMap((file) =>
    ids.map((id) => file + " " + id + ": refused by name")));
});

test("D-S9G-COMMENT-CUT: all three fence readers cross comments but retain step boundaries", () => {
  const files = [
    path.relative(REPO, fileURLToPath(import.meta.url)).split(path.sep).join("/"),
    "rebuild/lanes/c/passphrase-normalize/helper.test.mjs",
    "rebuild/m3/w6/test/local-import.test.mjs",
  ];
  const outcomes = [];
  for (const file of files) {
    const worlds = decoyWorkflows(file);
    for (const id of ["control", "commentBoundaryIndented", "commentBoundaryColumn0"])
      assert.doesNotThrow(() => assertNotCancelled(worlds[id], file), undefined, file + " " + id);
    assert.doesNotThrow(() => assertNotCancelled(YML_LINES(), file), undefined, file + " real workflow");
    for (const id of ["commentCutIndented", "commentCutColumn0"]) {
      try { assertNotCancelled(worlds[id], file); outcomes.push(file + " " + id + ": accepted"); }
      catch (error) {
        outcomes.push(file + " " + id + (error instanceof assert.AssertionError
          && String(error.message).includes("STEP-CONTINUE-ON-ERROR-FORBIDDEN")
          ? ": refused by name" : ": wrong refusal"));
      }
    }
  }
  assert.deepEqual(outcomes, files.flatMap((file) => [
    file + " commentCutIndented: refused by name",
    file + " commentCutColumn0: refused by name",
  ]));
});

/* ================== R3's TWO BLOCKING FINDINGS, AND THE ROWS THAT CLOSE THEM =========
   R3 swept 50 clauses of fence(), killed 44, and the two findings below are what the six
   survivors came to. Each row here exists because a clause was load-bearing and silent. */

/* R3 BLOCKING-1. `if (option === null) return bad(2, ...)` was A CLAUSE WITH NO ROW, and
   the direction its mutant took is the only direction D.2 exists to refuse: R3 replaced
   it with a stand-aside and NOT ONE ROW of this file changed colour - 33 fixture rows
   green before, 33 green after, on Linux and again on Windows. A branch could then reach
   a SKIP with a spec whose parent resolves to nothing at all.

   It is neither dead code nor defensive programming. FOUR worlds reach the line, every
   one of them authorable in one text editor, and the fence refuses all four today. Row
   (8a) is the only other row that feeds a bad spec and both of its bodies die EARLIER -
   `{}` fails the SPEC_KEYS key closure and "not a spec at all" fails JSON.parse, both at
   condition (1) - and specFile() always builds a well-formed parent, so nothing in this
   file had ever reached the clause.

   The row pins the condition NUMBER and the CHOSEN ID the refusal names, so the sentence
   a human reads is held too and not only the verdict. */
test("R3 BLOCKING-1 (20) - a spec whose parent.chosen resolves to NO option is refused at (2), naming the id", () => {
  const worlds = [
    ["parent is null", (s) => { s.parent = null; }, "null"],
    ["parent.chosen names no option", (s) => { s.parent.chosen = "NOBODY"; }, "\"NOBODY\""],
    ["parent.options is empty", (s) => { s.parent.options = []; }, "\"S8\""],
    ["parent.options is not an array", (s) => { s.parent.options = { id: "S8" }; }, "\"S8\""],
  ];
  for (const [what, mutate, named] of worlds) {
    const root = chain({ product: [APP] });
    const spec = JSON.parse(specFile({ packageId: "S9", parentId: "S8", artifact: FIX_ART,
      sha256: shaOfBlob(root, CHAIN_REF, FIX_ART),
      sourceBase: gitText(root, ["rev-parse", CHAIN_REF]).trim() }));
    mutate(spec);
    /* the key closure is intact, so condition (1) passes and the clause is REACHED. */
    assert.deepEqual(Object.keys(spec).sort(), [...SPEC_KEYS].sort(),
      what + ": the world does not survive condition (1) and measures nothing");
    child(root, { specBody: JSON.stringify(spec, null, 1) + "\n",
      alsoTouch: { [APP]: "a lane C edit\n" } });
    const r = fence(root, CHAIN_REF);
    /* named before the helper, so the mutant this row exists for says WHICH world. */
    assert.equal(r.status, "fail", what + ": it SKIPPED: " + JSON.stringify(r.reason));
    unverified(r, 2);
    assert.ok(r.refusals[0].includes("names no parent option " + named),
      what + ": the refusal does not name the chosen id: " + names(r));
  }
});

/* R3 BLOCKING-2, AND IT CORRECTS F9 RATHER THAN UNDOING IT. F9's first answer asked
   whether the MERGE BASE held the chain's CURRENT artifact bytes. The cell's own comment
   at the check says the question is whether THIS BRANCH MOVED IT, and those two differ
   for every branch cut before the chain last moved that artifact - which, after any
   reseal, is most of them. Inside that window the tamper check was simply OFF.

   R3 built the window and measured it, three worlds, and the three rows below are those
   three worlds. Against the merge-base form A and B SKIPPED and C PASSED WITH NO REFUSAL
   AT ALL; against the diff form all three are refused by name. A and B are exactly what
   R2 N4 ruled out - a verified child has no business changing its PARENT's sealed
   artifact - and C is a PASS where R2's shipped fence gave a FAIL.

   Rows (6), (6b), (6c), (8g), (17) and (19) are UNEDITED and stay green under both forms:
   a mutation table proves a clause is needed, not that it is narrow enough, which is why
   M20 and M21 both died and the window shipped anyway. */

/* WORLD A: the chain seals a NEW artifact after this branch was cut, and the branch is a
   well-formed reseal child of that new artifact which ALSO widens it in its own
   worktree. Every one of the five conditions holds, so the claim is entered - and the
   tamper must take it away again. */
test("R3 BLOCKING-2 (21) - a verified child widening the chain's NEWLY sealed artifact is a tamper", () => {
  const root = chain({ product: [APP, CSS] });
  const A = headOf(root);
  const NEWART = SPEC_DIR + "acceptance-s9-fixture.json";
  /* the chain advances on a line of its own, so the merge base stays at A and the branch
     never carried acceptance-s9-fixture.json at all. */
  git(root, ["checkout", "-q", "-b", "chainline"]);
  put(root, NEWART, inventory({ packageId: "M2-S9-FIXTURE", lanePackage: "S9", product: [APP, CSS] }));
  commit(root, "the chain seals a new artifact");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);
  const sha = shaOfBlob(root, CHAIN_REF, NEWART);
  git(root, ["checkout", "-q", "main"]);

  put(root, PACKAGES + "S10.json", specFile({ packageId: "S10", parentId: "S9",
    artifact: NEWART, sha256: sha, sourceBase: A }));
  put(root, RUNNER, runnerStub(["S7", "S8", "S10"]));
  put(root, APP, "the child's own edit\n");
  put(root, NEWART, inventory({ packageId: "M2-S9-FIXTURE", lanePackage: "S9", product: [CSS], released: [APP] }));
  commit(root, "the reseal child, widening its parent's newest artifact");

  const r = fence(root, CHAIN_REF);
  assert.equal(r.artifactPath, NEWART, "the chain did not advance");
  assert.equal(r.status, "fail",
    "a verified child widened the chain's newest artifact and stood aside: " + JSON.stringify(r.reason));
  assert.equal(r.reason, null, "it printed a stand-aside reason anyway: " + String(r.reason));
  assert.ok(r.refusals.includes("FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + NEWART), names(r));
  /* and, being fenced as an ordinary branch, its own sealed touch is named too. */
  assert.ok(r.refusals.includes("FENCE-SEALED-PATH-TOUCHED M " + APP), names(r));
});

/* WORLD B: the same path, whose BYTES the chain moved after the branch was cut - which is
   what every reseal of an existing artifact path does. */
test("R3 BLOCKING-2 (22) - a verified child widening a RE-sealed artifact path is a tamper", () => {
  const root = chain({ product: [APP, CSS] });
  const A = headOf(root);
  git(root, ["checkout", "-q", "-b", "chainline"]);
  put(root, FIX_ART, inventory({ packageId: "M2-S8-FIXTURE-V2", product: [APP, CSS] }));
  commit(root, "the chain re-seals the same artifact path");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);
  const sha = shaOfBlob(root, CHAIN_REF, FIX_ART);
  git(root, ["checkout", "-q", "main"]);

  put(root, PACKAGES + "S9.json", specFile({ packageId: "S9", parentId: "S8",
    artifact: FIX_ART, sha256: sha, sourceBase: A }));
  put(root, RUNNER, runnerStub(["S7", "S8", "S9"]));
  put(root, APP, "the child's own edit\n");
  put(root, FIX_ART, inventory({ product: [CSS], released: [APP] }));
  commit(root, "the reseal child, widening the re-sealed artifact");

  const r = fence(root, CHAIN_REF);
  /* the fixture really does build the window: the merge base carried the artifact, but
     NOT the bytes the chain now holds. */
  const base = gitText(root, ["merge-base", CHAIN_REF, "HEAD"]).trim();
  assert.notEqual(shaOfBlob(root, base, FIX_ART), sha,
    "the fixture does not build the window at all: the merge base already held the chain's bytes");
  assert.equal(r.status, "fail",
    "a verified child widened a re-sealed artifact and stood aside: " + JSON.stringify(r.reason));
  assert.ok(r.refusals.includes("FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + FIX_ART), names(r));
  assert.ok(r.refusals.includes("FENCE-SEALED-PATH-TOUCHED M " + APP), names(r));
});

/* WORLD C, AND IT IS THE PLAINEST OF THE THREE: no spec, no claim, no sealed touch. An
   ORDINARY branch cut before the chain's newest artifact FORGES that artifact in its own
   worktree with released = every path. Against the merge-base form it PASSED with no
   refusal at all - and a forged inventory in a worktree is the one thing this cell was
   written to name, whatever it does or does not buy the branch. */
test("R3 BLOCKING-2 (23) - an ORDINARY branch FORGING the chain's newest artifact FAILS by name", () => {
  const root = chain({ product: [APP, CSS], free: [TEMPLATE] });
  const A = headOf(root);
  const NEWART = SPEC_DIR + "acceptance-s9-fixture.json";
  git(root, ["checkout", "-q", "-b", "chainline"]);
  put(root, NEWART, inventory({ packageId: "M2-S9-FIXTURE", lanePackage: "S9", product: [APP, CSS] }));
  commit(root, "the chain seals a new artifact");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);
  git(root, ["checkout", "-q", "main"]);

  put(root, TEMPLATE, "harmless\n");
  put(root, NEWART, inventory({ packageId: "M2-S9-FIXTURE", lanePackage: "S9", product: [], released: [APP, CSS] }));
  commit(root, "an ordinary branch forging the chain's newest artifact in its worktree");

  const r = fence(root, CHAIN_REF);
  assert.equal(r.artifactPath, NEWART, "the chain did not advance");
  assert.equal(r.status, "fail",
    "a branch forged the chain's newest artifact in its worktree and PASSED: " + names(r));
  assert.deepEqual(r.refusals, ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + NEWART], names(r));
  /* and the forgery is invisible to the sealed-path loop, which is why the tamper check
     is the only thing that can name it: the artifact is not a key of its own product map
     and TEMPLATE was never sealed. */
  assert.equal(r.touched, 2, "the fence read more than the branch's own change: " + String(r.touched));

  /* AND THE HALF THAT MUST STILL PASS, so the diff limb is not widened into an accusation:
     the same branch, cut at the same place, that does NOT touch the artifact - and that
     DOES touch another file in the artifact's own directory, so the row measures that the
     limb names the ARTIFACT PATH and not rebuild/m4/spec/. Widen it to the directory and
     F9 re-opens for every branch that adds a review file beside the artifact. */
  const quiet = chain({ product: [APP, CSS], free: [TEMPLATE] });
  const B = headOf(quiet);
  git(quiet, ["checkout", "-q", "-b", "chainline"]);
  put(quiet, NEWART, inventory({ packageId: "M2-S9-FIXTURE", lanePackage: "S9", product: [APP, CSS] }));
  commit(quiet, "the chain seals a new artifact");
  git(quiet, ["update-ref", CHAIN_REF, "HEAD"]);
  git(quiet, ["checkout", "-q", "main"]);
  put(quiet, TEMPLATE, "harmless\n");
  put(quiet, SPEC_DIR + "review-fixture.json", "{\n \"note\": \"a review beside the artifact\"\n}\n");
  commit(quiet, "an ordinary branch that touches nothing sealed");
  assert.equal(B, gitText(quiet, ["merge-base", CHAIN_REF, "HEAD"]).trim(), "the fixture moved the merge base");
  const rq = fence(quiet, CHAIN_REF);
  assert.equal(rq.artifactPath, NEWART, "the chain did not advance in the control");
  assert.equal(rq.touched, 2, "the control does not touch " + SPEC_DIR + " at all: " + String(rq.touched));
  assert.equal(rq.status, "pass",
    "F9 re-opened: a branch that never touched the artifact was accused of tampering with it: "
    + names(rq));
});

/* ================== ASTRA R4 FINDINGS, WITH THEIR REACHABLE WITNESSES ============== */

/* ASTRA R4 FINDING 1. (24) kills the shipped worktree-only clause: a two-hop git mv
   changes only case without ever asking two spellings to coexist on disk. HEAD loses
   the exact inventory path even when Windows still resolves its bytes through the old
   spelling. core.ignorecase=true must not make the Git query accept that alias. */
test("Astra R4 (24) - an ordinary case-only inventory rename FAILS naming the exact path", () => {
  const root = chain({ product: [APP, CSS] });
  git(root, ["config", "core.ignorecase", "true"]);
  const upper = SPEC_DIR + "ACCEPTANCE-S8-FIXTURE.JSON";
  const query = ["ls-tree", "--name-only", "-z", "HEAD", "--", FIX_ART];
  assert.deepEqual(gitText(root, query).split("\0").filter(Boolean), [FIX_ART]);
  git(root, ["mv", FIX_ART, SPEC_DIR + "temporary-case-hop.json"]);
  git(root, ["mv", SPEC_DIR + "temporary-case-hop.json", upper]);
  commit(root, "case-only rename away");
  assert.deepEqual(gitLines(root, ["diff", "--name-status", CHAIN_REF, "HEAD"]),
    ["R100\t" + FIX_ART + "\t" + upper], "the fixture did not make the case-only rename");
  assert.equal(gitText(root, query), "", "Git folded the missing exact path under core.ignorecase=true");
  assert.deepEqual(gitText(root, ["ls-tree", "--name-only", "-z", "HEAD", "--", upper])
    .split("\0").filter(Boolean), [upper]);
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail", "case-only inventory rename was admitted: " + names(r));
  assert.deepEqual(r.refusals, ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + FIX_ART], names(r));
});

/* ASTRA R4 FINDING 1. (25) kills the same clause on the otherwise VERIFIED child.
   The normal child first earns its skip; the two-hop rename then removes that right.
   This is reachable with ordinary commits, and both the inventory and sealed edit
   must be named when the child is fenced as an ordinary branch. */
test("Astra R4 (25) - a verified child with a case-only inventory rename FAILS naming both touches", () => {
  const root = chain({ product: [APP, CSS] });
  child(root, { alsoTouch: { [APP]: "sealed edit\n" } });
  const control = fence(root, CHAIN_REF);
  assert.equal(control.status, "skip", "the control child never earned its skip: " + names(control));
  assert.deepEqual(control.refusals, []);
  git(root, ["mv", FIX_ART, SPEC_DIR + "temporary-case-hop.json"]);
  git(root, ["mv", SPEC_DIR + "temporary-case-hop.json", SPEC_DIR + "ACCEPTANCE-S8-FIXTURE.JSON"]);
  commit(root, "case-only rename away in a verified child");
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail", "case-only rename still stood aside: " + JSON.stringify(r.reason));
  assert.equal(r.reason, null, "the tampered child printed a stand-aside reason");
  assert.deepEqual(r.refusals, ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + FIX_ART,
    "FENCE-SEALED-PATH-TOUCHED M " + APP], names(r));
});

/* ASTRA R4 FINDING 2, X7. (26) kills ignoring a rename's DESTINATION. The branch
   already carries a staged file when the chain seals a new inventory on another line.
   Renaming that staged file into the inventory's place is R100 in the branch's own
   diff, but its bytes differ from the chain. No overwrite or shared-disk alias is needed. */
test("Astra R4 (26) - renaming different bytes INTO the inventory FAILS by name", () => {
  const root = chain({ product: [APP, CSS] });
  const next = SPEC_DIR + "acceptance-s9-fixture.json";
  const staged = "staged-inventory.json";
  put(root, staged, inventory({ packageId: "M2-S9-FIXTURE", lanePackage: "S9",
    product: [], released: [APP, CSS] }));
  commit(root, "stage different inventory bytes before the fork");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);
  git(root, ["checkout", "-q", "-b", "chainline"]);
  put(root, next, inventory({ packageId: "M2-S9-FIXTURE", lanePackage: "S9", product: [APP, CSS] }));
  commit(root, "the chain seals the new inventory");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);
  git(root, ["checkout", "-q", "main"]);
  git(root, ["mv", staged, next]);
  commit(root, "rename staged bytes into the inventory path");
  const base = gitText(root, ["merge-base", CHAIN_REF, "HEAD"]).trim();
  assert.deepEqual(gitLines(root, ["diff", "--name-status", base, "HEAD"]),
    ["R100\t" + staged + "\t" + next], "the fixture did not touch the rename destination");
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail", "the rename destination escaped: " + names(r));
  assert.deepEqual(r.refusals, ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + next], names(r));
});

/* ASTRA R4 FINDING 2, X8. (27) kills case-folding the artifact-path equality, the
   exact-path control beside (23). Before the fork both lines carry only the upper-case
   sibling. The chain renames it through a temporary path; the branch edits only its
   original spelling. The two spellings never coexist, and the branch never touches
   the chain's exact inventory path, so accusing it would re-open F9. */
test("Astra R4 (27) - editing only an upper-case sibling of the inventory PASSES", () => {
  const root = chain({ product: [APP, CSS] });
  const next = SPEC_DIR + "acceptance-s9-fixture.json";
  const upper = SPEC_DIR + "ACCEPTANCE-S9-FIXTURE.JSON";
  put(root, upper, inventory({ packageId: "M2-S9-FIXTURE", lanePackage: "S9", product: [APP, CSS] }));
  commit(root, "the upper-case sibling before the fork");
  git(root, ["checkout", "-q", "-b", "chainline"]);
  git(root, ["mv", upper, SPEC_DIR + "temporary-case-hop.json"]);
  git(root, ["mv", SPEC_DIR + "temporary-case-hop.json", next]);
  commit(root, "the chain seals the exact lower-case inventory path");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);
  git(root, ["checkout", "-q", "main"]);
  put(root, upper, inventory({ packageId: "M2-S9-FIXTURE", lanePackage: "S9",
    product: [], released: [APP, CSS] }));
  commit(root, "edit only the upper-case sibling on the branch");
  const base = gitText(root, ["merge-base", CHAIN_REF, "HEAD"]).trim();
  assert.deepEqual(gitLines(root, ["diff", "--name-status", base, "HEAD"]), ["M\t" + upper],
    "the branch's own diff touched more than its upper-case sibling");
  const r = fence(root, CHAIN_REF);
  assert.equal(r.artifactPath, next, "the chain did not select its new exact path");
  assert.equal(r.status, "pass", "case-folding accused an untouched inventory: " + names(r));
  assert.deepEqual(r.refusals, []);
  assert.equal(r.touched, 1);
});

/* ASTRA R4 FINDING 2, X9. (28) kills parsed-JSON equality in place of byte equality.
   Appending one LF and committing it is an ordinary edit with the same JSON value,
   yet different sealed bytes. The inventory diagnostic must still name that edit. */
test("Astra R4 (28) - a whitespace-only inventory edit FAILS by name", () => {
  const root = chain({ product: [APP, CSS] });
  const original = git(root, ["show", "HEAD:" + FIX_ART]);
  const edited = Buffer.concat([original, Buffer.from("\n")]);
  assert.deepEqual(JSON.parse(edited), JSON.parse(original));
  assert.equal(edited.equals(original), false);
  branch(root, { edits: { [FIX_ART]: edited } });
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail", "semantic JSON equality excused different bytes: " + names(r));
  assert.deepEqual(r.refusals, ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + FIX_ART], names(r));
});

/* ====== R6-Z2 AND R6-Z3, ONE ROW WITH TWO ASSERTS, ADDED AT INTEGRATION ==============
   DECISIONS:591, carried from B-R6 section 6. Review R6 built two substitutions of the
   sealed inventory that the 44 rows above did not cover: a SAME-LENGTH edit, and a
   ZERO-BYTE file. Both are non-equivalent mutants of the tamper comparison and both left
   all 44 existing rows green on BOTH systems, which is exactly what "the existing rows do
   not cover them" means. The brief (section 9 item 4) orders ONE row with TWO asserts.

   WHY EACH ONE IS ITS OWN ATTACK. The same-length edit is the one a length or size check
   would miss, and `worktree.equals(chainBytes)` is a BYTE comparison precisely so that it
   does not: the fixture below changes "M2-S8-FIXTURE" to "M2-S8-FIXTURF", one byte, the
   file's length unchanged, the JSON still valid and still an object, so nothing above the
   tamper check refuses it. The zero-byte file is the other end of the same range: it is
   the shape a truncating write or an interrupted checkout leaves behind, it is not JSON
   at all, and the point of the row is that the branch is still named as having MOVED the
   inventory rather than being read as having supplied an empty one.

   THE REFUSAL IS NAMED IN FULL in both halves, never matched by prefix. */
test("R6-Z2/Z3 (29) - a SAME-LENGTH inventory edit and a ZERO-BYTE inventory each FAIL by name", () => {
  /* Z2, the same-length edit. */
  const z2 = chain({ product: [APP, CSS] });
  const originalZ2 = git(z2, ["show", "HEAD:" + FIX_ART]);
  const editedZ2 = Buffer.from(originalZ2.toString("utf8").replace("M2-S8-FIXTURE", "M2-S8-FIXTURF"), "utf8");
  assert.equal(editedZ2.length, originalZ2.length, "the Z2 fixture is not a same-length edit");
  assert.equal(editedZ2.equals(originalZ2), false, "the Z2 fixture changed no byte");
  assert.equal(typeof JSON.parse(editedZ2.toString("utf8")), "object", "the Z2 fixture stopped being a JSON object");
  branch(z2, { edits: { [FIX_ART]: editedZ2 } });
  const rZ2 = fence(z2, CHAIN_REF);
  assert.equal(rZ2.status, "fail", "a same-length inventory edit was excused: " + names(rZ2));
  assert.deepEqual(rZ2.refusals, ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + FIX_ART], names(rZ2));

  /* Z3, the zero-byte file. */
  const z3 = chain({ product: [APP, CSS] });
  const originalZ3 = git(z3, ["show", "HEAD:" + FIX_ART]);
  assert.notEqual(originalZ3.length, 0, "the Z3 fixture started empty, so it proves nothing");
  branch(z3, { edits: { [FIX_ART]: Buffer.alloc(0) } });
  const rZ3 = fence(z3, CHAIN_REF);
  assert.equal(rZ3.status, "fail", "a zero-byte inventory was excused: " + names(rZ3));
  assert.deepEqual(rZ3.refusals, ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + FIX_ART], names(rZ3));
});

/* ====== THE WORKFLOW ROWS THIS CELL IS THE HOME FOR, AND WHY THEY ARE HERE ============
   P-S9-3 (DECISIONS:627) gives the passphrase step and the local-import step the same
   `if:` line the fence and the pack carry, EACH WITH A CONDITION-READING ROW. P-S9-5 of
   the same ruling RETIRES the whole-workflow equality of
   rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs:29 and RE-HOMES its two
   invariants - both operating systems retained, and no step forgiven by an `|| true` -
   as rows of a CI-executed cell.

   WHY THIS CELL AND NOT ANOTHER, CHOSEN BY MEASUREMENT AND NOT BY TASTE. The home had to
   satisfy three things at once: a CI step really runs it on BOTH systems, it is not
   `pinned-unchanged`, and it reads the workflow from the WORKING TREE. Measured at this
   head: on any branch that is not on the chain tip the standing step at rebuild.yml:150
   is refused SEAL-BASE-IS-NOT-THE-CHAIN-TIP and GitHub SKIPS every later step that
   carries no condition, so the only steps that REALLY run are the ones carrying
   `if: ${{ !cancelled() }}` - the fence's, the pack's, and (from this round) the
   passphrase and local-import steps. Of those four cells, local-import.test.mjs is role
   `pinned-unchanged` by E fact 22 and is therefore excluded by the second rule and by the
   brief, which says its row lives elsewhere; the pack cell owns its own condition row by
   the brief's section 9 item 3 and its subject is the design pack; the three passphrase
   cells' subject is key material. THIS cell is the only one of the four that ALREADY
   reads .github/workflows/rebuild.yml as text out of the working tree (row (18)), is
   role `new`, and is already being edited in this round, so the four rows below cost one
   file's bytes rather than two. Its own step's condition is row (18) and is unchanged.

   EVERY ROW BELOW READS THE WORKING TREE, FINDS ITS STEP BY EXACT PATH AND NEVER GLOBS,
   which is row (18)'s method and not a new one. */
const YML_LINES = () => fs.readFileSync(path.join(REPO, ".github", "workflows", "rebuild.yml"), "utf8").split(/\r?\n/);
function conditionOfStepRunning(yml, file) {
  const owners = [];
  for (let nameAt = 0; nameAt < yml.length; nameAt += 1) {
    const named = /^(\s*)-\s+name:/.exec(yml[nameAt]);
    if (!named) continue;
    const stepIndent = named[1].length;
    let end = nameAt + 1;
    while (end < yml.length && (!yml[end].trim() || /^\s*#/.test(yml[end])
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
    const match = /^(\s*)(?:continue-on-error|"continue-on-error"|'continue-on-error')\s*:/.exec(entry);
    return match && match[1].length === runIndent;
  });
  assert.equal(continueKeys.length, 0,
    "STEP-CONTINUE-ON-ERROR-FORBIDDEN " + file + ": "
    + continueKeys.map((entry) => entry.trim()).join(" / "));
  const conditions = block.filter((entry) => {
    const match = /^(\s*)if:/.exec(entry);
    return match && match[1].length === runIndent;
  });
  assert.equal(conditions.length, 1,
    file + "'s step must carry exactly one step-level `if:`: "
    + block.map((entry) => entry.trim()).join(" / "));
  return { block, cond: conditions[0] };
}
function assertNotCancelled(yml, file) {
  const { block, cond } = conditionOfStepRunning(yml, file);
  assert.notEqual(cond, undefined,
    file + "'s step carries no `if:` at all, so GitHub skips it after the standing step at "
    + ":150 fails, which is every branch this package is built on (P-S9-3, DECISIONS:627): "
    + block.map((l) => l.trim()).join(" / "));
  assert.equal(conditionIsNotCancelled(cond), true,
    "the condition is not `not cancelled`, so the step either never runs after a failure "
    + "or runs after a cancellation: " + cond.trim());
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
    commentCutIndented: ["      - name: target", "        if: ${{ !cancelled() }}", run,
      "      # same step", "        continue-on-error: true"],
    commentCutColumn0: ["      - name: target", "        if: ${{ !cancelled() }}", run,
      "# same step", "        continue-on-error: true"],
    commentBoundaryIndented: ["      - name: target", "        if: ${{ !cancelled() }}", run,
      "      # divider", "      - name: sibling", "        continue-on-error: true",
      "        run: echo sibling"],
    commentBoundaryColumn0: ["      - name: target", "        if: ${{ !cancelled() }}", run,
      "# divider", "      - name: sibling", "        continue-on-error: true",
      "        run: echo sibling"],
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

/* P-S9-3, first half. The passphrase lane's step is the guard that keeps every sealed
   bundle valid (E fact 21, that lane's review R2), so it is worth less than nothing if it
   is skipped on the branches that carry the bundle it guards. */
test("P-S9-3 (30) - the passphrase lane's step carries the not-cancelled condition", () => {
  assertNotCancelled(YML_LINES(), "rebuild/lanes/c/passphrase-normalize/helper.test.mjs");
});

/* P-S9-3, second half, AND THIS IS THE ROW THE BRIEF MEANS BY "its row lives elsewhere".
   rebuild/m3/w6/test/local-import.test.mjs takes role `pinned-unchanged` with equal
   measured pre and post (E fact 22), which is honest exactly because S9 does not write
   it - so the row that reads its step cannot live inside it. Measured before this round:
   rebuild.yml named that file ZERO times, and the cell that pins the phone's five seal
   constants against the PC's ran in no workflow at all. */
test("P-S9-3 (31) - the local-import step exists and carries the not-cancelled condition", () => {
  assertNotCancelled(YML_LINES(), "rebuild/m3/w6/test/local-import.test.mjs");
});

/* P-S9-5, THE TWO RE-HOMED INVARIANTS. ci-second-gate.test.cjs:29 asserted three things
   at once: that .github/workflows/rebuild.yml equals a 2026 baseline object with exactly
   one command substituted, that both OS jobs are retained, and that no step was forgiven
   by an `|| true`. The FIRST goes red on any workflow hunk at all and S9 adds several, it
   has no CI home of its own (rebuild.yml names ci-second-gate ZERO times, measured), and
   the file is in NEITHER S8 map (measured against
   rebuild/m4/spec/acceptance-s8-real-shape.json: not in product, not in executionPins),
   so retiring it is not a sealed act. DECISIONS:627 P-S9-5 retires THAT equality only and
   re-homes these two. NOTHING IS QUIETLY DROPPED: the two assertions below are the same
   two claims, in a cell a CI step really runs on both systems.

   The no-forgiveness rule is stated over the file as a whole. The OS rule is bound to
   each required job, so adding a second legitimate matrix cannot weaken either job and
   a sibling or misplaced matrix cannot stand in for the one the job actually runs on. */
function assertTwoOsJob(yml, job) {
  const escaped = job.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const key = (name) => `(?:${name}|"${name}"|'${name}')`;
  const exactKey = (indent, name) => new RegExp("^" + " ".repeat(indent) + key(name) + ":\\s*(?:#.*)?$");
  const anyKey = (indent, name) => new RegExp("^" + " ".repeat(indent) + key(name) + ":(?:\\s.*)?$");
  const valueKey = (indent, name, value) => new RegExp("^" + " ".repeat(indent) + key(name) + ":\\s*" + value + "\\s*$");
  const starts = yml.map((line, i) => [line, i])
    .filter(([line]) => anyKey(2, escaped).test(line));
  assert.equal(starts.length, 1, job + " has " + starts.length + " job definitions, expected exactly one");
  assert.match(starts[0][0], exactKey(2, escaped), job + " must be a block job definition");
  const from = starts[0][1];
  let to = yml.length;
  for (let i = from + 1; i < yml.length; i += 1) {
    if (/^  (?:[A-Za-z0-9_-]+|"[^"\r\n]+"|'[^'\r\n]+'):(?:\s.*)?$/.test(yml[i])) { to = i; break; }
    if (/^\S/.test(yml[i]) && !/^\s*#/.test(yml[i])) { to = i; break; }
  }
  const block = yml.slice(from, to);
  const strategy = block.map((line, i) => [line, i]).filter(([line]) => anyKey(4, "strategy").test(line));
  assert.equal(strategy.length, 1, job + " has " + strategy.length + " strategy blocks, expected exactly one");
  assert.match(strategy[0][0], exactKey(4, "strategy"), job + " strategy must be a block");
  const strategyFrom = strategy[0][1];
  let strategyTo = block.length;
  for (let i = strategyFrom + 1; i < block.length; i += 1) {
    if (/^    \S/.test(block[i]) && !/^\s*#/.test(block[i])) { strategyTo = i; break; }
  }
  const strategyBlock = block.slice(strategyFrom, strategyTo);
  const matrices = strategyBlock.map((line, i) => [line, i]).filter(([line]) => anyKey(6, "matrix").test(line));
  assert.equal(matrices.length, 1, job + " has " + matrices.length + " matrix blocks, expected exactly one");
  assert.match(matrices[0][0], exactKey(6, "matrix"), job + " matrix must be a block");
  const matrixFrom = matrices[0][1];
  let matrixTo = strategyBlock.length;
  for (let i = matrixFrom + 1; i < strategyBlock.length; i += 1) {
    if (/^      \S/.test(strategyBlock[i]) && !/^\s*#/.test(strategyBlock[i])) { matrixTo = i; break; }
  }
  const matrixBlock = strategyBlock.slice(matrixFrom, matrixTo);
  const osRe = valueKey(8, "os", "\\[([^\\]]*)\\]");
  const osKeys = matrixBlock.filter((line) => anyKey(8, "os").test(line));
  assert.equal(osKeys.length, 1, job + " has " + osKeys.length + " direct matrix.os keys, expected exactly one");
  const osLine = osRe.exec(osKeys[0]);
  assert.notEqual(osLine, null, job + " matrix.os must be an inline list");
  const os = osLine[1].split(",").map((value) => value.trim()).filter(Boolean);
  assert.deepEqual(os.slice().sort(), ["ubuntu-latest", "windows-latest"],
    job + " matrix.os must contain exactly ubuntu-latest and windows-latest once each: " + os.join(", "));
  const runnerRe = valueKey(4, "runs-on", "(.*?)");
  const runners = block.filter((line) => anyKey(4, "runs-on").test(line));
  assert.equal(runners.length, 1, job + " has " + runners.length + " direct runs-on keys, expected exactly one");
  const runner = runnerRe.exec(runners[0]);
  assert.notEqual(runner, null, job + " runs-on must carry a value");
  assert.match(runner[1], /^\$\{\{\s*matrix\.os\s*\}\}$/, job + " runs-on is not its own matrix.os");
}

const matrixJobFixture = (job, body) => ["  " + job + ":", ...body];
const goodMatrixBody = () => ["    strategy:", "      matrix:",
  "        os: [ubuntu-latest, windows-latest]", "    runs-on: ${{ matrix.os }}"];
const matrixWorkflowFixture = (primary) => ["jobs:",
  ...matrixJobFixture("public-gates", primary), ...matrixJobFixture("font-transport", goodMatrixBody())];

test("P-S9-5 (32) - every required job retains both OS runs and the workflow forgives no step", () => {
  const yml = YML_LINES();
  for (const job of ["public-gates", "font-transport"]) assertTwoOsJob(yml, job);
  const forgiven = yml.map((l, i) => [i + 1, l]).filter(([, l]) => l.includes("|| true"));
  assert.deepEqual(forgiven, [],
    "a step is forgiven by an or-true, so its failure cannot fail the job: "
    + forgiven.map(([n, l]) => n + ": " + l.trim()).join(" / "));

  /* Teeth: the intact font matrix and unrelated decoys must never satisfy the primary
     job's obligation. Every mutant below leaves font-transport valid. */
  assert.doesNotThrow(() => assertTwoOsJob(matrixWorkflowFixture(goodMatrixBody()), "public-gates"));
  const missing = ["    strategy:", "      matrix:", "    runs-on: ${{ matrix.os }}"];
  assert.throws(() => assertTwoOsJob(matrixWorkflowFixture(missing), "public-gates"), /direct matrix\.os keys/);
  const relocated = ["    strategy:", "      matrix:", "    env:",
    "      os: [ubuntu-latest, windows-latest]", "    runs-on: ${{ matrix.os }}"];
  assert.throws(() => assertTwoOsJob(matrixWorkflowFixture(relocated), "public-gates"), /direct matrix\.os keys/);
  const duplicate = [...goodMatrixBody().slice(0, 3), "      matrix:",
    "        os: [ubuntu-latest, windows-latest]", "    runs-on: ${{ matrix.os }}"];
  assert.throws(() => assertTwoOsJob(matrixWorkflowFixture(duplicate), "public-gates"), /matrix blocks/);
  for (const only of ["ubuntu-latest", "windows-latest"]) {
    const oneOs = ["    strategy:", "      matrix:", "        os: [" + only + "]",
      "    runs-on: ${{ matrix.os }}"];
    assert.throws(() => assertTwoOsJob(matrixWorkflowFixture(oneOs), "public-gates"), /must contain exactly/);
  }
  const siblingDecoy = [...matrixWorkflowFixture(missing),
    ...matrixJobFixture("decoy", goodMatrixBody())];
  assert.throws(() => assertTwoOsJob(siblingDecoy, "public-gates"), /direct matrix\.os keys/);
  const duplicateRunner = [...goodMatrixBody(), "    runs-on: windows-latest"];
  assert.throws(() => assertTwoOsJob(matrixWorkflowFixture(duplicateRunner), "public-gates"), /direct runs-on keys/);
  const wrongRunner = [...goodMatrixBody().slice(0, -1), "    runs-on: ubuntu-latest"];
  assert.throws(() => assertTwoOsJob(matrixWorkflowFixture(wrongRunner), "public-gates"), /not its own matrix\.os/);

  /* YAML accepts quoted keys too. Each spelling must be accepted when it is the sole
     key and counted when it shadows the checked spelling. */
  for (const quote of ['"', "'"]) {
    const q = (name) => quote + name + quote;
    const quotedBody = ["    " + q("strategy") + ":", "      " + q("matrix") + ":",
      "        " + q("os") + ": [ubuntu-latest, windows-latest]",
      "    " + q("runs-on") + ": ${{ matrix.os }}"];
    const quotedWorkflow = ["jobs:", ...matrixJobFixture(q("public-gates"), quotedBody),
      ...matrixJobFixture("font-transport", goodMatrixBody())];
    assert.doesNotThrow(() => assertTwoOsJob(quotedWorkflow, "public-gates"));

    const shadowJob = [...matrixWorkflowFixture(goodMatrixBody()),
      ...matrixJobFixture(q("public-gates"), goodMatrixBody())];
    assert.throws(() => assertTwoOsJob(shadowJob, "public-gates"), /job definitions/);
    const shadowStrategy = [...goodMatrixBody(), "    " + q("strategy") + ": {matrix: {os: [windows-latest]}}"];
    assert.throws(() => assertTwoOsJob(matrixWorkflowFixture(shadowStrategy), "public-gates"), /strategy blocks/);
    const shadowMatrix = [...goodMatrixBody().slice(0, 3),
      "      " + q("matrix") + ": {os: [windows-latest]}", "    runs-on: ${{ matrix.os }}"];
    assert.throws(() => assertTwoOsJob(matrixWorkflowFixture(shadowMatrix), "public-gates"), /matrix blocks/);
    const shadowOs = [...goodMatrixBody().slice(0, 3),
      "        " + q("os") + ": windows-latest", "    runs-on: ${{ matrix.os }}"];
    assert.throws(() => assertTwoOsJob(matrixWorkflowFixture(shadowOs), "public-gates"), /direct matrix\.os keys/);
    const shadowRunner = [...goodMatrixBody(), "    " + q("runs-on") + ": windows-latest"];
    assert.throws(() => assertTwoOsJob(matrixWorkflowFixture(shadowRunner), "public-gates"), /direct runs-on keys/);
    const quotedSibling = ["jobs:", ...matrixJobFixture("public-gates", missing),
      ...matrixJobFixture(q("decoy"), goodMatrixBody()), ...matrixJobFixture("font-transport", goodMatrixBody())];
    assert.throws(() => assertTwoOsJob(quotedSibling, "public-gates"), /direct matrix\.os keys/);
  }
});

/* ====== FABLE l1 D1 (REVIEW-S9-BLOM-2B-l1 section 9), S9 ROUND 6: CONDITION (1) IS H5 ====
   Condition (1) held the spec to a BY-VALUE copy of the runner's SPEC_KEYS taken when the
   list had twenty-one keys. H5 (b-package.cjs:1172-1183) made it twenty-two with `release`
   OPTIONAL, closed in spec() at :1852 by the freeze pattern keys({ ...s, release: null },
   SPEC_KEYS, ...): absent is fine, present (null or a block) is fine, and any key that is
   neither a SPEC_KEYS key nor absent is refused. packages/S9.json has carried a top-level
   release block since 6dc2596, so the copy refused the one real reseal child it exists to
   verify and THE REAL ROW went red. This row holds condition (1) to H5 in BOTH directions:
   every key set the runner's closure admits reaches the skip here, and every key set it
   refuses is refused here at (1) - including a spec where `release` stands in for a
   missing required key, so the key COUNT still matches, and the two optional keys of
   OTHER closures (authorizations.freeze, the artifact's released) at the top level. */
test("Fable l1 D1 (33) - condition (1) is H5's closure: release optional, any other key refused", () => {
  const BLOCK = () => ({ rulingLineSha256: ZERO });
  const worlds = [
    ["release absent, as in every spec sealed before H5", (s) => { delete s.release; }, "skip"],
    ["release present and null", (s) => { s.release = null; }, "skip"],
    ["release present as the block packages/S9.json carries", (s) => { s.release = BLOCK(); }, "skip"],
    ["one unknown extra key, release absent", (s) => { delete s.release; s.releases = null; }, "(1)"],
    ["top-level freeze beside a release block", (s) => { s.release = BLOCK(); s.freeze = null; }, "(1)"],
    ["top-level released (the artifact's optional key)", (s) => { delete s.release; s.released = {}; }, "(1)"],
    ["a case variant of release", (s) => { delete s.release; s.Release = BLOCK(); }, "(1)"],
    ["release standing in for a missing required key", (s) => { s.release = BLOCK(); delete s.notes; }, "(1)"],
  ];
  const outcomes = [];
  for (const [what, mutate] of worlds) {
    const root = chain({ product: [APP] });
    const spec = JSON.parse(specFile({ packageId: "S9", parentId: "S8", artifact: FIX_ART,
      sha256: shaOfBlob(root, CHAIN_REF, FIX_ART),
      sourceBase: gitText(root, ["rev-parse", CHAIN_REF]).trim() }));
    mutate(spec);
    child(root, { specBody: JSON.stringify(spec, null, 1) + "\n",
      alsoTouch: { [APP]: "the reseal child's own edit\n" } });
    const r = fence(root, CHAIN_REF);
    const skipped = r.status === "skip" && r.refusals.length === 0
      && String(r.reason).startsWith("FENCE-RESEAL-CHILD S9 " + PACKAGES + "S9.json ");
    const atOne = r.status === "fail" && r.refusals.length === 1
      && /^FENCE-RESEAL-CHILD-UNVERIFIED \(1\) /.test(r.refusals[0]);
    outcomes.push(what + ": " + (skipped ? "skip" : atOne ? "(1)" : r.status + " " + names(r)));
    if (atOne) outcomes.push(what + " refusal: " + r.refusals[0]);
  }
  assert.deepEqual(outcomes.filter((o) => !o.includes(" refusal: ")),
    worlds.map(([what, , want]) => what + ": " + want), outcomes.join("\n"));
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
