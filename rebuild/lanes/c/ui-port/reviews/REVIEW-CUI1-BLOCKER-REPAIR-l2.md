# REVIEW CUI1 blocker repair l2 (independent reviewer claude-fable-5-1, 2026-09-23, round 2 of f5dfdaf7)
Under review: worktree earned-cui1-design, branch rebuild/c-ui1-design, base 5fec649, uncommitted; not modified by me.
sha256 verified: preview.css ca3ad3a7a098d1e4bb3f91d9530e4a78aa3d73b6300ccf3899c22e1112d7febc,
browser-check.mjs c3a023758ed819a9424b44211160b308bb1e347f12aaff32e97bea2da14a7b4b, scene.mjs 7dd4a77e (unchanged),
test/scene.test.mjs 3ce7ceb1 (unchanged), report e34895217ff67168c8841243b2548a6cbb873d012dd66a93b9b7f2b972cf2a84.
git status in the builder tree: exactly those four files plus the report; no pinned pack, Additions C, engine, guard or ledger byte.
Rulings read: DECISIONS:780 (floor stays exactly :727, no 8px rule, unrounded headroom printed). D2 carried to C-UI-1, no code.
Execution: fresh detached worktree at 5fec649 in my scratch, four files copied in, node_modules by junction only, runtime lock
held for every run and released, Edge as W7_BROWSER_BIN, pinned Node, TZ America/New_York. No protected-five content read.

## VERDICT: ACCEPT (round-2 debts closed as ruled; no acceptance, promotion or fidelity claim; :732 order preserved)

## Reruns
build PASS 3 assets/146 pins, exit 0. scene.test 7/7, exit 0. design.test 15/15, exit 0. browser-check exit 0, PASS line:
"worst headroom 0px before / 2px after (unrounded 0.45px / 2.41px); ... (8 before / 8 after at the 33px floor, none below it)".

## D3: chrome renders as the approved pack draws it (fixed, measured, red reproduced)
Diff adds one preview.css rule in the scene layer only: `.scene-frame > .chrome.status { font-size: inherit; color: inherit;
margin: 0; }`. Approved app.css/app.html and Additions C untouched (git status). The new cell loads
m1/approved-2026-09-18/app/app.html by pathToFileURL in the SAME chromium instance (new context), ink then dawn with
?theme=&chrome=1, and deepEquals bar and clock offset/margins/colour/font-size against the preview; assertion is strict equality.
My own probe, superset of that cell (15 computed properties plus rects on bar, .time, .island, .icons, .home and the home
::after background), pack vs preview in one Edge: ink 0 differences, dawn 0 differences. Pack page honoured the hooks
(with-chrome true, data-theme dawn), bar top 0, colour rgb(242,238,230) ink / rgb(30,27,24) dawn, 15px.
Counterexample: with the new rule stripped and rebuilt, the same probe reports 11+ differences (bar margin 12/12px,
colour rgb(46,90,60), 14px, rect top 12; clock top 30 vs 18; island colour/size): the round-1 defect, so the cell is red-first.

## D4: wording fixed
"(33px floor never reached)" replaced by the counted "(N before / N after at the 33px floor, none below it)"; observed 8 / 8.

## D1: unrounded headroom printed, no threshold changed
Sweep adds exactRoom = view.clientHeight - (box.bottom - top) and prints min to 2 decimals; both assertions
(row.bottom <= row.viewport, row.size >= 33) are byte-unchanged in the diff. Floor block is exactly :727 (intro margin-bottom 0,
primary margin-top 0 at 33px; no .bottom padding rule), as :780 rules. Observed 0.45px real headroom on Windows Edge; this is now
visible in every log, which is what the ruling asked. Linux value still owed with Linux evidence.

## Regressions since round 1
None found: scene.mjs and scene.test.mjs byte-identical to round 1; browser-check changes are the D3 cell, the reported
exactRoom/atFloor fields and PASS-line text; full check with real weigh-in, reload, process kill and reopen passed.
Not done: Linux run, gate.py, statesheet, measure/boundary.test.mjs (pre-existing preview.css drift, reseal child per :732).
