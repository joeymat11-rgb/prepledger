# P3-REAL-SHAPE-SPEC REVIEW R1 (independent, lane D, Opus high)

## VERDICT: REJECT (one fix round; the MEASUREMENT half is accepted as it stands)

Reviewed at `e35c296` on `rebuild/d-p3-real-shape` (parent `f3243f8`, S7 sealed
and merged). `git diff f3243f8..HEAD --stat` is five files, all under
`rebuild/lanes/d/`; no product file is touched; the working tree is clean.

WHAT I ACCEPT WITHOUT RESERVATION. The fixture's SHAPE is the old app's shape
and I verified every structural claim myself against the public source
(`origin/main src/app.jsx`, copied to a scratch file and read; `src/history.js`
and every private path were never opened, on any ref):

- `SEED.v = SCHEMA_V` at the head of the weave (:521), the seed's own two
  comments (:438, :529), and `migrate`'s `old.v === SCHEMA_V` fast path
  (:12267). There is no chain to run. The spec is right and the fixture's
  `v: 60` is right.
- The split entry is `{from, map, why}`, one entry, map keyed 0-6 with
  U/L/REST, written identically by the weave (:552) and `patchV40` (:11057),
  and `dayType` (:655-:665) is the reader. `why` is a provenance string.
- All sixteen lift `id` / `n` / `mg` / `day` / `head` values and the `w` value
  TYPES (number, `'BW'`, `'hold'`, `null`) match `EXERCISES` (:386-:433) after
  the weave's split edits. `inc: null` on the bodyweight raise is real.
- No `athlete_label`, no `priority_muscles`, no `steps`, no `secondary`
  anywhere in the old app. The four absences are real, not fixture oversights.
- The extra members and their citations (`setup`/`setupAt` :527, `forks`
  :536-:539, `renames` :545-:547, `rirHist` :576, `lastMeta.rirSets` :578,
  `pauseSec`, `pinsBornAt` :532, the per-field `*At` stamps) are all real.

