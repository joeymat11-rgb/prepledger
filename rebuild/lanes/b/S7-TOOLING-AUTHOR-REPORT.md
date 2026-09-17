# S7-TOOLING - author report (lane B, the seal runner accepts M2-S7-PORT-ADMISSION)

Ticket: the seven tooling facts of `DECISIONS:511`, mirrored from the S6 round, so that
`--ci --package S7` reaches the same refusal S6 reached at this point in its own chain and no
further. Branch `rebuild/b-s7-port-admission`, worktree on the owner's Windows PC, node from the
codex runtime, `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`. Base `71d420cb`.
Nothing under `rebuild/conform/private`, `src/history.js`, `ledger/` or any soak path was opened;
`--full` was never run.

## 1. The refusal chain, measured

Every line below is the runner's own last line, quoted verbatim, with the exit code the run wrote
into its own log. Logs are outside the worktree, under `%TEMP%\s7out\`.

| # | state of the branch | terminal line | exit | log |
| --- | --- | --- | --- | --- |
| R01 | `71d420c`, nothing moved (RED FIRST) | `B PACKAGE USAGE REFUSED; exactly: --ci\|--full --package B-NTC\|H3\|S3\|S4\|S5\|S6\|B1\|B2\|B4\|B3` | 1 | `r01.log` |
| R02 | fact 1 landed (`IDS` gains `'S7'`) | `B PACKAGE S7 FAIL REGISTER-D-ID-INVENTORY-EMPTY-AND-NOT-EXEMPT; required evidence missing or failed; local diagnostics withheld` | 1 | `r02.log` |
| R03 | fact 2 landed (`NO_REGISTER_IDS` gains `'S7'`) | `B PACKAGE S7 FAIL CHILD-ARGV-TARGET; required evidence missing or failed; local diagnostics withheld` | 1 | `r03.log` |
| R04 | fact 3 landed (`CHILD_ROOTS` gains `rebuild/lanes/d/p3-port-fix/`) | `B PACKAGE S7 FAIL CHILD-ARGV-TARGET; required evidence missing or failed; local diagnostics withheld` | 1 | `r04.log` |
| R05 | fact 4 landed (the six `s7-*` cells written and declared) | `B PACKAGE S7 FAIL RECEIPT-EXACT-LINE-MISSING; required evidence missing or failed; local diagnostics withheld` | 1 | `r05.log` |
| R06 | facts 5, 6, 7 landed and every pin re-measured | `B PACKAGE S7 FAIL RECEIPT-EXACT-LINE-MISSING; required evidence missing or failed; local diagnostics withheld` | 1 | `r06.log` |

R03 and R04 carry the same code for two different files: at R03 the refused target is
`rebuild/lanes/d/p3-port-fix/programme-rule.test.mjs`, which stands under no child root; at R04 the
root exists and the refused targets are the six `rebuild/m4/workout/test/s7-*` files, which did not
exist yet. Landing fact 3 without fact 4 is therefore visible as its own step and not a silent one.

**`RECEIPT-EXACT-LINE-MISSING` is the refusal this ticket stops at, and it is the right one.** It is
raised by `rebuild/conform/v4/postfix/legacy-gates.cjs:verifyReceipt`, which reads
`rebuild/DECISIONS.md` at the candidate base, hashes every line, and requires exactly one line whose
sha256 is the cited `lineSha256`. `rebuild/DECISIONS.md` ends at line 510 on this branch, so the
THEME line the spec cites at `:512` and the BRIEF-BY-SHA line at `:513` are not there to be found;
the GATE-SUPERSESSION line at `:514` is located the same way. Those three lines are the PM's to
append. Nothing inside this ticket's scope can close it, and nothing was weakened to try.

**One red was measured below the runner rather than through it**, because the ledger refusal above
stops `--ci` before `children()` runs. With facts 1 to 6 landed and fact 7 not, the `today-17` child
exits 1 at `# pass 680 / # fail 2`:

- `not ok 8 - P-MEASURE (g) - no S4-sealed file drifts except where a declaring spec says so, and
  this lane's own drift is today-app.cjs` at `measure/test/boundary.test.mjs:106`, naming
  `.github/workflows/rebuild.yml` and `rebuild/lanes/b/tooling/b-package.cjs`;
- `not ok 581 - re-pin - every file the B-NTC package pins is untouched by A4b, on disk` at
  `today/test/setup.test.mjs:2338`, naming `.github/workflows/rebuild.yml on disk afce33cf1925 but
  pinned 839a79ab2eec`.

