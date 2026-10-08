# REVIEW-LOOK-C-UI-4-l2 (Fable, independent, fix round 2; static plus the look unit cells; 2026-09-25)

Object: the uncommitted diff in earned-look-cui4 (branch rebuild/c-look-cui4, HEAD df91ad1) against df91ad1,
and the round-2 delta against the byte-exact l1 build kept at %TEMP%\cui4-scratch\red2 (sha 15c7ba3c, fad566f4,
63fc57f1, 6ef877f7; scene.mjs 29272b90 unchanged). Read: every hunk of both diffs; gym-model.mjs :38-39, :68-76,
:284, :458-459 (the shapes the card now reads); machine-settings-view.mjs renderBlock :38-89; app.css :144-148,
:163, :202, :248, :280-288, :500-503, :608-612, :646, :852-863; states-workout.css :15-53; states-workout.js
rest() :118-152, machine() :101-103, W-06/W-33..W-36; the 09-08 legacy rules (.slot, .link, button, focus-visible).
Not run: gym.test, machine-settings-ui.test, gss-annex-timing.test, problem.test, view.test, copy.test (each imports
gym-host / today-bindings / today-app.cjs or the engine: possible protected load, and sealed), gate.py, statesheet,
browser harnesses. RULES sha 51706c33 and brief rev2 952f6e12 re-hashed before reading.

## VERDICT: READY TO PUSH (for the look-gates run at the exact head). Every l1 finding is fixed as the l1 asked,
nothing regressed, no new visible word, no forbidden byte. The remaining items are departures to record on the
comparison page and the sealed-cell moves the PM declares at S12 composition (R2), listed below.

## Measured
- git status: exactly the five today/ files M (design.cjs, gym-app.mjs, preview.css, scene.mjs, screens.template.html);
  untracked only test/workout-look.test.mjs and the l1 review. `git diff --name-only df91ad1` = those five. No byte
  under rebuild/m1, engine, conform, m4, lanes/b or .github.
- sha256 on disk match the builder's report exactly: screens.template.html 972a526a..., gym-app.mjs 17b55b89...,
  preview.css c9652479..., design.cjs ec7c3103..., scene.mjs 29272b90..., test/workout-look.test.mjs 15a74d20....
- Full diff vs df91ad1 (cmd redirection, byte exact): 403 added / 184 removed lines, 0 CR bytes, 0 U+2013/U+2014 on
  added lines (the three matches in the diff are one context line and two removed lines).
- pm-run shared (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York), log %TEMP%\cui4-l2\l2-tests.log:
  red-first, workout-look against red2: 13 tests, 4 pass, 9 fail (the seven F cells, the identities cell and the R2
  cell are red on the l1 bytes); after the fixes workout-look 13/13, design 15/15, scene 7/7, package 12/14 (the same
  two reds as at df91ad1: approved count expected 2 actual 4, and esbuild absent for the sibling build);
  node --check gym-app.mjs, design.cjs, scene.mjs all 0.

## The l1 findings, each checked against the pack
F1 FIXED. preview.css `.scene-frame.screen-workout > .view.ui { padding: 0 var(--inset) 0; overflow: hidden }` =
   app.css:163 inset + :862 padding-bottom 0 + :852 overflow hidden. preview.css is composed LAST (design.cjs
   composeStyles: fonts, scene, legacy, pinned, chrome), so the (0,4,0) rule stands.
F2 FIXED. t-rest #setcard: numerals kept (#w-value / #r-value bound to rest-load / rest-reps, .times x), divider,
   .w-facts where #last-time was; exactly states-workout.js rest() (active(logged) + w-facts replacing #last-time).
   The figures are read from the model's own facts line (gym-model:458-459 composes "<load> lb U+00D7 <reps> reps
   U+00B7 ..."; the regex in gym-app matches that shape and draws nothing on any other). The pack draws the same
   figures twice too (numerals and facts, states-workout.js:297), so this is fidelity, not duplication.
