# NEXT.md — the work queue

**Read this file at the start of every session, before you touch anything else.**

This is the single source of truth for *what to build next*. The research/spec side
writes work into this file; the build side reads it and ships. Briefs are not pasted
into a chat window any more — work arrives here, in the repo, versioned.

## The loop

1. Research and specs get written into this file.
2. Joe says "go".
3. You read this file, work the item under **NOW**, and ship it.

## Session protocol

1. Read this file first. Then the `CLAUDE.md` reading order: `GOALS.md` →
   `research-brief.md` → `HANDOFF.md`.
2. If `NEXT.md` or `CLAUDE.md` are untracked or uncommitted when you start,
   **commit them before you begin work.** They are project state, not scratch.
3. Work **only** the item under **NOW**. Do not start a **QUEUED** item unless Joe
   says so — if NOW is finished and Joe is not around, promote the top of QUEUED,
   write a one-line note saying you did, and proceed.
4. When NOW ships, move it to **SHIPPED** with the date and the commit range, and
   promote the next item into NOW.
5. If an item is ambiguous, build the smallest honest version and write the open
   question into the item — do not guess and do not invent a number to fill a gap.
6. Never push straight to `main`. `main` deploys to Joe's phone.

## Overnight mode — working the queue unattended

Joe may say **"work the queue overnight"** (or similar). That instruction overrides the
"work only the item under NOW" rule in the session protocol above. When it is given:

**Work continuously. Do not stop to ask.** Finish NOW, move it to SHIPPED, promote the
next **overnight-safe** item, and keep going until the queue has no overnight-safe items
left. Do not end your turn to check in — a question asked at 3am is a stalled night.

**Every item gets its own branch off the branch its work belongs on**, and its own
commits. Never one giant branch.

### Hard rails — these do not bend, ever, unattended or not

1. **Never push to `main`. Never merge to `main`. Never deploy.** `main` goes straight to
   Joe's phone. Everything lands on a branch and waits for him.
2. **Never commit red.** Strict gate *and* render smoke green before every commit. If a
   change goes red and you cannot fix it in a few attempts, revert that item cleanly,
   write what went wrong into the item, and move to the next one. A reverted item is a
   fine outcome; a red commit is not.
3. **Never guess a product decision.** If an item needs a judgement only Joe can make,
   write the question into the item under a `#### Open question for Joe` heading and skip
   to the next item. Do not pick for him and do not build both.
4. **Never invent a number.** The engine-owns-numbers rule is not relaxed at night.
5. **Back up before touching athlete data.** Any repair to `ledger/state.json` gets a
   timestamped copy of the file first, and a feed line recording what changed and why.
6. **Do not touch anything marked `[needs Joe]`.** Not even to "get a head start".
7. **Do not touch the unpushed `feat/v6.2-autopilot-modes` branch** at `e01075c`, and do
   not consolidate clones.

### Leave a trail

Append a short **`## OVERNIGHT LOG`** section at the bottom of this file as you go — one
line per item: what you did, the branch, the commit range, gate result, and anything you
skipped and why. Joe reads this first thing. It is the deliverable as much as the code
is.

If you finish every overnight-safe item, stop and say so in the log. Do not start a
`[needs Joe]` item to fill time.

### What is safe to run unattended

Each QUEUED item is tagged. `[overnight-safe]` means the spec is complete, the change is
testable by the gate, and a wrong guess is cheap to revert. `[needs Joe]` means the item
needs a decision, a physical input, or eyes on a real device before it can be built —
building it unattended would produce work that has to be thrown away.

---

## Standing guardrails — every item answers to these

**Engine-owns-numbers.** The engine owns every computed number; the coach
*proposes* only. Never build a feature that invents a second rate, target, band or
probability. If a surface needs a number, it composes an existing selector — the UI
formats, it never computes.

**The charter.** No streaks, no urgency, no countdowns, no gamification, no dark
patterns. Honest labelling. **Show misses.** Three of Joe's rules, verbatim:
*"Proposals should never confuse me." "All approvals, once approved, must serve
their function." "Lab readouts always need up-to-date relevant info."*

**Science honesty.** TDEE is a drifting latent state — and it is TDEE-minus-logging-bias.
Personal fat-vs-lean partitioning is a **range** that needs repeated DEXA, not a point
estimate. Adaptation means observed TDEE drift below the twin's prediction, gated on
significance *and* persistence. **Diet breaks for a lean trained male are an adherence
tool, not a metabolic trick.** Forecasts fan with distance and **self-suppress on
ambiguous confidence** — an abstention gate is a feature, and routing around one is a
defect even when the number itself is correct.

**Data-safety.** Any feature that adds synced state must ship with keyed-union /
refuse-to-shrink merge hardening **and** an additive schema migration, in the same
change. Device-local UI state (`prep-ledger-ui`) is never conflated with the synced
store (`prep-ledger-v1`) — but note that *reusing* a device-local key while changing
its meaning is its own migration problem. See NOW · fix 3.

**Ops.** Never print or expose a credential. Never delete athlete data. Keep the
`/ledger` lockdown intact. iOS Safari is the real target and the test suite only runs
headless — walk the render-smoke states and eyeball on the phone before shipping.

---

## NOW  `[build it]`

### TRAIN + Gym Mode — the comprehensive redesign

**This spec is complete. The design calls have been made. Build it — do not open with
another proposal pass.** The research and the element-by-element inventory are both done
and are reproduced below so nothing has to be rediscovered. Where a decision was genuinely
Joe's, it is listed under *Open questions* at the end and must be written up, not guessed.

Line numbers are against `v7.6.0`. Verify each anchor before editing — this file's
editing hazard is anchors that match more than once.

---

#### 0 · The laws this answers to

- **Tier 0** — one answer, largest, first, the half-second read. **Tier 1** — glanceable,
  no tap. **Tier 2** — one tap down, behind a small number of fixed labelled doors that
  never rearrange and that remember their state.
- **Engine-owns-numbers.** The engine owns every computed number; the UI formats and
  never computes. No new rate, target, band, window or probability.
- **Charter.** No streaks, urgency, countdowns, gamification. Honest labelling.
  **Show misses.** "Proposals should never confuse me."
- **Nothing mutates itself.** Every engine suggestion flows through the approval inbox.
- **iOS Safari is the target.** The suite is headless; the phone is the truth.
- **Never push or merge to `main`.** Branch, gate, preview, wait for Joe.

---

#### 1 · The diagnosis, in one line

**TRAIN is a planning page that happens to contain a gym button. It should be a gym page
that happens to contain planning.**

`▶ GYM MODE` is already first, and Gym Mode's core loop is the best interaction in the
app — three taps from cold open to set 1, reps pre-filled with the engine's proposal so
**confirming costs zero taps and only a miss costs one**. That polarity is correct and
must survive verbatim. But below that button sit ~17 sections including two full essay
cards, a third copy of the queue, and a `PACE` control that asks Joe to declare something
Gym Mode already measures — rendered on the screen a person reads standing at a rack.

