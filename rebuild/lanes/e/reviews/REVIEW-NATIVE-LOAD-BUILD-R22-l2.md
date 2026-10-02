# REVIEW-NATIVE-LOAD-BUILD-R22-l2 (Fable, independent reviewer l2 of NATIVE-LOAD build round 22 + 22b; blind to the builder's reasoning)

Reviewed: earned-nlr, branch rebuild/e-native-load-red, HEAD bd7654a798592a7dae421b9d68fec850fb0993d1, the UNCOMMITTED working tree
after round 22b (git status --porcelain with explicit paths: M FC12 rebuild/m4/spec/native-load-options.test.cjs, M FA03
rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs, M rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md, ?? the l1 review;
git diff --numstat with the same eight explicit product/test paths: FC12 +142/-0, FA03 +22/-0, report +129/-0). Inputs read in
this order: the l1 REJECT (rebuild/lanes/e/reviews/REVIEW-NATIVE-LOAD-BUILD-R22-l1.md: B-R22-1 and D-R22-1), the object diff
(git diff -- FC12: 142 added lines read whole; git diff -- FA03: 22 added lines, unchanged since l1), spec R9.13 at 7ef8291
(cmd-redirected git show into scratch; section N (iv) :597-604 and (v) :606-611), the product regions the rows exercise
(FC03 :249-273 projectHeld/heldProjection, L/source-admission.mjs :840-863 A-LEGACY-VECTOR; E/today.cjs :55 and :97,
E/earn.cjs and E/writers.cjs only by git grep with explicit paths for 'unlock' and 'done'; none of the protected five), and
the builder's Round 22b report section LAST. Every node run went through node %TEMP%\pm-run.cjs shared (jobs fable-r22-l2-A,
fable-r22-l2-B, fable-r22-l2-probe), guard preload nlr-build\guard.cjs ("GUARD protected-in-cache: none; refused: none"
checked in every TAP), TZ America/New_York, MEASURED_TEST_NOW 2026-09-03, NODE_PATH via the existing junctions. Mutants are my
own in-memory preload (scratch ov.cjs: one replacement, required to occur exactly once, on the source the CJS loader compiles
and on the text fs.readFileSync returns; the child's "# L2MUT <id> applied {...}" line checked in every mutant TAP); anchors
are mine, built from the product bytes above, not the builder's, not l1's, not Astra's. No product file was written. Scratch:
%TEMP%\nlr-r22-l2-scratch (hash.cjs, mk.cjs, ov.cjs, run.ps1, planA/planB, jobA/jobB.cmd, mut-*.json, tally.cjs, witness.cjs,
probe-x6.cjs, probe.cmd, out\*.txt, progress.txt). This review is the only new file; no tracked file was edited; nothing
committed, pushed, fetched, or written to DECISIONS/STATUS; nothing run or written in the PM's S10 worktree. Every fixture
value below is invented.

## Q1. Product bytes byte-identical to bd7654a? YES (node sha256 of the working file vs git cat-file blob, byte-exact)
- FC03 rebuild/m4/workout/native-load-effects.cjs SAME b25d2e611245cc5725ff79040cfcc60dcda1f05856f2ea51fcd71ea8c4cfc522 (92274 B)
- L/source-admission.mjs rebuild/m3/w6/local/source-admission.mjs SAME 10bd5cfbf0f591dbfba652b64c514d270345230664c5785c33aea8cabf07157d (74465 B)
- FC01 rebuild/engine/native-load.cjs SAME 92a4a0b4e693af00dcbfe0bfdf6fa75a9a2026690ff11ff674f58bae4755fdd1 (51352 B)
- W/engine-capture.cjs rebuild/m4/workout/engine-capture.cjs SAME fa68a748680b5b646c52c769f9a2ff2d30b0846417887a9e0a5374e55f43aee4 (11278 B)
- w6 admission test rebuild/m3/w6/test/local-source-admission.test.mjs SAME bcc6df4d02a9c3cf71af50410996b5cebfee4bc830040c27eb1e0f119c53ec4e (20125 B)
- FC12 DIFF: head 76dbee6d422df1f8a2e2bbf548360adcb111910ec379e58c6163c4c94f93ecbd (516028 B) -> work
  666f6431c0c13496dbe09c7c82625194b3d14f194329ea047a36f3b24df19d9a (537366 B); FA03 DIFF: head 285027b0... (106387 B) -> work
  51cbeeb175607d10193c634076521732c0fc0c6d48b7b80624df0716aa592058 (108911 B, the l1 bytes exactly); report DIFF: head 0657385e... -> work
  7efbffe1ce91f0c52ddf1e61c10ecc19930fb107a66bf2810f9eb593cf81b2e4 (247041 B). CR 0 and non-ASCII 0 in all eight files.
- The builder's claim "product bytes byte-identical before and after, and match the blobs at bd7654a" is what the bytes measure.

## VERDICT: REJECT (one blocker, B-R22L2-1, test bytes only; B-R22-1 and D-R22-1 are PAID; the head product is correct)

Both l1 items are paid exactly as the builder says: the two L14-B3b rows are the only killers of my own N5 overlay, and
R22-ABSENT-DONE-ALV / R22-ABSENT-DONE-HIDDEN are the only killers of my own N4 and E1 (Q3). The four L14 overlays still go red
only on round-22 rows, and all 235 pre-round-22 rows stay green under every overlay. The reject rests on the commissioned Q4
criterion: one of my eight new single-clause mutants, X6 (FC03 :271 hide predicate `HIDDEN_LEGACY_KINDS.has(q.kind)` ->
`q.kind === 'debut'`, so a legacy UNLOCK entry on an unheld w-null lift stays visible), survives all 244 FC12 rows and all 48
FA03 cells, and differs from spec (v) RULE and INVARIANT ("every unfinished LEGACY debut/unlock entry ... of EVERY lift whose
projected w is null or ABSENT"; "no registered projection carries an unfinished debut/unlock entry ... of a lift whose w is
null or ABSENT") on an in-rule input, shown by probe (head hides it, X6 shows it). The fix is one FC12 row (below); no product
byte needs to move; no STOP.

## Q2. Does each new (round 22b) row assert the SPECIFIED R9.13 outcome, not the head's incidental output? YES, all four
- L14-B3b-SHIFT-ANCHOR-ALL-BELOW-W (FC12 test 241): w 100, wSets [95,95,90] (every set strictly below w; P holds since every
  element <= w), newW 105 -> newWSets [100,100,95]. That is (iv) CONVERSION `ex.wSets.map((x) => x + (q.newW - ex.w))` evaluated
  by hand (+5 on every set), not read off the head. Also asserts "nothing else is written" (deep-equal after deleting newWSets,
  plus an explicit [w, wSets, newW] = [100,[95,95,90],105]), PROPERTIES "every element is <= q.newW", the real capture gives the
  vector, and the unconverted control refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED (W/engine-capture.cjs :83, the (iv) "where
  it refused before" sentence). This is exactly the l1 B-R22-1 input; it separates ex.w from max(wSets), first set and last set.
- L14-B3b-SHIFT-ANCHOR-ALL-BELOW-W-FRACTIONAL (242): w 100, inc 2.5, wSets [97.5,97.5,92.5], newW 102.5 -> [100,100,95]
  (+2.5 exactly, no rounding); the same six assertions. The l1 fractional probe input.
- R22-ABSENT-DONE-ALV (243): (iv) DEFINITIONS "q.done falsy": an entry whose done key is deleted (asserted absent by
  Object.hasOwn before and after) converts to [105,105,100] like its done:false twin, nothing named, the key still absent, the
  capture gives the vector, the control refuses :83; the twin comparison is a deep-equal after removing only the twin's own
  done:false key. Under N4 the entry is skipped (newWSets undefined), which is the specified difference, not a pin of the head.
- R22-ABSENT-DONE-HIDDEN (244): (v) RULE "not done", EXPECTED CARD and THE CHECK on legacyOverNullBase() with fx-press's entry's
  done key deleted: the fold keeps both entries pending (key still absent), the registered projection hides fx-press's entry
  (0 visible) and keeps fx-row's (1), deep-equals the done:false twin's projection, fx-press's card is the baseline ask
  [null,null,null] and fx-row's debut takes the slot [60,60,60], the check refuses NATIVE_LOAD_LEGACY_PENDING refs [C1 Close
  Ref] field 'queue', afterwards w null / no authority / no 'adopt:' receipt / entry pending with no done key; host v1 and typed
  v2, R1 and R2. Every clause maps to a sentence of (v) quoted in the title. Every value is invented (fx-press, fx-row, 60, 100,
  105, 102.5). No row pins a head-only value.
- Round-22 rows (B1/B1-UNDO/B2/B3/B4, FA03 B1-HOST) are unchanged since l1 (FA03 bytes identical; FC12 diff hunks appended
  after them); l1's Q2 reading stands and I do not repeat it.

## Q3. My own overlays for N5, N4, E1 and M01/M02/M03/M10, whole FC12 (244 rows) and whole FA03 (48 cells)
Mechanism: ov.cjs (mine) patches the one anchor in memory; applied counts in the child TAP were {source-admission.mjs:1} for
every ALV text mutant and {native-load-effects.cjs:2} for every FC03 mutant in FC12 (the loader compile plus FC12's own utf8
text read of FC03; no FC12 row failed on the text read under any FC03 mutant, see the red lists) and :1 in FA03.
| Overlay (my anchor -> mutant) | FC12 | rows red (test no.) | FA03 | rows red |
| --- | --- | --- | --- | --- |
| head (no overlay) | 244/244 exit 0 | none | 48/48 exit 0 | none |
| M01 FC03 :270 `x && x.w == null` -> `x && x.w === null` | 242/244 | L14-B1-ABSENT-W-PROJECTION (236), L14-B1-ABSENT-W-UNDO (237) | 47/48 | L14-B1-ABSENT-W-HOST |
| M02 ALV `q.newWSets!==undefined)continue;` -> `q.newWSets!=null)continue;` | 243/244 | L14-B2-EXPLICIT-NULL-NEWWSETS (238) | n/a | |
| M03 ALV `x=>x+(q.newW-ex.w)` -> `x=>x+(q.newW-ex.wSets[0])` | 241/244 | L14-B3 (239), L14-B3b (241), L14-B3b-FRACTIONAL (242) | n/a | |
| M10 ALV `x=>x+(q.newW-ex.w)` -> `x=>Math.round(x+(q.newW-ex.w))` | 242/244 | L14-B3 (239), L14-B4 (240) | n/a | |
| N5 ALV `x=>x+(q.newW-ex.w)` -> `x=>x+(q.newW-Math.max(...ex.wSets))` | 242/244 | L14-B3b (241), L14-B3b-FRACTIONAL (242) | n/a | |
| N4 ALV `||q.done||` -> `||q.done!==false||` | 243/244 | R22-ABSENT-DONE-ALV (243) | n/a | |
| E1 FC03 :271 `&& !q.done && HIDDEN_LEGACY_KINDS.has(q.kind);` -> `&& q.done === false && ...` | 243/244 | R22-ABSENT-DONE-HIDDEN (244) | 48/48 | none (host tier has no absent-done cell; D-R22L2-2) |
Red-first witnesses (the failing assertion's actual vs expected, from the TAP): N5 on 241 [105,105,100] for [100,100,95] and on
242 [102.5,102.5,97.5] for [100,100,95] (the l1 probe values exactly); N4 on 243 newWSets undefined for [105,105,100] (the entry
skipped); E1 on 244 [1, 1, 'ENGINE_CAPTURE_BASELINE_UNPROVEN'] for [0, 1, [null,null,null]] (the entry shown and the capture
refuses the whole day at W/engine-capture.cjs :67); M03 on 239 [107.5,112.5,110] for [102.5,107.5,105]. Under every overlay
all 235 pre-round-22 rows, all five round-22 rows not named for that overlay, and all 47 pre-round-22 FA03 cells stay green:
only new rows fail; each new row fails under its own mutant and passes on the head. B-R22-1 PAID (N5 killed only by the two
B3b rows, which is the sensitivity it was meant to add; M03 is now also killed by them). D-R22-1 PAID at FC12 (N4 and E1 each
killed by exactly one new row).

## Q4. Eight NEW single-clause mutants around the ALV shift and the done/hide predicates, whole FC12 under each (FA03 for FC03 ones)
| Mutant (file, my anchor -> clause) | Result | Killed by |
| --- | --- | --- |
| X1 ALV shift anchored on `Math.min(...ex.wSets)` | K 235/244 | the nine ALV-reading rows: R913-ALV-CONVERT, -KINDS, -LAND, L14-B2, L14-B3, L14-B4, both B3b, R22-ABSENT-DONE-ALV |
| X2 ALV shift anchored on `ex.wSets[ex.wSets.length-1]` (last set) | K 235/244 | the same nine |
| X3 ALV `x=>Math.min(x+(q.newW-ex.w),q.newW)` (clamp at newW) | LIVE 244/244, EQUIVALENT | none possible: under P every x <= ex.w so x + (newW - w) <= newW; an out-of-P entry never reaches the map (named at the guard above it). No observable difference on any input. Not a finding. |
| X4 ALV `||q.done||` -> `||q.done===true||` (a truthy non-boolean done is treated as not done) | LIVE 244/244 | none: differs from "q.done falsy" only for done values like 1 or a string; see D-R22L2-1 |
| X5 FC03 :271 `!q.done` -> `q.done == null` (hide only absent/null done, not done:false) | K 238/244; FA03 46/48 | R8-PROPERTY walk, R20-RESTORE-OVER-LEGACY, R913-LEGACY-OVER-NULL-UNHELD, L14-B1 x2, R22-ABSENT-DONE-HIDDEN; FA03 R913-LEGACY-OVER-NULL-HOST, L14-B1-ABSENT-W-HOST |
| X6 FC03 :271 `HIDDEN_LEGACY_KINDS.has(q.kind)` -> `q.kind === 'debut'` (a legacy UNLOCK on a w-null unheld lift stays visible) | LIVE 244/244; FA03 48/48 | none: BLOCKER B-R22L2-1 |
| X7 ALV `x=>x===ex.w?x+(q.newW-ex.w):x` (only sets equal to w shifted) | K 235/244 | the same nine as X1 |
| X8 FC03 :270 `x.w == null` -> `x.w === undefined` (ABSENT-only nullW set) | K 240/244; FA03 47/48 | R8-PROPERTY walk, R20-RESTORE-OVER-LEGACY, R913-LEGACY-OVER-NULL-UNHELD, R22-ABSENT-DONE-HIDDEN; FA03 R913-LEGACY-OVER-NULL-HOST |
Every killed mutant is killed by a non-revision-pin assertion; with M03 (first), N5 (max), X1 (min), X2 (last) and X7
(equal-to-w only), every set-based anchor the input space admits is now killed, max only by the B3b rows.

### B-R22L2-1 (BLOCKING under the Q4 criterion; test bytes only): the (v) hide rule is not pinned for the UNLOCK kind
- X6 narrows FC03 heldProjection's hide predicate (:271) from `HIDDEN_LEGACY_KINDS.has(q.kind)` (debut, unlock; :250) to
  `q.kind === 'debut'`. Spec (v) RULE hides "every unfinished LEGACY debut/unlock entry (typeof native_load_spend !== 'string',
  not done, kind in HIDDEN_LEGACY_KINDS) of EVERY lift whose projected w is null or ABSENT", and its INVARIANT reads "no
  registered projection carries an unfinished debut/unlock entry, native or legacy, of a lift whose w is null or ABSENT". Every
  legacy entry in FC12 and FA03 on a w-null/absent lift is kind 'debut' (legacyOverNullBase, absentW, R20-RESTORE-OVER-LEGACY,
  the walk's legacy draws, FA03's demo-press entries); the only 'unlock' rows (R913-ALV-KINDS) sit on a numeric-w lift, so
  the kind clause of (v) is exercised by no row.
- Observable difference on an in-rule input (probe-x6.cjs, FC03 heldProjection over a minimal fold with no hold, run head vs
  X6 under the guard; out\probe-x6.log): fx-press with a pending legacy UNLOCK newW 60 -> head: 0 visible unfinished fx-press
  entries in the registered projection for w null and for w ABSENT (the specified outcome; fx-row's debut kept, 1); X6: 1 visible
  for both (the debut twin: 0 under both; control on w 100: 1 under both, as (v) requires). Derived consequence at the card,
  from the product bytes: E/today.cjs :55 (pickStructural) and :97 pick `q.kind === "debut" || q.kind === "unlock"` alike, so
  a visible legacy unlock over a null w makes isDebutNow true and card.w = q.newW numeric over a null w, which
  W/engine-capture.cjs :67 refuses for the whole day (ENGINE_CAPTURE_BASELINE_UNPROVEN): exactly the failure (v) exists to
  remove, and the same path the E1 witness above measures for the debut kind. Reachable within the spec's own stated domain:
  no rebuild writer mints kind 'unlock' (git grep on E/earn.cjs, E/writers.cjs, E/today.cjs: readers only), so every unlock
  entry is an admitted old-app entry, the very input (iv)/(v) govern; the spec names the kind explicitly.
- Fix (one FC12 row beside R913-LEGACY-OVER-NULL-UNHELD or the L14-B1 rows, test bytes only, e.g. R913-LEGACY-OVER-NULL-UNLOCK):
  legacyOverNullBase() with fx-press's entry kind 'unlock' (and, in the same loop or a twin, the ABSENT-w form via absentW):
  the fold keeps the entry pending, the registered projection hides it (0 visible) and keeps fx-row's, the card is the baseline
  ask and the day prepares, fx-row's debut takes the slot; the check on the baseline-ask completion is asserted at whatever FC01
  :222 measures for an unlock (the builder records it; a difference from LEGACY_PENDING [Close Ref] 'queue' is reported, not
  hidden); afterwards w null, no authority, no receipt. Red under X6 (probe: 1 visible; by the E1 witness the card assertion
  would read ENGINE_CAPTURE_BASELINE_UNPROVEN), green on the head (probe: 0). One FA03 cell with demo-press's entry kind 'unlock'
  would close the host tier too (the PM's call, as with D-R22L2-2).

## Q5. Did any existing row change, weaken or disappear? NO
git diff --numstat -- FC12 FA03 report: +142/-0, +22/-0, +129/-0; 0 deleted lines anywhere. The 22b hunk is appended after
L14-B4-FRACTIONAL-ALV (FC12 :5225 onward; rows at :5232, :5239, :5249, :5262); the round-22 hunks are appended after R913-TYPED-C2-CARRIED (:5137) and, in FA03,
after R913-LEGACY-OVER-NULL-HOST (:1307); the l1 review's Q5 reading of those stands. No new top-level const in 22b (noDone,
legacy, pressQ are test-local); the file parses and runs (a duplicate const would be a SyntaxError). Every pre-existing row
passes on the head (240 -> 244) and, per Q3, stays green under all seven overlays, so none was weakened to pass.

## Q6. Counts (final bytes, my runs)
FC12 whole: 244 tests, 244 pass, 0 fail, 0 todo, 0 skipped, exit 0 (18 s; the R7 and R8 walks at their defaults). FA03 whole:
48 tests, 48 pass, 0 fail, 0 todo, 0 skipped, exit 0 (25 s). FC12 235 -> 240 (round 22) -> 244 (round 22b, +4 rows: 241-244);
FA03 47 -> 48 (round 22), unchanged in 22b.

## Q7. Hygiene
- FC12 537366 B sha256 666f6431c0c13496dbe09c7c82625194b3d14f194329ea047a36f3b24df19d9a; FA03 108911 B
  51cbeeb175607d10193c634076521732c0fc0c6d48b7b80624df0716aa592058; report 247041 B
  7efbffe1ce91f0c52ddf1e61c10ecc19930fb107a66bf2810f9eb593cf81b2e4; CR 0, non-ASCII 0 in all three (no U+2013/U+2014); LF.
  The builder's FC12 and FA03 hashes (report section 5) re-measure equal.
- Unchanged product (Q1): FC03 b25d2e61..., L/source-admission.mjs 10bd5cfb..., FC01 92a4a0b4..., W/engine-capture.cjs
  fa68a748..., w6 admission test bcc6df4d... (full hashes above; equal to the bd7654a blobs byte-exact).
- GUARD "protected-in-cache: none; refused: none" in every TAP and in the probe; no protected-five file read or loaded; the w6
  admission cells not run (STOP-R21B-1 stands, CI-only). No FC03 hunk, so no ISSUANCE hunk and no revision move.
- Carried debts (Astra L14 and earlier, the PM's): D-L12-ISSUANCE, D-L14-HOST-MUTANTS, D-L13-TYPED-C2, D-R13-LEGACY-OVER-NULL-ASK,
  D-R13L1-3, D-R13L1-2, D-L14-RECOVERY, D-L12-CUSTODY, D-L12-CONFIG, D-L14-CALIBRATION, D-L14-CI, D-L14-OWNER. D-L14-LEGACY-NULL
  PAID (round 22, L14-B2). B-R22-1 PAID. D-R22-1 PAID at FC12.

## NAMED DEBTS (new; carry by name unless the PM closes them)
- D-R22L2-1 (LOW): the truthy-non-boolean `done` shape. X4 (ALV treats only done === true as done) survives 244/244. Spec (iv)
  says "q.done falsy"; the two differ only for a done value like 1 or a string, on which the mutant would write newWSets onto a
  finished entry ("UNCHANGED BY THE RULE: done entries"). Every engine writer sets done to a boolean (E/earn.cjs :79,
  E/writers.cjs :196 :269 :288 :310 :330 :2246 write `done = true`; every push writes `done: false`) and every reader tests
  truthiness (E/today.cjs :55 :97, FC03 :256 :271, FC01 :222 per the builder), so the shape is unreachable from any rebuild
  writer; whether the old app wrote one is not readable from this seat. One FC12 row (an entry with done: 1 or done: 'x' left
  byte-identical by the conversion) closes it if the PM wants the class closed.
- D-R22L2-2 (LOW; the builder's own disclosure, named here so it is tracked): E1 (FC03 :271 `q.done === false`) survives FA03
  48/48 because no host cell carries an entry without a done key; FC12 pins the same FC03 function (R22-ABSENT-DONE-HIDDEN).
  One FA03 cell beside R913-LEGACY-OVER-NULL-HOST with demo-press's pending DEBUT carrying no done key closes the host tier.

## Builder's Round 22b section (report :1095-1161, read LAST): TRUE on every point I could measure
The counts (244/244, 48/48; 242/243/241/242 under M01/M02/M03/M10; 242/243/243 under N5/N4/E1; E1 48/48 at FA03), the kill
table (rows 236-244 by test number, identical to mine cell for cell), the red-first witnesses (the same failing assertions and
actual values as under my overlays), the sha256 list, the numstat (+142/-0, +22/-0), the hygiene line, the "beyond the brief"
X1/X2 anchors (235/244 each, killed by the same nine rows as mine) and the debts paragraph all re-measure as stated. The
builder's overlays were built from the l1 descriptions; mine are independent and agree. The section could not mention
B-R22L2-1 (a kind-clause mutant outside every anchor family the l1 review named); its disclosed FA03 gap is D-R22L2-2 here.

## What I could not do
Run the w6 admission cells or anything loading the protected five; the 80-file broad set (exclusive; not in the brief; no
product byte moved); measure X6's card-level consequence through FC12's composed engine (cardLoads needs engineAt and the
capture adapter; derived instead from E/today.cjs :55/:97 and W/engine-capture.cjs :67, the same path the E1 witness measures
for a debut); read the old app's src to settle the reachability of an unlock over a null w or a non-boolean done.

## AAR
- Asked: blind level-2 review of rounds 22 + 22b (test-only payment of l1's B-R22-1 and D-R22-1): Q1-Q7, own overlays for
  N5/N4/E1 and M01/M02/M03/M10, six-plus new mutants, verdict with named debts.
- Happened: product bytes re-hashed unchanged against the bd7654a blobs; four 22b rows read against R9.13 (iv)/(v); seven own
  overlays each red only on the intended new rows with 235 + 47 pre-round rows green; eight new mutants: five killed, one
  provably equivalent (X3), one live on an unreachable-from-rebuild shape (X4, debt), one live with a specified difference
  shown by probe (X6, the unlock kind of the (v) hide rule): blocker, one FC12 row to close.
- Went well: one overlay preload with a mandatory exactly-once anchor and per-child applied counts made every kill a measurement
  in about 6 minutes of shared-slot time; the builder's numbers reproduced cell for cell.
- Went badly: the live mutant is on the clause next to the one round 22b pinned (done) and in the set (v) names in its first
  sentence (debut/unlock); two rounds pinned the debut kind only, and no reviewer before this one mutated the kind clause.
- Change next time: when a rule enumerates a set (kinds, states, revisions), add one row per member the fixtures do not
  already cover before the first review, and mutate the set membership, not only the predicate around it.
- Verdict: REJECT on B-R22L2-1 (one FC12 row, test bytes only; probe red/green shown); B-R22-1 and D-R22-1 PAID; D-R22L2-1 and
  D-R22L2-2 named.
