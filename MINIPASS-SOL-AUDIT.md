# MEASURED / EARNED — independent mini-pass design audit

**Build audited:** shipped `main` 643013f, v7.49.0  
**Evidence:** seven supplied iPhone captures (390×844 @2×; the light “fullscroll” capture is 390×915 @2×) plus the code-exact facts in the brief  
**Audit posture:** blind and independent; claims below are limited to supplied evidence. Behavioral conclusions are marked `[inferred]`.

## Evidence-integrity gate

| Surface | Files checked | Result |
|---|---|---|
| Capture sheet | `01-capture-sheet-LIGHT.png`, `02-capture-sheet-DARK.png`, `07-capture-sheet-LIGHT-fullscroll.png` | **PASS.** All three show the bottom logging sheet over NOW. The “fullscroll” file is the correct surface, but it still does not expose the STEPS row or the absolute bottom of the sheet. |
| Gym mode | `03-gym-mode-LIGHT.png`, `04-gym-mode-DARK.png` | **PASS.** Both show the full-screen, one-lift-at-a-time Lateral machine surface. |
| Decision detail | `05-decision-detail-LIGHT.png`, `06-decision-detail-DARK.png` | **PASS.** Both show expanded proposal cards in DECISIONS. |

No surface verdict is withheld for mislabeling.

## Verdict summary

| Surface | Verdict | Short reason |
|---|---|---|
| Capture sheet | **NOT YET** | Mechanically clear and touch-safe, but its core close-day editor has three visibly unlabeled fields, date/action ambiguity, and repeated framing around one scale action. |
| Gym mode | **NOT YET** | The physical controls are excellent, but the active-set instruction is subordinate to dense coaching/receipt prose, and the noninteractive brass set chip directly breaks the settled affordance law. |
| Decision detail | **NOT YET** | The individual proposal is understandable, but nine fully expanded 85–95-word cards create avoidable overload and two fixed controls visibly cover card content. |

No P0 is proven by the supplied evidence. There are P1 failures on all three core loops.

---

# 1. The capture sheet

**One-line verdict — NOT YET:** the logging mechanics are large, legible, and thematically consistent, but the screen makes the athlete decode field order, distinguish two days, and pass through several labels for the same scale action.

**Mechanical compliance observed:** all six stated inputs remain 16px; §4 reports no contrast failures and no sub-44px targets; both primary actions use gauge.

## KEEP / DEMOTE / CUT

| Distinct element | Disposition | Audit judgment |
|---|---|---|
| Dimmed NOW backdrop, rounded sheet, top drag handle | **KEEP** | The modal relationship and sheet boundary are immediately legible in both themes. |
| `LOG` title | **KEEP** | Plain, short, and accurate. |
| Outline `Close` control | **KEEP** | Clear secondary escape; the supplied 44px and contrast checks remove the obvious mechanical risks. |
| `OWED — 2 ITEMS` count | **KEEP**, recolor | Missing work must remain visible. Keep the count, but brass is not an earned moment; use neutral ink or the settled miss-state treatment. |
| Owed scale locator row: `THIS MORNING'S SCALE · in the core below — one tap` | **DEMOTE / MERGE** | Preserve the fact that the scale is owed, but put that state on the real scale section. A separate row that only points a few lines downward is navigation overhead. |
| `CLOSE Tue 8/11` | **KEEP** | The date is essential because this editor is for a prior day. |
| `TARGET-SEEDED` | **KEEP**, rewrite | Provenance is useful, but “Pre-filled from target” is plainer and passes D4 better. |
| “calories, protein, steps — an open day is a hole…” rationale | **DEMOTE** | The reason/receipt can sit behind help. It should not separate the task label from its fields during routine logging. |
| Three overdue-day numeric inputs | **KEEP**, label individually | They are the task, but visible labels and units must be persistent rather than encoded only by left-to-right order. Preserve 16px input text. |
| Generic `Save` button | **KEEP**, make specific | Change the visible action to `Close Tue 8/11` or `Save Tue 8/11` so the mutation target is unmistakable. |
| `THIS MORNING'S SCALE` heading | **KEEP** | This should become the one canonical heading for the scale task, carrying its owed badge/state. |
| “the read the whole engine steers on — one tap, then the trend absorbs it” | **DEMOTE** | Useful first-use explanation, but repeated daily it adds reading without changing the action. Plain fallback: “Daily weight updates the trend.” |
| Divider above the scale control | **KEEP** | It separates the overdue close editor from the distinct scale action. |
| `THE CORE — WHAT RUNS EVERYTHING` | **CUT** | It adds emphasis but no new instruction after `THIS MORNING'S SCALE`; this is exactly the kind of stylized duplicate D4 says to remove. |
| Scale − / value / + stepper | **KEEP** | Strong hierarchy and, per §4, 72×72 controls. |
| `MORNING SCALE · LB` unit line | **KEEP** | It names the measure and unit next to the editable value. |
| `Log 163.6 lb` primary action | **KEEP** | Specific, value-confirming, gauge-colored, and visually dominant. |
| `CLOSE THE DAY` heading | **KEEP**, add date | It needs `Today · Wed 8/12` or equivalent to contrast explicitly with the overdue Tue 8/11 editor. |
| CALORIES / PROTEIN / STEPS row labels | **KEEP**, remove semantic ambiguity | Label the recorded measures, not merely `TARGET`; show target provenance as secondary text. |
| CALORIES / PROTEIN / STEPS steppers | **KEEP** | The supplied sizes are appropriate for fast adjustment. The STEPS row itself is stated in §4 but not visible in any supplied image. |

