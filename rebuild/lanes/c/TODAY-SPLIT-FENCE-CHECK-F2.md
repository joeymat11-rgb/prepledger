# TODAY-SPLIT WRITER FENCE: NARROW CLAUDE CHECK F2 OF ASTRA'S FIX OF REVIEW F1

Branch `rebuild/c-today-split-build`, head `e4c15d1c`, one commit on top of review F1
(`eaff3116`). Built by Astra; checked here by a Claude hand told to disagree
(DECISIONS:569, :584). Narrow by order: the six questions the PM asked, nothing else.

## VERDICT: ACCEPT WITH NOTES

All six commissioned witnesses hold, measured by me on both operating systems. The PM's
replacement of hunk 1 does what it was commissioned to do: his three two-division plants
are RED at this head and I measured them GREEN under the review's own hunk 1, so the
defect he found is real and is closed. Hunks 2 to 7 landed verbatim. The arguments rule
is honest. The bar is 293 of 293 on Windows and on linux at the same cell sha256.

I found two spellings that still hide a durable write or an acquisition with every
self-check green, and one that takes a second handle on `settings` at the pinned site
itself. Neither is a shape a look ticket would plausibly write, so under S-R26 neither is
blocking: this cell is a tripwire, not a proof, and I am not entitled to ask it to be
sound. They are notes N1 and N2, with the exact spellings, so the residue list and the
header sentence can be corrected by the ticket that owns them rather than by this round.

## BLOCKING

None.

## 1. SCOPE

`git diff --name-status eaff3116..e4c15d1c` is exactly two files:

```text
M  rebuild/lanes/c/TODAY-SPLIT-FENCE-PRECONDITIONS-REPORT.md
M  rebuild/lanes/c/today-split/writer-fence.test.mjs
```

No product byte. 145 lines added to the report, and the cell +299/-100.

Against the review's own patched cell (`fixed2.test.mjs`, farm scratch `splitfrev-1`) the
landed cell differs in 12 diff hunks and no others. Every one is inside the replaced
stripper, the arguments rule, or added rows and header sentences:

| Diff hunk (fixed2 line) | What it is |
|---|---|
| `@@ -30` | two header sentences: arguments forbidden; holder destructuring fires only on a holder RHS |
| `@@ -106` | the replaced `stripped()` and the two comment blocks above `codeOf` / `withoutComments` |
| `@@ -421`, `@@ -438`, `@@ -468` | `measuredSyntax`: the `argumentsUse` collector and its return field |
| `@@ -512`, `@@ -530` | `arguments: []` added to each released file's declared `syntax` |
| `@@ -602` | `arguments: 'FENCE-ARGUMENTS'` added to `SYNTAX_REFUSALS` |
| `@@ -1037`, `@@ -1086` | the two arguments rows per file and the `arguments access` syntax plant |
| `@@ -1347`, `@@ -1356` | added rows only: residue R4 to R11 and the F1/F2/F4/F5 and offset rows |

HUNKS 2 TO 7 VERBATIM, measured two ways. (i) The diff above touches none of their
regions. (ii) I took every `+` line of the review's section 10 blocks other than hunk 1's
two blocks (60 lines) and looked for each in the landed cell: 60 of 60 present. I took
every `-` line of the same blocks (55): the only ones still present are generic braces
and `continue;` belonging to hunk 1's own removal block, plus `'void options.readings;',`
which hunk 6 deliberately moved from the GREEN list into the RED list. Six markers spot
checked by hand: the ACTUAL-writer-host sentence, THE ONE AMBIGUITY walk back, the
comparison operators as single tokens, the PROPERTY position comment, the single
`FENCE-HOLDER-USE:readings` name, and `const readings = options . readings`. The
retired `first . settings` window has 0 occurrences left.

## 2. THE REPLACED STRIPPER, WHERE I WAS TOLD TO DISAGREE

Method: a probe copy of the cell in a farm scratch worktree at `e4c15d1c` with `test`
stubbed and the functions exported, so every judgement below is the cell's own
`releasedRefusals` over in-memory released bytes produced by its own `planted` /
`plantLine`. Nothing was written into a product file and nothing was executed.

