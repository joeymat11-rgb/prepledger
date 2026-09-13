# TEST HYGIENE (food / copy / build / plain-copy) - INDEPENDENT REVIEW, ROUND 1
Independent (author != reviewer), effort HIGH, told to disagree; every claim re-executed. Candidate `rebuild/lane-c-food` @ **c528369**, base **bcdea5d**, note `FOOD-TEST-POST-H3.md`. Taken by the Claude reviewer under `:159` (D2 on N2). Worktree clean at start and end.

## FINAL VERDICT ACCEPT at c528369
One NON-BLOCKING condition. Custody is exactly the five declared files; `today-bindings.mjs`, `local-today-journey.test.mjs`, `today-entry.mjs`, `gym-host.mjs`, `reading-host.mjs`, `checkin-host.mjs` are **byte-identical to the base** by sha256; nothing under `w6`, `m4`, `engine`, `client`, `conform` or `.github`.

- **C1 NON-BLOCKING - pin the probe's SURFACE, not just its answer.** Replacing `engine.proteinTarget(clean)` with `createTodayModel(...).read()` - the surface the two cells themselves assert - **SURVIVES** (food 56/56 on the tip), because on this tree both throw. That is precisely the trap the module's own comment names ("a detector that is also the assertion proves nothing"), and nothing stops a later edit walking into it; it would only show up on a tree where the two surfaces disagree. Red-first: a source-level pin in the same style this repo already uses for PAGE_PINS and the design harvest - assert the probe's own text still reads `engine.proteinTarget(clean)`. RED under the substitution, green as shipped.

## (1) Engine-version-aware cells, on BOTH trees
The probe is a neighbouring surface, not the asserted one, and **the invariant is genuinely unbranched**: `for (const row of rows) assert.doesNotMatch(row.textContent, /\d/)` runs over every macro row before any `if`, so "no digit for an athlete who declared no bodyweight" is asserted identically on both engines; the branches then assert only what each engine owes (pre-H3: zero rows plus the reason; H3: four rows, every one "Not prescribed"). D2.1 is the same shape around "his own record is never hidden and never altered", and its `writeDaily` call is deliberately left unbranched.
Reproduced by a **throwaway merge** of `origin/rebuild/lane-b-h3 @ e994c10` into the worktree (automatic merge, **zero conflicts**), then `git merge --abort`:
```
THE TIP           today dir 546/546 x3 | food 56/56 x3 | copy 36/36 | build PASS earned-47ddd94372f1, 110 inputs
TIP + H3          today dir 546/546 x3 | food 56/56 x3 | copy 36/36 | build PASS earned-1e4d3c938f09, 110 inputs
merge thrown away, HEAD back at c528369, worktree ''
```
H3 itself edits `today/test/setup.test.mjs` and the directory total is 546 on both trees.

## (2) The plant, and the worktree
The plant goes into a SIBLING `today-plant-<pid>` at the same depth, the COPY's own `build.mjs` is imported and run with pid-scoped `dist`/`scratch`, the assertions still name `AI_DASH_IN_BUILD`, and the cell additionally asserts the REAL tree still builds clean. Cleanup is in a `finally` with a pre-emptive `rmSync` before the copy, so a crash strands nothing and a stale copy is cleared next run. **No tracked byte is written**: `git status --short` was empty after every one of the fourteen runs above, on both trees.

## (3) Deriving OWNED / SOURCE_REL does NOT weaken P1's guard
```
OWNED (derived) = "rebuild/m3/w7-preview/today/"   === the constant it replaced: true  (and === the base's value)
SOURCE_REL      = "rebuild/m3/w7-preview/today"
the guard on the real bundle: 117 banners, 33 OWNED by the page, 0 offences, 904 frozen strings admitted
a copy at the WRONG depth  -> FAILS CLOSED: AI_DASH_GUARD_BLIND, it cannot pass on anything
a SIBLING at the same depth -> OWNED "rebuild/m3/w7-preview/today-probe-sibling/"; neither prefix matches the other's modules
```
`startsWith(OWNED)` can only ever mis-classify in the safe direction: a wrong-but-specific prefix attributes nothing, `owned` is 0 and the guard throws; a broader prefix would attribute MORE and refuse MORE. On the real tree the value is byte-identical, so the guard is the same guard.
**THE BUILD ID MOVED, correctly**: base **earned-aeca4c924f24** -> head **earned-47ddd94372f1**. `plain-copy.cjs` is a bundled input and its bytes changed, so the id that hashes the inventory must move; `build.mjs` is not bundled, so its edit alone would not have. Pinned inputs are **110** at base and at head, and every other figure on the build line is unchanged (3 assets, 13 engine, 12 client, 68 classes, 904 admitted, 1 normalised).

## (4) Counts, executed here
whole today directory in ONE invocation **546/546 x3** on both trees; food **56/56 x3**; copy **36/36**; the CI step list **+ food 220/220 x3**; build PASS. NOTE for the integrator: `node --test <directory>` (the bare path) fails on node 24.18 with `tests 1 / fail 1`; the one-invocation form that works here is the glob `today/test/*.test.mjs today/test/*.test.cjs`.

## Mutants: 3 killed / 1 survived
**M-a** the plant back in the worktree, reproduced rather than mutated (mutating `PLANT_DIR` to `SOURCE` would have `rmSync`'d the real directory): the contamination returns **deterministically here - 523/23 on all three runs, with `N1.15` and `N1.17` red every time**, which is stronger than the intermittent 2/1/2 the note reports; restored byte-identical. **M-b** the copy one level up so `OWNED` mis-derives: copy **34/2**, both P1 plant cells RED, because the guard goes blind instead of raising `AI_DASH_IN_BUILD`. **M-c** the probe forced TRUE on the pre-H3 tip: food **54/2**, `N1.11` and `D2.1` RED. **SURVIVED**: the probe replaced by the asserted surface - condition C1.

## Residuals
1. C1. 2. `food.test.mjs` and `copy.test.mjs` ride the un-enumerated today suites in CI until the next re-seal. 3. The H3 greenness proved here is a throwaway merge on this machine, not the merged tip; whoever merges H3 re-runs it. 4. The plant copy lives inside the repo tree while a run is in flight (untracked, pid-scoped, removed in `finally`), so a concurrent `git status` during a run will show it. OWNER LOOK: not required (no screen copy, layout or stored value changed).
