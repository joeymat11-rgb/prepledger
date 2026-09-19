# S9-PREP-CELLS REVIEW R3 - independent re-check, one pass, told to disagree

Reviewer: an independent lane hand. The author is gone. Head reviewed:
`32c8096753a418a212fc2b06dee6190314d6d4cf` (the head the author reports).
Round 3 of `rebuild/b-s9-prep-cells`, over `25a15956..32c80967` (8 commits, 4 files,
746 insertions, 25 deletions).

Read: the whole of `fence()` line by line; the whole diff; the shipped
`sealed-inventory-fence.test.mjs` (1152 lines), `package.test.cjs` (394),
`boundary.test.mjs` (279), `.github/workflows/rebuild.yml` (353) and the author's report
(1399). Measured on BOTH operating systems: Linux on a farm scratch worktree of the pushed
head, Windows on the PC at `%TEMP%\earned-s9b` after `git merge --ff-only`, working tree
clean, nothing edited there but this file.

**VERDICT: REJECT, on two blocking findings, each with a measured one-clause or one-row
fix.** Everything else in the round holds up: the ticket's four items landed, the counts
the author reports are the counts I measured to the test, the red-first evidence
reproduces, P-FENCE-1 is fixed and correct, and N2, N3 and N7 are fixed. I am rejecting
because these bytes are about to be sealed and both findings are in the direction the PM
asked me to attack: one clause of `fence()` has no row at all and its removal turns a FAIL
into a SKIP, and F9's fix to N4 is wider than N4 and gives back a PASS where R2's shipped
fence gave a FAIL. Neither is a softening the author hid; both are honest work that went
one step too far or one row too short.

---

## 1. THE MUTATION SWEEP: 50 CLAUSES ENUMERATED, 44 KILLED, 6 SURVIVED

Method: the shipped cell copied out of the scratch worktree, ONE clause replaced by exact
string substitution, the whole cell run, and the set of red rows recorded with THE REAL
ROW (red on this branch by design) excluded. Harness at
`/home/claude/farm/scratch/s9b-r3/sweep.mjs`, outside the repository, pushed nowhere; the
cell was restored from the pristine copy after every run and `git status` in the scratch
worktree is clean.

I enumerated **50 clauses**, which is more than the author's 36 (his table covers "every
clause touched or added" plus R2's 26). The 14 extra are the clauses nobody in R1, R2 or
this round had mutated: the ls-tree name regex, the numeric maximum, the sealed-set
composition, the released-set shape, `idsOf`'s word boundary, `fsBytes`'s catch,
`ancestorOf`, `chainCommit`, the spec-path regex, the status letter in the refusal, the
read of the inventory out of Git, the `option === null` guard, the spec parse catch and
the final verdict expression.

**44 killed.** The full table is at the end of this file (section 8). The six survivors:

| # | clause | what the mutant does | verdict |
|---|---|---|---|
| **M31** | `if (option === null) return bad(2, ...)` | replaced by a stand-aside: the branch SKIPS | **BLOCKING, section 2** |
| M29 | `catch { spec = null; }` on the spec read | replaced by `catch { spec = {} }` | note, section 4a |
| M43 | `idsOf`'s `/\bIDS.../` word boundary | `\b` removed | equivalent today, section 4b |
| M48 | `fsBytes`'s `catch { return null }` | returns `Buffer.alloc(0)` | equivalent, section 4c |
| M49 | `let chainCommit = null` | `let chainCommit = ""` | equivalent, section 4c |
| M50 | `packages/([^/]+)\.json` | `packages/(.+)\.json` | equivalent and STRICTER, section 4c |

Four of the six are equivalent mutants and I say why in section 4 rather than counting
them as defects. One is a sentence, not a verdict. One is blocking.

---

## 2. BLOCKING-1: `option === null` IS A CLAUSE WITH NO ROW, AND ITS MUTANT SKIPS

**The measurement.** Replace

```js
if (option === null) return bad(2, specPath + " names no parent option " + JSON.stringify(parent.chosen ?? null));
```

with a return of `out("skip", [], {...})`, and **not one row of the cell changes colour**:
33 fixture rows green before, 33 green after, on Linux and again on Windows. A clause
whose removal lets a branch stand aside, and no row says so.

**It is not dead code and it is not defensive programming.** I built the worlds rather
than arguing them. Probe at `/home/claude/farm/scratch/s9b-r3/probe-m31.mjs`, which
imports the SHIPPED `fence()` bytes out of the cell and runs it against four throwaway
repositories whose spec carries the full `SPEC_KEYS` closure and a parent that resolves to
nothing:

```
parent: null                     | fail | FENCE-RESEAL-CHILD-UNVERIFIED (2) .../S9.json names no parent option null
parent.chosen names no option    | fail | FENCE-RESEAL-CHILD-UNVERIFIED (2) .../S9.json names no parent option "NOBODY"
parent.options: []               | fail | FENCE-RESEAL-CHILD-UNVERIFIED (2) .../S9.json names no parent option "S8"
parent.options not an array      | fail | FENCE-RESEAL-CHILD-UNVERIFIED (2) .../S9.json names no parent option "S8"
```

