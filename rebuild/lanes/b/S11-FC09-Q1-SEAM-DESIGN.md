# Q1 SEAM DESIGN - native-load engine reads over an imported basis (S11 FC09, round 3, DESIGN ONLY)

No product, test, FC03 or engine byte was changed for this document. Every line number is at the worktree as it stands
(84f8421 plus the uncommitted FC09 change). Of rebuild/engine I opened only performed.cjs (:145-194) and native-load.cjs
(greps, and :96-106, :195-205, :296-312, :436-456, :546-560, :674-694). Neither is one of the five protected files
(seed, migrate, merge, index, oracle-shim), and none of those five was opened.

The measured symptom, from PM-RUN section E:
- FC09-Q1-A and FC09-T5 both refuse the native-load check over the admitted basis with
  {code: PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED, refs: [], field: null}.
- Q1-A's host projection also carries [PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED, governor, null].
- Q1-B (an import with no native workout) is clean.
- F9 is absent from Q1-A, so the cause is the import plus a native Start.

## 1. The exact seam

### A. The rule the engine enforces

rebuild/engine/performed.cjs:145 `performedHistory(s, chronology)`.
- At :170-180, whenever legacy rows (an imported `s.sessionLog`) exist beside native Starts, it requires
  `s.workoutFacts.legacy_baseline` with profile earned/imported-engine-history/v1, ids present, and
  `baseline.session_log === s.sessionLog`. That last condition is OBJECT IDENTITY, not equality.
- At :181-183, when `chronology` is set, it also requires `order.import_anchor` with the same two ids.
- Otherwise it throws PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED.
- The file is under rebuild/engine and is NOT one of the five protected files. Its header (:173-175) delegates the binding to
  "the authenticated import controller". B-LOM deliberately left it untouched (legacy-order-mapping.cjs:10-15).

### B. Where the page satisfies the rule, for the gym card only

rebuild/m3/w6/local/today-bindings.mjs inside createGymHost:
- :472-480: `mapping = LegacyOrder.createLegacyOrderMapping({ selection: activeLocalSelection(generation) })`. A refusal is
  carried as `mappingRefusal`.
