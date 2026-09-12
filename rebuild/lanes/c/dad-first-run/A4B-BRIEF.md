# A4B - DAD FIRST-RUN ROUND 2: DAYS-ONLY SPLIT, EXERCISE CATALOGUE, STARTER WEEK

Tier **screens** (`DECISIONS:88`): ONE independent Opus reviewer (author != reviewer, told to disagree) + CI
green both OS. A4b adds no engine code. Authority: `DECISIONS:125` and `:127` (the owner judging the real A4
screens), dispatched by `REQUESTS` `21:28 ET PM to C` and `21:35 ET PM to C`. A4 as accepted merged first,
unchanged (`DECISIONS:128`, merge `57839c3`). Base `b31ae5f024f24a4cda78f55ebcd1de23135fb6bf` (`origin/rebuild/t2-client-core`, A4 merged). Branch
`rebuild/lane-c-a4b`. Status **BRIEF-READY**; nothing merges before the owner's look (section 6). EFFORT by
role (`DECISIONS:119 (5)`): **builder MEDIUM** (every shape is specified here), **reviewer HIGH** (samples
the catalogue, re-derives the band arithmetic, runs the mutants), **integrator LOW** (mechanical, on ACCEPT +
CI green). Every number and vocabulary below carries a `file:line` source or is marked **INVENTED**
(`DECISIONS:115` standing lesson).

## 0. READ-LIST (`DECISIONS:119 (6)`)

`DECISIONS.md` 125, 127, 124 (H3), 117, 119 · `REQUESTS.md` 21:28 and 21:35 to C ·
`dad-first-run/BUILD-BRIEF.md` (A4's bar S1-S25) and `A4-REPORT.md` (what shipped) ·
`rebuild/engine/volume.cjs:62-85` (`programmeVolume`, `bucket :74`, Pelland 2025 note `:67-73`) ·
`constants.cjs:327` `VOL_BANDS`, `:330` `INDIRECT`, `:333` `MG_LABEL` · `plan.cjs:11-22` `dayType`, `:84`
`_bornValid` · `today.cjs:63-64`, `:179` (`genSession` by day kind) · `seed.cjs:14-60` (label spellings) ·
`rebuild/m4/workout/athlete-state.cjs` (`REQUIRED_SETUP :59`, `REQUIRED_EXERCISE :60`, `closed() :65-71`) ·
`rebuild/m3/w7-preview/today/{setup-model,setup-commands,setup-app,setup-host}.mjs` and `plain-copy.cjs` ·
`rebuild/slice/P1-NO-DASHES-BRIEF.md`.

## 1. CUSTODY

**ADD** under `rebuild/m3/w7-preview/today/`: `split-kinds.mjs` (section 2), `exercise-catalogue.mjs`
(section 3), `starter-week.mjs` (section 4), `test/catalogue.test.mjs`. **EDIT**, all inside A4's granted licence (`DECISIONS:117 (1)`, which names `today-app.cjs`,
`screens.template.html`, `design.cjs`, `build.mjs` and the `setup-*` files): `setup-model.mjs`,
`setup-app.mjs`, `setup-commands.mjs`, `setup-check.mjs`, `test/setup.test.mjs`, `screens.template.html`,
`design.cjs`, `build.mjs` (`REQUIRED_INPUTS` 99 pinned inputs becomes 102). **OUT**, a REQUESTS line and
never an edit: `rebuild/engine/**`, `rebuild/client/**`, `rebuild/m4/**`
(`athlete-state.cjs` included), `rebuild/conform/**`, `.github/**`, `rebuild/m3/w6/host/**`, `src`,
`ledger`. `today-bindings.mjs` is NOT touched: A4's `createSetupHost` already carries the op; A4b changes
only its payload shape.

## 2. SCREEN 2: DAYS ONLY, EARNED PROPOSES THE KIND

The athlete taps weekdays and never picks upper or lower. Earned proposes each day's kind by a rule printed
on the screen; any day is overridden with one tap (A4's existing Upper/Lower control, now a change, not a
question).

### 2.1 The rule, as a pure function

`split-kinds.mjs` exports `proposeKinds(days)`. `days` is a sorted array of distinct weekday indices `0..6`,
0 = Sunday (`athlete-state.cjs:82-87`). It returns `{ [dayIndex]: "U" | "L" }`, reads no clock and no state.

