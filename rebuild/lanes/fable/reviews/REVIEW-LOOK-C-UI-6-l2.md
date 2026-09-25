# REVIEW-LOOK-C-UI-6-l2 (Fable 5.1, independent reviewer, 2026-09-25)

Object: the uncommitted diff in worktree earned-look-cui6 (branch rebuild/c-look-cui6, HEAD df91ad1) against
df91ad1, after builder round 2 (fixes for review l1 F3 and F5). Method: byte comparison of every file against
the l1 hashes, a static read of the two changed files, a static walk of the module graph C6-11 loads, the unit
suites re-run through pm-run shared with a loader guard that refuses the protected five, and the C6-11 red-first
re-run with my own harness. No gate.py, statesheet.py or browser harness run; rendered geometry stays for CI.

## VERDICT: READY TO PUSH. F3 and F5 are fixed exactly as asked, nothing regressed, no identity is faked or
aliased, no visible word was added, no forbidden byte moved. The PM items (F2, F4, F11, F12, R1-R3) stand as
declared for S12 composition; none is a builder defect.

## Measured
- Diff vs df91ad1 (git diff --stat df91ad1 -- rebuild .github): design.cjs 80+-, preview.css 21+, scene.mjs 6+-,
  screens.template.html 52+-, today-app.cjs 30+-; untracked: coach-app.mjs, test/coach.test.mjs, this file and l1.
  git diff --stat df91ad1 -- rebuild/m1 rebuild/engine rebuild/conform rebuild/m4 rebuild/lanes/b .github
  rebuild/DECISIONS.md: EMPTY. No pack byte, engine, conform, m4/spec, tooling, workflow or sealed file moved.
- sha256 (verified byte-exact; all LF, CRLF count 0; 175 added lines vs df91ad1, 0 with U+2013/U+2014):
  coach-app.mjs 8c71b2ccf08a55895f80a537612285818fddc9a184f6229f51d8c60fbadb9915 (41506 bytes)
  test/coach.test.mjs c01322be54fdabbd85d3654d23aee220cde59faeb3baef510023374368d54928 (22471 bytes)
  today-app.cjs adadcda8540345406aaa72fb46c2c7546344dea07c7179f8dd4ef83ab3298d7c
  screens.template.html 4367c11f855771f6ba115920726ee88f8f5b38837d0b3d400381fb6b13397cca
  design.cjs a0e6d55d41e17d455106bc6cb45086a611959598d5c07606ab4ff0c241b91846
  scene.mjs ba46c9a83c42aff222f277f6b68abe7f629bfd6553daf5c1dc38348080e62b24
  preview.css 7f36d193038df90617d8691e7a551421461a36cb89dea68b6d424aaf3ddadd0f
  The last five equal the l1 hashes byte for byte, so every l1 hunk read stands unchanged.
