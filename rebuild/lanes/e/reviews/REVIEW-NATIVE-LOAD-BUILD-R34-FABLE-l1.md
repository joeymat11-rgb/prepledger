# REVIEW NATIVE-LOAD BUILD ROUND 34 (engine tier) - FABLE l1

Reviewer: Claude Fable, commissioned by the Earned PM (DECISIONS:868); blind; engine tier; new bar

Object (worktree %TEMP%\earned-nlr, HEAD bd7654a798592a7dae421b9d68fec850fb0993d1, uncommitted), sha256 measured with Get-FileHash at the start
and again at the end, all equal to the brief:
- FC01 rebuild/engine/native-load.cjs dd197849fe92a493dee86ed7c530bdc9e1c22d382004fa4ee6c04968de7e0a73
- FC03 rebuild/m4/workout/native-load-effects.cjs 38c67a9855a698392ae6a422f5cc8a7101aa16a74592019b3021462354b9e1c3
- FC12 rebuild/m4/spec/native-load-options.test.cjs 5de5b74e25b6d0b8707191c21a5d1ea8d9b8b8d914a0d0dc6f9a597d09a1f040 (446 rows)
- FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs eb3693000e8349c78c83ed8fb4deddc23901153bd12e24bb1fef4dad5849b752 (103)
- report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md 6597d9beef0688b506ee66491f2d60be667512d0bf40a85c4118013959333b5f (read last)
- spec R9.13 7ef8291:rebuild/coach/NATIVE-LOAD-SPEC.md eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb (cmd /c git show, byte-exact)
- round-33 FC03 for every before/after: fef0fe3:rebuild/m4/workout/native-load-effects.cjs 371154a9caceeda8c0c642bf4c14b07a33c7e441f37fbe4c7b16004dba410ef7
  (the obs-sweep commits fef0fe3 = round 33 and 96354fe = round 34 hold the rounds' bytes; 96354fe's five hashes equal the worktree's)

VERDICT: ACCEPT WITH NAMED DEBTS (D-R34F-1..3)
REQUIRED CHANGE: no

Method: every run through node %TEMP%\pm-run.cjs shared, one slot at a time (jobs fable-r34-p1..p4); scratch %TEMP%\review-nlb-r34-fable-scratch
(run34.ps1 and deps-loader.mjs copied from the Opus R33 scratch, scratch path changed; earned-look-cui4 junction; guard.cjs; TZ America/New_York,
MEASURED_TEST_NOW 2026-09-03; guard: nothing protected loaded). The round-33 FC03 and every mutant ran IN MEMORY through swap.cjs (a
Module._compile swap at FC03's own path; "RVW_SWAP ... :1" printed in each such TAP); the object files were never written. Read before the
report: spec :154-:166, FC01, FC03 whole (sameCut :822-:852, the accept :900-:1070, S4/gone :500-:560, provenBefore :295, basisOf coverage),
engine-history.cjs :84-:120, continuation.mjs :24-:35, public-client.mjs :322-:341, today-bindings.mjs :704-:725, DECISIONS:865-:868, both R33
reads; then the report's Round 33 and Round 34 (its numbers agree with mine; nothing below is taken from it).

## (1) PRODUCT: measured yes on every clause
- The hunk (git diff fef0fe3 96354fe, explicit paths): FC03 +7/-2 = a 3-line comment, `yes = []` on sameCut, the removed_facts loop (2 lines),
  the call site passing [...g.ops, ...(g.alt || [])]; FC12 +223/-0 (one hunk at :8364, append-only). FC01 and FA03 absent from the diff
  (hashes dd197849 and eb369300 at both commits). PRODUCER_REVISION (FC03:1291, 3c86253710607d45...) not in the hunk. No string literal in
  any + line: no displayed string changed.
- Reading: :155 ORIGINAL CUT asks "exact fact-op coverage". The projector keeps a removed set in slot.removed_facts with its source op and
  edit ops, the removal op itself appended to edit_op_ids (engine-history.test.cjs:94 pins [changed, removed]); coverage is every session-class
  op at the check (basisOf). So a removal AFTER the yes carries an op outside coverage that is not proven before any response; the cut is
  unreproduced, the record goes to S1-S8 (S4 binds the removed fact via `gone`, FC03:525) and applies as written; its own
  BASIS_REPAIR_REQUIRED only from evidenceChanged (:166), the pre-existing rule for a later correction. Conforms to :155 D-R9-1 and :166.
  A removal BEFORE the yes is inside coverage (or, outside it, proven before the yes) and takes exactly the round-33 path.
- The "outside coverage but proven before the yes" branch is unreachable on the real host: respond() re-projects and requires the held
  issuance to equal a fresh offer in full (today-bindings.mjs:716-719 sameIssued; the ticket key again at commit :290), so an edit between
  offer and yes is NATIVE_LOAD_STALE_OFFER, nothing written (FC12 R34-CONTROL (b) measures it on the host).
- No other fold result moved, measured by me three ways: (a) FC12 whole, final bytes 446/446 (80 s); round-33 FC03 swapped in 443/446 (76 s),
  the red rows exactly R34-BR33C1-HOST-WALK-HISTORIES, -HOST-MINIMAL, -FOLD-MINIMAL; all 441 round-33 rows (R7/R8 walks and fuzzes at
  defaults included), R34-CONTROL and R34-ISSUANCE-TWO-REMOVED-FACTS pass under both. (b) FA03 whole through the real host 103/103 under
  both FC03s. (c) The real-host walk on the same 240 seeds (36001..36240) under both FC03s, per seed the sha256 of the cold reopen's
  [state, issues] with hex ids normalized: 238/238 seeds both folds finish are byte-equal; the only two seeds the round-33 fold refuses
  (36074, 36118) are removal-after-a-yes RECORD_INVALID and pass on the final bytes. End-of-walk issue lists also equal on 36241..36480
  (239/239) and the heavy shard 37001..37240 (239/239); round-33 fails there 36369, 37118, same shape, both pass now.

## (2) THE ROUND 33 ITEM (B-R33C-1), red first, measured
- Real host, the reviewer's seeds through my copy of walk-host.test.mjs, round-33 FC03 swapped in: 33204, 33329, 34175 each
  "RECORD_INVALID after <day> remove: [issuance, demo-press, [op]]" (EXIT 1). Final bytes: all three run to the end; end issues 33204
  [BASIS_REPAIR_REQUIRED demo-press] (the removed set was the earlier adoption's own evidence), 33329 and 34175 none (outside the earn's
  evidence: the yes applies as written). Builder's new host reproduction (R34-BR33C1-HOST-MINIMAL): red under the round-33 FC03, green now.
- The R34 rows assert the spec outcome (spend kept uncancelled, DEBUT entry pending, issues exactly [] or [the adoption's REPAIR], lift held
  when so, cold reopen equal), not just "no RECORD_INVALID"; the control row pins the before-the-yes fold outcome unchanged and the host's
  STALE_OFFER / no-offer-after-a-removal-before-Check paths.

## (3) REAL-HOST WALK (decisive): final bytes, walk-host.test.mjs copied from the Opus R33 scratch, actions and invariants unchanged; I added
a per-seed digest/issue record and WALK_MIX=heavy (up to 4 later edits a day, removals favoured, a corrected fact corrected again or
removed, adoption Undo more often, a yes after a 'no' on the other lift)
| shard | seeds (none used before) | result | yes | removals after a yes | corrections | Undo ack | end issues |
|---|---|---|---|---|---|---|---|
| w1 | 36001..36240 (Opus mix) | 240/240, 0 fails, 483 s | 445 | 309 of 555 | 567 | 63 | REPAIR 156, EFFECT_CONFLICT 2 |
| w2 | 36241..36480 (Opus mix) | 240/240, 0 fails, 482 s | 419 | 332 of 583 | 580 | 65 | REPAIR 162 |
| h1 | 37001..37240 (heavy) | 240/240, 0 fails, 574 s | 311 | 743 of 1733 | 1340 | 118 | REPAIR 150 |
| h2 | 38001..38120 (heavy) | 120/120, 0 fails, 298 s | 189 | 439 of 853 | 669 | 66 | REPAIR 95 |
Union 840 seeds, 0 counterexamples, 1364 yes, 1823 removals after a yes, no RECORD_INVALID at any step, every cold reopen equal.
- The two EFFECT_CONFLICT endings, traced (out\trace-36152.json, -36235.json), identical under the round-33 FC03: 36152: D2 YES press earn
  E1 (DEBUT 45, evidence D1+D2); D3 press 45 x12 x2 (the debut lands); D4 YES press earn E2 (base 45, DEBUT 50); then D1's press set 1
  REMOVED (E1's own evidence) -> E1 BASIS_REPAIR_REQUIRED (:166), its landing refused on the disputed basis, the reconstructed base is 40
  again, E2 (recorded base 45) refuses R8 UNPROVABLE ORDER EFFECT_CONFLICT load_basis, spend kept, lift held. 36235 the same shape (D2's
  press set 2 removed). Spec-prescribed as written (:165/:166; Undo and exit (b) are the resolutions), pre-existing, not this hunk: D-R34F-2.
- Walk artefact, not a defect: a second yes in one Check round returns NATIVE_LOAD_STALE_OFFER (the first yes enters the next offer's
  coverage; the walk reads view() once, the panel refreshes after a yes, :148); nothing written. Seen in the Opus and my runs alike.

## (4) MUTANTS of the new hunk (20, mine; mut\F34-Mxx.cjs = one string edit of the r34 bytes, matched exactly once; each: FC12 whole under
the mutant + the real-host walk on 33204 and 34175 under the mutant)
| id | change | FC12 | red rows | host 33204 / 34175 | class |
|---|---|---|---|---|---|
| M01 | removed_facts loop deleted (round-33 behaviour) | 443/446 | HOST-WALK, HOST-MINIMAL, FOLD-MINIMAL | FAIL / FAIL | KILLED |
| M02 | coverage test inverted | 443/446 | the same three | FAIL / FAIL | KILLED |
| M03 | proven-before-the-yes escape removed | 445/446 | CONTROL (a) | pass / pass | KILLED (control only) |
| M04 | call passes no responses | 445/446 | CONTROL (a) | pass / pass | KILLED (control only) |
| M05 | call passes g.ops only (alt dropped) | 446/446 | - | pass / pass | LIVE, equivalent: alt exists only for a compensate recorded as several bodies; one response per Undo on the host |
| M06 | source op only (edit ops incl. the removal ignored) | 443/446 | the same three | FAIL / FAIL | KILLED |
| M07 | edit ops only (source op ignored) | 446/446 | - | pass / pass | LIVE, equivalent: a removed fact's source op is outside coverage only if logged after the yes into a closed session (continuation.mjs:30 refuses) |
| M08 | yes.some -> yes.every | 446/446 | - | pass / pass | LIVE, equivalent: one response per yes (STALE_OFFER for a second) |
| M09 | provenBefore direction reversed | 442/446 | the three + CONTROL | FAIL / FAIL | KILLED |
| M10 | a later removal returns true | 443/446 | the same three | FAIL / FAIL | KILLED |
| M11 | an op absent from the log passes | 446/446 | - | pass / pass | LIVE, equivalent: the reader builds removed_facts from authenticated ops |
| M12 | map(r) inverted | 443/446 | the same three | FAIL / FAIL | KILLED |
| M13 | first removed fact of every slot skipped | 443/446 | the same three | FAIL / pass | KILLED |
| M14 | last edit op (the removal) ignored | 443/446 | the same three | FAIL / FAIL | KILLED |
| M15 | every op counts as proven before the yes | 443/446 | the same three | FAIL / FAIL | KILLED |
| M16 | no op counts as proven before the yes | 445/446 | CONTROL (a) | pass / pass | KILLED (control only) |
| M17 | removed facts read only on a slot without a live fact | 446/446 | - | pass / pass | LIVE, equivalent: after a Close no re-log and no undo of a removal (public-client.mjs:339), so an after-the-yes removal leaves no live fact |
| M18 | proof by device sequence only | 446/446 | - | pass / pass | LIVE, equivalent on one device; a second device is unmeasured (D-R34F-3) |
| M19 | && between coverage and proof -> \|\| | 445/446 | CONTROL (a) | pass / pass | KILLED (control only) |
| M20 | call passes the first response only | 446/446 | - | pass / pass | LIVE, equivalent: one response per yes |
13 KILLED (9 also observable on the real host; M03/M04/M16/M19 only by the synthetic before-the-yes record, the branch the host cannot
reach), 7 LIVE, none observable on a genuine-use input. No blocker.

## (5) NAMED DEBTS and what I could not verify
- D-R33-1..5 / D-R33C-1..6 / D-READER-ONLY: re-read against my own host reads: continuation.mjs:30 refuses every write into a closed session
  (WORKOUT_ALREADY_CLOSED); public-client.mjs:339 refuses an edit whose target is not a live included fact (no undo of a removal, no edit of a
  removed set); respond() refuses a stale offer. The real host cannot reach any of them on one device; they stay named. The round-34 report's
  D-R34-1 (a yes recorded on an issuance that never saw an earlier removal still refuses RECORD_INVALID issuance) is the same class:
  host-unreachable (STALE_OFFER), reader-only; carried as D-R34F-1.
- D-R34F-1: reader-only stale yes = the report's D-R34-1 (CONTROL (a) shape); reopens only if a sync, import or second device writes it.
- D-R34F-2: observed, spec-conforming, pre-existing: a removal inside a LANDED earn's own evidence after a later yes on the landed base ends
  with that later yes held EFFECT_CONFLICT (R8 UNPROVABLE ORDER as written; seeds 36152, 36235 above, identical under the round-33 FC03).
  Its exits (Undo of the held record; exit (b) on the next completion) were not exercised by the walk: not verified here.
- D-R34F-3: a second device (provenBefore's causal arm; M18) is unmeasured, as in every round: the walk writes one device.
- Not verified: CI (rebuild.yml) for the new host rows' imports (the PM's hosted sweep); the two EFFECT_CONFLICT exits above.

Disclosures: the three patches to my scratch walk copy (WALK_TRACE, the normalized digest) and two plan-file edits were written with a .NET
file write (LF, ASCII) instead of write_file, scratch only; w2/h1 shards ran with the un-normalized digest, so their before/after is at the
issue-list level only (section 1 (c) is the normalized shard 36001..36240, re-run as w1n/w1n-r33). The first PowerShell session was lost to a
recursive directory listing (StackOverflow) and restarted; nothing of the object was touched. Nothing committed, staged or pushed;
DECISIONS/STATUS untouched; the five object files re-hashed equal at the end; my only write outside scratch is this file.
