# EW2-SPEC REVIEW R2, INDEPENDENT

Reviewer: cowork (Earned lane hand), Opus, 2026-09-19. Reviewed file
`rebuild/lanes/d2/EW2-SPEC.md` (935 lines) at branch `rebuild/d2-ew2-spec` head
`63710d2d`, against review R1 (`EW2-SPEC-REVIEW-R1.md` at `0695493`) and the v1 to v2 diff
(`c17fac86..63710d2d`, 801 changed lines in the spec). The author is gone; this review commits one
file and moves no other byte.

Method: the spec, the ledger, the code and the two other branches were read in the PM's cloud farm
mirror. The chain tip is now `c15a69c0`; `git diff 0794771..c15a69c0` over the whole tree is
`rebuild/DECISIONS.md` and `rebuild/lanes/STATUS.md` ONLY, so the spec's base, its stated
re-measurement head `724ef3fc` and today's tip agree line for line over every product file cited
here and no cite is excused by drift. `rebuild/b-s9-ui-pins` was synced and read at `d859096a`;
`rebuild/c-ui-0-gates` at `ecbef86a`. `rebuild/m4/spec/acceptance-s8-real-shape.json` was queried by
my own script and never printed. I was also handed BLIND NOTES written by a hand who never saw the
spec; where they and the spec disagree I opened the file, and section 4 below records who was right.
No private, ledger, soak or history path was opened on either machine. No credential appears here.
Zero U+2013 and zero U+2014 in this file.

## VERDICT: REJECT

Six BLOCKING findings. **None of them is a repeat of R1.** All six of R1's blocking findings are
genuinely fixed, fifteen of its sixteen items are fixed, and its one disputed item is disputed
CORRECTLY: I re-ran the seal query myself and the author is right, R1 was wrong (section 4, N2).
The document is materially better than v1 and the sections R1 could not break I could not break
either.

The REJECT is for what the fix round itself introduced. v2 added three substantial new pieces of
design (3.4 the adoption chain, 3.5 the tag provider ruling, 4.3 the three-check fix) and each one
carries a defect that would reach a builder:

- the composing module 3.4 invents is filed in the VIEW half and opens a durable host (B1);
- the four-line hunk 3.4 prints cannot be written as printed, and the only reading of it that
  compiles bricks the editor after one structural edit (B2);
- the ruling of 4.3 widens two of the three checks it is fixing (B3);
- the folding function 4.3 specifies would fold retracted and unproven edits (B4);
- 3.5 states the tag refusal fires in a place it does not fire (B5);
- the one sentence the round recovered is filed under the one state that cannot raise it (B6).

B1 and B2 are the serious pair. They are the two ends of the same new section.

---

## 1. BLOCKING

### B1. The VIEW half now contains a file that opens a durable host, which is the wiring act the split exists to keep out

Section 3.3 line 1 lists `edit-week-basis.mjs` among the SIX NEW files of the "VIEW half, lane C, no
reseal, buildable NOW". Section 3.4 then says what it does: it "opens the companion through the
caller's factory, calls `host.read()` once, closes it".

Measured, that is not a render-side act. `host.read()` is `plan-edit-host.mjs:162`, which enqueues
`readVerified` (`:145`), which calls `lane.reopen()`. Constructing the host at
`plan-edit-host.mjs:42` requires `client.hostBindings` and calls it at `:83`. So this file opens a
durable client lane and builds a host. The spec's own split rule (3.2, and the VIEW/WIRING columns)
is that the view half touches no host and no client; 3.3 line 4 makes editing a sealed host a STOP.
The file is unpinned, which is a fact about the seal artifact, not a fact about what it does.

This is no longer only a purity argument. `DECISIONS:542` (C), which landed AFTER the spec's base
and which the author could not have read, rules TODAY-SPLIT and dispatches it with, verbatim, "a
sealed WRITER-FENCE cell that fails when any file outside the sealed inventory calls a writer, opens
IndexedDB or imports a host". `edit-week-basis.mjs` as specified is exactly that file: outside the
inventory, imports a host, reopens a lane. Under the ruled fence it fails.

I do not hold the ledger's movement against the author, and I say so plainly: this is not an error
he made. But the spec is judged today, and today the fence is ruled.

