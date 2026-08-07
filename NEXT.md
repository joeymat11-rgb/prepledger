# NEXT.md — the work queue

**Read this file at the start of every session, before you touch anything else.**

This is the single source of truth for *what to build next*. The research/spec side
writes work into this file; the build side reads it and ships. Briefs are not pasted
into a chat window any more — work arrives here, in the repo, versioned.

## The loop

1. Research and specs get written into this file.
2. Joe says "go".
3. You read this file, work the item under **NOW**, and ship it.

## What "go" means

When Joe says **"go"** — or "go" with nothing else — that is the whole instruction. It
means:

1. Read this file. Work the item under **NOW**, start to finish, without asking.
2. Follow that item's own sequencing and acceptance criteria. They are in the item. Do
   not wait for them to be repeated in chat.
3. Gate and render smoke green before every commit. Never commit red.
4. Ship it as far as the item says to ship it — usually: push the branch, produce a
   preview Joe can open on his phone, report what to tap. **Never merge to `main`.**
5. If something in the item is ambiguous, build the smallest honest version and write the
   question into the item under `#### Open question for Joe`. Do not stop and ask.

**Joe should never have to paste context into the terminal.** If an instruction matters,
it belongs in this file. Anything pasted into chat is a bug in how the work was handed
over, not something to rely on. If you find yourself needing information that is not in
this file to do the NOW item, say so explicitly in your reply so the file gets fixed —
do not proceed on chat-only context.

Other single words with standing meanings:
- **"go"** — work NOW to completion, as above.
- **"work the queue overnight"** — see *Overnight mode* below.
- **"audit"** — the research side is reviewing; do not start new work until it reports.

---

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

**No proposal, phase change, or THRESHOLD CROSSING may fire on `bfEst`. A DERIVED QUANTITY
may use `bf.lean` provided it does not threshold on it, carries the interval, and degrades to
a stated fallback when the anchor is stale.** *(Narrowed 2026-08-06. The original read "no
proposal, gate or target may read `bfEst`", which was unsatisfiable: `calorieFloor` derives
the floor from `bf.lean` via the IOC energy-availability formula, and `calorieTarget` calls
it. Satisfying it would have meant a hardcoded floor, which `CLAUDE.md` forbids by name.)*

**The distinction is DISCONTINUITY, not contamination.** `bfEst` is fine as an INPUT and
unusable as a BOUNDARY:

- **Thresholding** turns a ±3.5-point uncertainty into a binary flip. `bf.lo = 10.7` against a
  cut point of 11.2 is a coin toss that changed the athlete's phase.
- **Deriving** carries the uncertainty through *as* uncertainty. A continuous formula in
  `bf.lean` propagates error proportionally; nothing is amplified by a cliff.

Same reasoning as the `p2 >= 0` coin flip in the trend downgrade — **a decision boundary
placed where the data has no power to resolve it.**

**NAMED, DATED EXCEPTION: `calorieFloor` does not currently satisfy the third condition.** It
uses `bf.lean` as a point estimate and returns a single number. Recorded here rather than
laundered by the rule that exempts it — **a rule that does not hold against current code is
the unreachable-guard pattern in rule form.** The exemption's conditions are the acceptance
criteria of QUEUED · R12, and this exception expires when R12 lands. The instrument cannot resolve the range of interest at
any cadence Joe will sustain: consecutive-day LSC is 1.3–2.2 BF points for DXA and 4.9 for
BIA, and scan-day state alone is worth up to 5.5 points of PERMANENT anchor bias. Render the
band, never the midpoint (Broad 2007); express uncertainty numerically, never verbally
(van der Bles 2020).

**Every guard ships with an assertion that it can actually FIRE.** Not that it exists — that
a fixture drives the guarded path and the guard changes the outcome. **A guard that has never
been observed to fire is indistinguishable from one that cannot.** Five occurrences of this
one shape are already on the record, and every one of them was invisible until someone went
looking:

    phasePlan        apply handler and UI references, no constructor
    costing          the exit existed and was unreachable
    the step cap     the exit existed and stranded short of it
    the 1e-6 floor   the guard existed and .toFixed rounded it away
    grep on the gate the gate ran and its exit code was discarded

The shape is always the same: **the safeguard is present and nothing can reach it.** A test
that asserts the guard is *there* does not catch any of these. A test that drives the path
and asserts the outcome *changed* catches all five.

**THE RULE HAS PAID FOR ITSELF ONCE, and it is worth recording as the payoff rather than a
footnote.** Twelve instances were found by reading. **The thirteenth was found by a test going
red**: a copy assertion written for R4's trap failed, and the failure was the finding —
`energyBalanceTarget`'s gated branch was REPLACING `calorieTarget`'s reason with a mechanism,
dropping the sentence that says what the gate is waiting for. **That is the R10 abstention
defect, in the branch that runs when data is thinnest, which is the branch running on his
phone right now.** First time a NEW assertion caught a NEW defect rather than documenting one
already found.

**THE TRAJECTORY IS THE FINDING, and it says where to put the effort.**

    1-7      pre-existing
    8        found by the research side, in R1/R2c
    9,10,11  INTRODUCED BY THE REPAIRS
    12       introduced by a repair, found by a tool built to find 11

**Fixing the pattern is now its main source.** The mechanism is specific enough to act on:
the repair lands in the SAME commit as the fix, so attention is on *"did the fix work"* and
not *"what did the fix add"* — and the assertions for the repair are written by the same
author, in the same sitting, from the same model that produced the bug. **The repair is the
least-reviewed code in the change, written by whoever is most convinced they now understand
the problem.**

**SECOND COMPANION RULE — the guard-must-fire assertion is owed by any branch the change
ADDS, not only by the branch it fixes.** A diff that introduces a state transition with no
assertion driving it should not pass review, mine or the research side's.

**This rule failed on the commit that celebrated it.** The four-outcome downgrade was written
with the guard rule quoted in its own commit message, and the only branch that changes the
verdict — `state = "flat"` — had **zero assertions anywhere in the suite.** The
`!clean2.length` branch was driven and the plain falling branch was driven; the one that
decides whether the calorie target keeps stepping the deficit out was not. **That is the most
likely way this rule decays: it gets applied to the code under repair and not to the repair.**

**And the first assertion I wrote for it was VACUOUS**, which is the same failure one level
up. It read `ok(hair.state !== "flat" || hair.pctClean == null, ...)` — and `pctClean` is not
a field on the result, so the right-hand side was always true and the assertion could never
fail. **A dead assertion, in the commit that adds assertions for a dead branch.** Assert
positively, name the state and the confidence, and never leave an `|| something-that-might-
not-exist` escape hatch in an `ok()`.

**COMPANION RULE — drive the guard against the REAL LEDGER, not only a fixture, and record
which branch real data actually takes.** The eighth instance is a variant the fixture rule
cannot catch on its own:

> **A guard that fires in the fixture and cannot fire in production.**

The `falling` downgrade re-pooled on lifts whose ENTIRE window carried no flagged session.
On his ledger `cleanAtDate` is false on 6 of 8 sessions, so a lift needed six consecutive
clean-sleep sessions to qualify and the gate needed four such lifts — roughly three unbroken
weeks of clean sleep on a 6.23 h five-night average. **The assertions were correct and
passed; the branch was dead where it mattered.** Every falling verdict he could ever get
would have taken the low-confidence path.

Record the real-data branch in the item, every time. As of 2026-08-06:

    progressionTrend.state   unknown   (0 lifts with a usable trend, needs 4)
    nExcludedNonNumeric      2         curl, hanging
    lifts with >=3 clean sessions      0    <- the NEW downgrade gate
    lifts under the OLD gate           0    <- spotless 6-session window x 4 lifts
    regime                   unknown, unconfirmed
    energyBalanceTarget      deficit 2176-2263, provisional TRUE

**Both gates read zero today** — the difference is what it takes to leave zero. The old one
needed three unbroken clean weeks; the new one needs three clean sessions on one lift.

**WHEN A SUITE FAILS FAST, ORDER ASSERTIONS BY HOW MUCH THEIR FAILURE TELLS YOU, NOT BY WHERE
THEY WERE WRITTEN.** An assertion whose failure means *"this does not do what was asked"*
outranks one whose failure means *"this does not match how I imagined it."*

**This inverted the whole point of the snapshot rule and it was live for exactly one commit.**
The suite exits at the first failing checkpoint and the snapshot block sat near the end, so it
ran only when everything synthetic had already passed. Follow that through: **the builder is
always told "you violated your own model" and never "the world disagrees with you", because
the second message only arrives once the first has nothing to say.** Demonstrated on the
narrowed comparator — six synthetic failures, and the assertion written to catch it never ran.

Fixed by running the snapshot block FIRST, immediately after `ok()` is defined. Not because it
is more likely to fail — it is less likely — but because its failures carry information the
synthetic ones cannot. **Fail-fast is a time optimisation and must not double as a
truth-ordering.** Verified: with the comparator re-narrowed, the three SNAPSHOT failures are
now the first three lines of output.

**WHEN AN ITEM'S CORRECTNESS DEPENDS ON REAL DATA, THE FIXTURE IS A DATED SNAPSHOT OF REAL
DATA AND THE CRITERION STATES THE OUTCOME, NOT THE MECHANISM.**

A criterion phrased as a **mechanism** is satisfied by any comparator that plausibly fits the
words — *"compare the behaviour-implied rate to the measured rate"* was satisfied by **both**
of R7's builds, one of which silently answered a narrower question. A criterion phrased as an
**outcome on real data** is not: *"on his ledger the flag is RAISED"* fails instantly against
the narrowed build, 0.28 against 0.38.

**A synthetic fixture encodes the author's model of the problem — which is the same model that
produced the bug.** Both R7 comparators passed their synthetic fixtures because both were
written to. A frozen real snapshot encodes the world, and does not care what the author
believed.

`tools/snapshots/2026-08-06-ledger.json` is the first. **Snapshots accumulate; never edit one
to make a test pass — take a new one, dated.**

**PROVED, not assumed:** re-narrowing the comparator and running it against the snapshot gives
`flagged = false`, so the assertion fails. Guard-must-fire, applied to the practice itself.

**KNOWN BLIND SPOT.** A comparator can still be narrowed in a way that happens to produce the
right outcome on the snapshot, and this catches placement errors (like the `p2 >= 0` boundary)
not at all. It converts *"no mechanical check exists"* into *"one exists with known limits"* —
which is the difference between the eleven instances found by reading and the four found by
tools. It would have caught **two of the last five** immediately: the narrowed comparator, and
the unreachable `clean2` gate, where *"how many lifts clear the downgrade gate"* had the answer
*"none, ever."*

**WHAT CAUGHT THE NARROWING WAS INCENTIVE, NOT PROCESS — SYMMETRICALLY, AND NEITHER HALF IS A
CHARACTER FACT.** The research side checked the gate because they had a stake in the item it
closed. The build side did not check it because **the result was comfortable** — flag
consistent, item closed, nothing outstanding. **A clean result is the least-examined result on
both sides.** The research side proposed R13, the
gate closed it, and they therefore had reason to check whether the gate was measuring the right
thing. **That is not virtue and it does not generalise** — a gate closing an item nobody cared
about would likely have been accepted. Worth recording because it says the audit is strongest
where it disagrees and weakest where it is indifferent, which is the opposite of where anyone
would design it to be. The snapshot rule exists to cover the indifferent case.

**A REPORTING CHANGE THAT MOVES THE TARGET IS A FAILED REPORTING CHANGE.** If an item is
scoped as diagnostics, pin the numbers it must not move and assert them byte-identical before
and after, on the real ledger. R6 was one line of reasoning away from cutting his intake ~90
kcal/day as a side effect of making a scalar more legible — and R2b is what made that possible,
by putting a single owner in front of the calorie decision. **The more centralised the engine
gets, the further a "display" change can reach.**

**Copy that quotes an engine number, or describes engine behaviour, must be GENERATED from
the engine — never written alongside it.** This is engine-owns-numbers applied to prose.
**Copy that describes the engine is a second implementation of the engine**, and it drifts
exactly like any other duplicated number. It is the nastiest variant of the unreachable-guard
family because **nothing goes red**: gate green, suite green, and he reads a false sentence
about his own numbers. The rulebook told him the rate thresholds were "in pounds, which is a
problem" and that "there is an open proposal to restate the band in %BW" — for as long as it
took to fix both. Rewriting a sentence fixes one instance; reading the value from its owner
fixes the class. See QUEUED · R10.

**A fixture must express its dates RELATIVE to the suite's frozen anchor, never as
absolutes.** *(Corrected 2026-08-06 — the first version of this rule said the suite reads the
wall clock. It does not, and I should have checked before writing it into the guardrails.)*

`tools/_fixed-now.mjs` already freezes the clock at **2026-07-29**, deliberately and with a
swept table showing why. The rule that was actually broken is narrower and worse: a fixture
wrote an **absolute** date — `S3.blackout.until = "2026-07-27"` — which sits two days BEFORE
the anchor. So `daysUntil()` returned negative, the seal was never engaged, and the assertion
named *"sealed window mutes the false redline"* passed on an unrelated coincidence (the rate
1.80 sitting under the old authored 1.9).

**It was not flaky. It was deterministically dead, on every machine, every run, since the
freeze.** That is worse than a flaky test, because there is no red day to notice.

The shim's own comment anticipated the opposite failure — *"if a future fixture edit shifts
that window, this anchor is the first thing to fail"* — and what happened is the inverse: the
anchor moved past a fixture's absolute date, and the fixture died silently instead of
failing. **A frozen clock removes flakiness; it does not stop a fixture writing a date outside
the window.** Express fixture dates as anchor ± offset, and the guard cannot fall out of the
window without the offset saying so.

**Still the worst variant of the family, because the test layer is what is meant to catch the
other six.**

**Ops.** Never print or expose a credential. Never delete athlete data. Keep the
`/ledger` lockdown intact. iOS Safari is the real target and the test suite only runs
headless — walk the render-smoke states and eyeball on the phone before shipping.

---

## NOW — R1 · one regime detector replaces both phase machines

**Source: `RESEARCH-DESIGN.md` §R1.** That file is the *why*; this item is the *what*. It is
self-contained and buildable without any other item.

**The objective it serves.** One objective, unchanged by diet phase: maximise positive
body-composition change, as fast as possible. Cutting and massing are two means to one goal.
An instantaneous scalar `dLean/dt − dFat/dt` is **structurally incapable of ever choosing
massing**, so the objective is over a horizon and the state variable that selects the means
is **not body fat** — it is whether both terms are still improving at once.

| regime | observable | both improving? | means |
|---|---|---|---|
| `free` | lifts progressing **and** fat falling | yes, simultaneously | hold the deficit |
| `costing` | lifts stalled/declining, fat still falling | no — now a trade | shrink the deficit until progression resumes |
| `accretionBound` | zero deficit, still not progressing | fat term exhausted | surplus |

`free` is the global maximum, and **he is in it, not marginally** — eight weeks, 170 → 163 lb,
rows +35 lb (+24%), leg extension +30 lb (+25%). At 24 with FFMI 20.0 he has ~34 lb of headroom
to the 98th-percentile natural ceiling, so the accretion ceiling is not binding and `free` is
*more* valuable, not less. The app never picks a phase; it reports the regime and the target
follows.

### Fix this first — `liftCall.vel` cannot be the input

**Verified against `src/app.jsx` on this branch** (doc said 590; actual 593/597):

```js
593:  tot: (e.reps || []).reduce((a, b) => a + b, 0)     // total reps, NO load term
597:  const vel = ... ((clean[last].tot - clean[0].tot) / (clean.length - 1))
```

Calves went `315 × 13,12,11,10` → `320 × 10,8,7,7`. **`vel` reports −14 reps/session for a lift
that just added 5 lb.** That would put him in `costing` for progressing.

**Leave `liftCall` alone** — it correctly answers "beat your total at this load." Build alongside.

### The four new selectors

**1. `sessionScore(entry)`** — volume load `Number(entry.w) × Σ(entry.reps)`; `null` when `w` is
non-numeric. That excludes `hanging` (`BW`), `curl` (`55·55·50`) and `pronated` — **three of
fifteen lifts.** Report the count; do not hide it.

*State in the code:* volume load treats `100×20` and `200×10` as equivalent, which they are not
as a stimulus. Defensible for a **within-lift** trend only. Never compare across lifts.

