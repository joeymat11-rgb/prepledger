# C-UI-2 · Today, the face (T-02..T-41 without the proposal states)

Lane C (screens tier), UI port. Filed 2026-09-18 by the design chat (EARNED MAIN PM, Fable 5.1), which runs this lane's builders and reviewers; the PM (EARNED PM3) integrates. Design of record: `rebuild/m1/approved-2026-09-18/` (read its README first). Locks common to every ticket: README section 4. Rigor: LANES.md screens tier (one independent Opus reviewer told to disagree, author ≠ reviewer, CI green both OS, the two gates green: `python3 quality/gate.py` and `python3 quality/statesheet.py` from the pack with `EARNED_APP` pointed at the preview build).

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
- SEQUENCING (:732): After actual S10 release, separately commissioned Today face may build on provisional CUI1, parallel with C-UI-4. Today face precedes C-UI-3. This is no automatic dispatch or acceptance.
- ACCEPTANCE BOUNDARY (:732): every original named font, copy, scene, motion and applicable screen gate still applies to the real composed product. No incomplete CUI1 acceptance, fake element, prototype substitution or waived failure.
- PIN PROMOTION (:732): completed CUI1 promotion requires a later named, independently reviewed reseal child. Remeasure APPROVED-PIN, design.test and affected declarations; retain parent-pinned 09-08 documents unless separately released. Whole-pack coverage stays.
