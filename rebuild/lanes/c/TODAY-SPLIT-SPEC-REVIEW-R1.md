# TODAY-SPLIT-SPEC v2 - INDEPENDENT REVIEW R1

Reviewer: cowork (Earned lane hand, independent spec reviewer), told to disagree. Author is not
reviewer; the author has finished and is gone. Spec under review: `rebuild/lanes/c/TODAY-SPLIT-SPEC.md`
at `9a3362b6bf240ac38d3f293d355c380cbfa6cf32` on `rebuild/c-today-split` (1339 lines). Counter-design
held against it: v1 at `14c87fa7` (983 lines). Two independent inputs also held: the blind map
`scratch/split/blind-map.md` and the look-versus-seal map `scratch/look-vs-seal/MAP.md`.

**Ref.** I read every source line at the chain tip `e0e2ac75` (`rebuild/t2-client-core`, farm-synced,
privacy proof PASS). `git diff c15a69c0 e0e2ac75 -- rebuild/m3/w7-preview/today/` is EMPTY, so the
spec's ref and mine agree byte for byte over every file it cites and every line number below is valid
at both. I ran no test suite, no build, no `b-package.cjs`, no gate. I opened no file on the owner's
data path, no `rebuild/conform/private`, no `src/history.js`, no `ledger/`, no soak.

## VERDICT: REJECT

Nine blocking findings. All nine are defects in the SPEC, not in the PM's ruling: see the direction
verdict at the end, where I find the reversal is RIGHT and should stand. The spec claims, in C.3, E.3
and B.5, that after the cut no released file decides whether a durable write happens and that every
crossing binding is disposed of by name. At the lines I read, neither is true yet. The seam work
(B.8) and the region reconciliation (B.2) are excellent and I verified them; the interface (B.3, B.4,
B.7) and the second extraction (B.9) are not yet buildable as written.

---

## WHAT I VERIFIED AND FOUND CORRECT

Stated first, because most of the spec holds and the build round should not lose it.

- **The three seams, line by line: correct.** Weigh-in `:1059-:1082`; `recordIntake` `:1278-:1319`;
  `recordSleep` `:1807-:1930`. Every sub-line cite in B.8 is right: `:1070` is the trim, `:1071-:1073`
  the try/catch with `Number(raw)`, `:1074` the re-enable, `:1075-:1078` the refusal paint, `:1080-:1081`
  close and render. `recordSleep` really does touch no DOM: its `map` parameter is never used in
  `:1807-:1930`. Its six token comparisons are exactly `:1852`, `:1872`, `:1880`, `:1886`, `:1896`,
  `:1928`, and B.6's eleven `say` sites are all at the lines given.
- **A.2's correction of the look map is right.** `:1076` is
  `error.textContent = plainOrDrop(result.copy || ..., "weigh-error")` and `:1077` is `input.focus()`.
  The look map's `3.3` `:1077` is wrong; v1's `:1076` stands.
- **The reconciliation of the three counts (B.2) is the best work in the document.** The look map's
  nine regions really do omit `readSleepCheckIn`, `reboundCheckIn`, the adoption gate and chain, the
  router's entry branches and the module-body writer statements. Its 455 is an undercount. The build
  round must plan against B.2, not against the map.
- **The four lane hosts: VERIFIED.** `food-host.mjs` (126), `reading-host.mjs` (48),
  `machine-settings-host.mjs` (113), `gym-host.mjs` (88) and also `sleep-host.mjs` (190) all return
  ZERO hits for `createElement|innerHTML|textContent|classList|querySelector|appendChild|document.`.
  B.9's recommendation to strike them from C-UI-5's and C-UI-7's MAY CHANGE lines should be taken.
- **`build.mjs` (B.10): correct.** `REQUIRED_INPUTS` is at `:98`; `assertImportRouteIsolation`'s
  `deepEqual(importers.map(...), [SOURCE_REL + "/today-app.cjs"])` is at `:391`. Re-pointing it at the
  sealed module keeps every tooth.
- **D.3's three named edits are real.** `food.test.mjs:1152-:1153` slices between `'function
  foodEntryFor'` and `'function openFoodLane'`; `problem.test.mjs:1100-:1102` slices
  `/^function sleepEntryFor[\s\S]*?^  \}/m` and `Function()`-evals it, so the two-space closing-brace
  constraint the spec names is exactly right; `package.test.cjs:104-:105` indexes
  `planted.inputs["rebuild/m3/w7-preview/today/today-app.cjs"].imports` by key and would throw.
