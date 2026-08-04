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

## NOW

### v7.5 round 2 — three fixes did not close, plus four new findings

Branch `feat/v7.5-now-relayout`, now at `53ca945`. The round-1 fixes (`5863a2a` →
`53ca945`) were **re-audited by the same independent fresh-context process** — three
verifiers, no build bias, each asked to prove a fix rather than accept it. Four fixes
are clean. Three did not actually close, and the round-1 work introduced four new
problems. **Still do not merge.**

**Verified CLEAN — do not revisit:**

- **Blocker 3 (`now.capture` → `now.capture2`)** — genuinely new key, every reference
  routed through the new `NOW_DOORS` constant, zero stragglers, orphaned boolean never
  read. Textbook.
- **Blocker 4 (wrapper spacing)** — both wrappers carry
  `display:flex; flexDirection:column; gap:12`, matching `Group`'s own container
  exactly. A sweep of every other bare `<div>` in `NowTab` found no second instance.
- **Should-fix 5 (naked projection)** — the band now comes from `currentRate`'s own
  `lo`/`hi`, correctly inverted (faster loss → lower weight), with `banded` honest
  about the two-snapshot fallback. No synthesised ±%. Well done.
- **Should-fix 7 (`proj` arithmetic)** — `paceProjection(s, wks = PACE_PROJ_WKS)` is a
  real engine selector: pure, gated on `cr.measured`, in the `__test` export, five
  assertions that were re-run numerically and pass. Exactly right.
- **Should-fix 9 (naming)** — the door is `THE BRIEFING`, the read is `TRAJECTORY`, no
  live string/key/id named `THE READ` survives. See minor item 4 for one stale comment.

#### BLOCKERS — round 2

**A. The `More` panel still carries the defect blocker 2 was about.** The abstention fix
covered the card's prose but the `More`/`forYou` panel inside the *same* `Card`
(`app.jsx` ~9767) is byte-identical to before and still gates on `cr.measured`.
*Failure:* in `inside-noise` the card reads *"This week is still inside your noise — no
real change to read yet"* over *"No projection yet — the read above has not cleared the
noise"*, and one tap below: *"**Measured** pace 1.35 lb/wk on the scale, about
1.60 lb/wk of that fat-equivalent."* The suppressed number is still there, one tap
away, labelled "measured". **Should-fix 6 survives in the same place:** while gaining,
the headline reads **+1.2 lb/wk** and the panel reads **-1.23 lb/wk** — and *"about
-0.98 lb/wk of that fat-equivalent"*, a negative fat-loss rate presented as a
measurement.
*Fix:* route the `forYou` panel through the same `rc.showRate` / `rc.rate` the card
body now uses. The in-code comment *"The rate prints ONCE, in one format"* is not yet
true — make it true, then the comment is earned.

**B. The replacement deep-link assertion is a stronger tautology than the one it
replaced.** `engine-test.jsx` ~3581 now asserts
`["night","weight","day","yesterday"].every(k => Object.values(__test.NOW_DOORS).includes(oT63(k).key))`.
Every `oweTarget` branch returns `NOW_DOORS.capture`, so this reduces to
`Object.values(NOW_DOORS).includes(NOW_DOORS.capture)` — **true for any object with a
`capture` property, under any edit.** The old version at least pinned a string literal.
`NOW_DOORS` is a parallel literal, not the live set: the live set is `window.__plGroups`,
populated by `registerGroup(persistKey, setGOpen)`, which the suite never reads.
*Failure (verified by running it):* change a `<Group>`'s `persistKey` to `now.machine`
and leave `NOW_DOORS` alone — `statusTarget` deep-links to a key no Group registers,
`openGroup` no-ops, the door's children never mount, `scrollToId` finds nothing, and
**tapping NEEDS YOU does nothing.** Suite stays green. That is precisely the bug class
the assertion claims to make impossible.
*Fix:* derive the invariant from `window.__plGroups` (or whatever `registerGroup`
actually populates) so a persistKey that drifts from `NOW_DOORS` turns the suite red.
And assert `statusTarget`'s escalation **key** with a literal — it currently has a real
assertion on the id and a tautology on the key, and the key is the half that was
reported missing. Its `owed` and `null` branches are still uncovered
(the existing `== null || key !== "now.inbox"` disjunction pins neither).

