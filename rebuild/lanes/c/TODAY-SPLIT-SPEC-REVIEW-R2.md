# TODAY-SPLIT-SPEC v2 - INDEPENDENT REVIEW R2

Reviewer: cowork (Earned lane hand, independent spec reviewer), told to disagree. Author is not
reviewer; the author has finished and is gone. Under review: `rebuild/lanes/c/TODAY-SPLIT-SPEC.md`
at `906cb056` on `rebuild/c-today-split` (1962 lines), the FIX ROUND after review R1. Held against
it: v1 at `14c87fa7` (983 lines) as the counter-design, review R1 at `af53fd17` (452 lines), the
blind map `scratch/split/blind-map.md` and the look-versus-seal map `scratch/look-vs-seal/MAP.md`.

**Ref.** Source read at the chain tip `e0e2ac75` (`rebuild/t2-client-core`, farm-synced, privacy
proof PASS). I re-ran the reviewer's own check: `git diff c15a69c0 e0e2ac75 --
rebuild/m3/w7-preview/today/` is EMPTY, so every line number below is valid at the spec's ref and at
mine. `rebuild/b-s9-ui-pins` re-synced for this round: head `da9f8683`, S9-RELEASE-SPEC.md now at
**v4** (PM-R6'(ii)), 1951 lines. I ran no test suite, no build, no `b-package.cjs`, no gate, no
browser check. I opened no file on the owner's data path, no `rebuild/conform/private`, no
`src/history.js`, no `ledger/`, no soak. Only this review file is committed.

## VERDICT: REJECT

Eight blocking findings. The fix round did real work: seven of R1's nine blocking findings are
genuinely fixed at the lines they cite, and I verified each one against the source rather than
against the spec's own account of it. But three of the fixes are incomplete in the same class of
defect they were meant to close, two introduce code that would not run, one dispute against R1 is
refuted by measurement, and one whole-move region the spec has carried unexamined since v2 cannot
move at all as written.

**The direction is still right.** My direction verdict at the end agrees with R1's and with the
PM's ruling. Nothing below is a STOP under S-R8: every one is an interface not yet designed, not a
writer that cannot leave its closure.

---

## PART 1 - R1's findings, one by one

Verdict, then the evidence I checked myself.

| R1 finding | R2 verdict |
|---|---|
| BLOCKING-1 the facade cannot be called `view` | **FIXED**, with one false line in the new census (NOTE-1) |
| BLOCKING-2 the gesture guard throws on the first paint | **STILL OPEN** - fixed for `today-app.cjs`, reproduced in `gym-app.mjs`, and the cell that keeps the two classes honest contradicts itself (BLOCKING-2, BLOCKING-3) |
| BLOCKING-3 the spread breaks `api.ready`, the order and a key | **FIXED**, and a NEW break introduced in the replacement literal (BLOCKING-4) |
| BLOCKING-4 the router's range, and `:2297` | **FIXED at row 29; STILL OPEN at rows 30 and 31** (BLOCKING-5) |
| BLOCKING-5 released-to-sealed writes on the sleep screen | **STILL OPEN** - seven disposed of, an eighth uncensused (BLOCKING-1) |
| BLOCKING-6 `sleepNightChoice` is read by the write path | **FIXED** |
| BLOCKING-7 the openers leak a lane | **FIXED for the openers**; the pass-through class is disposed of for `sleepLane` and not for `workoutEntry` (BLOCKING-4) |
| BLOCKING-8 the gym extraction is self-contradictory | **FIXED in the main**, with three residues (BLOCKING-3, BLOCKING-6, NOTE-7) |
| BLOCKING-9 a fourth test edit | **FIXED** |
| N1 row 1 (`REQUIRED_INPUTS` 48, not 51) | **DISPUTE NOT UPHELD. R1 was right: 48.** (BLOCKING-7) |
| N1 rows 2-5 | **FIXED** |
| N2 `.filter(Boolean)` | **FIXED** |
| N3 SEAM 2's trace | **FIXED in the trace, broken against the placement** (NOTE-3) |
| N4 the S9 reject and the copy lock | **FIXED, and I re-verified it against S9 v4** |
| N5 the estimate | **ACCEPTED and raised; still low** (NOTE-9) |
| N6, N7 | **agreed, undisturbed** |

### What I verified and found CORRECT

Said first, because most of the fix round holds and round 3 must not lose it.

- **BLOCKING-1's substance.** `const view = doc.defaultView` is at `:512`, `:595` and `:2410`;
  `const view = model.read()` at `:840`, `:1087`, `:2098`; `view` is the LIFT VIEW at
  `gym-app.mjs:286` and `:321`. Renaming the facade was necessary and `facade`, `on` and `painter`
  are all genuinely 0 in code position in both files.
- **BLOCKING-3's substance, completely.** `:2552-:2595` carries exactly twenty keys in exactly
  B.7's order; `importAdmitted` is at `:2556`; `get ready() { return ready; }` is at `:2576` under
  the `:2570-:2575` comment the spec quotes word for word; `:2552` returns a plain extensible
  object. Writing the literal out is the right fix and STOP 7b is the right teeth.
- **BLOCKING-4's row-29 half.** `:2295 if (next !== screen) {`, `:2296 mountToken += 1;`,
  `:2297 if (next === "sleep") { sleepCheckInDay = null; sleepCheckInPending = null; }`,
  `:2298 }`, `:2299 screen = next;`, `:2300 if (next === "setup") {`. SEAM 10 is right line for
  line, and `readSleepCheckIn:1413` is the reason it is a data decision.
- **BLOCKING-6, completely.** `sleepNightChoice` is declared at `:459`, read at `:1375`, and
  assigned at exactly two sites, `:1539` and `:1560`, both released handlers. The three sealed
  readers through `sleepNightDate()` are `recordSleep:1814`, `retrySleepRead:1728` and
  `readSleepCheckIn:1423`. Moving the binding sealed is a pure move and makes
  `sleepNightDate()` argument-free again, exactly as B.3 says.
- **BLOCKING-7's opener half.** `opening` occurs in code at exactly `:1180` and `:1492` and is
  consumed for truthiness only, at `:1181` and `:1498`. The boolean return is a correct and
  behaviour-preserving shape.
- **BLOCKING-9, completely.** `problem.test.mjs:2003-:2008` reads the directory listing, filters
  `/\.(cjs|mjs)$/`, collects files whose `codeOf(...)` matches `/sleepSpanH\(/` and asserts
  `['sleep-model.cjs', 'today-app.cjs']`. `const { sleepSpanH } = model.engine;` and a shorthand
  `sleepSpanH,` match nothing; `facade.sleepSpanH(` at `:1772` keeps `today-app.cjs` on the list.
  The fix is sound and E.5 row 12 is the right fence for it. `setupFirst` is at `:392` and its move
  does restore `options` to 2.
- **SEAM 1, line for line.** `:1068-:1069` the disabled pair, `:1070` the trim, `:1071-:1073` the
  try/catch with `Number(raw)`, `:1074` the re-enable, `:1075-:1078` the refusal paint with
  `"weigh-error"`, `:1080-:1081` close and render. Order before and after is identical.
- **SEAM 9, line for line.** `:1539-:1542`'s eight assignments and `:1560-:1562`'s four are exactly
  as tabled, `:1543` and `:1563` are the repaints, and `recordSleep:1818`'s refusal on
  `sleepRollover` under the `:1816-:1817` comment is the reason they matter.
- **N2, character for character.** `:1903` is
  `[SLEEP_NOT_SAVED, reasonOf(result)].filter(Boolean).join(" ")` and `:1904` appends
  `" " + SLEEP_NOTHING_RECORDED`. The correction and the double-space cell are right.
- **B.9's re-measurement of the gym regions.** `:123-:140` (18), `startSettingsRead` `:142-:156`
  (15), `openSettingsLane` `:158-:170` (13), `recordSettings` `:286-:318` (33), total 79. Correct.
  `settingsErrors` is at `:130` inside the moved block and the WeakMap really is keyed by the
  draft the view mints at `:262`; leaving the draft family released is the right call, and
  `:262-:263` is inside the `openControl` CLICK handler, so `on.settingsEditOpened` is not
  paint-driven and the `editSeq` scheme is sound against all four identity tests
  (`:287`, `:291`, `:311`, and the released cancel at `:275`). `owns` at `:287`/`:291` is correctly
  spotted as a second painter entry.
- **The five gym model call sites.** `:419 model.logSet`, `:444 model.finish`, `:498 model.forget`,
  `:505 model.undo`, `:546 model.start`. Five, not the look map's four. The spec is right.
- **N4, re-verified against S9 v4 at `da9f8683`.** The `released` role stands; walk 1 re-asserts a
  declared path in Git at `sourceBase` (`S9-RELEASE-SPEC.md:456` and `:608`, `held()` `:1829` -
  so the split's `:1829-:1833` is a cite into the RUNNER the S9 spec quotes and it resolves);
  H4 is at `:574` and H7 at `:577` with the placement corrected to `:1952`; the copy lock is a
  named precondition of S10 at `:1130` and `:1830-:1836`; and the four `pinned-unchanged`
  declarations including `gym-model.mjs` (`:343`) and `checkin-app.mjs` (`:345`) are kept, which is
  the one thing B.9 needs from PM-R3.
- **And the ticket's own attack on the `released` role is ANSWERED, in S9's favour.** The ticket
  asks whether `released` can really carry a file eleven sealed cells import and that is a child
  argv dependency. S9 v4 `:160-:161` measured it: `packages/S8.json` declares 25 children with 68
  distinct argv targets and **every one of the 68 is a test cell**, so `today-app.cjs` is NOT a
  child argv target, and B.6's rule "a released path must not be a child argv target" (`:612`,
  cell item 8 at `:635`) does not reach a module the cells merely IMPORT. G.4's claim is right.
  It should cite that measurement rather than leave a reviewer to find it (NOTE-8).

---

## PART 2 - BLOCKING

### BLOCKING-1. B.5's "complete census" still misses a released-to-sealed WRITE, and it is a whole promise.

B.5 says: "The complete census of released-to-sealed WRITES in `today-app.cjs` at `e0e2ac75`, each
with its disposal", and C.3 and E.3 now rest the headline claim on it. I ran the census myself,
binding by binding, over every name B.5 puts SEALED. Twelve of the thirteen rows are right. The
one that is missing is:

```
1435:    sleepCheckInViewPending = Promise.all([loadCheckInKit(), readSleepCheckIn(date, true)]).then(() => {
```

`sleepCheckInViewPending` is declared at `:474`, inside B.2 row 36's `:471-:474` block, which the
spec moves SEALED. `:1435` is inside `renderSleepCheckIn` `:1428-:1446`, which is in NO B.2 row,
which C.2 hands to **C-UI-7** as released drawing, and which is therefore a file six tickets edit
assigning a sealed binding. That is E.3's new NO-CROSSING-ASSIGNMENT rule and **E.5 red row 13
would go RED on the real tree**, naming this binding and this line - the exact outcome R1 found in
v2 at `sleepRollover`.

It is not a bookkeeping line either, and it cannot be fixed by moving the binding back:

- **B.7's own api literal already requires the seal to own it.** `sleepCheckInReady` is written
  `screen === "sleep-checkin" ? lanes.api.sleepCheckInViewPending() : lanes.api.sleepCheckInPending()`.
  If the binding stays released, that line is wrong; if it goes sealed, `:1435` assigns it from a
  released file.
- **The value is minted by drawing code.** `:1435` composes two ENTRY callbacks into a promise whose
  `.then` body (`:1436-:1443`) is pure paint: `token !== mountToken`, `screen !== "sleep-checkin"`,
  `sleepCheckInFor(date)`, `checkInKit.recordedLines(row)`, `doc.createElement`, `textContent`,
  `body.append`. The paint must stay released; the handle must be sealed. That is a SEAM, and it is
  a TWELFTH one, which is **H.2 STOP 1** by the spec's own rule.
- `:1445` `return sleepCheckInViewPending;` is `renderSleepCheckIn`'s return value, so whatever
  shape is chosen has to serve the router's `return renderSleepCheckIn(focus)` at `:2342` as well.

Round 3 must name it, as SEAM 11 or as a `on.sleepCheckInViewPending(p)` handoff, and re-run the
census mechanically rather than by reading: the check is `assignments in released regions` against
`declarations at factory scope in the sealed module`, which is the fence's own rule and should be
run once by hand before the build round starts.

### BLOCKING-2. E.6's ENTRY-class cell contradicts itself. Four ENTRY bodies would RED it on the real tree.

The two-class split is the whole of BLOCKING-2's fix, and E.6 makes it honest with one sentence:
"E.6's cell asserts that no ENTRY-class body contains any name on E.3's durable-writer word list,
so an ENTRY callback that gained a `.save` is a RED and must be reclassified."

Measured against E.3's list, at `e0e2ac75`:

| ENTRY callback | its body | word-list names inside it |
|---|---|---|
| `on.openFoodLane()` | `openFoodLane` `:593-:618` | `:603` `await host.all()` (`.all`); `:605` `model.setFoodDays(lane)` (`.setFoodDays`) |
| `on.openSleepLane()` | `openSleepLane` `:510-:541` | `:520` `await host.all()`; `:522` `model.setSleepNights(lane)` |
| `on.readSleepCheckIn(date, force)` | `readSleepCheckIn` `:1410-:1427` | `:1412` and `:1416` `checkin.host.forDate` (`.forDate`) |
| `on.loadCheckInKit()` | `loadCheckInKit` `:556-:566` | `:558` `Promise.all` (`.all`) |

So four of the nine ENTRY callbacks fail the cell that is supposed to keep the ENTRY class from
being a loophole. By **H.2 STOP 8b** each must then be reclassified DURABLE and gesture-guarded -
and all four are reached from the PAINT path (`:2245`, `:1951`, `:1180`, `:1489`, `:1492`, `:1435`,
`:523`), which is BLOCKING-2 again, unchanged.

The word list is the thing that is wrong, not the classes. `.all` and `.forDate` are READS, and
`.setFoodDays`/`.setSleepNights` write in-memory projections, not rows: they are on the list
because E.3 built it from "durable writers" as a category rather than from what each name does.
Round 3 must either split E.3's list into a DURABLE half (the half that puts a row on disk) and a
STORE-REACH half (the half a released file may still not name, but that an ENTRY body may), or
write the class-consistency cell against the durable half only and say which names are which. As
written, the mechanism the spec leans on to justify not guarding six paint-driven callbacks does
not survive its first run.

### BLOCKING-3. `gym-app.mjs:546` `model.start()` is called from `paint()`. The gesture guard throws on the first paint of a ready card.

E.6's DURABLE list, widened by this fix round, is "`submitWeighIn`, `recordIntake`, `retryFoodRead`,
`recordSleep`, `retrySleepRead`, `recoverWorkout`, and in the gym card `recordSettings`, `logSet`,
`finish`, `forget`, `undo`, `start`". I checked all six Today entries and every one is reached from
a listener only (`:954`, `:1269`, `:1272`, `:1667`, `:1721`): that half is right. The gym half was
not checked.

```
535:  async function paint() {
539:    if (!owns) return null;
540:    const view = await model.read();
545:    if (view.phase === 'ready') {
546:      const started = await model.start();
```

`paint()` is the gym card's render function. It is reached from the mount at `:568`
(`const first = paint();`), from `startSettingsRead:154`'s `.then`, from `openSettingsLane:167`'s
`.then`, and from eight released control handlers. So `on.start()` - DURABLE, gesture-guarded -
throws `WRITER-OUTSIDE-GESTURE` on the **first paint of a card whose phase is `ready`**, which is
the ordinary case on a device with a prepared workout and no gesture anywhere in the stack.

It cannot be reclassified ENTRY either: `model.start()` is `gym-model.mjs`'s durable start and
`:547` reads `started.ok`. This is the same defect R1 named, in the file the fix round added to the
guard, and the spec's own STOP 8b describes it exactly ("if it is reached from a paint or from the
boot the direction has a problem the report must state rather than solve quietly"). The spec does
not state it.

Round 3 must either take `start` out of the guarded list with the reason written down, or say what
`paint()` becomes so that the start is gesture-driven, and re-check `finishNow` (`:442`, reached
from `:468` and `:499`, both listeners - that one is fine).

### BLOCKING-4. B.7's replacement api literal names a SEALED binding, and it hands out a second writer-capable object the fence does not name.

The literal that replaces v2's spread has two faults of its own.

**(a) `importScreen: () => importScreen` does not run.** The literal keeps `:2556`'s thunk verbatim.
But `importScreen` is declared at `:688` and B.2 row 13 moves it, and B.5 puts it SEALED
("`importScreen`, `measureScreen`, `measureState` ... SEALED: the caches, the deps objects AND the
two dynamic imports move together"). A released file cannot close over it. It must be
`importScreen: () => lanes.api.importScreen()`, as its eleven neighbours are. This is the same
class of error BLOCKING-3 was raised about and it was introduced by the fix.

**(b) `workoutEntry` is the second pass-through and it is unfenced.** `:2568` is
`workoutEntry: () => workout`, and B.7 keeps it as `() => lanes.api.workoutEntry()`. `workout` is
the injected workout ENTRY: it carries `.recover()` (`:954`), `.open()` (`:2364`), `.summary()`
and `workout.gym.holdForAdoption()` (`:2436-:2437`, `:2542-:2543`). That is exactly the object B.7
is honest about for `sleepLane` - "the lane object passes THROUGH the released file's return value"
- and E.5's new red row 14 fences `lanes.api.sleepLane()` and only that. `workoutEntry` gets the
same sentence and the same red row, or B.7's narrower claim is still too narrow.

**(c) And B.1 was not updated to match.** B.1 point 4 still reads: the factory "hands the view a
frozen READ-ONLY FACADE (`facade`) and a frozen CALLBACK TABLE (`on`) in two classes, and nothing
else". B.7 hands it a THIRD object, `lanes.api`, whose `sleepLane()` and `workoutEntry()` return
writer-capable objects by reference. S-R2's literal words are "two frozen things and nothing else".
The design is defensible - the cells drive the real lane through `api.sleepLane` today and the
mount surface may not change - but the spec must say so in B.1 where the ruling is carried out,
not only in B.7 where the exception is measured, or a PM reading B.1 is told something untrue.

### BLOCKING-5. B.2 rows 30 and 31 and SEAM 6 and SEAM 7 carry the same range error R1 found at row 29, uncorrected, and one of them would move two router lines that must not move.

R1 found that row 29 was cut four lines too high. The fix round re-cut row 29 and did not re-read
the two rows below it. At `e0e2ac75` the router's branches are:

```
2343:    if (next === "recovery") {
2344:      const origin = checkinOrigin === "workout" && workout ? "workout"
2345:        : checkinOrigin === "sleep" ? "sleep" : "today";
2346:      checkinOrigin = null;
2347:      if (checkin && typeof checkin.open === "function") {
2349:        const rebound = reboundCheckIn(origin);
2350:        if (rebound) return rebound;
2351:        return checkin.open({ doc, phone, back: () => render(origin, true) });
2352:      }
2353:      return renderCheckInWithoutStore(focus, origin);
2354:    }
2355:    if (next === "measure") return renderMeasure(focus);
2356:    if (next === "import") return renderImport(focus);
2357:    if (next === "coach") return renderStub("t-coach", focus,
2359:    if (next === "workout") {
2364:        return workout.open({ doc, phone, back: () => render("today", true),
2365:          ...(checkin ? { checkIn: () => { checkinOrigin = "workout"; render("recovery", true); } } : {}) });
2372:      return renderStub("t-workout", focus, NO_LOCAL_STORE,
2374:    }
```

Against that:

- B.2 row 30 and SEAM 6 give the recovery branch as **`:2349-:2356`**. The branch is `:2343-:2354`.
  **`:2355` and `:2356` are the MEASURE and IMPORT routes**, and B.2 row 30 says "moves". Taken as
  written, the move takes two router lines that C-UI-6's own neighbour sits on and that C.2 leaves
  released. The coach route cite in C.2 (`:2357-:2358`) is right, which is what proves the
  numbering and not my reading.
- SEAM 6 says "the `checkinOrigin` bookkeeping at `:2350-:2352`". It is at **`:2344-:2346`**.
  `:2350-:2352` is `if (rebound) return rebound;`, the `checkin.open` call and its closing brace -
  that is, the two lines SEAM 6 says MOVE.
- B.2 row 31 and SEAM 7 give the workout branch as **`:2362-:2369`**. The branch is `:2359-:2374`;
  `:2362-:2363` and `:2367-:2371` are comments, and the two fallbacks SEAM 7 says stay
  (`renderStub("t-workout", ...)`) are at `:2372-:2373`, outside the range given.

The substance of both seams is right - `reboundCheckIn(origin)` and the two `open({...})` calls
move, the fallbacks stay - but the ranges are the instruction the build round follows and the
counts feed the 670. Appendix item 8 says plainly that the other 100 regions were not re-read; this
is what that warning costs, two rows away from the row R1 already corrected.

### BLOCKING-6. `sleepClockCheck` cannot move whole. It reads the RELEASED draft, and D.1 permits no substitution for that.

B.2 row 21 moves `sleepClockCheck` and its three flags SEALED, "YES", and D.1 puts every whole-move
region in the manifest where PASS is a byte-identical sha256 modulo W1 to W7 only ("Nothing else.
Not identifier renaming"). The region is:

```
1378:  const sleepTyped = () => !!(sleepDraft.bed || sleepDraft.wake || sleepDraft.hours
1379:    || sleepDraft.awake_min);
1384:  function sleepClockCheck() {
1385:    const now = sleepToday();
1386:    if (!sleepTyped()) {
1387:      sleepRollover = null; sleepOpenedDay = now; sleepOpenedNight = sleepNightDate(); return null;
1388:    }
...
1393:  }
```

`:1386` calls `sleepTyped()`, which reads `sleepDraft` - and B.5 keeps BOTH released, on purpose
and with the file's own reason at `:475` ("The screen's own transient state"). B.3 acknowledges
half of this by giving the callback the signature `on.sleepClock(typed)` "from the released
`sleepTyped()`". But then:

1. **The moved body must become `if (!typed) {`.** That is an identifier substitution inside a
   moved writer region and it is not W1, W2, W3, W4, W5 or W7. `sleepClockCheck`'s manifest row
   fails D.1, which is **H.2 STOP 2**.
2. **`recordSleep:1813` calls `sleepClockCheck()` with no argument**, from inside the seal. SEAM 3
   says of `:1813-:1814`: "**Both are now pure sealed reads of sealed state**". That is false for
   `:1813`. The sealed `recordSleep` has `draftValues`, so it can compute the typed flag - but
   that is a second rewrite inside the seam that the seam table does not carry, and it changes
   `recordSleep`'s own byte count, which SEAM 3 otherwise proves by the four named substitutions.

The honest shapes are either a W8 (`sleepTyped()` to `typed`, allowed in `sleepClockCheck` only,
counted) plus a named line in SEAM 3 for `:1813`, or `sleepClockCheck` becomes the eleventh seam
rather than a whole move. Either way B.2's total and D.1's 28-region manifest change. This one has
been in the spec since v2 and neither round has looked at it.

### BLOCKING-7. The dispute against R1 N1 row 1 is REFUTED. `REQUIRED_INPUTS` holds 48 entries, and the author's own method is what produced 51.

The spec disputes R1 with a stated method: "Counted at `e0e2ac75` by reading the array from
`const REQUIRED_INPUTS = Object.freeze([` at `:98` to its closing `])` at `:201` and extracting
every quoted literal: **51 entries, of which 26 are `today/**`**."

I ran that method and then counted the array ELEMENTS.

- Counting array elements - lines matching `^\s*"rebuild/` between `:98` and `:201`: **48**.
- Of those, lines containing `w7-preview/today/`: **26**. The 26 is right, which is why both hands
  agree on it.
- Running the author's method - extracting every quoted literal in `:98-:201` - returns **54** on
  my run, not 51, because the COMMENT BLOCKS INSIDE THE ARRAY carry quoted strings and apostrophes
  that pair off with them: `"I'll name it myself"` (`:135-:136`), `"Report a problem"` (`:142`),
  `"Import my history"` (`:195-:196`), plus the apostrophes in "engine's", "athlete's", "card's",
  "page's".

So the method the dispute is built on is the one that cannot be trusted here, and the number it
gives is unstable (51 or 54 depending on how the apostrophes pair). **R1's 48 is right and B.10
must read "48 becomes 50"** (51 with F.1's `today-readings.cjs`). It matters twice: B.10 is a LAW
edit, and H18's literal list of the 26 `today/**` entries is sized off the same count.

This is not a large error. I am making it blocking because the spec disputes a reviewer with a
measurement, and a spec that disputes with a measurement must be right.

### BLOCKING-8. The fence's word list gives three guaranteed false positives in RELEASED code, and one of them is a real leak the spec has not seen.

S-R5 re-aims the fence at the released files BY NAME; E.4 lists the false positives it tolerates
(`Map.set`, `Set.add`, `Array.push`, `element.remove/append/replaceChildren`, prose in comments)
and names `navigator.clipboard.writeText` as a deliberate PASS. I scanned both released files for
every member name on E.3's list, at the state the files will be in AFTER the cut:

| site, after the cut | line | why the fence reds it |
|---|---|---|
| `gym-app.mjs` `const latest = entry ? entry.latest : null;` inside the RELEASED `settingsPaint` | `:254` | `.latest` is on the list ("`.latest` on a lane identifier"), and E.4 says the scan is over MEMBER NAMES and matches "where it is READ" - which is exactly what makes E.5 row 1 work. It cannot tell `entry.latest` (a field on a cache record) from `settingsLane.latest(liftId)` (`:147`) |
| `today-app.cjs` `sleepCheckInViewPending = Promise.all([...])` inside the RELEASED `renderSleepCheckIn` | `:1435` | `.all` is on the list. `Promise.all` is not exempted by E.4 |
| `today-app.cjs` `if (focus) importScreen.reopen();` inside the RELEASED `renderImport` | `:718` | `.reopen` is on the list |

The first two are ordinary false positives and cost the fence its credibility the first time it is
run: E.4's own argument is that "a fence that failed on prose would be turned off within a week",
and the same is true of a fence that fails on `Promise.all`. Both need an exemption written with
its reason, the way `writeText` already has one.

**The third is not a false positive. It is the leak.** `renderImport` `:703-:721` stays RELEASED
(B.2 row 14 moves only "renderImport's dynamic import and cache write", 9 lines), and after the
cut the released body still holds:

```
707:    const token = mountToken;
709:    const Screen = await import("../import/import-screen.mjs");
710:    if (token !== mountToken) return root;
711:    if (!importScreen) importScreen = Screen.createImportScreen(importDeps());
718:    if (focus) importScreen.reopen();
719:    await importScreen.paint(root, () => token === mountToken);
```

`importScreen` is the object minted by `../import/import-screen.mjs`, which `:536` seals BY NAME
and which owns the admission path. `:718` and `:719` are a released file calling methods on it -
by reference, exactly the class S-R2 forbids and B.3 asserts does not happen. B.3's disposal is
`on.paintImport(root)`, "the dynamic import, the cache write, the deps object, and the foreign
screen's own paint" - but that signature cannot carry `:710` (which needs the mount token) or
`:718` (which needs `focus`), and the spec never says `:718-:719` move. The same holds for
`renderMeasure` `:645-:680` and `on.paintMeasure(root)`.

Round 3 must give the two paint callbacks their real signatures and state that `:718` and `:719`
move with the import, which also raises row 14's count and removes `.reopen` from the false-positive
list by removing the line.

---

## PART 3 - NOTES (not blocking)

**NOTE-1. The new name census is wrong for one of its four names.** B.3 states `lanes` occurs
"0 / 0 in code (six prose occurrences, which `codeOf` strips)". `today-app.cjs:2196` is
`lanes: laneHandles(),` inside `problemState()` `:2192-:2200`, which is CODE. It is a property key,
so it causes no TDZ fault the way `view` would have - but the census is the evidence the name was
chosen on, and a token scan (which is how E.3 counts `model` 2 and `options` 2) sees it. Say so, or
pick a fifth name.

**NOTE-2. B.4's painter literal says five and the spec elsewhere says six, and W4 lists a region
that does not move.** B.4 shows a frozen object "of exactly five functions, and the fence asserts
its shape". B.5 then adds `painter.paintTodayEntry()` as "a SIXTH paint-handle entry" and H.2 STOP
8 counts six. The literal and the "asserts its shape" sentence were not updated, so the fence would
be written against a five-key shape. Related: D.1's W4 permits the `screen` substitution in
`paintTodayEntry`, which is a MOVED-region allowance - but B.5 keeps `paintTodayEntry` RELEASED,
and it must be: `:769-:774` reads the released `todayEntry` and `mountToken`, tests
`screen !== "today"`, and calls the released drawing helper `importLink(todayEntry.root, null)`.
Strike it from W4.

**NOTE-3. SEAM 2's throw-path trace contradicts SEAM 2's own placement.** The trace asserted for a
throw is `[check, disable, check-sealed, save-throws, readBack-set, enable, repaint]` - enable
before repaint, which is today's order at `:1295`, `:1297`, `:1298`. But SEAM 2's table puts
`render(...)` to `painter.repaint(...)` INSIDE the moved `:1288-:1301` region and `save.disabled =
false` in the view "after", which produces `[..., readBack-set, repaint, enable]`. One of the two
has to move, and the spec's own H.1 risk 2 is the reason to settle it now rather than in the build.
(`:1301`'s `finally` already re-enables after the render today, so the end state is the same; the
trace the cell asserts is not.)

**NOTE-4. B.2 is short by three more const arrows that read sealed bindings.** `session()` `:365`
reads `workout`; `checkinSummary()` `:371` reads `checkin`; `firstRun()` `:384` reads `setup`. All
three are declared OUTSIDE row 36's ranges (`:362-:364`, `:366-:383`), all three are replaced by
facade reads in B.5, and none of them is in any B.2 row. Three lines on a 670 that the appendix
already warns is v2's 663 plus six named deltas rather than a fresh derivation.

**NOTE-5. The gym card has no sealed in-flight flag, and B.3's own argument says it needs four.**
B.3 adds `weighInBusy`, `foodBusy` and `settingsBusy` because "after the cut the only thing between
two gestures and two durable writes would be released code six tickets will edit". `gym-app.mjs`'s
`logSet` (`:417-:421`), `finish` (`:443-:445`), `undo` (`:503-:506`) and the `:497` guard are
fenced by exactly one thing: the RELEASED `busy` flag, in a file C-UI-4 edits. Either the argument
covers them or it does not cover the weigh-in; it cannot cover one and not the other.

**NOTE-6. `food.test.mjs:1152-:1153` imposes an unstated ordering constraint on the new module.**
The slice is `source.indexOf('function foodEntryFor')` to `source.indexOf('function openFoodLane')`.
D.3 correctly names the two-space indentation constraint that `problem.test.mjs:1100-:1102` puts on
`sleepEntryFor`; it does not name this one. `foodEntryFor` must be declared BEFORE `openFoodLane`
in `today-lanes.cjs` or the slice is empty and the three assertions pass vacuously. B.2's row order
(9 then 10) happens to give it; say so.

**NOTE-7. B.7's re-export of `createTodayModel` through the seal is unnecessary under F.1's own
recommendation.** The RE-EXPORT RULE exists so that a released file may name a sealed module's
export. But F.1 recommends leaving `today-model.cjs` FREE (and released), and E.3's own
"What a released view MAY import" list includes `today-model.cjs` by name. So `:16`
`const { createTodayModel } = require("./today-model.cjs");` can simply stay as it is, and the
detour buys a rule, a fence row (E.5 row 7) and a coupling from the model factory to the mount's
lane module for nothing. It is only needed under F.1 (d). Say which fork it belongs to.

**NOTE-8. G.4 should cite S9's own argv measurement.** See PART 1: S9 v4 `:160-:161` settles the
question this ticket asks about the `released` role, by parsing `packages/S8.json`. One sentence in
G.4 saves the S10 reviewer the walk.

**NOTE-9. The estimate.** 44 to 60 build and 12 to 16 review is the right instinct and it is again
low. The eight findings above are not code the spec forgot: they are a twelfth seam, a word list
that has to be split in two, a guard subject list that has to be re-derived for the second file, an
api literal that has to be re-read against B.5 line by line, three router ranges to re-measure, and
a whole-move region that becomes a seam. My band is **50 to 66 build, 14 to 18 review**. Per ticket
freed that is 7.3 hours against v1's 8.6 - still in this direction's favour, and by less again.
The growth from 35 to 48 (v2) to 44 to 60 (this round) to 50 to 66 (mine) is itself the most useful
number in the document: two review rounds have each added about a fifth, and both times the
addition was interface the spec had not designed rather than work it had underpriced.

**NOTE-10. Small cite corrections, none changing a conclusion.**

| spec | says | is |
|---|---|---|
| B.7 | `module.exports` `:2600-:2624` | `:2600-:2625` (R1 had it right) |
| SEAM 9 | `:1536-:1538` for `dateBox.disabled`, `const latest`, `dateBox.max` | `:1535-:1537`; `:1538` is the `addEventListener` |
| B.9 | `refuse()`'s DOM half `:292-:294` | `:292` is a comment, `:293-:294` is the DOM half. Immaterial to the split |

**NOTE-11. What I agree with the author about, against a reader's likely objection.** Leaving
`mountToken += 1` at `:2296` released is right, and `:2289-:2294` and `:1921-:1926` say why in the
file's own words. Q6 should be answered "accept". Q1 (the sealed sibling), Q2 (pinned-unchanged for
the three rule files), Q4 (the zero-copy fence assertion instead of nine widenings), Q5 and Q7 I
would answer as the spec recommends. On Q3 I agree the guard is in scope and that its subject list
is the question - see BLOCKING-2 and BLOCKING-3 for why the list is still not finished.

---

## PART 4 - DIRECTION VERDICT

**Extracting the WRITERS remains better than extracting the view. The PM's ruling should stand, and
this is the second independent hand to say so.** Criterion by criterion, on the evidence I checked
rather than on R1's table:

| criterion | winner | why, at this round |
|---|---|---|
| **data safety** | **v1**, and the gap did not close this round | The fix round disposed of R1's seven named lines properly - `:1539-:1542`, `:1560-:1562`, `:2297`, `:1069`, `:1287`, `:2451` - and I verified each. But this review found three more decisions still on the released side: `:1435`'s assignment of a sealed read handle, `:718`'s call into the sealed import screen, and `gym-app.mjs`'s released `busy` as the only duplicate guard on four writers. The count of unresolved released-side decisions went from seven to three, not to zero, and the mechanism meant to prove it empty (E.3 red row 13, E.6's class cell) is itself red on the real tree |
| **regression risk of the refactor** | **v1** | Unchanged from R1, and the spec does not hide it. v1 moved no writer; this moves all of them, eleven seams and eleven sentences. What changed this round is that the proof got better: D.1's wrapper is now defined exactly, and BLOCKING-6 above is a case where that exactness CAUGHT something - the manifest cannot hold `sleepClockCheck` - which is what a good proof is for |
| **size of the move** | **v2/this** | 670 plus 67 against about 1700. I checked eleven boundaries by hand; nine agreed, two (B.2 rows 30 and 31) did not, and three small regions are missing (NOTE-4). The order of magnitude is right |
| **test churn** | **this, clearly** | Three edits, all file-name re-points, zero import paths, verified at `food.test.mjs:1152-:1153`, `problem.test.mjs:1100-:1102` and `package.test.cjs:104-:105`. `problem.test.mjs:2003-:2008` really does stay unedited under B.3's by-reference engine crossing. Against v1's nine |
| **residue for the look tickets** | **this, decisively** | Eight of eight freed. I looked for a C.2 citation landing in a sealed file after the cut and found none. C.3's honest counter-statement about a NEW model field still riding a child is correctly stated and is the reason F.1's fork matters |
| **future reseal cost** | **this** | The sealed surface ends at about 740 lines in three small modules with a named interface, against v1's roughly 900-line sealed `today-app.cjs` still holding the router, the boot and the adoption chain |
| **contention in one file** | **v1** | Six tickets in one 2000-line file. G.3 concedes it and S-R1 (g)'s answer is right: modularising the released view later costs a lane C ticket, not a reseal child |

**Net: four to three, same as R1, and I read it the same way.** The two v1 wins are about the
transition and are bounded by proofs this spec specifies well; the four wins are permanent
properties of the result. Freeing C-UI-4 and C-UI-5, which v1 could not free at all, and removing
every copy constraint from C-UI-3 and C-UI-7, is worth a harder single round.

**But the sentence to carry to the PM is not the same sentence as last round.** R1 said the
direction was right and v2 did not execute it. After the fix round the direction is right and the
spec executes it at seven of ten places. What is left is not new design risk: every one of the
eight blocking findings is an interface the spec has not finished, not a writer that cannot leave
its closure, not a read path that cannot be made read-only, not a limit of the `released` role
(which S9 v4 `:160-:161` measures and settles in the split's favour), and not a router carrying a
decision that cannot move. **There is no STOP, and round 3 should be a smaller round than round 2
was.** The two things it must not treat as bookkeeping are the word list (BLOCKING-2) and the
released-assignment census run mechanically rather than by reading (BLOCKING-1).

One sentence for the S10 brief, if PM4 wants it: after the split the released half still mints the
check-in view's read handle (`:1435`) and still drives the sealed import screen (`:718-:719`), and
the fence's word list must be split into the names that put a row on disk and the names that merely
reach a store before either the fence or the ENTRY class means anything.

---

## What I did NOT verify

1. **I ran nothing.** No suite, no build, no `b-package.cjs`, no gate, no browser check, no design
   gate. Every finding is read, not executed.
2. **I did not re-derive B.2's 120 regions.** I read the state block, the three router branches,
   the boot, the api, the export list, the ten seams' cited lines, `sleepClockCheck`,
   `renderSleepCheckIn`, `renderImport`, both openers, `loadCheckInKit`, `readSleepCheckIn`, and
   `gym-app.mjs:120-:182` and `:240-:320` in full. The spec's appendix items 2 and 8 warn the build
   round to re-derive the manifest; BLOCKING-5 and NOTE-4 are what that warning is about, and it
   should be obeyed.
3. **I did not re-run the census of released-to-sealed assignments as a script.** I ran it as a
   grep over every SEALED binding name and read each hit's enclosing region by hand. That is how
   `:1435` surfaced; a second hand should run it mechanically, because the method that missed it
   twice is reading.
4. **I did not open `import/`, `measure/`, `today-entry.mjs`, any `*-host.mjs`, or
   `machine-settings-view.mjs`.** BLOCKING-8's third row rests on `today-app.cjs:709-:719` alone.
5. **I did not re-verify R1's DOM census of the four lane hosts**, nor the design-of-record
   citation lists behind C.2. I re-used R1's and the spec's, which agree.
6. **I did not read the S9 runner's code**, only `S9-RELEASE-SPEC.md` at `da9f8683`. S9 is at v4
   and in a fix round; if the `released` block's shape changes again, G.4 must be re-read.
7. **I did not read `rebuild/conform/private`, `src/history.js`, any `ledger/` directory, the
   protected soak, or anything on the owner's data path. The owner's real measurements are not in
   this session.**
8. **This review is itself a hypothesis.** Three hands have now attacked this design and it has got
   better each time. Every finding above is cited to a line so the PM can read it directly and
   disagree.
