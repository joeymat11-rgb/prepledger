# REVIEW S11 FC09 (native-load Yes admitted by local source admission, F9; Q1 seam; Q3 lineage)

Reviewer: Claude Opus 5.5, blind engine-tier seat (brief pm9-brief-s11-fc09-review-ro.txt). No other review read.
Head checked: worktree earned-s11-fc09-ro, HEAD f6c531b1032fa9967984736ed866a6bcfbda6a29 = 84f8421 + one commit;
reviewed `git diff 84f8421 f6c531b` (20 files, +2316/-147). Spec read: 7ef8291 NATIVE-LOAD-SPEC :121-:128, :150-:158
(and the R9.13 paragraphs on those lines). DECISIONS read: origin/rebuild/t2-client-core lines 877-881 only.

VERDICT: ACCEPT WITH NAMED DEBTS

No problem reachable from genuine use was found. Every item below that I could not close is either unreachable
without hand-built/damaged records or a test-strength note.

## What I ran (this seat; MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York; one node process at a time)

- rebuild/m4/import/test/native-load-replay.test.cjs: 11/11.
- rebuild/m4/workout/test/legacy-order-mapping.test.cjs: 14/14 (LOM/12, LOM/13 included).
- rebuild/m4/spec/native-load-options.test.cjs (FC12): 470/470, including R2-REVISION (so PRODUCER_REVISION
  f4955594... is what R2-REVISION's recipe computes on this tree), FC09-ENGINE-GOVERNOR-ALIAS, all FC09-LINEAGE-*.
- MY OWN DIFFERENTIAL (scratch diff-fc03.cjs + fc12-diff.test.cjs, a copy of FC12 whose FC03 require is a
  wrapper): every FC03 call FC12 makes (foldNativeLoad, checkNativeLoad, basisOf, issuanceFor, sameIssued,
  completedLifts, operationsOf, heldProjection) was run on the f6c531b FC03 and on the 84f8421 FC03
  (`git show 84f8421:...native-load-effects.cjs`), outputs compared as JSON with the old revision string
  normalised. Calls carrying a non-empty correspondence were skipped (87). Result: 37,928 calls compared,
  2 mismatches, both inside R30-CONTAINMENT/R31-CONTAINMENT-* (re-run alone: the same 2), whose injected faults are
  call-count stateful, so a second call differs by construction. Every other shared-id call is byte-identical.
- Static: product diff of all 10 product files read in full; FC03 lines touched by the change enumerated one by
  one for PAIRS===null (all reduce to the old expression; sameRoots equals some/includes for string roots).

## Judged by name

J1 FC09-Q1-A (offer -> NATIVE_LOAD_PLAN_CHANGED): RIGHT ON THE SPEC, NOT WEAKENED. SPEC:127 step 2 refuses when
deliberate load changed since the checked completion; the MISSED CLOSE clause of :152 (a special case exempting the
debut capture from step 2 "so the debut capture alone never refuses PLAN_CHANGED", also on the adoption branch)
shows step 2's load comparison runs before step 3 chooses adoption, so a card+5 pre-import completion over a
programme the import moved is PLAN_CHANGED, refs [Close] (:185, an import is no plan op), field null. The cell
gained a precondition (imported w differs from the captured card) and pins code, refs and field exactly. Its
original purpose survives: performedIssues(p) === [] is unchanged, and PLAN_CHANGED is only reachable after FC01
has read performed history (step 1) and returned an offer/after-step-2 refusal (FC03 `judged`), so the
PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED seam was passed. Q1-D covers the post-import offer.

J2 FC09-Q3-D: the corrected notion is right. Verified: engine-capture.cjs:25 (loadCell) and :75 capture a string w ('hold') as
{kind:'configuration'}; gym-model.mjs:366 fills the box only with a finite load.value; the documented rule is
gym-model.mjs:253-256; the cell's `planned` helper indexes wSets[min(position,len)-1] with 1-based positions
(engine-capture.cjs:90 `[card.id,i+1]`), which is planVector's rule (progression.cjs:80-82). Fixture: legacy-fixture
.cjs:72 hack w:'hold', :73 hipthrust w:null. PRE-EXISTING claim: holds statically (gym-model.mjs, engine-capture
.cjs, progression.cjs are not in the 20-file diff); not executed at 84f8421 (the path loads admission). Held-lift
case: the expected adopt-baseline/all-null-current is :158 exit (b). Test-strength note (debt N7): the branch is
read from the page's own fold although variant(1) is deterministic, and the empty-box guard skips the file lift.

J3 FC09-LINEAGE-BOUNDARY swap: ACCEPTABLE. The cell still asserts four lift-named refusals (liftId,
lift_lineage_id outside facts, lift, exercise_id), book clash, record lift already in base, FC01 changing another
member, plus the explicit non-refusal (mg, priority_muscles, a map keyed by a muscle). The trade-off is
fail-open for UNLISTED lift-keyed maps or id arrays. Today harmless: native-load.cjs reads only exercises, queue,
workoutFacts; performed.cjs only sessionLog and workoutFacts (all in the closed list), and lineageBack returns every
member except exercises/queue from the INPUT, so an un-renamed unlisted member cannot leak into the programme.
Named debt N4 (old-app maps keyed by exercise id exist: writers.cjs:2717-2720 draft maps, sessionLog[d].skipped).

J4 Undo under the record's id; capture_sha256; exit authority refs: ADDRESSING ONLY. The Undo of a corresponded
spend must carry the record's lift because FC01 binds request/compensation lift to the spend's (:386, :513); the
page shows the offer on the file's lift (today-bindings shownLift), with the same loads and copy. capture_sha256
and load_basis.authority_refs are basis internals no screen prints; they are recomputed with the same lineage on
re-validation. Nothing a person can do changes except what the fix intends (the Undo becomes reachable). With
shared ids none of the three moves (differential above; evalLift === lift when PAIRS is null).

J5 S21 (overlap) equivalent: AGREE (static). A spent entry exists only for a group that reached its accept.
Two groups whose consumes share a resolved root are of one lineage, because S1 forces every root's lift to resolve
to the body's lift (correspondence(), non-reproducible records) and a reproducible record's consumes are FC01's
own, naming the request lift. Same-lineage pairs sharing a resolved root are marked conflict by S18 (sameRoots)
before any event and never accept. So raw and resolved overlap agree on every state a host can produce.

J6 LOM-S6-ADMISSION: gate CONFIRMED; law INCOMPLETE (debt N1). The one call is
`compose=orderMap?...:s=>s` (source-admission.mjs:816); M is non-null only when `mixed` and only via
order.confirm(review,{answer:prefixAnswer}) or order.restore+validate; attachAdmittedOrder re-runs confirmedMap
against the five SHARED identity fields and refuses a missing selection id. My grep of m3/m4/client/coach non-test
code finds exactly one attachAdmittedOrder caller and one mapping.attach (today-bindings.mjs:491). The stamp goes
on the engine copy only (foldNative never writes it to the view). But neither LOM-S6 half detects a NEW site
that stamps by object literal ({legacy_baseline:..., import_anchor:...}) without naming the helper or
createLegacyOrderMapping: the halves search for symbols. The round-3 hand-built compose was caught only because a
comment named createLegacyOrderMapping (report 12.2). No such site exists in the tree today.

J7 view.workout_facts address split: NOT REACHABLE (debt N5). `git grep workout_facts` over m3, m4, client,
coach non-test code: the only occurrences are admission's own write (source-admission.mjs:886, :890). F9 folds
projectedWorkoutFacts (pre-rekey), the page projects its own facts; the split facts feed only the digest.

J8 shared ids byte-identical to 84f8421: CONFIRMED for FC03 (differential above, 37,926 identical calls) and for
PRODUCER_REVISION (R2-REVISION green). Engine line :443 json -> structuredClone: governorEvent is reached only
through transition() inside applyNativeLoadDecision, whose result is json()-normalised (:686), so output shape is
unchanged; the only behavioural difference is a DataCloneError on a state carrying a function/symbol, caught there
and returned refused (debt N6). Caveat: the PAGE now always passes a resolver; for shared ids it is pairs {} ->
identity, except the refusal cases in N3.

## BLOCKING

None.

## NAMED DEBTS (each needs hand-built or damaged records, or a history the real host cannot write)

- N1 LOM-S6 + LOM-S6-ADMISSION detect symbol use, not stamping: a hand-written legacy_baseline/import_anchor
  literal at a new site passes both halves (J6).
- N2 F9 refuses the whole admission (field 'fold', outcome null) for an accepted Yes whose every naming issue is
  superseded and which has no spend: a RECORD_INVALID-held Yes (no spend) later superseded by an exit (b), then a
  new import or rollback. Needs a host-issued record to fail S1-S8/DERIVABLE, which the host does not produce. Same
  area: a Yes held EFFECT_CONFLICT then superseded by an exit is labelled 'applied' in its F9 row (digest-only).
- N3 Page nativeLineage refuses (FC03 fold RECORD_INVALID 'lineage' -> registrar throws -> card refused) on two or
  more setup ops, an unconstructable setup payload, or duplicate/empty lift ids; it also skips admission's
  schema_version/Setup.validate checks. Unreachable: SETUP_ALREADY guard (setup-host.mjs:107), single device.
- N4 Engine boundary fail-open for unlisted lift-keyed maps/arrays (J3); harmless while FC01 reads only the
  closed list.
- N5 Admission view.workout_facts keeps the entry/fact id split (J7); no product reader.
- N6 native-load.cjs:443 structuredClone throws where json dropped functions/symbols; caught, refused.
- N7 Q3-D test strength: branch chosen from the page's own fold; file lift excluded from the empty-box guard.
- N8 replay-registry: the rebuild/client/index.cjs#plan entry no longer lists plan-mutation, undo-request or
  earned/coach/proposal/v1 (rule text still says they refuse UNMAPPED; EN3 still proves no caller).
- N9 F9 read() refuses a Yes whose effective.local_date is after admission's currentDay (e.g. a Yes stamped while
  in a time zone ahead); same rule other families apply (CONTEXT_UNRESOLVED), so not new in kind.
