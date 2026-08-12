# Measured — NOW page declutter · design pass

**This is a proposal to react to, not a build.** Nothing in the app was changed, built, or
pushed; `prepledger-v631` was not touched. The mockups live in `measured-now-redesign.html`
(open it — dark/light toggle top-right, and an **Auto-Pilot steer** toggle so you can watch the
new FORESIGHT conditional line appear and disappear).

**What I read.** `src/app.jsx` in `prepledger-dev` (v6.2.0, ~11.5k lines) read-only, plus the
live app. Two notes on version drift so the numbers make sense:

- The **live** site is still on **v4.1.6**; `prepledger-dev` is **v6.2.0**; the Auto-Pilot v7
  work is in the off-limits `prepledger-v631`. So the richest NOW I could actually read is
  v6.2.0 — that's what the audit below inventories. The v7 framing (Auto-Pilot as the face,
  cockpit status word, forecasting, phase arc) is folded in as the *direction of travel*.
- The four Obsidian context notes (`[[prepledger-v7-autopilot]]` etc.) aren't in the connected
  folder, so I reconstructed that context from `HANDOFF.md`, `GOALS.md`, `research-brief.md`
  and the source. If those notes contradict anything here, they win — flag it and I'll adjust.
- The **v7.4.1 FORESIGHT** change you sent mid-flight is designed into all three directions.

The mockup numbers (164.3 lb, BF 15% / 11.4–18.9, −0.7 lb/wk, TDEE 2450, 7.25 h, etc.) are
lifted from what the live app actually shows, so the layouts are tested against realistic
engine output — but they're **illustrative**. The design invents no number; the engine still owns
every figure.

---

## Step 1 — what's on NOW today (the inventory)

NOW currently renders **~30 distinct elements** in one scroll. Ranked by how directly each
serves the core job — *most drastic visual body-comp change, fastest, near-zero cognitive load* —
on an ordinary morning:

| # | Element (source) | Serves the core job? | Verdict |
|---|---|---|---|
| 1 | Header: title + `WK · D · phase · BF (band)` | High — orientation | **Keep**, slim |
| 2 | ANALYST / RULES buttons | Low daily | Keep (small) |
| 3 | Quick-log FAB (`+` sheet: weight/sleep/waist/close-day) | Med — fast capture | Fold into Capture |
| 4 | **THE READ · live** (`signalState`) — "is my body changing?" | **High** | **Promote / merge** |
| 5 | THE WHY-ENGINE (water-vs-real, conditional) | Med — only on a spike/stall | Keep, exception-only |
| 6 | **THE FIVE TODAY** (`fiveLevers`) | **High** — daily adherence | **Keep, Tier 1** |
| 7 | THE ONE THING (`theOneFix`) | High — the single fix | Merge into the action |
| 8 | **WHAT YOU OWE** (`nowFocus`) | **High** — today's action | **Promote to Tier 0** |
| 9 | **AUTO-PILOT** (`autoPilot`) — status/rate/mode/spark/proposal | **Highest** — the face | **Promote to Tier 0** |
| 10 | THIS WEEK · plan (goals / if-then / share) | Low daily | Tier 2 (stays a Group) |
| 11 | LAB LIVE news chip | Low | Keep, conditional |
| 12 | Chips: session ✓ / sealed / sync-fail / event | Low–med | Keep, conditional |
| 13 | BODY ALARM (RED/AMBER, conditional) | High *when it fires* | Keep, exception-only |
| 14 | Morning-minute / books-closed card | Med, time-aware | Fold into the action |
| 15 | **MORNING CAPTURE** (sleep + weight, big) | **High** — the owed inputs | Fold into action + Capture |
| 16 | BriefCard (analyst brief) | Med | Tier 2 · The read |
| 17 | ASK THE ANALYST | Low daily | Tier 2 · The read |
| 18 | ApprovalInbox (staged proposals) | High *when non-empty* | Tier 1 when non-empty |
| 19 | TODAY'S PROTOCOL (`dayProtocol`, ranked) | Med — overlaps The One Thing | Tier 2 · The read |
| 20 | EVENT MODE (conditional) | Med | Keep, conditional |
| 21 | AMEND / close-yesterday (conditional) | Med | Tier 2 · Capture |
| 22 | TODAY'S NUMBERS (cal/pro/steps + sodium/alc) | High *at night* | Tier 2 · Capture (time-aware) |
| 23 | CAFFEINE card | Low–med | Tier 2 · Capture |
| 24 | MEDS card | Low–med | Tier 2 · Capture |
| 25 | PULSE / TEMP card | Low | Tier 2 · Capture |
| 26 | WEEKLY DUE (waist / photos, conditional) | Med when due | Tier 2 · Capture |
| 27 | Filings card (conditional) | Low | Tier 2 · Capture |
| 28 | Session preview (`genSession`) | Med | Tier 2 · The room |
| 29 | RndCard (trials) | Low | Tier 2 · The room |
| 30 | WEEK IN REVIEW (Sun/Mon) | Med weekly | Tier 2 · The room |
| 31 | RECOVERY index (`recoveryIndex`) | Med | Tier 2 · The room |
| 32 | CLOSEST UNLOCKS (queue) | Low | Tier 2 · The room |
| 33 | **WHERE THIS PACE LANDS** (`currentRate`+`bfEst`) = FORESIGHT | High | **Tier 1 · merge into Trajectory** |
| 34 | HOUSE LAWS link / footer | Low | Tier 2 · The room |

