# LOCAL-CAPTURE-START-RESUME - FINAL REVIEW R3 (Fable, DECISIONS:439)

**VERDICT: ACCEPT.** Candidate 4207696 on base 78911ad1, reviewed in my own detached worktree (%TEMP%\earned-csr-rv) with my own clean base worktree (%TEMP%\earned-csr-rvb at 78911ad1) for the red side. Every figure here I measured; none is taken from the author report or from R1. Synthetic data only: my own sealed bundles from the accepted constructor, my own installation scope, my own dates.

## 1. RED AT THE BASE, GREEN AT THE CANDIDATE, ON MY OWN DATES AND MY OWN admit()

My cell (22 tests, RV-R3-1..7, one IDBFactory and one installation per case, the real setup lane, the real Measure host, the real gym host and card model, the S4 live clock ADVANCING between days, my own execution calendar, my own call sequence reviewSource -> prepareSource -> publish -> reconcile -> view) on summer 2026-10-30 Fri U / 2026-10-31 Sat L (EDT, every op stamped -04:00) and winter 2026-11-06 Fri U / 2026-11-07 Sat L (EST, -05:00):

* BASE, the Yes given: `admitted=false`, codes `['LOCAL_SOURCE_WORKOUT_UNRESOLVED']`, families answered F4, F7, F6 and no F3, both seasons. The answer was never what was missing.
* CANDIDATE, the same cell: ADMITS both seasons. `workout_facts.order.start_ids` = the native Start alone; `incomplete_sessions` empty; its `effective.local_date` is the season's day and is after the file's last workout; `workout_baseline.session_log` and `state.sessionLog` are exactly the three imported days (the native day is NOT absorbed into the log); `order_map.assertion.answer===true`, `native_root_id` = the Start; F3 `{state:'projected', start_ids:[start]}`; `integration_pending` `[]`; the adopted state carries the imported loads and days; the trial day one (Measure `trialStart()`) is the enrolment day before and after; the op count is unchanged (nothing minted).
* TWO workouts on two days with the clock moved between them: both admit, `start_ids` in device order, dates ascending, both after the prefix.
* The Yes that is NOT TRUE (my own seals whose last workout is ON the native day and the day AFTER it): refuses `LOCAL_SOURCE_WORKOUT_UNRESOLVED` naming exactly the Start, F3 projects nothing, `applied=false`, `basis=false`, op count unchanged, nothing adopted, `retractImport` leaves `imports=[]` and the same op count.
* No, absent, the string `'yes'` and the number `1`: all refuse by the same name (`prefixAnswer!==true` is a strict identity), nothing written, the entry stays `rebaseRequired` and retracts clean.
* Reopen and rollback of the admitted import replay under the recorded answer: `ready=true`, the same `start_ids`, the basis record deepEqual.

Mechanism, checked in the code: `capture.cjs:92` reads v1 under either profile and v2 only under the source profile, so the reader the candidate installs is a strict superset; the projection lane it composes is the page's only lane (`today-bindings.mjs:397`, the null lane). `engine-order.cjs:40` is untouched and still refuses any Start whose record carries an issue.

## 2. NOTHING WEAKENED, NO ENGINE BYTE, DRIFT CONFINED

* `git diff --name-only 78911ad1 HEAD -- rebuild/engine rebuild/m4/workout/engine-order.cjs` is empty.
* Drift: 10 paths, each checked against `packages/S5.json` by script (sanity: the sealed sibling `rebuild/m3/w6/local/today-bindings.mjs` IS found in the file). All ten UNDECLARED, none sealed, all LF, zero U+2013/U+2014 on any added line: `lanes/c/P3-RUNBOOK.md`, `lanes/d/CAPTURE-START-RESUME-AUTHOR-REPORT.md`, `lanes/d/p3-capture-start/capture-start.test.mjs`, `lanes/d/p3-replay-all/writer-order.test.mjs`, `m3/w6/local/source-admission.mjs`, `m3/w6/test/local-source-admission.test.mjs`, `m3/w6/test/local-source-consumer-browser.mjs`, `m3/w6/test/local-source-consumer.test.mjs`, `m3/w7-preview/import/test/support.mjs`, `m4/import/replay-registry.cjs`.
* Every touched test diffed. No assertion removed without its successor rule written where it stood: `writer-order.test.mjs` drops the session writer's `refusal` so it takes the STRONGER branch (admits, F3 answers, Today reads the imported history, the card still reads what it wrote); `local-source-admission.test.mjs` replaces one `assert.rejects(ORDER_EVIDENCE_REQUIRED)` with the named earlier refusal on No AND on absent, each with a nothing-written deepEqual of the generation; the three `integration_pending` pins are exact at `[]`. The new gate fires only when the file holds workouts AND the installation holds native Starts, the very condition `prefix_required` already publishes at review, so nothing that admitted before now refuses.
* The identity question stays the ONLY guard and stays the athlete's: the accepted Import screen (origin/rebuild/c-p3-import-ui-2, `import-screen.mjs:368`) asks it verbatim BEFORE custody and sends `{identityConfirmed:true, prefixAnswer:true}` on Yes, nothing on No. The candidate's contract and that screen agree.

## 3. FINDINGS