## Findings, severity-ranked

### P1 — The overdue close editor presents three unlabeled values

**Observed:** In all three sheet captures, `2289`, `160`, and `15000` appear in three adjacent inputs. The only visible mapping is the earlier prose sequence “calories, protein, steps”; no persistent label or unit is attached to each box.

**Why this fails the bar:** The app's primary logging surface asks the athlete to remember an ordering convention at the exact point of entry. That is avoidable cognitive load and permits a silent category error. Large targets and adequate contrast do not resolve semantic ambiguity.

**Smallest fix:** Add a short visible label above each input—`CALORIES`, `PROTEIN g`, `STEPS`—and preserve the existing 16px input size. Keep or add matching programmatic labels.

**Acceptance test:** At 390×844 in both themes, every one of the three inputs has a persistent adjacent label and unit that remains visible with a value present; the accessibility tree exposes the same three names; all input computed font sizes remain 16px.

### P1 — The sheet does not make “yesterday” versus “today” unmissable

**Observed:** The overdue editor is dated `Tue 8/11`, but its button says only `Save`. The lower section says only `CLOSE THE DAY`, while the backdrop date is Wed Aug 12. Both groups display the same target-seeded values.

**Why this fails the bar:** `[inferred]` A fast user can reasonably wonder whether the lower controls close Tue 8/11, close today, or adjust engine targets. The word `TARGET` reinforces the ambiguity. Logging to the wrong day would hurt the core loop.

**Smallest fix:** Keep `Tue 8/11` attached to the overdue fields and repeat it in the action label; label the lower block `CLOSE TODAY · Wed 8/12`; name those fields as logged outcomes and put “pre-filled from target” in secondary text.

**Acceptance test:** With the sheet opened on Wed 8/12 and Tue 8/11 owed, the date affected by every save/stepper group is visible without consulting the backdrop or explanatory paragraph. No primary action is the context-free word `Save`.

### P1 — One scale action is framed five times before completion

**Observed:** The same action is represented by the owed locator row, `THIS MORNING'S SCALE`, its explanatory sentence, `THE CORE — WHAT RUNS EVERYTHING`, `MORNING SCALE · LB`, and then the value-specific CTA. The supplied captures never reach the STEPS row, even though §4 says it exists lower in the same sheet.

**Why this fails the bar:** The extra framing lengthens the route through the app's most frequent action and pushes other logging work downward. The rhetoric makes a simple task feel like the complex engine underneath it.

**Smallest fix:** Merge the owed state into the real scale heading, remove `THE CORE — WHAT RUNS EVERYTHING`, and demote the engine explanation to first-use/help. Keep the stepper, unit, and CTA unchanged.

**Acceptance test:** The rendered hierarchy contains one scale task heading, one owed marker, one control, and one value-confirming action. No separate row exists solely to direct the athlete to another element in the same sheet.

### P2 — Several load-bearing labels fail the plain-English swap test

**Observed:** `TARGET-SEEDED`, “the read the whole engine steers on,” and “a hole in every average the targets are measured against” all appear in the routine path.

