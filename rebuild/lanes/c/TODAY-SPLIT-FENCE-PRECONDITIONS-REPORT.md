# TODAY-SPLIT FENCE PRECONDITIONS - Astra builder measurement

2026-09-19. Branch rebuild/c-today-split-build-astra1.
Base HEAD: cad939bcec9a00b753cb73459c6b4aab64a77877.
S-R27(e), commissioned under DECISIONS:412 and :569 point 3.
Hypothesis for the independent Claude reviewer: token windows preserve the existing
RED witnesses while allowing the measured unrelated look edits; the readings use
rule refuses the measured unapproved uses. This is a lexical tripwire, not proof
of durable behavior or release acceptance. Work is uncommitted.
Only the cell and this report were written. No scratch files were created.

## Declared windows

Token values are compared in source order with multiplicity. Whitespace and line
breaks do not participate. An undeclared occurrence or a missing/duplicate window
fails the existing capability, holder or lane refusal. These are literal windows.

| File / kind | Windows, in declared order |
|---|---|
| today-model.cjs / weighIn | `const { weighIn ,` ; `read , weighIn ,` |
| today-model.cjs / reopen | `const { weighIn , reopen ,` ; `read , weighIn , reopen ,` |
| gym-app.mjs / settings | `settings } = { } )` ; `createGymSettingsLane ( doc , model , settings ,` ; `first . settings` |
| gym-app.mjs / facade.lane | `! facade . lane ( )` ; `await facade . lane ( ) . save (` ; `lane : ( ) => facade . lane ( )` |
| today-model.cjs / readings pass-through | `createReadingsWriter ( { day , readings ,` ; `, readings ,` |
| today-model.cjs / destructuring exception | `} = createReadingsWriter (` |
| gym-app.mjs / destructuring exception | `} = createGymSettingsLane (` |

The readings return window additionally requires the nearest unmatched delimiter
to be an object brace immediately preceded by return. Both pass-through windows
must occur exactly once as readings uses. Settings stays on three windows:
parameter tail, factory argument, property name. This is simpler than a second
use-rule vocabulary for three occurrences.

The destructuring exceptions previously compared entire source lines too. They
now compare the four-token factory window for every measured holder-bearing
initializer. Adding a destructure still changes multiplicity and fails
FENCE-CAPABILITY-DESTRUCTURE; unrelated binding/argument fields may change.
No longer pinning the complete binding list is an intentional narrowing, not a
claim that the scanner resolves what the factory returns.

## Readings rule and measured inventory

Measured readings: 18 code tokens on 12 lines in today-model.cjs:
209 twice, 210, 235 twice, 321 twice, 325, 327, 328, 342 twice, 346 twice,
347 twice, 413, 443. This count is reported, not enforced as a site/total pin.
Settings: 3 code tokens at gym-app.mjs lines 99, 134, 540.
The measured closed read list is exactly:
`reads, paint, face, blockedCopy, label, outboxRetained`.
Every member was asserted absent from the 15-name PUT list. Actual member uses
must belong to that list; deleting the last use of a permitted member is allowed.

Each readings identifier is checked, including template interpolation tokens.
Allowed categories:
- The property identifier in options.readings.
- Its own binding, recognized by `const readings = options . readings`;
  exactly one such declaration is required.
- Bare truthiness followed by ?, && or ||; or preceded by ! (including !!)
  and followed by a terminating delimiter. The existing if (readings && ...)
  belongs to this rule. Negation does not exempt bracket members or unknown calls.
- Dot access to one of the six closed read members.
- The two pass-through windows above, once each.

Everything else returns FENCE-HOLDER-USE:readings. The checker also returns the
legacy FENCE-HOLDER-SITE:readings label for the same failure so the four existing
holder RED rows keep their named refusal. There is no legacy readings line pin.
The rule is lexical: it does not prove that a permitted truthiness expression
cannot pass a value onward, or that a member named as a reader has no side effect.

## GREEN unrelated-edit witnesses

Fourteen declared windows each have two rows: one unrelated edit on the same
source line and one reformat placing the window across new lines. All 28 passed
both releasedRefusals and Node syntax checks of the in-memory edited source.
Reformatting respects JavaScript's prohibition on a newline immediately before =>.

