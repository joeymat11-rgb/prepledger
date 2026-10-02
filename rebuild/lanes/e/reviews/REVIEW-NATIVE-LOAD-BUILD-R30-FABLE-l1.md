# REVIEW: NATIVE-LOAD build round 30 (engine tier), Fable l1
Reviewer: Claude Fable, commissioned by the Earned PM (DECISIONS:860); blind; engine tier
Object (measured sha256, worktree %TEMP%\earned-nlr at bd7654a, uncommitted; git status: exactly the five M files, so every other product file equals its bd7654a blob):
- FC01 rebuild/engine/native-load.cjs 68a04bb6ac39268185181629f2f91cc516c8b9f82fdb3bc6bb5b081fb66fbc9f (numstat 4/0)
- FC03 rebuild/m4/workout/native-load-effects.cjs 33934b9cc5692c87344f67c12bdf121e75beb942e9b43dc4cb361d6323fca640 (64/2)
- FC12 rebuild/m4/spec/native-load-options.test.cjs 647dbe8e96962bd453b70c3a2ac268a8cb60094f702e83c491dda6d5169040ac (410 rows)
- FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs 31e175bab8c09d5f7ab5d6d576bc1224f41ff5d194657c04d802b9a193f3be5b (95 cells)
- report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md c972816ab3eb03e86c940e9d7a4cc6fd47c5e615c7651c6871325e7f8ea9bcab; R30U-REPORT.md 8f9a3284d9026cfab0ce6ebbba8d599725ff68860972ec65735a89deda32d8cf
- spec R9.13 7ef8291 eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb (621 lines); DECISIONS:856-:860 read; the three round-29 reads read; the authors' reports read LAST.
Method: static read of the two diffs, FC01 whole, FC03 :1-:130/:300-:1000, today-entry.mjs :149-:310, client respond, the R30 rows and cells; every run through node %TEMP%\pm-run.cjs shared, ONE slot,
guard.cjs + deps-loader.mjs (every TAP "GUARD protected-in-cache: none; refused: none"), MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York; probes and mutants are IN-MEMORY overlays
(r17c overlay.cjs, r24b esmoverlay.cjs); scratch %TEMP%\review-nlb-r30-fable-scratch (out\ every TAP, probe\ the print-only probes pA/pB/pC, mut\ the overlay JSONs). Every fixture value is invented.
Head baseline (p0): FC12 410/410 (29 s, walks and fuzz at defaults), FA03 95/95.

VERDICT: REJECT (one product blocker B-R30F-1, a one-clause fix plus a red row; everything else measured accept-worthy: named debts D-R30F-1..8)
REQUIRED CHANGE: yes (B-R30F-1: bound load_basis.sets in the validator or in DERIVABLE (c2), red row first, and give the fuzz a `sets` site; no other product change needed)

