# TODAY-SPLIT-SPEC v3 - INDEPENDENT REVIEW R3

Reviewer: cowork (Earned lane hand, independent spec reviewer), told to disagree. The author has
finished and is gone. Under review: `rebuild/lanes/c/TODAY-SPLIT-SPEC.md` at `04d4616c` on
`rebuild/c-today-split` (2184 lines), together with the four instruments and four tables it is
written from, `rebuild/lanes/c/today-split-spike/` at `24b35244`. Held against it: R1 at `af53fd17`,
R2 at `60d6ad97`, the v2 fix round at `906cb056`.

**Refs.** Chain tip `70113da5` (`rebuild/t2-client-core`, farm-synced, privacy proof PASS). I
verified the spike's drift claim myself: `git diff fdd773d5 70113da5` touches two files,
`rebuild/DECISIONS.md` and `rebuild/lanes/STATUS.md`, and neither is one of the three this ticket
cuts, so every line number below resolves at the current tip. S9 lane head `da9f8683`.

**What I RAN.** Everything in PART 1 and PART 2, in my own clean farm scratch
(`/home/claude/farm/scratch/rev3`, worktrees `r3v-tip`, `r3v-s9`, `rev3-wired`), from the committed
instruments copied byte for byte out of the lane branch. I wrote one instrument of my own,
`capture.cjs`, and I ran the whole today step on the F.1 wired overlay. I opened no
`rebuild/conform/private`, no `src/history.js`, no `ledger/`, no soak, nothing on the owner's data
path. No browser, no build, no `b-package.cjs`, no bundle, no design gate. Only this file is
committed.

## VERDICT: REJECT

Eight blocking findings, twelve notes. This is the best round of the four and I want that said
first: the direction is right, the method is right, the spike is real, and I reproduced its headline
numbers row for row at both refs without touching the instruments. **But the spec now rests on the
instruments, and the instruments do not do two of the things the spec says they do.** The verbatim
check that D.1 makes the whole proof of the pure move is unreachable code, and I carried a weakened
double-write guard into the sealed module past it. The content anchoring that B.2 makes the reason a
table beats prose refuses on the first anchor and does not refuse on the last, and I silently moved
a released copy helper into the seal past it. Both are one-line fixes to the instruments and neither
is a design fault, which is why this is a small REJECT and not a direction argument.

The other six are arithmetic in the places the spec asks to be judged on arithmetic: two of twelve
rows in the census table the interface is priced off, a name census that says zero where the parser
says two, a boot revision that does not produce the design it is prescribed for, a promised
UNMEASURED convention that is never once used, a number the spec itself retracted surviving in two
sections, and a thirteenth blind edge in a twelve-row blind table the appendix leans on.

**No STOP.** Nothing I found is a writer that cannot leave its closure. Every finding is an
instrument that must be tightened or a count that must be re-read, and the build round can start
from this spec under the conditions in PART 7.

---

## PART 1 - I RE-RAN THE SPIKE AT BOTH REFS. IT REPRODUCES.

Three commands, at `70113da5` and at `da9f8683`, from a clean scratch directory with the committed
`cut.cjs`, `census.cjs`, `reach.cjs`, `gen-regions.cjs` and `regions.json` copied out of the branch
and nothing else. I did not edit an instrument before running it.

| claim | chain tip | `da9f8683` | verdict |
|---|---|---|---|
| regions resolved by content anchor | 65 / 65 | 65 / 65 | **reproduced** |
| anchors matching zero places or ambiguously | 0 | 0 | **reproduced** |
| lines moved | 762 (685 + 41 + 36) | 762 | **reproduced** |
| released file after | 1941 / 548 / 428 | 1942 / 548 / 461 | **reproduced** |
| substitution rows / occurrences | 5 / 5 | 5 / 5 | **reproduced** |
| straddling seam markers / aligned | 3 / 17 | 3 / 17 | **reproduced**, and the three are exactly B.2's: `TA-M07` ENDS at `:1435` inside a BlockStatement `:1435-:1444`, `TA-M11` ENDS at `:2336` inside `:2300-:2337`, `GA-M02` ENDS at `:419` inside a VariableDeclaration `:419-:420` |
| line drift | none at the tip | 30 regions one line lower, `today-model.cjs`'s three 32 lower | **reproduced** |
| `node --check` on the output | 6 / 6 | 6 / 6 | **reproduced** (and 6 / 6 on the wired output too) |
| crossings | 282, 100 distinct | 282, 100 distinct | **reproduced** |
| the six class counts | 119 / 42 / 34 / 33 / 29 / 25 | identical | **reproduced** |
| reachability rows | 62 (51 + 7 + 4) | 62 | **reproduced**, and the SPIKE-REPORT's own correction from 56 is right |
| durable PUT a paint root reaches | 1, `gym-app.mjs:546` | 1 | **reproduced** |
| blind edges listed by hand | 12 | 12 | **reproduced** |
| `CROSSINGS.md`, `REACH.md` regenerate | byte for byte identical apart from the one line recording the worktree path | same | **reproduced** |
| boot order: 13 mount statements, 6 moved; gym 10 with 2 | identical | identical | **reproduced** |

**The F.1 wired cut, run by me as a fourth hand.** `cut.cjs --wire` into a fresh scratch worktree at
`70113da5`, then the whole today step, the command at `.github/workflows/rebuild.yml:232`.

- First run, with another lane's `node --test` competing for the farm's two CPUs the whole time:
  **`# tests 681` `# pass 680` `# fail 1`**, 380 s. The single failure is
  `measure/test/journey.test.mjs` killed by `SIGKILL`. Run alone on the same overlay,
  `journey.test.mjs` is **3 of 3 green** in 292 s, and it imports neither `today-model.cjs` nor
  `today-readings.cjs` (0 occurrences of either name in the file).
- Second run, uncontended, same overlay, same command:
  **`# tests 682` `# pass 682` `# fail 0`**, 358 s.

**So F.1 reproduces exactly, and I am the fourth hand and the fourth green.** The one thing the spec
should add: the step needs the machine to itself. A competing run on two CPUs costs
`journey.test.mjs` to `SIGKILL` and produces `681 / 680 / 1`, which is the same number the
SPIKE-REPORT records for its own contended baseline. A build round that sees that line should
re-run before it reports it.

---

## PART 2 - I ATTACKED THE INSTRUMENTS, BECAUSE THE SPEC NOW RESTS ON THEM

Every experiment below was run on a throwaway copy of the three files under
`/home/claude/farm/scratch/rev3/atk/`, never on a farm worktree and never on the repository. The
instruments were not modified for any of them.

### (a) I planted three crossings. THE CENSUS NAMED ALL THREE, at the line, with the class and the declaring region.

