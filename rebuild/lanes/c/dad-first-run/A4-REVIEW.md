# A4 - DAD FIRST-RUN SETUP SCREENS - INDEPENDENT REVIEW, ROUND 1

Reviewer: independent (author != reviewer), dispatched to DISAGREE. Every claim in
`A4-REPORT.md` was treated as a hypothesis and re-executed here; nothing below is
reported that this reviewer did not run itself on the owner's Windows PC.

| | |
|---|---|
| candidate | `rebuild/lane-c-a4` @ **308f983bac286f6caa7a489f178008a6092709f1** |
| base | **9abe32e** (`origin/rebuild/t2-client-core`) |
| reviewer worktree | `work/lane-c/review-a4`, detached at 308f983, `git status --short` empty at start and at end |
| the bar | `rebuild/lanes/c/dad-first-run/BUILD-BRIEF.md` S1-S25, mutants M1-M20, floor 58 subtests, custody section 1, persistence section 2, provenance section 2.8 |
| tier | screens (`DECISIONS:88`): one independent reviewer + CI green both OS |
| dependencies read | `BRIEF.md`, `dad-first-run-mock.html`, `A4-REPORT.md`, `DECISIONS.md` :88 :100 :102 :106 :111 :114 :115 :116 :117, `LANES.md`, `rebuild/slice/A3-REPORT.md` |

---

## VERDICT

**ACCEPT WITH CONDITIONS.**

