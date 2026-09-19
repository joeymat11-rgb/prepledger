# TODAY-SPLIT-SPEC v2 - extracting the WRITERS, so the two view files are released under their own names

Lane C, ticket TODAY-SPLIT-SPEC, ROUND 2. Author: cowork (Earned lane hand, lane C), round 2; the v1
author is gone and this document continues its work rather than replacing it. Branch
`rebuild/c-today-split`. SPEC ONLY: this round authors this one file and moves no product, test,
tooling or workflow byte.

**The ref.** Every line number in this document is read at the chain tip `c15a69c0`
(`rebuild/t2-client-core`, farm-synced for this round, privacy proof PASS), not at v1's `724ef3f`.
The two refs agree on every region boundary I re-measured in `today-app.cjs` and `today-model.cjs`;
where a line number in this document differs from v1's or from one of the two input maps, the
difference is named where it occurs and this ref is the one that stands.

Read before this: `DECISIONS:536` (the release and its rule) and `DECISIONS:542` (R2 REJECT, PM-R1
to PM-R9, and (C), the TODAY-SPLIT ruling); `rebuild/lanes/b/S9-RELEASE-SPEC.md` sections A, B and D
at `d859096a` on `rebuild/b-s9-ui-pins`; the blind map
`/home/claude/farm/scratch/split/blind-map.md`; the look-versus-seal map
`/home/claude/farm/scratch/look-vs-seal/MAP.md`; `rebuild/lanes/c/ui-port/C-UI-1.md` .. `C-UI-8.md`.

---

## v1 to v2: what changed and why

v1 extracted the VIEW: about 1700 lines of drawing left `today-app.cjs` for five new free modules,
`today-app.cjs` kept `mountToday`, the router and all seventeen writer regions, and stayed SEALED.
PM4 reversed the direction (ruling S-R1): the WRITERS leave, into one new SEALED module, and
`today-app.cjs` keeps its name, its `mountToday`, its router, its drawing and its copy, and is
RELEASED through the `released` role S9 builds. This version carries that out.

**What v1 got right and is kept here.** Its method (A.0), its region map (A.1, A.2), its crossing
binding census (A.3), the writer-fence (E), the `today-model.cjs` section (F) and the sequencing (G)
are careful work. They are marked KEPT FROM v1 where they stand, with every line the new direction
changes named inside the section rather than in a separate erratum.

**What is new.** Sections B and C are written from nothing. D, E, F, G and H are re-aimed.

**The seven things I found that neither v1 nor either map says, and that the build round needs.**

1. **The move is about 650 lines, not the look map's 455 and not v1's 560.** The look map's nine
   regions omit five writer regions and every writer statement in the module body. B.2 reconciles
   the three counts region by region, as S-R1 requires.
2. **There is a second interface, in the other direction, and it is not optional.** The sealed half
   must be able to repaint, to read the router's cursor and the mount token, to write the status
   line and to clear the view's draft: `openSleepLane:531` and `:537` already read `screen` and call
   `render`, and `recordSleep` compares `mountToken` five times. B.4 names it the PAINT HANDLE,
   bounds it to five paint-only functions, and shows why handing it across is safe when handing a
   writer the other way is not.
3. **The writer must stop composing sentences, and that is the change that frees C-UI-7.**
   `recordSleep`'s `say` (`:1812`) sets one of nine module-level copy constants on eleven paths.
   Under the new direction the writer returns a typed OUTCOME and the released view maps outcome to
   sentence, so no copy moves, `VIEW_SOURCES` does not change, and `design.test.cjs:79-81` and
   `copy.test.mjs:406` need no edit at all. B.6 lists the six outcome shapes.
4. **`today-app.cjs` must keep `createTodayModel` on its export surface**, because `today-entry.mjs`
   is pinned on disk and reads it there (`today-entry.mjs:44`). A released file therefore names a
   model factory. B.7 disposes of it with a measured re-export rule the fence asserts, not an
   exception.
5. **The import and measure routes' dynamic imports must move too.** `renderImport:713` holds
   `import("../import/import-screen.mjs")`, and `rebuild/m3/w7-preview/import/**` is SEALED by
   `:536` by name. A released file may not hold the door to the admission path. That costs one
   edit to `build.mjs:391` and one to the sealed cell `package.test.cjs:105`, both re-points.
6. **The test edit list is THREE, not zero and not nine.** Two sealed cells slice a writer out of
   `today-app.cjs` by its declaration text (`food.test.mjs:1153`, `problem.test.mjs:1100-:1101`) and
   one plants an import edge on it (`package.test.cjs:105`). Every one is a file-name re-point that
   keeps the assertion's teeth. ZERO import paths change. D.3 lists them with their new values.
7. **The `released` role can carry a file that is edited in the same package, and the S10 author
   must be told WHY on purpose.** A released entry has `pre` = the parent's pin and `post: null`,
   and walk 1 re-asserts it in Git at `sourceBase`, never on disk at HEAD
   (`S9-RELEASE-SPEC.md` at `:1829-:1833` and its B.4). So the package that releases
   `today-app.cjs` may change it in the same breath, and the seal will say nothing about the new
   bytes - by design, which is exactly the trade `:536` recorded. G.4 states it out loud so no S10
   reviewer discovers it.

**What I refuse or qualify in the PM's own reasons.** Named here and argued where they are carried
out: reason (c) is understated, reasons (e) and (f) need a correction, and clause S-R2's
"refusal decisions for anything that gets stored live in the sealed half" cannot be met in full in
this round without scope the PM has not granted. H.5 holds all four with their evidence.

---

## A. THE MAP - KEPT FROM v1, with the counts reconciled

### A.0 Method, and what I did not do - KEPT FROM v1, extended

v1's tokenizer method and its warning stand unchanged, and so does the blind map's independent
tokenizer (blind map section 0, which found and fixed a real bug in its own first pass). I added
nothing to the tooling. For v2 I re-read, at `c15a69c0` and by hand: `today-app.cjs:352-:2625`
region head by region head (the full declaration list, 120 regions), the three seams line by line,
the router `:2272-:2380`, the boot `:2430-:2551`, the returned api `:2552-:2619`,
`today-model.cjs:150-:200` and `:355-:430`, `gym-app.mjs:108-:182` and `:286-:322`,
`machine-settings-view.mjs:1-:60`, `food-model.cjs:30-:64`, the four lane hosts' DOM census, and
every sealed cell line that names `today-app.cjs` or `gym-app.mjs` as a literal.

I ran no test suite, no `b-package.cjs` and no build: this lane is spec only. I opened no sealed
file outside the inventory this ticket names, and no file on the owner's data path.

### A.1 and A.2, the region maps - KEPT FROM v1 unchanged

v1's A.1 (the twelve regions above `mountToday`) and A.2 (the region-by-region map of `mountToday`)
are the cut list and they are kept verbatim in substance. I re-derived the region heads at
`c15a69c0` and they agree with v1's table at every boundary I checked. Two corrections, both small:

- v1's A.2 marks **eighteen** rows `WRITES` and then says "Counted: 17 WRITES regions". The table is
  right and the sentence is wrong. The eighteen are listed in B.2 below.
- The look map's `3.3` puts the weigh-in refusal paint at `today-app.cjs:1077`. At `c15a69c0`,
  `:1076` is `error.textContent = plainOrDrop(result.copy || ..., "weigh-error")` and `:1077` is
  `input.focus()`. v1's `:1076` is the right line.

### A.3 The crossing bindings - KEPT FROM v1, and mostly dissolved by the new direction

v1 counted 33 crossing bindings; the blind map counted 31 over the same scope. The difference is
bookkeeping (v1 groups `sleepOpening`/`sleepSaving`/`sleepLaneFailure` as one row and splits
`workoutRebinding`; the blind map does the reverse) and neither count is wrong. **Both tables are
kept as the acceptance test of the cut**, and B.5 walks every binding in them by name under the new
direction.

The important thing S-R1 (d) claims and I can now confirm: under the new direction a crossing
binding is no longer a design problem in general, because the two halves no longer need a frozen
snapshot to pass between them. The view READS through a live read-only facade and WRITES nothing;
the sealed half writes and reads its own state. Twenty-five of v1's 33 become plain facade getters
with no snapshot, no clone and no freeze. What remains is the eight bindings B.5 disposes of by
name, and they are a smaller set than v1's four hard ones plus the `sleepDraft` family, because
`mountToken`, `screen`, `checkinOrigin`, `todayEntry`, `adoptionSettled`, `sleepDraft` and the five
sleep intent flags all end up on the side of the fence that already owns them.

### A.4 `today-model.cjs` - KEPT FROM v1 unchanged

v1's A.4 table stands. Section F re-decides what moves out of it, and only that.

---

## B. THE CUT (NEW - S-R1, S-R2, S-R3, S-R4)

### B.1 The direction, in six lines (S-R1)

1. `today-app.cjs` keeps its NAME, `mountToday`, the router `render`, every DRAWS and BINDS
   READ-ONLY region, all 351 lines of prologue and copy, the whole export surface, and the drawing
   half of the boot. It is **RELEASED** in the same artifact that carries the split.
2. ONE new module, `rebuild/m3/w7-preview/today/today-lanes.cjs`, is **SEALED** (`role: new`). It
   takes every lane opener, every host and IndexedDB handle, the adoption gate and chain, the
   rebind, and every call of a durable writer: about 650 lines.
3. `gym-app.mjs` keeps its name and is RELEASED; ONE new module,
   `rebuild/m3/w7-preview/today/gym-settings-lane.mjs`, is SEALED and takes the settings lane: about
   80 lines (S-R4).
4. The sealed module exports ONE factory. It hands the view a frozen READ-ONLY FACADE and a frozen
   CALLBACK TABLE, and nothing else (S-R2, B.3).
5. The view hands the sealed module a frozen PAINT HANDLE of five paint-only functions, and nothing
   else (B.4). Nothing that can write crosses toward the view, in either direction.
6. `today-model.cjs`'s two durable writers move to a small sealed sibling; its projection, its
   `read()`, and the S2 composer `marchingOrderSentence` stay free (F, S-R3).
### B.2 What moves out of `today-app.cjs`, and the two counts reconciled (S-R1)

S-R1 asks for the reconciliation region by region. Here it is, at `c15a69c0`. "v1" is v1's A.2
table; "look" is the look map's `3.3` second table. A blank cell means that map does not carry the
region at all.

| # | region | lines | code lines | v1 | look | moves? |
|---|---|---|---|---|---|---|
| 1 | `model.setFoodDays(foodLane)` boot statement | `:422` | 1 | | | YES |
| 2 | `model.setSleepNights(sleepLane)` boot statement | `:482` | 1 | | | YES |
| 3 | `sleepEntryFor` | `:484-:503` | 20 | WRITES | in row 1 | YES, whole |
| 4 | `sleepRowsMatter` | `:507-:508` | 2 | COMPUTES | | YES (a predicate over a lane) |
| 5 | `openSleepLane` | `:510-:541` | 32 | WRITES | in row 1 | YES, whole |
| 6 | `checkInKit`, `checkInKitLoading`, `checkInLive` | `:551-:555` | 5 | WRITES | | YES |
| 7 | `loadCheckInKit` | `:556-:566` | 11 | in row 6 | row 2 | YES, whole |
| 8 | `loadCheckInKit()` boot statement | `:567` | 1 | | | YES |
| 9 | `foodEntryFor` | `:569-:591` | 23 | WRITES | in row 3 | YES, whole |
| 10 | `openFoodLane` | `:593-:618` | 26 | WRITES | in row 3 | YES, whole |
| 11 | `measureScreen`, `measureState`, `measureDeps` | `:628-:643` | 16 | WRITES | row 4 | YES |
| 12 | `renderMeasure`'s dynamic import and cache write | inside `:645-:680` | 8 | DRAWS | | YES (finding 5) |
| 13 | `importScreen`, `importAdmitted`, `importDeps` | `:688-:701` | 14 | WRITES | row 5 | YES |
| 14 | `renderImport`'s dynamic import and cache write | inside `:703-:721` | 9 | DRAWS | | YES (finding 5) |
| 15 | `workout.recover()` in the primary handler | `:954` | 1 | DRAWS | | SEAM 4 |
| 16 | the weigh-in submit's write half | `:1071-:1073` | 3 | DRAWS | row 6 | SEAM 1 |
| 17 | `recordIntake` | `:1278-:1319` | 42 | WRITES | row 7 | SEAM 2 |
| 18 | `retryFoodRead` | `:1324-:1334` | 11 | WRITES | in row 7 | YES, whole |
| 19 | `readSleepCheckIn` | `:1410-:1427` | 18 | WRITES | | YES, whole |
| 20 | `sleepToday`, `sleepNightDate` | `:1373-:1376` | 4 | BINDS | | YES (they read the lane host) |
| 21 | `sleepClockCheck` and its three flags | `:1384-:1393`, `:460`, `:462-:463` | 13 | COMPUTES | | YES (it gates the write, `:1818`) |
| 22 | `sleepOpsFor` | `:1450-:1455` | 6 | BINDS | | YES (it reads `sleepLane.rows()`) |
| 23 | `retrySleepRead` | `:1727-:1756` | 30 | WRITES | in row 8 | YES, whole |
| 24 | `recordSleep` | `:1807-:1930` | 124 | WRITES | row 8 | SEAM 3 |
| 25 | `sameNight`, `committedSleepAttempt` | `:1935-:1948` | 14 | BINDS | | YES (reconciliation, writer only) |
| 26 | `reboundCheckIn` | `:1964-:2011` | 48 | WRITES | | YES, whole |
| 27 | `carryCheckInDraft` | `:2018-:2036` | 19 | BINDS | | YES (it serves `reboundCheckIn` only) |
| 28 | `workoutRebindQueued`, `rebindWorkout` | `:2048-:2092` | 45 | WRITES | row 9 | YES, whole |
| 29 | the router's setup branch body | `:2295-:2336` | 42 | DRAWS (router) | | SEAM 5 |
| 30 | the router's recovery branch body | `:2349-:2356` | 8 | DRAWS (router) | | SEAM 6 |
| 31 | the router's workout branch body | `:2362-:2369` | 8 | DRAWS (router) | | SEAM 7 |
| 32 | `canAdoptAthleteState`, `armAdoptionGate`, `willAdopt` and its arm | `:2430-:2441` | 12 | WRITES | | YES, whole |
| 33 | `athleteBasisState` | `:2482-:2489` | 8 | WRITES | | YES, whole |
| 34 | `adoptAthleteState` | `:2490-:2546` | 57 | WRITES | row 10 | YES, whole |
| 35 | `ready = settleAdoption(...)` boot statement | `:2550` | 1 | BINDS | | YES |
| 36 | the lane and write state declarations | `:362-:364`, `:366-:383`, `:410-:421`, `:432-:441`, `:454`, `:459-:464`, `:471-:474` | 42 | SHARED STATE | | YES, all but the draft |
| 37 | the api getters that hand out a lane, an entry or a write promise | inside `:2552-:2619` | 12 | BINDS | | YES (B.7) |

