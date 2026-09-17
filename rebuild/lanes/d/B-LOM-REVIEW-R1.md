# B-LOM INDEPENDENT REVIEW R1 (Opus high)

VERDICT: ACCEPT. Reviewed `e12c670` (product tree identical to the report's `150443b`; the
only difference is the report file itself). Every number below was measured by this reviewer
in two worktrees of its own, `%TEMP%\earned-lom-rv` at the candidate and `%TEMP%\earned-lom-base`
at `07f1e4ba`, on Node 24 with `TZ=America/New_York`. Synthetic only: the sealed bundle comes
from `w7-preview/import/test/support.mjs`'s invented clean-init constructor through the real
`port.cjs`. No private path was opened, listed or named.

## THE RED SIDE, PROVED AT THE BASE BY THIS REVIEWER

A probe of my own (import then train, and train then import, on `2026-11-20` EST and
`2026-10-16` EDT, real era, real Measure host, real gym host and card model, real admission
controller, one `IDBFactory` per installation) run UNCHANGED in both trees:

* BASE: day+1 and day+7 `blocked` with `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED`, in BOTH
  orders and BOTH seasons. The boundary the brief describes is real and it is the port's.
* CANDIDATE: the same days open `ready`, carry a named lift and a set count, and the host's
  own `order.import_anchor` is present. Two native workouts before the import keep device
  order (`start_ids` = [first, second], each exactly once) and the day after opens.
* NO-IMPORT installation: the whole probe output (four days, phases, codes, lifts, totals,
  previous lines, start ids, facts, op count and revision) is BYTE-IDENTICAL base vs
  candidate, for both seasons. That discharges bar (e) as a cross-tree equality rather than
  as an argument from the tails.

## THE PRESCRIPTION IS THE RIGHT ONE (measured here, not asserted by the author: FINDING 1)

Import then train, winter, the native session logged db-bench 45x7 (x3) and lat-pulldown
80x11 (x2) on 2026-11-20:

| day | lift | the card's previous line | what governs |
| --- | --- | --- | --- |
| +1 | leg-press | "Last time" reads 120 lb and 10 reps, off `{d:'2026-08-17',w:120,reps:[10,10,9]}` | the IMPORTED prefix |
| +7 | db-bench | "Last time" reads 45 lb and 7 reps, off a `earned/performed-lift/v1` record whose `start_op_id` is the native Start and whose `effective.local_date` is 2026-11-20 | the NATIVE record |

So the imported prefix is read in the old engine's own order and the native session is read
once, in its place, exactly as bar row 1/4 requires. The PRODUCT is right.

## FINDINGS

1. **MAJOR - bar row 4 is not measured by any cell.** `laterDays` collects `prev` and
   `previous` into `seen` and NEVER compares them (`lanes/d/b-lom/legacy-order.test.mjs:128`);
   the only comparison is mirror-equality in LOM-D. The brief asks for "a hand table over the
   imported loads and the native record, matched cell for cell, in both orders". I built that
   table by hand (above) and it passes, so this is a coverage gap, not a defect: a future
   regression that reads the imported row where the native row governs would be caught by no
   cell here. Add two assertions to LOM-A and LOM-B in S6 or R2.
2. **MAJOR - bar (g), gym.test.mjs A2 is re-reasoned but not made positive** (the author's
   OPEN 1, correctly disclosed). MY CALL: ACCEPT as done. The cell keeps every original
   assertion, states the new rule where the old one stood, and gains an executable sub-test
   that measures the reason (`metadata.localSources === undefined` on that lane). The positive
   half is executed on the REAL route in both orders and both seasons, and I verified it
   independently; a fabricated selection in that lane would be the caller proof the engine
   explicitly refuses, and it would move more sealed bytes for less evidence. The PM should
   record this as the ruling rather than leave the brief's letter open.
