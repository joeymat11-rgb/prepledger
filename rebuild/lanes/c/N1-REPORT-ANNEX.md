# N1 NUTRITION ENTRY - REPORT ANNEX

Evidence for `N1-REPORT.md`. Branch `rebuild/lane-c-n1`, base `origin/rebuild/t2-client-core` @ `f724644`,
brief cherry-picked as `9f925e3` (from `47e9bb2` on `rebuild/lane-c-briefs`).

## 1. FILES, WITH sha256 OF THE BYTES ON DISK

New:

    194190aa0a12e30d937eb5c4c59878b58089eeab93f6783f46969eddadcaddc5  103 lines  today/food-commands.cjs
    6aa96ff884ee5e62e1c64582d1f5896b571f2710bd08e63628eb8527edf5ab43  101 lines  today/food-model.cjs
    009e7e93d230e4168dfacd7f6a7ea35652c79612b1c6c5bfd3b18c13c2180c88  112 lines  today/food-host.mjs
    08d608a5968a6a319f25c57e59e9bf30013e7a7673522e1a9e12b3266d15cd15  301 lines  today/food-check.mjs
    4b5aba390a236f5671adf3bfc3d3e0544339629578de3e2ac8a7f679a9e32c60  757 lines  today/test/food.test.mjs

Changed (sha256 after):

    c9949ef82a11ca4ac115aea4c99f1501989e9d0b66f086e1d85d6e98255c163e  907 lines  today/today-app.cjs
    1d2e9c7667439d297d6c68dbd0b6a28f5efd923599b49d45b407bd130769855e  313 lines  today/today-model.cjs
    4b2801e82b9670ec3bdc956743f247190769e8ce055a5140ecbb47eae0a79564  404 lines  today/screens.template.html
    38626406381a7e1ee00283b3ee87437c0483705a7cdcc284dd04a6cdb104a41b  540 lines  today/design.cjs
    ec4a98121f288fadb716fe3e1845ecfc0f0ac489fe35d9ed4e86eaf82947064d  269 lines  today/build.mjs
    (browser-check.mjs, 12 lines changed - see section 3)

`git diff --stat f724644 -- rebuild/m3/w7-preview/today`:

    browser-check.mjs      12 +-      build.mjs               10 ++
    design.cjs             20 ++      screens.template.html   23 +++
    today-app.cjs         202 ++      today-model.cjs         35 ++
    6 files changed, 293 insertions(+), 9 deletions(-)

Whole-branch diff adds only `rebuild/lanes/c/N1-NUTRITION-BRIEF.md` (229) and `N2-SLEEP-BRIEF.md` (198) on
top of that. Nothing under `rebuild/m3/w6/`, `m4`, `engine`, `client`, `conform` or `.github` is touched.

## 2. COUNTS, WITH THE COMMANDS THAT PRODUCED THEM

All from the worktree root on Windows, at this head. `T = rebuild/m3/w7-preview/today/test/`.

