# LOCAL-CAPTURE-START-RESUME - AUTHOR REPORT (lane D)

`rebuild/d-capture-start-resume` on `origin/rebuild/d-p3-replay-all` 78911ad1. NO `rebuild/engine` byte and NO `engine-order.cjs` byte touched. Nothing weakened.

**1. THE CAUSE, MEASURED.** I instrumented the swallowing catch in `replay()` and the projection under it and ran P3-WO1[session] on a real installation: `INNER WORKOUT_ORDER_START_INTERPRETATION_REQUIRED at engine-order.cjs:40`, with `start_record` = `{"included":true,"issues":["ORIGINAL_CAPTURE_UNINTERPRETABLE"]}`. `included` was ALREADY true. The one issue came from `stored-history.mjs:57`, where `prescriptionCapture.read()` threw: admission built the v1 capture reader while `today-bindings.mjs:234` prescribes through `Capture.SOURCE_PROFILE` with the w5 codec. Admission could not read the captures the page itself writes, so EVERY native Start was uninterpretable; the pre-import order is just the only one that puts a native Start inside the generation admission replays. `engine-order` refused correctly: handed a record with an issue, it would not invent an interpretation.

**2. WHAT LANDED** (one product file, `m3/w6/local/source-admission.mjs`).
(i) F3 reads with the SAME source-aware profile the page writes with, and composes the accepted NULL projection lane the page composes (the source-aware adapter refuses to exist without a registered consumer; not a stub). `read()` is a closed historical dispatch, so v1 captures still read unchanged - a superset, proved by every existing v1 cell staying green. Both imports are already in the page boot graph; A1 is byte-identical (4).
(ii) `prefixAnswer` is carried into `replay()`, and the prescription is named at the line that applies it. Required exactly when the file holds workouts AND the installation holds native Starts - the same condition `mixed` already uses, so no other case changes. The answer must be `true`; absent or `false` leaves the interpretation unstated and F3 refuses `LOCAL_SOURCE_WORKOUT_UNRESOLVED`, writing nothing. A Yes must also be TRUE of the records: every native Start must be dated strictly after the file's last workout day, else the same code NAMING that operation. On reopen/rollback the answer comes from the selection's own order-map assertion, so nothing is re-asked on his behalf.
(iii) `integration_pending` becomes `[]`, with the new reason where the old stood. `m4/import/replay-registry.cjs`: both F3 rules re-stated in place.

**3. CELLS** - executed, stub-free, synthetic, real hosts, ONE IDBFactory and ONE installation per case, EST -05:00 and EDT -04:00, on the S4 LIVE clock because a pinned clock stamps -05:00 year round (asserted per operation in the cell). `rebuild/lanes/d/p3-capture-start/capture-start.test.mjs` 14/14.
(a) P3-CSR1 x2: enrol, Measure day one, one complete workout through the real gym host, import with Yes -> ADMITS; F3 projected; `order.start_ids` is the native Start; `workout_baseline.session_log` is exactly the three imported days; the Start's date is after the file's last; Today and the gym card read the imported loads, history and readings; day one unchanged; no operation minted.
(b) P3-CSR2 x2: two workouts before the import - both admit, both after the prefix, in the order the device wrote them.
(c) P3-CSR3 x4: the file's last workout ON his day, and the day AFTER it - refuses by name, NAMES the Start, commits nothing, `retractImport` leaves no residue.
(d) P3-CSR4 x4: a No, and the question never answered - refuses by name, no basis, no operation, nothing for Today to adopt, clean retract.
MIRROR P3-CSR5 x2: `admittedLocalSourceBasis` deepEqual member for member both ways, day one equal. The basis RECORD cannot be identical; the six members that differ are asserted BY NAME (`era_id`, `checkpoint_digest`, `local_selection_id`, `operation_digest`, `interpretation_digest`, `order_map_digest`) because B does not hold the workout when it admits. The bar's "basis digest equals" is answered for the state he stands on and measured, not claimed, for the record itself.
(e) RE-REASONED IN PLACE, never deleted: `writer-order.test.mjs` P3-WO1[session] now takes the ADMITS path with the real cause written where the old note stood; `local-source-admission.test.mjs` S3-Q-F3 and S3-Q-MIXED-PREFIX (its `ORDER_EVIDENCE_REQUIRED` rejection replaced by the earlier NAMED refusal plus the absent-answer case and a nothing-written check); `local-source-consumer.test.mjs` P2-W4 and `local-source-consumer-browser.mjs` pin `integration_pending` as `[]`. Harness (undeclared): `admit()` takes `prefixAnswer` and tells an explicitly absent answer from the default Yes; `sealInventedBundle` takes the file's own workout days (default byte-identical); two EDT calendar days; the refusal path returns the custody name. No figure was changed anywhere else.