I re-ran every cell myself (`node --test` on the two suites, TZ
America/New_York, the unchanged S7 tree) and reproduced the table exactly:
15 cells, 15 pass, 0 fail. The cells are honest measurements: each names the
product line it measures, several carry their own control (D-RS-g2, D-RS-h2,
D-RS-c's "asked without a label it DOES adopt"), and D-RS-a0's refusal line is
asserted as the exact rendered string. The walk is stub-free: the shipped
shell, `boot()`, the real encrypted repository, the real Import route, a real
`port.cjs` seal per bracket step. Section 1's five gaps are, in my judgement,
correct and better than the three DECISIONS:520 named; gap 5 (a configuration
working load blocks the LOWER day's card after a SUCCESSFUL import) is the
most valuable thing in this branch and I confirmed its mechanism at
`engine-capture.cjs:66` and `today-bindings.mjs:94` by reading both.

WHY REJECT ANYWAY. The RULE (section 2) and the FIXTURE carry six defects that
a build would either ship or have to re-litigate, including a crash, a proof
relaxed much further than the question put to the PM describes, a lost
uniqueness guard, an unasked-for weakening of the FIRST-RUN path, a
self-contradiction between 2.5 and 2.6, and a committed fixture that breaks
the lane's hard privacy rule and its own stated invariant. One fix round.

---

## BLOCKING

### B1. The new `capture_membership` block dereferences `expected` before guarding it

Section 2.5's diff (spec :393-:399):

```
const keyed=[...counts.keys()].map(id=>attach(id)??id);
const same=encode([...keyed].sort())===encode([...expected.exercise_ids].sort());
const ordered=encode(keyed)===encode([...expected.exercise_ids]);
if(!expected||!['U','L'].includes(expected.day)||!same|| ... )
```

`same` and `ordered` are computed BEFORE the `!expected` test, and
`sessionMembership` returns `null` for any day that is not U or L
(`rebuild/engine/today.cjs:83-85`). S7's single condition short-circuited on
`!expected` first; this one cannot. The reachable case is not exotic: the
ADOPTED week is the FILE's, and a Start recorded on the phone before the
import may fall on a day the file's map calls REST. The result is an uncaught
`TypeError` inside `replay()`, not `LOCAL_SOURCE_PROGRAMME_UNRESOLVED
(capture_membership)`, so the owner gets a crash instead of a named refusal
and OPT-3's whole diagnosis-by-field-name promise (6.1) fails exactly when it
is needed. Fix: keep `!expected || !['U','L'].includes(expected.day)` first
and compute `same` / `ordered` after it.

### B2. The order relaxation is far wider than the rule says and than PM QUESTION 3 asks

Section 2.5 prose: "ORDER is compared only when the two programmes list the
same lifts; where adoption changed the POOL, the SET is compared". The code in
the same section instead writes

```
(keyed.every((id,i)=>id===[...counts.keys()][i])&&!ordered)
```

which enforces order only when NO SLOT WAS RE-KEYED. In the normal, intended
option-A case - the phone named the same lifts, so every document id maps to a
file handle - every id changes, the predicate is false, and ORDER IS NEVER
COMPARED even though the pool is identical and the order was perfectly
answerable. The proof is not relaxed "exactly as far as adoption made it
unanswerable"; it is dropped for the whole population this ticket targets.

PM QUESTION 3 therefore puts the wrong choice to the PM: he is asked to accept
a set comparison "where adoption changed the pool", and the code he would be
ruling on drops the order comparison where adoption changed the ADDRESSES.
Fix: compare the re-keyed list to `expected.exercise_ids` in order whenever the
two are the same SET, and fall back to the set comparison only where they are
not; then restate QUESTION 3 against that.

### B3. The companion's name match loses the one-row-one-lift guarantee

`plan-edit-model.cjs:117-119` today reads

```
const row = C.exerciseOf(setup.exercises[i]), e = firstRun ? base.exercises[i] : byId.get(row.id);
if (baseIds.has(row.id) || !byId.get(row.id) || !e) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
baseIds.add(row.id);
```

`baseIds` reads as a duplicate guard, and it IS one today only because
`row.id` and the basis lift's id are the same id: `byId.get(row.id)` is what
binds one row to one basis lift, and `byId.size !== base.exercises.length`
(:116) makes the basis side unique. Section 2.6 replaces the lookup with
`matchByName(base.exercises, row)` and keeps `baseIds.has(row.id)`. But
`row.id` is a DOCUMENT id and the document's ids are unique by construction
(`slugOf` disambiguates with a numeric suffix), so `baseIds` can now never
fire, and nothing else stops TWO document rows from binding the SAME basis
lift. Two setup lifts the athlete typed as "Press" and "Press." normalise
alike and both bind one file lift; the companion then edits one basis lift
from two rows.

The same hole is in admission: `correspondence(fileLifts, documentLifts)` is
specified to return null "where zero or several match" - several FILE lifts
for one document lift. Nothing is said about several DOCUMENT lifts for one
file lift, and that is the direction that matters for the capture block
(B2's `keyed` then carries duplicates) and for the companion.

Fix: make the correspondence INJECTIVE by construction - a pair is kept only
when the normalised name is unique on BOTH sides - and state that in 2.3; then
have the companion refuse on a second row binding an already-bound basis lift.

### B4. The 2.6 diff weakens the FIRST-RUN path, which section 5 says is unchanged

The replacement drops `!byId.get(row.id)` from the condition for BOTH
branches, not just the local-source one. On the first-run branch `e` becomes
`base.exercises[i]` and the row's own id is no longer required to exist in the
basis at all, so a document row whose id is absent from a clean-init basis now
passes a proof it used to fail. Section 5 ("NOT CHANGED") and section 3.2 both
promise the first-run flow is untouched. Fix: keep the id lookup on the
first-run branch; only the local-source branch may stop using it.

### B5. 2.5 and 2.6 contradict each other about WHICH setup lifts are kept

2.5 case 2 and its closing sentence scope the retired-lift append to the
athlete's recorded history: "appended where the label is written, in
`replay()`, ... so `state` is the file's plus EXACTLY THE LIFTS HIS OWN
RECORDED HISTORY STILL NEEDS."

2.6 then relies on the opposite: "A row that matches nothing is a lift the
import RETIRED, and admission kept that lift in the basis as an inactive one,
SO IT IS STILL FOUND."

Both cannot hold. A phone whose setup names a lift the file does not name, and
which has NO pre-import Earned session under it (the ordinary case: the owner
typed sixteen lifts, the file holds fifteen, he had not trained the sixteenth
yet), gets no appended lift, `matchByName` returns nothing, and Edit My Week
refuses `PLAN_EDIT_ORIGIN_UNPROVEN` permanently - the exact failure this
ticket exists to remove, moved from admission to the companion. No cell in
section 4 covers it: cell (d) is the AMBIGUOUS-name case WITH a recorded
session.

Fix: rule it explicitly. My recommendation is that EVERY document lift with no
unique correspondent is appended as an inactive, tombstoned lift, whether or
not a session names it - the state then always contains what both readers
expect, the gym card is unaffected (see N6), and "nothing of his is lost"
becomes true of the programme as well as of the history. Add the cell.

### B6. The committed fixture carries the seed athlete's own set counts, rep targets and increments

`legacy-fixture.cjs:14-20` states, twice and absolutely: "NOT ONE weight, rep,
body reading, trend, lean mass, calorie, protein, step or sleep figure from
SEED is copied here. Every number below is SYNTHETIC." The dispatch's hard
rule says the same thing in the PM's words.

Measured, lift by lift, against `EXERCISES` (:386-:433) as amended by the
weave (hack, calves and rows `hi`): FIFTEEN of the sixteen lifts carry the
seed's `sets`, `hi` AND `inc` byte-identical. Only `rows.hi` differs. `hi` is
the athlete's rep target and `sets` is his set count; both are exactly the
class of figure the rule names, and the spec's own section 2.8 treats them as
his numbers ("the card's total for the U day is the file's").

WHAT IS CLEAN, and I checked all of it: every `w`, every `wSets` vector, every
`last` / `lastMeta` rep vector, `trend`, `model.lean`, every `reads` weight,
every `dailyLogs` calorie / protein / step figure, every sleep hour, the
queue, feed, standing and note prose. None of them is the seed's. The breach
is confined to `sets`, `hi`, `inc`, and it is easy to close: shift them (keep
`inc: null` on the bodyweight raise, which is TYPE and not a figure, and keep
the file's totals different from the phone's so D-RS-d and D-RS-h2 still have
their disagreement). Either fix the numbers or delete the absolute claim; the
first is correct, because the claim is the lane's rule.

Also inside this finding, at lower severity: the fixture reuses the seed's
verbatim dates (`SPLIT_FROM`, `insertions`, `retirements`). Dates are shape
here and I would keep them, but the header's "every number is synthetic"
should be written so it is true of the file as committed.

---

## NOTES

### N1. `patchV32` does NOT write `targets` onto every migrated state

The spec's "THE PATCH CHAIN, ANSWERED" and `legacy-fixture.cjs:150-155` both
say `targets` is written by `patchV32` "onto every MIGRATED state". Read at
`src/app.jsx:10745-10763`: `s.targets` is touched only inside
`if (adj)`, where `adj` is an `adjustments` entry with `rid ===
'refeed_review'`. A migrated file whose owner never applied that proposal
carries NO `targets`. Nothing on the admission path requires it (`dayType`
guards with `s.targets &&`), so the fixture is not wrong to carry `targets:
{}` - but the provenance sentence is, and provenance sentences are what this
fixture is for. Correct it, and say the member is optional.

### N2. P-LABEL cannot fire on any old-app file, and option A removes the last content guard

P-LABEL refuses only when the file CARRIES an `athlete_label` different from
the phone's. The old app has no `athlete_label` anywhere - the spec proves
this itself (D-RS-0) - so on the entire population this ticket exists for, the
new named refusal is unreachable. What the change actually does is stamp the
phone's label onto whatever file was admitted.

I asked the reviewer's question directly: CAN OPTION A ADMIT AND ADOPT A WRONG
ATHLETE'S FILE? Yes. After 2.3 there is no id comparison, no lift-count
comparison and no `day`/`mg` agreement with the document; what remains is one
setup op, the identity Yes, a `split` whose every period map deep-equals the
phone's one week, well-formed lifts, and the retained-number bounds. Another
old-app athlete on the same Sun-U / Mon-L / Thu-U / Fri-L week, admitted with
a Yes, passes all of it and is ADOPTED with the phone's own name stamped on
top. Under S7 the per-lift id multiset was, accidentally, a content guard;
option A removes it deliberately and P-LABEL cannot replace it here.

This is inside DECISIONS:520's ruling ("the owner's identity Yes is the
identity guard, :472 (a)") and I am NOT asking for it to be reversed. I am
asking for it to be written down: section 2.1 presents P-LABEL as one of five
proofs without saying it is unreachable on the shape this ticket targets, and
section 6.2's risk list does not contain "the only remaining proof that this
file is his is one tap". The PM should be told that in one sentence before he
answers the three questions.

### N3. What "the phone's first-run label" means for Dad's path

The bundle carries no name of its own. With the 2.4 write, an unlabelled
old-app file takes the label of WHATEVER installation imports it, so the same
bundle imported on a second athlete's phone would come out bearing that
athlete's name, be adopted, and thereafter be indistinguishable from his own
record. Today that is harmless because P-LABEL and the identity Yes stand in
front of it and there is one such file. It stops being harmless the moment two
installations exist and a bundle is ever relayed. One sentence in section 6,
and, if the PM wants it, a second-athlete cell in the lane C dad-first-run
corpus later.

### N4. `normaliseName`'s character class is unstated

2.3 says "lower case, Unicode NFKD, every run of non-alphanumeric characters
collapsed to a single space, trimmed" without saying which alphabet
"alphanumeric" is. With `[^a-z0-9]`, which is what the sentence reads like
after NFKD, a name written in any non-Latin script normalises to the empty
string and `programme()` refuses `exercise_n` under the new copy "A lift in
this file has no name Earned can read". Say the class, and say what it does to
a name that survives normalisation as empty - refusing the whole import on it
is a strong answer for a file that is otherwise perfect.

### N5. The label write mutates `state` in place, in a strict-mode module

2.4 writes `state.athlete_label = op.payload.setup.athlete_label` onto
`prep.candidateState()`. `source-admission.mjs` is ESM and therefore strict,
so if the candidate state is frozen anywhere on that path the assignment
THROWS rather than refusing, and it throws outside the `try` that wraps
`programme()`. `createCleanInitState` freezes deeply (`athlete-state.cjs`
`freezeDeep`), which is enough precedent to make this worth proving rather
than assuming. The build must assert (a) the write lands and (b) it survives
to `view.state` through the `applyRead` / food-projection reassignments that
follow it in `replay()`. Cell (e) asserts adoption, which implies both, but
only for the happy path; assert the write itself.

### N6. The retired-lift append: the engine is safe, and no cell says so

I checked the reviewer's question: `sessionMembership` ->  `_sessionPool`
(`rebuild/engine/today.cjs:68-70`) filters on `exActive`, and `exActive`
(`rebuild/engine/plan.cjs:87-95`) returns false for any id in `s.retirements`,
with no date comparison. So an appended, tombstoned setup lift does NOT reach
the day's pool and does NOT change the gym card's total. The spec's claim in
2.8 holds and this is not a blocking risk.

Two things still need cells. First, the appended lift is absent from
`state.exOrder[day]` and never goes through the engine's settle pass (it is
attached after `prepare`); prove it stays out of the pool after a later boot
and that `canonicalizePlan` does not reinstate it. Second, 2.5's
`capture_membership` "PLUS any retired setup lift that the capture itself
names" clause is load-bearing precisely BECAUSE `exActive` ignores the
retirement date: the expected pool for the pre-import day legitimately omits a
lift the capture names. Say that out loud where the clause is stated.

### N7. The label write also changes what Today SAYS, and nobody named it

`today-app.cjs:316-320` `setupNoteNeeded(enrolled, athleteLabel, state)`
returns true while `state.athlete_label !== athleteLabel`. After 2.4 the
adopted state always carries the phone's label, so the "these are sample
numbers" sentence CLEARS on the morning after an import. That is the right
outcome and it is one of the most visible consequences of this ticket, and the
spec does not mention it in 2.8 or put a cell on it. Add both.

### N8. Bookkeeping in the cell plan

Section 3.3 and section 4 (j) say "the twelve cells"; section 1's table has
thirteen rows; the branch has FIFTEEN tests. The build is told to invert them
one at a time, so the count has to be right. Also: rows 9-11 of section 1 are
one cell (D-RS-k) with three assertions, and rows 12-13 are cells that measure
a NON-gap and therefore do NOT invert - say which cells invert and which stay.

### N9. P-LABEL fires late, so a stranger's file is usually refused by another name

The P-LABEL test is placed after the per-lift loop in 2.3, and `programme()`
throws on the first failure, so a file that names someone else AND has one
out-of-bounds `sets` reports `sets`, not `athlete_label`. If the new sentence
is worth writing, the test that produces it should run before the lift loop.

### N10. Things I could NOT verify

- Anything about the OWNER'S ACTUAL FILE. It was never opened, on any ref, by
  me or (on the evidence) by the author. Section 6.1's three unknowns stand,
  and PM QUESTION 2 (a second split period with a different week) remains the
  most likely next refusal; I agree with the recommendation there and agree it
  should be ruled BEFORE the next retry, not after.
- PM QUESTION 1's producer measurement. I confirmed the MECHANISM (gap 5 is
  real: `today-bindings.mjs:94` registers `Adapter.PROFILE`, and
  `engine-capture.cjs:66` is `if(!number(card.w)&&!(configured&&
  configuration(card.w)))fail('ENGINE_CAPTURE_LOAD_UNPROVEN')`), and I agree
  with 6.2 (1) that the v1/v2 cross-read must be measured on a pre-existing v1
  capture before the line is changed. I did not run that measurement.
- The S8 pinning correction. I confirmed the two ends of it: `today-bindings.mjs`
  IS named in `rebuild/m4/spec/acceptance-s7-port-admission.json`, and
  `local-source-basis.mjs` appears in NO `.json` under `rebuild/` at all. I did
  not re-derive the whole receipt, and the spec is right to tell the build to
  confirm it against the tooling before writing.
- Whether `prep.candidateState()` is frozen (N5).
- The coach readers. I searched for readers of `state.athlete_label` and of the
  period shape across `rebuild/`: the ONLY closed-over `{from, map}` period
  predicate outside `athlete-state.cjs`'s document constructor is
  `plan-edit-model.cjs:36-40`, which the spec already changes, so adopting the
  file's `why` breaks nothing else. I did not audit every coach surface.

---

## THE TABLE, REPRODUCED

Re-run by me at `e35c296`, TZ America/New_York, `node --test` on
`rebuild/lanes/d/p3-real-shape/real-shape-walk.test.mjs` and
`real-shape-capture.test.mjs` against the unchanged S7 tree.
15 tests, 15 pass, 0 fail, 0 skipped. Every row below is what the run printed.

| # | one variable changed | field named | admitted | adopted | morning |
|---|---|---|---|---|---|
| 1 | none (the file as the old app holds it) | `split` | no | - | setup doc |
| 2 | `why` deleted | `exercise_id` | no | - | setup doc |
| 3 | ids rewritten to the phone's slugs | `steps` | no | - | setup doc |
| 4 | a ladder added to every lift | `inc` | no | - | setup doc |
| 5 | `inc: null` replaced by a number | none | YES | NO | setup doc, silently |
| 6 | `athlete_label` = the phone's | none | YES | YES | the FILE's lifts and per-lift numbers |
| 7 | one pre-import session, handle ids | `exercise_id` AND `capture_lift` | no | - | setup doc |
| 8 | row 6, on the day the file calls L | `ENGINE_CAPTURE_LOAD_UNPROVEN` | YES | YES | BLOCKED, no card |
| 8c | row 8 with every load numeric | none | YES | YES | the FILE's L card |
| 9-11 | companion on `why` / handles / no label | `PLAN_EDIT_ORIGIN_UNPROVEN` | - | - | Edit My Week will not open |
| 12 | `mg` vocabulary | none | - | - | not a gap |
| 13 | the extra exercise members | none | - | - | not a gap |

Rows 12 and 13 I re-derived independently: `MG_LABELS` and the old app's `mg`
values are the same eleven engine labels, and D-RS-f's member-by-member walk
is a real survival proof with its three normalisation exceptions honestly
declared rather than asserted away.

---

## WHAT THE FIX ROUND HAS TO PRODUCE

B1 and B2 in the 2.5 diff; B3 and B4 in the 2.6 diff plus an injective
`correspondence` in 2.3; B5 ruled one way and celled; B6's numbers changed in
`legacy-fixture.cjs` (the cells stay green if the file's totals still differ
from the phone's). N1, N2, N3, N4, N7, N8, N9 are edits to prose and to the
cell list. N5 and N6 are cells the build adds. Nothing here changes the
measurement, the fixture's shape, or the five gaps, and all three should be
carried into the next revision unchanged.