| Sites covered | Same-line edit measured GREEN |
|---|---|
| Both capability composition sites and model destructure | Add lookHint after FORM_MAX in the binding list |
| Both capability returned-interface sites | Append lookHint: null after setPendingAdoption |
| Settings parameter | Add lookHint before model |
| Settings factory argument and gym destructure | Append void painter after the factory statement |
| first.settings property | Add lookHint: null inside the Object.freeze object |
| Negated facade.lane test | Add block.title assignment inside its braces |
| Awaited facade.lane save | Append void machine inside the try braces |
| Returned lane function | Append lookHint: null to the interface on that line |
| Readings factory pass-through | Add lookHint: null after stateFromOps |
| Readings returned-interface pass-through | Append lookHint: null after readings |

Additional GREEN rows append a field to the view line using readings.face(),
replace readings.outboxRetained() with null, and add twelve permitted-use snippets
covering options.readings, ?, &&, ||, !/!!, if (readings && ...), and all six reads.
The two view-edit sources also passed Node syntax checks without execution.

## RED witnesses and residue remeasurement

All baseline RED rows remain exercised with their original named refusal:
capability sites, holder uses, repeated lane acquisitions, module edges, forbidden
syntax, writer names, lexer failures and the blind table. Original duplicate-line
plants are taken from source for the synthetic test only; they are not site pins.
All 200 baseline rows remain, with no row deleted or skipped.

Ten added rows assert FENCE-HOLDER-USE:readings for these exact snippets:
```js
const alias = readings;
void readings[key];
consume(readings);
readings.save();
readings.unknownMember();
const copy = { ...readings };
void !readings[key];
void !readings.save();
void other.readings;
consume({ engine: E, readings, lookHint: null });
```

All three current gym residue spellings were rerun and still scan GREEN, so none
needed promotion to RED or replacement:
```js
const key = 'log' + 'Set'; model[key](auditMachine);
const cached = facade.entryFor(liftId); if (cached) cached.state = 'failed';
submittedDraft.cues = 'Synthetic changed cue.';
```
The first two are planted before the entryFor line inside settingsPaint. The third
is planted inside recordSettings before its guard. These are scanner measurements,
not executed durable operations. They expose computed-key and mutation/data-flow
residue. The existing S-R29 synthetic behavior row also passed: mutating the cached
entry changes stateFor, and its nested settings value remains mutable.

The older settings[key], Reflect.get/settings, and settings-alias residue rows
still fail FENCE-HOLDER-SITE:settings in gym-app.mjs. Their three retained model
controls still scan GREEN; that file has no settings binding, so these controls
are not executable raw-store paths. No residue claim was silently removed.

## Retained tokenizer measurements

| File | Regex | Templates | function | const | let | return |
|---|---:|---:|---:|---:|---:|---:|
| today-model.cjs | 0 | 0 | 19 | 43 | 6 | 27 |
| gym-app.mjs | 0 | 0 | 14 | 103 | 6 | 35 |
| today-app.cjs, read-only | 1 | 0 | 76 | 376 | 51 | 196 |

The regex remains at today-app.cjs:2413, /[?&]screen=([a-z-]+)/.
Balance, terminated literals, independent keyword counts/offsets, Node --check,
and the synthetic lexer fault/witness rows all passed. No lexer code was changed.
The two released files each still measure zero bracket-key exceptions, one
holder-bearing destructure, zero template calls and zero builtin shadows.
Module-edge counts remain 5 and 4; facade.lane counts remain 0 and 3 respectively.

## Executed bar

Before, rerun at base HEAD: 200 tests, 200 pass, 0 fail, 0 skipped/cancelled/todo.
After, final cell: 253 tests, 253 pass, 0 fail, 0 skipped/cancelled/todo.
Net 53 new rows: 28 window look/reformat rows, 1 read-list measurement,
2 view-edit/no-count-pin rows, 10 RED use rows and 12 GREEN use rows.

