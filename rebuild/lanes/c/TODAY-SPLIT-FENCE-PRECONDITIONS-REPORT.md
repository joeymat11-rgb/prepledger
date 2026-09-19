# TODAY-SPLIT FENCE PRECONDITIONS - Astra builder measurement

2026-09-19. Branch rebuild/c-today-split-build-astra1; HEAD 40c355f9c30f97edebd04785d706e532e8390b1f.
Hypothesis for the independent Claude reviewer, who should try to disprove it:
S-R26 through S-R29's assigned fence changes hold the measured cases below.
This is not release acceptance or a soundness claim. Work is uncommitted.
Only writer-fence.test.mjs and this new report were written; no scratch files were created.

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

Before: 26 test rows counted in HEAD. After: 155 tests, 155 pass, 0 fail, 0 skipped/cancelled/todo.
Executed with each environment assignment on its own PowerShell line:
```powershell
$env:MEASURED_TEST_NOW = '2026-09-03'
$env:TZ = 'America/New_York'
& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test rebuild/lanes/c/today-split/writer-fence.test.mjs
```
Exit 0. git diff --check passed; added cell lines contain zero non-ASCII characters.
certutil -hashfile rebuild/lanes/c/today-split/writer-fence.test.mjs SHA256:
8f3bc1938aade4d99758333d3e511b1c9cd9fdcd678c4aea76224bae1700d811

These three planted spellings STILL PASS in BOTH released files (six recorded residue rows):
```js
const key = 'sa' + 've'; settings[key](auditMachine);
Reflect.apply(Reflect.get(settings, 'save'), settings, [auditMachine]);
const alias = settings; const { save: write } = alias; write(auditMachine);
```
It cannot trace keys/reflection/aliases, prove a called reader's effects, handle all JavaScript
grammar or prevent generated code/runtime replacement. These were not durability trials.
The header requires an independent review of every hunk and the PM's final review.

## What I did not verify

No persistence/reopen rerun, full Today suite, bundle, CI, conformance, browser/device, private
fixture, protected soak, credential or part-2 acceptance. No R2 F4 codemod repair, product change
or independent-review verdict claimed.
No package/receipt/build instrument, install, commit, push or other forbidden Git mutation ran.
Final status below is the no-product-byte-change check; diff --stat excludes this untracked report.

## Final commands and output

```text
git status --porcelain
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
 M rebuild/lanes/c/today-split/writer-fence.test.mjs
?? rebuild/lanes/c/TODAY-SPLIT-FENCE-PRECONDITIONS-REPORT.md
git diff --stat
 rebuild/lanes/c/today-split/writer-fence.test.mjs | 493 ++++++++++++++++++++--
 1 file changed, 449 insertions(+), 44 deletions(-)
```
