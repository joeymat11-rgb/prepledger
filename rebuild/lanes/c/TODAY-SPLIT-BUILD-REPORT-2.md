# TODAY-SPLIT BUILD, PART 2: THE BIG CUT - AUTHOR REPORT

Author: cowork (Earned lane hand, lane C). Branch `rebuild/c-today-split-build`.
**I started from `e4c15d1c`** (`git fetch` then `git merge --ff-only`, as the ticket's first
act asks), and merged the then-current remote branch before every push; three of Astra's
fence commits arrived while I worked and every merge was clean, none of them in a file I
had touched.

**What I did not open.** No `rebuild/conform/private`, no `src/history.js`, no `ledger/`,
no `C:\Users\joeym\EarnedPort`, no `port-real.log`, no soak, no browser, no
`b-package.cjs --full`, no junction to the private census. I wrote no line of
`rebuild/DECISIONS.md` and no line of `rebuild/lanes/STATUS.md`. Every fixture named here is
synthetic. The owner's real measurements are not in this session. I authored no en dash and
no em dash.

---

## 0. THE HEADLINE, EVERY STOP, AND THE IN-FLIGHT FLAG

| | |
|---|---|
| the today step on the PC, BEFORE my first product edit (12:34:46-12:37:38 ET) | **682 tests, 680 pass, 2 fail**, 171.8 s |
| the today step on the PC, AFTER my last product edit (13:56:10-13:59:44 ET) | **682 tests, 680 pass, 2 fail**, 184.7 s |
| the two failures | `boundary.test.mjs` **P-MEASURE (g)** and `setup.test.mjs` **re-pin**, the two known pre-existing reds of `DECISIONS:552`. The SAME two before and after; no row added, none lost |
| the writer fence, on the PC | **395 rows, 395 pass** (309 before this part; 86 added) |
| the lane-d cells that name a cut file, on the PC | **101 tests, 101 pass** |
| the instruments' own cell, in the farm | **26 of 26** at BOTH named refs (`SPLIT_TEST_REF=s9` and `=tip`), up from 20 |
| `census.cjs` on MY OWN output | **0 crossings, 0 residue.** RELEASED ASSIGNS A SEALED BINDING: **ZERO** |
| `capture.cjs` on MY OWN output | **0 name captures**; `facade`, `hooks` and `painter` each 0 in code position |
| D.2 / D.2b | **7 of 7 driven states DOM-EQUAL**, **7 of 7 listener censuses EQUAL**, **0 NOT COVERED** |
| D.4 | the copy multiset differs by **nine references, every one of them `"use strict"` or a module specifier**. Zero athlete-facing copy moved |
| D.6 | `git diff --numstat 33cc25f HEAD -- rebuild/engine rebuild/coach rebuild/DECISIONS.md rebuild/authority rebuild/client rebuild/m4 rebuild/conform` prints **NOTHING** |
| `b-package.cjs --ci --package S8` | refuses by design: `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`, exit 1. Recorded, not chased |

### THE STOPS, and I am reporting every one rather than bending it

