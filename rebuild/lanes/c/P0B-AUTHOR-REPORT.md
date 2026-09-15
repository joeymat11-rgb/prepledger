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
## Deviation from 66c8af08 (found and fixed on the PC)
Two bugs the cloud suite could not catch (no jsdom in the sandbox).
(1) `rebase()` refused whenever `preparedId` was set, but
`createWorkoutEntry`'s own constructor probe always sets one before
`mountToday` runs, so `rebase()` silently never fired. Fixed: only
`saved !== null` refuses it; a probe-only `preparedId` is reset by the
swap instead. (2) an unconditional `render("today")` after adoption tore
down whatever the athlete had open on that screen, breaking the
pre-existing `problem.test.mjs` R5 cell. Fixed: removed; the repaint now
comes only from `workout.refresh()`'s existing `onRefresh` cascade.
## Bar table
| # | Item | Cell | Status |
|---|---|---|---|
| 1 | Enrolled: Dad, note hidden, workout available | P0B.1 | PASS |
| 2 | Gym card lists his own ids | P0B.2 | PASS (after fix 1) |
| 3 | Fresh install byte-unchanged | P0B.3 | PASS |
| 4 | Foreign basisState still throws | P0B.4 | PASS |
| 5 | Weigh-in + set survive reopen | P0B.5 | PASS (after fix 1) |
| 6 | No frame paints a foreign athlete | P0B.6 | PASS; see note |
| 7 | Suites/builds/rig187 | - | PASS, verbatim below |
## Executed on the PC (Node from codex-primary-runtime)
`node --test` over all 13 files in `today/test`: `tests 559 / pass 559 /
fail 0 / cancelled 0 / skipped 0 / todo 0`. `build.mjs`: `A1 TODAY BUILD
PASS: 3 assets; 110 pinned inputs; ... no em/en dash in any text the
athlete can see`. `build-pwa.mjs`: `A5 PWA BUILD PASS: 13 files ... 11
precached and pinned by sha256 ... no network reference in any shipped
byte`. `rig187.cjs`: five `OK` lines then `rig187 => PASS - SUITE GAP:
both subjects are 35 GREEN under run.cjs; B-durability never restarts
from the store` (pre-existing gap, unrelated to this ticket). All six
files verified LF-only (no CR byte) after every edit.
## Item 6 as written
"Not even one frame" cannot be literal without editing `today-entry.mjs`
(forbidden) or breaking pinned `setup.test.mjs` S13/M9, S14, S19, which
assert DOM state synchronously before `host.all()` could settle. The
first render stays byte-identical; adoption runs after it. P0B.6 proves
the nearest true property instead: the fixture carries no `athlete_label`
at all, so no frame ever paints a FOREIGN athlete's name; every render's
label is `undefined` or `'Dad'` - executed and green on the PC.
## Residual risk
With no workout lane at all (a case several existing tests construct on
purpose), Today's model is still correctly adopted, but nothing
auto-repaints the screen until the next render for another reason. Not
covered by a cell.
## Commit
`git -c user.name="cowork (Earned PM)" -c user.email="joeymat11@gmail.com" commit -a -m "P0-B HIS NUMBERS: Today and the gym card adopt the enrolled athlete's own state (unpinned files only)" -m "Co-Authored-By: Claude Sonnet <noreply@anthropic.com>"`
