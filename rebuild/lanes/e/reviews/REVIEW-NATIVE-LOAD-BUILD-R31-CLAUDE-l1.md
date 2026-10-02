# REVIEW NATIVE-LOAD BUILD ROUND 31 (engine tier), Claude l1

Reviewer: Claude (Opus), commissioned by the Earned PM (DECISIONS:862); blind; engine tier

Object (worktree %TEMP%\earned-nlr, HEAD bd7654a, uncommitted), sha256 measured on disk, all equal to the brief:
- FC01 rebuild/engine/native-load.cjs d9d6b79ef9064db4df4a8453d174ff36e4f1b69853f99dafd5e8e4e07ff5cacf
- FC03 rebuild/m4/workout/native-load-effects.cjs 94c3a04c489dd303b9a0b9787c1a82180d72b7cc49a3f94650f84d590a225032
- FC12 rebuild/m4/spec/native-load-options.test.cjs be263f7f96cdf99d9c1eef7adf2d60c3858d4de044ea3e8da00b85e97d9d9e81 (420)
- FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs eb3693000e8349c78c83ed8fb4deddc23901153bd12e24bb1fef4dad5849b752 (103)
- report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md 0a7f6193edd3a321e3f5b70fbee250206c4eb308c1805c482512f4b22c187c82
- spec R9.13 (cmd /c git show 7ef8291:... > scratch) eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb

VERDICT: REJECT (blockers B-R31C-1 product, B-R31C-2 product/contract, B-R31C-3 rows; named debts D-R31C-1..6)
REQUIRED CHANGE: yes (two one-clause FC03 fixes, both measured non-regressive on whole FC12 424/424 with my probe rows; three rows)

Method: every run via node %TEMP%\pm-run.cjs shared, ONE slot at a time (jobs rc31-*), run.ps1 = pm9-joint31\run30.ps1 with only the scratch
path changed (TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03, nlr-build guard.cjs + deps-loader.mjs); mutants, probes and fixes are IN-MEMORY
overlays (NLR_OVERLAY / NLR_ESMOVERLAY; each child prints "applied 1"); every TAP "GUARD protected-in-cache: none; refused: none". Probes are
print-only rows appended in memory to FC12 (probe.js..probe5.js). Scratch %TEMP%\review-nlb-r31-claude-scratch (out\*.txt, mut\, tally.ps1).
Baseline on the object: FC12 420/420 (out\base-fc12), FA03 103/103 (out\base-fa03). Fixture values invented; R1 = present revision, R2 absent.
I formed my product view and ran my probes and mutants before reading the round-31 report and R31U-REPORT.

