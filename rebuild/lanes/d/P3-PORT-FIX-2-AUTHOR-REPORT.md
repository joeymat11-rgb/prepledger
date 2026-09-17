# P3-PORT-FIX-2: author report

Lane D, data path, the same seal as P3-PORT-FIX. Three rulings from
DECISIONS:509 and nothing else. Built ON the accepted P3-PORT-FIX change,
branch `rebuild/d-p3-port-fix`, base `94f298d` (P3-PORT-FIX review R2 ACCEPT).

Synthetic data only. Nothing under `rebuild/conform/private`, `src/history.js`,
`ledger/` or `C:\Users\joeym\EarnedPort\` was opened, named or reachable from
any cell in this ticket. No guard, law or test was weakened.

## 1. THE COMMITS

| sha | what |
|-----|------|
| `8626f4d` | P3-PORT-FIX-2: cells, red first |
| `c69bb5d` | P3-PORT-FIX-2: capture provenance, field-keyed copy, retained bounds |
| (this file) | P3-PORT-FIX-2: author report |

Pushed to `origin` as `rebuild/d-p3-port-fix`.

## 2. RED FIRST

The cells were written and run against the UNCHANGED product at `94f298d`
before one byte of `rebuild/m3` moved. `%TEMP%\pf2-red1.log`: `tests 32`,
`pass 24`, `fail 8`. Every red is one of the new or rewritten cells, and every
one of them is red for the reason the ruling names, not for a construction
fault. The eight, with the line the runner printed:

| cell | ruling | red because | after |
|------|--------|-------------|-------|
| `D-PF-f1` REWRITTEN | R1 | `the capture set-count check still refuses the owner's own path: [{"code":"LOCAL_SOURCE_PROGRAMME_UNRESOLVED","field":"capture_sets","exercise_id":"db-bench"}]` | green |
| `D-PF-f4` NEW | R1 | `the import was refused, so the morning after proves nothing:` same issue | green |
| `D-PF-f5` NEW | R2 | the rendered box read the training-week sentence, not the capture_sets one | green |
| `P3-U5` (`route.test.mjs`) | R2 | the rendered box read the training-week sentence, not the setup_document one | green |
| `D-PF-n4` REWRITTEN | R3 | `bound-sets-zero was admitted` | green |
| `D-PF-n5 (hi)` NEW | R3 | `bound-hi was admitted` | green |
| `D-PF-n5 (inc)` NEW | R3 | `bound-inc was admitted` | green |
| `D-PF-n5 (steps)` NEW | R3 | `bound-steps was admitted` | green |

The 24 that were green stayed green: they are the whole of `programme-rule`'s
shape cells, `D-PF-f2`, `D-PF-f3` and the rest of `route.test.mjs`. `D-PF-f5`
is worth a second look: on the unchanged tree it already REFUSED, and its red
was only the copy. That is the point of it. The capture it builds matches
NEITHER the document nor the file, so it refused before this change and must
still refuse after it, and it is the one cell in the file that proves the
provenance check was narrowed and not removed.

## 3. THE DIFF, FILE BY FILE

`git diff --numstat 94f298d..HEAD`:

    230  95  rebuild/lanes/d/p3-port-fix/capture-codes.test.mjs
     84  35  rebuild/lanes/d/p3-port-fix/programme-rule.test.mjs
    105   4  rebuild/m3/w6/local/source-admission.mjs
     34   2  rebuild/m3/w7-preview/import/import-screen.mjs
     16   4  rebuild/m3/w7-preview/import/test/route.test.mjs

PRODUCT is exactly the two files the ticket allows. The lockdown numstat over
`rebuild/authority`, `rebuild/client`, `rebuild/engine`, `rebuild/coach`,
`rebuild/m3/setup/port`, `rebuild/m3/w6/host`, `rebuild/m3/w7-preview/today`,
`rebuild/DECISIONS.md`, `rebuild/m4/import/replay-core.cjs` and
`rebuild/m4/workout/athlete-state.cjs` is EMPTY.

### `rebuild/m3/w6/local/source-admission.mjs` (+105 / -4)

