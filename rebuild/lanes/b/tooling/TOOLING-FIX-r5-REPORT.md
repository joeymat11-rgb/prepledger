# LANE B — TOOLING FIX r5 REPORT

**Review answered:** `rebuild/lanes/b/reviews/TOOLING-REVIEW-r5.md` — **REJECT / NOT SAFE TO
SEAL** for `7cd7a5b` and `85f7d56`; `c7b7133` ACCEPT; r4's Y1–Y4 confirmed landed.
**Branch:** `rebuild/lane-b-tooling`. **Base:** `165b0fb` (= `85f7d56` + the r5 review commit).
**Author:** `lane-b-fixer5 <fixer5@earned.local>`. **Not a review, and not an acceptance.**
Every number below is from a command run on the owner's Windows PC, node v24.18.0, with
`MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York`.

## 0. The ruling this pass is built on, and the one thing it changes about r5's Z1

`rebuild/DECISIONS.md` has moved since r5 was written. Two lines matter, and they do not say
the same thing:

* **line 112** (LANE B RULINGS 5) granted `MOVES_RULING`, id `DECISIONS:112`, with the words
  "lane B authors `b-ntc-inherited-carriers.cjs` and **`coverage.moves` records this id**".
  r5's **Z1** reads that line, and r5's own **PM question 1** asked the PM to confirm it.
* **line 113** (LANE B RULINGS 6) answers that question **the other way** and is the
  operative text: *"MOVES_RULING B-NTC-INHERITED-1 RATIFIED AS WRITTEN in
  B-NTC-REVIEW-r2.md §E.3 (this line is its id; it particularises DECISIONS:112 (1)) … the
  child may declare `coverage.inherited` naming a SUCCESSOR executable per parent child
  name, on the conditions (a) **`coverage.moves` stays `{}`** … (e) the tooling records this
  ruling id and refuses `coverage.inherited` in any package that does not cite it. A
  cumulative-profile supersession, not a coverage move; **X1 is not widened for any other
  package**."*

**This pass follows line 113.** `MOVES_RULING` stays `null`, `coverage.moves` stays `{}` in
all six specs, and X1 is untouched for every package including B-NTC. What the new constant
`SUCCESSOR_RULING = 'DECISIONS:113'` admits is narrower than a move: an inherited gate whose
covering child is not a parent-pinned executable. The runner header says all of this in
place, so no reader has to reconcile the two lines themselves.

r5's Z1 text ("record it where the ruling says to record it — `coverage.moves`") is therefore
**implemented against :113's shape, not :112's**. That is the one deliberate departure from
the letter of the review's change list, it is the departure the review itself asked the PM
about, and it is flagged here rather than buried.

## 1. The two commits are WITHDRAWN

```
$ git revert --no-edit 85f7d56 7cd7a5b
[rebuild/lane-b-tooling 02eb2e3] Revert "Require B-NTC policy and bind inherited gates to exact accepted schedules"
 10 files changed, 26 insertions(+), 166 deletions(-)
[rebuild/lane-b-tooling e8e2d61] Revert "Bind B-NTC successors to exact source policy and accepted-chain authority"
 11 files changed, 32 insertions(+), 840 deletions(-)
EXIT=0
$ node --test rebuild/lanes/b/tooling/test/execution-targets.test.cjs   → # pass 9 · # fail 0  EXIT=0
$ git grep -n -e '614717800602' -e 'B-NTC-SUCCESSORS' -e 'astra-b-ntc' -- rebuild/lanes/b/tooling
  (no output)   EXIT=1
```

The r5 review commit stays on top of the commits it rejected; two revert commits stand above
it. `c7b7133` (ACCEPT) is untouched. `b-ntc-successors.json`, `successor-authority.test.cjs`
and the two Astra policy reports went with the reverts. **The Astra policy digest and the
void theme name appear nowhere in the tooling.** (`sourceCommit` appears only in comments
that record its absence; `git grep -n 'sourceCommit'` returns five comment lines and no code.)

## 2. Z1–Z11, each with what was done and what proves it

