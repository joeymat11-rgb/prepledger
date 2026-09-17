# P3-PORT-FIX-SPEC: independent review R1

Lane D, independent reviewer, Opus high. I did not write the spec. Every claim
below was measured in the worktree %TEMP%\earned-portfix at c7990c87 (spec
commit) over the product tree at 3d002174. Subject:
`rebuild/lanes/d/P3-PORT-FIX-SPEC.md`, 835 lines.

## VERDICT

**REJECT.** The new rule stops proving exactly the fields that a second,
shipped, pinned, already-proven guard needs proved
(`rebuild/m4/workout/plan-edit-model.cjs:51-52,:88,:90` proves the ADMITTED
IMPORT's state against the first-run setup document over `split`,
`priority_muscles`, the setup tag snapshot and `P2_ROW =
['id','day','mg','sets','hi','inc','steps']`), so on the owner's own bundle the
import would admit and the Edit My Week companion would then refuse
`PLAN_EDIT_ORIGIN_UNPROVEN`; the spec's section 6 "NOT CHANGED" is false as
written and the file is in neither the touched nor the must-not-touch list.

Section 2's answer about the Train screen is TRUE; the rule and the cell plan
are the parts that need another round.

---

## BLOCKING FINDINGS

### 1. BLOCKING. The Edit My Week companion refuses on exactly the bundle this fix is built to admit.

