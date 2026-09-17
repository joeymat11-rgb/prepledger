# M2-S6-TODAY-CHILD - independent review, round 1

VERDICT: REJECT

Reviewer: Opus high, independent. Subject `936457349c2a7bb7d319058d8d0603b6b0dca400` in a detached
worktree, clean tip control `2a269bd8` in a second; every number below was measured here.

## Verified clean

- **Citations.** Method validated on S5 first (460 -> `00f955e7`, 461 -> `2e84f849`,
  462 -> `f9de6a7b`, each matching the field S5.json was sealed with), then 488 -> `a824d88d`,
  489 -> `6044b121`, 490 -> `f2e3fe74`. `S6.json` carries `6044b121...` for :489 and the runner
  resolves :490 as `f2e3fe7412f2`. The brief on the branch is `8a9a63ee...`, 41900 bytes.
- **Merges.** At each merge commit, `git diff <frozen head> <merge commit> -- <that branch's own
  paths>` is EMPTY for `c-s6-small 6fad3472` (4df46c7) and `b-s6-child-tail d1001da9` (43104a3).
  For `c-p3-import-ui-2 4c3a5474` (6a5e5be) 14 of its 21 paths are taken verbatim and SEVEN
  combined - the five conflicts the author lists, plus two more (finding 7).
- **No engine byte.** `git diff 0635f4b6 HEAD -- rebuild/engine` and the same against 2a269bd8 are
  both empty; `git diff 0635f4b6 2a269bd8` is `rebuild/DECISIONS.md | 2 ++` and nothing else, so
  merging the moved tip instead of rebasing costs no product byte.
- **No guard weakened.** `CHILD_SPECS` is `['H3','S3','S4','S5','S6']` in all five cells;
  `problem.test.mjs:1582` carries the module-level const with its rule stated where the old inline
  pin stood, red side intact. `rebuild.yml:127` is still `--ci --package S5`.
- **The runner.** `--ci --package S6` reproduced: PUBLIC CI EVIDENCE PASS, all 21 children OBSERVED
  exit 0 at their exact needles, PRODUCT IMPLEMENTED 37/0/96/54, 0 unlisted drift, all 114 parent
  pins covered. `--ci --package S5` red at `SEALED-PROFILE-RECOMPUTATION`, exit 1, after SPEC
  OBSERVED and PARENT BOUND print.
- **The flake, re-proved here.** Base as shipped: journey 3/3, 54 s. Base with the pre-fix
  `settle(rounds)` default cut 24 -> 12 in a scratch worktree (reverted after): cell (a) RED,
  `no trial table rendered`, one of the two recorded windows-latest symptoms. Subject under real
  machine starvation (24 CPU hogs, `UV_THREADPOOL_SIZE=1`): 3/3 GREEN, exit 0, 327 s against 147 s
  idle - a 2.2x slowdown absorbed because no budget is left to exhaust. Subject with
  `MEASURE_SETTLE_DEADLINE_MS=40`: the new red side fires loudly, naming slot, ms and turns. A cause
  fix, not a widened timeout; `settle` has no caller outside `measure/test/{support,journey}`.
- **Declaration counts.** My own `git ls-files` walk gives tracked counts identical to the report's
  for every paired root (w6/local 13, w6/host 13, w6/test 83, m4/import 30, w7/import 9, measure 15,
  today 57), and the brief's 89 split 66 declared / 23 not - see finding 2.

## Findings

