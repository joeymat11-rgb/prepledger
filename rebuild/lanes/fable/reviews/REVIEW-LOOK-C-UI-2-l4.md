# REVIEW-LOOK-C-UI-2-l4 (Fable 5.1, independent reviewer l4, 2026-09-25)

Scope: C-UI-2 round 4 (the F1/F2 fixes after REVIEW-LOOK-C-UI-2-l3), uncommitted in %TEMP%\earned-look-cui2 (HEAD 2506b40, branch rebuild/c-look-cui2), diffed byte for byte against the round-3 bytes named in the brief.
Read: opus55-RULES.txt (sha 51706c33, verified), S12-LOOK-BRIEF-DRAFT.md rev2, REVIEW-LOOK-C-UI-2-l3.md. Wrote no product byte; this file is the only new file. Scratch: %TEMP%\cui2-l4\ (diffs, red replica, taps, probe).

## VERDICT: READY TO PUSH (F1 and F2 fixed exactly as ruled; red-first real; nothing else moved; no new visible string)

## Bytes (sha256, measured)
- today-app.cjs 0c4a7ba062c032c27684acabec516e51f0b4c67e5520410c0411e3e1d00e6f72 (round 3 was 36a36926..050b; the builder's snapshot %TEMP%\cui2-r4\today-app.r3.cjs hashes to that, so it IS the round-3 file).
- test/look-cui2.test.mjs 876277a9f84fa30b53ef773ad5a1c4010bb7faadf90ca6c82f0823b401d27215 (round 3 272bb83b..abca; snapshot look-cui2.r3.test.mjs matches).
- design.cjs 3359e672..941c and screens.template.html e655f019..a56a UNCHANGED versus round 3.
- git status --porcelain: the same 4 M as round 3, untracked only the l3 review (and now this one). `git diff --stat HEAD -- rebuild/m1 rebuild/engine rebuild/conform rebuild/m4 rebuild/lanes/b rebuild/lanes/c .github` is empty: no pack, engine, conform, spec, tooling, workflow or sealed byte moved.
- Hygiene: both edited files CR=0 (LF); U+2013 0/0; U+2014 today-app.cjs 25 before and 25 after (older comments, none added), test file 0/0.

## The diff versus round 3 (git diff --no-index, %TEMP%\cui2-l4\app.diff and test.diff), read hunk by hunk
- today-app.cjs, 2 hunks, +26 -10, ALL inside the delimited C-UI-2 STATUS LINE block or the comment just above `function statusLine`:
  1. :354-363 a comment block recording the F3/F4 departures for the comparison page. Comment only; no behaviour.
  2. :368-373 the open-proposal guard `if (view.nowModel && view.nowModel.decisionsN > 0) return "";` now sits right after the blocked check and BEFORE `phase`/`name` and every phase branch; the old copy after the branches is deleted (the diff removes it at old :371-374). Exactly the F2 ruling.
  3. :384-386 the rest-day branch returns `STATUS_REST_NEXT + next.trim().toLowerCase() + ", tomorrow."` only when `when.trim() === "TOMORROW"`, else `""`. Exactly the F1 ruling (T-11 only for a TOMORROW stamp; any other stamp draws nothing, as the prototype does). The composed bytes for the TOMORROW case are identical to round 3 (", " + "tomorrow" + "." then, ", tomorrow." now), so no string moved.
- look-cui2.test.mjs, 1 hunk, +8: three rows appended to the R3 status table (:155-161), each iterated by the existing loop and each expecting "" (so the prototype-literal check is skipped for them, correctly, since the prototype draws no line). No other test or cell touched.
- No new visible string: every string a user can see is either an existing STATUS_* constant, the engine's own session name, or "". The quoted sentences in the new comments are comments.

## Red-first (measured by me, not taken from the builder; pm-run shared, guard preloaded, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, 0 engine modules loaded on every run)
- Replica %TEMP%\cui2-l4\red: the round-4 test file over the round-3 today-app.cjs (36a36926) with the worktree's preview.css, design.cjs, template and the pack's app.css/app.html/states-today.js. look-cui2: 5 tests, 4 pass, 1 fail = the R3 status test, failing at the first new row "rest day, a later stamp": expected '' actual 'Nothing to decide. Next: lower body, MON 9/21.' (%TEMP%\cui2-l4\l4-red.tap).
- Per-row probe (%TEMP%\cui2-l4\l4-probe.cjs, the status block alone in a bare vm, both byte sets, %TEMP%\cui2-l4\l4-probe.txt): on round-3 bytes all three new rows RED (F1 row got "Nothing to decide. Next: lower body, MON 9/21."; finished+proposal got "Upper body logged. Nothing to decide."; rest day+proposal got "Nothing to decide. Next: lower body, tomorrow."); on round-4 bytes all three GREEN (""). Two reviewer rows: T-11 for a TOMORROW stamp still draws "Nothing to decide. Next: lower body, tomorrow." on both (nothing lost); a blocked view with an open proposal still says T-06 on both (the blocked check stays first).
- Green at the worktree (%TEMP%\cui2-l4\l4-green.tap): look-cui2 + design.test + scene.test + pack-pin = 101 tests, 100 pass, 1 fail; the fail is scene "C-UI-1 build reaches the scene through the actual offline preview bundle": "Cannot find package 'esbuild'", the same known failure as rounds 2/3 and l3. look-cui2 5/5.
- Not run (import the engine index or need the exclusive slot): copy.test.mjs, view.test.mjs, checkin/problem/package tests, browser-check, gate.py/statesheet. approved-pin's pre-existing red (l3, APPROVED list at 2506b40) is untouched by round 4.

## Findings (none block)
- L4-1 (reading, for the PM's note): with the guard ahead of the phase branches, an open proposal now also empties T-14 "<session> is under way.", T-16 "Today's workout cannot open." and T-17 "An earlier workout is still open." (measured: phase active + decisionsN 1 gave "Upper body is under way." on round 3 and "" now). That is what "ahead of the phase branches" means and the builder says so; it holds only until C-UI-3 binds T-40, but it is a wider blank than F2 named, so the comparison page or the C-UI-3 brief should say it.
- L4-2 (reading, pre-existing, not moved by round 4): a rest-day title with an empty session part ("· TOMORROW") would compose "Nothing to decide. Next: , tomorrow."; engine titles always carry a name (today-app.cjs:295 comment), so unreachable today; C-UI-3 could add `next.trim() &&` if it ever touches the branch.
- F3/F4 stand as recorded departures (comment at :354-363), F5 unchanged, per the PM rulings. Nothing to do here.