`rebuild/m4/workout/plan-edit-model.cjs` is pinned in `packages/S6.json:803`.
Its constructor, verbatim:

    22| const P2_ROW = ['id','day','mg','sets','hi','inc','steps'];
    49|  C.exact(setup, ['athlete_label','split','exercises','priority_muscles']);
    50|  if (!Array.isArray(setup.exercises) || !setup.exercises.length || setup.exercises.length !== base.exercises.length ||
    51|      base.athlete_label !== setup.athlete_label || !equal(base.split, [setup.split]) ||
    52|      !equal(base.priority_muscles || [], setup.priority_muscles)) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
    88|    } else if (!equal(Object.fromEntries(P2_ROW.map(k => [k, e[k]])), Object.fromEntries(P2_ROW.map(k => [k, row[k]])))
    90|    if (!firstRun) { if (!equal({ head: e.head ?? null, secondary: e.secondary ?? [] }, tags)) tagsOk = false; }

`base` is `basisState`. After an admitted import it is the FILE's replayed
state: `rebuild/m3/w6/host/plan-edit-host.mjs:69-75`,
`const source = Model.importPresentIn(generation) ? 'local-source' : 'first-run'`
then `createPlanEditProjector({..., basisSource:source, admittedBasisOf:g =>
admittedLocalSourceBasis(g,{athleteLabel, namespace})})`. `setup` is
`origin.payload.setup`, the phone's first-run document.

The module says in its own words why it may do this
(`plan-edit-model.cjs:62-66`):

    62|     LOCAL-SOURCE (P2). local-source-basis.mjs admittedLocalSourceState -> the
    63|     admitted import's own replayed state. Its correspondence predicate is not
    64|     ours to invent: source-admission.mjs `programme()` is what admission itself
    65|     proved, over id/day/mg/sets/hi/inc/steps and the setup tag snapshot, MATCHED
    66|     BY ID and NOT over `n` ...

That is the spec's subject, named by field list. Narrowing `programme()` to
`{split.map, id, day, mg}` invalidates the stated premise of this guard.

FAILURE SCENARIO, on the spec's OWN cell (a) fixture. The bundle is sealed with
`split[0].from` at least 60 days earlier than the setup day, at least three
lifts with unequal `sets`, three distinct `hi`, and `inc`, `steps`, `head`,
`secondary` and `priority_muscles` all differing from the document (spec 5 (a)
step 3). Admission now ADMITS it. The athlete then opens Edit My Week:

- `equal(base.split, [setup.split])` is false (the file's `from` is 60 days
  earlier, and cell (d)'s two-period variant makes the array length differ too)
  -> `PLAN_EDIT_ORIGIN_UNPROVEN`;
- `equal(base.priority_muscles || [], setup.priority_muscles)` is false, and
  the spec makes it MORE false on purpose: 1.3 moves the returned basis'
  `priority_muscles` from the setup op to `source.priority_muscles ?? []`;
- `P2_ROW` at `:88` is false on every lift whose `sets` or `hi` or `inc` or
  `steps` the spec now retains;
- `:90` is false on every lift whose `head`/`secondary` the spec now retains
  -> `PLAN_EDIT_TAG_BASIS_UNPROVEN`.

This is not caught by any cell in the spec's plan: cell (a) asserts the gym
card, never the companion. It is not caught by the existing corpus either,
because `lanes/d/plan-edit/model.test.cjs` (pinned, `S6.json:228`) builds its
local-source basis from a state that agrees with the document, so it stays
green while the real owner path breaks. The defect would first appear on the
owner's phone, after S7, on his own data.

WHAT THE NEXT ROUND MUST DO (not decided by me): either (i) add
`plan-edit-model.cjs` to FILES TOUCHED and state its new correspondence
predicate for the local-source branch in the same words as the new
`programme()` rule, with its own cells and its own red-first, and re-estimate;
or (ii) show by measurement that the companion is unreachable on the owner's
S7 phone, in which case say so and carry the fix as a named follow-on. Option
(i) is the honest one: `plan-edit-model.cjs` is pinned in the SAME package, so
it rides the same seal and costs no second merge.

### 2. BLOCKING. The 1.3 diff contradicts its own prose and drops `id` from the programme digest.

Today, `source-admission.mjs:150` projects the returned basis through the SAME
`fields` array the comparison used:

    150|  return {op_id:op.op_id,split:source.split,exercises:source.exercises.map(ex=>Object.fromEntries([...fields,'head','secondary'].filter(k=>Object.hasOwn(ex,k)).map(k=>[k,ex[k]]))),priority_muscles:op.payload.setup.priority_muscles};

with `fields=['id','day','mg','sets','hi','inc','steps']` (`:145`). The spec's
diff sets `const fields=['day','mg'];` and leaves the return's map elided as
`source.exercises.map(...)`. A build that writes the diff literally produces a
programme digest (`:325`,
`digest(...,'earned/local-source-programme/v1',replayed.programmeBasis)`)
carrying only `day`, `mg`, `head`, `secondary` per lift.

The spec's own prose immediately after the diff says the opposite ("the
`fields` list the returned `exercises` are projected through must KEEP `sets`,
`hi`, `inc` and `steps`"), so the normative block and the normative prose
disagree on a digest-binding line. That alone needs fixing.

Worse, BOTH readings drop `id`. The prose enumerates `sets`, `hi`, `inc`,
`steps`, `head`, `secondary` and never `id`. `id` is in today's `fields` and
therefore in today's digest; under either reading of the spec the digest stops
naming which lift each row is, and becomes positional. That is a real
weakening of the record of what was admitted, introduced by accident, and it is
the exact thing the spec's own sentence "the record of what was admitted does
not" narrow was written to prevent. The fix is one line (a separate
`PROJECTED_FIELDS` constant that keeps `id` and the retained numbers while
`fields` narrows to the compared ones), but it must be in the spec, not left to
the build.

### 3. BLOCKING. The corpus change is larger than 4.3 declares, and one pinned suite is not named at all.

`STRANGER_SETUP` (`import/test/support.mjs:77-79`) varies `athlete_label` and
`exercises[0].sets = 4`. `athlete_label` is not compared by `programme()` in
either rule (DECISIONS:472 (a)), so under the new rule the stranger bundle
ADMITS. The spec sees this in cell (e) and says the fixture "must vary the MAP
instead". Measured, `git grep -n STRANGER_SETUP -- rebuild` returns four
suites that seal a bundle from it and assert a refusal:

    rebuild/m3/w7-preview/import/test/refusals.test.mjs:20
    rebuild/m3/w7-preview/import/test/refusal-route.test.mjs:23
    rebuild/m3/w7-preview/import/test/route.test.mjs:264
    rebuild/lanes/d/import-retract/retract.test.mjs:28

Three consequences the spec does not carry:

(a) `rebuild/lanes/d/import-retract/retract.test.mjs` is PINNED
(`packages/S6.json:183`, child `d-import-retract` at `:1282-1286`) and appears
in neither the TOUCHED nor the MUST-NOT-TOUCH list of section 4. It seals a
STRANGER bundle to drive a refused-then-retracted path. Under the new rule that
bundle admits and the retract path is no longer exercised.

(b) 4.3 marks `route.test.mjs`, `refusals.test.mjs` and `refusal-route.test.mjs`
as "ADDED cells" only. They are CHANGED files: existing refusal cells in them
go red for a reason that is the rule change, not a bug. Say so, and name the
cells, or the build report will look like a surprise.

(c) 7.1.1 rules "ADD beside `firstRun()`, never replace it" and cell (e) rules
"the cell must vary the MAP instead", which for `STRANGER_SETUP` is a REPLACE.
The two instructions collide on the one fixture that four suites share. Pick
one in the spec: either mutate `STRANGER_SETUP` in place (and accept that a
guard fixture moved, stated), or add `STRANGER_WEEK_SETUP` beside it and
rewrite each of the four call sites by name.

These are refusal-guard cells, which is the category where "rewritten to the
new rule" most needs a reviewer to see the before and after. 7.2's 2.5-day
build estimate does not look like it has costed four suites plus a pinned lane
suite; with finding 1 added it is understated.

---

## NOTES

### 4. NOTE. 1.4's "`priority_muscles`. Read by NOTHING" is false.

Spec 1.4: "Read by NOTHING: ... a tree-wide `git grep priority_muscles` finds
no reader in `rebuild/engine`, `rebuild/coach`, `rebuild/m3/w7-preview/today`
or `rebuild/m4` outside the constructor's own validation
(`athlete-state.cjs:243-245`) and this comparison."

Measured, `git grep -n priority_muscles -- rebuild/engine rebuild/coach
rebuild/m4 rebuild/m3` returns, inside `rebuild/m4`:

    rebuild/m4/workout/plan-edit-model.cjs:52:      !equal(base.priority_muscles || [], setup.priority_muscles)) fail('PLAN_EDIT_ORIGIN_UNPROVEN');

