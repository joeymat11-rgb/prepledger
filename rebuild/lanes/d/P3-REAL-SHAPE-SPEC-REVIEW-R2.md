# P3-REAL-SHAPE-SPEC REVIEW R2 (same independent reviewer, lane D, Opus high)

## VERDICT: ACCEPT

Re-reviewed at `6e8c9c7` on `rebuild/d-p3-real-shape` (R1 was `e35c296`; my R1
review is `d727b66`). `git diff d727b66..HEAD --stat` is exactly two files -
`rebuild/lanes/d/P3-REAL-SHAPE-SPEC.md` and
`rebuild/lanes/d/p3-real-shape/legacy-fixture.cjs` - and
`git diff f3243f8..HEAD --stat` is six files, ALL under `rebuild/lanes/d/`.
No product file, no `DECISIONS.md`, no other ref. Working tree clean; HEAD and
`origin/rebuild/d-p3-real-shape` are the same sha. Neither changed file carries
a single non-ASCII byte (measured, 0 of them, so no en dash or em dash).

All SIX blocking findings are RESOLVED. Nothing is disputed and nothing I raised
was answered with an assertion I could not check. One R1 NOTE (N8, the cell
bookkeeping) is only PARTLY resolved and is recorded below as the single open
item; it is prose arithmetic that the spec's own new table disambiguates, it
touches neither the rule nor the fixture, and it does not hold the ticket.

I re-ran the fifteen cells myself against the changed fixture and the UNCHANGED
S7 tree (TZ America/New_York, `node --test` on `real-shape-walk.test.mjs` and
`real-shape-capture.test.mjs`): **15 tests, 15 pass, 0 fail, 0 skipped**. The
rows are the same rows as R1, which is the point - the fixture's numbers moved
and its SHAPE did not.

---

## THE SIX BLOCKING FINDINGS

### B1 - `capture_membership` dereferenced `expected` before guarding it. RESOLVED.

The rewritten diff (2.5) computes `produced` first and tests `!produced` before
anything is read off it; `encode([...produced.exercise_ids])` now sits behind
two short-circuits. I re-confirmed the premise at `rebuild/engine/today.cjs:83-85`
(`sessionMembership` returns `null` for any day that is not U or L) and confirmed
that the new `documentProgramme` out-parameter is in scope where it is read:
`documentSets` is declared in `replay()` at `source-admission.mjs:295` and the
capture block at `:398` is a closure (`resolveCapturedLayout`) inside the same
function, so a sibling `const documentProgramme={state:null}` reads there.
`documentProgramme.state` is also null-guarded, which covers the case where
`programme()` threw before the assignment (no setup op, `Setup.validate` refused,
or the constructor threw): the result is a named `capture_membership` refusal
beside the programme issue, not a throw. Cell (d5) is the right proof and it is
specified as a refusal-by-name with no `TypeError` on the path.

### B2 - the order proof was pointed at the wrong programme. RESOLVED, by a better fix than I recommended.

I accept the author's reasoning and withdraw my own recommendation. Comparing the
re-keyed list against the FILE's pool in order would have asked a capture to match
an order that did not exist when it was written; re-pointing `sessionMembership`
at the DOCUMENT's own state answers the question the capture can actually answer,
is the same right-hand side `capture_sets` has used since P3-PORT-FIX-2
(DECISIONS:509 Q1, and the comment at `source-admission.mjs:416` says so in
those words), and it compares pool AND order exactly, with nothing relaxed.

I checked that this is runnable rather than only coherent, because the right-hand
side is now a RAW `createCleanInitState` state that has not been through the
migration or the settle pass:

- it is deeply frozen (`athlete-state.cjs:333`, `freezeDeep(state)`), and nothing
  on the membership path writes to it: `memoOnState` is a WeakMap
  (`engine/energy.cjs:1130-1139`), `dayType` (`engine/plan.cjs:11-22`) is pure,
  `_sessionPool` / `exActive` (`engine/today.cjs:68-70`, `engine/plan.cjs:87-95`)
  only read. So no strict-mode throw and no memo mutation.
- it carries the two members the reader needs: `exOrder`, built per day from the
  setup document's own order (`athlete-state.cjs:308-309`), and `split`, the
  document's own `{from, map}` (`:246`, `:332`), so `dayType` resolves a
  PRE-IMPORT day as long as the setup's `from` is on or before it - which it is,
  because the workout was recorded after the setup.
- both sides of the comparison are DOCUMENT ids: `counts` is keyed on
  `slot.lift_lineage_id` (unchanged by the diff) and `produced.exercise_ids` are
  the document's. The re-key is confined to `capture_lift`'s `target`. That is
  consistent and it is what the one-line-each summary in 2.5 claims.

