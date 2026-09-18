# C-UI-1 · Design pins, fonts, scene module, review hooks

Lane C (screens tier), UI port. Filed 2026-09-18 by the design chat (EARNED MAIN PM, Fable 5.1), which runs this lane's builders and reviewers; the PM (EARNED PM3) integrates. Design of record: `rebuild/m1/approved-2026-09-18/` (read its README first). Locks common to every ticket: README section 4. Rigor: LANES.md screens tier (one independent Opus reviewer told to disagree, author ≠ reviewer, CI green both OS, the two gates green: `python3 quality/gate.py` and `python3 quality/statesheet.py` from the pack with `EARNED_APP` pointed at the preview build).

- WHY: everything else binds to this. Until the pins move, no screen can change.
- DESIGN OF RECORD: `rebuild/m1/approved-2026-09-18/` (this pack), `quality/STANDARD.md`.
- MAY CHANGE: `rebuild/m3/w7-preview/today/design.cjs` (the pins, the fonts, the inlined
  stylesheets: app.css, states.css, states-workout.css, states-coach.css), a new
  `scene.mjs` lifted from `app/app.js` (plate geometry incl. the Dawn crop, occlusion mask,
  mist, embers, grain, chassis scroll fades), `preview.css` (replaced by the pinned
  stylesheets), the preview build (`build.mjs`) to serve the assets offline and to honour
  the review hooks, `browser-check.mjs` (sweeps).
- LOCKED: section 4. The old 2026-09-08 pins stay in git history; nothing else moves yet.
- ACCEPTANCE: the preview build opens offline in both themes with the scene drawn and no
  console error; `quality/gate.py` pointed at it passes its scene, motion, copy and font
  checks (the layout checks come green screen by screen in the tickets below); the fonts
  are DM Sans and Liberation Serif by sha256; reduced motion draws one still frame.
- SEQUENCING: first. Pins move in this ticket only.