**Why this fails the bar:** They are decodable, but plain language loses nothing and reads faster. D4 explicitly reserves personality for headlines and earned moments.

**Smallest fix:** Use `Pre-filled from target`, `Daily weight updates the trend`, and move the open-day rationale behind help.

**Acceptance test:** A copy snapshot contains no `TARGET-SEEDED` or “core/engine steers” wording in the default logging path; the fuller receipt remains available one tap down.

## If only one change were allowed

**Give each overdue numeric input a persistent visible label and unit.** It removes the most direct risk of logging the wrong kind of value without changing layout, values, or engine behavior.

---

# 2. Gym mode

**One-line verdict — NOT YET:** the rep controls and log CTA are physically excellent, but the screen makes the athlete read coaching history and statistical receipts before the current set's small, wrapped effort cue.

**Mechanical compliance observed:** the listed controls meet the supplied target sizes, the primary CTA is gauge, and §4 reports no contrast failure in either theme.

## KEEP / DEMOTE / CUT

| Distinct element | Disposition | Audit judgment |
|---|---|---|
| `LIFT 1 OF 9` | **KEEP** | Exact orientation at a glance. |
| Nine-dot progress row | **KEEP**, recolor current state | Useful spatial progress, but the brass first dot represents current position, not an earned moment. |
| `exit ×` | **KEEP** | Necessary escape; §4 establishes a 68×66 target. |
| Persistent `STIM CHECK` line | **DEMOTE** after initial exposure | The medication/effort caveat is relevant and must remain available, but two persistent lines on every active-set screen are expensive. Show it on entry or behind a clearly named info disclosure after it has been seen. |
| Exercise name `Lateral machine` | **KEEP** | Correct top-level task identity. |
| Editable `85` and `LB` | **KEEP** | Load must remain visible and changeable. Its focus behavior and computed input size were not supplied. |
| Per-set numeric target `14 · 14 · 13 · 12` | **KEEP** | Engine-owned prescription; useful overview. |
| “beat last time…” / “Don't sweat one rep…” explanation | **DEMOTE** | Rationale/history belongs one tap down during an active rest period. |
| Effort ladder | **KEEP**, surface the current rung | The instruction affects execution, but the active set's `2 in the tank` must be much more prominent than the full four-set paragraph. |
| `NOW ›` paragraph | **DEMOTE** | It repeats the target and last-set reasoning. Preserve it in the receipt/details layer. |
| `RUNWAY › … ±0.61 spread` paragraph | **DEMOTE** | Keep the honest progression receipt, but statistical notation and banking rules are backend complexity on the active set screen. Visible summary: `2 reps to 87.5 lb`. |
| `▸ setup` disclosure | **KEEP** | Correctly places optional depth behind a tap; move it below the logging controls. |
| `last · Sun 8/9…` | **DEMOTE** | Useful history, not required to execute this set. Put it with setup/history. |
| `next rung · 87.5` | **DEMOTE** | Preserve as progression context one tap down; the current load and current effort come first. |
| Four set chips | **KEEP the progress information; replace the component** | They are useful, but noninteractive DIVs must not look like controls. Render a plain progress strip or labels; do not use brass button styling. |
| Large rep value and 72×72 − / + | **KEEP** | This is the strongest part of the surface: high salience and generous targets. |
| `REPS · SET 1 OF 4 · 2 IN THE TANK` | **KEEP**, redesign hierarchy | Current set and effort are essential, but the phrase wraps and is visually subordinate. |
| `LOG SET · REST TIMER STARTS` | **KEEP** | Specific consequence, 326×64 gauge action, and excellent prominence. |
| `first lift, set 1 — nothing behind you` | **CUT** | It repeats the lift and set state already shown twice; “nothing behind you” adds no action or required honesty. |
| `skip lift ▸` | **KEEP** | Misses/skips must remain explicit and reachable; §4 establishes a 100×66 target. |

## Findings, severity-ranked

### P1 — The action hierarchy is inverted for use between sets

**Observed:** Between the load and the rep control sit the multi-line TARGET/EFFORT block, the multi-line NOW paragraph, the multi-line RUNWAY paragraph containing `±0.61`, setup, last-session detail, next rung, and the set-chip row. All of it is visible in both themes before the large `14`.

