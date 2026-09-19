# N3-A build report: hypothesis for the Claude reviewer

2026-09-19. Astra. Branch rebuild/c-n3-macros-data.
Base HEAD: d3b9cbf2396ef1aa7ea1242137b9251b35159b63.
Scope: the owner's named FREE, additive half only. Work is UNCOMMITTED.
Hypothesis: optional raw macros can be admitted without changing the existing
cal-or-pro save rule, engine projection, or sealed page behavior. The measurements
below support this; they are not independent acceptance or a package-green claim.
T below means rebuild/m3/w7-preview/today.

## Seal and custody measured before the first edit

Parsed rebuild/m4/spec/acceptance-s8-real-shape.json and checked each exact path
against BOTH product and executionPins property names, before creating the cell.
All five were FREE. Rechecked the shape: 224 product keys, 71 executionPins keys;
T/today-app.cjs is a positive SEALED control in product.

| Allowed path | product key | executionPins key |
| --- | --- | --- |
| T/food-commands.cjs | absent | absent |
| T/food-model.cjs | absent | absent |
| T/device-preferences.mjs | absent | absent |
| T/test/food-macros.test.mjs | absent | absent |
| rebuild/lanes/c/N3-MACROS-DATA-BUILD-A-REPORT.md | absent | absent |

Initial git status --porcelain was empty. No sealed source, existing test, engine,
spec, decision or status file was edited. No commit, push, checkout, reset, stash,
clean, fetch or install was run. Protected data and auth files were not accessed.
All cell fixtures are synthetic; quantities in the new cell are invented.

## What changed, by file and line

- T/food-commands.cjs:33: fat/carbs use numeric finite integer bounds 0..1000;
  MEMBERS admits four input fields and ENGINE_MEMBERS retains cal/pro only.
  :45 rejects malformed raw values and macros-only days. Own undefined raw keys
  still refuse; omission belongs to the input adapter, not the stored payload.
  :83 validates the actual day before serialization, so JSON cannot erase an
  own undefined key and turn a malformed operation into a valid one.
- T/food-model.cjs:37: separate optional-field refusal codes and proposed copy.
  :46 validates supplied macro text using trimmed digits and protein's domain;
  :65 omits empty-string/undefined fields, preserves explicit zero, and does no
  inference. :99 and :127 retain cal/pro-only projection and projected readback.
  The existing REFUSALS object still describes the sealed two-input page;
  MACRO_REFUSALS and MACRO_REFUSAL_COPY are additive contracts for N3-B.
- T/device-preferences.mjs:3: independent earned-device-preferences database,
  preferences store, trackMacros key. :9 opens it; :31 reads/writes one Boolean.
  Missing means false. Invalid types, closed handles and storage failures reject
  with DEVICE_PREFERENCES_*_FAILED codes. Writes resolve on transaction completion,
  never request success. :61 exposes readTrackMacros, writeTrackMacros and close.
  No athlete identifier, operation, import/export hook or page import was added.
- T/test/food-macros.test.mjs:30: omission; :47: unchanged partial-day rule;
  :64: both macro domains and invalid matrices; :103: real-host durability;
  :119: real-engine projection; :138: actual adherence readers;
  :154: actual native source admission; :176: external IndexedDB fault harness;
  :212: preference persistence/isolation; :229: commit timing; :246: failures.
- This report records executed evidence and the remaining handoff.

## Red first, before changing any product file

Executed the new cell against the unchanged product: 15 tests, 4 pass, 11 fail.
The same 15 tests now pass, with no skip, cancellation or todo.

| Row | Unchanged product | Final |
| --- | --- | --- |
| Omission and one acknowledged operation | GREEN control | GREEN |
| Legacy partials valid, macros alone refused | GREEN control | GREEN |
| Fat endpoints and trimmed input | RED: fat:0 silently omitted by entry adapter | GREEN |
| Carbs endpoints and trimmed input | RED: carbs:0 silently omitted by entry adapter | GREEN |
| Fat malformed entry and sentence | RED: null accepted, no FAT_RANGE | GREEN |
| Carbs malformed entry and sentence | RED: null accepted, no CARBS_RANGE | GREEN |
| Fat malformed raw values, no writes | RED: validator erased own undefined | GREEN |
| Carbs malformed raw values, no writes | RED: validator erased own undefined | GREEN |
| Real food host save/close/reopen | RED: first macro save refused | GREEN |
| Actual engine arguments and entire state | GREEN control | GREEN |
| Actual measure counts and percentages | GREEN control | GREEN |
| Actual native source admission | RED: LOCAL_SOURCE_DAILY_UNRESOLVED on all 3 macro ops | GREEN |
| Preference default/persistence/isolation | RED: ERR_MODULE_NOT_FOUND | GREEN |
| Preference transaction acknowledgement | RED: ERR_MODULE_NOT_FOUND | GREEN |
| Preference failures and food isolation | RED: absent module, not the expected storage failure | GREEN |

