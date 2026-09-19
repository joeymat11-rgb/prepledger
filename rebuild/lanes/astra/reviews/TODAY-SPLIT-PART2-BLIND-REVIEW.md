# TODAY-SPLIT PART 2 - BLIND REVIEW
Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412 and :569; blind; highest effort
Head reviewed: e08bc11cec423e5d5878110e78d16ccc5f3f8a29
VERDICT: REJECT

The 679 moved lines pass the independent byte comparison. The ordinary writer paths and
all fourteen hand rows match PRE in the executed comparisons. Acceptance is withheld for
an observable initialization-order change, a runtime guard weaker than its stated paint
boundary, surviving consequential mutations, and an instrument receipt that is stale for
the final table. This is not evidence of corruption of any athlete's real data.

PRE=33cc25f; POST=b9f2d54. The author report actually added by e08bc11 is
rebuild/lanes/c/TODAY-SPLIT-BUILD-REPORT-2.md; BUILD-REPORT.md is the part-1 report.
The first independent findings were written to this file before opening either author
report or any earlier review, including origin/rebuild/r-astra-split-2a. The checkpoint's
findings are summarized below. No product fix, tracked-source edit, commit, push or merge was made.

## Findings, most severe first

### F1 - NEW, EXECUTED: E.6 permits a durable write reached from paint inside a listener

Invariant: a writer smuggled into a render path is refused rather than recording data.
Input: real createTodayLanes, a frozen injected painter whose repaint invokes the real
hooks.recordIntake, and hooks.listen(button,"click",()=>painter.repaint()). The food
fields are cal="2300", pro="150". The painter is armed once to avoid recursive painting.
The lane wraps the real createFoodHost over faultDatabase's synthetic encrypted store.
Observed: food operation count grows from 1 to 2; the new day is {cal:2300,pro:150}.
There was no save action in the click callback. The guard admits everything nested under
any shimmed listener, including render. This is a counterexample to the boundary, not a
claim that an unchanged shipped render currently calls recordIntake.

Control: the identical guarded food entry called directly at counter zero throws
"WRITER-OUTSIDE-GESTURE: recordIntake", with zero saves and zero refusal paints.
Smallest correction: add a red execution row for render nested inside an unrelated
listener, and make paint execution unprivileged even while a listener is active. A scoped
one-use save intent or an explicit paint-depth exclusion can implement the distinction.
Do not describe a generic listener-depth counter as proving save intent. The prior
reviews discuss the guard subject list and leaked lanes; this nested-paint witness is new.

### F2 - NEW, EXECUTED: the factory moves a sleep-lane read before bootFoodDays

Invariant: the cut preserves observable evaluation order, including the injected lane
that the writer will use. Input to both REAL composed pages: a plain options object with
options.food; model.setFoodDays calls its original implementation and assigns
options.sleep = syntheticSleepLane. This callback is the documented boot seam.
Observed: PRE api.sleepLane() === syntheticSleepLane is true; POST is false. The POST
factory has already evaluated options.sleep before hooks.bootFoodDays invokes the
callback. No Proxy, getter or source mutation is needed for this witness.

Smallest correction: acquire the sleep option at its original initialization point, or
explicitly rule out this observable callback contract and approve a behavior change.
The five boot calls retain their positions, but moving all initializers to one factory
call does not preserve their interleaving with those calls. This is a synthetic injection
counterexample; I did not find this callback mutation in the shipped standard model.

### F3 - NEW, EXECUTED: consequential authored-line mutations survive the current bar

Invariant: the guard and hand-authored interface are independently tested at their
behavioral boundary. Twenty-five single-clause product mutations were judged one at a
time by the full fence, food.test.mjs, problem.test.mjs (including N2 sleep), and
checkin.test.mjs. Fourteen are killed; ten consequential mutations survive the runnable
bar; one additional survivor is behaviorally equivalent on the exercised invariant.
Every survivor keeps the same five environmental build failures as baseline. None is
called a full-green survivor. Exact edits, counts and killing rows appear below.

Representative exact counterexample M02: change `gestures -= 1` to `gestures -= 0`.
All 395 fence rows pass, with no additional failure in the three today files. After one
shimmed keydown returns, a direct food call now performs 1 save and throws no refusal;
baseline performs 0 and throws WRITER-OUTSIDE-GESTURE. The counter sticks open permanently.
M09 changes sleepCorrecting=on to sleepCorrecting=!on: the current bar also survives,
while the real hook reports false before/after correction paint and true before/after
cancel paint, exactly opposite PRE. M21 replaces the painter's clearDraft call with
undefined: after successful save the real page retains hours="7.5" instead of "".

Smallest correction: add the specific behavioral rows in the survivor table. In
particular, test the guard after a listener returns, assert visible correction/cancel
state, require a non-null Promise rather than only identity equality, and inspect the
draft after success. A test that uses two separate factory instances for outside/inside
gesture checks cannot catch a leaked counter on the same instance.

### F4 - NEW, EXECUTED: the final instruments cell has two genuine stale-count failures

Invariant: the reported 26/26 result applies to the final regions table.
Input: FINAL table and unchanged assertion bodies, at both s9 and tip. Node's bundled
Acorn 8.17.0 and acorn-walk were exposed in scratch; eslint-scope remains unavailable.
Observed: 26 tests, 20 pass, 6 fail at EACH ref. Rows 12,13,14,16 fail on eslint-scope.
Rows 20 and 24 fail independently of that missing dependency:

- Row 20 expects "the table declares 8 substitution rows; the declared-text witness
  records 7". Actual: "the table declares 49 substitution rows; the declared-text
  witness records 48".
- Row 24 expects "the table declares 3 product blocks; the declared-text witness
  records 2". Actual: "the table declares 4 product blocks; the declared-text witness
  records 3".

The checker correctly REFUSES these additions. The stale assertion counts make the
receipt wrong, rather than making the checker accept a forged addition. Smallest
correction: derive expected baseline counts from the independently read final table,
retain the +1 tamper assertion, and rerun the final cell with the real scope dependency.
The author report's 26/26 cannot be credited to these final bytes.

### F5 - ALREADY KNOWN, EXECUTED AGAIN: a content anchor still captures another binding

Invariant: adding a competing lexical occurrence refuses rather than rewriting it.
Exact input prepended to each named source ref, with the FINAL table unchanged:

```js
function astraShadow() {
  const sleepNightDate = () => "LOCAL";
    const date = sleepNightDate();
  return date;
}
```

Observed: cut.cjs exits 0 at s9 and tip. The third line becomes
`const date = facade.sleepNightDate();`. Executing the output with a facade returning
"SEALED" returns "SEALED"; the input returns "LOCAL". Without the facade it throws.
This is prior incremental F1, now TA-I042 rather than TA-I035. Smallest correction:
enforce the recorded occurrence count, then bind the anchor to unique enclosing context
or witnessed scope identity. This does not mean the current shipped bytes contain that
extra helper; the independent byte check did not find an accidentally changed body.

