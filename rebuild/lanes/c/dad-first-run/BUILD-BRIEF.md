# DAD FIRST-RUN (SLICE A4) — BUILD BRIEF

Tier: **screens** (`rebuild/DECISIONS.md:88`) — ONE independent Opus reviewer
(author != reviewer, told to disagree) + CI green both OS. No receipts, no
engine gate: A4 adds no engine code.

Companion of record: `BRIEF.md` (the DESIGN brief), `dad-first-run-mock.html`
(the thing the owner approves BY LOOKING), `HAND-TEST.md`, `REPORT.md`.
This file is the BUILD brief: what the builder may touch, where every answer
lands, and the acceptance bar written BEFORE the build (LANES amendment
2026-09-10, `rebuild/lanes/LANES.md` "MECHANICAL INTEGRATION").

Status: **BRIEF-READY, REVISION 2.** The owner LOOKED at revision 1 of the mock
and asked for changes (`rebuild/DECISIONS.md:114`), and the PM corrected one of
them after checking the code (`:115`). All four are folded in below and the
mock is re-issued; the PM shows the owner the revised mock before the build
starts. Under `DECISIONS.md:100` SPECULATIVE AUTHORING the builder may start
now on a candidate branch; nothing merges before that second look (§5).

REVISION 2 changes, each traced to its ruling:
1. **No em dash (U+2014) or en dash (U+2013) in any UI copy** (`:114` (1),
   owner verbatim "no ai dashes are allowed in the ui"). Acceptance check S23.
2. **Screen 3 proposes a named standard start** (3 sets, aim for 10 reps),
   pre-filled and changeable; "I'm not sure" removed (`:114` (2)). Check S24.
3. **The muscle chips are the engine's own labels** from `rebuild/engine/seed.cjs`,
   stored unchanged, no seven-group list and no mapping (`:115`, replacing
   `:114` (3)). Check S25.
4. **Screen-2 copy** (`:114` (4)).
Plus the standing lesson of `:115`: every vocabulary and number on the six
screens states its engine source or is marked INVENTED. That is section 2.8.

