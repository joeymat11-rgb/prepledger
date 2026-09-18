# EARNED · THE VISUAL DESIGN OF RECORD (2026-09-18) AND THE UI PORT

This folder is the reconstruction the owner approved ("I love this exact design", 2026-09-17,
plus rulings 1 to 7 below): the two rendered boards, the working prototype of the six views,
all 209 drawn states, the UI standard, the two gates and the state inventory. It supersedes
`rebuild/m1/approved-2026-09-08/` for APPEARANCE only; the 2026-09-08 references stay the
reference for behaviour and copy where this pack is silent.

Filed by the design chat ("EARNED — MAIN PM — Fable 5.1"), which runs the UI port as lane C
(builders and one independent reviewer per ticket, Fable judging) on branch
`rebuild/c-ui-port`. The PM chat ("EARNED — PM3 — Fable 5.1") integrates: it records the
ledger line for this design of record, judges each PR-READY line in `rebuild/lanes/STATUS.md`,
and seals. The tickets are in `rebuild/lanes/c/ui-port/`. The owner is asked nothing unless a
builder hits one of the open questions in section 6, each of which has a default.

## 0. For the PM

1. Ledger line (`rebuild/DECISIONS.md`), in the owner's words: the two rendered boards plus
   this reconstruction are the VISUAL DESIGN OF RECORD (2026-09-17 "I love this exact
   design"; boards govern appearance, briefs and ledger govern behaviour; rulings 1 to 7 of
   2026-09-18 in section 2); `design.cjs`'s pins move to this pack when C-UI-1 seals.
2. Judge each `PR-READY · lane C · C-UI-n` line as it appears in STATUS.md; the review file
   is named in the line. Seal per the screens tier (LANES.md), except the workout files the
   S-series packages pin, which ride the next sealed child.

## 1. What is in the zip, and what governs what

| path | what it is | governs |
|---|---|---|
| `ref/ink-board.png`, `ref/dawn-board.png` | the owner's two rendered boards (1491 × 1055), Ink dark and Dawn light, three phones each over the mountain plate | APPEARANCE. The last word on how a screen looks. |
| `ref/*-native.png` | the six phone screens cut from the boards at 1:1 (340 × 734) | the pixel references the gate's comparisons use |
| `app/app.html`, `app/app.css`, `app/app.js` | the working prototype of the six views: markup, every token, every rule, the scene (plate, mist, embers, grain, surface), the chassis (scrolling body + fixed stack on every screen) | the IMPLEMENTATION REFERENCE. Classes and copy here are what the port binds to. |
| `app/states.js`, `app/states.css`, `app/states-today.js`, `app/states-workout.js`, `app/states-workout.css`, `app/states-coach.js`, `app/states-coach.css` | the state driver and all 209 drawn states (99 Today, 45 Workout, 65 Coach): every refusal, every sub screen, the proposal card in its three honest states, the coach's structural states | every state the port must reach, with its exact copy |
| `app/states.html`, `app/states-index.js` | a browser for the states (`?screen&theme&state`) | how the owner and reviewers look at any state |
| `app/assets/plate-ink*.jpg`, `app/assets/plate-dawn*.jpg`, `mist.png`, `grain.png` | the two plates: the Ink photograph (the owner's chosen backdrop) and the same photograph graded light for Dawn (one scene, two lights: owner ruling 2026-09-18; the Dawn board's own background is a different photograph and is NOT the design), the mist texture, the grain | the scene assets, shipped as is |
| `app/fonts/earned-sans.woff2` (DM Sans), `app/fonts/earned-serif.woff2` (Liberation Serif) | the two typefaces | see the note under section 2 |
| `app/compare.html` + `app/compare/` | every deliberate departure from the boards, with the reason, in one running record | why the prototype differs from a board where it does |
| `quality/STANDARD.md` | the numbered UI standard (12 sections): layout, type, colour, scene, motion, copy, process, the chassis, the plates | the ACCEPTANCE BAR for every screen and state |
| `quality/gate.py` | 143 automatic checks on the six views (errors, motion, copy, targets, fit, thumb zone, columns, spacing, type scale, radii, pressed states, contrast measured behind the text, seams, mist edges, visual regression against `quality/baseline/`) | the gate the port must pass on the real client |
| `quality/statesheet.py` | renders every state in both themes and checks each (errors, copy, targets, primary in the first viewport, contrast, label overflow, seams) | the second gate |
| `quality/phonesheet.py` | phone-zoom contact sheets in thirds | what the reviewer looks at |
| `quality/baseline/*.png`, `quality/run/report.txt`, `quality/run/states-report.txt` | the accepted baselines and the last green runs (143 PASS; 418 renders, 0 problems) | the starting point for the port's own baselines |
| `states/STATE-INVENTORY-DRAFT.md` | the derived state inventory (205 rows: T-01..T-95, W-01..W-45, C-01..C-65) with the verbatim copy the code already carries (section 4.1) and the owner's rulings 1 to 7 (section 6) | BEHAVIOUR and copy, together with the ledger |
| `states/TICKET-proposal-response.md` | the engine ticket that unlocks the proposal card's "Applied" state | lane B, when the PM schedules it |