- Round-2 delta is purely additive, proven by hash: coach.test.mjs lines 1-311 hash to the l1 blob
  1c9820b42e45bdabb8d1942120de3daae6be70012cdbffb5e32d85a82f717b7b; lines 312-375 are the new C6-11 cell.
  coach-app.mjs equals the l1 blob bbd9257f488c2374c3d9363858906e17d25385ea68ab91b29dba3459308d0249 plus the
  16-line departures comment at :664-678 (git diff --no-index against the builder's byte-exact backup: one hunk).
  The comment sits outside the COACH-COPY region (:28-212), so the C6-9 harvest is untouched; it holds none of
  the C6-5 words (getUserMedia, fetch(, XMLHttpRequest, WebSocket, sendBeacon, indexedDB, localStorage) nor the
  C6-7 words (setInterval, requestAnimationFrame, .animate(); no dash; no visible string (a comment is not shown).
- Tests (pm-run shared, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, log %TEMP%\cui6l2-tests.log, TAP):
  coach 11/11, design 15/15, scene 7/7, package 13/14. The one red is package #2 "APPROVED.length" 4 vs 2, the
  same CUI1 red l1 recorded; C-UI-6 moves no failing cell. Not run: copy.test.mjs and view.test.mjs (both load
  rebuild/engine/index.cjs); they are listed for the PM below.
- Protected five: every run carried NODE_OPTIONS=--require=%TEMP%\cui6l2-guard.cjs, a Module._load hook that
  THROWS on seed/migrate/merge/index/oracle-shim.cjs and prints the engine modules loaded at exit. coach.test
  loaded 13 engine modules (constants, dates, earn, energy, entered-load, performed, plan, policy, progression,
  sleep, today, volume, writers), none protected; design, scene, package loaded 0. Static walk agrees: the only
  path from today-app.cjs to migrate/merge is the LAZY `await import("../import/import-screen.mjs")` at
  today-app.cjs:526 (import route only, as package.test #7 already holds); C6-11 renders coach and today only.
- C6-11 red-first RE-RUN by me (harness %TEMP%\cui6l2-mutate.cjs, own backup dir, log %TEMP%\cui6l2-red.log):
  M1 screenFrame returns #phone: not ok, "data-state on the frame" (actual null) at coach.test.mjs:356.
  M2 today-app paint no longer calls closeCoach(): not ok, "the frame keeps no data-state" (actual 'answering')
  at :368. Unmutated: ok. Post-run hashes equal the table above (restore byte-exact, both files).

## Findings, l1 items checked one by one
F3 FIXED exactly. C6-11 (coach.test.mjs:312-375) loads the real scene.mjs (source plus a test-side
   `export { installScene }` shim, no product byte), runs installScene(win, doc), asserts no .screen before it
   and that the frame wraps #phone before Today mounts, mounts TodayApp.mountToday over TodayModel.SYNTHETIC_DAY,
   routes api.render("coach"), clicks a prompt and text mode, and asserts data-state="answering" and
   data-mode="text" on .scene-frame.screen-coach with #phone carrying none of the four attributes; then
   api.render("today") turns the frame back to screen-today with no attribute left. Both teeth proven red (above).
   Residual (info, CUI1's): the shipped page's own order (scene.mjs appended raw at the end of app.js and boot()
   awaiting before mountToday) is exercised by scene.test #7 through the built bundle, not asserted as an order;
   C6-11 asserts the order on the modules, which is what F3 asked for.
F5 RECORDED as asked: departures D1 (#coach-tap toggles the drawn C-07 instead of the prototype's
   data-go="workout" jump) and D2 ("Use text mode" opens the drawn C-06 with the back link instead of the
   prototype's in-place label toggle), at coach-app.mjs:664-678, for the comparison page (bar rule 6). R4 holds:
   both links act; no chevron was added.
F2 NOT DONE, correct under R3: coach-app.mjs and scene.mjs enter build.mjs REQUIRED_INPUTS at S12 composition
   with the declared package.test H18/H18b move (29 -> 31, 51 -> 53).
F4 STATIC READ (not run): view.test.mjs:611-622 sweeps input/select/textarea per screen; the coach adds one
   input (screens.template.html:369, `.text-mode input`, no id, reported as "INPUT"). fontSizeOf defaults to 16
   and app.css:331 `.text-mode input { ... font-size: 16px }` is the only size rule matching it, so :615 passes;
   the :627 filter on "morning-weight" is unaffected; the coach back button (template :346) carries
   data-go="today", so :621 returns. Expect :618 GREEN; only :301-303 and :529-531 go red (F11).
F6-F10 unchanged (files byte-identical to l1). F11 and F12 STOP with the PM as before.
No new finding. Nothing tappable without action; no new component; the weigh-in-first Train flow untouched (R6).

## For the PM (declared, not builder work)
- Sealed cells expected to move at composition: view.test.mjs :301-303, :529-531 (F11, red-first edit);
  package.test H18/H18b (R3); gym.test :494/:495, gss-annex-timing :247, gym-check.mjs (R2); problem.test R10 (R1).
- Not run here (load engine/index.cjs): copy.test.mjs (l1: A1 and Launch guard red from CUI1) and view.test.mjs.
- CUI1 reds still open: package.test APPROVED.length 4 vs 2; copy.test A1 + Launch guard.
- Pack edits proposed: none. Optional STATE-INVENTORY-DRAFT.md note that C-02 is drawn and registered, no longer
  routed (l1).
- Reviewer scratch (outside the worktree, delete at will): %TEMP%\cui6l2-*.cmd, cui6l2-*.cjs, cui6l2-*.log,
  %TEMP%\cui6l2-backup\. Nothing committed, nothing pushed.
