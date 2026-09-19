# BLIND EDGES - re-derived, not copied (S-R24)

Every row below is a SHAPE in the syntax, found by walking the three files, not a name a
hand put in a list. reach.cjs's own twelve-row table is a constant inside that script; this
is the derivation S-R24 rules, and the delta between the two is printed by the build report.

Worktree: `rebuild/c-today-split-build at 5638af7a (the S9 lane head form of the three files)`

| rows | dynamic-import 9 | deferred-continuation 34 | foreign-callback 9 | deferred 1 |
|---|---|---|---|---|
| 53 | 9 | 34 | 9 | 1 |

| file | line | class | edge | region after the cut | the line that proves it |
|---|---|---|---|---|---|
| `gym-app.mjs` | `:146` | deferred-continuation | `then(<inline>)` | GA-S03 (move) | `settingsReading = Promise.resolve()` |
| `gym-app.mjs` | `:146` | deferred-continuation | `then(<inline>)` | GA-S03 (move) | `settingsReading = Promise.resolve()` |
| `gym-app.mjs` | `:146` | deferred-continuation | `then(<inline>)` | GA-S03 (move) | `settingsReading = Promise.resolve()` |
| `gym-app.mjs` | `:164` | deferred-continuation | `then(<inline>)` | GA-S04 (move) | `settingsOpening = Promise.resolve()` |
| `gym-app.mjs` | `:164` | deferred-continuation | `then(<inline>)` | GA-S04 (move) | `settingsOpening = Promise.resolve()` |
| `gym-app.mjs` | `:164` | deferred-continuation | `then(<inline>)` | GA-S04 (move) | `settingsOpening = Promise.resolve()` |
| `gym-app.mjs` | `:164` | deferred-continuation | `catch(<inline>)` | GA-S04 (move) | `settingsOpening = Promise.resolve()` |
| `gym-app.mjs` | `:165` | dynamic-import | `./machine-settings-host.mjs` | GA-S04 (move) | `.then(() => import('./machine-settings-host.mjs'))` |
| `gym-app.mjs` | `:269` | foreign-callback | `MachineSettingsView.renderEditor <- onChanged` | RELEASED body | `MachineSettingsView.renderEditor(doc, map, { copy: SETTINGS_COPY, draft: paintedDraft, put,` |
| `today-app.cjs` | `:516` | deferred-continuation | `then(<inline>)` | TA-S13 (move) | `sleepOpening = Promise.resolve()` |
| `today-app.cjs` | `:516` | deferred-continuation | `then(<inline>)` | TA-S13 (move) | `sleepOpening = Promise.resolve()` |
| `today-app.cjs` | `:516` | deferred-continuation | `then(<inline>)` | TA-S13 (move) | `sleepOpening = Promise.resolve()` |
| `today-app.cjs` | `:516` | deferred-continuation | `catch(<inline>)` | TA-S13 (move) | `sleepOpening = Promise.resolve()` |
| `today-app.cjs` | `:517` | dynamic-import | `./sleep-host.mjs` | TA-S13 (move) | `.then(() => import("./sleep-host.mjs"))` |
| `today-app.cjs` | `:558` | dynamic-import | `./checkin-model.mjs` | TA-S15 (move) | `checkInKitLoading = Promise.all([import("./checkin-model.mjs"), import("./checkin-app.mjs")])` |
| `today-app.cjs` | `:558` | dynamic-import | `./checkin-app.mjs` | TA-S15 (move) | `checkInKitLoading = Promise.all([import("./checkin-model.mjs"), import("./checkin-app.mjs")])` |
| `today-app.cjs` | `:558` | deferred-continuation | `then(<inline>)` | TA-S15 (move) | `checkInKitLoading = Promise.all([import("./checkin-model.mjs"), import("./checkin-app.mjs")])` |
| `today-app.cjs` | `:558` | deferred-continuation | `catch(<inline>)` | TA-S15 (move) | `checkInKitLoading = Promise.all([import("./checkin-model.mjs"), import("./checkin-app.mjs")])` |
| `today-app.cjs` | `:599` | deferred-continuation | `then(<inline>)` | TA-S18 (move) | `foodOpening = Promise.resolve()` |
| `today-app.cjs` | `:599` | deferred-continuation | `then(<inline>)` | TA-S18 (move) | `foodOpening = Promise.resolve()` |
| `today-app.cjs` | `:599` | deferred-continuation | `then(<inline>)` | TA-S18 (move) | `foodOpening = Promise.resolve()` |
| `today-app.cjs` | `:599` | deferred-continuation | `catch(<inline>)` | TA-S18 (move) | `foodOpening = Promise.resolve()` |
| `today-app.cjs` | `:600` | dynamic-import | `./food-host.mjs` | TA-S18 (move) | `.then(() => import("./food-host.mjs"))` |
| `today-app.cjs` | `:650` | dynamic-import | `../measure/measure-screen.mjs` | TA-M01 (seam) | `const Screen = await import("../measure/measure-screen.mjs");` |
| `today-app.cjs` | `:653` | foreign-callback | `measureScreen.paint <- <function literal>` | RELEASED body | `await measureScreen.paint(root, () => token === mountToken);` |
| `today-app.cjs` | `:709` | dynamic-import | `../import/import-screen.mjs` | TA-M02 (seam) | `const Screen = await import("../import/import-screen.mjs");` |
| `today-app.cjs` | `:719` | foreign-callback | `importScreen.paint <- <function literal>` | TA-M03 (seam) | `await importScreen.paint(root, () => token === mountToken);` |
| `today-app.cjs` | `:788` | deferred | `chain.then(answered, answered)` | TA-S22 (move) | `chain.then(answered, answered);` |
| `today-app.cjs` | `:1417` | deferred-continuation | `then(<inline>)` | TA-S27 (move) | `const pending = Promise.resolve().then(() => checkin.host.forDate(day)).then((rows) => {` |
| `today-app.cjs` | `:1417` | deferred-continuation | `then(<inline>)` | TA-S27 (move) | `const pending = Promise.resolve().then(() => checkin.host.forDate(day)).then((rows) => {` |
| `today-app.cjs` | `:1417` | deferred-continuation | `catch(<inline>)` | TA-S27 (move) | `const pending = Promise.resolve().then(() => checkin.host.forDate(day)).then((rows) => {` |
| `today-app.cjs` | `:1417` | deferred-continuation | `then(<inline>)` | TA-S27 (move) | `const pending = Promise.resolve().then(() => checkin.host.forDate(day)).then((rows) => {` |
| `today-app.cjs` | `:1436` | deferred-continuation | `then(<inline>)` | TA-M07 (seam) | `sleepCheckInViewPending = Promise.all([loadCheckInKit(), readSleepCheckIn(date, true)]).then(() => {` |
| `today-app.cjs` | `:1985` | deferred-continuation | `then(<inline>)` | TA-S32 (move) | `return Promise.resolve(active.refresh()).then(() => {` |
| `today-app.cjs` | `:1987` | foreign-callback | `checkInKit.mountCheckIn <- onBack, onChanged` | TA-S32 (move) | `return checkInKit.mountCheckIn(doc, phone, { model: active,` |
| `today-app.cjs` | `:2000` | deferred-continuation | `then(<inline>)` | TA-S32 (move) | `return Promise.resolve(fresh.refresh()).then(() => {` |
| `today-app.cjs` | `:2005` | foreign-callback | `checkInKit.mountCheckIn <- onBack, onChanged` | TA-S32 (move) | `return checkInKit.mountCheckIn(doc, phone, {` |
| `today-app.cjs` | `:2059` | dynamic-import | `./today-entry.mjs` | TA-S34 (move) | `return import("./today-entry.mjs")` |
| `today-app.cjs` | `:2059` | deferred-continuation | `then(<inline>)` | TA-S34 (move) | `return import("./today-entry.mjs")` |
| `today-app.cjs` | `:2059` | deferred-continuation | `then(<inline>)` | TA-S34 (move) | `return import("./today-entry.mjs")` |
| `today-app.cjs` | `:2059` | deferred-continuation | `catch(<inline>)` | TA-S34 (move) | `return import("./today-entry.mjs")` |
| `today-app.cjs` | `:2059` | deferred-continuation | `then(<inline>)` | TA-S34 (move) | `return import("./today-entry.mjs")` |
| `today-app.cjs` | `:2081` | foreign-callback | `next.setOnRefresh <- <function literal>` | TA-S34 (move) | `next.setOnRefresh(() => { if (screen === "today") render("today", false); });` |
| `today-app.cjs` | `:2302` | foreign-callback | `setup.open <- back, done` | TA-M11 (seam) | `return setup.open({ doc, phone,` |
| `today-app.cjs` | `:2352` | foreign-callback | `checkin.open <- back` | TA-M12 (seam) | `return checkin.open({ doc, phone, back: () => render(origin, true) });` |
| `today-app.cjs` | `:2365` | foreign-callback | `workout.open <- back` | TA-M13 (seam) | `return workout.open({ doc, phone, back: () => render("today", true),` |
| `today-app.cjs` | `:2484` | dynamic-import | `./local-source-basis.mjs` | TA-S36 (move) | `return import("./local-source-basis.mjs")` |
| `today-app.cjs` | `:2484` | deferred-continuation | `then(<inline>)` | TA-S36 (move) | `return import("./local-source-basis.mjs")` |
| `today-app.cjs` | `:2484` | deferred-continuation | `catch(<inline>)` | TA-S36 (move) | `return import("./local-source-basis.mjs")` |
| `today-app.cjs` | `:2484` | deferred-continuation | `then(<inline>)` | TA-S36 (move) | `return import("./local-source-basis.mjs")` |
| `today-app.cjs` | `:2492` | deferred-continuation | `then(<inline>)` | TA-S37 (move) | `return athleteBasisState().then(async (state) => {` |
| `today-app.cjs` | `:2492` | deferred-continuation | `catch(<inline>)` | TA-S37 (move) | `return athleteBasisState().then(async (state) => {` |
| `today-app.cjs` | `:2492` | deferred-continuation | `finally(<inline>)` | TA-S37 (move) | `return athleteBasisState().then(async (state) => {` |
