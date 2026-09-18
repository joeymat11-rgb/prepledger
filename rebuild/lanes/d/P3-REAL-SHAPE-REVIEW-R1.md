# P3-REAL-SHAPE INDEPENDENT REVIEW R1 (lane D build, Opus high)

## VERDICT

**REJECT, one fix round.** The build is substantially right and honest - the bar
reproduces byte for byte on my own run, the lockdown is clean, red-first is
real, and gap 5 is stopped on exactly as DECISIONS:521 ruled - but I MEASURED
two separate ways the owner's phone still breaks after this ticket: a
machine-settings note saved before the import REFUSES the whole import with an
unnamed field (the author's own FINDING 1, disclosed and left unfixed), and a
corresponded lift the file puts on the other day is ADMITTED and ADOPTED and
then makes Edit My Week refuse for good.

Both are one round. Neither needs the spec reopened except to say which side
wins on `day`/`mg`.

## 1. THE BAR, RE-RUN BY ME

Every suite re-run through `%TEMP%\rs-run.bat` on the same tree, logs
`%TEMP%\R-*.log`. My counts are IDENTICAL to the author's, row for row.

| suite | pass | fail | my log |
|-------|------|------|--------|
| `lanes/d/p3-real-shape/*.test.mjs` | 45 | 0 | `R-lane.log` |
| `lanes/d/p3-port-fix/*.test.mjs` | 35 | 0 | `R-s7.log` |
| `m3/w7-preview/import/test/*.test.mjs` | 35 | 0 | `R-imp.log` |
| `m3/w6/test/*.test.*` | 587 | 0 | `R-w6.log` |
| `lanes/d/plan-edit/*.test.*` | 89 | 0 | `R-pe.log` |
| `lanes/d/import-retract/*.test.mjs` | 13 | 0 | `R-ret.log` |
| `m4/import/test/*.test.*` | 90 | 0 | `R-m4i.log` |
| `m3/w7-preview/today/test/*.test.*` | 661 | 0 | `R-today.log` |
| `coach/test/*.test.*` | 234 | 0 | `R-coach.log` |
| `m4/workout/test/*.test.cjs` | 214 | **11** | `R-m4w.log` |
| **total** | **2003** | **11** | |

No difference from the author report. The eleven failures are the eleven the
author names, and I checked the claim rather than taking it:

- The seven `PERFORMED_W6_DIR` suites fail at module load (`:1:1`) with
  `Provide retained PERFORMED_W6_DIR` / `Explicit retained W6 root required`,
  which no code change in this ticket can reach.
- `h3-supersede-source-carriers` and `h3-supersede-inherited-carriers` are byte
  pins over `rebuild/engine/merge.cjs` and `rebuild/engine/today.cjs`, and
  `git diff --numstat 17c35f5..HEAD -- rebuild/engine rebuild/coach
  rebuild/DECISIONS.md` is EMPTY, so their inputs are identical at the base.
- My own content search of `m4/workout/test` for `source-admission`,
  `plan-edit-model`, `import-screen`, `local-source-basis` and
  `lift-correspondence` returns matches in exactly one file,
  `legacy-order-mapping.test.cjs` (lines 21, 28, 141), and that suite is green.

### 1.1 The deciding cell, read

`(b) D-RS-BAR-b` (`bar-admit.test.mjs:75-116`) does what the report says it
does, on the shipped page: real `port.cjs` seal, real `createSetupModel`
document, `Entry.boot` on the same IndexedDB the next morning, every file lift
present under the FILE's `n`/`sets`/`hi`/`day`, `hack` present and
`hack-squat` absent, the U card `ready` with the FILE's total, and the L card
asserted `blocked` on `ENGINE_CAPTURE_LOAD_UNPROVEN` rather than hidden. The
pre-import re-attachment is `(c)` and the companion is `(g)`. Nothing in the
cell is stubbed and nothing is asserted about a host the cell opened itself.

## 2. LOCKDOWN

- `git diff --numstat 17c35f5..HEAD -- rebuild/engine rebuild/coach
  rebuild/DECISIONS.md` is EMPTY.
- Eighteen files in the range; no `.skip`, `.only`, `.todo`, `skip: true` or
  `t.skip(` in any of them (my scan, `%TEMP%\rs-rev\scan.cjs`).
- One U+2013/U+2014 hit in the range:
  `m3/w7-preview/import/test/refusal-route.test.mjs:241`, which is the dash
  DETECTOR's own regex and is byte-identical at `17c35f5` (that file's whole
  diff is the P3-X11 field re-point, twenty lines away).
