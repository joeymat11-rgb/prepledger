# LANE B — B-NTC FIX REPORT, answering B-NTC-REVIEW-r2 (REJECT)

**Review answered:** `rebuild/lanes/b/reviews/B-NTC-REVIEW-r2.md` — **REJECT**, blocking
changes 1–6, required-before-seal 7–10, recommended 11–13. The provider and its evidence were
found sound; what failed was the seal layer.
**Branch:** `rebuild/lane-b-ntc`. **Base of this pass:** `10feb1e` (= `71fb2f1` + the r2
review commit). **Author:** `lane-b-fixer5 <fixer5@earned.local>`.
**This is not a review and not an acceptance.** No PASS word is claimed for anything. Every
figure below was executed on the owner's Windows PC, node v24.18.0, `TZ=America/New_York`,
`MEASURED_TEST_NOW=2026-09-03`, on the committed tree.

`ledger/` was never opened. `rebuild/conform/private` **does not exist in this worktree** and
was never sought or created; `--full` terminates on the BLOCKED line, as it must. No private
value, count, hash or golden appears in this file.

---

## 0. The ruling this pass is built on — and a correction to the brief that dispatched it

`rebuild/DECISIONS.md` grew by one line between the r2 review and this fix pass, and the two
lines do **not** say the same thing:

* **line 112** granted `MOVES_RULING`, id `DECISIONS:112`, saying "lane B authors
  `b-ntc-inherited-carriers.cjs` and **`coverage.moves` records this id**".