That is a READER, and it is a GUARD, not an inert carry. The claim "Proving an
inert field can only refuse; it can never protect anything" is therefore not
established for this field. This is the evidence behind finding 1 and is listed
separately because the spec presents it as a measured grep result.

### 5. NOTE. 1.4's cite for `secondary` is wrong, and the true answer is stronger.

Spec 1.4 says `head` and `secondary` are "Read by `engine/volume.cjs:35` ...
and by the lend table at `:41` for the half-credit convention". Measured,
`volume.cjs:35` is `const volBucket = (ex) => (ex && (ex.head || ex.mg)) ||
null;` (correct: it reads `head`). `volume.cjs:41` reads
`const lend = INDIRECT[e.id]`, a module constant keyed by LIFT ID, not the
exercise's `secondary` member. `git grep -n secondary -- rebuild/engine
rebuild/coach` finds no engine reader of `ex.secondary` at all (only
`engine/sleep.cjs:723`, a prose string, and a coach test). So `secondary` is
inert in the engine, which argues the spec's conclusion more strongly than the
spec's own cite does. Fix the cite; the retention stands. Note that
`plan-edit-model.cjs:90` does read both, which is finding 1 again.

### 6. NOTE. Three cites are off, and one file is cited with no path.

- 1.1: "`createCleanInitState` stores it as a PERIOD ARRAY,
  `athlete-state.cjs:234`". Line 234 is the header COMMENT
  (`// setup: {athlete_label, split:{from,map}, ...}`). The array wrap is
  `rebuild/m4/workout/athlete-state.cjs:331`, `split: [split],`. The claim is
  true; the line is not.