- No test in the diff is weakened. `plan-edit/model.test.cjs` NARROWS `P2_ROW`
  and re-asserts it; `page-bundle.test.mjs` re-measures 141 -> 142 and 18 -> 19
  route modules with the measurement named; `refusal-route.test.mjs` re-points
  ONE expectation (see NOTE 6).

## 3. FINDINGS

### BLOCKING 1. A machine-settings note written before the import REFUSES the whole import, with no field

`rebuild/m3/w6/local/source-admission.mjs:485`:

```
if(op.schema_version===2&&p?.profile===Settings.PROFILE&&Settings.validate(op,id=>ops[id])
   &&state.exercises.some(e=>e.id===p.machine.exercise_id)){...F4 retained...;continue;}
```

`state` here is the ADMITTED state, which after option A carries the FILE's
handles. A machine-settings op written on this phone before the import names a
DOCUMENT lift by its slug id, and a CORRESPONDED document lift is not in that
state under its own id at all - it was not appended, because
`lift_correspondence[row.id]` is truthy. The guard fails, the op drops to the
catch-all on the next line, and `issue('LOCAL_SOURCE_CONTEXT_UNRESOLVED')`
refuses the import.

This is the author's own FINDING 1. The author reasoned about it and left it
for the PM "because it is a guard". I MEASURED it instead
(`%TEMP%\rs-rev\f4.test.mjs`, log `%TEMP%\R-f4.log`), through the real
`createMachineSettingsHost` on the shipped era, saving one setting for
`lateral-machine` before the same real-shape bundle is carried:

```
control (no settings op)                 -> admitted = true
one settings op on 'lateral-machine'     -> admitted = FALSE
issues: [{"code":"LOCAL_SOURCE_CONTEXT_UNRESOLVED","op_id":"op-dev-p3-rsb-2"}]
```

No field. The screen falls to the code's generic sentence. This is the exact
failure class the ticket exists to remove (spec row 7, `capture_lift`), in a
family the spec did not look at, and it is REACHABLE on the shipped page:
`m3/w7-preview/today/machine-settings-host.mjs` and `-view.mjs` are page
modules, not a candidate.

**THE FIX IS ONE EXPRESSION**, and it is the one the author already named:
read the id through `liftAttach` exactly as the capture block does.

```
&&state.exercises.some(e=>e.id===(liftAttach(p.machine.exercise_id)??p.machine.exercise_id))
```

I am not willing to call this the PM's call rather than the build's. Moving a
guard is a PM question when the guard would get WEAKER; this one gets no weaker
- it goes on asking that the named lift be in the admitted state, through the
same correspondence the same function already recorded. Leaving it means
shipping an import that refuses for a reason it will not name.

### BLOCKING 2. `day` and `mg`: admission stopped proving them, the companion did not stop comparing them

Admission DELETED the per-lift `fields=['day','mg']` comparison (spec 2.3, and
it is gone from the code). The companion KEPT `P2_ROW=['day','mg']` and still
compares it, now between the document row and whatever basis lift the row
binds to by id or by normalised name
(`m4/workout/plan-edit-model.cjs:173-174`, `rowsOk=false` ->
`PLAN_EDIT_ORIGIN_UNPROVEN`).

So a file that places a lift the two sides share BY NAME on the other day is
admitted, adopted, painted on the Train screen - and Edit My Week then refuses
forever. MEASURED (`%TEMP%\rs-rev\probes.test.mjs` R-P6, log
`%TEMP%\R-probe1.log`): the phone's document names "Calves" on U, the file
names it on L, everything else identical.

```
walk through the shipped page  -> refusal = null   (ADMITTED)
admittedLocalSourceBasis       -> not null         (ADOPTED)
companionFor(...)              -> PLAN_EDIT_ORIGIN_UNPROVEN
```