**2. `liftTrend(s, exId)`** — OLS of `sessionScore` over the last 6 sessions that are not
`dayWeather(s,d).hard`, as % of mean per session, with a 95% interval. Reuse `liftCall`'s existing
exclusions — rushed and short-sleep days do not count toward a stall and must not count toward a
decline (`PACE_NOTE`, `SLEEP_NOTE` — **do not re-litigate**). Returns `null` below n = 4.

**3. `progressionTrend(s)`** — inverse-variance weighted mean across lifts with a usable trend.

```
"rising"   when lo > 0
"falling"  when hi < 0
"flat"     when the interval spans 0 and is narrower than ±1.5 %/session
"unknown"  otherwise, or nLifts < 4
```

`"unknown"` is a first-class answer and **suppresses every downstream use** — the same
self-suppression `signalState` already performs. An autonomous coach that guesses is worse than
one that abstains.

**4. `regime(s)`**

```
prog.state === "unknown"                     -> "unknown"          // abstain
prog.state !== "falling" && rate.scale > 0   -> "free"
prog.state === "falling" && rate.scale > 0   -> "costing"
prog.state !== "rising"  && |rate.scale| ~ 0 -> "accretionBound"
```

**Hysteresis is required.** A regime may not flip on one session — require the new state to hold
for **two consecutive evaluations at least 7 days apart**, carrying `since` and `pendingSince`.
A hunting target is worse than a wrong constant one.

**`regime` must not read `bfEst`.** Assert by grepping the function body.

### Acceptance criteria

- Real ledger @ 2026-08-05 ⇒ `regime(s).key === "free"`
- `progressionTrend(s).nExcludedNonNumeric === 3`
- A fixture where a lift adds load and loses reps at constant volume load: assert
  `liftCall(...).vel < 0` **and** `liftTrend(...).pct ≈ 0` — the defect documented in a test
- 3 consecutive weeks of declining pooled score + falling trend ⇒ `"costing"`
- Flat pooled score at zero rate ⇒ `"accretionBound"`, and `s.plan.phase = "leangain"` reachable
- < 4 usable lifts ⇒ `"unknown"`, no downstream consumer acts
- One anomalous session cannot change `regime(s).key`
- `regime` never calls `bfEst`
- **Any volume change invalidates `progressionTrend` for a stated washout** — see R8, §2.3
- Strict gate + render smoke green. No new stored field; `regime` is a pure selector.

**What it does not buy.** Strength is a necessary but not sufficient proxy — Murphy & Koehler's
dissociation (lean ES −0.57 p=0.02, strength ES −0.31 p=0.28) says progression can hold while lean
is lost. **And that dissociation was measured in adults averaging 51–60 years old** — transfer to a
24-year-old trained male is plausible but unproven, so label it medium confidence in the code. This
is the **fast loop**; monthly skinfolds are the slow calibration loop (R5). Eight logged sessions is
thin — `"unknown"` will fire first, and that is the feature working.

#### BUILT 2026-08-05 — and three of its acceptance criteria were wrong. Measured, not argued.

The four selectors are in `src/app.jsx` and exported to the suite: `sessionScore`, `liftTrend`,
`progressionTrend`, `regime` (+ `_regimeRaw`, `_stateAsOf`). 1537 assertions, strict gate green.
All three regimes are proved reachable by fixture, so `leangain` is no longer dead by
construction. `regime` stores nothing — hysteresis is derived by re-evaluating a truncated view
of the state, so the "no new stored field" criterion holds.

**1. `nExcludedNonNumeric` is 2, not 3.** The criterion named `hanging`, `curl` and `pronated`.
`pronated` is `w = 40` in the roster **and in all three of its logged entries** — it was never
non-numeric. Measured: `nExcludedNonNumeric === 2`, `excludedIds === ["curl", "hanging"]`.

**2. The exclusion policy as written STARVES the instrument to zero.** The item said to exclude
`dayWeather().hard` *and* reuse liftCall's rushed/short-sleep exclusions. On his real ledger:

    2026-07-23  hard=false  debt=true      2026-07-30  hard=true   debt=true
    2026-07-24  hard=false  debt=false     2026-07-31  hard=true   debt=false
    2026-07-27  hard=true   debt=true      2026-08-03  hard=false  debt=true
    2026-07-28  hard=false  debt=true      2026-08-04  hard=false  debt=true

**Six of eight sessions carry debt and three carry hard. Only 2026-07-24 is clean on both.**

    usable points per lift:   no exclusions  4     hard-only  2-3     as-specified  0-1
    lifts reaching n>=4:                    10                  0                     0

That is not protection, it is blindness — and the constitution says short sleep **protects, it
does not punish**. So `liftTrend` excludes `hard` only (a genuine data-quality flag: declared
estimate days and event days), and rushed/short-sleep are handled **downside-only** in
`progressionTrend`: they are kept in the trend, but a `falling` verdict is re-pooled on the
unflagged sessions alone and downgraded if it does not survive. A short-sleep session can never
*create* a decline, and it never blocks a rise. That is the rule applied literally instead of by
deletion.

**3. The real ledger reads `unknown` today, not `free` — and the item contradicts itself here.**
The criterion says `regime(s).key === "free"`; the item's own *What it does not buy* says
*"Eight logged sessions is thin — `unknown` will fire first, and that is the feature working."*
**The caveat is right and the criterion is wrong.** Even with `hard`-only exclusion no lift
reaches n=4: upper lifts have 4 sessions of which 2 are hard, lower lifts 4 of which 1 is hard.
`regime` abstains, names the reason, and suppresses every downstream consumer.

*It is close.* Upper lifts need 2 more unflagged sessions, lower lifts 1 — roughly **one normal
training week**, or sooner as the event window around the wedding ages out of the 6-session
horizon. **Nothing should be tuned to force a verdict early.** Lowering `TREND_MIN_N` to 3 gives
df=1 and t=12.706, so the interval would be so wide the state would read `unknown` anyway —
self-defeating. Dropping the `hard` exclusion would admit declared-estimate days into the one
instrument the whole objective function rests on.

#### DECIDED by Joe, 2026-08-05 — the criterion is STRUCK

Asked whether to leave the detector abstaining or loosen the rules so it would read `free`
today, **Joe chose to leave it abstaining.** The criterion `regime(s).key === "free"` is struck
from R1; the item's own caveat stands in its place.

**Do not reinstate it, and do not tune around it.** Loosening the input to reach a verdict would
mean counting sessions the app itself flagged as unreliable, inside the one instrument the whole
objective function rests on. That is the failure mode R1 exists to prevent — Nait-Yahia's finding
is that volume can manufacture the very strength signal this detector reads, and admitting
flagged sessions is the same defect by a different route. The replacement criterion is:

- **Real ledger ⇒ `regime(s).key === "unknown"`, with a stated reason, and every downstream
  consumer suppressed.** It reads a verdict when the data earns one, not before.

#### Two defects found while building, both fixed here

- **`deriveLastMeta` called `cleanAtDate(s, d).clean`. `cleanAtDate` returns a BOOLEAN.**
  Shipped by me in v7.10.0, so `!undefined` forced `debt = true` on **every** re-derive after a
  `✕` or `↩` correction. Every other call site (593, 1939, 1942, 4090, 4603, 4608, 8401, 11721)
  treats it as a boolean. Conservative in direction — `debt` only ever protects from a STALL —
  but it silently suppressed a legitimate stall signal on any corrected lift.
- **A perfectly straight trend line gave `se = 0`, which took INFINITE weight in the pooling and
  turned the pooled mean into `NaN`.** The floor I wrote was `1e-6`, and `.toFixed(3)` on the
  return value rounded it back to exactly `0` — the guard was real and the rounding erased it.
  Floored above the rounding, and guarded again at the point of use.

#### Verified against the source before this item was written

`liftCall` tot/vel (593/597) · `calorieTarget` band (2197) and `baseHi` (2221) · `bf.pct <= 13.2`
(6238) · `bf.lo <= 11.2` (6247) · `floor`/`redline` read raw in lb at 2499–2500 while the band is
converted by `pctToLb` · `predAt` mass-only (2746) · `weightNoise(reads)` (8893) ·
`BULK_REDLINE_PCT = 0.25` (2466) · `BULK_PROTEIN_G_PER_KG_BW = 1.6` (2476).
**`phasePlan` has an apply handler (6583) and UI references (9580/9588/9766) but NO constructor
anywhere — `leangain` is confirmed unreachable.** Line numbers current as of this branch.


## QUEUED

**This queue is `RESEARCH-DESIGN.md` Part 3 (R2 → R9) followed by Part 4 (the bugs), in the
order that document specifies.** Acceptance criteria are copied from it, not paraphrased.
Read `RESEARCH-DESIGN.md` before starting any of them — the *why* is not restated here.

**Every ledger-derived count in `RESEARCH-DESIGN.md` is a SNAPSHOT taken 2026-08-05, not live
state. Verify against the live ledger before acting on one.** This has already bitten once: §R9
reports 13 open proposals and the live ledger had 3 — Joe had drained the queue after writing it.
The same applies to read counts, session counts, step and intake trends, and every rate quoted in
Part 2. The *findings* hold; the *numbers* need re-reading.

**Part 5 of that document is a do-NOT-build list.** Nothing below may reintroduce: a body-fat
corridor rule, a personal RIR calibration, deload scheduling or autoregulated deloads, autonomous
manipulation of rest/tempo/periodisation/exercise rotation/set order, or any weekly autoregulation
loop justified on hypertrophy grounds. **Smallest detectable hypertrophy effect is 2.05% and a
marginal set is worth 0.24%** — over four weeks the app cannot distinguish its own volume decisions
from noise, and acting anyway manufactures churn.

---

### R2. The calorie target must be able to return a surplus

#### PARTIAL — the function exists, nothing calls it. Audited on main@66cd7a7.

**`energyBalanceTarget` has ZERO callers, and that is the `leangain` bug again one item
later.** Three mentions in the file: the R2_NOTE comment, the definition, the `__test`
export. Its own note claims it is *"the single owner… the only function allowed to decide
the sign of energy balance."* **It owns nothing — `calorieTarget` still does.**

`phasePlan` was dead because it had an apply handler and UI references and no constructor.
This is dead because it has a definition and a test export and no caller. **Same shape, and
it was nearly filed as shipped, which is how a queue forgets.** The function was the easy
half; the migration is the risky half and it is the half that changes anything.

**R2 stays OPEN until R2b lands.**

#### BUILT 2026-08-05 — the branching, and two defects found in audit

`energyBalanceTarget(s)` is the single owner and branches on `regime(s).key`.
`energyDensity(s, dir)` takes a direction; `proteinTargetForRegime(s, key)` takes the regime.
1555 assertions, strict gate green.

    regime            dir       band          provisional
    free              deficit   1750–1836     false
    unknown           deficit   1750–1836     TRUE
    costing           deficit   1836–1836     false     (shallow end of his own band)
    accretionBound    surplus   2443–2513     false     (maintenance 2373)

**The UNKNOWN branch is the one that runs today**, and Joe specified it: it holds the
prescription his own eight-week record validated and labels itself provisional. Abstention
must not mean stopping what is working. Asserted as identical to the free band, with copy
that says the engine is holding rather than deciding.

**Costing invents no number.** The lean cost per kcal of deficit is not identifiable from the
literature, so costing collapses the band to its own shallow end rather than to an authored
figure. Derived from constants already in the file.

**Gain density is 2,376 kcal/lb against 3,800 for loss** — `GAIN_FAT_FRAC = 0.45`, which is
exactly the split that reproduces RESEARCH-DESIGN §R2's figure. Labelled a PRIOR, not a
measurement: nothing in the literature pins the gain partition for a trained lifter, and
Helms 2023 ran 17 completers across three groups against its own required 31 per group.

**Protein never rises in a surplus.** The deficit figure (2.5–3.0 g/kg FFM) answers a question
about sparing lean mass under restriction and stays the ceiling; the surplus figure is
Morton 2018's 1.6 g/kg BW, which had been sitting unread in `BC.BULK_PROTEIN_G_PER_KG_BW`.

#### R1 correction shipped in the same change — the mirror defect

The re-pool added in R1 downgraded a `falling` verdict whenever the unflagged subset was
too small to test it. **He has ONE session clean on both flags (2026-07-24), so `falling`
could never survive and `costing` was structurally unreachable for as long as his sleep
stays short** — the app going blind to the exact state it exists to detect, under precisely
the conditions where detecting it matters most.

**Absence of clean sessions is not evidence of no decline.** The re-pool may now only
downgrade when it has the power to: below `TREND_MIN_N` unflagged trends the verdict stands
and is marked `confidence: "low"` with the reason. Three assertions cover it, including the
one Joe specified — a genuine decline with zero clean sessions still returns `falling`.

#### Note on constants

`TREND_MIN_N` is **4**, at the definition and both use sites — it never drifted from the
spec. **Any future change to a spec'd constant gets called out explicitly** rather than left
in a diff.



`calorieTarget` (2197–2221, **verified**) has no phase branch: `const band = cutRateBand(s).band`
then `baseHi = Math.max(floor, td.tdee - kcalFor(band[0]))` — it **always subtracts**. A committed
`leangain` phase is still prescribed a deficit. Five more paths cannot represent a surplus:

| path | line | failure in a surplus |
|---|---|---|
| `proteinTarget` | 1589 | serves the *deficit* meta-regression's 2.5–3.0 g/kg FFM; `BULK_PROTEIN_G_PER_KG_BW = 1.6` (2476) sits unread |
| `dripOf` → `bfEst` | 1526/1530 | lean held flat ⇒ **100% of gained weight reports as fat** |
| `energyDensity` | 2667 | 3,800 kcal/lb is tissue *lost*; tissue gained ≈ 2,376 ⇒ every conversion **~60% too expensive** |
| `partitionPrior` | 2637 | **no direction argument**; centres on `PRIOR_FAT_FRAC 0.861` regardless |
| `VOL_BANDS` | 5678 | self-declared "deficit-calibrated" (3896) |

**Change.** `energyBalanceTarget(s)` becomes the single owner, branching on `regime(s).key`.
`accretionBound` ⇒ surplus capped at `BC.BULK_REDLINE_PCT` (0.25 %BW/wk — already present and
cited at 2466). `energyDensity` takes a direction. `proteinTarget` takes the regime.

**Assertions.** `regime === "accretionBound"` ⇒ target > `observedTDEE(s).tdee`. `energyDensity(s,
"gain").perLb` materially below `"loss"`. Round-trip free→costing→accretionBound→free produces a
monotone, non-hunting target path.

**What it does not buy.** The surplus *magnitude* has almost no adequately-powered trained-lifter
evidence. `BULK_REDLINE_PCT = 0.25` is a defensible cap, not a measured optimum. Label it.

### R2b. Migrate calorieTarget's consumers to energyBalanceTarget

> **THIS IS NEXT, ahead of R4, and it is not close.** R2b is the only remaining item that
> **can invalidate the others.** Everything since R1 sits behind an interface that has never
> been exercised against real state. If wiring `energyBalanceTarget` shows the contract is
> wrong — `provisional` does not render usefully, the `unknown` hold still reads as a
> decision, the costing walk feels wrong in practice — then R2c, the protein fix and parts of
> R1 all need revisiting. **Build the thing that can invalidate the others before stacking
> more on top of it. R4 stacks; R2b tests the foundation.**
>
> **Do not run the consumer census until R3 is merged.** R3 moved 14 call sites; the
> enumeration must not be done across that seam.

**This is the half of R2 that changes anything.** `energyBalanceTarget` branches correctly
and is proved to by 20 assertions — and no code path reaches it, so today it is decorative.

**Do not wire a caller until the R2 audit fixes are on main.** They landed together in
`fix/r2-defects`; verify both are present before starting, because the migration is what
makes a wrong branch live.

#### CENSUS — 2026-08-06, against main@93723b5 (post-R3, so the seam is closed)

18 occurrences of `calorieTarget(`; one is a comment and one is the definition, leaving
**16 call sites across 15 consumers**:

| # | consumer | layer | note |
|---|---|---|---|
| 1 | `energyBalanceTarget` | engine | **the legitimate one** — becomes the only caller |
| 2 | `dietExit` | engine | |
| 3 | `phaseSupervisor` | engine | already wrapped in `_phaseSafe` |
| 4 | `dayProtocol` | engine | |
| 5 | `runAdaptive` | engine | carries the BAND_OWNERSHIP comment |
| 6 | `applyProposal` | engine | |
| 7 | `askContext` | engine | |
| 8 | `agentToolExec` | engine | the agent's own view of the band |
| 9 | `marchingOrder` | engine | |
| 10 | `AutoPilotTrust` | UI | |
| 11-13 | `NowTab` ×3 | UI | including a `useEffect` that seeds the day's inputs |
| 14 | `WhatIfConsole` | UI | **also Part 4 bug 8** — recomputes engine arithmetic inline |
| 15 | `NegotiatorConsole` | UI | **also Part 4 bug 8**, and holds the 9-14 BF stepper R4 deletes |
| 16 | `rulebook` | copy | **also R10** — generated copy |

