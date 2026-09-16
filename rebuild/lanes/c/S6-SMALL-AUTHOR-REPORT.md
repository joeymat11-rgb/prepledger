# S6-C SMALL ITEMS - AUTHOR REPORT
Branch `rebuild/c-s6-small` off `origin/rebuild/t2-client-core` 0ac72ea (DECISIONS:468). Lane C, author Opus
high. Round 1 six files; round 2 (review R1, section at the end) adds a seventh, `today/gym-app.mjs`. No
`rebuild/engine` byte moves. Every cell is in `rebuild/m3/w7-preview/today/test/problem.test.mjs`: the 13-name
rule holds, no test file was added. THE TAILS AND THE DRIFT LIST BELOW ARE ROUND 1's; round 2's are in its own
section, and where they differ round 2 stands.
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

# ROUND 2 - THE INDEPENDENT REVIEW R1 (REJECT), FINDING BY FINDING
Review file `rebuild/lanes/c/S6-SMALL-REVIEW-R1.md` in the reviewer's worktree, review sha 26691ea. Every
finding below was reproduced here first, then closed, then proved red-first.
## R1-1 BLOCKING, FIXED - the built page printed "Build unknown"
REPRODUCED. `injectCommit()` rewrites the one literal `"commitnotinjected"`, and that literal's only occurrence
IS the declaration of `COMMIT_PLACEHOLDER`; so on the built page `COMMIT_PLACEHOLDER` *is* the sha, and
`commit !== COMMIT_PLACEHOLDER` is false against itself. The page said "Build unknown" while A1 said
`commit c0a4e6c`. FIX, in `problem-report.cjs` and one line long: the footer no longer asks "is this still the
placeholder" - a replace() can always reach the constant that names the placeholder - it asks "is this a
commit": `SHORT_SHA = /^[0-9a-f]{4,40}$/`, the same shape `build.mjs` admits at injection. The placeholder,
"unknown", '' and a non-string all fall to "unknown" because none of them is a sha. THE BUILT BYTES, read back
from `.tmp/w7-today-dist/app.js` at this head and evaluated under node:vm:
    var COMMIT_PLACEHOLDER = "c0a4e6c"; var COMMIT = COMMIT_PLACEHOLDER;
    var COMMIT_UNKNOWN = "unknown"; var SHORT_SHA = /^[0-9a-f]{4,40}$/;
    function buildFooterLine(commit) {
      const named = typeof commit === "string" && SHORT_SHA.test(commit);
      return "Build " + (named ? commit : COMMIT_UNKNOWN); }
    --- WHAT THE SHIPPED PAGE PRINTS: "Build c0a4e6c" ---
