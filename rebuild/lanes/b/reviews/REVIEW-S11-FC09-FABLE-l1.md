# REVIEW S11 FC09 (Fable l1): the native-load Yes through local admission (F9), the train-then-import seam, lift correspondence

Reviewer: Fable (blind engine-tier read; no other review read). Brief pm9-brief-s11-fc09-review-rf.txt.
Head checked: worktree earned-s11-fc09-rf at f6c531b1032fa9967984736ed866a6bcfbda6a29 = 84f8421 + one commit; `git diff --stat
84f8421 f6c531b` = 20 files, 2316/147. Read in full: the builder's FC09-REPORT.md (1095 lines), DECISIONS:877-881, SPEC lines
:11, :121-:128, :151-:158, :175-:177, :185, :228, the whole product diff (FC03, lift-correspondence, legacy-order-mapping,
native-load.cjs:443, source-admission, today-bindings, native-load-replay, replay-registry, production-mapping) and the cells
named by the brief. Hard limits kept: no src/, conform/private, ledger, soak, EarnedPort, app.js; none of the protected five
opened or loaded; worktree untouched; scratch only in earned-s11-fc09-rf-scratch; one node process at a time,
MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York.

VERDICT: ACCEPT WITH NAMED DEBTS. No problem reachable from genuine use was found in the change itself; every J1-J8 claim
holds on the code or the spec as read below. The debts are listed with one line each; none needs a product byte before merge.

## Runs on this seat (none loads a protected file)
- rebuild/m4/import/test/native-load-replay.test.cjs: 11 pass, 0 fail.
- rebuild/m4/workout/test/legacy-order-mapping.test.cjs: 14 pass, 0 fail (LOM/12, LOM/13 included).
- rebuild/m4/spec/native-load-options.test.cjs (FC12): 470 pass, 0 fail, 85.7 s; R2-REVISION ok (PRODUCER_REVISION
  f4955594 reproduced from bytes), FC09-LINEAGE-IDENTITY, -BOUNDARY, -RESOLVER, -REFUSED, -S31 and every S-site cell ok.
- scratch probe-resolver.cjs over liftResolver: real-shape-like admitted state gives exactly the corresponded pairs; identity
  before any import, with no document, and after an Edit-My-Week rename; the "ambiguous" arm is reached only by a list that
  admission's idCollisions already refuses (collisions2 = ["hack-squat"]).
- PM seat results read pass/fail only: pm-out-r7reg B3 13/13 (native-load-import, FC09-Q3..Q3-E green), B1/B2/B4/B5 green,
  D1-D8 green, G1-G7 green, H1-H4 green, C1/C2 red + C3 ok (EN3 mutants), B6 P3-B2/P3-B5 red (the declared seat offset);
  pm-out-callers C1-C6 each killed by the named cell; pm-out-r7l L2/L3 = the S31 red-first against the K FC03, L6 470/470.

## J1-J8
J1 FC09-Q1-A, offer -> NATIVE_LOAD_PLAN_CHANGED: RIGHT ON THE SPEC, NOT WEAKENED. The checked completion is pre-import; its
  Start captured the first-run card, the import replaced that lift's working weight (the cell now PINS that precondition,
  importedW !== captured). SPEC:127 step 2 refuses before step 3 can adopt ("an older completion cannot silently replace a newer
  athlete choice"), and SPEC:185 gives refs [Close Ref] alone when no authenticated plan op carries the change; an import is a
  source change, not a plan op. The cell asserts status refused, offers [], code, refs exactly [that Close], field null, AND
  keeps performedIssues(p) === [] (the regression it exists for). Q1-D proves the next completion on the imported basis is
  offered (adopt-observed, SPEC:128). Owner-visible cost, inherent in the spec: "Check next weight" on a workout saved before
  the import offers nothing once the import moved that lift; the runbook does not say so yet (debt N6).
J2 FC09-Q3-D and the "hold" box: VERIFIED STATICALLY. gym-model.mjs:366 fills the load box only with a finite captured load
  value; :253-256 documents "prints NOTHING rather than a guess"; :502-506 ENTER_PERFORMED is a form bound on an empty box.
  `git diff --stat 84f8421 f6c531b -- gym-model.mjs engine-capture.cjs progression.cjs performed.cjs` is EMPTY, so the empty
  box under a configuration working load ('hold', variant(1) hack) is the same at 84f8421: PRE-EXISTING, not FC09's. The
  cell's corrected notion (planVector's numeric planned load, else no defect) is the right reading; the held-lift branch
  (card null, one adopt-baseline, current all null) is SPEC:156 UNPROVABLE ORDER + :158 TRAINABLE WHILE HELD exit (b),
  and the unheld branch is the round-5 assertion. Two nits, not blocking: the branch is chosen from the page's own fold
  (one branch is dead for a deterministic fixture, and which one is only printed), and `planned()` treats the slot position
  as 1-based (`Math.min(position, len) - 1`), which only loosens the guard toward ex.w.
