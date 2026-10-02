# REVIEW: NATIVE-LOAD build rounds 27, 28, 29b (S11 T1 candidate)

Reviewer: Claude Fable, commissioned by the Claude Opus 5.5 PM (DECISIONS:855); blind; engine tier
Worktree %TEMP%\earned-nlr, HEAD bd7654a798592a7dae421b9d68fec850fb0993d1; git status --porcelain: exactly the four named files modified (plus untracked earlier review files under reviews/).
FC03 rebuild/m4/workout/native-load-effects.cjs b7d90a15337865f161780ce6d114e63b29db1e22c87fa9cf35cd06873411fac2 (verified; 7 hunks vs bd7654a, numstat 11/3)
FC12 rebuild/m4/spec/native-load-options.test.cjs 19c1f073e48ab62cc294676d9dfde6bc50ef12e8d24b4367d43744dbb4706641 (393 tests)
FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs 6954e210515059684215f2bae15677717cb6b5f1c1796a5ef67b8a46819190f0 (88)
Report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md b56680fcd9eff3338c5b45a0bfa254f4a2a361a39bd0bcd935a0b370c484c30d
Spec R9.13 = git show 7ef8291:rebuild/coach/NATIVE-LOAD-SPEC.md, sha256 eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb (extracted with cmd /c, byte-exact).
Scratch %TEMP%\review-nlr-r29-fable-scratch (out\ every TAP; probe\ the in-memory probe rows; mut\ the 16 overlay JSONs). Every fixture number is invented.
Method: static read of FC03 whole and FC01 :66-:84, :424-:494, of the new FC12/FA03 rows, of the triage and DECISIONS:846-:855; the author's round sections read LAST.
Every run through node %TEMP%\pm-run.cjs shared, one slot, guard.cjs + deps-loader.mjs preloads (every TAP: "GUARD protected-in-cache: none; refused: none"),
MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York. Probe rows and mutants are IN-MEMORY overlays (nlr-build\r17c\overlay.cjs); nothing in earned-nlr was written but this file.

VERDICT: REJECT (one product defect inside the round-29b clause, B-R29F-1; the round-29 rows leave the fixed clauses largely unpinned, B-R29F-2)

## Head measurements (round 29b bytes)
- fc12-head 393/393 exit 0; fa03-head 88/88 exit 0 (scratch out\fc12-head.txt, out\fa03-head.txt).
- Property walks, my seed range: R7-PROPERTY seeds 20290927..20291026 and 20291027..20291126 (2 x 100 runs, NATIVE_LOAD_PROPERTY_ALL=1) found []; R8-PROPERTY
  seeds 20290927..20290986 and 20290987..20291046 (2 x 60 runs) found []; reports out\w7a.json, w7b.json, w8a.json, w8b.json (R8 coverage 114/108 keys).

## Q1 PRODUCT
- Every product file except FC03 equals its bd7654a blob: git status --porcelain lists only FC03, FC12, FA03 and the report as modified (nothing else under rebuild/).
- No ISSUANCE hunk: the hunks sit in structural(), correspondence() S8, evidenceChanged(), dayOf() and the fold's reproducible gate; checkNativeLoad calls dayOf
  only with {evidence: []} (:1062), where the changed callback never runs; PRODUCER_REVISION (:1139) untouched. REVISION-MOVES not triggered.
- Valid records unchanged: genuine earn and adopt-observed records apply identically under R1 and R2 on one-lift and two-lift cuts (probe Q14/R04, R29-FIXTURE-CONTROL);
  every earlier genuine-record row green (393/393, 88/88); 400 property seeds green.
