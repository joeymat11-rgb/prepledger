# P3-REAL-SHAPE INDEPENDENT REVIEW R2 (lane D build, Opus high)

## VERDICT

**ACCEPT.** Both BLOCKINGs of R1 are FIXED, and I re-measured each one with my
own R1 probe, unchanged, plus a fresh probe of my own written this round. The
machine-settings note that refused the whole import now admits and is retained;
the corresponded lift the file puts on the other day is now admitted, adopted on
the FILE's day and Edit My Week OPENS. Neither fix weakened the guard it moved -
I drove the refusing side of both myself. NOTE 3, 4, 5 and 6 are answered in the
product or written down as deliberate, which is what the fix round asked for.
The full bar reproduces byte for byte on my own run: **2015 pass / 11 fail**,
the same eleven pre-existing failures, and the engine/coach/DECISIONS numstat is
still EMPTY.

Three things stay open and all three are the PM's, not the build's: gap 5
(DECISIONS:521's own STOP), the identity trade at the seal, and DECISIONS:521
not being on this branch. One report sentence still contradicts its own
disposition (NOTE 2 below); it is prose, and I am not holding the seal for it.

Reviewed commit `1f6a1a9` on `rebuild/d-p3-real-shape` (`git diff 4f98e55..HEAD`
= six files: the report, the new cell file, the harness hook, `model.test.cjs`,
`source-admission.mjs`, `plan-edit-model.cjs`).

## 1. THE BAR, RE-RUN BY ME

Every suite re-run through `%TEMP%\rs-run.bat` on the same tree, logs
`%TEMP%\B-*.log`. Row for row identical to the author's report.

| suite | pass | fail | R1 | my log |
|-------|------|------|----|--------|
| `lanes/d/p3-real-shape/*.test.mjs` | 56 | 0 | 45 (+11) | `B-lane.log` |
| `lanes/d/p3-port-fix/*.test.mjs` | 35 | 0 | 35 | `B-s7.log` |
| `m3/w7-preview/import/test/*.test.mjs` | 35 | 0 | 35 | `B-imp.log` |
| `m3/w6/test/*.test.*` | 587 | 0 | 587 | `B-w6.log` |
| `lanes/d/plan-edit/*.test.*` | 90 | 0 | 89 (+1) | `B-pe.log` |
| `lanes/d/import-retract/*.test.mjs` | 13 | 0 | 13 | `B-ret.log` |
| `m4/import/test/*.test.*` | 90 | 0 | 90 | `B-m4i.log` |
| `m3/w7-preview/today/test/*.test.*` | 661 | 0 | 661 | `B-today.log` |
| `coach/test/*.test.*` | 234 | 0 | 234 | `B-coach.log` |
| `m4/workout/test/*.test.cjs` | 214 | **11** | 214/11 | `B-m4w.log` |
| **total** | **2015** | **11** | 2003/11 | |

The +11 is exactly the eleven cells of the new `r1-fixes.test.mjs`, all green on
my run. The +1 on plan-edit is the arithmetic of the ruling: two rows moved from
the refusal list to the editable list (+2), and one NEW refusal row added (+1),
which nets +1 against the count and -2/+1 against the refusal list itself.

The eleven failures are the same eleven files and the same two messages as R1
(`Explicit retained W6 root required` at module load, and the two
`h3-supersede-*` byte pins over `rebuild/engine/merge.cjs` / `today.cjs`).
`git diff --numstat 17c35f5..HEAD -- rebuild/engine rebuild/coach
rebuild/DECISIONS.md` is still EMPTY, so their inputs are unchanged.

## 2. LOCKDOWN, RE-SCANNED

- Engine / coach / DECISIONS numstat over `17c35f5..HEAD`: EMPTY.
- Twenty files in the range (eighteen at R1, plus `r1-fixes.test.mjs` and my own
  R1 review). No `.skip`, `.only`, `.todo`, `skip: true` or `t.skip(` in any
  product or test file (`%TEMP%\rs-rev\scan.cjs`; the two `MARK` hits are the
  prose of my own R1 review quoting the scan).
- One U+2013/U+2014 hit in the range, unchanged from R1 and from `17c35f5`:
  `m3/w7-preview/import/test/refusal-route.test.mjs:241`, the dash DETECTOR's
  own regex.
- Nothing outside `rebuild/lanes/d` and the two product files moved this round.

## 3. BLOCKING 1 - **RESOLVED**

`source-admission.mjs:524` now reads the note's id through the correspondence:

```
&&state.exercises.some(e=>e.id===(liftAttach(p.machine.exercise_id)??p.machine.exercise_id))
```

which is the one expression R1 named and the author's own FINDING 1 named.

**I re-ran my R1 probe unchanged** (`%TEMP%\rs-rev\f4.test.mjs`, log
`%TEMP%\R2-probes.log`), which writes the note through the shipped
`machine-settings-host.mjs` on the era and then carries the same bundle:

```
control (no settings op)               -> admitted = true   (as before)
one settings op on 'lateral-machine'   -> admitted = TRUE, issues []   (was FALSE)
```

That is the R1 measurement inverted, to the op id, with nothing else moved.

**AND I WROTE MY OWN, this round** (`%TEMP%\rs-rev\r2.test.mjs`, log
`%TEMP%\R2-mine.log`), because a guard that gets weaker to go green is the one
thing I will not take on the author's cell alone:

| my cell | result |
|---------|--------|
| `R2-B1` a note on a CORRESPONDED document lift | ADMITS, issues `[]`. PASS |
| `R2-B1g` a note naming a lift NEITHER side carries | REFUSES `LOCAL_SOURCE_CONTEXT_UNRESOLVED` on that op id. PASS |

So the guard still refuses what it refused before; what changed is only the
ADDRESS the named lift is looked up under. `D-RS-R1-b1a/b1b/b1c` say the same
three things through the lane harness and all three are green on my run. The
`before` hook added to `admitThrough` defaults to `null` and touches no existing
cell.

## 4. BLOCKING 2 - **RESOLVED** (option (a)), and the ruling is on the record

`P2_ROW` goes `['day','mg']` -> `[]`, the comparison over it stays live and
empty, and the `n` check beside it is untouched. This is R1's option (a).

**I re-ran my R1 probe R-P6 unchanged** (the file that puts `Calves` on the
other day): it ADMITS, it is ADOPTED, and the companion now returns instead of
throwing - `PLAN_EDIT_ORIGIN_UNPROVEN` is gone. **And my own new `R2-B2`** moves
BOTH members at once (day `U`->`L` and `mg` `hams`->`calves`) and reads the
adopted basis before touching the companion:

```
adopted day = L   (the FILE's)   mg = calves   (the FILE's)   companion = null
```

so the failure is REMOVED, not moved: what admission admitted, the editor edits.

**The guard did not go with it.** `plan-edit-model.cjs:194-195` still refuses a
row that reaches NO basis lift (`!e`) and a row whose basis lift a previous row
already bound (`boundBasis.has(e.id)`), and I read the new `PE17 (k)` refusal
row to be sure it exercises the SECOND arm and not the first: it renames basis
lift 0 to row 1's name and re-ids basis lift 1, so row 1 is FOUND by name on
basis 0 and dies on the duplicate binding. `D-RS-R1-b2c` covers the first arm at
the page. Both green.

**On the ruling itself I agree with the author's four reasons**, and section 11
states them where the PM can overrule in one line. The one I weigh most is the
third: (b) would refuse the whole import because he typed a lift on the wrong
day at first-run setup - the exact failure class this ticket exists to remove,
relocated. `day` and `mg` are still PROVED about the FILE at admission by those
two field names (`PF-c1n` still refuses a day that is neither U nor L), so
nothing became unbounded; it stopped being compared across two id spaces. The
narrowing is recorded in three places that a later reader will hit: `PE16`
recomputes `P2_ROW` against admission's proved set, the constant's comment
carries the whole history `['id','day','mg'] -> ['day','mg'] -> []`, and the two
moved `PE17 (k)` rows carry the reason in place.

## 5. THE NOTES

| R1 note | disposition |
|---------|-------------|
| NOTE 1, gap 5 | **STILL OPEN, PM.** Unchanged and correctly unchanged: DECISIONS:521 said STOP on it, record it and finish the rest. `q1-producer` and `D-RS-h` still green on my run. The closing ticket is against `engine-history.cjs`. |
| NOTE 2, "exactly as strong" | **RESOLVED in the disposition, STILL OPEN in the body.** Section 11 says "NO STRONGER, not exactly as strong". Section 6 line 336 still reads "It is exactly as strong as admission and no stronger", which is the sentence I asked to be corrected. One line of prose; not blocking, and the CODE direction is the safe one either way. |
| NOTE 3, an earlier period's `map` | **RESOLVED in the product.** Every period's map is now shape-checked. I re-ran my R-P10 unchanged: a `null` earlier map that ADMITTED at R1 (and stored the `null`) now refuses `{code:LOCAL_SOURCE_PROGRAMME_UNRESOLVED, field:'split.map'}`. `D-RS-R1-n3c` proves a genuinely different earlier week is still retained unexamined, which is Q2. |
| NOTE 4, the tie on `from` | **RESOLVED as a written rule.** R1 allowed "answered or written down as deliberate". It is written at `inForce` with the reason (the old app appends a period per change, so the last listed is the later change), and `D-RS-R1-n4` drives BOTH orders. My R-P11 still records the order dependence, which is now the documented rule and not a defect. |
| NOTE 5, the slot key | **RESOLVED.** One paragraph in the re-key block saying the slot key is deliberately left under the id the capture was written with, plus `D-RS-R1-n5` pinning both halves on one record. |
| NOTE 6, `split.map` on the page | **RESOLVED.** `D-RS-R1-n6` refuses on the page with `split.map` leading, asserts the FIELD's sentence against `Screen.refusalLines` in both directions, and proves nothing was written. |
| NOTE 7, DECISIONS:521 | **STILL OPEN, PM.** The ledger on this branch still ends at 520; the author names the carrying commit and the branch it lives on. I again reviewed against the brief's quotation. |
| NOTE 8, the identity trade | **STILL OPEN, PM.** Unchanged by design, and the build repeats the ask: read spec 2.1 once more at the seal. |

## 6. TWO NEW NOTES FROM THIS ROUND (neither blocking)

### NOTE 9. The new shape check compares an earlier period's KEY SET to the document's week

`source-admission.mjs:289-291` asks that every period's `map` carry the same key
set as the week `createCleanInitState` built. That is a shape check and not a
content check - values are only "a non-empty string", so a genuinely different
week is still retained unexamined - but it IS a new refusal surface over the
history Q2 said to retain. I checked it cannot bite the population this ticket
is for: the old app writes `split` with keys `0`-`6` and values `U`/`L`/`REST`
(`%TEMP%\old-app.jsx:551`), and `athlete-state.cjs:checkSplit` requires exactly
that key set of the document's own week, so the in-force period - which must
deep-equal that week - already fixes the key set for the file. Worth one
sentence at the seal and nothing more.

### NOTE 10. One assertion message in `D-RS-R1-n5` is inverted

`r1-fixes.test.mjs:257` reads
`assert.equal(PHONE_ID.calves, 'calves', 'this lift must be one whose slug and
handle differ')` - the message says "differ" about the one pair that AGREES. The
load-bearing half of the cell is the `hack` / `hack-squat` pair immediately
below it, which is correct and is what actually proves the two id spaces inside
one record. Cosmetic, and I would fix it whenever that file is next opened.

## 7. MY OWN SCRATCH, STATED HONESTLY

Two of my R1 scratch probes report `fail` on this tree and NEITHER is a
regression. I say so here so that nobody re-running my scratch reads them as
one:

1. `%TEMP%\rs-rev\probes.test.mjs` R-P7 is a SUPERSEDED early draft of the
   nothing-lost census: it reads a `view.programme` key the view has never had
   (the view's keys are `ready, basis, order_map, state, calculation,
   workout_baseline, workout_facts, families, retained, integration_pending`).
   The census R1 actually reported is `%TEMP%\rs-rev\census2.test.mjs`, and I
   re-ran it on this tree: **2/2 green, identical figures** - file lifts 16/16,
   document lifts 16 (12 corresponded, 4 kept under their own id), state lifts
   16, tombstoned 1, reads 4/4, dailyLogs 2/2, events 1/1, file session days
   4/4, pre-import Earned sessions 1/1, split 1/1. Nothing of his is lost after
   this round either.
2. `%TEMP%\rs-rev\split.test.mjs` R-P11 asserts the tie on `from` is NOT order
   dependent. It is, deliberately, and that is now NOTE 4's written rule with a
   cell in both orders. The probe records the old ask, not a defect.

## 8. WHAT I STILL COULD NOT VERIFY

Unchanged from R1 section 6, with one narrowing. Item 4 - a native record
written on the phone BEFORE the import - had exactly one measured break, the F4
machine-settings family, and that one is now closed and covered in three
directions; the rest of the F-family is still unmeasured here and its corpus is
green. Still unverified: DECISIONS:521's own text (not on this branch), the
eleven pre-existing failures by a run at `17c35f5` (argued from the empty
numstat, not measured), `listImports` on his real installation after the
programme digest changed shape, the fixture's header line citations, and whether
he has ever saved a machine-settings note - which after this round no longer
matters, because either way the import admits.

## 9. THE SEAL LIST FOR THE PM

1. **Gap 5.** Dispatch the `engine-history.cjs` ticket, or ship with the LOWER
   card blocked and named. DECISIONS:521's STOP was followed exactly.
2. **The `day`/`mg` ruling.** The build took option (a) and argued it in
   section 11. If the PM wants (b) instead it is one line, and the cells that
   would have to invert are named in that section.
3. **The identity trade** (spec 2.1) - read once more, as both reviews ask.
4. **DECISIONS:521 onto this branch** before the seal, so the ledger the seal
   reads is the one the build was built against.
5. **The programme digest changed shape** - `listImports` on his installation,
   which no lane here can open.

Everything else in this build I would seal as it stands.
