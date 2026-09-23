# TODAY-SPLIT WRITER FENCE - INDEPENDENT CLAUDE REVIEW F1

Reviewer: cowork (Claude lane hand), commissioned by PM4 under DECISIONS:574 and :577.
Told to disagree, as the owner's rule requires of every Astra build.
Head reviewed: ebb8d4990509df5795ccc13916e750eaee2719c7 on rebuild/c-today-split-build.
Under review: commits 2b751d8d, cad939bc, ebb8d499 (S-R26 to S-R29 and S-R27 (d), (e)),
that is the diff 40c355f9..ebb8d499, which is exactly two files:
`rebuild/lanes/c/today-split/writer-fence.test.mjs` and
`rebuild/lanes/c/TODAY-SPLIT-FENCE-PRECONDITIONS-REPORT.md`. NO PRODUCT BYTE MOVED.
Verified with `git diff --name-status 40c355f9..HEAD`.

## VERDICT: REJECT

Four blocking findings, each measured by running the cell's own `releasedRefusals()`
against an in-memory plant, never by reading a row title:

- **F1 BLOCKING, a hidden writer.** The scanner that answers FENCE-WRITER-NAME,
  FENCE-COPY-IN-SEAL, FENCE-PAINT-REACHES-PUT and FENCE-SEALED-BINDING-ASSIGNED is a
  SECOND, OLDER lexer with no regex branch, and no self-check row covers it. One regex
  literal containing a quote character hides a durable write in a released file with
  balance, literals, the independent keyword cross-check and `node --check` ALL GREEN.
- **F2 BLOCKING, a shared lexer mistake.** `tokensOf` and the independent regex stripper
  make the SAME mistake on a regex literal after the `)` of a control statement, AGREE
  with each other, and hide both a writer AND a `facade.lane()` acquisition. `node --check`
  passes because the file is valid JavaScript; the two readers simply read it wrongly the
  same way. This is the exact failure mode the cross-check exists to prevent.
- **F3 BLOCKING, an ordinary capability spelling that passes.** The readings use rule lets
  `options.readings` through ANYWHERE. `const second = options.readings;` and
  `consume(options.readings);` take a second handle on the raw reading store, outside the
  one declared declaration window, and the fence stays green. The PM's own observation,
  measured true, and wider than stated.
- **F4 BLOCKING, ordinary look edits that go RED, and two false sentences in the header.**
  The header says site pins ignore whitespace "so unrelated same-line look edits need no
  reseal". Measured false: in gym-app.mjs any new occurrence of the identifier `settings`
  reds the cell, including `{ settings: [] }` and `map.settings`, in a card whose whole
  subject is machine settings; and in today-model.cjs `readings?.face()`,
  `readings !== null` and `readings != null` all red.

Everything below is measured. Every fix is given as an exact patch hunk; all of them
together are in section 10, applied and run: 257 of 257, with the added and moved rows.

## 0. WHAT THE ACCEPTANCE TEST FOUND FIRST, AND IT IS GOOD

Before the findings: the thing this round was commissioned to do, it did.
Astra's blind table, run spelling by spelling through `releasedRefusals()` by me, on a
scratch copy of the released bytes, not read off the row titles:

| Astra blind row | was | refusals returned at this head |
|---|---|---|
| `const { save: auditSave } = auditStore; auditSave(m);` | GREEN | FENCE-LANE-ACQUISITION |
| `auditStore['sa' + 've'](m);` | GREEN | FENCE-LANE-ACQUISITION, FENCE-BRACKET-KEY |
| `auditStore?.['save']?.(m);` | GREEN | FENCE-LANE-ACQUISITION, FENCE-BRACKET-KEY |
| `{ const Object = auditStore; Object.save(m); }` | GREEN | FENCE-LANE-ACQUISITION, FENCE-BUILTIN-SHADOW, FENCE-WRITER-NAME |
| ``void `${auditStore.save(m)}`;`` | GREEN | FENCE-LANE-ACQUISITION, FENCE-TEMPLATE-CALL |
| `auditStore.` newline `save(m);` | GREEN | FENCE-LANE-ACQUISITION, FENCE-WRITER-NAME |
| `void facade.lane()['save'](m);` | GREEN | FENCE-LANE-ACQUISITION, FENCE-BRACKET-KEY |
| `hooks.saving(facade.lane()['save'](m));` | GREEN | FENCE-LANE-ACQUISITION, FENCE-BRACKET-KEY |
| `void import('./machine-settings-host.mjs');` | GREEN | FENCE-RELEASED-MODULE-EDGE |
| `import h from './machine-settings-host.mjs';` (mine) | not tried | FENCE-RELEASED-MODULE-EDGE |
| today-model: `void weighIn(180);` | GREEN | FENCE-CAPABILITY-SITE:weighIn |
| today-model: `void reopen(day);` (mine) | not tried | FENCE-CAPABILITY-SITE:reopen |

Every previously GREEN row is RED for a named reason. Every control that was RED is still
RED with FENCE-WRITER-NAME beside the acquisition refusal (dot call, member alias, optional
call, microtask, promise, direct lane save). The unmodified tree is green on both operating
systems. S-R27's idea, pin the ACQUISITION rather than chase the spelling, is the right
idea and it works.

NOTE F1-N1, and it matters for how much the table proves. Rows 1 to 6 are RED only because
Astra's own prologue contains `const auditStore = facade.lane();`. The SPELLING is still
invisible. Measured, with the store acquired by a route that is not pinned in gym-app.mjs
(`const auditStore = model.store;`):

