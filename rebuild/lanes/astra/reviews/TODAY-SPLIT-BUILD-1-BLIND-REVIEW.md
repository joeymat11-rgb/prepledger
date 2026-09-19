# TODAY-SPLIT BUILD 1 - BLIND CORRECTNESS REVIEW
Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412 and :569; blind; highest effort
Head reviewed: 40c355f9c30f97edebd04785d706e532e8390b1f
SHA256 measured with certutil -hashfile; paths under rebuild/m3/w7-preview/today/:
- today-model.cjs: fb6802f23f5bd0e5c98e7a55609bedf7a0500675962894cadc7f1348f83aa87b
- today-readings.cjs: f7b3ae455bb1b90c25370dc17b4782d1f9a41e515c94c85fbb9e76a3dc46f2bb
- gym-app.mjs: 07ff9687e24bbe05747414561f164ea7233851ee3496fafc22e4deecaa7325d2
- gym-settings-lane.mjs: fbe949cd2fe9e8710fd6c041a2bc1ca62829def05126fd8ce7942bdc7121bbd0

VERDICT: REJECT

Nine executed durable-write variants leave the complete writer fence at 26/26.
The facade also exposes mutable cached facts. No behavior regression in the unmodified
refactor was reproduced, and no executable edit absent from regions.json was found.
The rejection is the assignment's explicit durable-write/fence criterion.

## Findings, most severe first

### F1 - BLOCKING: the existing bare writer bypasses the fence without any alias trick
Input: insert `  void weighIn(180);` immediately before `function adoptBasis(state)`
in a scratch copy of today-model.cjs (HEAD line 426). Nothing else changes.
Execute the actual mutated module with createTodayModel({readings: host}), using the
real createReadingHost and synthetic fake-indexeddb. No weigh-in UI action is sent.
Exact output: {"saved":1,"reopened":1,"lb":180,"status":0,
"counts":["# tests 26","# pass 26","# fail 0"]}.
The freshly reopened host reads the injected fact. The fence only scans dot members;
the destructured weighIn binding is already in released scope, so even an ordinary
call at construction is invisible. This defeats the claimed released writer boundary.
Smallest fix: fence uses of the injected weighIn/reopen capabilities, allowing their
intended export positions only, and add this whole-cell red witness. Do not represent
a member-name scan as protection against invocation of an exposed bare writer.

### F2 - BLOCKING: eight ordinary write shapes evade the member scanner
Input: each row in the fence table below was added separately after gym-app.mjs:223,
inside settingsPaint, outside recordSettings and the six declared seam writers.
Eight save variants return exit 0, 26 pass, 0 fail. The same inserted snippet was
executed against the REAL createGymSettingsLane and createMachineSettingsHost; each
stored one operation, and closing/reopening the host read one operation again.
This is a scanner false negative, not a hypothetical unfamiliar writer name.
The control variants return exit 1, 25 pass, 1 fail, specifically cell 7:
`FENCE-WRITER-NAME: the released gym-app.mjs holds EXACTLY the six declared seam WRITE SITES, and a seventh fails`.
Root causes in rebuild/lanes/c/today-split/writer-fence.test.mjs:
- codeOf (about lines 89-129) discards executable template interpolation.
- memberHits (about lines 132-147) sees only dot members, one line at a time.
- PUT filtering (lines 307-316) suppresses Object by spelling, even when locally shadowed.
- Destructuring and computed member access name no dot member for it to see.
Smallest fixes: remove builtin receiver suppression for PUT (Promise.all is STORE,
not PUT); scan across newlines; inspect template expressions; reject or resolve
computed/destructured writer access. Add all green mutations below as complete-cell
red checks. Until these paths are covered, keep the affected released files sealed.
A scope-aware parser is an alternative; the accepted spec currently calls for a token scanner.

### F3 - MAJOR: frozen facade tables return a mutable sealed read cache
Real-module input: save a valid synthetic Seat=four fact, createGymSettingsLane with
that real host, await hooks.startRead('synthetic-lift'), then:
```js
const e = facade.entryFor('synthetic-lift');
e.state = 'failed';
e.latest.machine.settings[0].value = 'injected';
```
Exact observations: Object.isFrozen(pair/facade/hooks) = true/true/true;
Object.isFrozen(e/e.latest) = false/true. stateFor changes known -> failed;
entryFor(...).latest.machine.settings[0].value changes four -> injected;
(await host.latest(...)).machine.settings[0].value remains four.
No hook performed either mutation. gym-app:224-226 consumes these cached values for
its displayed state and machine settings. Freezing the top-level latest record is
insufficient because its nested machine data is mutable too.
Smallest fix: return detached data, deeply frozen if immutability is promised, instead
of the Map's live entry and nested machine object. Add mutation probes, not merely
source-string Object.freeze assertions. lane() also returns the actual writer host;
that pass-through is declared by B.7/GA-R06 and is not a newly discovered regression,
but it means the facade must not be advertised as a general read-only capability.