```
n = days.length;  if (n === 0) return {}
gap[i] = (days[(i+1) % n] - days[i] + 7) % 7          // cyclic gap to the next training day
start  = (n % 2 === 0) ? 0 : (index of max gap, ties to smallest i) + 1 (mod n)
for k in 0..n-1: kind(days[(start + k) % n]) = (k % 2 === 0) ? "U" : "L"
```

It satisfies the owner's three clauses (`DECISIONS:125 (1)`): consecutive entries of the cyclic sequence
always differ, so **no two training days that follow each other share a kind**; for even `n` no pair repeats;
for odd `n` exactly one pair must, and `start` is chosen so it **straddles the largest cyclic gap**, the day
furthest from its twin. At `n = 7` every gap is 1, so one stack is forced and the tie rule places it
deterministically. Source: **INVENTED**. No ledger line and no engine constant states an alternation rule; it
is consistent with, and deliberately not derived from, the engine's fallback week (`plan.cjs:21`, Mon/Thu
upper, Tue/Fri lower), which is one athlete's week and forbidden as a source by H1 (`DECISIONS:93` C3). The
screen names it as Earned's own rule, not as a finding.

### 2.2 Expected outputs, every day count (the red-first test table)

One subtest per row in `test/setup.test.mjs`, each written RED against a stub returning `{}`.

| n | example days | proposed kinds | D_U | D_L | note |
|---|---|---|---|---|---|
| 1 | Wed | Wed U | 1 | 0 | one kind only; the F1 sentence applies |
| 2 | Mon, Thu | Mon U, Thu L | 1 | 1 | the F1 case (`:125 (2)`) |
| 3 | Mon, Wed, Fri | U, L, U | 2 | 1 | twin pair Fri to Mon, gap 3 |
| 3 | Sat, Sun, Mon | Sat U, Sun L, Mon U | 2 | 1 | wrap case: start rotates to Sat |
| 4 | Mon, Tue, Thu, Fri | U, L, U, L | 2 | 2 | even, start = 0 |
| 5 | Mon to Fri | U, L, U, L, U | 3 | 2 | twin pair Fri to Mon, gap 3 |
| 6 | Mon to Sat | U, L, U, L, U, L | 3 | 3 | even |
| 7 | all seven | Mon U ... Sun U | 4 | 3 | one stack forced, Sun/Mon, deterministic |

Further red-first cells: `proposeKinds([])` is `{}`; the result's keys are exactly the input days; no value
is ever `"REST"`; the function is pure (same input twice, deep-equal, no global read); an override moves no
other day; re-entering screen 2 keeps an override and does not re-propose over it. `split.map` is still
built exactly as A4 builds it: every unchosen day written `"REST"` (`athlete-state.cjs:82-92`), at least one
U or L required (`:90-91`).

### 2.3 The two-day sentence, until F1

`DECISIONS:125 (2)` fixes the wording. Screen 2 shows it verbatim when, and only when, exactly two training
days are chosen, and clears it by predicate when the count changes:

> With two days, Earned's full-body plan is coming; for now one upper day and one lower day.

It carries no dash, so `plainCopy()` passes it through unchanged, and it is still routed through P1's
boundary. A one-day athlete gets a sibling sentence on the same shape (one kind only until F1); **that
sentence is the builder's to write and the reviewer's to check.**

## 3. SCREEN 3: PROGRESSIVE DISCLOSURE AND THE CATALOGUE

### 3.1 Two doors, one week (`DECISIONS:127 (1)`)

Screen 3 opens on two primary actions and nothing else to read. **"Build my week for me"** runs the starter
week (section 4) and lands on the editable week; a beginner never names an exercise. **"I'll choose"** opens
the catalogue search on the same editable week, empty. Neither is a mode: both land on the SAME day-by-day
list A4 already renders, every entry renameable to the gym's own label and removable, either door one tap
from the other.

### 3.2 The catalogue file

`rebuild/m3/w7-preview/today/exercise-catalogue.mjs`. An ES module, not JSON: the page fetches nothing (A4's
S17, `DECISIONS:99` zero off-origin), the build pins it by sha in `REQUIRED_INPUTS`, and it carries its
provenance header where a JSON file cannot. Frozen entry shape:

```
{ id, n, aliases: [string], group, mg, head, secondary: [{ mg, lend }], kinds: ["U"|"L"] }
```

