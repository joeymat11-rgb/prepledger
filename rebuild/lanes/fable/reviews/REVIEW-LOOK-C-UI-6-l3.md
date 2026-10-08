# REVIEW-LOOK-C-UI-6-l3: independent Fable review of C-UI-6 round 3 (the board's words, DECISIONS:820)

Reviewer: Fable 5.1 (l3; wrote no round). Date 2026-09-25. Worktree C:\Users\joeym\AppData\Local\Temp\earned-look-cui6 at fb51cbb (rebuild/c-look-cui6), diff taken against fb51cbb (the round-2 commit). Rules opus55-RULES.txt sha 51706c33 and brief S12-LOOK-BRIEF-DRAFT.md rev2 sha 952f6e12 read whole and matched; DECISIONS lines 817, 820 and 821 read from origin/rebuild/t2-client-core after a fetch (821 lines). Nothing committed or pushed.

## VERDICT: READY TO PUSH

## 1. What changed (measured)
`git diff --name-only fb51cbb` = exactly two files; `git diff --stat fb51cbb -- rebuild/m1/approved-2026-09-18` is empty (no pack byte moved).
- rebuild/m3/w7-preview/today/screens.template.html: 5 +- inside the C-UI-6 COACH comment (lines 338-340), no markup byte. sha256 ff3d9adaa4f92cebcf9b239f7b191ddd81679987cba87910491b27b4483430ef (fb51cbb bytes 4367c11f...7cca).
- rebuild/m3/w7-preview/today/test/coach.test.mjs: +82 -1, the new cell C6-12 and one header line. sha256 94258418d5daeb9eef487cd183c1967de962149563d473eaa1604e1c90e9fd56.
- coach-app.mjs unchanged (sha 8c71b2cc...9915), design.cjs unchanged (a0e6d55d...1846). No engine, conform, m4, spec, tooling, workflow or sealed file moved. LF only; 0 added lines carry U+2013/U+2014.

## 2. Every string on the live Coach route is verbatim pack text (pack = rebuild/m1/approved-2026-09-18)
No string changed this round, so no new approved-copy entry and no :820 citation is required in design.cjs; the words already on the route were checked against the pack anyway, template line (T) vs pack line (P):
- "Earned" wordmark: T:349 = P app/app.html:207 (hidden on Coach by P app/app.css:797, `.screen-coach .wordmark { display: none; }`).
- "Idle" pill text: T:352 = P app/app.html:210 (hidden at rest; P app/app.js:239, states-coach.js:14).
- "example" pill with title "Example numbers, not your data": T:353 = P app/app.html:211.
- "Coach.": T:359 = P app/app.html:217. "Talk through today's plan." (curly apostrophe): T:360 = P app/app.html:219.
- The three prompts "What am I hitting today?", "What's my seat on the chest press?", "Why is today lighter than last week?": T:363-365 = P app/app.html:223-225.
- "From the engine's stored plan. Example numbers.": T:367 = P app/app.html:227.
- "Type to Earned" / "Send": T:370 = P app/app.html:230 (prototype only, not on the board; unchanged).
- "Use text mode" / "I'll tap instead": T:372 = P app/app.html:232. "Tap to speak": T:375-376 = P app/app.html:235-236.
- Answer words in coach-app.mjs COACH_COPY (unchanged): "There is no live coach in this build." + "Nothing changed." = P quality/baseline/states/C-61-ink.json text (owner word :820 (3)); "Tap to stop" = P app/app.js:241; "Use voice" = P app/app.js:203/:232, states-coach.js:147/:153; "Voice is off for this session. Tap the prompts or type." = P states-coach.js:152; "Go ahead." = P states-coach.js:133.
- At rest the live route's visible text equals P quality/baseline/states/C-03-ink.json text word for word ("example Coach. Talk through today's plan. What am I hitting today? ... Use text mode I'll tap instead Tap to speak"); C6-12 asserts this against the baseline file, not a typed copy.
- The stub C-02 text ("Ask your coach." / "The coach is not wired yet. ...") is P quality/baseline/states/C-02-ink.json; C6-12 takes it from the drawn `?state=C-02` page and asserts it never reaches the live route at rest, after each ask, settled, in text mode or tap mode.

