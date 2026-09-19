# F2-LAND REVIEW R4: the ten ordered rows all land and all hold on both machines, the report is honest at last, and six more survivors accept

Independent reviewer, FOURTH round, narrowed by the PM's order, reviewing an ASTRA build (rounds 4
and 4b) that the PM read, ran and pushed. Branch `rebuild/d-f2-land` at
`f4eed5fcd1f2473076d323615f3fc8b4315d289c` (`963df540` round 4, `f4eed5fc` round 4b, on top of the
reviewed `68ed2fc2`), cut from `b9d8d6454ef951bc24175bb04b05adadf263c7d6`.

Read in the farm (`/home/claude/farm/wt/rebuild__d-f2-land`, synced to `f4eed5fc`). Run on the PC
(`%TEMP%\earned-f2land`, fast-forwarded to `f4eed5fc`, working tree clean before and after,
nothing edited but this file) and on linux (farm scratch `f2lrevD` cut from the pushed head). No
engine byte, no sealed byte, no cell and no workflow line was changed by me.

## VERDICT: REJECT

Narrowly, on one finding, and with the same shape of remedy the last three rounds were remedied
with: no landed byte needs to change, what is owed is six rows.

Everything the PM ordered this round LANDED AND IS CORRECT, and this is the cleanest round of the
four. R3 B1's four terms and the `:139` term have rows; the two recorded laxities are pinned
without asserting the named refusal or any engine message text, and all three tripwires fire on
exactly the right row; `G20` lost its V8 message assertion and nothing else; the workflow hunk is
three numbers and not one other byte; no byte of `rebuild/m4/workout/setup-tags.cjs` or of
`projector.test.mjs` moved; the whole bar reproduces on both operating systems, and the linux half
of the workflow comment's claim, which Astra explicitly did NOT claim, is now measured and true.
Ten new rows, eight of them behaviour rows and two recorded laxities; I killed each of the eight
with its own single-term mutant on BOTH machines, each red ALONE among the behaviour rows, and I
fired each of the three tripwires.

**And section 0's headline is finally an honest sentence.** R3 rejected round 3 for an unhedged
"ZERO accepting, ZERO degrading". Round 4's replacement carries its scope INSIDE the claim ("the
same 712-call differential corpus finds 0 ACCEPTING survivors, 0 DEGRADING survivors and 17
REDUNDANT only against those 712 calls ... This is finite evidence, not a proof"). I attacked that
sentence and I cannot falsify it: it is a claim about the corpus and the corpus says what it says.
R3 B2's class of defect is FIXED.

It is rejected because the substance under that sentence has not moved. The PM told me to assume a
third look finds more survivors that change an outcome. It does. **SIX of the seventeen named
survivors flip a named refusal into an ACCEPTANCE**, each on an input of my own aimed at that term,
each with NO behaviour row red on either operating system. R3 found four of this class with a
191-case corpus, Astra then found three more with 712 calls; I find six more with fifty-one
hand-aimed probes. That is the class this ticket has three times called BLOCKING, and this lane is
on the path to the athlete's programme.

## BLOCKING

### B1. Six of the seventeen "REDUNDANT" survivors are not redundant: each one ACCEPTS a document the module refuses today

METHOD, reproducible, and it is R2's and R3's method with hand-aimed inputs instead of a corpus.
Farm scratch `f2lrevD` at the pushed head for the linux half, the PC worktree for the win32 half.
One exact string replacement per row, anchor asserted to occur exactly once; then (a) the exact CI
step command at `rebuild.yml:288`, `node --test rebuild/lanes/d/f2/projector.test.mjs
rebuild/lanes/d/f2/guard-coverage.test.mjs`, with `MEASURED_TEST_NOW=2026-09-03` and
`TZ=America/New_York`, and (b) fifty-one probes of my own, eight of them controls, each classified
NAMED (`SETUP_TAGS_INVALID` with `code === message`), RAW (any other throw) or OK. Original bytes
restored and the sha256 re-compared after every single row:
`d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` before and after, on both
machines, every time. `git status --porcelain` in the PC worktree is empty after the sweep.