| line (after) | change | ruling |
|--------------|--------|--------|
| `:96-127` | the closed vocabulary written out in full as a table in the comment above `detailOf`, with the four new members `sets` `hi` `inc` `steps` and the four capture members in it. `detailOf` itself is BYTE UNCHANGED, as the ticket requires | R3 |
| `:194` | `programme(source,ops,{today})` -> `programme(source,ops,{today,documentSets=null})` | R1 |
| `:199-205` | the out parameter and its argument: the document's set count per lift, filled straight after `createCleanInitState` and BEFORE any comparison can refuse | R1 |
| `:212-217` | `BOUNDED_FIELDS`, declared beside `fields` and `PROJECTED_FIELDS` and explicitly neither of them | R3 |
| `:236-257` | the per-lift bound, inside the existing loop, after the `day`/`mg` comparison | R3 |
| `:291-296` | the call site: `const documentSets=new Map();` and the extra argument | R1 |
| `:399-433` | THE ARGUMENT (section 5 below) and the one changed expression: `state.exercises.find(e=>e.id===id).sets` -> `documentSets.get(id)` | R1 |

Nothing else in the file moved. `capture_producer` (`:396`), `capture_lift`
(`:398`) and `capture_membership` (`:443`) are byte for byte what they were, and
so is the `KNOWN_REPLAY_CODES` allowlist, the `:347` catch and the returned
basis. The programme digest input is therefore identical to P3-PORT-FIX's on
every file that admits under both, which cell `PF-a` still asserts by
recomputing it.

### `rebuild/m3/w7-preview/import/import-screen.mjs` (+34 / -2)

| line (after) | change | ruling |
|--------------|--------|--------|
| `:92-104` | two COPY lines, the PM's words verbatim: `captureSetsMismatch` and `noSetupDocument` | R2 |
| `:127-136` | `REFUSAL_FIELD_SENTENCE`, frozen, two entries, keyed by the machinery's own closed vocabulary | R2 |
| `:147-158` | `refusalLines()` picks the FIRST token of the detail that this map knows and uses its sentence; with no such token it uses `REFUSAL_SENTENCE[code]`, exactly as before | R2 |
| `:612` | `REFUSAL_FIELD_SENTENCE` added to the default export | R2 |

`REFUSAL_SENTENCE` keeps both its entries and `COPY.programmeMismatch` is
unchanged, so every other field and the bare code render exactly what they
rendered at `94f298d`. `codeLine`, the detail assembly in `confirm()` and the
field + `exercise_id` rendering are untouched.

### test files

`capture-codes.test.mjs` (+230/-95): `D-PF-f1` inverted, `f2` and `f3` kept with
their meaning restated in comments, `f4` and `f5` added, and the helpers widened
(`phoneState(override)`, `recordAWorkout(era, day, state)`,
`importAfterAWorkout(..., {workoutState, day, keepOpen})`, `reopenPage`).
`programme-rule.test.mjs` (+84/-35): `D-PF-n4` rewritten, `D-PF-n5` added as
three cells. `route.test.mjs` (+16/-4): the `P3-U5` box asserted verbatim and
through `refusalLines()`.

## 4. THE BAR

Every row is `node --test <files>` through `%TEMP%\pf-run.bat`, which sets the
pinned node on PATH, `TZ=America/New_York` and the worktree cwd. Counts are the
runner's own `pass` / `fail` lines. THE FULL BAR OF P3-PORT-FIX (author report
section 4) PLUS THE REVIEWER'S TWO EXTRA ROWS, all re-run on this tip.

| what | pass | fail | log |
|------|------|------|-----|
| lane cells: `p3-port-fix/programme-rule.test.mjs`, `owner-route.test.mjs`, `capture-codes.test.mjs` | 30 | 0 | `%TEMP%\pf2-lane.log` |
| cell (k) and the whole companion suite: `lanes/d/plan-edit/model.test.cjs` | 54 | 0 | `%TEMP%\pf2-planedit.log` |
| the full import corpus: `route`, `refusals`, `refusal-route`, `live-clock`, `page-bundle` | 35 | 0 | `%TEMP%\pf2-corpus.log` |
| `rebuild/m3/w6/test/local-source-admission.test.mjs` | 19 | 0 | `%TEMP%\pf2-w6admit.log` |
| `rebuild/lanes/d/import-retract/retract.test.mjs` | 13 | 0 | `%TEMP%\pf2-retract.log` |
| S6 children under `rebuild/m4/import`: `prepare`, `reading-replay`, `engine-provider`, `local-source-order`, `browser-parity`, `production-mapping`, `production-admission` | 90 | 0 | `%TEMP%\pf2-m4import.log` |
| S6 child `rebuild/m3/w6/test/local-source-consumer.test.mjs` | 7 | 0 | `%TEMP%\pf2-consumer.log` |
| TOTAL | 248 | 0 | |

