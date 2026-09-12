# GYM CARD: MACHINE SETTINGS ON THE ACTIVE SET - REPORT

Branch `rebuild/lane-c-settings`, rebased onto `origin/rebuild/t2-client-core` @ `358f4eb` (N1 merged, :171) - see RE-PIN below. Brief `GYM-CARD-SETTINGS-DISPLAY-BRIEF.md` (DECISIONS:154 (2), :140 wave one). Evidence: `GYM-CARD-SETTINGS-REPORT-ANNEX.md`.

## D2 ROUND 2 - R2-1, MOUNT OWNERSHIP (review `db30e96`, candidate `3c5d4c1`)

D2 closed round 1's findings 2 and 3 and the blocking render symptom of finding 1, and isolated what remained: the deferred read repainted **whoever now owned the screen**. `paint()` ran whenever the read settled, and `show()` replaced `phone` unconditionally, so a read answering after Back put the workout back over Today, and after the check-in route put it over the sheet the athlete was filling in. Reproduced at D2's own bytes: RED **3 fail / 48 pass** with only `gym-app.mjs` stashed; GREEN **51 / 0**.

**The fix is ownership, not cancellation.** The mount holds `owns`, true from creation until the athlete leaves. EVERY exit - the active set's Back, both rest-screen Backs, the stub's `data-go="today"`, the finish, and the check-in route - now goes through `leaveCard(go)`, which hands ownership over BEFORE the caller's navigation runs. `show()` refuses to touch `phone` without ownership and `paint()` returns early without it, both before and after its own `await model.read()`, so a read, a save or any other deferred work that answers late is simply answering to a mount that is no longer the screen. Nothing is cancelled and nothing throws: the read still resolves and is still cached, and `first.settings.owns()` reports the state. Cells (all three RED at `3c5d4c1`): `D2.R2 - BACK during a deferred read: the destination screen is never repainted over`; `D2.R2 - the CHECK-IN opened mid-read keeps its screen AND its half-typed draft` (the destination's typed answer is asserted intact); `D2.R2 - a read that FAILS after navigation is equally silent`. `machine-settings-check.mjs` gained a real-browser step: from the active set, Back, land on Today, hold a second, and assert neither the log control nor the settings block has reclaimed the screen. Mutants **S-M1 to S-M10 re-run, 10/10 killed**, restored 51/51.

## D2 ROUND 1 - ALL THREE CLOSED BY D2 (review `a7c91a1`, candidate `fffc983`)

RED then was **3 fail / 45 pass** with the three product files stashed; GREEN 48/0. **1** - the `await settingsLane.latest(...)` on the paint path is GONE; the read is a cache keyed by exercise id, started from `settingsPaint`, never awaited, applied in its own repaint to the lift it belongs to (cells `D2.1 ...` plus a shape cell pinning that no such await exists in `gym-app.mjs`). **2** - the read carries three states and `renderBlock` never lets `reading` or `failed` fall through to the empty state; a failure says "Settings could not be read." with what it means and what to do, and the capture affordance stays closed while the record is unknown (`D2.2 ...`). **3** - two cells drive the ACTUAL log button with nothing saved and with unsaved editor text, and S-M6 in the handler now fails 4 cells (`D2.3 / S-M6 ...`). D2 verified all three closed.

## WHAT IS ON THE SCREEN

Under the prescription and above the performed inputs, the active set now shows the settings this athlete stored for THIS exercise id, as `name value` pairs in the order he gave them, with his cue below them. A machine this device holds nothing for says **"No settings saved yet."** and shows no figure at all: never a zero, never a dash, never another lift's seat height. A small **"Machine settings"** control opens an inline editor of `name`/`value` rows plus one cue field; saving writes ONE op, cancelling writes nothing, and neither ever blocks or moves the set's single primary action. **Nothing is interpreted**: "four" is stored and shown back as "four", no number is parsed out of a word, no unit invented, no row reordered and no name normalised (mutant S-M8).

## ONE WRITE PATH, AND IT IS THE COACH'S

The op is `earned/machine-settings/v1` exactly as `rebuild/coach/machine-settings-commands.cjs` defines it, and the gym card **imports that producer** rather than re-declaring anything: the profile, the caps, the at-least-one-answer rule, the read-back filter (`machineSettingsIn`) and latest-wins (`latestFor`) are one definition. The page's own refusal is the producer's own gate, `machineOf`, CALLED - so the page refuses exactly what the producer refuses, decided once, before anything is written. `rebuild/coach/machine-settings-commands.cjs` is now a pinned input of this page's build.

Executed, not asserted: **S6a** compares the op the card writes with the op the coach's producer builds for the same answer, member for member; **S6c** drives the coach's own `wave1-tools.cjs machine_settings` tool over the lane the GYM CARD opened and captured into and reads the capture back; **S6d** writes through the coach's `machineOf` and reads it on the card. **S6b** proves no second profile string, validator or payload shape exists in the page at all. `local-world.mjs`'s `createMachineSettingsHost` opens the identical lane, and the page cannot import it: that module also requires `rebuild/m4/workout/engine-runtime.cjs`, which `build.mjs` FORBIDS by name. `machine-settings-host.mjs` therefore duplicates the thirty lines that OPEN the lane and nothing else. Disclosed in the annex as residual 3.

