# EW2-SPEC REVIEW R1, INDEPENDENT

Reviewer: cowork (Earned lane hand), Opus, 2026-09-19. Reviewed file
`rebuild/lanes/d2/EW2-SPEC.md` (524 lines) at branch `rebuild/d2-ew2-spec` head
`c17fac866dd44bda99bdd274caf710f758a4dfe2`. The author is gone; this review commits one file and
moves no other byte.

Method: the spec was read in the PM's cloud farm mirror. Every file:line cite below was opened and
counted at the chain tip, which is now `724ef3fc`; `git diff 0794771..724ef3fc` over
`source-admission.mjs`, `plan-edit-host.mjs`, `rebuild/m4/workout/` and
`rebuild/m3/w7-preview/today/` is EMPTY, so the spec's base `0794771` and the tip agree line for line
and no cite is excused by drift. The seal artifact `rebuild/m4/spec/acceptance-s8-real-shape.json`
was queried by script and never printed. `rebuild/b-s9-ui-pins@c0bb04e9` and
`rebuild/c-ui-0-gates@ecbef86a` were synced and read for section 3 and section 8. No private,
ledger, soak or history path was opened on either machine. No credential appears here. Zero U+2013
and zero U+2014 in this file.

## VERDICT: REJECT

Six BLOCKING findings. Four of them are holes in the plan rather than errors in the prose: the
provenance ruling covers one of the three checks that break, EW-14 cannot be built by the wiring
half the spec describes, two in-scope cells have no provider for a required argument, and the fix
the spec prices at "one line" has no stated derivation. The other two are a false statement of fact
in the authority line and an invented sentence for a refusal whose sentence is already in the code.

This is not a weak document. Sections 3.1, 8.1 and the SOURCED half of the copy table are the best
verified work in it and I could not break them: see "WHAT I TRIED TO BREAK AND COULD NOT" below. The
REJECT is for what is missing, not for what is wrong on the page.

---

## BLOCKING

### B1. The provenance ruling covers ONE of the THREE checks that an in-scope edit breaks

Section 4 rules only on `capture_sets`. Two more checks in the same callback refuse on edits the
spec puts in scope, and neither is named anywhere in the file.

Measured at the tip, all three inside the one `resolveCapturedLayout` callback that runs for every
stored workout start:

- `rebuild/m3/w6/local/source-admission.mjs:598` `capture_producer`. SAFE. A plan edit does not
  change the rule profile. This is the only one of the four that survives.
- `source-admission.mjs:614`
  `if(state.exercises.filter(e=>e.id===target).length!==1)fail(...,{field:'capture_lift',...})`
  reads the ADMITTED state through `liftAttach`. A lift minted by `add` or by `replace`
  (`plan-edit-model.cjs:344-356`) exists only in the projected plan: it is in neither the document
  nor the file, so `liftAttach` returns null, `target` stays the new id, the filter finds zero, and
  a session recorded on that new lift refuses `capture_lift` ONE CHECK EARLIER than `capture_sets`.
  EW-04 (replace) is in scope.
- `source-admission.mjs:695-699`
  `encode([...counts.keys()])!==encode([...produced.exercise_ids])` compares the whole day's pool,
  IN ORDER, against `sessionMembership(documentProgramme.state, originalDay)`, where
  `documentProgramme.state` is the frozen first-run document (filled at `:237`). A `remove`
  (EW-05), a `replace` (EW-04) and a `day` change (in scope: `day` is in `CHANGES` at
  `plan-edit-commands.cjs:46`, and EW-08 edits that door) all move the pool or its order, and
  `plan-edit-model.cjs` maintains `state.exOrder` explicitly, so the order really does move. All
  three refuse `capture_membership`.

The spec's own EW-17 walks the `sets` path only, with a name-change control. Written as it stands it
would come back red on `capture_sets`, the ruling of 4.3 would be built for `capture_sets`, and
EW-04 and EW-05 would ship with a refusal nobody had ruled on. `DECISIONS:510` is not a limit here:
it named the one case it had measured and left "reachability open".

