# N1 - NUTRITION ENTRY (screens + the client command it needs)

Tier **screens** (`DECISIONS:88`): ONE independent Opus reviewer (author != reviewer, told to disagree) + CI
green both OS. **No engine byte changes.** Authority `DECISIONS:143` (lane C queue after A4b: N1 NUTRITION
then N2 SLEEP, target 09-15 to 09-16, before Dad), `:135` (standing licence on the four shared page files;
shapes decided by the lane and disclosed), `:116 (5)` (one Today build at a time: **N1 builds after
report-a-problem, N2 after N1**).

Base `743847a569f71dfc1678890826e2dc1820aa22b3` (`origin/rebuild/t2-client-core`).

EFFORT (`:119 (5)`): **builder HIGH** (a new durable lane and a new projector), **reviewer HIGH**,
**integrator LOW**. This brief HIGH.

Every number and vocabulary carries a `file:line` source or is marked **INVENTED** (`:115` lesson).

## 0. READ-LIST

`DECISIONS.md` 143, 135, 116 (5), 124 and 142 (H3), 107 (seam S1/S2), 114 (1) (no dashes) ·
`rebuild/design/CLAUDE-DESIGN-BRIEF.md` §3 (the approved look) and §4.5 (nutrition) ·
`rebuild/m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md` "What to implement" item 2 and the
integration-order paragraph · `rebuild/engine/energy.cjs:117-141` (`proteinTarget`), `:369-410`
(`observedTDEE`), `:575-681` (`energyBalanceTarget`) · `rebuild/engine/writers.cjs:2789-2820`
(`writeDaily`), `:424` (`applyRead`), `:2896` (the export line) ·
`rebuild/m3/w7-preview/today/today-engine.cjs` (the ONE composition) and `today-model.cjs:134` (the replay
precedent) · `rebuild/client/ops.cjs:19-20` (`KINDS` and `CLASSES`), `rebuild/client/index.cjs:205-232`
(the producer hook and the shape gate) · `rebuild/m3/w7-preview/today/checkin-commands.cjs` and
`setup-commands.mjs` (the two producer precedents) · `rebuild/m3/w7-preview/today/setup-host.mjs` and
`rebuild/m3/w6/local/local-client.mjs:395` (`client.hostBindings({workoutCommands})`) ·
`rebuild/m3/w7-preview/today/plain-copy.cjs`.

## 1. THE ENGINE FACTS (executed on this base, not assumed)

**1.1 An intake writer EXISTS.** `rebuild/engine/writers.cjs:2789` `writeDaily(s, iso, v)` merges a PARTIAL
row into `state.dailyLogs[iso]`: `cal`, `pro`, `steps`, `sodium`, `alc`, each written only when the caller
names the key, and its own comment (`:2790-2796`) says why - a writer that needs the whole row back is "a
data-loss machine waiting for a second door". It is exported (`:2896`) and it IS on the screen's
composition: `today-engine.cjs:34` registers `writers.cjs` LAST onto the browser engine, and
`typeof E.writeDaily === "function"` was executed and confirmed at this base. **So N1 does not need an
engine change and must not propose one.**

**1.2 What an entry IS to the engine: PER-DAY TOTALS, not meals.** `dailyLogs` is keyed by ISO date and
holds one row per day. `cal` is a plain kcal number, `pro` is grams, both `null` when unknown (`:2798-2801`
`num()` maps `""` and `null` to `null`). Every reader filters on `v.cal != null` or `v.pro != null`
(`energy.cjs:394`, `:755`, `:788`; `policy.cjs:373`, `:656`; `today.cjs:244`), so **a missing day is simply
absent from every average - it is never a zero.** That is the honest-empty-state rule, already enforced by
the engine, and N1 inherits it rather than re-inventing it.