| what I planted | where | what `census.cjs` printed |
|---|---|---|
| a RELEASED line assigning a SEALED binding: `sleepBusy = true;` inside the released `renderSleepCheckIn` | after `:1434` | class **RELEASED ASSIGNS A SEALED BINDING**, `sleepBusy write today-app.cjs:1436`, sits in RELEASED-body, declared in `TA-S07` at `:454` |
| a SEALED function reading a RELEASED binding: `if (checkinOrigin === "never") return null;` inside `sleepClockCheck` | `TA-S26` | class **sealed reads a released binding**, `checkinOrigin read today-app.cjs:1385`, sits in `TA-S26`, declared RELEASED at `:799` |
| a writer-capable object handed out through the returned api: `foodLaneRef: () => foodLane,` | `TA-M14` | class **released reads a sealed binding**, `foodLane read today-app.cjs:2555`, sits in `TA-M14`, declared in `TA-S04` at `:410` |

The totals moved from 282 to 285 and each of the three affected classes rose by exactly one. I chose
`checkinOrigin` on purpose: it is one of 53 bindings declared in `mountToday` that cross NOWHERE at
baseline, so the row is a detection and not an echo. **The census passes its own test, and the
spike's claim that nothing R1 or R2 found by reading escaped it is one I reproduce.**

### (b) BLOCKING-1. I planted a non-verbatim edit in a moved region. The verbatim check did not refuse. It cannot.

D.1's red-first sentence is exact: *"run `cut.cjs` on a tree with an artificial one-character edit
inside `recordSleep` and it must fail naming `TA-S30`."* I ran that test.

I replaced `today-app.cjs:1808`

```
    if (sleepBusy || sleepUnknown || sleepReadBack) return;
```

with `if (sleepBusy) return;` - the sleep writer's double-write fence reduced to one third of it -
and ran `cut.cjs --root <tampered> --out <dir>`:

```
  today-app.cjs -> today-lanes.cjs   moved 685 lines in 38 regions; 14 seams left released
  VERBATIM CHECK: substitutions applied 5 rows / 5 occurrences;
                  regions whose bytes differ with no declared row: 0
  LINE DRIFT: none; every region resolved at its tip line numbers
```

**Exit 0. Zero verbatim failures. And `today-lanes.cjs:423` carries the weakened guard.** The count
of the original line in the sealed output is 0 and the count of the planted line is 1.

This is not a tuning problem. `cut.cjs:213` is

```
if (applied.length === 0 && out !== body) verbatimFails += 1;
```

and `applySubs` returns `out = text` unchanged whenever no declared row matched, so
`applied.length === 0` implies `out === body` by construction. **The counter can never be non-zero,
for any input.** "regions whose bytes differ with no declared row: 0" is a tautology, not a
measurement, and the script's own comment at `:211-:212` half concedes it.

What the codemod actually guarantees is weaker and should be stated as what it is: it CONSTRUCTS the
moved bytes by slicing the source and applying declared rows, so the output is verbatim BY
CONSTRUCTION with respect to whatever source it was pointed at. It does not CHECK anything, because
there is no reference point: no manifest, no per-region sha256, nothing that says what the bytes
were when the table was written and the spec reviewed.

Three places in the spec are therefore vacuous as written:

- **D.1's PASS** ("`cut.cjs` reports 0 regions whose bytes differ with no declared row") is met by
  every possible tree.
- **H.2 STOP 2** ("`cut.cjs` reports any region whose bytes differ with no declared row") can never
  fire.
- **D.1's red-first test 1** does not fire, which I measured above.

The fix is small and the build round should be told it, not left to find it: `regions.json` gains a
`sha256` per move region, recorded at the ref the table was written at; `cut.cjs` compares the
sliced bytes against it BEFORE substitutions and refuses by region id. That is the instrument v1 and
v2 specified and D.1 says has now been built. It has not.

**D.1's red-first test 2 PASSES and I say so.** One character added to a region's FIRST anchor:
`REFUSED: today-app.cjs TA-S13: first anchor matches ZERO places`. Duplicating a first anchor so it
matches twice with `nth: 1`: `REFUSED: today-app.cjs TA-S09: first anchor matches 2 places and the
table gives no disambiguating index`. Both refuse by name, exactly as claimed.

### (c) BLOCKING-2. The LAST anchor has no ambiguity check at all, and 25 of the 65 regions end on a bare two-space `}`.

`cut.cjs:94-:101` takes the `nthFrom`-th occurrence of the last anchor's text at or after the start
and refuses only if it finds none. There is no equivalent of the first anchor's
"matches N places and the table gives no disambiguating index". Every one of `TA-S11`, `TA-S13`,
`TA-S15`, `TA-S17`, `TA-S18`, `TA-S19`, `TA-S20`, `TA-S22`, `TA-S23`, `TA-S24`, `TA-S26`, `TA-S27`,
`TA-S28`, `TA-S29`, `TA-S30`, `TA-S32`, `TA-S33`, `TA-S34`, `TA-S36`, `TA-S37`, `GA-S03`, `GA-S04`,
`GA-M01`, `TM-S02`, `TM-S03` - **25 regions, 24 of them moves** - has `"  }"` as its last anchor
with `nthFrom: 1`. That is "the first two-space closing brace after the start", over a file the
design lane is about to edit and over a table B.2 says applies "after the design lane edits a
drawing region".

I moved a last anchor so that it matches twice, three ways.

**(i) The alignment check catches the crude case.** Two lines `    if (false) {` / `  }` inserted
inside `TA-S11`: `REFUSED: today-app.cjs TA-S11: region ENDS at :492 inside a ReturnStatement that
runs :486-:504`. It refuses, but it refuses with the wrong reason - it says the region is a SEAM
rather than saying the anchor is ambiguous - which is the message a build round would act on.

**(ii) A statement-aligned duplicate is NOT caught. The region silently shrinks.** I inserted
`  if (options.debugHook) {` / `  }` after `:629`, inside `TA-S19`:

```
  today-app.cjs -> today-lanes.cjs   moved 673 lines in 38 regions
  VERBATIM CHECK: ... regions whose bytes differ with no declared row: 0
  LINE DRIFT from the tip cross-check (content anchors still resolved):
    today-app.cjs TA-S19 tip 628-643 -> 628-631
```

Exit 0. `TA-S19` fell from 16 lines to 4, and **`measureDeps` - the deps object B.5 puts SEALED,
carrying `repaint`, `back`, `trialState`, `indexedDB` and `crypto` - stays in the RELEASED file**
(`grep -c "function measureDeps"`: 0 in `today-lanes.cjs`, 1 in `today-app.cjs`).

**(iii) One character on the region's own closing brace EXTENDS it, and drags released code into the
seal.** I changed `today-app.cjs:1334` from `  }` to `  }  ` - `TA-S24` `retryFoodRead`'s own closer:

```
  today-app.cjs -> today-lanes.cjs   moved 695 lines in 38 regions
  VERBATIM CHECK: ... regions whose bytes differ with no declared row: 0
  LINE DRIFT: today-app.cjs TA-S24 tip 1324-1334 -> 1324-1344
```

Exit 0, no overlap, no straddle. `TA-S24` grew from 11 lines to 21 and took the released
`reasonOf()` (`:1339-:1344`) with it, into `today-lanes.cjs`, together with its composition of the
copy constant `FOOD_REASON`. `reasonOf` is itself one of B.5's twelve sealed-to-released names, so
the interface changed underneath the census in the same run.

**So D.1's sentence** - *"Run it with one anchor's text altered by one character and it must fail
naming that region rather than silently matching the wrong line - which is the failure mode a
line-number table has and this one does not"* - **is true of the first anchor and false of the
last.** The only signal in (ii) and (iii) is a LINE DRIFT row, and drift is the expected, normal
output at the S9 ref where 30 regions drift, so it is not a signal a reader can act on. The
moved-line total (673 or 695 against 685) is the one number that moves, and nothing asserts it.

Two one-line fixes close it: refuse a last anchor whose text occurs more than `nthFrom` times before
the resolved end unless the table says `ambiguousOk`, and assert the per-file moved-line totals
(685 / 41 / 36, or 679 / 41 / 36 after B.3) in the report. Both belong in the build round's first
act, beside the `kind` edits B.3 already asks for.

### (d) I wrote a fourth instrument for the failure the census cannot have. It reports ZERO, and that is a result in the spec's favour.

`census.cjs` measures references that resolve to NOTHING in the output file. The silent twin is a
reference that still resolves, but to a DIFFERENT declaration than it resolved to in the source:
name capture. `node --check` passes, the census is quiet, and the binding has changed underneath the
code. Nothing in the spike looks for it.

`capture.cjs` (mine, in scratch, not committed) resolves every identifier reference in each output
file, maps the declaration it resolves to back to a SOURCE line through `linemap.json`, and compares
with the source's own resolution.

| overlay | references compared | NAME CAPTURES |
|---|---|---|
| tip, pure move | 4213 | **0** |
| `da9f8683`, pure move | 4233 | **0** |
| tip, `--wire` | 4213 | **0** |

**Zero at both refs.** The cut does not silently rebind anything. I recommend the build round keep
this check and run it on its own output, because once the interface exists it is the instrument that
catches BLOCKING-4 below, and the census by construction cannot.

### (e) The class of crossing static scope analysis cannot see, measured on the spec's own wired output.

The assignment names three candidates - a property access on an object handed across, a name reached
through a string key, a callback stored and invoked later. All three are real here, and the sharpest
demonstration is the spec's own green cut.

**Run `census.cjs` over `cut.cjs --wire`'s output and the `today-model.cjs` / `today-readings.cjs`
pair reports ZERO crossings.** It reported six on the pure move. The interface was built, and the
instrument went silent - by construction, because `__readings.weighIn` is a member access on a local
and `setMessage: (m) => { lastMessage = m; }` is a released closure the sealed module invokes.

That has two consequences the spec does not carry.

1. **The spike's "0 SEALED ASSIGNS A RELEASED BINDING (it was 5; W6 is what makes it 0)" is a
   property of the instrument, not of the design.** W6 does not remove the five writes of
   `lastMessage`; it routes them through a released callback the seal calls. The effect is
   identical and the row count is zero. As a headline it reads as a safety property and it is not
   one.
2. **B.5's PASS sentence and E.3's NO-CROSSING-ASSIGNMENT rule cannot be certified by
   `census.cjs`.** "PASS is: after the cut, no released file contains an assignment to any name
   declared at factory scope in its sealed partner, and `census.cjs` prints the class count as
   ZERO" is met by building ANY interface, including a bad one. H.2 STOP 11 and H.3 both require the
   census to be run "on the build round's own output", and NOTE-2 below says why that is not a
   free re-run.

The other two classes, with line cites, and whether the spec covers them:

| class | the line that proves it here | does the spec cover it? |
|---|---|---|
| property access on an object handed across | `today-app.cjs:2565` `sleepLane: () => sleepLane`, `:2568` `workoutEntry: () => workout`, `gym-app.mjs:572` `lane: () => settingsLane` | **YES, well.** B.7 names all three, B.1 point 4 qualifies S-R2 where the ruling is carried out, and E.5 red row 14 plants all three. This is the one place the spec is ahead of its instruments |
| a name reached through a string key | `food.test.mjs:1152-:1153` slicing `today-app.cjs` between `'function foodEntryFor'` and `'function openFoodLane'`; `problem.test.mjs:1100-:1102` `/^function sleepEntryFor[\s\S]*?^  \}/m`; `problem.test.mjs:2003-:2008` `/sleepSpanH\(/` over the directory | **YES**, D.3 carries all three with their line cites and the indentation and ordering constraints they impose, and H.2 STOP 5 fires on a fifth. Note the census's scope is three product files, so none of these is visible to it and D.3 is doing it by hand, correctly |
| a callback stored and invoked later | `REACH.md`'s twelve-row blind table, and **one it misses**: see BLOCKING-8 | **PARTLY** |

---

## PART 3 - BLOCKING

BLOCKING-1 and BLOCKING-2 are PART 2 (b) and (c) and are not restated here.

### BLOCKING-3. Two of the twelve rows in B.5's sealed-to-released table are wrong against the spike's own `CROSSINGS.md`, and D.1 prices W1 and W2 off them.

B.5 opens "This is the direction B.4 bounds, and the machine closes it", and B.3 says the interface
"is READ OFF the 282 crossings". I read the same twelve rows off `crossings-tip.json` myself:

| name | B.5 says | the machine says | |
|---|---|---|---|
| `mountToken` | 12 refs, 4 regions | **16 refs**, 4 regions | `:1415 :1423 :1731 :1733 :1745 :1754 :1839 :1852 :1872 :1880 :1886 :1896 :1928 :1982 :1985 :2003` |
| `render` | 21 refs, 8 regions | **23 refs, 11 regions** | `TA-S13 TA-S18 TA-S19 TA-S20 TA-S23 TA-S24 TA-S27 TA-S29 TA-S30 TA-S32 TA-S34` |
| the other ten | 9 / 2 / 1 / 1 / 1 / 2 / 1 / 1 / 4 / 2 / 1 | **exact** | `screen`, `phone`, `status`, `sleepDraft`, `paint`, `paintTodayEntry`, `tell`, `clearSleepDraft`, `reasonOf`, `sleepTyped` all agree row for row |

The twelve names are right and the five-plus-seven split is right; two counts are not. It matters
because **D.1's W1 is declared as "21 refs, 8 regions" and W2 as "12 refs"**, and D.1's own PASS
says "every declared row's occurrence count equals the number in the table above" and "a region that
needed six W1s where the table says two is visible". As declared, W1 and W2 fail their own PASS on
the first run: 23 in 11, and 16.

