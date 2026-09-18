# Earned UI polish standard

The rules every screen and every state must meet before it is called done. Each rule says the number, and how it is checked: **gate** means `quality/gate.py` or `quality/statesheet.py` checks it automatically on every change, and the name of the check that does it is in brackets after the tag (section 13 is the full list); **eye** means it is reviewed on the phone-zoom sheet (`quality/phonesheet.py`) at the scale a phone shows; **reviewer** means a second, independent model is asked to disagree with it.

Where a rule departs from the boards, the departure is recorded on the comparison page with the reason.

## 1. Layout

- **Page margin 22 px.** Every card, button and pill sits on it. Nothing pokes outside it. *gate (page margin 22 px)*
- **One spacing scale.** Gaps between blocks are 8 (inside a group), 12 (between related blocks), 14 to 16 (around the primary action), 20 to 24 (between sections). Small structural gaps of 4, 5, 9 and 10 exist in the header and title areas only. Anything else is flagged. *gate (gaps on the spacing scale, the one check besides the type scale that may WARN)*
- **One inner edge.** Cards use 14 px inner padding. Icons in row cards and pills sit 13 to 14 px from the left edge. *gate (card inner edge 14 px, icon inset 13 to 14 px)*
- **One right-hand glyph column.** Every chevron, arrow, "+", and mic is centred 24 px from its card's right edge. *gate (right glyph column at 24 px)*
- **Shared columns, across screens.** Every left icon in a row (Recovery, machine setting, coach prompts, Talk pill) is centred 54 px from the screen's left edge and the text after it starts at 88 px, on every screen. *gate (same icon column (54) and text edge (88) on every screen, icons share a centre line text shares an edge)*
- **Pills are shorter than cards.** The Talk pill is 54 px; cards are 58 to 63 px. A fully round shape at card height reads as a fat capsule. *eye*
- **A circle beside a square is drawn larger.** Optical sizing: a 34 px disc reads the same as a 38 px square. *eye*
- **The primary action is in the first viewport** on every phone down to 360 × 780: Start on Today, Log on the workout, the mic on Coach. *gate (primary action in first viewport, at all three sizes)*
- **In the gym, the thumb wins.** The Log button's centre sits at 70% of the screen height or lower. Numbers stay at the top for glancing; the tap stays at the bottom. *gate (Log in the thumb zone (centre >= 70% of height))*
- **Bottom safe area.** The last row clears the home indicator when installed. *gate (bottom safe area: the last row of the fixed stack clears max(24 px, env(safe-area-inset-bottom)))*

## 2. Type

