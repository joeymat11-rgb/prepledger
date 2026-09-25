# REVIEW-NATIVE-LOAD-BUILD-R21-l2 (Fable, independent reviewer l2 of round 21: the 21c test/report bytes and the R9.13 paper edits)

Reviewed: earned-nlr (40eb702) uncommitted working tree after round 21c, against REVIEW-NATIVE-LOAD-BUILD-R21-l1.md (read whole first) and
the builder's 21c report section (report :999-1032). Bytes re-hashed here: FC12 76dbee6d (516028 B), report 0657385e, FC03 b25d2e61 (unchanged),
CR 0 and ASCII only for all three; the pre-21c FC12 in the builder's scratch (nlr21c\fc12-f5380f51.cjs) re-hashes to f5380f51, so the 21c diff
is exactly `git diff --no-index` of those two files: 77 insertions, 29 deletions, all inside FC12 (read whole). Spec: e092afa's blob (cef5ade5,
extracted byte-exact with git cat-file) plus the R21 l1 review's spec913.diff reconstructs 085ca374 byte-exact (381267 B); the astra-96 working
tree is eb619d95 (384796 B, 621 lines, LF, ASCII); the 21c paper diff is 5 insertions, 3 deletions at :594, :597, :619 and two new lines :620-621.
Every run went through node %TEMP%\pm-run.cjs shared (jobs fable-r21-l2-p1, -p2), guard preloaded ("GUARD protected-in-cache: none; refused:
none" in every TAP), TZ America/New_York, MEASURED_TEST_NOW 2026-09-03; mutants and old forms in memory only (nlr-build\r17c\overlay.cjs).
Scratch %TEMP%\nlr21-fable2 (run.ps1, p1.txt, p2.txt, ov-*.json, out\*.txt, out\*.json, tally.cjs). Nothing committed, pushed or written to
DECISIONS.md; no protected-five file opened or loaded; no worktree file edited other than this review.

## VERDICT: ACCEPT WITH NAMED DEBTS (D-R21L1-2 stays carried by name for the part the rule cannot reach; one PM ruling asked: the transform form)

Round 21c is test and paper bytes only (no product byte moved, re-hashed). D-R21L1-1 is paid, F5 (a) is paid, D-R21L1-2 (a)-(c) are built
and measured honestly, and the paper edits change no rule. The builder's departure from the brief's prescribed R8 transform is correct and
was necessary (the prescribed form fails the rule's own precondition, re-shown here); it needs the PM's ruling because it is a departure.

## 1. D-R21L1-1 (refsArm's empty-refs clause): PAID
- R913-REFS-ARM-EMPTY (FC12 :4991) re-uses reduceI6 with the new optional third argument ({exitRefs, noExit}); the three existing reduceI6
  calls are byte-unchanged (diff). Control (no exit record) and the empty-refs case are both asserted, R1 and R2.
- My fable-m2 overlay (FC03 "return ar.length > 0 && ar.every(ok)" -> "return ar.every(ok)", OVERLAY applied 1) re-run here: the row is 0/1,
  red at R1 (out\m2-row.txt: the forged record gives EFFECT_CONFLICT load_basis [r21-exit] with the exit SPENT, the unverified adoption the
  l1 review predicted). Whole FC12 under fable-m2, default run: 235 tests, 234 pass, 1 fail = R913-REFS-ARM-EMPTY only (out\m2-whole.txt).
  The builder's m2-old-whole (f5380f51 swapped in memory, m2 applied): 234/234, so m2 survived the pre-21c file, as the l1 review measured.
- Wording deviation accepted: the l1 example said "card unchanged"; the measured card is the baseline ask because RECORD_INVALID holds the
  lift (the same hold L13-B1-REDUCE-I6 pins); nothing is raised. Pinned as measured is right.

## 2. F5 (a) KNOWN_RED: PAID
- KNOWN_RED, knownRed and both call sites are gone (git grep: the only remaining mention is the explanatory comment at :4925); the four
  L13-B1 rows are ordinary tests. Default whole-file run here: 235 tests, 235 pass, 0 fail, 0 todo (out\whole-fc12.txt).

## 3. D-R21L1-2 (spec (viii) WALK-I3-PARTIAL-ORDER)
- (a) Precondition present and asserting. PROVEN (FC12 :1309) reads FC03's own `function provenBefore(` block and `const text` line out of
  the product file and evaluates them as written (checked against FC03 :25 and :287-300: the function uses only text, Set and Array, so the
  extracted copy is the product function); provenPairs lists every ordered pair with provenBefore([a], b); orderKept throws
  TRANSFORM_ORDER_CHANGED, which the walks' catch does not treat as PROPERTY_COUNTEREXAMPLE, so the test fails loudly (never a skip).
  Re-shown here: (1) the round-21a R8 form with orderKept after it (my overlay ov-r8-21a-precond.json, applied 1) at seed 20261001 RUNS 1:
  TRANSFORM_ORDER_CHANGED, 26 pairs added, 0 dropped, all "<x> < fx-p-3" (out\red-r8-21a.txt), exactly the builder's finding. (2) My mutant
  fable-l2-m3 (deliveryTransform's one-at-a-time fallback deleted, every plan op moved unconditionally; ov-m3-nofallback.json, applied 1) at
  seed 20261001: TRANSFORM_ORDER_CHANGED, the same 26 pairs (out\m3-nofallback.txt), so the final orderKept assertion is load-bearing on its
  own, not only apply()'s internal check. (3) The builder's cause is true: provenBefore compares device_seq only between the two end points
  and walks causal_parents/device_predecessor_op_id without crossing a device's own sequence, so chaining same-device predecessors as parents
  adds pairs whenever an op on another device names a parent on that device; the l1 review's closure argument (transitive happens-before)
  was not the rule's function. The l1 review is corrected on that point.
- (b) R7 transform verdict TRUE. The round-18 R7 form (one global device_seq chain, every plan op on fx-device-B) with orderKept after it
  (ov-r7-r18-precond.json, applied 1) at seed 20260960: TRANSFORM_ORDER_CHANGED, 64 pairs added, 0 dropped (out\red-r7-r18.txt). The same
  overlay over the default range's first 37 seeds (20260923..20260959) passes, so 20260960 is the FIRST default seed the old form breaks;
  the new form is green there (moved 8, kept 0; out\green-r7-20260960.*) and at R8 20261001 (moved 4, kept 2; out\green-r8-20261001.*).
- deliveryTransform (FC12 :1326-1343) read whole: it moves plan ops of each original device d to 'fx-2dev|'+d in original order, gives a
  moved op the staying ops below it as parents and itself to the staying ops above it, tries all plan ops at once, else admits them one at
  a time in (device, sequence) order keeping only those under which the whole relation stays identical, then asserts orderKept and tallies
  moved/kept. apply() resets every op to its original device, sequence and parents before each attempt (orig map), so attempts do not
  accumulate. The R8 'unproven' layout and every invariant, seed and generator are untouched (diff).
- (c) R7 bound counts honest. The builder's four w7 reports re-hashed here = 1be47c64, 79dee628, 3303582a, c43c76bb, each runs 4250,
  found [] (no counterexample of any class), moved 2298+2408+2414+2260 = 9380, kept 0, dup 9871, undo2-yes 89, undo-restore 382, exactly
  the report's numbers; the o7 control shards (round-18 form restored by overlay, applied 1, no precondition) = 9bde03d7, d3351334,
  173cc3c1, 36d19f15, found [] each, same dup/undo counts. My own re-run of shard 20260923 x 4250 (out\w7-20260923.json, 59 s): report
  byte-identical to the builder's (sha256 1be47c64). The w8 Astra-interval shards (af0c2f13, cac971c7, 92add271, 0abb3010: runs 4250 each,
  found [], moved 31650, kept 7170) and the twelve b8 shards (0f7609f3 ... 27c5e15c, all as listed in the report: 51000 runs, found 0,
  moved 94168, kept 22436) re-hash and re-sum to the report's numbers.

## 4. Report additions (round 21c section, :999-1032): TRUE
- Every hash, count and sum in sections 1-4 of the 21c report re-measured here as stated (fin-fc12 35248ef4 = 235/235/0 todo; fin-l13-strict
  3838b590 = 11/11; fin-rows 173b08e9 = 11/11; fin-fa03 2a072700 = 47/47; the walk hashes above). The PM rulings paragraph carries N-Q1..N-Q4
  as the brief states them. F4's correction is the accurate statement (the conversion is a uniform shift, never above newW). The one thing
  I could not measure: the report's "twelve public factories compose" GUARD line in the whole-file TAP is a test title, not a guard line;
  the guard line itself is "protected-in-cache: none; refused: none" in every file (checked).

## 5. Spec paper edits (085ca374 -> eb619d95, section N only; compared with the R13 l1 review's reading)
- :594 N (ii) (F3): the rule sentence gains "over a given fold (the same fold state, holds and issues at the check) ... such a change is an
  ISSUANCE change" and the FOLD-ONLY exemption gains "it can change which fold the check is given ... never what the check issues over a given
  fold", with a bracketed F3 marker. The (a)-(e) list, the FOLD-ONLY list and the ROUND 21 classification are byte-unchanged. This is the
  second of the two resolutions the l1 review offered ("the issuance function over a given fold"); under it the four round-21 FC03 hunks are
  FOLD-ONLY by the sentence as well as by the list, so no classification changes and N-Q4 is not decided by wording. Not a rule change.
  NOTE for the PM: the F3 resolution is recorded only by the spec editor's marker; the PM RULINGS paragraph (:620) does not name it. If the
  PM adopts it, the ledger line should say so (one clause), since REVISION-MOVES is normative and the choice between the two readings was
  the PM's to make.
- :597 N (iv) PROPERTIES (F4): the false "trailing sets stay equal or lower" clause is replaced by the true statement (shape kept exactly, a
  uniform shift) with the [95,100,100] -> [100,105,105] example and "no set is above q.newW either way". Conversion formula, P, INVARIANT,
  IDEMPOTENT, DIGESTS and OUT OF PRECONDITION unchanged. A correction of a false property claim, not a rule change (the R13 l1 review's F4
  reading, "raises nothing above the old app's card; mints no entry", still holds and is what the rows assert).
- :619 heading pointer and :620 PM RULINGS: N-Q1 (unconverted, refuses at W/engine-capture.cjs:83 as today: true, :83 is the original.wSets
  arm and fires because card.w = newW differs from original.w), N-Q2 option (a) carried as D-R13-LEGACY-OVER-NULL-ASK, N-Q3 unreachable
  (re-checked: git grep over rebuild/m3, rebuild/m4 and the named non-protected engine files finds takeProposedDebut only at its definition
  E/writers.cjs:187 and in the writers export list :2935; report :971 states the wider grep), N-Q4 deferred with "no FC03 ISSUANCE hunk may
  land", carried as D-R13L1-2. The DECISIONS:823 citation cannot be checked from these worktrees (their DECISIONS.md has 582/578 lines);
  taken from the PM's brief.
- :621 FABLE R13 L1 DEBTS: D-R13L1-1 PAID is true (refsArm is defined once at FC03 :363 and called at :482 and :762 with the same facts,
  byId, issues; git grep, no second copy). D-R13L1-2 carried by name. D-R13L1-3 carried by name with P unchanged: the R13 l1 review offered
  "add >= 0 to P or name the case", and naming it is that option; :85's `x>=0` check is the refusal cited (read). D-R13L1-4 PAID is true: the
  spec editor did not re-read FC12, so I did: R913-LEGACY-OVER-NULL-UNHELD :5057 asserts [ex1.w, authority undefined, no 'adopt:<lift>'
  receipt string in the fold state, the legacy entry still pending] = [null, true, false, [['DEBUT',60]]] after the baseline-ask completion,
  for host v1 and typed v2 under R1 and R2 (the l1's "no adoption receipt" is measured as the absence of E/writers.cjs:347's receipt key).
- Header line :5 still says "Four open questions for the PM": outside section N, left by the editor; a stale sentence, not a rule.
  All 621 lines LF, ASCII only, no U+2013/U+2014 (re-measured).

## 6. Findings
G1 (for the PM to RULE; the builder asked): the R8 delivery transform is not the brief's prescribed form ("causal parents plus same-
  original-device predecessor"). The prescribed form fails spec (viii)'s own precondition on the first default seed (26 pairs added; re-shown
  here) because provenBefore is not transitive across a device's sequence; the replacement moves an op only where the relation stays
  identical, which is the rule's own permission ("move only where that adds no pair"). The replacement is correct and the only form the
  rule admits under FC03's function. Ruling asked so the departure is the PM's, not the builder's. Recommended: accept, and record in N
  (viii) that the transform is the identity-preserving move under provenBefore, one at a time where needed.
G2 (MEDIUM, named limit; carry as D-R21L2-1 unless the PM folds it into D-R21L1-2): under the rule about 18% of R8 plan ops (7170 of 38820
  in Astra's interval, 22436 of 116604 over the three bounds) cannot move, so I3 compares them in their original layout; every R7 plan op
  moves (kept 0). This is the most (viii) permits under provenBefore, so the walk's I3 reach on those ops is a limit of the rule, not of
  the build. The builder named it; it should be a named debt so the number is tracked, not a sentence in a report.
G3 (LOW, paper): see the NOTE in section 5, F3's resolution is by marker only; and :5's "Four open questions" is stale.
G4 (INFO): the l1 review's F2 (a) said the 21a R8 closure argument was sound; it was sound for transitive happens-before and wrong for
  provenBefore. Recorded here so the l1 text is not read as a second measurement.

## 7. Runs on the final bytes (mine, pm-run shared)
- FC12 whole (default): 235 tests, 235 pass, 0 fail, 0 todo (out\whole-fc12.txt). FA03 whole: 47/47 (out\fa03.txt).
- R7 shard 20260923 x 4250: found 0, report sha256 1be47c64 = the builder's.
- R8 shard 13024001 x 4250 (Astra's interval, new transform; 377 s): found 0, moved 7980, kept 1878, report sha256 af0c2f13 = the builder's
  byte-identical. Both walks are deterministic and the builder's shard reports are what the bytes produce.
- Red-first re-shown in memory only: m2-row (0/1), m2-whole (234/235, the new row the one failure), red-r8-21a (26 pairs), red-r7-r18 (64
  pairs), m3-nofallback (26 pairs); green-r8-20261001 and green-r7-20260960 1/1 each. Overlay/guard lines in every TAP (out\*.txt).

## 8. What I could not do
- Run the w6 admission cells or anything loading the protected five (STOP-R21B-1 stands). - Check DECISIONS:819/:823 (not in these
  worktrees). - The 80-file broad set (exclusive; not in the brief; no product byte moved in 21c).