THE REVIEWER'S TWO EXTRA ROWS, carried forward from P3-PORT-FIX:

| what | pass | fail | log |
|------|------|------|-----|
| `lanes/d/plan-edit/durable-host.test.mjs` + `browser-build.test.mjs` | 32 | 0 | `%TEMP%\pf2-planedit-extra.log` |
| `w6/test/local-source-commit` + `local-import` + `import-custody` | 42 | 0 | `%TEMP%\pf2-w6extra.log` |
| GRAND TOTAL, all nine rows | 322 | 0 | |

The lane row moves `25 -> 30`: `D-PF-f4`, `D-PF-f5` and the three `D-PF-n5`
cells. `D-PF-f1` gained assertions rather than a cell of its own, and `D-PF-n4`
gained the floor half inside the cell it already was. Every other row is the
same count as P3-PORT-FIX's, which is the regression statement: 243 was 243 and
248 is 243 plus the five new cells.

`w6/test/import-custody/engine-join.test.mjs` and
`recovery-stage/source-import.test.mjs` are NOT in this bar and are not
regressions: both refuse for a missing `EARNED_*_ROOT` env var and demand their
own runner, exactly as P3-PORT-FIX recorded.

## 5. THE R1 ARGUMENT

Written in full at the check itself (`source-admission.mjs:399-432`) and
repeated here so the PM has it without opening the file.

WHAT THE CHECK VERIFIES. Not that the athlete's recorded workout agrees with
the programme being admitted. It cannot, and it was never asked to. It verifies
PROVENANCE: that this capture was prescribed by a programme that actually
existed on this phone, so its slot count is a real prescription and not a
fabricated or corrupted layout. A capture is the evidence of what he performed,
and evidence has to come from somewhere.

WHY THE DOCUMENT IS THE RIGHT-HAND SIDE AFTER P3-PORT-FIX. The capture was
written by the gym card BEFORE the import, and the card prescribed from the
phone's own first-run DOCUMENT, so the document's set count for that lift IS
the number of slots it wrote. Until P3-PORT-FIX the file's count had to equal
the document's anyway, so `state` and the document were the same number and the
check could read either without anyone noticing which. P3-PORT-FIX made `state`
the FILE's, and reading `state` then asked the capture to match a programme
that did not exist when it was written, which is the second refusal on the
owner's own path (the old `D-PF-f1`, the PM's Q1). The document is the
programme that PRODUCED the capture. Nothing is taken on trust: admission has
already proved, in `programme()` above, that this same document is the same
SHAPE as the file (every split period's week, the lift ids, each lift's day and
muscle group, the count), so the two sides of this check are the same list of
lifts, and the document is not some unrelated object. The projected pre-import
session then rides into the admitted state AS RECORDED: nothing here rebases it,
and `D-PF-f1` and `D-PF-f4` both assert its slot count is still the document's.

WHAT STILL REFUSES.
1. A capture whose slot count for a lift matches NEITHER the document nor the
   file. No programme in the story wrote it, which is exactly the corruption
   this check exists for. Executed: `D-PF-f5`, a capture of seven slots for
   `db-bench` where the document says three and the file says two.
2. A lift the DOCUMENT does not carry. `documentSets.get(id)` is `undefined`
   and no integer equals it, so the capture refuses. Because the map is filled
   before any of `programme()`'s own comparisons, this can only arise when
   `programme()` has already refused for its own reason, and that issue stands
   in the list beside this one.