1. **BLOCKING - this merge turns a green lane D guard red, and the disposal is to leave the suite
   undeclared and unrun.** Measured both sides: `lanes/d/p3-replay-all` is **26 pass / 0 fail** on
   the clean tip and **25 pass / 1 fail** on the subject; `writer-enumeration.test.mjs:68` P3-EN1
   fails on `body-composition-class.cjs#body-composition-source`,
   `measure-replay.cjs#body-composition-source`, `sleep-replay.cjs#sleep`. The diagnosis is right
   and the refusal to edit another lane's guard to go green is right. The disposal is not: the
   ticket orders a `d-replay-all` child and the brief's row 19 requires the lanes/d classes closed,
   yet the four cells and `replay-registry.cjs` are left out of the product map, out of
   `rebuild.yml` and out of the children - while `CHILD_ROOTS` AND `PUBLIC_TAIL_ROOTS` are widened
   to `rebuild/lanes/d/p3-replay-all/` for them. A package whose warrant is DECISIONS:186 (3), a
   file with no CI home is a file nobody runs, cannot ship a suite it made red into exactly that
   state. Lane D's ruling (three declared reasons in the register, or an enumeration that excludes
   the lazy Import route) and a round 2, not a seal.

2. **MAJOR - the sealed package miscounts its own disclosure.** `S6.json` note line 1317 says
   "89 new files; 67 are declared here. The 22 that are not...". Measured: **66 declared, 23 not**,
   which is what the author REPORT says; the artifact is the one that gets a sha256. The error is
   the enumeration: `m4/import/test/s3/` has SIX undeclared paths (`browser-entry.mjs`,
   `current-head.cjs`, `harness.test.mjs`, `mutations.cjs`, `run.mjs`, `s3-portable-sources.json`),
   not "the four test/s3 harness files and its .json fixture". The same undercount is in the
   report's stop 1, whose list sums to 22 under a headline of 23.

3. **MAJOR - `w6/host/plan-edit-host.mjs` is filed under "glue nothing executes", and a declared
   child does execute it.** `lanes/d/plan-edit/durable-host.test.mjs:37` and
   `browser-build.test.mjs:13` both reach it by
   `new URL('../../../m3/w6/host/plan-edit-host.mjs', import.meta.url)`, and both stand in the argv
   of the declared child `d-plan-edit`. The EXCLUSION is mechanically correct - `executedClosure`
   (`b-package.cjs:627-643`) matches only relative `require(...)`/`import(...)`/`from '...'`
   specifiers, so a constructed URL is invisible to it - but the stated REASON is false, and false
   about one of the three DECISIONS:473 runtime files the custody hole is named for. It belongs in
   the second group, reached only by a constructed path, and the PM's choice between "widen
   executed" and "accept the shorter list" turns on that difference.

4. **MAJOR - bar row 23 is reported PASSED and its stated method was never executed.** The brief
   measures row 23 by a CELL proving an import admitted under `M2-S5-TODAY-CHILD@0df73b01f3d2d935`
   is still ADMITTED, ADOPTED and RETRACTABLE after the constant moves. No such cell exists:
   `git grep MAPPING_ID` over every tracked `.cjs`/`.mjs` returns the construction site, the export
   and six assertions comparing the value against ITSELF (`production-mapping.test.cjs:86,89,181,
   229`, `production-admission.test.mjs:91,150`). The substituted whole-tree static scan looks sound
   to me - nothing compares a stored id against a current one and `qualify()` reads neither - but an
   argument with no red side is not the row, and "Row 23 PASSES" overstates it.

5. **MINOR - F7's title states a rule its own cell contradicts.** `test('F7 - ... M2-S6-TODAY-CHILD
   adds exactly eight', ...)` asserts `CHILD_ROOTS.length === 17` and `deepEqual`s a NINE-element
   `slice(8)`. The body says so ("A NINTH, rebuild/m3/w6/test/, is the author's correction"); only
   the title is stale, and a re-pin's rule has to read true at the line a reader lands on.

6. **MINOR - a privacy surface widened for a suite this package refuses to run.**
   `PUBLIC_TAIL_ROOTS` gains `rebuild/lanes/d/p3-replay-all/`, so that directory's stdout may be
   PRINTED in CI while no declared child executes anything under it. A decision with no consumer
   this round: let it follow the child, or withhold it.

7. **NOTE - two auto-merged both-sides files are undisclosed.** `rebuild/lanes/c/P3-RUNBOOK.md` and
   `import/test/support.mjs` changed on both sides and git merged them without a conflict.