| line | term removed | an input the term alone decides | today | with the term gone | cells red |
|---|---|---|---|---|---|
| `:18` | `closed()`'s `keys.every(k => own(x, k))` | `split.map` with seven keys `a..g`, every value `'U'` | `SETUP_TAGS_INVALID` | **ACCEPTED**, `validateSetupTags` returns `true` | **none** |
| `:41` | `!descriptor.enumerable` | a state carrying a NON-enumerable own property | `SETUP_TAGS_INVALID` | **ACCEPTED**, and the property is written into the projected output AS ENUMERABLE | **none** |
| `:42` | `array && (!/^(0|[1-9]\d*)$/.test(key) \|\| Number(key) >= value.length)` | `priority_muscles` with a leading hole AND a non-index property `r4Junk` | `SETUP_TAGS_INVALID` | **ACCEPTED**, returns `true` | **none** |
| `:58` | `typeof a !== 'object'` in `equal()` | an identity-only taxonomy (so `regionsByMuscle` is `{}`) and a tagged row whose `volumeTags.regionsByMuscle` is `42` | `SETUP_TAGS_INVALID` | **ACCEPTED** | **none** |
| `:58` | `typeof b !== 'object'` in `equal()` | an untagged state row whose `sets` is `{}` against an authored `sets: 2` | `SETUP_TAGS_INVALID` | **ACCEPTED** | **none** |
| `:118` | `!plain(snapshot)` | exercise ids `'0'` and `'1'` and a `tags` value that is an ARRAY of two tags | `SETUP_TAGS_INVALID` | **ACCEPTED**, returns `true` | **none** |

Measured on linux (node v22.22.2) AND on the PC (node v24.19.0), identical row for row. On each of
the six the step prints `# tests 74 # pass 73 # fail 1` and the one red is `F2-G22`, the byte pin,
which reds on every module mutant by construction: **no behaviour row goes red for any of the six.**

WHY EACH ONE IS REAL, shortest first.

`:118 !plain(snapshot)`. R2 N2 called it redundant, round 3 agreed, R3 confirmed it against 191
cases and Astra confirmed it against 712. All four are wrong, and the witness is one line: exercise
ids are required to be TEXT, and `'0'` is text. Give two exercises the ids `'0'` and `'1'` and hand
`tags` an ARRAY of their two tag records. `own(snapshot, '0')` is true on an array,
`checkExerciseTag` passes, and `Object.keys(snapshot).length` is `2`, so `:128`'s count check
passes too. The mutant returns `true` for a setup whose snapshot is not a record at all.

`:18 closed()`'s own-key check. This is the one I would write first if only one row is written.
`closed(x, keys)` is the module's core shape primitive and it is used at `:66`, `:79`, `:84`,
`:89`, `:108`, `:119`, `:120` and `:141`. Without the `keys.every(k => own(x, k))` term it degrades
to an ARITY check at all eight sites. At seven of the eight the next guard happens to catch the
wrong-named object; at `:120` it does not, because `Object.values(source.split.map)` does not care
what the keys are called. A split map keyed `a` through `g` with valid day values validates.

`:41 !descriptor.enumerable`. The module's own comment at `:23` says in terms that this boundary
exists to "Reject holes, symbols, non-data members, custom prototypes, cycles and non-JSON scalar
values". `projectSetupTags` never applies `closed()` to the STATE, so an extra ENUMERABLE property
on a state is accepted today and always has been (I measured it: `P41b` is `OK` on the unmutated
module). That is what makes this term load-bearing rather than defence in depth: it is the only
thing standing between a non-enumerable member and the projected output. The acceptance itself is
measured on both machines; this witness, which shows what reaches the output, was run on linux:

```
input own keys include r4Hidden: true enumerable: false
ACCEPTED. out.r4Hidden = "smuggled-past-the-boundary" enumerable in out: true
restored sha256 d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d
```

`:42`'s array index-key term. `:36` already refuses a sparse array, and `G42` now pins `:36`, which
is why this term looks covered. It is not: `:36` counts own keys against `length + 1`, so an array
with ONE hole and ONE extra non-index property has exactly the right count and sails past it.
`priority_muscles.every(text)` skips holes, so nothing else objects. Today `:42` refuses it by
name; without `:42` it validates. `G42`'s own witness (a leading hole with slot 1 retained) does
NOT cover this shape, and I checked: `G42` stays green on the `:42` mutant.