3. Everything the other three inner checks refused, unchanged:
   `capture_producer` (an unknown rule profile), `capture_lift` (a slot naming a
   lift the ADMITTED state does not carry exactly once - deliberately still
   `state`, because that is a different fault) and `capture_membership` (the
   engine's own membership reader disagreeing about the day's pool or order).

## 6. STOP

NONE. `D-PF-f4` PASSED on the first run of the changed product.

The morning after the import, on the page the athlete actually opens
(`Entry.boot` at `liveAt(T+24h)` over the same IndexedDB, the technique cell (a)
and `D-PRR-2` use), with a pre-import Earned workout recorded under the
document and a file whose per-lift counts differ:

* `next.booted.workout.gym.read()` returns `phase: 'ready'`;
* its `code` is NOT `ENGINE_CAPTURE_SESSION_INVALID`, asserted by name;
* its `total` is the FILE's set count for that day (`sumSets(FILE, 'L')`), and
  the cell asserts the file and the document DISAGREE on it, so the assertion
  is not vacuous;
* `gym.start()` returns `ok: true`, so the start is not refused;
* the pre-import session is in `workout_facts` with its OWN slot count, the
  document's, asserted to differ from the file's.

Nothing was widened to get there. The only expression that changed in that
whole path is the right-hand side of the one comparison the PM ruled on.

## 7. THE CONSTRUCTOR BOUNDS FOUND AND APPLIED (R3)

`rebuild/m4/workout/athlete-state.cjs`, `checkExercise` at `:118-135` and the
predicates it uses, read line by line:

| member | the constructor's rule | cite | applied |
|--------|------------------------|------|---------|
| presence | every member of `REQUIRED_EXERCISE` present, and NO other key | `:119` `closed(raw, REQUIRED_EXERCISE, ...)`, `:67` | yes |
| `sets` | `positiveInt`: `Number.isSafeInteger(x) && x > 0` | `:126`, `:95` | yes |
| `hi` | `positiveInt`, the same predicate | `:127`, `:95` | yes |
| `inc` | `typeof x === 'number' && Number.isFinite(x) && x > 0` | `:129` | yes |
| `steps` | a non-empty array, every element a finite number `> 0`, strictly ascending | `:130-132` | yes |
| `id` `n` `mg` | non-empty strings; `id` unique | `:121-124` | NO, see below |
| `day` | `'U'` or `'L'` | `:125` | NO, see below |
| `head` `secondary` | NOTHING. They are not in `REQUIRED_EXERCISE` at all | `:67` | left unbounded |
| `priority_muscles` | validated on the SETUP document, not per exercise (`:243-245`) | | left unbounded |
| any ceiling | THERE IS NONE, on any member | | not invented |

`id`, `n`, `mg` and `day` are not in the ruling's four field names and are
already handled: `id` is proved by `exercise_id`, `day` and `mg` are PROVED
members of the comparison (`fields`), and `n` is neither compared nor projected.
Applying the constructor to them would raise a refusal under a field name the
closed vocabulary does not carry, so they are left where P3-PORT-FIX put them.

`head` and `secondary` STAY RETAINED AND UNBOUNDED, and this is stated rather
than passed over: the constructor sets no bound on them because it does not
carry them, so there is no bound of the document's to apply. The ruling names
four fields and this build bounds exactly those four.

HOW THE BOUND IS APPLIED, and why it is not a copy. The ticket says to import a
shared helper rather than copy numbers. `athlete-state.cjs` exports
`createCleanInitState`, `REQUIRED_EXERCISE` and the rest, but NOT `checkExercise`
and NOT `positiveInt`, and the product diff may not move that file. So the build
asks the CONSTRUCTOR ITSELF: for each admitted lift and each of the four
members, the phone's own already-valid setup document is rebuilt with exactly
that one member of that one lift replaced by the FILE's value, and
`createCleanInitState` is run over it. If it throws, admission refuses with
`{field, exercise_id}`. Nothing is restated, nothing is copied, and there is no
number in `source-admission.mjs` to drift: the day `athlete-state.cjs` changes
its bounds, admission changes with it, and `D-PF-n4` and `D-PF-n5` are what
would catch a change nobody meant.

