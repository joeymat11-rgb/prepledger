# REVIEW-LOOK-C-UI-6-l1 (Fable 5.1, independent reviewer, 2026-09-25)

Object: the uncommitted diff in worktree earned-look-cui6 (branch rebuild/c-look-cui6) against df91ad1.
Method: static read of every hunk against C-UI-6.md, the pinned pack (app.html, app.css, states.css,
states-coach.css, states-coach.js, states.js, app.js, gate.py, statesheet.py) and S12-LOOK-BRIEF rev2 s2-7;
the look unit tests re-run through pm-run shared (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York).
No gate.py, statesheet.py or browser harness run (per brief); rendered geometry stays unverified until CI.

## VERDICT: PASS WITH FINDINGS. Nothing in the diff fakes, aliases, hides or stands in for a gate
identity; no pack byte, engine, conform, m4/spec, lanes/b/tooling, rebuild.yml or look-gates.yml byte
moved (git diff --stat df91ad1 over those roots: empty). Two STOPs stand for the PM (F11, F12).

## Measured
- Files and sha256 (verified byte-exact, LF, no U+2013/U+2014 in any added line):
  coach-app.mjs bbd9257f...0249 (new); test/coach.test.mjs 1c9820b4...b7b (new); today-app.cjs adadcda8...8d7c;
  screens.template.html 4367c11f...cca; design.cjs a0e6d55d...846; scene.mjs ba46c9a8...b24; preview.css 7f36d193...f0d.
- Tests: coach 10/10; design 15/15; scene 7/7; package 13/14; copy 37/39. The three reds are NOT this ticket's:
  copy A1 + Launch guard fail on `export function reviewHooks` at app.js:38335, i.e. build.mjs appending scene.mjs
  raw after the esbuild bundle (CUI1); package #2 expects APPROVED.length 2, actual 4 (CUI1 widened APPROVED).
- Identities, real elements from the pack markup, cloned into the live .ui host (body then stack):
  .coach-title -> <h1 class="coach-title">Coach.</h1>, serif (app.css:315, last font-family rule var(--serif));
  .coach-line -> <p class="coach-line">Talk through today's plan.</p>, sans (app.css:801, last rule var(--sans)).
  gate.py KNOWN_FACE/SERIF_SELECTORS untouched; no threshold, baseline or check moved.
- Template: C6-1 proves t-coach equals #screen-coach .ui element for element, class for class, own words
  included, less the three named omissions (coach-sub/coach-sub2 hidden lines, data-answer keys, tap link jump).
- Copy: 192 quoted strings in the COACH-COPY region bound by assertCoachBinding to COPY_SOURCES plus app.js and
  states.js (sha-pinned) and dash-checked; no string outside the pack. The live refusal is C-61's own words.
- Owner rules: no dash added; no vendor or model name; mic (.mic-button) is the stack primary in the thumb zone;
  no animation added (C6-7 also scans the pinned orb/mic rules); reduced motion unchanged (scene owns it).
- Lock: no getUserMedia, fetch, XHR, WebSocket, sendBeacon, storage in coach-app.mjs (C6-5 grep + runtime counters).

## Findings
F1 (info) Pre-existing reds are CUI1's (see Measured); C-UI-6 moves no failing cell.
F2 (medium, PM decision) coach-app.mjs is not in build.mjs REQUIRED_INPUTS, so the bundle law does not prove the
   coach reached the page. Adding it moves sealed package.test H18/H18b (with scene.mjs: 29->31, 51->53), red-first.
F3 (medium, gap) No cell mounts today-app with the scene installed and routes to coach. State attributes land on
   phone.closest(".screen"), which exists only because boot() awaits before mountToday while scene.mjs installs
   synchronously at the end of app.js; the order is unasserted. C6-10 is a source regex. Recommend one cell:
   installScene, render("coach"), assert data-state/data-mode on .scene-frame.screen-coach and the class toggle.
F4 (low, unverified) view.test.mjs :618 sweeps inputs on every screen; the coach now carries #coach-text input.
   Pack .text-mode input is 16px so it should pass; not run here (view.test imports rebuild/engine/index.cjs).
F5 (low, record as departure, bar rule 6) "I'll tap instead" no longer jumps to the workout (pack app.html
   data-go="workout"); it toggles the drawn C-07. "Use text mode" opens C-06 with the back link, not the
   prototype's label toggle. Both are the pack's states, but the prototype's live clicks differ.
F6 (low, declared) design.cjs is not purely additive: "Ask your coach." and its lead left APPROVED_COPY. Necessary
   (the template no longer carries the stub) and both strings stay bound through assertCoachBinding.
F7 (info) preview.css coach block checked against the 09-08 legacy layer: h1 letter-spacing -.025em, .prompt:first-child
   border-top var(--ink) (0,2,0 beats the pack's .prompt shorthand), .back color/padding, .change var(--green),
   .primary border/600: each put back to the pack's computed value or token. Chassis line restates app.css:163
   + :852 + :862 (absolute, inset 0, flex column, 0 22px, overflow hidden); height:auto is the one needed override
   of preview .view. One further leak is inert: legacy .link padding/gap/justify on single-child 44px links.
F8 (info) today-app: closeCoach() on every paint and on dispose, after the disposed guard; the back button uses
   coach-app's own listener (renderCoach never calls wire), so no double render; re-mounts re-register states.
F9 (info) "Tap to stop" occurs only in app.js; the pack README names app.js as the implementation reference the
   port binds to, so the provenance holds, weaker than a state file. Acceptable.
F10 (info) Registry joins an existing window.earnedStates and applies through a fresh paint; the URL state is read
   once per page (WeakSet), so statesheet's per-URL loads apply each C state exactly once.
F11 STOP (sealed) view.test.mjs :301-303 and :529-531 require the coach to say "not wired yet" and never "chest press";
   prompt 2 is the pack's "What's my seat on the chest press?". Both go red once the route paints the board.
   Needs a PM-declared red-first edit of view.test.mjs; the builder rightly left it.
F12 STOP (lock vs brief) "no audio" honoured: listening is reachable only through the states; no level source is
   handed in. Joe's questions 1 and 2 from the builder report stand as asked.

## Expected gate rows (CI only): coach font identity, face map, serif/sans; primary .mic-button in first viewport;
prompt columns, icon inset, card inner edge, margins, pressed state, radii, safe area, gaps; statesheet --only C-
(65 states). Full statesheet stays red on T/W index orphans until CUI2/CUI4 register theirs. Mic 657-770 unmeasured.

## Proposed pack edits: none. Optional: STATE-INVENTORY-DRAFT.md note that C-02 is drawn, registered, no longer routed.
