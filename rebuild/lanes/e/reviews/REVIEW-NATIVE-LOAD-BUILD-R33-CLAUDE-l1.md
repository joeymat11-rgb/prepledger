# REVIEW NATIVE-LOAD BUILD ROUND 33 (engine tier), Claude l1

Reviewer: Claude (Opus), commissioned by the Earned PM (DECISIONS:866); blind; engine tier; new bar

Object sha256 (measured twice, before and after the 2026-10-02 bridge drop; worktree %TEMP%\earned-nlr, HEAD bd7654a, uncommitted):
- FC01 rebuild/engine/native-load.cjs dd197849fe92a493dee86ed7c530bdc9e1c22d382004fa4ee6c04968de7e0a73
- FC03 rebuild/m4/workout/native-load-effects.cjs 371154a9caceeda8c0c642bf4c14b07a33c7e441f37fbe4c7b16004dba410ef7
- FC12 rebuild/m4/spec/native-load-options.test.cjs 19f642e826b5fd07d745d832049fc409e40d9ab57b894f3cde53f3dcbe29ad4f
- FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs eb3693000e8349c78c83ed8fb4deddc23901153bd12e24bb1fef4dad5849b752
- report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md 8a4d79c0ad4537f96d2f9d655354b6892ba09d1075141f69162cf891c0779c9b
- spec 7ef8291:rebuild/coach/NATIVE-LOAD-SPEC.md eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb (cmd /c git show)
- round-32 parents used for diffs and swaps: %TEMP%\nlr-r33-scratch\fc01-head33.cjs e589d0fc..., fc03-head33.cjs 698eb366... (exact)

VERDICT: REJECT (blocker B-R33C-1; named debts D-R33C-1..6)
REQUIRED CHANGE: yes (B-R33C-1: FC03 fold bytes, a FOLD-ONLY change under R9.13 (ii); no revision move implied)