- Pre-existing, not FC09: empty load box for a text working load ('hold'/'BW') at 84f8421 (J2), owner UX call.
- Declared by the brief: D-S11-FC10, D-S11-EN3-COPY; S11.json posts and s11-supersede suites stale until S11-REGEN.

## Other checks that came back clean

- Rename after import cannot break the resolver: FC03's base is the admitted state (today-model basisState /
  stateFromOps applies sleep, reads and food only; Edit My Week edits are not folded into it), so file-lift names
  in the base are fixed at admission. Edit My Week removal retires, never deletes (plan-edit-model.cjs:340-343), so
  a phone slug is never re-corresponded by name before an import.
- Admission and page resolvers agree: correspondence over (file lifts + appended uncorresponded document lifts) gives
  the same pairs as admission's lift_correspondence (an appended lift sharing a corresponded lift's name would have
  made that name non-unique in the document, so it could not have corresponded).
- liftResolver 'ambiguous' is unreachable after admission's idCollisions refusal.
- legacy-order-mapping refactor is faithful (confirmedMap and stamp reproduce the old inline checks; baseline()'s
  empty-log check moved into stamp; composed() only calls attach on a non-empty log).
- performed.cjs:45's slot-key check is skipped for projected entries (correspondence_profile set,
  engine-history.cjs:91), so the boundary view's renamed entries with unrenamed slot keys stay valid.

## What I did not verify

- Any cell that loads admission, the port harness or the page bundle (native-load-import, local-source-admission,
  writer-order, writer-enumeration, legacy-order.test.mjs incl. LOM-S6-ADMISSION, page-bundle): judged statically;
  PM SUMMARY files show pm-out-r7reg B1-B5, D1-D8, E1-E3, G1-G7, H1-H4 green, C1/C2 red as designed (EN3 mutants),
  B6 page-bundle 5/7 (P3-B2, P3-B5; reported as the known seat offset; not measured by me); pm-out-callers mutants
  C1-C6 each killed; pm-out-r7l is the red-first state.
- The PRE-EXISTING empty-box claim at 84f8421 by execution (path loads protected files).
- The owner's real file; only the variant(1) synthetic shape is exercised by the cells.
- S21 equivalence by execution (static argument only); caller mutants C1-C6 (PM seat).
- The engine :443 change under the real host beyond FC12's governor-alias cell.