REQUIRED: either `planEditedState` moves into the WIRING half (a sealed file, and 3.3 line 3's
budget and 9.3's price move with it), or the view-half file is reduced to a PURE function that
receives an already-read `{state}` from the wiring half and composes nothing durable. The second is
cheaper and is what 3.4's own words ("it re-derives NOTHING") already describe; the spec simply
files it on the wrong side of its own line. Whichever is chosen, section 3.2's table needs the row
and section 6.7's VIEW-half "no diff outside" clause needs re-reading against it.

### B2. The exact hunk of 3.4 cannot be written as printed, and the only reading of it that compiles bricks the editor after one structural edit

Section 3.4 prints THE EXACT HUNK and calls it "four added lines and zero removed". Three separate
problems, in rising order of seriousness.

**(i) It is not appendable.** The chain it appends to ends at `today-app.cjs:2488`:

```
      .then((imported) => { importAdmitted = !!imported; return imported || setup.athleteState(); });
```

That line terminates the statement with a semicolon. Appending `.then(...)` after it requires
changing `:2488`, so the hunk is four added lines AND one changed line, and "ZERO removed" is not
achievable as written. Small, but 3.3 line 3 makes the number a rule and 6.7 makes the diff the
proof, so a builder will be measured against a number the spec cannot meet.

**(ii) `openPlanEditHost` does not exist.** The hunk passes it as the second argument.
`grep -n 'openPlanEditHost' rebuild/m3/w7-preview/today/*.cjs *.mjs` returns nothing at the tip, and
section 3.3 line 2 lists the `today-app.cjs` wiring as exactly "ONE route in the `[data-go]` router
at `:826`, ONE mount call, AND the adoption `.then`". So the factory the hunk depends on is in
neither half, neither budget, nor the 3.2 table. Constructing it is not a line: `createPlanEditHost`
(`plan-edit-host.mjs:42`) takes ten arguments, six of which (`client`, `clock`, `liveDay`,
`newIntentId`, `athleteLabel`, `namespace`) are hard-required and two of which do not exist in
product at all by the spec's own 3.5.

**(iii) The basis the host is built on is unspecified, and the obvious answer is a self-feeding
loop.** This is the part that would ship broken.

`createPlanEditHost` requires `basisState`. Section 2.1 says only that "the page passes them beside
`admittedLocalSourceState`". The only function in `today-app.cjs` that produces an athlete state for
the page is `athleteBasisState()` at `:2482`, which is the very function 3.4 rewrites to return the
PLAN-EDITED state. A builder handed 3.4 and nothing else will pass it. Measured consequences:

- **Imported installation.** `plan-edit-model.cjs:237-:240`: `inspect()` computes
  `adopted = admittedBasisOf(generation)`, which is `local-source-basis.mjs:32
  admittedLocalSourceBasis`, returning `clone(view.state)`, and then
  `if (!equal(adopted, base)) fail('PLAN_EDIT_IMPORTED_BASIS_MISMATCH')`, where `base =
  clone(basisState)` (`:107`). An edited `basisState` is not byte-equal to the admitted view state.
  The editor refuses to open, permanently, from the first saved edit.
- **First-run installation.** The `equal` guard is skipped, so the edits apply TWICE.
  `result()` (`:370`) does `let state = clone(base)` and replays every active edit over it. An `add`
  or a `replace` hits `plan-edit-model.cjs:346`
  `if (state.exercises.some(e => e.id === row.id)) fail('PLAN_EDIT_ID_REUSED')`. A `remove` hits
  `:321` `(state.retirements || {})[target.id]` and fails `PLAN_EDIT_TARGET_UNAVAILABLE`. Same
  outcome: `read()` refuses and the editor will not open.
- **If the factory reads `athleteBasisState()` lazily**, the loop is literal:
  `athleteBasisState -> planEditedState -> openPlanEditHost -> athleteBasisState`.

Nothing in the cell plan catches this. EW-13 ("reopen and replay reconstruct current and pending")
is the cell that would, and section 5 lists it "composed, blocked on nothing", to be written against
the host directly rather than through the page's adoption chain.

REQUIRED: 3.4 states in one sentence that the host's `basisState` is the RAW admitted or first-run
state and NEVER `athleteBasisState()`'s post-3.4 result, names the function that supplies it
(`admittedLocalSourceState(setup)` or `setup.athleteState()`, not the composed wrapper), says where
`openPlanEditHost` is constructed and which half and which budget carries it, and corrects the
"zero removed" claim. EW-13 or EW-14 then asserts that a second open after a saved `add` still
reads.

### B3. The ruling of 4.3 WIDENS two of the three checks it is fixing, and contradicts its own "nothing is relaxed"

Section 4.3 ruling 1 gives three right-hand sides. Two are disjunctions and one is a replacement:

- `capture_sets`: "a slot count is admitted if it equals the count the document prescribed **OR** the
  count an authenticated plan edit with `starts_on` on or before the capture's local date prescribed
  for that lift."
- `capture_lift`: "a lift is admitted if the admitted state carries it (unchanged) **OR** an
  authenticated plan edit ... ADDED it."
- `capture_membership`: compared against `sessionMembership(FOLDED, originalDay)` **instead of**
  `sessionMembership(documentProgramme.state, originalDay)`, with "Pool AND order are still compared
  exactly and in order. Nothing is relaxed."

The third is right and the first two are not, and the spec's own fold is what proves it. The whole
point of `foldPlanEdits(documentState, ops, onLocalDate)` is that for a given capture date there is
exactly ONE count the programme prescribed. The second disjunct IS that count. The first disjunct is
the unfolded document, which on any date at or after `starts_on` prescribed nothing. So ruling 1
admits a capture carrying the OLD count on a day the programme no longer prescribed it, which is
precisely the class of corrupt capture `source-admission.mjs:665` exists to refuse. The same holds
for `capture_lift`: after a `replace` the old lift is retired on `starts_on`, and the disjunct keeps
admitting captures that name it afterwards.

4.3 ruling 1 also keeps "A count matching NEITHER still refuses (D-PF-f5)" as its safety sentence,
which is exactly the admission that the ruling is a widening: the guard it names is two-of-two
rather than one-of-one.

The membership row shows the author knew the honest shape and used it. The other two rows should
read the same way: the right-hand side BECOMES the folded document's value for the capture's own
local date, and nothing else is admitted.

REQUIRED: 4.3 ruling 1 re-points `capture_sets` and `capture_lift` at the folded value for
`originalDay`, with no disjunct, matching `capture_membership`. EW-17a and EW-17c then each gain a
control that is currently impossible to write: a capture carrying the PRE-edit count, or naming the
REPLACED lift, on a date at or after `starts_on`, must still refuse.

### B4. `foldPlanEdits` as specified folds retracted and unproven edits, because `apply()` alone knows nothing about either

Section 4.3 ruling 2 specifies "a PURE function exported from `plan-edit-model.cjs`,
`foldPlanEdits(documentState, ops, onLocalDate)`, which reuses that file's own `apply()` (`:319`),
its own `exOrder` maintenance (`:315`) and its own validation", and then says it "authenticates
nothing itself: the caller passes the ops admission has already proved".

Two measured problems.

**(i) Admission has proved nothing about those ops.** `source-admission.mjs:218-:220` filters `ops`
for `payload.profile === Setup.PROFILE`, requires exactly one, and runs `Setup.validate` on THAT op.
Nothing else in `programme()` inspects the operation map. A plan-mutation op is
`{kind:'plan-mutation', class:'plan', payload:null}` (`plan-edit-commands.cjs:95`), so it is
invisible to `:218` by construction, which is the defect, and it is equally unproven when the fold
reaches for it.

**(ii) `apply()` is not where the proving lives.** Everything that decides WHICH edits count is in
`inspect()`, not in `apply()`:

- tombstones and status: `plan-edit-model.cjs:287-:294` and `:306` (`active` is
  `edits.filter(op => statuses.get(op.op_id) === 'active')`);
- duplicate intent `:298`, id reuse `:299`, causal invalidation `:300`;
- the seen-basis chain and the causal parent set `:307-:309`;
- date ordering `:310`;
- per-op command validation `:285` `commands.validate(op, id => ops[id])`.

A fold built over `apply()` and the raw `ops` map therefore applies an edit the athlete RETRACTED (a
tombstoned op), and an edit whose basis chain never proved. Since the fold is what the three checks
are re-pointed at, that is a widening of admission through the back door: a tombstoned set-count
change would make the old count admissible again, and a forged or half-written plan op in the store
would move the right-hand side of every check.

This matters more than it looks because the spec is right about the rule it quotes
(`plan-edit-model.cjs:61-63`, a second spelling of the rule is a second rule). The honest fix is the
same argument carried one step further: the thing to export is not `apply()` with a date, it is the
`inspect()` plus `result()` pair that already produces "the state as of a date" at
`plan-edit-model.cjs:369-:382`, with the basis, origin and tag collaborators admission can supply.

REQUIRED: 4.3 ruling 2 names which of `inspect()`'s proofs the exported fold runs, or states that
the fold reuses `inspect()` and `result()` rather than `apply()`. If the answer is "admission proves
them first", say which line of `source-admission.mjs` does it; there is none today. STOP 11's
digest-invariance constraint should gain a twin: a fold that admits a tombstoned edit is not
shipped.

### B5. 3.5 states where the tag refusal fires, and it fires somewhere else

Section 3.5, second bullet, and 10.1's B3 row both say:

> "`plan-edit-model.cjs:349` ... This one fires only on the SAVE path (`if (op)` at `:348`); the
> review path at `:357` takes `edit.tags` directly. So a builder can reach a green REVIEW for `add`
> and `replace` and then refuse at Save, which is the worst order to discover it in."

Measured, a builder cannot reach a green review. `preview()` refuses first, before `apply()` is
called at all:

```
390:   if (input.edit.exercise && typeof projectNewExerciseTags !== 'function') fail('PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE');
```

and earlier still, `preview()` opens with `C.validateInput(value, { validateTags })` at `:385`,
which reaches `editOf` (`plan-edit-commands.cjs:69`), which for `add` and `replace` calls `tagsOf`
(`:78`), which refuses `PLAN_EDIT_TAGS_INVALID` at `:66` when `validateTags` is not a function. So
with no provider the order is: review refuses `PLAN_EDIT_TAGS_INVALID` immediately.

The CONCLUSION of 3.5 survives untouched and is correct: EW-04, EW-15 and EW-17c are blocked until
the F2 package lands. I verified the whole chain of evidence the author added and every link holds:
`f2-tag-adapter.cjs:64` `createSetupTagProjector`, `:195` its returned four, `model.test.cjs:511-515`
proving the lane copy sha256-equal to `git show f3e9561:rebuild/m4/workout/setup-tags.cjs`,
`:516-518` proving no runtime file mentions either name, `durable-host.test.mjs:24-32` saying the
same in words, and `rebuild/lanes/d/PLAN-EDIT-V2-AUTHOR-REPORT.md:8` naming the skipped commit and
"Nothing of F2 is on the tip in any form". `rebuild/m4/workout/` at the tip has no `setup-tags.cjs`.
That is good work and it is R1 B3 properly discharged.

But the failure ORDER is the operational content of the paragraph. It tells a builder to expect a
late, confusing refusal and it is the stated reason 3.5 calls this "the worst order to discover it
in". The true order is early and legible. A spec that mis-states which line refuses is the same
defect class R1 caught at B5 and B6, in the fix round's own new prose.

REQUIRED: 3.5's second bullet names `plan-edit-model.cjs:390` and
`plan-edit-commands.cjs:66` via `:385`, and drops the "green REVIEW then refuse at Save" sentence.

### B6. The one sentence the fix round recovered is filed under the one state that cannot raise it

R1 N5 asked for `PLAN_EDIT_DAY_UNCOVERED`'s sourced sentence. v2 put it in state **E5 Remove**:

> "on `PLAN_EDIT_DAY_UNCOVERED`, SOURCED from `BRIEF-EDIT-MY-WEEK.md:61`, `Choose a training day for
> each exercise before saving.`"

and lists `PLAN_EDIT_DAY_UNCOVERED` among E5's refusals.

`covered()` is never called on the remove branch. Measured in `apply()`:

- `plan-edit-model.cjs:330` `if (own(edit.changes, 'day')) covered(edit.changes.day);` inside the
  `update` branch, which is state **E3**;
- `:345` `const row = clone(edit.exercise); covered(row.day);` in the add/replace branch, which is
  states **E4** and **E6**;
- `:339-:343`, the entire `remove` branch: no `covered()` call.

So E5 draws a refusal it cannot receive, and the three states that CAN receive it (E3, which the
spec itself says edits `day`; E4; E6) have no sentence for it. The sentence is correct and correctly
sourced; it is attached to the wrong door. `BRIEF-EDIT-MY-WEEK.md:61` labels its row "Coverage
error", which does not point at remove either.

Two smaller errors ride along in the same row: E5's refusal list is "the E3 set plus ...", and the
E3 set contains `PLAN_EDIT_NO_CHANGE`, which only the `update` branch raises (`:329`); and
`PLAN_EDIT_WEEK_EMPTY` (`:341`) is correctly placed, so E5's list is right about the one code that
is genuinely its own.

REQUIRED: move `PLAN_EDIT_DAY_UNCOVERED` and its sentence to E3, E4 and E6; remove it and
`PLAN_EDIT_NO_CHANGE` from E5. EW-05's cell then asserts `PLAN_EDIT_WEEK_EMPTY` only, and the day
coverage assertion moves to the update-with-day and add cells.

---

## 2. EVERY R1 FINDING: FIXED, STILL OPEN, OR DISPUTE UPHELD

I re-derived each one from the tree rather than accepting either document's account of it.

### 2.1 The six BLOCKING

| # | verdict | what I measured |
|---|---|---|
| B1 the ruling covered one of three checks | **FIXED** | New 4.1.1 tables all four checks by name and line. I opened each: `capture_producer` `source-admission.mjs:598`, `capture_lift` `:614` (`state.exercises` through `liftAttach` at `:613`), `capture_sets` `:665` (`documentSets`), `capture_membership` `:695-:699` (`encode` over `counts.keys()` against `sessionMembership(documentProgramme.state, originalDay)`). All four correct, in that order, inside the one `resolveCapturedLayout` callback opened at `:597`. EW-17 is now three cells with three named fields and three controls, and 4.2 names the ordering trap that `capture_lift` runs first. The added observation that the three breaks are CONTINGENT on 3.4 shipping is the author's own and it is right. **Fixed, but the ruling those cells now assert is defective: see B3 and B4 above.** |
| B2 EW-14 cannot be met by the wiring half | **FIXED IN SHAPE, NEW BLOCKERS IN THE FIX** | The chain is now named and every cite holds: `today-app.cjs:2482` `athleteBasisState` (imports `./local-source-basis.mjs`, `admittedLocalSourceState(setup)`, `.catch(() => null)`, `.then` setting `importAdmitted`), `:2490` `adoptAthleteState` (`model.adoptBasis`, `workout.gym.rebase`, `workout.refresh`), `today-model.cjs:219` `stateFromOps`, `:412` `adoptBasis`. The three options are stated and (b) is chosen with a reason I agree with. `local-source-basis.mjs` is now a row in 3.2 with the right pin and seal status. That is R1 B2 discharged. The NEW material it introduced is B1 and B2 of this review. |
| B3 no tag provider for EW-04 and EW-15 | **FIXED, AND THE FINDING GREW** | Verified `plan-edit-commands.cjs:66` and `plan-edit-model.cjs:349`, the single implementation `f2-tag-adapter.cjs`, its `product` pin (by my own query), the sha256 identity cell at `model.test.cjs:511-515`, `durable-host.test.mjs:24-32`, and `PLAN-EDIT-V2-AUTHOR-REPORT.md:8`. The ruling (land the existing package rather than write a second spelling) is better than either option R1 offered. 7.1 now says what cannot start. Only the stated refusal ORDER is wrong: B5 above. |
| B4 the fix priced at one line with no derivation | **FIXED IN SHAPE, ONE HOLE LEFT** | Verified `plan-edit-model.cjs:397-:398` exports only `createPlanEditProjector`, `importPresentIn`, `planEditCollections`, `P2_ROW`, so no fold exists to call; verified `apply()` at `:319` and the `exOrder` maintenance at `:315`; verified `programme()` is handed `ops` at `source-admission.mjs:438` and `originalDay` is in hand at `:674`. 4.3 ruling 2 names an exported fold and quotes `plan-edit-model.cjs:61-63` correctly. 4.3 ruling 3 carries the out-parameter constraint forward, verbatim from `:222-:228` and `:229-:237`, and STOP 11 refuses a fix that breaks it. 4.4 re-prices at two sealed files and 4 to 6 hours. All of that is right. What is still missing is WHICH proofs the fold runs: B4 above. |
| B5 state D invents a sentence already in the code | **FIXED** | `plan-edit-host.mjs:23-:24` read at the tip. State D now carries `The day changed while this was open. Review the latest week before saving.` verbatim, marked SOURCED FROM CODE, and law 4 reads ZERO new sentences. I diffed every SOURCED string in 2.2 against `BRIEF-EDIT-MY-WEEK.md:40-:61` character by character: all match. |
| B6 reachability asserted as fact | **FIXED** | New 4.0 states the measured position and withdraws the v1 claim in its own words. I re-ran the measurement: `grep -rn 'createPlanEditHost' rebuild` returns `plan-edit-host.mjs:42`, two Astra review annexes and four lane D cells, and nothing else; `today-entry.mjs` exports nothing plan-edit shaped. The schedule did not move, which is what R1 asked. |

### 2.2 The ten NOTES

| # | verdict | what I measured |
|---|---|---|
| N1 cite drift | **FIXED, with two new small drifts** | The corrected table is right: `read` `:162`, `review` `:163`, `save` `:190`, `cancel` `:252`, `close` `:253`; `editOf` `:69`, update `:71-:74`, remove `:75`, add and replace `:76-:79`. Two v2 cites are off: `readVerified` is `:145-:153`, not `:143-:152`; the STALE refusal's extra fields are `:214-:216`, not `:215-:217`. Both are in a sentence that claims every cite was re-measured. See note 3.7. |
| N2 the seal query counts the wrong set | **DISPUTE UPHELD, THE AUTHOR IS RIGHT** | I ran my own script against `acceptance-s8-real-shape.json` and printed nothing but counts: `product` **224**, `executionPins` **71**, `protectedSurfaces` **2**, union of two **227**, union of three **229**, distinct `rebuild/`-shaped strings anywhere **242**. So v1's 229 was exactly the union of the three key sets, not a regex sweep, and R1's diagnosis of it was wrong. The author's 10.3 is accurate on every number and adopts the recommendation anyway for the right reason. This is the correct way to answer a reviewer. |
| N3 the second pinned `build.mjs` | **FIXED** | Both `rebuild/m3/w7-preview/build.mjs` and `rebuild/m3/w7-preview/today/build.mjs` verified in `product`. The 3.2 row says which one this item touches and why the other is named. |
| N4 CI registration belongs to no half | **FIXED** | `.github/workflows/rebuild.yml` verified in `product`. 3.3 line 7 gives it to the PM on the S10 child and re-scopes 6.7 to the lane's own diff. Clean. |
| N5 two in-scope refusals have no sentence | **STILL OPEN** | `PLAN_EDIT_WEEK_EMPTY` is correctly left unsentenced and filed as Q-F, which is the right answer. `PLAN_EDIT_DAY_UNCOVERED`'s recovered sentence is filed under the state that cannot raise it: B6 above. |
| N6 state T merged six codes under one sentence | **FIXED** | Verified each code at its line: `BASIS_SOURCE_CHANGED` `plan-edit-host.mjs:77`, `BASIS_HASH_UNAVAILABLE` `plan-edit-model.cjs:101`, `BASIS_HASH_INVALID` `:104`, `BASIS_INVALIDATED` `:300` and `:309`. State T now draws three; the other three go to X and into 2.2.2. The reasoning about which three is correct. |
| N7 the pre-sync boundary | **FIXED** | Verified `plan-edit-model.cjs:226`, `:227`, `:235`, `:237-:238`, `:242-:243`. New 2.2.1 states the rule and EW-01 asserts it in both directions. |
| N8 `MACHINE_SETTINGS_INPUT_INVALID` is a throw | **FIXED** | `rebuild/coach/machine-settings-commands.cjs:39` verified verbatim. M2 says CATCHES. |
| N9 the Machine settings door waits longer | **FIXED** | `C-UI-5.md:8-9` MAY CHANGE list verified at `ecbef86a`; `machine-settings-host.mjs` and `gym-app.mjs` verified in `product`; S9's closed list verified as two other paths. 7.2's row is now right. |
| N10 two reductions not claimed | **FIXED** | `today-bindings.mjs:723` `liveDay:` verified; `setup-host.mjs:45` `export function setupsIn(generation, profile = PROFILE)` and `:131` its default export verified; `rebuild/m3/w7-preview/today/setup-host.mjs` verified absent from BOTH `product` and `executionPins`. New 3.6 claims both with the correct full path. |

**Tally: R1 B1 to B6 all FIXED. N1, N2, N3, N4, N6, N7, N8, N9, N10 FIXED. N5 STILL OPEN (half).
One DISPUTE, upheld in the author's favour.**

---

## 3. NOTES

### 3.1 The adoption module needs the tag providers too, and section 5 says it needs only 3.4

`edit-week-basis.mjs` calls `host.read()`, which runs `inspect()`, which runs
`commands.validate(op, id => ops[id])` for every plan-mutation op (`plan-edit-model.cjs:285`), which
runs `validateInput` and therefore `editOf` and therefore, for an `add` or a `replace`, `tagsOf` and
`validateTags` (`plan-edit-commands.cjs:78`, `:66`). So for a generation that carries an add or a
replace, the adoption read refuses without the F2 package. Section 5's EW-14 row says "blocked on
3.4's hunk" and 7.1 says the module "does not need the sealed hunk to exist in order to be written".
Both are true for a fake host and neither is true on a real phone. EW-14 is blocked on 3.4 AND 3.5.

### 3.2 The hunk's `&&`/`||` shape silently skips adoption entirely

`state && import(...).then(...).catch(() => state) || state` returns the promise whenever `state` is
truthy, so if `planEditedState` ever resolves to `undefined` the chain resolves to `undefined` and
`adoptAthleteState` takes its `if (!state) return;` at `today-app.cjs:2493` and adopts NOTHING: no
`adoptBasis`, no `gym.rebase`, no `refresh`, no `adoptEngineState`. The spec's contract for the
module forbids that, and STOP 9 half covers it, but a page that silently stops adopting is worse
than one that adopts a stale basis. The cell for the module should assert a returned state on every
path, including the `catch`.

### 3.3 `:325` is stale in the source's own comment, and the spec quotes it as measured

4.3 ruling 3 quotes `source-admission.mjs:224` verbatim, including "that object is the programme
digest's input at `:325`". The quotation is exact. The line number inside it is not: `:325` at the
tip is inside the exercise-id loop, and the programme digest is computed at `:779`
(`programme_digest: digest(platform.hash, 'earned/local-source-programme/v1', replayed.programmeBasis)`).
The CONSTRAINT is real and correctly stated; only the inherited number is stale. Since 4.3 ruling 3
is the thing STOP 11 refuses to ship without, its reviewer will follow that number. Say `:779`, or
say the number is the source's and is stale.

### 3.4 The S9 relay has one wrong member in a list of five

3.1 relays S9 A.2's "five IndexedDB lanes (`:513`, `:596`, `:637`, `:2052`, `:1416`)". Four are
IndexedDB openers at the tip. `today-app.cjs:1416` is
`const pending = Promise.resolve().then(() => checkin.host.forDate(day))`, which is not one. The
PM's own measurement at `DECISIONS:542` (A) lists the writers differently again (`host.save :493`
and `:581`, `model.weighIn :1072`, `foodLane.save :1293`, `sleepLane.save :1843`,
`workout.gym.rebase :2501`), and I verified all six of those. A relayed measurement should be
re-measured or marked as relayed.

### 3.5 PE-f2-identity does not need re-pointing

3.5 consequence 1 says "PE-f2-identity's `git show f3e9561:` read must be re-pointed at the merged
path when it lands". `model.test.cjs:511-512` reads
`git show f3e9561:rebuild/m4/workout/setup-tags.cjs`, a blob at a historical commit. Landing the
same file on a later commit does not change what `f3e9561` holds, so the cell keeps passing
untouched. The assertion at `:516-518` (neither runtime file mentions `f2-tag-adapter` or
`setup-tags`) also keeps passing, as the spec says. Drop the re-point.

### 3.6 Three cites that are close but not exact

- 4.1.1 says the `capture_lift` comment is at `:604-:612`; it runs `:601-:611` and the word "total"
  is at `:610`.
- 4.1.1 and 4.3 cite the add/replace mint as `plan-edit-model.cjs:344-:356`; the new row is pushed
  into `state.exercises` at `:358` and the order is maintained at `:359-:365`.
- 3.4 cites `gym-model.mjs:104` for "`hostForDay` rereads `model.stateFromOps()` at CALL time".
  `:104` is a COMMENT that says exactly that, not the code that does it. The claim is true; the
  cite points at prose.

### 3.7 The re-measurement claim is slightly wider than what was re-measured

The header says "Every cite below was RE-MEASURED at the chain tip `724ef3fc`". Counting 3.6, N1's
two residual drifts and 3.3, five cites were carried rather than re-counted. The overwhelming
majority ARE exact: I sampled forty and thirty five were exact. The claim should be narrowed or the
five fixed, because the next hand will trust it literally.

### 3.8 `DECISIONS:542` has moved three things under this spec

Landed after the base, so none of this is the author's error, but section 3 and section 9 need a
pass before the PM judges:

1. **TODAY-SPLIT is RULED**, on its own branch `rebuild/c-today-split`, spec first, and the ledger
   is explicit that it is "the PM's decision and not an owner question". Q-A is written as though
   it hangs on S9's OWNER-1 and the owner's answer. Q-A's recommendation ("do not wait to start")
   survives; its framing does not.
2. **The two-path closed list is PM-ACCEPTED and `:536` is not re-opened.** That is good news the
   spec could not have: STOP 2's first clause is now satisfied and section 3's arithmetic is
   confirmed rather than provisional.
3. **`browser-check.mjs` is ruled to stay outside with no CI home, run on the PC before each seal
   and recorded in the verdict.** 2.3 law 3 says EW2-BUILD may not treat it as evidence "until S9
   gives it one"; S9 never will. Restate law 3 as a standing rule.

### 3.9 A smaller thing worth a line in section 1

`:176` (2)'s custody line makes D2 the independent reviewer of lane C's editor IN ADDITION to the
screens tier's own reviewer. 6.6 says so correctly. Section 1 does not, and section 1 is what a
builder reads first.

---

## 4. THE BLIND NOTES AGAINST THE SPEC: WHO WAS RIGHT

I was handed notes written by a hand who never saw the spec. Where they and the spec disagree I
opened the file. Recorded so the PM can judge the blind-notes mechanism, not only this spec.

| subject | blind notes | spec v2 | measured |
|---|---|---|---|
| reachability | unreachable today, reachable when the wiring ships | same, in 4.0 | **BOTH RIGHT.** The blind hand and the fix round reached the same measured statement independently, from the same grep. |
| three broken checks | `capture_lift`, `capture_sets`, `capture_membership` break; `capture_producer` survives | same, 4.1.1 | **BOTH RIGHT**, same four lines. |
| the second-spelling rule | the fold must be exported from `plan-edit-model.cjs` and reuse `apply()` | same, 4.3 ruling 2 | **BOTH RIGHT ABOUT THE FILE, BOTH INCOMPLETE ABOUT THE PROOFS.** Neither noticed that `apply()` knows nothing of tombstones or basis chains (B4). The blind notes' own recommended signature `documentPlanAt(documentState, ops, throughDate)` has the same hole. |
| the digest invariance | must be preserved | 4.3 ruling 3, STOP 11 | **BOTH RIGHT**, and the spec carries it further (a named STOP). |
| EW-14 and option (b) | expects (b), demands the exact hunk | chooses (b), prints a hunk | **THE BLIND HAND WAS RIGHT TO DEMAND IT, AND THE HUNK DOES NOT SURVIVE INSPECTION** (B2). Neither document noticed the `basisState` loop. |
| the tag provider | "no production tag provider ... write a new page-side one or promote the pinned lane copy" | neither: land the UNMERGED F2 package at `rebuild/m4/workout/setup-tags.cjs` | **THE SPEC IS RIGHT AND THE BLIND NOTES ARE WRONG.** The evidence is `model.test.cjs:511-515`, `durable-host.test.mjs:24-32` and `PLAN-EDIT-V2-AUTHOR-REPORT.md:8`, all verified. A new page-side provider would be the second spelling both documents claim to forbid. Best single finding in the fix round. |
| where the tag refusal fires | silent on the order | "green REVIEW then refuse at Save" | **BOTH WRONG about the order; the spec is wrong on the page** (B5). `plan-edit-model.cjs:390` refuses on the review path. |
| the seal counts | `product` 224, `executionPins` 72, union 227 | `product` 224, `executionPins` 71, `protectedSurfaces` 2, union3 229, anywhere 242 | **THE SPEC IS RIGHT.** My own query: 224 / 71 / 2. The blind notes' 72 is off by one. Every YES and NO in the 3.2 table is correct against `product`, which I re-ran row by row. |
| the two `build.mjs` | names both | names both, 3.2 | **BOTH RIGHT**, both verified in `product`. |
| `liveDay` and `setupsIn` | zero sealed bytes, `today-bindings.mjs:723`, `setup-host.mjs:45` | same, 3.6 | **BOTH RIGHT.** The blind notes give `setup-host.mjs` without its directory; the spec gives the full path and notes there is no such file under `rebuild/m3/w6/host/`. The spec is more careful. |
| the design gap | zero references in the design of record and in the eight C-UI tickets | same, 8.1 | **BOTH RIGHT**, re-verified at `ecbef86a`: zero files match, `C-UI-5.md:1` is the workout panel title, `C-UI-2.md:11` is the LOCKED line verbatim. |
| the date control | must be forbidden | forbidden, 1.2 (a) and the R-state row | **BOTH RIGHT.** `plan-edit-commands.cjs:121` verified. |
| `PLAN_EDIT_DAY_UNCOVERED` | not raised | filed under E5 | **NEITHER SPOTTED IT.** Measured: `covered()` is called at `:330` and `:345` and never in the remove branch (B6). |
| the S9 closed list | not measured (the blind hand did not sync S9) | two paths, `build.mjs` conditional on H18 | **THE SPEC IS RIGHT**, verified at `d859096a`: `S9-RELEASE-SPEC.md:207-:221`. |

Net: the spec beats the blind notes on the tag provider, the seal counts, the S9 relay and path
precision; the blind notes beat nothing outright; and there are two defects (B2's `basisState`, B6's
`DAY_UNCOVERED`) that only fell out of reading the two against each other and then opening the file.
That is the mechanism working.

---

## 5. WHAT I TRIED TO BREAK IN v2 AND COULD NOT

Recorded so round 3 does not spend time here again. These are the ticket's own hunt list.

1. **A look invented instead of left to the design lane.** Still clean. I searched the whole file
   for a pixel value, a viewport width, a spacing token and anything from `CLAUDE-DESIGN-BRIEF.md`.
   The only number in section 8 is the 716 thumb edge, quoted inside a QUESTION about C-UI-5's
   existing convention, not asserted as this editor's layout. 8.2 is a list of what C-UI-9 must
   draw, and item 2 still leaves panel-versus-route open. 8.2 item 12, new in v2, correctly adds the
   two refusal faces. CLEAN.
2. **A dash or a readiness word in the copy.** Counted by script over the whole file: zero U+2013,
   zero U+2014, zero characters above U+2500. The word "readiness" occurs once, at line 196, inside
   the RULE that forbids it. No exclamation mark appears in any proposed sentence: the seven in the
   file are all inside quoted JavaScript (`!==`, `!!imported`, `!function`). Every SOURCED string
   matches `BRIEF-EDIT-MY-WEEK.md:40-:61` character for character, and state D matches
   `plan-edit-host.mjs:24` character for character. CLEAN.
3. **A pinned or sealed path touched without saying so.** I re-ran the whole 3.2 table against
   `product` with my own script: twenty-five rows, every YES and every NO correct, including the
   four rows v2 added. PINNED and SEALED are kept as two lists with the right counter-example
   (`rebuild/coach/machine-settings-commands.cjs`, absent from the seal, sealed by name at `:536`).
   I also checked the ones the spec does NOT claim: `gym-model.mjs`, `plain-copy.cjs` and
   `design.cjs` are all absent from `product`, which matches Q-E.
4. **A ruling that widens admission.** It does widen, and that is B3. But it does not widen in the
   way I expected: 4.3 keeps the corruption case refusing in all three rows and the membership row
   is exactly right. The widening is a disjunct, not a relaxation of the check.
5. **Cells that restate the implementation instead of pinning behaviour.** The section 5 table is
   written in outcomes. EW-17a, EW-17b and EW-17c each name a field rather than a call sequence, and
   each carries a control that would fail if the cell were passing for the wrong reason. 5.1's
   synthetic-only rule is explicit. The one cell I would still push on is EW-11, which is close to a
   re-assertion of the companion's own cells; the spec says so itself and orders it for a reason.
6. **A wiring hunk hidden in the view half.** Found exactly one, and it is B1. Everything else in
   the VIEW list is render side, and 3.3 line 4 still makes editing `machine-settings-host.mjs` or
   `gym-app.mjs` a STOP rather than a licence.
7. **The scope.** 1.1 restates the narrowing in its own words, keeps Days and Priorities and
   EW-06/07/10 out, and the new EW-17a/b/c are inside section 4's remit rather than a fourth door.
   No creep.
8. **The S9 relay.** Re-synced and re-read at `d859096a`: A.6 is the two paths verbatim, the H18
   condition is at `:218-:221`, and R2 is a REJECT whose two findings do not move the list. The
   spec's warning that S9 is NOT accepted was right at the time and `DECISIONS:542` has since
   accepted the list, which only strengthens it.
9. **The estimate.** 28 to 36 hours for the lane, with the admission hunk, the F2 package, the
   `.github` hunk and the S10 chain excluded and named. The exclusions are explicit and the v1
   column is kept beside it. I cannot fault the arithmetic; B1 and B2 will move the wiring row.
10. **The owner question.** 8.3 is one question in plain words with a recommendation and a reason
    taken from the owner's own words at `:176`. It does not ask him anything he has already decided
    and it routes through the design chat first. Good.

---

## 6. WHAT ROUND 3 CHANGES, IN ORDER

1. **B6, ten minutes.** `PLAN_EDIT_DAY_UNCOVERED` moves from E5 to E3, E4 and E6; `NO_CHANGE` leaves
   E5.
2. **B5, ten minutes.** 3.5's refusal order takes `plan-edit-model.cjs:390` and
   `plan-edit-commands.cjs:66`; the "green REVIEW" sentence goes.
3. **B3, half an hour.** 4.3 ruling 1's first two rows lose their disjunct and take the folded value
   for `originalDay`; EW-17a and EW-17c gain the control that proves it.
4. **B4.** 4.3 ruling 2 names which of `inspect()`'s proofs the fold runs, or exports the
   `inspect()` and `result()` pair instead of `apply()`. STOP 11 gains its twin.
5. **B2.** 3.4 pins `basisState` to the raw admitted or first-run state, names where
   `openPlanEditHost` is built and which budget carries it, and corrects "zero removed". EW-13 or
   EW-14 asserts a second open after a saved `add`.
6. **B1.** The composing module moves to the wiring half, or is reduced to a pure function fed by
   it. 3.2, 3.3 line 3, 6.7 and 9.3 follow.
7. The notes, which are line-level except 3.8, which is a pass over Q-A, STOP 2 and law 3 against
   `DECISIONS:542`.

B1 and B6 are the two that change what gets built. The rest are corrections to a document that is
otherwise the most carefully measured spec I have reviewed in this repo. If round 3 lands B1 through
B6 I expect to accept it.

## 7. WHAT I DID NOT DO

I ran no test, installed nothing, launched no browser, and changed no product, test, tooling or
workflow byte. The only file this branch gains from me is this one. I did not read
`rebuild/conform/private`, any `ledger/` directory, `src/history.js`, the protected soak, or any of
the owner's measurements, on either machine, and nothing outside the farm's include list was
fetched. The seal artifact was queried by a script that printed counts and per-path YES or NO only;
its contents were never printed. No credential appears above. Zero U+2013 and zero U+2014 in this
file.
