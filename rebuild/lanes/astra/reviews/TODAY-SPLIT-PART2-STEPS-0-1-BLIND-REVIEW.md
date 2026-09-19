# TODAY-SPLIT part 2, steps 0 and 1: blind incremental review
Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412 and :569; blind; incremental; highest effort
Head reviewed: 5b03dda11b6d1f7cdbec0f96db13e34f636da391; code scope pinned to aabe74e and 33cc25f.
VERDICT: STOP AND FIX FIRST

The STOP verdict is supported by executed counterexamples F1 and F2. Fix those
before using the table as the foundation of the big cut. This is not approval of
the future hooks, of the complete product, or of the unexecuted scope-analysis checks.
I created this file before opening any earlier TODAY-SPLIT review or check.
I recorded my initial independent findings here before that comparison.

Named source refs: s9=da9f86839d69a67dfa8c6a59b727aa518bc1164f;
tip=4d2112c92ddffa3fafdd8cfd9dcd4180addb504c. Each target commit was read with
git show naming its explicit touched paths. The reviewed instrument/table bytes
at HEAD match 33cc25f. Step 1 leaves today/dest/interface/substitutions/product/
compose unchanged from aabe74e; today-app has 34 move, 111 replace, 14 seam rows.

## Findings

### F1. NEW, EXECUTED, blocking: TA-I035 can rewrite a different lexical binding

Invariant: a content anchor must identify the intended reference; a newly ambiguous
pre-image refuses rather than changing the meaning of an unrelated local binding.
Exact input: prepend this function to each named ref's today-app.cjs, changing no
table, digest, count, moved region, or replacement text:

```js
function astraShadow() {
  const sleepNightDate = () => "LOCAL";
    const date = sleepNightDate();
  return date;
}
```

Observed at BOTH s9 and tip: cut.cjs exits 0 with empty stderr. Its replacement
report places TA-I035 at [3,3]. The output's third line is
`    const date = facade.sleepNightDate();`. The original target remains bare.
Executing the function before returns "LOCAL"; executing the output with
`facade.sleepNightDate = () => "SEALED"` returns "SEALED". Without that injected
facade the output throws, since this helper is outside the mount closure.

Cause: the generated TA-I035 has first.nth=1 and ambiguousOk=true because its
text already occurs twice. Its recorded otherOccurrences is only prose/data;
resolve.cjs never checks the recorded total. The one-line witness hashes the
identical text, so it cannot distinguish the third, differently bound occurrence.
Smallest correction for this input: record and enforce the occurrence count.
For stable identity, use unique enclosing context or a witnessed scope identity,
not an unchecked ordinal. Add this two-ref plant to the cell. This is NEW relative
to the earlier reviews; R3's anchor findings concerned different boundaries.

### F2. NEW, EXECUTED, blocking: the sleep refusal becomes [object Object]

Invariant: B.6 requires outcome-to-sentence mapping at the released error slot.
Exact input: execute TA-I049/050/051 with the real plainOrDrop and
`facade.sleepOutcome() => ({kind:"late-refusal",code:"SLEEP_STALE_NIGHT"})`,
`facade.sleepReadBack() => null`. The corresponding original sentence, from the
source constants, is:

```
This night changed while you were editing. Review the saved record before trying again. Nothing was recorded.
```

Observed: the original lines paint that exact sentence; the declared replacement
paints `[object Object]`. TA-I050 calls plainOrDrop directly on the outcome object.
Smallest correction: declare B.6's actual mapper call here and test its branches,
including unknown outcomes and the empty-reason spacing case. A renamed getter
is not the mapper. This is an executed defect in the proposed table when paired
with its specified outcome type, not a claim about an already shipped product.

### F3. NEW, EXECUTED with environment qualification: the cell does not exercise the generator

Invariant: a wrong generated disposition should be independently rejected.
Exact inputs include one-clause changes in gen-interface.cjs:
`if (next === "sleep") hooks.forgetCheckInRead();` becomes `next !== "sleep"`;
`hooks.sleepCorrect(false)` becomes `hooks.sleepCorrect(true)`;
and the read mapping's FACADE becomes HOOKS.
Observed for each at BOTH refs: the instruments cell remains 26 tests, 22 pass,
4 dependency failures, with ZERO additional red rows. All eight generator
mutations have the same result. No cell row invokes gen-interface.cjs at all.
Smallest correction: run the generator on independently constructed inputs,
compare binding identity and declared outputs, and behaviorally drive the hand
rows. Do not compare generated rows only to hashes re-generated from those rows.
These are survivors of the runnable 22-row subset, NOT claimed full-green survivors.

