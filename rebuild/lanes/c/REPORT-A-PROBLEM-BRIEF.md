# BRIEF - "REPORT A PROBLEM" ON TODAY (screens tier, small)

Authority `DECISIONS:140` (queued ahead of the 09-13 shakedown: "a screens-tier report a problem control on
Today that copies a diagnostic (screen, state, no health numbers) for the owner to paste into the PM chat").
Tier screens: ONE independent Opus reviewer + CI green both OS. Build **after A4b merges**, under
one-Today-build-at-a-time (`:116 (5)`). Base `7f35e90af4da6a4c23aaa469a6e656765764441b`.

EFFORT (`:119 (5)`): **builder MEDIUM**, **reviewer HIGH**, **integrator LOW**. This brief HIGH.

## 0. READ-LIST

`DECISIONS.md` 140, 135, 116 (5), 111 (the device id), 114 (1) (no dashes), 101 (A5's build-hash precedent) ·
`rebuild/m3/w7-preview/today/today-app.cjs` (the tile and render pattern, `:481-510`; `plainOrDrop` at every
slot, `:24`, `:206`), `plain-copy.cjs`, `screens.template.html`, `design.cjs`, `build.mjs:58` and `:190`
(`REQUIRED_INPUTS`, the pinned input inventory) · `rebuild/slice/A5-REPORT.md:524-528` (no real iPhone has
run this build) · `rebuild/lanes/c/C3-HAND-PROOF.md` (hand-test style).

## 1. CUSTODY

**ADDS** `rebuild/m3/w7-preview/today/problem-report.cjs` (the pure diagnostic builder) and
`test/problem.test.mjs`. **EDITS**, under the standing licence (`:135 (1)`): `today-app.cjs`,
`screens.template.html`, `design.cjs`, `build.mjs`. **OUT**: engine, client, m4, `.github`, and every other
lane's files. No new store, no new op: **the control writes nothing durable.**

## 2. WHAT IT COPIES, AND WHAT IT NEVER COPIES

`buildProblemReport(state)` is a pure function returning one plain-text block. Exactly these fields:

| field | value | source |
|---|---|---|
| screen | the screen id the athlete is on (`today`, `gym`, `recovery`, `setup`, ...) | `today-app.cjs` router, `:455`, `:558` |
| lane open | which lane is mounted, or none | the boot return's `workout` / `checkin` / `setup` handles |
| enrolment | one of `first-run`, `enrolled`, `restore-required`, `no-store` | `today-entry.mjs` boot (`RESTORE_REQUIRED`, the failures list) |
| offline-ready | the A5 preflight's own answer, or `unknown` | `rebuild/slice/pwa` preflight |
| build | `earned-<first 12 hex of the build id>` where the build id is sha256 over the pinned input inventory (path + per-file sha) | `build.mjs:58` `REQUIRED_INPUTS`, `:190`; the precedent is A5's cache name = sha256 over the precache manifest (`DECISIONS:101`). **INVENTED**: the 12-char truncation |
| device | `device-<first 8 hex>` of this installation's id, or `none` | `DECISIONS:111` (device id minted only on first run). **INVENTED**: the 8-char truncation |
| user agent | `navigator.userAgent` verbatim | the platform |
| at | the local ISO date and time, with the UTC offset | the same triple the ops carry (`local_date`, `local_time`, `utc_offset`) |

**NEVER copied, asserted by test, not by promise**: any weight, any calorie or protein figure, any reading,
any check-in answer, any set, load or rep, any exercise name, the athlete's own name, any operation id, any
op payload, any lease or key material, and the full 32-hex device id.

**The device id, decided (`:135 (1)`) and justified.** The first 8 hex ARE included: they are not health
data, they carry no name and no value, and without them two devices in the same pair of hands produce
indistinguishable reports, which is the one thing a bug report has to tell apart. The remaining 24 are NOT
included: the full id is this installation's enrolment identity, it buys nothing for a bug report, and the
smallest thing that works is the right thing to paste. `none` when no store is open, never a fabricated id.

## 3. THE CONTROL

A secondary control on Today, in the approved vocabulary, reading **"Report a problem"** (copy to be pinned
by the reviewer from `design.cjs`'s harvest before the run). On tap:

1. Build the report. 2. Try `navigator.clipboard.writeText`. 3. On success show, through `plainOrDrop`,
**"Copied. Paste it to Joe."** 4. On failure OR where the API is absent, show the same block in a
**selectable, pre-selected text box** with **"Select all and copy, then paste it to Joe."**

**The fallback is UNCONDITIONAL, not a polyfill.** Whether `navigator.clipboard.writeText` succeeds inside
an installed iOS Home Screen app is **NOT VERIFIABLE FROM THIS REPOSITORY**: no real iPhone has run this
build at all (`A5-REPORT.md:524-528`), and the platform rules (secure context, a user gesture) are external
knowledge this brief does not assert as a result. So the box is always reachable, the copy path is an
enhancement, and hand-test row 3 decides what iOS actually does. Nothing about the control depends on the
answer.

## 4. ACCEPTANCE BAR

New tests: `test/problem.test.mjs` **>= 16 subtests**, plus one browser check row in the existing
`browser-check.mjs`. Written RED first against a stub returning `""`.

| id | check |
|---|---|
| R1 | The report contains exactly the eight fields of section 2, in that order, for every combination of screen x enrolment x lane the page can reach |
| R2 | **The leak test**: build a report on a store holding a weigh-in, a finished workout, a check-in and a completed first run; assert the text contains none of the stored values, no exercise name, no athlete label, no op id and no 32-hex string. Driven from the REAL local-era store, not a fixture |
| R3 | The build id is the sha256 over the pinned input inventory, recomputed independently in the test; a changed pinned input changes it |
| R4 | The device id appears as exactly 8 hex after `device-`, or `none`; a 32-hex string anywhere in the report fails |
| R5 | Enrolment reports `restore-required` on a state-18 boot, `no-store` with no store, `first-run` before the setup op and `enrolled` after it |
| R6 | The control writes nothing: operation count before and after is identical, in every state |
| R7 | Clipboard success shows "Copied. Paste it to Joe."; clipboard absence and clipboard rejection both show the selectable box with its own sentence and the full text |
| R8 | The box's text is selectable and pre-selected, and the report is the same string the clipboard path would have written |
| R9 | No dashes: the control, both confirmations and the report block itself carry zero U+2013/U+2014, through `plain-copy.cjs`; the build refuses a dash planted in a new string |
| R10 | Design fidelity: every class is a selector in the approved stylesheets and every static sentence is harvested, the build refusing an omission, as A3 and A4 already do |
| R11 | 390x844 and 320px with the box open: `scrollWidth <= clientWidth`; the control >= 44px; the box's font >= 16px; Today's single primary action is unmoved |
| R12 | Zero regressions, counts executed on this base: today **64** (adapter 20 + view 23 + design 11 + package 10), copy **36**, gym **64**, checkin **28**, setup **104**, ntc-h6-delta **8**, A0 host **31**, W6 **552**, `--ci` **PASS**, `build.mjs` **PASS** |

**Mutants**: E1 include the athlete label (R2) · E2 include the last reading (R2) · E3 print the full
32-hex device id (R4) · E4 write an op when the control is tapped (R6) · E5 show "Copied" when the clipboard
threw (R7) · E6 drop the fallback box when the API is absent (R7) · E7 hard-code the build id (R3) · E8 put
an em dash in a confirmation (R9).

**CI residual**: `problem.test.mjs` is not in `rebuild.yml`'s enumerated today step and `.github` is
editable only inside a re-pinning engine package (`DECISIONS:112`); it rides the next re-seal with the
setup and copy suites. CI green on the branch means every pinned step stays green.

**Hand test** (3 rows, C3 style, on the owner's iPhone): row 1, tap it on Today and paste into the PM chat:
does it contain anything about your body? row 2, do it again from the gym card mid-set: does the screen and
lane read right, and did the set survive? row 3, does the clipboard actually copy in the installed app, or
did you get the box? Each PASS / FAIL / SEE.

## 5. OPEN QUESTIONS (REQUESTS-ready)

1. `C -> PM · DISCLOSURE (:135 (1)): the diagnostic includes device-<first 8 hex> and build-<first 12 hex of the sha256 over the pinned input inventory>, and NO health value, op id, exercise name, athlete label or full 32-hex id. Object if you want the device prefix dropped entirely; otherwise it is decided.`
2. `C -> PM · "Copied. Paste it to Joe." is athlete-facing copy and names the owner. Confirm the wording for DAD's phone (he is pasting to Joe, not to a PM chat), or give the sentence you want.`
3. `C -> PM · This build waits behind A4b under :116 (5). Confirm it goes before N1 NUTRITION (:143), since :140 queues it ahead of the 09-13 shakedown.`
