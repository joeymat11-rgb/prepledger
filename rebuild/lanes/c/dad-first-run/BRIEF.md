# DAD FIRST-RUN — DESIGN BRIEF (Lane C)

Status: DESIGN BRIEF + CLICKABLE MOCK. Docs and mock only. No product code,
no engine change, nothing hosted, nothing merged by this folder. The owner
approves this by looking at `dad-first-run-mock.html` on an iPhone.

Companion files: `dad-first-run-mock.html` (the clickable mock),
`HAND-TEST.md` (the 5-minute script), `REPORT.md` (hashes, sources, decisions).

All numbers in the mock and in every example below are FICTIONAL.

---

## 0. Purpose

Dad is beta tester #1: a beginner, handed an iPhone with no explanation. In
five minutes he must turn a blank app into a state the engine can plan from,
then land on Today and understand what happens tomorrow.

Since `rebuild/DECISIONS.md:100` ("start fresh at S2, then port"), first-run is
**also Joe's own path**: Joe starts Earned fresh at S2, and his history lands
underneath later at S3. So this flow has two users. Design for Dad first — if
the beginner finishes without being told anything, Joe will too.

The flow's single job is to produce the `setup` document that
`rebuild/m4/workout/athlete-state.cjs:129` `createCleanInitState({ setup })`
accepts, and nothing else. It is a **transcriber**, not a coach: every value it
writes is either the athlete's own stated fact or the empty value of that
member (`athlete-state.cjs:9-12`).

---

## 1. The contract first-run must satisfy

`createCleanInitState` is a **closed** contract. `closed()`
(`athlete-state.cjs:65-71`) rejects any object that has a key it did not ask
for and any object missing one it did. So first-run may collect these members
and **no others** — an extra field is not ignored, it throws.

`setup` — exactly four members (`athlete-state.cjs:59`)

| member | shape | required? |
|---|---|---|
| `athlete_label` | non-empty string | yes (`:132-133`) |
| `split` | `{ from, map }` | yes (`:76`) |
| `exercises` | non-empty array | yes (`:134-135`) |
| `priority_muscles` | array of non-empty strings, **may be empty** | array yes, contents no (`:136-138`) |

`split` — exactly two members (`athlete-state.cjs:76-93`)

| member | shape | notes |
|---|---|---|
| `from` | `YYYY-MM-DD` | must be **≤ today**, see §4 |
| `map` | one entry for each of `"0"`–`"6"` | each `"U"`, `"L"` or `"REST"`; at least one `U` or `L` (`:90-91`) |

`exercises[]` — exactly eight members (`athlete-state.cjs:60`, checked at `:96-113`)

| member | shape | what it is |
|---|---|---|
| `id` | non-empty string, unique | the engine's key for the lift |
| `n` | non-empty string | the name shown on the card |
| `mg` | non-empty string | muscle group |
| `day` | `"U"` or `"L"` | which session it belongs to |
| `sets` | positive integer | how many sets appear |
| `hi` | positive integer | top of the rep window |
| `inc` | finite number > 0 | the smallest jump this equipment makes |
| `steps` | non-empty ascending array of positive numbers | the loads this equipment can actually be set to |

The constructor then writes `w: null` and `forks: []` onto every exercise
(`:113`) and every history member empty (`:155-164`). **First-run cannot
collect a starting load** — see §5.

---

## 2. Every field collected, and where it lands

One row per thing the athlete is asked. "Blank" is what the flow does when the
answer is missing — never a value.