All four are authorable in one text editor. All four are refused BY NAME by the fence as
it stands. **The fence is right; the cell is silent about it.**

**Why the existing rows miss it.** Row (8a) is the only row that feeds a bad spec, and
both of its bodies die earlier: `{}` fails the `SPEC_KEYS` key closure at (1), and
`not a spec at all` fails `JSON.parse` at (1). `specFile()` always builds a well-formed
`parent`, so nothing in the file ever reaches the line. That is exactly the shape of the
five clauses R1 rejected this round's first head for, and of R3-B, which the author found
himself and closed with an assertion rather than a weaker claim.

**The fix is one row and it costs nothing.** `specFile()` already takes the option apart;
a row that builds a spec with the key closure intact and `parent.chosen` naming no option,
and asserts `unverified(r, 2)` plus that the refusal names the chosen id. My four probe
worlds are the sub-rows. I am not writing it: a reviewer commits only his review file.

**Why this is blocking and not a note.** The PM's instruction for this round is literal:
*"a clause with no row is BLOCKING."* And the direction is the worst one: the surviving
mutant turns a refusal into a stand-aside, which is the only direction D.2 exists to
refuse. It is the cheapest finding in this file to close.

---

## 3. BLOCKING-2: F9's `carriedAtBase` LIMB IS WIDER THAN F9, AND IT GIVES BACK N4

F9 is a real defect and the author is right about it: before the fix, a branch cut before
the chain sealed the artifact the fence reads was accused of tampering with a file it had
never seen, and from the day S9 seals that is every lane branch in the tree. Row (19)
states it, (8g) measured it, and my sweep confirms the limb is load-bearing: M20
(`carriedAtBase` forced true) is killed by (8g) and (19), M21 (forced false) by five rows.

**But the limb answers a different question from the one the file says it answers.** The
cell's own comment at `:210` is exact: *"The question the check must ask is whether THIS
BRANCH MOVED IT."* `carriedAtBase` asks instead whether the MERGE BASE held the chain's
current bytes. Those differ whenever the chain has moved the artifact since the branch was
cut, which is what every reseal does. In that window the tamper check is simply OFF.

**Measured, three worlds, probes at `/home/claude/farm/scratch/s9b-r3/probe-f9.mjs` and
`probe-ord.mjs`, both running the SHIPPED `fence()` bytes:**

```
A  the chain seals a NEW artifact after the branch was cut; the branch is a well-formed
   reseal child of it AND writes a widened copy of that artifact into its own worktree
   -> skip | FENCE-RESEAL-CHILD S10 ... stood aside on .../acceptance-s9-fixture.json

B  the chain re-seals the SAME artifact path after the branch was cut; the branch is a
   well-formed reseal child AND widens that artifact in its own worktree
   -> skip | FENCE-RESEAL-CHILD S9 ... stood aside on .../acceptance-s8-fixture.json

C  an ORDINARY branch (no spec added) cut before the chain's newest artifact, which
   FORGES that artifact in its worktree with released = every path, and touches nothing
   -> pass | (no refusal)
```

A and B are **exactly what R2 N4 ruled out**, in the PM's own words: *"A reseal child has
no business changing its PARENT's sealed artifact, so a verified child whose worktree copy
of the chain's artifact differs from the chain's FAILS FENCE-INVENTORY-DIFFERS-FROM-CHAIN
instead of skipping."* Row (17) proves N4 holds for a child cut from the chain tip; nothing
proves it for a child cut one reseal earlier, and it does not hold there. C is a **PASS
where R2's shipped fence gave a FAIL**, which is the second half of the question the PM
told me to attack.

**What it does NOT cost, said as plainly as the author said it.** The sealed-path verdict
is never wrong in any of the three worlds: the inventory is read out of Git at the chain
ref whatever the worktree says, so R1 BLOCKING-2's guarantee is untouched, and a verified
child's skip is still bound by condition (2) to the sha the fence measures AT the chain
ref, so the tamper buys the child nothing it could spend. What is lost is the refusal that
exists to NAME the tamper, and R2 N4's rule that a child which does it is not entered into
the claim at all. The author's own "honest limit" sentence in the report and in the cell
header - *"except for the artifact-tamper check, which N4 moved above the claim"* - is
overstated at this head, and that sentence is one the PM will read when he seals.

**THE FIX IS ONE CLAUSE AND I MEASURED IT.** Ask the diff, which the check already sits
below precisely so it can:

```js
const tampered = touched.some((t) => t.path === artifactPath) && (worktree === null || !worktree.equals(chainBytes));
```

Measured at the pushed head with that single substitution and nothing else:

| | shipped | with the one-clause fix |
|---|---|---|
| the 33 fixture rows | 33 green | **33 green** (row (8g), row (19), (6), (6b), (6c), (17) all unchanged) |
| world A | skip | **fail** - `FENCE-INVENTORY-DIFFERS-FROM-CHAIN acceptance-s9-fixture.json` + the sealed touch |
| world B | skip | **fail** - `FENCE-INVENTORY-DIFFERS-FROM-CHAIN acceptance-s8-fixture.json` + the sealed touch |
| world C | pass, no refusal | **fail** by name |

It asks the question the comment says it asks, it keeps F9 closed (a branch that never
touched the artifact is never accused, whether or not its base carried it), and it costs
one row of the file to state: world B as a fixture, beside (19).

**Rows (8g) and (19) do not catch this and cannot.** Both mutate the limb in the direction
of making it TIGHTER (always-true / always-false); neither builds a branch that is INSIDE
the window the limb opens. That is why M20 and M21 were killed and the defect still
shipped: a mutation table proves a clause is needed, not that it is narrow enough.

---

## 4. THE OTHER FIVE SURVIVORS, AND WHY FOUR OF THEM ARE NOT DEFECTS

**(a) M29, a sentence and not a verdict - STILL OPEN, not blocking.** `catch { spec = null }`
on the `git show HEAD:<spec>` read can be changed to `catch { spec = {} }` and no row
changes colour: `{}` then fails the `SPEC_KEYS` closure and the branch is still refused at
(1). What changes is the line a human reads: *"... does not parse as a JSON object"*
becomes *"... is not the runner's own SPEC_KEYS key closure (b-package.cjs:1071)"* about a
file that is not JSON at all. **This is R3-B one more level down, inside the fix for R3-B.**
The author answered R3-B with a third assertion on row (14) rather than a weaker claim;
the same answer fits here: one assertion in (8a) that the refusal for the
`not a spec at all` body says "parse". One line. I record it as a note rather than a
blocker because the verdict, the condition number and the named path are all correct.

**(b) M43, `idsOf`'s word boundary - equivalent TODAY, live TOMORROW.** Removing `\b` from
`/\bIDS\s*=\s*\[([^\]]*)\]/` changes nothing, on the fixtures and on the real runner:
`IDS` is at `b-package.cjs:173` and `RETIRED_IDS` at `:185`, and the fixture stub has the
same order, so the leftmost match is the right one either way. The guard is real only if
the two are ever reordered, and then it decides conditions (3) and (4) off the retired
list. I would not add a row for it; I would add two lines to `runnerStub()` putting
`RETIRED_IDS` FIRST, which makes every existing reseal row measure the boundary for free.
Reported, not blocking.

**(c) M48, M49, M50 - equivalent mutants, stated so the next reviewer does not re-measure
them.** `fsBytes` returning an empty Buffer instead of `null` leaves `tampered` true
through the other limb (`!worktree.equals(chainBytes)`), and `fsBytes` has no other caller.
`chainCommit` initialised to `""` instead of `null` differs only on the path that returns
before `here` is built, and no row reads it there. Widening the spec-path regex from
`([^/]+)` to `(.+)` makes MORE files count as an added spec, so it makes the fence
stricter, never looser. None is a defect.

---

## 5. THE RULED NOTES AND THE PM'S FINDING: FIXED / STILL OPEN / DISPUTE UPHELD

| item | verdict | the measurement |
|---|---|---|
| **P-FENCE-1** the fence never runs in CI | **FIXED** | section 6 |
| **N2** three worlds that threw a stack | **FIXED** | rows (13), (14), (15) exist and are green on both systems; M15 (merge-base guard) killed by (13), M37 (`branchRunner === null`) killed by (14), M09 (`JSON.parse` catch) and M10 (not-an-object limb) both killed by (15). The author's own R3-B (the limb surviving with the wrong sentence) is closed by (14)'s third assertion and I re-killed it |
| **N3** condition (1) requires a genuine add | **FIXED** | row (16); M28 (the `renamedFrom` refusal) and M19 (the `renamedFrom` MARK in the `[RC]` split) both killed by (16), and M18 (the A half of the split) by (1e) and (16) |
| **N4** the tamper check runs before the claim, for every branch | **STILL OPEN** | section 3. M25 (`!tampered` dropped from the claim guard) IS killed by (17), so the MOVE is held; the `carriedAtBase` limb added beside it is what re-opens N4 for a branch cut before the chain's current artifact |
| **N7** a prose string alone on a line is not a path | **FIXED** | section 7 |
| **F3** condition (2) gets no second limb | **DISPUTE UPHELD, and it is the right call** | row (8g) measures it and its assertion that the refusal is NOT `(3)` is what keeps R3 N4's clause from being dead code; M34 and M35 are both killed by (8h), so condition (3) is live in both limbs |
| **F6** the thirteen comment lines in `boundary.test.mjs` | **STAY, and they do** | the file is byte-identical across this whole round (`git diff 25a15956..HEAD` names four files and this is not one) |
| **F4** the three author-chosen refusal names | **STAY** | `FENCE-NO-INVENTORY-AT-CHAIN-REF`, `FENCE-GIT-UNAVAILABLE`, `FENCE-NO-MERGE-BASE`; nothing depends on the spelling |
| **N5** `-z` not adopted | **as ruled** | the sentence is in the cell at `:167-:174` and says all three things: `core.quotepath=false` closes non-ASCII (row (1d) measures it, M01 killed), a `"` or TAB would still be quoted and a TAB would truncate `split("\t")`, Windows forbids both bytes, `-z` is the complete answer the day that changes |
| **N6** for the S9 brief, in the ruling's words | **present** | report 13.10 item 1, the PM's sentence |
| **N1 / STOP-7** | **present** | report section 9 row 7 and 13.11 carry GitHub run `35440101975` on `rebuild/c-p4b-memory-1` |
| **N8 / N9** Hb-M5's real text, section 7 re-measured | **present** | report 12.x and 13.6 |
| **N10** the junction fact | **present, unchanged** | report 13.10 item 5; I created no junction and touched nothing under `%TEMP%\earned-adm` |
| the integrator fact (the `released` shape) | **present and exact** | report 13.9 item 1: `new Set(Object.keys(inv.released \|\| {}))`, a path is released when it is a KEY, values unread. That IS what `fence()` does at `:152`. Row (12) measures the array direction; M14 (released accepting an array) is killed by (12) |