- **`food.test.mjs:696-:698` really needs no edit.** `source.indexOf('if (next === "setup"')` lands on
  `:2288`, which carries `!firstRun()` inside the slice, so SEAM 5 rewriting the branch body below it
  does not disturb the assertion. The spec is right and the reviewer note it adds is the right note.
- **`module.exports` `:2600-:2625` is unchanged by the cut**, and `createTodayModel` occurs exactly
  twice in the file today (`:16` and `:2600`), so B.7's RE-EXPORT RULE has a true baseline.
- **H.5 item 1 is right and the PM was understated:** zero import paths change. I checked all nine
  cells that name either file.

---

## BLOCKING

### BLOCKING-1. The facade cannot be called `view`. B.3's own line does not run.

B.3 writes `const view = lanes.view;` at mount scope and B.7 says the released half's `model.` reads
are "every one rewritten from `model.` to `view.`". The identifier `view` is already taken, 76 times,
in the file that is being released:

| site | today | what B.7 makes of it |
|---|---|---|
| `today-app.cjs:840` | `const view = model.read();` (inside `renderToday`, then ~40 `view.` reads) | `const view = view.read();` - a TDZ `ReferenceError` at the first paint |
| `:1087` | `const view = model.read();` | the same |
| `:2098` | `const view = model.read();` | the same |
| `:1121` | `try { return model.read(); }` | fine, but inside a function that may also bind `view` |
| `:65`, `:71`, `:330` | `morningLine(view)`, `trendLine(view)`, `fitHeadline(view, root)` - three top-level functions whose parameter is named `view`, and all three are on `module.exports` | the parameter shadows the facade |
| `:2410` | `const view = doc.defaultView;` in `requestedScreen()`, released | shadows the facade |
| `gym-app.mjs:286`, `:321` | `recordSettings(map, view, ...)`, `renderActive(view)` - `view` is the LIFT VIEW | the same hazard in the second released file |

This is not cosmetic. D.1's wrapper says "Nothing else. Not identifier renaming", so the spec cannot
quietly rename `view` at `:840` inside a moved region; and `:840` is not in a moved region anyway, so
the rename lands in the drawing half where D.2's DOM snapshot is the only proof. The interface must
name the facade something that occurs nowhere in either released file today, and B.7's "the cost of
the facade, measured" must be re-measured against that name.

While re-measuring: B.7's "59 lines that name `model.`" is a raw `grep -c 'model\.'` over the whole
file. Of the 59, 16 are the strings `model.mjs` and `model.cjs` in comments and module specifiers
(`:16`, `:31`, `:34`, `:104`, `:152`, `:228`, `:271`, `:278`, `:546`, `:558`, `:883`, `:1369`,
`:1962`, `:2400`, `:2417`, `:2420`) and about a dozen more are prose. The real census of `model.` as
an object is about 30 code lines, of which about 15 stay released. The conclusion does not change;
the number in the spec is not a census and should not be quoted in the build round's plan.

### BLOCKING-2. E.6's gesture guard throws on the FIRST PAINT of Today.