| # | screen | what he is asked | lands in | cited at | blank = |
|---|---|---|---|---|---|
| 1 | 1 Name | "What should we call you?" | `setup.athlete_label` | `athlete-state.cjs:132`, `:149` | refusal (required) |
| 2 | 2 Days | which weekdays he trains | keys of `setup.split.map` set to `U`/`L`; the rest `REST` | `athlete-state.cjs:79-92`; `plan.cjs:16` | refusal (needs ≥1 training day, `:90-91`) |
| 3 | 2 Days | upper or lower, per chosen day | the value at that weekday in `split.map` | `athlete-state.cjs:88` | refusal (a chosen day with no kind) |
| — | 2 Days | *not asked* — the week starts today | `setup.split.from` = today's ISO date | `athlete-state.cjs:77`; guard `workout-host.mjs:39-48` | n/a, see §4 |
| 4 | 3 Exercises | "How many sets of each exercise?" (one answer, all lifts) | `exercises[].sets` | `athlete-state.cjs:103` | refusal, see Q1 |
| 5 | 3 Exercises | "How many reps are you aiming to reach?" (one answer, all lifts) | `exercises[].hi` | `athlete-state.cjs:104` | refusal, see Q1 |
| 6 | 3 Exercises | the name of each exercise, per day | `exercises[].n`, and `exercises[].id` slugged from it | `athlete-state.cjs:98-101` | refusal (≥1 exercise, `:134-135`) |
| 7 | 3 Exercises | "what does it work?" per exercise | `exercises[].mg` | `athlete-state.cjs:98-99` | refusal |
| — | 3 Exercises | *not asked* — the day he added it under | `exercises[].day` | `athlete-state.cjs:102`, `:142-146` | n/a |
| 8 | 4 Loads | "lightest setting on this machine" | `exercises[].steps[0]` | `athlete-state.cjs:108-110` | refusal |
| 9 | 4 Loads | "smallest jump up" | `exercises[].inc` | `athlete-state.cjs:107` | 5 lb, **stated on screen**, see Q3 |
| 10 | 4 Loads | optional: "or list the whole stack" | `exercises[].steps` (≥2 rungs) | `athlete-state.cjs:108-110`; `progression.cjs:346-350` | one rung only, see §5 |
| 11 | 5 Priority | "anything you especially want to work on?" | `setup.priority_muscles` | `athlete-state.cjs:136-138`, `:153` | `[]` — genuinely skippable |
| — | — | *not asked* — the supervision floor | `plan.autonomy = "propose"` | `athlete-state.cjs:35-43`, `:161`; `constants.cjs:270` | n/a, written as the floor |

Nothing else exists to collect. Sleep, nutrition, bodyweight, goals, age, sex,
history: none of them are members of this contract, and the closed check
(`athlete-state.cjs:65-71`) throws if first-run sends them.

---

## 3. The screen flow — six screens

Six screens, one question each (screen 3 carries one question plus one shared
programme setting, declared as such on the screen). Visual language is the
approved design of record: paper `#F4F0E8`, ink `#1C1B18`, muted `#5A5348`,
line `#D8D0C2`, green `#2E5A3C`, ground `#E7E1D4`; Instrument Serif for
headings and numbers, Instrument Sans for body; the `.page` / `.mast` /
`.intro` / `.question` / `.options` / `.primary` / `.back` vocabulary — all
taken from `rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html:5`
and `:7`, which `rebuild/DECISIONS.md:88` pins as authoritative.

**Standing rules across all six**

- Back is on every screen but the first, top-left, and **never destroys an
  answer**. Coming back forward finds everything as it was.
- The primary action sits inside the first 844px with no scrolling.
- Every choice starts **unselected**. A selected choice can be tapped off.
  Blank means unknown; it never becomes a value (`ADDITIONS-C-APPROVED-HANDOFF.md:17-18`).
- No progress bar, no streak, no countdown, no "only 2 left!", no confetti.
  A quiet "2 of 6" in the masthead is the whole of the progress reporting
  (charter: no streaks, urgency, gamification or dark patterns).
- Nothing is mandatory-by-modal. Missing answers are collected and named once,
  on screen 6, with a tap back to the screen that owns each one.
- No number appears on any screen that the athlete did not type, except the
  date, the day names, the "2 of 6" counter, and the one declared standard in
  Q3 below.

### Screen 1 — Name

- **Question:** "What should we call you?"
- **Allowed answers:** any non-empty text. One 16px text input.
- **Copy:** h1 "Let's set up your week." · "Six short questions. Nothing here
  is a target or a promise — it's what your gym can do and when you can get
  there." · label "What should we call you?"