This is the failure MOVED, not removed, which is the property the build's own
section 6 claims it protected: "a basis admission accepted must not be refused
by the editor, or this ticket would have moved the failure instead of removing
it". For `day` and `mg` it did.

**WHAT THE FIX IS, IS A RULING, AND IT IS SMALL.** Either
(a) the companion stops comparing `day`/`mg` on the LOCAL-SOURCE branch, the
way it stopped comparing `id`, because under option A the file's day is the
athlete's day; or
(b) admission refuses a name correspondence across days, so the two readers
agree again. (a) is the one consistent with "the file wins"; (b) is the one
that keeps the companion's stated job. Either way one cell in each direction.

I did not find any existing cell that puts a corresponded lift on a different
day, in this lane or in `lanes/d/plan-edit`, which is why it survived.

### NOTE 1. Gap 5 is open, and the build handled it correctly

`q1-producer.test.mjs` is four green cells, driven through the real gym model
on the real card with the era's own `producerIdentity` option; I re-ran them.
Direction one blocks (`WORKOUT_PREPARATION_INVALID`, via
`workout-host.mjs:169-173` -> `engine-capture.cjs:118-119`), direction two
blocks mid-session and then asks for a history reconciliation, because
`engine-history.cjs:62-63` admits `captured-lift-layout/v1` and nothing else.
`today-bindings.mjs` is untouched, v1 stays readable, and D-RS-h asserts the
blocked L card by name. That is the PM's own STOP instruction followed to the
letter, and I have nothing to add except that the reviewer agrees the closing
ticket is against `engine-history.cjs` and not one line.

The task asked me to probe "a v1 capture read after the v2 producer
registration (must project)" and "a BW-load lift on the next-morning card (must
prescribe, not block)". Both REFUSE, which is gap 5 and is what the author
reports. I re-ran both cells rather than trusting the prose.

### NOTE 2. "Exactly as strong as admission" is not true of the companion; it is WEAKER

`splitShapeOk` now asks `periods.some(p => equal(p.map, documentSplit.map))`,
while admission proves the period IN FORCE. A basis whose in-force period
differs but whose historical one matches would pass the companion and fail
admission. The direction is the safe one (nothing admission accepts can be
refused here), so this is not a defect, but the report's sentence should say
"no stronger" and stop there.

### NOTE 3. An earlier period's `map` is not shape-checked at all

MEASURED (`%TEMP%\rs-rev\split.test.mjs` R-P10). A file whose earlier period is
`{from:'2026-06-01', map:null, why:'...'}` ADMITS, and the `null` map lands in
the adopted state verbatim. The period loop only asks `Object.hasOwn(p,'map')`.
Spec 2.1 says earlier periods are "shape-checked"; presence is not a shape
check. Nothing reads it today (`covered()` and `dayType` take the period in
force), so this is a NOTE, not a break - but a `null` map sitting in his state
is a trap for whatever reads an earlier period next.

### NOTE 4. Which period is "in force" is decided by array order on a tie

`inForce` is `periods.filter(...).sort(byFrom).at(-1)`. Two periods with the
SAME `from` are not ordered by the sort, so the last one in the FILE's array
wins. MEASURED (R-P11): the same two periods, one matching the phone's week and
one not, admit when the matching one is second and refuse `split.map` when it
is first. Deterministic per file, undefined as a rule. Say what happens on a
tie, or refuse a duplicated `from`.

### NOTE 5. The re-key moves the entry's address but not the slot's

The re-key maps `entry.lift_lineage_id` only. Each slot also carries
`logical_set_slot`, which is a JSON string holding the lift id
(`"[\"calves\",1]"`, observed in `%TEMP%\R-shape.log`). After a re-key the
entry names the FILE lift and its slots still encode the DOCUMENT slug, so one
projected record carries two id spaces. The only reader of
`logical_set_slot` outside the capture machinery is `gym-model.mjs:87,353,511`,
which uses it for the LIVE session, so nothing is broken today. It is worth one
sentence in the code saying the slot key is deliberately left under the id the
capture was written with, or a cell pinning it, because the next reader of a
projected entry will reasonably assume the two agree.