An intermediate syntax-validation run caught one invalid test fixture: a newline
before =>. The fixture was corrected to a legal reformat; no refusal was relaxed.
Final invocation, with each environment assignment on its own PowerShell line:
```powershell
$env:MEASURED_TEST_NOW = '2026-09-03'
$env:TZ = 'America/New_York'
& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-isolation=none rebuild/lanes/c/today-split/writer-fence.test.mjs
```
Node v24.19.0. Both baseline and final runs used --test-isolation=none; the cell's
independent Node --check children still ran, and no syntax row skipped.
All plants stayed in memory; syntax checks used stdin and wrote no artifacts.

git diff --check passed. Added lines in both owned files contain zero non-ASCII
characters. certutil -hashfile rebuild/lanes/c/today-split/writer-fence.test.mjs SHA256:
```text
8073fe752689bb76c572bd71cd8a99fa5954befa25820ae8355aa17f9b491936
```

## What I did not verify

No full Today suite, persistence/reopen trial, bundle, CI, conformance, browser,
phone, private fixture, protected soak, credential, part-2 acceptance or independent
review. No parser soundness, arbitrary data flow, generated code, runtime reader
replacement, or deep immutability claim. The independent regex stripper still
masks whole templates; the legacy copy/member scanners were not rewritten.
The look fixtures were scanned and syntax checked, not executed as UI behavior.
No product byte moved. No install, package/receipt/build instrument, Git mutation,
or scratch-file deletion ran. The PM retains commit/push and review responsibility.

## Final commands and output

```text
git status --porcelain
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
 M rebuild/lanes/c/TODAY-SPLIT-FENCE-PRECONDITIONS-REPORT.md
 M rebuild/lanes/c/today-split/writer-fence.test.mjs
git diff --stat
 .../c/TODAY-SPLIT-FENCE-PRECONDITIONS-REPORT.md    | 386 +++++++++------------
 rebuild/lanes/c/today-split/writer-fence.test.mjs  | 259 ++++++++++----
 2 files changed, 363 insertions(+), 282 deletions(-)
```

## Review F1: fixed

2026-09-19. Assignment base eaff3116ea75e44fc81ad7944180337116f44be1,
branch rebuild/c-today-split-build-astra1. This section supersedes the earlier
round's statements about settings windows, options.readings, duplicate refusal
names and the legacy strippers. Hypothesis for the next independent Claude
reviewer: the requested witnesses now hold; this is still a lexical tripwire.

Hunks 2-7 from review section 10 applied as 13 exact diff blocks. All 18 added
blocks were checked against the review after the final cell edit and remained
verbatim. Hunk 1's implementation was replaced as commissioned. No product byte
moved. Only this report and writer-fence.test.mjs were written, uncommitted.

| Finding | Executed row and measured result |
|---|---|
| F1: quote regex hides a writer | RED review F1: F1-a writer between quote regexes; F1-a keyword-position regex. Both return FENCE-WRITER-NAME. |
| F1: ordinary regex look edit reds | GREEN review F1: F1-b look regex containing both quotes returns []. |
| PM replacement: two divisions hide a writer | Three RED review F1: PM rows return FENCE-WRITER-NAME; the plain writer control does too. GREEN PM two divisions without a writer returns []. |
| F2: regex after control parenthesis | Three RED review F2 rows, after if (ok), while (ok), for (;;), each return FENCE-LANE-ACQUISITION and FENCE-WRITER-NAME. |
| F2: preserve real division | GREEN review F2 keeps Math.round(next * 100) / 100 in codeOf and returns [] for the released gym file. |
| F3: extra options.readings acquisition | RED readings use rows for void options.readings, second alias, consume(options.readings), options.readings[key]() each return FENCE-HOLDER-USE:readings. The old GREEN void row moved to RED. |
| F4: settings property look edits | Three GREEN review F4 property rows, plus rename first to firstPaint, all return []. The first . settings window and only its two look/reformat rows were retired. |
| F4: defensive readings look edits | Four GREEN review F4 rows: optional face, optional paint, durable !== null, and != null ternary. The review's added GREEN readings-use rows also pass. |
| F5: misleading second refusal name | RED review F5 asserts the complete result for extra options.readings is exactly [FENCE-HOLDER-USE:readings]. The four S-R27(d) readings rows use that name; settings rows retain FENCE-HOLDER-SITE:settings. |