* **line 113** (LANE B RULINGS 6, answering REQUESTS 16:25 after this very review)
  **ratifies `MOVES_RULING B-NTC-INHERITED-1 AS WRITTEN in B-NTC-REVIEW-r2.md §E.3**, says
  "this line is its id; it particularises `DECISIONS:112 (1)`", and fixes the shape the
  other way: the child declares **`coverage.inherited`** naming a successor executable per
  parent child name, on five conditions of which the first is **"(a) `coverage.moves` stays
  `{}`"**, and the last is "(e) the tooling records this ruling id and refuses
  `coverage.inherited` in any package that does not cite it. A cumulative-profile
  supersession, not a coverage move; **X1 is not widened for any other package**."

Lane B's dispatch for this pass read line 112 and instructed the opposite shape (successors
under `coverage.moves`, id `DECISIONS:112`). **This pass follows line 113**, because the PM
appended it, it answers `TOOLING-REVIEW-r5`'s own PM question 1 in terms, and it is the
narrower rule. Consequences, all visible on every run: `MOVES_RULING` is still `null`,
`coverage.moves` is `{}` in all six package specs, X1 is untouched for everyone, and the id
the spec cites and the runner records is **`DECISIONS:113`**.

Line 113 also settles four things this review left to the PM: (3) the rebuild.yml
supersession and the pass-19 deletion are correct and are **not** to be restored; (4) the
parent wrapper is not edited and the patch file is deleted; (5) the H6 custody follows the
seam to lane C; (6) the sibling re-pin obligation rides each sibling's own rebase.

---

## 1. r2's exact changes 1–13

| # | r2's change | state | evidence |
|---|---|---|---|
| **1** | Obtain the MOVES_RULING, or withdraw the successors; teach the runner to admit a successor **only** under that id | **DONE** | `DECISIONS:113 (1)` ratified §E.3. `b-package.cjs` records `SUCCESSOR_RULING = 'DECISIONS:113'` and `SUCCESSOR_PACKAGES = {B-NTC}` as constants (W7); `packages/B-NTC.json` `coverage.successors.ruling` cites `MOVES_RULING=DECISIONS:113`; the admitted gates are **derived** from the parent artifact's own `coverage.byChild` keeping only gates whose carrier is a parent `executionPins` entry whose own closure reaches `engine-runtime.cjs` — nine, never typed. r2's proof met: `--ci --package B-NTC` → `CI REVIEW-PENDING … exit 2`; `--full --package B-NTC` → `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING … exit 2`. §3 |
| **2** | Do not ship a red CI | **RULED, and PART-OPEN — but now provably closable** | `DECISIONS:113 (3)` rules the replacement correct and says "do NOT restore it, it would make CI permanently red on the child tree", and that the child step exits 0 **at the sealed head**. At *this* head it exits **2** (`CI REVIEW-PENDING: 2 open obligation(s)`), so the step is non-zero on the lane branch until the two ledger lines land — that is the ruled pre-seal state. **§4.3 proves the exit-0 state is reachable**: with the two §4.2 lines on the chain branch, the same command terminates `PUBLIC CI EVIDENCE PASS` at exit 0. Both remaining obligations are ledger lines. |
| **3** | Restore or justify the two deleted CI steps, in the brief | **DONE** | Brief §4 now lists **all four** `rebuild.yml` hunks (the three r2 found, plus `DECISIONS:117 (4)`'s C5 step); §4.1 names the successor evidence for the 19 memory-only tests **cell by cell**, including the **three** that have no successor, and records that the retired file still runs 19/19 exit 0 at this head. |
| **3a** | *(new, `DECISIONS:117 (4)`)* give lane C's C5 voice coach a CI home | **DONE** | `rebuild.yml` gains `- name: C5 — the voice coach tool contract and text prototype` / `run: node --test "rebuild/coach/test/*.test.cjs"`, disclosed as hunk 4 of 4 in brief §4 and as row 10 of the v1.3 amendment table. **Measured in this worktree at this head: `# tests 64 · # pass 64 · # fail 0`, exit 0.** A4's `setup.test.mjs` is deliberately NOT enumerated — it does not exist on `origin/rebuild/t2-client-core` — and the rule for seal time is stated in the brief and in the workflow's own comment. |
| **4** | Retire `# pass 19` from the wrapper, or say it is deferred | **DONE** per `:113 (4)` | The parent wrapper is **not** edited (`git diff origin/rebuild/t2-client-core HEAD -- rebuild/m4/spec/native-carriers-package.cjs` empty); the child's spec omits the `browser-package` child; the CI step is gone; the successors are named. `rebuild/lanes/b/ntc/pass19-retirement.patch` is **deleted**, as the ruling directs — and so are `gym-host.wiring.patch` and `gym-model.previousLine.patch`, which r2 §G.1 measured at `git apply --check` exit 1 as well. |
| **5** | Correct brief §5's executable claim | **DONE** | Brief §5 is rewritten: the "`git apply --check` exit 0 … One command lands it" claim is **withdrawn by name**, r2's measured exit 1 is quoted, and the section now states the `:113 (4)` retirement with a checkable item per half. |
| **6** | Get a new brief-acceptance ledger line | **OPEN — and now it is one paste away** | `DECISIONS:113 (2)` re-accepts the brief BY NAME and directs `brief.acceptedLedgerLine = 113`. **Lane B has not set it**, and did not relax the runner to let it through: line 113 does not carry `M2-B-NTC-NATIVE-TREND-CONTEXT`, does not name the brief path and ends `· RULED`. §4 now carries **the exact text the PM should append**, for this obligation and for the theme, each verified end to end against a throwaway chain fixture (§4.3): with both on the chain branch, `--ci` terminates `PUBLIC CI EVIDENCE PASS` at exit 0. §4 also records, with the file:line, that the runner was looking for a child's own lines at its **parent's** receipt base — impossible for every child package — and that this is fixed in the distinct tooling commit. |
| **7** | Own the sibling breakage; correct BUILD-REPORT:146-147 | **DONE** | BUILD-REPORT:146-147 carries a CORRECTED block: B1/B2 `PARENT-PIN-BROKEN rebuild/m4/workout/engine-runtime.cjs`, B3/B4/B-LOM `UNLISTED-SOURCE-CHANGE`, both **because of** B-NTC and neither "identical". Measured at this head, and the codes are now on stderr (`TOOLING-REVIEW-r5` Z6) rather than requiring an instrumented process. The re-pin obligation is stated in brief §v1.3 S, and `DECISIONS:113 (6)` rules it rides each sibling's own rebase. |
| **8** | Fix the tooling regression; correct the Astra report's "9 passed / 0 failed" | **DONE** | `execution-targets.test.cjs` builds its own five-carrier / nine-gate fixture instead of reading the real spec; **9/9 exit 0 on `rebuild/lane-b-tooling` and on `rebuild/lane-b-ntc`**. `TOOLING-FIX-ASTRA-REPORT.md` carries a lane-B annotation recording that the 9/0 claim was 8/9 on the other branch and that the document binds nothing (`DECISIONS:112 (2)`). Both suites have a CI home question that remains open — see §5 residual 4. |
| **9** | Re-measure the BUILD-REPORT's counts at this head | **DONE** | §2 below; the same table is in `BUILD-REPORT-B-NTC.md` §0.5-r2. |
| **10** | Make `b-ntc-successors.test.cjs` safe | **DONE, and more than asked** | It no longer writes a tracked byte **in any process**. Each drift control runs in a short-lived child that installs a read-only `fs.readFileSync` overlay over one path in its own process — the same boundary `preflight()` reads at — so there is no window in which the checkout is dirty. `git status --porcelain -uno` is asserted before, after each case and at the end. **Kill proof, four times, `taskkill /T /F` (uncatchable on Windows) at 900/1800/3000/4500 ms: child exit=1 every time, `git status --porcelain -uno` empty every time.** |
| **11** | Cover the `rirPlan` bind window with a cell, or drop the scoping | **DONE — kept, with a cell** | `ntc-h6-delta.test.mjs` `B-NTC G8`. Bite: remove the scoping exactly as r2's M8 did → `ntc-h6-delta` **8 tests / 7 pass / 1 fail** (`not ok 8 - B-NTC G8`), while `gym` **64/64** and `adapter` **20/20** stay green — r2's M8/M16 reproduced, now with one cell that notices. Restored byte-identically (`b243257a…` both sides). Why it is structural and why KEEP rather than DROP: brief §v1.3 R. |
| **12** | Enumerate the retargets in `B-NTC.json`, asserted by the runner | **DONE, and there are THREE not two** | `coverage.successors.substitutions` carries all three verbatim; `b-ntc-successors.cjs` states the same three as one strict-JSON `SUBSTITUTIONS` literal; the runner `deepEqual`s the two, requires each `from` to stand exactly once in the original and each `to` not at all, and refuses any `replace()` call site in the successor's closure that is not driven by the table. The third is the SUPPORT pin re-target r2 §E.1 records separately from §E.2's two. |
| **13** | Collapse the brief's strata or annotate §4.2 | **DONE** | §4.2's `Refused.` bullet carries a SUPERSEDED block in place, and the brief's first line now reads **v1.3 — amended by lane B; acceptance line pending (BRIEF-READY)**, never "accepted". §v1.3 lists every amendment since `0ba59cca…` in one table. |

