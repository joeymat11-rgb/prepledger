# EW2-SPEC REVIEW R3, INDEPENDENT

Reviewer: cowork (Earned lane hand), Opus, 2026-09-19. Reviewed file
`rebuild/lanes/d2/EW2-SPEC.md` (1613 lines) at branch `rebuild/d2-ew2-spec` head
`90441ae3`, against review R1 (`EW2-SPEC-REVIEW-R1.md` at `0695493`), review R2
(`EW2-SPEC-REVIEW-R2.md` at `1a73d8f`), the v2 to v3 diff (`63710d2..90441ae3`, 893 insertions and
215 deletions in the spec) and the PM's rulings `E-R1` to `E-R11` at `DECISIONS:544`. The author is
gone; this review commits one file and moves no other byte.

Method: the spec, the ledger, the code and the two other branches were read in the PM's cloud farm
mirror. The chain tip is now `e0e2ac75`; `git diff 00e7a0d0..e0e2ac75` over the whole tree is
`rebuild/DECISIONS.md`, `rebuild/lanes/STATUS.md` and one new PM ruling file ONLY, so the spec's
stated re-measurement head `00e7a0d0` and today's tip agree line for line over every product file
cited here and no cite is excused by drift. `rebuild/c-today-split` was synced and read at
`9a3362b6`, where TODAY-SPLIT-SPEC **v2 is now pushed** (1339 lines) and where the spec believed
only v1 stood. `rebuild/m4/spec/acceptance-s8-real-shape.json` was not needed by any finding below
and was not opened. No private, ledger, soak or history path was opened on either machine. No
credential appears here. Zero U+2013 and zero U+2014 in this file.

## VERDICT: REJECT

Six BLOCKING findings. **None of them is a repeat of R1 or of R2.** Every one of R2's six blocking
findings is answered, and four of them are answered completely and well; the `basisState` pinning of
3.4.3 in particular I tried hard to break and could not, because the raw value the spec names is
byte-identical to the one the projector proves against (section 2, B2). R2's nine notes are all
closed, and I re-derived each from the tree rather than from either document.

The REJECT is for what the fix round left standing and for what it newly asserts:

- `E-R1` was carried out for ONE released file. The editor's own surface, the Machine settings door
  and the tag shim all still call writers or import sealed trees, and the spec makes the
  WRITER-FENCE part of its own bar at 6.8 (B1);
- the companion refuses the FIRST READ on every installation without the F2 package, and refuses
  the first-run basis outright, so 3.5's blocked list, 7.1 and 9.3's start column are wrong by most
  of the suite (B2);
- the fold `E-R4` rules cannot be constructed from the two collaborators 4.3 names, for the same
  measured reason (B3);
- the factory's `clock` argument is wrong twice over, and the second way kills the one refusal the
  companion insists on saying (B4);
- the `capture_lift` row of the no-disjunct rewrite does not say what it replaces, and the natural
  reading keeps the refusal it exists to remove (B5);
- the adoption hunk costs three durable reads per adoption, and the spec's own STOP 9 fires at more
  than one (B6).

B1, B2 and B3 are the serious three. B2 and B3 are one measured fact reaching two lanes.

---

## 1. BLOCKING

### B1. `E-R1` was applied to one file. The editor's own surface still calls writers, and 6.8 makes that this spec's bar

3.4.1 correctly reduces `edit-week-basis.mjs` to a pure function, and 3.3 line 2b says the sealed
side does every durable act, so that "the WRITER-FENCE of `:542` (C) passes by construction rather
than by inspection". 6.8 then makes a green fence part of the bar, naming
`edit-week-basis.mjs`, `edit-week-model.mjs`, `edit-week-view.mjs`, `edit-week-check.mjs` and
`edit-week-tags.mjs`.

Measured, three parts of the spec fail that fence as written, and two of them are sections v3 did
not re-open.

**(i) 2.1's page surface.** The table at 2.1 is kept from v1 and still reads "The page gets exactly
five methods and nothing else": `host.read`, `host.review`, `host.save`, `host.cancel`,
`host.close`. 7.1 gives `edit-week-model.mjs`, a RELEASED file, "the pure state machine over the
five host replies", and section 5's EW-12 is "one deliberate save yields one durable edit intent".
`host.save` (`plan-edit-host.mjs:190`) is a durable write and `host.read` (`:162`) enqueues
`readVerified` (`:145`) which calls `lane.reopen()` (`:148`). `DECISIONS:543` rules, verbatim, "no
released file calls, imports or holds a writer", and the fence "fails when any file outside the
sealed inventory calls a writer, opens IndexedDB or imports a host". A released state machine
holding a host handle is exactly that.

This is not my inference from the ledger alone. TODAY-SPLIT-SPEC v2, now pushed at
`rebuild/c-today-split@9a3362b6`, writes the fence out in section E.3 and lists the entry points BY
MEMBER NAME IN CODE POSITION: `.save`, `.reopen`, `.close` on a host identifier, `.latest` on a
lane identifier, `.all`, `.refresh`, `.rebase`, `.adoptBasis`, `.admittedLocalSourceState`,
`.forDate`. Its E.2 says a RELEASED file is fenced, "that is now the point".

**(ii) The Machine settings door.** 2.2 M1 has the page call
`machineSettings.latest(exercise_id)` and M2 `machineSettings.save(machineFromDraft(...))`. Both
member names are on that list. 3.3 line 4 says the door "calls the existing exported
`createMachineSettingsHost` (`:63`) from the new entry", which is safe because the entry is sealed,
but the two calls above are made by the released view, and `createMachineSettingsHost` is itself on
the fence's constructor list.

**(iii) The tag shim.** 3.5 consequence 2 specifies `edit-week-tags.mjs` as a RELEASED file that
"`createRequire`s the product module" at `rebuild/m4/workout/setup-tags.cjs`, and then says in its
own words that it "stays on the released side under the WRITER-FENCE". TODAY-SPLIT E.3's module
edges fail "any import or require of ... `rebuild/m4/**`", and its closed list of what a released
view MAY import (`plain-copy.cjs`, `food-model.cjs`, `sleep-model.cjs`, `problem-report.cjs`,
`today-model.cjs`, `machine-settings-view.mjs`, `checkin-model.mjs`, `design.cjs`,
`split-kinds.mjs`, `exercise-catalogue.mjs`, `starter-week.mjs`, its one sealed partner, and each
other) does not contain it. `FENCE-VIEW-IMPORT`.

I hold none of the split spec's own wording against this author: v2 of it was pushed after this
spec was written. But `:543`'s strict call-site rule is the LEDGER's, it predates this spec's base,
and the spec quotes it correctly in 3.0 before building three things that break it.

