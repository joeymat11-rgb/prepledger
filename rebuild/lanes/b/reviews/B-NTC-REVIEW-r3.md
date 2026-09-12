# B-NTC - INDEPENDENT REVIEW r3 - **ACCEPT WITH CHANGES**

**SEALABLE once the two ledger lines exist: YES** - with one condition that costs no
engineering: the brief carries two stale documentary figures (R1, R2). Correct them, re-issue
`FIX-REPORT-B-NTC-r2.md` LINE 2 against the brief's new sha256, and the package is sealable.
Nothing in the code, the successor mechanism, the provider, the workflow or the gates needs to
move. I reproduced the exit-0 state end to end myself.

**Package:** B-NTC, the qualified `nativeTrendContext` provider - the `DECISIONS:103` (1) first
lane-B engine package and the S2 blocker.
**Under review:** `rebuild/lane-b-ntc` @ **`3acc805acc37db67051524c0fd96125e34d87df8`**.
**Base of the delta judged here:** `10feb1e` (= `71fb2f1` + the r2 review commit).
**Answering:** `B-NTC-REVIEW-r2.md` REJECT (R1-R14, changes 1-13) and
`FIX-REPORT-B-NTC-r2.md` by `lane-b-fixer5`.
**Ruling of record:** `DECISIONS:113` (MOVES_RULING B-NTC-INHERITED-1 ratified as written in
r2 E.3), with `:112`, `:116` (6) and `:117` (4).
**Integration tip:** `origin/rebuild/t2-client-core`, `9abe32e` when this review began and
`5a76fcd` when it ended; the move was docs only and changed nothing I measured (A.5).
**Reviewer:** independent, blind. I wrote none of this package and none of the tooling. Every
number below was executed by me on the owner's Windows PC in a read-only detached worktree
(`.../work/lane-b/rv-ntc3`, node v24.18.0, `TZ=America/New_York`,
`MEASURED_TEST_NOW=2026-09-03`), suites run serially in that tree per r2's concurrency note,
with every mutation confined to a disposable `git clone --shared` in my scratch directory that
was deleted before this file was written. Builder claims, the fixer's report and every Astra
document were treated as hypotheses and re-measured. Nothing is marked PASS that I did not run.

**VERDICT: ACCEPT WITH CHANGES.**

r2 rejected the seal layer, not the provider. **The seal layer is fixed, and I proved it
rather than accepting it.** The package's own runner now terminates
`CI REVIEW-PENDING: 2 open obligation(s) ... no PASS is claimed` at **exit 2** and
`--full` terminates `B PACKAGE B-NTC BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` at **exit
2** - both of r2 change 1's proofs, met on my run. Both remaining obligations are PM ledger
lines. I built the throwaway chain myself, appended the two line texts out of the fix report
verbatim, and the same command terminated **`PUBLIC CI EVIDENCE PASS` at exit 0** with the
unsealed artifact as its only `OPEN`. The two line texts hash to exactly the two sha256 values
the fix report posts, and changing one byte of one of them makes the runner refuse.

The successor mechanism, which r2 could only describe, I have now **measured against all five
conditions of `DECISIONS:113` (1)** and against mutation. Every one of the fourteen parent
originals the successors load is byte-equal to the parent's own `executionPins` entry **and**
to the Git blob at the parent acceptance commit `b95ccca`; the compiled body differs from the
original by **exactly** the enumerated substitution lines and by nothing else, across all
fourteen; not one parent original and not one private compilation reaches `require.cache`; no
successor file contains a single line of its original. Breaking condition (a) refuses by name
(`COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING`) and breaking condition (e) refuses by name
(`SUCCESSOR-RULING-NOT-CITED`). I ran **24 mutations**; the 22 that should turn the package red
turned it red, and the two that should stay green stayed green and are r2's own M8/M16 control.

What is left is documentary, and it sits in the one document `DECISIONS:113` (2) binds by
sha256. The brief's 7.2 still advertises the provider cells as **36/36** when the head measures
**39/39**, and the v1.3 amendment table - the very list :113 (2) tells the r3 reviewer to check
the diff against - says "**the two** retargets" where the spec, the module, the runner and the
brief's own S all say **three**. Those are the same species of defect that r2's change 5 made
the lane withdraw from 5, and they must not be carried into a ledger line that binds bytes.
Separately, `FIX-REPORT-B-NTC-r2.md` 6 makes three measurements that are false at the head it
is committed in (R3). None of this touches the engineering.

**I also record, in lane B's favour, something the fixer did not claim.** r2's R12 warned that
the successor rewrites two original assertions and that a weakening could not be caught by
machine. I measured where those two land: **both sit on carriers that carry no inherited gate
at all.** The nine inherited gates - migrate-source, merge-source, writers-source, witnesses-2,
witnesses-5, migrate-differential, witnesses-7, writers-differential, second-gate - run their
parent originals with **0 substitutions each**. Only the shared SUPPORT pin re-target, which is
the pin re-target condition (c) is literally about, is in their dependency at all. R12's blast
radius is materially smaller than r2 could see, and the runner now catches a retarget weakened
alone, added, or applied off-table (bites M10, M11).

---

## 0. Findings, ranked