```
["FENCE-WRITER-NAME"]    dot call
[]                       destructured alias: const { save: auditSave } = auditStore;
["FENCE-BRACKET-KEY"]    concatenated bracket
["FENCE-BRACKET-KEY"]    optional computed
["FENCE-TEMPLATE-CALL"]  template interpolation
["FENCE-WRITER-NAME"]    newline member
[]                       const auditKey = "save"; auditStore[auditKey](m);
```

So the fence is exactly as strong as its acquisition pins and no stronger, which is what
S-R26 says. That is honest, and it is why F1, F2 and F3, all three of which defeat an
acquisition pin, are blocking rather than notes.

## 1. F1 BLOCKING: a second lexer, with no regex branch, that no self-check covers

`releasedRefusals()` reads the source through TWO different lexers:

- `codeTokens` / `tokensOf` (lines 264 to 334), which is regex aware and IS covered by the
  balance, literal, keyword cross-check and `node --check` rows; it answers the capability,
  holder, lane, edge and syntax refusals.
- `codeOf` (lines 111 to 149) and `withoutComments` (169 to 200), a hand stripper with NO
  regex branch at all, which answers FENCE-WRITER-NAME (the PUT row, line 626), and which
  FENCE-COPY-IN-SEAL, FENCE-PAINT-REACHES-PUT and FENCE-SEALED-BINDING-ASSIGNED also read.

No row in the cell reads `codeOf` output against anything. The four "RED lexer position"
rows at 1063 to 1079 plant a regex containing a quote and then assert a witness that only
the TOKEN side can see (`FENCE-CAPABILITY-SITE:weighIn`, `FENCE-LANE-ACQUISITION`). They
never ask whether FENCE-WRITER-NAME survived. It does not.

`codeOf` walks characters; at `/` it emits and moves on; at `"` it opens a string and
scans forward to the next `"` in the FILE. A regex literal containing one quote therefore
puts the scanner inside a string that does not exist.

### F1-a, the hidden writer, measured

Planted into rebuild/m3/w7-preview/today/gym-app.mjs before the `const entry =
facade.entryFor(liftId);` anchor:

```js
const probe1 = /"/;
model.recover();
const probe2 = /"/;
```

```
releasedRefusals  -> []
PUT hits seen by codeOf -> ["(call).save","model.logSet","model.finish","model.forget","model.undo","model.start"]
balance / literals / keyword cross-check / node --check -> all GREEN
```

`model.recover` is a PUT. A seventh durable writer in the released gym card, which the
cell's own row at 738 exists to catch, is invisible. The same with a single regex in a
keyword position, where `tokensOf` reads the regex CORRECTLY and only `codeOf` desyncs:

```js
void typeof /"/;
model.recover();
const m = /"/.source;
```
```
releasedRefusals -> []   self-checks -> all GREEN
```

### F1-b, the same bug reds an ordinary look edit, measured

The other direction of the same desync. An ordinary validation regex added to gym-app.mjs:

```
["FENCE-WRITER-NAME"]   const NAME = /^[^'"]+$/;
["FENCE-WRITER-NAME"]   const APOS = /'/;
["FENCE-WRITER-NAME"]   const QUOTE = /"/;
[]                      const ID = /^[a-z-]+$/;        (no quote, so no desync)
```

FENCE-WRITER-NAME's message reads "the released gym card reaches a durable writer that is
not one of the six declared seams". That sentence is FALSE for these three edits: the
parity flip past the invented string moves the declared seam sites, not a new writer. Once
this cell is sealed, a look ticket that adds a regex with an apostrophe to a view file pays
a reseal AND leaves a lie in the CI log. That is the exact cost S-R27 (e) was written to
remove.

This is not hypothetical for part 2: today-app.cjs already carries a regex literal at 2413,
`/[?&]screen=([a-z-]+)/`. It has no quote today. The next one may.

Fix: one regex aware stripper, built on the SAME `tokensOf` the self-check rows cover, used
by `codeOf`, `withoutComments` and therefore `literalsOf`. Patch hunk 1 in section 10. After
it: F1-a reds with FENCE-WRITER-NAME, F1-b goes green, and `Math.round(next * 100) / 100`
(gym-app.mjs:346, a real division after `)`) is still a division. Measured.

## 2. F2 BLOCKING: a SHARED mistake, where both readers agree and are both wrong

The ticket asked whether the lexer and the independent stripper can make the same mistake
and agree. They can, on the single most common ambiguity in the grammar.

`regexMayStart` (321 to 327) lists the punctuation after which a `/` starts a regex. `)` is
not on the list, so after `)` the slash is always read as division. The independent
`regexStripped` (340 to 343) expresses slash context as the lookbehind class
`[=([{,:;!?&|+*%~^<>\/-]`, which also excludes `)`. Both are wrong for the head of a
control statement, and they are wrong IDENTICALLY.

Planted into gym-app.mjs, one line:

```js
if (ok) /"/.test(tag); void facade.lane().save(auditMachine); const mark = /"/.source;
```

Measured:

```
tokensOf   -> [ id if, ( , id ok, ) , punct /, string "/.test(tag); void facade.lane().save(auditMachine); const mark = /", punct /, ., id source, ; ]
regexStripped -> "if (ok) /                                                                    /.source;"
codeOf        -> "if (ok) /                                                                    /.source;"
releasedRefusals -> []
lane windows seen -> the three declared ones, unchanged
balance, literals, keyword cross-check, node --check -> ALL GREEN
```

