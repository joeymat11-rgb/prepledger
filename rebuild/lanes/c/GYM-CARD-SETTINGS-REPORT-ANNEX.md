# GYM CARD: MACHINE SETTINGS - REPORT ANNEX

Evidence for `GYM-CARD-SETTINGS-REPORT.md`. Branch `rebuild/lane-c-settings`, base
`origin/rebuild/t2-client-core` @ `8a42509`, brief cherry-picked as `02188ad` (from `b39f176` on
`rebuild/lane-c-briefs`, which is `4b138fb`'s parent-but-one).

## 1. FILES, WITH sha256 OF THE BYTES ON DISK

New:

    82ba53328a99f097efe028236ec0742e14535ad9bbcea81dbe924db170b41a70   97  today/machine-settings-host.mjs
    f3dcd2c50c9a294da65b2fd1c6846025c40bc374e18be733fc914af978b13337  151  today/machine-settings-view.mjs
    424ff3be561da6b6a9aaf974ae463637bd87a6faaf89c60b59bde0bb76eba57f  353  today/machine-settings-check.mjs
    2766f02c8b91711ffc751939c95e9a86f9b9acf29dbb2023e4a80fc9f4affba2  831  today/test/machine-settings-ui.test.mjs

Changed (sha256 after):

    6271730059e641f898606d8598c7f6e0151de0cad244d51b382406cd9c783613  471  today/gym-app.mjs
    2cacc15164a4fa9ea9695887be51640771529ed39495aaf7f8d231511a0c6738  593  today/gym-check.mjs
    df70854bfb5b6fb81bab3c792fa31ec62a8c420985541296e3d14c2b0474266a  402  today/screens.template.html
    bd3d3178275906bae528d0869aa271b27fa7c88cb9c8e97d5c0c7854b18ba85c  539  today/design.cjs
    afecc9d558bf72b3a7f395176ce880a4df9918a59eeeeba5902eabea806957c7  269  today/build.mjs
    96c0f30a5a8ab50b09c226275d766bea3b410dc037f5ba85e8ebf838662803a0  108  today/preview.css

UNCHANGED, and proved so at test time (S10) rather than claimed:

    b50b92314b8e7730b4aab56e79a9bff2f03d949d234eeaf2a7270ec83f3fa111  today-entry.mjs      (PAGE_PINS)
    70a59b5c328f3b029790ed49b957dd2b78eada1b9bdff9606de5ae17a4f01c18  gym-host.mjs         (PAGE_PINS)
    a3e9201587f97446f90856f3235cf99da8d487d1be127416be1e5086d17be6aa  reading-host.mjs     (PAGE_PINS)
    029b3a9b711cf4f9ef7ba8d33452d87b262d9c1ee34b005009134a8a81ec660b  checkin-host.mjs     (PAGE_PINS)
    95315f7a0e63cd49648a8c6c031d38a7bbce3f8e8f64e2fdfaf713b3ee174ce8  rebuild/m3/w6/local/today-bindings.mjs (B-NTC, on disk)
    6e2361035adf9e677d2a2499b54395ab738e71debaa2e2df9bc29b5cdca42fc3  gym-model.mjs (DRIVEN; it needed no change)
    c83446191bdb7c8e5514d28f864ffb138c02fb68ac06b5bbfd1512c22c36a31c  rebuild/coach/machine-settings-commands.cjs (imported, untouched)

`git diff --stat 8a42509..HEAD`:

    rebuild/lanes/c/GYM-CARD-SETTINGS-DISPLAY-BRIEF.md  123 +++
    rebuild/m3/w7-preview/today/build.mjs                11 ++
    rebuild/m3/w7-preview/today/design.cjs               20 ++
    rebuild/m3/w7-preview/today/gym-app.mjs             142 +++
    rebuild/m3/w7-preview/today/gym-check.mjs            63 ++
    rebuild/m3/w7-preview/today/preview.css              27 ++
    rebuild/m3/w7-preview/today/screens.template.html    22 ++
    7 files changed, 398 insertions(+), 10 deletions(-)   (plus the four new files above)

Nothing under `rebuild/engine`, `rebuild/client`, `rebuild/m4`, `rebuild/m3/w6`, `rebuild/conform`,
`.github` or `rebuild/coach` is touched. `rebuild/coach/machine-settings-commands.cjs` is READ ONLY,
as an import and as a build input.

## 2. COUNTS, WITH THE COMMANDS THAT PRODUCED THEM

All from the worktree root on Windows, at this head. `T = rebuild/m3/w7-preview/today/test/`.

| command | tests / pass / fail |
|---|---|
| `node --test T/machine-settings-ui.test.mjs` (NEW) | **43 / 43 / 0** |
| `node --test T/adapter T/checkin T/design.test.cjs T/gym T/ntc-h6-delta T/package.test.cjs T/view` (rebuild.yml's today step, verbatim) | **164 / 164 / 0** |
| `node --test T/setup.test.mjs` | **157 / 157 / 0** |
| `node --test T/catalogue.test.mjs` | **43 / 43 / 0** |
| `node --test T/problem.test.mjs` | **25 / 25 / 0** |
| `node --test T/copy.test.mjs` | **36 / 36 / 0** |
| `node --test "rebuild/coach/test/*.test.cjs"` | **201 / 201 / 0** |
| `node --test rebuild/m3/w6/test/*.test.mjs` | **552 / 552 / 0** |
| `node --test rebuild/m3/w6/test/local-today-journey.test.mjs` | **51 / 51 / 0** |
| `node --test rebuild/m3/w6/host/test/journey.test.mjs .../engine-equivalence.test.cjs .../host-seams.test.mjs` | **32 / 32 / 0** |
| `node --test rebuild/m3/w7-preview/test/*.test.cjs` | **19 / 19 / 0** |

Gates:

    node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
      -> B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package
         verdict; the 19 original gates, the private oracle and independent exact-artifact
         acceptance remain separate, and POSTFIX PACKAGE PASS is unavailable on this mode
      (run ALONE; `git status --porcelain` captured before and after and byte-identical)

    node rebuild/m3/w7-preview/today/build.mjs
      -> A1 TODAY BUILD PASS: 3 assets; 107 pinned inputs (13 engine, 12 client); build
         earned-726607e1fe54; approved design pinned; 68 bound classes; 2 pinned typefaces
         inlined; no literal figure in the template; 3/3 assets scanned and free of any
         network reference; no em/en dash in any text the athlete can see

The build's pinned input inventory moved by EXACTLY the modules added: `machine-settings-host.mjs`,
`machine-settings-view.mjs` and `rebuild/coach/machine-settings-commands.cjs`.
`machine-settings-check.mjs` and the suite are not build inputs; they are a check and a suite.

## 3. THE HUNKS, FILE BY FILE

**`gym-app.mjs`** (+142): fifteen `SETTINGS_*` copy constants and the frozen `SETTINGS_COPY` the view
module is handed (this file is a `design.cjs` VIEW_SOURCE, which is why the words are here and not in
the view module); `settingsLane` / `settingsOpening` / `settingsSaving` / `settingsLatest` /
`settingsDraft` / `settingsDraftLift` state; `openSettingsLane()` (a dynamic
`import('./machine-settings-host.mjs')`, opened once, failing closed); `settingsPaint()` and
`recordSettings()`; one line in `renderActive` between the prescription and the performed inputs; a
durable re-read of the lift on screen in `paint()`; and a `settings` handle attached to the promise
`mountGym` already returned, so a check can await a durable write instead of guessing at event-loop
turns. `mountGym` gained one option, `settings`, for the tests. Nothing existing was rewritten.

**`screens.template.html`** (+22): the `settings-block` and `settings-editor` sections inside
`t-gym`, built only from approved classes (`prescription`, `entry`, `small quiet`, `change`,
`text-link`, `fields`, `field`, `entry-header`, `error`, `primary`, `secondary-row`) and marked
`data-own` as every preview-owned block on this page is. Every visible string is a slot; there is no
literal figure and no inline style.

**`design.cjs`** (+20): thirteen sentences added to `PREVIEW_RUNTIME_COPY`. `VIEW_SOURCES` is
UNCHANGED and still pinned by `design.test.cjs`, which is why the words live in `gym-app.mjs`.
`Setting` and `Value` (the two box labels) are deliberately NOT declared: they are single approved
words that appear upstream, and the ABSENT-from-approved clause would fail on them. They are asserted
against the rendered labels in S13 instead. Named here rather than left silent.

**`preview.css`** (+27): four corrections, all ATTRIBUTE selectors so this screen invents no class -
44px minimum tap height on the capture's controls, the editor's rows stacked (the approved `.row` is
a space-between line, which two labelled text boxes cannot hold at 390px), the boxes held inside the
phone's width, and the approved 16px input size restated for a text box on a card whose other inputs
are number controls. Measured before and after in `machine-settings-check.mjs`: the first run of that
check FAILED with "the screen scrolls sideways by 73px", which is what these rules fix.

**`build.mjs`** (+11): the three new pinned inputs.

**`gym-check.mjs`** (+63): a capture on the active set before the existing first process kill, and
the assertion after the relaunch that it came back; the day-one and both-days op counts moved by
exactly one and the new op is counted BY NAME (`settingsOps`) rather than absorbed into a total; the
PASS line says so.

## 4. THE S-CHECK ROLL-UP (`test/machine-settings-ui.test.mjs`, 43 tests)

| cell | what it executes |
|---|---|
| S1 (3) | nothing stored -> the brief's own sentence verbatim, no digit and no hyphen anywhere on the block, no cue line; and with NO lane the card is exactly the card that shipped |
| S2 (3) | stored settings render verbatim in the STORED order with the cue below; "four" stays "four" and no unit is invented; a cue on its own is a whole answer |
| S3 (2) | another exercise id's settings never appear; two lifts in one session, walked set by set, each show their own or nothing |
| S4 (3) | three captures leave THREE ops and the block shows the third; the winning op carries the WHOLE machine so a dropped row is dropped; the lane's answer IS the coach's `latestFor` |
| S5 (3) | a capture writes ONE op and ITS outbox entry in one transaction; the block repaints from the durable record; a storage fault writes no part of it and the card says so in its own words |
| S6 (4) | the card's op equals the coach producer's op member for member; no second profile, validator or payload shape anywhere in the page; THE COACH'S OWN wave-one tool reads the card's capture; and the card reads what the coach's `machineOf` wrote |
| S7 (4) | neither a setting nor a cue; a name with no value; a value with no name; a repeated name; the producer's caps (over-long text, a 13th row) executed; a refusal leaves his answers on screen and writes nothing |
| S8 (3) | cancelling writes nothing and leaves the record as it was; the editor never disables the log action and the card keeps exactly ONE `.cta`; a set logs with the editor open and writes no settings op |
| S9 (4) | a new lane over the same store; a whole new installation over the same IndexedDB; the read-back's op id, date and time; a closed lane refuses in the client's own shape |
| S10 (3) | PAGE_PINS re-read at test time names exactly four files and all four are sha-identical; `today-bindings.mjs` matches the B-NTC package's own hash; the lane really is `client.hostBindings` and `gym-app.mjs` is what opens it |
| S11 (1) | no em or en dash in the new sources' string literals, the shipped markup, or the rendered card with the editor open |
| S12 (3) | every new sentence declared, preview-owned and REFUSED if dropped; every class in the new markup is a selector in the APPROVED stylesheets and the markup carries no figure; no class of its own and no width in JS |
| S13 (3) | two labelled TEXT boxes to start; add and remove a row, and the add stops at the producer's own cap; the editor opens seeded from what is stored |
| S14 (2) | the build pins the three new inputs and the tag is 12 hex; the new modules name no network and no browser storage |
| S15 (2) | the files this build adds and edits are the ones its custody names, and `gym-model.mjs` is untouched; the card with no capture is the card that shipped, apart from the block itself |

RED first, executed on this head: with `settingsPaint` never called from `renderActive` - the card
before this build - the suite ran **43 tests, 16 pass, 27 fail**. Restored **43 / 43 / 0**.

## 5. MUTANTS S-M1 TO S-M10, EXECUTED AND RESTORED

Each mutant was applied to the working tree, the suite run, then the original bytes written back.
Baseline and final both **43 / 43 / 0**.

| mutant | result | first cells that caught it |
|---|---|---|
| S-M1 render a setting from another exercise id | 39 / **4 fail** | S3 another id; S3 two lifts; S4 latest |
| S-M2 show `0` for an empty block | 38 / **5 fail** | S1 the sentence; S1 no figure; S3 |
| S-M3 return the FIRST capture | 40 / **3 fail** | S4 three captures; S4 whole machine; S4 latestFor |
| S-M4 write through a new local validator | 39 / **4 fail** | S6b; S7 the three refusals; S7 the caps |
| S-M5 a second machine-settings profile string in the page | 42 / **1 fail** | S6b |
| S-M6 make a capture required before logging | 42 / **1 fail** | S8 capture never blocks the set |
| S-M7 edit `gym-host.mjs` to thread the lane | 42 / **1 fail** | S10 PAGE_PINS bytes |
| S-M8 normalise "four" to 4 on save | 39 / **4 fail** | S5 the read-back; S6a the payload; S6c the coach's read |
| S-M9 skip the outbox entry (`stage: null` at this lane's own seam) | 10 / **33 fail** | S1; S5 one op and its outbox entry |
| S-M10 an em dash in the empty state | 36 / **7 fail** | S1; S11; S12 |

## 6. THE BROWSER CHECKS (msedge, with real kills)

`W7_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`.

`node rebuild/m3/w7-preview/today/machine-settings-check.mjs`, exit 0:

    GYM-CARD MACHINE SETTINGS BROWSER CHECK PASS - the active set opened with the honest
    empty state and no figure -> an empty capture refused -> two settings and a cue
    captured and shown back verbatim -> a genuine reload -> a correction that replaced the
    whole machine -> cancelling wrote nothing -> the set still logged with the editor open
    -> the same record at 320px, across 3 REAL PROCESS KILLS (taskkill /F /T, each verified
    dead); no off-origin request, no horizontal overflow at 390px or 320px, every settings
    box >= 16px, every settings target >= 44px, exactly ONE primary action on the active
    set at every state, and no U+2013 or U+2014 rendered in anything this build owns.
      the active set, nothing stored: log action 767-829 in a 842px viewport, 1 target >= 44px
      the active set, editor open at 390: log action 780-842 in a 842px viewport, 4 targets
        >= 44px, 3 boxes >= 16px, no sideways scroll
      an empty capture was refused: Add a setting or a cue before saving. Nothing was recorded.
      survived a real taskkill /F /T with the settings intact
      a correction replaced the whole machine: the dropped row is gone, not stale
      cancelling wrote nothing and left the record as it was
      a set logged normally with the capture editor open
      the active set, editor open at 320: log action 780-842 in a 842px viewport, 4 targets
        >= 44px, 3 boxes >= 16px, no sideways scroll

The other four all PASS on this head: `gym-check.mjs` (3 real kills, and the capture came back from
the first one), `browser-check.mjs`, `checkin-check.mjs`, `setup-check.mjs` (7 real kills).

TWO REAL DEFECTS this check found, both fixed and both in the annex rather than only in the diff:
(a) the editor's rows overflowed 390px by **73px**, which `preview.css` now corrects; (b) the check
itself hung instead of failing when a run failed - a killed context's `close()` and a keep-alive
socket can both wait for ever - so its shutdown is bounded and it exits on its verdict.

## 6b. THE CI RUNS, AND THE WINDOWS-ONLY FAILURE

| head | workflow | runner | result | run id |
|---|---|---|---|---|
| `aabb826` | pipeline | - | **success** | 34704745297 |
| `aabb826` | rebuild | ubuntu-latest | **success** | 34704745242 |
| `aabb826` | rebuild | windows-latest | **failure** at "Cumulative B-NTC native-carrier and legacy-census evidence" | 34704745242 |
| `639db28` (identical code, empty commit) | rebuild | both | **success** | 34705136147 |

The failed job's log reaches `B PACKAGE B-NTC CHILD focused OBSERVED` and then
`B PACKAGE B-NTC FAIL; required evidence missing or failed; local diagnostics withheld`:
every declared child was OBSERVED except the last one, `durable-journeys`
(`rebuild/m4/spec/b-ntc-journeys.cjs`), and that gate withholds the child's own output.

Run on this Windows PC at that exact tree:

    node rebuild/m4/spec/b-ntc-journeys.cjs
      -> B-NTC DURABLE JOURNEYS: 238/238 PASS; Today, gym, check-in, default-provider
         multi-day, host equivalence and one-store joins        (exit 0, 9.1s)

and the whole gate, run ALONE, prints PASS with a byte-identical `git status --porcelain`
before and after. The suites that child runs are green here as well: the today step
164/164, the local-today journey 51/51, PAGE_PINS byte-unchanged. The re-run API is not
available to this token (HTTP 403), so the second sample is an EMPTY commit rather than a
job re-run, and it is green. The same windows-only failure at the same step was observed
and proved a flake once before on this repository (lane C, head 52f7eb8, closed the same
way). Reported rather than retried silently.

## 7. PROVENANCE

- The op, the caps, the profile, the read-back and latest-wins: `rebuild/coach/machine-settings-commands.cjs`, imported and executed, never restated.
- The coach's read tool: `rebuild/coach/wave1-tools.cjs machine_settings`, driven over this page's lane in S6c.
- The custody list: `rebuild/m3/w6/test/local-today-journey.test.mjs:605-620`, re-read at test time by S10.
- The on-disk pin: `rebuild/lanes/b/tooling/packages/B-NTC.json`, read at test time by S10.
- The extension point: `rebuild/m3/w6/local/local-client.mjs:395 hostBindings`, used exactly as `setup-host.mjs` and the coach's own lane use it.
- The lift's id on the active set: `gym-model.mjs:269 lift: { id: activeLift.id ... }`, already there.
- The words: `design.cjs` PREVIEW_RUNTIME_COPY, bound by `assertDesignBinding` and refused if dropped.

## 8. RESIDUALS

1. **CI**: `test/machine-settings-ui.test.mjs` and `machine-settings-check.mjs` have no home in
   `rebuild.yml`; `.github` is editable only inside a re-pinning engine package (DECISIONS:112).
   They ride the next re-seal with the setup, catalogue, copy and problem suites.
2. **`today-entry.mjs` still does not boot this lane.** It is pinned until DECISIONS:154 (5). When it
   unpins, `openSettingsLane()` should be deleted and the lane injected by `boot()` like the other
   four; the injection point (`options.settings`) already exists and the tests already drive it.
3. **The lane opener is duplicated with the coach's** (`local-world.mjs createMachineSettingsHost`).
   The page cannot import that module: it also requires `rebuild/m4/workout/engine-runtime.cjs`,
   which `build.mjs` FORBIDS by name because its one non-literal require glob-expands over the whole
   of `rebuild/engine`. Only the OPENING is duplicated; the op and every rule about it are one
   definition, and S6a/S6c/S6d execute that.
4. **`Setting` and `Value`** are not in `PREVIEW_RUNTIME_COPY` (section 3, `design.cjs`), and are
   bound by S13 against the rendered labels instead.
5. **The two box labels are the only words not harvested from the approved design**, because the
   approved design has no per-machine block at all; every sentence is preview-owned by construction
   and checked ABSENT from the approved references.
6. **The owner's hand test on a real phone** is still owed; nothing here substitutes for it.
7. **This branch does not carry N1.** The page served on 4178 is built from this branch, so it has
   the gym card's machine settings and not the nutrition entry. The rebase onto N1's merge is the
   coordinator's, as dispatched.
