# P5-N2 COMPOSER REPORT

Lane C / Model Sonnet / effort medium. Composer only (no new build).

Merge: `git merge --no-ff origin/rebuild/astra-c-n2-r4` (bfc29357, carrying
origin/rebuild/lane-c-n2 @ 744c63c9) onto origin/rebuild/t2-client-core @ 92d6fc8.
Merge commit: `c8ce1f377e782bea7aa3e54ff90a3853272f265d` on branch
`rebuild/c-n2-admission`. Clean `ort` merge, **zero conflicts**.

## Files touched (13, +4607/-9 vs the tip; identical to the standalone delta)
rebuild/coach/local-world.mjs; rebuild/lanes/c/N2-R4-REPORT.md;
rebuild/m3/w7-preview/today/{build.mjs, design.cjs, preview.css,
screens.template.html, today-app.cjs, today-model.cjs}; and new
rebuild/m3/w7-preview/today/{sleep-check.mjs, sleep-commands.cjs, sleep-host.mjs,
sleep-model.cjs, test/sleep.test.mjs}. No pinned/sealed path (today-entry.mjs,
setup.test.mjs, rebuild.yml, rebuild/engine/**, rebuild/m4/**,
rebuild/m3/w6/host/**, local-today-journey.test.mjs) appears in this delta.

## Bar (1)-(5): N2 test cells and quoted pass lines
1. Bed/wake or duration lands in `state.sleep.nights`:
   `✔ N2-03 - every projected h deep-equals a direct writers.cjs sleepSpanH call`
   and `✔ N2-10 - the night reaches the state the workout preparation and Today read`.
2. Today, next workout prep, check-in read the same night:
   `✔ N2-10 - the night reaches the state the workout preparation and Today read`
   (Today/workout) and `✔ N2-08 - a saved night is what the check-in own reader
   finds, with no A3 edit` (check-in).
3. Correction replaces it, originals survive:
   `✔ N2-13 - an existing basis night survives, and a same-date correction keeps
   the rest` ("every old row is preserved" / "the new duration wins").
4. Absence is UNKNOWN, never zero, no restriction (D8, DECISIONS:109 PATH A):
   **no dedicated N2 cell.** This is an engine/workout-prep invariant
   (rebuild/engine/** + rebuild/m4/**, both pinned/off-limits to N2) that N2 never
   touches; N2 only ever adds a row when a night IS entered (sleep-model.cjs:8-13,
   "there is NO engine function that appends a sleep night ... that is the WHOLE
   of what N2 adds to the engine's state"). Not written as a new cell per
   instructions; flagging rather than fabricating.
5. No sleep score, target or new gate:
   `✔ N2-01 - unknown keys, foreign shapes and a forged check-in reference all
   refuse` (an input carrying `score: 9`/`quality` is SLEEP_INPUT_INVALID) plus
   the sleep-model.cjs header note above that N2's whole surface is
   `state.sleep.nights`.

## BAR (6) - executed on Joe's PC
| Check | Result |
|---|---|
| Today suite (`node --test` over test/ dir contents) | **630/630, 0 fail** (>= tip's 553) |
| W6 (`node --test test/*.test.mjs`) | **552/552, 0 fail** |
| A0 (journey + engine-equivalence) | **23/23, 0 fail** |
| `b-package.cjs --ci --package S3` | **FAIL**: child `h3-cells` (`rebuild/m4/workout/test/h3-clean-init.test.cjs`) exits non-zero at `H3/13 - the CI today step enumerates setup.test.mjs, named and not globbed` (line 720): a DECISIONS:186 closed enumeration of `rebuild/m3/w7-preview/today/test/` file names does not admit N2's new `sleep.test.mjs` (13 expected vs 14 actual). Runner then stops before `today-suites`/`a0-journeys`/`ntc-provider-cells` run. `findstr` against S3.json/H3.json found zero pin hits for any of N2's 7 touched today/ files, so this is not a product-pin collision, it is the hard-coded closed list inside h3-clean-init.test.cjs (pinned/off-limits to N2: rebuild/m4/**). |
| A1 build | **PASS** (`A1 TODAY BUILD PASS`, 113 pinned inputs, build earned-dd3eebaeefcd) |
| A5 build | **PASS** (`A5 PWA BUILD PASS`, 13 files) |
| rig187 | **PASS** |

## Collisions
None. Merge was clean; no pinned file was touched by either side.
