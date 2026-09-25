# REVIEW-LOOK-C-UI-2-l3 (Fable 5.1, independent reviewer l3, 2026-09-25)

Scope: C-UI-2 round 3, uncommitted in %TEMP%\earned-look-cui2 (HEAD 2506b40, branch rebuild/c-look-cui2), diffed against 2506b40.
Read: opus55-RULES.txt, S12-LOOK-BRIEF-DRAFT.md rev2, DECISIONS:817/:820/:821 at origin/rebuild/t2-client-core 4f16cf2 (fetched; only those three lines printed).
Wrote no product byte. This file is the only new file.

## VERDICT: NOT READY (one fix, F1; everything else checked out)

## What moved (git status --porcelain: 4 M, 0 untracked; diff 189+ 11-)
- screens.template.html e655f019..a56a, today-app.cjs 36a36926..050b, design.cjs 3359e672..941c, test/look-cui2.test.mjs 272bb83b..abca. All LF, CR=0, no U+2013/U+2014 added (the 189 added lines carry none; the pre-existing em dashes in comments are untouched).
- No byte under rebuild/m1/approved-2026-09-18, rebuild/engine, rebuild/conform, rebuild/m4/spec, rebuild/lanes/b/tooling or .github. No sealed file edited (view.test, copy.test, checkin.test, problem.test, browser-check, package.test, approved-pin, pack-pin all clean in the diff).

## Identities (real, bound, not aliased)
- #greeting: tpl:33 `<h1 class="greeting" id="greeting" data-slot="instruction">`, the ONE h1 on t-today (test R3 pins h1 count = 1), bound at today-app.cjs:726 `put(map, "instruction", view.nowModel.move.title)` (the value the pack's T-39 draws; DECISIONS:820 (1) lifts :534(c) for this slot) and :706 in the blocked branch. Face: pack app.css:199 `.greeting { font-family: var(--serif) }` (0,1,0) beats app.css:145 `h1, h2, p` (0,0,1); preview.css:95 `.view .intro h1` sets font-size only; no other stylesheet in composeStyles (design.cjs:43-50 pack css + preview.css) sets a font-family on h1. Gate KNOWN_FACE today = ('#greeting', '#status-line') at gate.py:84, SERIF_SELECTORS today gate.py:90.
- #status-line: tpl:34 `<p class="status-line" id="status-line" data-slot="status-line">`, sans by inheritance (app.css:200 sets no family), bound at today-app.cjs:710 (blocked) and :793 (normal) through plainOrDrop.
- .wordmark tpl:26 and #start span:not(.arrow) tpl:86 (earlier rounds) still present. The sealed `recovery-state` slot is untouched; the new prompt is a separate span `recovery-prompt` (tpl:89).

