# C-UI-7 · The entries: nutrition (T-58..T-71), sleep (T-72..T-95), Why this plan (T-53..T-57)

Lane C (screens tier), UI port. Filed 2026-09-18 by the design chat (EARNED MAIN PM, Fable 5.1), which runs this lane's builders and reviewers; the PM (EARNED PM3) integrates. Design of record: `rebuild/m1/approved-2026-09-18/` (read its README first). Locks common to every ticket: README section 4. Rigor: LANES.md screens tier (one independent Opus reviewer told to disagree, author ≠ reviewer, CI green both OS, the two gates green: `python3 quality/gate.py` and `python3 quality/statesheet.py` from the pack with `EARNED_APP` pointed at the preview build).

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
