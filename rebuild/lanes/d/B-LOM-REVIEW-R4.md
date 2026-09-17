# B-LOM FINAL REVIEW, ROUND 4 (Fable, the same final reviewer as R3; DECISIONS:431 point 17, :439)

VERDICT: ACCEPT

Reviewed `8e03401d4fb117195fd58680c7adb7d4935e1d07` on `rebuild/d-b-lom` (round 2, on `baa50f63`, product base
`07f1e4ba`), detached in `%TEMP%\earned-lom-rv`. Synthetic bundles only; no private path opened, listed or
named; no product file edited. My probe `rebuild/lanes/d/b-lom/rv4-probe.test.mjs` stays untracked beside
`rv3-probe.test.mjs`; it ran unchanged here, in the base tree `%TEMP%\earned-lom-base` (07f1e4ba), and a
third time with the three product files reverted to round 1.

## 1. THE THREE MAJORS OF R3, RE-CHECKED ONCE

**R3 MAJOR 1 (the inverted red side): CLOSED.** The absence of an order map is now earned from the selection's
own recorded `order_input` by the same predicate admission uses to require one (`source-admission.mjs:319`
`mixed`: a non-empty `legacyLog` beside any recorded `session-start`). Provider: `legacy-order-mapping.cjs`
refuses `LEGACY_ORDER_MAPPING_UNPROVEN`; `engine-order.cjs` returns no local activation, so the anchor refuses
`WORKOUT_ORDER_IMPORT_ANCHOR_UNPROVEN`. No new name, no hash, no engine byte. Author's cells LOM/10, LOM/11,
LOM-G [both seasons]. My RV4-STRIP [winter, summer]: TI admitted, the intact record opens +1 leg-press
`120 lb x 10` imported and +7 db-bench `20 lb x 8` native; with `order_map` DELETED and again NULL through
`repository.commit`, every day +1..+8 reads `blocked LEGACY_ORDER_MAPPING_UNPROVEN` and the real entry boot
reads the same code; the map restored byte for byte reads exactly as the intact record on all eight days.
Red-first measured by me: product at round 1, LOM-G x2 and LOM-H x2 red (route 17/13/4), LOM/10 and LOM/11
red (provider 12/10/2), RV4-STRIP x2 and RV4-BOOT x2 red (probe 8/4/4).

**R3 MAJOR 2 (containment): CLOSED.** `today-bindings.mjs` catches only its own module's code at the seam
and re-throws it inside the engine read, on a state that carries an imported log; the card's existing
refusal path turns it into a blocked card. Author's LOM-H drives `today-entry.mjs:150 createWorkoutEntry`.
My RV4-BOOT [both seasons], through the same real entry: intact `ready`; `answer=false`, `answer='true'`,
`map.source_digest` substituted, `basis.source_digest` substituted, map deleted, and map plus `order_input`
deleted all boot with the card `blocked LEGACY_ORDER_MAPPING_UNPROVEN`, the plan rendering and the Measure
lane opening over the same store; `native_root_id` substituted boots blocked `WORKOUT_PREPARATION_INVALID`
(finding 3). Nothing in the variant table failed to boot.

**R3 MAJOR 3 / R1 MAJOR 1 (bar row 4 measured): CLOSED.** `handTable()` plus `governs()` compare the printed
line AND the shape of the governing record in LOM-A and LOM-B, both seasons. My RV4-IT [both seasons] reads
the same table independently: +1 leg-press `Last time: 120 lb x 10` imported, `prev.d` `2026-08-17`; +7
db-bench `Last time: 45 lb x 7` native, `start_op_id` = the first Start; after training +1, +7 db-bench
`45 lb x 7` native off the first Start and +8 leg-press `120 lb x 10` native off the SECOND Start, `start_ids`
`[first, second]`, the prefix still `SOURCE_SESSION_DAYS`. TI +7 `20 lb x 8` native is in RV4-STRIP intact.

## 2. FINDINGS (none blocking)

1. MINOR (documentation honesty, no product change asked). `legacy-order-mapping.cjs` header lines 61 to 63
   say what the module does not detect is "a record rewritten by something that also rewrote all three
   copies of Q". Narrower than the truth: with `order_map` deleted AND the `session-start` scrubbed from
   `order_input.operations` (two fields, no copy of Q touched) the days OPEN (RV4-STRIP scrubbed, both
   seasons: +1 and +7 `ready`, `start_ids [first]`). No wrong order results (the only map kind is
   `athlete-confirmed-legacy-prefix` with answer true, and the mapless ordering is that same prefix), so
   "no wrong order can come out of that boundary" holds; but `order_input` is presence-bound like the
   digests and the header should name it so. S6 may take it as a doc line.