REQUIRED: 2.1 is re-cut the way 3.4.1 already re-cut the basis file. The sealed factory owns the
host; the released editor receives frozen REPLY OBJECTS and emits intents through the callback
table `:543` describes, taking raw field values. Say which released file holds which half. Do the
same for M1 and M2, and move `edit-week-tags.mjs`'s `createRequire` to the sealed side, leaving the
released file with the projector's two functions already bound. 3.3 line 3's budget, 9.3 and 6.8's
claim of "by construction" all move with it. If the PM prefers, the whole editor model may go
sealed instead, but the spec may not assert a green fence over a design that calls `.save` from a
released file.

### B2. The companion refuses the FIRST READ on every installation without F2, and refuses the first-run basis outright. 3.5's blocked list is wrong by most of the suite

3.5 rules that the F2 package blocks EW-04, EW-15 and EW-17c, and says in consequence 3 that
"EW-02, EW-03, EW-05 and the Machine settings door are NOT blocked: `update` and `remove` never
enter `tagsOf`." 3.4.4 says the adoption read refuses "on a generation that carries one `add`".
Both are false, and the measurement is short.

**(i) Every admitted setup operation carries `payload.tags`.** `setup-commands.mjs:124` builds
`payload: { profile: PROFILE, setup: document, tags: tagsOf(carried.tags, document) }`, and
`tagsOf` (`:61`) refuses a non map outright, so the member is never absent. `validate` (`:139`)
requires `Object.keys(op.payload).length !== 3` to fail (`:143`) and re-runs `tagsOf` over
`op.payload.tags` at `:146`. `source-admission.mjs:220` requires that same `Setup.validate`. So
`origin.payload.tags !== undefined` is ALWAYS true.

**(ii) So `tagsOf` is entered at projector CONSTRUCTION, not at `editOf`.**
`plan-edit-model.cjs:202` is `if (origin.payload.tags !== undefined) {` and `:203` is
`const tags = origin.payload.tags[row.id]; C.tagsOf(row, tags, validateTags);`, inside the row loop
in `createPlanEditProjector`'s own body. `C.tagsOf` is `plan-edit-commands.cjs:57`, whose `:66`
refuses `PLAN_EDIT_TAGS_INVALID` the moment `validateTags` is not a function.
`projectorFor` (`plan-edit-host.mjs:68`) builds the projector on the FIRST read (`:69-:76`,
`boundSource === null`). **With no provider, `host.read()` refuses `PLAN_EDIT_TAGS_INVALID` at E0,
for an `update`, a `remove`, a bare open, and the adoption read, on every installation.**

**(iii) And on a first run installation the basis itself is refused.** With
`basisSource:'first-run'`, `:209` asks `own(e,'head') || own(e,'secondary') || own(e,'volumeTags')`
of every basis row and `:213` sets `tagsOk = false` when none is present; `:217` then fails
`PLAN_EDIT_TAG_BASIS_UNPROVEN`. Measured, the basis the spec names in 3.4.2 has none of the three:
`setup.athleteState()` is `today-entry.mjs:127-:130`, `createCleanInitState({ setup: rows[0].setup })`,
and `createCleanInitState` builds its rows through `checkExercise`
(`athlete-state.cjs:236`, row constructor at `:136`), which returns
`{ id, n, mg, day, sets, hi, inc, steps, w, forks }` and nothing else.

**(iv) The only thing that writes those three members is unmerged F2.**
`grep -rn 'volumeTags' rebuild --include=*.cjs --include=*.mjs`, runtime files only, returns
`f2-tag-adapter.cjs:110`, `:153-:154` and `:191`, and `plan-edit-model.cjs` itself. `:191`
`e.volumeTags = cloneData(marker)` is inside `projectSetupTags`, which is the THIRD of the
adapter's four exports (`:195`) and which this spec never names. The two Astra annexes build their
basis exactly that way: `PLAN-EDIT-REVIEW-ANNEX.mjs:52`
`tags.projectSetupTags(createCleanInitState({setup}), ...)`. So the merged companion has never been
run against a basis any product path produces.

CONSEQUENCES the spec must carry, and they are large:

1. **Every cell that opens the editor is blocked on 3.5**, not four: EW-01, EW-02, EW-03, EW-05,
   EW-08, EW-11, EW-12, EW-13a, EW-13b, EW-13c, EW-13d, EW-14 and the two Machine settings cells
   that open the door through the same entry. 7.1's "the whole suite skeleton written RED" survives
   (red is red), but 9.3's fourth column, which says "about 19 to 25 of it can start on
   acceptance", is answering `E-R11` with a number that assumes green is reachable for the update
   and remove doors. It is not.
2. **3.5 needs a fourth function and a basis step.** `validateExerciseTags` and
   `projectNewExerciseTags` are not enough: `projectSetupTags` must run over the first-run state
   before it is handed to the host, which is a change at `today-entry.mjs:130` or a projection step
   inside the sealed factory. Either is a new hunk in a sealed file and belongs in 3.2, 3.3 line 3
   and 9.3.
3. **E0's refusal list is missing `PLAN_EDIT_TAGS_INVALID`**, which is the code the athlete
   actually meets first today. 2.2 lists it only under E4 and E6.
4. **EW-13d cannot go green as written** even after the package lands, because it opens on a first
   run installation whose basis carries no tag projection. It needs the projection step of (2) to
   be part of the cell's composition, stated.
5. **3.4.4's sentence is right in kind and wrong in scope.** The adoption read refuses without F2
   on EVERY generation, not on generations carrying an `add`.

REQUIRED: 3.5 restates the dependency as measured above, names `projectSetupTags` and where the
first-run basis gets it, re-cuts the blocked list in 5, 7.1 and 7.2, and 9.3 re-answers `E-R11`
with the corrected start column. This does not change the ruling of 3.5, which `E-R6` accepted and
which I could not fault; it changes how much of the lane waits behind it.

### B3. `foldPlanEditsAt` as specified refuses before it folds anything, because its two named collaborators are exactly the pair that fails the tag proof

4.3 ruling 2 is the best new work in the round and I agree with its shape: the fold is the model's
own `inspect()` plus `result()`, not a fold over `apply()`. I verified the whole of `E-R4`'s premise
and it holds (section 2, B4). The defect is in the collaborators, which the spec calls "each
measured".

The fold is specified as `foldPlanEditsAt({ documentState, setupOperation, generation, onLocalDate,
hashBasis, validateTags, projectNewExerciseTags })` with `documentState` =
`createCleanInitState({setup: op.payload.setup})` (`source-admission.mjs:221`) and `setupOperation`
= `op` at `:220`. Measured:

- `op.payload.tags` is always present (B2 (i)), so `plan-edit-model.cjs:202` is entered;
- `:203` calls `C.tagsOf(row, tags, validateTags)`, which the spec does supply, so that half is
  fine;
