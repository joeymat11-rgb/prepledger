# P3-REPLAY-MEASURE-FAMILY - INDEPENDENT REVIEW R3 (Fable final, DECISIONS:439)

VERDICT: ACCEPT

Subject 53e1ae78 on `rebuild/d-p3-replay-measure`, base 9a381806, unchanged since review r1 (7d8a410 ACCEPT).
Reviewed in my own detached worktree `%TEMP%\earned-rmf-rv` (three junctions) with my own cells under
`%TEMP%\rmf-rv\rv3-cells.test.mjs`, SYNTHETIC only: the invented clean-init bundle sealed by the real
`port.cjs` into the OS temp folder, real fake-indexeddb, the real setup lane, the real Measure host and the
real S3 controller; no private fixture, ledger or owner file read or named. The red side ran at the
untouched base in `%TEMP%\earned-rmf-tip`. This round's brief was adversarial on three points: a family
that admits too much, one that moves his trial start, one that rewrites a measure op. None of the three holds.

## What I reproduced myself
My cells differ from r1's in one way that matters for his phone: the installation is enrolled and opens
Measure on 2026-09-04 (day one persisted, TWO waist readings recorded out of date order, 09-04 then 09-03,
markers picked), is CLOSED, and is reopened on 2026-09-16 to import, so every measure record really
predates the day admission stands on.
RED, base: RV3-R refuses with EXACTLY FOUR `LOCAL_SOURCE_CONTEXT_UNRESOLVED`, one per record, nothing
applied. P3-X9 is where the ticket says it is.
GREEN, subject, 11 of 11: RV3-A (bar a) ADMITS; four `F7` rows, all `retained`, in the family's stated
order [waist 09-03, trial start 09-04 (seq 2), waist 09-04 (seq 3), markers 09-04 (seq 5)], that is the
record's own date then `device_seq`; the four ops in the store are `deepEqual` to before and the view's
`retained` copies are `deepEqual` to the store; the whole Measure view (day one, first enrolled, waist rows
in S5's own `device_seq` order, markers, sets, session dates, food days) is `deepEqual` to before; day one
stays 09-04 = the setup record's date; Today's `admittedLocalSourceBasis` carries the imported loads and
the three session days; the 8-week baseline column before day one fills from the import and is empty
without it. RV3-B (bar b) import first, then Measure on 09-16: day one is STILL 09-04 (the first enrolled
record, not the import day and not the open day), and a mirror install in the (a) order lands member for
member on the same place, baseline array included, programme and engine digests equal. RV3-C (bar c) six
malformed shapes, each on its own enrolled installation beside three well-formed records (waist 900, waist
dated after its recording day, five markers, trial start after its recording day, an unknown profile of
the class, a lean-source payload of the shared class): each refuses EXACTLY
`["LOCAL_SOURCE_MEASURE_UNRESOLVED"]`, never the catch-all, op count unchanged, nothing applied. RV3-D an
install that opened Measure and one that did not admit the same replayed `state`, `calculation`, non-F7
families, and programme/engine/source/material/order-map digests; only `operation_digest` differs, as it
must. RV3-E after admission a further waist saves through the real host, the host reads three, day one is
unchanged, the basis is still visible, `rebaseRequired` stays empty and `reopen` succeeds. RV3-P2 a
tombstone of the class refuses by name (report open item 3). RV-S1 (r1's cell, re-run by me): sleep still
refuses `LOCAL_SOURCE_CONTEXT_UNRESOLVED` on the subject.
Code read: the generic per-op engine-context loop (source-admission.mjs:135-140) still runs over EVERY
op before the class loop, so the F7 `continue` at :160 weakens nothing; the ONLY removed line in
source-admission.mjs is `const food=[];const checkDates=new Set();`, re-added with `measureRows`; F1-F6
branches are byte-identical; `validate()` in the S5 producer dispatches all three profiles and F7 calls
it by injection; drift is 6 files (+672/-8) and `git diff` over engine, today/**, measure/** and
packages/receipts is EMPTY; measure-commands/host/baseline are S5-declared and untouched;
source-admission, measure-replay and page-bundle.test are undeclared. The three page-bundle figures
(133->134, six names->seven, 12->13) are re-measured with the reason in place; nothing removed or relaxed.
All six files: CR 0, TAB 0, non-ASCII 0, em/en dash 0, final newline present.

## Findings
1. MAJOR (not this ticket's; disclosed by the author, verified by r1 and again here). SLEEP HAS THE SAME
   HOLE: class `sleep` is named nowhere in `replay()`, one real night refuses the import
   `LOCAL_SOURCE_CONTEXT_UNRESOLVED`. His real port still refuses if he has opened the Sleep screen, so
   :480 ruling 1 must not retire the runbook line outright: it becomes "do not open Sleep before
   importing" until the sibling lane D ticket lands. Critical path, not a tidy-up.
2. MINOR. F7 does not require `schema_version === 2` where F4 (:165) and F5 (:166) do for their
   producer-injected profiles. My probe RV3-P1 appends a well-formed waist record at `schema_version: 1`
   (signed with the era's own key; the generic original check at :79 accepts 1 or 2): the subject ADMITS
   it as a retained F7 row. No device producer can write that record (the S5 producer is schema 2 and the
   client builds from it), so nothing on his phone is affected, but the family's membership rule is
   looser than its siblings' by that one member. One-line fix in `read()`; no cell moves.
3. MINOR (r1 finding 2, still open). F7 owns the class `body-composition-source` by CLASS ALONE, and
   `rebuild/client/ops.cjs:20` / `rebuild/authority/validate.cjs:30` also define a lean-source payload
   for it. RV3-C proves that record refuses by the measure family's name; the header's "written by the
   ONE producer" is true of this device, not of the class. Say so in the header or narrow `owns()`.
4. NOTE. `b-package --ci --package S5` exits NON-ZERO here: `SEAL-BASE-IS-NOT-THE-CHAIN-TIP` (spec and
   runner byte-identical, 114 declared files, 0 unlisted drift). It exits non-zero IDENTICALLY at the
   untouched base 9a381806, because `origin/rebuild/t2-client-core` moved to e4c1bd6 (DECISIONS:480,
   one DECISIONS.md line, no rebuild byte). Not the author's defect; the integrator rebases and re-runs.
5. NOTE. `rebuild/c-p3-import-ui-2` is now at 78eb15f (round 2) and carries TWO cells that assert the
   refusal this family removes, P3-X9 (:264) and P3-X10 (:308, refusal slot text). Both go red the
   moment the branches meet; the author's open item 1 names only P3-X9.
6. NOTE. `MEASURE_REPLAY_ACCOUNTING` (measure-replay.cjs:127) cannot fire: `owned` is pre-filtered by
   the same `owns()` that `read()` re-tests, so every owned op is one row or one issue by construction.
   The report leans on that throw as the mechanism; the mechanism is the code shape. Harmless.
7. NOTE. A1 gives the SAME build id `earned-9e4ee5b587c2` and 121 pinned inputs as r1 measured on the
   base: the shipped page is byte-identical; nothing enters it from this ticket, as claimed under (f).
8. NOTE. The author's 58-line report honours `preflight.cjs` `REPORT_MAX_LINES = 60`, stricter than the
   ticket's 70; its byte hygiene is clean.

## Tails, all run by me on this tree (Node 24, TZ=America/New_York)
my cells `tests 13 / pass 11 / fail 0 / skipped 1` on the subject (RV3-P2 re-run 2/2 after a probe
argument fix) and `pass 1` (RV3-R) at the base; RV-S1 `pass 1`; lane cells + the 15 import cells
`tests 24 / pass 24 / fail 0`; m4/import incl. production-* (MEASURED_TEST_NOW=2026-09-03)
`tests 86 / pass 86 / fail 0`; consumer + admission + commit + retract + admission-swap
`tests 51 / pass 51 / fail 0`; W6 `tests 586 / pass 586 / fail 0`; today-13 (MEASURED_TEST_NOW=2026-09-03)
`tests 645 / pass 645 / fail 0`; measure all six `tests 32 / pass 32 / fail 0`; coach
`tests 231 / pass 231 / fail 0`; port `tests 65 / pass 65 / fail 0`; preflight + registration
`tests 67 / pass 67 / fail 0`; reason-on-disk `tests 18 / pass 18 / fail 0`; `rig187 => PASS`;
`A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-9e4ee5b587c2`;
`b-package --ci --package S5` EXIT NON-ZERO, `B PACKAGE S5 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP` (finding 4).
Worktree porcelain-clean after every run.
