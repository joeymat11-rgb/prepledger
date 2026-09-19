# TODAY-SPLIT SPIKE - what the machine measured

The PM's diagnosis for round 3 (S-R17): two rounds of a HAND census of closure bindings each
missed crossings the next reviewer found by reading, so the census must be a machine's. This
is that census, plus the region table and the codemod it is run over, plus the reachability
table S-R12 makes the gesture guard's subject list out of.

I measured by running. I did not write the spec, design the facade's names or argue the
design. Where the spike contradicts the spec or a review, the numbers are below and they are
reproducible in three commands.

## The three commands

From a farm scratch worktree at the ref you want (`farm-scratch.sh <name> <ref>`), with this
directory as the working directory:

```
node cut.cjs    --root <worktree> --out out            # the codemod + the verbatim check
node census.cjs --root <worktree> --out out --md CROSSINGS.md --json crossings.json
node reach.cjs  --root <worktree>            --md REACH.md    --json reach.json
```

`cut.cjs --wire` adds the one authored shim `regions.json` declares for `today-model.cjs`, so
that cut can be required and the suites run against it. The instrument is
`/home/claude/farm/tools/census/node_modules` (acorn 8, acorn-walk, eslint-scope 8), required
by absolute path. It is a DEV instrument: it is never a CI dependency and never copied into
any `node_modules` the repository uses. `gen-regions.cjs` re-derives `regions.json` from line
ranges and is kept beside the table so a later round can re-derive rather than hand-edit it.

**The codemod's output is not committed.** It lives only in farm scratch worktrees.

## Both refs

Run at the chain tip (`fdd773d5`, `rebuild/t2-client-core`) and at the S9 lane head
(`da9f8683`, `rebuild/b-s9-ui-pins`), where `today-app.cjs:862-:874` and `today-model.cjs`
already differ.

| | chain tip | S9 lane head |
|---|---|---|
| regions resolved by content anchor | 65 / 65 | 65 / 65 |
| anchors that matched zero or ambiguously | 0 | 0 |
| lines moved | 762 (685 + 41 + 36) | 762 |
| `node --check` on the six output files | 6 / 6 pass | 6 / 6 pass |
| crossings | **282** | **282** |
| distinct direction+name | 100 | 100 |
| reachability rows | 56 | 56 |
| durable PUT call sites a paint root reaches | **1** | **1** |

