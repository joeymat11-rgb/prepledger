# P3-PORT-FIX-SPEC: independent review R2

Lane D, same independent reviewer as R1, Opus high. I did not write the spec.
Re-check of `rebuild/lanes/d/P3-PORT-FIX-SPEC.md` at 1dec041 (spec v2, +466/-66)
over the product tree at 3d002174, in the worktree %TEMP%\earned-portfix. Read
only: no product file, no test file and no spec file other than this one was
modified by this review, and nothing was executed.

## VERDICT

**ACCEPT**, with ONE BINDING CORRECTION (B-1 below) that is a single-line spec
edit the build must carry, and two cite corrections. All three R1 BLOCKING
findings are resolved; the author's one dispute is upheld against me.

B-1 is not a new defect on the owner's path. It is the spec leaving the only
cross-file trip-wire on this rule pointed at a constant its own fix makes dead,
which is the same drift mechanism that produced BLOCKING 1, and the spec's own
stop rule would halt a build that fixed it. It is small, so it does not earn a
second REJECT; it is real, so it is binding rather than advisory.

---

## THE THREE BLOCKING FINDINGS

### 1. The Edit My Week companion refuses on the bundle this fix admits. RESOLVED.

Adopted in full as option (i), the option I named as the honest one. Verified in
the tree, not from the author's summary:

- `rebuild/m4/workout/plan-edit-model.cjs:22` `P2_ROW`, `:49-52` the origin
  predicate, `:88-89` the local-source row comparison plus the `n` shape check,
  and the module's own `:62-66` comment deriving its predicate from
  `source-admission.mjs programme()` are all exactly as quoted in new section
  1.6.
- `rebuild/m3/w6/host/plan-edit-host.mjs:69` binds
  `Model.importPresentIn(generation) ? 'local-source' : 'first-run'`, `:72`
  passes it as `basisSource` and `:75` passes `admittedBasisOf`, so the
  local-source branch is the one an admitted import takes.
- The file is pinned, `packages/S6.json:803`, same package and same seal as
  `source-admission.mjs`, so option (i) costs no second merge as claimed.
- Section 1.6's new predicate is sound against the code: the projector reads
  from `clone(base)` (`:254`), so the cell (k) assertion that a read returns the
  FILE's `sets` and `hi` is reachable; `checkExercise`
  (`rebuild/m4/workout/athlete-state.cjs:304`) copies `day` and `mg` verbatim
  out of the document, so comparing the basis row against the DOCUMENT row over
  `['id','day','mg']` is the same predicate admission proves against `scratch`;
  and the `n` check at `:89` is a shape check on the basis alone, so keeping it
  is correct and it proves nothing about the document.

The cells are the right ones. Cell (k) is red-first at model level, cell (a)
gains the companion assertion whose absence hid the whole finding, and the
first-run branch gets its own cell so a build cannot satisfy the ACCEPTS rows by
narrowing both branches. Section 8's closing instruction is the right one: the
build's FIRST task is to execute cell (a) with the companion assertion against
the pre-fix model and stop if it comes up green.

### 2. The 1.3 diff contradicted its prose and dropped `id`. RESOLVED.

`source-admission.mjs:150` measured again: it projects the returned basis
through `[...fields,'head','secondary']`, so narrowing `fields` did narrow the
programme digest, and `id` was in `fields` and therefore in the digest. The v2
diff carries a separate `PROJECTED_FIELDS=['id','day','mg','sets','hi','inc',
'steps','head','secondary']` beside `fields=['day','mg']`, the prose no longer
says the opposite of the diff, and 5 (a) asserts the committed programme digest
input carries `id` and all seven per-lift members with the FILE's values. The
`priority_muscles:source.priority_muscles??[]` move is consistent with 1.6
dropping that comparison in the companion.

### 3. The corpus change was larger than 4.3 declared. RESOLVED.

