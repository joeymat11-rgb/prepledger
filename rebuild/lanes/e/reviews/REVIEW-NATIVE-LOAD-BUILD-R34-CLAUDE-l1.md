# REVIEW NATIVE-LOAD BUILD ROUND 34 (engine tier), CLAUDE l1

Reviewer: Claude (Opus), commissioned by the Earned PM (DECISIONS:868); blind; engine tier; new bar

Object sha256 (measured; worktree %TEMP%\earned-nlr, HEAD bd7654a, uncommitted; all equal to the brief):
- FC01 rebuild/engine/native-load.cjs dd197849fe92a493dee86ed7c530bdc9e1c22d382004fa4ee6c04968de7e0a73
- FC03 rebuild/m4/workout/native-load-effects.cjs 38c67a9855a698392ae6a422f5cc8a7101aa16a74592019b3021462354b9e1c3
- FC12 rebuild/m4/spec/native-load-options.test.cjs 5de5b74e25b6d0b8707191c21a5d1ea8d9b8b8d914a0d0dc6f9a597d09a1f040 (446)
- FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs eb3693000e8349c78c83ed8fb4deddc23901153bd12e24bb1fef4dad5849b752 (103)
- report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md 6597d9beef0688b506ee66491f2d60be667512d0bf40a85c4118013959333b5f
- spec 7ef8291:rebuild/coach/NATIVE-LOAD-SPEC.md eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb (cmd /c git show)
- round-33 FC03 parent 371154a9caceeda8... = %TEMP%\nlr-r34-scratch\fc03-head34.cjs, copied to my scratch fc03-r33.cjs

VERDICT: REJECT (blocker B-R34C-1, ROWS ONLY: the product bytes are correct; named debts D-R34C-1..3)
REQUIRED CHANGE: yes, one FC12 row (no FC01/FC03 byte, no issuance, no revision move). Under the brief's rule (4) a LIVE mutant whose
difference is observable on a real-host input is a blocker; M14 is one. If the PM rules a coverage gap a debt, the rest reads ACCEPT
WITH NAMED DEBTS D-R34C-1..3.