Test-contract correction made BEFORE the product edits: the first baseline run
expected a top-level host result.code on malformed input. It is null on this base.
Measured client/index.cjs:313-314 normalizes producer failure to WORKOUT_INPUT_INVALID
inside SAVE_FAILED_INVALID copy; the sealed host does not forward the invalid array.
Replaced that mistaken host-shape assertion with exact state 3 and exact existing
Client.copy.SAVE_FAILED_INVALID('WORKOUT_INPUT_INVALID') assertions. Re-ran the entire
new cell on unchanged product: still 4 pass/11 fail, now the raw rows reached the
actual own-undefined validator defect. No refusal or atomicity row was removed.
Producer refusal remains FOOD_INPUT_INVALID; entry refusals name FAT_RANGE or
CARBS_RANGE and carry the proposed sentence mapping. Structured host-code forwarding
would require a separately authorized sealed change; it is not claimed here.

Baseline loops stop at their first failing assertion; later matrix cases are not
claimed as separate red-first observations. The final run exercised every case:
null, empty/whitespace raw strings, nonnumeric values, negative, fractional,
nonfinite, excess, numeric raw strings, Boolean, object and array inputs. Entry
tests additionally reject exponent and signed text and accept trimmed leading zeros.
Each raw refusal compares the entire authenticated generation before/after, including
ops, outbox and metadata. Cal/pro-only saves remain accepted.

The durable cell uses the real createFoodHost and the same faultDatabase support
as food.test.mjs. Four raw presence combinations survive close/reopen exactly,
including zero. Projection wraps the real writeDaily only to capture arguments:
both arguments and whole result equal the macro-free control. Adherence uses
loggedDaysIn, loggedDaysFromRows and weeksFromState, including historical partials;
both paths give equal results and 100 percent for three invented logged dates.
Native admission uses the existing synthetic S3 fixture and real controller/shared
validator: two superseded raw macro ops are returned intact as retained originals,
the winner remains intact in the repository, and projected dailyLogs has only cal/pro.
Preparation leaves the generation unchanged. This is admission, not a backup restore.

Preference tests measure default OFF, Boolean-only writes, reopen, persisted OFF,
separate factory isolation, and the exact database name. A delayed real transaction
does not resolve the write until completion. Injected open/get/put/transaction
failures and aborts after successful get/put requests reject. Failed writes keep
the prior true value. Preference writes beside a food host leave its entire
generation unchanged; a subsequent cal-only food save works. Closed handles reject.

## Every new potentially athlete-facing sentence

Both are PROPOSED, NOT OWNER-APPROVED, copied verbatim from spec section 7 and
marked that way at T/food-model.cjs:34. Neither is wired into the page in N3-A.

- "Enter fat as a whole number of grams from 0 to 1000, or leave it blank. Nothing was recorded."
- "Enter carbs as a whole number of grams from 0 to 1000, or leave it blank. Nothing was recorded."

No generic invalid-input sentence exists in food-model.cjs. The raw host continues
using its existing generic client refusal sentence. No new preference/UI sentence
was added. The existing food copy contract stays green; the design inventory is
11/11 green. The copy cell's five build failures were present before this work.

## Unchanged cells, before first edit and after final code edit

Each file ran alone, with one Node process at a time; never the whole Today step.
The exact executable for every run was:
C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
Each invocation set these PowerShell environment values, on separate lines:

```powershell
$env:MEASURED_TEST_NOW = '2026-09-03'
$env:TZ = 'America/New_York'
```

Run argument: T/test/<cell filename>, directly, without a child Node test runner.