`git grep -n STRANGER_SETUP -- rebuild` measured again: `support.mjs:77-79`
varies only `athlete_label` and `exercises[0].sets`, and the four seal sites are
`refusals.test.mjs:20`, `refusal-route.test.mjs:23`, `route.test.mjs:264` and
`rebuild/lanes/d/import-retract/retract.test.mjs:28`. All four are named in 4.4
by name and line. Both missing pinned suites are now in 4.3 with their pins
verified here: `retract.test.mjs` at `S6.json:183` with child `d-import-retract`
at `:1282-1286`, and `lanes/d/plan-edit/model.test.cjs` at `S6.json:228` with
child `d-plan-edit` at `:1247-1251`. The three import suites are marked CHANGED,
not ADDED-only. The 7.1.1-versus-cell-(e) collision is ruled: `STRANGER_SETUP`
stays byte for byte as the admits-then-not-adopted fixture, its `:72-76` comment
is corrected (I read it; it does currently claim to be what the wrong person's
bundle looks like to the controller, which the new rule falsifies), and
`STRANGER_WEEK_SETUP` is added for the refusals. Retargeting the four seal lines
reaches every downstream use in those files (`refusals:80`,
`refusal-route:160,:192,:450`, `retract:93,:309`), and since the new fixture
keeps the different label as well as the different map it is a strict superset,
so no refusal weakens.

### NOTE 6, third bullet. DISPUTE UPHELD: the author is right and I was wrong.

Measured at 3d002174, `rebuild/m3/w6/local/source-admission.mjs:178` is
`days.add(row.date);last=row.date;`, `:179` is the `applyRead` line and `:180`
is the F1 family push. The spec's `:179` stands unchanged. My R1 bullet was off
by one and is withdrawn. The other three bullets of NOTE 6 were adopted and I
confirm `athlete-state.cjs:331` is `split: [split],` and
`local-source-basis.mjs:54` is the label guard.

---

## B-1. BINDING CORRECTION: the fix leaves the one trip-wire on this rule dead

