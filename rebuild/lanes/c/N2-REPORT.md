# N2 SLEEP ENTRY - REPORT

Branch `rebuild/lane-c-n2`, base `origin/rebuild/t2-client-core` @ `358f4eb` (N1 integrated, :171). Brief of record: **`rebuild/lanes/d2/BRIEF-N2-SLEEP-ENTRY.md` v1.0**, sha256 `b0969edb…`, ACCEPTED BY NAME AND NARROWED at DECISIONS:167, plus D2's `N2-SOURCE-ERRATUM.md`. Lane C's own `N2-SLEEP-BRIEF.md` is provenance, not a second contract. Evidence: `N2-REPORT-ANNEX.md`.

## WHERE THE TWO BRIEFS DISAGREED, AND WHAT WAS BUILT (D2's wins)

| Question | Lane C's outline | BUILT, from D2's accepted brief |
|---|---|---|
| entered hours | `0 < h <= 24` | **`0` to `24` INCLUSIVE**: an explicit zero is an answer, a blank is unknown and is refused |
| awake minutes | integer `0..600` | **integer `0` through the span in WHOLE MINUTES**, compared against the same integer he typed |
| equal bed and wake | not addressed | **REFUSED**, and the hours mode is offered: `sleepSpanH` wraps a zero span to a full day |
| check-in reuse | a confirmation only | an optional **`from_checkin_op_id`**, allowed only beside a duration copied from a check-in |
| mode order | not addressed | **times first** (:167 (3)) |
| A3 | byte-unchanged | byte-unchanged **AND** the same-page rebind D2's correction 1 asks for |
| cell numbering | N2.1 to N2.20 | **N2-01 to N2-18**, runnable one row at a time by name |

Also applied: the PM's three narrowings. The multi-device conflict STATE is deferred to hosted sync and only the no-invented-winner assertion is kept (N2-06); the coach read-side companion was **not needed** and is not written (N2-12 passes without it, and `local-world.mjs` is untouched); both modes stay.

## SEAM S2, CLOSED AT THE PRODUCT LEVEL

Unlike N1 - where `writers.cjs writeDaily` already existed - **the engine has no function that appends a sleep night**. DECISIONS:107 names that absence and `checkin-model.mjs:89` states it in the product's own words. So `sleep-model.cjs` builds the row itself, in the ARRAY shape `rebuild/engine/sleep.cjs` already reads (`state.sleep.nights`, `n.d` the night's date, `n.h` its hours). That is the WHOLE of what N2 adds to the engine's state, and it is disclosed rather than smuggled in.

**The one number the screen may not compute is not computed anywhere here.** For a night given as two clock times, `h` is `E.sleepSpanH(bed, wake, awakeMin)` and nothing else: the midnight wrap, the awake subtraction and the two-decimal precision are the engine's. A source scan asserts no `1440` and no minute-to-hour division exists in this lane's own files, and N2-03 deep-equals a table of projected hours against direct `writers.cjs` calls. For a night given as a duration, `h` is the athlete's own number, unchanged, and the obsolete `bed`/`wake` are REMOVED.

Three new modules under `today/`: `sleep-commands.cjs` (the closed producer: class `sleep`, kind `fact`, both already in `rebuild/client/ops.cjs:19-20`, so no client byte moves; profile `earned/sleep-night/v1` INVENTED and declared), `sleep-model.cjs` (the refusals and the projector), `sleep-host.mjs` (the lane). One op per night; a correction is a NEW op and the latest device sequence wins; rejected and tombstoned ops are excluded.

## CUSTODY: NO PINNED FILE MOVED

`today-entry.mjs` AND `rebuild/m3/w6/local/today-bindings.mjs` are PINNED ON DISK (PAGE_PINS and the merged B-NTC artifact), and their pin-class transition is lane B's round after H3 (:154 (5)). N2 therefore opens its own lane from `today-app.cjs` through `era.client.hostBindings({workoutCommands})` - the point `local-client.mjs:395` exposes, as D2's erratum confirms - lazily and FAILING CLOSED, so every jsdom mount in this repository is unchanged. A cell re-reads all four PAGE_PINS hashes and the bindings hash from disk at test time. **`checkin-*.{mjs,cjs}` are byte-identical**, asserted by sha, and the reuse path they already carried is what N2 brings to life.

