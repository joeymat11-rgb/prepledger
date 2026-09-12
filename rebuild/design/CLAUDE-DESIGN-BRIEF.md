# Earned: design brief for Claude Design

This is everything a designer needs to draw Earned well. It describes the product, the two people who use it, the look that is already approved, every screen (built and missing), the exact words the app uses, the states each screen must show, and the rules that are not negotiable. Design freely within them.

## 1. What Earned is

A personal training, nutrition and recovery coach that lives on one phone and works offline. It plans each gym day, tells the athlete what to eat, watches recovery, and adjusts the plan over time from what actually happened. Two people use it: Joe (the owner, an experienced lifter, coming from a much denser app he built for himself) and his dad (a beginner who has never used a training app). The same screens serve both. A beginner must never feel overwhelmed; an enthusiast must still feel engaged: simple by default, depth one tap away.

The product goal, in the owner's words: an individualized, coherent training, nutrition, recovery and lifestyle plan that adapts to credible response and reduces daily mental work.

The one moment the owner would demo: open the app, talk to the coach about what you are hitting today, ask it what your seat setting is on a machine. "For a beginner this is the moment it stops feeling like an app."

## 2. Principles the design must express

- Plan first. Today opens on what to do, not on data.
- Nothing is guessed. If the app does not know something it says so plainly ("Not available yet", "no reading") and never shows a placeholder number, a zero, or a default pretending to be a fact.
- Every number comes from the engine. The screens display; they never compute or invent.
- Blank is unknown. On the check-in, an unselected answer is unknown, never "fine". A selected answer can be cleared.
- Refusals speak. When something cannot happen (weight out of range, session cannot be opened yet), the screen says why in the app's own words.
- Honest empty states on day one. A fresh athlete sees an empty, truthful screen, not sample data.
- Nothing mandatory beyond logging. The check-in, notes and details are optional and nearby, never gates.
- Coaching is never more conservative than credible athlete data, and never a score. No readiness score, no pain score, no penalty.

## 3. The approved look (design of record, Sept 8 2026)

Keep this. Evolve within it unless the owner says otherwise.

- Palette: paper #F4F0E8 (surfaces), ink #1C1B18 (text, primary buttons), muted #5A5348 (secondary text), hairline #D8D0C2 (rules), green #2E5A3C (accent, labels, focus ring), ground #E7E1D4 (page behind the phone).
- Type: Instrument Serif for headings and key values (h1 47px/1.04, letter-spacing -0.025em; h2 30px/1.15; large numbers 37px), Instrument Sans for controls and explanatory text (16px/1.45 body, 15px field labels, 14px small, 13px hints).
- Layout: one column, 390 × 844 phone, 25px/23px page padding, hairline-separated sections, generous space. Primary action is a full-width ink button (58px tall, 14px radius, label left, arrow right) and it must sit inside the first viewport on every screen state.
- Controls: 44px minimum touch targets, 48px inputs at 16px text (so iOS never zooms), 9px input radius, pressed chips invert to ink on paper, an "I'm not sure"/unsure chip renders muted.
- Tone: calm, plain, unhurried. Short sentences. No exclamation marks. No emoji.
- Copy rule (owner ruling): no em dashes or en dashes anywhere in the UI. Use a colon, a comma, "to" for ranges, or a new sentence.
- Reference files (in the repo, rebuild/m1/approved-2026-09-08/): Earned-additions-C-approved.html (authoritative), Earned-refinement-A.html (Today + workout logging), PNGs of each.

## 4. Screen inventory and what each must show

Each screen below lists its purpose, its content, its states, and the words it uses today. Draw every state named; the states are where design usually fails.

