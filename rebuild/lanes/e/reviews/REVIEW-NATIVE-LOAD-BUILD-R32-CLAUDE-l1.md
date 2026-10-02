# NATIVE-LOAD build round 32 review (engine tier), Claude l1

Reviewer: Claude (Opus), commissioned by the Earned PM (DECISIONS:864); blind; engine tier

Object sha256 (measured at start and again at end, worktree %TEMP%\earned-nlr, HEAD bd7654a, uncommitted), all equal to the brief:
- FC01 rebuild/engine/native-load.cjs e589d0fc79e7f63e98d87fa48e25b6265ef9e44ec9877940f0266814e27d7f75
- FC03 rebuild/m4/workout/native-load-effects.cjs 698eb366ba43fac7a179eaf71711084b6db054974bcfba38210de0c2bd089a9e
- FC12 rebuild/m4/spec/native-load-options.test.cjs faa5ea4b5c4c062677ef7808b23505dbac194f4430f089ef6c67e85cb607c0ce (431)
- FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs eb3693000e8349c78c83ed8fb4deddc23901153bd12e24bb1fef4dad5849b752 (103)
- report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md 86a10b53f548de1f8f7511f159abe0ab145b3b7f80a6c2849e8595fe98790bc7
- R31U-REPORT.md 02161104...; spec R9.13 eb619d95...79dbb; r31 bytes for the diff: nlr-r32-scratch\fc0{1,3}-before.cjs = d9d6b79e / 94c3a04c.

VERDICT: ACCEPT WITH NAMED DEBTS (D-R32C-1..4)
REQUIRED CHANGE: no

Method: every run via node %TEMP%\pm-run.cjs shared, ONE slot at a time (jobs rc32-*); run.ps1 = pm9-joint31\run30.ps1 with only the
scratch path changed (plus the FUZZ31/FUZZ32 env vars cleared); TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03; nlr-build guard.cjs +
deps-loader.mjs; mutants and probes are IN-MEMORY overlays (NLR_OVERLAY / NLR_ESMOVERLAY), every one "applied 1" (78 of 78); all 81
TAPs "GUARD protected-in-cache: none; refused: none". Scratch %TEMP%\review-nlb-r32-claude-scratch (out\*.txt, mut\, muts-*.json,
p1/p2/p4.js probes, tally.ps1). Baseline on the object: FC12 431/431 (out\base-fc12), FA03 103/103 (out\base-fa03). I read spec, code
and the r31->r32 diffs, ran probes and designed my mutants before reading the round-32 report section and R31U; values are invented.

## Q1 PRODUCT (measured)
- Scope: git status = the five M files plus untracked reviews; diff vs bd7654a touches FC01 and FC03 only among product files. r31->r32:
  FC01 +9/-2 (canon + canonical same; the sets clause), FC03 +23/-16 (canonical same replaces same/sameData; negZero; S4 prefix line;
  PRODUCER_REVISION). No string literal changed except PRODUCER_REVISION; no template/copy/reason string touched.
- PRODUCER_REVISION: recomputed with .NET SHA256 over "rebuild/engine/<n>.cjs" NUL sha256hex LF for the 14 MODULES files =
  df0b960424b5f0c0a7b797cd198ddd4f1643f3e4ade9c9dd96a1a86613b40ee5 = the constant; only native-load.cjs moved (git diff --stat -- rebuild/engine).
