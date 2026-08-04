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
tool, not a metabolic trick** — never label one as a metabolic reset. Forecasts fan
with distance and self-suppress on ambiguous confidence. The safety supervisor has
hard floors (loss ≤ ~0.7%/wk, tightening with leanness; energy-availability floors;
protein 2.3–3.1 g/kg FFM) and can veto the optimizer.

**Data-safety.** Any feature that adds synced state must ship with keyed-union /
refuse-to-shrink merge hardening **and** an additive schema migration, in the same
change. If an item below adds a synced field and does not say how it merges, that is
a defect in the item — flag it before you build, do not improvise the merge.

**Ops.** Never print or expose a credential. Never delete athlete data. Keep the
`/ledger` lockdown intact. iOS Safari is the real target and the test suite only runs
headless — walk the render-smoke states and eyeball on the phone before shipping.

---

## NOW

### Verify and ship the v7.5 NOW re-layout

Built on `feat/v7.5-now-relayout` (commits `9c92153` → `8a5fb0c`). The re-layout is
written; what is left is proving it and shipping it. It reconciled the stale
`_design-proposal-now` audit — which read a 112-commit-old v6.2.0 build — against the
real v7.4.1 screen, and did the three moves that were actually still open:

1. `THE FIVE TODAY` un-buried from `<Group title="TODAY" defaultOpen={false}>` back to
   resident Tier 1.
2. `THE READ · UPDATED LIVE` + `WHERE THIS PACE LANDS YOU` merged into one
   `TRAJECTORY · UPDATED LIVE` card at Tier 1 — the trajectory is now told once
   instead of three times.
3. Seven groups collapsed into three labelled doors: `CAPTURE` / `THE READ` /
   `THE ROOM`.

**Decisions already locked — do not revisit:**

- Direction is **B's layout + A's single-word cockpit hero**. **C's dashed-fork
  timeline is dropped.** No SVG instruments this pass. (The fork in the mockup is
  also drawn wrong: the dashed steer line rises while the measured line falls, but a
  lower BF% means a lower weight — both should fall. If the timeline is ever built,
  fix that first.)
- **FORESIGHT stays in the COCKPIT card.** `conditionalForesight(s)` is already
  built, gated on a live steer, carries one engine-owned number (`digitalTwin.etaMid`),
  and already labels itself *"plan-conditional — not your measured trend yet."*
  Do not rebuild it, do not move it into `TRAJECTORY`, do not duplicate it there.
- The cockpit (`COCKPIT · AUTO-PILOT` — `statusFace` word, `marchingOrder`, autonomy
  line, foresight block) is **not** part of this re-layout. Leave it alone.

**Acceptance criteria:**

- No new numbers. Every value still comes from its existing selector — `fiveLevers`,
  `signalState` / `signalReadCopy`, `currentRate`, `bfEst`, `forecast`,
  `conditionalForesight`. Assert that no new rate, band or probability was introduced.
- No data-model change: no new stored field, no new collection, no schema bump, no
  migration. `ledger/` data is untouched.
- Every card that moved kept **all** of its behaviour — its own state, `saveDaily`,
  `fixWindow`, sodium/alcohol, caffeine/meds/pulse/temp/waist/photo writes, `dayCtx`
  estimate logic, amend-yesterday, the midnight intercept. Nothing was dropped in
  the move.
- `persistKey` and time-aware `defaultOpen` preserved per door; **collapsed stays
  collapsed** and the rooms do not rearrange themselves between visits
  (Findlater & McGrenere — the citation is already in the source).
- Exception cards still fire and still interrupt: `BODY ALARM`, `WHY-ENGINE`,
  `EVENT MODE`, and the approval inbox when non-empty.
- `WHERE THIS PACE LANDS YOU` no longer renders as a standalone card anywhere on the
  page — assert its absence, not just the presence of `TRAJECTORY`.
- Gate + render-smoke green across the empty / seed / full states, then eyeball on
  iOS Safari before merge.

---

## QUEUED

### 1. DEXA body-fat anchor — the top unfinished input

The single highest-value missing measurement. A real DEXA collapses several live
ranges into numbers (e.g. protein 160–190 g → one figure) and sharpens the whole
body-comp model. Until it lands, every BF-derived readout must keep showing its
interval and stay honestly pre-DEXA. Needs: an entry path, the honest
before/after treatment of the ranges it collapses, and the merge/schema hardening if
it adds synced state. **Do not build the collapse until a real scan exists** — a
single anchor is one measurement, not a calibration curve; partitioning still needs
repeated scans.

### 2. Waist + progress photos — unlogged inputs

`WEEKLY · DUE` already surfaces them, but neither is being captured. Low build cost,
high signal: waist is the cheapest independent check on whether the loss is coming
off fat, and photos are the north-star readout (*"most drastic visual change"*).

### 3. Native track — Apple Health auto-logging

The fullest endgame for near-zero cognitive load: weight, steps and sleep logging
themselves. Requires a native wrapper (Capacitor) plus a Mac, Xcode and an Apple
developer ID — a parallel track to scope, entirely separate from the live PWA. Scope
it before committing to it; nothing on the PWA should be blocked waiting for it.

### 4. Polish sweep

Forecast recompute, ETA floor, memoization. Mostly mechanical. Flag anything in here
that turns out to need a product decision rather than a fix.

---

## SHIPPED

- **v7.4.1 — honest plan-conditional foresight** (`762d81e`, `bf42d11`).
  `conditionalForesight(s)` + the `target reached` relabel, rendered in both the
  projection and crossing branches.

---

*Written by the research/spec side. Build side: work NOW, top to bottom, and move it
to SHIPPED when it's on Joe's phone.*