Settings still measures three identifier tokens in the released gym source, but
only the parameter and factory argument are site windows. Property positions are
excluded exactly as ratified. The options.readings property name is allowed only
inside const readings = options . readings (S-R27(f)); no blanket exemption remains.
The header carries the review's ACTUAL writer-host sentence and the holder-name
limitation of destructuring. Neither sentence asserts a new runtime guarantee.

### Why the PM replaced hunk 1

I reconstructed the review's proposed stripped function in memory, with the
ratified lexer fixes, and ran its releasedRefusals against the same gym plants.
The proposed stripper returned [] for each of these, while the landed replacement
returned [FENCE-WRITER-NAME] for each:

```js
const a = w / 2; model.recover(); const b = h / 2;
const ratio = 4 / model.recover() / 2;
const ratio = width / model.recover() / height;
```

Both versions returned FENCE-WRITER-NAME for plain model.recover(), and [] for
const a = w / 2; const b = h / 2;. Calling tokensOf at an interior slash loses
left context and treats division as a regex start. The landed stripped(src, keep)
calls tokensOf(src) once from zero, copies token spans and blanks gaps and unkept
string/template/regex tokens while retaining line breaks. codeOf and
withoutComments use it. No interior-offset call exists in the stripper; the
template-interpolation recursion in tokensOf is unchanged.

The row Review F1: codeOf preserves length, line count and line-break offsets in
all three lexer files passed for today-model.cjs, gym-app.mjs and today-app.cjs.
The independent regexStripped reader was left unchanged, as required. Its existing
cross-checks passed on all three released/read-only sources; no claim that it
agrees on the new control-statement regex plants.

### S-R28 arguments and residue

Measured before declaring the refusal, then asserted again by the final cell:

| Released file | Code-position arguments identifiers | Lines |
|---|---:|---|
| today-model.cjs | 0 | none |
| gym-app.mjs | 0 | none |

FENCE-ARGUMENTS now forbids that identifier in code in each released file. Each
file has a zero-count row, a RED void arguments[0].settings; row, and a GREEN
control with arguments in a comment and a string. All six rows passed.

All three existing residue rows and the review's eight added spellings R4-R11
were scanned through releasedRefusals in gym-app.mjs and returned []. None moved
to RED. The eight added RECORDED RESIDUE rows preserve the review's exact snippets:
intermediate-local computed key, intermediate-local destructure, Reflect.get,
property descriptor, loop variable key, optional variable key, cache-entry host
key, and draft alias mutation. These are scanner observations, not durability
proofs. The existing S-R29 mutable-entry behavior row also passed with its
synthetic host. The older settings residue remains RED in gym, as before.

### Executed bar on this PC

| Cell state | Tests | Pass | Fail | Exit |
|---|---:|---:|---:|---:|
| Before edits, named assignment base | 253 | 253 | 0 | 0 |
| Ratified hunks plus PM replacement, before added rows | 257 | 257 | 0 | 0 |
| Final cell | 293 | 293 | 0 | 0 |

All three runs: zero skipped, cancelled or todo. Net +40 rows: the review's -2
retired window rows and +6 new readings rows; +13 F1/F2/offset rows; +6 arguments
rows; +8 residue rows; +8 F4 look rows; +1 exact F5 refusal row.

Node v24.19.0. The whole cell command on this PC was:

```powershell
$env:MEASURED_TEST_NOW = '2026-09-03'
$env:TZ = 'America/New_York'
& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-isolation=none rebuild/lanes/c/today-split/writer-fence.test.mjs
```

The independent Node --check children ran without skips. New F1/F2 plants and
readings look edits passed syntax checks using stdin. The three exact settings
property snippets and the residue rows are scanner-only measurements. No plant
was written into a product file or executed as a durable write. A preliminary
in-memory comparison command failed before measuring because its harness omitted
assert; rerunning with assert supplied produced the comparison above. No cell row
failed during this round and no test was weakened or skipped to obtain the bar.

certutil -hashfile rebuild/lanes/c/today-split/writer-fence.test.mjs SHA256:

```text
4cf5fb506685b8bcc775c644544a618046ba2ca29d742d97f8b3c2b2e5639206
CertUtil: -hashfile command completed successfully.
```