## B-R33C-1 PRODUCT, reachable from genuine use on the real durable host (pre-existing: the round-32 bytes give the same output)
A genuine yes is refused NATIVE_LOAD_RECORD_INVALID field `issuance` (consent lost, nothing applied) after a LATER set
removal that the real host writes. Spec :155 ORIGINAL CUT: re-evaluated "only when today's reconstruction reproduces its cut (...
exact fact-op coverage); a later edit never revokes it"; D-R9-1: a removal after the yes "remains BASIS_REPAIR_REQUIRED ... never
RECORD_INVALID". Every op is written by the real gym model, public client and native-load host (FA03's stack, today-bindings):
- Seed 34175 (walk-host.test.mjs): D2 press at 45, YES adopt-observed, later Undo of that adoption; D3 YES demo-row earn; D4 reps 12
  (saved-set Undos and re-logs), Finish, Check, YES demo-press earn; then remove a D4 demo-row set and a D2 demo-press set ->
  RECORD_INVALID issuance [the D4 earn's response] (full trace in walk-w3.json).
- Seed 33329: D1 reps 12 (one set Undone on the saved-set screen and re-logged), Finish, correct D1 row set 1; D2 reps 10, Finish,
  correct D2 row set 1 and D1 press set 1; D3 reps 10, Finish, correct D2 press set 2, REMOVE D1 press set 2; D4 reps 12 (a row set
  skipped), Finish, Check -> earn offered for demo-press, YES (consumes D3, D4); then REMOVE D3 row set 1 (another lift, inside the
  cut) -> RECORD_INVALID issuance.
- Seed 33204: D1 reps 10, Finish, remove D1 row set 2; D2 press at 45 over the 40 card, Finish, YES adopt-observed, remove D1 press
  set 1 (-> BASIS_REPAIR_REQUIRED, as specified); D3 at 45 reps 12 with two saved-set Undos and re-logs, Finish, YES earn (consumes
  D3); then REMOVE D2 press set 1 (an earlier, unconsumed session inside the cut) -> RECORD_INVALID issuance.
- Frequency: 3 of 480 host-walk seeds (33101..33340: 33204, 33329; 34001..34240: 34175). The round-32 FC01+FC03 swapped in
  (swap.cjs) give the identical refusal on all three (on 33204 also FC01-only and FC03-only swaps): not a round-33 regression.
- Cause (measured): a dump at FC03:1015 shows the re-evaluation at the "reproduced" cut refusing NATIVE_LOAD_PROVISIONAL [checked
  Close] (dump-33329.jsonl, dump-33204.jsonl). FC03 sameCut (:825-845) checks coverage only for slot.fact (the LIVE fact and its
  edit ids) and skip ops. A set removed after the yes moves its fact into slot.removed_facts, so neither it nor its tombstone is
  checked and the cut counts as reproduced; factsAtCut (:91-96) then gives the evaluator today's slot states (the set removed).
  In-memory probe (probe-fix.json): counting every removed fact and its edit ids in that loop turns all three seeds green (the walk
  then runs each seed to its end). A correction does not trigger it (its edit id sits on the live fact). Minimal two- and
  three-session host sequences I built (probe-min.test.mjs Z/U/S, 30 variants) did not reproduce it: the evaluator must read the
  removed set (a pre-current session or the comparator) for the outcome to move.
- Coverage: FC12 441/441 and FA03 103/103 stay green on the head; no row removes a non-evidence fact inside a record's cut.

## The decisive question: can genuine use reach D-R33-1 and its variants? (probe-host.test.mjs, the real host; out\h1.txt)
- When the yes can be given: every set logged, session OPEN: Check writes nothing, offers nothing (phase refused, 0 ops). After Finish
  the same Check offers demo-press adopt-observed. Every offer consumes a completion with a normal Close (S3, :155): a yes exists
  only after the consumed session is closed.
- After the yes, same day and next day, every host write path into the consumed slot: gym.logSet -> WORKOUT_ALREADY_CLOSED;
  prepareWorkoutContinuation -> WORKOUT_ALREADY_CLOSED; gym.finish, gym.closeUnfinished -> WORKOUT_ALREADY_CLOSED. GUARD:
  rebuild/m4/workout/continuation.mjs:30 `if(target.projection.close_records.length)fail('WORKOUT_ALREADY_CLOSED')`, reached by
  public-client.mjs prepareWorkoutContinuation, the only route to executeResumedWorkout set/skip/close. Removing the ACTIVE fact:
  prepared and committed (1 op). Undo of that removal: prepareWorkoutEdit(tombstone) -> WORKOUT_EDIT_TARGET_UNAVAILABLE (GUARD
  public-client.mjs:333-335: the target must be a session-set fact of projection.facts); editing the removed fact ->
  WORKOUT_EDIT_INTERPRETATION_REQUIRED (GUARD :338, fact.included!==true); gym.undo of either -> the same codes. Refused attempts
  wrote 0 ops. No host path writes, after a yes, a re-log, a skip, any new fact, or an undo of a removal into a consumed slot.
- Re-log BEFORE the yes (open session: log, saved-set Undo, log again; Finish; yes): the evidence names the live re-logged fact
  (performed, edits 0); the yes applies (w 45, no issue); a later removal -> BASIS_REPAIR_REQUIRED, consent kept.
- Reader level (rvw-walk.cjs inserted in FC12 in memory; the REAL edit-history reader; slots derived exactly as engine-history.cjs
  :107-117 and project-history.mjs:42-43; FC01 issues through FC03 check; FC03 folds), slot 1 of a one-lift C1, R1 = R2 in every row:
  (a) D-R33-1, yes / remove F1 / re-log F2: RECORD_INVALID evidence, w 100, not spent. (b) skip after the yes (remove F1, skip):
  consent kept + BASIS_REPAIR_REQUIRED, w 95. (c) two live (remove F1, re-log F2 in the open session, yes, undo the old removal):
  slot unresolved, RECORD_INVALID evidence. (d) yes / remove / undo that removal: kept + REPAIR. (e) yes / remove / undo / re-log
  (two live): RECORD_INVALID evidence. (f) yes / remove F1 / re-log F2 / remove F2 (two removed): kept + REPAIR. (g) control,
  yes / remove: kept + REPAIR. Only (a), (c), (e) lose consent, and each needs a post-Close new fact or an undo of a removal.
- Ruling on reachability: (a), (c), (e) are reader-admitted, not host-writable -> NAMED DEBT D-R33C-1 with the guards above.
  Not measured: a second device that still holds the session open writing into it after this device's Close (no sync harness).

## (1) PRODUCT (read before the report; diffs against the round-32 parents: FC01 +6/-1, FC03 +26/-5)
- FC01 evidenceOf: `slot.fact || removedFact(slot)`, removedFact only for no live fact, state removed, exactly one removed fact:
  original = that fact's Ref, edits = its edit Refs, current null. Conforms to :109 ("original is its fact/skip Ref"). No string,
  template, reason or copy changed in either file (hunks are code and comments only).
- FC03: S4 binds `state` to the authentic fact after exactly the listed edits (all listed: the typed slot's state, `removed` for a
  named removed fact; none listed of an edited fact: performed; proper prefix: performed/removed from the replay; no fact and no
  skip: one of unlogged/unresolved/removed); S8 `actual` reads the bound current only; basis.order.frontier and load_basis.prefix
  refused unless non-negative safe integers (prefix null admitted, as basisOf writes it); evidenceChanged accepts the round-33 and
  round-32 forms of the same slot (REVISION RETENTION, :155). All conform to the clauses they cite.
- Issuance re-measure (tally.json: FC01 overlaid in memory, behaviour-identical, every evidenceOf call also computed in the round-32
  form): FC12 13402 calls, 130 differ, every differing set is a removed-only slot differing only in original/edits (0 other
  differences); FA03 (real host) 1127 calls, 0 differ. With that overlay FC12 442/442 (441 + my walk), FA03 103/103, guard clean.
- PRODUCER_REVISION: recomputed over the 14 listed engine files = 3c86253710607d45...= FC03's constant; with the round-32 FC01 in its
  place = df0b960424b5f0c0... = the round-32 constant: only native-load.cjs moved it. git status at bd7654a: the only modified
  product files are FC01 and FC03 (the other M entries are FC12, FA03 and the report).
- Not met: "a record the real producer issues over a history the real reader admits is never refused": B-R33C-1 (host) and
  D-R33C-1 (reader-only).

## (2) THE ROUND-32 ITEMS, each on its reviewer's own input (my mutants M02-M19 below rebuild the reviewers' shapes)
B-R32F-1 = L23-B3 (F12/F13 = Astra N02/N03): M17, M18 KILLED by R33-L23B3. D-R32C-2 = L23-B1: M07, M09, M10, M15 KILLED (L23B1,
STATE rows). L23-B2: M03-M06 KILLED (L23B2, FUZZ). L23-B4 (N11): M19 KILLED (L23B4). L23-B5 = D-R32C-1 P2: M02, M13, M16 KILLED
(L23B5 on the real reader's add/remove/undo history). D-R32C-1's re-log shape remains as D-R33-1 (reader-only, below).

## (3) GENUINE-USE WALKS
- Host walk (walk-host.test.mjs, real durable host; 4 U days, 2 lifts; per day loads 40/45/card and reps 12/10; saved-set Undo and
  re-log 15%; skip 8%; Finish; Check; each offer yes 70% / no; after it remove or correct any active closed-session set; Undo of an
  adoption 25%; invariants: no RECORD_INVALID, no projection refusal, cold reopen equal): seeds 33101..33340 (240) and 34001..34240
  (240): 480 seeds, 823 yes, 360 no, 1181 later removals, 1139 corrections, 138 Undo-of-adoption accepted, 1292 saved-set Undo/re-logs,
  756 skips. Counterexamples: 3 (B-R33C-1). Everything else: holds and repairs only (BASIS_REPAIR_REQUIRED, EFFECT_CONFLICT).
- Reader walk (rvw-walk.cjs, 400 seeds from 33500, R1/R2 random): 219 reached a yes. Post-yes host-writable sequences: 125/125 keep
  consent (35 plain, 90 BASIS_REPAIR_REQUIRED). Post-yes sequences with a reader-only action: 94, of which 83 RECORD_INVALID evidence,
  each containing a post-Close re-log or an undo of a removal (e.g. seed 33507: remove F1, re-log F2 = D-R33-1).

## (4) MUTANTS (in-memory overlays, mut\C33-Mnn.json; FC12 whole with my reader walk appended; guard clean, every overlay applied 1)
| id | change | FC12 (442) | killed by / class |
|---|---|---|---|
| M01 | FC01 removedFact length===1 -> >=1 | 442 LIVE | FA03 103/103, host walk 60/60: EQUIVALENT on genuine use (D-R33C-3) |
| M02 | FC01 round-32 form restored | 438 | L23B5, FUZZ, ROUND32-FORM, STATE |
| M03 | frontier clause deleted | 440 | L23B2, FUZZ |
| M04 | frontier `< 0` dropped | 440 | L23B2, FUZZ |
| M05 | prefix clause deleted | 440 | L23B2, FUZZ |
| M06 | prefix null refused | 440 | L23B2, FUZZ |
| M07 | S4 state clause deleted | 439 | L23B1, FUZZ, STATE |
| M08 | NO_FACT_STATES without removed | 441 | ROUND32-FORM |
| M09 | named removed fact -> slot.state | 441 | STATE |
| M10 | proper-prefix state line deleted | 439 | L23B1, L23B5, FUZZ |
| M11 | S8 reads the claimed state again | 442 LIVE | FA03 103/103, host walk 60/60: EQUIVALENT where S4 binds state (D-R33C-5) |
| M12 | evidenceChanged: round-33 form only | 441 | ROUND32-FORM |
| M13 | evidenceChanged: round-32 form only | 440 | L23B5, FUZZ |
| M14 | no listed edit -> slot.state | 438 | R28B-REMOVAL-AFTER-YES, R28B-UNDO-RESOLVES-ONLY-REPAIR, FUZZ, my reader walk |
| M15 | no-fact state unchecked | 441 | STATE |
| M16 | FC03 removedFact disabled | 440 | L23B5, FUZZ |
| M17 | -0 technique clause deleted | 440 | L23B3, FUZZ |
| M18 | -0 effect_frontier clause deleted | 440 | L23B3, FUZZ |
| M19 | Undo restores all but topRun | 441 | L23B4 |
19 mutants: 17 KILLED, 2 LIVE, neither observable on a genuine-use input (FA03, both walks).

## (5) D-R33-1..5 and named debts
- D-R33C-1 = D-R33-1 (+ variants (c), (e)): reader-only; host guards continuation.mjs:30 and public-client.mjs:333-335/:338 above.
- D-R33C-2 = D-R33-2: a valid but different frontier/prefix, hi or tenure_start needs a record edited after issuance; the producer
  writes the authentic values. Not genuine.
- D-R33C-3 = D-R33-3 (and M01): a slot with two removed facts reaches issuance only as an ADDED slot (FC01 refuses an incomplete
  original prefix: PREFIX_UNRESOLVED, :259/:264); the real projector builds slots from the capture only (engine-history.cjs:84-96),
  so no host input has one (FA03 tally 0 differing calls); undoing a removal is not host-writable. Not genuine.
- D-R33C-4 = D-R33-4: needs a slot logged after the yes; continuation.mjs:30 refuses it. Not genuine.
- D-R33C-5 = D-R33-5 (and M11): needs an edit the typed fold cannot interpret; the host writes only correction/tombstone of an
  active fact. Not genuine.
- D-R33C-6 (harness): on 2026-10-02 the NODE_PATH and deps-loader fallbacks used by run30.ps1 (earned-adm w6 node_modules,
  earned-astra-47 node_modules) no longer exist on the PC, so FA03 cannot load fake-indexeddb as configured; I resolved through the
  existing junction earned-look-cui4\rebuild\m3\w6\node_modules and earned-nlr\node_modules (scratch deps-loader.mjs, run33.ps1).

## Not verified
Two devices writing into one session (no sync harness); the round 24-32 kill tables (hosted sweep, :864); the protected five;
browser/phone harnesses; CI. B-R33C-1 has no 2-3 session minimal host sequence yet (30 tried); the three seeds are deterministic.
Fable's and Astra's round-33 reads were not opened. Builder report read last (section Round 33, debts D-R33-1..5).
Scratch: %TEMP%\review-nlb-r33-claude-scratch (probe-host, walk-host, probe-min, rvw-walk, swap, tally, dump, mut\, out\).