## Strings: every new visible string is verbatim pack text (file:line under rebuild/m1/approved-2026-09-18)
- "Recovery check in": app/app.html:101 (#recovery .title); states-today.js:242. "Optional. How are you feeling?": app.html:101; states-today.js:121 (T-26).
- "Talk through today's plan" (U+2019): app.html:107 (#talk-today .label); states-today.js:127 (T-31).
- pill "example" with title "Example numbers, not your data": app.html:30 (.pill in the Today header).
- "Your weight in pounds" app.html:43 (#weigh-form label); placeholder "Your weight" app.html:44; "Save" app.html:46 (#save-weight).
- Status line per state (states-today.js): " today. Nothing to decide." :129-133,:145,:148 (T-32/33/36/37/38, T-40c/d); " today. Sample data." :50 (T-02); " today. Your calorie range is not available yet." :107 (T-19); " is under way." :92 (T-14); " logged. Nothing to decide." :95 (T-15); "Today's workout cannot open." :98 (T-16); "An earlier workout is still open." :101 (T-17); "Nothing scheduled today, so there is nothing to start." :86 (T-12); "Today's exercises are not available, so there is nothing to start." :89 (T-13); "Nothing to decide. Next: lower body, tomorrow." :83 (T-11); "This device's record did not verify. Nothing on this screen is a value." :65 (T-06). Test R3 row 3 asserts each composed line is a quoted literal in states-today.js.
- design.cjs: the 7 board words at :119-125 (APPROVED_COPY) and the 11 status fragments + "Save" at :166-175 (RUNTIME_COPY), each block headed by a comment citing DECISIONS:820 and the board/state ids. Test R3 row 2 asserts the :820 citation precedes each declaration.

## Red-first (measured by me, not taken from the builder)
- Replica: the round-3 test file against the 2506b40 bytes of screens.template.html/today-app.cjs/design.cjs/preview.css (git show, byte-exact) in %TEMP%\cui2-l3\red: look-cui2 5 tests, 2 pass, 3 fail, each R3 cell red for its intended reason (%TEMP%\cui2-l3\l3-red.tap; guard: 0 engine modules loaded).
- Green at the worktree: %TEMP%\cui2-l3\l3-suites.tap (pm-run shared, guard preloaded, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York): design.test + scene.test + package.test + look-cui2.test + approved-pin.test + pack-pin.test = 162 tests, 146 pass, 16 fail. 15 fails are "Cannot find package 'esbuild'" (package.test 14 + scene #162), the same set as rounds 2/3. The 16th is approved-pin.test.mjs:929 "REAL ROW" (APPROVED-PIN UNLISTED app.css/states*.css, ORPHAN the 09-08 files): that is the CUI1 promotion's APPROVED list (design.cjs:43-50, NOT touched by round 3, red at 2506b40 too), named in brief s3 as a sealed cell S12 re-pins. look-cui2 5/5, design 15/15, pack-pin green. 0 engine modules loaded on both runs.
- Not run (import the engine index or need the exclusive slot): copy.test.mjs, view.test.mjs, checkin.test.mjs, problem.test.mjs, browser-check.mjs, gate.py/statesheet.

## Findings
- F1 (BLOCKS): today-app.cjs:366-369, the rest-day branch. For a next-session stamp other than TOMORROW (engine titles are "· TODAY", "· TOMORROW", "· MON 9/21", today-app.cjs:295 and problem.test:3339) the line becomes "Nothing to decide. Next: lower body, MON 9/21." That sentence is on neither the boards nor the prototype (states-today.js:83 draws only ", tomorrow.") nor product copy, so it is a new visible string; it also prints the stamp uppercase mid-sentence. Reachable whenever two rest days run back to back. Fix: draw the T-11 line only when the stamp is TOMORROW and return "" otherwise (the prototype draws no line for that day), plus one red-first row in the R3 status table (["rest day, later stamp", title "LOWER BODY · MON 9/21", today:false] -> ""). No copy or pack change needed.
- F2 (minor, PM reading): the decisionsN guard at :374 sits after the phase branches, so T-15 ("Upper body logged. Nothing to decide.") and T-11 ("Nothing to decide. Next: ...") can print "Nothing to decide." while nowModel.decisionsN > 0, the case the builder's own note at :371-373 calls false before C-UI-3 lands the card. Either move the guard above the phase branches or accept the prototype's words as they stand; a ruling, not a blocker.
- F3 (reading): the prototype draws the "example" pill on EVERY Today state (app.html:30 is base markup; states.js and states-today.js never hide it). The app shows it only over the sample athlete (T-02, T-04). Defensible from its own title, but it is a departure from the board and should be recorded on the comparison page (STD 7 (6)).
- F4 (reading): a pending-adoption Today (today-model.cjs:436 sets exerciseCount null) says T-12's "Nothing scheduled today, so there is nothing to start." rather than T-03's "Your record is opening. Nothing here is measured yet." (states-today.js:53). It agrees with the app's own workout line for that state; the view does not expose pendingAdoption. PM's call whether T-03's line is wanted (it would be a further :820 (2) string).
- F5 (reading): the blocked greeting keeps the ASCII apostrophe "today's" (today-app.cjs:706) where T-06 writes "today's" with U+2019 (states-today.js:65). Pre-existing product copy, not moved here; :820 (2) may reach it later.
- Sealed cells expected to move at composition, confirmed by read: view.test.mjs:517 ("Ask your coach" on Today's face) and :526 ("How are you feeling today?"); view.test:100 pins "Your plan for today" (kept). "Weight (lb)" tpl:435 and "How are you feeling today?" tpl:461 are on the gym template (C-UI-4), untouched and correctly out of scope. checkin.test:649 reads the gym block, unaffected.
- Proposed pack edits P1(a)(b)(c) and P6 remain proposals only (no byte in the pack; git diff of PACK vs 2506b40 empty). Their text matches what is built.

## Files
- This review: rebuild/lanes/fable/reviews/REVIEW-LOOK-C-UI-2-l3.md (uncommitted). Scratch: %TEMP%\cui2-l3\ (diff, replica, taps, grep scripts).