**STOP 1. B.3's ONE-HANDOFF RULE IS NOT BUILT.** The released `today-app.cjs` still names
`model` **32 times** and therefore still reaches `today-model.cjs`'s re-exported `weighIn`
and `reopen`. `options` IS at 2 (the mount's parameter and the one factory argument), so
half of the rule holds by measurement and half does not. Building the other half means a
`facade` entry per projection member and a hook for `model.weighIn` at the weigh-in submit,
which is SEAM 1 and a durable writer; that is new sealed writer logic inside a round whose
whole evidence is byte identity, which is S-R12's reasoning for `recordSettings` applied to
the same shape. **What I did instead**: the count is MEASURED and pinned in the fence as a
CEILING (`FENCE-MODEL-HELD`, with a red row for a thirty-third), so the debt cannot grow
silently, and `model.weighIn` is one of the three declared seam sites. The PM rules whether
the rest is its own ticket.

**STOP 2. SPEC B.6's OUTCOME TYPE IS NOT BUILT.** `recordSleep` still composes its eleven
sentences and `recordIntake` its two. Turning them into outcome shapes is a STATEMENT
REWRITE inside three moved regions (`TA-S23`, `TA-S29`, `TA-S30`) and D.1 declares only the
`sleepErrorText = <expression>` family, W5 - not `recordIntake`'s two food sentences and not
the view-side mapper. `DECISIONS:584` rules that any statement rewrite outside the pre-ruled
families STOPS that region, and those three regions are the food writer, the sleep read
retry and the sleep writer: the three this whole part exists to move. **What I did
instead**: the twelve copy constants cross as INJECTED READ-ONLY VALUES named in the factory
signature, so the sealed module holds **zero string literals of more than three words**
(which is what S-R13's law actually asserts, and the fence asserts it), every copy byte
stayed in the released view where C-UI-7 edits it, and D.4's multiset is equal. **W5 is
therefore declared and NOT USED, and `sleepErrorText` keeps its name.** A rename with no
build behind it would have been a silent behaviour change inside a pure move.

**STOP 3. B.3's "no entry takes a DOM node" IS NOT MET.** `hooks.recordIntake(save, cal,
pro, error)` and `hooks.recordSleep(map)` take the same DOM arguments the released calls
took, because changing `recordIntake`'s or `recordSleep`'s signature rewrites a statement
inside a moved region. The alternative was stopping both regions.

**STOP 4. SEAM G1 (`recordSettings`) and `gym-app.mjs:546` are untouched**, as
`DECISIONS:574` rules: their own tickets, GYM-SETTINGS-WRITER-SEAL and GYM-START-IN-PAINT.
`gym-app.mjs` is byte-identical in this part.

**STOP 5. E.6's GUARD COVERS TWO OF ITS NINE SUBJECTS, and the seven are named.** The
subject list is `REACH.md`'s rule and not a choice: guarded iff it reaches a durable PUT and
no paint root reaches it. In `today-lanes.cjs` that is exactly two, `recordIntake`
(`foodLane.save`) and `recordSleep` (`sleepLane.save`). Of E.6's other seven, **five are the
gym card's** (`recordSettings`, `logSet`, `finish`, `forget`, `undo`) and are not this
round's file at all, and **two are released seams no sealed guard can reach**:
`submitWeighIn` (`model.weighIn` at SEAM 1) and `recoverWorkout`
(`facade.workout().recover()` at SEAM 4). Both of those two are declared seam sites in the
fence.

**STOP 6, AND IT IS A TICKET LINE I DECLINED, in section 0 where the PM rules on it rather
than in UNMEASURED where he would discover it (R2 F6).** **The in-flight flag is NOT
extended to the seven gym writers.** B.3 asks for `if (<name>Busy) return { kind:
"in-flight" };` on all seven; six of the seven are in `gym-app.mjs`, which this part does
not touch by design, and extending an in-flight guard is new hand-written durable-writer
logic in a file whose evidence is byte identity. The two writers this part DOES seal
(`recordIntake`, `recordSleep`) keep the duplicate-write guards they already have - the
released `disabled` flags at the save controls and `sleepBusy`, which `recordSleep` sets at
its own first statement and clears in its own `finally` - and both are now behind E.6's
runtime gesture guard as well, which the flag was a weaker substitute for. **I recommend it
rides with GYM-SETTINGS-WRITER-SEAL**, where the six gym writers are already open.

**STOP 7, A PREDICTION OF D.3 THAT MEASUREMENT CONTRADICTS, and it costs a tooth NOTHING.**
D.3 declares FOUR required test edits and I took **TWO**. `package.test.cjs` needs neither
of its two: D.3 says the dynamic import moves with `TA-S19` and `TA-S20`, and it does not -
`renderMeasure` and `renderImport` are SEAMS, so `await import("../measure/measure-screen.mjs")`
and `await import("../import/import-screen.mjs")` are still in the released
`today-app.cjs`, and the planted import edge still hangs on `today-app.cjs`'s node. H18's
literal list is a cell that does not exist on this branch (`DECISIONS:550` S-R18 says S9's
H18 cell *will* hold it). **Fewer edits than declared, not more**, and H.2 STOP 5 fires on a
FIFTH, not on a second.

**No other STOP fired.** No region was left unmoved. Every one of the 18 released lines that
ASSIGNS a sealed binding has a declared disposition, and the generator asserts the two lists
cover each other.

I did not weaken a law, a guard, a pin or a test anywhere in this part.

---

## 1. STEP 0: THE INHERITED INSTRUMENTS, RE-RUN, AND R2's TWO NOTES CLOSED

**Re-run before I believed anything in the part 1 report**, at both named refs, from git
objects: **20 of 20 at `SPLIT_TEST_REF=s9` and 20 of 20 at `=tip`**. The part 1 report's
section 10 is correct.

### F4: `regions.json`'s `product` and `compose` blocks are witnessed, RED FIRST

R1 NOTE-1 closed the silent path through a substitution's `to`. R2 drove a line through the
block beside it: it dropped `Object.freeze(` from `gym-settings-lane.mjs`'s read-only facade
in the `product` block, changed no source byte, and **the cut wrote an unfrozen facade and
exited 0**. Those two blocks carry more authored bytes than every substitution row put
together, and part 2's interface over 679 moved lines is the same hole on a much larger
surface.

`gen-witness.cjs --declared` now records a sha256 per product block over
`[dest, head, open, close]` and per compose block over
`[file, after, afterLines, at, insert]`, plus the two counts. `cut.cjs` checks them BEFORE it
opens a single source file and refuses BY NAME. The two digest functions are duplicated
verbatim in the checker, for the reason the other two are.

| row | measured |
|---|---|
| R2's own attack, `Object.freeze(` dropped from the facade | **REFUSED**: `product block gym-settings-lane.mjs: DECLARED TEXT DOES NOT MATCH THE WITNESS` |
| a compose line rewritten so the released half never hears the seal's refusals (`setMessage` cut to a no-op) | **REFUSED**: `compose block today-model.cjs: DECLARED TEXT DOES NOT MATCH THE WITNESS` |
| a product block ADDED, with no witness | **REFUSED** by name |
| the same block ADDED with a CORRECTLY FORGED digest | **REFUSED** by the recorded count, `the table declares 3 product blocks; the declared-text witness records 2` |

**Before the witness was taken, the cut refused outright** with `NO DECLARED WITNESS`, which
is the red-first state of the row itself.

### F5: report section 4's line numbers, corrected to PHYSICAL lines with the convention stated

`rebuild/lanes/c/TODAY-SPLIT-BUILD-REPORT.md` section 4 now carries, re-derived from the tree
and not transcribed: `today-readings.cjs` is **78** lines with its factory signature at
**`:32`** (a PM reading `:34` read a moved byte and missed the seven injections);
`gym-settings-lane.mjs` is **103** with its signature at `:32` and its return block
`:82-:103`; the seven substitution lines by physical line; and the counting convention
`DECISIONS:574` rules - 139 novel lines, 149 slots, 156 with the substitutions, and
authored-lines-per-file as physical minus moved (42 and 62, where the report had 43 and 63).
R2's CONTENT list was complete; only the numbers were wrong.

### Two more instrument changes this part needed, each red first

**The alignment refusal is a MOVE's rule, not a `replace`'s.** A move takes lines out of one
file and puts them in another, so a boundary inside a statement leaves half of it behind. A
`replace` puts its own lines back AT THE SAME POSITION. Part 2's interface rows rewrite
lines like `if (!foodLane) {` that open a block on purpose, and the old rule refused them.

**What has to hold for a `replace` is that the OUTPUT PARSES**, so `cut.cjs` now parses
every file it writes and refuses by file, naming that file's replace rows. That is a
stronger check than the one it replaces. RED FIRST: a replacement with its brace dropped,
**with the declared-text witness re-blessed so the refusal under test is the parse and not
the witness**, is refused with `THE OUTPUT DOES NOT PARSE`.

**The instruments' cell is 26 of 26 at both refs**, and its byte-for-byte row still
reproduces all four of part 1's product files.

---

## 2. STEP 1: THE TABLE FOR THE BIG CUT, MY COUNTS BESIDE R3's

R3's counts reproduce EXACTLY when the table is put back into the state R3 measured it in -
the committed spike table with B.3's own prescribed boot edit, four `kind` fields flipped
from `move` to `seam` and `TA-S35` split:

| | R3 | mine, reproduced | mine, as this part ships it |
|---|---|---|---|
| move regions, all three files | 41 | **41** | **41** (34 in `today-app.cjs`) |
| "seams" | 25 | **25** | **20 `seam` + 135 `replace`** |
| lines moved out of `today-app.cjs` | 679 | **679** | **679** |
| crossings / distinct | 286 / 99 | **286 / 99**, and every class count identical (119 / 47 / 34 / 33 / 29 / 24) | **210 / 79** stranded before the interface; **0 / 0** on the product output |

**Every difference, explained by measurement and not by argument.**

1. **41 / 25 against 41 / 20+135.** R3's 25 counts the five boot statements as seams,
   because S-R21 had not yet given them a kind of their own; the spec says so in terms.
   `20 seam + 5 replace = 25`. The other 130 `replace` rows did not exist at R3: six are
   part 1's gym interface rows (`GA-R01` to `GA-R06`), and **124 are this part's** - 116
   generated and 14 hand-designed, minus the six gym rows already counted.
2. **286 -> 280, and the six rows are named.** Applying the five boot REPLACEMENTS instead
   of leaving the boot lines released removes ten rows and adds four, all listed: out go
   `foodLane:422`, `sleepLane:482`, `sleepLane:567`, `loadCheckInKit:567`,
   `canAdoptAthleteState:2440`, `armAdoptionGate:2441`, `settleAdoption:2550`,
   `adoptAthleteState:2550` and the two `paint` rows part 1's W7 substitutions removed; in
   come **`ready` at `:668` (read), `:2333` (WRITE), `:2335` and `:2576`**, which is B.3
   consequence 3 confirmed by measurement and the whole reason S-R21 exists.
3. **280 -> 210 stranded.** The difference is part 1's own gym interface rows and the fact
   that this measurement is over `today-app.cjs` alone.
4. **210 -> 0 on the product output.** That is the interface carrying everything, and it is
   H.2 STOP 11's PASS condition.

**THE TABLE IS BY A GENERATOR, NOT BY HAND.** 111 hand-written rows is exactly the hand
census that failed twice before (`DECISIONS:550`'s diagnosis), so
`rebuild/lanes/c/today-split-spike/gen-interface.cjs` reads the reference POSITIONS out of
the same scope analysis `census.cjs` uses and rewrites each reference in place. The map is
declared and not inferred: a read becomes `facade.<name>()`, a call becomes `hooks.<name>(`
unless it is one of B.3's four pure reads, and **a write or update is REFUSED**.

**ANCHORED BY CONTENT, AND MY FIRST CUT OF IT WAS WRONG.** The hand table's first form used
LINE NUMBERS and produced a DIFFERENT set of anchors at the two refs, because
`today-app.cjs` gains one line below `:869` between them: eleven of the thirteen would have
been anchored on the wrong line at the tip, one of them on a bare four-space brace that
occurs 42 times. Every row now names its exact pre-image and is located by it, a run that
matches zero places or more than one REFUSES, and **the two refs now produce identical rows,
anchors and replacement text, byte for byte.** That defect was found by running the
generator at both refs and diffing, which is R3's own method turned on my own work.

---

## 3. STEP 2: WHAT WAS CUT, WITH THE CODEMOD'S OWN COUNTS

```
today-app.cjs      -> today-lanes.cjs   moved  679 lines in 34 regions; 135 replace;
                                        14 seams left released; released file 1972 lines
WITNESS CHECK (S-R19, S-R20): 169 regions compared against regions.json's recorded sha256
  and line count BEFORE any substitution; every one matched, every file agreed on one ref,
  and every per-file moved-line total is the recorded one.
DECLARED-TEXT WITNESS (R1 NOTE-1, R2 F4): 48 substitution rows and 141 replacement rows,
  3 product blocks and 3 compose blocks compared against regions.json's recorded sha256 per
  row and the recorded counts, BEFORE any source file was opened; every one matched.
SUBSTITUTIONS: 39 rows / 41 occurrences applied after the witness passed
REPLACEMENTS (S-R21, each an S-R17 (g) STOP declared in advance): 135 rows
```

`PART2-CUT-REPORT.json` is the whole of it, committed.

**THE INTERFACE, read off the census and not designed and then checked.**

| direction | measured | how it is carried |
|---|---|---|
| RELEASED -> SEALED | 200 references on 111 lines, now **0** | `facade`, **37 read-only getters**; `hooks`, **29 entries** (9 pass-through, 5 boot, 15 write) |
| SEALED -> RELEASED | 27 names, 94 references | 5 by the frozen `painter` handle through D.1's W1, W2, W3, W4 and W9; 3 re-`require`d by the seal (`FoodModel`, `SleepModel`, `plainOrDrop`); 1 bound after the fact (`sleepDraftHeld`); **18 INJECTED by name in the factory signature** |

**The eighteen injections are why this is a pure move.** A moved byte that names
`SLEEP_NOTHING_RECORDED` or `phone` or `reasonOf` keeps its own spelling, because the name
is a parameter of the factory it now sits in. Nothing inside a moved region was rewritten
for any of them.

**D.1's W-family arithmetic, reproduced independently.** R3 BLOCKING-3 corrected B.5's rows
by reading `CROSSINGS.md`; my generator measured the same numbers from the scope tree
without looking at either: **W1 `render` 23, W2 `mountToken` 16, W4 `screen` 15 occurrences,
W3 `clearSleepDraft` 4, W9 `paintTodayEntry` 1.** Forty substitution rows over 59 references.

**THE BOOT ORDER IS IDENTICAL BY CONSTRUCTION.** `cut.cjs` prints the mount's 13 top-level
executable statements; the five S-R21 replacements keep the exact positions they occupy
today, and `willAdopt` and `ready` move to factory scope because the statements that declared
them are now calls (B.3 consequences 2 and 3). D.2b's listener census and D.2's DOM
snapshots are what prove the order, and both are equal in 7 of 7 states.

---

## 4. EVERY HAND-WRITTEN LINE, BY FILE AND PHYSICAL LINE

**The PM reads exactly these.** Everything not listed here is a moved byte or an untouched
byte. All of them are DECLARED in `regions.json`'s `product`, `compose`, `substitutions` and
`replacement` rows, so the codemod and not a hand put them on the page, and R2 F4's witness
hashes every one.

**Counting convention**, as `DECISIONS:574` states it: AUTHORED LINES per file is the file's
physical line count minus its moved-line total from the witness.

### `rebuild/m3/w7-preview/today/today-lanes.cjs` (**947** lines, **268** authored)

| lines | what |
|---|---|
| `:1-:35` | `"use strict";`, the file banner (what was cut, from where, that the bytes were witnessed at two refs, what is NOT in here and why) and the **three requires**: `food-model.cjs`, `sleep-model.cjs`, `plain-copy.cjs` |
| **`:36-:39`** | **THE FACTORY SIGNATURE**, four lines: `function createTodayLanes({ doc, model, options, painter,` and the **eighteen injected names**. This is the single most load-bearing hand-written line group in the file |
| `:40-:44` | the five-line comment on the three bindings that are not moved bytes |
| **`:45-:47`** | `let sleepDraftHeld = null;`, `let willAdopt = null;`, `let ready = null;` |
| `:49-:62` | E.6's comment: what the guard is, why it is a runtime guard, and why `removeEventListener` goes with it |
| **`:63-:76`** | **E.6's GUARD, fourteen lines**: `let gestures = 0;`, `const wrapped = new WeakMap();`, `wrapFor` (five lines), and `const gesture = (name, fn) => (...a) => { if (!gestures) throw new Error("WRITER-OUTSIDE-GESTURE: " + name); return fn(...a); };` |
| 34 region banners | `:77 :83 :100 :103 :117 :129 :132 :140 :152 :174 :180 :214 :229 :242 :267 :295 :313 :329 :332 :350 :394 :407 :413 :425 :445 :451 :483 :609 :625 :675 :696 :743 :755 :765` plus the codemod's blank separators |
| `:824-:947` | **THE RETURN BLOCK, 124 lines**: the recorded-laxity comment, `return Object.freeze({`, `facade: Object.freeze({` with **37 getters**, `hooks: Object.freeze({` with **29 entries**, the closing brace and `module.exports = { createTodayLanes };` |
| inside moved regions, NOT authored slots | the 41 substitution occurrences of W1, W2, W3, W4, W9 and W10 |

### `rebuild/m3/w7-preview/today/today-app.cjs` (**1972** lines, **166** authored)

| lines | what |
|---|---|
| `:35-:39` | a four-line comment and `const { createTodayLanes } = require("./today-lanes.cjs");`, at MODULE level, after the `sleep-model.cjs` require |
| **`:367-:388`** | the composition, 22 lines: a ten-line comment, **the frozen five-entry `painter`** (`repaint`, `screenNow`, `token`, `clearDraft`, `paintTodayEntry`) and **`const { facade, hooks } = createTodayLanes({ ... })`** over four lines |
| 135 `replace` rows writing **139 lines** | the interface rows. 116 GENERATED one-line rewrites, **14 HAND-DESIGNED** (below), 5 boot replacements |

**THE FOURTEEN HAND-DESIGNED ROWS, which are B.5's class that decides what is stored.** Each
is written out in `gen-interface.cjs` beside the pre-image it replaces, and the generator
asserts they cover exactly the 18 stopped lines and no more:

| id | pre-image | replacement | why |
|---|---|---|---|
| `TA-W01` | the `const sleepDraft = {...}` declaration | the same two lines **plus** `hooks.bindSleepDraft(sleepDraft);` | the seal holds the SAME object, not a copy |
| `TA-W02` | `if (!measureScreen) measureScreen = Screen.createMeasureScreen(measureDeps());` | `hooks.mintMeasureScreen(Screen);` | the seal owns its own screen cache |
| `TA-W03` | the import-screen twin | `hooks.mintImportScreen(Screen);` | |
| `TA-W04` | `if (foodReadBack) retry.addEventListener("click", () => { foodSaving = retryFoodRead(); });` | `if (facade.foodReadBack()) hooks.listen(retry, "click", () => { hooks.retryFoodRead(); });` | the seal mints and assigns the promise |
| `TA-W05` | `save.addEventListener("click", () => { foodSaving = recordIntake(save, cal, pro, error); });` | `hooks.listen(save, "click", () => { hooks.recordIntake(save, cal, pro, error); });` | STOP 3: the DOM arguments are unchanged |
| `TA-W06` | `sleepCheckInViewPending = Promise.all([...]).then(() => {` | `hooks.readSleepCheckInView(date, () => {` | R2 BLOCKING-1: the seal mints the handle, the paint that follows stays released byte-identical and is handed in as a closure |
| `TA-W07` | four lines, **eight assignments** (SEAM 9a) | `hooks.sleepNightChosen(dateBox.value \|\| null);` | the RAW field value is all that crosses |
| `TA-W08` | three lines, four assignments (SEAM 9b) | `hooks.keepNight();` | no argument at all |
| `TA-W09` | `retry.addEventListener("click", () => { sleepSaving = retrySleepRead(); });` | `hooks.listen(retry, "click", () => { hooks.retrySleepRead(); });` | |
| `TA-W10` | `change.addEventListener("click", () => { sleepCorrecting = true; render("sleep", false); });` | `hooks.listen(change, "click", () => { hooks.sleepCorrect(true); render("sleep", false); });` | the repaint stays released |
| `TA-W11` | `sleepCorrecting = false; clearSleepDraft(); render("sleep", false);` | `hooks.sleepCorrect(false); clearSleepDraft(); render("sleep", false);` | the draft is the screen's own transient state |
| `TA-W12` | `save.addEventListener("click", () => { sleepSaving = recordSleep(map); });` | `hooks.listen(save, "click", () => { hooks.recordSleep(map); });` | the one gesture that writes a night |
| `TA-W13` | `if (next === "sleep") { sleepCheckInDay = null; sleepCheckInPending = null; }` | `if (next === "sleep") hooks.forgetCheckInRead();` | SEAM 10; `mountToken += 1` above it stays RELEASED under S-R15 |
| `TA-W14` | `ready = settleAdoption(adopting ? adoptAthleteState() : Promise.resolve(), adopting);` | `hooks.settleAdoption(adopting);` | B.3 consequence 3 |

### `rebuild/m3/w7-preview/today/build.mjs`

One `REQUIRED_INPUTS` entry and its five-line comment: **50 becomes 51**, and the `today/`
entries become **29**, which are S-R18's numbers exactly.

### `rebuild/m3/w7-preview/today/test/food.test.mjs` and `test/problem.test.mjs`

One string each (which file is sliced) plus a four-line and a three-line comment saying why.
No assertion re-pointed, removed or weakened.

### `rebuild/lanes/c/today-split/writer-fence.test.mjs`

86 rows and the table entries they read, section 7 below.

---

## 5. EVERY DECLARED SUBSTITUTION AND REPLACEMENT

**Substitutions applied to moved bytes: 39 rows over 41 occurrences in `today-app.cjs`**,
plus part 1's seven. Every one is generated from the scope tree, and every one is a declared
W family:

| family | what | occurrences | kind | S-R17 (g) |
|---|---|---|---|---|
| **W1** | `render(` -> `painter.repaint(` | 23 | call-target rewrite | ordinary |
| **W2** | `mountToken` -> `painter.token()` | 16 | binding read to a call | **STOP, pre-ruled by D.1** |
| **W3** | `clearSleepDraft()` -> `painter.clearDraft()` | 4 | call-target rewrite | ordinary |
| **W4** | `screen` bare read -> `painter.screenNow()` | 15 | binding read to a call | **STOP, pre-ruled by D.1** |
| **W9** | `paintTodayEntry()` -> `painter.paintTodayEntry()` | 1 | call-target rewrite | ordinary |
| **W10** | `sleepDraft` -> `sleepDraftHeld` in `TA-S30` | 1 | **bare identifier rewrite** | ordinary |
| W5 | declared and **NOT USED** (STOP 2) | 0 | - | - |

**W10 EXISTS BECAUSE THE FENCE FOUND A REAL DEFECT IN MY FIRST FORM.** With the seal holding
`let sleepDraft`, `FENCE-SEALED-BINDING-ASSIGNED` read the RELEASED `const sleepDraft = {`
as the released half assigning a name the seal declares, and it was right to: two bindings
with one name across the seam is the shape that would hide a real assignment. The sealed one
is now `sleepDraftHeld`, which D.1 calls an ordinary rewrite.

**Replacements applied to released lines: 135 rows writing 139 lines**, all in
`today-app.cjs`: 5 boot (S-R21), 14 hand-designed (section 4), 116 generated. Every one is a
statement rewrite of a RELEASED line and every one is declared in advance in the table,
which is the form `DECISIONS:574` rules for released lines outside any region.

---

## 6. THE INSTRUMENT TABLES ON MY OWN OUTPUT

### `census.cjs` on the PRODUCT output (H.2 STOP 11, B.5's acceptance test)

```
crossings: 0 references, 0 distinct direction+name
  released reads a sealed binding        0
  released calls a sealed function       0
  RELEASED ASSIGNS A SEALED BINDING      0
  sealed reads a released binding        0
  sealed calls a released function       0
  module-constant                        0
the instrument's own residue: 0
```

### `census.cjs` on `--no-replace` (what the cut STRANDED, `PART2-CROSSINGS.md`)

210 references, 79 distinct names: 103 released reads, 44 released calls, 33 module
constants, **23 released assignments**, 4 sealed calls, 3 sealed reads. One residue row,
`sleepDraftHeld`, which is an artefact of the measurement mode itself (its declaration lives
in the product block, which `--no-replace` does not write); in the product output it is 0.

### `capture.cjs` on the PRODUCT output (S-R23)

| name | CODE POSITION | property key | member | wrapper's own | declared row's | free? |
|---|---|---|---|---|---|---|
| `facade` | 0 | 0 | 0 | 136 | 0 | **FREE** |
| `hooks` | 0 | 0 | 0 | 30 | 0 | **FREE** |
| `painter` | 0 | 1 | 0 | 2 | 59 | **FREE** |

References compared 2467; **NAME CAPTURES: 0**.

### D.2 and D.2b, `PART2-DOM-LISTENERS.mjs`

BEFORE is the pre-cut view at `da9f8683` swapped in place (a COPY of the directory is not
the page: `today-engine.cjs` requires `../browser-engine.cjs` and several siblings climb two
levels out, so the first form of this artifact failed on that and the failure is recorded
here rather than hidden), each form measured in its own child process because node caches a
module by resolved path.

| state | D.2 DOM | D.2b listeners |
|---|---|---|
| `today`, `why`, `nutrition`, `recovery`, `coach`, `weigh`, `workout` | **EQUAL in 7 of 7** | **EQUAL in 7 of 7**, 16 kinds each |

**NOT COVERED: 0.** H.2 STOP 4 fires above three.

### D.4, the copy multiset

Distinct literals before 365, after 366; **nine references differ and every one is
`"use strict"` or a module specifier** (the three re-requires doubled, plus the new
`"./today-lanes.cjs"`). `today-lanes.cjs` holds **zero** string literals of more than three
words outside a module specifier, which the fence asserts. D.4's prediction was EMPTY and it
is met.

### H.2 STOP 7 and 7b, the export surface

`today-app.cjs`'s `module.exports` block is **BYTE-IDENTICAL** to the pre-cut file, and the
returned api literal is region `TA-M14`, a seam: the only lines of it that changed are the
three generated `facade.` rewrites inside it, so `Object.keys(api)` is unchanged and in the
same order, and `ready` is still the accessor `get ready() { return facade.ready(); }`
observing the setup `done` reassignment through the seal.

---

## 7. THE BAR, IN FULL

### On the PC, ALONE, and I say so because `DECISIONS:562` requires it

Nothing else of mine was running during any of these; the only other PC work in this session
was short `git`, `copy` and `certutil` calls that had finished.

| when | what | result |
|---|---|---|
| 12:34:46-12:37:38 ET | the today step, BEFORE my first product edit | **682 / 680 / 2**, 171.8 s |
| 13:22:48-13:25:53 ET | the today step, after the big cut | **682 / 680 / 2**, 184.7 s |
| 13:37:19-13:40:26 ET | after the gesture guard | 682 / 679 / 3 |
| 13:43:02-13:46:13 ET | again | 682 / 679 / 3 |
| 13:47:07-13:50:12 ET | again | **682 / 680 / 2** |
| 13:56:10-13:59:44 ET | **the final bar**: the today step, the fence, the lane-d cells, `b-package` | **682 / 680 / 2**; fence **395 / 395**; lane-d **101 / 101**; `b-package` refuses |

**THE TWO FAILURES ARE THE SAME TWO EVERY TIME**: `boundary.test.mjs` P-MEASURE (g) and
`setup.test.mjs` re-pin, the known pre-existing reds of `DECISIONS:552`.

**THE THIRD FAILURE IN TWO OF SIX RUNS, characterised rather than waved away.** It was a
DIFFERENT cell each time - `problem.test.mjs`'s build-id injection once and
`journey.test.mjs`'s week 12 once - and both are **green when run alone on the PC** (131/131
and 3/3). Both reproduce in the farm under the same parallel pressure.
**`journey.test.mjs` never names `today-app.cjs`, `today-lanes.cjs` or `mountToday` at all**,
so the cut cannot reach it; `problem.test.mjs`'s is `buildToday` and `package.test.cjs`'s
`buildToday` writing the same `dist` concurrently. They are parallel-execution flakes of the
step, they predate this part, and the clean runs before and after the cut are the evidence.

### In the farm

| | |
|---|---|
| the instruments' cell | **26 / 26** at `s9` and at `tip` |
| the writer fence | **395 / 395** |
| the whole today step | 682 / 679 / 3, the third being `journey.test.mjs` under load; 3/3 green alone. The PC is the bar of record |
| `PART2-DOM-LISTENERS.mjs` | 7 of 7 DOM equal, 7 of 7 listeners equal, 0 not covered |

### `b-package.cjs --ci --package S8`, recorded by name and not chased

```
B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed;
local diagnostics withheld                                                     exit 1
```

### The fence's own rows, numbered as R3 NOTE-8 asks

86 rows added. The E.5 numbering the spec could not be counted off the page, carried in the
cell itself: **row 1** the alias (`ok 381`), **row 8** `FENCE-MODEL-HELD` as a counted pin
(`ok 386`, `ok 387`), **row 11** the fourth durable writer (`ok 379`, `ok 380`), **row 12**
the unfrozen facade (`ok 384`, `ok 385`), **row 13** `FENCE-SEALED-BINDING-ASSIGNED`'s third
pair, **row 15** copy in the seal (`ok 382`, `ok 383`), **row 19** the listener shim
(`ok 388`, `ok 389`, `ok 390`), and **E.6's four runtime rows plus its red** (`ok 391` to
`ok 395`).

---

## 8. THE SEALED AND PINNED PATHS THIS PART MOVES, FOR THE S10 BRIEF

Pre is the file at `33cc25f` (the last commit before my first product edit); post is the
file at `b9f2d54`. Both are sha256 of the file's LF bytes, taken from Git on the PC.

| path | role | pre sha256 | post sha256 |
|---|---|---|---|
| `rebuild/m3/w7-preview/today/today-app.cjs` | **S8-pinned**, and the split releases it | `efaf6c0dbb871730788d8953ed470f2650d739b5de7c52fa7f779f2c125df933` | `d1e1f1e7e69a7ed1af6dbbef8f0d1b9c5eef2017deb7e80f9d4df50da3548cad` |
| `rebuild/m3/w7-preview/today/today-lanes.cjs` | **NEW, sealed-to-be** | (new file) | `d6f6bfbbeadefe16ced6fb0feb7b4b2c3dcfe34fce29a5331b6b69358c46e9b1` |
| `rebuild/m3/w7-preview/today/build.mjs` | **S8-pinned** | `0cecdcbd8fc5417cf2f4c77a6c4f0722ec40f531cfba6fb27fc6bf7cfcbe45d7` | `7ad83a4876243254d8767caa6ff570adff62efe3c1458477512f4599dc6f1fad` |
| `rebuild/m3/w7-preview/today/test/food.test.mjs` | **S8-pinned test cell**, D.3 edit 1 | `088530cfccbba5eceb19fbae627b7977794f42bd4849126edede061f74a9c95b` | `6432bd5af6326aa8f17a9cf52c967b7e9a3c3681c08e1456b784bcd72145394e` |
| `rebuild/m3/w7-preview/today/test/problem.test.mjs` | **S8-pinned test cell**, D.3 edit 2 | `cb42052b4aa055cc5e9a6449fe78d2fcc1425b1adf8c99916b9104608be56b4e` | `a222f0ced6dcdd2068e02f5616630a394192066875eda876433b9a8ba1a608f9` |

**No other file under `rebuild/m3` is touched by this part**, and `gym-app.mjs`,
`gym-settings-lane.mjs`, `today-model.cjs` and `today-readings.cjs` are byte-identical to
part 1's accepted forms. Everything else I wrote is under
`rebuild/lanes/c/today-split-spike/`, `rebuild/lanes/c/today-split/` and this report.

**D.6**: the numstat over `rebuild/engine rebuild/coach rebuild/DECISIONS.md
rebuild/authority rebuild/client rebuild/m4 rebuild/conform` between `33cc25f` and HEAD
prints **NOTHING**.

---

## 9. WHAT IS UNMEASURED

1. **The one-handoff rule for `model` is NOT BUILT** (STOP 1). 32 released sites, pinned as
   a ceiling and not a zero.
2. **B.6's outcome type is NOT BUILT** (STOP 2), and W5 is declared and unused. What
   `recordSleep`'s eleven sentences and `recordIntake`'s two would look like as outcome
   shapes, and whether the view's mapper reproduces them character for character, is
   unmeasured because nothing ran it.
3. **E.6's guard covers 2 of 9 subjects** (STOP 5). The other seven are unguarded and named.
4. **The in-flight flag over seven writers is NOT BUILT** (STOP 6).
5. **D.5, the browser check, was not run**: the ticket forbids a browser this round, and
   `DECISIONS:535` keeps `browser-check.mjs` stale-red outside CI. Its baseline is unchanged
   by this part because no copy and no DOM shape moved (D.2, D.4), but that is an inference
   and not a run.
6. **The design gates were not run**, by the same instruction.
7. **D.2 drives SEVEN states.** The inventory's T-02..T-95 and W-01..W-40 are not seven
   states, and the harness I wrote drives the router's own screens. What it proves is that
   the paint and the wiring of those seven are identical; what it does not prove is the
   states that need a store, a lane failure or a mid-write reopen.
8. **The `facade` hands back LIVE objects** (the lanes, the read-backs, the two screens), so
   released code can still change sealed read state without a hook. That is S-R29's recorded
   laxity in the second file, it adds no power today because the released half held those
   same objects directly before the cut, and the module says so in its own words at the
   return block. Closing it is the ticket that seals the writers' own decisions.
9. **The five boot hook names** (`bootFoodDays` and its four siblings) are free until the
   S10 brief pins them, as `DECISIONS:574` rules.
10. **`node --check` and the today step are what prove the 139 replacement lines parse and
    run**; there is no separate proof that each of the 116 generated rewrites is the rewrite
    a reader would have written, beyond the rule being three lines long and the census being
    zero.
11. **The two flaky cells** (section 7) are characterised over six runs, not diagnosed. I did
    not change either cell and neither is this lane's.
12. **The declared-text witness is TAMPER EVIDENCE, not an oracle**, unchanged from part 1
    and now covering two more blocks.

---

## 10. HOW TO RE-RUN EVERY NUMBER ABOVE

From a farm scratch worktree at this branch, with the spike directory as the working
directory and a tree of the PRE-CUT sources at `--root` (built with
`git show <ref>:rebuild/m3/w7-preview/today/<file>`):

```
node gen-interface.cjs --root <pre> --json rows.json     # 116 generated + 14 hand rows
node gen-lanes.cjs                                        # the product and compose blocks
node gen-witness.cjs --root <pre> --ref-name s9  --ref da9f8683... --branch rebuild/b-s9-ui-pins
node gen-witness.cjs --root <tip> --ref-name tip --ref 4d2112c9... --branch rebuild/t2-client-core
node gen-witness.cjs --declared
node cut.cjs     --root <pre> --out prod --product --only today-app.cjs
node cut.cjs     --root <pre> --out pre  --only today-app.cjs --no-replace
node census.cjs  --root <pre> --out prod --pairs today-app.cjs=today-app.cjs,today-lanes.cjs=today-app.cjs
node capture.cjs --root <pre> --out prod --names facade,hooks,painter
node --test rebuild/lanes/c/today-split-spike/test/instruments.test.cjs      # 26 / 26
SPLIT_TEST_REF=tip node --test rebuild/lanes/c/today-split-spike/test/instruments.test.cjs
node rebuild/lanes/c/today-split/PART2-DOM-LISTENERS.mjs                     # D.2 and D.2b
```

On the PC, from the lane worktree:

```
node --test rebuild/lanes/c/today-split/writer-fence.test.mjs                # 395 / 395
node --test <the seventeen files at .github/workflows/rebuild.yml:232>       # 682 / 680 / 2
node rebuild/lanes/b/tooling/b-package.cjs --ci --package S8                 # refuses
```