Both readers blank the identical span, so the cross-check has nothing to disagree about.
`node --check` passes because Node's real grammar reads the slash as a REGEX (after
`if (cond)` comes a Statement), so the file is valid, and the write RUNS. I executed the
line with a stub facade: the hidden `save` fired once.

This defeats FENCE-LANE-ACQUISITION, which is the load-bearing pin of S-R27, and
FENCE-WRITER-NAME at the same time. `while (ok) ...` and `for (;;) ...` behave the same.

Fix: resolve the one ambiguity a token scanner CAN resolve. When the previous token is `)`,
walk back to the `(` it closes and look at the token in front of it; `if`, `for`, `while`,
`with` means the slash starts a regex, anything else means division. `tokensOf` already
holds the token list, and the balance self-check already guarantees the walk terminates.
Patch hunk 2. After it, the plant above reds with FENCE-LANE-ACQUISITION AND
FENCE-WRITER-NAME, and the two real divisions after `)` in gym-app.mjs:346 and
today-app.cjs:1052 stay divisions. Do NOT change `regexStripped` to match: it must stay
independent, and a future file where the two disagree SHOULD fail FENCE-LEXER-CROSSCHECK.

## 3. The rest of the lexer battery, which held

Run against the two released files and today-app.cjs, each with a durable write on the
next line, checking whether the write stays visible and whether a self-check fires:

| Attack | Result |
|---|---|
| division after `]`, `arr[0] / 2` | correct, writer visible |
| division after `}`, `function f() {}` then `/x/` | writer visible |
| regex containing a quote after `}` | FENCE-LEXER-UNTERMINATED and FENCE-LEXER-CROSSCHECK both fire, caught |
| template nested in interpolation with braces inside strings, `` `${`${"}"}`}` `` | correct |
| line comment inside an interpolation, `` `${ x // c \n }` `` | correct |
| escaped backtick, `` `a\`b` `` | correct |
| regex with `/` inside a character class, `/[/]/` | correct, both readers |
| HTML-like text in a string, `"<!-- </script> -->"` | correct |
| Unicode identifier, `const caf` + U+00E9, `const` + U+03C0 + ` = tau / 2` | split into two tokens by BOTH readers, identically; no writer hidden, no refusal moved |
| `/=` after an identifier | correct |
| ASI: newline then `/re/` after an identifier | read as division by both, which is what Node does |
| real division after `)` of a call, `f(1) / 2` | correct |

The Unicode identifier case (I used U+00E9 and U+03C0) is a shared mistake (`/^[A-Za-z_$][\w$]*/` in `tokensOf` and
`[A-Za-z_$][\w$]*` in `regexStripped`), but it is a HARMLESS one: both split the same way,
no window moves and no writer hides. Recording it rather than fixing it.

Census of slashes, for the S10 brief: today-model.cjs 0 regex and 0 slashes; gym-app.mjs
0 regex, 1 slash, after `)`, a real division; today-app.cjs 1 regex and 2 slashes, one of
them after `)`, a real division. So both fixes cost zero today.

## 4. F3 BLOCKING: `options.readings` is a blanket exemption

`readingsUseOK` line 588:

```js
if (before === '.' && ts[i - 2]?.value === 'options') continue;
```

Every `options.readings` is skipped, wherever it stands. Measured against today-model.cjs:

| plant | refusals |
|---|---|
| `const second = options.readings; void second;` | `[]` |
| `const second = options.readings; second[key]({ date: day, lb: 1 });` | `[]` |
| `consume(options.readings);` | `[]` |
| `void options.readings[key]();` | `[]` |
| `const second = options.readings;` / `const third = second;` / `third[key](1);` | `[]` |

Each of those is the SAME shape the cell reds when it is spelled with the local binding:
`const alias = readings;` and `consume(readings);` are both in the RED list at 1228. One
extra `options.` defeats the rule. `consume(options.readings)` is not an exotic spelling;
`createReadingsWriter({ day, readings, ... })` one line away is that shape already.

S-R27 (e) does list "the property name" as its own permitted category, so the
implementation follows the ruling's letter. The ruling's letter is the hole. The declared
declaration `const readings = options.readings || null;` is the ONE place the property name
has to appear; anywhere else it is a second handle on the raw store.

Fix: permit the property name only inside the declared declaration window. Patch hunk 3.
This turns the cell's own GREEN row `'void options.readings;'` (line 1245) RED, so that row
MOVES to the RED list; hunk 3 does that and adds the four spellings above beside it.
PM, this is a change to S-R27 (e)'s letter and is yours to ratify.

## 5. F4 BLOCKING: ordinary look edits that go RED, and the header sentence that says they do not

Header lines 20 to 21: "Capability, settings and lane sites use small token windows with
multiplicity, ignoring whitespace and line breaks so unrelated same-line look edits need no
reseal." Measured false twice.

### F4-a, `settings` in gym-app.mjs

`settings` is pinned to three windows with multiplicity, so EVERY occurrence of the
identifier is counted. The third window is `first . settings`, a property name. Measured:

