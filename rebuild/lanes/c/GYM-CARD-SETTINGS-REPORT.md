# GYM CARD: MACHINE SETTINGS ON THE ACTIVE SET - REPORT

Branch `rebuild/lane-c-settings`, rebased onto `origin/rebuild/t2-client-core` @ `05b73e2` (catalogue heads merged, :170) - CLEAN, no conflict. Brief `GYM-CARD-SETTINGS-DISPLAY-BRIEF.md` (DECISIONS:154 (2), :140 wave one). Evidence: `GYM-CARD-SETTINGS-REPORT-ANNEX.md`.

## D2 ROUND 1 - THE THREE BLOCKING FINDINGS (review `a7c91a1`, candidate `fffc983`)

Every finding reproduced first, at D2's own bytes. RED was measured by stashing ONLY the three product files and running the suite with the new cells present: **3 fail / 45 pass**. GREEN at this head: **48 pass / 0 fail**.

**1 (P1, S8) - the optional settings read BLOCKED the card. CONFIRMED and removed.** `paint()` used to `await settingsLane.latest(view.lift.id)` before `renderActive`, so with a pending read `mountGym` never finished: no active set, no log control, no workout. That await is GONE. The read is now a cache keyed by exercise id (`settingsRead`), started from `settingsPaint` and never awaited on the paint path; its answer arrives in its OWN repaint and is applied only to the lift it belongs to, so a late answer for a lift the athlete has moved past is stored and never shown. `mountGym` resolves while the read is still in flight, and the card is fully operable. Cells: `D2.1 - the card paints and the set LOGS while the settings read is still pending` (a lane whose `latest` never settles, `mountGym` observed resolved, then the set logged THROUGH THE BUTTON, then the late answer released and landed) and a shape cell pinning that `await settingsLane.latest` appears nowhere in `gym-app.mjs`.

**2 (P2, S1/S2) - a failed read was rendered as a confirmed absence. CONFIRMED and fixed.** The catch assigned `null` and `renderBlock` printed "No settings saved yet." for it. The read now has three states - `known`, `reading`, `failed` - and `renderBlock` refuses to let the last two fall through to the empty state: `reading` says it is reading, `failed` says **"Settings could not be read."** with what it means and what to do, both through `plainOrDrop`, both dash free and figure free. And the capture affordance is CLOSED while the record is unknown, so a failed read can never seed a replacement editor that would overwrite settings the athlete still has. Cell: `D2.2 - a FAILED read says so, never prints the empty state, and seeds no editor`, which also logs a set through the button to prove the workout is untouched.

**3 (S8/S-M6) - the handler prerequisite survived. CONFIRMED and KILLED.** S8 drove `kit.model.logSet` directly, so a guard added to the click handler was invisible. Two new cells drive the ACTUAL log control with nothing saved for the lift, and with the editor open and unsaved text in it. Re-run at this head with the mutation in the handler (`if (busy)` becomes `if (busy || !(settingsRead.get(view.lift.id) || {}).latest)`): **4 fail** (`D2.1`, `D2.2`, and both `D2.3 / S-M6` cells), bytes restored, 48/48 again. **All ten mutants S-M1 to S-M10 re-run and killed 10/10** on the new shape (S-M1 and S-M6 re-pointed at the code that replaced what they used to target); table in the annex.

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

`test/machine-settings-ui.test.mjs` **48** (43 + 5 D2 cells) / today step **164** / setup **157** / catalogue **57** / problem **25** / copy **36** / coach **201** / W6 **552** / journey **51** (PAGE_PINS unmoved) / A0 host **32**, all 0 fail. Combined serial today + coach + W6 + host: **1272 / 1272**.

    B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict
    A1 TODAY BUILD PASS: 3 assets; 107 pinned inputs (13 engine, 12 client); build
    earned-bd15cff23da2; approved design pinned; 68 bound classes; no em/en dash in any
    text the athlete can see

RED first, executed: at the original build, with the block never painted onto the active set, **43 tests, 16 pass, 27 fail**; at this round, the three product files stashed, **48 tests, 45 pass, 3 fail**. **Ten mutants S-M1 to S-M10 re-run and killed**, restored 48/48 (table in the annex). Six msedge checks PASS at this head (`browser-check`, `dash-check`, `setup-check`, `checkin-check`, `gym-check`, `machine-settings-check`), the last across 3 real `taskkill /F /T` each verified dead, and `gym-check` still carrying the capture through the SAME kill the workout does.

## PREFLIGHT, NAMED (DECISIONS:155 (6), self-check)

1. `git status --porcelain` and `git diff --stat 05b73e2..HEAD` - diff inside custody.
2. The eleven `node --test` count commands above, run from the worktree root (annex section 2 lists them verbatim).
3. `node rebuild/m3/w7-preview/today/build.mjs` - build PASS at the exact head.
4. `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` - the gate ALONE, `git status --porcelain` captured before and after and byte-identical.
5. `node -e` over this report (<= 60 lines) and over every file in UI custody for U+2013/U+2014 in string literals (comments are not the athlete's text, DECISIONS:114 (1)).
6. `node ..\tools\ci-status.js rebuild/lane-c-settings <sha>` from `work/lane-c/main` - CI green at the exact head.

## SERVED, AND WHAT IS OWED

The D2 round-1 build is `earned-bd15cff23da2` from THIS branch, which still does not carry N1: the two branches are independent and each is rebased onto `05b73e2`.

**CI residual**: `test/machine-settings-ui.test.mjs` and `machine-settings-check.mjs` are not in `rebuild.yml`'s enumerated today step - `.github` is editable only inside a re-pinning engine package (DECISIONS:112), so they ride the next re-seal with the setup, catalogue, copy and problem suites.

**A WINDOWS-ONLY CI FLAKE, DISCLOSED**: the first run (`aabb826`) was green on ubuntu-latest and on `pipeline`, and failed on windows-latest inside the B-NTC gate step. Its log shows every declared child OBSERVED except the last, `durable-journeys`, whose own diagnostics that gate withholds. Run here on this Windows PC at that exact tree, `node rebuild/m4/spec/b-ntc-journeys.cjs` prints **238/238 PASS, exit 0**, and the whole gate run ALONE prints PASS. A second sample at IDENTICAL CODE (`639db28`, an empty commit) came back **green**. The same windows-only failure at the same step was proved a flake once before on this repository (lane C, head 52f7eb8). **Not done**: the owner's hand test on a phone.