Gym Mode itself is incomplete in ways that force him *out* of it mid-session, and it
captures its most important measurement at the least accurate possible moment.

---

#### 2 · What the evidence licenses — and forbids

**Proximity to failure matters for hypertrophy, and only for hypertrophy.** The 2024
meta-regressions found estimated RIR had a **negligible** relationship with strength gain
(marginal-slope CIs contained null) but a **meaningful negative** relationship with
hypertrophy (CIs excluded null) — closer to failure, more growth. Optimal proximity
differs between the two outcomes. The authors state model fit was modest and the work
exploratory. [1]
→ Joe's north star is visual body-composition change, so RIR is a first-class signal
here. **But no copy may imply RIR drives strength progression, and none may overstate the
certainty.**

**Self-reported RIR carries a large, directional, timing-dependent error.** Lifters
systematically **underpredict** — mean ~0.95 reps, studies spanning 0.65–1.2. Training
experience barely helps. Accuracy is dominated by *when* you ask: error falls from
**4.8 reps at 33% of a set to 1.2 reps at 90%**, and from 1.2 reps at 5 RIR to **0.46 at
1 RIR**. Better in sets of ≤12 reps. [2]
→ **This is the central design consequence.** The app currently asks for both RIRs at the
`lift-done` screen — after every set of the lift is finished, from memory. That is the
worst available moment, and it gives the opener equal visual weight to the last set.

**Autoregulation is not a win to be claimed.** Autoregulated and standardized load
prescription produced **similar** strength gains (MD 2.07 kg, 95% CI −0.32 to 4.46,
p = 0.09; SMD 0.21). Subjective/RPE-based trended slightly better (SMD 0.30, p = 0.06);
velocity-based near-null (SMD 0.10). Volume autoregulation showed a real
**strength–hypertrophy trade-off**: lower velocity-loss thresholds favoured strength
(SMD 0.23), higher (>20–25%) favoured hypertrophy (SMD 0.34). All studies carried some
risk of bias. [3]
→ Honest framing is *"comparable to a fixed plan, possibly slightly better when driven by
your own perceived effort."* **Never "superior".**

**What the evidence does NOT license:** silently correcting Joe's RIR for the ~1-rep
population bias. That bias is population-level; his personal bias is unmeasured. Applying
it invisibly would be the app inventing a number. See *Open questions*.

---

#### 3 · The build

##### 3.1 — Gym Mode: complete it, so leaving is never necessary

**Preserve verbatim:** reps defaulting to `getR(ex)`/`ex.tgt`; the auto-advancing,
vibrating rest timer; `restFor`'s per-exercise, per-set-position prescription with the
button naming the number before it starts it (`SET DONE → REST 150s`); measured,
**n-gated** pace (under three rests it stays `null` rather than guessing); the 3-tap cold
path.

**Fix — the lift screen (`phase === "lift"`, ~12252):**
1. **`ex.cue` is dead** (~12256). `genSession` returns `setup` / `live` / `note`, never
   `cue`, so setup cues, the live cue and the DEBUT/OWN-IT/RECLAIM note are unreachable in
   the mode Joe actually uses. Render `ex.live` as the cue line; put `ex.setup` behind a
   small disclosure; render `ex.note` when present.
2. **Add the previous-session line.** `ex.prev` (`e.lastMeta`) already carries
   `date · w × reps · RIR`. It renders on TRAIN and not here.
3. **Add the next-weight line — Tier 1, and this is the highest-value addition on the
   page.** `nextLoad(ex)` exists on every card and renders nowhere.
   `sessionDebrief` (~3989) already composes *"N more reps above that and {upW} queues
   itself — about {n} more sessions"* — the single most useful sentence in the training
   engine — and it lives two taps down inside FULL DEBRIEF, on the **receipt**, only after
   the session is logged. Surface it while he is under the bar. **Compose the existing
   selectors; invent nothing.** Respect `nextLoad`'s `null` at the top of a stack — "the
   top of the stack is real" — and say so honestly rather than hiding the line.
4. **Weight adjustment in-mode.** Changing a weight currently costs `exit ✕` → scroll →
   `✎` → step → `Save` → re-enter (6+ taps), and `Save` sets `ex.last = null`, discarding
   the rep history the next target is built from. Put a compact rung stepper on the lift
   screen. **Do not null `ex.last` for an in-session adjustment** — that is a different
   event from a deliberate reconfiguration.
5. **Undo the last set.** One mis-tap on `SET DONE` currently has no recovery path at all.
   Add a back affordance that decrements `setN` and restores the previous rep value.
6. **Rest controls:** `+30s` and `start rest now` (for a set banked late). Keep
   `Skip rest`.

**Fix — RIR capture (the research-driven change):**
7. **Move last-set RIR to the moment the last set is banked** — on the rest screen that
   follows the final set, or as a one-tap interstitial before `lift-done`. That moves the
   estimate from ~1.2 reps of error to ~0.46. [2]
8. **Remove the first-set RIR prompt from the default flow.** Keep the field and let it be
   entered from the lift detail on TRAIN if he ever wants it. Rationale, all three
   converging: the engine's own comment (~770) says the opener is a weak signal; every
   opener in his log reads 1–2, so it carries almost no variance; and it is measured at
   the point where error is largest [2]. This removes ~15 taps a week.
9. **Do not widen the RIR scale.** `0 / 1 / 2 / 3+` is correct — accuracy collapses above
   ~3 RIR, so finer buckets there would be false precision. [2]

**Fix — the end of a session:**
10. **Stop discarding the recap.** `finish()` (~12208) throws away `lines` from
    `completeSession`, so the WHAT MOVED sheet never fires from the path Joe uses. Show it.
11. **Stop hardcoding `note: "gym mode"` and `niggles: []`.** The note overwrites the
    session note field and then prints in the receipt and the debrief; the empty niggles
    array makes the joint check unreachable from Gym Mode entirely. Offer both at
    `all-done`, pre-filled empty.
12. **`all-done`'s summary list** joins with `\n` inside a `<div>`, so it renders as one
    run-on line. Make it a list.

##### 3.2 — TRAIN: a roster, not a wall

**Tier 0** — unchanged in spirit, three states:
- no session and none logged → the rest-day line (`nextTrainingISO`), already correct;
- session available → `▶ GYM MODE`, full width, first, largest;
- session logged → the receipt.

**Tier 1** — in this order:
1. **Today's one change** (`sess.structural`). Keep it; **demote its type size.** It is
   currently the largest type on the page (`<H size={22}>`), which makes it a false
   Tier 0 competing with the gym button. It is a label, not the hero.
2. **The lift roster.** Replace the stack of N fully-expanded per-exercise cards with a
   compact row per lift: name · load · target · verdict chip (`liftCall`'s
   `CHASE / REPEAT / LIGHTEN / CLIMB BACK / REST TODAY` with its `▲▼▶` velocity). Tapping
   a row opens that lift's detail in the SETUP door and scrolls to it — reuse the
   `openGroup` + `scrollToId` pattern and the `NOW_DOORS`-style live-registry invariant
   from the NOW work, including the render-smoke `declared ⊆ registered` check.
