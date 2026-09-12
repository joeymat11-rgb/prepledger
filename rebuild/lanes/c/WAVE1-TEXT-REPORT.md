# COACH WAVE ONE, IN TEXT (BUILDER REPORT)

Lane C, branch `rebuild/lane-c-c6`. Annex: `WAVE1-TEXT-ANNEX.md`. Disclosed: `rebuild/lane-c-c6` is checked
out in another worktree, so this is built on `rebuild/lane-c-c6-build` and pushed to that ref.

**REBASE ONTO :149.** Built on `origin/rebuild/lane-c-a4b` @ `8e558ce`; A4b has since merged (ledger
`:149`), so the seven commits are replayed cleanly onto `origin/rebuild/t2-client-core` @ `964f183`, which
carries A4b and the B-NTC merge (`:144`). A4b merged in a different final form than it was built against -
tags handling moved off `today-bindings.mjs` into `today/setup-commands.mjs` (`envelopeOf`) and
`today/setup-host.mjs` - so the C6A parity was re-checked against the merged shapes and one real correction
came out of it; `C6A-REPORT.md` carries it. B-NTC pins `today-bindings.mjs` on disk and `rebuild/coach`
does not touch it: the gate is PASS, tree clean either side.

**Custody held.** The diff against the tip is `rebuild/coach/**` plus `rebuild/lanes/c/{C6A-*,WAVE1-*}` and
nothing else. **The producer seam held, and no STOP was needed:**
`client.hostBindings({ workoutCommands })` is where a lane hands its producer in (`local-client.mjs:395`),
exactly as `today-bindings.mjs` injects the check-in's, so `local-world.mjs` opens the lane with
`machine-settings-commands.cjs` and nothing under `today/**` or `rebuild/client` was edited.

## The five steps, each with its executed evidence

| step | the ask | executed evidence |
|---|---|---|
| 1 | Open the app | `today_plan` over the real local-era world; the answer names the session and the status word, 0 untraceable (W1) |
| 2 | What am I hitting today? | day read back from `today_plan` only; the WHY SLOT is asserted structurally (`whySlot === true`, a tagged value with a source), and with nothing on disk it reads exactly `not recorded` (W2, W3, W4) |
| 3 | What's my seat on the chest press? | first ask: the brief's own miss, nothing written. Capture `[{seat, four}, {pin, three}]` as ONE op. Second ask: the pairs back in order, each tagged with `machine-settings.op <id>` (W5, W6) |
| 4 | One-ten for eight | logged through `gym-model.logSet`; the stored operation is **byte-identical** to logging the same set through the gym card directly; refuses `GYM_SESSION_ABSENT` with no active set and `CONFIRMATION_REQUIRED` without the yes, and the confirm names 110 and 8 (W7, W8) |
| 5 | Why is today lighter? | the same slot alone; `not recorded` today, the engine's words verbatim with a planted reason, and the sentence carries **zero** numeric tokens so it cannot have been built from the plan (W4) |

## Counts

| suite | base | now |
|---|---|---|
| coach `rebuild/coach/test/*.test.cjs` | 65 | **201**, 0 fail |
| `wave1-demo.test.cjs` / `machine-settings.test.cjs` | - | **28 / 23** (floors 26 / 22) |
| setup 157 · catalogue 43 · gym 64 · checkin 28 · copy 36 · view 23 · adapter 20 · design 11 · package 10 | same | **unmoved**, 0 fail |
| B-NTC gate, alone, clean tree | PASS | **PASS** |
| `build.mjs` · `native-carriers-package.cjs --ci` | PASS · PASS | **PASS · PASS** |
| mutants D1 to D12 | - | **12 / 12 KILLED**, all three modules restored byte-identical |

The base coach figure is **65**, not the 64 this report first printed (C3); 201 is 198 plus the three tests
the conditions added, and `wave1-demo` is 28, no longer on its floor (C4). **C1 applied:** `TIERS`
advertised nineteen names while `dispatch` served four, so the C5 fifteen came back
`WAVE1_TOOL_NOT_IN_LIST` through `dispatch` yet worked through `openTurn().call`. `dispatch` now serves all
nineteen at their own tiers, `tools()` answers with that one list, and two tests enumerate BOTH lists.

## Residuals

1. **The why is a STUB, and the slot says so.** P6 has not landed, so the slot reads `not recorded` for
   every athlete; W4's second half plants a fixture to prove the other branch.
2. **The gym-card display of settings and cues is NOT in this build** - a `today/**` change under
   one-Today-build-at-a-time, with its own bar in the brief's section 5.
3. **`earned/machine-settings/v1` is a DISCLOSURE, not a permission ask** (`DECISIONS:135 (1)`): the profile
   name, the two caps and the member names are INVENTED and declared in the producer's own header.
   Everything else is `checkin-commands.cjs`. Object and it is one file.
4. **The literal `not recorded`** is athlete-facing copy the brief chose and open question 2 puts to the PM.
5. **CI RUNS these suites; the brief's CI residual is withdrawn.** The B-NTC merge carried
   `DECISIONS:117 (4)`'s glob step into `rebuild.yml`, so all 201 run on both runners.
6. **No model, no voice, no network, no key, no cap on any account** - source scan over all three new
   modules (W17), and no new path reaches `startLiveSession` (W12).