N5 correction: the committed cell at e4c15d1c has sha256 1032962b8d337c1322da8786a918bec797acd091df36f9d1842e698103675899.

This is the on-disk hash of the uncommitted cell. Git warns that its CRLF bytes
will be replaced by LF when Git next touches it. git diff --check passed; added
lines in both owned files were checked for ASCII. No scratch files were created.

### What I did not verify

No full Today suite, CI, independent review, conformance, bundle, seal, package or
receipt tool, browser, phone, private fixture, protected soak, auth material,
real persistence/reopen trial, listener census or part-2 acceptance. No parser
soundness or general alias/data-flow guarantee. No Linux rerun. No runtime proof
that any synthetic scanner plant writes a store. The PM owns review, commit and
push. No install, node_modules change, file deletion or Git mutation ran.

### Final commands and output (Review F1)

```text
git status --porcelain
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
 M rebuild/lanes/c/TODAY-SPLIT-FENCE-PRECONDITIONS-REPORT.md
 M rebuild/lanes/c/today-split/writer-fence.test.mjs

git diff --stat
warning: in the working copy of 'rebuild/lanes/c/today-split/writer-fence.test.mjs', CRLF will be replaced by LF the next time Git touches it
 .../c/TODAY-SPLIT-FENCE-PRECONDITIONS-REPORT.md    | 145 ++++++++++
 rebuild/lanes/c/today-split/writer-fence.test.mjs  | 299 ++++++++++++++-------
 2 files changed, 344 insertions(+), 100 deletions(-)
```

## Check F2: notes N1 and N2 fixed

2026-09-19. Continued from e4c15d1c in rebuild/c-today-split-build-astra1.
Only this report and writer-fence.test.mjs changed; work remains uncommitted.
This section supersedes the earlier rule descriptions where N1/N2 corrected them.

N1: a keyword-spelled identifier after . or ?. is a member name, so its following
slash is division. The reserved-word regex contexts remain. Contextual of starts
a regex only after a simple declared binding in for (const/let/var name of ...).
This is a small token test for the measured files, not a grammar claim:
destructured, assignment and for-await heads are outside it and named as residue
in the header. The independent regexStripped lookbehind implements its own text
rule, never calling the lexer; it also excludes the second + or - of a postfix
operator from regex-prefix operators. The RED slash rows explicitly check that
the independent reader retains the writer/acquisition witness.

N2: the declaration/parameter binding walk is shared with holder-site
classification and also visits destructuring assignment patterns. Named keys in
patterns, including duplicate keys, count as holder sites and must match declared
windows. Initializer expressions are skipped by the pattern walk. Member names
after . or ?. and object-literal keys remain property positions. The settings pin
holds named binding keys and references to two declared windows; it does not
trace arbitrary aliases or computed keys. The windows themselves did not change.

### Measured rows: before and after

Colours below are releasedRefusals results, not the test runner's pass/fail
colour. W = FENCE-WRITER-NAME; L = FENCE-LANE-ACQUISITION;
H = FENCE-HOLDER-SITE:settings. GREEN means [].

| Row planted in gym-app.mjs | Before rules changed | After |
|---|---|---|
| const a = o.of / 2; model.recover(); void h / 2; | GREEN | RED W |
| const a = o.delete / 2; model.recover(); void h / 2; | GREEN | RED W |
| const a = o.new / 2; model.recover(); void h / 2; | GREEN | RED W |
| const of = 4; const a = of / 2; model.recover(); const b = h / 2; | GREEN | RED W |
| const a = o.of / 2; void facade.lane().save(auditMachine); void h / 2; | GREEN | RED L, W |
| function probe() { return /re/.test(s); } | GREEN | GREEN |
| void typeof /re/; | GREEN | GREEN |
| for (const x of /re/.exec(s) ? [] : []) { void x; } | GREEN | GREEN |
| let n = 0; const pct = n++ / total; const rate = done / total; | GREEN fence, RED cross-check | GREEN fence and cross-check |
| mount { settings: alias, model, onBack, onChanged, onCheckIn, draft, settings } = {} | GREEN | RED H |
| mount renamed key immediately before shorthand: draft, settings: alias, settings | GREEN | RED H |
| mount renamed key after shorthand: draft, settings, settings: alias | RED H | RED H |
| duplicated-key mount plus export let leaked; and leaked = alias; | GREEN | RED H |
| duplicated-key mount plus raw: () => alias on paint handle | GREEN | RED H |
| const { settings: second } = opts; | GREEN | RED H |
| let second; ({ settings: second } = opts); | GREEN | RED H |
| Existing F4: const view = { settings: [] }; | GREEN | GREEN |
| Existing F4: const rows = map.settings; | GREEN | GREEN |
| Existing F4: void machine.settings.length; | GREEN | GREEN |
| Existing F4: rename first to firstPaint | GREEN | GREEN |