## BLOCKING
B-R31C-1 PRODUCT (L21-B2's repair incomplete; FC03:533). The new proper-prefix S4 check chooses the expected current from the RECORD'S OWN
  set.state: `same(set.current, set.state === 'performed' ? (...) : null)`. :155 S4 binds current to "the slot's value after exactly those edits",
  which replayEdits already gives (upTo.active). Executed (probe RC31P-C, out\p1-probe): C1 at 95 plus an ADDED set 4 performed 95x5, corrected
  to 6 reps before the yes (adopt-observed 95 offered), corrected again to 7 reps after it; the genuine record re-issued with sets[3] = {state:
  'skipped' or 'removed', current: null}, R1 and R2 -> head: applied exactly as the genuine record (w 95, spent 1, BASIS_REPAIR_REQUIRED only).
  Spec: RECORD_INVALID evidence, nothing applied. On an ORIGINAL set of r31later (the row's own fixture) the same claim is refused but misnamed:
  target_load, or decision.target_load plus a stray BASIS_REPAIR_REQUIRED when the target is adjusted. Fix (FIXC, one clause): compare with
  `upTo.active ? cur(upTo.value) : null`. Measured: whole FC12 + probes 424/424 (out\fixC-whole); every forged case -> RECORD_INVALID evidence,
  w 100, spent 0; genuine records unchanged (w 95); the removal case of R31-S4 stays red-on-forgery. Row owed: this input, red first.
B-R31C-2 PRODUCT / R1 = R2 contract (L21-B3's repair incomplete on L21-B3's own member; FC03:594-595). The MISSED-DEBUT ANCHOR compares the
  claim's base_load.fields.w/wSets and scalar/vector with the missed earn's by JSON member order (same). Executed (RC31P-B): missedDebut(95), the
  genuine claimed adopt-observed (authority_refs [fx-close-3]) re-issued with base_load.fields.w (or fields.wSets, or fields.w and load_basis.w)
  written {value,present} -> R1: applied w 95, no issue; R2: RECORD_INVALID base_load [fx-resp-3], w 100. Spec :61 and :156 (c1) (the brief's
  L21-B3 ruling) say the wrapper is compared by presence and value; the round's own contract says R1 = R2. Fix (FIXB): sameData at :594-:595.
  Measured: whole FC12 + probes 424/424 (out\fixB-whole); the three wrapper cases then apply w 95 under R2 too (R1 = R2).
B-R31C-3 ROWS (round-31 clauses LIVE with an observable specified difference on a re-digested record; whole FC12 420/420 under each):
  (a) K03 FC01 sameWrapper keeps presence, drops `same(a.value, b.value)`: base_load.fields.w {present:true,value:90} beside load_basis.w 100,
  R1/R2 (RC31R-G): head RECORD_INVALID base_load (:156 (c1)); mutant EFFECT_CONFLICT load_basis, the forged record kept in the spend index
  (queued DEBUT 105 for the earn) and its Undo offered and applied. No row pins (c1)'s VALUE half (K02, the presence half, is killed by
  R13-DECODE and R28A-08). (b) K06 replayEdits applies a correction that was itself removed; (c) K05 replayEdits writes {clear:true} instead of
  deleting: on a proper prefix whose later edit is a tombstone of the listed correction (K06) or a correction clearing reserve (K05), a record
  with set 1's current reps forged to 3 is RECORD_INVALID evidence on the head and APPLIED (w 95, spent 1) under the mutant, R1 and R2
  (RC31S-H, out\p4-*). The replay treats these histories as faithful on the head, so S4 binds them; no row holds either semantics.

## Q1 PRODUCT (measured)
- Scope: git status: exactly the five M files plus untracked reviews; product diff vs bd7654a = FC01 (+12/-1) and FC03 only; today-entry.mjs
  and today-bindings.mjs have no diff. The new literals are refusal codes/fields/reasons ('unexpected exception', 'NATIVE_LOAD_CONTAINED'); the
  panel renders notices by code (today-entry.mjs:278), never an issue reason; no template, copy or displayed string changed.
- Sets bound (FC01:490): refuses base_load unless base_load.vector.length === n BEFORE any allocation. Equivalent in outcome to the old full
  compare (planVector returns exactly n = max(1, sets||1) elements), so it refuses no genuine record. Allocation audit (mine, FC01 and FC03 every
  Array.from/new Array/fill/while/for): FC01:110/129/398 size by the state's ex.sets, :406 by authentic slot count, :178/:185 and FC03:143/149/
  159 by capture length, FC03 replayEdits and the S4 loop by authentic edit ids/slots, replays by record count; progression nextLoad/loadRungs
  loop only over the record's steps ARRAY. No record-supplied number sizes a loop or allocation now. K01 (bound removed) is killed.
- Residue (D-R31C-2): n still reads a non-safe-integer sets as 1, so on a one-set programme load_basis.sets 2.5 or 1e20 is APPLIED as genuine
  (RC31Q-E, R1 and R2) where (c2) "length max(1, sets)" has no such vector; inert (sets is read nowhere else); R31-FUZZ misses it only because
  fx-press has three sets.
- Current typing (L21-B1): isReps/isReserve match E/performed.cjs recorded()/effort() (exact 0-2, at_least 3); genuine records pass (base green).
- Containment: a Contained throw carries the judged group's op ids; foldNativeLoad replays with the group deleted before the conflict and event
  passes and refused RECORD_INVALID payload. foldOnce never mutates its inputs (withFacts json-copies; issues/spent/effects fresh per pass).
  Measured beyond the rows (RC31Q-F): the Undo of fx-press's APPLIED adoption throwing after its transition -> RECORD_INVALID payload
  [fx-resp-u], w 95 still adopted, spent = the fold without the Undo, fx-row 95: nothing of it applied, the rest equals the fold without it.
- PRODUCER_REVISION: recomputed from the 14 engine files by my rev.cjs (out\rev.txt): 980b80cdf0a480342a8df0c5b7ba6d4323ee04b70b4ba3d03b18f7881c066607
  = the constant; only native-load.cjs moved; consequence as :155 (51730efc records apply as written with ABSENT_APPLIED).
- D-R31-1 answered YES (RC31P-A, out\p1-probe; two-lift and one-lift, R1 and R2): re-ordered but semantically equal records are REFUSED for
  base_load.scalar or base_load.vector[0] {unit,value} (FC01:493, base_load, every kind, R1 and R2), evidence current {reps,load,reserve} or
  current.load {unit,value} (FC03:521/:619, evidence), basis.source members reversed (FC03:546, basis.source); target_load Loads, candidate,
  Decision, basis and load_basis member orders are APPLIED. No genuine record is affected (the host writes one order), so outside B-R31C-2
  (which also breaks R1 = R2) I carry it as D-R31C-1 for the PM's :61 ruling. K16 (compensation reproduction same) is LIVE in this class.

## Q2 THE ROUND-30 ITEMS (re-applied on the object; FC12 with NLR_SKIPWALK=1 = 418 rows, FA03 whole)
- B-R30F-1 = B-R30C-1 (sets): R31-SETS pins 2147483647 and 1e7 under an allocation bound; K01 killed by it and R31-FUZZ.
- Reviewer mutants, all KILLED (out\rv-*): RC-01 416/418 (R31-CURRENT-TYPED-LEAVES, R31-TARGET-LOAD-UNIT), RC-07 417/418 (R31-EDIT-REF),
  Fable V01 415/418 and Astra N02 415/418 (R31-REF-COMMITMENT, R31-EDIT-REF, R31-FUZZ), V02 416/418 (as RC-01); FA03: RC-21 102/103
  (R31-BR30C2), L21-N15 102/103 (R31-L21B7), RC-16 102/103, RC-17 102/103, RC-22 102/103 (their R31 cells). Containment mutants (RC-08..11,
  RC-24, V10, V11, N07..N09, N16): anchors gone; successors K11 (group not removed) and K12 (landing judging dropped) KILLED by R30-CONTAINMENT
  and R31-CONTAINMENT-*; K10 = D-R30C-5 refs LIVE (unreachable, carried).
- L21-B1/B2/B3 on Astra's own inputs: green in R31-CURRENT-TYPED-LEAVES, R31-S4, R31-WRAPPER; L21-B4/B6: R31-CONTAINMENT-*; but B-R31C-1/-2
  above are the same two classes one input away.

## Q3 SPEC FIDELITY OF THE NEW ROWS AND CELLS
- FC12 R31-*: each asserts :155/:156 outcomes (RECORD_INVALID with the owning field, nothing applied, fx-row unchanged, R1 and R2), not head
  output. Gaps: R31-S4 has no state-claim case (B-R31C-1) and no removed-correction or clear history (B-R31C-3 (b)(c)); R31-WRAPPER covers the
  earn only (B-R31C-2); no row pins (c1)'s value half (B-R31C-3 (a)). The corrected R30-CONTAINMENT landing tuple ([] native, w 100) is what
  :155 "nothing applied" requires: a correction, not a weakening. R31-FUZZ: assertions right; its `sets` site is judged only through a
  three-set fixture (D-R31C-2).
- FA03 R31-* (U): each drives the real installation, Today entry and rendered buttons and asserts :101/:174/:97/:352/:356 outcomes; reviewer
  mutants red on exactly their cells (above). U's EQUIVALENT proofs: E1 checked (the only product callers of accept/decline are the click
  handlers today-entry.mjs:286/:288, which discard the result; no other product file calls them); E2-E4 read and agreed. SPEC-SILENT S1-S4
  agreed; S2 (TE015/016) is the weakest: the answered card stays with a dead Yes and the other lift's card disappears; :352 "one yes per chosen
  alternative" holds and :101 does not say only decline dismisses, so silent, but worth a PM word (D-R31C-5).

