# REPORT A PROBLEM - ANNEX

Everything the report is too short to hold. Branch `rebuild/lane-c-report`, base
`origin/rebuild/t2-client-core` @ 964f183.

## 1. CUSTODY, EXACTLY

    rebuild/m3/w7-preview/today/problem-report.cjs        NEW, the pure builder
    rebuild/m3/w7-preview/today/test/problem.test.mjs     NEW, 23 tests
    rebuild/m3/w7-preview/today/today-app.cjs             +101  the control
    rebuild/m3/w7-preview/today/screens.template.html     +13   the slots
    rebuild/m3/w7-preview/today/design.cjs                +9    three sentences declared
    rebuild/m3/w7-preview/today/build.mjs                 +46   the build id and injection
    rebuild/m3/w7-preview/today/preview.css               +19   44px target, box width
    rebuild/m3/w7-preview/today/browser-check.mjs         +53   the msedge row
    rebuild/lanes/c/REPORT-A-PROBLEM-REPORT*.md           this report

Nothing under `rebuild/m3/w6`, `rebuild/m4`, `rebuild/engine`, `rebuild/client`,
`rebuild/conform` or `.github`. `git diff --stat 964f183..HEAD` says the same.

## 2. THE FIELDS, AND WHERE EACH ONE REALLY COMES FROM

| field | value | read from |
|---|---|---|
| screen | the router's own id | `today-app.cjs` `screen`, the variable `render()` sets |
| lane open | `workout, checkin, setup` in boot's order, or `none` | which of `options.workout/checkin/setup` mountToday was given |
| enrolment | `first-run` / `enrolled` / `restore-required` / `no-store` | the setup entry's `summary()`, and the page's own status line for state 18 |
| offline-ready | `ready` / `not-ready` / `unknown` | `navigator.serviceWorker.controller`; this page registers no worker, so it reads `unknown`, which is the truth |
| build | `earned-` + 12 hex | sha256 over the pinned input inventory, injected by `build.mjs` |
| device | `device-` + 8 hex, or `none` | the installation's authority lease (`handle.lease.device_id`), truncated |
| user agent | verbatim, through `plainCopy` | `navigator.userAgent` |
| at | `YYYY-MM-DD HH:MM:SS +HH:MM` | the local clock, the same triple an op carries |

## 3. THE PINNED FILES, AND WHY TWO FIELDS ARE READ THE WAY THEY ARE

The brief sources `enrolment` and `device` from `today-entry.mjs` boot. That file cannot
be touched. `rebuild/m3/w6/test/local-today-journey.test.mjs` carries `PAGE_PINS`, which
sha-pins FOUR page files - `today-entry.mjs`, `gym-host.mjs`, `reading-host.mjs`,
`checkin-host.mjs` - and that suite is itself pinned on disk by the merged B-NTC
artifact (`packages/B-NTC.json`, checked twice by
`rebuild/conform/v4/postfix/legacy-gates.cjs:12-16`). A new `boot()` return member, or a
new `mountToday` option plumbed from boot, is a byte in `today-entry.mjs`: journey 51
goes red, the `durable-journeys` child of the B-NTC gate goes red, and CI with it. This
is the same pin class A4b hit and reported.

So both fields are read from what the view ALREADY holds, with no new argument:

- **device**: every open lane carries the generation's `authorityLease`
  (`today-bindings.mjs` puts it on the handle), and a lease names its device. The page
  takes `setup.host.lease.device_id`, then `workout.gymHost`, then the handle's own
  `deviceId`, and `problem-report.cjs` truncates it. The lease is there from the FIRST
  launch, before any operation exists, which an op's `device_id` would not be.
- **restore-required**: on a state-18 refusal `boot()` hands mountToday NO lanes at all
  and writes rebuild/client's own sentence on `#today-status`. That line is the only
  place the refusal reaches this view, so the control reads it at tap time. The two
  words it matches (`Restore required`) are DECLARED in `problem-report.cjs` and bound
  by a test that requires `rebuild/client/copy.cjs` and asserts the real sentence still
  starts with them - so an upstream rewording fails a test instead of drifting past it.