The two `equal()` typeof terms. `equal(a, b)` returns `false` today whenever exactly one side is a
primitive. Delete either typeof term and `Object.keys(<primitive>)` returns `[]`, so a primitive
compares EQUAL to any object with no keys. Both sides are reachable: `:158`'s
`EXERCISE.some(k => !equal(e[k], authored[k]))` compares an attacker-supplied `e.sets` against an
authored number, which gives the `typeof b` witness; `:154`'s `equal(e.volumeTags, marker)` recurses
into `regionsByMuscle`, which is `{}` for any taxonomy whose regions are all identity entries, and
that gives the `typeof a` witness. These two are the mildest of the six and I would not reject on
them alone; they are in the table because they are the same class and they are cheap to pin.

Owed, and it is small: six rows in `guard-coverage.test.mjs`, red-first against the six mutants
above. **Nothing in the module changes, no sealed byte moves, the workflow count comment goes from
74 to 80 and from forty-four to fifty.** I would write `:18` and `:41` first.

## WHAT I CHECKED, AND THE VERDICT ON EACH THING I WAS SENT FOR

### (1) The diff, the blob identity and the workflow hunk. ALL HOLD, not taken on trust

`git diff --numstat 68ed2fc2 origin/rebuild/d-f2-land` is exactly THREE paths and nothing else:
`.github/workflows/rebuild.yml` `+3/-3`, `rebuild/lanes/d/F2-LAND-AUTHOR-REPORT.md` `+323/-131`,
`rebuild/lanes/d/f2/guard-coverage.test.mjs` `+115/-1`.

`git rev-parse` at `f4eed5fc` gives the blob ids the ticket names, and the lane copy is the same
blob as the landed module, which is what `F2-G22` pins:

| file | blob | sha256 |
|---|---|---|
| `rebuild/m4/workout/setup-tags.cjs` | `68fdc6b6710b9bcbb1c464a3f732540fa4d6de6d` | `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` |
| `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` | the same blob again | the same string |
| `rebuild/lanes/d/f2/projector.test.mjs` | `cd4f4b29e1d15c09816c7ec0ebec379c159afce2` | `f74bbe5f40624237a4d24536b3ead036a75ed3bc705a52d6e55032d28bdf8dd6` |
| `rebuild/lanes/d/f2/guard-coverage.test.mjs` | `dc20c39af132c0301dcc7a7ca6d27fbb130d297c` | `8dd554d63904af871ef059c7fb3093fe972599d539dd74d08c25f579ebf41dc7` |

`sha256sum` on linux and `certutil -hashfile` on the PC print identical strings for all four. The
module is 198 lines.

THE WORKFLOW HUNK IS THREE NUMBERS AND NOT ONE OTHER BYTE. `git diff --word-diff=porcelain` over
`.github/workflows/rebuild.yml` for the whole range prints exactly six tokens:

```
-43
+74
-43
+74
-thirteen
+forty-four
```

The `run:` line is untouched; the step name is untouched; the deliberately-absent-cells paragraph is
untouched; nothing outside the F2 comment block moved. The regions after `:232`, `:297` and `:306`
are other lanes' and are untouched. One honest note, not a defect: the report's section 3 and
section 13 describe the edit as "71 becomes 74 twice" and "forty-one to forty-four", which is true
of round 4b alone; a reader diffing from `68ed2fc2` sees 43 and thirteen, because round 3 left those
two numbers stale and R3 recorded the staleness rather than touching the file. Round 4 corrected
BOTH stale numbers, which is more than it claims, and the numbers it landed are the measured ones.

`guard-coverage.test.mjs` and the author report are pure ASCII, LF, no U+2013 and no U+2014. The
seventeen em dashes in `rebuild.yml` are other lanes' step names and predate this branch; the three
lines this round changed contain none.

### (2) Every new row, killed by its own single-term mutant, red ALONE, on BOTH machines. HOLDS, 10 of 10, and the three tripwires fire

Baseline on both machines: `# tests 74, # pass 74, # fail 0, exit 0`. For each row I applied the
exact single-term change its own comment names and ran the CI step command. On linux and on win32
the result is identical, row for row: `# fail 2`, one behaviour row red, and that row is the one
named. The second failure is always `F2-G22`, which the report discloses.