**The total: 663 code lines move out of `today-app.cjs`.** Of those, 601 move whole and 62 are the
seven seams. Against `today-app.cjs`'s 2625, that is 25 percent; against v1's 1700-line extraction
it is 39 percent.

**Where the look map's 455 comes from, and why it is low.** Its nine rows (ten, by its own table;
it says nine) carry rows 3, 5, 7, 9, 10, 11, 13, 16, 17, 18, 23, 24, 28 and 34 above, and omit rows
1, 2, 4, 6, 8, 12, 14, 15, 19, 20, 21, 22, 25, 26, 27, 29, 30, 31, 32, 33, 35, 36 and 37 -
principally `readSleepCheckIn`, `reboundCheckIn`, the adoption gate and chain, the router's three
entry-opening branches, every writer statement in the module body, and the shared state itself. The
blind map's section 1 catches most of the omissions (it lists `readSleepCheckIn`, `armAdoptionGate`,
`athleteBasisState` and the module-body statements explicitly, and warns in its own words that "an
extractor that only walks named functions will lose them"). **The look map's 455 is an undercount
of about 45 percent and the build round must not plan against it.** v1's 560 is nearer, and low for
the same reason: it counts named WRITES regions and not the module body, the router's branches or
the state.

### B.3 The interface: one factory, one facade, one callback table (S-R2)

```
// today-app.cjs (RELEASED), once per mount, immediately after the three element handles:
const lanes = TodayLanes.createTodayLanes(model, options, paint);   // paint: B.4
const view  = lanes.view;   // frozen READ-ONLY FACADE
const cb    = lanes.on;     // frozen CALLBACK TABLE
```

`createTodayLanes` is the module's only export besides the `createTodayModel` re-export of B.7. It
receives `model` and `options` - which carry every writer and every entry object - and the released
file **never names either of them again**. That is the one-handoff rule, and E.3 makes the fence
assert it: in `today-app.cjs` the identifiers `model` and `options` may occur only in `mountToday`'s
parameter list and in this one call.

**The READ-ONLY FACADE `view`.** Every entry is a function or a value; not one of them is, returns
or closes over a writer. Frozen at construction, and asserted frozen by a red-first cell.

| group | entries |
|---|---|
| the model's projection | `read()`, `today`, `stateFromOps()`, `loggedFood(day)`, `loggedSleep(date)`, `recordedFood(date)`, `recordedSleep(date)`, `foodUnavailable(date)`, `basisState()` |
| the engine, by named function only | `sleepSpanH(bed, wake, awakeMin)` - the one engine call a drawing region makes (`:1772`). The engine OBJECT does not cross |
| the food lane, as data | `foodLaneOpen()`, `foodOpening()`, `foodLaneFailure()`, `foodOpenedRefusal()`, `foodReadBack()` (a clone) |
| the sleep lane, as data | `sleepLaneOpen()`, `sleepOpening()`, `sleepLaneFailure()`, `sleepToday()`, `sleepNightDate(nightChoice)`, `sleepOpsFor(date)`, `sleepReadBack()`, `sleepAck()` (a clone), `sleepUnknown()`, `sleepBusy()`, `sleepOutcome()` (B.6), `sleepCorrecting()` |
| the check-in | `checkInDay()`, `checkInRow()`, `checkInPending()`, `checkInFailed()`, `checkInHoursOffer(date)`, `checkInLive()` |
| the three injected entries, as RESULTS only | `session()` (the result of `workout.summary()`), `checkinSummary()`, `firstRun()`, `laneHandles()`, `installationDevice()`, `setupSummary()` |
| the adoption chain | `importAdmitted()`, `adoptionSettled()`, `ready()` |

**The CALLBACK TABLE `on`.** Every entry takes RAW FIELD VALUES as the athlete typed or chose them
and returns a result object for the view to paint. No entry takes or returns a DOM node, a lane, a
host or a promise minted anywhere but here. Frozen, and the sealed half asserts at mount that every
value in it is a function it defined in this closure, by identity against a local array (v1's B.3
rule, kept).

| callback | raw arguments | what it does in the sealed half | writes? |
|---|---|---|---|
| `on.submitWeighIn(rawText)` | the box's text, untrimmed | trims, converts (`:1070`, `:1072` `Number(raw)`), calls `model.weighIn`, catches, returns `{ ok, copy }` | YES |
| `on.foodCheck(cal, pro)` | two box texts | `FoodModel.refusalFor` only. Returns `{ refusal }` or null. Stores nothing | no |
| `on.recordIntake(cal, pro)` | two box texts | the whole of `recordIntake` `:1280-:1318` less its two paints. Returns an outcome (B.6) | YES |
| `on.retryFoodRead()` | - | `retryFoodRead` `:1324-:1334` | YES |
| `on.sleepClock(typed, nightChoice)` | a boolean and a date string or null | `sleepClockCheck` `:1384-:1393`. Returns `{ rollover, openedNight, openedDay, nightDate }` | no |
| `on.recordSleep(draftValues, nightChoice)` | the eight draft members as typed or chosen, and the chosen night | the whole of `recordSleep` `:1808-:1929` with its sentences replaced by outcomes. Returns an outcome | YES |
| `on.retrySleepRead()` | - | `retrySleepRead` `:1727-:1756` | YES |
| `on.readSleepCheckIn(date, force)` | a date string | `readSleepCheckIn` `:1410-:1427` | YES (opens a lane) |
| `on.recoverWorkout()` | - | `workout.recover()` `:954` | YES |
| `on.openFoodLane()`, `on.openSleepLane()`, `on.loadCheckInKit()` | - | the three lane openers, unchanged | YES |
| `on.openSetup({ back })` | a paint closure | the setup branch body `:2296-:2336`, `done` and all | YES |
| `on.openCheckIn(origin, { back })` | a screen name and a paint closure | `reboundCheckIn` then `checkin.open` `:2349-:2356` | YES |
| `on.openWorkout({ back, checkIn })` | two paint closures | `workout.open` `:2362-:2369` | YES |
| `on.paintMeasure(root)`, `on.paintImport(root)` | the empty section the view drew | the dynamic import, the cache write, the deps object, and the foreign screen's own paint | YES |
| `on.listen(el, type, fn)` | a node, an event name, a handler | installs the handler through the sealed gesture shim (E.6) | no |

**Everything that parses, converts, bounds or decides a refusal for something that gets stored is
on the sealed side of that table.** `Number(raw)` at `:1072` goes with `submitWeighIn`;
`FoodModel.refusalFor` and `dayFromEntry` go with `recordIntake`; `SleepModel.refusalFor`,
`nightFromEntry` and `nightDateFor` go with `recordSleep`; `sleepClockCheck`'s rollover guard goes
with both. **One qualification of S-R2, stated where it bites** (H.5 item 4): `FoodModel.refusalFor`
(`food-model.cjs:37-:51`) and `SleepModel.refusalFor` (`sleep-model.cjs:59-:101`) DEFINE those
bounds and both files are free and named in C-UI-7's MAY CHANGE. The split moves the CALL into the
seal and cannot move the RULE without scope this ticket was not given. H.5 measures it and
recommends the cheap fix.

### B.4 The PAINT HANDLE: the other direction, bounded (new, and not optional)

The sealed half cannot be write-only. Three facts in the code force it:

- `openSleepLane:531` `if (screen === "today" || screen === "sleep") render(screen, false);` and
  `:537` the same on the failure path. A lane opener reads the router's cursor and repaints.
- `recordSleep` captures `const token = mountToken` at `:1839` and compares it at `:1852`, `:1872`,
  `:1880`, `:1886`, `:1896` and `:1928`. Every late write asks whether it may still paint.
- `adoptAthleteState:2545` reports its cause with `tell(athleteStateFailureCopy(error))`, and
  `recordSleep:1870`/`:1919` call `clearSleepDraft()`.

So the released half hands the factory ONE frozen object of exactly five functions, and the fence
asserts its shape:

```
const paint = Object.freeze({
  repaint: (name, focus) => render(name, focus),
  screenNow: () => screen,
  token: () => mountToken,
  tell: (error) => { if (status) tell(athleteStateFailureCopy(error)); },
  clearDraft: () => clearSleepDraft(),
});
```

**Why this is safe when a writer the other way is not.** Every one of the five reads or writes only
the SCREEN. None of them can store, mint, open or admit anything; the worst a bad implementation can
do is paint the wrong screen or lie about the token, and `recordSleep:1921-:1926` already says in
the file's own words that "Ownership governs PAINTING and NAVIGATION ... it never governs the
record". The token is a paint concern; the file says so; it stays with the paint. That disposes of
v1's B.4 `mountToken` problem and the blind map's probe 7 at once, in the right direction: the token
stays single-valued because there is still exactly one of it, in the released half, read through
`paint.token()`.

`paint.tell` takes the ERROR, not the sentence, so the copy composer stays in the released view
where C-UI-2 can edit it, and `athleteStateFailureCopy` does not move.

### B.5 Every crossing binding of A.3, disposed of by name under the new direction (S-R2)
| binding | declared | side after the cut | how |
|---|---|---|---|
| `foodLane`, `foodOpening`, `foodLaneFailure`, `foodReadBack` | `:410-:421` | SEALED | four facade getters; `foodReadBack` is cloned on the way out |
| `foodSaving` | `:412` | SEALED | **v1's hardest one-way-then-back binding dissolves.** Today the VIEW assigns it at `:1269` and `:1272`. After the cut `on.recordIntake` and `on.retryFoodRead` MINT the promise in the sealed half and assign it there; the view awaits the returned promise to paint and assigns nothing. `api.foodPending()` is served by the sealed half (B.7) and is exact |
| `sleepLane`, `sleepOpening`, `sleepLaneFailure`, `sleepReadBack`, `sleepAck`, `sleepUnknown`, `sleepBusy` | `:432-:471` | SEALED | facade getters; `sleepAck` cloned |
| `sleepSaving` | `:434` | SEALED | same as `foodSaving`; the view's `:1667` and `:1721` assignments disappear |
| `sleepErrorText` | `:464` | SEALED, and it stops being a sentence | it becomes `sleepOutcome`, a typed value (B.6). The D2 round 1 finding 6 property is PRESERVED exactly: the outcome is module state, not a node, so a save that outlives its paint still cannot write into the element it started with |
| `sleepCorrecting` | `:461` | SEALED | the writer clears it (`:1868`, `:1917`, `:1922`); the view sets it through `on.sleepCorrect(flag)`, a non-writing callback, and reads `view.sleepCorrecting()` |
| `sleepRollover`, `sleepOpenedNight`, `sleepOpenedDay` | `:460`, `:462-:463` | SEALED | they are the rollover GUARD the write refuses on (`:1818`). `sleepClockCheck` moves whole and both sides call the same one, so it is never duplicated. The blind map's probe 6 is answered: it is a writer concern, consulted by the drawing through `on.sleepClock` |
| `sleepNightChoice` | `:459` | RELEASED | it is what the athlete CHOSE in a control; it is passed raw into `on.recordSleep` and into `on.sleepClock`. Nothing durable reads it except through those two |
| `sleepDraft` and `clearSleepDraft` | `:476-:481` | RELEASED | **the file itself settles this**: `:475` says "The screen's own transient state. Nothing durable lives here." The view owns it, mutates it on every keystroke exactly as today (v1's 14 assignment sites are UNCHANGED, and v1's accessor pair is not needed), and hands its members raw to `on.recordSleep`. The writer clears it through `paint.clearDraft()` at the two points it clears it today |
| `sleepCheckInDay/Row/Pending/Failed/ViewPending` | `:472-:474` | SEALED | facade getters |
| `checkInKit`, `checkInKitLoading`, `checkInLive` | `:551-:555` | SEALED | facade getters |
| `workout`, `workoutRebinding`, `rebindInFlight`, `workoutRebindQueued` | `:362-:364`, `:2048` | SEALED | the entry never crosses. The view gets `view.session()` - the RESULT of `workout.summary()`, which is what `session()` `:365` already returns - and `view.laneHandles()`, `view.installationDevice()` |
| `checkin`, `setup`, `installation` | `:370`, `:376`, `:383` | SEALED | same. `firstRun()`, `checkinSummary()`, `setupSummary()` are facade reads |
| `importAdmitted` | `:689` | SEALED | `view.importAdmitted()` |
| `importScreen`, `measureScreen`, `measureState` | `:688`, `:628-:629` | SEALED | finding 5: the caches, the deps objects AND the two dynamic imports move together. The view draws the empty section and calls `on.paintMeasure(root)` / `on.paintImport(root)` |
| `screen`, `checkinOrigin` | `:792`, `:799` | RELEASED | the router owns them. The sealed half reads `screen` through `paint.screenNow()` |
| `mountToken`, `disposed` | `:445`, `:453` | RELEASED | B.4. `dispose()` keeps its `mountToken += 1` at `:2607` |
| `todayEntry`, `adoptionSettled`, `paintTodayEntry`, `settleAdoption` | `:767-:790` | SPLIT, named | `todayEntry` and `paintTodayEntry` are paint and stay RELEASED. `adoptionSettled` and `settleAdoption` move SEALED (they hook the adoption chain) and `settleAdoption`'s `answered` closure calls `paint.paintTodayEntry()` - a SIXTH paint-handle entry, and the only one added after B.4's five. The sealed half exposes `view.adoptionSettled()` so the view's guard at `:770` still reads one value |
| `ready` | `:2550` | SEALED | `api.ready` is served by the sealed half; the setup `done` callback reassigns it inside the seal, which is where it is written today |
| `phone`, `status`, `chrome`, `doc` | `:353-:355` | RELEASED | `doc` is passed to the sealed factory once for `doc.defaultView` (the `indexedDB` and `crypto` handles) and for the three `open({ doc, phone, ... })` calls. DOM travelling INTO the seal is not a writer travelling out |
| `model` | parameter | SEALED | the one-handoff rule, B.3 |
### B.6 The writer returns an OUTCOME; the view owns every word (S-R2)

