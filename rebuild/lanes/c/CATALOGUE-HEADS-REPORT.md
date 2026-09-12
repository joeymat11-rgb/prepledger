# CATALOGUE HEADS - REPORT

Branch `rebuild/lane-c-heads`, base `origin/rebuild/t2-client-core` @ `2b73a6a`, brief `CATALOGUE-HEADS-BRIEF.md` (DECISIONS:154 (8)).

## WHAT MOVED

Four shared secondary credits gained the region they pay, which is the whole edit. `FRONT` -> `{mg:'delts', head:'delts_front', lend:0.5}` (12 entries); a new `REAR` -> face_pull; a new `SIDE_H` -> upright_row, and `DELT_H` is now unused and **deleted**; a new `ERECTOR = {mg:'back', head:'lower_back', lend:0.5}` -> romanian_deadlift and deadlift. **Sixteen credits resolved, five deliberately left** (rear_delt_fly, rear_delt_machine, cable_rear_delt_fly, farmers_carry, ab_wheel: each straddles two regions, so naming one would be a guess; they stay `qualified:false` under DECISIONS:155 (3)).

**No lend value moved**, proved rather than promised: the multiset of `(mg, lend)` across the catalogue is pinned to the base's - 94 credits, `delts:0.5` 13, `back:0.5` 2, `delts:0.25` 1, `back:0.25` 5 - plus a sha256 of that list. **Nothing else moved either**: a sha256 of every entry's id, name, aliases, group, mg, primary head and kinds is pinned at the base and still matches, and the entry count is still 83. Every head added is a `constants.cjs:333` MG_LABEL key or a `DECISIONS:127 (2)` region label, **re-derived from those files at test time**, and is marked INVENTED-and-declared where it is written.

## THE TWO LINES OUTSIDE THE DISPATCH'S CUSTODY LIST, AND WHY

The dispatch named `exercise-catalogue.mjs` + its test only. Two one-line ripples were unavoidable, because a credit is no longer always two members and two places copied it as though it were:

1. **`starter-week.mjs:145`** copied each credit as `{mg, lend}`, and `setup.test.mjs` S32 already required the proposed tags to **equal the catalogue entry's credits**. Narrowing would have dropped the head the catalogue had just resolved and turned that existing cell RED (measured: setup 156/1).
2. **`rebuild/coach/test/onboarding-tools.test.cjs:138`** compared the landed row against the same narrowing, in a cell named *"lands the catalogue's own row"*. This one was caught by **CI, on both runners** (the C5 step at `256aba1`), not locally: the coach suite is not in the count list the dispatch named.

Both are now `({ ...s })`. Neither weakens an assertion - each makes it say what its own title already claimed. No engine, client, m4, w6, conform or `.github` byte is touched, and no coach PRODUCTION file is touched.

## H7: HOW FAR THE HEAD ACTUALLY TRAVELS - NOT ALL THE WAY, AND EXECUTED

The brief's H7 wants the produced op's tags to carry the secondary head. **They do not yet, and this build cannot make them**: two of the three steps are outside custody and outside this edit. `setup-model.mjs document()` maps every credit to `{mg, lend}`, and `setup-commands.mjs tagsOf` refuses a secondary with any third key (`Object.keys(s).length !== 2` -> `SETUP_INPUT_INVALID`, executed). Rather than claim a reach the edit does not have, two cells DRIVE the real path and record the boundary: the head does reach the setup model's own exercise row through `addFromCatalogue`, and `prepare` still refuses it one step later. Both are written to fail the moment that boundary moves. **The widening is two lines** and it is a lane-lead call, not mine: admit an optional `head` in `tagsOf`'s per-credit check and carry it in the returned credit, and stop narrowing in `document()`. The payload stays three members either way.

## COUNTS (Windows, on this head)

catalogue **55** (43 + **12** new cells, >= 12 asked) / setup **157 unmoved** / today step **164** / copy **36** / gym **64** / check-in **28** / W6 **552** / **coach 201** (added to the list after CI found it), all 0 fail.

    B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict
    A1 TODAY BUILD PASS: 3 assets; 104 pinned inputs; build earned-d5ae08063300;
    approved design pinned; 68 bound classes; no em/en dash in any text the athlete can see

RED first, recorded before the catalogue edit: **55 tests, 50 pass, 5 fail** - H3 (both cells), H6 (the constants), H6 (the INVENTED marking) and H7 (the head reaching the row). The other seven cells are invariants that must hold on BOTH sides of the edit (a legal head set, a head agreeing with its mg, no lend moved, the skeleton unchanged, the coarse credit's five uses, the boundary at `prepare`); they are green before and after by design, and saying so is more honest than contriving a red for them.

**Six mutants R1 to R6 executed and killed**, restored 55/55: R1 `delts_lateral` (H1, H2, H3) · R2 a chest secondary with a head (H1, H2, H3) · R3 resolving `BACK_H` to traps (H3, H4, H6) · R4 moving `FRONT`'s lend (H5, H6) · R5 dropping the head from machine_fly (H3 x2) · R6 a primary head contradicting `REGION_MG` (H2, H6).

## PREFLIGHT, NAMED, AND WHAT IS OWED

`git status --porcelain` + `git diff --stat 2b73a6a..HEAD` (5 files, diff inside custody bar the two disclosed lines); the eight `node --test` count commands above - the coach one **added after CI caught what the dispatch's list did not cover**, which is the honest lesson of this build; `node rebuild/m3/w7-preview/today/build.mjs`; `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` run ALONE with `git status --porcelain` byte-identical before and after; `node -e` for this report's length; `node ..\tools\ci-status.js rebuild/lane-c-heads <sha>` from `work/lane-c/main`.

**CI residual**: `test/catalogue.test.mjs` is not in `rebuild.yml`'s enumerated today step and `.github` is editable only inside a re-pinning engine package (DECISIONS:112); it rides the next re-seal. **Owed**: H7's two-line widening, above. **Note**: a catalogue correction changes future snapshots only (DECISIONS:155 (2)); no athlete already set up gains a region from this.