`id` is the CATALOGUE id, never the athlete's (his is still slugged from the name he keeps,
`setup-model.mjs:183` `slugOf`, so renaming works). `n` is the default display name and `aliases` the
machine and free-weight names the search matches ("chest press machine", "bench press", "pec deck").
`group` is one of the six in `DECISIONS:127 (3)` (chest, back, shoulders, arms, legs, core) and is
**screen-only, never stored on an exercise**. `mg` is the engine's group label; `head` the region label or
`null` where no region is standard, the engine bucketing on `e.head || e.mg` (`volume.cjs:74`).
`secondary` is what the lift also pays, stored for F2 (`:127 (6)`): **nothing reads it yet** and the screen
promises nothing about it. `kinds` is which day kind(s) the lift belongs to; the starter week uses it.

Provenance, decomposed so the reviewer checks classes rather than trusting the file. The catalogue is
**INVENTED as a whole**: lane C authors it and this repository holds no public dataset to cite.

| class | verdict |
|---|---|
| every `mg` value | **SOURCED**, the eleven distinct labels in `seed.cjs:14-60`: delts `:16`, back `:20`, biceps `:31`, chest `:33`, forearms `:39`, triceps `:41`, calves `:46`, abs `:48`, quads `:52`, glutes `:54`, hams `:58` |
| delt regions (`head`) | **SOURCED**, `constants.cjs:333` `MG_LABEL`: `delts_front`, `delts_side`, `delts_rear` |
| other regions (`head`) | **INVENTED**, the list `DECISIONS:127 (2)` names: `lats`, `upper_back`, `traps`, `lower_back`, `quads`, `hams`, `glutes`, `calves`, `biceps`, `triceps`, `forearms`, `abs`. F2 adds them to `MG_LABEL` |
| lend fraction 0.5 | **SOURCED**, `constants.cjs:330` `INDIRECT` uses exactly 0.5 for press to triceps and delts, rows and pulldown to biceps, curl to forearms |
| any other lend fraction | **INVENTED**, commented at the entry |
| exercise names and aliases | **INVENTED** (common gym vocabulary) |
| which muscle a lift works | **INVENTED** (anatomy the reviewer can check) |

Size 60 to 100 entries (`:127 (2)`). The reviewer **samples at least 15 entries** across all six groups,
checks each tag by its own reading, and writes the sample and its verdicts into the review. A wrong tag is a
finding, not a nit: `mg`/`head` is what the weekly volume screen buckets on.

### 3.3 Search and the custom picker

Two searches (`DECISIONS:127 (2)`): by **name**, matching `n` and every alias, case-insensitive substring;
and by **"what do you want to work?"**, tapping a group, then a region, then that region's lifts. Neither
path asks a beginner what a lift targets. The **two-layer custom picker** (`:127 (3)`) is for a lift the
catalogue lacks: six groups first, tap one to open its regions, and **stopping at the group is complete**
(the entry stores `mg` = the group's engine label, `head: null`). Enthusiasts open the region and may edit
every tag on any entry, catalogue-sourced or custom. A4's "something else" free-text `mg` stays
(`athlete-state.cjs:98` accepts any non-empty string, `DECISIONS:115`). **Loads are never asked**
(`:125 (3)`): screen 4 is unchanged and the first session is still the probe (`today.cjs:80-90`).

## 4. THE STARTER WEEK, SIZED TO THE BANDS

### 4.1 The engine's own arithmetic

`volume.cjs:62-85` `programmeVolume` counts `days = perWeek[e.day]` and adds `n = e.sets * days` to the
bucket `e.head || e.mg` (`:74`). So **weekly sets for a bucket = sets per exercise x lifts in that bucket x
days of that kind per week**. Zones (`volume.cjs:83`, `constants.cjs:327` `VOL_BANDS {floor 6, lo 8, hi 14, ceil 22}`): under 6 UNDER, 6
to 7 LOW, **8 to 14 IN-BAND**, 15 to 22 HIGH, over 22 OVER. With A4's standard `sets = 3` (INVENTED,
`DECISIONS:114 (2)`, `:117 (5)`), the lifts a bucket needs to land in band are `8/(3D) <= lifts <= 14/(3D)`:
**D=1 needs 3, D=2 needs 2, D=3 needs 1, D=4 needs 1**.

### 4.2 What "major muscle" means, per kind

**INVENTED**, declared here and named on screen. Four majors per kind, chosen so the session stays at eight
lifts. **UPPER majors**: chest, lats, upper_back, delts_side. **LOWER majors**: quads, hams, glutes, calves.
**Minors**, placed only when the session budget allows: delts_front, delts_rear, biceps, triceps, abs.
`forearms`, `traps` and `lower_back` are never placed directly; they are indirect-credit buckets
(`constants.cjs:330`). Composition rule: `lifts(major, D) = 2 if D <= 2 else 1`; minors get 1 lift each only
when `D >= 3`. Session size is therefore always **8 lifts x 3 sets = 24 sets** at every day count, and no
session length is promised on screen.

