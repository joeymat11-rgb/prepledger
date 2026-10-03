# Q3 SEAM DESIGN - a native-load Yes on a lift the imported file names by another id (S11 FC09, round 4, DESIGN ONLY)

No product byte was changed for this document. Line numbers are at the worktree as it stands (round 3 bytes plus the round-4
test edits). The five protected engine files were not opened.

Measured at the PM seat, round 3, cell FC09-Q3 (real-shape bundle, sealed(1), handles):
- the phone slug `prime-abdominal-crunch` corresponds by name to the file lift `abs`;
- F9 recorded `held` [NATIVE_LOAD_RECORD_INVALID];
- the page shows [NATIVE_LOAD_RECORD_INVALID, lift_lineage_id, null];
- the Yes is held on NO lift.

## 1. The seam

### A. Two id spaces meet, and nothing translates between them

- The phone's records live in the DOCUMENT's id space. The Yes body names the phone slug (body.lift_lineage_id, the spend_id
  ["native-load", lift, ...], decoded at FC03:283, and every consumes root [start, lift, close], checked at FC03:492). The
  capture the gym card wrote names the slug, and so do its performed entries.
- The admitted state lives in the FILE's id space (P3-REAL-SHAPE option A, DECISIONS:520-521). The file's lifts are the
  athlete's lifts, under the file's own ids. Correspondence is by normalised NAME:
  - rebuild/m4/workout/lift-correspondence.cjs:51 correspondence(), computed once at admission
    (source-admission.mjs:412 lift_correspondence);
  - used there for the capture block (:451 liftAttach) and the facts re-key (:758 rekey);
  - "a change of ADDRESS, not of content" (source-admission.mjs, the re-key comment).
  A corresponded document lift is NOT appended to the admitted state (:495), so after the import the slug names no lift of
  the base.

### B. Where the Yes is lost

- FC03 structural(), native-load-effects.cjs:350: `if (!base.exercises.some((x) => x && x.id === body.lift_lineage_id))
  return 'lineage';`. This is spec S1 (:155: "body.lift_lineage_id resolves to a lineage present in the base (an absent
  lineage refuses here, field lift_lineage_id ...)").
- FC03 :713 liftOf() returns null for a lift the base lacks, so :760 disputes RECORD_INVALID with `lift: null`.
- FC03's own rule for that shape (the fold's per-lift comment, near :700): "An issue whose lift cannot be resolved carries
  lift:null and holds back every check." A lift-less hold therefore blocks native-load checks for EVERY lift, not only the
  corresponded one. That is a wider trap than one held lift.
- FC01 (rebuild/engine/native-load.cjs) indexes by the same id: evaluate :205-206 (LIFT_UNRESOLVED when the request's lift
  is not exactly one state lift), transition :553-554, and liftRows :101-106 (performed entries by lift_lineage_id).
- F9 (my round-1 classification) correctly calls this `held`, not intrinsic: 'lineage' is base-dependent. It agrees with
  the page, which is what FC09-Q3's parity half confirms. Only the LIFT is missing.

### C. Related but separate (observed, not designed here)

- On the page after a real-shape import, the gym history projector does NOT re-key. Its facts name the slug, while the
  adopted state names the file id.
- The native-load panel lists lifts from the state (today-entry.mjs:391) and completions from the facts (host project
  `lifts`), so for a corresponded lift those two never meet.
- This is the same address split, seen from Today. It is in scope of option (a) below, because (a) moves the native-load
  judgement into the record's space, where the page's facts already are.

## 2. Options, smallest blast radius first

### (a) RECORD-SPACE JUDGEMENT AT THE CALLERS (no FC03 byte, no engine byte)

Run the native-load fold and check in the DOCUMENT id space, where the records, captures and page facts already live, and map
the folded programme back to the file's ids before anything adopts it.

- One shared pure helper pair in rebuild/m4/workout/lift-correspondence.cjs, which is already "the one place three readers
  share":
  - `toRecordSpace(state, correspondence)` renames each corresponded FILE lift to its document slug in every lift-keyed
    member of the engine state;
  - `fromRecordSpace(state, correspondence)` is its exact inverse.
