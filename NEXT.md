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

## NOW  `[overnight-safe]`

### Gym Mode phantom reps — live on Joe's phone, and it has already corrupted the log

**This is promoted above the v7.5 NOW re-layout.** The v7.5 branch is parked awaiting an
iOS look (QUEUED #1); this bug is deployed, it is still firing, and it is poisoning the
input to load progression. It does not touch `NowTab` and `v7.5` does not touch
`GymMode` (verified: zero references in `main...feat/v7.5-now-relayout`), so **branch this
off `main` and ship it independently.** Do not wait for v7.5.

#### The defect

`GymMode`'s lift-screen `skip lift ▸` control calls `nextLift`, which advances `idx`
**without setting `gskip`**. `finish()` then includes that lift with `getR(e2)` — its full
target rep array. A control labelled *skip* writes a set the athlete never performed.
The sibling control on the `lift-done` screen sets `gskip` correctly; only the lift-screen
link is wrong. Present in `main` (`src/app.jsx:12128`), so it is on the phone right now.

`completeSession` writes *"zero phantom reps, nothing counted"* into the feed while this
happens.

#### It has already fired — at least twice, corroborated by Joe's own notes

From `ledger/state.json`:

| date | Joe's session note | what was logged | RIR |
|---|---|---|---|
| 2026-07-23 | *"Had to skip pronated today due to time constraints. Not typical."* | `pronated 40 × [12,12]` | **null** |
| 2026-07-31 | *"Ham curl skipped this sesh for time. Abnormal"* | `ham 120 × [12,12]` | **null** |

Both sessions record `skipped: []` — nothing on the record, exactly the opposite of what
the athlete wrote in the note. In both, the phantom entry is the **only** lift in the
session with `rir: null`; every lift he actually performed carries one. That is the
signature — the RIR screen is what a real lift passes through, and `nextLift` bypasses it.

#### Why it matters more than it looks

`progressAnchor` takes the **element-wise max of the last three sessions at the same
load**. The phantom entries are Joe's *best* recorded performances:

```
ham   2026-07-24  [12,10] rir 2
      2026-07-28  [12,11] rir 2
      2026-07-31  [12,12] rir null   <- never happened, and it is the max
pronated 07-23 [12,12] rir null      <- never happened
         07-27 [12,12] rir 1
         07-30 [12,12] rir 0
```

So the anchor for both lifts is built partly on sets that do not exist. Worse for
`pronated`: three consecutive sessions at `[12,12]`, one of them phantom — that is
`topRun` territory, the two-for-two confirmation that queues a debut at the next weight.
A load increase may already have been proposed off a set that was never performed.
`typicalError` — the measured noise band the whole `beatsNoise` gate rests on — is
computed from the same entries.

#### Build

1. **Fix the control.** `skip lift ▸` must set `gskip[ex.id]` before advancing, exactly
   as the `lift-done` skip does. One selector, one behaviour, no second path.
2. **Repair the two entries.** Move `pronated@2026-07-23` and `ham@2026-07-31` out of
   `entries` and into `skipped[]`. The receipt already renders that honestly — struck
   through, *"skipped — on record"*. `progressAnchor` and `typicalError` are derived, not
   stored, so they self-correct the moment the entries move. **Repair only these two.**
   Do not bulk-delete on the `rir === null` signature alone — `rirEnd` is null across the
   whole log and a genuine lift could plausibly lack a first-set RIR. These two are
   confirmed by Joe's own written notes; anything else needs his say-so first.
3. **Write a feed line for each repair** naming what was removed and why. A silent
   correction to the training record is the same failure as a silent phantom.
4. **Assert it can't recur:** no `finish()` path may emit an entry for a lift not
   performed. Fixture: enter Gym Mode, take the lift-screen skip on lift 3, finish —
   assert lift 3 appears in `skipped` and **not** in `entries`.
5. **Sweep for the same class.** Any other control that advances session state without
   recording what happened to the lift it left.

#### Then, in the same branch (they are one commit's worth of the same file)

- **Rest timer on wall-clock.** The `setInterval` tick is throttled and suspended by iOS
  whenever the phone is pocketed between sets, so displayed rest ≠ elapsed rest — and
  `rests.cut` is derived from it, so the *measured* pace flag inherits the drift and then
  feeds `PACE` and the rushed-session exclusions in `liftCall`. Store a start timestamp;
  the interval should only repaint.
- **One draft, not two.** `prep-ledger-gymdraft-<date>` and `prep-ledger-draft-<date>`
  never talk. Exit Gym Mode at lift 4, tap `Complete session` on TRAIN, and it logs
  **targets for every lift** — a second phantom-rep path with a different cause.
- **Make an in-progress session survivable.** Both drafts are localStorage-only, never
  synced, absent from `recordCounts`. Phone dies at lift 6 and the session is gone.

**Everything else on TRAIN — the redesign, the ladders, the RIR timing change — stays in
QUEUED #2.** This item is a data-integrity fix and should ship as one, small and
reviewable, without a redesign riding along.

#### Open question for Joe

**"Make an in-progress session survivable" was not built — it needs your call.** The item
offers two options and they have very different risk profiles, so picking one unattended
would have been a guess:

- **(a) Fold the gym draft into synced state.** This is a new synced collection, so per the
  standing guardrail it needs keyed-union / refuse-to-shrink merge hardening *and* an
  additive migration (`patchV39`, `SCHEMA_V` 38 → 39) in the same change. It also raises a
  question the item doesn't answer: if a live session is open on the phone and a stale
  device syncs, which one wins? A wrong answer here clobbers a workout while he is standing
  in it — the exact class the merge hardening exists to prevent, but now with a moving
  target.
- **(b) Make it exportable.** No schema change, no merge surface, no synced state. Loses the
  automatic recovery — he has to have exported before the phone died, which is exactly when
  people don't.

The other three parts of this section shipped (skip path, wall-clock rest, one draft).
This one is the only piece that adds synced state, and it is the piece this codebase has
historically got wrong twice.

#### Acceptance criteria

- The lift-screen skip and the lift-done skip route through one code path.
- The two named entries are moved, each with a feed line; no other entry is touched.
- New assertions: skip-then-finish omits the lift; the two drafts cannot disagree; rest
  elapsed is computed from wall-clock across a simulated background gap.
- Strict gate green, render smoke green.
- Walked in Gym Mode on the actual phone — tap the lift-screen skip, finish, read the
  receipt — before it goes near `main`.


## QUEUED

### 1. v7.5 NOW re-layout — code fixes `[overnight-safe]`, merge `[needs Joe]`

The branch `feat/v7.5-now-relayout` is built and audited three times. It cannot
merge until Joe walks it on the phone, and its remaining blockers are below.
Resume this the moment the Gym Mode fix ships.

### v7.5 round 3 — one charter violation is live in the shipped seed

Branch `feat/v7.5-now-relayout` at `bad4459`. Round 2 was re-audited by the same
independent process (three fresh-context verifiers, no build bias, each asked to *prove*
a fix rather than accept it — two of them ran executable experiments against the real
module rather than reading). **Two of three blockers closed cleanly. One did not, and
its failure is not hypothetical — it is happening in the shipped data right now.**

**Verified CLEAN — do not revisit:**

- **Blocker A (the `More` panel).** The gate is now the same expression in both places
  and the panel no longer calls `currentRate` at all. Verified across every
  `signalState`: body and panel cannot disagree in any state. The `reversed` walkthrough
  is correct — headline, body and panel all print `+1.2 lb/wk` with the same sign
  convention. The rate appears exactly three times in the card, all `rc.rate`.
- **Blocker B (the deep-link invariant) — this one is finally real.** `window.__plDoors`
  is published from `NOW_DOORS` and `tools/render-smoke.mjs` asserts
  `declared ⊆ registered` against the **live** `__plGroups` registry. A verifier mutated
  a `<Group>`'s `persistKey` and the smoke exits 1 with a named key. The engine suite
  catches the complementary mode (a straggler consumer naming a retired key). Neither
  alone is sufficient; together they cover it. `statusTarget` now asserts the **key** on
  all four branches, including the split-source escalation branch.
- **Blocker C parts (a) and (c).** The dead `daysUntil < 0` branch is reachable.
  `eventFocus` sorts by date instead of array order. Residency is bounded — no more
  actionless card for the whole run-up to a future event.
- **The THE ROOM count badge is gone entirely.** The `· N` slot now means one thing
  again. Right call.
- **Structurally clean:** no data-model change, no migration or merge touched, every
  write path hash-identical, no prop dropped, no exception card lost its gate, no new
  esbuild warnings.

#### BLOCKERS — round 3

**A. The event miss is still erasable — the cliff moved from midnight to midnight+7d,
it was not removed. And it has already fired.** `eventFocus` gives an 8-day window
(D−1 … D+7). Past `EVENT_GRACE_D` an unfiled event has **no surface anywhere**:
`eventFocus` → null, `lastEvent(s,7)` → null, `openEv` → null, `nowFocus` still has no
`event` owed kind, `dayWeather` only flags −1…+2d. `closeEvent` becomes unmakeable
again, `zeroComp.count` never increments, and no feed row records the lapse.
*This is live:* the shipped seed carries `WEDDING #2`, dated 2026-07-25, `estimated:false`
— ten days old. A verifier executed it: `eventFocus(SEED).ev === null`,
`zeroComp.count === 5`. **The charter's "show misses" is the rule being broken**, and it
is being broken on real data, not in a hypothetical.
*Fix:* a miss must not expire. Give `nowFocus` an `event` owed kind, or keep a
permanent, honestly-labelled "unfiled event" surface. A grace window is fine for the
*normal* path; it must not be the only path.

**B. The window is not honest.** Nothing added says the File button expires. The copy on
D+7 is identical to the copy on D+1. A user who has seen the same card for a week opens
the app on D+8 and both the event and the button are gone, with no explanation. Either
say how long it stays, or (per blocker A) don't let it go away.

**C. The day-of copy is wrong on the extended window.** `after tonight: one tap files the
day — tomorrow runs the normal plan` and `File the event ✓ — your estimate goes in
tonight's numbers` render unconditionally inside `evF.closable`. They were written for
D and D+1. On D+4 the app instructs the athlete to put a four-day-old dinner's estimate
into **tonight's** log — mis-dated intake landing in the ledger the whole trend is
computed from. Same class as the tense bug the file already documents in
`EVENT_RECENCY_NOTE`.

**D. With two unfiled events, the instruction and the button point at different events.**
`theOneThing`'s `openEv` still uses `s.events.find(...)` (array order, first match at
exactly D+1); the card shows the *most overdue*. Executed: with events at −4d and −1d,
the one thing says *"Close out Yesterday dinner"* while EVENT MODE shows *"Older
wedding"* and its button files Older wedding. Tapping what the app told him to do files
the wrong event. Route `openEv` through `eventFocus` so there is one selector.

