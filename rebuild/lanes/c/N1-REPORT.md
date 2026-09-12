# N1 NUTRITION ENTRY - REPORT

Branch `rebuild/lane-c-n1`, rebased onto `origin/rebuild/t2-client-core` @ `63f3a1c` - CLEAN, no conflict. Brief `N1-NUTRITION-BRIEF.md` (DECISIONS:143 + :154 (7)). Evidence: `N1-REPORT-ANNEX.md`.

## D2 ROUND 2 - R2-1, COMMIT AND READ-BACK (review `08d75c7`, candidate `ae26fee`)

D2 closed findings 1, 3 and 4 and isolated what remained: `foodEntryFor.save` awaited `refresh()` AFTER the client had already acknowledged the operation, so a read that failed rejected out of `save`, out of `recordIntake` and into the event promise. The op was durable and the screen said nothing at all. Reproduced at D2's own bytes: RED **4 fail / 52 pass** with `today-app.cjs`, `design.cjs` and the template stashed; GREEN **56 / 0**.

**A COMMIT AND A READ ARE TWO OUTCOMES, and the screen now says which one failed.** `save` still awaits the read-back, but reports it: an acknowledged result comes back with `readBack: true`, or `readBack: false` and the read's own `readCode`. `recordIntake` cannot reject - `await foodLane.save(...)` is wrapped, so a lane that throws is an **UNKNOWN** outcome and is said to be unknown, never "no part of it was recorded". On `readBack: false` the acknowledgment is kept and rendered **from the committed operation** (`Recorded today · 1,800 kcal`), the read failure is named beside it with the store's own reason and `FOOD_READ_ACTION`, and what he typed is put back into both boxes. A new `data-slot="food-retry"` control (`text-link`, hidden until there is a failed read) calls `retryFoodRead()`, which reads the durable log again and **submits no intake**: on success the read-back state clears and the screen goes back to the record; on failure only the reason changes. Every sentence is dash free, figure free, declared in `design.cjs` and rendered through `plainOrDrop`.

Cells (all RED at `ae26fee`): `D2.R2 - an ACKNOWLEDGED intake whose read-back fails stays on screen, with a retry` (real `createFoodHost`, one committed op asserted in the repository, the event promise asserted NOT to reject, then the retry read asserted to write nothing and restore the normal record); `D2.R2 - a save whose outcome is UNKNOWN says unknown, and never that nothing was stored`; `D2.R2 - the page own lane reports the read-back failure instead of throwing it`; `D2.R2 - the new sentences are declared, dash free, and carry no figure`.

## WHAT WAS MISSING, AND WHAT N1 ADDS

The engine's intake writer already existed (`rebuild/engine/writers.cjs:2789 writeDaily`, partial-row merge into `state.dailyLogs[iso]`) and the client's class already existed (`rebuild/client/ops.cjs:20 "food-day"`). The gap was the PROJECTOR: nothing replayed a stored food-day operation into `dailyLogs`. A1's precedent is exact - `today-model.cjs` replays readings with `E.applyRead` - and N1 is its mirror, `state = E.writeDaily(state, row.date, partial)`, date-ascending, through the engine's own writer. No figure is computed in adapter code: `writeDaily` has exactly one caller on this page and a test says so (P6).

Three new modules. `food-commands.cjs` - the producer: one `fact`/`food-day` op, payload `{profile, day{cal?, pro?}}`, bounds 0-20000 kcal and 0-1000 g REFUSED, never clamped. `food-model.cjs` - the refusal rule, the projector, and `winningRows` (latest op per date). `food-host.mjs` - the lane. One dated op per day; a correction is a NEW op and the latest wins, so the winning op carries the WHOLE day and a replaced figure is gone rather than stale (P4, P5). The screen matches Additions C: protein and energy are the engine's, carbohydrate and fat say "Not prescribed" with no figure (:154 (7)).

## D2 ROUND 1 - THE THREE BLOCKING FINDINGS (review `a7c91a1`, candidate `25650f8`)

RED then was **7 fail / 45 pass** with the four product files stashed; GREEN 52/0. **1** - `writeDaily` consults the owed ledger through `proteinTarget` for any day carrying `pro` and throws on a clean-init state; `food-model.cjs foodProjection()` now advances state only on a writer that RETURNED and NAMES the refused dates, `today-model.cjs` exposes `recordedFood()` and `foodUnavailable()`, and the screen shows his own figures off the winning operation with the reason the ledger is shut (cells `D2.1 ...`). Nothing is dropped and no engine target is fabricated. **3** - `openFoodLane` keeps the cause, the no-store note leads with what cannot happen and why, and a save refusal carries the client's own copy verbatim (or its code) plus the action with the boxes kept (cells `N1.16 / D2.3`, `D2.3 ...`). **4** - `provenanceLine(row)` renders the stored effective time and offset of the winning operation (cell `D2.4 ...`). **2** withdrawn, **5** resolved. D2 verified all three closed.