### 4.3 The arithmetic, every day count

| days | D_U / D_L | major lifts each | major sets/week | zone | minor lifts | minor sets/week | zone |
|---|---|---|---|---|---|---|---|
| 1 | 1 / 0 | 2 | U 6, L none | LOW / absent | 0 | 0 | absent |
| 2 | 1 / 1 | 2 | 6 | **LOW (the floor)** | 0 | 0 | absent |
| 3 | 2 / 1 | 2 | U 12, L 6 | U **IN-BAND**, L LOW | 0 | 0 | absent |
| 4 | 2 / 2 | 2 | 12 | **IN-BAND** | 0 | 0 | absent |
| 5 | 3 / 2 | U 1, L 2 | U 9, L 12 | **IN-BAND** both | U 1 | U 9 | **IN-BAND** |
| 6 | 3 / 3 | 1 | 9 | **IN-BAND** | 1 | 9 | **IN-BAND** |
| 7 | 4 / 3 | 1 | U 12, L 9 | **IN-BAND** both | 1 | U 12, L 9 | **IN-BAND** |

### 4.4 The two boundary cases, said plainly

1. **One lift at 3 sets on a 2-day split is 6 a week: the engine's own FLOOR, not in band.** The starter week
   does not pretend otherwise: it places TWO lifts per major so he reaches 6 rather than 3, and screen 3
   carries one honest dash-free sentence saying two days is the floor and that the full-body plan (F1,
   `DECISIONS:125 (2)`) is what puts a two-day athlete in band. Reaching the band at D=1 would need 3 lifts
   per major, a twelve-lift session, which this brief declines as a false fix. **No number is inflated.**
2. **At D <= 2 the minors get no direct lift.** Biceps, triceps and the front and rear delts are paid by
   indirect credit only, and `INDIRECT` (`constants.cjs:330`) is keyed to the OWNER'S four exercise ids
   (`press`, `rows`, `pulldown`, `curl`), a Joe-ism of register class, so a fresh athlete's
   `chest_press_machine` earns **none** of it today. That is engine item F2 (`:127 (6)`); A4b's job is to
   store the `secondary` tags F2 will read, and to promise nothing meanwhile.

## 5. STORAGE

The produced **document** (`payload.setup`) stays byte-compatible with `createCleanInitState`:
`REQUIRED_SETUP` is exactly four members (`athlete-state.cjs:59`), `REQUIRED_EXERCISE` exactly eight
(`:60`), and `closed()` (`:65-71`) **throws on any extra key**. So `head` and `secondary` may NOT be added
to `setup.exercises[]`. `mg` goes to `exercises[].mg` in the document, the group label, shape unchanged;
`head` and `secondary` ride the OP, in a new third payload member keyed by the athlete's own exercise `id`.
`setup-commands.mjs` today builds `payload = { profile, setup }`, and both `prepare` and `validate` assert
`Object.keys(op.payload).length === 2`. A4b widens that to **exactly three**: `{ profile, setup, tags }`,
where `tags` is a closed map `{ [exerciseId]: { head: string|null, secondary: [{ mg: string, lend: number }]
} }` whose key set equals the document's exercise ids exactly, whose `head` is `null` or a non-empty string,
and whose `lend` is a finite number in `(0, 1]`. Anything else refuses with `SETUP_INPUT_INVALID`, the
refusal the module already uses. `setupOf()` is unchanged and still runs the real constructor on the
document before anything is written.

**The red-first test that proves acceptance** (`test/setup.test.mjs`): build a starter week for each day
count 1 to 7 and assert `createCleanInitState({ setup: payload.setup })` returns a frozen state whose
exercises carry exactly the eight members and whose `exOrder` matches the days; assert `validate(op,
readOperation)` is true for the three-member payload and **false** for a payload with two or four members, a
`tags` key set that does not match the ids, a `head` that is neither string nor null, and a `lend` of 0, 1.5
or `"0.5"`. Written RED against the current two-member assertion.

## 6. ACCEPTANCE BAR, written BEFORE the build