REQUIRED: section 4 rules on `capture_lift` and `capture_membership` by name, or states in writing
why each is out of scope with the code line that makes it so. EW-17 becomes three cells: an
`update` that moves `sets` asserting `capture_sets`, a `remove` asserting `capture_membership`, and
an `add` asserting `capture_lift`. One cell does not settle this family.

### B2. EW-14 cannot be met by the wiring half section 3.3 describes, and the file it needs is missing from the table

Section 3.3 line 2 says the wiring half is TWO files, `today-entry.mjs` and `today-app.cjs`, "ONE
route in the `[data-go]` router at `:826` and ONE mount call", under 40 added lines. The route cite
is correct (`today-app.cjs:826` is the `[data-go]` listener loop). The claim that this is enough for
EW-14 is not.

EW-14, in the spec's own cell table, is "same page commit reaches real Today and the next eligible
gym entry with the new operation basis". The chain that decides what Today stands on, measured:

- `today-app.cjs:2482` `function athleteBasisState()` imports `./local-source-basis.mjs` and returns
  `module.admittedLocalSourceState(setup)`, falling back at `:2488` to `setup.athleteState()`.
- `today-app.cjs:2490` `function adoptAthleteState()` calls it, then `model.adoptBasis(state)`,
  then `workout.gym.rebase()` and `workout.refresh()`.

NOTHING IN THAT CHAIN APPLIES A PLAN EDIT. A mount call and a router route put the editor on the
screen; they do not change what the gym card next opens on. So EW-14 forces one of three, and the
spec picks none of them:

(a) change `local-source-basis.mjs`. It is PRODUCT-PINNED in the S8 artifact (verified by query)
    AND SEALED BY NAME at `DECISIONS:536` (2), which lists
    `rebuild/m3/w7-preview/today/local-source-basis.mjs` explicitly. Most expensive.
(b) introduce a new unpinned composing module that takes the adopted basis plus the companion's
    `read(today).state` and returns the state to adopt, and change `athleteBasisState()` by one
    call. Cheapest honest option; still a sealed hunk in `today-app.cjs`, but a small one.
(c) make the companion's `read()` the adoption source outright, which changes the meaning of
    "admitted basis". I would reject that.

`local-source-basis.mjs` does not appear anywhere in the spec's section 3.2 path table, so the one
file this cell turns on is the one file the table omits. The consequence is not cosmetic: 3.3 line 3
sets the S10 hunk budget at "under 40 added lines and ZERO removed", 6.7 forbids any diff outside
the two files, and 9.3 prices the wiring half at 2 to 3 hours. All three numbers were computed
without the work EW-14 actually needs.

REQUIRED: section 3 names the adoption chain by file:line, picks (a), (b) or (c) in writing, shows
the exact `athleteBasisState()` hunk, adds the chosen file to the 3.2 table with its pin and seal
status, and re-prices 3.3 and 9.3. If the answer is (b), say so and say where the new module lives.

### B3. EW-04 and EW-15 have no tag provider, and the spec never names the gap

Section 2.1 lists `validateTags` and `projectNewExerciseTags` among the host's required arguments
and stops there. Both are hard, undefaulted dependencies, and neither has a production
implementation in the tree:

- `plan-edit-commands.cjs:66`
  `if (typeof validateTags !== 'function' || validateTags(...) !== true) fail('PLAN_EDIT_TAGS_INVALID');`
  fires inside `tagsOf`, which `editOf` calls for every `add` and every `replace`.
- `plan-edit-model.cjs:349`
  `if (typeof projectNewExerciseTags !== 'function') fail('PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE');`
  and `:350-356` then hold the projection to an exact shape.
- `grep -rln projectNewExerciseTags rebuild` returns the model, the host, the brief, the author
  report, `rebuild/lanes/STATUS-ARCHIVE.md`, five lane cells and exactly ONE implementation:
  `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs`. That file is in a LANE directory and it is
  PRODUCT-PINNED in the S8 artifact (verified by query), so promoting it is itself a reseal hunk.