### F6 - ALREADY KNOWN, EXECUTED AGAIN: re-witnessing still blesses a silenced refusal

Invariant: parse success is not sufficient evidence for a pure interface rewrite.
Exact input: change final TA-I018 (formerly TA-I011) to
`if (!facade.foodLane()) { return;`, then run the real gen-witness --declared --write
on that scratch table. Observed: without re-witnessing the edit refuses; after it, cuts
at BOTH s9 and tip exit 0. Executing the original exact guard with no food lane and
STORE_UNAVAILABLE emits one call:
`put(map,"stub-note","No store Reason STORE_UNAVAILABLE. Plan not wired")`.
The modified guard emits NO put call and returns undefined. Smallest correction:
independently compare permitted control flow and run the no-lane refusal branch; preserve
human review of a re-witnessed declaration. The digest remains useful tamper evidence,
but neither it nor the parser is an independent semantic oracle.

### F7 - ALREADY KNOWN, EXECUTED: live facade capabilities bypass hooks entirely

Invariant being qualified: the facade is read-only and hooks are the only state-changing
entry. Exact input: outside all listeners, call facade.foodLane().save({cal:2100,pro:130})
and facade.sleepLane().save({date:"2026-09-02",hours:7},{supersedes:null}) through the
real encrypted synthetic hosts. Observed: each returns ok=true; each host now holds one
operation. These are writer capabilities, not merely mutable cached read values.

Also executed: assigning through foodReadBack.entry, sleepAck, sleepReadBack,
sleepCheckInRow.answers, session, and checkinSummary changes the next getter result.
Smallest correction: replace writer-bearing getters with narrow detached read DTOs and
retain durable operations only behind deliberate hooks. Object.freeze on the outer
facade is insufficient; freezing a host object would still expose callable writers.
S-R29 and earlier spec/incremental reviews already acknowledge this debt. This part does
not create the original lane power, but it has not sealed that power away.

### F8 - NEW measurement, EXECUTED: async continuation refusal is named but unpainted

Invariant being qualified: an honest save can run after its click handler awaits.
Input: hooks.listen(button,"click",async()=>{await Promise.resolve();return
hooks.recordIntake(save,cal,pro,error);}). Observed: rejected promise
"WRITER-OUTSIDE-GESTURE: recordIntake", zero new saves, no additional error-slot paint.
Synchronous click, submit and keydown each pass. A thrown callback or rejected listener
promise does not leak the unmodified counter; the next synchronous save still works.
Smallest correction if async saves are admitted: carry a bounded explicit intent across
the continuation and paint a refusal if it is invalid. Current shipped food/sleep save
listeners are synchronous; therefore this is an executed extension limitation, not a
proved regression of an existing shipped async save. E.6 itself defines a synchronous
window, so broadening it requires a rule rather than casually holding the counter open
until any arbitrary promise settles.

### F9 - ALREADY KNOWN behavior, NEW report correction: the in-flight account is inaccurate

Invariant: the report describes the actual duplicate-write protection.
Input: two synthetic dispatchEvent(click) calls on the same food-save button while save
is pending. PRE=2 save calls; POST=2; disabledAfterFirst=true in both. Native button.click()
obeying disabled is a different input. Sleep's corresponding case makes only 1 save.
Second input: make model.loggedSleep throw SYNTHETIC_PAINT_FAILURE during the sleep
writer's initial busy repaint. In BOTH versions, the first promise rejects, no save is
called, and a subsequent attempted save resolves without calling save. The busy flag
remains set. These are inherited defects, not extraction regressions.

Smallest correction to THIS ticket: fix the report. recordSleep's first statement checks
busy; its assignment to true is later, before repaint/save. There is NO finally in that
function. Resetting the flag safely and adding a sealed food in-flight check are separate
behavioral fixes under the PM's STOP ruling. The gesture guard cannot substitute for an
in-flight flag: two admitted gestures are still two admitted gestures.

## Earlier incremental review: required F1-F5 rerun

| Earlier finding | Final disposition | Executed evidence |
|---|---|---|
| F1 lexical anchor | STILL HOLDS | Both cuts accept the added helper; LOCAL becomes SEALED. Final id TA-I042. |
| F2 object-valued refusal | CLOSED BY THE AUTHOR for this build | Final TA-I067/068/069 call sleepErrorText(), a string. Executing them paints the exact stale-night refusal. B.6's outcome type remains deferred; it was not implemented. |
| F3 generator unexercised | STILL HOLDS, qualified runnable subset | Final baseline and all seven applicable original generator mutations (the eighth rename is already absent), separately at BOTH refs: identical 20 pass/6 fail, no extra red row. Four missing-scope rows and two stale-count rows remain. |
| F4 re-witnessed early return | STILL HOLDS | Final TA-I018; before witness update REFUSED, afterwards both cuts exit 0; one refusal put becomes zero. |
| F5 row-order dependency | STILL HOLDS | Reversing only files["today-app.cjs"] exits 1 at both refs: regions TA-I004 [718,718] and TA-M03 [718,719] OVERLAP. Baseline exits 0. Order-independent containment validation is the smallest correction. |

The earlier scope-only claims remain uncredited. I did not turn a missing eslint-scope
run into a zero-crossings or zero-capture PASS.

## Independent pure-move table

I read the PRE and POST git blobs and resolved each region from its own first/last
anchors. My lexer substitutes code identifiers/call targets only; it does not invoke
cut.cjs, gen-interface.cjs or the author's proof artifacts. It applies W1, W2, W3, W4,
W9, and W10 (only TA-S30), then compares every resulting UTF-8 byte with the corresponding
POST moved span. Comments, strings and all other tokens remain untouched. Every span
matches. The reverse accounting finds no unclassified nonblank authored line.

An independent Acorn walk additionally confirms that all 60 substituted occurrences
are the declared bare references/call targets, not property keys or declarations.
The byte counts and hash prefixes below exclude each span's terminating LF; internal
LF bytes are included, and separator lines are counted in the reverse accounting.

947 total LF lines = 679 moved + 268 authored. The authored accounting is 35 header/
require lines + 41 factory/open lines + 34 region banners + 34 separator blank lines +
124 return/closing lines. The 41-line opening includes the four-line signature, three
state lets, comments/blanks and the 14-line gesture implementation. All declared head,
open and close arrays exactly equal the emitted text. The signature has 22 parameters,
of which 18 are additional to doc/model/options/painter; the facade has 37 getters and
hooks has 29 entries. The stale header's 28-hook/no-guard prose is not the executable
interface. Substituted token counts: W1=23, W2=16, W3=4, W4=15, W9=1, W10=1.

