# REVIEW: NATIVE-LOAD build round 31 (engine tier), Fable l1

Reviewer: Claude Fable, commissioned by the Earned PM (DECISIONS:862); blind; engine tier
Object (measured sha256; worktree %TEMP%\earned-nlr HEAD bd7654a798592a7dae421b9d68fec850fb0993d1, uncommitted; git status --porcelain over rebuild, .github,
package.json: exactly the five M files plus untracked review files under rebuild/lanes/e/reviews, so every other product file equals its bd7654a blob):
- FC01 rebuild/engine/native-load.cjs d9d6b79ef9064db4df4a8453d174ff36e4f1b69853f99dafd5e8e4e07ff5cacf (682 lines; r30 -> r31 numstat 8/1)
- FC03 rebuild/m4/workout/native-load-effects.cjs 94c3a04c489dd303b9a0b9787c1a82180d72b7cc49a3f94650f84d590a225032 (1261; 77/12)
- FC12 rebuild/m4/spec/native-load-options.test.cjs be263f7f96cdf99d9c1eef7adf2d60c3858d4de044ea3e8da00b85e97d9d9e81 (7661 lines, 420 rows; 263/2)
- FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs eb3693000e8349c78c83ed8fb4deddc23901153bd12e24bb1fef4dad5849b752 (2394 lines, 103 cells; 168/0)
- report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md 0a7f6193edd3a321e3f5b70fbee250206c4eb308c1805c482512f4b22c187c82; R31U-REPORT.md 02161104bc19bde4df82838bf7eb0fa485371b5f6e453d31013d3ed07d255e1b
- spec R9.13 (cmd /c git show 7ef8291:...) eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb; the round-30 bytes for the r30 -> r31 diffs taken from
  %TEMP%\earned-astra-158 (measured 68a04bb6 / 33934b9c / 647dbe8e / 31e175ba, the round-30 object).
Method: spec B (:61, :101-:120, :127-:158, :172-:185) and DECISIONS:856-:862 read first; the r30 -> r31 diffs, FC01 :1-:190/:470-:530, FC03 :22-:30/:140-:160/:340-:560/:640-:1075,
E/performed.cjs, W/edit-history.cjs, W/edit-values.cjs, W/engine-history.cjs :60-:130, today-entry.mjs :240-:315/:684-:693 read; the three round-30 reads read; the two authors'
reports read LAST. Every run through node %TEMP%\pm-run.cjs shared, ONE slot at a time (p0, p1, p2, p3 sequential), guard.cjs + deps-loader.mjs (every TAP "GUARD
protected-in-cache: none; refused: none"), MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York; probes and mutants are IN-MEMORY overlays (r17c overlay.cjs / r24b esmoverlay.cjs,
"applied 1" in every TAP); scratch %TEMP%\review-nlb-r31-fable-scratch (out\ every TAP, probe\ pA/pB print-only appends, mut\ the overlay JSONs). Every fixture value is invented.
Head baseline (p0): FC12 420/420 (42 s, walks and both fuzzes at defaults), FA03 103/103.

VERDICT: ACCEPT WITH NAMED DEBTS (D-R31F-1..4); no blocker: nothing genuine refused, nothing invalid let through, every round-30 blocker repaired on its reviewer's input,
every reviewer mutant red on a spec-outcome row, 22 of my 27 mutants killed and the 5 live ones proved equivalent on reachable inputs.
REQUIRED CHANGE: no (D-R31F-1 needs a PM word, one clause if extended; D-R31F-2 is two or three cells)

## (1) PRODUCT (measured)
- sets (B-R30F-1 = B-R30C-1), FC01 derivable: `n = max(1, safe-integer sets || 1)` then `vector.length !== n -> bad('base_load')` BEFORE Array.from/planVector. Executed
  (pA PROBE31F-SETS, under NODE_OPTIONS --max-old-space-size=700 as the memory guard, heap limit 892 MB): sets 2147483647, 1e8, 1e7, 0, -1, 2.5, '3', null, 2^53 on the
  two-lift earn and adopt-observed, R1 and R2 -> RECORD_INVALID base_load [fx-resp-1] in 2-4 ms each (round 30: 1.1-1.5 s at 1e7, node dead at 2^31-1), nothing applied, w 100,
  fx-row's yes applied; the check on that log returns in 3-4 ms; sets 3 (genuine) applies; a vector shortened to 1 with sets 1 or 3 is base_load. (c2) already required the
  length, so no genuine record changes fate. AUDIT (mine, FC01/FC03 every Array.from / new Array / for-let / length:): the only record NUMBER that sized anything was
  sets (FC01:492); every other size is the authentic capture's slot count (entryTarget/fit/fitVector/projectBase, cap.length), the admitted state's ex.sets, or a record
  ARRAY whose loop is bounded by the record's own bytes (evidence, edits, coverage, start_ids, newWSets, steps); prefix/hi/tenure_start/position/frontier are compared only.