- Hunk by hunk (spec clause quoted; measured input -> output; every probe under R1 and R2 unless noted):
  H1 structural basis members. :117 "Basis is exactly {athlete_id,source,coverage,order,plan,technique,load_basis,effect_frontier}"; :119 "plan is {plan_basis,...};
     technique is the exact reset-fork/era basis ...; effect_frontier is the sorted previously folded semantic effect IDs and their response/close references";
     :112 "base_load {scalar,vector,fields}". Conforms for what it checks (extra key, plan/technique non-map, effect_frontier non-array or entry without spend_id,
     base_load or fields non-map -> RECORD_INVALID payload, both revisions, measured E18/E20/E21/E22/Q07/Q08/Q10). It does NOT require load_basis, coverage, order,
     source or athlete_id to be present; each absence is still refused by name elsewhere (E05-E12, E21: base_load / basis.coverage / basis.order / basis.source / payload),
     so "exactly" is enforced asymmetrically (D-R29F-2). Cannot throw: every read is guarded by map()/Array.isArray().
  H2 structural consumed-reference loop. :155 S4 "each evidence set item's slot, position, origin and original equal that authentic session's typed slot, its edits are a
     prefix of the slot's current edit Refs". Conforms for a null item, sets missing/null, a null set item (evidence, R1 and R2, one-lift and two-lift). NOT for a
     set whose edits is a non-iterable non-array: THROWS (B-R29F-1). Does not change valid records (edits [] and non-empty edits rows green).
  H3 correspondence S8. :119 "load_basis is {authority_refs,tenure_start,sets,prefix,hi,steps,inc,w,wSets}, preserving missing fields explicitly"; :155 "any other
     non-empty authority_refs on an adopt-observed refuses field base_load, and an adopt-observed with [] is anchored to the capture cells". Conforms: authority_refs
     null / 'x' / {} / absent on adopt-observed -> base_load, w stays 100 (R01-R03, R06, A02-A04); on an earn null -> base_load (E08, Q11); adopt-baseline left to
     REFS-ARM. Cannot throw (map() guard before the member read).
  H4 target clause. :112 "target_load {scalar:LoadOrNull,vector:[LoadOrNull]}". Conforms: target_load null/5/{} never throws; field decision under R2 (FC01 Decision
     check), target_load for adopt-observed with vector [] (A08). Under R1 on a REPRODUCIBLE cut the field is issuance (D-R29F-1). Cannot throw.
  H5 evidenceChanged. :155 ORIGINAL CUT "re-evaluated only when today's reconstruction reproduces its cut": a malformed item cannot be that cut, so changed -> not
     re-evaluated -> S4. Conforms; but no round-29 row exercises it (M13 LIVE, see Q3).
  H6 dayOf null item. Conforms; a null close on an item is still read through (item.close null -> undefined, no throw on the head; M15 shows no row pins it).
  H7 reproducible gate. :155 ORIGINAL CUT plus R9.13 N (i) REFS-ARM-EVERY-REVISION. The order clause conforms (order null/'x'/{}/absent -> basis.order, never a throw,
     Q06/Q16/E12/H01). The load_basis clause ("authority_refs must be an array, else not re-evaluated") is the builder's device to reach S8 under R1; the spec states
     that precondition only for REFS-ARM (adopt-baseline). Benign (a malformed member is refused either way) but not spec text: noted in Q2. Cannot throw.

## Q2 ROWS (rounds 27, 28, 29b)
- Spec fidelity: the R27/R28 FC12 rows cite the clause they pin and assert only its outcome; the R27/R28 FA03 host cells go through the genuine durable host. Rows that
  pin behaviour the spec does not state: R28C-GYM-DETACHED-HANDLE-REFUSES-A-WRITE and R28C-HOST-RECONCILE-MISMATCH-REFUSED pin the w6 host contract (today-bindings
  comments), by PM ruling DECISIONS:852 (1) - noted, not a defect; R29-H04-ADOPT-OBSERVED-NO-AUTHORITY-REFS pins base_load under R1 through the H7 load_basis
  clause (above); R29-H02-TARGET-LOAD-NULL claims "RECORD_INVALID decision ... under both revisions" - true only in its two-lift fixture (D-R29F-1).
- Early return / could pass for a wrong product: R28B-UNATTRIBUTED-REFUSAL-SHAPE (FC12 :7007) returns if the check does not refuse. Measured on these bytes: the fold
  disputes RECORD_INVALID lift_lineage_id lift null refs [fx-resp-1] and the check REFUSES {code NATIVE_LOAD_RECORD_INVALID, refs [fx-resp-1], field lift_lineage_id}
  (probe U00/U01), so the row is exercised today; it would pass silently if the product stopped refusing (D-R29F-7). No other early return, skip or todo in the new rows.