8. **NOTE - stops 4, 6 and 7 are correct as written.** Two `PUBLIC_TAIL_ROOTS` rather than the
   brief's three is the :487 reading and I agree; `page-bundle.test.mjs` does carry the literal
   `ledger/`. `RETIRED_IDS` is literal, guarded, pinned by F6, and closes a real problem. The rebase
   warning is mechanically right: UI-2 branched at `47a223d7`, well behind the tip.

## Tails measured here

```
B PACKAGE S6 PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict; the 19 original gates, the private oracle and independent exact-artifact acceptance remain separate, and POSTFIX PACKAGE PASS is unavailable on this mode at any time   EXIT=0
B PACKAGE S6 PRODUCT IMPLEMENTED; 37 at the declared post-image / 0 at the pinned pre-image / 96 carried byte-identical from the parent / 54 declared role "pinned-unchanged" - executed by a declared child, produced by nothing / 0 unlisted drift; the inventory covers all 114 parent-pinned product files; 2 declared role "superseded-by-child" over a parent EXECUTION pin
B PACKAGE S6 LAWS 45/45 executed | TOTAL 45 laws - 45 RED-frozen - 39 RED-candidate - 89 GREEN repair controls - 97/104 mutant executions DETECTED - 0 HARNESS_ERROR - AUDIT RED-FIRST FAIL
B PACKAGE S6 COVERAGE 0/19 original gate(s) covered by 0 executed child(ren); 9 SUPERSEDED under DECISIONS:490 (defect-witnesses 1, inherited-carriers 3, second-gate 1, source-carriers 3, writers-differential 1); 10 re-execute under --full
B PACKAGE S5 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld   EXIT=1
ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine file(s) outside this package's declared product, all byte-identical to the parent; 18 named and NOT ONE moves, so all 45 tracked rebuild/engine file(s) stand byte-identical to the parent's own post;
CHILDREN, all 21 OBSERVED exit 0 at their exact declared needle: today-17 # pass 681, measure-hermetic 11, s4-real-day 15, a0-journeys 23, s6-sup-* 4/3/3/3/3, d-plan-edit 68, m4-import 62, m4-import-production 24, d-import-retract 13, d-admission-swap 4, d-replay-measure 9, d-capture-start 14, food-live-save 6, w7-import 35, w6-host-seams 9, w6-local-source 25
COACH C5 tests 231 / pass 231 / fail 0 EXIT=0 (engine-revision.test.cjs green: the standing id is still S5) | RIG187 => PASS, EXIT=0 | A5 lockfile 44/44 EXIT=0 | new W6 step 25/25 EXIT=0 | new P3 step 35/35 EXIT=0
p3-replay-all ON THE CLEAN TIP 2a269bd8: tests 26 / pass 26 / fail 0.  ON THE SUBJECT: tests 26 / pass 25 / fail 1 - not ok 10 - P3-EN1 'a writer in the shipped page has NO replay family and no declared reason'
FLAKE base 2a269bd8 as shipped 3/3 in 54114 ms; base with settle(rounds) 24 -> 12: pass 2 / fail 1 - not ok 1 - P-MEASURE (a), error: 'no trial table rendered'
FLAKE subject under 24 CPU hogs + UV_THREADPOOL_SIZE=1: tests 3 / pass 3 / fail 0, 326597 ms, EXIT=0
FLAKE subject with MEASURE_SETTLE_DEADLINE_MS=40: not ok 1 - P-MEASURE (a), error: 'MEASURE-SETTLE-DEADLINE: waited 57 ms over 5 macrotask turns for the measure screen to finish loading into either its marker pick or its trial table, which never arrived.'
```

Round 2 must carry: the three unmet bar rows (16, 17, 19) the author names, finding 1's lane D
ruling, findings 2-6 with 2-4 corrected in the SEALED artifact and not only in the report, the
B-LOM merge last with every post re-measured, and row 23 re-run as a cell before the constant moves.
