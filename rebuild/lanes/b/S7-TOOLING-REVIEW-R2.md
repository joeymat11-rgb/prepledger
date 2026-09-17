# S7-TOOLING - independent review R2 (Opus, high, same reviewer as R1)

## VERDICT

**ACCEPT.** R1 raised **0 BLOCKING** findings, so there was nothing blocking to reproduce. Of the
four notes that were the author's to move, two are FIXED and verified here, one DISPUTE is UPHELD
by my own measurement, and one is correctly kept as built. I re-measured, independently of the
author, every number the fix round moved: the spec's 206 declared paths against `sourceBase`, Git
at HEAD and disk (0 mismatches), `runnerSha256`, the brief's sha256 and byte count, all three token
line sha256s, the chain tip's ledger, the nine lane B tooling suites, ten of the twenty-four
children including all six `s7-*` cells, the lockdown numstat and the dash scan. My own
`--ci --package S7` reproduces the author's terminal line for line and refuses for the one reason
outside this ticket's scope. **One new NOTE (N7), prose only, in the brief of record.**

Reviewed at `e62c1004204aa103673b5cde953dfd63e4b30070` on `rebuild/b-s7-port-admission`
(`776b2b4` fix round, `e62c100` author report; origin at the same sha, `rebuild/t2-client-core`
unmoved at `e02d0cc2`). Worktree `%TEMP%\earned-s7`, node from the codex runtime,
`TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`, `NODE_OPTIONS=` and `NODE_V8_COVERAGE=`
cleared. `--full` was never run; nothing under `rebuild/conform/private`, `src/history.js`,
`ledger/` or any soak path was opened. Logs under `%TEMP%\s7rev2\`.

## 1. R1's BLOCKING findings

**R1 recorded none.** For the record, stated as the ticket asks:

| R1 BLOCKING | status at `e62c100` |
| --- | --- |
| (none) | n/a - R1's verdict was ACCEPT WITH NOTES, 0 BLOCKING |

Nothing in the fix round re-opened anything R1 had cleared: `git diff f39a868..HEAD` is five files
and no executable product outside one comment block (section 3).

## 2. R1's notes, one line each

| note | R1 said | R2 verdict |
| --- | --- | --- |
| N1 `DECISIONS:511` does not exist; 512/513/514 may be off by one | NOTE | **DISPUTE UPHELD - the author is right, I was wrong** |
| N2 four-ancestor re-pin | keep as built | **RESOLVED - kept as built, unchanged at HEAD** |
| N3 brief sections 2 / 2.6 / 3.3 contradict 5.1 | PM's call | **RESOLVED (FIXED), and 2.6's 183 was wrong: 184 is the measured figure** |
| N4 F7 eleventh vs nineteenth | prose only | **RESOLVED (FIXED), prose only, no assertion moved** |
| N5 empty first commit | acceptable | **RESOLVED - recorded, nothing to change** |
| N6 `p3-port-fix/` deliberately not a `PUBLIC_TAIL_ROOTS` member | PM's eyes | **RESOLVED - recorded, nothing to change** |

**N1, measured myself.** `refs/remotes/origin/rebuild/t2-client-core` is `e02d0cc2` on the remote
(`git ls-remote`). Its `rebuild/DECISIONS.md` has **511** lines; this branch's has **510**; I
compared them line by line and **the first 510 are byte-identical, first differing line = none**.
Line 511 of the tip is 4096 bytes and is the PM's own
`S7 SEAL PREPARATION RETURNED: PACKAGE BUILT, RUNNER REFUSES THE ID; LANE B TOOLING ROUND
DISPATCHED` line; it contains the literal string `Then: the three token lines (512-514)`. So `:511`
exists, it is this ticket's own dispatch line, it is a pure append taken after this branch's tip
merge `b33fce8a`, and `ledgerLine` 512 / 513 / 514 in `packages/S7.json` are correct. **R1's N1
recommendation to renumber is withdrawn: renumbering would have been the error.** I also re-hashed
every one of the tip's 511 lines: **none** hashes to `f1746fe3`, `15bb8a5d` or `46622ec5`, so the
three token lines are still genuinely absent from the ledger and the refusal in section 5 stands as
a measurement, not an assumption.

**N3, measured myself.** Over `packages/S6.json`'s 196 declared paths, between `sourceBase`
`3d002174` and this branch's base `71d420c`: **12 moved, 184 byte-identical, 0 missing.** The
brief's corrected 2.6 figure (**184**) is the measured one and the pre-round 183 was wrong. The
walk's arithmetic now closes: 12 edited + 3 new + 184 carried = 199 = 196 + 3.

## 3. What the fix round actually changed

`git diff --numstat f39a868..HEAD`: brief `19 10`, author report `128 25`, `S7-TOOLING-REVIEW-R1.md`
`272 0` (my own R1 file, committed by the author unmodified), `packages/S7.json` `4 4`,
`pinned-unchanged-and-ruled-substitutions.test.cjs` `8 5`.

- **`packages/S7.json`, 4 lines.** `brief.sha256`, the `acceptedLedgerLine.line` text, its
  `lineSha256`, and the tooling cell's own `post`. Nothing else in 1452 lines moved: no role, no
  path, no child, no needle, no carrier, no `ledgerLine` number.
- **The F7 cell, 8 added / 5 removed, every one of them a `//` comment line.** I read the diff
  hunk by hunk: the test title, `assert.deepEqual(api.CHILD_ROOTS, [...])`, `length === 19`,
  `CHILD_ROOTS[7]` and the `slice(8)` `deepEqual` are untouched, and the file still carries the
  same list of nineteen roots. The new prose names both numbers (eleventh addition since S5,
  nineteenth element) and narrows the role `new` clause to "outside `rebuild/m4/workout/test/`",
  which is true: the nine role `new` paths are the three `lanes/d/p3-port-fix` cells and the six
  `s7-*` cells, and the six stand under exactly that root.
