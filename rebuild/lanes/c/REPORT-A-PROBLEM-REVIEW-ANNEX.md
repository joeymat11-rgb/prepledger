# REPORT A PROBLEM - REVIEW ANNEX (executed evidence)

Independent reviewer, effort HIGH, author != reviewer, told to disagree. Candidate
`rebuild/lane-c-report` @ **41fdda5** (code **489c8c7**), base **964f183** (the A4b merge,
`:149`). Worktree `work/lane-c/review-a4`, `git status --short` empty at start and end.
Bar: `rebuild/lanes/c/REPORT-A-PROBLEM-BRIEF.md` R1-R12 + mutants E1-E9.

## 1. Custody

`git diff --numstat 964f183..41fdda5`, 12 paths: `problem-report.cjs` (143),
`test/problem.test.mjs` (524), and edits to `today-app.cjs` (+100/-1),
`browser-check.mjs` (+52/-1), `build.mjs` (+44/-2), `design.cjs` (+9), `preview.css`
(+19), `screens.template.html` (+13); the three `REPORT-A-PROBLEM-*` docs; and
`rebuild/coach/BRIEF-COACH-WAVE1-TEXT.md` (178, docs-only). Nothing under
`rebuild/m3/w6`, `rebuild/m4`, `rebuild/engine`, `rebuild/client`, `rebuild/conform` or
`.github`.

The six files pinned on disk are byte-identical to the tip, by sha256 against
`git show 964f183:<path>`:

```
IDENTICAL rebuild/m3/w6/local/today-bindings.mjs            95315f7a0e63cd49
IDENTICAL rebuild/m3/w6/test/local-today-journey.test.mjs   4572517ce67b99ae
IDENTICAL rebuild/m3/w7-preview/today/today-entry.mjs       b50b92314b8e7730
IDENTICAL rebuild/m3/w7-preview/today/gym-host.mjs          70a59b5c328f3b02
IDENTICAL rebuild/m3/w7-preview/today/reading-host.mjs      a3e9201587f97446
IDENTICAL rebuild/m3/w7-preview/today/checkin-host.mjs      029b3a9b711cf4f9
```

and all four `PAGE_PINS` values in the journey suite equal those bytes.

`rebuild/coach/BRIEF-COACH-WAVE1-TEXT.md` is outside the custody list given for THIS
build, but `LANES.md:10` puts `rebuild/coach/*` in lane C's own column, so it is within
licence - a docs-only rider that simply travelled on this branch. `C6-INDEX.md`, also
named in the dispatch, is not in the diff at all. Condition C3.

## 2. THE PIN-AVOIDANCE JUDGMENT - both readings are sound

The builder avoided adding a member to `boot()`'s return (which would have edited the
pinned `today-entry.mjs`) by reading two things from elsewhere. Executed:

**(a) the device id, off the authority lease.** Over a real local era:

```
era.deviceId            = device-889a1ab36f7fd43419f0029381d30242
handle.lease.device_id  = device-889a1ab36f7fd43419f0029381d30242
handle.deviceId         = device-889a1ab36f7fd43419f0029381d30242
SAME VALUE (lease vs era): true ; devicePrefix of either = device-889a1ab3
```

**Same value.** And the truncation refuses rather than invents: `null`, `""`,
`"device-"`, `"device-xyz"`, `"device-0123456"` (seven hex), `42` and `{}` all give
`none`; only a value carrying at least eight hex yields a prefix. The lease is also the
right source for the reason the comment gives - it exists from the first launch, before
any operation does.

**(b) restore-required, off the page's own status line.** The binding is real, not a
guessed string:

```
problem-report.cjs RESTORE_MARK      = "Restore required"
rebuild/client/copy.cjs RESTORE_REQUIRED = "Restore required — sign in"
gym-host.mjs RESTORE_REQUIRED === the client's string : true
as PAINTED by boot through plainOrDrop: "Restore required: sign in (KEY_MISSING)"
enrolmentOf(that) -> restore-required
the other thing boot writes there ("Not everything opened: ...") -> no-store
an empty status line -> no-store
```