| Region | PRE lines | POST lines | Lines | Rewritten UTF-8 bytes | SHA-256 prefix | Comparison |
|---|---:|---:|---:|---:|---|---|
| TA-S01 | 362-365 | 78-81 | 4 | 309 | 6bb2d6e61f43 | EXACT |
| TA-S02 | 370-384 | 84-98 | 15 | 1153 | a33abb0f1fbe | EXACT |
| TA-S03 | 392-392 | 101-101 | 1 | 49 | 58262fc0967f | EXACT |
| TA-S04 | 410-421 | 104-115 | 12 | 727 | b9cb348d4b78 | EXACT |
| TA-S06 | 432-441 | 118-127 | 10 | 593 | e9d324b0f795 | EXACT |
| TA-S07 | 454-454 | 130-130 | 1 | 96 | bc738bd8c192 | EXACT |
| TA-S08 | 459-464 | 133-138 | 6 | 341 | ee1ebc4fb420 | EXACT |
| TA-S09 | 465-474 | 141-150 | 10 | 653 | 9cf1840eb310 | EXACT |
| TA-S11 | 484-503 | 153-172 | 20 | 827 | 9004c8442c6b | EXACT |
| TA-S12 | 505-508 | 175-178 | 4 | 255 | 553263882d75 | EXACT |
| TA-S13 | 510-541 | 181-212 | 32 | 1882 | 54de766ecdd6 | EXACT |
| TA-S14 | 543-555 | 215-227 | 13 | 924 | db7384115b9a | EXACT |
| TA-S15 | 556-566 | 230-240 | 11 | 505 | 843bf223c30b | EXACT |
| TA-S17 | 569-591 | 243-265 | 23 | 1039 | 5bf4314936de | EXACT |
| TA-S18 | 593-618 | 268-293 | 26 | 1437 | 4a5e6a0235c2 | EXACT |
| TA-S19 | 628-643 | 296-311 | 16 | 803 | 02ce9322282e | EXACT |
| TA-S20 | 688-701 | 314-327 | 14 | 679 | 664c55608b5f | EXACT |
| TA-S21 | 767-767 | 330-330 | 1 | 30 | 84f834bb8ff6 | EXACT |
| TA-S22 | 775-790 | 333-348 | 16 | 916 | 5893f61004b1 | EXACT |
| TA-S23 | 1279-1320 | 351-392 | 42 | 2099 | 1cdbb84c9f6c | EXACT |
| TA-S24 | 1325-1335 | 395-405 | 11 | 386 | 91c88f0426d7 | EXACT |
| TA-S25 | 1374-1377 | 408-411 | 4 | 255 | 2791a36cf591 | EXACT |
| TA-S26 | 1385-1394 | 414-423 | 10 | 414 | 8f7fee53c61f | EXACT |
| TA-S27 | 1411-1428 | 426-443 | 18 | 967 | 629029a80566 | EXACT |
| TA-S28 | 1451-1454 | 446-449 | 4 | 233 | aa2957a6b986 | EXACT |
| TA-S29 | 1728-1757 | 452-481 | 30 | 1481 | 66e73ebec03e | EXACT |
| TA-S30 | 1808-1931 | 484-607 | 124 | 6672 | 16c655634094 | EXACT |
| TA-S31 | 1936-1949 | 610-623 | 14 | 761 | b52b040f6249 | EXACT |
| TA-S32 | 1965-2012 | 626-673 | 48 | 2855 | 7087818389f6 | EXACT |
| TA-S33 | 2019-2037 | 676-694 | 19 | 949 | bb40f4cd3b7f | EXACT |
| TA-S34 | 2049-2093 | 697-741 | 45 | 2531 | 08d4dc103370 | EXACT |
| TA-S35 | 2431-2440 | 744-753 | 10 | 486 | 0148b84525cd | EXACT |
| TA-S36 | 2483-2490 | 756-763 | 8 | 434 | 1214c18f98c0 | EXACT |
| TA-S37 | 2491-2547 | 766-822 | 57 | 3637 | 598d3467c1fe | EXACT |

## Writers: real composed-page PRE/POST comparisons

32 scenarios compare equal. Both versions were driven with the real approved page
template and real Today model, using synthetic injected lanes; PRE is the actual PRE
module compiled with its original dependency location. No rewritten writer model was
substituted. The existing food/problem cells additionally exercise real encrypted
synthetic hosts. Save-call counts below are calls to the lane; refused/throwing calls
are not falsely counted as committed operations.

Normal food payload: {cal:2200,pro:150}. Normal sleep payload:
{date:"2026-09-02",hours:7.5}, then precondition {supersedes:null}. The correction uses
supersedes="old-synthetic-op". The zero-hours case records hours:0. Successful save and
failed read-back are separate outcomes. Every recorded read/save/refresh trace is
byte-equal after JSON serialization between PRE and POST. The exact trace companions
are writers.json and writers-extra.json in scratch.