- **Blank:** allowed to leave; carried to screen 6 as a named missing answer.
- **Validation (only on leaving with something unusable):** "We need something
  to call you — a first name is fine."
- **Back / skip:** no back (first screen). "Skip" is not offered; Next with an
  empty field simply moves on and the omission is named at the end.

### Screen 2 — Training days

- **Question:** "Which days will you train, and what will you do?"
- **Allowed answers:** seven day toggles. A day that is on gets a two-choice
  control: **Upper body** / **Lower body**. Any day left off is `REST`.
- **Copy:** h1 "Which days?" · "Tap the days you'll be in the gym, then say
  what each one is. You can change this whenever your week changes." ·
  "Earned plans two kinds of session so far — upper body and lower body."
  (That last line is required honesty, not filler: see Q2.)
- **Blank:** no day on → named at the end as "we don't know which days you
  train". A day on with no kind → named as "Tuesday has no session kind yet".
- **Validation:** shown quietly under the day, in muted ink, only after he has
  tried to move on: "Tell us what Tuesday is — upper or lower."
- **What the engine does:** `dayType(iso, s)` (`plan.cjs:11-22`) takes the last
  `split` entry whose `from` ≤ the day and reads `map[weekday]`; `"U"` or
  `"L"` is the session, anything else is REST.
- **Blank consequence, stated plainly:** with no split at all the engine falls
  back to a Mon/Thu-upper, Tue/Fri-lower, Wednesday-refeed week
  (`plan.cjs:17-21`) — **that is one other athlete's week**, and it is exactly
  what this screen exists to prevent (`athlete-state.cjs:14-17`). So the split
  is required, not skippable, and the mock says so on screen 6 in plain words.

### Screen 3 — What you'll do

- **Question:** "What will you do on each day?" — a list per session kind, each
  row a name plus a "what does it work?" chip row.
- **Shared programme setting, declared:** above the lists, in its own bordered
  block labelled *"The same for every exercise"* — sets (choices 2 / 3 / 4)
  and target reps (choices 6 / 8 / 10 / 12), both unselected, plus an explicit
  **"I'm not sure"** on each.
- **Allowed answers:** exercise name is free text (it is his machine's label,
  not ours). `mg` from a chip row — chest, back, shoulders, arms, legs, glutes,
  core — or typed. Only the session kinds present in his split get a list.
- **Copy:** h1 "What you'll do." · "Name what you actually use. A machine's own
  label is a fine name." · "Don't add a weight yet — Earned asks for that at
  the gym, on the day." · sets block: "How many sets of each exercise?" /
  "How many reps are you aiming to reach before the weight goes up?"
- **"I'm not sure" semantics:** it is a **refusal marker, not a value**. It
  sets nothing, and screen 6 names it: "You told us you weren't sure how many
  sets to do. Earned won't pick that for you." (See Q1.)
- **Blank:** no exercise under a session kind that is in the split → named at
  the end; the constructor would throw `CLEAN_INIT_SPLIT_REQUIRED` "no U day
  in the split for a U exercise" for the mirror case (`athlete-state.cjs:143-144`),
  which the flow prevents by only offering the kinds his split contains.
- **What the engine does:** `sets` sizes the target array one entry per set;
  `hi` is the top of the rep window and `windowFor(ex)` derives the bottom from
  how big the next jump is (`progression.cjs:424-433`); `day` decides which
  card appears on which session via `exOrder` (`athlete-state.cjs:145-146`);
  `mg` is the muscle bucket the volume reader groups on.
- **Non-goal on this screen:** no recommended exercise list, no "most people
  do…", no auto-added lifts. An empty list stays empty.

### Screen 4 — What the weights do

This is the equipment-agnostic screen, and it is the reason the public app
cannot ship Joe's machines (`DECISIONS.md:88` re-pin; `DECISIONS.md:99`
condition C3 records `today.cjs:92`'s `e.id === "hack"` as an inherited
Joe-ism, register item H1 — first-run must not create another one).