The probe is ATTRIBUTABLE, which is the property that makes a catch-all `catch`
honest here: the same document, unmodified, already built a state successfully
at the head of `programme()` (`:198`), so the only thing that can have made this
one throw is the one substituted value. Cost: four extra clean-init constructions
per admitted lift, on a pure constructor, once per import.

## 8. THE CELLS, AND THE POSITIVE SIDE

| cell | file | what it pins |
|------|------|--------------|
| `D-PF-f1` | `capture-codes.test.mjs` | the owner's own shape ADMITS, and the pre-import session is in the record with the DOCUMENT's slot count |
| `D-PF-f2` | same | a file whose set counts AGREE still admits on a phone with a recorded workout: the side that already worked was not widened |
| `D-PF-f3` | same | the same file and answers admit with NO recorded workout, so the two paths give the same answer |
| `D-PF-f4` | same | THE NEXT MORNING on the booted page: ready, not `ENGINE_CAPTURE_SESSION_INVALID`, the FILE's set count, start accepted |
| `D-PF-f5` | same | a capture matching NEITHER side refuses `capture_sets` by name, and the screen renders the FIELD's sentence |
| `P3-U5` | `import/test/route.test.mjs` | the `setup_document` sentence, verbatim and through `refusalLines()`, on the unenrolled walk |
| `D-PF-n4` | `programme-rule.test.mjs` | `sets: 0` REFUSED `{field:'sets', exercise_id:'db-bench'}`; `sets: 40` still ADMITTED, and the cell says why |
| `D-PF-n5` x3 | same | `hi`, `inc` and `steps` each refused under their own field name |
| `PF-a` | same, UNCHANGED | THE POSITIVE CELL THE TICKET ASKS FOR: a file with in-bound varied per-lift `sets`, `hi`, `inc` and `steps` still ADMITS, F4 is retained, the admitted state carries the FILE's numbers and the programme digest is recomputed over them |

`PF-a` is referenced rather than duplicated, exactly as the ticket says. It is
the cell that would go red if the R3 bound were too tight, because every number
`variedProgramme` writes is in bounds and different from the document's.

`D-PF-f5`'s stray capture is SEVEN slots for `db-bench`: the document says
three, the file says two, and the cell asserts the stray equals neither before
it does anything else, so it cannot silently become a duplicate of `f1`.

## 9. THE U+2013 / U+2014 SCAN

Run over all five changed files with the pinned node:

    rebuild/m3/w6/local/source-admission.mjs 0
    rebuild/m3/w7-preview/import/import-screen.mjs 0
    rebuild/lanes/d/p3-port-fix/capture-codes.test.mjs 0
    rebuild/lanes/d/p3-port-fix/programme-rule.test.mjs 0
    rebuild/m3/w7-preview/import/test/route.test.mjs 0
    TOTAL DASHES 0

Both new COPY sentences are the PM's words character for character, and
`D-PF-f5` and `P3-U5` both assert the rendered box carries no en dash, no em
dash and no digit, so a dash cannot arrive later without a cell going red.

## 10. DEVIATIONS FROM THE TICKET, each with its reason

1. **THE DOCUMENT'S SET COUNT TRAVELS AS AN OUT PARAMETER, not as a member of
   the returned basis.** The obvious spelling would have been to return the
   document's counts alongside the programme basis. I did not, because that
   object is the input to the programme digest at `:325`
   (`digest(..., 'earned/local-source-programme/v1', replayed.programmeBasis)`),
   and a new member would change a digest that binds WHAT WAS ADMITTED on every
   file, including ones this ticket does not touch. A `Map` filled by the callee
   keeps the basis byte-identical, which `PF-a` proves by recomputing the digest
   from the admitted state. If the reviewer prefers a second return value
   (`{basis, documentSets}`) it is the same information and I have no attachment
   to the spelling; what I will not do is put it in the digested object.
2. **`D-PF-n5` is three cells the ticket did not ask for.** The bar names only
   `sets`. The ruling adds FOUR field names to the closed vocabulary, and a
   vocabulary member with no cell is a declaration, not a fact. They are cheap
   (one `refuses()` call each) and each violation is one `athlete-state.cjs`
   itself refuses, so none of them invents a rule.