Both are the declaring-spec chain refusing a move this package declares, because `CHILD_SPECS` did
not yet reach `S7`. With fact 7 landed the same child reads `# pass 682 / # fail 0`, exit 0, which
is S6's own needle unchanged. Log: `child-today-17.log`.

## 2. The diff, per file

Three commits in round 1 and one more in the fix round after review R1, on top of `71d420c`.
`git diff --numstat 71d420c..HEAD` over the product tree, cumulative:

| file | lines | fact | what |
| --- | --- | --- | --- |
| `rebuild/lanes/b/tooling/b-package.cjs` | +26/-3 | 1, 2, 3 | `IDS` gains `'S7'` behind `'S6'` (`:165`); `NO_REGISTER_IDS` gains `'S7'` (`:292`); `CHILD_ROOTS` gains `rebuild/lanes/d/p3-port-fix/` as its nineteenth root (`:381`). Each hunk carries its own paragraph in the file's own voice. `PUBLIC_TAIL_ROOTS` is NOT widened. |
| `rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs` | +23/-8 | 6 | F6 takes `IDS` of eleven and `NO_REGISTER_IDS` of seven by literal and by `deepEqual`; F7 takes `CHILD_ROOTS` of nineteen in the whole-list, the `slice(8)` and the length assertions. F8's `PUBLIC_TAIL_ROOTS` assertions are untouched and still pass, which is the check that the new root did not leak into the print policy. |
| `rebuild/m3/w7-preview/measure/test/boundary.test.mjs` | +11/-1 | 7 | `CHILD_SPECS` gains `'S7'`, youngest last. |
| `rebuild/m3/w7-preview/today/test/food.test.mjs` | +11/-1 | 7 | as above |
| `rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs` | +11/-1 | 7 | as above |
| `rebuild/m3/w7-preview/today/test/problem.test.mjs` | +11/-1 | 7 | as above |
| `rebuild/m3/w7-preview/today/test/setup.test.mjs` | +11/-1 | 7 | as above |
| `rebuild/m4/workout/test/s7-supersede-source-carriers.test.cjs` | +184 new | 4 | mirror of the s6 sibling |
| `rebuild/m4/workout/test/s7-supersede-inherited-carriers.test.cjs` | +147 new | 4 | mirror of the s6 sibling |
| `rebuild/m4/workout/test/s7-supersede-defect-witnesses.test.cjs` | +177 new | 4 | mirror of the s6 sibling |
| `rebuild/m4/workout/test/s7-supersede-second-gate.test.cjs` | +170 new | 4 | mirror of the s6 sibling |
| `rebuild/m4/workout/test/s7-supersede-writers-differential.test.cjs` | +199 new | 4 | mirror of the s6 sibling |
| `rebuild/m4/workout/test/s7-engine-files-differential.cjs` | +101 new | 4 | mirror of the s6 sibling |
| `rebuild/lanes/b/tooling/packages/H3.json` | +1/-1 | 5 | `tooling.runnerSha256` onto the moved runner |
| `rebuild/lanes/b/tooling/packages/S3.json` | +1/-1 | 5 | as above |
| `rebuild/lanes/b/tooling/packages/S4.json` | +1/-1 | 5 | as above |
| `rebuild/lanes/b/tooling/packages/S5.json` | +1/-1 | 5 | as above |
| `rebuild/lanes/b/tooling/packages/S6.json` | +1/-1 | 5 | as above; this is the parent EXECUTION pin |
| `rebuild/lanes/b/tooling/packages/S7.json` | +66/-31 | 5 | the re-measure, section 4 below; the fix round moves four sha strings inside it and nothing else |
| `rebuild/lanes/b/S7-PORT-ADMISSION-BRIEF.md` | +59/-29 | - | section 5.1 in round 1; sections 2, 2.6, 3.3 and one clause of 5.1 in the fix round, review NOTE N3 (section 10) |

**Lockdown.** `git diff --numstat 71d420c HEAD` over `rebuild/DECISIONS.md`, `rebuild/engine`,
`rebuild/coach` and the four product files FIX and FIX-2 moved
(`source-admission.mjs`, `import-screen.mjs`, `replay-registry.cjs`, `plan-edit-model.cjs`) is
EMPTY. No product byte of the owner's import path moved in this ticket; no engine byte moved; the
coach constant stands where section 5 of the brief keeps it. Zero U+2013 and U+2014 in every added
line of the whole diff (scanned over `git diff 71d420c`).