- The R29 two-lift fixture never reaches present-revision re-evaluation for fx-press (fx-row's yes at the same cut changes the queue digest, as the H02 title says),
  so under R1 the R29 rows exercise only the correspondence branch: H5 and the !changed conjunct of H7 are unpinned (M13 LIVE), and the H2 claim "R1 = R2" rests on
  that fixture (a one-lift R1 cut names issuance, Q12).
- IndexedDB seams (FA03 R28-HOST-LOST-ACK-ALREADY-SAVED, R28-HOST-INTERLEAVED-WRITE): both wrap the real store's transaction and engage only when the product assigns
  tx.oncomplete (fired === 1 asserted, green), so the product's own handlers run. Interleaved: the product's readonly completion is deferred until an external commit
  lands, and the product's revision guard between its two reads refuses STALE_OFFER - the real path, a realistic trigger (second tab). Lost ack: the readwrite put really
  commits and the product's onabort handler is invoked in place of oncomplete, so the product's recovery branch (read the log for the exact issuance, found and
  folded -> alreadySaved, no second response) runs for real; the manufactured precondition (an abort event after a committed put) cannot occur in IndexedDB - a real lost
  acknowledgement is a missing complete event, reached by a retry (pinned separately by R24S-HOST-SPENT-AND-RETRY). Verdict: both test the real product paths; the
  lost-ack seam pays D-R25C-2 for the branch, not for the trigger.

## BLOCKING
B-R29F-1 PRODUCT (hunk 2 stops one level short; same class as H-03, every revision, whole fold). Input: the genuine fx-press earn re-issued (re-digested, acceptOp)
  with evidence[1].sets[0].edits = 5, or = {} (a set item that IS a map, so the new guard passes), recorded under R1 and under R2, one-lift (F0, C1/C2 TOP e(2,1,1))
  and two-lift (r29two) alike. Output: foldNativeLoad THROWS "TypeError: (s.edits || []) is not iterable" at FC03 :349 (structural, the spread inside
  [item.start, item.close, ...item.sets.flatMap((s) => [s.original, ...(s.edits || [])])]); nothing refused by name, fx-row lost with it (probe E01/E02, Q13/Q15).
  Clause: :155 S4 "its edits are a prefix of the slot's current edit Refs" (field evidence), :175 "recognizes malformed native accepts and refuses
  NATIVE_LOAD_RECORD_INVALID rather than dropping them", :156 per lift. Reachable exactly as H-01..H-04 were (a hand-built record in the local log; the registrar
  folds without try/catch, today-bindings.mjs :526). Siblings that do NOT throw today: edits "ab" / [5] / original 5 / start 5 / close "str" -> RECORD_INVALID consumes.
  Required: red row first (both fixtures, R1 and R2, expected RECORD_INVALID evidence [fx-resp-1], never a throw), then the guard extended to each set's Ref shape
  (edits absent or an array, original null or a map) so S4 names the field; no other row changes.
B-R29F-2 ROWS. The six R29 rows pin only the deleted/null member shapes, and under R1 only the correspondence branch; ten of my sixteen mutants survive whole FC12
  (393/393 with the property walks on, 391/391 walks skipped), eight of them on specified, reachable behaviour (table below): M02, M03, M04, M08, M11, M12, M13, M15.
  Required red rows (each red on the mutant named, green on the head, both revisions): plan [] and technique [] (M02); effect_frontier 'x' and {} (M03); effect_frontier
  [{}] (M04); adopt-observed and earn with load_basis.authority_refs null, 'x', {} (M08, M11: under the mutants they APPLY silently under R1, w 95 / DEBUT 105);
  basis.order {} and start_ids null (M12: mutant THROWS at factsAtCut :90); a ONE-LIFT R1 variant of R29-H03 (M13: on a reproducible cut the malformed item takes
  re-evaluation and names target_load/issuance instead of evidence); an evidence item with close null (M15: mutant THROWS at dayOf :542).