### 2.1 The PM's plants are RED here and were GREEN under hunk 1

| Plant into gym-app.mjs | head `e4c15d1c` | review hunk 1 (`fixed2.test.mjs`) |
|---|---|---|
| `model.recover();` (control) | FENCE-WRITER-NAME | FENCE-WRITER-NAME |
| `const a = w / 2; model.recover(); const b = h / 2;` | FENCE-WRITER-NAME | `[]` |
| `const ratio = 4 / model.recover() / 2;` | FENCE-WRITER-NAME | `[]` |
| `const ratio = width / model.recover() / height;` | FENCE-WRITER-NAME | `[]` |

Both baselines are `[]` on the unedited released files. The PM's measurement reproduces
exactly: reading the file once from offset zero closes the interior-offset cause.

### 2.2 codeOf keeps length, line count and line-break offsets

Measured independently of the cell's own row, with a break class of CR, LF, U+2028 and
U+2029:

| File | bytes | lines | length kept | line count kept | break offsets kept |
|---|---:|---:|---|---|---|
| today-model.cjs | 27147 | 479 | yes | yes | yes |
| gym-app.mjs | 29873 | 560 | yes | yes | yes |
| today-app.cjs | 151536 | 2627 | yes | yes | yes |

### 2.3 The commissioned spelling list, each classified

Every row plants into gym-app.mjs and reports `releasedRefusals` plus the four token-side
self-checks the cell runs on a released file (bracket balance, terminated literals and
single-token string re-read, the independent keyword cross-check, and `node --check`).

| Spelling | Result | ORDINARY / EXOTIC |
|---|---|---|
| slash after `)` of an ordinary call | RED FENCE-WRITER-NAME, all checks OK | ORDINARY, held |
| slash after `)` of an `if` head | RED FENCE-WRITER-NAME, all checks OK | ORDINARY, held |
| slash after `]` index | RED FENCE-WRITER-NAME, all checks OK | ORDINARY, held |
| regex at statement start after a `}` block | RED FENCE-WRITER-NAME, all checks OK | EXOTIC, held |
| slash after `}` of an object literal | RED FENCE-WRITER-NAME, all checks OK | ORDINARY, held |
| after postfix `++` / `--` | RED FENCE-WRITER-NAME, cross-check RED (note N4b) | EXOTIC |
| keyword-spelled id in a NAME position | GREEN, all four checks OK: HOLE, note N1 | EXOTIC |
| division inside a template interpolation | RED FENCE-WRITER-NAME | ORDINARY, held |
| regex inside a template interpolation | RED, all checks OK | ORDINARY, held |
| writer call inside an interpolation | RED FENCE-TEMPLATE-CALL (declared S-R28 construct) | held |
| lane acquisition inside an interpolation | RED FENCE-LANE-ACQUISITION | held |
| comment between receiver and member, either side of the dot | RED FENCE-WRITER-NAME | ORDINARY, held |
| line comment / multi-line comment between them | RED FENCE-WRITER-NAME | ORDINARY, held |
| whole gym file converted to CRLF | GREEN and correct; planted writer still RED; length, lines and break offsets kept | ORDINARY, held |
| U+2028 used as whitespace | RED FENCE-WRITER-NAME | EXOTIC, held |
| U+2028 inside a string | caught, FENCE-LEXER-LINEBREAK | EXOTIC, held |
| string line continuation swallowing a writer | GREEN but caught by FENCE-LEXER-LINEBREAK | EXOTIC, held |
| regex body containing `//`, or a class containing `/` | RED FENCE-WRITER-NAME | ORDINARY, held |
| `if` head containing a call, then a regex | RED FENCE-WRITER-NAME | ORDINARY, held |

## 3. NOTES

### N1. The PM's method closes the CAUSE he measured, not the whole family

`regexMayStart` returns true whenever the previous token is an identifier spelled like one
of twelve keywords (`return throw case delete void typeof new in of yield await
instanceof`) WITHOUT asking whether it sits in a property position. So an identifier read
`o.of`, `o.delete`, `o.new` and the rest is followed by a slash the lexer calls the start
of a regex; that "regex" runs to the next slash on the same physical line and everything
between is blanked. Measured, into gym-app.mjs:

