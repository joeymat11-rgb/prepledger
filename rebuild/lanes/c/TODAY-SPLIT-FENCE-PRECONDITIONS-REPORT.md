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