**How the six `s7-*` cells were checked.** Each was written and then diffed against its s6 sibling
with `git diff --no-index`, and the diff is EXACTLY the intended substitutions and nothing else:
the package name `M2-S6-TODAY-CHILD` to `M2-S7-PORT-ADMISSION`, `S6` to `S7`, the parent from
`M2-S5-TODAY-CHILD` to `M2-S6-TODAY-CHILD`, the parent's token line from `DECISIONS:462` to
`:490`, `packages/S6.json` to `packages/S7.json`, the generation prose from FOURTH to FIFTH, the
`SUP-4` parent assertion from `'M2-S5-TODAY-CHILD'` to `'M2-S6-TODAY-CHILD'`, and two sentences
that named what S6 moved now naming what S7 moves. Not one assertion was removed, relaxed or
reordered; every `assert.deepEqual`, `assert.throws`, red-first and mutation control is the s6 one.

## 3. The needle table, re-measured

Every one of the 24 declared children was run the way `children()` runs it: `node` with the
child's own argv, `cwd` = the worktree, `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`,
`NODE_OPTIONS` and `NODE_V8_COVERAGE` cleared, `EARNED_CLIENT_DIR` set to `rebuild/client`. The
needle was taken from the run's own stdout and matched with the runner's own rule
(`^<needle>` multiline). Per-child logs: `%TEMP%\s7out\child-<name>.log`.

| child | old needle (S6) | measured on this head | |
| --- | --- | --- | --- |
| today-17 | `# pass 682` | `# pass 682` | same (red at 680 until fact 7 landed) |
| measure-hermetic | `# pass 11` | `# pass 11` | same |
| s4-real-day | `# pass 15` | `# pass 15` | same |
| a0-journeys | `# pass 23` | `# pass 23` | same |
| s7-sup-source-carriers | (new) | `# pass 4` | measured |
| s7-sup-inherited-carriers | (new) | `# pass 3` | measured |
| s7-sup-defect-witnesses | (new) | `# pass 3` | measured |
| s7-sup-writers-differential | (new) | `# pass 3` | measured |
| s7-sup-second-gate | (new) | `# pass 3` | measured |
| engine-files-differential | (new) | `ENGINE FILES DIFFERENTIAL: 27 tracked ... 18 named and NOT ONE moves ... all 45` | measured |
| d-plan-edit | `# pass 68` | `# pass 89` | **MOVED** |
| m4-import | `# pass 62` | `# pass 62` | same |
| m4-import-production | `# pass 28` | `# pass 28` | same |
| d-import-retract | `# pass 13` | `# pass 13` | same |
| d-admission-swap | `# pass 4` | `# pass 4` | same |
| d-replay-measure | `# pass 9` | `# pass 9` | same |
| d-capture-start | `# pass 14` | `# pass 14` | same |
| food-live-save | `# pass 6` | `# pass 6` | same |
| w7-import | `# pass 35` | `# pass 35` | same |
| w6-host-seams | `# pass 9` | `# pass 9` | same |
| w6-local-source | `# pass 26` | `# pass 26` | same |
| d-replay-all | `# pass 28` | `# pass 28` | same |
| b-lom | `# pass 30` | `# pass 30` | same |
| d-port-admission | `# pass 31` (copied from `DECISIONS:510`) | `# pass 31` | measured, and it agrees |

**The one that moved, and why it is not a finding.** `d-plan-edit` runs
`rebuild/lanes/d/plan-edit/model.test.cjs` beside three untouched suites. That file is one of the
seven sibling test files the accepted P3-PORT-FIX and P3-PORT-FIX-2 rounds moved, and it carries
binding correction B-1 of the spec's review R2 plus the FIX-2 cells; `DECISIONS:510` measures the
plan-edit model suite alone at 54/0 against S6's own figure for it. The child's total therefore
rises from 68 to 89 and the needle is re-measured, never guessed. The other five children that
execute a file this package moves (`w6-local-source`, `w7-import`, `d-import-retract`,
`m4-import`, `m4-import-production`) all land on S6's own numbers, which is itself a measurement:
those four rounds added cells inside files whose suites were already counted at those totals.

## 4. packages/S7.json, re-measured in full