3. **Exception caveats only** — short-night, stim check, body alarm. Not resident prose.

**Tier 2 — exactly three doors**, fixed, labelled, time-aware `defaultOpen`, persisted
collapse state, never self-rearranging:
- **SETUP** — per-lift detail: weight/rung editor, jump size, reorder, skip, setup+cues,
  prev, the verdict explainer with its `why` + receipts + charter.
- **THE READ** — exercise selection audit, set allocation, muscle volume, session debrief,
  ask.
- **THE RECORD** — the archive, past receipts, week in review.

**Deduplicate — three real conflicts:**
- **Two different weekly set-counts on one page.** `muscleVolume` counts *logged* sets over
  7 days; `programmeVolume` (via `volumeImbalance`) counts *designed* sets per week. Same
  units, same muscle names, different answers, no cross-reference. Pick one owner, label
  what it counts, and have the other reference it rather than restate it.
- **The queue renders three times** — NOW's CLOSEST UNLOCKS, the QUEUE tab, and TRAIN's
  `<More forYou>`. TRAIN's copy goes.
- **`PACE` has two owners.** TRAIN asks Joe to declare RUSHED/FULL REST after the fact
  (~11136); Gym Mode measures it. Gym Mode wins. Keep the manual control only on the
  manual-logging path, and label it as a fallback.

**Delete:** the two dead RECEIPT chips (~10816, ~10821) — both styled as buttons, neither
has a handler.

**Performance — do this before adding anything.** `genSession` rebuilds the entire session
and `liftCall` traverses `sessionLog × exercises` on **every render**, including every
keystroke in the notes textarea and every stepper tap — three independent traversals per
render. Memoise first.

##### 3.3 — The ladder: make the load machinery real

This is the largest unrealised win in the app, and it is what Joe asked for when he said
machines have uneven jumps and he wants the actual available weights per exercise.

`loadRungs`, `nextLoad`, `prevLoad`, `snapLoad` and `deloadLoad` are complete and correct
— `deloadLoad` (~915) even refuses to invent a weight, picking the nearest strictly-lighter
*real* rung specifically to avoid an 11% cliff on a coarse stack. **And not one exercise
has a `steps` array. All fifteen run on even increments.** Excellent machinery with
nothing to work on.