| Lane/input | Save calls | Error slot after settlement, before optional retry | PRE/POST |
|---|---:|---|---|
| food/success | 1 | <empty> | EQUAL |
| food/blank | 0 | Enter calories, protein, or both. Nothing was recorded. | EQUAL |
| food/invalid | 0 | Calories are recorded as a whole number between 0 and 20000. Nothing was recorded. | EQUAL |
| food/no-lane | 0 | <empty> | EQUAL |
| food/null-result | 1 | This intake could not be recorded on this device, and no part of it was recorded.  Your figures are still in the boxes above. Record them again, and if it keeps failing, report a problem from Today. | EQUAL |
| food/refuse | 1 | This intake could not be recorded on this device, and no part of it was recorded. The store's own reason: LOCAL_CLIENT_CLOSED. Your figures are still in the boxes above. Record them again, and if it keeps failing, report a problem from Today. | EQUAL |
| food/reject-read-ok | 1 | Earned could not tell whether this intake was recorded on this device. It may have been kept and it may not. The store's own reason: WRITE_FAIL. Nothing you entered is lost. Read today's record again below, or open Earned again on this device. | EQUAL |
| food/reject-read-fails | 1 | Earned could not tell whether this intake was recorded on this device. It may have been kept and it may not. The store's own reason: WRITE_FAIL. Nothing you entered is lost. Read today's record again below, or open Earned again on this device. | EQUAL |
| food/ack-unread | 1 | Earned could not read today's record back just now, so what is shown here may not be the whole day. The store's own reason: READ_FAIL. Nothing you entered is lost. Read today's record again below, or open Earned again on this device. | EQUAL |
| food/pending | 2 | <empty> | EQUAL |
| sleep/success | 1 | <empty> | EQUAL |
| sleep/blank | 0 | Choose times or hours asleep. Nothing was recorded. | EQUAL |
| sleep/invalid | 0 | Enter hours from 0 to 24, with up to two decimal places. Nothing was recorded. | EQUAL |
| sleep/no-lane | 0 | <empty> | EQUAL |
| sleep/null-result | 1 | Sleep could not be saved on this device. Nothing was recorded. | EQUAL |
| sleep/refuse | 1 | Sleep could not be saved on this device. The store's own reason: LOCAL_CLIENT_CLOSED. Nothing was recorded. | EQUAL |
| sleep/reject-read-ok | 1 | Sleep could not be saved on this device. The store's own reason: WRITE_FAIL. Nothing was recorded. What you typed is still here. | EQUAL |
| sleep/reject-read-fails | 1 | Checking whether sleep was saved. | EQUAL |
| sleep/ack-unread | 1 | Sleep was saved. The screen could not refresh. Open it again. What you typed is still here. | EQUAL |
| sleep/pending | 1 | <empty> | EQUAL |
| sleep/stale | 1 | This night changed while you were editing. Review the saved record before trying again. Nothing was recorded. | EQUAL |
| sleep/source | 1 | The check-in changed. Review its hours again. Nothing was recorded. | EQUAL |
| sleep/rollover | 0 | The date changed. Check which night this is for. Nothing was recorded. | EQUAL |
| food/pro-invalid | 0 | Protein is recorded as a whole number of grams between 0 and 1000. Nothing was recorded. | EQUAL |
| sleep/zero | 1 | <empty> | EQUAL |
| sleep/both-times | 0 | Enter both times. Nothing was recorded. | EQUAL |
| sleep/time-form | 0 | Enter valid times. Nothing was recorded. | EQUAL |
| sleep/same-time | 0 | For matching times, enter hours asleep instead. Nothing was recorded. | EQUAL |
| sleep/awake | 0 | Enter whole minutes awake within the time in bed. Nothing was recorded. | EQUAL |
| sleep/night-date | 0 | Choose a completed night. Nothing was recorded. | EQUAL |
| sleep/correction | 1 | <empty> | EQUAL |
| sleep/reject-landed | 1 | <empty> | EQUAL |

Both no-lane pages offer no working save entry; food uses stub-note and sleep uses
sleep-note for the storage explanation, not a fabricated successful error-slot outcome.
The exact no-lane slot observations were retained in writers.json. Sleep stale-night
refusal refreshes before painting; SLEEP_SOURCE_* uses the separate check-in-changed
sentence. Unknown food outcomes remain explicitly unknown. Unknown sleep outcomes
block saving until read retry settles them. A confirmed unread sleep save retains
ack={date:"2026-09-02",hours:7.5} and disables saving while read-back is owed.

The read-back scenarios also click the real retry controls once with refresh still
failing, then again after refresh recovers. Both versions match at each stage. An
initial probe used the wrong food retry slot; I corrected it to food-retry, required
that the control exist, and reran the comparisons before making this retry claim.

Representative complete external traces (the equality assertion includes every case):

```json
{"case":"food/success","trace":[["save",{"cal":2200,"pro":150}],["rows"],["rows"],["rows"]]}
{"case":"food/reject-read-fails","trace":[["save",{"cal":2200,"pro":150}],["rows"],["rows"],["rows"],["refresh"],["rows"],["rows"],["rows"],["afterFailedRetry","Earned could not tell whether this intake was recorded on this device. It may have been kept and it may not. The store's own reason: READ_FAIL. Nothing you entered is lost. Read today's record again below, or open Earned again on this device.",false],["refresh"],["rows"],["rows"],["rows"],["afterRetry","",false]]}
{"case":"sleep/stale","trace":[["rows"],["rows"],["rows"],["rows"],["save",{"date":"2026-09-02","hours":7.5},{"supersedes":null}],["refresh"],["rows"],["rows"],["rows"]]}
{"case":"sleep/reject-read-fails","trace":[["rows"],["rows"],["rows"],["rows"],["save",{"date":"2026-09-02","hours":7.5},{"supersedes":null}],["rows"],["rows"],["rows"],["refresh"],["rows"],["rows"],["rows"],["refresh"],["rows"],["rows"],["rows"],["afterFailedRetry","Checking whether sleep was saved.",true],["refresh"],["rows"],["rows"],["rows"],["rows"],["afterRetry","Sleep could not be saved on this device. Nothing was recorded. What you typed is still here.",false]]}
{"case":"sleep/ack-unread","trace":[["rows"],["rows"],["rows"],["rows"],["save",{"date":"2026-09-02","hours":7.5},{"supersedes":null}],["rows"],["rows"],["rows"],["refresh"],["rows"],["rows"],["rows"],["afterFailedRetry","Sleep was saved. The screen could not refresh. Open it again. What you typed is still here.",true],["refresh"],["rows"],["rows"],["rows"],["afterRetry","",false]]}
{"case":"sleep/correction","trace":[["rows"],["rows"],["rows"],["rows"],["save",{"date":"2026-09-02","hours":7.5},{"supersedes":"old-synthetic-op"}],["rows"],["rows"],["rows"]]}
{"case":"sleep/reject-landed","trace":[["rows"],["rows"],["rows"],["rows"],["save",{"date":"2026-09-02","hours":7.5},{"supersedes":null}],["rows"],["rows"],["rows"],["refresh"],["rows"],["rows"],["rows"],["rows"]]}
```

## Guard cases on the real factory

| Input | Observed unmodified behavior |
|---|---|
| Direct food/sleep hook, no listener | Both throw named WRITER-OUTSIDE-GESTURE before writer execution. No save; no painted refusal. |
| Synchronous click | Food save admitted; full-page sleep save admitted. |
| Synchronous submit and keydown | Admitted through hooks.listen; event type is not restricted to click. |
| Click then await Promise.resolve(), then food hook | Rejected promise with named exception; no save or new error paint. |
| Wrapped callback throws | finally decrements; subsequent direct writer still refuses; next honest click saves. |
| Wrapped callback returns rejected promise | Counter is already decremented; no permanent open/closed leak. |
| Two taps while save pending | Food synthetic dispatch calls save twice in both versions; sleep calls once. Native disabled-button behavior is not bypassed by the ordinary click method. |
| Retry after failed read-back | Food/sleep retry hooks are unguarded read entries. The real page retry works and the compared states match PRE. |
| Save continues asynchronously after entering synchronously | Its already-admitted promise completes normally; the guard checks entry, not commit-time stack depth. |
| Paint nested inside listener | Admitted, including a real durable synthetic food operation (F1). |
| Live lane facade save, no listener | Admitted by leaked host capability; one durable food and one durable sleep op (F7). |
| listen then unlisten same function/type | Removes the same wrapper; one observed callback across before/after dispatches. |

