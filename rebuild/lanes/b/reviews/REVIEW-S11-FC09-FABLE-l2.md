# REVIEW S11 FC09 round 2 (Fable l2): complete resolved lineage for FC01 checks, exit (b) and the governor (DECISIONS:882)

Reviewer: Fable (blind engine-tier read, round 2; no other review read). Brief pm9-brief-s11-fc09-review-rf.txt as amended.
Head checked: worktree earned-s11-fc09-rf at 22ac52b8a307fb4c5a22c96b0f1cdf41bb6419ba = f6c531b + one commit; `git diff --stat
f6c531b 22ac52b` = 4 files, 501/21 (FC03 71 lines; FC12, native-load-import, legacy-order tests); no engine byte. Read in full:
the FC03 hunk, the three test diffs, DECISIONS:882-883, and the FC01 lines they lean on (native-load.cjs :200-:280, :385-:396,
:438-:453, :553-:671, :674-:689). Hard limits kept as in round 1 (no src/, conform/private, ledger, soak, EarnedPort, app.js;
the protected five never opened or loaded; worktree untouched; scratch only; one node process; MEASURED_TEST_NOW, TZ set).

VERDICT: REJECT, on ONE narrow executed item (B3 below): under a correspondence the re-addressed effect frontier no longer meets
the queue's own spend ids, so a TARGET_QUEUED refusal of a pending pre-import earn carries refs [] where the one-id twin
carries the Yes (SPEC:127 refs rule; the DECISIONS:882 invariant "judges exactly as one id"). Status and code are right, the
shipped page renders no refs, and the fix is one hunk; everything else in K1-K6 holds. If the PM reads a refs-only deviation
that today's page cannot show as outside the :862 bar, the rest of this file is an ACCEPT WITH NAMED DEBTS.

## Runs on this seat (none loads a protected file)
- FC12 rebuild/m4/spec/native-load-options.test.cjs at 22ac52b: 477 pass, 0 fail (69.6 s); R2-REVISION ok (PRODUCER_REVISION
  unchanged), FC09-LINEAGE-IDENTITY, -B1A, -B1B, -B1C (90 cases), -B2, -FRONTIER, -B1B-COUNT, -C5 all ok.
- Scratch probe-tq.test.cjs (a copy of FC12 with ROOT pinned to the worktree, one appended cell; the worktree untouched):
  the B3 counterexample below, executed.
- PM seat files, pass/fail only: r8m M2 6/27 and M3 0/3 red first; r9n N4 477/477, N6 native-load-import 16/16, N2 2/2;
  r8reg B-H green except the page-bundle seat offset (B6) and the by-design EN3 mutants (C1/C2 red, C3 ok); Q3-G red in
  r8reg/B3,G4,H3 is the round-8 state before its expectation change, green in r9n N6; pm-out-callers C1-C4, C6 killed, C5 16/16.
- Round-1 runs still stand (F9 unit 11/11, LOM 14/14 at f6c531b; those files did not move).

## K1-K6
K1 B1a/b/c and B2 paid on every path: YES, with the B3 exception. Every engine call FC03 makes goes through atLift or governed
  (grep: :187/:190 inside atLift, :203-:204 inside governed, callers :1013 sameCut governor, :1064 accept with :1109/:1119/
  :1182/:1190 re-evaluation at the cut, :1263 landing, :1283 end-of-fold governor, :1378 exit (b), :1400 current check; no bare
  engine.at(...).evaluate/apply remains). Under PAIRS the view is inBase(s) (a structuredClone of the facts with every
  lift_lineage_id resolved to the base id; entries, facts, removed facts and capture slots alike, slot keys as written), and
  for a record lift the base names otherwise, lineageView over that. FC01 reads only exercises, queue, workoutFacts and
  sessionLog (round 1), so the re-addressed facts copy is the whole of what it needs; nothing durable moves (baseFacts and
  lineageContext clone; requestOf builds a new request; decisions and ops reach FC01 as written). Per cut: sameCut's governor
  goes through governed, and re-evaluation's withFacts(V, cut) is re-addressed inside atLift. Counterexamples tried: B1a typed
  and host-v1, kept and moved base (B1A row: adopt-observed / PLAN_CHANGED [Close], never COMPLETION_REQUIRED, the new record
  under the base id); B1b with and without the imported prefix (Undo COMPENSATION_DESCENDANTS, exit adopt-baseline under the
  holding Yes); B1c 90 opener/terminal/rep lines equal to the base-addressed facts and the one-id twin, check and governor;
  B2 two hot openers hold the file's lift and the altered-reason record is caught at its cut. The one that failed is B3.