| row | the single-term change | linux | win32 |
|---|---|---|---|
| `F2-G35` | `:116` `\|\| !source.exercises.length` deleted | red alone | red alone |
| `F2-G36` | `:124` `ids.has(e.id) \|\|` deleted | red alone | red alone |
| `F2-G37` | `:165` `!plain(out.sleep) \|\|` deleted | red alone | red alone |
| `F2-G38` | `:177` `!plain(record) \|\|` deleted | red alone | red alone |
| `F2-G39` | `:139` `!descriptor \|\|` deleted | red alone | red alone |
| `F2-G42` | `:36` `array && keys.length !== value.length + 1` disabled | red alone | red alone |
| `F2-G43` | `:59` `Array.isArray(a) !== Array.isArray(b)` deleted | red alone | red alone |
| `F2-G44` | `:162` `tagged && tagged !== ids.size` disabled | red alone | red alone |

`G40` AND `G41` ARE RECORDED LAXITIES AND THEY ARE HONEST BY ALL THREE OF THE PM'S TESTS. Each
asserts only that the call THROWS, that the throw is a `TypeError` (`G40`) or a `RangeError`
(`G41`), and that `e.code` is NOT `SETUP_TAGS_INVALID`. Neither asserts the named refusal. Neither
asserts any engine message text; I read both bodies line by line. Each has a comment that says in
terms that it is a RECORDED LAXITY, names its line, and says the row is to be rewritten on purpose
when the guard arrives. THE TRIPWIRES ARE LIVE, proved on BOTH machines:

| tripwire, applied in a scratch | red rows |
|---|---|
| `:124` gains `!plain(e) \|\|` | `F2-G20` and `F2-G22`, nothing else |
| `:124` gains `(plain(e) && !text(e.id)) \|\|` | `F2-G40` and `F2-G22`, nothing else |
| `cloneData` gains `if (active.size > 256) fail();` | `F2-G41` and `F2-G22`, nothing else |

The `G40` tripwire does NOT red `G20` and the `G20` tripwire does NOT red `G40`, which is exactly
the isolation section 13 claims for them.

`F2-G20` LOST ITS V8 MESSAGE ASSERTION AND NOTHING ELSE. R3's note is answered precisely: the one
deleted line in the whole file is `assert.match(e.message, /reading 'id'/)`. The three assertions
that carry the finding are untouched. The only other non-row change in the file is a two-line
comment added above `F2-G21` saying that its first assertion is a snapshot pin bolted to a property
pin, which is R3's other note answered in the words R3 asked for.

ONE NOTE ON `G41`, THE SAME CLASS OF FRAGILITY THE ROUND JUST REMOVED FROM `G20`. `G41` asserts
`e instanceof RangeError` for a value nested 20000 objects deep. That is a stack-overflow
`RangeError`, so the assertion depends on the runner's stack, not on the module. Measured, both
machines: the threshold sits between 6000 and 8000, so 20000 has a comfortable margin on both
runners today. But with `--stack-size=20000` the same input clones successfully and the module then
refuses BY NAME, so `G41` goes RED for a reason that has nothing to do with a missing guard.
Measured on linux and on win32, identically. Not a defect today and not blocking; it should be a
sentence in the row's comment so a future runner change is read correctly rather than "fixed".

### (3) R3 B1's four terms and the `:139` term. ALL FIVE FIXED

Each of the five is now driven by a row that goes red, and red alone, on the exact mutant R3
named, on both machines: `:116` by `G35`, `:124`'s `ids.has(e.id)` by `G36`, `:165` by `G37`,
`:177` by `G38`, `:139` by `G39`. I built the mutants from R3's own descriptions rather than from
the report's, and they agree. The `:124` one, which R3 called the only urgent one, is the setup-side
half of the duplicate-exercise-id rule, and `G36` drives it with the one-key snapshot that `:128`'s
count check cannot catch. Confirmed by my probes too: the `G35` mutant turns my `X3-empty-exercises`
from `NAMED` to `OK:true` and the `G37` mutant turns `X4-null-sleep` from `NAMED` to
`RAW:TypeError`, exactly the two flips R3 measured.

### (4) The count, the seventeen survivors and the two initialization stops