---

## 6. P-FENCE-1: READ AS GITHUB WOULD READ IT

**FIXED.** I checked the workflow the way the runner does rather than by eye.

```
YAML parse of .github/workflows/rebuild.yml
  jobs.public-gates.strategy = {fail-fast: False, matrix: {os: [ubuntu-latest, windows-latest]}}
  steps: 30
  the ONLY step carrying an `if`:
    "C - the sealed-inventory fence over this branch's own diff"  =>  '${{ !cancelled() }}'
```

- **It runs after a failed earlier step.** `!cancelled()` is a status-check function, so
  the implicit `success()` is dropped and the step is evaluated after the standing
  `--ci --package S8` step at `:150` fails. That is the world the fence exists for, and I
  measured what `:150` prints on this very branch (section 7): a named refusal that names
  nothing.
- **It does not run on a cancelled run.** `cancelled()` is true then and the step is
  skipped, which is what the PM asked for and what `always()` would have got wrong.
- **It does not make the job green.** The step has no `continue-on-error`; its own exit
  status is still the job's.
- **No OTHER step gained a condition.** Exactly one `if` in 30 steps, and no
  `continue-on-error` anywhere in the file.
- **The `${{ }}` form is the safe one.** A bare `if: !cancelled()` would be a YAML tag
  indicator at the head of a scalar; wrapped, the scalar starts with `$` and parses as a
  string. The file parses cleanly, which I checked rather than assumed.
- **Row (18) holds it.** I mutated the workflow three ways and ran the cell each time:

| the line in `rebuild.yml` | row (18) |
|---|---|
| removed entirely | **RED** |
| `if: ${{ always() }}` | **RED** |
| `if: ${{ success() }}` | **RED** |
| `if: ${{ !cancelled() }}` (shipped) | green |

Row (18) finds the step by this cell's own repository path, never by line number and never
globbed, and walks back to the nearest `- name:`, so moving the step does not fool it and
an `if:` on a neighbouring step does not satisfy it.

**Every cell that reads `rebuild.yml` is still green, and none of them pins the absence of
step conditions.** I searched the whole tree, not only the five the PM named:

| cell | what it reads | state |
|---|---|---|
| `m4/workout/test/h3-clean-init.test.cjs` H3/13 | the TODAY step's `run:` line, and asserts the named set equals the directory | unaffected: the fence's `run:` line does not contain `today/test/adapter.test.mjs`. Green inside the today step (685/683/2, and neither failure is H3/13) |
| `coach/test/engine-revision.test.cjs` | the standing `--ci --package <id>` step by regex | **6 / 6 / 0, measured on the PC** |
| `m4/import/test/production-mapping.test.cjs`, `production-admission.test.mjs` | the same standing-step regex | unaffected by an added step |
| `m4/spec/b-ntc-successors.test.cjs` | `rebuild.yml` is in `SUPERSEDED` and its bytes are read live, not pinned to a sha | unaffected; it was already changed by this branch before this round |
| `lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs` | a comment about `rebuild.yml` having no W6 whole-tree step | no assertion on the file |
| `lanes/c/p3-today-hotfix/today-headline.test.mjs` | a comment | green (9/9/0 in the lane C step) |
| `conform/v4/postfix/test/ci-second-gate.test.cjs:29` | **a whole-file byte pin** of `rebuild.yml` against commit `a777f643` with one substitution | **stale-RED and homeless, pre-existing.** `rebuild.yml` names neither this cell nor `ci-second-gate.cjs` anywhere (I grepped: zero hits), and `h3-clean-init.test.cjs:718` says so in the tree's own words: *"stale-RED at this head AND at ce38aa3 (pre-existing, not an H3 regression)"*. Nothing this round did changed its state. It is the PM's to route |
| `lanes/tooling/test/shared-preflight-ci-registration.test.cjs` | `shared-preflight.yml`, NOT `rebuild.yml` | green, and see the note below |

