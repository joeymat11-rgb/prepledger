# COACH WAVE ONE, IN TEXT (BUILDER REPORT)

Lane C, branch `rebuild/lane-c-c6`. **BASE DISCLOSED: `origin/rebuild/lane-c-a4b` @ `8e558ce`**, continuing
on C6A's head, with the wave-one brief cherry-picked on top. The brief names
`origin/rebuild/t2-client-core` @ `7f35e90` and says nothing here depends on A4b, which is true: wave one
reads `today_plan`, `gym-model.mjs` and its own fact class, none of which A4b changed. Building on A4b keeps
one branch for lane C's coach work and rebases at A4b's merge. Annex: `WAVE1-TEXT-ANNEX.md`.

**Custody held.** Every changed file is under `rebuild/coach/**` plus the reports under `rebuild/lanes/c/`.
`rebuild/m3`, `rebuild/engine`, `rebuild/client`, `rebuild/m4`, `rebuild/conform` and `.github` are
byte-untouched. **The producer seam held, and no STOP was needed.** `earned/machine-settings/v1` is written through the
client's own producer mechanism from a module under `rebuild/coach/`: `client.hostBindings({ workoutCommands })`
is where a lane hands its producer in (`local-client.mjs:395`), which is exactly how `today-bindings.mjs`
injects the check-in's. So `local-world.mjs` opens the lane with `machine-settings-commands.cjs` and nothing
under `rebuild/m3/w7-preview/today/**` or `rebuild/client` was edited to make it work. The fact rides THIS
installation's one generation, beside the weigh-in and the workout: asserted, not claimed.

## The five steps, each with its executed evidence

| step | the ask | executed evidence |
|---|---|---|
| 1 | Open the app | `today_plan` over the real local-era world; the answer names the session and the status word, 0 untraceable (W1) |
| 2 | What am I hitting today? | day read back from `today_plan` only; the WHY SLOT is asserted structurally (`whySlot === true`, a tagged value with a source), and with nothing on disk it reads exactly `not recorded` (W2, W3, W4) |
| 3 | What's my seat on the chest press? | first ask: the brief's own miss, nothing written. Capture `[{seat, four}, {pin, three}]` as ONE op. Second ask: the pairs back in order, each tagged with `machine-settings.op <id>` (W5, W6) |
| 4 | One-ten for eight | logged through `gym-model.logSet`; the stored operation is **byte-identical** to logging the same set through the gym card directly; refuses `GYM_SESSION_ABSENT` with no active set and `CONFIRMATION_REQUIRED` without the yes, and the confirm names 110 and 8 (W7, W8) |
| 5 | Why is today lighter? | the same slot alone; `not recorded` today, the engine's words verbatim with a planted reason, and the sentence carries **zero** numeric tokens so it cannot have been built from the plan (W4) |

## Counts

| suite | base `8e558ce` | now |
|---|---|---|
| coach `rebuild/coach/test/*.test.cjs` | 64 | **198**, 0 fail |
| `wave1-demo.test.cjs` / `machine-settings.test.cjs` | - | **26 / 23** (floors 26 / 22) |
| setup 150 · catalogue 43 · gym 64 · checkin 28 · copy 36 · view 23 · adapter 20 · design 11 · package 10 | same | **unmoved**, 0 fail |
| w6 552 | 552 | **552**, 0 fail |
| `build.mjs` · `native-carriers-package.cjs --ci` | PASS · PASS | **PASS · PASS** |
| mutants D1 to D12 | - | **12 / 12 KILLED**, all three modules restored byte-identical |

The C5 and C6A suites are unmoved in substance: the only edits to them are the C6A review conditions
(the `prepare` spy, all six durable fixtures, one combined stringify) and `no-dashes` extended to the three
new modules. C6A's own figures are refreshed in `C6A-REPORT.md`.

## Residuals

1. **The why is a STUB, and the slot says so.** P6 reason-on-disk has not landed, so today the slot reads
   `not recorded` for every athlete. W4's second half plants a reason fixture to prove the other branch; when
   P6 lands the fixture stops being needed and nothing else changes.
2. **The gym-card display of settings and cues is NOT in this build.** It is a `today/**` change behind A4b
   under one-Today-build-at-a-time, with its own bar in the brief's section 5.
3. **`earned/machine-settings/v1` is a DISCLOSURE, not a permission ask** (`DECISIONS:135 (1)`): the profile
   name, the twelve-setting cap, the forty-character cap and the member names are INVENTED and declared in
   the producer's own header; the two-key payload, `schemaVersion: 2`, `TEXT_MAX` 400, the
   at-least-one-answer rule and the mechanism are `checkin-commands.cjs`. Object and it is one file.
4. **The literal `not recorded`** is athlete-facing copy the brief chose and open question 2 puts to the PM.
   It is dash-free either way.
5. **CI residual, carried from the brief.** The coach suites are not in `rebuild.yml`'s enumerated steps
   (`DECISIONS:117 (4)` routes that step to the B-NTC re-seal), so "CI green both OS" is unmet for the coach
   suites; the lane runs them locally at the exact head sha.
6. **No model, no voice, no network, no key, no cap on any account.** Asserted by source scan over all three
   new modules (W17), and no new path reaches `startLiveSession` (W12).
