# REVIEW-LOOK-C-UI-4-l3 (independent Fable reviewer, round 3; wrote no round)

Worktree C:\Users\joeym\AppData\Local\Temp\earned-look-cui4, branch rebuild/c-look-cui4, HEAD 59b12e2 (round 2), round 3 uncommitted. Reviewed against DECISIONS:817/:820/:821 (origin/rebuild/t2-client-core, fetched), the look brief rev2 (952f6e12), RULES 51706c33, and the pack boards PACK = rebuild/m1/approved-2026-09-18/ (app/app.html, app/app.js, app/states-workout.js, states/STATE-INVENTORY-DRAFT.md), all read statically.

## VERDICT: READY TO PUSH (with the builder's coach-route STOP standing for the PM)

## 1. Scope (measured)
- `git status --porcelain`: exactly four modified files, all under rebuild/m3/w7-preview/today/: design.cjs, gym-app.mjs, screens.template.html, test/workout-look.test.mjs. No untracked file under rebuild.
- `git diff --name-only 59b12e2 -- rebuild/m1 rebuild/engine rebuild/conform rebuild/m4 rebuild/lanes/b .github src`: EMPTY. `git diff --stat 59b12e2 -- rebuild/m1`: empty (pack bytes untouched).
- Diff vs 59b12e2: 149 added, 16 removed, 4 files; 0 U+2013/U+2014 on added lines; 0 CR in the diff; CR=false on every changed file (l3 scan.cjs on my own r3.diff).
- sha256 (LF) re-measured and equal to the builder's: screens.template.html bd098abe..., gym-app.mjs a0cf0ce4..., design.cjs 43b26fc1..., test/workout-look.test.mjs 3890ee3f...; preview.css c9652479... and scene.mjs 29272b90... unchanged.