## Fourteen hand-designed rows: actual final hooks

The POST side uses the real hooks composed by today-app; the PRE side exposes the
original closure operations in a scratch-only observer. No modeled replacement hooks
stand in for POST. I awaited outstanding check-in paints before comparing traces; an
early probe which closed jsdom before its pending paint was corrected and is not a
product finding. Promise publication is checked before settlement.

| Row | Executed trace/invariant | Result |
|---|---|---|
| TA-W01 | Mutate hours after bind; recordSleep receives hours=7.25 and the same pending promise. | EQUAL |
| TA-W02 | Measure constructor runs once; the second hook returns the cached object. | EQUAL |
| TA-W03 | Import constructor runs once; the second hook returns the cached object. | EQUAL |
| TA-W04 | refresh starts, then a non-null foodSaving Promise is observable before it settles. | EQUAL |
| TA-W05 | The real food writer receives 2200/150, then publishes the same Promise synchronously. | EQUAL |
| TA-W06 | Publish view Promise; synchronous caller returns; forDate; paint. A second forced view read calls forDate again. | EQUAL |
| TA-W07 | Choose older night, clear correction/ack/readback/error; null choice restores default night with identical clock-read order. | EQUAL |
| TA-W08 | Cross clock midnight with a draft; keepNight retains 2026-09-02, then reads the same following-day check-ins. | EQUAL |
| TA-W09 | Even an early no-work sleep retry publishes a non-null Promise synchronously. | EQUAL |
| TA-W10 | Set correction true before paint; flag remains true afterwards. | EQUAL |
| TA-W11 | Set correction false before cancel paint; flag remains false. Draft-clear has its separate page witness. | EQUAL |
| TA-W12 | The real sleep writer saves date/hours and supersedes in the same order, then publishes its Promise. | EQUAL |
| TA-W13 | Before: check-in day and pending Promise. After forget: both null; stale completion cannot restore the invalidated handle. | EQUAL |
| TA-W14 | Non-adopting: replace ready synchronously, settled=true. Adopting: replace ready while settled=false, then athleteState -> adoptBasis. | EQUAL |

The adopting TA-W14 run is also EQUAL. Additional survivor-killing rows below use the
same hooks with non-null Promise assertions and a repeated forced read, rather than
inferring those requirements from function names.

## Single-clause product mutation table

Each mutation starts from the untouched source, applies exactly one replacement, and
runs these files serially: fence, food, problem (including sleep), check-in. Counts are
PASS/TOTAL. Baseline is 395/395, 56/57, 127/131, 28/28 respectively. KILLED means at least
one additional failure beyond the SAME environmental baseline; SURVIVES means no extra
failure in the runnable bar. It does not mean a clean whole suite.

| ID | Single clause | Fence | Food | Problem/sleep | Check-in | Verdict | Killing row or required added row |
|---|---|---:|---:|---:|---:|---|---|
| M01 | `gestures += 1;` -> `gestures += 0;` | 394/395 | 47/57 | 127/131 | 28/28 | KILLED | row 392 - E.6: a writer called from a real dispatch through hooks.listen is NOT stopped by the guard |
| M02 | `gestures -= 1;` -> `gestures -= 0;` | 395/395 | 56/57 | 127/131 | 28/28 | SURVIVES | after-listener direct call refuses |
| M03 | `if (!gestures) throw` -> `if (false) throw` | 393/395 | 56/57 | 127/131 | 28/28 | KILLED | row 391 - E.6: the two guarded writers THROW WRITER-OUTSIDE-GESTURE when called outside a gesture |
| M04 | `el.removeEventListener(type, wrapFor(type, fn))` -> `el.removeEventListener(type, fn)` | 394/395 | 56/57 | 127/131 | 28/28 | KILLED | row 394 - E.6: hooks.unlisten removes the SAME wrapper hooks.listen added |
| M05 | `return fn(ev);` -> `return fn();` | 395/395 | 56/57 | 127/131 | 28/28 | SURVIVES | keydown event is preserved |
| M06 | `facade: Object.freeze({` -> `facade: ({` | 393/395 | 56/57 | 127/131 | 28/28 | KILLED | row 384 - the big sealed module declares three Object.freeze wrappers, and the paint handle is frozen |
| M07 | `foodSaving = recordIntake(save, cal, pro, error);` -> `recordIntake(save, cal, pro, error);` | 395/395 | 50/57 | 127/131 | 28/28 | KILLED | row 33 - N1.5 - the screen records ONE operation, and reads it back from the engine |
| M08 | `sleepSaving = recordSleep(map);` -> `recordSleep(map);` | 395/395 | 56/57 | 107/131 | 28/28 | KILLED | row 70 - N2-05 / N2-14 - the screen records ONE op and reads it back off the ENGINE, with provenance |
| M09 | `sleepCorrecting = on;` -> `sleepCorrecting = !on;` | 395/395 | 56/57 | 127/131 | 28/28 | SURVIVES | correction/cancel state trace |
| M10 | `forgetCheckInRead: () => { sleepCheckInDay = null; sleepCheckInPending = null; },` -> `forgetCheckInRead: () => { sleepCheckInDay = null; },` | 395/395 | 56/57 | 127/131 | 28/28 | SURVIVES | in-flight old read cannot repaint after leave |
| M11 | `sleepNightChoice = raw;` -> `sleepNightChoice = null;` | 395/395 | 56/57 | 121/131 | 28/28 | KILLED | row 86 - N2-09 - D2 finding 2: the REAL gym host sees the night after a same-page save |
| M12 | `sleepNightChoice = sleepRollover \|\| sleepNightDate();` -> `sleepNightChoice = sleepNightDate();` | 395/395 | 56/57 | 127/131 | 28/28 | EQUIVALENT ON EXERCISED INVARIANT | keepNight uses held rollover |
| M13 | `sleepDraftHeld = draft;` -> `sleepDraftHeld = { ...draft };` | 395/395 | 56/57 | 106/131 | 28/28 | KILLED | row 70 - N2-05 / N2-14 - the screen records ONE op and reads it back off the ENGINE, with provenance |
| M14 | `mintMeasureScreen: (Screen) => { if (!measureScreen)` -> `mintMeasureScreen: (Screen) => { if (true)` | 395/395 | 56/57 | 127/131 | 28/28 | SURVIVES | measure constructor called once |
| M15 | `mintImportScreen:  (Screen) => { if (!importScreen)` -> `mintImportScreen:  (Screen) => { if (true)` | 395/395 | 56/57 | 127/131 | 28/28 | SURVIVES | import constructor called once |
| M16 | `retryFoodRead:     () => { foodSaving = retryFoodRead();` -> `retryFoodRead:     () => { retryFoodRead();` | 395/395 | 56/57 | 127/131 | 28/28 | SURVIVES | retry promise published before settle |
| M17 | `retrySleepRead:    () => { sleepSaving = retrySleepRead();` -> `retrySleepRead:    () => { retrySleepRead();` | 395/395 | 56/57 | 127/131 | 28/28 | SURVIVES | retry promise published before settle |
| M18 | `readSleepCheckIn(date, true)]).then(paint);` -> `readSleepCheckIn(date, false)]).then(paint);` | 395/395 | 56/57 | 127/131 | 28/28 | SURVIVES | forced cached checkin read re-runs |
| M19 | `repaint: (name, focus) => render(name, focus),` -> `repaint: (name, focus) => render("today", focus),` | 395/395 | 49/57 | 108/131 | 28/28 | KILLED | row 33 - N1.5 - the screen records ONE operation, and reads it back from the engine |
| M20 | `token: () => mountToken,` -> `token: () => 0,` | 395/395 | 56/57 | 125/131 | 28/28 | KILLED | row 91 - N2-05 - D2 finding 6: a save that resolves after the athlete has left does not steal the screen |
| M21 | `clearDraft: () => clearSleepDraft(),` -> `clearDraft: () => undefined,` | 395/395 | 56/57 | 127/131 | 28/28 | SURVIVES | success clears typed draft |
| M22 | `screenNow: () => screen,` -> `screenNow: () => "today",` | 395/395 | 55/57 | 126/131 | 28/28 | KILLED | row 51 - D2.3 - a store that REFUSES TO OPEN says its reason, not that the feature is unbuilt |
| M23 | `sleepTyped: (...a) => sleepTyped(...a),` -> `sleepTyped: (...a) => false,` | 395/395 | 56/57 | 125/131 | 28/28 | KILLED | row 110 - N2-04 R4 - the installation clock rollover requires confirmation |
| M24 | `settleAdoption:    (adopting) => { ready = settleAdoption(adopting ? adoptAthleteState() : Promise.resolve(), adopting); return ready; },` -> `settleAdoption:    (adopting) => { ready = settleAdoption(Promise.resolve(), adopting); return ready; },` | 395/395 | 56/57 | 125/131 | 28/28 | KILLED | row 38 - P0C.1 - completing setup adopts his own state in place, exactly as a fresh mount does |
| M25 | `sleepNightChoice = sleepRollover \|\| sleepNightDate();` -> `sleepNightChoice = SleepModel.nightDateFor(sleepToday());` | 395/395 | 56/57 | 125/131 | 28/28 | KILLED | row 110 - N2-04 R4 - the installation clock rollover requires confirmation |