2. NOTE. R3 MAJOR 2 and the author's round 2 text both say round 1 left the athlete "no screen at all". On
   the real page `today-entry.mjs:336` already caught `createWorkoutEntry` and pushed `workout store:
   LEGACY_ORDER_MAPPING_UNPROVEN` to the status line: Today rendered WITHOUT a workout card and without the
   code on a card. The defect was real (no card, no named refusal where the base showed one); the wording
   overstated it. Recorded so the history reads true.
3. NOTE. A substituted `native_root_id` refuses `WORKOUT_ORDER_IMPORT_DESCENT_UNPROVEN` at the law (LOM/11)
   but reaches the card as `WORKOUT_PREPARATION_INVALID` (RV4-BOOT root-substituted, both seasons): the
   card's pre-existing wrapping of engine-order refusals, not B-LOM's; still a refusal by name. And
   `order_input` deleted while the map is PRESENT is not refused (`ready`): the map is the proof when present.

## 3. CONFIRMED OF THE AUTHOR'S CLAIMS

* Drift `git diff --name-only 07f1e4ba HEAD` = 12 files, unchanged from round 1 plus the two carried reviews.
  Against `rebuild/lanes/b/tooling/packages/S5.json` SEALED = `rebuild/m3/w6/local/today-bindings.mjs` and
  `rebuild/m3/w7-preview/today/test/gym.test.mjs`, exactly the two expected. Undeclared: the three lane-D
  markdown files, `lanes/d/b-lom/legacy-order.test.mjs`, `lanes/d/p3-capture-start/capture-start.test.mjs`,
  `m3/w6/local/source-admission.mjs`, `m3/w7-preview/import/test/page-bundle.test.mjs`,
  `m4/workout/engine-order.cjs`, `m4/workout/legacy-order-mapping.cjs` (175 lines),
  `m4/workout/test/legacy-order-mapping.test.cjs`. `git diff --stat 07f1e4ba HEAD -- rebuild/engine` EMPTY.
* Round 2 diff `baa50f6..8e03401`: 7 files, 411+/41-; 0 added lines carry U+2013 or U+2014; 0 CRLF in any
  touched file; 0 `assert.` lines removed, 47 added. LOM/6's fixture moved from `order_map:null` to
  `noNative()` because its old fixture is now LOM/10's refusal; `gym.test.mjs` moved comment and title only.
* No-import installation: RV4-NI [both seasons], 36 RV4 lines (card phase, code, lift, printed line,
  governing shape, start_ids, ops 13, loads, `metadata.localSources` undefined) IDENTICAL line for line
  between this tree and the base tree (the generation digest differs run to run inside one tree, so the
  lines are the comparison). Author report 68 lines. A1 id `earned-c2a44c1591c3`, 122 inputs, reproduces.

## 4. SUITES I RAN (verbatim tails; Node 24, TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03)
```
provider legacy-order-mapping.test.cjs # tests 12 # pass 12 # fail 0
route legacy-order.test.mjs # tests 17 # pass 17 # fail 0 # duration_ms 9734.7743
p3-capture-start # tests 14 # pass 14 # fail 0 | w7-preview/import (live-clock, page-bundle, refusals) # tests 15 # pass 15 # fail 0
lane D (replay-measure, replay-all, retract, followons) # tests 52 # pass 52 # fail 0 | m4/import (7 files, harness excluded) # tests 86 # pass 86 # fail 0
W6 rebuild/m3/w6/test/*.test.mjs # tests 586 # pass 586 # fail 0 # duration_ms 9252.7156
today-17 first 7 # tests 277 # pass 276 # fail 1 (N1.18)
today-17 last 10 + four measure suites # tests 390 # pass 385 # fail 5 (P-MEASURE (g), S10, N2-08, re-pin x2)
A0 + coach # tests 269 # pass 269 # fail 0 | client # tests 18 # pass 18 # fail 0 | port # tests 65 # pass 65 # fail 0
rig187 => PASS  EXIT 0
A1 TODAY BUILD PASS: 3 assets; 122 pinned inputs (13 engine, 12 client); build earned-c2a44c1591c3  EXIT 0
A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256  EXIT 0
b-package --ci --package S5: B PACKAGE S5 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld  EXIT 1
MY PROBE rv4 candidate # tests 8 # pass 8 # fail 0 | base 07f1e4ba 8/2/6 (NI green both seasons; STRIP, BOOT, IT red by design) | product reverted to round 1: 8/4/4
```
The six today-17 reds are the `today-bindings.mjs` byte-identity pins and nothing else; the S5 red is the
expected SEALED-PROFILE-RECOMPUTATION on the two named sealed files. S6 closes both.

## 5. THE DECISION
All three MAJORs are closed by named cells on the real route, red-first measured here: no engine byte, no new
refusal name, no weakened assertion, the drift list unmoved, the no-import installation reading identically
to the base. Finding 1 is a one-line doc correction for S6. ACCEPT; B-LOM may fold into S6.
