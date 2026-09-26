# REVIEW-NATIVE-LOAD-BUILD-R22-l4 (Fable, independent reviewer l4 of NATIVE-LOAD build round 22 + 22b + 22c + 22d; CONVERGENCE check after my l3 sweep; blind to the builder's reasoning)

Reviewed: earned-nlr, branch rebuild/e-native-load-red, HEAD bd7654a798592a7dae421b9d68fec850fb0993d1, the UNCOMMITTED working tree
after round 22d (git status --porcelain: M FC12 rebuild/m4/spec/native-load-options.test.cjs, M FA03
rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs, M rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md, ?? the l1, l2 and l3
reviews; git diff --numstat with the eight explicit product/test paths: FC12 +306/-0, FA03 +84/-0, report +304/-0, nothing else).
Inputs read in this order: my l3 review (B-R22L3-1, D-R22L3-1..5; sha256 657138e9 unchanged), the object diff (cmd-redirected git
diff with one explicit path each, into scratch: FC12 314 lines and FA03 92 lines, read whole; the 22d hunks are FC12 :5342-5445 and
FA03 :1374-1393), spec R9.13 (iv) and (v) at 7ef8291 (my l3 scratch copy, section N re-read), the product regions the rows and my
mutants exercise (FC03 :244-273 HIDDEN_LEGACY_KINDS, projectHeld, heldProjection, :755 the present-revision gate; FC01
E/native-load.cjs :16-24 STRUCTURAL and :205-232 the check's LEGACY_PENDING sites :222-:223 and refuse() :31; E/today.cjs :51-58
pickStructural; L/today-bindings.mjs :508-553 the decorated registrar and :677 project(); FC12 :60-80 F0/C, :670 foldArgs, :841
checkOf, :897 twoLift, :5037-5043 legacyOverNullBase, :5070-5072 and :5149-5152 the L14 helpers, :5204-5209 alvRow; none of the
protected five), and the builder's Round 22d report section LAST (report :1242-1336). Every node run went through node
%TEMP%\pm-run.cjs shared (jobs fable-r22-l4-prep, -A, -B, -C, -D, -probe, -P; the four plan slots taken at 00:00:30 local and all
freed by 00:14:49; the prep job waited 370 s behind the S10 exclusive run, as expected), guard preload nlr-build\guard.cjs ("GUARD
protected-in-cache: none; refused: none" present in all 132 TAPs and in the probe, checked programmatically), TZ America/New_York,
MEASURED_TEST_NOW 2026-09-03, NODE_PATH via the existing junctions. Mutants are my own in-memory overlays (ov4.cjs, a CJS preload:
one replacement that must occur exactly once, on the source the CJS loader compiles and on the text fs.readFileSync returns; "# L4MUT
<id> applied {...}" in every TAP; ov4-esm.mjs, a node:module register() load hook for the ESM host file L/today-bindings.mjs, "#
L4ESM <id> applied [...]" marker file); the 43 l3 mutant JSONs were re-verified against the CURRENT product bytes (mk4.cjs: 43 + 22
= 65 anchors, every one exactly once, 0 bad) and copied into this scratch; the 22 new anchors are mine, from the product bytes. No
product file and no test file was written. Scratch: %TEMP%\nlr-r22-l4-scratch (mk4.cjs, mkplans4.cjs, hash4.cjs, ov4.cjs,
ov4-esm.mjs, run4.ps1, peek.ps1, witness.ps1, tally4.cjs, probe4.cjs, probe.cmd, mkprobe.cjs, prep.cmd, prepP.cmd, planA-D.txt,
planP.txt, jobA-D.cmd, jobP.cmd, mut-*.json, diff-fc12.txt, diff-fa03.txt, diff-report.txt, tally-fc12.txt, tally-fa03.txt,
draft-tail.md, out\*.txt, progress.txt). This review is the only new file; no tracked file was edited; nothing committed, pushed,
fetched, checked out or written to DECISIONS/STATUS; nothing run or written in any other worktree; %TEMP%\earned-astra-137
untouched. Every fixture value below is invented.

## Q1. Product bytes byte-identical to bd7654a? YES (node sha256 of each working file vs `git cat-file blob bd7654a:<path>` stdout, byte-exact)
- FC03 rebuild/m4/workout/native-load-effects.cjs SAME b25d2e611245cc5725ff79040cfcc60dcda1f05856f2ea51fcd71ea8c4cfc522 (92274 B)
- L/source-admission.mjs rebuild/m3/w6/local/source-admission.mjs SAME 10bd5cfbf0f591dbfba652b64c514d270345230664c5785c33aea8cabf07157d (74465 B)
- FC01 rebuild/engine/native-load.cjs SAME 92a4a0b4e693af00dcbfe0bfdf6fa75a9a2026690ff11ff674f58bae4755fdd1 (51352 B)
- W/engine-capture.cjs rebuild/m4/workout/engine-capture.cjs SAME fa68a748680b5b646c52c769f9a2ff2d30b0846417887a9e0a5374e55f43aee4 (11278 B)
- w6 admission test rebuild/m3/w6/test/local-source-admission.test.mjs SAME bcc6df4d02a9c3cf71af50410996b5cebfee4bc830040c27eb1e0f119c53ec4e (20125 B)
- also SAME (read for the host-tier, check and card mutants): L/today-bindings.mjs 91aa980fc51e78c36f6946a3141e71e3a679ae74b8c78bfba44a805fa4b1d797
  (68749 B), E/today.cjs 685f6e1e907cd9bba268e5d8f6927120172869febe1c747ffb9bd851aa17c45a (47806 B), E/writers.cjs
  c7b11beb6539eac96b68e291a8bdda433510e4a0658986d80ad9647032639739 (259587 B).
- FC12 DIFF: head 76dbee6d422df1f8a2e2bbf548360adcb111910ec379e58c6163c4c94f93ecbd (516028 B) -> work
  03e22c30e8c90f7a939a21ee355907fe1f1a537990db5ce9cbf66122efec9e6a (564630 B); FA03 DIFF: head 285027b08279297df233eaf532d2f4eb6c527f73b0420457e2f680a4e08297f4
  (106387 B) -> work a102bb65935fbfd67ac3d7b87bfeb4eb7bda745278665f50dfe6d7ba2043b11a (117242 B); report DIFF: head
  0657385e3cb04b11364f8fb23123becbfe8089fe621d22c2a331e5b78f2ac841 (219317 B) -> work 18cb5e60738494abf8680efbb006d8ea4c7f5c8800c275e312d9936911b6260a
  (291853 B). CR 0 and non-ASCII 0 in FC12, FA03 and the report. The three hashes the brief names (03e22c30, a102bb65, 18cb5e60) are
  what the bytes measure.
- The l1 (241e3bad...), l2 (b2fcd37d...) and l3 (657138e9...) reviews are untracked and unchanged.

## Q2. Does each round-22d row assert the SPECIFIED R9.13 outcome, not the head's incidental output? YES, all eight
- R22L3-EVERY-LIFT-OVER-NULL (FC12 test 248; FC12 :5357): r22dTwoNullBase() = legacyOverNullBase() with fx-row ALSO at w null (two
  never-held lifts, each under its own pending legacy DEBUT 60). Per v1/v2 x R1/R2 it asserts: the fold keeps both w null, no issue on
  either lift, both entries pending ((v) "the entry, its history and the fold state are unchanged"); the registered projection shows 0
  unfinished entries for EACH lift, r22dInvariant(hp) = [] (a generic read of the INVARIANT over the whole projection: no unfinished
  debut/unlock of any lift whose projected w is null or ABSENT), both cards [null,null,null] through cardLoads, i.e. the real capture
  ((v) RULE "of EVERY lift", INVARIANT, EXPECTED CARD "the day prepares"); the check on EACH lift's baseline-ask completion (one
  shared Close, twoLift) refuses NATIVE_LOAD_LEGACY_PENDING [C1 Close Ref] 'queue' (THE CHECK); afterwards both w null, no authority
  on either, no 'adopt:' receipt for either, both entries pending ("nothing durable is written"). Every clause maps to a sentence of
  (v) quoted in the title; the fixture is the two-instance form B-R22L3-1 asked for.