#### SHOULD FIX — round 3

**E. The restored unlock line is factually false.** *"two clean weekly snapshots and this
reads off your measured rate instead of an estimate"* — leaving `calibrating` needs
`rates.length >= 2`, i.e. **three** weekly rows; and even then the snapshots branch
returns `ci: null`, so `ciExcludesZero` is false, `showRate` is false, and the card
**still abstains** with a different reason. The suite asserts this itself
(`CR(snp).measured === true && showRate === false`). A new user follows the instruction
for three weeks and is told something else. The line was true under the old
`cr.measured` gate; restoring it verbatim under the `showRate` gate re-broke it. Name
the condition that actually unlocks the projection.

**F. "Measured pace" overstates the state in two of the three states it renders in.** The
panel gate is `showRate`, true for `measurable` and `reversed` too — but the card
reserves `MEASURED ◆` for `state === "measured"`. So the panel says *"Measured pace…"*
under a **MEASURABLE** or **REVERSED** word. The panel claims a stronger status than the
card it lives inside.

**G. The band rounding buys nothing and can collapse the band.** `lo`/`hi` are now
computed from `+cr.hi.toFixed(1)` / `+cr.lo.toFixed(1)` — but those rate bounds are never
displayed, so rounding them gains no reconciliation and costs up to 0.2 lb per endpoint
versus the CI the copy promises is "carried through". When `ci < 0.05` the band
collapses onto the midpoint (verified: *"near 159 lb — anywhere from 158.6 to 159 lb"*),
which would violate the suite's own strict `lo < mid < hi` assertion. Round only what is
printed.