**All seventeen survivors survive.** I applied all seventeen, one term at a time, on both machines:
every one leaves `# fail 1` with only `F2-G22` red. The survivor LIST is right and the
partition 122 / 2 / 17 is fair. What is not right is the word REDUNDANT beside six of them, which
is B1 above. The other eleven moved not one of my fifty-one probes and I agree they are redundant
against inputs of this shape; for `:19`'s date regex I will go further and say it is provably
redundant, because `day()`'s round trip through `toISOString().slice(0, 10)` can only be satisfied
by a string the regex already accepts.

**THE TWO INITIALIZATION STOPS AT `:27` AND `:38`: could a behaviour row kill them? YES, and it
would be one row.** I reproduced both: the cell files do not merely fail, they never register a
single test, and the step prints `# tests 2 # pass 0 # fail 2` with the two FILE paths as the
failures. The cause is not the module, it is the cells: `guard-coverage.test.mjs:15` and its twin
in `projector.test.mjs` call `createSetupTagProjector` at FILE SCOPE, and both mutants make every
call in the module refuse, so construction throws before any `test()` is registered. My probes
measure the behaviour change plainly: with either mutant every one of my twelve accepting probes
flips from `OK` to `NAMED`, including `validateSetupTags` on a well-formed setup. So a row that
built its OWN projector inside the row body and asserted an ordinary acceptance would go red for
both, and there is no such row today: every acceptance the cells assert runs through the file-scope
projector. Recording this as "not presented as behaviour-row kills" is honest and I would not
reject on it; the CI step is red either way, which is what the step is for.

### (5) The report's corrected sentences. ALL REPRODUCE

Section 0, 7.4, 7.5, section 11's B2 and section 13 now state the count as measured, name every
survivor one by one, and carry their scope inside the claim. I attacked the headline and could not
falsify it. Section 7.5's table names the same seventeen lines I measured.

SECTION 12 REPRODUCES, item by item, on BOTH machines, against the SHIPPED `ENGINE_MG` and
`REGION_MG`:

| item | measured |
|---|---|
| 1. any throw is a refusal | the three named raw shapes are `G20`, `G40`, `G41`; two `TypeError`, one `RangeError`; none is an acceptance |
| 2. the duplicate-id duty | `projectNewExerciseTags` mints a fully formed FROZEN exercise for an id the setup already holds |
| 3. the identity-head twin | the eight identity muscles are `abs, biceps, calves, forearms, glutes, hams, quads, triceps`; none has a sub-region; `head: null` and `head: 'abs'` BOTH validate and the two results differ |
| 4. absent tags return the state by identity | `=== state` for a context with no `tags` property, with `tags: null` and with `tags: undefined`, and with `op_id: 42` and `date: 'not-a-date'` in the same context, which proves the rest of the context is never validated |
| 5. no ceiling on total lend | eight helpers at `lend: 1` validate and project to a `secondary` summing to `8` |
| 6. `priority_muscles` admits any nonempty text | `'synthetic-not-an-engine-muscle'` validates |

Two small things about section 12, neither blocking, both worth a sentence before S10 lifts it.
Item 4 says the returned state is "not a clone and not frozen": the module neither clones nor
freezes it, which is the point, but the object I measured IS frozen, because `createCleanInitState`
froze it before the module ever saw it. "Not frozen BY THIS MODULE" says the same thing without
misleading a host that checks `Object.isFrozen`. And the EW2 list does not carry the companion
fact that section 11's N1 records: `validateSetupTags(anythingAtAll, null)` returns **`true`**
(measured, both machines). A host that validates before projecting, with tags not yet chosen, gets
`true` for a setup that was never looked at. That belongs in item 4 where S10 will read it.

### (6) The bar and the fence. BOTH REPRODUCE, on the PC, at `f4eed5fc`

| what | measured on the PC (node v24.19.0) | measured on linux (node v22.22.2) |
|---|---|---|
| the CI step command, `rebuild.yml:288`, both landed cells | **74 tests / 74 pass / 0 fail, exit 0** | **74 / 74 / 0, exit 0** |
| `rebuild/lanes/d/plan-edit`, the four cells named one path at a time | **90 / 90 / 0, exit 0** | not run here (the farm lacks the sealed oracles; R1, R2 and R3 record the same four environment absences) |

**The `d-plan-edit` needle `# pass 90` holds unchanged**, which it must: item (4) is still a STOP and
this round changed three files, none of them sealed.

