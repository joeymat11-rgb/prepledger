# C6 PART A - VOICE ONBOARDING, TEXT REHEARSAL (BUILDER REPORT)

Lane C, branch `rebuild/lane-c-c6`. **BASE DISCLOSED: `origin/rebuild/lane-c-a4b` @ `8e558ce`, NOT the
tip**, with `736a4fa` (the brief) cherry-picked on top. Part A's parity needs A4b's catalogue, its
`{profile, setup, tags}` payload and `createSetupHost`, none of which is on `origin/rebuild/t2-client-core`
yet: this is the brief's own open question 7.2, answered by building on A4b and rebasing at A4b's merge.
Annex, with the file table and the executed commands: `C6A-ANNEX.md`.

**Custody held.** Every changed file is under `rebuild/coach/**` plus this report. `rebuild/m3`,
`rebuild/engine`, `rebuild/client`, `rebuild/m4`, `rebuild/conform` and `.github` are byte-untouched, and
no parity hook was needed that the screens do not already expose.

## Counts (A14)

| suite | base `8e558ce` | now |
|---|---|---|
| coach `rebuild/coach/test/*.test.cjs` | 64 | **149**, 0 fail. At review it was **145 = 65 + 80**: the existing files run 65 (A10 took `no-dashes` from 6 to 7) and the three new files contribute 80. C2 then added four durable fixtures, so the split is now **65 + 84** |
| the three new files: tools / parity / closed-list | - | **41 / 30 / 13** (floors 30 / 18 / 10) |
| setup 150 · catalogue 43 · gym 64 · checkin 28 · copy 36 · view 23 · adapter 20 · design 11 · package 10 | same | **unmoved**, 0 fail |
| w6 552 | 552 | **552**, 0 fail |
| `native-carriers-package.cjs --ci` · `build.mjs` | PASS · PASS | **PASS · PASS** |

Part A only ADDS. `setup.test.mjs` needs `build.mjs` run first (S17 reads the built `index.html`); that
ordering is the base's, not this branch's.

## The parity evidence, as counts

| claim | measured |
|---|---|
| A1 op bytes equal, `JSON.stringify(opVoice.payload) === JSON.stringify(opTap.payload)` | **6 / 6** |
| A1 whole envelope equal, so a reordered `effective` is caught too | **6 / 6** |
| A1 the coach's read-back document equal, key order included | **6 / 6** |
| A1 `validate()` true for both envelopes | **6 / 6** |
| A7 blocked fixtures: both paths refuse and name the SAME gaps | **2 / 2** |
| A2 durable: two installations through `createSetupHost`, stored bytes equal | **2 / 2** |
| A12 one op per complete transcript, zero per blocked or abandoned one | **8 / 8** |
| A1 producer identity: `prepare` called exactly once per submit, and the envelope it returned is the one the coach passed on | **6 / 6** |
| mutants C1 to C10 | **12 / 13 with the faithful C1 killed after the fix** (see below), both files restored byte-identical |

### Review round 1 conditions, applied

The independent review (`C6A-REVIEW.md`, `C6A-REVIEW-ANNEX.md`, both copied in)
returned ACCEPT WITH CONDITIONS, nothing blocking. All four are applied.

- **C1** the reviewer's faithful mutant C1 (a hand-built payload with the same key
  order) SURVIVED: byte equality proved the bytes, not the producer. A **counting
  spy** on `commands.prepare` now makes producer identity observable, and A1
  asserts it was called exactly once per submit and that the envelope `submit`
  passed on is the one `prepare` returned. Re-run with the faithful mutant in
  place: **fail 6**, `submit did not call prepare exactly once`. Killed.
- **C2** A2 durable ran `COMPLETE.slice(0, 2)`; brief 2.3 step 4 says "each of at
  least six". The slice is dropped and **all six** completing fixtures now write
  through two `createSetupHost` installations each.
- **C3** A2 equality was two stringifies (`setup`, then `tags`), the shape the
  reviewer's own C2 finding removed from A1. It is now ONE combined
  `storedPayload` stringify over the whole payload.
- **C4** two report figures corrected: the mutant line reads
  **12 / 13 with the faithful C1 killed after the fix** rather than 10 / 10, and
  the coach count is **65 + 80**, not 64 + 81 (A10 took `no-dashes` from 6 to 7).

The mutant tally after the fix: C1 faithful (fail 6), C1 crude, C2, C3, C4, C5,
C6, C7, C8, C9, C10, plus the two guard mutants the round-1 table already
carried. The one that survived round 1 is the one the spy now kills.

Fixtures (8, floor 6): `two_day`, `four_day`, `free_text_muscle`, `uneven_rungs`, `skipped_priority`,
`inc_override` complete; `unnamed_exercise` and `unknown_first` are blocked by design and prove A7.

## Residuals

1. **The branch name.** `rebuild/lane-c-c6` is checked out in `work/lane-c/dad`, so this worktree built on
   `rebuild/lane-c-c6-build` and pushed that to `refs/heads/rebuild/lane-c-c6`. Nothing of yours was
   overwritten: origin had no such ref. The local branch in that other worktree is now behind.
2. **"An override" read as the STANDARD STEP, not a day kind.** The brief forbids any tool that sets a day
   kind (2.1, A4) while the fixture list asked for an override. `inc_override` overrides Earned's standard
   5 lb step, which a tool can do; a spoken request to change a day kind is refused by
   `cannot_set_via_coach`, and that is tested. A voice day-kind override would be a brief amendment.
3. **`setupOnLocalEra: false`.** `setup-host.mjs` opens its own installation through `openTodayHosts`,
   exactly as `checkin-host.mjs` does. Disclosed, not hidden; the same lane-c-today merge away.
4. **CI residual, carried from the brief.** The coach suites are not in `rebuild.yml`'s enumerated steps
   (`DECISIONS:117 (4)` routes that step to the B-NTC re-seal), so "CI green both OS" is unmet for the
   coach suites and the lane ran them locally at the exact head sha.
5. **No model, no network, no key, no audio**, asserted by source scan over both new modules (A11). Part C
   and the relay are untouched.