**MAJOR 1 - bar (a) "the gym card shows the imported history AND the native workout, in order" is not true at the card on any later day, and the runbook's "nothing remains" overstates.** Measured on the ADOPTED basis exactly as the page composes it: on the import day the card reads `finished` and `readWorkoutHistory` lists the native session once, closed, on its own day (not dropped, not duplicated); on the NEXT scheduled day the card is `blocked` with the engine's own `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED` (`performed.cjs:176-183`: a legacy log plus native facts needs `legacy_baseline` and an `import_anchor` that nothing in the page composes). My mirror install (import first, then train on the adopted basis) is blocked by the same code on the same day, so this is the open engine boundary B-LOM (DECISIONS:102, :103, :425; pinned by `gym.test.mjs` "an athlete carrying a LEGACY session log ... is refused a second session outright"), not this ticket's defect and not a regression. But it is the critical-path fact for an athlete who trains daily: with or without this ticket, once his imported history and one native workout coexist, the gym card refuses every later scheduled day until B-LOM lands. For the PM: schedule B-LOM before or with the port, and give the runbook that one sentence in place of "there is NO ordering instruction left"; the author report's (a) should say what it proved (the admission view and the adopted state), not the card.

**MAJOR 2 - the mirror cell (P3-CSR5) cannot carry bar (a)'s digest claim** (R1 MAJOR 2 stands; the sha did not move). `adopted(a) deepEqual adopted(b)` compares the imported replay only and would still hold with B's workout dropped; the two members that hold the native Start's position (`interpretation_digest`, `order_map_digest`) are on the differ list by construction. And the "same workout" is not the same record either: my mirror shows A's pre-import session prescribed at 20/50 lb (the clean-init athlete) and B's post-import session at 45/80 lb (the adopted basis), which is the truth of what he did in each order and is right, but it means the literal "basis digest equals" can never hold; the re-reasoning is honest, the substitute is weak. Not blocking: RV-R3-1/2 and P3-CSR1/2 carry the substance.

**MINOR 3 - `b-package --ci --package S5` exits 1, not 0, on this branch.** Measured with the exit code captured inside the script, on the candidate and on the clean base: `B PACKAGE S5 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP`, EXIT 1, byte-identical output both sides. The reason is the chain position: origin/rebuild/t2-client-core is now c6b6d50 (it contains 78911ad1), and `b-package.cjs:2600` requires the tip in HEAD's first-parent chain. The same change cherry-picked onto c6b6d50 (b751c58, clean) prints `B PACKAGE S5 PUBLIC CI EVIDENCE PASS`, EXIT 0, so bar (g) holds on the rebased branch. The author's and R1's "EXIT 0" beside a FAIL line was a mis-read exit code.

**MINOR 4 - carried, all confirmed, none new:** `ORDER_EVIDENCE_REQUIRED` is unreachable through this controller (the law and its mutant stand at `local-source-order.test.cjs`); the harness default moved every existing admission cell to an implicit Yes (documented, re-checked against the records by the product); the S3 portable manifest gains one more stale pin; the report says "9 paths" and lists 10.

**NOTE 5 - import first, train, then reopen/rollback** replays with `order_map` null, so the answer is `undefined` and the review comes back `ready:false` with `LOCAL_SOURCE_WORKOUT_UNRESOLVED` (measured, both seasons; the adopted basis is untouched). Identical to the base and reached by no product caller today; it becomes reachable the day something reopens an admitted import after training, so name it in that ticket.

**NOTE 6 - A1 checked against the base myself:** build `earned-9e4ee5b587c2`, 121 pinned inputs, identical in both worktrees: no page byte moved.

## 4. SUITES I RAN MYSELF (verbatim tails; TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03)

```
W6            rebuild/m3/w6/test/*.test.mjs                        tests 586  pass 586  fail 0
lane D        rebuild/lanes/d/**/*.test.mjs (+ my 22)              tests 120  pass 120  fail 0
import+adm    w7-preview/import/test + m4/import/test              tests 101  pass 101  fail 0
today-17 + 4  the rebuild.yml argv, by name                        tests 666  pass 666  fail 0
coach         rebuild/coach/test/*.test.cjs                        tests 231  pass 231  fail 0
client        rebuild/client/test                                  tests  18  pass  18  fail 0
port          rebuild/m3/setup/port/test                           tests  65  pass  65  fail 0
rig187 => PASS  - SUITE GAP: both subjects are 35 GREEN under run.cjs; B-durability never restarts from the store (law-edit candidate for suite v4)
A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-9e4ee5b587c2
A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256; cache name earned-slice-f251f062a5e9f98551c7e9ea7c5e69da
b-package --ci --package S5 (candidate AND base): B PACKAGE S5 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP; required evidence missing or failed; local diagnostics withheld  EXIT 1
b-package --ci --package S5 (candidate on the current tip c6b6d50): B PACKAGE S5 PUBLIC CI EVIDENCE PASS  EXIT 0
MY OWN CELLS  base 78911ad1  RV-R3-1 x2 RED as expected   tests 2  pass 2  fail 0
MY OWN CELLS  candidate      RV-R3-1..7                   tests 22 pass 22 fail 0
```

The cell file is not committed (a reviewer's instrument, not product); its runs are recorded above.