Two boards, one prototype, one standard, two gates, one inventory. If the prototype and a
board disagree, `app/compare.html` says why; if it does not, the board wins.

## 2. The owner's rulings (all recorded in the inventory, section 6)

1. The "98 states" figure is unsourced; the derived inventory is the record.
2. The coach's structural states are designed now; its ~50 answer variants are copy on one
   answer card.
3. The proposal card has a real accept path: one card for every proposal kind; three honest
   states, open ("One call needs you"), recorded ("Your call": "You said yes. It applies when
   your plan is next built." / "You said no. Nothing changes.", with "Change my answer"),
   applied ("Applied", only once the engine has stored the answer: needs the lane-B ticket);
   no timed expiry; "Change my answer" until the plan is next built.
4. Every screen is a chassis: a scrolling body and a fixed stack at the bottom, at the height
   the board draws it; the body fades 20 px into the stack and 32 px under the status bar only
   while there is more to see. Today's stack is Start, Recovery, Talk. Workout's is the effort
   row, Log and Edit, the bottom link. Coach's is the text input, the two links, the mic.
5. The weigh-in stays the board's inline card (no sheet).
6. "Skip this set" is dropped until a skip exists in the engine (W-29 stays drawn, NOT WIRED).
7. The five small calls: DM Sans is the sans of record; "I'll tap instead" stays on Workout
   and Coach; the bare "+" on "Plans changed?" stays with its label tappable; the bench
   proposal keeps "Use 105 / Keep 115" and every other kind uses "Yes, add it / No, keep it as
   is"; Dawn is the same mountains as Ink, lighter (the Dawn board's own photograph is not
   the design); the "example" pill stays until real data is wired.

Standing rules from the owner (2026-09-17): no dashes in UI copy (no en or em dash; a colon,
a full stop or the word "to"); no readiness words (ready, readiness, recovered, fatigued);
no vendor or model names; everything offline; only the embers and the mist may animate and
both are still under reduced motion; the plate is never directly behind text; every target
is 44 px; the primary action sits in the first viewport; Log stays in the thumb zone.

**Typeface note.** The prototype's sans is DM Sans (ruled). Its serif is Liberation Serif,
a metric stand-in matched to the boards by eye; the boards' own serif is unnamed. It reads
right against the boards and is free to ship (SIL licence). Treat Liberation Serif as the
serif of record unless the owner names the face; the client currently pins Instrument Sans
and Instrument Serif, which the port replaces.

## 3. How the port works (the mechanism the client already has)

The client binds to its design of record by pin: `rebuild/m3/w7-preview/today/design.cjs`
holds the sha256 of each approved reference, copies the approved stylesheet into the page
byte for byte, and requires every class the page renders to be a selector in that
stylesheet and every static sentence to occur verbatim in the approved HTML. That is the
right mechanism here too. The port therefore is:

- `design.cjs` pins move to this pack: `app/app.css` + `app/states.css` +
  `app/states-workout.css` + `app/states-coach.css` become the pinned stylesheets;
  `app/app.html` (and the copy tables in the `states-*.js` files, exported to one
  `copy.json` by the build) become the approved HTML and copy; the two fonts and the scene
  assets are pinned by sha256 and inlined or served offline.
- `screens.template.html` is rebuilt to the prototype's markup, screen by screen, with the
  same class names and the same slots bound at runtime (nothing carries a number).
- The scene (plate, mist canvas, embers, grain, surface, chassis) is lifted from `app.js`
  and `app.css` as one module; the state driver is not shipped (it is a review tool), but
  the review hooks are: `?theme=ink|dawn`, `?screen=`, `?chrome=1`, `?date=board`,
  `?state=<ID>` on the preview build, so the same two gates run on the real client.
- Acceptance is mechanical: `quality/gate.py` and `quality/statesheet.py` pointed at the
  real client's preview build (set the environment variable `EARNED_APP` to its URL or `file://` path; the scripts default to the prototype) must
  report the same as they do on the prototype, and every state's render must match the
  prototype's render for that state within the gate's regression tolerance (mean shift
  under 0.5, fewer than 10 levels on 1% of pixels). The prototype's own renders are the
  baselines: run `python3 quality/statesheet.py` in the pack once to produce them.

Rigor per LANES.md, screens tier: one independent Opus reviewer told to disagree (author ≠
reviewer), CI green on both OS, and the two gates green; the PM (Fable) judges. No ticket
self-accepts. The builder's cells pin every copy string they move.

## 4. What is LOCKED for every ticket