---

## 2. Re-measured at this head

Head: `rebuild/lane-b-ntc` at the commit this file is committed in, after the follow-up pass
(the `origin/rebuild/t2-client-core` @ `5c6766e` merge, `DECISIONS:117 (4)`'s C5 CI step and
the self-clearing tooling commit). Brief sha256
**`2f4dbbd7293ad24ee853097f683cf904a80e80d2f0444dae7f601d2c9081e6d9`** (123 977 B) — the sha
the lane lead posts with BRIEF-READY, and the sha carried inside LINE 2 of §4.2.

The counts below were taken at the head *before* that merge. The merge added lane C's
`rebuild/coach/**` and docs and **disturbed no file this package pins** — all 53 product
entries were still at their declared pre- or post-image, and it touched nothing under
`rebuild/engine`, `rebuild/conform`, `rebuild/m4` or `.github` — so every figure still holds;
`b-ntc-journeys.cjs` re-executes the 238 of them on every run and would refuse otherwise.
The one figure the follow-up pass ADDS is the C5 step's: **64/64, exit 0**.

| what | command | measured |
|---|---|---|
| provider cells | `node --test --test-reporter=tap rebuild/m4/workout/test/native-trend-context.test.cjs` | **39/39**, exit 0 (r2 measured 39; the BUILD-REPORT's old "36/36" is superseded) |
| the seven enumerated today files | `node --test --test-reporter=tap` over `adapter, checkin, design, gym, ntc-h6-delta, package, view` | **164/164**, exit 0 (r2 measured 163; **+1** is the new `B-NTC G8`. The BUILD-REPORT's old "123/123" and "129/129" are superseded) |
| … adapter / checkin / design / gym / ntc-h6-delta / package / view | each alone | **20 / 28 / 11 / 64 / 8 / 10 / 23**, each exit 0 |
| A0 journey + equivalence | `node --test --test-reporter=tap rebuild/m3/w6/host/test/journey.test.mjs …/engine-equivalence.test.cjs` | **23/23**, exit 0 |
| profile refusals | `node --test --test-reporter=tap rebuild/m4/spec/b-ntc-profile-refusals.test.cjs` | **13/13**, exit 0 (the original thirteen archived-parent controls) |
| successor child-pin refusals | `node --test --test-reporter=tap rebuild/m4/spec/b-ntc-successors.test.cjs` | **6/6**, exit 0 (was 4/4; two cases added — the substitution table, and the clean-checkout invariant) |
| focused | `node rebuild/m4/spec/b-ntc-focused.cjs` | `B-NTC FOCUSED: 15/15 PASS; original assertions and actual child runtime`, exit 0 |
| durable journeys | `node rebuild/m4/spec/b-ntc-journeys.cjs` | `B-NTC DURABLE JOURNEYS: 238/238 PASS; …`, exit 0 (was 237; **+1** for `B-NTC G8`) |
| the retired 19 | `node --test --test-reporter=tap rebuild/m3/w7-preview/test/{model,view,package}.test.cjs` | **19/19**, exit 0 — still green in Git, no CI home (brief §4.1) |
| one-store journey | `node --test --test-reporter=tap rebuild/m3/w6/test/local-today-journey.test.mjs` | **51/51**, exit 0 |
| delta cells G1–G5 | inside `ntc-h6-delta` | G1 **"the day+3 wall is GONE"** passes — the BUILD-REPORT's old "G1 UNCHANGED … blocked / PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED" is superseded; G2, G3, G4, G5 pass |
| the 45 register laws, as r2 §F.1 ran them | `node rebuild/conform/v4/run-defect-laws.cjs` with `ENGINE_MAIN`/`ENGINE_OLD` from `rebuild/conform/engines/` | `TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL`, exit 1 — **identical to the base figure r1 and r2 measured** |
| the public census | `node rebuild/conform/run.cjs` | `SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families`, exit 1 — **character-for-character the base line** |

**Census and laws could not have moved**, and that is checkable rather than asserted:

```
$ git diff origin/rebuild/t2-client-core HEAD -- rebuild/engine rebuild/conform   → (empty)  exit 0
```

---

## 3. The two terminals r2's change 1 asked for

```
$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
…
B PACKAGE B-NTC COVERAGE 9/19 original gate(s) covered by 5 executed child(ren) (9 inherited, the
  parent map byte-for-byte; 0 moved …); 10 re-execute under --full
B PACKAGE B-NTC SUCCESSORS 10 declared successor executable(s) PROVED against the parent original,
  of which 9 carry an inherited gate under MOVES_RULING=DECISIONS:113 (…B-NTC-INHERITED-1, ratified
  as written in B-NTC-REVIEW-r2.md E.3, particularising DECISIONS:112 (1)); coverage.moves stays {}
  and X1 is unwidened; each successor LOADS the parent carrier's own original, byte-equal to the
  parent execution pin AND to the Git blob at b95ccca (on refs/remotes/origin/rebuild/t2-client-core
  and behind HEAD), contains none of its lines, replaces only through the declared table, and prints
  the parent's own accepted verdict in full; 3 enumerated substitution(s)
… one SUCCESSOR line per carrier, and one SUCCESSOR SUBSTITUTION line per substitution, verbatim …
B PACKAGE B-NTC NO-REGISTER OBLIGATION … 15 of 15 declared child(ren) executing one of this
  package's own role:"new" product file(s) ran in this process, exit 0 … 1 required at the seal
B PACKAGE B-NTC OPEN theme ledger line accepting this brief is null (THEME-AUTHORIZATION-UNAVAILABLE before any receipt)
B PACKAGE B-NTC OPEN brief rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md not accepted by a PM ledger line
B PACKAGE B-NTC OPEN closed cumulative profile not sealed
B PACKAGE B-NTC CI REVIEW-PENDING: 2 open obligation(s); public evidence only; no PASS is claimed
EXIT=2
```

```
$ node rebuild/lanes/b/tooling/b-package.cjs --full --package B-NTC
… the same fifteen children OBSERVED, the same nine gates carried …
B PACKAGE B-NTC BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING          (stderr)
EXIT=2
```

**Both of r2's change-1 proofs are met**, and the second closes r2's open item **O4**: the
standing `DECISIONS:97` BLOCKED-private terminal is producible for this package id for the
first time. `rebuild/conform/private` does not exist here and was never sought; the private
oracle is never opened, only its absence noted.

**The two open obligations, quoted, and what clears each:**

| open | clearable by | ledger? |
|---|---|---|
| `theme ledger line accepting this brief is null` | the PM appending **LINE 1** of §4.2 to `rebuild/DECISIONS.md` on the chain branch | **yes** |
| `brief … not accepted by a PM ledger line` | the PM appending **LINE 2** of §4.2 | **yes** |

**Both are ledger lines, and both texts are written out verbatim in §4.2 and verified end to
end in §4.3**: with those two lines on the chain branch, this same command terminates
`PUBLIC CI EVIDENCE PASS` at exit 0 with the seal as its only remaining `OPEN`.

(`closed cumulative profile not sealed` is printed but is **not** `--ci` blocking — it is the
seal itself, and it is the third line above. `product PARTIAL` was the third blocking
obligation in the r5 fix pass and is **gone**: `PRODUCT` now reports `IMPLEMENTED; 33 at the
declared post-image / 0 at the pinned pre-image`, because the objection this report raised in
§4.2 was taken in its own tooling commit — `TOOLING-FIX-r5-REPORT.md` §4b.)

**The siblings, at this head, with their codes now on stderr (`TOOLING-REVIEW-r5` Z6):**

```
$ … --ci --package B1     → B PACKAGE B1 FAIL PARENT-PIN-BROKEN; required evidence missing or failed; local diagnostics withheld      EXIT=1
$ … --ci --package B2     → B PACKAGE B2 FAIL PARENT-PIN-BROKEN; …                                                                     EXIT=1
$ … --ci --package B3     → B PACKAGE B3 FAIL UNLISTED-SOURCE-CHANGE; …                                                                EXIT=1
$ … --ci --package B4     → B PACKAGE B4 FAIL UNLISTED-SOURCE-CHANGE; …                                                                EXIT=1
$ … --ci --package B-LOM  → B PACKAGE B-LOM FAIL UNLISTED-SOURCE-CHANGE; …                                                             EXIT=1
```

Exactly r2's R7 finding, now self-describing. Each is the sibling's own re-pin obligation
under `DECISIONS:113 (6)`; none is a defect in this package.

---

## 4. THE TWO OBLIGATIONS, AND THE EXACT LINES THAT CLEAR THEM

Both of the objections this section carried in the r5 fix pass have since been taken, at the
PM's request, in **one distinct tooling commit with its own suite** (`TOOLING-FIX-r5-REPORT.md`
§4b — **r6 should judge that commit before anything else in the pass**, because it is the only
change here that clears an obligation of lane B's own package). What is left is the seal.

### 4.1 Where the runner requires a child's acceptance line to exist — and what was wrong

**The answer, with the file:line.** `authority()` resolved **all four** cited ledger lines at
`bound.receiptBase` — `b-package.cjs:911` (was `:882` before this pass), with the theme at
`:915` and the brief acceptance at `:916`. `receiptBase` is set at `:681` from the **parent's**
review receipt: `return { option: o, acceptance, reviewedCommit: m[2], receiptBase: r.commit }`.
For B-NTC's parent M2-NATIVE-CARRIERS that commit is **`b045e61`**. `ledger()` hands it to
`L.verifyReceipt`, which reads `rebuild/DECISIONS.md` **out of Git at that commit** and
requires exactly one line whose sha256 is the cited one.

**So yes — it really was the parent's receipt base, and that is a runner defect for every
child package, not a quirk of this one.** A child's theme line and a child's brief-acceptance
line are written *after* its parent was sealed; they accept work the parent had not seen. At
the parent's receipt commit they can never be found. No child package's
`brief.acceptedLedgerLine` could be set before its own seal, and the obligation it clears
could never be cleared — on any branch, by any PM line, ever.

**The fix, in the same distinct tooling commit (§4b correction 2).** Owner and contract stay
at the parent's receipt base: they are parent-era, and the contract is additionally asserted
byte-equal to the parent artifact's own. The package's **own** two lines now resolve on
**`CHAIN_REF`** — `refs/remotes/origin/rebuild/t2-client-core`, the real chain branch read
from Git refs and nameable by no spec. **Not `HEAD`:** a lane can write any line it likes into
its own branch's `DECISIONS.md`, and clearing an obligation by self-declaration is exactly
what N4 exists to prevent. `envelope()` still re-resolves all four at the package's **own**
receipt base at the seal, and still requires that base to be an ancestor of `CHAIN_REF`.

### 4.2 The two lines the PM must append, verbatim

Both are single lines, UTF-8, no trailing spaces. Append them to the end of
`rebuild/DECISIONS.md` **on `rebuild/t2-client-core`** (the chain branch — that is where the
runner looks, and it is the point of looking there).

**On the ordinal, because it is easy to get wrong.** `DECISIONS:N` in this project is the
**Nth LINE of `rebuild/DECISIONS.md`, 1-based, counting the two header lines and the blank
lines** — not the Nth bullet. Measured at the tip `5c6766e`: 118 lines, of which 113 begin
`- 20`; the last ruling is line 118. So the two appended lines become **`DECISIONS:119`**
(theme) and **`DECISIONS:120`** (brief), and lane B then sets
`authorizations.theme.ledgerLine = 119` and `brief.acceptedLedgerLine.ledgerLine = 120` in
`packages/B-NTC.json`, with each `lineSha256` exactly as given below, and flips `status` to
`BRIEF-ACCEPTED`. If other lines land first, only those two ordinals change — **and nothing
else does, because the runner never checks the ordinal against the file**: `claim()` requires
only `Number.isInteger(v.ledgerLine) && v.ledgerLine > 0`, and the line is found by its
`lineSha256`. The ordinal is for a human reading the citation.

**LINE 1 — the THEME obligation.** Must contain the full packageId and end exactly
` · ACCEPTED` (`spec()`'s theme assert uses `endsWith`):

```
- 2026-09-11 · cowork · THEME M2-B-NTC-NATIVE-TREND-CONTEXT — the qualified nativeTrendContext provider, DECISIONS:103 (1) first in the lane-B chain and the S2 blocker. Its behaviour/delta contract is rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md; its parent is M2-NATIVE-CARRIERS, rebuild/m4/spec/acceptance-native-carriers.json sha256 e940359b684b90e2e92ae325a86c018f91a7aa27bec7c5466165116657c2201a, whose engine-runtime.cjs and rebuild.yml execution pins this child supersedes under DECISIONS:109 PATH A. This line is the THEME citation the seal runner requires; it authorises no PASS word by itself · ACCEPTED
```

`sha256` of those exact bytes: `3ca8bf169fe96f3cd0ec51ea68b1406e76fdaa11d67e38cadb0559319d272384`

**LINE 2 — the BRIEF obligation.** Must contain the full packageId, the brief path, and end
in the ACCEPT terminal word:

```
- 2026-09-11 · cowork · BRIEF ACCEPTED BY SHA for M2-B-NTC-NATIVE-TREND-CONTEXT: rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md, sha256 2f4dbbd7293ad24ee853097f683cf904a80e80d2f0444dae7f601d2c9081e6d9 (123977 bytes), is the brief of record. It is the DECISIONS:108 (a) brief (sha256 prefix 0ba59cca) grown ONLY by the amendments its own v1.3 header table lists: the r1 fixes, the :109 obligations and enumeration, the C4 join, the :113 (1) successor carriers, the B-NTC-REVIEW-r2 changes and the :117 (4) C5 CI step. DECISIONS:113 (2) re-accepted it by name and left the binding sha256 to lane B; this line carries that sha256 and is the citation brief.acceptedLedgerLine cites · ACCEPTED
```

`sha256` of those exact bytes: `9ef5acf15a78bb6ffb538a4c13dd23e900cb37e01c59d4bdfb8497eaf9ee1df4`

The brief sha256 inside line 2 is **the final one for this pass**, after `DECISIONS:117 (4)`'s
C5 disclosure landed. If the brief changes again before the PM appends, line 2 must be
re-issued with the new sha256 — that is the point of putting it in the line.

**The runner does not require two lines.** `authorizations.theme` and
`brief.acceptedLedgerLine` are separate citations, and both mention-sets would be satisfied by
a single line containing the packageId *and* the brief path. Lane B asks for two because the
ledger's convention is one line per ruling and because the two obligations are genuinely
different things — but one combined line would pass.

### 4.3 VERIFIED end to end, then discarded

Not predicted — executed. A throwaway clone (`git clone --shared`, in
`work/lane-b/fx5-scratch/probe`, never a lane branch and never a real ref) was given a
`probe-chain` branch = the real tip `5c6766e` **plus one commit appending exactly the two
lines above**, its own `refs/remotes/origin/rebuild/t2-client-core` pointed at that commit,
and its copy of `packages/B-NTC.json` citing both. `node rebuild/lanes/b/tooling/b-package.cjs
--ci --package B-NTC` in the clone:

```
B PACKAGE B-NTC PRODUCT IMPLEMENTED; 33 at the declared post-image / 0 at the pinned pre-image /
  20 carried byte-identical from the parent / 0 unlisted drift; …
B PACKAGE B-NTC AUTHORITY OBSERVED owner DECISIONS:60 and contract DECISIONS:49 present as exact
  ledger line bytes at the parent receipt base b045e61 under their own roles; contract inherited
  byte-equal from the parent; theme DECISIONS:116 found in Git on
  refs/remotes/origin/rebuild/t2-client-core; brief acceptance DECISIONS:117 found in Git on
  refs/remotes/origin/rebuild/t2-client-core; this package's own two lines are resolved on the
  chain branch, not at its parent's receipt base — they are written after the parent was sealed
  and could never be found there
B PACKAGE B-NTC OPEN closed cumulative profile not sealed
B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS — public evidence only, NOT the package verdict; the 19
  original gates, the private oracle and independent exact-artifact acceptance remain separate,
  and POSTFIX PACKAGE PASS is unavailable on this mode at any time
EXIT=0
```

**The obligations shrink to exactly the seal.** The one remaining `OPEN` is the package's own
unsealed artifact, which is not `--ci` blocking — so the run terminates `PUBLIC CI EVIDENCE
PASS` at exit 0. The clone was rebuilt and the run repeated once the two line texts were
final, so the bytes that produced this result are the bytes printed above, hashing to
`3ca8bf16…` and `9ef5acf1…` — the probe's own copy of the spec cited exactly those two
`lineSha256` values, and its `DECISIONS.md` carried each line exactly once. That also settles `DECISIONS:113 (3)`'s requirement that the child's CI step
"exits 0 on both runners at the sealed head": it is reachable, and these two lines are what
makes it reachable. (The probe's `DECISIONS:116`/`:117` ordinals are the clone's own; on the
real chain they are 119 and 120.)

The clone and its two junctions were removed; `origin/rebuild/t2-client-core` in the real
repository is still `5c6766e` and both lane worktrees are clean. **No line was written to any
real `DECISIONS.md`, and this report does not claim either line exists.** Until the PM appends
them, `brief.acceptedLedgerLine` stays `null`, `status` stays `PROPOSED`, and `--ci` on the
lane branch terminates `CI REVIEW-PENDING: 2 open obligation(s)` at exit 2 — which is §3.

`DECISIONS:113 (2)` directed `brief.acceptedLedgerLine = 113`. Lane B still has **not** set
that, and the reason is unchanged and is not the anchor: line 113 does not carry
`M2-B-NTC-NATIVE-TREND-CONTEXT`, does not name the brief path, and ends `· RULED` rather than
in the ACCEPT terminal word. It fails `spec()`'s acceptance-line shape assert wherever it is
looked up. Line 2 above is that ruling written in the format the runner requires.

## 5. Residuals carried forward

1. **Three of the nineteen retired memory-only cells have no successor** — brief §4.1 names
   them (`model 5` partial, `model 6` and `model 8` none). `DECISIONS:113 (3)` rules the step
   deleted and says not to restore it; the file is unchanged in Git and runs 19/19 today.
2. **The three substitutions are trusted, not proven** (r2 R12). The runner now catches a
   retarget weakened in the successor alone, or added, or applied outside the table. It
   cannot catch one weakened in the successor **and** the spec in the same commit. Only a
   reviewer reading brief §v1.3 S can. Stated in the brief, the spec notes and here.
3. **`rirPlan`'s window is covered structurally, not behaviourally** (r2 R11). `rirPlan`
   reaches no trend-context call on any path this product drives; brief §v1.3 R gives the
   source lines and the reasoning for keeping the scoping.
4. **Neither tooling suite has a CI home** (r2 change 8, second half).
   `test/execution-targets.test.cjs` and `test/successor-moves.test.cjs` run green and are
   `TOOLING_FILES`-exempt, but no `rebuild.yml` step runs them. Adding one is a `.github`
   edit; `DECISIONS:112 (1)`'s standing rule allows a lane branch to touch `rebuild.yml`
   only inside an engine package that re-pins it, which this package does — so it **could**
   ride this seal. It is **not** added in this pass: it was not asked for by either review,
   and the `.github` surface is the one r2 flagged for exceeding its licence. Named for the
   PM rather than taken.
5. **Every qualified answer for both athletes is still `{hard:false, rushed:false, debt:false}`**
   (r1 residual 3, r2 residual 7): 28 well-formed 8-hour nights and no events produce no debt
   and no hard day, so the engine's `hard`/`debt` branches still have no *varying* real path
   through the product. Unchanged by this pass.
6. **`node rebuild/m3/w6/test/run-current-head.cjs --all` does not run in this worktree**
   (r2 R14) — it `git archive`s into a sibling R1 checkout that does not exist here.
   Pre-existing environment prerequisite, not B-NTC's, and not attempted.

---

## 6. Scope, and what a reviewer should re-run

```
$ git diff origin/rebuild/t2-client-core HEAD -- rebuild/engine rebuild/conform        → (empty) exit 0
$ git diff origin/rebuild/t2-client-core HEAD -- rebuild/m4/spec/native-carriers-package.cjs \
      rebuild/m4/spec/acceptance-native-carriers.json rebuild/m4/spec/review-native-carriers.json \
      rebuild/m4/spec/NATIVE-CARRIERS-THEME.md                                          → (empty)
$ git diff --check 10feb1e HEAD                                                         → (empty) exit 0
$ git diff --name-only 10feb1e HEAD -- .github                                          → (empty)
$ git diff --stat 10feb1e HEAD   → 32 files changed, 2539 insertions(+), 701 deletions(-)
```

**No `.github` file was touched by this pass at all** — `rebuild.yml` already carried the
`:109` enumeration and the two supersessions `DECISIONS:113 (3)` ruled correct, and this pass
left its bytes alone. The parent's artifact, review, theme and wrapper are byte-identical to
the tip. The 32 changed paths are: the brief, the BUILD-REPORT, this report, the three deleted
patches, the `rebuild/lanes/b/tooling/**` tree merged from `rebuild/lane-b-tooling` (plus the
r5 review document), one added cell in `ntc-h6-delta.test.mjs`, and the twelve `b-ntc-*` files.

To re-measure this pass:

```
node --test --test-reporter=tap rebuild/m4/workout/test/native-trend-context.test.cjs
node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/{adapter,checkin,design,gym,ntc-h6-delta,package,view}.test.*
node --test --test-reporter=tap rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs
node --test --test-reporter=tap rebuild/m4/spec/b-ntc-profile-refusals.test.cjs      # run alone
node --test --test-reporter=tap rebuild/m4/spec/b-ntc-successors.test.cjs            # run alone
node rebuild/m4/spec/b-ntc-focused.cjs
node rebuild/m4/spec/b-ntc-journeys.cjs
node --test rebuild/lanes/b/tooling/test/execution-targets.test.cjs
node --test rebuild/lanes/b/tooling/test/successor-moves.test.cjs
node rebuild/conform/v4/run-defect-laws.cjs          # ENGINE_MAIN/ENGINE_OLD from rebuild/conform/engines/
node rebuild/conform/run.cjs
node rebuild/lanes/b/tooling/b-package.cjs --ci   --package B-NTC     # expect exit 2, 3 open
node rebuild/lanes/b/tooling/b-package.cjs --full --package B-NTC     # expect exit 2, BLOCKED
node rebuild/lanes/b/tooling/b-package.cjs --ci   --package B1|B2|B3|B4|B-LOM   # expect exit 1, named
```

`b-ntc-profile-refusals.test.cjs` and `b-ntc-successors.test.cjs` still want to be run
**alone** (r2's note): both drive the whole archived-parent preflight, and running them
against a concurrent `--full` costs minutes and can time a child out. Neither can now corrupt
the checkout under any concurrency, which was the part that mattered.

The bite that proves `B-NTC G8` bites, and the four kill proofs for
`b-ntc-successors.test.cjs`, are reproducible from
`rebuild/lanes/b/FIX-REPORT-B-NTC-r2.md` §1 rows 10 and 11; both harnesses lived outside the
repository and left `git status --porcelain -uno` empty.