## 3. Board lines the pack keeps off its screen (the builder's PM question): agreed, left alone
The four are extra lines, not different words for the same thing, so :820 (2) does not reach them; each is a departure the pack's own comparison page records: Idle pill = P app/compare.html:107 ("the Coach state pill appears only while listening or answering, never Idle"); wordmark = compare.html:107 ("the wordmark stays on Today and inner screens carry the back arrow and their own title"); coach-sub "Nutrition, training, recovery." (P app.html:218 hidden) and coach-sub2 "The plan, your settings and the reasons." (P app.html:220 hidden) = compare.html:108 ("Coach header, two lines (your ruling, 2026-09-17) ... The scope line and the what you can ask line are gone"). Showing them would reverse Joe's 09-17 ruling and would need the pack edits the builder listed (app.html:218/:220, app.css:797, app.js:239, states-coach.js:14, re-accepted coach baselines); none is proposed. The old template comment said the boards "dropped" the sub lines, which was wrong (the boards draw them); the round-3 comment says so and cites compare.html. C6-12 pins all four: words present in the pack, kept off the pack's own screen, absent from the live screen, ruling present on compare.html.

## 4. Identities, red-first, protected load
- The two C-UI-6 gate identities .coach-title (serif, T:359) and .coach-line (sans, T:360) are real rendered elements of the pack's chassis, bound in coach-app.mjs:315; no fake, alias, dummy or renamed binding. (#greeting and #status-line are C-UI-2's and are not in this diff.)
- RED (my own run, %TEMP%\cui6l3-red.log, pm-run shared slot 1, guard cui6l2-guard.cjs sha a172e18b preloaded, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York): fb51cbb template bytes (4367c11f) swapped in by %TEMP%\cui6l3-swap.cjs, coach.test.mjs 11/12, `not ok 12 - C6-12`, error "the template note does not say the boards dropped the sub lines (they draw them)"; template restored to ff3d9ada... and `git status` shows the same two M files after.
- GREEN (%TEMP%\cui6l3-green.log, pm-run shared): coach 12/12, design 15/15, scene 7/7, package 13/14. The one package red, "the approved design is pinned by sha256 ..." (package.test.cjs:53, approved.length 4 !== 2), is the CUI1 promotion moving design.cjs APPROVED to four entries; nothing in this round touches design.cjs, so it is the known look-lane red for S12 composition (a sealed package.test cell to declare red-first there, beside H18/H18b).
- Guard: coach run loaded 13 rebuild/engine modules, none of the protected five (constants, dates, earn, energy, entered-load, performed, plan, ...); design, scene and package runs loaded 0. Not executed and must stay unexecuted: copy.test.mjs (imports rebuild/engine/index.cjs), view.test.mjs, and any test that loads seed, migrate, merge or oracle-shim.

## 5. Findings (none blocking)
- F1 (note, no change asked): C6-12 pins the wording of an HTML comment (`/the boards dropped/`, `app\/compare\.html records the owner ruling of 2026-09-17`). It is the honest red for a comment-only fix, but it is brittle prose-pinning; if the PM prefers, the comment assertions could be dropped at composition without weakening any product check (the four board-only lines stay pinned by the DOM and compare.html assertions).
- F2 (note): screens.template.html:340 is a 143-character comment line; cosmetic only, and left as is to avoid another run.
- F3 (for C-UI-2 / composition, not this ticket): Today's coach entry still says "Ask your coach" / "Your plan, progress and the reasons behind it." / "Not wired yet" (screens.template.html:59, today-app.cjs:89 NOT_WIRED, used at :652/:710) and index.shell.html:28 still says the coach is an entry point only. Under :820 (2) the board's words win on Today too; these are C-UI-2's stack (brief s2 "stack Start/Recovery/Talk") and the composition's, not C-UI-6's route.
- Proposed pack edits: none (no string changed). Sealed cells expected to move: none in this diff.
