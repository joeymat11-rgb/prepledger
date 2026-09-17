# LOCAL-CAPTURE-START-RESUME - INDEPENDENT REVIEW R1 (Opus, high)

**VERDICT: ACCEPT.** Candidate 4207696 on base 78911ad1, reviewed in my own detached worktree, with a second worktree at the unmodified base for the red side. Every figure below I measured; none is taken from the author report.

## 1. THE CAUSE, REPRODUCED BY ME AT THE BASE

My own cell, my own synthetic data, BOTH dates (2026-11-20 EST -05:00 and 2026-10-16 EDT -04:00), one IDBFactory and one installation each, real gym host and card model, a real bundle sealed by the real `port.cjs`: enrol, record one complete native workout, import answering **Yes**.

* AT THE BASE: `admitted=false`, `codes=['LOCAL_SOURCE_WORKOUT_UNRESOLVED']`, both seasons. RED with the Yes already given, so the answer was never the thing that was missing.
* THE MECHANISM, measured on the stored operation: the capture the gym card writes carries `profile === 'earned/workout-prescription/v2'`; the v1 reader admission installed **throws `WORKOUT_CAPTURE_INVALID`** on it, and the source-aware reader reads it. The author's cause is right; the base's stated reason ("prescribed from the pre-import athlete") was not the mechanism.
* AT THE CANDIDATE the same cell ADMITS on both seasons: `workout_facts.order.start_ids = [the native Start]`, its `effective.local_date` is the season's day, `workout_baseline.session_log` is exactly the three imported days.

`engine-order.cjs:40` fails when `current.included!==true||current.issues.length` - a law about a clean start record, not about the athlete's answer. Untouched.

## 2. NO LAW, GUARD OR TEST WEAKENED

* `capture.cjs:92` - `read()` takes v1 under either profile and v2 only under the source profile. The new reader is a strict superset; nothing relaxed.
* The projection lane matches the page exactly: `today-bindings.mjs:411-412` gives `workout-host.mjs:167-168` only a `nullSelection` registrar, and the page's own basis is `createNullLaneWorkoutBasis` (`today-bindings.mjs:397`). Admission composes that same single lane. Not a stub, not a wider reader.
* The new gate's condition (file workouts > 0 AND native Starts > 0) is the very condition the review already publishes as `prefix_required` (`source-admission.mjs:136`) and that `mixed` already used. Nothing that admitted before now refuses.
* Every touched test diffed. No assertion deleted: each removed one has its successor rule written where it stood (`writer-order.test.mjs` moves the session writer to the stronger ADMITS branch, 192-205; `local-source-admission.test.mjs` replaces one `assert.rejects` with three stronger checks including nothing-written; the three `integration_pending` pins stay exact, at `[]`).
* No `rebuild/engine` byte and no `engine-order.cjs` byte in the diff.

## 3. DRIFT - MY OWN MEASUREMENT

`git diff --name-only 78911ad1 HEAD` gives **10** paths, each findstr'd against `packages/S5.json` (forward-slash keys, sanity-checked by matching the sealed sibling `rebuild/m3/w6/local/today-bindings.mjs`, which this branch does not touch). **All ten undeclared, none sealed:** `lanes/c/P3-RUNBOOK.md`, `lanes/d/CAPTURE-START-RESUME-AUTHOR-REPORT.md`, `lanes/d/p3-capture-start/capture-start.test.mjs`, `lanes/d/p3-replay-all/writer-order.test.mjs`, `m3/w6/local/source-admission.mjs`, `m3/w6/test/local-source-admission.test.mjs`, `m3/w6/test/local-source-consumer-browser.mjs`, `m3/w6/test/local-source-consumer.test.mjs`, `m3/w7-preview/import/test/support.mjs`, `m4/import/replay-registry.cjs`. All ten LF-only; zero U+2013/U+2014 on any added line.

## 4. FINDINGS

**MAJOR 1 - bar (a)'s consumer claim is proved from the admission view, not the consumer.** I measured what Today adopts after a pre-import workout admits: `admittedLocalSourceBasis(...).sessionLog` is the three imported days and nothing native, both seasons. The native workout reaches the card by another path (`gym-model.mjs:215`, `workoutFacts` from the host's own projection) that no cell here exercises. My control (record-then-import vs import-only, same day, same card) gives identical phase, code and loads, so nothing is broken - but "in order, the native one after the prefix" is not measured where the athlete sees it. R2: one cell reading the native session back off the card, or reword the claim to what is proved.

**MAJOR 2 - the mirror cell cannot carry the weight put on it.** `interpretation_digest` and `order_map_digest` are exactly the members holding where the native Start sits, and both are on `MIRROR_DIFFERS`; the `adopted(a) deepEqual adopted(b)` comparison is over the imported replayed state only, so it is satisfied by two installations that both hold only the imported history. P3-CSR5 would still pass if B's workout were dropped entirely. The re-reasoning ("the literal basis digest cannot hold") is honest and right; the substitute is insensitive to the thing under test. Not blocking, because P3-CSR1/CSR2 carry bar (a)'s substance.