**THE ONE PRECEDENT THE PM SHOULD WEIGH, and it is not a blocker.**
`shared-preflight-ci-registration.test.cjs:82` pins its protected step's key set to exactly
`['id','name','env','run']` under the code `REGRESSION-NO-SKIP`, and its mutation list
includes *"step skip"* (`steps[3].if = 'false'`). So the tree's existing doctrine on the
OTHER public workflow is that a protected step carries no `if:` at all. `rebuild.yml` has
no equivalent cell, so nothing in the tree forbids the fence's condition, and `!cancelled()`
is the opposite of what that rule guards: it makes a step run MORE, never less, and the
rule exists to stop a step being turned off. I report it because the day somebody writes
the same key-closure cell for `rebuild.yml`, the fence's step is the one exception it will
have to name on purpose.

**Two steps in this ticket do NOT carry the condition, and that is worth one sentence.**
Steps (b) (E fact 21, the three passphrase cells) and (c) (E fact 22, `local-import`) have
no `if:`, so on any branch where `:150` fails they never run either. That is the status quo
for all 29 other steps and not a regression of this round, and both steps exist to give
homeless cells a CI home rather than to speak on a failing branch. But the PM asked for
this file to be read as GitHub reads it, and as GitHub reads it those two homes are empty
on exactly the branches that most need them. Not my edit; named so it is a decision and
not an oversight.

---

## 7. THE BAR, RE-RUN, AND EVERY COUNT I MEASURED

PC: `%TEMP%\earned-s9b` at `32c80967`, `git status` clean, node
`C:\Users\joeym\.cache\codex-runtimes\...\node.exe`, `MEASURED_TEST_NOW=2026-09-03`,
`TZ=America/New_York`, every long run through a `.cmd` with a log and a `.done` file
(`s9b-rv3-*`). Linux: `/home/claude/farm/scratch/wt/s9b-r3` at the same head.
**No re-run was needed anywhere. Nothing was green once and red once on either machine, so
nothing here is reported as timing.**

| what | measured | author's claim |
|---|---|---|
| the fence cell, Windows | **34 / 33 / 1**, exit 1, 36.3 s | 34 / 33 / 1 - matches |
| the fence cell, Linux | **34 / 33 / 1**, 3.0 s | 34 / 33 / 1 - matches |
| the whole today step (`rebuild.yml:232`, 17 cells) | **685 / 683 / 2**, exit 1 | 685 / 683 / 2 - matches |
| the two today-step failures | `boundary.test.mjs P-MEASURE (g)` and `setup.test.mjs re-pin`, by name | the same two, pre-existing - matches |
| `package.test.cjs` alone | **14 / 14 / 0**, exit 0 | 14 / 14 / 0 - matches |
| `boundary.test.mjs` alone | **6 / 5 / 1**, exit 1 | 6 / 5 / 1, pre-existing - matches, and verified against the BASE (see below) |
| step (b), the three passphrase cells | **20 / 20 / 0**, exit 0 | matches |
| step (c), `rebuild/m3/w6/test/local-import.test.mjs` | **22 / 22 / 0**, exit 0 | matches |
| the lane C step | **9 / 9 / 0**, exit 0 | matches |
| `coach/test/engine-revision.test.cjs` | **6 / 6 / 0**, exit 0 | not claimed; mine |
| `b-package.cjs --ci --package S8` | `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`, exit 1 | word for word - matches |

**The runner's refusal names nothing, and that is the round's own best argument.** The
three lines before it (`SPEC OBSERVED`, `PARENT OPTION S7`, `PARENT BOUND S7`) all pass;
then the profile recomputation refuses and withholds, so `--ci --package S8` cannot tell
anyone WHICH sealed path moved. The fence names all nine. The author's F8 is confirmed.

**THE REAL ROW's MEASURED REFUSAL, ON BOTH MACHINES.**

```
Windows (chain ref at 2ca7a617e439341b0d2f3af67aac06def7f9b0da):
  this change drew 9 refusal(s), 9 of them sealed path(s) that
  rebuild/m4/spec/acceptance-s8-real-shape.json at
  refs/remotes/origin/rebuild/t2-client-core (2ca7a617...) does not release
    FENCE-SEALED-PATH-TOUCHED M .github/workflows/rebuild.yml
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w6/local/import-bundle.mjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/import/import-screen.mjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/import/test/page-bundle.test.mjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/measure/test/boundary.test.mjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/today/test/adapter.test.mjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/today/test/package.test.cjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/today/test/view.test.mjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/today/today-app.cjs

Linux (chain ref at 4d2112c92ddffa3fafdd8cfd9dcd4180addb504c): the SAME nine paths,
  the same artifact, the same sentence, a different chain commit.
```

