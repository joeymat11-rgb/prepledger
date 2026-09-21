# S9 Integration Part 1 - Review L1
Reviewer: Astra (Codex), commissioned under DECISIONS:412, :569 and :613; blind review, loop round 1; highest effort
Head: 15ab6e83a9a3f1ce8d6b3183c3280e320a294ed3
Script SHA256 (certutil): 5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22
VERDICT: ACCEPT WITH NAMED DEBTS

1. THE MERGES

Measured `git log --oneline --first-parent 8c2bc36e..15ab6e83`: 16 commits, five merges and eleven non-merges. Read every non-merge diff with explicit paths, including both report commits. The report's fourteen ends at f925b6f, before its two report commits.

| Merge | First parent | Second parent | Diff against P1 / P2, path counts |
| --- | --- | --- | --- |
| 62db82526a9edabd67be5fdaa9afaa28e1f2cc09 | 8c2bc36e91ae346508d31095302eb86a6f708228 | a224c7b063fb50c10659187603263370354827b5 | 26 / 2 |
| 087cbe6f0a9696a843ea848b605a173f26f87e69 | 62db82526a9edabd67be5fdaa9afaa28e1f2cc09 | 6f808cfa6e54aa20e5641eecf4dd503f27bbd4be | 11 / 28 |
| 6620aea7d4027af2f25a541916cad0ddfe15d5b3 | 087cbe6f0a9696a843ea848b605a173f26f87e69 | 3f0200269d0afb85b3449cd8a713a882dc543439 | 11 / 39 |
| a6ee861a10a4c6397d3f69bd0e67b4b042cd33d7 | 6620aea7d4027af2f25a541916cad0ddfe15d5b3 | 24bef9b9f2299593488884f313363394354f99f3 | 29 / 75 |
| 550227e953848317eb208104351c1685f416dc3d | a6ee861a10a4c6397d3f69bd0e67b4b042cd33d7 | bc308d947c705384b08f7e8a4f3ed933e362e14e | 8 / 92 |

For each merge, diff(P1,merge) is confined to diff(merge-base,P2), and conversely; zero paths outside the other side's delta. Every path changed on only one side has that side's exact mode/blob in the merge. Scope: .github/workflows/rebuild.yml, rebuild/lanes, m3, m4, coach, m1, conform/v4/postfix, DECISIONS.md and engine.
Only merges 3 and 4 overlap, solely in .github/workflows/rebuild.yml. In OS-temp scratch, `git merge-file -p P1 BASE P2` exits 0 and reproduces each committed workflow byte-for-byte. Parent workflows are complete ordered subsequences: merge 3, 354/354 and 331/331 lines; merge 4, 376/376 and 319/319. No lost, doubled or reordered added step; every required path occurs once as a run argument (section 4). No conflicted resolution is present. The clean-merge claim holds.
F2's setup-tags.cjs and both f2 cells are byte-unchanged between b9777fe4 and 24bef9b9. DECISIONS and STATUS arrive only in merge 4 (+33 and +7 lines); none of the eleven non-merges edits them.

2. THE SCRIPT HUNKS

Compared 550227e/a224c7b0 to HEAD. Only executable changes: append `rebuild/lanes/c/ui-port/` and `rebuild/lanes/d/f2/` to CHILD_ROOTS; append only `rebuild/lanes/c/ui-port/` to PUBLIC_TAIL_ROOTS. Remaining changes are the adjoining explanations and PM-A1's comment. No other executable line moves.
CHILD_ROOTS 24 -> 26, original ordered prefix identical; F7's slice(8) 16 -> 18, first eight and index 7 unchanged, S9 block four -> six. PUBLIC_TAIL_ROOTS 6 -> 7, original prefix identical; F8 adds f2 to its withheld assertions. All literal/list/count assertions pass. TAIL_DENYLIST and SEAL_TIP_RULE unchanged.
PM-A1 now counts five routes correctly: two fixed coordinates (runner, own spec), three supplied routes (brief, carrier successor, child targets). Read proposed(): these are its only executionPins producers.
Before: d52acc31c99845ed774c5111a261b84012538495e0ee2caa1d13827c1d28bb53, 312108 bytes, 3898 LF. After: header hash, 314978 bytes, 3933 LF. No CR bytes. The mutation table records a removal and sibling-addition kill for each new list entry.