**Why this fails the bar:** The athlete's immediate job is to confirm the current load, reps, and effort, then log. The screen instead exposes the engine's explanation and receipt in the primary path. This directly conflicts with “complexity never leaks to the surface—depth is fine one tap down.”

**Smallest fix:** Immediately follow exercise/load with the active set, rep value, current effort cue, and CTA. Put NOW, RUNWAY, last, next rung, and setup/history below the CTA under one disclosure. Keep every engine number unchanged and keep the full receipt available.

**Acceptance test:** In a 390×844 capture in both themes, the visual sequence is exercise/load → current set/reps/effort → entire log CTA. No statistical notation or prior-session paragraph sits between load and the active-set control; the unchanged full receipt is reachable in one tap.

### P1 — The most execution-critical cue is small and broken across lines

**Observed:** Under the very large `14`, the caption reads `REPS · SET 1 OF 4 · 2 IN THE` and then wraps `TANK` onto a second centered line. The same cue exists higher up inside a dense paragraph.

**Why this fails the bar:** `[inferred]` With heart rate up and a short rest clock, rep count is glanceable but stopping effort is not. Missing the effort cue changes how the set is performed, so this is not cosmetic.

**Smallest fix:** Give the active instruction its own deliberate line adjacent to the rep value, for example `SET 1 OF 4` and `STOP WITH 2 IN THE TANK`; keep the four-set ladder in the details block.

**Acceptance test:** At 390px width in both themes, `SET 1 OF 4` and `2 IN THE TANK` each render as an unbroken, visibly subordinate-but-immediate cue beside the `14`; neither phrase wraps mid-thought.

### P1 — The set chips are false buttons and the active chip directly violates D3/A4

**Observed:** §4 confirms all four 52×42 chips are noninteractive DIVs. Visually they have borders, 12px corner radii, and button spacing; the active `SET 1` uses brass text/border.

**Why this fails the bar:** They invite taps they cannot honor, especially beside real stepper controls. The active chip is also the charter's exact prohibited combination: non-tappable + brass + rounded-rectangle button costume.

**Smallest fix:** Replace the chips with an unboxed progress strip (`1 / 2 / 3 / 4`, with a neutral current marker). Do not make them tappable unless set navigation is genuinely supported; if navigation is added, use the gauge control grammar.

**Acceptance test:** The four markers have no control border/radius, no brass token, no pointer cursor, no role/button semantics, and no keyboard focus. Automated interaction tests confirm only real controls respond.

### P2 — The footer repeats state without helping the next action

**Observed:** `LIFT 1 OF 9`, the active set chip, and `SET 1 OF 4` already establish position. The footer repeats `first lift, set 1` and adds “nothing behind you.”

**Why this fails the bar:** It is irrelevant information on an already dense surface and fails the cut mandate.

**Smallest fix:** Remove the footer sentence; retain `skip lift` as the only footer action.

**Acceptance test:** The footer contains the skip action but no duplicate lift/set sentence; exact position remains available in the header and active-set cue.

## If only one change were allowed

**Move the current set/reps/effort controls and the log CTA directly under the exercise/load, and collapse the receipt/history beneath them.** That single hierarchy change most improves the actual sweaty-hand loop.

---

# 3. Decision detail

**One-line verdict — NOT YET:** each decision is individually comprehensible, but nine expanded essays and two fixed layers over the text make approval work slower and less trustworthy than the consent promise requires.

**Mechanical compliance observed:** card controls have no supplied sub-44px or contrast failures; approve and `+` use gauge, while Dismiss is a clear neutral outline action.

## KEEP / DEMOTE / CUT

