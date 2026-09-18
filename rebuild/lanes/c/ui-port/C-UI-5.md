# C-UI-5 · Workout panels: the stubs and the machine settings editor (W-01..W-04, W-30, W-31, W-33..W-41, W-44)

Lane C (screens tier), UI port. Filed 2026-09-18 by the design chat (EARNED MAIN PM, Fable 5.1), which runs this lane's builders and reviewers; the PM (EARNED PM3) integrates. Design of record: `rebuild/m1/approved-2026-09-18/` (read its README first). Locks common to every ticket: README section 4. Rigor: LANES.md screens tier (one independent Opus reviewer told to disagree, author ≠ reviewer, CI green both OS, the two gates green: `python3 quality/gate.py` and `python3 quality/statesheet.py` from the pack with `EARNED_APP` pointed at the preview build).

- WHY: every sub screen is a chassis with its action group at the parent's thumb edge (716).
- DESIGN OF RECORD: `panel()` in `app/states.js`, `states.css` (the panel chassis), the W
  panel states.
- MAY CHANGE: `machine-settings-view.mjs`, `machine-settings-host.mjs`, the gym stubs in
  `gym-app.mjs`.
- LOCKED: the editor's validation sentences are the inventory's verbatim (W-38..W-40).
- ACCEPTANCE: statesheet green for the states covered; the action group's bottom edge at 716
  in every panel; a malformed pair is drawn malformed with the field flagged (W-39).
- SEQUENCING: after C-UI-4.
