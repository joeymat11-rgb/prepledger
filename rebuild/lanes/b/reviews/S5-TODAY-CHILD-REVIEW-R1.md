# M2-S5-TODAY-CHILD — INDEPENDENT REVIEW R1 (Opus high)

VERDICT: ACCEPT — 0 BLOCKING / 0 MAJOR / 3 MINOR / 5 NOTE

Reviewed head 379e9fcbb375a1fe08e981f0e3d3fb00e25c157f (rebuild/b-s5-today-child) over brief head 43f836495761769cb1a9d794883c6049014eb86f, in a detached worktree with the three junctions only. Tip of record origin/rebuild/t2-client-core 397cf96583fedb4e6594c252c84efdf5138e8e6c; a CONTROL worktree was cut at that tip and run for every baseline claim below. No product file was edited: every mutant applied here was reverted, and `git status --porcelain` at this commit is empty.

## 1. Findings

**MINOR 1 — the author report's own line counts are wrong, and it is over the cap.** By `git diff --numstat`: `measure/test/boundary.test.mjs` is **48/7**, not the reported 44/10; the six s5 cells are **976** lines (183+198+177+147+170+101), not 966. Every other figure checks out (rebuild.yml 41/4, b-package.cjs 35/4, the tooling suite 44/8, today-app.cjs 49/0 against the tip, H3/S3/S4 1/1). The report is 151 lines against a 120 cap (deviation 5). Fix the two numbers and trim; nothing behind them is wrong.

**MINOR 2 — a stale declaring-spec chain survives in `local-today-journey.test.mjs`.** Line 670 exports `CHILD_SPECS = Object.freeze(['H3','S3','S4'])` and `declaredPostIn`, while the three sibling guard cells all gain `'S5'` here. I searched the whole tree for an importer of `declaredPostIn` and found exactly one line — its own definition — so it is genuinely dead and weakens nothing today. It is a trap for the next package that starts using it. Accept as disclosed (deviation 6): moving an S4-pinned file for no evidentiary reason is worse. Ticket it for S6.

**MINOR 3 — "gains an assertion, loses none" does not describe the boundary.test.mjs amendment, though the amendment itself is sound.** One assertion IS removed: `assert.deepEqual(drifted, ['…/today-app.cjs'])`. It is replaced by three (`undeclared === []`, `drifted.includes(MINE)`, `under === [MINE]`) plus a genuinely new one (`readRepo(restored).includes(DIR) === false`). I read the diff line by line and probed both failure directions myself (section 3); the guard holds. The report should say "one assertion decomposed into three, plus one added", not "loses none".

## 2. The product map, byte for byte

- **today-app.cjs**: disk sha256 `016a1e4f096d24e69b0b4e308879679e8582d0fdf475f28c7b24d2cb9cd9c97e` == `git show 4e0b4837:…/today-app.cjs` == the post S5.json declares == the post the drafted THEME line quotes. Identical on all four.
- **the measure module**: `git ls-tree -r 4e0b4837 …/measure` lists **fifteen** files. Fourteen are byte-identical at this head; the fifteenth is `test/boundary.test.mjs`, the one disclosed amendment. `git diff --stat 4e0b4837 379e9fcb -- today-app.cjs measure/ shared-preflight.yml` names it and nothing else.
- **the declared map**: all **114** declared post-images stand on disk, checked independently of the runner, whose own line reads `33 at the declared post-image / 0 at the pinned pre-image / 81 carried byte-identical from the parent / 0 unlisted drift; the inventory covers all 90 parent-pinned product files; 1 superseded-by-child`.
- **role "new" is honest**: of the 23, twenty-one are absent at sourceBase c76fb7f with `pre: null`; the two that exist (`shared-preflight.yml`, `shared-preflight-ci-registration.test.cjs`) carry their real sourceBase pre-bytes — the S4/F6 precedent, not a fresh licence.
- **no engine byte moves**: `git diff 397cf965 379e9fcb -- rebuild/engine` is EMPTY over all **45** tracked files; the declared needle says it from the other side, 27 outside + 18 named = 45, none moved.

## 3. Red-first, reproduced here