- 2.2 and 5 (e): "`local-source-basis.mjs:55` returns null on the label".
  `:55` is `return clone(state);`. The label guard is `:54`,
  `if(athleteLabel&&state.athlete_label!==athleteLabel)return null;`.
- 2.1 step 2: "reads at `:179`". `applyRead` is at
  `source-admission.mjs:178`; `:179` is the F1 family push.
- `athlete-state.cjs` and `workout-host.mjs` are cited bare throughout. Their
  real paths are `rebuild/m4/workout/athlete-state.cjs` and
  `rebuild/m3/w6/host/workout-host.mjs`; a build reader will search for them
  under `today/`. Everything else in sections 1 to 3 that I checked is right
  (list under VERIFIED below).

### 7. NOTE. The new `split` check is not shape-closed, where the old one was.

`encode(source.split)!==encode(scratch.split)` compared the whole array against
`checkSplit`'s normalised output, so a period entry carrying a third member
refused. The spec's replacement checks only `p.map` and `p.from`. An entry
carrying extra members now admits and lands in `state.split` and in the digest.
`plan.cjs:11-22` `dayType` reads only `from` and `map`, so no engine harm, and
`encode` sorts object keys (`local-source-profile.cjs:31`) so key ORDER is not
a hazard either way. Worth one sentence in 1.2 saying the shape is deliberately
not closed, or a `closed(p,['from','map'])` in the rule.

### 8. NOTE. The detail spread can push `field: undefined` to the screen.

1.3's call site is `catch(e){issue(e.code,null,{field:e.field,exercise_id:e.exercise_id});}`.
An error thrown inside `programme()` that is not one of the named `fail`s (a
`CLEAN_INIT_*` from `createCleanInitState`, or a TypeError) carries no `field`,
so the issue becomes `{code, field:undefined, exercise_id:undefined}` and 3.3's
detail builder must not print it. 3.3's prose says "for each issue carrying
one", which covers it, but the diff does not. One guard in the diff, please.

### 9. NOTE. "taken once per replay" is a build requirement, not a measured fact.

1.2 B-A: "`currentDay()` is the controller's clock ... taken once per replay".
Measured, `currentDay=()=>typeof asOf==='function'?asOf():asOf`
(`source-admission.mjs:92`) and the shipped page passes a LIVE function:
`import-screen.mjs:343`, `asOf: () => day()`. `replay()` calls it separately at
`:177`, `:189` and elsewhere, so today it is read many times per replay and a
local-midnight rollover mid-replay would be seen differently by different
bounds. The spec's own diff DOES hoist one read for `programme()`
(`{today:currentDay()}`), which is the right shape; the prose should claim what
the diff does rather than a property of the existing code. Otherwise the clock
analysis is correct: this is the device's local day, no UTC day and no
file-supplied offset, and because the bound is "not after today" it can only
loosen as the clock advances, so nothing admitted at `T` can dead-end at `T+1`.

---

## WHAT I TRIED TO BREAK AND COULD NOT

### The rule, case by case (review item 2)

I tried to find a wrong athlete's or wrong programme's history that the old
equality caught and the new rule admits, beyond the widening 1.4 already
declares. I could not find one.

| case | old | new | why |
|------|-----|-----|-----|
| different split map | refuses | refuses | P-A, every period entry |
| subset of lifts | refuses | refuses | count check, `field:'exercises'` |
| extra lifts | refuses | refuses | count check |
| same count, one id swapped | refuses | refuses | `matches.length!==1` per phone id |
| a lift id duplicated in the file | refuses | refuses | `matches.length` is 2 |
| same lifts, one on a different day | refuses | refuses | P-C `day` |
| same lifts, one under a different mg | refuses | refuses | P-C `mg` |
| everything equal but `from` is tomorrow | refuses | refuses | B-A |
| two periods, one dated tomorrow | refuses | refuses | B-A is per period |
| no period in force today | refuses | refuses | B-B |
| a second first-run setup op | refuses | refuses | `:142`, unchanged |