**4. TAILS (verbatim).**

```
W6 tests 586 pass 586 fail 0 | lane D tests 66 pass 66 fail 0 (capture-start 14/14)
import+admission tests 101 pass 101 fail 0 | today-17 tests 666 pass 666 fail 0
coach tests 231 pass 231 fail 0 | client tests 18 pass 18 fail 0 | port tests 65 pass 65 fail 0
rig187 => PASS
A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-9e4ee5b587c2
A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256; cache name earned-slice-f251f062a5e9f98551c7e9ea7c5e69da
b-package --ci --package S5, EXIT 0:
B PACKAGE S5 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP; required evidence missing or failed; local diagnostics withheld
```

That S5 line is byte-identical on the unmodified base (measured by stashing): the refusal is the branch's position in the chain, not this change. A1's build id and all 121 pinned inputs equal the base, so NO page byte moved.

**5. DRIFT** - 9 paths (`git diff --name-only origin/rebuild/d-p3-replay-all HEAD`), each findstr'd against `rebuild/lanes/b/tooling/packages/S5.json`. ALL NINE UNDECLARED, NONE SEALED: `lanes/c/P3-RUNBOOK.md`, `lanes/d/CAPTURE-START-RESUME-AUTHOR-REPORT.md` (new), `lanes/d/p3-capture-start/capture-start.test.mjs` (new), `lanes/d/p3-replay-all/writer-order.test.mjs`, `m3/w6/local/source-admission.mjs`, `m3/w6/test/local-source-admission.test.mjs`, `m3/w6/test/local-source-consumer-browser.mjs`, `m3/w6/test/local-source-consumer.test.mjs`, `m3/w7-preview/import/test/support.mjs`, `m4/import/replay-registry.cjs`.

**6. RUNBOOK.** Pre-check 8's "do not start a workout before importing" is WITHDRAWN, and NO ordering instruction is left for him at all. What replaces it is the question he is already asked, plus the fact that a Yes his own records contradict refuses by the same name and commits nothing either way.

**7. STOPS.**
1. PRE-EXISTING, NOT MINE: the S3 portable mutation harness pins `source-admission.mjs` at 00ce58d2 while the BASE already carries 1a76178f - stale before this ticket. Mine adds `local-source-admission.test.mjs` to the same stale set. That harness needs Node 22 and an owned copied tree and is in NO CI step, so nothing is red. I did not re-pin an evidence manifest I cannot execute here. For S6/the PM.
2. `ORDER_EVIDENCE_REQUIRED` is now unreachable THROUGH THIS CONTROLLER (the only call to `order.confirm` carries `answer===true`). The law stands at its own level and its mutant `prefix-answer-assumed` is still killed by `m4/import/test/local-source-order.test.cjs`. Stated in the cell.
3. Carried, not this ticket's: `food-host.mjs:70` and `machine-settings-host.mjs:56` still pin the non-live clock (P3-REPLAY-ALL R1 MAJOR 2). These cells use the live clock end to end, as the page does.
4. The gym-card open item in `P3-REPLAY-ALL-FAMILIES-AUTHOR-REPORT.md` is closed by this ticket. I did not edit that report: it is the record of that ticket's own state.