## BLOCKING
B-R30F-1 PRODUCT (FC03 validator depth / FC01 DERIVABLE (c2); the class DECISIONS:856 (1) (b) ruled: "no record may make the fold or check throw ... other lifts unaffected"). The ONE validator leaves
  load_basis.sets untyped ('any'; the fuzz never mutates it), and FC01 derivable (:484-:486) builds the c2 projection as Array.from({length: max(1, sets)}) twice plus JSON.stringify of it, so the
  record's own `sets` sizes an allocation. Executed input: fx-press's genuine two-lift earn re-issued (re-digested) with basis.load_basis.sets changed, fx-row's genuine yes beside it, R1 and R2:
  sets 1e6 -> RECORD_INVALID base_load in 94-106 ms; sets 1e7 -> the same in 1323-1458 ms (pA N20/N21, out\p1-probeA.txt); sets 3e7 -> the transition's RangeError is caught by FC01 and the record
  is misnamed NATIVE_LOAD_EVALUATION_FAILED (not RECORD_INVALID, not a hold), 2754 ms, heap 1616 MB (out\sets-3e7.txt); sets 2147483647 -> "FATAL ERROR: invalid table size Allocation failed -
  JavaScript heap out of memory", node exit 134 after 5.5 s (out\sets-2p31.txt): the whole process dies on EVERY projection (registrar, cold boot, check), containment cannot catch it, fx-row is lost
  with it. Spec: :175 (a malformed native accept is refused RECORD_INVALID, never dropped), :155 per lift, :185; the record is a single-member defect exactly like the fuzz's. Reachability is the
  same hand-built-local-record class as B-R29F-1 / L20-B2 (a sync or import copy is refused by the ADMISSION GATE :157; the spec's threat model excludes a direct store write, the PM's :856 ruling
  brought this class in). Required: one clause (sets null or a safe integer within the engine's set-count domain, else RECORD_INVALID base_load; or c2 refusing before allocating), a red row on
  sets 2147483647 with fx-row unaffected, and `sets` added to the fuzz schema with a large-integer bad value; nothing else.

## (1) PRODUCT
- FC01 hunk: 4 added lines, one refuse; no template, reason or copy string changed (the diff IS the byte-exact comparison; adoptReason/earnReason/compensation text and NATIVE_LOAD_PROPOSED_COPY untouched).
  Measured (pA H, out\p1-probeA.txt): w 'BW' with two complete sets at 45, host v1 and typed v2 -> refused {RECORD_INVALID, refs [], base_load}, no offer; w 'BW' at [45,40] -> VECTOR_ADOPTION_UNDEFINED
  [Close] (ordering kept, F06 killed); w 40 at 45 -> adopt-observed [45,45] (control); w null -> adopt-baseline branch untouched (kind test); an earn over a configuration w is unreachable (performedLoadMatches
  fails first, and a configuration-performed entry is refused by E.performedNumericEntry before step 3, R27S-K026; my w '' fixture refused PERFORMED_ENTRY_INVALID). So the hunk mints nothing c3 forbids and refuses exactly the adopt-observed over a non-numeric w. The
  refusal code is the builder's choice (the spec names none for this check; :185's Close-Ref rule is for evaluation refusals); the panel shows the generic "No new weight" copy for any refusal.