- **Every `pre` and `post` is a sha256 taken from Git or from disk on this head by a script, never
  typed.** 206 declared paths: **23 edited**, **9 new** (`pre: null`), **173 carried**
  (`pre === post`), **1 superseded-by-child**.
- `tooling.runnerSha256` = `a07df1e0942a017f44afcfa1b6b92d8f96ee6f5e20f9e4e8450072c76e9268a5`
  (256838 B), byte-identical on disk and in Git at HEAD, which the runner asserts twice.
- `rebuild/lanes/b/tooling/b-package.cjs` role `edited`, pre `8d9a94c20faa...` (S6's post),
  post `a07df1e0942a...`.
- `packages/H3.json` `9add6dbc31df... -> f6f28c14619a...`, `S3.json`
  `a7da42466f04... -> bf97c009c9b2...`, `S4.json` `02c96e3c8542... -> 2bc773b5778c...`,
  `S5.json` `fc60f76173d0... -> 4191a802683e...`, all role `edited`; `packages/S6.json`
  `2415c473b090... -> 8b33bf5a434f...` role `superseded-by-child` over the parent EXECUTION pin,
  which the runner confirms: `1 declared role "superseded-by-child" over a parent EXECUTION pin,
  each equal to the parent byte (rebuild/lanes/b/tooling/packages/S6.json)`.
- The five `CHILD_SPECS` cells and the lane B tooling cell are role `edited` with their pre at the
  parent's own post; the six `s7-*` cells are role `new`.
- `brief.sha256` = `e51a83297fda8a0fcbe15ffa7ce241e2dec98325c0fa72767dd36691ca660251`
  (**26571 bytes**), measured after the fix round's sections 2, 2.6, 3.3 and 5.1 edits (it was
  `41ab30ce...`, 25683 B at the review commit and `d1a2c331...`, 23820 B at the prep); every section
  of the brief the two rounds did not name is byte-identical to the accepted `d03f2f4` text.
