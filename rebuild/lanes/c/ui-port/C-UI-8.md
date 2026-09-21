# C-UI-8 · Seal: the PWA shell and the slice deploy

Lane C (screens tier), UI port. Filed 2026-09-18 by the design chat (EARNED MAIN PM, Fable 5.1), which runs this lane's builders and reviewers; the PM (EARNED PM3) integrates. Design of record: `rebuild/m1/approved-2026-09-18/` (read its README first). Locks common to every ticket: README section 4. Rigor: LANES.md screens tier (one independent Opus reviewer told to disagree, author ≠ reviewer, CI green both OS, the two gates green: `python3 quality/gate.py` and `python3 quality/statesheet.py` from the pack with `EARNED_APP` pointed at the preview build).

- WHY: the owner reviews on his phone at arm's length, from the slice.
- MAY CHANGE: `rebuild/slice/pwa/*` (shell, service worker asset list for the plates,
  fonts, mist, grain), `DEPLOYS.md`.
- ACCEPTANCE: both gates green on the deployed slice URL in both themes; offline launch
  with the scene; reduced motion still; the owner's phone screenshot matches the board.
- SEQUENCING: last.
