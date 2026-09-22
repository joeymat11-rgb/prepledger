# C-UI-3 · Today, the proposal card (T-40, T-40b..T-40h) and the weigh-in states (T-42..T-52)

Lane C (screens tier), UI port. Filed 2026-09-18 by the design chat (EARNED MAIN PM, Fable 5.1), which runs this lane's builders and reviewers; the PM (EARNED PM3) integrates. Design of record: `rebuild/m1/approved-2026-09-18/` (read its README first). Locks common to every ticket: README section 4. Rigor: LANES.md screens tier (one independent Opus reviewer told to disagree, author ≠ reviewer, CI green both OS, the two gates green: `python3 quality/gate.py` and `python3 quality/statesheet.py` from the pack with `EARNED_APP` pointed at the preview build).

- WHY: ruling 3 (the accept path) and the inline weigh-in; the card is how the engine talks.
- DESIGN OF RECORD: `app/app.html` `#card-proposal`; `proposal()` in `states-today.js`;
  inventory section 6 ruling 3; `states/TICKET-proposal-response.md`.
- MAY CHANGE: `t-today`'s proposal card markup and `today-app.cjs`'s proposal binding
  (kind, lift, change, reason, decisions, recorded line, "Change my answer"); the weigh-in
  card's refusal placement and field flag.
- LOCKED: "Applied" is never shown until the engine stores the answer (lane B ticket); until
  then the card stops at "recorded". No expiry. The bench card keeps "Use 105 / Keep 115"
  (bound, never literal).
- ACCEPTANCE: T-40 family and T-42..T-52 green and within tolerance; a tap on a decision
  records and "Change my answer" restores; the gold edge only while open.
- SEQUENCING (:732): After actual S10 release and C-UI-2 Today face, separately commissioned proposal work may compose on provisional CUI1. This is no automatic dispatch or acceptance.
- ACCEPTANCE BOUNDARY (:732): every original named font, copy, scene, motion and applicable screen gate still applies to the real composed product. No incomplete CUI1 acceptance, fake element, prototype substitution or waived failure.
- PIN PROMOTION (:732): completed CUI1 promotion requires a later named, independently reviewed reseal child. Remeasure APPROVED-PIN, design.test and affected declarations; retain parent-pinned 09-08 documents unless separately released. Whole-pack coverage stays.