**And a third row is a different kind of wrong.** `screen`'s 9 is a DE-DUPLICATED count. The census
collapses rows on the key `(file, name, kind, source line)`, so two references to the same name of
the same kind on one line count once. Raw, `screen` is stranded **15** times in `today-lanes.cjs`,
not 9. W4 is a rewrite instruction; the build round must apply it 15 times. `render`, `mountToken`
and `clearSleepDraft` happen to be unaffected by the dedup; `screen` is not.

### BLOCKING-4. `on` is not 0 in code position, and the two occurrences move into the module that declares `on`.

B.3: *"`facade`, `on` and `painter` are 0 in code position in both released files."* R2 verified it
("all genuinely 0 in code position in both files"). I parsed both files with acorn and classified
every `Identifier` node named `facade`, `on`, `painter` or `lanes` as code position, property key or
member name:

```
today-app.cjs => on CODE POSITION :2027 | on CODE POSITION :2028 | lanes property key :2196
gym-app.mjs   => none
```

```
2027:    for (const [name, on] of Object.entries(was.issues || {})) {
2028:      if (on && typeof to.toggleIssue === "function") to.toggleIssue(name);
```

`facade` 0, `painter` 0, `lanes` 1 as a property key - three of the four are exactly as B.3 says.
**`on` is 2, and both lines are inside `TA-S33` `carryCheckInDraft` `:2018-:2036`, which is a MOVE
region.** In the codemod's own output they are `today-lanes.cjs:623-:624`. So after the cut they are
not in a released file - which is why the sentence reads defensibly - but they are inside
`createTodayLanes`, the factory that declares the callback table `on` at factory scope, and they
shadow it for the body of that loop.

Nothing in that loop body wants the table, so it is not a fault today. It is blocking for three
reasons: the census is the evidence the name was chosen on and R1 BLOCKING-1 was a name collision;
neither `census.cjs` (a shadow resolves locally, so it is not a crossing) nor a token scan can see
it; and the spec must not tell the build round that a name is absent when the parser says it is
present twice. Either say "0 in code position in the RELEASED HALF AFTER the cut, 2 inside `TA-S33`,
shadowed at `today-lanes.cjs:623`", or pick a fifth name. My own `capture.cjs` is the check that
would catch it once the table exists.

### BLOCKING-5. B.3's boot resolution supersedes `regions.json`, the headline interface counts are read off the superseded table, and the prescribed edit does not produce the design.

B.3 resolves the interleaved boot by turning `TA-S05`, `TA-S10`, `TA-S16` and `TA-S38` from `move`
to `seam` and splitting `TA-S35`, and says the build round's first act is that edit, "an edit to five
`kind` fields and one range, not a re-derivation". I made exactly that edit to a copy of
`regions.json` and re-ran both instruments at the tip.

| | as committed | after B.3's own revision |
|---|---|---|
| lines moved | 762 (685 + 41 + 36) | **762 minus 6 = 679 + 41 + 36**, so B.3's 679 is right |
| move / seam regions | 45 / 20 | **41 / 25**, not B.3's "40 move / 25 seam" |
| crossings | 282, 100 distinct | **286, 99 distinct** |
| released calls a sealed function | 42 | **47** |
| RELEASED ASSIGNS A SEALED BINDING | 25 | **24** |
| `ready` as a crossing | yes | **it stops crossing entirely** |

Three things follow.

1. **B.3's own interface table is read off the superseded run.** "the CALLBACK TABLE: 24 names, and
   the list is `CROSSINGS.md`'s RELEASED -> SEALED call rows" is 42 rows; after the revision it is
   47. "RELEASED ASSIGNS A SEALED BINDING 25 in 8 regions", which B.5 makes the acceptance test and
   H.2 STOP 1 makes the STOP list, is 24. H.4 prices "the released side's 119 reads and 42 calls ...
   161 released call sites"; it is 166. The appendix's item 3 says only that "the lines-moved figure
   then becomes 679, not 685" and does not say the census changes.
2. **The arithmetic is 41 / 25.** Four `kind` flips take 45 to 41; the `TA-S35` split keeps 41 and
   adds a seam. 40 counts the split as a fifth flip.
3. **And the edit does not produce the design.** With `TA-S38` a seam, `cut.cjs` leaves
   `let ready = settleAdoption(...)` in the released file - B.2 says so in terms, "a seam region is
   an annotation ... `cut.cjs` leaves every seam line where it is" - so `ready` is declared released,
   read released, and stops crossing. That directly contradicts B.3 consequence 3, "`ready` becomes
   sealed state with two assignment sites", and consequence 2's W8, which only has a subject if
   `willAdopt` ends up at factory scope. The boot seams are not `kind` flips at all: they are five
   RELEASED LINES REPLACED BY CALLS, which is a different operation from anything `regions.json`
   can express today. Say that, or `cut.cjs` gains a third kind (`replace`, with the replacement
   text as a declared row), which is the honest shape and is also the shape D.1's substitution
   table already has.

### BLOCKING-6. S-R17 (f)'s UNMEASURED mark is promised in the appendix and used nowhere.

S-R17 (f): *"a claim with no spike row is marked UNMEASURED"*. The appendix repeats it as a
convention the document follows: *"Where a claim has no spike row it is marked UNMEASURED in its own
section."* **The string `UNMEASURED` occurs exactly ONCE in 2184 lines, and that is the sentence
promising it.** Not one section carries the mark.

It is not a formality, because this spec deliberately mixes measured report with design, and a
reader cannot tell them apart without re-running the instruments, which is what the mark is for. The
sections that are design with no spike row are at least: B.4's paint-handle shape, B.6's outcome
table and its mapper, B.7's two api literals, B.8's seam-by-seam traces, B.9, D.2, D.2b, D.4, D.5,
D.6, E.4's fence method, E.5's eighteen red rows, E.6's "about twelve lines" runtime guard, and all
of H.4. Several of those are strong; the point is that B.5's twelve-row census table and B.6's
mapper read identically on the page and only one of them has been run.

The appendix's "What I did NOT verify" list is honest and does a lot of this work already. What is
missing is the mark at the point of use, which is what the PM ruled.

### BLOCKING-7. A number the spec itself retracts survives in two sections.

The R1-findings section, `:163-:165`, records: *"v2's sentence 'eleven sealed cells import the same
surface' was mine and it is wrong. Measured: SEVEN cells import `today-app.cjs` ... two more name it
as a literal ... and THREE import `today-model.cjs` only."*

`:845`, B.7: *"`:44` reads `const { mountToday, createTodayModel } = app;` off it, and **eleven
sealed cells import the same surface**. Nothing may move on it."*
`:1919`, G.4: *"whether it can carry a file **eleven sealed cells import**, which is a child argv
dependency."*

