# REVIEW: NATIVE-LOAD build round 33 (engine tier) - FABLE l1

Reviewer: Claude Fable, commissioned by the Earned PM (DECISIONS:866); blind; engine tier; new bar

Object (worktree %TEMP%\earned-nlr, HEAD bd7654a, uncommitted), sha256 measured by Get-FileHash before anything ran and again after the PC bridge dropped (11:23):
- FC01 rebuild/engine/native-load.cjs dd197849fe92a493dee86ed7c530bdc9e1c22d382004fa4ee6c04968de7e0a73
- FC03 rebuild/m4/workout/native-load-effects.cjs 371154a9caceeda8c0c642bf4c14b07a33c7e441f37fbe4c7b16004dba410ef7
- FC12 rebuild/m4/spec/native-load-options.test.cjs 19f642e826b5fd07d745d832049fc409e40d9ab57b894f3cde53f3dcbe29ad4f (441 rows)
- FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs eb3693000e8349c78c83ed8fb4deddc23901153bd12e24bb1fef4dad5849b752 (103)
- report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md 8a4d79c0ad4537f96d2f9d655354b6892ba09d1075141f69162cf891c0779c9b (read LAST)
- spec R9.13 (cmd /c git show 7ef8291:... > scratch\spec.md) eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb
All five match the brief. git status --short: exactly these five M (plus the untracked review files); the worktree is a sparse checkout (355 paths absent,
none under test here), so every other tracked product file present equals its bd7654a blob. Method: rules and brief first; spec :61, :101-:120, :151-:177
and DECISIONS:859-:866 read; the bd7654a diffs of FC01/FC03 (fc01.diff 83 lines, fc03.diff 318) read whole, FC01 whole, FC03 :1-:660 and :668-:1289,
the typed reader (edit-history.cjs, project-history.mjs, engine-history.cjs, engine-order.cjs, edit-values.cjs, schema.cjs) read whole; the R33 rows and
helpers read; my own harness built BEFORE the report. Every run via node %TEMP%\pm-run.cjs shared, one slot at a time (jobs fable-r33-p0..p5), runF.ps1 =
pm9-joint31\run30.ps1 with only the scratch path changed (guard.cjs + deps-loader.mjs; every TAP "GUARD protected-in-cache: none; refused: none"; every
overlay "applied 1" in its child), TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03; mutants and probes are IN-MEMORY overlays (nlr-build\r17c\overlay.cjs).
Scratch %TEMP%\review-nlb-r33-fable-scratch (out\ every TAP, walk*.js, mk33.cjs, mut33.cjs, rev33.cjs, tally33.cjs). Every fixture value is invented.
Head baseline: FC12 441/441 (p0, 54 s, walks and fuzzes at defaults); FA03 103/103 (p4b, 34 s, through the real host; loader disclosure below).

VERDICT: REJECT (blocker B-R33F-1, reachable from genuine use through the real reader and the real producer; named debts D-R33F-1..5)
REQUIRED CHANGE: yes. Either the PM rules that :155 S4's letter ("original equal that authentic session's typed slot") governs a slot whose resolution has
moved to ANOTHER fact after the yes, in which case B-R33F-1 is D-R33F-0 and the verdict is ACCEPT WITH NAMED DEBTS; or FC03's S4 binding is changed under
grant (a) so that a record naming an authentic removed fact binds to that fact beside a live one (BASIS_REPAIR_REQUIRED, consent kept), and the unresolved
slot gets its own ruling. No FC01 byte needs to change for it; no row is weakened.