- Member order, my own audit of every comparison in FC01/FC03 (not only the report's table): every object compare goes through `same`
  (JSON of canon, recursive key sort; integer-like keys enumerate numerically either way, so any key set gives one order). Remaining
  byte-level compares: proposalDigest (a digest, allowed), sha() of the ENGINE's own state vs the record's hash strings (engine data,
  not record members), spend_id/pair/refsOf-built JSON (strings or objects FC01 rebuilds member by member). evidenceChanged (:626) is
  canonical now (in r31 it was byte-level). No member-order dependence remains on record data; 16 site mutants O15-O26/RB1a/RB1b red.
- Negative zero: negZero runs on p.issuance.body as received (json() and the digest print -0 as 0) inside recordShape, one check per
  owning clause (payload / evidence / basis.coverage / basis.order / basis.source / base_load / candidate / target_load). Every numeric
  member of a Decision sits under one of these (the Decision's own members and the envelope are text/null by earlier clauses). The
  strict-JSON compare (:346) canonicalises before recordShape but cannot pass or refuse on -0 (it prints 0 on both sides), so the
  outcome is the ruling's. No genuine record can carry -0: issuanceFor json()s the body (FC03:1247), fieldImage/basisOf json() images.
- Counts: load_basis.sets is the only record count any clause reads (spec :156 (c2)); FC01:492 admits undefined/null/non-negative safe
  integers only, never coerced; n is bounded by base_load.vector.length before planVector allocates (containment unchanged: R31-SETS,
  R32-FUZZ count part under r31bounded, my fz-shard1). Genuine sets: engine writers keep sets >= 1 (writers.cjs:2195-2197, 2358); null
  when the programme has none (basisOf) -> admitted. prefix/hi/tenure_start are read by no clause (builder D-R32-3, agreed).
- S4 (FC03:540): the proper-prefix expected current is `upTo.active ? cur(upTo.value) : null`, the authentic fact after exactly the
  listed edits; no dependence on set.state. Genuine records cannot be refused by the change: FC01 evidenceOf emits a non-null current
  only for a performed slot with a fact, and a removed/unresolved slot at issuance has original null and edits [] (probe P2 shows it),
  so the proper-prefix branch only ever sees prefixes of an active fact.
- Nothing the spec calls valid is refused BY ROUND 32 (all changed clauses above). Two pre-existing refusals of genuine records under
  authentic later histories found (D-R32C-1, not reachable from the Today/gym UI); state-only claims judged inconsistently (D-R32C-2).

## Q2 THE ROUND-31 ITEMS (reviewer inputs and mutants re-applied on the object; whole FC12 431 with walks and fuzz at defaults)
- Claude B-R31C-1 (added set 4, 6 then 7 reps, claimed skipped/removed, current null): R32-BR31C1 (a) is that input; the revert of the
  S4 line to round 31's state-based expression (RB1) is RED on R32-BR31C1 and R32-FUZZ (429/431). Astra L22-B2 (5->4->3, removed) = (b).
- Claude B-R31C-2 (missed-debut wrappers reversed, R1 != R2): R32-BR31C2 is the input; RB2 (the anchor compares by bytes) RED 430/431.
- Claude B-R31C-3: K03 RED (R32-BR31C3-C1-VALUE-HALF), K05 and K06 RED (R32-BR31C3-REPLAY..., R32-FUZZ).
- Astra L22-B1: RB1a (FC03 same by bytes) RED on R31-WRAPPER, R32-L22B1, -BR31C2, -L22B6, R32-FUZZ; RB1b (FC01) RED on 4 rows; L22-B3:
  RB3 (negZero := false) RED on R32-L22B3, R32-FUZZ; L22-B4: FM15s (sets clause removed) RED on R31-FUZZ, R32-L22B4, R32-FUZZ;
  L22-B5 M07 = K05 RED; L22-B6 M12 = K16 successor RED (R32-L22B1, -L22B6, FUZZ); L22-B7 M13 = AM13 RED (R32-L22B7, FUZZ).
- Fable D-R31F-1 (sites) = the RB1a/RB1b/O15-O26 set; D-R31F-2 (M05/M06/M17): K14, FM06, K13 RED on R32-DR31F2.
- All reviewer mutants (43 re-anchored where a clause was rewritten; literal where the anchor survives): KILLED 39, LIVE 4 = K08
  (faithfulness gate, carried D-R31C-3), K10 (carried D-R30C-5, unreachable), K15 and FM11 (EQUIVALENT, proofs in the table).
  FA03 reviewer mutants (Fable N15, RC-16, RC-17, RC-21, RC-22 via NLR_ESMOVERLAY): each 102/103, red on exactly its R31 cell.

## Q3 SPEC FIDELITY OF THE NEW ROWS
- Each R32 row asserts the clause's outcome on invented inputs, R1 and R2, with nothing-applied / other-lift-unchanged tails:
  semantic equality = the genuine fold (:61); -0 = RECORD_INVALID with the owning clause's field (:61, :155 "field = the failing
  field"; the 'payload' owner for Basis members no S clause names follows the round-30 ruling); counts per DECISIONS:863 (3) (-1, 0.5,
  '1', true refused although (c2)'s max(1, sets) alone would read them as one set: that is the ruling's reading, builder D-R32-3);
  S4 from the authentic fact; (c1) value half; replay semantics taken from edit-history.cjs. None pins mere head output.
- R32-FUZZ: its history part builds each fixture's authentic current FROM the real reader normalizeWorkoutHistory (edit-history.cjs,
  loaded read-only, guard clean) and requires the genuine record to apply and three forgeries to refuse evidence, so replayEdits is
  checked against an independent oracle. My shard seeds 32100001..32102400 (2400 runs): 2400/2400 pass, 0 counterexamples, 15
  histories not admitted by the reader (skipped and counted), guard clean (out\fz-shard1). Gaps (D-R32C-3): the generator never
  removes the set itself or undoes a removal, and "owner candidate" was drawn once in 2400 (O04 is killed only by the default seed).
