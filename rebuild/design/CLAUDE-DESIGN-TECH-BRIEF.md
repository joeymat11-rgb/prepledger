# Earned: technical design brief for Claude Design

Paste Part A into Claude Design first. Then follow Part B step by step, one prompt at a time, and use the checklist in Part C to choose between what it shows you. Do not skip steps and do not merge them; each step narrows the design before the next one widens the work.

---

## PART A. Paste this into Claude Design as your first message

You are designing Earned, a personal training, nutrition and recovery coach that lives on one phone. Two people use it: Joe, an experienced lifter, and his dad, a complete beginner who has never used a training app. The same screens serve both. A beginner must understand each screen in five seconds; an enthusiast must find depth one tap away.

### What the app does
It plans each gym day, tells the athlete roughly what to eat, records what happened (weigh-ins, sets, sleep, food, a short recovery check-in), and adjusts the plan over time from real data. A voice coach can be talked to during a session ("what am I hitting today", "what's my seat on the chest press", "one-ten for eight"). The demo moment is opening the app and talking to the coach about today.

### Technical requirements (fixed; design inside them)
1. Platform: a web app installed from Safari to the iPhone home screen. Full screen, no browser chrome. Design at 390 x 844. Must also work at 375 wide; 320 wide must not break.
2. Offline first. Everything is stored on the phone. No accounts, no sign-in, no sync, no server, except the voice coach's audio during a session the user opted into.
3. Every number on screen comes from the engine (the planning code). Screens display; they never calculate, estimate or invent. If the engine has no value, the screen says so in words ("Not available yet", "no reading"). Never a placeholder number, never a zero standing in for unknown.
4. Blank is unknown. On the check-in, an unselected answer means unknown, never "fine". A selected answer can be cleared by tapping again.
5. Refusals speak. When something cannot happen (weight out of range, session cannot start yet, save failed), the screen says why in one plain sentence and confirms nothing was recorded.
6. Day one is honest and empty. A fresh athlete sees truthful empty states, not sample data.
7. Nothing is mandatory beyond logging a set. Check-in, notes, sleep and food are optional and nearby, never gates.
8. No readiness score, no pain score, no rest timer, no body diagram, no streaks, no badges.
9. Copy rules: no em dashes or en dashes anywhere (use a colon, a comma, "to" for ranges, or a new sentence). No emoji. No exclamation marks. Short sentences. Calm, plain, unhurried.
10. Controls: touch targets at least 44 px; text inputs 48 px tall at 16 px text (so iOS never zooms); the primary action is one full-width button and it must sit inside the first screen height in every state; no horizontal scrolling ever.
11. Any number you draw is fictional. Mark it as such in the artboard notes. Never present a drawn number as a default.

### The approved look (start here; you may evolve it, not replace it without saying so)
Palette: paper #F4F0E8 surfaces, ink #1C1B18 text and primary buttons, muted #5A5348 secondary text, hairline #D8D0C2 rules, green #2E5A3C accent and focus, ground #E7E1D4 behind the phone.
Type: Instrument Serif for headings and key values (h1 47/1.04 with letter-spacing -0.025em, h2 30/1.15, big numbers 37). Instrument Sans for controls and body (16/1.45 body, 15 labels, 14 small, 13 hints).
Layout: one column, 25 px side padding, hairline-separated sections, generous space. Primary button 58 px tall, 14 px radius, ink on paper, label left and arrow right. Inputs 9 px radius. Pressed chips invert to ink on paper.

### Screens, in the order the athlete meets them
Each has the states it must show. Draw every state; states are where designs fail.

S1 First-run setup, six steps, one screen each.
 1 "Let's set up your week." What should we call you?
 2 "Which days?" Pick only the days. Earned assigns each day upper or lower by a stated rule (full body for two or three days is coming). Any day can be overridden. States: 2 days, 3 days, 4 days.
 3 "What you'll do." Two doors: "Build my week for me" or "I'll choose". If choosing: six groups (chest, back, shoulders, arms, legs, core), then a region where it matters (front, side, rear delts; lats, upper back, traps, lower back; biceps, triceps, forearms; quads, hams, glutes, calves; abs), then a searchable catalogue. Sets and reps are pre-filled with Earned's standard start (2 sets, aim for 10 reps) and editable. No weights asked; the first session finds them. States: build-for-me result, choosing a group, choosing a region, searching, an exercise added.
 4 "What the weights do." Per machine: lightest setting and smallest jump; blank means the 5 lb standard. Optional uneven settings list.
 5 "Anything in particular?" Priority muscles, skippable.
 6 "Here's your week." One line per day, equipment, what matters most. If something is missing: one full sentence per gap and the start button disabled.

S2 Today (home). Top to bottom: "Earned" and the date; "Your plan for today"; a serif headline from the engine ("Find your working weights.", "Rest today.", "Hold the line."; headlines can be three lines, may shrink to 33 px, never truncate); one plain line under it; "Eat about" with calories and protein, or "Not yet: Earned sets this from your own weigh-ins, and it has none."; the morning weigh-in field (60 to 400 lb, one decimal, "Saved" only after it is stored, an engine note beside a reading such as "spike: damped in trend"); the training block with the primary "Start upper body" button; entries to the check-in, sleep, nutrition and "Talk to Earned"; a small "Report a problem" control. States: fresh athlete with nothing recorded; training day; rest day; "One call needs you" (a proposal that needs a yes); out-of-range weight refused; offline-ready indicator.