- `packages/S7.json` itself: sha256
  `1a11772301db5533dcb5776930767b52111cf27ffe8089cae5237439489e7f46` (83449 B), byte-identical on
  disk and in Git at HEAD (it was `cf7c69b1...` at the review commit; the fix round moved the brief
  sha, the brief's byte count inside the BRIEF line, that line's own sha256 and the tooling cell's
  `post`, which are equal-length substitutions, so the file's length did not change).
- Consistency, run rather than asserted: the nine lane B tooling suites
  (`rebuild/lanes/b/tooling/test/*.test.cjs`, which are what validate a package spec's shape,
  its product phase, its parent pins, its ledger reading, its seal/byte-identity rules and its
  gate supersession) report **105 tests, 105 pass, 0 fail, exit 0**. The six `s7-*` cells report
  **16 pass / 0 fail** across the five suites plus the differential's own exit 0.

## 5. The final `--ci` terminal, verbatim

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S7` at `776b2b4`, the fix-round commit,
exit 1 (`%TEMP%\s7fix\ci.log`). It is the round-1 terminal (`%TEMP%\s7out\r06.log` at `3514616`) and
the reviewer's own (at `f39a868`) line for line, the only differences being the spec sha256 and the
HEAD sha, both of which the fix round moved:

```
B PACKAGE S7 SPEC OBSERVED packages/S7.json 1a11772301db5533dcb5776930767b52111cf27ffe8089cae5237439489e7f46; runner a07df1e0942a017f44afcfa1b6b92d8f96ee6f5e20f9e4e8450072c76e9268a5 byte-identical on disk and in Git at HEAD; status=BRIEF-ACCEPTED; 0 D-ids ; 206 declared product files; 24 declared child(ren), argv file-first under 19 fixed root(s) with only --test --test-reporter=tap permitted; 0 declared move(s), each naming its own original executable in a relative require specifier (moves are refused outright under this runner - TOOLING-REVIEW-r3 X1); no successor carriers declared (every inherited gate must be carried by a parent-pinned executable); 5 byte-identity carrier(s) declared SUPERSEDED under a PM line recorded by sha256 46622ec5a6b3, each with its own named and executed evidence
B PACKAGE S7 PARENT OPTION S6 M2-S6-TODAY-CHILD rebuild/m4/spec/acceptance-s6-today-child.json 0e52357ed62249d4ee94b473e2dde20220b0a82c3737414bba0603fa76bf040f ACCEPTED at 23575c0f1e61ee714fb519cb3607c4779dcd0c24 (DECISIONS:500); artifact byte-identical on disk, in Git at that commit and on refs/remotes/origin/rebuild/t2-client-core; review rebuild/m4/spec/review-s6-today-child.json d21c97590030 byte-identical on disk and on that branch; receipt base 934321f is an ancestor of it
B PACKAGE S7 PARENT BOUND S6 rebuild/m4/spec/acceptance-s6-today-child.json 0e52357ed62249d4ee94b473e2dde20220b0a82c3737414bba0603fa76bf040f; single-parent chain holds - no sibling spec claims it on disk or in Git at HEAD, and no sealed artifact on refs/remotes/origin/rebuild/t2-client-core names it as parent
B PACKAGE S7 POSTFIX M2-S7-PORT-ADMISSION REVIEW-PENDING mode=--ci
B PACKAGE S7 ENVELOPE ABSENT; rebuild/m4/spec/acceptance-s7-port-admission.json is not sealed yet - no PASS word is available
B PACKAGE S7 PARENT PINS RE-ASSERTED at run time; 2 pin(s) from rebuild/m4/spec/acceptance-s6-today-child.json plus its 196 product pins through the inventory below, and 1 un-superseded grandparent pin(s) from rebuild/m4/spec/acceptance-s5-today-child.json, byte-identical on disk AND in Git at HEAD; 197 superseded pin(s) preserved in Git at sourceBase 3d00217; parent artifact byte-identical in Git at 23575c0f1e61ee714fb519cb3607c4779dcd0c24
B PACKAGE S7 PRODUCT IMPLEMENTED; 33 at the declared post-image / 0 at the pinned pre-image / 173 carried byte-identical from the parent / 0 declared role "pinned-unchanged" - executed by a declared child, produced by nothing / 0 unlisted drift; the inventory covers all 196 parent-pinned product files; 1 declared role "superseded-by-child" over a parent EXECUTION pin, each equal to the parent byte (rebuild/lanes/b/tooling/packages/S6.json)
B PACKAGE S7 FIDELITY OBSERVED; sourceBase 3d00217 ancestor of HEAD 776b2b4; 8 engine/conform/m4-spec/lane-b-tooling file(s) changed since sourceBase, all in the fixed inventory; runner a07df1e0942a and spec 1a11772301db pinned (artifact not sealed yet); 16 of 18 PIN_PATHS present in this tree and byte-identical Git vs disk; 2 not in this tree and therefore vacuous (rebuild/conform/goldens rebuild/conform/manifest.json)
B PACKAGE S7 FAIL RECEIPT-EXACT-LINE-MISSING; required evidence missing or failed; local diagnostics withheld
```

(The runner prints U+2014 in three of its own sentences; they are quoted above with a plain hyphen
because this file carries none, and the log holds the exact bytes.)

The run reads the spec, binds the parent, re-asserts every parent pin on disk AND in Git, finds the
whole product inventory implemented with zero unlisted drift, and then refuses for the one reason
this ticket cannot close: the three token lines are not in `rebuild/DECISIONS.md` yet.

## 6. The three token lines, FINAL, and their sha256 over the exact line bytes

Each sha256 below is taken over the line's own UTF-8 bytes exactly as `verifyReceipt` takes them:
the leading `- ` included, no trailing newline, the file split on `/\r?\n/`. They are written into
`packages/S7.json` at `authorizations.theme.lineSha256`, `brief.acceptedLedgerLine.lineSha256` and
`coverage.superseded.rulingLineSha256`. The THEME and GATE texts are the prep's, unchanged; only
the BRIEF line moves, because the brief's own sha256 and byte count moved when section 5.1 was
rewritten in round 1 and again when the fix round closed review NOTE N3. The values below are the
FINAL ones: they are what `packages/S7.json` carries at `776b2b4` and what
`%TEMP%\s7fix\brief-line.txt` holds for the BRIEF line.

The three ledger numbers are right as they stand. `DECISIONS:511` EXISTS: it is on the chain tip
`refs/remotes/origin/rebuild/t2-client-core` at `e02d0cc2`, appended after this branch took its tip
merge at `b33fce8a`, so it is not in this branch's own 510-line copy of `rebuild/DECISIONS.md` and
arrives at step 9's merge. Lines 1 to 510 of the tip's file are byte-identical to this branch's, and
`:511` is the PM's own S7 SEAL PREPARATION line, which ends by naming "the three token lines
(512-514)". Section 10 records the measurement.

| line | ledger | sha256 | bytes |
| --- | --- | --- | --- |
| THEME | `:512` | `f1746fe39a7a98fc7e6c9dd190b4e24cc7761884779d70f6f7a20414398745b5` | 1551 |
| BRIEF-BY-SHA | `:513` | `15bb8a5d12ceecc6294b260797cb30f11a5520cd8d6300514e9a2c14b4ddb2f4` | (text below) |
| GATE-SUPERSESSION | `:514` | `46622ec5a6b30e0e46c2d44c1d2279c0869bceebfa8f2f8036d2ebf1c01c8023` | (text below) |

The three lines, each on ONE line, exactly as they must be appended to `rebuild/DECISIONS.md`
(THEME first, then BRIEF-BY-SHA, then GATE-SUPERSESSION), are in
`%TEMP%\s7out\final-lines.txt` and are reproduced in the author's hand-off message. They are NOT
pasted into this file: a line whose own sha256 must be unique in `rebuild/DECISIONS.md` should not
be duplicated into a second tracked file on the same branch, and `verifyReceipt` reads only
`rebuild/DECISIONS.md`.

## 7. Deviations, and what a reviewer should look at first

1. **Fact 5 was applied to FOUR ancestor specs, not three.** `DECISIONS:511` enumerates
   `H3.json / S3.json / S4.json` as `edited` and `S6.json` as `superseded-by-child`, and the same
   sentence says "exactly the way S6.json treated its ancestors when the runner moved for S6". S6
   re-pinned FOUR ancestors onto its own final runner in commit `7e5fcca`
   (`S6: re-pin H3/S3/S4/S5 onto the final runner`) and gave its own parent, `S5.json`, the
   `superseded-by-child` role. Mirroring that exactly for S7 means H3, S3, S4 AND S5 are `edited`
   and S6 is `superseded-by-child`; enumerating only three would have left `packages/S5.json`
   pinning a runner that no longer exists. The literal enumeration and the "exactly the way"
   instruction disagree by one file, and this ticket followed the pattern. If the PM meant the
   enumeration literally, `packages/S5.json` should be reverted to `carried` at its S6 post and its
   `runnerSha256` left stale; that is one line in two files and it is the PM's call.
2. **The first commit carries no bytes.** `S7-TOOLING: red first (the refusal chain)` is an empty
   commit whose message holds the R01 refusal verbatim. The red-first evidence of a tooling ticket
   IS the refusal chain, and there is no file it belongs in before the author report exists. If the
   PM would rather the red-first state were a file, it is one commit to add.
3. **The `today-17` red of fact 7 was measured below the runner**, because
   `RECEIPT-EXACT-LINE-MISSING` fires before `children()` runs, so no `--ci` run can ever show a
   child red on this branch until the PM's three lines land. The child was therefore run directly,
   with the runner's own env, and both failures are quoted in section 1.
4. **The needles were measured with the runner's env reconstructed, not with the runner itself**,
   for the same reason. The reconstruction was validated by the run itself: 23 of 24 children
   reproduced S6's own needles exactly, which they could not do under a different environment.
   `ENGINE_MAIN` and `ENGINE_OLD`, which the runner adds from `Reference.create`, are read by the
   conform carriers and by no file in any of the 24 children's argv.
5. **The brief's sections 2 and 3 carried the pre-round counts** (199 declared paths, 12 edited,
   3 new, 184 carried, "no superseded-by-child") against 5.1's post-round 206 / 23 / 9 / 173 / 1.
   Round 1 left them, on the ticket's instruction to keep every section but 5.1 byte-identical.
   Review R1 raised it as NOTE N3 and the fix round CLOSED it: sections 2, 2.6 and 3.3 now name
   their own figures as the walk's and carry the post-round list beside them, which moved the
   brief's sha256 and byte count and therefore the BRIEF-BY-SHA line (section 6 has the final
   values). Section 10 has the whole disposition.

## 8. Open questions for the PM

1. **The one in section 7.1**: three ancestor specs or four. This ticket did four.
2. **`rebuild/lanes/d/p3-port-fix/` is a child root but NOT a `PUBLIC_TAIL_ROOTS` member.** That is
   deliberate and it matches S6's own decision for six of its eight new roots: a child root says a
   suite may be EXECUTED, the tail list says its output may be PRINTED, and this suite drives the
   owner's own import path. The cost is that if `d-port-admission` ever fails in CI the diagnostic
   tail is withheld by path policy and the PM sees only the refusal. F8 pins that split and passes.
3. **The three token lines are the only thing between this branch and the rest of the `:501`
   chain.** Once they are appended, `--ci --package S7` will run `laws()` and then all 24 children
   for the first time; the needles in the spec are measured but they have never been checked BY the
   runner, because no run has reached that far. The first run that does is the first real test of
   section 3.
4. **The brief's own acceptance moves.** `brief.sha256` is now
   `e51a83297fda8a0fcbe15ffa7ce241e2dec98325c0fa72767dd36691ca660251` (26571 bytes), not the
   `d1a2c331...` (23820 bytes) the prep measured and not the `41ab30ce...` (25683 bytes) round 1
   measured: 5.1 was rewritten as this ticket required, and the fix round closed review NOTE N3 in
   sections 2, 2.6, 3.3 and one clause of 5.1. The BRIEF-BY-SHA line the PM appends must carry the
   new sha and the new byte count, and it is the line in section 6; `%TEMP%\s7out\final-lines.txt`
   was rewritten from `packages/S7.json`'s own stored texts and re-verified against all three
   declared sha256s.

## 9. What this ticket did not touch

`rebuild/DECISIONS.md`, `rebuild/engine/**`, `rebuild/coach/**`, the four product files FIX and
FIX-2 moved, the seven sibling test files those rounds moved, `rebuild/m4/import/replay-core.cjs`,
`rebuild/m3/setup/port/**`, and every other declared path: all carried byte-identical, which the
runner's own `PRODUCT IMPLEMENTED` line counts at 173. `rebuild/conform/private` was never created
or read. `--full` was never run. No law, guard, cell or needle was weakened; every needle in the
spec is a figure a run on this head printed.

## 10. Review disposition (R1)

`rebuild/lanes/b/S7-TOOLING-REVIEW-R1.md` at `ce713f6`, Opus high, blind: **ACCEPT WITH NOTES,
0 BLOCKING**. The reviewer re-measured every claim they could test and it held - the six `s7-*`
mirrors with no assertion removed, the three runner hunks, all 206 pre/post shas, `runnerSha256`,
the brief sha256, the three token-line sha256s, all 24 children green at their declared needles, the
nine suites at 105/105, and their own `--ci --package S7` terminal identical to round 1's save the
HEAD sha. There was nothing BLOCKING to reproduce. The six notes are disposed of below; everything
in this round was re-measured afterwards, nothing was weakened, and no needle was guessed.

**N1 - "`DECISIONS:511` does not exist on this branch" - DISPUTED, with a measurement.**
It exists, on the chain tip. `git show origin/rebuild/t2-client-core:rebuild/DECISIONS.md` splits
into **511 lines**; this branch's splits into **510**; the first 510 are byte-identical, so `:511`
is a pure append the tip took AFTER this branch's tip merge at `b33fce8a`. The tip ref stands at
`e02d0cc2`. Line 511 is the PM's own `S7 SEAL PREPARATION RETURNED ... LANE B TOOLING ROUND
DISPATCHED` line, it carries the seven tooling facts this ticket was written against, and it ends by
naming what comes next: "Then: the three token lines (512-514)". So
`authorizations.theme.ledgerLine 512`, `brief.acceptedLedgerLine.ledgerLine 513` and the five
`coverage.superseded.gates[*].why` citations of `:514` are correct as built, the brief's `:511`
citation is correct, and **nothing is renumbered**. The reviewer could not see this because a blind
review reads the branch, and the branch does not carry the tip's newest line until step 9's merge;
their conclusion from what they could see was the right one to raise. Their second observation
stands either way: `verifyReceipt` finds a line by its sha256 and never by its number, so no run
outcome ever depended on this. Section 5.1 of the brief and section 6 above now say where `:511`
lives, so the next reader does not have to find it twice.

**N2 - the four-ancestor re-pin - KEPT AS BUILT.** The reviewer checked `7e5fcca` and `S6.json`
themselves and reached the same reading the author did: `H3/S3/S4/S5` role `edited` and `S6.json`
role `superseded-by-child` is the exact mirror one generation on, and reverting `packages/S5.json`
would leave a runnable spec pinning `runnerSha256 8d9a94c2...`, a runner this tree no longer has.
Deviation 7.1 stands and open question 8.1 is answered.

**N3 - the brief's own counts contradicted each other - FIXED.** In the brief of record:
section 2's `Counts` paragraph is now headed as the walk's own figures BEFORE the S7-TOOLING round
and ends with the post-round list (206 / 23 / 9 / 173 / 1) and the sentence that 5.1, not that
paragraph, is what `packages/S7.json` declares; section 2.6 reads 184 carried in the walk and 173
after the round; section 3.3 says the three lane cells were the only role `new` files when the walk
was written and names the six `s7-*` cells that joined them. One number was WRONG rather than stale
and is corrected: 2.6 said 183 carried where 2 said 184. I re-measured it rather than reasoning
about it - for each of the 196 paths `packages/S6.json` declares, the blob at `3d002174` against the
blob at `71d420c`: **12 moved, 184 identical, 0 missing**, so 199 = 12 + 3 + 184 and 184 is the
carried count. The "184th path moved" clause, which parsed no better than the number it carried,
now reads "a thirteenth moved path in this walk". Consequences, all re-measured and all in section
6: brief sha256 `e51a8329...` (26571 B), BRIEF-BY-SHA line sha256 `15bb8a5d...`. The THEME and
GATE-SUPERSESSION lines and their sha256s do NOT move.

**N4 - "ELEVENTH" against "NINETEENTH" inside F7 - FIXED, prose only.** Both comments now carry
both numbers ("the ELEVENTH addition since S5 and the NINETEENTH element of the list"), which is
what the reviewer found defensible about each of them separately. While there, one more sentence in
the same comment block was narrowed for the same reason: the three lane D cells are "the only
role:"new" product that package has OUTSIDE `rebuild/m4/workout/test/`", which is where the six
`s7-*` cells stand, so the comment no longer says S7 has three role `new` files when it has nine.
**No assertion, title or literal changed**: `CHILD_ROOTS.length === 19`, the whole-list
`deepEqual`, the `slice(8)` and the `slice(0, 8)` are the bytes review R1 read. The suite re-runs at
105/105.

**N5 - the empty first commit - RECORDED, unchanged.** The reviewer accepted `aa2d6e3` as red-first
evidence for a ticket whose product is the runner's own argv table, and re-derived the base
refusal from the argv gate itself. Deviation 7.2 stands; if the PM wants the refusal chain as a
tracked file it is one commit, and section 1 already holds it.

**N6 - `rebuild/lanes/d/p3-port-fix/` is not in `PUBLIC_TAIL_ROOTS` - RECORDED, unchanged, and the
reviewer agrees with the choice.** Open question 8.2 stands as the PM's to see rather than to fix.

**What the fix round changed, in bytes.** Three files: the brief (N3), the lane B tooling cell
(N4, comments only) and `packages/S7.json`, which takes four equal-length sha substitutions -
`brief.sha256`, the byte count inside `brief.acceptedLedgerLine.line`, that line's `lineSha256`, and
the tooling cell's `post` `bd1e1fc7...` to `d17f2e45...`. Nothing else in the spec moved, its length
did not change, and its own sha256 is now `1a117723...`.

**What was re-measured afterwards, on `776b2b4`.** Every one of the 206 declared paths re-hashed
from disk and compared with Git at HEAD and with the blob at `sourceBase 3d002174` under its own
role: **0 mismatches** (23 edited / 9 new / 173 carried / 1 superseded-by-child). `runnerSha256`
MATCH. `brief.sha256` MATCH at 26571 B. All three token-line sha256s MATCH the texts in
`%TEMP%\s7out\final-lines.txt`, which was rewritten from the spec's own stored lines. The nine lane
B tooling suites: **105 tests / 105 pass / 0 fail**, exit 0 (`%TEMP%\s7fix\suites.log`). All **24**
declared children re-run the way `children()` runs them, not six: **every one exit 0, needle HIT,
`# fail 0`**, the same table as round 1 and as the reviewer's (`today-17 682`, `d-plan-edit 89`,
`d-port-admission 31`, the five `s7-sup-*` at 4/3/3/3/3, `engine-files-differential` HIT;
`%TEMP%\s7fix\children.log`). `--ci --package S7` exit 1 at `RECEIPT-EXACT-LINE-MISSING`, the same
refusal for the same reason, quoted in full in section 5. Lockdown numstat over `rebuild/DECISIONS.md`,
`rebuild/engine`, `rebuild/coach` and the four product files FIX and FIX-2 moved: EMPTY. Zero
U+2013 and zero U+2014 in every line the fix round added.
