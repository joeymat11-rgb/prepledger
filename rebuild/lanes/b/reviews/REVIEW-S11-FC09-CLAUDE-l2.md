# REVIEW S11 FC09 round 2 (22ac52b: resolved lineage for FC01 checks, exit (b) and governor)

Reviewer: Claude Opus 5.5, blind engine-tier seat, second read (same brief and hard limits). No other review read.
Head checked: worktree earned-s11-fc09-ro, HEAD 22ac52b8a307fb4c5a22c96b0f1cdf41bb6419ba = f6c531b + one commit
(FC03, FC12, native-load-import.test.mjs, legacy-order.test.mjs; `git diff f6c531b 22ac52b` read in full). Builder
report sections 16-17 and DECISIONS lines 882-883 read; PM SUMMARY files pm-out-r8m, r9n, r8reg, callers read
(pass/fail only).

VERDICT: REJECT

The round-2 FC03 work is sound: my mixed-id twin differential found no disagreement in any verdict, offer, Undo or fold.
I REJECT for one item reachable from genuine use (B1 below). Its root is the round-6 page change in f6c531b, not this
commit, and I missed it in round 1. It is a small fix in the page, not in FC03.

## What I ran (this seat; MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York; one node process at a time)

- FC12 native-load-options.test.cjs: 477/477, including FC09-LINEAGE-B1A, -B1B, -B1C, -B2, -FRONTIER, -B1B-COUNT
  and -C5.
- K5, SHARED-ID DIFFERENTIAL rerun: wrapper scratch diff-fc03.cjs, 22ac52b FC03 against 84f8421 FC03, driven by a
  copy of the current FC12. 38,054 calls compared, 596 skipped (non-empty correspondence). 2 mismatches, both the
  call-count-stateful containment cells R30/R31 (same offsets as round 1). Every other call is byte-identical once
  the revision string is normalised.
- K1, MIXED-ID TWIN DIFFERENTIAL (new; scratch probe-twin.cjs appended to a copy of FC12, reusing its helpers):
  - Random walks of 1-3 pre-import workouts under the document id, with Yes answers given on the phone, then an
    import naming the lift by the file id. The base is kept, moved to 102.5 or 105, or changed to 2 sets.
  - Then 0-3 post-import workouts, numeric or baseline-ask cards, with Yes answers issued in each world.
  - World P is the page form (lineageArgs); world T is the same workouts under ONE id with no import (sharedTwin).
  - Compared: every check of every completion (verdict, kinds, consumes, targets), the Undo of every spend, and the fold
    (w, wSets, holdFlag, sets, last, wAt, own, std, topRun, topAt, authority, queue, issues with refs and
    supersession, effects, spends).
  - Three seeds, 3,500 walks: 16,710 checks, 2,969 Undo checks, 3,500 folds, 2,935 Yes answers recorded. They hit 755
    EFFECT_CONFLICT holds (97 superseded by an accepted exit (b)), 109 governor holdFlag=true and 14 adopt-baseline
    offers.
  - Result: 0 differences, except one class: NATIVE_LOAD_TARGET_QUEUED refs (1,484 cases; see K2).
- Probes (scratch probe-tail.cjs): REVIEWER-PROBE-TQ, and REVIEWER-PROBE-UNDO-LIST for the Today listing in B1 below.

## BLOCKING

B1. Today never lists the Undo of a pre-import Yes on a corresponded lift whose base the import kept.
Reachable from genuine use: the owner's file names lifts by short handles.

Exact sequence:
1. On the phone, tap Yes on Today: adopt-observed, or an earn, on lift `d` (document slug).
2. Import a file that names the same lift `F`, with the same working weight the Yes was issued on.
3. Before training, tap "Check next weight".

Mechanism (static, file:line exact):
- FC03 folds the Yes as applied or queued (not held). Its effect's spend_id names `d`.
- today-entry.mjs:215-216 takes the Undo's lift from `JSON.parse(e.spend_id)[1]`, which is `d`.
  The spent loop at :222-225 does the same.
- today-entry.mjs:227 then looks for `projected.lifts.find(l => l.lift_lineage_id === lift && l.normal)`.
- Since f6c531b, today-bindings.mjs:697-700 keys project().lifts by shownLift, the BASE id `F`. So no row matches,
  and :228 `continue`s.
- Only a HELD Yes is listed: its issue carries lift `F`, and :219 overwrites the map entry.