I counted at the tip: nine files in `today/test/` name `today-app.cjs` - `checkin.test.mjs`,
`copy.test.mjs`, `food.test.mjs`, `gym.test.mjs`, `problem.test.mjs`, `setup.test.mjs`,
`view.test.mjs` import it; `design.test.cjs` and `package.test.cjs` name it as a literal. Seven and
two, exactly as the spec's own correction says. G.4's conclusion is unaffected - S9 v4 `:160-:161`
settles it either way - but a spec that retracts a number in one section and carries it in two
others is telling an S10 reviewer something it has already said is untrue.

### BLOCKING-8. A thirteenth blind edge, in the class the guard exists for, in a moved region.

The appendix leans on the blind table as the statement of the instrument's boundary: *"`REACH.md`'s
twelve-row blind-edge table is where that boundary bites."* E.6 leans on it again for the argument
that the guard must be a runtime guard. The table is not complete for the three files it covers.

```
2058:    return import("./today-entry.mjs")
...
2077:        /* The same refresh binding today-entry.mjs boot() gives the first entry, so
2078:           Today keeps repainting itself from the durable log after every set. */
2079:        if (typeof next.setOnRefresh === "function") {
2080:          next.setOnRefresh(() => { if (screen === "today") render("today", false); });
```

Both lines are inside `TA-S34` `:2048-:2092`, a MOVE region, so after the cut they are sealed code.
`setOnRefresh` hands a closure to `today-entry.mjs`, a foreign module, which holds it and invokes it
"after every set" in the file's own words. The closure reads the RELEASED `screen` and calls the
RELEASED `render`. **That is a callback stored and invoked later, with no paint, no boot and no
gesture anywhere on the stack - the exact class E.6 exists for - and it is not in the blind table.**
`setOnRefresh` occurs ZERO times in the spec (`grep -c`: 0) and zero times in `REACH.md`. The
dynamic `import("./today-entry.mjs")` at `:2058` that mints the holder is not among the table's
dynamic-import rows either, though `food-host.mjs`, `sleep-host.mjs` and
`machine-settings-host.mjs` are.

Nothing breaks today: the closure reaches no PUT, only `render`. It is blocking because the table is
the spec's stated boundary and because the build round has to decide what `setOnRefresh`'s closure
becomes when `screen` is `painter.screenNow()` and `render` is `painter.repaint(...)` - a paint
handle called by a foreign module out of band, which is a sentence B.4 does not contain. Add the
two rows, and say in B.4 that one paint-handle consumer is not the view.

---

## PART 4 - NOTES (not blocking)

**NOTE-1. "282 crossing references" is 282 ROWS, and the reference count is 311.** `census.cjs:178`
de-duplicates on `(outFile, name, kind, sourceLine)`. I counted the raw unresolved non-global
references over the same six output files: **311**. Twenty-nine references are collapsed because two
or more of the same name and kind sit on one source line. Call the headline "282 crossing rows over
311 references", or the build round will size a rewrite off it and be short, as BLOCKING-3's `screen`
already shows (9 rows, 15 occurrences).

**NOTE-2. `census.cjs` cannot be pointed at the build round's own output, and H.2 STOP 11 and H.3
both require exactly that.** `OUTPUT_PAIRS` at `:138-:145` is a hard-coded list of the six filenames
`cut.cjs` writes; `:39` reads `linemap.json` out of the cut directory; `:37` reads `regions.json`
from `__dirname`; the declaration index is built from the UNCUT source at `--root`. To run it over
the real `today-app.cjs` / `today-lanes.cjs` after the interface exists, the instrument needs a
source-of-record for declarations and a way to live without a line map. That is instrument work in
the build round and H.4's "the proof scripts of D: 3 to 5, D.1 is inherited from the spike" does not
carry it.

**NOTE-3. `reach.cjs` counts only INLINE function literals as listener roots, and the spec repeats
its count as an installation count.** `reach.cjs:172-:178` takes the second argument of
`addEventListener` only if it is a function node the walker recorded. `today-app.cjs` has **27**
`addEventListener` sites; `REACH.md` says 25 listener installations; H.1 risk 1 makes that number
the thing D.2b's census has "to hit". The two it cannot see are `:1054`
`sheet.querySelector('[data-action="cancel"]').addEventListener("click", close);` (a named function
declaration) and `:2390` `phone.addEventListener("keydown", onPhoneKeydown);` (an arrow in a
`const`). Neither reaches a PUT, so no REACH row changes and E.6's nine-callback subject list stands.
`gym-app.mjs`'s 19 is right. Fix the number to 27, or say it is a root count.

**NOTE-4. `on.listen` has no standing fence row, and after S10 that is a live-fire risk.** E.6 makes
the runtime guard depend on "the released view installs EVERY listener through `on.listen`", which
is 27 and 19 call sites in two files six look tickets may edit. H.1 risk 1 mitigates it with a
one-time build-round census. But G.3 lets C-UI-2, C-UI-3, C-UI-6 and C-UI-7 edit `today-app.cjs`
afterwards, and a plain `addEventListener` added by any of them leaves `gestureOpen` false, so a
guarded writer called from that handler throws `WRITER-OUTSIDE-GESTURE` in front of the athlete
rather than saving. A nineteenth red row - a released file calling `addEventListener` outside
`on.listen` FAILS - costs one token-scan line and turns a one-time census into a standing law. E.4's
scan already reads member names.

**NOTE-5. B.7's quoted gym api block mis-cites three of its six lines.** The block gives `read` at
`:576`, `stateFor` at `:577` and `owns` at `:579`. At the tip they are `:575`, `:576` and `:578`;
`:579` is the closing `});`. The spike's own rows say so: `settingsReading read :575`,
`settingsRead read :576`. The substance - five of six thunks close over bindings B.9 moves sealed,
`lane: () => settingsLane` among them - I verified and it is exactly right. Related: the paragraph
says "the object stays extensible and in its own key order", and `first.settings` is
`Object.freeze({...})` at `:569`. If "the object" means `first`, say so.

**NOTE-6. F.1's composition line is not the thing that went green.** F.1 writes
`createReadingsWriter({ day, readings, adoptedRead, stateFromOps, noStore: NO_STORE, setMessage,
read: () => read() })`. The factory `cut.cjs` wrote and the suite passed destructures
`{ day, readings, adoptedRead, stateFromOps, read, NO_STORE, setMessage }`, and the shim in
`regions.json` passes `NO_STORE` in shorthand. As F.1 writes it the sibling receives `undefined` for
its no-store refusal. One word, in the one paragraph the spec calls "a report rather than a plan".

**NOTE-7. G.4's path table declares FOUR `new` paths and the sentence below says three.**
`today-lanes.cjs`, `gym-settings-lane.mjs`, `today-readings.cjs` and
`rebuild/lanes/c/ui-port/writer-fence.test.mjs` are all `new`. "Three `released` entries and three
`new` ones" should read three and four, and v1's stop condition 8 comparison should be re-read
against four.

