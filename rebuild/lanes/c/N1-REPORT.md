# N1 NUTRITION ENTRY - REPORT

Branch `rebuild/lane-c-n1`, rebased onto `origin/rebuild/t2-client-core` @ `05b73e2` (catalogue heads merged, :170) - CLEAN, no conflict. Brief `N1-NUTRITION-BRIEF.md` (DECISIONS:143 + :154 (7)). Evidence: `N1-REPORT-ANNEX.md`.

## WHAT WAS MISSING, AND WHAT N1 ADDS

The engine's intake writer already existed (`rebuild/engine/writers.cjs:2789 writeDaily`, partial-row merge into `state.dailyLogs[iso]`) and the client's class already existed (`rebuild/client/ops.cjs:20 "food-day"`). The gap was the PROJECTOR: nothing replayed a stored food-day operation into `dailyLogs`. A1's precedent is exact - `today-model.cjs` replays readings with `E.applyRead` - and N1 is its mirror, `state = E.writeDaily(state, row.date, partial)`, date-ascending, through the engine's own writer. No figure is computed in adapter code: `writeDaily` has exactly one caller on this page and a test says so (P6).

Three new modules. `food-commands.cjs` - the producer: one `fact`/`food-day` op, payload `{profile, day{cal?, pro?}}`, bounds 0-20000 kcal and 0-1000 g REFUSED, never clamped. `food-model.cjs` - the refusal rule, the projector, and `winningRows` (latest op per date). `food-host.mjs` - the lane. One dated op per day; a correction is a NEW op and the latest wins, so the winning op carries the WHOLE day and a replaced figure is gone rather than stale (P4, P5). The screen matches Additions C: protein and energy are the engine's, carbohydrate and fat say "Not prescribed" with no figure (:154 (7)).

## D2 ROUND 1 - THE THREE BLOCKING FINDINGS (review `a7c91a1`, candidate `25650f8`)

Every finding reproduced first, at D2's own bytes. RED was measured by stashing ONLY the four product files and running the suite with the new cells present: **7 fail / 45 pass**. GREEN at this head: **52 pass / 0 fail**.

**1 (P1, N1.11) - the protein save/replay CRASH. CONFIRMED and fixed in the projector.** `writeDaily` merges the day and then, for any day carrying `pro`, consults the OWED LEDGER through `proteinTarget(s)` (`energy.cjs`), which THROWS on a clean-init state. A protein intake was durably written and then took the whole projection, and the screen, down with it. `food-model.cjs` now has `foodProjection(state, rows, engine)`: each row goes through the engine's writer inside a try, `next` advances only on a writer that RETURNED (so nothing is half applied), and a refused date is NAMED in `unavailable` rather than thrown. `today-model.cjs` exposes `recordedFood(date)` (the winning op, with its stamp) and `foodUnavailable(date)`. The screen shows his own recorded figures off the operation plus `FOOD_KEPT_UNREADABLE`, which says the ledger will not open without a body-composition estimate, that nothing is lost, and that the figures appear when it exists. **Nothing is dropped and no engine target is fabricated.** Cells: `D2.1 - a clean-init athlete can record PROTEIN: kept, replayed, read back` (real entry, protein-only then calories+protein, host closed and REOPENED, read back) and `D2.1 - the projector NAMES the days the engine refused, and never throws`.

**3 (P2, screen state 6) - refusals were not actionable. CONFIRMED and fixed.** Three paths, three fixes, each saying WHAT was refused, WHY in the words of whatever refused it, and WHAT TO DO. (a) `openFoodLane` no longer swallows the cause: it records `error.code || error.message`, or `NO_LOCAL_STORE` when the device offers no store, and repaints. (b) The no-store note now LEADS with `FOOD_NO_STORE` + the store's own reason. (c) A save refusal prints `FOOD_REFUSED` + the client's own `copy` (verbatim, never reworded) or the `code` it named + `FOOD_REFUSED_ACTION`, and the boxes are deliberately NOT re-rendered, so everything entered is still there. A lane that opened INTO a refusal (`host.openedRefusal`, the restore-required case) says so before he types. Cells: `N1.16 / D2.3`, `D2.3 - a store refusal says WHAT, WHY in the store own words, and WHAT TO DO` (closed case through the real composition + a client sentence carried verbatim), `D2.3 - a store that REFUSES TO OPEN says its reason`.