P-B is sound as code: count equality plus "exactly one match per phone id"
implies equal id multisets, and the phone side cannot itself hold duplicates
(`setup-model.mjs:606` `slugOf(row.n, taken)`).

The genuinely widened set is the one 1.4 and 7.1.2 name: `sets`, `hi`, `inc`,
`steps`, `head`, `secondary`, `priority_muscles`, an earlier `split.from`, and
a period array of length > 1. I agree with retaining each of the seven on the
engine-reader argument, subject to finding 1 (which is not an engine reader but
a companion guard) and finding 4. One point in the spec's favour it does not
make: because P-A proves EVERY period's map equal, a multi-period file is
semantically inert past "is one in force", so `dayType`'s
last-entry-wins walk cannot answer a letter the phone never named whichever
period it lands on. That is worth stating, because it is the strongest answer
to risk 7.1.3.

The F4 evidence rule (`replay-registry.cjs:58-63`, quoted verbatim and
correctly in 1.5) still holds under all three of its clauses: the setup
document is still the only thing the file is proved against (P-A, P-B and P-C
all read `scratch` and nothing else), it is still RETAINED at `:195`, and
`:142` still refuses zero or two. The proposed restatement is accurate to the
new rule. No change to F1, F2, F3, F5, F6, F7 or F8 dispositions is implied.

### Section 2: the answer is TRUE (review item 3)

I traced it myself, without the spec's list. Every step holds:

- `source-admission.mjs:164` `let state=prep.candidateState()` is the FILE's
  migrated state; `programme()` at `:171` only reads it.
- `:327` builds `view.state` from `replayed.state`; `:364` commits it under
  `derived.localSource`.
- `local-source-basis.mjs:46` `const state=view.state;`, `:54` the label guard,
  `:55` `return clone(state);`.
- `today-app.cjs:2482-2488`: `.then((imported) => { importAdmitted = !!imported;
  return imported || setup.athleteState(); })`. The import WINS; the clean init
  is the fallback. The file's own comment at `:2476` says so.
- `today-model.cjs:374-376` `adoptBasis(state)` sets `basis = clone(state)`,
  and `:181-183` `stateFromOps()` returns `foodProjectionOf().state`, which
  starts from `clone(basis)`. So the file's state is what every model read sees.
- `today-app.cjs:2500-2501` rebases the gym card through `workout.gym.rebase()`,
  and `gym-model.mjs:104` states that `hostForDay` rereads
  `model.stateFromOps()` at call time.
- The engine then reads that state and nothing else: `plan.cjs:11-22` walks
  `s.split` and lets the LAST entry with `from <= iso` name the day;
  `today.cjs:82-86`/`:89-95` build the pool from `s.exercises`; `:111`
  `new Array(Math.max(1, e.sets || 1))`; `:128-129` slice and pad from `e.sets`
  and `e.hi`; `:182` the arming line counts `e.sets`;
  `progression.cjs` prices from `e.inc` and `e.steps`.

So: the morning after an admitted import the Train screen shows the FILE's
per-lift sets, rep target, increment and ladder, on the file's split map, and
the phone's setup document supplies nothing to it. The spec's answer is TRUE
and the owner's :507 expectation is met by shipped machinery.

I tried to find the fork the spec says does not exist. I could not. There is
one seam and it is a boolean: `imported || setup.athleteState()`. There is no
merge, no per-field preference and no flag; a "the phone's setup governs
tomorrow" branch would be new code with a new law, and it is contrary to :507.
The spec is right to refuse to invent it, and right that what goes to the owner
is a confirmation sentence and not two buttons. The sentence proposed at 2.3 is
accurate to the machinery and carries no U+2013 or U+2014.