J3 FC09-LINEAGE-BOUNDARY swap: ACCEPTABLE, the trade-off is a NAMED DEBT. The K rule refused any string equal to the base id
  and hit the owner's real file (mg 'abs' beside lift 'abs'), which would have refused every Undo view of the corresponded
  Yes: a real regression the swap removes. The new rule refuses a lift id under a lift-reference NAME (exId, lift_lineage_id,
  liftId, lift_id, exerciseId, exercise_id, lift) outside the renamed list and leaves a mere equal string alone. What FC01
  reads is closed and all of it is renamed: native-load.cjs touches only exercises, queue, workoutFacts, sessionLog (through
  performed.cjs) and feed by NAME (_deriveSightingFull/_volDeltas via _formerNames), and writes only exercises and queue;
  lineageBack refuses any other member changing. So an unlisted lift-KEYED map cannot change FC01's answer today; the
  uncaught case is a future reader. Machine settings are op-only (machine-settings-commands.cjs), never a state member.
J4 Issuance: ADDRESSING, NOT A CHANGE OF WHAT A PERSON IS SHOWN OR CAN DO. (a) The Undo of a corresponded spend evaluated and
  issued under the record's id (evalLift; undoSpend = ['native-load-compensation', record lift, spend]) is forced by FC01
  :386/:513 (request lift must equal the lift its spend_id encodes); the page shows the base lift (shownLift); the compensate
  then folds through correspondence (raw body lift at :598, sameLift at :606) and the engine boundary. (b) capture_sha256 now
  covering pre-import captures of the same lineage: FC03:517 only checks presence; native-load.cjs never reads it; nothing
  compares it. (c) An exit (b)'s authority_refs naming the hold on the file's lift: at 84f8421 that record was RECORD_INVALID
  on lift null and blocked every check, so no exit existed; the refs are what :155/:158 require of a genuine exit. With shared
  ids all three are byte-identical (J8). The FC03 PRODUCER_REVISION move is the ruled constant only (:1425); issuanceFor is
  byte-unchanged (:1405-1409).
J5 S21 (overlap) equivalent: AGREED, by static proof. `spent` is filled only from accept groups (FC03:1072, :1096, :1154,
  :1174), all members of `all`; S18 (:920-921) flags every pair of groups with sameLift AND sameRoots BEFORE events, and
  flagged groups never enter `events` (:936 filter !conflict). A root is [start, lift, close] or ['legacy', day, lift], so
  root equality under rootKey implies sameLift; the raw and resolved checks at :1007 therefore agree on every state the fold
  can reach. The only divergence needs a malformed, non-3-tuple root string shared by two groups of different lifts, which
  structural()/S3 refuse first. Keeping the resolved guard is harmless.
J6 LOM-S6-ADMISSION: GATED AS CLAIMED. source-admission.mjs:816 `compose = orderMap ? ... : s => s`; M is built only in the
  `mixed` branch (:857-858) by order.confirm, whose mapFor refuses ORDER_EVIDENCE_REQUIRED unless answer === true
  (local-source-order.cjs:27) and writes assertion.answer true, or restored from a recorded selection; attachAdmittedOrder
  re-runs confirmedMap on the identity (profile, five SHARED fields, digests, native_root_id, strict-true assertion) and
  refuses an empty selectionId. `git grep` over non-test m3/m4/coach/client: attachAdmittedOrder has one caller
  (source-admission.mjs:816); createLegacyOrderMapping( has one (today-bindings.mjs:481); `.attach(` one (:491); no other
  legacy_baseline writer. The stamp goes on the copy FC03 hands the engine and is never written to the view. LOM-S6 is
  byte-unchanged (legacy-order.test.mjs: 30 insertions, 0 deletions).
J7 workout_facts address split: NOT REACHABLE FROM GENUINE USE; NAMED DEBT (D-RS-R1-n5 area). `git grep workout_facts` over
  non-test product finds only the writer (source-admission.mjs:890). The re-keyed facts feed the interpretation digest and
  the order input; the engine receives projectedWorkoutFacts (:759) in F9 and the page projects its own log. Nothing else
  reads them.
J8 Shared-id bytes identical and PRODUCER_REVISION: HOLDS. Static: with PAIRS null LK is the identity, sameLift is ===,
  sameRoots reduces to the former includes, atLift returns the injected runtime, lineagePairs(undefined) is null, evalLift
  equals lift, basisOf/missedQ/sessionOf get the same value as before; liftOf/owner/refsArm rewrites are value-identical;
  the page's resolver yields pairs {} (-> null) before any import. Measured: FC09-LINEAGE-IDENTITY ok in my FC12 run;
  R2-REVISION ok, so f4955594 is the recipe's own value over the ab2a1ca8 engine (native-load.cjs:443 is the only engine
  hunk, structuredClone as :98/:303 already use).

