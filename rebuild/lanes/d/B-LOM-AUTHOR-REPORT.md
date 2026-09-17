# B-LOM AUTHOR REPORT - the legacy order mapping
Branch `rebuild/d-b-lom`, one commit `150443b` on `07f1e4ba` (DECISIONS:486). Lane D, Opus high, size M. Synthetic only; no private path opened, listed or named. No `rebuild/engine` byte moved.

## THE TWO IDS, FIXED BEFORE THE FIRST CELL (:486 (b), the author's to fix)
The local era mints NO activation operation, so neither id can be an operation id. Both come from the admission's own recorded basis `Q` (`earned/local-source-basis/v1`), and both are recorded in the generation, which is what makes them CHECKABLE rather than asserted.
* **`source_generation_id` = `basis.source_digest`** - the content digest of the admitted source on this installation: WHICH imported history the baseline is. The local analogue of the guarded lineage's `source.source_id` (`m4/import/replay-core.cjs:384`).
* **`activation_op_id` = `basis.local_selection_id`** - the recorded selection id (`'local-source:'+digest` over the source name, material digest, input revision, input token, the order map and the action). It is `selection.id`, and it is the value `metadata.localSources.active` carries. No operation activates a local source; the recorded SELECTION is the act that does.
`engine-order.cjs` reads that selection back out of the same authenticated generation instead of taking either id from a caller: the local analogue of `sequence.has(activation_op_id)`.

## FILES : HUNKS
* NEW `m4/workout/legacy-order-mapping.cjs` (139 lines): `createLegacyOrderMapping({selection, orderMap})` -> `{anchor, binding, digest, baseline, attach, REFUSAL}`, plus `activeLocalSelection`. Refuses `LEGACY_ORDER_MAPPING_UNPROVEN` by name. Imports NOTHING - it ships in the page's boot graph and the import lane's encoder must stay out of it (:480).
* NEW `m4/workout/test/legacy-order-mapping.test.cjs`: 10 cells, LOM/0 red-first against the real `performed.cjs`, one mutant per bound digest field. NEW `lanes/d/b-lom/legacy-order.test.mjs`: 13 route cells, both orders, two seasons.
* `m4/workout/engine-order.cjs` 2 hunks: the recorded selection as an alternative ANCHOR proof (`:24-30`) and as an alternative DESCENT proof (`:88-91`). Every other refusal untouched and restated in place; an empty `activation_op_id`, which `sequence.has` rejected only incidentally, is now rejected in its own right.
* `m3/w6/local/today-bindings.mjs` 1 import line + 2 hunks (the mapping and the engine seam; the projector wrapper's one-line call site). `m3/w6/local/source-admission.mjs` 2 hunks (`workout_baseline.engine_baseline` in the engine's own profile BESIDE the local one; the named `LOCAL_SOURCE_ORDER_MAP_REQUIRED`).
* `today/test/gym.test.mjs`: A2 re-reasoned in place, one new sub-test. `lanes/d/p3-capture-start/capture-start.test.mjs`: P3-CSR5 repaired, rule stated, real dropped-workout mutant. `import/test/page-bundle.test.mjs`: P3-B2 re-measured 136 -> 137 with the reason, as that cell demands.
* `gym-model.mjs` **NOT EDITED** (brief STOP 3). `performed.cjs:176` compares `session_log` by REFERENCE, and the state and the facts arrive from two separate clones twice over (`source-projection.cjs` register, then `gym-model.mjs:213-215`), so a baseline attached upstream names a different object. The `today-bindings.mjs` engine seam is the LAST place the two meet, on both paths - the producer's prescription and the card's previous-performance read - so the identity holds without it.
* The anchor is FORWARDED, not bolted on: `projectWorkoutHistory` runs without one, so writing one on afterwards would claim an order law nobody ran. `today-bindings.mjs` wraps the projector handed to the PINNED host (that file unedited) so `engine-order.cjs` derives the anchor itself. Admission does not attach it either, and says why: its selection id does not exist yet when `replay()` runs.

## DRIFT LIST (`git diff --name-only 07f1e4b HEAD`, each findstr'd against packages/S5.json)
SEALED, both named by the brief, both riding S6: `m3/w6/local/today-bindings.mjs`, `m3/w7-preview/today/test/gym.test.mjs` - each also pinned by B-NTC, H3, S3 and S4.
UNDECLARED by every package on this tree (the :473/:482 custody hole S6 closes): `lanes/d/b-lom/legacy-order.test.mjs`, `lanes/d/p3-capture-start/capture-start.test.mjs`, `m3/w6/local/source-admission.mjs`, `m3/w7-preview/import/test/page-bundle.test.mjs`, `m4/workout/engine-order.cjs`, `m4/workout/legacy-order-mapping.cjs`, `m4/workout/test/legacy-order-mapping.test.cjs`.
`git diff --stat 07f1e4b HEAD -- rebuild/engine` is EMPTY.