3. **`D-PF-f4` imports on the day the workout was recorded, not the day after.**
   The module's `IMPORT_DAY` is a Saturday and the day after it is a Sunday,
   which this week's split calls REST, so "the next morning" would have had no
   card to open and the cell would have proved nothing. `f4` therefore records
   on the Friday the week calls U, imports that evening, and reads the Saturday
   the week calls L. `f1`, `f2`, `f3` and `f5` keep the original calendar
   untouched. `2026-09-20` was added to the producer mapping's day list for the
   same reason the other ten are there: a day the mapping does not name refuses
   `SOURCE_ENGINE_CONTEXT_UNPROVEN` rather than passing quietly.
4. **`D-PF-f4` reads the pre-import session out of the controller's own view,
   not off the booted page.** `workout_facts` is the record admission committed,
   which is what "present in history as recorded" means at the point the ruling
   makes it; the booted page's own card is read for the OTHER half of the
   assertion (ready, not blocked, the file's count, start accepted). A
   page-level history reader would be a better witness and I could not find one
   that does not go through the gym card.
5. **`D-PF-f1`'s copy block moved to `D-PF-f5`.** The ticket says so, and the
   report records where it went: `f1` no longer refuses, so there is no refusal
   on it to render.
6. **The "comment table" of the closed vocabulary did not exist in
   `source-admission.mjs`** (only in spec 3.1, and two comments pointing at it).
   I wrote the table into the comment above `detailOf` rather than inventing a
   new home for it, and left `detailOf` itself byte unchanged as the ticket
   requires.

## 11. OPEN QUESTIONS FOR THE PM

1. **THE WIDENING R1 ACCEPTS, stated rather than waved past.** Before this
   change a capture had to agree with the ADMITTED state; now it has to agree
   with the DOCUMENT. On a phone that never imports, the two are the same object
   and nothing moved. On a phone that imports, the check no longer says anything
   about the file's set counts at all: a file may carry any in-bound count for a
   lift the athlete already trained, and the recorded session keeps its own. That
   is what the ruling asks for and `D-PF-f4` shows the engine is content with it
   the next morning, on one week's shape. What no cell here can show is a phone
   with MANY pre-import sessions across several weeks; the lane's fixture records
   one. The real retry is still the measurement.
2. **THERE IS NO CEILING ON A RETAINED NUMBER, and the constructor has none to
   lend.** `sets: 40` still admits, and `D-PF-n4` asserts it does and says why.
   If the PM wants a ceiling it is a NEW rule, not a bound of the document's, and
   it needs its own number, its own argument and its own cells. I did not invent
   one. The gym card at forty sets is not a dead end the way `sets: 0` was, but
   it is not a training day either.
3. **`head`, `secondary` and `priority_muscles` remain retained and unbounded**
   (section 7). The engine reads `head` as a volume bucket
   (`engine/volume.cjs:35`) with `mg` as its proved fallback, and nothing reads
   `secondary`. If the PM wants those bounded it is the same kind of new rule as
   (2): the constructor does not carry them.
4. **The two sentences are now three, and a fourth field could want a fourth.**
   `refusalLines()` is keyed on the field with a fallback to the code, so adding
   one is one COPY line and one map entry. The fields that currently render the
   training-week sentence and might not deserve it: `capture_producer`,
   `capture_lift` and `capture_membership`, all three of which are about his own
   recorded workout and not about his training week, and the four R3 fields,
   which are about a number in the file. None of them is on the owner's path
   today and I did not invent copy for any of them.
5. **`DECISIONS:509` is not in this worktree's `rebuild/DECISIONS.md`**, which
   stands at 507 lines; the line is on the PM tip
   (`origin/rebuild/t2-client-core`) and was read from there. Nothing in this
   branch touches `DECISIONS.md`, as the lockdown numstat shows.
6. **Carried forward, unchanged and still open**: P3-PORT-FIX open question 3
   (the multi-period judgement, only the real bundle can settle it) and open
   question 4 / DECISIONS:472 BLOCKER 2 (no production producer mapping, so
   every admitting cell here still qualifies through a TEST-ONLY mapping except
   the route-level ones). A green bar proves the RULE on the real path; it is
   not a promise that the owner's real bundle will qualify.