- **The brief, 19 added / 10 removed**, all in sections 2, 2.6, 3.3 and 5.1, all prose and counts.

**Nothing was weakened.** No law, guard, assertion, cell, needle, root, id or literal changed in
this round. The nine tooling suites are still **105 tests / 105 pass / 0 fail, exit 0**
(`%TEMP%\s7rev2\suites.log`, all nine files named explicitly).

## 4. Everything re-measured at `e62c100`

- **Inventory: 206 declared paths, 0 mismatches.** Roles `{"edited":23,"new":9,"carried":173,
  "superseded-by-child":1}`. For every path: disk equals Git at HEAD; `post` equals disk; a
  non-`new` `pre` equals the blob at `sourceBase 3d002174`; a `new` path has `pre: null` and does
  not exist at `sourceBase`; every `carried` has `pre === post`. Worktree clean.
- **All 196 of S6's declared paths are present in S7.json**, 0 dropped; S7 declares 10 more
  (206 = 196 + 10). `sourceBase` is an ancestor of HEAD.

- **Spec** `packages/S7.json` sha256 `1a11772301db5533dcb5776930767b52111cf27ffe8089cae5237439489e7f46`,
  **83449 bytes**, identical on disk and in Git at HEAD. This is the value the runner prints.
- **Brief** `rebuild/lanes/b/S7-PORT-ADMISSION-BRIEF.md` sha256
  `e51a83297fda8a0fcbe15ffa7ce241e2dec98325c0fa72767dd36691ca660251`, **26571 bytes**, disk equals
  Git, equals `brief.sha256`, and equals the sha256 and byte count embedded in the BRIEF-BY-SHA
  line text. MATCH.
- **Runner** `b-package.cjs` sha256 `a07df1e0942a017f44afcfa1b6b92d8f96ee6f5e20f9e4e8450072c76e9268a5`
  equals `tooling.runnerSha256`. MATCH.
- **The three token lines**, hashed by me over the exact stored texts (leading `- ` included, no
  trailing newline), and independently over the nine-line hand-off file
  `%TEMP%\s7out\final-lines.txt`:

| line | ledgerLine | bytes | sha256 | spec | hand-off file |
| --- | --- | --- | --- | --- | --- |
| THEME | 512 | 1551 | `f1746fe39a7a98fc7e6c9dd190b4e24cc7761884779d70f6f7a20414398745b5` | MATCH | EXACT |
| BRIEF-BY-SHA | 513 | 328 | `15bb8a5d12ceecc6294b260797cb30f11a5520cd8d6300514e9a2c14b4ddb2f4` | MATCH | EXACT |
| GATE-SUPERSESSION | 514 | 643 | `46622ec5a6b30e0e46c2d44c1d2279c0869bceebfa8f2f8036d2ebf1c01c8023` | MATCH | EXACT |

  The BRIEF-BY-SHA line is the one that moved this round and it re-hashes exactly. The GATE line's
  text is not stored in the spec (only `coverage.superseded.rulingLineSha256`); the hand-off file's
  third line hashes to that declared value byte for byte, and `514` is the number the five
  `gates[*].why` fields cite.