THE LINUX HALF OF THE WORKFLOW COMMENT IS NOW MEASURED. Section 3 says in terms that the 74-test
measurement is win32 only and that no new linux result is claimed, while the comment it edits says
"exit 0 on win32 and on linux". That was a gap at commit time and Astra disclosed it rather than
papering over it. I have now run the exact step command on linux at the pushed head: 74 / 74 / 0,
exit 0. The comment is true as it stands.

`git diff --numstat b9d8d645 HEAD` on the PC is EIGHT paths, ZERO deletions anywhere: `19 0`
`.github/workflows/rebuild.yml`, `1325 0` the author report, `262 0` R1, `280 0` R2, `310 0` R3,
`687 0` `guard-coverage.test.mjs`, `382 0` `projector.test.mjs`, `198 0` the module.
`git diff --name-only b9d8d645 HEAD -- rebuild/engine rebuild/m3 rebuild/coach rebuild/client`
prints NOTHING. No file outside the ticket's owned list, and no plan-edit path, which is item (4)
still correctly stopped. The PC worktree was clean before my run and is clean after it.

## FINDING BY FINDING, AS ORDERED

| finding | verdict | evidence |
|---|---|---|
| **R3 B1** four survivors not redundant, two ACCEPTING | **FIXED** | `G35`, `G36`, `G37`, `G38`, each red and red alone on its own single-term mutant on BOTH machines; my probes reproduce two of R3's four flips independently |
| **R3's `:139` extra term** | **FIXED** | `G39`, red alone on `!descriptor` deleted, both machines; the absent-tags identity path is now pinned as the PM ruled |
| **R3 B1's sentence remedy** (section 0, 7.4, 7.5, 11 B2) | **FIXED** | the replacement claim carries its scope inside the bold and adds "This is finite evidence, not a proof"; I could not falsify it |
| **R3 note: `G20`'s V8 message string** | **FIXED** | the single deleted line in the file is that assertion; the three assertions that carry the finding stand; the tripwire still fires |
| **R3 note: `G21` is a snapshot pin bolted to a property pin** | **FIXED** | two comment lines above `G21` say exactly that; no assertion changed |
| **R3 note: the stale `43` / `thirteen` comment** | **FIXED, and by more than the report claims** | both stale numbers corrected to the measured 74 and forty-four; the hunk is those three numbers and nothing else |
| **R3: item (4) stays STOPPED** | **HELD** | the fence shows no plan-edit path; `# pass 90` unchanged |
| **The count: 141 / 122 / 2 / 17, 0 accepting and 0 degrading on 712 calls** | **the sentence is TRUE, the classification is STILL OPEN** | all 17 survive as claimed; SIX of them accept on inputs the 712 calls do not contain: B1 |
| **The two initialization stops** | **RECORDED HONESTLY** | reproduced; a behaviour row could kill both, but only if a cell stops building its projector at file scope; no such row exists today |
| **Section 12 for Edit My Week** | **REPRODUCES**, two wording notes | the table in (5) above |

## WHAT I TRIED TO BREAK AND COULD NOT

- The other eleven survivors. Fifty-one probes aimed at `plain()`'s array term, `closed()`, `day()`,
  `cloneData`'s accessor and non-object terms, `equal()`'s `b === null`, `:74`'s freeze, `:124`'s
  `own(snapshot, e.id)`, `:154`'s two `own` terms and `:181`'s `!plain(facts)` move nothing. In four
  of those I convinced myself by reading as well as by running: `:19`'s regex cannot be false for a
  string that survives the ISO round trip; `:124`'s `own` term is followed by `closed(tag, ...)`,
  which refuses every inherited value I could reach including `toString` and `constructor`;
  `:154`'s two terms are followed by comparisons against a `head` that is never `undefined` and a
  `secondary` that is always an array; `:74`'s freeze is re-applied by `:109`'s deep freeze on the
  first `projectNewExerciseTags` call, so the shared taxonomy ends frozen either way (measured: the
  push throws on a frozen array).
- `:86`'s bucket, from BOTH sides. Astra enumerated the `|| e.mg` fallback and called it redundant;
  I agree and measured it. I also tried the OTHER half, `bucket = e.mg` with `tag.head` dropped,
  which Astra's generator did not enumerate at all. It is NOT a survivor: it reds `F2-H03` and
  `F2-02` on both machines. The generator's blind spot is real but this particular term is covered.