- `basisSource` is NOT in the signature and is NOT ruled, so the export takes
  `createPlanEditProjector`'s own default at `:100`, `basisSource = 'first-run'`, hence
  `firstRun` true;
- `:209` therefore asks the `createCleanInitState` rows for `head`, `secondary` or `volumeTags`,
  finds none, `:213` sets `tagsOk = false`, and `:217` fails `PLAN_EDIT_TAG_BASIS_UNPROVEN`.

So the fold refuses on the first capture of every real import, before a single plan edit is
considered. The two ways out are both design decisions the spec has to make rather than leave to
the hunk's author: pass `basisSource:'local-source'` (at which point `:208` retains rather than
proves the tags, but `:194`'s row binding changes from `base.exercises[i]` to
`byId.get(row.id) || matchByName(...)` and the row comparison at `:200` changes with it, so it is
not a free switch), or run `projectSetupTags` over `documentState` first, which makes section 4
depend on F2 in a second, heavier way than 4.3 already says.

**One more thing 4.3 and 4.4 do not rule: what admission does when the fold throws.** Every refusal
in `inspect()` is a `TypeError` with a `code` (`plan-edit-commands.cjs:5`). `programme()`'s own
refusals are `fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:...})`, a vocabulary the import screen
draws. A generation carrying an edit whose causal parent was tombstoned refuses
`PLAN_EDIT_BASIS_INVALIDATED` (`:300`, `:309`); a half written plan op refuses
`PLAN_EDIT_HISTORY_UNPROVEN`. Under the ruling those now abort an IMPORT, with a code no import
screen has a sentence for. Say which field name the fold's refusal is reported under, or say it is
caught and the capture refuses by its own field.

REQUIRED: 4.3 ruling 2 names `basisSource` and justifies the value; says whether `documentState` is
tag projected and by what; and 4.3 or 4.4 rules what admission reports when the fold refuses. 4.4's
price moves again if the answer is the projection.

### B4. 3.4.2's `clock` row is wrong twice, and the second way makes state D unreachable

`E-R2` asked for the factory named with all ten arguments and where each comes from. 3.4.2 delivers
that, and eight of the ten rows are right and were checked one by one (section 2, B2). The `clock`
row is not:

> `clock` | `{ today: () => era.liveDay() }`, the shape `sleep-host.mjs:115` already builds for the
> same reason | `plan-edit-host.mjs:44` requires `clock.today`

**(i) It is not a clock.** `plan-edit-host.mjs:81` hands it straight on:
`await client.hostBindings({ workoutCommands: commands, clock })`.
`host-bindings.mjs:229` takes it as `hostClock`, `:244` `const clock = hostClock || scope.clock`,
and `:170` `const nowIso = clock.now()` and `:223` `leaseExpired(era.lease, clock.now())` call a
member the proposed object does not have. The real shape is `today-bindings.mjs:208`
`clientClockFor(day, live)`, which returns `today`, `now`, `tz` and `monotonicMs`. The factory as
specified throws on its own `hostBindings` call.

**(ii) `today()` must be the FROZEN day, and wiring it to `liveDay` kills `PLAN_EDIT_DAY_TURNED`.**
`clientClockFor(day, live).today()` is `() => day`: the day half never moves. The companion says
why in its own words at `plan-edit-host.mjs:26-:41`, and then depends on it: `:225-:226` is
`const stamped = clock.today(); ... if (stamped !== entry.authoredDay) return dayTurned();`, where
`entry.authoredDay` was taken from `localDay()`, which is `liveDayOf()` (`:54-:60`). If
`clock.today()` is ALSO `liveDay()`, the two sides are the same reading and **the guard can never
fire**. State D, which R1 B5 spent a finding recovering and which 2.2 carries verbatim from
`plan-edit-host.mjs:24` as the spec's one SOURCED FROM CODE sentence, becomes dead code, and a save
authored yesterday is stamped with today's date instead of being refused. That is a durable
correctness change, not a screen detail.

The cite does not support the row either: `sleep-host.mjs:115` is `today: () => ... era.liveDay()`
on the HANDLE object, beside `repository`, `client`, `day` and `lease`. It is not the `clock`
passed to `hostBindings`; that lane passes none, which is what `machine-settings-host.mjs:68-:72`
explains in its own comment.

REQUIRED: the `clock` row becomes `clientClockFor(day, live)` for the host's own `day`, exactly as
`today-bindings.mjs:317`, `:383` and `:557` already build it, and `liveDay` stays the separate live
reader it is. Add a cell: a review authored on day D, saved after the live day has turned, refuses
`PLAN_EDIT_DAY_TURNED` and draws state D. Without that cell this defect ships silently, because
every fixture that does not cross midnight passes.

### B5. The no-disjunct rewrite says what replaces `documentSets` and what replaces `documentProgramme.state`, and does not say what replaces the admitted-state test in `capture_lift`

`E-R3` is carried out for two of the three rows and I could not weaken either. 4.3 ruling 1 now
reads, for the other two:

- `capture_sets`: "`documentSets` is replaced by the per lift count FOLDED prescribes on
  `originalDay`. One value, not two." Unambiguous.
- `capture_membership`: "compared against `sessionMembership(FOLDED, originalDay)` instead of
  `sessionMembership(documentProgramme.state, originalDay)`". Unambiguous.
- `capture_lift`: "`state.exercises` keeps its role for the ADMITTED state, and the membership of
  the programme is asked of FOLDED."

The third names no replacement. Read as written it is a CONJUNCTION: keep `:614` and add a FOLDED
test. Measured, `:614` is
`if(state.exercises.filter(e=>e.id===target).length!==1)fail(...,{field:'capture_lift',...})`
with `target=liftAttach(slot.lift_lineage_id)??slot.lift_lineage_id` at `:613`, and 4.1.1's own row
says why it breaks: a lift minted by `add` or `replace` is pushed into the PROJECTED state at
`plan-edit-model.cjs:358` and exists in neither the document nor the file, so `liftAttach` returns
null, the filter finds zero, and the check refuses. Keeping that test and adding another leaves
EW-17c's main assertion red while its CONTROL 1 ("a lift no programme ever carried still refuses")
passes, which is the worst possible cell outcome: green control, red subject, and a builder with
two readings of one sentence to choose from.

It is also the one row where a conjunction is tempting, because dropping the admitted-state test
outright is a real question: `state.exercises` is what `liftAttach` resolves INTO, and a capture
naming a file lineage id still has to be resolvable. So the answer is probably "the correspondence
resolution at `:613` stays, the membership test at `:614` is asked of FOLDED" and not "both", but
the spec has to say which, in the same words the other two rows use.

REQUIRED: 4.3 ruling 1's `capture_lift` row says `is replaced by` or `instead of`, naming exactly
what at `:613` and `:614` stays and what moves, and EW-17c's assertion in section 5 quotes it.

