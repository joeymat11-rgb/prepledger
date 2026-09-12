# N1 NUTRITION ENTRY - REPORT

Branch `rebuild/lane-c-n1`, base `origin/rebuild/t2-client-core` @ `f724644`, brief `N1-NUTRITION-BRIEF.md` (DECISIONS:143 + :154 (7); :162 CLEAR). Evidence: `N1-REPORT-ANNEX.md`.

## WHAT WAS MISSING, AND WHAT N1 ADDS

The engine's intake writer already existed (`rebuild/engine/writers.cjs:2789 writeDaily`, partial-row merge into `state.dailyLogs[iso]`) and the client's class already existed (`rebuild/client/ops.cjs:20 "food-day"`). The gap was the PROJECTOR: nothing replayed a stored food-day operation into `dailyLogs`. A1's precedent is exact - `today-model.cjs` replays readings with `E.applyRead` - and N1 is its mirror, `state = E.writeDaily(state, row.date, partial)`, date-ascending, through the engine's own writer. No figure is computed in adapter code: `writeDaily` has exactly one caller on this page and a test says so (P6).

Three new modules. `food-commands.cjs` - the producer: one `fact`/`food-day` op, payload `{profile, day{cal?, pro?}}`, bounds 0-20000 kcal and 0-1000 g REFUSED, never clamped. `food-model.cjs` - the refusal rule, the projector, and `winningRows` (latest op per date). `food-host.mjs` - the lane. One dated op per day; a correction is a NEW op and the latest wins, so the winning op carries the WHOLE day and a replaced figure is gone rather than stale (P4, P5). The screen matches Additions C: protein and energy are the engine's, carbohydrate and fat say "Not prescribed" with no figure (:154 (7)).

**H3 is not merged**, so a clean-init athlete's state makes the engine THROW out of `energy.cjs` rather than return a blocked view. `renderNutrition` therefore reads defensively: no figure at all, the reason in words with no number in it, and the entry below still records. Never a zero for a missing day - `loggedDay` reports an unwritten member as `null` and the screen prints nothing for it.

## THE PINNED-FILE CONSTRAINT, AND WHAT IT FORCED

`today-entry.mjs`, `gym-host.mjs`, `reading-host.mjs`, `checkin-host.mjs` and the journey suite are PINNED ON DISK by the merged B-NTC artifact (`legacy-gates.cjs:12-16`, PAGE_PINS), so `boot()` cannot gain a fifth lane. N1 opens its own through the same honest extension point machine-settings and A4b's producer use: `era.client.hostBindings({workoutCommands: createFoodCommands(), clock: clientClockFor(day)})`, then `createDurablePublicClient({...bindings, schemaVersion: LOCAL_ERA_SCHEMA_VERSION})`. One era, one lease, one device sequence, one generation.

The lane is opened lazily from `today-app.cjs` and FAILS CLOSED, so every jsdom mount in this repository is byte-for-byte unchanged: jsdom has no `indexedDB`, so `?screen=nutrition` there still says "not wired yet" and the pinned `view.test.mjs` passes untouched. In a real browser the lane opens and Today's `nutrition-state` carries the durable fact instead - blank until an intake is recorded, exactly as A3's `recovery-state` already does. `browser-check.mjs` was updated to say so.

## COUNTS (Windows, on this head)

today step as written **164** / setup **157** / catalogue **43** / problem **25** / copy **36** / **food 46 (new)** / W6 **552** / journey **51** (PAGE_PINS unmoved) / A0 host **32** / w7 **19**, all 0 fail.

    B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict
    A1 TODAY BUILD PASS: 3 assets; 107 pinned inputs (13 engine, 12 client); build
    earned-b1dfed776b83; approved design pinned; 68 bound classes; no em/en dash in any
    text the athlete can see

Five msedge checks PASS, including the new `food-check.mjs`: the lane opened, an intake recorded and read back off the engine, a reload, a correction that replaced the whole day, an out-of-range entry refused with nothing written, and the same record at 320px - across **3 REAL PROCESS KILLS** (`taskkill /F /T`, each verified dead). **Twelve mutants P1-P12 executed and killed**, restored 46/46; table in the annex.

## PREFLIGHT, NAMED (DECISIONS:155 (6), self-check)

1. `git status --porcelain` and `git diff --stat f724644..HEAD` - diff inside custody.
2. The ten `node --test` count commands above, run from the worktree root (annex section 2 lists them verbatim).
3. `node rebuild/m3/w7-preview/today/build.mjs` - build PASS at the exact head.
4. `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` - the gate ALONE, clean before and after.
5. `node -e` over this report (<= 60 lines) and over every file in UI custody for U+2013/U+2014 in string literals (comments are not the athlete's text, DECISIONS:114 (1)).
6. `node ..\tools\ci-status.js rebuild/lane-c-n1 <sha>` from `work/lane-c/main` - CI green at the exact head.

## SERVED, AND WHAT IS OWED

http://127.0.0.1:4178/ , `serve.mjs` pid **60756**, rebuilt on this head; `/app.js` **1474981 bytes**, carrying `earned-b1dfed776b83` and no placeholder.

**Correction to the dispatch**: the brief commit is **47e9bb2**, not `033fd3f` (a coach commit); cherry-picked as `9f925e3`. **CI residual**: `test/food.test.mjs` and `food-check.mjs` are not in `rebuild.yml`'s enumerated today step - `.github` is editable only inside a re-pinning engine package (DECISIONS:112), so they ride the next re-seal with the setup and copy suites. **Docs rider**: the cherry-pick carries `N2-SLEEP-BRIEF.md` (198 lines) beside N1's brief, as the dispatch allowed; nothing else outside custody is in the diff. **Not done**: the owner's hand test on a phone.