### 4.1 Today (built)
Purpose: the plan for today, in one glance, with the day's actions.
Content, top to bottom: brand "Earned" and the date; "Your plan for today" label; the headline instruction (a serif sentence from the engine, e.g. "Find your working weights.", "Rest today.", "Hold the line."); a short plain-language line under it; nutrition block "Eat about" with the qualified calorie target and protein (or "Not yet: Earned sets this from your own weigh-ins, and it has none."); the morning weigh-in (a number field, 60 to 400 lb, one decimal; "Saved" only after the phone has durably stored it; the engine's note beside a reading, e.g. "spike: damped in trend"); the training block (session kind, lifts, count) with the primary "Start upper body" button; entries to the recovery check-in and the coach; a "report a problem" control (planned).
States: fresh athlete with nothing recorded; a normal training day; a rest day; a day with a proposal that needs a yes ("One call needs you"); refusal of an out-of-range weight; offline-ready indicator after the app is installed.
Note: 15 different engine headlines exist and some are three lines; the headline may shrink (47 to 33px) but never truncate.

### 4.2 Gym card (built)
Purpose: run the session with the least possible attention.
Flow: Start; active set (the engine's prescription, weight and reps, shown separately from the editable performed weight and reps; "last time" line from the previous session); log the set with an effort word (plain language, plus an explicit "unknown"; nothing preselected); saved set and rest state (stored facts, Undo, the next set named); finish; Today reflects it; resume mid-session after a kill; recovery offered for an abandoned session.
Rules: no rest timer (the engine prescribes none); no skip yet (planned); the recovery check-in is reachable from the active set and returns to it with the half-entered set intact.
States: first session ever ("Find your working weights"), a normal set, a refused Start ("This session cannot be opened yet" with the reason), resume, finished.

### 4.3 Recovery check-in (built)
Purpose: a low-burden physical check-in, never a questionnaire score.
Content: sleep hours (approximate) and sleep quality separately; energy; muscle soreness; stress; then conditional details only when relevant: soreness location and effect on movement; pain location, triggering movement, new/worse/ongoing/improving, functional impact; illness symptoms and onset; time away, duration and optional reason. Optional note, initially collapsed.
Rules: all answers start unselected; tap again clears; blank is unknown; an existing dated night is reused with its provenance shown rather than asked twice; yesterday's answers never carry into today; "Recorded today at …" on reopen; a new day starts blank. This screen is a scrolling form; the primary action must be visible once scrolled to.

### 4.4 First-run setup (built, six screens, being revised)
1. "Let's set up your week." What should we call you?
2. "Which days?" The athlete picks only the days; Earned proposes each day's kind (upper, lower; full body coming) by a stated rule; any day can be overridden. With two days: "With two days, Earned's full-body plan is coming; for now one upper day and one lower day."
3. "What you'll do." Two doors: "Build my week for me" (a starter week from a catalogue) or "I'll choose". A catalogue of common gym exercises with aliases and the muscles each works (main muscle, region, secondary), searchable by name or by "what do you want to work?". A custom-exercise picker in two layers: six groups first (chest, back, shoulders, arms, legs, core), regions on tap (front/side/rear delts; lats, upper back, traps, lower back; biceps, triceps, forearms; quads, hams, glutes, calves; abs). Earned proposes the standard start (3 sets, aim for 10 reps) already filled in; the athlete can change it. No weights are asked for; the first session finds them.
4. "What the weights do." Per machine: lightest setting and smallest jump (blank means the 5 lb standard step); optional list of uneven settings.
5. "Anything in particular?" Priority muscles, skippable.
6. "Here's your week." A summary, one line per day, equipment, the shared settings, what matters most; if anything is missing, one full sentence per gap and the start button disabled; an unnamed exercise reads "One exercise (unnamed)".
Then Today for a first-timer: "Find your working weights."

### 4.5 Nutrition (approved design, not built yet, queued next)
Purpose: log the day's food quickly and see the plan.
Content: today's calories and protein entered as totals (the engine's own units); the plan detail with separately typed protein, carbohydrate and fat, each qualified (target, minimum, range, not prescribed, or unavailable) with the meaning shown, never invented tolerance; "Eat about [target] kcal" only when the target's meaning allows it.
States: nothing logged today; logged; the plan unavailable ("Not yet"); editing an earlier entry.

### 4.6 Sleep entry (missing, queued next)
Purpose: record last night in seconds.
Content: bed time and wake time, or hours asleep; optional quality (already on the check-in; reuse, do not ask twice). Shows the recorded night with provenance if one exists for the date.
States: no night for today; recorded; correcting.

### 4.7 Edit my week (missing, queued)
Purpose: change days, exercises, machine settings and priorities after setup, one thing at a time, with the same vocabulary as setup.

### 4.8 Coach (approved direction; text prototype exists; screens planned)
Purpose: the demo moment. A quiet entry on Today ("Talk to Earned"); a conversation view; a visible listening indicator; a text mode for loud gyms; "I'll tap instead" always available.
Wave one it must support: "What am I hitting today?" (the day read back with the why), "What's my seat on the chest press?" (stored machine settings, or "I don't have it yet; tell me while you're there and I'll keep it."), "One-ten for eight" (logs a set, confirms, names the next), "Why is today lighter than last week?" (the engine's stored reason).
Rules the design must make visible: every number it says comes from the engine; a plan change is a proposal you say yes to; it never gives medical advice; audio leaves the phone only during a session and the user opted in.

### 4.9 Also planned, lower priority
Skip or correct a session; history and progress (what you have lifted, trends, in your own numbers); the import screen for Joe's history; settings.

## 5. Vocabulary the app already uses (keep it)
"Your plan for today" · "Eat about" · "Find your working weights." · "Rest today." · "Saved" · "Recorded today at" · "Not available yet" · "no reading" · "not wired yet" · "One call needs you" · "Start upper body" / "Start lower body" · "Last time" · "Undo" · "I'm not sure" · "unknown" · "Earned's standard start" · "our standard step" · "One exercise (unnamed)" · "Here's your week." · "Earned can't build your week yet" · "Talk to Earned" · "I'll tap instead".

Muscle labels as the engine spells them: chest, back, delts (front, side, rear), biceps, triceps, forearms, abs, quads, hams, glutes, calves.

## 6. Constraints that shape the design
- One phone, offline-first, installed from Safari to the home screen (standalone, full-bleed). No accounts, no sync, no server for anything but the coach's voice.
- Real numbers only. The prototype's numbers (2,300 kcal, 160 g, 235 lb…) are fictional and must be visibly placeholders in a mockup, never suggested defaults.
- No dashes (em or en) in any UI text. No emoji. No exclamation marks.
- Touch targets 44px, inputs 48px at 16px text, primary action in the first viewport, no horizontal overflow, works at 375 px wide.
- No rest timer, no readiness score, no pain score, no body diagram, no mandatory notes.
- Two users, one design: beginner-safe by default, depth on tap.

## 7. What to deliver from Claude Design
- One artboard per screen state, 390 px wide, named "Screen · State" (e.g. "Today · fresh athlete", "Gym card · active set", "Setup 2 · two days").
- Keep the current look on the left and the proposal on the right for any screen being changed, so the owner can compare.
- Use the exact vocabulary above unless the change is the point; mark any new number as fictional.
- Notes per artboard: what changed and why, in one or two sentences.

## 8. How a design gets into the app
The owner says which screens to adopt. The PM records the new design of record (a checksum in the ledger, like Sept 8), and the build lane rebuilds those screens to it with one independent reviewer and the automated checks. The old design stays deployed until the new build merges. A mockup is a picture of the screen; the engine, the store and the coach are what make it work, so adoption is always "rebuild to this look", never a swap.
