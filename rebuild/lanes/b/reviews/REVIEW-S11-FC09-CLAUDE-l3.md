# REVIEW S11 FC09 round 3 (7cf4a87: Today Undo listing, TARGET_QUEUED refs, by-path exclusions, PAGE_PINS)

Reviewer: Claude Opus 5.5, blind engine-tier seat, third read (same brief and hard limits). No other review read.
Head checked: worktree earned-s11-fc09-ro, HEAD 7cf4a877eedef7766e26433a3b2e0fe9dd0842e6 = 22ac52b + one commit, 7 files
(`git diff 22ac52b 7cf4a87` read in full). Builder report section 18 read. PM SUMMARY files pm-out-r10o2,
pm-out-callers-r9, pm-out-r10reg2 and pm-out-r10p read (pass/fail only).

VERDICT: ACCEPT WITH NAMED DEBTS

My round-2 B1 is paid, and so is the refs item. I found nothing reachable from genuine use that remains.

## What I ran (this seat; MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York; one node process at a time)

- FC12 native-load-options.test.cjs: 478/478, including FC09-LINEAGE-TQ.
- The shared-id differential against 84f8421 (wrapper diff-fc03.cjs over a copy of the current FC12):
  - 38,068 calls compared and 612 skipped (non-empty correspondence);
  - 2 mismatches, both in the R30/R31 containment cells, whose injected faults count calls (same offsets as rounds 1-2);
  - everything else is byte-identical once the revision string is normalised.
- The mixed-id twin walk, now with the PAGE'S LISTING (scratch probe-twin3.cjs appended to a copy of FC12):
  - Same generator as round 2. Pre-import Yes answers on the phone; an import that keeps the base, moves it, or changes
    the set count; post-import workouts on numeric or baseline-ask cards, with Yes answers given in each world.
  - Seeds 777001, 424242 and 99173: 3,500 walks, 16,470 checks, 3,062 Undo checks, 3,500 folds, 3,062 Yes answers.
  - New in this round: today-bindings.mjs project() (`lifts` by shownLift, `spend_lifts` by spendLifts) and
    today-entry.mjs:213-231 (the D9 listing) are copied line for line. That copy runs over FC03's real fold and real
    `check()`, in three forms:
    the page form, the page form with the 22ac52b listing (no spend_lifts), and the one-id twin.

## Judged by name

(1) B1 PAID.