- FC03 validator (recordShape): NOTHING GENUINE REFUSED: 410/410 and 95/95 (every genuine earn/adopt/compensate record, the host cells through respond(); the client's payload is exactly
  {proposal_id,answer,issuance}, index.cjs:349-371); my 60 single-member defects (pA E01-E35, N01-N24, A01-A13) never throw and refuse by name with fx-row's yes applied. Depth: members, containers,
  Refs, Loads, wrappers as :101-:120 list them; left to other clauses (spec-silent by :856's depth ruling, applied with no issue under R1 / ABSENT_APPLIED under R2): order extras (E24), effect_frontier
  entry extras (N16), technique members (N01/N02), coverage disposition/source_member types (N03/N04), candidate t/gate/rule/state types (N07/N08), order.frontier (E14, D-R29F-3), load_basis
  tenure_start/prefix/hi/sets types (E31; sets is B-R30F-1). Over-refusal candidates checked: configuration Loads {kind,configuration_key} match FC01's loadOf; FieldImage keys = FC01 FIELDS;
  evidence set keys and current {load,reps,reserve} = FC01 evidenceOf; candidate keys = FC01's candidate; coverage entries = basisOf; order.start_ids = basisOf. Compensate records: consumes/evidence [] pass.
- Containment: `state` is only ever reassigned in the event loop (FC01 clones its input, exitB builds a new object), so `state = mark.state` is a true undo; issues/spent are truncated; repair/held
  cleaned. Partial work NOT undone: mutations of earlier objects (holdIssues[i].superseded_by, spent[x].close_ref/cancelled_by, effects entries) and a first q's landing when a SECOND q of the same
  lift throws in one Close event; none of these has a reachable input (see D-R30F-7 and the mutation table V10/V11). Measured with instrumentation (C01, markers on both catches, whole FC12 and
  FA03): 8 containment hits and 1 structural hit, ALL the R30-CONTAINMENT row's injected faults; zero from any other row, the 1000 default fuzz seeds or the 95 host cells. On these bytes no
  non-injected record reaches the catch (FC01's two entry points catch everything; every FC03 read of a validated member is guarded): the containment is a safety net, correctly shaped.
- PRODUCER_REVISION rebind: R2-REVISION recomputes the engine digest from the bytes and is green (410/410), so 51730efc is the digest of the new engine files. Consequence as the report states and
  spec :155 requires: every record issued under 1d7dbe40 becomes absent-revision (applied as written after S1-S8/DERIVABLE, PRODUCER_REVISION_ABSENT_APPLIED, never refused for absence); a NEW check
  needing 1d7dbe40 is PRODUCER_REVISION_UNAVAILABLE. No shipped installation carries such records; not a STOP (DECISIONS:859).
- Every other product file = bd7654a (git status --porcelain: exactly the five; numstat 5 files).

## (2) THE ROUND-29 ITEMS (readers' own inputs re-applied on the R30 bytes, R1 and R2, two-lift; pA)
- B-R29F-1 = B-R29C-1 = L20-B2: edits 5/{}/"ab"/[5] -> RECORD_INVALID evidence [fx-resp-1], fx-row DEBUT 105, never a throw (E01-E03, E35); row R30-EDITS-NOT-ITERABLE.
- B-R29F-2 M02/M03/M04 (E18/E22 payload; E19 forged frontier applies, as specified: an unknown spend is not a shape defect), M08/M11 (E08, A02-A04 base_load, w stays 100), M12 (E12/E13 basis.order),
  M13/M15 (evidence): every one refused by the field my R29 read asked for, under R1 and R2, and each has its row (R30-BASIS-CONTAINERS, -AUTHORITY-REFS, -ORDER-SHAPES, -EVIDENCE-ITEMS-PRESENT-REVISION).
- B-R29C-2/3 (C03/C05/C10/C11/C13/C14/C15/C16): paid by the same rows plus R30-BASE-LOAD-AND-LOAD-BASIS-NULL (E05-E07, E20) and R30-ONE-LIFT-CONTROL (the R1 half reaches the gate).
- L20-B3..B7, B10: Astra's six today-entry overlays (copied verbatim from astra-nls-l20, anchors unique) each red on exactly its R30 cell in whole FA03 (A01 L20B3, A02 L20B4, A03 L20B5+B6+B7,
  A04 L20B6, A05 L20B7, A06 L20B10; out\A0n-fa03.txt). L20-B8/B9: E12 basis.order, E08/A02 base_load. L20-B1 green on genuine use: FA03 R30-L20B1-HOST-CONFIGURATION-NO-ADOPTION passes on the
  head and is the one cell red under F01 (the hunk removed), so it drives the genuine durable host; FC12 R30-L20B1-ACKNOWLEDGED-OFFER-SURVIVES follows every minted offer into the next projection.
- R28B-CONFIGURATION-CAPTURE: the old assertion pinned an adopt-observed over w 'BW' (an offer :156 c3 forbids and whose yes was lost, L20-B1); the new one asserts the refusal exactly and keeps the
  PLAN_CHANGED assertion: a correction to the spec, not a weakening. R28B-CONFIGURATION-CAPTURE-STEP2 keeps S27-P212/P216 pinned.
- Debts: D-R29F-1/2/4/8 answered; D-R29F-3/6/7/9 carried; D-R29F-5 changes face (D-R30F-1 below): C02 (workoutFacts null or undefined, landingScenario's yes plus its GENUINE accepted Undo)
  now refuses the genuine Undo RECORD_INVALID payload [fx-resp-2] through containment instead of throwing (out\p1-probeA.txt NOFACTS); C01 unchanged (consumes).

## (3) SPEC FIDELITY of the new rows and cells
- FC12 R30-*: each cites its clause and asserts the outcome (code, field, refs, nothing applied, the other lift's yes applied, R1 = R2, one-lift and two-lift); R30-CONTAINMENT injects faults into a
  wrapped engine and asserts the undo of a half-made EFFECT_CONFLICT and of a landing; R30-GENUINE-YES-NEVER-REFUSED, -TRANSITION-REFUSAL-HOLDS, -TRANSITION-KIND-REASON-PAIRING assert :152/:158/:113
  outcomes. Field names for the envelope and the Basis containers ('payload') and for Decision members ('decision') are the build's convention, which the spec does not fix (:155 names fields for
  S1-S8 only): those cases pin the head's field, not a spec outcome (D-R30F-2). No row passes for a wrong product that I could find: F01/F06 and 9 of my 12 FC03/FC01 mutants are killed by them.
- Fuzz R30-FUZZ-MALFORMED-RECORDS: the generator is a faithful schema of :101-:120 used only to violate it (container swaps incl. non-iterables and null, type swaps, missing/extra member at every
  exact object, a bad element in every array, at every depth); assertions are strong (never throws, RECORD_INVALID names the record for its lift only, nothing applied incl. the Undo's earn kept
  pending, fx-row's exercise/queue/issues/spend and both checks byte-equal to a genuine-record control); it killed 7 of my mutants (V03, V04, V06, V07, V17, V18, V20), 6 of which no fixed row
  kills. Limits: single violation; 'any' members (sets among them) never mutated; bad Loads carry value 45, so a wrong-unit Load at the RIGHT value is not generated (V02); deterministic seeds.
- FA03 R30-L20B*: each opens the real installation and Today entry, trains through the gym model, clicks the rendered Check button, reads the rendered card (li texts, reason), clicks the real Yes
  or Not now, then reads the durable proposal-response ops and a fresh host projection; the DOM text is compared with the SAVED issuance. Genuine host and rendered panel: yes (and the six overlays above).

## (4) MUTATION TABLE (21 own single-clause mutants, in memory; whole FC12 410 with walks and fuzz at defaults, whole FA03 95; plus Astra's six re-applied above)
| id | file: clause (before -> after) | result | classification (measured) |
|---|---|---|---|
| V01 | FC03 isRef: drop `&& text(r.commitment)` | 410/410 LIVE | FIELD-ONLY: a Ref with commitment 5 in evidence -> consumes instead of evidence (pC-V01 C-N17/N17b); authority_refs claim shape still base_load (C-A15) |
| V02 | FC03 isLoad: drop `x.unit === 'lb'` | 410/410 LIVE | FIELD-ONLY but the spec names the field (:156 "unit lb ... field target_load"): a kg scalar or vector item at the RIGHT value -> decision.target_load (FC01's Decision check) instead of target_load, plus ABSENT_APPLIED under R2 (pC-V02 C-E36/E37, C-A11/A14); base_load kg unchanged (c2). D-R30F-6 |
| V03 | FC03 isWrapper: drop `(x.present || x.value === null)` | KILLED | R30-FUZZ seed 20301069 (steps {present:false,value:5} applied) |
| V04 | FC03 isWrapper: drop `typeof x.present === 'boolean'` | KILLED | R30-FUZZ seed 20301010 (fields.topAt {present:'yes'} applied) |
| V05 | FC03 target_load: drop `!T.vector.every(isLoad)` | KILLED | R30-RECORD-DEPTH (target_load vector item {}) |
| V06 | FC03 candidate: drop `c.kind !== 'debut'` | KILLED | R30-FUZZ seed 20301326 (candidate.kind [] applied) |
| V07 | FC03 coverage: drop `text(x.commitment)` | KILLED | R30-FUZZ seed 20300931 (coverage commitment '' applied) |
| V10 | FC03 catch: drop the repair/held clean-up line | 410/410 LIVE | EQUIVALENT on reachable inputs = builder's V45: `held`/`repair` are read only by (a) a later same-lift record whose authority root is the refused spend (no projection ever applied it, so none exists) and (b) a landing of a queue entry of that spend (the state restore removed it); and the catch itself is unreached by any non-injected input (C01) |
| V11 | FC03 catch: drop `state = mark.state` | 410/410 LIVE | EQUIVALENT on reachable inputs = builder's V43: every `state =` in an event follows that event's last throwing call except a second same-lift q in one Close event, which needs two pending native entries of one lift: the transition refuses TARGET_QUEUED while one is pending (FC01 :546) and the base never carries native entries (:96 "not yesterday's folded state") |
| V17 | FC03 set original: isRef -> map | KILLED | R30-FUZZ seed 20301694 (original extra member applied) |
| V18 | FC03 wrappers: drop 'steps' | KILLED | R30-FUZZ seed 20300981 (steps {present:true,value:1,extra:1} applied); my static "equivalent" guess was wrong, the fuzz was right |
| V20 | FC03 FieldImage: drop the per-field isWrapper | KILLED | R30-RECORD-DEPTH (own false), R30-FUZZ seed 20300941 (wAt {value:null}) |
| F01 | FC01: the hunk removed | KILLED | R28B-CONFIGURATION-CAPTURE, R30-L20B1-ACKNOWLEDGED-OFFER-SURVIVES; FA03 R30-L20B1-HOST-CONFIGURATION-NO-ADOPTION (94/95) |
| F03 | FC01 hunk: `!(typeof w === 'number' && isFinite(w))` -> `typeof w !== 'number'` | 410/410 LIVE | EQUIVALENT by domain: ex.w reaches the state only through strict JSON (no NaN/Infinity; STRICT_JSON_NONFINITE, D-L16-T11) or through native writes of a finite target (validDecision > 0 finite; landing newW finite); no reachable non-finite w |
| F06 | FC01 hunk moved above the VECTOR_ADOPTION_UNDEFINED line (ordering) | KILLED | R30-CONFIGURATION-CAPTURE-STEP2 (BW at [100,95,90] must be VECTOR_ADOPTION_UNDEFINED) |
| T01 | today-entry: `if (closeOpId === undefined)` -> `if (true)` (Route B lists Undo offers too) | 95/95 LIVE | SPEC-SILENT surface policy (D9 is a round-4 ruling, not spec text); D-R30F-5 |
| T02 | today-entry: after-Close targets filter drops `completion_op_id === closeOpId` | 95/95 LIVE | SPEC-SILENT (:69 names the entry, not the lift set); D-R30F-5 |
| T03 | today-entry noticesOf: drop `!x.superseded_by` | KILLED | N27 (a superseded hold is history, :158) |
| T04 | today-entry checkNow: drop `held.clear()` | 95/95 LIVE | UI-local: a stale handle from an earlier check stays clickable; the host's respond keeps its own STALE_OFFER/handle guards (:97, :149); D-R30F-5 |
| T06 | today-entry saved: filter by proposalId instead of lift | 95/95 LIVE | SPEC-SILENT UI: the same lift's sibling offer stays visible after a yes; its Yes meets the host's TARGET_QUEUED; D-R30F-5 |
| T08 | today-entry saved copy: undone/saved swapped | KILLED | R4-D9 |
Kill sources: fuzz 7 (V03 V04 V06 V07 V17 V18 V20), fixed rows 5 (V05 V20 F01 F06 T03 T08), FA03 host cell 1 (F01). LIVE 8: 2 field-only (V01 V02), 4 equivalent with proof (V10 V11 F03; V10/V11 also empty under C01), 4 spec-silent UI (T01 T02 T04 T06).

## (5) THE BUILDER'S OPEN POINTS
- S27-P405/P407/P408/P409/P413 field-only spec-silent: AGREED on the outcome (RECORD_INVALID for the record, nothing applied, other lift unaffected, measured by the finisher's probe and consistent with
  my E28/A09). :155 names fields for S1-S8 and the DERIVABLE fields; a strict-JSON/decision-shape failure precedes S1 and :185 leaves the field to the builder. But note the product's own convention
  is now split: structural's pre-validator 'decision shape' line (:339) names payload for a missing spend_id/consumes/evidence, while recordShape names decision for the same Decision's other members
  (E28 body extra member -> decision; a deleted spend_id -> payload). Harmonise or rule it (D-R30F-2). S27-P429: the mutant's field (evidence) is the one S4 names for an edit Ref ("its edits are a
  prefix of the slot's current edit Refs"); the head names consumes for an edit or original Ref ABSENT from the log (pC C-P429/P429b, both revisions). Still field-only, but the spec leans to the
  mutant here; D-R29F-4's residue (D-R30F-3).
- D-R30-V43-V44 and D-R30-V45: AGREED equivalent on reachable inputs (my V11/V10, proofs in the table); the containment catch is unreached by every non-injected input in both suites (C01), so
  these clauses are exercised only by R30-CONTAINMENT's injected faults, which is the right way to pin a safety net. No row owed.
- V28/V29 (isLoad on base_load.scalar/vector) EQUIVALENT: AGREED for base_load: c2 compares base_load byte-exactly (same()) with a projection made of null/lb/configuration Loads, field base_load,
  under R1 and R2 (my E38, N13, A13 all base_load). The target_load twin is NOT equivalent (V02 above): keep V29's scope to base_load.

## (6) NAMED DEBTS (D-R30F-1..8), new findings, not verified
- D-R30F-1 (was D-R29F-5): under workoutFacts null/undefined a GENUINE present-revision compensation is refused RECORD_INVALID payload by containment (the throw at factsAtCut is now a per-record
  refusal of a genuine record: C02, R1 and R2). Host reachability unproven (the registrar always passes facts; the check refuses COMPLETION_REQUIRED after the fold). A facts guard at the gate, red row first.
- D-R30F-2: field convention for pre-S1 failures split between :339 ('payload') and recordShape ('decision'); rows pin that convention (R30-RECORD-DEPTH payload/decision cases, R30-BASIS-CONTAINERS,
  R30-BASE-LOAD-AND-LOAD-BASIS-NULL, R30-DECISION-MEMBERS-PRESENT-REVISION): regression pins, acceptable, but they are the head's field, not the spec's; a PM word on the field for pre-S1 failures closes it.
- D-R30F-3: an edit/original Ref absent from the log -> consumes (structural membership loop) where S4 names evidence (P429); field-only.
- D-R30F-4: depth residue the validator leaves to no clause (applied with no issue under R1): order extras, effect_frontier entry extras, technique members, candidate t/gate/rule/state types,
  coverage disposition/source_member types, load_basis tenure_start/prefix/hi types (E24, N16, N01-N04, N07/N08, E31); spec-silent under :856's depth ruling; sets is the one that bites (B-R30F-1).
- D-R30F-5: today-entry.mjs Route B and view policy unpinned (T01, T02, T04, T06); the hosted sweep's today-entry pass (DECISIONS:860 (4)) will list them; cells only if the PM wants the policy fixed.
- D-R30F-6: V02, a wrong-unit Load at the right value on target_load names decision.target_load instead of :156's target_load; a fuzz bad-Load with the genuine value, or one row, closes it.
- D-R30F-7: containment's undo covers `state`, issues and spent lengths but not mutations of earlier objects (superseded_by, spent close_ref/cancelled_by, effects) nor a first q's landing before a
  second q throws in one Close event; unreachable today (C01; TARGET_QUEUED; base without native entries); if a reachable throw is ever found, the undo is incomplete there.
- D-R30F-8: :61's "no omitted array positions" and "no negative zero" are invisible to the strict-JSON check (json + same: holes and -0 stringify as null/0), so a holey array passes `every`; only a
  structured-clone store write could carry them (out of :R9's threat model); not measured with a matching digest (my C-HOLE/C-NEG0 fell on the digest), listed as not verified.
- NOT VERIFIED: the report's kill tables and TAP hashes (read as data); the hosted sweep results; Astra L21; the FA03 cells under the FC03 validator mutants (their records are genuine); holes/-0 with a
  re-digested record; host reachability of D-R30F-1; the exact set-count domain to bound `sets` by (a PM/builder choice); the 21000-seed fuzz runs (re-ran the default 1000 in every whole-FC12 run).
- Nothing committed, staged or pushed; DECISIONS/STATUS untouched; no object file written; no protected-five, src/, ledger, private, soak, EarnedPort or prepledger-dev path read, listed, loaded or run;
  one shared slot at a time (p0, p1, p2, p3, p4 sequential); nothing written in nlr-r30-scratch or nlr-r30u-scratch.