- Row R32-L22B1's "two bodies of one spend -> one decision" is :61 applied to the coalescing rule (:121); agreed.

## Q4 MY MUTANTS (27 single-clause, whole FC12 431 with walks and fuzz at defaults; out\O*.txt)
| id | clause (before -> after) | FC12 | killing rows / class |
|---|---|---|---|
| O01 | negZero(body.evidence) dropped | 430 | R32-L22B3 |
| O02 | negZero(bs.source) dropped | 429 | R32-L22B3, R32-FUZZ |
| O03 | negZero(bs.order) dropped | 430 | R32-FUZZ only |
| O04 | negZero(candidate) dropped | 430 | R32-FUZZ only (default seed) |
| O05 | negZero(target_load) dropped | 430 | R32-FUZZ only |
| O06 | payload negZero group -> false | 430 | R32-L22B3 |
| O07 | negZero(load_basis) dropped | 430 | R32-FUZZ only |
| O08 | negZero(base_load) dropped | 429 | R32-L22B3, FUZZ |
| O09 | negZero(coverage) dropped | 430 | R32-L22B3 |
| O10 | negZero no object recursion | 429 | R32-L22B3, FUZZ |
| O11 | negZero no array recursion | 429 | R32-L22B3, FUZZ |
| O12 | sets: negative admitted | 429 | R32-L22B4, FUZZ |
| O13 | sets: finite non-integer admitted | 429 | R32-L22B4, FUZZ |
| O14 | sets: null refused | 429 | R32-L22B4, FUZZ |
| O15 | S4 zero-edit current by bytes | 430 | R32-L22B1 |
| O16 | S4 all-edits current by bytes | 428 | R32-L22B1, -BR31C2, FUZZ |
| O17 | S4 proper-prefix current by bytes | 430 | R32-L22B1 |
| O18 | coalescing (:742) by bytes | 430 | R32-L22B1 |
| O19 | representative ops filter by bytes | 430 | R32-L22B1 |
| O20 | S7 source (other kinds) by bytes | 428 | R32-L22B1, -BR31C2, FUZZ |
| O21 | S7 source (compensation) by bytes | 428 | R32-L22B1, -L22B6, FUZZ |
| O22 | FC01 (c2) base compare by bytes | 427 | R32-L22B1, -BR31C2, -L22B6, FUZZ |
| O23 | FC01 retireShaped by bytes | 429 | R32-L22B1, FUZZ |
| O24 | FC01 compensate() restore by bytes | 430 | R32-FUZZ only |
| O25 | FC01 RESTORE compare by bytes | 429 | R32-L22B1, FUZZ |
| O26 | missed-debut vector by bytes | 430 | R32-BR31C2 |
| O27 | strict-JSON check (:346) by bytes | 431 LIVE | EQUIVALENT on JSON data (below) |
KILLED 26, LIVE 1 (equivalent). No LIVE mutant with an observable specified difference on a reachable input.
Equivalence proofs: O27: both forms compare the record with its own JSON copy; for any value built from JSON or a structured clone
of JSON data (undefined members, NaN, holes and -0 print identically on both sides) both pass; they differ only for toJSON-bearing or
boxed objects (a Date), which no op-log record carries; the head is the stricter (= builder D-R32-4, P48). K15: movedBase's sameImage
compares img() {present,value} with a recorded FieldImage that recordShape already required to be exactly {present,value}
(isWrapper), so canonical same(a,b) <=> map(b) && presence === && same(value). FM11: a group with any excluded op is deleted before the
event pass (:764), so a Contained error always names a non-excluded id and the removed guard never fires.