**NOTE-8. E.5's "eighteen red rows" cannot be read as printed.** The list runs 6, 7, 8, then jumps
to 12, 13, 14, 15, 16; rows 9, 10 and 11 never appear anywhere in the document. The total reconciles
only if v1's five planted tricks and five structural rows are counted unnumbered alongside the eight
numbered ones. Print the eighteen as eighteen numbered rows, because H.3 requires the cell RED first
"on all eighteen rows" and a build round cannot count them from this section.

**NOTE-9. D.3's reason for the NOTE-6 ordering constraint is not what the script does.** D.3 says
"`cut.cjs` emits moved regions in table order, so the constraint is carried by the table". `cut.cjs`
sorts the resolved regions by START LINE (`:135`) and filters the moves out of that sorted list
(`:195`), so it emits in SOURCE order. The outcome is the same and is STRONGER - a table edit that
reordered rows could not break it - and the spec should claim the stronger thing.

**NOTE-10. D.3's fourth required edit is an edit to a cell that does not exist.** H18 is a planned
S9 hunk. At the tip `today/test/package.test.cjs` contains no `REQUIRED_INPUTS` literal and no
`today/` count; S9's own spec says so at `:272` ("There is NO count and NO literal for the `today/**`
half"). I verified `build.mjs:98-:201` myself: **48 entries, 26 under `w7-preview/today/`**, so
48 -> 51 and 26 -> 29 are both right. But the edit fires only if S9 lands H18 first. D.3 calls it
"declared rather than conditional"; it is declared AND conditional, and G.4's precondition list
should carry it.

**NOTE-11. The census's own residue is zero and that is worth recording.** `census.cjs` drops into
an "unresolved AND not declared in the source file either" bucket any name it cannot explain. At
both refs that bucket is **0**. There is no instrument residue to argue about, which is the strongest
single fact about the census and the spec does not state it.

**NOTE-12. What I agree with the author about, against a reader's likely objection.** Four things in
this spec are better than anything the three earlier rounds produced and a round 4 must not lose
them. The region table anchored by content rather than by line number, which I proved survives a
32-line shift at S9 and refuses on a mangled first anchor. The three-way PUT / STORE / ADOPT split,
which settles R2 BLOCKING-2 by measurement rather than by argument and which `reach.cjs` and E.4's
receiver exemptions now share by construction. The decision to name `gym-app.mjs:546` as a
pre-existing fact and carry it as its own ticket instead of fixing it inside a pure move, which is
S-R12 obeyed exactly. And F.1, which is the only part of this design that is not a hypothesis: I ran
it and it is green.

---

## PART 5 - R2's EIGHT BLOCKING FINDINGS AND ELEVEN NOTES

R2 carries eleven numbered notes, not twelve; the spec says so at `:250` and reads the twelfth as
NOTE-10's three cite corrections, which I accept.

| R2 | my verdict | evidence |
|---|---|---|
| **BLOCKING-1** the `:1435` write of `sleepCheckInViewPending` | **FIXED** | `CROSSINGS.md` carries it as `sleepCheckInViewPending write :1435, sits in TA-M07, declared TA-S09 :474`, one of 25 rows in 8 regions; `TA-M07` is one of the three the alignment check flags, statement `:1435-:1444`. I reproduced both. B.5 disposes of it by name |
| **BLOCKING-2** E.6's ENTRY cell contradicts itself | **FIXED**, and R2's substance UPHELD by a different route | `REACH.md` at both refs: the four ENTRY callbacks reach no PUT. E.3's three-way split is real and E.6's cell is re-aimed at PUT only. R2 was right that the word list was the fault |
| **BLOCKING-3** `gym-app.mjs:546` in `paint()` | **FIXED by naming it** | one durable PUT reached from a paint root, at both refs, reproduced. `start` is off the guarded list with the reason written, red row 16 stops a second, B.9 names the ticket. This is what S-R12 asks for |
| **BLOCKING-4** the api literal, and the second pass-through | **FIXED**, and the spike found a third the review did not | `importScreen read :2556` and `workout read :2568` both in `TA-M14`; the literal is rewritten; `workoutEntry` gets E.5 row 14; B.1 point 4 carries the S-R2 qualification. `gym-app.mjs:569-:579` is a second api and `lane: () => settingsLane` a third pass-through - I verified the five sealed bindings in the census. See NOTE-5 for three wrong line cites in the quoted block |
| **BLOCKING-5** rows 30 and 31, SEAMS 6 and 7 | **FIXED** | `TA-M12` `:2349-:2351`, `TA-M13` `:2364-:2365`. I read the bounds myself: `:2343 if (next === "recovery") {`, `:2354 }`, `:2355` measure, `:2356` import, `:2359 if (next === "workout") {`, `:2374 }`. The ranges are now anchors a script resolves, which is the right answer to a class of error two rounds hit |
| **BLOCKING-6** `sleepClockCheck` cannot move whole | **FIXED, and R2's proposed fix correctly refused** | `sleepTyped call :1386, sits in TA-S26, declared RELEASED at :1378` is a SEALED CALLS A RELEASED FUNCTION row, one of 34 in 7 names, and the class disposition is an injected reference. So the region moves byte for byte and no W8 is needed for it. R2's finding was right and its remedy was more expensive than the measurement allows; the spike wins and says so |
| **BLOCKING-7** `REQUIRED_INPUTS` is 48 | **FIXED, DISPUTE WITHDRAWN, and R1 and R2 are right** | I re-measured at the current tip: 48 lines matching `^\s*"rebuild/` between `:98` and `:201`, 26 containing `w7-preview/today/`. The quoted-literal method gives 49 on my run, which is a third number and makes R2's point about the method better than R2 did |
| **BLOCKING-8** the fence's three false positives, one a real leak | **FIXED** | `TA-M03` `:718-:719` is its own declared seam, so the leak is removed by moving the line rather than exempted; `Promise` and `entry` get receiver exemptions shared with `reach.cjs`'s own NOT-A-STORE-RECEIVER list; and the spec separates the two instruments correctly - the census is what catches `importScreen`, not the reach table |

**All eight of R2's blocking findings are FIXED. None is STILL OPEN and no R2 dispute needed
upholding.** That is the first time in four rounds that has been true, and it should be said to the
PM plainly: my eight are new findings against the instruments and the arithmetic, not a fourth
re-run of the same ground.

