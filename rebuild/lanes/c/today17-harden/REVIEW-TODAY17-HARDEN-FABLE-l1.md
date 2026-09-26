# REVIEW-TODAY17-HARDEN-FABLE-l1 - independent review of the test-only ticket TODAY17-HARDEN (DECISIONS:844 (5))

Reviewer: Claude Fable, commissioned by the Claude Opus 5.5 PM (DECISIONS:848). Date 2026-09-26, node v24.19.0, win32.
Object: worktree %TEMP%\earned-t17h, branch rebuild/c-today17-harden, HEAD edb8381ea6a9f5373c8519ee7e9d7d8a303c2369,
uncommitted: measure/test/support.mjs d62dd75e8e158d87cbff0a48c1cf384edbbc548e2f645dafc5427e1b8d3ab482 (HEAD f72c6176...),
today/test/checkin.test.mjs 934cb87cccbff550df41e29d308663f0db2c9942707e004d29c40f7eaea29755 (HEAD 3e7be336...),
gym.test.mjs 17901c4d95e996cee48da619872a78292fd8671592e355e24bc4dc7ddf2633ed (HEAD 79aa531e...),
setup.test.mjs 2ff0ef129b47abc2760d2b6c49cfb3916e061f3c2e38b2c9fa14fdb51d43a924 (HEAD e43ed642...),
problem.test.mjs a8b5cc4f193dfdd1402d110233e79e614439ee9d5ab5406c52c627e0ca338ccd (HEAD 5fe767e0...).
Fix diff re-extracted by me (cmd redirection, explicit paths): sha256 2570537cb8ff0b34739da5bc8f64c12f95c44c45a0caedfc38acf7e268312977
== t17h-scratch\fix.diff == t17h-fable\my.diff; numstat 51/16/18/15/21 added, 0 removed; `git diff --cached` empty;
status --untracked-files=all on rebuild/m3/w7-preview, packages, workflows: exactly the five ` M` lines. journey.test.mjs
unchanged (2520a774...). Inputs read: hunt3 HUNT-REPORT.md f7aa141f52ef..., builder report fe1f6f7b..., addendum 13c194cc...
(both builder reports read LAST). Evidence: the previous Fable's t17h-fable\runner.log (its orig\ blobs re-hashed by me:
identical to HEAD; its hook and batch read whole) and my own runs in %TEMP%\t17h-fable2\ (runner.log, logs\*.summary,
logs\*.log), every one through `pm-run.cjs exclusive` (today-17 is timing-sensitive per the rules; the builders and the
previous Fable used shared), MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, S10-T4 guard loaded, 0 guard lines.
Package resolution: the earned-s10gss junctions via t17h-fable\hook.mjs (no junction created). "orig" = the HEAD bytes of
the five files served at their worktree URLs by that hook (hooked=N on the RUN line); "fixed" = the worktree as it stands.

VERDICT: ACCEPT WITH NAMED DEBTS (D-T17H-1..D-T17H-3)
REQUIRED CHANGE: no

## Q1. Test-only, no assertion byte changed (measured: t17h-fable2\lines.cjs)
Every HEAD line of each of the five files survives in the worktree file IN ORDER (support 376/376, checkin 806/806, gym
1179/1179, setup 2541/2541, problem 3689/3689). 121 added lines, 0 CR, 0 new non-ASCII bytes (156/204/32/47 pre-existing
in the today files are unchanged counts). Added code after comment stripping = 52 lines; 0 of them call an assertion API.
Added lines that COULD change a verdict, listed in full: (a) support.mjs:153-157 typeWaist's third settle(); :349-350
close()'s settle(); both can only THROW (MEASURE-SETTLE-DEADLINE, 30 s) - they can turn a pass into a loud failure, never a
failure into a pass, because every original wait and oracle still runs after them unchanged. (b) The four reached()
helpers (checkin :416-421, gym :480-485, setup :1454-1459, problem :978-983): poll setTimeout(0) to a 10 s wall-clock
deadline, never assert, print TODAY17-HARDEN-DEADLINE on stderr and RETURN, then repeat the site's original wait (settle()
/ 60 ms / 50 ms). The original sleep at each site is kept and still runs BEFORE the new wait. (c) problem :3259 and :3290
`const beforeReady = ...api.ready` are captures of a getter before the tap; :1006/:3262/:3293, checkin :562, gym :523-525,
setup :1487 are the wait calls. Nothing is deleted, reordered or relabelled. No product byte, package, workflow or
DECISIONS line moved. Test-only holds.

