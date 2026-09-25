# REVIEW-S10-FINAL-CENSUS-l1 (Fable, independent checker; 2026-09-25)

Object: the final M/R/N census d7f6540..92be4e3 (brief 3.2; Fable R11 F1; Astra L8 Q6):
rebuild/lanes/b/S10-FINAL-CENSUS.tsv (sha256 732cd7fd65571cb7..., 51492 B, 351 rows, 0 CR,
0 non-ASCII) and the new "Final census at 92be4e3" section of
rebuild/lanes/b/S10-INTEGRATION-REPORT.md (sha256 f0a5ec00c0c68df0..., 52599 B, 0 CR).
Instrument %TEMP%\opus55-s10census\census.cjs sha256 eef1f0a029e17dd5... (read, not run).
I did not write any of it. STATIC only: git diff/ls-tree/merge-base by explicit path,
my own node scripts in %TEMP%\fable-census-check (check.cjs, mcheck.cjs, spot.cjs).
No test, child, runner or pm-run slot. Protected five: not in the changed set (checked by
name); rebuild/engine paths read by header only. No soak, src, ledger, private path listed.

## 0. VERDICT

ACCEPT WITH NAMED DEBTS. The census is complete over the range, every row classifies,
the 15 M rows survive a stricter check than the instrument's own, and the reconciliation
to the 299 at f97924a is exact. The 3.2 STOP does not fire. One named debt on how the
headline number is labelled (D-CENSUS-STAGED-COUNT, section 6).

## 1. Recomputed hunk list (my instrument, independent of census.cjs)

- `git diff --name-only d7f6540 92be4e3 --` yields 115 paths; with and without the
  soak/ledger/src/private excludes the count is the same 115 (nothing excluded). Author: 115.
- `git diff -U0 --no-renames d7f6540 92be4e3 -- <path>` per path, counting `@@` headers:
  329 physical hunks in the range.
- Author's TSV: 351 rows. Path-by-path: 113 of 115 paths agree exactly; the two that do
  not are the two split files with Track B work:
  - rebuild/m3/w7-preview/today/gym-app.mjs: range 49; TSV 58 = P->b35a48e 11 + b35a48e->HEAD 47.
  - rebuild/m3/w7-preview/today/gym-settings-lane.mjs: range 1; TSV 14 = P->b35a48e 1 + b35a48e->HEAD 13.
  Re-running the author's two-stage rule myself gives 351 exactly, so 351 = 329 + 22 is
  the stage split, not a counting error. The other four split files have 0 stage-B hunks
  (today-app 124, today-model 4, today-lanes 1, today-readings 1), so range = staged there.
- b35a48e (Track A base) is NOT a descendant of d7f6540 (merge-base da9f868). The stage-A
  diff is still a pure-cut diff because the three cut sources are byte-equal at the parent
  and at the cut input (brief 3.1, EQUAL 3/3); my stage-A run reproduces M 15 / R 127 on
  142 hunks, equal to the author.

## 2. Classes, path by path

TSV totals: M 16, R 143, N 192, UNCLASSIFIED 0 (declared M 15 R 141 N 149 = 305 over 70
paths; undeclared M 1 R 2 N 43 = 46 over 45 paths). Both scope tables in the report match
the TSV. role/status combos: released/M 182, new/A 53, new/M 17, edited/M 52,
undeclared/A 43, undeclared/M 3, superseded-by-child/M 1; no "carried" row exists, so the
instrument's carried-but-changed UNCLASSIFIED rule never fired (0 declared-carried paths
changed, as the report says).

## 3. Spot checks against brief 3.2 (M pure moved byte, R declared rewrite, N new behavior)

Track A M (3 checked, plus all 15 by instrument): today-app.cjs -370 +392 (15/0),
-2483 +1892 (65/0), -484 +454 (20/0). All 15 M rows are pure removals from today-app.cjs
whose every line reappears as an addition in a sibling (today-lanes.cjs; some blank/brace
lines also in today-readings, gym-settings-lane, gym-app). Stricter than the instrument:
the instrument tests presence only; I tested multiplicity (removed count == added count
across the six files). Every non-trivial line balances; the 7 unbalanced lines are "}",
"}," and blank lines. M holds.
Track A R (4): today-app.cjs -34 +35 (0/5: the split banner and the today-lanes require,
authored, declared by regions.json), -362 +367 (4/22: painter/facade/hooks compose block),
gym-app.mjs -20 +21 (0/3) and gym-settings-lane.mjs -0 +1 (0/103: new file whose banner
says the only authored lines are banner, factory line and return block). R is right: cut
rows are declared rewrites, not pure moves.
Track B N (2): gym-app.mjs A->H 47 hunks and gym-settings-lane.mjs A->H 13 hunks are N by
provenance (accepted GSS writer work), the strictest class; correct for 3.2, and I note it
is not a content review (report limit 1 says so).
rebuild/engine, header only (4): today.cjs @@ -97 +97 @@ (1 hunk, N), writers.cjs
@@ -227 +227 @@ (1, N), test/proposed-pick.test.cjs @@ -0,0 +1,292 @@ (1, N),
PROPOSED-PICK-REPAIR-REPORT.md @@ -0,0 +1,58 @@ (1, N). Counts and headers equal the TSV.
N is right for declared engine edits under the EPP grant (brief 7.2); no text read.
R re-pins (3): S3.json -45 +45 (runnerSha256 hex only), local-source-profile.cjs -16 +16
(today.cjs pin hex only), configured-history-candidate/run.cjs -24 +24 (engine-capture pin
hex only). Each hunk differs only in a 64-hex digest: R.
Undeclared (3): DECISIONS.md -809 +810 (0/2): `git diff --name-only ace916f 92be4e3 --
rebuild/DECISIONS.md` is empty, so the two appended lines are byte-equal to the chain tip;
M under the report's stated reading. build.mjs -105 +106 (0/10) and -112 +123 (0/4): only
REQUIRED_INPUTS entries for today-readings.cjs, today-lanes.cjs, gym-settings-lane.mjs
with their comments; R as a declared composition edit (spec B.10, brief 4.1). rebuild.yml:
6 hunks (-161, -242, -244, -304, -306, -331), all N, equal to the TSV.
Edited tests (2): problem.test.mjs 3 hunks (-1100, -1621, -3584 +3596 0/93) N;
machine-settings-view.mjs 5 hunks N. Equal to the TSV.
Total spot-checked: 21 rows plus the 15 M rows by instrument. 0 disagreements.