E.6: "every writing entry in `on` is wrapped in `if (!gestureOpen) throw new Error(
"WRITER-OUTSIDE-GESTURE: " + name)`", `gestureOpen` true only "for the duration of the synchronous
part of a DOM event dispatch", and its red-first cell is "a view that calls `on.recordIntake()` from
its render path throws WRITER-OUTSIDE-GESTURE and records nothing".

Six released drawing sites call callbacks B.3 marks `writes? YES` from the RENDER path, not from a
gesture:

| released site | call | B.3's verdict |
|---|---|---|
| `today-app.cjs:2245` `nutritionState` | `openFoodLane()` | `on.openFoodLane()` - YES |
| `:1951` `sleepState` | `openSleepLane()` | `on.openSleepLane()` - YES |
| `:1180` `renderNutrition` | `openFoodLane()` | YES |
| `:1489` and `:1492` `renderSleep` | `readSleepCheckIn(date)`, `openSleepLane()` | `on.readSleepCheckIn` - "YES (opens a lane)" |
| `:1435` `renderSleepCheckIn` | `loadCheckInKit()`, `readSleepCheckIn(date, true)` | both YES |
| `gym-app.mjs:246`, `:251` `settingsPaint` | `openSettingsLane()`, `startSettingsRead(liftId)` | B.9 moves both |

`renderToday` reaches `nutritionState` and `sleepState` on every paint, so on a device with a store
and no lane open yet, the FIRST paint of Today throws twice. The spec's own H.1 risk 3 depends on
those exact calls staying at the exact statement they are at today, and correctly calls that the
strongest thing the reversal buys. It cannot buy that and fence the same calls.

The fix is not hard but it is a design decision the spec must take and does not: the guard's subject
must be the DURABLE WRITE callbacks (`submitWeighIn`, `recordIntake`, `retryFoodRead`, `recordSleep`,
`retrySleepRead`, `recordSettings`, `openSetup`, `openCheckIn`, `openWorkout`, `recoverWorkout`) and
NOT the lane openers and reads, which are paint-driven by construction. Say which, say why an opener
outside a gesture is safe (it is: it opens a store and stores nothing), and re-write E.6's red-first
cell so it plants `on.recordIntake` and not an opener.

### BLOCKING-3. B.7's `return Object.freeze({ ...viewApi, ...lanes.api() })` breaks `api.ready`, changes the key order, and drops a key.

`today-app.cjs:2576` is `get ready() { return ready; }` and the comment directly above it, `:2570-:2575`,
states the requirement in the file's own words: "P0-C item (a) - a GETTER, not a snapshot: the 'done'
callback above reassigns `ready` on the in-page transition off 'Start using Earned', and a caller
reading this property after that point must see that later settle, not the already-resolved promise
this function returned at boot."

A spread INVOKES an accessor once and copies its VALUE. `{ ...lanes.api() }` therefore turns `ready`
back into the snapshot P0-C was written to remove, and B.7's sentence "`api.ready` is served by the
sealed half; the setup `done` callback reassigns it inside the seal" is exactly the case that breaks:
the reassignment happens inside the seal and no spread copy ever sees it. Whatever the interface is,
the released half must re-declare `ready` as a live accessor over the sealed getter, and the spec
must say so because a straightforward reading of B.7's one line produces the bug.

Two more in the same line:

- **`Object.freeze` is a behaviour change the spec claims it is not making.** `:2552` returns a plain
  extensible object today. B.7 says "the api's shape, its key order and its behaviour are unchanged".
  Freezing is a change to behaviour; if it is wanted, it is a separate decision with its own cell.
- **Key order changes, and one key is dropped.** The api has 20 keys in this order: `render`, `read`,
  `openWeighIn`, `screen`, `importScreen`, `importAdmitted`, `foodPending`, `foodReady`,
  `sleepPending`, `sleepReady`, `sleepCheckInReady`, `checkInKitReady`, `sleepLane`, `sleepAck`,
  `sleepMount`, `workoutEntry`, `workoutRebound`, `ready`, `dispose`, `disposed`. B.7's `viewApi`
  names eight and its `lanes.api()` names eleven: **`importAdmitted` (`:2556`) is in neither list**,
  although B.5 puts `importAdmitted` on the sealed side. The spread also puts all eight view keys
  first, so the order is not preserved. H.2 stop 7 guards `module.exports`, not this surface, so
  nothing in the spec would catch either.

One more shape problem in `lanes.api()`: `:2561`
`sleepCheckInReady: () => screen === "sleep-checkin" ? sleepCheckInViewPending : sleepCheckInPending`
reads `screen`, which B.5 keeps RELEASED. A sealed api getter reading a released binding needs the
paint handle, which B.4 does not list for this use.

### BLOCKING-4. Releasing the ROUTER hands lane C two data decisions, and B.2 row 29's range is wrong.

B.2 row 29 gives "the router's setup branch body" as `:2295-:2336`. The setup branch begins at
`:2300`. `:2295-:2298` is the mount-invalidation block that precedes `screen = next` at `:2299`:

```
2295:    if (next !== screen) {
2296:      mountToken += 1;
2297:      if (next === "sleep") { sleepCheckInDay = null; sleepCheckInPending = null; }
2298:    }
```

As written, row 29 moves `mountToken += 1` into the seal, which contradicts B.5 ("`mountToken`,
`disposed` `:445`, `:453` RELEASED") and B.4's whole argument. That is a range error, and it is the
smaller half of the finding.

The larger half: `:2297` is a RELEASED router line that assigns two bindings B.5 declares SEALED, and
it is a data decision, not a paint. `readSleepCheckIn:1413` is
`if (sleepCheckInDay === day && !force) return sleepCheckInPending;` - so nulling the cache at `:2297`
is what makes navigating to the sleep screen start a FRESH durable read of the check-in store. After
the cut that line sits in a file C-UI-7 may edit, and the callback table has no entry for it. This is
the PM's own attack question ("a retry that decides whether a write happens") answered in the
affirmative, and the spec's SEAM 5 does not reach it: SEAM 5 disposes of `firstRun()` and the `done`
chain and says "Nothing else in `render` `:2272-:2380` touches a store". `:2297` does.

### BLOCKING-5. B.5's crossing-binding census misses every released-to-sealed WRITE on the sleep screen. Two of them are data decisions.

B.5 is the spec's headline acceptance test ("every crossing binding of A.3, disposed of by name").
Released drawing code assigns SEVEN bindings B.5 puts on the sealed side, and B.5 names one of them:

| released site | what it assigns | B.5's side | disposed of? |
|---|---|---|---|
| `:1540` (the sleep-date `change` handler, inside `renderSleep`) | `sleepRollover = null` | SEALED | NO |
| `:1541` | `sleepOpenedDay = sleepToday(); sleepOpenedNight = sleepNightDate();` | SEALED | NO |
| `:1542` | `sleepAck = null; sleepReadBack = null; sleepCorrecting = false; sleepErrorText = "";` | all SEALED | only `sleepCorrecting`, via `on.sleepCorrect` |
| `:1561` (the keep-night handler) | `sleepRollover = null` | SEALED | NO |
| `:1562` | `sleepOpenedDay = ...; sleepOpenedNight = ...` | SEALED | NO |
| `:1703` | `sleepCorrecting = true` | SEALED | yes |
| `:1710` | `sleepCorrecting = false; clearSleepDraft();` | SEALED / released | yes |

Two of these are not bookkeeping:

1. **`sleepRollover = null` at `:1540` and `:1561` clears the guard the write refuses on.**
   `recordSleep:1818` is `if (sleepRollover) { say(SLEEP_ROLLOVER + ...); return; }`, and the comment
   at `:1816-:1817` says why: "a rollover that has not been answered blocks the write. The athlete
   confirms which night this is for; the page never decides for him." After the cut, two lines in a
   file C-UI-7 may edit can clear that guard, and neither is a fenced word.
2. **`sleepAck = null; sleepReadBack = null` at `:1542` drops the acknowledgment of a durable write.**
   `:437-:441` records why it is kept: "A save that the client acknowledged is durable whatever the
   read-back afterwards does, so the figure it carries stays on the screen instead of vanishing with
   the draft". Clearing it from the released half is a claim about the record made by the view.

Also unnamed: `:1549` `const rolled = sleepClockCheck();` - a released PAINT calls a function B.2 row
21 moves sealed and which WRITES `sleepRollover`, `sleepOpenedDay` and `sleepOpenedNight`
(`:1387`, `:1389`, `:1391`). B.3's `on.sleepClock(typed, nightChoice)` is marked `writes? no`; it
mutates the guard state. That is fine if the spec says so, and it does not.

### BLOCKING-6. `sleepNightChoice` IS read by the durable write path. B.5's claim about it is false, and it is the date a night is stored against.

B.5: "`sleepNightChoice` `:459` RELEASED. it is what the athlete CHOSE in a control; it is passed raw
into `on.recordSleep` and into `on.sleepClock`. **Nothing durable reads it except through those two.**"

`:1375-:1376` is `const sleepNightDate = () => sleepNightChoice || sleepRollover ||
SleepModel.nightDateFor(sleepToday());`, and B.2 row 20 moves `sleepNightDate` to the SEALED side.
Three sealed callers read it through that function:

- `recordSleep:1814` `const date = sleepNightDate();` - **the date the night is stored against**
  (`:1822` `const entry = { ...sleepDraft, date };`).
- `retrySleepRead:1728` `if (sleepCheckInFailed) await readSleepCheckIn(sleepNightDate(), true);` -
  which night is re-read. B.3 gives `on.retrySleepRead()` NO arguments.
- `readSleepCheckIn:1423` `if (token === mountToken && screen === "sleep" && sleepNightDate() === date)
  render("sleep", false);` - whether a late read repaints.

So a released `let` is read by the write path and by two sealed reads, and only one of the three
paths is covered by "passed raw into the callback". Either `sleepNightChoice` moves sealed (and the
released date control drives it through a callback, which is the honest shape), or every sealed
caller of `sleepNightDate()` takes the choice as an argument and the spec lists them. The spec does
neither, and it asserts the opposite.

### BLOCKING-7. The READ-ONLY facade and the callback table leak a lane.

B.3: "No entry takes or returns a DOM node, a lane, a host or a promise minted anywhere but here."

`openSleepLane` returns `sleepOpening`, and `sleepOpening`'s success arm at `:519-:533` ends
`return lane;`. So `on.openSleepLane()` returns a promise that RESOLVES TO THE LANE, and the lane is
`sleepEntryFor`'s object: `{ host, rows, refresh, save, close }` (the food twin is `:571-:590`). The
released view already keeps that return value: `:1492` `const opening = sleepLane ? null :
openSleepLane();` and `:1180` `const opening = openFoodLane();`. A released file holding a promise
for `{ save, refresh, host }` is precisely "an object that carries a writer method crossing by
reference", and E.3's token scan cannot see it: `.save` is never written in the released file, it is
one `await` away.

The same object crosses a second way. `:2562` is `sleepLane: () => sleepLane`, and B.7 keeps
`sleepLane` in `lanes.api()`, which the RELEASED file then spreads into its own return value. The
released half therefore hands its caller a function that returns the lane.

Neither is necessarily fatal - the openers can return a boolean or a sanitised `{ opened, failure }`,
and `api.sleepLane` is there for the cells - but B.3 asserts the leak does not exist, and the two
call sites above show the view consuming it today. The spec must either sanitise the opener's return
(and re-state `:1181-:1183` and `:1496-:1498`, which paint `FOOD_OPENING` off the truthiness of that
promise) or withdraw the sentence and fence the two names by hand.

While here: `sleepCheckInFor:1402-:1409` stays released (it is in no B.2 row) and at `:1406-:1407`
needs `const active = checkInLive || (checkin && checkin.checkin); ... active.recorded()`. `checkin`
is the injected ENTRY, which B.5 says "never crosses", and B.3's facade has `checkInLive()` but no
way to reach `active.recorded()`. The facade table is not complete; that is one measured example and
the build round will find more, so the manifest of B.2 must be walked against the facade before the
round starts, not during it.

### BLOCKING-8. B.9 (the gym extraction) is self-contradictory and is not a pure move.

I re-measured the four regions at the tip. The spec is RIGHT against the look map and against the
ticket: `:123-:140` (18), `startSettingsRead` `:142-:156` (15), `openSettingsLane` `:158-:170` (13,
not `:158-:171`), `recordSettings` `:286-:318` (33). The total is 79, not 80, and the look map's 65
is an undercount. Good work. The problem is what B.9 leaves behind.

`settingsPaint` `:242-:282` is RELEASED by B.9 and C.2 (it is the ticket C-UI-5 edits). It reads or
assigns SIX of the nine bindings B.9 moves:

| line | what settingsPaint does | binding | B.9 |
|---|---|---|---|
| `:246` | `openSettingsLane()` from the paint path | - | moved |
| `:251` | `startSettingsRead(liftId)` from the paint path | - | moved |
| `:252` | `settingsRead.get(liftId)` | `settingsRead` `:138` | moved |
| `:262-:263` | `settingsDraft = MachineSettingsView.draftFrom(latest); settingsDraftLift = liftId;` | `:126-:127` | moved |
| `:266`, `:268`, `:275`, `:276` | reads and nulls `settingsDraft`/`settingsDraftLift` | `:126-:127` | moved |
| `:271` | `settingsErrors.get(paintedDraft)` | `settingsErrors` `:130` | moved, and ALSO claimed kept |
| `:279` | `settingsSaving = recordSettings(map, view, paintedDraft);` | `settingsSaving` `:125` | moved |

The `settingsErrors` row is a flat contradiction inside B.9: the WeakMap is declared at `:130`, inside
the `:123-:140` block B.9 moves whole, and the same paragraph says "the released view keeps `refuse()`
and the `WeakMap` that carries its message across a repaint."

And the guard B.9 cannot reproduce: `recordSettings`'s stale-editor fence is an OBJECT IDENTITY test
over the draft, three times - `:287` `settingsDraft !== submittedDraft`, `:291` the same inside
`refuse`, `:311` the same before clearing. `on.recordSettings(rawDraft, liftId)` hands the seal raw
values, so the sealed half cannot compare the object the view is painting from. That fence is what
stops an editor the athlete has navigated away from writing a machine capture for a lift he has moved
past; `:284-:285`'s own comment calls the two decisions "decided BEFORE anything is written".

Finally B.9 never mentions that gym needs its own PAINT HANDLE: `startSettingsRead:154`
(`.then(() => { settingsInFlight.delete(liftId); return paint(); })`) and `openSettingsLane:167`
(`.then(async (host) => { settingsLane = host; await paint(); return host; })`) both call the released
`paint()`. B.4 builds a paint handle for Today and nothing for gym.

B.9 needs the same treatment B.3 to B.8 give Today: a facade, a callback table, a paint handle, a
named disposal of `settingsDraft`'s identity, and the seam table `recordSettings` deserves
(`refuse()` at `:289-:295` does `phone.querySelector` and `textContent` and is called at `:297`,
`:299` and, after the await, `:308`).

### BLOCKING-9. A FOURTH required test edit, which is the spec's own STOP condition H.2.5.

`problem.test.mjs:2003-:2008` reads the DIRECTORY LISTING of `rebuild/m3/w7-preview/today`, filters
to `.cjs`/`.mjs`, collects every file whose `codeOf(...)` matches `/sleepSpanH\(/`, and asserts
`deepEqual(callers.sort(), ['sleep-model.cjs', 'today-app.cjs'])`. D.3's row for it says "**NONE**.
v1 needed this edit."

B.3's facade table says: "the engine, by named function only | `sleepSpanH(bed, wake, awakeMin)` - the
one engine call a drawing region makes (`:1772`). The engine OBJECT does not cross". Written that
way, `today-lanes.cjs` contains `sleepSpanH(` and the cell reds with a third caller. The escape is to
put the engine method on the facade by reference with no call syntax, which the spec does not say and
which is a different decision (a bound engine method crossing to the view). Either way D.3 is four
edits, and H.2.5 makes a fourth edit a STOP.

Two smaller ones in the same area, both fixable:

- **The one-handoff rule is already broken at `:392`.** B.3 and E.3 promise the fence will print
  `options` 2 in `today-app.cjs`. `:392` is `const setupFirst = options.setupFirst === true;`, and it
  must stay released because `:2451` `render(requestedScreen() || (setupFirst && firstRun() ?
  "setup" : "today"))` is the landing-screen decision the released router owns. `setupFirst` is in
  neither B.5's table nor B.3's facade. E.5's new red row 8 (`FENCE-MODEL-HELD`) would go red on the
  real tree.
- **No sealed in-flight guard for the weigh-in or the food write.** `recordSleep` carries its own,
  inside the seal: `sleepBusy` (`:454`, checked at `:1808`), and `:465-:468` says "the save is fenced
  so a second press cannot duplicate a write that may have landed". The weigh-in's and the food
  entry's ONLY duplicate-write guard is a DOM `disabled` flag - `:1068-:1069` and `:1287` - and SEAM 1
  and SEAM 2 both mark them PAINT and leave them in the released file. Today `:1287` is INSIDE
  `recordIntake`. After the cut, the only thing between two gestures and two durable writes is
  released code six tickets will edit, and E.6's guard does not help: two gestures both have
  `gestureOpen` true. SEAM 2 adds defence in depth for the refusal check and says nothing about this.
  The reviewer question "can a double submit now write twice" is not answered. It should be, with a
  sealed in-flight flag per writer and an `{ kind: "in-flight" }` outcome, which is about six lines
  and fits B.6's table.

---

## NOTES (not blocking)

**N1. Cite errors, all small, none changing a conclusion.**

| spec | says | is |
|---|---|---|
| B.10 | `REQUIRED_INPUTS` "51 becomes 53" | 48 entries at `build.mjs:98`, so 48 becomes 50. The "26 `today/**` entries" is right |
| B.9 | `openSettingsLane` `:158-:171`, 14 lines; total 80 | `:158-:170`, 13 lines; total 79 |
| D.3 | `problem.test.mjs:1100-:1101` | the regex is on `:1102`; the slice is `:1100-:1102` |
| D.3 | `adapter.test.mjs:24`, `machine-settings-ui.test.mjs:35`, `ntc-h6-delta.test.mjs:64` | `:21`, `:31`, `:61`, and all three import `today-model.cjs` only, not `today-app.cjs` |
| D.3, H.5 item 1 | "eleven sealed cells import the same surface" | nine cells name either file: seven import `today-app.cjs` (`checkin`, `copy`, `food`, `gym`, `problem`, `setup`, `view`), `design.test.cjs:80` and `package.test.cjs:104` name it as a literal. The conclusion (zero import paths change) is unaffected and correct |

**N2. B.6 row 10 drops `.filter(Boolean)` and would change a sentence.** `:1903` is
`[SLEEP_NOT_SAVED, reasonOf(result)].filter(Boolean).join(" ")`. B.6's table writes it without the
filter. With `reasonOf` returning `""` - which `:1339-:1344` does whenever the refusal carries neither
copy nor code - the filtered form yields `SLEEP_NOT_SAVED` and the unfiltered form yields
`SLEEP_NOT_SAVED + " "`, then `:1904` appends `" " + SLEEP_NOTHING_RECORDED` for a double space.
D.4's copy census is a multiset of LITERALS and would not catch a concatenation change; the mapper
must be specified against the source line, character for character, and its cell must drive the
empty-reason case.

**N3. SEAM 2's trace cell contradicts SEAM 2's defence in depth.** The paragraph requires
`on.recordIntake` to re-run `FoodModel.refusalFor` on the raw values; the trace the cell asserts is
`[check, disable, save, enable, repaint]`, with one check. One of the two has to move.

**N4. G.4 rests on an S9 spec that has since been rejected.** The spec's own appendix item 4 flags
this, and it has now happened: `DECISIONS:546` (2026-09-19, PM4) records S9 spec v3 judged **R3
REJECT** with round 4 dispatched, PM-R6 of `:542` revised, COPY-BIND withdrawn, the whole 2026-09-18
pack pinned at the S9 head, and the copy lock made a PRECONDITION OF S10. R3 did uphold the
`released` role, the RELEASE-FROM-SEAL token line and the chain-derived fence, so G.4's mechanism is
not gone - but G.4, its `sourceBase` argument and the paths table must be re-read against S9 round 4
before S10 declares anything, and the copy-lock precondition is a new dependency for the split that
the spec's G does not carry.

**N5. Estimate.** H.4's honesty is the right instinct and I agree the round is bigger than v1's, but
35 to 48 is low for the spec as written. The nine blocking items above are not code the spec forgot
to write; they are interface it has not yet designed: the six sleep crossings, the gym facade and
paint handle, the draft-identity fence, the live `ready` accessor, the guard's subject list and the
opener return shape. My own band for the build round is **42 to 58 hours**, review **12 to 16**. The
per-ticket-freed comparison H.4 makes still favours this direction: 8 freed at 42 to 58 is 6.3 hours
a ticket against v1's 8.6.

**N6. Things the spec asks the PM that I would answer the same way.** Q1 the sealed sibling, not
pinned-unchanged (its argument (b) is exactly right: sealing `read()` re-creates the frozen-view-model
problem one file over). Q2 yes. Q4 the fence's zero-copy assertion over the two sealed modules, and
it is strictly stronger than the nine widenings. Q5 yes, and it MUST be in the S10 brief in one
sentence. On Q3 I disagree with the framing, not the answer: the guard is in scope, but see
BLOCKING-2 - its subject list is the whole question and the spec has not written it.

**N7. E.4's re-decision of v1's Q7 is right and I would not disturb it.** `put` was never the
chokepoint; `transaction`, `objectStore`, `IDBObjectStore` and `IDBTransaction` are, and 90 lines of
gratuitous rename in the file whose whole value is that it barely changes would make D.1 and D.2
noisier for nothing. Naming `problemControl:2213-:2237`'s `navigator.clipboard.writeText` as a
deliberate PASS before someone adds `.write` to the list is exactly the right kind of pre-emption.

---

## DIRECTION VERDICT: extracting the WRITERS is BETTER than extracting the view. The PM's ruling should stand.

Criterion by criterion, on the evidence, with v1 held as the counter-design it is.

| criterion | winner | why |
|---|---|---|
| **data safety** | **v1**, and it is not close | Under v1 the whole handler layer stays sealed. Under v2, seven decisions that govern whether or what gets written end up in files six look tickets edit: the rollover guard cleared at `:1540` and `:1561`; the acknowledgment dropped at `:1542`; the two in-flight `disabled` guards at `:1069` and `:1287`; the check-in cache invalidation at `:2297`; the mount invalidation at `:2296`; the landing decision at `:2451`. v2's answer is a word list plus a gesture guard, and not one of those seven lines names a fenced word. This is real and the PM should weigh it |
| **regression risk of the refactor** | **v1** | v1 moved no writer: its D.1 was a proof that nothing happened. v2 moves every writer, plus seven seams, plus a retyping of eleven sentences into outcomes. The spec says this itself and does not hide it (D.1's closing paragraph, H.4) |
| **size of the move** | **v2** | 663 plus 79 against about 1700. I did not re-derive all 120 regions, but I checked eighteen boundaries by hand and every one agreed |
| **test churn** | **v2, clearly** | Zero import paths change (verified across nine cells); `VIEW_SOURCES` unchanged; the planted-dash cell unchanged; `setup.test.mjs:1035` and `problem.test.mjs:1419` unchanged. It is FOUR required edits, not three (BLOCKING-9), against v1's nine. This is the PM's reason (c) and H.5 item 1 is right that it is stronger than the PM put it |
| **residue for the look tickets** | **v2, decisively** | Eight of eight freed against v1's four freed and two half-freed. I looked for a look-ticket citation that lands in a sealed file after v2's cut and did not find one. C.3's honest counter-statement - a ticket needing a NEW model field still rides a child unless F.1's sibling is taken - is correctly stated and is the reason F.1's recommendation matters |
| **future reseal cost** | **v2** | The sealed surface ends at about 740 lines in three small modules with a named interface, against v1's roughly 900-line sealed `today-app.cjs` that still holds the router, the boot and the adoption chain. That is what `:536` meant by "a file that both renders and writes stays SEALED until it is split" |
| **contention in one file** | **v1** | Six tickets editing one 2000-line file. G.3 concedes it and S-R1 (g)'s answer - modularise later as lane C work - is the right answer and costs a ticket, not a child |

**Net.** Four to three on the count, but the count is not how to read it. The two v1 wins are both
about the transition, and both are bounded by proofs this spec already specifies well (D.1's byte
proof, D.2b's listener census, B.8's trace cells). The four v2 wins are permanent properties of the
result. Freeing C-UI-4 and C-UI-5 - which v1 could not free at all - and removing every copy
constraint from C-UI-3 and C-UI-7 is worth a harder single round.

But the data-safety column is not a rounding error, and it is the one thing the spec does not
currently carry out. Its own claim (C.3: "There is none"; E.3: no released file reaches a writer) is
false at the seven lines above. **The direction is right; v2 does not yet execute it.** Round 3
should keep A, B.2, B.6, B.8, D, E and F almost untouched, and re-do the interface (B.3, B.4, B.5,
B.7) and the second extraction (B.9) against the crossing writes, the opener returns and the guard
subject list named here. If PM4 wants one sentence for the S10 brief: after the split, the released
half still holds the rollover guard, the acknowledgment, the two in-flight flags and the check-in
cache, and each of those must move or be fenced by name before the claim "no released file decides
whether a write happens" can be made.

---

## WHAT I DID NOT VERIFY

1. I ran nothing: no suite, no build, no `b-package.cjs`, no gate, no browser check. Every finding is
   read, not executed.
2. I did not re-derive B.2's 120 regions. I checked eighteen boundaries and the seven seams by hand
   and found two range errors (B.2 row 29, B.9's `openSettingsLane`). The spec's own appendix item 2
   already warns the build round to re-derive the manifest; that warning is correct and should be
   obeyed.
3. I did not re-read `S9-RELEASE-SPEC.md` at any ref. N4 rests on `DECISIONS:546` alone.
4. I did not open `import/`, `measure/`, `today-entry.mjs` or any host beyond the DOM census counts
   reported above.
5. I did not verify the design-of-record citation lists behind C.2; I re-used the spec's, as it
   re-used v1's.
6. I read no file on the owner's data path, no `rebuild/conform/private`, no `src/history.js`, no
   `ledger/`, no soak. The owner's real measurements are not in this session.
7. This review is itself a hypothesis. Where the author would disagree, the lines are cited so the
   PM can read them directly.