```text
plant   const a = o.of / 2; model.recover(); void h / 2;
result  releasedRefusals = []   balance OK  literals OK  cross-check OK  node --check OK
codeOf  const a = o.of                                2;
```

The same spelling hides an acquisition: `const a = o.of / 2; void
facade.lane().save(auditMachine); void h / 2;` returns `[]`, and with `o.delete` in place
of `o.of` likewise. A plain identifier is the control and is RED: `const a = o.tally / 2;
model.recover(); void h / 2;` returns FENCE-WRITER-NAME. It is also reachable without a
member: `of` is a legal variable name, and `const of = 4; const a = of / 2;
model.recover(); const b = h / 2;` returns `[]` with all four checks green.

The independent cross-check CANNOT catch this, because it shares the mistake: the
lookbehind in `regexStripped` contains `\b(?:return|throw|case|delete|...)\s+`, which
matches `.delete /` just as the lexer does. That is precisely the shape of review F1's
finding F2 (both readers agree and are both wrong), surviving in a narrower place.

WHY THIS IS NOT BLOCKING. S-R26 is explicit: the cell is a tripwire for the ordinary
shapes, and a token scanner cannot be made sound one spelling at a time. The shape needs
four things on one physical line: a keyword-spelled token in value position, a division
directly after it, a second slash later, and a durable write or acquisition between them.
No look ticket writes that. I record it because the PM's own replacement rationale was
"two divisions on one line", and a reader could take the new stripper to have closed that
family; it has closed the offset cause, not the family.

SUGGESTED, for the ticket that owns the fence and not for this round: in `regexMayStart`,
return false when the previous id token is itself preceded by `.` or `?.`; and add these
two spellings to the residue list so the next reader is not surprised by them.

### N2. The settings acquisition pin is defeated at the pin itself

This answers the PM's question 3 for `settings`. `propertyPosition` skips a `settings`
token whose next token is `:` and whose previous is `{` or `,`. Its comment justifies that
by saying such a name "names a field of somebody else's object and cannot be a reference
to the injected capability". In an object LITERAL that is true. In an object
DESTRUCTURING PATTERN it is false, and the mount signature is a destructuring pattern:
there the key IS the road to the capability. Measured:

```text
mount   { settings: alias, model, onBack, onChanged, onCheckIn, draft, settings } = {}
result  releasedRefusals = []   node --check OK
```

The declared window `settings } = { } )` still matches the shorthand, so the pin is
satisfied, and `alias` is a second binding to the same raw settings host. With the fence
green I then measured, all returning `[]`: `void keep(alias)` (handed to a local helper),
`leaked = alias` on a module-scope `export let` (the raw writer host leaves the released
file), and `raw: () => alias` added to the paint handle (the raw host is handed to the
page). Only a direct `alias.save(auditMachine)` is caught, and only by FENCE-WRITER-NAME,
which is the spelling rule, not the acquisition pin.

Put the renamed key AFTER the shorthand and it is RED, because the window breaks. An
ordinary single rename (`settings: settingsHost` replacing the shorthand) is also RED.
The green case needs a DUPLICATED pattern key, which is legal but is not an ordinary
rename, so under S-R26 this is EXOTIC and I do not block on it.

WHAT IT DOES COST. :574's sentence about the acquisition pin, "turns every spelling that
first acquires the store RED at the acquisition", is not true of `settings` as landed, and
the header should not be read as claiming it. `weighIn` / `reopen` and `readings` are NOT
affected: I tried the same duplicate-key trick on the model capabilities
(`const { weighIn: writeAlias, weighIn, reopen,`) and it is RED with both
FENCE-CAPABILITY-SITE names.

### N3. S-R27 (f) on readings holds; one spread spelling is residue

The rest of the PM's question 3. Every ordinary extra spelling I could put on `readings`
is RED with the single name `FENCE-HOLDER-USE:readings`:

| One extra spelling in today-model.cjs | Result |
|---|---|
| `const { readings: raw } = options;` (destructuring rename) | RED |
| `const kept = { readings };` (shorthand property) | RED |
| `const grab = (r = readings) => r;` (default parameter) | RED |
| `const all = { ...options }; const second = all.readings;` | RED |
| `const all = { ...options };` alone | GREEN, residue |

The last one is green because it contains no `readings` token at all. It copies the mount
OPTIONS, not the store; to reach the store from `all` you need a member (RED) or a bracket
key (FENCE-BRACKET-KEY). The same is already true of the bare `const copy = options;`,
which is green at this head and was green before. Residue, not a hole in S-R27 (f).

Removing or renaming a DECLARED site still goes red, measured one at a time:

| Edit | Refusal |
|---|---|
| drop the `settings` argument to `createGymSettingsLane` | FENCE-HOLDER-SITE:settings |
| rename the mount shorthand to `settingsHost` everywhere | FENCE-HOLDER-SITE:settings |
| delete `lane: () => facade.lane(),` from the paint handle | FENCE-LANE-ACQUISITION |
| rename `facade` to `gate` | FENCE-LANE-ACQUISITION |
| narrow the `weighIn` re-export window in today-model.cjs | FENCE-CAPABILITY-SITE:weighIn and :reopen |

### N4. Two false reds on edits that reach nothing

(a) APPENDING A MOUNT OPTION. `{ model, onBack, onChanged, onCheckIn, draft, settings,
theme } = {}` returns FENCE-HOLDER-SITE:settings. The SAME option inserted before
`settings` returns `[]`, and so do reflowing the signature onto two lines and adding a
fifth argument to `createGymSettingsLane`. The window `settings } = { } )` pins `settings`
as the last element of the pattern, which is wider than S-R27 (e)'s "smallest run of
neighbouring tokens that says what kind of use it is": the use is "shorthand key in a
destructured parameter", and the `} = { } )` tail does not say that. The colour of an
unrelated addition therefore depends on where in the list it is written. Defensible, since
this is the acquisition signature and a change to it deserves a look, but the refusal name
names a capability the edit did not touch. Not blocking; recorded so the S10 brief can
decide whether to narrow the window.

(b) POSTFIX OPERATOR BEFORE TWO SLASHES. `let n = 0; const pct = n++ / total; const rate =
done / total;` returns `[]` from the fence but turns the LEXER INDEPENDENT CROSS-CHECK row
RED. The lexer is right (`++` is not in `regexMayStart`'s punct list, so the slash is
division); the independent `regexStripped` is wrong, because its lookbehind character
class contains `+` and `-`, so it reads `++ /` as a regex start. Two slashes on one line
are needed for it to close. Exotic, and it fails in the safe direction, but it is a red
with a message about the lexer rather than about the edit, so I record it.

### N5. The report publishes a hash that is not the committed one

The report's "Executed bar on this PC" prints
`4cf5fb506685b8bcc775c644544a618046ba2ca29d742d97f8b3c2b2e5639206` as the certutil hash of
the cell. That is the CRLF working-tree file before Git normalised it; the report says so,
but a later reader comparing hashes will be misled. The committed cell is
`1032962b8d337c1322da8786a918bec797acd091df36f9d1842e698103675899`, which I measured on
both machines. Part 2 should quote the committed hash.

## 4. S-R28: THE ARGUMENTS RULE

Measured with the cell's own `capabilitySites`, which counts code-position identifiers
only:

| File | `arguments` code sites |
|---|---:|
| today-model.cjs | 0 |
| gym-app.mjs | 0 |
| today-app.cjs (part 2's third released file) | 0 |

So the count is zero in both released files, and the rule extends to today-app.cjs at zero
cost when part 2 adds it to RELEASED_FILES. The rows behave:

| Plant | Result |
|---|---|
| `void arguments[0].settings;` into gym-app.mjs | exactly `[FENCE-ARGUMENTS]` |
| `void arguments[0].settings;` into today-model.cjs | exactly `[FENCE-ARGUMENTS]` |
| `void arguments.length;` | `[FENCE-ARGUMENTS]` |
| `/* void arguments[0].settings; */` + `void "arguments";` (control) | `[]` |
| `void opts.arguments;` (property position) | `[FENCE-ARGUMENTS]` |
| `` void `${arguments}`; `` (template interpolation) | `[FENCE-ARGUMENTS]` |

The control is not vacuous: it contains the word in both a comment and a string and is
green. The last two rows are correct for an identifier forbidden at count zero, and worth
knowing: the rule fires on `arguments` as a property name too, so a look ticket that
introduces a field of that name goes red. It also does NOT double up with
FENCE-BRACKET-KEY, because `[0]` is a number and the bracket rule only fires on quoted,
template or concatenated keys.

FOR THE PART 2 AUTHOR, so it is known before it gets there: the identifier `today` is NOT
zero in today-app.cjs. It has 34 code-position `today` tokens on 24 distinct lines: 307,
518, 601, 635, 693, 845, 888, 889, 894, 895, 896, 930, 946, 1227, 1228, 1235, 1374, 1375,
1651, 1766, 1953, 1976, 1991, 2247. today-model.cjs has 9 on 7 lines (70, 85, 183, 327,
342, 349, 441); gym-app.mjs has 0. No `today`-shaped forbidden-identifier rule can be
written the way `arguments` was, and a declare-by-line list would be 24 lines long.

## 5. THE BAR, BOTH OPERATING SYSTEMS, AT THE PUSHED HEAD

| Machine | Where | Tests | Pass | Fail | Skipped / cancelled / todo | Exit |
|---|---|---:|---:|---:|---|---:|
| Windows 10.0.26200, node v24.19.0 | `%TEMP%\earned-astra-11` at e4c15d1c, clean | 293 | 293 | 0 | 0 / 0 / 0 | 0 |
| linux, node v22.22.2 | farm scratch worktree at e4c15d1c | 293 | 293 | 0 | 0 / 0 / 0 | 0 |

Command on both: `MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York node --test
rebuild/lanes/c/today-split/writer-fence.test.mjs`. On the PC it ran from a `.cmd` with
the environment set on its own lines and the output redirected to a log. No row failed, so
nothing was re-run.

Cell sha256, measured by me on each machine and equal:

```text
PC    certutil -hashfile rebuild\lanes\c\today-split\writer-fence.test.mjs SHA256
      1032962b8d337c1322da8786a918bec797acd091df36f9d1842e698103675899
farm  sha256sum rebuild/lanes/c/today-split/writer-fence.test.mjs
      1032962b8d337c1322da8786a918bec797acd091df36f9d1842e698103675899
```

This is the PM's stated hash. The report's own hash is the pre-normalisation one; see N5.

## 6. THE ROW ARITHMETIC, AND THAT NO ROW WAS WEAKENED

I ran the cell as it stood at `eaff3116` and at the head and diffed the TAP titles.

| Measurement | Value |
|---|---:|
| rows at eaff3116 | 253 |
| rows at e4c15d1c | 293 |
| titles present at eaff3116 and absent at the head | 7 |
| titles present at the head and absent at eaff3116 | 47 |

The raw title diff is -7 / +47 and the report says -2 / +42. BOTH ARE RIGHT, and the
report's is the honest one, because five of the seven vanished titles are not vanished
rows:

- FOUR ARE RENAMES. The four `RED S-R27(d) today-model.cjs: ... -> FENCE-HOLDER-SITE:readings`
  rows are present at the head as `... -> FENCE-HOLDER-USE:readings`. Hunk 6 changed the
  refusal NAME, ratified at :584 (1). I read the loop: the same four plants (bare
  reference, template reference, duplicate declared line, extra occurrence on the declared
  line), the same `assert.ok(...includes(holderRefusal))`, nothing loosened.
- ONE IS THE COLOUR MOVE. `GREEN readings use: void options.readings;` is present at the
  head as `RED readings use -> FENCE-HOLDER-USE:readings: void options.readings;`. That is
  the one GREEN readings row the review moved to RED (finding F3).
- TWO ARE THE GENUINE RETIREMENTS: `GREEN unrelated same-line edit gym-app.mjs: first .
  settings` and `GREEN reformat gym-app.mjs: first . settings`, retired with the
  `first . settings` window at :584 (1).

So 253 minus 2 plus 42 is 293, and the report's six-way split of the 42 reproduces row for
row against my title list: +6 readings rows, +13 F1/F2/offset rows, +6 arguments rows, +8
residue rows, +8 F4 look rows, +1 exact F5 refusal row. 6+13+6+8+8+1 = 42, and 42 plus the
4 renames plus the 1 moved row is the 47 I measured.

NO ROW WAS WEAKENED. Every title present at eaff3116 is present at the head except the two
retired with the `first . settings` window and the one GREEN readings row moved to RED,
with the four renames as the only further difference. I read each of the four renamed
rows' bodies and the added `arguments` rows; no assertion was turned into a weaker one, no
row was skipped, and the three counts (253, 257, 293) in the report's bar table are
consistent with the two I measured myself.

## 7. WHAT I TRIED AND COULD NOT BREAK

Beyond the classified table in section 2.3, these all stayed RED or were caught:

- Hiding a writer behind a slash after `)` of an ordinary call, after `]`, after `}` of a
  block and of an object literal; behind a regex whose body contains `//`; behind a
  character class containing `/`; behind an `if` head that itself contains a call.
- Hiding a writer or an acquisition inside a template interpolation. `codeOf` blanks the
  whole template, so FENCE-WRITER-NAME does not see it, but FENCE-TEMPLATE-CALL catches
  any call there and FENCE-LANE-ACQUISITION reads flattened interpolation tokens and
  catches `facade.lane` with or without the call. A writer needs a call, so the pair
  closes it. `` `${ (draftRow.cues = "x") }` `` is green, but that is a draft mutation,
  already on the residue list, not a durable write.
- Separating a receiver from its member with a block comment before or after the dot, a
  line comment, or a multi-line comment: `stripped` blanks comments to spaces and
  `memberHits` spans whitespace, so all four are RED with the receiver still attributed.
- Converting the whole gym file to CRLF: green and correct, length, line count and break
  offsets preserved, and a planted writer still RED.
- U+2028 as whitespace (writer still RED), inside a string (FENCE-LEXER-LINEBREAK), and a
  backslash line continuation swallowing a writer (FENCE-LEXER-LINEBREAK).
- Taking a second handle on `readings` by destructuring rename, shorthand property,
  default parameter, or spread followed by a member: all four RED.
- The duplicate-pattern-key trick of N2 applied to `weighIn` / `reopen`: RED.
- Removing or renaming each declared site in turn: all RED with the right name.

## 8. WHAT I DID NOT VERIFY

- NO DURABILITY, AT ALL. Every judgement above is the cell's own `releasedRefusals` over
  in-memory bytes made by its own `planted` / `plantLine`, through a probe copy of the
  cell in a farm scratch with `test` stubbed and the functions exported, the way review F1
  did it. Nothing was planted in a product file, nothing was executed, no host was
  reached, and no plant was shown to write anything.
- NO SOUNDNESS. S-R26 forbids asking this cell for it and I did not try to close the
  residue list. N1 and N2 are two more entries on it, not a claim that they are the last.
- THE VERBATIM CLAIM IS TRANSITIVE. I did not mechanically re-apply the review's section
  10 diff to `ebb8d499`. It rests on the 12-hunk diff against the reviewer's own patched
  cell plus the 60/60 added-line and 55-line removed-line check described in section 1.
- I did not read the private census, the protected soak, `rebuild/conform/private`,
  `src/history.js`, any `ledger/`, `EarnedPort` or `port-real.log`, on either machine. No
  real measurement of the owner's entered this check; every fixture named here is
  synthetic.
- I ran only this one cell. No Today suite, no CI wait, no conformance, no bundle, no
  seal, no package, no receipt, no browser, no phone, no `--full`, no seal generator. No
  install, no `node_modules` change, no file of anyone else's deleted. The GitHub CI run
  on this push (ubuntu and windows) is the both-OS evidence of record beyond my two runs
  and I did not wait on it.
- I did not judge part 2, and I did not judge the product bytes of part 1, which :574
  accepted by name.
- I edited nothing but this file.

Reviewed by cowork (Earned lane hand, Claude), 2026-09-19, against `e4c15d1c`.