M12 removes the explicit sleepRollover alternative but still calls sleepNightDate(),
which already returns that held rollover when no explicit choice exists. No harmful
reachable-state difference was demonstrated; calling it a coverage defect would
overstate the evidence. M25 replaces the entire choice with the new default date and
is killed by the existing midnight-confirmation rows.

The ten consequential survivors were independently executed against the proposed killing
rows, which are NEW findings about coverage:

| Survivor | Exact counterexample produced by mutant; baseline control | Smallest added row |
|---|---|---|
| M02 | After one keydown returns, ungestured food call saves once/no error; baseline zero/named refusal. | Same-instance after-dispatch guard check, also after throw/rejection. |
| M05 | keydown callback receives undefined; reading key throws. Baseline receives "Enter". | Assert original Event object reaches callback. |
| M09 | Correction observes false and cancel observes true before/after paint; baseline true/false. | Assert both flag and visible correction/cancel UI before save. |
| M10 | forgetCheckInRead leaves pending="Promise"; baseline pending=null. | Start a delayed read, forget, assert day AND pending null immediately. |
| M14 | Measure constructor called twice on consecutive hook calls; baseline once. | Constructor-count/cache-identity hook row. |
| M15 | Import constructor called twice; baseline once. | Constructor-count/cache-identity hook row. |
| M16 | retryFoodRead returns null instead of a Promise; baseline returns Promise. | Assert instanceof Promise and published identity before resolving a delayed read. |
| M17 | retrySleepRead returns null instead of a Promise, even on the async early-return path. | Same non-null Promise assertion for sleep. |
| M18 | Two view reads for same date make one forDate call; baseline two. | Repeat readSleepCheckInView and assert forced refresh precedes each paint. |
| M21 | Real page hours remains "7.5" after successful save; baseline empty. | Inspect draft/fields immediately after success, then reopen correction. |

## Fence: new Today rows and preserved Gym rule families

The untouched scanner is 395/395. gym-app.mjs is byte-identical PRE/POST. In
releasedRefusals, the old filename-specific Gym branch is replaced by a per-file lookup;
its site-count and set-of-receivers checks remain. I compared the function bodies and
ran the following single-clause plants against the final scanner. Multiple reported
failures can cascade through existing control tests; each row is ONE planted defect.

