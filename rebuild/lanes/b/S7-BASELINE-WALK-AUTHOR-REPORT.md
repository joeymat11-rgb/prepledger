# S7-BASELINE-WALK: author report (lane B tooling)

Ticket of record: DECISIONS:516, over the S7 tooling history at :511 and :515.
Branch `rebuild/b-s7-port-admission`, worktree `%TEMP%\earned-s7`, base 742f3543
(the tip merged at fa3e37a, the artifact proposed at 742f354).

Commits, in order:

| sha | what |
|---|---|
| `e0f3345` | S7-BASELINE-WALK: cell, red first |
| `3e41d7e` | S7-BASELINE-WALK: raise the hop bound; S7.json re-measured |
| this file | S7-BASELINE-WALK: author report |

## 1. The defect, stated as it was measured

`baselineOf(bound)` at b-package.cjs:1839 walks the accepted chain from
`bound.option.artifact` through `parent.artifact` links looking for the artifact
that still carries `baseline.publicPins` and `baseline.auditCommit`. It walked at
most eight hops. From the S7 bound, whose parent option is
`rebuild/m4/spec/acceptance-s6-today-child.json`, the baseline-bearing artifact is
the NINTH read, at hop 8:

| hop | artifact | carries baseline |
|---|---|---|
| 0 | rebuild/m4/spec/acceptance-s6-today-child.json | no |
| 1 | rebuild/m4/spec/acceptance-s5-today-child.json | no |
| 2 | rebuild/m4/spec/acceptance-s4-real-day.json | no |
| 3 | rebuild/m4/spec/acceptance-s3-companion.json | no |
| 4 | rebuild/m4/spec/acceptance-h3-clean-init.json | no |
| 5 | rebuild/m4/spec/acceptance-b-ntc-native-trend-context.json | no |
| 6 | rebuild/m4/spec/acceptance-native-carriers.json | no |
| 7 | rebuild/m4/spec/acceptance-load-writes.json | no |
| 8 | rebuild/conform/v4/postfix/acceptance-step-efficacy.json | YES |

THE MEASURED HOP IS 8. The old bound `hop < 8` executed hops 0 through 7 and
stopped one read short, so `baselineOf` returned null, `historical()` printed
`HISTORICAL AUDIT SKIPPED; the chain baseline is unresolved until the PM names the
parent` and noted the open obligation `historical audit baseline unresolved`
(b-package.cjs:3081-3082). An open obligation blocks the seal: `ready` is
`last.authorized && !open.length` at :3185.

S6 stood at hop 7 and fitted. S7 is the first generation to fall off the end.

## 2. Red first (e0f3345)

The cell is `S7-BASELINE-WALK`, appended to
`rebuild/lanes/b/tooling/test/parent-pin-shapes-and-spec-successors.test.cjs`,
which is the suite that already covers the runner's chain walking (`parentPin()`,
`pins()`, the parent and grandparent artifact links). What that file's own fixture
cannot answer is a question about the REAL accepted chain, so the cell compiles a
SECOND instance of the real runner the way `execution-targets.test.cjs` compiles
it, but AT THE RUNNER'S OWN PATH, so `root` resolves to this checkout and `rel()`
reads the artifacts that are actually on disk. Nothing is forged and nothing is
written: `baselineOf` only reads.

It asserts three things:

(a) walking `parent.artifact` from the S7 proposed artifact's own parent, exactly
    as `baselineOf` walks, reaches the artifact carrying `baseline.publicPins` and
    a string `baseline.auditCommit`, and it is
    `rebuild/conform/v4/postfix/acceptance-step-efficacy.json`;
(b) it stands at the MEASURED hop, recorded in the cell as
    `MEASURED_BASELINE_HOP = 8` with a comment saying the number is a record of
    this generation's chain depth and never the walk's bound;
(c) the runner's own `baselineOf`, called on the S7 bound
    `{ option: { artifact: <the spec's chosen parent artifact> } }`, returns a
    non-null baseline that carries `publicPins` and `auditCommit`, agreeing with
    the artifact the hand walk reached and carrying
    `rebuild/conform/v4/run-defect-laws.cjs`, the audit runner `historical()`
    requires.

RED, measured against the UNCHANGED runner at e0f3345 on this PC
(TZ America/New_York, MEASURED_TEST_NOW 2026-09-03, node v24.19.0):

