# BRIEF-RIR-DISPLAY: show the RIR target and label the effort picker

Filed 2026-09-17 by the PM (EARNED PM3). DESIGN: Joe, in Claude Design (the design of
record is linked below once he shares it). BUILD: a lane-C builder dispatched by the PM
chat from that design. REVIEW and INTEGRATION: the PM chat (independent review, cells,
the seal ride). Lane C, screens tier. Claude Code is not involved.

## Why

The gym card's effort picker is already RIR: `0 / 1 / 2 / 3+ / Unsure`, worded
"clean reps left" (`rebuild/m3/w7-preview/today/gym-model.mjs:27-32` EFFORT_CHOICES,
`:61-62` effortWords, help copy `gym-app.mjs:46-48` CLEAN_REP_HELP). Every set has a
prescribed target too: "Aim to finish with N clean reps left" (`gym-model.mjs:81-84`
effortInstruction). The engine is RIR-driven (`rebuild/engine/progression.cjs:34`,
`performed.cjs:77-108`). What is missing is the word RIR and where the target shows.
The owner, an enthusiast, wants RIR targets visible.

## Design of record

- Claude Design link: (to be filled by the PM when the owner shares it)
- Exported HTML committed at: rebuild/lanes/c/rir-display/design.html (to be filled)

## What the build may change (display only)

- `rebuild/m3/w7-preview/today/gym-app.mjs` and `gym-model.mjs`: labels, the target
  line, the help copy.
- The lift row renderer on the Train screen (where the row prints `target` in
  `rebuild/m3/w7-preview/today/today-app.cjs`).

## LOCKED (the build does not change)

- EFFORT_CHOICES values, the `reserve` tags (exact / at_least / unknown), the number
  of choices, and what `logSet` stores. No new choice (no 4, no 5+): the engine
  treats 3+ as far from failure and uses no finer resolution.
- Nothing under `rebuild/engine/`, `rebuild/m4/`, `rebuild/m3/w6/local/`.
- No U+2013 (en dash) or U+2014 (em dash) anywhere in UI copy; use a hyphen, a
  colon or the word "to".
- Existing tests stay green; a cell pins any changed copy string.

## Sequencing

These files are pinned in the S6 package, so the change ships inside a sealed package
after the history-import fix (P3-PORT-FIX, S7). Design any time; build and seal after.