### NOTE 6. `split.map` is no longer covered as the LEADING field on the page

`refusal-route.test.mjs` P3-X11 was re-pointed from `split.map` to
`athlete_label`, correctly - P-LABEL is now tested first and the stranger's
bundle carries a stranger's name. The re-point is honest and the cell's subject
(no stale "Working." beside a refusal) is untouched. But no page cell now shows
`split.map` leading a refusal. My R-P4b covers it at the controller; a page
cell would be better.

### NOTE 7. DECISIONS:521 is not on this branch

`rebuild/DECISIONS.md` on `rebuild/d-p3-real-shape` ends at 520. The author says
so and says the rulings were carried into the brief verbatim. I could not verify
the ruling text from this worktree; I reviewed against the brief's quotation of
it, which is what the build had.

### NOTE 8. The identity trade, unchanged and worth re-reading before the seal

Spec 2.1's own uncomfortable sentence still stands: with the per-lift id
multiset equality gone, another old-app athlete's file on the same week is
admitted and adopted on the owner's identity Yes alone, with his own label
stamped on it. P-LABEL cannot fire on an old-app file, which has no
`athlete_label` anywhere. This is INSIDE DECISIONS:520 and I am not asking for
it to be reversed; I am asking the PM to read it once more at the seal, because
it is the only proof left that the file is his.

## 4. SPEC CONFORMANCE, 2.1 to 2.7

| rule | verdict |
|------|---------|
| P-0, the one setup op | UNCHANGED, still exactly one, `Setup.validate` + `createCleanInitState`. |
| P-IDENT | UNCHANGED, the identity Yes and the prefix answer. |
| P-A, the week | Built to the PM's Q2 ruling, not to 2.1's literal text: the period IN FORCE is proved (`:288-290`), the earlier ones are retained. R-P4a admits, R-P4b refuses `split.map`. See NOTE 3 and NOTE 4 for what the retained ones are not asked. |
| P-BOUND | `BOUNDED_FIELDS=['sets','hi']`, probed against the document's FIRST lift; `inc` and `steps` bounded in their own lines over the old app's vocabulary. Matches 2.3 and the build's stated deviation. |
| P-CAP | `capture_producer` unchanged; `capture_lift` over the RE-KEYED id; `capture_sets` and `capture_membership` against `documentProgramme.state` under the document's own ids, with the `!produced` guard FIRST. Matches 2.5 as rewritten after review R1 B1/B2. Order is not relaxed. |
| P-LABEL | Before the lift loop (`:245-246`), refuses by name; the absent case takes the phone's label in `replay()`. R-P5 confirms. |
| the PROVED set is exactly those six and nothing else | Yes. `fields` and the id multiset equality are both gone. |
| adopted set (2.2) complete | Yes: `PROJECTED_FIELDS` gains `n`, `why` rides in the split, the extra members survive (D-RS-f). |
| correspondence injective BOTH sides | Yes, by construction in `uniqueByName`; R-P1 (two document rows, one file lift) and R-P2 (one document row, two file lifts) both correspond to nothing and keep everything. |
| the collision rule | NEW and present (`idCollisions`, `:365-366`), refusing `exercise_id`. Review R2's open item 2 is closed. |
| unmatched document lifts tombstoned and inactive | Yes, unconditionally, under `retirements` and NOT in `exOrder`. R-P3 and the census confirm. |
| first-run branch of plan-edit-model byte-untouched | Yes: `firstRun ? base.exercises[i] : ...` and `firstRun ? !byId.get(row.id) : boundBasis.has(e.id)` keep the id requirement on the first-run side. |
| v1 captures readable beside v2 | v1 stays readable; they do NOT coexist. That is gap 5 and the PM's STOP. |

## 5. MY PROBES