**3, CUSTODY DISCLOSURE.** D2 asked for the false unbuilt-feature copy to go. `rebuild/m3/w7-preview/today/test/view.test.mjs` is PINNED ON DISK by the merged B-NTC artifact (`B-NTC.json` product, `f0d4e66a...`) and asserts `/not wired yet/` on this screen; removing the sentence turned the gate red and I reverted that edit rather than touch a pinned file. The sentence is kept BYTE-IDENTICAL, demoted to LAST, and is still true of what it now describes: the full nutrition PLAN behind the tile is unbuilt, which is exactly what Today's own `NOT_WIRED` marker says. The athlete reads the actionable sentence first; a cell pins the ordering. Lifting it needs the PM to unpin `view.test.mjs` (DECISIONS:154 (5) territory).

**4 (P2, screen state 5) - provenance absent. CONFIRMED and fixed.** `foodDaysIn` always kept `date/time/offset`; the DOM printed only "Recorded today" and the totals. `provenanceLine(row)` now renders the STORED effective stamp of the WINNING operation and invents nothing the log does not hold. Browser-measured: `Recorded today at 08:00 (local offset -05:00) · 2,100 kcal · 150 g protein`. Cell: `D2.4 - the recorded line carries the STORED effective time and offset` (a correction, then a REOPEN off the durable log).

**2 (withdrawn)** and **5 (resolved)** are recorded as D2 left them; no change was made for either.

## THE PINNED-FILE CONSTRAINT, AND WHAT IT FORCED

`today-entry.mjs`, `gym-host.mjs`, `reading-host.mjs`, `checkin-host.mjs` and the journey suite are PINNED ON DISK by the merged B-NTC artifact (`legacy-gates.cjs:12-16`, PAGE_PINS), so `boot()` cannot gain a fifth lane. N1 opens its own through the same honest extension point machine-settings and A4b's producer use: `era.client.hostBindings({workoutCommands: createFoodCommands(), clock: clientClockFor(day)})`, then `createDurablePublicClient({...bindings, schemaVersion: LOCAL_ERA_SCHEMA_VERSION})`. One era, one lease, one device sequence, one generation.

The lane is opened lazily and FAILS CLOSED, so every jsdom mount in this repository still passes untouched: jsdom has no `indexedDB`. In a real browser the lane opens and Today's `nutrition-state` carries the durable fact, blank until an intake is recorded, exactly as A3's `recovery-state` does.

## COUNTS (Windows, on this head)

today step as written **164** / setup **157** / catalogue **57** / problem **25** / copy **36** / **food 52** (46 + 6 D2 cells) / W6 **552** / journey **51** (PAGE_PINS unmoved) / A0 host **32** / coach **201**, all 0 fail. Combined serial today + coach + W6 + host: **1276 / 1276**.

    B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict
    A1 TODAY BUILD PASS: 3 assets; 107 pinned inputs (13 engine, 12 client); build
    earned-cada43f69750; approved design pinned; 68 bound classes; no em/en dash in any
    text the athlete can see

Six msedge checks PASS at this head (`browser-check`, `dash-check`, `setup-check`, `checkin-check`, `gym-check`, `food-check`), `food-check.mjs` across **3 REAL PROCESS KILLS** (`taskkill /F /T`, each verified dead) and now printing the provenance line above. **Twelve mutants P1-P12 executed and killed**, restored; table in the annex.

## PREFLIGHT, NAMED (DECISIONS:155 (6), self-check)

1. `git status --porcelain` and `git diff --stat 05b73e2..HEAD` - diff inside custody.
2. The ten `node --test` count commands above, plus `node --test "rebuild/coach/test/*.test.cjs"`, run from the worktree root (annex section 2 lists them verbatim).
3. `node rebuild/m3/w7-preview/today/build.mjs` - build PASS at the exact head.
4. `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` - the gate ALONE, clean before and after.
5. `node -e` over this report (<= 60 lines) and over every file in UI custody for U+2013/U+2014 in string literals (comments are not the athlete's text, DECISIONS:114 (1)).
6. `node ..\tools\ci-status.js rebuild/lane-c-n1 <sha>` from `work/lane-c/main` - CI green at the exact head.

## WHAT IS OWED

**CI residual (unchanged):** `test/food.test.mjs` and `food-check.mjs` are still not in `rebuild.yml`'s enumerated today step - `.github` is editable only inside a re-pinning engine package (DECISIONS:112), so they ride the next re-seal with the setup and copy suites. D2 registered the same residual. **Custody residual:** the unwired-plan sentence above, which only a `view.test.mjs` unpin can remove. **Not done:** the owner's hand test on a phone.
