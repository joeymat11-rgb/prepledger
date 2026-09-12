# C6A-REVIEW-ANNEX - executed evidence (independent reviewer, round 1 at 6058dbd)

Reviewer did not write the candidate. Every number below was produced in
`work/lane-c/review-coach` detached at `6058dbd`, base `8e558ce`. Scratch probes
ran under `rebuild/coach/test/.review-scratch/` and were deleted; the tree is
clean and `rebuild/coach` was restored byte-identical after every mutation.

## 1. Custody and counts

| check | result |
|---|---|
| `git diff --stat 8e558ce..6058dbd -- rebuild/m3 rebuild/engine rebuild/client rebuild/m4 rebuild/conform .github` | **empty** |
| `git diff --stat 8e558ce..6058dbd` | 12 files, 2136 insertions, 4 deletions; every path under `rebuild/coach/**` or `rebuild/lanes/c/C6*` |
| `node --test "rebuild/coach/test/*.test.cjs"` | **tests 145 / pass 145 / fail 0**, `not ok` 0 |
| per file | traceability 16, tiers 13, local-era 9, cost-cap 12, charter 8, **no-dashes 7**, onboarding-tools **41**, onboarding-parity **26**, onboarding-closed-list **13** |
| floors (brief 2.4) | tools 41 >= 30, parity 26 >= 18, closed-list 13 >= 10 - **all met** |
| `node --test rebuild/m3/w7-preview/today/test/setup.test.mjs` | 150 / 150, 0 fail (annex claims 150) |
| `node --test "rebuild/m3/w6/test/*.test.mjs"` | **552 / 552**, 0 fail (annex claims 552) |
| `node rebuild/m3/w7-preview/today/build.mjs` | **A1 TODAY BUILD PASS**, exit 0 |
| `native-carriers-package.cjs --ci` run ALONE | **PASS** on runs 2, 3 and 4 (15 lines, "PUBLIC CI EVIDENCE PASS"); **FAIL on run 1 only** |
| annex file table sha256 + line counts | **8 / 8 match** |

The 145 decomposes as 80 new + **65** C5 tests, not "64 + 81": `no-dashes.test.cjs`
went 6 -> 7 because A10 extended it. The report's arithmetic reaches the right
total by a wrong split.

**A14 by construction.** Since the custody diff for `rebuild/m3`, `rebuild/engine`,
`rebuild/client`, `rebuild/m4`, `rebuild/conform` and `.github` is byte-empty, no
suite over those trees can move; the two spot-checks above confirm it rather than
assume it.

## 2. The `--ci` FAIL is COLD-CACHE, not load

Run 1 in this fresh worktree stopped after `witnesses` with
`NATIVE CARRIERS PACKAGE FAIL; required evidence missing or failed`. The same
command on the base `8e558ce` immediately afterwards got further, and every
subsequent run on `6058dbd` reached
`NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`. The difference is that the harness
materialises `test-support/import-engine/**` (16 engine files) on first use; until
it exists the `cases` stage has no evidence to read. This is a harness hermeticity
issue in `rebuild/m4`, untouched by C6, and it is NOT "a false FAIL under load" -
it is deterministic on a cold worktree and never recurs afterwards.

## 3. Parity, my own comparison (not the lane's test)