The only way to populate a ladder today is a free-text `<textarea>` (~11014, *"EVERY
WEIGHT THIS MACHINE CAN ACTUALLY MAKE"*), reached in five taps, typed from memory at the
machine — and the adjacent `jump: 2.5/5/10` chips **delete `ex.steps`** as a side effect
(~11000), with no confirm.

**Build:**
1. **`proposeLadder(s, exId)`** — a pure engine selector that infers candidate rungs from
   the distinct logged weights for that exercise plus its authored `inc`, and returns
   `null` when there is not enough evidence. In the `__test` export, with assertions.
2. **Propose, never apply.** Ladder suggestions flow through the existing approval inbox
   like every other engine suggestion. Uses `s.proposals` — **no new collection, no schema
   bump.** If you find you need one, stop and flag it rather than inventing a migration.
3. **Replace the textarea with a picker** — add/remove rungs as discrete controls.
4. **The `jump:` chips must stop silently destroying a hand-entered ladder.** Confirm, or
   don't clear `steps` at all.
5. **Fix `set weight ✎` defaulting `wVal` to 180** for non-numeric weights (~11033) — tap
   it on the hanging raise (`"BW"`) and it proposes 180 lb.

##### 3.4 — `windowFor`: wire it in, or stop claiming it

`windowFor` (~991) derives the honest rep-window bottom from `repsLostOnJump` (~980) —
the relationship `reps lost ≈ (hi + 30) × step / (load + step)`. Its `lo` is consumed
**only** by `coarseLifts` (~1003), which is consumed **only** by a LAB proposal.
`atTopOfWindow` (~1010) and `targetsFor` (~869) both still use the raw authored `ex.hi`
and a fixed `hi − i` staircase.

Consequence: the rear-delt fly (2.5 lb on 20 = 12.5%, ≈4.7 reps lost) and the pronated EZ
curl (5 lb on 40 = 12.5%) top out, jump, land below any window the progression code knows
about, and have **no rule to climb back**.

**This is the riskiest change in the spec — it alters progression behaviour. Its own
commit, its own gate run, assertions covering rear-delt and pronated specifically.** If it
cannot be made safe in this pass, then **correct the LAB proposal's sentence instead** —
it currently tells Joe the window *"has already"* been widened, which is false, and an
honest-labelling app cannot claim a thing it has not done. One or the other. Not neither.

##### 3.5 — Explicitly out of scope

- **Q2·F, the three non-numeric lifts** (`hack "hold"`, `hanging "BW"`, `curl "55·55·50"`
  storing `w: null` and dropping out of `progressAnchor` and `typicalError`). Data-model
  change plus a representation decision. It is already an open question tagged
  `[needs Joe]`. **Do not build it here.**
- Any RIR bias correction. See *Open questions*.
- Anything requiring a schema bump.

---

#### 4 · Acceptance criteria

- **No new numbers.** The next-weight line composes `nextLoad` / `sessionDebrief`; ladder
  proposals compose `loadRungs` / `snapLoad`; every displayed figure traces to an existing
  selector. Assert no new rate, band or window entered the UI.
- **No schema bump, no new synced collection, no migration.** If the work seems to need
  one, stop and write it up.
- **Tap-count regression assertions:** cold open → set 1 recorded stays at **three taps**;
  a set matching the proposal still costs **zero** extra taps; removing the opener-RIR
  prompt reduces per-lift taps by exactly one.
- **RIR timing assertion:** last-set RIR is captured at the last set, not at `lift-done`.
- **Every write path preserved** — `saveDaily`, `fixWindow`, sodium/alcohol, caffeine,
  meds, pulse/temp, waist, photos, `dayCtx`, amend-yesterday, sleep/weight, `closeEvent`,
  the proposal stager. Before/after census; anything removed and not re-added is a defect.
- **No phantom-rep path can reappear.** Assert no `finish()` or `complete()` path emits an
  entry for a lift not performed — including from the new undo and in-mode weight edit.
- **Deep links:** every roster row's `{key, id}` resolves to a door that exists and an
  element that mounts, proven against the **live** registry in render smoke, not against a
  parallel constant.
- **Copy:** every RIR/proximity claim traces to [1]/[2] and states its uncertainty. No copy
  claims autoregulation is superior to a fixed plan. No streaks, countdowns or urgency.
- Strict gate **and** render smoke green before every commit. Never commit red.

#### 5 · Sequencing

**BUILD STATUS 2026-08-04** — branch `feat/train-gym-redesign`, one commit per move, strict
gate + render smoke green at every commit:

- ✅ memoise — `2b0…` genSession + liftCall once per state, not per keystroke
- ✅ delete/dedupe — dead RECEIPT chips, TRAIN’s third queue copy, PACE single-owner
- ✅ Gym Mode completeness — cues, note, setup, prev, next rung, undo set, rest controls,
  all-done list, the recap that was being discarded, note + niggles no longer hardcoded
- ✅ RIR timing — last set asked AT the set; opener out of the default flow
- ⬜ TRAIN roster + three doors — NOT STARTED
- ⬜ ladder inference (`proposeLadder`) — NOT STARTED
- ✅ §3.4 — satisfied by the FALLBACK, which shipped in v7.6.0: the LAB proposal no longer
  claims the window “has already” been widened. Wiring `windowFor` into progression remains
  available and is still the riskiest change in the spec.

One commit per numbered move, gate green each time, so any single move is revertable.
Suggested order — cheapest and safest first, riskiest last:
memoise → delete/dedupe → Gym Mode completeness (cues, prev, next-weight, undo, rest
controls, in-mode weight) → RIR timing → TRAIN roster + three doors → ladder inference →
`windowFor` (or the honesty correction).

Then: push the branch, produce a **preview Joe can open on his phone**, and report what to
tap. **Do not merge to `main`.**

#### 6 · Open questions — write these up, do not guess

1. **RIR bias correction.** Population data says self-reported RIR runs ~1 rep
   conservative [2]. Joe's personal bias is unmeasured. Applying a hidden correction would
   be the app inventing a number; ignoring it entirely leaves a known systematic error in
   the input to `progressStep`. Options: leave it and cite the bias in the research brief;
   surface it as an honest note; or measure his personal bias over time from
   RIR-vs-actual-next-session data and treat it as an n-of-1 range. **Recommend the third
   eventually, the first now.** Write it up; do not build it.
2. **The lift roster's opened-state memory.** NOW's rule is "collapsed stays collapsed".
   Should a roster row Joe opened stay open next session, or reset daily? Both are
   defensible; the rooms-don't-rearrange citation argues for persistence.


#### Open question for Joe — §6.1, RIR bias correction  `[needs Joe]`

**Written up, not built.** Population data puts self-reported RIR ~1 rep conservative
(mean ~0.95, studies 0.65–1.2) [2]. Joe's personal bias is **unmeasured**.

- **Leave it, cite the bias.** Honest, costs nothing, leaves a known systematic error in the
  input to `progressStep`.
- **Surface it as a note.** He sees the bias exists and can discount it himself. No number
  changes; the app claims nothing about him it cannot support.
- **Measure his own bias over time** from RIR-vs-actual-next-session data and treat it as an
  n-of-1 **range**, never a point estimate — the same shape `partitionPrior` already uses.

**Recommend the third eventually, the first now.** Applying the population figure invisibly
would be the app inventing a number about Joe from data that is not about Joe — the exact
thing engine-owns-numbers exists to prevent, and it would silently move what he lifts.

#### Open question for Joe — §6.2, roster row memory  `[needs Joe]`

Should a lift row he opened stay open next session, or reset daily? NOW's rule is
"collapsed stays collapsed", and the Findlater & McGrenere citation already in the source
(a self-rearranging interface measured ~8% slower) argues for persistence. But a roster row
is a *transient* interest — the lift he was checking today is not necessarily tomorrow's —
so daily reset is also defensible in a way a door is not.

Both are one line. Not guessed.


**Sources**
[1] Refalo et al., *Exploring the Dose–Response Relationship Between Estimated Resistance
Training Proximity to Failure, Strength Gain, and Muscle Hypertrophy: A Series of
Meta-Regressions*, Sports Medicine (2024) —
https://link.springer.com/article/10.1007/s40279-024-02069-2
[2] RIR-estimation accuracy synthesis (Halperin et al. and successors) —
https://www.strongerbyscience.com/reps-in-reserve/ ·
https://www.ovid.com/jnls/nsca-jscr/fulltext/10.1519/jsc.0000000000002995
[3] *The Effect of Load and Volume Autoregulation on Muscular Strength and Hypertrophy: A
Systematic Review and Meta-Analysis*, Sports Medicine – Open (2021) —
https://link.springer.com/article/10.1186/s40798-021-00404-9


## QUEUED

### 1. In-progress session survivability — LEASE, not a merge  `[needs Joe]`

**Downgraded 2026-08-04.** The spec line "phone dies at lift 6 and the session is gone" was
wrong: localStorage survives a dead battery, an app restart and a reboot, so the draft is
lost only if the device is wiped or replaced. That exposure **does not justify `SCHEMA_V`
39**, and nothing is being built for it now.

The answer is recorded so the item is not open-ended if it is ever picked up: **an open gym
draft is a LEASE, not a mergeable collection.** Stamp it with a device id and a started-at.
It may be replaced only by a draft from the *same* device, or by a completed session. **A
stale device NEVER overwrites a live one — there is exactly one phone in the gym.** Nothing
here merges; it is claimed or released.

### 2. Event protocol readability (round-3 I4) — option (c)  `[needs Joe]`

Move the event reference material into a door (THE BRIEFING); keep the fold card gated to
the actionable window. This does **not** re-open round-2 G1 — the fold card stays windowed,
only the reference material moves. Decided; recorded so nobody relitigates it.

**Queued behind the iOS walk of THE BRIEFING itself.** It is a v7.5 construct and the door
layout has now been walked once, but the event-detail placement inside it has not — do not
build it blind.

### 3. The three non-numeric lifts (Q2·F)  `[needs Joe]`

`hack` (`"hold"`), `hanging` (`"BW"`) and `curl` (`"55·55·50"`) store `w: null`, so
`progressAnchor` never anchors them and `typicalError` skips them — three of fifteen lifts
sit outside the progression engine. Representation options: a per-set load array
(`"55·55·50"` → `[55,55,50]`); a bodyweight flag with optional added load; and whatever
`"hold"` actually is for the hack squat, which Joe does not think is a load at all.

**Data-model change — needs merge hardening and a migration, so it is not overnight work.**


### 4. TRAIN + Gym Mode redesign `[needs Joe]` — he should see the shape before it is built

**The diagnosis in one line: TRAIN is a planning page that happens to contain a gym
button; it should be a gym page that happens to contain planning.**

`▶ GYM MODE` is already the first element and Gym Mode's core loop is the best
interaction in the app — three taps from cold open to set 1, reps pre-filled with the
engine's proposal so *confirming costs zero taps and only a miss costs one*. That
polarity is correct and must survive verbatim. But below that button sit ~17 sections
including two full essay cards (`EXERCISE SELECTION`, `YOUR SET ALLOCATION`), a second
copy of the queue already shown on NOW, and a `PACE` control that asks him to declare
something Gym Mode already measures. That is a reading page, rendered where a person is
standing at a rack with a phone in one hand.

#### What the evidence supports (and what it doesn't)

**Proximity to failure matters for the outcome Joe actually wants, and only that one.**
The 2024 meta-regressions found estimated RIR had a **negligible** relationship with
strength gain — the confidence intervals on the marginal slopes contained null — but a
**meaningful negative** relationship with hypertrophy, with CIs excluding null: sets
taken closer to failure grew more muscle. Optimal proximity differs between the two
outcomes. The authors are explicit that model fit was modest and the work exploratory. [1]
*Implication:* since the north star is visual body-composition change, RIR is a
first-class signal here — but the app must not present it as driving *strength*
progression, and must not overstate the certainty.

**Self-reported RIR carries a known, sizeable, directional error.** Lifters
systematically **underpredict** — mean underestimation ~0.95 reps across the literature,
individual studies 0.65–1.2. Training experience barely helps. Crucially, accuracy is a
strong function of *when* you ask: error falls from **4.8 reps at 33% of a set to 1.2
reps at 90%**, and from 1.2 reps at 5 RIR to **0.46 at 1 RIR**. Accuracy is better in
sets of ≤12 reps. [2]
*Implication, and it is the central design consequence:* **the app currently asks for
both RIRs at `lift-done` — after every set of the lift is finished, from memory.** That
is the least accurate possible moment. It also gives the opener equal visual weight to
the last set, when the engine's own comment (`:770`) already says the opener is weak and
every opener on file reads 1–2. The research says the opener is not just weak, it is
measured at the point where error is largest.

**Autoregulation is not a magic win, and the app should not claim it is.** The 2021
systematic review found autoregulated and standardized load prescription produced
**similar** strength gains (MD 2.07 kg, 95% CI −0.32 to 4.46, p = 0.09; SMD 0.21).
Subjective/RPE-based autoregulation trended slightly better (SMD 0.30, p = 0.06);
velocity-based was near-null (SMD 0.10). Volume autoregulation showed a genuine
**strength–hypertrophy trade-off**: lower velocity-loss thresholds favoured strength
(SMD 0.23), higher thresholds (>20–25%) favoured hypertrophy (SMD 0.34). All studies
carried some risk of bias. [3]
*Implication:* the honest framing for any autoregulation copy is *"comparable to a fixed
plan, possibly slightly better when it's driven by your own perceived effort"* — never
"superior". And the hypertrophy-favouring direction is *more* accumulated fatigue per
set, which agrees with [1].

#### The redesign

**Tier 0 — the set in front of you.** Unchanged in spirit: lift name, load, set n of N,
the big rep number, `SET DONE → REST 150s`. Nothing else competes.

**Tier 1 — three things that are currently missing or buried:**

1. **The next weight, on the lift screen.** `nextLoad(ex)` exists on every card and is
   rendered nowhere. `sessionDebrief` already composes the single most useful sentence
   in the training engine — *"N more reps above that and {upW} queues itself — about {n}
   more sessions"* (`:3989`) — and it lives two taps down, inside FULL DEBRIEF, on the
   *receipt*, only after the session is logged. Surface it while he is under the bar. No
   new number; compose the existing selector.
2. **The cues.** `ex.setup` / `ex.live` / the DEBUT-OWN-IT-RECLAIM note all exist in
   `sess.ex` and none reach Gym Mode. `NOW ▸ {ex.live}` belongs on the lift screen.
3. **Last-set RIR, captured at the last set.** See below.

**Tier 2 — one tap down, and far fewer doors.** The two essay cards, the selection audit,
the set-allocation card, the archive, the debrief: all correct content, all wrong place.
They belong behind labelled doors that don't rearrange, in the same shape NOW now uses.

**The RIR change — the evidence-driven part:**

- Ask for **last-set RIR immediately after the last set**, on the rest screen or as the
  set is banked — not at `lift-done` from memory. That moves the estimate from the
  worst-accuracy moment to the best (0.46 vs 1.2 reps of error). [2]
- **Demote the opener.** Make it optional and visually subordinate, or drop it. It is the
  measurement taken where error is largest, the engine already treats it as weak, and it
  costs a tap on every lift, every session.
- **Model the ~1-rep underprediction explicitly, and label it.** The bias is directional
  and well documented, so the engine can carry it — but the app's own rule is that a
  number without provenance is a claim. If a corrected RIR is used, say so.
- Do **not** widen the RIR scale. `0/1/2/3+` is right: accuracy collapses above ~3 RIR,
  so finer buckets up there would be false precision.

**The ladder problem — the biggest unrealised win on this page.** `loadRungs`,
`nextLoad`, `prevLoad`, `snapLoad` and `deloadLoad` are complete, correct, and
*completely unpopulated*: **no exercise ships with a `steps` array; all fifteen run on
even increments.** `deloadLoad` (`:915`) even refuses to invent a weight and picks the
nearest strictly-lighter rung specifically to avoid an 11% cliff on a coarse stack — an
excellent piece of engineering with nothing to work on. The only way to populate a
ladder is a free-text `<textarea>` reached in five taps, typed from memory at the
machine, which a mis-tap on an adjacent chip then silently deletes.
*Build:* infer candidate ladders from the logged weight history per exercise, propose
them through the existing approval inbox (never self-apply), and make the editor a
picker rather than a paragraph. This is the change that makes the rest of the load
machinery real — and it is what Joe already asked for when he said machines have uneven
jumps and he wants the actual available weights per exercise.

**Deduplicate.** Two different weekly set-counts appear on one page with the same units
and different answers — `muscleVolume` counts *logged* sets over 7 days, `programmeVolume`
counts *designed* sets per week, with no cross-reference. The queue renders in three
places (NOW's CLOSEST UNLOCKS, the QUEUE tab, TRAIN's `More` panel). `PACE` is asked on
TRAIN and measured in Gym Mode. Pick one owner for each.

**Performance.** `genSession` rebuilds the whole session and `liftCall` traverses
`sessionLog × exercises` on every render — including every keystroke in the notes
textarea and every stepper tap, three independent traversals per render. Memoise before
adding anything.

#### Preserve — do not "improve" these

Reps defaulting to the engine's proposal. The auto-advancing, vibrating rest timer (no
tap between sets). Pace measured rather than asked, and **n-gated** — under three rests
it stays `null` instead of guessing. Rest prescribed per exercise *and* per set position,
with the button naming the number before it starts it. Structured skipping — struck-through
rows, "skipped — on record". One structural change per session. The verdict chip as a
door (`CHASE ▾`) into `why` + receipts. `RESET` never self-applying — it files an
`agentProposal` and waits. And the deliberate absence of streaks and countdowns, which
the source shows was removed on purpose in at least three places.