The build is honest, the custody is clean, every count in the builder's report
reproduces exactly, all four real-browser checks pass with verified `taskkill /F /T`
kills, and eighteen mutants (thirteen of the brief's, five of this reviewer's own)
were all killed with every file restored byte-identical. Two things stop this being
a plain ACCEPT: the man who finishes the six screens is landed on another athlete's
numbers with nothing on screen saying so (S19, and the fix is inside A4's licence),
and the H3 hand-off text the builder wrote would send lane B to a fix that does not
work (this reviewer executed it).

### Conditions

**C1 - BLOCKING (before the owner look, not merely before merge). The landing Today
must say that the figures on it are not his.**
Executed: after the first run the page still boots `createTodayModel` on the
SYNTHETIC fixture (`today-model.cjs:79` `createBasisState` -> `fixtures.cjs`
`createSyntheticState`), and `browser-check.mjs` prints what that fixture paints:
"This morning (check) 179.4 lb". So a man who has just typed his real week taps
"Start using Earned" and is shown a stranger's weight trend with no sentence
distinguishing it from his own. That is S19's named silent failure verbatim: "a
fake dashboard greets a brand-new athlete". The engine cause (H3) is out of custody
and correctly handed on, but the CONSEQUENCE is not: `today-app.cjs` and the
first-run `COPY` are both inside A4's licence (`DECISIONS:117 (1)`), and A1 already
set the precedent by labelling its unwired entry points on Today's face.
Change: one preview-owned sentence, bound the way `setup-entry` already is, shown
only while `setup.summary().enrolled` is true and H3 is open, saying in Dad's words
that his week is recorded and the numbers on this screen are still the preview's
sample athlete. It must carry no U+2013/U+2014 and be harvested by
`assertSetupBinding` like every other first-run sentence.
Red-first test: `S19 - after the first run, the landing Today SAYS the figures on it
are not his yet` in `test/setup.test.mjs` (assert the sentence is absent before the
first run and present after it), plus one line in `setup-check.mjs` asserting it is
rendered on the Today the flow lands on. Both must be RED before the fix.

**C2 - BLOCKING. The H3 REQUESTS text is wrong and must be corrected before it goes
to the PM / lane B.** The builder's line offers "(a) the constructor gains a
`blackout: {}` (or `{until:null}`) member" or "(b) energy.cjs guards the
dereference". This reviewer executed both shapes. Neither closes it:
`blackout: {}` throws at `rebuild/engine/dates.cjs:8` (`mk(undefined)` via
`daysUntil`), and a valid `blackout: {until: "<iso>"}` moves the throw to
`rebuild/engine/energy.cjs:84` `bfEst`, which dereferences `s.model.anchorISO` -
`model` is also not a member `createCleanInitState` writes. The state paints only
once BOTH `blackout` and `model` are present (probe below, "PAINTS after 2 added
member(s)"). The corrected one-liner is in the H3 section of this file.
Red-first test: extend the existing `H3 - the accepted engine still cannot paint
Today for a clean-init athlete` to assert BOTH gaps by name (add `blackout` alone ->
still throws at `energy.cjs:84`), so that a partial engine fix cannot close the
register item silently.

**C3 - NON-BLOCKING. `setup-check.mjs` measures tap targets and input sizes on three
of the six screens, and the report claims six.** `inputsAreLargeEnough()` is called
for screens 1, 3 and 4 only; screens 2, 5 and 6 are never measured, yet the check's
own PASS line and report section 3 S12 both say "every screen". This reviewer added
the three missing calls, re-ran the real check on msedge, and it PASSED (exit 0) -
so this is a coverage gap, not a defect. Change: add the three calls; correct the
report sentence. Red-first test: delete a `.option` class on screen 5 so the chip
renders under 44px and confirm the check goes RED (it cannot today).

**C4 - NON-BLOCKING. Merge order.** `DECISIONS:117 (1)` sequences P1 FIRST and gives
P1 the build-time/render-time dash refusal in `build.mjs` and the dash-normalised
harvest in `design.cjs`. P1 has NOT merged: base 9abe32e carries neither. A4 built
its own scoped equivalents in `design.cjs` (correct under the circumstances, and
disclosed). Either A4 rebases onto P1's merge and keeps P1's mechanisms in the two
shared files, or the PM records the reversal of the sequence on A4's ledger line.

**C5 - NON-BLOCKING. Tell the owner what is P1's before he looks.** This reviewer's
own scan of the three BUILT assets found **71** U+2013/U+2014 occurrences across the
whole page, including `<title>Earned (em dash) Today</title>` in `dist/index.html:7`,
which is the browser tab the owner will be looking at. Zero of them are A4's (the
five setup sources, the `t-setup` section and all 92 harvested first-run strings are
clean). Say so in the owner-look note so the rule's residual is not read as A4's.

**C6 - NON-BLOCKING. S22, the hand test, is still owed.** `HAND-TEST.md` is a human
run on a person who has not seen the app. This reviewer is not a person and did not
perform it; it is not substitutable by the suite or by this file.

---

## Executed

Environment: this reviewer's own worktree, dependencies installed exactly as
`.github/workflows/rebuild.yml` does it (`npm ci --no-audit --no-fund --include=dev`,
then `pnpm@9 --dir rebuild/m3/w6 install --frozen-lockfile`, then
`pnpm@9 --dir rebuild/m3/w5 install --frozen-lockfile --ignore-scripts
--ignore-workspace`). `set "NODE_ENV="` before every command (this PC carries an
ambient `NODE_ENV=production`). Node v24.18.0.

| command | result |
|---|---|
| `git status --short` | empty (clean) at start and at end |
| `git diff --stat 9abe32e..308f983` | 19 files, 5794 insertions, 7 deletions |
| `git diff --numstat 9abe32e..308f983` | see Custody judgment |
| `node --test .../test/{adapter,view,design,package}` | **tests 64 / pass 64 / fail 0** |
| `node --test .../test/gym.test.mjs` | **tests 64 / pass 64 / fail 0** |
| `node --test .../test/checkin.test.mjs` | **tests 28 / pass 28 / fail 0** |
| `node --test .../test/setup.test.mjs` | **tests 101 / pass 101 / fail 0** |
| all SEVEN today files in one run | **tests 257 / pass 257 / fail 0** |
| `node --test "rebuild/m3/w6/test/*.test.mjs"` | **tests 552 / pass 552 / fail 0** |
| `node --test .../local-today-journey.test.mjs` | **tests 51 / pass 51 / fail 0** |
| `node --test rebuild/m3/w6/host/test/{journey,engine-equivalence}` | **tests 22 / pass 22 / fail 0** |
| `node --test "rebuild/m3/w7-preview/test/*.cjs"` | **tests 19 / pass 19 / fail 0** |
| `node rebuild/m4/spec/native-carriers-package.cjs --ci` | **PASS** ("NATIVE CARRIERS PUBLIC CI EVIDENCE PASS") |
| `node rebuild/m3/w7-preview/today/build.mjs` | **PASS** - "3 assets; **98 pinned inputs** (13 engine, 12 client); approved design pinned; 68 bound classes; 2 pinned typefaces inlined; no literal figure in the template; 3/3 assets scanned and free of any network reference" |
| `browser-check.mjs` on msedge | **PASS** - real kill on 8 msedge.exe, verified |
| `gym-check.mjs` on msedge | **PASS** - two training days, three real kills, 16 ops in one sealed generation |
| `checkin-check.mjs` on msedge | **PASS** - 3 real process kills |
| `setup-check.mjs` on msedge | **PASS** - 4 REAL PROCESS KILLS, one MID-FLOW, zero operations and no partial athlete after it |
| `certutil -hashfile` on the six added files | all six sha256 match `A4-REPORT.md` section 1.1 exactly, AFTER eighteen mutate/restore cycles |

Every count the builder reported is reproduced. `today 64` is still 64, `gym 64`
still 64, `checkin 28` still 28: **zero regressions**; A4 added a sixth today test
file rather than subtests to the existing five. `98` pinned inputs is `93` plus the
five `REQUIRED_INPUTS` lines, as reported.

### The kill in `setup-check.mjs` is real - read, not taken on trust

`chromeProcessesForProfile()` enumerates PIDs by `Get-CimInstance Win32_Process`
filtered to the check's own temp profile directory, `hardKill()` asserts
`pids.length > 0` ("the kill would prove nothing"), calls
`taskkill.exe /F /T /PID`, polls up to 10s and then asserts zero survivors, and only
afterwards attempts `context.close()` inside a try. `PROCESS_NAME` is derived from
`W7_BROWSER_BIN` rather than hard-coded to chrome.exe. The mid-flow kill happens
after `runFlow(page, 4)` - four screens answered - and the relaunch asserts
`/1 of 6/`, `doesNotMatch(/Chest press/)` and `opsInStore(...).rows === 0`. Verified
in the output this reviewer produced: "a real taskkill mid-flow left zero operations
and no partial athlete".

---

## Bar S1-S25

"suite" = a named subtest of `test/setup.test.mjs` that this reviewer ran (101 pass /
0 fail). "probe" = a script this reviewer wrote and ran. "browser" = this reviewer's
own msedge run of `setup-check.mjs`.

| id | verdict | THIS REVIEWER'S evidence |
|---|---|---|
| S1 | PASS | suite `S1 - every field lands EXACTLY: the whole document, deep-equal` and `S1 - the ACCEPTED constructor rebuilds the whole athlete from it, number for number`; independently, mutant M2 (one rung dropped) turned three subtests RED |
| S2 | PASS | suite `S2 - closed-contract fidelity: the document's keys ARE REQUIRED_SETUP, imported`; source: `setup-model.mjs:14-17` imports `REQUIRED_SETUP`/`REQUIRED_EXERCISE` from `athlete-state.cjs` and re-exports them, never retypes. M6 (ninth member) killed with 21 failures |
| S3 | PASS | suite `S3 - every CLEAN_INIT_* code ... has a screen sentence` enumerates the codes out of `athlete-state.cjs` at test time; `REFUSAL_SENTENCES` (`setup-model.mjs`) names exactly five |
| S4 | PASS | suite `S4 - an empty answer set builds NOTHING` + `S4 - ... the primary action is DISABLED and the refusal is named on screen`; source `setup-model.mjs` `document()` returns `{ok:false, setup:null}` and never calls the constructor while anything is missing |
| S5 | PASS | suite subtests 24-27; browser: `aria-pressed="true"` on exactly "3,10" on a fresh screen 3, `doesNotMatch(/not sure/i)`. Mutant M20 (chip toggles to null) killed by `S5 / M20` |
| S6 | PASS | suite `S6 / M4 - split.from is the LOCAL date at both ends of the day in UTC, New York and Auckland` (six child node processes with `TZ` set). Mutant M4 (UTC `toISOString`) killed. Reviewer mutant R5 (a future `split.from`) killed by four subtests |
| S7 | PASS | suite `S7 / M5 - REST is written EXPLICITLY`; mutant M5 (one weekday key omitted) killed with 23 failures |
| S8 | PASS | suite `S8 - exactly the declared supplied numbers ...` and `S8 - the two declared standards are the ONLY numbers ... and both are named`; reviewer's own owner-look render of all six screens shows only: the counter, 3/2/3/4, 10/6/8/10/12, "5 lb", and "20" (his own typed answer). Mutant M1 killed by S8 |
| S9 | PASS | probe: deleting the whole `<template id="t-setup">` from `screens.template.html` made the BUILD exit 1 with `A1 TODAY BUILD FAIL: SETUP-BINDING FAIL: the first-run screen is not in the shipped template`; restored, rebuild exit 0, `git status` clean. Harvest is by `design.setupVocabulary()` reading the module, not a retyped list |
| S10 | PASS | browser: no sideways scroll on any of the six screens at 390px, and none at 320px (`scrollWidth - clientWidth <= 0` measured on `.view`) |
| S11 | PASS (with a noted weakening) | browser: `reachable()` measured on all six. Screens 1 and 5 fit 842/842 unscrolled; 2 (1159px), 3 (1734px), 4 (1123px) and 6 (1093px) are forms whose length is his own answers and scroll, with the primary fully visible once scrolled to - the allowance the brief grants and the report names. NOTE: `reachable()` always calls `scrollIntoView` first, so the brief's stronger clause ("top edge inside the first 844px with no scrolling") is not separately asserted for the two screens that do fit |
| S12 | PASS (coverage gap, see C3) | browser, as shipped: measured on screens 1, 3, 4 only. This reviewer ADDED the three missing `inputsAreLargeEnough` calls (screens 2, 5, 6), re-ran the real check: **exit 0, PASS** - so all six really do meet >= 16px inputs and >= 44px targets. Restored; `git status` clean |
| S13 | PASS | probe `persist.mjs` over the real encrypted store: save 1 `{ok:true, op_id:...}`; save 2 (second tap) `SETUP_ALREADY_RECORDED`; a full RELAUNCH and the whole flow again -> `SETUP_ALREADY_RECORDED`; ops still 1. Browser: tile hidden, `?screen=setup` lands on Today, exactly one op after reload + new page + real kill. Reviewer mutant R1 (drop the enrolled() guard) killed by two S13 subtests |
| S14 | PASS | source `today-entry.mjs`: the setup lane is opened only inside `if (!restoreRequired)`, so `setup` stays null and `firstRun()` is false; with no store `enrolled` is initialised `true` (a page that cannot ask does not guess). suite subtests 51-52. Reviewer mutant R4 (`firstRun: () => !!host`) killed by `S13 / M9` and `S18 / S19` |
| S15 | PASS as narrowed; the brief's REASON is met (judgment below) | suite 53-55; mutant M10 (accept unkeyed) killed. Verified by grep that the shipped page calls `boot()` with no arguments (`today-entry.mjs:325`) and that `gym-check.mjs:360` and `:416` really do call `boot({today, basisState})` with no `hosts` |
| S16 | PASS | suite `S16 - back never loses an answer` and `S16 - changing one answer on screen 2 changes ONLY that answer`; source: `goto/next/back` touch only `screen`, never `answers` |
| S17 | PASS | probe: `GET http://127.0.0.1:4178/?screen=setup` returns CSP `default-src 'none'; script-src 'self'; style-src 'self'; font-src data:; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; worker-src 'none'`. Reviewer's own playwright walk of all six screens recorded **zero** off-origin requests. Build line: "3/3 assets scanned and free of any network reference" |
| S18 | PASS | browser (reviewer's run): mid-flow real kill -> zero ops, no partial athlete; after the write, a second real kill -> exactly one op and `label === "Dad"`. probe: one op with ONE outbox entry |
| S19 | **PARTIAL** | probe: the athlete IS read back from the record (`setup.athleteState()` builds it through the accepted constructor). But `boot()` still builds Today's model on the SYNTHETIC fixture, so the landing screen paints figures no reading of his produced, and nothing on it says so. This is C1 |
| S20 | PASS | suite `S20 - NO starting load is collected, anywhere, by design`; browser asserts `/starting (weight\|load)/i` absent on screen 4; reviewer's rendered screen 4 shows only "Lightest setting" and "Smallest jump up". Mutant M14 killed |
| S21 | PASS | suite 60-61; reviewer's rendered text of all six screens contains no countdown, no percentage, no "don't lose"; exactly one Skip, on screen 5. Mutant M13 ("almost there!") killed |
| S22 | **NOT RUN** | a human run. See C6 |
| S23 | PASS for A4's own scope | probe, this reviewer's own scanner: **0** U+2013/U+2014/`&mdash;`/`&ndash;`/`&#8212;`/`&#8211;`/`&#x2014;`/`&#x2013;` across the five setup sources and the `t-setup` template section; **0** across all **92** strings the setup screens can show (COPY, VALIDATION, MISSING, REFUSAL_SENTENCES, MG_GLOSS, DAY_KIND_WORDS, WEEKDAY_NAMES, the three standard lines, the counter, the gloss of every label); **0** in the reviewer's own rendered walk of all six screens. Mutant M15 (one em dash back in one sentence) turned the suite RED on three subtests AND turned the BUILD RED: `A1 TODAY BUILD FAIL: NO-DASH FAIL (DECISIONS:114 (1))`. Whole-page residual: see C5 |
| S23b | PASS | suite `S23b / M16 - the dash-normalised harvest, if present, must not weaken any other word`. Written against the property, not against P1's implementation, which is correct given P1 has not merged |
| S24 | PASS | probe: this reviewer listed EVERY import/require line in the five setup files. They are: `athlete-state.cjs` (m4/workout, licensed), `today-app.cjs`, `setup-model.mjs`, `gym-host.mjs`, `setup-commands.mjs`, node builtins and `playwright-core`. **Nothing under `rebuild/engine`.** The single grep "hit" is a COMMENT in `setup-model.mjs:23` naming seed.cjs as the provenance. `STANDARD_SETS = 3`, `STANDARD_HI = 10`, `STANDARD_INC = 5` are literals with the section-2.8 provenance beside them. For contrast, seed.cjs's own per-lift values are sets 4/3/2 and hi 15/12/10/20/9/13/14/8 - not read. Mutant M19 (add one `import Seed from '../../../engine/seed.cjs'`) killed by `S24 / M19 / H1` |
| S25 | PASS | probe: this reviewer parsed the distinct `mg` values out of `rebuild/engine/seed.cjs` itself - `abs, back, biceps, calves, chest, delts, forearms, glutes, hams, quads, triceps` (11) - and deep-equalled them against `MG_LABELS`: **EQUAL: true**, and equal to the brief's eleven. Gloss is display-only (`MG_GLOSS` = delts/abs/quads/hams) and the rendered chips read "delts (shoulders)" while the store holds "chest"/"quads" (probe: stored `mg=chest`). Free entry stores the typed text verbatim and `createCleanInitState` accepts it (probe: `pecs and front delts` built cleanly). No coarse seven-item list and no mapping table anywhere in the setup files or the template. Mutants M17, M18 and reviewer mutants R2, R3 all killed |

---

## Attacks / probes (all written and run by this reviewer)

**P-1. Persistence, dumped rather than asserted.** Over the real encrypted store
(`faultDatabase` + `webcrypto`): a fresh installation reports `enrolled false`; one
save succeeds; the generation then holds **ops total: 1**, `kind=fact class=event
profile=earned/first-run-setup/v1 date=2030-02-04`, **outbox entries: 1**. A second
`save()` in the same session and a THIRD after a full relaunch with a different
document both return `SETUP_ALREADY_RECORDED` and write nothing; the read-back by
profile still returns exactly one row with `athlete_label: "Dad"`. ONE op, ONE
generation, first run once.

**P-2. The setup lane really is the same lane.** Opening `openTodayHosts` over the
same installation and taking `createReadingHost` and `createCheckInHost` beside the
setup host: `reading.lease === checkin.lease` TRUE and `setup.lease === checkin.lease`
TRUE, lease id `local-era:c3150f9e...`, same `athleteId`/`deviceId`, same generation
read back. `createSetupHost` is on the era object beside the other three. Source
confirms it takes `{day, commands, profile}` exactly as `createCheckInHost` does, so
w6 never imports w7-preview, and `setupsIn()` is `checkInsIn()` narrowed by profile
equality with tombstone and rejected filtering.

**P-3. The dash scanner.** Written from scratch (both marks as code points, so this
probe cannot itself smuggle one). Scope 1 - A4's own: 0 hits. Scope 2 - every string
the screens can show: 92 scanned, 0 hits. Scope 3 - the whole built page: 71 hits,
none in A4's code. See C5.

**P-4. The engine re-derivation.** `MG_LABELS` re-derived from `seed.cjs` by this
reviewer's own regex: identical. Every import line in the five setup files listed:
no `rebuild/engine`.

**P-5. The S12 coverage attack.** Patched `setup-check.mjs` to measure screens 2, 5
and 6 as well; the real msedge check still passed (exit 0). Restored; clean.

**P-6. The S9 build attack.** Deleted the shipped `t-setup` template: build FAILED
closed with a named message. Restored; rebuild clean.

**P-7. The owner-look walk.** Drove the REAL served page at
`http://127.0.0.1:4178/?screen=setup` in msedge on a fresh 390x844 profile and
printed all six screens. All six exist; the counter reads "n of 6"; screen 2 carries
`Earned plans two kinds of day so far: upper body and lower body.` **verbatim**
(also confirmed byte-present in the served `app.js`, and the superseded "two kinds of
session so far" wording is absent); screen 3 shows "Earned's standard start / 3 sets,
aim for 10 reps." with 3 and 10 pre-selected; screen 4 shows "Leave the jump blank
and Earned uses 5 lb, its standard step."; screen 5 shows the eleven engine labels
with glosses; screen 6 reads the week back and offers one primary action. Zero
off-origin requests.

**P-8 / P-9. H3** - see the H3 section.

---

## Mutants - 18 killed / 0 survived / 0 skipped

Thirteen of the brief's twenty, plus five of this reviewer's own devising. Each was
applied to the real file, the suite (and for M15 the build) was run, the file was
restored and `git status --short` was asserted empty before the next one. All six
added files' sha256 match `A4-REPORT.md` section 1.1 after the whole run.

| # | mutation | result |
|---|---|---|
| M1 | the declared standard step stops being said on screen | KILLED, pass 100 fail 1 - `S8 - the two declared standards are the ONLY numbers the flow supplies, and both are named` |
| M2 | one rung dropped from a parsed uneven stack | KILLED, pass 98 fail 3 - `2.1 exercise.steps ...` + both `S1` subtests |
| M4 | `split.from` from the UTC day | KILLED, pass 100 fail 1 - `S6 / M4 - split.from is the LOCAL date at both ends of the day ...` |
| M5 | one weekday key omitted from `map` | KILLED, pass 78 fail 23 - `2.1 setup.split.map ...` |
| M6 | a ninth exercise member (`setup: ''`) sent to the constructor | KILLED, pass 80 fail 21 - `S1`, `2.1 w:null and forks:[] ...` |
| M10 | `boot({basisState})` accepted unkeyed | KILLED, pass 100 fail 1 - `S15 / M10 - boot({basisState}) ALONE throws SETUP_BASIS_STATE_REFUSED and paints nothing` |
| M13 | "almost there!" urgency in the masthead counter | KILLED, pass 99 fail 2 - `S21 - no streaks, no countdown, no urgency ...` |
| M14 | a starting-load field on screen 4 | KILLED, pass 100 fail 1 - `S20 - NO starting load is collected, anywhere, by design` |
| M15 | an em dash back in one screen sentence | KILLED, pass 97 fail 4 - `S23 (a) ...` AND the BUILD: exit 1, `A1 TODAY BUILD FAIL: NO-DASH FAIL (DECISIONS:114 (1))` |
| M17 | a chip stores its gloss instead of the engine label | KILLED, pass 96 fail 5 - `S25 / M17 - a chip STORES the bare engine label, never the gloss shown beside it` |
| M18 | a seven-group coarse list and a mapping added | KILLED, pass 100 fail 1 - `S25 / M18 - NO coarse-group vocabulary and NO mapping exists in any setup file` |
| M19 | the setup module imports `rebuild/engine/seed.cjs` | KILLED, pass 100 fail 1 - `S24 / M19 / H1 - no setup file imports, requires or reads anything under rebuild/engine` |
| M20 | the selected sets chip toggles back to null | KILLED, pass 100 fail 1 - `S5 / M20 - tapping the SELECTED standard chip again leaves the value exactly where it is` |
| **R1** | REVIEWER: drop the `enrolled()` guard in `createSetupHost.save()` so the write stops being first-run-only | KILLED, pass 99 fail 2 - `S13 - a SECOND "Start using Earned" finds the op that is there and writes nothing`, `S13 - a SECOND TAB ...` |
| **R2** | REVIEWER: drop the free-entry path (`setMgOther` stores nothing) | KILLED, pass 59 fail 42 |
| **R3** | REVIEWER: the gloss becomes the STORED value at DOCUMENT time (not at chip time, which is M17) | KILLED, pass 96 fail 5 - `S25 / M17 ...`, `2.1 exercise.mg ...` |
| **R4** | REVIEWER: `firstRun()` stops consulting the record, so setup is offered on an installation already set up | KILLED, pass 99 fail 2 - `S13 / M9 - once the record holds a first run, the setup ROUTE refuses and the tile is gone` |
| **R5** | REVIEWER: `split.from` written as a future date the first gym visit would refuse | KILLED, pass 97 fail 4 - `2.1 setup.split.from - today's local ISO date, and no start date is ever offered` |

Not attempted by this reviewer (the builder reports all twenty killed; these seven
were taken on the builder's evidence plus the mechanism this reviewer did verify):
M3, M7, M8, M9, M11 (the build mechanism WAS verified by P-6), M12, M16. M9 and M11
are covered indirectly by R4 and P-6.

---

## Custody judgment

`git diff --numstat 9abe32e..308f983`, all 19 paths:

```
666  0  rebuild/lanes/c/dad-first-run/A4-REPORT.md
523  0  rebuild/lanes/c/dad-first-run/BRIEF.md
523  0  rebuild/lanes/c/dad-first-run/BUILD-BRIEF.md
139  0  rebuild/lanes/c/dad-first-run/HAND-TEST.md
324  0  rebuild/lanes/c/dad-first-run/REPORT.md
507  0  rebuild/lanes/c/dad-first-run/dad-first-run-mock.html
 85  1  rebuild/m3/w6/local/today-bindings.mjs
  5  1  rebuild/m3/w6/test/local-today-journey.test.mjs
 10  0  rebuild/m3/w7-preview/today/build.mjs
102  1  rebuild/m3/w7-preview/today/design.cjs
 35  0  rebuild/m3/w7-preview/today/screens.template.html
338  0  rebuild/m3/w7-preview/today/setup-app.mjs
439  0  rebuild/m3/w7-preview/today/setup-check.mjs
 83  0  rebuild/m3/w7-preview/today/setup-commands.mjs
 34  0  rebuild/m3/w7-preview/today/setup-host.mjs
456  0  rebuild/m3/w7-preview/today/setup-model.mjs
1339 0  rebuild/m3/w7-preview/today/test/setup.test.mjs
 65  2  rebuild/m3/w7-preview/today/today-app.cjs
121  2  rebuild/m3/w7-preview/today/today-entry.mjs
```

**CLEAN.** Nothing under `rebuild/engine`, `rebuild/client`, `rebuild/conform`,
`rebuild/m4/**`, `rebuild/m3/w6/host`, `.github`, `src` or `ledger`. `preview.css`
(licensed but unused) is byte-unchanged.

**The two disclosed files, judged.**

1. **`today-entry.mjs`** - `DECISIONS:117 (1)` names four files plus
`createSetupHost`, and does not name this one. **WITHIN LICENCE.** `:111` is the line
that exercised `:106 (b)` and it names `today-entry.mjs` first among the four
one-store wrapper files; `BUILD-BRIEF` section 1.2 licenses it explicitly on that
basis. The edit is what `:102` itself demanded of A4 ("boot({basisState}) injection
point (harness-only; key or refuse before Dad's A4"), and S15 cannot be built
anywhere else because `boot()` lives here. Read hunk by hunk: four additions, all
additive, the `hosts || openTodayHosts` default branch byte-unchanged.

2. **`rebuild/m3/w6/test/local-today-journey.test.mjs`** - 5 added, 1 removed: the
`PAGE_PINS['today-entry.mjs']` sha re-pinned `5fc40e1e...` -> `328be615...` plus a
four-line comment giving the reason. **WITHIN LICENCE.** `rebuild/m3/w6/test/**` is
lane C custody (`:106`), the pin's own failure message instructs the editor to
re-read against `today-bindings.mjs` and re-pin, and the other three pins
(`gym-host`, `reading-host`, `checkin-host`) are untouched - which is the check that
the wrapper files really were not disturbed. The journey suite is 51/51 green here.

3. **`today-bindings.mjs`** - lane C exclusive (`LANES.md`, `:111`). 85 added lines
are one new `createSetupHost` function placed after `createCheckInHost`; the single
edited line is the returned object gaining one comma-separated name. No existing
export's bytes change.

**One immaterial deviation, disclosed by the builder and confirmed here:**
`BUILD-BRIEF` 1.1 names `setup-model.cjs` and `setup-commands.cjs`; the shipped files
are `.mjs`. The dispatch's own custody line says `.mjs`, `:102` moved this directory
to `.mjs`, and every consumer is ESM. Accepted; no condition.

---

## The `basisState` key (BUILD-BRIEF 2.6 vs A4-REPORT 5.2) - judged

The brief asked for "honoured ONLY when the caller also supplies its own `hosts` AND
its own `today`". What shipped is `today` plus a second clause: a foreign
`basisState` over an installation that ALREADY carries a first-run operation is
refused unless the caller brought its own `hosts`.

**Verified, not taken on trust:** `gym-check.mjs:360` and `:416` really do call
`mod.boot({ today: day, basisState: fresh })` from inside the page with no `hosts`,
so requiring `hosts` would turn a MERGED check RED in a file outside A4's licence.
And the shipped page really does call `boot()` with no arguments at all
(`today-entry.mjs:325`, byte-unchanged).

**Judgment: the brief's stated REASON is met, and no real attacker path exists.**
The reason the brief gives is that "an unkeyed `basisState` would let any caller
paint a foreign athlete's week over a real device's store". A store is a *real
device's* store once it carries a first-run operation, and that is precisely the
case the second clause refuses. Before enrolment there is no athlete of record to
paint over. `basisState` is also read-only: it feeds `createTodayModel`, it writes
nothing, so the worst residual is a transient paint on a not-yet-enrolled device by
a caller that already executes JavaScript on this origin - at which point the key is
not the control that matters. **Residual, recorded not blocking:** the narrowed key
is one line in `gym-check.mjs` away from the brief's exact wording, and that file is
outside A4's licence; the PM may close it in a `today/**` polish item.

---

## H3 judgment

### Reproduced, independently

`createCleanInitState` returns a **non-extensible** object with 22 members:
`v, athlete_label, priority_muscles, reads, dailyLogs, sessionLog, exercises,
exOrder, sleep, targets, plan, queue, feed, weekly, events, proposals,
agentProposals, adjustments, forecasts, accepted, retirements, split`. It has no
`blackout`, no `model`, no `phase`, no `rate`. Handing it to the page's OWN engine
composition (`today-engine.cjs` -> `browser-engine.cjs` + `writers.cjs`, the same
composition Today paints with):

```
*** H3 REPRODUCED ***
TypeError: Cannot read properties of undefined (reading 'until')
    at observedTDEE (rebuild\engine\energy.cjs:370:28)
    at calorieTarget (rebuild\engine\energy.cjs:685:14)
    at energyBalanceTargetUncached (rebuild\engine\energy.cjs:578:15)
    at Object.energyBalanceTarget (rebuild\engine\energy.cjs:681:94)
    at energyBalanceTarget (rebuild\engine\today.cjs:19:44)
```

`rebuild/engine/energy.cjs:370` is `if (daysUntil(s.blackout.until) > 0) return null;`
Confirmed by reading the line. The builder's finding is REAL and it is ENGINE TIER:
the two files that can close it are `rebuild/engine/energy.cjs` and
`rebuild/m4/workout/athlete-state.cjs`, and BOTH are out of every screens-tier lane's
custody (`BUILD-BRIEF` 1.3, `DECISIONS:88`). The builder stopped and handed it on,
which is exactly what `BUILD-BRIEF` section 6 instructs.

### But the builder's finding is INCOMPLETE, and its hand-off would misdirect lane B

This reviewer patched the STATE (never the engine) one throw at a time:

```
createCleanInitState members (22): v,athlete_label,...,split
blackout={}                              -> THROWS ... 'split'   at mk (rebuild\engine\dates.cjs:8)
blackout={until:"2020-01-01"}            -> THROWS ... 'anchorISO' at bfEst (rebuild\engine\energy.cjs:84)
blackout + model                         -> PAINTS after 2 added member(s)
members the engine needed that createCleanInitState does not write: blackout, model
```

Three consequences the hand-off must carry:
1. `blackout: {}` - one of the two shapes the builder's own REQUESTS line offers -
   **does not work**: `daysUntil(undefined)` throws in `dates.cjs:8`. It must be
   `{ until: <ISO string> }`.
2. `blackout` alone is **not enough**: `bfEst` at `energy.cjs:84` needs `s.model`.
3. Guarding `energy.cjs:370` alone is worse than it looks: this reviewer counted
   further UNGUARDED `s.blackout.until` reads at `sleep.cjs:358`, `sleep.cjs:1913`
   (`blackoutOn`, which `writers.cjs` calls throughout) and `writers.cjs:427`, `:917`,
   `:1694`, while `today.cjs:228/:282/:409` ARE guarded. `policy.cjs:108` already
   documents the class of defect in a comment. So the honest minimal fix is the
   CONSTRUCTOR gaining the two members, not a guard in one engine reader - and that
   is a `rebuild/m4/workout` change, full gate.

### Is it BLOCKING for A4?

**No for the engine half; YES for its consequence on Dad's screen (C1).**

The brief's own section 6 tells the build to stop and write a REQUESTS line when it
needs an engine change, and `:117 (2)` set the precedent for shipping A4 with a
recorded engine-tier register item (H2, `e.setup`). The engine defect is therefore a
legitimate residual: "Dad completes setup and his answers are durably recorded, but
Today cannot yet be painted from them" is acceptable to merge behind a recorded
residual, with S19 PARTIAL.

What is NOT acceptable as it stands is the half of the consequence that IS inside
A4's custody. S19's stated silent failure is "a fake dashboard greets a brand-new
athlete", and today that is literally what happens: the landing Today is the
synthetic fixture's athlete, and the screens say nothing about it. `today-app.cjs`
and the first-run copy are both licensed to A4 (`:117 (1)`), so the honest sentence
costs one hunk. That is C1, and it matters most because the owner is about to LOOK at
these screens under `:116 (2)`.

### REQUESTS text the lane lead should send (one line, corrected)

> `C -> PM/B · RULING NEEDED (register item H3, engine tier, beside H1 and H2): rebuild/m4/workout/athlete-state.cjs createCleanInitState writes 22 members and neither `blackout` nor `model`, so the accepted engine THROWS on a clean-init athlete at rebuild/engine/energy.cjs:370 (observedTDEE, s.blackout.until) and then, once blackout is present, again at rebuild/engine/energy.cjs:84 (bfEst, s.model.anchorISO); the reviewer executed both and nowModel paints only when BOTH members are added, so `blackout: {}` is NOT a fix (daysUntil(undefined) throws at rebuild/engine/dates.cjs:8) and guarding energy.cjs:370 alone only moves the throw (sleep.cjs:358/:1913, writers.cjs:427/:917/:1694 are equally unguarded, while today.cjs:228/:282/:409 are guarded). MINIMAL FIX SHAPE: createCleanInitState gains `blackout: { until: <a past ISO date> }` and `model` with the members bfEst reads, both written by the constructor and closed by closed() - an m4/workout change, FULL GATE, in an engine package (the m4/workout package, not A4 and not any screens-tier lane). Until it closes, Dad's first run records his week and Today stands on the synthetic fixture; A4 carries S19 PARTIAL and a screen sentence saying so.`

---

## Residuals

Carried forward on A4's ledger line. 1-8 are the builder's, re-read and confirmed by
this reviewer; 9-11 are this reviewer's own.

1. **CI.** `test/setup.test.mjs` and `setup-check.mjs` are NOT in the enumerated
   `rebuild.yml` today step (line 89, five files). A4 cannot add it (`:112`, `:117
   (4)`): it rides the B-NTC seal. "CI green both OS" on this branch therefore means
   the five enumerated today files plus every other pinned step stay green - genuine
   and required - and A4's own suite does not run in CI until the re-seal. The
   REQUESTS line to lane B in the report is correct as written.
2. **`e.setup` (register item H2)** - shipped without, per `:117 (2)` option (ii).
3. **H3 (engine tier)** - see above; text corrected by C2.
4. **The per-exercise rep target** - lane B's engine question; A4 ships ONE named
   standard, which is what lane B recommended.
5. **The `basisState` key is `today`-only** plus the enrolled clause - judged
   acceptable above; one line in `gym-check.mjs` closes it.
6. **The landing screen is Today, not screen 1** - closing it properly is H3.
7. **`VIEW_SOURCES` in `test/design.test.cjs`** does not name the two setup view
   files; `assertSetupBinding` binds them itself.
8. **The `19` w7-preview child** is scheduled for retirement inside B-NTC; 19 is
   reported because it had not merged.
9. **REVIEWER: the built page carries 71 U+2013/U+2014**, including the page
   `<title>`. None are A4's. P1's item; C5 says tell the owner.
10. **REVIEWER: `setup-check.mjs` measures tap targets on 3 of 6 screens** (C3), and
    `reachable()` always scrolls first, so S11's stronger "no scrolling" clause is
    not separately asserted for the two screens that do fit (noted, not a condition).
11. **REVIEWER: P1 has not merged**, so A4's `design.cjs` carries its own scoped dash
    refusal rather than P1's page-wide one (C4).

---

## Not run

| what | why |
|---|---|
| **S22, the hand test** | a human run on a person who has not seen the app. This reviewer is not a person. C6 |
| **`run-current-head.cjs --all`** | the harness takes a RETAINED R1 REPOSITORY PATH as its first argument; this worktree has no retained R1 repository, and `:106` already records the harness at 462/464 with a known staging-scope defect and notes CI does not run it. The W6 suite it wraps was run directly: **552/552** |
| **CI both OS** | this reviewer does not push. The integrator reads the run on `rebuild/lane-c-a4` |
| **any phone run** | no deploy was triggered and no iPhone was used |
| **`A3-CHECKIN-REVIEW.md`** | not present on this tip (`rebuild/slice/` carries A0/A1/A2/A3/A5 REPORTs and the P1/P2 briefs only); the A3 bar was taken from `A3-REPORT.md` and `DECISIONS:107`/`:111` |
| **M3, M7, M8, M9, M11, M12, M16** | seven of the brief's twenty were not re-run by this reviewer; thirteen were, plus five of its own. M9 and M11's mechanisms were verified by R4 and by the build attack P-6 |

---

## OWNER LOOK: pending (PM)

The six screens are live and were driven end to end by this reviewer at
`http://127.0.0.1:4178/?screen=setup` (server pid 48704, the builder's, left
running). All six exist, the copy matches the amended mock and `DECISIONS:114/:115`,
and nothing off-origin is requested. The look itself is the PM's to conduct and
record under `DECISIONS:116 (2)`. This reviewer recommends C1 be fixed **before** it,
so that what the owner taps through does not end on another athlete's numbers.

---

Reviewer's own executed counts, for the ledger line: today 64 / gym 64 / checkin 28 /
**setup 101** / seven today files 257 / W6 552 / journey 51 / host 22 / w7 19 /
native-carriers --ci PASS / build PASS (98 pinned inputs) / browser-check + gym-check
+ checkin-check + setup-check PASS on msedge with verified real process kills /
mutants 18 killed 0 survived / worktree clean, six hashes byte-identical.
