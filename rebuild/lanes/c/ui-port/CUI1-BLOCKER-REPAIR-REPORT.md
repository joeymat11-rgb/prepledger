# CUI1 blocker repair report (builder, claude-opus-5-5), rounds 1 and 2
Grant: PM, 2026-09-23. :727 floor CSS and the 7e25a69 blockers, red-first. Round 2 covers review f5dfdaf7 debts D1-D4.
Base 5fec649 on rebuild/c-ui1-design, clean at start. Nothing committed. No acceptance or promotion claim (:732).
Runtime: the exclusive %TEMP%\earned-runtime.lock was taken for each round and released; no node/Edge process is left.
Tooling: pinned Node; `node rebuild/m3/w7-preview/today/build.mjs`; `node .../browser-check.mjs` (W7_BROWSER_BIN=Edge);
`node --test .../test/scene.test.mjs` and `.../test/design.test.cjs`; read-only scratch probe
%TEMP%/cui1-opus55/interface-probe.mjs. All logs are in %TEMP%/cui1-opus55/.
## Baseline at 5fec649
browser-check exit 0 (browser-red.out.txt 2cf81f89...). The 86007bc NaNpx stop did not reproduce; it is not claimed fixed.
HEAD's 32dee44 floor rules reclaim 43px (including .bottom padding-top 12px). :727 reclaims 35px (the 23px + 12px margins).
## F1 floor 879>844 (:726/:727); PM ruling D1: stay exactly with :727
RED: with the floor rules removed, browser exit 1: the "EARNED VOLUME" title puts the bottom at 879 > 844 at 33px
(browser-floor-red.out.txt cc130589d1741a5264c5c1bec27d0822652b60201b18492a332481fb02f16b34).
FIX: at the 33px floor only, .intro margin-bottom 0 and .bottom .primary margin-top 0. The 32dee44 .bottom rule is removed (not granted).
GREEN: exit 0, 30 titles swept in both states. D1: the PASS line now prints the unrounded worst headroom to 2 decimals.
Edge shows "0px before / 2px after (unrounded 0.45px / 2.41px)" (r2-green.out.txt 92578e64...).
Assertions and thresholds are unchanged. If Linux crosses 844 it goes red and returns to the PM.
## B1: the active screen's .ui was decoration (7e25a69)
RED: probe gateAlive false (probe-red a39009d2...). The new harness cell failed with uiIsLiveHost false and
uiUnderAriaHidden true (browser-iface-red f66a13a0...).
FIX (scene.mjs): the frame is no longer aria-hidden; each decoration layer is. The real #phone host moves into
the active screen as its .ui, and its listeners move with the node.
preview.css `.scene-frame > .view.ui` restates .view's values. Raw pinned .ui gave flex, 22px padding, no scroll and no pointer events (probe-raw ce2efc81...).
GREEN: gate probe true. Host computed style, scrollHeight 1051 and rect hash match baseline (probe-final 538f98c2...).
## B3: chrome=1 drew nothing
RED: probe status/home null. New scene.test cell (approved chrome byte for byte) failed 1/7 (scene-red fafc99d0...).
FIX: scene.mjs appends the approved app.html status and home elements verbatim. The fake frame in the test gained a no-op insertBefore.
GREEN: status 54px and home 5px shown and aria-hidden under chrome=1; undrawn under chrome=0.
## D3 (review, must fix): Additions C `.status` restyled the chrome status bar
RED: a new browser-check cell loads the approved app.html (file URL) and the preview in the same Edge, ink then dawn,
chrome=1. It compares the status bar and its clock: offset in the screen, margins, colour and font size. The browser exited 1 at ink:
preview bar top 12, margin 12/12px, 14px, rgb(46,90,60); pack top 0, margin 0, 15px, rgb(242,238,230);
clock top 30 vs 18 (r2-d3-red.err.txt f58140678f2fb53286a5560166354c2b0a7bfb61054f5f26e94ff5a7deceb4ed).
FIX: preview.css `.scene-frame > .chrome.status { font-size: inherit; color: inherit; margin: 0; }`, in the preview-owned
scene layer only. Chrome markup is still byte-identical to app.html; no pinned CSS or pack byte changed.
GREEN: browser exit 0 with ink and dawn equal to the pack (r2-green 92578e64...); scene 7/7 (r2-scene f8968e71...),
design 15/15 (r2-design d85354c1...).
## D4: PASS-line wording
"(33px floor never reached)" was false. It now reads "(8 before / 8 after at the 33px floor, none below it)".
## D2 (named debt carried to C-UI-1, no code change)
`.scene-frame > .view.ui` overrides pinned .ui layout declarations for the legacy host. Revisit it when the CUI2+ real
screens replace that host.
## B2 STOPPED (design/sequencing): 0 of 12 gate font identities exist (#greeting, #status-line, #proposal-lift, ...).
Only CUI2/3/4/6 can supply them; c38cc0a and :732 forbid fakes, aliases and renamed bindings.
## B4 STOPPED (owned elsewhere): both @font-face src are data: URLs, which gate.py:313-320 does not decode.
The font-transport lane (:730/:731, 0e5e194) owns this. The gate is untouched.
## Open, not executed
measure/test/boundary.test.mjs:185-190 pins preview.css bytes. The drift predates this work (32dee44) and belongs to the reseal child.
It was not run because it may reach protected inputs. Still owed: Linux/CI, gate.py, statesheet and independent re-review of round 2.
## Files (uncommitted), sha256
rebuild/m3/w7-preview/today/preview.css ca3ad3a7a098d1e4bb3f91d9530e4a78aa3d73b6300ccf3899c22e1112d7febc
rebuild/m3/w7-preview/today/scene.mjs 7dd4a77e1fa80f00ec230bbe4c3bb911cfafe4c81d1a88fb5dc72a73cb4a2aba (unchanged in round 2)
rebuild/m3/w7-preview/today/browser-check.mjs c3a023758ed819a9424b44211160b308bb1e347f12aaff32e97bea2da14a7b4b
rebuild/m3/w7-preview/today/test/scene.test.mjs 3ce7ceb1e6d6024b06994000ff749e3a68d373caa32c430dc2fcefdf68353429 (unchanged)
No engine, S9/S10, pack, guard, pin, threshold, copy, ledger or DECISIONS file was changed.