| Distinct element | Disposition | Audit judgment |
|---|---|---|
| Section disclosure triangle | **KEEP the disclosure function; recolor** | The direction cue is useful if it really collapses the section, but brass is not appropriate for an operational disclosure/current state. Interactivity is not proven by the screenshots. |
| `DECISIONS` title | **KEEP** | Clear and direct. |
| Truncated consent subtitle | **KEEP**, shorten | Consent is load-bearing. Replace the clipped phrase with the complete plain line `Nothing changes without you.` |
| Count `9` | **KEEP** | Sets scope and supports triage. Use the settled neutral/state treatment rather than brass if the count is brass. |
| Card shell and jade left rail | **KEEP** | Strong separation; jade operates as proposal state rather than an action. |
| `PROPOSAL` | **KEEP** | Explicit state text prevents color-only meaning. |
| `AGENT` source label | **DEMOTE** | Provenance matters, but this low-information metadata can sit with the receipt unless different agents materially change the decision. |
| Plain proposal headline | **KEEP** | It states the muscle, lift, and exact +1 change. |
| Brass `(measured — computed from your own logs)` line | **KEEP** | Short provenance/honesty line; unboxed and plausibly brand use, so it does not impersonate a button. |
| 85–95-word engine paragraph | **DEMOTE**, never remove | Keep a one-sentence reason visible; put the full unchanged reasoning behind `Why this proposal?` or equivalent. This preserves receipts while removing default overload. |
| `Approve: … Dismiss: …` consequence block | **KEEP**, move upward | This is the clearest consent copy on the card and should precede the long receipt. |
| Gauge `Add the set — approve` | **KEEP** | Specific action and correct tap color. |
| Outline `Dismiss` | **KEEP** | Clear no-change branch and appropriate secondary weight. |
| Nine cards fully expanded in one scroll | **DEMOTE to compact summaries** | Keep every decision and every receipt, but default each to headline + one reason + exact effect + actions; expand depth on demand. |
| Floating gauge `+` | **DEMOTE / DOCK on this surface** | Logging remains important, but a global action may not cover the text required for informed consent. |
| Fixed `▸ RESUME SESSION · LATERAL MACHINE SET 1` bar | **KEEP the function; relocate and recolor** | An active-session return is useful, but it must reserve layout space and, if tappable `[inferred]`, use gauge rather than brass. |
| Bottom navigation | **KEEP** | Persistent navigation is understandable; its fixed area must be included in content-safe padding. |
| Brass `LEDGER ●9` pending badge | **KEEP the count; recolor** | Nine pending decisions are operational state, not an earned moment. The teal tab label already carries the tap cue. |

## Findings, severity-ranked

### P1 — Fixed UI visibly occludes the consent content

**Observed:** The supplied measurements say the floating `+` covers two text blocks and the fixed resume bar covers three. Both light and dark captures visibly show the second card's rationale, consequence area, and lower controls passing behind these layers.

**Why this fails the bar:** The athlete is being asked to approve a real program change while portions of the reason/effect are covered. This harms the consent loop and makes the surface look unfinished. Because scrolling recovery was not demonstrated, the evidence proves occlusion but not total inaccessibility; that is why this is P1 rather than P0.

**Smallest fix:** Create one reserved fixed-chrome zone above the bottom navigation, give scroll content bottom padding equal to that zone, and remove the floating `+` from the card text column—dock it in navigation or hide it while an expanded decision is in view. The resume action must occupy reserved space, not overlay content.

**Acceptance test:** Automated bounding-box assertions at 390×844 in both themes report zero intersection between fixed/floating elements and any card headline, rationale, consequence, or action. A scroll-to-end test shows the ninth card and both actions entirely above the fixed navigation/chrome.

### P1 — The default expanded queue contains 765–855 words of engine prose

**Observed:** §4 gives 85–95 body words per card and nine cards, totaling 765–855 body words, before counting labels, headlines, consequence blocks, and buttons. The screenshot shows only one complete card plus part of the second in a viewport.

**Why this fails the bar:** The surface is a decision queue, but its default unit is an essay. It leaks engine complexity, makes comparison/triage difficult, and conflicts with “depth is fine one tap down.” Honesty prevents deletion, not demotion.

**Smallest fix:** Default every card to: proposal headline, one plain-English reason sentence, the exact approve/dismiss consequence, and both actions. Put the complete original rationale behind a `Why this proposal?` disclosure on that card.

**Acceptance test:** Every collapsed card exposes what changes, why in one sentence, and what approve/dismiss do; opening the receipt reveals the complete unchanged source text. No receipt is deleted, and only one card's long rationale is expanded at a time.

### P1 — The resume bar appears to be a brass control

**Observed:** The fixed rectangle begins with `▸ RESUME SESSION` in brass and names the live lift/set. `[inferred]` Its imperative label, chevron, placement, and bar treatment strongly afford a tap; the screenshots do not prove its DOM role.

**Why this fails the bar:** If tappable, it directly violates “brass … never a control.” If it is not tappable, it presents a second false affordance while still occluding content.

**Smallest fix:** If interactive, render it as a gauge resume control inside reserved layout space. If informational, remove the chevron/control treatment and provide a separate gauge resume action.

