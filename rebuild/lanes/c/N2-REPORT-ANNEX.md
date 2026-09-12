# N2 SLEEP ENTRY - REPORT ANNEX

Evidence for `N2-REPORT.md`. Every count here was executed on this head in
`work/lane-c/dad` on Windows, Node v24.19.0.

## 1. THE CELLS, AND HOW TO RUN ONE

`test/sleep.test.mjs` carries 34 subtests named for D2's executable bar, so each row of
that table runs on its own:

    node --test --test-name-pattern=N2-05 rebuild/m3/w7-preview/today/test/sleep.test.mjs

| Row | Cells that execute it |
|---|---|
| N2-01 | the accepted envelope; unknown keys, foreign shapes and a forged check-in reference refuse with zero writes; `validate()` refuses the same shapes on the built envelope |
| N2-02 | explicit zero is an answer and a blank is unknown; hours, dates, strings, null, NaN, infinity; lone times, equal times, bad clock values, excessive and fractional awake minutes |
| N2-03 | a table of projected `h` deep-equalled against direct `writers.cjs sleepSpanH` calls (midnight wrap, awake subtraction, two-minute span, whole-span awake); the source scan; the mode correction that drops the clock fields |
| N2-04 | the night is the day before, across month, year and leap boundaries, agreeing with `checkin-model.mjs dayBefore`; a late entry keeps its night label while the save stamp stays separate |
| N2-05 | one op and its outbox entry in one generation through the real client; a closed lane records nothing and names its refusal |
| N2-06 | a correction appends and the latest wins; idempotent replay; ascending sort with unrelated dates and unrelated state members preserved and the original not mutated; rejected, tombstoned and foreign-profile facts excluded; no invented winner |
| N2-07 | the REAL `createCheckInEntry` over the same store: save a night, open the check-in with NO reload, the night and its date are offered, and the check-in op count is unchanged |
| N2-08 | `checkin-model.mjs sleepNightFor` finds the night N2 wrote; `checkin-*` and all four PAGE_PINS files and `today-bindings.mjs` are sha-identical |
| N2-09 | the lane is opened through `era.client.hostBindings`; no w6 factory, no second store, no second clock; a food day and a sleep night land in ONE generation under ONE lease |
| N2-10 | the night is in the state the workout preparation reads, and the reading and food replays are untouched |
| N2-11 | a clean-init athlete records a night and no screen this lane owns prints `NaN` or `undefined` |
| N2-12 | the projector is pure, so a second reader reaches the identical row without a companion; the coach's own world is untouched |
| N2-13 | an imported basis night survives; a new date preserves every old row; a held date is replaced whole; an empty op set changes nothing |
| N2-14 | the empty state, both modes, the engine's estimate, the clock-change route, the recorded line with provenance, every refusal, and the correction |
| N2-15 | with no store: what cannot happen, why, and what to do; no entry offered |
| N2-16 | the build carries the three modules; every sentence declared and the binding refuses a dropped one; no dashes; custody |
| N2-17 | a night survives a NEW host over the same encrypted store |
| N2-18 | approved selectors only, no invented class, no invented width, no literal figure in the template |

## 2. THE COUNT COMMANDS, VERBATIM

    node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/sleep.test.mjs
    node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/view.test.mjs rebuild/m3/w7-preview/today/test/adapter.test.mjs rebuild/m3/w7-preview/today/test/gym.test.mjs rebuild/m3/w7-preview/today/test/checkin.test.mjs rebuild/m3/w7-preview/today/test/ntc-h6-delta.test.mjs rebuild/m3/w7-preview/today/test/design.test.cjs rebuild/m3/w7-preview/today/test/package.test.cjs
    node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/setup.test.mjs
    node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/catalogue.test.mjs
    node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/problem.test.mjs
    node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/copy.test.mjs
    node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/food.test.mjs
    node --test --test-reporter=tap "rebuild/coach/test/*.test.cjs"
    node --test --test-reporter=tap "rebuild/m3/w6/test/*.test.mjs"
    node --test --test-reporter=tap rebuild/m3/w6/test/local-today-journey.test.mjs
    node --test --test-reporter=tap "rebuild/m3/w6/host/test/*.test.*"
    node --test --test-reporter=tap --test-concurrency=1 rebuild/m3/w7-preview/today/test/*.test.* rebuild/coach/test/*.test.cjs rebuild/m3/w6/test/*.test.mjs rebuild/m3/w6/host/test/*.test.*
    node rebuild/m3/w7-preview/today/build.mjs
    node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
    node rebuild/m3/w7-preview/today/sleep-check.mjs        (W7_BROWSER_BIN at installed Edge)

The combined serial run is the one that matters for a dash guard: `copy.test.mjs`
deliberately PLANTS an em dash into `today-app.cjs` and restores it, so running it in
parallel with any cell that builds the page is a race in the harness, not a defect.

## 3. THE MUTANTS, EXECUTED AND RESTORED

Failed-cell counts out of 34, each applied alone and restored in a `finally`:

| id | mutation | failed |
|---|---|---|
| Q1 | compute the span in the screen instead of asking the engine | 7 |
| Q2 | get the midnight wrap wrong by hand (the awake bound) | 1 |
| Q3 | accept BOTH shapes at once | 1 |
| Q4 | date the night to the entry day | 7 |
| Q5 | leave the nights unsorted | 3 |
| Q6 | accept EQUAL times, letting the clamp become a full day | 1 |
| Q7 | keep the obsolete clock fields on a mode correction | 5 |
| Q8 | turn a BLANK duration into an explicit zero | 1 |
| Q9 | take the FIRST op for a night instead of the latest | 4 |
| Q10 | include rejected and tombstoned facts in the read-back | 1 |
| Q11 | an em dash in a new sentence | 4 |
| Q12 | skip the outbox entry | 17 |

Baseline 34/34, restored 34/34, tracked diff exactly the five edited files.

## 4. THE DURABLE CONTRACT, DISCLOSED

Profile `earned/sleep-night/v1` is INVENTED and declared. Class `sleep` and kind `fact`
are the accepted `rebuild/client/ops.cjs:19-20` members; no client byte moved. Payload is
the two-key `{profile, night}` both precedents use. `night` is `{date}` plus EXACTLY one
of `{hours}` or `{bed, wake, awake_min?}`, with an optional `from_checkin_op_id` allowed
only beside `hours`. `date` is the NIGHT's own date and is refused if it is not a real
completed calendar day. Bounds: `hours` 0 to 24 inclusive at two decimals; `awake_min` an
integer from 0 through the span in whole minutes; times strict `HH:MM` and required to
differ. Every bound is INVENTED, declared, and refused in words rather than clamped.

## 5. RESIDUALS

1. CI enumeration for `sleep.test.mjs` is BLOCKED by the B-NTC pin on `rebuild.yml`
   (report item 1). Owning lane B, ruling PM.
2. N2 is not PR-READY until the `:154 (5)` pin transition lands (report item 2).
3. `s.sleep.needed` on a clean-init athlete: engine tier, beside H3 (report item 3).
4. The multi-device conflict STATE is deferred to hosted sync by :167 (1); the projector
   still refuses to invent a winner and N2-06 keeps that assertion.
5. The coach read-side companion was not needed and is not written (:167 (2)).
6. The owner's hand test on a phone, and N2-18's real-iPhone row, are NOT RUN.