**H. Test debt from this round:**
1. `engine-test.jsx:3663` still asserts the **pre-fix** `lo` formula (raw `cr.hi`); the
   code now rounds it. It passes by coincidence on this fixture (`hi = 0.59` rounds to
   the same result). At `hi = 0.64` the two differ by 0.2 and the assertion fails for a
   reason unrelated to the property it names.
2. **Blocker A has zero test coverage.** This exact defect has now recurred once already,
   in a sibling element of the same card. Pin the `More` panel to the body's gate.
3. The approval-inbox door is **exempted** from the live `declared ⊆ registered` check
   (`k !== "inbox"`), and it is the target of `statusTarget`'s highest-precedence branch.
   Drift that one `persistKey` and both suites stay green while the "open what's waiting
   on your tap" tap goes silently dead. The smoke already has a state-seeding mechanism —
   seed one unresolved proposal and check it with the others.
4. The smoke asserts `declared ⊆ live`, i.e. it validates the **constant**, not the
   selector *outputs*. Feed `oweTarget(k).key` and `statusTarget(...).key` through the
   same check to close the loop.

**I. Minor, batch them:**
1. The 1-decimal display precision is now load-bearing but exists as three unshared
   `.toFixed(1)` literals with no shared constant and no test tying the engine's
   `rateShown` to the string the card prints. Changing the card to 2dp silently un-fixes F.