| Unchanged file | Before pass/fail/total | After pass/fail/total |
| --- | --- | --- |
| food.test.mjs | 56/1/57 | 56/1/57 |
| copy.test.mjs | 34/5/39 | 34/5/39 |
| package.test.cjs | 0/11/11 | 0/11/11 |
| view.test.mjs | 23/0/23 | 23/0/23 |
| adapter.test.mjs | 20/0/20 | 20/0/20 |

All have zero cancelled/skipped/todo. Additional design.test.cjs: 11/0/11.
Final food-macros.test.mjs: 15/0/15. git diff --name-only over the five required
unchanged cells printed nothing. git diff --check printed nothing.

All 17 failing existing checks are build-dependent: esbuild reports
Cannot read directory "../../../..": Access is denied, then cannot resolve
the worktree's today-entry.mjs. Food N1.17 fails; copy's built-page, browser-bundle,
emitted-prelude and two mutation-build rows fail; package's before hook prevents
all 11 rows. These are identical before/after limitations, not GREEN evidence.
PM must rerun these files outside this sandbox. No permission bypass was attempted.

Engine checks: git diff --numstat -- rebuild/engine and the cached variant both
printed nothing; git ls-files --others --exclude-standard -- rebuild/engine also
printed nothing. All four code/test files were byte-scanned: ASCII only, zero CR
bytes (LF endings). The report was checked the same way after creation.

## N3-B handoff, after Today split and a named reseal child

- Remeasure the youngest seal and split's writer/view boundaries before editing.
- Wire preference acquisition/read/write and macro payload collection in the sealed
  lane; add device settings placement only after the owner rules on spec section 7.
- Add optional inputs and same-day raw recorded-value display. OFF hides controls
  and values; absent fields produce no text, prompt, target, grade or inference.
- Require both calories and protein for NEW saves only. Preserve historical partial
  reads/imports. Update contradictory sealed food cells deliberately in the child.
- Resolve blank-correction retention/explicit clearing, then retain hidden raw facts
  inside the durable writer using current records. Test concurrent correction and
  OFF/correct/reopen/ON; N3-A does not supply that writer or claim retention on correction.
- Bind approved refusal/preference/display copy to the view/design inventory. Handle
  preference failure, refused/unknown saves and acknowledged-but-unread saves honestly.
- Add device-preferences to build.mjs and its sealed input census only when wired;
  add the new cell's CI home through the authorized workflow change. Neither moved here.
- Identify the actual raw-operation backup carrier and test export/import/restore
  with presence flags intact and device preference excluded. Admission is not this proof.
- Run phone/accessibility/layout, reload and process-kill checks in an isolated
  browser. No protected soak interaction is part of this assignment.

## Unmeasured / not claimed

- Package GREEN and unchanged emitted input census: blocked by the sandbox build
  failure above. Source diff adds no product import of device-preferences; only the
  new test dynamically imports it. That observation does not replace package proof.
- Full backup restore, preference behavior during an actual restore, arbitrary legacy
  macro dailyLogs migration, old-client downgrade compatibility and physical-device
  persistence are unmeasured. No private/conformance gate or broad Today run was made.
- Browser preference UI, blocked-open/corrupt-value browser scenarios and concurrent
  tab correction are not executed here. Fault-injected fake IndexedDB is the measured
  preference boundary, not a phone power-loss or eviction guarantee.
- Independent Claude review is still pending. No acceptance, commit or PR is claimed.

## Final workspace checks

git status --porcelain and git diff --stat follow, captured after report creation.
The three new untracked files are intentionally absent from git diff --stat.

Git also warned that the global .config/git/ignore file was inaccessible; it still
returned the following workspace rows. That file was not opened or changed.

```text
git status --porcelain
 M rebuild/m3/w7-preview/today/food-commands.cjs
 M rebuild/m3/w7-preview/today/food-model.cjs
?? rebuild/lanes/c/N3-MACROS-DATA-BUILD-A-REPORT.md
?? rebuild/m3/w7-preview/today/device-preferences.mjs
?? rebuild/m3/w7-preview/today/test/food-macros.test.mjs

git diff --stat
 rebuild/m3/w7-preview/today/food-commands.cjs | 15 +++++++++------
 rebuild/m3/w7-preview/today/food-model.cjs    | 26 +++++++++++++++++++-------
 2 files changed, 28 insertions(+), 13 deletions(-)
```
