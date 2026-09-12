# CATALOGUE HEADS - INDEPENDENT REVIEW, ROUND 1
Independent (author != reviewer), effort HIGH, told to disagree; every claim re-executed, not read. Candidate `rebuild/lane-c-heads` @ **5fced00**, base **2b73a6a**. Bar: `CATALOGUE-HEADS-BRIEF.md` H1-H7 + mutants R1-R6, under `DECISIONS:154 (8)` and the lane ruling that closed H7. Worktree clean at start and end.

## FINAL VERDICT ACCEPT at 5fced00
One NON-BLOCKING condition; nothing I executed found a moved lend, an illegal head, a changed document or a lost credit.

- **C1 NON-BLOCKING - pin `tagsOf`'s mg/head AGREEMENT refusal.** My mutant **Z1** deletes `if (REGION_MG[s.head] !== s.mg) bad();` from `setup-commands.mjs` and the suites stay **GREEN (213/0)**. The shipped code is right - my probe shows `{mg:'delts', lend:0.5, head:'lats'}` refused with `SETUP_INPUT_INVALID` - but nothing pins it: `H7` covers only a head that is not a `REGION_MG` key (my **Z2** proves that half bites), and `H2` covers only the catalogue's own data. Red-first test: assert `tagsOf` refuses a credit whose head is a legal region of ANOTHER muscle. RED under Z1 today.

## The entry list, re-derived (not read off the report)
Loading the base catalogue from `git show 2b73a6a:` beside the head's: size **83 -> 83**, ids identical, and everything except secondary heads is sha-identical (`874fe0257f9b1950` both sides) - so ids, names, aliases, group, primary mg/head and kinds are unchanged, and so is every secondary's `mg` and `lend`.
Credits **94 -> 94**; the sum of every lend **42.75 -> 42.75**: **no lend moved.** Exactly **16** credits gained a head and **78** did not:
- **12 -> `delts_front`** (`chest_press_machine`, `incline_chest_press_machine`, `barbell_bench_press`, `incline_barbell_bench_press`, `dumbbell_bench_press`, `incline_dumbbell_press`, `machine_fly`, `cable_fly`, `dumbbell_fly`, `push_up`, `dip_chest`, `close_grip_bench_press`)
- **1 -> `delts_rear`** (`face_pull`), **1 -> `delts_side`** (`upright_row`, lend 0.25, `DELT_H` deleted in favour of `SIDE_H`), **2 -> `lower_back`** (`romanian_deadlift`, `deadlift`).
The five still-headless "ambiguous" credits are `rear_delt_fly`, `rear_delt_machine`, `cable_rear_delt_fly`, `farmers_carry`, `ab_wheel` - and their `mg` is **back**, not delts (zero delts credits remain headless). The dispatch's shorthand is loose; the count of five is right and the choice is defensible: each straddles two regions.
**Every head is legal, re-derived from the engine**: the three `constants.cjs:333` `MG_LABEL` delt keys plus the `DECISIONS:127 (2)` region labels; `REGION_MG`'s key set equals that set exactly, every head agrees with its own `mg` through it, and the distinct heads used are `delts_front, delts_side, delts_rear, lower_back`.

## The reach, through the real path
`document()` keeps the head -> `prepare` builds `{profile, setup, tags}` -> `save` -> **read back out of the real encrypted store with the head intact** (`{"mg":"delts","lend":0.5,"head":"delts_front"}`, 4 headed credits in a two-day starter week). An athlete whose credits carry no head gets credits that are exactly `{mg, lend}`, and **the clean-init document is byte-identical either way** - the A4b document is untouched, which is the ruling's load-bearing clause.
Refusals, each `SETUP_INPUT_INVALID`: `delts_lateral`, `shoulders`, `''`, `null`, `7`, a **fourth key**, and a head belonging to another `mg`; a legal head on a matching `mg` is accepted.

## The four `({...s})` ripples - all honest, and one is STRONGER
`starter-week.mjs:145` and `setup-model.mjs` `document()` MUST spread: narrowing would silently drop the region the catalogue had just resolved, on the "Build my week for me" door and the by-hand door respectively - my mutant **Z3** re-narrows the starter week and is killed by `S32`. `setup-commands.mjs` widens the credit to `{mg, lend, head?}` with the fourth key still refused. `rebuild/coach/test/onboarding-tools.test.cjs:138` is a TEST, so I checked it does not weaken: before, it compared the row against a NARROWED copy of the entry (which would have FAILED had a head appeared); after, it compares against the entry's credits WHOLE, so it now requires the head to be present and equal. The two sides are distinct objects (`addFromCatalogue` deep-clones), so it is not tautological. Strictly stronger, and it matches the cell's own title.

## Counts, executed by this reviewer
catalogue **56** / setup **157** / coach **201** (onboarding parity green both paths) / problem **25** / `rebuild.yml`'s today step **164** / `b-package.cjs --ci --package B-NTC` run **ALONE: PASS**, worktree clean before AND after / `build.mjs` **PASS, 104 pinned inputs, build earned-7adfc84c0280** (the build id moved with the catalogue, which is the id doing its job).

## Mutants: 8 killed / 1 survived
**R1** head `delts_lateral` 208/5 by `H1`,`H2`; **R2** a chest secondary gains a head 211/2 by `H2`,`H3`; **R3** `BACK_H` resolved to `traps` 210/3 by `H3`,`H4`; **R4** `FRONT`'s lend moves with the head 210/3 by `H5`,`H6`; **R5** an entry id changed 210/3 by `H3`; **R6** a primary head contradicting `REGION_MG` 212/1 by `H6`. Mine: **Z2** (`REGION_MG` gains a non-region label) 212/1 by `H7`; **Z3** (the starter week re-narrows) 212/1 by `S32`; **Z1 SURVIVED** - condition C1. Every file restored byte-identical; the only untracked residue was a `test-support/` directory the coach suite materialises, which I removed.

## Residuals
1. C1 above. 2. Nothing READS a secondary head yet: that is engine item F2 (`:127 (6)`), and this build only stores what F2 will read. 3. The five ambiguous back credits stay `qualified:false` under `:155 (3)` until something can name their region without guessing. 4. `catalogue.test.mjs` rides the un-enumerated today suites in CI until the next re-seal.

OWNER LOOK: not required (no screen copy or layout changed).