## 4. Reconciliation to the 299 at f97924a

My instrument at f97924a: 100 paths, 313 physical hunks, 335 staged rows. Author's
census-f97924a.tsv (sha256 fb949992f2f688b0..., matches): 335 rows, M 16 R 143 N 176;
minus the undeclared 36 = declared 299 (M 15 R 141 N 143), equal to round 11.
Delta to 92be4e3, verified by explicit-path diffs f97924a..92be4e3:
- copy-lock five: absent at f97924a (P..f97924a empty), one new-file hunk each at HEAD (+5).
- problem.test.mjs: one added hunk -3595 +3596 (0/93) (+1). Declared 299 -> 305.
- cut.cjs: two commit hunks (+259, +743) inside its single new-file hunk (0 count change).
- rebuild.yml: f97924a..HEAD is one 1/1 hunk at +259, inside existing hunk -244 +259 (0 change).
- undeclared 36 -> 46: +10 new record files, all N. 335 -> 351 = +16. Exact.
delta.log sha256 939a86ab0de37e2b... matches the report.

## 5. State of W (confirmed)

HEAD 92be4e3. `git status --porcelain`: M S10-INTEGRATION-REPORT.md (author),
?? S10-FINAL-CENSUS.tsv (author), and two edits the author did not make:
M rebuild/m3/w7-preview/import/test/page-bundle.test.mjs, M rebuild/m4/import/production-mapping.cjs.
The census reads committed blobs, so they do not touch it; W is not clean for T4 until the
PM rules on those two files. Nothing committed by me.

## 6. Findings

F1 NAMED DEBT D-CENSUS-STAGED-COUNT. The report table row "ALL changed paths
d7f6540..92be4e3 | 351" and the headline "351 hunks across 115 changed paths" read as the
physical hunk count of that range; the physical -U0 count is 329. The two-stage method is
disclosed in the section text and is round 11's, and the brief's 6.1/6.2 track separation
justifies it, but the label does not say "staged rows". Fix: add "329 physical hunks in
the range; 351 rows with the split files counted per stage" to the table or the headline.
Both numbers carry 0 UNCLASSIFIED, so the 3.2 verdict is unchanged.
F2 OBSERVATION (no action). The instrument's M rule tests presence in the added multiset,
not multiplicity; a hunk of only "}" lines could pass it. At these bytes no such hunk
exists (section 3), so no row is wrong; a future run of the same rule should add the
multiplicity check.
F3 OBSERVATION (declaration reviewer, not the census). Seven declared paths carry role
"new" in S10.json yet exist at the parent (status M): machine-settings-view.mjs,
today-model.cjs, s3-portable-sources.json, configured-history-candidate/run.cjs,
engine-capture.cjs, configuration-capture.test.cjs, engine-capture.test.cjs. The class is
unaffected (new-file is decided by ls-tree at the parent, not by role); "new" may mean
new to the pinned pack. Worth one line in the S10.json notes so a reader does not misread it.
F4 CONFIRMED as the author states: B.10's build.mjs:391 re-point is not in the range;
the protected five and app.js are not in the changed set; DECISIONS.md is byte-equal to
ace916f; all five cited sha256 values match.

## 7. What I did not do

Did not run census.cjs, any test or pm-run slot (static role). Did not verify the "0 guard
refusals" claim (no log path given to me). Did not read the S10.json role definitions to
settle F3. Did not review Track B hunk content (out of 3.2 scope; 6.2 evidence owns it).

## AAR
- asked: independently recount and reclassify d7f6540..92be4e3, compare with the TSV, spot-check 15, confirm the f97924a reconciliation, verdict.
- happened: 115 paths / 329 physical hunks recomputed; 113 paths equal, 2 differ by the disclosed stage split (351 = 329 + 22, reproduced); 21 rows plus all 15 M rows checked, 0 wrong; 335 -> 351 delta exact; hashes match; verdict ACCEPT WITH NAMED DEBTS.
- rework: none required of the author beyond the F1 label; PowerShell 5 dropped a bare "--" from native-command argv, so I moved the diffs to node (execFileSync) to keep explicit "--" paths.
- escaped: nothing found in the census itself; the two foreign uncommitted edits in W are a PM matter, not a census defect.
- lesson: a staged census and a range census answer different questions; publish both numbers so the headline cannot be misread.
- cost: about 25 tool calls, 5 scratch scripts in %TEMP%\fable-census-check, no slot time.