- The three tripwires. Each fires on exactly one behaviour row and the right one, on two operating
  systems, and `G40`'s and `G20`'s do not fire on each other.
- `F2-G22`'s standing red. It reds on every module mutant and on no cell mutant, which is what the
  report claims for it and why "red alone" has to be counted over the behaviour rows.
- The fence and the needles. Nothing sealed moved, nothing under `rebuild/engine`, `rebuild/m3`,
  `rebuild/coach` or `rebuild/client` moved, `# pass 90` is unchanged, and the STOP on item (4) held.
- Flakes. Thirty-three full runs of the step on each machine across the two sweeps, zero flakes,
  and the module's sha256 re-compared after every one of the thirty-one mutants on each machine.

## WHAT I DID NOT VERIFY

- I did not re-run Astra's 141-variant generator or its 712-call corpus. I ran 31 mutants on each
  machine, chosen as the ticket directs: all 17 named survivors, the 2 initialization stops, the 10
  new rows' own terms, the 3 tripwires and one extra term of my own at `:86`.
- I did not verify Astra's "122 killed" beyond the ten rows I was sent for. R3 sampled 25 of them
  and found all 25 killed; I did not repeat that sample.
- I did not run `b-package.cjs` at all, not `--ci` and not `--full`. Section 5's refusal line is
  R1's and R2's measurement; `DECISIONS:554` means the seal-base step refuses first on this branch
  either way. I sealed nothing, wrote no receipt and no artifact, and did not touch the seal
  generator on `rebuild/b-seal-gen`.
- I did not run the Windows or ubuntu GitHub jobs. Per `DECISIONS:554` this branch shows nothing for
  the new step. The both-OS evidence here is the PC and the linux farm scratch.
- I did not assess the volume half, the three cells left on `rebuild/lane-d-f2-b1b2`, item (4)'s
  retirement, or whether any newly pinned rule is reachable from Edit My Week's own door with
  athlete data. Nobody in four rounds has, and section 12 is the right place for it to sit.
- I did not open the private census, the protected soak, `rebuild/conform/private`, `src/history.js`
  or any `ledger/` directory, on either machine. Every fixture and every probe I used is synthetic
  and my own.
- My driver, my fifty-one probes and my variant lists live in the farm scratch worktree `f2lrevD`,
  in `/home/claude/farm/scratch/f2lrevD/`, and on the PC in `%TEMP%\f2lrevD-work` with logs at
  `%TEMP%\f2lrevD-bar1.log`, `%TEMP%\f2lrevD-pe.log` and `%TEMP%\f2lrevD-sweep.log`. None of it is
  committed. The five scripts crossed the airlock under fresh `f2lrevD-a1-` names and all five
  sha256s matched on both sides before I ran anything.

## FOR THE PM

The remedy is six rows in a commit that changes no module byte, exactly as the last three rounds
were remedied, plus two count values in the workflow comment. If only two rows are written, write
`:18` and `:41`: `:18` is the module's core shape primitive and the only one of the six whose term
guards eight call sites at once, and `:41` is the only thing stopping a non-enumerable member from
being written into the projected state as enumerable, against the module's own stated contract.

The harder question is not mine to settle, and I will state it plainly rather than pretend this
round answers it. Four independent looks have now found, in order, four, three and six
outcome-changing survivors, each with a method the previous look did not use. That is not a lane
failing to converge; it is evidence that a mutation sweep plus any fixed corpus cannot enumerate
this module's guard terms to exhaustion, and every round that closes on "zero against this corpus"
will be disproved by the next corpus. The report says so itself, in terms, twice. If the PM wants
this closed rather than iterated, the honest close is available and I would not object to it: land
the six rows, then strike the survivor CLASSIFICATION from section 7.5 altogether, keep the
survivor LIST, and have S10 carry one named debt saying that seventeen guard terms of
`setup-tags.cjs` have no behaviour row and that removing six of them was measured to accept
documents the module refuses today. What is not available is a fifth round that reports zero
accepting survivors against a corpus of its own choosing.

Nothing else in this round is owed. It is the cleanest of the four and the first one whose headline
I could not break.
