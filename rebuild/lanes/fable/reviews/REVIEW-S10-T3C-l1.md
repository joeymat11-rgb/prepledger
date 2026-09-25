# REVIEW-S10-T3C-l1: independent Fable review of the runbook T3c integration (copy lock into the S10 lane, brief rev 3)

Reviewer: Claude Fable 5.1, independent (did not do the integration). Date: 2026-09-25.
Subject: lane worktree W = %TEMP%\earned-s10int, branch rebuild/b-s10-integration, HEAD 88cded3 (f97924a + round 11),
plus 9 untracked files under rebuild (8 lock/review files copied from %TEMP%\earned-s10-copylock at detached f97924a,
and rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md revision 3). Rules file opus55-RULES.txt sha256 51706c33 read whole.
Every measurement below is mine (PowerShell Get-FileHash, git hash-object / show / diff with explicit paths after --,
node under %TEMP%\pm-run.cjs shared with %TEMP%\s10-copylock-scratch\guard.cjs preloaded). No soak, protected-five,
src/, ledger or private path was read. Nothing committed, pushed or written outside W's review path and %TEMP%\t3c-rev.

## VERDICT: ACCEPT (T3c integration is faithful; one informational note on the chain tip, no fix owed)

## 1. The eight copied files are byte-equal to their source (sha256, W == copylock worktree)

| file | sha256 (W) | == source | git blob (W) |
|---|---|---|---|
| rebuild/m3/w7-preview/today/test/copy-lock.cjs | 7bc18462... | EQ | 44463fdb |
| rebuild/m3/w7-preview/today/test/copy-lock-states.mjs | f49eb98d... | EQ | 86ee00b3 |
| rebuild/m3/w7-preview/today/test/copy-lock.test.mjs | 55ceef75... | EQ | a46e8eaa |
| rebuild/m3/w7-preview/today/test/copy-lock.corpus.json | e3b1be10... | EQ | 5bdc6826 |
| rebuild/m3/w7-preview/today/test/copy-lock-measure.mjs | 68776f29... | EQ | fca0d35b |
| rebuild/lanes/c/COPY-LOCK.md | 7dd1b122... | EQ | 0a860acc |
| rebuild/lanes/fable/reviews/REVIEW-S10-COPYLOCK-l1.md | cc901a2c... | EQ | (not cited in brief) |
| rebuild/lanes/fable/reviews/REVIEW-S10-COPYLOCK-l2.md | b9b3ee4f... | EQ | (not cited in brief) |

All five shas the brief names for the lock files and the two review shas match; the six blob ids the brief's section 8
names match git hash-object in W. `git status --porcelain -- rebuild` in W lists exactly these 8 plus the brief as
untracked (??); `git diff --stat -- rebuild` is empty; none of the 9 paths exists in tree 88cded3 (ls-tree empty).

## 2. The lock runs green in W, and an independent re-measure reproduces the sealed corpus byte for byte

Run: `node %TEMP%\pm-run.cjs shared t3c-rev-lock %TEMP%\t3c-rev\t.cmd` (cwd W; MEASURED_TEST_NOW=2026-09-03,
TZ=America/New_York; NODE_OPTIONS=--require guard.cjs; GUARD_LOG=%TEMP%\t3c-rev\guard.log; Node v24.19.0, Windows).
Slot held after 340 s of waiting on the four r21a shared runs. Outputs: %TEMP%\t3c-rev\rev-green.tap, rev-measure.txt.

- `node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/copy-lock.test.mjs`: ok 1 CL-PIN, ok 2 CL-HOLDS,
  ok 3 CL-TWO-SIDED, ok 4 CL-PLANTS, ok 5 CL-COMPOSED, ok 6 CL-CLOSURE; tests 6, pass 6, fail 0, skipped 0, EXIT=0.
- `node rebuild/m3/w7-preview/today/test/copy-lock-measure.mjs` (NO --write): "scanned 52 files, 958 locked pieces,
  200 declared in design.cjs lists, 5 mounted states"; N2 error "Add a setting or a cue before saving. Nothing was
  recorded." ops added 1; corpus sha256 e3b1be1078c65877fcc990ce91223f0f758bf51c9dd3b4acc08653b261cd826c, EXIT=0.
  That is the sealed value, so the corpus the lane would measure today is byte-identical to the sealed one: round 11
  (f97924a..88cded3, `git diff --stat -- rebuild`: 7 files) moved no locked piece. Consistent with the static reading:
  its only product bytes are today/test/problem.test.mjs (SKIP_DIRS has 'test') and lanes/c/today-split-spike/cut.cjs
  (outside the four SCAN_ROOTS); S10.json and the four review/report .md files are outside the roots and SCAN_EXT.
- guard.log was never created (no protected-five, src/history, conform/private or soak read during either run).
- The corpus file in W still hashes e3b1be10 after both runs (nothing rewrote it).

## 3. DECISIONS:819 is what the brief says it is

- `git show 6925ad4:rebuild/DECISIONS.md` (explicit path): 1329741 bytes, no CR, 819 LF-terminated lines. Line 819
  (UTF-8 bytes without the newline, 2455 bytes) sha256
  ab0b8edf2377463c55b1ed6e8f61ff0c8be32ae86bd1cde838f947b642c3a611; line 818 by the same method 7ce22ddd... (1448
  bytes). Exactly one line of the file hashes ab0b8edf. `git diff --stat 9d4816d 6925ad4 -- rebuild/DECISIONS.md`:
  1 file, +1.