New tests: `test/catalogue.test.mjs` **at least 34 subtests** (one per provenance class, one per group,
search, picker); `test/setup.test.mjs` grows by **at least 40** (8 kind rows, 7 day-count rows, storage, the
doors). The reviewer counts them.

| id | check |
|---|---|
| S26 | `proposeKinds` matches section 2.2 exactly, all eight rows, plus the purity, empty, keys-equal-days and never-REST cells |
| S27 | An override survives leaving and re-entering screen 2, changes no other day, and is what reaches `split.map`; the screen never silently re-proposes over it |
| S28 | Every catalogue `mg` is one of the eleven `seed.cjs` labels and every delt `head` a `constants.cjs:333` key, both re-derived from those files at test time; every other `head` is on the declared region list; `group` is one of the six |
| S29 | Catalogue size 60 to 100; ids unique; every entry has an alias; `kinds` non-empty and a subset of `{U,L}`; every `lend` finite in `(0,1]`; nothing in the file names an athlete |
| S30 | Search by name matches `n` and every alias case-insensitively; group then region returns exactly the entries carrying that tag; both pure over the catalogue |
| S31 | The picker: stopping at the group yields a complete entry with a valid `mg` and `head: null`; opening the region sets `head`; a custom free-text `mg` still works |
| S32 | Starter week: for every day count 1 to 7 compute weekly sets with the ENGINE'S formula (`volume.cjs:74-82`) and assert every zone in the section 4.3 table cell by cell, the two LOW rows included. The table is the fixture |
| S33 | The starter week invents no load, set count or rep target: `sets`/`hi` are A4's standard, every `w` is null, no catalogue entry carries a weight |
| S34 | Both doors land on the same editable week: after either, every entry is renameable and removable and the other door is still one tap away |
| S35 | Storage: section 5's acceptance and every refusal cell |
| S36 | Durability unchanged: ONE op, written once on "Start using Earned"; complete the flow through both doors, reload and a real `taskkill`, land on Today with one op and the same state (A4's `setup-check.mjs`, four kills) |
| S37 | First run still happens once: with a first-run op present the setup route refuses and offers Today; `RESTORE_REQUIRED` never offers setup; `boot({basisState})` still refused (`SETUP_BASIS_STATE_REFUSED`) |
| S38 | No dashes: every new string routed through `plainCopy()` (`plain-copy.cjs`) and the build refusing a dash in any new module's string literals (P1's `AI_DASH_IN_BUILD`), proved by putting one back |
| S39 | Design fidelity: `design.cjs` harvests the new screen-3 vocabulary and the build refuses any omission, as it does for A4 and A3 |
| S40 | 390x844 and 320px: every state of screens 2 and 3 (both doors, search open, picker open, a twenty-entry week) with `scrollWidth <= clientWidth`; inputs >= 16px; tap targets >= 44px |
| S41 | Primary action inside the first viewport in every state, or visible once scrolled to on a screen that legitimately scrolls, with the report naming which scroll and why |
| S42 | The two honest sentences render exactly when their predicate holds and clear when it stops: the two-day F1 sentence verbatim (`:125 (2)`) and the D<=2 minors sentence |
| S43 | Zero regressions, exact counts on the base: today **64** / copy **36** / gym **64** / checkin **28** / setup **104** / W6 **552** / journey **51** / A0 host **31** / w7-preview **19** / `native-carriers-package.cjs --ci` **PASS** / `build.mjs` **PASS**. A4b may only ADD; any moved subtest is named in the report with its reason |
| S44 | The hand test (`HAND-TEST.md`), one human run, through the "Build my week for me" door AND the "I'll choose" door. Not substitutable by a unit test |

**Mutants**, each must turn a check RED: M21 start the alternation at the first day for odd counts, ignoring
the largest gap (S26 wrap row) · M22 let an override be re-proposed over (S27) · M23 spell one `head`
`delts_lateral` (S28) · M24 give an entry `mg: "shoulders"` (S28) · M25 place 1 major lift at D=2, so majors
read 6 not 12 (S32) · M26 place 3 at D=1 to force the band (S32 and the 4.4 refusal) · M27 add `head` to a
document exercise (S35, `closed()` throws) · M28 keep `payload.length === 2` while writing tags (S35) · M29
drop one alias from search (S30) · M30 make "stopping at the group" incomplete (S31) · M31 put an em dash in
the F1 sentence (S38) · M32 write one op per screen again (S36).

