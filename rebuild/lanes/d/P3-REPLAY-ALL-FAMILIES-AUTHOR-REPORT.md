# P3-REPLAY-ALL-FAMILIES - a replay family for every writer the shipped page has (lane D author)

Branch `rebuild/d-p3-replay-all` off the measure family at 53e1ae78. THE DEFECTS, both reproduced before anything was built. (1) RV-S1: `sleep-host.mjs` opens the SAME installation Today opens, so ONE
recorded night lands in the very generation admission replays; `source-admission.mjs`'s `replay()` had no family for class `sleep`, fell to its catch-all and refused `LOCAL_SOURCE_CONTEXT_UNRESOLVED`.
Reproduced through the REAL host on a real installation: `SLEEP SAVE ok:true` then `ADMIT {"admitted":false,"codes":["LOCAL_SOURCE_CONTEXT_UNRESOLVED"]}`. Joe logs nights daily, so his real port
refused for that reason alone. (2) RV-G4: `body-composition-source` is an ACCEPTED A4 class, not one lane's - `rebuild/authority/validate.cjs` validates a LEAN-SOURCE payload under it that carries no
profile at all - and F7 owned the whole class by class alone, so that payload was refused `LOCAL_SOURCE_MEASURE_UNRESOLVED`, in the name of a family that never had anything to say about it.

## 1. The enumeration (writer -> family -> rule)
DERIVED, NOT LISTED. `lanes/d/p3-replay-all/writer-enumeration.test.mjs` builds the page through the SAME `buildBrowser` A1 uses, reads the pinned input inventory, and greps THOSE files for a class in
an op-building position (`class: "<C>"` / `OP_CLASS = "<C>"`, a dot in front disqualifying a read such as `op.class`). It found EIGHT writer modules and TEN (module, class) pairs, and checks them both
ways against the declared register `rebuild/m4/import/replay-registry.cjs`: a writer with no entry fails, an entry with no writer fails. Proved RED by removing one entry: `["...sleep-commands.cjs#sleep"]`.

