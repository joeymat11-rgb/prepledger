# M2-S5-TODAY-CHILD - FINAL REVIEW (Fable 5.1, high effort, DECISIONS:439)

VERDICT: ACCEPT - 0 BLOCKING / 1 MAJOR / 2 MINOR / 6 NOTE

Reviewed head 8e386496df2b914c0b75b53c519862a1fe8404e3 (rebuild/b-s5-today-child, not pushed) in a
detached worktree %TEMP%\earned-s5-fable with the three junctions only; merge-base and tip
origin/rebuild/t2-client-core 8b484c09 (462 ledger lines), an ancestor of HEAD. Independent of the
Opus r1 (4cd74b3b) and of the author: every number below was recomputed here. Synthetic data only;
nothing private read. Every mutant was reverted; `git status --porcelain` is empty at this commit.

## 1. Findings

**MAJOR 1 - the coach ENGINE_REVISION trip-wire is red at this head and nothing in S5 can close it.**
`rebuild/coach/test/engine-revision.test.cjs` (P6-COACH-WIRE-2, merged at 103d8cf5, DECISIONS:458)
reads rebuild.yml's standing step, resolves `--package S5` to `receipts/S5.json` and fails ENOENT;
coach suite 230/231. rebuild.yml's C5 step globs `rebuild/coach/test/*.test.cjs`, so the GitHub
`rebuild` job on this branch WILL be red at C5 on both OS the moment it is pushed, and the tip's
CI stays red after the fast-forward until `rebuild/coach/engine-revision.cjs` reads
`M2-S5-TODAY-CHILD@<first 16 hex of sha256(receipts/S5.json)>`. This is the trip-wire DECISIONS:456
designed, and S5 cannot carry the fix: the receipt does not exist before the PM's sealed FULL and the
constant is not a file S5 declares. It is a finding because neither the brief (section 5 promises the
coach suite) nor the report (section 6 omits coach) names it. Route: the lane C one-line update lands
on the branch AFTER receipts/S5.json is committed and BEFORE the fast-forward (rebuild/coach/** is
pinned by nothing, so the FULL's re-verify is unaffected). Not blocking: no S5 byte is wrong.

**MINOR 1 - SUP-9, SUP-12 and SUP-15 say "BYTE FOR BYTE" but compare behavioural projections.**
My mutant (section 4), `SCHEMA_V = 60` -> `61` in `rebuild/engine/constants.cjs`, left SUP-9/12/15 green:
their projections (17 readers, 7 genSession/membership days, one mergeState; 3 Date/trap modes) do not reach
SCHEMA_V. Byte identity is held elsewhere - SUP-1, SUP-6, the differential and the runner's inventory all went
red on the same mutant - so nothing is uncovered; the titles overstate. S4 r4's shape; wording, next package.

**MINOR 2 - one em dash in a rebuild.yml comment added by this package** (the `DISCLOSED HUNK` line); not
user-facing, not shipped; the step-name dash was on the tip; spec/artifact dashes are quoted ledger lines.

NOTE 1. The LAWS line `97/104 mutant executions DETECTED - AUDIT RED-FIRST FAIL` is the standing public
baseline (r1 cut a tip control and found the identical line; DECISIONS:459 records it). I did not cut a
second control; S5 declares no law and the line is byte-identical to the author's and r1's.
NOTE 2. The branch is not pushed, so no GitHub Actions run exists at this head. Expect: rebuild job red at
C5 only (MAJOR 1), today step green with the four measure suites, pipeline and shared-preflight green.
NOTE 3. `measure-screen.mjs:69` opens the lane with `import('./measure-host.mjs')`; the A1 bundler inlines it
as a lazy `__esm` chunk in the single app.js (0 `import(`, 0 `http(s)://`, 0 fetch/XHR/WebSocket/share/
sendBeacon/createObjectURL/download/localStorage in all 3 assets), so no runtime request; offline-safe.
NOTE 4. "Sleep nights qualifying (/7)" keeps the /7 label in a partial week (my week 3: 1/7 over six
elapsed days), consistent with the accepted fixture (wk12 "2/7" over 3 of 3 days, P-MEASURE-REVIEW-R3).
Design as accepted at lane level; S5 has no behaviour of its own, so this is an observation for lane C.
NOTE 5. r1's MINOR 2 stands (`local-today-journey.test.mjs:670`, dead `CHILD_SPECS` one name behind), an S6
item correctly left alone. NOTE 6. r1's MINOR 1 is closed: report 119 lines, boundary 48/7, six cells 976 lines.

## 2. Byte identity, recomputed

- 114 declared product files, 114 disk == declared post; roles 81 carried / 9 edited / 1 superseded-by-child /
  23 new. Every `carried` has pre == post == the tip blob at 8b484c09; every declared `pre` equals the blob at
  sourceBase c76fb7f5; every null-pre `new` file is absent at sourceBase. All 90 S4 product pins are declared
  and no carried post differs from S4's. Independent of the runner.
- today-app.cjs disk == `git show 4e0b4837:...` == spec post 016a1e4f096d24e6...; fourteen of the fifteen
  measure files byte-identical to 4e0b4837, the fifteenth (test/boundary.test.mjs) the disclosed amendment,
  diff read line by line: one deepEqual decomposed into three plus one new assertion, none removed.
- rebuild/engine: 45 tracked files, `git diff 8b484c09 HEAD -- rebuild/engine` empty, 0 disk-vs-tip
  mismatches; 18 declared carried, 27 undeclared, all identical to the parent post.
- spec 6d986c5248389f0f... (51187 B), artifact 84e3430ddd851965... (51540 B), brief 5163b634423d0dce...
  (21744 B), runner fdf5f55052b58899... on disk == spec.tooling.runnerSha256; H3/S3/S4.json re-pinned to it.
- Guard chain: setup/food/machine-settings-ui gain the one literal `'S5'` (plus a comment) and lose no
  assertion; pinned-unchanged F6 gains `S5` in both orders, F7 (new) pins CHILD_ROOTS length 8, order, and the
  four properties of each root; b-package.cjs moves IDS, NO_REGISTER_IDS, CHILD_ROOTS and comments only.
- rebuild.yml: exactly two hunks (standing step S4 -> S5; today step gains the four measure suites by exact
  path after the unchanged thirteen); the C5 coach step and everything else byte-identical to the tip.
- Dash/CRLF over the 41 files the branch moves vs the tip: 0 CRLF, 0 BOM; added-line U+2013/U+2014 only in the
  brief, the report, quoted ledger lines in spec/artifact, two F6/F7 test titles and one rebuild.yml comment
  (MINOR 2); zero in the seven measure modules and in today-app.cjs's added lines.

## 3. The three citations, and what the runner refuses

sha256 over the exact line bytes of `git show 8b484c09:rebuild/DECISIONS.md` (LF file, no CR):
:460 = 00f955e7e582812708d7073055da36a73356b61300aee20eca754bd7c3ca4a20 (1193 B) == authorizations.theme;
:461 = 2e84f8499c1b634c4225f7ac6da69e99999541d946175ef71bb7463c15ae10ab (322 B) == brief.acceptedLedgerLine;
:462 = f9de6a7bc0514fd03d640370c07d005dbc91a77e12dc3ead728d5f816f176fdb (639 B) == rulingLineSha256.
The quoted `line` text of :460 and :461 in the spec equals the ledger text character for character. The nine
gates :462 names sort equal to S4's artifact `coverage.superseded` and to S5's own `supersededByCarrier`.
Four scratch commits on the detached HEAD (mutated packages/S5.json, run, `git reset --hard`, all reverted):
- A: one byte of the THEME text, sha left as recorded -> `FAIL LEDGER-LINE-SHA256` before any evidence.
- B: one byte of the BRIEF text with its sha recomputed -> `FAIL RECEIPT-EXACT-LINE-MISSING` (not on the chain).
- C: one hex digit of rulingLineSha256 -> `FAIL GATE-SUPERSESSION-RULING-LINE-SHA256-NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH`.
- D: rulingLineSha256 = the sha of S4's own token line :444 -> `FAIL GATE-SUPERSESSION-RULING-DOES-NOT-NAME-THIS-PACKAGE`.
Nothing but the exact bytes of the three lines, on the chain ref no spec can write, is accepted.

## 4. `--ci --package S5`, supersession, red-first

My own run at HEAD (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York): exit 0, 40 lines, every one read.
SPEC OBSERVED / PARENT OPTION S4 12779767... ACCEPTED at e0c4e3c9 (:449) / PARENT BOUND / ENVELOPE ABSENT /
PARENT PINS RE-ASSERTED (3 + 90 + 1 grandparent) / PRODUCT IMPLEMENTED 33 post, 0 pre, 81 carried, 0 unlisted
drift over all 90 parent pins / FIDELITY / AUTHORITY OBSERVED (theme :460 and brief :461 found on the chain) /
LAWS 45/45 (NOTE 1) / ten CHILD lines OBSERVED exit 0 / COVERAGE 9 SUPERSEDED under DECISIONS:462 /
SUPERSESSIONS 5 carriers over 9 gates / five SUPERSEDED + EVIDENCE pairs / NO-REGISTER OBLIGATION 8 of 8 /
`OPEN closed cumulative profile not sealed` / `PUBLIC CI EVIDENCE PASS`. Nothing OBSERVED is soft beyond NOTE 1.
Artifact reproduction: with a scratch PENDING review-s5-today-child.json (deleted, never committed) the
unmodified runner printed `ENVELOPE PENDING artifact=84e3430d...` (section 6), so the committed artifact IS
the runner's own `proposed()`.
Red-first under MY mutant, `SCHEMA_V = 60 -> 61` in constants.cjs (same length, semantic, no size change):
five s5 cells 11 pass / 5 fail (SUP-1, SUP-2, SUP-6, SUP-8, SUP-16), differential AssertionError naming
`rebuild/engine/constants.cjs`; reverted. Control: one byte appended to today-app.cjs leaves the five cells
16/16 (they measure the engine, as claimed) and the runner refuses `UNLISTED-PRODUCT-DRIFT` in 7 lines before
any child runs; reverted.

## 5. The shipped screen on the REAL route (synthetic, my own scenario, not the fixture)

jsdom over fake-indexeddb via the lane's own support (real setup, reading, food, sleep, gym and measure
lanes; `mountToday` on the approved shell). Fresh enrolled install, day one 2026-06-01, today 2026-06-20.
Real ops: six weigh-ins, thirteen food days (one protein-only), nine nights (one 5 h), eight sets over five
sessions through the accepted workout stack, one waist through the command and two typed into the screen's
own boxes, markers ticked on the pick screen. Rendered table, then hand arithmetic:
```
Week | Weight, 7 day average (lb) | Waist (in) | Waist, 4 week trend (in) | Training adherence (%) | Food logging adherence (%) | Energy logging adherence (%) | Sleep nights qualifying (/7) | Bench Press, estimated 1RM (lb) | Back Squat, estimated 1RM (lb) | Deadlift, estimated 1RM (lb)
Week 1 (run in) | 209.5 lb | 38 in | Not enough data yet | 100 % | 100 % | 100 % | 7/7 | 177.33 lb | 268.33 lb | 308 lb
Week 2 (run in) | 207.5 lb | 37.6 in | Not enough data yet | 66.7 % | 57.1 % | 42.9 % | Not enough data yet | 174 lb | 274.17 lb | 313.5 lb
Week 3 | 206.2 lb | 37.4 in | Not enough data yet | 33.3 % | 33.3 % | 33.3 % | 1/7 | 175 lb | Not enough data yet | Not enough data yet
```
Every cell matches: means 209.5/207.5/206.2; 2 of 3 sessions in week 2, 1 of 3 elapsed in week 3; 4/7 food
vs 3/7 energy where the null-calorie day counts as food only; 2 of 6 elapsed days in week 3; Epley
140x8 = 177.33, 230x5 = 268.33, 280x3 = 308, 145x6 = 174, 235x5 = 274.17, 285x3 = 313.5, 150x5 = 175;
the 5 h night refused by the engine's own rule (1/7); no zero invented for an absent measure.
`Trial day one: 2026-06-01` on screen; `lane.trialStart()` the same; a RELOAD (new page, new lane, same store)
renders the identical week 1 and offers no second marker pick; a LATER day (2026-07-15) keeps day one, keeps
week 1 byte-identical and renders 7 weeks, none invented past the clock. Without an import the screen says
`No baseline yet. Baseline window: the last 8 to 12 complete weeks on the frozen app, taken from the imported
history after the import lands.` and renders no baseline table.
Export: absent until `measure-export` is used, then ONE read-only TEXTAREA equal to the rendered table row for
row (11 lines). Privacy: fetch, XMLHttpRequest, navigator.share, sendBeacon, URL.createObjectURL and window.open
were replaced with recording traps in the window and NONE fired; zero `a[download]`, blob/http anchors, forms
or iframes on the phone; zero U+2013/U+2014 in phone text, export or HTML. Source grep of the seven measure
modules: no network, Storage, cookie, download or clipboard reference; the only `import(` is NOTE 3.

## 6. Tails at this head (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York)

`--ci --package S5` exit 0 `PUBLIC CI EVIDENCE PASS` (my run) - with a scratch PENDING review file
`ENVELOPE PENDING artifact=84e3430d... spec=6d986c52... runner=fdf5f550...` - today 17 by name
`# tests 666 / # pass 666 / # fail 0` - measure hermetic inside shared-preflight `96/96` (model + adherence
= the runner's `# pass 11` child, OBSERVED) - five s5 cells `16/16` - five s4 cells `16/16` -
`ENGINE FILES DIFFERENTIAL: 27 ... all 45 tracked rebuild/engine file(s) stand byte-identical to the parent's
own post` - lane B tooling `91/91` (F7 new) - W6 `rebuild/m3/w6/test` `586/586` - coach `231 tests, 230 pass,
1 fail` (MAJOR 1, engine-revision only) - shared-preflight five files `96/96` - A1 `A1 TODAY BUILD PASS: 3
assets; 121 pinned inputs ... 3/3 assets scanned and free of any network reference; no em/en dash in any text
the athlete can see` - `W7-PREVIEW BUILD PASS: 3 allowlisted assets; 16 approved browser inputs` - A5 `A5 PWA
BUILD PASS: 13 files ... no network reference in any shipped byte; no em/en dash` and pwa tests `56/56` -
`rig187 => PASS`.

S4 r4's structure once more, evidence executed not asserted, citations the exact ledger bytes and nothing else,
and the carried screen does on the real route what lane C's review said. ACCEPT; the PM's --full with the
private census, the receipt line and MAJOR 1's sequencing remain.