**Acceptance test:** DOM/accessibility inspection establishes exactly one resume control. That control uses the gauge token and has button/link semantics; no brass-colored ancestor supplies its control appearance.

### P2 — The consent promise is visibly truncated

**Observed:** Both themes show `real changes never happen without you…` clipped in the section header.

**Why this fails the bar:** The most important trust statement looks incidental and competes with title, count, and disclosure icon in one line.

**Smallest fix:** Replace it with `Nothing changes without you.` or place the complete sentence on a second line.

**Acceptance test:** At 390px width in both themes, the full consent sentence, title, and count render without truncation or ellipsis.

### P2 — The first rationale contains an avoidable copy collision

**Observed:** The first card renders `Rows (strapless)(its strongest mover)` without spacing or punctuation between adjacent parentheticals.

**Why this fails the bar:** It is small, but it weakens the “best of industry” finish on the exact text being used to justify a program mutation.

**Smallest fix:** Rewrite as `Rows (strapless), its strongest mover.`

**Acceptance test:** Copy snapshot and rendered card contain no adjacent `)(` sequence.

## If only one change were allowed

**Eliminate all overlap between fixed UI and decision content.** Informed approval is the surface's job; no global shortcut or session banner may cover the reason, consequence, or actions.

---

# 4. Cross-surface tap-color consistency

I interpret D3/A4 as a chromatic grammar: teal always denotes interaction; jade/orange/redline are state-only; brass is restricted to brand/earned moments and can never style a control. Neutral outline/text controls remain permissible—otherwise the brief's explicitly described outline `Close` and `Dismiss` controls would make the charter internally inconsistent.

## Elements that comply

- Capture `Save` and `Log 163.6 lb`: gauge, tappable.
- Capture `Close` and neutral steppers: visibly conventional neutral secondary controls; no reserved state/brand color is used.
- Background `ON COURSE`: brass, unboxed, and presented as an earned/status headline rather than a control.
- Gym `LOG SET · REST TIMER STARTS`: gauge, tappable.
- Gym `exit`, `setup`, `skip lift`, and steppers: neutral controls.
- Decision `PROPOSAL` plus the jade card rail: jade used as state, not action.
- Decision `Add the set — approve` and floating `+`: gauge, tappable.
- Decision `Dismiss`: neutral outline control.
- Decision `(measured — computed from your own logs)`: unboxed brass provenance/brand line, not a control.

## Elements that violate or likely violate the grammar

| Element | Judgment |
|---|---|
| Capture `OWED — 2 ITEMS` | **Violation.** §4 identifies it as brass, but owed work is an operational miss/state, not brand or an earned moment. It is correctly unboxed, so the button-costume clause is not implicated. |
| Gym first active progress dot | **Violation.** It uses brass for current position at `LIFT 1 OF 9`; nothing has yet been earned. Use neutral contrast for “current” and reserve brass for an actual earned moment. |
| Gym active `SET 1` chip | **Direct, two-part violation.** It uses brass for current state and, per §4, is a noninteractive DIV inside a rounded-rectangle button costume. |
| Decision section triangle | **Likely violation.** It is brass and represents disclosure/current section state, not brand/earned. `[inferred]` If the header is clickable, the brass glyph also participates in a control. |
| Decision resume-session bar | **Likely direct violation.** The brass imperative/chevron visibly affords interaction. `[inferred]` A DOM role/click-handler check is needed to prove the control half of the violation. |
| Decision `LEDGER ●9` badge | **Violation.** The brass dot/count represents pending operational state and sits inside the active navigation control; it is not an earned moment. |

No other visible chromatic violation is supported strongly enough by the captures or §4 to file. In particular, the neutral secondary controls should not be recolored gauge unless the settled law was intended as the biconditional “every tappable element must be teal”; the brief does not say that, and its own outline-button facts argue against it.

---

# 5. The mid-workout test

**Scenario:** phone in a sweaty hand, heart rate up, 60 seconds of rest.

