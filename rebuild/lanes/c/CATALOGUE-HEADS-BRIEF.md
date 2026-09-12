# CATALOGUE HEADS - name the region on every unambiguous secondary credit

Tier **screens**, small (`DECISIONS:154 (8)`): ONE independent reviewer (cross-model per `:159 (2)`) + CI
green both OS. Base `8a42509`. **Custody: exactly two files** - `today/exercise-catalogue.mjs` and
`today/test/catalogue.test.mjs`; no engine byte. EFFORT: builder LOW, reviewer HIGH, integrator LOW.

**Why.** `DECISIONS:155 (3)` rules that a coarse `back` or `delts` helper stays `qualified:false` and
region-unspecified: an unqualified count, no band, tier, verdict or proposal. `:154 (8)` shrinks that set AT
THE SOURCE, so F2 projects a resolved credit for every athlete set up after this edit. The catalogue already
carries `head` on the PRIMARY (`volume.cjs:74` buckets on `e.head || e.mg`); this adds it to the SECONDARY
credits. **Scope, derived not guessed.** Only `back` and `delts` have sub-regions (`REGION_MG`,
`exercise-catalogue.mjs:60-66`); `chest` has none (`REGIONS.chest` is `[]`) and `biceps`, `triceps`,
`forearms`, `quads`, `hams`, `glutes`, `calves`, `abs` are each their own region. So **only `delts` and
`back` secondaries are unresolved: 21 credits across 21 of the 83 entries.** This brief resolves **16** and
deliberately leaves **5**.

## The edits, every one, before and after

The secondary credits are shared frozen constants (`:84-89`), so most of the change is four of them, which is
also why it cannot drift entry by entry.

| # | where | before | after | entries affected |
|---|---|---|---|---|
| 1 | `:84` `FRONT` | `{ mg: 'delts', lend: 0.5 }` | `{ mg: 'delts', head: 'delts_front', lend: 0.5 }` | chest_press_machine, incline_chest_press_machine, barbell_bench_press, incline_barbell_bench_press, dumbbell_bench_press, incline_dumbbell_press, machine_fly, cable_fly, dumbbell_fly, push_up, dip_chest, close_grip_bench_press (**12**) |
| 2 | `face_pull` | the shared `{ mg: 'delts', lend: 0.5 }` | a new `REAR = { mg: 'delts', head: 'delts_rear', lend: 0.5 }` | face_pull (**1**) |
| 3 | `upright_row` | `DELT_H` `{ mg: 'delts', lend: 0.25 }` | a new `SIDE_H = { mg: 'delts', head: 'delts_side', lend: 0.25 }`; `DELT_H` is then unused and is deleted | upright_row (**1**) |
| 4 | `romanian_deadlift`, `deadlift` | `{ mg: 'back', lend: 0.5 }` | a new `ERECTOR = { mg: 'back', head: 'lower_back', lend: 0.5 }` | romanian_deadlift, deadlift (**2**) |

The constant NAMED `FRONT` already meant the front delt (`:84`); this makes the data say what the name says.
`0.5` stays `constants.cjs:330`'s fraction and `0.25` stays INVENTED, both unchanged: **no lend value moves.**
Every `head` added is **INVENTED-and-declared**, exactly as the primary heads are.

## The five left UNRESOLVED

`BACK_H` (`:86`, `{ mg: 'back', lend: 0.25 }`) is **not** changed: its uses split between two regions and the
ruling says *anatomically unambiguous*.

- `rear_delt_fly`, `rear_delt_machine`, `cable_rear_delt_fly` - rhomboid and mid-trapezius together, which
  straddles `upper_back` and `traps`. `farmers_carry` - trapezius and erector at once, same objection.
- `ab_wheel` - the back contribution is contested between `lats` and `lower_back`.

They stay `qualified:false` under `:155 (3)`; the brief says so rather than shrinking the number by guessing,
and a later catalogue correction changes future snapshots only (`:155 (2)`).

## The op
`setup-commands.mjs` already carries `tags[exerciseId] = { head, secondary: [{ mg, lend }] }`. The secondary
entries gain an OPTIONAL `head`, so the op's tags carry it and F2 reads a resolved credit; `head` absent
keeps today's meaning, region-unspecified. **The payload stays three members and the validator's other rules
are untouched**: this widens one nested optional and nothing else.

## Acceptance bar (`test/catalogue.test.mjs` grows by >= 12 subtests; every cell RED first)

| id | check |
|---|---|
| H1 | **Every named head is legal**: each `head` on a primary or a secondary is either a `constants.cjs:333` `MG_LABEL` key (`delts_front`, `delts_side`, `delts_rear`, re-derived from that file at test time) or one of the `DECISIONS:127 (2)` region labels, re-derived from `REGIONS` |
| H2 | **A head agrees with its mg**: `REGION_MG[head] === mg` for every secondary that names one; a head belonging to another label fails |
| H3 | The exact 16 credits of the table above carry their head, named entry by entry; a 17th resolved credit fails the suite until this brief is amended |
| H4 | The five named above carry NO head, asserted by name, so shrinking the set silently is a test failure |
| H5 | No lend value changed: the multiset of `(mg, lend)` pairs across the catalogue is byte-identical to the base, proved against a pinned snapshot |
| H7 | The tags a completed setup produces carry the secondary head; a run through `setup-commands.mjs` `prepare`/`validate` accepts it, and an illegal head refuses |
| H6 | Entry count stays 83; ids, aliases, groups, kinds and every primary `mg`/`head` unchanged |
| H8 | Zero regressions on this base: catalogue and setup suites unmoved but for the added cells; today **64**, copy **36**, gym **64**, checkin **28**, W6 **552**, `--ci` **PASS**, `build.mjs` **PASS** |

**Mutants**: R1 a secondary `head: 'delts_lateral'` (H1) · R2 a chest secondary with a head (H2) · R3 resolve
`BACK_H` to `traps` (H4) · R4 change `FRONT`'s lend while adding the head (H5) · R5 drop `head` from one of
the 12 (H3) · R6 a primary head contradicting `REGION_MG` (H2).

**Reviewer**: ONE, effort HIGH, blind, cross-model (`:159 (2)`), told to disagree; re-derives the legal head
set from `constants.cjs` and `REGIONS` itself, checks all 16 assignments against its own reading of the
movement, and argues with any of the five left unresolved. Verdict `rebuild/lanes/c/CATALOGUE-HEADS-REVIEW.md`.

**CI residual**: `test/catalogue.test.mjs` is not in `rebuild.yml`'s enumerated today step and `.github` is
editable only inside a re-pinning engine package (`:112`); it rides the next re-seal. Say so on the ledger line.

## READ-LIST

`DECISIONS.md` 154 (8), 155 (2) (3), 127 (2) (3), 115 · `today/exercise-catalogue.mjs` (`:60-66` `REGION_MG`,
`:76-89` the entry helper and the shared credits), `today/test/catalogue.test.mjs`, `today/setup-commands.mjs`
(the `tags` member) · `constants.cjs:333` `MG_LABEL`, `:330` `INDIRECT` · `volume.cjs:74` ·
`rebuild/lanes/d/BRIEF-F2-TAG-PROJECTION.md` @ `rebuild/lane-d-f2` (what reads this).