Section 1.6 rules that `P2_ROW` "is kept under its own name for whatever else
reads it while `P2_SHAPE_ROW` is added beside it". Measured, `git grep -n P2_ROW
-- rebuild` returns exactly three readers of the constant:

    rebuild/m4/workout/plan-edit-model.cjs:88     the comparison 1.6 narrows
    rebuild/m4/workout/plan-edit-model.cjs:282    the export
    rebuild/lanes/d/plan-edit/model.test.cjs:388  the trip-wire cell

and that cell is:

    388|  assert.deepEqual(P2_ROW,['id','day','mg','sets','hi','inc','steps'],
    389|    'source-admission.mjs programme() proves exactly these, and not the name');

So "whatever else reads it" is nothing: after 1.6, `P2_ROW` is exported and
asserted and used by no code path. Worse, that assertion is the ONLY mechanism
in the tree that ties the companion's field list to `programme()`. Under the
spec as written it stays GREEN while its stated reason becomes FALSE, the live
constant `P2_SHAPE_ROW` gets no trip-wire at all, and the next narrowing of
`programme()` would drift exactly as this one did. That drift is what BLOCKING 1
was, and 7.1.0 promotes it to the top risk in the same document.

The spec also makes the correct action costly: 4.3 and 5 (h) rule that
`model.test.cjs` "must have NONE" red and that "a red cell in `model.test.cjs`
means 1.6 was implemented as something other than a widening and the build
stops". A build that does the honest thing here turns `:388` red and would, by
that sentence, stop.

REQUIRED, and it is one line of spec plus one named cell:

1. The live list is narrowed under its own name and the dead one is not kept for
   appearances. Whether that is `P2_ROW` narrowed to `['id','day','mg']` for the
   local-source branch or `P2_SHAPE_ROW` added and `P2_ROW` RETIRED from the
   module and its export is the build's call, but no constant survives whose
   only remaining reader is the assertion about it.
2. `model.test.cjs:388-389` is retargeted at whatever the live local-source list
   is, with its message restated to the new rule, and is named in 4.3 as a
   CHANGED cell and in the build report with its before and after, exactly as
   4.4 requires of the four stranger call sites.
3. The stop rule in 5 (h) is reworded to "no red cell in `model.test.cjs` other
   than the named trip-wire", so the correct action does not trip it.

Nothing in 1.6's table, its cells or its estimate changes because of this.

---

## NOTES

### N-1. Four cites in 1.6 and 4.1 are off, and one of them is my error propagated.

Measured in `rebuild/m4/workout/plan-edit-model.cjs`:

- the local-source TAG comparison
  (`if (!firstRun) { if (!equal({ head: e.head ?? null, secondary: e.secondary
  ?? [] }, tags)) tagsOk = false; }`) is at `:92`, not `:90`. Line `:90` is
  `if (origin.payload.tags !== undefined) {` and `:91` is the `C.tagsOf` call.
  R1 quoted it as `:90` and v2 carried that forward in 1.6, its table, 4.1 and
  section 6; the cite is mine originally and all of them should read `:92`.
- the `basisSource` validation is at `:76`, not `:78`. `:78` is
  `const baseIds = new Set();`.
- the tag KEY-SET check is at `:102-103`, not `:91-93`. `:93-97` is the
  first-run tag branch.
- `PLAN_EDIT_BASIS_SOURCE_CHANGED` is at `rebuild/m3/w6/host/plan-edit-host.mjs:77`,
  not `:72`. `:72` is `basisSource:source,`.

The substance is unaffected in every case, because 1.6 quotes the lines
verbatim and names the comparison it changes, so no build can mistake which
line is meant. Fix the numbers.

### N-2. `route.test.mjs:264` is not a cell the new rule turns red.

4.3 says the `:264` cell "asserts a refusal that the new rule no longer
produces" and 5 (h) counts it among "THREE of them already known to go red".
Measured, `:264-269` seals a STRANGER bundle only to arrive onto a device that
already holds operations, and it asserts `third.rebaseRequired === true` and
`third.code === 'LOCAL_IMPORT_REBASE_REQUIRED'`, which the machinery answers
before any programme comparison. That cell stays GREEN under the new rule.
Retargeting its seal line to `STRANGER_WEEK_SETUP` is harmless and keeps the
fixture story straight, but the spec should say so rather than predicting a red
that will not happen: a build report that names three known reds and finds two
looks like a miss. The two genuine ones are `refusals.test.mjs:80` and the
`refusal-route.test.mjs` cells fed from `:23`, plus the `retract.test.mjs`
cells at `:93` and `:309`.

### N-3. No third guard found, by my own sweep.

I ran the 7.1.0 sweep in the direction that matters most and found nothing the
spec has missed. The consumers of `admittedLocalSourceState` /
`admittedLocalSourceBasis` outside tests are `plan-edit-host.mjs`,
`today-app.cjs`, `local-source-basis.mjs` itself and
`rebuild/m3/w7-preview/measure/measure-baseline.mjs`; the last one takes the
admitted state at `:42` and passes it straight to `baselineWeeksFromState` with
no comparison against any setup document, so it is a consumer and not a guard.
`git grep -n "payload.setup"` over `rebuild/m3`, `rebuild/m4`, `rebuild/engine`
and `rebuild/coach` returns product hits only in `source-admission.mjs`
(the subject), `plan-edit-model.cjs:45,:48` (1.6), and the setup plumbing that
carries the document (`today-bindings.mjs`, `setup-host.mjs`,
`setup-commands.mjs`), none of which compares a basis to it. That is not a
substitute for the build's own sweep, which must still run and report, but the
spec's two named guards are the two I can find.

### N-4. The rest of the R1 NOTEs, checked and closed.

NOTE 4 (`priority_muscles` has a reader and it is a guard), NOTE 5 (the
`secondary` cite, corrected to the stronger conclusion), NOTE 7 (the period
shape, promoted to rule B-C and carried in the diff), NOTE 8 (the detail spread
guarded in the diff, with a cell asserting an issue with NO `field` member) and
NOTE 9 (the one-clock-per-file requirement stated as a build requirement and
executed by a row in 5 (i)) are all adopted as the author says, and I checked
each against the v2 text rather than the summary. The three observations the
author lists as adopted-without-being-findings are in fact in the document: the
multi-period inertness argument in 7.1.3, the live-clock technique in 5 (a), and
the withdrawal of the bare ":451" cite in 5 (i).

The re-estimate from 4.5 to 6.75 days is stated with its four build steps
separated, which is what I asked for. I have no independent basis for the
numbers and do not endorse them; I confirm only that the work findings 1 and 3
add is now visible as its own lines rather than absorbed.

---

## WHAT I DID NOT VERIFY

1. I still ran NOTHING. No suite, no cell, no build. Every statement above is a
   read of the tree at 3d002174 plus `git grep` and `findstr`. BLOCKING 1
   remains a code reading by two people; the spec now says the build must
   execute it first, which is the right disposition.
2. Whether the Edit My Week screen is reachable on the owner's S7 phone. Still
   a packaging fact I have not measured. It no longer decides anything, because
   the spec took option (i), which is correct whether or not the screen ships.
3. The 6.75-day estimate, beyond the paragraph above.
4. `replay-core.cjs`, unchanged from R1: I took NO CHANGE EXPECTED on the
   argument given.
5. The owner's real bundle. Nothing about it is knowable here. No private path
   was read by this review.

Reviewer: lane D, Opus high, independent, told to disagree. One dispute went
against me and is recorded as such.
