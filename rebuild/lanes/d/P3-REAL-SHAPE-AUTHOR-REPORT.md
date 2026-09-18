# P3-REAL-SHAPE AUTHOR REPORT (lane D build, Opus high)

Built against `rebuild/lanes/d/P3-REAL-SHAPE-SPEC.md` v2 (`6e8c9c7`) with
`-REVIEW-R1.md` and `-REVIEW-R2.md`, dispatched at DECISIONS:520 and accepted by
name at DECISIONS:521 (`63240b7`, which is on `origin/rebuild/t2-client-core`
and not on this branch's DECISIONS.md; the rulings were carried into this
build's brief verbatim and are quoted where they bind).

Branch `rebuild/d-p3-real-shape`, base `17c35f5`. Nothing outside
`rebuild/lanes/d/**`, `rebuild/m3/w6/local/source-admission.mjs`,
`rebuild/m3/w7-preview/**` and `rebuild/m4/workout/**` was touched.
`rebuild/DECISIONS.md`, `rebuild/engine/**`, `rebuild/coach/**` (source),
`athlete-state.cjs`, `port.cjs`, `prepare.cjs`, `replay-core.cjs`,
`import-bundle.mjs` and `setup-model.mjs` are unchanged, and
`git diff 17c35f5..HEAD --name-only` is the proof.

## 0. THE HEADLINE, IN FOUR LINES

1. The owner's own file shape ADMITS and is ADOPTED end to end on the shipped
   page, and Edit My Week opens on it. Gaps 1 to 4 of the spec are closed.
2. **GAP 5 IS NOT CLOSED.** PM QUESTION 1 was ruled YES subject to a
   measurement. The measurement REFUSED IN BOTH DIRECTIONS, so
   `today-bindings.mjs` was NOT moved and his LOWER day still has no card. This
   is section 5 and it is the one thing that needs the PM.
3. One new refusal the spec did not have: an id shared by two lifts that are
   not the same lift by name (spec review R2's open item 2).
4. One finding for the PM out of the tree-wide sweep: the machine-settings F4
   guard at `source-admission.mjs:474` reads a lift id the same way
   `capture_lift` used to, and was not moved, because moving a guard is the
   PM's call and not the build's. Section 7, FINDING 1.

## 1. COMMITS

| sha | what |
|-----|------|
| `82faa80` | P3-REAL-SHAPE: cells, red first |
| `7ff0ce7` | P3-REAL-SHAPE: correspondence + programme rule, capture block and re-keying |
| `99a1756` | P3-REAL-SHAPE: companion and screen |
| `a60d194` | P3-REAL-SHAPE: the corpus re-pointed where it sealed a rule option A removed |
| (this file) | P3-REAL-SHAPE: author report |

## 2. RED FIRST

Every bar cell of spec section 4 and every flipped measurement cell was written
and run against the UNCHANGED S7 tree before one product byte moved, at
`82faa80`. Logs: `%TEMP%\rs-red1.log` (bar-admit), `%TEMP%\rs-red2.log`
(bar-keep), `%TEMP%\rs-red3.log` (the flipped measurement cells).

**32 RED, 13 GREEN.**

| cell | red-first result against the unchanged tree |
|------|--------------------------------------------|
| (a) D-RS-BAR-a | RED: `LOCAL_SOURCE_PROGRAMME_UNRESOLVED (split)` - the file's period carries `why` |
| (b) D-RS-BAR-b | RED: same, so nothing was adopted and no card could be read |
| (e) D-RS-BAR-e1 | RED: same; the label was never written |
| (e) D-RS-BAR-e2 | RED: refused `split` and not `athlete_label`; P-LABEL did not exist |
| (e) D-RS-BAR-e3 | RED: same |
| (f) stranger week | RED: refused `split` before it could reach the week |
| (f) future `from` | RED: refused `split` first |
| (f) empty period array | **GREEN**: `split` is a rule option A keeps, and it fired for its own reason |
| (f) two lifts one id | RED: refused `split` first |
| (f) unnamed lift | RED: refused `split` first; `exercise_n` did not exist |
| (f) `sets: 0` | RED: refused `split` first |
| (f) non-Latin control | RED: `Corr.normaliseName` did not exist |
| (g) D-RS-BAR-g | RED: the file never admitted, so there was no basis to open |
| (i) D-RS-BAR-i | RED: the leading field was `split`, not `split.map` |
| (c) D-RS-BAR-c | RED: `exercise_id` AND `capture_lift`, the two issues D-RS-g1 measured |
| (d) D-RS-BAR-d | RED: same pair |
| (d2) D-RS-BAR-d2 | RED: refused `split` |
| (d3) D-RS-BAR-d3 | RED: `Corr.correspondence` did not exist |
| (d4) D-RS-BAR-d4 | RED: refused, but for the file's shape and not for the order |
| (d4c) control | RED: refused `split` |
| (d5) D-RS-BAR-d5 | RED: refused `split`, so the REST-day guard was never reached |
| (d6) D-RS-BAR-d6 | RED: `Corr.idCollisions` did not exist; the collision bound silently |
| (d6c) control | **GREEN**: a pure statement about the fixture and the new helper |
| (n5) D-RS-BAR-n5 | RED: no label, no appended lift |
| (n6) D-RS-BAR-n6 | RED: refused `split` |
| (n7) D-RS-BAR-n7 | RED: refused `split` |
| D-RS-a0, a, b1, b2, b3, c, g1, k | RED: the eight measurement cells 3.3 marks INVERT |
| D-RS-0, e, d, f, g2, h, h2 | **GREEN**: the seven 3.3 marks STAY |

**THE CELL COUNT, SETTLED (review R2's still-open N8).** Counted off 3.3's own
table there are NINE INVERT rows and SIX STAYS rows; the prose said eleven and
four and the reviewer was right that the two disagree. On this build it is
**EIGHT INVERT and SEVEN STAY**, because D-RS-h's inversion was conditional on
PM QUESTION 1 and the answer measured NO: D-RS-h stays green and becomes the
named record of a shipped limitation, exactly as 3.3 says it should in that
case. D-RS-d and D-RS-g2 are counted as STAYS and each gained an assertion,
which is what the table says and what the prose did not.

The seven cells this revision added - (d2), (d3), (d4), (d5), (n5), (n6), (n7) -
have no red-first line of their own; each one's row above says which rule of
section 2 it holds to account, and (d6) is new to this build for review R2's
open item 2.

## 3. THE DIFF, FILE BY FILE

### 3.1 `rebuild/m4/workout/lift-correspondence.cjs` (NEW, 106 lines)

The shared helper of spec 2.3 / 2.5 / 2.6, stated ONCE and imported by three
readers so they cannot disagree. Pure; reads and writes nothing.

- `normaliseName` (`:24-27`): NFKD, combining marks removed, lower-cased, every
  run that is not a Unicode LETTER OR DIGIT collapsed to one space, trimmed.
  The class is `\p{L}\p{N}`, not `[a-z0-9]`, so a lift named in any script
  normalises to itself (cell (f) D-RS-BAR-f7).
- `correspondence(fileLifts, documentLifts)` (`:52-63`): DOCUMENT id -> FILE id,
  injective BY CONSTRUCTION on BOTH sides (review R1 B3). A pair is kept only
  where the normalised name is carried by exactly one lift on each side.
- `idCollisions(fileLifts, documentLifts)` (`:78-90`): NEW, for spec review R2's
  open item 2. The document lift ids that a FILE lift also carries under a
  DIFFERENT name.
- `matchByName(baseLifts, row)` (`:100-105`): the companion's half.

**DEVIATION FROM THE SPEC (3.1): the path.** The spec says
`rebuild/m4/import/lift-correspondence.cjs`; the build's brief says
`rebuild/m4/workout/`. It is in `m4/workout`, beside `plan-edit-model.cjs`,
which is the one product file outside the import lane that imports it. Putting
it in `m4/import` would have made the Edit My Week companion - which is not on
the import route at all - depend on the import lane.

### 3.2 `rebuild/m3/w6/local/source-admission.mjs`

- `:39-45` the import of the shared helper; `:70-72` the three names it uses.
- `:203-216` the header saying what option A is and what it costs.
- `:217` `programme()` gains the `documentProgramme` out-parameter.
- `:237` `documentProgramme.state = scratch`, filled before any comparison below
  can refuse.
- `:245-246` **P-LABEL, BEFORE THE LIFT LOOP** (review R1 N9). Field
  `athlete_label`.
- `:255` `PROJECTED_FIELDS` gains `n`; `:263` `BOUNDED_FIELDS` loses `steps` and
  `inc` and is `['sets','hi']`.
- `:268-277` the period shape accepts `why` as a string it never reads.
- `:288-290` **Q2**: `inForce` is the latest period not after today, and it is
  the ONLY one `split.map` is proved against; the earlier ones are
  shape-checked above and retained unexamined.
- `:296-328` the per-lift loop: unique non-empty id, a name that survives
  normalisation (`exercise_n`, `:307`), `day` in {U,L}, a non-empty `mg`, `inc`
  finite positive OR null, `steps` bounded only when present, and the bounded
  probes against the document's FIRST lift.
- `:365-366` **the id collision refusal**, field `exercise_id`.
- `:374` the returned basis gains `lift_correspondence`.
- `:413` `liftAttach`, the one reader of the recorded correspondence.
- `:432` the label write (2.4).
- `:452-461` the unconditional append of every unmatched document lift, inactive
  and tombstoned under `retirements` (`:459`), not added to `exOrder`.
- `:575-576` `capture_lift` over the RE-KEYED id; `:580` the counts stay under
  the DOCUMENT's own id.
- `:655-661` `capture_membership` re-pointed at `sessionMembership` on
  `documentProgramme.state`, with `!produced` guarded first (review R1 B1).
- `:662-670` the layout returned byte for byte; `:672-687` the re-key applied to
  the PROJECTED session's record entries.

### 3.3 `rebuild/m3/w7-preview/today/local-source-basis.mjs`

`:54-65` twelve lines of comment, and nothing else. The guard line itself is
byte-identical and now stands at `:66` (it was `:54`); what changed is that it
is the LAST guard and not the first.

### 3.4 `rebuild/m4/workout/plan-edit-model.cjs`

`:27-37` `P2_ROW` -> `['day','mg']` and the shared helper imported.
`:38-52` `splitShapeOk` accepts `why` and follows Q2 by asking that at least ONE
period's map be the document's week. `:93-101` the count check becomes a
first-run proof only. `:141-150` `boundBasis`. `:153-170` the row binds by its
own id FIRST and then by normalised name; the FIRST-RUN branch is untouched,
including its `byId.get(row.id)` requirement (review R1 B4, spec 5).

### 3.5 `rebuild/m3/w7-preview/import/import-screen.mjs`

`:104-115` three COPY sentences; `:143-151` three
`REFUSAL_FIELD_SENTENCE` entries. `refusalLines()` is unchanged.
`:45-56` one stale comment CORRECTED: it said "a file differing only by
athlete_label admits", which P-LABEL made false.

### 3.6 `rebuild/m3/w6/local/today-bindings.mjs` - NOT CHANGED

See section 5.

## 4. THE BAR

Every suite run through `%TEMP%\rs-bar.bat` (PATH, `TZ=America/New_York`, cwd
the worktree, `node --test`). Logs named per row.

| suite | # pass | # fail | log |
|-------|--------|--------|-----|
| `rebuild/lanes/d/p3-real-shape/*.test.mjs` (the bar, the measurement, Q1) | 45 | 0 | `%TEMP%\B-lane.log` |
| `rebuild/lanes/d/p3-port-fix/*.test.mjs` (the S7 lane cells) | 35 | 0 | `%TEMP%\B-s7.log` |
| `rebuild/m3/w7-preview/import/test/*.test.mjs` (the import corpus) | 35 | 0 | `%TEMP%\B-imp.log` |
| `rebuild/m3/w6/test/*.test.mjs` (incl. local-source-admission, -commit, -consumer) | 587 | 0 | `%TEMP%\B-w6.log` |
| `rebuild/lanes/d/plan-edit/*.test.*` | 89 | 0 | `%TEMP%\B-pe.log` |
| `rebuild/lanes/d/import-retract/*.test.mjs` | 13 | 0 | `%TEMP%\B-ret.log` |
| `rebuild/m4/import/test/*.test.*` | 90 | 0 | `%TEMP%\B-m4i.log` |
| `rebuild/m3/w7-preview/today/test/*.test.*` | 661 | 0 | `%TEMP%\B-today.log` |
| `rebuild/coach/test/*.test.*` (read-only check) | 234 | 0 | `%TEMP%\B-coach.log` |
| `rebuild/m4/workout/test/*.test.cjs` | 214 | **11** | `%TEMP%\B-m4w.log` |
| **total** | **2003** | **11** | |

### 4.1 THE ELEVEN, AND WHY THEY ARE NOT THIS TICKET'S

All eleven are in `rebuild/m4/workout/test` and all eleven are PRE-EXISTING on
this branch. Two classes:

1. SEVEN suites fail at module load with `Provide retained PERFORMED_W6_DIR` /
   `Explicit retained W6 root required`: `configuration-capture`,
   `engine-capture`, `engine-history`, `history-panel`,
   `native-next-targets-assembly`, `native-next-targets-correction`,
   `native-next-targets`, `source-control`, and the one cell of
   `context-history` that asks for the same root. They need an environment
   variable this runner does not set; no code change can affect them.
2. The byte-pin cells `H3/SUP-3` (`h3-supersede-source-carriers`) and `H3/SUP-5`
   (`h3-supersede-inherited-carriers`) report `rebuild/engine/merge.cjs` and
   `rebuild/engine/today.cjs` as differing from their `sourceBase`. This ticket
   touched NO file under `rebuild/engine/`: `git diff 17c35f5..HEAD
   --name-only` lists twelve files and not one of them is in that tree.

THE PROOF THAT NONE OF THE ELEVEN CAN BE MINE, rather than the assertion: a
content search of `rebuild/m4/workout/test` for `source-admission`,
`plan-edit-model`, `import-screen`, `local-source-basis` and
`lift-correspondence` returns matches in exactly ONE file,
`legacy-order-mapping.test.cjs`, and that suite is GREEN. No other suite in that
directory imports a byte this ticket changed.

### 4.2 THE ONE CELL THAT DECIDES

`(b) D-RS-BAR-b`, `bar-keep`'s `(c)`, and `D-RS-BAR-d2`, together, on the
SHIPPED page booted by `today-entry.mjs`, against a bundle sealed by the REAL
`port.cjs` from the real-shape fixture:

- the real-shape bundle ADMITS with no refusal line, custody kept, basis
  committed, nothing retracted (`(a)`);
- the next morning, `Entry.boot` on the SAME IndexedDB at a later instant, the
  page ADOPTS: every one of the file's sixteen lifts is in the basis under the
  FILE's own handle id, with the FILE's `n`, `sets`, `hi` and `day`, and
  `hack` is there while `hack-squat` is not;
- the U day's card - the PAGE's own card, not a host the cell opened - is
  `ready` and its total is the FILE's 26 and not the document's 27;
- with one pre-import Earned session recorded under the phone's slug ids, the
  import admits and every projected entry is keyed to a FILE lift, at least one
  of them moved off the slug his own setup minted, and the slot count is still
  the DOCUMENT's (as recorded, never rebased);
- Edit My Week opens on the adopted programme.

**AND THE HALF THAT DOES NOT HOLD.** The L day's card is `blocked` on
`ENGINE_CAPTURE_LOAD_UNPROVEN`, because the page's capture producer is still v1
and his `BW` raise and `hold` hack live on that day. That is GAP 5, it is
section 5, and D-RS-h is its named record. The L day IS proved in full by
`D-RS-h2`, the same day with the two configuration loads replaced by numbers:
`ready`, and the card's total is the FILE's.

## 5. PM QUESTION 1: MEASURED, AND STOPPED ON

DECISIONS:521 ruled Q1 YES **provided** the build first measured a pre-existing
v1 capture, kept v1 captures readable beside v2, and proved both directions with
a cell; and, if v1 and v2 cannot coexist on the read path, STOP on that item,
record exactly what refused, finish the rest and report. That is what happened.

The measurement is `rebuild/lanes/d/p3-real-shape/q1-producer.test.mjs`, four
cells, all green. The producer is the era's own option
(`today-bindings.mjs` `openTodayOverLocalEra({producerIdentity})`); nothing is
stubbed; the workout is driven through the real gym model on the real card.

| cell | what was measured | result |
|------|-------------------|--------|
| D-RS-q1a | control: a workout written under v1, read back under v1 on the next prescribing morning | card `ready`, total 27 |
| D-RS-q1b | **direction one**: the SAME device and the SAME v1 capture, reopened with `CONFIGURATION_PROFILE` as the page's producer | card **`blocked`, `WORKOUT_PREPARATION_INVALID`** |
| D-RS-q1c | **direction two**: a device whose page produces v2 from the first boot | the card **blocks part-way through the session**; the next morning reads `unfinished` / `WORKOUT_HISTORY_RECONCILIATION_REQUIRED` |
| D-RS-q1d | the verdict | `PRODUCER.rule_profile` is still `Adapter.PROFILE` |

**WHAT REFUSED, EXACTLY.**

- Direction one. The page resolves EVERY stored Start's layout through ONE
  adapter built from the page's own producer identity
  (`rebuild/m3/w6/host/workout-host.mjs:169-173`), and
  `rebuild/m4/workout/engine-capture.cjs` `readLayout` refuses any capture whose
  producer is not that adapter's (`:118-119`,
  `!same(capture.producer,producer)` -> `ENGINE_CAPTURE_PROFILE_INVALID`). The
  durable client contains the throw and the card blocks under its own generic
  code. **The owner's phone holds v1 captures today**, so this is his case and
  not a hypothetical.
- Direction two is worse and was not anticipated by the spec. Under
  `CONFIGURATION_PROFILE` the layout the adapter writes is
  `earned/captured-lift-layout/v2` (`engine-capture.cjs:18`), and the ACCEPTED
  history projector admits `earned/captured-lift-layout/v1` AND NOTHING ELSE
  (`rebuild/m4/workout/engine-history.cjs:62-63` ->
  `WORKOUT_CAPTURE_LAYOUT_UNPROVEN`). The v2 history path is a CANDIDATE
  (`rebuild/m4/spec/configured-history-candidate/`), not an accepted one. So the
  v2 producer cannot complete a workout on the shipped page at all.

**THE DECISION THIS BUILD TOOK.** `today-bindings.mjs` is NOT changed. Gap 5
stands and is named on the screen the owner will see: his LOWER day is a blocked
card with `ENGINE_CAPTURE_LOAD_UNPROVEN` on it, which he can read, rather than
an import that refuses or a page that loses his history.

The spec's own fallback - leave the page on v1 and REFUSE the import by name on
a configuration load - was NOT taken either, and deliberately: it would refuse an
import that otherwise succeeds end to end, which is worse for him than a card he
can see is blocked, and spec 6.2 (1) says that fallback "must go back to the PM".

**WHAT THE PM NOW HAS TO RULE ON.** Closing gap 5 is not one line in
`today-bindings.mjs`. It is a ticket that makes the ACCEPTED history projector
read a v2 layout, and that is a law in `engine-history.cjs` - a file this ticket
is not allowed to touch and should not touch on its own authority. The candidate
work already exists under `m4/spec/configured-history-candidate/`.

## 6. PM QUESTION 2, AS BUILT

Ruled YES: P-A proves the period in force TODAY; earlier periods are
shape-checked and retained unexamined; `split.map` names only the period in
force. Built at `source-admission.mjs:288-290`. Every period is still bounded by
`split.from` (valid, not after today) and still closed over `{from, map, why}`,
so a malformed historical period still refuses - what is no longer asked is that
a week he stopped training months ago equal the week he just typed.

The companion follows the same ruling WITHOUT re-evaluating a clock
(`plan-edit-model.cjs:38-52`): it asks that AT LEAST ONE period's map be the
document's week. It is exactly as strong as admission and no stronger, which is
the property that matters - a basis admission accepted must not be refused by
the editor, or this ticket would have moved the failure instead of removing it.
`PF-d2` still proves the `split.from` bound is per period and not per state.

## 7. THE TREE-WIDE SWEEP (the S7 risk 7.1.0 pattern)

Every other reader of a lift id, of `athlete_label` or of the split shape that
could refuse or mis-read an ADOPTED old-app state. Searched: `athlete_label`
(213 hits, 9 product files), `state.split` / `.split[0]` / `split.map` /
`exOrder` (74 hits), and the coach and measure lanes for `exercise_id` and
`exercises.find|filter|some`.

| file:line | what it reads | verdict |
|-----------|---------------|---------|
| `m3/w7-preview/today/local-source-basis.mjs:66` | the adopted state's `athlete_label` | SAFE, and it is the point: admission now always writes one. Cells (e) e1, D-RS-c. |
| `m3/w7-preview/today/today-app.cjs:317-320` `setupNoteNeeded` | the adopted state's `athlete_label` | SAFE, and the sample-numbers sentence CLEARS. Cell (n7), both directions on the exported predicate. |
| `m3/w7-preview/today/today-entry.mjs:113` | the label off the SETUP op rows | SAFE: it never reads the imported state. |
| `m3/w7-preview/today/setup-check.mjs:406`, `setup-model.mjs:629` | the first-run document | SAFE: the setup flow is untouched (spec 5). |
| `m4/workout/athlete-state.cjs:66,234-240,312` | the constructor's own `athlete_label` | SAFE: the constructor is untouched and this ticket stopped asking it about members a FILE never had. |
| `m4/workout/plan-edit-model.cjs:102` | `base.athlete_label !== setup.athlete_label` | SAFE and UNCHANGED - still the guard it was. D-RS-k part three proves it still refuses a basis with no label. |
| `m4/workout/plan-edit-model.cjs:293` `apply()` | `state.exercises.find(e => e.id === edit.exercise_id)` and `(state.retirements||{})[target.id]` | SAFE AND CORRECT: an APPENDED retired lift is listed by the companion and refuses `PLAN_EDIT_TARGET_UNAVAILABLE` if edited, which is the honest answer for a lift the import retired. |
| `m4/workout/plan-edit-model.cjs:296-299` `covered()` | picks the LAST period with `from <= starts_on` | SAFE: already the period in force, which is what Q2 asks for. Nothing to change. |
| `m3/w7-preview/measure/measure-sources.mjs:63-65` `markerIdFor` | finds a lift BY NAME (`e.n === marker`) | SAFE ON THE OWNER'S SHAPE, and a named general risk: a marker he picked before importing is stored as a NAME, and after adoption the names are the FILE's. He typed the file's own names, so it resolves; an athlete who typed a lift differently would lose the marker. NOT a refusal and NOT a data loss: `markerIdFor` returns nothing and the measure lane reads ABSENT, never zero. No guard moved. |
| `m3/w7-preview/measure/measure-sources.mjs` (baseline) | `sessionLog`, `split`, `exercises` | SAFE: the imported `sessionLog` is untouched by this ticket and P3-X9 (measure then import, one store) is green. |
| `engine/plan.cjs:87-95` `exActive` | `s.retirements`, with NO date comparison | SAFE, and it is what makes the append invisible to the card. Cells (d2), (n6). |
| `engine/today.cjs:68-70` `_sessionPool`, `engine/plan.cjs:225-229` | `exOrder` | SAFE: the appended lift is never added to `exOrder`. Cell (n6) asserts it on both day kinds after a later boot. |
| `coach/wave1-tools.cjs:133-196` `machine_settings` | an `exercise_id` handed in by the caller | SAFE: it looks the id up in whatever state it is given and answers `MACHINE_SETTINGS_INVALID` for one it does not hold. It never compares two id spaces. |
| `m3/w6/local/source-admission.mjs:486` the F4 Settings guard | `state.exercises.some(e => e.id === p.machine.exercise_id)` | **FINDING 1 - NOT CHANGED. See below.** |

### FINDING 1 (for the PM, not fixed here)

`source-admission.mjs:486`:

```
if(op.schema_version===2&&p?.profile===Settings.PROFILE&&Settings.validate(op,id=>ops[id])
   &&state.exercises.some(e=>e.id===p.machine.exercise_id)){families.push({family:'F4',state:'retained',op_id:op.op_id});continue;}
```

This is the SAME shape of fault as spec row 7, in a family the spec did not
look at. A machine-settings operation written on this phone BEFORE the import
names a lift by the DOCUMENT's slug id. After option A the admitted state
carries the FILE's handles, and a CORRESPONDED document lift is not in that
state under its own id at all - which cell `(f) D-RS-BAR-f7` asserts directly
(`state.exercises.some(e => e.id === phoneRowId) === false`). So this guard
would not find the lift, the operation would fall to the catch-all on the line
below, and the whole import would refuse `LOCAL_SOURCE_CONTEXT_UNRESOLVED` -
a code that names no field and tells him nothing.

It is reachable: the shipped page writes these operations
(`m3/w7-preview/today/gym-app.mjs`'s machine-settings lane, proved by
`today/test/machine-settings-ui.test.mjs`).

The fix is one expression - read the id through `liftAttach` exactly as
`capture_lift` now does - and it is NOT taken here, because the brief says a
guard that must move is a finding for the PM and not a silent change. It is not
measured end to end by a cell in this ticket either: the machine-settings host
opens the page's DEFAULT database and namespace rather than the scoped era this
lane's harness uses, so the cell is its own small piece of work.

WHAT MAKES IT LOW-RISK TODAY: the owner's phone was set up fresh for this
import, and a machine-settings operation only exists if he opened that panel
before importing. WHAT MAKES IT WORTH RULING NOW: if he did, his next retry
refuses with a code that carries no field, and OPT-3's diagnosis-by-field-name
- the whole plan for reading his next screenshot - fails exactly when it is
needed.

## 8. DEVIATIONS FROM THE SPEC, AND WHY

1. **PM QUESTION 1 not taken.** Section 5. The proviso the ruling attached was
   not met; the build stopped on the item, recorded what refused, kept v1
   readable by not moving the producer at all, and finished the rest.

2. **THE RE-KEY IS ON THE PROJECTED SESSION, NOT ON THE LAYOUT.** Spec 2.5's
   diff re-addresses `layout.slots` inside `resolveCapturedLayout`. That cannot
   work: `rebuild/m4/workout/engine-history.cjs:66-68` binds every layout slot
   to the STORED capture's own `lift_lineage_id`
   (`mapped.lift_lineage_id !== lift`), so a re-addressed layout refuses
   `WORKOUT_CAPTURE_LAYOUT_UNPROVEN` - the law that proves the layout really is
   this capture's, and a law this ticket must not weaken. The layout is returned
   byte for byte and the ADDRESS moves on the projected record's entries
   instead, after that law has run on the ids it was written under
   (`source-admission.mjs:662-687`). The stored capture is left exactly as
   written: it is evidence of what the document prescribed, and rewriting
   evidence is not what a re-key is. Cells `(c)` and `D-RS-g1` prove the entries
   land on the file's lifts; `D-RS-g2` proves a no-op re-key changes nothing.

3. **`BOUNDED_FIELDS` loses `inc` as well as `steps`.** The spec's diff keeps
   `inc` out of `BOUNDED_FIELDS` and bounds it in its own line; the prose in 2.3
   says the list "loses `steps`". Both are bounded in their own lines here, over
   the OLD APP's own vocabulary, and the comment says so. No bound is lost:
   `D-PF-n5 (inc)` and `D-PF-n5 (steps)` are both still green.

4. **A NEW REFUSAL the spec did not have: the id collision** (spec review R2's
   open item 2, and the build brief's instruction to add a cell and a refusal or
   a tie-break). Where a FILE lift's id equals a DOCUMENT lift's id but the two
   are not the same lift by NAME, admission refuses `exercise_id`. The tie-break
   is the correspondence rule itself. Cells `(d6)` and `(d6c)`; the control
   proves that on the owner's own shape the four shared ids (`press`,
   `pulldown`, `tricep`, `calves`) are shared BY THE SAME NAME and nothing fires.

5. **Cell (d3) is built on a phone whose duplicate pair is `Machine fly` /
   `Machine fly.`**, not `Press` / `Press.`. `Press` is one of the four ids the
   fixture's file and the owner's setup genuinely share, so a `Press` pair would
   have tested the `held` skip rather than the ambiguity. `Machine fly` slugs to
   `machine-fly`, which the file does not hold under any id, so both rows are
   kept as their own retired lifts and the file's `Machine fly` is bound by no
   row - which is what (d3) is for.

6. **The re-key cells claim "every entry names a FILE lift and at least one
   moved"**, not "no entry is a phone slug". Four ids are legitimately in both
   spaces under the same name, so for those the re-key is the identity. Said in
   the cells' own comments.

7. **(n7)'s negative direction is the exported predicate, not a second phone.**
   On a phone whose import was REFUSED the adoption chain falls back to the
   setup document, whose label matches, so the sentence was never on that screen
   either - the "still there" half of the spec's sentence is not reachable. The
   cell asserts the rendered screen for the adopted direction and
   `today-app.cjs`'s own exported `setupNoteNeeded` for both, which is what
   `today-app.cjs:315` says that export is for.

8. **`sealRealShapeBundle` added to `import/test/support.mjs`** as spec 3.3
   asks. Nothing existing was removed; the refusal-guard cells keep the invented
   fixture deliberately, and `eraFor` gained an OPTIONAL `producerIdentity`
   passthrough for the Q1 measurement that every existing caller ignores.

9. **The spec's fixture-header line citations (review R2, small thing 4) were
   NOT re-walked.** They are citations in `legacy-fixture.cjs`'s header to the
   old app's public source; correcting them needs a re-read of that weave, the
   facts are all real (the reviewer checked each at source), and no cell and no
   rule depends on them. Left for the next revision, named here so it is not
   lost.

## 9. DASH SCAN

`node %TEMP%\rs-dash.js` over every file this ticket writes or changes: flags
U+2013, U+2014 and any byte above 126.

**CLEAN.** 16 of 17 files carry not one non-ASCII byte. The one HIT is
`rebuild/m3/w7-preview/import/test/refusal-route.test.mjs` at offsets
13476-13477, and it is PRE-EXISTING: the same two bytes are at the same two
offsets in `git show 17c35f5:` of that file. The one this build introduced (a
dash pair inside a regex literal in `bar-admit.test.mjs`) was found by this scan
and removed - the two code points are built with `String.fromCharCode` now, so
the source stays ASCII and the census cannot trip on its own assertion.

No UI copy this ticket adds carries a dash or a number: cell `(e) D-RS-BAR-e2`
asserts it on the rendered line, and `D-PF-g3` asserts it again on the real
screen.

## 10. OPEN QUESTIONS FOR THE PM

1. **GAP 5.** Section 5. Closing it is a ticket against
   `engine-history.cjs`'s accepted layout law, not a line in
   `today-bindings.mjs`. Until then the owner's LOWER day has no card. Ruling
   needed: dispatch that ticket, or ship with the blocked card named.
2. **FINDING 1**, the F4 machine-settings guard. Section 7. One expression, the
   same `liftAttach` `capture_lift` now uses. Ruling needed because it is a
   guard.
3. **THE IDENTITY TRADE IS UNCHANGED AND STILL HIS TO KEEP MAKING** (spec 2.1,
   6.2 (5)). P-LABEL cannot fire on any old-app file, because the old app writes
   no `athlete_label` anywhere. On the population this ticket exists for the
   only proof that the file is his is the identity Yes, and this build stamps
   this phone's name onto whatever was admitted. `PF-e2` INVERTED is the half
   that IS now closed - a file that names SOMEONE ELSE is refused by that name -
   and it is worth reading beside the half that is not.
4. **THE PROGRAMME DIGEST CHANGED SHAPE** (spec 6.2 (3)): `n` joins the
   projection and `lift_correspondence` joins the basis. Every recorded basis in
   the field is bound to the old shape. The spec says to confirm with
   `listImports` on his installation before shipping that there are no such
   devices; this build could not do that (his installation is not this lane's to
   open) and names it here.
5. **DECISIONS:521 is not on this branch.** `63240b7` carries it and lives on
   `origin/rebuild/t2-client-core`; this worktree's `DECISIONS.md` ends at 520.
   The rulings were taken from the build brief verbatim. Worth reconciling
   before the seal so the ledger the seal reads is the one the build was built
   against.
6. **The S8 package.** No package on this branch pins
   `source-admission.mjs`, `plan-edit-model.cjs`, `import-screen.mjs` or
   `today-bindings.mjs`, and `rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs`
   is B-NTC's own ruling and does not name any of them. There was therefore no
   ruled-substitution entry for this build to write. `today-bindings.mjs` is
   unchanged, which removes one of the four the spec expected to need one.