## B-R34C-1 (coverage; real-host input; product green): no row pins an original slot with TWO removed facts after the yes
- Mutant M14 (sameCut reads only the FIRST removed fact of a slot) passes FC12 446/446, FA03 103/103 and the four real-host seeds.
- Real-host input that kills it (row RVW34-RELOGGED-SLOT-REMOVED-AFTER-THE-YES, scratch rvw34.cjs, inserted in FC12 in memory by
  append.cjs; every op written by the real gym model, public client and native-load host; R34-BR33C1-HOST-MINIMAL plus one walk action):
  D1 demo-press 40 x 10, Finish; D2 demo-press 45 x 10 where set 1 is logged, UNDONE on the saved-set screen and logged again (the
  walk's undo-relog), Finish, Check, YES adopt-observed; D3 45 x 12, Finish, Check, YES earn; then REMOVE D2 demo-press set 1 (the slot
  now holds two removed facts: "ack removed-facts 2").
  - head (38c67a98): earn spend kept uncancelled, no RECORD_INVALID, only the adoption's BASIS_REPAIR_REQUIRED. GREEN.
  - round-33 FC03: RECORD_INVALID issuance demo-press [the earn's response]. RED (the B-R33C-1 shape again).
  - M14: RECORD_INVALID issuance demo-press [the earn's response]. RED. The other seven LIVE mutants: green.
- Required: add that row, or an equivalent host or fold row: a slot whose removed_facts lists an earlier-removed fact first and the
  fact removed after the yes second. It is red on the round-33 bytes and under M14 and green on head.

## (1) PRODUCT (measured before reading the report)
- Hunk: `git diff --no-index` fc03-r33.cjs -> FC03: +7/-2, sameCut only (removed_facts loop, 4 comment lines) and its one call site
  FC03:917 (`yes` = [...g.ops, ...(g.alt || [])]). FC01 and FA03 byte-equal to the R33 l1 record.
- PRODUCER_REVISION recomputed over the 14 listed engine files (rev.cjs; none of the protected five) = 3c86253710607d45... = head
  constant = round-33 constant. No string literal added or removed by the hunk: no displayed string can move.
- Removal BEFORE the yes: basisOf coverage = every session op at issuance (FC03:319), so a removal before the Check is covered and
  judged exactly as before. An uncovered op proven before a yes is an edit between Check and yes; the host refuses that yes (respond
  re-evaluates, sameIssued incl. coverage, ticket keyed on every op: today-bindings.mjs:290, :718-719). Measured: escape true 0 times in
  240 dual host seeds (wd, we); every yes after a post-Check edit refused: walk6-b 146 STALE_OFFER + 22 CAPABILITY_REQUIRED, walk6-d
  253 + 44, 0 acknowledged. Only FC12 CONTROL (a), a synthetic fold record, reaches the escape (escape true 1 in FC12).
- Conformance: :155 ORIGINAL CUT ("a later edit never revokes it": not reproduced, so S1-S8 and DERIVABLE, applied as written); D-R9-1
  and :166 (BASIS_REPAIR_REQUIRED only on the record whose own consumed set was removed; PM's Q-R34-1 reading); :160 Undo reachable
  (spend kept).
- No other fold result moved. My dual preload (swap.cjs) runs every foldNativeLoad call, exported or internal (check included), also
  on the round-33 FC03 over structured clones, compares JSON and counts the new `return false`:
  - FC12 without R34 rows (t4, --test-skip-pattern R34-, 441 rows): 22848 calls; the new check fired 0 times, so every result is
    identical by construction. 2 calls differ, inside R30/R31-CONTAINMENT, whose injected faults are stateful and are consumed by my
    second call: an instrumentation artifact. Those 3 rows are red only in the instrumented run and green on head and on round-33 bytes.
  - FC12 whole (t2): 23501 calls, 72 differ = 70 in R34 helpers/rows (FC12:8379, :8435-8438, :8550, async frames) + those 2.
  - FA03: 4430 calls, 0 differ. Host walk wd (38001..38120): 14690 calls, 73 differ, every one round-33 RECORD_INVALID issuance ->
    round 34 the same issues without it and one more spend kept. Host walk we (edits after the Check): 13984 calls, 0 differ.

## (2) THE ROUND-33 ITEMS
- B-R33C-1 repaired on my three seeds on the real host: 33204, 33329, 34175 green to their end (s1a-c); 33204 red on round-33 bytes
  (s1d). New seed 38106 (this review): red on round-33 bytes (RECORD_INVALID issuance demo-press after a removal), green on head.
- Red first (t1-fc12-r33, round-33 FC03 swapped in): exactly HOST-WALK-HISTORIES, HOST-MINIMAL and FOLD-MINIMAL are red; CONTROL and
  TWO-REMOVED-FACTS are green (controls). Head: FC12 446/446, FA03 103/103; guard: protected-in-cache none, refused none, every run.
- The rows assert the spec outcome: yes kept, no RECORD_INVALID, REPAIR only on the adoption whose consumed set was removed, held
  projection w null (:158). Gap: B-R34C-1.

## (3) REAL-HOST WALK (head bytes; seeds never used before; one pm-run shared slot; TZ/NOW per brief)
| shard | mix | seeds | counterexamples |
|---|---|---|---|
| wa, wb | walk-host as copied (out path only changed) | 36001..36480 (480) | 0 |
| w6a | walk6 with walk-host draws | 39001..39120 (120) | 0 |
| wc | walk-host, WALK_MIX=pre: 0-2 edits after the Check, before the answers | 37001..37240 (240) | 0 |
| w6b | walk6 4-day, pre | 39201..39320 (120) | 0 |
| wd / we | dual, default / pre | 38001..38120 / 38201..38320 (240) | 0 / 0 |
| w6c / w6d | walk6 6 days, 80% edit draws, 75% removals / same + pre | 39401..39520 / 39601..39720 (240) | 0 / 0 |
Union: 1440 new seeds, 0 counterexamples: RECORD_INVALID 0, projection refusals 0, cold reopen equal in all. 2607 yes answers,
4615 later removals, 3505 later corrections, 1033 removals between Check and answer, 258 accepted Undos of an adoption, 3983
saved-set Undo/re-logs. End issues: BASIS_REPAIR_REQUIRED and 6 EFFECT_CONFLICT (D-R34C-3). w6r (36001..36240 through walk6)
reproduced wa's stats exactly. Sensitivity on round-33 bytes: 38001..38120 -> 1 (38106); 39001..39120 and 39401..39460 -> 0.
Random walks rarely reach B-R33C-1, so the dual comparison and the rows are the decisive evidence. Disclosed: w6a/w6b inherited
WALK_NDAYS/PACT/PREMOVE from the line before (run34.ps1 does not clear them), so they ran the walk-host draws; w6c/w6d set all.

## (4) MY MUTANTS of the new hunk (scratch mut\Mnn.cjs, compiled in place of FC03 by swap.cjs, each applied once; FC12 whole)
| id | change | FC12 | killed by / class |
|---|---|---|---|
| M01 | removed_facts loop deleted (round 33) | 443 | HOST-WALK-HISTORIES, HOST-MINIMAL, FOLD-MINIMAL |
| M02 | escape deleted (every uncovered op flips) | 445 | CONTROL (a) |
| M03 | escape always true | 443 | the three B-R33C-1 rows |
| M04 | yes.some -> yes.every | 446 LIVE | FA03 103, 4 host seeds, RVW34 green. EQUIVALENT: needs 2+ responses with an edit between them; host never |
| M05 | provenBefore reversed (yes before op) | 442 | the three + CONTROL |
| M06 | edit ops dropped (source op only) | 443 | the three |
| M07 | source op dropped (edit ops only) | 446 LIVE | FA03, seeds, RVW34 green. EQUIVALENT: a cut fact's source op precedes the Check (no log after Close) |
| M08 | call site passes [] | 445 | CONTROL (a) |
| M09 | call site drops g.alt | 446 LIVE | FA03, seeds, RVW34 green. EQUIVALENT: alt = a second compensation body; one device writes one |
| M10 | call site passes g.ops[0] only | 446 LIVE | as M09 |
| M11 | id list .some -> .every | 443 | the three |
| M12 | loop only when the slot has no live fact | 446 LIVE | FA03, seeds, RVW34 green. EQUIVALENT: after a Close no re-log, so a removal leaves no live fact |
| M13 | loop only when slot.state is removed | 446 LIVE | as M12 |
| M14 | only the FIRST removed fact of a slot | 446 LIVE | FA03, 4 seeds green; KILLED by RVW34 on a real-host input -> B-R34C-1 |
| M15 | only the LAST edit op of a removed fact | 446 LIVE | FA03, seeds, RVW34 green. EQUIVALENT: the tombstone is the last edit (a removed fact cannot be edited, :338) |
| M16 | escape tests the fact's source op | 443 | the three |
16 mutants: 8 KILLED by FC12, 8 LIVE in FC12; of those, M14 is observable on a real-host input (B-R34C-1) and 7 are equivalent on
genuine use (FA03 103/103; walk-host seeds 33204, 33329, 34175, 38106 all green; RVW34 green).

## (5) NAMED DEBTS AND REACHABILITY
- D-R34C-1 (= builder D-R34-1, reader-only): CONTROL (a) pins RECORD_INVALID for a yes recorded on an issuance that never saw an
  earlier removal. Not host-writable: 465 of 465 yes answers after a post-Check edit were refused (STALE_OFFER/CAPABILITY_REQUIRED),
  0 written. Joins D-READER-ONLY.
- D-R34C-2 (second device, unmeasured): the escape and M04/M09/M10 differ only with a removal ordered before a yes but outside its
  coverage, or with 2+ response records of one spend. Both need a second device or sync writing across the Check; no harness. Same
  residual as D-R33-1/D-READER-ONLY: it reopens if any sync, import or second-device path is built.
- D-R34C-3 (pre-existing, consent kept; for the PM to confirm the label): an earlier earn's evidence set removed after a LATER same-lift
  earn's yes -> earlier earn BASIS_REPAIR_REQUIRED, later earn EFFECT_CONFLICT field load_basis (spend kept, not applied; lift held).
  Seeds 36152, 36235 (wa), 3 in w6c, 1 in wd. 36152 gives the same issues on round-33 bytes, so round 34 did not cause it. :165 reads
  "unprovable order", yet the history is one device's ordered log; the outcome (held, consent kept, exits open) matches :158/:166.
- D-R33-1..5 and D-READER-ONLY: round 34 changes no host guard and no issuance; my walks wrote nothing into a closed session (no
  path). D-R33-3 note: an ORIGINAL slot with two removed facts is host-writable at FOLD time after a yes (RVW34: "removed-facts 2");
  issuance still sees one removed + one live fact there, so D-R33-3 (issuance) is unaffected; head handles the fold case (green).
- Observed, not a debt: a yes to a SECOND offer of the same Check after a first yes refuses STALE_OFFER (the first yes moved the
  generation; walk6-c 41 times); nothing is written and the offer reappears at a later Check (seed 36235 demo-row). Host/panel UX.

## Not verified
Two devices or sync writing into one session (no harness); the round 24-32 kill tables (hosted sweep, :864); CI and browser/phone
harnesses; the protected five (never loaded: guard clean every run). Whether a refused second-offer yes always reappears.
Builder report (Round 33 and 34 sections) read LAST; it agrees with my measurements except that it has no row for B-R34C-1. Astra L24
and Fable R33 read only through the DECISIONS lines. Scratch %TEMP%\review-nlb-r34-claude-scratch: run34.ps1, swap.cjs (dual/swap),
append.cjs, rvw34.cjs, walk-host.test.mjs (dbfd8d94 lineage + pre), walk6.test.mjs, mk-mutants.cjs, mut\, rev.cjs, out\, tally-*.json.
