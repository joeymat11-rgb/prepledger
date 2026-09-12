# A4 DAD FIRST-RUN - INDEPENDENT REVIEW
Independent (author != reviewer), told to disagree; every claim re-executed, not read. Candidate `rebuild/lane-c-a4` @ **fa9ce03** (round 2: 97c969e; round 1: 308f983), base `origin/rebuild/t2-client-core` @ **61d1f16** with P1 (no dashes) and P2 (host requests) merged. Bar: `BUILD-BRIEF.md` S1-S25, mutants M1-M20, floor 58 subtests, custody s1, persistence s2, provenance s2.8; screens tier (`DECISIONS:88`). Commands, per-check S1-S25 table, probes and full evidence: **`A4-REVIEW-ANNEX.md`** (this file is the `:119 (6)` form).

## Verdicts
Round 1 at 308f983: **ACCEPT WITH CONDITIONS** (review commit `e1dc377`), C1 and C2 blocking.
Round 2 at 97c969e: both blocking conditions closed by execution.
Round 3 at fa9ce03: **FINAL VERDICT ACCEPT at fa9ce03** - the re-pin onto P1 and P2 holds; no new condition.
- **C1 BLOCKING, the landing Today must say the figures on it are not his yet: CLOSED.** `setupNoteNeeded()` is a predicate over the durable record and `model.stateFromOps()`, not a flag; it clears itself when H3 closes; reviewer mutants R6/R7 both killed; asserted in `setup-check.mjs` on the landed Today, and it survives the re-pin.
- **C2 BLOCKING, the H3 hand-off text would misdirect lane B: CLOSED.** `A4-REPORT.md` s6 carries the corrected one-liner verbatim; the H3 test asserts all four states.
- **C3 NON-BLOCKING, `setup-check.mjs` measured 3 of 6 screens and claimed 6: CLOSED.** Called on all six; the PASS line is derived from a `measured` Set.
- **C4 NON-BLOCKING, P1 was to merge first (`:117 (1)`): CLOSED.** P1 and P2 are merged and A4 is re-pinned onto them.
- **C5 NON-BLOCKING, dashes in the built page: CLOSED, and now at the PAGE level.** P1's build guard refuses; the build line counts the 904 frozen-source strings that reach the screen only through `plainCopy`.
- **C6 NON-BLOCKING, S22 the hand test: OPEN.** A human run; not performed by this reviewer and not substitutable by any suite.
- **C7 NON-BLOCKING, the `:119 (6)` report cap: DONE.** This file plus its annex; `A4-REPORT.md` is now 58 lines with `A4-REPORT-ANNEX.md`.

## Round 3 (re-pin delta fa9ce03)
Custody CLEAN: the same paths as round 2 plus the two annex files and `local-today-journey.test.mjs` (20 added / 2 removed). Nothing under `rebuild/engine`, `rebuild/client`, `rebuild/conform`, `rebuild/m4/**`, `rebuild/m3/w6/host`, `.github`, `src` or `ledger`.
**The pre-existing red is real, verified not accepted.** At base 61d1f16 `today-entry.mjs` hashes `b54d9701...` while `PAGE_PINS` still said `5fc40e1e...`, changed by P1's own `28c02b2`/`dd8904a` without a re-pin; this reviewer checked the base out and ran the suite: **journey 47/51, fail 4**, red on exactly `C4b - partial erasure...` and `C4b - the page and the drop-in are pinned to each other`. A4 closes that and nothing else. The re-pin is WITHIN LICENCE (`:106` lane C custody of `w6/test/**`; the pin's own failure message instructs it) and the other three PAGE_PINS are byte-identical to rounds 1 and 2.
**The `plainCopy(...)` assertion still proves the page speaks the CLIENT's sentence.** `plainCopy` is a pure dash-only transform (probe: identity on dash-free text) and the expected value is still built from `GymHost.RESTORE_REQUIRED`. Reviewer mutant **R10** - `boot()` writes its own restore sentence through the same boundary - turns the journey **RED (47/51)** on both C4b tests. Not weakened.
**A4's narrower dash refusal removed in favour of P1's, which is stronger.** Reviewer probe **R8**: an em dash re-inserted into `COPY.screen1Lead` makes the build exit 1 with `AI_DASH_IN_BUILD ... a string literal of rebuild/m3/w7-preview/...` naming `setup-model.mjs`, and turns the suite RED. P1's guard is attribution-aware; nothing A4 owned is now unguarded. Reviewer probe **R9**: one unrouted `textContent` write in `setup-app.mjs` is KILLED by `S23 (a) - A4 renders through P1's boundary, like every other view`.
Round 3 mutants: R8, R9, R10 - **3 killed / 0 survived**, every file restored byte-identical, worktree clean after each.
Served page: `http://127.0.0.1:4178/?screen=setup` returns **200**, CSP unchanged, `t-setup` / `setup-entry` / `setup-note` slots present; this reviewer drove all six screens on a fresh msedge profile with the screen-2 sentence verbatim and **zero** off-origin requests.

## Counts, executed by this reviewer at fa9ce03
today **64** / copy **36** / gym **64** / checkin **28** / setup **104** / all eight today test files **296** / W6 **552** / journey **51** / A0 host **22** on the two files the brief enumerates and **31** across all three (P2's `host-seams.test.mjs` is the new 9) / w7-preview **19** / `--ci` **PASS** with the worktree clean before and after / `build.mjs` **PASS** at **99** pinned inputs and "no em/en dash in any text the athlete can see".
Zero regressions; 103 -> 104 is the re-aimed S23 subtest. Four msedge checks **PASS** with verified real `taskkill /F /T`, including the mid-flow kill leaving zero operations and no partial athlete.
Bar: S1-S18 and S20-S25 PASS on this reviewer's own evidence; S19 PASS since C1; S22 NOT RUN.

## Mutants: 23 killed / 0 survived
Round 1: 13 of the brief's (M1, M2, M4, M5, M6, M10, M13-M15, M17-M20) plus 5 of this reviewer's own (R1-R5). Round 2: R6, R7 on the C1 predicate. Round 3: R8, R9, R10. Every mutated file restored byte-identical; the six added files' sha256 matched the report's table. Not re-run: M3, M7, M8, M9, M11, M12, M16 (M9 and M11 covered by R4 and the build attack).

## Custody judgment
CLEAN across all three rounds: only `rebuild/lanes/c/dad-first-run/**`, the six new `setup-*` / `test/setup.test.mjs` files, `today-app.cjs`, `screens.template.html`, `design.cjs`, `build.mjs`, `today-entry.mjs`, `rebuild/m3/w6/local/today-bindings.mjs` and the `today-entry.mjs` pin plus one boot-status assertion in `local-today-journey.test.mjs`.
`today-entry.mjs` is WITHIN LICENCE (`:111` exercising `:106 (b)`; `BUILD-BRIEF` 1.2) and is the only place `boot()`'s `basisState` key could be built.

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
9. `reachable()` always scrolls first, so S11's stronger "no scrolling" clause is not separately asserted for the two screens that do fit.
10. S22, the hand test, is owed (C6).
11. The branch is behind `origin/rebuild/t2-client-core` (2d457fd at fetch time); the integrator re-pins and re-runs.

OWNER LOOK: pending (PM).