Two caveats on that TRUE, both of which the spec already names and both of
which stay true after finding 1 is fixed: the label precondition
(`local-source-basis.mjs:54`, a silent fallback to the setup document's single
numbers on a successful import) and the split-in-force precondition
(`rebuild/m3/w6/host/workout-host.mjs:39-41`, `:43-48`, whose reason line the
spec quotes correctly). Finding 1 adds a third that is NOT a caveat but a
defect: Edit My Week would refuse on the same morning.

### The cell plan (review item 4)

Cell (a)'s composition is right in the two places that matter, and it is the
part of the spec I would keep unchanged:

- It drives the phone's document through the REAL `setup-model.mjs document()`
  reducer and then ASSERTS the document's own shape before anything else
  (`split.from === <today>`, one distinct `sets`, one distinct `hi`). That is
  the fix for the brief's original mistake, and it is a real fix. Measured, the
  existing corpus does NOT do this: `import/test/support.mjs:112-115`
  `firstRun()` saves `SETUP`, which is `Journey.SETUP`
  (`rebuild/m3/w6/host/test/journey-fixture.cjs:15-22`), a hand-written literal
  whose `split.from` is `'2026-08-31'` and whose lifts carry `sets` 3, 2, 3 and
  `hi` 10, 12, 12. The shipped screen cannot write either
  (`setup-model.mjs:622-623` one global `sets` and one global `hi`, `:633`
  `split: { from: today, map }`). So the old ADMITS cells are green against a
  document the screen cannot produce, exactly as 5 (h) says, and naming
  D-PR-1 and D-PRR-2 as the two to rewrite is correct.
- The seal is real: `support.mjs:31` `export const PORT = path.join(REPO,
  'rebuild/m3/setup/port/port.cjs')`, spawned at `:90` with `--source` and
  `--out`. The route is the shipped page's Import route, not the controller.

What is missing or weaker than its name:

- (a) MISSING ASSERTION, and it is finding 1: open the Edit My Week companion
  on the admitted basis and assert it does not refuse. One line of the cell
  would have caught the whole of finding 1.