### F4 - MAJOR: the fence never checks released module edges
Input: add `void import('./machine-settings-host.mjs');` after gym-app:223 in scratch.
Exact output: exit 0, tests 26, pass 26, fail 0. No durability claim for import alone.
FENCE-VIEW-IMPORT checks the two SEALED files only; RELEASED imports are not checked.
E.3/E.5 expressly require this host edge to fail. A released file can reacquire the
host independently of the declared partner, defeating import isolation.
Smallest fix: check both released files' import/require edges against the declared
partner/allowlist and add this mutation as a whole-cell red check. The edited S10 UI
assertion catches this exact spelling, so this is a standalone fence failure, not a
claim that the full test suite accepts this exact import.

### F5 - NOTE: section 4 is not a complete or accurately located authored-line inventory
Own scripts used git show da9f8683:<file>, raw UTF-8 lines, and byte comparisons;
no lane instrument was run. LF terminators and indentation were preserved.
Every physical line of all four files was classified against its corresponding base:

| File | Physical lines | Present verbatim in base | Absent from base |
|---|---:|---:|---:|
| today-model.cjs | 478 | 460 | 18 |
| today-readings.cjs | 78 | 38 | 40 |
| gym-app.mjs | 559 | 535 | 24 |
| gym-settings-lane.mjs | 103 | 46 | 57 |
| Total | 1218 | 1079 | 139 |

All seven absent-from-base lines NOT listed in section 4 (exact text):
```text
today-readings.cjs:51       setMessage({ ok: false, state: null, copy: ALREADY_RECORDED });
today-readings.cjs:56       setMessage({ ok: false, state: null, copy: OUT_OF_RANGE });
today-readings.cjs:60       setMessage({ ok: false, state: null, copy: NO_STORE });
today-readings.cjs:64     setMessage({ ok: result.ok, state: result.state, copy: result.copy });
today-readings.cjs:70     setMessage(null);
gym-settings-lane.mjs:63       .then(() => { settingsInFlight.delete(liftId); return painter.repaint(); });
gym-settings-lane.mjs:77       .then(async (host) => { settingsLane = host; await painter.repaint(); return host; })
```
All seven ARE declared in section 5 and regions.json: W6a-W6e, W7a-W7b.
No additional undeclared authored line exists in either new file. Both retained files
were reconstructed byte-for-byte from the base, declared cuts/replacements and compose blocks.
Of 77 moved-region lines, 70 are byte-identical; seven are the declared substitutions.
Reversing those substitutions makes all seven regions byte-identical to the base.

Listed locations whose described content is not there: BOTH new factories are at 32,
not 34; BOTH first region banners are at 33, not 35. At readings:34-35 are original
constant/comment lines, and at gym-lane:34-35 are original state declarations.
Physical readings:79 and gym-lane:104 do not exist (a trailing split-empty item explains
one extra claimed line per file; all four reported file lengths use that convention).
For completeness, section-4 listed rows that are verbatim base lines, including blanks:
readings 1,31,34,35,44,67,74,76,77; gym-lane 31,34,35,37,49,66,81,102,103;
gym-app 277,544,545. None in today-model. Reused braces/blank lines alone are not defects.
The headline 151 excludes the seven edited moved lines and counts terminal split-empty
items in the two new files. Physical scaffold/replacement slots are 149; adding the
seven substitutions gives 156 slots, some of which reuse base bytes. Under the requested
present-in-base criterion there are 139 novel lines. These are different counts.
Smallest fix: give physical locations, list the seven substitutions in section 4, and
state the counting convention. This inventory discrepancy alone is not my rejection.

## Fence table
Actual cell: rebuild/lanes/c/today-split/writer-fence.test.mjs. The requested
rebuild/m3/w7-preview/today/test/writer-fence.test.mjs does not exist at this head.
Each gym row uses these two added locals, then the exact expression in the table:
```js
const auditMachine = { exercise_id: liftId, settings: [{ name: 'Seat', value: 'four' }], cues: 'Synthetic cue.' };
const auditStore = facade.lane();
```
GREEN means exit 0 / 26 pass / 0 fail; RED means exit 1 / 25 pass / 1 fail.
"1/1" is persisted operations / operations read after closing and reopening the host.
The fence ran on complete scratch source files; snippet durability was executed
separately with real hosts, except the bare model row, which ran the actual mutated module.

| Shape and exact expression | Fence | Persist/reopen |
|---|---|---|
| Control: no addition | GREEN | n/a |
| `auditStore.save(auditMachine);` | RED | 1/1 |
| `const auditSave = auditStore.save; auditSave(auditMachine);` | RED | 1/1 |
| `const { save: auditSave } = auditStore; auditSave(auditMachine);` | GREEN | 1/1 |
| `auditStore['sa' + 've'](auditMachine);` | GREEN | 1/1 |
| `auditStore.save?.(auditMachine);` | RED | 1/1 |
| `auditStore?.['save']?.(auditMachine);` | GREEN | 1/1 |
| `queueMicrotask(() => auditStore.save(auditMachine));` | RED | 1/1 |
| `Promise.resolve().then(() => auditStore.save(auditMachine));` | RED | 1/1 |
| `{ const Object = auditStore; Object.save(auditMachine); }` | GREEN | 1/1 |
| ``void `${auditStore.save(auditMachine)}`;`` | GREEN | 1/1 |
| `auditStore.` then newline then `save(auditMachine);` | GREEN | 1/1 |
| `void facade.lane().save(auditMachine);` | RED | 1/1 |
| `void facade.lane()['save'](auditMachine);` | GREEN | 1/1 |
| `hooks.saving(facade.lane()['save'](auditMachine));` | GREEN | 1/1 |
| `void import('./machine-settings-host.mjs');` | GREEN | not executed |
| today-model, before adoptBasis: `void weighIn(180);` | GREEN | 1/1 |