## Q2. Each cell: the wait is the assertion's own condition; red-first (orig) and green-after (fixed), exclusive slot
Product facts the waits rest on, read at edb8381: today-app.cjs:471-475 renderMeasure() creates a NEW section#measure-screen
and show()s it (:623 phone.replaceChildren) BEFORE its first await; measure-screen.mjs:84-91 saveWaist() awaits lane.save()
THEN repaint(); paint() :128-193 ends in exactly one of measure-state (:133), measure-marker-pick (view :292),
measure-no-trial (:168), measure-comparison (view :176, last, after every lane read), or an !alive() return; the trial table
slot is written inside the comparison (view :148 slot+"-table"); today-lanes.cjs:950 settleAdoption reassigns `ready` from
today-app.cjs:1755 done(); today-entry.mjs:142 onDone = host.save -> refresh -> done.
- R1 journey (a) :69. Wait: a #measure-screen that is NOT the one present at the click AND holds measure-trial-table. That is
  the save's own repaint (the only one asked for after the write; it is requested only after lane.save() resolved) and its
  table is painted last, so the condition is the final table, not a stale repaint and not stillness. Not always-true: it
  starts false (the same section is on screen at the click). Red-first: MS-SLOW2ND on ORIG bytes (o-slow2nd) RED `week 12 as
  rendered | journey.test.mjs:69` (+ R2 in the same run); natural a2p set19 on orig bytes went green in my one run (the hunt
  saw it 1/1 at a2p set19; the builder 1/2 at a2p set18); fixed: f-slow2nd GREEN 2/2 cells, f-a2p-set19 GREEN except the
  pins (Q5) and the build-dependent tests (Q6); previous Fable: f-d5-journey 0/3 red, f-a10p-journey 0/2, f-v0 0/1.
- R2 journey (e) :108 LOCAL_CLIENT_CLOSED. Wait in close(): every #measure-screen this page ever put up (MutationObserver on
  #phone, childList) holds a paint end state. After an end state paint() reads no lane, so no read can hit the closed
  client. Red-first: o-slow2nd RED `(e) ERR_TEST_FAILURE LOCAL_CLIENT_CLOSED` (orig bytes); previous Fable o-d5-journey
  1/3 red, the same error. Fixed: f-slow2nd GREEN, f-d5-journey 0/3, f-a10p-journey 0/2; closedMsgs=0 in every fixed run.
- R3 checkin A3 :548 `#gym-weight`. Wait: exactly `doc.querySelector('#gym-weight')`, the oracle's own read. Red-first
  o-a5p-checkin RED :548 (hooked=1); fixed f-a5p-checkin GREEN 28/28; previous Fable: 0/3 a5p, 0/2 a10p, 0/2 d5, 0/2 b5.
- R4 gym subtest :510. Wait: saved-title matches /logged/ AND saved-facts AND [data-action=undo] present, the three things
  :510-513 read. Red-first o-a2-gym RED `null textContent | gym.test.mjs:510`; fixed f-a2-gym GREEN 65/65; previous Fable
  0/3 a2, 0/2 a10p, 0/1 b5.
- R5 setup A4 :1473. Wait: api.screen() === 'today', which done() reaches only after host.save() and refresh() resolved
  (today-entry.mjs:142), so enrolled() at :1473 is true once it holds. Red-first o-a2-setup RED :1473; fixed f-a2-setup:
  A4 passes (its only reds are S17 ENOENT = build dist, and the re-pin guard, Q5); previous Fable 3/3 and 2/2 the same.
- R6 problem P0C.1 :990 / S6C.3 :3245 / S6C.4 :3274. Wait: api.ready !== beforeReady, i.e. done() has reassigned the
  adoption promise, which is precisely what :990 asserts and what makes `await api.ready` at :3244/:3273 wait for the NEW
  chain. Red-first o-a2-problem RED on all three (+4 build-dependent); fixed f-a2-problem: only the 4 build-dependent
  reds remain; previous Fable 3/3 a2, 2/2 a10p, 1/1 b5 the same.
