# P0-B "HIS NUMBERS, Route B" - AUTHOR REPORT

Ticket P0-B. Lane C, screens/plumbing. Sonnet / medium. Branch
`rebuild/c-his-numbers`. Built on cloud commit `66c8af08`; owner ruling
DECISIONS:417 (no more sandbox code copying) required re-authoring and
executing this on Joe's PC at `f5fe2bf7`. Route B, inside the unpinned
files the ticket names; `today-entry.mjs` untouched.
## Files : hunks
* `today-model.cjs` - `basis` settable; new `adoptBasis(state)`, exported.
* `today-app.cjs` - first synchronous `render()` unchanged; after it, an
  async block (enrolled only) reads `setup.athleteState()`, adopts it,
  rebases the gym card, adopts check-in's engine state. No render call
  of its own (fixed on the PC, see Deviation).
* `gym-model.mjs` - `host`/`engine`/`day`/`plannedSplitSlotId`/`client`
  reassignable; new `rebase()` (`hostForDay(day)` once); `orderRefusal()`
  reads the rebased handle; new export.
* `checkin-model.mjs` - `sleepRecord` settable; new `adoptEngineState(state)`.
* `test/problem.test.mjs` (chosen unfrozen file): 6 new cells P0B.1-P0B.6,
  3 new imports.

All H3-pinned test files, workflows and DECISIONS.md untouched.
## Deviation from 66c8af08 (found and fixed on the PC, r1)
Two bugs the cloud suite could not catch (no jsdom in the sandbox).
(1) `rebase()` refused whenever `preparedId` was set, but
`createWorkoutEntry`'s own constructor probe always sets one before
`mountToday` runs, so `rebase()` silently never fired. Fixed: only
`saved !== null` refuses it; a probe-only `preparedId` is reset by the
swap instead. (2) an unconditional `render("today")` after adoption tore
down whatever the athlete had open on that screen, breaking the
pre-existing `problem.test.mjs` R5 cell. Fixed: removed; the repaint now
comes only from `workout.refresh()`'s existing `onRefresh` cascade.
## r2 (independent review REJECT, rebuild/lanes/c/P0B-REVIEW.md at af486cdb)
Three findings against `a7b75dd4`, each fixed in the same 4 unpinned files,
each with a new or extended cell, re-run on the PC.
F1 BLOCKING - today-app.cjs:1093 guarded on the ENTRY's adoptEngineState,
which does not exist; only the model's does (`entry.checkin`). Fixed: call
through `checkin.checkin`. Cell P0B.7: `read().sleepRecord === null` on his
basis, and "From your sleep record for" never appears on his sheet.
F2 MAJOR - the synchronous first frame painted the fixture's kcal, protein,
calorie band and weight trend before adoption. Fixed: today-model.cjs gates
those four - never fabricated, the SAME gated/non-finite shape the engine
already returns for no data - set and cleared by today-app.cjs around
adoption; S19 untouched, since basis itself is untouched. Cell P0B.8; P0B.3
extended for the un-enrolled case.
F3 MINOR - a tap that won the adoption race could Start over the fixture
host and durably write a fixture id. Fixed: gym-model.mjs refuses Start
until adoption settles (`holdForAdoption`), released on every exit path,
including no-state and no-workout-lane installations. Cell P0B.9 reproduces
the 300 ms delay and the early tap.
F4 MINOR - `rebase()` left `previousByLift`/`message` stale and returned a
pre-rebase `day` snapshot; checkin-model's `sleepRecord` was a snapshot too.
Fixed: cleared on rebase; both are live getters now.
F5 NOTE - the constructor-refusal status string was unreachable (`#today-
status` already read "Ready."). Fixed: the guard no longer needs an empty
status line.
## Bar table
| # | Item | Cell | Status |
|---|---|---|---|
| 1 | Enrolled: Dad, note hidden, workout available | P0B.1 | PASS |
| 2 | Gym card lists his own ids | P0B.2 | PASS |
| 3 | Fresh install byte-unchanged | P0B.3 | PASS |
| 4 | Foreign basisState still throws | P0B.4 | PASS |
| 5 | Weigh-in + set survive reopen | P0B.5 | PASS |
| 6 | No frame paints a foreign athlete | P0B.6 | PASS; see note |
| 7 | Check-in adopts his state (r2 F1) | P0B.7 | PASS |
| 8 | First frame paints no fixture figure (r2 F2) | P0B.8 | PASS |
| 9 | Early tap writes no fixture id (r2 F3) | P0B.9 | PASS |
## Executed on the PC (Node from codex-primary-runtime), r2
`node --test`, 13 files by name: `tests 562 / pass 562 / fail 0 / cancelled
0 / skipped 0 / todo 0`. `build.mjs`: `A1 TODAY BUILD PASS`. `build-pwa.mjs`:
`A5 PWA BUILD PASS`. `rig187.cjs => PASS` (same pre-existing SUITE GAP note,
unrelated to this ticket). `b-package.cjs --ci --package H3`: `PRODUCT
IMPLEMENTED ... 0 unlisted drift`; `PUBLIC CI EVIDENCE PASS`. All six files
verified LF-only (no CR byte) after every edit.
## Item 6 as written
"Not even one frame" cannot be literal without editing `today-entry.mjs`
(forbidden) or breaking pinned `setup.test.mjs` S13/M9, S14, S19, which
assert DOM state synchronously before `host.all()` could settle. The
first render stays byte-identical; adoption runs after it. P0B.6 proves
the nearest true property instead: the fixture carries no `athlete_label`
at all, so no frame ever paints a FOREIGN athlete's name; every render's
label is `undefined` or `'Dad'` - executed and green on the PC.
## Residual risk
With no workout lane at all, Today's model is still correctly adopted, but
nothing auto-repaints the screen until the next render for another reason.
Not covered by a cell. r2's F3 fix does not depend on this repaint.
## Commit
`git -c user.name="cowork (Earned PM)" -c user.email="joeymat11@gmail.com" commit -a -m "P0-B r2: check-in adoption wired; enrolled first frame paints no fixture figure; early-tap safety; carry-overs cleared" -m "Co-Authored-By: Claude Sonnet <noreply@anthropic.com>"`