| ordinary look edit planted in gym-app.mjs | refusals |
|---|---|
| `const view = { settings: [] };` | FENCE-HOLDER-SITE:settings |
| `const rows = map.settings;` | FENCE-HOLDER-SITE:settings |
| `void machine.settings.length;` | FENCE-HOLDER-SITE:settings |
| rename the local `first` to `firstPaint` | FENCE-HOLDER-SITE:settings |

`machine.settings` is the domain shape: machine-settings-view.mjs reads it four times
(lines 30, 31, 44, 85). A look ticket that shows "4 settings saved" on the gym card reds a
SEALED cell with a refusal that says a capability holder site moved. It did not. The
report's own justification (line 31) is "simpler than a second use-rule vocabulary for
three occurrences"; the simplicity costs a reseal on the most likely edit the card will
ever get.

Fix: a holder name in a PROPERTY position (`x.settings`, `{ settings: rows }`) names a
field of somebody else's object and cannot be a reference to the injected capability.
Exclude those positions from the site count and drop the `first . settings` window with
them. Patch hunk 4. After it, all four edits above are green; `const settings = model;`
(a new binding of the capability name), `const { save } = settings;` and renaming the mount
parameter away all still red. Measured. `first.settings = Object.freeze({ ..., lane: () =>
facade.lane(), ... })` keeps its guard: the capability inside it is the `lane : ( ) =>
facade . lane ( )` window, which is untouched.

### F4-b, the readings guard and read styles

| ordinary look edit in today-model.cjs | refusals |
|---|---|
| `readings.face()` becomes `readings?.face()` | FENCE-HOLDER-USE:readings + FENCE-HOLDER-SITE:readings |
| `readings ? readings.paint()` becomes `readings ? readings?.paint()` | same |
| `const durable = !!readings;` becomes `const durable = readings !== null;` | same |
| `readings != null ? ... : ...` | same |
| reorder the factory argument object to `{ readings, day, ... }` | same |

Optional chaining a read and comparing to null are the two commonest defensive edits in
this codebase's own style. The read list already permits `readings.face()`; there is no
reason `readings?.face()` should be a refusal. The comparison cases fail because `!==` is
not a token: `tokensOf`'s operator table stops at `??` and `/=`, so `readings !== null`
tokenizes as `readings`, `!`, `=`, `=`, `null` and falls through to `invalid`.

Fix: add the comparison operators to the token table (and to `regexMayStart`, so
`x === /re/` stays a regex context), accept `?.` in the read rule and the comparison
operators in the truthiness rule. Patch hunk 5. Measured: all five edits above go green,
and every existing RED use row keeps its colour.

The reordered factory argument stays RED and I am NOT asking for that one. `{ day, readings,
...}` is a declared pass-through window and reordering it is a real change to the one line
that hands the raw store across the seam; a reviewer should look. Recording it so the PM
knows the cost is real and chosen.

## 6. F5 NOTE: two names for one refusal WILL mislead a red CI log

`releasedRefusals` lines 615 to 619 push BOTH `FENCE-HOLDER-USE:readings` and
`FENCE-HOLDER-SITE:readings` for a single readings failure, the second labelled a
"compatibility label". A red log prints the array, so a reader sees:

```
[ 'FENCE-HOLDER-USE:readings', 'FENCE-HOLDER-SITE:readings' ] !== []
```

That reads as TWO independent refusals, and the second one names a SITE pin that S-R27 (e)
explicitly abolished for readings ("readings is held to a USE RULE and not to sites"). A
reader who trusts the name will go looking for a moved site and find none; a reader who
knows the ruling will conclude the cell contradicts it. Both readings cost a round.

Keep `FENCE-HOLDER-USE:readings` alone. The four rows the compatibility label exists for
(the `RED S-R27(d)` loop at 1051) assert `includes('FENCE-HOLDER-SITE:' + holderName)`;
give that loop a per-holder expected refusal instead of a second name in the product code.
Patch hunk 6. This is a NOTE, not blocking: it misleads a reader, it does not hide a writer.

## 7. THE RESIDUE, honestly extended

The cell's three recorded residue rows are true and still pass. Here are EIGHT more
spellings I measured GREEN, at this head and after every fix above, so the PM sees the real
size of the residue. All are planted in the released gym card; none is a durability claim,
each is a scanner measurement.

| # | spelling | why it passes |
|---|---|---|
| R4 | `const store = model; const key = 'log' + 'Set'; store[key](m);` | alias through an unpinned holder, then a variable bracket key |
| R5 | `const store = model; const { logSet: write } = store; write(m);` | FENCE-CAPABILITY-DESTRUCTURE only fires when the RHS contains a name matching `holder()` (line 412). Rename the local one line earlier and the rule is gone. |
| R6 | `const write = Reflect.get(model, 'logSet'); write(m);` | `Reflect.get` is on no word list |
| R7 | `Object.getOwnPropertyDescriptor(model, 'logSet').value.call(model, m);` | same |
| R8 | `for (const k of ['logSet']) model[k](m);` | the `[` after `of` is excluded from the bracket rule by design, and the member key is a variable |
| R9 | `const key = "logSet"; model?.[key](m);` | optional computed member with a variable key |
| R10 | `const held = facade.entryFor(liftId); const key = "save"; if (held) held.host[key](m);` | a writer reached through the mutable cache entry of S-R29 |
| R11 | `const draftRow = paintedDraft; draftRow.cues = 'changed';` | data flow into an object a declared seam is about to store |