- **Question:** "What can each of these be set to?" — one row per exercise,
  two 16px numeric inputs: **lightest setting** and **smallest jump up**.
- **Copy:** h1 "What the weights do." · "This is about the machine, not about
  you. Look at the stack or the plates and tell us what it can make." ·
  per row, muted: "e.g. the lightest pin, and how far apart the pins are."
- **Optional third answer:** a collapsed "My machine's jumps are uneven — let
  me list them" that reveals one text field taking a list of numbers
  (`progression.cjs:406-409` `parseRungs` is the engine's own parser for
  exactly this input, and takes any non-numeric separator).
- **Blank — lightest setting:** named at the end. Required: `steps` must be a
  non-empty ascending array (`athlete-state.cjs:108-110`).
- **Blank — smallest jump:** falls to **5**, and the screen says so in the
  field's own helper line before he leaves it: "Most stacks and racks move in
  5 lb steps — change it if yours doesn't." Not silent, not pre-filled into
  the box, and repeated in the screen-6 summary as "jump: 5 lb (our standard
  step)". This is the only number the flow is allowed to supply. See Q3.
- **What the engine does:** with two or more rungs, `loadRungs`
  (`progression.cjs:346-350`) builds the ladder and `nextLoad` / `prevLoad` /
  `snapLoad` / `deloadLoad` walk the real rungs (`:368-369`, `:380-381`,
  `:386-403`) — the athlete never gets prescribed a weight his machine cannot
  make. With one rung there is no ladder and the engine does `w ± inc`
  arithmetic instead (`:370`, `:382`). That is not a downgrade: `proposeLadder`
  (`:310-343`) watches the loads he actually uses and offers the real stack
  back to him once his own use shows the jumps are uneven. **The app discovers
  his equipment from use; the screen does not have to get it perfect.**

- **Validation:** "That doesn't look like a weight — numbers only." /
  "The jump needs to be more than nothing." / if the listed rungs are not
  ascending: "Put them smallest first and we'll take it from there."

### Screen 5 — What matters most to you

- **Question:** "Anything you especially want to work on?"
- **Allowed answers:** the same muscle chips as screen 3, any number, or none.
- **Copy:** h1 "Anything in particular?" · "Tap what you care about most. You
  can leave this empty." · and the honest line, in muted ink:
  **"We'll keep this with your plan. It doesn't change your sessions yet."**
- **Blank:** `priority_muscles: []`. This is the one genuinely skippable
  answer, and the only screen with a visible "Skip" (`athlete-state.cjs:136-138`
  accepts an empty array).
- **What the engine does:** it is carried verbatim onto the state
  (`athlete-state.cjs:150-153`) and **no engine reader on the session path
  consumes it** — the file says so in its own comment. So the screen promises
  nothing. An interface that said "we'll prioritise these" would be a lie the
  engine cannot make true.

### Screen 6 — What we'll do with this

Not a "Done!" screen. A statement of what Earned now knows, in his own words
and numbers, and an honest list of what it still doesn't.

- **Copy:** h1 "Here's your week." · then, as plain rows: each training day
  with its session kind and the exercises in it; each exercise with its
  lightest setting and its jump; "Sets: 3 · Reps: 10" if answered; priority
  muscles or "nothing named".
- **The load line, said once and plainly:** "We haven't put a weight on
  anything. On your first session Earned will ask you to pick a load you can
  control, and whatever that gives is where you start." That is the engine's
  own debut behaviour, not a UI flourish — see §5.

- **When something is missing — the named refusal.** The primary action is
  replaced by a quiet block headed "Earned can't build your week yet", listing
  exactly what is unknown, each line tappable back to its screen:
  - "We don't know what to call you." → screen 1
  - "We don't know which days you train." → screen 2
  - "Tuesday doesn't have a session kind yet." → screen 2
  - "Your upper-body day has no exercises in it." → screen 3
  - "You weren't sure how many sets to do. Earned won't pick that for you." → screen 3
  - "Chest press has no lightest setting yet." → screen 4
  Nothing is guessed to get past this, and nothing already answered is lost.
  The engine's own refusal codes behind these lines are
  `CLEAN_INIT_SETUP_REQUIRED`, `CLEAN_INIT_SPLIT_REQUIRED`,
  `CLEAN_INIT_EXERCISES_REQUIRED`, `CLEAN_INIT_EXERCISE_REQUIRED` and
  `CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED` (`athlete-state.cjs:62`, `:76`,
  `:96`, `:130-138`); every one needs a screen-level sentence (acceptance
  check A2).
