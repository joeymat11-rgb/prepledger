# REVIEW-NATIVE-LOAD-BUILD-R22-l5 (Fable, independent reviewer l5 of NATIVE-LOAD build round 22 + 22b + 22c + 22d + 22e; CONVERGENCE check after my l4 sweep; blind to the builder's reasoning)

Reviewed: earned-nlr, branch rebuild/e-native-load-red, HEAD bd7654a798592a7dae421b9d68fec850fb0993d1, the UNCOMMITTED working tree
after round 22e (git status --porcelain with twelve explicit paths: M FC12 rebuild/m4/spec/native-load-options.test.cjs, M FA03
rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs, M rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md, ?? the l1, l2, l3 and l4
reviews; git diff --numstat with eleven explicit product/test paths: FC12 +413/-0, FA03 +142/-0, report +409/-0, nothing else).
Inputs read in this order: my l4 review (B-R22L4-1, B-R22L4-2, D-R22L4-1..3; sha256 bc5b3c2f unchanged) and my l4 probe output
that landed after l4 closed (nlr-r22-l4-scratch\out\fc12-p00/p03/p05/p06/p07.txt, job fable-r22-l4-P, 01:11 local); the object diff
(cmd-redirected git diff with one explicit path each, into scratch: FC12 421 lines, FA03 150 lines, read whole; the 22e hunks are
FC12 :5448-5552 and FA03 :1395-1451); spec R9.13 (v) at 7ef8291 (my l3 scratch copy, :606-611 re-read) and the spec's :81
DEPENDENCY paragraph; the product regions the rows and my mutants exercise (FC03 :244-273 HIDDEN_LEGACY_KINDS, projectHeld,
heldProjection; FC01 E/native-load.cjs :189-225 evaluate through the LEGACY_PENDING sites :222 and :223, in particular step 2
:211-216; E/today.cjs :53-59 pickStructural and :89-110 genSession's card; W/engine-capture.cjs :54-95 the capture and :70-73 the
multiple-matching-moves rule; E/writers.cjs :257-305 the old app's own/std/reclaim branches, by Select-String on that one explicit
file and one explicit read; none of the protected five; line numbers measured with Get-Content indexing), and the builder's Round
22e report section LAST (report :1338-1441). Every node run went through node %TEMP%\pm-run.cjs shared (jobs fable-r22-l5-prep and
fable-r22-l5-run, ONE shared slot, the whole campaign sequential in one plan of 146 runs as the brief asked; both took slot-1 after
0 s at 02:08-02:09 local; at 02:22:35 the PM's pm7-yield-fable-l5.ps1 stopped my run after 40 of the 146 lines so that the S10 seal's
exclusive T24 could start, and re-queued the remaining 106 lines unchanged as plan5b.txt / job fable-r22-l5-run-b, which took slot-1
at 02:28:09 after 330 s; I relaunched nothing; the line mid-run at the stop, fc12-w03, was re-run whole), guard preload
nlr-build\guard.cjs ("GUARD protected-in-cache: none; refused: none" present in every TAP, checked programmatically by tally5.cjs),
TZ America/New_York, MEASURED_TEST_NOW 2026-09-03, NODE_PATH via the existing junctions. Mutants are my own in-memory overlays
(ov4.cjs and ov4-esm.mjs byte-copied from my l4 scratch: a CJS preload that applies one replacement exactly once to the source the
CJS loader compiles and to the text fs.readFileSync returns, "# L4MUT <id> applied {...}" in every TAP; a node:module register()
load hook for the ESM host file L/today-bindings.mjs, "# L4ESM <id> applied [...]" marker file); the 65 l3 + l4 mutant JSONs were
re-verified against the CURRENT product bytes (mk5.cjs: 65 + 7 = 72 anchors, every one exactly once, 0 bad) and copied into this
scratch; the 7 new anchors are mine, from the product bytes. No product file and no test file was written. Scratch:
%TEMP%\nlr-r22-l5-scratch (gitread.cmd, hash5.cjs, mk5.cjs, mkplan5.cjs, run5.ps1, ov4.cjs, ov4-esm.mjs, tally5.cjs, witness5.ps1,
prep5.cmd, job5.cmd, launch5.cmd, plan5.txt, mut-*.json, diff-fc12.txt, diff-fa03.txt, diff-report.txt, head.txt, status.txt,
numstat.txt, progress.txt, out\*.txt; the PM's plan5b.txt, job5b.cmd, job5b.pmrun.log/err and PM-NOTE-YIELD.txt). This review is
the only new file; no tracked file was edited; nothing committed, pushed, fetched, checked out or written to DECISIONS/STATUS;
nothing run or written in any other worktree; %TEMP%\earned-astra-137 untouched; no lock file touched by hand. Every fixture value
below is invented.

## Q1. Product bytes byte-identical to bd7654a? YES (node sha256 of each working file vs `git cat-file blob bd7654a:<path>` stdout, byte-exact; hash5.cjs)
- FC03 rebuild/m4/workout/native-load-effects.cjs SAME b25d2e611245cc5725ff79040cfcc60dcda1f05856f2ea51fcd71ea8c4cfc522 (92274 B)
- L/source-admission.mjs rebuild/m3/w6/local/source-admission.mjs SAME 10bd5cfbf0f591dbfba652b64c514d270345230664c5785c33aea8cabf07157d (74465 B)
- FC01 rebuild/engine/native-load.cjs SAME 92a4a0b4e693af00dcbfe0bfdf6fa75a9a2026690ff11ff674f58bae4755fdd1 (51352 B)
- W/engine-capture.cjs rebuild/m4/workout/engine-capture.cjs SAME fa68a748680b5b646c52c769f9a2ff2d30b0846417887a9e0a5374e55f43aee4 (11278 B)
- w6 admission test rebuild/m3/w6/test/local-source-admission.test.mjs SAME bcc6df4d02a9c3cf71af50410996b5cebfee4bc830040c27eb1e0f119c53ec4e (20125 B)
- also SAME (read for the host-tier, check and card mutants): L/today-bindings.mjs 91aa980fc51e78c36f6946a3141e71e3a679ae74b8c78bfba44a805fa4b1d797
  (68749 B), E/today.cjs 685f6e1e907cd9bba268e5d8f6927120172869febe1c747ffb9bd851aa17c45a (47806 B), E/writers.cjs
  c7b11beb6539eac96b68e291a8bdda433510e4a0658986d80ad9647032639739 (259587 B).
- FC12 DIFF: head 76dbee6d422df1f8a2e2bbf548360adcb111910ec379e58c6163c4c94f93ecbd (516028 B) -> work
  bd033a18655b6c29f37a345a7c3d7bd3191ed361ee661786ccad09dbdcca3e37 (583122 B); FA03 DIFF: head 285027b08279297df233eaf532d2f4eb6c527f73b0420457e2f680a4e08297f4
  (106387 B) -> work 6ff4ad3aac89d8ab393b59f983b157a53b96367f76fb2aef67fc07c4cbdc909a (125361 B); report DIFF: head
  0657385e3cb04b11364f8fb23123becbfe8089fe621d22c2a331e5b78f2ac841 (219317 B) -> work 2c92070964e17d91b08328aa5ca4b29ca1de768bc610ba2ace4640274ae23bd8
  (324579 B). CR 0 and non-ASCII 0 in FC12, FA03 and the report. The three hashes the brief names (bd033a18, 6ff4ad3a, 2c92070964)
  are what the bytes measure.
- The l1 (241e3bad...), l2 (b2fcd37d...), l3 (657138e9...) and l4 (bc5b3c2f4aaa112cdb7db45c31e60f91f642bddabaa7ba1f96f20ef5de8c9a75,
  41947 B) reviews are untracked and unchanged.

## Q2. Does each round-22e row assert the SPECIFIED outcome, and are B-R22L4-1, B-R22L4-2 and D-R22L4-1..3 PAID? YES, all seven; all five PAID
- R22L4-CHECK-OTHER-LIFT-UNAFFECTED (FC12 test 255; :5469) pays B-R22L4-1 (k05). r22eOtherLiftBase(true) = legacyOverNullBase() minus
  fx-row's entry: fx-press never held at w null under a pending legacy DEBUT 60, fx-row at w 55 with NO entry. Per v1/v2 x R1/R2 it
  asserts the fold (fx-press's entry pending, fx-row entry-free, no issue on either), the registered projection (fx-press's entry
  hidden, its card the baseline ask, fx-row's card 55 on every set through the real capture), then ONE shared Close (fx-press on the
  baseline ask, fx-row on its 55 card; the v1 form builds the Start's capture per lift with null loads for fx-press and 55 for fx-row)
  and reads THE CHECK on each lift: fx-press refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] 'queue' ((v) THE CHECK); fx-row's
  check is asserted three ways: not LEGACY_PENDING; deep-equal in status, refusal, offers and every basis field but
  basis.plan.structural_queue_sha256 to fx-row's check over the same base WITHOUT fx-press's entry (the twin; the digest hashes the
  whole day's queue, so it is the one byte that lawfully differs, and the row masks exactly that key and nothing else); and exactly
  the measured head outcome, refused NATIVE_LOAD_PROVISIONAL [its Close Ref] field null (the ordinary first top, N03a). That is (v)
  EXPECTED CARD "The day's other lifts are unaffected" pinned at the check, in the singular direction my l4 named (an entry-bearing
  lift beside an entry-FREE lift). Under k05 fx-row's check is LEGACY_PENDING 'queue' (my l4 probe p05 and my Q3 witness below agree).
- R22L4-KEPT-ORDER-OVER-NULL (256; :5505) pays B-R22L4-2 (w07) in two forms, R1 and R2. Part (a), the two-entry form:
  legacyOverNullBase() plus a pending legacy UNLOCK 65 on fx-row after its DEBUT 60. It asserts the fold keeps the three entries in the
  order admitted; hp.queue deep-equals the fold queue minus fx-press's entry (so every kept entry in fold order, pinned directly);
  fx-row's ENGINE card (E/today.cjs genSession, :53-59 and :98) is [60, isDebutNow true], equal to the twin's (the same base without
  fx-press's entry); and the day's REAL-capture outcome equals the twin's: ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED on both. Part (b),
  the structural-slot form: the same base with fx-row's DEBUT 60 alone before a third lift fx-curl (w 45, its own pending legacy
  DEBUT 50): the projection keeps fold order, fx-press is the baseline ask, and through the REAL capture fx-row is 60 on every set
  (the first remaining debut in queue order takes the structural slot, E/today.cjs:55 passes.find) and fx-curl is 45 (its w; not
  active), exactly as over the twin. Under w07 (and my new w09/w11) the kept order flips: fx-row's unlock first in (a) (engine card 65)
  and fx-curl's debut first in (b) (fx-curl 50, fx-row 55). JUDGEMENT ON PART (b): it pins the kept order CORRECTLY and at the right
  observable: the structural slot is the one place the kept ORDER of two different lifts' entries reaches the real capture (:53-59
  picks the first non-coApproved candidate in queue order; the un-picked lift's card is its own w), the fixture is the class (v) already
  names (:606 EXPECTED CARD "the hidden entry no longer takes the day's structural slot (another lift's unfinished debut may be
  picked)"; :608 R913-LEGACY-OVER-NULL-UNHELD "the second lift's debut takes the structural slot"), and
  both the projection order (hp.queue deep-equal) and the card outcome are asserted, with the twin proving the hide changes neither.
  CORRECTION TO MY l4 TEXT: I wrote that in the two-entry form "fx-row's card is 60 on every set on the head and 65 under w07". That is
  true of the ENGINE card (genSession) and of the projection order, which the row pins, but NOT of the real capture: W/engine-capture.cjs
  :72-73 refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED when the debut-now lift carries more than one unfinished debut/unlock entry, with
  or without the hide (my own l4 probe p00 and p07, which landed after l4 closed, show rowCard LOAD_MAPPING_REQUIRED on the head and
  under w07 with projOrder [debut 60, unlock 65] vs [unlock 65, debut 60]). The builder measured the same and pinned the difference
  where the capture can see it (part (b)) and where the engine can (part (a)'s genCard); the row is right and my l4 sentence was too
  strong at the card. JUDGEMENT ON THE CAPTURE RULE: it is a NAMED LIMIT, not a blocker, under R9.13. Spec 7ef8291 :81 names it as a
  DEPENDENCY ("W/engine-capture.cjs:69-70 refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED when the day's card is a debut and the lift
  has more than one unfinished debut/unlock entry, PROPOSED included. Its repair is the THIRD engine change, owner-held (DECISIONS:639,
  :644 D2). This spec does not order, design or assume it."); it is older than R9.13 (revision 3 of the spec, 2026-09-23; the code's
  comment "Multiple matching moves do not prove which load vector won" at :70-71); R9.13 (v) changes nothing about it and the row's twin
  equality shows the hide neither causes nor cures it; its repair is outside grants (a)-(f). Two INFO points: the builder's citation
  ":76-77" (row comment and report) is off by four lines in the fa68a748 bytes, where the rule is :72-73 (comment :70-71; the R9.10 FIT
  hunk moved it from the spec's :69-70), and the reachability of one old-app lift carrying a debut AND an unlock at once is still not
  settled from this seat (the same standing as at l3 and l4).
- R22L4-OTHER-KINDS-CHECK (257; :5528) pays D-R22L4-1 (k03): R22L3-OTHER-KINDS-KEPT's fixture with the debut removed, kind own /
  reclaim / ladder alone on a never-held w-null fx-press, v1/v2 x R1/R2: the fold keeps it pending, the projection keeps it and the card
  is the baseline ask, THE CHECK refuses LEGACY_PENDING [Close Ref] 'queue', and nothing is written (w null, no authority, no 'adopt:'
  receipt, the entry pending). (v) "FC01's LEGACY_PENDING rules ... are unchanged" and FC01 STRUCTURAL :20 (five kinds). Under k03 the
  check offers adopt-baseline (my Q3 witness: ['offer', null, null, null]).
- R22L4-EXERCISE-BRANCH-FIELD (258; :5545) pays D-R22L4-2 (k06): fx-press at w 100 with no queue entry and a legacy exercise branch (std
  [100,100,95] with own true; reclaim [90,90,90]; ladder {set 1}; pendingThird true), one normal completion on the 100 card, v1/v2 x
  R1/R2: THE CHECK refuses LEGACY_PENDING [Close Ref] field 'exercise'. The branch shapes are the old app's (E/writers.cjs :257-305: std
  and reclaim arrays, own a boolean, ladder an object; the same `ex.std && ex.own` test at :279). Under k06 the field is 'queue'.
- FA03 R22L4-ZERO-W-HOST [Y] (cell 52; :1399), R22L4-OTHER-KINDS-HOST [Y] (53; :1416), R22L4-EVERY-ENTRY-HOST [Y] (54; :1435) pay
  D-R22L4-3 (z04, z06, w04/w05 at the host tier): demo-press at w 0 under a pending legacy DEBUT 5 (gym.read ready; every demo-press
  slot specified '5 lb'; demo-row normal; the host projection w 0, [debut, DEBUT, 5] visible, no active issue); a pending own / reclaim
  / ladder entry beside a debut on a never-held w-null demo-press (ready; the baseline ask; the projection hides the debut ONLY and
  keeps [kind, DEBUT, 60]); a DEBUT 60 AND an UNLOCK 65 on a never-held w-null demo-press (ready; the baseline ask; 0 visible
  unfinished debut/unlock, no active issue); each through the durable host on D1 and after a cold reopen on D3. Each is the host form
  of the FC12 row it names (250, 251, 249), and each is (v) at the host tier ("null or ABSENT": 0 is neither; HIDDEN_LEGACY_KINDS;
  "every ... entry").
- Round-22, 22b, 22c and 22d rows are unchanged since l4 (their hunks precede FC12 :5448 and FA03 :1395); the l1-l4 Q2 readings stand.
  New top-level names (r22eOtherLiftBase, r22eAtCard, r22eCaptureBy, R22E_CURL, r22eOrderBase, r22eSlotBase) collide with nothing (the
  file parses and runs 258); the FA03 cells' legacyBasis is cell-local. No row asserts a revision pin; every 22e row loops R1 and R2.

## Q5. Did any existing row change, weaken or disappear? NO
git diff --numstat -- FC12 FA03 report: +413/-0, +142/-0, +409/-0; 0 deleted lines anywhere (counted again from the cmd-redirected
diffs: FC12 413 '+' lines and 0 '-' lines; FA03 142/0; report 409/0). One hunk per file, appended after the last existing row (FC12
@@ -5137,3 +5137,416 after R913-TYPED-C2-CARRIED, the 22e block from :5448; FA03 @@ -1307,3 +1307,145 after R913-LEGACY-OVER-NULL-HOST,
the 22e cells from :1395; the report @@ -1030,3 +1030,412, the Round 22e section from :1338). The diffs carry no '-' line, so the
round-22d bytes are a prefix of the new files and no earlier byte moved. Every pre-existing row passes on the head (254 -> 258, 51 ->
54) and, per Q3 and Q4, stays green under all 72 overlays, so none was weakened to pass. No walk byte moved (the R7 and R8 walks run
inside whole FC12 at their defaults on every run; they tripped w02 and w10 again, so they are live).

## Q3. CONVERGENCE: my whole l3 + l4 mutant set (65) re-run on the final bytes, whole FC12 (258) and whole FA03 (54) under each
Mechanism as at l4 (ov4.cjs / ov4-esm.mjs, my anchors re-verified exactly once on the current bytes). Applied counts in the child
TAP: {source-admission.mjs:1} for every ALV mutant at FC12 (0 at FA03, which never reads that text: n/a, not a kill);
{native-load-effects.cjs:2} for every FC03 mutant at FC12 and :1 at FA03; {native-load.cjs:1} for every FC01 mutant at both files;
the ESM mutants apply through the load hook at FA03 only (marker file present) and 0 at FC12 (n/a). check5.cjs over all 146 TAPs:
guard line present in every one, no anchor error, the applied-0 runs are exactly the 30 n/a pairs (25 ALV at FA03, 5 ESM at FC12),
every TAP counts 258 or 54 tests with 0 todo and 0 skipped, and every exit code in progress.txt (146 lines, none lost this time: one
writer) agrees with its TAP's fail count. The head: FC12 258/258 exit 0, FA03 54/54 exit 0. Test numbers as the TAP counts them.
| Overlay (my anchor -> mutant) | FC12 pass/258; rows red | FA03 pass/54; cells red |
| --- | --- | --- |
| k05 FC01 :222 lift scope `q.exId === lift` -> `true` (l4 B-R22L4-1) | 257; R22L4-CHECK-OTHER-LIFT-UNAFFECTED (255) ONLY | 54 (no host check cell; FC12 pins) |
| w07 FC03 :272 kept entries reversed (l4 B-R22L4-2) | 257; R22L4-KEPT-ORDER-OVER-NULL (256) ONLY | 54 (the host keeps at most one entry beside a hidden one; FC12 pins) |
| k03 FC01 :222 kind set narrowed to debut/unlock (l4 D-R22L4-1) | 257; R22L4-OTHER-KINDS-CHECK (257) ONLY | 54 |
| k06 FC01 :223 field 'exercise' -> 'queue' (l4 D-R22L4-2) | 257; R22L4-EXERCISE-BRANCH-FIELD (258) ONLY | 54 |
| z04 FC03 :270 `x.w == null` -> `!x.w` (l4 D-R22L4-3) | 257; R22L3-ZERO-W-VISIBLE (250) | 53; R22L4-ZERO-W-HOST (52) NEW |
| z06 FC03 :250 kind set widened to STRUCTURAL (l4 D-R22L4-3) | 256; R22L3-OTHER-KINDS-KEPT (251), R22L4-OTHER-KINDS-CHECK (257) NEW | 53; R22L4-OTHER-KINDS-HOST (53) NEW |
| w04 / w05 only the lift's FIRST unfinished entry hidden / hidden only when it has ONE (l4 D-R22L4-3) | 256 / 256; 249, 251 | 52 / 52; R22L4-OTHER-KINDS-HOST (53), R22L4-EVERY-ENTRY-HOST (54) NEW |
| z09 the l3 blocker (only the FIRST hideable entry hidden) | 256; 248, 249 | 52; 51, 54 NEW |
| w01 / w02 / w03 (v) EVERY from the other side / only the first / only the last null-w lift | 256 / 256 / 257; 248+249 / R8-PROPERTY+248 / 248 | 52 / 53 / 53; 51+54 NEW / 51 / 51 |
| w06 the gate some -> every | 253; R913-LEGACY-OVER-NULL-UNHELD, R22-ABSENT-DONE-HIDDEN, R22L2-UNLOCK-OVER-NULL-UNHELD, 251, 256 NEW | 53; 53 NEW |
| w08 the exId scope dropped | 254; the l4 three plus 256 NEW | 54 |
| w10 the kind test by state | 255; R8-PROPERTY, 251, 257 NEW | 53; 53 NEW |
| w12 the kind set plus ladder | 256; 251, 257 NEW | 53; 53 NEW |
| k01 / k02 THE CHECK refs duplicated / field dropped | 246 / 247; the l4 ten/nine plus 255 and 257 NEW | 54 / 54 |
| k04 THE CHECK done clause | 257; R22-ABSENT-DONE-HIDDEN | 54 |
| c01 / c02 / c03 the check's code / field / refs (l3) | 246 / 247 / 246; the l3+l4 sets plus 255 and 257 NEW | 54 each |
| c04 / c05 STRUCTURAL without unlock / the transition-side LEGACY_PENDING | 256 / 256; unchanged kill sets (R22L2-UNLOCK x2 / R8-P2, R17-ANCHOR-LEGACY-LATER) | 54 / 54 |
| m01 `x.w == null` -> `=== null` | 254; 236, 237, 246, 249 | 52; 48, 50 |
| e1 / x6 / x4 (l2, l3) | 257 / 255 / 257; 244 / 245, 246, 249 / 247 | 53 / 52 / n/a 54; 50 / 49, 54 NEW / n/a |
| m02 / m03 / m10 / n5 / n4 (ALV) | 257 / 255 / 256 / 256 / 257: unchanged kill sets | n/a 54 each |
| y01-y06, y08-y19 (ALV, l3 + l4) | 257 / 257 / 256 / 257 / 257 / 257 / 257 / 257 / 248 / 256 / 247 / 255 / 250 / 256 / 257 / 255 / 257 / 257: the l4 kill sets unchanged (no 22e row reads the conversion) | n/a 54 each |
| y07 (newW finiteness dropped) | 258 LIVE, EQUIVALENT (l3 proof stands: parseStrictJson admits no NaN/Infinity) | n/a 54 |
| z01 (native entries of an unheld w-null lift also hidden) | 258 LIVE, EQUIVALENT under the R9.11 :158 INVARIANT (l3 proof stands) | 54 |
| z02 (hide on numeric w too) | 241; the l4 sixteen plus 256 NEW | 53; R22L4-ZERO-W-HOST (52) NEW |
| z03 (held lifts only, the 40eb702 shape) | 245; the l4 eleven plus 255 and 256 NEW | 47; the l4 five plus 53 and 54 NEW |
| z05 (the projection written into the fold state) | 246; the l4 ten plus 255 and 256 NEW | 54 |
| z07 / z08 / z10 (projectHeld default, native-show side, the present gate) | 256 / 234 / 249, the l4 kill sets unchanged | 54 / 51 / 54 |
| r01 R1 vs R2 (the present-revision gate inverted) | 242; the l4 sixteen | 53; N27-B39-HOST |
| h01 / h02 (host registrar / project() on the raw fold; ESM hook) | n/a 258 | 40 / 42; the l4 kills plus 53 and 54 NEW |
| h03 / h05 / h06 (host registrar raw queue / project() raw queue / registrar raw exercises) | n/a 258 | 41 / 44 / 47; the l4 kills plus 53 and 54 NEW for h03 and h05; h06 unchanged (no (v) cell changes an exercise) |
Red-first witnesses from my TAPs (actual for expected): k05 on 255 at "v2 fx-revision-1 fx-row carries no legacy entry: its check is
not LEGACY_PENDING": ["refused","NATIVE_LOAD_LEGACY_PENDING","queue"] (notStrictEqual on 'NATIVE_LOAD_LEGACY_PENDING'); w07 on 256
at "fx-revision-1 R9.13 (v): the registered projection only hides fx-press's entry and keeps every other entry in fold order":
fx-row [unlock 65, debut 60] for [debut 60, unlock 65]; k03 on 257 at "own v2 fx-revision-1 THE CHECK on the baseline-ask
completion (E/native-load.cjs:222)": ['offer', null, null, null] (an adopt-baseline offer) for ['refused','NATIVE_LOAD_LEGACY_PENDING',
[Close Ref],'queue']; k06 on 258 at "std and own v2 fx-revision-1": field 'queue' for 'exercise'; z04 on FA03 52: the card '0 lb' for
'5 lb' (the entry hidden, the w-0 scalar); z06 on FA03 53 at "own 2030-02-04 the host projection": [] for [['own','DEBUT',60]]; w04 on
FA03 54 and 53 at gym.read: 'blocked' ENGINE_CAPTURE_BASELINE_UNPROVEN for 'ready'. Under every overlay all 235 pre-round-22 rows and
all 47 pre-round-22 cells stay green, and every round-22..22d row not named for an overlay stays green; each 22e row fails under its
own mutant and passes on the head; every earlier kill (l1-l4) still kills (each mutant's l4 red set is a subset of its l5 red set;
the only additions are 22e rows and cells, named NEW above). B-R22L4-1 PAID (k05 killed by 255 and by nothing else), B-R22L4-2 PAID
(w07 by 256 only; also my new w09 and w11), D-R22L4-1 PAID (k03 by 257 only), D-R22L4-2 PAID (k06 by 258 only), D-R22L4-3 PAID (z04
by FA03 52, z06 by 53, w04 and w05 by 53 and 54; the host tier now kills every FC03 mutant that FC12 kills except w07/w08/z05, whose
inputs the host cells do not build, as D-R22L4-3 scoped). Of the l3 + l4 live set (z01, y07, k05, w07, k03, k06) four are now killed
and the two equivalents stay equivalent.

## Q4. CONVERGENCE: 7 NEW single-clause mutants where coverage is still thinnest, whole FC12 (258) and whole FA03 (54) under each
Areas: (a) the two clauses of FC01's :222/:223 LEGACY_PENDING sites no earlier mutant touched (the native-spend clause; the std/own
conjunct; the pendingThird disjunct, i.e. 258's per-case teeth); (b) two more permutations of the kept entries, to see whether 256's
two forms have teeth beyond a plain reverse (sorted by exId keeps (a)'s same-lift pair in place and reaches only the slot form;
rotate-by-one reaches both); (c) (v) "unfinished" from the done side (a DONE legacy entry hidden too); (d) the registered projection's
own projectHeld call without legacy (expected equivalent). Every anchor exactly once (mk5.cjs); each mutant is one clause.
| Mutant (clause; file, my anchor -> mutant) | FC12 (pass/258) | FA03 (pass/54) | Result; killed by |
| --- | --- | --- | --- |
| k07 THE CHECK native-spend clause dropped: FC01 :222 `typeof q.native_load_spend !== 'string' && ` -> `` (a native entry also refuses LEGACY_PENDING at :222) | 258 | 54 | LIVE, EQUIVALENT: proof below |
| k08 the :223 std/own conjunct halved: `(ex.std && ex.own)` -> `ex.own` (own alone refuses 'exercise') | 258 | 54 | LIVE, NOT equivalent: D-R22L5-1 below |
| k09 the :223 pendingThird disjunct dropped: ` \|\| ex.pendingThird` -> `` | 257 | 54 | K: 258 at its pendingThird case ("pendingThird v2 fx-revision-1": refused NATIVE_LOAD_PROVISIONAL field null for LEGACY_PENDING 'exercise') |
| w09 ORDER, sorted by exId: FC03 :272 `filter((q) => !hide(q))` -> `filter((q) => !hide(q)).sort((a, b) => (a.exId < b.exId ? -1 : a.exId > b.exId ? 1 : 0))` | 257 | 54 | K: 256 at its SLOT form only ("slot form R9.13 (v): only fx-press's entry hidden, fold order kept": fx-curl's debut before fx-row's); part (a)'s same-lift pair is order-stable under this mutant, so part (b) is what has the teeth here |
| w11 ORDER, rotated by one: :272 -> `((a) => (a.length > 1 ? [...a.slice(1), a[0]] : a))(state.queue.filter((q) => !hide(q)))` | 257 | 54 | K: 256 at part (a) (fx-row [unlock 65, debut 60]) |
| w16 (v) "unfinished" from the done side: FC03 :271 `!q.done && ` dropped from hide (a DONE legacy debut/unlock of a w-null lift hidden too) | 257 | 54 | K: R15-LEGACY-ON-HELD ("a finished legacy entry is not hidden (fx-revision-1)": false for true), the held quantifier; INFO: no row pins the same clause at the UNHELD w-null quantifier (a done legacy debut on a never-held w-null lift); the mutant is dead, so no debt |
| z14 heldProjection's own call: FC03 :269 `projectHeld(fold.state, [...lifts], { legacy: true })` -> `{ legacy: false }` | 258 | 54 | LIVE, EQUIVALENT: proof below |
PROOF k07 (equivalent for evaluate): FC01 :210 returns to compensation for every non-check intent, and step 2 at :211-216 refuses
NATIVE_LOAD_TARGET_QUEUED whenever `state.queue` holds an entry of the lift that is not done and has a string native_load_spend
(the exact set the dropped clause excludes), before :222 is reached; so at :222 no entry of the lift satisfies `!q.done && typeof
q.native_load_spend === 'string'`, the conjunct is vacuous, and the mutant cannot change any outcome. The anchor matched once (:222;
the transition-side site :543-544 has its own text and is c05's).
PROOF z14 (equivalent by value): for every held lift L in `lifts`, projectHeld (:251-257) sets L's projected w to null, so L is in
nullW (:270); projectHeld with legacy true removes, for L, every entry with a string native_load_spend OR (!done and kind in
HIDDEN_LEGACY_KINDS); with legacy false it removes only the spend-string entries; hide() (:271) then removes every entry of a nullW
lift with no spend string, not done and kind in HIDDEN_LEGACY_KINDS, which is exactly what legacy true removed for L. Both are order-
preserving filters removing the same set, so the resulting queue and exercises are equal by value; the only difference is object
identity when the :272 ternary spreads where it previously returned `state`, which no consumer reads. (This also says R9.13's hide
subsumes the R9.4 :159 held-lift legacy rule; the :159 rule stays as the spec's named mechanism and the code's comment.)
- D-R22L5-1 (LOW; k08, FC01 :223 the std/own conjunct; test bytes only; NOT a blocker): with `(ex.std && ex.own)` replaced by `ex.own`,
  a lift with own true and NO std refuses LEGACY_PENDING [Close Ref] 'exercise', where the head does not. EVALUATED (an in-memory
  print-only probe row appended to FC12 through my overlay, no byte written; job fable-r22-l5-P, out\fc12-p00.txt head and fc12-p08.txt
  under k08, both 259/259 with the GUARD line): fx-press at w 100, one normal completion on the 100 card, v2 R1: own alone -> head
  ["refused","NATIVE_LOAD_PROVISIONAL",null] / k08 ["refused","NATIVE_LOAD_LEGACY_PENDING","exercise"]; std alone -> PROVISIONAL under
  both; std+own -> LEGACY_PENDING 'exercise' under both; neither -> PROVISIONAL under both. Why it is not a blocker: the specified
  boundary is spec B's "existing ACTIVE legacy ... own ... branches", and the old app's own-standard branch is active iff `ex.std &&
  ex.own` (E/writers.cjs :279, the same predicate; every rebuild-side clearing site clears both together, :262-263, :272, :286, and no
  rebuild writer sets either), so own-without-std is not an active own branch and the head's conjunct is the faithful transcription;
  the shape is not produced by any writer I can read (the old app's src is not readable from this seat), and the clause is FC01's
  spec B, not R9.13's (iv)/(v), the same standing the PM gave D-R22L4-2. Fix: two cases in R22L4-EXERCISE-BRANCH-FIELD (own alone,
  std alone: the check is NOT LEGACY_PENDING, asserted as measured, refused NATIVE_LOAD_PROVISIONAL [Close Ref] field null), which
  kills k08 and its mirror `ex.std`.
Kill rate, l5 alone: 4 of 7 killed (57%), 2 equivalent with proof, 1 live (a debt). Cumulative l3 + l4 + l5: 72 single-clause
mutants, 67 killed (93%), 4 equivalent with proof (z01, y07, k07, z14), 1 live (k08, D-R22L5-1); excluding the equivalents 67 of 68
(98.5%). Every (iv) and (v) product clause enumerated at l3 has at least one killed mutant, and the l4 quantifier gaps (THE CHECK's
lift scope; the kept entries' order, now at three permutations; the host tier's w-0, other-kind and multi-entry inputs) are closed.
The one live non-equivalent mutant sits in FC01's pre-existing :223 exercise branch, outside R9.13.

## VERDICT: ACCEPT WITH NAMED DEBTS (D-R22L5-1; B-R22L4-1, B-R22L4-2 and D-R22L4-1..3 PAID; the head product is correct and unchanged; test bytes only)
Round 22e pays everything l4 asked for, exactly and at the right observables: k05 dies at 255 and nowhere else, with fx-row's check
pinned three ways (not LEGACY_PENDING; equal to its twin without fx-press's entry but for the whole-day queue digest; the measured
PROVISIONAL); w07 dies at 256 and nowhere else, with the kept order pinned directly (hp.queue deep-equal to the fold queue minus the
hidden entry) and at the two places it is observable (the engine card in the two-entry form; the structural slot through the real
capture in the three-lift form), and my two further permutations (w09, w11) die on the same row, each at the form that can see it;
k03 and k06 die at 257 and 258; z04, z06, w04 and w05 die at the host tier at 52, 53, 54. The capture rule the builder measured
(a debut-now lift carrying more than one unfinished debut/unlock entry refuses the whole day, W/engine-capture.cjs :72-73 in these
bytes) is a named limit under R9.13, not a blocker: spec :81 names it as a DEPENDENCY whose repair is the owner-held THIRD engine
change, it predates R9.13, (v) does not touch it, and 256's twin equality shows the hide neither causes nor cures it; my l4 sentence
that the two-entry form's card "is 60 on every set" was right at the engine card and the projection and wrong at the real capture,
and the builder's part (b) is the correct real-capture pin. 65 of 65 earlier mutants re-measure with every earlier kill intact and
the four l4 survivors now dead; of 7 new mutants 4 die, 2 are proven equivalent and 1 (k08) is live on an input outside spec B's
"active" own branch, carried as D-R22L5-1 with an evaluated witness and a two-case fix.

## Q6. Counts (final bytes, my runs)
FC12 whole: 258 tests, 258 pass, 0 fail, 0 todo, 0 skipped, exit 0 (18 s on the head; the R7 and R8 walks at their defaults). FA03
whole: 54 tests, 54 pass, 0 fail, 0 todo, 0 skipped, exit 0 (24 s). FC12 235 -> 240 (round 22) -> 244 (22b) -> 247 (22c) -> 254 (22d)
-> 258 (22e: tests 255-258); FA03 47 -> 48 (22) -> 50 (22c) -> 51 (22d) -> 54 (22e: cells 52-54). 146 whole-file runs in the one plan
(73 FC12, 73 FA03: the head, the 65 l3+l4 mutants, the 7 new ones; 02:09:03 to 02:22:33 and 02:28:09 to 03:05:21 local, one shared
slot throughout) plus the two probe runs (fc12-p00, fc12-p08: 259/259 each, exit 0, GUARD line present). Exit codes: all 146 read
from progress.txt (one writer this time, no lost line) and each equals 1 iff its TAP's "# fail" > 0 (check5.cjs: 0 mismatches).

## Q7. Hygiene
- FC12 583122 B sha256 bd033a18655b6c29f37a345a7c3d7bd3191ed361ee661786ccad09dbdcca3e37; FA03 125361 B
  6ff4ad3aac89d8ab393b59f983b157a53b96367f76fb2aef67fc07c4cbdc909a; report 324579 B
  2c92070964e17d91b08328aa5ca4b29ca1de768bc610ba2ace4640274ae23bd8; CR 0, non-ASCII 0 in all three (no U+2013/U+2014); LF. The
  builder's FC12 and FA03 hashes (report section 5) re-measure equal. The l1 (241e3bad...), l2 (b2fcd37d...), l3 (657138e9...) and
  l4 (bc5b3c2f...) reviews are untracked and untouched.
- Unchanged product (Q1): FC03 b25d2e61..., L/source-admission.mjs 10bd5cfb..., FC01 92a4a0b4..., W/engine-capture.cjs fa68a748...,
  w6 admission test bcc6df4d..., L/today-bindings.mjs 91aa980f..., E/today.cjs 685f6e1e..., E/writers.cjs c7b11beb... (full hashes
  above; equal to the bd7654a blobs byte-exact). No FC03 hunk, so no ISSUANCE hunk and no revision move (D-R13L1-2 unchanged).
- GUARD "protected-in-cache: none; refused: none" in all 146 TAPs and both probes; no protected-five file read, listed, grepped,
  loaded or executed (every git diff/cat-file/status/numstat named explicit FILE paths after --; the Select-String calls ran on FC12,
  FA03, the report, E/writers.cjs, FC01, E/today.cjs, W/engine-capture.cjs and my l3 spec copy, each by explicit path; no directory
  under rebuild/engine was listed); the w6 admission cells not run (STOP-R21B-1 stands, CI-only); no npm install; no lock file touched
  by hand (every run through pm-run shared; my slot was held 02:09-02:22 and 02:28-03:05 and for the two-run probe at 03:07, freed
  each time by pm-run; the PM's yield at 02:22:35 is the PM's, recorded in %TEMP%\pm7-yield-fable-l5.log and my scratch's
  PM-NOTE-YIELD.txt); %TEMP%\earned-astra-137 untouched; the earlier review scratch folders were read only (my l4 mutant JSONs were
  COPIED into this scratch by mk5.cjs, the l4 folder itself unchanged). Overlays applied exactly once per file per child (w04/w05 three
  times at FC12, the idempotent repeat explained at l4); the only applied-0 runs are the 30 expected n/a pairs.
- Two slips, disclosed: (1) one scratch tool, tally5.cjs, was first written with PowerShell Set-Content (-Encoding ascii, from a
  Copy-Item of my l4 tally4.cjs with two path strings replaced) and at once rewritten with write_file before any run read it; every
  other file I authored (this review, the scratch tools, the cmd and plan files) was written with write_file, LF, ASCII. (2) One
  search for E/writers.cjs' own/std readers was mistakenly issued to the cloud container's own home directory (the Grep tool, not the
  PC) and touched nothing of Joe's; it was redone as Select-String on the explicit file on the PC. Also: Set-ExecutionPolicy Bypass
  was set for one PowerShell PROCESS only, to run my witness5.ps1 in-process; nothing machine- or user-scoped changed.
- Carried debts (Astra L14 and earlier, the PM's): D-L12-ISSUANCE, D-L14-HOST-MUTANTS, D-L13-TYPED-C2, D-R13-LEGACY-OVER-NULL-ASK,
  D-R13L1-3, D-R13L1-2, D-L14-RECOVERY, D-L12-CUSTODY, D-L12-CONFIG, D-L14-CALIBRATION, D-L14-CI, D-L14-OWNER. PAID: D-L14-LEGACY-NULL
  (round 22), B-R22-1 and D-R22-1 (22b), B-R22L2-1, D-R22L2-1 and D-R22L2-2 (22c), B-R22L3-1 and D-R22L3-1..5 (22d), B-R22L4-1,
  B-R22L4-2 and D-R22L4-1..3 (22e). Live-equivalent, proven: z01, y07 (l3), k07, z14 (l5); the builder's X6b as l3 reported. New this
  review: D-R22L5-1 (LOW). The multi-entry capture refusal (W/engine-capture.cjs :72-73) is the spec :81 DEPENDENCY (owner-held THIRD
  engine change), already named; I mint no new debt for it and recommend the PM record it under that pointer rather than as a round
  finding.

## Builder's Round 22e section (report :1338-1441, read LAST): TRUE on every point I could measure
The counts (258/258, 54/54), the kill table (rows 236-258 and cells 48-54 by test number, identical to mine cell for cell for the 21
overlays it ran: k05 by 255 only, w07 by 256 only, k03 by 257 only, k06 by 258 only, z06 also at 257, w04/w05 at 249/251 and FA03
53/54, z04 at FA03 52, X6 and z09 also at FA03 54), the red-first witnesses (the same first-failing assertions and actual values as
under my overlays: k05's ["refused","NATIVE_LOAD_LEGACY_PENDING","queue"], w07's unlock-before-debut, k03's 'offer', k06's 'queue',
z04's "0 lb", z06's [], w04/w05's blocked BASELINE_UNPROVEN), the sha256 list, the numstat (+413/-0, +142/-0; the per-round sums
83+59+60+104+107 and 22+41+21+58 add up), the hygiene line, the prefix claim (0 '-' lines), the MEASURED DIFFERENCE note (the capture
refuses the two-entry form with or without the hide; the probe values it cites match my l4 probe p00/p07 and my Q2 reading), the
disclosure that the FC01/FC03 mutants apply at FA03 and leave it 54/54 (re-measured), the anchors (the six new ones are the same
clauses as mine, built from my l4 text; my overlays are independent and agree), and the helper-name note all re-measure or read as
stated. Two INFO corrections: the citation "W/engine-capture.cjs:76-77" is :72-73 in the fa68a748 bytes (the comment :70-71); and the
"NEW, the PM's call" item in section 6 is already named at spec 7ef8291 :81 as the owner-held THIRD engine change, so it needs a
pointer, not a new debt. The builder's own disclosure (4), one pathless `git status --porcelain` / `rev-parse` / `branch --show-current`
in earned-nlr, listed names only (no content) and is not a protected read; noted, not held against the round. The section could not
mention k07, k08, k09, w09, w11, w16 or z14 (mine, new here).

## What I could not do
Not done: the w6 admission cells or anything loading the protected five (CI-only); the 80-file broad set (exclusive; not in the brief;
no product byte moved); reading the old app's src to settle the reachability of a pending own/reclaim/ladder queue entry, of a lift
carrying a debut and an unlock at once, or of an exercise with own true and std null (the same standing as at l3 and l4; the rebuild's
own writers set none of these); re-proving the R9.11 :158 INVARIANT (z01 rests on it as the spec does); a direct red witness of
256's part (b) at the CARD under a reorder (under w07, w09 and w11 the row's projection-order assertion fires first, so the card-level
kill in the slot form rests on the read path E/today.cjs :53-59/:98 and on the builder's p2 probe values, which I did not re-run; my
own l4 probe p07 shows the projection reversed under w07 on the two-entry form only). The campaign was interrupted once by the PM's
yield for the S10 seal (02:22:35-02:28:09) and resumed unchanged from the line it stopped at; nothing was re-run by me except the one
interrupted line, which the PM's re-queue re-ran whole.

## AAR
- Asked: blind level-5 CONVERGENCE check of rounds 22 + 22b + 22c + 22d + 22e (the test-only payment of my l4 B-R22L4-1, B-R22L4-2
  and D-R22L4-1..3): Q1-Q7, the whole l3+l4 mutant set re-run on the final bytes, at most 8 new single-clause mutants where coverage
  is thinnest, a judgement on the builder's capture-rule note and on part (b)'s order pin, cumulative kill rate, verdict, one shared
  slot at most.
- Happened: product bytes re-hashed unchanged against the bd7654a blobs; four FC12 rows and three FA03 cells read against (v) and
  spec B, all pinning the specified outcome at the right observables; all 65 earlier mutants re-run: the four l4 survivors now die each
  at its own row and nowhere else, every earlier kill intact, 235 + 47 pre-round rows green throughout; 7 new mutants: 4 killed, 2
  proven equivalent, 1 live on a non-active branch shape (D-R22L5-1, with an evaluated probe); cumulative 67 of 72 (93%; 98.5%
  excluding the equivalents).
- Went well: reusing my l3/l4 anchors re-verified exactly once let the whole 146-run campaign fit one shared slot in 51 minutes of
  slot time; the PM's yield-and-requeue cost six minutes and lost nothing (one writer, 146 progress lines, 0 exit mismatches); the
  in-memory probe row settled k08's difference by evaluation, not by reading alone.
- Went badly: my l4 blocker text overstated w07's card-level effect in the two-entry form (right at the engine card, wrong at the real
  capture, which refuses either way under the pre-R9.13 rule); one scratch file was first written with Set-Content and one search went
  to the wrong machine; the two-entry-one-lift capture refusal was cited by both of us at stale line numbers.
- Change next time: measure every "the card is X" claim through the real capture (cardLoads) before writing it, not only through
  genSession; number lines with Get-Content indexing before citing them; give order mutants one form per observable (projection, engine
  card, real capture) so each assertion's teeth are shown separately.
- Verdict: ACCEPT WITH NAMED DEBTS (D-R22L5-1, LOW, test bytes only); B-R22L4-1, B-R22L4-2 and D-R22L4-1..3 PAID; the multi-entry
  capture refusal is the spec :81 owner-held DEPENDENCY, a named limit, not a blocker; the head product is correct and unchanged.