### B6. The adoption hunk costs three durable reads per adoption, and STOP 9 fires at more than one

3.4.4 states the cost as "one extra durable reopen per adoption" and 9.1 item 9 makes more than
that a STOP: "3.4's adoption read costs more than one extra durable reopen per adoption ... Either
means the composing module is doing more than composing, and option (b) is no longer the cheap
answer." Counted against the spec's own factory:

1. `basisState` (3.4.2): `await admittedLocalSourceState(setup)`, which is
   `local-source-basis.mjs:73-:82` and whose `:78` is `const loaded = await repository.load();`.
   One generation load.
2. `setupOperation` (3.6): "the sealed factory calls
   `setupsIn((await repository.load()).generation, PROFILE)`". A SECOND generation load.
3. `host.read()`: `readVerified` (`plan-edit-host.mjs:145`) `:148 await lane.reopen()`. The reopen
   the cost paragraph counts.

Three durable reads, and the adoption gate already did its own `admittedLocalSourceState` at
`today-app.cjs:2482-:2488` before any of this, so it is four in total where there was one. Adoption
runs at boot (`:2550`) and on `onAdmitted` (`:700`), so this is not per frame and it is probably
still acceptable; the point is that the spec's own STOP condition says it is not, and a builder
reading 9.1 item 9 literally must stop on day one.

There is an easy answer the spec is one sentence from: the factory takes the generation the
adoption gate has ALREADY loaded, since `:2482` loads it and 3.4.4 item 2 already requires `setup`
to stay reachable from the gate. Then `basisState`, `setupOperation` and the fold all read one
loaded generation and the only extra durable act is the `lane.reopen()` the cost paragraph names.

REQUIRED: either 3.4.2 and 3.6 read ONE generation, loaded once by the adoption gate and passed in,
and 3.4.4's cost paragraph says so; or STOP 9 is re-worded to the true count and the PM is asked to
accept it. As it stands the spec fails its own stop condition at design time.

---

## 2. EVERY R2 FINDING: FIXED, STILL OPEN, OR DISPUTE UPHELD

I re-derived each one from the tree at `e0e2ac75` rather than accepting either document's account.

### 2.1 The six BLOCKING

| # | verdict | what I measured |
|---|---|---|
| B1 a wiring act filed in the view half | **FIXED FOR THAT FILE, THE FINDING IS LARGER** | 3.4.1 reduces `edit-week-basis.mjs` to `planEditedState(rawBasis, read)`, which imports nothing, calls nothing and is total on every reply shape. I could not find a path through it that returns `undefined`, which is what R2 N3.2 asked for. The justification `E-R1` demanded is given and is honest. But the same ruling voids 2.1's page surface, 2.2's M1 and M2 and 3.5 consequence 2, and v3 re-opened none of them: **B1 above.** |
| B2 the hunk cannot be written, and the basis loops | **THE BASIS IS FIXED AND I COULD NOT BREAK IT; THE FACTORY TABLE HAS ONE WRONG ROW** | 3.4.3's rule is right and its proof is right. I checked the part neither review checked: is the RAW value the spec names actually the value the projector proves against? `plan-edit-host.mjs:75` injects `admittedBasisOf: g => admittedLocalSourceBasis(g,{athleteLabel,namespace})`; `local-source-basis.mjs:73-:82` `admittedLocalSourceState(setup)` returns `admittedLocalSourceBasis(loaded.generation,{athleteLabel: setup.athleteLabel(), namespace: host.namespace})`. Same function, same two narrowing arguments, so `:240 equal(adopted, base)` holds and EW-13c is writable. The loop is genuinely closed. Nine of the ten argument rows check out; `clock` does not (**B4 above**), and `basisState` is refused on a first run installation for a reason nobody has measured yet (**B2 above**). "Zero removed" is correctly withdrawn and the `try/finally` shape is right. |
| B3 the disjunct widens two checks | **FIXED FOR TWO ROWS, THE THIRD IS AMBIGUOUS** | The no-disjunct rewrite is correct for `capture_sets` and `capture_membership`, and 11.3's account of why is right. I verified `result()` (`plan-edit-model.cjs:369-:382`): `:376 if (value.starts_on <= date)` applies an edit ON its start date, so "at or after `starts_on`" in the controls is exact, and `:373-:375` validates the whole pending composition, so a later invalid edit cannot pass unnoticed. `capture_lift`: **B5 above.** |
| B4 a fold over `apply()` folds retracted and unproven edits | **FIXED IN SHAPE, NEW HOLE IN THE COLLABORATORS** | The shape is right and the spec's three added measurements are all correct: `:383 read(generation,date)` IS `result(inspect(generation),date)`; the four editability guards are at `:225-:227`, `:235`, `:236-:240` and `:242-:243` and each refuses for the stated reason in admission's context; and the fold does need the F2 projector via `:285`. The proofs the fold must keep are all inside `inspect()` and I confirmed each: `:282` origin uniqueness, `:285` per op validation, `:287-:291` tombstone proof, `:293-:294` the status map, `:298` duplicate intent, `:299` id reuse, `:300` and `:307-:309` causal invalidation and the basis chain, `:306` the `active` filter, `:310` date order. **A retracted edit cannot be folded under this shape**, which is what `E-R4` and STOP 11 (b) demanded. The hole is **B3 above**, plus the unruled refusal path. |
| B5 3.5 states where the tag refusal fires and it fires elsewhere | **FIXED AS FAR AS IT GOES, STILL UNDERSTATED IN THE SAME DIRECTION** | `preview()` is `:384`, `:385` is `C.validateInput(value,{validateTags})`, `:390` is the projection guard and `:392` is `apply()`, exactly as 3.5 now says, and v2's "green REVIEW then refuse at Save" is correctly withdrawn. But the true first refusal is earlier still and is not a review at all: `:203` at projector construction, reached on the FIRST `read()`. 3.5 and 7.1 still tell a builder to expect `PLAN_EDIT_TAGS_INVALID` at "the first `Review change`". **B2 above.** |
| B6 the sentence filed under the state that cannot raise it | **FIXED, and well** | `covered` is declared `:323-:327` with its refusal at `:326` and called at exactly `:330` (inside `update`) and `:345` (inside add and replace); the `remove` branch is `:339-:343` and calls it nowhere. `PLAN_EDIT_NO_CHANGE` is `:329`, update only. `PLAN_EDIT_WEEK_EMPTY` is `:341` and is genuinely E5's. E3, E4 and E6 now carry the code and the SOURCED sentence, E5 carries neither, the "E3 set" phrasing is gone and a COMMON set is named once. 8.2 item 13 puts the face in the right place. **The fourth misfiled code the author found himself is also right**: `PLAN_EDIT_TAG_BASIS_UNPROVEN` fires at `:217` and `:219`, inside `createPlanEditProjector`'s body, which `projectorFor` (`plan-edit-host.mjs:68-:76`) runs once on the first read and then FIXES, so no review path raises it. Moving it to E0 is correct. That is the round finding its own defect class without being told, and it is the best single thing in v3. |