| # | finding | severity |
|---|---|---|
| **R1** | **The brief's 7.2 is a stale executable claim, inside the document `DECISIONS:113` (2) binds by sha256.** Heading 1225 reads "the provider's own cells ... **36/36 PASS** (v1 had 22)" and the two group tables under it account for 22 + 14 = 36. Measured by me at this head: `node --test --test-reporter=tap rebuild/m4/workout/test/native-trend-context.test.cjs` -> **# tests 39 / # pass 39 / # fail 0**, exit 0. r2 measured 39 as well, and the fixer's own FIX-REPORT 2 and `BUILD-REPORT-B-NTC.md` 0.5-r2 both carry **39/39** and call 36/36 superseded - the brief alone was not re-measured. This is the class of defect r2's change 5 made the lane withdraw from 5, and it would be frozen into a PM line. | **should fix - claims** |
| **R2** | **The v1.3 amendment table says "two retargets" where there are three.** Row 9 (line 26): "the **two** retargets are enumerated in the package spec". The spec's `coverage.successors.substitutions` has **3** entries; `b-ntc-successors.cjs` `SUBSTITUTIONS` has **3**; I `deepEqual`d the two and they are identical; the runner prints "3 enumerated substitution(s)" and one `SUCCESSOR SUBSTITUTION` line each; and the brief's own S explains why three is right. The amendment table is the artefact :113 (2) directs the r3 reviewer to check the diff against, so an inaccuracy there is worse than elsewhere. | **should fix - claims** |
| **R3** | **`FIX-REPORT-B-NTC-r2.md` 6 makes three measurements that are false at the head it is committed in.** It states `git diff --name-only 10feb1e HEAD -- .github` -> "(empty)"; measured: **`.github/workflows/rebuild.yml`**. It states `git diff --stat 10feb1e HEAD` -> "32 files changed, 2539 insertions(+), 701 deletions(-)"; measured: **66 files changed, 9511 insertions(+), 904 deletions(-)**. It states in prose "**No `.github` file was touched by this pass at all**"; the pass's own commit `fed830a` ("DECISIONS:117 (4) C5 CI step") touches it. The section was written against the head before the last two commits of the same pass and not re-measured. The report's 1 row 3a and 2 disclose the C5 step correctly, so this is staleness, not concealment - but a fix report that answers a finding about a false executable claim must not introduce one. | **should fix - claims** |
| **R4** | **`DECISIONS:113` (2) directs `brief.acceptedLedgerLine = 113`; lane B has not done it, and asks for a new line instead.** I verified lane B's reason mechanically rather than taking it: line 113 as it stands on the chain branch **does not contain** the packageId `M2-B-NTC-NATIVE-TREND-CONTEXT` (`includes` -> false), **does not contain** the brief path (-> false), **does not end** ` - ACCEPTED` (-> false), and **fails** `spec()`'s ACCEPT-terminal regex (-> false); it ends `... B-NTC-REVIEW-r2.md - RULED`. All four of `b-package.cjs:461-462`'s requirements fail, and the theme assert at `:598` fails too. So the PM's own directive is mechanically impossible under the runner, and lane B refused to relax the runner to make it possible - which is the right call. **But it is a deviation from a direct PM instruction, and only the PM can ratify the substitution.** This is the single item left. | **note - authority** |
| **R5** | **Neither documentary defect above adds unlisted material to the brief.** I discharged the :113 (2) obligation directly (C below): the `0ba59cca` -> `2f4dbbd7` diff is 973 insertions / 159 deletions, and I walked every deletion and every added section. Every hunk lands in one of the ten amendment rows; the deletions are all superseded v1 text (the "PROPOSED, NOT ACCEPTED" title, the "H6 NOT MADE, deliberately" section, the 22/22 and 123/123 figures, the old Q2 on the runner's package list, old O2/O3). **Nothing else is in there.** The obligation is met; R1 and R2 are inaccuracies within listed amendments, not unlisted amendments. | **note** |
| **R6** | **CI is red on the lane branch at this head, and that is the ruled pre-seal state.** `rebuild.yml` runs `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC`, which I measured at **exit 2**. `DECISIONS:113` (3) rules the replacement correct, says not to restore the parent step, and requires exit 0 "at the sealed head". I proved exit 0 is reachable and that exactly the two ledger lines are what make it reachable (E.4). r2's change 2 is therefore ruled and provably closable, not closed. | **note** |
| **R7** | **`DECISIONS:113` (7) agreed `--explain` for the r5 tooling fix; the runner at this head has none.** `Select-String -Pattern 'explain'` over `b-package.cjs` returns **0** matches, and `--ci --package B-NTC --explain` is refused by the usage guard. No document here claims it exists, and the refusal codes now arrive on stderr (which is the substance of what r2 needed), so nothing is misstated - but a PM-agreed item is unlanded. It is the tooling branch's object, not B-NTC's. | **note - tooling** |
| **R8** | **Three of the nineteen retired memory-only cells have no successor, and they now run nowhere.** Brief 4.1 names them: `model 5` (partial - nothing asserts yesterday's plan's own as-of clock), `model 6` (subject retired, none wanted), `model 8` (no successor - nothing asserts a returned DTO cannot be written through). I verified the file still passes in Git (**19/19, exit 0**) and that its CI step is deleted. The disclosure is honest and cell-by-cell; the coverage gap is real. | **note** |
| **R9** | **Neither tooling suite has a CI home.** `execution-targets.test.cjs` **9/9**, `successor-moves.test.cjs` **8/8**, `product-phase-and-ledger.test.cjs` **7/7**, all exit 0 on my run; no `rebuild.yml` step runs any of them. The fixer names this as residual 4 and declines to add the step unasked. | **note** |
| **R10** | **The ledger ordinals have already drifted once during this review.** `rebuild/DECISIONS.md` on the chain branch was 118 lines at `9abe32e` and is **119** at `5a76fcd`, so the fix report's "119 and 120" are now **120 and 121**. Harmless, and the fixer said so in advance: I confirmed `claim()` requires only `Number.isInteger(ledgerLine) && > 0` and finds the line by `lineSha256`, so the ordinal is for a human. Set it at paste time. | **note** |

**No fail-open was found anywhere.** Every mutation I made to a refusal path turned the
package red.

---

## A. Scope and fidelity - the engine untouched, the merge clean, `.github` exactly four hunks

### A.1 The delta, and where it came from

```
$ git diff --name-status 10feb1e 3acc805 | wc -l            -> 66
$ git diff --name-status origin/rebuild/t2-client-core HEAD  -> 53   (lane B's own)
```

66 paths change from `10feb1e`; 53 of them differ from the integration tip, so **28 came in
from the tip and are byte-identical to it**, and 3 more are the deleted patch files that never
existed on the tip. I checked each of the 28 against `5c6766e` by blob sha: **0 mismatches.**
They are lane C's `rebuild/coach/**` (13), `rebuild/lanes/c/**` (5), `.claude/agents/*` (5),
`rebuild/slice/P1,P2` (2), `DECISIONS.md`, `LANES.md`. The merge brought lane C's files at the
tip's blobs and nothing else.

### A.2 The engine, the conform tree and the parent are byte-identical

```
$ git diff --stat origin/rebuild/t2-client-core HEAD -- rebuild/engine rebuild/conform
  (empty)  exit 0
$ git diff --stat origin/rebuild/t2-client-core HEAD -- \
      rebuild/m4/spec/native-carriers-package.cjs rebuild/m4/spec/acceptance-native-carriers.json \
      rebuild/m4/spec/review-native-carriers.json rebuild/m4/spec/NATIVE-CARRIERS-THEME.md
  (empty)
```

And the parent's two files are the **accepted** bytes, not merely the tip's - I took all three
anchors:

```
native-carriers-package.cjs        HEAD b26f6fb1  TIP b26f6fb1  b95ccca b26f6fb1
acceptance-native-carriers.json    HEAD 29340bd9  TIP 29340bd9  b95ccca 29340bd9
```

The parent wrapper is untouched, as `DECISIONS:113` (4) requires, and its `# pass 19` child is
still declared in it - which is precisely what lets the successors load the parent's originals
at all. The three patch files are **deleted** (`gym-host.wiring.patch`,
`gym-model.previousLine.patch`, `pass19-retirement.patch`), as :113 (4) directs.

### A.3 `.github` is `rebuild.yml` only, and exactly the four disclosed hunks

```
$ git diff --name-only origin/rebuild/t2-client-core HEAD -- .github
.github/workflows/rebuild.yml
```

One file. Its whole diff against the tip is one region, and it contains exactly four changes
and nothing else - I read every line of it:

1. **deleted** `Synthetic Today projection, UI and preview package`
   (`w7-preview/test/{model,view,package}.test.cjs`) - the `:109` pass-19 retirement that
   `:113` (3) says to keep deleted.
2. **replaced** `Cumulative extracted-engine native-carrier and legacy-census evidence`
   (`native-carriers-package.cjs --ci`) with `Cumulative B-NTC native-carrier and legacy-census
   evidence` (`b-package.cjs --ci --package B-NTC`) - the supersession :113 (3) rules correct
   and says not to restore.
3. **enumerated** the A1/A2 step into A1/A2/A3 over **seven** files, adding
   `checkin.test.mjs` and `ntc-h6-delta.test.mjs` - the `:109` enumeration.
4. **added** `C5 - the voice coach tool contract and text prototype`,
   `run: node --test "rebuild/coach/test/*.test.cjs"` - `DECISIONS:117` (4).

No fifth change. No `deploy.yml`, `slice-host.yml` or `soak.yml`, so `DECISIONS:112` (1)'s
standing rule is honoured. A4's `setup.test.mjs` is deliberately not enumerated, and I checked
the condition :117 (4) attaches to that: `git ls-tree origin/rebuild/t2-client-core
rebuild/m3/w7-preview/today/test/` has **no `setup.test.mjs`** at either tip I saw. The
exclusion is correct and the rule for seal time is written into the workflow's own comment.

### A.4 The fix report's own scope claims

R3. `git diff --name-only 10feb1e HEAD -- .github` returns `.github/workflows/rebuild.yml`,
not "(empty)"; `--stat` is 66 / 9511 / 904, not 32 / 2539 / 701; `git log --oneline 10feb1e..HEAD --
.github/workflows/rebuild.yml` names `fed830a`, a commit of this very pass. The report's other
6 claims (engine/conform empty, parent files empty) I re-ran and they hold.

### A.5 The tip moved under me, and it changed nothing

`origin/rebuild/t2-client-core` was `9abe32e` when I started and `5a76fcd` when I finished.
`git diff --name-status 9abe32e 5a76fcd` -> `M DECISIONS.md`, `M LANES.md`, `M STATUS.md`,
`A STATUS-ARCHIVE.md`. Docs only. I re-ran A.2 and A.3 against `5a76fcd`: engine and conform
still empty, parent files still empty, `.github` still `rebuild.yml` only, `setup.test.mjs`
still absent. The new line 119 is an owner efficiency ruling, unrelated to B-NTC. Only R10
follows: the two lines become `DECISIONS:120` and `:121`.

---

## B. Every one of r2's exact changes 1-13, with my own proof

I ran the proof assertion each change names, not the fixer's transcript of it.

| # | r2's change | my verdict | the proof I ran |
|---|---|---|---|
| **1** | Obtain the MOVES_RULING or withdraw the successors; teach the runner to admit a successor **only** under that id | **DONE** | `DECISIONS:113` (1) ratifies r2 E.3 as written. `B-NTC.json` `coverage.successors.ruling` = `"MOVES_RULING=DECISIONS:113 B-NTC-INHERITED-1, ratified as written in B-NTC-REVIEW-r2.md E.3, particularising DECISIONS:112 (1)"`; `coverage.moves` = `{}`; `coverage.inherited` = the nine pairs. **Both of r2's terminals met on my run:** `--ci --package B-NTC` -> `CI REVIEW-PENDING: 2 open obligation(s); public evidence only; no PASS is claimed`, **exit 2**; `--full --package B-NTC` -> `B PACKAGE B-NTC BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` (stderr), **exit 2**. And "only under that id" is enforced by name: bite **M21b** changes the cited id to `DECISIONS:999` and commits it, and the runner refuses **`SUCCESSOR-RULING-NOT-CITED`**. E, F |
| **2** | Do not ship a red CI | **RULED, provably closable, NOT closed at this head** | The child step exits **2** here, which `:113` (3) rules the correct pre-seal state while requiring exit 0 "at the sealed head". I proved the exit-0 state myself in a throwaway clone: with the two lines on the chain branch the same command terminates **`PUBLIC CI EVIDENCE PASS`, exit 0**. Every other B-NTC-owned step I ran green: A1/A2/A3 **164/164** exit 0, A0 **23/23** exit 0, C5 **64/64** exit 0. E.4 |
| **3** | Restore or justify the two deleted CI steps, in the brief | **DONE** | Brief 4 lists **all four** hunks (A.3 above matches it hunk for hunk); 4.1 names the successor evidence for the 19 tests **cell by cell** across 16 rows and names the **three** with no successor. I re-ran the retired file: **19/19, exit 0**, still in Git, no CI home. R8 |
| **3a** | *(new, `:117` (4))* give C5 a CI home | **DONE** | The step is in `rebuild.yml` verbatim as the PM wrote it. I ran exactly that command: `node --test --test-reporter=tap "rebuild/coach/test/*.test.cjs"` -> **# tests 64 / # pass 64 / # fail 0**, exit 0. `setup.test.mjs` correctly excluded (A.3). |
| **4** | Retire `# pass 19` from the wrapper, or say it is deferred | **DONE** per `:113` (4) | Parent wrapper byte-identical to the tip **and** to `b95ccca` (A.2); `B-NTC.json` declares 15 children and `browser-package` is not one; the CI step is gone; the successors are named; all three patch files deleted. |
| **5** | Correct brief 5's executable claim | **DONE** | Brief 5 is retitled "CORRECTED", withdraws the "`git apply --check` exit 0 ... One command lands it" sentence **by quoting it**, quotes r2's measured exit 1 and its error text, and states :113 (4)'s retirement with a checkable item per half. I checked each half; all four hold. |
| **6** | Get a new brief-acceptance ledger line | **OPEN by design - one paste away** | `brief.acceptedLedgerLine` is `null` and `authorizations.theme` is `null`; `status` is `PROPOSED`. Lane B did **not** set `= 113` as :113 (2) directs, and I confirmed its reason mechanically (R4). The two replacement texts exist verbatim in FIX-REPORT 4.2 and I verified them end to end (E.4). **PM action.** |
| **7** | Own the sibling breakage; correct BUILD-REPORT:146-147 | **DONE** | Measured by me: `B1` and `B2` -> `B PACKAGE Bn FAIL **PARENT-PIN-BROKEN**; required evidence missing or failed; local diagnostics withheld`, exit 1; `B3`, `B4`, `B-LOM` -> `FAIL **UNLISTED-SOURCE-CHANGE**`, exit 1. The codes now arrive on stderr; r2 needed an instrumented process. BUILD-REPORT:146 carries a `> **CORRECTED at the r2 fix head**` block that says B1 does not fail identically and fails **because of** B-NTC, with a row per code. |
| **8** | Fix the tooling regression; correct the Astra report | **DONE** | `node --test --test-reporter=tap rebuild/lanes/b/tooling/test/execution-targets.test.cjs` -> **# tests 9 / # pass 9 / # fail 0**, exit 0 on my run. It now builds its own fixture instead of reading the live spec, so it cannot drift with the children count again. No CI home (R9). |
| **9** | Re-measure the BUILD-REPORT's counts | **DONE** | BUILD-REPORT 0.5-r2 carries the re-measured table. I re-took every row (D below) and every figure in it matches mine. The brief's own 7.2 was **not** re-measured - R1. |
| **10** | Make `b-ntc-successors.test.cjs` safe | **DONE, and I proved it by killing it** | `taskkill /PID <pid> /T /F` at **1200 ms, 2500 ms and 4000 ms** of a run: `git status --porcelain -uno` was **empty before and empty after, all three times**, and the tree is at `3acc805` with an empty porcelain now. A clean-run baseline is **6/6, exit 0, 7.2 s**, and case 6 is "the checkout this suite started on is the checkout it leaves". r2's R10 is closed. |
| **11** | Cover the `rirPlan` bind window with a cell, or drop the scoping | **DONE - kept, with a cell** | Bite **M8**: unscope `rirPlan` exactly as r2's M8 did -> `ntc-h6-delta` **# fail 1**, exit 1. Bites **M8b/M8c**: the same mutation leaves `gym` **64/64 exit 0** and `adapter` **20/20 exit 0** - r2's M8/M16 reproduced exactly, and now exactly one cell notices. |
| **12** | Enumerate the retargets in `B-NTC.json`, asserted by the runner | **DONE, and there are three** | Spec table and module table are **deepEqual** (I compared them in a probe); the runner prints one `SUCCESSOR SUBSTITUTION` line per entry with its `why`; a fourth entry added to the module alone (**M10**) and a retarget weakened in the module alone (**M11**) both refuse. The brief's amendment row 9 still says "two" - R2. |
| **13** | Collapse the brief's strata or annotate 4.2 | **DONE** | Brief line 786 still carries the v1 "Refused." sentence and line 788 immediately carries `> **SUPERSEDED - read v1.2 1 and v1.3 S instead (B-NTC-REVIEW-r2 R13 / change 13).**`. The title line now reads "v1.3 - amended by lane B; acceptance line pending (BRIEF-READY)" and never "accepted". |

**Score: 11 of 13 DONE on my own proof, 1 ruled-and-provably-closable (2), 1 open for the PM
(6).** Plus `:117` (4)'s new 3a, DONE.

---

## C. The successors under `DECISIONS:113` (1) (a)-(e), and the brief-diff obligation

### C.1 The `:113` (2) reviewer obligation - the brief diff contains nothing but the amendments

This is the one thing :113 (2) asks of me by name, so I did it directly.

```
$ git cat-file blob 68fbca4:rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md
  sha256 0ba59cca3bd70383330fa59a4ae86a971108a64594933d5c6388bca6c45e16b8   56 010 B
$ git cat-file blob HEAD:rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md
  sha256 2f4dbbd7293ad24ee853097f683cf904a80e80d2f0444dae7f601d2c9081e6d9   123 977 B
```

The `:108` (a) prefix `0ba59cca` and the 56 010 B are confirmed; the head's sha and byte count
are exactly the ones lane B posts and exactly the ones carried inside LINE 2 and inside
`B-NTC.json` `brief.sha256`. The diff is **973 insertions / 159 deletions** over 39 hunks.

**Every deletion.** I read all 159 removed lines. They are: the v1 title ("PROPOSED, NOT
ACCEPTED"); the identity-by-object-identity claim and its table row (amendment 1, r1 C1); the
whole "H6 - NOT MADE, deliberately" section and its hand-written gym-host wiring block
(amendment 5, the C4 join); the old module byte counts and shas; the old 22/22, 123/123 and
129/129 figures (amendments 1, 3); the old 9.1 delta table predicting what would change "when
H6 lands" (amendment 9); the old Q2 asking whether the runner's package list should be widened,
and its `B PACKAGE USAGE REFUSED` transcript (resolved); old open items O2 and O3; and the old
4.2 reasoning that widening `EXPOSED` was "Refused" (amendment 3, and 13's SUPERSEDED block
now stands in its place). **Not one deletion removes an obligation, a refusal, a cell or a
disclosure.** Every one is superseded v1 text.

**Every addition.** The head's section list is v1.3 (S, R) + v1.2 (1, 2, 3, 4, 4.1, 5, 6) +
v1.1 + the original v1 body 0-13. Mapping the ten amendment rows onto them: row 1 -> v1.1;
rows 2, 3 -> v1.2 1-3; row 4 -> v1.2 4 hunk 3; row 5 -> v1.2 4 and H6; row 6 -> v1.3 S; row 7
-> v1.2 4, 4.1, 5; row 8 -> v1.3 S; row 9 -> v1.3 R, S and 4.2's SUPERSEDED block; row 10 ->
v1.2 4 hunk 4. **Every added section lands in a row and no added section lands outside one.**

**Verdict on the obligation: DISCHARGED.** The diff from `0ba59cca` contains nothing but the
amendments the v1.3 header table lists. R1 and R2 are two figures that are wrong **inside**
listed amendments; they are not unlisted material, but they should not be frozen by sha.

### C.2 The nine, proved: (b) two anchors, and they agree

I wrote a read-only probe outside the repository that requires the successor module and takes
all three anchors for every original it can load - the ten carriers plus SUPPORT, BRIDGE,
PROFILE and PROFILE_TESTS:

```
OK  native-carriers-traces.cjs                disk=c0d86fc3f151  pin=c0d86fc3f151  b95ccca=c0d86fc3f151
OK  native-carriers-direct.cjs                disk=e48a8545667f  pin=e48a8545667f  b95ccca=e48a8545667f
OK  native-carriers-legacy.cjs                disk=21c078c326cb  pin=21c078c326cb  b95ccca=21c078c326cb
OK  native-carriers-witnesses.cjs             disk=dde7f2fdb536  pin=dde7f2fdb536  b95ccca=dde7f2fdb536
OK  native-carriers-cases.cjs                 disk=d9e74be7aa15  pin=d9e74be7aa15  b95ccca=d9e74be7aa15
OK  native-carriers-source-carriers.cjs       disk=83254f0a9261  pin=83254f0a9261  b95ccca=83254f0a9261
OK  native-carriers-inherited-carriers.cjs    disk=a68964c73505  pin=a68964c73505  b95ccca=a68964c73505
OK  native-carriers-defect-witnesses.cjs      disk=4540e4a9f278  pin=4540e4a9f278  b95ccca=4540e4a9f278
OK  native-carriers-writers-differential.cjs  disk=8d5aef85c7b0  pin=8d5aef85c7b0  b95ccca=8d5aef85c7b0
OK  native-carriers-second-gate.cjs           disk=d518bb866ad7  pin=d518bb866ad7  b95ccca=d518bb866ad7
OK  native-carriers-source.cjs                disk=e16228d89c78  pin=e16228d89c78  b95ccca=e16228d89c78
OK  native-carriers-parent-source.cjs         disk=7c1bd1d5c6eb  pin=7c1bd1d5c6eb  b95ccca=7c1bd1d5c6eb
OK  native-carriers-profile.cjs               disk=a99fab0f8da1  pin=a99fab0f8da1  b95ccca=a99fab0f8da1
OK  native-carriers-profile.test.cjs          disk=95ef170a49de  pin=95ef170a49de  b95ccca=95ef170a49de
P1 mismatches=0 over 14 originals
```

`pin` is the parent artifact's own `executionPins` entry; `b95ccca` is
`git cat-file blob b95ccca879e371b5ba225ad12cae612ec89469ba:<path>`. **Condition (b)'s two
independent anchors hold for every original, with zero mismatches.**

### C.3 (c) The compiled body differs from the original ONLY by the enumerated table

The fixer says three substitutions; my dispatch said "exactly the two pin re-targets", and
r2 E.3 / `DECISIONS:113` (1) (c) names "two at 71fb2f1" parenthetically. **I measured the
difference itself rather than counting entries.** For each of the fourteen originals I applied
the module's own `SUBSTITUTIONS` table to the parent's bytes and diffed the result against the
parent's bytes line by line:

```
OK  native-carriers-witnesses.cjs   changed-lines=1  enumerated=1
OK  native-carriers-cases.cjs       changed-lines=1  enumerated=1
OK  native-carriers-source.cjs      changed-lines=1  enumerated=1
OK  (the other eleven)              changed-lines=0  enumerated=0
P3 violations=0
```

**Three lines change in the whole corpus, and each one is an enumerated entry. Nothing else
is substituted.** Line counts are equal on every file, so nothing is inserted or deleted
either. The spec's `coverage.successors.substitutions` and the module's `SUBSTITUTIONS` are
`deepEqual` (`spec count=3 module count=3 deepEqual=true`), and the runner prints all three
verbatim with their reasons.

**On "two" versus "three", my ruling on the evidence.** :113 (1) (c)'s normative clause is
"the only text substitution permitted is a pin re-target made necessary by a declared
`superseded-by-child` product path, every such substitution enumerated verbatim in the package
spec and in the review"; "(two at 71fb2f1)" is a parenthetical description of the state r2
measured, not a cap. All three are pin re-targets forced by `engine-runtime.cjs`, which the
spec declares `role: "superseded-by-child"`: the SUPPORT one swaps that file's own sha, the
witnesses one re-targets the `EXPOSED` expectation that `:109` PATH A widened, the cases one
re-targets the mutant detector onto the child's copy of the test that reads the widened
surface. r2 E.1 recorded the SUPPORT one separately from E.2's two, which is exactly why the
count reads differently. **Three is correct and is fully disclosed; the brief's amendment
table is the only place that still says two (R2).**

**And the fourth Astra substitution is gone.** My dispatch asked me to confirm that
`require.main === module -> true` was removed. It is: `b-ntc-successors.cjs`'s header says so
in terms ("NO CLI-GUARD REWRITE ... a fourth text substitution, and not a pin re-target, so
DECISIONS:113 (1) (c) does not permit it"), and the mechanism that replaced it is
`compile(..., asMain)`, which makes the entry module `process.mainModule` for the duration of
its own compile and restores it in a `finally`. The guard is answered, not edited. My P3 diff
is the independent proof: if the guard were being rewritten, that line would show as a
non-enumerated change, and no file shows one.

### C.4 (c) again - where the two gate-body substitutions can actually reach

r2's R12 said a weakening of either gate-body retarget could only be caught by a reviewer. It
is worth recording where they land, because the runner's own `SUCCESSOR` lines answer it:

```
SUCCESSOR witnesses   <- b-ntc-witnesses.cjs   ... 1 substitution(s) ... carries no inherited gate
SUCCESSOR cases       <- b-ntc-cases.cjs       ... 1 substitution(s) ... carries no inherited gate
SUCCESSOR source-carriers       ... 0 substitution(s); carries migrate-source merge-source writers-source
SUCCESSOR inherited-carriers    ... 0 substitution(s); carries witnesses-2 witnesses-5 migrate-differential
SUCCESSOR defect-witnesses      ... 0 substitution(s); carries witnesses-7
SUCCESSOR writers-differential  ... 0 substitution(s); carries writers-differential
SUCCESSOR second-gate           ... 0 substitution(s); carries second-gate
```

**All nine inherited gates run their parent's original with zero substitutions.** The only
substitution in their dependency graph is the shared SUPPORT pin re-target, which is the one
condition (c) is literally about and which is a sha swap, not an assertion change. The two
assertion retargets sit on `witnesses` and `cases`, which carry no inherited gate at all.

### C.5 (b) Nothing enters `require.cache`, and (d) the child never inherits `accepted`

My probe called `S.preflight()` and then read the cache:

```
B-NTC ARCHIVED PARENT VERIFIED; the two superseded execution pins read at b95ccca...; this is not child acceptance
B-NTC ACTUAL CHILD VERIFIED; the parent source construction and all of its assertions, with the one
  enumerated SUPPORT pin re-target; candidate code reads disk
require.cache entries before preflight=5 after=17
originals present in require.cache: NONE
any native-carriers-* in cache: NONE
```

Twelve modules were loaded during the preflight and **not one of them is a parent original**;
no `native-carriers-*` path is in the cache at all. `compile()` builds a `new Module(...)` and
calls `m._compile` with an injected resolver, so no private compilation can ever become the
module a later `require()` returns. **Condition (b)'s cache clause holds.**

Condition (d): `run()` answers an original gate's request for its parent profile with
`{ ...parent, accepted: false, root }`, and the two-stage preflight asserts
`parent.accepted === true` for the **archived** parent before the child's own state is looked
at. Bite **M18** flips that `false` to `true` and `b-ntc-successors.test.cjs` goes **# fail 1,
exit 1**. The child cannot inherit the parent's acceptance, and the gate proves it.

### C.6 It LOADS, it does not copy - and a copy is refused

```
OK  b-ntc-traces.cjs                bytes=576  original-lines-present=0/58
OK  b-ntc-direct.cjs                bytes=576  original-lines-present=0/79
OK  b-ntc-legacy.cjs                bytes=576  original-lines-present=0/47
OK  b-ntc-witnesses.cjs             bytes=585  original-lines-present=0/31
OK  b-ntc-cases.cjs                 bytes=573  original-lines-present=0/52
OK  b-ntc-source-carriers.cjs       bytes=603  original-lines-present=0/116
OK  b-ntc-inherited-carriers.cjs    bytes=612  original-lines-present=0/26
OK  b-ntc-defect-witnesses.cjs      bytes=606  original-lines-present=0/37
OK  b-ntc-writers-differential.cjs  bytes=618  original-lines-present=0/24
OK  b-ntc-second-gate.cjs           bytes=591  original-lines-present=0/23
P5 successors containing original text=0
```

Each successor is a ~600-byte file that names its original as a **literal path** and calls
`run(name)`. Not one substantive line of any original appears in any of them. And the three
failure modes my dispatch asked me to force all refuse:

* **a dropped assertion in a scratch copy of an original** (bite **M14**: replace the
  `EXPOSED` `deepEqual` in `native-carriers-witnesses.cjs` with `assert.ok(true, ...)`) ->
  `node rebuild/m4/spec/b-ntc-witnesses.cjs` **exit 1**, `AssertionError`. The disk sha no
  longer equals the pin, so the original is refused before it runs.
* **a copy named instead of the parent's own original** (bite **M13**: point
  `ORIGINALS['second-gate']` at the lane-B file `b-ntc-native-next-targets.test.cjs`) ->
  **exit 1**, `AssertionError`. A file the parent does not pin has no `executionPins` entry
  and cannot be loaded as an original.
* **a successor that skips** (bite **M12**: drop `second-gate` from `ORIGINALS`) -> **exit
  1**, `AssertionError [ERR_ASSERTION]: Closed successor name second-gate`.

And the Git anchor is load-bearing, not decorative: deleting the
`bytes.equals(L.object(root, PARENT_ACCEPTANCE_COMMIT, file))` line (bite **M17**) turns
`b-ntc-successors.test.cjs` **# fail 1, exit 1**.

### C.7 (a) and (e), refused by name

Committed in the clone so the spec-bytes check could not mask the semantic one:

```
M20b  coverage.moves = { "second-gate": ... }   -> B PACKAGE B-NTC FAIL COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING  exit 1
M21b  ruling id -> MOVES_RULING=DECISIONS:999   -> B PACKAGE B-NTC FAIL SUCCESSOR-RULING-NOT-CITED                  exit 1
```

**Conditions (a) and (e) are enforced by the runner, by name, at this head.** That is exactly
what r2's change 1 asked the tooling to be taught, and it is taught.

---

## D. The provider and the obligations - spot re-check, every figure my own

r2's B-D did the full job on the provider and I did not repeat it; I re-took every count and
drove the fail-closed paths by mutation (F).

| what | command | measured by me | fixer's claim |
|---|---|---|---|
| provider cells | `node --test --test-reporter=tap rebuild/m4/workout/test/native-trend-context.test.cjs` | **39 / 39 / 0**, exit 0 | 39/39 **agrees** (brief 7.2 still says 36/36 - R1) |
| adapter | each alone | **20 / 20 / 0**, exit 0 | 20 agrees |
| checkin | each alone | **28 / 28 / 0**, exit 0 | 28 agrees |
| design | each alone | **11 / 11 / 0**, exit 0 | 11 agrees |
| gym | each alone | **64 / 64 / 0**, exit 0 | 64 agrees |
| ntc-h6-delta | each alone | **8 / 8 / 0**, exit 0 | 8 agrees |
| package | each alone | **10 / 10 / 0**, exit 0 | 10 agrees |
| view | each alone | **23 / 23 / 0**, exit 0 | 23 agrees |
| the seven as the CI step runs them | the `rebuild.yml` A1/A2/A3 command, verbatim | **164 / 164 / 0**, exit 0 | 164/164 **agrees** |
| A0 journey + equivalence | `node --test --test-reporter=tap .../journey.test.mjs .../engine-equivalence.test.cjs` | **23 / 23 / 0**, exit 0 | 23 agrees |
| profile refusals | `node --test --test-reporter=tap rebuild/m4/spec/b-ntc-profile-refusals.test.cjs` | **13 / 13 / 0**, exit 0 | 13 agrees |
| successor child-pin refusals | `node --test --test-reporter=tap rebuild/m4/spec/b-ntc-successors.test.cjs` (alone) | **6 / 6 / 0**, exit 0, 7.2 s | 6 agrees |
| focused | `node rebuild/m4/spec/b-ntc-focused.cjs` | `B-NTC FOCUSED: **15/15 PASS**; original assertions and actual child runtime`, exit 0 | agrees |
| durable journeys | `node rebuild/m4/spec/b-ntc-journeys.cjs` | `B-NTC DURABLE JOURNEYS: **238/238 PASS**; Today, gym, check-in, default-provider multi-day, host equivalence and one-store joins`, exit 0 | agrees |
| the C5 CI step | `node --test --test-reporter=tap "rebuild/coach/test/*.test.cjs"` | **64 / 64 / 0**, exit 0 | 64 agrees |
| the retired 19 | `node --test --test-reporter=tap rebuild/m3/w7-preview/test/{model,view,package}.test.cjs` | **19 / 19 / 0**, exit 0 | 19 agrees |
| tooling: execution targets | `node --test rebuild/lanes/b/tooling/test/execution-targets.test.cjs` | **9 / 9 / 0**, exit 0 | 9/9 agrees (r2's R8 closed) |
| tooling: successor moves | `node --test rebuild/lanes/b/tooling/test/successor-moves.test.cjs` | **8 / 8 / 0**, exit 0 | - |
| tooling: product phase and ledger | `node --test rebuild/lanes/b/tooling/test/product-phase-and-ledger.test.cjs` | **7 / 7 / 0**, exit 0 | - |

**Every count the fixer reports is reproducible on my run. Not one figure is overstated.**
`b-ntc-successors.test.cjs` wrote no tracked byte in any run, killed or not (B change 10).

### D.1 The 4.1 successor-evidence mapping is honest

I counted it against the retired file's own nineteen. Brief 4.1 maps sixteen rows
(`model 1-2, 3, 4, 7`; `view 1-2, 3, 4, 5`; `package 1-6`) onto named durable cells, and then
says in bold: "**Three of the nineteen have NO successor, and lane B says so rather than
claiming fifteen-out-of-fifteen**" - `model 5` (partial: nothing asserts yesterday's plan's
own as-of clock), `model 6` (subject retired, none wanted), `model 8` (nothing asserts a
returned DTO cannot be written through). That is exactly the three the fixer's residual 1
names, and it is exactly the three I would have named. The section also volunteers a
behaviour change found while re-authoring (A2's "a SECOND session on the same day is refused"
cell was resting on the provider gap, and is re-authored onto the guard that actually holds).
**The mapping is honest and the disclosure is better than r2's change 3 asked for.**

---

## E. The gates

### E.1 The 45-law register - unmoved

```
$ ENGINE_MAIN/ENGINE_OLD from rebuild/conform/engines/ ; node rebuild/conform/v4/run-defect-laws.cjs
TOTAL 45 laws . 45 RED-frozen . 39 RED-candidate . 89 GREEN repair controls .
97/104 mutant executions DETECTED . 0 HARNESS_ERROR . AUDIT RED-FIRST FAIL      exit 1
```

**45 RED-frozen / 39 RED-candidate / 0 HARNESS_ERROR - identical to the figure r1 and r2
measured on the base.** The register has not moved, which is what is required of a package
that declares no D-id. The runner reports the same row independently and correctly adds that
these rows are the register BASELINE and prove nothing about it.

### E.2 The public census - byte-identical to base

```
$ node rebuild/conform/run.cjs
SUITE INCONSISTENT - 99 reference GREEN . 99 STRONG . 29 RED-first against absent families
                     . 70 GREEN against present families                        exit 1
```

Character-for-character the line r1 and r2 measured. It could not have moved (A.2).

### E.3 `--ci --package B-NTC` - every line, and the exit

197 s, stdout 61 lines. Quoting in full would be unreadable; here is every line by its head,
with the full text of the ones that carry a verdict. **Nothing is elided from the terminal
block.**

```
B PACKAGE B-NTC SPEC OBSERVED packages/B-NTC.json aa70cf5a6d65e8fe...; runner 6875576097c3...
  byte-identical on disk and in Git at HEAD; status=PROPOSED; 0 D-ids ; 53 declared product
  files; 15 declared child(ren), argv file-first under 7 fixed root(s) with only --test
  --test-reporter=tap permitted; 0 declared move(s) ... (moves are refused outright under this
  runner - TOOLING-REVIEW-r3 X1); 10 successor carrier(s) declared under
  MOVES_RULING=DECISIONS:113 B-NTC-INHERITED-1 ... with 3 enumerated substitution(s), each
  proved against the parent original in coverage()
B PACKAGE B-NTC PARENT OPTION NATIVE-CARRIERS ... e940359b... ACCEPTED at b95ccca... (DECISIONS:104)
B PACKAGE B-NTC PARENT BOUND NATIVE-CARRIERS ... single-parent chain holds
B PACKAGE B-NTC POSTFIX M2-B-NTC-NATIVE-TREND-CONTEXT REVIEW-PENDING mode=--ci
B PACKAGE B-NTC ENVELOPE ABSENT; ... is not sealed yet - no PASS word is available
B PACKAGE B-NTC PARENT PINS RE-ASSERTED at run time; 29 pin(s) ... and 23 un-superseded
  grandparent pin(s) ... byte-identical on disk AND in Git at HEAD; 22 superseded pin(s)
  preserved in Git at sourceBase 7b1678a; parent artifact byte-identical in Git at b95ccca
B PACKAGE B-NTC PRODUCT IMPLEMENTED; 33 at the declared post-image / 0 at the pinned pre-image
  / 20 carried byte-identical from the parent / 0 unlisted drift; the inventory covers all 20
  parent-pinned product files; 2 declared role "superseded-by-child" over a parent EXECUTION
  pin, each equal to the parent byte (rebuild/m4/workout/engine-runtime.cjs
  .github/workflows/rebuild.yml)
B PACKAGE B-NTC FIDELITY OBSERVED; sourceBase 7b1678a ancestor of HEAD 3acc805; 30 files
  changed since sourceBase, all in the fixed inventory; 16 of 18 PIN_PATHS present ... 2 vacuous
B PACKAGE B-NTC AUTHORITY OBSERVED owner DECISIONS:60 and contract DECISIONS:49 present as
  exact ledger line bytes at the parent receipt base b045e61 under their own roles; contract
  inherited byte-equal from the parent; theme NULL - no PASS word is available; brief
  acceptance NULL - the obligation stays open; this package's own two lines are resolved on
  the chain branch, not at its parent's receipt base
B PACKAGE B-NTC PROTECTED SURFACES 4 declared ... (the four rebuild.yml hunks, quoted, and
  A4's setup.test.mjs explicitly NOT enumerated because it is not on the tip)
B PACKAGE B-NTC PRIVATE LIVE-TRIGGERED none
B PACKAGE B-NTC LAWS 45/45 executed | TOTAL 45 laws . 45 RED-frozen . 39 RED-candidate . 89
  GREEN repair controls . 97/104 mutant executions DETECTED . 0 HARNESS_ERROR . AUDIT RED-FIRST FAIL
B PACKAGE B-NTC LAWS DECLARED-STATE 45/45 rows agree with the spec at product phase IMPLEMENTED
B PACKAGE B-NTC CARRIERS NONE DECLARED; 0 witness flip(s) declared
B PACKAGE B-NTC CHILD <15 lines>  traces, direct, legacy, witnesses, cases, source-carriers,
  inherited-carriers, defect-witnesses, writers-differential, second-gate, ntc-provider-cells,
  focused, durable-journeys, profile-refusals, child-pin-refusals - each "OBSERVED; exit 0,
  N bytes of stdout, exact declared verdict at line start"
B PACKAGE B-NTC SUCCESSORS 10 declared successor executable(s) PROVED against the parent
  original, of which 9 carry an inherited gate under MOVES_RULING=DECISIONS:113 ...;
  coverage.moves stays {} and X1 is unwidened; each successor LOADS the parent carrier's own
  original, byte-equal to the parent execution pin AND to the Git blob at b95ccca ..., contains
  none of its lines, replaces only through the declared table, and prints the parent's own
  accepted verdict in full; 3 enumerated substitution(s)
B PACKAGE B-NTC SUCCESSOR <10 lines>       (quoted in C.4)
B PACKAGE B-NTC SUCCESSOR SUBSTITUTION <3 lines>   (the three of C.3, verbatim with reasons)
B PACKAGE B-NTC COVERAGE <9 lines>         one per inherited gate, naming its successor
B PACKAGE B-NTC NO-REGISTER OBLIGATION ... 15 of 15 declared child(ren) ... ran in this
  process, exit 0 ... 1 required at the seal
B PACKAGE B-NTC OPEN theme ledger line accepting this brief is null (THEME-AUTHORIZATION-UNAVAILABLE before any receipt)
B PACKAGE B-NTC OPEN brief rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md not accepted by a PM ledger line
B PACKAGE B-NTC OPEN closed cumulative profile not sealed
B PACKAGE B-NTC CI REVIEW-PENDING: 2 open obligation(s); public evidence only; no PASS is claimed
EXIT=2        git status --porcelain -> (empty)
```

**`PRODUCT IMPLEMENTED 33/0/20/0`, OPEN theme, OPEN brief, OPEN seal, `CI REVIEW-PENDING: 2
open obligation(s)`, exit 2** - exactly what the fixer reports, and exactly r2's change-1
first proof. The opaque `FAIL` r2 met is gone; the third blocking obligation r2's tooling
review saw (`product PARTIAL`) is gone too, and `PRODUCT` now reads IMPLEMENTED.

### E.4 `--full`, the siblings, and the throwaway chain

```
$ node rebuild/lanes/b/tooling/b-package.cjs --full --package B-NTC          (201 s)
... the same fifteen children OBSERVED, the same nine gates carried ...
B PACKAGE B-NTC BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING                 (stderr)
EXIT=2        git status --porcelain -> (empty)
```

`rebuild/conform/private` does not exist in this worktree; I never sought it and never created
it. **r2's change-1 second proof is met**, and the standing `DECISIONS:97` BLOCKED terminal is
producible for this package id.

```
$ ... --ci --package B1     -> B PACKAGE B1 FAIL PARENT-PIN-BROKEN; ...       EXIT=1
$ ... --ci --package B2     -> B PACKAGE B2 FAIL PARENT-PIN-BROKEN; ...       EXIT=1
$ ... --ci --package B3     -> B PACKAGE B3 FAIL UNLISTED-SOURCE-CHANGE; ...  EXIT=1
$ ... --ci --package B4     -> B PACKAGE B4 FAIL UNLISTED-SOURCE-CHANGE; ...  EXIT=1
$ ... --ci --package B-LOM  -> B PACKAGE B-LOM FAIL UNLISTED-SOURCE-CHANGE; ... EXIT=1
```

The named codes, on stderr, exactly as r2's R7 found and as `:113` (6) assigns to each
sibling's own rebase.

**The throwaway chain, built and run by me, not read from the fix report.** A
`git clone --shared` of the repository into my scratch directory, detached at `3acc805`, with
the gitignored build outputs supplied from my own worktree (the two `rebuild/conform/engines`
files, the `.tmp` reference packet, and junctions for `rebuild/m3/w5|w6/node_modules`; a fresh
clone cannot run these gates without them, which is an environment fact and not a defect - I
confirmed the clone reproduces the baseline `b-ntc-successors.test.cjs` **6/6 exit 0** before
using it). I then extracted the two ledger lines **from the fenced blocks of FIX-REPORT 4.2 by
regular expression**, so the bytes I appended are the bytes the fix report publishes:

```
LINE1 bytes=625  sha256=3ca8bf169fe96f3cd0ec51ea68b1406e76fdaa11d67e38cadb0559319d272384
LINE2 bytes=696  sha256=9ef5acf15a78bb6ffb538a4c13dd23e900cb37e01c59d4bdfb8497eaf9ee1df4
```

**Both hashes are exactly the two the fix report posts.** I made a probe commit = the real tip
`5c6766e` plus those two lines appended, pointed the clone's own
`refs/remotes/origin/rebuild/t2-client-core` at it, and committed a `B-NTC.json` citing both
with those `lineSha256` values.

The ordinals came out **119 (theme) and 120 (brief)** - the real ones for that tip, and exactly
what the fix report predicts. The runner also taught me something the fix report does not
mention: with the citations set and `status` left at `PROPOSED` it refuses
**`BRIEF-ACCEPTANCE-STATUS`**, so the `status` flip to `BRIEF-ACCEPTED` is not cosmetic. With
both done:

```
B PACKAGE B-NTC AUTHORITY OBSERVED owner DECISIONS:60 and contract DECISIONS:49 present as exact
  ledger line bytes at the parent receipt base b045e61 under their own roles; contract inherited
  byte-equal from the parent; theme DECISIONS:119 found in Git on
  refs/remotes/origin/rebuild/t2-client-core; brief acceptance DECISIONS:120 found in Git on
  refs/remotes/origin/rebuild/t2-client-core; this package's own two lines are resolved on the
  chain branch, not at its parent's receipt base - they are written after the parent was sealed
  and could never be found there
...
B PACKAGE B-NTC OPEN closed cumulative profile not sealed
B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict; the 19
  original gates, the private oracle and independent exact-artifact acceptance remain separate,
  and POSTFIX PACKAGE PASS is unavailable on this mode at any time
EXIT=0                                                                        (192 s)
```

**Reproduced: `PUBLIC CI EVIDENCE PASS`, exit 0, the unsealed artifact the only `OPEN`.** The
two obligations shrink to exactly the seal, and `:113` (3)'s "the child step exits 0 on both
runners at the sealed head" is reachable. **This is why the answer to sealability is YES.**

**The sha binding, proved by one character.** I amended the probe-chain commit to change
`(123977 bytes)` to `(123978 bytes)` inside LINE 2 - one character, in prose, in a line whose
own `lineSha256` the spec cites - and re-ran:

```
... SPEC OBSERVED / PARENT OPTION / PARENT BOUND / POSTFIX / ENVELOPE / PARENT PINS /
    PRODUCT IMPLEMENTED / FIDELITY OBSERVED        (8 lines of stdout)
B PACKAGE B-NTC FAIL; required evidence missing or failed; local diagnostics withheld
EXIT=1
```

It stops at `authority()` - `FIDELITY OBSERVED` is the last line printed and `AUTHORITY` never
appears. **The line is found by its sha256, not by its ordinal or its prose, and one byte
breaks it.** I also confirmed the converse from the runner's source: `claim()` requires only
`Number.isInteger(v.ledgerLine) && v.ledgerLine > 0`, so the ordinal drift of R10 is harmless.

**And the two texts satisfy the shape the runner demands, which `DECISIONS:113` itself does
not.** `spec()` requires the theme line to contain the packageId and end ` - ACCEPTED`
(`b-package.cjs:598`), and the brief-acceptance line to contain the packageId **and** the
brief path **and** end in the ACCEPT terminal word (`:461-462`). Measured on line 113 as it
stands on the chain branch: contains `M2-B-NTC-NATIVE-TREND-CONTEXT` -> **false**; contains
the brief path -> **false**; ends ` - ACCEPTED` -> **false**; matches the ACCEPT regex ->
**false**; its last characters are `.../B-NTC-REVIEW-r2.md - RULED`. **All four fail. Lane B's
refusal to set `acceptedLedgerLine = 113` is mechanically correct** (R4). The clone and its
junctions were removed; the real `origin/rebuild/t2-client-core` was never written to, and
both lane worktrees are at their own heads.

---

## F. The reviewer's own bites - 24 mutations, 22 RED as expected, 2 GREEN controls

Every bite ran in the throwaway clone, never in the review worktree. The harness recorded the
file's sha256 before, applied one exact textual substitution, ran the named command, restored
the file and `git checkout --` it, then re-took the sha256. **Every restoration verified
identical, and `git status --porcelain -uno` was empty after every batch.**

### F.1 The provider's fail-closed paths (`rebuild/m4/workout/native-trend-context.cjs`, sha256 `f300f3f2855f9878...`)

Command for all seven: `node --test --test-reporter=tap rebuild/m4/workout/test/native-trend-context.test.cjs`.

| bite | the mutation | expected | observed | restored |
|---|---|---|---|---|
| **M1** | the `bindingDigest` re-check that replaced r1's F1 identity claim is neutered (`if (bindingDigest(bound) !== digest)` -> `if (false)`) | RED | **exit 1, # fail 1**, AssertionError | yes |
| **M2** | a request outside any preparation is answered (`if (!bound) unqualified('no_bound_source_facts')` -> `if (false)`) | RED | **exit 1, # fail 5** | yes |
| **M3** | the `source_revision` correspondence check removed | RED | **exit 1, # fail 1** | yes |
| **M4** | Start uniqueness inside the bound facts no longer required (`!== 1` -> `=== 0`) | RED | **exit 1, # fail 1** | yes |
| **M5** | two pace holders that DISAGREE are accepted (r1 F6) | RED | **exit 1, # fail 1** | yes |
| **M6** | an unrecognised pace label read as not-rushed instead of refused | RED | **exit 1, # fail 2** | yes |
| **M7** | `cleanAtDate`'s non-boolean answer accepted instead of refused | RED | **exit 1, # fail 1** | yes |

### F.2 The H6 bind windows (`rebuild/m3/w6/local/today-bindings.mjs`, sha256 `b243257a746f879a...`)

| bite | the mutation | expected | observed | restored |
|---|---|---|---|---|
| **M8** | `rirPlan` unscoped, exactly as r2's M8 | RED on `ntc-h6-delta` | **exit 1, # fail 1** (`B-NTC G8`) | yes |
| **M8b** | the SAME mutation, measured on `gym` | **GREEN** (r2's finding) | **exit 0, # fail 0** (64/64) | yes |
| **M8c** | the SAME mutation, measured on `adapter` | **GREEN** (r2's finding) | **exit 0, # fail 0** (20/20) | yes |
| **M9** | the `genSession` window around `readPrevious` removed (r1 F3) | RED on `gym` | **exit 1, # fail 4** | yes |

M8b and M8c are the two deliberate GREEN controls. They reproduce r2's R11 exactly - gym,
adapter and the A0 journey do **not** notice the `rirPlan` unscoping - and they are what makes
M8 meaningful: `B-NTC G8` is the only cell in the tree that notices, and r2's change 11 is
therefore genuinely discharged rather than nominally.

### F.3 The successor mechanism (`rebuild/m4/spec/b-ntc-successors.cjs`, sha256 `2efe4a480f952a58...`)

| bite | the mutation | command | expected | observed | restored |
|---|---|---|---|---|---|
| **M10** | a FOURTH substitution added to the module and not to the spec | `b-ntc-successors.test.cjs` | RED | **exit 1, # fail 2** | yes |
| **M11** | the witnesses retarget WEAKENED (exact `deepEqual` -> `assert.ok(length >= 2)`) | `b-ntc-successors.test.cjs` | RED | **exit 1, # fail 2** | yes |
| **M12** | one of the nine gates SKIPPED (`second-gate` dropped from `ORIGINALS`) | `b-ntc-second-gate.cjs` | RED | **exit 1**, `Closed successor name second-gate` | yes |
| **M13** | a COPY named instead of the parent's own original (a lane-B file) | `b-ntc-second-gate.cjs` | RED | **exit 1**, AssertionError | yes |
| **M17** | the Git-blob anchor at `b95ccca` deleted | `b-ntc-successors.test.cjs` | RED | **exit 1, # fail 1** | yes |
| **M18** | the child inherits the parent's `accepted` (condition d) | `b-ntc-successors.test.cjs` | RED | **exit 1, # fail 1** | yes |

### F.4 The originals, the spec, the brief and the workflow

| bite | the mutation | command | expected | observed | restored (sha256) |
|---|---|---|---|---|---|
| **M14** | one assertion DROPPED from the parent's own `native-carriers-witnesses.cjs` on disk | `b-ntc-witnesses.cjs` | RED | **exit 1**, AssertionError | `dde7f2fdb5366914` -> same |
| **M16** | `rebuild.yml` tampered: `checkin.test.mjs` dropped from the enumerated step | `b-ntc-successors.test.cjs` | RED | **exit 1, # fail 1** | `839a79ab2eecb025` -> same |
| **M15** | the brief sha256 in the spec changed by one character | `b-ntc-successors.test.cjs` | RED | **exit 0 - NOT the gate for it** | `aa70cf5a6d65e8fe` -> same |
| **M15b** | the SAME mutation, measured on the package runner | `b-package.cjs --ci --package B-NTC` | RED | **exit 1**, `FAIL SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT` | same |
| **M19b** | the BRIEF itself changed by one character, committed | `b-package.cjs --ci --package B-NTC` | RED | **exit 1**, FAIL | `2F4DBBD7293AD24E` -> same |
| **M20b** | `coverage.moves` no longer `{}`, committed (condition a) | `b-package.cjs --ci --package B-NTC` | RED | **exit 1**, `FAIL COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING` | same |
| **M21b** | the MOVES_RULING id changed to `DECISIONS:999`, committed (condition e) | `b-package.cjs --ci --package B-NTC` | RED | **exit 1**, `FAIL SUCCESSOR-RULING-NOT-CITED` | same |

**M15 is the one row that did not go red, and it is not a defect: I pointed it at the wrong
gate.** `b-ntc-successors.test.cjs` does not read the brief's sha; `b-package.cjs` `spec()`
does, and M15b proves it refuses. I record the miss rather than quietly deleting it, because a
reviewer's table should show what was tried, not only what worked. The lesson is real: the
brief sha binding lives in the package runner alone, so a lane that edits the brief without
re-running the runner will not be told by any `node --test`.

**Plus the three kill proofs** of B change 10 (`taskkill /T /F` at 1200 / 2500 / 4000 ms,
porcelain empty before and after each), which are mutations of a different kind and are
reported there.

---

## G. The fixer's residuals - which may ride to the seal, and which may not

`FIX-REPORT-B-NTC-r2.md` 5 carries six. My disposition:

| # | residual | may it ride to the seal? |
|---|---|---|
| **1** | Three of the nineteen retired memory-only cells have no successor (`model 5` partial, `model 6`, `model 8`) | **YES.** `DECISIONS:113` (3) rules the step deleted and says not to restore it, and the brief names the three cell by cell rather than claiming coverage it does not have. The subjects are the memory-only preview model, which the durable world replaced; `model 6`'s property does not exist in the durable world at all. It should be carried as a named register item for whoever owns w7-preview next, not as a B-NTC defect. |
| **2** | The three substitutions are trusted, not proven against a same-commit weakening of module **and** spec | **YES.** This is r2's R12 and it is irreducible: any table-driven mechanism can be defeated by editing the table and its consumer together. What has changed since r2 is that the blast radius is now measured (C.4: the two assertion retargets touch **no** inherited gate) and the single-sided cases are all caught (M10, M11). The residual is correctly stated and is a reviewer's duty, not a machine's. |
| **3** | `rirPlan`'s window is covered structurally, not behaviourally | **YES.** r2's change 11 offered "a cell, or drop the scoping"; lane B kept the scoping and added the cell, and I proved the cell bites (M8) and that nothing else does (M8b, M8c). The brief's v1.3 R gives the source lines for why `rirPlan` reaches no trend-context call on any path this product drives. Nothing further is owed. |
| **4** | Neither tooling suite has a CI home | **YES, but name it.** All three suites are green on my run (9/9, 8/8, 7/7) and none is executed by CI. Adding the step is a `.github` edit that `DECISIONS:112` (1) permits only inside a re-pinning engine package - which this is - so it **could** ride. Lane B declines to take it unasked, which is the right instinct given that `.github` is the surface r2 flagged. **This is the one residual I would put to the PM as a yes/no now** rather than defer, because the next package to re-pin `rebuild.yml` may be several seals away, and until then the suite that guards the successor mechanism runs only when a human remembers. |
| **5** | Every qualified answer for both athletes is still `{hard:false, rushed:false, debt:false}` | **YES.** 28 well-formed nights and no events produce no debt and no hard day, so the engine's varying branches have no varying real path through the product yet. That is a property of the fixture, not of the provider, and the provider refuses rather than guessing whenever it cannot prove a flag. It is r1's residual 3 and r2's residual 7, unchanged, and it belongs to whichever package first ships a real event or a short night. |
| **6** | `run-current-head.cjs --all` does not run in this worktree | **YES.** Pre-existing environment prerequisite (it `git archive`s into a sibling R1 checkout that does not exist here), not B-NTC's, and not attempted by me either. r2's R14, unchanged. |

**One residual the fixer does not list, and I do:** `DECISIONS:113` (7) agreed `--explain` for
the r5 tooling fix and the runner at this head has none (R7). No document claims otherwise, so
nothing is false; but a PM-agreed item is unlanded and it is the tooling branch's to land or
to withdraw.

---

## The exact changes

**None of these touches code, a test, a gate, the workflow or the successor mechanism. All
three are corrections to prose that is about to be frozen by sha256 or that misreports a
measurement.**

1. **Correct brief 7.2's count.** `BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md:1225` reads "**36/36
   PASS** (v1 had 22)"; the head measures **39/39**. Fix the heading and whatever cell
   accounting under it makes 36, so the brief agrees with `BUILD-REPORT-B-NTC.md` 0.5-r2 and
   with `FIX-REPORT-B-NTC-r2.md` 2, which both already say 39.
   *Proof:* `node --test --test-reporter=tap rebuild/m4/workout/test/native-trend-context.test.cjs`
   -> `# tests 39 / # pass 39 / # fail 0`, exit 0, and the brief states that figure.
2. **Correct the v1.3 amendment table, row 9: "two retargets" -> "three".**
   `BRIEF-...md:26`. The spec, the module, the runner and the brief's own v1.3 S all say
   three, and row 9 is the list `DECISIONS:113` (2) directs the r3 reviewer to check the diff
   against. *Proof:* the row says three, and `node -e` over
   `packages/B-NTC.json` `coverage.successors.substitutions` returns length 3.
3. **Re-issue LINE 2 of `FIX-REPORT-B-NTC-r2.md` 4.2 against the corrected brief**, and
   correct that report's 6. Changes 1 and 2 move the brief's bytes, so the sha256 inside LINE
   2 and inside `B-NTC.json` `brief.sha256` must both be re-taken - which the fix report
   already says in terms ("If the brief changes again before the PM appends, line 2 must be
   re-issued with the new sha256"). While there, 6's three figures are false at this head:
   `.github` **was** touched by this pass (`fed830a`), the diff is **66 files / 9511 / 904**,
   and `git diff --name-only 10feb1e HEAD -- .github` returns `.github/workflows/rebuild.yml`.
   *Proof:* the new brief sha256 appears identically in LINE 2, in `B-NTC.json` and in a
   `Get-FileHash` of the file; and 6's figures match a re-run at the sealed head.

**Recommended, not required (4).**

4. **Ask the PM for the tooling suites' CI step now** (residual 4), while a package that
   re-pins `rebuild.yml` is open. *Proof:* either a fifth disclosed hunk in brief 4 running
   `execution-targets`, `successor-moves` and `product-phase-and-ledger`, or a `DECISIONS`
   line deferring it to a named later package.

---

## What the PM must rule

Only one thing, and then the two lines.

1. **Ratify lane B's substitution for `DECISIONS:113` (2)'s "`brief.acceptedLedgerLine =
   113`".** The directive cannot be carried out: line 113 fails all four of the runner's
   shape requirements, measured (E.4). Lane B did not relax the runner to make it fit, which
   is the correct instinct - a lane that can soften its own acceptance test has no acceptance
   test. The remedy lane B proposes is two properly shaped lines whose texts are published in
   `FIX-REPORT-B-NTC-r2.md` 4.2, and I verified end to end that those exact bytes clear both
   obligations and bring the runner to `PUBLIC CI EVIDENCE PASS` at exit 0. **The PM should
   either append them (re-issued per exact change 3) or say what else it wants.** This is the
   whole of the remaining authority question; nothing else waits on the PM.

2. **Optionally, residual 4** - whether the three tooling suites get a CI step on this seal
   (recommended change 4). A yes is one more disclosed `rebuild.yml` hunk; a no should name
   the package it waits for.

Everything the r2 review sent to the PM has been answered by `DECISIONS:113` and `:117` and
needs no further ruling: the MOVES_RULING exists and is cited (:113 (1)), `.github` custody and
the rebuild.yml supersession are ruled (:113 (3), :112 (1)), the pass-19 retirement is ruled
and complete (:113 (4)), the H6 custody follows the seam (:113 (5)), the sibling re-pin rides
each sibling's rebase (:113 (6)), and the coach CI step rides this seal (:117 (4)).

---

## Residual risks

1. **The brief will be bound by sha256 with two wrong figures unless changes 1 and 2 land**
   (R1, R2). Neither is load-bearing for behaviour; both are load-bearing for trust in a
   document whose whole authority is that its bytes were checked.
2. **The three substitutions remain reviewer-checked, not machine-checked, against a
   simultaneous edit of module and spec** (r2 R12). Narrowed but not closed: C.4 shows the
   two assertion retargets reach no inherited gate, and M10/M11 catch every single-sided
   change, but nothing catches a coordinated one.
3. **Nineteen memory-only preview cells now run in no CI**, three of them with no successor at
   all (R8). The file is green in Git today; nothing will tell anyone when it stops being.
4. **The successor mechanism's own guard suites run in no CI** (R9). The package that most
   depends on `execution-targets` and `successor-moves` staying green is the one that would
   break them.
5. **CI is red on the lane branch until the two lines land** (R6). That is the ruled state,
   but it means the branch cannot be told apart from a genuinely broken one by its CI badge.
6. **The engine's `hard`/`debt` branches still have no varying real path through the product**
   (fixer residual 5, r1 residual 3, r2 residual 7). Every qualified answer I saw measured is
   `{hard:false, rushed:false, debt:false}`.
7. **`--explain` does not exist** (R7), so a future refusal that is not one of the named codes
   still costs a reviewer an instrumented process. Z6's stderr codes cover today's cases.
8. **A fresh checkout cannot run these gates** without the gitignored engines, the `.tmp`
   reference packet and the two `node_modules` junctions (E.4). Not a defect and not new, but
   it means "clone and verify" is not available to a reviewer without the owner's machine.
9. **`run-current-head.cjs --all` remains unrunnable here** (r2 R14), and I did not attempt it.
10. **No browser, no device, no private fixture.** `--full` stopped at the BLOCKED line, as it
    must, and I sought no private data at any point.

---

## Boundaries honoured

* **The review worktree was never written to** except this file. `git status --porcelain` in
  `.../work/lane-b/rv-ntc3` lists **only**
  `rebuild/lanes/b/reviews/B-NTC-REVIEW-r3.md`. HEAD is `3acc805`, unmoved.
* **Every mutation lived in a disposable `git clone --shared`** under
  `.../work/lane-b/rv-ntc3-scratch/probe`, which was deleted before this file was written
  (`Test-Path -> False`). Its junctions were removed first, so nothing outside it was touched.
* **No commit, no push, no ref written in the real repository.** The probe branch, its commits
  and its `refs/remotes/origin/rebuild/t2-client-core` override existed only inside the clone.
  `origin/rebuild/t2-client-core` in the real repository is where the integrator left it.
* **The other worktrees were not touched.** `.../work/lane-b/rv-tool6` (tooling r6, running
  concurrently), `.../work/lane-b/ntc` and `.../work/lane-b/tooling` are at their own heads;
  I read through `rv-ntc3`'s own junctions and never through theirs.
* **Suites were run serially inside my own tree**, per r2's note that concurrent runs in the
  same tree produce false REDs. I saw no spurious RED.
* **No private data.** `rebuild/conform/private` does not exist here; I never looked for it,
  never created it, and `ledger/` was never opened. No private count, hash, golden or value
  appears anywhere above. No token or secret was printed.

---

## Provenance

* **This review is r3 and is independent and blind.** I wrote no line of B-NTC, of the
  successor mechanism, of the tooling runner or of any document under review. I read the r1
  and r2 reviews, the fix report, the brief, the build report and the tooling r5 report, and
  treated every claim in all of them as a hypothesis to re-measure. Where I agree with the
  fixer I say so with my own command; where I disagree (R1, R2, R3) I say so.
* **The author of this pass is `lane-b-fixer5`**, answering `B-NTC-REVIEW-r2.md` under
  `DECISIONS:113` and `:117` (4). The pass merged `rebuild/lane-b-tooling` @ `8d3d362` (whose
  self-clearing commit is **r6's object, not mine** - I judged only B-NTC's *use* of the
  runner, and the one thing that use turns on, the chain-branch resolution of a child's own
  ledger lines, I verified by building the chain myself) and the integration tip `5c6766e`.
* **Astra commits appear earlier in this branch's history.** Per `DECISIONS:112` (2) their
  ledger and acceptance lines are void and bind nothing, and Astra-side reviews are not the
  independent review. I treated every Astra document as a hypothesis and relied on none of
  them. The one Astra artefact that mattered here is the fourth substitution
  (`require.main === module -> true`), which this pass **removed** and replaced with the
  `asMain` compile-time answer; I confirmed its absence by diffing the compiled bodies (C.3),
  not by reading the claim.
* **The runner under `rebuild/lanes/b/tooling/` is reviewed separately** (TOOLING-REVIEW r1-r5,
  r6 in flight in a concurrent worktree). Its bytes were byte-identical on disk and in Git at
  HEAD on every run I made (`runner 6875576097c3...`).
* **Effort:** MAX, per `DECISIONS:116` (6), engine tier.