- Nothing under `rebuild/engine/`, `rebuild/m4/`, `rebuild/m3/w6/local/`, `rebuild/conform/`.
- No new numbers in markup; every value binds at runtime, as today.
- No dashes, no readiness words, no vendor names (the gate refuses them).
- The RIR picker values and what `logSet` stores (BRIEF-RIR-DISPLAY's lock stands).
- Existing tests stay green; `browser-check.mjs`'s dash sweep stays and gains the
  readiness-word and vendor-name sweeps from the gate.
- One layout per screen: a drawn state and the live behaviour must produce the same element
  in the same place (STANDARD.md section 11).

## 5. The tickets (lane C, screens tier), in order

Each is written the way lane C briefs are written: why, design of record, what the build
may change, locked, acceptance, sequencing. The PM copies each into
`rebuild/lanes/c/ui-port/C-UI-n.md` and dispatches it.

### C-UI-1 · Design pins, fonts, scene module, review hooks
- WHY: everything else binds to this. Until the pins move, no screen can change.
- DESIGN OF RECORD: `rebuild/m1/approved-2026-09-18/` (this pack), `quality/STANDARD.md`.
- MAY CHANGE: `rebuild/m3/w7-preview/today/design.cjs` (the pins, the fonts, the inlined
  stylesheets: app.css, states.css, states-workout.css, states-coach.css), a new
  `scene.mjs` lifted from `app/app.js` (plate geometry incl. the Dawn crop, occlusion mask,
  mist, embers, grain, chassis scroll fades), `preview.css` (replaced by the pinned
  stylesheets), the preview build (`build.mjs`) to serve the assets offline and to honour
  the review hooks, `browser-check.mjs` (sweeps).
- LOCKED: section 4. The old 2026-09-08 pins stay in git history; nothing else moves yet.
- ACCEPTANCE: the preview build opens offline in both themes with the scene drawn and no
  console error; `quality/gate.py` pointed at it passes its scene, motion, copy and font
  checks (the layout checks come green screen by screen in the tickets below); the fonts
  are DM Sans and Liberation Serif by sha256; reduced motion draws one still frame.
- SEQUENCING: first. Pins move in this ticket only.

### C-UI-2 · Today, the face (T-02..T-41 without the proposal states)
- WHY: the first screen he sees every day; the chassis (ruling 4) lives here.
- DESIGN OF RECORD: `ref/ink-today-native.png`, `ref/dawn-today-native.png`;
  `app/app.html` `#screen-today`; states T-02..T-39, T-41 in `app/states-today.js`.
- MAY CHANGE: `screens.template.html` (`t-today`), `today-app.cjs` (bindings only: the
  slots keep their names; new slots for the status pill, the note block, the timeline
  markers), `checkin-*` only where Today's Recovery row binds.
- LOCKED: the weigh-in stays inline (ruling 5); the stack is Start, Recovery, Talk and nothing
  else; the greeting and status line copy comes from the inventory's verbatim list.
- ACCEPTANCE: gate green for `today` at 393 × 852 (fits, primary in the first viewport, thumb
  zone, columns, spacing, contrast); statesheet green for every T state the ticket covers,
  each within tolerance of the prototype's render; the day scrolls under a fixed stack on a
  long day with the fades as ruled.
- SEQUENCING: after C-UI-1. Parallel with C-UI-4.

### C-UI-3 · Today, the proposal card (T-40, T-40b..T-40h) and the weigh-in states (T-42..T-52)
- WHY: ruling 3 (the accept path) and the inline weigh-in; the card is how the engine talks.
- DESIGN OF RECORD: `app/app.html` `#card-proposal`; `proposal()` in `states-today.js`;
  inventory section 6 ruling 3; `states/TICKET-proposal-response.md`.
- MAY CHANGE: `t-today`'s proposal card markup and `today-app.cjs`'s proposal binding
  (kind, lift, change, reason, decisions, recorded line, "Change my answer"); the weigh-in
  card's refusal placement and field flag.
- LOCKED: "Applied" is never shown until the engine stores the answer (lane B ticket); until
  then the card stops at "recorded". No expiry. The bench card keeps "Use 105 / Keep 115"
  (bound, never literal).
- ACCEPTANCE: T-40 family and T-42..T-52 green and within tolerance; a tap on a decision
  records and "Change my answer" restores; the gold edge only while open.
- SEQUENCING: after C-UI-2.

### C-UI-4 · Inside the workout, the set and rest screens (W-05..W-29, W-32, W-42, W-43)
- WHY: the one-handed gym screen; Log never moves (ruling 4, 6).
- DESIGN OF RECORD: `ref/*-workout-native.png`; `#screen-workout` in `app/app.html`; W
  states in `app/states-workout.js`.
- MAY CHANGE: `screens.template.html` (the gym card), `gym-app.mjs`, `gym-model.mjs`
  (display and the refusal placement only: the effort answer is required, W-20's refusal
  flags the RIR row, W-19's refusal sits under the numerals; the rest screen repaints in
  place with Log at the same edge).
- LOCKED: BRIEF-RIR-DISPLAY's locks; "Skip this set" is gone (ruling 6); no rest timer.
- ACCEPTANCE: gate green for `workout` (Log centre ≥ 70% of the height; label uses ×);
  statesheet green for the W states covered; a live tap on Log without an effort answer
  inserts the same element the drawn W-20 shows, and Log does not move.
- SEQUENCING: after C-UI-1. Parallel with C-UI-2.

### C-UI-5 · Workout panels: the stubs and the machine settings editor (W-01..W-04, W-30, W-31, W-33..W-41, W-44)
- WHY: every sub screen is a chassis with its action group at the parent's thumb edge (716).
- DESIGN OF RECORD: `panel()` in `app/states.js`, `states.css` (the panel chassis), the W
  panel states.
- MAY CHANGE: `machine-settings-view.mjs`, `machine-settings-host.mjs`, the gym stubs in
  `gym-app.mjs`.
- LOCKED: the editor's validation sentences are the inventory's verbatim (W-38..W-40).
- ACCEPTANCE: statesheet green for the states covered; the action group's bottom edge at 716
  in every panel; a malformed pair is drawn malformed with the field flagged (W-39).
- SEQUENCING: after C-UI-4.

### C-UI-6 · Coach, the structural states (C-02..C-09, C-35, C-38..C-40, C-43..C-65)
- WHY: the conversation view does not exist yet; ruling 2 designed its structure now.
- DESIGN OF RECORD: `ref/*-coach-native.png`; `#screen-coach`; `app/states-coach.js`;
  `rebuild/coach/COACH-EXPERIENCE-BRIEF.md` and `BRIEF-C6-VOICE-ONBOARDING.md` for
  behaviour; the coach's answer variants are copy on one card (C-10..C-37, C-41, C-42).
- MAY CHANGE: the coach stub in `today-app.cjs` becomes the coach screen; a new
  `coach-app.mjs` in `rebuild/m3/w7-preview/today/` for the view (the tool contract and
  `coach-text.cjs` are untouched); the orb, the mic, text mode, tap mode, the mic-off
  treatment, the answer card, the refusal card, the confirm row, the proposal card (the
  same component as Today's).
- LOCKED: no live adapter, no network, no audio in this lane (`tools.cjs` header); the
  "Answering" pill goes dark once a card is on screen; nothing is written until the athlete
  says yes (tier 1) and nothing changes until yes (tier 2).
- ACCEPTANCE: gate green for `coach`; statesheet green for the C states; the mic at 657 to
  770 in every state that shows it; in text and tap modes the stack shrinks and the input or
  links stay at the bottom edge.
- SEQUENCING: after C-UI-1; may start in parallel with C-UI-5.

### C-UI-7 · The entries: nutrition (T-58..T-71), sleep (T-72..T-95), Why this plan (T-53..T-57)
- WHY: the 43 sub screens behind Today; each a chassis with actions at 695.
- DESIGN OF RECORD: the T panel states; `panel()`; the entries' verbatim copy (inventory 4.1:
  "Calories eaten", "Protein eaten", "How do you want to record it?", the refusals).
- MAY CHANGE: `food-*`, `reading-host.mjs`, the sleep entry, the Why this plan view in
  `today-app.cjs`.
- LOCKED: sleep nights are dormant on the tip (inventory question 10 still open): draw the
  entry in full, wire what the tip can write.
- ACCEPTANCE: statesheet green for T-53..T-95; every refusal under the field it names with
  the field flagged; the action group at 695; long panels scroll with the fades.
- SEQUENCING: after C-UI-3.

### C-UI-8 · Seal: the PWA shell and the slice deploy
- WHY: the owner reviews on his phone at arm's length, from the slice.
- MAY CHANGE: `rebuild/slice/pwa/*` (shell, service worker asset list for the plates,
  fonts, mist, grain), `DEPLOYS.md`.
- ACCEPTANCE: both gates green on the deployed slice URL in both themes; offline launch
  with the scene; reduced motion still; the owner's phone screenshot matches the board.
- SEQUENCING: last.

## 6. What still needs the owner (only when a builder hits it)

- Inventory question 3: "Ask your coach" (code) vs "Talk to Earned" (briefs): which wording
  is of record for the Today entry? The prototype uses "Talk through today's plan" (the
  board's words). Default: the board.
- Question 7: a set-edit control on the gym card (the coach can correct a set; the card
  cannot). Default: not in this port.
- Question 8: the weigh-in correction path. Default: not in this port.
- Question 9: the Measure tile and the build footer. Default: hidden on the athlete's build.
- Question 10: sleep entry scope while sleep nights are dormant. Default: draw in full, wire
  what the tip can write.
- The serif (section 2 note). Default: Liberation Serif.

The PM proceeds on the defaults and asks only if a builder cannot.

## 7. How the owner sees progress

He reads one place: the PM chat's PROGRESS footer. Each ticket reports BRIEF-READY,
PR-READY (with the reviewer's file), SEALED, and the slice URL at C-UI-8. He is shown the
phone-zoom sheet of a ticket's screens once, at PR-READY, and answers only if he disagrees.