- current typed (L21-B1): isCurrent = null | exactly {load,reps,reserve}, load isLoad, reps exactly {value,unit:'rep'} whole >= 0, reserve null | {tag} unknown/skipped/not_asked
  | exact 0-2 / at_least 3 with three keys. Checked against the producers: a genuine performed fact's load is enteredLoad (exact {value,unit:'lb'} > 0 or configuration),
  reps quantity 'rep' whole >= 0 (edit-values validValue, schema.cjs :66-:75), reserve absent (FC01 writes null) or edit-values reserve() exactly as isReserve; corrections
  patch only load/reps/reserve, clear only reserve; schema1 sets never become performed slots (LEGACY_CONTEXT_UNQUALIFIED -> unresolved). Nothing genuine is refused
  (420/420, 103/103 through respond()); isLoad admits value 0 and negatives that enteredLoad does not, but S4 then refuses them against the fact (superset, no over-refusal).
- S4 proper prefix (L21-B2): replayEdits is the typed fold's rule (corrections patch in rank order, clear:true deletes, tombstones remove, an edited edit acts as edited,
  a removed edit not at all), applied only when replaying ALL edits reproduces the authentic current (else the round-30 behaviour). Executed on an edit-of-edit history
  (correction a: reps 9; correction c of a: replacement_fields {replacement_fields:{reps:8}}; record issued after a): genuine applies (w 95, BASIS_REPAIR_REQUIRED, R1 and
  R2); forged current reps 8 (the value after both edits) and reps 10 (the original) -> RECORD_INVALID evidence (pA PROBE31F-REPLAY-EDIT-OF-EDIT).
- Semantic compares (L21-B3): sameWrapper (c1), sameImage (movedBase), sameData (reproduction). Every wrapper flip applies as the genuine record (pA O18, pB Undo flips).
- CONTAINMENT (L21-B4/B6, D-R30C-2): Contained(op ids) thrown out of foldOnce, foldNativeLoad replays with the record refused before anything applies; the loop ends
  (rethrow when no new id). Measured (pA PROBE31F-CONTAIN-EQ): for the earn and the adopt-observed thrown at accept (R1, R2), the Undo of an applied adoption thrown at its
  accept (adoption stays w 95, Undo RECORD_INVALID payload), and the landing whose third effect read throws after close_ref: the whole fold (issues modulo field/reason,
  state byte-equal, spent, effects) EQUALS the fold with the same record made malformed, and fx-row's snapshot equals the fold without the record; no close_ref, no spend,
  no queue entry of the refused record survives. The adoption thrown while its genuine Undo follows: adoption payload, Undo RECORD_INVALID compensates, w 100 (held lift).
  No input mutates across passes (withFacts json-clones the base; ops are read; spent/issues/effects/held/repair are per pass).
- PRODUCER_REVISION: recomputed independently from the 14 engine files (rev.cjs, R2-REVISION's recipe) = 980b80cdf0a480342a8df0c5b7ba6d4323ee04b70b4ba3d03b18f7881c066607 =
  the constant. Consequence as :155 (51730efc records become absent-revision, applied after S1-S8/DERIVABLE with ABSENT_APPLIED; mechanical per :859).
- Strings: the r30 -> r31 diffs add comments, code and the internal Error message 'NATIVE_LOAD_CONTAINED' (caught inside foldNativeLoad); no template, reason, copy or
  displayed string changed; today-entry.mjs unchanged.
- D-R31-1 ANSWERED (pA PROBE31F-ORDER, 21 re-orderings x earn/adopt x two-lift/one-lift x R1/R2 = 336 folds, all agreeing per case; pB on the Undo): member order still
  decides at exactly three sites, each refusing a record whose data equals the genuine one: (i) a Load in base_load (scalar or vector item written {unit,value}) ->
  RECORD_INVALID base_load, every kind, R1 and R2 (FC01 derivable (c2) same()); (ii) a Load in a compensation's target_load -> RECORD_INVALID target_load (FC01 RESTORE/RETIRE
  compare; the earn's and adoption's target_load flips APPLY); (iii) evidence current, or its load or reps, re-ordered -> RECORD_INVALID evidence (FC03 S4 same(set.current,
  cur(f))). Every other re-ordering applies exactly as the genuine record: body, basis, plan, load_basis, base_load container, evidence item, set item, candidate, Refs
  (start, original), coverage entries, wrappers. Same class as L21-B3 (hand-built, re-digested; the host writes one order; no genuine record refused). D-R31F-1 below.