- R22L3-EVERY-ENTRY-OVER-NULL (249; :5373): r22dPairBase(form) = one never-held fx-press under a pending legacy DEBUT 60 AND a
  pending legacy UNLOCK 65, w null and again with NO w field (absentW; wField asserts 'ABSENT'). Per form x v1/v2 x R1/R2: the fold
  keeps both pending and w as admitted; the projection shows 0, the INVARIANT read is []; the card is the baseline ask; the check
  refuses LEGACY_PENDING [C1 Close Ref] 'queue'; nothing written. (v) "every ... entry", "null or ABSENT".
- R22L3-ZERO-W-VISIBLE (250; :5389): F0({w:0}) with LEGQ({newW:5}), R1 and R2: the fold keeps w 0 and the entry pending, no issue;
  the projection keeps w 0 and the entry VISIBLE ([debut, DEBUT, 5]) and the card is [5,5,5] through the real capture. That is (v)
  V4 from its numeric side ("null or ABSENT": 0 is neither) and the CONTROL sentence ("the same entry on a lift with numeric w ...
  stays visible, and the card prescribes ... as today (E/today.cjs:98)"). The builder's measured difference under z04 (the card
  falls back to [0,0,0], the w-0 scalar, NOT the baseline ask my l3 text derived, because E/today.cjs :103 asks only for a null w)
  changes nothing about what the row pins: the row asserts the head's SPECIFIED outcome (entry visible, card = newW on every set),
  and under z04 it is red for the specified reason (the entry hidden; my witness below shows actual [0,[],[0,0,0]] for
  [0,[['debut','DEBUT',5]],[5,5,5]]). The l3 debt text's "baseline ask" was my derivation, not a clause; the row correctly pins the
  clause, not my derivation. D-R22L3-1 PAID.
- R22L3-OTHER-KINDS-KEPT (251; :5400): F0({w:null}) with a pending legacy entry of kind own / reclaim / ladder (state DEBUT, newW
  60) beside LEGQ({newW:60}), R1 and R2: the fold keeps both pending, no issue; the projection hides the debut ONLY and keeps the
  other-kind entry ([kind, DEBUT, 60]); the card is the baseline ask and the day prepares. (v) V3 (HIDDEN_LEGACY_KINDS = {debut,
  unlock}, :250) from the widening side. D-R22L3-2 PAID. INFO: the row never runs the check on this fixture; see k03 below.
- R22L3-OTHER-KINDS-ALV (252; :5412): alvState with a pending legacy entry of kind own / reclaim / ladder / info carrying newW 105
  and no newWSets: ALV.fn names nothing, JSON byte-identical, no newWSets; beside R913-ALV-KINDS's DEBUT in one state the debut
  converts to [105,105,100] and the other entry is byte-identical. (iv) D3 from the widening side and C2 "every other entry ...
  unchanged". D-R22L3-3 PAID.
- R22L3-STATE-NOT-PROPOSED-ALV (253; :5425): a pending legacy DEBUT 105 in state 'QUEUED', and one with NO state key: each is first
  shown unconverted to refuse ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED (the control that E/today.cjs :55 picks it), then alvRow: newWSets
  [105,105,100], nothing named, nothing else written (structuredClone before/after minus newWSets deep-equal), no set above 105, the
  card captures [105,105,100] through the real capture; the state (or its absence) kept as admitted; newWSets equal to the
  DEBUT-state twin's. (iv) D2 "q.state !== 'PROPOSED'". D-R22L3-4 PAID; both cases have their own teeth (y05 and my y18 below).
- R22L3-STRING-W-ALV (254; :5439): w '100' (a string), wSets [100,100,95], LEGQ(): named exactly [{exId, kind debut, newW 105, w
  '100', wSets [100,100,95]}], byte-identical, no newWSets, the day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. (iv) P2 and OUT OF
  PRECONDITION ("w not a finite number ... named ... its day refuses ... (:83)"). D-R22L3-5 PAID.