- **Children: 10 of the 24 re-run** with the runner's own spawn environment, chosen as the ones
  this round could touch plus the package's own: all six `s7-*` cells, `d-port-admission`,
  `d-plan-edit`, `w6-local-source`, `w7-import`. **All exit 0, needle HIT, `# fail 0`**
  (`s7-sup-*` 4/3/3/3/3, `engine-files-differential` prints its 27/18/45 line, `d-plan-edit` 89,
  `w7-import` 35, `w6-local-source` 26, `d-port-admission` 31). I also checked mechanically that
  **no declared child's argv names any of the three files this round changed**, so the remaining
  fourteen needles cannot have moved from R1's measurement of all 24 at `f39a868`.
- **Lockdown.** `git diff --numstat 71d420cb..HEAD` over `rebuild/DECISIONS.md`, `rebuild/engine`,
  `rebuild/coach` and the four product files FIX and FIX-2 moved is **EMPTY**.
- **Dashes.** 1861 added lines across `71d420cb..HEAD` (431 of them in `f39a868..HEAD`):
  **zero U+2013 and zero U+2014**.

## 5. My own `--ci --package S7`, verbatim

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S7` at `e62c100`, **exit 1**
(`%TEMP%\s7rev2\ci.log`, 10 lines; the runner's three U+2014 are rendered here as a plain hyphen
because this file carries none):

```
B PACKAGE S7 SPEC OBSERVED packages/S7.json 1a11772301db5533dcb5776930767b52111cf27ffe8089cae5237439489e7f46; runner a07df1e0942a017f44afcfa1b6b92d8f96ee6f5e20f9e4e8450072c76e9268a5 byte-identical on disk and in Git at HEAD; status=BRIEF-ACCEPTED; 0 D-ids ; 206 declared product files; 24 declared child(ren), argv file-first under 19 fixed root(s) with only --test --test-reporter=tap permitted; 0 declared move(s), each naming its own original executable in a relative require specifier (moves are refused outright under this runner - TOOLING-REVIEW-r3 X1); no successor carriers declared (every inherited gate must be carried by a parent-pinned executable); 5 byte-identity carrier(s) declared SUPERSEDED under a PM line recorded by sha256 46622ec5a6b3, each with its own named and executed evidence
B PACKAGE S7 PARENT OPTION S6 M2-S6-TODAY-CHILD rebuild/m4/spec/acceptance-s6-today-child.json 0e52357ed62249d4ee94b473e2dde20220b0a82c3737414bba0603fa76bf040f ACCEPTED at 23575c0f1e61ee714fb519cb3607c4779dcd0c24 (DECISIONS:500); artifact byte-identical on disk, in Git at that commit and on refs/remotes/origin/rebuild/t2-client-core; review rebuild/m4/spec/review-s6-today-child.json d21c97590030 byte-identical on disk and on that branch; receipt base 934321f is an ancestor of it
B PACKAGE S7 PARENT BOUND S6 rebuild/m4/spec/acceptance-s6-today-child.json 0e52357ed62249d4ee94b473e2dde20220b0a82c3737414bba0603fa76bf040f; single-parent chain holds - no sibling spec claims it on disk or in Git at HEAD, and no sealed artifact on refs/remotes/origin/rebuild/t2-client-core names it as parent
B PACKAGE S7 POSTFIX M2-S7-PORT-ADMISSION REVIEW-PENDING mode=--ci
B PACKAGE S7 ENVELOPE ABSENT; rebuild/m4/spec/acceptance-s7-port-admission.json is not sealed yet - no PASS word is available
B PACKAGE S7 PARENT PINS RE-ASSERTED at run time; 2 pin(s) from rebuild/m4/spec/acceptance-s6-today-child.json plus its 196 product pins through the inventory below, and 1 un-superseded grandparent pin(s) from rebuild/m4/spec/acceptance-s5-today-child.json, byte-identical on disk AND in Git at HEAD; 197 superseded pin(s) preserved in Git at sourceBase 3d00217; parent artifact byte-identical in Git at 23575c0f1e61ee714fb519cb3607c4779dcd0c24
B PACKAGE S7 PRODUCT IMPLEMENTED; 33 at the declared post-image / 0 at the pinned pre-image / 173 carried byte-identical from the parent / 0 declared role "pinned-unchanged" - executed by a declared child, produced by nothing / 0 unlisted drift; the inventory covers all 196 parent-pinned product files; 1 declared role "superseded-by-child" over a parent EXECUTION pin, each equal to the parent byte (rebuild/lanes/b/tooling/packages/S6.json)
B PACKAGE S7 FIDELITY OBSERVED; sourceBase 3d00217 ancestor of HEAD e62c100; 8 engine/conform/m4-spec/lane-b-tooling file(s) changed since sourceBase, all in the fixed inventory; runner a07df1e0942a and spec 1a11772301db pinned (artifact not sealed yet); 16 of 18 PIN_PATHS present in this tree and byte-identical Git vs disk; 2 not in this tree and therefore vacuous (rebuild/conform/goldens rebuild/conform/manifest.json)
B PACKAGE S7 FAIL RECEIPT-EXACT-LINE-MISSING; required evidence missing or failed; local diagnostics withheld
```

This is the author's fix-round terminal line for line, the only difference being the HEAD sha in
the FIDELITY line (`e62c100` against their `776b2b4`). The remaining refusal is still the three
MISSING LEDGER LINES and nothing else: I hashed all 511 lines of the chain tip's
`rebuild/DECISIONS.md` and none matches any of the three cited `lineSha256` values. Appending them
is the PM's act.

## 6. Findings

### BLOCKING

**None.** Nothing is STILL OPEN from R1.

### NOTES

**N7 (NOTE, new this round) - the brief's repaired section 3.3 says "five declared children" where
the measurement says six.** The added sentence reads: "After the round of 5.1 the six `s7-*` cells
are role `new` too, executed by five declared children of their own". I resolved every role `new`
path against the declared children's argv: the five `s7-supersede-*` cells are executed by
`s7-sup-source-carriers`, `s7-sup-inherited-carriers`, `s7-sup-defect-witnesses`,
`s7-sup-writers-differential` and `s7-sup-second-gate`, and `s7-engine-files-differential.cjs` is
executed by a **sixth** declared child, `engine-files-differential`. So the six cells are executed
by six children, not five. The rest of the sentence is exact, no count the runner checks is
affected (the spec declares 24 children and 9 role `new` paths, both correct), and section 5.1 of
the same brief already says "the five suites measure 4 + 3 + 3 + 3 + 3" about the five
`s7-supersede-*` cells only, which is where the five most likely came from. **PM's call**, and it
is the same shape of call as N3: correcting one word moves `brief.sha256` and therefore the
BRIEF-BY-SHA line text and its `lineSha256` a second time, so it must be decided BEFORE the line is
appended, not after. I would accept it as it stands rather than re-hash a 26571-byte brief of
record for one numeral; if the PM prefers it exact, the edit, the re-hash and a re-issued
BRIEF-BY-SHA line are one small round.

**N1 to N6 carry forward as disposed in section 2.** N2, N5 and N6 remain the author's and my
shared reading and need no further act. N1 is closed against me.

## 7. What I could not verify (unchanged from R1)

1. **Anything past `RECEIPT-EXACT-LINE-MISSING`.** `laws()` and `children()` are never reached on
   this branch, so the runner has still never itself executed a declared child or the 45-law phase.
   My needle table is a faithful reconstruction of `children()`'s spawn, not `children()`.
2. **`ENGINE_MAIN` / `ENGINE_OLD`**, built by `laws()` through `Reference.create`. Not set by me;
   no file in any child's argv reads either name.
3. **`--full`, the private oracle, the receipt, the artifact, the byte-identity step, CI on both
   OS.** Out of scope; `rebuild/conform/private` was never created or read.
4. **The three token lines as the PM will actually append them.** Their sha256s are verified
   against the hand-off texts. One changed byte on the way into `rebuild/DECISIONS.md` and the run
   refuses again with the same code.

Reviewer: Opus, high effort, independent of the author. Nothing was weakened, no needle was guessed,
and no file outside this review file was modified.