| command | tests / pass / fail |
|---|---|
| `node --test T/adapter T/checkin T/design.test.cjs T/gym T/ntc-h6-delta T/package.test.cjs T/view` (rebuild.yml's today step, verbatim) | **164 / 164 / 0** |
| `node --test T/setup.test.mjs` | **157 / 157 / 0** |
| `node --test T/catalogue.test.mjs` | **43 / 43 / 0** |
| `node --test T/problem.test.mjs` | **25 / 25 / 0** |
| `node --test T/copy.test.mjs` | **36 / 36 / 0** |
| `node --test T/food.test.mjs` (NEW) | **46 / 46 / 0** |
| `node --test rebuild/m3/w6/test/*.test.mjs` | **552 / 552 / 0** |
| `node --test rebuild/m3/w6/test/local-today-journey.test.mjs` | **51 / 51 / 0** |
| `node --test rebuild/m3/w6/host/test/journey.test.mjs .../engine-equivalence.test.cjs .../host-seams.test.mjs` | **32 / 32 / 0** |
| `node --test rebuild/m3/w7-preview/test/*.test.cjs` | **19 / 19 / 0** |

Gates:

    node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
      -> B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package
         verdict; the 19 original gates, the private oracle and independent exact-artifact
         acceptance remain separate, and POSTFIX PACKAGE PASS is unavailable on this mode
      (run ALONE; working tree clean of tracked changes to pinned files before and after)

    node rebuild/m3/w7-preview/today/build.mjs
      -> A1 TODAY BUILD PASS: 3 assets; 107 pinned inputs (13 engine, 12 client); build
         earned-b1dfed776b83; approved design pinned; 68 bound classes; 2 pinned typefaces
         inlined; no literal figure in the template; 3/3 assets scanned and free of any
         network reference; no em/en dash in any text the athlete can see

The build input inventory grew from 104 to 107: `food-commands.cjs`, `food-model.cjs`, `food-host.mjs`.
`food-check.mjs` and `test/food.test.mjs` are not build inputs; they are a check and a suite.

## 3. THE HUNKS IN THE SHARED PAGE FILES

**`today-app.cjs`** (+202): the `FOOD_*` copy constants and `FOOD_REFUSAL_COPY`; `foodLane` / `foodOpening`
/ `foodSaving` state with `foodEntryFor()` and `openFoodLane()` (dynamic `import("./food-host.mjs")`, opened
once, failing closed); `readOrNoTargets()` in front of `renderNutrition`; the `!foodLane` / `else` branch in
`renderNutrition`; `foodEntry(map)` and `recordIntake()`; `intakeLine()`; `nutritionState()`; and
`foodPending()` / `foodReady()` on the returned api so a check can await a durable write instead of
guessing at turns of the event loop. Nothing existing was rewritten: the pre-N1 nutrition screen is exactly
what still renders when there is no lane.

**`today-model.cjs`** (+35): `options.foodDays`, `storedFoodDays()`, one line in `stateFromOps()`
(`state = FoodModel.projectFoodDays(state, storedFoodDays(), E)`, after the reading replay), and
`foodDays()` / `setFoodDays(lane)` / `loggedFood(date)` on the api.

**`screens.template.html`** (+23): the `food-entry` section inside `t-nutrition`, built only from approved
classes (`field`, `section-label`, `small muted`, `hours`, `error`, `primary`). No inline style, no literal
figure, no class of N1's own - asserted by N1.14 and N1.16.

**`design.cjs`** (+20): twelve sentences added to `PREVIEW_RUNTIME_COPY`. `VIEW_SOURCES` is unchanged and
still pinned by `design.test.cjs`, which is why `food-model.cjs` names refusals by CODE and `today-app.cjs`
owns the words.

**`build.mjs`** (+10): the three new modules in `REQUIRED_INPUTS`.

**`browser-check.mjs`** (12 changed): `nutrition-state` moves out of the "Not wired yet" loop and into the
blank-marker assertion beside `recovery-state`, because on a device that HAS a food lane the marker carries
the durable fact. This is A3's own precedent, quoted in the file's comment.

## 4. THE S-CHECK ROLL-UP (`test/food.test.mjs`, 46 tests)

| check | what it executes |
|---|---|
| N1.1 | the producer builds ONE `fact`/`food-day` op, payload keys `['profile','day']`, no parents; refuses every request that is not its own; refuses a causal parent the log does not hold |
| N1.2 | the class and kind are read out of `rebuild/client/ops.cjs` AT TEST TIME and out of its source text, not restated from the brief |
| N1.3 | at least one of `cal`/`pro` is required; an empty day writes nothing; `dayFromEntry` leaves an unanswered box OUT (not 0, not null) |
| N1.4 | every bound refuses AT THE PRODUCER and nothing is clamped; `refusalFor` names the refusal for every entry the screen can produce; the screen refuses in its own words and writes nothing |
| N1.5 | one save is ONE operation and its outbox entry in one transaction; a refused entry writes no part of itself; the read-back carries date, time, offset and day; the lane reads back ONLY its own profile out of the one generation; a closed lane refuses in the client's own shape |
| N1.6 | three saves leave THREE operations and ONE projected row; `winningRows` keeps the LAST row per date, date-ascending; a second entry for the same day is a CORRECTION and the latest wins; a row that is not a dated day is ignored rather than guessed at |
| N1.7 | the projector EQUALS the engine - the same rows replayed INDEPENDENTLY through `E.writeDaily` are byte-identical; with no rows it writes nothing; `writeDaily` has exactly ONE caller on this page and `food-model.cjs` imports no engine of its own |
| N1.8 | an unanswered member comes back as no figure at all, never a zero |
| N1.9 | `writeDaily`'s partial merge does not leak ACROSS ops: a correction replaces the day; a relaunch reads the record off disk |
| N1.10 | a second day is its own row; the model replays readings AND food days into one state; the lane can be attached after the model was built, as the page does |
| N1.11 | H3: `createCleanInitState` is built through the ACCEPTED reducer, `model.read()` really throws, and the screen shows NO figure, the reason with no number in it, and a working entry that records |
| N1.12 | with a lane the entry is on the screen in its own words, both boxes blank, "not wired yet" gone |
| N1.13 | carbohydrate and fat are named as not prescribed, with no figure anywhere in either row |
| N1.14 | the design binding covers every new sentence and REFUSES a dropped one; every class in the new template section is a selector in the APPROVED stylesheets; the template carries no literal figure |
| N1.15 | no em or en dash in N1's string literals, its template section, or the rendered screen |
| N1.16 | N1 invents no class and sets no width; the boxes take the approved 16px numeric control |
| N1.17 | the build carries the three modules, names no network, and stamps a 12-hex build tag |
| N1.18 | `today-bindings.mjs` and the four PAGE_PINS files are BYTE-UNCHANGED against the B-NTC package's own hashes; the lane really is opened through `client.hostBindings` and no w6 factory is asked for a fifth lane |
| N1.19 | the nutrition route does not touch first-run or restore-required; Today says what the DURABLE record says, and keeps A1's marker until there is a lane |
| N1.20 | N1 touches nothing outside its custody; the producer imports nothing from `rebuild/client` |

RED first, executed on this head: with `food-model.cjs`'s `projectFoodDays` stubbed to `return state` - the
exact gap N1 exists to close - the suite ran **46 tests, 35 pass, 11 fail**. Restored **46 / 46 / 0**.

## 5. MUTANTS P1-P12, EXECUTED AND RESTORED

Each mutant was applied to the working tree, the suite run, then the original bytes written back. Baseline
and final both **46 / 46 / 0**.

| mutant | result | first tests that caught it |
|---|---|---|
| P1 write `0` for an unanswered field | 43 / **3 fail** | N1.3 dayFromEntry; N1.6 correction; N1.11 H3 |
| P2 clamp an out-of-range value silently | 44 / **2 fail** | N1.4 refusalFor; N1.4 the screen refuses |
| P3 update the existing op instead of writing a new one | 44 / **2 fail** | N1.6 three saves; N1.6 correction |
| P4 project the FIRST op for a date | 41 / **5 fail** | N1.6 winningRows; N1.7 projector equality; N1.9 |
| P5 let a stale `cal` survive from an earlier op | 44 / **2 fail** | N1.9 no leak across ops; N1.6 correction |
| P6 compute the day in adapter code instead of the engine | 45 / **1 fail** | N1.7 one caller of `writeDaily` |
| P7 render a calorie band for a clean-init athlete | 45 / **1 fail** | N1.11 H3 |
| P8 invent a carbohydrate target | 45 / **1 fail** | N1.13 |
| P9 edit `today-bindings.mjs` | 45 / **1 fail** | N1.18 PAGE_PINS bytes |
| P10 use a class not in `ops.cjs` | 33 / **13 fail** | N1.2; N1.5 one op + outbox; N1.6 |
| P11 put an em dash in a new sentence | 43 / **3 fail** | N1.15; N1.14 design binding; N1.17 build |
| P12 skip the outbox entry (`stage: null` at N1's own seam) | 29 / **17 fail** | N1.5 one op and its outbox entry |

## 6. THE BROWSER CHECK (msedge, with real kills)

`W7_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`,
`node rebuild/m3/w7-preview/today/food-check.mjs`, exit 0:

    N1 NUTRITION BROWSER CHECK PASS - ?screen=nutrition opened its own food lane -> an
    intake recorded and read back off the engine -> a genuine reload -> a correction that
    replaced the whole day -> an out-of-range entry refused with nothing written -> the
    same record at 320px, across 3 REAL PROCESS KILLS (taskkill /F /T, each verified
    dead); no off-origin request, no horizontal overflow at 390px or 320px, both boxes
    >= 16px and >= 44px, the record control fully in view at both widths, and no U+2013
    or U+2014 rendered in anything N1 owns.
      nutrition at 390: record control 784-842 in a 842px viewport, 58px high, no sideways scroll
      2100 kcal and 150 g recorded and read back off the engine: Recorded today - 2,100 kcal
        - 150 g protein Recording it again replaces today's figures.
      survived a real taskkill /F /T with the figures intact
      a correction replaced the day: Recorded today - 1,900 kcal Recording it again replaces
        today's figures.
      an out-of-range entry was refused and changed nothing: Calories are recorded as a whole
        number between 0 and 20000. Nothing was recorded.
      nutrition at 320: record control 784-842 in a 842px viewport, 58px high, no sideways scroll

(The separators in the two "Recorded today" lines are U+00B7 on screen; they are written as hyphens here so
this file stays plain ASCII.)

The other four msedge checks were re-run on this head and all PASS: `browser-check.mjs` (8 msedge killed,
verified), `gym-check.mjs` (3 real kills), `checkin-check.mjs`, `setup-check.mjs` (7 real kills). The first
`browser-check.mjs` run on this head FAILED on `nutrition-state does not say so on Today's face` - the
genuine, intended consequence of wiring the lane - and the check was updated as section 3 describes.

## 7. PROVENANCE

- Op design, bounds and the "latest wins" rule: `N1-NUTRITION-BRIEF.md` sections 1-6 (DECISIONS:143).
- Carbohydrate and fat "not prescribed": DECISIONS:154 (7), and the approved Additions C nutrition design
  harvested through `design.cjs` rather than retyped.
- The writer: `rebuild/engine/writers.cjs:2789 writeDaily`, read at test time, not quoted.
- The class and kind: `rebuild/client/ops.cjs` KINDS/CLASSES, read at test time (N1.2).
- The extension point: `rebuild/m3/w6/local/local-client.mjs:395 hostBindings`, used exactly as
  `setup-host.mjs` and the coach's machine-settings lane use it.
- The pin mechanism: `rebuild/conform/v4/postfix/legacy-gates.cjs:12-16` and
  `rebuild/lanes/b/tooling/packages/B-NTC.json`, both read at test time by N1.18.
- H3: DECISIONS:124 / :142, executed here rather than quoted (N1.11 runs the throw).

## 8. RESIDUALS

1. **CI**: `test/food.test.mjs` and `food-check.mjs` have no home in `rebuild.yml`; `.github` is editable
   only inside a re-pinning engine package (DECISIONS:112). They ride the next re-seal with the setup,
   catalogue, copy and problem suites. Until then they are run by hand, as this report records.
2. **`today-entry.mjs` still does not boot the food lane.** It is pinned on disk until DECISIONS:154 (5).
   When it unpins, `openFoodLane()` should be deleted and the lane injected by `boot()` like the other four;
   the injection point (`options.food`) already exists and the tests already drive it.
3. **`?screen=nutrition` under jsdom still says "not wired yet"** because `view.test.mjs` is pinned and
   jsdom has no `indexedDB`. That sentence is now reachable only on a device with no encrypted store.
4. **H3**: when the engine can produce a band and a protein target for a clean-init athlete, the
   `view.blocked` branch in `renderNutrition` stops being taken and nothing else changes.
5. **The owner's hand test on a real phone** is still owed; nothing here substitutes for it.
6. **P12's seam**: the outbox is written by the accepted durable client, not by N1. The mutant that killed
   it (`stage: null`) is applied at N1's own call into that client, which is the only seam N1 owns there.