| R2 note | my verdict | evidence |
|---|---|---|
| **NOTE-1** `lanes` is 1 as a property key | **FIXED** | I parsed it: `lanes property key :2196`, and 0 in code position. B.3 states it that way. But see BLOCKING-4: the same census is wrong about `on` |
| **NOTE-2** five paint entries or six; strike `paintTodayEntry` from W4 | **FIXED** | `screen` is read in `TA-S13`, `TA-S18`, `TA-S19`, `TA-S20`, `TA-S27` and `TA-S34`, and `paintTodayEntry` is a CALL from `TA-S22` at `:785`. W4's list is corrected to those six. But the ref count is 9 rows over 15 occurrences (BLOCKING-3) |
| **NOTE-3** SEAM 2's trace contradicts its placement | **FIXED by decision** | B.8 fixes the order as today's, `:1295` `:1297` `:1298`, and moves `render(...)` out of the moved region. The spec says plainly that the spike does not settle this one and does not pretend it does, which is the right way to carry a non-measurement |
| **NOTE-4** `session()`, `checkinSummary()`, `firstRun()` | **FIXED** | `TA-S01` `:362-:365` and `TA-S02` `:370-:384` carry all three, and the census shows why they had to move: `session` called at `:887`, `checkinSummary` at `:2253`, `firstRun` at six sites |
| **NOTE-5** the gym card needs four in-flight flags | **ACCEPTED and narrowed by measurement** | `REACH.md` shows `:419`, `:444`, `:498`, `:505` listener-reached only; all seven writers get a sealed flag; priced in H.4 |
| **NOTE-6** `food.test.mjs`'s declaration ORDER constraint | **FIXED**, with the reason slightly wrong | `regions.json` orders `TA-S17` `:569-:591` before `TA-S18` `:593-:618` and the constraint holds, but it is carried by SOURCE order, not table order: see NOTE-9 in PART 4 |
| **NOTE-7** the re-export of `createTodayModel` | **ACCEPTED** | B.7 states the fork: under F.1 as recommended `today-app.cjs:16` is untouched and E.5 row 7 belongs to F.1 (d) only |
| **NOTE-8** G.4 should cite S9's argv measurement | **FIXED** | G.4 cites `S9-RELEASE-SPEC.md:160-:161` at `da9f8683`; I read those lines myself and they say 25 children, 68 argv targets, all test cells |
| **NOTE-9** the estimate | **ACCEPTED in direction, and I do not accept the review number coming DOWN** | H.4 is 51 to 67 build, 12 to 16 review. The build band is honest and I would keep it. The review band is argued down from R2's 14 to 18 because "the census is now three commands that run in a minute". That argument is exactly backwards after PART 2: the three commands run in a minute AND the reviewer must now also attack the instruments, which is where this round's eight findings came from. My band is **51 to 67 build, 14 to 18 review**, R2's number, for R2's reasons plus one more |
| **NOTE-10 (a)(b)(c)** three cite corrections | **FIXED** | `:2600-:2625` I read; `TA-M08` is `:1539-:1542`; B.9's `refuse()` corrected |
| **NOTE-11** what R2 agrees with | **RECORDED** | I agree with all of it, including that `mountToken += 1` at `:2296` stays released on the file's own words at `:1921-:1926`, and with R2's answers to Q1, Q2, Q4, Q5 and Q7, which S-R10 to S-R16 have since ruled the same way |

---

## PART 6 - S-R10 TO S-R18, CARRIED OUT OR NOT

| ruling | carried out? |
|---|---|
| **S-R10** the weigh-in writer to a sealed sibling; `read()`, the projection, `adoptBasis`/`setPendingAdoption` and `marchingOrderSentence` FREE | **YES**, and it is the one part that has been run. F.1's table is exact against the source, `TM-S01`-`TM-S03` are `:365-:374`, `:378-:398`, `:401-:405`, and the composition is green. NOTE-6 is one word in the composition line |
| **S-R11** `food-model.cjs`, `sleep-model.cjs`, `machine-settings-view.mjs` pinned-unchanged | **YES**, G.4's path table declares all three and H.5 item 4 is closed |
| **S-R12** the guard's subject list MACHINE-DERIVED; paint-reached writers named, not fixed; E.3 split | **YES, fully, and this is the ruling the round carries out best.** Nine guarded, `start` off with the reason, `retryFoodRead` and `retrySleepRead` off by the same rule, one paint-reached PUT named and left byte-identical with its own ticket and red row 16. I reproduced the whole table at both refs |
| **S-R13** the fence asserts ZERO athlete-facing string literals in the sealed lane modules | **YES**, with the measured exception `today-readings.cjs`'s four constants declared by name and a red row for a fifth (E.5 row 15, Q9). D.3's nine widenings are struck |
| **S-R14** S10 releases and changes both files in the same package | **YES**, G.4 states it in the S10 brief's own words, cites S9's H4 and `:1829-:1833`, and NOTE-8's argv measurement |
| **S-R15** `mountToken += 1` at `:2296` stays released | **YES**, B.4 and B.5 keep it with the file's own words at `:1921-:1926` |
| **S-R16** the build does not wait for the copy lock; the landing does | **YES**, G.4's four numbered points, and H.2 stop 10 carries the sequencing mistake |
| **S-R17 (a)** region table anchored by content | **YES**, and it survives the S9 shift. Weakened by BLOCKING-2: the last anchor is not guarded |
| **S-R17 (b)** codemod, verbatim, declared substitutions only | **PARTLY. The codemod is real; the verbatim CHECK does not exist** (BLOCKING-1) |
| **S-R17 (c)** machine census by scope analysis | **YES**, and it passes its own planted tests (PART 2 (a)). NOTE-1 and NOTE-2 qualify it |
| **S-R17 (d)** reachability table | **YES**, 62 rows at both refs, one paint-reached PUT. NOTE-3 qualifies the listener roots |
| **S-R17 (e)** the suites on the output | **YES**, and I reproduced both results, the pure move's failure and the wired 682 |
| **S-R17 (f)** the spec written FROM the tables; UNMEASURED marks; the spike wins | **PARTLY. The spec is genuinely written from the tables** and the ten spike-versus-spec rows are all carried with a disposition. **The UNMEASURED mark is promised and never used** (BLOCKING-6), and two of the tables' own rows are transcribed wrong (BLOCKING-3) |
| **S-R17 (g)** the seam list is the machine's; the two STOP classes | **YES**, H.2 STOP 1 is replaced correctly, 25 assignment rows and 5 statement-rewrite substitutions are declared in advance as STOPs. BLOCKING-5 is that the boot seams are a third operation the table cannot express |
| **S-R18** 48 becomes 51, 26 becomes 29, `package.test.cjs` a declared S10 edit | **YES**, and I re-measured 48 and 26 myself. NOTE-10 is that the fourth edit depends on H18 landing |

### One ruling I would argue with, for the PM, with evidence