**1.3 The classes N1 needs ALREADY EXIST in the accepted client.** `rebuild/client/ops.cjs:20` `CLASSES`
contains **`"food-day"`** (and `"steps"`, and `"sleep"` for N2). `KINDS` (`:19`) contains `"fact"`. The
shape gate (`index.cjs:205-232`) inspects `class`, `kind` and the reserved keys only - **there is no payload
allowlist** - and the producer module authors class, kind and payload. So N1 needs **no edit to
`rebuild/client`**.

**1.4 What is MISSING, and it is N1's seam.** Nothing replays a `food-day` operation into `dailyLogs`.
A1's precedent is exact: `today-model.cjs:134` does
`for (const r of storedReads()) state = E.applyRead(state, r.date, r.lb, { hour: 8 })`. N1's projector is
the mirror: `for (const d of storedFoodDays()) state = E.writeDaily(state, d.date, partial)`. **This is the
N1 seam in the same sense S2 is the sleep seam - but it is a PRODUCT gap, not an engine gap**, because the
writer and the class both exist. That distinction is the whole finding of this brief.

**1.5 The plan's qualified detail, and its units.** `proteinTarget(s)` (`energy.cjs:117-141`) returns
`{ g, lo, hi, floor, perKg, gLo, gHi, ffmKg, bf, bfLo, bfHi, why }`; `g`/`lo`/`hi`/`floor` are **grams**,
`perKg` is `PROTEIN_FLOOR_G_PER_KG`, and the engine's own words call protein "a FLOOR, not a bullseye - over
it is never a miss" (`:139`). `energyBalanceTarget(s)` (`:575-681`) returns `{ lo, hi, mid, dir,
provisional, why, ... }` in **kcal**, with `dir` one of `maintenance` / `deficit` (`:662`, `:664`). Carbs
and fat: **the approved handoff item 2 asks for separately typed protein, carbohydrate and fat values, and
this base's engine has no carbohydrate or fat target** - `dailyLogs` has no `carb` or `fat` member and no
reader computes one. N1 therefore shows protein and calories only, and says on the screen that carbohydrate
and fat are not prescribed, which is one of the handoff's own four qualified meanings.

**1.6 H3, executed.** On a clean-init athlete (`createCleanInitState`), `E.proteinTarget(state)` throws
`Cannot read properties of undefined (reading 'anchorISO')` and `E.energyBalanceTarget(state)` throws
`(reading 'until')` - exactly `DECISIONS:124`/`:142`. **So for Dad, and for Joe before H3 merges, there is
no calorie band and no protein target at all.** N1 must render that as an honest, dash-free
"not available yet" with the reason, never as a zero and never as a borrowed number, and the screen must
still accept the athlete's own entry (his intake is his fact; the target is the engine's).

## 2. CUSTODY

**ADDS** under `rebuild/m3/w7-preview/today/`: `food-commands.cjs` (the producer), `food-host.mjs` (the
durable lane), `food-model.cjs` (the pure answer model and the projector's input), `food-app.mjs` (the
screen), `food-check.mjs` (the browser check), `test/food.test.mjs`.

**EDITS** under the `:135 (1)` standing licence: `today-app.cjs` (the `?screen=nutrition` route and the
Today tile), `screens.template.html`, `design.cjs`, `build.mjs`; plus `today-model.cjs` (the projector,
1.4) and `today-entry.mjs` (`createFoodEntry` beside the existing entries).

**OUT, and a REQUESTS line rather than an edit**: `rebuild/engine/**`, `rebuild/client/**`,
`rebuild/m4/**`, `rebuild/conform/**`, `.github/**`. **`rebuild/m3/w6/local/today-bindings.mjs` is PINNED ON
DISK by B-NTC (`DECISIONS:144`) and must NOT be edited.** N1's host is opened the way `setup-host.mjs` and
the coach's machine-settings lane are: the page calls `client.hostBindings({ workoutCommands })` itself
(`local-client.mjs:395`) with its own commands module, its own database, namespace and lease.

## 3. THE OP DESIGN (decided under `:135 (1)`, disclosed here)

**Profile `earned/food-day/v1`. Class `food-day`, kind `fact`** - both already in the accepted lists
(1.3), so unlike the check-in this lane does not have to borrow the `event` class, and the seam-S1 note in
`checkin-commands.cjs:11-19` is narrowed rather than repeated.

**ONE dated op per day per class, edits are a NEW op, latest wins.** Ops are append-only; a correction is a
new `food-day` op for the same `local_date`, and the projector takes the LAST one for that date (by
effective date, then by the log's own order) and replays only it. There is no update and no delete. This is
the same rule the machine-settings lane uses and it is why `writeDaily`'s partial-merge behaviour must NOT
be relied on across ops: **the winning op carries the whole of that day's answer**, so a replay of one op
reproduces the day exactly. Disclosed because it is the one place N1 deliberately does not use an engine
affordance.

`prepare({action: "food-day", input: {day, effective}})` builds `payload = { profile, day }` - two keys,
the shape both precedents use (`checkin-commands.cjs:149`, `setup-commands.mjs`). `day` is:

| member | rule | unit |
|---|---|---|
| `cal` | optional; finite number, integer, `0 <= cal <= 20000` | kcal |
| `pro` | optional; finite number, integer, `0 <= pro <= 1000` | grams |

At least one of `cal` or `pro` must be present or the command refuses before anything is written - the
check-in's own rule (`checkin-commands.cjs:108-110`). An answer not given is **ABSENT**, never `null`,
never `0`. `validate(op, readOperation)` re-checks the built envelope exactly as the two precedents do,
including the causal-parent check. **Bounds are INVENTED** (the engine bounds neither) and are declared on
the screen as refusals in the page's own words, not silent clamps.

**Provenance.** The op carries the accepted `effective` triple (`local_date`, `local_time`, `utc_offset`),
so a day entered late is still that day's fact and the screen can say when it was recorded, exactly as A3's
check-in read-back does.

**The projector** (`today-model.cjs`, beside the reading replay at `:134`): after the readings are replayed,
for each date that has a winning `food-day` op, `state = E.writeDaily(state, date, partial)` where `partial`
names only the members the op carries. Order is date-ascending. Nothing else is written.

## 4. THE SCREEN

`?screen=nutrition`, reachable from Today's existing nutrition entry (which today says "not wired yet",
`today-app.cjs`), in the approved design's own vocabulary, harvested at check time the way A3's and A4's
are (`design.cjs`).

**States**, all honest, all dash-free through `plain-copy.cjs`:

1. **Targets available** (post-H3, an athlete with the estimate the engine needs): "Eat about `<lo>` to
   `<hi>` kcal" from `energyBalanceTarget`, and the protein FLOOR in grams from `proteinTarget`, each with
   the engine's own `why` behind a disclosure. No invented tolerance (the handoff forbids one).
2. **Targets NOT available** (a clean-init athlete, H3): one sentence naming that Earned has no calorie band
   or protein target for him yet and why, and **no figure at all**. The entry fields still work.
3. **Not prescribed**: carbohydrate and fat are named as not prescribed by the engine (1.5), not hidden and
   not filled with a guess.
4. **Today's entry**: two numeric inputs, calories and protein, both blank, 16px, both optional, with the
   refusals of section 3 in the page's own words.
5. **Recorded**: the day's stored totals read back with "Recorded today at ..." and its provenance, a second
   entry for the same day offered as a correction that writes a NEW op (section 3).
6. **No store / restore-required**: the screen says what the client says and records nothing, exactly as the
   check-in does.

## 5. ACCEPTANCE BAR

New tests: `test/food.test.mjs` **>= 46 subtests**. A browser row in `food-check.mjs` on msedge with a real
`taskkill`. Every cell RED first.

| id | check |
|---|---|
| N1.1 | The producer builds ONE `food-day` / `fact` op of the accepted envelope, with the two-key payload, and refuses everything else (the A4/A3 producer cells, re-aimed) |
| N1.2 | `class: "food-day"` and `kind: "fact"` are read out of `rebuild/client/ops.cjs` at test time; a class not on that list fails the suite |
| N1.3 | At least one of `cal`/`pro` required; an empty day writes NOTHING; an unanswered field is ABSENT from the payload, never null and never 0 |
| N1.4 | Every bound refuses in the page's own words and records nothing: non-integer, negative, above the cap, and a non-numeric string |
| N1.5 | ONE op per save; the operation and its outbox entry are one transaction; a storage fault records no part of it |
| N1.6 | A correction writes a NEW op and the projector takes the LAST for that date; three saves leave three ops and one projected row |
| N1.7 | **The projector equals the engine**: for a fixture of days, `stateFromOps()` deep-equals an independent replay that calls `E.writeDaily` directly, date-ascending |
| N1.8 | A missing day is ABSENT from `dailyLogs`, and every engine reader that filters `v.cal != null` behaves as it does with no entry at all. **No zero is ever written** |
| N1.9 | `writeDaily`'s partial merge does not leak across ops: a day whose winning op carries only `pro` projects a row with `cal` absent, not a stale `cal` from an earlier op |
| N1.10 | Durability: the entry survives a reload, a new host over the same store, and a real process kill |
| N1.11 | **H3 honesty**: on a clean-init athlete the screen renders state 2 with NO figure, `proteinTarget`/`energyBalanceTarget` are never called for display, and the entry still records. The cell is written so it FLIPS to state 1 when H3 lands |
| N1.12 | Targets, when available, are the engine's own values slot by slot, reproduced independently in the test; units are kcal and grams and are labelled as such |
| N1.13 | Carbohydrate and fat are named as not prescribed; no carb or fat figure appears anywhere |
| N1.14 | Design fidelity: every class is a selector in the approved stylesheets, every static sentence is harvested, and the build REFUSES an omission |
| N1.15 | No dashes: zero U+2013/U+2014 in source, template and rendered DOM; the build refuses a planted one (P1's mechanism) |
| N1.16 | 390x844 and 320px, `scrollWidth <= clientWidth`; inputs >= 16px; tap targets >= 44px; one primary action |
| N1.17 | No network: no off-origin reference in any shipped asset; the CSP is unchanged |
| N1.18 | `today-bindings.mjs` is BYTE-UNCHANGED (`DECISIONS:144`), proved by sha in the report; the host is opened through `client.hostBindings` by the page |
| N1.19 | First-run and restore-required unchanged: the nutrition route is not offered before enrolment, and never re-enrols |
| N1.20 | Zero regressions, counts executed on this base: today **64** (adapter 20 + view 23 + design 11 + package 10), copy **36**, gym **64**, checkin **28**, setup **104**, ntc-h6-delta **8**, coach **64**, W6 **552**, A0 host **31**, `native-carriers-package.cjs --ci` **PASS**, `build.mjs` **PASS** |

**Mutants**: P1 write `0` for an unanswered field (N1.3, N1.8) · P2 clamp an out-of-range value silently
(N1.4) · P3 update the existing op instead of writing a new one (N1.6) · P4 project the FIRST op for a date
(N1.6) · P5 let a stale `cal` survive from an earlier op (N1.9) · P6 compute the trend or a target in
adapter code instead of calling the engine (N1.7, N1.12) · P7 render a calorie band for a clean-init
athlete (N1.11) · P8 invent a carbohydrate target (N1.13) · P9 edit `today-bindings.mjs` (N1.18) · P10 use
a class not in `ops.cjs` (N1.2) · P11 put an em dash in a new sentence (N1.15) · P12 skip the outbox entry
(N1.5).

**Reviewer**: ONE Opus, effort HIGH, blind, told to disagree; runs N1.1 to N1.20 itself, re-derives the
projector equality from `writers.cjs` rather than from this brief, tries P1 to P12, and drives the screen in
a real browser with a verified kill. Verdict `rebuild/lanes/c/N1-REVIEW.md`.

**CI residual**: `test/food.test.mjs` and `food-check.mjs` are not in `rebuild.yml`'s enumerated today step;
`.github` is editable only inside a re-pinning engine package (`DECISIONS:112`), so they ride the next
re-seal with the setup and copy suites. The ledger line must say so.

## 6. PROVENANCE

| what | source | verdict |
|---|---|---|
| `dailyLogs[iso] = {cal, pro, steps, sodium, alc}` | `writers.cjs:2798-2807` | **SOURCED** |
| `cal` in kcal, `pro` in grams, `null` when unknown | `writers.cjs:2799-2802`; readers `energy.cjs:394`, `today.cjs:244` | **SOURCED** |
| a missing day is absent, never zero | every reader's `!= null` filter, `energy.cjs:394`, `:755`, `:788` | **SOURCED** |
| `food-day` class, `fact` kind | `rebuild/client/ops.cjs:19-20` | **SOURCED** |
| the producer hook | `client/index.cjs:205-232`; `checkin-commands.cjs:11-19` | **SOURCED** |
| protein is a floor, not a bullseye | `energy.cjs:139` (the engine's own words) | **SOURCED** |
| kcal band `{lo, hi, mid, dir}` | `energy.cjs:662-673` | **SOURCED** |
| no carbohydrate or fat target exists | no member in `dailyLogs`, no reader; the handoff asks for one | **SOURCED (an absence)** |
| clean-init throws on both targets | executed: `anchorISO` and `until`; `DECISIONS:124`, `:142` | **SOURCED** |
| profile name `earned/food-day/v1` | the `earned/<thing>/v1` convention of the two precedents | **INVENTED**, declared |
| the bounds 0 to 20000 kcal and 0 to 1000 g | nothing upstream bounds them | **INVENTED**, declared, refused in words not clamped |
| latest-op-wins, one op per day per class | the lane's decision under `:135 (1)` | **INVENTED**, declared |
| subtest floor 46, the six screen states | this brief | **INVENTED** |

## 7. OUT OF SCOPE, HANDED ON

- **H3** (engine tier, lane B, `DECISIONS:124`/`:142`): N1 renders the honest absence and its cell flips
  when H3 lands. N1 does not wait for it and must not work around it.
- **Steps, sodium and alcohol**: `writeDaily` takes them and no screen collects them. Out of N1's scope;
  the same lane and the same op would carry them later, which is why the payload is a `day` object rather
  than two loose numbers.
- **Automatic target recalculation** and wider lifestyle adaptation: the handoff's own separate stage.
- **N2 SLEEP**: its own brief, builds after N1 (`:116 (5)`).
- **A carbohydrate or fat target**: an engine question, not a screen. Section 8 question 2.

## 8. OPEN QUESTIONS (REQUESTS-ready one-liners)

1. `C -> PM · DISCLOSURE, not permission (:135 (1)): N1 writes class "food-day" kind "fact" (both already in rebuild/client/ops.cjs:19-20, no client edit), profile earned/food-day/v1, payload {profile, day} with day = {cal?: int kcal 0-20000, pro?: int g 0-1000}, at least one required, one op per save, a correction is a NEW op and the projector takes the latest for that date, and the projector replays through the engine's own writers.cjs:2789 writeDaily (present on today-engine.cjs's composition, executed). Object if you want a different shape; otherwise it is decided.`
2. `C -> B · ENGINE QUESTION for N1: the approved handoff (ADDITIONS-C-APPROVED-HANDOFF.md item 2) asks Today to show separately typed protein, carbohydrate and fat. This base has NO carbohydrate or fat target: dailyLogs has no carb/fat member (writers.cjs:2798-2807) and no reader computes one. N1 will show protein and calories and name carbohydrate and fat as not prescribed. Confirm that is right, or say whether a carb/fat target is an engine item (and where it would live).`
3. `C -> PM · N1 renders "not available yet" with no figure for a clean-init athlete because proteinTarget and energyBalanceTarget BOTH throw before H3 (executed: anchorISO, until). Confirm the screen ships that way rather than waiting for H3, since :143 targets 09-15/16 and H3 is lane B's.`