**MINOR 3 - `ORDER_EVIDENCE_REQUIRED` unreachable through this controller** (STOP 2, confirmed): law `local-source-order.cjs:27`, cell `local-source-order.test.cjs:9`, mutant needle `m4/import/test/s3/mutations.cjs:283`. Not a weakening - the refusal moved earlier and is named - but controller-level coverage is gone and the harness that kills the mutant is named in NO package (I checked every `lanes/b/tooling/packages/*.json`).

**MINOR 4 - the S3 portable manifest gains one stale pin.** Measured both ways: the BASE already carries 5 (`client/copy.cjs`, `client/index.cjs`, `w6/local/import-bundle.mjs`, `w6/local/local-client.mjs`, `w6/local/source-admission.mjs`); the candidate carries 6, adding `w6/test/local-source-admission.test.mjs`. Pre-existing, disclosed, in no CI step. For S6/PM, not this round.

**MINOR 5 - the report's drift statement says "9 paths" and then lists 10.** It is 10.

**MINOR 6 - the harness default changed under every existing cell.** `admit()` went from sending no `prefixAnswer` to sending `prefixAnswer: true`, so each pre-existing admission cell now asserts the identity Yes without saying so. Documented in the helper, and the product re-checks the Yes against the records, so nothing is waved through; still a re-baseline worth naming.

**NOTE 7 - import first, train, then reopen/rollback.** `order_map` is null when `mixed` was false at select time, so `answer` is `undefined` and replay refuses `LOCAL_SOURCE_WORKOUT_UNRESOLVED`. Identical to the base (the v1 reader threw there too) and NOT athlete-reachable: `reopen`/`rollback` have no product caller outside `reconcile()` (checked `browser-entry.mjs` and `today-bindings.mjs`). Name it before the Import route lands.

**NOTE 8 - the new pre-check 8 points at "the identity question on the Import screen"** while item 6 of the same runbook records that the phone has no Import screen yet. The contract is real (`prefix_required` / `prefix_question`, `source-admission.mjs:136-137`) and `resumeRequired` is the identical condition, so P3-IMPORT-UI-2 has what it needs; carry the obligation to pass `prefixAnswer` into `prepareSource` into that ticket.

**NOTE 9 - I executed a cell the author edited but did not report running.** `local-source-consumer-browser.mjs` is referenced by no runner in the tree. With `W6_BROWSER_BIN` set to the installed Edge: `P2 CONSUMER-BROWSER PASS - 20 checks in real Edge; sealed by the real port, unsealed through C2b custody, admitted, visible on Today and the gym card, and still there after a force-kill`

## 5. SUITES I RAN MYSELF (verbatim tails, `TZ=America/New_York`)

```
W6            rebuild/m3/w6/test/*.test.mjs             tests 586  pass 586  fail 0
lane D        rebuild/lanes/d/**/*.test.mjs             tests  98  pass  98  fail 0
import+adm    w7-preview/import/test + m4/import/test   tests 101  pass 101  fail 0
today+measure w7-preview/{today,measure}/test           tests 656  pass 656  fail 0
coach         rebuild/coach/test                        tests 231  pass 231  fail 0
client        rebuild/client/test                       tests  18  pass  18  fail 0
port          rebuild/m3/setup/port/test                tests  65  pass  65  fail 0
rig187 => PASS  - SUITE GAP: both subjects are 35 GREEN under run.cjs; B-durability never restarts from the store (law-edit candidate for suite v4)
A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-9e4ee5b587c2
A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256; cache name earned-slice-f251f062a5e9f98551c7e9ea7c5e69da
b-package --ci --package S5  EXIT 0
B PACKAGE S5 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP; required evidence missing or failed; local diagnostics withheld
MY OWN CELLS  base 78911ad1 RED   tests 2 pass 2 fail 0  (both seasons REFUSE)
MY OWN CELLS  candidate GREEN     tests 4 pass 4 fail 0  (both seasons ADMIT)
```

**A1 AND S5 CHECKED AGAINST THE BASE MYSELF.** Run in the base worktree, the A1 build id is `earned-9e4ee5b587c2` with the same 121 pinned inputs, so NO page byte moved; and the S5 line at the base is the same `SEAL-BASE-IS-NOT-THE-CHAIN-TIP` at exit 0, so that refusal is the branch's chain position and not this change. Both author claims hold.

Where my counts differ from the author's (lane D 98 vs 66, today 656 vs 666) it is the glob, not the result. The sub-directory suites `w6/test/import-custody` and `w6/test/recovery-stage` fail 8 of 28 at the candidate AND 8 of 28 at the base; they are outside the W6 586 suite and are not this ticket's.
