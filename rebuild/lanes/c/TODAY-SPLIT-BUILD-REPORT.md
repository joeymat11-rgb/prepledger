# TODAY-SPLIT BUILD, PART 1 - AUTHOR REPORT

**FIX ROUND (R1).** The first author is gone. This report is theirs, continued: their product
bytes are untouched and their sections stand, and every R1 finding is answered in the new
section **"R1 findings: fixed or disputed"** below, which a reader should take first. Nothing
in this round moves a product byte; all five files it changes are instruments, the fence, this
report and a new crossing table. Fix-round author: cowork (Earned lane hand, lane C).

Author: cowork (Earned lane hand, lane C). Branch `rebuild/c-today-split-build`, cut from
`rebuild/c-today-split` at `a2632a3b` and MERGED with the S9 lane head
`origin/rebuild/b-s9-ui-pins` (`da9f8683`) as the first act, no conflict, merge commit
`4aadb0f3`. The merge takes the S9 forms of all three cut files, which I proved by hash:
`today-app.cjs`, `today-model.cjs` and `gym-app.mjs` on the merged branch are byte-identical
to the same three files at `da9f8683`.

**What moved.** `today-model.cjs`'s weigh-in writer into a new sealed
`rebuild/m3/w7-preview/today/today-readings.cjs`, and `gym-app.mjs`'s machine settings lane
into a new sealed `rebuild/m3/w7-preview/today/gym-settings-lane.mjs`. **`today-app.cjs` is
BYTE-IDENTICAL**: pre and post sha256 are the same hash, and the big cut is part 2.

**What I did not open.** No `rebuild/conform/private`, no `src/history.js`, no `ledger/`, no
`C:\Users\joeym\EarnedPort`, no `port-real.log`, no soak, no browser, no
`b-package.cjs --full`, no junction to the private census. I wrote no line of
`rebuild/DECISIONS.md` and no line of `rebuild/lanes/STATUS.md`. Every fixture named here is
synthetic. The owner's real measurements are not in this session.

---

## 0. THE HEADLINE, AND THE ONE STOP

| | |
|---|---|
| the today step on the PC, BEFORE my first product edit | **682 tests, 680 pass, 2 fail**, 161.5 s |
| the today step on the PC, AFTER my last product edit | **682 tests, 680 pass, 2 fail**, 159.0 s |
| the two failures | `boundary.test.mjs` **P-MEASURE (g)** and `setup.test.mjs` **re-pin**, the two known pre-existing reds of `DECISIONS:552`, red on the S9 lane until `packages/S9.json` exists. They are the SAME two before and after |
| the writer fence, on the PC | **26 rows, 26 pass**, twelve of them RED first (was 21 / 21 with 8 red at R1) |
| the ten lane-d cells run on the PC (**two** of which name either cut file: R1 NOTE-5 is right and the wording is corrected in section 7) | **107 tests, 107 pass** |
| the instruments' own cell, in the farm | **20 rows, 20 pass** at the fix-round head, AT BOTH NAMED REFS (`SPLIT_TEST_REF=s9` and `=tip`); it reads its sources from git, so it no longer goes dark when a file it measures is cut (R1 BLOCKING-1) |
| `b-package.cjs --ci --package S8` | refuses by design: `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`, exit 1. Recorded, not chased |

### THE STOP, and I am reporting it rather than bending it

**A FIFTH REQUIRED TEST EDIT. H.2 STOP 5 FIRES.** `machine-settings-ui.test.mjs:772` reads
`gym-app.mjs` and asserts it contains `import('./machine-settings-host.mjs')`. The dynamic
import is inside `openSettingsLane`, which is `GA-S04`, a move region, so after the cut the
import is in `gym-settings-lane.mjs` and the assertion is false. D.3 declares FOUR required
test edits and this is not one of them.

What I did, and the PM may reverse it: I re-pointed the assertion at the sealed half and
ADDED a second one that the released card must NOT name the host import. No tooth is lost and
one is gained, and it is the same class as the two edits D.3 does declare (a one-string change
of which file is sliced, for the same reason B.10 gives for `assertImportRouteIsolation`). But
D.3 does not name it, so it is a STOP and it is at the top of this report rather than inside
it. Without it, cut two cannot be green and part 1 stalls.

### THE SECOND STOP, declared rather than discovered

**`GA-M01` (SEAM G1, `recordSettings`, `gym-app.mjs:286-:318`) is a seam whose RELEASED half
decides what is stored.** It validates through `MachineSettingsView.machineFromDraft` and
`acceptable`, and then calls `settingsLane.save(machine)`. That is exactly the S-R17 (g) STOP
class. It is PRE-EXISTING, the spec carries it as SEAM G1, and B.9's disposal - an `editSeq`
token minted and compared inside the seal, so the seal can refuse a draft object the view
mints - is a hand-written durable writer and is part 2. **In part 1 `recordSettings` stays
released and byte-identical**, and only the two lines that reach the sealed lane
(`GA-R04`, `GA-R05`) are declared rewrites. The writer fence names the six durable writers the
released gym card still carries, by region id, and a SEVENTH fails.

I did not weaken a law, a guard, a pin or a test anywhere in this part.

---

## R1 FINDINGS: FIXED OR DISPUTED

Review: `rebuild/lanes/c/TODAY-SPLIT-BUILD-REVIEW-R1.md`, REJECT on two blocking findings,
neither in the product bytes. **I dispute none of them.** Both blocking findings reproduced
on the first attempt, both are closed red first, and five of the seven notes are closed as
well. Nothing in this round moves a product byte: `today-app.cjs`, `today-model.cjs`,
`gym-app.mjs`, `today-readings.cjs`, `gym-settings-lane.mjs`, `build.mjs` and every test cell
are byte-identical to the head R1 reviewed, which the byte-for-byte row in section 6 now
proves mechanically rather than by assertion.

| R1 | verdict | where |
|---|---|---|
| **BLOCKING-1** the instruments' cell is 10 of 14 at the shipped head | **FIXED, and the cause removed** | below |
| **BLOCKING-2** the fence's suppression list has an application name in it | **FIXED, red first, and a second hole found beside it** | below |
| NOTE-1 the declared substitution TEXT carries no witness | **FIXED, red first with R1's own attack** | below |
| NOTE-2 `capture.cjs` has never run on the bytes that ship | **FIXED by proving the bytes identical** | section 6 |
| NOTE-3 the fence has eight RED rows, not nine | **FIXED: the missing red row is committed, and three more** | section 7 |
| NOTE-4 the fifth test edit is outside D.3 | **NOT MINE TO RULE. It stands, unchanged, for the PM** | below |
| NOTE-5 the lane-d description is wrong, the result is right | **FIXED: wording corrected, number stands** | section 7 |
| NOTE-6 the `replace` kind's witness is never the check that refuses | **AGREED, and left as it is, with the reason** | below |
| NOTE-7 count drift, 1243 against 1277 | **RE-MEASURED, 1243, and NOT reproduced. UNMEASURED item 11** | section 6 |
| closing note: a regenerated crossing table | **DONE: `PART1-CROSSINGS.md`, 20 rows with a disposition each** | section 6 |