S3 Gym card. Start; active set (the engine's prescription, weight and reps, shown separately from the editable performed weight and reps; "Last time" line); log the set with an effort word (plain words plus "unknown"; nothing preselected); saved set with Undo and the next set named; finish; resume after the app was killed mid-session. States: first session ever ("Find your working weights"), a normal set, refused Start with the reason, resume, finished. The check-in is reachable from the active set and returns with the half-entered set intact.

S4 Recovery check-in. Sleep hours and sleep quality (separate); energy; soreness; stress; then details only when relevant (soreness location, pain and whether it is new or improving, illness, time away). Optional note, collapsed. All answers start blank; tap again clears; "Recorded today at ..." on reopen; a new day starts blank. A scrolling form; the primary action is visible once scrolled to.

S5 Sleep entry. "Night of {date}". Either bed time and wake time (with optional minutes awake) or "About how many hours did you sleep?". Reuse the check-in's quality, never ask twice. States: empty, times mode, hours mode, reused from check-in, recorded, correcting, invalid ("Enter both times." then "Nothing was recorded."), saved.

S6 Nutrition. Today's calories and protein entered as totals; the plan detail with protein, carbohydrate and fat, each labelled by what it means (target, minimum, range, not prescribed, unavailable). "Eat about" only when the engine allows it. States: nothing logged; logged; plan unavailable ("Not yet"); editing an earlier entry.

S7 Coach. A quiet entry on Today ("Talk to Earned"); a conversation view; a visible listening indicator; a text mode for loud gyms; "I'll tap instead" always visible. It must make visible that every number it says comes from the engine, that a plan change is a proposal you say yes to, that audio leaves the phone only during a session you opted into, and that a session ends itself at 10 minutes ("The app ended the call."). States: idle, listening, answering with a stored fact, "I don't have it yet; tell me while you're there and I'll keep it.", confirming a logged set, refused (no mic permission, offline), ended.

S8 Edit my week. Change days, exercises, machine settings and priorities after setup, one thing at a time, using setup's own words. States: pick what to change; changing days; changing one exercise; saved.

S9 Small pieces. Report a problem (copies an eight-line diagnostic; "Copied. Send it to Joe."). History and progress (what you have lifted, in your own numbers; lower priority). Settings (lowest priority).

### Vocabulary to keep exactly
"Your plan for today" · "Eat about" · "Find your working weights." · "Rest today." · "Saved" · "Recorded today at" · "Not available yet" · "no reading" · "One call needs you" · "Start upper body" / "Start lower body" · "Last time" · "Undo" · "unknown" · "Earned's standard start" · "Here's your week." · "Talk to Earned" · "I'll tap instead" · "Nothing was recorded." · "The app ended the call."
Muscle words as the engine spells them: chest, back, delts (front, side, rear), biceps, triceps, forearms, abs, quads, hams, glutes, calves.

---

## PART B. Do these steps in order, one prompt each

Step 1. Design system first. Prompt: "Before any screen, give me one artboard named 'System' with the palette, the type scale, and these components in every state: primary button, secondary button, text input (empty, filled, error), chip (unselected, selected, cleared), section header with hairline, a serif headline at 47 and at 33, a stored-fact row with provenance ('Saved', 'Recorded today at'), a refusal line, and an empty-state block. Use the approved look. Mark anything you changed from it." Choose nothing yet; just check it is complete.

Step 2. Narrow the direction on ONE screen. Prompt: "Design Today in the 'fresh athlete, nothing recorded' state in three directions, side by side, 390 wide, named 'Today A', 'Today B', 'Today C'. Keep the tokens. Vary hierarchy, warmth and how the coach entry is presented. One or two sentences of notes per artboard on what changed and why." Score each with Part C and pick one. If none scores 7 of 7, say what failed and ask for two more.

Step 3. Lock it. Prompt: "From now on use direction [X] exactly: its hierarchy, spacing and coach entry. Do not change tokens or components without telling me in the notes. Draw Today in its other five states: training day, rest day, One call needs you, out-of-range weight refused, offline-ready." Check each state with Part C.

Step 4. The first-run setup, six artboards plus the extra states listed in S1. Prompt: "Draw setup steps 1 to 6 in this direction, one artboard per step named 'Setup 1' to 'Setup 6', plus the extra states listed for steps 2 and 3. The primary button must be in the first screen height in every state. Use the exact vocabulary. Mark every number fictional."

Step 5. The gym card and check-in. Prompt: "Draw the Gym card in its five states and the Recovery check-in in three states (blank, partially answered, reopened with 'Recorded today at'). The check-in must be reachable from the active set and return to it."

Step 6. Sleep, nutrition, coach, edit my week. One prompt per screen, each listing its states from S5 to S8. For the coach, add: "Show the 10-minute session ending and the 'I'll tap instead' path."

Step 7. Flow check. Prompt: "Lay out one row per journey, left to right, using the artboards you already made: (1) first run to first session; (2) a normal training day including the check-in; (3) a rest day with a weigh-in and sleep entry; (4) a coach session that logs a set. Point out any screen that is missing or any step that needs a screen we have not drawn."

Step 8. Compare and hand off. Prompt: "For Today, Gym card and Setup 2 and 3, place the current app screen on the left and the new design on the right, and write two sentences on what changed and why." Export the canvas. The PM records the chosen design of record and the build lane rebuilds screens to it; the old design stays live until the new build merges.

---

## PART C. The seven-point check for any artboard (say no if any fails)

1. A beginner understands what to do in five seconds; the depth an enthusiast wants is one tap away, not on the surface.
2. The primary action is inside the first screen height in this state.
3. No number is shown that the engine could not have produced in this state; unknown is written in words.
4. No em dash, en dash, emoji or exclamation mark anywhere.
5. Touch targets look 44 px or more; inputs 48 px; nothing scrolls sideways.
6. The empty and refused states are truthful and calm; they say what did not happen.
7. It still looks like Earned: paper, ink, serif headline, green only as accent.
