# P3-IMPORT-UI-2 - the Import route on the shipped page (lane C author, round 4)

DECISIONS:475 (1) and (4); screen :470 and :480 RULING 1 AS THE PM AMENDED IT IN ROUND 4 (the entry
lives on Measure's "No baseline yet" line AND on Today, BOTH gated on an enrolled installation; no
entry at setup's end); constraints :472 (a)-(d); carries :477. BASE, REBASED THIS ROUND:
origin/rebuild/d-p3-replay-measure 47a223d (the F7 replay family), not d-p3-followons 26ab3ab.
FILES, 17 against that base (the six S5-declared are named in section 4). NEW (6):
`import/import-screen.mjs` (the route, and the ONE module the law lets reach migrate/merge/
m4-import); `route.test.mjs` (6 cells), `refusal-route.test.mjs` (11), `edge-route.mjs` +
`edge-seed-entry.mjs`; this report. UNPINNED (5): `build.mjs`, `preview.css` (16/48/44),
`P3-RUNBOOK.md`, `page-bundle.test.mjs`, `import/test/support.mjs`. `setup-app.mjs` is shipped bytes.

## 1. The law, the route's rules, and the bundle
FORBIDDEN is split: `IMPORT_ROUTE_ONLY` holds migrate.cjs, merge.cjs and `m4/import/*`, the OLD
reason kept above the new one (the page reads migrated state EXCEPT on this route, which must
reproduce the PC's walk before adopting a byte); every other name keeps its ban.
`assertImportRouteIsolation`, RUN BY THE BUILD, walks from `today-entry.mjs` over STATIC edges only,
refuses if any of the three is reachable (naming file and importer), requires one dynamic importer.
ON THE ROUTE: unseal and qualify are WRITE-FREE, the identity question is asked before the first
write and held byte for byte (source-admission.mjs:96), the PRODUCTION registry is bound, every
figure is a labelled machinery field, refusals print the code verbatim and ONCE (one added sentence,
for `BUNDLE_AUTH_FAILED`), any refusal or cancel after custody retracts, nothing leaves the page.
A1 at HEAD: 3 assets, 137 pinned inputs; Today BOOT graph 121 modules, UNCHANGED. The route costs
16 modules (round 2's 15 plus measure-replay.cjs), route-only by P3-B4, weighed by P3-B5.
DEVIATION, PM-owned: the ticket says "chunk", but the accepted bundler answers a dynamic import in
an `outfile` build with a lazily initialised module in the SAME file; what is enforced is that the
boot path never RUNS a byte of it (one `init_import_screen()` call site, P3-B6) and that the asset
is precached (P3-B7).
ROUNDS 1-2: neither entry could admit on a phone, so round 2 moved the admitting entry to Today and
pinned both refusals; R2 ACCEPTED with one PM-only MAJOR, R3 REJECTED on two executed defects.

## 2. Round 4 - the rebase, and every finding
REBASE: ONE conflict, `page-bundle.test.mjs`, where the family and this ticket had each re-measured
the same probe. Resolved by keeping BOTH measurements in place: the graph is 138 (133 + the family's
one + the route's four); the family's `m4/import` list keeps `measure-replay.cjs` inside this
ticket's new law cells, so it is eight names; the route-only set is 16. The family's delta assertion
(13) is carried, re-measured and RE-REASONED where it stood: here the probe's baseline already
reaches the whole route through the dynamic edge, so a static import adds only the probe entry and
the delta is 1 - which is why P3-B3/B4 prove isolation, not presence. Nothing was dropped.
R3 MAJOR 1 (the Today link on an unenrolled installation) - FIXED: `renderToday` and `renderMeasure`
paint `importLink` only when `!firstRun()`. P3-U5 is rewritten around the frame the trap was on: the
unenrolled TODAY frame paints no entry, no setup screen does, nothing on that page routes to the
import, and the walk it would have started is still executed once, forced open, to show what the
gate is worth (custody taken, refused, a permanent retraction). The entry appears with the first run.
R3 MAJOR 2 (no way to pick another file after BUNDLE_AUTH_FAILED) - FIXED: `resetDraft()`. Back
without custody, and every later tap on an entry link (`reopen()`), return the route to the chooser
with no stale refusal and no retained bytes. P3-X10 is re-reasoned onto this defect and walks a
damaged file then a good one in ONE page session, `holdingBytes()` false throughout.
R3 MINOR 3 (stale "Working." beside a refusal) - FIXED in `fail()`; cell P3-X11. R3 NOTE (bundle
bytes retained) - FIXED: `opened` is dropped on admission, asserted by P3-X10.
R3 MINOR 4 (the Edge 44 px race) - FIXED: the height is read over two consecutive animation frames
with the same rect; the settled 44 px is now a recorded label.
R3 MINOR 5 (runbook) - the do-not-open-Measure pre-check is WITHDRAWN (the family admits, P3-X9); in
its place, do not open Sleep before importing, because `sleep-commands.cjs` writes class "sleep" and
`source-admission.mjs` replay() has no family for it - a READING of those two files, said to be one
and not an executed cell, lane D's fix in flight. Step 4 now says to pick again when the FILE is the
problem; step 6 says what the screen paints (the code alone, the return to step 1, "Files you took
back" as the receipt) instead of promising a sentence it does not print.
R2 MINOR 4 (stale first Today frame) - FIXED, and not by making renderToday async: the entry is
painted once the adoption chain has ANSWERED (`settleAdoption`/`paintTodayEntry`), onto the Today
frame still mounted; with no chain running the flag is already final and it is painted in the same
frame, so pages that never adopt are unchanged (today-17 problem.test N2-05 measures that). Proved
on a reopened admitted device in P3-U3.
R2 MINOR 5 (second import proved by importBundle) - ANSWERED, differently: after admission the ROUTE
opens no second door at all, on that page session or a fresh one, so P3-U3 asserts the ABSENCE of
every control a second attempt needs, from both links, and keeps the machinery's three codes
underneath, labelled as the machinery's. DEVIATION from the ticket's wording: with both entries
gated and the route read-only after admission there is no reachable path on which the screen can
paint that refusal, so the honest route-level fact is the closed door.
STEP 4, THE POSITIVE ONE-STORE CELL: P3-X9 and P3-X10 asserted the Measure collision, gone on this
base, so both are re-reasoned with the new reason written where the old assertion stood, naming what
it used to say and why it is subject-less rather than stale. P3-X9 is now ONE positive cell: one
IDBFactory, one installation through `gym-host.mjs openTodayHosts`, first run saved, Measure looked
at until the markers pick paints, then the tap and the whole walk - ADMITS; Today, the gym card and
the baseline column carry his history, the measure ops are untouched, trial day one is unmoved.

## 3. Tails (TZ=America/New_York), drift and open items
DRIFT vs 47a223d: 17 files, SIX S5-declared - `today-app.cjs` (the two gates, settleAdoption/
paintTodayEntry, the chain armed before the done-callback's paint), `today-entry.mjs`,
`local-today-journey.test.mjs`, `package.test.cjs`, `boundary.test.mjs`, `copy.test.mjs` (those five
unchanged this round). No engine byte, no src/, no ledger, no w6 product byte; exactly one added
line carries an en/em dash, the dash detector's own regex; LF only.
TAILS: import/test `35/35/0`; retract `13/13/0`; p3-replay-measure `9/9/0`; production-* `24/24/0`;
local-source-consumer `6/6/0`; m4/import `86/86/0`; W6 `586/586/0`; w6/host `42/42/0`;
local-today-journey `51/51/0`; port `65/65/0`; coach `231/231/0`; client `18/18/0`; A5 suites
`56/56/0`; today-17 (MEASURED_TEST_NOW=2026-09-03) `667/662/5`, the five sealed-byte declaration
reds and nothing else; `rig187 => PASS`. A1 `A1 TODAY BUILD PASS: 3 assets; 137 pinned inputs (15
engine, 12 client); build earned-1b924c85bd83; Today boot graph 121 modules, carrying no
migrate.cjs, no merge.cjs and none of the m4/import lane`. A5 `A5 PWA BUILD PASS: 13 files; 11
precached and pinned by sha256`. `b-package --ci --package S5` exit 1, `B PACKAGE S5 FAIL
SEALED-PROFILE-RECOMPUTATION`, expected here and landing in S6. Edge `P3 EDGE-ROUTE PASS - the
shipped A1 dist, real msedge.exe, real clock, America/New_York, 16 labels recorded`, engine
revision `M2-S5-TODAY-CHILD@0df73b01f3d2d935`.
OPEN ITEMS. 1. The "chunk" deviation (section 2). 2. Class `sleep` has the hole the measure class
had; the runbook says so, lane D owns the family, not executed here. 3. P3-U1/U2/U3/U4 still hand
the measure lane a SEPARATE IDBFactory and say so in place; P3-U6 and P3-X9 are the one-store cells.
4. Opening Measure writes TWO trial-start operations on the first render, not one: a measure lane
defect found here, reported, untouched. 5. edge-route.mjs needs W6_BROWSER_BIN and the w6
playwright-core; `import/test/*.test.mjs` is still absent from rebuild.yml (S6's, :476). 6. The
second-import route deviation above.