#### Acceptance criteria

- No new numbers: the next-weight line composes `nextLoad` / `sessionDebrief`; the
  ladder proposals compose `loadRungs` / `snapLoad`; RIR correction, if built, is an
  engine selector in the `__test` export with assertions, not UI arithmetic.
- Ladder inference **proposes** and never self-applies — it flows through the approval
  inbox like every other engine suggestion.
- Any new synced state ships with keyed-union / never-shrink merge hardening and an
  additive migration in the same commit (`exOrder` included — see item 1E).
- Tap-count regression test: cold open → set 1 recorded stays at **three taps**, and a
  set matching the proposal still costs zero extra taps.
- Every RIR/proximity claim in copy traces to [1]/[2] and states its uncertainty; no copy
  claims autoregulation is superior to a fixed plan.
- Gate + render smoke green; walked on iOS Safari, in a gym, before merge.

**Sources**
[1] Refalo et al., *Exploring the Dose–Response Relationship Between Estimated Resistance
Training Proximity to Failure, Strength Gain, and Muscle Hypertrophy: A Series of
Meta-Regressions*, Sports Medicine (2024) —
https://link.springer.com/article/10.1007/s40279-024-02069-2
[2] Synthesis of RIR-estimation accuracy (Halperin et al. and successors; mean
underprediction ~0.95 reps; error 4.8 → 1.2 reps across a set; 1.2 → 0.46 reps from 5 RIR
to 1 RIR) — https://www.strongerbyscience.com/reps-in-reserve/ and
https://www.ovid.com/jnls/nsca-jscr/fulltext/10.1519/jsc.0000000000002995
[3] *The Effect of Load and Volume Autoregulation on Muscular Strength and Hypertrophy: A
Systematic Review and Meta-Analysis*, Sports Medicine – Open (2021) —
https://link.springer.com/article/10.1186/s40798-021-00404-9


