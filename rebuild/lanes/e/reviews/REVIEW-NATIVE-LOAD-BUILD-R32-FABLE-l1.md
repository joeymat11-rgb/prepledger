# REVIEW: NATIVE-LOAD build round 32 (engine tier), Fable l1

Reviewer: Claude Fable, commissioned by the Earned PM (DECISIONS:864); blind; engine tier
Object (measured sha256; worktree %TEMP%\earned-nlr HEAD bd7654a798592a7dae421b9d68fec850fb0993d1, uncommitted; git status --short: exactly the five M files plus
untracked review files under rebuild/lanes/e/reviews, so every other tracked product file equals its bd7654a blob):
- FC01 rebuild/engine/native-load.cjs e589d0fc79e7f63e98d87fa48e25b6265ef9e44ec9877940f0266814e27d7f75 (676 lines; r31 d9d6b79e -> r32 numstat 9/2)
- FC03 rebuild/m4/workout/native-load-effects.cjs 698eb366ba43fac7a179eaf71711084b6db054974bcfba38210de0c2bd089a9e (1260; r31 94c3a04c -> r32 23/16)
- FC12 rebuild/m4/spec/native-load-options.test.cjs faa5ea4b5c4c062677ef7808b23505dbac194f4430f089ef6c67e85cb607c0ce (7978 lines, 431 rows)
- FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs eb3693000e8349c78c83ed8fb4deddc23901153bd12e24bb1fef4dad5849b752 (2349 lines, 103 cells; unchanged since r31)
- report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md 86a10b53f548de1f8f7511f159abe0ab145b3b7f80a6c2849e8595fe98790bc7; R31U-REPORT.md 02161104bc19bde4df82838bf7eb0fa485371b5f6e453d31013d3ed07d255e1b
- spec R9.13 (cmd /c git show 7ef8291:rebuild/coach/NATIVE-LOAD-SPEC.md > scratch\spec.md) eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb
Method: spec :61, :101-:120, :127-:158, :172-:185 and DECISIONS:856-:864 read first; the bd7654a diffs and the r31 -> r32 diffs (against earned-astra-159's round-31
bytes) of FC01/FC03, FC01 :1-:30/:410-:545, FC03 :1-:120/:230-:360/:365-:660/:700-:830, edit-values.cjs :24-:30, the 11 R32 rows and R32-FUZZ read; every
JSON.stringify / same / sha / Array.from / isSafeInteger / Math.max / for-let / .prefix / .hi / tenure_start / .position site of both files enumerated (grep*.ps1);
the three round-31 reads read; the authors' report read LAST. Every run via node %TEMP%\pm-run.cjs shared, ONE slot at a time (jobs fable-r32-p0, -p1, -p12, -p3,
sequential), runF.ps1 = pm9-joint31\run30.ps1 with only the scratch path changed (guard.cjs + deps-loader.mjs; every TAP "GUARD protected-in-cache: none; refused:
none"; every overlay "applied 1" in its child), TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03; probes and mutants are IN-MEMORY overlays (nlr-build\r17c\
overlay.cjs); probes are print-only rows appended to FC12 after the R32-FUZZ row. Scratch %TEMP%\review-nlb-r32-fable-scratch (out\ every TAP, probe\pA.js,
mut\*.json, mkmut.cjs, tally.cjs, diffprobe.cjs). Every fixture value is invented. Head baseline (p0): FC12 431/431 (53 s; walks and the three fuzz rows at
defaults), FA03 103/103 (36 s).

VERDICT: REJECT (blocker B-R32F-1, ROWS only; the product conforms; named debts D-R32F-1..4)
REQUIRED CHANGE: yes (two coverage cases or one generator line; no FC01/FC03 byte needs to change)

