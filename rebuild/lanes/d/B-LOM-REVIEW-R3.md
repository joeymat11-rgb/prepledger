# B-LOM FINAL REVIEW R3 (Fable, independent; DECISIONS:439 final round)

VERDICT: ACCEPT, with three MAJOR items S6 must carry as named cells before its post is measured.
Reviewed `e12c670` on `07f1e4ba` (the sha R1 reviewed; no byte moved between rounds). Every number below was
measured by this reviewer in `%TEMP%\earned-lom-rv` (detached at e12c670) and `%TEMP%\earned-lom-base`
(07f1e4ba), Node 24, `TZ=America/New_York`, with my own uncommitted instrument `lanes/d/b-lom/rv3-probe.test.mjs`
(identical bytes in both trees). Synthetic only (`support.mjs`'s invented bundle through the real `port.cjs`);
no private path opened, listed or named; `git diff --stat 07f1e4ba HEAD -- rebuild/engine` is EMPTY.

## 1. THE TWO IDS, checked against the engine's text
`source_generation_id = basis.source_digest`; `activation_op_id = basis.local_selection_id` (= `selection.id`
= `metadata.localSources.active`). Both recorded strings, both in Q's digests, both read by `engine-order.cjs`
out of the generation, never the caller. `performed.cjs:172-183` wants two non-empty strings, baseline/anchor
equality and `session_log` BY REFERENCE (`PERFORMED-ENGINE-v1.md:178`), honoured at the one seam where state
and facts meet (`today-bindings.mjs` `composed`). Sound; stated before the first cell, as :486 (b) required.

## 2. THE RED SIDE, PROVED AT THE BASE BY THIS REVIEWER (both orders, both seasons)
Import-then-train (IT) and train-then-import (TI) on 2026-11-20 EST and 2026-10-16 EDT; real era, Measure
host, gym host, card model and admission controller on one IDBFactory per installation. BASE: IT and TI, both
seasons, day+1 `blocked PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED` and no day +1..+8 opens, so no second workout
can be trained. CANDIDATE, bar row 4's hand table read off the card (`view.previous`, `gym.previous()`):

| order | day | lift | the card's previous line | governed by |
| --- | --- | --- | --- | --- |
| IT | +1 | leg-press | Last time: 120 lb x 10 | IMPORTED `{d:'2026-08-17',w:120,reps:[10,10,9]}` |
| IT | +7 | db-bench | Last time: 45 lb x 7 | NATIVE performed-lift, `start_op_id` = the native Start, 11-20 |
| IT, after training +1 | +7 | leg-press | Last time: 120 lb x 10 | NATIVE record of the SECOND workout, 11-21 |
| TI | +1 / +7 | leg-press / db-bench | 120 lb x 10 / Last time: 20 lb x 8 | IMPORTED / NATIVE pre-import session on clean-init numbers (row 6) |

  Identical in summer. THEN THE SECOND WORKOUT WAS TRAINED (started, every set logged, finished) on day+1 in
  both orders and seasons; every later day reads `order.start_ids = [first, second]`, `sessions` the same
  two each once, `sessionLog` still the three imported days, `import_anchor` the two ids, day one unmoved.
* NO-IMPORT installation (train, train again, +1..+8 twice, both seasons): 40 probe lines byte-identical
  base vs candidate (`fc`); `metadata.localSources` absent; no baseline and no anchor on the facts.

## 3. FINDINGS
1. **MAJOR - the brief's own red side is inverted; nothing binds the map's ABSENCE.** Brief section 3: "with
   the selection's order_map removed from the generation, the same four days are blocked with
   PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED". Measured on the real route, TI winter, the durable generation
   rewritten through `repository.commit` with the recorded `order_map` DELETED, then `null`: the candidate
   OPENS day+1 and day+7, `start_ids = [the pre-import Start]`, anchor present; the base blocks both by name.
   The provider (`legacy-order-mapping.cjs:80-84`, LOM/6) and `engine-order.cjs` `{map:null}` read absence
   as "nothing native at admission", although the SAME selection's recorded `order_input.operations` holds a
   session-start and `basis.order_map_digest` is the digest of a map, not of null. No wrong order results
   (stripped order and prescription are byte-equal to the intact ones, since admission records a map only
   with a strict-true answer over Starts dated after the file): corruption resistance, not a dropped or
   reordered workout; but the departure is undisclosed and the brief's cell exists nowhere. REPAIR for S6, no
   hash, no engine byte: a selection whose recorded `order_input.operations` holds any `session-start` MUST
   carry an order map, in the provider and in `engine-order.cjs` (the predicate `source-admission.mjs:311`
   already uses for `LOCAL_SOURCE_ORDER_MAP_REQUIRED`); then the brief's cell.
2. **MAJOR - a provider refusal is a Today BOOT FAILURE, not a card refusal.** With the recorded map's
   `assertion.answer` set to `false` in the durable record, `createGymHost` throws `LEGACY_ORDER_MAPPING_UNPROVEN`
   from `today-bindings.mjs:423` (my probe's one red); `today-entry.mjs:160` awaits `openGym(...)` uncaught, so
   the whole page fails to open, where the base on the identical record leaves Today standing and the card
   `blocked PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED`. Corruption-only, but "refuses by name" must be a code the
   athlete can read. S6: contain it at the seam (hand the engine the unattached state so `performed.cjs`
   refuses on the card as before, or surface the provider's code as the card's), with a cell.
3. **MAJOR (carried from R1, unchanged at this sha) - bar row 4 is measured by no cell.** `laterDays`
   (`legacy-order.test.mjs:128`) collects `prev`/`previous` and never compares them; section 2's table is
   mine. S6's bar adds the imported-vs-native "previous" assertions to LOM-A and LOM-B, both seasons.
4. **MINOR - "digest-bound" is presence-bound for ten fields.** Real recorded selection, each field deleted
   and substituted: DELETING any of 16 refuses by name; SUBSTITUTING refuses the five shared identity fields,
   `local_selection_id` and every non-true answer (false, 'yes', 1, 'true', null) but is ACCEPTED for the six
   basis digests, the three map digests and `native_root_id`. The order law still refuses a foreign activation,
   a foreign source and a false answer (`WORKOUT_ORDER_IMPORT_ANCHOR_UNPROVEN`). The header should say so.
5. **MINOR - H3 binds less than the brief says**: `engine-order.cjs:44-56` binds selection id and
   `source_digest` only (installation/era/athlete/checkpoint are the provider's; the selection comes from the
   authenticated generation, so the binding is intrinsic). Write that where the brief's sentence is unmet.
6. **MINOR - the report's tails do not reproduce**: A1 is `build earned-e788245c61be` here (R1 too), not
   `earned-6d56f63a25b0`; the report names commit `150443b` and a 139-line provider (135). Refresh at merge.
7. **MINOR - P3-CSR5's repair compares native Start DAYS off the ops**, not the digests or `start_ids` row 5
   named; rule stated in place, LOM-D/LOM-D2 carry the engine view and digest sensitivity, mutants real. Acceptable.
8. **NOTE - bar (g)**: A2 re-reasoned where it stood, every assertion kept, a sub-test measuring the reason;
   the positive half runs on the real route. R1's ruling stands; the PM should record it. Five U+2014 in added
   `gym.test.mjs` comments and the A2 title (that file's convention); A1/A5 report none athlete-visible. LF only.
9. **NOTE** - TI reads "Last time: 20 lb x 8" for db-bench: the pre-import session on the sample numbers is
   later than the prefix and governs (row 6). A rejected or `included:false` root Start in TI leaves its
   successor refusing `WORKOUT_ORDER_IMPORT_DESCENT_UNPROVEN` (a refusal, never a misorder). One extra
   `repository.load()` per gym host. The origin tip moved by DECISIONS-only commits.

## 4. CONFIRMED OF THE AUTHOR'S CLAIMS
Drift exactly ten files; against `packages/S5.json` SEALED = `m3/w6/local/today-bindings.mjs` and
`m3/w7-preview/today/test/gym.test.mjs` (the two the brief names), the other eight declared by no package.
No assertion deleted; P3-CSR5 and P3-B2 (136 to 137) state their reasons; `gym-model.mjs` unedited and the
reference identity holds; LOM-F re-run refuses by name with ops and revision unmoved; `m4/workout/test/*`
191/180/11 candidate vs 181/170/11 base, the same eleven environmental reds plus ten green provider cells.

## 5. SUITES I RAN (verbatim tails; Node 24, TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03)
```
provider legacy-order-mapping.test.cjs tests 10 pass 10 fail 0 | route legacy-order.test.mjs tests 13 pass 13 fail 0 duration_ms 7251.5642
p3-capture-start tests 14 pass 14 fail 0 | w7-preview/import tests 15 pass 15 fail 0 | m4/import tests 86 pass 86 fail 0
lane D (replay-measure, replay-all, capture-start, retract) tests 49 pass 49 fail 0 | (import-retract, followons) tests 17 pass 17 fail 0
W6 rebuild/m3/w6/test/*.test.mjs tests 586 pass 586 fail 0 duration_ms 8962.1101
today-17 first 7 (rebuild.yml argv by name) tests 277 pass 276 fail 1 (N1.18 byte pin)
today-17 last 10 + four measure page-stack suites tests 390 pass 385 fail 5 (P-MEASURE (g), S10, N2-08, re-pin x2)
A0 + coach tests 269 pass 269 fail 0 | client tests 18 pass 18 fail 0 | port tests 65 pass 65 fail 0 | rig187 => PASS EXIT 0
A1 TODAY BUILD PASS: 3 assets; 122 pinned inputs (13 engine, 12 client); build earned-e788245c61be   EXIT 0
A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256                EXIT 0
b-package --ci --package S5: B PACKAGE S5 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld   EXIT 1
MY PROBE base 07f1e4ba tests 8 pass 8 fail 0 (IT/TI blocked by name, no second workout; NI trains) | candidate tests 8 pass 7 fail 1 (finding 2)
```
The six today-17 reds are `today-bindings.mjs` byte-identity pins, none behavioural; S6 closes them. The S5
red is the expected SEALED-PROFILE-RECOMPUTATION on the two named sealed files.

## 6. THE DECISION
The owner can train the day after his history lands: both orders, both seasons, the next scheduled day opens
with the imported prefix in the old engine's order and the native session after it, once; the second workout
is trainable and the third day carries both Starts once; a no-import installation is byte-identical to the
base. Findings 1 to 3 are corruption resistance and coverage, not a dropped, duplicated or reordered workout;
S6, which carries the sealed moves anyway, closes them as cells named in its bar before its post is measured.
