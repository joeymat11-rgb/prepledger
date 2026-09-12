# GYM CARD: MACHINE SETTINGS ON THE ACTIVE SET - REPORT

Branch `rebuild/lane-c-settings`, base `origin/rebuild/t2-client-core` @ `8a42509`, brief `GYM-CARD-SETTINGS-DISPLAY-BRIEF.md` (DECISIONS:154 (2), :140 wave one). Evidence: `GYM-CARD-SETTINGS-REPORT-ANNEX.md`.

## WHAT IS ON THE SCREEN

Under the prescription and above the performed inputs, the active set now shows the settings this athlete stored for THIS exercise id, as `name value` pairs in the order he gave them, with his cue below them. A machine this device holds nothing for says **"No settings saved yet."** and shows no figure at all: never a zero, never a dash, never another lift's seat height. A small **"Machine settings"** control opens an inline editor of `name`/`value` rows plus one cue field; saving writes ONE op, cancelling writes nothing, and neither ever blocks or moves the set's single primary action.

**Nothing is interpreted.** "four" is stored and shown back as "four". No number is parsed out of a word, no unit is invented, no row is reordered and no name is normalised (mutant S-M8).

## ONE WRITE PATH, AND IT IS THE COACH'S

The op is `earned/machine-settings/v1` exactly as `rebuild/coach/machine-settings-commands.cjs` defines it, and the gym card **imports that producer** rather than re-declaring anything: the profile, the caps, the at-least-one-answer rule, the read-back filter (`machineSettingsIn`) and latest-wins (`latestFor`) are one definition. The page's own refusal is the producer's own gate, `machineOf`, CALLED - so the page refuses exactly what the producer refuses, decided once, before anything is written. `rebuild/coach/machine-settings-commands.cjs` is now a pinned input of this page's build.

Executed, not asserted: **S6a** compares the op the card writes with the op the coach's producer builds for the same answer, member for member; **S6c** drives the coach's own `wave1-tools.cjs machine_settings` tool over the lane the GYM CARD opened and captured into and reads the capture back; **S6d** writes through the coach's `machineOf` and reads it on the card. **S6b** proves no second profile string, validator or payload shape exists in the page at all.

`local-world.mjs`'s `createMachineSettingsHost` opens the identical lane, and the page cannot import it: that module also requires `rebuild/m4/workout/engine-runtime.cjs`, which `build.mjs` FORBIDS by name. `machine-settings-host.mjs` therefore duplicates the thirty lines that OPEN the lane and nothing else. Disclosed in the annex as residual 3.

## CUSTODY, READ OUT OF THE PIN LIST

`local-today-journey.test.mjs:614-619` PAGE_PINS names **exactly four** files - `today-entry.mjs`, `gym-host.mjs`, `reading-host.mjs`, `checkin-host.mjs` - and S10 re-reads that list at test time rather than trusting the brief. All four, and `today-bindings.mjs` against the B-NTC package's own hash, are **sha-identical**; `gym-model.mjs` needed no change and got none (its DTO already carried the lift's id). Because `today-entry.mjs` is pinned, `boot()` cannot gain a fifth lane: `gym-app.mjs` (driven, not pinned) opens it itself through `era.client.hostBindings({workoutCommands: createMachineSettingsCommands(), clock})`, lazily and FAILING CLOSED - so every jsdom mount in this repository is unchanged, because jsdom has no `indexedDB`.

## COUNTS (Windows, on this head)

`test/machine-settings-ui.test.mjs` **43 (new, >= 28 asked)** / today step **164** / setup **157** / catalogue **43** / problem **25** / copy **36** / coach **201** / W6 **552** / journey **51** (PAGE_PINS unmoved) / A0 host **32** / w7 **19**, all 0 fail.

    B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict
    A1 TODAY BUILD PASS: 3 assets; 107 pinned inputs (13 engine, 12 client); build
    earned-726607e1fe54; approved design pinned; 68 bound classes; no em/en dash in any
    text the athlete can see

RED first, executed: with the block never painted onto the active set, **43 tests, 16 pass, 27 fail**; restored 43/43. **Ten mutants S-M1 to S-M10 executed and killed**, restored 43/43 (table in the annex). Five msedge checks PASS, including the new `machine-settings-check.mjs` (3 real `taskkill /F /T`, each verified dead) and `gym-check.mjs`, extended so the capture rides the SAME kill the workout does.

## PREFLIGHT, NAMED (DECISIONS:155 (6), self-check)

1. `git status --porcelain` and `git diff --stat 8a42509..HEAD` - diff inside custody.
2. The eleven `node --test` count commands above, run from the worktree root (annex section 2 lists them verbatim).
3. `node rebuild/m3/w7-preview/today/build.mjs` - build PASS at the exact head.
4. `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` - the gate ALONE, `git status --porcelain` captured before and after and byte-identical.
5. `node -e` over this report (<= 60 lines) and over every file in UI custody for U+2013/U+2014 in string literals (comments are not the athlete's text, DECISIONS:114 (1)).
6. `node ..\tools\ci-status.js rebuild/lane-c-settings <sha>` from `work/lane-c/main` - CI green at the exact head.

## SERVED, AND WHAT IS OWED

http://127.0.0.1:4178/ , `serve.mjs` pid **58660**, rebuilt on this head; `/app.js` **1477805 bytes**, carrying `earned-726607e1fe54` and no placeholder. **This build is from THIS branch, which does not carry N1**: the page on 4178 is the gym card's machine settings without the nutrition entry, and it is rebased onto N1's merge later, as dispatched.

**CI residual**: `test/machine-settings-ui.test.mjs` and `machine-settings-check.mjs` are not in `rebuild.yml`'s enumerated today step - `.github` is editable only inside a re-pinning engine package (DECISIONS:112), so they ride the next re-seal with the setup, catalogue, copy and problem suites.

**A WINDOWS-ONLY CI FLAKE, DISCLOSED**: the first run (`aabb826`) was green on ubuntu-latest and on `pipeline`, and failed on windows-latest inside the B-NTC gate step. Its log shows every declared child OBSERVED except the last, `durable-journeys`, whose own diagnostics that gate withholds. Run here on this Windows PC at that exact tree, `node rebuild/m4/spec/b-ntc-journeys.cjs` prints **238/238 PASS, exit 0**, and the whole gate run ALONE prints PASS. A second sample at IDENTICAL CODE (`639db28`, an empty commit) came back **green**. The same windows-only failure at the same step was proved a flake once before on this repository (lane C, head 52f7eb8). **Not done**: the owner's hand test on a phone.
