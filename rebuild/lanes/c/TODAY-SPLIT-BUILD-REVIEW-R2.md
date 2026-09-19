# TODAY-SPLIT BUILD, PART 1 - INDEPENDENT REVIEW R2

Reviewer: cowork (Earned lane hand, independent reviewer), told to disagree. The author is
gone and their claims were treated as hypotheses. Head reviewed:
`20ad63d39a6f684f48dd53cf110f023007cddd5e` on `rebuild/c-today-split-build`, farm-synced
(privacy proof PASS), PC worktree clean at the same sha. This is the SECOND round: it judges
review R1 (`f9ec6f0f`) and the three fix commits `7f08c7ea`, `247bb859`, `20ad63d3`.

Every number below is one I measured myself, in a farm scratch or on the PC. Where I
reproduce an author number I say so, and where I could not reproduce one I say that instead.
I did not reuse the author's test harness for any attack: my attacks run from a harness of
my own against copies of the tree.

---

## VERDICT: ACCEPT WITH NOTES

**The product bytes of part 1 are proven, not argued.** Independently of the author's cell, I
rebuilt all four committed product files byte for byte from the S9 sources plus the declared
table, and all four sha256s match the committed files. I then derived the authored set
mechanically from the codemod's line map, got 67 authored CODE lines across four files, and
read every one. I drove the real weigh-in and the real gym card through both the pre-cut S9
model and the post-cut pair and got identical results. Nothing durable changed behaviour.

**Both R1 blocking findings are genuinely and structurally closed**, not papered over, and
the fix round moved no product byte: every section 8 post-hash is unchanged at HEAD.

**My own six findings are all in the guard and paperwork layer, and none of them is a defect
in what ships.** I planted five violations that the writer fence let through green; in every
case I then measured that the construct the fence cannot see occurs ZERO times in the four
files of this part, so the report's claims are true of the bytes and only the guard is weaker
than it reads.

**Why ACCEPT WITH NOTES and not a third REJECT.** Part 1's bytes have now been verified by a
stronger mechanism than any review argument: byte-for-byte reconstruction from the declared
table, plus a behavioural differential against the pre-cut model. Two rounds have now found
nothing in the product. My findings are cheap, and every one of them can be closed as the
first commits of part 2, before the fence is asked to judge a single moved line of
`today-app.cjs`. Stalling part 1 a third time buys nothing that ordering part 2 does not buy.
**This is a judgement about sequencing, not about severity: findings F1, F2 and F3 are hard
preconditions on part 2 and the PM should treat them as blocking there.** The PM may of
course overrule and send this round back; if so, F1 alone is worth the round.

---

## 1. EVERY R1 FINDING: FIXED, STILL OPEN, OR DISPUTE UPHELD

| R1 finding | my verdict | evidence |
|---|---|---|
| **BLOCKING-1** the instruments' cell is 10 of 14 at the shipped head | **FIXED, structurally** | 20 rows, 20 pass at `20ad63d3` with `SPLIT_TEST_REF=s9` AND 20 / 20 at `=tip` |
| **BLOCKING-2** an application name on the suppression list | **FIXED, and the rule is now measured** | R1's exact planted write is RED; the list is 9 builtins; a row measures every suppressed name against `globalThis` |
| NOTE-1 the declared substitution TEXT carries no witness | **FIXED for substitutions and replacements, STILL OPEN for two other blocks** | see F4 |
| NOTE-2 `capture.cjs` has never run on the bytes that ship | **FIXED** | 1243 references, 0 captures, no `NO LINE MAP`, on an output I proved identical to the shipped files |
| NOTE-3 eight RED rows, not nine | **FIXED** | `grep -c '^test("RED'` = 12, and the header says twelve |
| NOTE-4 the fifth test edit is outside D.3 | **CORRECTLY LEFT OPEN for the PM** | `machine-settings-ui.test.mjs` is byte-identical to the R1 head |
| NOTE-5 the lane-d description is wrong | **FIXED** | I re-measured: exactly two of the ten name either file |
| NOTE-6 the `replace` witness never refuses | **DISPUTE UPHELD, and R1's premise was already false** | see below |
| NOTE-7 count drift 1243 against 1277 | **DISPUTE UPHELD for the author** | I measure **1243** |
| closing note: a regenerated crossing table | **DONE** | `PART1-CROSSINGS.md`, 20 rows, every row carries a disposition |

