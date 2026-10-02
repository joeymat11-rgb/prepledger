# REVIEW-NATIVE-LOAD-BUILD-R22-l1 (Fable, independent reviewer l1 of NATIVE-LOAD build round 22; blind to the builder's reasoning)

Reviewed: earned-nlr, branch rebuild/e-native-load-red, HEAD bd7654a798592a7dae421b9d68fec850fb0993d1, the UNCOMMITTED working tree
(git status --porcelain with explicit paths names exactly three files: FC12 rebuild/m4/spec/native-load-options.test.cjs, FA03
rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs and rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md; git diff --stat with the
same eight explicit product/test paths: 166 insertions, 0 deletions). Inputs read in this order: Astra L14 (earned-astra-131
rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L14.md, B1-B4 and the mutation table), Astra's P folder (listing and the four
L14-M0x descriptions only; her overlays were NOT reused), spec R9.13 at 7ef8291 (git show 7ef8291:rebuild/coach/NATIVE-LOAD-SPEC.md,
384796 B, sections N (iv) :597-604 and (v) :606-611), the object diff (git diff -- FC12 FA03, 105 added lines, read whole), the
product regions the rows exercise (FC03 :262-273 heldProjection, L/source-admission.mjs :840-863 A-LEGACY-VECTOR, W/engine-capture.cjs
:76-90, FC01 :559-597 adopt/compensate; none of the protected five), and the builder's Round 22 report section LAST.
Every node run went through node %TEMP%\pm-run.cjs shared (jobs fable-r22-l1-*), guard preload nlr-build\guard.cjs ("GUARD
protected-in-cache: none; refused: none" checked in every TAP), TZ America/New_York, MEASURED_TEST_NOW 2026-09-03. Mutants are my own
in-memory preloads (scratch ovm.cjs on the CJS compile step, ovt.cjs on the text FC12 reads for L/source-admission.mjs), built from my
own anchors in the product bytes; no product file was written. Scratch: %TEMP%\nlr-r22-review-scratch (h1/h2.cmd, mk.ps1, mut-*.json,
run.ps1, p1.txt, out\*.txt, tally.cjs). This review is the only new worktree file; no tracked file was edited; nothing committed,
pushed, fetched or written to DECISIONS/STATUS. Every fixture value below is invented.

## Q1. Test-only? YES (re-measured byte-exact)
sha256 of the working file vs `git cat-file blob bd7654a:<path>` (node, byte-exact, CR 0 and ASCII only for every file):
- FC03 rebuild/m4/workout/native-load-effects.cjs: SAME b25d2e61 (92274 B)
- L/source-admission.mjs rebuild/m3/w6/local/source-admission.mjs: SAME 10bd5cfb (74465 B)
- FC01 rebuild/engine/native-load.cjs: SAME 92a4a0b4 (51352 B)
- W/engine-capture.cjs rebuild/m4/workout/engine-capture.cjs: SAME fa68a748 (11278 B)
- w6 admission test rebuild/m3/w6/test/local-source-admission.test.mjs: SAME bcc6df4d (20125 B)
- FC12: DIFF, head 76dbee6d (516028 B) -> work 38693ffe (528096 B); FA03: DIFF, head 285027b0 (106387 B) -> work 51cbeeb1 (108911 B);
  report: DIFF, head 0657385e -> work 9e47d903. The builder's five product hashes are what the bytes measure.

## VERDICT: REJECT (one blocker, B-R22-1, test bytes only; the four L14 blockers B1-B4 are PAID; the head product is correct)

Astra's B1-B4 are paid by rows that assert the specified boundaries (Q2) and that are the only killers of my own M01/M02/M03/M10
overlays over the whole FC12 and FA03 (Q3). The reject rests on the commissioned Q4 criterion: one of my eight new single-clause
mutants, N5 (the shift anchored on Math.max(...ex.wSets) instead of ex.w), survives all 240 FC12 rows and differs from the specified
CONVERSION on an in-P input, because every ALV input in FC12 and in the walk has max(wSets) = w. The fix is one FC12 row (below),
red under N5 and green on the head, shown here by probe. No product byte needs to move; no STOP.

## Q2. Does each new row assert the SPECIFIED boundary? YES, for all six (spec 7ef8291, section N)
- L14-B1-ABSENT-W-PROJECTION (FC12 :5153): F0({w:undefined}) DELETES the field (F0 :69 `if(v===undefined)delete ex[k]`), so the
  input is ABSENT, not a present null; wField asserts Object.hasOwn after the fold. Asserts (v) RULE ("every lift whose projected w is
  null or ABSENT": 0 unfinished fx-press entries in heldProjection's queue), EXPECTED CARD (b39Card [null,null,null], the baseline ask,
  the day prepares), THE CHECK (refused NATIVE_LOAD_LEGACY_PENDING, refs [C1 Close Ref], field 'queue') and "nothing durable is written"
  (w ABSENT, no native_load_authority, no 'adopt:' receipt, the entry still pending), host v1 and typed v2, R1 and R2. Under M01 it fails
  at the projection assertion (entry shown, card ENGINE_CAPTURE_BASELINE_UNPROVEN), Astra's own witness.
- L14-B1-ABSENT-W-UNDO (:5165): Astra's reachable recorded variant. Adopt-baseline 60 on the ABSENT-w ask, its yes, its Undo while
  applied as a RESTORE (base 60, target null: the record's own shape, R9.4 :156), then re-admitted at w 100 with a pending legacy DEBUT
  105: asserts the Undo restores w ABSENT (FC01 :585 present:false -> delete), (v) hides the entry, the card is the baseline ask, the
  later check refuses LEGACY_PENDING, and afterwards w ABSENT / authority unchanged / no receipt. Control (not re-admitted) asserted too.
- L14-B2-EXPLICIT-NULL-NEWWSETS (:5191): (iv) DEFINITIONS "q.newWSets === undefined" and UNCHANGED BY THE RULE: a present-null
  newWSets is not a legacy scalar structural entry: named [], JSON byte-identical, newWSets still null, and the day refuses
  ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED (W/engine-capture.cjs :82 takes the null vector, :85 refuses it: the carried present-null limit,
  D-L14-LEGACY-NULL, nothing raised). The present-null wSets shape is asserted untouched and refused as today (:83). Control: absent
  newWSets converts to [105,105,100].
- L14-B3-SHIFT-ANCHOR-FIRST-BELOW-W (:5211): (iv) CONVERSION literal: w 100, wSets [95,100,97.5], newW 107.5 -> [102.5,107.5,105]
  (+7.5 on every set, the ex.w anchor), nothing else written (deep-equal after deleting newWSets), every set <= newW, the real capture
  gives the vector; unconverted control refuses at :83. M03 (wSets[0] anchor) gives [107.5,112.5,110], a set above the old card.
- L14-B4-FRACTIONAL-ALV (:5217): (iv) CONVERSION exact value, w 100, inc 2.5, wSets [100,100,95], newW 102.5 -> [102.5,102.5,97.5];
  M10 (Math.round) gives [103,103,98], above newW without a yes.
- FA03 L14-B1-ABSENT-W-HOST (:1314): the same admitted basis as R913-LEGACY-OVER-NULL-HOST with demo-press's w DELETED (asserted:
  Object.hasOwn false on the basis); through the durable host on D1 and after a cold reopen on D3: gym.read ready, demo-press the
  baseline ask (load not_prescribed on every slot), demo-row 40 lb, host projection: no numeric w, 0 visible unfinished demo-press
  debut/unlock, no active issue. INFO (not a finding): the projection assertion is `pressOf(p).w == null`, which accepts null or
  absent; the ABSENT form is pinned on the basis, not on the projection after the host round trip. Acceptable: (v) EXPECTED CARD is
  the host-tier claim and it is asserted.
- Every value is invented (fx-press, demo-press, 60/100/105/107.5/102.5). No row pins "the head's current output" without a spec
  clause: each assertion above maps to a sentence of (iv) or (v) quoted in its title.

## Q3. My own overlays for M01, M02, M03, M10 (built from Astra's L14 descriptions; my anchors; not the builder's, not Astra's files)
Mechanism: ovm.cjs replaces exactly one occurrence in the source the CJS loader compiles (FC03/FC01); ovt.cjs replaces exactly one
occurrence in the text fs.readFileSync returns for L/source-admission.mjs (the bytes FC12 evaluates between the markers). Each TAP
carries the child's "# MUT/TMUT <id> applied 1" line (checked for all runs); the parent's exit line says applied 0 because the parent
never compiles the product file. Whole-file runs, pm-run shared, one slot:
| Overlay (my anchor -> mutant) | FC12 whole | rows red | FA03 whole | rows red |
| --- | --- | --- | --- | --- |
| head (no overlay) | 240/240, exit 0 | none | 48/48, exit 0 | none |
| F22-M01 FC03 `x && x.w == null` -> `x && x.w === null` | 238/240 | L14-B1-ABSENT-W-PROJECTION, L14-B1-ABSENT-W-UNDO | 47/48 | L14-B1-ABSENT-W-HOST |
| F22-M02 ALV `q.newWSets!==undefined)continue;` -> `q.newWSets!=null)continue;` | 239/240 | L14-B2-EXPLICIT-NULL-NEWWSETS | n/a (FA03 never reads the ALV text) | |
| F22-M03 ALV `x=>x+(q.newW-ex.w)` -> `x=>x+(q.newW-ex.wSets[0])` | 239/240 | L14-B3-SHIFT-ANCHOR-FIRST-BELOW-W | n/a | |
| F22-M10 ALV `x=>x+(q.newW-ex.w)` -> `x=>Math.round(x+(q.newW-ex.w))` | 238/240 | L14-B3, L14-B4-FRACTIONAL-ALV | n/a | |
Under every overlay all 235 pre-round-22 FC12 rows and all 47 pre-round-22 FA03 cells stay green (Astra's survival re-measured);
only new rows fail. The builder's claim "each overlay goes red, only the new rows fail" is TRUE on my overlays.

## Q4. Eight NEW single-clause mutants near the four boundaries (plus one extra), whole FC12 (240 rows) under each
| Mutant (file, my anchor -> clause) | Result | Killed by |
| --- | --- | --- |
| N1 B1: FC01 :593 applied-adoption Undo restores an absent prior as `ex[k] = null` (not `delete`) | K 235/240; FA03 47/48 | L14-B1-ABSENT-W-UNDO (new) + N29-UNDO-LOWER, R17-RETIRE-MEETS-APPLIED, R8-PROPERTY, RESTORE-COUNT; FA03 R17b-B31 (existing, the wSets side) |
| N2 B1: FC01 :585 held-adoption Undo restores an absent prior as `ex[k] = null` | K 238/240 | L14-B1-ABSENT-W-UNDO (new, the w side) + R17c-B35 (existing, the wSets side) |
| N3 B2: ALV `q.newWSets!==undefined` -> `Array.isArray(q.newWSets)` (any non-array newWSets converted) | K 239/240 | L14-B2-EXPLICIT-NULL-NEWWSETS only |
| N4 B2: ALV `q.done||` -> `q.done!==false||` (an entry with NO done key is skipped) | LIVE 240/240 | none (see D-R22-1) |
| N5 B3: ALV shift anchored on `Math.max(...ex.wSets)` instead of `ex.w` | LIVE 240/240 | none: BLOCKER B-R22-1 |
| N6 B3: ALV `ex.wSets.slice().sort((a,b)=>b-a).map(` (shape re-ordered before the shift) | K 239/240 | L14-B3 only (non-monotone input) |
| N7 B4: ALV `Math.floor(x+(q.newW-ex.w))` | K 238/240 | L14-B3, L14-B4 only |
| N8 B4: ALV `x+Math.round(q.newW-ex.w)` (the delta rounded) | K 238/240 | L14-B3, L14-B4 only |
| E1 extra B1: FC03 :271 hide predicate `!q.done` -> `q.done === false` (an entry with NO done key stays visible) | LIVE 240/240; FA03 48/48 | none (see D-R22-1) |
Every killed mutant is killed by a non-revision-pin assertion; N3, N6, N7, N8 are killed ONLY by the round-22 rows, which is the
sensitivity B2-B4 were meant to add. N1/N2 show the new UNDO row pins the w side of the absent-prior restore, which no earlier row did.

### B-R22-1 (BLOCKING under the Q4 criterion; test bytes only): the CONVERSION anchor ex.w is not pinned against max(wSets)
- N5 replaces `q.newW-ex.w` with `q.newW-Math.max(...ex.wSets)`. Spec (iv) CONVERSION is `ex.wSets.map((x) => x + (q.newW - ex.w))`.
  Under P every set is <= ex.w, so the two agree exactly when max(wSets) = w, and EVERY ALV input in the file has that property:
  alvState's default {w:100,wSets:[100,100,95]} (CONVERT, KINDS, IDEMPOTENT, LAND, B2, B4), B3's [95,100,97.5] (max 100 = w), and the
  walk's vector action writes [w,w,w-5] (FC12 :3196-3200 base(), I18 checks the base with the walk's own predicate over that shape).
- Observable difference on an in-P input (probe-n5.cjs evaluates the marker bytes exactly as FC12 does; head vs N5 vs M03, out\pr1):
  w 100, wSets [95,95,90], newW 105: head [100,100,95] (the specified formula); N5 [105,105,100]; fractional w 100, wSets
  [97.5,97.5,92.5], newW 102.5: head [100,100,95]; N5 [102.5,102.5,97.5]. Every N5 set is still <= newW, so the PROPERTIES clause
  ("every element is <= q.newW") is silent; only the formula distinguishes, and the athlete's converted card would be 5 lb (2.5 lb)
  heavier on every set than the conversion the owner approved ("spread it evenly" from the lift's own w). Reachable: an old-app
  per-set-weight lift whose every set sits below its scalar w is inside P as the spec states P.
- Fix (one FC12 row beside L14-B3, e.g. L14-B3b-SHIFT-ANCHOR-ALL-BELOW-W): fx-press w 100, wSets [95,95,90] (every set strictly below
  w), pending legacy DEBUT newW 105 -> newWSets exactly [100,100,95], nothing named, nothing else written, every set <= 105, the capture
  gives [100,100,95]; and/or the fractional form above. Red under N5 (probe: DIFFERS), green on the head (probe: AS SPECIFIED). It also
  kills M03 (probe: [105,105,100]). No product byte moves.

## Q5. Did any existing row change, weaken or disappear? NO
git diff -- FC12 FA03: 105 added lines, 0 deleted lines (numstat FC12 +83/-0, FA03 +22/-0); the hunks are appended after the last
existing row of each file (FC12 after R913-TYPED-C2-CARRIED at :5137, FA03 after R913-LEGACY-OVER-NULL-HOST at :1307). New top-level
names (absentW, wField, l14c1, l14at, alvRow) collide with nothing (the file parses and runs; a duplicate const would be a SyntaxError).
Every pre-existing row passes on the head (235 + 47) and, per Q3, stays green under all four overlays, so none was weakened to pass.

## Q6. Counts (final bytes, my runs)
FC12 whole: 240 tests, 240 pass, 0 fail, 0 todo, 0 skipped, exit 0 (18 s; includes the R7 and R8 walks at their defaults).
FA03 whole: 48 tests, 48 pass, 0 fail, 0 todo, exit 0 (24 s). FC12 235 -> 240 (+5 rows), FA03 47 -> 48 (+1).

## Q7. Hygiene
- FC12 528096 B sha256 38693ffe3596048e3b5743779e0bdf9caa545908c070156ff89497552121c353; FA03 108911 B
  51cbeeb175607d10193c634076521732c0fc0c6d48b7b80624df0716aa592058; report 231687 B 9e47d903 (builder's hashes re-measured equal);
  CR 0, non-ASCII 0 in all three and in the diff's added lines (no U+2013/U+2014); LF.
- Unchanged product (Q1): FC03 b25d2e61..., L/source-admission.mjs 10bd5cfb..., FC01 92a4a0b4..., W/engine-capture.cjs fa68a748...,
  w6 admission test bcc6df4d... (full hashes in the builder's section 5 match the blobs at bd7654a byte-exact).
- GUARD "protected-in-cache: none; refused: none" in every TAP; no protected-five file read or loaded; the w6 admission cells not run
  (STOP-R21B-1 stands, CI-only).
- Carried debts (Astra L14, the PM's): D-L12-ISSUANCE, D-L14-HOST-MUTANTS, D-L13-TYPED-C2, D-R13-LEGACY-OVER-NULL-ASK, D-R13L1-3,
  D-R13L1-2, D-L14-RECOVERY, D-L12-CUSTODY, D-L12-CONFIG, D-L14-CALIBRATION, D-L14-CI, D-L14-OWNER. D-L14-LEGACY-NULL is PAID by
  L14-B2 (agreed with the builder's reading).

## NAMED DEBTS (new)
- D-R22-1 (LOW, named limit; not a blocker): the absent-`done` shape. N4 (ALV skips an entry with no done key) and E1 (heldProjection
  shows one) survive all 240 + 48. Spec (iv) says "q.done falsy" and (v) "not done", so an entry without the key is inside both rules,
  and the head handles it; but every fixture writes done:false, and every engine writer does too (E/earn.cjs :63/:80/:88/:97,
  E/writers.cjs :292/:296/:312 all write `done: false`), so I could not show the shape reachable from the old app (its src is not
  readable from this seat). One row pair (an entry without `done`: converted by ALV; hidden by the registered projection) pins it if
  the PM wants the confusion class closed; otherwise carry by name.

## Builder's Round 22 section (report :1034-1093, read LAST): TRUE on every point I could measure
Counts (240/240, 48/48, 238/239/239/238 and 47/48 under the four overlays), the kill table, the red-first witnesses (the same failing
assertions and actual values as under my overlays), the sha256 list, the numstat, the hygiene line and the debts paragraph all
re-measure as stated. The builder built its overlays from Astra's prepare-mutants.ps1 anchors; mine are independent and agree. The
report's remaining-owed list is complete for this round; it does not (and could not) mention B-R22-1.

## What I could not do
Run the w6 admission cells or anything loading the protected five; the 80-file broad set (exclusive; not in the brief; no product byte
moved); read the old app's src to settle D-R22-1's reachability; check DECISIONS:819 (not in this worktree's ledger).

## AAR
- Asked: blind level-1 review of round 22 (test-only payment of Astra L14 B1-B4): Q1-Q7, own overlays, eight new mutants, verdict.
- Happened: product bytes re-hashed unchanged; six rows read against R9.13 (iv)/(v); own M01/M02/M03/M10 overlays each red only on
  the new rows; eight new mutants + one extra: six killed (four only by the new rows), N5 max-anchor LIVE with a specified difference,
  N4/E1 absent-done LIVE without shown reachability; one probe shows the one-row fix red/green.
- Went well: the overlay preloads and probe made every claim a measurement in under 10 minutes of slot time; the builder's numbers
  reproduced exactly.
- Went badly: the LIVE mutant is of the same family as B3 (anchor), which the round could have closed with one more input; it was
  not in Astra's list, so the builder had no prompt for it.
- Change next time: when a blocker names an anchor, add the row for EVERY alternative anchor the input space admits (first set, last
  set, max, min), not only the one the reviewer's mutant used.
- Verdict: REJECT on B-R22-1 (one FC12 row, test bytes only, red/green already shown); B1-B4 PAID; D-R22-1 named.