PM QUESTION 3's withdrawal is correct: there is no relaxation left to rule on.
Cell (d4) and its control are the right pair, and the control (the FILE's
`exOrder` shuffled, still ADMITS) is what proves the right-hand side moved.

### B3 - the name match lost one-row-one-lift. RESOLVED.

`correspondence` is now injective by construction on BOTH sides, stated in 2.3 in
the terms I asked for, and the companion adds `boundBasis` beside `baseIds`.
I re-read the code being replaced (`plan-edit-model.cjs:114-121`) and the new
binding reads correctly on both branches. The `byId.get(row.id)` FIRST, then
`matchByName` order is load-bearing and right: a document lift that was appended
as retired shares its NAME with the file lifts that made it ambiguous, so
`matchByName` returns nothing for it and only its own id finds it. Cell (d3)
(`"Press"` / `"Press."`) is the case, and a one-sided implementation fails it.

### B4 - the first-run path was weakened. RESOLVED.

`const e = firstRun ? base.exercises[i] : (byId.get(row.id) || matchByName(...))`
with `if (firstRun ? !byId.get(row.id) : boundBasis.has(e.id)) fail(...)` keeps
the id lookup on the first-run branch exactly as `:120` has it today, and section
5 now names the requirement so a build cannot drop it again.

### B5 - 2.5 and 2.6 contradicted each other. RESOLVED, ruled as recommended.

The append is unconditional (2.4, 2.5 case 2): every document lift with no unique
correspondent is appended inactive and tombstoned under `retirements`, session or
no session. The ordering is stated and is right - the write happens after
`programme()` returns and before any family replays, so `capture_lift` and the
companion see one state. The `held.has(row.id)` skip is correct. The engine
premise I checked in R1 still holds: `exActive` (`engine/plan.cjs:87-95`) honours
`retirements` with NO date comparison, so the appended lift never reaches the
card. Cell (d2) is the ordinary case that was missing, and (n6) is the durability
proof.

### B6 - the fixture carried the seed athlete's own `sets`, `hi` and `inc`. RESOLVED.

I re-measured lift by lift against `EXERCISES` (`src/app.jsx:386-433`) as amended
by the weave (`hack.hi = 10` at :547, `calves.hi = 11` / `rows.hi = 9` at :549) and
against the committed fixture. For all sixteen lifts, NO ONE of `sets`, `hi` or
`inc` is the seed's value for that lift any more - not the trio, and not a single
member of it. The one kept value is `inc: null` on the bodyweight raise, which is
a type and is declared in the header, as I said it should be. `w`, every rep
vector, `std`, `first`, `wSets`, the reads, the daily logs, the sleep nights, the
trend and the prose were clean in R1 and are unchanged. The derived vectors that
had to move with the set counts (`press.std`, `extension.std`, `abs.first`,
`curl.wSets`) moved and are not the seed's either. The header's absolute claim is
now true of the file as committed, including the sentence about the DATES, which
are kept as shape and now said to be kept. The totals still disagree with the
phone's (26 v 27 on U, 22 v 21 on L, which I recomputed from the committed rows),
so D-RS-d and D-RS-h2 keep the disagreement they measure - and both are green.

---

## THE NOTES

- **N1 `targets`.** RESOLVED and verified at source: `patchV32`'s whole body is
  inside `if (adj)` where `adj` is the `refeed_review` adjustment
  (`src/app.jsx:10745-10763`). The spec header and the fixture comment now say
  "optional member of a migrated state", which is what the patch does.
- **N2 / N3 / N5 / N6 / N7.** RESOLVED as written: 2.1's "say the uncomfortable
  thing out loud" paragraph and 6.2 (5) are in the reviewer's own terms and sit
  BEFORE the PM's questions; 6.2 (6) covers the relayed bundle; (n5), (n6) and
  (n7) are cells with the right assertions, and (n5) correctly requires the build
  to MEASURE whether `prep.candidateState()` is frozen before writing the line.
- **N4 `normaliseName`.** RESOLVED: the class is Unicode (`\p{L}\p{N}` after
  NFKD with combining marks stripped), stated once, imported by three readers,
  with an empty-name refusal (`exercise_n`) and a non-Latin control in cell (f).
- **N9 P-LABEL fires late.** RESOLVED: the test is above the lift loop in 2.3.
- **N10.** Still true of this revision. The owner's file was not opened by either
  of us, on any ref; PM QUESTION 1's v1/v2 measurement is still the build's to
  make before `today-bindings.mjs` changes.