**Three of these are already filed as defects elsewhere.** Migrating 14/15 does not fix Part 4
bug 8 (the inline arithmetic stays inline, it just reads a better owner) and does not fix R10.
Say so rather than letting the migration look like it closed them.

**PERFORMANCE IS A REAL CONSTRAINT HERE, not a micro-optimisation.** `energyBalanceTarget`
calls `regime(s)`, which runs `progressionTrend` plus `currentRate`, and then re-runs both
over a truncated state for the hysteresis lookback. The `costing` branch walks back further
still. Sixteen unmemoised calls per render would be a different order of cost from sixteen
`calorieTarget` calls. **Memoise on state, as `energyDensity` and `forecast` already do**, and
bypass the memo when `opts` are passed so the fixtures stay honest.

- Enumerate every consumer of `calorieTarget` — UI and engine — and list them in this item
  before editing. Grep-count, do not estimate.
- Migrate them one at a time, each with its own assertion.
- `calorieTarget` becomes the deficit-path implementation detail that
  `energyBalanceTarget` calls, never a public entry point. Assert it has no callers outside
  `energyBalanceTarget` when done.
- **The `provisional` flag has to reach the surface.** A provisional target that renders
  identically to a decided one is the same defect class as a proposal whose `apply.kind` is
  `note`: it takes the user's attention and returns nothing.
- **And so does `regimeConfirmed` — naming one flag is not enough.** An unconfirmed regime
  driving a real target change needs its own words on the surface, not a shared "provisional"
  badge. His next likely transition is exactly this: a steep decline read while the week-ago
  view is still `unknown` moves him ~530 kcal/day in ONE evaluation, correctly, on a single
  reading. `regime().why` already writes the sentence — *"first reading, not yet confirmed by
  a second a week apart"* — and it must be shown, not swallowed.

**Assertions.** No engine or UI path calls `calorieTarget` directly. A state whose regime is
`accretionBound` renders a surplus everywhere a target is shown. `provisional === true`
renders visibly differently from `false`.

**What it does not buy.** Migrating the callers does not validate the branch logic — that is
R2's job and it is done. This is about reach, and reach is where this codebase has failed
twice now (`phasePlan`, and R2 itself).

### R2c. Step severity — the exit speed was set by a quantity that means something else

**The walk is seven weeks.** `deficit0` 532, `step` 87, `REGIME_HOLD_D` 7 ⇒ 8 evaluations,
**49 days and ~28 training sessions** of a deficit already diagnosed as costing him, before
it reaches maintenance.

**The step is `cur.hi − cur.lo` — the width of the rate band. That is a statement about how
tightly the rate is targeted, not about how fast to exit a costing state.** "Derived, so no
constant is authored" is technically true and practically misleading: the exit speed WAS set,
by a quantity that means something else.

It is **scale-invariant**, so the seven weeks is structural rather than incidental:

    deficit0 / step = p_lo / (p_hi − p_lo) = 0.60 / 0.10 = 6   in recomp mode, at any bodyweight

**And strength is a late signal.** Murphy & Koehler: strength survives a deficit (ES −0.31,
p = 0.28) while lean-mass gain does not (ES −0.57, p = 0.02). **By the time the lifts fall,
lean has probably been going for a while.** Seven more weeks is expensive against an objective
where lean is the scarce term and he has ~34 lb of headroom to the natural ceiling.

**Change.** Scale the step to the DEPTH of the decline, which `progressionTrend.pct` already
carries. A −3 %/session collapse should reach maintenance in ~2 weeks; a −0.3 %/session drift
can take the full walk. Still derived — but derived from the thing that actually motivates
the exit.

**Assertion.** A steeper `progressionTrend.pct` reaches `dir === "maintenance"` in **strictly
fewer** evaluations.

**CORRECTION to this entry, 2026-08-05.** An earlier version of it read as though the cap
fix shipped in v7.13.1. **It did not.** `main` at v7.13.1 carries `const lim = cap || 12`
(2519) and `_costingWeeks(s, asOf2)` with no third argument (2568); the derivation exists
only on the branch. No live harm — the cap is 12 and the walk needs 8 — but **the log being
wrong is worse than the cap being wrong, because the log is what the next round trusts.**
Fixed on branch, not yet on main: `_costingWeeks` capped at a fixed 12, so if a band ever
narrowed such that `12 × step < deficit0` the walk would strand short of maintenance —
absorbing again, at a different point. The cap now derives from the steps the walk actually
needs, and an assertion drives a near-degenerate band to termination.

### R3. The deficit rate: his record, with the band as prior

#### BUILT 2026-08-05 — one owner, and the two redlines were INVERTED, not merely inconsistent

    bodyweight            164.7 lb
    floor    0.80 lb  ->  0.82 lb   (0.5 %BW, Ruiz-Castellano 2021)
    redline  1.90 lb  ->  1.65 lb   (1.0 %BW, Garthe 2011)
    zone / escalation threshold   1.0 %BW
    redlineCrossing threshold     1.0 %BW    <- was 1.157
    his measured rate             0.72 lb/wk (0.44 %BW)

**`redlineCrossing` — the ANTICIPATORY layer — ran a threshold 16% more permissive than
`escalation`, the alarm it exists to predict.** Between 1.0 and 1.157 %BW/wk the escalation
fired while the forecast still read clear. A foresight layer that triggers after the thing it
forecasts is worse than no foresight layer. The comment claiming *"never a second band"* sat
twenty lines above the code that made one.

`SEED.rate.redline = 1.9` was authored and uncited — **deleted, not converted.** The floor
converts to a cited constant at zero visible cost: 0.5 %BW at 163 lb is 0.82 lb against the
authored 0.8. Nothing he can see moves today; it starts behaving correctly as he leans out.

**The consumer map was larger than the spec named.** `s.rate.floor`/`s.rate.redline` were
also read raw by `fiveLevers`, `theOneFix`, `whyDecompose`, four `runAdaptive` proposals and
the rulebook. **14 call sites migrated; zero raw readers remain.**

**Two dead guards found while building, and both are new instances of the standing pattern:**

- **A test that had stopped testing what it names.** `ok(!sealedRun.proposals.some(redline))`
  claimed the sealed window mutes a false redline. `daysUntil()` reads the REAL wall clock,
  not the date passed to `runAdaptive`, so `S3.blackout.until = "2026-07-27"` stopped sealing
  anything on 2026-07-27. From then until R3 it passed only because the last weekly rate
  (1.80) sat under the old authored 1.9 — nothing to do with the seal. **Both branches are
  now driven:** the seal is forward-dated so it must be observed to mute, and an expired-seal
  fixture must be observed to fire.
- **The rulebook told him the numbers were pounds and that a fix was pending.** Both sentences
  went false the moment the conversion landed, and he reads that copy. Rewritten, with an
  assertion that neither sentence can come back.

#### Before shipping — R3 is the FIRST item in this sequence that changes what Joe sees

R1 and R2 were dormant (`energyBalanceTarget` still has no callers — see R2b).
`cutRateBand.band` derives from `BC.CUT_RECOMP_PCT` via `pctToLb`, not from floor/redline, so
**`calorieTarget` is unaffected** — but the RateGauge, `redlineCrossing`, `escalation` and
`sweepStalls` all move. **Walk the gauge and the foresight line on the phone before merging.**


**Keep ~0.7 %BW/wk in `free`. Re-derive the justification.** The number is not "the recomp
constant" — it is *the rate at which his own progression stayed positive for eight weeks*, with
Ruiz-Castellano's 0.5–1.0 %BW/wk band (tilt low as he leans) and Garthe's 0.7% arm as priors. The
band moves only on a regime change — **never on a body-fat threshold, never on a date.**

Two live bugs in the same change:

- **`floor` and `redline` are still absolute pounds.** `cutRateBand` converts the band with
  `pctToLb` (2501) but reads `floor` (0.8 lb) and `redline` (1.9 lb) raw off `SEED.rate` (375) at
  2499–2500 — **verified on this branch.** They therefore represent a *larger* fraction of
  bodyweight as he leans out — **the redline gets more permissive exactly when lean tissue is most
  at risk**, the reverse of the file's own citation at 2452.
- **Two live redlines.** `bodyCompBand` returns `redlinePct: 1.0 %BW` (= 1.63 lb); `cutRateBand`
  returns `redline: 1.9 lb` (= 1.157 %BW). `escalation` uses the first; `redlineCrossing` and the
  gauge use the second. The comment at 2508–2510 claims *"ONE function owns the corridor … never a
  second number."* **There are two.**

**Assertions.** `%BW` value of `.floor` and `.redline` invariant across two states differing only
in bodyweight. `bodyCompBand(s).redlinePct === cutRateBand(s).redline / bw * 100`.

**What it does not buy.** 0.7 %BW/wk is proven *survivable with progression intact* for him — a
weaker and more honest claim than *optimal*.

### R4. No decision may fire on a body-fat estimate

#### BUILT 2026-08-06 — and one of R4's own assertions is unsatisfiable as written

Both body-fat decisions are deleted. **No live proposal condition in `runAdaptive` compares a
body-fat figure against anything**, asserted against the source with comments stripped
line-preservingly — the comments recording the deletion necessarily contain the strings being
banned, which is the trap the vacuity scan hit one file over.

| deleted | fired on | why it had to go |
|---|---|---|
| EASE 2 trigger | `bf.pct <= 13.2` | a point estimate from an instrument with a 7.6-point live interval, moving his whole calorie band |
| pivot prompt | `bf.lo <= 11.2` | fired on the INTERVAL, which was the honest version of a threshold — but still a threshold, and `bf.lo` is 10.7, so it had been firing since 2026-07-29 |

**The pivot's question now has a better owner.** *"Is the cut done?"* is what
`regime().accretionBound` answers, from lifts and scale rate measured daily rather than a
body-fat estimate anchored twice a year. R1 replaced the instrument; R4 removes the old one
rather than leaving two.

**`s.phase` is NOT deleted from state** — never delete athlete data, and the field is inert
now that its only writer is gone. The three remaining `PHASES[s.phase]` readers already guard
with `ph ? … : null`.

#### OPEN QUESTION FOR JOE — R4's assertion "bfEst unreachable from energyBalanceTarget" cannot hold

**`calorieFloor` reads `bfEst`** — `bf.lean` feeds the IOC energy-availability formula run
backwards — and `calorieTarget` calls `calorieFloor`, which `energyBalanceTarget` calls. So
the assertion is unsatisfiable without deleting the derivation.

**And it should not be deleted.** The alternative is a hardcoded floor, which `CLAUDE.md`
forbids by name: *"Never hardcode 1700."* The floor moving with his lean mass is the good
version.

**The distinction R4 actually needs**, proposed rather than assumed:

> No proposal, phase change, or **threshold crossing** may fire on `bfEst`. A **derived
> quantity** may use `bf.lean` provided it does not threshold on it, carries the interval,
> and degrades to a stated fallback when the anchor is stale.

That kills both deleted triggers and keeps the floor. **Not resolved here** — it narrows a
rule the research side wrote, so it is theirs to confirm.

**A follow-up it implies:** `calorieFloor` uses `bf.lean` as a POINT estimate and returns a
single number, from an anchor carrying ±3.5 points. Under R4's own *"render no midpoint"* it
should carry a band. Filed rather than built, because it changes a number he sees.

#### One more defect, found by an assertion rather than by reading

`energyBalanceTarget`'s gated branch **replaced** `calorieTarget`'s `why` with *"the calorie
band is gated upstream"* — a mechanism, not a reason, and it dropped the one sentence saying
what the gate is waiting for. That is the R10 abstention defect in the branch that runs when
data is thinnest. The underlying reason is carried through now and the gate fact appended.

#### TRAP — read this before starting. R4 and R2b are each correct alone and WRONG COMPOSED.

`calorieTarget`'s gated path reads the phase table directly:

    const ph = PHASES[s.phase];
    return { gated: true, from: "phase", lo: ph ? ph.band[0] : null, hi: ph ? ph.band[1] : null,
      why: "Not enough clean days to measure your own maintenance yet, so this is the phase band as authored." };

R4 as specified deletes `s.phase` along with its two body-fat triggers. **Do that naively and
`PHASES[s.phase]` is `undefined`, the gated path returns `lo: null, hi: null`, and the
fallback that exists precisely for thin data returns nothing.**

Now compose it with R2b. `energyBalanceTarget`'s FIRST branch is:

    if (cur.gated) return { ...cur, ...base, dir: "deficit", provisional: true, why: "the calorie band is gated upstream — the regime cannot override a gate" };

**After R2b that gated path is load-bearing on the single owner of the calorie decision.**
R4 would null it out through a branch R2b has just promoted. Neither item's acceptance
criteria mention the other.

**R4 must REPLACE the gated fallback before deleting `s.phase`, not after.** The replacement
has to answer the same question the phase band was answering — what to eat when there are not
yet enough clean days to measure maintenance — without reading a body-fat estimate.

**Assertion.** A thin-data state (too few logged days for `observedTDEE`) returns a usable
`lo`/`hi` from `energyBalanceTarget`, never `null`, with `s.phase` absent.

Two hardcoded thresholds in `runAdaptive` are the **only** producers of a phase or exit proposal,
both **verified at the stated lines on this branch**:

```
6238   if (!sealed && s.phase === "EASE 1" && bf.pct <= 13.2 && s.trend < 163)
6247   if (!sealed && bf.lo <= 11.2 && pivQ && !pivQ.done)
```

`bf.lo <= 11.2` is the app's entire cut-ending decision. **Uncited.**

**Change.** No proposal, gate or target may read `bfEst`. Delete both thresholds with the `s.phase`
machine they serve. **Render no midpoint** (Broad 2007). Express uncertainty **numerically, never
verbally** (van der Bles 2020).

**Assertions.** No `runAdaptive` proposal condition references `bf.pct` / `bf.lo` / `bf.hi`.
`bfEst` unreachable from `energyBalanceTarget`, `regime`, or any `propose(` call. No UI path
renders `bf.pct` without its interval.

### R5. Add a skinfold fat-change TRACKER. The DXA anchor is unchanged.

**Joe narrowed this item on 2026-08-05, and the reasoning is the point:** skinfolds measure
subcutaneous fat only. **They never observe lean mass, so they cannot narrow the fat-vs-lean
partition.** The original R5 proposed replacing the anchor; that overreached. The standing
guardrail — *"personal fat-vs-lean partitioning is a range that needs repeated DEXA"* — **is right
and is NOT amended.** `partitionPrior` still requires real DEXA anchors and
**`PARTITION_ANCHORS_TO_NARROW = 2` stays exactly as it is.**

Two instruments, two jobs. Do not let either drift into the other's role.

| instrument | job | cadence | resolution |
|---|---|---|---|
| **Skinfold Σmm** | **fat-change tracker** — direction and magnitude of fat change *between* anchors | monthly, one tester | ~0.6 BF-point detectable change |
| **DXA** | **partitioning anchor** — role unchanged; the only thing that observes lean mass | per QUEUED item 5 | 1.3–2.2 BF points, *if standardised* |

**Skinfolds are stored and displayed in millimetres and never converted to a percentage.**
Conversion adds a modelling error that destroys the precision advantage and reintroduces the point
estimate R4 removed. The sum needs **no accuracy at all** — only consistency — because the
objective is defined on change.

New synced collection `s.skinfolds = [{ d, sites, sumMm, tester, note }]`.

**Data-safety, required in the same change:** keyed-union merge, refuse-to-shrink, additive
migration. New synced state does not ship without all three.

**Assertions.** 4 entries merging with 6 yields 6, never 4. Migration adds `s.skinfolds = []` and
nothing else. **No code path converts `sumMm` to a percentage.** **`skinfolds` is unreachable from
`partitionPrior`** — the tracker may not feed the partition. `PARTITION_ANCHORS_TO_NARROW`
unchanged at 2.

**What it does not buy — and this is now the whole boundary of the item.** Skinfolds measure
subcutaneous fat, not total fat, and absolute accuracy is poor. **They say nothing about lean
mass.** Precision is **entirely conditional on the same tester** — record `tester` and **break the
trend line when it changes.** **Disqualify bioimpedance explicitly**: BIS consecutive-day LSC
3,607 g ≈ 4.9 BF points, wider than the whole range of interest. If a BIA input ever exists, it
must refuse to plot as change.