| ID | File / plant | Fence pass/total | Rule exercised |
|---|---|---:|---|
| F01 | today-app.cjs: `    void model;     const view = model.read();` | 394/395 | FENCE-MODEL-HELD at 33 |
| F02 | today-app.cjs: `    sleepRollover = null;     const view = model.read();` | 394/395 | FENCE-SEALED-BINDING-ASSIGNED |
| F03 | today-lanes.cjs: `  let gestures = 0; void "four ordinary words here";` | 393/395 | FENCE-COPY-IN-SEAL |
| G01 | gym-app.mjs: `  async function paint() { model.logSet({});` | 354/395 | FENCE-WRITER-NAME existing gym rules |
| G02 | gym-app.mjs: `  async function paint() { void model["save"];` | 356/395 | FENCE-BRACKET-KEY existing gym rules |
| G03 | gym-app.mjs: `  async function paint() { settingsRead = null;` | 394/395 | FENCE-SEALED-BINDING-ASSIGNED |
| G04 | gym-app.mjs: `  async function paint() { void settings;` | 356/395 | FENCE-HOLDER-SITE:settings |
| G05 | gym-app.mjs: `  async function paint() { void facade.lane();` | 356/395 | FENCE-LANE-ACQUISITION |
| G06 | gym-app.mjs: `  async function paint() { const { x } = settings;` | 356/395 | FENCE-CAPABILITY-DESTRUCTURE |
| G07 | gym-app.mjs: ``  async function paint() { void `${model.read()}`; `` | 356/395 | FENCE-TEMPLATE-CALL |
| G08 | gym-app.mjs: `  async function paint() { const Object = {};` | 356/395 | FENCE-BUILTIN-SHADOW |
| G09 | gym-app.mjs: `  async function paint() { void arguments;` | 355/395 | FENCE-ARGUMENTS |
| G10 | gym-app.mjs: `  async function paint() { void import("./food-host.mjs");` | 356/395 | FENCE-RELEASED-MODULE-EDGE |
| G11 | gym-app.mjs: `  async function paint() { doc.addEventListener("foo", () => {});` | 394/395 | FENCE-LISTENER-OUTSIDE-SHIM |
| G12 | gym-app.mjs: `const painter = ({ repaint: () => paint() });` | 393/395 | frozen gym painter |

All 15 plants refuse. The three requested Today cases are F01 (33rd model name),
F02 (released sleepRollover assignment), and F03 (four-word string in the seal). Gym
plants cover PUT multiplicity, bracket keys, sealed assignment, holder pin, lane
acquisition, holder destructuring, template calls, builtin shadowing, arguments,
module edges, listener count and frozen painter. The standing 395 rows additionally
retain their declared lexer/control/residue tests; this is a tripwire, not arbitrary
JavaScript data-flow proof.

## Composition and boot order

The painter has five frozen entries: repaint(name,focus), screenNow(), token(),
clearDraft(), paintTodayEntry(). createTodayLanes is called once. Its object parameter
has 22 names: doc/model/options/painter plus EIGHTEEN further injections, including the
12 copy values. sleepTyped is a deferred closure; sleepDraft is handed over after its
const initializer by bindSleepDraft. The actual handoff retains object identity:
post-bind hours="7.25" reaches the writer. M13's copied draft fails 21 additional sleep
rows, confirming that identity is load-bearing.

bootFoodDays, bootSleepNights, bootCheckInKit, bootAdoptionGate and bootSettleAdoption
remain at the released statement sites. This preserves the normal model's boot sequence
and ready/first-paint ordering in tested paths. It does not preserve the interleaving of
options.sleep evaluation with bootFoodDays: F2 is the executed exception. I found no
unexplained byte edit in a moved initializer; the changed location alone causes it.

## Facade getters: complete inventory

All 37 are functions on one frozen facade. The wrapper is frozen, not the objects
returned by these functions. "Live" below means the same held object/capability can be
returned, not that every getter is non-null on every page. I executed direct identity
and mutation probes for the populated food/sleep/readback/summary cases; the unused
screen/model capabilities are additionally classified from their actual return APIs.

| Getter(s) | Returned authority and consequences |
|---|---|
| checkInKit | Live mutable module-function table. Replacing its constructors/mount function changes subsequent rebind behavior; this can substitute a writer-bearing check-in model. |
| checkInLive | Live active check-in model: save(), host, draft() and draft setters. Can directly write through save or change what that writer will save. |
| checkin | Live injected entry with host and checkin model. Durable host/model capability and draft mutation remain reachable. |
| checkinSummary | The real entry returns its cached summary object. Mutating recorded changes later display decisions; no direct PUT method on the summary. Executed: recorded=false -> true. |
| foodLane | Live lane/host with save, refresh and rows. Direct durable write with no hook executed. Returned row objects and writable methods can alter subsequent writer behavior. |
| foodReadBack | Live acknowledgment/unknown metadata including entry and day. Executed: entry.cal becomes "9999". This is used to refill food controls, and can therefore change a later submitted payload. |
| importScreen | Live screen capability; actual object is shallow-frozen, but reopen/resetDraft mutate its closure and review/refusal getters expose structured state. No direct save method asserted here. READ for deeper review-object mutation effects. |
| measureScreen | Live screen capability; actual wrapper is shallow-frozen, but lane() exposes its lane after opening. Its paint also controls screen-local state. READ for a direct durable measure write in this review. |
| session | Live workout summary returned by the real entry. Executed: phase="fabricated" is read back. Changes presentation/routing conditions; not itself a durable command. |
| setup | Live setup entry: model/draft and host capabilities depend on the injected entry, including athleteState and admission-related state. Can affect subsequent adoption and setup writes. READ for direct setup PUT in this review. |
| sleepAck | Live acknowledgment. Executed hours=99 changes the next getter. Falsifies displayed committed hours; not a direct save method. |
| sleepCheckInRow | Live row plus nested answers. Executed sleep_hours=1 changes the held row. The released use-checkin action reads this value and source op id into the sleep draft, influencing a later attempted save; host source validation remains downstream. |
| sleepLane | Live save/host/rows capability. Direct durable write with no hook executed. Mutating rows changes supersedes/attempt inputs; replacing save changes behavior. |
| sleepReadBack | Live date/code metadata. Executed date="1900-01-01" persists through getter. Changes acknowledgment/retry context; no direct save method. |
| sleepUnknown | Live reconciliation attempt, including night, before[], supersedes and deviceId. Mutation can change which operation the retry treats as proof of a committed save. READ for an executed false-ack attack. |
| workout | Live workout entry, gym model/host/draft and recover method. Can write or affect later writes without a Today lane hook. This was available before the cut. |
| checkInKitLoading, foodOpening, foodSaving, ready, sleepCheckInPending, sleepCheckInViewPending, sleepOpening, sleepSaving, workoutRebinding | Nine raw Promise handles, not detached DTOs. A promise cannot be externally re-settled merely by holding it. Opening/loading/rebinding promises can resolve to live lane/kit/entry objects; then-method/observer effects are not a deep-immutability proof. |
| adoptionSettled, firstRun, foodLaneFailure, importAdmitted, setupFirst, sleepBusy, sleepCheckInDay, sleepCheckInFailed, sleepCorrecting, sleepErrorText, sleepLaneFailure, sleepNightDate | Twelve ordinary scalar/null results. firstRun and sleepNightDate compute reads rather than returning stored snapshots. Failure values are not runtime-type-validated against exotic injected error objects. |

Thus the most important writer-bearing results are foodLane, sleepLane, checkin,
checkInLive and workout; setup and opened measure-lane authority also merit narrowing.
The acknowledgment/cache results can affect displayed facts and future writer inputs even
without carrying a save method. The author describes S-R29 as mutable read state too
narrowly; the direct synthetic durable saves demonstrate the stronger capability.

## Seven author STOPs: debt versus behavior

| STOP | Measurement and disposition for PM |
|---|---|
| 1. One-handoff model rule not built | Honest debt: 32 bare model occurrences are a ceiling, not model isolation. Adding occurrence 33 is rejected by the fence. The released weigh-in capability remains. No moved-body delta; F2 is a separate composition timing change. |
| 2. B.6 outcomes not built; 12 copy values injected | Honest preservation of PRE's sentence code. All food/sleep refusal-code branches and late-refusal cases were compared with PRE. The maps are frozen and other values are strings in the real app. The earlier object-to-string defect is avoided. This is still not B.6 implementation. |
| 3. Hooks take DOM nodes | Honest PRE-preserving debt. recordIntake retains save/cal/pro/error identity and order; recordSleep still accepts map, although its moved writer does not use map to obtain the draft. Final hooks publish the original promises synchronously. |
| 4. G1/settings writer and start-in-paint untouched | Honest scope boundary: gym-app.mjs is byte-identical between PRE and POST. All tested Gym fence families still reject their respective plants. No claim that the existing start-in-paint behavior was fixed. |
| 5. Gesture guard covers 2 of 9 subjects | Honest coverage count; the guard is NEW logic. Current synchronous save listeners work, direct calls throw, async continuation calls throw without paint, and nested paint can write. F1/F8 qualify the claim beyond the reported count. Five Gym subjects plus submitWeighIn and recoverWorkout remain outside this guard. |
| 6. In-flight guard not extended | Honest nonimplementation, with an inaccurate report rationale. Food double-dispatch and sleep paint-failure behavior are unchanged. sleepBusy is not set at the first statement and has no finally reset; a gesture counter is not a duplicate-write lock. |
| 7. Two of four predicted test edits | Honest correction to the prediction. The two source-slicing tests now read today-lanes.cjs. The measure/import dynamic imports still reside in today-app.cjs, and package.test.cjs is unchanged. These edits do not weaken an assertion; full package/build success was not available in this sandbox. |

## Standing cells and environment

At the untouched head and at the overlay control: fence 395/395; food 56/57;
problem 127/131; check-in 28/28. N2 sleep cells are in problem.test.mjs, not in a separate
sleep.test.mjs. I ran complete individual files, never the whole today step. Primary
cell/probe processes were serial. The fence and instrument cells themselves use their
existing synchronous child-process checks; I did not run concurrent primary Node jobs.

The five unavailable build rows are food N1.17 and problem R3 inventory, R3 injected
build name, N2-16, and S6C.7b. Their esbuild diagnostic is:
`Cannot read directory "../../../..": Access is denied.` and
`Could not resolve .../rebuild/m3/w7-preview/today/today-entry.mjs`.
These are not the author's two claimed known whole-step reds, and I do not substitute
one set for the other. No suite failure was silently counted as a pass.

eslint-scope did not resolve through the worktree's root node_modules junction, or the
W6 resolver. I did not install anything or touch node_modules. Node's own bundled Acorn
8.17.0 and acorn-walk were loaded into scratch to execute cut/parser rows. The remaining
scope-dependent rows (instrument 12,13,14,16), census, capture and generator execution
cannot be credited. The final instruments cell is 20/26 at both refs, not 26/26.

Mutation copies live outside the worktree. A preload redirects only the selected CJS
source read/compilation to its scratch copy and redirects build outputs into scratch;
all assertion bodies remain unchanged. Each run starts a fresh process. A compilation
marker verifies the targeted CJS product was loaded. Gym probes use the fence's real
source scanner; Gym ESM behavior was not replaced by that CJS preload. Native esbuild
is outside the preload and remains blocked, so these results explicitly do not cover a
mutant browser bundle. The initial untouched baseline attempted the normal ignored
build directories; subsequent baseline/mutation runs redirected those outputs.

For the instrument-cell scratch copy, only root discovery, explicit git path arguments
and scratch-directory placement were adapted. No assertion, expected count, checker or
refusal was changed. Seven applicable original generator witnesses were run at both
refs. The old G04 sleepOutcome-to-sleepErrorText mutation is MOOT because the final
RENAME map already omits that rename. The generator is not invoked by this cell; all
seven retain the exact baseline failures, so F3 remains a coverage finding.

Every test command used this Node executable, with the environment set on separate lines:

```powershell
$env:MEASURED_TEST_NOW = '2026-09-03'
$env:TZ = 'America/New_York'
& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' <one-cell-or-probe>
```

Scratch evidence is retained at
C:/Users/joeym/AppData/Local/Temp/earned-astra-part2-probes-20260919/.
Key evidence probes: pure-move.cjs and pure-token-check.cjs; writers.cjs and writers-extra.cjs; hooks.cjs,
hooks-adopting.cjs and hooks-extra.cjs; blind-probes.cjs; durable-facade.cjs;
busy-paint-failure.cjs; getters.cjs; earlier-execute.cjs and earlier/return-current.json;
mutation-setup.cjs, extra-mutations.cjs, overlay.cjs and run-mutants.ps1.
The JSON/log companions retain exact inputs, traces and per-cell failure names.
No scratch deletion was attempted, so there is no refused-delete retry or unlisted
cleanup target. The report is the only deliverable in the worktree.

## What I did not verify

- The scope census, binding-capture proof and actual gen-interface generation with
  eslint-scope. Four missing-dependency test failures remain, plus the two stale-count
  assertion failures described above.
- Native browser build, phone/Safari behavior, trusted hardware gesture provenance,
  keyboard default button activation, a browser process-kill/restart, or sleep-check.mjs.
  The submit/keydown dispatch probes test the shim, not a browser's native default action.
- The whole today step, full conformance suite, S8/reseal package, CI, a merge or a deploy.
- Any athlete's real data, any private fixture, any protected soak or forbidden path,
  any auth file, or any account/network write. All saved operations used synthetic
  fixtures in an in-memory fake IndexedDB installation.
- Exhaustive arbitrary JavaScript data flow through the facade, async painter failures,
  every possible injected callback, or every possible operation rejection code. All
  seven sleep validation codes, all three food validation codes, and the distinct
  implemented late-refusal/reconciliation branches listed above were exercised; the
  generic host-error branch does not imply enumeration of every possible code string.
- A false-ack exploit through sleepUnknown or deep import-review mutation. Those
  getter consequences are explicitly READ, not executed findings.

## Blind-order checkpoint (historical)

Before opening earlier reviews I recorded B1 boot-order change, B2 nested-paint admission,
B3 async continuation refusal, B4 live food facade save, B5 inherited food double-dispatch,
and the 34-region/679-line byte match in this file. Earlier reviews were opened only
after that write. Their comparison changed the live-facade and duplicate-write labels
to ALREADY KNOWN; it did not originate the new counterexamples. Later observations and
final classifications above supersede the initial IN PROGRESS wording.

## Final workspace checks

The last shell commands, in order, were:

```powershell
git status --porcelain
git diff --stat -- rebuild/lanes/astra/reviews/TODAY-SPLIT-PART2-BLIND-REVIEW.md rebuild/m3/w7-preview/today rebuild/lanes/c/today-split-spike rebuild/lanes/c/today-split
```

Their complete combined output (including stderr) was:

```text
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
?? rebuild/lanes/astra/reviews/TODAY-SPLIT-PART2-BLIND-REVIEW.md
```

Exit code: 0. git diff --stat produced no change-stat lines. The sole status entry is
this untracked report; untracked files do not appear in git diff --stat. This output
was inserted into the report after those commands; no subsequent shell command ran.