### F4. NEW, EXECUTED: parse success admits an added early return

Invariant: a replace must not acquire an unruled control-flow change merely
because its output parses. Change TA-I011's replacement to exactly:

```js
    if (!facade.foodLane()) { return;
```

Observed: without a witness update, cut refuses by TA-I011. Run
`gen-witness.cjs --declared --regions <scratch-table> --write`; it exits 0.
The same cut now exits 0 and emits the added return. With foodLane=null and
foodLaneFailure="STORE_UNAVAILABLE", an execution of the original exact guard
block calls `put(map,"stub-note","No store Reason STORE_UNAVAILABLE. Plan not wired")`
under the probe's synthetic copy constants; the changed block returns undefined
and makes NO put call. The refusal becomes silence.

No existing cut check refuses the re-witnessed input. Parsing catches malformed
syntax, not semantic reparenting or early returns; it is not a stronger version of
statement alignment. Smallest correction: compare the surrounding control-flow
structure with a narrowly declared transform and independently test refusal paths.
S-R19 requires a check outside the author/re-witness loop. The general re-blessing
limitation is ALREADY KNOWN (build R1 NOTE-1, build R2 section 5 item 8); this
specific control-flow counterexample and the step-1 overclaim are NEW.

### F5. NEW, EXECUTED: table order changes acceptance

Invariant: row order must not change an otherwise identical content-anchored cut.
Exact input: reverse table.files["today-app.cjs"], changing nothing else.
Observed: baseline exits 0; reversed exits 1 with
`REFUSED: today-app.cjs: regions TA-I004 [718,718] and TA-M03 [718,719] OVERLAP`.
The stable sort uses only start; the allowed seam/replace nesting is one-sided.
Smallest correction: validate containment independent of array order, with a
deterministic tie order (enclosing seam before contained replace). R3 NOTE-9's
general source-order claim predates these nested replaces; this failure is NEW.

### F6. ALREADY KNOWN, EXECUTED: the declared witness is tamper evidence, not an independent oracle

Invariant: changing authored bytes alone must refuse. Step 0 meets it: replacing
`facade: Object.freeze({` with `facade: ({` in the gym product block refuses by
name. After the real --declared generator re-records that same scratch table,
the product cut exits 0 and writes the unfrozen facade. The next independent
controls are review of the declared-text diff, product reconstruction, and
behavioral/fence cells; this digest cannot certify its own newly declared text.
This limitation is documented in gen-witness and earlier build R1 NOTE-1/R2 F4.

Added-block probe: no witness -> NO DECLARED WITNESS; correct digest with old
count -> "the table declares 3 product blocks; the declared-text witness records
2"; correct digest AND count -> exit 0. Thus the count closes a partially forged
addition, not simultaneous re-declaration. The extra unattached product block
was accepted as metadata; I do not claim the cut emitted that unattached file.

The digest uses JSON arrays with field positions, strings escaped, and arrays
preserved. Supported string/array inputs have no delimiter ambiguity. Newline
versus separate head elements produced distinct hashes in the probe. `|| null`
does conflate omitted/null/false/empty-string values; I found no distinct valid
emitted product hidden by that normalization. I did not audit a schema validator.

### F7. NEW, READ: uncovered assignments are reported but not refused

gen-interface.cjs:414-433 prints uncovered STOPS, then its --write block still
writes ALL and exits normally. Candidate input: add an unhanded released
`foodSaving = Promise.resolve();` outside all regions. The requested invariant is
nonzero refusal with no successful-looking table write. Smallest correction:
fail before JSON/--write output when uncovered.length is nonzero. This remains
READ because the full generator could not load eslint-scope on this PC.

### F8. ALREADY KNOWN, READ for the census: the three counts cannot prove writer isolation

