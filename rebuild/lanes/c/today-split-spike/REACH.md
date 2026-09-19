# REACH - what a paint root, a boot and a listener actually reach

Worktree: `/home/claude/farm/scratch/wt/split-tip`. Measured by acorn 8 over the UNCUT source.

PUT = it may put a row of the athlete's on disk. STORE = it reaches a store and stores
nothing. ADOPT = it replaces an in-memory basis or moves a gate (F.2: not durable).
The three columns say whether the PAINT entry, the MOUNT BODY (the boot) or a LISTENER
reaches the function the call sits in: SYNC through plain calls only, `async/callback`
only through a deferred `.then`, a foreign callback or a listener edge.

## `today-app.cjs`  (202 functions, 367 edges, 25 listener installations)

| line | call | class | sits in | paint | boot | listener |
|---|---|---|---|---|---|---|
| `:365` | `workout.summary()` | STORE | `session` | SYNC | SYNC | SYNC |
| `:371` | `checkin.summary()` | STORE | `checkinSummary` | SYNC | SYNC | SYNC |
| `:384` | `setup.firstRun()` | STORE | `firstRun` | SYNC | SYNC | SYNC |
| `:422` | `model.setFoodDays()` | ADOPT | `mountToday` | - | SYNC | - |
| `:482` | `model.setSleepNights()` | ADOPT | `mountToday` | - | SYNC | - |
| `:489` | `host.all()` | STORE | `.refresh` | - | - | - |
| `:493` | `host.save()` | PUT | `.save` | - | - | - |
| `:495` | `<expr>.refresh()` | STORE | `.save` | - | - | - |
| `:501` | `host.close()` | STORE | `.close` | - | - | - |
| `:508` | `lane.rows()` | STORE | `sleepRowsMatter` | async/callback | async/callback | async/callback |
| `:520` | `host.all()` | STORE | `<anon@519>` | async/callback | async/callback | async/callback |
| `:522` | `model.setSleepNights()` | ADOPT | `<anon@519>` | async/callback | async/callback | async/callback |
| `:558` | `Promise.all()` | STORE (not a store: false positive) | `loadCheckInKit` | SYNC | SYNC | SYNC |
| `:574` | `host.all()` | STORE | `.refresh` | - | - | - |
| `:581` | `host.save()` | PUT | `.save` | - | - | - |
| `:583` | `<expr>.refresh()` | STORE | `.save` | - | - | - |
| `:589` | `host.close()` | STORE | `.close` | - | - | - |
| `:603` | `host.all()` | STORE | `<anon@602>` | async/callback | async/callback | async/callback |
| `:605` | `model.setFoodDays()` | ADOPT | `<anon@602>` | async/callback | async/callback | async/callback |
| `:718` | `importScreen.reopen()` | PUT (not a store: false positive) | `renderImport` | SYNC | SYNC | SYNC |
| `:954` | `workout.recover()` | PUT | `<anon@949>` | - | - | SYNC |
| `:1072` | `model.weighIn()` | PUT | `<anon@1059>` | - | - | SYNC |
| `:1293` | `foodLane.save()` | PUT | `recordIntake` | - | - | SYNC |
| `:1327` | `foodLane.refresh()` | STORE | `retryFoodRead` | - | - | SYNC |
| `:1374` | `host.today()` | STORE | `sleepToday` | SYNC | SYNC | SYNC |
| `:1407` | `active.recorded()` | STORE | `sleepCheckInFor` | SYNC | SYNC | SYNC |
| `:1416` | `host.forDate()` | STORE | `<anon@1416>` | async/callback | async/callback | async/callback |
| `:1435` | `Promise.all()` | STORE (not a store: false positive) | `renderSleepCheckIn` | SYNC | SYNC | SYNC |
| `:1439` | `checkInKit.recordedLines()` | STORE | `<anon@1435>` | async/callback | async/callback | async/callback |
| `:1451` | `sleepLane.rows()` | STORE | `sleepOpsFor` | SYNC | SYNC | SYNC |
| `:1732` | `sleepLane.refresh()` | STORE | `retrySleepRead` | - | - | SYNC |
| `:1843` | `sleepLane.save()` | PUT | `recordSleep` | - | - | SYNC |
| `:1861` | `sleepLane.refresh()` | STORE | `recordSleep` | - | - | SYNC |
| `:1899` | `sleepLane.refresh()` | STORE | `recordSleep` | - | - | SYNC |
| `:1984` | `active.refresh()` | STORE | `reboundCheckIn` | SYNC | SYNC | SYNC |
| `:1987` | `checkin.refresh()` | STORE | `.onChanged` | async/callback | async/callback | async/callback |
| `:1999` | `fresh.refresh()` | STORE | `reboundCheckIn` | SYNC | SYNC | SYNC |
| `:2008` | `checkin.refresh()` | STORE | `.onChanged` | async/callback | async/callback | async/callback |
| `:2072` | `after.close()` | STORE | `<anon@2060>` | async/callback | async/callback | async/callback |
| `:2151` | `setup.summary()` | STORE | `setupNote` | SYNC | SYNC | SYNC |
| `:2199` | `setup.summary()` | STORE | `problemState` | - | - | SYNC |
| `:2431` | `setup.summary()` | STORE | `canAdoptAthleteState` | async/callback | SYNC | async/callback |
| `:2435` | `model.setPendingAdoption()` | ADOPT | `armAdoptionGate` | async/callback | SYNC | async/callback |
| `:2437` | `gym.holdForAdoption()` | ADOPT | `armAdoptionGate` | async/callback | SYNC | async/callback |
| `:2484` | `module.admittedLocalSourceState()` | STORE | `<anon@2484>` | async/callback | async/callback | async/callback |
| `:2488` | `setup.athleteState()` | STORE | `<anon@2488>` | async/callback | async/callback | async/callback |
| `:2494` | `model.adoptBasis()` | ADOPT | `<anon@2491>` | async/callback | async/callback | async/callback |
| `:2501` | `gym.rebase()` | ADOPT | `<anon@2491>` | async/callback | async/callback | async/callback |
| `:2502` | `workout.refresh()` | STORE | `<anon@2491>` | async/callback | async/callback | async/callback |
| `:2511` | `checkin.adoptEngineState()` | ADOPT | `<anon@2491>` | async/callback | async/callback | async/callback |
| `:2543` | `gym.holdForAdoption()` | ADOPT | `<anon@2529>` | async/callback | async/callback | async/callback |