**3, CUSTODY DISCLOSURE.** D2 asked for the false unbuilt-feature copy to go. `rebuild/m3/w7-preview/today/test/view.test.mjs` is PINNED ON DISK by the merged B-NTC artifact (`B-NTC.json` product, `f0d4e66a...`) and asserts `/not wired yet/` on this screen; removing the sentence turned the gate red and I reverted that edit rather than touch a pinned file. The sentence is kept BYTE-IDENTICAL, demoted to LAST, and is still true of what it now describes: the full nutrition PLAN behind the tile is unbuilt, which is exactly what Today's own `NOT_WIRED` marker says. The athlete reads the actionable sentence first; a cell pins the ordering. Lifting it needs the PM to unpin `view.test.mjs` (DECISIONS:154 (5) territory).

## THE PINNED-FILE CONSTRAINT, AND WHAT IT FORCED

`today-entry.mjs`, `gym-host.mjs`, `reading-host.mjs`, `checkin-host.mjs` and the journey suite are PINNED ON DISK by the merged B-NTC artifact (`legacy-gates.cjs:12-16`, PAGE_PINS), so `boot()` cannot gain a fifth lane. N1 opens its own through the same honest extension point machine-settings and A4b's producer use: `era.client.hostBindings({workoutCommands: createFoodCommands(), clock: clientClockFor(day)})`, then `createDurablePublicClient({...bindings, schemaVersion: LOCAL_ERA_SCHEMA_VERSION})`. One era, one lease, one device sequence, one generation.

The lane is opened lazily and FAILS CLOSED, so every jsdom mount in this repository still passes untouched: jsdom has no `indexedDB`. In a real browser the lane opens and Today's `nutrition-state` carries the durable fact, blank until an intake is recorded, exactly as A3's `recovery-state` does.

## COUNTS (Windows, on this head)

today step as written **164** / setup **157** / catalogue **57** / problem **25** / copy **36** / **food 56** (46 + 6 round-1 + 4 round-2 cells) / W6 **552** / journey **51** (PAGE_PINS unmoved) / A0 host **32** / coach **201**, all 0 fail. Combined serial today + coach + W6 + host: **1280 / 1280**.

    B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict
    A1 TODAY BUILD PASS: 3 assets; 107 pinned inputs (13 engine, 12 client); build
    earned-aef1e9fd5dc1; approved design pinned; 68 bound classes; no em/en dash in any
    text the athlete can see

Six msedge checks PASS at this head (`browser-check`, `dash-check`, `setup-check`, `checkin-check`, `gym-check`, `food-check`), `food-check.mjs` across **3 REAL PROCESS KILLS** (`taskkill /F /T`, each verified dead) and now printing the provenance line above. **Twelve mutants P1-P12 executed and killed**, restored; table in the annex.

## PREFLIGHT, NAMED (DECISIONS:155 (6), self-check)

1. `git status --porcelain` and `git diff --stat 63f3a1c..HEAD` - diff inside custody.
2. The ten `node --test` count commands above, plus `node --test "rebuild/coach/test/*.test.cjs"`, run from the worktree root (annex section 2 lists them verbatim).
3. `node rebuild/m3/w7-preview/today/build.mjs` - build PASS at the exact head.
4. `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` - the gate ALONE, clean before and after.
5. `node -e` over this report (<= 60 lines) and over every file in UI custody for U+2013/U+2014 in string literals (comments are not the athlete's text, DECISIONS:114 (1)).
6. `node ..\tools\ci-status.js rebuild/lane-c-n1 <sha>` from `work/lane-c/main` - CI green at the exact head.

## WHAT IS OWED

**CI residual (unchanged):** `test/food.test.mjs` and `food-check.mjs` are still not in `rebuild.yml`'s enumerated today step - `.github` is editable only inside a re-pinning engine package (DECISIONS:112), so they ride the next re-seal with the setup and copy suites. D2 registered the same residual. **Custody residual:** the unwired-plan sentence above, which only a `view.test.mjs` unpin can remove. **Not done:** the owner's hand test on a phone.