Small candidate released line: `facade.foodLane().save({});`. Executed against a
synthetic facade returning a sealed-owned lane, it calls save exactly once. The
census source scans unresolved bare identifiers, exempts interface names, and
does not trace member capabilities or returned aliases. Its only unresolved
identifier here is facade; by that source path the three classes stay absent/zero.
I could NOT execute the complete census to claim it printed those zeros: its
eslint-scope dependency is missing. This limitation is ALREADY KNOWN in spec R3
PART 2(e), the spec's member-access qualification, and the build report's census
limits. The independent writer/capability fence must judge this class.

## Blind-order record (preserved)

This checkpoint is historical; the final findings above supersede its pending
statuses. It was written to the report before the first earlier-review read.

Independent findings recorded BEFORE opening any earlier review/check:

1. EXECUTED: TA-I049/050 do not implement B.6's outcome-to-copy map. Input to
   the exact replacement lines TA-I049/050/051: facade.sleepOutcome() returns
   {kind:"late-refusal",code:"SLEEP_STALE_NIGHT"}, facade.sleepReadBack() returns
   null, and the real plainOrDrop from the pinned product formats the slot.
   Observed error.textContent: "[object Object]". The original lines given
   sleepErrorText="Could not save this night." output that exact sentence.
   Invariant: an outcome must retain its refusal sentence via the released
   B.6 mapper. Smallest correction: declare the complete mapper call at this
   site; a renamed getter alone is insufficient. This is a step-1 table defect
   conditional on the specified object-valued facade, not a claim that the
   unfinished product has shipped. Prior-review classification pending.

2. READ: the uncovered-write branch in gen-interface.cjs prints STOPS but
   continues to --write and has no nonzero exit. The instruments cell contains
   no reference to gen-interface.cjs. Execution pending parser availability.

3. EXECUTED: every TA-W01..TA-W13 full pre-image occurs exactly once at each
   named ref. s9/tip starts respectively: 652/652, 711/711, 1270/1269,
   1273/1272, 1436/1435, 1540/1539, 1561/1560, 1668/1667, 1704/1703,
   1711/1710, 1722/1721, 2298/2297, 2334/2333. This confirms anchoring,
   not the behavior of hooks absent from these two commits.

Blind-order checkpoint: the three entries above were saved first. Earlier
reviews/checks will only be opened after this checkpoint.

## Thirteen hand rows

The full pre-image of EACH row occurs exactly once at EACH ref (not just its
first line). The positions below are physical lines, s9 then tip. All 106 TA-I/W
regions also resolve at both refs with zero overlaps between those 106 rows.

The reviewed commits contain no today-lanes.cjs product block or implementation
of these new hooks. Therefore no row earns a product-behavior PASS yet. I executed
26 trace comparisons (two branches for each row) using the exact pre/post row
text and explicitly modeled hooks that perform the original assignments. All 26
traces matched. This establishes that each proposed call can express the old
order; it does NOT establish that the author's next implementation does so.
The model is not an independent product oracle and is not counted as one.