**C. EVENT MODE is visible now, but the miss is still erasable.** Residency fixed
reachability — the card is top-level, correctly spaced, and `nowFocus` was rightly left
alone. But the gate is unchanged: `ev = s.events.find(e => !e.estimated && daysUntil(e.d) >= 0)`.
The moment the date passes, `ev` is null, the card vanishes, and `closeEvent`'s only
call site is gone. The commit message states this blocker is resolved; it is not.
Two consequences:
- The card's own `daysUntil(ev.d) < 0` branch (*"waiting on you to close it — the
  ledger doesn't guess"*) is **provably dead** — it needs `< 0` inside a subtree that
  only renders when `>= 0`.
- `dayProtocol` → `theOneThing`'s `openEv` branch requires `daysUntil(e.d) < 0` and
  tells the user *"Close out <event> — zero-comp or honest — one tap"*. The two gates
  are **disjoint**: the day after an event, the app instructs a one-tap action whose
  only button does not exist anywhere.
*Failure:* an event is filed for the 4th. Joe doesn't open NOW that day. On the 5th the
card is gone, `zeroComp.count` never increments, no feed entry is written, and nothing
tells him it went unfiled. **A miss is silently erased** — the charter's "show misses"
is the rule this breaks, not just a usability point.
*Fix:* widen the gate so an unfiled past event stays closable (that is what
`theOneThing` already assumes), and **sort by date** — `s.events.find(...)` picks by
array order while the engine's own `nextEvent` sorts, so with two events on file the
card can show the September one while today's closable event is unreachable. Residency
made that ordering bug load-bearing: it is now the sole path to `closeEvent`.

#### SHOULD FIX — round 2

**D. Kill the `count` badge on THE ROOM. My call in round 1 was wrong.** I asked for it
restored; in this form it should not be. `Group` renders `count` identically to the
approval inbox's badge (mono, `T.gauge`, right-aligned `· N`), where it means *things
waiting on your tap*. On THE ROOM it means *goals you already set*.
*Failure:* one staged proposal, 3 process goals, 2 if-thens → `FOR YOU TO OK · 1` above
`THE ROOM · 5`, read as five outstanding items. It also mislabels its own container —
THE ROOM holds "this week · session · recovery · the laws" and the count covers only
two of those. Either drop it or give it a distinct, non-pending treatment. (It also
rode into a naming/test commit with no comment and no test.)

**E. The abstain copy states a reason that did not happen.** The gate is `rc.showRate`,
false for **both** `inside-noise` and `calibrating`. In `calibrating` there is no rate
and no noise test at all, yet the card says *"the read above has not cleared the
noise"* two lines under a headline reading *"Still learning your baseline."* The old
copy named the actual unlock — *"Two clean weekly snapshots and this reads off your
measured rate instead of an estimate"* — and that instruction is now gone for both
states. Split the abstain copy by state and put the unlock condition back.

**F. The printed rate and the printed projection don't reconcile.** `rc.rate` rounds to
1dp; `pp.mid` is computed from the 2dp `cr.scale`. With `trend 164.2, scale 1.34` the
card says *"At −1.3 lb/wk, 4 more weeks puts you near 158.8 lb"* — but 164.2 − 1.3×4 =
159.0. The gap can equal or exceed the printed band. The sentence invites exactly that
multiplication. Either round the projection off the same displayed figure, or widen the
band's copy so the arithmetic isn't implied.

**G. Minor, batch them:**
1. EVENT MODE is now resident for the *entire run-up* to an event, not just the event
   day — an actionless card on the fold for weeks. Gate residency to the day (or a
   short window), not to `daysUntil >= 0`.
2. `paceProjection`'s null guard is dead code: `const cr = currentRate(s)` runs before
   the `s == null` clause, and `currentRate` dereferences `s.weekly` immediately. Move
   the guard first.
3. `pp.banded === false` is unreachable from the UI — `showRate` implies the regression
   path implies a CI — so the "no interval yet" micro-line and the un-banded prose
   variant can never render. Either remove them or make the engine assertion honest
   about covering a UI-unreachable path.
4. Stale comment (`app.jsx` ~9940) still enumerates the doors as *"CAPTURE … THE READ …
   THE ROOM"* and contradicts itself in the next sentence.