## CUSTODY, READ OUT OF THE PIN LIST

`local-today-journey.test.mjs:614-619` PAGE_PINS names **exactly four** files - `today-entry.mjs`, `gym-host.mjs`, `reading-host.mjs`, `checkin-host.mjs` - and S10 re-reads that list at test time rather than trusting the brief. All four, and `today-bindings.mjs` against the B-NTC package's own hash, are **sha-identical**; `gym-model.mjs` needed no change and got none (its DTO already carried the lift's id). Because `today-entry.mjs` is pinned, `boot()` cannot gain a fifth lane: `gym-app.mjs` (driven, not pinned) opens it itself through `era.client.hostBindings({workoutCommands: createMachineSettingsCommands(), clock})`, lazily and FAILING CLOSED - so every jsdom mount in this repository is unchanged, because jsdom has no `indexedDB`.

## COUNTS (Windows, on this head)

`test/machine-settings-ui.test.mjs` **51** (43 + 5 round-1 + 3 round-2 cells) / today step **164** / setup **157** / catalogue **57** / problem **25** / copy **36** / coach **201** / W6 **552** / journey **51** (PAGE_PINS unmoved) / A0 host **32**, all 0 fail. Combined serial today + coach + W6 + host: **1275 / 1275**.

    B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict
    A1 TODAY BUILD PASS: 3 assets; 107 pinned inputs (13 engine, 12 client); build
    earned-c11d9c726b3b; approved design pinned; 68 bound classes; no em/en dash in any
    text the athlete can see

Six msedge checks PASS at this head (`browser-check`, `dash-check`, `setup-check`, `checkin-check`, `gym-check`, `machine-settings-check`), the last across 3 real `taskkill /F /T` each verified dead and now walking Back to Today, and `gym-check` still carrying the capture through the SAME kill the workout does.

## PREFLIGHT, NAMED (DECISIONS:155 (6), self-check)

1. `git status --porcelain` and `git diff --stat 63f3a1c..HEAD` - diff inside custody.
2. The eleven `node --test` count commands above, run from the worktree root (annex section 2 lists them verbatim).
3. `node rebuild/m3/w7-preview/today/build.mjs` - build PASS at the exact head.
4. `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` - the gate ALONE, `git status --porcelain` captured before and after and byte-identical.
5. `node -e` over this report (<= 60 lines) and over every file in UI custody for U+2013/U+2014 in string literals (comments are not the athlete's text, DECISIONS:114 (1)).
6. `node ..\tools\ci-status.js rebuild/lane-c-settings <sha>` from `work/lane-c/main` - CI green at the exact head.

## WHAT IS OWED

**CI residual**: `test/machine-settings-ui.test.mjs` and `machine-settings-check.mjs` are not in `rebuild.yml`'s enumerated today step - `.github` is editable only inside a re-pinning engine package (DECISIONS:112), so they ride the next re-seal with the setup, catalogue, copy and problem suites.

**A WINDOWS-ONLY CI FLAKE, DISCLOSED (round one, historical)**: the first run (`aabb826`) failed on windows-latest inside the B-NTC gate step and was green on ubuntu-latest and on `pipeline`; `b-ntc-journeys.cjs` printed 238/238 PASS here at that exact tree, the gate ALONE printed PASS, and a second sample at IDENTICAL CODE (`639db28`) came back green. The same windows-only failure was proved a flake once before (lane C, head 52f7eb8). **Not done**: the owner's hand test on a phone.

## RE-PIN ONTO :171 (N1 MERGED, tip `358f4eb`)

Rebased onto the N1 merge. **Two files conflicted, both additive lists, both resolved by keeping BOTH lanes**: `build.mjs` REQUIRED_INPUTS (N1's three food modules AND the coach's producer plus the two machine-settings modules) and `design.cjs` PREVIEW_RUNTIME_COPY (N1's nutrition sentences AND the settings block's). `screens.template.html` auto-merged; `today-app.cjs` did not conflict. Combined-tree counts on this head: machine-settings-ui **51** / food **56** / today step **164** / setup **157** / catalogue **57** / problem **25** / copy **36** / coach **201** / W6 **552** / journey **51** / host **32**, serial combined **1331 / 1331**, all 0 fail; B-NTC gate ALONE PASS; build PASS, now **110 pinned inputs**, `earned-c69bfb8fecc8`. **Seven** msedge checks PASS, `food-check.mjs` and `machine-settings-check.mjs` among them, each across 3 real verified kills.

Served: http://127.0.0.1:4178/ , `serve.mjs` pid **12320**, rebuilt on this head; `/app.js` **1507384 bytes**, carrying `earned-c69bfb8fecc8` and BOTH the nutrition entry and the machine-settings block.