It is `FENCE-SEALED-PATH-TOUCHED` and not `FENCE-RESEAL-CHILD-UNVERIFIED`, which is right:
this branch carries no `packages/S9.json` and enters no claim. **No skip, no environment
switch, no branch-name test was added to make it green, and I looked for one.**

**R1 N10 demonstrated itself twice more, in my hands.** The two machines stood at
DIFFERENT commits of the remote-tracking chain ref - `2ca7a617` on the PC, `4d2112c9` on
the farm, neither of them the `467638af` the author last saw - and printed the same nine
paths. That is what the line in the refusal is for, and it is the reason I could tell at a
glance that the difference was a stale fetch and not a disagreement. I did not fetch the
chain ref on the PC: other lanes share that repository and its remote refs.

**`boundary.test.mjs` is pre-existing red, and I verified it at the BASE rather than
taking the author's word.** A scratch worktree at `da9f8683` (the branch's own base, before
this ticket):

```
base da9f8683:  6 / 5 / 1, drifting: rebuild.yml, adapter.test.mjs, view.test.mjs, today-app.cjs
head 32c80967:  6 / 5 / 1, drifting: the same four PLUS package.test.cjs
```

The row was already red before this ticket existed; this ticket adds exactly one path to
its list, `package.test.cjs`, which is its own item (2). The author's report says precisely
this at its section 0 and at lines 79-80. Confirmed.

**ITEM (2) H18, re-measured independently, including the hole.** I read the 48 out of
`build.mjs` myself with both the old rule and the new one:

```
strict "rebuild/" rule: 48 | loose rule: 48 | today/ entries: 26 | unique: 48
quoted strings inside the block: 51
```

**26 of 48 confirmed**, and 48 of 51 quoted strings, exactly as the cell's comment says.
Then the red-first, on a scratch copy with `"rebuild/m3/w7-preview/today/today-app.cjs"`
deleted from `REQUIRED_INPUTS`:

| what | result |
|---|---|
| the OTHER 16 cells of the today step (`today/test/*` minus `package.test.cjs`, plus the four measure cells) | **671 tests, 669 pass, 2 fail - and the two are the SAME two pre-existing failures.** Not one new red. **The hole is real** |
| `package.test.cjs` H18 | **RED, naming the path**: *"rebuild/m3/w7-preview/today/today-app.cjs is no longer refused by build.mjs's REQUIRED_INPUTS"* |
| `package.test.cjs` H18b | **RED, naming the count**: *"no longer the 26 paths this seal pins: it now holds 25"* |
| `package.test.cjs` H18c | RED on its own 48 baseline (expected; it asserts the baseline first) |

`build.mjs` was restored from a pristine copy and the scratch worktree's `git status` is
clean. `build.mjs` is not edited by this ticket and is not edited by me.

**ITEM (3) `boundary.test.mjs`, read rather than re-run.** C.2 is done exactly as specified:
the `shaOf(f) === declaredPost(f)` assert is gone, the `P3_IMPORT_UI_2_UNSEALED` constant,
the `for` loop and the `Object.hasOwn` assert at `:186-:187` all stay, and the thirteen
comment lines F6 ruled in are there. E fact 12 is done: `CHILD_SPECS` at `:140` is
`['H3','S3','S4','S5','S6','S7','S8','S9']` with `'S9'` youngest, in the S8 comment's
shape, and R4 N7's consequence for `declaredPost` is written out above it.

**N7, ITEM (2)'s new row, re-measured.** `requiredInputsOf()` is now a function of source
text and the per-line rule requires the `rebuild/` prefix. H18c plants a prose line and
asserts the list is unchanged, and plants a REAL path the same way and asserts the list
grows by one - so the row measures the rule and not the plant. With the rule widened back
to any quoted string, H18c is the cell that goes red, which is what the author's `510388e`
commit is. **FIXED.**

**The owned-files fence is clean.** `git diff --name-status da9f8683..32c80967` is exactly:

```
M  .github/workflows/rebuild.yml
A  rebuild/lanes/b/S9-PREP-CELLS-AUTHOR-REPORT.md
A  rebuild/lanes/b/S9-PREP-CELLS-REVIEW-R1.md        (a reviewer's file)
A  rebuild/lanes/b/S9-PREP-CELLS-REVIEW-R2.md        (a reviewer's file)
A  rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs
M  rebuild/m3/w7-preview/measure/test/boundary.test.mjs
M  rebuild/m3/w7-preview/today/test/package.test.cjs
```