I wrote my own tap driver (the screens' setters, my own sequencing), my own voice
driver (raw `dispatch`, no `onboarding-text.cjs` helper), and my own comparison
string, then ran all eight fixtures.

| fixture | payload bytes | document bytes | validate both | len |
|---|---|---|---|---|
| two_day | equal | equal | true | 644 |
| four_day | equal | equal | true | 1020 |
| free_text_muscle | equal | equal | true | 639 |
| uneven_rungs | equal | equal | true | 619 |
| skipped_priority | equal | equal | true | 666 |
| inc_override | equal | equal | true | 767 |

**6/6 byte-equal.** Blocked two: `unnamed_exercise` and `unknown_first` both
refuse on both paths with identical gap codes
(`["CLEAN_INIT_EXERCISE_REQUIRED","CLEAN_INIT_EXERCISE_REQUIRED"]` and
`["CLEAN_INIT_EXERCISE_REQUIRED"]`), `submit` returns
`ONBOARDING_SETUP_INCOMPLETE`, and `tools.ops()` is **0**.

### Durable, all six (the lane's test covers two)

Two real `createSetupHost` installations per fixture over the accepted local era,
compared as ONE string (`profile` + `setup` + `tags` + `date`):

| fixture | empty first | tap saved | voice submit | stored bytes equal | 2nd save | rows |
|---|---|---|---|---|---|---|
| two_day | true | true | true | **equal** (626) | SETUP_ALREADY_RECORDED | 1/1 |
| four_day | true | true | true | **equal** (1002) | SETUP_ALREADY_RECORDED | 1/1 |
| free_text_muscle | true | true | true | **equal** (621) | SETUP_ALREADY_RECORDED | 1/1 |
| uneven_rungs | true | true | true | **equal** (601) | SETUP_ALREADY_RECORDED | 1/1 |
| skipped_priority | true | true | true | **equal** (648) | SETUP_ALREADY_RECORDED | 1/1 |
| inc_override | true | true | true | **equal** (749) | SETUP_ALREADY_RECORDED | 1/1 |

**6/6.** The property the brief asks for holds on every completing fixture; the
lane's own test simply stops at `COMPLETE.slice(0, 2)`.

**The builder's C2 fix is not weaker.** A1 now compares the read-back document
with one `JSON.stringify({setup, tags})`; my reordering mutant kills it (fail 6).
But the A2 durable equality is still asserted as two separate stringifies
(`voiceRows[0].setup` then `.tags`), which is the exact shape the C2 finding
removed from A1, while the file already defines a combined `storedPayload` helper.

## 4. Closedness and the smuggling attacks

`Object.keys(TIERS)` enumerated at run time is exactly
`["set_name","set_days","add_exercise_from_catalogue","set_machine_settings","set_priorities","review","submit","cannot_set_via_coach"]`
(8), and `ONBOARDING_TOOLS` is the 7. Twelve unknown names, each refused
`ONBOARDING_TOOL_NOT_IN_LIST`, each naming the attempted tool and listing the
seven, nothing thrown past the caller: `set_rep_target`, `set_sets`, `"submit "`
(trailing space), `SUBMIT`, **`__proto__`**, **`constructor`**, **`toString`**,
**`hasOwnProperty`**, `""`, `null`, `undefined`, `7`. The
`Object.prototype.hasOwnProperty.call` guard is what makes the prototype names
refuse rather than resolve.

**No write path to `sets`, `hi` or a day kind.** Every `setup.*` call in the module
with comments stripped:

```
setName(name) · toggleDay(String(d)) · addFromCatalogue(day, entry) · addExercise(day)
setExerciseField(row.key, "n", a.name) · chooseMg(row.key, a.mg) · chooseMgOther(row.key)
setMgOther(row.key, a.mg_other) · setExerciseField(row.key, field, a[field]) · togglePriority(label)
answers() · document()
```

The only general setter is bounded by a **literal** `["first","inc","rungs"]` loop,
so a hostile `a.sets` has nowhere to land. Seven smuggling attempts (`sets`, `hi`,
`day_kind`, `kinds` through `set_priorities`, `add_exercise_from_catalogue`,
`set_machine_settings`, `set_days`, `set_name`) all left `answers().sets === 3`,
`answers().hi === 10` and the day kinds unchanged; extra arguments are ignored, not
written.

## 5. A6, A7, A8, A9, A10, A11

- **A6**: all six tier-1 tools refuse without `confirmed: true` with
  `COACH_CONFIRMATION_REQUIRED`, and each refusal names what it was waiting for.
- **A7**: `{unknown: true}` **with `first`, `inc` and `rungs` all supplied** wrote
  nothing: `recorded=false`, `wrote=[]`, row fields `""`, the tagged values carry
  `blank: true`, and `missing()` names the gap. `sets`/`hi` stayed 3/10.
- **A8**: all **nine** tier-3 topics (five daily carried from `tools.cjs` plus
  `sets`, `hi`, `day_kind`, `standard_start`) refuse with a 103 to 182 character
  explanation and the answers object byte-unchanged; an unknown topic gets the
  generic refusal.
- **A9**: 8 fixtures, **78 turns, 0 untraceable**, 0 charter violations, under the
  C5 unit-keyed checker.
- **A10**: 0 dashes in either module's code, 0 in `onboarding-script.json`, 0 in
  the tier-3 setup sentences, **0 across all eight rendered transcripts**. The
  `no-dashes.test.cjs` extension is real: the source scan now covers both new
  modules and a new test walks templates, tier-3 topics, the fixture file and
  every spoken line (>= 48).
- **A11**: no `fetch`, no `node:http|https|net|tls|dgram|dns`, no URL, no
  `WebSocket`/`XMLHttpRequest`, no `process.env`, no `child_process`, no key shape.
  `onboarding-tools.cjs` requires exactly `./tools.cjs`; `onboarding-text.cjs`
  requires `node:fs`, `node:path`, `./tools.cjs`, `./coach-text.cjs`. No external
  dependency anywhere.

## 6. Mutants: 13 run, 12 killed, 1 survived

| mutant | result | RED test |
|---|---|---|
| **C1 submit builds its own payload instead of `prepare`** | **SURVIVED** | - |
| C2 one key reordered in the coach's document | KILLED, fail 6 | "the coach's DOCUMENT is the screens' document, byte for byte" |
| C3 a `set_rep_target` tool added | KILLED, fail 3 | "the registry is exactly the seven ... plus the tier-3 refusal" |
| C4 `dispatch` falls through to a default | KILLED, fail 5 | "an unknown name is refused by CODE, and the refusal NAMES the tool" |
| C5 `review` re-authors the standard start | KILLED, fail 2 | "A5 review reads Earned's standard start back VERBATIM" |
| C6 a tier-1 tool accepts no confirmation | KILLED, fail 7 | "A6 set_name records nothing without a confirmation" |
| C7 write a value when the athlete says "I don't know" | KILLED, fail 3 | "A7 unknown_first: both paths refuse, and they name the SAME gaps" |
| C8 print a number the turn did not return | KILLED, fail 1 | "A9 every number the coach says traces to a tool result in the same turn" |
| C9 one op per answered question | KILLED, fail 1 | "A12 a complete transcript writes exactly ONE operation" |
| C10 a second transcript overwrites the op | KILLED, fail 1 | "A13 first run happens ONCE" |
| **R1 (mine)** submit skips the `document()` completeness re-read | KILLED, fail 3 | "A7 unnamed_exercise: both paths refuse ... SAME gaps" |
| **R2 (mine)** a catalogue id not in the catalogue is accepted | KILLED, fail 1 | "add_exercise_from_catalogue refuses an id the catalogue does not have" |
| **R3 (mine)** tags written without the setup document | KILLED, fail 19 | "A1 two_day: the spoken op and the tapped op are the SAME BYTES" |

`onboarding-tools.cjs` and `onboarding-text.cjs` restored byte-identical (sha256
verified) after the run; `git status --short` empty; 145/145 green on the restored
tree.

### Why C1 survives, precisely

My C1 replaced the `prepare()` call with a hand-built
`{class, kind, payload:{profile, setup, tags}, parents, effective}` that preserves
key order. The suite stayed **fully green**. The cause: `setupOf`/`tagsOf` are a
**no-op on `document()` output**, so the hand-built payload is byte-identical
today; and **no test observes that `prepare` was called** - `commands.prepare` is
referenced once in the parity file, as the tap path's own call, and there is no
spy anywhere. What `prepare` actually buys is validation: it refuses an extra
input member, an `effective` with two keys, a non-array `tags`, and a `setup`
missing `split` (I ran all four). None of that is exercised through `submit`.

The builder's own C1 was a cruder hand-build and did die (annex: "KILLED, fail
12"), so the report is not dishonest - but the mutant the brief names is killable
only in its clumsy form. The check proves **byte equality**, not **producer
identity**, and the safety argument in brief 2.3 is producer identity.

## 7. The override question, judged

`DECISIONS:129 (3)` (file line 129) ends: "the athlete **may override any day**".
Brief 2.1/A4 forbids any tool that sets a day kind, and `day_kind` is tier 3.

**Consistent; not a defect and not a brief amendment.** `DECISIONS:134` (file line
134, the plan of record) makes the six screens the live transcript and says any
answer is correctable by tapping and "I'll tap instead" loses nothing. The
athlete's right to override a day is therefore intact - it is exercised by tap, on
the screen already in front of him. The voice list is a deliberate strict subset:
C6 "is not a second way to build a week, it is a second way to answer the same six
questions", and a day kind is not one of the six - it is Earned's derived output,
which `DECISIONS:89` says the coach may read back and never author.

The reconciliation is written into the product, not just the brief: the `day_kind`
tier-3 sentence ends **"Changing one is a tap on that day."** The refusal points at
the surface that does work, so it reads as "not by voice", never "you cannot".

The same line explains why `inc_override` is legitimate while a day-kind override
is not: `inc` is an **answer field** on screen 4 (a fact about the machine the
athlete observes), and the coach may write exactly the screens' answer fields.
`sets`, `hi` and the day kind have no answer field - they are derived. The fixture
name `inc_override` is a little misleading, but the coverage it provides is the
right one.

## 8. Residuals

1. **`--ci` cold-run FAIL** (section 2) - a `rebuild/m4` harness hermeticity issue,
   outside C6's custody. Worth a REQUESTS line so the next reviewer does not chase
   it; the builder's "false FAIL under load" diagnosis is wrong but harmless.
2. **Base is `rebuild/lane-c-a4b` @ `8e558ce`, not the tip.** Disclosed in the
   report's first paragraph. Parity depends on A4b's catalogue and `{profile,
   setup, tags}` payload, so C6A cannot merge before A4b does, and it must be
   re-run at A4b's merge sha.
3. **`setupOnLocalEra: false`** - `setup-host.mjs` mints its own installation, the
   same disclosed shape as C5's check-in lane. The durable parity is still real;
   the two paths simply do not yet share one era with the gym and check-in hosts.
4. **The tap path is a hand-written mirror.** `driveByTap` calls the screens' own
   setters and no coach code (I checked), so it is a fair stand-in - but it is not
   the screens' event handlers. A mistake shared by `driveByTap` and a tool body
   would pass parity while both diverged from the real screen. Part C's V1
   ("re-run through the page") is what closes this, and it is already in the brief.
5. **CI residual carried from the brief**: the coach suites are still not in
   `rebuild.yml`; `.github` is untouched here, correctly.
6. **No model, no voice, no relay, no cap on any account** - Part A is a text
   rehearsal by construction, and says so.