## BLOCKING
B-R32F-1 ROWS (spec :61 "no negative zero", :175; DECISIONS:863 (2)): two of the round's own negative-zero clauses are LIVE with an observable specified difference
  on a reachable (hand-built, re-digested) record, the same input class as L22-B3. Executed (probe pA, out\pA.txt vs out\pA-F12.txt / pA-F13.txt; earn and
  adopt-observed, R1 and R2, two-lift): the genuine record with basis.technique.z = -0, or technique.fork_refs = [-0] (a host-emitted member), or an extra
  effect_frontier item {spend_id:'x', n:-0} (Object.is(leaf,-0) asserted at the fold boundary) -> HEAD: RECORD_INVALID payload [fx-resp-1], w 100, not spent, fx-row's
  yes applied; F12 (recordShape without `negZero(bs.technique)`): APPLIED as genuine (DEBUT 105 queued / w 95, spent), no issue (R2: ABSENT_APPLIED only); F13
  (without `negZero(bs.effect_frontier)`): the frontier case APPLIED likewise. Whole FC12 431/431 under each (m-F12, m-F13): no row and no R32-FUZZ seed reaches
  either clause, because R32-FUZZ's zero part seeds -0 only into EXISTING numeric leaves of a genuine body (r32numLeaves) and technique/effect_frontier carry none.
  Owed: a -0 case for each of the two members in R32-L22B3 (or the zero part seeding a -0 into a fresh extra member of a random Basis container), red first under
  F12/F13. Product unchanged.

## (1) PRODUCT (measured)
- Member order (:61): each module has ONE data comparator `same` = JSON of the recursively member-sorted data (FC01:26-27, FC03:28-29). My own enumeration of every
  comparison site (grep2.ps1: 21 `same` sites in FC01, 33 in FC03; every JSON.stringify site) finds no other object comparison: the remaining JSON.stringify sites
  build spend ids / S4 op-id pairs from strings (FC03:476/:491/:496/:506, FC01:122/:124/:147/:389/:412), `sha()` digests the fold's OWN state against the record's
  recorded digest strings (FC03:330/:806/:812), the proposal digest (FC03:349) is the byte digest the spec allows, and the strict-JSON check (FC03:346) compares the
  record with its own JSON copy (unchanged in what it detects). Measured (PROBE32F-ENVELOPE): the accept payload's and the issuance's members reversed -> applied
  exactly as the genuine record, earn and adopt-observed, R1 and R2. The rows' body-level cases are green on the head and red under F01/F02/F08/F18/F19/F21/F22/F23.
- Negative zero (:61): recordShape (FC03:389-411) walks the record AS RECEIVED clause by clause; the envelope members are text-checked in structural() (:342-:343)
  and the Decision's scalar members by structural/validDecision, so a -0 can only sit in a walked member. No genuine record carries -0: FC01 evidenceOf json()s every
  leaf, basisOf json()s source and the images, issuanceFor JSON-normalizes, and edit-values.cjs :24/:30 refuse -0 reps and reserve at entry. Measured on records
  edited AFTER issuanceFor (Object.is asserted; 64 folds, out\pA.txt): technique extra member / fork_refs [-0] / effect_frontier extra item / plan.plan_basis ->
  RECORD_INVALID payload; order.frontier -> basis.order; coverage[0].disposition -> basis.coverage; source extra member -> basis.source; load_basis.hi / prefix / sets
  and fields.topAt.value -> base_load; evidence position -> evidence; candidate.newW -> candidate; target_load.scalar -> target_load; issuance.moment / revision /
  source -0 -> payload (never read as an absent revision); body.kind / compensates -> decision; lift_lineage_id / consumes[0] -> lift_lineage_id; spend_id ->
  payload; each with refs [fx-resp-1], nothing applied (w 100, not spent), fx-row's yes applied; earn and adopt-observed, R1 and R2. The +0 controls apply.
- Counts (:156 (c2)): FC01:492 admits load_basis.sets only as null/absent or a non-negative safe integer; n = max(1, sets || 1) and the vector length is checked
  BEFORE any allocation (:493-:496). My audit of every other record-supplied number: position compared by === only (FC03:520); reps/reserve typed exactly; prefix,
  hi, tenure_start read by neither file (grep3.ps1); order.frontier compared by !==; cutOf/frontier are array lengths (FC03:748, :787). Measured: sets 0 and null on
  the 3-slot fixture -> RECORD_INVALID base_load (max(1,0) = 1 != 3, as (c2) says), sets 3 applies (PROBE32F-STATE-CLAIM-AND-SETS S04-S06); R32-L22B4 pins the
  one-slot 0/null/1 applied and eight non-counts refused; F05 (null refused) is red there, so the typed null count is pinned against over-refusal.
