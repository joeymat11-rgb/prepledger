# REVIEW-LOOK-C-UI-4-l1 (Fable, independent, static plus the look unit cells; 2026-09-25)

Object: the uncommitted diff in earned-look-cui4 (branch rebuild/c-look-cui4, HEAD df91ad1) against df91ad1.
Read: every hunk of the five edited files and the new cell; the pinned pack's app.html #screen-workout, app.css
(.ui, chassis 852-870, .machine, .numerals, .log-row), states-workout.css/js (active, rest, W-06..W-43),
gate.py :83-116, :215-227, :500-560; STATE-INVENTORY-DRAFT.md W-05..W-28 and 4.1; brief rev2 s2-s7.
Not run: gate.py, statesheet.py, any browser harness, copy.test.mjs (imports rebuild/engine/index.cjs, protected).

## VERDICT: NOT AT THE BAR, honest and mostly faithful. Structure accepted; three fidelity findings to fix
before the PM pushes for look-gates; the copy STOPs and the sealed red cells are real and need rulings.

## Measured
- git status: only the five today/ files M and test/workout-look.test.mjs untracked; no pack byte, no forbidden root.
- sha256 on disk (all LF) match the builder's report: screens.template.html 15c7ba3c..., gym-app.mjs fad566f4...,
  preview.css 63fc57f1..., scene.mjs 29272b90..., design.cjs 6ef877f7..., test/workout-look.test.mjs 53f13c66....
- 320 added lines, 0 U+2013/U+2014 (scanned the diff and the new cell).
- pm-run shared: design 15/15, scene 7/7, package 12/14 (the same two reds as at df91ad1: approved-count 4 vs 2 from
  CUI1, and esbuild absent for the sibling build), workout-look 5/5. Red-first: the new cell against df91ad1's
  screens.template.html and gym-app.mjs (git show, cmd redirection) is 0/5.
- The two node_modules links resolve into Documents\Codex work folders, not prepledger-dev; gitignored.

## The seven identities (all real, bound, in the pinned face; nothing aliased or hidden)
.screen-title -> h1 data-slot=lift (serif by app.css); #set-count -> span in .session-row .count (sans);
#w-value / #r-value -> the .numerals .value divs holding the real #gym-weight / #gym-reps inputs, font: inherit
(serif 74px); .numerals .times -> the aria-hidden × div; #machine .setting -> the row title, hidden until the lane
is available; #log-label -> the one span inside #log, the same element as data-slot=log-label (the cell pins one
id and one data-slot). RIR chips: data-rir 0,1,2,3+,unsure with labels 0,1,2,3+,Unsure from gym-model's locked
list, nothing preselected. W-20: the refusal is the pack's own element class string and #rir wears is-invalid;
the stack grows upward, Log does not move. No transition or animation added; embers untouched.

## Findings (disagreements with the build)
F1 MEDIUM, preview.css rule 1. `.scene-frame.screen-workout > .view.ui` restores app.css:163's BASE .ui values
   (padding-bottom 24px, overflow-y auto), but the pack's workout screen computes padding-bottom 0 (app.css:862)
   and overflow hidden (:852); the stack's own padding already carries max(24px, safe-area) + 60.5px (:863).
   Cascade reading: (0,4,0) beats (0,2,0), so Log sits 24px above the board's edge on both screens. Fix: padding
   `0 var(--inset) 0`, overflow hidden (x and y), i.e. the workout screen's computed values, not the base ones.
F2 MEDIUM, t-rest. The pack's rest() (states-workout.js:117-152) is "the same set card, repainted": the numerals
   stay (logged set, serif), only #last-time is replaced by .w-facts. The port's rest card is eyebrow + facts with
   no numerals and no state, so W-22/23/24/26/43 draw a different card. The figures are bound data, not copy.
F3 MEDIUM, machine row known state. The port always puts the open label "Machine settings" in the 32px serif
   `.setting` and the stored pairs as legacy `.row` divs (and `p.small.quiet` for reading/failed) inside `.sub`.
   The pack gives "Machine settings" to W-33/34/36 only; on W-06 `.setting` is the setting itself ("Seat 4.") and
   the sub is the label. Bound data may fill `.setting`; if composing "name value" needs a word, it is a Joe
   question. Also the block nests p/div inside a span inside a button.
F4 LOW, W-08/W-09. The pack replaces the numerals with the .w-presc line (prescLine); the port shows blank
   underlined boxes AND the line beneath, a hybrid no board draws, and the × in the line is not the pack's gold
   .w-presc-x. Acceptable only as a disclosed departure on the comparison page.
F5 LOW, #last-time is a div with a chevron and no action (pack: a button with a 44px hit area). A drawn chevron
   that opens nothing is a false affordance; drop the chevron or make it a Joe question (the builder's Q4).
F6 LOW, legacy leaks beyond the four fixed: Refinement A/Additions C `button, input:focus-visible { outline: 3px
   solid var(--green) }` (the 09-08 green, on the serif entry box and every pack button), `button { min-height:44px }`
   and `.link { padding: 8px 0 }` on the bottom link row, `.arrow { 22px }` (overridden for .log .arrow only).
   Not gate-measured except through Log's position; name them or scope them out like the other four.
F7 LOW, design.cjs RUNTIME_COPY declares " of " but not the new fragments "Set " and "Log " (both verbatim in the
   pack); declare them so the binding lists what the card now composes. On typing into a flagged box the W-19
   refusal and is-invalid stay until a chip click; clearing on input would match the drawn state.
F8 NOTE, #machine rows. The expected-green list counts `#machine .setting`, the #machine inner edge and icon inset,
   but #machine is hidden unless facade.available(); on CI (file:// build) that is unmeasured. If the lane is not
   available there, three more rows stay red. State this conditionally in the report.

## Agreed with the builder (correct STOPs)
- Coach pill (#talk-workout), #edit on the set screen, "Today's set", Unlogged/Logged, "RIR (clean reps left)",
  "Start set N", the W-18 hint, the W-21 tail, the "example" pill: none is in the inventory's verbatim list or in
  product copy (grepped STATE-INVENTORY-DRAFT.md); omitting them is right, and it leaves G:73 PRESSABLE #edit,
  the icon column rows and the #talk-workout edge/inset rows red by construction. Bar (2) cannot be met
  without Joe's words or a pack-edit ruling; no gate change may substitute.
- Sealed cells that go red: gym.test.mjs:494 (.slot count 2) and :495 ('Log set 1'), gss-annex-timing.test.mjs:247
  ([data-step]). Option for :494 without a sealed edit: keep `slot` on the dot `<i>` as the card's existing hook,
  exactly as `.choice` was kept on the chips (no legacy CSS matches .slot; app.css styles the dots by tag). :495
  and :247 need declared-edited red-first rows. gym-check.mjs (.slot, .choice) is a browser harness: same ruling.
- copy.test.mjs unrun locally (protected import); CI runs it.
- Proposed pack edit (W-06 verbatim list, after Joe's yes) belongs to the PM's P-row list; no pack byte moved here.

## Questions for Joe (pass through unchanged from the builder, plus one)
Q1-Q4 as the builder lists them. Q5 (from F3): on the machine row, may the serif title carry the stored setting
(e.g. "Seat 4.", composed name + value + period) as the board draws it?