## Behavior and existing tests
Base da9f8683 and HEAD copied to synthetic scratch dependency trees. All four product
files ran unmodified for comparison. Installed package resolution was redirected to
the original dependency location; no package was installed or modified.
18 model observations and 8 gym observations per version: BASE_HEAD_BEHAVIOR_IDENTICAL.
Covered no store, invalid range/precision, detached method invocation, live basis
adoption, pending adoption, successful/duplicate weigh-in, reload, write/restart
rejection and message clearing, independent model state, optional delayed/refused
settings reads, lazy host opening, stale cancelled-editor save, and successful save.
Compared UI text, state and responses; generated operation identities were normalized.
Moving day/readings into the readings factory captures const bindings; adoptedRead,
stateFromOps and read retain their original closure over mutable basis/lanes/message.
Gym state remains per mount; deferred reads/opening and painter calls preserved observed order.

The machine-settings-ui S10 diff retains the original dynamic-import assertion on the
new owner and adds its absence in gym-app. Other assertions are unchanged: strengthening
within its existing exact-string approach, with no removed assertion obligation.
The build diff adds exactly two REQUIRED_INPUTS entries and explanatory comments.

| Executed cell | Pass | Fail |
|---|---:|---:|
| gym.test.mjs | 65 | 0 |
| machine-settings-ui.test.mjs, build-producing S14 excluded | 53 | 0 |
| view.test.mjs | 23 | 0 |
| adapter.test.mjs | 20 | 0 |
| ntc-h6-delta.test.mjs | 8 | 0 |
| actual writer-fence.test.mjs | 26 | 0 |
| Total | 195 | 0 |

Every run used the assigned node.exe, MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York.
S14 was excluded with --test-skip-pattern=^S14 - the build pins; its buildToday() writes
.tmp assets into the repository. Node omits this filtered row from its test/skip counts.
Initial scratch attempts stopped on missing dependency copies/package resolution or a
premature DOM wait; corrected probes completed. An initial empty cue was invalid and
saved zero; all durable witnesses above use the valid nonempty cue shown in the table.

## NEW versus ALREADY KNOWN
Blind findings F1-F5 and execution results above were written before either earlier
review file was opened. I then read TODAY-SPLIT-BUILD-REVIEW-R1.md and -R2.md.

| This finding | Comparison with those reviews |
|---|---|
| F1 bare weighIn invocation | NEW. Neither review tests this existing released capability. |
| F2 computed members and builtin shadowing | ALREADY KNOWN: R2 F2/F3, including a facade-derived lane. This review adds actual persistence/reopen witnesses. |
| F2 destructured alias, multiline member | NEW. Neither earlier review reports these bypasses. |
| F2 executable template interpolation | NEW writer witness. R2 F1 concerns template COPY literals and literalsOf; this is a durable call discarded by codeOf. |
| F2 optional computed/facade/hooks variants | Extensions of ALREADY KNOWN computed access, not independent new root causes. |
| F3 live cache mutation through frozen facade | NEW. R2 checked returned null semantics and freeze syntax, not mutation through returned objects. |
| F4 released dynamic host import | NEW. R1 NOTE-3 tests an import added to the SEALED readings file instead. |
| F5 incorrect locations/physical lengths | ALREADY KNOWN: R2 F5. Seven section-4 omissions and the independent line classification/count reconciliation are additional measurements; all seven substitutions were already declared elsewhere. |

I disagree with R2's ACCEPT WITH NOTES under THIS assignment's acceptance criterion:
a durable-write shape that the fence does not notice requires REJECT, even when current
product behavior matches the base. R2 explicitly deferred its known guard holes to
part 2; my verdict does not mistake that sequencing judgment for a claim it never
found them. R2's product/compose witness and copy-template findings were not re-probed.

## What I did not verify
No whole today step, bundle/S14, browser/device run, listener census, full conformance,
reseal/package/CI gate, private fixtures, protected data, credentials or soak.
No exhaustive equivalence proof; no claim about arbitrary injected exotic getters or
monkey-patched builtins. No claim that the entire CI accepts every fence mutation.
No part-2 acceptance. No fix was applied, no tracked file edited, no commit or Git mutation.
Scratch probes/results remain under the OS temp directory:
C:\Users\joeym\AppData\Local\Temp\astra-today-blind-bde3ef31f1c942858db7ab52d228e451
This review is the only repository file written. All review text is ASCII.