## 2. Every new string is verbatim board/prototype text (pack file:line, my own search, l3-find.cjs)
| app string | where drawn | pack source |
| "example" + title "Example numbers, not your data" | t-gym and t-rest header .right .pill | app/app.html:129 (workout header, same markup to the letter) |
| "Today’s set" | t-gym .setcard .eyebrow | app/app.html:138 |
| "Unlogged" / "Logged" | #set-state-text (t-gym / t-rest, .state.logged on rest) | app/app.html:139; app/app.js:155-156 (`classList.toggle('logged', set.logged)`, `set.logged ? 'Logged' : 'Unlogged'`) |
| "RIR (clean reps left)" | #gym-rir-head | app/app.html:174 |
| "Earned is here" | #talk-workout-label inside #workout-voice > button.talk#talk-workout (.orb, .label, .mic) | app/app.html:162-166; app/app.js:211 |
| "No load step is on file for this machine. Type the load you used." | .w-hint[data-slot=step-hint], hidden unless view.entry.step === null | app/states-workout.js:275 (W-18 hint(); the board's disabled +/- steps at :269-274 are left out per :820 (4)) |
| "Start set " + N | rest primary label | app/states-workout.js:299 (W-22 primary 'Start set 2'), also :304 :317 :322 |
| "This set could not be recorded on this device, and no part of it was recorded." | .refusal-text lead, coded logSet refusal only | app/states-workout.js:292 (W-21 refusalNear lead) |
| "The layer’s own reason: " | .refusal-tail fragment | app/states-workout.js:292 (W-21 tail 'The layer’s own reason: ' + CODE.log + '.') |
| "What you did · Set " + N (kept on rest) | t-rest eyebrow | app/states-workout.js:130 (rest(): `'What you did · Set ' + o.n`) |
No visible string was found that is on neither the boards nor product copy. The removed strings "Clean reps left" and "Ready for set " are gone from template and RUNTIME_COPY (R3-1/R3-2 assert their absence).

## 3. design.cjs approved copy cites :820
- APPROVED_COPY gains the seven board strings under a comment citing DECISIONS:820 (2) with state ids W-06, W-22, W-18 (design.cjs hunk @142). RUNTIME_COPY replaces "Ready for set " with "Start set " and adds the W-21 lead and tail fragment under a comment citing DECISIONS:820 (2), W-22, W-21 (hunk @156). R3-6 pins both lists and the :820 cite. design.test.cjs 15/15 under the guard.

## 4. Identities
- The seven workout identities (.screen-title, #set-count, #w-value, #r-value, .numerals .times, #machine .setting, #log-label) are untouched by the diff and remain real bound elements (the existing cell "the seven workout identities are real, bound elements" passes). #set-state, #talk-workout, .w-hint and the pill are additions, none an alias of an identity. #edit exists only on t-rest (template :497, Undo); t-gym has none (recorded departure; gate G:73 PRESSABLE #edit stays red, disclosed).
- #greeting and #status-line are NOT in this worktree's template (git grep -c: 0 hits): they are C-UI-2's bindings and are not reviewable here; nothing in this diff touches t-today.

## 5. Red-first (my own run, pm-run shared, guard preloaded)
- RED: byte-exact 59b12e2 blobs of screens.template.html, gym-app.mjs, preview.css, design.cjs extracted with `git show REV:path >` under cmd and verified by `git hash-object` == `git rev-parse 59b12e2:path` (b8a3f4c7, 77c5629d, b2ec3dae, 9554919c), plus the round-3 test file: 19 tests, 13 pass, 6 fail, exactly R3-1..R3-6; guard: 0 engine modules loaded. Log %TEMP%\cui4-r3-l3\red.log.
- GREEN at the working tree: workout-look 19/19, design 15/15, scene 7/7, package 12/14 (the two known reds: "approved design is pinned by sha256" expected 2 actual 4; "sibling w7-preview package" Cannot find package 'esbuild' from build.mjs; neither is the guard refusing anything); `node --check` 0 on gym-app.mjs and design.cjs; guard: 0 engine modules loaded in every run. Log %TEMP%\cui4-r3-l3\green.log. MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York.
- Not run (import the engine or are browser harnesses): copy.test.mjs, gym.test.mjs, gss-annex-*, machine-settings-ui.test.mjs, machine-settings-check.mjs, gym-check.mjs, view.test.mjs, problem.test.mjs.

## 6. Behaviour read (static)
- W-18: `map.get('step-hint').hidden = view.entry.step !== null`; gym-model.mjs:368 exposes `entry.step: stepFor(...)` (null with no exercise.inc), so the hint shows only with no load step on file. No +/- buttons (R3-3 asserts no pstep/w-step).
- W-21: `refuse(result, !!result.code)` from logOutcome; dedup by refusalText (copy and code each once); tail = LAYER_REASON + "<copy · code>" + "."; when copy === code the tail is the board's exact "The layer’s own reason: CODE.". Repaint keeps the dress only when view.message.code equals the remembered setRefusedCode. Uncoded refusals unchanged.
- Coach pill: `voice.hidden = typeof onCoach !== 'function'`; listener bound only when onCoach exists; no generic data-action dispatcher exists (grep dataset.action / [data-action]: none), so nothing tappable is drawn without a route (:820 "an element with no action is never drawn tappable").
- today-entry.mjs:219 passes only `onCheckIn: checkIn, draft: gymDraft` to mountGym: the builder's STOP is accurate; the pill never shows until composition wires `onCoach` (today-entry.mjs is sealed; PM ruling).

## 7. Proposed pack edits P1-W1..W7 (checked against the inventory; none applied)
Targets exist: STATE-INVENTORY-DRAFT.md :528 `- "Exercise N of M"`, :530 `- "Log set N"`, :534 `- "Ready for set N"`, rows W-06 :224, W-18 :236 ("The load step buttons are disabled; the box takes typed entry only"), W-21 :239 ("The layer's own copy and code, deduplicated; the typed entry stays"), W-22 :240, headings :409 "Honest empty and unknown states", :445 "Nothing was recorded". Each proposed replacement is the verbatim board text listed in section 2.

## 8. Sealed cells expected to move (static, matches the builder's list)
gym.test.mjs:486 (`'What you did · Set 1'` on the active set) and :515 (`'Ready for set 2'`); gym-check.mjs:198, :248, :304 (all read entry-title on the ACTIVE set after waitForSelector log), :241, :329, :458 (Ready for set). Carried from l2 unchanged.

## 9. Findings
- F-l3-1 (PM, not blocking): the pill title "Example numbers, not your data" is the board's verbatim title and :820 (2) names "the example pill" as the board's; once an athlete's own week is set up the title is untrue on the product. Owner-ruled words; flag for the phone-sheet touchpoint.
- F-l3-2 (PM, not blocking): W-21's tail on the app is "The layer’s own reason: <copy · code>." where the board draws only the code; the extra part is the layer's own product copy under the inventory W-21 row ("copy and code, deduplicated"), not a new string. Record as a composition departure on the comparison page.
- F-l3-3 (builder, cosmetic, no change needed): the builder's green.cmd inline dash scan lost its `!` to cmd delayed expansion; the 149/16/0-dash figures are re-measured here by a script file and hold.
- STOP carried: coach route (onCoach at composition, today-entry.mjs:216-219 + today-app.cjs open()); copy.test.mjs unrun locally (CI).