| row | exact pre-image count and start (s9 / tip) | verdict and specific evidence/obligation |
|---|---|---|
| TA-W01 | 1 at 652 / 1 at 652 | Anchor PASS; behavior READ. With null cache: measureDeps, constructor, assign; with existing cache: none. mintMeasureScreen must retain the internal !measureScreen guard. The surrounding import await, token check and paint await remain outside this row. Screen is a module capability, not a raw field value. |
| TA-W02 | 1 at 711 / 1 at 711 | Anchor PASS; behavior READ. Same cached/uncached trace for importDeps/createImportScreen. Reopen still happens before paint through TA-I004/005. mintImportScreen must not re-create on re-entry or accept an untrusted alternate constructor as an unchecked capability. |
| TA-W03 | 1 at 1270 / 1 at 1269 | Anchor PASS; behavior READ. Null foodReadBack installs no retry listener; truthy readback installs one. On click retryFoodRead reads old foodSaving, returns its promise, then foodSaving is assigned synchronously. The hook must assign even when the original async function takes its early-return path. |
| TA-W04 | 1 at 1273 / 1 at 1272 | Anchor PASS; behavior READ; declared B.3 STOP. The exact save/cal/pro/error objects reach recordIntake in order, then its promise is assigned. Do not defer that assignment until after await or drop the refusal painting. DOM arguments remain; the row's own note admits raw-field-only is unmet. |
| TA-W05 | 1 at 1436 / 1 at 1435 | Anchor PASS; behavior READ. Model trace: loadCheckInKit, readSleepCheckIn(date,true), assign view promise, synchronous caller completes, paint callback. The stored promise must be the .then(paint) chain, not only Promise.all or either input promise. Keep rejection propagation and the released token/screen guard. |
| TA-W06 | 1 at 1540 / 1 at 1539 | Anchor PASS; behavior READ. Eight sets: choice, rollover, openedDay, openedNight, ack, readback, correcting, error/outcome reset. sleepToday precedes sleepNightDate; sleepNightDate sees the NEW choice. Both chosen-date and empty-date/null paths matched in the model. No await may enter this sequence. B.6's new outcome must reset to null. |
| TA-W07 | 1 at 1561 / 1 at 1560 | Anchor PASS; behavior READ. Read rollover (or old night fallback), assign choice, clear rollover, read today, read new night. Both rollover-present and absent branches matched. Do not clear rollover before choosing the stored night. |
| TA-W08 | 1 at 1668 / 1 at 1667 | Anchor PASS; behavior READ. retrySleepRead sees old sleepSaving; its promise is assigned synchronously after invocation. Preserve the promise even when retry has no lane/work and returns early. |
| TA-W09 | 1 at 1704 / 1 at 1703 | Anchor PASS; behavior READ. Set correcting=true before render("sleep",false); render observes true. Hook must be synchronous and the repaint remains after it. |
| TA-W10 | 1 at 1711 / 1 at 1710 | Anchor PASS; behavior READ. Set correcting=false, then clearSleepDraft (observes false), then render (observes false). G08 changes this to true without an additional cell failure. |
| TA-W11 | 1 at 1722 / 1 at 1721 | Anchor PASS; behavior READ; declared B.3 STOP. recordSleep receives the same map object, then sleepSaving gets its promise before the click turn ends. Preserve refusal branches and duplicate-write guards inside the writer. map is still a DOM-bearing argument. |
| TA-W12 | 1 at 2298 / 1 at 2297 | Anchor PASS; behavior READ. Only next==="sleep" clears day then pending; next==="today" clears neither. The preceding mountToken bump remains released. G07 reverses this guard without an additional cell failure. |
| TA-W13 | 1 at 2334 / 1 at 2333 | Anchor PASS; behavior READ. Adopt branch: adoptAthleteState, settleAdoption, assign ready, render, return ready. Non-adopt branch uses Promise.resolve without calling adoptAthleteState. settleAdoption observes the old ready; render observes the new promise. The hook must not await adoption before assigning ready. |

All thirteen notes explicitly call themselves S-R17(g) statement rewrites. Per
the supplied ruling, declaring them does not itself make them one of D.1's
pre-ruled W2/W4/W5/W6/W8 rewrites. Their disposition remains a PM/author STOP
to resolve; the trace model is not authority to waive it. No hand-row refusal-to-
silence regression is proved in the absent hooks. F2 is a generated-row refusal
regression; F4 is a deliberate adversarial table change.

## Generated-row sample

I read all 93 generated pre/post lines and manually checked the following 36
rows in their surrounding source. "Map OK" means the declared syntactic mapping
is appropriate for this actual line, assuming a synchronous side-effect-free
getter returning the original value/function. It is not a proof of facade
implementations or capability safety. I049/I050 are not OK.