## `gym-app.mjs`  (62 functions, 129 edges, 19 listener installations)

| line | call | class | sits in | paint | boot | listener |
|---|---|---|---|---|---|---|
| `:147` | `settingsLane.latest()` | STORE | `<anon@147>` | async/callback | async/callback | async/callback |
| `:305` | `settingsLane.save()` | PUT | `recordSettings` | - | - | SYNC |
| `:419` | `model.logSet()` | PUT | `<anon@415>` | - | - | SYNC |
| `:444` | `model.finish()` | PUT | `finishNow` | - | - | SYNC |
| `:498` | `model.forget()` | PUT | `<anon@496>` | - | - | SYNC |
| `:505` | `model.undo()` | PUT | `<anon@502>` | - | - | SYNC |
| `:546` | `model.start()` | PUT | `paint` | SYNC | SYNC | SYNC |

## `today-model.cjs`  (45 functions, 41 edges, 0 listener installations)

| line | call | class | sits in | paint | boot | listener |
|---|---|---|---|---|---|---|
| `:209` | `foodDays.rows()` | STORE | `storedFoodDays` | - | - | - |
| `:242` | `sleepNights.rows()` | STORE | `storedSleepNights` | - | - | - |
| `:395` | `readings.weighIn()` | PUT | `weighIn` | - | - | - |
| `:403` | `readings.restart()` | PUT | `reopen` | - | - | - |

## What a static call graph cannot see

| file | edge | kind | the line that proves it |
|---|---|---|---|
| `today-app.cjs` | `render` -> `<setup-app.mjs>.done` | foreign-callback | :2301 setup.open({ doc, phone, back, done }) - `done` at :2321 is invoked by setup-app.mjs, not here |
| `today-app.cjs` | `render` -> `<checkin-app.mjs>.back` | foreign-callback | :2351 checkin.open({ doc, phone, back: () => render(origin, true) }) |
| `today-app.cjs` | `render` -> `<gym-app.mjs>.back/checkIn` | foreign-callback | :2364-:2365 workout.open({ back, checkIn }) - checkIn sets checkinOrigin and renders |
| `today-app.cjs` | `measureDeps` -> `<measure-screen.mjs>.repaint/back` | foreign-callback | :640-:641 repaint and back inside the deps object handed to createMeasureScreen |
| `today-app.cjs` | `importDeps` -> `<import-screen.mjs>.repaint/back/onAdmitted` | foreign-callback | :696-:700 - onAdmitted: () => adoptAthleteState(), invoked by the import screen when a history is admitted |
| `today-app.cjs` | `renderMeasure` -> `<measure-screen.mjs>.paint` | foreign-module | :653 await measureScreen.paint(root, ...) - the foreign screen's own writers are invisible here |
| `today-app.cjs` | `renderImport` -> `<import-screen.mjs>.paint/reopen` | foreign-module | :718-:719 importScreen.reopen(); await importScreen.paint(root, ...) |
| `today-app.cjs` | `openFoodLane` -> `<food-host.mjs>` | dynamic-import | :599-:605 await import("./food-host.mjs") then createFoodHost(...); the lane's .save is that host's |
| `today-app.cjs` | `openSleepLane` -> `<sleep-host.mjs>` | dynamic-import | :516-:522 the same shape one seam on |
| `today-app.cjs` | `settleAdoption` -> `answered` | deferred | :788 chain.then(answered, answered) - it runs a turn later, outside any gesture |
| `gym-app.mjs` | `openSettingsLane` -> `<machine-settings-host.mjs>` | dynamic-import | :165-:166 await import("./machine-settings-host.mjs") then createMachineSettingsHost(...) |
| `*` | `<any released drawing region>` -> `on.<callback>` | AFTER THE CUT | E.6: a callback the sealed half hands the view is, to any static reader, just a function. No token scan and no parser can tell on.recordIntake() called from a click listener from the same call made at the top of a render function. This instrument cannot see it either, which is why the guard is a RUNTIME guard. |