### 2.2 The nine NOTES, and R2's two residual N1 drifts

| # | verdict | what I measured |
|---|---|---|
| N3.1 the adoption module needs the tag providers too | **FIXED, and still understated** | The chain is exactly as 3.4.4 now gives it, and EW-14 and EW-13d are marked blocked on 3.4 AND 3.5 in 5, 7.1 and 7.2. Understated only in scope: B2 above. |
| N3.2 the `&&`/`\|\|` shape silently skips adoption | **FIXED** | `today-app.cjs:2493 if (!state) return;` verified. The shape is gone; `planEditedState` is total because it calls nothing, the `catch(() => null)` is on the sealed side where the durable call is, and EW-14's row asserts a state on every path including an unexpected reply shape. This is the cleanest fix in the round. |
| N3.3 `:325` is stale inside the source's own comment | **FIXED** | `source-admission.mjs:325` is `fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'exercise_id',...})` inside the exercise id loop. `:779` carries `programme_digest:digest(platform.hash,'earned/local-source-programme/v1',...)` beside `operation_digest` and `interpretation_digest`. The quotation is kept exact and the correction is made outside it, which is the right way to do it. |
| N3.4 the S9 relay has one wrong member of five | **FIXED** | Re-measured every one: `:513`, `:596` and `:2052` are `const idb = (view && view.indexedDB) \|\| ... globalThis.indexedDB`, `:637` is the same expression as a member; `:1416` is `const pending = Promise.resolve().then(() => checkin.host.forDate(day))` and opens nothing. The PM's six writers all verified: `:493` and `:581` `host.save`, `:1072` `model.weighIn`, `:1293` `foodLane.save`, `:1843` `sleepLane.save`, `:2501` `workout.gym.rebase`. 3.1 prints both and states the rule. |
| N3.5 PE-f2-identity does not need re-pointing | **FIXED** | The reasoning is correct and 9.3 drops it from the uncounted list. |
| N3.6 three cites close but not exact | **FIXED, all three** | The `capture_lift` comment runs `:601-:611` with "total" at `:610`; the mint pushes at `:358` and maintains order at `:359-:365`; `gym-model.mjs:96` declares `hostForDay` as an injected option and `:163 const fresh = await hostForDay(day)` is the code, with `:104` the comment. All verified. |
| N3.7 the re-measurement claim is wider than what was re-measured | **FIXED IN WORDING, AND IMMEDIATELY BENT AGAIN** | The header's narrowed claim is the right claim. But v3 introduces a new drift of the same kind inside the round: note N1 below. |
| N3.8 `DECISIONS:542` moved three things | **FIXED, all three** | Q-A closed with its framing corrected, STOP 2 rewritten around TODAY-SPLIT's interface, and law 3 restated as a standing rule. I read `:542` and `:543` and each restatement is faithful. |
| N3.9 section 1 does not carry the custody line | **FIXED** | 1.2 carries it with `E-R8`'s restatement. |
| N1's two residual drifts | **FIXED** | `readVerified` is `:145-:153` and the STALE refusal's extra fields are `:214-:216`. Both verified line by line. |

**Tally: R2 B6 FIXED; B1, B2, B4 FIXED IN SHAPE with new blockers in the fix; B3 and B5 FIXED IN
PART. All nine notes and both N1 residuals FIXED. Nothing of R2's is disputed by me, and nothing of
R2's was disputed by the author either, which section 11.9 says plainly and which I checked: on
B3's argument, B5's ordering and N3.5's reasoning there is no counter-argument to find.**

**R1's one note R2 left half open, N5, is CLOSED.** `PLAN_EDIT_DAY_UNCOVERED` now carries
`BRIEF-EDIT-MY-WEEK.md:61` under the three states that can raise it, and `PLAN_EDIT_WEEK_EMPTY` has
a proposed sentence in 2.2.2.1. No R1 finding remains open.

---

## 3. THE PM'S RULINGS: IS EACH ONE CARRIED OUT?