## (2) THE ROUND-30 ITEMS (each reviewer's own input or mutant on the R31 bytes)
- B-R30F-1 = B-R30C-1: above (2-4 ms, RECORD_INVALID base_load, node alive under the guard); M01 (the length line removed) is red on R31-SETS and R31-FUZZ.
- B-R30C-2: RC-21 (Claude's overlay) 102/103, red R31-BR30C2-DOM-NOT-NOW-DISMISSES. B-R30C-3: RC-01 418/420 (R31-CURRENT-TYPED-LEAVES, R31-TARGET-LOAD-UNIT), RC-07 419/420
  (R31-EDIT-REF-WITHOUT-COMMITMENT). Fable V02 / D-R30F-6: paid by R31-TARGET-LOAD-UNIT (the kg target at the right value, field target_load, R1 = R2).
- L21-B1: the bound proper-prefix history with reps -1, {tag:'absent'}, exact 3 (pB) and the row's kg/null/9.5/{}/exact 5 -> RECORD_INVALID evidence, w 100, not spent.
- L21-B2: M08 (forward replay), M09 (reverse correction rank), M10 (upTo over all edits), M18 (prefix length > 1), M19 (field consumes) each red on R31-S4-PROPER-PREFIX.
- L21-B3: O18 applies; M03 (canon unsorted) and M16 (reproduction back to same()) red on R31-WRAPPER-MEMBER-ORDER. L21-B4: above; M12/M13/M14 red on three rows.
- L21-B5: N02 (Astra's overlay) 417/420, red R31-REF-COMMITMENT-IN-AUTHORITY-REFS, R31-EDIT-REF-WITHOUT-COMMITMENT, R31-FUZZ. L21-B6: N07/N08's anchor no longer exists
  (the catch is rewritten); successor M14 (the catch disputes in place with no restore, the round-30 shape without its undo) 417/420, red R30-CONTAINMENT and both R31
  containment rows. L21-B7: N15 (Astra's overlay) 102/103, red R31-L21B7-DOM-YES-REFRESHES-TODAY. D-R30C-4 inputs: RC-16 and RC-17 102/103 each, red on their R31 cells;
  RC-22 102/103, red R31-RC22-DOM-SEPARATE-ADOPTION-LABEL. D-R30C-2: R30-CONTAINMENT's landing assertion now pins nothing applied ([] not [[false,'DEBUT',105]]).
- Debts: D-R30F-6 and D-R30F-7 (partial undo) PAID; D-R30F-4 sets paid, the rest carried; D-R30F-1/2/3/5/8, D-R30C-1/3/5/6 carried unchanged.

## (3) SPEC FIDELITY (every new or corrected row and cell read against its clause)
- FC12 R31-*: each asserts the spec's outcome (code, field, refs, nothing applied incl. spend and effect, the other lift's snapshot equal to the fold without the record,
  R1 and R2, one- and two-lift where the fixture allows) and carries a genuine control that must stay applied; R31-SETS asserts the allocation bound (test-only Array.from
  wrapper) plus (c2)'s outcome; R31-S4 includes the removal/un-removal history; the R30-CONTAINMENT correction is to :155's state, authorized by :861 (5), not a weakening.
- R31-FUZZ: a faithful extension (counts incl. 2147483647/1e308/2.5, typed leaves, complete Refs with a bad commitment, the right value in kg, baseline/RESTORE/exit (a)
  records, the bound); its spec-silent list (prefix, hi, tenure_start, order.frontier) matches D-R30F-4/D-R30C-3. Limit: it asserts RECORD_INVALID for the record, not
  which clause refused, so validator-vs-S4 redundancy is invisible to it (D-R31F-2).
- FA03 R31-*: real installation, real panel, real clicks, durable ops read back; each asserts its clause (:101 dismissal with 0 ops; :174 Today model 45 = host 45 plus the
  repaint request and the saved line; :149/:324 the rendered stale line; :153/:174 the landing reconciles Today with no explicit refresh; :97 a yes on a closed page writes
  nothing; :352 a separate adoption heading without pinning unapproved text; :356 route B only for the Close's lifts, the button recovers the rest). Builder U's EQUIVALENT
  proofs E1-E4 checked against today-entry.mjs :240-:315 and :684-:693 (click handlers discard api results; region/doc set together in mount; teardown wraps close in
  try/catch): sound; E3's gym-model caller read from the report only. SPEC-SILENT S1-S4: agreed (a double tap's unhandled rejection under TE004 is worse behaviour but no
  clause names it; card lifetime after a yes and the non-stale refusal copy are unspecified); they belong on the post-S11 list with D-R30F-5/D-R30C-4.

## (4) MUTATION TABLE (27 single-clause mutants in memory: 22 mine, 5 reviewer re-applications; whole FC12 420 with walks and both fuzzes at defaults, or whole FA03 103)
| id | file: clause (before -> after) | result | classification |
|---|---|---|---|
| M01 | FC01 derivable: drop `vector.length !== n` | 418/420 | KILLED R31-SETS, R31-FUZZ |
| M02 | FC01 sameWrapper: drop `a.present === b.present` | 418/420 | KILLED R13-DECODE, R28A-08 |
| M15 | FC01 n: `Number.isSafeInteger(sets)` -> `typeof sets === 'number'` | 420/420 LIVE | EQUIVALENT by field: 2.5/1e308/-1/2^53 give a length mismatch either way, RECORD_INVALID base_load both (pA sets table, fuzz counts) |
| M03 | FC03 canon: keys unsorted | 419/420 | KILLED R31-WRAPPER-MEMBER-ORDER |
| M16 | FC03 reproduction: sameData -> same | 419/420 | KILLED R31-WRAPPER-MEMBER-ORDER |
| M04 | FC03 sameImage: drop present compare | 418/420 | KILLED R12-DECODE, R27-MOVED-WSETS-CONFLICT |
| M05 | FC03 isReps: drop `x.value >= 0` | 420/420 LIVE | EQUIVALENT on bound histories (S4 refuses reps -1 against the fact, pB); differs only on the unbound fixture history (applied w 95). D-R31F-2 |
| M06 | FC03 isReserve: admit tag 'absent' | 420/420 LIVE | EQUIVALENT on bound histories (pB: S4 refuses); unbound: applied. D-R31F-2 |
| M17 | FC03 isReserve: exact 0-2 -> 0-3 | 420/420 LIVE | EQUIVALENT on bound histories (pB); unbound: applied. D-R31F-2 |
| M07 | FC03 isCurrent: reserve unchecked | 419/420 | KILLED R31-CURRENT-TYPED-LEAVES |
| M08 | FC03 replayEdits: forward iteration | 419/420 | KILLED R31-S4-PROPER-PREFIX (the un-removal case) |
| M09 | FC03 replayEdits: correction rank reversed | 419/420 | KILLED R31-S4-PROPER-PREFIX |
| M10 | FC03 S4: upTo replays all edits | 418/420 | KILLED R31-CURRENT-TYPED-LEAVES, R31-S4-PROPER-PREFIX |
| M18 | FC03 S4: prefix bind only when edits > 1 | 419/420 | KILLED R31-S4-PROPER-PREFIX |
| M19 | FC03 S4: prefix mismatch named consumes | 419/420 | KILLED R31-S4-PROPER-PREFIX |
| M11 | FC03 foldNativeLoad: drop the `every(excluded)` rethrow guard | 420/420 LIVE | EQUIVALENT: an excluded group is deleted before events, so a Contained never repeats an id; the guard is termination insurance |
| M12 | FC03 pre-pass: refused group kept in groups | 417/420 | KILLED R30-CONTAINMENT, R31-CONTAINMENT-NOTHING-APPLIED, -LATE-READ-UNDONE |
| M13 | FC03 pre-pass: no RECORD_INVALID dispute | 417/420 | KILLED the same three |
| M14 | FC03 catch: dispute in place, no Contained (N07+N08 successor) | 417/420 | KILLED the same three |
| N02 | FC03 isRef: drop text(commitment) (Astra) | 417/420 | KILLED R31-REF-COMMITMENT, R31-EDIT-REF, R31-FUZZ |
| RC-01 | FC03 isLoad: drop unit 'lb' (Claude) | 418/420 | KILLED R31-CURRENT-TYPED-LEAVES, R31-TARGET-LOAD-UNIT |
| RC-07 | FC03 edits every(isRef) -> every(map) (Claude) | 419/420 | KILLED R31-EDIT-REF-WITHOUT-COMMITMENT |
| RC-21 | today-entry Not now keeps the view (Claude) | 102/103 | KILLED R31-BR30C2-DOM-NOT-NOW-DISMISSES |
| N15 | today-entry onSaved disabled (Astra) | 102/103 | KILLED R31-L21B7-DOM-YES-REFRESHES-TODAY |
| RC-16 / RC-17 / RC-22 | today-entry route B lift filter / Undo listing / adoption heading (Claude) | 102/103 each | KILLED R31-RC16, R31-RC17, R31-RC22 |
Kill sources: R31 rows 19 of 22 kills (R31-S4 6, containment rows 3, R31-CURRENT 3, R31-WRAPPER 2, R31-SETS/FUZZ/REF/EDIT/TARGET), older rows 2 (M02, M04), FA03 R31 cells 5.

## (5) NAMED DEBTS, NEW, NOT VERIFIED
- D-R31F-1 (= builder D-R31-1, measured): member order decides at three sites (base_load Loads, a compensation's target_load Loads, evidence current) and nowhere else; a
  record equal in data is refused RECORD_INVALID base_load / target_load / evidence, R1 and R2. Same class as L21-B3 and the :61 sentence the round cited; not reachable
  from the host (one write order) and outside :861's named (c1) scope, so a debt, not a blocker. Closure is one clause: canonicalize the body once after the digest check
  in structural() (canon already exists) so every downstream same() is order-free, or sameData at the three sites; or a PM word that array order and Load/current member
  order are data. Row first either way.
- D-R31F-2: the validator's own reps >= 0, reserve tag set and exact 0-2 bounds are exercised only through S4 (M05/M06/M17 live); R31-CURRENT-TYPED-LEAVES's unbound half
  drives kg/null/9.5/{}/exact 5 but not reps -1, {tag:'absent'} or exact 3. Three more cases in that row close it. Reachable only on a history the typed fold cannot bind,
  which no fold-produced history is (edit-history.cjs blocks the root, no performed fact remains): equivalent on reachable inputs.
- D-R31F-3 (observation, pre-existing, spec-silent): basis.order.start_ids REVERSED applies with no issue under R2 and under R1 in the two-lift fixture (S6 checks
  membership, not order; :120 "verified workout order"); the one-lift R1 half refuses issuance. For the post-S11 spec list beside D-R30F-4.
- D-R31F-4: builder U's SPEC-SILENT S1-S4 and D-L21-N14/RC-19 (double tap, sibling cards after a yes, the non-stale refusal copy): agreed spec-silent; PM list.
- New: the replay makes a contained record cost one extra full fold pass (bounded by the record count; 6-19 ms in the fixtures); no other new finding.
- NOT VERIFIED: the hosted sweep (r30 and r31 runs) and the builders' kill tables and TAP hashes (read as data); the 2 x 10000 R31-FUZZ shards (the default 1000 R30 and
  1000 R31 seeds ran in each of 27 whole-FC12 runs, no counterexample); builder U's 56 TE mutants beyond the 5 reviewer overlays re-run here; E3's gym-model caller
  (read from U's report); D-R31F-1's MISSED-DEBUT claim compares (the builder names them; not measured here, no missed-debut fixture built); holes/-0 (D-R30F-8) and
  D-R30F-1's host reachability; the protected five (never read, loaded or run).
- Nothing committed, staged or pushed; DECISIONS/STATUS untouched; no object file written; no protected-five, src/, ledger, private, soak, EarnedPort or prepledger-dev
  path read, listed, loaded or run; one shared slot at a time (p0, p1, p2, p3 sequential; p2 held slot 2 because another shared job held slot 1); nothing written in
  nlr-r31-scratch or nlr-r31u-scratch; the other R31 review file was not opened.