## BLOCKING
B-R33F-1 PRODUCT (spec :155 D-R9-1 "a correction or removal after the yes remains BASIS_REPAIR_REQUIRED (:160) with consent kept, never RECORD_INVALID";
  :166; the builders' own D-R33-1 names the first form). GENUINE USE, measured end to end (PROBE33F-WALK, out\walkall2.txt): the op log an athlete's device
  writes (Start with its FC16 capture, session-set, correction, tombstone, session-skip, session-close, the native accept), read by the REAL typed reader
  (edit-history normalizeWorkoutHistory -> project-history projectWorkoutRecords -> engine-history project, the facts FC03 consumes), checked by the real
  producer (checkNativeLoad -> FC01), accepted through issuanceFor, folded by FC03. Four sequences lose a genuine yes:
  (a) A4/B4/D3: log C1 at 95 on the 100 card [10,9,8]; check -> adopt-observed 95 (evidence names s1-fx-press-2); YES (w 95, spent); REMOVE set 2
      (tombstone); RE-LOG set 2 (a new session-set, 95 x 9) -> fold: RECORD_INVALID evidence [y1], w 100, spent [], the lift held (next card: the
      baseline ask), no Undo (not in the spend index); the check on C1 under it: PLAN_CHANGED. Same for the earn (B4: C1, C2 tops, YES to DEBUT 105,
      remove C2 set 3, re-log -> RECORD_INVALID, the pending debut gone). Control: the removal alone -> BASIS_REPAIR_REQUIRED, w 95 kept (A2, B4).
  (b) A5/D3b: C1 at 95; remove set 2 BEFORE the check (PREFIX_UNRESOLVED); re-log it; check -> offer naming the NEW fact; YES (w 95); UNDO the old
      removal (tombstone of the tombstone) -> two live facts, the typed slot unresolved (SET_SLOT_RESOLUTION_REQUIRED) -> RECORD_INVALID evidence, w 100.
  (c) D2: earn over a re-logged set; after the YES the re-logged set removed (BASIS_REPAIR, fine) and then the ORIGINAL restored -> RECORD_INVALID.
  (d) D6: after the YES a skip logged into performed slot 3 -> slot unresolved -> RECORD_INVALID; the skip removed again -> consent back, no issue.
  Consent returns in every form once the slot resolves back to the recorded fact (D3: the re-logged set removed -> w 95 + BASIS_REPAIR; D3b/D6). It is
  not a trap (exit (b) adopts on a later completion), but the yes is dropped by name RECORD_INVALID where :155 says never, and the Undo is gone with it.
  The cause: FC03:518 `const f = slot.fact || (gone.length === 1 ? gone[0] : null)` prefers the live fact; an unresolved slot carries no fact at all.

## (1) PRODUCT (measured)
- FC01 hunk (removedFact, :135-:141): a slot is read from removed_facts only when !slot.fact && state 'removed' && exactly one removed fact; every other
  slot takes slot.fact exactly as before, so no other issuance byte can move (static: f, cur and edits all derive from f; cur stays null because state is
  not performed). M01 (removedFact -> null) kills ONLY the four removed-slot rows (R33-L23B5, R33-ROUND32-REMOVED-FORM, R33-STATE-OF-A-NAMED-REMOVED-FACT,
  R33-FUZZ); the whole genuine-use walk (137 PROBE33F lines) is byte-identical under M01 (out\walkall-M01.txt vs walkall2.txt: 0 differences).
- FC03 S4 state bind (:536-:537, :549): listed = the typed slot's state for every edit listed (removed when the named fact sits among removed_facts),
  performed for none listed of a fact with edits, the replayed active/removed for a proper prefix, one of {unlogged, unresolved, removed} for a set naming
  nothing. Every genuine slot shape through the real reader passes it (walk A-F: performed, skipped, corrected before and after, removed, restored).
- recordShape counts: order.frontier a non-negative safe integer (:403; the real facts carry W = 0 here, admitted), load_basis.prefix null or a
  non-negative safe integer (:409; basisOf writes ex.sets or null). S8 reads the bound current only (:582). PRODUCER_REVISION recomputed from the 14
  engine files by FC03's own recipe (rev33.cjs): 3c86253710607d45b467047ec858b8780483643cd5c3b9b53306040a59099b5e = the constant (FC03:1285).
- Strings: every added or removed non-comment line of both diffs enumerated (fc01.diff/fc03.diff): refusal codes, field names and member names only; no
  template, reason, copy or displayed string changed (adoptReason/earnReason/compensation text untouched).
- A record the real producer issues over a history the real reader admits is never refused or misapplied at the yes: 14 genuine yeses in the walk
  (adopt-observed x7, earn x5, adopt-baseline x1, claimed miss x1) all apply as issued; every Undo offered applies; R1 throughout.

## (2) THE ROUND-32 ITEMS (each on its own input; whole FC12 441 under my mutants)
- Astra L23-B1 = Claude D-R32C-2 = Fable D-R32F-1 (state unbound): PAID by R33-L23B1 (Astra's r32addedSet input and the originals); M06 (the bind
  removed) 438, M07 (prefix state bind removed) 438, M18 (zero-listed bind removed) 439 red there and on R33-FUZZ.
- Astra L23-B2 (prefix/frontier counts): PAID by R33-L23B2 on Astra's values; M09/M16 (frontier) and M10/M11/M17 (prefix) each 439 red there + R33-FUZZ.
- Astra L23-B3 = Fable B-R32F-1 (technique / effect_frontier -0): PAID; my F12 and F13 re-applied -> 439 each, red on R33-L23B3 and R33-FUZZ.
- Astra L23-B4 (N11 topRun restore): R33-L23B4 row exists; not re-mutated here (carried as read).
- Astra L23-B5 = Claude D-R32C-1 (removed added set restored): PAID on their input (R33-L23B5; M01 red). NOT reachable from genuine use today: the real
  projector (engine-history.cjs:118) refuses a fact outside the Start's capture, WORKOUT_EXTRA_SLOT_MAPPING_REQUIRED (walk A9 measured), and no producer of
  'earned/performed-lift/v2' or origin 'added' exists under rebuild/m2-m4/client (git grep; src/ not read). The edit reader alone admits that history.
- Fable D-R32F-3 (reps 2^53): PAID by R33-DR32F3. D-R32F-2 (a valid but different frontier applied): carried (= D-R33-2's last sentence).

## (3) GENUINE-USE WALK (decisive; PROBE33F, 6 tests, 42 sequences, out\walkall2.txt; every outcome below is the fold's or the check's own output)
- Adopt-observed: yes -> w 95 spent; correct after yes -> BASIS_REPAIR w 95, Undo offered -> 100, re-check SOURCE_OVERLAP; remove after yes -> BASIS_REPAIR;
  remove then restore -> BASIS_REPAIR; undo before a later Start -> prior image, C1 spent, C2 at 95 offered again; no answer, C2 at 95 -> C1
  COMPLETION_SUPERSEDED, C2 offered; after the yes C3 tops on the 95 card -> PROVISIONAL (new tenure); skipped set -> PREFIX_UNRESOLVED, the skip removed
  and the set logged -> offered; load corrected after yes -> BASIS_REPAIR + Undo; a correction listed at issuance then a second after -> BASIS_REPAIR, the
  second undone -> BASIS_REPAIR; one-set lift: the only set removed/restored -> BASIS_REPAIR. (a)-(d) above: RECORD_INVALID.
- Earn: two tops -> DEBUT 105 queued, w 100; C3 at 105 lands (w 105, DEBUT_LANDED, Undo COMPENSATION_DESCENDANTS, C4 tops -> earn 110); C3 at 95 ->
  MISSED, claimed adopt-observed 95 (authority_refs [s3-close]) -> yes w 95 -> Undo -> 100; correction after yes -> BASIS_REPAIR, C3 at 105 does not land,
  Undo before C3 retires (COMPENSATED); remove/restore after yes -> BASIS_REPAIR; undo before C3 -> C3 PROVISIONAL, C4 -> earn 105 (evidence not
  refunded); two lifts: both yeses queued, C3 lands press 105 while row misses (80 on 85), row's correction disputes the row only; a skipped debut set ->
  MISSED, the skip removed and 105 logged -> re-decided landed; a consumed C2 set removed after the yes on C3 -> BASIS_REPAIR, restored -> BASIS_REPAIR.
- Adopt-baseline (w absent): yes -> w 60; correction -> BASIS_REPAIR; Undo -> w absent; C2 at 60 offered again.
- Reachability facts: a prior session with a removed, two-removed or unlogged ORIGINAL slot is never consumed (E1/F1/F2: PROVISIONAL), the checked
  completion with one refuses PREFIX_UNRESOLVED / WINDOW_NOT_TOP (A5, D2); so through today's reader no issuance carries a removed-only or unlogged slot.

## (4) MUTATION TABLE (20 single-clause overlays, whole FC12 441 with walks and fuzzes at defaults; out\m-*.txt)
| id | clause (before -> after) | result | classification |
|---|---|---|---|
| M01 | FC01 removedFact -> null (issuance change reversed) | 437 | KILLED R33-L23B5, R33-ROUND32-REMOVED-FORM, R33-STATE-..., R33-FUZZ |
| M02 | FC01 removedFact: exactly one removed fact -> one or more | 441 LIVE | SPEC-SILENT (D-R33-3), unreachable (F1): D-R33F-2 |
| M15 | FC01 removedFact: the state 'removed' test dropped | 440 | KILLED R33-ISSUANCE-SKIP-REF-KEPT |
| M03 | FC01 evidenceOf: current read for any state | 436 | KILLED R28A-12, R31-S4-PROPER-PREFIX, R33-L23B5, R33-STATE-..., R33-FUZZ |
| M04 | FC03 NO_FACT_STATES without 'removed' | 440 | KILLED R33-ROUND32-REMOVED-FORM |
| M05 | FC03 listed: a named removed fact bound to slot.state | 440 | KILLED R33-STATE-OF-A-NAMED-REMOVED-FACT |
| M06 | FC03 state bind removed (round-32 text) | 438 | KILLED R33-L23B1, R33-STATE-..., R33-FUZZ |
| M07 | FC03 proper-prefix state bind removed | 438 | KILLED R33-L23B1, R33-L23B5, R33-FUZZ |
| M18 | FC03 zero-listed-edits bind ('performed') removed | 439 | KILLED R33-L23B1, R33-FUZZ |
| M08 | FC03 S8 actual: the round-32 `s.state === 'performed'` read restored | 441 LIVE | EQUIVALENT on bound histories (S4 now refuses any state/current disagreement first); differs only on D-R33-5's unfaithful class: D-R33F-3 |
| M09 / M16 | FC03 frontier: `< 0` -> `< -1` / clause removed | 439 / 439 | KILLED R33-L23B2, R33-FUZZ |
| M10 / M11 / M17 | FC03 prefix: null refused / isSafeInteger -> isInteger / `>= -1` | 439 each | KILLED R33-L23B2, R33-FUZZ |
| M12 / M13 | FC03 evidenceChanged: named form only / round-32 form only | 440 / 439 | KILLED R33-ROUND32-REMOVED-FORM / R33-L23B5 + R33-FUZZ |
| M14 | FC03 S4 gone: `=== 1` -> `>= 1` | 441 LIVE | EQUIVALENT: gone is filtered by the one op id the set names, so it never holds two |
| F12 / F13 | FC03 -0 clause dropped: technique / effect_frontier (round-32 re-application) | 439 / 439 | KILLED R33-L23B3, R33-FUZZ (B-R32F-1 paid) |
KILLED 17, LIVE 3 (2 equivalent by proof, 1 spec-silent and unreachable). No LIVE mutant differs on a genuine-use input (the walk is identical under M01).

## (5) D-R33-1..5, NEW, NOT VERIFIED
- D-R33-1: REACHABLE, B-R33F-1 (a) measured (A4, B4, D3); its siblings (b)-(d) are the same clause. Not a debt under the new bar unless the PM rules.
- D-R33-2 (hi, tenure_start, topRun not typed; a different valid prefix/frontier applied): hand-built only (basisOf writes them from the programme and
  FC01's step 1 pins frontier at the check); not reachable: carried as D-R33F-1.
- D-R33-3 (several removed facts): a slot with two removed facts is reachable (F1: remove, re-log, remove again) but never reaches an issuance (the
  checked completion refuses WINDOW_NOT_TOP / PREFIX_UNRESOLVED and a prior session so damaged is never consumed, PROVISIONAL): not reachable: D-R33F-2.
- D-R33-4 (no-fact state bound to a set): an unlogged original slot is reachable (F2) but likewise never issued: not reachable, carried.
- D-R33-5 (K08, unfaithful replay): needs an edit op the typed fold cannot interpret, which the real reader blocks (slot unresolved, no fact): not
  reachable: carried with M08 as D-R33F-3.
- NEW: D-R33F-4: the real projector refuses every added set (WORKOUT_EXTRA_SLOT_MAPPING_REQUIRED), so the round-33 issuance change, R33-L23B5 and every
  'added'-origin fixture describe a shape no reader produces today; harmless (M01-equal walk), owed a note in the post-S11 list. D-R33F-5: a skip logged
  into a performed slot (D6) and an undo-removal onto a re-logged slot (A5) leave the slot UNRESOLVED; the spec's "later edit" sentence does not say how a
  record names a fact the typed slot no longer carries (only unresolved_fact_ids): the ruling B-R33F-1 asks for must cover it.
- NOT VERIFIED: FA03 under any mutant (it folds genuine host records only; baseline 103/103 only); the builders' kill tables (138 lines) and TAP hashes read as data; the hosted
  sweeps; the 10000-seed shards (every whole FC12 here ran the default seeds, 21 times, no counterexample); browser/phone harnesses; the 80-file set; the
  protected five (never read, loaded or run); src/ (never read: whether the old app writes added sets is unknown to me).
- Disclosures: the dependency junctions runF's loader resolves through (earned-adm\rebuild\m3\w6\node_modules, earned-astra-47\node_modules) no longer
  exist on the PC, so FA03 could not run under the commissioned loader (ERR_MODULE_NOT_FOUND fake-indexeddb); a scratch copy of the loader with the
  existing earned-look-cui4\rebuild\m3\w6\node_modules junction as one more resolve parent and NODE_PATH entry ran it (p4b: 103/103); nothing installed. The Desktop Commander bridge dropped twice (11:0x and 11:5x);
  object hashes re-verified equal after each; no run was affected. Nothing committed, staged or pushed; DECISIONS/STATUS untouched; no object file
  written; no protected-five, src/, ledger, private, soak, EarnedPort or prepledger-dev path read, listed, loaded or run; one shared slot at a time;
  nothing written in nlr-r33-scratch or any earlier scratch (read only); the Claude R32 review file in this directory was not opened.