| writer (module#class) | family | rule (evidence role; ordering; never rewritten or dropped; malformed) |
| --- | --- | --- |
| `client/index.cjs#reading` | F1 | session evidence; PROJECTED by the accepted reading projector in date order, one per day, never before the import's last read; `LOCAL_SOURCE_READING_UNRESOLVED` |
| `today/food-commands.cjs#food-day` | F2 | session evidence for its day; winning row per date PROJECTED; a date the import holds is not overwritten; `LOCAL_SOURCE_DAILY_UNRESOLVED` |
| `client/index.cjs#session`, `m4/workout/commands.cjs#session` | F3 | programme evidence; PROJECTED, proves the imported programme at its own start day, order map fixes the order; `LOCAL_SOURCE_WORKOUT_UNRESOLVED` |
| `today/setup-commands.mjs#event` | F4 | programme evidence; the document admission proves the file against; RETAINED once proved; exactly one; `LOCAL_SOURCE_PROGRAMME_UNRESOLVED` |
| `coach/machine-settings-commands.cjs#event` | F4 | no evidence role; RETAINED against a lift the replayed state really holds; `LOCAL_SOURCE_CONTEXT_UNRESOLVED` |
| `today/checkin-commands.cjs#event` | F5 | no evidence role; one per day RETAINED, never projected; `LOCAL_SOURCE_CONTEXT_UNRESOLVED` |
| `measure/measure-commands.cjs#body-composition-source` | F7 | no evidence role; RETAINED in its own dated order; baseline window stays the import's; `LOCAL_SOURCE_MEASURE_UNRESOLVED`, and the class's own code for a non-measure member |
| `today/sleep-commands.cjs#sleep` | **F8 (new)** | no evidence role: nights are athlete records, not session or programme evidence; ordered by `payload.night.date` then `device_seq`; RETAINED, never projected, so a night before the import's last day is neither contradicted nor absorbed; `LOCAL_SOURCE_SLEEP_UNRESOLVED` |
| `client/index.cjs#plan` | none, **not-in-generation** | no shipped screen route reaches `planEdit`/`respond`/`decision`/`undoRequest`/`acceptInitialPlan` - P3-EN3 proves that by reading the page's own modules - and the local era has no plan lane; `LOCAL_SOURCE_EFFECT_UNMAPPED` |

F6 answers for the SOURCE state's own historical decisions rather than for a writer, so it is not a register entry; P3-EN2 asserts it has not left. `m4/workout/edit-history.cjs` reads `op.class` and is
correctly NOT a writer. Coach consent/issuance (`coach/tools.cjs`, P6) is not in the page graph at all.

## 2. Families added, and the shared class
NEW `rebuild/m4/import/sleep-replay.cjs` (F8, 126 lines): the N2 producer by INJECTION, no engine, clock, platform or fs; `owns` by class, `read` by profile + the producer's own `validate()`, order by
the night's own date then `device_seq`, `replay()` asserting `retained + refused == owned` (`SLEEP_REPLAY_ACCOUNTING`). It makes NO engine call - in particular not `sleepSpanH` - so it cannot invent an
hours figure, and writes nothing into `state.sleep.nights`. NEW `rebuild/m4/import/body-composition-class.cjs` (111 lines): the shared class routed BY PROFILE. Each member family names the profiles it
answers for; an operation whose profile no family claims refuses `LOCAL_SOURCE_BODY_COMPOSITION_UNRESOLVED` WITH the profile it carried. A correction/tombstone carries no profile of its own, so it is
routed by its TARGET's - which is why an edit of a measure record is still F7's to refuse, by F7's name. Two families claiming one profile is refused at construction. NEW
`rebuild/m4/import/replay-registry.cjs`: the register, one entry per (module, class), each stating its evidence role first.

## 3. Files, hunks, drift
MOD `rebuild/m3/w6/local/source-admission.mjs`, 4 hunks: two import blocks with their reasons; two module-scope constants (`bodyComposition`, `sleepFamily`); in `replay()` the class loop now routes
`bodyComposition.owns` and `sleepFamily.owns` FIRST, and one block after the loop runs F8. NOTHING was relaxed and no generic law weakened: the per-op engine-context check at the top of `replay()` still
applies to both classes and still raises `LOCAL_SOURCE_CONTEXT_UNRESOLVED`; the families run after it. MOD `rebuild/m3/w7-preview/import/test/page-bundle.test.mjs`, 3 hunks: three MEASUREMENT figures
re-measured and stated in place with the old reasons kept above - P3-B2 134 -> 136 modules, P3-B3's refused list 7 -> 9 names (still EXACT), P3-B4's delta 13 -> 15. MOD
`rebuild/lanes/d/p3-replay-measure/measure-family.test.mjs`, 2 hunks: ONE expectation moves, RV-G4's. P3-MF3's first case, a fact of the measure class under a profile F7 was never taught, now refuses
the CLASS's code instead of the family's; every other case is untouched, each still refuses by a NAMED code and none reaches the catch-all, and the case now asserts a MORE specific code than before, not
a weaker one. MOD `rebuild/lanes/c/P3-RUNBOOK.md`: pre-check 8, below. NEW `lanes/d/p3-replay-all/` (4 cell files) and this report. DRIFT is those four MOD files plus the three NEW `m4/import` modules
and the lane files; ALL EIGHT touched paths are S5-UNDECLARED (checked name by name against `lanes/b/tooling/packages/S5.json`). NO engine byte, no `today/**`, no `measure/**`, no `sleep-*`, no
`gym-*`, no `client/**`, no `coach/**` and no `packages/*.json` byte is touched - every producer is READ, never edited. S6: declare `sleep-replay.cjs`, `body-composition-class.cjs` and
`replay-registry.cjs` beside `source-admission.mjs`, and enumerate `lanes/d/p3-replay-all/*.test.mjs` in `rebuild.yml` (this lane still has no CI home, exactly as P3-REPLAY-MEASURE-FAMILY recorded).

## 4. Cells per bar item
(a) ENUMERATION P3-EN1/2/3 (3): the register and the page graph agree name for name; every entry names a family admission REALLY runs or a code admission REALLY raises, and states its evidence role
first; the one not-in-generation entry is PROVED by reading the page's modules rather than asserted. RED side: one entry removed -> P3-EN1 names the orphaned writer. (b) F8's own cells P3-SF1..SF5 (5):
the nights admit and are RETAINED in their own night order (the 09-01 night written SECOND comes FIRST), retained VERBATIM; `state`, `state.sleep`, `calculation`, `order_map`, `workout_facts`, the
session log and the programme/engine/source/material digests are byte-identical with and without them, while `operation_digest` and `interpretation_digest` honestly move; SEVEN malformed shapes (unknown
profile, out-of-bounds duration, non-date, both shapes at once, an unfinished night, a forged check-in citation, a tombstone the producer never writes) each refuse `LOCAL_SOURCE_SLEEP_UNRESOLVED` and
never the catch-all, with nothing committed; nothing is dropped and the family owns exactly its class; F1-F7 all still answer beside them. (c) RV-G4 P3-CM1..CM4 (4): the authority's own lean-source
payload - asserted valid by `Validate.payloadValid` first, so the cell is about a missing family and not a bad shape - refuses the CLASS code and NOT the measure one; the three measure profiles still
route to F7 and an edit routes by its target; nothing of the class is dropped and ambiguous membership is refused at construction; and the same through the REAL controller. (d) PER-WRITER, REAL
INSTALLATION, BOTH ORDERS P3-WO1/WO2 x 7 (14): weigh-in, food day, gym session, machine note, check-in, Measure (day one + waist + markers) and a recorded night, each through its OWN real host on its own
real era with a real sealed bundle - used BEFORE importing and used AFTER. Six of seven admit in both orders, the named family answers, Today and the gym card read the imported lifts and reads, and the
screen that wrote it reads exactly what it read before. (e) the 15 import cells, the 9 measure cells and the P2 witness are green; A1 unchanged at 121 pinned inputs.

## 5. The one writer that remains, and the runbook
THE GYM CARD. A workout recorded BEFORE importing is ANSWERED by F3 - it never reaches the catch-all and no family is missing - but F3's own law refuses it: the session was prescribed from the pre-import
athlete, so under the imported basis its start record comes back with issues and `m4/workout/engine-order.cjs` raises `WORKOUT_ORDER_START_INTERPRETATION_REQUIRED`, which admission reports as its own
`LOCAL_SOURCE_WORKOUT_UNRESOLVED` with nothing committed and the file left staged. Membership is NOT the cause - it was checked: native and imported `sessionMembership` agree on that day. That is the
accepted law of the workout lane (`integration_pending: ['local-capture-start-resume']`), not a replay gap. So `rebuild/lanes/c/P3-RUNBOOK.md` pre-check 8 WITHDRAWS the "do not open Measure before
importing" instruction and the one asked for for Sleep, names the six writers that may now be used in any order, and keeps ONE line: do not start a workout before the import is admitted. The cell that
proves it also fails if it ever starts admitting, so the line cannot outlive its reason.

## 6. Verbatim tails (Node 24, TZ=America/New_York)
`m4/import` (MEASURED_TEST_NOW=2026-09-03) `tests 86 / pass 86 / fail 0`; retract + admission-swap + local-source-consumer + local-source-admission + production-admission + production-mapping `tests 66
/ pass 66 / fail 0`; w7-preview/import (the 15 import cells + the P2 witness) `tests 15 / pass 15 / fail 0`; the measure family's 9 cells `tests 9 / pass 9 / fail 0`; this ticket's own cells `tests 3 /
pass 3 / fail 0`, `tests 5 / pass 5 / fail 0`, `tests 4 / pass 4 / fail 0`, `tests 14 / pass 14 / fail 0`; W6 `tests 586 / pass 586 / fail 0`; today-17 (MEASURED_TEST_NOW=2026-09-03) `tests 666 / pass
666 / fail 0`; port `tests 65 / pass 65 / fail 0`; `rig187 ⇒ PASS`; `A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client)`. `b-package --ci --package S5` is `B PACKAGE S5 FAIL
SEAL-BASE-IS-NOT-THE-CHAIN-TIP` - a BASE condition, not this ticket's: `git merge-base --is-ancestor origin/rebuild/t2-client-core HEAD` is NO for 53e1ae78 against the tip e4c1bd6b (DECISIONS:480), so
the check refuses on position before it reads a byte. It passes on a HEAD that descends from the tip, and every path this ticket touches is S5-undeclared, so a rebase by the PM is what clears it.

## 7. Open items
1. A WRITER-SIDE DEFECT THIS TICKET FOUND AND DID NOT FIX (no writer byte is touched here). `food-host.mjs` and `machine-settings-host.mjs` pin `clientClockFor(day)` - the NON-live branch, `-05:00`
   year-round and `monotonicMs: () => 0` - while the shipped page opens its installation on the S4 LIVE clock. Reproduced on a real live era: both saves come back `ok:false, state 20, "Connect once to
   keep saving ... after 2027-10-09"`, so nothing is written at all. Sleep, Measure, the weigh-in and the check-in inherit the era's clock and are unaffected. It wants its own lane ticket; until then the
   food and machine-settings cells here stand the installation on the pinned clock, which is stated in the cell file and is why they use a winter EST day.
2. P3-X9 on `rebuild/c-p3-import-ui-2` still asserts a refusal that no longer happens, and the same is now true of anything that pins the SLEEP refusal. Both should become positive cells when that branch
   next moves; P3-REPLAY-MEASURE-FAMILY open item 1 is unchanged and open item 2 is CLOSED by this ticket.
3. The lean-source payload has no writer in the shipped page, so the shared class has exactly one member family today. When a lean-source writer lands it needs its own family and its own register entry;
   until then the class refuses it by name and the enumeration cell is what will say so.