- The inventory of lift-keyed members must be EXHAUSTIVE and CLOSED: exercises[].id, queue[].exId, sessionLog entries[].id,
  retirements keys, and any other member the engine reads by lift id (to be enumerated from the engine state constructor and
  readers, then pinned by a cell). A state carrying a member the helper does not know refuses by name rather than passing
  through half-renamed.
- Callers:
  - today-bindings.mjs, in both native engines' bases (the registrar fold and createNativeLoadHost project/check/respond).
    It renames the base in, runs FC03 and maps the fold state out. The correspondence is recomputed with the SAME function
    over the setup document (the F4 op in the log) and the admitted state, as plan-edit-model.cjs already does for the
    companion.
  - source-admission.mjs foldNative: fold over the base renamed into record space, with the PRE-re-key facts (admission
    keeps both), so F9's outcome is the page's outcome.
- Bytes: lift-correspondence.cjs (+2 functions and the inventory), today-bindings.mjs and source-admission.mjs. Possibly
  today-entry.mjs, if the panel's lift labels must read through the map.

Cascades:
- FC03 unchanged, so no PRODUCER_REVISION move. Engine unchanged, so no treeSha256, s3-portable-sources or FC12 R2 move.
- page-bundle: lift-correspondence.cjs moves from ROUTE-only to the Today BOOT graph (today-bindings would import it). P3-B4
  ROUTE_MODULES drops it (20 -> 19) and P3-B5's boot count rises by one. These are pins to re-measure, red first.
- The S11.json posts of the three files move (S11-REGEN, PM).
- LOM-S6 is unaffected (no mapping, no attach). P3-EN1/EN4 are unaffected (readers only).

Risk: renaming is only as good as the inventory, which is why the inventory is closed and refusing, and why round-trip and
completeness cells come first.

### (b) FC03 JUDGEMENT WITH AN INJECTED RESOLVER (FC03 bytes; no engine byte)

FC03 takes `resolveLift(recordLift) -> stateLift` and applies it at:
- S1 (:350) and liftOf (:713);
- the consumes-root lift check (:492) and startCapture's slot lookup (:123);
- the spend lift (:283);
- and before every engine call, where it must still hand FC01 a state the request's id resolves in (FC01:205, :554, liftRows
  :104). So it needs (a)'s renaming INSIDE FC03 as well.

Bytes: native-load-effects.cjs (judgement hunks) and both callers.

Cascades:
- FC03 bytes move; PRODUCER_REVISION does not (it hashes engine files only, FC03:1284-1291; SPEC :102 R9.13 (ii));
- the FC03 review chain;
- S11.json;
- a SPEC amendment to S1's text, which says "present in the base".

Same coverage as (a), larger radius. Not recommended.

### (c) ENGINE RESOLUTION (engine bytes; NOT recommended)

FC01 resolves lifts through a correspondence. This needs an owner grant, and it moves PRODUCER_REVISION, production-mapping
treeSha256, the s3 manifest entry, FC12 R2 and the port re-seal (see Q1-SEAM-DESIGN (iii)). It buys nothing (a) does not.

### Rejected: re-key the RECORDS at admission

Native records are immutable, authenticated operations (I4). Admission writes no op, and minting translated copies would be a
second consent record, which SPEC :101 forbids ("not a second consent record").

## 3. What the spec says, and what is unruled

- SPEC :9 I2 BASIS: "a yes binds lineage, ...; changed evidence refuses, never substitutes". This rules out re-pricing. The
  question is only whether the corresponded file lift IS the same lineage.
