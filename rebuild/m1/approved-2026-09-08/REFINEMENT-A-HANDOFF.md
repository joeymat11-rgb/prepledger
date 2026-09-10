# Owner approval: Earned Refinement A

Joe requested a refinement pass and mockup before passing it to Earned. He reviewed the Today, workout-entry, and saved-set/rest screenshots, then said: "Yes that looks good". APM now hands over that approved design direction. This is an owner design ruling for the demonstrated changes within the established aesthetic.

## Files

- Earned-refinement-A.html: interactive, separate design prototype.
- Refinement-Today.png, Refinement-Workout.png, Refinement-Rest.png: the three owner-reviewed screens.
- DESIGN-NOTES.md: design rationale, fictional-data scope, and interaction limits.

Keep these out of production assets unless deliberately transformed into qualified product code. The prototype uses temporary in-memory data and synthetic values; its save labels do not prove persistence. No real owner data was used. The original design-of-record HTML remains untouched.

## Approved direction to apply

1. Preserve the warm paper/ink/green palette and Instrument Serif/Sans typography.
2. Make today's plan and next action more prominent than the single scale reading; keep weight/trend evidence available below. Show one actionable food target rather than a competing precise range in the primary hierarchy; retain relevant uncertainty and rationale, bringing it forward when it affects the action or confidence.
3. Show the active set's prescription separately from performed weight/reps. Make performed weight and reps directly editable, retain target vs actual distinctions, and keep contextual previous performance where comparison is qualified.
4. Present applicable effort instructions in plain language, an explicit unknown-effort choice, and no preselected performed-effort answer. The mock's exact choice set, rating frequency, load increments, target values and wording are illustrative, not a new engine/representation contract. Preserve the full accepted fact semantics.
5. After an actual successful commit, make the saved facts, Undo, rest state, and next set clear. Retain a resume action when a workout is in progress. The timer is an approved interaction direction for the applicable rest feature, not a new release prerequisite or permission to defer required recovery work.

## Integration boundaries

### Calorie-target presentation clarification

After approving the mock, Joe asked whether "Eat about 2,300" should instead show a range or give-or-take allowance, then authorized APM to choose. Retain "Eat about [qualified target] kcal" as the primary presentation; no visual revision is needed. The number in the mock is fictional. A daily flexibility range is distinct from uncertainty in the calorie estimate. Show a justified practical range in plan details when the prescription actually supplies one and it helps execution; explain estimation uncertainty under Why, bringing it forward if it changes the decision. Do not invent a numeric allowance or hide uncertainty that materially changes the advice. This copy clarification introduces no new engine rule, feature gate or workstream.

Use the retained real app/store/engine, existing brief/ownership, and applicable review path. Do not ship this standalone prototype as the app, substitute its example targets or rationale for the engine, or re-audit the already-approved aesthetic. Implement this in the planned UI work; do not interrupt the current bounded memory diagnostic or create another architecture/design workstream. If a specific approved layout conflicts with an accepted correctness/accessibility requirement, resolve that concrete issue in the existing review and preserve the visual intent.

No broad new feature scope, universal 2-RIR rule, fixed rest prescription, invented Dad profile, changed consent policy, assertion of clinical efficacy, gate waiver, paid-review authority, model or schedule change follows. Preserve reliable save/error/recovery behavior and accurate original prescriptions. Update the existing delivery checkpoint/next substantive UI brief with this approval and the intended integration slot; no status-only PR is necessary.

## APM prototype checks

Executed representative direct-entry, required explicit effort/unknown, log/readback, Undo, return-to-Today/resume, and next-set effort-reset interactions. Checked no page errors and no horizontal overflow for the three scenarios at desktop-preview/320px widths; larger-text spot check performed. These are prototype checks, not engine, persistence, full accessibility or real-phone acceptance. At 320px the active-workout content uses a small amount of vertical scrolling.