| row | hand-verified reference/use | verdict/evaluation observation |
|---|---|---|
| TA-I001 | measureScreen.paint | Map OK; getter and .paint call before the same await; token closure unchanged. |
| TA-I002 | await ready in try/catch | Map OK; reads current promise once; catch remains. |
| TA-I003 | firstRun() guard | Map OK; one of the four pure calls, so facade; importLink remains conditional. |
| TA-I004 | focus-gated importScreen.reopen | Map OK; getter only if focus is truthy. |
| TA-I007 | adoptionSettled with short-circuit | Map OK; early return and todayEntry read order stay. |
| TA-I009 | workout.recover in try/finally | Map OK; receiver read before recover; finally re-enables button after await. |
| TA-I011 | !foodLane block opener | Map OK for committed text; F4 proves syntax alone cannot protect its guard body. |
| TA-I012 | openFoodLane() | Map OK; hooks, single original call site. |
| TA-I014 | repeated foodLaneFailure ternary | Map OK; second read remains confined to truthy arm. |
| TA-I015 | foodLane/host/openedRefusal | Map OK; EXECUTED 3 reads when present, 1 when null, identical pre/post. |
| TA-I017 | foodReadBack.entry.cal default | Map OK; two reads on defined-value arm, one on undefined-value arm. |
| TA-I026 | check-in day/pending/failure | Map OK; && and || preserve evaluation short-circuits. |
| TA-I028 | checkInLive or checkin.checkin | Map OK; fallback chain and repeated checkin read preserved. |
| TA-I029 | sleepNightDate() before day/token | Map OK; pure facade call precedes SleepModel.dayAfter, then mountToken read. |
| TA-I032 | return sleepCheckInViewPending | Map OK; current chain read at return, not captured earlier. |
| TA-I033 | date || sleepNightDate() | Map OK; getter call skipped for supplied date. |
| TA-I035 | sleepNightDate() declaration | Map OK only at intended binding; F1 proves the committed anchor can select another scope. |
| TA-I036 | readSleepCheckIn(date) | Map OK; hooks and unchanged argument. |
| TA-I037 | lane ? null : openSleepLane() | Map OK; opener called only on absent lane. |
| TA-I041 | repeated sleepAck/date/value | Map OK; ternary preserves 1/2/3 reads according to branches. |
| TA-I043 | sleepToday() inside nightDateFor | Map OK under the declared four-name rule: sleepToday is hooks, not a fifth pure facade call. |
| TA-I046 | disabled assignment inside four-box loop | Map OK; EXECUTED 12 total reads when all three conditions are false, 4 when busy is true, identical pre/post. No getter was hoisted out of loop. |
| TA-I049 | sleepErrorText truthiness -> sleepOutcome | FAIL jointly with I050: truthy object selects text arm. |
| TA-I050 | plainOrDrop(sleepErrorText) | FAIL: B.6 object is stringified, with no outcome mapper. |
| TA-I053 | sleepOpsFor(date).length | Map OK under the four-name rule; hooks called once. |
| TA-I061 | sleepNightDate in object property | Map OK; value expression changes, property key "date" does not. |
| TA-I065 | setup summary with typeof member | Map OK; EXECUTED three setup reads then summary call, identical. This is typeof setup.summary, not typeof an unresolved identifier. |
| TA-I067 | workout/checkin/setup object keys | Map OK; keys remain literal keys; only three value references acquire getters. |
| TA-I068 | setup.host/workout.gymHost array | Map OK; EXECUTED setup,setup,workout,workout in that order on both forms. |
| TA-I073 | setup.open object argument | Map OK syntactically; member receiver stays the returned setup object. Capability admission belongs to the separate fence. |
| TA-I075 | adopting-gated armAdoptionGate | Map OK; hook only in original truthy branch. |
| TA-I076 | return ready after setup done | Map OK; return current ready after W13 and repaint. |
| TA-I079 | reboundCheckIn(origin) | Map OK; hook and unchanged raw origin argument. |
| TA-I084 | requestedScreen || setupFirst && firstRun | Map OK; all original short-circuits remain; pure firstRun goes to facade. |
| TA-I088 | sleepCheckInReady arrow | Map OK; chosen getter runs when arrow is invoked, not when API object is created. |
| TA-I093 | get ready() accessor | Map OK; remains a live accessor, not a snapshot/spread. |

No actual sampled row hoists a binding read out of a loop, arrow, getter, default
initializer, or short-circuit. Getter calls replace individual identifier reads
at their original positions. They add a property lookup and a function call;
equivalence requires the simple getter contract, and is not universal for a
side-effecting getter. There is no default-parameter rewrite among these 93 lines.

