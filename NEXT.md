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

### Fix the v7.5 audit findings, then ship

Branch `feat/v7.5-now-relayout` (`9c92153` → `8a5fb0c`, strict gate green at 1344).
The three moves are right and the build quality is high — but an **independent
fresh-context audit** (five reviewers with no build bias, run outside the build
session; the constitution's requirement is satisfied) found four blockers and five
should-fixes. **Do not merge until the blockers are cleared.**

Two things the audit cleared that were open questions: `sw.js` cache name
(`measured-v7.5.0`) and `APP_V` (`7.5.0`) are consistent, and `app.js` is genuinely
rebuilt — the upgrade path is sound. And no new stored field, collection, migration,
merge-logic change or `ledger/` write entered the branch: the presentation-layer-only
claim holds. Every write path (`saveDaily`, `fixWindow`, sodium/alcohol, caffeine,
meds, pulse/temp, waist, photos, `dayCtx`, amend-yesterday, sleep/weight, the
proposal stager) is a verified pure move.

#### BLOCKERS

**1. EVENT MODE's `closeEvent` is a one-shot write that is now unreachable by
default.** The card moved from `now.plan` (`defaultOpen={hours < 17}`) into `THE READ`
(`defaultOpen={false}`, a brand-new key so no stored preference can rescue it), and
**nothing deep-links to it** — `nowFocus` has no `"event"` owed kind, so WHAT YOU OWE,
`marchingOrder` and `statusTarget` all miss it. Its render gate is
`!e.estimated && daysUntil(e.d) >= 0`, so it exists for exactly one day; at midnight
`ev` goes null and the card is gone forever. `closeEvent` (app.jsx:4072) has exactly
one call site (app.jsx:10435).
*Failure:* an event is on file for today. Joe opens NOW at 9am, sees nothing about it,
never opens THE READ. The event is never filed, `zeroComp.count` never increments, and
the `ZERO-COMP EVENT` feed entry is never written. Nothing is deleted — a write simply
becomes unmakeable.
*Fix:* either give `nowFocus` an `event` owed kind so the fold points at it (preferred
— it is genuinely something Joe owes today), or keep EVENT MODE resident above the
doors like the approval inbox. It is exception-only and renders nothing on ordinary
days, so residency costs no clutter.

**2. The merged TRAJECTORY card routes around the forecast's abstention gate and can
contradict itself.** The headline, epistemic word and rate come from
`signalReadCopy`, which deliberately withholds the rate unless
`sig.state` is `measured` / `measurable` / `reversed`. The merged-in projection gates
on `cr.measured` instead — and `currentRate().measured` is true in every state except
`calibrating`, including the 2-snapshot fallback (`ci: null`) and any regression whose
CI straddles zero.
*Failure:* in the `inside-noise` state the card renders *"This week is still inside
your noise — no real change to read yet."* · **INSIDE NOISE**, and four lines below,
in the same card: *"At the 1.35 lb/wk you are actually moving, four more weeks puts
you near 158.8 lb."* Both halves existed before, but they were ~600px and two closed
disclosures apart; the merge turned a cross-page inconsistency into a self-contradicting
card at Tier 1.
*Fix:* gate the projection on the **same** predicate the headline uses (`rc.showRate`),
not on `cr.measured`. When the read abstains, the projection abstains with it.

**3. `now.capture` was reused while its scope grew from three cards to the whole
logging surface — with no key migration.** `readDisc` (app.jsx:8606) returns the
*stored* boolean whenever the key exists and ignores `computeDefault`. Before, the
evening block had its own key (`now.logs`, `defaultOpen={h >= 17 || dl.cal == null}`).
*Failure:* any existing user who ever tapped the old CAPTURE shut carries
`disc["now.capture"] === false`. On the first launch after upgrading, at 20:00 with
the day unclosed, the new time-aware default is discarded and the door holding sleep,
the scale, close-the-day, amend and the weekly items stays shut. The release note's
"new persistKeys have no stored preference, so first visit uses fresh defaults" is
true for `now.read` / `now.room` and **false for the reused `now.capture`.**
*Fix:* rename the key (e.g. `now.capture2`), or clear the stale `now.capture` boolean
once on upgrade. Partially mitigated today — `oweTarget` force-opens the door — but a
user with nothing owed still can't see their own logging surface.

**4. The `pl-closeday` and `pl-today` wrapper divs destroy card spacing.** `Group`
supplies the only vertical spacing its children get — its open container is
`display:flex; flexDirection:column; gap:12` (app.jsx:8843) — and `Card` carries no
margin. The re-layout wrapped previously-direct children in bare, unstyled
`<div id="pl-closeday">` (9983) and `<div id="pl-today">` (10247), so each becomes a
single flex item and its contents fall back to block layout with **zero** gap.
*Failure:* open CAPTURE in the evening with caffeine, meds and weekly-due all showing —
eight bordered cards render flush against each other with doubled touching borders,
while every other card on the tab keeps its 12px gap. Reads as broken rendering. Same
for the four cards in `pl-today`.
*Fix:* put the same flex/gap style on both wrappers, or move the id onto the first
`<Card>` and drop the wrapper.

#### SHOULD FIX IN THE SAME PASS

**5. The projected weight prints naked.** `${proj} lb` carries no interval and no *"a
projection, not a promise"*, inside a card whose eyebrow says `UPDATED LIVE` and which
also carries the brass ◆ measured mark. Per the app's own provenance rule that is a
claim, not a measurement — and it sits directly beneath a COCKPIT that, in its
`CALIBRATING` branch, says *"no confident line yet"*. `currentRate` exposes `lo`/`hi`;
use them.

**6. The same number prints twice in one card with opposite signs.** `rc.rate` and
`cr.scale` are the same engine field rendered two ways: the headline as
`−1.3 lb/wk` (absolute, 1dp, loss convention), the body as `At the 1.27 lb/wk` (raw,
2dp, engine sign). In the `reversed` state the headline reads **+1.2** and the body
**-1.23**. Pick one form and use it in both places — "proposals should never confuse
me" applies to readouts too.

**7. `proj` is UI-side arithmetic on raw state.**
`+(s.trend - cr.scale * 4).toFixed(1)`, with a hardcoded 4-week horizon and no engine
selector behind it — the one number on NOW the engine does not own. It is copied
verbatim, so the branch's presentation-only claim is textually true, but the merge
promoted it from a double-collapsed footer to the second thing on the screen. At Tier 1
it needs a `forecast`- or `digitalTwin`-backed selector.

**8. The new deep-link assertion is vacuous, and the riskiest repoint is untested.**
`engine-test.jsx:3581` asserts
`["night","weight","day","yesterday"].every(k => oT63(k).key === "now.capture")` — a
restatement of the four assertions immediately above it, deriving nothing from the set
of live persistKeys. It cannot fail unless one of those already failed. Meanwhile
`statusTarget`'s `now.today` → `now.read` repoint (app.jsx:8804) — the only pair whose
key and id come from different groups — has **no** assertion; the suite only covers the
`now.inbox` branch (4216–4217). Write the invariant against the live key set, and add a
`statusTarget` escalation assertion.

**9. The `THE READ` naming collision is back, inverted.** v6.3 §5c explicitly renamed
the lower group to "YOUR ANALYST" *to end the collision with the top THE READ card* —
the comment documenting that fix is still in the source. v7.5 renamed the read to
TRAJECTORY and gave the name "THE READ" to a door holding Auto-Pilot detail, the
analyst and today's protocol. The label now points at everything except the read.
Rename the door.

#### ACCEPTED — decided, do not relitigate

- **The approval inbox stays a sibling above the doors.** The builder deviated from
  "seven → three" here and the deviation is right: it renders nothing when empty, so it
  costs no clutter, and burying "changes waiting on your tap" fights *"all approvals,
  once approved, must serve their function."* Keep it.
- **TODAY'S PROTOCOL one tap down** is the declutter working, not a defect. Accepted as
  a real behaviour change.
- **`pl-amend` hidden 12:00–16:59** when today's calories are already filed. The deep
  link still fires and WHAT YOU OWE still lists `yesterday`, so this is degraded
  discoverability, not a dead tap. Accepted; revisit if a yesterday actually goes
  unclosed.
- **THIS WEEK's `count` badge** was dropped in the regroup. Minor; restore it on THE
  ROOM if it's cheap, otherwise leave it.

#### BEFORE MERGE

- Blockers 1–4 cleared, each as its own commit so the three original moves stay
  independently revertable.
- Strict gate green, with the two new/repaired assertions from fix 8.
- **Eyes on iOS Safari.** Nobody has looked at this on a phone; it is a 768-line
  re-layout of the screen Joe opens every morning. Fix 4 in particular is a visual
  defect that only a real render will confirm as fixed.
- Re-run the jsdom door check (`.tmp/doorcheck.mjs`).

---

## QUEUED

### 1. Extract the duplicated `conditionalForesight` JSX

The plan-conditional block is written twice — once in the crossing branch and once in
the projection branch (app.jsx ~9626 and ~9652), byte-identical. Under this codebase's
string-surgery editing workflow **any anchor into that block matches twice**, which is
exactly the hazard that produced two defects in the v7.5 build. Extract it to one
component. Independent of any redesign; do it as its own commit.

### 2. DEXA body-fat anchor — the top unfinished input

The single highest-value missing measurement. A real DEXA collapses several live
ranges into numbers (e.g. protein 160–190 g → one figure) and sharpens the whole
body-comp model. Until it lands, every BF-derived readout must keep showing its
interval and stay honestly pre-DEXA. **Do not build the collapse until a real scan
exists** — one anchor is a measurement, not a calibration curve; partitioning still
needs repeated scans.

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