### 5. DEXA body-fat anchor `[needs Joe]` — no scan exists yet, and it adds synced state

**Read this before building it: the queue stub was wrong.** It claimed a DEXA
"collapses several ranges (e.g. protein 160–190 g → one number)." It does not, and
building that would put a false precision on the face of the app. What a DEXA actually
buys is smaller, and the honest version is still worth having.

#### What the evidence says

**A DEXA's noise floor is large.** In 32 resistance-trained males, DXA's least
significant change (95% CI) was **1,943 g for fat mass** and **1,894 g for fat-free
mass** on consecutive days — ~4.3 lb and ~4.2 lb. Same-day repositioning only gets you
to **1,448 g / 1,450 g** (~3.2 lb). Precision error was RMS-SD 702 g / 684 g
consecutive-day vs 523 g / 524 g same-day; DXA was the best of the four methods tested,
so this is the good case, not the bad one. [1]

**DXA lean mass moves for reasons that are not muscle.** In 18 trained males, glycogen
loading alone raised total DXA lean mass **3.0% ± 0.7%** with minimal change in muscle
protein; glycogen depletion dropped leg lean mass **1.4% ± 1.6%**; total body water
moved 2.3%. The authors' own conclusion: changes in muscle metabolites and water alter
DXA lean-mass estimates during periods when real protein change is unlikely. [2]
On ~63 kg FFM that is 1.3–1.9 kg of pure artefact — the same size as the entire LSC.

**Protocol is load-bearing.** Non-standardized scans roughly **doubled** the SD of
change scores for total and fat-free soft tissue (2–3% vs 1–2%) against a
fasted-and-rested best-practice protocol. Fat mass was much less affected. [3]

**The protein range is a dose range, not an FFM uncertainty.** 2.3–3.1 g/kg FFM scales
up with leanness and with deficit depth. [4] At ~63 kg FFM that multiplier alone spans
~145–195 g. So the 160–190 g spread is the *multiplier*, not uncertainty about FFM —
a DEXA changes what the multiplier is applied to, and cannot narrow the range itself.
Narrowing it further is a **policy** decision (where in 2.3–3.1 Joe sits, given how
lean he is and how deep the deficit is), and policy decisions belong to the engine and
the supervisor, not to a scan.

#### What one DEXA legitimately does

- **Anchors `bfEst`.** Replaces an inferred body-fat estimate with a measured one at a
  point in time, with its own error, which tightens the interval — it does not remove it.
- **Makes FFM a measurement instead of an estimate**, so the protein prescription is
  applied to a real denominator. The 2.3–3.1 g/kg range stays a range and should still
  print as one.
- **Nothing else.** It cannot measure partitioning, cannot validate the twin's
  fat-vs-lean split, and cannot confirm a lean-mass change.

#### What it takes to measure partitioning — the gate

Partitioning needs **two** scans whose fat-mass difference exceeds the LSC. At Joe's
measured ~0.7 lb/wk, of which the engine reads ~86% as fat (~0.6 lb/wk of fat), the
consecutive-day LSC of ~4.3 lb is not cleared for roughly **seven weeks or more** — and
that is the interval *before* it is even detectable, not before it is well estimated.

**The app must therefore never display a partitioning number from fewer than two scans,
or from two scans whose fat-mass delta is inside the LSC.** Below that gate the honest
readout is "not enough separation between scans to read a real change yet" — the same
abstention pattern `signalState` and `forecast` already use. This is the whole reason
`bfEst` prints a range today; the anchor tightens the range, it does not license a point.

#### What to build

1. **A `dexa` entry.** Date, body-fat %, fat mass, lean/fat-free mass, machine/site,
   and the protocol flags below. This is the first queued item that adds **synced
   state** — so per the standing data-safety guardrail it ships with keyed-union /
   refuse-to-shrink merge hardening **and** an additive schema migration, in the same
   change. Scans are append-only: a keyed union on scan id, and a merge that can never
   shrink the list.
2. **A protocol checklist on entry**, because it determines whether scan 2 can be
   compared to scan 1 at all: same machine and site, morning, fasted, rested, no
   training the previous day, consistent hydration, voided. Store the flags with the
   scan. Two scans that do not share a protocol get compared with the wider,
   non-standardized error — or not compared at all. Say which in the readout.
3. **An anchor selector** that shifts `bfEst` toward the measured value at that date and
   tightens its interval, decaying back toward the model's own uncertainty as the scan
   ages. Engine-owned; the UI formats it. No new second body-fat number anywhere.
4. **An LSC gate constant** in the engine (fat mass and FFM, same-day and
   consecutive-day variants), with the partitioning readout gated on it and its own
   assertions.
5. **Honest labelling.** A DEXA-anchored figure is `◆ measured` at its scan date and
   reverts to inferred as it ages. Any lean-mass delta between scans carries the
   water/glycogen caveat explicitly — the app must not let a 2% glycogen swing read as
   muscle.

#### Acceptance criteria

- No new body-fat, rate or protein number invented anywhere — the anchor composes
  `bfEst`; the protein range keeps its existing 2.3–3.1 g/kg FFM span.
- Merge hardening + additive migration land in the same commit as the field, with
  assertions that a scan list can never shrink across a merge and that a stale device
  cannot drop a scan.
- Assertions that: one scan yields no partitioning readout; two scans inside the LSC
  yield no partitioning readout and say why; two scans outside it yield one, labelled
  with its interval.
- The protein prescription still prints as a range after a DEXA lands. If it prints a
  single number, that is the defect this spec exists to prevent.
- Nothing in the UI computes; `ledger/` untouched; iOS Safari walked before ship.

#### Open question for Joe

The protocol checklist only pays off if the *second* scan matches the first. Worth
deciding up front which machine/site he'll use repeatedly, since switching providers
resets the comparison and makes scan 1 an anchor only, never a baseline.