## BLOCKING
None found. Sequences I executed or walked statically without finding a reachable fault: Yes then import (held with Undo,
T5/PM); import then Yes (T2/WO2); real-shape Yes on a corresponded lift, Undo on the file's lift (Q3-B, PM green); import
then train then check (Q1-D); decline writes nothing (today-bindings.mjs:749 returns dismissed before any write), so no
naked decline reaches F9; a pre-import captured lift the file lacks is refused `capture_lift` (source-admission.mjs:641-642)
before any Yes could be left lift-less; uncorresponded document lifts are appended retired (:492-500), so their ids stay the
state's and resolve to themselves.

## NAMED DEBTS (one line each; hand-built records, future readers, or pre-existing law)
N1 D-S11-FC10 and D-S11-EN3-COPY, as declared (portable receipt path; bare code on the Import screen).
N2 F9 outcome label: a spend kept after its hold was superseded by an exit (b), or a landed earn, reports `applied`
   (entry present, no active issue); label in the interpretation digest only, never shown. (native-load-replay.cjs fold)
N3 Engine boundary detects a leftover lift id by NAME only; an unlisted lift-KEYED map is not caught (J3); FC01 reads none.
N4 Admission view.workout_facts entry/fact address split stays (J7); no product reader today.
N5 FC01's NEW-check readers (liftRows :105, :331) join by exact id, so after a real-shape import the phone's pre-import native
   rows on a corresponded lift do not count toward that lift's sighting history under the file id; pre-existing at 84f8421
   (same FC01, and with a Yes it was wholly blocked), engine byte, outside this grant; adoption and the records' own joins
   are unaffected. Worth a PM line because the (b') principle stops at FC01's door.
N6 P3-RUNBOOK pre-check 8 keeps the conditional run gate and says "nothing is lost"; it does not tell the owner that a pre-
   import completion checked after an import that moved the weight is refused PLAN_CHANGED (J1); owner's wording.
N7 Q2 as the builder names it: a reopen of a selection recorded with no order map after native training refuses
   LOCAL_SOURCE_ORDER_MAP_REQUIRED (source-admission.mjs:851-852); unchanged B-LOM law, reached only from the Import screen's
   reopen, not FC09's.
N8 Q4: a file state with no `queue` array makes FC03 refuse field `base` and F9 refuse the import only when a Yes exists;
   the old app's state always carries a queue and the gym card would fail on such a state anyway.
N9 Admission's compose throws on a LEGACY_ORDER_MAPPING_UNPROVEN where the page's nativeRead swallows it; inside the fold a
   throw is contained per record (RECORD_INVALID payload, a hold) or turns sameCut false; with M confirmed and anchor-less
   admission facts no genuine input reaches it, and Q1-E/Q3-E pin parity.

## What I did not verify
- No admission-loading cell was run here (T1-T5, Q1-*, Q3-*, LOM-S6-ADMISSION, writer-order, page-bundle); judged
  statically plus the PM seat's pass/fail files.
- S21 and the FC03 site/boundary mutants were not re-run by me; J5 is a static proof, the rest rests on the builder's
  mutants-fc03-sites.txt as reported and the PM's caller-mutant summary.
- Byte-identity of FC03 output between 84f8421 and f6c531b was proved statically and by FC09-LINEAGE-IDENTITY within the new
  module, not by a two-tree differential run (that would have meant copying the protected five into scratch).
- fold_digest stability of one source across a reopen on a LATER day (currentDay() feeds the trend day reader's clock);
  T2 proves repeats on one day. If it moves, reopen refuses by name rather than mis-folding.
- The s11-supersede suites, S11.json posts and page-bundle absolutes (B6) are stale by declaration until S11-REGEN; not judged.