2. `pp.rate` (raw 2dp) and `pp.banded` have zero UI consumers. `rate` sitting next to
   `rateShown` is exactly the field the next person reaches for — delete it.
3. Stale comment at ~9982-9986 still describes the old event gate in the present tense
   and says "Fixed by residency", with no mention of `eventFocus` / `EVENT_LEAD_D` /
   `EVENT_GRACE_D`. In a codebase where the comment is the spec, that misleads.
4. `ev.protocol` is now unreachable until D−1 (`EVENT_LEAD_D = 1`) and is rendered in
   exactly one place, so the athlete cannot read the protocol he is meant to follow until
   the evening before.

#### Open question for Joe — round-3 minor I4

**I4 was not built: it contradicts G1, and only you can settle which wins.** Round-2 G1
asked that EVENT MODE stop being resident for the whole run-up to an event — "an actionless
card on the fold for weeks" — so residency was gated to `EVENT_LEAD_D = 1`. Round-3 I4 then
observes that `ev.protocol` renders in exactly one place, that card, so you cannot read the
protocol you are meant to follow until the evening before. Both are right.

- **(a) Leave it.** The chip still names the event weeks ahead. Costs nothing, fixes nothing.
- **(b) Show the card earlier without its action.** Directly re-opens G1.
- **(c) Move the event detail into a door** (THE BRIEFING) so the protocol is one tap away at
  any distance, and keep the fold card for the actionable window only. Most work, and it is a
  layout decision on a screen you have not yet walked on the phone.

Everything else in round 3 is closed: blockers A–D in `37cdcf9`, should-fixes E–I in `32d9bc9`.

#### BEFORE MERGE

- Blockers A–D closed; E–H closed; I batched.
- Strict gate green, **and** `render-smoke` green — and confirm the smoke is actually
  wired into `npm run check` in CI, because the deep-link guarantee now rests on it.
- **Eyes on iOS Safari.** Still not done. Nothing merges to `main` without it.



### 2. Gym Mode — the rest of the integrity sweep `[overnight-safe]`

**Promote this above the redesign. These are live defects that corrupt the ledger the
whole engine computes from, and one of them violates the charter's loudest rule.**

Found by an independent read of `LogTab` (`src/app.jsx` ~10750) and `GymMode` (~12166).
Line numbers are against `v7.5.0`.

**A. `skip lift ▸` banks a session Joe never performed.** On the lift screen (`:12268`)
the skip link calls `nextLift` (`:12201`), which advances `idx` **without touching
`gskip`**. `finish()` (`:12203`) then includes that lift with `getR(e2)` — its full
target array. So tapping a control labelled *skip* logs the lift at target reps.
The sibling control on the `lift-done` screen (`:12244`) does it correctly.
*This is the exact opposite of the app's own printed claim* — `completeSession` (`:1328`)
writes *"zero phantom reps, nothing counted"* into the feed. The phantom reps then feed
`progressAnchor`, `typicalError`, `atTopOfWindow` and every load decision downstream.
**Fix first, before anything else on this page.**

**B. The two drafts never talk, and the gap is another phantom-rep path.** Gym Mode
persists to `prep-ledger-gymdraft-<date>` (`:12185`); TRAIN persists to
`prep-ledger-draft-<date>` (`:10780`). Exit Gym Mode at lift 4 and TRAIN still shows
untouched target steppers; tap `Complete session` and it logs **targets for all lifts**,
including the ones never performed. The guard at `:10832` prevents double-logging, not
wrong-logging. One draft, one source of truth.

**C. The rest timer drifts on exactly the platform it runs on.** `:12191–12195` is a
`setInterval` tick. iOS throttles and suspends timers when the app is backgrounded —
which is precisely what a phone does between sets. Displayed rest ≠ elapsed rest, and
because `rests.cut` (`:12227`) is derived from `t`, the *measured* pace flag inherits the
drift and then feeds `PACE` and the rushed-session exclusions in `liftCall`. Store a
start timestamp and compute elapsed from `Date.now()`; the interval should only repaint.