- SPEC :155 S1: the lineage must resolve in the base.
- SPEC :158 NO TRAP and :154 (the Undo offered while nothing captured the effect). A lift-less RECORD_INVALID holds back every
  check (FC03's rule), so the athlete has no native exit, not even on other lifts. That is a trap.
- P3-REAL-SHAPE 2.5 (DECISIONS:520-521): the file lift and the phone lift with the same normalised name ARE the same lift, and
  a re-key is "a change of ADDRESS, not of content".
- The NATIVE-LOAD spec (R9.13) predates P3-REAL-SHAPE and is SILENT on correspondence. So "the Yes follows its lift to the
  file's id" is a ruling, not a reading.
- I believe the PM can make that ruling under DECISIONS:521's option A (one rule, by name). It needs the OWNER only if it
  changes what he sees. It does not: the held or applied outcome and its Undo copy are unchanged, and only the lift it lands
  on is corrected.

The required behaviour, once ruled. For a person whose file names his lifts by its own ids, who trained on the phone and
tapped Yes before importing:
- the Yes is admitted and judged on the FILE's lift (the same lift by name). Applied if its base is unchanged; held
  EFFECT_CONFLICT with its Undo offered if the import moved the weight (:158, :154). Never held on no lift.
- every other lift's checks are unaffected;
- after the next saved workout on that lift, the check offers per SPEC :127-128, as FC09-Q1-D now pins for the shared-id case.

## 4. Red-first cells (all PM-seat: real-shape bundle, port harness, admission)

- FC09-Q3 (exists; unchanged): admitted, admission and the page agree, and every issue naming the Yes is on the file's lift.
- Q3-B UNDO ON THE FILE LIFT: the held Yes's Undo is offered over the admitted basis, by the record's spend, and its yes
  retires the spend (T5's shape on the real-shape bundle).
- Q3-C NO LIFT-LESS HOLD: after the import, a workout on ANOTHER lift is offered as usual, so no lift-null issue holds back
  every check.
- Q3-D IMPORT, TRAIN THE CORRESPONDED LIFT, CHECK: the panel's completion and the state's lift meet. The check offers
  adopt-observed of the lifted loads (Q1-D's shape on the corresponded lift).
- Q3-E ADMISSION AND PAGE PARITY on the real-shape bundle: F9's fold_codes equal the page's codes.
- Unit cells, no protected file (beside lift-correspondence.cjs's own tests):
  - toRecordSpace/fromRecordSpace round-trip byte for byte on the real-shape fixture state;
  - every lift-keyed member is renamed;
  - an unknown lift-keyed member refuses by name;
  - an uncorresponded lift is untouched;
  - an id collision refuses (idCollisions).
- page-bundle: P3-B4/P3-B5 re-pinned red first for lift-correspondence.cjs moving to the boot graph.

## 5. Recommendation

(a), after a PM ruling that a native record follows its lift to the file's id by the one correspondence rule
(DECISIONS:521). It needs no FC03 or engine byte, and it also closes the Today-side address split for native-load (1.C).
The first deliverable is the exhaustive lift-keyed member inventory with its refusing unit cells, before any caller changes.

## 6. ROUND 5: STOP. Option (a) cannot be built as ruled (DECISIONS:880 (3)); its premise is wrong

The ruling built on section 2 (a)'s premise: "run the fold in the DOCUMENT id space, where the records, captures and page
facts already live". That premise is my design's error. Before writing any (a) code I re-read the inputs FC03 actually
joins, and they are not in one id space. No (a) byte was written; FC03 and the engine are untouched.

### 6.1 Evidence (file:line, read on this seat)

- ADMITTED FACTS ARE ALREADY IN FILE SPACE. source-admission.mjs:759-764 (P3-REAL-SHAPE 2.5 rule 1) re-keys every
  projected entry's `lift_lineage_id` from the document slug to the corresponded FILE id (`liftAttach`). The comment at
  :736-758 says so, and says the stored capture and each slot's `logical_set_slot` (e.g. "[\"calves\",1]") are
  deliberately LEFT under the slug.
- RAW OPERATIONS AND RECORDS STAY IN DOCUMENT SPACE before the import. FC03 reads them raw:
  - startCapture (native-load-effects.cjs:123-127) and its callers (:172-174, :193, :210) match session-start capture
    cells by `cell.lift_lineage_id === lift`;
  - :118 matches capture cells against `entry.lift_lineage_id` (a re-keyed FILE id) - already mixed;
  - records carry the slug in `body.lift_lineage_id` and inside `consumes` roots (`[x, lift]`, :482, :493).
- AFTER THE IMPORT EVERYTHING NEW IS IN FILE SPACE. The gym card prescribes from the adopted, file-id state
  (today-bindings.mjs:482-491 `composed`, :504 `nativeRuntime`). So every capture, session-start cell, set op, page fact
  and native record written after the import names the FILE id (e.g. `abs`). Before the import they name the slug (e.g.
  `prime-abdominal-crunch`).
- FC03 ALSO KEYS STATE BY LIFT: queue[].exId (:264, :279, :958, :1040, :1062), base.exercises[].id (:350, :714), and the
  engine calls at :1002 and :1010 hand FC01 the record's lift.

### 6.2 Why (a) fails

A state-only rename (file id to slug) agrees with pre-import records and pre-import raw cells. It DISAGREES with:
- the admitted facts (already file ids, by :759-764);
- every post-import capture, cell, fact and record (file ids).

So (a) turns FC09-Q3 green only by mis-addressing the post-import path. Cells that would go red under it:
- Q3-D: train the corresponded lift after the import, then check;
- every post-import native Yes on a corresponded lift, whose S1 would fail against the renamed base.

Renaming in the other direction (slug to file id) is the "re-key the records" option that was already rejected
(section 2): records are authenticated, and their `consumes` roots and `spend_id` lineage embed the id.

### 6.3 Corrected options (for a ruling; nothing built)

- (a'') FULL CALLER-SIDE RE-ADDRESSING. Hand FC03 a single space by renaming, in memory, all of the following into the
  FILE space, through one closed helper:
  - state;
  - facts;
  - the copies of session-start and set operations (capture cells, `logical_set_slot` JSON);
  - the record bodies and `consumes` roots.

  No FC03 or engine byte. But it rewrites the op and record copies FC03 authenticates and lineage-checks. Any digest
  FC03 or the fold derives over a record (fold_digest, spend lineage) would be computed over the rewritten copies, and
  I4 ("not a second consent record", SPEC:101) is at least strained. Largest radius, highest risk. Not recommended.
- (b) FC03 LINEAGE RESOLUTION (section 2 (b), now the recommendation). FC03 takes a closed, refusing correspondence
  resolver and applies it at every lift join:
  - S1 :350 and liftOf :714;
  - consumes roots :482, :493;
  - startCapture :123-127 and its callers :172-174, :193, :210;
  - the capture/entry join :118;
  - captures :323 and sessionOf :103;
  - the queue joins :264, :279, :958, :1040, :1062;
  - the engine requests :1002, :1010, which are handed the RESOLVED (state) lift.

  SPEC:155 already lists "lineage resolution" among FC03's structural checks, so this is FC03's job by the spec's own
  allocation.
  - No engine byte, so PRODUCER_REVISION does not move: it hashes engine files only, FC03:1284-1291.
  - Cascades: FC03's review chain; the S11.json post (S11-REGEN); possibly S1's spec text ("present in the base").
  - Both callers (today-bindings.mjs and source-admission.mjs foldNative) pass the same resolver, built by
    lift-correspondence.cjs from the setup document and the admitted state.
  - page-bundle: lift-correspondence.cjs moves to BOOT, so P3-B4 and P3-B5 move by one. Re-pin them red first.

### 6.4 What was done toward (a) in round 5, and where it is

- Q3-B..Q3-E were drafted as SPEC-behaviour cells, independent of the seam; (b) needs the same cells. Because the
  ruling's order put the inventory first and the inventory serves only (a), they are NOT in the tree. The draft is at
  s11-fc09-scratch\Q3-CELLS-DRAFT.test.fragment.mjs (8205 bytes, ASCII, LF), ready to append red first under whichever
  option is ruled. native-load-import.test.mjs is byte-identical to round 4 (b25059e8).
- The lift-keyed member inventory (section 2 (a)) was enumerated but not coded. It is recorded here for (a''):
  - exercises[].id;
  - exOrder{day:[ids]};
  - queue[].exId;
  - sessionLog entries[].id;
  - retirements and insertions keys;
  - exId at any depth (proposals[].apply.exId, agentProposals[].exId, adjustments exUndo.exId,
    suggestionLog[].apply.exId);
  - ids embedded in opaque strings (q_<id>_inc, "rs"+id).
- lift-correspondence.cjs, today-bindings.mjs, today-entry.mjs and page-bundle.test.mjs: not touched in round 5. Their
  pre3 copies equal disk.

## 7. ROUND 6: STOP. Option (b) as ruled (DECISIONS:881) cannot be finished; the engine binds a record's lift to its spend

The ruling reproduced my section 6.3 item: "the engine requests :1002/:1010, which are handed the resolved lift". That item
is wrong, and it is my error. FC01 (rebuild/engine/native-load.cjs, no byte may move) ties three things together:
- the lift of a decision;
- the lift its spend_id encodes;
- the lift of the state exercise.
Read-time resolution inside FC03 cannot separate them without either rewriting a record or showing FC01 a renamed state.
No product byte was written in round 6.

### 7.1 Evidence: the FC01 contract (read on this seat; native-load.cjs is not one of the protected five)

- :553-554 transition: `ex = s.exercises.find(x => x.id === d.lift_lineage_id)`, else LIFT_UNRESOLVED. The record is the
  decision, so a record naming the document slug never finds the file's exercise. Handing FC01 a copy with the lift
  resolved IS a rewritten record, which round 6 forbids.
- :383-386 compensation (the Undo check): `decoded = decodeSpend(spendId); if (decoded.lift !== lift) RECORD_INVALID intent`.
  The pre-import Yes's spend_id is `["native-load","<slug>",...]` (spendIdOf :148-152). An Undo requested with the
  resolved (file) lift is therefore always refused. :396 then matches consumes by `rootOf(row, lift)` =
  `[start, lift, close]`, which also embeds the lift.
- :512-513 derivable for a compensate record: `target.lift !== d.lift_lineage_id` refuses `compensates`. So an Undo
  record naming the file lift over a slug spend can never apply either.
- :101-105 liftRows and :331 (earn history: legacy rows `e.id === lift`) read the facts and the imported sessionLog by the
  request's lift.

### 7.2 Measured (scratch cell, FC12's own protected-free harness)

The harness is s11-fc09-scratch\make-q3-engine-demo.cjs, which writes demo\fc12-q3-engine-demo.test.cjs: a copy of FC12
with ROOT made absolute and one cell appended. Result: 1/1 ok. Its diagnostic lines:
```
(1) record as written, file-id state:      refused NATIVE_LOAD_LIFT_UNRESOLVED field lift_lineage_id
(2) Undo with the resolved lift:            refused NATIVE_LOAD_RECORD_INVALID field intent
(3) Undo in the record's id space:          offer [compensate]
(4) compensation, lift resolved (a copy):   refused NATIVE_LOAD_RECORD_INVALID field compensates
(5) the same compensation, record space:    applied
```
The file-id state is built the way admission re-keys facts: the entry's lift is re-keyed, the fact's lift is re-keyed,
correspondence_profile is set and logical_set_slot is kept.

### 7.3 What this means for the ruled cells

Join resolution alone (S1, liftOf, consumes roots, captures, sessionOf, queue) probably turns FC09-Q3, Q3-C and Q3-E green,
because the hold lands on the file lift instead of no lift. That is not proven: those cells run only at the PM seat. It
CANNOT turn Q3-B green. The pre-import Yes reaches FC01 as written and is refused LIFT_UNRESOLVED, which is not a hold, so
its spend is not kept and its Undo is refused at :386. So I4 (an accepted response is durable truth) is not met for that Yes.

### 7.4 Corrected design (b'), for a ruling. Nothing built.

1. RESOLVER, as ruled.
   - One closed, refusing map, record lift to state lift, built in lift-correspondence.cjs from the setup document and the
     admitted state, and passed identically by today-bindings.mjs and source-admission.mjs.
   - It is the identity when ids are shared. An unknown or ambiguous lift refuses by name.
2. JOINS, as ruled, at read time:
   - S1 :350 and liftOf :714;
   - consumes roots :482 and :493;
   - startCapture :123-127, and the same cell filter in startPlanCapture :189-200 and startWindowCapture :206-215;
   - captureOf :118;
   - sessionOf :103 (called from correspondence S3, S4 and S8 at :508, :519 and :574, evidenceChanged :634, dayOf :653, refsArm :437 and check :1172 and :1213);
   - checkedCompletion :662;
   - captures in basisOf :323;
   - the queue joins :264, :279, :958, :1040 and :1062;
   - exNow :934 and the exitB rewrite :1036-1040;
   - the conflict and exception lifts :787 and :800;
   - refsArm and dissolvedExit, which compare an authority ref's body lift with the record lift (:447, :745);
   - the RECORD_INVALID owner :923.

   Sites my read found that were not on the ruled list: :118 captureOf (ruled), startPlanCapture, startWindowCapture,
   checkedCompletion, dayOf, evidenceChanged, refsArm, dissolvedExit, :787, :800 and :923.
3. ENGINE BOUNDARY (NOT in the ruling; it corrects my 6.3). Every FC01 call made for a record runs on a record-space VIEW:
   - The calls are the accept and DERIVABLE (:929), the held earn :939, the re-validation :1002 and :1010, the landing
     :1083, and the check path :1193 and :1215.
   - The view is a structuredClone of the state with the ONE state lift renamed to the record's lift over a closed member
     inventory: exercises[].id; queue[].exId; workoutFacts entries and their facts' lift_lineage_id; sessionLog
     entries[].id, keeping the legacy_baseline alias, which structuredClone preserves; plus the rest of 6.4's inventory
     wherever FC01 reads it.
   - It refuses by name if the record's lift already names another state lift.
   - The request lift is the RECORD's lift, not the resolved one.
   - The returned state is renamed back over the same inventory.
   - No record or operation is rewritten.
4. CHECK PATH (an issuance-path hunk; the PM must say whether it is an "ISSUANCE hunk" under D:853 (2) / D-R13L1-2).
   - A compensate intent whose target spend names a corresponded record lift is evaluated in that record's id space, so
     the Undo is issued naming the record's lift and spend. FC01:386 and :513 accept nothing else.
   - With shared ids nothing changes in what is issued. No body that was ever issued changes, and PRODUCER_REVISION does
     not move: it hashes engine files only, and the recomputation is still f4955594... at ab2a1ca8.
   - But check's output changes for a corresponded target, which today is refused RECORD_INVALID intent.

The alternative (c) is an engine grant so that FC01 resolves lifts itself. It needs an owner grant and moves
PRODUCER_REVISION, treeSha256, the s3 entry, FC12 R2 and the port re-seal. Not recommended.

Cascades for (b'):
- FC03 bytes: its S11.json post at S11-REGEN; PRODUCER_REVISION unchanged, confirmed by recomputation.
- lift-correspondence.cjs, today-bindings.mjs and source-admission.mjs bytes.
- page-bundle: lift-correspondence.cjs moves from ROUTE-only to BOOT, so P3-B4 and P3-B5 move by one, re-pinned red
  first.
- FC12 and FA03 unchanged and green: shared ids are the identity map.

## 8. Round 6: (b') built (the PM's round-6 ruling)

Built as section 7.4 with the engine boundary and the Undo under the record's id. Two corrections to 7.4 came from the build:
- the resolver treats an id the state carries as itself (needed on the page, where Edit My Week can rename a lift without
  changing its id), instead of refusing every id collision;
- F9 folds admission's facts as projected, because the re-key splits an entry from its facts.

The joins, the boundary, the mutants and the red-first evidence are in FC09-REPORT.md section 14; the runs are PM-RUN.txt section K.