### BLOCKING-1, and why the fix is structural and not a number

Reproduced exactly: **10 pass / 4 fail** at `62e4931f`, all four dying on
`REFUSED: gym-app.mjs GA-S01: first anchor matches ZERO places`. R1's diagnosis is right and
it is not a stale number: `tmpTree()` copied the three files out of the **working tree**, so
the build's own product commit made the table stop resolving against the tree it was read
from. Part 2 cuts `today-app.cjs` and would take the remaining ten rows dark the same way.

**The cell now reads its sources with `git show <ref>:<path>`, at a ref the witness block
itself NAMES.** Nothing in it ever opens the working tree's copy of a cut file, so it will
keep running after part 2. `SPLIT_TEST_REF` chooses the ref and defaults to `s9`, the build's
base; measured **20 / 20 at `s9` and 20 / 20 at `tip`**. A new row proves the fix rather than
asserting it: it checks that the working tree's `gym-app.mjs` HAS been cut, that the ref's has
not, and that the full cut runs green on the ref's.

### BLOCKING-2, reproduced, and a second hole beside it

Reproduced: `entry` and `importScreen` were application identifiers on a list of nine
JavaScript builtins, carrying no comment and no red row, and `entry` is a live local in
`paintSettings`. Both are **dropped**. Measured first: neither name is the receiver of a
fenced word anywhere in the four files of this part, so dropping them costs nothing here.

**Reproduced end to end, red first, on the same planted tree.** I took R1's attack line
(`if (entry) entry.save({ lift: liftId, note: 0 });`, planted just after
`const entry = facade.entryFor(liftId);`), pointed BOTH fences at that tree, and ran them:

| fence | on R1's planted durable write |
|---|---|
| the fence as R1 reviewed it (`f9ec6f0f`) | **21 tests, 21 pass, 0 fail.** The write went through |
| the fence in this round | **26 tests, 25 pass, 1 fail**, naming `FENCE-WRITER-NAME: the released gym-app.mjs holds EXACTLY the six declared seam WRITE SITES, and a seventh fails` |

**The rule that keeps them out is now a measurement, not a comment.** A new row asserts that
every suppressed receiver is an own property of `globalThis`, so no application identifier can
be put back on that list without the row failing. Two red rows plant R1's own attack
(`if (entry) entry.save({ lift: liftId, note: 'x' });` at `gym-app.mjs:223`) and its twin
through `importScreen`.

**Planting R1's attack found a SECOND hole in the same row, which R1 did not name.** The seam
row compared the SET OF NAMES the released card reaches. `entry.save` adds an occurrence of
`save`, and `save` was already one of the six declared names, so the seam row stayed green on
it even after the receiver check went red. The row is now keyed by **SITE**
(`receiver.name`) and asserts the **site count** as well, so neither a new receiver nor a
second call through an already-declared one gets through:

```
released gym-app.mjs write sites: :276 (call).save, :390 model.logSet, :415 model.finish,
                                  :469 model.forget, :476 model.undo, :517 model.start
```

**`reach.cjs` keeps its longer list and the two instruments are deliberately no longer the
same list**, with the reason written into the fence: `reach.cjs` CLASSIFIES call sites and
marks its own false positives in a column a reader can disagree with row by row; this cell
REFUSES, so a suppression here is a hole and a suppression there is an annotation. The one
real case `reach.cjs` suppresses that the fence will meet in part 2 is
`importScreen.reopen()` at `today-app.cjs:718`, a screen reopened and not a reading; part 2
declares it BY LINE, the way the six gym seams are declared, not by exempting the name.

### NOTE-1, the declared TEXT, closed with R1's own attack

R1 rewrote `regions.json`'s `W6d` row so the sealed weigh-in reports success whatever the
client answered, left every moved byte verbatim, and the cut **exited 0**. Reproduced.

`regions.json` gains `witness.declared`: a sha256 per substitution row over
`[id, file, region, from, to, kind]`, a sha256 per replacement row over
`[id, file, replacement]`, and the two ROW COUNTS. `gen-witness.cjs --declared` takes it;
`cut.cjs` checks it **before it opens a single source file** and refuses by row id. The two
digest functions are duplicated verbatim in the checker on purpose: the checker must not
import its digest from the generator, or the generator is its own check again.

```
REFUSED: substitution row W6d (today-model.cjs TM-S02): DECLARED TEXT DOES NOT MATCH THE
  WITNESS. The row now hashes f2ead4b596bc30bd..., the witness records 90c0edbb7602107e.
  The bytes this row WRITES into a sealed product file are not the bytes the spec was
  reviewed against (R1 NOTE-1).
```

Three red rows: R1's `W6d` attack, a replacement row's text rewritten, and a substitution row
ADDED (refused by the recorded count, `the table declares 8 ... the witness records 7`).
**What this is not** is UNMEASURED item 12: it is tamper evidence over authored text, not an
independent oracle, and the control is the visible diff a re-take leaves in `regions.json`.
Seven substitution rows and eleven replacement rows are witnessed.

### NOTE-4, the fifth test edit: NOT MINE TO RULE

R1 is right that the PM has to ratify it, and right that the edit itself is strictly stronger.
I have changed nothing about it: `machine-settings-ui.test.mjs` is byte-identical to the head
R1 reviewed. It stays at the top of this report as the STOP it is. **Open question for the
PM**, carried unchanged into this round.

### NOTE-6, agreed and left alone, with the reason

R1 tampered a `replace` region's pre-image twice and both were refused by the anchor resolver
rather than by the witness, because every declared `replace` region is one or two lines and
all of its lines are anchors. That is true, I reproduce it, and it does no harm: the region
still refuses BY ID, which is the contract. I have not restructured the witness to fire first
on a one-line region, because the order R1 sees is the order S-R20 rules (extent before
bytes) and changing it to make a message nicer would weaken the reason the order exists. It
matters the day a longer `replace` row is declared, and part 2 declares five of them; the
declared-text witness of NOTE-1 now also covers every `replace` row's REPLACEMENT text, which
is the half of a `replace` row that reaches a product file.

---

## 1. THE INSTRUMENTS (S-R19, S-R20, S-R21, S-R23, S-R24), EACH RED FIRST

### 1.1 What was wrong, reproduced against the committed instruments FIRST

Before I changed a line, I re-ran R3's three attacks against the instruments as committed at
`a2632a3b`, in a farm scratch, on a throwaway copy of the three files.

