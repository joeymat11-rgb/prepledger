# TODAY17-HARDEN - addendum by a second builder (verification + exclusive confirmation; the fix is unchanged)

Author: Claude Opus 5.5 subagent, BUILDER role, commissioned by the PM at ~14:25 on the premise that builder 1's session
had ended before its report. That premise did not hold: another agent kept working in this scratch (draft-G.md/draft-H.md
14:52, fix.diff/final-*.txt re-extracted 15:23:36) and wrote the full report TODAY17-HARDEN-REPORT.md (307 lines,
sha256 fe1f6f7b470bf74cbddee75618a59eab588e1aca384a8093fc021a546645da5f). This addendum does NOT replace it.
INCIDENT (disclosed): at 15:33:13 builder 2 appended its own sections to that file by mistake (believing it was its own
draft); at 15:34:31 it restored the other builder's exact bytes (v2\restore.cjs verified the appended suffix byte-for-byte
before cutting it; the combined file is kept as v2\combined-1533.md.txt). The report was altered for 78 s, before the
Fable reviewer's first process (t17h-fable, 15:35:58). Builder 2 never edited the fix, the worktree, or any tracked file.

## 1. Verdict of this independent check: the fix is right; the report's substance holds

- Diff is test-only and additive; no assertion byte changed; journey.test.mjs unchanged; red-first and green evidence
  exist in logs\ for every cell; every product-breaking mutant stays red on the cell's own oracle.
