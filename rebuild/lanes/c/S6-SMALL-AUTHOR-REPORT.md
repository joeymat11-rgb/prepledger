# S6-C SMALL ITEMS - AUTHOR REPORT
Branch `rebuild/c-s6-small` off `origin/rebuild/t2-client-core` 0ac72ea (DECISIONS:468). Lane C, author Opus
high. Six files, +552/-36. No `rebuild/engine` byte moves. Every cell is in
`rebuild/m3/w7-preview/today/test/problem.test.mjs`: the 13-name rule holds, no test file was added.
## 1 SETUP FIRST ON A FRESH INSTALL (owner ruling DECISIONS:463 verbatim)
`today-entry.mjs` boot(): one new local `setupFirst`, handed to mountToday, defaulting to `!!live` - and `live`
is non-null for exactly one caller, the shipped page, which declares no day. `today-app.cjs` mountToday reads
`options.setupFirst`; the landing line becomes
`render(requestedScreen() || (setupFirst && firstRun() ? "setup" : "today"))`. Nothing else moves: setup writes
as before; the P0-B/P0-C adoption gate and the S13 refusal of the setup route on an enrolled device are
untouched; a device with no store or in RESTORE_REQUIRED has `firstRun() === false`. THE PREVIEW PATH IS KEPT by
S4's own frozen-day trick - a caller that DECLARES its day keeps it, and every fixture, check and suite in the
tree declares one, so NO existing cell had to be amended and none was; `?screen=today` on the live page and
`options.setupFirst` reach it explicitly.
Cells: S6C.1 fresh store boots to setup screen 1, no sample figure; S6C.2 enrolled store boots to Today and
?screen=setup still refuses; S6C.2b no store and declared-day land where they always did; S6C.3 completing setup
lands on Today with his own empty records and no sample figure (P0B.12's forbidden list re-run on the new
landing); S6C.4 reload after setup boots to Today.
## 2 SAMPLE LABEL
`today-app.cjs`: `SAMPLE_DATA_NOTE` = "Sample data. Set up your week to start your own." and
`sampleNote(map, root)`, called from renderToday. Shown exactly while `firstRun()` is true - the record says
never set up, so every figure on the frame is the fixture's; with no setup lane the page cannot know and does
not guess, as setupTile already behaves. Built in code, not added to the approved template, the way the Measure
tile already is, and inserted BEFORE the root-level block carrying the first figure. Cells: S6C.5 present on the
preview path, exact text, no dash; S6C.5b compareDocumentPosition proves it sits above the kcal figure, and it
is absent on the boot frame, the settled frame after adoption and every repaint after.
## 3 LATE-EVENING HEADER (DECISIONS:452, :468 (d)) - MECHANISM
Not the day boundary, not the hour, not S4's real-day resolution. `nowModel.workout`
(rebuild/engine/today.cjs:591-597) is the NEXT SCHEDULED SESSION: the engine walks k9 = 0..6 from its own day
and stamps the title "· TODAY" at k9 0, "· TOMORROW" at k9 1, "· MON 9/21" after. It is a pure function of the
calendar day and the split with no hour in it, and at 23:59 the page resolves the correct local day (S6C.6
proves both, at 23:59 and at 00:01 across a local midnight). What was wrong is that two surfaces that act on
TODAY reused that next-session string as the name of the session in hand: the gym card's header
(`sessionTitle`, captured once at boot and printed on every frame by gym-model.read()) and Today's Resume CTA.
On 2026-09-16, a Wednesday and the fixture's REFEED day, the ENGINE schedules nothing while the CLIENT still
prepares a session from the planned split slot, so the correct lift was logged under "UPPER BODY · TOMORROW"
and Resume said TOMORROW too. Day boundary and session membership are two questions; only the second says what
is being shown. FIX, page-side only, no engine byte and no invented lift name: `today-entry.mjs` createWorkoutEntry passes
`sessionTitle` only when `view.workout.today === true`, else null, so gym-app.mjs's EXISTING fallback
(`view.title || view.session.instruction.display`) names the session actually being logged; `today-app.cjs`
gains `resumeLabel(workout)` / `RESUME_TODAYS_WORKOUT` - the engine's words verbatim where the stamp describes
today, "Resume today's workout" where it does not. Start is untouched: it is offered only when the engine HAS a
session today, so its stamp is already TODAY. Cells: S6C.6; S6C.6b (the stamp on both days, hour-independence,
both CTA branches, four resumeLabel edge cases); S6C.6c (the card is headed with the stamp only on a day the
stamp describes, driven over a real store).
## 4 BUILD ID IN THE FOOTER (DECISIONS:468 (b))
`problem-report.cjs`: `COMMIT_PLACEHOLDER` / `COMMIT` / `COMMIT_UNKNOWN` and the pure `buildFooterLine(commit)`.
`build.mjs`: `commitOf()` runs `git rev-parse --short HEAD` and returns "unknown" on any failure;
`injectCommit()` refuses zero or more than one occurrence and refuses a value that is not a short sha - the
build id's own rule, said again. `today-app.cjs` renderToday appends `[data-slot="build-id"]` last, after the
Measure tile. Cells: S6C.7 (footer present, "Build unknown" unbuilt, both shape branches, commitOf on a
non-repository); S6C.7b (the built app.js carries the commit and never the placeholder, three injectCommit
refusals, the asset allowlist the PWA precaches unchanged).
## 5 DEAD EXPORT
`rebuild/m3/w6/test/local-today-journey.test.mjs`: `CHILD_SPECS` / `declaredPostIn` DELETED. Nothing in the tree
imported them; the three guard cells that read the chain (today/test food, machine-settings-ui, setup) each hold
their own copy, already at ['H3','S3','S4','S5'] while this one still stopped at S4, and making it shared would
mean three test files importing a test module and re-running this suite inside each. No assertion moved.
PAGE_PINS re-pinned for today-entry.mjs (a4a4041d...), with the re-read the pin's own message requires.
NOT IN THIS TICKET, as ordered: P3-STAGE gap 3 (today-bindings.mjs:197 frozen-day tz).
## Verbatim tails
today-17 (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, the 17 files rebuild.yml names):
`tests 678 / pass 673 / fail 5`; baseline on the unmodified worktree `tests 666 / pass 666 / fail 0`.
problem.test.mjs alone `tests 129 / pass 129 / fail 0` (18 new). W6 `tests 586 / pass 586 / fail 0`. coach
`tests 231 / pass 231 / fail 0`. client `tests 18 / pass 18 / fail 0`. measure hermetic (model, adherence)
`tests 11 / pass 11 / fail 0`. lane B tooling `tests 91 / pass 91 / fail 0`. rig187 `rig187 ⇒ PASS`.
A1 `A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-f6d049be68e4; commit 0ac72ea; ...`
A5 `A5 PWA BUILD PASS: 13 files ...; 11 precached and pinned by sha256; cache name earned-slice-7f1a05ecbbdeb94861fcf73ab77c3deb ...`
b-package --ci --package S5 `B PACKAGE S5 FAIL SEALED-PROFILE-RECOMPUTATION` - EXPECTED (DECISIONS:455/:467);
this work lands inside the S6 reseal.
## Drift (git diff --name-only 0ac72ea HEAD, each findstr'd against packages/S5.json)
PINNED BY S5 (4): m3/w6/test/local-today-journey.test.mjs; today/today-entry.mjs; today/today-app.cjs;
today/test/problem.test.mjs. NOT IN S5 (2): today/build.mjs; today/problem-report.cjs - S5 pins
rebuild/m3/w7-preview/build.mjs, a different file, and no spec on the chain names these two, which is why the
seal guards list only the four above. Plus this report, unpinned by every package. The five red cells are one
guard asking "does a package on this branch declare these bytes": measure/test/boundary.test.mjs P-MEASURE (g);
food.test.mjs N1.18; machine-settings-ui.test.mjs S10; setup.test.mjs re-pin x2. Each names the undeclared
paths and closes when packages/S6.json declares them. Nothing was weakened or removed to reach that state.
## Stops
None. No engine, ledger, private or soak path was opened.