The 16 new rows were added before changing either rule. That run had 12 failing
assertions: five missed slash refusals, six missed holder refusals and N4(b)'s
cross-check false red. The after-shorthand row was already RED; three regex
controls already passed. An additional in-memory comparison loaded the committed
cell at e4c15d1c with test registration stubbed and the final cell the same way:
every refusal above was measured directly. All nine slash cross-checks were GREEN
before except postfix division, and all nine are GREEN after. All 16 final new
rows also passed balance, literal, independent keyword and Node syntax checks.
No synthetic plant was written into product bytes or executed as a durable write.

N4(a) remains deliberately unfixed for the S10 brief: the settings mount pin
includes the closing pattern/default tail. Appending theme after settings
returns [FENCE-HOLDER-SITE:settings]; inserting theme before settings returns [].
Both outcomes were measured before and after and are now recorded in the header
as a known false red. This is not an added exception or a claim of soundness.

### Executed bar

| Cell state on this PC | Tests | Pass | Fail | Exit |
|---|---:|---:|---:|---:|
| Before edits | 293 | 293 | 0 | 0 |
| New rows, original rules | 309 | 297 | 12 | 1 |
| Final rules and rows | 309 | 309 | 0 | 0 |

Net +16 rows; no existing row removed, weakened or skipped. All runs had
zero cancelled, skipped and todo. Node v24.19.0, Windows; sequential runs:

~~~powershell
$env:MEASURED_TEST_NOW = '2026-09-03'
$env:TZ = 'America/New_York'
& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-isolation=none rebuild/lanes/c/today-split/writer-fence.test.mjs
~~~

The final bar was repeated after strengthening the three regex controls to assert
that both readers actually recognize /re/ as a regex; it remained 309/309.
The existing Node --check children and new plant syntax checks ran serially.
git diff --check passed; added lines are ASCII. Both owned files are LF-only.
No CRLF warning appears in the final git diff --stat.

Committed cell at e4c15d1c (N5):
1032962b8d337c1322da8786a918bec797acd091df36f9d1842e698103675899.
The historical F1 working-file hash above was CRLF; it is not that commit's hash.

Final LF cell, measured with certutil:

~~~text
certutil -hashfile rebuild/lanes/c/today-split/writer-fence.test.mjs SHA256
0d1b43930a6fcabf8e657d939ee3623bda7807413687016cc32b7a6e02eb8614
CertUtil: -hashfile command completed successfully.
~~~

### What I did not verify

No Linux run, CI, independent Claude review, full Today suite, conformance,
bundle, seal, browser, phone, durability/reopen behavior or part-2 acceptance.
No parser soundness or general alias/data-flow guarantee. No protected data,
private fixture, protected soak or auth file was read. No product byte moved.
No install, node_modules change, file deletion, commit, push, checkout, reset,
stash, clean or fetch. The PM and subsequent Claude hand retain their roles.

### Final commands and output (Check F2)

~~~text
git status --porcelain
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
 M rebuild/lanes/c/TODAY-SPLIT-FENCE-PRECONDITIONS-REPORT.md
 M rebuild/lanes/c/today-split/writer-fence.test.mjs

git diff --stat
 .../c/TODAY-SPLIT-FENCE-PRECONDITIONS-REPORT.md    | 130 ++++++++++++++++++++
 rebuild/lanes/c/today-split/writer-fence.test.mjs  | 132 ++++++++++++++++++---
 2 files changed, 243 insertions(+), 19 deletions(-)
~~~