Both are strictly weaker than a boot member in one way, and it is stated rather than
hidden: a device with a store but no lanes at all cannot be told from a device with no
store. No such state exists today (boot opens the lanes or the era refused).

## 4. RED FIRST, EXECUTED

    buildProblemReport returns ""      tests 23 | pass 10 | fail 13
    restored                           tests 23 | pass 23 | fail 0

The thirteen that fell are every test that reads a field out of the block: R1 x3, R4 x1,
R9, R7 x3, R8, R6, R5 x2 and R2. The ten that stood are the pure-helper and binding
tests (devicePrefix, enrolmentOf, the restore-mark binding, offlineReadinessOf, stampOf,
the build id, the design binding), which is the right split: they do not read the block.

## 5. MUTANTS, ALL EXECUTED AND ALL KILLED

| # | mutation | result |
|---|---|---|
| E1 | the block carries the athlete label | KILLED 17/6 |
| E2 | the block carries this morning's reading | KILLED 17/6 |
| E3 | the full 32-hex device id is printed | KILLED 21/2 |
| E4 | the control writes a durable operation when it is tapped | KILLED 22/1 |
| E5 | "Copied" is shown when the clipboard threw | KILLED 22/1 |
| E6 | the fallback box is dropped when the API is absent | KILLED 22/1 |
| E8 | an em dash in a confirmation | KILLED 17/6 |
| E9 | the state-18 refusal is not read (a damaged device reports no-store) | KILLED 22/1 |

E7 (a hard-coded build id) is executed INSIDE R3 rather than as a source mutation: the
test recomputes the digest over the real inventory, then recomputes it again with one
input's sha changed and asserts the name moved. A hard-coded id fails the first half.
E9 is this build's own addition, for the field the brief could not source from boot.

Every mutant was applied by exact-text replacement, run, and reverted from the file's
own original bytes; the runner re-ran the suite afterwards and printed **23/23**, so no
mutation is left in the tree. `git diff --stat` after the run lists only the six edited
files and their real changes.

## 6. THE FOUR MSEDGE CHECKS, ON THIS HEAD

`browser-check.mjs` gained the row the brief asks for, and its PASS line now ends:

    "Report a problem" copied its eight-field block (44px tap target, 16px box,
    pre-selected whole, no full device id, no sideways scroll at 390px or 320px)
    and said "Copied. Send it to Joe."

The row clicks the real control in msedge, waits for the box to carry text, reads the
textarea's own value, and asserts the eight field names in order, `build: earned-` plus
12 hex, `device:` 8 hex or `none`, no 32-hex anywhere, the whole block pre-selected, a
44px tap target, a 16px box, and `scrollWidth <= clientWidth` at 390px AND at 320px with
the box still open. The primary action is still inside the viewport with the control on
the screen: 44px of headroom before a weigh-in, 116px after.

In headless Edge `navigator.clipboard.writeText` SUCCEEDED, so the browser row exercises
the copy path and the jsdom suite exercises the absent and the throwing clipboard. All
three are covered; none of them is the iPhone answer, which only the hand test has.

`gym-check.mjs`, `checkin-check.mjs` and `setup-check.mjs` PASS unchanged (7, 3 and 7
real process kills respectively, no sideways scroll, every input >= 16px).

## 7. THE LEAK TEST (R2), IN FULL

The store is real: one `faultDatabase()` IndexedDB factory, which is one installation.
Into it go a weigh-in of 197.3 lb through the reading lane, a Start and one logged set
through the accepted W6 host at the prescribed load and reps, and a complete first run
with the athlete label "Zebediah Quartzwood" and the lifts "Kettlebell floor press" and
"Sled hack squat" at 37 lb and 53 lb. Then the page is mounted with all three entries
from `today-entry.mjs` and the control is tapped, and the block it copied is searched.

