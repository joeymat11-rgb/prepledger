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
Two bugs the cloud suite could not catch (no jsdom in the sandbox): (1)
`rebase()`'s `preparedId` guard always tripped (the constructor's own
probe sets one), so it silently never fired - fixed to guard only on
`saved !== null`. (2) an unconditional `render("today")` after adoption
tore down open in-page state, breaking pre-existing `problem.test.mjs`
R5 - fixed by removing it and relying on `workout.refresh()`'s existing
`onRefresh` cascade.
## r2 (independent review REJECT, rebuild/lanes/c/P0B-REVIEW.md at af486cdb)
F1 BLOCKING - today-app.cjs:1093 guarded the ENTRY's adoptEngineState
(does not exist); fixed to call `checkin.checkin.adoptEngineState`. P0B.7.
F2 MAJOR - the first frame painted fixture kcal/protein/band/trend; fixed
via today-model.cjs's `pendingAdoption` gate (the engine's own gated
shape, never fabricated); S19 unaffected. P0B.8; P0B.3 extended.
F3 MINOR - an early tap could Start over the fixture host; fixed via
gym-model's `holdForAdoption`, released on every exit path. P0B.9.
F4 MINOR - `rebase()` left stale carry-overs; `day`/`sleepRecord` were
construction-time snapshots. Fixed: cleared on rebase; both live getters.
F5 NOTE - the refusal status string was unreachable (`#today-status`
already read "Ready."). Fixed: the guard no longer needs an empty status.
## r3 (independent review ACCEPT with preconditions, review at 28d1cd9e)
Rebased onto origin tip `2ea42e8e` (docs-only), clean - precondition (i).
N1 MAJOR (precondition ii) - the `finally` releasing `holdForAdoption` sat
inside `.then`, so a REJECTED `athleteState()` never reached it, leaving
Start dark behind a message that promised it would clear. Fixed: moved to
`.finally()` on the WHOLE chain, so every path releases it. That release
alone must never hand Start the still-fixture host back (this also closes
N2, the null-state path): gym-model's new `everHeld` latches once an
install was ever held for adoption, and `start()` refuses until a rebase
actually swapped the host, not merely until the temporary hold lifts.
Cell P0B.10: a rejection still refuses Start, on the same code, with the
real status string visible; no fixture id is ever written.
N3 MINOR - the gate now also covers `workout.exerciseCount` (null; the
SAME "No session is scheduled today." sentence an athlete with no session
already sees) and `marchingOrder` (emptied; both readers already fall
back to non-fixture wording). P0B.8 extended.
N5 NOTE - both new strings exported (`ADOPTION_PENDING`; the status
line's composer, `athleteStateFailureCopy`), asserted dash-free and
sentence-terminated. Cell P0B.11.
## r4 (review REJECT, review 3e226456 in the PC review folder)
N3b BLOCKING - r3's fix emptied `marchingOrder`, but `instruction-why`
falls back to `view.statusFace.cause` when it is empty, and that field
was never gated: the enrolled first frame still painted the fixture's
own rich-history verdict (ON COURSE / "The cut is working"). Fixed in
today-model.cjs's SAME `pendingAdoption` block: `view.statusFace` is
now recomputed by calling the engine's own `statusFace()` again, over a
clone of `basis` with `reads` emptied - never a hardcoded word. That
neutral-history clone resolves to CALIBRATING, the engine's own shape
for "no qualifying data yet", exactly as the review suggested. Cell
P0B.12 sweeps the WHOLE first-frame DOM text, once, for every
fixture-distinctive string this ticket has ever had to hide (verdict,
cause, figures, trend, exercise names and ids, the count) rather than
re-checking field by field; S19 (the note stays visible) holds inside
the same cell.
MINOR - `ADOPTION_PENDING` promised the block would clear "in a
moment", which is false on the path that never clears (a rejected or
absent `athleteState()`). Reworded to a sentence true on every path
that reaches it. P0B.11 re-asserts it unchanged in shape.
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
| 8 | First frame: figures, count, order (r2 F2/r3 N3) | P0B.8 | PASS |
| 9 | Early tap writes no fixture id (r2 F3) | P0B.9 | PASS |
| 10 | Rejection: Start stays refused (r3 N1/N2) | P0B.10 | PASS |
| 11 | New copy: dash-free, sentence-terminated (r3 N5) | P0B.11 | PASS |
| 12 | Whole-DOM sweep: no fixture verdict, figure or name (r4 N3b) | P0B.12 | PASS |
## Executed on the PC (Node from codex-primary-runtime), r4, same HEAD
`node --test`, 13 files by name: `tests 565 / pass 565 / fail 0 / cancelled
0 / skipped 0 / todo 0`. `build.mjs`: `A1 TODAY BUILD PASS`. `build-pwa.mjs`:
`A5 PWA BUILD PASS`. `rig187.cjs => PASS` (same pre-existing SUITE GAP note,
unrelated to this ticket). `b-package.cjs --ci --package H3`: `SEAL BASE ON
THE TIP` (`2ea42e8`); `PRODUCT IMPLEMENTED ... 0 unlisted drift`; `PUBLIC CI
EVIDENCE PASS`. All six files verified LF-only (no CR byte) after every edit.
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
Not covered by a cell; unaffected by r2/r3.
## Commit
`git -c user.name="cowork (Earned PM)" -c user.email="joeymat11@gmail.com" commit -a -m "P0-B r4: enrolled first frame paints no fixture verdict; honest copy on the refusal path" -m "Co-Authored-By: Claude Sonnet <noreply@anthropic.com>"`
