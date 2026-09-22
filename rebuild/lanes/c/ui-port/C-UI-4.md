# C-UI-4 · Inside the workout, the set and rest screens (W-05..W-29, W-32, W-42, W-43)

Lane C (screens tier), UI port. Filed 2026-09-18 by the design chat (EARNED MAIN PM, Fable 5.1), which runs this lane's builders and reviewers; the PM (EARNED PM3) integrates. Design of record: `rebuild/m1/approved-2026-09-18/` (read its README first). Locks common to every ticket: README section 4. Rigor: LANES.md screens tier (one independent Opus reviewer told to disagree, author ≠ reviewer, CI green both OS, the two gates green: `python3 quality/gate.py` and `python3 quality/statesheet.py` from the pack with `EARNED_APP` pointed at the preview build).

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
- SEQUENCING (:732): After actual S10 release, separately commissioned workout views may build on provisional CUI1, parallel with C-UI-2. This is no automatic dispatch or acceptance.
- ACCEPTANCE BOUNDARY (:732): every original named font, copy, scene, motion and applicable screen gate still applies to the real composed product. No incomplete CUI1 acceptance, fake element, prototype substitution or waived failure.
- PIN PROMOTION (:732): completed CUI1 promotion requires a later named, independently reviewed reseal child. Remeasure APPROVED-PIN, design.test and affected declarations; retain parent-pinned 09-08 documents unless separately released. Whole-pack coverage stays.