### R6. Condition maintenance on activity; stop `adaptationSignal` firing on a step drop

#### BUILT 2026-08-06 — DISPLAY-ONLY, and that was a fork rather than an omission

    observedTDEE.tdee        2795   window average over 35 days
    window-average steps    17,171   (halves 19,794 / 14,694)
    last-7 steps            14,357
    step-conditioned tdee    2705   delta -90 kcal/day

    target BEFORE            2176-2263
    target AFTER             2176-2263   <- byte-identical, and asserted

**The natural reading of "condition maintenance on activity" is to return the step-conditioned
number as the PRIMARY. R2b made `observedTDEE` load-bearing on the single owner of the calorie
decision, so that reading moves his prescribed intake ~90 kcal/day AS A SIDE EFFECT OF A
REPORTING CHANGE, with nobody having decided it should.** Same composition shape as R4's
`PHASES[s.phase]`, one item later, and again neither item's criteria mentioned the other.

So `tdee` is untouched and the conditioning is reported beside it. **An assertion pins
`calorieTarget.tdee === observedTDEE.tdee`** — a reporting change that moves the target is a
failed reporting change.

**The step-conditioned primary is probably more correct** — the window average is conditioned
on an activity level he no longer has. But it is a decision about what he eats, so it gets its
own item with its own before/after, and **R12 lands first** if it is taken: R12's trigger fires
on intent, not on whether the floor happens to bind. 267 kcal of margin is not a reason to skip
a safety item; it is the reason skipping it feels safe.

#### `adaptationSignal` — the step term is subtracted, and it abstains on activity drift

It predicted expected maintenance from **body mass only**, so observed maintenance falling
because he walks less showed up as adaptive thermogenesis. **The app would have diagnosed
metabolic adaptation for a man who stopped walking**, pointing him away from a real and fixable
behaviour.

Attribution beats estimation here: the walking cost is measured (2.4 ± 0.4 J/kg/m, Sci Rep
2019) and the step count is logged, so there is nothing to fit. It also **abstains** when the
step swing exceeds the residual being measured, and the reason names activity rather than
reading as "no adaptation found".

**REAL-DATA BRANCH, per the companion rule:** on the live ledger it returns
`detected: false, reason: "too-thin"` — it abstains EARLIER than the activity gate, so the
false-adaptation risk is **latent, not live**. The gate is driven by a fixture instead, and
that fixture is verified to reach `activity-drift` rather than passing on an earlier branch.

#### Two more escape hatches, both mine, both caught by the scanner

`reason === "activity-drift" || stepAdj !== 0` and a triple disjunct on `tdeeAtNow`. **Neither
was vacuous** — both fixtures reach the real branch — but a disjunct carried by luck is a hatch
waiting to open. Both are positive assertions now. **The scanner earned its place on the item
after the one it was written for**, which is the argument for running it pre-commit.


`adaptationSignal` predicts expected maintenance from **body mass only** — `predAt` at 2746,
**verified**, and the comment even calls it "mass-driven":

```js
const predAt = (w) => base.tdee + MAINT_KCAL_PER_LB * (w - base.w);   // no step term
```

Observed maintenance falls because he walks less; mass-predicted maintenance barely moves. **The app
will report metabolic adaptation for a man who stopped walking** — a false diagnosis pointing away
from a real, fixable behaviour. His steps trend **−649/week across 54 days**; a 5,100-step drop is
worth ~162 kcal/day.

1. Report maintenance **with its conditioning variable visible** — `maintenance @ 17,200 avg steps
   (last 35 d)`, plus a second line at the current step level. The scalar becomes a lever.
2. `adaptationSignal` subtracts the deterministic step term (`β · Δsteps`) **before** looking for
   residual adaptation, and **abstains** when step variance across the window exceeds a threshold.
3. **Steps are a diet variable, not a training variable.** Any proposal that changes steps must
   recompute energy balance in the same breath. Walking does not interfere with hypertrophy
   (Schumann 2022, SMD −0.01, p = 0.919); the risk of restoring steps is that it silently
   **deepens the deficit**.

**Assertions.** Real ledger ⇒ `adaptationSignal(s).detected === false`, reason names activity
drift. Constant steps + genuine divergence ⇒ still fires. Any `kind: "steps"` proposal carries a
non-null `deltaKcal`.

### R7. `currentRate` must not silently average across a behaviour change

#### BUILT 2026-08-06 — corrected after review. DETECTION and ATTRIBUTION are different jobs.

**I narrowed the comparator between spec and build and it silenced the flag.** The item says
*warn when the displayed rate no longer describes his current behaviour*. My rebuild compared
against what the **prescribed** intake at current steps would imply — a counterfactual he is
not living — which asks the narrower question *"would the step change alone make the target
under-deliver"* and answers no.

**And the narrowed gap was a CATEGORY ERROR.** 0.28 decomposes into 0.11 (target 2,220 vs the
2,160 window intake the regression describes) plus 0.17 (14,357 vs 17,171 steps). Both are
**deterministic differences between specified scenarios**; neither carries sampling error.
Testing their sum against the regression's ±0.38 compares a scenario delta to a sampling
interval.

**Corrected:** fire on measured vs **behaviour**-implied, then attribute.

    measured (28-read regression)   1.17 lb/wk  +/- 0.38
    behaviour-implied               0.25 lb/wk  +/- 0.03
    gap 0.92 vs combined 0.38       FLAG RAISED

    attribution, sums to the gap by construction:
      intake  0.75 lb/wk   eating 2,569 against the 2,160 the rate was measured over
      steps   0.17 lb/wk   14,357 against 17,171

**The ownership concern was real and attribution answers it without exclusion.**
`calorieTarget` owns the intake gap (`wkAvg`/`wkOff`) and a second owner would be a defect —
so each part names its owner and re-decides nothing. One flag, no duplicated ownership, firing
on the condition that is actually live: **he can read 1.17 on the gauge while behaving like
0.25.**

#### NEW PRACTICE — when a gate returns NOT-FIRED and closes an item

Record **what would have fired it**, and check the comparator was not narrowed between spec
and build. Here the spec said *behaviour-implied vs measured* and the build said
*target-implied vs measured*; **the change was only visible by reading both.** The first
version of a gate is written by whoever wants the answer — the same shape as the repair being
the least-reviewed code in the change.

### R15b ROUND 3 — S3' HIT GEOMETRY, ZERO PAINTED PIXELS

The round-2 arithmetic hadn't landed (border-box ate the slop: 59 measured, not 64+; a
5px hit fringe shared with the FAB). Re-derived with the margin+border sum held CONSTANT
per edge so paint offsets cannot move: START's slop is ALL upward (27 top / 0 bottom,
margins −26/+1 → hit 37+27=64, box bottom = paint bottom); the FAB's is all downward
(0 top / 12 bottom, bottom 56→50 → paint bottom still 62, hit 64×64, box top 6px LOWER
than round 2). Disjoint by construction: START's box cannot extend below its own paint,
the FAB's cannot extend above its own. Values pinned in FINAL87 so a refactor cannot
silently un-derive them. Suite 1878 → 1880, freeze byte-clean. STOPPED for the audit's
rect re-measure + pixel-identity diff.

### R15b ROUND 2 — CRITIQUE FIXES (S1–S3 structural, R1–R4 taken)

**S1** — "Log log the scale": theOneFix composes a verb onto an owed title already carrying
it — ENGINE copy, frozen, so the surface collapses a doubled LEADING word as a class
(driven), and the engine-side copy fix is filed for the next engine window. Found under S1:
the earlier heredoc had turned the deficit-translation's word boundaries into literal
BACKSPACE BYTES (the incident-log class, third occurrence) — the regex was dead while every
test stayed green because the plain-string first replace carried the live case. Rebuilt by
line surgery, zero BS bytes verified, and BOTH the collapse and the bare-"deficit" boundary
now have drives so a dead guard cannot hide again.

**S2** — the FAB drops to the clear air above the rail (bottom 56+inset) and the column
gains 72px bottom clearance: START never shares pixels with it, the last block scrolls
past. **S3** — the 64px law is met by HIT AREA (transparent-border slop: FAB 52-visual/
64-hit, START 44-visual/64-hit), and the resolution is written into the tokens comment.

**R1** dash sized to the numerals (32px, weight 300, optically centered). **R2** WHERE
YOU'RE HEADED is one left-anchored column. **R3** the abstention marker is ◇, the app's
own vocabulary. **R4** DECIDED AND WRITTEN INTO THE TOKENS: Barlow Condensed 600/700 owns
the status word and card sub-heads; Plex Mono owns data (numbers, overline labels); Barlow
owns prose. Applied to status word, move title, workout title.

Suite 1876 → 1878, freeze byte-clean. STOPPED for round-2 re-screenshots.

### R15b — NOW, THE FIVE-BLOCK ANSWER — BUILT 2026-08-07, branch feat/r15b-now

**NOW is the mockup's screen 1 with live engine values, and the budget is a LAW.** Exactly
five `data-now` blocks — status → EAT TODAY → TODAY'S MOVE → NEXT WORKOUT → WHERE YOU'RE
HEADED — asserted at source AND counted in the live DOM by the render smoke. `nowModel`
is a memoized FORMATTER (statusFace, energyBalanceTarget, proteinTarget, theOneFix,
cutRateBand, currentRate, paceProjection, bfEst, genSession, structuralMovesThisWeek —
rearranged, never re-derived; the engine-freeze gate stayed byte-clean through the whole
slice). On the live ledger it reproduces the mockup almost verbatim: ON COURSE ◆, the
learning box ("0 of the 4 lifts... It never guesses"), 2221–2308 KCAL · FIRST ESTIMATE,
"about 4 weeks to ~158 (could land 157–160)", "best guess 14%, honestly 11–18".

**TODAY'S MOVE picks ONE thing:** unanswered decisions (tap → the briefing room) →
theOneFix's ladder → the rate story (the BandStrip: zones soft, rules hard, whisker,
marker — built ONCE) → the designed quiet line. All five driven; at most ONE coach box
(learning beats the one-variable wait, driven on a both-conditions fixture). The one
jargon leak found by the scan — "deficit" in ladder copy — is translated AT the surface
(`_plain9`), engine copy untouched one tap down. Word-boundary jargon scan (provisional /
regime / RIR / redline / corridor / deficit) clean across the live model and every
driven variant.

**The classic NOW is THE BRIEFING ROOM behind LEDGER — moved, never stranded.** Full
capture, the doors, the inbox, every decision card: two taps. The rail badge (decisions
count) moved to LEDGER. The + on NOW logs weight in one tap (the log that feeds
everything); everything else is one tap further. Render smoke walks the new path (door
keys, seeded inbox, steppush label pin all re-anchored there; the room-finder is
role-scoped after the ancestor-match trap bit once).

**Suite 1849 → 1876.** Screenshots remain the audit's rung (headless here) — critique
round 1 runs on the branch preview.

### R15a — TOKENS + SHELL — BUILT 2026-08-07, branch feat/r15a-shell (redesign brief v4)