This is the change that frees C-UI-7, and it is the answer to the blind map's section 3 item (1),
which said a good spec should "choose the writer returns a typed outcome, the view maps outcome to
sentence, and show the mapping for all eleven".

`recordSleep`'s `say` (`:1812`) is a copy-setting closure inside the writer. It sets one of nine
module-level constants on eleven paths. Under the new direction the writer sets an OUTCOME and
repaints; the released view maps outcome to sentence with the constants it already owns, in a
twelve-line mapper that is drawing code. **No copy constant moves.**

| # | today | line | outcome after the cut | the view's mapping |
|---|---|---|---|---|
| 1 | `sleepErrorText = ""` | `:1815` | `null` | nothing is drawn |
| 2 | `SLEEP_ROLLOVER + " " + SLEEP_NOTHING_RECORDED` | `:1819` | `{ kind: "rollover" }` | the same two constants, joined the same way |
| 3 | `(SLEEP_REFUSAL_COPY[refusal] \|\| SLEEP_NOT_SAVED) + " " + SLEEP_NOTHING_RECORDED` | `:1825` | `{ kind: "refused", refusal }` | the same lookup, in the view |
| 4 | `sleepErrorText = SLEEP_UNCERTAIN` | `:1851` | `{ kind: "uncertain" }` | `SLEEP_UNCERTAIN` |
| 5 | `say("")` after a landed reconciliation | `:1872` | `null` | nothing |
| 6 | `say(SLEEP_UNCERTAIN)` after a failed read | `:1880` | `{ kind: "uncertain" }` | as 4 |
| 7 | `SLEEP_NOT_SAVED + FOOD_REASON + code + ". " + SLEEP_NOTHING_RECORDED + " " + SLEEP_KEPT` | `:1887-:1889` | `{ kind: "not-saved", code }` | the same five parts in the same order |
| 8 | `SLEEP_NIGHT_CHANGED` | `:1901` | `{ kind: "late-refusal", code: "SLEEP_STALE_NIGHT" }` | the same branch on `code` |
| 9 | `SLEEP_CHECKIN_CHANGED` | `:1902` | `{ kind: "late-refusal", code }` with `code.indexOf("SLEEP_SOURCE_") === 0` | the same test |
| 10 | `[SLEEP_NOT_SAVED, reasonOf(result)].join(" ")` | `:1903` | `{ kind: "late-refusal", code, copy }` carrying `result.copy` verbatim | `reasonOf` stays in the view at `:1339` and runs on `{ code, copy }` |
| 11 | `+ " " + SLEEP_NOTHING_RECORDED` on 8, 9 and 10 | `:1904` | in `kind` | one constant, appended once |

`recordIntake`'s two paints are the same shape and are part of SEAM 2. The whole outcome type is a
closed set of six shapes, declared as a frozen table in the sealed module and asserted exhaustive by
a red-first cell: an outcome the view cannot map must FAIL, never fall through to a blank slot.

**What this buys, measured.** `VIEW_SOURCES` (`design.cjs:607`) does not change, so
`test/design.test.cjs:79-:81` needs no edit. `NOT_AVAILABLE` stays at `today-app.cjs:38`, so
`test/copy.test.mjs:406`'s planted-dash cell needs no edit and keeps its teeth over the file that
still owns every athlete-facing string. `assertDesignBinding` (`design.cjs:527-:569`) keeps binding
every declared copy line to the same concatenation it binds today. v1's C.5, its D.3 rows for
`design.test.cjs` and `copy.test.mjs`, and its risks 4 and 8 all disappear - not because they were
wrong, but because under this direction the copy never leaves.

### B.7 The export surface, the returned api, and the one name a released file must say (S-R3)

**`module.exports` (`:2600-:2624`) is unchanged, name for name.** `today-entry.mjs` is pinned on
disk by sha256 (`local-today-journey.test.mjs` `PAGE_PINS`, `DECISIONS:144`), `:44` reads
`const { mountToday, createTodayModel } = app;` off it, and eleven sealed cells import the same
surface. Nothing may move on it.

That forces one thing S-R3's strict rule does not anticipate: `createTodayModel` is a MODEL FACTORY
and a released file must name it. The disposal is a rule, asserted, not an exception:

**THE RE-EXPORT RULE.** A released file may name a sealed module's export in exactly two places:
the `require` that destructures it, and the `module.exports` list. Any third occurrence FAILS
`FENCE-REEXPORT-USED`. The fence counts occurrences and their positions, which a token scan does
exactly. In `today-app.cjs` the counts after the split are: `createTodayLanes` twice (the require
and the one call of B.3), `createTodayModel` twice (the require and the export), `model` twice
(the parameter and the handoff), `options` twice.

To make that work `createTodayModel` is re-exported THROUGH the sealed module: `today-lanes.cjs`
requires `./today-model.cjs` and re-exports `createTodayModel`, and `today-app.cjs` requires it from
`./today-lanes.cjs`. The released view then imports exactly ONE sealed module and no other, which
is a rule the fence can state in one line. The function identity is the same object it is today, so
the 120-odd `createTodayModel(...)` call sites in the cells and in `gym-check.mjs` are untouched.

**The returned api (`:2552-:2619`).** Twelve of its getters hand out a lane, an entry, a promise a
writer minted, or the adoption settle. A released file must not assemble those. So:

```
return Object.freeze({ ...viewApi, ...lanes.api() });
```

where `viewApi` is the released half's own eight paint getters (`render`, `openWeighIn`,
`screen`, `sleepMount`, `dispose`, `disposed`, `read`, `importScreen`) and `lanes.api()` is a frozen
object built in the sealed module carrying `foodPending`, `foodReady`, `sleepPending`, `sleepReady`,
`sleepCheckInReady`, `checkInKitReady`, `sleepLane`, `sleepAck`, `workoutEntry`, `workoutRebound`
and the `ready` getter. The api's shape, its key order and its behaviour are unchanged, the cells
that read it are unchanged, and **no released source line names a lane, an entry or a writer**.

`read: () => model.read()` at `:2553` becomes `read: () => view.read()`. `sleepMount: () =>
mountToken` at `:2567` stays released, because the token is released (B.4).

**The cost of the facade, measured.** `today-app.cjs` holds 59 lines that name `model.`; after the
split the released half holds about 24 of them, every one a READ, every one rewritten from `model.`
to `view.`. That is a rename in drawing code, it appears in the diff, and D.2's DOM snapshot covers
its result. The 35 that name a writer or a setter go with their regions and keep `model.` verbatim,
which is why D.1 can still ask for byte-identity.

### B.8 The seven seams, line by line (S-R2)
A seam is a region a draw and a write share, where "pure move" cannot be claimed. There are seven.
The PM named three; rows 4 to 7 are mine and the build round must plan for them.

**SEAM 1 - the weigh-in submit, `today-app.cjs:1059-:1082`.**

| line | today | after |
|---|---|---|
| `:1059-:1060` | `sheet.addEventListener("submit", async (event) => { event.preventDefault();` | PAINT, unchanged, but installed through `on.listen(sheet, "submit", fn)` (E.6) |
| `:1061-:1067` | the seven-line comment on the two refusals and the disabled button | PAINT. It describes what the view does and stays with the view; the two sentences about the client's own words are re-said in the sealed half's own comment |
| `:1068-:1069` | `if (submit.disabled) return; submit.disabled = true;` | PAINT, unchanged, in this order |
| `:1070` | `const raw = input.value.trim();` | **MOVES.** The trim is parsing. The view passes `input.value` untrimmed |
| `:1071-:1073` | `let result; try { result = await model.weighIn(raw === "" ? raw : Number(raw)); } catch (error_) { result = { ok: false, copy: "This weight could not be recorded, and nothing was recorded. " + ... }; }` | **MOVES whole**, byte-identical inside `on.submitWeighIn(rawText)`, which returns `{ ok, copy }`. `Number(raw)` is the conversion S-R2 names |
| `:1074` | `submit.disabled = false;` | PAINT, unchanged, immediately after the await returns |
| `:1075-:1078` | `if (!result.ok) { error.textContent = plainOrDrop(result.copy \|\| "...", "weigh-error"); input.focus(); return; }` | PAINT, unchanged, including the fallback string and the slot name `"weigh-error"`. **This is v1's residue R1, and it ceases to be a residue: C-UI-3 may move the sentence, change the node and flag the field freely** |
| `:1080-:1081` | `close(); render("today", true);` | PAINT, unchanged |

Order before: disable, convert, write, enable, paint-or-close. Order after: disable, call (which
converts and writes), enable, paint-or-close. **Identical, and the one line that moved is the line
that converts.**

*The cell that proves it.* A red-first cell drives the sheet with `" 181.4 "`, `""`, `"abc"`,
`"10000"` and a value the reading lane refuses, and asserts, for each: the exact sentence in
`#weigh-error`, that `submit.disabled` was true for the whole of the await and false after, that
the sheet is still open on a refusal and closed on a success, and that the reading lane holds
exactly zero operations after every refusal and exactly one after the success. `view.test.mjs`
already drives most of this; the new cell adds the untrimmed and the thrown cases.

**SEAM 2 - `recordIntake`, `today-app.cjs:1278-:1319`, and its wiring at `:1269` and `:1272`.**

| line | today | after |
|---|---|---|
| `:1269` | `retry.addEventListener("click", () => { foodSaving = retryFoodRead(); });` | PAINT calls `on.retryFoodRead()`; the SEALED half assigns `foodSaving`. The view assigns nothing |
| `:1272` | `save.addEventListener("click", () => { foodSaving = recordIntake(save, cal, pro, error); });` | PAINT: `on.listen(save, "click", async () => { ... })`, the handler below |
| `:1280-:1281` | `const entry = { cal: cal.value, pro: pro.value }; const refusal = FoodModel.refusalFor(entry);` | **MOVES**, into `on.foodCheck(cal.value, pro.value)`, and is re-run inside `on.recordIntake` as defence in depth (see below) |
| `:1282-:1285` | `if (refusal) { error.textContent = plainOrDrop(FOOD_REFUSAL_COPY[refusal] \|\| FOOD_REFUSED, "food-error"); return; }` | PAINT, unchanged, driven by `on.foodCheck`'s `{ refusal }`. **v1's residue R2 ceases to be a residue** |
| `:1286` | `const dayValues = FoodModel.dayFromEntry(entry);` | **MOVES** |
| `:1287` | `save.disabled = true;` | PAINT, and it now runs in the view between the check and the call, which is the same point in the sequence it runs at today |
| `:1288-:1301` | `let result = null; try { result = await foodLane.save(dayValues); } catch (thrown) { foodReadBack = {...}; save.disabled = false; render("nutrition", false); return; } finally { save.disabled = false; }` | **MOVES**, with `save.disabled = false` deleted from the catch and the finally (the view does it) and `render(...)` becoming `paint.repaint("nutrition", false)`. Returns `{ kind: "unknown" }` |
| `:1302-:1309` | `if (!result \|\| result.ok !== true) { error.textContent = plainOrDrop(FOOD_REFUSED + " " + reasonOf(result) + " " + FOOD_REFUSED_ACTION, "food-error"); return; }` | SPLIT: the sealed half returns `{ kind: "refused", code: result && result.code, copy: result && result.copy }`; the PAINT, the three constants and `reasonOf` stay in the view. **v1's residue R3 ceases to be a residue** |
| `:1310-:1317` | the `foodReadBack` assignment and `render("nutrition", false)` | **MOVES**; the repaint becomes `paint.repaint` |
| after | - | PAINT: `save.disabled = false;` then the outcome mapping |

**Defence in depth, and it is a strengthening, not a weakening.** `on.recordIntake` re-runs
`FoodModel.refusalFor` on the raw values it was handed and, if it refuses, returns
`{ kind: "refused-before-write" }` having opened nothing and stored nothing. So a released view
that skipped `on.foodCheck` - by accident or by a future edit - still cannot put an inadmissible
entry into the store. Today nothing stops it, because the check and the write are the same
function; after the split the check is inside the seal twice.
*The cell that proves it.* The order of writes and paints is asserted as a SEQUENCE, not as an end
state: a recording cell wraps `foodLane.save`, `save.disabled`'s setter and `render` and asserts the
trace is, for a refusal, `[check, paint-error]` with no `save` at all; for an acknowledged write,
`[check, disable, save, enable, repaint]`; for a throw, `[check, disable, save-throws,
readBack-set, enable, repaint]`. `food.test.mjs` already drives all three states over the real
lane; this adds the trace.

**SEAM 3 - `recordSleep`, `today-app.cjs:1807-:1930`.**

The whole of it moves. It touches no DOM node at all today (v1 found this and it is correct at
`c15a69c0`), so the seam is not DOM at all: it is the eleven sentences of B.6 and the five things it
reaches outside itself.