**Sources**
[1] Same-day vs consecutive-day DXA precision error in resistance-trained athletes —
https://pubmed.ncbi.nlm.nih.gov/30454952/ and
https://journals.humankinetics.com/view/journals/ijsnem/31/1/article-p55.xml
[2] Manipulation of muscle creatine and glycogen changes DXA estimates of body
composition — https://pubmed.ncbi.nlm.nih.gov/28410328/
[3] Importance of a standardized DXA protocol for assessing physique change in athletes
— https://pubmed.ncbi.nlm.nih.gov/24458265/
[4] Helms et al., protein for lean resistance-trained athletes in a deficit (2.3–3.1
g/kg FFM, scaling with leanness and deficit depth) —
https://www.researchgate.net/publication/257350851_A_Systematic_Review_of_Dietary_Protein_During_Caloric_Restriction_in_Resistance_Trained_Lean_Athletes_A_Case_for_Higher_Intakes

### 6. Waist + progress photos `[needs Joe]` — what he'll actually log is his call

`WEEKLY · DUE` already surfaces them; neither is being captured. Low build cost, high
signal: waist is the cheapest independent check on whether the loss is coming off fat,
and photos are the north-star readout (*"most drastic visual change"*).

### 7. Native track `[needs Joe]` — needs a Mac, Xcode and an Apple ID

The fullest endgame for near-zero cognitive load: weight, steps and sleep logging
themselves. Requires a native wrapper (Capacitor) plus a Mac, Xcode and an Apple
developer ID — a parallel track, entirely separate from the live PWA. Scope it before
committing to it; nothing on the PWA waits for it.

### 8. Clone sprawl `[needs Joe]` — do not touch unattended

`prepledger-dev` and `prepledger-v631` both exist; `feat/v6.2-autopilot-modes` is
unpushed at `e01075c`. Consolidate to one clone + worktrees — but **push or tag that
branch somewhere safe first**, as its own separate job, and only after v7.5 has shipped
and settled. Do not fold this into a feature build.

## SHIPPED

- **v7.6.0 — Gym Mode data integrity, the event miss, exOrder, polish** (2026-08-04).
  Merge `7113f76`; integration branch `release/v7.6.0` (`f3b5afc` → `690317b`, 20 commits).
  Beacon published v7.6.0 at 2026-08-04T12:51:56Z; deployed `app.js` and `sw.js` verified
  byte-identical to `main`. Strict gate green, 1415 engine assertions.
  - Gym Mode `skip lift ▸` banked a set never performed; one skip path now, and the two
    entries it had already written (`pronated@2026-07-23`, `ham@2026-07-31`) moved to
    `skipped[]` with a backup and a feed line each.
  - Rest measured from a wall-clock timestamp — the throttled `setInterval` was making full
    rests read as cut and flagging honest sessions rushed.
  - One draft: leaving Gym Mode partway no longer lets TRAIN log every remaining lift at
    target.
  - A miss no longer expires — `WEDDING #2` (2026-07-25) had fallen past the grace window
    and had no surface anywhere.
  - `exOrder` merge hardening (newest-deliberate-wins + never-lose-a-lift, no schema bump).
  - `conditionalForesight` collapsed to one component; `forecast`/`energyDensity` memoised;
    the LAB proposal stopped claiming a change the app had not made.

- **v7.4.1 — honest plan-conditional foresight** (`762d81e`, `bf42d11`).
  `conditionalForesight(s)` + the `target reached` relabel, rendered in both the
  projection and crossing branches.

---

*Written by the research/spec side. Build side: work NOW, top to bottom, and move it
to SHIPPED when it's on Joe's phone.*

---

## OVERNIGHT LOG — 2026-08-04

**CLOSED — all of it shipped in v7.6.0 on 2026-08-04** (merge `7113f76`, beacon published
12:51:56Z). Joe walked it on the phone before the merge. Kept below as the record of what
was found and why; the three decisions it raised are answered under JOE'S ANSWERS and now
live in QUEUED as items 1-3.

Unattended. **Rails held:** nothing pushed or merged to `main`, nothing deployed, no
`[needs Joe]` item touched, `feat/v6.2-autopilot-modes` untouched at `e01075c`, no clone
consolidation, no red commit — the strict gate and render smoke were green before every
one of the 11 commits below.

**Every overnight-safe item in the queue is done.** Six branches, all pushed, all waiting
for you. Nothing is merged.

### Read these three first

1. **The v7.5 deploy beacon never updated.** `main` is at APP_V 7.5.0 and the live site
   serves `measured-v7.5.0` — `prodcheck` is green, 7 assets 200, 9 private paths 404, no
   new faults in `errors.json`. But `ledger/deploy.json` still reads `v7.4.1` from
   2026-08-03. The deploy succeeded; the *beacon commit* didn't land, most likely losing a
   push race with the ledger auto-syncs. **Consequence:** `prod-check`'s "last deploy
   reported success" line is validating a stale record, so it would not notice a *future*
   failed deploy. It is the one instrument that tells you a ship actually shipped.
2. **The Gym Mode skip bug was real, and it had already corrupted two sessions.** Fixed,
   and the two phantom sets are repaired — but the repair edits `ledger/state.json`, which
   moves on `main` continuously, so **it will go stale**. Backup and script are kept; do not
   assume the diff still applies when you merge.
3. **Three open questions are written into their items** (search `#### Open question for
   Joe`). None of them were guessed at.

### What was built

| # | Item | Branch | Commits | Suite |
|---|---|---|---|---|
| NOW | Gym Mode phantom reps | `fix/gym-phantom-reps` | `f3b5afc` → `843683b` | 1370 → 1388 |
| Q2·E | `exOrder` merge hardening | `fix/exorder-merge` *(stacked on the above)* | `303715d` | 1388 → 1399 |
| Q1 | v7.5 round-3 blockers + should-fixes | `fix/v7.5-r3-event-miss` | `37cdcf9`, `32d9bc9` | 1370 → 1382 |
| Q4 | Collapse duplicated `conditionalForesight` | `refactor/foresight-one-block` | `c6a7d8e` | 1370 |
| Q9 | Polish sweep | `polish/v7.5-sweep` | `8a8f636` | 1370 → 1374 |
| Q2·H | LAB false claim | `fix/lab-honest-claim` | `056c705` | 1370 |

*(Suite counts are per-branch off `main`; the branches are independent, so the numbers do
not add up across rows.)*

**NOW — Gym Mode phantom reps.** Both skip controls now route through one `skipLift()` that
records the skip before advancing; the lift-screen one advanced without it, so `finish()`
banked the lift at its **target reps**. Rest is measured from a wall-clock timestamp — the
`setInterval` countdown was throttled by iOS exactly when the phone is pocketed between
sets, so a full rest read as *cut* and flagged the session rushed, which pulls it out of the
progression evidence via `liftCall`. `mergeSessionDrafts` closes the second phantom path
(leave Gym Mode at lift 4, tap *Complete session* on TRAIN, and every remaining lift logged
at target). Two phantom sets repaired — `pronated@2026-07-23`, `ham@2026-07-31` — **moved**
into `skipped[]`, never deleted, with a timestamped backup taken first, a feed line each, and
every collection count asserted non-shrinking. Repaired only those two: `rir: null` alone is
not sufficient evidence and a bulk sweep on it would delete real work.