| ruling | carried out? |
|---|---|
| **`E-R1`** re-cut section 3 for `:543`; choose and justify the basis file's side; say what rides S10 and what ships as lane C | **PARTLY.** 3.0's two column table is exactly the answer the ruling asked for and I could not fault a row of it; the route and mount are correctly lane C, the host construction, lane opening, adoption and rebase correctly sealed; 3.4.1 takes the second option with a justification that is stated, costed ("about ten more sealed lines") and honest. But the ruling says "no released file may call a writer, open IndexedDB or import a host", and three places in the spec still do: **B1.** The re-cut covered section 3 and skipped section 2. |
| **`E-R2`** respecify the adoption hunk so it can be written and cannot loop; name the factory and all ten arguments; name `basisState` without feeding `athleteBasisState()` back; add the two cells | **MOSTLY.** The factory is named, sited and budgeted; `basisState` is pinned to the raw value and I verified the pinning is byte-correct; EW-13c and EW-13d are the two cells asked for and they name their failure codes. The `clock` row is wrong (**B4**), the `basisState` row is refused on a first run installation (**B2**), and the read count contradicts STOP 9 (**B6**). "What the split must leave in place" (3.4.4's four items) is good and is corroborated by TODAY-SPLIT v2, which classifies `athleteBasisState :2482-:2489` and `adoptAthleteState :2490-:2546` as WRITES moving "YES, whole". |
| **`E-R3`** no disjunct; re-point all three checks at the one programme in force; rewrite 4.3 ruling 1 and the EW-17 cells, each with its control | **TWO OF THREE.** `capture_sets` and `capture_membership` are re-pointed cleanly and the new controls are the right controls; the `capture_lift` row names no replacement (**B5**). CONTROL 2 on EW-17a and EW-17c is exactly the cell that was impossible to write before, and EW-17b's order-only control is a good addition nobody asked for. |
| **`E-R4`** the fold is `inspect()` plus `result()`, exported, so a RETRACTED or unproven edit is not applied; carry the digest constraint; price it honestly | **YES on the shape, NO on the collaborators.** The shape is right, the proofs are named line by line and I verified every one, and a tombstoned edit genuinely cannot be folded. The digest constraint is carried with the stale number corrected to `:779`. The price is re-derived rather than asserted. The fold as specified refuses before it folds (**B3**). |
| **`E-R5`** where the tag refusal really fires; DAY_UNCOVERED under E3, E4, E6; every R2 note | **MOSTLY.** B6's half is fully done and well done; the refusal order is corrected as far as R2 took it but is still not the true first refusal (**B2**). All nine notes landed. |
| **`E-R6`** the F2 package accepted as proposed; EW-04, EW-15, EW-17c wait and say so | **YES, and it needs to go further.** 3.5 says it, 5, 7.1 and 7.2 carry it. The ruling itself is sound; what the spec understates is how much waits (**B2**). |
| **`E-R7`** provenance extended, not refused at the edit; the four hunks ride S10 together | **YES.** 4.3 ruling 4 rejects refusing at the edit with a reason I agree with, and 3.3 line 6, 4.4 and Q-B keep the four on one child with the order named. |
| **`E-R8`** EW2-BUILD starts on the VIEW half now; lane C builds, D2 reviews as a SECOND obligation; "after N2" dropped | **YES in the document, and B1 and B2 move the answer.** 1.2, 6.6, 7.1 and Q-C and Q-D all carry it faithfully. But "starts on the VIEW half" is worth less than 9.3 claims once the released files cannot hold the host (B1) and the update and remove doors cannot go green without F2 (B2). The START DATE does not move; the CONTENT of what starts does. |
| **`E-R9`** propose one sentence per code, true for its field, dash free, marked PROPOSED | **YES, with one deviation and one truth question.** 2.2.2.1 exists, is marked, is dash free (I counted: the whole file is pure ASCII, zero U+2013, zero U+2014, zero characters above U+007E) and quotes `Report a problem` correctly from `today-app.cjs:223` and `design.cjs:193` rather than inventing it. It proposes two or three sentences per code where the ruling said one, and says so openly. One sentence is not true in one direction: note N7. |
| **`E-R10`** the owner question as worded, design lane first | **YES.** 8.3 is unchanged and says the route is accepted and not re-opened. |
| **`E-R11`** the estimate restated, with what can start on acceptance | **YES in form, and the number is wrong.** The table is restated, the movement is explained row by row rather than asserted, and the fourth column answers the question. "About 19 to 25 of it can start on acceptance" does not survive B1 and B2. |

### 3.1 TWO RULINGS I THINK ARE WRONG ON THE EVIDENCE, put to the PM rather than to the author

**(a) `E-R6` accepted the F2 package as a dependency of THREE CELLS. It is a dependency of the
whole door.** The ruling is right about WHAT to land and right about WHO lands it; it is wrong about
where the package sits in the chain, because the evidence for B2 was in front of nobody when it was
made. If `host.read()` refuses `PLAN_EDIT_TAGS_INVALID` on every installation without the provider,
then F2 is not a leaf on S10 beside the other three hunks: it is the FIRST item on the child, and
nothing in the lane goes green before it. 3.5's own last paragraph reaches the same conclusion from
two weaker premises ("a reason to land it FIRST on S10 rather than beside them") and the PM should
re-read that sentence with B2 behind it.

**(b) `E-R1` offered two ways out of R2 B1 and the author took the second. I think the first is
better, and the reason is not purity.** Under the chosen answer the function that decides WHAT
TODAY ADOPTS lives in an unpinned released file, and 3.5 consequence 2 puts the TAG RULE, which
decides the projection written into a durable plan operation (`plan-edit-model.cjs:350-:356`), in
another one. Both are then consumed by the sealed side. That inverts what the seal binds: after
this, a lane C edit can change the basis the whole app stands on, and what a durable operation
projects, without a reseal child and without the WRITER-FENCE noticing, because neither file calls
a writer. The author's justification is the best available one ("a rule that has already been got
wrong three times belongs where a cell can be written against it without a reseal child") and its
cost is correctly priced at about ten sealed lines. I would pay the ten lines. Either way the PM
should decide this with the inversion stated, because the spec states the benefit and not the cost.

---

## 4. NOTES

### N1. The retirement is written at `:362`, not `:361`, and v3 cites `:361` three times

4.2's EW-17c CONTROL 2, 4.3 ruling 1's "why the disjunct was wrong", and 11.3's "Verified the
retirement ... `plan-edit-model.cjs:361` writes `state.retirements[target.id]` on a `replace`" all
name `:361`. Measured, `:361` is `const index = (order[oldDay] || []).indexOf(target.id);` and the
retirement is `:362` `put(state.retirements || (state.retirements = {}), target.id, op?.op_id ||
'preview');`. The claim is true; the line is one off. It matters more than a normal drift because
it is the load-bearing cite of the control `E-R3` asked for, it is inside the round that narrowed
the re-measurement claim after R2 N3.7, and 11.3 presents it as verified.

### N2. `originalDay` is declared AFTER `capture_sets`, so the fold cannot be keyed on it at the head of the callback

4.3 ruling 1 says "Write `FOLDED = foldPlanEditsAt(..., originalDay)` (ruling 2) once per capture,
where `originalDay` is `source-admission.mjs:674 start.effective.local_date`, which the callback
already has in hand", and 4.4 puts the call "at the head of the capture callback". Measured,
`capture_sets` is `:665` and `const originalDay=start.effective.local_date` is `:674`, nine lines
LATER. A `const` is not readable before its declaration, so a builder who follows both sentences
writes a ReferenceError. The material is in hand (`start`); the binding is not. Say
`start.effective.local_date`, or say `:674`'s declaration moves to the head.

### N3. `generation` is in the fold's signature and is not among the "four collaborators, each measured"

4.3 ruling 2 lists `documentState`, `setupOperation`, `hashBasis` and the tag pair as the things
admission must supply, and the signature also takes `generation` and `onLocalDate`. `generation` is
the one `inspect()` actually walks. It is in scope at the capture callback as `g`
(`source-admission.mjs:596`), so this is a naming gap rather than a hole, but the list is presented
as complete.

### N4. 3.0's TIMING paragraph and 9.5 are stale: TODAY-SPLIT round 2 IS pushed, and it confirms 3.4.4

3.0 says "Round 2 is NOT on `rebuild/c-today-split` at `14c87fa7`" and 9.5 records the branch at
that head. Measured today: `rebuild/c-today-split` is `9a3362b6`, "TODAY-SPLIT-SPEC v2: the cut
reversed by PM ruling, the writers leave and both view files are released", 1339 lines. This is
good news for the spec, not bad: v2 names the module `rebuild/m3/w7-preview/today/today-lanes.cjs`
exactly as 3.2's row guesses, classifies `athleteBasisState` `:2482-:2489` and `adoptAthleteState`
`:2490-:2546` as WRITES moving "YES, whole", and keeps the router released, so 3.4.4's four
requirements are met by the design as it stands. Two things section 3 should pick up: v2 creates a
SECOND sealed module, `gym-settings-lane.mjs` (the `gym-app.mjs` extraction), which is missing from
3.2's table; and its E.3 fence prints an EXACT expected set of re-export counts after the split
(`createTodayModel` 2, `createTodayLanes` 2, `model` 2, `options` 2 in `today-app.cjs`), which 3.3
line 2a's route and mount hunk must not disturb. STOP 2 is the right place for both.

### N5. One of the four proposed sentences is not true in one of its two directions

`PLAN_EDIT_BASIS_SOURCE_CHANGED` is proposed as `Your imported history changed on this device while
this was open. Open Edit my week again to see your current week.` Measured, `plan-edit-host.mjs:69`
is `const source = Model.importPresentIn(generation) ? 'local-source' : 'first-run';` and `:77`
refuses when `boundSource !== source`. That fires in BOTH directions: an import became present, or
an import became absent. On the present direction the athlete had no imported history at all a
moment ago, so "your imported history changed" describes something that did not exist. The spec's
own copy law is that a sentence must be true for its field, and this is the one code R1 N6 and R2
N6 both singled out for exactly that reason. The remedy half is right and I checked it: re-opening
constructs a new host, `boundSource` returns to `null` at `plan-edit-host.mjs:67`, and the read
succeeds. Propose a first sentence that covers both directions without naming which happened.

The other three I could not fault. `PLAN_EDIT_WEEK_EMPTY`: `:340-:341` refuses only when every
other lift is already retired, and `replace` really is still open on that branch (the add and
replace branch has no `WEEK_EMPTY` guard), so both halves are true. The two hash sentences:
`:101` fires in the projector body before any generation is read and `:104` fires inside `hash()`,
which is first reached from `basisAt` (`:302`) during a read, and neither path has written
anything, so "Nothing in your week changed" is exactly true; I checked the one place it could have
been false, `save()`'s post commit re-read at `plan-edit-host.mjs:241`, and a refusal there is
swallowed into `after.read === false` and never surfaces as a hash code.

### N6. The two hash codes fire at E0's first read, and E0 does not list them

2.2.2 files `PLAN_EDIT_BASIS_HASH_UNAVAILABLE` and `PLAN_EDIT_BASIS_HASH_INVALID` under state X,
and X's row collects them as "the three of 2.2.2". Measured, `:101` fires at projector
construction, which `projectorFor` runs on the FIRST `read()`, and `:104` first fires from
`basisAt` inside `inspect()`, also during a read. So the door they arrive at is E0, whose refusal
list names neither. X is a TREATMENT and E0 is a DOOR, so this is not the error B6 was, but it is
the same filing ambiguity and a builder reading E0's list will not expect them.

### N7. `setup-model.mjs` is reused by E6 and is not on the fence's closed import list

2.2's E6 row reuses "setup's muscle vocabulary and field components ... from `setup-model.mjs`",
and 3.2 files that file as VIEW, no edit. TODAY-SPLIT E.3's closed list of what a released view may
import does not name it. It may be covered by "and each other" if `setup-model.mjs` is itself a
released view; say which, because `FENCE-VIEW-IMPORT` is a named failure and 6.8 makes it this
spec's bar.

### N8. Two small wording repairs in 3.4.2

- The `client` row says "the SAME object `machine-settings-host.mjs:72` hands to `hostBindings`".
  Measured, `:72` is `const bindings = await era.client.hostBindings({ workoutCommands:
  createMachineSettingsCommands() });`. What is HANDED to `hostBindings` is the options object; the
  thing that HAS `hostBindings` is `era.client`, which is what the row means and what
  `plan-edit-host.mjs:44` requires. Reword so a builder does not pass the options.
- The `namespace` row cites `local-source-basis.mjs:80` reading `host.namespace`. Correct, and
  worth adding that `:66` then narrows the admitted basis by `state.athlete_label`, which is why
  `athleteLabel` and `namespace` must be the SAME pair the raw `basisState` was read with, or
  `:240`'s equality fails for a reason that looks like the loop of 3.4.3 and is not.

### N9. The adoption window across midnight has no cell

Adoption runs at boot (`today-app.cjs:2550`) and on `onAdmitted` (`:700`). Across midnight it runs
again only through `watchDayRollover` (`today-entry.mjs:458-:459`, `:471`), whose `check()` fires on
a visibility change or a 60 second tick and then re-boots. So there is a bounded window in which the
gym card prescribes the fold as of YESTERDAY while a session started in it is stamped TODAY, and
admission's fold answers for TODAY. That is the one way section 4's re-pointed checks could refuse a
workout the athlete really did under an edit. The window is small and the existing machinery closes
it; EW-17b's CONTROL 1 tests the opposite direction. One sentence in 4.2, or a third control, would
retire the question rather than leave it for the first real capture.

---

## 5. THE THREE PLACES A DATA DEFECT COULD HIDE, ANSWERED

The ticket named three. Here is what I found in each, so the PM does not have to infer it from the
findings above.

**The adoption hunk: can it loop, double apply, or refuse an imported installation?** NO to all
three, and this is the part of v3 I most wanted to break. The loop is closed because `basisState` is
pinned to the raw value and the raw value is provably the one the projector proves against
(`plan-edit-host.mjs:75` and `local-source-basis.mjs:73-:82` call the same function with the same
two narrowing arguments). Double application is closed because `result()` (`:369-:382`) always
starts from `clone(base)` and the base is never the composed state. The imported refusal is closed
for the same reason. `planEditedState` cannot return `undefined`, so adoption cannot silently stop.
The residual risks are not in the composition: they are the wrong `clock` (B4), the read count (B6),
and the fact that the host will not open at all on a first run installation (B2).

**The fold: can a retracted or unproven edit be applied, and does the digest input change?** NO and
NO, as specified. A retracted edit cannot be folded: the shape runs `inspect()`, whose tombstone
proof is `:287-:291`, whose status map is `:293-:294` and whose `active` filter is `:306`, and
`result()` iterates `info.active` only. An unproven edit cannot be folded either: `:285` validates
every op, `:307-:309` proves the causal parent set and the seen basis chain, `:310` proves date
order. The digest input does not change: the folded state is a per capture value and 4.3 ruling 3
keeps it out of the returned basis, with the constraint quoted exactly and its stale internal
number corrected to `:779`, where `programme_digest` really is computed. STOP 11 now carries both
halves. The defect that remains is that the fold refuses before any of this runs (B3), and that
nobody has ruled what admission reports when it refuses.

**The three re-pointed capture checks: is anything admitted that no programme in force prescribed,
or refused that the athlete really did?** Nothing is admitted that should not be: the disjunct is
gone from the two rows that had it, and I verified the boundary is exact, because `result()`'s
`:376` is `if (value.starts_on <= date)`, so a capture ON `starts_on` is compared against the
post edit programme, which is what the gym card prescribed that morning. Two things could still
refuse a workout he really did: the `capture_lift` row read as a conjunction (B5), which would
refuse every session on a lift he added or swapped in; and the midnight window (N9). Everything
else in section 4 held under attack, including the membership row, which is exactly right and is
kept from v2 word for word.

---

## 6. WHAT I TRIED TO BREAK IN v3 AND COULD NOT

Recorded so round 4 does not spend time here.

1. **The copy census.** Counted by script over the whole file: zero U+2013, zero U+2014, zero
   U+2012, U+2015, U+2212, U+2010 and U+2011, and **zero characters above U+007E anywhere**, so no
   emoji and no smart punctuation either. No exclamation mark appears in any proposed or sourced
   sentence. `Report a problem` is quoted from `today-app.cjs:223 PROBLEM_ENTRY` and
   `design.cjs:193`, both verified verbatim, rather than invented. CLEAN.
2. **A look invented instead of left to the design lane.** Still none. 8.2 grew one item (13) and
   it is a placement statement, not a layout. The only number in section 8 is still the 716 thumb
   edge inside a question. CLEAN.
3. **The B6 family, hunted for a fifth member.** I re-read every refusal in 2.2 against the branch
   that raises it. E3, E4, E5 and E6 are now exact; the COMMON set is genuinely common
   (`plan-edit-commands.cjs:5`, `:35`, `:38`; `plan-edit-model.cjs:386-:388`;
   `plan-edit-host.mjs:171-:172`); E6 minus `TARGET_UNAVAILABLE` is right because `:321`'s guard is
   entered only when `edit.exercise_id !== undefined`. The only filing I would still move is N6's
   two hash codes. The author's own fifth find, `TAG_BASIS_UNPROVEN` to E0, is correct.
4. **3.6's `setupsIn` correction, which no review found.** I checked it and it is right, and it is
   the most valuable thing in v3 after the B6 work. `setup-host.mjs:45` `setupsIn` maps each
   surviving op to a frozen `{op_id, date, time, setup, tags}` at `:57-:63`, five members, and
   `plan-edit-model.cjs:108-:112` needs nine fields off the raw operation, so a row handed straight
   in really does refuse `PLAN_EDIT_ORIGIN_UNPROVEN` at `:110`. The correction keeps ownership of
   WHICH op counts inside `setupsIn` (its tombstone and rejected filters at `:48-:55`, its
   `device_seq` order at `:56`) and dereferences an id, which is the right shape, and
   `setup-host.mjs:85` really does call it the way the spec says. CLEAN, and it would have cost the
   builder a fixture.
5. **The S9 relay and the seal table.** I did not re-run the artifact query, because R2 ran it and
   v3 ran it a third time with identical answers and nothing in my findings turns on a row of it.
   The S9 corrections of 3.1 I did re-measure, line by line, and all of them hold.
6. **The estimate's internal arithmetic.** The rows add up, the movement is explained per row
   rather than asserted, and the exclusions are named. B1 and B2 move the fourth column, not the
   arithmetic.
7. **The scope.** 1.1 is unchanged and still right. The three EW-17 cells and the two new EW-13
   parts are inside section 4's and section 3's remit. No creep.
8. **The owner question.** Unchanged, and `E-R10` settles it. Nothing to add.
9. **Law 4 and STOP 8.** The four proposed sentences are correctly quarantined: marked PROPOSED,
   not built until the PM rules, the interim named, and STOP 8 widened to "any new copy sentence at
   all beyond 2.2.2.1's four". A builder cannot ship them by accident.
10. **Section 10.** Kept word for word as R2 asked. I spot checked four of its sixteen rows against
    the tree and they still hold at the new tip.

---

## 7. WHAT ROUND 4 CHANGES, IN ORDER

1. **B5, half an hour.** 4.3 ruling 1's `capture_lift` row says `is replaced by`, naming what at
   `:613` and `:614` stays; EW-17c quotes it. N1's `:362` goes in with it.
2. **B4, half an hour.** The `clock` row becomes `clientClockFor(day, live)`; a day turned cell is
   added. N8 goes in with it.
3. **B6, half an hour.** One generation, loaded once by the adoption gate, feeds `basisState`,
   `setupOperation` and the fold; 3.4.4's cost paragraph and STOP 9 agree again.
4. **B2, then B3.** The measurement is one fact; the two sections it lands in are 3.5 with 5, 7.1,
   7.2 and 9.3 behind it, and 4.3 ruling 2 with 4.4's price behind it. This is the change that
   moves what the PM is being asked to approve, so it comes before B1 in value even though it is
   later in the file.
5. **B1.** 2.1 re-cut the way 3.4.1 already re-cut the basis file, M1 and M2 with it, and the tag
   shim's `createRequire` moved to the sealed side. 3.3 line 3, 6.8 and 9.3 follow. N7 goes in
   with it.
6. The notes, which are line level except N4, which is a pass over 3.0, 3.2, 9.5 and STOP 2 against
   `rebuild/c-today-split@9a3362b6`.

B1 and B2 are the two that change what gets built and when. B3, B4 and B5 are each a wrong sentence
in an otherwise correct ruling, and B6 is the spec disagreeing with itself. None of the six says the
design is wrong: the shape of v3, the split it is cut against, the no-disjunct provenance rule, the
inspect-and-result fold and the raw basis are all, as far as I can measure, right. If round 4 lands
B1 through B6 I expect to accept it, and I would say now that section 3.4 and section 4.3 are the
most carefully derived pages of design I have read in this repo.

One thing I want on the record for the PM, because it is a pattern and not a finding: the three
defects that cost the most to find this round (B2, B3, B4) are all the same kind. Each is a place
where the spec names a real product value as an argument and does not run the guard the receiving
code puts on that argument. `basisState` is real and is refused by the tag proof; `documentState` is
real and is refused by the same one; `clock` is real in shape and is refused by `hostBindings`. The
cheapest guard against the next one is a rule the spec is already most of the way to: every argument
row in 3.4.2 and 4.3 ruling 2 names the line that CONSUMES it, and the reviewer opens that line.
Eight of the ten rows in 3.4.2 do exactly that and eight of the ten are right.

## 8. WHAT I DID NOT DO

I ran no test, installed nothing, launched no browser, and changed no product, test, tooling or
workflow byte. I ran no build, no packaging step and no suite. The only file this branch gains from
me is this one. I did not read `rebuild/conform/private`, any `ledger/` directory, `src/history.js`,
the protected soak, or any of the owner's measurements, on either machine, and nothing outside the
farm's include list was fetched: `f3e9561` was not obtained, and `rebuild/m4/spec/acceptance-s8-real-shape.json`
was not opened at all this round because no finding turns on it. The reading was done in the PM's
cloud farm mirror at `e0e2ac75`, with `rebuild/d2-ew2-spec` at `90441ae3` and
`rebuild/c-today-split` at `9a3362b6` synced beside it; the writing, the commit and the push were
done on the owner's PC. No credential appears above. Zero U+2013 and zero U+2014 in this file.