- **engine-files differential**: one byte appended to `rebuild/engine/index.cjs` and `s5-engine-files-differential.cjs` refuses with ERR_ASSERTION naming index.cjs (`actual e524e1cd…` vs `expected 40ccc489…`). Reverted.
- **the author's mutant** (the same byte) across the five s5 cells: **12 pass / 4 fail** — SUP-1, SUP-2, SUP-5, SUP-6. Reverted.
- **my own mutant**, adversarial rather than incidental: I used the carrier's own `NC.construct(NC.baseline())` to write the RECONSTRUCTION's bytes into `rebuild/engine/today.cjs`, i.e. I made the tree stop diverging at the very file SUP-2 names. **5 pass / 11 fail**, across all five cells, including SUP-2's `assert.throws(…/today\.cjs/)`, SUP-8/9/10 and SUP-14/15/16. These cells measure this tree; they do not restate a claim. Reverted.
- **the amended boundary cell, both directions**: restoring today-app.cjs to its tip bytes turns it red ("this lane delivered nothing"); appending one byte to the S4-pinned, S5-undeclared `today/test/gym.test.mjs` also turns it red, and setup.test.mjs's own re-pin cell with it. The declaring-spec exemption opened no hole. Both reverted.
- **the token clause**: brief section 6's third line is `DECISIONS:444`'s shape exactly. Its `·` clause is `GATE-SUPERSESSION M2-S5-TODAY-CHILD source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate`, which matches `SUPERSESSION_GRANT` at b-package.cjs:742, and the line ends in ` RULED`. The nine gates it names sort equal to the parent artifact's own `coverage.superseded` (merge-source, migrate-differential, migrate-source, second-gate, witnesses-2, witnesses-5, witnesses-7, writers-differential, writers-source). The em dash sits in the clause AFTER the token and cannot reach it.

## 4. The two runs

```
B PACKAGE S5 FAIL GATE-SUPERSESSION-RULING-NOT-CITED; required evidence missing or failed; local diagnostics withheld
B PACKAGE S4 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld
```

Both exactly as predicted. The S5 log is 25 lines and I read every one: SPEC / PARENT OPTION / PARENT BOUND / POSTFIX / ENVELOPE ABSENT / PARENT PINS RE-ASSERTED / PRODUCT IMPLEMENTED / FIDELITY OBSERVED / AUTHORITY OBSERVED / PROTECTED SURFACES / PRIVATE LIVE-TRIGGERED / LAWS / LAWS DECLARED-STATE 45/45 / CARRIERS NONE / **ten children all OBSERVED, exit 0, exact declared needle at line start** / the refusal. No second refusal hides behind it, and the SPEC line names the coming stop in its own words before it happens.

**NOTE 1.** The LAWS line reads `97/104 mutant executions DETECTED · AUDIT RED-FIRST FAIL`. That is the standing public baseline, not an S5 regression: `--ci --package S4` on the TIP control prints the byte-identical line and still reaches `PUBLIC CI EVIDENCE PASS`. The report says so; I confirmed it with my own control rather than on their word.

**NOTE 2 — the artifact reproduces.** Deviation 4 (no review-s5-today-child.json) meant `envelope()` returned ABSENT and `proposed()` was never exercised. I wrote a temporary `{version:1,status:"PENDING",receipt:null}` into the worktree and re-ran `--ci --package S5`: `B PACKAGE S5 ENVELOPE PENDING artifact=96608eac4b05defff8cc3a9f54bed552b47712bc3588ade466b659cdee378d44 spec=83726bbe5aa5… runner=fdf5f55052b5…` with **no** SEALED-PROFILE-RECOMPUTATION. The artifact on disk IS what the runner's own `proposed(spec, bound)` produces, at the declared sha. File deleted again.

## 5. CI, the guard cells, and the eighth root

