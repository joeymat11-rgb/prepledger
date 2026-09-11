# A4 - DAD FIRST-RUN SETUP SCREENS - BUILDER'S REPORT

Tier: **screens** (`rebuild/DECISIONS.md:88`) - one independent Opus reviewer
(author != reviewer, told to disagree) + CI green both OS.
Built DIRECTLY from `BUILD-BRIEF.md` as amended, with no second mock
(`DECISIONS.md:116 (2)`, `:117 (1)`): the owner approves by looking at the REAL
screens served on the PC (section 10).

Branch `rebuild/lane-c-a4`, head **90727e7ca1b651f6edbac313bd099622e732c949**.
Base **5c6766e** (`origin/rebuild/t2-client-core`, "merge rebuild/lane-c-handproof
@ c4539a7"). The three dad-first-run docs commits were cherry-picked onto the tip
first, because `git ls-tree origin/rebuild/t2-client-core rebuild/lanes/c/dad-first-run/`
was EMPTY: the brief travels with the build.

Every claim below was executed on the owner's Windows PC and the command and its
output are printed with it. Nothing is reported that was not run; what could not
be run is in section 11, by name.

---

## 1. What was added, and what was edited

### 1.1 ADDED (A4's own files, licensed by `DECISIONS:117 (1)`)

| file | lines | sha256 |
|---|---|---|
| `rebuild/m3/w7-preview/today/setup-model.mjs` | 456 | `4fdacecd1e5de9f4633ed933b85e2edb363dd2ef53052fd080b84c0f5edc46e1` |
| `rebuild/m3/w7-preview/today/setup-commands.mjs` | 83 | `0a54d4df85e682964a2502a3032686be8e130e17f57eed7af0ed101e5547a808` |
| `rebuild/m3/w7-preview/today/setup-host.mjs` | 34 | `bba8b77a4ec36a4834dc4ac202d1976c115dead73b1f62532c64c8a370a86eb1` |
| `rebuild/m3/w7-preview/today/setup-app.mjs` | 338 | `018cfdae2478bc274363510083a36ee2a6b41b2bc6a20bfd7288a0fb7cf2acd8` |
| `rebuild/m3/w7-preview/today/setup-check.mjs` | 439 | `d9c6262ab2d73024eb575bdb669d2bab837a6b0ddf8c187de4ad9e1dbcd69c8d` |
| `rebuild/m3/w7-preview/today/test/setup.test.mjs` | 1339 | `7709b7ef292e98a2c1c8c9051d678a66e60f1b4ab105242099a46950ea1e2e93` |

(Hashes: `certutil -hashfile <file> SHA256`, run at head 90727e7.)

DEVIATION FROM THE BRIEF, DISCLOSED: `BUILD-BRIEF` section 1.1 names
`setup-model.cjs` and `setup-commands.cjs`. The dispatch's own custody line names
`setup-{model,commands,host,app,check}.mjs`. All five are **.mjs**, which is also
what A2 moved this directory to (`DECISIONS:102`, "tests to .mjs"). The producer
is imported by `setup-host.mjs` and by `today-entry.mjs`, both ESM, and by the
suite; nothing needed `require()`.

### 1.2 EDITED - every hunk, before and after

`git diff --stat 5c6766e..HEAD` on the code files:

```
 rebuild/m3/w6/local/today-bindings.mjs             |   86 +-
 rebuild/m3/w6/test/local-today-journey.test.mjs    |    6 +-
 rebuild/m3/w7-preview/today/build.mjs              |   10 +
 rebuild/m3/w7-preview/today/design.cjs             |  103 +-
 rebuild/m3/w7-preview/today/screens.template.html  |   35 +
 rebuild/m3/w7-preview/today/today-app.cjs          |   67 +-
 rebuild/m3/w7-preview/today/today-entry.mjs        |  123 +-
```

**(a) `today-app.cjs` (licensed, `:117 (1)`) - 5 hunks, all additive**

| # | before | after |
|---|---|---|
| 1 | (after `CHECKIN_NO_STORE`) | `+ const SETUP_ENTRY = "Set up your week";` with the A4 note. A literal here because this module is CommonJS and the setup screens are ESM; `setup-app.mjs` carries the same string in its own COPY and the suite asserts the two agree. |
| 2 | `const checkin = options.checkin \|\| null; ... let screen = "today";` | `+ const setup = options.setup \|\| null;` and `+ const firstRun = () => ...setup.firstRun() === true` |
| 3 | `map.get("recovery-state").textContent = recoveryState();` | `+ setupTile(map);` on the next line |
| 4 | (before `recoveryState()`) | `+ function setupTile(map) {...}` - shows the tile ONLY while `firstRun()` |
| 5 | `function render(next, focus = false) { screen = next;` | `+ if (next === "setup" && !firstRun()) next = "today";` then the `setup` branch that calls `setup.open({doc, phone, back, done})` |
| 6 | `render("today");` | `+ function requestedScreen()` reading `?screen=` from `doc.defaultView.location.search`, then `render(requestedScreen() \|\| "today");` |
| 7 | `... CHECKIN_NO_STORE };` | `... CHECKIN_NO_STORE, SETUP_ENTRY };` |

**(b) `screens.template.html` (licensed) - 2 hunks**

| # | before | after |
|---|---|---|
| 1 | `<button class="primary" ...>` then `<button class="link coach-entry" ...>` inside `t-today`'s `.bottom` | one `<button class="link" data-go="setup" data-slot="setup-entry" hidden>` between them, with a `data-slot="setup-entry-label"` span bound at runtime |
| 2 | (end of file) | the whole `<template id="t-setup">`: mast + counter, back, head/lead/note, one `data-slot="body"` the view fills, one error line, one primary, one secondary, one fine line. Every word bound at runtime; no literal figure; every class token already a selector in the pinned approved stylesheets |

**(c) `design.cjs` (licensed) - 4 hunks**

| # | before | after |
|---|---|---|
| 1 | (after `PREVIEW_RUNTIME_COPY`) | `+ SETUP_MODEL_SOURCE` and `+ DASHES` (U+2014, U+2013, `&mdash;`, `&ndash;`) |
| 2 | (after `assertRecoveryBinding`) | `+ setupVocabulary()` - HARVESTS COPY / VALIDATION / REFUSAL_SENTENCES out of `setup-model.mjs` at check time; `+ setupSource()`, `+ setupOwnSource()`, `+ assertSetupBinding()` - every harvested sentence carries no dash and is present in a view source, the view sources themselves carry no dash, and the shipped `t-setup` section carries none |
| 3 | `const recovery = assertRecoveryBinding(...); return { classes, recovery, copy: ...}` | `+ const setup = assertSetupBinding(approved, templateHtml);` and `setup` added to the returned report |
| 4 | (after `VIEW_SOURCES`) | `+ SETUP_SOURCES`. It is its OWN list, not two more `VIEW_SOURCES` entries, because `VIEW_SOURCES` is pinned by name in `test/design.test.cjs`, which A4 does not own |

**(d) `build.mjs` (licensed) - 1 hunk**

Five lines added to `REQUIRED_INPUTS`: the four setup modules that reach the
browser plus `rebuild/m4/workout/athlete-state.cjs`. A build that lost any of
them would be a page whose first run goes nowhere, or one that invented an
athlete state of its own. `93 pinned inputs` became `98`.

**(e) `rebuild/m3/w6/local/today-bindings.mjs` (lane C exclusive, `LANES.md`) - 2 hunks**

| # | before | after |
|---|---|---|
| 1 | (after `createCheckInHost`'s closing brace) | `+ async function createSetupHost(options)` - the SAME shape as `createCheckInHost`: its own `hostBindings()` over the same repository, the era's own lease, a `setupsIn(generation)` read-back narrowed by profile equality, `enrolled()`, and a `save()` that re-reads the generation and refuses `SETUP_ALREADY_RECORDED` before it reaches the client |
| 2 | `createReadingHost, createGymHost, createCheckInHost,` | `createReadingHost, createGymHost, createCheckInHost, createSetupHost,` |

Every existing export is byte-unchanged: the only edit to an existing line is the
one comma-separated name added to the returned object.

**(f) `today-entry.mjs` - THE FIFTH FILE, disclosed**

The dispatch's custody line named four licensed files and did not name
`today-entry.mjs`. `BUILD-BRIEF` section 1.2 DOES license it, as a lane C
one-store wrapper file under `DECISIONS:106 (b)` + `:111` (which is exactly the
licence `:111` exercised on `today-entry / reading-host / gym-host / checkin-host`),
and S15 cannot be built without it: `boot()` lives here. Four hunks:

| # | before | after |
|---|---|---|
| 1 | the check-in imports | `+ import { createSetupHost, PROFILE as SETUP_PROFILE }`, `+ createSetupCommands`, `+ createSetupModel, createCleanInitState`, `+ mountSetup`, `+ export const SETUP_BASIS_STATE_REFUSED` |
| 2 | (before `createWorkoutEntry`) | `+ export async function createSetupEntry({today: day}, options)` - the check-in entry's shape: the durable lane, `firstRun()`, `athleteState()`, and an `open()` whose `onDone` writes ONCE and reports what the layer answered |
| 3 | `export async function boot(options = {}) {\n  const doc = ...` | the KEYED refusal: `basisState` with no `today` throws `SETUP_BASIS_STATE_REFUSED` before `doc` is touched, so nothing is painted |
| 4 | `const lane = hosts ? {hosts} : {...};` | `+` the setup lane opened only when `!restoreRequired`, `+` the second half of the key (a foreign `basisState` over an already-enrolled installation is refused), and `setup` passed to `mountToday` / returned from `boot` |

**(g) `rebuild/m3/w6/test/local-today-journey.test.mjs` - 1 line, as its own failure message instructs**

`PAGE_PINS['today-entry.mjs']` re-pinned
`5fc40e1e...` -> `328be6152fbd045167af2a827d1a4ce4b30a60b0b2917b89e210cc057c8f11da`,
with the reason in a comment beside it. The pin's own message says "Re-read it
against rebuild/m3/w6/local/today-bindings.mjs ... then update PAGE_PINS here."
It was re-read: `boot()` still opens the local era BY DEFAULT (the `hosts ||
openTodayHosts` branch is byte-unchanged) and no wrapper opens a store of its own.

### 1.3 NOT TOUCHED

`git diff --name-only 5c6766e..HEAD` shows nothing under `rebuild/engine`,
`rebuild/client`, `rebuild/conform`, `rebuild/m4/**`, `rebuild/m3/w6/host`,
`.github`, `src` or `ledger`. `preview.css` is byte-unchanged: the six screens
needed no new chrome. `gym-host.mjs`, `reading-host.mjs` and `checkin-host.mjs`
are byte-unchanged (their PAGE_PINS still match).

---

## 2. Counts - every suite, executed at head 90727e7

Windows, `set NODE_ENV=&&` before each command (this PC carries an ambient
`NODE_ENV=production`, which makes pnpm skip devDependencies).

| suite | command | expected | EXECUTED |
|---|---|---|---|
| A1/A2 Today | `node --test .../test/{adapter,view,design,package}` | 64 | **64 pass 0 fail** |
| A2 gym | `node --test .../test/gym.test.mjs` | 64 | **64 pass 0 fail** |
| A3 check-in | `node --test .../test/checkin.test.mjs` | 28 | **28 pass 0 fail** |
| **A4 first run (NEW)** | `node --test .../test/setup.test.mjs` | >= 58 | **101 pass 0 fail** |
| all five today files together | one `node --test` | 156 + 101 | **257 pass 0 fail** |
| W6 | `node --test "rebuild/m3/w6/test/*.test.mjs"` | 552 | **552 pass 0 fail** |
| W6 journey | `node --test .../local-today-journey.test.mjs` | 51 | **51 pass 0 fail** |
| A0 host | `node --test rebuild/m3/w6/host/test/{journey,engine-equivalence}` | 22 | **22 pass 0 fail** |
| w7-preview | `node --test "rebuild/m3/w7-preview/test/*.cjs"` | 19 | **19 pass 0 fail** |
| engine artifact | `node rebuild/m4/spec/native-carriers-package.cjs --ci` | PASS | **PASS** |
| page build | `node rebuild/m3/w7-preview/today/build.mjs` | PASS | **PASS** |

Build line, verbatim:

```
A1 TODAY BUILD PASS: 3 assets; 98 pinned inputs (13 engine, 12 client); approved
design pinned; 68 bound classes; 2 pinned typefaces inlined; no literal figure in
the template; 3/3 assets scanned and free of any network reference
```

`98` was `93` before A4: the five REQUIRED_INPUTS lines. `68` bound classes is
unchanged, because the first-run screen introduces no class of its own.

ZERO REGRESSIONS. `today 64` is still exactly 64, `gym 64` still 64, `checkin 28`
still 28: A4 added a SIXTH test file rather than subtests to the existing five,
so no existing subtest moved. The only existing assertion that changed value is
the `today-entry.mjs` byte pin in the W6 journey suite (1.2 g), which is a pin,
not a behaviour, and which the suite's own failure message tells the editor to
re-pin.

### Browser checks (real msedge, real `taskkill /F /T`)

`set W7_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

| check | verdict |
|---|---|
| `browser-check.mjs` (A1) | **PASS** - "survived a REAL process kill (taskkill /F /T on 8 msedge.exe of a persistent profile, kill verified)" |
| `gym-check.mjs` (A2) | **PASS** - two training days across three real kills, 16 operations in one sealed generation |
| `checkin-check.mjs` (A3) | **PASS** - 3 real process kills, a new day starts blank |
| **`setup-check.mjs` (A4, NEW)** | **PASS** - 4 real process kills, one of them MID-FLOW |

A4's browser check, verbatim:

```
A4 FIRST-RUN BROWSER CHECK PASS - Today's first-run tile -> six screens tapped
through -> a REAL KILL MID-FLOW leaving zero operations and no partial athlete ->
the flow again -> ONE operation written -> Today with the tile gone and
?screen=setup refused -> reload -> new page -> 4 REAL PROCESS KILLS (taskkill /F
/T, each verified dead); no off-origin request, no horizontal overflow at 390px
or 320px, every input >= 16px, every tap target >= 44px, the primary action
reachable on every screen, and no U+2013 or U+2014 rendered anywhere.
  screen 1: content 842px in a 842px viewport, no sideways scroll
  screen 2: content 1159px in a 842px viewport, no sideways scroll
  screen 3: content 1734px in a 842px viewport, no sideways scroll
  screen 4: content 1123px in a 842px viewport, no sideways scroll
  four screens answered, then the browser is killed
  a real taskkill mid-flow left zero operations and no partial athlete
  screen 1: content 842px in a 842px viewport, no sideways scroll
  screen 2: content 1159px in a 842px viewport, no sideways scroll
  screen 3: content 1734px in a 842px viewport, no sideways scroll
  screen 4: content 1123px in a 842px viewport, no sideways scroll
  screen 5: content 842px in a 842px viewport, no sideways scroll
  screen 6: content 1093px in a 842px viewport, no sideways scroll
  the six screens finished and the page landed on Today
  survived a real taskkill /F /T with exactly one operation
  no horizontal overflow at 320px either
```

WHICH SCREENS SCROLL, AND WHY (S11 asks for this by name). Screens 1 and 5 fit
the 842px viewport unscrolled (842/842). Screens 2, 3, 4 and 6 are FORMS whose
length is the athlete's own answers: seven weekday blocks, one row per exercise,
two numeric fields per exercise, the whole week read back. They scroll, and the
primary action is fully visible once scrolled to, measured, on every one of them.
That is the same allowance the approved recovery screen already takes
(`checkin-check.mjs:17`; the pinned reference is itself 933px in an 842px
viewport). Nothing is shrunk or hidden to fake a fit.

---

## 3. THE ACCEPTANCE BAR - S1 to S25, each with its evidence

Every row was executed. "suite" means `node --test --test-reporter=tap
rebuild/m3/w7-preview/today/test/setup.test.mjs` at head 90727e7, 101 pass 0 fail.

| id | verdict | evidence |
|---|---|---|
| **S1** | PASS | `S1 - every field lands EXACTLY: the whole document, deep-equal` - the reducer is driven through its own actions and its output is deep-equalled against the literal expected document, then `S1 - the ACCEPTED constructor rebuilds the whole athlete from it, number for number` passes it to `createCleanInitState` and checks `athlete_label`, `split[0].from`, all seven map entries, `exOrder`, `priority_muscles`, the rungs element-wise and the type of every number |
| **S2** | PASS | `S2 - closed-contract fidelity` - `Object.keys(setup)` deep-equals `REQUIRED_SETUP` IMPORTED from `athlete-state.cjs` (via `setup-model.mjs`'s re-export), each exercise's keys deep-equal `REQUIRED_EXERCISE`, and the two lists are asserted to really occur in the constructor's source. `S2 - a ninth exercise member is REFUSED` adds `setup: ''` and watches `CLEAN_INIT_EXERCISE_REQUIRED` throw |
| **S3** | PASS | `S3 - every CLEAN_INIT_* code ... has a screen sentence` ENUMERATES the codes out of `rebuild/m4/workout/athlete-state.cjs` at test time (5 found) and asserts `REFUSAL_SENTENCES` names exactly them, no more and no fewer. `S3 - every named missing answer carries one of those codes and the screen that owns it` |
| **S4** | PASS | `S4 - an empty answer set builds NOTHING` (`document().setup === null`, so the constructor is never called) and `S4 - ... the primary action is DISABLED and the refusal is named on screen` (jsdom, screen 6) |
| **S5** | PASS | four subtests: the standard PROPOSED and pre-selected (`aria-pressed="true"` on 3 and on 10, and on nothing else); NO control matching `/not sure/i` in the flow's code or on any of the six rendered screens; a second tap on the selected chip is not a toggle and neither value can reach null by any tap sequence; choosing another value changes only that one and the document still carries both |
| **S6** | PASS | `S6 - the day a fresh split starts is IN FORCE that same day` runs `splitInForceOn` and `dayType` (restated from `workout-host.mjs:39-42` and `plan.cjs:11-22`) on three real Mondays; `S6 / M4 - split.from is the LOCAL date at both ends of the day in UTC, New York and Auckland` spawns SIX child node processes with `TZ` set, at the instants that are 00:00:01 and 23:59:59 local in each zone, and asserts `localISO` gives the local day while requiring that at least one of the six really has a different UTC day (it does) |
| **S7** | PASS | `S7 / M5 - REST is written EXPLICITLY` - all seven keys present, the five unchosen days are the string `"REST"`, and deleting one key is shown to make the constructor throw |
| **S8** | PASS | `S8 - exactly the declared supplied numbers ...` walks every TEXT NODE of every one of the six screens (per node, so three adjacent chips reading 2, 3 and 4 are three numbers and not "234") plus every input's value, against an allowlist built in the test from section 2.8's rows. `S8 - the two declared standards are the ONLY numbers the flow supplies` |
| **S9** | PASS | HARVEST, not a list: `design.setupVocabulary()` reads COPY / VALIDATION / REFUSAL_SENTENCES out of `setup-model.mjs` at check time, and the test asserts every sentence the module holds is in the harvest. The build REFUSES an omission: M11 below. Plus `S9 - every class the first-run screen uses is a selector in the APPROVED stylesheets` and `S9 - the shipped first-run template carries NO literal figure` |
| **S10** | PASS | measured in the browser: no sideways scroll at 390px on any of the six screens, and none at 320px. The suite adds a structural guard (no fixed width wider than a phone, no absolute positioning) |
| **S11** | PASS | measured in the browser on all six screens (`reachable()`); the suite asserts exactly ONE primary per screen and that it names its action. Which screens scroll and why is in section 2 |
| **S12** | PASS | measured in the browser: every input >= 16px, every visible `#phone button` >= 44px, on every screen. The suite asserts every control the view creates carries an approved tap-target class and every input sits in an approved field block |
| **S13** | PASS | `S18 / M7 / M8` (one op), `S13 - a SECOND "Start using Earned" finds the op that is there and writes nothing` (`SETUP_ALREADY_RECORDED`, ops still 1), `S13 - a SECOND TAB over the same installation cannot enrol the device twice`, `S13 / M9 - once the record holds a first run, the setup ROUTE refuses and the tile is gone`. In the browser: the tile hidden, `?screen=setup` landing on Today, and exactly one operation after a reload, a new page and a real kill |
| **S14** | PASS | `S14 - with NO store the first-run route is not offered, and nothing is enrolled` (a page that cannot ask does not guess: `firstRun()` is false) and `S14 - RESTORE_REQUIRED: boot offers no setup entry at all` (the setup lane is opened only inside `if (!restoreRequired)`). M9 turns it RED |
| **S15** | PASS | `boot({basisState})` alone throws `SETUP_BASIS_STATE_REFUSED` and `#phone`'s innerHTML is byte-identical before and after; `boot({basisState, hosts, today})` works; a foreign `basisState` over an ALREADY ENROLLED installation is refused. See the deviation note in section 5 |
| **S16** | PASS | `S16 - back never loses an answer` (1->6, back to 1, forward to 6, the answer object stringify-equal) and `S16 - changing one answer on screen 2 changes ONLY that answer` |
| **S17** | PASS | `S17 - the first-run screens name no network address, and the CSP is unchanged` runs `build.assertNoNetworkReference` over the three BUILT assets, asserts `serve.mjs`'s CSP still carries `connect-src 'none'` and `default-src 'none'`, and greps the flow for `fetch` / `XMLHttpRequest` / `WebSocket` / an absolute URL. In the browser, every off-origin request is a recorded failure and none was recorded |
| **S18** | PASS | over the real encrypted store: ONE operation with ONE outbox entry; a relaunch reads it back and writes nothing. In a real browser: a REAL `taskkill /F /T` MID-FLOW leaves ZERO operations and no partial athlete, and a second real kill after the write leaves exactly one |
| **S19** | PARTIAL, disclosed | the Today he lands on is A1's own page with its own empty states, unchanged. What A4 does NOT do is make that Today stand on HIS athlete: see H3 in section 6. `S18 / S19` asserts the athlete the first run created is read back from the record with `reads: []`, `sessionLog: {}` and `w: null` on every lift |
| **S20** | PASS | `S20 - NO starting load is collected, anywhere, by design` - greps the flow, renders all six screens, asserts every lift arrives `w: null`, and asserts screen 6 carries the sentence. The browser check asserts `/starting (weight\|load)/i` does not appear on screen 4. M14 turns it RED |
| **S21** | PASS | `S21 - no streaks, no countdown, no urgency, no percentage, and ONE skip` (the skip count is asserted to be exactly 1 on screen 5 and exactly 0 on the other five) and `S21 - the "n of 6" counter is the WHOLE of the progress reporting` (no `progress`, no `role="progressbar"`) |
| **S22** | NOT RUN | the hand test is a human run. `HAND-TEST.md` exists; the reviewer performs it (`BUILD-BRIEF` 4.1). Not substitutable by a suite and NOT claimed here |
| **S23** | PASS | (a) build time: zero U+2014, zero U+2013 and zero `&mdash;`/`&ndash;` in all five setup sources and in the shipped `t-setup` section, and the check is an assertion that REFUSES (M15 turns the suite AND the build red). (b) render time: every screen in four states (empty, filled, validation, refusal), every node's textContent, `placeholder`, `aria-label` and `title`, plus the same scan in the real browser on all six screens |
| **S23b** | PASS | written against the BEHAVIOUR, not a second implementation: the test asserts the property that makes dash-normalisation safe (a term differing by anything other than a dash still fails) over `design.APPROVED_COPY`, and reports the list of terms that need normalising. M16 turns it RED. P1's own mechanism is NOT duplicated here; see section 7 |
| **S24** | PASS | `grep -L` proof, executed: not one of the five setup files names `rebuild/engine` in any import, require or path (comments excluded), and none names `seed.cjs`, `migrate.cjs`, `constants.cjs` or `progression.cjs`. The two standards are literals declared in `setup-model.mjs` with the section 2.8 provenance beside them and the word INVENTED. M19 turns it RED |
| **S25** | PASS | the distinct `mg` values are PARSED OUT OF `rebuild/engine/seed.cjs` at TEST time and deep-equalled against `MG_LABELS`; the stored set is exactly the eleven; a chip stores the bare label and never the gloss; "something else" stores the typed text verbatim and unmapped; no coarse seven-group LIST and no mapping table exists in any setup file or in the template. M17 and M18 turn it RED |

---

## 4. MUTANTS - 20 of 20 executed, 20 of 20 killed, every file restored

`BUILD-BRIEF` 4.2 lists twenty mutants and asks the reviewer to try them. The
builder executed ALL TWENTY rather than the twelve the dispatch required: each
mutation was applied to the real file, the named check was run, and the file was
restored and its sha256 re-computed and compared. The driver refuses to continue
if a restore is not byte-identical.

```
M1  KILLED by S8 [pass 1 fail 1] (the standard step stops being said on screen 4); restored 018cfdae2478
M2  KILLED by S1 and the steps row of 2.1 [pass 17 fail 3] (one rung dropped from a parsed uneven stack); restored 4fdacecd1e5d
M3  KILLED by S5 [pass 0 fail 1] (an "I am not sure" control comes back); restored 4fdacecd1e5d
M4  KILLED by S6 [pass 0 fail 1] (split.from built from the UTC day instead of the local one); restored 4fdacecd1e5d
M5  KILLED by S7 [pass 0 fail 1] (one weekday key omitted from the map); restored 4fdacecd1e5d
M6  KILLED by S2 and S1 [pass 24 fail 11] (a ninth exercise member sent to the constructor); restored 4fdacecd1e5d
M7  KILLED by S18 and S13 [pass 0 fail 6] (the screen-6 write skips the durable client entirely); restored aa310314fd6f
M8  KILLED by S18 (the op count) and S13 [pass 2 fail 4] (more than one operation written for one first run); restored aa310314fd6f
M9  KILLED by S14 [pass 0 fail 1] (the setup screens offered on RESTORE_REQUIRED); restored 328be6152fbd
M10 KILLED by S15 [pass 2 fail 1] (boot({basisState}) accepted unkeyed); restored 328be6152fbd
M11 KILLED by the build (design.cjs assertSetupBinding) and S9 [A1 TODAY BUILD FAIL: SETUP-BINDING FAIL: the first-run screen is not in the shipped template] (the first-run screen deleted from the shipped template); restored 180147de2132
M12 KILLED by S12 [pass 0 fail 1] (a control with no approved tap-target class); restored 018cfdae2478
M13 KILLED by S21 [pass 0 fail 1] ("almost there" urgency added to the masthead); restored 018cfdae2478
M14 KILLED by S20 [pass 0 fail 1] (a starting-load field rendered on screen 4); restored 018cfdae2478
M15 KILLED by S23 (a) and (b), and the build [pass 1 fail 3] (an em dash back in one sentence); restored 4fdacecd1e5d
M16 KILLED by S23b [pass 0 fail 1] (dash-normalisation that lets a term differing by a WORD pass); restored 7709b7ef292e
M17 KILLED by S25, S1 and the mg row of 2.1 [pass 21 fail 4] (a chip stores its gloss instead of the engine label); restored 4fdacecd1e5d
M18 KILLED by S25 [pass 0 fail 1] (a seven-group list and a mapping added before storing); restored 4fdacecd1e5d
M19 KILLED by S24 [pass 1 fail 1] (the standard start read out of seed.cjs); restored 4fdacecd1e5d
M20 KILLED by S5 and S1 [pass 19 fail 1] (the selected sets chip toggles back to null); restored 4fdacecd1e5d
MUTANTS 20/20 killed
```

Two mutants needed a scoped translation, stated plainly so the reviewer can
judge it:

- **M3** ("let 'I'm not sure' write `sets: 3`") has no control to mutate, because
  `DECISIONS:114 (2)` removed it. The mutant applied is the one that would
  reintroduce it: a `notSure` entry in the screens' own COPY. S5 catches it.
- **M7** ("skip the outbox") and **M8** ("one op per screen") were applied at the
  lane rather than by mutating `rebuild/client`, which A4 has no custody for: M7
  makes `save()` report acknowledged without ever calling the durable client, M8
  writes a second operation past the already-recorded guard. S18's operation and
  outbox counts and S13's "still one op" catch both.

The restore hashes above match the sha256 table in section 1.1 exactly
(`setup-model.mjs 4fdacecd...`, `setup-app.mjs 018cfdae...`, the suite
`7709b7ef...`), and `git status --porcelain` was clean after the run.

---

## 5. THE FOUR PLACES THIS BUILD DIVERGES FROM THE BRIEF

Each is a decision the builder made under a constraint the brief did not
anticipate. Each is stated so the reviewer can overturn it.

### 5.1 The landing screen is Today, not screen 1

`BUILD-BRIEF` 2.3 rule 2 says "store opens + no first-run op -> the setup
screens". A4 ships the setup screens reachable from Today's first-run tile and
from `?screen=setup`, and Today is still the landing screen.

Why: Today's engine basis on this page is STILL the synthetic fixture
(`today-model.cjs` `createBasisState`), so a fresh installation that has not run
setup is exactly the A1 page that already ships. Making setup the landing screen
changed what every merged suite and check boots into, and turned 2 subtests of
`local-today-journey.test.mjs` red (the primary action was no longer "Log the
scale", because the page was no longer on Today). It was reverted. The honest
wiring is H3 below, and it is blocked on an engine change.

What the owner sees is unaffected: `http://127.0.0.1:4178/?screen=setup` opens
screen 1 of 6, exactly as the mock was served.

### 5.2 The `basisState` key is `today`, not `hosts` AND `today`

`BUILD-BRIEF` 2.6 asks for "honoured ONLY when the caller also supplies its own
`hosts` AND its own `today`". S15's two executable clauses are met as written:
`boot({basisState})` alone throws and paints nothing; `boot({basisState, hosts,
today})` works.

The `hosts` half could not be required. `gym-check.mjs:360` and `:416` - a MERGED
check that must stay PASS - call `mod.boot({ today: day, basisState: fresh })`
from inside the page, with no `hosts` and no `indexedDB`. Requiring `hosts` turns
that check RED, and `gym-check.mjs` is not in A4's custody.

What was built instead is a key in two parts, and the second part is the one the
brief's REASON asks for: (1) `basisState` with no `today` throws, which covers
the shipped page (it calls `boot()` with no arguments at all); (2) a foreign
`basisState` over an installation that ALREADY CARRIES A FIRST-RUN OPERATION is
refused unless the caller brought its own `hosts` - which is precisely "a foreign
athlete's week painted over a real device's store". Both are executed by S15.

RECORDED FOR THE PM: tightening this to the brief's exact wording needs one line
in `gym-check.mjs` (pass the check's own `hosts`), which is a `today/**` file
outside A4's licence.

### 5.3 `design.cjs`'s first-run harvest has no "absent from the approved
references" clause

`PREVIEW_RUNTIME_COPY` carries that clause, to stop a builder smuggling
approved-looking words into a preview-owned list. It has nothing to bite on here:
the approved 2026-09-08 design HAS NO FIRST-RUN SCREEN, so every sentence is
preview-owned by construction, and the words that do overlap ("Earned", "Next",
"Back") are ones the page would be WRONG to spell differently on this screen than
on every other. The two clauses that were kept are the load-bearing ones: no
dash, and present in a view source. The reason is written in the code.

### 5.4 `SETUP_SOURCES` is its own list, not two more `VIEW_SOURCES` entries

`test/design.test.cjs` pins `VIEW_SOURCES` by name and is not in A4's custody.
`assertSetupBinding` reads `setup-app.mjs`, `setup-model.mjs` and `today-app.cjs`
itself and binds them just as tightly. Recorded so the next editor of
`design.test.cjs` can fold them in.

---

## 6. H3 - A NEW ENGINE-TIER FINDING, executed

**The accepted engine cannot paint Today for a clean-init athlete.**

```
> node -e "const {createCleanInitState}=require('./rebuild/m4/workout/athlete-state.cjs'); ..."
false false false
v,athlete_label,priority_muscles,reads,dailyLogs,sessionLog,exercises,exOrder,
sleep,targets,plan,queue,feed,weekly,events,proposals,agentProposals,adjustments,
forecasts,accepted,retirements,split
```

`createCleanInitState` writes no `blackout` member (nor `phase`, nor `rate`).
`rebuild/engine/energy.cjs:370`:

```
function observedTDEE(s, opts) {
  if (daysUntil(s.blackout.until) > 0) return null;
```

dereferences `s.blackout.until` unguarded, so the first paint throws:

```
TypeError: Cannot read properties of undefined (reading 'until')
    at observedTDEE (rebuild/engine/energy.cjs:370:28)
    at calorieTarget (rebuild/engine/energy.cjs:685:14)
    at energyBalanceTargetUncached (rebuild/engine/energy.cjs:578:15)
    at nowModelUncached (rebuild/engine/today.cjs:514:14)
```

This is why `boot()` does NOT hand the first-run athlete to `createTodayModel` as
its basis (5.1), and why S19 is PARTIAL. It is an engine-tier change and A4 has
no engine custody (`BUILD-BRIEF` section 6 says to STOP and hand it on).

It is EXECUTED and pinned by a test, `H3 - the accepted engine still cannot paint
Today for a clean-init athlete`, which goes green by asserting the gap and turns
RED the day it is closed - which is the day the wiring can land.

**REQUESTS line for the PM (A4 cannot write `rebuild/lanes/REQUESTS.md`, which is
outside its custody):**

> `C -> PM/B · RULING NEEDED (register item H3, engine tier, beside H1 and H2):
> rebuild/m4/workout/athlete-state.cjs createCleanInitState writes no `blackout`
> member, and rebuild/engine/energy.cjs:370 observedTDEE dereferences
> s.blackout.until unguarded, so nowModel/calorieTarget THROW on a clean-init
> athlete and Today cannot be painted for Dad from his own first-run state. A4
> therefore leaves Today on the fixture basis and reads the athlete back through
> setup.athleteState() only; the gap is executed by a test in
> rebuild/m3/w7-preview/today/test/setup.test.mjs ("H3 - the accepted engine
> still cannot paint Today for a clean-init athlete"). Which: (a) the constructor
> gains a `blackout: {}` (or {until:null}) member - an m4/workout change, full
> gate; (b) energy.cjs guards the dereference - an engine change, full gate;
> (c) something else. Until it is closed, Dad's first run records his week but
> Today shows the synthetic fixture's plan.`

---

## 7. P1 - the no-dashes sweep - and what A4 deliberately did NOT do

`DECISIONS:117 (1)` sequences P1 FIRST, and gives P1 the build-time and
render-time U+2013/U+2014 refusal in `build.mjs` and the dash-normalised harvest
in `design.cjs`. A4 must not duplicate either.

It did not. What A4 added is scoped to A4's OWN copy:

- `design.cjs` `assertSetupBinding` refuses a dash in the first-run sentences,
  the first-run source files and the `t-setup` template section. Nothing in
  `build.mjs` scans the whole page for dashes; that is P1's hunk.
- S23b is written against the BEHAVIOUR (a term differing by a word must still
  fail under normalisation), not against an implementation, so it PASSES once
  P1's normalised harvest is present and would still be meaningful if it never
  arrived. M16 proves it bites.
- `setup-check.mjs`'s render-time scan is scoped to the six screens plus the one
  string A4 puts on Today (the tile). The merged A1/A2/A3 copy still carries
  "spike - damped in trend", the "- not wired yet" labels and the en-dashed
  calorie range; sweeping those is P1's item and A4 does not churn them. The
  first version of this check scanned all of Today and went red on exactly those
  three, which is the evidence that they are still there.

**REBASE STATUS: P1 had NOT merged when this branch was built.** `git fetch
origin` before the final push showed `origin/rebuild/t2-client-core` at the same
tip the branch was cut from (section 12). If P1 merges first, A4 rebases onto it,
keeps P1's mechanisms in the two shared files and re-runs the whole suite; the
report is amended with the rebase result.

---

## 8. PROVENANCE - section 2.8 kept true

Every one of the twenty rows has its own named subtest in
`test/setup.test.mjs` section 6, each asserting the citation is still true or the
INVENTED marking still stands. All twenty pass. The load-bearing ones:

- **The chips** are parsed OUT OF `rebuild/engine/seed.cjs` at TEST time and
  deep-equalled against the literal list in `setup-model.mjs`:
  `abs, back, biceps, calves, chest, delts, forearms, glutes, hams, quads,
  triceps`. If `seed.cjs` gains or loses a label upstream, the suite says so.
- **The gloss** ("delts (shoulders)", "abs (core)", "quads (front of thigh)",
  "hams (hamstrings)") is INVENTED and display-only; no stored `mg` contains a
  bracket, asserted.
- **The standard start** (3 sets, aim for 10 reps) is INVENTED, declared on
  screen under "Earned's standard start", pre-filled and changeable, and never
  read off `seed.cjs` (M19).
- **The standard step** (5 lb) is SOURCED to `migrate.cjs`; it is said on the
  field's own helper line BEFORE he leaves it, never pre-filled into the box, and
  repeated in the screen-6 summary as "jump: 5 lb, Earned's standard step".
- **Screen-2 copy** is the owner's own sentence, `DECISIONS:114 (4)`, verbatim:
  "Earned plans two kinds of day so far: upper body and lower body." The
  superseded wording is asserted absent.
- **`e.setup`** is NOT supplied (`DECISIONS:117 (2)`, option ii): no exercise
  carries the member, the contract still has eight, and the flow collects no
  machine-setup cue.
- **No number the flow supplies beyond the two declared standards**, asserted per
  text node on all six screens.

Nothing was added to the six screens that is not already a row in section 2.8.

---

## 9. NEW PREVIEW-OWNED COPY - every entry justified

The approved 2026-09-08 design has no first-run screen, so all of it is
preview-owned. It lives in ONE place, `setup-model.mjs` `COPY` / `VALIDATION` /
`REFUSAL_SENTENCES`, which `design.cjs` harvests. Categories:

| category | justification |
|---|---|
| the six heads and leads | the questions themselves; there is no approved screen to take them from. Each is the `BRIEF.md` section 3 wording, dash-swept |
| `screen2Kinds` | the owner's own sentence, `DECISIONS:114 (4)` |
| `standardHead` / `standardBody` / `setsLabel` / `hiLabel` | `DECISIONS:114 (2)`: Earned PROPOSES a named standard start |
| `screen3NoLoad` / `screen6NoLoad` | the no-starting-load design (`BRIEF.md` section 5), said where he would otherwise be surprised |
| `screen4Hint` / `firstLabel` / `incLabel` / `rungsSummary` / `rungsLabel` | the equipment screen; `progression.cjs`'s own rung input, in plain words |
| `screen5Honest` | the honest line: `priority_muscles` is consumed by no reader (`athlete-state.cjs:150-153`), so the screen promises nothing |
| the five `VALIDATION` sentences | verbatim from `BRIEF.md` sections 3 and 6 |
| the seven `MISSING` templates + `refusalHead` | the named refusal, one line per unknown, each tappable back |
| `REFUSAL_SENTENCES` (5) | one per `CLEAN_INIT_*` code the constructor can throw (S3) |
| `next` / `back` / `skip` / `start` / `addExercise` / `removeExercise` / `somethingElse` / `restWord` / `repsWord` / `jumpWord` / `unknownWord` / `setupEntry` | the flow's own controls and summary words |
| `saveRefused` / `alreadyRecorded` | the two things the layer can answer that the prototype (which records nothing) can never say |

Not one of them carries U+2014 or U+2013.

---

## 10. THE SERVED SCREENS - for the owner's look

```
> node rebuild/m3/w7-preview/today/build.mjs
A1 TODAY BUILD PASS: 3 assets; 98 pinned inputs ...
> node rebuild/m3/w7-preview/today/serve.mjs
A1 TODAY at http://127.0.0.1:4178/ - approved design, real engine, durable local
record on this origin. Synthetic athlete; no account and no network.
```

Server node process **pid 48704**, still running, bound to 127.0.0.1 only.
Confirmed with a real fetch:

```
> node -e "fetch('http://127.0.0.1:4178/?screen=setup')..."
STATUS 200 CT text/html; charset=utf-8 BYTES 20961
CSP default-src 'none'; script-src 'self'; style-src 'self'; fon...
HAS t-setup: true | HAS setup-entry: true
```

- **The six screens:** `http://127.0.0.1:4178/?screen=setup`
- **Today with the first-run tile:** `http://127.0.0.1:4178/`

The page keeps a durable local record on that origin, so a browser profile that
has already finished the flow will show Today with the tile gone and
`?screen=setup` landing on Today; that is S13 working. A private window, or
clearing this origin's site data, starts fresh.

---

## 11. RESIDUALS and NOT RUN

Stated plainly. Nothing here is claimed as done.

### NOT RUN

| what | why |
|---|---|
| **S22, the hand test** | `HAND-TEST.md` is a human run on a person who has not seen the app. It is the reviewer's (`BUILD-BRIEF` 4.1) and it is NOT substitutable by the suite |
| **`run-current-head.cjs --all`** | the harness takes a RETAINED R1 REPOSITORY PATH as its first argument (`Usage: node test/run-current-head.cjs <retained-R1-repo> [--all]`); `--all` alone is read as that path and `git archive` fails. This worktree has no retained R1 repository. `DECISIONS:106` already records this harness at 462/464 with a known staging-scope defect and notes "CI does not run that harness". The W6 suite it wraps was run directly: **552/552** |
| **CI both OS** | the branch has not been pushed to GitHub at the time of writing this section; it is pushed at the end of section 12 and the run is the integrator's to read |
| **any phone run** | A5's `SLICE_NETLIFY_SITE_ID` is in place (`DECISIONS:114`) but no deploy was triggered by A4 and no iPhone run was attempted |

### RESIDUALS carried on A4's ledger line

1. **CI**: the new `test/setup.test.mjs` (and `setup-check.mjs`) are NOT yet in
   the enumerated `rebuild.yml` step (line 89, five files). A4 cannot add it:
   `DECISIONS:112` makes `rebuild.yml` editable only inside an engine package
   that re-pins it, and `:117 (4)` puts A4's step inside the B-NTC seal
   ("setup.test.mjs enumerated in the today step only if it exists on the tip
   when B-NTC seals, else it rides B1's re-seal"). So "CI green both OS" on this
   branch means the FIVE enumerated today files plus every other pinned step stay
   green, which is genuine and required, and **A4's own suite does not run in CI
   until the B-NTC re-seal**. REQUESTS line for lane B:
   > `C -> B · B-NTC's rebuild.yml enumeration (DECISIONS:109/:112) must include
   > rebuild/m3/w7-preview/today/test/setup.test.mjs alongside checkin.test.mjs
   > (and rebuild/coach/test per :117 (4)) - A4 cannot add its own step.`
2. **`e.setup` (register item H2)**: A4 ships without it, per `:117 (2)` option
   (ii). The latent case stands: `plan.cjs:123`'s heal branch requires
   `_bornValid(e)`, which a setup-less lift can never satisfy, so a future writer
   of `retirements["invalid:..."]` would strand that lift. B3/B4 may not
   introduce such a writer without closing H2 first.
3. **H3 (NEW, section 6)**: the accepted engine throws on a clean-init athlete.
   Until it is closed, Dad's first run records his week but Today shows the
   synthetic fixture's plan. S19 is PARTIAL because of it.
4. **The per-exercise rep target**: lane B's engine question
   (`DECISIONS:114 (2)`, `:117 (5)`). A4 ships ONE named standard. A yes flips a
   table, not the design: the chip row moves from the shared block into the
   exercise row and `setup-model.mjs` stops broadcasting one `hi`.
5. **The `basisState` key is `today`-only** (section 5.2). Tightening it to the
   brief's `hosts AND today` needs one line in `gym-check.mjs`, outside A4's
   licence.
6. **The landing screen** (section 5.1): setup is reached from the tile and from
   `?screen=setup`, not as the landing screen. Closing this properly is H3.
7. **`VIEW_SOURCES` in `test/design.test.cjs`** does not name the two setup view
   files (section 5.4); `assertSetupBinding` binds them itself.
8. **The `19` w7-preview child** is scheduled for retirement inside the B-NTC
   seal (`DECISIONS:109`, `:112` PASS-19 RETIREMENT). It had not merged when this
   was written, so 19 is reported.

9. **H6, lane B's own hunk in the SAME file** (`REQUESTS.md` 2026-09-11 19:15 ET,
   `B -> C`): B-NTC's bind-window wiring lands in
   `rebuild/m3/w6/local/today-bindings.mjs` on `rebuild/lane-b-ntc @ 3acc805`,
   about 25 lines around the gym host's `genSession` / `readPrevious` calls.
   A4's `createSetupHost` lands in the same file, in a different place (a new
   function after `createCheckInHost`, plus one name in the returned object), so
   the two should not textually conflict. **Whichever merges second rebases**;
   lane B has said it will re-run lane C's counts at every rebase.
10. **Lane B's answer to the per-exercise question arrived after the build**
    (`REQUESTS.md` 2026-09-11 19:15 ET): the engine takes both `sets` and `hi`
    per exercise as REQUIRED members, and there is NO defensible standard by
    exercise class, so lane B's recommendation is exactly what A4 shipped: ONE
    standard for all lifts at setup, marked invented and changeable. Lane B also
    notes that 3 sets x 2 lifts per muscle on a 2-day U/L split is 6 sets a week,
    which is `constants.cjs:327` VOL_BANDS' floor, so a muscle with ONE lift at
    3 sets starts UNDER the floor and the engine will say so. That is an engine
    statement about his week, not a first-run number, and A4 changes nothing for
    it; recorded so the reviewer can see it was read.

---

## 12. REBASE, COMMITS AND PUSH

`git fetch origin` after the build showed `origin/rebuild/t2-client-core` had
moved from **5c6766e** to **9abe32e** ("lane B: STATUS ... docs-only"). The diff
is two files, `rebuild/lanes/REQUESTS.md` and `rebuild/lanes/STATUS.md`, 5 added
lines, no code. **P1 had NOT merged.**

```
> git rebase origin/rebuild/t2-client-core
Rebasing (1/7)...(7/7)Successfully rebased and updated refs/heads/rebuild/lane-c-a4.
```

No conflicts, in the four licensed files or anywhere else. The whole suite was
re-run after the rebase (section 2's counts are the post-rebase run).

Commits on `rebuild/lane-c-a4`, in order:

| sha | what |
|---|---|
| `6568161` etc. | the three dad-first-run DOCS commits, cherry-picked from `rebuild/lane-c-dad` so the brief travels with the build |
| `b719c92` | the five setup modules and `createSetupHost` |
| `beec82a` | the four licensed page hunks plus the lane-C entry and the journey re-pin |
| `fc12511` | `test/setup.test.mjs`, 101 named subtests |
| `d40294d` | `setup-check.mjs`, scoped and made kill-proof |
| (this file) | the report |

Every commit carries
`Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` and
`Claude-Session: https://claude.ai/code/session_01FrVduwv2szRejKvJMZoA7b`.

---

## 13. WHAT THE REVIEWER SHOULD TRY FIRST

Told to disagree, the three claims most worth attacking:

1. **Section 5.2, the `basisState` key.** The brief asked for `hosts AND today`
   and got `today`, plus an enrolled-installation clause. Decide whether the
   second clause really covers the failure the brief names, or whether
   `gym-check.mjs` should simply be fixed.
2. **Section 5.1 and H3.** Dad finishes the six screens and lands on a Today that
   is standing on the SYNTHETIC FIXTURE'S plan, not his. The record is right; the
   paint is not. Decide whether A4 may merge with that open, or whether H3 must
   close first.
3. **S19.** It is reported PARTIAL for exactly that reason, and it is the check
   the brief describes as "a fake dashboard greets a brand-new athlete". Judge
   whether "the A1 page's own honest empty states over the fixture" is honest
   enough for a man who has just told Earned what he does.

Verdict file: `rebuild/lanes/c/dad-first-run/A4-REVIEW.md`.
