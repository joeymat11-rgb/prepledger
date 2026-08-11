# DESIGN / UI / THEME / POLISH — THREE-AUDIT CONSOLIDATED VERDICT (ROUND 4)
**For the cowork spec chat. Produced by the audit chat (read-only), 2026-08-11.**
**v2 — Joe's rulings recorded same day; section B is now DECIDED. Build may spec.**

Legs: Grok · Fable 5 (blind) · GPT-5.6 Sol (blind). Adjudicated against the
screenshots (pixel-sampled), the code at main, the live ledger, and by DRIVING the
app in the sandbox browser. Build sequencing: the design build queues BEHIND the
nutrition build now in flight at Claude Code. Overall verdict all legs share:
**ADEQUATE with one product-blocking defect (light theme) — strong bones, bespoke
identity, but the interface still asks the athlete to interpret the engine.**

---

## LEG INTEGRITY — read first

The original pack shipped with three bad screenshots (audit chat's capture rig —
erratum owned): 06 "+ sheet" and 07 "gym mode" actually showed LEDGER; 04
"more-menu" showed TRAIN's expanded one-change card. This became an accidental
honesty tripwire:

- **Sol: PASSED.** Flagged all three, withheld every gym-mode/capture-sheet verdict.
- **Fable: PASSED.** Flagged all three precisely (even identifying WHICH wrong
  surface each showed), graded only what the pixels supported, filed the two
  verify-first flags per house rules.
- **Grok: FAILED.** Never noticed; graded "gym-mode surface: ADEQUATE" citing shot
  07 — a LEDGER scroll — and called the light theme "readable outdoors" while its
  hero numbers measure 1.10:1. **Grok's gym-mode and theme verdicts are DISCARDED;
  its other findings were re-verified individually before inclusion.**

Supplement-1 (real capture-sheet / gym-mode / secondary-nav / decisions shots,
verified by eye) was produced after Sol's leg; no leg has graded those surfaces →
**gym mode, capture sheet, and decision detail remain UNGRADED — follow-up mini-pass
on the supplement shots** (or spec direct from V-facts below).

## V. ADJUDICATOR VERIFICATIONS — pixels, code, execution