- **When it is complete:** one primary, "Start using Earned", which writes the
  state once and lands on Today.

### After screen 6 — Today

He lands on the real Today page (`rebuild/m3/w7-preview/today/`, merged at
`DECISIONS.md:99`), whose structure is the approved design's Today: masthead,
plan-first instruction, "Eat about …", the session card, weight trend, one
primary action. On a state with no history this is mostly **honest empty
states** — the A1 page already renders those, and the entry points it has not
wired say "— not wired yet" in its own words (`today-app.cjs:59`, `:308`,
`:332-336`). The mock ends on a placeholder in that shape with that language,
so the owner sees the handover, not a fake dashboard.

---

## 4. `split.from` must be ≤ today

`createCleanInitState` has no clock (`athlete-state.cjs:19-26`), so it can
accept a well-formed split whose `from` is still in the future — and
`dayType` would then find no entry covering today and fall back to the
hardcoded week (`plan.cjs:15-21`). The guard that closes this lives at the
seam that has both the state and the day: `splitInForceOn` in
`rebuild/m3/w6/host/workout-host.mjs:39-42`, which refuses
`WORKOUT_SPLIT_NOT_IN_FORCE` ("no split entry has from <= <day>, so the engine
would fall back to a week this athlete never chose", `:43-48`).

**First-run's rule: `split.from` is today's local ISO date, and the flow never
offers a start date.** A "starts next Monday" option would produce a state that
passes the constructor and refuses at the first gym visit. If the owner later
wants a future start, it belongs to a second split entry added by a settings
screen, not to first-run.

---

## 5. No starting load is collected — on purpose

`rebuild/slice/PLAN-SLICE-v1.md:11` (item 6) asks for "starting loads by 'what
did you lift last time?' or a conservative first-session probe". That text
predates `athlete-state.cjs`, and the code of record has since decided it:
the constructor writes `w: null` on **every** exercise and has no member for a
starting load (`athlete-state.cjs:111-113`). Sending one throws.

The requirement is satisfied by the engine, not by a screen. `genSession`
takes the debut path whenever `e.w == null` (`today.cjs:80-90`):
`baselineAsk: true`, every target 0, and the note *"DEBUT — find the working
weight: pick a load you can control for about N reps, enter the load and log
what it gives. Zero expectations — everything banks."* The reason line is
"baseline ask — enter the load you used; what it gives today IS the line"
(`today.cjs:132`). **The first session IS the conservative probe.**

Design consequence: first-run asks nothing about strength, and is roughly two
minutes shorter for it. Screen 6 says this in one sentence so Dad is not
surprised at the gym.

---

## 6. Non-goals

Explicitly **not** in first-run, and not in this brief's mock:

- **No product code.** This folder ships a brief, a standalone mock and a test
  script. The build is a separate, later piece of work (Track A item A4).
- **No port of anyone's history.** Joe's blob is S3 and runs on his PC only
  (`PLAN-SLICE-v1.md:5`). First-run constructs an empty state; it never
  imports, merges or migrates (`athlete-state.cjs:6-8`).
- **No sync, no account, no cloud, nothing hosted.** No sign-in, no email, no
  device pairing, no second phone.
- **No coach.** The voice coach is queued behind the slice
  (`DECISIONS.md:89`); first-run must not become its front door.
- **No nutrition or recovery setup.** Those screens are approved separately
  (`ADDITIONS-C-APPROVED-HANDOFF.md:16-17`) and neither has a member in the
  clean-init contract. First-run collects zero food and zero sleep answers.
- **No bodyweight, no goal weight, no body-fat, no age, no sex.** Not in the
  contract, so not asked.
- **No starting loads** (§5), no 1RM test, no readiness questionnaire.
- **No recommended exercises, no template programmes, no "popular splits".**
  Equipment-agnostic means the app knows nothing about his gym until he says.
- **No PWA install flow** — that is A5.
- **No re-run overwriting an existing state.** If a state already exists on the
  device, first-run refuses and offers to open Today. Never delete athlete data.
- **No editing after the fact from inside this flow.** Changing a split or
  adding a lift later is a settings screen; first-run runs once.

---

## 7. Acceptance bar for the future build

Tier: **screens** — ONE independent executing reviewer (author ≠ reviewer) plus
CI green on both OS (`DECISIONS.md:88`, `:99`, `:100`). No receipts, no ledger
ceremony, no full engine gate — first-run adds no engine code. If a build finds
it needs an engine change, that change leaves this tier and takes the full gate.

The checks below are **executable**, and each one exists because it can fail
silently otherwise.

| id | check | how it fails today if unchecked |
|---|---|---|
| A1 | **Every field lands in clean-init exactly.** Drive the flow's reducer with a fixture of answers; deep-equal the produced `setup` against the expected document; call `createCleanInitState({setup})`; assert the returned state's `athlete_label`, `split.from`, `split.map`, every exercise's `id/n/mg/day/sets/hi/inc/steps`, and `priority_muscles` equal the answers exactly (numbers compared as numbers, `steps` element-wise). | a screen silently coerces "10" to 10.0, drops a rung, or reorders exercises |
| A2 | **Skipping everything yields a valid state or a NAMED refusal.** Submit an empty answer set: assert `createCleanInitState` is never called, that a refusal is rendered, and that it names each missing member. Separately, assert every code in `athlete-state.cjs` (`CLEAN_INIT_SETUP_REQUIRED`, `CLEAN_INIT_SPLIT_REQUIRED`, `CLEAN_INIT_EXERCISES_REQUIRED`, `CLEAN_INIT_EXERCISE_REQUIRED`, `CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED`) maps to a screen sentence — enumerate the codes from the module at test time so a new code fails the suite. | a blank field becomes a default, or the flow throws a raw code at Dad |
| A3 | **`split.from` ≤ today.** Assert `splitInForceOn(state, todayISO)` is true (`workout-host.mjs:39-42`) for a state built at 00:00:01 and at 23:59:59 local, in at least UTC, America/New_York and a UTC+13 zone; and assert `dayType(todayISO, state)` equals the kind he chose for today's weekday — never the fallback week. | a UTC date built on a phone at 8pm EDT lands tomorrow, and the first gym visit refuses |
| A4 | **No invented numbers on screen.** Render every screen in every state, scan the text content for digit runs, and assert each is (a) echoed from an answer, (b) a date / weekday / the "n of 6" counter, or (c) on a declared allowlist whose only entry is the 5 lb standard step with its source cited in the test. | a "typical 3 sets of 10" creeps into copy and reads as a prescription |
| A5 | **16px inputs.** Every `input`, `select` and `textarea` on every screen has a computed `font-size` ≥ 16px. | iOS zooms on focus and the page pans sideways mid-setup |
| A6 | **390×844.** Each screen in each state renders at 390px wide with `scrollWidth <= clientWidth` (no horizontal scroll), and again at 320px. | one long exercise name breaks the layout on the phone the test is run on |
| A7 | **Primary action in the first viewport.** For every screen and both empty and filled states, the primary button's top edge is < 844px with no scrolling — the same bar A1's Today had to clear (`DECISIONS.md:99`). | Dad cannot find "Next" and stops |
| A8 | **Nothing leaves the origin.** Build refuses any network reference; zero off-origin requests at runtime; typefaces inlined, as A1 did (`DECISIONS.md:99`). | a Google Fonts link makes setup depend on gym wifi |
| A9 | **Back never loses an answer.** Walk 1→6, back to 1, forward to 6; the answer set is byte-identical. Then change one answer on screen 2 and assert only that answer changed. | he corrects a typo and loses his exercise list |
| A10 | **Re-run refuses.** With a state already on the device, first-run does not construct a second one and does not overwrite; it offers Today. | a reinstall or a double-tap deletes a week of history |
| A11 | **No streaks, urgency or dark patterns.** Assert the rendered text of every screen contains no countdown, no "don't lose", no progress-percentage, and that every "skip"-like affordance is only on screen 5. | gamification arrives one small copy edit at a time |
| A12 | **The whole flow is completable in under 5 minutes by a first-time user**, measured by the hand test in `HAND-TEST.md`, not by a unit test. One human run recorded per build. | the suite is green and the beta tester still gives up |

Reviewer instruction: the reviewer is told to disagree, runs A1–A11 themselves,
and performs the hand test on a person who has not seen the app.

---

## 8. The 5-minute hand test

Full script in `HAND-TEST.md`. In short:

**Handed over:** an iPhone, unlocked, with the app already open on screen 1 and
nothing else on the display. A pen and the observation sheet for the observer.
Dad is told one sentence — *"This is the app. Have a go."* — and nothing more.
No demo, no "you'll want to tap there", no answering questions during the run.

**Pass** is all four of:
1. He reaches Today with a state Earned accepted, in **under 5 minutes**.
2. He asks **no** question that the observer has to answer for him to continue.
3. Every number on screen at the end is one he typed, a date, or the declared
   5 lb standard — nothing about his body that he did not say.
4. Asked afterwards "what happens tomorrow?", he can answer from the screen.

**Fail** is any of: he asks what a screen means and can't proceed without an
answer; he invents a number to get past a field; he reaches Today with a state
built on a guess; he times out; or he ends up somewhere he can't get back from.

A refusal at screen 6 is **not** a fail — reaching an honest "Earned can't
build your week yet" that names what's missing, and then fixing it, is the flow
working. The fail is a silent default.

---

## 9. Open questions for the owner

Three, each with a default this brief has already taken. Nothing here blocks
building the mock or reviewing it; all three block the **build's** copy.

**Q1 — Who states `sets` and `hi`?** They are required positive integers
(`athlete-state.cjs:103-104`), the engine has no default for them, and a
beginner has no basis for either. Three candidates: the athlete picks from
explained choices; the owner names a starting programme in a document the
screen quotes with attribution; or the coach sets them later and first-run
refuses without them.
*Default taken:* the athlete picks, from unselected, plainly-explained choices,
with "I'm not sure" as a refusal that the summary names — a screen never picks
for him. If the owner prefers a named starting programme, it is a one-line copy
change plus a cited source, and the "I'm not sure" branch points at it.

**Q2 — Only two session kinds exist.** `dayType` returns only `U`, `L` or REST
(`plan.cjs:16`), and clean-init accepts only those (`athlete-state.cjs:61`,
`:88`, `:102`). A full-body, push/pull/legs or bro-split athlete cannot be set
up truthfully; calling his full-body day "Upper" would be a lie in the data.
*Default taken:* ship S4 upper/lower only and **say so on screen 2** ("Earned
plans two kinds of session so far"). The alternative — a third day kind — is an
engine change and leaves the screens tier entirely.

**Q3 — May a screen supply the 5 lb step?** The ruling is "inc 5 default for
new lifts", and the charter is "blank = unknown, never a default value". These
pull against each other for exactly one field.
*Default taken:* 5 is offered as a **named standard, visible before he leaves
the field and repeated in the summary** ("jump: 5 lb — our standard step"), never
silently pre-filled into the input. It is the single entry on the A4 number
allowlist. If the owner would rather nothing be supplied, delete the fallback
and `inc` joins the named-refusal list — the flow already handles that shape.

**Not asked, recorded instead:** `genSession` passes an exercise's `setup`
member through to the card (`today.cjs:171`), but `setup` is not a member of
the clean-init exercise contract and the closed check rejects it
(`athlete-state.cjs:60`, `:65-71`). So a new athlete's cards carry no setup
note. That is a gap in the contract, not a first-run decision; logged for the
PM rather than worked around here.