| what | line | after |
|---|---|---|
| `if (sleepBusy \|\| sleepUnknown \|\| sleepReadBack) return;` | `:1808` | MOVES, unchanged; all three are sealed state |
| `const say = (s) => { sleepErrorText = s; render("sleep", false); };` | `:1812` | becomes `const say = (o) => { sleepOutcome = o; paint.repaint("sleep", false); };`. One line, and the comment above it at `:1809-:1811` is kept verbatim because it is still exactly true |
| `sleepClockCheck(); const date = sleepNightDate();` | `:1813-:1814` | MOVES with them (B.2 rows 20 and 21) |
| `const entry = { ...sleepDraft, date };` | `:1822` | becomes `const entry = { ...draftValues, date }` where `draftValues` is the raw object the callback received |
| the eleven `say` sites | B.6 | outcomes |
| `const token = mountToken;` and its six comparisons | `:1839` and B.4 | `paint.token()` |
| `clearSleepDraft()` | `:1870`, `:1919` | `paint.clearDraft()` |
| `workoutRebinding = rebindWorkout();` | `:1871`, `:1927` | unchanged; both are sealed |
| `SleepModel.rowFor(night, model.engine).h` | `:1912` | unchanged; `model` is sealed-side |

**The order does not change anywhere.** Every statement keeps its position; the only substitutions
are `sleepErrorText = <sentence>` to `sleepOutcome = <outcome>`, `render` to `paint.repaint`,
`mountToken` to `paint.token()` and `clearSleepDraft()` to `paint.clearDraft()`. D.1 defines those
four substitutions as the exact wrapper and proves nothing else moved.

*The cell that proves it.* The reconciliation path is the one that matters and `problem.test.mjs`
already drives it: a save that throws, a refresh that answers, a night that landed, a navigation
mid-flight. The new cell asserts the trace `[save-throws, outcome=uncertain, repaint, refresh,
landed, clearDraft, rebindWorkout, outcome=null, repaint]` in that order, and that a navigation
between the throw and the refresh produces the same DURABLE result and NO repaint. That is
`recordSleep:1921-:1926`'s own contract, said as a test.

**SEAM 4 - `workout.recover()` in the primary handler, `:949-:960`.** `primary.disabled = true;`
stays; `await workout.recover()` becomes `await on.recoverWorkout()`; the `finally` and the
`render("today", false)` stay. One identifier. The cell asserts the button is disabled for the whole
await and that a failed recover still re-enables it.

**SEAM 5 - the router's setup branch, `:2295-:2336`.** The released router keeps
`if (next === "setup" && !firstRun()) next = "today";` at `:2287` (a READ through the facade) and
`if (next === "setup") return on.openSetup({ back: () => render("today", true) });`. The whole
`done` closure `:2317-:2333` - `canAdoptAthleteState`, `armAdoptionGate`, `ready = settleAdoption
(...)`, `render("today", true)`, `return ready` - moves into the sealed half byte-identical except
its last `render` call, which becomes `paint.repaint("today", true)`. The 22 lines of comment at
`:2298-:2316` and `:2321-:2332` move with it: they explain the adoption chain, not the route.

This is the seam that answers S-R8's "the boot or the router carrying a data decision that must not
be released". The router carries exactly two data decisions: `firstRun()`, which is a READ and stays
as a facade call; and the `done` chain, which moves. Nothing else in `render` `:2272-:2380` touches
a store, and `food.test.mjs:696-:698`'s slice from `if (next === "setup"` to `if (next === "why")`
still contains `firstRun()` afterwards, so that cell is unaffected.

**SEAMS 6 and 7 - the recovery and workout branches, `:2349-:2356` and `:2362-:2369`.** The branch
structure, the `checkinOrigin` bookkeeping at `:2350-:2352` and the two fallbacks
(`renderCheckInWithoutStore`, `renderStub("t-workout", ...)`) stay in the released router, because
they are drawing decisions about a device with no store. `reboundCheckIn(origin)` and the two
`open({ doc, phone, back, ... })` calls move into `on.openCheckIn` and `on.openWorkout`, which
return whatever the entry returns or `null`; the router then falls through to its own fallback on
`null`, exactly as it does today at `:2354` and `:2371`.

### B.9 The second extraction: `gym-app.mjs` (S-R4)

Verified at `c15a69c0`, and the look map's line numbers are wrong by seven to nine here. The true
regions:

| region | lines | code lines | what it reaches |
|---|---|---|---|
| the settings lane state: `settingsLane`, `settingsOpening`, `settingsSaving`, `settingsDraft`, `settingsDraftLift`, `settingsErrors`, `settingsRead`, `settingsInFlight`, `settingsReading` | `:123-:140` | 18 | the lane handle and its caches |
| `startSettingsRead` | `:142-:156` | 15 | `:147` `settingsLane.latest(liftId)` - a LANE CALL the look map omits from its move list |
| `openSettingsLane` | `:158-:171` | 14 | `:161` `indexedDB`, `:162` `crypto`, `:165` `import("./machine-settings-host.mjs")`, `:166` `createMachineSettingsHost` |
| `recordSettings` | `:286-:318` | 33 | `:305` `await settingsLane.save(machine)` |
| **total** | | **80** | |

The look map says "about 65 lines"; it reaches 65 by leaving out `startSettingsRead` and by giving
`openSettingsLane` six lines it does not have. **80 is the number.** `recordSettings` is a seam of
its own: `refuse()` at `:289-:295` does `phone.querySelector('[data-slot="settings-error"]')` and
writes `textContent`, and `:302-:307` toggles `save.disabled` around the await. The disposal is
SEAM 2's exactly: `on.recordSettings(rawDraft, liftId)` returns
`{ kind: "nothing" | "refused" | "not-saved" | "recorded" }`, the three sentences
(`SETTINGS_NOTHING`, `SETTINGS_REFUSED`, `SETTINGS_NOT_SAVED`, among the 23 `SETTINGS_*` constants
at `gym-app.mjs:56-:78` that C-UI-5 holds LOCKED verbatim) stay in the released
`gym-app.mjs`, and the released view keeps `refuse()`
and the `WeakMap` that carries its message across a repaint.

**The admission pair is already sealed, and that settles a question S-R2 would otherwise raise.**
`recordSettings` calls `MachineSettingsView.machineFromDraft` (`machine-settings-view.mjs:39-:49`)
and `.acceptable` (`:53-:59`). Those are in a FREE file that C-UI-5 edits. But `acceptable` is six
lines and its whole body is `machineOf(JSON.parse(JSON.stringify(machine)))` from
`rebuild/coach/machine-settings-commands.cjs`, which `:536` seals by name, and the file says so in
its own header: "IT OWNS NO VALIDATOR EITHER ... The only gate on a capture is `machineOf` ... so
the page's refusal and the producer's refusal are the same decision, taken once, and there is no
second shape anywhere in this page's own folder." So the gate is sealed already. The sealed
`gym-settings-lane.mjs` calls the two free wrappers exactly as `recordSettings` does today.
**Residue, named and small:** `machineFromDraft`'s eleven lines of trimming and filtering DO decide
what shape is stored and they are editable by C-UI-5. H.5 item 4 carries it with the food and sleep
bounds.

**The five model call sites, and the look map counts four.** `gym-app.mjs` calls the FREE
`gym-model.mjs` at `:419` `model.logSet`, `:444` `model.finish`, `:498` `model.forget`, `:505`
`model.undo` and `:546` `model.start`. The look map lists four and omits `model.start()` at `:546`.
S-R3 asks whether they go behind the same callback table. **They do, and it costs about 20 lines**:
`on.logSet(values)`, `on.finish()`, `on.forget()`, `on.undo()`, `on.start()`, each taking the raw
values the card holds and returning the result object `renderActive` already paints from. `model.read()`
at `:540` and `model.effortChoices()` at `:382` are READS and go on the facade.

**What that needs from PM-R3 of `:542`.** `gym-model.mjs` and `checkin-app.mjs` are declared
PINNED-UNCHANGED in S9. That is exactly the guarantee this split needs and it needs nothing more:
the writers stay where they are, their bytes are pinned by the artifact, and no look ticket may edit
them. The split's contribution is that after it no RELEASED file CALLS them. If S9 drops the
pinned-unchanged declaration, `logSet` becomes a writer in a file anyone may edit and the fence's
word list has nothing behind it there; the split should then declare all three itself.

**The four lane hosts need no edit by any look ticket: VERIFIED, not accepted.** I re-ran the
census at `c15a69c0` over `food-host.mjs` (126 lines), `reading-host.mjs` (48),
`machine-settings-host.mjs` (113) and `gym-host.mjs` (88), for `createElement`, `innerHTML`,
`textContent`, `classList`, `querySelector`, `appendChild` and `document.`: **zero hits in each of
the four.** Their only string literals of fifteen characters or more are module specifiers
(`'../../w6/public-client.mjs'`, `'../../w6/local/local-era.mjs'`,
`'../../../coach/machine-settings-commands.cjs'`) and fragments of their own prose; the one that
looks like copy, `machine-settings-host.mjs`'s `"gym-card flavour"`, is a field name, not a
sentence. They hold no markup, no class, no copy and no layout. **The look map's recommendation
stands and the design lane should take it: strike `machine-settings-host.mjs` from C-UI-5's MAY
CHANGE, and narrow C-UI-7's `food-*` to `food-model.cjs`, `food-commands.cjs` and `food-check.mjs`
and strike `reading-host.mjs`.** That is a ticket edit at zero code cost and it removes a sealed
path from two tickets. Also worth the same strike: C-UI-7's acceptance needs nothing from
`sleep-host.mjs` either, which is free anyway.

**No other sealed file is opened by this split.** `today-entry.mjs`, `problem-report.cjs`,
`local-source-basis.mjs`, `import/**` and `measure/**` are not edited. The two dynamic imports of
finding 5 move INTO the seal, which reduces the released surface rather than widening it.

### B.10 What changes in `build.mjs`

`build.mjs` is released by S9 (`DECISIONS:542` (B), with H18), so these are lane C edits, not
sealed-byte moves. They are still laws and none of them is weakened.

| law | line | change | why |
|---|---|---|---|
| `REQUIRED_INPUTS` | `:98` | **ADD two**: `.../today/today-lanes.cjs` and `.../today/gym-settings-lane.mjs`. 51 becomes 53 | its purpose (`:112-:115`) is that the page cannot silently lose a module, and a lost lane module is a page that records nothing |
| `REQUIRED_INPUTS` teeth | - | **H18 must land first or in the same package**, and then its literal list of the 26 `today/**` entries gains the same two | v1's finding, unchanged and still a dependency (G) |
| `assertImportRouteIsolation` | `:391` | **`deepEqual(importers.map(...), [SOURCE_REL + "/today-lanes.cjs"])`** | finding 5: the dynamic import moves with `importDeps`. The guard keeps every tooth - one importer, by a dynamic edge - and now points at the SEALED module, which is strictly better than pointing at a file lane C may edit |
| `FORBIDDEN` `:79`, `assertNoNetworkReference` `:209`, `assertNoNodeOnlyGlobals` `:244` | - | no change | |
| bundle order | `:478` | no change | esbuild resolves the new `require`s itself |
| the dash guard's attribution | `:289` | no change, and now it is exactly right | the bundle is cut at `// <path>` banners, and every athlete-facing string still lives in `today-app.cjs`, so the guard still names that file |

**`today-entry.mjs`: ZERO lines change.** `:19` imports `today-app.cjs`; `:44` destructures
`mountToday` and `createTodayModel` off it; both survive by B.7. The pinned file is untouched, and
the build round proves it by comparing `Object.keys(require("./today-app.cjs")).sort()` before and
after and by re-running the `PAGE_PINS` cell.

---

## C. THE TICKET TABLE (NEW - the acceptance test of the cut)

### C.1 Method

Same as v1's: the design of record's state inventory
(`rebuild/m1/approved-2026-09-18/states/STATE-INVENTORY-DRAFT.md`) cites a `today-app.cjs` or
`gym-app.mjs` line for most states, and v1 extracted those citations and mapped them onto the region
map. I did not redo that extraction; I re-used v1's C.2 citation lists unchanged and re-classified
each citation against the NEW cut. The look map's section 2 is the independent second opinion and
the two agree on every ticket.

### C.2 Ticket by ticket
| ticket | what it must change | where that is after the cut | residue |
|---|---|---|---|
| **C-UI-1** design pins, fonts, scene, review hooks | `design.cjs`, `scene.mjs`, `preview.css`, `build.mjs`, `browser-check.mjs` | untouched by this split; freed by S9's two-path list | none |
| **C-UI-2** Today, the face | the copy block, `calorieBand`, `trendLine`, `athleteStateFailureCopy`, `resumeLabel`, `setupNoteNeeded`, `fitHeadline`, `renderToday` `:839-:1025`, `sleepState`, `sampleNote`, `problemControl`, `nutritionState`, `recoveryState`, and `:2440` | **all of it in the released `today-app.cjs`** | **NONE.** v1's residue R4 (`:2440`, the adoption arm) was read, not edited, and it now sits in the sealed half where a reader does not need it: C-UI-2 reads `view.importAdmitted()` instead |
| **C-UI-3** proposal card and weigh-in | `morningLine`, the proposal binding (new code in `renderToday`), `openWeighIn` `:1028-:1058`, the refusal placement and the field flag at `:1075-:1078` | **all of it in the released `today-app.cjs`** | **NONE.** v1's R1 is gone by SEAM 1: the sentence, the node, the slot name and the fallback string are all on the view side |
| **C-UI-4** the set and rest screens | `renderActive` `:321-:441`, the copy `:30-:78`, the refusal paint at `:423` inside the `logSet` handler | **all of it in the released `gym-app.mjs`** | **NONE**, once B.9's five call sites are behind the table |
| **C-UI-5** workout panels and the settings editor | `machine-settings-view.mjs` (free today), `stub()` `:227-:239` and `settingsPaint` `:242-:282` in `gym-app.mjs`; `machine-settings-host.mjs` needs no edit at all | **all of it in the released `gym-app.mjs` and the free view** | **NONE.** This is the ticket v1 could not free at all |
| **C-UI-6** coach | `:852` and `:909` `put(map, "coach-state", NOT_WIRED)`, and the coach route `:2357-:2358` | **all of it in the released `today-app.cjs`, the router included** | **NONE.** v1's residue R5 and its whole C.4 argument - the screen table, the reseal child for two lines, option (b) refused - vanish. The router is released, so C-UI-6 edits two lines of a file it may edit |
| **C-UI-7** the entries | `renderWhy`, `renderNutrition`, `foodEntry`, `renderSleepCheckIn`, `sleepCheckInOffer`, `renderSleep`, `sleepEntry`, `sleepEstimate`, `sleepStamp`, all of the food and sleep copy, AND the refusal placement the acceptance demands | **all of it in the released `today-app.cjs`**; the refusal placement is B.6's mapper plus SEAM 2's paints | **NONE.** v1's R2 and R3 are gone |
| **C-UI-8** PWA shell and slice deploy | `rebuild/slice/pwa/**`, all free | untouched | none |

