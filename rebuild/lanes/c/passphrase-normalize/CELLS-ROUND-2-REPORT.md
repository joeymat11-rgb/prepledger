# Passphrase cells round 2 - measured results

Measured: all 29 passphrase tests pass with the real helper; 19/20 mutants detected,
including M01/M16/M18/M19, with zero prior detections lost. The unchanged page cell
remains 5/7 on this PC (P3-B2/P3-B5 count failures). Work is uncommitted for PM4.

Builder: Astra. Branch: rebuild/c-passphrase-cells-2c.
Unchanged lane head: ba04c07f42ea63857b3a3c62cb77bbce051a0465.
This report is a hypothesis for an independent Claude reviewer instructed to disagree.
The earlier blind-review bars used a substituted sealInventedBundle helper.
This round ran the unchanged CLI helper successfully, as authorized.
No commit, push, dependency installation, or private fixture inspection is authorized.

## Helper and unchanged baseline

The unchanged CLI helper ran successfully on this PC, with the specified Node v24.19.0.
CLI verdict: ORACLE PASS, frozen 7/7, unfrozen 7/7, scope PUBLIC; private live fixture absent.
The absence was learned only from CLI stdout, never by inspecting the private path.
Unchanged unlock cell: tests 6, pass 6, fail 0. No substituted seal helper is used this round.
Scratch root: C:/Users/joeym/AppData/Local/Temp/astra-passphrase-cells-round2-20260919.
The real helper has no supplied-phrase option; C-PN-21 therefore exercises the construction alone.

## P-PN-1 - red first and construction fix

Saved red source: scratch/P-PN-1-red-unlock.mjs (scratch is the root above).
P-PN-1-red.tap, real helper, original first-pair swap:
```text
not ok 1 - C-PN-21 - wrong-order construction exchanges unequal adjacent words even when the first pair repeats
  error: 'C-PN-21: wrong-order construction returned the sealed phrase'
  expected: 'baby-baby-close-soap-square-assist'
  actual: 'baby-baby-close-soap-square-assist'
# tests 1
# pass 0
# fail 1
```
C-PN-11 now calls wrongOrder, which exchanges the first unequal adjacent pair.
C-PN-21 pins the equal-first-pair case and asserts a named C-PN-11 failure for six equal words.
The helper does not accept a supplied phrase: this deterministic row tests construction only,
under the ruling's explicit exception; C-PN-11 tests the generated reordered phrase on both decoders.
Final direct-worktree bars with the real helper: helper 10/10/0, unlock 13/13/0, route 6/6/0
(tests/pass/fail). Final mutation and page measurements are recorded below.

## P-PN-3 - comment-only boundary and paper

The clarification permits only passphrase.cjs comment lines 22 and 46 and README line 200.
No U+0085 admission change was made. C-PN-26 and C-PN-27 each pin U+FEFF OPEN
and U+0085 REFUSED at its own decoder; C-PN-28 also pins the helper/class.
An own PowerShell script removed block comments with `/\*[\s\S]*?\*/` from both
passphrase versions, wrote the remaining UTF-8 bytes, and compared their base64 byte encodings:
TRUE. This file contains block comments only; the comparison removes no executable whitespace.
Stripped files are scratch/passphrase-old-stripped.cjs and passphrase-new-stripped.cjs.
certutil SHA256:
- Old passphrase.cjs: 04688413163a1a987596185a280bad654fc11aa7c101e5ab97c63df4f1df540b
- New passphrase.cjs: a56786d3ac04e1e5cd7e8dd40ff8c40fd92c17e0d8215880bada83fa9b26a352
- Stripped bytes (equal): 6ddb91319bd93b1660072f5493bff953498608bb82f40b9ffecfa2764a616b4e

Paper corrections (final file:line):
- rebuild/m3/setup/port/passphrase.cjs:22 changes the separator-run description to
  `any run of ECMAScript \s (U+FEFF in, U+0085 out;` (continuation unchanged).
- rebuild/m3/setup/port/passphrase.cjs:46 changes the class description to
  `ECMAScript \s (U+FEFF in, U+0085 out)`; other characters unchanged.
- rebuild/m3/setup/port/README.md:200 changes `any Unicode whitespace` to
  `ECMAScript \s, including U+FEFF and excluding U+0085` in the normalization sentence.
- rebuild/lanes/c/PASSPHRASE-NORMALIZE-AUTHOR-REPORT.md:21 changes the pipeline's
  `whitespace` to `ECMAScript \s (U+FEFF in, U+0085 out)`.
- Same author paper:139 changes `Unicode whitespace` in the separator-class sentence
  to `ECMAScript \s, including U+FEFF and excluding U+0085`.