So the mark is a prefix of `rebuild/client`'s own state-18 sentence, it survives P1's
render boundary (the em dash it rewrites sits AFTER the two words), and the page's other
status sentence does not collide with it. `test/problem.test.mjs` #7 pins the binding by
requiring `rebuild/client/copy.cjs` at test time; my mutant **Z1** (mark -> "Restore
needed") turns it RED, so a reword upstream fails rather than drifting. Two narrow
fragilities remain and are named as residuals: the binding is a PREFIX (a reword of the
first two words would silently report `no-store`), and if `plainCopy` ever could not
rewrite that dash the whole line would be dropped and the answer would again be
`no-store`. Both are guarded today; neither is a defect.

## 3. Counts, executed by this reviewer

```
problem                    23 /  23 / 0      W6        552 / 552 / 0
rebuild.yml today step    164 / 164 / 0      journey    51 /  51 / 0
setup                     157 / 157 / 0      host       32 /  32 / 0
catalogue                  43 /  43 / 0      w7         19 /  19 / 0
copy                       36 /  36 / 0
B-NTC gate, run alone: exit 0, worktree clean before AND after
build.mjs PASS: 3 assets; 104 pinned inputs; build earned-a66db853886a
```

`problem.test.mjs` carries **23** named tests against the bar's floor of 16.

## 4. THE PRIVACY BAR, this reviewer's own probe

Planted in a REAL local-era store, then the REAL page booted over it and the control
tapped (not a fixture, not a hand-made `state`): athlete label `Dadworth`, exercise name
`Zorbaflex press`, a weigh-in of `181.4` through the reading lane, and a first-run op
carrying the label and the lift. Verified present in the ops before the tap. The block
the box actually held:

```
screen: today
lane open: workout, checkin, setup
enrolment: enrolled
offline-ready: unknown
build: earned-notinjected          <- unbuilt module loaded off disk, as documented
device: device-4d5b4636
user agent: Mozilla/5.0 (win32) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/30.0.0
at: 2026-09-12 07:13:24 -04:00
```

```
clean  athlete label   "Dadworth"        clean  check-in answer "7.25"
clean  exercise name   "Zorbaflex press" clean  mg label        "chest"
clean  weigh-in        "181.4"           clean  op id prefix    "op-device-"
clean  load            "110"             clean  profile         "earned/first-run-setup"
clean  reps            "8"               clean  any 32-hex run
device field prints 8 hex ; dashes in the block: false
fields in order: screen, lane open, enrolment, offline-ready, build, device, user agent, at  === FIELDS
ops before 2 -> after the tap 2   (no durable write: true)
clipboard received the SAME string as the box: true
TOTAL LEAKS: 0
```

(My check-in write refused on a payload shape I got wrong; the label, the lift and the
weigh-in are the planted values that matter and all three were in the store.)

## 5. The build id, recomputed independently (R3)

The id is sha256 over the BUNDLE inventory (`path + " " + sha256`, sorted), not over
`REQUIRED_INPUTS`. I re-hashed all 104 inventory files myself with node's crypto and
rebuilt the digest:

```
build.mjs reports : earned-a66db853886a
my own recompute  : earned-a66db853886a   (full digest equal: true; 0 files I could not reproduce)
the SHIPPED app.js carries earned-a66db853886a, exactly once; the placeholder does not survive
one changed byte in a pinned input -> earned-5386dd23a589 ; restored -> earned-a66db853886a
```

## 6. The clipboard and the unconditional box (R7, R8)

Driven three ways over the real page:

```
PROBLEM_ENTRY  = "Report a problem"
PROBLEM_COPIED = "Copied. Send it to Joe."
PROBLEM_SELECT = "Select all and copy, then send it to Joe."   (no dashes in any of the three)

SUCCESS  said "Copied. Send it to Joe."              box hidden false  selected 0..257  clipboard got the same string
ABSENT   said "Select all and copy, then send..."    box hidden false  selected 0..257
THROWS   said "Select all and copy, then send..."    box hidden false  selected 0..257
```

The box is open in ALL THREE, which is the brief's own load-bearing property.

**The wording deviates from the brief** ("Send it to Joe", not "Paste it to Joe"). It is
disclosed in `today-app.cjs` with a reason I agree with - on Dad's phone he is not
pasting into a PM chat, and the page cannot know whose phone it is before the first run
has named him - and the brief's open question 2 asks the PM for the wording anyway. But
`rebuild/lanes/REQUESTS.md` on this tip carries no such line. Condition C2.

## 7. The phone, measured

`browser-check.mjs` PASSES in msedge with the new row: 44px tap target, 16px box, block
pre-selected whole, the eight field names deep-equalled, `build: earned-<12hex>`,
`device: device-<8hex>|none`, no 32-hex, and no sideways scroll at 390px or 320px with
the box open. The one bar item it does NOT measure is the primary action with the box
open, so I measured it:

```
box CLOSED:         primary top 739 bottom 798 of 842 | sideways 0 | IN VIEW UNSCROLLED true
box OPEN:           primary top 452 bottom 511 of 842 | sideways 0 | IN VIEW UNSCROLLED true
box OPEN at 320px:  primary top 444 bottom 503 of 842 | sideways 0 | IN VIEW UNSCROLLED true
the box sits 199px BELOW the primary, which does not move out of view
```

Condition C4 is to add that assertion, not to change the page.

## 8. Mutants: 9 killed / 2 survived

| # | mutation | result |
|---|---|---|
| E1 | the athlete label reaches a printed field | KILLED 22/1 - `R2` |
| E3 | the FULL 32-hex device id is printed | KILLED 21/2 - `R4`, `R2` |
| E5 | a clipboard that threw still says Copied | KILLED 22/1 - `R7` |
| E6 | the fallback box is dropped where the API is absent | KILLED 22/1 - `R7` |
| E7 | the build id is hard-coded | KILLED 22/1 - `R3` |
| E8 | an em dash in a confirmation | KILLED 17/6 AND the build: exit 1 |
| **Z1** | REVIEWER: the mark stops matching `rebuild/client`'s state-18 sentence | KILLED 21/2 - `R5` (both cells) |
| **Z2** | REVIEWER: enrolment always answers `enrolled` | KILLED 20/3 - `R5` (three cells) |
| **Z3** | REVIEWER: the box is dropped when the clipboard RESOLVES | KILLED 22/1 - `R7` |
| **E2** | page internals (`JSON.stringify(model.read())`) into the `user agent` field | **SURVIVED** 23/0 |
| **Z4** | REVIEWER: a NINTH field added to the block | **SURVIVED** 23/0 |

E4 (write an op on tap) and E9 were not run by me: E4 has no clean single-line anchor in
this shape, and R6 plus my own before/after op count (2 -> 2) cover the property it
tests. Every file restored byte-identical; `git status --short` empty after each.

**What the two survivors mean.** Under E2 the block really does print page internals:

```
user agent: {"today":"2030-02-04","paint":"TRUTHFUL","faceState":1,"blocked":false,"durable":true,...
```

and both `R2` and my own planted-value probe report **zero leaks**, because both search
for SPECIFIC planted strings rather than checking what the field is allowed to contain.
Z4 adds a ninth line and no node subtest objects. The browser check's own
`assert.deepEqual(problemFields, [the eight])` DOES catch Z4 - but not E2 (it asserts
field NAMES, never values), and it is not in CI. So the block's shape is pinned only in
a check that CI does not run, and its VALUE SETS are not pinned anywhere. That is exactly
the half of the bar phrased "the eight fields in order **with the stated value sets**".
Condition C1.

## 9. Not run

The 3-row hand test on the owner's iPhone (a human run, and row 3 is the only thing that
can answer whether the iOS clipboard copies at all). CI both OS: this reviewer does not
push.