---

## Step 2 — the diagnosis (why it feels cluttered)

Four concrete hierarchy problems, not a vague "too much":

**1. Six cards are all shouting "I'm the most important thing."** Above the first collapsible
group, NOW stacks THE READ, WHY-ENGINE, THE FIVE TODAY, THE ONE THING, WHAT YOU OWE and
AUTO-PILOT — each a full card with its own eyebrow and headline. When everything is a headline,
nothing is. **The eye has no first landing spot**, which is the exact opposite of near-zero
cognitive load. There is no Tier 0.

**2. The trajectory story is told three times.** "Are you changing / how fast / where does it
land" is answered by THE READ (#4), by AUTO-PILOT's rate line (#9), and again by WHERE THIS PACE
LANDS (#33) — three cards, three eyebrows, one question. This is the single biggest redundancy,
and it's the surface your new v7.4.1 FORESIGHT line lands on.

**3. "Log something" is spread across seven surfaces.** Quick-log FAB (#3), MORNING CAPTURE
(#15), TODAY'S NUMBERS (#22), CAFFEINE (#23), MEDS (#24), PULSE/TEMP (#25), WAIST/PHOTOS (#26).
Each is individually reasonable; together they turn a 30-second morning into a scroll-hunt.

**4. The one action you owe is buried in the middle.** `nowFocus` already computes the single
most important thing ("this morning you owe X") — but WHAT YOU OWE sits *below* four other cards,
so the thing the app is surest about is not where the eye lands.

The page already has good instincts — `nowFocus` time-awareness, the "THE REST OF THE DAY"
collapsible, static (non-rearranging) rooms. The fix is to **finish that instinct** with a strict
three-tier rank, not to add anything.

---

## Step 3 — the tier system (the spine of all three directions)

- **Tier 0 · the cockpit** — Auto-Pilot's status *word* + today's ONE action. First and largest.
  This is the half-second read: *am I on line, and what do I do now?*
- **Tier 1 · glanceable** — the five levers, and one merged **Trajectory** surface (the read +
  rate + FORESIGHT, told once). Visible without a tap; never competes with Tier 0.
- **Tier 2 · one tap down** — everything else, in **three fixed, labelled doors**: **Capture**
  (all logging), **The read** (brief, ask, approvals), **The room** (session, recovery, week,
  laws). Nothing is deleted; it opens in place and, per the code's own Findlater & McGrenere
  citation, **stays where you left it** — the room never rearranges itself.

Exception cards (BODY ALARM, WHY-ENGINE, EVENT, ApprovalInbox when non-empty) still interrupt at
Tier 0/1 *only when they fire* — a calm default that can still raise its voice when the data does.

---

## The three directions

All three respect the design system (palette, Barlow / Barlow Condensed / IBM Plex Mono, the
`Card`/`Eyebrow`/`H`/`Btn`/`SemTag` vocabulary), the charter (calm, honest, **no streaks, no
urgency, no countdowns, no gamification**), and engine-owns-numbers. They differ only in how far
they push the declutter and how the cockpit looks.

**A · The Cockpit — most aggressive.** One hero (Auto-Pilot status word + measured rate + a
corridor gauge), one action card, then **five labelled rows** (five / foresight / read / capture /
room) that open in place. Goes from ~30 cards to *two cards and five rows*.
*Prioritises:* a single unambiguous focal point. *Hides:* essentially everything behind rows.
*Risk:* you love the data — this hides the most of it, so it leans hardest on you trusting the
one-tap-down. Best if the goal is truly ruthless glanceability.

**B · The Briefing — recommended.** A slim status strip, the owed action *with its two inputs
inline* (log sleep + weight without leaving), the five levers as an inline strip, then a single
**Trajectory** card that finally merges the read + rate + FORESIGHT into one — then three doors.
*Prioritises:* a top-to-bottom morning scan that keeps the data glanceable. *Moves:* the seven
capture surfaces into one door; kills the trajectory redundancy. *Risk:* lowest — it's the
gentlest change to the existing frame, so it's the safest to build.

**C · The Instrument — most delightful, highest build.** Leads with the Auto-Pilot corridor as a
real **dial** (your rate is the needle), and turns FORESIGHT into a **timeline** where the
measured trend is a solid line and the plan-conditional steer is a **dashed fork**.
*Prioritises:* the "measured instrument" identity; makes the honesty visual. *Risk:* two custom
SVG instruments to build, test on iOS Safari, and keep honest across cold-start `n`; most
surface area for a bug.

**My recommendation:** ship **B's structure**, adopt **A's single-word cockpit hero** at the top
of it, and use **C's dashed-fork** as the FORESIGHT treatment if you want the timeline (or B's
subordinate line if you want it simpler). That hybrid is written up as the spec below.

---

## The FORESIGHT surface (v7.4.1) — real attention, as asked

The surface must carry two things at once, and never let them blur:

1. **The primary, measured projection** — the honest one. `currentRate` + `bfEst`: *"~161.5 lb in
   4 weeks at your measured −0.7 lb/wk. No date."* Marked **◆ measured** (brass), full weight.
2. **The subordinate, plan-conditional steer line** — appears **only when an Auto-Pilot steer is
   active**. *"if you hold this new target: ~7 wks to 12% · plan-conditional — not your measured
   trend yet."* Visually demoted and honestly tagged.

Three treatments to choose from (all in the mockup, toggle the steer to see them):

- **A — indented sub-line:** a `▹`-marked line beneath the measured projection, on a dotted
  orange rule, smaller, with the "plan-conditional" tag inline. Simplest, lowest risk.
- **B — inside the merged Trajectory card:** same idea, but the "plan-conditional — not your
  measured trend yet" caveat sits on **its own micro line** so the disclaimer can't be skimmed
  past. My pick for text-only.
- **C — the dashed fork:** on the timeline, the conditional is a **dashed orange line diverging
  from the solid measured line**. The honesty is in the *shape* — a glance tells you it's a
  softer, different kind of claim — with the words backing it up. My pick if you build the
  timeline.

Design rules for this line, whichever treatment wins:

- **Colour = provenance, reusing the existing system.** Measured is **brass ◆** (the app's
  "measured, n=X" tag); the conditional is **orange** (the app's existing "speculation" hue). No
  new token — you're spending colours the app already spends on exactly this measured-vs-inferred
  distinction.
- **Weight is subordinate:** one type-step down, never bigger than the measured line, always
  *below/after* it.
- **It is gated, not always-on:** absent whenever no steer is staged (verified in the mockup —
  toggle steer off and it's gone, cleanly).
- **The words are non-negotiable:** it always carries "plan-conditional" and "not your measured
  trend yet." This is the same principle as the code's rule that a number without its provenance
  is a claim, not a measurement.

---

## How the same hierarchy extends to the other pages (high level)

The tier idea is portable; each room gets **one Tier-0 answer**, then detail one tap down:

- **TRAIN** — Tier 0 is *today's session, one lift at a time* (Gym Mode is already this instinct).
  The desk chips, load ladders, RIR history and debrief are Tier 2 detail. Don't open on a wall
  of lifts; open on "here's set 1."
- **BODY** (rarely opened) — Tier 0 is the **BF band + measured rate with its honest interval**
  (one hero, `bfEst`/`currentRate`). The waist/photo/pulse/temp histories are Tier 2. Because it's
  rarely opened, it should answer "where am I, how sure are we" in one screen.
- **LAB** — Tier 0 is *the one instrument with a live verdict* (or "counting only" when `n` is
  short — instruments gate on `n`, never fake a verdict). The shelf of trials/dossiers is Tier 2.
- **MORE** — is the Tier-2 index already; keep it a clean list, not a second dashboard.

One rule across all of them: **the hero is a measured answer with its uncertainty, the tiers are
the receipts.** Same calm-default / raise-voice-on-data behaviour as NOW.

---

## First-cut implementation spec (for Claude Code, once you pick)

Written for the recommended **B + cockpit hero + FORESIGHT** hybrid; the pieces are modular, so
swapping in A's or C's treatment is a local change.

**Scope guardrails (all satisfied by this being a presentation-layer change):**

- **No data-model change. No new stored fields. Nothing persisted, nothing mutated.** This is
  re-grouping existing components + one *read-only* selector.
- **No new numbers.** Every value stays sourced from its existing engine function; the UI
  formats, never computes.
- **Honour the non-negotiables in `CLAUDE.md`:** 16px inputs; don't re-architect the layout frame
  (keep `minHeight:100vh` shell + fixed bottom tab bar + safe-area on the tab buttons only);
  rooms stay static (no self-rearranging promotion); collapsed stays collapsed; proposals still
  flow through the approval inbox — *nothing mutates itself*.
- **iOS Safari first.** It's a pure `NowTab` re-layout; walk the render-smoke states (empty /
  seed / full) and eyeball on iOS before shipping. Ship from a branch, never `main`.

**What changes (all inside `NowTab`, ~lines 7762–8800):**

1. **New Tier-0 cockpit** at the top of `NowTab`, replacing the current stack order. Reuses
   `autoPilot(s, apMode)` verbatim. The **status word** is a pure label map over the state the
   engine already returns — *no new number*:
   - `ap.action==="hold"` → `ON YOUR LINE`
   - `ap.action==="ease"` → `EASE BACK`
   - `ap.action==="tighten"` → `ROOM TO PUSH`
   (bulk vs cut wording already exists in `ap`). Keep the mode toggle, `measured TDEE / n /
   corridor` line, and `Spark`. The proposal/stage buttons stay exactly as-is (still stage into
   `s.proposals`; still "Not now").
2. **Merge the READ into the cockpit's second line.** `signalReadCopy(s, signalState(s))` already
   returns `{sentence, word, wordColor}` — surface `sentence` as the cockpit sub-line instead of a
   separate THE READ card. (WHY-ENGINE stays a separate exception-only card, unchanged.)
3. **The one action** = `nowFocus(s).lead` (`WHAT YOU OWE`) as the Tier-0 action card, with
   `theOneFix` folded in as the "why" when its rung isn't `logging`. In **B**, drop the two
   most-owed inputs (sleep + weight from MORNING CAPTURE) inline here so the #1 action completes
   without navigating — same `applyRead`/`runAdaptive`/sleep-log writes, just relocated.
4. **Tier 1:** `fiveLevers(s)` as the inline strip (unchanged selector), and a single **Trajectory**
   card = READ sentence + `currentRate` projection + the FORESIGHT block. Delete the standalone
   WHERE THIS PACE LANDS card (its content moves here) — this removes the 3× redundancy.
5. **FORESIGHT wiring (the v7.4.1 line).** Add one **pure, read-only selector** so the UI computes
   nothing:
   - `foresightConditional(s) → { active, wks, targetLabel, basisPct } | null`
   - `active` is true only when an Auto-Pilot steer is staged (there's an unresolved
     `ap_*` proposal in `s.proposals`, i.e. `autoPilot(s).proposed` / a staged cal/steer target).
   - `wks`/`targetLabel` derive from the **steer's target rate** (`ap.targetPct` / `ap.band.corrLb`)
     against `bfEst`/`s.trend` — the same maths the measured projection uses, just fed the target
     rate instead of the measured rate. Returns `null` when no steer → the line is simply absent.
   - The component renders the measured projection always; renders the conditional line **only if
     `foresightConditional(s)` is non-null**, one step down, orange, always tagged
     "plan-conditional — not your measured trend yet."
   - Add it to the `__test` export and assert: (a) `null` with no staged steer; (b) non-null and
     correctly labelled with one; (c) it never exceeds the measured line's visual weight. (The
     gate's `MIN_ASSERTIONS` floor means new assertions are welcome.)
6. **Tier 2 = three `Group`s** ("CAPTURE", "THE READ", "THE ROOM") using the existing `Group`
   component. Move the existing cards under them **unchanged** — every input keeps its own state,
   `saveDaily`, `fixWindow`, sodium/alc, caffeine/meds/pulse/temp/waist/photo writes, `dayCtx`
   estimate logic, amend-yesterday, midnight-intercept. `defaultOpen` stays time-aware
   (`new Date().getHours()`), exactly as the current groups already do.
7. **Delete nothing engine-side.** WHY-ENGINE, BODY ALARM, EVENT, LAB LIVE, ApprovalInbox keep
   their existing gates and positions (ApprovalInbox promotes to Tier 1 when non-empty).

**Net effect:** same components, same numbers, same writes — re-ranked into Tier 0 → 1 → 2, the
trajectory told once, capture behind one door, and the new FORESIGHT conditional line added as a
gated, honestly-labelled, engine-owned selector. A `NowTab`-local diff; no migration, no schema
bump, no risk to `ledger/` data.

---

*Pick a direction (and a FORESIGHT treatment) and I'll turn this into the concrete build spec for
Claude Code.*