- :819 contains verbatim: "S10 copy lock round 2: Fable l2 ACCEPT WITH NAMED DEBTS (new D-COPYLOCK-XFORM,
  D-COPYLOCK-ATTRS, D-COPYLOCK-EXT; carried D-COPYLOCK-LINUX, D-COPYLOCK-TODAY-MOUNT, D-COPYLOCK-REDFIRST-SCOPE),
  corpus e3b1be10 (958 pieces), no athlete-visible string changed: this line is the copy-lock acceptance for the S10
  brief's T3c row." All three quotes the brief's section 8 attributes to :819 are on the line.
- INFORMATIONAL (no fix owed by T3c): at review time `origin/rebuild/t2-client-core` in W resolves to ae2db86, one
  commit past 6925ad4 (its subject: "DECISIONS:820 owner answers on the new look's words; PM look rulings");
  6925ad4 is its ancestor and 6925ad4..ae2db86 changes only rebuild/DECISIONS.md, +1. At ae2db86 line 819 still
  hashes ab0b8edf (unique; 821 lines). The brief's "tip 6925ad4" (header, 12.1 fix 1, Appendix B) was true at the
  fill and every :819 citation stands; the PM may prefer "tip at the time of the fill" wording, or a rev 4 that
  names ae2db86, but nothing cited moves.

## 4. Brief rev 3 versus rev 2: only the T3c fill, and every filled claim re-checked

- rev 2 (%TEMP%\earned-s10-brief\...\S10-TODAY-SPLIT-BRIEF.md) sha256 e750fe52..., 71817 bytes; rev 3 (W) sha256
  55aed1b186b319087124d5faaa6e136f7eaa656750311285e195aa17290104a7, 81766 bytes, 1223 lines, LF only, pure ASCII
  (no CR, no byte above 0x7f, so no U+2013/U+2014), ends in LF. `git diff --no-index --stat`: 165 insertions,
  27 deletions, matching the integrator's report. `git diff --no-index -U0` hunks, all read: status line (rev 3),
  status block (rev 2 sha/bytes recorded, rev 3 scope), header chain note (tip 6925ad4, +1 = :819), section 2
  copy-lock bullet, the 2.1 copy-lock row, the section 8 citation block (placeholder paragraph replaced by the
  filled block; the contract text below it untouched), 11.1 (i) ("PENDING mark"), 11.2 A4 (lock accepted at :819,
  source closure stays a STOP), 12.1 fix 1 (tip note), section 13 open-marks paragraph, Appendix B Revision 3
  entry. No other hunk exists; nothing outside the T3c scope changed.
- PENDING-T3c in rev 2: lines 150, 182, 621, 796, 828, 954, 1051, 1084 (3 placeholders + 5 references). In rev 3
  the mark survives only at lines 1175 and 1208, both inside Appendix B's revision 1/2 history prose (what those
  revisions left open), which is correct history, not a placeholder. Section 13 says "no PENDING mark".
- OWED-T26: 4 occurrences in rev 2 (lines 185, 961, 1045, 1085) and 5 in rev 3 (193, 1085, 1169, 1209, 1223, the
  last being the new Appendix B line "Left open: the OWED-T26 mark (seal time)"); every rev 2 OWED-T26 text is
  unchanged. (The integrator's report says "all 5 OWED-T26 marks unchanged"; rev 2 holds 4, the fifth is rev 3's
  own Appendix B line. A report miscount, not a brief defect.)
- Section 8 facts re-derived from the corpus in W: schema earned/copy-lock/v1; scanRoots 4, tools 13, scanned 52,
  states 5 (GYM-ACTIVE-SET, GYM-SETTINGS-EDITOR-OPEN, GYM-SETTINGS-REFUSED-EMPTY, GYM-SETTINGS-N2,
  GYM-SETTINGS-SAVED), entries 958, 200 declared in lists; per-file owner counts today-app.cjs 148, gym-app.mjs 43,
  design.cjs 240, screens.template.html 93, setup-model.mjs 125, checkin-model.mjs 36, exercise-catalogue.mjs 246,
  slice/pwa/shell.cjs 34, pwa.cjs 27: all nine as the brief states. GYM-SETTINGS-N2 error text equals the sentence
  the brief quotes. The 13 TOOLS paths are the exact list in copy-lock-measure.mjs.
- Reviews: l1 verdict "REJECT (one narrow fix round; everything else holds)" names F1..F4; l2 verdict "ACCEPT WITH
  NAMED DEBTS (all four l1 findings fixed and measured; three limits to name, none open today)" names all six
  D-COPYLOCK debts and carries the "Your food plan." / "passed design-binding" sentence the brief quotes; l2 states
  Node 24.19 as the measured runtime.
- CI step: `findstr /i copy-lock .github\workflows\rebuild.yml` in W: no hit. The brief says "not yet in
  rebuild.yml ... checked at the seal, not claimed here": true, and correctly not claimed. COPY-LOCK.md names no
  "fallback" class; the brief's sentence on sealed fallback reasons records that without inferring an owner: fine.

## 5. Findings

- F-INFO-1 (informational, no fix owed): chain tip moved to ae2db86 (:820) after the fill; :819 bytes and hash
  unchanged there; brief's "tip 6925ad4" statements are true of the read they describe (section 3 above).
- No defect found. No copied byte differs from its source; the lock is green in W under the guard; the sealed
  corpus is reproduced exactly by an independent no-write re-measure; every number, sha, blob id, quote and
  debt name the brief's T3c fill cites was re-derived here; no PENDING-T3c placeholder remains; rev 2 text
  outside the fill is unchanged; the OWED-T26 marks stand.

## 6. Scratch and bytes
%TEMP%\t3c-rev: s1.ps1 (hash compare), t.cmd (slot run), rev-green.tap, rev-measure.txt, l819.cjs/l819.cmd
(line hash), chk.cjs/chk.cmd (corpus and blob checks), brief.diff (rev 2 vs rev 3, -U0). This file is untracked in
W; the PM publishes.