- FA03 R22L3-EVERY-LIFT-OVER-NULL-HOST [Y] (cell 51; FA03 :1377): withPress(day,{w:null}) with demo-row ALSO at w null and one
  pending legacy DEBUT 60 per lift in the admitted basis, through the durable host on D1 and after a cold reopen on D3: gym.read
  'ready'; every demo-press AND every demo-row slot load.state 'not_prescribed'; the host projection: w null for both, 0 visible
  unfinished debut/unlock of either, no active issue on either. (v) at the host tier in the two-lift form (the cell my l3 fix
  paragraph offered). B-R22L3-1 PAID at both tiers (with 248 and 249).
- Round-22, 22b and 22c rows are unchanged since l3 (their hunks precede FC12 :5342 and FA03 :1374); the l1, l2 and l3 Q2 readings
  stand. New top-level names (r22dTwoNullBase, r22dInvariant, r22dPair, r22dPairBase) collide with nothing (the file parses and runs);
  the FA03 cell's legacyBasis is cell-local.

## Q3. My own overlays for z09, z04, z06, y02, y05, y16 and the whole l3 set re-run on the 22d bytes, whole FC12 (254) and whole FA03 (51)
Mechanism as at l3 (ov4.cjs / ov4-esm.mjs, my anchors re-verified exactly-once on the current bytes). Applied counts in the child
TAP: {source-admission.mjs:1} for every ALV mutant at FC12 (0 at FA03, which never reads that text: n/a, not a kill);
{native-load-effects.cjs:2} for every FC03 mutant at FC12 (the loader compile plus FC12's own utf8 read of FC03) and :1 at FA03;
{native-load.cjs:1} for every FC01 mutant at both files; the ESM mutants apply through the load hook at FA03 only (marker file
present) and 0 at FC12 (n/a). The head: FC12 254/254 exit 0, FA03 51/51 exit 0. Test numbers as the TAP counts them.
| Overlay (my anchor -> mutant) | FC12 pass/254; rows red | FA03 pass/51; cells red |
| --- | --- | --- |
| z09 FC03 :272 filter -> hides only the FIRST hideable entry (the l3 blocker) | 252; R22L3-EVERY-LIFT-OVER-NULL (248), R22L3-EVERY-ENTRY-OVER-NULL (249) | 50; R22L3-EVERY-LIFT-OVER-NULL-HOST (51) |
| z04 FC03 :270 `x.w == null` -> `!x.w` | 253; R22L3-ZERO-W-VISIBLE (250) | 51 (no w-0 host cell; FC12 pins the same function) |
| z06 FC03 :250 kind set widened to FC01's STRUCTURAL | 253; R22L3-OTHER-KINDS-KEPT (251) | 51 (no other-kind host cell) |
| y02 ALV kind clause dropped | 253; R22L3-OTHER-KINDS-ALV (252) | n/a 51 |
| y05 ALV `q.state==='PROPOSED'` -> `q.state!=='DEBUT'` | 253; R22L3-STATE-NOT-PROPOSED-ALV (253) at "state QUEUED: the shifted vector" (actual undefined for [105,105,100]) | n/a 51 |
| y16 ALV w-type clause -> `ex.w==null` | 253; R22L3-STRING-W-ALV (254) at "a numeric-string w fails P" (actual named [] for the one-entry list) | n/a 51 |
| m01 `x.w == null` -> `=== null` | 250; L14-B1-ABSENT-W-PROJECTION (236), L14-B1-ABSENT-W-UNDO (237), R22L2-UNLOCK-OVER-ABSENT-W (246), R22L3-EVERY-ENTRY-OVER-NULL (249, its ABSENT form) | 49; L14-B1-ABSENT-W-HOST (48), R22L2-ABSENT-DONE-HOST (50) |
| m02 / m03 / m10 / n5 / n4 (ALV, as at l3) | 253 (238) / 251 (239, 241, 242) / 252 (239, 240) / 252 (241, 242) / 253 (243) | n/a 51 each |
| e1 FC03 :271 `!q.done` -> `q.done === false` | 253; R22-ABSENT-DONE-HIDDEN (244) | 50; R22L2-ABSENT-DONE-HOST (50) |
| x6 FC03 :271 kind set -> debut only | 251; R22L2-UNLOCK-OVER-NULL-UNHELD (245), R22L2-UNLOCK-OVER-ABSENT-W (246), R22L3-EVERY-ENTRY-OVER-NULL (249, its unlock) | 50; R22L2-UNLOCK-OVER-NULL-HOST (49) |
| x4 ALV `q.done` -> `q.done===true` | 253; R22L2-TRUTHY-DONE-ALV (247) | n/a 51 |
| y01 / y03 / y04 / y06 / y08 / y09 / y10 / y11 / y12 / y13 / y14 / y15 / y17 (ALV, l3 Q4) | 253 / 252 / 253 / 253 / 253 / 253 / 244 / 252 / 243 / 251 / 246 / 252 / 251: the l3 kill sets, plus the 22d ALV rows where the clause reaches them (y10 and y12 also kill 252 and 253; y14 also kills 253; y17 also kills 254) | n/a 51 each |
| y07 (newW finiteness dropped) | 254 LIVE, EQUIVALENT (l3 proof stands: parseStrictJson admits no NaN/Infinity) | n/a 51 |
| z01 (native entries of an unheld w-null lift also hidden) | 254 LIVE, EQUIVALENT under the R9.11 :158 INVARIANT (l3 proof stands) | 51 |
| z02 (w scope dropped: hide on numeric w too) | 238; the l3 thirteen plus R22L3-ZERO-W-VISIBLE, R22L3-STATE-NOT-PROPOSED-ALV, R22L3-STRING-W-ALV | 51 |
| z03 (held lifts only, the 40eb702 shape) | 243; the l3 eight plus 248, 249, 251 | 46; the four (v) host cells plus 51 |
| z05 (the projection written into the fold state) | 244; the l3 seven plus 248, 249, 251 | 51 |
| z07 / z08 / z10 (projectHeld default, native-show side, the present gate) | 252 / 230 / 245, the l3 kill sets unchanged | 51 / 48 / 51 |
| c01 / c02 / c03 (the check's code / field / refs at FC01 :222) | 244 / 245 / 244: the l3 kill sets plus 248 and 249 (both assert code, refs and field) | 51 each (no host check cell; FC12 pins) |
| c04 (STRUCTURAL without unlock) | 252; R22L2-UNLOCK-OVER-NULL-UNHELD, R22L2-UNLOCK-OVER-ABSENT-W only (249's unlock sits beside a debut, so the check refuses on the debut) | 51 |
| c05 (the transition-side LEGACY_PENDING dropped) | 252; R8-P2, R17-ANCHOR-LEGACY-LATER | 51 |
| h01 / h02 (host registrar on the raw fold / project() on the raw fold; ESM hook) | n/a 254 | 39 / 41: the l3 kills plus R22L3-EVERY-LIFT-OVER-NULL-HOST (51) |
Red-first witnesses from my TAPs (actual for expected): z09 on 248 at "v2 fx-revision-1 ... hides BOTH lifts' legacy entries": [0, 1,
[['fx-row','debut',60]], 'ENGINE_CAPTURE_BASELINE_UNPROVEN', 'ENGINE_CAPTURE_BASELINE_UNPROVEN'] for [0, 0, [], [null,null,null],
[null,null,null]] (fx-row's debut shown, the INVARIANT read non-empty, the capture refuses the whole day at W/engine-capture.cjs :67
for BOTH cards: exactly my l3 probe input (a) measured at the card); z09 on 249 at "null-w v2 fx-revision-1": [1,
[['fx-press','unlock',65]], 'ENGINE_CAPTURE_BASELINE_UNPROVEN'] for [0, [], [null,null,null]] (input (b)); z09 on FA03 51 gym.read
'blocked' ENGINE_CAPTURE_BASELINE_UNPROVEN for 'ready'; z04 on 250: [0, [], [0,0,0]] for [0, [['debut','DEBUT',5]], [5,5,5]]; z06 on
251 at kind own: [[], [null,null,null]] for [[['own','DEBUT',60]], [null,null,null]]; y02 on 252 at "own alone": [[], false, true] for
[[], true, false] (newWSets written onto the own entry); y16 on 254: named [] for [{... w:'100' ...}]. Under every overlay all 235
pre-round-22 rows and all 47 pre-round-22 cells stay green, and every round-22/22b/22c row not named for an overlay stays green: only
new rows fail, each 22d row fails under its own mutant and passes on the head. B-R22L3-1 PAID (z09 killed by 248 + 249 at FC12 and
by 51 at FA03, and by nothing else), D-R22L3-1 PAID (z04 by 250 only), D-R22L3-2 PAID (z06 by 251 only), D-R22L3-3 PAID (y02 by 252
only), D-R22L3-4 PAID (y05 by 253 only; the no-state case separately by my y18 below), D-R22L3-5 PAID (y16 by 254 only, y17 too).
Every earlier kill (rounds 22, 22b, 22c; l1, l2, l3) still kills.

## Q4. CONVERGENCE: 22 NEW single-clause mutants in the areas the l3 sweep covered least, whole FC12 (254) and whole FA03 (51) under each
Areas: (a) heldProjection's multi-lift and multi-entry quantifiers and order (w01-w08, w10, w12: the filter's cardinality from the
other side, the nullW set's cardinality, per-lift cardinality, the some() gate, the exId scope, the kind test by state, the kind
set one member at a time); (b) THE CHECK's field, refs, kind set, done clause and lift scope at FC01 :222 and the :223 branch's field
(k01-k06); (c) the host tier's own use of the projection in L/today-bindings.mjs (h03, h05, h06, ESM load hook); (d) R1 vs R2 (r01,
the fold's present-revision gate inverted; (iv) and (v) have no revision-dependent product clause, every row loops both revisions,
and the l3 z10 kills re-measure); (e) the per-case teeth of the 22d rows (y18 the no-state case alone, y19 the info iteration alone,
w12 the ladder iteration alone). w04/w05 apply 3 times at FC12 because their replacement embeds the anchor as a prefix (the third
application repeats an idempotent conjunct; the mutant's meaning is unchanged; FA03 :1).
| Mutant (clause; file, my anchor -> mutant) | FC12 (pass/254) | FA03 (pass/51) | Result; killed by |
| --- | --- | --- | --- |
| w01 (v) "EVERY" from the other side: FC03 :272 `filter((q) => !hide(q))` -> `filter((q, i) => !hide(q) \|\| i !== state.queue.map(hide).lastIndexOf(true))` (only the LAST hideable entry hidden) | 252 | 50 | K: 248, 249; FA03 51 |
| w02 (v) "EVERY lift": :270 `filter(...).map((x) => x.id)` -> `filter(...).slice(0, 1).map(...)` (only the first null-w lift) | 252 | 50 | K: R8-PROPERTY walk (counterexamples), 248; FA03 51 |
| w03 :270 `.slice(-1)` (only the last null-w lift) | 253 | 50 | K: 248; FA03 51 |
| w04 (v) "every entry": :271 hide only the lift's FIRST unfinished entry (`&& state.queue.find((p) => p && p.exId === q.exId && !p.done) === q`) | 252 | 51 | K: 249, 251 (the own entry precedes the debut, so the debut is not first); FA03 has no multi-entry host cell (FC12 pins) |
| w05 :271 hide only when the lift has exactly ONE unfinished entry (`&& state.queue.filter((p) => p && p.exId === q.exId && !p.done).length === 1`) | 252 | 51 | K: 249, 251; FA03 as w04 |
| w06 the gate: :272 `state.queue.some(hide) ?` -> `state.queue.every(hide) ?` | 250 | 51 | K: R913-LEGACY-OVER-NULL-UNHELD, R22-ABSENT-DONE-HIDDEN, R22L2-UNLOCK-OVER-NULL-UNHELD, 251 |
| w07 ORDER: :272 `filter((q) => !hide(q))` -> `filter((q) => !hide(q)).reverse()` (the remaining entries reversed whenever a hide happens) | 254 | 51 | LIVE: see below |
| w08 the exId scope: :271 `nullW.has(q.exId)` -> `nullW.size > 0` (any lift's entry hidden when any lift is w null) | 251 | 51 | K: R913-LEGACY-OVER-NULL-UNHELD, R22-ABSENT-DONE-HIDDEN, R22L2-UNLOCK-OVER-NULL-UNHELD (fx-row's entry hidden too) |
| w10 the kind test by state: :271 `HIDDEN_LEGACY_KINDS.has(q.kind);` -> `q.state !== 'PROPOSED';` | 252 | 51 | K: R8-PROPERTY walk (the lone-PROPOSED shape: a PROPOSED debut on a w-null lift shown; I16), 251 |
| w12 the kind set one member: :250 `new Set(['debut', 'unlock'])` -> `new Set(['debut', 'unlock', 'ladder'])` | 253 | 51 | K: 251 at its ladder iteration only |
| k01 THE CHECK refs duplicated: FC01 :222 `[closeRef]` -> `[closeRef, closeRef]` | 244 | 51 | K: the ten rows asserting refs deep-equal [Close Ref] (R15-LEGACY-ON-HELD, R20-RESTORE-OVER-LEGACY, R913-LEGACY-OVER-NULL-UNHELD, L14-B1 x2, R22-ABSENT-DONE-HIDDEN, both R22L2-UNLOCK rows, 248, 249) |
| k02 THE CHECK field dropped: :222 `refuse('LEGACY_PENDING', [closeRef], 'queue')` -> `refuse('LEGACY_PENDING', [closeRef])` (field null) | 245 | 51 | K: the same minus R15 |
| k03 THE CHECK kind set: :222 `STRUCTURAL.includes(q.kind)` -> `['debut', 'unlock'].includes(q.kind)` (a pending own/reclaim/ladder entry no longer refuses at :222) | 254 | 51 | LIVE: see below |
| k04 THE CHECK done clause: :222 `!q.done` -> `q.done === false` | 253 | 51 | K: R22-ABSENT-DONE-HIDDEN only (its check assertion on the no-done-key entry) |
| k05 THE CHECK lift scope: :222 `q.exId === lift` -> `true` (ANY lift's pending legacy structural entry refuses THIS lift's check) | 254 | 51 | LIVE: see below |
| k06 the :223 branch's field: `refuse('LEGACY_PENDING', [closeRef], 'exercise')` -> `'queue'` | 254 | 51 | LIVE: see below |
| h03 host registrar, raw queue: L/today-bindings.mjs :549 `{ ...held.state }` -> `{ ...held.state, queue: fold.state.queue }` | n/a 254 | 40 | K: 11 cells (R3-B2, R4-DB21, N27 (a) (c) (f), N27-B39-HOST, the four (v) host cells, 51) |
| h05 host project(), raw queue: :677 `heldProjection(...).state` -> `{ ...heldProjection(...).state, queue: p.fold.state.queue }` | n/a 254 | 43 | K: 8 cells (N27 (a) (c) (f), the four (v) host cells, 51) |
| h06 host registrar, raw exercises: :549 `{ ...held.state, exercises: fold.state.exercises }` | n/a 254 | 44 | K: 7 hold cells (R3-B2, R4-DB21, N27 (a) (b) (c) (f), N27-B39-HOST); no (v) cell, as (v) changes no exercise |
| r01 R1 vs R2: FC03 :755 `const present = iss.revision === engine.revision;` -> `!==` | 238 | 50 | K: 16 rows (N22, R3-B3, R3-M11, R3-D7a, R9-FORGED, R12, R16b x2, R16-D-FRESH-2, N29 x3, R17-ANCHOR-STRUCTURAL, R17b-L9-M07, N28, FIT-PARITY); FA03 N27-B39-HOST |
| y18 (iv) D2, the no-state case alone: ALV `\|\|q.state==='PROPOSED'\|\|` -> `\|\|q.state===undefined\|\|q.state==='PROPOSED'\|\|` | 253 | n/a 51 | K: 253 at "no state key: the shifted vector" (actual undefined) |
| y19 (iv) D3, the info iteration alone: ALV `(q.kind!=='debut'&&q.kind!=='unlock')` -> `(... &&q.kind!=='info')` | 253 | n/a 51 | K: 252 at "info alone" |
Kill rate, l4 alone: 18 of 22 killed (82%); 4 live, 0 equivalent. Cumulative l3 + l4: 56 new single-clause mutants, 50 killed (89%),
2 equivalent with proof (z01, y07), 4 live; excluding the equivalents 50 of 54 (93%). Of the 6 l3 live mutants all 6 are now killed
(z09, z04, z06, y02, y05, y16). Every (iv) and (v) product clause enumerated at l3 (D1-D7, P1-P3, C1-C2, IDEMPOTENT, OUT-OF-P; V1-V8,
EXPECTED CARD, THE CHECK code/refs/field/done, INVARIANT at both quantifiers, host tier registrar and project()) now has at least one
killed mutant; the four live ones sit outside those clauses (order, and three clauses of FC01's pre-existing LEGACY_PENDING rule).
Every kill is by a non-revision-pin assertion; the R1/R2 loop is live (r01, z10).

### The four live mutants (each LIVE at 254/254 and 51/51; none equivalent; classification under the Q4 criterion as commissioned)
- B-R22L4-1 (BLOCKING under the Q4 criterion; test bytes only; k05, FC01 :222 the check's LIFT SCOPE): with `q.exId === lift`
  replaced by `true`, ANY lift's pending legacy structural entry refuses THIS lift's check NATIVE_LOAD_LEGACY_PENDING [Close Ref]
  'queue'. Read path: FC01 :222 is the only site that can yield LEGACY_PENDING with field 'queue' (:223's field is 'exercise'), and on
  the head an entry-free lift passes it, so on a two-lift day where only fx-press carries a pending legacy debut (the
  R913-LEGACY-OVER-NULL-UNHELD class with fx-row's entry removed: fx-row at w 55, no entry) the check on fx-row's completion is
  LEGACY_PENDING 'queue' under k05 and is not under the head. Specified boundary: (v) THE CHECK is stated of "that baseline-ask
  completion" (the w-null lift's) and (v) EXPECTED CARD says "The day's other lifts are unaffected"; FC01's own rule (spec B, "Legacy
  structural entries ... keep their own rules", the clause R9.13 (v) says is "unchanged") is per lift by its text. Reachable: an
  admitted old-app base with one lift under a pending debut while the athlete trains and closes another lift; the two-lift fixtures
  the rows already model. Why no row pins it: every FC12 two-lift legacy fixture (legacyOverNullBase, r22dTwoNullBase, the R22L2 and
  R22L3 rows) gives BOTH lifts an entry, so under k05 both checks refuse as on the head; the singular direction (an entry-bearing lift
  beside an entry-FREE lift whose check must NOT refuse LEGACY_PENDING) was never built. The gap predates round 22 (k05 survives the
  235 pre-round rows and the walk too), the product is correct, and the fix is one FC12 row (e.g. R22L4-CHECK-OTHER-LIFT-UNAFFECTED:
  legacyOverNullBase() minus fx-row's entry; a shared Close (twoLift) at fx-row's card; the check on fx-press refuses LEGACY_PENDING
  [Close Ref] 'queue' as today, the check on fx-row does NOT (its status and code as measured on the head, asserted exactly), and
  fx-row's card is 55 on every set; red under k05, green on the head). The PM may lawfully carry it as a debt instead if the Q4
  criterion is read as scoped to R9.13's own product clauses; I apply the criterion as written, because the sentence it violates
  ("other lifts are unaffected") is (v)'s and the input is the (v) rows' own class.
- B-R22L4-2 (BLOCKING under the Q4 criterion; test bytes only; w07, FC03 :272 ORDER): `filter((q) => !hide(q)).reverse()` reverses
  the remaining queue whenever a hide happens (and only then; the ternary's other arm is the unchanged state). Read path: E/today.cjs
  :53-57 pickStructural takes `passes.find((q) => !q.coApproved)`, the FIRST unfinished non-PROPOSED debut/unlock of the day type in
  QUEUE ORDER, and :98 prescribes w = q.newW; so on legacyOverNullBase() with fx-row carrying a pending DEBUT 60 AND a pending UNLOCK
  65 (in that order) beside fx-press's hidden entry, fx-row's card is 60 on every set on the head and 65 under w07: another lift's
  card changes because this lift's entry was hidden. Specified boundary: (v) EXPECTED CARD "The day's other lifts are unaffected" and
  "the entry, its history and the fold state are unchanged" (a projection that permutes what it keeps is not "only hides").
  Reachable: one old-app lift carrying a debut and an unlock at once, the class my l3 B-R22L3-1 input (b) named and the builder's
  22d reachability note accepted ("in the class the rows already model as reachable"); every existing fixture keeps at most ONE
  visible structural entry per lift beside a hidden one, so a permutation of the kept entries is invisible to all 254 + 51. My
  evaluated probe (probe4.cjs, head and w07) shows the projection's order preserved on inputs with no hide and with one kept entry
  (order [debut, unlock, info] on a numeric-w lift with nothing hidden; ['fx-row'] on the UNHELD base) and so does not reach the
  reversing case; the FC12-harness probe that would (an in-memory probe row through cardLoads, job fable-r22-l4-P, mut-p07.json)
  was queued behind the other seats' shared runs and had not started when this review closed (see What I could not do). Fix: one
  FC12 row (e.g. R22L4-KEPT-ORDER-OVER-NULL: legacyOverNullBase() plus fx-row's pending UNLOCK 65 after its DEBUT 60: the registered
  projection keeps fx-row's two entries in fold order [debut, unlock], hides fx-press's; fx-row's card is 60 on every set (the debut,
  as today), fx-press's is the baseline ask; red under w07 (fx-row 65), green on the head). No FA03 cell needed (the host reads the
  same projection).
- D-R22L4-1 (LOW; k03, FC01 :222 the check's KIND SET narrowed to debut/unlock): a pending legacy own / reclaim / ladder entry no
  longer refuses at :222 (on the head it does: STRUCTURAL :20 lists the five kinds; so the check on a w-null lift under a pending
  'own' entry alone is LEGACY_PENDING 'queue' on the head and passes :222 under k03, reaching the offer path unless :223's exercise
  flags stop it). Not shown reachable from this seat (a pending own/reclaim/ladder queue entry: E/writers.cjs reads those kinds only
  to mark them done; the same standing as my l3 D-R22L3-2). Cheap to close: R22L3-OTHER-KINDS-KEPT (251) already builds the fixture
  and never runs the check; one added assertion (the check on that fixture's baseline-ask completion refuses LEGACY_PENDING [Close
  Ref] 'queue' for the own / reclaim / ladder entry alone, i.e. with the debut removed) kills k03.
- D-R22L4-2 (LOW; k06, FC01 :223 the exercise branch's FIELD): `(ex.std && ex.own) || ex.reclaim || ex.ladder || ex.pendingThird`
  refuses LEGACY_PENDING [Close Ref] 'exercise'; with the field changed to 'queue' nothing in FC12 fails (no row names field
  'exercise': Select-String on FC12 finds 0 such rows; FC12 is FC01's only spec test, per the listings of rebuild/m4/spec,
  rebuild/m4/workout/test and rebuild/engine/test). Outside (iv) and (v) (an exercise-level legacy flag, not a queue entry); the
  old-app fields exist (E/writers.cjs' own/reclaim/ladder readers), so the input is reachable, but the clause is FC01's spec B, not
  R9.13's. Row: F0({reclaim: <invented>}) (and ladder, pendingThird, std+own), a normal completion: the check refuses LEGACY_PENDING
  [Close Ref] 'exercise'.
- D-R22L4-3 (LOW; the host tier's own singular fixtures; the builder's own disclosure): z04 (w 0), z06 (other kinds), w04 and w05
  (multi-entry per lift) survive FA03 51/51 because the host cells carry w null/ABSENT lifts with one hideable entry each; FC12 pins
  the same FC03.heldProjection the host reads (the X6/E1/z09/w01-w03 host kills show the overlay reaches it). One FA03 cell each
  beside R913-LEGACY-OVER-NULL-HOST (w 0 with a pending debut: the card prescribes newW; an own entry beside a debut: the own entry
  kept; demo-press under a debut AND an unlock: both hidden) closes the host tier. The PM's call, as with D-R22L2-2.

## VERDICT: REJECT (two blockers under the commissioned Q4 criterion, B-R22L4-1 and B-R22L4-2, test bytes only, one FC12 row each; B-R22L3-1 and D-R22L3-1..5 are PAID; every (iv)/(v) product clause is now killed; the head product is correct)
Round 22d pays everything l3 asked for, exactly: z09 dies at both tiers and at both quantifiers (248, 249, FA03 51) and nowhere
else; z04, z06, y02, y05 and y16 die each at its own row and nowhere else; the no-state case and the info and ladder iterations have
their own teeth (y18, y19, w12); the 22 further mutants kill 18 (multi-lift and multi-entry cardinality from every side, the gate,
the exId scope, the kind test, the check's refs/field/done clause, the host registrar and project() at both the queue and the
exercises, the revision gate). The two live specified-boundary mutants are not in the clauses R9.13 added; they are the quantifier
gaps that remain around them: THE CHECK's lift scope (k05: every two-lift fixture gives both lifts an entry) and the kept entries'
ORDER (w07: every fixture keeps at most one visible structural entry beside a hidden one). Both differences are read straight off
FC01 :222 and E/today.cjs :55-56/:98; both inputs are in the classes the rows already model; both fixes are one FC12 row. If the PM
rules that the Q4 criterion covers only the clauses R9.13 (iv)/(v) added, the verdict becomes ACCEPT WITH NAMED DEBTS (D-R22L4-1..5,
with k05 and w07 as D-R22L4-4 and D-R22L4-5); I recommend against that reading because "The day's other lifts are unaffected" is a
(v) sentence and both mutants make another lift's outcome depend on the hidden entry.

## Q5. Did any existing row change, weaken or disappear? NO
git diff --numstat -- FC12 FA03 report: +306/-0, +84/-0, +304/-0; 0 deleted lines anywhere (counted again from the cmd-redirected
diffs: FC12 306 '+' lines and 0 '-' lines; FA03 84/0; report 304/0). One hunk per file, appended after the last existing row (FC12 @@
-5137,3 +5137,309 after R913-TYPED-C2-CARRIED, the 22d block from :5342; FA03 @@ -1307,3 +1307,87 after R913-LEGACY-OVER-NULL-HOST,
the 22d cell from :1374; the report @@ -1030,3 +1030,307, the Round 22d section from :1242). The diffs carry no '-' line, so the
round-22c bytes are a prefix of the new files and no earlier byte moved. Every pre-existing row passes on the head (247 -> 254, 50 ->
51) and, per Q3 and Q4, stays green under all 65 overlays, so none was weakened to pass. No walk byte moved (the R7 and R8 walks run
inside whole FC12 at their defaults on every run; they tripped w02 and w10, so they are live).

## Q6. Counts (final bytes, my runs)
FC12 whole: 254 tests, 254 pass, 0 fail, 0 todo, 0 skipped, exit 0 (18 s on the head; the R7 and R8 walks at their defaults). FA03
whole: 51 tests, 51 pass, 0 fail, 0 todo, 0 skipped, exit 0 (25 s). FC12 235 -> 240 (round 22) -> 244 (22b) -> 247 (22c) -> 254 (22d:
tests 248-254); FA03 47 -> 48 (22) -> 50 (22c) -> 51 (22d: cell 51). 132 whole-file runs in the four plans (66 FC12, 66 FA03: the
head, the 43 l3 mutants, the 22 new ones; 00:00:30 to 00:14:49 local across the four shared slots) plus the head-vs-mutant probe
(probe4.cjs, 19 node runs, one pm-run job), every one with the GUARD line. Exit codes: the head runs and the nine runs my progress log
kept read exit 0 or 1 exactly as their fail count says; for the rest the exit is read from the TAP summary (node --test exits 1 iff
"# fail" > 0), because four concurrent Add-Content appends to progress.txt raced and only nine lines survived (a defect of my scratch
runner's log line, not of any run: every one of the 132 TAPs is complete, with its summary block and its GUARD line, and the tally
reads the TAPs, not the log).

## Q7. Hygiene
- FC12 564630 B sha256 03e22c30e8c90f7a939a21ee355907fe1f1a537990db5ce9cbf66122efec9e6a; FA03 117242 B
  a102bb65935fbfd67ac3d7b87bfeb4eb7bda745278665f50dfe6d7ba2043b11a; report 291853 B
  18cb5e60738494abf8680efbb006d8ea4c7f5c8800c275e312d9936911b6260a; CR 0, non-ASCII 0 in all three (no U+2013/U+2014); LF. The
  builder's FC12 and FA03 hashes (report section 5) re-measure equal. The l1 (241e3bad...), l2 (b2fcd37d...) and l3 (657138e9...)
  reviews are untracked and untouched.
- Unchanged product (Q1): FC03 b25d2e61..., L/source-admission.mjs 10bd5cfb..., FC01 92a4a0b4..., W/engine-capture.cjs fa68a748...,
  w6 admission test bcc6df4d..., L/today-bindings.mjs 91aa980f..., E/today.cjs 685f6e1e..., E/writers.cjs c7b11beb... (full hashes
  above; equal to the bd7654a blobs byte-exact). No FC03 hunk, so no ISSUANCE hunk and no revision move (D-R13L1-2 unchanged).
- GUARD "protected-in-cache: none; refused: none" in all 132 TAPs and in the probe; no protected-five file read, listed, grepped,
  loaded or executed (every git diff/cat-file named explicit FILE paths after --; the Select-String calls ran on FC12, FA03, the
  report and my l3 spec copy by explicit path; the only directory listings were rebuild/m4/spec, rebuild/m4/workout/test,
  rebuild/engine/test and the reviews folder, to look for another FC01 spec file: there is none); the w6 admission cells not run
  (STOP-R21B-1 stands, CI-only); no npm install; no lock file touched by hand (every run through pm-run shared; my four slots were
  freed by 00:14:49 and the prep job waited its 370 s behind the S10 exclusive as the brief said it might); every file I wrote was
  written with write_file (LF, ASCII); the earlier review scratch folders were read only; %TEMP%\earned-astra-137 untouched. Overlays
  applied exactly once per file per child (w04/w05 three times at FC12, an idempotent repeat, explained in Q4); the only applied-0
  runs are the expected n/a pairs (the ALV mutants at FA03; the ESM mutants at FC12).
- Carried debts (Astra L14 and earlier, the PM's): D-L12-ISSUANCE, D-L14-HOST-MUTANTS, D-L13-TYPED-C2, D-R13-LEGACY-OVER-NULL-ASK,
  D-R13L1-3, D-R13L1-2, D-L14-RECOVERY, D-L12-CUSTODY, D-L12-CONFIG, D-L14-CALIBRATION, D-L14-CI, D-L14-OWNER. PAID: D-L14-LEGACY-NULL
  (round 22), B-R22-1 and D-R22-1 (22b), B-R22L2-1, D-R22L2-1 and D-R22L2-2 (22c), B-R22L3-1 and D-R22L3-1..5 (22d). The builder's
  X6b and my z01/y07 stay live-equivalent as l3 reported (z01 and y07 re-run here: 254/254, 51/51). New this review: B-R22L4-1,
  B-R22L4-2, D-R22L4-1..3.

## Builder's Round 22d section (report :1242-1336, read LAST): TRUE on every point I could measure
The counts (254/254, 51/51), the kill table (rows 236-254 and cells 48-51 by test number, identical to mine cell for cell, including
M01's fourth FC12 kill at 249's ABSENT form and X6's third at 249's unlock), the red-first witnesses (the same failing assertions and
actual values as under my overlays: z09's [0,1,[['fx-row','debut',60]],BASELINE_UNPROVEN x2] and [1,[['fx-press','unlock',65]],
BASELINE_UNPROVEN], z04's [0,[],[0,0,0]], z06's [[],[null,null,null]], y02's [[],false,true], y05's undefined at QUEUED, y16's named
[]), the z04 note that the card falls back to [0,0,0] rather than my l3 "baseline ask" (correct: E/today.cjs :103 asks only for a null
w; the row pins the specified [5,5,5] either way), the sha256 list, the numstat (+306/-0, +84/-0), the hygiene line, the prefix
claim (0 '-' lines), the disclosure that z04 and z06 survive FA03 (re-measured: 51/51 each; my D-R22L4-3 carries it with w04/w05), and
the disclosure that the y05 no-state case was read from my probe rather than re-measured (now measured by my y18: killed at "no
state key: the shifted vector") all re-measure or read as stated. The builder's overlays were built from my l3 descriptions; mine are
independent and agree. The section could not mention k05 or w07 (quantifiers outside every anchor family the l1-l3 reviews named) or
D-R22L4-1..2.

## What I could not do
Run the FC12-harness probe of the four live mutants (mkprobe.cjs appends four print-only rows to FC12 IN MEMORY: the check on an
entry-free lift beside an entry-bearing one under k05, the check on a pending own/reclaim/ladder entry under k03, the :223 field
under k06, fx-row's card with [debut 60, unlock 65] kept beside a hidden entry under w07; head p00 and p03/p05/p06/p07; job
fable-r22-l4-P, prepP.cmd, planP.txt): it was queued through pm-run shared at 00:16 and had not taken a slot by 01:09, because the
other seats' today17hunt shared runs, the s10-ci1 exclusive and then the s10-full1 exclusive held the pool continuously; it will
run on its own when a slot frees (pm-run waits up to 240 min) and write out\fc12-p00.txt ... fc12-p07.txt with "# L4PROBE <tag>
{...}" lines (it writes no product or test byte). The two blocker differences therefore rest on the evaluated mutant runs (live at
254 + 51) plus the read paths FC01 :222 and E/today.cjs :53-57/:98, not on an evaluated call of the differing input; the PM can
read the probe output when it lands, or ask for it to be re-queued. Also not done: the w6 admission cells or anything loading the
protected five (CI-only); the 80-file broad set (exclusive; not in the brief; no product byte moved); reading the old app's src to
settle the reachability of a pending own/reclaim/ladder entry or of a lift carrying a debut and an unlock at once (the same standing
as at l3); re-proving the R9.11 :158 INVARIANT (z01 rests on it as the spec does).

## AAR
- Asked: blind level-4 CONVERGENCE check of rounds 22 + 22b + 22c + 22d (the test-only payment of my l3 B-R22L3-1 and D-R22L3-1..5):
  Q1-Q7, own overlays for z09/z04/z06/y02/y05/y16 plus the whole l3 set on the new bytes, at least 10 further single-clause mutants
  in the least-covered areas (host tier, multi-lift and multi-entry orders, R1 vs R2, the check's field and refs), cumulative kill
  rate, verdict with named debts.
- Happened: product bytes re-hashed unchanged against the bd7654a blobs; eight 22d rows read against (iv)/(v), all pinning the
  specified outcome (the z04 [0,0,0] fallback changes nothing); all 43 l3 mutants re-run: the six l3 survivors now die, each at its
  own row and nowhere else, every earlier kill still kills, 235 + 47 pre-round rows green throughout; 22 new mutants: 18 killed, 4
  live, 0 equivalent; cumulative 50 of 56 (89%; 93% excluding the two proven equivalents); two live ones make another lift's outcome
  depend on the hidden entry (the check's lift scope, the kept entries' order) and are blockers under the criterion as written.
- Went well: reusing my l3 anchors, verified again exactly-once on the current bytes, let 132 whole-file runs finish in 14 minutes
  across four shared slots; the ESM load hook made three more host-tier clauses mutable (h03/h05/h06 killed by 11/8/7 cells); y18,
  y19 and w12 proved the 22d rows' per-case teeth independently of the builder's single first-failure witnesses.
- Went badly: the FC12-harness probe of the live mutants starved behind other seats' runs for 53 minutes and closed unrun, so the two
  blocker differences are shown by read path, not by an evaluated call; my runner's progress log lost 123 of 132 lines to a
  four-writer append race (the TAPs, not the log, are the record).
- Change next time: give every probe its own plan line inside the main jobs (not a later job that must win a slot race), and pin
  per-lift and order clauses in the same sweep as cardinality ("EVERY" has three shapes: every instance, only this lift, kept as is).
- Verdict: REJECT on B-R22L4-1 (k05, THE CHECK's lift scope) and B-R22L4-2 (w07, kept-entry order), one FC12 row each, test bytes
  only; B-R22L3-1 and D-R22L3-1..5 PAID; D-R22L4-1..3 named; the PM may rule the two blockers down to debts D-R22L4-4/-5 if the Q4
  criterion is scoped to R9.13's own clauses.