## R1-3 MINOR, FIXED - the two assertions that could not fail
They were what should have caught R1-1, so they are replaced by the assertion that does. S6C.7b now lifts the
BUNDLE's own constants and its own `buildFooterLine` out of `app.js` and evaluates them under node:vm, then
asserts the rendered line equals `'Build ' + result.commit` and, when the build named a commit, equals
`'Build ' + commitOf()`. The tautologies (`split(x).length - 1 >= 0`; `includes('Build ')` met by the format
literal) are deleted, not weakened into something else. S6C.7 gains the value rule at its edges: the placeholder
is not sha-shaped, "unknown" is not, uppercase is not (git prints lowercase), three hex characters are not, a
trailing byte is not, an object with a toString is not, and a full 40-character sha is.
## R1-2 MAJOR, FIXED - the gym stub screen was left with an empty heading
REPRODUCED, and the review is right on both counts: `gym-app.mjs` stub() read `view.title || ''`, the fallback
the round 1 report named (`view.title || view.session.instruction.display`) exists at 310/444/466 and CANNOT
serve here - neither the refusal view nor the finished view carries a `session` - and an h1 put to '' is also
HIDDEN by put() and is the element show() then focuses. FIX: stub() takes the heading its caller owns.
The refusal screen is headed `WORKOUT_CANNOT_OPEN` ("Today's workout cannot open"), the recorded screen
`WORKOUT_RECORDED_TODAY` ("Workout recorded"). Both are today-app.cjs's OWN sentences, already in design.cjs's
PREVIEW_RUNTIME_COPY and already checked ABSENT from the approved references, so the screen gains a true heading
and this lane invents no word and adds no copy to bind. Where the engine's stamp IS true of the card's own day
it still wins, unchanged.
NEW CELL S6C.6d, and it is the only cell this round adds: a REAL boot on the fixture's REFEED day (the S6C.6c
day, title null) mounted on the shipped template - the painted h1 is not hidden, is not empty and names no other
day - then both stub screens at the exact DTOs gym-model returns, pinned by name, then the headed case.
## R1-4 MINOR, NOT FIXED, STATED - the build embeds HEAD, so a docs-only commit rotates the PWA cache
Correct and reproduced: `app.js` bytes are now a function of HEAD, so every commit changes the asset hash and
the sw cache name, and the round 1 A5 tail does not reproduce at a different commit. This is the price of
DECISIONS:468 (b) and is not removable while the page names its commit: the bytes DID change, and a cache name
that did not rotate while the bytes changed would serve stale bytes to installed clients, which is the worse
failure. The build id beside it already had the same property (it is a hash of the inputs). What a reader
should take from it: a build tail is reproducible AT A COMMIT, not across commits. Nothing here is asserted
against a fixed cache name; the A5 cell pins the derivation, not the value.
## R1-5/6/7 MINOR, FIXED
(5) `RESUME_TODAYS_WORKOUT` now spells its apostrophe U+2019, as the rest of the screen does, with the cell
asserting the new bytes and that no ASCII apostrophe survives. (6) the dead-export comment in
`local-today-journey.test.mjs` now names FOUR chain-reader copies with their line numbers, including
`measure/test/boundary.test.mjs:83`, which round 1 missed. (7) the stale A4 residual comment at
`today-app.cjs` ~2200 is replaced by what is now true: S6 item 1 closes that residual for the LIVE page only,
and every fixture, suite and check still boots into what it always did.
## Round 2 red sides (each applied, run, reverted; tree clean after)
M6 restore the old footer predicate `commit !== COMMIT_PLACEHOLDER`: S6C.7 AND S6C.7b red, the latter verbatim
`AssertionError: the SERVED page prints the commit the build named / + 'Build unknown' - 'Build c0a4e6c'` -
the review's finding, now caught by the cell that missed it. M7 restore `view.title || ''` in stub():
S6C.6d red on the REAL boot assertion, `a heading put to the empty string is HIDDEN, and is what show() focuses`.
## Round 2 verbatim tails (this worktree, Node 24, junctions only, no npm)
today-17 (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York), split in two runs as before: part A (adapter,
catalogue, checkin, copy, design, food, gym) `tests 276 / suites 0 / pass 275 / fail 1`; part B (the other six
today files + the four measure suites) `tests 403 / pass 399 / fail 4` => `tests 679 / pass 674 / fail 5`
(+1 test on round 1: S6C.6d). THE FIVE REDS ARE THE SAME FIVE, unchanged in name and in content: food N1.18,
measure/boundary P-MEASURE (g), machine-settings-ui S10, setup re-pin x2 - one guard asking "does a package on
this branch declare these bytes", closed by packages/S6.json. P-MEASURE (g)'s actual list is byte-identical to
round 1's four names, because the S4-sealed set it watches is S5's declared set.
W6 `tests 586 / pass 586 / fail 0`. coach `tests 231 / pass 231 / fail 0`. client `tests 18 / pass 18 / fail 0`.
lane B tooling `tests 91 / pass 91 / fail 0`. measure hermetic (model, adherence) `tests 11 / pass 11 / fail 0`.
rig187 `rig187 ⇒ PASS`.
A1 `A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-911ef8a63a78; commit
c0a4e6c; approved design pinned; 69 bound classes; 2 pinned typefaces inlined; no literal figure in the
template; 3/3 assets scanned and free of any network reference; no em/en dash in any text the athlete can see`
A5 `A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256; cache name
earned-slice-7bb762b085426ad212b2f4153d4eb50e derived from those bytes (no version constant); 13 exact header
rules, no-store on sw.js; ... no em/en dash in any text this build emits` - a different cache name from round
1's, which is R1-4 above, not a regression. BOTH BUILD TAILS WERE TAKEN AT c0a4e6c, the parent of the round 2
commit, for the plain reason that a commit cannot contain a build of itself. By R1-4 the `commit` field, the
build id and the cache name all move with HEAD: re-run A1 at the head under review and compare its `commit`
with `git rev-parse --short HEAD`, not with the bytes printed here.
## Round 2 drift (git diff --name-only 0ac72ea HEAD, each findstr'd against packages/S5.json)
EIGHT paths. PINNED BY S5 (4), unchanged from round 1: `m3/w6/test/local-today-journey.test.mjs`;
`today/today-entry.mjs` (untouched this round); `today/today-app.cjs`; `today/test/problem.test.mjs`.
NOT IN S5 (4): `today/build.mjs` (untouched this round); `today/problem-report.cjs`; `today/gym-app.mjs` (NEW
this round, R1-2); and this report. No new file under `today/test`, no engine byte, nothing outside lane C's
custody. `b-package --ci --package S5` stays the expected red (WORKTREE-SOURCE-PIN / SEALED-PROFILE-
RECOMPUTATION, DECISIONS:455/:467); this work lands inside the S6 reseal.
Hygiene, round 2 added lines across the five edited source files: 0 CRLF, 0 U+2013/U+2014.
