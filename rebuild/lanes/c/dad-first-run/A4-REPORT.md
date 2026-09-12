# A4 - DAD FIRST-RUN SETUP SCREENS - BUILDER'S REPORT (`DECISIONS:119 (6)` form)

Evidence annex: `A4-REPORT-ANNEX.md` (953 lines, section numbering intact - the review cites it by section). Review: `A4-REVIEW.md`, rounds 1-2, **FINAL VERDICT ACCEPT at 97c969e**.

| | |
|---|---|
| branch / head | `rebuild/lane-c-a4` @ `97c969e` (this commit is the docs-only cut) |
| base | `origin/rebuild/t2-client-core` @ `5a76fcd` |
| tier / licence / bar | screens `DECISIONS:88` / `:117 (1)` / `BUILD-BRIEF.md` S1-S25 |
| served on the PC | `http://127.0.0.1:4178/?screen=setup` (six screens) and `/` (Today + first-run tile); server node pid 62284, 127.0.0.1 only |

## Counts - Windows, `NODE_ENV` cleared; the reviewer reproduced every one

today **64** / gym **64** / checkin **28** / setup **103** / seven today files **259** / W6 **552** / journey **51** / A0 host **22** / w7-preview **19** / `rebuild/m4/spec/native-carriers-package.cjs --ci` **PASS** / `rebuild/m3/w7-preview/today/build.mjs` **PASS** (3 assets, 98 pinned inputs, 68 bound classes).

**Zero regressions**: 64/64/28 unchanged, 101 -> 103 is round 1's two new S19 subtests. Four browser checks on real msedge with verified `taskkill /F /T` all PASS: `setup-check.mjs` (4 kills, one MID-FLOW leaving zero operations and no partial athlete), `browser-check.mjs`, `gym-check.mjs`, `checkin-check.mjs`.

Mutants: builder **20/20 killed** (re-run after round 1, restores byte-identical); reviewer 18 of its own plus R6/R7, 0 survived. Bar: **S1-S25 PASS**, except **S19 PARTIAL** (H3, now said on screen) and **S22 NOT RUN** (the hand test is a human run, still owed).

## Files

**ADDED** under `rebuild/m3/w7-preview/today/`: `setup-model.mjs` (the pure six-screen reducer), `setup-commands.mjs` (the producer for the ONE `earned/first-run-setup/v1` op), `setup-host.mjs`, `setup-app.mjs`, `setup-check.mjs`, `test/setup.test.mjs`.

**EDITED**, by file:

- `today-app.cjs` - `?screen=setup` route, refused once the record says enrolled; the first-run tile; `SETUP_NOT_HIS_NUMBERS` + `setupNoteNeeded()` + `setupNote()` (C1).
- `screens.template.html` - the `t-setup` frame; the tile and the `setup-note` slot.
- `design.cjs` - the first-run vocabulary HARVESTED from `setup-model.mjs`, with the owner's no-dash rule (`:114 (1)`) applied to every sentence of it.
- `build.mjs` - five `REQUIRED_INPUTS` lines (93 -> 98 pinned inputs).
- `rebuild/m3/w6/local/today-bindings.mjs` - `createSetupHost` beside `createCheckInHost`: one generation, one lease, first run once (lane C exclusive).
- `today-entry.mjs` - `createSetupEntry`, the KEYED `boot({basisState})` refusal `SETUP_BASIS_STATE_REFUSED` (`:102`), `athleteState()`, `athleteLabel()`.
- `rebuild/m3/w6/test/local-today-journey.test.mjs` - the `today-entry.mjs` byte pin, re-read against `today-bindings.mjs` and re-pinned as that pin's own message instructs.

Nothing under `rebuild/engine`, `rebuild/client`, `rebuild/conform`, `rebuild/m4/**`, `rebuild/m3/w6/host`, `.github`, `src`, `ledger`. Custody judged CLEAN by the reviewer.

## H3 - the residual that matters. REQUESTS line for the PM, verbatim

> `C -> PM/B · RULING NEEDED (register item H3, engine tier, beside H1 and H2): rebuild/m4/workout/athlete-state.cjs createCleanInitState writes 22 members and neither `blackout` nor `model`, so the accepted engine THROWS on a clean-init athlete at rebuild/engine/energy.cjs:370 (observedTDEE, s.blackout.until) and then, once blackout is present, again at rebuild/engine/energy.cjs:84 (bfEst, s.model.anchorISO); the reviewer executed both and nowModel paints only when BOTH members are added, so `blackout: {}` is NOT a fix (daysUntil(undefined) throws at rebuild/engine/dates.cjs:8) and guarding energy.cjs:370 alone only moves the throw (sleep.cjs:358/:1913, writers.cjs:427/:917/:1694 are equally unguarded, while today.cjs:228/:282/:409 are guarded). MINIMAL FIX SHAPE: createCleanInitState gains `blackout: { until: <a past ISO date> }` and `model` with the members bfEst reads, both written by the constructor and closed by closed() - an m4/workout change, FULL GATE, in an engine package (the m4/workout package, not A4 and not any screens-tier lane). Until it closes, Dad's first run records his week and Today stands on the synthetic fixture; A4 carries S19 PARTIAL and a screen sentence saying so.`