**NUMBERING:** R15 now names the complete UI redesign (Joe's approved sequence). The parked
analyst-suggestion-surface item formerly called R15 is REFILED AS R16 — still parked.

**THE ENGINE IS FROZEN — and the freeze has teeth.** New gate check (the 11th):
`tools/engine-diff.mjs` bundles `tools/_engine-surface.jsx`, which prints a canonical
JSON roster of every load-bearing engine output on BOTH frozen snapshots (17 state-level
functions + 5 per-lift functions × 15 lifts + runAdaptive's proposals/feed head), and
byte-compares against the committed `tools/engine-baseline.json` (85KB, generated at
v7.19.0's engine). **Fire-proofed at birth**: a one-token engine copy mutation → exit 1
naming the diverging lines; restore → clean. First mutation attempt taught the honest
limit: a DORMANT branch's constant (STEP_PUSH_ABS_CEIL on a HOLD day) does not surface —
snapshot freezing pins what the frozen states EXERCISE; dormant branches stay guarded by
the suite's fixture drives. Stated in the driver comment, not hidden. `--write`
regenerates, only ever alongside intended engine work — a UI slice never writes it.

**The rail is NOW · TRAIN · LEDGER.** MORE renamed LEDGER everywhere (route, actives,
back-link, aria, swipe order untouched); the room list (LAB · QUEUE · SLEEP · BODY) is
unchanged and every pre-existing surface stays reachable in ≤2 taps — render-smoke walks
LEDGER→each room in jsdom, dom-smoke asserts the rail, and the live DOM was read on a
served build. No content redesign — R15b–f own that, slice by slice.

**DT — the design tokens, one source of truth** (census'd in FINAL83): the mockup palette
with the two species laws carried as comments AND assertions (red = redline only,
decision-blue = DECISION cards only), the 9-step type ramp, the tracking table, the 4px
spacing scale, the geometric glyph set, the 64px touch floor. Slices style FROM here;
R15f asserts no orphan ad-hoc styles remain.

**Screenshots:** the session is headless (browser pane cannot composite), so the critique
round runs on REAL pixels instead: the branch CI publishes a Netlify draft URL — critique
there, on a real device, which is strictly better than emulator PNGs.
### THE OPENER ASK RETURNS — BUILT 2026-08-07, branch feat/opener-ask (rider, stacked on owner-call)

**The v7.12.0 orphan, repaired at its root.** Timing was the right half (asked at the set,
error collapses); REMOVING the opener instead of re-timing it was the wrong half — in
production every entry carried rir:null, rows' holdFlag froze TRUE at rirHist [0,0] (the
release branch needs en.rir >= 1, unreachable), and the analyst blamed the blank the
system created. `phaseAfterSet` now routes set 1 → the opener ask (same instant-capture
pattern as the terminal ask, rest clock already running so the tap costs zero session
time), middle sets → rest, last set → terminal (untouched); single-set lifts ask the
terminal only. One tap, skippable, null never fabricated. A HELD lift's ask names its
stake ("HELD — an honest ≥1 here releases the load").

**Driven end to end from the gym path** (gymEntries → completeSession, never hand-built),
on the real frozen ledger: the honest 180×9,8 WITH opener 1 → HOLD RELEASED, holdFlag
false, rirHist breathing again ([0,0,1]); unrated → stuck, the production failure
reproduced. **The deepest harm found while driving:** a top-of-window GRIND unrated was
being BANKED AS AN EARN ("185 EARNED" off an opener-0 grind) — the blind engine promoted
grinds to load jumps; with the opener captured it is refused ("TOP OF WINDOW, BUT HOT").
Both directions asserted.

**MEASURE WON over one rider claim, flagged:** the real 8/6 press replays IDENTICALLY
rated and unrated — its bank was never opener-gated (8 < hi 9 never tops the window; the
record's banks-now/pending line is a 2SE question, not an RIR one). Asserted so the claim
cannot drift into lore; the grind-earn above is the true mechanism.

**Copy-mechanism agreement:** the dictionary's "Rate two sets" is now delivered by the
flow, asserted. Eat band + regime byte-identical (flow + input change, no formula change).
Suite 1832 → 1845. RIR_TIMING comment rewritten to the re-timed truth.

### OWNER'S CALL — RAISE ALL THREE — BUILT 2026-08-07, branch feat/owner-call-volume (rider)

**Joe overrode the closed gates, on the record.** He was shown the allocation, the closed
gates (recovery WATCH, detector 0/4, sleep debt, rate above corridor top) and the
junk-volume risk of three simultaneous experiments — and chose speed. The owner decides;
the app measures. A one-time producer PRE-FILES three cards in the standard volpush
family: hams (Ham curl 2→3/session, 4→6 weekly — floor correction), chest (Press
3→4/session, 6→8 weekly — compound; the copy names the triceps+front-delt spillover and
its budget charge), rear delt (3→4 per side, 6→8 weekly — unilateral, ~4–5 min priced
honestly). All copy carries the owner framing, the caveat, the measurement promise, and
the grade. Once-only guard = the proposals/adjustments record itself (no flag; merge-safe
by the proposals union — driven ×2 reruns, next-week, and BOTH merge orders → 3 cards, no
dupes, forever).

**Engine edge closed en route:** `targetsFor`'s std/reclaim branches returned the
authored arrays verbatim — a set-count change would have silently shrunk the session (the
press own-hold at 4 sets produced 3 targets). Now padded/truncated to `ex.sets` by the
anchor path's own rule; proven IDENTITY on every current lift (every live std/reclaim
already matches its count — asserted so this stays a future-only change).

**Driven (+24, suite 1832):** cards file exactly once (all four ways); each tap raises the
right lift stamped with exact exUndo + receipts; post-approval designed allocation hams 6 /
chest 8 / delts_rear 8 / triceps 10 / delts_front 4 with every other bucket pinned
UNCHANGED (quads/calves/abs "under" reads are logged-vs-designed artifacts — asserted so
nobody fixes them later); combined week = 3 moves + spillover = five muscles on the budget,
stepPush WITHHELD/budget; three parallel READING states coexist; rollback/undo isolation
(reversing ham never touches press); press [8,8,8,6]-shape sanity + rirPlan 2·1·1·0 on
press/rearDelt specifically; declined owner card never refiles (once EVER — the earned
producer is the only path back and must re-earn the gates).

**Snapshot outcome updated by design:** the live S7 sweep now files exactly the three
owner cards (earned producer still abstains, regime unknown; zero rollbacks).

**R15a note:** parked on its branch during this rider; rebases on the new main and
REGENERATES tools/engine-baseline.json (the freeze baselines AFTER this ships).
measured-redesign-mockups.html has landed in the repo folder — commits with the R15a
rebase.

### VOLUME AS AN EARNED LEVER — BUILT 2026-08-07, branch feat/volume-lever (spec v5)

**The heaviest engine item. Suite 1757 → 1808 (+51 driven assertions), MIN_ASSERTIONS
raised 1300 → 1750, census 26→27 wing / 55→56 filed. Every A–G integration-audit item
landed; the severed-feedback-loop test runs FIRST in the new block.**

**AUDIT A — the loop is severed at the source, ONE owner.** `liftTrend` now cuts its
series at the last set-count change, read from the LOGGED `reps.length` — a fresh window
per change, the `typicalError` same-shape discipline arriving at the trend layer.
Conversion check, regime, stall pooling all inherit it. Driven both levels: a lift that
gains a set and merely carries it reads ~0 on the fresh window while the in-test
counterfactual OLS manufactures **+3.2%/session** from the same data; pooled, four
honestly-falling lifts + one stepped lift stay `falling`/`costing` — costing →
fake-rising → free is dead. Reading the LOG makes it **author-blind by construction**
(AUDIT F: engine, user-called, and undo changes all land as a count change) and immune to
`_stateAsOf`'s config-blindness. Measured on the real ledger: zero reps.length blips ever
— the cut is a proven no-op on all live data (eat band byte-identical, snapshot-pinned).

**The gate reads the REGIME, not the exitStart flag.** `volumeImbalance`'s
`cutting = !exitStart` (plus its chip twin) is gone: `growthOK = regime free && confirmed`,
through energyBalanceTarget's memo. unknown ABSTAINS (the live state), costing/
accretionBound keep the retention framing with the regime named, and writing exitStart
alone now opens **nothing** — driven. All four reader surfaces (why copy, analyst prompt,
TRAIN card, TRAIN chip) moved in lockstep; Roth 2023 / Bickel 2011 stay cited in every
abstain branch.

**volumePush — earned, zone-scaled, placed, ceilinged.** PUSH only on: free confirmed +
pooled progression RISING + recovery GREEN + clean sleep + clear weekly budget + a readable
target. Chooser: lowest allocation first; direct numeric-load lifts only (AUDIT C:
trend-blind lifts refused with the reason named); holdFlag, open read windows, and
spillover-touched muscles skipped. Zone-scaled: below-floor corrects decisively (hams
2→3/session = 4→6 weekly = the floor in ONE move); in-zone +1/session; absolute ceiling
**VOL_PUSH_CEIL_WK = VOL_BANDS.ceil (16 weekly)** — derived, not invented — and driven to
fire. Card: monday-stamped rid `volpush_<mg>_<monday>`, kind:"sets" with a real apply
branch (the v7.3.1 "sets" dial finally has an enactor — the refeed_review shape closed),
both units in the copy (per-session AND weekly), exercise named, minutes priced,
MODERATE-TO-LOW grade with the §2.3 gap stated in the card. Decline buys the week,
rid-keyed DECLINE_BUYS sentence. The volstruct note is retired — superseded by the card.

**volumeConversion — the honesty half, and it cannot self-confirm.** Post-change fresh
window (liftTrend's own min-n = the read window, derived) + the final-set RIR reports as
effort compliance. Verdicts driven all three ways: NOT_CONVERTED (flat on fresh window,
effort delivered), UNDELIVERED (terminal RIR 3s — "the dose never arrived", volume not
convicted), CONVERTED (rising + delivered). Rollback = NOT_CONVERTED + fatigue up → a
receipt-carrying proposal (date added, measured non-result, CI), tap removes exactly the
added sets, one-tap undo restores them. New Lab card `volconv` reads the same instrument
the producer gates on — one owner, the stepeff discipline.

**One-variable-per-week — ONE owner, both directions.** `structuralMovesThisWeek` reads
what LANDED (steer rows, sets rows, agent-lane feed titles). A same-week cal or steps move
withholds volumePush; a same-week sets move withholds stepPush (driven both ways). Compound
spillover charges every lent-into muscle (AUDIT B: press → chest+triceps+front delts).
Muscles stay parallel channels: same-week push to a DIFFERENT muscle is permitted and
driven.

**AUDIT G — sets survives the merge.** `ex.sets` rode the wholesale per-lift merge keyed
on lastMeta.d, so a stale-count device that merely TRAINED the lift later resurrected the
old count — a live defect, now closed: `setsAt` field stamp (plan.setAt discipline at
field grain), stamped beats unstamped, newer wins, every mutator stamps (apply, undo, agent
lane, hack debut). No schema patch — the `pace` precedent. Driven both orders + stale
resurrection + newer-stamp revert + unstamped-vs-unstamped.

**Spec corrections found by recon (measure wins):** the gate line was 7102 not ~6965;
recovery bands are GREEN/WATCH/LOW (no "OK"); and the spec's "rirEnd is read by NO
decision" is false — `progressStep` sizes the rep step off the last rirSets slot (load
decisions are opener-only; the claim was true only for those).

### STEPPUSH SURFACE FIX — BUILT 2026-08-07, branch fix/steppush-surface (audit round on v7.18.0)

**Two user-facing defects, ONE root cause: steppush was the first kind:"cal" card born
without explicit calDelta, and the items builder hardcoded the primary via to "cal" for
every engine card.**

1. **The card's promise and the primary tap were INVERTED.** Copy: "steps are offered
   first." Primary tap: the food cut. The athlete who did what the card said got the thing
   it called the alternative. Fix: the producer arms `prefer: "steps"` and the builder
   SWAPS the routes for a prefer:steps card — primary is the walk ("Add the steps —
   +1,000/day"), alt is "Cut it from food instead (−23 kcal)". Same applyProposal, same
   via param, same one-tap undo — no new machinery.
2. **"Ease the band" on a tightening tap.** approveLabel keyed on raw `apply.calDelta`;
   steppush armed only `delta`, so `undefined < 0` → false → Ease. Fix kills the CLASS:
   the producer now arms calDelta explicitly, and the label derives its sign from
   `proposalEffect(p).calDelta` — the one owner of the signed effect — never from the raw
   apply.

**Riders, same round:**
- **A decline now buys the WEEK.** propose() blocks only APPLIED rids, so a dismissed
  steppush refiled on the next engine pass — "a no for today" bought zero minutes, against
  the producer's own no-nagging comment. The producer now skips filing while THIS monday's
  rid has a dismissed adjustments row; the monday rolls the rid, so a still-slow rate
  re-asks next week. Companion: the decline feed copy is keyed on the steppush rid and says
  exactly that ("quiet before Monday") — R14's copy-and-mechanism-agree rule applied to the
  mechanism the rider changed.
- **HOLD copy no longer claims "inside the corridor" unconditionally** — live today the
  rate is ABOVE the top, a different fact. Branches on pctRate vs corrPct; dead surface
  until R15 reads it, fixed before it can mislead.
- **stepEfficacy: resolved requires den > 0** — a zero-variance fit can never deliver a
  RESOLVED null verdict. Unreachable through state (ROLLUPS history has real variance);
  explicit anyway, source-pinned honestly rather than fake-driven.

**Tests drive the TAP, not just the card's birth (+13 assertions, 1757 total):** primary
route on the driven card → feed "STEP TARGET RAISED" with a via:"steps" adjustments row;
alt route → "TARGET TIGHTENED" by exactly the quoted kcal; apply fully armed (calDelta ===
−(net mid), prefer steps); decline → same-week re-run files nothing, next-monday re-run
files steppush_2026-07-27; live-snapshot HOLD copy says ABOVE. **The label is pinned at the
render layer**: render-smoke mounts the real app with the real producer's card shape and
reads the actual buttons — and the pin was FIRE-PROOFED by mutation (wrong expectation →
exit 1, restored → green).

### STEPS ITEM B — BUILT 2026-08-07: steps as the first deficit lever

**Q3 ANSWERED — the ceiling is THREE things, and building it found out why two are not
enough:**

1. **VETO** — recovery LOW or sleep debt today: the body is not funding what it already
   does, so it is not asked to fund more. Driven: a 4-hour-nights fixture withholds.
2. **TRAILING CAP** — measured baseline + 3,000, floored at the practitioner 12k. This
   PACES the climb — but it cannot terminate it, because **an approved steer reconciles at
   the next weigh-in by design, so pushes persist through BEHAVIOUR, and a trailing cap
   slides up with the behaviour it permitted.** Found by driving the fixture, not by reading.
3. **ABSOLUTE CEILING — 20,000**, the component that terminates. Design judgement,
   labelled: his own history peaked ~20–21k in the window whose second half showed the
   compensation-era drift, and ~640 kcal/day of walking approaches the high-volume region
   where constrained-expenditure decay and the concurrent-training duration caveat both
   bite. Driven: the whole record walked to 19,800 → cap binds at 20,000, next +500 refused,
   further deficit routed to food.

**HOLD is the default and the live state.** `stepPush` fires only when the rate is under
the corridor; his 0.72 %BW/wk is inside it → mode HOLD, no card filed, snapshot-asserted.
No always-on nagging.

**The PUSH card arms BOTH levers through the existing machinery** (`kind: "cal"` with
`stepsDelta`), so approval lands as the tracked one-tap-undo offset and the athlete picks —
steps offered first, food as the alternative, +500–1,000/wk, **priced net of compensation as
a band** (70–75% of gross), grade carried in the copy.

**`stepEfficacy` extracted from the lab so the gate and the card read ONE slope — and the
extraction unmasked a live absurdity.** The inline version's `toFixed(2)` on a per-STEP
slope rounded every real signal to 0.00. In real units his n=4 fit reads **−78.9 lb/wk per
1k steps against a walking-physics ceiling of 0.059** — thirteen hundred times what walking
can move. That is calorie confounding wearing a step costume, and the old display bug had
been hiding it. The instrument now carries a **physical-bound resolution gate** (the
`observedTDEE.impossible` precedent): out-of-bounds fits are **UNRESOLVED**, not verdicts —
they neither block the push (degrades to MODERATE grade) nor license confidence, and the lab
copy says why instead of printing the absurd number.

**stepeff verdict gate, driven all three ways:** RESOLVED-negative → NOPUSH, copy names
steps as cardiovascular health and calories as the fat lever; UNRESOLVED (his live state) →
push permitted at MODERATE with the hedge; RESOLVED-positive cites his own week-pairs.

### STEPS ITEM A — BUILT 2026-08-07 (supersedes the held R13, per the steps spec)

**Open question 1, answered the audit's way, and the data decided it.** The measured 35-day
figure stays the headline; `tdeeAtNow` is promoted ONLY when even the smallest net reading of
the drift (70% of gross) clears the measured number's own band halfwidth. On the live ledger:
gross −115, net −80…−86, halfwidth **185** — **not promoted.** The step story changes; the
number he eats to does not. A projection must carry more uncertainty than a measurement, never
quietly replace it inside its own noise.

**Open question 2: the BAND, as the audit preferred.** `tdeeAtNowNet` (70% of gross) to
`tdeeAtNowGross`, with `tdeeAtNowMid` (72.5%) as the promoted point. `STEP_COMP_LO/HI =
0.25/0.30`, cited to Careau et al. at the lean end, GRADE MODERATE-HIGH carried in the copy.

**The window mismatch was a live overclaim, not a tidy-up.** `stepTarget`'s receipt claimed
*"your maintenance was measured across [21-day window] averaging [14.5k]"* — it was measured
over the rate-matched window at ~16.8k. The copy asserted the identity the mismatch broke
(R10a family). `observedTDEE` now owns the measured-at figure; `stepTarget` quotes it and
names its own 21-day band as RECENT behaviour — two numbers, two names, no conflation.

**One kcal-per-step owner.** `EA_KCAL_PER_1K_STEPS_PER_KG` now derives from
`WALK_J_PER_KG_M × STEP_LEN_M` (0.430) instead of an authored 0.4 sitting 7.6% away — the
cited constant wins. **Measured side-effect, reported:** `ea.lo` 27.2 → 26.8 (steps price
higher, so more walking kcal is subtracted); still above `EA_SPARING` 25, no band change.

**Acceptance, all driven** (snapshot `2026-08-07-ledger.json` committed, 98 KB):
- Snapshot: primary == measured, unpromoted; eat band **byte-identical** at 2221–2308;
  one measured-at owner; a thousand steps worth the same kcal everywhere.
- Fixture (a): current == window steps → `tdeeAtNow == tdee`, delta 0, no promotion.
- Fixture (b): a collapse clearing the halfwidth at the smallest net reading → promoted, and
  the eat band moves by **at most the net delta** (the thermodynamic bound).
- Fixture (c): a real-but-small drift → unpromoted, eat band moves **not at all** — the
  no-precision-theatre guard observed to hold on a fixture built to trip it.
- No device-calorie ingestion, asserted against comment-stripped source.
- No new stored field — pure selectors over `dailyLogs.steps`.

**Fixture lesson recorded:** the last-7 days sit INSIDE the measurement window, so writing
them moves `atSteps` too — the first fixtures assumed independence and asserted against
pre-mutation numbers. Both windows are controlled explicitly now.

### R13-old (held) — superseded by the above; kept for the hold reasoning
  `[HELD — evidence gate not met]`

**WHAT.** `observedTDEE` returns maintenance at his CURRENT activity level rather than the
window average, and `energyBalanceTarget` divides from that.

**WHY.** The window-average number is conditioned on 17,171 steps and he now walks 14,357.
Every calorie decision divides from a maintenance he no longer has.

**COST.** −90 kcal/day today, ~−175 in four weeks at the current step trend of −649/wk.
**THIS IS A CHANGE TO WHAT HE EATS, NOT A FIX.** Before/after in the build report, and a phone
walk before merge.

**TRIGGER — R12 LANDS FIRST.** R12's trigger fires on intent ("before anything that can deepen
the deficit"), and this deepens it. The 267 kcal of margin to the protective floor is not a
reason to skip it: **the margin shrinks with the same step trend that motivates this item.**

**EVIDENCE GATE — MET, AND THE ITEM STAYS HELD FOR A BETTER REASON.** On the corrected
comparator the flag DOES fire (0.92 against 0.38). So the premise is no longer unproven — it
is **measured, and it is the small term.**

    intake   0.75 lb/wk   ~4x the step effect, already owned and already reported
    steps    0.17 lb/wk   what this item would address

**A ~90 kcal/day change to what he eats is not the highest-value move when 349 kcal/day of the
same gap is adherence with an owner that already reports it.** Held on value, not on evidence.
That is a stronger reason than the one it replaces, and it does not expire when the data
thickens.

**OPEN — do not pick now.** Whether "current activity" means the last 7 days, a smoothed level,
or something that degrades when steps are themselves noisy. R7's output will say which has
signal. The item is currently a guess about a coefficient; R7 turns it into a measurement.


Report the long window as primary, **plus an explicit divergence flag** when the behaviour-implied
rate and the measured rate disagree by more than their combined error. **Do not switch estimators
mid-cut** — a discontinuity in the control input is itself a failure mode. Long-term fix is a
change-point or exponentially-weighted estimator.

`currentRate` was independently recomputed by hand and **is correct** (1.166 lb/wk, ciOls ±0.356).
Ten readings cannot establish a rate change: testing 0.42 against 1.17 gives **p ≈ 0.15**, and the
window contains a documented refeed and a wedding.

**Assertions.** Real ledger ⇒ divergence flag raised. Constant-behaviour fixture ⇒ not raised.
Primary displayed rate does not change estimator between consecutive days on the same data.

**What it does not buy.** A divergence flag is a prompt to look. It must not drive a calorie change
on its own.

### R8. Training: delete, do not build

#### BUILT 2026-08-06 — and there was almost nothing to delete, which is the finding

**`VOL_BANDS` is one plain constant read identically everywhere, and `programmeVolume` reads
the SPLIT, not the energy state.** There is no deficit-calibrated variant to remove because
none was ever built. The claim lived entirely in copy — which is R10's worked example, so the
two items do not overlap.

**Asserted as BEHAVIOUR, not as string absence.** Deletions are where the absence-check trap
lives and I have walked into it three times (`percentage`, `bf.pct`, `change`). So the test
builds two states differing only in what would drive an energy-state branch — one cutting, one
gaining at `plan.phase = "leangain"` — and asserts the set prescription is **byte-identical**.
Same for the lift target, because zero studies have manipulated RIR under restriction and so
there is nothing to condition on.

#### THE ONE DEFICIT-CONDITIONAL LINE IS DELIBERATE AND STAYS

    volumeImbalance:  actionable = detectable && !cutting

**R8 says "delete any deficit-conditional volume logic." Applied literally that deletes this,
and it should not be** — `CLAUDE.md` mandates it in as many words: *"during a deficit it is
deliberately filed, never proposed."*

The distinction is the one R4 needed:

- **Conditioning the BAND on energy state** — wrong, and never built.
- **Conditioning whether a PROPOSAL FIRES** — a conservatism gate, deliberate and documented.

Measured on the snapshot: `cutting true, detectable true, actionable false`. **The gap is
still DETECTED while filed**, which is the difference between conservatism and blindness, and
that is asserted too.

**Second time an R-item's deletion instruction has collided with a documented design.** Both
times the resolution had the same shape: **separate what a number MEANS from what a number is
allowed to DO.** Named here rather than rediscovered a third time.


| variable | rule | basis |
|---|---|---|
| weekly sets/muscle | **10–16 fractional, unchanged by energy state** | Roth 2022 (n=38) null; Nait-Yahia 2026 (n=16, 40% CR) null on FFM |
| set counting | **fractional: direct 1.0, indirect 0.5** | Pelland 2025's own best-fitting quantification |
| terminal RIR | **0–2, never modulated by energy state** | **Zero studies have ever manipulated RIR under restriction** |
| frequency | **4×/wk fixed** | Pelland 2025 β crosses zero |
| load / reps | **6–15, chosen for joint comfort and rep-count stability** | Schoenfeld 2017 ES 0.03 |
| machines vs free | **leave alone** | Haugen 2023 SMD −0.055 |
| deloads | **none scheduled, none autoregulated** | Coleman 2024 — strength-negative |

**Delete** the `"deficit-calibrated"` comment on `VOL_BANDS` (3896) and any deficit-conditional
volume logic.

**The reason for holding volume constant is stronger than "volume doesn't matter."** Nait-Yahia
found higher volume **improves strength without improving FFM** under severe restriction. Since R1's
regime detector reads strength as its accretion proxy, **raising volume would manufacture the signal
it measures** — strength rises, the detector reads `free`, lean is lost silently. Volume must be
constant for the instrument to be valid, and **any volume change must invalidate
`progressionTrend` for a stated washout.** That is a hard requirement, not a preference.

**Change gate.** No more than ±2 sets per muscle per 4 weeks, only on a ≥4-week trend. A 2-set
change is worth ~0.48% predicted growth against a **2.05%** smallest detectable effect.

**What it does not buy.** Both deficit-volume trials are small (n=38, n=16) and short (7 and 4
weeks) and neither used a lean population at a shallow deficit — exactly his situation. **"No
evidence to change it" is the honest basis, not "evidence that it doesn't matter."**

### R9. The approval inbox must drain

#### BUILT 2026-08-06 — and the brief's counts were from a stale snapshot, which is the trap
#### we named for each other two rounds ago

**Live ledger at build time: 2 open, 14 resolved** — not the briefed 10/6. Joe drained the
queue again. **The structural findings survive the stale counts**, and one is sharper than
either framing:

**THE ORPHANED PIVOT CARD WAS A LIVE HAZARD.** R4 deleted its producer, but the instance
persisted open in state with a **live `kind: "exit"` apply branch** — tapping it would have
stepped calories to maintenance on the authority of the body-fat threshold R4 judged unable to
make that claim. A card recommending a decision the engine has already disowned.

Three mechanisms, each driven:

- **Supersede through date suffixes.** `propose()` already deduped on the exact `rid` — but
  half the producers suffix theirs with the date (`ap_tighten_2026-08-02` vs `_08-03`), so the
  same subject filed fresh daily and the dedup never saw it. One open card per SUBJECT now;
  the old card is resolved as superseded, with a feed line.
- **Withdraw orphans.** Any open card whose apply kind is `exit`/`phase` — both producers
  deleted by R4 — is withdrawn on the next engine run, following the SET-REALLOCATION
  precedent: resolved with a feed line naming why, **never deleted**. Snapshot-asserted: the
  pivot is withdrawn and the feed records it.
- **Notes expire at 14 days; actionable kinds NEVER expire.** A note changes nothing when
  tapped, so an old one is pure attention cost — the `refeed_review` defect as a standing
  condition. A `cal`/`exit` card is a pending decision, and decisions wait for him: expiring
  those would be the engine deciding by timeout.

#### AUDIT ROUND (2026-08-06): one defect confirmed and fixed, one audit claim corrected

**The dismissed-rearm contradiction was real and is fixed.** `dismissProposal` files
`{rid, dismissed: true}` and promises *"the engine re-arms it if the pattern holds"* — but
`applied()` counted ANY adjustments row, so one decline silenced a rid forever. The audit's
two-timestamp failing case verified: microload (dismissed row) froze at 2026-08-04 while
pivot (no row) refreshed to 2026-08-06, same producer loop. **A decline that can never return
is a verdict, just a quiet one.** `applied()` now excludes `dismissed` and `undone` rows;
driven both ways — a dismissed rid re-arms, a genuinely applied one still does not.

**Withdraw is asserted not to execute the apply** (audit 4b): withdrawing the orphaned exit
card leaves `plan.phase` untouched and stamps no `exitStart`.

**Audit correction: all 30 branches ARE on origin** — `ls-remote` shows every `feat/r*` head.
What is true is that nothing is MERGED, so deployed v7.15.0 still has the armed exit card and
the live bf-threshold producer. The distinction matters because the remedy is one merge, not
seven pushes.

#### SECOND AUDIT ROUND (2026-08-06) — three findings, two fixed, one deferred BY DESIGN

- **Instance 17, in my own supersede test.** The if/else had an `ok(true)` else-arm, and the
  else-arm is the arm that ran — on my SEED and on the auditor's. The suite was green with
  the mechanism never exercised. Now driven through the FLOOR producer, which fires
  deterministically on the fixture, and asserted unconditionally. The scanner flags the
  literal `ok(true` from here on.
- **The withdraw was a KIND-ban wearing a migration's clothes.** Predicate was
  `kind === "exit" || "phase"` forever, justified as "producer deleted" — coextensive today,
  wrong the day the regime detector files its own deliberate exit proposal, which is its
  natural end state. Predicates on the orphaned SUBJECTS by name now (`pivot`, `ease2`).
- **Expiry cannot drain a live-condition note** — verified by the auditor by execution: an
  aged microload expires and its producer re-raises a fresh card in the SAME sweep. Net drain
  zero, plus a false feed line every 14 days. **Deferred on purpose: it dies with R14**, and
  it is now the sharpest argument for R14's priority.

**MERGE-DAY EXPECTATION, for Joe:** with dismissed no longer meaning applied, the first sweep
re-arms volband (declined twice) and recovery (declined once) — **the open inbox lands at 3
note cards, two of which he explicitly declined.** That is the dismiss copy's literal promise
kept; that it feels like whack-a-mole is R14's problem to solve, not a cooldown's.

### R14. Informational cards leave the inbox

#### AUDIT ROUND (2026-08-06): "one choke point" was FALSE — two birth sites bypassed it

**The audit drove a failing case through the niggle producer**: `completeSession` pushed a
`kind: "note"` card straight into `s.proposals` — reachable in production the first time a
joint hits 3 flags in 3 weeks. And `phaseProposal`'s floor-hold returned a note that
`armProposal` pushed verbatim from the UI side. **"Enforced at the one place cards are born"
was a claim about a place that was not one.**

Both routed through the same note→feed rule at their own birth sites — `armProposal` gets
the full choke rather than a producer patch, so **the third bypass neither side has found yet
hits the same wall**. The audit's niggle fixture is committed as the driver, and the **GLOBAL
admission assert** from the original spec is in: after the fixture, no unresolved proposal
anywhere carries `apply.kind === "note"`.

**The ladder decline promise was false and is fixed**: `sweepLadders` never re-files a rid at
any status (deliberate, commented), but a declined ladder fell to the default "re-arms if the
pattern holds". `DECLINE_BUYS.ladder` now states what a decline actually buys — filed once
per lift, declining closes it — asserted like the exit entry.

**Stand-down race, tightened per the audit**: the WINNING path's own feed line must exist,
tied to its `resolvedHow` — not merely some line from either path.

### R15. The analyst suggestion surface `[named by audit — not started]`

`applySuggestion` still defaults `sug.apply` to `{kind: "note"}` (~7578) — the analyst
NOW-card surface is a second inbox where approving a no-apply suggestion enacts nothing. The
R14 charter question applies to it whole: **a card may exist only if its tap enacts.**

#### BUILT 2026-08-06 — at the choke point, so all ~8 producers converted in one place

**The invariant is enforced where cards are born.** `propose()` routes `kind: "note"` to a
feed line and returns — no producer was touched, and no future producer can seat a note in
the inbox. Deduped against the feed itself (same title within 14 days), statelessly: a
persisting condition informs once a fortnight instead of once a sweep, and there is no new
synced field for the merge to learn.

**The two live cards migrate through the withdraw pattern** — resolved
`"converted to feed (R14)"` with a feed line carrying their content. Nothing deleted, nothing
he was told is lost.

**The note-expiry code is DELETED in the same change** (instance-19 avoidance), and the audit
already proved it could never drain a live-condition note anyway.

**What a decline buys, stated per kind** in `DECLINE_BUYS` at the decline site: `cal` re-arms
while the pattern holds (true since the `applied()` fix); `refeed` is a one-off; `exit`
explicitly does NOT promise re-arming, because its producers are gone and a promise nothing
keeps is the defect this item exists to close. Asserted from the map.

**Snapshot outcome, real ledger:** zero open note cards after one sweep; microload converted
with its content in the feed ("PLATES TOO COARSE"); the badge count now means
**decisions waiting**, which today is none — that is the feature.

**Ten downstream tests rewrote against the invariant** — floor, recovery ×3, volband ×2,
volstruct, the lifecycle test (moved to the actionable redline card), the dismissed-rearm
proof (same), and the rate-unit stand-down (either sweep may reach it first). Each rewrite
kept the original claim where the claim survived the surface change, and said so where it
did not.
 `[decided by research side, not yet built]`

**The invariant: a card may exist in the inbox only if its tap enacts a state change.**
Everything else is a feed line. Four harms, all live on deployed main: a tapped note falls
through to the else branch and writes "ADJUSTMENT LOGGED" for an adjustment that never
happened; the tap pushes `{rid}` into `s.adjustments`, permanently killing bare-rid channels
(pre-fix); his inbox today is two cards where one tap ends the cut and the other does nothing
— identical gesture, opposite stakes; and the ladder branch already states the rule.
Migration: note producers become feed lines; the open microload card goes through the
withdraw mechanism; **design input from audit round 2: state, PER KIND, what a decline BUYS** — a week's quiet,
a changed-condition trigger, or a fresh decision daily — so copy and mechanism agree from
birth this time; admission assert that no proposal may be created with
`apply.kind === "note"`; **and the note-expiry code from R9 is then DELETED — expiry for a
kind that cannot exist would be instance 17 of the safeguard nothing can reach.**

**What this does not fix:** `kind: "note"` proposals still exist and still change nothing when
tapped. Whether informational cards should be feed lines rather than proposals at all is a
design question for the research side, filed as an open question rather than decided here.


Every recommendation above ends in "file a proposal," and the queue has no expiry, no dedup and no
supersede.

**Change.** Stable `kind` key; filing over an open `kind` **supersedes** rather than appends;
`kind`-specific expiry, stated; sort by consequence, not recency.

**Assertions.** `runAdaptive` twice on the same state ⇒ one open proposal per kind. Superseded
proposals recorded in `feed`, not dropped. Real ledger post-migration ⇒ ≤1 per kind.

#### Correction to the source document — verified against the live ledger

`RESEARCH-DESIGN.md` §R9 reports *"13 open · oldest 9 days · four duplicated kinds"* and names
`recovery ×2`, `refeed_review ×2`, `rateunit ×2`, `ap_tighten ×2`, `pivot ×1`. **The live ledger
on `origin/main` has 16 proposals total, 13 RESOLVED and 3 open** (2 × `note`, 1 × `exit`) — Joe
has drained the queue since that document was written. The named kinds also do not appear as
`apply.kind`; almost every proposal is `kind: "note"`.

**The structural finding still stands, and the `note` count sharpens it.** Six `note` proposals were
filed on 2026-07-28 alone and four more on 07-29 — that is the duplication R9 describes. And a
proposal whose `apply.kind` is `note` **files a note and changes nothing**, which is the exact
defect `CLAUDE.md` records for `refeed_review`: *"a card that takes a tap and files a note is worse
than no card."* Verify `applyProposal` has a real branch per kind as part of this item.

---

### R10. Generate engine copy from the engine — sweep the hardcoded prose

**The rule is in the standing guardrails.** This is the backlog it created. Every line below
states a number or a behaviour that the engine owns, in prose written beside it rather than
read from it. **None of these can go red**, which is the whole problem.

Found by sweep, 2026-08-05, and this list is a starting point rather than a census:

| where | what it hardcodes | why it will drift |
|---|---|---|
| `GLOSSARY.ea` | *"the threshold that matters for a lean man is 25 kcal per kg"* and *"below about 20"* | These are `EA_SPARING` and `EA_LOW`. If either constant moves, the glossary lies. |
| `VOL_BANDS` deep copy | *"The bands are deficit-calibrated"* | A **behaviour claim**, and R8 says to delete it outright — Roth 2022 and Nait-Yahia 2026 are both null on FFM. It reads the band NUMBERS correctly and then mis-describes them. |
| refeed proposal | *"prescribed at 2,450-2,500"* | An authored pair beside a band that is derived two clauses later in the same sentence. |
| creatine card | *"The 1–2 lb water bump"* | Authored, next to a noise floor the app measures for him three cards away. |
| `bfEst` why-copy | *"±1 point"* / *"±3–4 points"* | These are `ANCHOR_ERR_DEXA` and `ANCHOR_ERR_EYE`. |
| `dietExit` copy | *"the deficit stays under ~500 kcal/day"* | Cited (Murphy & Koehler) but authored in prose; if the engine ever enforces it, two numbers. |

**The worked example is `VOL_BANDS`, and it is the reason the rule is not just "read the
number from its owner."** That copy already reads the band numbers correctly — so the numbers
cannot drift — and then attaches a **behaviour claim** ("the bands are deficit-calibrated")
that R8 says to delete outright, because Roth 2022 and Nait-Yahia 2026 are both null on FFM.
Generating the numbers was not enough. The sentence around them was still a second
implementation.

**Method — three branches, not one.**

1. **The copy quotes a number the engine owns.** Replace the literal with a template reading
   the owning constant or selector, exactly as `VOL_BANDS`' own numbers and
   `spikeMin`/`clearWithin` already do. The file has the pattern; it is applied unevenly.
2. **The copy makes a CLAIM ABOUT BEHAVIOUR.** Either delete it (the `deficit-calibrated`
   case) or derive the claim from the same predicate the code branches on. A sentence that
   describes a branch must be generated by that branch.
3. **The copy quotes a number whose SOURCE IS WEAK.** The generated sentence must carry the
   hedge the research assigned it. **Reading the number from a constant fixes drift and
   preserves a claim that should not be stated to him that confidently — a correctly
   generated number stated with unearned confidence is still the engine lying, just more
   precisely.** Two live instances:

   - **`dietExit`'s "under ~500 kcal/day"** is Murphy & Koehler 2022, which
     `RESEARCH-DESIGN.md` Part 2.1 marks **LOW-MEDIUM** confidence for this athlete: the
     pooled population averages **51-60 years old** (analysis A 60 ± 11, analysis B 51 ± 16)
     and he is **24**. The generated sentence must say so.
   - **Copy that is CONFIDENT ABOUT AN ABSTENTION** — the version that will hide, because it
     reads well. `energyBalanceTarget`'s unknown branch currently says the engine "is
     holding". **Any sentence that says the engine is holding without saying it also cannot
     yet decide is the same unearned confidence in the opposite direction.** Abstention copy
     must state what it is waiting for and roughly when. His is derivable from the counts the
     selector already returns: *"one more training week without an event day"* — 11 lifts sit
     at 4 scored sessions and lose 2-3 to hard days, so the gap is small and nameable.
   - **`bfEst`'s "±3-4 points"** hardcodes `ANCHOR_ERR_EYE` and **understates the instrument
     the app is actually rendering beside it.** The live interval is **10.7-18.3 — 7.6 points,
     asymmetric −3.6/+4.0** — because the drip band integrates away from the anchor. Copy
     that says ±3.5 describes a narrower instrument than the number next to it. Generate the
     rendered interval, not the anchor constant.

**Check what is about to be DELETED before writing a generator for it.** The refeed
proposal's authored `2,450-2,500` is on the list above, but there are open `refeed_review`
proposals titled *"THE WEEKLY REFEED HAS NO EVIDENCE BEHIND IT"*, and R8 is a
delete-not-build item. **Generating well-sourced prose for a feature about to be removed is
the cheapest kind of wasted work and the easiest to avoid.** Resolve the refeed's fate first;
if it goes, that row goes with it.

**Assertions — and a snapshot test is NOT acceptable anywhere in this item.** For every
instance: **mutate the source constant in the fixture and assert the rendered string moved.**
A copy assertion that only checks the current wording is the same dead guard in a new
costume — it is exactly the shape that let the rulebook tell him his thresholds were in
pounds for as long as it did. Guard-must-fire, applied to prose.

**What it does not buy.** This makes the prose self-consistent and appropriately hedged. It
does not make it correct — a sentence generated from the engine still says whatever the
engine says.

### R12. `calorieFloor` must sit at the PROTECTIVE end, not the midpoint

**NOT a band. I had this wrong and the correction matters.** R4's render-no-midpoint rule is
about DISPLAYING a body-fat estimate, where a centreline gets read as truth. **A floor is not
an estimate, it is a PRESCRIPTION**, and the two want opposite treatments — rendering a band
on a safety floor invites eating at the bottom of it, which is exactly what the floor exists
to prevent.

A floor under uncertainty sits at the **protective end**. Same asymmetry as everywhere else
here: eating below the true floor risks the low-EA harms the corpus tracks; a floor set
slightly high costs a little fat-loss rate and is recoverable.

**Measured on his live state** (25 kcal/kg FFM + 166 implied training cost):

    leanest   bf 10.7   lean 66.1 kg   floor 1818   <- the protective end
    midpoint  bf 14.3   lean 63.4 kg   floor 1751   <- what it uses today
    fattest   bf 18.3   lean 60.4 kg   floor 1677

    spread 141 kcal · protective end is +67 over the midpoint

**Change.** Take the leanest end of the interval, show ONE number, and say in the copy that it
is the protective end of a range rather than a measurement. Cheaper than a band, correct under
the asymmetry, and it does not teach him to aim at a lower bound.

**Acceptance criteria** — these are the three conditions of the narrowed `bfEst` rule, so
this item is what retires that exception:

- `calorieFloor` does not threshold on `bf.lean`
- it carries the interval (derives from `bf.lo`, the protective end, and states the range)
- it degrades to a stated fallback when the anchor is stale
- assertion: two states differing only in `bfEst` width produce floors differing in the
  protective direction, and the copy names it as protective rather than measured

#### TRIGGER, not priority — and the urgency really is low

**It does not bind today.** His band is 2176–2263 and every end of the floor interval sits
426–586 kcal below the band bottom. Nothing currently queued can deepen his deficit either:
R2c's costing walk only shrinks it, and `accretionBound` adds a surplus.

**It must land BEFORE any item that could deepen the deficit** — that is exactly when a floor
derived from the midpoint would be wrong in the expensive direction. That is the trigger.

### R11. Vacuity — assertions that cannot fail

**Absence of an assertion is easy to grep for. VACUITY is not, and it is the one that
survives review:** the test is present, it is named, it passes, and it asserts nothing.
Three instances are on the record, all found by hand, all within four days:

| assertion | why it could not fail |
|---|---|
| `ok(hair.state !== "flat" \|\| hair.pctClean == null, …)` | `pctClean` is not a field, so the disjunct was always true |
| `ok(rcOut.redlinePct === null \|\| rcOut.redlinePct === BCB(s3).redlinePct, …)` | on `SEED` the crossing does not fire, so `redlinePct` is null and the identity was never evaluated |
| `ok(!sealedRun.proposals.some(redline), "sealed window mutes …")` | the fixture's absolute date sat outside the frozen anchor, so the seal was never engaged |

**`tools/vacuity-scan.mjs` finds the first kind mechanically.** Line-preserving comment
strip, then every `ok()` line scanned for an escape-hatch disjunct. 7 hits over 1,598
assertions on this branch, all reviewed, none currently vacuous.

**It is NOT in the gate, deliberately.** Precision is poor by design — it cannot tell a
legitimate *"either absent, or correct when present"* from a hatch, and a gate that fails on
correct code is worse than no gate. **Recall is the point:** it would have caught both of the
first two mechanically, on the commit that introduced them.

**Two things it cannot do**, stated so a clean run is not mistaken for proof: it cannot see
fields that only exist in states nothing constructs, and it says nothing about assertions
that reference real fields and still assert nothing — the second kind in the table.

**Both failure modes the tool itself had are recorded in its header**, because they are the
same disease: a raw-text scan flagged `pctClean` inside the comment *documenting* the
`pctClean` bug, and removing comment lines outright shifted every line number after them so
it reported a defect at a line that did not contain it. **A tool carrying the defect class it
exists to find is worse than no tool.**

**Standing rule this establishes.** For every assertion a change ADDS: verify each referenced
field exists on the object under test, and that the assertion CAN fail. Never leave
`|| something-that-might-not-exist` in an `ok()` — an escape hatch in an assertion is
indistinguishable from a passing test.

### Part 4 — bugs, independent of the redesign

1. **`floor` / `redline` still absolute lb** — folded into R3. Verified at 2499–2500.
2. **Two live redlines** — 1.0 %BW vs 1.157 %BW, both displayed. Folded into R3.
3. **Two ETAs to 11%** — `etaRange(s,11).mid = 6` wk vs `digitalTwin(s).etaMid = 5`. Different
   methods, both rendered. **Violates engine-owns-numbers.**
4. **`typicalError`'s comment is stale by 3×** — line 1270 says *"0.75 reps per set across 33 paired
   sets"*; actual is **0.82 across 92** (verified). Its method also pairs consecutive sessions at
   identical load, so each difference contains real adaptation, not only measurement noise. Error
   direction is conservative, so **not dangerous — but the label is not what it computes.**
5. **`leangain` unreachable** — folded into R1. `phasePlan` has an apply handler (6583) and UI
   references (9580/9588/9766) but **no constructor anywhere** (verified).
6. **`weightNoise` takes `reads`, not `s`** (8893, verified) — the only export with a different
   signature. An audit calling the surface uniformly gets a false "broken" reading.
7. **35 migration patches unexported**, and `patchV34` **changes a physiological constant** (forces
   `s.model.drip = 0`). Migrations that alter physiology need the same test surface as the
   functions that consume them.
8. **Inline engine arithmetic in React components** — `NegotiatorConsole` (13013) and
   `WhatIfConsole` (12439) recompute rates, goal weights, calorie cuts and pivot dates outside every
   exported owner, using `KCAL_PER_LB_MIX` directly rather than `energyDensity`.
   `NegotiatorConsole` also holds the file's only explicit body-fat corridor — stepper bounds
   `9, 14` at 13044. **Under R4 that control goes.**

---

### Not on the queue — do these without code

From `RESEARCH-DESIGN.md` Part 6. None of them needs a feature:

1. **Steps are on a −649/week trend and intake rose 883 kcal/day.** Both leading indicators have
   turned. A behaviour finding, not a model finding.
2. **One DXA at Stony Brook — fasted, no training that morning, no carb load.** A non-standardised
   scan is worth up to **5.5 points of permanent bias**, more than the entire range of interest.
3. **Find one skinfold tester and keep them.** 0.6-point resolution beats everything else available
   at any price. **Same tester is the whole ballgame** — a consistent novice beats a rotating expert.

---

### Carried over — Joe's open questions, not superseded by RESEARCH-DESIGN.md

`RESEARCH-DESIGN.md` instructed that the QUEUED list be *replaced* by R2 → R9 plus the Part 4 bugs.
**These items are kept rather than deleted**, because that document was written outside the repo and
does not know they exist, and they hold decisions only Joe can make. They sit below the new queue,
not in it. Two are directly affected:

- **Item 1 (personal RIR calibration) — CLOSED.** `RESEARCH-DESIGN.md` Part 5 says do not build
  it; Joe confirmed closed on 2026-08-05. Do not reopen without him.
- **Item 5 (DEXA anchor) — NOT superseded, and now REQUIRED by R5.** Joe reinstated it on
  2026-08-05 as **"DEXA anchor — standardisation protocol required."** R5's tracker measures fat
  change; only DXA observes lean mass, so the anchor is what makes `partitionPrior` possible at
  all. See the item for the protocol and the flag it must record.


### 0. TRAIN spec — remainder (all seven §5 moves shipped in v7.8.0)

### TRAIN + Gym Mode — the comprehensive redesign

**This spec is complete. The design calls have been made. Build it — do not open with
another proposal pass.** The research and the element-by-element inventory are both done
and are reproduced below so nothing has to be rediscovered. Where a decision was genuinely
Joe's, it is listed under *Open questions* at the end and must be written up, not guessed.

Line numbers are against `v7.6.0`. Verify each anchor before editing — this file's
editing hazard is anchors that match more than once.

---

#### STATE — read this before you start

**§3.3 (ladder inference) is ALREADY BUILT.** It was written and gated outside this
session and sits on the local branch **`feat/train-ladder-inference`** (`d34bcd0`,
branched off `main`, four files: `src/app.jsx`, `tools/engine-test.jsx`, `app.js`,
`sw.js`). APP_V and the sw cache are already bumped to **7.8.0**. Strict gate and render
smoke were green: **1431 assertions**, up from 1419.

**Do not rebuild §3.3. Your first two actions are:**

1. **Push `feat/train-ladder-inference` to origin.** It exists in exactly one place right
   now — the local clone — and nothing else has a copy. Push it before you touch anything
   else.
2. **Branch the roster work off it**, so §3.2 and §3.3 ship together as one release rather
   than racing each other over the same file.

What landed in §3.3, so you can verify rather than assume: `proposeLadder(s, exId)` and
`sweepLadders(s)` (both pure, both in the `__test` export); a `ladder` branch in
`applyProposal` plus its exact reversal in `undoAdjustment`; the jump-size chips no longer
destroying a ladder without confirming; `set weight` no longer proposing 180 lb for a lift
with no numeric load; and the rung editor rebuilt as a picker with a *fill from my log*
control. Twelve assertions cover both abstention gates, provenance of every rung, that
filing is not applying, that approving never raises the load, and that undo is exact.

**§3.2 (the TRAIN roster + three doors) is NOT built. That is your work.** Everything it
needs is in §3.2 below.

**Housekeeping note, not corruption:** `.git/_stale-locks/` contains git lock files and
temp objects moved aside during that work — the bridge that wrote the branch cannot delete
files, only move them. The tree and the commit are sound. Clear that directory when
convenient.

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

**BUILD STATUS — all seven §5 moves built.** v7.7.0 shipped the first four (merge `5fe2b9f`).
The remaining three are on `feat/train-roster` awaiting the phone walk:

- ✅ memoise · ✅ delete/dedupe · ✅ Gym Mode completeness · ✅ RIR timing  — LIVE in v7.7.0
- ✅ TRAIN roster + three doors (SETUP / THE READ / THE RECORD) — built, not merged
- ✅ ladder inference (`proposeLadder` + an inbox `ladder` branch that actually applies)
  — built, not merged
- ✅ §3.4 — satisfied by the FALLBACK, live since v7.6.0: the LAB proposal no longer claims
  the window “has already” been widened. Wiring `windowFor` into progression remains
  available and is still the riskiest change in the spec.

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


### 1. Personal RIR calibration — measure Joe's own bias, as a range `[needs Joe]`

**Joe's proposal, and it is the right shape:** stop using a population constant for RIR
bias; measure his own, treat it as a range the way `bfEst` is a range, and once there is
enough data let it inform the prescription. This supersedes *Open question 1* in the TRAIN
spec, which recommended "leave it and cite the bias". Measuring beats citing — **but only
with a measurement design the current log cannot provide.**

#### The measurement problem — read this first, it decides the whole design

**His existing training log cannot yield this number, and no amount of it will.** To know
his bias you need two things: what he *said* (RIR 2) and what was *true* (how many he
actually had left). In normal training he stops at his estimate — so the log contains the
estimate and never the truth. The truth only exists on a set taken *past* where he would
have stopped.

Next-session performance cannot substitute. If he calls 2 RIR at 160×11 and next session
does 160×13, that is equally consistent with "he misjudged by two reps" and "he got two
reps stronger". **Misjudgement and adaptation are confounded**, and adaptation is the
thing the whole programme exists to cause. Any estimate built from ordinary sessions would
be measuring its own training effect.

So the data has to be created deliberately.

#### The design that does work — paired calibration sets

The literature's own protocol, and it is simple enough to run in his session: on the last
set of a chosen lift, he calls his RIR **at the point he would normally stop**, and then
keeps going to actual momentary failure. The difference between the two is that day's
bias, measured directly, with nothing confounded. [1]

Constraints that are not optional:

- **Safe, single-joint lifts only** — tricep, curl, lateral, extension, ham. Never the
  hack squat, press, or anything where the failure rep is a safety event. This is also
  where RIR estimates are most accurate to begin with. [2]
- **The last set only**, and not every session — a failure set carries real fatigue cost,
  and the point is to measure his perception, not to redesign his programme around
  measuring it.
- **It must be proposed and accepted, never auto-scheduled.** A calibration set changes
  what he does in the gym; that goes through the approval inbox like everything else.

#### What the evidence says about the number being measured

The population bias is real but its magnitude is wildly uncertain: paired
self-determined-stop versus true-failure trials produced **0.8 reps** in one experiment and
**2.8** in another, meta-estimating **2.0 reps with a 95% CI of 0.0 to 4.0**. [1] A
confidence interval running from zero to four is precisely why a population constant
should not be applied to one person — it is an argument *for* Joe's idea, not against it.

But the same study is the reason this must be gated hard: **within-subject reliability of
the bias was ICC 0.5 (95% CI 0.03–0.8) in one experiment and 0.96 (0.92–0.98) in the
other.** [1] Those describe two different worlds. At 0.96 the bias is a stable personal
trait worth modelling; at 0.5 it is barely a trait at all and a personal estimate would be
mostly noise wearing a number's clothes.

**Therefore the app must not assume the bias is stable — it must test whether it is, from
his own points, and say so honestly.** If his calibration points scatter widely, the
correct output is an abstention: *"your RIR judgement isn't consistent enough to correct
for yet"* — the same self-suppression `signalState` already performs when a trend is inside
its own noise. That abstention is a feature, not a failure of the feature.

Two further constraints from the same literature: accuracy appears to improve with practice
and familiarisation, so the estimate must be a **rolling, ageing** one rather than a fixed
constant learned once and applied forever; and participants remained inaccurate even when
deliberately trying to stop as close to failure as possible — so this cannot be fixed by
"just concentrate harder". [1]

#### How many sets before it means anything

If the within-subject spread of his bias is on the order of 1–1.5 reps, pinning the mean to
±0.5 reps needs roughly **(1.5 / 0.5)² ≈ 9 calibration sets.** At one a week that is
**two to three months** before the range is tight enough to act on. The app should say that
out loud from the first calibration set, and show the interval narrowing — the DEXA lesson:
the anchor tightens a range, it does not license a point.

#### How it should be APPLIED — and the trap to avoid

This is where Joe's proposal needs one correction.

**The wrong application: inflate the rep targets.** If the engine decides he had 3 in
reserve when he said 2, and feeds the corrected number into `progressStep`, his next target
climbs by +3 instead of +2. That does nothing for hypertrophy, because **the evidence links
growth to actual proximity to failure during the set, not to how fast the target climbs.**
[3] Worse, it has a concrete failure mode: he still stops at his *perceived* 2 RIR, so he
misses the inflated target; `liftCall` counts non-improving sessions; three of those fire a
`RESET`; and he gets deloaded because the engine's model of him was wrong. The app would
punish him for its own correction.

**The right application: close the gap he did not know was there.** Two honest uses:

1. **Tell him.** *"When you call it 2, you have been landing nearer 3 — your working sets
   are finishing about a rep further from failure than the plan intends."* That is
   information he can act on directly, and acting on it is the thing the hypertrophy
   evidence actually supports.
2. **Adjust the prescription, not the record.** If the plan wants him at 1 RIR and he
   reliably overshoots by one, `rirPlan` can prescribe 0 knowing he will land at 1. The
   number he reports is never rewritten — his log stays his log — only the instruction
   changes. Engine-owned, honestly labelled, and reversible.

**Never silently rewrite a logged RIR.** The stored value is what he said; a corrected
value is the engine's inference about him and must be visibly labelled as such wherever it
appears, with its interval and its n.

#### What to build

1. **`rirCalibration(s)`** — pure selector over a new `s.rirCal` collection returning
   `{n, bias, lo, hi, stable, why}` or `null`. `stable` is false when the spread of his
   points is too wide to act on, and a false `stable` suppresses every downstream use.
   In the `__test` export with assertions covering: null below n, abstention on wide
   scatter, a correct interval on tight scatter, and that the interval narrows as n grows.
2. **A calibration proposal** — `sweepRirCal(s)` files "take the last set of <safe lift> to
   real failure next session, and call your RIR before you do" into the approval inbox.
   Never auto-applied. Never on a compound.
3. **Gym Mode capture** — on a calibration set, ask for the estimate at the normal stopping
   point, then record actual reps to failure. Two numbers, one set, seconds apart.
4. **`s.rirCal` is new synced state** — keyed-union, refuse-to-shrink, additive migration,
   in the same change. Same rule as everything else.
5. **Application, gated:** only when `stable` and `n` are sufficient, and only as (1) an
   honest readout and (2) a `rirPlan` prescription shift. **`progressStep` keeps reading
   the RIR he actually reported.**

#### Open questions for Joe

- **Is he willing to take one set a week to true failure on an isolation lift?** The whole
  design rests on it. If not, this item closes and the honest answer stays "we cite the
  population bias and do not correct for it" — which is a perfectly defensible place to
  land, and better than a number built on a measurement that cannot be made.
- **Which lift.** Tricep, curl, lateral, extension or ham. Ideally the same one every time,
  so the estimate is not also absorbing between-exercise differences.

**Sources**
[1] *"Just One More Rep!" — Ability to Predict Proximity to Task Failure in Resistance
Trained Persons*, Frontiers in Psychology (2020). Paired self-determined-RM vs momentary
failure design; 0.8 and 2.8 reps across two experiments, meta-estimate 2.0 (95% CI 0.0–4.0);
ICC(3,1) 0.5 (0.03–0.8) and 0.96 (0.92–0.98) —
https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.565416/full
[2] RIR-estimation accuracy synthesis — error falls from ~4.8 reps at 33% of a set to ~1.2
at 90%, and 1.2 → 0.46 from 5 RIR to 1 RIR; better on single-joint movements and in sets of
≤12 reps — https://www.strongerbyscience.com/reps-in-reserve/
[3] Refalo et al., proximity-to-failure meta-regressions: RIR relates meaningfully to
hypertrophy, negligibly to strength —
https://link.springer.com/article/10.1007/s40279-024-02069-2


### 2. In-progress session survivability — LEASE, not a merge  `[needs Joe]`

**Downgraded 2026-08-04.** The spec line "phone dies at lift 6 and the session is gone" was
wrong: localStorage survives a dead battery, an app restart and a reboot, so the draft is
lost only if the device is wiped or replaced. That exposure **does not justify `SCHEMA_V`
39**, and nothing is being built for it now.

The answer is recorded so the item is not open-ended if it is ever picked up: **an open gym
draft is a LEASE, not a mergeable collection.** Stamp it with a device id and a started-at.
It may be replaced only by a draft from the *same* device, or by a completed session. **A
stale device NEVER overwrites a live one — there is exactly one phone in the gym.** Nothing
here merges; it is claimed or released.

### 3. Event protocol readability (round-3 I4) — option (c)  `[needs Joe]`

Move the event reference material into a door (THE BRIEFING); keep the fold card gated to
the actionable window. This does **not** re-open round-2 G1 — the fold card stays windowed,
only the reference material moves. Decided; recorded so nobody relitigates it.

**Queued behind the iOS walk of THE BRIEFING itself.** It is a v7.5 construct and the door
layout has now been walked once, but the event-detail placement inside it has not — do not
build it blind.

### 4. The three non-numeric lifts (Q2·F)  `[needs Joe]`

`hack` (`"hold"`), `hanging` (`"BW"`) and `curl` (`"55·55·50"`) store `w: null`, so
`progressAnchor` never anchors them and `typicalError` skips them — three of fifteen lifts
sit outside the progression engine. Representation options: a per-set load array
(`"55·55·50"` → `[55,55,50]`); a bodyweight flag with optional added load; and whatever
`"hold"` actually is for the hack squat, which Joe does not think is a load at all.

**Data-model change — needs merge hardening and a migration, so it is not overnight work.**


### 5. DEXA anchor — standardisation protocol required `[needs Joe]`

> **Reinstated and sharpened by Joe, 2026-08-05.** This item is NOT superseded by R5. Skinfolds
> track fat change; **only DXA observes lean mass**, so this is the only thing that can anchor
> `partitionPrior`, and `PARTITION_ANCHORS_TO_NARROW = 2` still requires two real anchors.
>
> **Hard standardisation requirement: fasted, no training that morning, no carb or creatine load.**
> The app turns a scan into a *fixed lean-mass anchor*, so a scan-day error is not noise — it is a
> **permanent offset on every later reading**. An unstandardised scan is worth up to **5.5 points
> of permanent anchor bias**, which is more than the entire range of interest. For scale: a 500 g
> meal plus 1 L of water moved FFM by 1,211 g (+1.64 pts); glycogen and creatine loading moved LBM
> by 3.0% (+2.58 pts).
>
> **The scan-entry path must record whether the protocol was followed** — a required field, not an
> optional note. **That flag is worth more than the scan's stated precision**, because a
> `protocol: false` scan cannot be trusted as an anchor at all, no matter what the machine's LSC
> says. A scan without the flag is not an anchor.
>
> Everything below is the original item, kept for its state and open questions.

**Original item —** no scan exists yet, and it adds synced state

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

## DEPLOY INCIDENT LOG — 2026-08-07, run 306: the beacon lost a race with a phone sync

**Second runner-adjacent incident this week — but a different mechanism, so not the run-299
pattern.** The deploy itself succeeded (v7.18.0 byte-verified live, e3a9b35dca7f72ab); the
BEACON push was rejected fetch-first because a ledger auto-sync landed on main mid-deploy,
and the failure-path beacon was rejected the same way. The record said v7.17.0 while
v7.18.0 was live — **the beacon holding stale truth, which is the exact condition it exists
to prevent.**

- **Record corrected on the ledger lane** ([skip ci]), to independently verified reality,
  with the race noted in the file itself.
- **Workflow fixed on `fix/beacon-race`**: both beacon pushes now fetch-merge-retry (×3,
  `-X ours` — the beacon file is ours, the synced ledger is theirs and merges cleanly).
  This is `ship.mjs`'s merge-before-push lesson, arriving at the workflow layer a week
  later. Phone syncs are frequent; this race recurs without it.

## DEPLOY INCIDENT LOG — 2026-08-06, run 299

The v7.16.1 merge (`bcc1dbf`) was gated green locally and its branch tip passed CI as run
298 — but run 299's suite job was CANCELLED by the runner (no newer push existed to
supersede it), so production never ran and the site stayed on v7.16.0. Two retrigger
lessons, recorded because both cost a wait:

- **The PAT cannot re-run workflows** (403 — no Actions write). Joe adding that scope would
  turn this class of incident into one API call.
- **An empty commit does not fire the pipeline.** GitHub skips push events with no changed
  files, so `--allow-empty` is not a retrigger. A real file change is required — this note
  is that change.

## SHIPPED

- **v7.12.0 — the receipt shows the rating that actually sizes the step** (2026-08-05). Merge
  `7d1682d`, deployed via `90b92cb`; beacon 15:11:35Z, assets byte-identical. 1521 assertions.
  - The receipt printed `en.rir` — the OPENER — under a bare `RIR` label, while `progressStep`
    is sized by the TERMINAL rating. It showed the number that does not drive progression and
    hid the one that does, on all 21 entries carrying both ends.
  - `rirReceipt(en)` prints both (`RIR 2→0`), with `?` for an unrated set. 55 entries changed
    what they display; 4 gained a line they never had. None stopped showing.
  - Also on `main`, no app bytes: `ship.mjs` no longer runs `pull --rebase` between the gate
    and the push. It merges the remote at step 0, BEFORE the gate, so what is proved is what is
    pushed. A stopped rebase left the repo mid-rebase on a DETACHED HEAD with the local commit
    on zero branches — measured in a scratch clone — with `push origin HEAD:main` as the next
    line. That is how a partial v7.6.0 reached main on 2026-08-04 with APP_V reading 7.5.0.
    Gate check 7 now fails if `--rebase` reappears; proved to fail, then restored.
  - **The repo went PUBLIC on 2026-08-05.** Joe's decision, for free Actions minutes after a
    $0 spending limit blocked every job mid-release. History was scanned clean of credentials
    first. `GOALS.md` / `CLAUDE.md` / `HANDOFF.md` corrected; the `/ledger` lockdown is kept
    but its PURPOSE is restated — it no longer buys secrecy.

- **v7.11.1 — `ex.last` is the third denormalised cache** (2026-08-05). Merge `a3709c7`;
  beacon 00:24:53Z. `deriveLastMeta` kept `ex.lastMeta` in step with a corrected log and left
  `ex.last` — the cache `targetsFor` gates on — pointing at the removed entry. After the 08-04
  ham un-skip, `lastMeta` read the real `[10,10]` while `last` held the removed `[12,12]`.
  `reconcileLiftCaches` runs on load and reconciles them; both correction handlers now write
  both. Narrow on purpose — a deliberate `ex.last = null` from the weight editor survives.
  Verified live: both historical repairs stamped and synced, `ham.last` healed on the phone.

- **v7.11.0 — the correction merge** (2026-08-04). Merge `a4852d5`; branch
  `feat/merge-correction`. Beacon published 23:58:32Z; deployed assets byte-identical.
  Gate + render smoke green, 1509 assertions. Own branch, own release, nothing riding along.
  - A deliberate correction carries an explicit `corr: { at, rev }` stamp, written only by
    `✕` and `↩` through one `_stampCorr`. An UNMARKED shrink still loses, exactly as before.
  - Four ordered rules on `sessionLog` only, including the one that matters most: a STALE
    correction never reverts work logged after it.
  - `✕` refuses to remove the last entry, and says why on screen.
  - Known limitation, stated in the code comment: wholesale per-date replacement means two
    devices correcting the same session discards the loser's correction.
  - The fixture went RED on the old rule first, for the right reason — "Winner was the
    UNSTAMPED phantom copy" — and a dry run on a scratch copy of the real ledger showed both
    repairs landing in both write orders with nothing outside `sessionLog` shrinking.

- **v7.10.0 — un-skip on the phone, and lastMeta follows the log** (2026-08-04). Merge
  `6689a5e`; branch `fix/touched-invariant`. Beacon published 20:29:27Z; deployed assets
  byte-identical to `main`. Gate + render smoke green, 1475 assertions.
  - **TOUCHED** decides a skip, not the presence of reps. `getR` falls back to the TARGET so
    every lift always “has reps”; the predicate is positive action — a banked set, an RIR,
    or a rep moved off default — recorded as it happens, never reconstructed.
  - The lift screen’s bottom row had THREE children under space-between, putting
    “◂ back a lift” and “skip lift ▸” adjacent as small unpadded spans. Fixed, both with
    a 10×12 hit area.
  - **`↩` un-skip** on the logged receipt — the missing half of `✕`. Prompts empty and says
    why; does not restore RIR, because RIR was never captured.
  - **`deriveLastMeta`** rebuilds the cache `progressStep` reads from the most recent real
    performance. Both `✕` and `↩` call it. The earlier ledger repairs did not, so the
    phantom kept driving targets after the repair “succeeded”.

  **Known-open, recorded here so it is not rediscovered:** `mergeState` scores a session as
  `entries.length * 1e6 + json length` and keeps the higher side, so any correction that
  REMOVES an entry loses to a device still holding it. Un-skipping adds an entry and wins;
  the `✕` direction does not. `pronated@2026-07-23` and `ham@2026-07-31` are phantom
  entries on main right now for this reason — both earlier repairs were reverted by sync.

- **v7.9.0 — the phantom SKIP, the way back, the ladder verdict** (2026-08-04). Merge
  `bf04901`; branch `fix/phantom-skip` (`6debec4` → `e6a8804`). Beacon published v7.9.0 at
  16:41:09Z; deployed `app.js` + `sw.js` byte-identical to `main`. Gate + render smoke green,
  1454 assertions.
  - `mergeSessionDrafts` takes an explicit `{ final }` mode. A live draft at lift 3 of 9 marks
    ZERO skipped — it marked six — and TRAIN’s `complete()` re-derives the inference at
    finish. This was writing misses into `sessionLog[date].skipped` that never happened.
  - `backLift` steps back a lift and clears the skip on the one it returns to.
  - Ladder evenness is now “whole multiple of `inc`” (equality made 85/95/105 unreachable on
    a 5 lb stack), and `sweepLadders` files proposals into the inbox — the missing middle
    step between inferring and installing.

- **v7.8.0 — TRAIN roster, three doors, and the ladder** (2026-08-04). Merge `6a6406c`;
  branch `feat/train-roster` (`afa8545` → `d20784a`). Beacon published v7.8.0 at 16:00:07Z;
  deployed `app.js` + `sw.js` byte-identical to `main`. Gate + render smoke green, 1430
  assertions. **This completes all seven §5 moves of the TRAIN + Gym Mode spec.**
  - TRAIN is a roster: one row per lift with `liftCall`’s verdict, tapping opens that lift
    in the SETUP door. Three doors — SETUP / THE READ / THE RECORD. The per-exercise cards
    were MOVED verbatim, not rewritten, so every write path survives.
  - `proposeLadder` infers rungs from the loads actually logged and PROPOSES them; an
    `applyProposal` ladder branch makes an approved ladder land. Invents nothing between
    observations; skips non-numeric weights (Q2·F, `[needs Joe]`).
  - The `jump:` chips no longer silently delete a hand-entered ladder, and `set weight ✎`
    no longer proposes 180 lb on a non-numeric lift.
  - The door invariant is now TAB-AWARE and proven to fail on a drifted TRAIN key.

- **v7.7.0 — TRAIN/Gym Mode, first four moves** (2026-08-04). Merge `5fe2b9f`; branch
  `feat/train-gym-redesign` (`c0aecd3` → `4b8d870`). Beacon published v7.7.0 at 13:46:23Z;
  deployed `app.js` + `sw.js` verified byte-identical to `main`. Gate green, 1419 assertions.
  - memoise: `genSession` + `liftCall` once per state, not once per keystroke.
  - delete/dedupe: two dead RECEIPT chips, TRAIN’s third copy of the queue, PACE given one
    owner (Gym Mode measures it; the manual control is labelled a fallback).
  - Gym Mode completeness: the live cue, the DEBUT/OWN-IT/RECLAIM note, setup behind a
    disclosure, the previous session, the next rung (honest when there is none), undo last
    set, +30s / restart rest, all-done as a list, the WHAT MOVED recap that was being
    discarded, and note + niggles no longer hardcoded.
  - RIR timing: last-set RIR asked AT the set (~0.46 vs ~1.2 reps of error); the opener
    prompt leaves the default flow, field retained and editable on TRAIN.
  - **Not in this release:** the TRAIN roster + three doors, and ladder inference.

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