### BLOCKING-1 is closed at the root, not at the number

`instruments.test.cjs` now reads its sources with `git show <ref>:<path>` at a ref the witness
block itself names, so no row ever opens the working tree's copy of a cut file. I checked the
fix is not vacuous: row 15 asserts the working tree's `gym-app.mjs` HAS been cut, that the
ref's has not, and that the full cut runs green on the ref's. That is a proof by difference,
which is the right shape. It will still run after part 2 cuts `today-app.cjs`.

### BLOCKING-2 is closed, and the second hole the author found beside it is real

I re-planted R1's exact line, `if (entry) entry.save({ lift: liftId, note: 'x' });`, after
`const entry = facade.entryFor(liftId);` in the released gym card. **RED, 25 / 26**, naming
`FENCE-WRITER-NAME`. I also planted a SECOND call through an already-declared name at a new
site (`model.logSet({ lift: liftId })`): **RED**. The site keying works.

### NOTE-6: R1's premise was already wrong at the head R1 reviewed

R1 wrote that "every declared `replace` region is one or two lines, so all of its lines are
anchors and the witness has nothing left to catch". **`GA-R06` spans SEVEN lines**
(`gym-app.mjs:570-:576`, the second returned api). I tampered its MIDDLE line with both
anchors left byte-identical:

```
REFUSED: gym-app.mjs GA-R06: BYTES DO NOT MATCH THE WITNESS. 7 lines at :570-:576
  hash b3cb499cac88d758..., the witness records s9=bf4ba4ddd153daa9..., tip=bf4ba4ddd153daa9...
```

**The `replace` kind's witness does refuse, by region id, at the grain R1 said it could not
reach.** The author's decision to leave the check order alone is right and their reason is
right; R1's factual premise is not.

### NOTE-7: 1243 reproduces, 1277 does not

`capture.cjs` over an output whose four files I had just proved sha256-identical to the
shipped ones: **references compared 1243; stranded 50; NAME CAPTURES 0**. The author's number,
not R1's. The load-bearing number, zero captures, reproduces either way.

---

## 2. MY OWN FINDINGS

### F1. The writer fence's copy rows are blind to TEMPLATE LITERALS

`writer-fence.test.mjs:188`, `literalsOf`, matches two literal kinds:

```js
const re = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g;
```

Backticks are not there. The two rows that rest on it are
`FENCE-COPY-IN-SEAL: gym-settings-lane.mjs holds ZERO athlete-facing string literals` and
S-R22's `today-readings.cjs ... exactly their prose`. I planted, in
**`today-readings.cjs`, the sealed module that writes the athlete's weigh-in**:

```js
const m = `That weight looks wrong. Nothing was recorded.`; void m;
```

**The fence stayed at 26 of 26.** The same plant in `gym-settings-lane.mjs` also stayed green.

This is the same class as R1 BLOCKING-2: a row whose stated claim is false for an entire,
ordinary syntax, provable by a planted violation that stays green, on a file on the path to
the athlete's data. It is not a live defect: I measured that **both sealed files hold zero
template literals today** (the two backtick lines in `gym-settings-lane.mjs` are inside a
comment), so the report's claim is TRUE of the bytes. But `READINGS_PROSE` is a sentence split
across three quoted literals to interpolate `FORM_MIN` and `FORM_MAX`, which is exactly the
case where the next hand reaches for a template literal, and part 2 moves 679 lines out of the
app file where the screens live.

The fix is one alternative in one regular expression, plus a red row.

### F2. The writer fence's writer rows are blind to COMPUTED MEMBER ACCESS

`memberHits` scans `/(\w+)?\s*\.\s*(\w+)/`. A durable write through a computed key is
invisible. I planted, in the released `today-model.cjs`:

```js
const leak = (r) => r['save']({ x: 1 });
```

**26 of 26, green.** The same through the gym card's lane (`lane2['save']({...})`): green. The
plain-member twin of the first plant (`r.save({ x: 1 })`) is RED on three rows, so the rows
work; they simply cannot read this syntax.

**The fence has no parser BY RULING (S-R12), so it can never see this.** The honest fix for a
parser-free scanner is not to grow a parser but to REFUSE the construct it cannot read: a row
asserting that no released or sealed file of this split contains a computed member access with
a string-literal key. I measured that count today across all four files: **zero**. The row is
free.

### F3. A local that SHADOWS a suppressed builtin exempts every write through it