Nothing on the wait list, nothing another lane owns, no product file, no
`packages/S9.json`, no needle, no `--package S9` walk, no PACK-PIN or APPROVED-PIN literal,
no `design.test.cjs` hunk, and the standing `--ci --package S8` step is not flipped.
`build.mjs` and `preview.css` are byte-identical to the base. I opened nothing under
`rebuild/conform/private`, no `ledger/`, no `src/history.js` and no soak, on either machine,
and created no junction.

**The authored bytes are ASCII.** The fence cell contains not one non-ASCII byte (the
one non-ASCII path a row needs is built with `String.fromCharCode(0xe9)`, which is the
right call and the comment says why). No U+2013 and no U+2014 in any line this round adds;
the em dashes that exist in `package.test.cjs` and `rebuild.yml` are all pre-existing and
none is on an added line.

---

## 8. THE FULL SWEEP TABLE

Baseline: 33 fixture rows green, THE REAL ROW red and excluded. Every entry is one
substitution against the pristine shipped bytes.

| # | clause mutated | verdict | rows newly red |
|---|---|---|---|
| M01 | `-c core.quotepath=false` removed | KILLED | (1d) |
| M02 | `chainRefRefusal` ENOENT limb false | KILLED | (10) |
| M03 | `chainRefRefusal` ENOENT limb true | KILLED | (4), (10) |
| M04 | the `rev-parse` catch falls through | KILLED | (4), (10) |
| M05 | the ls-tree name regex loses `\.json$` | KILLED | (4b) |
| M06 | `cands.length === 0` guard removed | KILLED | (4b) |
| M07 | numeric maximum becomes lexical | KILLED | (7) |
| M08 | `chosen.length > 1` guard removed | KILLED | (7b) |
| M09 | the inventory `JSON.parse` catch swallows | KILLED | (15) |
| M10 | the not-an-object limb removed | KILLED | (15) |
| M11 | the sealed set drops `executionPins` | KILLED | (1b) |
| M12 | the sealed set drops `product` | KILLED | 10 rows |
| M13 | `released` releases nothing | KILLED | (2), (7), (12) |
| M14 | `released` accepts an array | KILLED | (12) |
| M15 | the merge-base catch falls back to the chain ref | KILLED | (13) |
| M16 | the diff runs from the chain ref, not the merge base | KILLED | (9) |
| M17 | the `[RC]` split drops its D half | KILLED | (1e) |
| M18 | the `[RC]` split drops its A half | KILLED | (1e), (16) |
| M19 | the `[RC]` split drops `renamedFrom` | KILLED | (16) |
| M20 | `carriedAtBase` forced true | KILLED | (8g), (19) |
| M21 | `carriedAtBase` forced false | KILLED | (6), (6b), (6c), (17), (19) |
| M22 | the tamper's `worktree === null` limb removed | KILLED | (6c), (19) |
| M23 | the tamper's bytes-differ limb removed | KILLED | (6), (6b), (17) |
| M24 | the tamper refusal never pushed | KILLED | (6), (6b), (6c), (17), (19) |
| M25 | a tampered branch may still claim | KILLED | (17) |
| M26 | the added filter ignores the status letter | KILLED | (8i) |
| M27 | "exactly one spec" becomes "at least one" | KILLED | (8a) |
| M28 | the genuine-add guard removed (N3) | KILLED | (16) |
| **M29** | the spec-parse catch yields `{}` | **SURVIVED** | section 4a |
| M30 | the `SPEC_KEYS` closure check removed | KILLED | (8a) |
| **M31** | `option === null` stands aside | **SURVIVED** | **BLOCKING-1** |
| M32 | condition (2) artifact path removed | KILLED | (8b) |
| M33 | condition (2) sha256 removed | KILLED | (8c) |
| M34 | condition (3) removed whole | KILLED | (8h) |
| M35 | condition (3)'s `lanePackage` limb removed | KILLED | (8h) |
| M36 | condition (4) "runner in the diff" removed | KILLED | (8d) |
| M37 | condition (4)'s runner-deleted limb removed | KILLED | (14) |
| M38 | condition (4) "id in the branch's IDS" removed | KILLED | (8d) |
| M39 | condition (5) removed | KILLED | (8f) |
| M40 | the sealed loop ignores `released` | KILLED | (2), (7), (12) |
| M41 | the sealed lookup becomes a prefix scan | KILLED | (1d), (1e) |
| M42 | the sealed lookup case-folds | KILLED | (1d) |
| **M43** | `idsOf`'s `\b` removed | **SURVIVED** | section 4b, equivalent today |
| M44 | the refusal drops the status letter | KILLED | (1c), (1e) |
| M45 | the inventory read from the WORKTREE | KILLED | (6), (6b), (17) |
| M46 | the verdict is always `pass` | KILLED | 12 rows |
| M47 | `ancestorOf` always true | KILLED | (8f) |
| **M48** | `fsBytes` returns an empty buffer | **SURVIVED** | equivalent |
| **M49** | `chainCommit` initialised to `""` | **SURVIVED** | equivalent |
| **M50** | the spec-path regex admits a nested path | **SURVIVED** | equivalent, and stricter |
| P-F1a | `if: ${{ !cancelled() }}` removed from `rebuild.yml` | KILLED | (18) |
| P-F1b | the same line as `${{ always() }}` | KILLED | (18) |
| P-F1c | the same line as `${{ success() }}` | KILLED | (18) |
| N7-M | the H18b line rule widened back | KILLED | `package.test.cjs` H18c |

