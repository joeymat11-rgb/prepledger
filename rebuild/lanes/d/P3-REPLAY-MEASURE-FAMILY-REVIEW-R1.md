# P3-REPLAY-MEASURE-FAMILY - INDEPENDENT REVIEW R1 (Opus high)

VERDICT: ACCEPT

Subject 53e1ae78 on `rebuild/d-p3-replay-measure`, base 9a381806. Reviewed in my own detached worktree
`%TEMP%\earned-rmf-rv` with my own cells under `%TEMP%\rmf-rv\` (SYNTHETIC only: the invented clean-init
bundle sealed by the real `port.cjs` into the OS temp folder; no private fixture, no ledger, no owner file
read or named). A second worktree at the untouched base `%TEMP%\earned-rmf-tip` carried the red side.

## What I reproduced myself, not took on trust
RED, at the base: RV-R1 opens the REAL measure host on a real installation (day one persisted, one waist,
markers picked) and then imports through the real controller. It refuses, with EXACTLY THREE
`LOCAL_SOURCE_CONTEXT_UNRESOLVED`, one per measure op, and commits nothing. P3-X9 is a real defect and it
is where the ticket says it is.
GREEN, on the subject, five cells, all passing:
RV-G1 (bar a) Measure then import ADMITS; three `F7` rows, every one `retained`, their op_ids exactly the
three measure ops; Today and the gym card carry the imported lifts and three sessions through
`admittedLocalSourceBasis`; the Measure screen's whole device-side view (day one, first-enrolled, waist,
markers, sets, session dates, food days) is `deepEqual` to before; the three measure OPERATIONS in the
store are `deepEqual` to before, so nothing was dropped or rewritten; the baseline column fills from the
import and is empty without it. RV-G2 (bar b) the reverse order admits and lands member-for-member on the
same place as a mirror install in the (a) order, including the whole baseline array. RV-G3 (bar c) a
malformed waist record, authentically signed with the era's own identity key, refuses
`LOCAL_SOURCE_MEASURE_UNRESOLVED` exactly once, never the catch-all, mints no op and leaves the file
staged. RV-G5 an install that opened Measure and one that did not admit the SAME state and the SAME non-F7
families, with programme, engine and source digests equal: the measure records move nothing.
Code read, not inferred: the generic per-op engine-context loop still runs over EVERY op before the class
loop, so the F7 `continue` weakens no law; F1/F2/F4/F5/F6 branches are untouched; `measure-commands.cjs`'s
`validate()` really does dispatch all three profiles; drift is 6 files (+672/-8) and no engine, `today/**`,
`measure/**` or `packages/*.json` byte moves. LF only, no tabs, no non-ASCII, no dash, in all six files.
Three assertions in `page-bundle.test.mjs` were re-measured (133->134, 6->7 names, 12->13) with the reason
stated in place; none was removed or relaxed, and all 15 import cells pass on the new figures.

## Findings
1. MAJOR (not this ticket's to fix; the author disclosed it and I verified it). SLEEP HAS THE SAME HOLE.
   My RV-S1 writes ONE night through the REAL sleep host on the subject branch and then imports: refused,
   `["LOCAL_SOURCE_CONTEXT_UNRESOLVED"]`. Class `sleep` is named nowhere in `replay()`. Joe's real port
   still refuses if he has opened the Sleep screen, so :480's ruling 1 must NOT retire the runbook
   instruction outright: it changes from "do not open Measure before importing" to "do not open Sleep
   before importing", and lane D needs the sibling ticket. This is the critical path, not a tidy-up.
2. MINOR. F7 takes membership by CLASS ALONE, but `body-composition-source` is a SHARED accepted class:
   `rebuild/client/ops.cjs:20` and `rebuild/authority/validate.cjs:4,:30` define a LEAN-SOURCE payload
   for it (`kind, quantity, low, high, provenance, effective_date`). My RV-G4 puts one such record on the
   installation: the subject refuses it `LOCAL_SOURCE_MEASURE_UNRESOLVED`, the base refuses it
   `LOCAL_SOURCE_CONTEXT_UNRESOLVED`. No admission regression (both refuse, and no producer on this device
   writes that shape today), but the code now names a lean-source record a MEASURE record, and
   `measure-replay.cjs`'s header calls the class "written by the ONE producer", which is true of the
   device and not of the class. Either narrow `owns()` to the three profiles plus a named refusal for the
   rest of the class, or say in the header that F7 claims the whole class deliberately. Not blocking.
3. NOTE. `b-package --ci --package S5` now FAILS `SEAL-BASE-IS-NOT-THE-CHAIN-TIP` here - and identically
   at the UNTOUCHED base 9a381806 - because `origin/rebuild/t2-client-core` moved to e4c1bd6
   (DECISIONS:480) after the author's run. Not the author's defect. Independently of the tool: `S5.json`
   declares `measure-host.mjs` and `measure-commands.cjs` (both byte-identical here) and does NOT name
   `source-admission.mjs`, `measure-replay.cjs`, `m4/import/**` or `page-bundle.test.mjs`, so no declared
   byte moved. Rebase onto e4c1bd6 and re-run the gate before merge.
4. NOTE. Claim (f) is stronger than stated and I proved it: `build.mjs` gives the SAME build id
   `earned-9e4ee5b587c2` and 121 pinned inputs on the subject AND on the base. The shipped page is
   byte-identical; nothing enters it from this ticket.
5. NOTE. `MEASURE_REPLAY_ACCOUNTING` in `replay()` cannot fire as written (`owned` is pre-filtered by the
   same predicate `read()` re-tests), so "retained + refused == owned" is held by construction, not by
   that throw. Harmless, but the report leans on it as the mechanism.
6. NOTE. `m4/import/test/s3/harness.test.mjs` is 3/17 on this PC at the subject and at the base alike
   ("Actual owned dispatcher scratch required"): pre-existing and environment-gated, outside the 86.
7. NOTE. The 58-line report is right: `rebuild/lanes/tooling/preflight.cjs:29` sets
   `REPORT_MAX_LINES = 60`, stricter than the ticket's 70.

## Tails, all run by me on this tree (Node 24, TZ=America/New_York)
my cells `tests 6 / pass 5 / fail 0 / skip 1` (subject) and `pass 1` (base, red side); RV-S1 pass;
lane cells `tests 9 / pass 9 / fail 0`; m4/import (MEASURED_TEST_NOW=2026-09-03) `tests 86 / pass 86 /
fail 0`; w7-preview/import + consumer + admission + retract + swap `tests 57 / pass 57 / fail 0`; W6 incl.
host `tests 633 / pass 633 / fail 0`; today-13 + measure-4 `tests 666 / pass 666 / fail 0`; measure all six
`tests 32 / pass 32 / fail 0`; coach `tests 231 / pass 231 / fail 0`; port `tests 65 / pass 65 / fail 0`;
preflight + registration + reason-on-disk `tests 85 / pass 85 / fail 0`; `rig187 => PASS`;
`A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-9e4ee5b587c2`;
`b-package --ci --package S5` see finding 3. Worktree porcelain-clean after every run.