R5 is the one I would put in front of the PM. The header (line 29) says
"capability-holder destructuring" is FORBIDDEN, and S-R28 says so too. What is actually
forbidden is destructuring from a binding whose NAME matches
`facade|hooks|model|settings|readings|foodDays|sleepNights|lane\w*|\w*Lane\w*`. One
intermediate local with any other name and the rule does not apply. Astra's blind
"destructured alias" row is RED only because its prologue names `facade.lane()`. Worth one
sentence in the header, not a new mechanism: S-R26 already says this is a tripwire, and
every hunk of every look ticket is read by an independent reviewer and by the PM.

Residue is NOT part of my rejection.

## 8. S-R29's recorded-laxity row: true, and nothing more

The row at 1296 to 1314 asserts, against the real `createGymSettingsLane` with a synthetic
host: `pair`, `pair.facade` and `pair.hooks` frozen; `entryFor(...)` NOT frozen; `stateFor`
follows a mutation of the returned entry (known to failed); `entryFor` returns the same
object; `entry.latest` frozen but `entry.latest.machine.settings` not; and the nested value
changes through the returned object. Every one of those is a fact about the shipped module,
each is Astra F3's own observation, and the row claims nothing beyond them. It ran green on
both operating systems. The comment says it is a recorded laxity and not a desired
contract, and names the ticket that must rewrite it. That is what :574 asked for and it
says what is true and nothing more.

One sentence I would add, because Astra F3's second half is not recorded anywhere in the
cell: `facade.lane()` returns the ACTUAL writer host, declared by B.7/GA-R06. The header
says the fence pins the three `facade.lane` acquisitions; it does not say what an
acquisition gets you. Patch hunk 7, one line in the header.

## 9. THE BAR, both operating systems

| what | where | result |
|---|---|---|
| `writer-fence.test.mjs` at ebb8d499 | PC, node v24.19.0, MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York | 253 tests, 253 pass, 0 fail, exit 0 |
| `writer-fence.test.mjs` at ebb8d499 | linux farm scratch splitfrev-1 of the pushed head | 253 tests, 253 pass, 0 fail |
| the whole today step, `.github/workflows/rebuild.yml:232`, verbatim | PC | see the line below |
| the cell with all seven patch hunks applied | linux farm scratch | 257 tests, 257 pass, 0 fail |

The PC run of the exact command at `.github/workflows/rebuild.yml:232` on this branch, node v24.19.0, MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York:
**682 tests, 680 pass, 2 fail**, and the two are the two known reds of DECISIONS:552 and
nothing else:

- `rebuild/m3/w7-preview/measure/test/boundary.test.mjs:128` P-MEASURE (g), an S4-sealed file
  drifts and no package on this branch declares it (rebuild.yml, adapter.test.mjs,
  view.test.mjs, today-app.cjs, machine-settings-ui.test.mjs).
- `rebuild/m3/w7-preview/today/test/setup.test.mjs:2360` re-pin, a file the B-NTC package
  pins moved on disk and no package on this branch declares it (rebuild.yml,
  adapter.test.mjs, view.test.mjs).

Both are the standing pre-reseal drift rows, unchanged by this round, which is what a
round that moved no product byte must read.

## 10. THE PATCH HUNKS

All seven applied together to `rebuild/lanes/c/today-split/writer-fence.test.mjs` at
ebb8d499, and the whole cell run: 257 of 257 on linux. Hunks 1 to 5 are the blocking fixes,
6 and 7 are the notes. Context lines are verbatim from the head under review.