Base commit this revision was written against: `9e73d1c47b99025b1278e03f087a18f6ed3205ee`
(`origin/rebuild/t2-client-core`; lane branch `rebuild/lane-c-dad` rebased onto
it; revision 1's base was `74c8412`). Every line/count below was read on that tip.

All numbers in the mock and in every example here are FICTIONAL.

---

## 1. Scope and custody

### 1.1 The files the builder ADDS (all new, under the A1/A2/A3 page)

| file | what it is |
|---|---|
| `rebuild/m3/w7-preview/today/setup-model.cjs` | the pure reducer: answers -> the `setup` document; owns every blank/refusal rule in §2 |
| `rebuild/m3/w7-preview/today/setup-commands.cjs` | the page's own producer-injected command for the ONE first-run op (the A3 shape, `checkin-commands.cjs`) |
| `rebuild/m3/w7-preview/today/setup-host.mjs` | the durable lane: opens this device's installation itself, or takes an injected one |
| `rebuild/m3/w7-preview/today/setup-app.mjs` | the six screens, mounted the way `checkin-app.mjs` mounts one |
| `rebuild/m3/w7-preview/today/setup-check.mjs` | the real-browser check (the `checkin-check.mjs` shape: 390x844, 16px inputs, >=44px targets) |
| `rebuild/m3/w7-preview/today/test/setup.test.mjs` | the node suite (§3) |

### 1.2 The files the builder EDITS

| file | edit | licence |
|---|---|---|
| `today-entry.mjs` | a `createSetupEntry(...)` beside `createWorkoutEntry` / `createCheckInEntry`; the first-run branch in `boot()`; the `basisState` key (§2.6) | lane C one-store file, `DECISIONS:106(b)` + `:111` |
| `rebuild/m3/w6/local/today-bindings.mjs` | `createSetupHost({ day, commands, profile })` beside `createCheckInHost` (`:373-395`) — the SAME generation | lane C exclusive (`LANES.md`) |
| `today-app.cjs` | the `first-run` screen in the router (`:455` is the `recovery` precedent) and the Today entry that never shows first-run twice | A4 (see 1.4) |
| `screens.template.html`, `preview.css`, `build.mjs`, `design.cjs` | the six screens' markup, their approved-vocabulary harvest, the build | A4 (see 1.4) |

### 1.3 OUT of scope — a REQUESTS line, not an edit

`rebuild/m3/w6/host/**`, `rebuild/engine/**`, `rebuild/client/**`,
`rebuild/m4/workout/**` (including `athlete-state.cjs`), `rebuild/m4/spec/**`,
`rebuild/conform/**`, `.github/**`, `src/**`, `ledger/**`.

`.github` is doubly closed: `DECISIONS.md:112` makes `rebuild.yml` editable
ONLY inside an engine package that re-pins it, and everything else under
`.github` PM-owned. A4 therefore cannot give itself a CI step (§4.3).

### 1.4 The custody line the builder must write before the first commit

`rebuild/m3/w7-preview` is PM/Track-A property in `LANES.md`. Lane C's licence
(`DECISIONS:106(b)`, exercised at `:111`) covers ONLY the one-store wrapper
files `today-entry / reading-host / gym-host / checkin-host`. A4's new screen
files and the four shared page files in 1.2 are Track A. So:

> `rebuild/lanes/REQUESTS.md` — `<ts> · C -> PM · A4 Dad first-run may add
> setup-{model,commands,host,app,check} + test/setup.test.mjs under
> rebuild/m3/w7-preview/today/ and edit today-app.cjs, screens.template.html,
> preview.css, build.mjs, design.cjs there · the design brief + mock are lane
> C's (queue item 4) and the screen is the same tier A1/A2/A3 were; lane C's
> :106(b) licence covers only the four one-store wrappers.`

If the PM instead dispatches the A4 builder itself, this brief is unchanged —
only the branch name and the STATUS lane letter change.

---

## 2. The six screens, field by field, and the persistence path

### 2.1 The contract (read on the tip, `rebuild/m4/workout/athlete-state.cjs`)

`createCleanInitState({ setup })` (`:129`) is CLOSED: `closed()` (`:65-71`)
throws on any missing key AND on any extra key. Builder rule: the reducer's
output is exactly these members, never a superset.

`setup` — exactly 4 members (`REQUIRED_SETUP`, `:59`):

| member | type / bound | default if unanswered |
|---|---|---|
| `athlete_label` | non-empty trimmed string (`:132-133`) | NONE — named refusal |
| `split` | `{from, map}`, closed (`:76`) | NONE — named refusal |
| `exercises` | non-empty array (`:134-135`) | NONE — named refusal |
| `priority_muscles` | array of non-empty strings; **may be empty** (`:136-138`) | `[]` — the only real default |

`split` — exactly 2 members (`:76-93`):

| member | type / bound | first-run rule |
|---|---|---|
| `from` | `/^\d{4}-\d{2}-\d{2}$/` (`:73`, `:79`) | today's LOCAL ISO date, never offered as a choice (§2.5) |
| `map` | plain object, exactly keys `"0".."6"`, each `"U"`/`"L"`/`"REST"`, at least one `U` or `L` (`:82-92`) | every unchosen weekday is written `"REST"` explicitly |

`exercises[]` — exactly 8 members (`REQUIRED_EXERCISE`, `:60`; checked `:96-113`):

| member | type / bound | screen | blank |
|---|---|---|---|
| `id` | non-empty string, unique across the array (`:99-103`) | 3 (slugged from `n`) | refusal |
| `n` | non-empty string (`:99-101`) | 3 | refusal |
| `mg` | non-empty string (`:99-101`); **any** label, nothing is enumerated engine-side | 3, from `seed.cjs`'s own labels or free text | refusal |
| `day` | exactly `"U"` or `"L"` (`:104`) | 3 (the list he added it under) | n/a |
| `sets` | `Number.isSafeInteger(x) && x > 0` (`:72`, `:105`) | 3, one answer for all lifts | never blank: pre-filled at **3**, the standard start (`:114` (2)) |
| `hi` | same positive-integer rule (`:106`) | 3, one answer for all lifts | never blank: pre-filled at **10**, the standard start (`:114` (2)) |
| `inc` | finite number `> 0` (`:109`) | 4 | 5, DECLARED (Q3) |
| `steps` | non-empty array, every element finite `> 0`, STRICTLY ascending (`:110-112`) | 4 | refusal |

Written by the constructor, never by a screen: `w: null` and `forks: []` on
every exercise (`:113`), `v: 60`, `plan.autonomy: "propose"`, `exOrder`, and
every history member empty (`:140-167`).

Cross-member rule the reducer must enforce BEFORE calling the constructor:
every `day` kind used by an exercise must appear in `split.map`, or `:147-148`
throws `CLEAN_INIT_SPLIT_REQUIRED "no U day in the split for a U exercise"`.
The flow prevents it by only offering lists for the kinds the split contains.

### 2.2 The persistence path — ONE op, ONE generation

The precedent is A3, and then C4:

- A3 (`DECISIONS:107`) wrote its check-in as **ONE dated op per day** (kind
  `fact`, class `event`) through the accepted durable client in its own
  repository lane, using `createT2Stage`'s producer hook — the page hands its
  own `commands` module and `profile` in, `rebuild/client` stamps the op.
  The reviewer's words: an honest use of a named extension point.
- C4 (`DECISIONS:111`) then folded every lane into **one local-era
  generation**: `today-bindings.mjs:373-395` explains why a producer command
  can ride the era's schema-2 lease exactly as a workout set does, and
  `createCheckInHost` (`:395`) takes `{day, commands, profile}` as arguments
  because w6 must not import w7-preview.

**A4 does the same thing, once.** `createSetupHost({ day, commands, profile })`
beside `createCheckInHost` in `today-bindings.mjs`; `setup-commands.cjs` is the
page's producer; the profile is `earned/first-run-setup/v1`.

**ONE op, not six.** The screens hold answers in memory (transient, like A3's
`gymDraft`, `today-entry.mjs:119-121`); the single write happens on screen 6's
"Start using Earned". The op body is the whole `setup` document — the exact
object handed to `createCleanInitState` — plus nothing. Per-screen writes are
REFUSED by this brief: a half-written setup is a state no reader can name, and
the flow's own guarantee is that nothing exists until the week is buildable.

Read-back is the A3 read-back narrowed by profile equality
(`today-bindings.mjs:405-420` `checkInsIn`): the first-run op is found by its
profile in the SAME generation, so first-run's "has this device been set up?"
question is answered by the durable record, never by a flag and never by
`localStorage` (which holds nothing of record, `today-entry.mjs:16-18`).

### 2.3 First run vs restore-required — setup must never run twice

`DECISIONS:111` and `today-entry.mjs:146-155`: C1 mints a device id **only on
first run** — when it observed all three signals absent — and an installation
that is no longer whole refuses with state 18 / `RESTORE_REQUIRED` and **never
re-enrols**. A4 inherits that and adds one rule of its own:

1. store opens + a first-run op is present -> Today. Never the setup screens.
2. store opens + no first-run op -> the setup screens.
3. store refuses `RESTORE_REQUIRED` -> the page says so, **and the setup
   screens are NOT offered**. Offering them there would construct a second
   clean state over a record the device could not read.
4. the write on screen 6 is compare-and-swap over the generation, so two taps
   or two tabs cannot produce two clean-init states; the second sees the op.

This is `BRIEF.md` §6's "no re-run overwriting an existing state" made
executable, and it is checked by S13/S14.

### 2.4 Which state Today then reads

Today's model already takes its engine state from the store
(`today-entry.mjs:26`, `createTodayModel({}).stateFromOps()`). After A4 the
first-run op is the origin of that state for a fresh device. The builder does
NOT add a second composition and does not call the engine directly: the state
is built by `createCleanInitState` inside the model/projector path that already
exists, from the stored op.

### 2.5 `split.from` is today, always

`createCleanInitState` has no clock (`athlete-state.cjs:19-26`). The guard that
catches a future `from` is `splitInForceOn` in
`rebuild/m3/w6/host/workout-host.mjs:39-48` (`WORKOUT_SPLIT_NOT_IN_FORCE`) —
out of A4's custody and not to be touched. First-run therefore writes today's
**local** ISO date and offers no start-date control (`BRIEF.md` §4).

### 2.6 `boot({basisState})` — KEYED, not left open

`DECISIONS:102` recorded it as "harness-only; key or refuse before Dad's A4".
`today-entry.mjs:172-178` says it plainly: nothing in the page supplies one,
and it exists so the checks can run the `DECISIONS:100` fresh athlete beside
the fixture's over the same real stores.

**Ruling for A4: KEY it, do not delete it.** Deleting it would cost A1/A2/A3
their fresh-athlete checks, which are exactly the checks A4 makes load-bearing.
The key is that `basisState` is honoured ONLY when the caller also supplies
its own `hosts` AND its own `today` — i.e. only a harness that brought its own
store and its own clock. `boot({ basisState })` on the shipped page, which
passes no arguments at all (`today-entry.mjs:204`), must throw
`SETUP_BASIS_STATE_REFUSED` and paint nothing. Checked by S15.

Reason a bare refusal is wrong and a bare pass is wrong: after A4 the athlete
state has a durable origin (the first-run op). An unkeyed `basisState` would
let any caller paint a foreign athlete's week over a real device's store —
precisely the "one other athlete's week" failure `athlete-state.cjs:14-17`
exists to prevent.

### 2.7 The `e.setup` omission (`DECISIONS:106` item d) — DECIDED: A4 does not supply it

Read on the tip:

- `rebuild/engine/today.cjs:171` `genSession` puts `setup: e.setup` on every
  card it returns.
- `rebuild/engine/plan.cjs:84` `_bornValid(e)` requires `typeof e.setup === "string"`.
- `setup` is NOT one of the eight members `createCleanInitState` accepts
  (`athlete-state.cjs:60`) and `closed()` (`:65-71`) **throws** on it. So a
  clean-init athlete's exercises carry no `setup` and A4 cannot add one
  without editing `rebuild/m4/workout/athlete-state.cjs` — out of custody (1.3).

What the omission actually costs, traced on the tip (the builder must not
re-litigate this, only cite it):

| reader | behaviour with `e.setup` undefined |
|---|---|
| `today.cjs:171` | the card carries `setup: undefined` — no setup cue is shown. Cosmetic on a debut card |
| `plan.cjs:75` `pinsUnfilled` | returns 0 inside its own try/catch — no `[PIN]` cues exist to fill |
| `plan.cjs:136` | `pinsBornAt` is not stamped, because `pinsUnfilled == 0`, `pinsSeen` and `calibratedAt` are all falsy on a clean state |
| `writers.cjs:1262-1270` | the calves/ham/extension lever predicates read `ex.setup \|\| ""` and simply do not match |
| `plan.cjs:114` | quarantine fires only for an id already in `s.retirements` with an `"invalid:"` value; clean-init writes `retirements: {}` (`athlete-state.cjs:165`), so nothing quarantines |
| `plan.cjs:123` | **the latent one**: the heal branch deletes a quarantine only if `_bornValid(e)`. An exercise with no `setup` can never satisfy it, so if any future path ever writes `retirements[id] = "invalid:…"` for a clean-init lift, that lift is quarantined permanently |

So: **not a blocker for A4, and a real gap in the contract.** It goes to the PM
as written, and A4 ships without it.

**PM QUESTION 1 (exact text to put in `rebuild/lanes/REQUESTS.md`):**

> `C -> PM · RULING NEEDED before A4 merges: rebuild/m4/workout/athlete-state.cjs
> REQUIRED_EXERCISE (:60) has eight members and no `setup`, while
> rebuild/engine/today.cjs:171 passes `e.setup` to every card and
> rebuild/engine/plan.cjs:84 `_bornValid` requires it to be a string. A4 cannot
> add the member (m4/workout is out of lane custody) and will ship clean-init
> exercises with `setup` absent. Traced consequences on the tip: cards carry no
> setup cue; pinsUnfilled/pinsBornAt/the writers.cjs:1262-1270 lever predicates
> all degrade silently to "no cue"; quarantine never fires because
> retirements is {}; BUT plan.cjs:123's heal branch can never clear a
> quarantine on a lift that has no `setup`, so any future writer of
> retirements["invalid:…"] strands that lift forever. Which: (a) A4 collects a
> free-text setup cue per exercise and m4/workout gains a ninth OPTIONAL
> member — an engine-tier change, full gate, not A4's; (b) A4 ships without it
> and the latent plan.cjs:123 case is logged as a register item for Track B;
> (c) something else. Lane C's default if unanswered is (b).`

**PM QUESTION 2 (only if the PM chooses (a)):**

> `C -> PM · If A4 is to supply `setup`, name the field: it is a free-text
> machine-setup cue (seat/pin/lever wording; `[PIN]` markers are the frozen
> app's convention, plan.cjs:75). Does Dad type it on screen 4, or is it
> written empty-string and filled later from a settings screen? An empty
> string satisfies `_bornValid` and matches no lever predicate — which is the
> honest value, but it is a value, and the charter says blank is unknown.`

### 2.8 PROVENANCE: every list and number on the six screens

`DECISIONS.md:115` standing lesson: "a mock states where each vocabulary or
number comes from in the engine (file:line) or says it is invented; the PM
checks the citation before showing the owner." This table is that statement for
A4. The builder keeps it true; the reviewer re-reads every citation.

| what appears on screen | value(s) | source | verdict |
|---|---|---|---|
| **Muscle chips**, stored as `mg` | chest, back, delts, biceps, triceps, forearms, abs, quads, hams, glutes, calves | `rebuild/engine/seed.cjs` EXERCISES (`:14-60`): delts `:16`, back `:20`, biceps `:31`, chest `:33`, forearms `:39`, triceps `:41`, calves `:46`, abs `:48`, quads `:52`, glutes `:54`, hams `:58` | **SOURCED.** Stored verbatim; `athlete-state.cjs:98` accepts any non-empty string, so nothing is mapped |
| **Gloss beside a chip** | "delts (shoulders)", "abs (core)", "quads (front of thigh)", "hams (hamstrings)" | none: the engine has no gloss table. `constants.cjs:333` `MG_LABEL` glosses only delt HEADS (delts_side / delts_rear / delts_front), which first-run does not collect | **INVENTED**, display-only, permitted by `:115` ("never a different stored value"). A check asserts no gloss is ever stored |
| **"something else" free entry** | whatever he types | `athlete-state.cjs:98-101` (`mg` is any non-empty trimmed string) | **SOURCED.** Permitted explicitly by `:115` |
| **Standard start: sets** | 3 | none. The accepted engine has no default set count for a new lift. Nearest engine numbers, cited and NOT used as a derivation: `constants.cjs:327` `VOL_BANDS {floor 6, lo 8, hi 14, ceil 22}` counts WEEKLY sets per muscle, not sets per exercise; the engine's own two newborn lifts carry `sets: 2` (`migrate.cjs:1651`) and `sets: 3` (`:1653`) | **INVENTED**, declared on screen as "Earned's standard start" (`:114` (2)). Never read off `seed.cjs`'s per-lift values, which are one athlete's (H1, `DECISIONS:93` C3) |
| **Standard start: rep target** | 10 | none. `progression.cjs:426` carries `ex.hi || 8` as a guard clean-init never reaches (clean-init always supplies `hi`); the engine's own newborns carry `hi: 20` (`migrate.cjs:1651`) and `hi: 12` (`:1653`) | **INVENTED**, same declaration. Whether it should vary per exercise class is lane B's open question (REQUESTS 17:25 PM to B) |
| **Standard step (`inc` fallback)** | 5 lb | `migrate.cjs:795` clamps any `inc` above 5 down to 5; the engine's two newborn lifts are minted with `inc: 5` (`:1651`, `:1653`) | **SOURCED.** Revision 1's citation ("the ruling is inc 5 default for new lifts") was wrong: no `DECISIONS.md` line mentions `inc` at all. Corrected here and in `BRIEF.md` Q3 |
| **Day kinds** | "Upper body" / "Lower body" / rest | `athlete-state.cjs:61` `DAY_KINDS = ['U','L']`, `:88` (map values U / L / REST), `:104` (exercise `day`); `plan.cjs:16` `dayType` returns only these | **SOURCED.** Screen-2 sentence per `:114` (4) |
| **Weekday keys** | "0".."6" | `athlete-state.cjs:82-87` | **SOURCED** |
| **Sets chip options** | 2 / 3 / 4 | none | **INVENTED** (a range around the standard). The only engine bound is positive integer (`:72`, `:105`) |
| **Rep chip options** | 6 / 8 / 10 / 12 | none | **INVENTED** (a range around the standard). Only engine bound: positive integer (`:106`) |
| **"n of 6" counter** | 1..6 | the flow's own screen count | **INVENTED**, and exempt from the no-invented-numbers check by name (S8) |
| **`split.from`** | today's local ISO date | `athlete-state.cjs:73`, `:79`; guard `workout-host.mjs:39-48` | **SOURCED** |
| **Autonomy floor** | "propose", never shown | `athlete-state.cjs:161`; `constants.cjs:270` `AUTONOMY_LEVELS[0]`; `migrate.cjs:944` | **SOURCED**, written by the constructor, not by a screen |
| **Starting load** | none collected | `athlete-state.cjs:111-113` (`w: null`, no member for one); `today.cjs:80-90` DEBUT path | **SOURCED.** The absence is the design (§5) |
| **Rung list parsing** | any non-numeric separator | `progression.cjs:406-409` `parseRungs` | **SOURCED** |
| **Priority muscles** | the same engine labels | `athlete-state.cjs:136-138`, `:150-153` (carried verbatim, no reader consumes it) | **SOURCED**, and the screen says it changes nothing yet |
| **Every other number on screen** | none | he typed it | n/a |

Nothing else on the six screens is a list or a number. If the builder adds one,
it adds a row here first, or S8 fails.

---

## 3. ACCEPTANCE BAR — written BEFORE the build

Numbered, executable, and each check names the silent failure it exists to
catch. `BRIEF.md` §7 A1-A12 are the DESIGN-tier statements of these; S1-S20
are what the suite actually runs. The reviewer runs all of them independently.

### 3.1 New tests to add

`rebuild/m3/w7-preview/today/test/setup.test.mjs` — **at least 58 named
subtests**, with at least one per row of §2.1 (14 member rows), one per row of
§2.8 (20 provenance rows, asserting the citation or the INVENTED marking is
still true), and one per check S1-S16 and S23-S25 below. A suite under 58 is a
signal the builder collapsed cases; the reviewer counts them.

`rebuild/m3/w7-preview/today/setup-check.mjs` — the real-browser check, run as
`node rebuild/m3/w7-preview/today/setup-check.mjs` on msedge, printing the same
shape `checkin-check.mjs:369` prints.

| id | check | fails silently otherwise |
|---|---|---|
| S1 | **Every field lands exactly.** Drive `setup-model.cjs` with a filled fixture; deep-equal its output against the expected document; pass it to `createCleanInitState`; assert `athlete_label`, `split.from`, all seven `split.map` entries, every exercise's 8 members (numbers as numbers, `steps` element-wise) and `priority_muscles` | "10" coerced, a rung dropped, exercises reordered |
| S2 | **Closed-contract fidelity.** Assert `Object.keys(reducer.output)` deep-equals `REQUIRED_SETUP` imported from the module, and each exercise's keys deep-equal `REQUIRED_EXERCISE` — imported, never retyped | the contract grows a member and the flow keeps sending eight |
| S3 | **Every refusal code maps to a screen sentence.** Enumerate the `CLEAN_INIT_*` codes out of `athlete-state.cjs` at test time and assert each has a sentence in the screen-6 refusal table; a new code fails the suite | the engine gains a refusal and Dad sees a raw code |
| S4 | **Empty answer set: no construction, named refusal.** `createCleanInitState` is never called; the refusal names every missing member; the primary is disabled | a blank field becomes a default |
| S5 | **The standard start is proposed, never asked** (`DECISIONS:114` (2)). On a freshly opened screen 3, `sets === 3` and `hi === 10` with both chips already selected; NO control matching /not sure/i exists anywhere in the flow; tapping the selected chip again leaves the value unchanged; choosing another value changes only that one; neither can reach null. The reducer's output always carries both | the removed refusal path leaves a blank that becomes a silent default, or a chip toggles the standard off and `createCleanInitState` throws |
| S6 | **`split.from` <= today in three zones.** Build at 00:00:01 and 23:59:59 local in UTC, America/New_York and Pacific/Auckland (UTC+13); assert `splitInForceOn(state, todayISO)` (`workout-host.mjs:39-42`) is true and `dayType(todayISO, state)` (`plan.cjs:11-22`) equals the kind he chose — never the fallback week | a UTC date built at 8pm EDT lands tomorrow and the first gym visit refuses |
| S7 | **`REST` written explicitly.** All seven weekday keys present; unchosen days are the string `"REST"`, not absent and not `null` | `map` misses a key and `:86-87` throws |
| S8 | **Exactly TWO supplied numbers.** Render every screen in every state, scan text for digit runs, assert each is echoed from an answer, a date/weekday, the "n of 6" counter, or one of the two declared standards: the standard start (3 sets, 10 reps) and the 5 lb standard step. The allowlist is built IN THE TEST from §2.8's rows, each with its citation, and a third supplied number fails the suite | a number creeps into copy and reads as a prescription about him |
| S9 | **Design fidelity by HARVEST, not by list.** Extend `design.cjs` the way A3 did (`design.cjs:228-293`, `recoveryVocabulary` / `assertRecoveryBinding`): harvest the approved vocabulary out of the pinned `Earned-additions-C-approved.html` (sha `caf9c2dc…`) at check time, and the **build refuses any omission**. Every class the screens use must be a selector in the approved stylesheets and every static sentence must occur verbatim there, except a short NAMED preview-owned list (`PREVIEW_COPY`) whose every entry is justified in the report | the first build of A3's screen shipped six approved placeholders missing (`design.cjs:234-237`) |
| S10 | **390x844.** Every screen in every state at 390px wide: `scrollWidth <= clientWidth`; repeat at 320px | one long exercise name breaks the phone layout |
| S11 | **Primary action reachable.** Its top edge inside the first 844px with no scrolling; where a screen legitimately scrolls (the approved recovery screen does — `checkin-check.mjs:17`), the primary is visible once scrolled to and the report says which screens scroll and why | Dad cannot find "Next" and stops |
| S12 | **16px inputs, >=44px targets.** Every `input`/`select`/`textarea` computes >= 16px; every `#phone button` is >= 44px high (`checkin-check.mjs:170-173`) | iOS zooms on focus and the page pans sideways mid-setup |
| S13 | **First run happens once.** With a first-run op in the generation, `boot()` mounts Today and the setup screens are unreachable; a second "Start using Earned" (double tap, second tab) finds the op and writes nothing | a reinstall or a double-tap builds a second clean state over a week of history |
| S14 | **Restore-required never enrols.** With state 18 / `RESTORE_REQUIRED` from the store, the page says so and does NOT offer the setup screens; no device id is minted (`DECISIONS:111`) | a damaged installation quietly starts a second life |
| S15 | **`basisState` is keyed.** `boot({ basisState })` alone throws `SETUP_BASIS_STATE_REFUSED` and paints nothing; `boot({ basisState, hosts, today })` works and is what the checks use (§2.6) | a foreign athlete's week is painted over a real device |
| S16 | **Back never loses an answer.** 1->6, back to 1, forward to 6: the answer object is deep-equal. Change one answer on screen 2 and assert ONLY that answer changed | he corrects a typo and loses his exercise list |
| S17 | **No network.** The build refuses any network reference; zero off-origin requests at runtime; typefaces inlined (`design.cjs:47-55`); CSP unchanged from A1/A5 | a font link makes setup depend on gym wifi |
| S18 | **Durable across reload and a REAL kill.** In the C3 witness harness `rebuild/m3/w6/test/local-witnesses.mjs`: complete the flow, reload -> Today; complete the flow, `taskkill` the browser process, relaunch -> Today, one op, the same state. A graceful close is NOT a kill (A2 review B2) | the state lives in memory and the first crash erases the setup |
| S19 | **Honest empty states on arrival.** The Today he lands on renders A1's own empty states and its "not wired yet" wording (dash-swept per S23; the merged page's own sweep is the PM's P1 item, `rebuild/slice/P1-NO-DASHES-BRIEF.md`) (`today-app.cjs:59`, `:308`, `:332-336`); no figure appears that no reading produced | a fake dashboard greets a brand-new athlete |
| S20 | **No starting load, by design.** Assert every exercise arrives with `w: null`, that no screen collects a load, and that the first session takes the DEBUT path (`today.cjs:80-90`, `baselineAsk: true`, targets 0). Screen 6 carries the sentence naming it | someone "helpfully" adds a starting-weight field and Dad guesses |
| S21 | **No streaks, urgency or dark patterns.** The rendered text of every screen contains no countdown, no "don't lose", no progress percentage; the only skip-like affordance is on screen 5 | gamification arrives one copy edit at a time |
| S23 | **NO EM DASH, NO EN DASH IN UI COPY** (`DECISIONS:114` (1), owner verbatim "no ai dashes are allowed in the ui"). Two passes. (a) Build time: zero U+2014 and zero U+2013 in every built HTML/JS/CSS asset of the setup screens, entities `&mdash;` and `&ndash;` counted as occurrences, and the build REFUSES rather than warns. (b) Render time: render every screen in every state (empty, filled, each validation, the refusal block, the landing Today) and assert zero U+2013/U+2014 in the DOM text, `placeholder`, `aria-label` and `title` of every node. Rewrite rules are P1's (`rebuild/slice/P1-NO-DASHES-BRIEF.md`): aside to a colon or a new sentence, range to the word "to", label suffix to a colon; a minus sign stays U+2212 or hyphen-minus. Code comments, test names and report files are NOT user-facing and keep theirs | the owner's rule is honoured once and erodes one copy edit at a time |
| S23b | **The approved-design harvest is re-pinned WITH the sweep.** Where the pinned 2026-09-08 reference itself carries a dash in a harvested string, the owner's rule supersedes it (`:114` (1) says so in terms): the harvest comparison is DASH-NORMALISED, in one documented place citing `DECISIONS:114`, and the report LISTS every harvested term that needed normalising. Normalisation must not weaken any other harvested word: assert that a term differing by anything other than a dash still fails | the design check and the owner's rule contradict each other and one is silently switched off |
| S24 | **The standard start never becomes one athlete's numbers** (H1, `DECISIONS:93` C3). Assert the two constants are literals declared in the page's own source with the §2.8 provenance comment beside them, and that no value in `rebuild/engine/seed.cjs` is read, imported or copied by any setup file. A grep-level check: the setup files import nothing from `rebuild/engine` | the standard quietly becomes "what Joe does", which is exactly what first-run exists to prevent |
| S25 | **The chips are the engine's own labels** (`DECISIONS:115`). At test time, parse the distinct `mg` values out of `rebuild/engine/seed.cjs` and assert: every chip's STORED value is one of them; the stored set is exactly {chest, back, delts, biceps, triceps, forearms, abs, quads, hams, glutes, calves}; no chip stores a gloss (render "delts (shoulders)", store "delts"); "something else" stores its typed text verbatim and unmapped; and NO coarse-group vocabulary (chest/back/shoulders/arms/legs/glutes/core as a SEVEN-item list, or any table mapping a fine label to a coarse one) exists anywhere in the setup files. If `seed.cjs` gains a label upstream, this test tells the builder rather than drifting | the seven-group list `:115` deleted reappears, and per-muscle weekly volume (`sleep.cjs:894` `perMg`) and indirect credit (`constants.cjs:330` `INDIRECT`, which names triceps / delts / biceps / forearms) go blind |
| S22 | **The hand test.** `HAND-TEST.md`, one human run per build, recorded. Not a unit test and not substitutable by one | the suite is green and the beta tester gives up |

### 3.2 Existing suites that must stay green — EXACT counts from the tip

Read from `rebuild/lanes/STATUS.md` (`2026-09-11 08:59 ET · C · PR-READY`, the
counts the `09:04 ET · C (integrator) · MERGED` line integrated) and
`DECISIONS.md:111`. Windows counts; the builder re-runs them, does not trust
this table:

| suite | command | count at base `74c8412` |
|---|---|---|
| A1/A2 Today | `node --test rebuild/m3/w7-preview/today/test/adapter.test.mjs test/view.test.mjs test/design.test.cjs test/package.test.cjs` | **today 64** |
| A2 gym | `node --test rebuild/m3/w7-preview/today/test/gym.test.mjs` | **gym 64** |
| A3 check-in | `node --test rebuild/m3/w7-preview/today/test/checkin.test.mjs` | **checkin 28** |
| W6 | the W6 suite | **552** |
| W6 journey | local host journey | **51** |
| A0 host | `node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs` | **22** |
| w7-preview (memory-only) | `node --test rebuild/m3/w7-preview/test/*.cjs` | **19** |
| run-current-head | `--all` | **552/552** |
| engine artifact | `node rebuild/m4/spec/native-carriers-package.cjs --ci` | **PASS** |
| page build | `node rebuild/m3/w7-preview/today/build.mjs` | **PASS** |
| browser | Edge runner 6/6 + browser-check + gym-check + checkin-check | **PASS** |

Rule: A4 may only ADD to these. A merge that changes `today 64` to anything
other than `64 + <A4's own new adapter/view/design/package subtests>` must say
in the report which existing subtest moved and why. Zero regressions.

The `19` w7-preview child is scheduled for retirement inside the B-NTC seal
(`DECISIONS:109`, `:112` PASS-19 RETIREMENT). If B-NTC merges first, that row
disappears and A4's report says so instead of reporting 19.

---

## 4. Independent review protocol

### 4.1 The reviewer

ONE Opus reviewer, author != reviewer, dispatched blind (given the brief, the
branch and the mock — not the builder's reasoning as conclusion). Instructed
to disagree and to treat every claim in the builder's report as a hypothesis to
falsify. It runs S1-S21 itself, re-harvests the approved vocabulary itself, and
performs the `HAND-TEST.md` run (S22) on a person who has not seen the app.
Verdict file `rebuild/lanes/c/dad-first-run/A4-REVIEW.md` (or
`rebuild/slice/A4-REVIEW.md` if the PM dispatches), verdict ACCEPT /
ACCEPT-WITH-FIXES / REJECT, with its own executed counts.

### 4.2 Mutants the reviewer must try (each must turn a check RED)

| # | mutant | must be caught by |
|---|---|---|
| M1 | make an unanswered `inc` silently `5` in the MODEL instead of a declared screen standard | S8 |
| M2 | drop one rung from a parsed uneven stack | S1 |
| M3 | let "I'm not sure" write `sets: 3` | S5 |
| M4 | build `split.from` with `toISOString().slice(0,10)` (UTC) instead of the local date | S6 |
| M5 | omit one weekday key from `map` | S7 |
| M6 | send a ninth exercise member (e.g. `setup: ""`) to the constructor | S2 |
| M7 | skip the outbox on the screen-6 write (the A3 all-or-nothing mutant) | S18 |
| M8 | write one op per screen instead of one on completion | S18 + the op count in S13 |
| M9 | offer the setup screens on `RESTORE_REQUIRED` | S14 |
| M10 | accept `boot({basisState})` unkeyed | S15 |
| M11 | delete one approved placeholder from the shipped template | S9 |
| M12 | shrink one tap target to 40px / one input to 15px | S12 |
| M13 | add "3 of 6, almost there!" to the masthead | S21 |
| M14 | render a starting-load field on screen 4 | S20 |
| M15 | put one em dash back into one screen's copy, and one `&mdash;` entity into another | S23 (both passes) |
| M16 | dash-normalise the harvest so that a term differing by a WORD also passes | S23b |
| M17 | make a chip store its gloss ("delts (shoulders)") instead of "delts" | S25 |
| M18 | add a seven-group list and map `biceps` onto `arms` before storing | S25 |
| M19 | read the standard start out of `seed.cjs` (e.g. the first lift's `sets`) | S24 |
| M20 | let the selected sets chip toggle back to null | S5 |

A mutant that no check turns RED is a missing check, not a passing build.

### 4.3 CI green both OS — and the residual A4 must declare

`.github/workflows/rebuild.yml` on the tip enumerates the today tests by name
at **line 89**:

```
- name: A1/A2 — the rebound Today page and the gym card
  run: node --test .../test/adapter.test.mjs .../test/design.test.cjs .../test/gym.test.mjs .../test/package.test.cjs .../test/view.test.mjs
```

Five files. `checkin.test.mjs` is **not** among them (the A3 seam recorded at
`DECISIONS:107`), and `test/setup.test.mjs` would not be either. A4 cannot add
it: `DECISIONS:112` makes `rebuild.yml` editable only inside an engine package
that re-pins it, and `:109` puts that enumeration inside the B-NTC seal.

**Therefore:** CI green both OS on A4's branch means the FIVE enumerated
today files plus every other pinned step stay green — that is genuine and
required — but **A4's own suite does not run in CI until the B-NTC re-seal
enumerates it.** The ledger line for A4 MUST say so, in these words or their
equivalent:

> `CI: the new test/setup.test.mjs (and setup-check.mjs) are NOT yet in the
> enumerated rebuild.yml step (line 89); the "CI both OS" half of the screens
> tier is a RESIDUAL for A4's own suite, closed by the B-NTC re-seal per
> DECISIONS:109/:112, which must add setup.test.mjs beside checkin.test.mjs.`

And a REQUESTS line to lane B, so the re-seal does not forget it:

> `C -> B · B-NTC's rebuild.yml enumeration (DECISIONS:109/:112) must include
> rebuild/m3/w7-preview/today/test/setup.test.mjs alongside checkin.test.mjs —
> A4 cannot add its own step.`

---

## 5. Owner-look dependency, and the three defaults

The DESIGN is approved BY LOOKING at `dad-first-run-mock.html` on an iPhone.
That has not happened (`rebuild/lanes/STATUS.md`, PM 15:50 ET: "the Dad
first-run mock look" is an open owner item; `DECISIONS:112` restates it).

This BUILD brief is BRIEF-READY **now**, and under `DECISIONS.md:100`
SPECULATIVE AUTHORING the builder may start immediately on a candidate branch
(`rebuild/slice-a4` or `rebuild/lane-c-a4`). Nothing merges before the look.
If the owner changes the design, the branch is rebased/adjusted to it — the
acceptance bar in §3 is the part that does not move.

Three defaults the design brief took (`BRIEF.md` §9). Each is a copy change,
not an architecture change, unless marked:

| # | default taken | if the owner reverses it |
|---|---|---|
| **Q1** | **RULED, not a default any more** (`DECISIONS:114` (2)): Earned PROPOSES a named standard start, 3 sets and a 10-rep target, pre-filled and changeable; "I'm not sure" is gone | Still open underneath it: whether the rep target should vary per exercise class, routed to lane B (REQUESTS 17:25 PM to B) with the engine evidence asked for. If lane B answers yes, the change is a SWITCH, not a redesign: the rep chip row moves from the shared block into the exercise row, `setup-model.cjs` stops broadcasting one `hi`, §2.8 gains one row per class with its source, and S5/S8 gain the per-class values. Screen 3's layout, copy frame and the "Earned proposes" principle are unchanged either way. If the owner reverses the ruling itself, revision 1's shape (unselected chips + "I'm not sure" as a named refusal) is recoverable from this file's git history |
| **Q2** | ship upper/lower only and SAY SO on screen 2, in the owner's own wording (`:114` (4)): "Earned plans two kinds of day so far: upper body and lower body." | a third day kind is an ENGINE change (`plan.cjs:16` returns only `U`/`L`/REST; `athlete-state.cjs:61`, `:88`, `:104` accept only those). It leaves the screens tier entirely and takes the full gate — A4 would ship as-is and the third kind becomes a Track B package |
| **Q3** | 5 is offered as a NAMED standard, visible before he leaves the field and repeated in the summary ("jump: 5 lb, Earned's standard step"), never pre-filled into the input. Sourced at last: `migrate.cjs:795` clamps any `inc` above 5 to 5, and the engine's own newborn lifts are minted with `inc: 5` (`:1651`, `:1653`). Revision 1 cited a ledger ruling that does not exist | delete the fallback; `inc` joins the named-refusal list (the flow already handles that shape); the S8 allowlist becomes EMPTY, which is a strictly stronger check |

A fourth thing the owner may reverse without touching the build: the brief
carries "**no starting load collected by design — the first session is the
probe**" (`BRIEF.md` §5; `athlete-state.cjs:111-113` has no member for one and
`today.cjs:80-90` is the probe). Reversing it is an engine change, not a screen.

---

## 6. Out of scope / handed on

- **The engine.** Nothing under `rebuild/engine`. If the build finds it needs
  an engine change, it STOPS and writes a REQUESTS line; that change takes the
  full gate (`DECISIONS:88`).
- **`e.setup`** — §2.7, PM QUESTION 1. A4 ships without it.
- **A settings screen** (change the split, add a lift, a future `split.from`,
  edit an exercise after the fact). First-run runs once; editing is a later
  screen with its own brief.
- **The port.** `rebuild/m3/setup/port/**` and C2b's phone-side import are S3
  and lane C's; first-run constructs an EMPTY state and never imports, merges
  or migrates (`athlete-state.cjs:6-8`).
- **Nutrition and recovery setup.** Approved separately; neither has a member
  in the clean-init contract. First-run collects zero food and zero sleep.
- **The coach.** Queued behind the slice (`DECISIONS:89`); first-run must not
  become its front door.
- **The PWA install flow** — A5, merged (`DECISIONS:101`). A4 renders inside
  that shell and adds nothing to it. The owner's `SLICE_NETLIFY_SITE_ID`
  secret is still outstanding, so no phone run of A4 is possible until then.
- **`rebuild.yml`** — §4.3, handed to lane B's B-NTC seal.
- **The `19` w7-preview child's retirement** — inside B-NTC (`DECISIONS:112`).
- **The A2/C4 residuals** (`WORKOUT_RESUME_STALE` retry; `readPrevious()`
  collapsing refused vs no-comparable): PM queue items behind A4, not A4's.
- **The dash sweep of the ALREADY-MERGED screens** (A1's "spike, damped in
  trend", the "not wired yet" labels, A3's copy). That is the PM's own P1 item,
  `rebuild/slice/P1-NO-DASHES-BRIEF.md`, on branch `rebuild/polish-p1`, with
  its own reviewer. A4 owns only its own screens' copy (S23) and must not churn
  P1's files. If P1 merges first, A4 rebases onto it and reuses its
  `test/copy.test.mjs` harness rather than writing a second one; if A4 merges
  first, P1 picks up A4's screens in its sweep. Whichever is second says so.
- **The per-exercise rep-target question** (`DECISIONS:114` (2), REQUESTS
  2026-09-11 17:25 PM to B). It is lane B's engine question. A4 ships ONE
  standard and §5 records the switch that a yes would flip.