## CELLS PER BAR ITEM
* **(a) import then train** LOM-A [winter EST, summer EDT]: admit (order_map null), train, then day+1/+3/+4/+7 - no day carries `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED`, every training day opens `ready` with a named lift and sets, the native Start is in `order.start_ids` ONCE, the anchor is the two ids, day one unmoved, ops grew only by the workout.
* **(b) train then import** LOM-B [both]: the same, and the anchor holds although the Start predates the activation; the map's `native_root_id` IS that Start.
* **(c) two native before the import** LOM-C [both]: device order, each once, neither absorbed into `sessionLog`, the day after opens.
* **(d) mirror and sensitivity** LOM-D [both], LOM-D2, P3-CSR5 repaired [both]. LOM-D compares what the ENGINE reads across the two orders and names the six basis members that differ with their reason; its mutant is a real second workout, so a drop is DETECTED. LOM-D2 recomputes `order_map_digest` and `native_members_digest` from the installation's own recorded `order_input` with one operation dropped and with the root reordered: both change. P3-CSR5 keeps every assertion it had, states the insensitivity as the reason for the new rule, and carries an install that never records the workout: `adopted()` is STILL equal, `nativeStarts()` is not.
* **(e) no import** LOM-E, LOM/9: `metadata.localSources` absent, no `legacy_baseline` and no `import_anchor` on the host's own facts, two identical installations byte-equal on the whole engine view. Base equality is discharged by the unchanged tails below, not by a cross-tree digest inside one process.
* **(f) reopen/rollback with order_map null** LOM-F: both refuse `LOCAL_SOURCE_ORDER_MAP_REQUIRED` BY NAME; no op minted, revision unmoved, the import still admitted. Never a silent replay under `undefined`.
* **(g) the pinned gym.test.mjs cell**: re-reasoned where it stood - the refusal is now CONDITIONAL, its rule is written in place, and a NEW sub-test measures the reason (`metadata.localSources === undefined` on that lane). Every original assertion kept: blocked, the code, `copy === null`. See OPEN 1.
* **(h)** no engine byte; LF only in all ten files (0 CRLF); A1/A5 PASS; S5 red only on the two named sealed files.
* **refusals** LOM/0,3,4,5,6,7,8,9: red-first against the real engine; a second COPY of the log refused; one mutant per bound digest; a strict-true answer (false, 'yes', 1, 'true', null and undefined all refuse); a disagreeing anchor refused, never overwritten.

## VERBATIM TAILS (Node 24, TZ=America/New_York)
```
B-LOM provider tests 10 pass 10 fail 0   | B-LOM route tests 13 pass 13 fail 0
p3-capture-start tests 14 pass 14 fail 0 | w7-preview/import tests 15 pass 15 fail 0
lane D import/admission tests 52 pass 52 fail 0 (replay-measure, replay-all, retract, followons)
m4/import tests 86 pass 86 fail 0        | W6 tests 586 pass 586 fail 0 duration_ms 8851.3312
A0 + coach 231 tests 269 pass 269 fail 0 | client tests 18 pass 18 fail 0
port tests 65 pass 65 fail 0             | rig187 => PASS
A1 TODAY BUILD PASS: 3 assets; 122 pinned inputs (13 engine, 12 client); build earned-6d56f63a25b0
A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256
today-17 (first 7) tests 277 pass 276 fail 1 | today-17 (last 10) tests 390 pass 385 fail 5
b-package --ci --package S5: B PACKAGE S5 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence
  missing or failed; local diagnostics withheld            EXIT 1
```
today-17 is 667 (was 666); the +1 is A2's new sub-test. All SIX reds are ONE cause - `today-bindings.mjs` stands at bytes no package on this branch declares - and none is behavioural: food N1.18, machine-settings-ui S10, problem N2-08, setup re-pin (x2), measure boundary P-MEASURE (g). Each walks `standsWhereDeclared()` over `CHILD_SPECS = ['H3','S3','S4','S5']`; S6 closes all six by declaring the new post and appending `'S6'`. No cell was weakened to go green.
A1 is 122 inputs, not 121, and the build id moved: the one added module is `legacy-order-mapping.cjs`, which imports nothing, brings no forbidden name, and leaves `assertBundleInputs` passing (P3-B1). The Import graph is 137; P3-B4's DELTA is unmoved, the module being in the page's own graph on both sides of it.
`m4/workout/test/*` is 191 / pass 180 / fail 11, IDENTICAL AT THE BASE (measured by stashing the three product files and re-running): every one environmental (`PERFORMED_W6_DIR`, `IMPORT_M4_DIR`, and the H3 supersede cells' `sourceBase` comparison on a worktree at another sha). Not mine, not masked.
RED-FIRST, executed: with the three product files stashed the route suite is `tests 13 / pass 2 / fail 11` - LOM-A/B/C/D and LOM-ID on `day+N is still blocked by the port`, LOM-F on the missing named refusal. LOM-D2 and LOM-E are green at the base BY DESIGN: they pin what must NOT change. LOM/0 is red-first inside the cell, against the real `performed.cjs`, on every run.

## OPEN ITEMS
1. gym.test.mjs A2 is re-reasoned but its POSITIVE half lives in `lanes/d/b-lom/`, not in place. That lane has no admission controller, so giving it a recorded selection means fabricating one - exactly the caller proof the engine refuses to accept. I judged a fabricated selection worse than a pointer and gave the cell a new executable sub-test measuring the REASON instead. Putting the positive half in that file costs one `port.cjs` seal and about 50 lines duplicating LOM-A.
2. `origin/rebuild/t2-client-core` moved 5 commits during authoring (to `0635f4b`, DECISIONS:487-490, the S6 brief acceptance). All five touch DECISIONS.md and the S6 brief only, no product byte, so the rebase is trivial. This branch is based on `07f1e4ba`, the tip the ticket named.
3. `engine-order.cjs` is declared by NO package on this tree. S6 should declare it beside `source-admission.mjs`, with `legacy-order-mapping.cjs` and both new test files.
4. MAPPING_ID / bar row 22 (:484) is NOT discharged here: B-LOM moves no coach constant, and S6 takes B-LOM last, so that proof belongs to S6's own bar.
5. `LOCAL_SOURCE_ORDER_MAP_REQUIRED` is a NEW code, narrower than the `LOCAL_SOURCE_WORKOUT_UNRESOLVED` it replaces for that one case. No product caller reaches it today; when the Import screen offers a second pass it must re-ask the prefix question rather than surface the code.
6. The windows-latest today-child flake (:467, :481, :485 point 6) was not seen in any run here, and nothing was retriggered or timed out away.