### C.3 The residue, measured exactly

**There is none.** Not one look ticket needs a byte of `today-lanes.cjs` or `gym-settings-lane.mjs`.
That is S-R1 (d), and it is the strongest single result of the reversal: v1's five residues R1 to R5
do not need disposing of, they do not exist, because everything that is not a writer is released.

The honest counter-statement, so the PM has both halves: **a ticket that needs a NEW FIELD out of
the model still rides a child.** C-UI-3's proposal card is the live candidate - the string
`proposal` does not occur in `today-app.cjs` today (blind map section 4, re-checked here: zero
matches) - and if it needs `read()` to compose one, `read()` is in `today-model.cjs`. Section F
keeps `read()` and the whole projection FREE for exactly this reason, so C-UI-3 can add a field
without a child. **That is the same failure mode the PM attributes to v1's frozen view-model, and
the only thing that avoids it is F's decision to leave the projection outside the seal.** If a
later round moves `createTodayModel` into the seal, this result reverses.

### C.4 Is the cut in the right place?

| ticket | before | after v1's cut | after this cut |
|---|---|---|---|
| C-UI-1 | freed by S9 | freed by S9 | freed by S9 |
| C-UI-2 | reseal child | plain lane C | plain lane C |
| C-UI-3 | reseal child | plain lane C, with R1 as a copy constraint | plain lane C, no constraint |
| C-UI-4 | reseal child | **unchanged, still a child** | **plain lane C** |
| C-UI-5 | reseal child | **unchanged, still a child** | **plain lane C** |
| C-UI-6 | reseal child | plain lane C plus a two-line sealed route swap | plain lane C |
| C-UI-7 | reseal child | plain lane C, with R2/R3 as copy constraints | plain lane C, no constraint |
| C-UI-8 | plain lane C | plain lane C | plain lane C |

**Eight of eight, against v1's four freed and two half-freed.** The look map's arithmetic (2 of 8
today, 8 of 8 after two extractions of about 520 lines) is right in its conclusion and wrong in its
measurement; the true figure is 743 lines moved (663 plus 80), which is 93 lines per ticket freed.

---

## D. THE PROOFS (S-R6; v1's section D, kept with the changes S-R6 names)

Six proofs plus the listener census. The build round delivers all seven as artifacts committed
beside its report; its independent reviewer re-runs D.1, D.3 and D.6 from the branch and re-reads
the rest.
### D.1 Every MOVED writer region byte-identical, modulo a wrapper defined exactly (S-R6)

v1's mechanism is KEPT: a committed script `rebuild/lanes/c/today-split/writes-fence.mjs` with a
committed manifest `writes-regions.json`, run at the base ref and at HEAD, locating each region by
its DECLARATION TEXT and not by line number, taking the brace-balanced body, hashing with sha256,
and printing a table. Red-first the same way: run it on the unmodified tree with an artificial
one-character edit inside `recordSleep` and it must fail naming `recordSleep`.

**What changes: the modulo, and the manifest.** v1's de-indentation clause is kept and is now the
main event, because every region moves from depth 1 in `mountToday` to depth 1 in
`createTodayLanes` - so in practice the indentation does not change either, and the clause is a
safety net exactly as v1 said.

**THE WRAPPER, DEFINED EXACTLY.** Beyond uniform de-indentation and a single CRLF-to-LF pass applied
to both sides, the proof permits exactly these five textual substitutions, applied by the script
itself before hashing, each counted and printed:

| # | from | to | where it is allowed |
|---|---|---|---|
| W1 | `render(` | `paint.repaint(` | any moved region |
| W2 | `mountToken` | `paint.token()` | any moved region |
| W3 | `clearSleepDraft()` | `paint.clearDraft()` | `recordSleep` only |
| W4 | `screen` as a bare identifier read | `paint.screenNow()` | `openSleepLane`, `openFoodLane`, `readSleepCheckIn`, `measureDeps`, `importDeps`, `paintTodayEntry` |
| W5 | `sleepErrorText = <expression>` | `sleepOutcome = <outcome literal from B.6's table>` | `recordSleep` only, and the script checks the outcome literal against B.6's frozen table by name |

**Nothing else. Not identifier renaming, not comment stripping, not reordering.** If a region's body
differs in one character after de-indentation and the five substitutions, the proof FAILS. The
script prints, per region, how many of each substitution it applied, so a region that needed six
W1s when B.6 says it has two is visible.
**The manifest is B.2's table**, not v1's seventeen: 24 whole-move regions plus the four writer
regions of `today-model.cjs` (F) plus `gym-app.mjs`'s four (B.9) - **32 regions**. The seven seams
of B.8 are NOT in the manifest; they are proved by their named cells instead, and the manifest file
carries a `seams` block listing them by name and line range so a reader can see what is and is not
covered by sha256. **A region that is in neither block is a STOP.**

**PASS is: every one of the 32 regions' post hash equals its pre hash.** The report carries the
table and the substitution counts.

*Why this is a stronger proof than v1's, and I should say so plainly:* v1's split moved NO writer,
so its D.1 was a proof that nothing happened. This one moves all of them, so D.1 is the proof that
does the work, and the wrapper above is what makes it possible to ask for it at all.

### D.2 The built page equal before and after (S-R6)

**Byte-identical is still impossible and for the same reason v1 gave**: `build.mjs:289` cuts the
bundle at `// <path>` banners, esbuild wraps each CommonJS input in its own `__commonJS` factory,
and two new `.cjs`/`.mjs` inputs mean two new banners, two new factories and two new call sites.
S-R6 asks whether the new direction makes byte-identity possible. **It does not, and it is not close:
the bundle gains modules either way.** DOM-snapshot equality stands, unchanged from v1's D.2, over
every state the inventory names for T-02..T-95 and W-01..W-40, with the same single normalisation
(sorted attribute order) and the same rule that a state which cannot be driven is listed NOT COVERED
with its reason and judged by the reviewer.

One thing the new direction DOES make cheaper and the build round should take: the input inventory
check (`result.inputs` before and after differs by EXACTLY two paths) is now exact rather than
approximate, because two paths is a number a reader can hold. `scanBuiltAssets`'s dash report must
be empty on both sides.

### D.2b The listener census - KEPT FROM v1, and now it matters more
v1's D.2b is kept verbatim in substance: instrument `EventTarget.prototype.addEventListener` in the
jsdom window for the duration of each state and record a sorted list of
`<data-slot or tag>:<event type>:<count>`; PASS is that list equal, state for state, before and
after. `DECISIONS:454` round 2 found this file's wiring broken once already.

It matters MORE under the new direction, because E.6's gesture shim routes every view listener
through `on.listen`, so every wiring site in the two released files is touched. The census is the
cheapest proof that the wiring survived and it is where the review's time goes first.

### D.3 The today suite green, and the test edit list (S-R6)

S-R6 expects zero or near-zero. **It is THREE required edits, every one a file-name re-point, none
of them an import path, none of them weakening an assertion.** I read every sealed cell line that
names `today-app.cjs` or `gym-app.mjs` as a literal at `c15a69c0` and every cell that reads either
file as text. The complete list:

| cell | line | what it does | edit |
|---|---|---|---|
| `checkin.test.mjs:25`, `copy.test.mjs:34`, `food.test.mjs:21`, `gym.test.mjs:33`, `problem.test.mjs:23`, `setup.test.mjs:28`, `view.test.mjs:21`, `adapter.test.mjs:24`, `machine-settings-ui.test.mjs:35`, `ntc-h6-delta.test.mjs:64`, `package.test.cjs` | imports of `../today-app.cjs` and `../today-model.cjs` | the module keeps its name and its whole export surface | **NONE. Zero import paths change.** This is PM reason (c), and it is stronger than the PM put it: not "most of" the nine, but all nine of v1's import-path edits |
| **`food.test.mjs:1152-:1153`** | slices `today-app.cjs` between `'function foodEntryFor'` and `'function openFoodLane'` and asserts the slice holds `readBack: true`, `readBack: false` and NOT the rejecting refresh | both declarations MOVE (B.2 rows 9 and 10) | **REQUIRED**: `readRepo('.../today-lanes.cjs')`. One string. Every assertion is re-run against the new file unchanged |
| **`problem.test.mjs:1100-:1101`** | slices `function sleepEntryFor` by `/^function sleepEntryFor[\s\S]*?^ \}/m` and `Function()`-evals it | the declaration MOVES (B.2 row 3) | **REQUIRED**: same one-string change. **And it is a CONSTRAINT on the build**: `sleepEntryFor` must sit at two-space indentation in `today-lanes.cjs`, which it does, because every moved region is at depth 1 inside `createTodayLanes` |
| **`package.test.cjs:105`** | plants a static import edge on `today-app.cjs`'s node and requires `IMPORT-ROUTE FAIL` | the dynamic import moves (finding 5) | **REQUIRED**: the planted key becomes `.../today-lanes.cjs`. The red side keeps every tooth |
| `food.test.mjs:696-:698` | slices `today-app.cjs` from `if (next === "setup"` to `if (next === "why")` and asserts `firstRun()` is inside | the router stays, `:2287` stays, `firstRun()` stays (SEAM 5) | **NONE**. The reviewer must re-read the slice, because SEAM 5 rewrites the branch BODY between those two markers |
| `copy.test.mjs:406` | plants `const NOT_AVAILABLE = "Not available yet";` into `today-app.cjs` | `:38` does not move; no copy moves (B.6) | **NONE**. v1 needed this edit; this direction does not. The dash guard keeps covering the file that owns every string |
| `design.test.cjs:79-:81` | `deepEqual(design.VIEW_SOURCES, [six names])` | no copy moves, so `VIEW_SOURCES` is unchanged | **NONE**. v1 needed this edit |
| `problem.test.mjs:2003-:2008` | `sleepSpanH(` callers must be `['sleep-model.cjs', 'today-app.cjs']` | the one caller is `sleepEstimate:1772`, a drawing region that STAYS | **NONE**. v1 needed this edit |
| `setup.test.mjs:1035` | `codeOf(setupFileText('today-app.cjs'))` asserting `note.textContent = owed ? plainOrDrop(SETUP_NOT_HIS_NUMBERS, "setup-note")` | that line is `setupNote` `:2148-:2162`, drawing, STAYS | **NONE**, and v1's "unknown, flag it" is now answered: I read the assertion and it is about a drawing line |
| `problem.test.mjs:1419-:1423` | scans `['sleep-model.cjs', 'today-app.cjs']` for `1440` and `/ 60` | neither appears in a moved region | **NONE** |
| `food.test.mjs:707`, `:763`, `:897`; `problem.test.mjs:1945`, `:1980`, `:1989`; `machine-settings-ui.test.mjs:781`, `:841`, `:936` | nine file-name LISTS: the no-dash literal scan, the width scan, the N1.20 custody list | the new modules are not in them | **OPTIONAL, and recommended: all nine.** A sealed lane module holds no athlete-facing string, so the scans lose nothing today; a future edit could add one. See the cheaper alternative below |
| `package.test.cjs` H18's literal list | wherever H18 lands | the 26 `today/**` `REQUIRED_INPUTS` entries become 28 | **CONDITIONAL on H18** |

**The cheaper alternative to the nine widenings, and I recommend it INSTEAD:** the fence cell (E)
asserts that `today-lanes.cjs` and `gym-settings-lane.mjs` contain **zero athlete-facing string
literals** - zero literals of more than three words outside a module specifier, an error code and a
comment - measured by the same literal regex `food.test.mjs:899` uses. That is one new assertion in
a new cell instead of nine edits in four sealed cells, it is strictly stronger (it forbids copy in
the seal rather than scanning copy that is there), and it makes the outcome discipline of B.6 a law
rather than a convention. **If the PM prefers the widenings, take both; if only one, take this.**

**So the honest form of D(3):** three test edits, each a file name, each re-asserted against the new
file, plus one conditional on H18. **A fourth required edit is a STOP.** v1's Q1 (does the PM accept
a wider rule than "import paths only") is WITHDRAWN: it is not needed under this direction.
### D.4, D.5, D.6 - KEPT FROM v1

**D.4 zero copy change.** Unchanged, and now nearly trivial to pass: `copy-census.mjs` extracts
every string literal from `today-app.cjs`, `today-model.cjs`, `gym-app.mjs` and (at HEAD) the two
new files, with the same literal regex `food.test.mjs:899` uses, and emits a SORTED MULTISET with
counts. PASS is equal, exactly. Because B.6 moves no copy, the expected delta in the two new files
is EMPTY, which is a sharper prediction than v1's and a fail if it is not met.

**D.5 the browser check on the PC.** Unchanged: `browser-check.mjs` is stale-red at the tip
(`DECISIONS:535`, and PM-R3 of `:542` keeps it outside CI and run on the PC before each seal), so
the build round records its state BEFORE the split as the baseline and proves NO WORSE after. Both
themes, offline, both the weigh-in and the two entries driven by hand.