### N8 (the cell bookkeeping) - STILL OPEN, minor, does not hold the ticket

The new table in 3.3 is exactly what I asked for and it is internally right, but
the sentence above it and the matching sentence in (j) still do not agree with
it. Counted off the table's own rows: NINE cells are marked INVERTS (D-RS-a0, a,
b1, b2, b3, c, g1, k, and D-RS-h conditionally on PM QUESTION 1) and SIX are
marked STAYS (D-RS-d, f, e, 0, g2, h2). The prose says "ELEVEN INVERT and FOUR
STAY AS THEY ARE" in both places. Eleven and four is reachable only by counting
D-RS-k's three assertions separately and by reading "stay as they are" as
"untouched" (which would exclude D-RS-d and D-RS-g2, both of which the table
marks STAYS while noting they gain something). Since the whole point of N8 was
that the build inverts these one at a time, the two sentences should be made to
say what the table says, or the table should carry the distinction the sentences
are drawing. The table is the operative artifact and it is correct, so this is a
one-line edit, not a fix round.

---

## FOUR SMALL THINGS THE BUILD SHOULD CARRY (new, none blocking)

1. **The `steps` bound is now RESTATED in `programme()` rather than probed.**
   2.3 drops `steps` from `BOUNDED_FIELDS` and writes its own ascending-positive
   test. I checked it against `checkExercise` (`athlete-state.cjs:130-133`) and
   the two are equivalent TODAY. But 2.6's own warning - "a second spelling of
   the rule is a second rule" - applies here as much as it does to
   `normaliseName`: if the constructor's ladder rule ever changes, admission will
   not follow it. Worth one comment at the site naming `athlete-state.cjs:130-133`
   as the rule this restates and why it is not delegated (the file may carry no
   ladder at all, so the probe cannot be the whole answer).
2. **An id collision between a file handle and a document slug binds silently.**
   Where a FILE lift's id equals a DOCUMENT lift's id but the names differ, the
   document row is neither corresponded nor appended (the `held.has(row.id)`
   skip), `attach` returns null, and both `capture_lift` and the companion's
   `byId.get(row.id)` branch bind that slot or row to a DIFFERENT lift with no
   refusal. `slugOf` makes this improbable (`hack-squat` v `hack`) and it is not
   a regression - id binding is what both readers do today - but after option A
   the two id spaces are genuinely independent, so the build should either assert
   the collision cannot arise on the real-shape fixture or refuse it by name.
3. **The document's `exOrder` is the capture's order of record now.** 2.5's exact
   order comparison is against a state that has NOT been through the settle pass.
   I satisfied myself that nothing reorders it (`RULED_ORDER` enforcement is
   generation-gated and its ids are the old app's handles, so it cannot touch a
   slug-keyed document), but the cell that would catch a divergence is (c), the
   happy path, not (d4). Say in the build's report which cell holds this.
4. **A few weave line citations drift by one to three lines.** The FACTS are all
   real - I checked each one at source - but in `legacy-fixture.cjs`'s header
   (and in the author's report) `forks` is cited :536-:539 where the write is at
   :534, `pauseSec` :535 where it is :536, `renames` :545-:547 where it is :544,
   and the two `hi` rulings are cited :545-:547 where they are :547 and :549.
   `SEED.v = SCHEMA_V` at :521, `EXERCISES` :386-:433 and `patchV32`
   :10745-:10763 are exact. A fixture whose whole value is cited provenance
   should have its citations land on the line, so the build (or the next
   revision) should re-walk the weave block once and correct them.

---

## WHAT I RE-RAN AND RE-READ

`node --test` on the two suites at `6e8c9c7`, TZ America/New_York, unchanged S7
tree: 15/15 green, same rows as R1. Re-read for this round:
`source-admission.mjs` (`replay()` from :267, the programme call at :295-:297,
the capture block :395-:455), `plan-edit-model.cjs:100-135`, `athlete-state.cjs`
(`checkExercise`, `createCleanInitState`, `freezeDeep`), `engine/today.cjs`
(`_sessionPool`, `sessionMembership`), `engine/plan.cjs` (`dayType`, `exActive`,
`canonicalizePlan`'s header), `engine/energy.cjs` (`memoOnState`), and the old
app's PUBLIC source only (`EXERCISES` :386-:433, the weave :519-:594, `patchV32`
:10745-:10763), read from a scratch copy of `origin/main src/app.jsx`.
`src/history.js` and every private path were never opened, on any ref, in either
round. Nothing was written outside `rebuild/lanes/d/`.