- :482-488: `composed(s)` returns `{ ...s, workoutFacts: mapping.attach(s.workoutFacts, s) }` when the state carries an
  imported log. attach (rebuild/m4/workout/legacy-order-mapping.cjs:174-186) builds `legacy_baseline.session_log =
  state.sessionLog` (the caller's own object), so the identity holds. It also puts the anchor on `order`.
- :489-491: ONLY `genSession` and `rirPlan` call `composed()`.
- :501-506: the history projector gets `importAnchor: mapping.anchor`, so the facts carry the anchor but no baseline.

### C. Where the native-load engine reads WITHOUT it

- today-bindings.mjs:516-518 `nativeEngine` (the decorated registrar's fold, :526) and :634-636 `engine` (createNativeLoadHost:
  project :652 and check :661). Both are `HostRuntime.createEngineRuntime(...)` used directly. No `composed()` and no attach.
- FC03 rebuild/m4/workout/native-load-effects.cjs:98 `withFacts(state, facts)` = `json(state)` plus `json(facts)`. It is two
  separate JSON copies, so even an attached baseline would point at a DIFFERENT object than the state's sessionLog. It is used
  at :690 (fold base), :831, :1002 and :1010 (re-evaluation at the original cut).
- FC03's engine calls: the fold's accept and landing (`rt.applyNativeLoadDecision`); the governor at :1102; checkNativeLoad's
  evaluateNativeLoad at :1193 and :1215; re-evaluation at :1002 and :1010.

### D. What inside the engine actually reads performed history, and how it copies

rebuild/engine/native-load.cjs, under rebuild/engine and NOT one of the five:
- evaluate(): `liftRows(state, lift)` at :210 on the state AS PASSED, with no copy. earn() at :303-304 takes
  `structuredClone(state)`, with the comment "one call keeps the imported-log alias", then reads `E.performedHistoryRows(V_pre)`
  at :331. structuredClone keeps the alias, so evaluate WORKS if the state it is handed carries the alias.
- governorEvent() at :443 does `const s = json(state)` and then calls `E.performedHistoryRows(s)` at :445. JSON breaks the
  alias, so the governor refuses over ANY imported basis with a native Start, whatever the caller attaches. This is the
  [PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED, governor, null] issue. It is an engine-internal inconsistency with :303's own rule.
- transition() for accept and close, at :553: `json(state)`. Accept and landing read `s.workoutFacts.sessions` directly
  (:579, :664) and not performedHistoryRows. That is why the Yes's hold (EFFECT_CONFLICT) is decided correctly today.
- refusalOf at :40-44 turns a PERFORMED_* throw into a refusal with that code, which is what the host returns.

### E. Admission (my F9 fold)

source-admission.mjs:785- folds over the replayed state with F3's facts. Those facts have no anchor and no baseline, so it
has the same exposure. The governor issue lands in the fold's issues (lift null) and is bound into fold_digest. Accept
outcomes are unaffected.

## 2. Fix options, smallest blast radius first

### (i) HOST-SIDE ENGINE ADAPTER (no FC03 byte, no engine byte)

What: wrap the runtime FC03 is handed, at the engine seam, exactly as `composed()` wraps genSession and rirPlan:

```js
at: d => {
  const rt = HostRuntime.createEngineRuntime(...);
  return {
    evaluateNativeLoad: (s, r) => rt.evaluateNativeLoad(composed(s), r),
    applyNativeLoadDecision: (s, x, c) => rt.applyNativeLoadDecision(composed(s), x, c),
  };
}
```

The composition happens AFTER FC03's copy (FC03 :98 hands a fresh object, and attach takes its sessionLog by reference), so
the alias holds inside the engine call without any FC03 change.

Where (all product bytes inside today-bindings.mjs and source-admission.mjs):
- today-bindings.mjs `nativeEngine` (:516-518): `composed` is in scope (same createGymHost closure).
- createNativeLoadHost's `engine` (:634-636): it opens its own gym via createGymHost (:630). createGymHost's returned handle
  (:587) gains one member (for example `composeNative: composed`), or the native host builds its mapping the same way
  (:472-480). The first keeps one rule in one place.
- A mappingRefusal (LEGACY_ORDER_MAPPING_UNPROVEN) becomes the engine's refusal shape, {status: 'refused', refusal: {code}},
  instead of a throw. The page refuses BY NAME rather than crashing the fold, the same way the gym card does (:483-486).
- source-admission.mjs: the F9 fold moves from replay() into prepareSource, after `selectionId` (:835) and before
  `interpretation` (:837). The admission wrapper attaches the SAME baseline admission already writes as
  view.workout_baseline.engine_baseline (:860: source_generation_id = source digest, activation_op_id = selectionId,
  session_log = the state's own log) plus the matching import_anchor. createLegacyOrderMapping cannot be used there, because
  it needs the basis's interpretation_digest, which the fold feeds (circular). F9 refusals found there return not-ready
  exactly as replay issues do.

Cascades:
- FC03 bytes unchanged, so no PRODUCER_REVISION move. PRODUCER_REVISION covers engine files only (FC03:1284-1291; SPEC :102
  R9.13 (ii) "never FC03's own bytes").
- No production-mapping treeSha256 move, and no s3-portable-sources change.
- The S11.json product map entries for today-bindings.mjs and source-admission.mjs move (S11-REGEN).
- No test pins today-bindings by hash (searched m3, m4 and lanes/d).
- The page-bundle count does not move: no new module.

Fixes:
- the check after an import (new offers);
- the Undo of a held Yes (T5);
- re-evaluation reads.

Does NOT fix the governor (D, :443). Q1-A asserts no PERFORMED_* issue on the projection, so Q1-A STAYS RED under (i) alone.

Engine grant: none.

### (i-b) (i) plus a host-side governor adapter (no FC03 or engine byte; NOT recommended)

What: for the governor event only, the adapter calls the engine on `{ ...s, sessionLog: {} }` and restores the caller's
sessionLog on the result.

Why it would be equivalent today: the governor reads only native rows (native-load.cjs liftRows :104
`if (row.source !== 'performed') continue`), and performedHistory orders native rows by order.start_ids rank whether legacy
rows exist or not (performed.cjs :185-187). So the native rows and their order are identical.

Bytes: today-bindings.mjs and the admission adapter only.

Risk: it encodes an engine-internal fact in host code. If the governor ever reads legacy rows, the adapter silently diverges,
and no cell can prove the equivalence without the engine fix. It makes Q1-A green with no grant. I list it so the PM can
refuse it on the record.

### (ii) A MINIMAL FC03 CHANGE

What: FC03 accepts an injected `compose(state)` and applies it at each engine call (or withFacts preserves an alias through
one structuredClone of {state, facts}). This centralises (i) for both callers.

Bytes: native-load-effects.cjs, plus both callers.

Cascades:
- FC03 bytes move, but PRODUCER_REVISION does NOT (engine files only).
- The S11.json product map entry for FC03 moves.
- native-load-options.test.cjs cites FC03's hash in COMMENTS only (b25d2e61, :5143 etc.), not in an assertion found.
- The FC03 build-review chain (Astra/Fable reviews of FC03) would need a re-review.

It still does NOT fix the governor (the engine's own json at :443). Same coverage as (i), larger radius. Not recommended.

### (iii) THE ENGINE FIX, together with (i)

What: native-load.cjs:443 `const s = json(state);` becomes `const s = structuredClone(state);`. This is the alias-keeping copy
the same file already uses at :303-304 for the same reason. The governor event's output is still JSON-normalised by
applyNativeLoadDecision (:686 `json(transition(...))`), so nothing downstream changes shape. It needs (i) as well, because the
baseline must be attached first.

Bytes: one rebuild/engine line. That needs the OWNER's grant (brief: "Never edit anything under rebuild/engine").

Cascades (all real):
- PRODUCER_REVISION moves (native-load.cjs is in its file list, FC03:1284-1287). FC12 R2-REVISION must be re-bound. Every
  native accept recorded under the old revision is then judged as "revision absent": applied from its body after structural
  checks, with issue PRODUCER_REVISION_ABSENT_APPLIED (SPEC :155 REVISION RETENTION, :214), never re-priced. That is correct
  by spec, but it is visible as a new issue on every earlier Yes.
- production-mapping.cjs:56-63 treeSha256 (19 engine modules including native-load.cjs) moves, so the PORT's engine identity
  changes. Any bundle sealed before the change no longer matches the production mapping and must be re-sealed.
- s3-portable-sources.json (:109, :817 list native-load.cjs) and the S11.json product map entry move.
- native-load-options.test.cjs pins tied to the revision.

Fixes: everything (i) fixes, PLUS the governor, so Q1-A and T5 both go green with their assertions unchanged.

### What the spec says the behaviour must be

- SPEC:155 "FC03 runs on EVERY current projection: check; pre-commit respond; post-commit refresh; new capture; cold
  boot/cache rebuild; local source admission/reopen/rollback". The check and the governor run after an import exactly as
  before one.
- SPEC:11 I4 "every projection reconstructs at source frontiers"; SPEC:156 (R8, step 6) the governor projection runs ONCE per
  projection.
- SPEC:158 NO TRAP "fail closed, never trap". A held lift has native exits; SPEC:154 the compensation (Undo) is offered while
  no later Start captured the effect, with the RETIRE shape keeping today's projection (R5-B12 is that host cell before any
  import).
- SPEC:157 and :214: SOURCE_FRONTIER_UNPROVEN is the gate for IMPORTED or FOREIGN native records. A Yes this installation
  committed through its guarded host is its own record, so the gate does not apply.
- The engine's own rule (performed.cjs :173-175, legacy-order-mapping.cjs:5-15): an old import needs its mapping, and the
  page supplies it.

So for a person who trained first and then imported:
1. A Yes made before the import is admitted (F9) and folded over the imported base. If the base moved, it is HELD
   EFFECT_CONFLICT, its card is the baseline ask, and its Undo (retire-only) is OFFERED.
2. After the next saved workout, "Check next weight" evaluates with the unchanged engine predicates over the imported legacy
   prefix plus the native workouts, in the order the athlete confirmed (B-LOM), and offers whatever those rules offer.
3. The governor replays at each projection with no refusal.

Today, (1) fails at the Undo, (2) is refused PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED, and (3) is refused. That is a trap
under :158.

### Red-first cells

All are PM-seat, because each loads a protected engine file through admission or the port harness.

Must go green with assertions UNCHANGED:
- FC09-T5 (the Undo is offered over the admitted basis; spent once; retired on reopen). (i) should suffice.
- FC09-Q1-A (the check offers after the import, and the projection has no PERFORMED_* issue). It needs (iii), or (i-b).
- FC09-Q1-B stays green. FC09-T1 and T2 stay green.

Added red-first, before the product change:
- FC09-Q1-C GYM AND NATIVE AGREE ON ONE IMPORTED BASIS. After a pre-import workout and the import, for every lift the gym
  card's prepared prescription (genSession through `composed`) and createNativeLoadHost().project().state agree on w for every
  UNHELD lift, and no projection issue is PERFORMED_*. Red today, by the governor issue.
- FC09-Q1-D IMPORT-FIRST, THEN TRAIN, THEN CHECK. Admit with no native workout (the selection records no order map, per
  B-LOM's own rule), train through the page's gym on the ADOPTED basis, Finish, and check. An offer is expected, and the
  registered projection has no PERFORMED_* issue. This is the genuine order B. T2 currently obtains its post-import Yes over
  the first-run state for exactly this reason. With the fix, T2's order B should switch to the adopted basis, which is a
  fixture move toward genuine use, not an assertion change.
- FC09-Q1-E ADMISSION PARITY. F9's fold at admission and the page's fold carry the same issue set for the yes and NO
  governor PERFORMED_* issue, so fold_digest binds no refusal the page does not show.
- For (iii) only: an engine-level cell beside the R5 rows in rebuild/m4/spec/native-load-options.test.cjs (its factories
  exclude the protected five). governorEvent over a state whose workoutFacts.legacy_baseline.session_log aliases
  state.sessionLog returns applied or unchanged, never refused, and a JSON-copied twin of the same state still refuses
  PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED (the mutant: :443 back to json). Plus the FC12 R2-REVISION re-bind cell.
- Q3 (file ID differs from the setup slug) is a DIFFERENT seam: the correspondence re-key that admission applies to facts
  and the page does not. It is not touched by any option here. I would add it as its own cell (a real-shape bundle, a Yes on
  a corresponded lift, admission outcome equal to the page's), and it may show a separate defect.

## 3. Recommendation, and what needs the owner

Recommendation: (i) now, under the PM, followed by (iii) under an owner grant. Together they are the smallest change that
makes Q1-A and T5 green with their assertions unchanged.
- (i) alone repairs the Undo and every post-import check (T5), with no FC03 or engine byte. Q1-A then fails ONLY on the
  governor clause, which isolates (iii) precisely.
- (iii) is a one-token engine change that makes governorEvent copy the way earn() already does (:303 "keeps the
  imported-log alias").
- I do not recommend (i-b): it would make the cell green by relying on an engine internal it cannot prove.
- I do not recommend (ii): it is a larger blast radius with no extra coverage.

Needs the OWNER, not the PM:
1. The engine grant for native-load.cjs:443, if (iii) is taken.
2. Its consequences, all of which follow from the PRODUCER_REVISION move:
   - every Yes already recorded is then applied "as recorded, revision absent" with a notice, never re-priced;
   - production-mapping treeSha256 moves, so a port bundle sealed before the change must be re-sealed before Step 0;
   - whether he accepts that timing.
3. The runbook's ordering sentence while the seam is open. Today a person who trained before importing gets no "Check next
   weight" offer after the import, and no Undo for a held Yes. The wording he is told is his.

Needs the PM:
- A ruling on (i) as a ticket of its own, or as part of FC09. It touches today-bindings.mjs, outside FC09's file list, and
  moves the F9 fold into prepareSource.
- A ruling on refusing (i-b).
- Whether Q1-C, Q1-D and Q1-E are added red-first now.
- S11-REGEN after either option.