| measure (3,500 walks) | value |
|---|---|
| Undos FC03 offers (each uncancelled spend, on its lineage's newest normal completion, on the shown lift) | 626 |
| Undos the fixed page lists | 626 (the same spends, by response id) |
| Undos the one-id twin lists | 626 (the same responses and kinds) |
| Undos the 22ac52b listing lists | 489 (137 missed: the round-2 defect, reproduced) |
| listed Undos on a lift other than the file's | 0 |
| differences in checks, Undos or folds against the twin | 0 |

- None the engine refuses is listed: the listing pushes only what `check()` offers, and it calls `check()` with the shown
  lift. That is the request FC03 resolves to the record's id (evalLift).
- Shared ids are unchanged. spendLifts maps each spend through shownLift, which is the identity when there are no pairs.
  today-entry's `shownOf` falls back to the spend's own lift when `spend_lifts` is absent, so with shared ids the listing
  computes exactly what it did before.
- Held Yes answers still list through the issue's base lift (:219), unchanged.
- PM seat: FC09-Q3-I red at 22ac52b (O3 2/2 not ok) and green after (O10 18/18). Caller mutants C7-entry-shown-undo and
  C8-host-spend-lift are each killed by both Q3-I cells (callers-r9).
- Static check of the hunks: today-bindings.mjs:643-651 (spendLifts) and :738 (spend_lifts), and today-entry.mjs:215-227.
  A compensation spend (`['native-load-compensation', lift, ...]`) also gets its shown lift through d[1]; the D9
  listing's own `native-load` filter on spent rows is unchanged.

(2) The K2 refs fix: NO TRANSITION OR RECORD DIFFERS FROM THE TWIN.
- queueIn re-addresses `queue[].native_load_spend` with the frontier's own `spendIn`/`at`. It does so only inside
  evaluateNativeLoad, on a copy, and only when an entry moves.
- applyNativeLoadDecision keeps the queue as written. This is right: FC01 compares it there with the decision's own ids
  (landing `native_load_spend === d.spend_id`, compensate `=== d.compensates`), which a re-address would break.
- In compensation() (native-load.cjs:383-405), FC01 compares the raw intent with the frontier, the queue and the raw
  exercise authority. That is consistent, because the Undo is evaluated in its spend's own lineage space (evalLift), where
  `at` leaves that spend unchanged.
- Executed:
  - TARGET_QUEUED refs differences against the twin: 1,484 at 22ac52b, 0 now.
  - Every fold member compared (exercise image, queue, issues with refs and supersession, effects, spends): 0 differences.
  - Every offer shape (kind, consumes, targets) and every Undo verdict: 0 differences.
  - Shared ids against 84f8421: byte-identical (above).

(3) The PAGE_PINS re-read: AGREE, with one citation slip.
- `git diff 22ac52b 7cf4a87 -- today-entry.mjs` is one hunk (5+/2-) inside the D9 listing. The file's sha256 is
  b3de1c31..., which is the new pin.
- boot() is untouched: :524 `let hosts = options.hosts || null`; :534-541 open the hosts only when none was injected;
  :542 is the lane.
- The new code only reads `projected.spend_lifts` and opens no store. spendLifts is a pure function of the fold and the
  resolver.
- The re-pin text cites `:687 owned = ...`; that line is :688 (:687 is a comment). The behaviour is as stated.
- PM seat: G7 127/129 in r10reg2 (C4b, the pin, red before the re-pin); P1 51/51 after it.

(4) Exclusions BY PATH before any read: CONFIRMED, src/ and conform/private included.
- In callers() and in LOM-S6-LITERAL, the `forbidden` rule is
  `(^|\/)src(\/|$)|(^|\/)conform\/private(\/|$)|(^|\/)private(\/|$)|soak|(^|\/)ledger(\/|$)|(^|\/)app\.js$`, case-insensitive.
- It is tested on a directory before readdir, and on each entry before it is read or descended into.
- LITERAL self-checks the rule against 8 forbidden shapes, 3 runtime modules and both roots before walking.
- Residual (named debt N1): an entry that is a symlink or junction is not `isDirectory()`, so a `.js`/`.cjs`/`.mjs` link
  with an innocent name is read through readFile wherever it points. A by-path rule cannot see the target. Not
  reachable in this repository as committed, as far as the rule's inputs show; I did not list the trees to check (hard
  limit).

(5) Anything else new in 22ac52b..7cf4a87:
- native-load-import.test.mjs:
  - `realShapeHistory` now takes `fileLift` from the ADMITTED state by name, with an exactly-one precondition. For
    variant(1) this is the same `abs`, so Q3-F/G/H are unchanged.
  - New optional `prepare`, `file`, `top` and `yes:'earn'`, inert by default.
- Q3-I's queued-earn case gives the phone basis a test-made rung ladder (`steps`), because a first-run phone has no next
  load (FC01 NO_NEXT_LOAD). The queued shape on the real page is therefore fixture-built. My FC03-level walk covers
  queued earns on genuine FC12 bases (inc 5) and lists them (N2, test strength only).
- keptFile copies only `w` and `wSets` into the file lift, the members spec :156 compares. The cell asserts "not held"
  as a precondition, so a base that the test considered kept but FC03 judged moved would fail by name, not pass.
- No FC01, engine or resolver byte and no new import edge; PRODUCER_REVISION untouched (R2-REVISION green here).

## BLOCKING

None.

## NAMED DEBTS

- N1 The by-path exclusions cannot see symlink or junction targets (above).
- N2 Q3-I's queued earn needs a test-made rung ladder on the phone basis; the queued listing on genuine bases is covered
  only at FC03 level (my walk), not on the real page.
- N3 The PAGE_PINS re-pin text cites :687 for the `owned` line; it is :688.
- Carried, unchanged: D-S11-EXIT-CODE (Q3-G presentation); boundary fail-open for unlisted lift-keyed maps; the view
  workout_facts split; F9 superseded-only refusal; resolver refusal on two setup ops; clone cost under a correspondence;
  D-S11-FC10, D-S11-EN3-COPY; S11.json posts and s11-supersede suites stale until S11-REGEN.

## What I did not verify

- Any cell that loads admission, the page or the port harness (Q3-I, LOM-S6-LITERAL, callers(), local-today-journey):
  static reading plus PM SUMMARY.
- The page's listing on the real page: my walk copies today-bindings' project() and today-entry's D9 listing line for
  line over FC03's real fold and checks; it does not run the page modules.
- The owner's real file. The builder's sweep-r9b output, and CI workflows outside rebuild/.