**D.6 the numstat.** Unchanged, including v1's widening of the ticket's three paths to seven:
`git diff --numstat <base> HEAD -- rebuild/engine rebuild/coach rebuild/DECISIONS.md
rebuild/authority rebuild/client rebuild/m4 rebuild/conform` prints NOTHING, verbatim in the report
with the base sha named.

---

## E. THE WRITER-FENCE (S-R5; v1's section E, kept and re-aimed)

### E.1 What it is, re-aimed

A new sealed cell, `rebuild/lanes/c/ui-port/writer-fence.test.mjs`, with a CI home of its own beside
the A1/A2/A3/A4 step at `rebuild.yml:232`. v1 aimed it at "every file under `today/` that is not in
the sealed inventory". **S-R5 re-aims it: it fences the RELEASED files BY NAME as well as every file
outside the inventory.** That is not a widening of convenience; it is the only version that means
anything now, because after this split the two most dangerous files in the directory -
`today-app.cjs` and `gym-app.mjs` - are released, and a fence that skipped them would fence nothing
that matters.

### E.2 How it learns which files are free - KEPT FROM v1 unchanged

v1's E.2 stands word for word and I have nothing to add: the inventory is read OUT OF GIT at the
chain ref with no cache; `<N>` is the NUMERIC maximum; two artifacts at the same `N` FAIL
`FENCE-AMBIGUOUS-INVENTORY`; a missing chain ref FAILS `FENCE-CHAIN-REF-ABSENT`; a worktree artifact
differing from the chain FAILS `FENCE-INVENTORY-DIFFERS-FROM-CHAIN`; a reseal-child branch SKIPS
with its reason printed. It is `S9-RELEASE-SPEC.md` D.2's rule and R1 BLOCKING-2's reason: a fence
whose fenceposts move with the animal is not a fence. PM-R3 of `:542` has since ruled the same
thing for the inventory fence, which is a second reason to keep it.

FREE, after S-R5, is: present in the directory listing of `rebuild/m3/w7-preview/today/`, source
files only, `test/` excluded, AND (absent from the inventory's `product` and `executionPins` OR
present in its `released` block). A released file IS fenced; that is now the point.

### E.3 The entry-point list, from the final interface (S-R5)

**Durable writers, as MEMBER NAMES in code position:** `.save`, `.weighIn`, `.logSet`, `.finish`,
`.undo`, `.start`, `.forget`, `.recover`, `.restart`, `.reopen`, `.retract`, `.retractImport`,
`.importBundle`, `.admitLocalSource`, `.admittedLocalSourceState`, `.adoptBasis`,
`.setPendingAdoption`, `.setFoodDays`, `.setSleepNights`, `.rebase`, `.holdForAdoption`,
`.adoptEngineState`, `.refresh` on a lane identifier, `.latest` on a lane identifier, `.all`,
`.close` on a host identifier, `.commit`, `.forDate`.

**Lane, host and entry constructors:** `createSleepHost`, `createFoodHost`, `createGymHost`,
`createReadingHost`, `createCheckinHost`, `createSetupHost`, `createMachineSettingsHost`,
`createWorkoutEntry`, `createCheckInEntry`, `createSetupEntry`, `createCheckInModel`,
`openTodayHosts`, `openTodayInstallation`, `hostForDay`, `createTodayLanes`, `createTodayModel`,
`createGymSettingsLane` - the last three under the RE-EXPORT RULE below.
**Stores:** `indexedDB`, `IDBFactory`, `IDBDatabase`, `IDBTransaction`, `IDBObjectStore`,
`openDatabase`, `localStorage`, `sessionStorage`, `caches`, `crypto.subtle`, `navigator.storage`,
`transaction`, `objectStore`.

**Module edges (the import side, from the metafile):** any import or require of `*-host.mjs`,
`*-commands.cjs`, `local-source-basis.mjs`, `today-entry.mjs`, `../import/**`, `../measure/**`,
`rebuild/client/**`, `rebuild/engine/**`, `rebuild/m4/**`, `rebuild/m3/w6/**`, or of any path in
the sealed inventory - **with exactly one exception, declared: a released file may import the ONE
sealed lane module named as its partner in the artifact** (`today-app.cjs` imports
`today-lanes.cjs`; `gym-app.mjs` imports `gym-settings-lane.mjs`). A second sealed import FAILS
`FENCE-SECOND-SEALED-IMPORT`. The pairing is read out of the artifact, not out of a list in the
cell.

**THE RE-EXPORT RULE (B.7).** A fenced name that reaches a fenced file only as a re-export is
permitted in exactly two positions - the `require` that destructures it and the `module.exports` or
`export` list - and a third occurrence FAILS `FENCE-REEXPORT-USED`. The fence prints the count and
the positions for every such name, so the exception is a measurement on every run, not a hole.
After the split it prints exactly: `createTodayModel` 2 in `today-app.cjs`; `createTodayLanes` 2;
`model` 2; `options` 2; `createGymSettingsLane` 2 in `gym-app.mjs`.

**What a released view MAY import:** `plain-copy.cjs`, `food-model.cjs`, `sleep-model.cjs`,
`problem-report.cjs`, `today-model.cjs`, `machine-settings-view.mjs`, `checkin-model.mjs`,
`design.cjs`, `split-kinds.mjs`, `exercise-catalogue.mjs`, `starter-week.mjs`, its one sealed
partner, and each other. Anything else FAILS `FENCE-VIEW-IMPORT`. `food-model.cjs` and
`sleep-model.cjs` are on the list because the views call their pure refusal and projection helpers
and neither holds a client (`problem.test.mjs:1996-:2001` asserts exactly that).

### E.4 How it reads code - KEPT FROM v1, with Q7 decided the other way
v1's method stands: the import side uses `esbuild`'s metafile through the existing `buildToday()`
path (exact, no false positives, and it is how `assertImportRouteIsolation` already works); the call
side uses a token scan over `codeOf(source)`, the comment-and-string stripper the today cells
already use (`problem.test.mjs:2006`, `setup.test.mjs:1035`); the scan is over IDENTIFIERS and
MEMBER NAMES, not over call expressions, which is what makes E.5 row 1 fail. There is still no
JavaScript parser in `node_modules` and this repository does not `npm install` inside a lane.

**S-R5 asks v1's Q7 again, now that `put()` stays inside a released file the fence scans. I decide
it the other way, and the evidence is what changed.** v1 renamed `put()` (`today-app.cjs:815`, about
90 call sites) to `slot()` so the fence's word list could keep `put` as an IndexedDB store method
with no exception. Under this direction that rename is 90 gratuitous lines of diff in a file whose
whole value is that it barely changes, and the byte proof of D.1 and the DOM proof of D.2 both get
noisier for it.

**So: `put()` keeps its name, and `put`, `add` and `delete` come OFF the word list.** What replaces
them is stronger, not weaker: `transaction`, `objectStore`, `IDBObjectStore` and `IDBTransaction`
go ON. A real `store.put(...)` needs an `IDBObjectStore`, and the only ways to reach one are
`indexedDB` (fenced), an `IDBDatabase` (fenced), a `.transaction(...)` call (now fenced), an
`.objectStore(...)` call (now fenced) or a host import (fenced by the metafile). **The name `put`
was never the chokepoint; the four I added are.** The residual case - a released file handed an
`IDBObjectStore` as a parameter - is the callback-smuggling class E.6 already names and neither word
list can catch, and E.6's runtime guard is what covers it.

The rest of v1's false-positive policy is kept: `Map.prototype.set`, `Set.prototype.add` and
`Array.prototype.push` are not fenced; `element.remove()`, `.append()`, `.replaceChildren()` are not
fenced; a comment mentioning `host.save` is invisible because `codeOf` strips comments, deliberately,
because the views carry long explanatory comments and a fence that failed on prose would be turned
off within a week. The fence prints the number of files it scanned and their names; zero is a FAIL
(`FENCE-NOTHING-TO-SCAN`), and so is a run in which `today-app.cjs` is not among them
(`FENCE-RELEASED-FILE-NOT-SCANNED`, which is S-R5's teeth).

One new false positive the reversal creates and I will name rather than discover: `problemControl`
(`:2213-:2237`) calls `navigator.clipboard.writeText` inside a released drawing region, and the
blind map's probe 10 flags it. It is a platform write, not a durable one, and it is not on E.3's
list - `writeText` is absent by design and `navigator.storage` is present. The fence's verdict on
that exact line is PASS, stated here so nobody adds `.write` to the list later and breaks it.

### E.5 Red first, including the five tricks - KEPT FROM v1

v1's five planted tricks are kept unchanged and all five still hold under the new direction, with
the planted file now being `today-app.cjs` in a COPY of the tree rather than a view module:

1. aliasing `const s = host.save; s(x);` FAILS `FENCE-WRITER-NAME`, because the scan matches the
   member name where it is READ.
2. computed member `host['sa' + 've'](x)` FAILS twice, by the metafile and by
   `FENCE-COMPUTED-MEMBER`, with v1's stated policy on array indexing kept verbatim.
3. dynamic import `await import("./food-host.mjs")` FAILS `FENCE-VIEW-IMPORT` from the metafile,
   `kind: "dynamic-import"`.
4. a writer re-exported through a helper FAILS twice.
5. the smuggled callback is NOT caught statically - E.6.

Plus v1's five structural rows from `S9-RELEASE-SPEC.md` D.2, re-asserted here. **And three new rows
the re-aiming needs:**

6. `today-app.cjs` importing `sleep-host.mjs` as well as `today-lanes.cjs` FAILS
   `FENCE-SECOND-SEALED-IMPORT`.
7. `today-app.cjs` calling `createTodayModel(...)` anywhere but its export list FAILS
   `FENCE-REEXPORT-USED`.
8. a released file naming `model` or `options` outside the parameter list and the one handoff FAILS
   `FENCE-MODEL-HELD` (the one-handoff rule, B.3).

**Thirteen red rows**, against v1's ten. Every one is planted in a copy of the tree with the
`planted()` pattern `copy.test.mjs:395` already uses, never in the real tree.

### E.6 The blind spot, and Q3 (S-R5)

**v1's E.6 is KEPT, named exactly as it named it**, and S-R5 asks whether the runtime gesture guard
is still in scope. **It is, and the case is stronger under the new direction.**

A callback the sealed half hands the view is, to any static reader, just a function; nothing in the
file's text distinguishes `on.recordIntake(cal, pro)` called from a click listener from the same
call made at the top of a render function. No token scan and no parser can fence it. That was true
of v1's five free view modules and it is true of `today-app.cjs` now - and now the file that could
do it is 2000 lines of drawing that six tickets are about to edit, instead of a module written once
by the split round. **The exposure is larger, so the guard matters more.**

The guard, in the sealed half, about twelve lines: every writing entry in `on` is wrapped in
`if (!gestureOpen) throw new Error("WRITER-OUTSIDE-GESTURE: " + name)`, where `gestureOpen` is set
true by the sealed half's own `on.listen(el, type, fn)` shim for the duration of the synchronous
part of a DOM event dispatch and false otherwise. The released view installs EVERY listener through
`on.listen`, so a legitimate call passes and a call made during a paint throws. Its red-first cell:
a view that calls `on.recordIntake()` from its render path throws `WRITER-OUTSIDE-GESTURE` and
records nothing, proven against the real food lane with the store open.

Two things the new direction changes about it, both in its favour: the shim is in the SEALED half
(under v1 it lived in a free `today-chrome.cjs`, where a free file both armed and checked the
guard), and `on.listen` gives D.2b's listener census a single chokepoint to count at.
It is NEW SEALED CODE, which is the one thing this spec asks for beyond a move, and v1's rule
stands: it belongs to the split round, under the child that carries the split, and **if the PM
refuses new sealed code the blind spot must be written into the S10 brief in one sentence, not left
to be discovered.**

---

## F. `today-model.cjs` (S-R3; v1's section F, re-decided)

### F.1 What moves, and the choice S-R3 asks me to justify

S-R3: "`today-model.cjs`'s writer (`weighIn` `:378` to `:395`) moves to the sealed side (the new
module or a small sealed sibling: choose and justify)".

**I choose a small sealed SIBLING, `rebuild/m3/w7-preview/today/today-readings.cjs`, and I move two
functions into it and nothing else.**

| moves to `today-readings.cjs` (NEW, SEALED) | stays in `today-model.cjs` (FREE, and it should be RELEASED) |
|---|---|
| `weighIn` `:378-:398` | `createTodayModel` `:150-:457` and its whole closure |
| `reopen` `:401-:405` | `read()` `:288-:361` and the whole projection: `storedReads`, `storedFoodDays`, `stateFromOps`, `foodProjectionOf`, `storedSleepNights`, `sessionFor`, `adoptedRead`, `whySections` |
| the three refusal constants those two compose: `ALREADY_RECORDED` `:365`, `FORM_MIN`/`FORM_MAX` `:372`, `OUT_OF_RANGE` `:373` | the seven pure top-level functions `clone`, `previewClock`, `engineClockFor`, `createBasisState`, `hasOpenProposal`, `planMove`, `projectionOf` |
| | `adoptBasis` `:412-:420`, `setPendingAdoption` `:423`, `setFoodDays`, `setSleepNights` |
| | the S2 composer `marchingOrderSentence` and `view.orderSentence` (S-R3, and G.2) |

`createTodayModel` composes the sibling: `const w = createReadingsWriter({ day, readings, adoptedRead,
stateFromOps, noStore: NO_STORE, setMessage });` and puts `w.weighIn` and `w.reopen` on the object it
returns, so the returned surface, the 120-odd `createTodayModel(...)` call sites, `today-entry.mjs`
and `module.exports` `:459-:463` are all unchanged.

**The justification, in four parts, because this is the decision most open to disagreement.**