3. **MINOR - "digest-bound" is presence-bound for 10 of 16 fields.** Measured against a REAL
   recorded selection from a real admission, one mutant per field, deleted and substituted:
   DELETING any of the 16 refuses `LEGACY_ORDER_MAPPING_UNPROVEN` by name; SUBSTITUTING
   refuses for the five shared identity fields and `local_selection_id` (they are cross-checked
   basis against order map) but is ACCEPTED for `material_digest`, `operation_digest`,
   `interpretation_digest`, `programme_digest`, `order_map_digest`, `engine_digest`,
   `legacy_members_digest`, `native_members_digest`, `root_interpretation_digest`,
   `assertion.review_digest` and `native_root_id`. No wrong order can result: a substituted
   value breaks the three-copies identity `local-source-basis.mjs:44` compares, so the page
   adopts nothing, and a substituted `native_root_id` makes `engine-order.cjs` refuse
   `WORKOUT_ORDER_IMPORT_DESCENT_UNPROVEN`. The module header should say that boundary instead
   of "digest-bound", since it cannot recompute a digest without the import lane (DECISIONS:480).
4. **MINOR - `attach()` will stamp `order.import_anchor` onto facts no order law derived.**
   It refuses a DISAGREEING anchor (LOM/8) but writes one when the field is absent. The
   property "the anchor is the one the law derived" therefore rests entirely on the wrapped
   `createEngineHistoryProjector` being the only source of facts on the page. That holds today:
   `local-source-basis.mjs` carries no `workout_facts`, and `gym-model.mjs:213` replaces the
   state's facts with the host's projection. Worth a named cell in S6.
5. **MINOR - the report's tails are stale against the sha it ships with.** `A1 TODAY BUILD
   PASS` reproduces here twice as `build earned-e788245c61be` (122 pinned inputs), not the
   reported `earned-6d56f63a25b0`; base is `earned-e30c5b13ec2e` with 121. The provider is 135
   lines, not 139. The report also names commit `150443b`. Nothing behavioural, but a tail that
   does not reproduce is not a tail; refresh them at merge.
6. **NOTE** - five added lines carry U+2014, all in `gym.test.mjs` (four comment lines and the
   A2 title, which is that file's own convention and was in the title being replaced). A1 and
   A5 both report no em/en dash in any athlete-visible string. LF only in all ten files.
7. **NOTE** - `LOCAL_SOURCE_ORDER_MAP_REQUIRED` is genuinely reachable: LOM-F drives the real
   controller's `reopen()` and `rollback()` and both refuse by name with the op count and the
   revision unmoved. The guard's op predicate agrees with the one P3-CSR5 uses.
8. **NOTE** - the mapping is built inside `createGymHost`, from a fresh `repository.load()`,
   so a card opened after an admission sees the selection; the cost is one extra load per host.

## WHAT I CONFIRMED OF THE AUTHOR'S CLAIMS

* `git diff --stat 07f1e4ba HEAD -- rebuild/engine` is EMPTY.
* Drift is exactly ten files. Against `packages/S5.json`: SEALED = `m3/w6/local/today-bindings.mjs`
  and `m3/w7-preview/today/test/gym.test.mjs`, the two the brief names; the other eight are
  declared by no package. Nothing undeclared by the brief moved.
* No assertion is deleted anywhere in the diff. P3-CSR5 keeps its old assertions and adds the
  native-session comparison plus a mutant install that really drops the workout. Page-bundle
  P3-B2 moves 136 to 137 with its reason written in.
* Suites (my runs, verbatim tails): provider `tests 10 pass 10 fail 0`; route `tests 13 pass 13
  fail 0`; p3-capture-start `14/14/0`; w7-preview/import `15/15/0`; lane D import/admission
  `52/52/0`; W6 `tests 586 pass 586 fail 0 duration_ms 9242.7176`; A0+coach `269/269/0`; client
  `18/18/0`; port `65/65/0`; `rig187 => PASS`; A1 PASS 122 inputs; A5 PASS 13 files, 11
  precached; today-17 `277/276/1` + `390/385/5`, all six reds byte-identity pins on
  today-bindings.mjs (N1.18, S10, N2-08, re-pin x2, P-MEASURE (g)), none behavioural;
  `b-package --ci --package S5` => `B PACKAGE S5 FAIL SEALED-PROFILE-RECOMPUTATION`, exit nonzero.
* The two suites the author calls environmental are environmental: `m4/import` (with s3 and
  browser-parity) is `103/89/14` on the candidate and `103/89/14` at the base, and W6 including
  `import-custody/` and `recovery-stage/` is `614/606/8` on both. Identical, so not B-LOM's.