K2 Frontier re-addressed, basis mapped back byte for byte: HOLDS for FC01's reads of the frontier. spendIn maps a
  ['native-load', lift, ...consumes] spend and a ['native-load-compensation', lift, inner] spend (recursively) through `at`,
  which is LK, or the record's own id for its lineage in a record view. FC01's :270 SOURCE_OVERLAP and :328-:358 spent set
  therefore count a pre-import spend for the base id (FRONTIER row: no sighting re-consumed, page = twin), and :385/:395
  find an Undo's target because request.intent.compensate and the frontier are in one space in a record view. Double count:
  two frontier entries can collide after re-addressing only when one lineage spent the same roots under both ids, which
  S18/the overlap check refuse together before either is spent, and :270/:328 read consumes into a Set anyway. Lost: a spend
  spendIn cannot parse is passed unchanged and FC01 refuses it exactly as before (:325). Mapped back: FC01 echoes
  basis = json(request.basis) on both offer and refusal (:674-:682) and copies it into every body (:274/:369/:416), so
  answerOf's json(q.basis) is the same bytes the un-re-addressed call produced; the FRONTIER row pins the issued frontier =
  FC03's spent. What is NOT re-addressed is the queue's native_load_spend/id, which FC01 compares with the frontier at :215-
  :223 only; that is B3.
K3 Q3-G expectation change (EFFECT_CONFLICT naming the Yes, next workout adopt-baseline): RIGHT ON THE SPEC, NOT A TRAP, and
  PLAN_CHANGED is not what the person should see. The pre-import completion has 3 original slots; the file's lift has sets 2.
  SPEC:127 step 2 refuses a set-count change for adoption too (only the WINDOW is earn-only); FC01 :253 refuses PLAN_CHANGED
  inside exit (b), so the exit does not pass and FC03 returns the hold's own refusal, as it does for every failed exit (:1379
  onward; the one-id twin answers the same, B1B-COUNT control). :158 TRAINABLE WHILE HELD then holds: the next card is the
  baseline ask on the file's 2 sets, its completion passes step 2 and is offered adopt-baseline under the holding Yes
  (B1B-COUNT, Q3-G at N6). The hold is named by its refs; the Undo is correctly barred by the captured later Start (:154).
  Nit: the cell still branches on the fixture (fileSets === lifted.length), one branch dead for variant(1); the FC12 row pins
  the count case exactly, so nothing is lost.
K4 Caller mutant C5 equivalent: AGREED, with one coupling named. The entries-only re-key (source-admission.mjs:764-768) moves
  an entry's lift to the id programmeBasis.lift_correspondence names, i.e. correspondence(file, document), the same function
  liftResolver reads; after admission's idCollisions and uniqueness rules the two agree on every id the re-key moves (round-1
  probe: a shared id with another name is a collision, a shared id with the same name maps to itself), and baseFacts then
  resolves every lift_lineage_id in the copy, facts included, so the PERFORMED_ENTRY_INVALID split of round 6 cannot recur.
  The C5 row proves equal fold views and equal checks over 12 forms. Debt: two re-key rules that must stay equal (N3).
K5 Shared ids byte-identical: HOLDS. atLift returns the injected runtime when PAIRS is null (:168), governed calls it directly
  (:203), baseFacts/inBase/spendIn are never built, :1378's atLift(...) is then the former engine.at(...) call; no engine byte
  moved and R2-REVISION is green here. FC09-LINEAGE-IDENTITY ok in my run.
K6 LOM-S6-ADMISSION and LOM-S6-LITERAL: HOLD. The dynamic half now records a real Yes (yesBefore, today-entry's own respond
  path), asserts F9 folded it, wraps the shared module object around attachAdmittedOrder (restored in finally), and checks
  every call: session_log IS the state's log, the anchor is {source digest, this selection id}, the map is the confirmed one,
  and the view still carries no anchor or baseline. LOM-S6-LITERAL walks ONLY rebuild/m3 and rebuild/m4 (roots :786), so src/
  and rebuild/conform/private are never reached; its skip regex drops test, node_modules, .tmp and ledger directories, any
  path containing "soak", test and mutant files, and any app.js. Measured here without listing names: tracked paths under
  m3+m4 matching src/ 0, private 0, ledger 0, app.js 0, soak 16 (skipped by the regex); on disk, directories named src,
  private or ledger under m3/m4: 0, files named app.js: 0. The pre-existing callers() (LOM-S6/-ADMISSION) does not skip soak
  paths; it reads them for a symbol only and is not this change's byte (N5).