**Q1 — v7.5 round 3.** Blocker A was live on your phone: `WEDDING #2` (2026-07-25, unfiled)
had fallen past the 7-day grace and had **no surface anywhere**, so `closeEvent` was
unmakeable and the miss was silently gone. A miss no longer expires at all; the grace window
now decides only tone. With that, B dissolves (nothing disappears, so nothing needs a
countdown), C is fixed (the card no longer tells you to put a four-day-old dinner into
*tonight's* log), and D is fixed (the instruction and the button now name the same event).
E–I: the "two clean weekly snapshots" unlock line was factually false — the projection
unlocks on ten clean daily weigh-ins; the More panel and the card body now share **one** gate
(`paceShown`) because that defect had already recurred once in a sibling element; the band
rounding was reverted because it could collapse the band; and the approval-inbox door is no
longer exempt from the live door-key check.

**Q2·E — `exOrder`.** It was in no `MERGE_*` map and rode the wholesale local-wins spread, so
a stale device silently reverted your lift order. An ordering can't be keyed-unioned, so:
newest *deliberate* reorder wins (ISO stamp per day key, same convention `savePlan` uses),
and no lift can fall out of the order regardless of who wins. No schema bump, deliberately —
a historical `exOrder` has no knowable stamp, which is the `pace` precedent in CLAUDE.md.

**Q4 / Q9 / Q2·H.** The plan-conditional block was written out twice byte-identically, which
is exactly how v7.5 shipped a fix applied to one branch and not the other — one component
now. `forecast(s)` ran **four times** per NOW render and `energyDensity` four times; both are
memoised on state identity, with the in-place-mutation trap documented and pinned by
assertion. And the LAB proposal claimed the rep window *"which the app has already done"* — it
has not; `windowFor` feeds that one proposal and never progression.

### Where I proved a check can fail

Two of the invariants added tonight were verified by breaking the code on purpose, because
an invariant that has never been seen to fail is not yet an invariant:

- Setting THE ROOM's `persistKey` to `now.machine` makes the render smoke report exactly
  `now.room` and exit 1.
- Breaking `NOW_DOORS.inbox` makes the newly-unexempted inbox check report `now.inbox` and
  exit 1.

### Not done, and why

- **In-progress session survivability** (NOW item) — adds synced state; two options with very
  different risk. *Open question in the item.*
- **v7.5 round-3 minor I4** (`ev.protocol` unreachable until D−1) — directly contradicts
  round-2 minor G1, which asked that the card stop being resident for the whole run-up.
  *Open question in the item.*
- **Q2·F** — the three non-numeric lifts (`hack` "hold", `hanging` "BW", `curl` "55·55·50")
  store `w: null`, so `progressAnchor` never anchors them and `typicalError` skips them. The
  item says the app "needs a per-set load array where it currently stores a display label" —
  that is a data-model change plus a decision about how those three lifts should be
  represented. Left for you.
- **Q2·G** — the batch of smaller Gym Mode/TRAIN defects (dead `ex.cue`, discarded `lines`,
  hardcoded `note: "gym mode"`, `wVal` defaulting to 180 on a bodyweight lift, `jump` chips
  deleting `ex.steps` with no confirm, two dead RECEIPT chips). All real, none started —
  several change what the gym screen does while you are standing at a rack, and the item
  itself is superseded in part by the `[needs Joe]` redesign in Q3.
- **Everything `[needs Joe]`** — Q3 redesign, Q5 DEXA, Q6 waist/photos, Q7 native, Q8 clones.
  Untouched, per the rails.

### Still needs the phone

Both live-facing branches carry acceptance criteria I cannot satisfy headlessly:
`fix/gym-phantom-reps` wants Gym Mode walked — tap the lift-screen skip, finish, read the
receipt — and `fix/v7.5-r3-event-miss` sits on the NOW screen you have not yet looked at on
iOS. Everything above is jsdom.

---

## JOE'S ANSWERS — 2026-08-04

**1. In-progress session survivability — DOWNGRADED. `[needs Joe]`, do not build.**
Joe: *"My spec line 'phone dies at lift 6 and the session is gone' was wrong and it was
mine."* localStorage survives a dead battery, an app restart and a reboot — the draft is
lost only if the device is wiped or replaced. The real exposure is far narrower than the
item claimed and **does not justify `SCHEMA_V` 39.**

The mid-session merge rule was the real question, and it now has an answer, so the item is
not open-ended if it is ever built: **an open gym draft is a LEASE, not a mergeable
collection.** Stamp it with a device id and a started-at. It may be replaced only by a draft
from the *same* device, or by a completed session. **A stale device NEVER overwrites a live
one — there is exactly one phone in the gym.** Nothing here merges; it is claimed or it is
released.

**2. Round-3 minor I4 — (c), queued behind the iOS walk.**
Move the event reference material into a door (THE BRIEFING); keep the fold card gated to
the actionable window. Joe: *"(c) is right, and it does not re-open G1: the fold card stays
gated to the actionable window, only the reference material moves."* Recorded so nobody
relitigates it. **Not built yet** — THE BRIEFING is a v7.5 construct and v7.5 has not been
walked on a phone, so it is not built blind.

**3. DEXA scan consistency — leave as-is.** Joe's own question, blocking nothing, no code
depends on it.

**4. Q2·F — the three non-numeric lifts. Formal open question below.** `[needs Joe]`

---

### Open question for Joe — Q2·F, the three lifts outside the progression engine  `[needs Joe]`

`completeSession` writes `w: typeof ex2.w === "number" ? ex2.w : null`, so three of fifteen
lifts store `w: null`:

| lift | stored `w` | what it means |
|---|---|---|
| `hack` | `"hold"` | not a load at all — Joe's read is that this is a *duration* or a position |
| `hanging` | `"BW"` | bodyweight, possibly plus added load |
| `curl` | `"55·55·50"` | three different per-set loads in one display string |

`progressAnchor` compares `String(en.w) !== String(ex.w)` → `"null" !== "hold"`, so these
lifts **never get the max-of-three anchor**, and `typicalError` skips them, so they neither
contribute to nor benefit from the measured noise band. They are outside the progression
engine entirely.

**The representation decision is yours.** At minimum:

- **A per-set load array** — `curl "55·55·50"` → `[55, 55, 50]`. Handles the drop-set case
  exactly and makes the anchor comparison real. Needs a display formatter so the card still
  reads `55·55·50`.
- **A bodyweight flag with optional added load** — `hanging "BW"` → `{ bw: true, add: 0 }`.
  Bodyweight is a load that *moves with the athlete*, so progression on it is a different
  question from progression on a plate.
- **Whatever `"hold"` actually is for the hack squat** — Joe: *"I don't think it's a load at
  all."* If it is a hold duration, it does not belong in `w` in any form and the lift may
  need its own progression rule, or none.

**This is a data-model change: it needs merge hardening and a migration, so it is not
overnight work.** It also changes what the app can say about three lifts it currently says
nothing about, which is a bigger claim than a refactor.
