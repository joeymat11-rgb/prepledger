# REVIEW-S10-T6F-FABLE-l1 - independent Fable review of the T6 spec diff (S10.json baa1c660 -> fbb4a490) and the census addendum commit 2c4d24e (Claude Fable 5.1, 2026-09-25)

VERDICT: ACCEPT (with two named non-blocking debts D-T6F-1, D-T6F-2 below; D-SP-2 RULING CONCURRED).
Role: independent reviewer T6f (wrote none of the prepared artifacts, the T5 bodies, T6-apply.cjs or the addendum). STATIC ONLY: git show/diff/ls-tree/
rev-parse/log by explicit path, node fs/crypto over extracted bytes (cmd /c git show > file), read_file, Select-String on two public test files.
Nothing run (no test, child, runner, b-package, REGEN, T6-apply.cjs, census.cjs); nothing committed, pushed or written under W. New files only under
%TEMP%\s10-seal-prep\t6f\ (review.cjs, review2.cjs, review.log, extracted blobs). Rules file opus55-RULES.txt read whole, sha256 51706c33 - matches.
DECISIONS read: lines 828-831 whole and the head of 827, from git show 194f03f:rebuild/DECISIONS.md (832 lines incl. trailing empty; last line 831).
Prior check REVIEW-S10-SEAL-PREP-l1.md read as context; every figure below is my own recomputation, not carried from it.

## 0. State measured
- W HEAD 2c4d24e731ee (parent f4125cdbb12a); refs/remotes/origin/rebuild/t2-client-core = 194f03fda81a (CHAIN), message "DECISIONS:828-831 S10 T5 token lines".
- git status --porcelain: exactly ` M rebuild/lanes/b/tooling/packages/S10.json`. Disk S10.json sha256 fbb4a490 (106863 B); f4125cd and 2c4d24e blob
  baa1c660 (103439 B) - the addendum commit did not touch the spec. Both files canonical JSON.stringify(x,null,2)+LF; disk has 0 CRLF.
- Brief: 2c4d24e blob of rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md sha256 e5aabac9809f70dc5dcc105892a4f4ff468193d713c6e6d99a044bf40e5b74c8, 81810 B;
  disk brief byte-equal. Needle table %TEMP%\s10-t4-needles-f4125cd.txt sha256 ad2374d64792... (36 rows, header excluded).

## 1. Spec diff baa1c660 -> fbb4a490: EXACTLY the listed fields, nothing else moved
- Deep diff in node (own code): 55 changed leaf paths = 36 children[*].needle + exactly these 19: packageId, status, brief.file, brief.sha256,
  brief.acceptedLedgerLine, coverage.superseded.rulingLineSha256, the 5 coverage.superseded.gates[*].why, release.rulingLineSha256,
  authorizations.theme, authorizations.review.prefix, artifact.file, artifact.review, notes[0], notes[2], notes[7]. 0 structural changes (no key
  added, removed or reordered at any level; no array length change). Top-level key order identical. product identical; children minus needle identical.