## Q5 ANYTHING NEW (probes, print-only rows appended in memory; out\p1-probe, p2-probe, p4-probe)
- P1 (fixture C1 tops, C2 at 95, genuine adopt-observed 95 via checkNativeLoad + issuanceFor): after the yes, set 1 removed -> w 95,
  BASIS_REPAIR_REQUIRED (correct); set 1 removed AND a new set logged into that slot -> RECORD_INVALID evidence, w 100, spent 0, R1 and
  R2. P2: an added set 4 removed before the yes (evidence: original null, edits [], current null), the removal undone after it (a
  tombstone of the tombstone; the real reader admits it: active again after 2 edits, p4) -> RECORD_INVALID evidence, w 100, spent 0.
- P3 state-only claims (current kept, only `state` changed): added set 4 claimed skipped/removed/unresolved, at a proper prefix or
  with no later edit -> APPLIED w 95 plus BASIS_REPAIR_REQUIRED (evidenceChanged sees the state); ORIGINAL set 1 claimed skipped ->
  RECORD_INVALID target_load, because S8's actual loads (FC03:565) read the RECORD'S claimed state, not the S4-bound current.

## NAMED DEBTS
- D-R32C-1 (pre-existing, not a round-32 hunk; spec ruling owed): FC03:519 prefers slot.fact over the removed fact the record names,
  and FC01 evidenceOf records a removed slot as original null, so a genuine record is refused RECORD_INVALID (consent lost) when the
  consumed slot is re-logged after a removal, or a removal is undone, after the yes (P1, P2). :155 D-R9-1 ("a correction or removal
  after the yes remains BASIS_REPAIR_REQUIRED ... never RECORD_INVALID") and FC03's own comment at :515-516 point one way, S4's literal
  "original equal that authentic session's typed slot" the other. Not blocking: the Today/gym UI cannot produce either history
  (gym-model.mjs:502-516 logSet needs a resumable session; :526-534 undo removes a set op only); only a direct workout-command caller can.
- D-R32C-2 (spec-silent): S4 does not list `state` (:155), :109 defines it as the typed slot's; FC03 now judges a false state claim
  in two ways (S8 :565 refuses target_load for an original set; an added set applies with BASIS_REPAIR_REQUIRED). A PM word on whether
  evidence state is bound (and so refused 'evidence') would settle both; no genuine record is affected.
- D-R32C-3 (coverage): -0 at candidate, target_load, basis.order and load_basis, and O24's site, are pinned only by the seeded
  R32-FUZZ (default seed); the history generator never removes or restores the set itself (the AM10s class is held by R31-S4 only).
- D-R32C-4: carried unchanged: D-R31C-3 (K08), D-R30C-5 (K10), D-R31C-4, D-R31C-5 and U's S1-S4, builder D-R32-4 (strict JSON now
  stricter on non-plain objects), D-R32-3 (-1/0.5/'1'/true refused by ruling though max(1, sets) reads one), and the earlier carried list.

## MUTATION TABLE (summary; per-mutant TAPs out\<id>.txt)
Reviewer mutants re-applied (43): K01-K18 + K09b, Fable FM01/04/06/07/08/09/11/13/14/15s/18/19s, Astra AM01/02/05/06/09/10s/13, round-31
blocker reverts RB1/RB1a/RB1b/RB2/RB3: KILLED 39, LIVE 4 (K08 debt, K10 debt, K15 and FM11 equivalent). FA03 reviewer mutants: 5/5
KILLED. My mutants: 27, KILLED 26, LIVE 1 (O27 equivalent). Total whole-suite runs 81, all guard-clean.

## NOT VERIFIED
- The builder's kill tables (sections 7-8: P01-P50, rounds 24-31 re-runs) and hosted sweep r32; I re-ran only the reviewer and my own
  mutants. FA03 under FC01/FC03 mutants (FA03 folds genuine host records only; its baseline 103/103 and 5 UI mutants were run).
- Seeds outside the default range and my shard; R7/R8 walks only at defaults; whether any non-UI workout-command caller in the
  product can produce D-R32C-1's histories; the protected five (never read, loaded or run); browser/phone harnesses; 80-file set; CI.
- Nothing committed, staged or pushed; DECISIONS/STATUS untouched; no object file written; only this review written in the worktree.