## Q3 MUTATION TABLE (16 single-clause mutants of the round-29b bytes, in memory; FC12 whole, walks on unless noted; FA03 not run: its cells use genuine records only)
| id | hunk | clause (before -> after) | FC12 | classification (measured under the mutant) |
| M01 | H1 | key whitelist -> Object.keys(bs).length !== 8 | 393/393 LIVE | UNSPECIFIED: differs only in the field (Q10 base_load, Q16/Q17 payload); no row has one member missing plus one extra (D-R29F-9) |
| M02 | H1 | !map(bs.plan) || !map(bs.technique) -> !bs.plan || !bs.technique | LIVE | BLOCKING-2: plan [] APPLIES (R1 no issue; R2 ABSENT_APPLIED), head refuses payload |
| M03 | H1 | !Array.isArray(bs.effect_frontier) -> !bs.effect_frontier | LIVE | BLOCKING-2: effect_frontier 'x' THROWS "every is not a function" (:343) |
| M04 | H1 | every((f) => map(f) && text(f.spend_id)) -> every((f) => map(f)) | LIVE | BLOCKING-2: effect_frontier [{}] applies under R2 (issuance under R1) |
| M05 | H1 | drop the base_load.fields map check | KILLED | by R29-H04-BASIS-MEMBERS (no base_load.fields) |
| M06 | H2 | !item.sets.every(map) -> item.sets.some((s) => s === null) | LIVE | field only: set item 5 -> consumes instead of evidence (D-R29F-4) |
| M07 | H2 | continue -> return 'decision shape' | KILLED | by R29-H03-EVIDENCE-ITEM-MALFORMED (evidence expected) |
| M08 | H3 | !Array.isArray(authority_refs) -> authority_refs === undefined | LIVE | BLOCKING-2: null/'x'/{} on adopt-observed APPLY w 95 silently under R1 (ABSENT_APPLIED under R2); earn null -> DEBUT 105 |
| M09 | H3 | body.kind !== 'adopt-baseline' -> body.kind === 'earn' | KILLED | by R29-H04-ADOPT-OBSERVED-NO-AUTHORITY-REFS |
| M10 | H3 | the check moved below the earn actual/cap test (ordering) | LIVE | EQUIVALENT, proof: every return between the two sites is 'base_load' and the target_load return is after the new site; probe p2 0 lines differ |
| M11 | H7 | Array.isArray(authority_refs) -> authority_refs !== undefined (gate) | LIVE | BLOCKING-2: under R1 null/'x'/{} reach re-evaluation, FC01 echoes the basis, reproduced -> applied silently (Q11 DEBUT 105, R01-R03 w 95) |
| M12 | H7 | drop Array.isArray(b.basis.order.start_ids) from the gate | LIVE | BLOCKING-2: order {} THROWS at factsAtCut :90 under R1 |
| M13 | H5 | return true (malformed item) -> continue | LIVE | BLOCKING-2: one-lift R1 Q01/Q03/Q04 -> target_load, Q02 -> issuance (head: evidence); the R29 fixture never reaches this branch |
| M14 | H4 | map(body.target_load) && ... -> body.target_load && ... | LIVE | EQUIVALENT, proof: a truthy non-map (primitive or array) has vector undefined, so both arms take []; probe p2 0 lines differ |
| M15 | H6 | item && item.close && item.close.op_id -> item ? item.close.op_id : null | LIVE | BLOCKING-2: evidence item close null THROWS at dayOf :542, both revisions |
| M16 | H7 | !changed dropped from the gate (cross-function with evidenceChanged) | KILLED | by R11-FORGED-EVIDENCE-VALUE, R27S-P653-P467-P848-P862, R28B-REMOVAL-AFTER-YES |
Sweep gap covered: M02/M03/M08/M11/M12/M15 are predicate re-shapes, M10 an ordering move, M13 a return-to-continue, M16 cross-function: none is a NEG/GUARD/REL/ANDOR form.

## NAMED DEBTS (D-R29F-1..9; none blocks alone; each has a measured input in scratch out\p1-probe.txt or out\p2-head.txt)
D-R29F-1 H-02's field is fixture-dependent. One-lift cut, earn re-issued with target_load 5 (or null): R1 -> RECORD_INVALID issuance (the re-evaluation branch, "not
  reproduced"), R2 -> RECORD_INVALID decision (Q12); the R29-H02 title claims decision "under both revisions" because in r29two fx-row's yes makes fx-press not
  reproducible. Spec :156 says DERIVABLE runs "before any re-evaluation"; FC03 acts on the transition's refusal before re-evaluation only for UNDERIVABLE fields, and
  decision is not one. Same R1-only asymmetry the triage named for H-04. Recommend: a one-lift R1 row and either decision added to the pre-re-evaluation set or the
  row's claim narrowed.