Scratch only, under `%TEMP%\rs-rev\`, nothing committed, every fixture
synthetic and built from the lane's own `legacy-fixture.cjs`.

| probe | what it does | result |
|-------|--------------|--------|
| R-P1 | two document rows normalising alike against one file lift | ADMITS; both rows kept, the file lift kept. PASS |
| R-P2 | one document row whose name two file lifts carry | ADMITS; neither corresponds, nothing merged. PASS |
| R-P3 | a pre-import session on a lift the file does not hold | ADMITS; the document lift is appended and tombstoned, his entry stays under it, every entry names a lift the state carries. PASS |
| R-P4a | two periods, only the one IN FORCE is the phone's week | ADMITS, both periods retained (Q2 honoured). PASS |
| R-P4b | two periods, the one IN FORCE differs | REFUSES `split.map`. PASS |
| R-P5 | a file whose `athlete_label` is a stranger's | REFUSES `athlete_label` by name. PASS |
| R-P6 | a corresponded lift the file puts on the other day | ADMITS and ADOPTS, then Edit My Week refuses `PLAN_EDIT_ORIGIN_UNPROVEN`. **FAIL - BLOCKING 2** |
| R-P7 | the nothing-lost census (below) | PASS |
| R-P8 | a machine-settings note saved before the import | the WHOLE import refuses `LOCAL_SOURCE_CONTEXT_UNRESOLVED`, no field. **FAIL - BLOCKING 1** |
| R-P9 | the shape of a projected entry after the re-key | entry re-keyed, `slots[].logical_set_slot` not. NOTE 5 |
| R-P10 | an earlier period whose `map` is `null` | ADMITS, `null` stored. NOTE 3 |
| R-P11 | two periods sharing one `from` | admits or refuses by array order. NOTE 4 |

### The nothing-lost census (R-P7)

Written with `normaliseName` RESTATED IN THE PROBE from the spec's words rather
than imported from the module under test, so the check is independent of the
rule it is checking. On the owner's own shape, one pre-import Earned session
recorded on the L day, imported the day after:

```
file lifts        16/16 (none lost)
document lifts    16 -> 12 corresponded to a file lift, 4 already held by the
                  same id under the same name; none unrepresented
state lifts       16     tombstoned 1 (the file's own pre-existing retirement)
reads              4/4
dailyLogs (food)   2/2
events (check-in)  1/1
sleep            absent in the fixture, absent after
file session days  4/4
pre-import Earned sessions 1/1, every entry keyed to a lift the state carries
split periods      1/1
```

Nothing of his is lost on his own shape. R-P3 shows the same holds when the
file does NOT hold a lift his own recorded session names.

## 6. WHAT I COULD NOT VERIFY

1. **DECISIONS:521 itself.** It is not on this branch (the ledger ends at 520).
   I reviewed the build against the brief's quotation of the rulings.
2. **The eleven pre-existing failures at `17c35f5` by running them there.** I
   was told not to make another worktree, so I proved it by the empty engine
   numstat and by the import search instead of by a second run. The argument is
   sound but it is an argument, not a measurement.
3. **`listImports` on his real installation** after the programme digest changed
   shape. The author flags this as open; I have no installation to read and did
   not go near anything under his own paths.
4. **Native pre-import food, sleep, measure and check-in RECORDS.** My census
   counts the FILE's own `reads`, `dailyLogs` and `events` and one native Earned
   session. I did not write native F1/F5/F7/F8 facts on the phone before the
   import; the F-family code is untouched by this ticket and its corpus is green
   (`m3/w6/test` 587/0, `m4/import` 90/0), which is the ground I am standing on.
   BLOCKING 1 is the one family where a pre-import native record DOES break, and
   that one I measured.
5. **The fixture's header line citations** into the old app's public source. The
   author did not re-walk them and neither did I; `%TEMP%\old-app.jsx` exists but
   re-walking every cited line was not worth the round against a fixture whose
   SHAPE is already proved by the port accepting it.
6. **Whether the owner has ever saved a machine-settings note.** I can only say
   the screen that writes one ships, and that if he has, his import refuses.

## 7. WHAT THE FIX ROUND IS

1. `source-admission.mjs:485` reads the settings id through `liftAttach`, with a
   red-first cell in both directions (a settings op on a corresponded lift, and
   the control on an uncorresponded one).
2. A PM ruling on `day`/`mg`: either the companion stops comparing them on the
   local-source branch, or admission refuses a cross-day name correspondence.
   One cell each way.
3. NOTE 3 and NOTE 4 answered in the period loop, or written down as deliberate.

Everything else in this build I would seal as it stands.
