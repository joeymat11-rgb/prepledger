# TODAY-SPLIT FENCE PRECONDITIONS - Astra builder measurement

2026-09-19. Branch rebuild/c-today-split-build-astra1; HEAD 2b751d8df09beb7430dced393885ecb427ec8ba5.
Hypothesis for the independent Claude reviewer, who should try to disprove it:
The assigned holder pins and tokenizer checks hold the measured cases below,
in addition to the prior S-R26 through S-R29 rows. The reviewer should attack the residue.
This is not release acceptance or a soundness claim. Work is uncommitted.
Only writer-fence.test.mjs and this existing report were written; no scratch files were created.

## Measurements over the released source

Paths below are relative to rebuild/m3/w7-preview/today/. Counts exclude comments/string prose.
Part 2 must measure/declare today-app.cjs in RELEASED_FILES and RELEASED; no automatic pin updates.

| Construct | today-model.cjs | gym-app.mjs |
|---|---:|---:|
| Bracket member key beginning with quote/backtick, or containing + | 0 | 0 |
| Destructuring declaration mentioning a holder in its RHS | 1 | 1 |
| Template interpolation containing a call | 0 | 0 |
| Builtin-shadowing declaration, parameter or function name | 0 | 0 |
| Member expression spanning a newline | 0 | 1 |
| PUT member with a suppressed builtin receiver | 0 | 0 |
| Code identifiers weighIn / reopen | 2 / 2 | 0 / 0 |
| facade.lane expressions | 0 | 3 |
| Static imports / dynamic imports / require calls | 0 / 0 / 5 | 4 / 0 / 0 |

Zero-count syntax is forbidden; nonzero destructures are pinned by full line content, including
all three model lines. Duplicates/changes fail. Bracket '+' is refused even for possible numbers.
The gym newline member is the chain from line 502's array to line 503's .filter.
Newlines are allowed: memberHits now spans them; both before-dot and after-dot PUT plants fail.
PUT suppression was removed: measured cost is zero existing sites, and Promise.all is STORE.
An isolated Object.save plant fails without relying on either shadowing or lane acquisition.

## Literal declared sites