| Result | What the supplied gym screen supports |
|---|---|
| **Readable at a glance** | `Lateral machine`; `85 LB`; the very large `14`; the − / + controls; the full-width `LOG SET · REST TIMER STARTS`; `LIFT 1 OF 9`. The given 72×72 steppers and 326×64 CTA are strong physical targets `[inferred from the supplied dimensions]`. |
| **Present but not glance-readable** | The active effort target (`2 IN THE TANK`) because it is small and wraps; exact `SET 1 OF 4` because it shares that caption; the four-set target/effort plan because it is embedded in a paragraph; the stimulant caveat; last performance; next rung. |
| **Requires deliberate reading** | The NOW rationale and the RUNWAY rule, especially “two sightings” and `±0.61 spread`. This is receipt-level material, not an active-set command. |
| **In the way** | The prescription/rationale/history stack between load and rep control; false-button set chips; three separate position statements (`LIFT 1 OF 9`, set chip, footer); the persistent two-line STIM CHECK after its initial message has been delivered. |

**Mid-workout verdict:** `[inferred]` The athlete can adjust `14` and log the set safely because the physical controls are excellent. He cannot recover the current effort instruction with the same speed. The visual priority is therefore “rep count and logging” first, “why the engine chose it” second—but the screen's document order is the reverse. Move the active-set block up and the receipt down.

---

# 6. What could not be graded

| Unknown | Why the evidence is insufficient | Evidence that would close it |
|---|---|---|
| Capture sheet's STEPS row, absolute bottom, and any final close-day commit/feedback | The `fullscroll` file is the correct surface but still ends while the PROTEIN row is partially shown; §4 confirms STEPS exists but not its rendered bottom state. | One capture scrolled to the absolute bottom in each theme, including the last control and safe-area boundary. |
| Capture input focus, keyboard, step increments, long-press behavior, and unsaved-dismiss handling | Static images and the supplied facts establish font size/targets, not interaction. | A short real-device recording covering all six inputs, keyboard appearance, −/+, Save, Close/drag/backdrop dismissal, validation, and undo/confirmation. |
| Gym load input size/focus behavior | §4 does not give the computed size of the `85` input or its keyboard behavior. | Computed-style output plus a real-iPhone focus capture. |
| Gym state after `LOG SET` | The timer, logged-set styling, next-set transition, next-lift transition, completion state, and undo are absent. | A state-sequence recording from pre-log → rest timer → next set → next lift, in both themes for visual parity. |
| Gym skip/exit consequences | Targets are measured, but confirmation, miss recording, recovery, and undo are not shown. | Interaction tests/recording for skip and exit, including the ledger result and undo. |
| Whether gym `NOW ›` / `RUNWAY ›` are links | Chevrons suggest navigation, but §4 gives no roles or handlers. | DOM/accessibility-tree inspection and click tests. |
| Whether the Decision section header and resume bar are interactive | Static affordance is visible; semantics are not. | DOM roles, focus order, click handlers, and keyboard activation tests. |
| Whether decision content hidden by fixed layers can always be recovered by scrolling | The captures prove overlap, not the entire scroll range or bottom padding. | A full scroll recording from first to ninth card plus automated fixed-element/content bounding-box checks. |
| Layout/content quality of decisions 3–9 | Only card 1 and part of card 2 are visible; §4 supplies word-count range but not all rendered headlines/copy. | A full-page capture with fixed chrome temporarily outlined, or individual captures of all nine cards in both themes. |
| Approve, Dismiss, undo, loading, error, and reversal states | The brief states the charter but supplies only pre-action cards. | Interaction sequence for approve and dismiss through confirmation, removal/reordering, undo, failure, retry, and receipt. |
| Screen-reader names, focus order, Dynamic Type, reduced motion, and landscape behavior across all three surfaces | Contrast and target measurements do not establish these modes. | Accessibility-tree dumps and real-device captures/tests at supported text sizes, reduced motion, and landscape. |
| The supplied D2 `NORMAL NIGHT — checked, clear` surrounding-surface line | It is not visible in any of the seven reviewed images, and TRAIN list re-grading is expressly out of scope. | No evidence is needed for this mini-pass; audit it only in its already-scoped surface review if reopened. |

## Final independent judgment

The shipped build is not failing because it lacks polish tokens, contrast, or touch size; those foundations are visibly strong. It is failing this mini-pass bar because the backend's explanation is still competing with the athlete's next action:

1. Label and date the capture inputs.
2. Put the current set above the gym receipt.
3. Stop fixed controls from covering decision evidence, then collapse the nine receipts by default.

Those changes preserve every engine value, every miss, every uncertainty/receipt, and every explicit approval while materially reducing cognitive load.