- Builder 2 adds EXCLUSIVE confirmation (the report's 128-run sweep was all shared-slot): 3/3 green (section 4).
- Four small corrections to the report, none changing the verdict (section 5).

## 2. Diff verification (static, explicit paths; v2\verify2.cmd, v2\bytes.cjs, v2\added.cjs)

- Worktree `git diff -- <six paths>` re-extracted byte-exact -> v2\fix2.diff sha256 2570537cb8ff0b34739da5bc8f64c12f95c44c45a0caedfc38acf7e268312977
  == scratch\fix.diff. numstat/diffstat/status equal final-*.txt. HEAD edb8381ea6a9f5373c8519ee7e9d7d8a303c2369, branch
  rebuild/c-today17-harden. `git diff --cached` (measure/, today/): empty. `status --untracked-files=all` on
  rebuild/m3/w7-preview/{measure,today}: exactly the five M files. S10.json, rebuild.yml, DECISIONS.md, STATUS.md and the
  product files the waits rest on (measure-screen.mjs, measure-host.mjs, today-app.cjs, today-entry.mjs, gym-app.mjs):
  unmodified.
- 121 `+` / 0 `-` lines; 0 added non-ASCII, 0 CR. Every line of each edb8381 blob survives IN ORDER in the worktree file:
  support 376/376, checkin 806/806, gym 1179/1179, setup 2541/2541, problem 3689/3689, journey 135/135.
- Comment-stripped ADDED code = 52 lines, 0 call an assertion API (assert/expect/deepEqual/strictEqual/notEqual/ok/throws/
  rejects). By hunk: support @-121 :124 screenBefore capture; @-133 :153-157 settle(new #measure-screen holding
  measure-trial-table); @-254 :282-287 MutationObserver on #phone; @-307 :349-351 settle(every recorded section ended) +
  disconnect; @-346 :396-398 MEASURE_PAINT_ENDS/measurePaintEnded. checkin @-404 :416-421 reached(); @-544 :562 reached(#gym-weight).
  gym @-469 :480-485 reached(); @-505 :523-525 reached(saved screen). setup @-1444 :1454-1459 reached(); @-1470 :1487
  reached(screen==='today'). problem @-966 :978-983 reached(); @-987 :1006; @-3239 :3259,:3262; @-3268 :3290,:3293
  (beforeReady capture + reached(ready !== beforeReady)). 15 hunks; the rest is comments.
- Hunt bytes == these bytes: `git diff --stat e9ff2ca edb8381 --` the six test files + the five product files above:
  empty, and e9ff2ca is an ancestor of edb8381. So hunt2's natural R2 logs are witnesses on these bytes.
- Product facts behind R1/R2 (read at edb8381): measure-screen.mjs:84-91 saveWaist awaits lane.save() then repaint();
  today-app.cjs:471-475 renderMeasure creates a new section#measure-screen and show()s it (:623-624) before its first await;
  paint() (measure-screen.mjs:128-193) mounts measure-comparison (measure-view.mjs:176; table slot = slot+"-table", :148)
  last; its other returns write measure-state (:133), measure-marker-pick (view :292), measure-no-trial (:168). The only
  return with no end state is `!alive()` (:139/:142/:178/:186), i.e. navigated away; the report discloses that limit.

## 3. Numbers checked against logs\*.summary, runner.log and today17-hunt3\HUNT-REPORT.md

Confirmed exact: red-first R3 2/2 a5p :548; R4 2/2 a2 :510; R5 2/2 a2 :1473; R6 1/1 a2 (:990/:3245/:3274); R1 natural
a2p set18 run 2 :69 ('Not enough data yet' x2 vs '34.4 in','-0.6 in'); d5 alone 0/5; MS-SLOW2ND unchanged 2/2, fixed 0/2;
MS-SLOWSAVE 0/2, MS-LAG 0/1, MS-FROZEN 1/1 both sides; all break-mutant rows (lines 528/564/1490/3264/3295, deadline lines,
12.8/17.1/13.3/35.0 s); MS-NOREPAINT "waited 5010 ms over 334 macrotask turns" support.mjs:243; the full 8x6 green table
(agg.ps1 re-run) = 128 runs 0 red, setup 155/156 and set18 621/623 from the two pin guards only; 0 deadline /
LOCAL_CLIENT_CLOSED / "asynchronous activity" / S10-T4-GUARD lines in g-* logs; %TEMP%\s10-t4-guard.log 0 t17h lines;
set count 644 - 14 (package.test.cjs, smoke run) - 7 = 623; S10.json pin lines :774/:775 :789/:790 :854/:855 :924/:925
:945 :950 and the today-17 argv :1674-1699; hunt figures (4 of 18 at :21/:176; card 144.7-145.3 ms vs settle 103.1-103.3
ms at :155; hunt2 table :55-68 incl. journey a10p 1/3, d5 2/3, 6 of 7 set19 red). Pin-guard messages name only this
ticket's files (g-d5-set18 log: boundary lists gym/checkin/setup/problem; re-pin lists gym 17901c4d95e9 vs 8ecfb69a47a6,
checkin 934cb87cccbf vs 3e7be3363105).

## 4. Exclusive confirmation runs (builder 2; runner-x.ps1 -> `pm-run.cjs exclusive`, same job.cmd/batch.cjs)

Started after `RUNNER DONE ...jobs-green-journey.txt 15:23:22`; each pm-run line read `holds earned-runtime.lock`;
otherSlotsAtStart [] in all three; final bytes (BATCH sha16 d62dd75e/2520a774/934cb87c/17901c4d/2ff0ef12/a8b5cc4f).

| job (logs\) | shape | result |
|---|---|---|
| x-a2p-set18 | a2p set18 (the shape R1 went red in naturally, 1/2 on unchanged bytes) | 0/1 red, GREEN+PINDRIFT2, 621/623, 167.4 s |
| x-v0-set18 | v0 set18 | 0/1 red, GREEN+PINDRIFT2, 621/623, 145.1 s |
| x-d5-journey | d5 journey alone (the R1/R2 alone shape) | 0/1 red, 3/3, 199.3 s |

0 deadline / LOCAL_CLIENT_CLOSED / S10-T4-GUARD lines in x-* logs. A 3-run sample, not a repeat of the 128-run sweep.

## 5. Corrections to TODAY17-HARDEN-REPORT.md (for the reviewer; not edited into it)

1. Section 2 says the seven build-dependent tests are skipped by name "in every run": not for the jobs-red list
   (smoke, red-R3/R5/R4/R6/R1R2, 12:01-12:21; batch.cjs gained SKIP at 12:29). Those runs show them failing on the
   environment (S17 ENOENT; R3 x2 / N2-16 / S6C.7b "Build failed with 6 errors"), as sections 3 R5/R6 themselves say.
2. Section 10: "Mutants on the fixed bytes: 11 runs" - the listed parts sum to 12 (2+2+2+2+2+1+1).
3. Section 3 R2: "file-level ERR_TEST_FAILURE both runs" - only run 1 (o-msslow2nd-v0-journey-1.log: `not ok 1 -
   ...journey.test.mjs` tests 3). Run 2 counts (a) :69 as the one failure (tests 2, fail 1); (e)'s LOCAL_CLIENT_CLOSED
   appears there only as a `# Error: ... unhandledRejection` diagnostic line.
4. Section 7 item 4: 10 000 ms / 145 ms is about 69x, not 60x. Section 1: the gym wait sits before :508 and guards the
   oracles :509-515 (not ":508-513").
Also worth noting: m-gym-saved-never and m-checkin-active-never ran while support.mjs was mid-edit (BATCH sha16 f72c6176 /
a5ba3f19); neither gym.test.mjs nor checkin.test.mjs imports measure/test/support.mjs (they import w6/test/support.mjs),
so those two runs are unaffected.

## 6. One residual risk the report does not state (read-only; not constructed)

R1's condition accepts ANY #measure-screen put up after the click. measure-screen.mjs also calls repaint() when the lane
opens (:71/:75) and on the export toggle (:191); a section from such a trigger landing between the click and the save's
own repaint, painting with a pre-write read, would satisfy the wait. Mid-journey no such trigger fires today (the lane is
open long before any waist row; nothing clicks export during typing), and the unchanged :69 oracle would still catch a
stale week 12 (it fails, it does not pass wrongly).

## 7. Files and state at the end of builder 2's work

Worktree sha256 (Get-FileHash): support.mjs d62dd75e8e158d87cbff0a48c1cf384edbbc548e2f645dafc5427e1b8d3ab482; checkin
934cb87cccbff550df41e29d308663f0db2c9942707e004d29c40f7eaea29755; gym 17901c4d95e996cee48da619872a78292fd8671592e355e24bc4dc7ddf2633ed;
setup 2ff0ef129b47abc2760d2b6c49cfb3916e061f3c2e38b2c9fa14fdb51d43a924; problem a8b5cc4f193dfdd1402d110233e79e614439ee9d5ab5406c52c627e0ca338ccd;
journey (unchanged) 2520a774e8de269af2a032b2ac7c444753a4d87698e0ac68286ac26c2290306a. `git status --porcelain` (explicit
paths): the five ` M` lines only; `git diff --stat`: 5 files changed, 121 insertions(+). Nothing staged or committed.
Builder 2's scratch files: verify2-8.cmd, runner-x.ps1, jobs-x.txt, v2\ (fix2.diff, bytes.cjs, added.cjs, restore.cjs,
combined-1533.md.txt, extracted edb8381 texts), logs\x-*, counts\x-*, and three unused section drafts moved to v2\.
Not run by builder 2: anything beyond the three exclusive runs; package.test.cjs / build-dependent tests (no junction);
b-package, today-17 child, CI. Protected five, src/, ledger, conform/private, *soak*, prepledger-dev: never touched.