**The same-page journey (D2's correction 1), without editing either.** `createCheckInEntry` captures `stateFromOps()` once and `createCheckInModel` freezes the night it found. So the recovery route, when a night has been recorded since, builds a FRESH check-in model over the **same host** and the current projected state and mounts the **same screen**. It returns null and the original path runs whenever there is nothing to rebind, so no existing mount changes. Nothing durable is written by opening it (N2-07 asserts the check-in op count is unchanged).

## COUNTS (Windows, on this head)

`test/sleep.test.mjs` **34 (new)** / today step **164** / setup **157** / catalogue **57** / problem **25** / copy **36** / food **56** / coach **201** / W6 **552** / journey **51** (PAGE_PINS unmoved) / A0 host **32**, all 0 fail. Combined serial today + coach + W6 + host: **1314 / 1314**.

    B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict
    A1 TODAY BUILD PASS: 3 assets; 110 pinned inputs (13 engine, 12 client); build
    earned-16eafa4bce08; approved design pinned; 69 bound classes; no em/en dash in any
    text the athlete can see

**Q1 to Q12 executed and KILLED 12/12**, bytes restored and 34/34 again (table in the annex): the span computed in the screen, a hand-rolled midnight wrap, both shapes at once, the night dated to the entry day, unsorted nights, equal times accepted, stale clock fields kept, a blank read as zero, the first op winning, rejected facts included, an em dash, and a skipped outbox. **`sleep-check.mjs` PASS on msedge across 3 REAL PROCESS KILLS** (`taskkill /F /T`, each verified dead): the lane opened itself, the engine's own estimate appeared, a night was recorded with its provenance, a reload and a kill kept it, **the recovery check-in offered that night on the SAME page with no reload**, a correction replaced the whole night, an out-of-range duration was refused, and the record survived at 320px with one primary action and every visible box at 16px and 44px. The other six checks PASS unmoved.

## PREFLIGHT, NAMED (DECISIONS:155 (6), self-check)

1. `git status --porcelain` and `git diff --stat 358f4eb..HEAD` - diff inside custody.
2. The eleven `node --test` count commands above, run from the worktree root (annex section 2 lists them verbatim).
3. `node rebuild/m3/w7-preview/today/build.mjs` - build PASS at the exact head.
4. `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` - the gate ALONE, clean before and after.
5. `node -e` over this report (<= 60 lines) and over every file in UI custody for U+2013/U+2014 in string literals.
6. `node ..\tools\ci-status.js rebuild/lane-c-n2 <sha>` from `work/lane-c/main` - CI green at the exact head.

## WHAT IS OWED, AND WHERE THE BRIEF COULD NOT BE MET

1. **CI ENUMERATION IS BLOCKED, not a silent residual.** :167 says lane C adds the `sleep.test.mjs` step to `rebuild.yml` under its screens licence. It cannot: `.github/workflows/rebuild.yml` is a PARENT EXECUTION PIN inside the merged B-NTC artifact's own product inventory (`B-NTC.json`, role `superseded-by-child`), and DECISIONS:112 makes `.github` editable only inside a re-pinning engine package. Editing it here turns the B-NTC gate red on both runners. **Owning lane: B, at its next re-seal; ruling: PM.** The same residual stands for `test/food.test.mjs`, `machine-settings-ui.test.mjs`, setup, catalogue, copy and problem.
2. **N2 IS NOT PR-READY**, by :167's own words: the pin transition for `today-entry.mjs` and `today-bindings.mjs` is lane B's first tooling round after H3 (:154 (5)), and it has not landed.
3. **The `s.sleep.needed` finding stands and is NOT repaired here.** `createCleanInitState` writes `sleep: {nights: []}` and no `needed`; several engine readers read it, and the first night N2 writes makes them reachable. N2-11 asserts the SCREEN prints no `NaN` or `undefined` for that athlete and names the readers; the constructor is `m4/workout`, engine tier, beside H3 (:154 (6)).
4. **Today is not rendered for a clean-init athlete** in N2-11: `model.read()` still THROWS out of `energy.cjs` before H3 lands. That is the state N1 met, recorded again rather than locally repaired.
5. **Not done:** the owner's hand test on a phone; the real iPhone row of N2-18, which is labelled NOT RUN until observed.