```diff
@@ -16,7 +16,9 @@
  * sound one spelling at a time; three reviewers in turn found new spellings. It notices
  * ordinary durable-write members, acquisition of declared writer capabilities, module
  * edges, and changes to the measured sites below. today-model re-exports weighIn/reopen;
- * gym-app still holds six declared writer seams and three facade.lane acquisitions.
+ * gym-app still holds six declared writer seams and three facade.lane acquisitions, each of
+ * which hands back the ACTUAL machine-settings writer host (B.7 / GA-R06), so the facade is
+ * a declared pass-through and never a general read-only capability.
  * Capability, settings and lane sites use small token windows with multiplicity,
  * ignoring whitespace and line breaks so unrelated same-line look edits need no reseal.
  * Readings uses a closed read-member/truthiness rule with declared composition and
@@ -104,49 +106,50 @@
 const NOT_A_STORE_RECEIVER = ["Promise", "Object", "Array", "JSON", "Math", "Set", "Number",
   "String", "Date"];
 
-/* ---- codeOf: comments and string literals removed -------------------------------------
- * A comment mentioning host.save is invisible and a sentence containing the word "save" is
- * invisible; a call, an alias and a bare member read are not. Literals are replaced by a
- * marker of the same shape so line numbers survive.                                      */
-function codeOf(src) {
-  let out = "";
-  let i = 0;
+/* ---- ONE REGEX-AWARE STRIPPER FOR EVERY SCANNER IN THIS CELL (review F1) ---------------
+ * The hand stripper this cell shipped with had no regex branch. One ordinary regex literal
+ * containing a quote (`const NAME = /^[^'"]+$/;`) put it inside a string it invented and
+ * swapped code and string for the rest of the file: a planted `model.recover()` went
+ * invisible to FENCE-WRITER-NAME with balance, literals, the independent keyword
+ * cross-check and `node --check` all green, and, in the other direction, adding that regex
+ * to gym-app.mjs turned the cell RED with FENCE-WRITER-NAME on a look edit that reaches no
+ * writer at all. Both scanners now read the SAME lexer the self-check rows cover, so a
+ * stripper mistake can no longer hide from them. `stripped(src, keep)` blanks comments
+ * always and blanks every literal kind NOT named in `keep`, preserving offsets and lines. */
+function stripped(src, keep = []) {
+  let out = "", i = 0;
   const n = src.length;
+  const blank = (from, to) => { out += src.slice(from, to).replace(/[^\n]/g, " "); };
   while (i < n) {
-    const c = src[i];
-    const d = src[i + 1];
+    const c = src[i], d = src[i + 1];
     if (c === "/" && d === "*") {
-      const end = src.indexOf("*/", i + 2);
-      const chunk = src.slice(i, end < 0 ? n : end + 2);
-      out += chunk.replace(/[^\n]/g, " ");
-      i = end < 0 ? n : end + 2;
-      continue;
+      const end = src.indexOf("*/", i + 2), to = end < 0 ? n : end + 2;
+      blank(i, to); i = to; continue;
     }
     if (c === "/" && d === "/") {
-      let end = src.indexOf("\n", i);
-      if (end < 0) end = n;
-      out += " ".repeat(end - i);
-      i = end;
-      continue;
+      let end = src.indexOf("\n", i); if (end < 0) end = n;
+      blank(i, end); i = end; continue;
     }
-    if (c === '"' || c === "'" || c === "`") {
-      const quote = c;
-      let j = i + 1;
-      while (j < n) {
-        if (src[j] === "\\") { j += 2; continue; }
-        if (src[j] === quote) break;
-        j += 1;
+    if (c === "/" || c === '"' || c === "'" || c === "`") {
+      const token = tokensOf(src, i).tokens[0];
+      if (token && ["string", "template", "regex"].includes(token.kind) && token.at === i) {
+        if (keep.includes(token.kind)) out += src.slice(i, token.end); else blank(i, token.end);
+        i = token.end; continue;
       }
-      const chunk = src.slice(i, Math.min(j + 1, n));
-      out += chunk.replace(/[^\n]/g, " ");
-      i = Math.min(j + 1, n);
-      continue;
     }
-    out += c;
-    i += 1;
+    out += c; i += 1;
   }
   return out;
 }
+/* Comments and string literals removed: a comment naming host.save is invisible and a
+   sentence containing the word "save" is invisible; a call, an alias and a bare member
+   read are not. Literals are replaced by a marker of the same shape so line numbers
+   survive. */
+const codeOf = (src) => stripped(src);
+/* Comments removed, string literals KEPT: the copy rows need the literals, and a sentence
+   quoted inside a comment is not copy the page can show. (R2's lesson, twice: a fence that
+   reds on prose in a comment loses its credibility the first time it runs.) */
+const withoutComments = (src) => stripped(src, ["string", "template"]);
 
 /* Every `.name` member read or call in code, with its line. */
 function memberHits(code, words) {
@@ -163,42 +166,6 @@
   return hits;
 }
 
-/* Comments removed, string literals KEPT: the copy rows need the literals, and a sentence
-   quoted inside a comment is not copy the page can show. (R2's lesson, twice: a fence that
-   reds on prose in a comment loses its credibility the first time it runs.) */
-function withoutComments(src) {
-  let out = "", i = 0;
-  const n = src.length;
-  while (i < n) {
-    const c = src[i], d = src[i + 1];
-    if (c === "/" && d === "*") {
-      const end = src.indexOf("*/", i + 2);
-      const chunk = src.slice(i, end < 0 ? n : end + 2);
-      out += chunk.replace(/[^\n]/g, " ");
-      i = end < 0 ? n : end + 2;
-      continue;
-    }
-    if (c === "/" && d === "/") {
-      let end = src.indexOf("\n", i);
-      if (end < 0) end = n;
-      out += " ".repeat(end - i);
-      i = end;
-      continue;
-    }
-    if (c === '"' || c === "'" || c === "`") {
-      const q = c;
-      let j = i + 1;
-      while (j < n) { if (src[j] === "\\") { j += 2; continue; } if (src[j] === q) break; j += 1; }
-      out += src.slice(i, Math.min(j + 1, n));
-      i = Math.min(j + 1, n);
-      continue;
-    }
-    out += c;
-    i += 1;
-  }
-  return out;
-}
-
 /* Every string literal in the CODE of a source, with its raw text. */
 function literalsOf(src) {
   const code = withoutComments(src);
@@ -274,7 +241,7 @@
       const end = src.indexOf('*/', i + 2); i = end < 0 ? src.length : end + 2; continue;
     }
     if (c === '}' && stopAtBrace && braces === 0) return { tokens, end: i + 1, closed: true };
-    if (c === '/' && regexMayStart(tokens.at(-1))) {
+    if (c === '/' && regexMayStart(tokens.at(-1), tokens)) {
       let inClass = false, closed = false;
       i++;
       while (i < src.length && !/[\r\n\u2028\u2029]/.test(src[i])) {
@@ -310,7 +277,8 @@
     const id = /^[A-Za-z_$][\w$]*/.exec(src.slice(i));
     const number = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(src.slice(i));
     const value = id ? id[0] : number ? number[0] :
-      ['?.', '=>', '...', '++', '--', '**', '&&', '||', '??', '/='].find((p) => src.startsWith(p, i)) || c;
+      ['===', '!==', '==', '!=', '<=', '>=', '?.', '=>', '...', '++', '--', '**', '&&', '||',
+        '??', '/='].find((p) => src.startsWith(p, i)) || c;
     i += value.length;
     if (value === '{') braces++;
     if (value === '}') braces--;
@@ -318,12 +286,30 @@
   }
   return { tokens, end: i, closed: !stopAtBrace };
 }
-function regexMayStart(previous) {
+function regexMayStart(previous, tokens = []) {
   if (!previous) return true;
   if (previous.kind === 'id') return /^(return|throw|case|delete|void|typeof|new|in|of|yield|await|instanceof)$/.test(previous.value);
+  if (previous.kind === 'punct' && previous.value === ')') {
+    /* THE ONE AMBIGUITY A TOKEN SCANNER CAN RESOLVE. `Math.round(x) / 100` is a
+       division; `if (ok) /re/.test(t)` is a regex. Walk back to the `(` this `)`
+       closes and look at the token in front of it. Without this both this lexer AND
+       the independent stripper read the slash as division, AGREE, and a durable write
+       sitting in what they both then take for a string is invisible with every
+       self-check green (review F1, finding 2). */
+    let depth = 0;
+    for (let i = tokens.length - 1; i >= 0; i -= 1) {
+      if (tokens[i].kind !== 'punct') continue;
+      if (tokens[i].value === ')') depth += 1;
+      else if (tokens[i].value === '(' && (depth -= 1) === 0) {
+        const head = tokens[i - 1];
+        return head?.kind === 'id' && /^(if|for|while|with)$/.test(head.value);
+      }
+    }
+    return false;
+  }
   return previous.kind === 'punct' &&
     ['(', '[', '{', ',', ';', ':', '?', '=', '=>', '!', '~', '+', '-', '*', '**', '/', '/=',
-      '%', '&', '&&', '|', '||', '^', '??', '<', '>'].includes(previous.value);
+      '%', '&', '&&', '|', '||', '^', '??', '<', '>', '===', '!==', '==', '!=', '<=', '>='].includes(previous.value);
 }
 const lineAt = (src, at) => src.slice(0, at).split('\n').length;
 const lineText = (src, at) => src.split('\n')[lineAt(src, at) - 1].replace(/\r$/, '');
@@ -536,7 +522,6 @@
     holders: { settings: [
       'settings } = { } )',
       'createGymSettingsLane ( doc , model , settings ,',
-      'first . settings',
     ] },
     lane: [
       '! facade . lane ( )',
@@ -562,10 +547,17 @@
   const values = window.split(' '), offset = values.indexOf(name), start = i - offset;
   return offset >= 0 && start >= 0 && values.every((value, j) => ts[start + j]?.value === value);
 }
+/* A holder name in a PROPERTY position (`machine.settings`, `{ settings: rows }`) names a
+   field of somebody else's object and cannot be a reference to the injected capability.
+   Counting those positions made every ordinary look edit that touches the domain word
+   RED with FENCE-HOLDER-SITE (review F1, finding 4). */
+const propertyPosition = (ts, i) => ['.', '?.'].includes(ts[i - 1]?.value) ||
+  (ts[i + 1]?.value === ':' && ['{', ','].includes(ts[i - 1]?.value));
 function siteWindows(src, name, windows, lane = false) {
   const ts = codeTokens(src);
   return ts.flatMap((t, i) => {
     if (t.kind !== 'id' || t.value !== name) return [];
+    if (!lane && propertyPosition(ts, i)) return [];
     if (lane && (!['.', '?.'].includes(ts[i + 1]?.value) || ts[i + 2]?.value !== 'lane')) return [];
     return [windows.find((window) => windowAt(ts, i, name, window)) ?? '<undeclared>'];
   });
@@ -579,22 +571,30 @@
   const open = stack.at(-1);
   return ts[open]?.value === '{' && ts[open - 1]?.value === 'return';
 }
+const READINGS_DECLARATION = 'const readings = options . readings';
 function readingsUseOK(src) {
   const ts = codeTokens(src), passes = [0, 0];
   let ownDeclaration = 0, invalid = false;
   for (let i = 0; i < ts.length; i++) {
     if (ts[i].kind !== 'id' || ts[i].value !== 'readings') continue;
     const before = ts[i - 1]?.value, after = ts[i + 1]?.value;
-    if (before === '.' && ts[i - 2]?.value === 'options') continue;
+    if (before === '.' && ts[i - 2]?.value === 'options') {
+      /* The PROPERTY NAME is free only INSIDE the one declared declaration. Read as a
+         blanket exemption it let `const second = options.readings;` and
+         `consume(options.readings);` take a second handle on the raw store with the
+         fence green (review F1, finding 3). */
+      if (!windowAt(ts, i - 4, 'readings', READINGS_DECLARATION)) invalid = true;
+      continue;
+    }
     if (['.', '?.'].includes(before)) { invalid = true; continue; }
-    if (windowAt(ts, i, 'readings', 'const readings = options . readings')) {
+    if (windowAt(ts, i, 'readings', READINGS_DECLARATION)) {
       ownDeclaration++;
       continue;
     }
     const pass = READINGS_PASS.findIndex((window) => windowAt(ts, i, 'readings', window));
     if (pass >= 0 && (pass === 0 || inReturnedObject(ts, i))) { passes[pass]++; continue; }
-    if (after === '.' && READINGS_READ.includes(ts[i + 2]?.value)) continue;
-    if (['?', '&&', '||'].includes(after) ||
+    if (['.', '?.'].includes(after) && READINGS_READ.includes(ts[i + 2]?.value)) continue;
+    if (['?', '&&', '||', '===', '!==', '==', '!='].includes(after) ||
         (before === '!' && [';', ')', ']', '}', ',', ':'].includes(after))) continue;
     invalid = true;
   }
@@ -612,11 +612,10 @@
   for (const [name, sites] of Object.entries(file.holders)) {
     if (differs(siteWindows(src, name, sites), sites)) refusals.push('FENCE-HOLDER-SITE:' + name);
   }
-  if (file.readingsUse && !readingsUseOK(src)) {
-    refusals.push('FENCE-HOLDER-USE:readings');
-    // Compatibility label: all existing S-R27(d) RED rows keep their named refusal.
-    refusals.push('FENCE-HOLDER-SITE:readings');
-  }
+  // ONE refusal, ONE name (review F1, finding 5). readings is held to a USE RULE and not
+  // to sites, so a second FENCE-HOLDER-SITE label in a red log names a pin that S-R27(e)
+  // abolished. The S-R27(d) rows below name the refusal they expect per holder instead.
+  if (file.readingsUse && !readingsUseOK(src)) refusals.push('FENCE-HOLDER-USE:readings');
   if (differs(siteWindows(src, 'facade', file.lane, true), file.lane)) refusals.push('FENCE-LANE-ACQUISITION');
   if (differs(moduleEdges(src), file.edges)) refusals.push('FENCE-RELEASED-MODULE-EDGE');
   const syntax = measuredSyntax(src);
@@ -1039,6 +1038,8 @@
     assert.deepEqual(releasedRefusals(file, src), []);
   });
   for (const holderName of [...Object.keys(file.holders), ...(file.readingsUse ? ['readings'] : [])]) {
+    const holderRefusal = holderName === 'readings'
+      ? 'FENCE-HOLDER-USE:readings' : 'FENCE-HOLDER-SITE:' + holderName;
     // Keep the four original mutation plants, including their actual source line.
     const holderTokens = capabilitySites(readRepo(file.rel), holderName);
     const firstLine = lineText(readRepo(file.rel), holderTokens[0].at);
@@ -1048,10 +1049,10 @@
       ['duplicate declared line', firstLine],
       ['extra occurrence on declared line', null],
     ]) {
-      test('RED S-R27(d) ' + name + ': ' + shape + ' -> FENCE-HOLDER-SITE:' + holderName, () => {
+      test('RED S-R27(d) ' + name + ': ' + shape + ' -> ' + holderRefusal, () => {
         const src = line === null ? planted(file.rel, (s) => s.replace(firstLine, firstLine + ' void ' + holderName + ';'))
           : plantLine(file, line);
-        assert.ok(releasedRefusals(file, src).includes('FENCE-HOLDER-SITE:' + holderName));
+        assert.ok(releasedRefusals(file, src).includes(holderRefusal));
       });
     }
     test('CONTROL S-R27(d) ' + name + ': holder prose is not a code site', () => {
@@ -1162,7 +1163,6 @@
   'read , weighIn , reopen ,': ['setPendingAdoption,', 'setPendingAdoption, lookHint: null,'],
   'settings } = { } )': ['{ model, onBack,', '{ lookHint, model, onBack,'],
   'createGymSettingsLane ( doc , model , settings ,': ['settings, painter);', 'settings, painter); void painter;'],
-  'first . settings': ['first.settings = Object.freeze({', 'first.settings = Object.freeze({ lookHint: null,'],
   '! facade . lane ( )': ['{ block.hidden = true;', '{ block.title = ""; block.hidden = true;'],
   'await facade . lane ( ) . save (': ['await facade.lane().save(machine);', 'await facade.lane().save(machine); void machine;'],
   'lane : ( ) => facade . lane ( )': ['lane: () => facade.lane(),', 'lane: () => facade.lane(), lookHint: null,'],
@@ -1229,6 +1229,10 @@
   'const alias = readings;',
   'void readings[key];',
   'consume(readings);',
+  'void options.readings;',
+  'const second = options.readings; void second;',
+  'consume(options.readings);',
+  'void options.readings[key]();',
   'readings.save();',
   'readings.unknownMember();',
   'const copy = { ...readings };',
@@ -1242,8 +1246,10 @@
   });
 }
 for (const line of [
-  'void options.readings;',
   'void (readings ? 1 : 0);',
+  'void (readings != null ? 1 : 0);',
+  'void (readings === null);',
+  'void readings?.paint();',
   'void (readings && true);',
   'void (readings || false);',
   'void !readings; void !!readings;',
```

## 11. WHAT I DID NOT VERIFY

No bundle, no seal, no `b-package.cjs`, no browser, no phone, no conformance, no private
fixture, no protected soak, no credential, no part-2 acceptance, no listener census. No
durability trial: every spelling in this review is a SCANNER measurement made by running
`releasedRefusals()` over an in-memory plant, not a write executed through a real host,
except the one runtime proof named in section 2, which used a stub facade in the farm and
touched no store. No claim that the full CI accepts or rejects any plant. No product byte
was read for change and none moved. I wrote one file in the repository, this review. The
patched cell exists only in the farm scratch worktree and is not pushed; landing it is the
builder's round.
