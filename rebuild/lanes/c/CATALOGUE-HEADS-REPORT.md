# CATALOGUE HEADS - REPORT

Branch `rebuild/lane-c-heads`, base `origin/rebuild/t2-client-core` @ `2b73a6a`, brief `CATALOGUE-HEADS-BRIEF.md` (DECISIONS:154 (8)). Review round 1 **ACCEPT** at `5fced00`, reviewer `df99cc3` (`CATALOGUE-HEADS-REVIEW.md`); its one non-blocking condition is applied below.

## WHAT MOVED

Four shared secondary credits gained the region they pay, which is the whole edit. `FRONT` -> `{mg:'delts', head:'delts_front', lend:0.5}` (12 entries); a new `REAR` -> face_pull; a new `SIDE_H` -> upright_row, and `DELT_H` is now unused and **deleted**; a new `ERECTOR = {mg:'back', head:'lower_back', lend:0.5}` -> romanian_deadlift and deadlift. **Sixteen credits resolved, five deliberately left** (rear_delt_fly, rear_delt_machine, cable_rear_delt_fly, farmers_carry, ab_wheel: each straddles two regions, so naming one would be a guess; they stay `qualified:false` under DECISIONS:155 (3)).

**No lend value moved**, proved rather than promised: the multiset of `(mg, lend)` across the catalogue is pinned to the base's - 94 credits, `delts:0.5` 13, `back:0.5` 2, `delts:0.25` 1, `back:0.25` 5 - plus a sha256 of that list. **Nothing else moved either**: a sha256 of every entry's id, name, aliases, group, mg, primary head and kinds is pinned at the base and still matches, and the entry count is still 83. Every head added is a `constants.cjs:333` MG_LABEL key or a `DECISIONS:127 (2)` region label, **re-derived from those files at test time**, and is marked INVENTED-and-declared where it is written.

## THE TWO LINES OUTSIDE THE DISPATCH'S CUSTODY LIST, AND WHY

The dispatch named `exercise-catalogue.mjs` + its test only. Two one-line ripples were unavoidable, because a credit is no longer always two members and two places copied it as though it were:

1. **`starter-week.mjs:145`** copied each credit as `{mg, lend}`, and `setup.test.mjs` S32 already required the proposed tags to **equal the catalogue entry's credits**. Narrowing would have dropped the head the catalogue had just resolved and turned that existing cell RED (measured: setup 156/1).
2. **`rebuild/coach/test/onboarding-tools.test.cjs:138`** compared the landed row against the same narrowing, in a cell named *"lands the catalogue's own row"*. This one was caught by **CI, on both runners** (the C5 step at `256aba1`), not locally: the coach suite is not in the count list the dispatch named.

Both are now `({ ...s })`. Neither weakens an assertion - each makes it say what its own title already claimed. No engine, client, m4, w6, conform or `.github` byte is touched, and no coach PRODUCTION file is touched.

## H7: CLOSED - THE HEAD REACHES THE STORED OP'S TAGS

Ruled on this branch (lane decision under DECISIONS:135 (1), disclosed to lane D/F2 as additive), and the two lines are widened. **`setup-commands.mjs tagsOf`** now takes a secondary of `{mg, lend, head?}`: a fourth key is still refused, an absent head still means exactly what it meant before, and a head that is not a key of `REGION_MG` - or that belongs to another engine label - is `SETUP_INPUT_INVALID`. The legal set is not restated there: it IMPORTS `REGION_MG`, whose keys are the three `constants.cjs:333` MG_LABEL keys and the `DECISIONS:127 (2)` region labels, and `catalogue.test.mjs` re-derives that from the engine files. **`setup-model.mjs document()`** keeps the head on the credit instead of narrowing it.

The two boundary cells flip to assert the reach, end to end through the real reducer and the real producer: `document()` emits `{mg:'delts', lend:0.5, head:'delts_front'}`, `prepare` carries it into the op, `validate` accepts that envelope, the unresolved triceps credit is still two members, and **the setup document itself is byte-identical** (tags ride beside it, never in it). A third cell refuses `delts_lateral`, `shoulders`, `''`, `null`, `7` and a fourth key, at `prepare` AND at `validate`. RED first: written for the reach against the un-widened code, **56 tests, 55 pass, 1 fail**.

**ROUND 1, C1 (non-blocking) - the agreement half of the rule was unheld.** The reviewer found that deleting `if (REGION_MG[s.head] !== s.mg) bad();` left every suite green: the cells above only ever tried heads that are not region labels at all, which the `Object.hasOwn` half already catches. A new cell uses the reviewer's own credit - `{mg:'delts', lend:0.5, head:'lats'}`, a REAL label belonging to `back` - and refuses it at `prepare` and at `validate`, then pins five more crossings in both directions (`delts`/`traps`, `back`/`delts_front`, `triceps`/`biceps`, `hams`/`quads`, `glutes`/`calves`). **RED under the deletion, executed: catalogue 57 tests, 56 pass, 1 fail; catalogue + setup 214, 213 pass, 1 fail - C1 the only cell that catches it, which is exactly the gap reported. GREEN restored: 57/57.**

## COUNTS (Windows, on this head)

catalogue **57** (43 + **14** new cells, >= 12 asked) / setup **157 unmoved** / today step **164** / copy **36** / gym **64** / check-in **28** / W6 **552** / **coach 201** (onboarding parity byte-equal on both paths), all 0 fail.

    B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict
    A1 TODAY BUILD PASS: 3 assets; 104 pinned inputs; build earned-1f8259b899c8;
    approved design pinned; 68 bound classes; no em/en dash in any text the athlete can see

RED first, three times and recorded each time: **before the catalogue edit, 55 tests, 50 pass, 5 fail** (H3 both cells, H6 the constants, H6 the INVENTED marking, H7 the head reaching the row); **before the H7 widening, 56, 55 pass, 1 fail** (the reach cell); **under C1's deletion, 57, 56 pass, 1 fail** (above). The remaining cells are invariants that must hold on BOTH sides (a legal head set, no lend moved, the skeleton unchanged, the coarse credit's five uses); they are green before and after by design, and saying so is more honest than contriving a red for them. **Six mutants R1 to R6 executed and killed**, restored 57/57: R1 `delts_lateral` (H1, H2, H3) · R2 a chest secondary with a head (H1, H2, H3) · R3 resolving `BACK_H` to traps (H3, H4, H6) · R4 moving `FRONT`'s lend (H5, H6) · R5 dropping the head from machine_fly (H3 x2) · R6 a primary head contradicting `REGION_MG` (H2, H6).

## PREFLIGHT, NAMED

`git status --porcelain` + `git diff --stat 2b73a6a..HEAD` (8 files with the reviewer's verdict, diff inside custody bar the two disclosed lines); the eight `node --test` count commands above - the coach one **added after CI caught what the dispatch's list did not cover**, which is the honest lesson of this build; `node rebuild/m3/w7-preview/today/build.mjs`; `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` run ALONE with `git status --porcelain` byte-identical before and after; `node -e` for this report's length; `node ..\tools\ci-status.js rebuild/lane-c-heads <sha>` from `work/lane-c/main`. **CI residual**: `test/catalogue.test.mjs` is not in `rebuild.yml`'s enumerated today step and `.github` is editable only inside a re-pinning engine package (DECISIONS:112); it rides the next re-seal. **Nothing is owed**: H7 is closed above. **Note for lane D/F2**: the widening is additive - a credit with no head is byte-identical to what A4b shipped, so an athlete set up before this reads exactly as before, and a catalogue correction changes future snapshots only (DECISIONS:155 (2)).