5. Test fixtures at ~3619 still exercise retired door names (`now.today`, `now.plan`,
   `now.logs`). `readDisc` is key-agnostic so the assertions are valid, but they read
   as live door names to the next person who greps.
6. The `now.read` → `now.briefing` rename discarded every user's remembered open/closed
   state for that door and orphaned a key, for a rename that only needed a `title`
   change. Not worth reverting now — noted so it isn't repeated.

#### ACCEPTED — decided, do not relitigate

- Approval inbox stays a sibling above the doors.
- TODAY'S PROTOCOL one tap down is the declutter working.
- `pl-amend` hidden 12:00–16:59 with today's calories filed — deep link still fires.

#### BEFORE MERGE

- ~~Blockers A, B, C closed; D–F closed; G batched~~ **DONE** — `4845c8b` (C, the erasable
  miss), `913fe3e` (A + E/F/G2), `34f7948` (B + D + G3/G4/G5).
- ~~Strict gate green — and verify the suite actually goes RED when a `<Group>`'s
  persistKey is deliberately broken~~ **DONE, and it does.** Setting THE ROOM's
  `persistKey` to `now.machine` while leaving `NOW_DOORS` alone makes the render smoke
  report exactly `now.room` and exit 1; restoring returns it to green. Suite **1354 →
  1370**, plus the render-smoke invariant, which is where it belongs — the engine suite
  cannot see what `registerGroup` registered, so any check living there is comparing a
  literal to itself.
- ~~Re-run the jsdom door check~~ **DONE** — both harnesses green, and
  `.tmp/exceptioncheck.mjs` gained the blocker-C states (an unfiled event still on the
  fold the day after, its button still present, and the previously-dead "waiting on you
  to close it" branch now rendering).
- **Eyes on iOS Safari.** ← still the only thing left. Branch pushed; preview URL is in
  the `preview` job's step summary.

**Three notes back to the research side:**

1. **Round 1's blocker-1 commit message was wrong** and the round-2 audit was right to
   call it: residency fixed *reachability* only, and the gate that erased the miss was
   untouched. `eventFocus(s)` now covers the whole grace window `theOneThing` can
   instruct over, so "Close out X — one tap" always has its button.
2. **G1 changed observable behaviour**: the EVENT MODE *card* now appears one day out
   rather than for the whole run-up. The *chip* keeps the wider horizon via the existing
   sorted `nextEvent`, so weeks-ahead awareness is not lost — the card and the chip read
   different selectors because they answer different questions.
3. **G6 is accepted as noted, not reverted.** The `now.read` → `now.briefing` rename did
   discard that door's remembered state, for what only needed a `title` change. It is a
   brand-new key either way, so nothing older was lost; recorded so it is not repeated.

## QUEUED

### 1. Extract the duplicated `conditionalForesight` JSX

The plan-conditional block is written twice — once in the crossing branch and once in
the projection branch (app.jsx ~9626 and ~9652), byte-identical. Under this codebase's
string-surgery editing workflow **any anchor into that block matches twice**, which is
exactly the hazard that produced two defects in the v7.5 build. Extract it to one
component. Independent of any redesign; do it as its own commit.

### 2. DEXA body-fat anchor — spec'd, and narrower than we assumed

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

### 3. Waist + progress photos — unlogged inputs

`WEEKLY · DUE` already surfaces them; neither is being captured. Low build cost, high
signal: waist is the cheapest independent check on whether the loss is coming off fat,
and photos are the north-star readout (*"most drastic visual change"*).

### 4. Native track — Apple Health auto-logging

The fullest endgame for near-zero cognitive load: weight, steps and sleep logging
themselves. Requires a native wrapper (Capacitor) plus a Mac, Xcode and an Apple
developer ID — a parallel track, entirely separate from the live PWA. Scope it before
committing to it; nothing on the PWA waits for it.

### 5. Clone sprawl

`prepledger-dev` and `prepledger-v631` both exist; `feat/v6.2-autopilot-modes` is
unpushed at `e01075c`. Consolidate to one clone + worktrees — but **push or tag that
branch somewhere safe first**, as its own separate job, and only after v7.5 has shipped
and settled. Do not fold this into a feature build.

### 6. Polish sweep

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
