# BRIEF-RIR-DISPLAY: show the RIR target and label the effort picker (owner design task)

Filed 2026-09-17 by the PM (EARNED PM3). Author: Joe, in Claude Code. Reviewer and
integrator: the PM chat (independent review, cells, the seal ride). Lane C, screens tier.

## Why

The gym card's effort picker is already RIR: `0 / 1 / 2 / 3+ / Unsure`, worded
"clean reps left" (`rebuild/m3/w7-preview/today/gym-model.mjs:27-32` EFFORT_CHOICES,
`:61-62` effortWords, help copy `gym-app.mjs:46-48` CLEAN_REP_HELP). Every set has a
prescribed target too: "Aim to finish with N clean reps left" (`gym-model.mjs:81-84`
effortInstruction). The engine is RIR-driven (`rebuild/engine/progression.cjs:34`,
`performed.cjs:77-108`). What is missing is the word RIR and where the target shows.
The owner, an enthusiast, wants RIR targets visible. Design it the way you want it.

## What you may change (display only)

- `rebuild/m3/w7-preview/today/gym-app.mjs` and `gym-model.mjs`: the labels, the
  target line, the help copy. Example directions, yours to pick: "RIR" next to
  "clean reps left" on the picker and the instruction; the RIR target on the lift
  row itself (e.g. `target 10,9,8 . RIR 2 to 1`) so it reads like a programme line.
- The lift row renderer on the Train screen (find where the row prints `target`
  in `rebuild/m3/w7-preview/today/today-app.cjs`).

## LOCKED (do not change)

- EFFORT_CHOICES values, the `reserve` tags (exact / at_least / unknown), the number
  of choices, and what `logSet` stores. No new choice (no 4, no 5+): the engine
  treats 3+ as far from failure and uses no finer resolution.
- Nothing under `rebuild/engine/`, `rebuild/m4/`, `rebuild/m3/w6/local/`.
- No U+2013 (en dash) or U+2014 (em dash) anywhere in UI copy; use a hyphen, a
  colon or the word "to".
- Existing tests stay green: run `node --test` on the suites under
  `rebuild/m3/w7-preview/today/test` (and any suite that pins effortWords or
  effortInstruction; update the pinned string in the cell when you change the copy
  and say so in the commit message).

## Git rules for this branch

- Start: `git fetch origin` then a NEW branch `rebuild/c-rir-display` from
  `origin/rebuild/t2-client-core`. Never work on `main` or on `rebuild/t2-client-core`.
- The CLAUDE.md gate / rebuild-src / deploy rules are the OLD app's (`src/`). They do
  not apply on the rebuild branch. Do not run them.
- Commit small, push the branch (`git push -u origin rebuild/c-rir-display`), then STOP.
  Do not merge, do not deploy, do not open a PR, do not edit `rebuild/DECISIONS.md`.
- Never read `rebuild/conform/private`, `src/history.js`, `ledger/`, or anything under
  `C:\Users\joeym\EarnedPort`.

## Handoff

When the branch is pushed, Joe tells the PM chat "RIR branch is up". The PM fetches it,
runs an independent review with cells, and queues it for the seal after S7 (these files
are pinned in the S6 package, so the change ships inside a sealed package, after the
history-import fix). Nothing else is needed from Joe.