Figures are compared as WHOLE NUMBERS, not substrings, over the five lines that carry
words. The three that carry identifiers - `build`, `device`, `at` - are excluded from
that comparison and constrained by SHAPE instead (the build id is asserted against the
recomputed digest, the device against `/^device-[0-9a-f]{8}$/`, the timestamp against
its own format). The reason is in the test: a device prefix reading `ab12cd34` contains
"12", so testing a reps count of 12 against a hex string is a coin toss that would
prove nothing and would hide a real leak behind a false one. Words, operation ids, the
full device id and every alphabetic token of every op payload are compared against the
WHOLE block.

## 8. RESIDUALS, AND WHAT IS NOT DONE

1. **The hand test is not run.** Three rows, the owner's iPhone, C3 style. Row 3 - does
   the clipboard actually copy in the installed app - is the only place the iOS answer
   exists, and this repository cannot produce it.
2. **Row 2 of the hand test cannot be run as written.** It asks for the control mid-set,
   from the gym card. The control is on Today only, so `screen` always reads `today`
   when it can be tapped. Putting it on the gym card is `gym-app.mjs` and its own
   acceptance bar: a second brief, not a quiet widening of this one.
3. **`problem.test.mjs` is not in `rebuild.yml`.** `.github` is editable only inside a
   re-pinning engine package (DECISIONS:112, :117 (4)), so it rides the next re-seal
   with `setup.test.mjs`, `catalogue.test.mjs` and `copy.test.mjs`. CI green on this
   branch means every PINNED step stays green, which is what it can mean.
4. **`offline-ready` will read `unknown` on this preview forever.** The page registers
   no service worker; only the A5 shell does. The field is honest rather than useful
   until the control ships inside that shell.
5. **A device with a store but no lanes cannot be told from a device with no store.**
   See section 3. No such state exists today.

## 9. REQUESTS, READY FOR THE LANE LOG

1. `C -> PM · DISCLOSURE (:135 (1)): the diagnostic includes device-<first 8 hex> and build-<first 12 hex of the sha256 over the pinned input inventory>, and NO health value, op id, exercise name, athlete label or full 32-hex id. Object if you want the device prefix dropped entirely; otherwise it is decided.`
2. `C -> PM · WORDING DECIDED, CONFIRM OR REPLACE: one sentence on both phones, "Copied. Send it to Joe." and "Select all and copy, then send it to Joe." The brief's "Paste it to Joe" is Joe's-phone wording; Dad is not pasting into a PM chat, and the page cannot know whose phone it is before the first run names him.`
3. `C -> PM · This build waits behind A4b under :116 (5). Confirm it goes before N1 NUTRITION (:143), since :140 queues it ahead of the 09-13 shakedown.`
4. `C -> PM/lane B · PIN CLASS, AGAIN: today-entry.mjs, gym-host.mjs, reading-host.mjs and checkin-host.mjs are pinned on disk through local-today-journey.test.mjs PAGE_PINS inside the B-NTC artifact, so a screens-tier brief cannot add a boot() return member. This build routed around it (annex section 3); the next one that needs the page entry will not be able to.`
5. `C -> PM · The control is on Today only, so hand-test row 2 (mid-set, from the gym card) cannot be run as written. Rule whether it belongs on the gym card, which is gym-app.mjs and its own bar.`

## 10. CI

**489c8c7** (the code head, and the head every count above was measured at):
`rebuild` **34688790273 success** - `rebuild-public (ubuntu-latest)` success and
`rebuild-public (windows-latest)` success, all nineteen steps, the B-NTC gate included -
and `pipeline` **34688790317 success**.

This line is itself a commit, so the head that carries it runs again; its ids go to the
coordinator with the hand-off rather than into a third round of this file.