## Residuals, carried on A4's ledger line

1. **CI**: `test/setup.test.mjs` and `setup-check.mjs` are not in `rebuild.yml`'s enumerated today step; A4 cannot add it (`:112`, `:117 (4)`) - it rides the B-NTC seal, and lane B is asked to enumerate it beside `checkin.test.mjs`.
2. **H3** (above), engine tier, full gate, beside H1/H2. S19 is PARTIAL for it.
3. **`e.setup` / H2** shipped without, per `:117 (2)` option (ii). **S22 hand test (C6)** still owed. **`run-current-head.cjs --all` NOT RUN**: it needs a retained R1 repository path this worktree has not got; the W6 suite it wraps ran directly, 552/552.
4. **74 U+2013/U+2014 in the built page**, including the `<title>`: **zero are A4's**, it is P1's item, and the PM should tell the owner before the look.
5. **P1 has not merged (C4)**: `:117 (1)`'s P1-first sequence is REVERSED at this head; A4 rebases onto P1 when it lands and keeps P1's mechanisms in the two shared files.
6. **The `basisState` key is `today`-only** plus an enrolled clause; the brief's `hosts AND today` is one line in `gym-check.mjs` away, outside A4's licence.
7. **The landing screen is Today, not screen 1**; closing it properly IS H3. **H6**: lane B's B-NTC edits `today-bindings.mjs` too, so whichever merges second rebases.
8. **`VIEW_SOURCES` in `test/design.test.cjs`** does not name the two setup view files; `assertSetupBinding` binds them itself. **The `19` w7-preview child** retires inside B-NTC; 19 is reported because it had not merged.

## Re-pin onto 8396415 (P1 + P2 merged)

CONFLICTS, both in files A4 edits: `today-app.cjs` (P1's `plainOrDrop(recoveryState(), ...)` vs A4's `setupTile(map)` on adjacent lines) and `today-entry.mjs` (P1's `plain-copy.cjs` import and its two `plainOrDrop` status writes vs A4's setup imports and `setup` in the boot return). Both resolved KEEPING P1 and adding A4 beside it; nothing of P1's was reverted.
DROPPED IN FAVOUR OF P1: A4's own narrower dash refusal in `design.cjs` (three source-level loops and the `DASHES` constant). P1's `plain-copy.cjs` guard covers A4's screens by name, verified rather than assumed: an em dash put back in one first-run sentence makes the BUILD exit 1 with `AI_DASH_IN_BUILD: ... a string literal of rebuild/m3/w7-preview/today/setup-model.mjs`. `assertSetupBinding` keeps only its presence check. ADDED: A4's view now renders through P1's boundary like every other view (`setup-app.mjs` takes `plainOrDrop`; every `textContent` write routed; the C1 note on Today routed), asserted by a new subtest.
FOUND, PRE-EXISTING ON THE TIP, CLOSED HERE: `local-today-journey.test.mjs` was ALREADY RED at 8396415 (P1 changed `today-entry.mjs` without re-pinning `PAGE_PINS`: pinned `5fc40e1e...`, on disk `b54d9701...`; and the boot status assertion compared the frozen client's em-dashed copy against the swept DOM). Re-pinned to `b50b9231...` with the reason, and the assertion now compares against `plainCopy(...)` so it still proves the page says the CLIENT'S sentence.
COUNTS at this head: today 64 + copy 36 = **192** (the seven P1 files) / gym 64 / checkin 28 / setup **104** (103 + one: the S23 "check refuses" subtest was re-aimed at P1's mechanism and split in two) / all eight today files 296 / W6 552 / journey 51 / host 31 (17 + 5 + 9) / w7-preview 19 / `--ci` PASS with `rebuild/m4/spec` clean before and after / build PASS (99 pinned inputs). Four browser checks on msedge PASS with verified real kills. Mutants RE-RUN because two licensed files changed materially: **20/20 killed**, restores byte-identical.
SERVED, rebuilt and restarted on this head: `http://127.0.0.1:4178/?screen=setup`, server pid 40648; the whole first run driven through it in msedge prints `SERVED-PAGE C1 CONFIRMED`.
CI run ids: to be filled by the integrator from the run on this branch head. Origin moved again mid-push to **61d1f16** (DECISIONS lines 125-126, docs-only, 3 files): rebased onto it, today 192 / setup 104 / journey 51 re-run green. **DECISIONS:125** is the owner's round-2 ruling on these screens and it says A4 "merges first, unchanged": days-only on screen 2 with Earned proposing the kind, a starter exercise list and a starter week on screen 3 are a follow-on **A4b** brief for lane C, and the full-body session kind is **engine item F1** for lane B. None of it is in this branch, by the ruling's own terms.