The two runs are IDENTICAL row for row, once the S9 ref's one-line offset below `:869` is
allowed for: every region resolved at its tip line numbers at the tip, and 30 of them
resolved one line lower at S9 (and `today-model.cjs`'s three 32 lines lower), which is the
whole point of anchoring by content. The crossing sets differ by nothing; the reachability
rows differ only in the line numbers embedded in anonymous-function names.

## (a) The region table

`regions.json`. 65 regions: 45 `move` and 20 `seam`, over the three files. Each row carries
its destination, the exact text of its first and last line with an occurrence index, and the
tip line numbers as a cross-check only. `cut.cjs` refuses by name on an anchor that matches
zero places, on an occurrence index that does not exist, on a last anchor it cannot find
after the first, on two regions that overlap, and on a region boundary that falls inside a
statement.

## (b) The codemod and the verbatim check

`cut.cjs`. Moved bytes equal source bytes except the substitution rows declared in
`regions.json`. **Five rows, all five in `today-model.cjs`**, all five the `lastMessage` to
`setMessage` rewrite of F.1 (c)'s W6. Every one of the five is a STATEMENT rewrite, not a
bare identifier or a call-target rewrite, so by **S-R17 (g) all five are STOPs**. There are
no other substitutions: 726 of the 762 moved lines move byte for byte with nothing applied to
them at all, because the spike does not synthesise an interface - it leaves the crossings
stranded so the census can name them.

## (c) The machine census

`census.cjs`, `CROSSINGS.md`. Scope analysis over the six output files; every reference that
resolves to no declaration in the file it sits in is a crossing.

| class | rows |
|---|---|
| released reads a sealed binding | 119 |
| released calls a sealed function | 42 |
| sealed calls a released function | 34 |
| module-constant the sealed half must re-require | 33 |
| sealed reads a released binding | 29 |
| **RELEASED ASSIGNS A SEALED BINDING** | **25** |
| SEALED ASSIGNS A RELEASED BINDING | 0 (it was 5, and W6 is what makes it 0) |

**Every crossing R1 and R2 found fell out on the first run**, at the line the review cites:

| review finding | the census row |
|---|---|
| R1 BLOCKING-5, the seven released sleep-screen writes | `sleepNightChoice` `:1539` `:1560`, `sleepRollover` `:1540` `:1561`, `sleepOpenedDay`/`sleepOpenedNight` `:1541` `:1562`, `sleepAck`/`sleepReadBack`/`sleepCorrecting`/`sleepErrorText` `:1542` - twelve write rows, all RELEASED ASSIGNS A SEALED BINDING |
| R1 BLOCKING-4 / SEAM 10 | `sleepCheckInDay` and `sleepCheckInPending` write at `:2297` |
| R2 BLOCKING-1, the twelfth seam | `sleepCheckInViewPending` **write** at `:1435`, declared `:474` in TA-S09 |
| R2 BLOCKING-6, `sleepClockCheck` cannot move whole | `sleepTyped` **call** from inside TA-S26, declared released at `:1378` |
| R2 BLOCKING-8, the import-screen leak | `importScreen` read at `:718` and `:719`, declared `:688` in TA-S20 |
| R2 BLOCKING-4 (a), `importScreen: () => importScreen` | `importScreen` read at `:2556` in the api literal |
| R2 BLOCKING-4 (b), `workoutEntry` | `workout` read at `:2568` |
| R2 NOTE-2, strike `paintTodayEntry` from W4 | `screen` is read in six moved regions and `paintTodayEntry` is not one of them |
| B.5's `foodSaving`/`sleepSaving` | write at `:1269` `:1272` `:1667` `:1721` |

**Nothing in either review failed to appear.** I have no instrument fact to explain, which is
the answer to the brief's question: the reading census and the machine census agree wherever
the reading census looked. The machine's contribution is the rows nobody looked at.

### What the census found that neither the spec nor either review carries

1. **`gym-app.mjs:279` `settingsSaving = recordSettings(map, view, paintedDraft);`** is a
   RELEASED assignment of a binding B.9 moves sealed (`:125`). It is the exact shape of R1
   BLOCKING-5, in the second file, and it is the gym card's only one. B.9 does not name it.
2. **`gym-app.mjs:569-:579` `first.settings`** is a second returned api, and it hands out
   five sealed bindings, one of them `lane: () => settingsLane` - the settings lane object
   itself. That is B.7's `sleepLane` pass-through class and R2 BLOCKING-4 (b)'s `workoutEntry`
   class, in a file B.9 discusses without mentioning that it has an api at all.
3. **`lastMessage` is assigned at FIVE sites, not three.** F.1 (c) prices W6 at "three lines,
   in a writer": `:383`, `:388`, `:392` and `:396` inside `weighIn` and `:402` inside
   `reopen`. Five rows, and the fifth is in the other function.
4. **`reopen` calls the released `read()`** (`today-model.cjs:404`). F.1 (c) lists six
   bindings the sibling closes over; the machine says seven. The wired build needs
   `read: () => read()` and does not work without it.
5. **`clearSleepDraft` is called from `retrySleepRead` as well as `recordSleep`.** D.1's W3
   permits that substitution in `recordSleep` only.
6. **`screen`'s sixth moved reader is `rebindWorkout`, not `paintTodayEntry`.** The six
   regions that read it are `openSleepLane`, `openFoodLane`, `measureDeps`, `importDeps`,
   `readSleepCheckIn` and `rebindWorkout`. W4 names five of those and a sixth that stays
   released (R2 NOTE-2 is right to strike it, and this says what replaces it).
7. **`retrySleepRead` composes athlete-facing copy** (`SLEEP_NOT_SAVED`,
   `SLEEP_NOTHING_RECORDED`, `SLEEP_KEPT`). B.6 tables `recordSleep`'s eleven sentences and
   nothing else. The full measurement: the sealed half reads **12 distinct released copy
   constants across 22 references**, in `recordSleep`, `recordIntake`,
   `committedSleepAttempt` and `retrySleepRead`.
8. **`ready` is read by a released drawing region**: `renderMeasure:668` `try { await ready; }`.
   B.7 disposes of `ready` in the api literal and nowhere else.
9. **`sleepErrorText` is read by released code at `:1657` and `:1658`.** B.5's disposal row
   turns it into the sealed `sleepOutcome` and does not name the two released reads that
   have to become the mapper's input.
10. **33 module-level names cross**, not counted anywhere in the spec: the sealed half reads
    `FoodModel`, `SleepModel`, `plainOrDrop`, `reasonOf`, `NO_STORE` and the copy constants.
    Every one is a re-require or a facade entry the interface has to carry.

### The boot order, which no round has looked at

`cut.cjs` prints it. `mountToday` has **13 executable statements at its own top level and the
cut moves 6 of them**, and they are INTERLEAVED with released ones:

```
:353 :354 :355 :356   released
:422 :482 :567        MOVED   (setFoodDays, setSleepNights, loadCheckInKit)
:2390                 released (the #phone keydown listener)
:2440 :2441           MOVED   (willAdopt, armAdoptionGate)
:2451                 released (render(requestedScreen() || ...)) - THE FIRST PAINT
:2550                 MOVED   (ready = settleAdoption(...))
:2552                 released (the returned api)
```

B.3 calls the factory once, "immediately after the three element handles". A single call at
one point runs `:2550` BEFORE `:2451`, which moves `settleAdoption`'s synchronous
`adoptionSettled = !adopting` to before the first paint, and `paintTodayEntry:770` reads that
flag. So either the factory is called at three points - which breaks the one-handoff rule
E.3 asserts (`createTodayLanes` counts 2) - or the boot statements stay released as calls
into it. Either way it is interface the spec has not designed, and it is the same class as
R2 note 9's diagnosis.

### The seam list is the machine's (S-R17 (g))

`cut.cjs`'s ALIGNMENT CHECK: a region whose boundary falls inside a statement cannot be a
pure move, because a cut there leaves half a statement in the released file - and `node
--check` does not catch it, because both halves can still parse. Three of the spec's own
ranges straddle a statement:

| region | the spec's range | the statement it cuts |
|---|---|---|
| `today-model.cjs` TM-S01 | F.1 gives `OUT_OF_RANGE` as `:373` | the declaration runs `:373-:374`; cut at `:373` it leaves `+ " lb, to one decimal place. Nothing was recorded.";` behind as a valid unary-plus expression statement, and `node --check` passes on the silently broken cut. **Corrected to `:365-:374` in the table.** |
| `today-app.cjs` TA-M07 (SEAM 11) | `:1435` | the statement runs `:1435-:1444`. R2 BLOCKING-1 is right that this is a seam and not a line |
| `today-app.cjs` TA-M11 (SEAM 5) | B.8 gives `:2300-:2336` | the branch block runs `:2300-:2337` |
| `gym-app.mjs` GA-M02 | B.9 gives `model.logSet` at `:419` | the statement runs `:419-:420` |

Seventeen of the twenty declared seams DO align, which means they are candidates for pure
moves and the seam is about what the RELEASED half decides, not about syntax. The STOP under
S-R17 (g) - a seam whose released half decides what is stored - is carried by the assignment
census above: **25 released-assigns-sealed rows, in 8 regions**, and `:1435`, `:2297`,
`:1539-:1542`, `:1560-:1562` and `gym-app.mjs:279` are the ones where the released half is
deciding what is stored or what is re-read.

## (d) The reachability table

`reach.cjs`, `REACH.md`. Three word lists, split the way R2 BLOCKING-2 demands: **PUT** (it
may put a row of the athlete's on disk), **STORE** (it reaches a store and stores nothing),
**ADOPT** (it replaces an in-memory basis or moves a gate; F.2 says these are not durable).
A paint INSTALLS a listener and does not RUN it, so the `listener` edge is not in the closure
a paint or a boot reaches; a deferred `.then` body and a callback a foreign module holds are,
because those run with no gesture on the stack.

**The answer to S-R12, measured: exactly ONE durable PUT is reached from a paint root.**

```
gym-app.mjs:546  model.start()  in paint()   [paint SYNC, boot SYNC, listener SYNC]
```

That is R2 BLOCKING-3, and it is the only one. Every other PUT call site in the three files -
`workout.recover():954`, `model.weighIn():1072`, `foodLane.save():1293`,
`sleepLane.save():1843`, `settingsLane.save():305`, `model.logSet():419`,
`model.finish():444`, `model.forget():498`, `model.undo():505` - is reached from a LISTENER
and from nothing else (`paint -`, `boot -`).

**And R2 BLOCKING-2 is settled by measurement.** The four ENTRY callbacks R2 says would RED
E.6's class cell reach **no PUT at all**. What they reach is:

| ENTRY callback | what it actually reaches | class |
|---|---|---|
| `openFoodLane` | `host.all()` `:603` | STORE |
| | `model.setFoodDays()` `:605` | ADOPT |
| `openSleepLane` | `host.all()` `:520`, `model.setSleepNights()` `:522` | STORE, ADOPT |
| `readSleepCheckIn` | `host.forDate()` `:1416` | STORE |
| `loadCheckInKit` | `Promise.all` | not a store at all (receiver filter) |

So the fix R2 asks for is a three-way split of E.3's list and the guard's subject is the PUT
half. With that split the ENTRY class survives its own cell.

**Two more the machine corrects in E.6's DURABLE list.** `retryFoodRead` and `retrySleepRead`
contain NO durable put: they call `foodLane.refresh()` `:1327` and `sleepLane.refresh()`
`:1732`, which are STORE. Under S-R12's own rule ("guarded if and only if it reaches a
durable put") both come OFF the guarded list. E.6 has both on it.

Judgement calls I am flagging rather than deciding: `.restart` (`today-model.cjs:403`, inside
`reopen`) is on the PUT list because E.3 has it there; it re-opens a lane rather than writing
a row, and a later round may want it on STORE. `.reopen` is on PUT for the same reason, and
that is what makes `importScreen.reopen():718` appear in the table. The receiver filter marks
that row "receiver is not a store", which is true of `importScreen` as a STORE hit and is NOT
a verdict on R2 BLOCKING-8: BLOCKING-8's third row is a real leak, and the instrument that
catches it is the CENSUS, where `importScreen` is a released read at `:718` and `:719` of a
binding TA-S20 moves sealed. Two instruments, one line, and only one of them is the right
one for it.

What a static call graph cannot see is listed in `REACH.md`'s last table, eleven edges, each
with the line that proves it: the `done` callback `setup-app.mjs` invokes (`:2321`), the
`back`/`checkIn` callbacks the check-in and the gym card invoke, `measureDeps`/`importDeps`'s
`repaint`/`back`/`onAdmitted` (`:640`, `:641`, `:696-:700` - `onAdmitted` runs
`adoptAthleteState()` from inside a foreign module), the two dynamic-import lanes whose
`.save` belongs to a host this instrument never opens, and `settleAdoption`'s
`chain.then(answered, answered)` at `:788`. **And the twelfth, which is the whole reason the
gesture guard is a RUNTIME guard: after the cut, every `on.<callback>` edge is invisible to
this instrument too.** A parser cannot tell `on.recordIntake()` called from a click listener
from the same call at the top of a render function. E.6 is right about that and this spike
confirms it by failing to see it.

## (e) The suites on the output

`node --check`: **6 of 6 output files pass at both refs.** That is all it proves, and the
alignment check above is the reason it is not enough.

**The pure move cannot be green and the census says exactly why.** Run on the pure output,
`view.test.mjs` is 1 pass / 22 fail, first failure
`ReferenceError: weighIn is not defined` at `today-model.cjs:390`. That is crossing row one
of 282. The spike does not synthesise an interface, so the residue is the interface: 282
references, 100 distinct names, and the 25 released-assigns-sealed rows are the ones that
cannot be served by a getter at all.

**One of the three cuts is wired end to end, run, and GREEN.** `cut.cjs --wire` composes
`today-readings.cjs` into `today-model.cjs` with the seven injections the census derived, and
the result is a real module: `createTodayModel(...)` returns 28 keys with `weighIn`, `reopen`
and the four constants in place. With that pair overlaid into a scratch worktree at the chain
tip, the whole today step (the command at `.github/workflows/rebuild.yml:232`) runs:

```
# tests 682
# pass 682
# fail 0
```

**682 of 682, zero failures**, which is the PM's own measured count for the step. So the F.1
cut - the weigh-in writer out of `today-model.cjs` into a sealed sibling - is not a
hypothesis any more: it is a move that has been made and stood by the suite, with five
declared substitution rows and one seven-key injection, and the two corrections the census
made to F.1 (five `lastMessage` sites, not three; `read()` as a seventh injection) are both
load-bearing - without either the suite does not go green.

A note on the other number in this report: the FIRST baseline run of the same step, taken on
the unmodified tree while the wired run was competing with it for two CPUs, came back 681 / 680
/ 1 with `measure/test/journey.test.mjs` killed by SIGKILL at 409 seconds. That is the farm
running out of memory with two full steps at once, not a finding, and the 682 / 682 / 0 above
is over the same seventeen files.

## The residue, exactly

1. **The interface is not built, by design.** 282 crossings stand; `CROSSINGS.md` is the list
   and every row says which region declares the name. Two of the three cuts (`today-app.cjs`
   to `today-lanes.cjs`, `gym-app.mjs` to `gym-settings-lane.mjs`) are pure moves that do not
   run. The today step on them fails at the first crossing.
2. **The boot order is unresolved.** Six of thirteen mount-level executable statements move
   and they interleave with released ones. One factory call cannot preserve the order.
3. **Five declared substitution rows are S-R17 (g) STOPs**, all five `lastMessage` to
   `setMessage`, and F.1 prices three of them.
4. **`.restart` and `.reopen` on the PUT list are a judgement I did not make.** They change
   which rows in `REACH.md` read as durable; they do not change the one paint-reached PUT.
5. **I did not measure `machine-settings-view.mjs`, `food-model.cjs`, `sleep-model.cjs`,
   `checkin-model.mjs`, `import/`, `measure/`, any `*-host.mjs` or `today-entry.mjs`.** The
   three files this ticket names are the whole of the census's scope, and the blind-edge
   table says where that boundary bites.
6. **No browser, no build, no `b-package.cjs`, no bundle, no design gate, no soak.** Nothing
   on the owner's data path was opened. The codemod's output is not committed and exists only
   in farm scratch worktrees.

## Re-run and verification, 2026-09-19 (the second hand)

The first hand was cut off by a usage limit while it was making this durable. Everything
above was re-run from scratch, at both refs, before any of it was committed, and it
reproduces:

| what | result |
|---|---|
| `cut.cjs` at the chain tip | the same report: 65 of 65 anchors resolved, 762 lines moved, 5 substitution rows / 5 occurrences, 0 verbatim failures, no line drift |
| `cut.cjs` at `da9f8683` | the same, with the same line drift below `:869` |
| `census.cjs` at both refs | 282 crossings, 100 distinct direction+name, the same six class counts |
| `reach.cjs` at both refs | the same rows, and the same ONE paint-reached durable PUT |
| `CROSSINGS.md`, `CROSSINGS-s9.md`, `REACH.md`, `REACH-s9.md`, `reach-tip.json`, `reach-s9.json` | byte for byte identical to the stored copies (`crossings-*.json` differ in one field: the `out` path the run was given) |
| `node --check` on the six output files | 6 of 6 at both refs |
| the whole today step on the WIRED output | `# tests 682` `# pass 682` `# fail 0`, 337 s, run alone this time |

That last row is the one worth saying twice: the F.1 cut was re-run on a fresh scratch
worktree and the step is green a second time, on its own, with no other run competing for
the two CPUs. 682 of 682 is the PM's own count for the step.

The chain tip has moved since the measurements above were taken: `fdd773d5` to `70113da5`,
which is DECISIONS:550 and the STATUS line and nothing else. The diff between the two
touches two files and neither is one of the three this spike cuts, so every line number in
this report still resolves at the current tip.

Two things this commit does not carry, said plainly. `CROSSINGS-s9.md` and `REACH-s9.md`
are not committed: they are the same tables with the line numbers below `:869` shifted by
one, and the three commands re-derive them in a minute at either ref. And the codemod's
OUTPUT is not committed, by the ticket's own rule; it exists only in farm scratch
worktrees.