(a) *Why not the new module.* `today-lanes.cjs` is `mountToday`'s partner and is constructed per
mount; `createTodayModel` is constructed by every cell and by `today-entry.mjs:348` without a
document. Putting the reading writer inside `today-lanes.cjs` would make the model depend on the
page's mount, which is a real coupling for no gain.

(b) *Why not move `createTodayModel` whole.* It would make `weighIn` byte-identical (see (c)) and it
would seal `read()` - the 74 lines that compose the whole view DTO. **That reintroduces, in
`today-model.cjs`, precisely the failure the PM attributes to v1's frozen view-model:** a look
ticket that needs one new field on the view goes back through a reseal child. C-UI-3's proposal card
is the live case (C.3). The projection must stay free, so the writer must leave it, not the reverse.

(c) *What it costs, stated exactly.* `weighIn` closes over `adoptedRead`, `stateFromOps`, `day`,
`readings`, `lastMessage` and `NO_STORE`. Five of the six are injected unchanged. The sixth is the
cost: `lastMessage = { ... }` at `:380`, `:386` and `:392` becomes `setMessage({ ... })`. **Three
lines, in a writer, and therefore NOT a pure move.** D.1's wrapper gains a sixth substitution, W6
(`lastMessage = <object literal>` to `setMessage(<the same object literal>)`), allowed in `weighIn`
and `reopen` only and counted. If the reviewer will not accept W6, the honest fallback is (d).

(d) *The fallback, if the PM prefers zero writer rewriting.* Declare `today-model.cjs`
**PINNED-UNCHANGED** in S10, exactly as PM-R3 of `:542` already does for `gym-model.mjs` and
`checkin-app.mjs`. Its bytes are then pinned by the artifact, `weighIn` stays where it is, no look
ticket may edit the file, and the split moves nothing here at all. The cost is that `read()` is then
closed to the look tickets too, which costs C-UI-3 a child if its proposal card needs a field. **I
recommend the sibling; the fallback is cheaper by two hours and worse by one ticket.**

### F.2 The three things that DO NOT move, and why
**`adoptBasis` and `setPendingAdoption` stay free, and this QUALIFIES S-R3's word list.** S-R3 names
`adoptBasis` as a writer no released file may call. After the split no released file calls it: the
call sites are `armAdoptionGate:2435` and `adoptAthleteState:2494`, both of which move into
`today-lanes.cjs`. But `adoptBasis` is still DEFINED in a free file. It writes nothing durable: it
replaces the in-memory basis that `read()` projects from and clears a flag (`:412-:423`, and the
comment there says so). A look ticket that broke it breaks a screen, not a record. **So the fence's
subject is the DURABLE write path, and `adoptBasis` and `setPendingAdoption` are outside it.** If
the PM wants the literal rule instead, they go into `today-readings.cjs` with `weighIn` and `read()`
must then reach them through the sibling - about eight more lines and one more injected accessor,
and I would take the literal rule if the PM says so rather than argue it twice.

**`marchingOrderSentence` and `view.orderSentence` stay free** (S-R3 and `:542` (D)): the composer
is pure over the object the engine returned and the assignment is one line inside `read()`. Under
this direction they need not move at all, which is simpler than v1's F.2, where the composer went to
a new `today-projection.cjs`. **v1's `today-projection.cjs` is not built.** There is no reason for
it once `today-model.cjs` itself is released: the seven pure functions are already free and already
exported, and splitting them out would be a move for its own sake with a `REQUIRED_INPUTS` entry and
a `VIEW_SOURCES` question attached. That is v1's Q8 answered in the negative for the model.

**`gym-model.mjs` and `checkin-app.mjs` stay where they are** and S9 declares them pinned-unchanged
(B.9). The split needs exactly that and nothing more from PM-R3.

---

## G. SEQUENCING (S-R7; v1's section G, re-aimed)

### G.1 Against C-UI-1 - KEPT FROM v1

v1's finding stands and I did not re-measure it: C-UI-1 does not touch `today-app.cjs`; the one
overlap is `build.mjs`, in a different region; C-UI-1 lands first and the split rebases forward onto
it, never the reverse, because the split is the larger and riskier change and it should be the one
that moves.

### G.2 Against `rebuild/c-s9-today-carry` (S-R7)

**The carry lands FIRST.** v1's Q5 is accepted by S-R7 and the reasoning is kept: the carry is
reviewed twice with 0 blocking, `:542` (D) gives it Fable final ACCEPT for carriage in S9, and
holding four lines of drawing code behind a multi-day split costs something and buys nothing.
Landing it first also means the split's D.1 and D.2 baselines are taken on a tree that already has
it.

**Under the new direction its one `today-app.cjs` binding line at `:869` stays exactly where it is**
(S-R7), inside `renderToday`, in the released half. Its `today-model.cjs` hunks -
`marchingOrderSentence` as a new pure top-level function and `view.orderSentence` inside `read()` -
also stay exactly where they are (F.2). **So all three of the carry's hunks are untouched by this
split, in place, with no relocation at all.** v1's G.2 had to describe a three-way relocation if the
carry landed second; that paragraph is now void. If the carry lands second anyway, nothing moves and
nothing needs saying.

One note for the merge, kept from v1 and still true: the carry also edits `design.cjs` (+19/-3),
`adapter.test.mjs`, `view.test.mjs` and `rebuild.yml`. This split does not edit `design.cjs` at all
any more (B.6), so v1's predicted textual conflict there is gone.

### G.3 The design lane bases on the split branch (S-R7)

C-UI-2 through C-UI-7 branch from **the commit the PM names once the build is accepted**, which is
the merge commit of the reseal child that carries the split (G.4), never from the tip before it and
never from the split's own unmerged lane branch.

What each may touch after that commit - and it is a much shorter list of prohibitions than v1's:
| ticket | may touch | may NOT touch |
|---|---|---|
| C-UI-2 | `today-app.cjs`, `screens.template.html`, `design.cjs`, `preview.css`, `checkin-*`, `today-model.cjs` | `today-lanes.cjs`, `today-readings.cjs`, any `*-host.mjs`, `today-entry.mjs` |
| C-UI-3 | as C-UI-2 | as above, plus `today-readings.cjs`'s weigh-in refusals |
| C-UI-4 | `gym-app.mjs`, `gym-model.mjs` (pinned-unchanged: read it, do not edit it), `screens.template.html` | `gym-settings-lane.mjs`, `machine-settings-host.mjs`, `gym-host.mjs` |
| C-UI-5 | `gym-app.mjs`, `machine-settings-view.mjs`, `screens.template.html` | as C-UI-4 |
| C-UI-6 | a new `coach-app.mjs` **imported from `today-app.cjs`, never from `today-entry.mjs`**, and `today-app.cjs` including the router's coach branch | `today-lanes.cjs`, `rebuild/coach/**` |
| C-UI-7 | `today-app.cjs`, `food-model.cjs` and `sleep-model.cjs` **except their refusal halves** (H.5 item 4), `sleep-*`, `screens.template.html` | `today-lanes.cjs`, `food-host.mjs`, `reading-host.mjs` |

Two tickets may run in parallel only if they touch different regions of the same released file.
**This is the one place v1's five-file cut was better and I will say so:** v1 split the view into
five modules precisely so C-UI-2, C-UI-3 and C-UI-7 would not contend in one file, and under this
direction they all edit `today-app.cjs`. The answer is S-R1 (g)'s: **the design lane may modularise
the released view into several files later, freely, as lane C work**, and it should - but it is not
this round's work and it is no longer under the seal, so it costs a lane C ticket rather than a
reseal child. In the meantime C-UI-3 already says "after C-UI-2" in its own SEQUENCING line, and
C-UI-7's regions (`:1086-:1806`) do not overlap C-UI-2's (`:839-:1025`) or C-UI-6's (`:2357`).

### G.4 Which reseal child carries the split, and the thing the S10 author must be told