- notes length 10/10; notes[8] byte-identical (DECISIONS:792 CARRIERS, the round-11 reconciliation).
- Values: packageId "M2-S10-TODAY-SPLIT"; status "PROPOSED" -> "BRIEF-ACCEPTED"; review.prefix "POSTFIX-ACCEPTANCE M2-S10-TODAY-SPLIT"; artifact
  acceptance-s10-today-split.json / review-s10-today-split.json (slug of the package id, as S9's acceptance-s9-ui-pins.json).
- Non-ASCII: base 81 -> disk 87; the +6 are exactly six U+00B7 (the embedded THEME line carries 3, the BRIEF ACCEPTED line 3) inside the two claim
  objects, the same way S9's 6dc2596 spec carried its claim lines. The 33 U+2013/U+2014 are the carried owner claim, identical in base and disk. No new dash.
- PROPOSED / "null until" survivors: none in the moved fields. The two remaining hits are a carried product path (rebuild/engine/PROPOSED-PICK-REPAIR-REPORT.md,
  :63) and notes[4]'s engine PROPOSED entry (D-EPP-3 text, :2056) - both identical in base and disk, neither a spec-status word.

## 2. Ledger claims recomputed at CHAIN 194f03f (sha256 of the UTF-8 line bytes, no newline)
- :828 349 B 6f6b5410071eab452cfa0a9f46748ea08c1db8533345f46361ea91626106c525 == release.rulingLineSha256. Line: RELEASE-FROM-SEAL M2-S10-TODAY-SPLIT
  today-app.cjs,gym-app.mjs, cites brief 4.3, "exactly these two paths leave the seal, each at its parent pin", last clause RULED. The path set equals
  the spec's two role:released product entries; each pre (today-app efaf6c0d, gym-app 4c8ba0c9) == the S9 artifact's post for that path (f4125cd blob).
- :829 789 B d8884ec6f13e0df0ff078bc2c0d2d90ffc1c06d1820c15fdcf5e3ddcaa550c92 == coverage.superseded.rulingLineSha256. Names all five gate keys
  (source-carriers, inherited-carriers, defect-witnesses, writers-differential, second-gate) and the nine gates; last clause RULED.
- :830 989 B c497e941acaf414c9dfa9a2c2a562af27d02149065cee4e0b3780df141c1c17b == authorizations.theme.lineSha256; theme.line == :830 byte-equal,
  ledgerLine 830, role cowork, keys exactly ledgerLine,role,line,lineSha256; names the package, carries " cowork ", ends "ACCEPTED"; the S9 artifact
  sha it cites (f2447622...) == parent.options[S9].sha256.
- :831 324 B 1fa5309c2d70eaa39873439e85e689c43083a720eb857d8102667dd640e3bea0 == brief.acceptedLedgerLine.lineSha256; line == :831 byte-equal,
  ledgerLine 831, role cowork, same 4 keys; names the package and brief.file, carries the true sha e5aabac9... and "(81810 bytes)", ends "ACCEPTED".
- The five whys all open "DECISIONS:153 (the standing role) and the token clause DECISIONS:829 (RULED) for M2-S10-TODAY-SPLIT, located by its own
  sha256 d8884ec6f13e...: " (12-hex locator == :829's sha prefix), then the base's gate-specific reason unchanged. notes[7] cites :829 and :828 with
  d8884ec6f13e... / 6f6b5410071e... (both correct prefixes). notes[0] cites :816, :831, :830, :829, :828, :827 and the needle table sha ad2374d64792 (correct).

## 3. Needles against the table (own comparison)
- 36 table rows, order == children order (name column == child name for all 36). 35 needles == the table's NEEDLE (TERMINAL: prefix stripped for
  s10-engine-files-differential, whose needle is the terminal line "ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine file(s) ... 2 named files
  move, each"); every such row EXIT=0, # fail 0, pass == tests. Base needles were all null; disk needles are all non-empty strings, no line breaks.
- m4-import-production = "# pass 28" (the table's "# pass 19" at f4125cd is the sealing-window red: 21 tests, 2 fail). D-T6F-1 (named, PM-MEASURE):
  I cannot re-observe it (grant (g)). Static consistency only: production-mapping.test.cjs has 20 top-level test() and production-admission.test.mjs 7;
  both files open on packages/<standing>.json status BRIEF-ACCEPTED read from DISK (:104-:112 / :309-:316), so at f4125cd the .mjs file was one failing
  file-level entry (20+1 = 21 tests, P3-M3 + the file = 2 fail, 19 pass) and at these bytes its 7 subtests run (21+7 = 28). "# pass 28" is arithmetically
  the only green count consistent with the red row; the runner asserts it again at T8 anyway (CHILD-NEEDLE-*). notes[0] and notes[2] describe it truthfully.

## 4. Shapes against the S9 precedent 6dc2596 (%TEMP%\earned-s9int, S9.json 6dc2596~1 vs 6dc2596, own diff)
- S9's T6 changed status, brief.acceptedLedgerLine, authorizations.theme, coverage.superseded (added rulingLineSha256 + gates, dropped its status key),
  release (added), notes[0], notes[1], one product post and 19 needles. S10's base already carried every key with nulls, so S10's T6 is value-only
  (no structural change) - stricter than S9, and the resulting shapes are identical: release = {rulingLineSha256}; coverage.superseded =
  {rulingLineSha256, gates}; theme and acceptedLedgerLine = {ledgerLine, role, line, lineSha256}; whys open exactly as S9's
  ("DECISIONS:153 (the standing role) and the token clause DECISIONS:787 (RULED) for M2-S9-UI-PINS, located by its own sha256 b8d088af3eb8...:").
- S10-only moved fields (packageId, brief.file, brief.sha256, review.prefix, artifact.*, notes[2], notes[7]) are the STOP placeholders the working
  brief 2.1 left null and the runbook T6 lists; S9 had them filled at composition. Nothing in the S10 diff lacks an S9 counterpart in kind.

## 5. Census addendum commit 2c4d24e - CORRECT
- Parent f4125cd; message "S10: census addendum 92be4e3..f4125cd (361 staged rows / 339 physical, 0 UNCLASSIFIED); pays D-CENSUS-STAGED-COUNT".
  diff --name-status f4125cd 2c4d24e -- rebuild .github = M S10-FINAL-CENSUS.tsv, M S10-INTEGRATION-REPORT.md only; root ls-tree of the two revisions
  differs only in the rebuild subtree (no root-level or app.js change). Blobs at 2c4d24e: TSV 953d8bdb (53324 B, 362 lines = header + 361 rows),
  report 017a6875 (57377 B) - the shas the checklist T6a names. No product byte.
- The 10 appended TSV rows recounted from git diff -U0 d7f6540 f4125cd by explicit path: page-bundle.test.mjs 6 hunks (-182 +182,9; -184 +192;
  -187 +195,2; -384,0 +394,8; -386 +403; -388,2 +405,3) == the rows' -182 +182 1/9, -184 +192 1/1, -187 +195 1/2, -384 +394 0/8, -386 +403 1/1,
  -388 +405 2/3; production-mapping.cjs 1 hunk -55 +55,2 = the treeSha256 re-pin plus one added comment line, so not hex-only -> N (the rows say N;
  the alternative R totals M 16 R 144 N 201 are disclosed). Three new records A in 92be4e3..f4125cd (L8 review, T4-FIX review, FINAL-CENSUS review),
  one new-file row each. Totals 120 paths / 361 staged / 339 physical / M 16 R 143 N 202 / 0 UNCLASSIFIED - arithmetic checks against the 92be4e3 table.
- The two D-CENSUS-STAGED-COUNT label rewrites (table row and "Machine table" sentence) are in the committed report; the addendum section is
  appended after the accepted census section; the report's own row keeps 0/144 as the addendum discloses (D-SP-1 accepted by disclosure).

## 6. D-SP-2 ruling (the TSV's self-reference): CONCUR with the PM
- The accepted census at 92be4e3 stated limit (5) itself: "This section and the TSV are themselves new record bytes ... outside the census." The TSV is
  the census's own machine table; counting it would make the census count itself, and every later addendum would add one more row for the row it adds.
  The unmodified instrument calls it UNCLASSIFIED only because its record rule admits .md; the file has no product role (outside S10-REGEN SCOPE),
  no execution route, and moves no product byte, so the brief 3.2 STOP (unclassified declared/product bytes) is not the class it belongs to.
- The ruling is sound because it is disclosed, not hidden: the addendum states the alternative (121 paths / 362 staged / 340 physical / N 203) so a
  reader who rules otherwise can re-derive. D-T6F-2 (named, non-blocking): the T6a commit message's "0 UNCLASSIFIED" holds under limit (5) only;
  the VERDICT-S10.md (T22) should say "0 UNCLASSIFIED under census limit (5), TSV self-reference excluded (D-SP-2)" so the message is not read alone.

## 7. What this reviewer could not do
- Run nothing (role and rules): T6-apply.cjs's live refusals, the pm-run T6c re-observation and every (g) step are PM claims; "# pass 28" is
  PM-MEASURE (section 3). The fence's runtime behaviour on these bytes is a static read (no key added, so SPEC_KEYS closure is untouched).
- Not re-read: the runbook, the S9 ledger lines, any protected path. D-SP-3..D-SP-6 of the prep check stand as named; none is paid or worsened by T6.

## AAR
1. Did: recomputed the 55-path deep diff and its 0 structural changes, the four ledger line hashes at 194f03f against every claim and cited prefix, the brief blob sha and bytes, all 36 needles against the table, the two released pins against the S9 artifact, the S9 6dc2596 shapes, and the addendum's 10 rows from raw -U0 diffs.
2. Verdict: ACCEPT; the spec on disk (fbb4a490) is BRIEF-ACCEPTED with every claim true at CHAIN 194f03f and nothing outside the listed fields moved; 2c4d24e is the two-file addendum commit at the prepared shas.
3. Nothing ran but git and node over bytes; nothing committed, pushed or written under W; no protected path opened.
4. Sharpest finding: the diff is value-only (S9's T6 was structural), so the fence's key closure cannot have moved; the one unverifiable value is "# pass 28", which is the only green count consistent with the red 21/2 row.
5. Rule slips: none; DECISIONS read at 827 (head) and 828-831 only; the S9 precedent from the S9.json diff, no S9 ledger line.
6. Next for the PM: T6g commit H = S10.json only, with D-SP-4 (T6-apply single-use) in the freeze note and D-T6F-2's wording carried to T22.