---

## 9. THE ATTACK ON THE NEW ORDER, STATED AS AN ANSWER

*Can a branch now get a SKIP it could not get before, or a PASS where it used to FAIL, by
any combination of a renamed spec, a deleted runner, a tampered parent artifact and a
touched sealed path?*

| combination | shipped fence | verdict |
|---|---|---|
| renamed spec (`git mv`) + runner hunk + sealed touch | `FENCE-RESEAL-CHILD-UNVERIFIED (1)` naming both paths | **blocked** (row (16)) |
| deleted runner + added spec + sealed touch | `FENCE-RESEAL-CHILD-UNVERIFIED (4)` saying "DELETING it" | **blocked** (row (14)) |
| tampered parent artifact + added spec + sealed touch, **branch cut at the chain tip** | fenced as an ordinary branch: tamper + touch, both named | **blocked** (row (17)) |
| tampered parent artifact + added spec + sealed touch, **branch cut before the chain's current artifact** | **SKIP** | **HOLE - BLOCKING-2** |
| tampered parent artifact alone, ordinary branch cut before the chain's current artifact | **PASS, no refusal** | **HOLE - BLOCKING-2** |
| a spec with the full key closure and no resolvable parent option | refused at (2) today; **nothing in the cell says so** | **BLOCKING-1** |
| two added specs, each well-formed | refused at (1) | blocked (row (8a)) |
| seven modified ancestor specs beside one added | SKIP, correctly | blocked (row (8i)) |
| an id already in `IDS` at the chain ref over another inventory | refused at (3) | blocked (row (8h)) |
| a released block of the wrong shape | releases nothing, fails closed | blocked (row (12)) |
| a shallow clone with no chain ref | `FENCE-CHAIN-REF-ABSENT` | blocked (row (4)) |
| a chain ref whose spec directory holds no artifact | `FENCE-NO-INVENTORY-AT-CHAIN-REF` | blocked (row (4b)) |
| an artifact that is an ARRAY (the vacuous-pass door) | `FENCE-INVENTORY-NOT-JSON` | blocked (row (15)) |
| a branch merely BEHIND the chain | PASS, correctly | blocked (row (9)) |

Two holes, both in section 2 and section 3, both with a measured fix.

---

## 10. WHAT I DID NOT VERIFY

- I did not run the sibling lanes' cells, the `--ci --package S9` walk, the seal generator
  or anything that could write a receipt or an artifact. `b-package.cjs --full` was never
  run.
- I did not fetch `refs/remotes/origin/rebuild/t2-client-core` on the PC: other lanes share
  that repository. The two machines therefore judged by different chain commits, which is
  itself a measurement (section 7) and not a gap.
- I did not run the full `rebuild/m3/w7-preview/**` 24-cell suite on the PC, only the 17
  cells the today step names plus the three new step commands and the lane C step.
- I did not verify the claim that `packages/S9.json` will turn THE REAL ROW into a verified
  skip. Nobody has run it; the author says so and I agree it is an argument, not a
  measurement. Row (8i)'s world is the closest evidence.
- Section 2's fix and section 3's fix are measured against the fixture rows and the probe
  worlds. Neither is committed: a reviewer commits only his review file.

---

## 11. THE SHORT VERSION FOR THE PM

Four items landed and the counts are exactly what the author reports; I re-measured every
one of them and found no discrepancy. P-FENCE-1 is fixed and the condition is the right
one, read as GitHub reads it. N2, N3 and N7 are fixed. F3's dispute is upheld and is the
safer call. Nothing in the fix round is a softening.

**Two things stand between this and the seal, and each is one edit:**

1. **`fence()` has a clause with no row** - `option === null`, whose mutant SKIPS. Four
   authorable worlds reach it and are refused correctly today. One row, modelled on (8a).
2. **F9's `carriedAtBase` limb gives back R2 N4** for every branch cut before the chain's
   current artifact, which after any reseal is most of them. Measured: a verified child
   tampering with its parent's sealed artifact SKIPS, and an ordinary branch forging that
   artifact PASSES with no refusal. The fix is one clause -
   `touched.some((t) => t.path === artifactPath)` in place of `carriedAtBase` - which keeps
   all 33 fixture rows green, keeps F9 closed, refuses all three worlds, and asks the
   question the cell's own comment at `:210` says it must ask.

Both are cheap. Neither changes a design. I would hold the seal for them.