3. EVERY NEW ROW / RED-FIRST EVIDENCE

Required counterexamples all KILLED. No test assertion was weakened or removed. Focused scratch runs retain whole cells and use Node's test-name filter only to isolate the asserted row; full HEAD suites ran separately without filters. Relocated control rows pass: fence 5/5, pack 1/1, release-object 7/7.
Historical inputs replayed in scratch: 3fdea22 runner makes F7, F8 and the new childArgv row red; cd05dbc workflow makes pack's condition row red; d9ccaa9 workflow makes both P-S9-3 rows red while P-S9-5 stays green; 4b98bfc workflow makes release row (7) red for no CI home.
R6-Z2/Z3 and the two re-homed invariants are coverage additions, not red against the preceding correct implementation. The report says so correctly. Same-length and zero-byte mutants each fail row (29) with `'pass' !== 'fail'`, naming respectively `a same-length inventory edit was excused:` and `a zero-byte inventory was excused:`.
The cross-lane fixture rows are sensitive independently of the exact-source guard: mutated lifted expressions after the guard fail rows (1)-(4). Separately, altering the actual runner fragment fails the guard at module load. Rows (5), (7), (8) also have executed kills. Extra LIVE probes are named debts, not silently counted as kills.

4. THE WORKFLOW

30 named steps, 30 run lines, five if lines, one pre-existing glob (coach), zero `|| true` occurrences. One OS matrix is exactly `[ubuntu-latest, windows-latest]`, with runs-on using matrix.os.
Every path below is a literal run argument exactly once; each grouped set shares the one step shown. None of these run lines globs.

| Run line | Exact file arguments | Condition |
| --- | --- | --- |
| 259 | rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs | !cancelled() |
| 377 | rebuild/lanes/c/ui-port/pack-pin.test.mjs ; rebuild/lanes/c/ui-port/approved-pin.test.mjs | !cancelled() |
| 397 | rebuild/lanes/c/ui-port/release-object.test.mjs | !cancelled() |
| 406 | rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs ; rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs | none |
| 424 | rebuild/lanes/c/passphrase-normalize/helper.test.mjs ; rebuild/lanes/c/passphrase-normalize/route.test.mjs ; rebuild/lanes/c/passphrase-normalize/unlock-forms.test.mjs | !cancelled() |
| 440 | rebuild/m3/w6/test/local-import.test.mjs | !cancelled() |
| 335 | rebuild/lanes/d/p3-layout-v2/layout-v2.test.mjs ; rebuild/lanes/d/p3-layout-v2/projector-parity.test.mjs | none; grouped with real-shape cells |
| 315 | rebuild/lanes/d/f2/projector.test.mjs ; rebuild/lanes/d/f2/guard-coverage.test.mjs | none |

The four requested conditions are byte-identical `if: ${{ !cancelled() }}` at 258, 376, 423, 439. The only additional condition is the ordered cross-lane home at 396. Fence follows Today; F2 sits in D; pack follows A5; release immediately follows pack; Today carry, passphrase, local-import retain their order. No step was forgiven.

5. THE RETIRED ASSERTION

S8 parsed independently: 224 product keys, 71 executionPins, union 227. `rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs` occurs in neither map. No workflow run names that test file.
Diff d4a3c92 replaces only its final workflow-equality test with the explicit retirement comment; the preceding 28 source lines are byte-identical. The removed original-command cardinality check was scaffolding of that equality; both continuing invariants survive in fence row (32).
Removing either matrix OS and adding `|| true` to the rig187 run each fail row (32). The fence's actual CI home has its after-failure condition. Did not execute the retired suite's remaining source-gate row, which reads frozen src bytes; its reported 35/34/1 and 34/34/0 are NOT REPRODUCED here.

6. THE CROSS-LANE CELL