- (a) the "THE NEXT MORNING" assertion is written as "re-boot the page on the
  following local day". On a live clock that is a real wait, not a fixture
  step. Say how (the live-clock suite's own technique) or the build will quietly
  freeze a clock and the cell will stop being the row it claims to be.
- (i) row "local-midnight rollover" cites "the :451 bound". There is no `:451`
  in any file this spec touches; if this is `DECISIONS:451` say so, because a
  bare colon-number in this document means a line of source everywhere else.
- (j) RED-FIRST is correctly demanded and correctly qualified for cells that
  refuse under the OLD undifferentiated code.
- (i) THE ONE STUB is named honestly and in the right place: every admitting
  cell still qualifies through a TEST-ONLY producer mapping, DECISIONS:472
  BLOCKER 2 is not closed here, and a green bar is not a promise the owner's
  real retry qualifies. I confirmed the shipped screen binds
  `Production.createProductionProducerRegistry({hash: platform.hash})`
  (`import-screen.mjs:342`), so the gap is the execution row, not the wiring.

### Files touched and the pinned yes/no (review item 5)

Checked each myself with `findstr /n` over
`rebuild/lanes/b/tooling/packages/S6.json`. Every pin the spec claims is right:

    318:    "rebuild/m3/w6/local/source-admission.mjs"
    338:    "rebuild/m3/w6/test/local-source-admission.test.mjs"
    363:    "rebuild/m3/w7-preview/import/import-screen.mjs"
    378:    ".../import/test/live-clock.test.mjs"
    383:    ".../import/test/page-bundle.test.mjs"
    388:    ".../import/test/refusal-route.test.mjs"
    393:    ".../import/test/refusals.test.mjs"
    398:    ".../import/test/route.test.mjs"
    403:    ".../import/test/support.mjs"
    583:    "rebuild/m3/w7-preview/today/today-app.cjs"
    643:    "rebuild/m4/import/replay-core.cjs"
    983:    "rebuild/m4/import/replay-registry.cjs"

`local-source-basis.mjs` returns no match, so 4.2's "not pinned" is right.
`replay-core.cjs` is pinned at :643 and the spec's decision to name it with NO
CHANGE EXPECTED rather than invent an edit is the right call; risk 7.1.4 about
the S7 declaration is the right carry.

TWO PATHS MISSING FROM SECTION 4: `rebuild/m4/workout/plan-edit-model.cjs`
(pinned, `S6.json:803`, finding 1) and
`rebuild/lanes/d/import-retract/retract.test.mjs` (pinned, `S6.json:183`,
finding 3 (a)). `rebuild/lanes/d/plan-edit/model.test.cjs` (pinned,
`S6.json:228`) will need cells if finding 1 is answered by option (i).

### Laws, guards, identity, custody, retract, unseal (review item 6)

Nothing in the spec changes a law or a guard IN ORDER TO GO GREEN. The one
guard it changes, `programme()`, is the declared subject of the ticket and the
change is argued field by field. Section 6's four other claims check out in the
code:

- IDENTITY. `source-admission.mjs:298`
  `if(identityConfirmed!==true&&!existingSelection)fail('LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED');`
  is untouched, and `:137` `prefix_question` is word for word the string
  DECISIONS:472 (d) records. No identity guard is added or moved.
- CUSTODY AND RETRACT. `import-screen.mjs:92-93` `RETRACT_REASON` and `:375`
  `await retract(RETRACT_REASON.refused)` are untouched; the alphabet at
  `import-bundle.mjs:675` is cited correctly as the reason no value rides out.
  3.3's "what is NOT exposed" list is the right analysis: `field` is a literal
  from a closed table chosen by the code path, and `exercise_id` is always
  `ex.id` from `scratch`, the PHONE's own id, never read off the file.
- THE SIX-WORD UNSEAL. Untouched; nothing in the diff reaches
  `BUNDLE_AUTH_FAILED` or the sealed bundle.
- THE LEDGER. No ledger path appears anywhere in the spec. Every figure in
  every cell is declared synthetic. I read no private path while reviewing.

The only place the spec widens what the screen can print is 3.4's four capture
fields, where `capture_lift` and `capture_sets` name an id from
`state.exercises`, which after admission is the FILE's id list. The spec names
that widening itself and argues it. I accept the argument: by that point the
athlete is being told about his own recorded Earned workout.

Section 6's claim "Only F4's field list narrows, and only in `programme()`" is
the sentence finding 1 falsifies: the narrowing is observed outside
`programme()`, by `plan-edit-model.cjs`.

---

## WHAT I COULD NOT VERIFY

1. I did not RUN anything. No suite, no cell, no build. Every finding above is
   a read of the tree at 3d002174 plus `findstr` and `git grep` counts. In
   particular I did not re-measure 5 (h)'s "35 cells at the tip" or REVIEW-R1's
   "three surviving `:147` refusals", and I did not execute the failure
   scenario in finding 1. Finding 1 is a code reading of
   `plan-edit-model.cjs:50-52,:88,:90` against the fixture cell (a) specifies;
   the next round should execute it before accepting or dismissing it, and the
   cheapest execution is cell (a) plus one companion open.
2. Whether the Edit My Week SCREEN (part 2, not yet built) is on the owner's S7
   phone. `plan-edit-host.mjs` and `plan-edit-model.cjs` are shipped and pinned;
   whether an athlete can reach them on S7 is a packaging fact I did not
   measure, and it is what decides between option (i) and option (ii) of
   finding 1.
3. The 4.5-day estimate. I judged only that findings 1 and 3 are not inside it.
4. `replay-core.cjs`. I took the spec's NO CHANGE EXPECTED on the argument
   given (it is upstream of every touched line) and did not audit the file.
5. The owner's real bundle. Nothing about it is knowable here, including
   whether it carries two split maps (risk 7.1.3). I agree that OPT-3's detail
   is what will answer it and that shipping OPT-3 with OPT-2 is the reason to
   accept that uncertainty rather than pre-empt it.

Reviewer: lane D, Opus high, independent, told to disagree. Read only; no
product file and no test file was modified by this review.