Model lines 412-414 (composition/destructure); weighIn and reopen each occur on line 412:
```js
  const { weighIn, reopen, ALREADY_RECORDED, OUT_OF_RANGE, FORM_MIN, FORM_MAX } =
    createReadingsWriter({ day, readings, adoptedRead, stateFromOps,
      read: () => read(), NO_STORE, setMessage: (m) => { lastMessage = m; } });
```
Model line 440 (each identifier's second and last code occurrence):
```js
    read, weighIn, reopen, adoptBasis, setPendingAdoption,
```
Gym line 134 (composition/destructure):
```js
  const { facade, hooks } = createGymSettingsLane(doc, model, settings, painter);
```
Gym lines 217, 276, 543 respectively (the three facade.lane expressions):
```js
    if (!facade.lane()) { block.hidden = true; editor.hidden = true; hooks.open(); return; }
    try { result = await facade.lane().save(machine); }
    lane: () => facade.lane(),
```
The original six PUT seam hits remain: gym 276 save, 390 logSet, 415 finish, 469 forget,
476 undo, 517 start. The model row now explicitly acknowledges its two bare re-exports.
Module allow-lists, in source order (kind and literal target, with multiplicity checked):
- Model 41,42,45,49,54: require ./today-engine.cjs, ../fixtures.cjs, ./food-model.cjs,
  ./sleep-model.cjs, ./today-readings.cjs.
- Gym 9,14,20,23: import ./today-app.cjs, ./plain-copy.cjs,
  ./machine-settings-view.mjs, ./gym-settings-lane.mjs.
New static/side-effect imports, dynamic imports, requires, nonliteral edges and re-exports
have independent RED witnesses. Template code is included in capability/edge inventories.

## S-R27(d): holder-site measurement and declared lines

The new RELEASED_FILES.holders member uses the same whole-line, source-order,
per-token multiplicity comparison as capabilities. It includes property identifiers,
not just binding references; comments and string contents do not count.
settings in gym-app.mjs: 3 tokens on 3 lines (99,134,540).
readings in today-model.cjs: 18 tokens on 12 lines, as listed below.
Mismatch has its own refusal, FENCE-HOLDER-SITE:settings or FENCE-HOLDER-SITE:readings.
Eight RED rows cover bare/template references, duplicate declared lines, and extra
occurrences on a declared line. Two controls measure counts and ignore holder prose.

Scope interpretation for PM review: readings exceeds the brief's approximate eight-site
limit. I asked for clarification, then treated the explicit instruction to pin readings
as the specific exception. This is a builder interpretation, not a new owner ruling.
model, doc and phone remain unpinned; this exception is documented beside the table.

Exact gym declarations (one occurrence of settings per line):
```js
export function mountGym(doc, phone, { model, onBack, onChanged, onCheckIn, draft, settings } = {}) {
  const { facade, hooks } = createGymSettingsLane(doc, model, settings, painter);
  first.settings = Object.freeze({
```
Exact model declarations below, in source order. Multiplicities by line are
209:2, 210:1, 235:2, 321:2, 325:1, 327:1, 328:1, 342:2, 346:2, 347:2, 413:1, 443:1.
The table literally repeats each twice-occurring line twice; no set deduplication.
```js
  const readings = options.readings || null;
  const durable = !!readings;
    return readings ? readings.reads() : [];
    const paint = readings ? readings.paint() : "TRUTHFUL";
    if (readings && paint !== "TRUTHFUL") {
        today: day, paint, faceState: (readings.face() || {}).state || null, blocked: true,
        blockedCopy: readings.blockedCopy(),
      today: day, paint, faceState: readings ? ((readings.face() || {}).state || null) : null,
      saveLabel: readings ? readings.label() : "",
      outbox: readings ? readings.outboxRetained() : null,
    createReadingsWriter({ day, readings, adoptedRead, stateFromOps,
    readings,
```

## Tokenizer self-check measurement

Regex literal counts and independent keyword counts (all offsets also agree):

| File | Regex | Templates | function | const | let | return |
|---|---:|---:|---:|---:|---:|---:|
| today-model.cjs | 0 | 0 | 19 | 43 | 6 | 27 |
| gym-app.mjs | 0 | 0 | 14 | 103 | 6 | 35 |
| today-app.cjs (read-only, part 2) | 1 | 0 | 76 | 376 | 51 | 196 |

The sole regex is today-app.cjs:2413, /[?&]screen=([a-z-]+)/.
tokensOf now distinguishes regex from division by previous significant token,
handles escapes/classes/flags, and recurses into template interpolations. Numbers
and postfix ++/-- remain expression-ending tokens. No product bytes changed.

Twelve file rows, four for EACH of those three files:
- Bracket stack must end empty with properly nested (), [] and {}, including each
  interpolation body. Catches lost/skewed delimiters without counting literal text.
- Literal rows require closed strings/templates/regexes and forbid raw line breaks
  in strings/regexes. Each raw string must re-read as exactly the same single token.
  Catches unterminated or line-swallowing lexemes and inconsistent string boundaries.
- Independent regex stripping uses neither tokensOf nor its boundaries/context helper.
  A plain identifier regex counts function/const/let/return and compares all offsets;
  a disagreement reports the file and earliest differing offset, even at equal counts.
- spawnSync(process.execPath, ['--check', file]) checks Node syntax, without executing
  product source. All three PASSED here; no refused spawn, no skipped row.

Eight RED checker rows caught unclosed/crossed brackets, an unclosed interpolation
bracket, unterminated string/template/regex, and escaped line breaks in string/regex.
Two injected token-list faults caught an offset-only disagreement and a missing keyword.
Two controls exercised division operands, regex contexts/escapes/classes/flags and
keywords inside comments/strings/templates/regexes. These checks all passed.
Eight RED position rows (four shapes in each released file) put a quote-bearing regex,
a backtick-bearing regex, division followed by a quote-bearing regex, or a template
interpolation containing a regex before the NEXT-LINE witness. The model still refused
bare weighIn with FENCE-CAPABILITY-SITE:weighIn; gym still refused facade.lane() with
FENCE-LANE-ACQUISITION. Each row also asserted one regex token and checked literals/balance.

The independent regex stripper deliberately masks whole templates; measured files have
none. A future interpolation containing counted keywords can disagree and require review.
Neither scanner is a complete ECMAScript parser; regex after control-statement closing
parentheses, Unicode identifiers, and all grammar ambiguities are not proved covered.
The legacy codeOf/withoutComments copy/member scanners were not rewritten in this task.

## Blind table: before and after

Before: rebuild/r-astra-split-1's executed record, not rerun. After: the released-file checker.
All 14 gym shapes keep that review's auditMachine/auditStore prefix and run over both released
files in memory. No planted code is executed.
A = FENCE-LANE-ACQUISITION; W = FENCE-WRITER-NAME; E = FENCE-RELEASED-MODULE-EDGE;
C = FENCE-CAPABILITY-SITE:weighIn. RED means the named refusal was asserted, not a failing test.

| Original shape/expression | Before | After / asserted reason |
|---|---|---|
| No addition | GREEN | GREEN |
| auditStore.save(auditMachine) | RED | RED A,W |
| const auditSave = auditStore.save; auditSave(auditMachine) | RED | RED A,W |
| const { save: auditSave } = auditStore; auditSave(auditMachine) | GREEN | RED A |
| auditStore['sa' + 've'](auditMachine) | GREEN | RED A |
| auditStore.save?.(auditMachine) | RED | RED A,W |
| auditStore?.['save']?.(auditMachine) | GREEN | RED A |
| queueMicrotask(() => auditStore.save(auditMachine)) | RED | RED A,W |
| Promise.resolve().then(() => auditStore.save(auditMachine)) | RED | RED A,W |
| { const Object = auditStore; Object.save(auditMachine); } | GREEN | RED A |
| void `${auditStore.save(auditMachine)}` | GREEN | RED A |
| auditStore. then newline then save(auditMachine) | GREEN | RED A |
| void facade.lane().save(auditMachine) | RED | RED A,W |
| void facade.lane()['save'](auditMachine) | GREEN | RED A |
| hooks.saving(facade.lane()['save'](auditMachine)) | GREEN | RED A |
| void import('./machine-settings-host.mjs') | GREEN | RED E |
| Model: void weighIn(180) before adoptBasis | GREEN | RED C |

Separate plants assert FENCE-BRACKET-KEY, FENCE-CAPABILITY-DESTRUCTURE,
FENCE-TEMPLATE-CALL and FENCE-BUILTIN-SHADOW without relying on lane acquisition.
The newline plant also independently asserts W. Comments, string prose and Promise.all stay GREEN.
R2 F1's backtick prose is now seen by literalsOf; its two sealed-file RED plants pass.

## Behavior recorded, bar and residue

S-R29 uses the real createGymSettingsLane with a synthetic injected latest() result.
Pair/facade/hooks are frozen; entryFor's entry is not. entry.state='failed' changes stateFor
from known to failed; entryFor returns the same object. A nested settings value is mutable too.
The row calls this recorded laxity and explicitly requires rewriting when recordSettings is sealed.
No detached-copy fix was built. The old freeze row now claims only three source wrappers.

Before: locally reran HEAD's 155 tests, 155 pass, 0 fail.
After: 200 tests, 200 pass, 0 fail, 0 skipped/cancelled/todo.
The net 45 added rows are 12 file self-checks, 10 RED checker checks, 2 lexer controls,
10 holder checks/controls, 8 next-line witness rows, and 3 new residue rows.
All six old residue rows remain exercised: three gym RED rows and three model controls.
Executed with each environment assignment on its own PowerShell line:
```powershell
$env:MEASURED_TEST_NOW = '2026-09-03'
$env:TZ = 'America/New_York'
& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test rebuild/lanes/c/today-split/writer-fence.test.mjs
```
Exit 0. git diff --check passed; added cell lines contain zero non-ASCII characters.
certutil -hashfile rebuild/lanes/c/today-split/writer-fence.test.mjs SHA256:
77802e39dd38d0cd691a28fa1c4f5051da0ebb8e6028be9b2b892aa8c1674496

These three PREVIOUS residue spellings now each produce FENCE-HOLDER-SITE:settings
in gym-app.mjs. They still scan GREEN in today-model.cjs, which has no settings binding;
those three retained controls are lexical measurements, not executable raw-store paths:
```js
const key = 'sa' + 've'; settings[key](auditMachine);
Reflect.apply(Reflect.get(settings, 'save'), settings, [auditMachine]);
const alias = settings; const { save: write } = alias; write(auditMachine);
```
The RESIDUE list now records these three NEW passing gym spellings:
```js
const key = 'log' + 'Set'; model[key](auditMachine);
const cached = facade.entryFor(liftId); if (cached) cached.state = 'failed';
    submittedDraft.cues = 'Synthetic changed cue.';
```
The first two are planted before the existing entryFor line inside settingsPaint,
where model, facade and liftId exist. auditMachine is only a synthetic argument name;
the row measures scanning, not a successful logSet payload or durable operation.
The third is planted immediately INSIDE recordSettings(map, view, submittedDraft),
before its guard. It changes a helper parameter; it does not claim a valid null path.
The cache row mutates a returned object and the parameter row mutates a submitted draft;
neither is a direct PUT call. These expose data-flow/mutation residue, not new persistence proof.
It cannot trace keys/reflection/aliases, prove a called reader's effects, handle all JavaScript
grammar or prevent generated code/runtime replacement. These were not durability trials.
The header requires an independent review of every hunk and the PM's final review.

## What I did not verify

No new persistence/reopen rerun, full Today suite, bundle, CI, conformance, browser/device, private
fixture, protected soak, credential or part-2 acceptance. No R2 F4 codemod repair, product change
or independent-review verdict claimed.
No package/receipt/build instrument, install, commit, push or other forbidden Git mutation ran.
All mutation plants remain in memory. S-R29's existing synthetic behavior row reran and passed.
No actual durable result was executed for the three new residue snippets.
No complete JavaScript grammar, arbitrary data-flow or every lexer-error shape was verified.
The string re-read check shares tokensOf; only the keyword stripper and Node check are independent.
Final status below is the no-product-byte-change check; both owned files are tracked.

## Final commands and output

```text
git status --porcelain
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
 M rebuild/lanes/c/TODAY-SPLIT-FENCE-PRECONDITIONS-REPORT.md
 M rebuild/lanes/c/today-split/writer-fence.test.mjs
git diff --stat
 .../c/TODAY-SPLIT-FENCE-PRECONDITIONS-REPORT.md    | 131 +++++++++-
 rebuild/lanes/c/today-split/writer-fence.test.mjs  | 273 ++++++++++++++++++++-
 2 files changed, 381 insertions(+), 23 deletions(-)
```