**CI residual, carried on A4b's ledger line:** `test/setup.test.mjs`, `test/catalogue.test.mjs`,
`setup-check.mjs` and P1's `copy` tests are NOT in `rebuild.yml`'s enumerated today step; `.github` is
editable only inside an engine package that re-pins it (`:112`, `:117 (4)`), so the "CI both OS" half is a
RESIDUAL for A4b's own suites until the B-NTC seal enumerates them. CI green on the branch means every pinned
step, the five enumerated today files included, stays green.

**Review protocol**: ONE Opus reviewer, **effort HIGH**, author != reviewer, dispatched blind and told to
disagree. It runs S26 to S43 itself, re-derives the 4.3 table from `volume.cjs` rather than from this brief,
samples >= 15 catalogue entries, tries M21 to M32 and performs S44. Verdict in `dad-first-run/A4B-REVIEW.md`.
**OWNER LOOK at PR-READY**: the PM serves the real screens on the PC (`build.mjs` then `serve.mjs`,
`http://127.0.0.1:4178/?screen=setup`) and the owner judges screens 2 and 3 as he judged A4. Nothing merges
before that look.

## 7. OUT OF SCOPE, HANDED ON

- **F1, full-body session kind**: engine tier, lane B (`:125 (2)`, REQUESTS 21:28 to B). Until it merges a
  two-day athlete gets U + L at the floor and the sentence. A4b adds no third kind and must not fake one.
- **F2, catalogue-driven indirect credit and `MG_LABEL` region heads**: engine tier, lane B (`:127 (6)`);
  A4b only STORES `secondary`. **H2 / `e.setup`**: shipped without, `:117 (2)` option (ii), unchanged.
- **H3, clean-init cannot paint Today**: engine tier, lane B package M2-H3-CLEAN-INIT (`:124`). A4's S19
  stays PARTIAL and its sentence stays on Today; A4b does not touch it.
- **Screens 4, 5, 6 and the landing Today**: unchanged except for what section 5 stores. **The dash sweep of
  merged screens**: P1, merged; A4b reuses its boundary and writes no second mechanism.

## 8. BATCHED OWNER NOTES (placeholders)

Per REQUESTS 21:28 and 21:35 ("more owner feedback on screens 3-6 may follow tonight; batch it into A4b").
RULE: a new note is folded in HERE, the brief re-issues, and lane C posts a fresh **BRIEF-READY** STATUS line
naming the new sha256 and the `DECISIONS` line it folds. A note arriving after the builder starts is applied
on the same candidate branch (`:100`); a note changing a check appends S45 onward and re-numbers nothing.

- **Screen 4 (loads)**: no note yet. **The landing Today**: blocked on H3, not on an owner note.
- **Screen 5 (priority muscles)**: no note yet. Likely: the chips become the catalogue's regions, not the
  eleven `mg` labels.
- **Screen 6 (summary)**: no note yet. Likely: a per-muscle weekly set count from section 4, the first
  COMPUTED number on any setup screen, needing its own provenance row.

## 9. QUESTIONS THIS BRIEF PUTS (REQUESTS-ready one-liners)

1. `C -> PM · A4b custody: three NEW files (split-kinds, exercise-catalogue, starter-week) under rebuild/m3/w7-preview/today/ plus edits to setup-*.mjs, screens.template.html, design.cjs, build.mjs. DECISIONS:117 (1) granted that set "for A4 only" - confirm the same licence for A4b, or name the builder as Track A's.`
2. `C -> PM · A4b widens the first-run op payload from {profile, setup} to {profile, setup, tags} so head and secondary can be stored for F2 without touching athlete-state.cjs (REQUIRED_EXERCISE is closed at eight members, :60/:65-71). Confirm a third closed payload member is the right home, or name another.`
3. `C -> B · F2 (:127 (6)) will read what A4b stores. Confirm the shape before A4b freezes it: tags[exerciseId] = {head: string|null, secondary: [{mg, lend}]}, lend in (0,1], 0.5 being constants.cjs:330's own value. If F2 wants the tags inside the exercise record instead, say so now.`
4. `C -> B · F1: A4b's starter week puts a 2-day athlete's majors at 6 sets a week, VOL_BANDS.floor (constants.cjs:327), NOT in band, and says so on screen. Confirm F1 is the fix and that lane C should attempt no screens-tier workaround.`
5. `C -> PM · The alternation rule is marked INVENTED: no ledger line or engine constant states it, and plan.cjs:21's fallback week is one athlete's, forbidden as a source by H1. Confirm INVENTED-and-declared is acceptable, or name a public standard to cite.`