- S4 (:155): FC03:540 compares the prefix's current with replayEdits over exactly the listed edits -> active ? value : null, the authentic fact; set.state is no
  longer read there (F27, the round-31 text restored, is red on R32-BR31C1 and R32-FUZZ). Observation D-R32F-1: set.state is compared nowhere in S4 (the spec's S4
  sentence lists slot, position, origin, original, edits, current; :109 says state is the typed slot's) and S8 reads the RECORD's state for `actual` (FC03:565), so a
  genuine record with one performed set relabelled skipped/removed/bogus and its current kept is refused RECORD_INVALID base_load (earn) / target_load
  (adopt-observed), R1 and R2 (S01-S03): refused, never applied, but by S8's field.
- Containment and the allocation bound: code unchanged since round 31; the R30/R31 containment rows and R31-SETS green on the head; F30 (the vector-length bound
  removed) red on R31-SETS and R31-FUZZ; no probe fold threw (128 folds).
- PRODUCER_REVISION: recomputed independently from the 14 engine files (rev.cjs, R2-REVISION's recipe): df0b960424b5f0c0a7b797cd198ddd4f1643f3e4ade9c9dd96a1a86613b40ee5
  = the constant (FC03:1265). Consequence as :155 (980b80cd records become absent-revision, applied after S1-S8/DERIVABLE with ABSENT_APPLIED; mechanical, :859).
- Strings: the r31 -> r32 hunks (fc03-r31-r32.diff, fc01-r31-r32.diff in the scratch) add the comparator, the negZero clauses, the S4 expected value, one FC01
  refusal line reusing existing code/field names, comments and the rebind; no template, reason, copy or displayed string changed; today-entry.mjs unchanged.
- Nothing genuine refused: every R32 row's genuine control (earn, adopt-observed, adopt-baseline, RESTORE, RETIRE, exit (a), the claimed miss, the one-slot lift,
  the generated histories the real reader admits) applies; FC12 431/431; FA03 103/103 through the real host.

## (2) THE ROUND-31 ITEMS (each reviewer's own input or mutant, re-applied on the R32 bytes; whole FC12 431)
- Fable D-R31F-1 (three order-sensitive sites): PAID; PROBE32F-ENVELOPE plus the R32-L22B1 cases; F01/F02 (FC01 canon unsorted / no array branch), F08 (FC03 canon
  no array branch), F18 (coalescing by bytes), F19 (missed-debut wrapper by bytes), F21 (has() by key order), F22/F23 (both reproduction sites by bytes) each red
  on R32-L22B1 / R32-BR31C2 / R32-L22B6 / R32-FUZZ. D-R31F-2: PAID by R32-DR31F2 (my M05 = AM03, M06 = FM06, M17 = AM04 red there). D-R31F-3/-4: carried.
- Claude B-R31C-1: PAID on Claude's own input (R32-BR31C1 (a)); F27 red on R32-BR31C1 and R32-FUZZ (state-claim forgeries). B-R31C-2: PAID on Claude's input
  (R32-BR31C2, six flips, R1 = R2); F19 red there. B-R31C-3: K03 red on R32-BR31C3-C1-VALUE-HALF; K05 and K06 red on R32-BR31C3-REPLAY and R32-FUZZ. K08 LIVE
  (431/431) = D-R31C-3, carried by the PM.
- Astra L22-B1: PAID (above). L22-B2 = B-R31C-1: R32-BR31C1 (b), Astra's 5 -> 4 -> 3 history. L22-B3: R32-L22B3 on Astra's fixture (reps -0 and reserve -0, written
  and parsed from text) plus my 20 further -0 sites; F28 (negZero -> false) and F10/F11/F16/F25 red there. L22-B4: R32-L22B4 on Astra's one-slot fixture; F03/F04
  red. L22-B5: M07 (= K05) red on R32-BR31C3-REPLAY (b). L22-B6: the M12 anchor (sameData) no longer exists; its successor F22 (compensation reproduction by
  bytes) red on R32-L22B1 and R32-L22B6. L22-B7: AM13 red on R32-L22B7 and R32-FUZZ. D-L22-TYPED-DOMAIN: AM01/AM03/AM04/AM05 red on R32-DR31F2.

## (3) SPEC FIDELITY of the new rows (each read against its clause)
- R32-L22B1: asserts the genuine record applies first (recordInvalid [], DEBUT 105 / w 95), then snapshot EQUALITY of the whole fold (state, queue, issues, spends,
  fx-row) for eleven reorderings, the coalescing case (ONE decision, both refs, no EFFECT_CONFLICT, :121), the Undo (cancelled_by), the fork item, the zero-edit and
  proper-prefix currents, and keeps the forged-150 refusal beside authentic {unit,value} Loads: :61's outcome, not the head's. R32-BR31C2: w 95 and snapshot equality
  under R1 AND R2. R32-BR31C1: RECORD_INVALID evidence [fx-resp-1], w 100, nothing spent, no BASIS_REPAIR (r31refused) and the genuine w 95 (:155 S4/S8).
  R32-L22B3: Object.is(-0) asserted at the fold boundary, refusal with the OWNING field (evidence, basis.source, base_load, basis.coverage; payload for a plan member
  is the head's D-R30C-1 precedent, spec-silent on the name) and the +0 twin applied. R32-L22B4: base_load for eight non-counts and snapshot equality for 1/0/null
  (max(1, sets) = 1). R32-BR31C3-*: the reviewers' histories with the genuine control and the forged current refused evidence. R32-L22B6: no issue, cancelled_by,
  COMPENSATED, R1 and R2. R32-L22B7: genuine applies, forged 4 refused, AND the real reader reads 10/4/3/2 (reachability answered in the row). R32-DR31F2: six
  unbound leaves refused evidence.
- R32-FUZZ: order part asserts snapshot AND both lifts' checks equal the genuine control; zero part asserts exactly one RECORD_INVALID with field = r32owner(path), an
  independent test-side clause map, nothing applied, fx-row and its check unchanged; history part takes the value after k edits from the REAL typed reader (r32read
  over synthetic ops; rejected histories skipped and counted) and requires the genuine record to apply and three forgeries (another prefix's value, reps + 1, a state
  claim) to be refused evidence: an oracle independent of replayEdits, which makes it a spec check; count part as R32-L22B4. Every class is asserted generated at
  the default 800 seeds. Limit: the zero part's leaf set (B-R32F-1).

## (4) MUTATION TABLE (40 single-clause overlays: 30 mine, 10 reviewer re-applications; whole FC12 431 with walks and the three fuzzes at defaults; out\m-*.txt)
| id | file: clause (before -> after) | result | classification |
|---|---|---|---|
| F01 / F02 | FC01 canon: keys unsorted / arrays not canonicalized | 427 | KILLED R32-L22B1, R32-BR31C2, R32-L22B6, R32-FUZZ |
| F08 | FC03 canon: arrays not canonicalized | 427 | KILLED the same four |
| F09 | FC03 canon: keys sorted in reverse | 431 LIVE | EQUIVALENT: both sides use the same total order; any deterministic order gives the same equality |
| F03 / F04 / F05 | FC01 count clause removed / `>= 0` -> `>= -1` / null refused | 428 / 429 / 429 | KILLED R32-L22B4, R32-FUZZ (+ R31-FUZZ for F03) |
| F06 | FC01 count: isSafeInteger -> isInteger | 431 LIVE | EQUIVALENT: an unsafe integer n > any array length fails the length check at :496 before any allocation, same code/field |
| F07 | FC01 sameWrapper -> same(a, b) | 431 LIVE | EQUIVALENT: both wrappers are exactly {present,value} (recordShape has(); the host builds them), so the predicates coincide |
| F30 | FC01 vector-length bound removed (round-31 fix reversed) | 429 | KILLED R31-SETS, R31-FUZZ |
| F10 / F11 / F28 | FC03 negZero: not into arrays / not into objects / always false | 429 / 429 / 429 | KILLED R32-L22B3, R32-FUZZ |
| F16 / F25 | -0 clause dropped: evidence / source | 430 / 429 | KILLED R32-L22B3 (+ R32-FUZZ for F25) |
| F14 / F15 / F24 / F26 | -0 clause dropped: load_basis / order / candidate / target_load | 430 each | KILLED R32-FUZZ only (F24/F26 by the field alone: the value refuses anyway) |
| F12 / F13 | -0 clause dropped: technique / effect_frontier | 431 LIVE | SPECIFIED, reachable: B-R32F-1 (probe: applied vs refused payload) |
| F17 | FC03 S4 prefix: expected value ignores upTo.active | 430 | KILLED R31-S4-PROPER-PREFIX (the removal history) |
| F27 | FC03 S4 prefix: the round-31 claimed-state text restored | 429 | KILLED R32-BR31C1, R32-FUZZ |
| F18 / F19 | FC03 coalescing / missed-debut wrapper by bytes | 430 / 430 | KILLED R32-L22B1 / R32-BR31C2 |
| F20 | FC03 sameIssued body by bytes | 431 LIVE | EQUIVALENT: the two digests beside it must both equal held.proposal_id with producer and reason equal, which already forces byte-equal bodies |
| F21 | FC03 has(): key sets compared in received order | 426 | KILLED R31-WRAPPER, R32-L22B1, R32-BR31C2, R32-L22B6, R32-FUZZ |
| F22 / F23 | FC03 reproduction by bytes: compensation (M12/K16 successor) / other kinds (K17 successor) | 428 / 428 | KILLED R32-L22B1+L22B6+FUZZ / R31-WRAPPER+BR31C2+FUZZ |
| F29 | FC03 isReps: isSafeInteger -> isInteger | 431 LIVE | EQUIVALENT on bound histories (S4 refuses 2^53 against the fact); differs only on the unbound fixture: D-R32F-3 |
| K03 (Claude) | FC01 sameWrapper drops the value half | 430 | KILLED R32-BR31C3-C1-VALUE-HALF |
| K05 = Astra M07, K06 (Claude) | replayEdits keeps {clear:true} / applies a removed correction | 429 / 429 | KILLED R32-BR31C3-REPLAY, R32-FUZZ |
| K08 (Claude) | faithfulness gate -> `if (all)` | 431 LIVE | carried D-R31C-3 (PM) |
| AM13 (Astra M13) | replayEdits ignores a correction of a correction | 429 | KILLED R32-L22B7, R32-FUZZ |
| AM01 / AM03 / AM04 / AM05 (Astra), FM06 (Fable M06) | reps unit / reps >= 0 / exact 3 / unknown extras / tag 'absent' | 430 each | KILLED R32-DR31F2 |
KILLED 32, LIVE 8: 4 equivalent by proof (F06, F07, F09, F20), 1 carried (K08), 1 debt (F29), 2 BLOCKING rows (F12, F13). Kill sources: R32 rows 25 of 32 kills, R32-FUZZ alone 4 (F14, F15, F24, F26), R31 rows 3 (F17, F30, and R31-WRAPPER co-kills).

## (5) NAMED DEBTS, NEW, NOT VERIFIED
- D-R32F-1: set.state is compared by no S4 clause (spec :155 S4 omits it; :109 defines it as the typed slot's); a relabelled state is refused only through S8's
  `actual` (field base_load / target_load), never applied (S01-S03 measured). Post-S11 spec list beside D-R30C-1 (which field owns it).
- D-R32F-2: order.frontier written +0 (a value mismatch with the authentic frontier) applies with no issue under R1 and R2 (Z13; the fold never compares it, only
  FC01's check path does): spec-silent, = D-R30F-4 / D-R30C-3 class, measured again.
- D-R32F-3: F29 (a reps count that is a whole number but not a safe integer on an unbound history): one more case in R32-DR31F2 (reps 2^53) closes it.
- D-R32F-4: the replay gate K08 (D-R31C-3), D-R30C-5 (contained group's alt refs), D-R31C-4, D-R31F-3/-4, D-R30F-1, D-L21-OPAQUE, D-L22-TE-*: carried unchanged.
- NOT VERIFIED: the builder's kill tables b/c/d/v/f/f2/rv/own/own32 and TAP hashes (read as data); the 10000-seed shards (every whole FC12 here ran the default
  800/1000/1000 seeds, 44 times, no counterexample); the hosted sweeps; FA03 under my mutants (FA03 folds genuine host records only; baseline 103/103 only); the
  C01 instrumentation; browser/phone harnesses; the 80-file set; the protected five (never read, loaded or run). Disclosure: my first probe run edited the offer
  before issuanceFor, which JSON-normalized the -0 to +0; it was rewritten to edit the durable record and assert Object.is (the reported numbers are from the
  rewritten run; the first run's TAPs were overwritten under the same tags).
- Nothing committed, staged or pushed; DECISIONS/STATUS untouched; no object file written; no protected-five, src/, ledger, private, soak, EarnedPort or
  prepledger-dev path read, listed, loaded or run; one shared slot at a time; nothing written in nlr-r32-scratch or any earlier scratch (read only); the Claude
  R32 review file in this directory was not opened.
