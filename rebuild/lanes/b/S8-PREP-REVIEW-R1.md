# S8 PREPARATION, independent review R1

**VERDICT: ACCEPT WITH NOTES. 0 BLOCKING.** Reviewed at `30dd4c01a15f2970796d1b9bd1875b63e0ed725e`
on `rebuild/d-p3-real-shape` (HEAD == `origin/rebuild/d-p3-real-shape`), worktree
`%TEMP%\earned-realshape`. I did not write this round. Everything below was re-measured on this
head by the reviewer's own scripts and runs, not read out of the author report.

Three NOTES, all prose or a PM decision the author correctly refused to make for himself:
N1 the two `p3-layout-v2` cells (the author's own open question, restated here with its cost),
N2 the author's em-dash census is incomplete as stated, N3 one over-claim in a `rebuild.yml`
comment. None of the three touches a byte the runner hashes, a needle, a law or a guard.

## What I re-measured, and what it said

**(1) The runner diff is exactly the three constants and nothing else.**
`git diff 1af78de..HEAD -- rebuild/lanes/b/tooling/b-package.cjs` is THREE hunks, +29/-3:
`IDS` gains `'S8'` directly behind `'S7'` and ahead of `'B1'` (twelve ids), `NO_REGISTER_IDS` gains
`'S8'` (eight), `CHILD_ROOTS` gains `rebuild/lanes/d/p3-real-shape/` as its twentieth element and
is NOT added to `PUBLIC_TAIL_ROOTS`. Each carries its reason in a comment. No loop body, no
predicate, no refusal code, no `baselineOf`, no `spec()` path moves. The tooling cell
`pinned-unchanged-and-ruled-substitutions.test.cjs` moves only F6 and F7 and takes all three lists
by literal and by `deepEqual` (12 / 8 / 20). The five `CHILD_SPECS` cells (`measure/test/boundary`,
`today/test/food`, `machine-settings-ui`, `problem`, `setup`) gain the `'S8'` literal and one
comment block each; the `declaredPost` loop below each is byte-unchanged. That is the whole of the
`rebuild/m3` delta on this branch.

**(2) Every s8-* cell against its s7 sibling, line by line, under a normaliser that allows only
`S7 -> S8`, `s7- -> s8-`, and the parent rename.** Six files. The residue is: the parent's token
line `DECISIONS:490 -> :514` (source-carriers L25/L37, inherited-carriers L20, defect-witnesses
L19, second-gate L19), the generation prose (FIFTH -> SIXTH, "S7 the fifth and S8 the sixth"),
"THE PARENT IS S7, NOT S6", the differential's two chain sentences (S6/S7 -> S7/S8), and in
writers-differential one extra comment line naming this package's own files (lift correspondence,
the capture layout law's readers) which shifts the file by one line. Every assertion, every
threshold, every RED control is identical. `s8-supersede-writers-differential.test.cjs` still
asserts `touched.filter(f => f.startsWith('rebuild/engine/'))` deepEqual `[]` over the package's
whole declared inventory, and still requires the removed-writer mutant DETECTED in 3/3 Date modes.

**(3) Every sha in `packages/S8.json` recomputed by the reviewer, from Git and from disk.**
224 declared paths: **24 `edited` / 17 `new` / 182 `carried` / 1 `superseded-by-child`**.
For all 224 the declared `post` equals the blob at HEAD AND the bytes on disk: **0 mismatches**,
both sides. For all 207 non-`new` paths the declared `pre` equals the blob at `sourceBase`
`8ebc860c30980dc5793be15202ea1a292e3769ba`: **0 mismatches**; every `carried` has `pre === post`.
15 of the 17 `new` carry `pre: null` and do not exist at `sourceBase`. The other two,
`rebuild/m3/w7-preview/today/local-source-basis.mjs` and `rebuild/m4/workout/engine-history.cjs`,
carry their `sourceBase` blob as `pre` with `pre !== post`, which is the runner's own rule for
role `new` stated at `b-package.cjs:349-351` ("a file that did not exist (pre === null) or one this
package moves (pre !== post)"); neither is pinned by the parent, so `carried` and `edited` are both
false of them and `pinned-unchanged` requires `pre === post`. Correct role.
Set relation: S8's product is a strict SUPERSET of S7's 206 (`in S7 not in S8: []`), plus 18.
`rebuild/lanes/b/tooling/packages/S7.json` is `superseded-by-child` over the parent EXECUTION pin;
`H3/S3/S4/S5/S6.json` are `edited`, each a one-line `tooling.runnerSha256` change (2 lines of
numstat each), and all six ancestor specs now read
`e31dd206c0fb0fc0c295df45eae3992d4c59b1a76de8da04a4d0f22948e9335e`.
Re-hashed by me: runner `e31dd206...` 259614 B, identical on disk and at HEAD and equal to
`tooling.runnerSha256`; brief `9fbe105744ccb9295eae866e5ac28b48397ccf6c7e3ea74cc1a97a3a1833c73a`
35888 B, equal to `brief.sha256` and to the byte count the BRIEF-BY-SHA line states;
`packages/S8.json` itself `6fbbb1b901c2d7cacc0595b41b41172a8c0faab12b52b470fcb85f4686878899` 88184 B.

**(4) The three ledger line sha256, recomputed over the line bytes (leading `- ` in, newline out).**
THEME `77a8e98680a1ff0cbbbe5c9eba86607113032551de672bcceae50f47703f3c6c` = `authorizations.theme.lineSha256`.
BRIEF-BY-SHA `06365949c686a90f79dc6bd33130b4737c20c71bf7792ff32af0e817500ca216` = `brief.acceptedLedgerLine.lineSha256`.
GATE-SUPERSESSION `0c2d0db53471b8604bdfb5c19f2485a12df517b672cd04912f988812c5a41eee` = `coverage.superseded.rulingLineSha256`.
All three agree, computed both from the line text S8.json carries and from the three lines of
`%TEMP%\s8out\final-lines.txt` independently. The cited line numbers 524 / 525 / 526 are the next
three of a `rebuild/DECISIONS.md` that has 523 lines on this branch; the runner locates the ruling
by sha256 and never by number (`:511`). Neither of the two lines S8.json carries as text contains a
U+2013 or U+2014. The GATE line's shape is S7's `:514` with the parent chain advanced one
generation and the same nine gates named; the THEME line's "fifth-generation descendant of
M2-S3-COMPANION" is right (S4, S5, S6, S7, S8).

**(5) The declaration covers everything the two accepted rounds moved.**
`git diff --name-status 285fe08b..HEAD -- rebuild/m3 rebuild/m4 rebuild/lanes/d` is 43 rows.
33 of them are declared, with the role the diff status implies. `today-bindings.mjs` and
`workout-host.mjs` are both among them, role `edited`, and so are `source-admission.mjs`,
`import-screen.mjs`, `plan-edit-model.cjs`, `local-source-basis.mjs`, `engine-history.cjs`,
`lift-correspondence.cjs`, the three `w7-preview/import/test` siblings, `lanes/d/plan-edit/model.test.cjs`,
the two `p3-port-fix` cells and all eight `p3-real-shape` files. The 10 undeclared rows are the
eight lane D Markdown documents (spec, two spec reviews, two author reports, three build reviews),
which no package in the chain declares, and the two `p3-layout-v2` cells, which are N1 below.
Over the whole tree `1af78de..HEAD` is 23 rows: 20 declared, plus the brief, the author report and
`packages/S8.json` itself, none of which any package declares (S7 did the same with its own three).
**Lockdown numstat EMPTY**: `git diff --numstat 1af78de..HEAD` over `rebuild/engine`, `rebuild/coach`,
`rebuild/DECISIONS.md` and each of the eight product files the two rounds moved prints nothing.
The reviewer scratch `rebuild/lanes/d/_review-probes/` is still the only untracked path and is
untouched by every commit.

**(6) The needles, re-measured by the reviewer.** I rebuilt the runner's own child environment
(`Reference.create(root)` for `ENGINE_MAIN`/`ENGINE_OLD`, `EARNED_CLIENT_DIR`, `NODE_OPTIONS=''`,
`TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`, the four `PL_*`/`CONFORM_*` keys deleted,
cwd = the worktree) exactly as `laws()` builds it at `b-package.cjs:2085`, and spawned all
**25 declared children** with their declared argv. **25/25 exit 0, 25/25 needle at line start,
`# fail 0` on every child that reports one.** today-17 682, w7-import 35, w6-local-source 26,
m4-import 62, m4-import-production 28, d-import-retract 13, b-lom 30, measure-hermetic 11,
s4-real-day 15, a0-journeys 23, d-admission-swap 4, d-replay-measure 9, d-capture-start 14,
food-live-save 6, w6-host-seams 9, d-replay-all 28; the five `s8-sup-*` 4/3/3/3/3 (16) and the
engine-files-differential terminal sentence (27 / 18 / 45) verbatim; **d-plan-edit 90** and
**d-port-admission 35**, both of which S7 left at 89 and 31, and **d-real-shape 56**, new.
Not one needle in the spec is typed from a report. The five s7-* children are correctly DROPPED
(a retirement is never inherited) and six children are new.

**(7) `--ci --package S8` re-run by me at `30dd4c0`, verbatim, log `%TEMP%\s8rev\ci-rev.log`:**

Quoted byte for byte except that FOUR clauses in which the runner prints its own U+2014 are cut at
that character and marked `[cut]`, because this lane writes no U+2014; the untruncated log stands at
the path above and the same four lines stand in the author report.

```
B PACKAGE S8 SPEC OBSERVED packages/S8.json 6fbbb1b901c2d7cacc0595b41b41172a8c0faab12b52b470fcb85f4686878899; runner e31dd206c0fb0fc0c295df45eae3992d4c59b1a76de8da04a4d0f22948e9335e byte-identical on disk and in Git at HEAD; status=BRIEF-ACCEPTED; 0 D-ids ; 224 declared product files; 25 declared child(ren), argv file-first under 20 fixed root(s) with only --test --test-reporter=tap permitted; 0 declared move(s), each naming its own original executable in a relative require specifier (moves are refused outright under this runner [cut]); no successor carriers declared (every inherited gate must be carried by a parent-pinned executable); 5 byte-identity carrier(s) declared SUPERSEDED under a PM line recorded by sha256 0c2d0db53471, each with its own named and executed evidence
B PACKAGE S8 PARENT OPTION S7 M2-S7-PORT-ADMISSION rebuild/m4/spec/acceptance-s7-port-admission.json 350f56885c5eb55eecada58cadfb011656ddc58b82fc8fdc514ddc4503af791b ACCEPTED at e7fb94be36e13db1ff29d70a3e7ee3078f1e7f14 (DECISIONS:518); artifact byte-identical on disk, in Git at that commit and on refs/remotes/origin/rebuild/t2-client-core; review rebuild/m4/spec/review-s7-port-admission.json 2819e4aa22dd byte-identical on disk and on that branch; receipt base c081cbd is an ancestor of it
B PACKAGE S8 PARENT BOUND S7 rebuild/m4/spec/acceptance-s7-port-admission.json 350f56885c5eb55eecada58cadfb011656ddc58b82fc8fdc514ddc4503af791b; single-parent chain holds [cut]
B PACKAGE S8 POSTFIX M2-S8-REAL-SHAPE REVIEW-PENDING mode=--ci
B PACKAGE S8 ENVELOPE ABSENT; rebuild/m4/spec/acceptance-s8-real-shape.json is not sealed yet [cut]
B PACKAGE S8 PARENT PINS RE-ASSERTED at run time; 2 pin(s) from rebuild/m4/spec/acceptance-s7-port-admission.json plus its 206 product pins through the inventory below, and 1 un-superseded grandparent pin(s) from rebuild/m4/spec/acceptance-s6-today-child.json, byte-identical on disk AND in Git at HEAD; 207 superseded pin(s) preserved in Git at sourceBase 8ebc860; parent artifact byte-identical in Git at e7fb94be36e13db1ff29d70a3e7ee3078f1e7f14
B PACKAGE S8 PRODUCT IMPLEMENTED; 42 at the declared post-image / 0 at the pinned pre-image / 182 carried byte-identical from the parent / 0 declared role "pinned-unchanged" [cut] / 0 unlisted drift; the inventory covers all 206 parent-pinned product files; 1 declared role "superseded-by-child" over a parent EXECUTION pin, each equal to the parent byte (rebuild/lanes/b/tooling/packages/S7.json)
B PACKAGE S8 FIDELITY OBSERVED; sourceBase 8ebc860 ancestor of HEAD 30dd4c0; 9 engine/conform/m4-spec/lane-b-tooling file(s) changed since sourceBase, all in the fixed inventory; runner e31dd206c0fb and spec 6fbbb1b901c2 pinned (artifact not sealed yet); 16 of 18 PIN_PATHS present in this tree and byte-identical Git vs disk; 2 not in this tree and therefore vacuous (rebuild/conform/goldens rebuild/conform/manifest.json)
B PACKAGE S8 FAIL RECEIPT-EXACT-LINE-MISSING; required evidence missing or failed; local diagnostics withheld
EXIT=1
```

**`RECEIPT-EXACT-LINE-MISSING` is the only refusal, and it is the right one.** The run reaches
`authority(s, bound)` with SPEC, PARENT OPTION, PARENT BOUND, ENVELOPE, PARENT PINS, PRODUCT and
FIDELITY all OBSERVED, and stops on the three ledger lines that do not exist yet. This is S7's own
pre-ruling terminal shape at `e62c100`, line for line. My terminal agrees with the author's report
in every figure. The first refusal of the chain, R01, I re-derived rather than re-ran: at `1af78de`
`IDS` has no `'S8'` and the argv gate (`b-package.cjs:581` there, `:603` here) refuses any id not in
`IDS` before a spec file is opened, which is exactly what the empty red-first commit `1ac0c72`
records and what the author's `%TEMP%\s8out\r01.log` shows.

**(8) Suites, re-run by me.** Nine lane B tooling suites **106 tests / 106 pass / 0 fail**, exit 0
(F6 and F7 among them). The five `s8-supersede-*` cells **16/16** and
`s8-engine-files-differential.cjs` exit 0 with its 27 / 18 / 45 sentence, measured as children.
today-17 **682 / 0** (the five CHILD_SPECS byte-pin cells `DECISIONS:523` left red are green here,
and `measure-hermetic` 11/0 covers `boundary.test.mjs`). VERDICT-S6.md **rule (b)** re-measured
directly: `rebuild/coach/test/engine-revision.test.cjs` + `rebuild/m4/import/test/production-mapping.test.cjs`
(P3-M3) + `rebuild/m4/import/test/production-admission.test.mjs` (P3-P6-SEAL-WINDOW) run together
are **34 / 34 / 0 fail** with the CI flag at S8, `receipts/S8.json` absent and the coach constant
still at `M2-S7-PORT-ADMISSION@3fd8d36bd4268f14`; the window branch of `standingSeal()` is what
holds it, and no cell was edited to make it hold.

**(9) `rebuild.yml`, rule (a).** The standing step is flipped INSIDE the package, before
`proposed()`: `run: node rebuild/lanes/b/tooling/b-package.cjs --ci --package S8`, and the step NAME
moves with it to `Cumulative S8 real shape, S7 port admission, S6 today child, S5 today child, S4
real day, S3 companion, H3 clean-init, native-carrier and legacy-census evidence`, which is the
`:501` carry honoured. A second step gives the lane cells a CI home by exact path, never globbed:
the six `p3-real-shape` cells and the two `p3-layout-v2` cells. The file's declared `post`
`8403d10b...` matches disk and HEAD.

**(10) Housekeeping.** Six commits, all `cowork (Earned PM) <joeymat11@gmail.com>`, each ending in
the two required trailers; `1ac0c72` deliberately empty and saying so, in S7's `aa2d6e3` shape.
HEAD equals `origin/rebuild/d-p3-real-shape`. No ref other than the lane branch moved. Nothing
under `rebuild/conform/private`, `ledger/`, `src/history.js`, `EarnedPort`, `port-relay` or any
"soak" path was read, named or hashed by me or by this round's diff. No token appears anywhere.

## NOTES

**N1 (PM decision, not an author error). The two P3-LAYOUT-V2 cells are given a CI home by a pinned
product file but are sealed by nothing.** `rebuild/lanes/d/p3-layout-v2/layout-v2.test.mjs` and
`projector-parity.test.mjs` are named by exact path in the `rebuild.yml` step this package edits, so
they run on both runners, but they are not declared product and `rebuild/lanes/d/p3-layout-v2/` is
not a `CHILD_ROOT`. The author is right on the rule as written: `:523` names "the lanes/d/p3-real-shape
cells" and only those, and `:487` stop 7 makes a `lanes/d` file product only when a declared child
EXECUTES it, which no declared child of S8 does. He is also right to refuse to mint the licence
himself, and he names the omission in the brief (2.5) and in `notes[6]` rather than burying it.

What it COSTS, measured so the PM can price it: after S8 seals, a pinned workflow step invokes two
files whose bytes no package declares, so the five `CHILD_SPECS` drift cells and every parent-pin
re-assert are blind to them; the gap 5 closure of `:523` is proved by cells that a later round can
edit without any seal noticing. Closing it is four declarations: `rebuild/lanes/d/p3-layout-v2/` as
a twenty-first `CHILD_ROOT` (one more literal in F7, three assertions), the two cells as role `new`
`pre: null`, and one more declared child executing them (or their two paths appended to the
`d-real-shape` child's argv, which would move that child's needle from `# pass 56`). It also moves
`b-package.cjs`, so `runnerSha256`, the six ancestor specs, `packages/S8.json`, the brief and the
BRIEF-BY-SHA line all re-measure. NOT BLOCKING: nothing is unproved today, the cells run in CI, and
the alternative is a package declaring product `:523` did not give it. **PM to rule.**

**N2. The author's em-dash census is incomplete as stated.** His report says the U+2014 on added
lines are "all inside the two verbatim ledger lines S8.json carries in `authorizations.owner`/`.contract`".
Measured over every added line of `git diff -U0 1af78de..HEAD`: SIX added lines carry a U+2014, two
in `packages/S8.json` (the two historical ledger lines, which must stay byte-exact and are therefore
correct) and FOUR in `rebuild/lanes/b/S8-PREP-AUTHOR-REPORT.md`, each a verbatim quotation of a
runner terminal line whose U+2014 the runner itself prints. No authored prose and no product file
carries one, so the lane rule is not broken; the sentence in the report is. Prose only; the author
report is not declared product and no sha binds it. Correct it in `VERDICT-S8.md` or leave it,
but do not repeat the sentence as written.

**N3. One over-claim in a comment inside a product file.** The `rebuild.yml` comment this round adds
ends "that is the expected pre-ruling state, and the brief predicts the exact refusal." The brief
predicts R01 verbatim (5.1 (1), the USAGE REFUSED string and exit 1) and points at the author report
for the rest of the chain, but the brief never names `RECEIPT-EXACT-LINE-MISSING`; the author report
does, six times, with exit codes and log paths. The claim is true of the report and loose about the
brief. Nothing measurable turns on it, and correcting it moves `rebuild.yml`'s post, S8.json, the
brief and the BRIEF-BY-SHA line for one word, which is not worth a round. S7 carried its own
equivalent (the brief's 3.3 five-versus-six slip) into `VERDICT-S7.md` uncorrected on purpose; do
the same here.

## What I did NOT verify, stated so it is not assumed

The refusals R02 to R05 of the chain are the author's own measurements on intermediate commits and
on a scratch compile; I re-derived R01 from the code and re-ran R06 on this head. I did not run
`--full` (no private junction, and this seat runs `--ci` only), so `PRIVATE ORACLE PRESENT`, the
45-law phase, the historical audit and the nine SUPERSEDED gates are unexercised by any run on this
branch; the `s8-supersede-*` evidence children I ran directly instead. The GATE-SUPERSESSION line
cannot be located by the runner until the PM appends it, so `supersessionRuling()` and
`coverage()` have still never executed against this package.