`rebuild/lanes/c/ui-port/release-object.test.mjs` has eight rows and a real CI home (397). The real row reads `rebuild/m4/spec/acceptance-s9-ui-pins.json`; at HEAD its exact refusal is `RELEASE-OBJECT ARTIFACT-ABSENT rebuild/m4/spec/acceptance-s9-ui-pins.json`, exit 1. Nothing was sealed or written there.
Read proposed() at 3389-3475, ARTIFACT_KEYS at 3477-3489 and envelope() at 3692-3695. Fixture construction matches the actual three-line Object.fromEntries expression, optional emission, and fence Object.keys reading. Each source anchor occurs once. Parent id supplies sealedBy; pre supplies lastSealedSha256; the ruling SHA and role are retained. Non-released declarations are excluded and an empty release omits the key.
Executed wrong-array input produces keys `0`,`1`, not released paths. The real row checks both closed-list paths, extra releases, and overlap with product/executionPins. Its ten-word vocabulary row passes. Product role `new` and child `ui-port-release-object` remain part-2 declarations, not present S9 evidence. D-NULL-ARTIFACT records a malformed-input limit.

7. THE SEVEN PACKAGES

For H3, S3, S4, S5, S6, S7, S8: loaded raw bytes at 8c2bc36e and HEAD. Replacing just the tooling.runnerSha256 value reconstructs each HEAD file byte-for-byte (7/7), and every new value equals the certutil hash in the header.
At 8c2bc36e the value is e31dd206c0fb0fc0c295df45eae3992d4c59b1a76de8da04a4d0f22948e9335e. At e2ca032 it is d52acc31c99845ed774c5111a261b84012538495e0ee2caa1d13827c1d28bb53 and occurs exactly once in all seven files, reproducing the report's pre-edit claim. The base S8 file also has its historical e31 hash elsewhere; that occurrence remains untouched.

8. THE BAR AT THIS HEAD ON THIS PC

Windows; Node v24.19.0 at `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` (NODE below). Before tests, set on separate PowerShell lines:
`$env:MEASURED_TEST_NOW = '2026-09-03'`
`$env:TZ = 'America/New_York'`
Each row below ran separately as `& NODE --test --test-reporter=tap <path>`. No concurrent suites. Every skip and cancellation count is zero. Green rows exit 0; four real-row failures exit 1.

| Cell (directory abbreviation below) | Tests | Pass | Fail | Failing row |
| --- | ---: | ---: | ---: | --- |
| tooling/test/child-diagnostic-tail.test.cjs | 11 | 11 | 0 | none |
| tooling/test/execution-targets.test.cjs | 10 | 10 | 0 | none |
| tooling/test/gate-supersession.test.cjs | 16 | 16 | 0 | none |
| tooling/test/parent-gate-closure-and-load-floor.test.cjs | 14 | 14 | 0 | none |
| tooling/test/parent-pin-shapes-and-spec-successors.test.cjs | 9 | 9 | 0 | none |
| tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs | 17 | 17 | 0 | none |
| tooling/test/product-phase-and-ledger.test.cjs | 7 | 7 | 0 | none |
| tooling/test/release-from-seal.test.cjs | 42 | 42 | 0 | none |
| tooling/test/seal-tip-and-byte-identity.test.cjs | 17 | 17 | 0 | none |
| tooling/test/successor-moves.test.cjs | 9 | 9 | 0 | none |
| ui-port/sealed-inventory-fence.test.mjs | 48 | 47 | 1 | FENCE REAL below |
| ui-port/pack-pin.test.mjs | 69 | 68 | 1 | PACK REAL below |
| ui-port/approved-pin.test.mjs | 47 | 46 | 1 | APPROVED REAL below |
| passphrase-normalize/helper.test.mjs | 10 | 10 | 0 | none |
| passphrase-normalize/route.test.mjs | 6 | 6 | 0 | none |
| passphrase-normalize/unlock-forms.test.mjs | 13 | 13 | 0 | none |
| f2/projector.test.mjs | 30 | 30 | 0 | none |
| f2/guard-coverage.test.mjs | 51 | 51 | 0 | none |
| ui-port/release-object.test.mjs | 8 | 7 | 1 | RELEASE REAL below |
| rebuild/m4/workout/test/h3-clean-init.test.cjs | 14 | 14 | 0 | none |
| rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs | 4 | 4 | 0 | none |
| rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs | 5 | 5 | 0 | none |
| rebuild/m3/w6/test/local-import.test.mjs | 22 | 22 | 0 | none |