- Serif (Earned Serif) for names, numbers and headlines; sans (Earned Sans) for everything else. Sizes come from the scale in the stylesheet; a new size is a decision, not a drift. *gate (serif for names and numbers sans for the rest; type sizes and weights on the scale, which WARNs on a new size)*
- Sans weights 430 to 500 only. Titles in row cards and pill labels are 500; body 450 to 480; sub lines 430. *gate (type sizes and weights on the scale, which WARNs on a new weight)*
- The multiplication sign is × everywhere a set is written, never the letter x. *gate (Log label uses ×, and the multiplication sign in every set string, which sweeps the whole screen)*
- Tertiary actions (Skip this set, Plans changed?, Use text mode, I'll tap instead, Why 105 lb?) are muted text with no underline and a 44 px target. *gate (tertiary links have no underline, touch targets >= 44 px, contrast (measured behind the text) at the 3.0:1 tier); eye (that they read as the quieter voice)*

## 3. Colour and surfaces

- Cards are 86 to 90% of the surface colour so the scene reads through. Text never sits straight on the picture: it has a card, a scrim or the flat surface behind it. *eye + gate (contrast)*
- Contrast: primary text 4.5:1 or better against what is actually behind it; muted labels 3:1 or better. Measured on the rendered screenshot, not on the token. The lower tier is the pack's own `--muted`, `--faint` or `--gold` token, one of the classes the stylesheets paint muted (listed with their line numbers in `quality/common.py`), a disabled control's label (section 10 calls it a muted label) or text at 24 px or larger; it is not "the colour differs from the body colour". *gate (contrast (measured behind the text), on both gates, at all three sizes)*
- Only two radii: 14 px for cards, buttons and chips; full round only for pills (the header pills, Save, Use 105 / Keep 115 and the Talk pill, as the boards draw them). The gate asserts exactly this; if the code wants a third radius, the standard changes on the record, not the check. *gate (radii: 14 px for cards, buttons and chips; full round only for pills)*

## 4. Scene

- The scene is "Strong" (Joe's pick, 2026-09-17): the top of each screen is the flat surface, the range enters low (Today from 41% of the height, the workout from 48%, Coach from 27%) and every dissolve is long, so there is no row anywhere where the picture switches off. The open scene (haze to the top, range higher) stays available as `?fade=full` for comparison. *gate (no seams in the scene at 393x852 both themes, plus no straight edge in the scene with the mist drawn and no vertical streaks in the sky with the mist drawn at three times scale)*
- The range sits where it was approved; changing the framing is a decision. *gate (visual regression vs baseline, against `quality/baseline/<platform>/`, a FAIL over 0.1% of pixels past 10 levels or a mean shift over 0.5)*

## 5. Motion and touch

- The only things that move are the embers and the mist. No transitions, no pulsing, no parallax. Under reduced motion nothing moves at all. *gate (no transitions or animations outside the embers, swept with motion refused and again with motion allowed; nothing moves except the embers; nothing moves under reduced motion)*
- Every tappable surface has a pressed state: an instant change while the finger is down (deeper cream, lifted card, gold edge). *gate (pressed state on every tappable surface)*
- Every target is at least 44 × 44 px, including the invisible hit area behind small pills and links. *gate (touch targets >= 44 px, at all three sizes)*

## 6. Copy

- No dashes in interface copy. No readiness words. No vendor or model names. *gate (copy: no dashes, readiness words, vendor names, on both gates; the word list is matched on a real word boundary)*
- Empty and error states say what happened and what was recorded ("Nothing was recorded."), never a cheerful placeholder. *reviewer*

## 7. Process: what "done" means for a state

1. Built with the existing components; a new component is a decision.
2. `gate.py` passes with no FAIL; every WARN has a one-line reason or is fixed.
3. Reviewed on the phone-zoom sheet, both themes, top, middle and bottom thirds.
4. An independent reviewer (a different model, given this standard and the sheets, told to disagree) has looked and its findings are triaged: fixed, or declined with a reason.
5. The baseline screenshots are updated on purpose (`gate.py --accept`), never by accident. A run that is not an accept run FAILs a screen when more than 0.1% of its pixels differ from the baseline by more than 10 levels in any channel, or when the mean absolute shift exceeds 0.5 levels, and FAILs when the baseline for the current platform is missing rather than writing one. An accept run marks every screen SET, not PASS, and says on the report's first line that it compared nothing.
6. Recorded on the comparison page if it departs from the boards.

## 8. Independent review, round 1 (what it caught that the gate did not)

- A Dawn hero orb at 4% contrast: a tinted copy of the Ink recipe is not a Dawn recipe. Each theme gets its own orb.
- Two link scrims wide enough to merge into a band. Scrims are small, separate and light, and the phone-zoom sheet is where bands are caught.
- "Plans changed?" was a label, not a button, and wore a different typeface from the same words on the workout screen. Tertiary actions are one component everywhere.
- Edit drawn chip-width on the chip grid beside Log read as a fifth chip one thumb-width from the tap you make without looking.
- The Dawn ember on the Talk pill had gone dark: an ember is bright in both themes.
- The timeline rail ran 0.75 px off its dots, across card corners, and 105 px past the last event.
- Progress dots that differed only in stroke hue said nothing at arm's length; fill says it.

## 9. Lessons that became rules

- The 4× comparison sheets do not show what a phone at arm's length shows. Review at phone zoom, in thirds.
- Aligning to a mathematical column can fight the board and the eye (the icons crammed to the card edge). When the two disagree, the eye wins and the column moves.
- An action next to its object is a desk rule. On a one-handed phone in a gym, the thumb rule wins.
- A crescent's weight sits low and left; a glow that stops short of its ring reads as a hoop. Optical centring beats geometric centring.

## 10. States and sub screens (round 2, 2026-09-17)

- Every state in the inventory is drawn on the live prototype, in both themes, and rendered by `quality/statesheet.py` (errors, copy, targets, primary in the first viewport, contrast measured behind the text) and compared to its own committed record under `quality/baseline/states/`. A state that fails the sheet is not done. `app/states.html` is the browser.
- A sub screen is a phone chassis, not a document: the back chevron in the workout's place, a flat surface behind the whole text column, the body scrolling, the last action group at the parent screen's own thumb edge (Today 695, Workout 712), giving way first when the panel is long.
- One proposal card for every proposal kind: eyebrow names the kind, serif line carries the change, the producer's reason ends with "Nothing changes until you say yes.", the gold edge marks only a card that needs an answer, and the recorded state says what the athlete said and when it applies. Applied is shown only once the engine has stored the answer. No expiry. "Change my answer" until the plan is next built.
- One state colour: the ember gold. Nothing is green.
- A disabled primary is a flat chip with a muted label and its reason under it, never a translucent plate.
- One refusal component: a bordered block that sits under the field it names and flags that field. It names what was recorded and what was not.
- The device or provenance line sits under the screen's status line at 13 px, said once.
- The effort answer is required on every set; "Unsure" is an answer. Nothing on a set screen says "optional".
- Independent review, round 2, caught what the sheet could not: dead-end sub screens (no back), primaries floating mid page, text lying on the photograph, two cards for one proposal kind, a green that belonged to nothing, five refusal treatments, a "Listening" said three times. Each became a rule above. Ruled 2026-09-18: Today's bottom stack (Start, Recovery, Talk) is fixed at the bottom safe area and the day scrolls above it, softening under the status bar and into the stack; the weigh-in stays the board's inline card; "Skip this set" is dropped until a skip exists.
- A screen whose content can grow has a chassis: a scrolling body and a fixed action stack. The stack never moves; the body fades at the edges it slides under, only while there is more to see.

## 11. The chassis, everywhere (round 3, 2026-09-18)

- Every screen is a scrolling body and a fixed stack. The stack sits at the height the board draws it (the board's own slack below it is kept, so nothing moves on the boards as drawn); the body fades 20 px into the stack and 32 px under the status bar, only while there is more that way. Today's stack is Start, Recovery, Talk and nothing else. Workout's is the effort row, Log and Edit, and the bottom link; a refusal that belongs to Log takes its slot above Log and the body gives way. Coach's is the text input, the two links and the mic.
- A sub screen (panel) is a chassis too: its body scrolls behind its own flat backing, which eases in from the header's surface so there is no seam, and the action group that ends it is fixed at the parent screen's thumb edge (Today 695, Workout 716, Coach 770). Only a spec's last block is pinned; a note or refusal after the actions keeps them in the flow, so specs end with their actions.
- The proposal card's eyebrow names its state: "One call needs you" open, "Your call" once answered, "Applied" once the engine has stored it, "Withdrawn" when the plan was rebuilt. The change line stays in every state so "You said yes" keeps its object. One applied sentence on both screens.
- A refusal sits under the field it names and flags it: the effort row wears the gold edge when Log refuses for a missing answer; the empty reps box wears the gold underline; a malformed settings pair is drawn malformed. One layout per screen: the drawn state and the live tap produce the same element in the same place.
- A dead control is not drawn dressed: when the microphone cannot work, the disc goes, one line says why, and the working path ("I'll tap instead") is the decision at the thumb.
- The header pill says something only while it is true: "Listening" while listening, "Answering" only in the moment of answering; once a card is on screen the pill is dark.
- A tertiary link carries its own small cloud; there is never a full-width plate under a link row.
- Labels fit their buttons on one line (the sheet checks overflow). Copy departures from the inventory's verbatim list are recorded on the mismatch page; the readiness-word rule outranks verbatim ("Start set 2", "Finish this workout").
- The sheet's seam check reads a drawn edge (a step between two flat bands in both margins), not the photograph's own crest.

## 12. The plates (2026-09-18)

- One scene, two lights. Ink and Dawn share the one mountain photograph (the owner's chosen backdrop); Dawn is that photograph graded light, at the same geometry. The Dawn board's own background is a different photograph and is not the design (owner ruling 2026-09-18, after seeing it in the app). A synthesized plate is only ever a grade of the real one; a candidate photograph is verified against the board's margins before anything is concluded from it.
- The sans of record is DM Sans (committed 2026-09-18). The serif in the prototype is Liberation Serif, a stand-in matched to the boards; it stands until the owner names the face.

## 13. The gates, as of C-UI-0

Both gates run the same way on Windows and on Linux, from this folder: `python quality/gate.py`
and `python quality/statesheet.py`. Exit 0 green, exit 1 at least one FAIL, exit 2 refused (one
line naming the URL it was pointed at and what was missing). WARN belongs to the two advisory
checks only. `python quality/teeth.py` proves the list below can still refuse: it applies one
forbidden change at a time to a scratch copy and asserts the exact refusal.

`gate.py`, 32 checks, 354 result rows. R means the reference size 393x852 only; 3 means all three
of 393x852, 375x812 and 360x780. Every row FAILs unless it says WARN.

| check | sizes | what it holds |
|---|---|---|
| primary action in first viewport | 3 | the screen's primary is wholly above the fold |
| fits without scrolling at 393x852 | R | the default render needs no scroll |
| Log in the thumb zone (centre >= 70% of height) | R | workout only |
| touch targets >= 44 px | 3 | every button, link and input, hit area included |
| copy: no dashes, readiness words, vendor names | 3 | the owner's standing rules, word boundary matched |
| the multiplication sign in every set string | 3 | no digit, letter x, digit anywhere on the screen |
| Log label uses × | 3 | workout only |
| no transitions or animations outside the embers | 3, and again at R with motion allowed | a transition only disabled under reduced motion still fails |
| serif and sans faces loaded and distinct | 3 | both faces load, the known serif and sans elements resolve to them, and the two draw different glyphs |
| serif for names and numbers, sans for the rest | 3 | the listed serif selectors are serif and every other text element is sans |
| RIR chips are the five locked values | 3 | 0, 1, 2, 3+, unsure in order, labels 0, 1, 2, 3+, Unsure, all visible |
| page margin 22 px | 3 | every block of the body and the stack, plus the cards inside them, at 22 and width minus 22 |
| card inner edge 14 px | 3 | the named card sides' computed padding |
| icon inset 13 to 14 px | 3 | the icon's left edge from its card's inner edge |
| bottom safe area | 3 | the fixed stack's last row clears max(24 px, env(safe-area-inset-bottom)) |
| type sizes and weights on the scale | 3 | WARN on a size or weight off the scale |
| radii: 14 px for cards, buttons and chips; full round only for pills | 3 | exactly one radius on the listed components |
| contrast (measured behind the text) | 3 | 4.5:1 primary; 3.0:1 muted, a disabled control's label, the state colour and text 24 px or larger; measured on the screenshot |
| tertiary links have no underline | R | |
| right glyph column at 24 px | R | |
| icons share a centre line, text shares an edge | R | |
| same icon column (54) and text edge (88) on every screen | R | |
| gaps on the spacing scale | R | WARN on a gap off the scale |
| pressed state on every tappable surface | R | an element outside the viewport is a FAIL line, never a crash |
| no seams in the scene | R | |
| visual regression vs baseline | R | over 0.1% of pixels past 10 levels, or a mean shift over 0.5; a missing baseline for this platform is a FAIL |
| no page or console errors | 3 | one row per size |
| fonts pinned by sha256 | once | the bytes each @font-face rule points at, against the two pinned digests |
| no straight edge in the scene with the mist drawn | R at three times scale | |
| no vertical streaks in the sky with the mist drawn | R at three times scale | WARN over 0.7, FAIL over 0.9 |
| nothing moves except the embers | R, every theme and screen | with the embers hidden and motion allowed |
| nothing moves under reduced motion | R, every theme and screen | |

`statesheet.py`, every registered state in both themes at 393x852. Each render is checked for: the
state actually applying, page and console errors, the copy sweeps, a set written with the letter x,
touch targets, a label overflowing its button, the word "optional" on a set screen, a drawn seam in
both margins, contrast in the same two tiers, and the primary staying above the fold. It is then
compared to `quality/baseline/states/<ID>-<theme>.json` and `.png`: the visible text must be
identical, each element must stay within 3 px on every edge, 3 levels per channel, the same family
and 0.5 px of the same size, and the 1/16 scale greyscale thumbnail must stay under a 2.0 level mean
shift with fewer than 1% of its pixels past 24 levels. A missing record is a FAIL naming the state.
`--accept` is the only way to write records, marks the run as having compared nothing, and `--only`
narrows the run while iterating.