Scope stress LIMITATION: I could not run eslint-scope fixtures for labels,
property keys, destructuring assignment targets, compound/update writes, bare
typeof/delete, optional calls, tagged templates, shadowed locals, nested closures,
or string/template/regex/comment decoys. F1 executes a real different-binding
failure downstream at the content anchor; it is not claimed as an eslint-scope
bug. READ risks in the generator include excluding a declared local merely because
its name is in GLOBALS, and recognizing CallExpression/NewExpression but not
TaggedTemplateExpression as calls. These are not promoted to executed findings.

## Content anchors and declared text

Executed positives: all thirteen complete hand anchors match once at both refs;
all 106 TA-I/W regions resolve at both with no mutual overlap. A second replace
with TA-I011's same one-line anchor, its own matching witness and incremented
replacement count refuses OVERLAP. Replacements are resolved against the
original input before output is built: setting TA-I012's replacement to TA-I034's
pre-image does NOT cascade. After re-witnessing, the emitted early copy stays
unrewritten and TA-I034's original site is rewritten normally. F1 and F5 are the
exceptions the current checks missed or mishandled.

The generator was invoked at BOTH refs with --json; each exited 1 on missing
eslint-scope and wrote no rows file. Therefore I cannot certify the claimed
regeneration equality. Full rows cannot literally be byte-identical because
tipLines records physical line numbers (W03 alone is 1270 versus 1269). The
author's narrower claim is identical anchors and replacement text. The committed
table resolves at both refs, but that is not the requested independent generator
rerun and I do not present it as one.

## Single-clause mutations and instruments