| # | state | what landed | proof |
|---|---|---|---|
| **Z1** | **DONE** (under :113's shape — §0) | `SUCCESSOR_RULING = 'DECISIONS:113'` and `SUCCESSOR_PACKAGES = {B-NTC}` are runner constants (W7). A spec that does not cite `MOVES_RULING=DECISIONS:113` refuses `SUCCESSOR-RULING-NOT-CITED`; any other package id refuses `SUCCESSOR-PACKAGE-NOT-RULED`. The admitted gates are **derived** from the parent artifact's own `coverage.byChild`, keeping only gates whose parent carrier is an `executionPins` entry **and** whose own source closure reaches `rebuild/m4/workout/engine-runtime.cjs`. Nine names are typed nowhere. `coverage.moves` is still refused for everyone. | `successor-moves.test.cjs` case 2: no successor block → the unchanged `INHERITED-COVERAGE-CHILD-IS-NOT-A-PARENT-PINNED-EXECUTABLE`; a gate the parent does not record → `SUCCESSOR-GATE-NOT-IN-THE-RULING`; a carrier whose closure does not reach the support file → dropped from the derived set (size 0); `MOVES_RULING === null` re-asserted. Measured on the real tree: the derivation returns exactly the nine. |
| **Z2** | **DONE** | `successorProof()` → `proveSuccessor()` proves a RELATION, not an identity: (1) the original equals the parent's `executionPins` entry **and** the Git blob at `b95ccca…`; (2) the successor's own source closure (this package's `role:"new"` files) **names** the original and contains **none** of its non-substituted lines ≥ 40 chars; (3) the successor states its replacements as one strict-JSON `SUBSTITUTIONS` literal which the runner `deepEqual`s against the spec's list, every `from` must stand exactly once in the original and every `to` not at all, and **every** `replace()` call site in the closure must be driven by that table; (4) §Z3. Every carrier is proved, not only gate-carrying ones. | `successor-moves.test.cjs` cases 3–5: a forged pin; a lockstep re-pin still caught by the Git blob; a body pasted instead of loaded → `SUCCESSOR-COPIES-THE-ORIGINAL-INSTEAD-OF-LOADING-IT`; a retarget weakened in the successor only → `SUCCESSOR-SUBSTITUTION-TABLE-DISAGREES-WITH-THE-SPEC`; a replacement outside the table → `SUCCESSOR-REPLACEMENT-NOT-DRIVEN-BY-THE-DECLARED-TABLE`; no table → `SUCCESSOR-SUBSTITUTION-TABLE-MISSING`. **And it fired for real:** the first run against `rebuild/lane-b-ntc` refused `SUCCESSOR-REPLACEMENT-NOT-DRIVEN-BY-THE-DECLARED-TABLE` because the closure walked into `rebuild/conform/v4/postfix` — fixed by bounding the closure to the package's own product and naming every boundary file. |
| **Z3** | **DONE** | The verdict needle is the parent wrapper's own `verdicts` table entry **in full**, parsed out of `native-carriers-package.cjs` after re-asserting its bytes against the parent execution pin. Never re-typed in the runner, never a prefix. | `successor-moves.test.cjs` case 6: `NATIVE SOURCE CARRIERS:` (prefix) and `NATIVE SOURCE CARRIERS: 0/6 PASS;` both refuse `SUCCESSOR-EXECUTED-VERDICT`; an edited wrapper refuses `SUCCESSOR-WRAPPER-BYTES`. On the package branch all ten successor children now carry the accepted strings. |
| **Z4** | **DONE** | Nothing on the successor path asserts for an authority that is merely not yet issued. There is no "theme naming a theme" condition at all: the ruling id is a runner constant, so it cannot be unissued. The brief line, the theme line and the seal remain `note()` OPEN obligations exactly as for every other package. | `--ci --package B-NTC` on `rebuild/lane-b-ntc` terminates `CI REVIEW-PENDING … exit 2` (§3), not `FAIL … exit 1`, which is the regression r5's F2 measured. |
| **Z5** | **DONE** (second option) | There is **no** `policy.sourceCommit` and no policy file. Every successor and original byte is verified on disk and in Git **at HEAD**; the parent's acceptance commit is a runner constant and is asserted `merge-base --is-ancestor` against `CHAIN_REF` **and** `HEAD` once per run, before any blob is read. | `successor-moves.test.cjs` case 7: `/\.sourceCommit\b/` does not occur in the runner; both ancestry call sites are asserted present; the fixture's branch moves forward and the anchoring still holds. |
| **Z6** | **DONE** | `FAIL_CODES` is derived from this runner's own source (every named assertion label opens with an upper-kebab code); `failCode()` returns the leading run of code characters **only if** it is already a name in the file, and the catch prints `B PACKAGE <ID> FAIL <CODE>; …` on stderr. Never child stdout/stderr, never a path, never a count, never anything an input can shape. The BLOCKED path is untouched. | `successor-moves.test.cjs` case 8, and **measured live** (§3): the five sibling packages now print `FAIL PARENT-PIN-BROKEN` / `FAIL UNLISTED-SOURCE-CHANGE` instead of twelve byte-identical terminals. One real defect was caught by this: `assert.equal` appends `\n\na !== b`, so the first implementation matched nothing and printed the old unnamed sentence — fixed and tested both ways. |
| **Z7** | **DONE** | `assert.equal(gitSha('HEAD', TOOLING + '/packages/' + ID + '.json'), sha(specRaw), 'SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT')` beside the runner's own two pins. | An uncommitted spec edit now refuses instead of running clean — reproduced repeatedly during this pass, which is why every measurement below was taken from a committed tree. |
| **Z8** | **DONE** | `execution-targets.test.cjs`'s inherited case built its expectation from the real `packages/B-NTC.json` and asserted `children.length === 5` — true on one lane branch, false (15) on the other. It now builds its own five-carrier / nine-gate fixture. | `# pass 9 · # fail 0` on `rebuild/lane-b-tooling` **and** on `rebuild/lane-b-ntc` (§3). |
| **Z9** | **DONE** | The Astra suite and the policy JSON went with the revert. `rebuild/lanes/b/tooling/test/successor-moves.test.cjs` is lane B's own: it builds a Git repository in a temp directory, compiles the REAL runner with exactly two constants re-pointed at that fixture (asserted to be the only two differing lines), and drives the real functions. No `../astra-*` path, no sibling worktree, no second branch, no network. | `# tests 8 · # pass 8 · # fail 0`, deterministic. |
| **Z10** | **DONE** | `TOOLING-REPORT.md` gains §r5 with the measured head, the withdrawal, the two suites and the moves rule; `README.md` gains the "Successor carriers" section and the r4 and r5 revision-history entries; `TOOLING-FIX-ASTRA-REPORT.md` is annotated with what two blind reviews could and could not reproduce. | The byte table in `TOOLING-REPORT.md` §r5. |
| **Z11** | **DONE** | The UNDECIDED branch of `parent()` now `note()`s that Y2's single-parent scan did not run and why, and the `PARENT PROVISIONAL` line says so too. The scan is **not** hoisted: a provisional head is not a claim on the chain, and refusing a rival claim to a parent the PM has not named would refuse the wrong thing. | The sentence is on every UNDECIDED run; B-LOM is the package that takes that branch. |

## 3. Measured at the fix head

*(filled in below from the final run; every line is quoted verbatim from the command's own
output, and the exit code is the shell's.)*

### 3.1 On `rebuild/lane-b-tooling` (this branch)

```
$ node --test --test-reporter=tap rebuild/lanes/b/tooling/test/execution-targets.test.cjs
  # tests 9 · # pass 9 · # fail 0     EXIT=0
$ node --test --test-reporter=tap rebuild/lanes/b/tooling/test/successor-moves.test.cjs
  # tests 8 · # pass 8 · # fail 0     EXIT=0
```

| command | terminal line | exit |
|---|---|---|
| `--ci --package B-NTC` | `B PACKAGE B-NTC CI REVIEW-PENDING: 5 open obligation(s); public evidence only; no PASS is claimed` | **2** |
| `--ci --package B1` | `B PACKAGE B1 CI REVIEW-PENDING: 6 open obligation(s); …` | **2** |
| `--ci --package B-LOM` | `B PACKAGE B-LOM CI REVIEW-PENDING: 12 open obligation(s); …` | **2** |
| `--full --package B1` | `B PACKAGE B1 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` (stderr) | **2** |

**Two counts moved by exactly one, and both are Z11.** r5 measured B1 at 5 open and B-LOM at
11; each now carries one more line — `OPEN single-parent scan (TOOLING-REVIEW-r4 Y2) did NOT
run: it is reached only once the PM has named the parent, so a rival sibling claim or an
already-sealed rival artifact would not be reported on this run`. Both packages take the
UNDECIDED branch, which is exactly the case r5's F11 and E18 named. Nothing else changed:
B-NTC is still 5 open / exit 2, the same as at `7748880`, so **r5's F2 regression is
undone** — the terminal contract is back where r4 left it.

### 3.2 On `rebuild/lane-b-ntc` (the package the successor code exists for)

The successor path has no meaning without a package that declares successors. Measured on the
merged package branch at the same runner bytes:

```
$ node --test rebuild/lanes/b/tooling/test/execution-targets.test.cjs   → # pass 9 · # fail 0  EXIT=0   (Z8: the same 9/9 on BOTH branches)
$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
B PACKAGE B-NTC SUCCESSORS 10 declared successor executable(s) PROVED against the parent original,
  of which 9 carry an inherited gate under MOVES_RULING=DECISIONS:113 …; coverage.moves stays {}
  and X1 is unwidened; … 3 enumerated substitution(s)
B PACKAGE B-NTC COVERAGE 9/19 original gate(s) covered by 5 executed child(ren) (9 inherited, the
  parent map byte-for-byte; 0 moved …); 10 re-execute under --full
B PACKAGE B-NTC CI REVIEW-PENDING: 3 open obligation(s); public evidence only; no PASS is claimed
EXIT=2
$ node rebuild/lanes/b/tooling/b-package.cjs --full --package B-NTC
B PACKAGE B-NTC BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING      (stderr)   EXIT=2
```

**r5's F2 is closed on the branch that mattered**: B-NTC went from `FAIL … exit 1` to
`CI REVIEW-PENDING … exit 2`, and `--full` reaches the private gate and prints the standing
`DECISIONS:97` BLOCKED line — which B-NTC's own review recorded as unproducible (its open
item O4). The private oracle is never opened; `rebuild/conform/private` does not exist in
either worktree and was never sought.

**Z6, measured live on the five siblings** — r5's F6 was twelve structurally different
tampers producing byte-identical terminals:

```
$ … --ci --package B1     → B PACKAGE B1 FAIL PARENT-PIN-BROKEN; required evidence missing or failed; local diagnostics withheld     EXIT=1
$ … --ci --package B2     → B PACKAGE B2 FAIL PARENT-PIN-BROKEN; …                                                                    EXIT=1
$ … --ci --package B3     → B PACKAGE B3 FAIL UNLISTED-SOURCE-CHANGE; …                                                               EXIT=1
$ … --ci --package B4     → B PACKAGE B4 FAIL UNLISTED-SOURCE-CHANGE; …                                                               EXIT=1
$ … --ci --package B-LOM  → B PACKAGE B-LOM FAIL UNLISTED-SOURCE-CHANGE; …                                                            EXIT=1
```

Those are exactly the two distinct assertions `B-NTC-REVIEW-r2` §F.5 had to instrument a
process to see. A reader gets them from the terminal now.

### 3.3 The one defect this pass found in its own work, and how

The first `--ci --package B-NTC` run on the package branch refused

```
B PACKAGE B-NTC FAIL SUCCESSOR-REPLACEMENT-NOT-DRIVEN-BY-THE-DECLARED-TABLE; required evidence missing or failed; local diagnostics withheld
EXIT=1
```

— and the code is why it took one minute rather than one pass to find. The successor's source
closure stopped only at the parent's own pinned files, so it walked through the lane's module
into `rebuild/conform/v4/postfix` (the immutable library, held by `PIN_PATHS`, not by the
parent artifact) and read **its** `replace()` call sites. The closure is now exactly the files
the package declares `role:"new"`, and every file the walk stops at must be a parent pin, a
`PIN_PATHS` path or the conform library — `SUCCESSOR-CLOSURE-LEAVES-THE-PACKAGE` otherwise, so
nothing is skipped silently. Recorded because it is the kind of thing a review should not have
to find twice.

## 4. Standing controls re-checked

* **X1** — `MOVES_RULING === null`; `coverage.moves` is `{}` in all six specs; the refusal
  fires in `spec()` and again at the seal. Re-asserted by `execution-targets.test.cjs`'s last
  line and by `successor-moves.test.cjs` case 2. **Not widened by this pass**, which is
  `DECISIONS:113 (1) (a)`.
* **X2** — `CHAIN_REF` is still the only source of chain truth, and the successor path uses
  it: the parent acceptance commit is anchored there and against `HEAD`. No spec, and no
  policy file (there is none), names a commit the runner trusts.
* **X3 / X4** — untouched; no move exists to prove, and the two qualified sentences stand.
* **W1–W7** — the runner is pinned on disk **and** in Git at HEAD, and from this revision so
  is the spec (Z7). `TOOLING_FILES` gained `TOOLING-FIX-r5-REPORT.md` and
  `test/successor-moves.test.cjs`, both fixed in the runner (W7), nominated by no spec.
* **N1–N5** — `childArgv()` is still the single executable-target definition (`c7b7133`, kept);
  the needle is still a line-start verdict with the byte floor; the ledger obligations are
  still cleared only by exact line bytes found in Git.
* **Y1** — B-NTC on the package branch reports `15 of 15 declared child(ren) executing one of
  this package's own role:"new" product file(s) ran in this process … 1 required at the seal`;
  B-LOM still carries the Y1 obligation open, as it should.
* **Y2** — both halves unchanged; **Z11** now says out loud when the scan did not run.
* **Y3 / Y4** — spec-note text and the `16 of 18 PIN_PATHS` sentence, both unchanged.

## 4a. What this pass did NOT re-run, said plainly

**r5's twenty-one bites E1–E21 and r2's twenty-one mutations M1–M21 were not individually
re-executed by this pass.** They are the reviewers' own controls, built in the reviewers' own
scratch fixtures, and re-running a reviewer's bite list from the builder's chair proves less
than the reviewer re-running it against the fixed code — which is what r6 is for. What this
pass ran instead is stated above: the two suites (9/9 and 8/8, the second of which is eight
cases each pairing a positive control with a named negative over Z1–Z6), the six packages in
both modes on both lane branches, and the one live bite that mattered to a finding
(`B-NTC G8`, in the package). The bites that a reviewer should re-take first are r5's **E4,
E5, E6** (a spec trying to authorise its own move — the refusal text moved, the rule did not),
**E10** (an uncommitted spec edit — now refuses at `SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT`
rather than running clean, which is Z7) and **E14** (a forged ledger citation — the authority
plumbing is untouched, and the void theme name it used no longer exists anywhere).

## 4b. THE SELF-CLEARING COMMIT — **r6 SHOULD JUDGE THIS ONE FIRST**

One commit on `rebuild/lane-b-tooling` makes two corrections that **clear obligations which
were blocking lane B's own package**. Lane B raised both against itself (`FIX-REPORT-B-NTC-r2.md`
§4.1 and §4.2), declined to make them in the r5 fix pass for exactly that reason, and makes
them here only because the PM asked for them — as **one distinct commit, with its own suite**,
so that a reviewer can take it on its own before anything else in the pass. It touches nothing
else. If r6 rejects it, reverting that single commit restores the two obligations and leaves
every other Z1–Z11 change standing.

**Correction 1 — the product phase (`product()`).** The post-image is now asked before the
pre-image. A file a package declares and PINS but does not CHANGE carries `pre === post`; it
was counted as "still at the pinned pre-image" for ever, so `PRODUCT` could never leave
`PARTIAL` and `OPEN product PARTIAL` blocked `--ci` permanently. B-NTC has seven such files.
**This is a reporting order, not a refusal:** no assertion is added, removed or relaxed.

**Correction 2 — where a child's own ledger lines are looked up (`authority()`).** This is a
defect in **every child package**, not only B-NTC. `authority()` resolved all four cited
lines at `bound.receiptBase` — the **parent's** receipt commit (`b-package.cjs:882`, with the
theme at `:886` and the brief acceptance at `:887`; `receiptBase` is set from the parent's
review receipt at `:681`). Owner and contract belong there: they are parent-era, and the
contract is additionally asserted byte-equal to the parent artifact's own. **The theme and
the brief acceptance do not.** They are this package's own lines, written after its parent
was sealed — necessarily, since they accept work the parent had not seen — so at the parent's
receipt base they can never be found. `brief.acceptedLedgerLine` could therefore never be set
on any child package before its own seal, and the obligation it clears could never be
cleared. Those two now resolve on **`CHAIN_REF`**, the real chain branch read from Git refs.