Prefixes: tooling = rebuild/lanes/b/tooling; ui-port and passphrase-normalize = rebuild/lanes/c/<name>; f2 = rebuild/lanes/d/f2.
Totals: tooling 152/152/0; requested nineteen suites including release-object 434/430/4; four additional workflow readers 45/45/0; all twenty-three 479/475/4.
- FENCE REAL: `THE REAL ROW - this branch touched no sealed path the chain has not released`; 22 `FENCE-SEALED-PATH-TOUCHED M <path>` refusals. Expected undeclared carried changes pending the seal.
- PACK REAL: `REAL ROW: the owner-approved pack at this head, against this cell's own literal`; `PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18`. Expected.
- APPROVED REAL: `REAL ROW: whatever design.APPROVED names at this head, against this cell's literal`; `APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-refinement-A.html` and `APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html`. Expected.
- RELEASE REAL: `REAL ROW: the released block of the real acceptance artifact, against the fence's own reading`; exact ARTIFACT-ABSENT refusal in section 6. Expected.
`& NODE rebuild/lanes/b/tooling/b-package.cjs --ci --package S8` exits 1: `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`. SPEC OBSERVED reports 224 product files, 25 children, 26 roots, 0 D-ids, 0 moves and 5 superseded carriers. No unexpected red.

9. WHAT THE REPORT CLAIMS AND DID NOT DO

| Report claim | Independent measurement / qualification |
| --- | --- |
| Five merges; fourteen implementation commits | Reproduced through f925b6f; HEAD adds two report commits. Eleven non-merges touch exactly sixteen distinct files, the stated file set. |
| Preflight 26/11/11/29/8 names, 13/3/1/1/0 sealed hits | Reproduced as incoming/triple-dot deltas. Two-dot from 8c2bc36e instead yields 28/13/13/58/29. State the denominator. |
| Whole-branch 86 names, 16 sealed hits | Reproduced at f925b6f. HEAD has 87 names (report added), still 16 sealed hits. Fence independently reports 22 sealed touches. |
| F2 later-head history: three commits; five P4B papers | First-parent b9777fe4..24bef9b9 has two merges; all newly reachable history is 49 commits, including the named ledger commit. Incoming P4B papers are six (AUTHOR-REPORT, PROBES, REVIEW-R1 through R4). Product bytes unchanged. |
| Fence 1659 lines, 105588 bytes, +132/-0; one retired refusal occurrence | All reproduced. The one occurrence is comment line 520, not emitted. |
| Historical fence diff: 56 changed cell lines, 222 insertions | Reproduced: cell +49/-7 = 56; report +171/-0; spec +2/-2; total three files +222/-9. |
| Runner counts; 26 child roots; 7 tail roots; five pin routes | Reproduced in section 2; all five CHILD_SPECS cells carry S9 at reported lines 140/842/759/1621/2365. |
| Workflow counts, line numbers, conditions, eight homes | Reproduced in section 4; four conditions added by this hand including the new release home, plus the inherited fence condition. |
| Seven one-value re-pins; ten section 9.1 SHA256 values | All reproduced exactly; hashes table below. Runner never changes after c4224ee. |
| F2 cell hashes; 278 release-cell lines; ten refusal words | Reproduced. F2 hashes f74bbe5f40624237a4d24536b3ead036a75ed3bc705a52d6e55032d28bdf8dd6 and 78d1d73c02b115981006ab38dd0a16bfcd9fddbee8afa40c872964155281b9e7. |
| Accepted brief hash and 1369 lines | Reproduced: d8140074ccccfc2cbbbdcc011974981907e71c141a246625308adbe10c31300d. |
| ASCII additions and LF; no engine delta | Zero U+2013/U+2014 in non-merge added lines; zero CR in measured files; no engine diff. Existing untouched non-ASCII text is retained. |
| After-each-merge totals; historical full red-first totals 27/24/3, 69/67/2, 48/45/3, 8/6/2 | NOT REPRODUCED as whole historical suite runs; focused historical failing rows reproduced in section 3. HEAD totals reproduced in section 8. |
| Linux totals/skips, Linux mutants' full 48/46/2 totals; base S8 20 roots/refusal | NOT REPRODUCED on Linux or at the base. Focused Windows mutation kills and HEAD S8 refusal are measured separately. |
| Retired suite 35/34/1 -> 34/34/0, its 21 refusal mutants; whole Today 685/683/2 | NOT REPRODUCED: frozen-source access and whole-Today run excluded by this commission. No borrowed green. |
| SourceBase 227/227; executedClosure 0/4 and 2/2; six future unchanged declarations; future token/child/needle/module counts | NOT REPRODUCED; report labels these historical inputs or part-2 work. No candidate S9 spec/artifact exists to judge. |
| Historical DECISIONS totals 548 -> 581, current remote tip 628; farm/privacy/push/no-retry history | Only merge delta +33 reproduced. Exact historical line totals and operational claims NOT REPRODUCED. Git tree checks cannot establish who ran commands or what was read. |