Runtime used throughout:
`C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
(observed v24.19.0). Before each test command, separate PowerShell lines set:

```powershell
$env:MEASURED_TEST_NOW = '2026-09-03'
$env:TZ = 'America/New_York'
```

The cell and instruments are exact Git-buffer copies from 33cc25f. To obey ONE
Node process, a scratch preload ran synchronous child Node scripts in isolated
VM contexts and appended `-- <explicit path>` to the cell's Git source reads.
The native test runner used --test-isolation=none --test-concurrency=1. No
assertion was edited. The mutation harness replayed the same 26 synchronous
callbacks serially; the native runner independently reproduced its baseline.
One script ran at a time; the whole Today step was never run.

CENSUS_INSTRUMENT was unset. No installed parser directory was found in the
targeted checks; npm-cache contained none of the requested parser packages, and
network retrieval failed. No npm install occurred, and no node_modules was
written. I extracted Node's own embedded Acorn (version 8.17.0) and acorn-walk
into scratch. eslint-scope remained unavailable. Consequently these runs are
qualified local evidence, not a reproduction of the author's full parser stack.

| cell at 33cc25f | tests | pass | fail | interpretation |
|---|---:|---:|---:|---|
| SPLIT_TEST_REF=s9 | 26 | 22 | 4 | Node exit 1; four MODULE_NOT_FOUND dependency failures. |
| SPLIT_TEST_REF=tip | 26 | 22 | 4 | Node exit 1; the same four dependency failures. |

The four failing rows are the on/name census row, zero-name-capture row,
census-without-line-map row, and product-byte-reproduction row. The last one
compares all four product hashes successfully, then fails in its subsequent
capture.cjs call. Its logged byte matches are today-model fb6802f23f5bd0e5...,
today-readings f7b3ae455bb1b90c..., gym-app 07ff9687e24bbe05..., and
gym-settings-lane fbe949cd2fe9e871.... Do not count that whole row as passing.

Each mutation below changes ONE clause of ONE scratch copy, then restores that
copy before the next mutation. Every row ran at BOTH refs with the same result.
"Survives subset" means 22 pass/4 dependency fails and no new red, not 26/26.

| ID | single clause changed | s9 and tip | additional red row |
|---|---|---|---|
| G01 | read rewrite uses HOOKS instead of FACADE | 22/4; survives subset | none |
| G02 | call choice always takes FACADE | 22/4; survives subset | none |
| G03 | delete sleepNightDate from four pure-call names | 22/4; survives subset | none |
| G04 | rename destination sleepOutcome -> sleepErrorText | 22/4; survives subset | none |
| G05 | locateHand rejects zero matches only, not non-one | 22/4; survives subset | none |
| G06 | disable movedAt(line) reference exclusion | 22/4; survives subset | none |
| G07 | W12 next===sleep -> next!==sleep | 22/4; survives subset | none |
| G08 | W10 sleepCorrect(false) -> sleepCorrect(true) | 22/4; survives subset | none |
| C01 | disable product SHA mismatch comparison | 21/5; killed | RED R2 F4: dropping Object.freeze from the read-only facade in the product block is REFUSED by name |
| C02 | disable compose SHA mismatch comparison | 21/5; killed | RED R2 F4: a compose line rewritten so the released half composes the seal differently is REFUSED by name |
| C03 | disable product-block count comparison | 21/5; killed | RED R2 F4: a product block ADDED to the table is REFUSED, by name and then by the recorded count |
| C04 | disable compose-block count comparison | 22/4; survives subset | none |
| C05 | parse sealed output only, omit released output | 21/5; killed | RED part 2: a replacement that drops a brace is REFUSED because the OUTPUT does not parse |
| C06 | disable statement-alignment refusal | 22/4; survives subset | none |
| C07 | disable overlapping-region refusal | 22/4; survives subset | none |
| C08 | overlap skip uses here.start>=prev.end instead of > | 22/4; survives subset | none |

C04/C06/C07/C08 identify missing active negative coverage for compose counts,
move alignment, general overlap, and shared-endpoint overlap. G01-G08 identify
an entirely uninvoked generator. Add independent negative rows for these cases
and rerun with the complete parser stack before claiming mutation closure.

## What I did not verify

1. The complete 26/26 instruments result on this PC. Four rows could not load
   eslint-scope. I asked for its installed location and received no location
   while completing this review. No missing test was counted as a pass.
2. Fresh generator equality at s9 and tip, the full scope-stress battery, or an
   actual census run printing three zeros on the writer plant. These remain
   READ/unverified, as distinguished above.
3. The actual new hook implementations, product storage, rejection behavior,
   the eventual B.6 mapper, or the factory's sealed-to-released wiring. They are
   outside these two commits. The hand-row model is not their implementation.
4. Complete product suites, the whole Today step, browser/phone behavior,
   custody/fence integration, the engine gate, real athlete data, or the protected
   soak. None was run or opened for this task.
5. The five requested DECISIONS lines: this worktree's file has only 548 lines,
   so 550/574/584/588/592 are absent. I used the constraints supplied in the
   commissioning message, not invented wording for those unavailable rulings.
6. A whole-repository diff. Every Git show/diff named explicit allowed paths;
   source extraction was limited to the reviewed instruments and public Today
   source needed for the named-ref probes. No tracked file was edited.

Earlier-review comparison was performed only AFTER the saved blind checkpoint.
I compared the relevant findings in spec R1/R2/R3, build R1/R2, and fence F1/F2.
F1-F5's specific inputs are new to that record; re-blessing and the census's
capability blind spot were already described there. Fixes to other tickets are
not re-reviewed or credited here.

## Final workspace evidence

Automatic approval review rejected the scratch-cleanup command with "blocked by
policy". It gave no more specific reason. The command did not execute and I did
not retry deletion. Retained scratch path (only files created for this review):

`C:\Users\joeym\AppData\Local\Temp\earned-astra-37\.astra-split-review-scratch`

The report and all numbered tables passed the executed ASCII/LF/count check
before the final prose additions. Scratch instrument copies were verified
byte-identical to 33cc25f after mutations were restored. No tracked product,
instrument, decision, or status file was edited.

The last two shell commands, and their stdout:

```text
git status --porcelain
?? .astra-split-review-scratch/
?? rebuild/lanes/astra/reviews/TODAY-SPLIT-PART2-STEPS-0-1-BLIND-REVIEW.md

git diff --stat -- rebuild/lanes/c/today-split-spike/cut.cjs rebuild/lanes/c/today-split-spike/gen-interface.cjs rebuild/lanes/c/today-split-spike/gen-witness.cjs rebuild/lanes/c/today-split-spike/regions.json rebuild/lanes/c/today-split-spike/test/instruments.test.cjs rebuild/lanes/astra/reviews/TODAY-SPLIT-PART2-STEPS-0-1-BLIND-REVIEW.md
```

git diff --stat produced no stdout. The report and retained scratch are
untracked, so they do not appear in that stat. The command invocation also
emitted these two stderr lines:

```text
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
```
