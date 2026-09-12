# A4 DAD FIRST-RUN - INDEPENDENT REVIEW
Independent (author != reviewer), told to disagree; every claim re-executed, not read. Candidate `rebuild/lane-c-a4` @ **97c969e** (round 1: **308f983**), base `origin/rebuild/t2-client-core` @ **5a76fcd**. Bar: `BUILD-BRIEF.md` S1-S25, mutants M1-M20, floor 58 subtests, custody s1, persistence s2, provenance s2.8; screens tier (`DECISIONS:88`). Commands, per-check S1-S25 table, probes and full evidence: **`A4-REVIEW-ANNEX.md`** (this file is the `:119 (6)` form).

## Verdicts
Round 1 at 308f983: **ACCEPT WITH CONDITIONS** (review commit `e1dc377`), C1 and C2 blocking.
Round 2 at 97c969e: **FINAL VERDICT ACCEPT at 97c969e** - both blocking conditions closed by execution.
- **C1 BLOCKING, the landing Today must say the figures on it are not his yet: CLOSED.** `setupNoteNeeded()` is a predicate over the durable record and `model.stateFromOps()`, not a flag; it clears itself when H3 closes; reviewer mutants R6/R7 both killed (pass 101 fail 2); asserted in `setup-check.mjs` on the landed Today.
- **C2 BLOCKING, the H3 hand-off text would misdirect lane B: CLOSED.** `A4-REPORT.md` s6 carries the corrected one-liner verbatim; the H3 test asserts all four states.
- **C3 NON-BLOCKING, `setup-check.mjs` measured 3 of 6 screens and claimed 6: CLOSED.** Called on all six; the PASS line is derived from a `measured` Set, so it cannot overclaim again.
- **C4 NON-BLOCKING, P1 was to merge first (`:117 (1)`): CLOSED as recorded.** P1 still unmerged; the reversal is recorded; merge order is the PM's.
- **C5 NON-BLOCKING, dashes in the built page: CLOSED.** 74 occurrences (5 + 2 + 67), none of them A4's; my round-1 "71" was a per-line undercount.
- **C6 NON-BLOCKING, S22 the hand test: OPEN.** A human run; not performed by this reviewer and not substitutable by any suite.
- **C7 NON-BLOCKING, the `:119 (6)` report cap: DONE for this file.** `A4-REPORT.md` (953 lines) still owes its cut to `A4-REPORT-ANNEX.md`.

## Counts, executed by this reviewer at 97c969e
today **64** / gym **64** / checkin **28** / setup **103** / seven today files **259** / W6 **552** / journey **51** / A0 host **22** / w7-preview **19** / `rebuild/m4/spec/native-carriers-package.cjs --ci` **PASS** / `rebuild/m3/w7-preview/today/build.mjs` **PASS** (3 assets, 98 pinned inputs, 68 bound classes).
Zero regressions: 64/64/28 unchanged; 101 -> 103 is the two new S19 subtests; the suite is 103 named subtests against a floor of 58.
Four msedge checks **PASS** with verified real `taskkill /F /T`: `setup-check.mjs` (4 kills, one mid-flow leaving zero operations and no partial athlete), `browser-check.mjs`, `gym-check.mjs`, `checkin-check.mjs`. Dependencies installed exactly as `.github/workflows/rebuild.yml` does it.
Bar: S1-S18 and S20-S25 PASS on this reviewer's own evidence; S19 PASS at 97c969e via C1 (PARTIAL at 308f983); S22 NOT RUN.

## Mutants: 20 killed / 0 survived
Round 1: 13 of the brief's (M1, M2, M4, M5, M6, M10, M13-M15, M17-M20) plus 5 of this reviewer's own devising (R1-R5). Round 2: R6 and R7 on the C1 predicate.
Every mutated file restored byte-identical, all six added files' sha256 match `A4-REPORT.md` s1.1 after the whole run, worktree clean. Not re-run here: M3, M7, M8, M9, M11, M12, M16 (M9 and M11's mechanisms covered by R4 and by the build attack).

## Custody judgment
CLEAN: `5a76fcd..97c969e` touches only `rebuild/lanes/c/dad-first-run/**`, the six new `setup-*` / `test/setup.test.mjs` files, `today-app.cjs`, `screens.template.html`, `design.cjs`, `build.mjs`, `today-entry.mjs`, `rebuild/m3/w6/local/today-bindings.mjs`, and the `today-entry.mjs` pin in `local-today-journey.test.mjs` (re-pinned with its reason; the other three PAGE_PINS byte-identical). Nothing under `rebuild/engine`, `rebuild/client`, `rebuild/conform`, `rebuild/m4/**`, `rebuild/m3/w6/host`, `.github`, `src` or `ledger`.
`today-entry.mjs` is WITHIN LICENCE (`:111` exercising `:106 (b)`; `BUILD-BRIEF` 1.2) and is the only place `boot()`'s `basisState` key could be built; the journey re-pin is what the pin's own failure message instructs.

## H3 judgment
Reproduced by probe: `createCleanInitState` writes 22 members and neither `blackout` nor `model`, so the accepted engine throws at `rebuild/engine/energy.cjs:370` and then at `:84`, and paints only once BOTH are added - `blackout: {}` is not a fix shape and guarding one reader only moves the throw.
Engine tier, out of every screens-tier lane's custody: the build correctly stopped and handed it on per `BUILD-BRIEF` s6, so the engine half is a recorded residual and NOT blocking for A4.
Its consequence on Dad's screen WAS blocking and is closed by C1. Corrected REQUESTS one-liner: `A4-REVIEW-ANNEX.md` H3 section, and verbatim in `A4-REPORT.md` s6.

## Residuals
1. CI: `test/setup.test.mjs` and `setup-check.mjs` are not in the enumerated `rebuild.yml` today step; they ride the B-NTC re-seal (`:112`, `:117 (4)`).
2. H3 (engine tier): Today still stands on the synthetic fixture; since C1 the screen says so, and the sentence clears itself when H3 closes.
3. `e.setup` (register item H2): shipped without, per `:117 (2)` option (ii).
4. `basisState` keyed on `today` plus the enrolled clause rather than `hosts AND today`: judged acceptable; one line in `gym-check.mjs`, outside A4's licence, would close it.
5. The landing screen is Today, not screen 1; closing it properly is H3.
6. `VIEW_SOURCES` in `test/design.test.cjs` does not name the two setup view files; `assertSetupBinding` binds them itself.
7. The `19` w7-preview child retires inside the B-NTC seal.
8. Per-exercise rep target: lane B's engine question; A4 ships ONE named standard, which is what lane B recommended.
9. 74 U+2013/U+2014 remain in the built page, none of them A4's: the PM's P1 sweep.
10. `reachable()` always scrolls first, so S11's stronger "no scrolling" clause is not separately asserted for the two screens that do fit.
11. S22, the hand test, is owed (C6).

OWNER LOOK: pending (PM).