`rebuild.yml` moves exactly two steps and nothing else: the standing package step `--ci --package S4` -> `--ci --package S5`, and the today step, which gains `measure/test/{journey,lane,baseline,boundary}.test.mjs` by exact path, never globbed, after the unchanged thirteen. The 13-name rule reads today/test/ paths only, so it is neither satisfied nor broken by the four; the enumeration IS their whole admission, which is the DECISIONS:186 (3) property. The eighth CHILD_ROOT `rebuild/m3/w7-preview/measure/test/` is justified — DECISIONS:455 puts lane C's modules there precisely so only today-app.cjs is a sealed-byte move, and Y1 cannot reach declared `role:"new"` cells whose directory stands outside the list. It is a literal in the runner (W7), unreachable by a spec, every prior entry unchanged, and new cell **F7** pins the list in order, asserts length 8 and index 7, and asserts each root is relative, wildcard-free, separator-terminated and a real directory. Nothing pinned that list before this package. The three B-NTC guard cells take **one literal each** (`'S4'` -> `'S4','S5'`) plus a comment; no assertion is removed from any of them. H3/S3/S4 re-pins are `tooling.runnerSha256` only, 1/1 each.

## 6. Suites at this head

today-17 **666/666** (the runner's needle, 17 files by name) · measure-hermetic **11/11** · s4-real-day **15** + a0-journeys **23** = **38/38** · five s5 cells **16/16** · lane B tooling **91/91** (8 files; F7 new) · coach **218/218** · shared-preflight regressions **96/96** · A5 PWA **56/56** · rig187 **PASS** · scope-package **FROZEN-PATHS PASS / OLD-PACKAGE PASS** · public-conformance **PASS** (99 STRONG, 141 mutants) · public-oracle **PASS** (7/7, 9/9, 7/7, 7/7, ENGINE-TRACK PASS).

**NOTE 3.** The W6 tree as a whole is **653 pass / 8 fail** here — and **653 pass / 8 fail**, same files, same cause, on the TIP control. All eight trace to `Provide retained IMPORT_M4_DIR`, an env var no workflow step sets for those recovery-stage suites. Not S5's, not a regression, outside every declared child. The W6 files CI actually runs are green inside the runner's own needles.

**NOTE 4 — dash/CRLF.** Zero CRLF and zero BOM in every new or edited file. On added lines outside `rebuild/lanes/`, four dashes: two in rebuild.yml (one comment, and the step NAME whose em dash was already on the tip) and two inside the artifact's verbatim quoted ledger lines, which must not be altered. No product-page dash.

**NOTE 5 — the citation chain is consistent.** `brief.acceptedLedgerLine`, `authorizations.theme` and `coverage.superseded.rulingLineSha256` are all null, and the brief says in terms that all three are preconditions of the evidence rather than obligations counted beside it — which the runner's control flow confirms (`coverage()` -> `supersededGates()` -> `supersessionRuling()`, whose first assertion is the null check). Parent artifact `12779767…` at receipt `:449`, merge `:450`, review `31ab93f3…`, receipt base 03afc18 — all re-asserted green by the run; the brief sha the spec pins, `5163b634…`, is the file of record.

## 7. The six disclosed deviations

1. **Fifteen measure files, not DECISIONS:457's eighteen — ACCEPT.** `git ls-tree` at 4e0b4837 gives fifteen, and :457's own enumeration (7 modules + 1 fixture + 6 cells + support.mjs) counts to fifteen. The ledger's numeral is a slip over its own list; correcting it in the brief is right.
2. **CHILD_ROOTS eighth root — ACCEPT.** Section 5. Necessary, minimal, fixed in the runner, newly pinned by F7.
3. **boundary.test.mjs amended — ACCEPT, with MINOR 3's wording fix.** Necessary (the original assert is red on any branch carrying the reseal child), precedented (the declaring-spec chain the three B-NTC guard cells already use), and I proved both failure directions myself.
4. **review-s5-today-child.json absent — ACCEPT.** It is the PM's file, and supplying a temporary one showed the artifact recomputes at `96608eac…` the moment it lands.
5. **Report 151 lines over a 120 cap — MINOR 1.** Trim, and fix the two counts while there.
6. **Dead CHILD_SPECS export named for S6 — MINOR 2.** Leave it; ticket it for S6.

Nothing here blocks. The package is the S4 r4 structure applied a fourth time, its evidence is executed rather than asserted, and the only thing between this head and `PUBLIC CI EVIDENCE PASS` is the three ledger lines the PM writes.