**D. An in-progress session is unrecoverable.** Both drafts are localStorage-only, never
synced, absent from `recordCounts` (`:7875`). Phone dies at lift 6 and the session is
gone. At minimum, fold the gym draft into the synced state behind the existing
never-shrink merge, or make it exportable.

**E. `exOrder` has no merge hardening.** It appears in no `MERGE_*` map, so it falls
through the wholesale `{...remote, ...local}` at `:8047`. Reorder lifts on the phone,
then sync from a stale device, and the order silently reverts — the same clobber class
the code documents at `:7934`. Add it to the keyed reconcile.

**F. Three of fifteen lifts are outside the progression engine.** `completeSession`
(`:1326`) writes `w: typeof ex2.w === "number" ? ex2.w : null`, so `hack` (`"hold"`),
`hanging` (`"BW"`) and `curl` (`"55·55·50"`) store `w: null`. `progressAnchor` (`:846`)
compares `String(en.w) !== String(ex.w)` → `"null" !== "hold"` → those lifts **never get
the max-of-three anchor**, and `typicalError` (`:1159`) skips them, so they never
contribute to or benefit from the measured noise band. The app needs a per-set load
array where it currently stores a display label.

**G. Batch:** `ex.cue` is dead in Gym Mode (`:12256`) — `setup`, `live` and the
DEBUT/OWN-IT/RECLAIM note all exist in `sess.ex` and none render, so the cues live only
on the page he doesn't use in the gym. Gym Mode discards `lines` from `completeSession`
(`:12208`), so the WHAT MOVED recap never fires from the path he actually uses. It also
hardcodes `note: "gym mode"` (overwriting the note field, which then prints in the
receipt and debrief) and `niggles: []` (making the joint check unreachable). `set weight ✎`
defaults `wVal` to **180** for any non-numeric weight (`:11033`) — tap it on the hanging
raise and it proposes 180 lb. The `jump: 2.5/5/10` chips **delete `ex.steps`** as a side
effect (`:11000`), one mis-tap from `uneven ✎`, no confirm. Two dead RECEIPT chips
(`:10816`, `:10821`) are styled as buttons with no handler.

**H. The app claims a thing it has not done.** The LAB proposal at `:6172` says the rep
window *"has to widen to {lo}-{hi}, **which the app has already done**"*. It has not:
`windowFor` (`:991`) and `repsLostOnJump` (`:980`) are computed, consumed only by
`coarseLifts` → that one proposal, and **never by progression** — `atTopOfWindow`
(`:1010`) and `targetsFor` (`:869`) still use the raw authored `ex.hi` and a fixed
`hi − i` staircase. Either wire it in or correct the sentence. An honest-labelling app
cannot tell him something is done that isn't.

**Acceptance criteria:** an assertion that no `finish()` path can emit an entry for a
lift the athlete did not perform; an assertion that the two drafts cannot disagree; a
wall-clock rest test; `exOrder` in the merge suite with a stale-device fixture; the three
non-numeric lifts appearing in `progressAnchor` and `typicalError` fixtures.

---

### 3. TRAIN + Gym Mode redesign `[needs Joe]` — he should see the shape before it is built

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


### 4. Extract the duplicated `conditionalForesight` JSX `[overnight-safe]`

The plan-conditional block is written twice — once in the crossing branch and once in
the projection branch (app.jsx ~9626 and ~9652), byte-identical. Under this codebase's
string-surgery editing workflow **any anchor into that block matches twice**, which is
exactly the hazard that produced two defects in the v7.5 build. Extract it to one
component. Independent of any redesign; do it as its own commit.

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

### 9. Polish sweep `[overnight-safe]`

Forecast recompute, ETA floor, memoization. Mostly mechanical. Flag anything that turns
out to need a product decision rather than a fix.

---

## SHIPPED

- **v7.4.1 — honest plan-conditional foresight** (`762d81e`, `bf42d11`).
  `conditionalForesight(s)` + the `target reached` relabel, rendered in both the
  projection and crossing branches.

---

*Written by the research/spec side. Build side: work NOW, top to bottom, and move it
to SHIPPED when it's on Joe's phone.*

---

## OVERNIGHT LOG — 2026-08-04

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