**Not `HEAD`,** and that matters: a lane can write any line it likes into its own branch's
`DECISIONS.md`, and clearing an obligation by self-declaration is precisely what N4 exists to
prevent. The chain branch is the PM's. `envelope()` still re-resolves **all four** at the
package's own receipt base at the seal, and still asserts that base is an ancestor of
`CHAIN_REF` — so the seal is no weaker and this path is no stronger than the seal.

**The suite:** `rebuild/lanes/b/tooling/test/product-phase-and-ledger.test.cjs`, **7/7 exit
0**. It builds its own Git repository whose `DECISIONS.md` gains the child's two lines in a
**later** commit than the parent's receipt base — the shape that made the old code
impossible — and compiles the real runner with exactly one constant re-pointed at it
(asserted to be the only differing line). (a) an unchanged declared+pinned file reports
`IMPLEMENTED`; (b) a file genuinely at a pre-image with a different post still reports
`pre`/`PARTIAL`, and alone is `NOT-IMPLEMENTED`; (c) a file at neither image still refuses
`UNLISTED-PRODUCT-DRIFT`, a `carried` file is still held to `pin.pre`, and a `new` file with
`post: null` that does not exist is still at the pre-image; (d) with both lines on the chain
branch, both obligations close; (e) absent lines still leave both obligations OPEN, a line
that exists only in the spec still refuses `RECEIPT-EXACT-LINE-MISSING`, and a real line that
does not mention this package still refuses `RECEIPT-CONTENT`; (f) owner and contract still
resolve at the **parent's** receipt base and the contract is still inherited byte-equal — a
late owner line still refuses there; and with no sealed parent at all, both obligations are
still refused a claim and left open.