The new row asserts every suppressed receiver is an own property of `globalThis`, which closes
R1's case exactly. It does not close the reverse. I planted, in the released gym card:

```js
const Set = facade.lane();
Set.save({ lift: liftId });
```

**26 of 26, green.** Measured: zero declarations shadowing any of the nine suppressed names in
the four files today, so again the row is free: no released or sealed file declares a binding
whose name is on `NOT_A_STORE_RECEIVER`.

### F4. NOTE-1 is closed for two classes of authored text and open for two others

`witness.declared` covers substitution rows and replacement rows. It does not cover
`regions.json`'s **`product`** block (the banner, factory line and return block of each new
file) or its **`compose`** block (the released half's declared lines). Both are authored text
that reaches a product file, which is exactly R1 NOTE-1's argument.

I rewrote `product["gym-settings-lane.mjs"].close` to drop `Object.freeze(` from the read-only
facade, changed no source byte, and ran the cut:

```
cut exit: 0
freeze count in OUTPUT gym-settings-lane.mjs: 2 (shipped has 3)
facade line in output: facade: ({
```

**The cut wrote an unfrozen read-only facade and exited 0.** The same held for a tampered
`compose` line. For part 1 the exposure is bounded: the fence's freeze row catches that
particular tamper in the committed file, and the byte-for-byte row anchors every authored line
to bytes the PM reads. For part 2's interface over 679 moved lines it is the same hole on a
much larger surface, and the fix is the one the author already built, applied to two more
blocks.

### F5. Report section 4's line numbers are wrong for the two NEW files

Section 4 says "**The PM reads exactly these.**" For the two files that ARE the product of this
part, the numbers do not point at the lines they name. Measured against the committed files:

| report says | the tree actually holds |
|---|---|
| `today-readings.cjs` is 79 lines | **78** |
| `:34` the factory signature | **`:32`**. Line `:34` is the moved `ALREADY_RECORDED` constant |
| `:35` the first region banner | **`:33`** (the others, `:45` and `:68`, are inside the report's ranges) |
| `:74-:79` return, brace, `module.exports` | **`:75`, `:76`, `:78`** |
| `gym-settings-lane.mjs` is 104 lines | **103** |
| `:34` the factory signature | **`:32`** |
| `:35` the first region banner | **`:33`** (`:38`, `:50`, `:67` are inside the report's ranges) |
| `:81-:104` the return block | comment `:82-:85`, `return Object.freeze({` at **`:86`**, closing brace **`:103`** |

`today-model.cjs` and `gym-app.mjs` are correct, including all six `GA-R` rows.

A PM reading `today-readings.cjs:34` literally reads a moved byte and **misses the authored
factory signature at `:32`** - the line that carries the seven injections, which is the single
most load-bearing hand-written line of cut one. The CONTENT list is complete: I derived the
authored set mechanically and found no line the report omits. Only the numbers are wrong, and
the corrected numbers are in the table above, so this costs the PM nothing to fix.

### F6. A ticket line the build declined, disclosed but not flagged as declined

Ticket part 1 item (3) says cut two carries "the in-flight flag extended to all seven writers
as R3 records". The build does not do it: `hooks.saving` covers the settings writer only. The
report discloses this honestly as UNMEASURED item 4 and assigns it to part 2. I agree with the
engineering judgement (extending an in-flight guard is new hand-written durable-writer logic,
which sits badly in a part whose whole discipline is moving bytes verbatim). But it is a
ticket line the author decided not to execute, and it belongs in section 0 beside the other
two STOPs where the PM rules on it, not in UNMEASURED where the PM discovers it.

---

## 3. WHAT I TRIED TO BREAK AND COULD NOT

1. **R3's first two attacks, re-run by hand from my own harness.** Weakening a conditional
   inside the moved sleep region: `REFUSED: today-app.cjs TA-S30: BYTES DO NOT MATCH THE
   WITNESS. 124 lines at :1808-:1931 ...`. Two inserted lines: `REFUSED: today-app.cjs TA-S30:
   LAST ANCHOR IS AMBIGUOUS ... which makes the region 126 lines; the witness records
   s9=124 lines`. Both by region id.
2. **The `replace` kind's witness at seven lines** (NOTE-6 above). Refused by region id.
3. **The product bytes themselves.** I reconstructed all four committed product files from the
   S9 sources plus the table, with the author's codemod but not their test file, and compared
   sha256: `today-model.cjs`, `today-readings.cjs`, `gym-app.mjs`, `gym-settings-lane.mjs` all
   **IDENTICAL**.
4. **An unlisted hand-written line.** From the codemod's line map, the authored set is 67 CODE
   lines: 5 in `today-readings.cjs`, 22 in `gym-settings-lane.mjs`, 16 in `today-model.cjs`,
   24 in `gym-app.mjs`. I read all 67. Every one appears in report section 4. **No unlisted
   hand edit.**
5. **The six replacements, each against its S9 pre-image.** All faithful. In particular
   `GA-R02`'s `facade.entryFor` returns `settingsRead.get(liftId) || null` and the pre-image
   was already `const entry = settingsRead.get(liftId) || null;`, so there is no
   `undefined`-to-`null` change, which is the regression I went looking for. `GA-R03`'s
   `hooks.saving(p)` assigns and returns `p`, which is the statement it replaces.
6. **The five `lastMessage` substitutions.** Exact, declared, and each labelled an S-R17 (g)
   STOP by the author in section 5's own column. The author reported rather than bent.
7. **Behaviour, through the real model on both forms.** `adapter.test.mjs` (the weigh-in,
   ALREADY_RECORDED, out of range, the empty form, `reopen` and NO_STORE, through the real
   encrypted reading host) is **20 / 20 against the pre-cut S9 `today-model.cjs` and 20 / 20
   against the post-cut pair**. `gym.test.mjs` is **65 / 65 on both**. I also ran a direct
   differential of my own: 31 observations (the four constants, nine refusal inputs and the
   message each leaves behind, `reopen`, the returned key set) across the two forms,
   **0 differ**.
8. **`recordSettings` and the gym paint path.** `recordSettings` differs from its S9 form by
   exactly the three declared replacement lines and nothing else; its `finally` line is
   untouched. `paint()` is **byte-identical**, and `const started = await model.start();`
   inside it is byte-identical, so S-R12 is honoured.
9. **The cut's own guards.** `--no-replace` combined with `--product`:
   `REFUSED: --no-replace is a measurement mode and cannot be combined with --product.` A
   `regions.json` with the witness block deleted: `REFUSED: regions.json carries no witness.`
10. **The custody fence.** Twenty files between the merge `4aadb0f3` and HEAD, every one inside
    `rebuild/lanes/c/today-split*/`, the report, the spec, and the permitted product set. No
    `DECISIONS.md`, no `STATUS.md`, nothing under `rebuild/conform/private`, no
    `src/history.js`, no `ledger/`. **Part 2 is not started**: `today-lanes.cjs` does not
    exist and its one mention in `build.mjs` is inside a comment. `REQUIRED_INPUTS` is **50**.
11. **The forbidden dashes.** Across **6235** added lines on this lane, exactly one en or em
    dash, at `today-readings.cjs:38`, and it is a MOVED byte from `today-model.cjs` at
    `da9f8683`. The fix round added **zero**.
12. **Section 8's hashes.** All seven verified from git objects, and every post-hash is
    unchanged at HEAD, so the claim that the fix round moved no product byte is true.
    `today-app.cjs` is `efaf6c0d...` at the merge base and at HEAD.
13. **The crossing table.** Twenty rows, every one with a disposition naming the interface
    entry that carries it, and all seven `facade` entries and all four `hooks` entries appear
    in that column, so no entry is an interface nobody needed. It is honest about what it does
    not say, and about `GA-M01`.

---

## 4. THE BAR, AS I MEASURED IT

| | result |
|---|---|
| PC, the whole today step, the exact command at `rebuild.yml:232` on this merged branch, run ALONE | **682 tests, 680 pass, 2 fail**, exit 1 |
| the two failures | `boundary.test.mjs` **P-MEASURE (g)** (five drifting S4-sealed paths) and `setup.test.mjs` **re-pin** (three). The two known pre-existing reds of `DECISIONS:552`. **The author's AFTER count exactly** |
| PC, `rebuild/lanes/c/today-split/writer-fence.test.mjs` | **26 tests, 26 pass**, exit 0 |
| PC, the author's ten lane-d cells | **107 tests, 107 pass**, exit 0. The author's number exactly |
| lane-d cells that actually name `gym-app.mjs` or `today-model.cjs` | **two**: `b-lom/legacy-order`, `p3-real-shape/r1-fixes`. R1 NOTE-5 confirmed |
| farm, `instruments.test.cjs` at the shipped head `20ad63d3` | **20 / 20** at `SPLIT_TEST_REF=s9` and **20 / 20** at `=tip` |
| farm, `adapter.test.mjs` pre-cut (`da9f8683`) / post-cut (HEAD) | **20 / 20 and 20 / 20** |
| farm, `gym.test.mjs` pre-cut / post-cut | **65 / 65 and 65 / 65** |
| farm, my own behavioural differential across the two model forms | 31 observations, **0 differ** |
| farm, product cut reconstructed from S9 and compared by sha256 | **4 / 4 IDENTICAL** |
| farm, `capture.cjs` on those bytes | **1243 references, 0 name captures**, line map present |
| farm, `census.cjs` on those bytes | **0 crossings, 0 distinct, 0 residue** |
| farm, my five attacks that the fence let through | F1 (two plants), F2 (two plants), F3 (one plant): **all green**, all with a measured zero occurrence count in the shipped files |

**When I ran the today step on the PC, nothing else of mine was running on that machine.** The
fence run and the lane-d runs were started only after it had finished and written its `.done`
marker; the farm work above is a different machine.

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S8` I did not re-run: the author
recorded its refusal by name and the ticket says record and do not chase.

---

## 5. WHAT I DID NOT VERIFY

1. **R3's third attack, the one added space, re-derived by hand.** My own crude form added a
   space to the released `reasonOf` line itself, which is in no region, and the cut correctly
   exited 0; that is my harness being wrong, not the instrument. The author's committed row
   for it passes and I did not re-derive the exact anchor it drags. **Unverified by me.**
2. `blind.cjs`'s 53 rows, `BLIND.md`, `reach.cjs`'s tables and `REACH.md`. Not re-derived.
3. The five DECLARED but unapplied boot replacements. Nothing has run them; I confirm the
   author's UNMEASURED item 1 is genuinely unmeasured.
4. Anything behind the real port, a sealed bundle or a browser.
5. `b-package.cjs --ci --package S8`.
6. The spec's S-R25 documentation commit beyond confirming it moves no product byte.
7. The three interface names' freedom on any file part 2 will produce.
8. Whether re-taking the declared-text witness leaves a diff a reviewer would actually notice.
   That is the author's own stated control and I accept it as stated rather than tested.
9. The store-backed weigh-in branches in MY OWN differential: with no reading lane every
   `weighIn` takes the NO_STORE path, so my 31 observations exercise `W6c` and `W6e` but not
   `W6a`, `W6b` or `W6d`. Those three are exercised by `adapter.test.mjs`, which I ran green
   on both forms, so they are covered, but not by my differential.

---

## 6. READY FOR PART 2

**Yes, the big cut can start from this head.** The instruments are sound: the pre-image witness
refuses by region id at every grain I could attack it at, including one R1 said it could not
reach; the extent check refuses; the declared-text witness refuses on substitutions and
replacements; the instruments' cell now survives the cut it measures, which is the property
part 2 depends on most.

**But the fence must be fixed before it is asked to judge a single moved line.** In this order:

1. **F1, F2 and F3, as three fence rows with a red each.** All three are cheap and all three
   are free of false positives today: zero template literals, zero computed-literal member
   accesses and zero builtin-shadowing declarations in the four files of this part. Do them
   first, because part 2 moves 679 lines out of the file where the athlete's screens live and
   this fence is what judges the result.
2. **F4**: witness the `product` and `compose` blocks the way substitutions and replacements
   are now witnessed, BEFORE part 2's interface is written. That interface is where an
   authored line reaches the athlete.
3. **F5**: correct section 4's line numbers for the two new files, using the table in section
   2 above, so the PM's final read lands on the lines it names.
4. **Four things the PM should rule on before part 2 is dispatched**, none of which a lane
   hand may decide: NOTE-4's fifth test edit (still open and correctly left open); SEAM G1's
   released half, which still decides what is stored and which part 2 inherits; F6's
   unexecuted in-flight-flag line; and the five `W6` statement rewrites, which the author
   correctly declared as S-R17 (g) STOPs and which part 2 will produce more of.

Nothing in part 1's product argues for redoing it. What argues for ordering is that part 2 is
the round where the guards finally carry weight, and three of them do not yet hold the shapes
I could drive a durable write and an athlete-facing sentence through.