## BLOCKING
B3 (executed; genuine records; one hunk). Sequence: on the phone, two completions of a lift and the earn Yes FC01 offers on the
  second (landingScenario: cs, resp); then an import whose file names that lift by another id and keeps its working weight
  (lineageArgs({pre: cs, extra: [resp]}), base imported(F0()) unmoved); the fold applies the Yes (no issue) and the queue
  carries {exId: fx-file, state DEBUT, native_load_spend: '["native-load","fx-press",...]'} - the spend in the RECORD's id
  space, which lineageBack keeps by design. Now a current check on either pre-import completion under the file's lift
  (route A "Check next weight" while the debut pends): FC01 :215-:223 finds the pending entry and reads its refs from the
  frontier by spend id, but requestOf has moved that frontier spend to ["native-load","fx-file",...]. Output: page
  {code: NATIVE_LOAD_TARGET_QUEUED, refs: [], field: null}; the one-id twin (sharedTwin, same history under fx-press):
  refs [{op_id: fx-resp-1, ...}]. SPEC:127: refs = the queued effect's authority Refs, [] only when the frontier LACKS the
  effect; here FC03 wrote it. Scope: status and code are right, and today-entry.mjs:207 shows {lift, code} only, so no screen
  changes; FC03 does not read these refs. Fix inside the ruled design, no engine byte: in inBase (or a queue counterpart),
  re-address queue[].native_load_spend and queue[].id of a corresponded lineage into the view's space as spendIn does for
  the frontier, and map them back in lineageBack (FC01 writes the queue only through these two members at :572, :600, :661,
  :666); or re-address the frontier only for :270/:328/:385 by leaving spends whose lineage the queue names as written.
  Either way the B1B-COUNT, FRONTIER and IDENTITY rows must stay green, and a row should pin refs = twin's refs.
  Repro: earned-s11-fc09-rf-scratch\probe-tq.test.cjs cell FABLE-L2-PROBE, output in run-probe-tq.txt.

## NAMED DEBTS
N1 As carried at DECISIONS:882 (unknown lift-keyed map, post-import rename without a writer, D-S11-FC10, D-S11-EN3-COPY,
   the admission view workout_facts split, F9 superseded-only refusal, resolver refusal on two setup ops).
N2 A refusal's `basis` under PAIRS is json(request.basis) even when FC01 would have returned the same; no byte difference
   today (:676), named only because answerOf now owns that member.
N3 Two re-key rules that must agree (admission's entries-only liftAttach and liftResolver, K4); a future change to either
   needs the C5 row to stay in the gate.
N4 Q3-G and Q3-D branch on fixture state; the dead branch is unmeasured on the real page path (FC12 rows cover both).
N5 callers() in legacy-order.test.mjs reads soak paths under m3/m4 for a symbol (pre-existing at 84f8421, not this change).
N6 Round-1 debts N2 (F9 'applied' label for a superseded-held spend), N6 (runbook: PLAN_CHANGED on a pre-import completion
   after a moving import), N7 (B-LOM reopen law), N8 (no-queue file) stand unchanged.

## What I did not verify
- No admission-loading cell was run here (Q3-F/G/H, LOM-S6-ADMISSION, LOM-S6-LITERAL); judged statically plus the PM's
  pass/fail files. LOM-S6-LITERAL's exact expected literal set (check.cjs 1, engine-order.cjs 1, legacy-order-mapping.cjs 2)
  was not recounted by me.
- The FC03 site, base-view and boundary mutants (31 + 20) were not re-run; K1's "every path" rests on the grep above and the
  rows, not on mutants of my own.
- Whether any OTHER FC01 comparison of a queue spend against a frontier spend exists beyond :215-:223 was checked by grep
  (effect_frontier, native_load_spend) only.
- Byte-identity of FC03 output against f6c531b for shared ids is static plus IDENTITY, not a two-tree differential.