So EW-04 (replace with a duplicate label) and EW-15 (the `:155` tag snapshots) cannot be made green
by any code that exists. Section 7.1 nevertheless says "the whole suite skeleton with all fourteen
cells written RED, against the merged companion, whose API is sealed and will not move under the
builder" can start today, and section 5 lists both cells as composed with no qualifier. A builder
following section 7.1 will write EW-04, watch it refuse `PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE`,
and have nowhere to go.

The spec's E4 and E6 refusal lists do include `PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE`, so the
author read the code. Reading it and not drawing the dependency is the gap.

REQUIRED: name the provider decision in writing. Either promote `f2-tag-adapter.cjs` to a product
path (a reseal hunk, which belongs in the section 3.2 table and in S10's budget), or write a new
page-side provider (a new unpinned VIEW-half or WIRING-half file, which belongs in the same table
and in 9.3). Until it is chosen, EW-04 and EW-15 are BLOCKED and section 7.1 must say so.

### B4. The fix is priced at "one line" with no stated derivation, and the codebase's own rule against a second spelling is never invoked

Section 4.4 says the hunk is "one line at `:665` plus the plan basis the companion already
computes". There is no such thing available where the fix has to run. `plan_basis` is a companion
(host layer) value; `programme()` and the capture callback in `source-admission.mjs` are handed
`ops` (`:438`), the whole operation map, and nothing else. The plan-mutation operations ARE in
`ops`, so the material exists, but the derivation from `ops` to "what this lift's set count was on
the capture's own date" does not, and the spec does not say who writes it or where.

This matters because of a rule the codebase states about itself, in this exact family, at
`plan-edit-model.cjs:61-63`, about `normaliseName`:

> "It must not be restated here: a second spelling of the rule is a second rule, and the bug would
> be silent."

A fix that re-derives edit semantics inside `source-admission.mjs` is that bug. The honest shape is
a pure folding function EXPORTED from `plan-edit-model.cjs` that reuses its own `apply()` and its
own ordering and validation, called from admission with the capture's date, which is already in hand
as `originalDay`. That makes the hunk two sealed files, not one line in one file.

The spec also never states the property it must not break: `documentSets` (`:228`) and
`documentProgramme` (`:237`) are out-parameters kept deliberately OUT of the returned basis, because
that object is the programme digest input and a new member would change a digest that binds what was
admitted. The comments at `:222-227` and `:229-237` say so in those words. A dated basis that
quietly becomes a basis member changes what was admitted. Section 4.1 quotes the out-parameter
mechanics and then section 4.3 rules without carrying the constraint forward.

REQUIRED: 4.3 says where the dated count comes from, by exported function name; 4.4 re-prices with
both sealed files; 4.3 adds the digest-invariance constraint as a rule the fix must satisfy.

### B5. State D invents a sentence for a refusal whose sentence is already in the code

Section 2.2 state D: "NEW: `The date changed while this was open. Review your change again before
saving.`", attributed to `plan-edit-host.mjs:23`.

At `plan-edit-host.mjs:23-24`:

```
const dayTurned = () => ({ ...refusal('PLAN_EDIT_DAY_TURNED'),
  message:'The day changed while this was open. Review the latest week before saving.' });
```

and immediately above it, at `:20-22`:

> "The one refusal this companion must SAY, not just make. Everything else here is a code lane C
> words; this one happens between a review and its Save, so the honest sentence travels with the
> code rather than being reconstructed."

The spec cites the line and then reconstructs the sentence anyway, in different words
("date" for "day", "Review your change again" for "Review the latest week"). This is the one refusal
in the companion where the copy is not lane C's to write, and it is also the spec's ONE claimed new
sentence, so section 2.3 law 4 ("Exactly ONE new sentence is proposed by this spec (state D)")
resolves to zero new sentences once this is corrected. Two spellings of one refusal is the same
defect class the codebase names at `plan-edit-model.cjs:61-63`, in copy instead of in code.

REQUIRED: state D carries `The day changed while this was open. Review the latest week before
saving.` verbatim from `plan-edit-host.mjs:24`, marked as SOURCED FROM CODE rather than NEW, and
section 2.3 law 4 is restated as "this spec proposes NO new sentence".

### B6. Reachability is asserted as fact, against the ledger's own words and against measurement

The authority line (spec `:11-12`) reads ":532 (the owner has imported, so the defect is
reachable)", and section 4's opening says ":532 makes it reachable: the owner HAS imported, so any
set count edit he makes from now on sits in front of any future import".

He cannot make one. Measured: `grep -rn 'createPlanEditHost' rebuild` returns the export itself
(`plan-edit-host.mjs:42`), two Astra review annexes under `rebuild/lanes/astra/reviews/`, and four
lane D cells under `rebuild/lanes/d/plan-edit/`. NO page, host, entry or app module constructs the
companion. `today-entry.mjs` exports `createCheckInEntry` (`:49`), `createSetupEntry` (`:93`),
`createWorkoutEntry` (`:150`), `boot` (`:226`), `watchDayRollover` (`:471`), `mountToday` and
`createTodayModel` (`:533`), and nothing plan-edit shaped. The spec says as much itself at 1.3:
"Nothing else exists for this item anywhere in the tree."

`DECISIONS:510` says, verbatim: "Edit My Week amends state and writes no second setup op, so a
capture recorded AFTER an edit that moved a set count would refuse capture_sets (reachability open;
noted for Edit My Week part 2)". `DECISIONS:532` records the import and the follow-ups and says
NOTHING about reachability. The spec upgrades an open question to a settled fact on the authority of
a line that does not address it. The ticket handed the author this exact claim as a lead to verify;
it was carried instead.

The correct statement, and it is stronger for the PM, not weaker: the refusal is unreachable today
because nothing constructs the companion, and it becomes reachable ON THE DAY PART 2'S WIRING HALF
SHIPS, for any athlete who edits and then admits an import. The owner's completed import removes one
of the two orderings; the remaining ordering (edit, train, re-admit) is still supported, and
`rebuild/lanes/d/import-retract/retract.test.mjs` proves retract-and-re-import exists.

Credit where it is due: the PLAN this produces is already right. 3.3 line 5 and 4.4 put the
admission hunk in the SAME S10 child as the wiring half, and 4.3 ruling 3 supplies an interim if
they are split. That is the correct schedule. It is the stated reason that is false, and a false
reason is what gets re-litigated when S10 is being trimmed.

REQUIRED: rewrite `:11-12` and the opening of section 4 to the measured statement above, and keep
the schedule exactly as it is.

---

## NOTES

### N1. Cite drift in two tables, off by one in the same direction

`plan-edit-commands.cjs` `editOf` starts at `:69`. Measured: `update` is `:71-74`, `remove` is
`:75`, `add`/`replace` are `:76-79`. The spec's 2.1 table says `:71-:75`, `:76`, `:77-:81` and
`:77-:82`. Same for the host handle: `cancel(review_id)` is at `:252` and `close()` at `:253`, not
`:254` and `:255`. Everything else I sampled was exact: `read` `:162`, `review` `:163`, `save`
`:190`, `createPlanEditHost` `:42`, `PLAN_EDIT_HOST_INCOMPLETE` `:53`, `dayTurned` `:23`,
`nextLocalDate` `commands:41`, `CHANGES` `commands:46`, `fieldOf` `commands:47`,
`capture_sets` `source-admission.mjs:665`, `documentSets` mint `:431`, hand-in `:438`,
`machine-settings-view.mjs` `:23` `:28` `:53` `:115`, `machine-settings-host.mjs` `:63` `:93`,
`today-app.cjs:826`, `today-entry.mjs` `:30` `:93` `:141` `:150` `:226`. The spec's 2.1 table also
lists `read` at `:208` and `review` at `:209`; those are wrong by 46 lines, and I suspect the author
read the returned handle rather than the method definitions.

### N2. The seal query counts the wrong set, even though every answer it gives is right

Section 3.2's method says a script "parsed `acceptance-s8-real-shape.json` into the set of
`rebuild/...` paths it names (229 of them)". 229 is every `rebuild/`-shaped string ANYWHERE in the
artifact, across `product`, `executionPins`, `gates` and `children`. The artifact actually holds
`product` with 224 keys, `executionPins` with 71, `protectedSurfaces` with 2, union 227. Those are
different lists with different consequences: `product` is the pin list a reseal child exists to
move; `executionPins` are test and spec pins. I re-ran every row of the 3.2 table against `product`
alone and EVERY YES/NO IS CORRECT, so nothing downstream is wrong today. The method is what would
mislead the next hand.

The spec does keep PINNED and SEALED apart properly and gives the right counter-example
(`rebuild/coach/machine-settings-commands.cjs`, absent from the seal and SEALED by name at `:536`).
Credit for that.

### N3. The second pinned `build.mjs` is missing from the table

There are TWO pinned `build.mjs`: `rebuild/m3/w7-preview/today/build.mjs` (in the table) and
`rebuild/m3/w7-preview/build.mjs` (both PRODUCT, verified). Adding a bundle input touches the today
one, so the spec's row is the right one, but a builder searching for "build.mjs" will find two and
the spec should say which and why.

### N4. The CI registration is allocated to neither half nor to any child

`.github/workflows/rebuild.yml` is PRODUCT-PINNED (verified). Section 6.3 correctly calls
registering the new suite "a PM owned CI and pin handoff", but 3.3 names two wiring files and 6.7
forbids any diff outside them, so the pinned workflow hunk lives in no half, no child and no
estimate. Say which child carries it.

### N5. Two in-scope refusals have no sentence, and one of them already has a SOURCED one

State E5 lists `PLAN_EDIT_DAY_UNCOVERED` among the refusals it must draw, and gives it no copy. The
brief's own Exact copy table has the sentence, at `BRIEF-EDIT-MY-WEEK.md:61`:
`Choose a training day for each exercise before saving.` It is SOURCED and unused. `PLAN_EDIT_WEEK_EMPTY`,
also listed in E5, has no sentence anywhere. The ticket asks for verbatim copy for each state tied to
its refusal codes; two codes in the narrowest door are unsentenced.

### N6. State T merges six codes under one sentence that is not true for two of them

State T draws `PLAN_EDIT_REVIEW_STALE`, `PLAN_EDIT_STALE_BASIS`, `PLAN_EDIT_BASIS_INVALIDATED`,
`PLAN_EDIT_BASIS_SOURCE_CHANGED`, `PLAN_EDIT_BASIS_HASH_INVALID` and
`PLAN_EDIT_BASIS_HASH_UNAVAILABLE` with the brief's stale sentence, "Your week changed while this
was open." For `PLAN_EDIT_BASIS_SOURCE_CHANGED` (`plan-edit-host.mjs:77`) the week did not change:
the BASIS SOURCE did, because an import was admitted while the editor was open. For the two hash
codes the sentence is a guess about a storage fact. The spec's own copy law is that a sentence must
be true for its field. Either draw those separately or say in writing why one sentence is honest for
all six.

### N7. The pre-sync, local-only boundary is never stated in words

EW-01 in section 5 says "an enrolled athlete opens BOTH doors". As merged, the editor refuses
outright in a generation that has synced or has a plan: `plan-edit-model.cjs:226`
`(collections.sync?.frontier?.W ?? 0) !== 0` and `:227` recovery/snapshot plan both refuse
`PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE`, and `:242-243` refuse `PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT`
once `collections.plan` or `collections.planTransactions` is non-empty. E0 lists the code; no state
and no cell states the boundary. A builder will discover it at the first fixture with a sync
frontier.

### N8. `MACHINE_SETTINGS_INPUT_INVALID` is a throw, not a refusal reply

State M2 lists it as a refusal the screen draws. At `rebuild/coach/machine-settings-commands.cjs:39`
it is `const bad = () => { throw new TypeError("MACHINE_SETTINGS_INPUT_INVALID"); };`. The screen
must catch it, not read it off a reply. A one-word correction, but the M2 row as written tells a
builder the wrong shape.

### N9. Section 7.2 understates how long the Machine settings door waits

The row says it waits on C-UI-5, "which owns `machine-settings-view.mjs` and is sequenced after
C-UI-4". C-UI-5's own MAY CHANGE list (`rebuild/lanes/c/ui-port/C-UI-5.md:8-9`) is
`machine-settings-view.mjs`, `machine-settings-host.mjs` and "the gym stubs in `gym-app.mjs`". The
last two are PRODUCT-PINNED, so C-UI-5 is itself a reseal-child ticket unless S9 releases them, and
S9 does not (its closed list is two paths). S9's own A.3 says the same for C-UI-5. The door
therefore waits on C-UI-5 AND on whichever child carries C-UI-5's two sealed files. The spec is
right that part 2 itself takes zero bytes there; the WAIT is longer than the row says.

### N10. Two load-bearing reductions the spec earns but does not claim

3.2 correctly marks `today-bindings.mjs` and `workout-host.mjs` CALLED ONLY, zero bytes, but never
says WHY that is safe for the two arguments the host demands. It is worth stating, because it is
what keeps the S10 hunk small: `today-bindings.mjs:723` already exposes `liveDay()`, so the S4
real-day requirement costs zero sealed bytes there, and `setup-host.mjs:45` already exports
`setupsIn(generation, profile)`, so the `setupOperation` argument is reachable without touching a
pinned file (`setup-host.mjs` is not in the seal at all). Both verified.

---

## WHAT I TRIED TO BREAK AND COULD NOT

These are the probes I expected to land and did not. They are recorded so the next round does not
spend time on them again.

1. **A look invented instead of left to the design lane.** I searched the spec for a pixel value, a
   viewport number, a spacing rule or anything from `CLAUDE-DESIGN-BRIEF.md`. There is none. Section
   8.2 is a list of what C-UI-9 must DRAW, and 8.2 item 2 correctly leaves the panel-versus-route
   question open rather than answering it. The one number in the file, the 716 thumb edge in 8.2
   item 2, is quoted as C-UI-5's existing convention in a question, not asserted as this editor's
   layout. CLEAN.
2. **Section 8.1's finding.** Verified independently at `rebuild/c-ui-0-gates@ecbef86a`: a
   case-insensitive search of `rebuild/m1/approved-2026-09-18/` for "edit my week", "edit week" and
   "my week" returns ZERO files, and the same search over `rebuild/lanes/c/ui-port/` returns ZERO.
   C-UI-5's title line is verbatim as quoted. C-UI-2's LOCKED line is at `C-UI-2.md:11` and reads
   exactly as quoted. CORRECT AND CORRECTLY CITED.
3. **Section 3.1's S9 relay.** I synced `rebuild/b-s9-ui-pins@c0bb04e9` and read it. A.6 THE CLOSED
   LIST is exactly the two paths quoted; `build.mjs` is conditional on H18 (`S9-RELEASE-SPEC.md:218-219`);
   `today-app.cjs` is SEALED in A.2; A.3 gives `today-entry.mjs` SEALED at `today-entry.mjs:141`,
   `gym-app.mjs` at `:161-166`, `machine-settings-host.mjs` at `:63-85`, all as the spec relays
   them; OWNER-1 exists. The spec is also right that this breaks the scout's working assumption and
   right to say so. This is the strongest section in the file and it is NEWER information than the
   scout had.
4. **A wiring hunk hidden in the view half.** The four new VIEW files plus the `t-edit-week` block
   plus `preview.css` are all render-side, and 3.3 line 4 explicitly forbids editing
   `machine-settings-host.mjs` and `gym-app.mjs` and makes the attempt a STOP. I could not find a
   write smuggled into the view half. The gap is the opposite one: B2, work MISSING from the wiring
   half.
5. **A pinned or sealed path touched without saying so.** Every path in 3.2 has its pin status and
   its seal status and both check out against `product` and against `:536`. The omission is B2's
   `local-source-basis.mjs` and B3's tag adapter, which is a missing row, not a silent touch.
6. **A ruling that widens admission.** 4.3 ruling 1 keeps "a count matching NEITHER still refuses",
   which is the corruption case the check exists for. It does not widen. Its problem is B1 (too
   narrow) and B4 (no derivation), not permissiveness.
7. **A dash or a readiness word in the copy.** I counted: zero U+2013 and zero U+2014 in the whole
   spec file, and no readiness vocabulary and no exclamation mark in any proposed sentence. The
   SOURCED strings match `BRIEF-EDIT-MY-WEEK.md:41-60` word for word, including the two Saved
   sentences and the two helpers. Section 2.3 law 1 correctly routes rendering through
   `plain-copy.cjs` (`plainCopy`/`plainOrDrop` at `:46`/`:80`, imported by `today-entry.mjs:30`).
   Law 3's warning that `browser-check.mjs` is not evidence until S9 gives it a CI home is a good
   catch and `browser-check.mjs` is indeed absent from the seal.
8. **Cells that restate the implementation instead of pinning behaviour.** The section 5 table is
   written in outcomes, not in call sequences, and 5.1 correctly demands the real host and the real
   durable client with synthetic fixtures only. EW-11 is close to a re-assertion of the companion's
   own cells, but the spec says "mostly a re-assertion" is not its claim and orders it second
   because it gates the screens, which is a defensible reason to keep it.
9. **A date control.** None offered. 1.2 (a) correctly derives the date from
   `nextLocalDate(liveDay())` and never from a page clock, which matches the triple assertion in the
   code (`commands:121`, `host:91`, `host:136-137`). `mg` is correctly absent from the editable
   set, matching `CHANGES` at `commands:46`, and `day` is correctly restricted to U and L.
10. **Q-E.** I checked it: `design.cjs` and `today-model.cjs` are named as release candidates at
    `:536` and are BOTH absent from the S8 `product` map. The spec's finding is correct and worth
    the PM's attention.

---

## WHAT THE FIX ROUND CHANGES, IN ORDER

1. B5, fifteen minutes: state D takes the code's sentence verbatim; 2.3 law 4 becomes zero new
   sentences.
2. B6, fifteen minutes: the authority line and section 4's opening state measured reachability. The
   schedule does not move.
3. B1, then B4: section 4 rules on three checks, EW-17 becomes three cells, 4.3 names the exported
   folding function and the digest-invariance constraint, 4.4 re-prices with two sealed files.
4. B2: section 3 names the adoption chain, picks an option, adds `local-source-basis.mjs` to the
   3.2 table, re-prices 3.3 and 9.3.
5. B3: the tag provider decision, with its file added to the 3.2 table and EW-04 and EW-15 marked
   blocked in 7.1 until it lands.
6. The notes, which are mostly one-line corrections.

The estimate in 9.3 should be re-run after B2, B3 and B4. As it stands, 22 to 29 hours omits the
adoption work, the tag provider and the second sealed file in the admission hunk.

## WHAT I DID NOT DO

I ran no test, installed nothing, launched no browser, and changed no product, test, tooling or
workflow byte. The only file this branch gains from me is this one. I did not read
`rebuild/conform/private`, any `ledger/` directory, `src/history.js`, the protected soak, or any
owner measurement, on either machine. The seal artifact was queried by script and never printed. No
credential appears above.