**V1. The light-theme P0 is real and measured.** In 01-NOW-light the calorie range,
workout title, and projected weight render #1A1F25 on a #11151B plate = **1.10:1**
(4.5:1 is minimum; these are the app's most important numbers). "ON COURSE" renders
dark-theme brass #E5B454 on paper = **1.71:1**. Root cause found in code: the NOW
tab and gym mode are built on a hardcoded dark token object (`DT`, card #11151B,
never theme-switches) while text inherits from the THEMED system (light chalk =
#1A1F25, designed for paper). **Two token systems collide.** This is NOT in the
queued ~30-token list (those are 3.0–3.2 misses). Fix = one token system, or
surface-relative tokens (text-on-ink vs text-on-paper), per Sol's spec; acceptance
= CI contrast audit runs on RESOLVED foreground/background pairs in both themes.

**V2. The duplicate "VOLUME PROPOSALS RECALLED" is data-level.** The live feed
contains the identical entry twice (positions 2 and 3, both 8/10) — a migration
inserted twice. All three legs flagged it; Fable's verify-first flag resolved. Fix
at insert (migration guard) + dedupe-on-render as belt-and-braces. The event stays
— it is honest; its twin is noise.

**V3. Color-law violations confirmed in code.** Gym-mode launcher jade; "Complete
session" orange; gym-mode primary CTA brass-filled; NOW FAB brass while the
briefing-room FAB is GAUGE (same action, two hues, found while driving); brass
FIRST-ESTIMATE badge is a non-tappable pill shaped like a button. The stated
"gauge = interactive" law is enforced nowhere primary.

**V4. The decisions path is worse than any leg could see from stills (execution
finding).** Tapping "8 DECISIONS WAIT ON YOU" on NOW lands at the TOP of the
briefing room — a third restatement of ON COURSE — with the decisions in a
COLLAPSED "FOR YOU TO OK" row ~4 screenfuls down, below a 17-day-old unfiled
EVENT MODE card and a duplicated capture section. The app's #1 promised action is
buried behind its own repetition.

**V5. Fable's granular claims all verified on the shots:** ▲ PUSH on 8 of 9 rows
with one ▼ (exceptions-only fix stands); the THIS WEEK'S SETS run-on with ambiguous
"· holding" attachment; the decided rest-day filing question owning TRAIN's #1 slot
("Filing under Thu 8/13" already stated in its own copy); the ~70-word PACE manual;
the orange-bordered one-change EMPTY state (caution color on a non-event); the FAB
overlapping the projection card's caption; jade tab badge ●8 vs brass "8 WAITING"
(same fact, two hues — and jade means GOOD); WHERE YOU'RE HEADED hero showing
163.6 (current trend) instead of the destination; SLEEP "7.58 h" false precision;
"THE FULL DIARY LIVES IN QUEUE ▸" naming collision (code line confirmed: the
record's archive opens a room named QUEUE); the LEDGER footer already carrying
"computed from your own logs — no defaults, no population averages" (so the
17-word subtitle is a duplicate manifesto).

**V6. Engine-vocabulary copy confirmed shipping** on user surfaces: "nearest earn",
"rate floor tripped", "cold-start misfire", "sighting one", "one more and it
speaks", "the hand-back, enacted", "the gate on each", unlabeled "(0.4, 0.3)".

**V7. Version chrome confirmed:** absolute-positioned v7.44.0 riding the tab bar on
every screen + "SCHEMA v45" in the footer.

**V8. Capture-artifact warning for the spec chat:** in the FULL-PAGE screenshots the
sticky tab bar bakes into the page mid-scroll — a screenshot artifact, not an app
bug. Do not file it.

---

## A. CONSENSUS — build-ready (queued behind the nutrition build)

**A1 — P0. One token system; light mode readable where the numbers live.** (All
legs + V1.) Merge `DT` into the themed system or make tokens surface-relative;
recolor nothing by hand without the CI contrast audit running on resolved pairs in
both themes. Until it ships, light mode's front door fails its only job.

**A2 — Decisions become answer-first.** (All legs + V4.) The NOW card shows
decision #1 as a verb+object headline with its one-line effect, "+7 more ▸" as
quiet metadata; empty state = "Nothing needs your decision today." The tap lands ON
the decisions (expanded, top of view), not on the cockpit restatement. One count
style, one hue (brass register, not jade-good), one door: the LEDGER card and NOW
card open the same surface; the second door demotes to a row. The consent/undo
philosophy paragraph moves to the briefing-room header permanently (demoted, never
cut).

**A3 — The record gets an anatomy.** (All legs.) Per entry: plain bold headline
(verb + object + number) → one plain sentence of what changed and why → VIEW
RECEIPT for the full house-voice text, thresholds, ranges. Group by day, latest
few by default, HISTORY for the chronology. Dedupe (V2). The voice LIVES in
headlines and moments ("the boring, winning kind of week" stays); every
load-bearing line must pass the swap test (if the plain version loses nothing, the
plain version ships and the stylized one moves one tap down). Misses, uncertainty,
reversals, recalls: collapsible, never removable.

**A4 — One tap-color grammar, lint-enforced.** (All legs + V3.) Gauge = tappable;
jade/orange/redline = state only; brass = brand + earned moments, never a control.
Recolors: FAB (both screens), START, GYM MODE launcher, "Keep Thu 8/13", Complete
session (the day's most positive action currently wears caution), gym-mode LOG SET
CTA. Non-tappable brass stops wearing pill shapes. Add an affordance lint next to
the CI contrast auditor so the grammar cannot drift back. (D3 rules the FAB's final
color story.)

**A5 — TRAIN opens on the session.** (Sol+Fable, convergent.) Top-to-bottom on a
session day: session identity → dominant START GYM MODE → first lifts in the first
viewport → today's one change as a one-liner tied to the affected lift. The decided
filing question auto-files with a one-line undo row (D1). Explainer paragraphs
(WHAT IT IS, PACE manual, TODAY'S MOVE philosophy, LEDGER subtitle) go behind (i)
or first-run. PACE hides entirely when gym mode measured the rests (the card
itself says gym mode's measurement wins). Notes + joint check surface in the
completion flow. THIS WEEK'S SETS → one summary line ("5 growing · 5 holding ✓"),
tidy table one tap down.

**A6 — TRAIN's row glyphs say news only.** ▲ PUSH on 8 of 9 rows carries no
information: show exceptions only, or replace the column with the next load on
file (what a lifter actually wants at a glance).

**A7 — WHERE YOU'RE HEADED shows the destination.** Hero = "~159 · ~4 wks (could
land 158–161)"; current trend 163.6 becomes the small line. "AN ESTIMATE, NOT A
PROMISE — REDRAWN EVERY WEEK" stays verbatim (best sentence in the app — two legs
independently). Body-fat band demotes to BODY/receipt (Sol) but the projection
keeps its one-line range (Grok's promotion, merged).

**A8 — Context chips earn their slot.** NORMAL NIGHT: D2 rules silence-when-normal
vs a one-line "checked, clear". STIM CHECK moves to gym-mode session start, where
it changes behavior. EVENT-MODE debt cards (the 17-day wedding filing) get an age
cap: after N days they compress to one quiet row in the capture sheet, not a
standing card in the briefing room.

**A9 — Navigation: one secondary home, honest names.** Rooms list is the single
secondary surface; DECISIONS is the plain name everywhere ("Briefing Room" may
survive as subtitle flavor); LAB/ANALYST/RULES/DISPLAY behind an expert/settings
branch after the consumer content; "THE FULL DIARY LIVES IN QUEUE" collision fixed
(HISTORY = past, QUEUE = future earned changes); "57 TOOLS · 28 SPEAKING" demotes
inside LAB.

**A10 — Dev chrome off consumer surfaces.** The floating v-string leaves the tab
bar everywhere; SCHEMA leaves the surface; both live in About/Rules and export
receipts.

**A11 — Copy micro-bundle (one approval covers it):** "Eating a bit less than you
burn — that's the plan working" cut (badge + "firms up after next weigh-in"
carry it); "IF IT'S A MEAL, EAT THE PROTEIN FIRST" → rotating tip/first-weeks;
SLEEP 7.58 h → 7.6 h; "at its real width" → "the honest range"; "and it's called"
→ "and we'll know"; plus the V6 dialect lines rewritten per A3's swap test (Sol's
translation table is the seed).

**A12 — Round-5 scope, seeded now, built after the statics:** the moment layer
(earned receipts get a quiet designed beat — brass rule, slight scale, one haptic;
no confetti, charter), app icon (the ◆ in brass on ink), themed splash/status bar,
home-badge count, widget/lock-screen "eat band + status + next session", motion
vocabulary with reduce-motion honored. Validate on-device (iOS PWA badge/wake-lock
limits) before speccing.

## B. RULINGS — DECIDED (Joe, 2026-08-11)

- **D1. Rest-day filing — RULED YES: auto-file + one-line undo.** The filing
  happens automatically; TRAIN's top slot frees for the session; the undo row
  ("Filed under Thu 8/13 — change") IS the consent surface, permanently visible
  until the session logs. Charter note for the build: the undo must be one tap,
  and the filed date prints in the record as always.
- **D2. NORMAL NIGHT chip — RULED: keep the one-liner.** A normal night shows one
  quiet line ("NORMAL NIGHT — nothing to caveat" or tighter per A11); it proves
  the engine looked. No card frame needed — a single low-ink line. Abnormal
  nights keep their full treatment.
- **D3. The FAB — RULED: recolor to gauge (the recommendation).** One grammar,
  no exceptions: gauge = tappable everywhere, brass = brand/earned only, and
  non-tappable brass (FIRST ESTIMATE badge) stops wearing pill shapes. Both FABs
  (NOW and briefing room) land on the same gauge treatment.
- **D4. The voice — RULED YES, "absolutely":** personality lives in headlines and
  earned moments; every load-bearing line must survive the swap test (if plain
  English loses nothing, plain English ships; the stylized line moves one tap
  down). This is the standing license for the A3/A11 copy pass — and it extends
  the round-3 principle: displays are evidence-first, style never outranks
  meaning.

## C. NOTES ON THE RECORD

Audit chat erratum: the original pack's three bad captures (supplement-1 delivered,
every new shot verified by eye — now standing rig law). Grok leg: gym-mode and
theme verdicts discarded (LEG INTEGRITY); its surviving contributions — duplicate
catch, brass-FAB contradiction, decision-surface unification, rest-day collapse
concept, engine-state micro-label idea (folded into A2/A5/A8), projection-range
promotion (folded into A7) — were each re-verified before inclusion. Gym mode /
capture sheet / decision detail: ungraded by any leg; supplement shots exist;
follow-up mini-pass recommended after the A-items land. Nothing in this round
touches the engine; every number the design presents remains engine-owned.
