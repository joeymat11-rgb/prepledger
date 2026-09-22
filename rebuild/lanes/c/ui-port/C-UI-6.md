# C-UI-6 · Coach, the structural states (C-02..C-09, C-35, C-38..C-40, C-43..C-65)

Lane C (screens tier), UI port. Filed 2026-09-18 by the design chat (EARNED MAIN PM, Fable 5.1), which runs this lane's builders and reviewers; the PM (EARNED PM3) integrates. Design of record: `rebuild/m1/approved-2026-09-18/` (read its README first). Locks common to every ticket: README section 4. Rigor: LANES.md screens tier (one independent Opus reviewer told to disagree, author ≠ reviewer, CI green both OS, the two gates green: `python3 quality/gate.py` and `python3 quality/statesheet.py` from the pack with `EARNED_APP` pointed at the preview build).

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