Executed (FC03 level, today-entry's listing logic emulated over the real fold):

| case | fold | listed by the page form | listed by one id | direct check (FILE, compensate) |
|---|---|---|---|---|
| adopt-observed, base kept | effects [adopted fx-press], w 105 | false | true | offer [compensate] |
| earn, base kept | effects [queued fx-press] | false | true | offer [compensate] |

So the Undo exists and spec :153/D9 says to list it, but the person is never shown it. The queued case is the
plainer harm: the debut card at the agreed weight comes next, and its Undo is never shown before that Start captures
it. Not a trap (training continues), but an offered choice is lost.

Fix (one place, no FC03 byte): give the D9 listing the shown lift. Either project() returns effects and spent with
shownLift, or today-entry maps the spend's lift through the host. Then pin it with a real-page cell: Q3 with the file
keeping the weight, Undo listed by `check()` from the controller.

## Judged by name

K1 B1a/b/c and B2 paid on every FC01 current-check, exit (b) and governor path, full fold and per cut, with nothing
durable rewritten: AGREE.
- atLift now runs every FC01 call under a correspondence on inBase/baseFacts. That is a structuredClone of the facts with
  each lift_lineage_id passed through LK, and a renamed record view on top.
- The exit (b) evaluate at :1378, the check at :1400, accept, landing and both governor calls (governed, :1013 and
  :1283) all route through it.
- Ops, captures, records, slot keys and correspondence_profile are untouched.
- The returned state takes every non-exercises/queue member from the input (lineageBack), and governed hands back the
  caller's facts.
- Executed: the twin differential above (0 differences across checks, Undos and folds, held and unheld, exits
  accepted, governor holds). Records are present-revision, so the cut governor (sameCut) is exercised by re-validation.

K2 Frontier re-addressed, basis mapped back: no spend is counted twice. One loss, invisible on the page.
- No double count: 0 consumes or verdict differences in 16,710 checks, and FRONTIER is green.
- answerOf replaces the evaluation's and each offer body's basis with json(request.basis). FC01's other body members
  (spend_id, consumes, compensates) are built from the view and the raw intent, and they agree with the twin.
- LOST: TARGET_QUEUED refs. FC01 (native-load.cjs:221-223) matches the state queue's RAW `native_load_spend` against the
  RE-ADDRESSED frontier. A queued pre-import earn (spend under `d`) checked on `F` therefore answers refs [] where one id
  answers [the Yes] (REVIEWER-PROBE-TQ; 1,484 cases in the walks).
- Spec :127 names refs = the queued effect's authority refs; [] is only for a frontier that lacks it.
- today-entry reads only the refusal code, so nothing shown changes: named debt N1. Fix inside atLift: re-address
  queue[].native_load_spend in the view, or leave frontier ids raw for that match.

K3 Q3-G / B1B-COUNT (EFFECT_CONFLICT naming the Yes; next workout adopt-baseline): NOT A TRAP, and identical to one id.
- The one-id twin with the count changed after the workout gives the same refusal.
- The next workout on the held baseline-ask card is offered adopt-baseline with the hold's authority (FC12 cell green
  here). So the person has a way out.
- On the code: :161 makes exit (b) "adopt-baseline, and only that". :127 step 2 names PLAN_CHANGED for a set-count
  change. :163 says an exit-eligible completion refused for a reason of its own shows that reason, "never the hold's
  own code" (stated for the domain refusals).
- Read together, PLAN_CHANGED [Close] is the more faithful presentation. EFFECT_CONFLICT comes from FC03:1378-1388,
  which predates FC09 and applies with or without an import. So this is the PM's presentation call, not an FC09
  defect: named debt N2. Neither code traps.

K4 C5 equivalent: AGREE.
- Admission's re-key moves only entry ids, through programmeBasis.lift_correspondence. That map equals the resolver's
  pairs: the round-1 argument holds, an appended document lift cannot share a corresponded name, and idCollisions
  refuses the rest.
- Under any non-null PAIRS, FC01 reads baseFacts, which normalises every lift_lineage_id. FC03's own lift reads go
  through sameLift/LK; my grep of the raw `lift_lineage_id` sites finds only record-lift uses, sessionOf calls and the
  exported completedLifts.
- F9 drops workoutFacts from its digest, and FC09-LINEAGE-C5 (12 cases, green here) pins it.
- Caveat: it is equivalent only while every FC01 call goes through atLift. A raw call added later would make C5
  observable again.

K5 Shared ids byte-identical to 84f8421 FC03: CONFIRMED (38,054 calls, above). With PAIRS null, atLift, inBase and
governed return the raw runtime and state.

K6 LOM-S6-ADMISSION and LOM-S6-LITERAL: the stamp is executed with a real Yes and the call is observed through the
shared module object; the CJS default import is the same object, so the seam is real (b-lom 20/20 at the PM seat; not
run here, it loads admission). LITERAL closes my N1 for object literals.
- Its skip regex `(^|\/)(test|node_modules|\.tmp|ledger)(\/|$)|soak|\.test\.(c|m)?js$|-mutants\.(c|m)?js$|(^|\/)app\.js$`
  skips soak (any case, anywhere), `ledger` as an exact path segment, and app.js. It does NOT exclude `src/` or
  `conform/private`.
- conform/private is never reached: the roots are rebuild/m3 and rebuild/m4 only.
- A `src` directory under those roots would be read. I did not list the tree to find out (hard limit).
- The pre-existing callers() helper has the same gap.
- Named debt N3: add `(^|\/)src(\/|$)` and `private` to both skips. The PM seat should state whether such a directory
  exists.

## NAMED DEBTS

- N1 TARGET_QUEUED refs [] for a queued pre-import spend checked under a correspondence (K2); not shown by the page.
- N2 Exit (b) on a completion whose set count the import changed shows EFFECT_CONFLICT [Yes], not PLAN_CHANGED [Close]
  (K3); pre-existing FC03 presentation rule, PM call.
- N3 LOM-S6-LITERAL and callers() do not exclude src/ or private by rule (K6).
- N4 Every FC01 call under a correspondence structuredClones the whole facts (inBase) and, for a renamed record, the
  state too: cost only, linear in history.
- Carried from round 1 and DECISIONS:882 (unchanged): boundary fail-open for unlisted lift-keyed maps; view
  workout_facts split; F9 superseded-only refusal; resolver refusal on two setup ops; D-S11-FC10; D-S11-EN3-COPY.

## What I did not verify

- Cells that load admission, the page or the port harness (native-load-import Q3-F/G/H, b-lom, local-source-admission,
  writer-order, page-bundle): static plus PM SUMMARY. pm-out-r9n: N4 FC12 477/477, N6 16/16. pm-out-r8reg is green
  except Q3-G (pre-change), the B6 seat offset and the by-design EN3 mutants. pm-out-callers: C1-C4 and C6 killed,
  C5 survives (claimed equivalent).
- B1 on the real page: the listing logic was emulated over FC03's real fold, and the page lines were read, not run.
- Host-v1 or imported-prefix variants inside my random walks (the builder's B1C/B2 cells cover them and pass here).
- The owner's real file.