Deadline lines: 0 TODAY17-HARDEN-DEADLINE / MEASURE-SETTLE-DEADLINE in any non-mutant run (mine and the previous Fable's).

## Q3. Negative controls (fixed bytes; mutants verified line-by-line against the worktree product by verify-mutants.cjs)
GYM-SAVED-NEVER -> gym RED `null textContent gym.test.mjs:528` (= :510) after 1 deadline line. GYM-ACTIVE-NEVER -> checkin
RED `the gym card is on screen :564` (= :548). ENTRY-NODONE -> setup RED `and he lands on Today :1490` (enrolled() and
one-op oracles pass: the write did land, done() did not); problem RED P0C.1 + S6C.3 + S6C.4 with the natural messages, 3
deadline lines. MS-FROZEN -> journey (a) RED `week 11 as rendered :69`. MS-NOREPAINT -> RED loud at the new wait
(MEASURE-SETTLE-DEADLINE ... "the trial table painted by the repaint the waist save for 2026-03-16 asked for"). Reviewer
mutant MS-HANG1 (a superseded paint never finishes) -> RED loud at close()'s new wait, the documented limit, not a silent
pass. Every cell fails on its own assertion (or loudly at the deadline naming the wait), none is masked.

## Q4. The addendum's residual risk (R1 wait accepting any post-click measure screen): REAL in mechanism, not reachable today
Reviewer mutant MS-PREREPAINT2 (saveWaist calls repaint() BEFORE lane.save() and the write lands 400 ms later, so a foreign
repaint with a pre-write read exists): FIXED bytes -> RED at the ORIGINAL oracle "week 11 as rendered | journey.test.mjs:69"
('Not enough data yet' x2), deadlines=0: the wait accepted the pre-write section and returned. ORIG bytes -> the same red.
So the condition "a new section holding a table" cannot tell the save's repaint from a foreign one; the unchanged :69
oracle catches it (it cannot pass wrongly), so the risk is a FLAKE-shape risk, never a false green. In the product at edb8381 the only
repaint triggers are lane-open (:71/:75, long before any waist row), export toggle (:191, never during typing) and
saveWaist itself; nothing fires mid-typeWaist. Named as D-T17H-1.

## Q5. Pin guards red on this ticket's own files: expected, the reseal's gate
boundary.test.mjs:213 lists exactly gym/checkin/setup/problem.test.mjs; setup.test.mjs:2437 lists gym 17901c4d95e9 vs pin
8ecfb69a47a6 and checkin 934cb87cccbf vs 3e7be3363105. Both walk CHILD_SPECS ['H3'..'S10'] youngest-first for a declaring
post; no package on this branch declares the new bytes, so red is the guard doing its job. S10.json lines to move at the
reseal: :789/:790 support, :854/:855 checkin, :924/:925 gym, :945 problem post, :950 setup post (journey :773-775 unmoved).
setup 155/157 and set19 621/644 (= 2 pins + 21 build-dependent) are those and nothing else. Not a problem.

## Q6. What stays owed
D-T17H-1 (Q4 mechanism, test-side): typeWaist's wait cannot tell the save's repaint from another trigger's; safe today.
D-T17H-2: package.test.cjs (14) and the 7 build-dependent tests (food N1.17, m-s-ui S14, problem R3 x2/N2-16/S6C.7b, setup
S17) never ran green here: this worktree has no node_modules junction and esbuild resolves on disk ("Build failed with 6
errors", S17 ENOENT on .tmp dist). They are not hardened cells; CI / b-package is where they run. D-T17H-3: no CI run, no
b-package --ci, no today-17 child run, no hosted proof; the reseal that declares the five new pins is the PM's.
Blockers: none. Not verified by me: hosted CI; runs beyond those cited (I re-ran each cell 1x orig/1x fixed exclusive, the
previous Fable's 3x/2x shared sweep and the builders' 128-run sweep are cited not repeated); the natural R1 in set shape
(green 1/1 on orig bytes in my run; witnessed by hunt2/hunt3/builder logs and by MS-SLOW2ND here).
Rules: nothing committed/staged/pushed; worktree never written; DECISIONS untouched; no protected five, src/, private,
ledger, *soak*, prepledger-dev, .tmp read; every run via pm-run exclusive; scratch t17h-fable2 only (+ this file).