**S10, not S9** (S-R7, and v1's Q4, both accepted). S9's spec, its PM token line and its two reviews
all say `today-app.cjs` stays sealed; `:542` (A) settles the two-path list; and S10 can USE the
`released` mechanism S9 builds instead of building and using it in one round.

**The thing that must be said out loud (finding 7).** A `released` entry in the artifact carries
`pre` = the parent's pin and `post: null` (`S9-RELEASE-SPEC.md` H4: "a released file has no
post-image in this package"), and walk 1 re-asserts a declared path **in Git at `sourceBase`**, not
on disk at HEAD (`:1829-:1833`). So S10 CAN, in one package, both release `today-app.cjs` and change
it: the release check passes because the bytes at S10's `sourceBase` (the S9-sealed tip) still equal
S9's pin, and the changed bytes at HEAD are never hashed, because H7 puts the released branch before
`const disk = diskSha(file)`. **That is not a bug and it is not an accident; it is the trade `:536`
recorded in the owner's own words - "the seal's byte-level guarantee over screen files is given
up".** But an S10 reviewer who does not know it will read a package that changed 660 lines of a file
and recorded no hash for them, and call it a hole. It must be in the S10 brief in one sentence.

**Two consequences that follow from it and are load-bearing:**

1. **The split's product commits must be INSIDE the S10 package, not merged to the chain ahead of
   it.** If they land on `rebuild/t2-client-core` first, S10's `sourceBase` contains them, the
   `sourceBase` re-assertion of `today-app.cjs` against S9's pin fails
   `PIN-BROKEN-AT-SOURCEBASE`, and there is no third branch (the S9 spec proves this for the
   grandparent walk and the same shape applies here). This is the single sequencing mistake that
   would cost the round a day.
2. **H17 must be in S9**, or the release reverses itself at S10 (`:542` (B) ratifies it). The split
   depends on it for `preview.css` and `build.mjs` and will depend on it for its own two files at
   S11.

**The paths S10 must declare** (S-R7):

| path | role |
|---|---|
| `rebuild/m3/w7-preview/today/today-app.cjs` | **`released`**, `pre` = S9's pin, `post: null`; and the PM token line names it |
| `rebuild/m3/w7-preview/today/gym-app.mjs` | **`released`**, same shape |
| `rebuild/m3/w7-preview/today/today-lanes.cjs` | `new` |
| `rebuild/m3/w7-preview/today/gym-settings-lane.mjs` | `new` |
| `rebuild/m3/w7-preview/today/today-readings.cjs` | `new` (F.1; omitted if the PM takes F.1 (d)) |
| `rebuild/m3/w7-preview/today/today-model.cjs` | `released` (F.1) or `pinned-unchanged` (F.1 (d)) |
| `rebuild/m3/w7-preview/today/gym-model.mjs`, `checkin-app.mjs` | `pinned-unchanged`, carried forward from S9's PM-R3 |
| `rebuild/m3/w7-preview/today/build.mjs` | already released by S9; outside the declaration, and the B.10 edits are lane C |
| `rebuild/m3/w7-preview/today/test/food.test.mjs` | `edited` (D.3) |
| `rebuild/m3/w7-preview/today/test/problem.test.mjs` | `edited` (D.3) |
| `rebuild/m3/w7-preview/today/test/package.test.cjs` | `edited` (D.3, and H18 if it lands here) |
| `rebuild/lanes/c/ui-port/writer-fence.test.mjs` | `new`, with an execution pin (E) |
| `.github/workflows/rebuild.yml` | `edited`: one new step naming the fence cell by exact path, never globbed (`DECISIONS:117 (4)`, `:186 (3)`) |
| `rebuild/lanes/c/today-split/writes-fence.mjs`, `writes-regions.json`, `dom-snapshot.mjs`, `copy-census.mjs` | `new`, the proof artifacts of D |

**Two `released` entries and three or four `new` ones, against v1's two `edited` and six
`new`-plus-released.** v1's stop condition 8 - "six `new` plus `released` is a combination the
mechanism may not support" - does not arise, because under this direction nothing is both. The two
released paths are already parent-pinned and the new ones are ordinary `new`. That is the mechanism
being used for exactly the shape it was designed for, which is S-R1 (b) restated as a declaration.

---

## H. RISKS, STOPS, THE BAR, THE ESTIMATE, AND WHAT I REFUSE

### H.1 Risks

| # | risk | how likely | what it costs | what reduces it |
|---|---|---|---|---|
| 1 | **The handler wiring breaks and nobody notices**, as `DECISIONS:454` round 2 already found once in this file | the highest risk in the ticket, and higher than under v1 because E.6's shim touches every wiring site | a tap that records nothing, or records twice | D.2b's listener census, and `on.listen` as the single chokepoint to count at. This is where the review's first hours go |
| 2 | **A seam changes the ORDER of a write and a paint** without changing either | medium | a refusal drawn before the write it describes, or a button enabled too early | B.8 specifies all seven line by line and each carries a trace-asserting cell, not an end-state cell. The traces are the proof, not the snapshots |
| 3 | **A lane opens at a different moment**, because `renderToday:908`/`:917` reach `nutritionState:2245` and `sleepState:1951`, each of which opens an encrypted store as a side effect of a paint | medium, and the blind map raises it as a STOP candidate | the store opens before or after the first paint instead of because of it, which is behaviour | **The new direction removes this risk almost entirely**: `nutritionState` and `sleepState` STAY in the released view and call `on.openFoodLane()` / `on.openSleepLane()` at exactly the line they call the opener today. The paint still opens the store, at the same statement, in the same turn. Under v1's direction this was a real design problem; here the answer is that nothing moved |
| 4 | **The outcome table misses a path** and a refusal draws nothing | medium | a silent refusal, which is the one thing this page refuses to do | B.6's six shapes are a frozen table and the mapper is asserted EXHAUSTIVE: an unmapped outcome throws, and a red-first cell plants one |
| 5 | **`paint.token()` is called where `mountToken` was READ ONCE** and the value drifts within a writer | low but real | a late save paints over a screen the athlete navigated to, which is the bug `:2276-:2287` documents at length | `recordSleep` must capture `const token = paint.token()` at `:1839` exactly as it does today and compare that captured value, never call `paint.token()` twice in one path. D.1's W2 substitution is checked position by position for exactly this |
| 6 | **The re-export rule is quietly widened** by a later author who needs a third occurrence | low | the fence stops meaning anything about `createTodayModel` | the fence prints the count on every run (E.3), so widening it is a visible diff in the cell, not a silent edit |
| 7 | **The released view drifts into calling a sealed helper directly** over the months six tickets edit it | medium over time | the interface rots | the fence is the answer and it is why S-R5 re-aims it at the released files by name |
| 8 | **`machineFromDraft`, `FoodModel.refusalFor` and `SleepModel.refusalFor` are edited by a look ticket** and what gets stored changes | medium, and it is pre-existing | a bound silently widened | H.5 item 4 |

### H.2 STOP conditions

The build round STOPS and reports rather than proceeding when:

1. **An eighth seam is found** - a region where a draw and a write cannot be separated by B.8's
   shape. The seven are named; an eighth means the map is wrong and the report shows the lines.
2. **D.1 fails**: any of the 32 manifest regions has a different sha256 after de-indentation and the
   five (or six, with F.1's W6) declared substitutions. No exceptions, no "it is only a comment".
3. **A region is in neither D.1's manifest nor its `seams` block.**
4. **D.2 fails**, or more than three states are NOT COVERED.
5. **D.3 grows to a fourth required test edit**, or any edit removes or weakens an assertion rather
   than re-pointing it.
6. **D.4 fails**: the copy multiset is not equal, or the two new files hold any copy at all.
7. **The export surface changes**: `Object.keys(require("./today-app.cjs")).sort()` differs, which
   would force an edit to the pinned `today-entry.mjs`.
8. **The PAINT HANDLE needs a seventh entry** that is not a paint. Six are specified (B.4's five
   plus `paintTodayEntry`); a seventh that reads or writes anything durable means the direction is
   wrong and the report says so with the line that forced it.
9. **E.6's runtime guard cannot be built in twelve lines or thereabouts** without changing what a
   writer does on the happy path. Stop and ask, not stop and abandon.
10. **The split's commits have already been merged to the chain** when S10 runs (G.4 consequence 1).

### H.3 The bar - KEPT FROM v1

LANES.md screens tier plus the seal chain's own bar: the 682-test today suite green on both runners
(`rebuild.yml:232`) with only D.3's three edits; the whole `rebuild-public` workflow green on ubuntu
and windows; `python3 quality/gate.py` and `python3 quality/statesheet.py` from the 2026-09-18 pack
with `EARNED_APP` pointed at the preview build, green for `today` and for every T and W state the
suite renders; the six proofs of D plus the listener census, committed as artifacts; the
writer-fence cell RED first on all thirteen rows of E.5, then green; one independent Opus reviewer,
author is not reviewer, told to disagree, committing ONLY the review file; `--ci --package S<N>`
green and the inventory fence green; the browser check on the owner's PC, both themes, offline.

### H.4 The estimate, honest, beside v1's (S-R9)

I am estimating a round I will not run, on files I read but did not execute, so the bands are wide.
v1's own figures are in the third column for comparison.

| phase | hours | v1's |
|---|---|---|
| the sealed `today-lanes.cjs`: 601 lines moving whole, by cut and paste, from B.2's list | 3 to 4 | 3 to 4 (for 1700 lines) |
| the facade, the callback table and the paint handle (B.3, B.4), and the 24 `model.` to `view.` renames | 3 to 4 | 3 to 5 |
| the seven seams of B.8, with a trace cell each | 5 to 7 | 4 to 6 (for four bindings) |
| B.6's outcome table and the view's mapper, with the exhaustiveness cell | 2 to 3 | - (v1 did not have this) |
| `gym-app.mjs` and `gym-settings-lane.mjs` (B.9), including the five model call sites | 3 to 4 | - (v1 did not free C-UI-4 or C-UI-5 at all) |
| `today-readings.cjs` (F.1) | 1 to 2 | 1 |
| `build.mjs` and the export-surface proof (B.10) | 1 | 1 |
| the four proof scripts of D, written red-first | 4 to 6 | 4 to 6 |
| the three test edits of D.3, each re-run red first | 1 | 2 to 3 (for nine) |
| the writer-fence cell (E), thirteen red rows | 5 to 7 | 4 to 6 (for ten) |
| E.6's runtime gesture guard | 2 to 3 | 2 to 3 |
| running the bar, fixing what it finds, the browser check | 3 to 5 | 3 to 5 |
| the author's report | 2 | 2 |
| **BUILD ROUND TOTAL** | **35 to 48 hours** | **29 to 42** |
| **THE INDEPENDENT REVIEW** | **10 to 14 hours** | **8 to 12** |

**It is BIGGER than v1's, and the PM should know that before accepting.** Reason (e) said "the move
is about a third the size" and the move IS smaller - 663 lines against 1700, which is 39 percent -
but the SIZE OF THE MOVE is not what drives the hours. What drives them is: seven seams instead of
three or four; a second file (`gym-app.mjs`) v1 did not touch at all; an outcome table v1 did not
need; and three more red rows on the fence. The review grows for the same reasons and because the
reviewer must now hand-check that a RELEASED 2000-line file reaches no writer, which is a larger
reading job than checking five new modules written to a contract.

**And it is worth more.** v1 freed four tickets and half-freed two, for 29 to 42 hours; this frees
eight for 35 to 48. Per ticket freed, 5.4 hours against 8.6. The comparison the PM should hold is
not the two estimates but the two results: v1 leaves C-UI-4 and C-UI-5 on reseal children (three to
four hours each plus their fix rounds, and they are two of the tickets most likely to need a second
round), and leaves C-UI-3 and C-UI-7 working around copy constraints.

### H.5 What I refuse or qualify in the PM's rulings, with the evidence (S-R8, S-R9)

I did not find a reason to STOP. The direction is feasible and it is better than v1's on every
criterion I can measure. Four things are not as the ruling states them.

**1. Reason (c) is UNDERSTATED, and I would rather say so than let it be checked and found merely
true.** The PM says eleven test files import `today-app.cjs`, "so keeping the name on the half they
exercise avoids MOST of v1's nine test edits". Measured at `c15a69c0`: it avoids ALL nine. Zero
import paths change, `VIEW_SOURCES` does not change, the planted-dash cell does not change, the
`sleepSpanH` caller list does not change. What remains is three edits v1 did not have to make,
because v1 moved no writer and these three cells slice writers out of the file by declaration text
(D.3). Three, not nine, and none of them an import path.

**2. Reason (e) is right about the code and wrong about the cost.** "The move is about a third the
size": 663 lines against 1700 is 39 percent, close enough. But the ROUND is 20 percent bigger, for
the reasons in H.4. A PM choosing on effort should choose v1; a PM choosing on tickets freed, on
residue, or on how small the sealed surface ends up should choose this, and those are the three
things `:536` was about.

**3. Reason (f) is a good precedent and it is not the same cut.** `measure-view.mjs` (345 lines, 62
DOM calls, 0 store) and `measure-host.mjs` (279 lines, 0 DOM, 11 store) are the same SHAPE and they
are real evidence the destination is reachable - I re-checked the look map's census and it is
correct. But they were never one closure: the measure lane was BUILT in two files, so nobody had to
separate 76 closure bindings, and its view does not hold a router, a boot, an adoption chain or a
mount token. The precedent proves the shape is workable and says nothing about the cost of getting
there. The four lane hosts (`food-host.mjs`, `reading-host.mjs`, `machine-settings-host.mjs`,
`gym-host.mjs`, all 0 DOM) are the same kind of evidence and the same caveat.
**4. S-R2's sentence about refusal decisions cannot be met in full in this round, and the gap is
pre-existing.** "Parsing, conversion, bounds and refusal decisions for anything that gets stored
live in the sealed half." Inside `today-app.cjs` and `gym-app.mjs` that is carried out exactly
(B.3, B.8). But the RULES those decisions apply live in free files:

| rule | file and lines | who may edit it |
|---|---|---|
| the food entry's bound: digits only, `LIMITS`, `MEMBERS` | `food-model.cjs:37-:51` `refusalFor` and `:53-:63` `dayFromEntry` | C-UI-7 names `food-*` in MAY CHANGE |
| the sleep entry's bound: the times, hours and date refusals | `sleep-model.cjs:59-:76`, `:77-:87`, `:88-:94`, `:95-:101`, and `:102-:124` `nightFromEntry` | C-UI-7 names `sleep-*` |
| the machine-settings shape: the trim, the filter, the drop of an empty pair | `machine-settings-view.mjs:39-:49` `machineFromDraft` | C-UI-5 names it |

`acceptable` (`machine-settings-view.mjs:53-:59`) is NOT on this list: its whole body delegates to
`machineOf` from `rebuild/coach/machine-settings-commands.cjs`, which `:536` seals by name, and the
file states that in its own header. That one is already right.

The split neither creates this nor worsens it - `recordIntake` and `recordSettings` call the same
free functions today - and closing it needs scope this ticket was not given. **The cheap fix, and I
recommend it for the same round:** declare `food-model.cjs`, `sleep-model.cjs` and
`machine-settings-view.mjs` **PINNED-UNCHANGED** in S10, exactly as PM-R3 of `:542` does for
`gym-model.mjs` and `checkin-app.mjs`, and narrow C-UI-7's and C-UI-5's MAY CHANGE lines to the
copy, the projection and the DOM halves by name. That costs no code, it is the mechanism the PM has
already accepted once, and it closes the last place where a look ticket could change what gets
stored. **If the PM will not, the fence should at least assert that those five functions' bodies are
byte-identical to their pins, which is the same guarantee in a smaller box.**

### H.6 Open questions for the PM, each with a recommendation

Five, against v1's ten. The five v1 asked that this direction answers by itself (Q1 the wider test
rule, Q2 the coach seam, Q6 the draft accessor, Q8 five files or one, Q10 a second split) are
withdrawn with their reasons in the sections that dispose of them.

| # | question | recommendation |
|---|---|---|
| **Q1** | F.1: the weigh-in writer into a sealed sibling, at the cost of three rewritten lines and a sixth D.1 substitution; or `today-model.cjs` declared pinned-unchanged and nothing moved, at the cost of `read()` being closed to C-UI-3? | **The sibling.** The projection must stay editable or the split re-creates v1's frozen-view-model problem one file over |
| **Q2** | H.5 item 4: are `food-model.cjs`, `sleep-model.cjs` and `machine-settings-view.mjs` declared pinned-unchanged in S10, and the two MAY CHANGE lines narrowed? | **Yes.** Zero code, the mechanism is already accepted, and it closes the last route by which a look ticket changes what is stored |
| **Q3** | S-R5's re-ask: E.6's runtime gesture guard, about twelve lines of NEW sealed code. In scope? | **Yes, and more so than under v1**, because the file that could smuggle a callback is now 2000 lines that six tickets will edit. If no: one sentence in the S10 brief, written, not discovered |
| **Q4** | D.3's nine optional list widenings, or the fence's zero-copy assertion over the two sealed modules? | **The fence assertion.** One new law instead of nine edits in four sealed cells, and strictly stronger. Both if the PM wants belt and braces |
| **Q5** | G.4: does the PM accept that S10 releases `today-app.cjs` and changes it in the same package, with the changed bytes stood by the suite, the fence, CI and the gates rather than by a hash? | **Yes, and it must be written into the S10 brief in one sentence.** It is `:536`'s trade, carried out; it is not a hole, but it looks like one to a reviewer who has not been told |

Also carried to the PM, not a question: **the design lane should modularise the released
`today-app.cjs` into several files as a lane C ticket after C-UI-2 and C-UI-7 land** (S-R1 (g), and
G.3). It is the one thing v1 did better, it is no longer under the seal, and it costs a ticket
rather than a child.

---

## Appendix: what I did NOT verify, stated so it is not assumed

1. **I ran nothing.** No test suite, no build, no `b-package.cjs`, no gate, no browser check. Every
   line number is read, not executed. The 682 test count is the ticket's and `:542`'s, not mine.
2. **B.2's line counts are arithmetic over region boundaries I read by hand, not a tokenizer's
   output.** I re-derived every region HEAD at `c15a69c0` from the declaration list and I read the
   seven seams, the router, the boot, the api and the state block in full; I did NOT re-read all 120
   regions line by line. **The build round must re-derive D.1's manifest from the source and compare
   it to B.2 before trusting either.** A region misclassified as a whole move that is really a seam
   is the failure this warning is about, and it shows up as a D.1 red, which is the design.
3. **I did not re-run v1's C.2 inventory extraction.** C.2's citation lists are v1's, re-classified
   against the new cut; I checked six of them by hand and not the rest. The look map's section 2 is
   an independent second opinion that agrees ticket by ticket.
4. **I did not read the S9 runner's code**, only `S9-RELEASE-SPEC.md` at `d859096a` and the runner
   lines it quotes. G.4's argument about `sourceBase` rests on that spec's own quotations of
   `:1829-:1833`, H4 and H7, and on its round-3 status: **round 3 may have landed since I read it,
   and if the `released` block's shape changed, G.4 must be re-read against it before S10 declares
   anything.**
5. **I did not open `import/` or `measure/`.** Finding 5's claim that their deps objects and dynamic
   imports can move into `today-lanes.cjs` rests on `today-app.cjs`'s side of the interface only
   (`:628-:643`, `:645-:680`, `:688-:721`), which is where the handles are built and handed over.
6. **I did not verify which of the today cells are in the sealed inventory.** The look map counts
   twelve sealed test cells; `rebuild.yml:232` runs thirteen. D.3's three edits cross that line and
   the build round must resolve which cell is not pinned.
7. **I did not read `rebuild/conform/private`, `src/history.js`, any `ledger/` directory, the
   protected soak, or anything on the owner's data path. The owner's real measurements are not in
   this session.**
8. **This whole document is a hypothesis**, including its estimate, its seven seams and its claim
   that there is no residue. Disagree with it where the evidence lets you, and commit only the
   review file.