```
node --test --test-reporter=tap rebuild/lanes/b/tooling/test/parent-pin-shapes-and-spec-successors.test.cjs
# tests 9
# pass 8
# fail 1
not ok 9 - S7-BASELINE-WALK: the audit baseline is found up the real S7 chain, and baselineOf resolves it
  error: 'BASELINE-UNRESOLVED; baselineOf returned null for the S7 bound whose baseline stands at hop 8'
exit 1
```

The reason is exactly the defect and nothing else: (a) and (b) are GREEN against
the unchanged runner, so the chain does carry the baseline and the walk does reach
it at hop 8; only (c), the runner's own function, returns null.

## 3. The change (3e41d7e)

One hunk in `rebuild/lanes/b/tooling/b-package.cjs`, 11 insertions and 1 deletion,
nothing else in the runner:

```diff
+// S7-BASELINE-WALK (DECISIONS:516). The bound below guards a walk over ACCEPTED artifacts
+// against a MALFORMED CYCLE; it is not a statement about the chain's depth. Every reseal
+// child adds one hop, so the depth grows with the chain and a bound that tracked it would
+// have to be moved by every generation. The previous literal 8 encoded the depth AT THE
+// TIME IT WAS WRITTEN and S7 is the first generation to fall off the end of it: the
+// baseline-bearing artifact stands at hop 8 from the S7 bound, the walk stopped after hop
+// 7, baselineOf returned null, and historical() printed HISTORICAL AUDIT SKIPPED and noted
+// an open obligation that blocks the seal. 64 is past any chain this project will grow and
+// still terminates a cycle in a bounded number of reads.
+const BASELINE_WALK_MAX_HOPS = 64;
 function baselineOf(bound) {
   let file = bound && bound.option.artifact;
-  for (let hop = 0; file && hop < 8; hop++) {
+  for (let hop = 0; file && hop < BASELINE_WALK_MAX_HOPS; hop++) {
```

No law, guard, cell or needle was weakened to make anything green: the constant is
strictly LARGER than the literal it replaces, so every walk the old code completed
completes identically, and a malformed cycle still terminates. The walk still
stops at the first artifact that carries a baseline, and `historical()` still
verifies every pinned baseline byte out of Git at `baseline.auditCommit` before it
runs.

## 4. Counts, all run on this head

| what | command | result |
|---|---|---|
| the cell alone, unchanged runner | node --test on the suite | 9 / 8 pass / 1 fail, exit 1 (RED) |
| nine lane B tooling suites, after the change | node --test on all nine | 106 tests / 106 pass / 0 fail, exit 0 |
| five `s7-supersede-*` cells | node --test on the five | 16 tests / 16 pass / 0 fail, exit 0 |
| `s7-engine-files-differential.cjs` | node on the script | exit 0, declared needle printed whole |

The nine tooling suites stood at 105 before this round; the one added test is this
round's cell. The suites were run again AFTER the spec re-measure below, with the
same 106 / 106 / 0, because the cell and F6/F7 read `packages/S7.json` by path.

## 5. The re-measure

The runner moved, so every spec that pins it by sha256 goes stale. The five
ancestors re-pinned here are exactly the five the S7-TOOLING round re-pinned at
3514616, for the same reason and with no role change. Every value below was
re-taken from disk and from Git at this head by script, never typed.

| file | field | before | after |
|---|---|---|---|
| b-package.cjs | its own bytes (257673 B) | `a07df1e0942a017f...` | `0fb0570d812ea1c1...` |
| packages/H3.json | tooling.runnerSha256 | `a07df1e0...` | `0fb0570d...` |
| packages/S3.json | tooling.runnerSha256 | `a07df1e0...` | `0fb0570d...` |
| packages/S4.json | tooling.runnerSha256 | `a07df1e0...` | `0fb0570d...` |
| packages/S5.json | tooling.runnerSha256 | `a07df1e0...` | `0fb0570d...` |
| packages/S6.json | tooling.runnerSha256 | `a07df1e0...` | `0fb0570d...` |
| packages/S7.json | tooling.runnerSha256 | `a07df1e0...` | `0fb0570d...` |

and, in `packages/S7.json`'s own product map, the post-image of each file whose
bytes those edits moved:

| declared path | role | post before | post after |
|---|---|---|---|
| rebuild/lanes/b/tooling/b-package.cjs | edited | `a07df1e0942a017f44afcfa1b6b92d8f96ee6f5e20f9e4e8450072c76e9268a5` | `0fb0570d812ea1c1a9426281ae39c8101c1ddd0206b11ad5efa7a3778339cf8d` |
| rebuild/lanes/b/tooling/packages/H3.json | edited | `f6f28c14619a20c0...` | `f1934b8bcce0364fff42aa18cc90d57b8e20cb2a08e1cc96a720c686b05b70cc` |
| rebuild/lanes/b/tooling/packages/S3.json | edited | `bf97c009c9b271f7...` | `0d3bc08699f4bb25983c97f159f172410716764642ec5a521c2c3474ce35137e` |
| rebuild/lanes/b/tooling/packages/S4.json | edited | `2bc773b5778c06cc...` | `797830e0b20d096a925da5e5e8427dd0b6c5d90bf3c8e56c028bd83645c1d007` |
| rebuild/lanes/b/tooling/packages/S5.json | edited | `4191a802683ed8e4...` | `2923654580ae6ac28bce7483e9d7a1e9786dc798c93353682c9181e0409061b5` |
| rebuild/lanes/b/tooling/packages/S6.json | superseded-by-child | `8b33bf5a434f98a9...` | `77f24fd77460a10e7637fb6a181c6ecfc39db0ab55e3d5897b9b9770f9b63107` |

`packages/S7.json` itself is then
`e7658e21f1178f8316ae6dadc3f13d1cd62210fd37693086fd7c4fcbe65ba285` (83449 bytes),
was `1a11772301db5533dcb5776930767b52111cf27ffe8089cae5237439489e7f46`.

Nothing else in any spec moved. No path was added or dropped and no role changed.
Re-hashing EVERY declared path against disk and against Git at HEAD:

```
declared paths 206 | roles {"edited":23,"carried":173,"superseded-by-child":1,"new":9}
disk mismatches 0 | git mismatches 0 | pre-image vs parent mismatches 0
parent pinned 196 product + 62 executionPins; all 196 parent product pins declared
```

The two parent execution pins S7 does not declare
(`rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md`,
`rebuild/m3/w7-preview/today/test/catalogue.test.mjs`) are untouched by this round
and stand exactly as the S7-TOOLING round left them; `pins()` re-asserts them at
run time as un-superseded parent pins.

## 6. What was deliberately NOT touched

1. THE BRIEF. `rebuild/lanes/b/S7-PORT-ADMISSION-BRIEF.md` section 5.1 says the
   runner "now stands at sha256 `a07df1e0...`", which this round makes stale
   prose. Its bytes are accepted BY SHA at DECISIONS:513
   (`e51a83297fda8a0fcbe15ffa7ce241e2dec98325c0fa72767dd36691ca660251`, 26571 B)
   and `brief.acceptedLedgerLine` in packages/S7.json binds that line's own
   sha256, so editing the brief would move the brief sha and void :513. The
   S7-TOOLING round left its N7 prose slip standing for exactly this reason and
   corrected it in VERDICT-S7.md instead. SAME TREATMENT ASKED FOR HERE: the
   runner sha sentence in brief 5.1 is corrected in VERDICT-S7.md, not in the
   brief. `brief.sha256` in packages/S7.json still matches the brief on disk.
2. THE PROPOSED ARTIFACT. `rebuild/m4/spec/acceptance-s7-port-admission.json`
   (proposed at 742f354) still embeds the old runner and spec sha256. That is the
   integrator's move, through the runner's own `proposed()`, after this review;
   this round neither re-proposes it nor runs `--ci` or `--full`.
3. `rebuild/DECISIONS.md`, the four FIX product files, the engine, the coach
   constant, `main`, and every ref but `rebuild/b-s7-port-admission`.
4. The other package specs (`B-NTC`, `B1`, `B2`, `B3`, `B4`). They are declared
   `carried` and were not re-pinned by the S7-TOOLING round either.

## 7. Hygiene

Lockdown numstat over authority, client, engine, coach, port, w6-host, w7-today
and DECISIONS: EMPTY for both commits of this round. Zero U+2013 and zero U+2014
in every line this round writes. Nothing under `rebuild/conform/private` was
listed, read, hashed, copied or printed, and no private value, count or hash
appears anywhere above. No file was deleted.

## 8. What the integrator does next

Re-propose the artifact through `proposed()`, then `--ci --package S7` to PUBLIC
CI EVIDENCE PASS, then the FULL chain per VERDICT-S6.md and DECISIONS:515. With
the bound raised, `--full --package S7` reaches `historical()` with a resolved
baseline instead of printing HISTORICAL AUDIT SKIPPED, and the open obligation
`historical audit baseline unresolved` no longer stands against `ready`.