Section 9.1 hashes independently re-taken (runner in header):

| Path | SHA256 |
| --- | --- |
| .github/workflows/rebuild.yml | 78d40700feacca467fe96c3ffeea133ab0f585ad414a01f5652d37812b4ff0ca |
| rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs | ae98e5a3af38b7799ce6c2479c1c8a11b5b919560d156e31f81a3676a9691638 |
| rebuild/lanes/c/ui-port/pack-pin.test.mjs | de68a7bdb9f48955a86c59960486e0750703f21dc0239077348489a4efd3946c |
| rebuild/lanes/c/ui-port/approved-pin.test.mjs | 231e7332b66d2b0e103d6cdbc367f471255dfbb2f5cd16e7ccf1abbc8c1b618b |
| rebuild/lanes/c/ui-port/release-object.test.mjs | a990e162ef41b3b268879c9ac868582de2d71482040252d14c18133d5696ba85 |
| rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs | f3c470c60748e637c82130a121d18bee989b537e45a619e74ee1f63998a276a5 |
| rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs | a8ebdb7d74c95c563896cb71fd9d8fa901091d865bd238f27267b87145d65195 |
| rebuild/lanes/b/tooling/test/execution-targets.test.cjs | 7ca0e32a0dd3467fee94f57e51cd6e0ab8bc21cfd98761c6a7c4bdc4338c142e |
| rebuild/m3/setup/port/passphrase.cjs | 69c23e45412db61e5c8c96fc464a818fd660de1446fb2bdbcf13f7dc47b3c929 |

BLOCKING

None: no executed counterexample reachable through this HEAD's workflow, an honest chain or a well-formed spec.

NAMED DEBTS

- D-CONDITION-MATCHER: all five condition readers accept `if: ${{ !cancelled() && false }}`; HEAD has the exact correct expressions, but these substring checks alone cannot certify future workflow semantics.
- D-NULL-ARTIFACT: release-object's real row passes JSON `null` (1/1, exit 0), although no well-formed proposed() output is null; a future broader input contract must reject that sentinel explicitly.
- D-REPORT-DENOMINATORS: use triple-dot for the preflight table and distinguish two first-parent F2 merges from 49 newly reachable commits; six P4B papers arrived, not five; none changes product correctness.
- D-PLATFORM-EVIDENCE: this Windows Node v24.19.0 review establishes neither Linux nor hosted CI; retain the brief's existing runner, pack, F2 and platform debts, as settled by :620/:623, for part 2.

TABLE OF SINGLE-CLAUSE CHANGES

Commands use `& NODE --test --test-reporter=tap --test-name-pattern=<row> <scratch-copy>`. Tests/pass/fail below count selected rows only; skips are zero. Source-root relocation changes only the probe's read location; assertions stay intact. R = new childArgv row; F7/F8 = root-list rows; Xn = release-object row n; C = condition row. Required mutations and additional probes are separated by their labels.