D-R29F-2 Exactness is one level deep. Nested extras or missing members inside load_basis (extra key; tenure_start 7; tenure_start or hi deleted), order.extra,
  plan.extra, an evidence item's or set's extra key, base_load.fields.extra: the record APPLIES with no issue under R1 and as ABSENT_APPLIED under R2 (E23-E27, E29,
  E31-E33). :119 "preserving missing fields explicitly", :60 "no extras". No raise is possible (DERIVABLE binds w/wSets/inc/steps/sets; a larger inc is RESIDUAL (i)),
  so a PM ruling on the depth of "exactly" is owed rather than a fix; H1 also does not require load_basis/coverage/order/source/athlete_id present (each still refused
  by name elsewhere, Q1 H1).
D-R29F-3 basis.order.frontier is never verified: a forged frontier applies with NO issue under R1 (factsAtCut :90 carries the record's own frontier into the cut, so
  FC01's :195 comparison is against itself) and as ABSENT_APPLIED under R2 (E14, A07). S6 names start ids only; the start ids and coverage bind the facts, so no raise.
D-R29F-4 S4 sub-shape field naming: a malformed set-level Ref (original 5; edits "ab" or [5]; item.start 5; item.close "str") refuses field consumes (the structural
  'consumed reference absent' mapping) while S4 names evidence for the item-level shapes fixed in round 29b; M06 survives for the same reason. Pre-existing.
D-R29F-5 Pre-existing throw, not a round-29b hunk: foldNativeLoad with workoutFacts null or undefined over a log holding a GENUINE present-revision compensation
  (landingScenario yes plus its accepted Undo, R1 and R2 engines alike) THROWS "Cannot read properties of null (reading 'sessions')" at factsAtCut :89 via the
  reproducible gate's atCut (C02); the earn alone refuses RECORD_INVALID consumes (C01). Host reachability unproven (register() folds context.workoutFacts, :526;
  the check refuses COMPLETION_REQUIRED for null facts only after the fold). Recommend a facts guard at the gate (present && facts && ...), red row first.
D-R29F-6 PRODUCER_REVISION_ABSENT_APPLIED is raised before the transition refuses: under R2 a record refused decision carries both issues (E28, Q12 R2); r27issues
  filters it, so R29-H02 does not see it. Label only; pre-existing.
D-R29F-7 R28B-UNATTRIBUTED-REFUSAL-SHAPE's early return (Q2): exercised today, vacuous for a product that stops refusing; pin the refusal once D-R27-1/SS-08 is ruled.
D-R29F-8 H7's load_basis conjunct is a builder device the spec does not state (Q1 H7); harmless, but the spec's REFS-ARM-EVERY-REVISION rule should say whether a
  malformed non-adopt-baseline member excludes re-evaluation, so that D-R29F-1's asymmetry and this one are ruled together.
D-R29F-9 M01 survives: no row has one basis member missing plus one extra key (field would differ); low.

## Q5 OWED ITEMS
- From the report: the 80-file set and the w6 admission cells (STOP-R21B-1) are CI-only; the hosted sweep of these bytes runs separately (not repeated here).
- D-R26C-3 (cancel-as-answer) and D-R25C-5 (moment-only re-issuance) not paid by ruling; H-05 and D-R28A-1 named debts; H-06/H-07 on the post-S11 spec list; D-R27-1
  (SS-08) still open (D-R29F-7 depends on it).
- New from this read: B-R29F-1 fix and B-R29F-2 rows, then a re-read of the new bytes; PM rulings on D-R29F-2 (depth of exactness) and D-R29F-8.

## NOT VERIFIED
- FA03 under the mutants (its cells use genuine records only, so none of M01-M16 can be killed there); the hosted sweep's own results; the intermediate FC03
  (886df430...) the report discloses; host reachability of D-R29F-5; R28C rows' w6 contract lines (read as data, not re-measured); the report's kill-table TAP hashes.
- Nothing committed, staged or pushed; DECISIONS untouched; no protected-five file, src/, ledger, private, soak, EarnedPort or prepledger-dev path read, listed or run.