| attack | what the committed cut did |
|---|---|
| R3's own: `today-app.cjs:1808`, the sleep writer's double-write fence `if (sleepBusy \|\| sleepUnknown \|\| sleepReadBack) return;` reduced to `if (sleepBusy) return;`, inside the MOVE region `TA-S30` | **exit 0**, `moved 685 lines in 38 regions`, `regions whose bytes differ with no declared row: 0`, and the weakened guard in the sealed output |
| two statement-aligned lines inserted inside `TA-S19` | **exit 0**, `moved 673 lines`, one LINE DRIFT row, and `measureDeps` left RELEASED |
| one space added to `TA-S24`'s own closing brace | **exit 0**, `moved 695 lines`, one LINE DRIFT row, and the released `reasonOf` dragged into the seal |

R3's diagnosis of the first is exact and I confirm it by reading the code: `cut.cjs:213` was
`if (applied.length === 0 && out !== body) verbatimFails += 1;`, and `applySubs` returns
`out === body` whenever no declared row matched, so `applied.length === 0` implies
`out === body` by construction. **The counter could never be non-zero for any input.** It is
removed, and the line that reported it is replaced by the witness check.

### 1.2 S-R19, THE WITNESS

`regions.json` gains a `witness` block: per move and per replace region, a **sha256 of its
bytes and its line count**, taken at a NAMED ref and recorded with the ref and its branch.