| Input change | Observed row/output | Result |
| --- | --- | --- |
| Remove CHILD_ROOTS ui-port | F7/F8 2/0/2; R 1/0/1, CHILD-ARGV-TARGET .../ui-port/probe.test.mjs | KILLED |
| Remove CHILD_ROOTS f2 | F7/F8 2/0/2; R 1/0/1, CHILD-ARGV-TARGET .../f2/probe.test.mjs | KILLED |
| Add CHILD_ROOTS ui-portish sibling | F7/F8 2/1/1; R 1/0/1, Missing expected exception. | KILLED |
| Add CHILD_ROOTS f2x sibling | F7/F8 2/1/1; R 1/0/1, Missing expected exception. | KILLED |
| Remove PUBLIC_TAIL_ROOTS ui-port | F7/F8 2/1/1, F8 equality; R stays 1/1/0 | KILLED |
| Add PUBLIC_TAIL_ROOTS ui-portish sibling | F7/F8 2/1/1, F8 equality; R stays 1/1/0 | KILLED |
| Add PUBLIC_TAIL_ROOTS f2 | F7/F8 2/1/1, F8 equality; R stays 1/1/0 | KILLED |
| Replace !worktree.equals(chainBytes) with length inequality | Fence (29) 1/0/1, same-length edit excused | KILLED |
| Return false for zero-byte worktree in that comparison | Fence (29) 1/0/1, zero-byte inventory excused | KILLED |
| Remove fence if line | Fence (18) 1/0/1, no if at all | KILLED |
| Remove pack if line | Pack C 1/0/1, no if at all | KILLED |
| Remove passphrase if line | Fence (30)/(31) 2/1/1, (30) no if; (31) green | KILLED |
| Remove local-import if line | Fence (30)/(31) 2/1/1, (31) no if; (30) green | KILLED |
| Remove release-object if line | X7 1/0/1, no if at all | KILLED |
| Remove windows-latest from matrix | Fence (32) 1/0/1, the windows job is gone from the matrix: os: [ubuntu-latest] | KILLED |
| Remove ubuntu-latest from matrix | Fence (32) 1/0/1, the ubuntu job is gone from the matrix: os: [windows-latest] | KILLED |
| Append or-true to rig187 run | Fence (32) 1/0/1, 78: run: node rebuild/t2/rig187.cjs \|\| true | KILLED |
| Lifted release filter becomes true | X1/X2 2/0/2, extra edited path reaches release map | KILLED |
| Lifted release map key becomes 'wrong' | X1 1/0/1, two required keys differ | KILLED |
| Lifted lastSealedSha256 becomes null | X2 1/0/1, pre inequality | KILLED |
| Lifted sealedBy becomes child id | X2 1/0/1, parent id inequality | KILLED |
| Lifted rulingLineSha256 becomes null | X2 1/0/1, ruling inequality | KILLED |
| Lifted emitted role becomes edited | X2 1/0/1, role inequality | KILLED |
| Lifted empty-release emission condition becomes true | X3 1/0/1, unexpected released key | KILLED |
| Lifted fence reading drops fallback {} | X3 1/0/1, Cannot convert undefined or null to object | KILLED |
| Lifted fence reading uses Object.values | X4 1/0/1, array no longer reads as indices | KILLED |
| Lifted Object.fromEntries becomes Array.from | X4 1/0/1, the runner's own expression produced an array | KILLED |
| Runner ARTIFACT_KEYS last entry becomes wrong | X5 1/0/1, exact-anchor assertion | KILLED |
| Runner envelope drops released:null freeze | X5 1/0/1, exact-anchor assertion | KILLED |
| Vocabulary RELEASED-ROLE becomes MADE-UP | X8 1/0/1, no refusal spells exported word | KILLED |
| Actual runner fragment's filter becomes true, anchor unchanged | Module 1/0/1, anchor has 0 occurrences | KILLED |
| Extra: add && false to each of five conditions, independently | Fence/pack/release C 1/1/0 each; passphrase/local pair 2/2/0 each | LIVE, D-CONDITION-MATCHER |
| Extra: synthetic artifact JSON is null | Real row 1/1/0, exit 0 | LIVE, D-NULL-ARTIFACT |

What I did not verify

- No part-2 artifact, spec, design-pack literals, design-reader closure, receipt, full seal, direct private-data inspection, frozen src, protected data, hosted jobs or Linux run. No whole Today step. Prior accepted lanes were not reopened for new survivor hunts.
- Historical suite totals and operational claims explicitly marked NOT REPRODUCED above remain unverified; every other unlisted historical/future numerical claim is likewise NOT REPRODUCED, not adopted as evidence.
- Scratch probes and ASCII TAP evidence remain at `C:/Users/joeym/AppData/Local/Temp/astra-s9-part1-review-15ab6e83/`; no scratch deletion attempted. Only this new report is written in the worktree. No commit, push, fetch, checkout, reset, stash, clean, dependency install or acceptance artifact generation was performed.