## Q4 MY MUTANTS (18 single-clause, whole FC12 with walks and both fuzz rows at defaults; out\K*.txt)
| id | clause (before -> after) | FC12 | class |
|---|---|---|---|
| K01 | FC01 sets-bound line removed | 418/420 R31-SETS, R31-FUZZ | KILLED |
| K02 | FC01 sameWrapper drops presence | 418/420 R13-DECODE, R28A-08 | KILLED |
| K03 | FC01 sameWrapper drops value | 420/420 | LIVE, specified (B-R31C-3 a) |
| K04 | replayEdits: a removed tombstone still removes | 419/420 R31-S4 | KILLED |
| K05 | replayEdits: {clear:true} written, not deleted | 420/420 | LIVE, specified (B-R31C-3 c) |
| K06 | replayEdits: a removed correction still patches | 420/420 | LIVE, specified (B-R31C-3 b) |
| K07 | prefix replay over all edits | 418/420 R31-CURRENT, R31-S4 | KILLED |
| K08 | faithfulness test -> `if (all)` | 420/420 | LIVE, D-R31C-3 (differs only on an interpretable unfaithful history; none shown genuine) |
| K09 | canon without key sort | 419/420 R31-WRAPPER | KILLED |
| K10 | excluded-group refusal refs = first op | 420/420 | LIVE = D-R30C-5 / O20 (unreachable) |
| K11 | excluded group not deleted | 417/420 R30-CONTAINMENT, R31-CONTAINMENT x2 | KILLED |
| K12 | landing `judging = g` dropped | 418/420 R30-CONTAINMENT, R31-CONTAINMENT-NOTHING | KILLED |
| K13 | isReserve exact 0-3 | 420/420 | LIVE, EQUIVALENT on bound histories (RC31T-I: evidence either way, R1 and R2) |
| K14 | isReps negative allowed | 420/420 | LIVE, EQUIVALENT on bound histories (RC31T-I) |
| K15 | movedBase sameImage -> same | 419/420 R31-WRAPPER | KILLED |
| K16 | compensation reproduction sameData -> same | 420/420 | LIVE, D-R31C-1 class (a re-ordered Undo under R1) |
| K17 | reproduction sameData -> same | 419/420 R31-WRAPPER | KILLED |
| K18 | isReserve at_least >= 3 | 420/420 | LIVE, EQUIVALENT on bound histories (RC31T-I) |
KILLED 9, LIVE 9: 3 blocking (K03, K05, K06), 3 equivalent on bound histories (K13, K14, K18: every S4 path compares current with the
authentic typed value, whose domain equals the validator's; they differ only where replayEdits returns null, D-R31-2), 3 debts (K08, K10, K16).

## NAMED DEBTS
- D-R31C-1 (= builder D-R31-1, answered above): member order still decides for base_load Loads (FC01:493), evidence current (FC03:521/:524/:619),
  basis.source (:476/:546), the compensation compare (FC01 retireShaped) and K16; PM ruling on :61's reach owed; one sameData rule would close it.
- D-R31C-2: non-safe-integer load_basis.sets applied as genuine on a one-set programme (RC31Q-E); inert; fuzz fixture blind to it.
- D-R31C-3: K08; the faithfulness gate is unpinned; I found no typed history where it matters (builder D-R31-2).
- D-R31C-4: blame: in a Close event, a throw from the session facts after `judging = g` (captureOf, provenBefore) is charged to the record
  being landed and refuses it RECORD_INVALID payload; unreached by any non-injected input (builder C01); only throwing genuine facts could do it.
- D-R31C-5: U's S2 (TE015/016) policy question above; S1, S3, S4 agreed silent.
- D-R31C-6: carried, not re-measured: D-R30F-1 (genuine Undo with workoutFacts null refused by containment), D-R30C-1/D-R30F-2 (pre-S1
  fields), D-R30F-3/4/8, D-R30C-3/5/6, D-L21-N14, D-L21-OPAQUE, builder D-R31-3 (edit of an edit, O22).

## NOT VERIFIED
- The builder's kill tables b/c/d/v/f and its extended fuzz/walk shards (I ran defaults inside every whole FC12); the hosted sweep.
- FA03 under my mutants except K03 and K06 (both 103/103 LIVE there too: FA03 folds genuine host records only); the 56 TE mutants (U's
  table read, 5 FA03 reviewer mutants re-run); browser/phone harnesses; the 80-file set; the protected five (never read, loaded or run).
- Whether the typed edit fold admits a correction whose patch is {clear:true} on reserve, or a tombstone of a correction, in genuine use
  (my K05/K06 fixtures set the fact's current by hand, as the round's own rows do).
- Disclosure: one recursive Get-ChildItem over rebuild\m3 and rebuild\m4 enumerated file names (filtered to non-test paths before any
  content search) to check product callers; no content of any private/soak/ledger path was read or shown.
- Nothing committed, staged or pushed; DECISIONS/STATUS untouched; no object file written; only this review written in the worktree.