| ref name | commit | branch |
|---|---|---|
| `tip` | `4d2112c92ddffa3fafdd8cfd9dcd4180addb504c` | `rebuild/t2-client-core` (the chain tip, farm-synced, privacy proof PASS) |
| `s9` | `da9f86839d69a67dfa8c6a59b727aa518bc1164f` | `rebuild/b-s9-ui-pins` (the S9 lane head, which is this build's base) |

`gen-witness.cjs` is the new generator; re-taking a witness is a declared act with a named ref,
not a flag on the cut. `cut.cjs` compares BOTH numbers **before `applySubs` runs**, refuses by
region id, and requires every region of one file to agree on the SAME recorded ref.

**A measurement worth recording: every witnessed region hashes the same at both refs.** The
table reports `witnessed at s9 or tip` for all three files. The S9 differences (one line in
`today-app.cjs` below `:869`, the plan-sentence block in `today-model.cjs`) fall outside every
move region, which is why one content-anchored table serves both and why R3's line-drift rows
are the only difference between the two runs.

### 1.3 S-R20, THE LAST ANCHOR AND THE MOVED-LINE TOTALS

**The honest statement first, because it is a limit and not a feature.** A last anchor's
ambiguity is NOT visible to a resolver or to a parser. In R3's second and third attacks every
boundary still falls between statements, `node --check` still passes, and the existing
alignment check does not fire, because the function the region was supposed to hold moves
wholly outside it rather than straddling it. I verified that by running it. **So the last
anchor is refused against the RECORDED EXTENT**, which is a measurement taken at a named ref,
and `resolve.cjs` says so in its own header rather than leaving a reader to find it.

Two refusals, in this order, and the order matters: a region of the wrong LENGTH is an
ambiguous anchor and saying "the bytes differ" about it would send the reader to the wrong
place; only a region of the right length whose bytes differ is a tampered region.

```
REFUSED: today-app.cjs TA-S19: LAST ANCHOR IS AMBIGUOUS. The table's occurrence #1 of "  }"
  resolves to :631, which makes the region 4 lines; the witness records s9=16 lines, tip=16
  lines. Candidate occurrences at or after :628 are :631 :645 :682 :703 :723 :750 :776 :792.
REFUSED: today-app.cjs TA-S30: BYTES DO NOT MATCH THE WITNESS. 124 lines at :1807-:1930 hash
  19d6922256eb4bc1..., the witness records s9=6107979043b660ee..., tip=6107979043b660ee...
```

The **per-file moved-line totals** are recorded per ref and asserted: `today-app.cjs` 679,
`gym-app.mjs` 41, `today-model.cjs` 36. That is the one number R3's second and third attacks
moved (673 and 695 against 685) and nothing asserted it.

### 1.4 S-R21, THE THIRD REGION KIND

`replace`: released lines replaced IN PLACE by a declared replacement, nothing moved, the
pre-image witnessed exactly like a move. The five boot seams are declared rows.

| region | tip lines | what it replaces | the declared replacement |
|---|---|---|---|
| `TA-S05` | `:422` | `if (foodLane && typeof model.setFoodDays === "function") model.setFoodDays(foodLane);` | `  hooks.bootFoodDays();` |
| `TA-S10` | `:482` | the sleep twin | `  hooks.bootSleepNights();` |
| `TA-S16` | `:567` | `if (sleepLane) loadCheckInKit();` | `  hooks.bootCheckInKit();` |
| `TA-S35b` | `:2440-:2441` | `const willAdopt = canAdoptAthleteState();` and `if (willAdopt) armAdoptionGate();` | `  hooks.bootAdoptionGate();` |
| `TA-S38` | `:2550` | `let ready = settleAdoption(willAdopt ? adoptAthleteState() : Promise.resolve(), willAdopt);` | `  hooks.bootSettleAdoption();` |

`TA-S35` is split at `:2439` (last anchor `  }` occurrence 2) and keeps `:2430-:2439` as a
move. **All five are statement rewrites and therefore S-R17 (g) STOPs, declared in advance here
exactly as D.1 declares W2, W5, W6 and W8**; none of them is applied to a product file in this
part, because `today-app.cjs` is not cut until part 2.

`TA-S38`'s replacement declares nothing released, which is what makes `ready` sealed state as
B.3 consequence 3 says, and the census then reports the two released reads at `:668` and
`:2552` as crossings the facade must carry. **UNMEASURED:** the released-side rewrite of those
two reads is part 2's, and the `replace` kind can express it when the time comes.

**The class counts, next to R3's, at both refs.** R3 measured B.3's own kind-flip edit and got
41 move, 25 seam, 679 lines, 286 crossings, 99 distinct.

| | R3, B.3's kind-flip edit | mine, the `replace` kind |
|---|---|---|
| move regions, all three files | 41 | **41** |
| seam regions | 25 | **20 seam + 5 replace = 25** |
| lines moved, `today-app.cjs` | 679 | **679** |
| crossings / distinct | 286 / 99 | **282 / 100**, identical at `tip` and at `s9` |
| the census's own residue | not stated | **0** |
| interface names handed in by declared rows | n/a | 1 (`hooks`), reported on its own line and not as residue |

The crossing difference is the point of the third kind. R3's flip left the five boot statements
RELEASED and verbatim, so their references to sealed bindings became four new crossings and
`ready` stopped crossing at all. The `replace` kind removes those lines instead, so the
references go with them.

### 1.5 S-R23, THE FOURTH INSTRUMENT AND THE THREE NAMES

`capture.cjs` is committed as the fourth instrument. **I read R3's and did not copy it**: mine
takes its pairs from the table's own `dest` map instead of six hard-wired filenames, runs on a
directory with no line map, and carries the NAME CENSUS, which R3's did not have. It
reproduces R3's headline exactly: **4213 references compared at the tip, 4233 at `s9`, ZERO
name captures**, on the pure cut and on the product cut alike.

`census.cjs` is freed the same way (R3 NOTE-2), and both now resolve anchors through one
shared `resolve.cjs`. `census.cjs` used to carry a silent copy of the resolver that checked
nothing at all: a first anchor matching zero places gave `start === undefined` and the region
simply vanished from the declaration index, with no row and no message.

**THE THREE INTERFACE NAMES, CHOSEN BY MEASUREMENT.** A name is free only at ZERO occurrences
in CODE POSITION in every output file; a property key and a non-computed member name cannot
shadow anything. Measured at both refs over the full six-file pure cut:

| name | code position | property key | member name | the wrapper's own | verdict |
|---|---|---|---|---|---|
| `facade` | **0** | 0 | 0 | 0 | **FREE: the read-only facade** |
| `hooks` | **0** | 0 | 0 | 0 | **FREE: the callback table** |
| `painter` | **0** | 0 | 0 | 2 (the codemod's own parameter) | **FREE: the paint handle** |
| `on` | **2** | 0 | 0 | 0 | **NOT FREE**. `today-app.cjs:2027-:2028`, inside the MOVE region `TA-S33`, landing at `today-lanes.cjs:614-:615`, where they shadow the callback table for the body of that loop (R3 BLOCKING-4) |
| also measured and free | `lanes`, `sink`, `calls`, `notify`, `relay`, `surface`, `brush`, `tap`, `port`, `seal` | | | | |

On the product output of part 1 all three are 0 in code position; `painter` shows 2 in a
fourth column, "a declared row's", which is W7's own `painter.repaint()` output and is the
interface in use, not a collision. That column is mechanical: the output line differs from the
source line it maps to.

### 1.6 S-R24, THE BLIND-EDGE TABLE RE-DERIVED

`blind.cjs` is the fifth instrument. `reach.cjs`'s twelve-row blind table is a hand-typed
constant inside that script; this derives one from three syntactic shapes.

| | |
|---|---|
| rows, identical at `tip` and at `s9` | **53** |
| dynamic-import | 9 |
| foreign-callback | 9 |
| deferred (a NAMED function handed to `.then`) | 1 |
| deferred-continuation (an inline literal handed to `.then`/`.catch`) | 34 |

**It finds R3's thirteenth**: `today-app.cjs:2081` (`:2080` at the tip)
`next.setOnRefresh(<function literal>)`, inside `TA-S34`, a MOVE region. **And the fourteenth
beside it**: `:2059` `import("./today-entry.mjs")`, the dynamic import that mints the holder.
Both get their disposition row in the spec's new corrections section.

It also carries three dynamic imports (`./checkin-model.mjs`, `./checkin-app.mjs`,
`./local-source-basis.mjs`) and three foreign-callback rows
(`checkInKit.mountCheckIn <- onBack, onChanged` twice, `MachineSettingsView.renderEditor <- onChanged`)
that the hand table does not. **And it MISSES two the hand table has**: `measureDeps`'s and
`importDeps`'s `repaint`/`back`/`onAdmitted`, because those deps objects are RETURNED by a
local function and handed to the foreign screen elsewhere, not written as object literals at
the call site. That is the derivation's own boundary; it is stated, and a hand keeps the two
rows.

### 1.7 RED FIRST, MECHANICALLY

`rebuild/lanes/c/today-split-spike/test/instruments.test.cjs`, **20 rows** after the fix round
(14 at R1, plus R1 BLOCKING-1's own row and five for R1 NOTE-1 and NOTE-2).

```
against the COMMITTED instruments (cut.cjs and regions.json at a2632a3b):  3 pass / 11 fail
at the ORIGINAL head 62e4931f, sources from the working tree:             10 pass /  4 fail  <- R1 BLOCKING-1
at the fix-round head, SPLIT_TEST_REF=s9  (the default, the build's base): 20 pass /  0 fail, 3.2 s
at the fix-round head, SPLIT_TEST_REF=tip (the chain tip form):            20 pass /  0 fail
```

The three that pass in both are D.1's own two first-anchor reds, which were always real, and
capture.cjs's zero, which is R3's measurement. **THIS CELL IS NOT A CI CELL AND MUST NEVER
BECOME ONE**: it requires the acorn dev instrument by absolute path, and no step in
`.github/workflows/rebuild.yml` names it.

---

## 2. CUT ONE: `today-model.cjs` -> `today-readings.cjs` (spec F.1, S-R10)

**From the codemod's own report** (`cut.cjs --product --only today-model.cjs,gym-app.mjs`):

```
today-model.cjs -> today-readings.cjs   moved 36 lines in 3 regions; 0 replace; 0 seams left
                                        released; released file 479 lines
source 497 lines   witnessed at s9 or tip   substitutions applied 5
```

| region | lines at this ref | what |
|---|---|---|
| `TM-S01` | `:397-:406`, 10 lines | `ALREADY_RECORDED`, `FORM_MIN`, `FORM_MAX`, `OUT_OF_RANGE`. The range ends at `:406` and not one line earlier: the declaration runs two lines and a cut at the first leaves `+ " lb, to one decimal place. Nothing was recorded.";` behind as a valid unary-plus expression statement that `node --check` passes |
| `TM-S02` | `:410-:430`, 21 lines | `weighIn` |
| `TM-S03` | `:433-:437`, 5 lines | `reopen` |

`read()`, the whole projection, `adoptBasis`, `setPendingAdoption`, `marchingOrderSentence` and
the seven pure top-level functions stay in `today-model.cjs`, free and released.

**The seven injections are a MEASUREMENT.** `day`, `readings`, `adoptedRead`, `stateFromOps`,
`NO_STORE`, `setMessage` and `read`. F.1 (c) names six; the census named the seventh, because
`reopen` calls the released `read()`.

**The composition is the destructured form that went green** (R3 NOTE-6): `NO_STORE` in
shorthand. F.1's prose passes `noStore: NO_STORE`, and the sibling destructures `NO_STORE`, so
as F.1 writes it the no-store refusal would be the word `undefined` in front of the athlete.

---

## 3. CUT TWO: `gym-app.mjs` -> `gym-settings-lane.mjs` (spec B.9, S-R4)

```
gym-app.mjs -> gym-settings-lane.mjs   moved 41 lines in 4 regions; 6 replace; 6 seams left
                                       released; released file 560 lines
source 589 lines   witnessed at s9 or tip   substitutions applied 2
```

| region | lines | what |
|---|---|---|
| `GA-S01` | `:123-:125`, 3 | `settingsLane`, `settingsOpening`, `settingsSaving` |
| `GA-S02` | `:131-:140`, 10 | the read-cache comment, `settingsRead`, `settingsInFlight`, `settingsReading` |
| `GA-S03` | `:142-:156`, 15 | `startSettingsRead` |
| `GA-S04` | `:158-:170`, 13 | `openSettingsLane`, with the dynamic import of `machine-settings-host.mjs` |

`:126`, `:127` and `:130` (`settingsDraft`, `settingsDraftLift`, `settingsErrors`) stay
RELEASED, which is R1 BLOCKING-8's correction carried by the table.

**The two spike rows B.9 never had are both disposed of.** `gym-app.mjs:279`
`settingsSaving = recordSettings(...)` is the gym card's ONLY released assignment of a sealed
binding, and it becomes `hooks.saving(recordSettings(...))`, so the seal assigns it.
`first.settings` at `:569-:579` is a SECOND returned api handing out five sealed bindings, and
all five now come through the facade.

**The paint handle has ONE entry, not two.** B.9 says `createGymSettingsLane` takes a frozen
handle of exactly two functions, `painter.repaint()` and `painter.owns()`. The census says the
gym seal touches ONE released name, `paint`, at two call sites, and `owns` is named nowhere in
`GA-S01` to `GA-S04`. The handle is `Object.freeze({ repaint: () => paint() })`. **This is a
correction to B.9 by measurement.**

**`gym-app.mjs:546` `model.start()` inside `paint()` is LEFT BYTE-IDENTICAL** under S-R12. It
is the one durable PUT any paint root reaches in these three files, reproduced at this ref by
`reach.cjs`, and the writer fence carries the standing guard: the gym `paint()` body reaches
EXACTLY ONE durable writer, and a second fails.

---

## 4. EVERY HAND-WRITTEN LINE, BY FILE AND LINE

**The PM reads exactly these.** Everything not listed here is moved bytes or untouched bytes.
All of them are DECLARED in `regions.json`'s `product` and `compose` blocks, so they are
reviewable beside the regions they wrap and the codemod, not a hand, put them on the page.

### `rebuild/m3/w7-preview/today/today-readings.cjs` (79 lines, 43 authored)

| lines | what |
|---|---|
| `:1-:33` | `"use strict";` and the file banner: what was cut, from where, that the bytes were witnessed, what the file may not gain, and that the seven injections are a measurement |
| `:34` | `function createReadingsWriter({ day, readings, adoptedRead, stateFromOps, read, NO_STORE, setMessage }) {` |
| `:35`, `:44-:45`, `:67-:68` | the codemod's region banners `/* TM-S01 today-model.cjs:397-406 */` and their blank lines |
| `:74-:79` | `  return { weighIn, reopen, ALREADY_RECORDED, OUT_OF_RANGE, FORM_MIN, FORM_MAX };`, the closing brace, and `module.exports = { createReadingsWriter };` |

### `rebuild/m3/w7-preview/today/today-model.cjs` (479 lines, 18 authored)

| lines | what |
|---|---|
| `:50-:54` | a four-line comment and `const { createReadingsWriter } = require("./today-readings.cjs");`, at MODULE level, after the `sleep-model.cjs` require |
| `:402-:414` | a ten-line comment and the three-line composition: `const { weighIn, reopen, ALREADY_RECORDED, OUT_OF_RANGE, FORM_MIN, FORM_MAX } = createReadingsWriter({ day, readings, adoptedRead, stateFromOps, read: () => read(), NO_STORE, setMessage: (m) => { lastMessage = m; } });` |

The comment at `:402-:411` says in the file itself what R3 PART 2 (e) says about it: the
census's zero sealed-assigns-released rows after W6 is a property of the instrument, not a
safety property, because `setMessage` routes the five writes through a released closure the
seal calls and the effect is identical.

### `rebuild/m3/w7-preview/today/gym-settings-lane.mjs` (104 lines, 63 authored)

| lines | what |
|---|---|
| `:1-:33` | the file banner, including what is NOT in it and why: `recordSettings` stays released, its released half still decides what is stored, and `:546` is byte-identical with its own ticket |
| `:34` | `export function createGymSettingsLane(doc, model, settings, painter) {` |
| `:35`, `:37-:38`, `:49-:50`, `:66-:67` | the codemod's region banners and blank lines |
| `:81-:104` | the return block: `Object.freeze({ facade: Object.freeze({ 7 entries }), hooks: Object.freeze({ 4 entries }) })` and the closing brace |

### `rebuild/m3/w7-preview/today/gym-app.mjs` (560 lines, 27 authored)

| lines | what |
|---|---|
| `:21-:23` | a two-line comment and `import { createGymSettingsLane } from './gym-settings-lane.mjs';` |
| `:126-:134` | a seven-line comment, `const painter = Object.freeze({ repaint: () => paint() });` and `const { facade, hooks } = createGymSettingsLane(doc, model, settings, painter);` |
| `:217` | `GA-R01`: `if (!facade.lane()) { block.hidden = true; editor.hidden = true; hooks.open(); return; }` |
| `:222-:223` | `GA-R02`: `if (!facade.hasRead(liftId)) hooks.startRead(liftId);` and `const entry = facade.entryFor(liftId);` |
| `:250` | `GA-R03`: `hooks.saving(recordSettings(map, view, paintedDraft));` |
| `:276-:277` | `GA-R04`: `try { result = await facade.lane().save(machine); }` and its unchanged `finally` line |
| `:287-:288` | `GA-R05`: `hooks.dropRead(view.lift.id);` and `await hooks.startRead(view.lift.id);` |
| `:541-:547` | `GA-R06`: the five api thunks behind the facade, with the two comment lines between them kept verbatim |

### `rebuild/m3/w7-preview/today/build.mjs`

Two `REQUIRED_INPUTS` entries and their two comment blocks, **48 becomes 50**. The third,
`today-lanes.cjs`, arrives with part 2 and takes it to 51, which is S-R18's number.

### `rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs`

The fifth required test edit, section 0's STOP: five lines replacing three at `:772`.

---

## 5. EVERY DECLARED SUBSTITUTION AND REPLACEMENT

**Substitutions applied to moved bytes: 7 rows, 7 occurrences.**

| id | region | from | to | kind | S-R17 (g) |
|---|---|---|---|---|---|
| `W6a` | `TM-S02` | `lastMessage = { ok: false, state: null, copy: ALREADY_RECORDED };` | `setMessage({ ... });` | statement rewrite | **STOP** |
| `W6b` | `TM-S02` | the `OUT_OF_RANGE` twin | `setMessage(...)` | statement rewrite | **STOP** |
| `W6c` | `TM-S02` | the `NO_STORE` twin | `setMessage(...)` | statement rewrite | **STOP** |
| `W6d` | `TM-S02` | `lastMessage = { ok: result.ok, state: result.state, copy: result.copy };` | `setMessage(...)` | statement rewrite | **STOP** |
| `W6e` | `TM-S03` | `lastMessage = null;` | `setMessage(null);` | statement rewrite | **STOP** |
| `W7a` | `GA-S03` | `return paint();` | `return painter.repaint();` | call-target rewrite | ordinary |
| `W7b` | `GA-S04` | `await paint();` | `await painter.repaint();` | call-target rewrite | ordinary |

All five W6 rows are S-R17 (g) STOPs, declared in advance by D.1 and reported here as RULED.
W7a and W7b are call-target rewrites and are ordinary.

**Replacements applied to released lines: 6 rows in `gym-app.mjs`** (`GA-R01` to `GA-R06`,
tabulated in section 4), each a statement rewrite and each an S-R17 (g) STOP declared in
advance in the table. **Five more are declared and NOT applied**, `TA-S05`, `TA-S10`, `TA-S16`,
`TA-S35b` and `TA-S38`, because `today-app.cjs` is not cut in this part.

**One nesting, recorded**: `GA-R04` `:305-:306` sits wholly inside the seam `GA-M01`
`:286-:318`. `cut.cjs` refuses overlapping regions with exactly one declared exception, a
`replace` nested in a `seam`, because a seam is an annotation and a replace inside it is the
seam saying which of its own lines the interface rewrites.

---

## 6. THE INSTRUMENT TABLES ON MY OWN OUTPUT

### census.cjs

| output | crossings | distinct | residue | interface names |
|---|---|---|---|---|
| the pure cut, all six files, `tip` | 282 | 100 | **0** | 1 (`hooks`) |
| the pure cut, all six files, `s9` | 282 | 100 | **0** | 1 (`hooks`) |
| the gym pair alone, pure | 16 | 8 | **0** | 0 |
| **THIS BUILD'S OWN OUTPUT** (the four product files) | **0** | **0** | **0** | 0 |

**Zero crossings on the product output means the interface carries everything the cut
stranded, and it means nothing more than that.** R3's PART 2 (e) is the right warning and I
repeat it rather than let the number stand alone: a census over a built interface goes quiet
by construction, because a member access on a local resolves locally. It is `capture.cjs` and
the fence, not the census, that judge whether the interface is a good one.

The gym pair's 16 stranded rows before the interface, which are the rows the interface had to
carry: `settingsLane` read at `:246`, `:305`, `:572`; `settingsRead` read at `:251`, `:252`,
`:316`, `:576`; `settingsOpening` `:571`; `settingsReading` `:575`; `settingsSaving` read
`:570` and **written `:279`**; `openSettingsLane` called `:246`; `startSettingsRead` called
`:251`, `:317`; and the seal's two `paint` calls at `:154` and `:167`.

### capture.cjs

| output | references compared | stranded | **NAME CAPTURES** |
|---|---|---|---|
| the pure cut at `tip` | 4213 | 467 | **0** |
| the pure cut at `s9` | 4233 | 467 | **0** |
| **THIS BUILD'S OWN OUTPUT**, on bytes PROVEN identical to the four committed files (R1 NOTE-2) | **1243** | 50 | **0** |

**R1 NOTE-2 is answered by a proof rather than by an argument.** R1's objection was that the
`1243` row is over a `cut.cjs` output directory and not over the bytes that ship, and that
`capture.cjs` on the committed files prints `NO LINE MAP ... the capture comparison is not
run`. Measured in the fix round: the product cut taken at the named ref `s9` reproduces
**all four committed product files BYTE FOR BYTE by sha256**, so that output directory IS the
shipped bytes and its `linemap.json` is their line map. The identity is now a row in the
instruments' cell, re-run in three seconds by the next hand, and it is also the mechanical
form of R1's own check 4 ("an unlisted hand-written line"): a hand edit to any of the four
product files outside the declared table makes that row fail.

```
product cut at s9 vs the committed files:
    today-model.cjs         IDENTICAL fb6802f23f5bd0e5...
    today-readings.cjs      IDENTICAL f7b3ae455bb1b90c...
    gym-app.mjs             IDENTICAL 07ff9687e24bbe05...
    gym-settings-lane.mjs   IDENTICAL fbe949cd2fe9e871...
```

**R1 NOTE-7, count drift, measured again and NOT reproduced.** My `capture.cjs` over that
proven-identical output compares **1243** references, which is the number this report already
carried; R1 measured 1277 over its own reproduction of the cut. I could not reproduce 1277 and
I am not claiming R1 mis-measured: the two reproductions differ by 34 references and I did not
find where. **The load-bearing number is identical in both: ZERO name captures.** This is
listed as UNMEASURED item 11.

### The crossing table, committed (R1's closing note)

R1: "A regenerated `CROSSINGS.md` on the build's own output would be worth more than the
prose." `rebuild/lanes/c/today-split/PART1-CROSSINGS.md` is that table: **20 crossings, 13
distinct, 0 residue** before the interface, one row each, with the interface entry that
carries it in a DISPOSITION column, and all eleven interface entries accounted for. It is
taken with a new MEASUREMENT mode, `cut.cjs --no-replace`, which witnesses every `replace`
region as usual and then leaves its released lines in place instead of swapping in the
declared call, so the census can say WHAT the interface carries and not only that it carries
everything. `--no-replace` refuses to combine with `--product`.

### reach.cjs, at this build's base

`today-app.cjs`: 6 PUT call sites, 34 STORE, 10 ADOPT. `gym-app.mjs`: 6 PUT, 1 STORE, 0 ADOPT.
`today-model.cjs`: 2 PUT, 2 STORE, 0 ADOPT. **Exactly ONE durable PUT is reached from a paint
root: `gym-app.mjs:546 model.start() in paint [paint SYNC, boot SYNC, listener SYNC]`**, which
reproduces the spike and R3 at a third ref.

### blind.cjs

53 rows at both refs; section 1.6.

---

## 7. THE BAR, IN FULL

### On the PC, the whole today step, ALONE

I ran it twice, each time from `%TEMP%\earned-splitbuild` with the exact command at
`.github/workflows/rebuild.yml:232` as it stands on the merged branch, with
`MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York`, **with nothing else of mine running
on the machine**: no other node process of mine, no farm run competing for it (the farm is a
different machine, and I did not run the full step there at all), no browser, no build.

| | before my first product edit (at the merge, `4aadb0f3`) | after my last product edit |
|---|---|---|
| tests | 682 | 682 |
| pass | **680** | **680** |
| fail | **2** | **2** |
| duration | 161.5 s | 159.0 s |

**THE FIX ROUND'S OWN RUN, on the PC, ALONE.** This round moves NO product byte: the seven
files it changes are four instruments, the fence, a new crossing table and this report, and
`git status --porcelain` on the lane worktree names exactly those seven and nothing under
`rebuild/m3`. Not one file in the today step's seventeen is among them, so the step's input
is literally unchanged and R1's own measurement at this head is the BEFORE. I ran it anyway,
because a claim that the input is unchanged is not a measurement:

| | the fix round, at `f9ec6f0f` + these seven files |
|---|---|
| tests / pass / fail | **682 / 680 / 2**, exit 1 |
| duration | **157.5 s** |
| `boundary.test.mjs` P-MEASURE (g) | the SAME five paths: `rebuild.yml`, `adapter.test.mjs`, `view.test.mjs`, `today-app.cjs`, `machine-settings-ui.test.mjs` |
| `setup.test.mjs` re-pin | the SAME three: `rebuild.yml`, `adapter.test.mjs`, `view.test.mjs` |

Both are the pre-existing reds of `DECISIONS:552`, and both list exactly what they listed in
the author's AFTER run and in R1's. **When I ran it, nothing else of mine was running on the
machine**: no other node process of mine, no farm run competing (the farm is a different
machine), no browser, no build. The fence, the lane-d cells and `b-package.cjs` were started
only after it had finished and written its `.done` file.

**The two failures, named, before and after:**

1. `rebuild/m3/w7-preview/measure/test/boundary.test.mjs:128` **P-MEASURE (g)**. Before, it
   lists four drifting S4-sealed paths (`rebuild.yml`, `adapter.test.mjs`, `view.test.mjs`,
   `today-app.cjs`). After, it lists the same four plus
   `rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs`, which is my one declared
   test edit and which the S10 brief declares.
2. `rebuild/m3/w7-preview/today/test/setup.test.mjs:2360` **re-pin**. Before and after it
   lists exactly the same three files (`rebuild.yml`, `adapter.test.mjs`, `view.test.mjs`).
   **My edits add nothing to it.**

Both are the pre-existing reds of `DECISIONS:552`, red on the S9 lane until `packages/S9.json`
exists.

### On the PC, the rest

| | result |
|---|---|
| `rebuild/lanes/c/today-split/writer-fence.test.mjs` | **26 tests, 26 pass, 0 fail**, 102 ms, measured on the PC in the fix round, **twelve** rows RED first on a planted violation (21 / 21 with eight red at R1: R1 NOTE-3 is right, the report said nine and `grep -c '^test("RED' = 8`) |
| the ten lane-d cells I ran, **two** of which name `gym-app.mjs` or `today-model.cjs` (`b-lom/legacy-order` and `p3-real-shape/r1-fixes`; the other eight do not, which is R1 NOTE-5 and the description here was wrong) (`plan-edit/browser-build`, `plan-edit/durable-host`, `b-lom/legacy-order`, `p3-capture-start`, `p3-layout-v2`, `p3-port-fix/capture-codes`, `p3-port-fix/owner-route`, `p3-real-shape/r1-fixes`, `p3-real-shape/real-shape-capture`, `p3-replay-all/writer-order`) | **107 tests, 107 pass, 0 fail**, 16.5 s, re-measured on the PC in the fix round |
| `node rebuild/lanes/b/tooling/b-package.cjs --ci --package S8` | `B PACKAGE S8 SPEC OBSERVED packages/S8.json 6fbbb1b9...; runner e31dd206...` then **`B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`**, exit 1. It refuses on this branch by design, because this branch carries undeclared sealed edits. Recorded by name, not chased. **Re-run in the fix round: the same two lines, exit 1** |
| `node --check` on the four instrument and fence files I changed, on the PC | 4 / 4, exit 0 |

### In the farm

| | result |
|---|---|
| `rebuild/lanes/c/today-split-spike/test/instruments.test.cjs` | **20 / 20** in 3.2 s at `SPLIT_TEST_REF=s9` and **20 / 20** at `=tip`; **3 / 11 fail** against the committed instruments at `a2632a3b`; **10 / 4 fail** at the pre-fix head `62e4931f` (R1 BLOCKING-1) |
| `gym.test.mjs`, `machine-settings-ui.test.mjs`, `view.test.mjs` on the product overlay | 142 / 142 (the fast loop while iterating; the PC run above is the bar of record) |
| `node --check` on every product file | 4 / 4, and 6 / 6 on the full pure cut at both refs |

---

## 8. THE SEALED AND PINNED PATHS THIS PART MOVES, FOR THE S10 BRIEF

Pre is the file at `5638af7` (the instruments commit, which moves no product byte); post is
the file at `f54fcdc`. Both hashes are sha256 of the file's LF bytes.

| path | role | pre sha256 | post sha256 |
|---|---|---|---|
| `rebuild/m3/w7-preview/today/today-model.cjs` | **UNSEALED** (it is released, and the split releases it further) | `645c1bec46d31b1a1c615cb02e51bb901f5b655c95c77d72f2a3560d9bf76907` | `fb6802f23f5bd0e5c98e7a55609bedf7a0500675962894cadc7f1348f83aa87b` |
| `rebuild/m3/w7-preview/today/gym-app.mjs` | **S8-pinned** | `4c8ba0c93f48b1b38be34d08ee23d274841c55680e51a61954754d17bcf8ec53` | `07ff9687e24bbe05747414561f164ea7233851ee3496fafc22e4deecaa7325d2` |
| `rebuild/m3/w7-preview/today/build.mjs` | **S8-pinned** | `d04a10ef406708b801749b1118246e82fecc53bbbafe1ac11068eb24bc52cf9c` | `0cecdcbd8fc5417cf2f4c77a6c4f0722ec40f531cfba6fb27fc6bf7cfcbe45d7` |
| `rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs` | **S8-pinned test cell**, the fifth required edit (section 0's STOP) | `e532f8d4e5aa5435845908e5f76667b4933f7c7a6ffe1ac39740c14d71910a7f` | `71bbac0cf259b916b858c0da5b61e38dd4885bcac4f27d67e29f0d7dbec5f471` |
| `rebuild/m3/w7-preview/today/today-readings.cjs` | **NEW, sealed-to-be** | (new file) | `f7b3ae455bb1b90c25370dc17b4782d1f9a41e515c94c85fbb9e76a3dc46f2bb` |
| `rebuild/m3/w7-preview/today/gym-settings-lane.mjs` | **NEW, sealed-to-be** | (new file) | `fbe949cd2fe9e8710fd6c041a2bc1ca62829def05126fd8ce7942bdc7121bbd0` |
| `rebuild/m3/w7-preview/today/today-app.cjs` | **UNTOUCHED, and this is the proof** | `efaf6c0dbb871730788d8953ed470f2650d739b5de7c52fa7f779f2c125df933` | `efaf6c0dbb871730788d8953ed470f2650d739b5de7c52fa7f779f2c125df933` |

No other file under `rebuild/m3` is touched by this part. Everything else I wrote is under
`rebuild/lanes/c/today-split-spike/`, `rebuild/lanes/c/today-split/` and this report, plus the
spec's own corrections commit under S-R25.

---

## 9. WHAT IS UNMEASURED

Every design claim this build rests on that no instrument row backs. The spec now carries its
own UNMEASURED table under S-R25; this is the build's.

1. **The five boot replacements' text is UNMEASURED.** `hooks.bootFoodDays()` and its four
   siblings are declared rows with witnessed pre-images, and NOTHING HAS RUN THEM. What the
   five sealed callbacks do, whether `ready` reads back through the facade at `:668` and
   `:2552`, and whether one factory call or five preserves the order `:2451`'s first paint
   depends on, are part 2's and are not settled here.
2. **The `replace` kind cannot yet rewrite a released line that is not in a region.** `ready`'s
   two released reads are the live case. The kind can express it; no row does.
3. **B.9's `editSeq` stale-editor protocol is UNMEASURED and NOT BUILT.** `recordSettings`
   stays released and byte-identical and its released half still decides what is stored. That
   is section 0's second STOP.
4. **The in-flight flag is NOT extended to all seven gym writers.** R2 NOTE-5 and R3 record
   that it should be; `hooks.saving` covers the settings writer only. Part 2.
5. **The gesture guard, `on.listen`, and E.5's rows 9 to 19 are UNMEASURED and unwritten.**
   The fence has **twelve** red rows, not eighteen, and it says so in its own header. (At R1
   the report said nine and the tree held eight: R1 NOTE-3, fixed by committing the missing
   red row rather than by correcting the number down.)
6. **The blind-edge derivation misses two rows a hand keeps** (section 1.6), and its
   `deferred-continuation` class of 34 is a count nobody has judged.
7. **The paint handle's shape is design.** The gym's is now one measured entry; Today's six
   are read off the census rows but the SHAPE is untested.
8. **D.2, D.2b, D.4, D.5 and D.6 have not been run in this part**, and none of them was asked
   for: no bundle, no DOM snapshot, no listener census, no copy census, no browser check, no
   numstat. The copy discipline is covered for the two new modules by the fence instead.
9. **`node --check` is all that proves the five DECLARED but unapplied replacements parse**, and
   it does not even prove that, because they are not in any file yet.
10. **The one em dash in `today-readings.cjs`** is a MOVED byte from `today-model.cjs`'s own
    `FORM_MIN` comment. I authored no en dash and no em dash anywhere. It is inside a comment,
    so the bundle's dash guard and `machine-settings-ui.test.mjs`'s S11 literal scan, which
    both read string literals, are unaffected; S11 does not cover the two new files in any case.
11. **The 34-reference difference between my `capture.cjs` count (1243) and R1's (1277)** over
    the same four product files is UNMEASURED. Zero name captures reproduces in both.
12. **The declared-text witness (R1 NOTE-1) is TAMPER EVIDENCE, not an independent oracle.**
    The pre-image witness's digests come from git objects at a named commit, so re-running the
    generator against a tampered tree cannot bless it. The declared TEXT has no outside
    source, because the text IS the declaration: re-taking it with
    `gen-witness.cjs --declared --write` re-blesses, and the control is that re-taking it is a
    visible one-line-per-row diff in `regions.json`, beside the row it blesses, which the PM
    reads. What it removes is the SILENT path R1 drove a line through.
13. **The interface names' freedom on part 2's output is still UNMEASURED** (R1's own "what I
    did not verify" item 6). `on` is recorded as NOT FREE with its two lines; the three chosen
    names are 0 in code position on every file that exists today.

---

## 10. WHAT PART 2 IS, AND WHAT IT INHERITS

Not started, and the ticket forbids starting it: `today-app.cjs` into `today-lanes.cjs`, the
25 seams, the boot order, the runtime gesture guard. It inherits a witnessed table whose
DECLARED TEXT is witnessed too, a codemod that refuses six ways it did not refuse two rounds
ago, five instruments with their own cell that survives the cut it measures, the three
interface names chosen by measurement, a committed crossing table with a disposition per row,
and a fence whose suppression list can no longer hold an application name and which holds
twelve red rows. The first thing it should do is re-run
`rebuild/lanes/c/today-split-spike/test/instruments.test.cjs` and see 14 of 14 before it
believes anything in this report: **20 of 20**, at the fix-round head, with
`SPLIT_TEST_REF=s9` (the default) or `=tip`. It runs from git objects at a named ref, so it
will still run after part 2 has cut `today-app.cjs`.

---

## Appendix: how to re-run every number above

From a farm scratch worktree at this branch, with the spike directory as the working directory:

```
node gen-witness.cjs --root <wt> --ref-name tip --ref 4d2112c9... --branch rebuild/t2-client-core
node gen-witness.cjs --declared                      # R1 NOTE-1, add --write to record it
node cut.cjs     --root <wt> --out out
node cut.cjs     --root <wt> --out prod --product --only today-model.cjs,gym-app.mjs
node cut.cjs     --root <wt> --out pre  --only today-model.cjs,gym-app.mjs --no-replace
node census.cjs  --root <wt> --out pre  --md ../today-split/PART1-CROSSINGS.md
node census.cjs  --root <wt> --out out  --md CROSSINGS.md
node capture.cjs --root <wt> --out out  --names facade,hooks,painter,on
node reach.cjs   --root <wt>            --md REACH.md
node blind.cjs   --root <wt>            --md BLIND.md
node --test rebuild/lanes/c/today-split-spike/test/instruments.test.cjs
SPLIT_TEST_REF=tip node --test rebuild/lanes/c/today-split-spike/test/instruments.test.cjs
```

The `<wt>` the codemod is pointed at is a tree of the three PRE-CUT sources, built with
`git show <ref>:rebuild/m3/w7-preview/today/<file>`. Pointing it at the lane worktree after
the cut is what produced R1 BLOCKING-1.

On the PC, from the lane worktree:

```
node --test rebuild/lanes/c/today-split/writer-fence.test.mjs
node --test <the seventeen files at .github/workflows/rebuild.yml:232>
```

The instruments run in the farm because their parser is a DEV instrument outside the
repository; the product bar runs on the PC because the PC is the bar of record.