- Same author paper:369-374 replaces the broad screen claim with these sentences:
  "The refusal prose does not echo the fixed nonsense probe words; its textContent
  and refusal record are equal for the two wrong phrases tested. C-PN-29 also
  measures equal refusal textContent and refusal records for a wrong phrase and
  a malformed phrase. Each editable input keeps exactly what the athlete typed,
  inherited from the base. The input values differ, so these cells do not claim
  that the entire refused screen is identical."

Remaining product comment not edited: passphrase.cjs:25-26 still says
"That is every character a keyboard, a paste or smart punctuation can put between two words."
It is broader than the measured class and lies outside the two authorized comment lines.
The normalizer body, both decoders, sealer, wordlist and import-screen product are untouched.
Existing C-PN rows are byte-preserved except the named C-PN-11 REFUSED construction line.
Existing C-PN-16's broad label/comment is historical; the narrowed paper and new C-PN-29
state exactly what is measured without changing that existing row.

## Harness custody and limits of the page measurement

All CLI seals in this round use the original worktree support.mjs function and the real
port CLI/public oracle. No fallback seal was needed. Direct cell runs have no loader hooks.
Mutants and page builds live under scratch/head only. loader.mjs resolves installed packages
read-only and redirects copied product dependencies to scratch; support-wrapper.mjs re-exports
the unchanged real helper and overrides only exported REPO for page-test output placement.
The helper's own closed-over REPO/PORT and CLI remain the real worktree's unchanged values.
This keeps the real synthetic seal and public gate while exercising each scratch decoder/route.

Native esbuild initially refused an ancestor directory with "Access is denied". The scratch
build-browser.mjs therefore uses the earlier review's read/resolve hooks, explicit nodePaths,
and tsconfigRaw, pointed at this worktree. No assertion or worktree build file was changed.
Missing static files in the scratch copy initially caused ENOENT in page rows; copied from
this lane head and re-run. M01-M04 were re-run after the final missing preflight asset was copied.
These are sandbox-qualified counts, not a native unmodified-build PASS. The PM must remeasure
outside this sandbox and on Linux. No dependency installation or node_modules write occurred.

## What I did not verify

- Linux, external CI, physical iPhone/Safari, deployment and the whole Today step were not run.
- No private fixture, owner bundle/passphrase, ledger, auth file, protected soak, src/history.js
  or EarnedPort was inspected. The only CLI sources were the helper's invented synthetic states.
- The earlier blind review's exhaustive Unicode scan, word-pair enumeration and base/head
  compatibility census were not repeated; those earlier bars used a substituted helper.
- The deterministic repeated-first-word shape tests construction only because the real helper
  cannot take a supplied phrase. It is not reported as a deterministically sealed decoder test.
- Inherited input retention is grounded in the prior blind review's base/head comparison;
  this round measures the lane head and pins its retained draft. No new base-branch run is claimed.
- M06 may be equivalent and is reported as a survivor, not as a detected fault.
- Independent Claude review, PM commits/pushes and Linux verification remain with PM4.
  No commit, push, checkout, reset, stash, clean, fetch, full tooling package or receipt was run.
- Scratch and the helper's synthetic imp-out-* folders were retained. No manual cleanup deletion was attempted.

## P-PN-2 and P-PN-3 - mutant red evidence

Each mutation ran on scratch/head with the real helper. Exact changed files are retained
in scratch/mutants/Mxx/<original-relative-path>; mutations.ps1 and final-mutations.json
record the replacement strings. The same four cells ran for every mutation.

M01 (Remove first NFKD):
```text
not ok 18 - C-PN-22 - U+FF0C between all six words opens on both decoders
```

M16 (Strip surrogate halves):
```text
not ok 19 - C-PN-23 - a lone U+D800 inside a word refuses on both decoders
```

M18 (Node refusal leaks typed field):
```text
not ok 20 - C-PN-24 - node whole refusal JSON is literal and independent of two typed strings
```

M19 (Phone refusal leaks typed field):
```text
not ok 21 - C-PN-25 - phone whole refusal JSON is literal and independent of two typed strings
```

M17 (Accept U+0085 as separator):
```text
not ok 10 - C-PN-28 - the helper pins ECMAScript whitespace, including U+FEFF and excluding U+0085
not ok 22 - C-PN-26 - node entry uses ECMAScript whitespace: U+FEFF opens and U+0085 refuses
not ok 23 - C-PN-27 - phone entry uses ECMAScript whitespace: U+FEFF opens and U+0085 refuses
```

C-PN-24 and C-PN-25 compare each WHOLE JSON.stringify(error) to an inline literal
and compare the two serialized errors to each other. Neither decoder has a varying field
in the measured serializations. No projection, key deletion or substring masking is used.

## P-PN-4 - retained draft red evidence