F3 FIXED. #machine holds only spans: .title.setting (machine-setting) and .sub.when (machine-when), plus the hidden
   settings-cues / settings-head spans. renderBlock still runs, but its list and open label go to detached spans
   (gym-app:264-266); no div or p inside the button. W-06: title = stored "name value." pairs, sub = "Machine
   settings"; W-33/34/36: title "Machine settings", sub = reading / none / unread sentence, W-36's action sentence in
   .note-block under the row, the row disabled while not known (pack :53 .machine.rowcard:disabled). The only
   composition beyond bound data is the period after each pair (the pack's "Seat 4."), which is Q5 for Joe.
F4 FIXED. The W-08/09 line is left span, gold .w-presc-x (states-workout.css:15), right span, split only on the
   model's own ' U+00D7 ' (gym-model:76); `w-blank` is set only by the W-19 refusal, cleared on input.
F5 FIXED. #last-time is a plain div with the bound span, no chevron, no svg; departure recorded in the template
   comment (R4).
F6 FIXED, and two more leaks found by the builder are real: Refinement A's `.slot { padding-top: 9px; ... }` does
   match the dots (l1 was wrong to say nothing matches .slot; the pack's `.set-dots i` border shorthand at (0,1,1)
   still beats .slot's border-top, so only the padding needed restating), and preview.css:140-143's own 44 px
   floor on [data-action="settings-open"] undercut .machine.rowcard's 60 px (app.css:608). Block 2b: focus outline
   `revert` (app.css has no focus rule, so the UA ring is the pack's render), button min-height auto (legacy 44 px;
   the pack's own .rowcard 58 px / .link var(--hit) still apply through their class rules), .link padding 0 (the
   pack's button { padding: 0 }, app.css:148; the pack's .link sets no padding), all at the legacy specificity via
   :where; the settings editor excluded as C-UI-5's.
F7 FIXED. RUNTIME_COPY gains "Set " and "Log " (both verbatim in the pack); typing into a box clears the W-19
   refusal and its mark (refused === 'entry'), while a CHOOSE_EFFORT or layer refusal stays until answered.

## Round-2 regressions looked for, none found
- Every slot the round-2 code reads exists in the template (machine-setting, machine-when, machine-note, rest-load,
  rest-reps, saved-block, next-block, plan, reason-more, strip, set-count); put() throws on a missing one and the
  design cell walks the template, so a miss would be red.
- The chassis fragment is empty after the mount; every post-mount use (bindSettings, bindGymAction) holds element
  references taken before it. `.w-rest` is toggled on the live host that carries `.ui` (scene.mjs:355), matching the
  pack's `.ui.w-rest .log`, and cleared by leaveCard.
- The seven identities are unchanged from l1 and the rest screen's #w-value / #r-value / .times are the same real
  elements, now bound; #log-label is still one element carrying the data-slot. No alias, no hidden dummy.
- No new static word in the template this round; the only new composed strings are bound data plus the pair period
  (Q5) and the two declared fragments.

## For the comparison page (departures, builder's list confirmed plus two)
- W-08/09: boxes stay above the prescription line (no Edit mode). The rest screen has no set dots / "Set N of M" (the
  saved view carries no set count). A stored cue keeps its own sub line on W-06. Hidden settings-head span stays.
- #last-time is a div, not the pack's 44 px button (R4). The W-26 refusal re-dresses the `p.w-rest-line` in place
  rather than the pack's div + span.refusal-text (no pack rule styles .refusal-text; no measured difference).
- The builder's note "no test runs gym-app.mjs in a DOM" is imprecise: gym.test, machine-settings-ui.test and
  gss-annex-timing.test do (JSDOM), but they were not run locally (protected load); CI is where they run.

## Sealed cells that move (R2, PM declares at composition; static reading agrees with the builder)
gym.test:495 ("Log set 1": the label now carries the prefilled figures with U+00D7); :494 stays green (`slot` kept);
gss-annex-timing:247 ([data-step] steppers gone); machine-settings-ui cells that expect `settings-list .row` pairs
(:206, :219, :257, :297, :309, :352, :452, :550, :600, :659) and :1062 (W-36's second sentence outside the button);
gym-check.mjs :275-309, machine-settings-check.mjs :154/:256/:294; unchanged from l1: view.test :301-303/:529-531/
:618, problem.test R10 (R1), package.test H18/H18b (R3). copy.test.mjs unrun locally (protected import).

## Open for Joe (unchanged): Q1-Q4 from the builder; Q5 the "Seat 4." composition on the machine row title.
