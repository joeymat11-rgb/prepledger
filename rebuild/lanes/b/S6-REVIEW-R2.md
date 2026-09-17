# M2-S6-TODAY-CHILD - INDEPENDENT REVIEW R2 (Opus high, lane B)

VERDICT: ACCEPT

Subject `c8abf4be879cb3e810210d3e2c155e79d3a935f0`, fetched into `%TEMP%\earned-s6-rv`,
detached, tree clean, tip `2364b98` an ancestor. Node 24.19.0, `TZ=America/New_York`,
`MEASURED_TEST_NOW=2026-09-03`. Every figure below I ran here; none is read from the report.

## 1. The four merges, byte-faithfulness measured

For each merge I took the merge-base of its two parents, listed every file the LANE side
moved, and diffed each between the lane head and the merge result. `d87e1bd` tip `7c77d0b6`:
1 lane file, 0 differ, DECISIONS +1 line. `c9c9927` `d-en1-route-graph 196717cf`: 3 lane
files, 0 differ, 0 both-sides. `36604de` `d-b-lom da7d5b37` LAST (`:492`): 13 lane files and
EXACTLY ONE differs, the declared conflict `import/test/page-bundle.test.mjs`;
`today-bindings.mjs` and `gym.test.mjs` (the sealed moves), `source-admission.mjs` and
`p3-capture-start/capture-start.test.mjs` all stand at B-LOM's byte. `81fb080` the tip again
at `2364b98`: 2 added lines. No merge commit touched a first-parent-only file. The
resolution carries BOTH sides and re-measures rather than sums: P3-B2 is 141 with B-LOM's
`assert.ok(...legacy-order-mapping.cjs)` kept, P3-B5's delta is 19 with the boot move
121 -> 122 written where the old figure stood, and a NEW `ROUTE_MODULES.length === 18` is
added beside it. Both re-pins state their rule at the old pin; nothing is relaxed.

## 2. Declarations, walked against the tree myself

`packages/S6.json` declares 196 paths; roles 94 carried / 20 edited / 25 new / 55
pinned-unchanged / 2 superseded-by-child, as reported. I re-hashed every declared file from
disk: 0 missing, 0 post-image mismatch. Tracked/declared per brief root: `w6/local` 13/11,
`w6/host` 13/10, `w6/test` 83/3, `m4/import` 30/22, `plan-edit` 8/5, `p3-replay-measure` 2/2,
`p3-replay-all` 4/4, `p3-capture-start`, `import-retract`, `p3-followons` and `b-lom` 1/1
each, `w7-preview/import` 9/9 - the brief's 89 less 17, so 72 declared, and the 17 named in
the report are each tracked and each undeclared, none left over and none missing. I rebuilt
the children's executed closure myself (241 files) and NOT ONE of the 17 is inside it.
`w6/host/plan-edit-host.mjs` is declared `pinned-unchanged` (MAJOR 3 closed);
`replay-registry.cjs` and the four `p3-replay-all` cells are declared and `d-replay-all` runs
them with its own rebuild.yml step (BLOCKING 1); the skeleton `packages/B-LOM.json` is gone;
the stop note now reads 72/17 and names the SIX `m4/import/test/s3` paths (MAJOR 2).

## 3. The cells I executed, including every red side

