# REVIEW CUI1 blocker repair l1 (independent reviewer claude-fable-5-1, 2026-09-23)
Under review: worktree earned-cui1-design, branch rebuild/c-ui1-design, base 5fec649, uncommitted; not modified by me.
Verified sha256 prefixes: preview.css 9050540b, scene.mjs 7dd4a77e, browser-check.mjs 7129610c,
test/scene.test.mjs 3ce7ceb1, CUI1-BLOCKER-REPAIR-REPORT.md bf4390c7; builder tree still identical after my runs.
Blind order kept: DECISIONS:724-732 (origin/rebuild/t2-client-core), :727 floor proposal (45d12d7 report lines 53-57),
7e25a69 preflight, c38cc0a sequencing, then the four diffs, then the builder report.
Execution: own detached worktree at 5fec649 (earned-cui1-review) plus the four files copied in; node_modules only via
junctions to the existing targets; runtime lock held for every run and released; no protected-five content read or shown.

## VERDICT: ACCEPT WITH NAMED DEBTS (no acceptance, promotion or fidelity claim; :732 order preserved)

## Reruns (pinned Node, Edge as W7_BROWSER_BIN, TZ America/New_York)
build: PASS, 3 assets, 146 pinned inputs, exit 0. scene.test.mjs: 7/7, exit 0 (new B3 cell is #2). design.test.cjs: 15/15, exit 0.
browser-check.mjs: exit 0, PASS line: 30 titles swept both states, worst headroom 0px before / 2px after, new B1/B3 cells pass.

## (1) Floor fix is exactly :727; 0px headroom honestly measured; red reproduced
:727 (45d12d7 report): "retain the 33px floor ... remove the colliding 12px primary margin and C's 23px intro bottom margin.
That reclaims the measured 35px." Diff: only .intro margin-bottom 0 and .bottom .primary margin-top 0 at the 33px floor;
the 32dee44 `.bottom { padding-top: 12px }` (20px to 12px, an extra 8px not in :727) is removed. Nothing else in the block.
My unrounded probe, longest engine title (72-char template literal), 33px floor reached in Edge 390x844:
  no floor block:  primary bottom 878.55 of 844, overflow 34.55 (browser-check rounds to 879 > 844; RED reproduced).
  base 5fec649:    bottom 835.55, headroom 8.45 (padding-top 12px block); browser-check at base is GREEN, as the report says.
  candidate :727:  bottom 843.55, headroom 0.45; introMarginBottom 0px, primaryMarginTop 0px, bottomPaddingTop 20px.
So "0px" is the harness's Math.round of +0.45px real headroom: honest, but the margin is under half a pixel (DEBT D1).

## (2) B1 host move
Measured candidate vs base: #phone parent changes from .phone to .scene-frame.screen.screen-today.is-active; host class gains
"ui". Computed style identical on all 17 probed properties except flex-direction (row to column, inert under display:block);
rect 390x844 at 0 in both; scrollHeight equal per headline. .screen.is-active count 1; .ui === #phone; no aria-hidden ancestor;
frame aria-hidden removed, plate/embers/surface/grain each aria-hidden="true" (approved-pack pattern). Listeners: the node is
moved, not cloned; primary click opens the weigh-in sheet after the move (probe) and the full browser-check drove real weigh-ins,
reload, kill and reopen with exit 0. No engine, template or pinned CSS touched.
preview.css `.scene-frame > .view.ui` overrides pinned .ui position/inset/display/padding/overflow and the frame's pointer-events
with .view's own existing values; no colour, type or spacing token is introduced. It is a preview-shell rule in an unpinned-by-S4
file, not an edit of a pin. It does mean the legacy host does not take .ui's `padding: 0 var(--inset) 24px` or flex column; that is
the layout C-UI-1.md:7-17 defers, and it is the honest alternative to an empty probe .ui that 7e25a69 forbids. Judged allowed (DEBT D2).

## (3) B3 chrome: markup byte-for-byte, rendering NOT identical to the approved pack (DEBT D3, measured)
APPROVED_CHROME_STATUS (794 bytes) occurs exactly 3 times in approved app/app.html, identical; home div matched by the executed cell.
chrome=1: status display block, 54px, z 20, pointer-events none; home 5px at bottom 8px; chrome=0: both display none. BUT the
status div also carries class "status", and Additions C (m1/approved-2026-09-08/Earned-additions-C-approved.html:5, bundled)
declares `.status { font-size: 14px; color: var(--green); margin: 12px 0 }`. Measured in the preview: status bar rect top 12px
(computed top 0px, margin-top 12px), color rgb(46,90,60) on the bar and on .time, against body colour rgb(242,238,230) in Ink.
The approved pack has no Additions C, so its status bar sits at 0 in the text colour. The new harness cell asserts only
shown/height/aria-hidden and passes over this. Not a blocker for B3 as worded (the chrome exists and is drawn), but it is a
visible fidelity defect of the drawn chrome and must be fixed or ruled on before any screenshot is offered as pack-faithful.

## (4) Tests
scene.test.mjs: one new cell, and the fake frame gains `insertBefore() {}` only; the board-date cell's assertions are unchanged.
In the fake, `frame.querySelector(".chrome.status")` is null so the call is a no-op; in a real DOM insertBefore(host, null) appends.
browser-check.mjs: two added deepEqual cells; no existing assertion loosened; `.view` lookups still resolve to #phone after the move.

## (5) B2 and B4 STOPs: correct
B2: 0 of the 12 gate identities exist on the live preview; c38cc0a and :732 forbid aliases, renamed bindings and probes; only
CUI2/3/4/6 supply them behind S10. Stopping is the required outcome. B4: @font-face src are data: URLs; the transport lane
(:730/:731, 0e5e194) owns it; gate untouched. Correct not to duplicate.

## (6) Scope
git status in the builder worktree: exactly the four files plus the report. No engine, S9/S10, pack, guard, pin, threshold,
copy, ledger or DECISIONS change. Boundary note confirmed statically: preview.css at 5fec649 (d4279ce4...) already differs
from the S6/S7/S8 declared post (7cf97598...), so the measure boundary drift predates this repair (reseal child work, :732).

## Named debts
D1 0.45px real headroom at the 33px floor on Windows Edge; Linux/Chromium metrics may cross 844 by rounding. Owner choice:
   grant the 8px guard rule or accept the risk before Linux evidence; do not paper over with a threshold change.
D2 legacy host overrides pinned .ui layout declarations via preview.css; revisit when CUI2+ real screens replace the host.
D3 chrome status bar shifted 12px and coloured var(--green) by Additions C's `.status`; harness does not catch it.
D4 browser-check PASS line says "33px floor never reached" while listing 33px among fitted sizes: pre-existing wording defect.
Not done: Linux run, gate.py, statesheet, measure/boundary.test.mjs (may load protected inputs), Dawn colour probe of D3.