**S-R17 (b) and (g) treat the codemod as the proof of the move. It is not a proof; it is a
generator.** The PM's method is right and the finding in PART 2 (b) is not an argument against it.
But the ruling as written ("a CODEMOD that moves regions VERBATIM ... so the pure-move rule D.1 is
checked mechanically: moved bytes equal source bytes except listed rows") asks a generator to be its
own check, and a generator cannot be. The thing that is actually being claimed - that the bytes the
build round ships are the bytes this spec was reviewed against - needs a witness recorded OUTSIDE
the run: a per-region sha256 in `regions.json`, taken at a named ref. Without it, "0 regions whose
bytes differ" is true of a tree with the sleep writer's double-write fence removed, which I
demonstrated. **One extra field in the table and eight lines in `cut.cjs` turn the ruling into the
thing it says it is**, and the build round should be told to do that before it does anything else,
alongside B.3's `kind` edits.

I am not asking for a different method. I am asking for the method to be finished.

---

## PART 7 - DIRECTION, AND WHETHER A BUILD ROUND CAN START

**Extracting the WRITERS is still better than extracting the view. The PM's ruling should stand, and
this is the third independent hand to say so.** I did not re-score the seven criteria from scratch;
R1 and R2 did that carefully and I checked the two columns that the new evidence could move.

**DATA SAFETY.** R1 scored v1 and R2 kept it there with three unresolved released-side decisions.
Two of those three are now disposed of by name and by measurement (`:1435` as `TA-M07` with
`on.readSleepCheckInView`, `:718-:719` as `TA-M03` moving with the import). The third, the gym card's
released `busy` as the only duplicate guard on four writers, is closed by extending the sealed
in-flight flag to all seven. What replaces them is a measured list rather than an argument: 25
released-assigns-sealed rows in 8 regions, each with a callback, and an acceptance number of ZERO
that a machine prints. **The column is now close, and it is the first round in which the spec can
say WHICH released decisions remain rather than that none do.** Two do, both declared: `:2296`'s
mount bump under S-R15, and `gym-app.mjs:546` under S-R12.

**REGRESSION RISK.** Unchanged, and better evidenced. The proof is stronger than v2's in every way
except the one PART 2 (b) names, and that is fixable in eight lines.

**Net: still four to three, and the two v1 wins are still about the transition.** I would add one
sentence for the PM that no round has said: the thing that makes this direction win is not the line
count, it is that after the split the sealed surface is three small modules with a named interface
the machine can re-derive in a minute at any ref. That property is what made THIS review possible,
and it is what will make C-UI-2 through C-UI-7 reviewable. v1's frozen view-model had no equivalent.

### Can a build round start from this spec?

**Yes, and it should, once the eight blocking findings are carried out. Six of the eight are edits to
the spec and two are edits to the instruments, and none of them is design work.** What the build
round must NOT do, in order:

1. **It must not treat `cut.cjs`'s "regions whose bytes differ with no declared row: 0" as a check.**
   Add the per-region sha256 to `regions.json` and the comparison to `cut.cjs`, re-run D.1's own
   red-first test 1, and see it FAIL naming `TA-S30` before believing any later run.

2. **It must not re-run the cut against a tree the design lane has touched without guarding the LAST
   anchor.** 24 move regions end on a bare two-space brace. Add the ambiguity refusal and assert the
   per-file moved-line totals, and only then re-run at both refs.
3. **It must not price the interface off B.5's `mountToken` and `render` rows.** They are 16 and
   23-in-11, not 12 and 21-in-8, and `screen`'s W4 is 15 occurrences, not 9. Re-read all three off
   `CROSSINGS.md` before writing a line of the facade.
4. **It must not ship B.3's boot resolution as "five `kind` fields and one range".** That edit gives
   41 move / 25 seam, 679 lines, 286 crossings and a `ready` that stays RELEASED, which is not the
   design B.3 describes. Decide first whether `regions.json` gains a `replace` kind or whether the
   five boot statements are written by hand as declared substitutions, and re-run the census after,
   because B.3's own interface counts change with it.
5. **It must not assert that `on` is absent from the released files.** Two occurrences,
   `today-app.cjs:2027-:2028`, both inside `TA-S33`, both landing in `today-lanes.cjs` where they
   shadow the callback table. Either rename or state the shadow, and run a capture check on the
   output, because neither the census nor a token scan can see it.
6. **It must not report the today step from a contended machine.** `681 / 680 / 1` with
   `journey.test.mjs` SIGKILLed is what the farm's two CPUs produce under load, twice now. Re-run
   alone.
7. **It must not treat `census.cjs` as ready to run on its own output.** H.2 STOP 11 and H.3 both
   require it; the instrument is hard-wired to `cut.cjs`'s six filenames and its line map. That is
   instrument work, and it belongs in the estimate.
8. **It must not touch product bytes on the lane branch before S10 carries them** (G.4, H.2 stop
   10), and it must not open `rebuild/conform/private`, `src/history.js`, any `ledger/`, or the
   soak.

The one thing I would ask the PM to consider adding, at zero code cost: E.5's nineteenth red row for
a released `addEventListener` outside `on.listen` (NOTE-4). Everything else in E, B and D is sound.

---

## What I did NOT verify

1. **I did not read B.8's eleven seam traces, B.9's gym design or C.2's citation lists line by
   line.** I read B.1 to B.7, B.9's api half, D.1, D.3, D.4, E.3 to E.6, F.1, F.2, G.3, G.4, H.2,
   H.4, H.5, H.6 and the appendix in full, and the rest by section heading. B.8 and C.2 carry R1's
   and v1's work, which two reviewers have already checked.
2. **I did not build, seal, package or gate anything.** No `b-package.cjs`, no bundle, no browser,
   no design gate, no soak, no PC test run. Nothing on the owner's data path was opened, no
   `rebuild/conform/private`, no `src/history.js`, no `ledger/`. Every fixture named here is
   synthetic and the owner's real measurements are not in this session.
3. **I did not re-run the PURE-MOVE suite overlay.** I reproduced the crossing that causes it
   (`weighIn` unresolved in `today-model.cjs`) and the `node --check` result, and I took D.3's
   `1 pass / 22 fail` row from the spike, which ran it twice.
4. **I did not run the fence, the guard, the copy census or any of D.2, D.2b, D.4, D.5 or D.6.**
   None of them exists yet; BLOCKING-6 is about saying so in the sections that describe them.
5. **I did not read the S9 runner's code**, only `S9-RELEASE-SPEC.md` at `da9f8683` around `:160`,
   `:206`, `:272` and `:320`, enough to check G.4's citation and NOTE-10.
6. **My own `capture.cjs` is not committed** and is not proposed as a product instrument. It lives
   in farm scratch with the rest of this review's working, and the build round should rewrite it
   rather than inherit it.
7. **This review is a hypothesis too.** Every finding above is a command a fourth hand can re-run in
   under two minutes from the committed instruments, except the today step, which needs six minutes
   and the machine to itself. Disagree with it where the evidence lets you.