BAR ROW 23: `production-admission.test.mjs` 8/8. MY OWN MUTANT, not the author's -
`createProducerRegistry.qualify()` made to refuse when a mapping's stored `engine_revision`
differs from the coach constant read at call time: 7 pass / 1 fail, `P3-P6` ALONE red,
reverted, `git status` empty. Not vacuous: it asserts the two digests DIFFER before asserting
the record reads back unchanged, re-qualifies through `reopen()` on a registry built after
the rotation, and moves no `rebuild/coach` byte.
B-LOM CARRIES: the pair is 30/30 and `LOM-S6` is present by name. MY OWN MUTANT - the wrapped
projector's `importAnchor: mapping.anchor` forwarding removed from `today-bindings.mjs`: 18
becomes 13/5, red at LOM-S6, LOM-A and LOM-B in both seasons; reverted, tree clean. BAR ROW 4
is green on the merged tree in winter EST and summer EDT. NO-IMPORT BYTE IDENTITY, my own
probe both seasons: LOM-E is summer as shipped and green; I forced its `season` to WINTER,
re-ran the file 18/18 green, reverted. `d-replay-all` 28/28; `w7-preview/import` 35/35 (so
`route.test.mjs` is green untouched and carries no module-count pin at all);
`pinned-unchanged-and-ruled-substitutions` 16/16 with F10 carrying its control AND its bound;
`today-17` 682/682; `package + design + child-diagnostic-tail` 33/33; coach 231/231, standing
id still S5. A1 re-run here: 3 assets, 140 pinned inputs, build `earned-8993e0805f69`, boot
graph 122 - the report's figures to the byte. A5 PASS, 13 files, 11 precached. `rig187 =>
PASS`. `git diff 2364b98 HEAD -- rebuild/engine rebuild/coach` is EMPTY; the round 2 diff
touches 27 files, none under either root, and adds 0 CRLF.
CITATIONS BY SHA256, computed here: DECISIONS:489 hashes to `6044b121f50648383605fecc0636
d81a347acd5d0f41fde3eb36180ccd1885e8`, the value `brief.acceptedLedgerLine.lineSha256`
carries; :490 hashes to `f2e3fe7412f2...`, which the runner's SPEC OBSERVED line locates the
token clause by; the brief hashes to `8a9a63ee...` at 41900 bytes, matching :489 and
`brief.sha256`; :488 is the THEME line at its stated position; the runner on disk is
`8d9a94c20faa...`, the value `tooling.runnerSha256` and the re-pinned specs carry.

## 4. Findings

1. MINOR - THE DASH COUNT IS FOUR, NOT THREE. Report R8 says "exactly THREE added lines in
   the whole round 2 diff carry one". I scanned `f04d50f7..HEAD`: FOUR - the two new
   rebuild.yml step NAMES and TWO PM ledger lines (`:493` and `:494`), not one. The ledger
   lines are the PM's own bytes, so the tree is fine and the sentence is what is wrong.
2. MINOR - THE SEALED ARTIFACT'S ROUND 2 NOTE IS STALE BY ONE MERGE: `S6.json` notes[7] opens
   "Three merges, in this order" while the tree carries four, the fourth made after that note
   was written. The report's R1 is right and says four; the note is what a later reader lands
   on, so it is what to reconcile if the PM wants them to agree.
3. NOTE - THE FOURTH MERGE IS NOT STRICTLY DECISIONS-ONLY: `81fb080` brings `:494` plus one
   line of lane D's EN1 report, the integrator's CI note, where step 6 said DECISIONS only.
   Disclosed in the report; a lane report, not product; no product byte moves.
4. NOTE - THE TODAY-CHILD FLAKE IS REDUCED, NOT RETIRED, AND I SAW IT ONCE. My first and third
   `--ci --package S6` runs both reached PUBLIC CI EVIDENCE PASS exit 0; my SECOND overlapped
   another agent's CPU-hog probe on this same PC (its `hog.cjs`/`starve-subject.bat` are in a
   shared scratch directory) and failed CHILD-REQUIRED-EXIT-ZERO with `today-17` at 681/1,
   while the same argv run alone immediately after was 682/682. Round 1 argued MACHINE
   starvation cannot reproduce this class because it slows the drain too; this says that is
   narrower than written. Not a defect of round 2, but row 29 wants it in hand.
5. NOTE - LOM-S6's CONTAINMENT HALF IS A SOURCE-TEXT ASSERTION: half one is executed on the
   real route and is strong, half two proves "the wrapped projector is the sole facts source"
   by reading `today-bindings.mjs` and matching two literals once each. Honest, with a real
   red side (I measured it), but blind to a SECOND builder added in another module.
6. NOTE - THE CUSTODY HOLE OUTSIDE THE BRIEF IS 105 FILES WIDE: my closure walk finds 105
   tracked files a declared child really executes and no package declares (most of
   `m3/w6/test`, much of `m4/workout` and of `today/`) - the standing TODAY-TREE-CUSTODY
   ticket (`:482`, widened at `:487` stop 3), not a round 2 regression, but a number for that
   ticket rather than one to rediscover.

Nothing this round weakens a law, a guard or a test: `executedClosure` reading a RELATIVE
`new URL(..., import.meta.url)` still demands a relative literal resolving to a real file,
the tenth CHILD root only adds an entry, `PUBLIC_TAIL_ROOTS` stays at two with its consumer.

## 5. Tails, verbatim from my own runs

```
B PACKAGE S6 PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict; the 19 original gates, the private oracle and independent exact-artifact acceptance remain separate, and POSTFIX PACKAGE PASS is unavailable on this mode at any time   EXIT=0
B PACKAGE S6 PRODUCT IMPLEMENTED; 47 at the declared post-image / 0 at the pinned pre-image / 94 carried byte-identical from the parent / 55 declared role "pinned-unchanged" - executed by a declared child, produced by nothing / 0 unlisted drift; the inventory covers all 114 parent-pinned product files; 2 declared role "superseded-by-child" over a parent EXECUTION pin
B PACKAGE S6 LAWS 45/45 executed | TOTAL 45 laws - 45 RED-frozen - 39 RED-candidate - 89 GREEN repair controls - 97/104 mutant executions DETECTED - 0 HARNESS_ERROR - AUDIT RED-FIRST FAIL
B PACKAGE S6 COVERAGE 0/19 original gate(s) covered by 0 executed child(ren); 9 SUPERSEDED under DECISIONS:490; 10 re-execute under --full
B PACKAGE S5 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld   EXIT=1 (SPEC OBSERVED and PARENT BOUND printed first)
CHILDREN 23 of 23 CHILD lines read "exit 0 ... exact declared verdict at line start", engine-files-differential among them, so the ENGINE FILES DIFFERENTIAL needle printed byte-exact
A1 TODAY BUILD PASS: 3 assets; 140 pinned inputs (15 engine, 12 client); build earned-8993e0805f69; Today boot graph 122 modules, carrying no migrate.cjs, no merge.cjs and none of the m4/import lane
A5 PWA BUILD PASS: 13 files; 11 precached and pinned by sha256   EXIT=0   |   rig187 => PASS   EXIT=0
coach 231/231 | today-17 682/682 | p3-replay-all 28/28 | b-lom 30/30 (mutated wrapper 13/5)
production-admission 8/8 (mutated qualify() 7/1, P3-P6 alone) | w7-preview/import 35/35 | pinned-unchanged 16/16 | package+design+tail 33/33
```

The private census, `--full`, the 10 re-executing gates, the oracle and the exact-artifact
acceptance are the PM's; row 29 cannot be run from here; `m4-import-s3` stays undeclared for
a cause I confirmed. SYNTHETIC ONLY: no `rebuild/conform/private`, `ledger/`,
`src/history.js` or any EarnedPort or soak path was opened, listed, named or hashed here;
every mutant I applied was reverted and the tree is clean apart from this file.