## 5. Left OPEN

1. **Neither suite has a CI home** (r5's Z8 note, r2's change 8 second half). Both run green;
   no `rebuild.yml` step runs them. Adding one is a `.github` edit — permitted by
   `DECISIONS:112 (1)`'s standing rule only inside an engine package that re-pins
   `rebuild.yml`, which B-NTC does — so it could ride that seal. Not taken here: neither
   review asked for it and `.github` is the surface r2 flagged for exceeding its licence.
2. **Pre-seal co-editing** (r4 R1 / r5 residual 1) is **narrowed, not closed**: the runner and
   now the spec are both pinned on disk and in Git at HEAD, so an uncommitted edit to either
   refuses; a hand that can commit can still move both in one commit. No PASS is reachable
   pre-seal, so this stays a review risk — a sealed B package must be reviewed by *diffing*
   the runner and the spec, not by running them.
3. **The successor's substitution table is read, not executed** — a strict-JSON literal
   extracted by bracket matching and `JSON.parse`d. A string containing an unbalanced bracket
   would make the parse throw, which is a refusal, not a false pass; but the extraction is
   text, and a reviewer should read `b-ntc-successors.cjs`'s table with their own eyes.
4. ~~**The product-phase question**~~ — **CLOSED by the self-clearing commit, §4b.** It was
   raised here as an objection and left standing deliberately; the PM asked for it to be
   taken, and it was, as its own commit with its own suite so that r6 can judge it alone.
   The ledger-anchor defect (§4b correction 2) was found in the same follow-up and is closed
   the same way. **Both are the only changes in this pass that clear an obligation of lane
   B's own package, and they are the two a reviewer should take first.**

**Author:** lane-b-fixer5 · fix pass answering `TOOLING-REVIEW-r5` · **no PASS word is claimed
for anything in this file, and the independent review r6 has not run.**