Scratch/head/rebuild/m3/w7-preview/import/import-screen.mjs was changed only from
`input.value = words;` to `input.value = '';` for this negative control, then restored.
P-PN-4-retention-red.tap (real helper):
```text
not ok 1 - C-PN-29 - wrong and malformed phrases have equal refusal text and records while each input retains its draft
  error: |-
    Expected values to be strictly equal:
  actual: ''
# tests 1
# pass 0
# fail 1
```
The actual TAP diagnostic is multiline; its assertion reports empty actual input against
the synthetic wrong phrase. C-PN-29 passes unchanged product and compares raw textContent,
the full refusal record, and each input.value against its own typed string.

## Final mutation table

Every run: 36 tests, zero skipped/cancelled. Pass/fail includes the two unchanged page failures.
C numbers below are C-PN identifiers; page failures P3-B2/P3-B5 occur in EVERY row.
No prior detection was lost: all previously failing C-PN identifiers remain failing for
that same mutant (compared programmatically with the prior review's mutations.json).
19 detected, 1 baseline-equivalent survivor (M06). The prior review had 14 detected.

| ID | Exact change | Additional C-PN failures | Pass | Fail |
|---|---|---|---:|---:|
| M01 | Remove first NFKD | 22 | 33 | 3 |
| M02 | Remove lower case | 2, 9, 10, 15 | 30 | 6 |
| M03 | Replace first separator run only | 2, 4, 9, 10, 14, 15, 19, 20, 22, 26, 27, 28 | 22 | 14 |
| M04 | Remove whitespace class | 2, 4, 5, 9, 10, 14, 19, 20, 26, 27, 28 | 23 | 13 |
| M05 | Remove end trimming | 2, 4, 9, 10 | 30 | 6 |
| M06 | Remove final NFKD | NONE | 34 | 2 |
| M07 | Return non-string unchanged | 4 | 33 | 3 |
| M08 | Drop U+2015 | 2, 5 | 32 | 4 |
| M09 | Drop comma | 2, 5, 22 | 31 | 5 |
| M10 | Trim leading end only | 2, 4, 9, 10 | 30 | 6 |
| M11 | Bypass Node helper | 6, 10, 22, 26 | 30 | 6 |
| M12 | Bypass phone helper | 6, 9, 14, 15, 22, 27 | 28 | 8 |
| M13 | Call Node helper but ignore result | 10, 22, 26 | 31 | 5 |
| M14 | Call phone helper but ignore result | 9, 14, 15, 22, 27 | 29 | 7 |
| M15 | Strip combining marks | 3 | 33 | 3 |
| M16 | Strip surrogate halves | 23 | 33 | 3 |
| M17 | Accept U+0085 as separator | 26, 27, 28 | 31 | 5 |
| M18 | Node refusal leaks typed field | 24 | 33 | 3 |
| M19 | Phone refusal leaks typed field | 25 | 33 | 3 |
| M20 | Export stateful regex | 19 | 33 | 3 |

## Final bars on this PC

Node: C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe
Version: v24.19.0. Each test invocation set these on separate PowerShell lines:
```powershell
$env:MEASURED_TEST_NOW = '2026-09-03'
$env:TZ = 'America/New_York'
```
All runs used --test --test-isolation=none --test-reporter=tap, sequentially.
Direct cells ran from this worktree with no hooks. Scratch runs additionally used
--import file:///C:/Users/joeym/AppData/Local/Temp/astra-passphrase-cells-round2-20260919/loader.mjs.
The full four-file scratch run imports run-tests.mjs. No whole Today step was run.

| Cell | Tests | Pass | Fail | Evidence |
|---|---:|---:|---:|---|
| helper.test.mjs | 10 | 10 | 0 | helper-final.tap, direct worktree |
| unlock-forms.test.mjs | 13 | 13 | 0 | unlock-final.tap, direct worktree, real helper |
| route.test.mjs | 6 | 6 | 0 | route-final.tap, direct worktree, real helper |
| page-bundle.test.mjs at unchanged lane head | 7 | 5 | 2 | lane-head-page.tap, scratch resolution qualified |
| Final four-file run after restoring every scratch mutant | 36 | 34 | 2 | final-all.tap, real helper |

The unchanged page cell was never edited. The lane-head page measurement restored the
original passphrase.cjs bytes in scratch; all page product inputs match the lane head.
The final passphrase comment changes have the same page failures, not a new page regression.
Exact failing assertions at the unchanged lane head, from lane-head-page.tap:
```text
not ok 2 - P3-B2 - the accepted page bundler BUILDS the admission graph: no computed require, no glob sweep, no engine/test, no engine/seed.cjs, no engine/index.cjs
    the Import graph is 139 modules, not the measured 143 (the brief's 133, the F7 family's one, the F8 family and the shared-class router's two, the route's own four, B-LOM's order-mapping provider, P3-REAL-SHAPE's lift-correspondence helper, and PASSPHRASE-NORMALIZE's shared passphrase form): re-measure and say so
  expected: 143
  actual: 139
not ok 5 - P3-B5 - A1 BUILDS with the new law, and what the Import route costs the one page is measured, not assumed
    the delta is 17 modules, not the measured 21 (the route's 19 plus the two boot modules, B-LOM's order mapping and the shared passphrase form): re-measure and say so
  expected: 21
  actual: 17
# tests 7
# pass 5
# fail 2
```
P3-B2 at page-bundle.test.mjs:182 asserts withAdmission.inventory.length === 143; actual 139.
P3-B5 at page-bundle.test.mjs:386 asserts today.inventory.length - 121 === 21;
actual 17, hence shipped inventory 138. These two baseline failures are not waived.
The PM remeasures outside this sandbox and on Linux at these bytes.

## Scope verification and certutil SHA256

verify-scope.cjs read each baseline using git show HEAD:<explicit-path> -- <explicit-path>.
It compared every original cell byte with the final prefix, except the one authorized
C-PN-11 construction expression. PASS. No old row was removed, skipped or weakened.
It also checked all added diff lines ASCII, every changed file LF, report ASCII, and
normalizer changed lines exactly [22, 46] with identical comment-stripped bytes. PASS.

Final changed files, measured with certutil -hashfile <file> SHA256:

| File | SHA256 |
|---|---|
| rebuild/m3/setup/port/passphrase.cjs | a56786d3ac04e1e5cd7e8dd40ff8c40fd92c17e0d8215880bada83fa9b26a352 |
| rebuild/m3/setup/port/README.md | e03adafcf154375c5aa1c95e46d1198ee13b1d6bd9816643cd6221b24300fe72 |
| rebuild/lanes/c/PASSPHRASE-NORMALIZE-AUTHOR-REPORT.md | 1dfb0faceba8a61e747400b28f3d43f476ec1f43b72f848764775d5fe857d592 |
| rebuild/lanes/c/passphrase-normalize/helper.test.mjs | 45dd4bc196b49461adbee63ccc7486e70a3addefe5e11570403da06817524641 |
| rebuild/lanes/c/passphrase-normalize/unlock-forms.test.mjs | 1d109886b26c7dd52a452a1b0ff7e2e508f29bd47d690cf4f691d9f75a0340f8 |
| rebuild/lanes/c/passphrase-normalize/route.test.mjs | 0a9a4dde7a59d9b46f6267313d29c8f630d73509610b553864b9ed92691033dc |

This report's final certutil SHA256 is recorded after it is finalized in
C:/Users/joeym/AppData/Local/Temp/astra-passphrase-cells-round2-20260919/report-final-certutil.txt.
A file cannot embed its own final hash; that external measurement covers this report including
the terminal transcript below. No tracked file contains a checksum of an earlier report version.

## Final terminal transcript

The final two commands are git status --porcelain and git diff --stat with the seven
owned paths explicitly after --. Their stdout is pasted below; git also warns that the
user-level ignore file cannot be accessed. The new report is untracked, so diff --stat
counts the six tracked changes only. The final repeat is checked against this transcript.

```text
git status --porcelain
 M rebuild/lanes/c/PASSPHRASE-NORMALIZE-AUTHOR-REPORT.md
 M rebuild/lanes/c/passphrase-normalize/helper.test.mjs
 M rebuild/lanes/c/passphrase-normalize/route.test.mjs
 M rebuild/lanes/c/passphrase-normalize/unlock-forms.test.mjs
 M rebuild/m3/setup/port/README.md
 M rebuild/m3/setup/port/passphrase.cjs
?? rebuild/lanes/c/passphrase-normalize/CELLS-ROUND-2-REPORT.md

git diff --stat -- rebuild/m3/setup/port/passphrase.cjs rebuild/m3/setup/port/README.md rebuild/lanes/c/PASSPHRASE-NORMALIZE-AUTHOR-REPORT.md rebuild/lanes/c/passphrase-normalize/helper.test.mjs rebuild/lanes/c/passphrase-normalize/unlock-forms.test.mjs rebuild/lanes/c/passphrase-normalize/route.test.mjs rebuild/lanes/c/passphrase-normalize/CELLS-ROUND-2-REPORT.md
 .../lanes/c/PASSPHRASE-NORMALIZE-AUTHOR-REPORT.md  | 18 +++---
 .../lanes/c/passphrase-normalize/helper.test.mjs   |  8 +++
 .../lanes/c/passphrase-normalize/route.test.mjs    | 20 ++++++
 .../c/passphrase-normalize/unlock-forms.test.mjs   | 74 +++++++++++++++++++++-
 rebuild/m3/setup/port/README.md                    |  2 +-
 rebuild/m3/setup/port/passphrase.cjs               |  4 +-
 6 files changed, 112 insertions(+), 14 deletions(-)
```
