# TODAY-SPLIT-SPEC - splitting `today-app.cjs` so the drawing half is free and the saving half stays sealed

Lane C, ticket TODAY-SPLIT-SPEC. Author: cowork (Earned lane hand, lane C). Branch `rebuild/c-today-split`,
cut from the chain tip `724ef3f`. SPEC ONLY: this round authors this one file and moves no product, test,
tooling or workflow byte. Every line number in this document is read at `724ef3f` unless it names another ref.

Read before this: `DECISIONS.md:536` (the owner's release and its rule "a file that both renders and writes
stays SEALED until it is split"); `rebuild/lanes/b/S9-RELEASE-SPEC.md` sections 0, A and D, and its reviews
`S9-RELEASE-SPEC-REVIEW-R1.md` and `-R2.md`; `rebuild/lanes/c/ui-port/C-UI-1.md` .. `C-UI-8.md`;
`rebuild/m1/approved-2026-09-18/states/STATE-INVENTORY-DRAFT.md`.

**The one sentence.** `today-app.cjs` is 2625 lines, of which 2274 are the body of ONE function,
`mountToday` (`:352` to `:2620`), and everything the file does - drawing and saving alike - is a closure
over the 60 bindings that function opens. The split is therefore not a file cut, it is the construction of
an explicit interface where today there is a shared scope. That is the whole difficulty, it is measured in
section A.3, and the design in section B is built around it.

**What I found that changes the answer.** The saving code and the drawing code are already almost
separated, by two earlier review rounds that had nothing to do with this ticket: every durable write lives
in a NAMED async function (`recordIntake`, `recordSleep`, `retryFoodRead`, the weigh-in submit listener,
`rebindWorkout`, `adoptAthleteState`), and `recordSleep` was already forced, by D2 round 1 finding 6, to
report through STATE (`sleepErrorText`) rather than through a DOM node. There are exactly THREE lines in
the whole file where a writer touches the DOM directly: `:1076`, `:1283`, `:1306`. Those three lines are
the entire residue of the cut, and section C measures what they cost the look tickets.

---

## A. THE MAP

### A.0 Method, and what I did not do

I scanned both files with a hand-written tokenizer (strings, template literals including their `${}`
expressions, comments and regex literals masked out; brace depth tracked on the masked text; function
declarations, function expressions and arrow bindings located in the masked text and their bodies matched
by brace balance). The repository has NO general JavaScript parser in `node_modules` - `esbuild` is there
but exposes no AST - so a parser was not an option in this lane, and the tokenizer's output is a hypothesis
I then checked by hand against every region in the tables below. `esbuild`'s metafile IS a real parser's
output for the IMPORT graph, and section E uses it for exactly that and for nothing else.

I ran no test suite, no `b-package.cjs` and no build: this lane is spec only.

### A.1 `today-app.cjs`: the twelve regions above `mountToday`

| lines | name | class | note |
|---|---|---|---|
| `:1-:34` | header comment and the five `require`s | - | `today-model.cjs`, `plain-copy.cjs`, `problem-report.cjs`, `food-model.cjs`, `sleep-model.cjs`. None is a host or a lane |
| `:36-:43` | `NUMBER`, `ARROW`, `NOT_AVAILABLE`, `amount`, `pounds`, `localDate`, `dayLabel` | DRAWS | pure formatters and one SVG string |
| `:45-:57` | `calorieHeadline`, `calorieBand` | COMPUTES | pure, from the engine's band |
| `:59-:74` | `morningLine`, `trendLine` | BINDS READ-ONLY | reads a `view`, formats |
| `:76-:89` | `NOT_WIRED`, `athleteStateFailureCopy` | DRAWS (copy) | |
| `:91-:305` | the copy constant block: problem report, food (`:102-:147`), sleep (`:148-:222`), problem (`:223-:225`), workout (`:227-:305`) | DRAWS (copy) | about 120 frozen strings and two frozen refusal maps |
| `:306-:321` | `resumeLabel`, `setupNoteNeeded` | COMPUTES | pure |
| `:330-:343` | `fitHeadline` | DRAWS | measures and sets a CSS custom property |
| `:352-:2620` | `mountToday` | MIXED | section A.2 |
| `:2622-:2625` | `module.exports` | - | 100 names, almost all copy constants |

Nothing above `:352` writes, opens a lane, or touches a host. **The whole 351-line prologue is free.**

### A.2 `mountToday` (`:352-:2620`), region by region

DRAWS = builds DOM or HTML, styles, copy. BINDS = reads a model or closure state and formats.
WRITES = calls a durable writer, opens an IndexedDB lane or a host, mints or stores anything,
`adoptBasis`, `rebase`, `logSet`. COMPUTES = derives an athlete value.

| lines | name | class | the deciding line |
|---|---|---|---|
| `:353-:355` | `phone`, `status`, `chrome` element handles | DRAWS | `doc.getElementById` |
| `:362-:392` | the injected entries: `workout`, `checkin`, `setup`, `installation`, `setupFirst`, and the readers `session`, `checkinSummary`, `firstRun` | BINDS | they hold hosts but call only `summary()` / `firstRun()` |
| `:410-:476` | the food and sleep lane state: `foodLane`, `foodOpening`, `foodSaving`, `foodLaneFailure`, `foodReadBack`, `sleepLane`, `sleepOpening`, `sleepSaving`, `sleepLaneFailure`, `sleepReadBack`, `sleepAck`, `mountToken`, `disposed`, `sleepBusy`, `sleepNightChoice`, `sleepRollover`, `sleepCorrecting`, `sleepOpenedNight`, `sleepOpenedDay`, `sleepErrorText`, `sleepUnknown`, `sleepCheckInDay/Row/Pending/Failed/ViewPending`, `sleepDraft` | SHARED STATE | section A.3 |
| `:478-:481` | `clearSleepDraft` | BINDS | resets `sleepDraft` |
| `:484-:503` | `sleepEntryFor(host, rows)` | **WRITES** | `:493` `await host.save(night, precondition)` |
| `:507-:508` | `sleepRowsMatter` | COMPUTES | |
| `:510-:541` | `openSleepLane` | **WRITES** | `:513` reads `view.indexedDB` / `globalThis.indexedDB`; `:518` `createSleepHost({ day, indexedDB, crypto })` |
| `:551-:566` | `checkInKit`, `checkInKitLoading`, `checkInLive`, `loadCheckInKit` | **WRITES** | `:1416` region opens the check-in lane over IndexedDB |
| `:569-:591` | `foodEntryFor(host, rows)` | **WRITES** | `:581` `await host.save(day)` |
| `:593-:618` | `openFoodLane` | **WRITES** | `:596-:601` reads `indexedDB` and calls `createFoodHost` |
| `:628-:643` | `measureScreen`, `measureState`, `measureDeps` | **WRITES** | `:637` hands the measure screen this device's `indexedDB` and `crypto` handles |
| `:645-:680` | `renderMeasure` | DRAWS | `:646` `doc.createElement`; awaits the measure screen's own paint |
| `:688-:701` | `importScreen`, `importAdmitted`, `importDeps` | **WRITES** | `:699` `onAdmitted: () => adoptAthleteState()`; hands `installation` and `crypto` over |
| `:703-:721` | `renderImport` | DRAWS | `:704` `doc.createElement`; `:713` the one dynamic import the page's input law treats as a door |
| `:729-:748` | `IMPORT_LINK_NEW`, `IMPORT_LINK_DONE`, `importLink` | DRAWS | builds a button, `render("import", true)` |
| `:767-:790` | `adoptionSettled`, `todayEntry`, `paintTodayEntry`, `settleAdoption` | DRAWS + BINDS | `:769-:774` paints the entry; `:775-:790` settles a promise and calls `tell()` |
| `:792-:799` | `screen`, `checkinOrigin` | SHARED STATE | the router's own cursor |
| `:803-:836` | `capitalise`, `template`, `slots`, `put`, `arrows`, `wire`, `show`, `tell` | DRAWS | the whole drawing primitive set. `:826` is the `[data-go]` router binding |
| `:839-:1025` | `renderToday` | DRAWS | 187 lines. One exception: the primary click handler at `:948-:957` calls `await workout.recover()` at `:954` |
| `:1028-:1083` | `openWeighIn` | DRAWS, with a 16-line writer inside | the sheet is drawn `:1028-:1058`; the submit listener `:1059-:1082` calls `await model.weighIn(...)` at `:1072` and writes `error.textContent` at `:1076` |
| `:1086-:1110` | `renderWhy` | DRAWS | |
| `:1120-:1197` | `readOrNoTargets`, `renderNutrition` | DRAWS | |
| `:1204-:1274` | `foodEntry` | DRAWS | wires `:1272` `save.addEventListener("click", ...)` to `recordIntake` |
| `:1278-:1319` | `recordIntake` | **WRITES** | `:1293` `await foodLane.save(dayValues)`. Draws at `:1283` and `:1306` |
| `:1324-:1334` | `retryFoodRead` | **WRITES** (lane call) | `:1326` `await foodLane.refresh()`. A read, but on the lane handle |
| `:1339-:1365` | `reasonOf`, `intakeLine`, `dayOf`, `provenanceLine` | BINDS | pure formatters over a refusal or a row |
| `:1373-:1378` | `sleepToday`, `sleepNightDate`, `sleepTyped` | BINDS | read the lane's `host.today()` and the draft |
| `:1384-:1393` | `sleepClockCheck` | COMPUTES | |
| `:1396-:1409` | `sleepQualityFor`, `sleepCheckInFor` | BINDS | |
| `:1410-:1427` | `readSleepCheckIn` | **WRITES** | `:1416` opens the check-in lane over IndexedDB |
| `:1428-:1446` | `renderSleepCheckIn` | DRAWS | |
| `:1450-:1483` | `sleepOpsFor`, `checkInHoursOf`, `sleepCheckInOffer` | BINDS | |
| `:1485-:1505` | `renderSleep` | DRAWS | |
| `:1509-:1723` | `sleepEntry` | DRAWS | 215 lines, the largest drawing region in the file. Wires `:1721` to `recordSleep` |
| `:1727-:1756` | `retrySleepRead` | **WRITES** (lane call) | asks the lane to read again |
| `:1761-:1803` | `sleepEstimate`, `sleepSourceLine`, `checkinDateFor`, `sleepStamp` | DRAWS + BINDS | |
| `:1807-:1930` | `recordSleep` | **WRITES** | `:1843` `await sleepLane.save(night, { supersedes })`. **Touches no DOM node at all**: it reports through `sleepErrorText` and `render("sleep", false)` |
| `:1935-:1954` | `sameNight`, `committedSleepAttempt`, `sleepState` | BINDS | |
| `:1964-:2011` | `reboundCheckIn` | **WRITES** | rebuilds the check-in over the live lane |
| `:2018-:2036` | `carryCheckInDraft` | BINDS | carries a draft across a rebind |
| `:2048-:2092` | `workoutRebindQueued`, `rebindWorkout` | **WRITES** | `:2052` reads `view.indexedDB` and `view.crypto`; `:2059` `import("./today-entry.mjs").then(entry => entry.createWorkoutEntry(...))` |
| `:2094-:2106` | `renderStub` | DRAWS | |
| `:2111-:2162` | `setupTile`, `sampleNote`, `setupNote` | DRAWS | |
| `:2182-:2237` | `laneHandles`, `installationDevice`, `problemState`, `problemControl` | DRAWS + BINDS | `problemControl` builds the control and copies a diagnostic |
| `:2244-:2254` | `nutritionState`, `recoveryState` | BINDS | |
| `:2260-:2270` | `renderCheckInWithoutStore` | DRAWS | |
| `:2272-:2376` | `render` | DRAWS (router) | `:2289-:2293` mount-token bookkeeping; `:2295-:2334` the setup route, whose `done` callback at `:2317-:2333` calls `armAdoptionGate()` and `adoptAthleteState()` |
| `:2387-:2391` | `onPhoneKeydown` and its `addEventListener` | DRAWS | |
| `:2409-:2414` | `requestedScreen` | BINDS | reads `?screen=` |
| `:2430-:2439` | `canAdoptAthleteState`, `armAdoptionGate` | **WRITES** | `:2436` `model.setPendingAdoption(true)`; `:2438` `workout.gym.holdForAdoption(true)` |
| `:2440-:2441` | `willAdopt` and the arm | **WRITES** | boot statement |
| `:2453` | `render(requestedScreen() || ...)` | DRAWS | the first paint, a boot statement |
| `:2482-:2489` | `athleteBasisState` | **WRITES** | `:2483` `import("./local-source-basis.mjs")`; reads `setup.athleteState()` |
| `:2490-:2546` | `adoptAthleteState` | **WRITES** | `:2494` `model.adoptBasis(state)`; `:2501` `await workout.gym.rebase()` |
| `:2550` | `ready` | BINDS | |
| `:2552-:2619` | the returned api object, including `dispose()` at `:2604-:2610` | BINDS | 20 getters over closure state |

Counted: **17 WRITES regions**, about 560 lines. **DRAWS and BINDS: about 1700 lines.** The file is roughly
three quarters drawing by line count, which is what makes the split worth doing.

### A.3 THE REAL DIFFICULTY: every binding that crosses a DRAWS region and a WRITES region

This is the list the ticket asks for, and it is the acceptance test of any proposed cut. Each row is a
binding declared in `mountToday`'s scope that is READ in a DRAWS region and WRITTEN in a WRITES region, or
the reverse. A binding that only one side touches is not here.

| binding | declared | written by | read by | how the cut must handle it |
|---|---|---|---|---|
| `foodLane` | `:410` | `openFoodLane` `:593`, boot | `foodEntry` `:1220`, `recordIntake` `:1293`, `renderNutrition` | stays sealed; the view is given `food.openedRefusal` as DATA |
| `foodOpening` | `:411` | `openFoodLane` | `renderNutrition` `:1180`, api `foodReady` | sealed; passed into the view-model as a boolean |
| `foodSaving` | `:412` | `foodEntry` `:1272` (assignment of the promise), `retryFoodRead` wiring `:1268` | api `foodPending` | **CROSSES BOTH WAYS.** The view currently ASSIGNS a promise into sealed state. Cut: the view calls `on.recordIntake()` and the sealed half assigns |
| `foodLaneFailure` | `:415` | `openFoodLane` | `renderNutrition` | sealed; a view-model field |
| `foodReadBack` | `:421` | `recordIntake` `:1310-:1313`, `retryFoodRead` `:1328-:1332` | `foodEntry` `:1250-:1266` | sealed; a view-model field (an object, cloned on the way out) |
| `sleepLane` | `:432` | `openSleepLane` | `sleepEntry`, `sleepToday` `:1373`, api `sleepLane` | sealed |
| `sleepOpening`, `sleepSaving`, `sleepLaneFailure` | `:433-:435` | `openSleepLane`, `sleepEntry` `:1721` | `renderSleep` `:1493`, api | same shape as the food three |
| `sleepReadBack` | `:436` | `recordSleep` `:1913` | `sleepEntry` `:1657-:1668`, `:1719` | sealed; view-model field |
| `sleepAck` | `:441` | `recordSleep` `:1912`, `:1915` | `sleepEntry` `:1684`, api `sleepAck` | sealed; view-model field |
| `sleepUnknown` | `:471` | `recordSleep` `:1879`, `:1885`, `:1910` | `sleepEntry` `:1700-:1719` | sealed; view-model field |
| `sleepErrorText` | `:464` | `recordSleep` `:1812` (`say`), `:1815`, `:1820`, `:1887`, `:1904` | `sleepEntry` `:1657` | sealed; view-model field. **This one is already the right shape** (D2 round 1 finding 6 made it state, not a node) |
| `sleepBusy` | `:454` | `recordSleep` | `sleepEntry` `:1714`, `:1719` | sealed |
| `sleepDraft` | `:476` | `sleepEntry`'s input handlers (DRAWS), `clearSleepDraft` (BINDS), read by `recordSleep` `:1824` | both | **THE HARDEST ONE.** The view mutates it on every keystroke and the writer reads it at save time. See B.4 |
| `sleepCorrecting`, `sleepNightChoice`, `sleepRollover`, `sleepOpenedNight`, `sleepOpenedDay` | `:459-:463` | `sleepEntry` click handlers (DRAWS), `recordSleep` | both | same as `sleepDraft`: view intent that the writer reads |
| `sleepCheckInDay/Row/Pending/Failed/ViewPending` | `:472-:474` | `readSleepCheckIn` (WRITES), `render` `:2292` | `renderSleepCheckIn`, `sleepCheckInOffer` | sealed; view-model fields |
| `checkInKit`, `checkInKitLoading`, `checkInLive` | `:551-:555` | `loadCheckInKit` (WRITES), `reboundCheckIn` | `render` `:2352`, api | sealed |
| `workout` | `:362` | `rebindWorkout` `:2083`, boot | `renderToday` `:884`, `render` `:2364`, api | sealed; the view gets `session()`'s RESULT, never the entry |
| `workoutRebinding`, `rebindInFlight`, `workoutRebindQueued` | `:363`, `:364`, `:2048` | `rebindWorkout` | api | sealed, internal |
| `importAdmitted` | `:689` | `athleteBasisState` `:2488` | `importLink` `:740`, api | sealed; a view-model boolean |
| `importScreen`, `measureScreen` | `:688`, `:628` | `renderImport`, `renderMeasure` | same | these two are lazy caches inside DRAWS regions that hold objects built over `crypto`/`indexedDB`. See B.5 |
| `measureState` | `:629` | the measure screen itself | `measureDeps` | handed across a module boundary already |
| `screen` | `:792` | `render` `:2294` (DRAWS) | `rebindWorkout` `:2081`, `:2085`, `measureDeps` `:639`, `importDeps` `:696`, `onPhoneKeydown` | **CROSSES BOTH WAYS.** The router's cursor is read by three writers to decide whether to repaint |
| `checkinOrigin` | `:799` | `render` `:2353` and the workout route `:2368` (DRAWS) | `render` `:2349` | view-side only. Stays with the view |
| `mountToken` | `:445` | `render` `:2290` (DRAWS), `dispose` `:2607` | `renderToday` `:841`, `renderMeasure` `:648`, `recordSleep` `:1872`, `renderImport` | **CROSSES BOTH WAYS**, and it is the staleness guard the whole file depends on. See B.4 |
| `disposed` | `:453` | `dispose` | `render` `:2281`, api | sealed (the api owns it) |
| `todayEntry`, `adoptionSettled` | `:768`, `:767` | `renderToday` `:1002` (DRAWS), `settleAdoption` `:776` | `paintTodayEntry` | crosses; a small one |
| `ready` | `:2550` | boot, the setup `done` callback `:2330` | `renderMeasure` `:665` | sealed |
| `phone`, `status`, `chrome`, `doc` | `:353-:355` | - | everywhere | view-side. The sealed half needs `doc` only for `doc.defaultView` (the `indexedDB`/`crypto` handles) |

**Count: 33 crossing bindings.** Twenty-five of them cross ONE WAY (a writer sets, the view reads) and are
solved by a view-model snapshot. Four cross BOTH ways and are the design problem: `foodSaving`, `screen`,
`mountToken`, and the `sleepDraft` family (`sleepDraft`, `sleepCorrecting`, `sleepNightChoice`,
`sleepRollover`, `sleepOpenedNight`, `sleepOpenedDay`). Section B.4 disposes of each by name.

### A.4 `today-model.cjs` (463 lines)

| lines | name | class |
|---|---|---|
| `:1-:56` | header, requires (`today-engine.cjs`, `food-model.cjs`, `sleep-model.cjs`), the store-note constants | - |
| `:57` | `clone` | COMPUTES (pure) |
| `:62-:81` | `previewClock`, `engineClockFor` | COMPUTES (pure) |
| `:86-:90` | `createBasisState` | COMPUTES (pure) |
| `:115-:118` | `hasOpenProposal` | COMPUTES (pure) |
| `:120-:126` | `planMove` | COMPUTES (pure) |
| `:128-:140` | `projectionOf` | COMPUTES (pure) |
| `:150-:457` | `createTodayModel` | MIXED, closure over `readings`, `foodDays`, `sleepNights`, `basis`, `pendingAdoption`, `lastMessage` |
| `:202-:210` | `storedReads`, `storedFoodDays` | BINDS (reads the lane) |
| `:219-:286` | `stateFromOps`, `foodProjectionOf`, `storedSleepNights`, `sessionFor`, `adoptedRead`, `whySections` | COMPUTES |
| `:288-:361` | `read()` | COMPUTES, builds the whole view object |
| `:378-:398` | `weighIn(lb)` | **WRITES**: `:395` `await readings.weighIn({ date: day, lb })`, behind `ALREADY_RECORDED` `:365`, `OUT_OF_RANGE` `:373`, `FORM_MIN`/`FORM_MAX` `:372` |
| `:401-:405` | `reopen()` | **WRITES**: `:403` `readings.restart()` |
| `:412-:420` | `adoptBasis(state)` | **WRITES** (state): replaces the basis operations replay onto |
| `:423` | `setPendingAdoption` | **WRITES** (state) |
| `:425-:457` | the returned api | BINDS |
| `:459-:463` | `module.exports` | - |

`today-model.cjs` draws NOTHING. It is not a view file and it is not in the "renders and writes" class that
`DECISIONS:536` (2) describes. It is a MODEL that computes and writes, which is why `S9-RELEASE-SPEC.md`
A.5 puts it in the same bucket as `gym-model.mjs` (`logSet` at `:502`) and `checkin-app.mjs`
(`await model.save()` at `:150`): a SEALED-class file standing outside the seal. Section F says where its
two halves go.

---

## B. THE CUT

### B.1 The six-line version

1. `today-app.cjs` KEEPS `mountToday` and every one of the 17 WRITES regions, the lane openers, the boot
   and the wiring. It stays SEALED and it remains the module `today-entry.mjs` imports.
2. Five NEW modules come out of it, all free (never sealed), all pure functions from a view-model and a
   callback table to DOM: `today-copy.cjs`, `today-view.cjs`, `today-food-view.cjs`,
   `today-sleep-view.cjs`, `today-chrome.cjs`.
3. The interface is ONE object in each direction: the sealed half builds a `viewModel` (a plain, frozen,
   already-cloned data snapshot) and a `callbacks` table; the view returns a DOM node. The view imports no
   host, no lane, no `indexedDB`, no writer, no engine, and receives none.
4. Every callback that writes is DEFINED in the sealed half. The view may only call one; it may not hold,
   forward, re-export or store one.
5. `today-model.cjs` splits the same way: `today-projection.cjs` (free, pure) takes the seven pure
   top-level functions; `createTodayModel` and its four writers stay in `today-model.cjs` (sealed-class).
6. The router (`render`) stays in the SEALED half, because three writers read `screen` to decide whether to
   repaint. The view is given `go(name)` and never `render`.

### B.2 The new files, named

| new file | lines it takes (at `724ef3f`) | what it holds | sealed? |
|---|---|---|---|
| `rebuild/m3/w7-preview/today/today-copy.cjs` | `:36-:38`, `:45-:57`, `:59-:89`, `:91-:305`, `:306-:321` | every copy constant, the two frozen refusal maps, `ARROW`, `NOT_AVAILABLE`, `NOT_WIRED`, `calorieHeadline`, `calorieBand`, `morningLine`, `trendLine`, `athleteStateFailureCopy`, `resumeLabel`, `setupNoteNeeded` | NO |
| `rebuild/m3/w7-preview/today/today-chrome.cjs` | `:40-:43`, `:330-:343`, `:803-:836` | `amount`, `pounds`, `localDate`, `dayLabel`, `fitHeadline`, `capitalise`, and a `chrome(doc, phone, status)` factory returning `{ template, slots, put, arrows, wire, show, tell }` | NO |
| `rebuild/m3/w7-preview/today/today-view.cjs` | `:645-:680` (paint half), `:703-:721` (paint half), `:729-:748`, `:769-:774`, `:839-:1025`, `:1028-:1058` + `:1078-:1082`, `:1086-:1110`, `:2094-:2162`, `:2192-:2237`, `:2260-:2270` | Today, Why, the weigh-in sheet's MARKUP, the stubs, the setup tile and note, the sample note, the problem control, the check-in-without-store screen, the Measure and Import shells, the Import link | NO |
| `rebuild/m3/w7-preview/today/today-food-view.cjs` | `:1120-:1197`, `:1204-:1274`, `:1339-:1365` | `renderNutrition`, `foodEntry`, and the four pure formatters `reasonOf`, `intakeLine`, `dayOf`, `provenanceLine` | NO |
| `rebuild/m3/w7-preview/today/today-sleep-view.cjs` | `:1428-:1446`, `:1450-:1483`, `:1485-:1505`, `:1509-:1723`, `:1761-:1803`, `:1935-:1954` | `renderSleepCheckIn`, `sleepOpsFor`, `checkInHoursOf`, `sleepCheckInOffer`, `renderSleep`, `sleepEntry`, `sleepEstimate`, `sleepSourceLine`, `checkinDateFor`, `sleepStamp`, `sameNight`, `committedSleepAttempt`, `sleepState` | NO |

Five files, not one, for a reason: `sleepEntry` alone is 215 lines and `renderToday` is 187, and C-UI-2,
C-UI-3 and C-UI-7 are three different tickets with three different reviewers. A single `today-view.cjs`
would put all three tickets in one file and re-create, inside lane C, the merge contention the seal was
causing. Four view files split cleanly along the ticket lines (see C).

`coach-app.mjs`, which C-UI-6 asks for, is a SIXTH new file but it is C-UI-6's own to create: after this
cut the coach stub is four lines in `today-view.cjs` (`render`'s `"coach"` branch at `:2357-:2358` plus
`renderStub`), and C-UI-6 replaces them with a call into its new module. This spec does not write it.

### B.3 The interface

```
// in today-app.cjs (SEALED), once per paint:
const vm = todayViewModel();            // a frozen plain-data snapshot, built here
const ui = View.renderToday(vm, cb, chrome);
```

**The view-model** is built by ONE sealed function per screen (`todayViewModel`, `nutritionViewModel`,
`sleepViewModel`, `whyViewModel`, `sleepCheckInViewModel`). Each one:

- calls `model.read()` (or `model.loggedFood` / `model.recordedSleep` / ...) exactly where the render
  function calls it today, at exactly the same point in the sequence;
- copies the 25 one-way crossing bindings from A.3 into fields (`foodReadBack`, `sleepAck`, `sleepUnknown`,
  `sleepErrorText`, `sleepBusy`, `sleepOpening`, `foodOpening`, `importAdmitted`, ...), CLONED, never by
  reference;
- carries `session()`'s RESULT (`{ phase, sets, unfinished, code }`), never `workout`;
- carries `food.openedRefusal` and `sleep.openedRefusal` as data, never the lane;
- is `Object.freeze`d at the top level before it crosses.

**The callback table** `cb` is built once per mount in the sealed half. Every entry is a sealed-half
function; the view may call one, and may do nothing else with it:

| callback | what it calls in the sealed half | writes? |
|---|---|---|
| `go(name, focus)` | `render(name, focus)` | no |
| `openWeighIn()` | the sealed sheet opener | no (it draws, via the view) |
| `submitWeighIn(raw)` | `model.weighIn(...)` `:1072` | YES |
| `recordIntake(nodes)` | `recordIntake` `:1278` | YES |
| `retryFoodRead()` | `retryFoodRead` `:1324` | YES |
| `recordSleep(map)` | `recordSleep` `:1807` | YES |
| `retrySleepRead()` | `retrySleepRead` `:1727` | YES |
| `recoverWorkout()` | `workout.recover()` `:954` | YES |
| `openWorkout()`, `openCheckIn(origin)`, `openSetup()` | the router's own branches | no |
| `readSleepCheckIn(date)` | `readSleepCheckIn` `:1410` | YES (opens a lane) |
| `draft` | a frozen accessor pair over `sleepDraft` (B.4) | no |
| `copyDiagnostic()` | `problemControl`'s clipboard path | no |

`cb` is `Object.freeze`d. The sealed half asserts, once at mount, that every value in it is a function it
defined in this closure (identity compare against a local array), so a view cannot substitute one.

### B.4 The four bindings that cross both ways, disposed of by name

**`mountToken` (`:445`).** Written by `render` (a DRAWS region today) and by `dispose`; read by four
writers to decide whether a resolved promise may still paint. **`render` moves to the SEALED half**, so
after the cut `mountToken` is written only in the sealed half. The view never sees it. Every render
function that captures `const token = mountToken` today (`:648`, `:841`) captures it in the sealed
view-model builder instead, and the "may I still paint" question becomes `cb.live()` - a sealed predicate
the view calls before appending anything asynchronous. `renderMeasure` and `renderImport` are the only two
view regions that await, and both already take a `() => token === mountToken` thunk (`:654`, `:719`); after
the cut that thunk IS `cb.live`, which is a smaller change than it looks.

**`screen` (`:792`).** Read by `rebindWorkout` `:2081`/`:2085`, `measureDeps` `:639`, `importDeps` `:696`,
`onPhoneKeydown` `:2388`. Written by `render` `:2294`. Same disposal: `render` stays sealed, so `screen`
never leaves the sealed half. The view is given `vm.screen` as a read-only string when it needs one.

**`foodSaving` (`:412`).** Today the VIEW assigns into it: `:1272`
`save.addEventListener("click", () => { foodSaving = recordIntake(save, cal, pro, error); });` and `:1268`
the same for the retry. After the cut the view calls `cb.recordIntake({ save, cal, pro, error })` and the
SEALED half does the assignment: `recordIntake: (nodes) => { foodSaving = recordIntake(nodes.save,
nodes.cal, nodes.pro, nodes.error); return foodSaving; }`. The view hands NODES to a sealed writer, which
is the one place the interface passes DOM the other way; it is how `recordIntake` already works and
changing it would change saving code. The same shape covers `sleepSaving` at `:1721`.

**The `sleepDraft` family (`:459-:463`, `:476`).** The view mutates `sleepDraft` on every keystroke
(`sleepEntry`'s input handlers) and `recordSleep` reads it at `:1824` (`const entry = { ...sleepDraft, date }`).
`sleepCorrecting`, `sleepNightChoice`, `sleepRollover`, `sleepOpenedNight` and `sleepOpenedDay` are the same
shape: the view sets them from a click, the writer reads them.

The disposal: the draft object STAYS in the sealed half and the view is given a frozen accessor pair,
`cb.draft = { read: () => ({ ...sleepDraft }), set(field, value) }`, where `set` accepts only the eight
keys `sleepDraft` declares at `:476` and the five intent flags, and rejects anything else by throwing. The
view's input handlers call `cb.draft.set("bed", el.value)` instead of `sleepDraft.bed = el.value`.

**This is the one place where the cut is NOT free.** `sleepEntry`'s input handlers are DRAWING code that
today performs a direct property assignment; after the cut they perform a function call. That is a change
to drawing code, not to saving code, so it does not break the PM's rule - but it is about 14 assignment
sites inside `:1509-:1723`, and the build round's reviewer must check each one by hand. If the PM prefers
zero change even there, the alternative is to pass `sleepDraft` itself into the view by reference, which
gives the view a mutable handle on sealed state and makes the writer-fence in section E unable to say
anything useful about it. I recommend the accessor.

### B.5 Two lazy caches that must not move

`measureScreen` (`:628`) and `importScreen` (`:688`) are assigned inside `renderMeasure` and `renderImport`
- DRAWS regions - but they hold objects constructed over `indexedDB` and `crypto` (`measureDeps` `:637`,
`importDeps` `:697`). **Both cache assignments and both `*Deps` functions stay in the sealed half.** After
the cut, `renderMeasure` in `today-view.cjs` draws the empty `<section id="measure-screen">`, calls
`cb.paintMeasure(root, cb.live)`, and the sealed half owns the dynamic import, the cache and the deps
object. Same for Import. This also preserves `assertImportRouteIsolation` (see B.6).

### B.6 What changes in `build.mjs`

| law | line | change | why |
|---|---|---|---|
| `REQUIRED_INPUTS` | `:98` | **ADD five entries**: `today-copy.cjs`, `today-chrome.cjs`, `today-view.cjs`, `today-food-view.cjs`, `today-sleep-view.cjs`; and, for F, `today-projection.cjs`. Six new entries, 51 becomes 57 | the constant's whole purpose (`:112-:115`) is that the page cannot silently lose a module. A view module dropped from the bundle is a page that renders nothing, which is exactly the failure class it guards |
| `REQUIRED_INPUTS` teeth | - | **the S9 hunk H18 must land first or in the same package.** `S9-RELEASE-SPEC.md` A.4 measured that NO sealed cell asserts any of the 26 `today/**` entries. Until H18 exists, adding six entries here adds six entries nothing checks | this is a DEPENDENCY, stated in G |
| `FORBIDDEN` | `:79` | no change | the view modules import nothing new |
| `assertImportRouteIsolation` | `:384` | **no change, and that is a REQUIREMENT of the cut.** `:391-:392` asserts `deepEqual(importers, ["rebuild/m3/w7-preview/today/today-app.cjs"])` for `IMPORT_ENTRY`. The dynamic import at `:713` must therefore stay in `today-app.cjs` - which is exactly what B.5 rules | if `renderImport`'s `import("../import/import-screen.mjs")` moved into `today-view.cjs`, this assertion fails with `IMPORT-ROUTE FAIL: ... is reached from today-view.cjs`. It is a red-first check the build round gets for free |
| `assertNoNetworkReference` `:209`, `assertNoNodeOnlyGlobals` `:244` | - | no change | |
| bundle order | `:478` `entryPoints: [today-entry.mjs]` | no change | esbuild resolves the new `require`s itself |
| the dash guard's attribution | `:289` | no change, but see D.2 | it cuts the bundle at `// <path>` banners, so five new modules mean five new banners. The guard names the module that wrote an offending string; after the cut it will name a view module instead of `today-app.cjs` |

**`today-entry.mjs`: ONE line changes, or none.** `:19` is `import app from "./today-app.cjs"`, and
`today-entry.mjs` uses only `app.mountToday` and the copy constants off that default export. Because
`today-app.cjs` re-exports everything it moved (`module.exports = { ...require("./today-copy.cjs"), ... }`
keeping the same 100 names at `:2622-:2625`), **`today-entry.mjs` needs no edit at all.** That matters:
`today-entry.mjs` is sealed (`S9-RELEASE-SPEC.md` A.3, `:141` `await host.save(document_)`) and pinned on
disk by B-NTC (`today-app.cjs:404-:408`, `DECISIONS:144`), so an edit to it would drag the split into a
second pin class. **The build round must prove the re-export surface is identical, name for name, by
comparing `Object.keys(require("./today-app.cjs")).sort()` before and after.**

**CommonJS inside a built page bundle.** All five new files are `.cjs` and are `require`d, exactly as
`plain-copy.cjs`, `problem-report.cjs`, `food-model.cjs` and `sleep-model.cjs` already are from
`today-app.cjs:24-:34`. esbuild wraps each in `__commonJS` and the page continues to work the way it does
today. No ESM/CJS boundary is crossed and no interop shim is needed. The only visible consequence is in
the emitted bundle's module banners, which is why D.2 cannot promise byte-identity.

---

## C. WHAT THE LOOK TICKETS NEED, AND WHETHER THE CUT GIVES IT TO THEM

### C.1 Method

I did not take the tickets' "MAY CHANGE" lines at their word. The design of record's state inventory
(`rebuild/m1/approved-2026-09-18/states/STATE-INVENTORY-DRAFT.md`, 205 rows) cites a `today-app.cjs` or
`today-model.cjs` line for most states, in its "where it comes from" column. I extracted every citation,
grouped the rows by the ticket that owns them, and mapped each cited line onto the region map in A.2. That
gives a measured answer to "which regions must this ticket change", not an argued one.

Counts, from the inventory: C-UI-2 owns 39 T states of which **31 cite a `today-app.cjs` line**; C-UI-3
owns 12 of which 6 cite one; C-UI-7 owns 43 of which 38 cite one; C-UI-6 owns 65 C states of which **1**
cites one; C-UI-5 owns 45 W states of which 2 cite one.

### C.2 Ticket by ticket

| ticket | cited `today-app.cjs` lines | regions (A.2) | after the cut |
|---|---|---|---|
| **C-UI-2** Today, the face | `:54`, `:55`, `:71-:74`, `:86`, `:114`, `:223`, `:234`, `:236-:239`, `:249`, `:250`, `:285`, `:305-:310`, `:317`, `:330-:343`, `:847-:861`, `:864`, `:875-:876`, `:894`, `:899`, `:909`, `:947`, `:966-:971`, `:991`, `:1007-:1010`, `:1024`, `:1950-:1954`, `:2134`, `:2228-:2234`, `:2245`, `:2250-:2254`, `:2440` | copy block, `calorieBand`, `trendLine`, `athleteStateFailureCopy`, `resumeLabel`, `setupNoteNeeded`, `fitHeadline`, `renderToday`, `sleepState`, `sampleNote`, `problemControl`, `nutritionState`, `recoveryState`, `willAdopt` | `today-copy.cjs` + `today-chrome.cjs` + `today-view.cjs` + `today-sleep-view.cjs` (`sleepState` only). **ONE residue: `:2440`** |
| **C-UI-3** proposal card + weigh-in | `:65-:70`, `:1028-:1040`, `:1068-:1074`, `:1072`, `:1073`, `:1080-:1081` | `morningLine`, `openWeighIn` head (DRAWS), the submit listener (WRITES) | `today-copy.cjs` + `today-view.cjs`. **ONE residue: the refusal line at `:1076`** |
| **C-UI-5** workout panels | `:2364-:2365`, `:2372-:2373` | `render`'s `"workout"` branch | the branch is the router, which stays sealed. But the ticket's own MAY CHANGE list is `machine-settings-view.mjs`, `machine-settings-host.mjs`, `gym-app.mjs` - **this ticket does not need the split at all**, and the two cited lines are a route it does not edit |
| **C-UI-6** coach | `:2357-:2358` | `render`'s `"coach"` branch and `renderStub` `:2094-:2106` | `renderStub` is in `today-view.cjs`. The BRANCH is in the sealed router. **ONE residue, and it is two lines**: replacing `return renderStub("t-coach", ...)` with `return CoachApp.open(...)`. See C.4 |
| **C-UI-7** the entries | `:109-:113`, `:114-:115`, `:143`, `:144`, `:145`, `:214-:220`, `:476`, `:1086-:1110`, `:1090-:1091`, `:1120-:1122`, `:1133-:1134`, `:1180-:1184`, `:1220-:1223`, `:1233-:1237`, `:1294-:1300`, `:1302-:1308`, `:1314-:1316`, `:1384-:1393`, `:1428-:1446`, `:1473-:1483`, `:1493-:1499`, `:1700-:1712`, `:1715`, `:1761-:1776`, `:1766-:1768`, `:1799-:1803`, `:1875-:1881`, `:1887-:1889`, `:1893-:1905`, `:1898-:1901`, `:1902`, `:1914-:1920` | copy block, `sleepDraft` `:476`, `renderWhy`, `renderNutrition`, `foodEntry`, **`recordIntake` `:1294-:1316`**, `sleepClockCheck`, `renderSleepCheckIn`, `sleepCheckInOffer`, `renderSleep`, `sleepEntry`, `sleepEstimate`, `sleepStamp`, **`recordSleep` `:1875-:1920`** | `today-copy.cjs` + `today-food-view.cjs` + `today-sleep-view.cjs`. **RESIDUE: two lines inside `recordIntake` (`:1283`, `:1306`) and the `sleepDraft` accessor work of B.4. Everything cited inside `recordSleep` is SATISFIED without touching it** |

### C.3 The residue, measured exactly

**Four sealed-half lines, and one two-line route swap.** That is the whole of it.

| # | residue | where | why it cannot move | what it costs |
|---|---|---|---|---|
| R1 | the weigh-in refusal sentence | `today-app.cjs:1076` `error.textContent = plainOrDrop(result.copy || "This weight could not be recorded, and nothing was recorded.", "weigh-error")` | it is inside the submit listener, after `await model.weighIn(...)` at `:1072`. Moving it changes saving code | C-UI-3's acceptance says "the weigh-in card's refusal placement and field flag". PLACEMENT is the `error` node, which the view chooses when it builds the sheet, so the view CAN move the sentence. What the view cannot change without a sealed edit is the FALLBACK STRING and the slot name `"weigh-error"` |
| R2, R3 | the two intake refusal sentences | `today-app.cjs:1283` and `:1306-:1308` | inside `recordIntake`, one before and one after `await foodLane.save(...)` | same shape as R1. C-UI-7's "every refusal under the field it names with the field flagged" is achieved by the view passing a different `error` node into `cb.recordIntake`, and by the view running its own field-flag pass on the repaint that `recordIntake` triggers. The words, the slot names and the composition order are sealed |
| R4 | the adoption arm | `today-app.cjs:2440` `const willAdopt = canAdoptAthleteState();` | it is a boot statement that arms `model.setPendingAdoption(true)` and `workout.gym.holdForAdoption(true)` | T-03 cites it as the CONDITION under which Today draws "Not available yet". C-UI-2 reads it; it does not edit it. **Zero cost** |
| R5 | the coach route | `today-app.cjs:2357-:2358` | the router stays sealed (B.4, `screen`) | C-UI-6 must change two lines in the sealed half to point the route at `coach-app.mjs`. **This is the one that needs a reseal child or a PM exception.** See C.4 |

**Nothing else.** `recordSleep`, the largest writer at 124 lines and the one C-UI-7 cites most (`:1875-:1920`,
six separate citations), needs NO edit: D2 round 1 finding 6 already made every sentence it produces a
value of `sleepErrorText`, drawn by `sleepEntry` at `:1657`. Every one of those six citations is satisfied
by editing `today-sleep-view.cjs`.

### C.4 Is the cut in the right place? Yes, with one named exception

The ticket says: if most tickets still need the sealed half, the cut is in the wrong place. Measured:

| ticket | before the cut | after the cut |
|---|---|---|
| C-UI-2 | reseal child (31 of 39 states) | **plain lane C**, zero residue |
| C-UI-3 | reseal child | **plain lane C**, with R1 as a copy constraint it already accepts (its LOCKED line says the copy is the inventory's verbatim) |
| C-UI-5 | reseal child, but for `gym-app.mjs` and `machine-settings-host.mjs`, NOT for `today-app.cjs` | unchanged by this split. **This split does not free C-UI-5**; a second split, of `gym-app.mjs`, would |
| C-UI-6 | reseal child | **plain lane C for 64 of its 65 states**, plus a two-line sealed route swap |
| C-UI-7 | reseal child | **plain lane C**, with R2/R3 as copy constraints it already accepts |
| C-UI-8 | plain lane C already | unchanged |

Four of the six tickets that rode a reseal child become plain lane C. That is the acceptance test passed.

**The exception, said plainly.** C-UI-6's two-line route swap (`render`'s `"coach"` branch) is a real
sealed-byte edit. Three ways out, and I recommend the third:

(a) C-UI-6 rides a reseal child for two lines. Wasteful: a three-to-four hour child for two lines.
(b) The router moves to the view half. **NO.** Three writers read `screen` (`rebindWorkout:2081`,
    `measureDeps:639`, `importDeps:696`) and the setup route's `done` callback at `:2317-:2333` calls
    `armAdoptionGate()` and `adoptAthleteState()`. Moving `render` puts writer-adjacent control flow in a
    free file and makes section E's fence meaningless.
(c) **The split round itself writes the coach seam**, once, while `today-app.cjs` is already being edited
    under a reseal child: the router's non-writing branches become a lookup in a table the VIEW supplies -
    `screens.get(next)` - for the six pure-draw routes (`why`, `nutrition`, `sleep`, `sleep-checkin`,
    `coach`, `measure`, `import`), while `setup`, `recovery` and `workout` (which touch `setup.open`,
    `checkin.open`, `workout.open` and `reboundCheckIn`) keep their explicit branches in the sealed half.
    C-UI-6 then registers a screen and touches nothing sealed. Cost: about 20 lines of router, once, in a
    round that is already opening the file. **Recommended.**

### C.5 What the design of record needs that this cut does NOT give

Said so it is not discovered later. `design.cjs:607` declares
`VIEW_SOURCES = ["today-app.cjs", "gym-app.mjs", "gym-model.mjs", "today-model.cjs", "checkin-app.mjs",
"checkin-model.mjs"]`, `design.cjs:619` `appSource()` concatenates them, and `assertDesignBinding`
(`design.cjs:527-:569`) requires every declared runtime copy line to appear in that concatenation.
**Move the copy out of `today-app.cjs` and the design binding fails**, unless `VIEW_SOURCES` gains the new
files. `design.cjs` is NOT sealed (`S9-RELEASE-SPEC.md` A.5), so lane C can edit it - but
`test/design.test.cjs:79-:81` asserts `VIEW_SOURCES` by `deepEqual` against that exact six-name array, and
`design.test.cjs` IS one of the twelve sealed today cells. Section D.3 lists this as a declared test edit.

---

## D. THE PROOF OF A PURE MOVE

Six proofs. The build round delivers all six as artifacts committed beside its report; its independent
reviewer re-runs 1, 3 and 6 from the branch and re-reads 2, 4 and 5.

### D.1 Proof 1: every WRITES region byte-identical

A committed script, `rebuild/lanes/c/today-split/writes-fence.mjs`, with a committed manifest
`writes-regions.json` holding the 17 WRITES regions of A.2 plus the four of `today-model.cjs` A.4, each as
`{ file, name, kind }` where `kind` is `function-declaration` or `listener`.

The script, run twice (once at the base ref, once at HEAD):
1. locates each region by its declaration text, not by line number (line numbers move; the declaration
   does not). For `function recordIntake(save, cal, pro, error) {` it takes the whole brace-balanced body.
   For the weigh-in submit listener it takes from `sheet.addEventListener("submit", async (event) => {` to
   its balanced close.
2. **applies the modulo, and this is what "modulo the enclosing module wrapper" means, exactly**:
   - leading indentation is stripped uniformly, by removing from every line the common prefix of spaces
     shared by all non-blank lines of the region (so a region that moves from depth 1 to depth 0 compares
     equal). Nothing else about whitespace is touched: no trimming of trailing spaces, no newline
     normalization beyond a single CRLF-to-LF pass applied to BOTH sides;
   - and NOTHING else. Not identifier renaming, not comment stripping, not reordering. If a writer's body
     differs in one character after de-indentation, the proof fails.
3. prints `sha256` per region and a final table. **PASS is: every one of the 21 regions' post hash equals
   its pre hash.** The report carries the table.

Red first: the script is written and run BEFORE any code moves, on the unmodified tree with an artificial
one-character edit inside `recordSleep`, and must fail naming `recordSleep`.

Since the split as designed moves NO writer out of `today-app.cjs`, every one of the 17 regions in that
file should compare equal at depth 1 with no de-indentation at all. The de-indentation clause exists for
`today-model.cjs`'s four writers if F's split moves them, and as a safety net.

### D.2 Proof 2: the built page equal before and after. I choose DOM-snapshot equality, and here is why

**Byte-identical bundle is impossible, by construction, and I can show the line.** `build.mjs:289`:
"The bundle cut at its module banners: `// <path>` on a line of its own, which is what ..." - esbuild emits
one banner per input module and wraps each CommonJS module in its own `__commonJS` factory. Five new `.cjs`
inputs mean five new banners, five new factories and five new `require` call sites. The bundle MUST differ.
Nothing in the bundler's options removes that; asking for byte-identity here would be asking for a proof
that cannot pass, which is worse than a weaker proof honestly named.

**So: DOM-snapshot equality over every state the today suite renders.** Concretely,
`rebuild/lanes/c/today-split/dom-snapshot.mjs`:

- mounts the page through `mountToday` in jsdom, exactly as `view.test.mjs`, `food.test.mjs`,
  `problem.test.mjs`, `gym.test.mjs`, `checkin.test.mjs` and `setup.test.mjs` do, over the SAME fixtures
  those cells use (the script imports their fixture builders rather than re-inventing them);
- drives each state the design of record's inventory names for T-02..T-95, by the same condition the
  inventory's "where it comes from" column gives;
- for each state, serializes `#phone`'s `outerHTML` and `#today-status`'s `textContent` after a settled
  microtask queue, with one normalization only: attribute order is sorted (jsdom's serializer is already
  stable, but a sort makes the proof independent of that), and nothing else is touched;
- writes `snapshots.json`, a map of state id to `sha256`.

**PASS is: the map at the base ref and the map at HEAD are equal, key for key and hash for hash.** A state
that cannot be driven is listed in the artifact as NOT COVERED with its reason, and the reviewer judges
that list; a silent gap is a fail.

Two things this proof does NOT cover, said so they are not assumed: (a) anything the browser does that
jsdom does not - layout, fonts, the scene - which is what proof 5 is for; (b) the ORDER of side effects,
which is what proofs 1 and 3 are for.

**And one bundle-level proof that IS available, so the bundle is not unexamined**: the built `app.js`'s
input inventory (`result.inputs` from the metafile) before and after must differ by EXACTLY the six new
paths and nothing else, and `scanBuiltAssets`'s dash report must be empty on both. That is cheap, it is
mechanical, and it catches a module accidentally dropped or dragged in.

### D.2b Proof 2b: the listener census

D.2's snapshot is of MARKUP, and a listener that stopped being attached leaves the markup identical. This
file's handler wiring has been found broken once already (`DECISIONS:454` round 2), and the split touches
every wiring site, so markup equality alone is not enough.

`dom-snapshot.mjs` therefore also instruments `EventTarget.prototype.addEventListener` in the jsdom window
for the duration of each state, and records, per state, a sorted list of
`<data-slot or tag>:<event type>:<count>`. **PASS is: that list is equal, state for state, before and
after.** A listener that moved from the sheet to the button, or that is now attached twice, fails here even
though the markup is identical. This is the cheapest available proof that the wiring survived, and it is
the one I would spend the review's time on first.

### D.3 Proof 3: the today suite green, with every test edit listed

The suite is the 13 cells at `.github/workflows/rebuild.yml:232` (682 tests). It must be green with NO
test edited except as listed here. **The list is not empty, and it is not only import paths.** I read every
cell that reads `today-app.cjs` as TEXT and there are more than the ticket assumes:

| cell | line | what it does | edit needed | is it an import path? |
|---|---|---|---|---|
| `test/checkin.test.mjs` | `:25` | `import TodayApp from '../today-app.cjs'` | none: the re-export surface is unchanged (B.6) | - |
| `test/copy.test.mjs` | `:34` | same import | none | - |
| `test/food.test.mjs` | `:21` | same import | none | - |
| `test/gym.test.mjs` | `:33` | same import | none | - |
| `test/problem.test.mjs` | `:23` | same import | none | - |
| `test/setup.test.mjs` | `:28` | same import | none | - |
| `test/view.test.mjs` | `:21` | same import | none | - |
| **`test/copy.test.mjs`** | **`:406`** | `planted('today-app.cjs', 'const NOT_AVAILABLE = "Not available yet";', ...)` - plants a dash in a string THIS PAGE OWNS and requires the build to refuse it | **the target file becomes `today-copy.cjs`** | **NO** |
| **`test/design.test.cjs`** | **`:79-:81`** | `deepEqual(design.VIEW_SOURCES, ["today-app.cjs", ...six names])` | **the array gains the four copy/view files** | **NO** |
| **`test/food.test.mjs`** | **`:696-:698`** | slices `today-app.cjs` between `'if (next === "setup"'` and `'if (next === "why")'` and asserts the slice contains `firstRun()` | **none**, because the router stays sealed in `today-app.cjs` (B.4). If C.4 option (c) is taken, the slice still contains the setup branch verbatim; the reviewer must check | possibly |
| `test/food.test.mjs` | `:707`, `:763` | iterates `[...NEW_FILES, 'today-app.cjs', 'today-model.cjs']` for the no-dash literal scan | **the list gains the new files** (a widening, and N1.15 exists precisely so a widening is a visible test change) | **NO** |
| `test/food.test.mjs` | `:897` | the N1.20 custody list, `existsSync` over named files | **the list gains the new files** | **NO** |
| `test/food.test.mjs` | `:1152-:1153` | slices `today-app.cjs` between `'function foodEntryFor'` and `'function openFoodLane'` | **none**: both are WRITES regions and both stay | - |
| `test/problem.test.mjs` | `:1100-:1102` | slices `function sleepEntryFor` out of `today-app.cjs` by the regex `/^function sleepEntryFor[\s\S]*?^  \}/m` and `Function()`-evals it | **none**, and this is a CONSTRAINT: `sleepEntryFor` must stay in `today-app.cjs` at two-space indentation. It does (it is a WRITES region) | - |
| `test/problem.test.mjs` | `:2003-:2008` | scans every `.cjs`/`.mjs` in the directory for `sleepSpanH(` and asserts the callers are exactly `['sleep-model.cjs', 'today-app.cjs']` | **the expected array becomes `['sleep-model.cjs', 'today-sleep-view.cjs']`**, because `sleepEstimate` `:1774` is the caller and it moves to the sleep view | **NO** |
| `test/problem.test.mjs` | `:1945`, `:1980`, `:1989` | the same three list shapes as `food.test.mjs` | same widenings | **NO** |
| `test/package.test.cjs` | `:101-:107` | plants a static import edge from `today-app.cjs` to the import route and requires `IMPORT-ROUTE FAIL` | **none**: B.5 keeps the dynamic import in `today-app.cjs` | - |
| `test/setup.test.mjs` | `:1035` | `codeOf(setupFileText('today-app.cjs'))` | the reviewer must read what it asserts on that text and judge; I could not rule it out from the slice I read | **unknown, flag it** |

**So D(3) as the ticket words it ("no test edited except import paths") CANNOT be met, and the build round
must not pretend otherwise.** The honest form, and what I recommend the PM accept: *no test edited except
(a) import paths, (b) file-name LISTS that exist to make a widening visible, and (c) two target-file
changes (`copy.test.mjs:406`, `problem.test.mjs:2007`) where the assertion is about which module owns a
string.* Nine edits, every one listed above by file and line, none of them weakening an assertion, and
every one of them re-asserted against the NEW file so the guard keeps its teeth. Any tenth edit is a STOP.

### D.4 Proof 4: zero copy change

`rebuild/lanes/c/today-split/copy-census.mjs` extracts every string literal from `today-app.cjs`,
`today-model.cjs` and (at HEAD) the six new files, using the same literal regex `food.test.mjs:899` uses,
and emits a SORTED MULTISET of literals with their counts. **PASS is: the multiset at the base ref equals
the multiset at HEAD, exactly.** Not a subset, not "no new words": equal, so a duplicated or dropped
constant is caught too. The design gates (`quality/gate.py`, `quality/statesheet.py`) are the second
opinion and must be green, and `assertDesignBinding` through `design.test.cjs` is the third.

### D.5 Proof 5: the browser check on the PC

`node rebuild/m3/w7-preview/today/browser-check.mjs` and `node .../serve.mjs` on the owner's PC, both
themes, opened offline, with: no console error; the scene drawn; the Today headline fit correct after
`fitHeadline`'s MutationObserver (`today-app.cjs:1018-:1022`) fires; the weigh-in sheet opening, refusing
an out-of-range weight in the engine's own words, and closing on a good one; the nutrition entry saving
and reading back; the sleep entry saving. `browser-check.mjs` is stale-red at the tip (`DECISIONS:535`,
`S9-RELEASE-SPEC.md` A.5), so the build round records its state BEFORE the split as the baseline and
proves it is NO WORSE after, rather than claiming a green it never had.

### D.6 Proof 6: engine, coach and DECISIONS numstat empty

`git diff --numstat <base> HEAD -- rebuild/engine rebuild/coach rebuild/DECISIONS.md rebuild/authority
rebuild/client rebuild/m4 rebuild/conform` prints NOTHING. Printed verbatim in the report, with the base
sha named. I have widened the ticket's three paths to seven: the same argument covers the client, the
authority, m4 and conform, and a split that touched any of them is not a split.

---

## E. THE WRITER-FENCE

### E.1 What it is, in three lines

A new sealed cell, `rebuild/lanes/c/ui-port/writer-fence.test.mjs`, with a CI home of its own beside the
A1/A2/A3/A4 step at `rebuild.yml:232`. It asks ONE question of every file under
`rebuild/m3/w7-preview/today/` that is NOT in the sealed inventory: does this free file reach a writer?
It FAILS, naming the file and the line, when a free file calls a writer entry point, touches IndexedDB or
local storage, or imports a host, a lane or the engine. The release stays safe for good because the fence
grows with the inventory rather than with a list a future author must remember to update.

### E.2 How it learns which files are free

Exactly as `S9-RELEASE-SPEC.md` D.2 rules for the inventory fence, and for the same reason (R1 BLOCKING-2:
a fence whose fenceposts move with the animal is not a fence):

- the inventory is read **out of Git at the chain ref**, `git show
  refs/remotes/origin/rebuild/t2-client-core:rebuild/m4/spec/acceptance-s<N>-*.json`, never from the
  worktree, with no cache;
- `<N>` is the NUMERIC maximum of the integers after `acceptance-s` in the file names at that ref (a
  lexical walk puts `s10` before `s9`); two artifacts at the same `N` FAIL `FENCE-AMBIGUOUS-INVENTORY`;
- a missing `refs/remotes/origin/rebuild/t2-client-core` FAILS `FENCE-CHAIN-REF-ABSENT`, never passes
  vacuously (`rebuild.yml:35` already sets `fetch-depth: 0`);
- the artifact in the worktree differing from the one at the chain ref FAILS
  `FENCE-INVENTORY-DIFFERS-FROM-CHAIN`;
- a reseal-child branch (its diff contains `rebuild/lanes/b/tooling/packages/S<N+1>.json`) SKIPS with its
  reason printed.
- FREE = present in the directory listing of `rebuild/m3/w7-preview/today/` (source files only, `.cjs`
  and `.mjs`, `test/` excluded) AND absent from the inventory's `product` map AND absent from its
  `executionPins`. A file in the inventory's `released` block is FREE and IS fenced: that is the point.

### E.3 The entry-point list, fixed from the map in A

The fence FAILS when the code of a free file contains, in code position (not in a comment, not inside a
string literal), any member name or identifier from the four tables below.

**Durable writers, from A.2 and A.4:**
`save` (as a member: `.save`), `weighIn`, `logSet`, `adoptBasis`, `setPendingAdoption`, `rebase`,
`holdForAdoption`, `recover`, `restart`, `reopen`, `retract`, `retractImport`, `importBundle`,
`admitLocalSource`, `admittedLocalSourceState`, `commit`, `put`, `add`, `delete` as members of anything
that is not a `Map`, a `Set` or a DOM node (see E.4's policy on `put`).

**Lane and host constructors, from A.2:**
`createSleepHost`, `createFoodHost`, `createGymHost`, `createReadingHost`, `createCheckinHost`,
`createSetupHost`, `createMachineSettingsHost`, `createWorkoutEntry`, `createCheckInEntry`,
`openTodayHosts`, `hostForDay`, `createTodayModel`.

**Stores:**
`indexedDB`, `IDBFactory`, `IDBDatabase`, `openDatabase`, `localStorage`, `sessionStorage`, `caches`,
`crypto.subtle`, `navigator.storage`.

**Module edges (the import side):**
any import or require of `*-host.mjs`, `*-commands.cjs`, `local-source-basis.mjs`, `today-entry.mjs`,
`../import/**`, `../measure/**`, `rebuild/client/**`, `rebuild/engine/**`, `rebuild/m4/**`,
`rebuild/m3/w6/**`, or of any path that is itself in the sealed inventory.

**What a free view file MAY import** (the allowlist, and it is short): `plain-copy.cjs`,
`today-copy.cjs`, `today-chrome.cjs`, `today-projection.cjs`, `food-model.cjs`, `sleep-model.cjs`,
`problem-report.cjs`, `design.cjs`, `split-kinds.mjs`, `exercise-catalogue.mjs`, `starter-week.mjs`, and
each other. Anything else FAILS `FENCE-VIEW-IMPORT`. `food-model.cjs` and `sleep-model.cjs` are on the
list because the views already call their pure refusal and projection helpers (`FoodModel.refusalFor`,
`SleepModel.rowFor`) and neither file holds a client (`problem.test.mjs:1996-:2001` asserts exactly that).

### E.4 How it reads code: a conservative token scan, with its false-positive policy stated

**I recommend a token scan, not a parser, and I will say why rather than leave it as a preference.** There
is no JavaScript parser in `node_modules` (A.0); adding one is an `npm install`, which this repository does
not do inside a lane; and `esbuild`'s metafile, which IS a real parser's output, covers the IMPORT side
completely and the call side not at all. So:

- **the import side uses `esbuild`'s metafile**, through the existing `buildToday()` path. It is exact: it
  sees static imports, dynamic imports and `require` calls alike, with their `kind`, which is how
  `assertImportRouteIsolation` (`build.mjs:384`) already works. `FENCE-VIEW-IMPORT` is a metafile check
  and has no false positives.
- **the call side uses a token scan over `codeOf(source)`**, the comment-and-string stripper the today
  cells already use (`problem.test.mjs:2006`, `setup.test.mjs:1035`). The scan is over IDENTIFIERS and
  MEMBER NAMES, not over call expressions, which is what makes E.5 row 1 fail.

**The false-positive policy, in one rule: there is no escape hatch.** A free file that legitimately wants
a fenced word must rename its own thing. Consequences, accepted deliberately:

- `put(map, name, text)` (`today-app.cjs:815`) is a drawing primitive whose name collides with the IndexedDB
  store method. **It is renamed to `slot()` in `today-chrome.cjs`.** That is a drawing-code rename, listed
  in the build round's diff, and it removes the collision rather than carving an exception.
- `Map.prototype.set`, `Set.prototype.add` and `Array.prototype.push` are NOT fenced (they are not in the
  list). `.delete` and `.add` ARE fenced as members, and `slots()` uses `map.set` / `map.has` / `map.get`
  only, so the collision does not arise; if a later view needs `set.add`, the fence names it and the author
  uses a different structure or the PM widens the list on purpose.
- `element.remove()`, `element.append()`, `element.replaceChildren()` are NOT fenced: they are DOM and the
  view's whole job is DOM.
- A comment mentioning `host.save` is invisible to the scan, because `codeOf` strips comments. That is
  deliberate: the views carry long explanatory comments and a fence that failed on prose would be turned
  off within a week.

The fence prints, on every run, the number of free files it scanned and their names, so a file that
silently left the directory cannot make it pass by scanning nothing. Zero free files is a FAIL
(`FENCE-NOTHING-TO-SCAN`).

### E.5 Red first, including the five tricks

Each row is a cell the build round writes BEFORE the fence's happy path, planting the code in a COPY of the
tree (the `planted()` pattern `copy.test.mjs:395` already uses), never in the real tree.

| # | the trick, planted in a free view file | fence verdict | why it holds |
|---|---|---|---|
| 1 | **aliasing**: `const s = host.save; s(x);` | **FAIL** `FENCE-WRITER-NAME today-view.cjs:N .save` | the scan matches the member NAME where it is READ, not a call expression. Reading `host.save` is already the offence |
| 2 | **computed member**: `host['sa' + 've'](x)` | **FAIL**, by two independent rules | (a) `host` had to come from somewhere: an import (metafile, `FENCE-VIEW-IMPORT`) or a parameter (row 5). (b) the scan ALSO fails on a computed member access whose key is not a string literal, on any identifier in the file, as `FENCE-COMPUTED-MEMBER`. False positives: array indexing `rows[i]`. Policy: the rule applies only when the object identifier is NOT declared in this file as an array or a Map literal - and where that cannot be decided, the fence FAILS and the author writes it differently. A view that needs a dynamic property lookup on an unknown object is already doing something a view should not do |
| 3 | **dynamic import**: `await import("./food-host.mjs")` | **FAIL** `FENCE-VIEW-IMPORT`, from the metafile, `kind: "dynamic-import"` | the metafile records dynamic edges; `build.mjs:396-:400` already reads `edge.kind` for exactly this |
| 4 | **writer re-exported through a view helper**: `module.exports.commit = (h) => h.save(x)` in `today-view.cjs` | **FAIL** twice: `.save` in code position, and `commit` as an exported name on the writer list | |
| 5 | **the smuggled callback**: the sealed half passes `cb.recordIntake`; the view stores it and calls it from its own paint path rather than from a click | **the static fence CANNOT catch this, and I will not pretend it can** | see E.6 |

Plus the fence's own five structural rows, from D.2 of the S9 spec, re-asserted here because this cell
reads the inventory the same way: a deleted chain ref FAILS; a worktree artifact that differs from the
chain FAILS; a branch that widens `released` in its own worktree and then touches that path FAILS; two
artifacts at the same `N` FAIL; a reseal child SKIPS with its reason printed.

### E.6 The blind spot, named, and what covers it instead

A callback that the sealed half hands to the view is, to any static reader, just a function. Nothing in the
file's text distinguishes `cb.recordIntake(nodes)` called from a click listener from the same call made at
the top of a render function. **No token scan and no parser can fence it.** Saying otherwise would be the
kind of reassurance `S9-RELEASE-SPEC.md` C.5 was made to replace with a measurement.

What covers it, and it is a RUNTIME guard in the SEALED half, not a static one:

Every writing entry in `cb` is wrapped, in `today-app.cjs`, in a one-line guard that refuses unless it is
running inside a user gesture: `if (!gestureOpen) throw new Error("WRITER-OUTSIDE-GESTURE: " + name)`,
where `gestureOpen` is set true by the sealed half's own `wire()` listener shim for the duration of the
synchronous part of a DOM event dispatch and false otherwise. The view's click handlers are installed
through that shim (`today-chrome.cjs`'s `wire` calls `cb.on(el, "click", fn)`), so a legitimate call
passes and a call made during a paint throws.

This is a REAL PRODUCT CHANGE to the sealed half - about 12 lines - and it is the one place this spec asks
for new sealed code rather than a pure move. It therefore belongs to the split round, under the reseal
child that carries the split, and it needs its own red-first cell: a view that calls `cb.recordIntake()`
from its render path must throw `WRITER-OUTSIDE-GESTURE` and record nothing, proven against the real
food lane with the store open. **If the PM refuses new sealed code in this round, the guard moves to the
round after and the fence ships with E.6 as a written, accepted blind spot - but it must be written down
in the S9 or S10 brief, not left to be discovered.**

---

## F. `today-model.cjs`

### F.1 The cut

| stays in `today-model.cjs` (SEALED-class; sealed by the child that carries the split) | moves to `today-projection.cjs` (FREE, pure) |
|---|---|
| `createTodayModel` `:150-:457` and its whole closure (`readings`, `foodDays`, `sleepNights`, `basis`, `pendingAdoption`, `lastMessage`) | `clone` `:57` |
| `weighIn` `:378-:398` and its three refusals `ALREADY_RECORDED` `:365`, `OUT_OF_RANGE` `:373`, `FORM_MIN`/`FORM_MAX` `:372` | `previewClock` `:62-:75` |
| `reopen` `:401-:405` | `engineClockFor` `:78-:81` |
| `adoptBasis` `:412-:420`, `setPendingAdoption` `:423` | `createBasisState` `:86-:90` |
| `storedReads` `:202`, `storedFoodDays` `:208`, `storedSleepNights` `:241` (they read a LANE) | `hasOpenProposal` `:115-:118` |
| `stateFromOps` `:219`, `foodProjectionOf` `:227`, `sessionFor` `:245`, `adoptedRead` `:260`, `whySections` `:265`, `read` `:288-:361` (they close over `basis` and `pendingAdoption`) | `planMove` `:120-:126` |
| | `projectionOf` `:128-:140` |

`today-model.cjs` keeps its `module.exports` surface (`:459-:463`) unchanged by re-exporting the seven:
`createBasisState`, `previewClock`, `engineClockFor` and `projectionOf` are already exported and are read
by `today-entry.mjs`, the test cells and `local-real-day.test.mjs`. Nothing downstream sees the move.

`whySections` `:265-:286` is a judgement call I want the reviewer to check: it is pure over a `view` object
and looks like projection, but it reads `view` fields that `read()` builds from `basis`, so moving it
would split one screen's composition across two files for no gain. **Recommendation: it stays.**

The refusal constants `ALREADY_RECORDED` and `OUT_OF_RANGE` are COPY, and by the logic of B.2 they should
go to a copy module. **They must not.** They are the words `weighIn` composes at `:380` and `:385`, inside
the writer, behind the admission bounds - the same shape as residue R1 - and moving them changes saving
code. They stay in `today-model.cjs`. C-UI-3's LOCKED line already says the weigh-in copy is the
inventory's verbatim, so nothing is lost.

### F.2 Where the in-flight S2 sentence logic lives after the split

`rebuild/c-s9-today-carry` is pushed; I synced it into the farm and read it at `c26081ad`. Against
`724ef3f` it adds, in the two files this ticket touches:

| hunk | file, lines at `c26081ad` | class | after the split |
|---|---|---|---|
| `marchingOrderSentence(order)` | `today-model.cjs:128-:151` (new top-level function, between `planMove` and `projectionOf`) | **COMPUTES, pure**: it reads only the object the engine returned, trims three strings and joins them with a comma and a colon | **`today-projection.cjs`**, beside `planMove` and `projectionOf`, which are its immediate neighbours today. It is exported and re-exported through `today-model.cjs`'s surface, which is what the carry lane's `module.exports:493` already does |
| `view.orderSentence = marchingOrderSentence(view.marchingOrder);` | `today-model.cjs:386-:390` (one line plus its comment, inside `read()`, after the adoption gate) | BINDS: it sets a field on the view object | **stays in `today-model.cjs`**, inside `read()`, unmoved. `read()` is sealed-class |
| the binding change | `today-app.cjs:865-:870`: the comment rewrites and `put(map, "instruction-why", owed ? (view.orderSentence \|\| view.statusFace.cause) : ...)` | **DRAWS** | **`today-view.cjs`**, inside `renderToday`. It is a pure slot binding over a view-model field |

So the carry lane's three hunks land in three different places after the split, and **none of them lands
in a WRITES region**. The carry can merge before or after the split; G says which order I recommend.

One note for the merge: the carry lane also edits `design.cjs` (+19/-3), `test/adapter.test.mjs` (+37/-2)
and `test/view.test.mjs` (+18/-2), and adds `rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs`. The
`design.cjs` hunk and the split's own `VIEW_SOURCES` widening (C.5) touch the same file and may touch the
same region; whichever lands second resolves it, and the conflict is textual, not semantic.

---

## G. SEQUENCING, merge-forward only

### G.1 Against C-UI-1

**C-UI-1 does not touch `today-app.cjs`. Verified, two ways.** (a) Its ticket's MAY CHANGE list is
`design.cjs`, a new `scene.mjs`, `preview.css`, `build.mjs`, `browser-check.mjs`, and names no other file.
(b) At `origin/rebuild/c-ui-port` (`ab94d60e`), `git diff --numstat 724ef3f HEAD -- rebuild/m3/` is one
row, `rebuild/m3/w7-preview/today/today-model.cjs 1/39`, and nothing for `today-app.cjs`.

The one overlap is `build.mjs`: C-UI-1 edits it to serve assets offline and honour the review hooks; the
split edits `REQUIRED_INPUTS` (B.6). Different regions of the file, a textual conflict at worst.
**Recommendation: C-UI-1 lands first** (it is the ticket everything else binds to, by its own WHY line),
and the split rebases forward onto it. Never the reverse: the split's branch must not be the one C-UI-1
merges into, because the split is the larger and riskier change and it should be the one that moves.

### G.2 Against `rebuild/c-s9-today-carry`

The carry is small (5/4 in `today-app.cjs`, 33/0 in `today-model.cjs`), it is reviewed twice with 0
BLOCKING, and its `today-app.cjs` hunk is at `:865-:870`, four lines below `renderToday`'s head and
squarely inside a DRAWS region. **Recommendation: the carry lands FIRST**, before the split branch is cut
for the build round. Reasons: (1) it is already reviewed and accepted, and holding it behind a multi-day
split is a cost for nothing; (2) landing it first means the split's D.1 and D.2 baselines are taken on a
tree that already has it, so the split's proofs cover it; (3) landing it second means re-running D.2's
DOM snapshot, since `orderSentence` changes what the instruction-why slot renders in the T-09 family.

If the PM lands the carry second anyway, the rule is: its `today-app.cjs:865-:870` hunk applies to
`today-view.cjs`'s `renderToday` instead, its `today-model.cjs:128-:151` hunk applies to
`today-projection.cjs`, and its `read()` hunk applies unchanged. That is a three-way move a human does in
ten minutes; it is not a conflict, it is a relocation, and the carry's author should be told which.

### G.3 Against the design lane's C-UI-2 and later builds

**They base on the split branch, from the commit that lands the split on the chain, and not before.**
Concretely: C-UI-2 through C-UI-7 branch from the merge commit of the reseal child that carries the split
(G.4), never from `724ef3f` and never from the split's own unmerged lane branch.

What each may touch, after that commit:

| ticket | may touch | may NOT touch |
|---|---|---|
| C-UI-2 | `today-view.cjs`, `today-copy.cjs`, `today-chrome.cjs`, `screens.template.html`, `design.cjs`, `preview.css`, `checkin-*` where Today's Recovery row binds | `today-app.cjs`, `today-model.cjs`, any `*-host.mjs` |
| C-UI-3 | `today-view.cjs`, `today-copy.cjs`, `screens.template.html` | as above, plus `today-model.cjs`'s weigh-in refusals (F.1) |
| C-UI-5 | `machine-settings-view.mjs`, `gym-app.mjs` (still SEALED: this ticket still rides a child) | - |
| C-UI-6 | a new `coach-app.mjs`, `today-view.cjs`, `today-copy.cjs`; and the router's screen table IF C.4 option (c) landed | `today-app.cjs` otherwise |
| C-UI-7 | `today-food-view.cjs`, `today-sleep-view.cjs`, `today-copy.cjs`, `food-*`, `reading-host.mjs` (SEALED: that part still rides a child) | `today-app.cjs` |

Two tickets may run in parallel only if they touch different view files. C-UI-2 and C-UI-7 can
(`today-view.cjs` vs the food and sleep views). C-UI-2 and C-UI-3 cannot: both are in `today-view.cjs`,
and C-UI-3's own SEQUENCING line already says "after C-UI-2".

### G.4 Which reseal child carries the split

**S10, not S9, and I recommend it without much hesitation.**

S9 is a RELEASE round whose closed list is two paths and whose whole spec is written around the finding
that `today-app.cjs` is not one of them (`S9-RELEASE-SPEC.md` 0 and A.6). Its brief, its PM token line and
its two reviews all say `today-app.cjs` stays sealed. Putting a 2600-line split into it would rewrite the
round its reviewers just accepted, and it would put the S9 release behind a multi-day build.

Against that: `S9-RELEASE-SPEC.md` A.2 explicitly names this split as "a lane D or lane C ticket with its
own review, not a tooling hunk... not S9's work", and E.2's order of work has S9 starting now.

**So: S9 ships as specified, the split builds in parallel as lane C, and S10 carries it.** The one thing
that must move earlier is hunk H18 (B.6): without it the six new `REQUIRED_INPUTS` entries have no teeth,
and H18 is already an S9 hunk. If the PM drops H18 from S9, the split must carry its own version of it.

**The paths S10 must declare:**

| path | role |
|---|---|
| `rebuild/m3/w7-preview/today/today-app.cjs` | `edited` |
| `rebuild/m3/w7-preview/today/today-model.cjs` | `edited` |
| `rebuild/m3/w7-preview/today/today-copy.cjs` | `new`, and RELEASED in the same artifact's `released` block |
| `rebuild/m3/w7-preview/today/today-chrome.cjs` | `new`, RELEASED |
| `rebuild/m3/w7-preview/today/today-view.cjs` | `new`, RELEASED |
| `rebuild/m3/w7-preview/today/today-food-view.cjs` | `new`, RELEASED |
| `rebuild/m3/w7-preview/today/today-sleep-view.cjs` | `new`, RELEASED |
| `rebuild/m3/w7-preview/today/today-projection.cjs` | `new`, RELEASED |
| `rebuild/m3/w7-preview/today/build.mjs` | `edited` if S9 has not released it yet; otherwise free and outside the declaration |
| `rebuild/m3/w7-preview/today/design.cjs` | free, outside the declaration (C.5) |
| `rebuild/m3/w7-preview/today/test/design.test.cjs` | `edited` (D.3) |
| `rebuild/m3/w7-preview/today/test/copy.test.mjs` | `edited` (D.3) |
| `rebuild/m3/w7-preview/today/test/food.test.mjs` | `edited` (D.3) |
| `rebuild/m3/w7-preview/today/test/problem.test.mjs` | `edited` (D.3) |
| `rebuild/lanes/c/ui-port/writer-fence.test.mjs` | `new`, the fence cell (E) |
| `.github/workflows/rebuild.yml` | `edited`: one new step naming the fence cell by exact path, never globbed (`DECISIONS:117 (4)`, `:186 (3)`) |
| `rebuild/lanes/c/today-split/writes-fence.mjs`, `writes-regions.json`, `dom-snapshot.mjs`, `copy-census.mjs` | `new`, the proof scripts of D |

Six new sealed-inventory entries whose role is `new` and whose seal state is RELEASED in the same breath is
an unusual declaration, and S10's author should expect the runner to need the `released` block S9 builds.
**That is the strongest single argument for S10 over S9: S10 can use the mechanism S9 builds, instead of
building and using it in the same round.**

---

## H. RISKS, STOP CONDITIONS, THE BAR, THE ESTIMATE

### H.1 Risks

| # | risk | how likely | what it costs | what reduces it |
|---|---|---|---|---|
| 1 | **The handler wiring breaks and nobody notices.** `DECISIONS:454` round 2 found this exact file's handler wiring broken once already | the highest risk in the ticket | a tap that records nothing, or records twice | D.2's DOM snapshot does not catch a broken listener, because the snapshot is of markup. **The build round must add, to its own proof set, a LISTENER CENSUS: for every state, the count of `addEventListener` calls per slot name, before and after, equal.** I am adding this to D as proof 2b rather than leaving it to the round |
| 2 | **The mount-token staleness guard is weakened.** Four writers read `mountToken` to decide whether a settled promise may paint (`:648`, `:841`, `:1872`) | medium | yesterday's Today painted over today's, which is the bug `:2276-:2287` documents at length | B.4 keeps `mountToken` entirely sealed and turns the read into `cb.live()`. The red-first cell: a save that settles after a screen change must apply nothing |
| 3 | **The copy census passes while a sentence moves between slots.** D.4 compares a multiset of literals, not their placement | medium | a refusal under the wrong field | D.2's DOM snapshot catches it, because the snapshot is per state and per node. The two proofs are complementary and neither alone is enough |
| 4 | **`design.cjs`'s `VIEW_SOURCES` widening drops a module quietly.** `design.test.cjs:82-:87` checks each named file contributes a marker line, but a file NOT named contributes nothing and nothing complains | medium | the design binding stops covering a view file's copy | the `deepEqual` at `:79-:81` is the guard, and D.3 lists its edit. The build round asserts `VIEW_SOURCES.length === 10` by literal |
| 5 | **`assertImportRouteIsolation` fails late**, only at the build step | low | a rework | it fails LOUDLY and early (`package.test.cjs:94-:107` is in the today suite), and B.5 is designed around it. This risk is really a feature |
| 6 | **The fence's computed-member rule (E.5 row 2) is too broad** and fails honest view code | medium | friction | the policy is written down in E.4 and the escape is a rename, not an exception. If it fires more than twice in the build round, the PM narrows the rule on purpose |
| 7 | **The `sleepDraft` accessor changes behaviour at the margin.** 14 assignment sites become calls | low but real | a keystroke lost, a mode not switched | D.2's snapshot covers the drawn result of every draft state the inventory names (T-73..T-95). A red-first cell per draft key |
| 8 | **`copy.test.mjs:406`'s planted-dash cell is re-pointed and quietly loses its teeth** | low | the dash guard stops covering the page's own strings | the re-pointed cell must be run RED first against `today-copy.cjs` on the split branch, and the report carries that red output |

### H.2 STOP conditions

The build round STOPS and reports rather than proceeding when:

1. **A writer cannot be separated from its drawing code without changing behaviour.** The three known
   crossings are `today-app.cjs:1076`, `:1283` and `:1306-:1308` (section C.3), and the design handles all
   three by LEAVING THEM WHERE THEY ARE. **If a fourth is found - a line inside a WRITES region that the
   build round cannot leave in place and cannot move without changing the writer - that is a STOP**, and
   the report shows the lines.
2. **D.1 fails**: any of the 21 WRITES regions has a different sha256 after de-indentation. No exceptions,
   no "it is only a comment".
3. **D.2 fails**: any state's DOM snapshot differs, or more than three states are reported NOT COVERED.
4. **D.3 grows**: a tenth test edit, or any edit that removes or weakens an assertion rather than
   re-pointing it at the new file.
5. **D.4 fails**: the copy multiset is not equal.
6. **The re-export surface changes**: `Object.keys(require("./today-app.cjs")).sort()` differs, which would
   force an edit to the pinned `today-entry.mjs` (B.6).
7. **E.6's runtime guard cannot be built in 12 lines or thereabouts** without changing what a writer does
   on the happy path. Then the guard is deferred, the blind spot is written into the brief, and the round
   continues - this one is a stop-and-ask, not a stop-and-abandon.
8. **The reseal child's declaration is refused by the runner** because six `new` + `released` entries is a
   combination the mechanism does not support. Then the split waits for the round after S9, which is G.4's
   recommendation anyway.

### H.3 The bar

LANES.md screens tier, plus the seal chain's own bar because the split rides a reseal child:

- the 682-test today suite green on both runners (`rebuild.yml:232`), with only the nine edits of D.3;
- the whole `rebuild-public` workflow green on ubuntu and windows;
- `python3 quality/gate.py` and `python3 quality/statesheet.py` from the 2026-09-18 pack, with `EARNED_APP`
  pointed at the preview build, green for `today` and for every T state the suite renders;
- the six proofs of D, committed as artifacts, plus proof 2b (the listener census, H.1 risk 1);
- the writer-fence cell RED first on all ten rows of E.5, then green;
- one independent Opus reviewer, author is not reviewer, told to disagree, committing ONLY the review file;
- `--ci --package S<N>` green (the byte proof) and the inventory fence (`S9-RELEASE-SPEC.md` D.2) green;
- the browser check on the owner's PC, both themes, offline (D.5).

### H.4 Estimate, honest

I am estimating a round I will not run, on a file I read but did not execute, so the bands are wide.

| phase | hours | what drives it |
|---|---|---|
| the five view files, the copy module, the chrome module: the mechanical move | 3 to 4 | 1700 lines moving, mostly by cut and paste; the tokenizer map in A.2 is the cut list |
| the view-model builders and the callback table (B.3) | 3 to 5 | five builders, 25 one-way fields, and getting the SEQUENCE of `model.read()` calls identical |
| the four both-ways bindings (B.4), of which `sleepDraft` is most of it | 4 to 6 | 14 assignment sites, 5 intent flags, and a red-first cell per key |
| `today-model.cjs` into `today-projection.cjs` (F) | 1 | seven pure functions, one re-export line |
| `build.mjs` and the re-export surface proof (B.6) | 1 | |
| the four proof scripts of D, written red-first | 4 to 6 | D.2's driver is the big one: it must reach every T state the inventory names |
| the nine test edits of D.3, each re-run red first | 2 to 3 | |
| the writer-fence cell (E), ten red rows | 4 to 6 | E.5 rows 2 and 5 are the slow ones |
| E.6's runtime gesture guard, if it is in scope | 2 to 3 | 12 lines and a red-first cell against the real food lane |
| running the bar, fixing what it finds, the browser check | 3 to 5 | the today suite is 9 minutes in the farm and faster on the PC, but the gates and the browser check are hands-on |
| the author's report | 2 | |
| **BUILD ROUND TOTAL** | **29 to 42 hours** | call it **four to five working days** for one author |
| **THE INDEPENDENT REVIEW** | **8 to 12 hours** | the reviewer must re-run D.1, D.3 and D.6 from the branch, re-read D.2's driver for coverage gaps, hand-check the 33 crossing bindings of A.3 against the built interface, and try to break the fence with a sixth trick of their own |

Against that: six reseal children at three to four hours each, for C-UI-2, C-UI-3, C-UI-6 and C-UI-7 plus
their inevitable fix rounds, is 18 to 30 hours of ceremony that buys no code. The split costs more than
that once and then costs nothing. It pays back on the fourth ticket, and there are four.

### H.5 Open questions for the PM, each with a recommendation

| # | question | recommendation |
|---|---|---|
| Q1 | D(3) as the ticket words it ("no test edited except import paths") cannot be met: nine edits are needed and only seven are import paths (D.3). Does the PM accept the wider rule? | **Accept the wider rule as written in D.3**, with the nine edits listed by file and line in the brief. Every one re-points a guard at the new file; none weakens one. Refusing it does not make the edits go away, it makes them undeclared |
| Q2 | C-UI-6 needs two sealed lines (the coach route, residue R5). Reseal child, router move, or the screen table? | **The screen table (C.4 option c)**, written by the split round, which is already opening the file. Twenty lines once, against a three-to-four hour child for two lines |
| Q3 | E.6's runtime gesture guard is about 12 lines of NEW sealed code, which no other part of this spec asks for. In scope for the split round? | **Yes, in scope.** Without it the fence has a blind spot that a future view author will walk into. If the PM says no, the blind spot must be written into the S10 brief in one sentence, not left to be found |
| Q4 | S9 or S10 carries the split? | **S10** (G.4). S9's spec, token line and two reviews all say `today-app.cjs` stays sealed; S10 can use the `released` mechanism S9 builds instead of building and using it in one round |
| Q5 | Does the carry lane `rebuild/c-s9-today-carry` land before or after the split? | **Before** (G.2). It is reviewed, accepted and four lines of drawing code; holding it behind a multi-day split costs something and buys nothing, and landing it first means the split's D.1 and D.2 baselines already cover it |
| Q6 | `sleepDraft` by accessor (B.4) or by reference? | **By accessor.** By reference gives a free file a mutable handle on sealed state and makes section E unable to say anything about it. The cost is 14 call sites in drawing code |
| Q7 | `put()` renamed to `slot()` (E.4) so the fence's word list needs no exception. Acceptable? | **Yes.** It is a rename in drawing code, it appears in the diff, and it removes a collision rather than carving a hole in the fence. `put` is used about 90 times, all in regions that move |
| Q8 | Five view files or one? | **Five** (B.2). One file puts C-UI-2, C-UI-3 and C-UI-7 in the same file and re-creates, inside lane C, the contention the seal was causing |
| Q9 | Hunk H18 (the `REQUIRED_INPUTS` teeth, `S9-RELEASE-SPEC.md` A.4) is an S9 hunk. If S9 drops it for scope, the split's six new entries have no teeth either | **Ask S9 to keep H18.** If it is dropped, the split carries its own version, and the split's estimate in H.4 grows by 2 to 3 hours |
| Q10 | This split frees C-UI-2, C-UI-3, C-UI-6 and C-UI-7. C-UI-5 still rides a child, for `gym-app.mjs` (`:161-:166` opens IndexedDB and mints `createMachineSettingsHost`). Is a second split wanted? | **Not now.** C-UI-5 is 45 W states of which two cite `today-app.cjs` and neither is an edit. Finish this split, ship four tickets as plain lane C, and judge `gym-app.mjs` on what that round actually costs rather than on this one's estimate |

---

## Appendix: what I did NOT verify, stated so it is not assumed

1. **I ran nothing.** No test suite, no build, no `b-package.cjs`, no gate. Every line number is read, not
   executed. The 682 test count is the ticket's, not mine.
2. **The region map in A.2 came from a tokenizer I wrote for this ticket**, not from a parser. I checked
   every WRITES region by hand and every region cited in C by hand; I did NOT hand-check all 96 regions.
   A region misclassified as DRAWS that in fact writes would be caught by D.1 (its text would not appear in
   the manifest) only if the manifest is right, so **the build round must re-derive the manifest and
   compare it to A.2 before trusting either.**
3. **I did not read `test/setup.test.mjs:1035`'s assertion in full**, only the line that reads
   `today-app.cjs` as text. D.3 flags it as unknown.
4. **I did not verify which of the 13 today cells are in the sealed inventory.** `S9-RELEASE-SPEC.md` A.3
   says twelve of them are `carried`; there are thirteen at `rebuild.yml:232`. The build round must resolve
   which one is not, because D.3's edit list crosses that line.
5. **I did not read `rebuild/conform/private`, `src/history.js`, any `ledger/` directory, the protected
   soak, or anything on the owner's data path.** The owner's real measurements are not in this session.
6. **I did not open `rebuild/m3/w7-preview/import/` or `measure/`**, so B.5's claim that their screens'
   deps objects can stay sealed rests on `today-app.cjs`'s side of the interface only.
7. **The estimate in H.4 is a hypothesis**, and this whole document is one. Disagree with it where the
   evidence lets you.
