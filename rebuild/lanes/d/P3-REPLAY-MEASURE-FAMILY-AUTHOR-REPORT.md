# P3-REPLAY-MEASURE-FAMILY - the F7 replay family for the S5 measure ops (lane D author)

Branch `rebuild/d-p3-replay-measure` off the tip 9a381806 (:479). THE DEFECT (P3-IMPORT-UI-2 open item 1 / cell P3-X9 / its real-Edge run): `measure-host.mjs` opens the SAME installation
Today opens, so opening the Measure screen writes its records into the very generation admission replays; `source-admission.mjs`'s `replay()` had no family for them, fell to its catch-all
and refused `LOCAL_SOURCE_CONTEXT_UNRESOLVED`. Reproduced at both levels before anything was built.

## 1. The family and its rules
ONE family `F7` over ONE class, `body-composition-source`/`fact`, written by the ONE S5 producer `measure-commands.cjs` under three profiles: `earned/measure-trial-start/v1`,
`earned/waist/v1`, `earned/measure-markers/v1`. "A family per profile" is met by one family answering for each profile BY NAME, with its own dated member and its own validation; three copies
of one answer would be three places to drift. MEMBERSHIP by class alone: an owned op is a fact of one of the three profiles AND passes the producer's own `validate()`, or it is refused by
the NAMED code `LOCAL_SOURCE_MEASURE_UNRESOLVED` - a record dated after the day admission stands on included. Nothing of the class is dropped or reaches the catch-all: the module asserts
`retained + refused == owned`, throwing `MEASURE_REPLAY_ACCOUNTING` if that stops holding. NOT SESSION OR PROGRAMME EVIDENCE: no reading, daily, workout or programme projection and no engine
call; state is `retained`, never `projected`, and `state`, `calculation`, `order_map`, `workout_facts`, the session log and the programme, engine, source and material digests are
byte-identical with and without them. What moves, honestly, is `operation_digest` (three more ops really are there) and `interpretation_digest` (F7 names them). ORDERING by the record's OWN
dated field then `device_seq`: `payload.start`, `payload.entry.date`, and for the markers pick, a choice rather than an observation, `effective.local_date`. That orders the family's ACCOUNT,
not the store - ops are retained verbatim and S5's own readers keep their `device_seq` order, proved unchanged across a real admission. NEITHER CONFIRM NOR CONTRADICT the imported programme:
the baseline window stays the one `measure-baseline.mjs` derives from the import, day one stays the first ENROLLED record's date as S5 defines it, and an import writes NO op so it cannot
move. NOT weakened: the generic per-op engine-context check at the top of `replay()` still applies to measure ops and still raises `LOCAL_SOURCE_CONTEXT_UNRESOLVED`; that law is every
class's, and the family runs after it.

## 2. Files, hunks, drift
NEW `rebuild/m4/import/measure-replay.cjs` (139 lines): the family. No engine, clock, platform or fs; it takes the producer by INJECTION, so the admission lane states the rules and the
sealed producer states the shapes. MOD `rebuild/m3/w6/local/source-admission.mjs`, 3 hunks: two imports with the reason; one module-scope `measureFamily`; in `replay()` one
`if(measureFamily.owns(op))` placed FIRST in the class loop, so no measure op can reach the catch-all, plus a six-line block after it. MOD
`rebuild/m3/w7-preview/import/test/page-bundle.test.mjs`, 3 hunks: three MEASUREMENT figures re-measured and stated in place, old reason kept above the new - P3-B2 133 -> 134 modules,
P3-B3's refused list 6 -> 7 names, P3-B4's delta 12 -> 13. Nothing relaxed; P3-B3 is still exact. NEW `lanes/d/p3-replay-measure/measure-family.test.mjs` (6 cells), `measure-order.test.mjs`
(3 cells), this report. DRIFT is those two MOD files (both UNDECLARED by S5; :479 already carries "declare source-admission in S6"), `measure-replay.cjs` NEW and undeclared (`m4/import/**`
checked name by name against `packages/S5.json`), and the lane files. NO engine, `today/**`, `measure/**` or `packages/*.json` byte touched - `measure-commands.cjs` is S5-declared and is
READ, never edited. S6: declare `measure-replay.cjs` beside `source-admission.mjs`, and enumerate `lanes/d/p3-replay-measure/*.test.mjs` in `rebuild.yml` (no CI home yet).

## 3. Cells per bar item
(a) P3-RM1: open Measure (day one persisted, one waist, markers picked) THEN import a real sealed synthetic bundle through the real controller - ADMITS; Today and the gym card read the
imported lifts and reads through `admittedLocalSourceBasis`; the Measure screen's whole device-side view (day one, first-enrolled, waist, markers, sets, session dates, food days) is
`deepEqual` to before; the baseline column fills from the import's 8-week window and is empty without it. (b) P3-RM2: the reverse order still admits, and a mirror install in the (a) order is
compared member by member - trial inputs, imported state and the whole baseline array identical either way. (c) P3-RM3 (real install) + P3-MF3 (6 shapes: unknown profile, out-of-range waist,
non-date waist date, two-lift pick, trial start after today, a CORRECTION of the class the producer never writes) all refuse `LOCAL_SOURCE_MEASURE_UNRESOLVED`, never the catch-all; nothing
committed, no op minted, the file stays staged and rebase-required for the retract path. (d) P3-MF6/MF5: F1, F2, F4, F5 and F6 still answer with measure ops present, and a completed NATIVE
workout beside them still projects F3 and proves the programme; admission 19/19, retract 13/13, admission-swap 4/4, m4/import 86/86. (e) the 15 import cells and P2's witness (6/6) green. (f)
A1 PASS, 121 pinned inputs, UNCHANGED from the tip: nothing enters the page from this ticket, `source-admission.mjs` not being in the shipped graph on this branch. When P3-IMPORT-UI-2's
route lands the family enters as EXACTLY ONE module - its two reads (`measure-commands.cjs`, `client/ops.cjs`) are already in the page, which is why the measured delta moved by exactly one.
RED SIDE: before the wiring P3-MF1/2/3/5/6 and P3-RM1/2/3 were red, RM1 printing `["LOCAL_SOURCE_CONTEXT_UNRESOLVED" x3]`, one per measure op - exactly what P3-X9 pins; re-run with the one
branch disabled, then restored.

## 4. Verbatim tails (Node 24, TZ=America/New_York)
`m4/import` (MEASURED_TEST_NOW=2026-09-03) `tests 86 / pass 86 / fail 0` (production-* included); w7-preview/import + local-source-consumer + local-source-admission + retract +
admission-swap `tests 57 / pass 57 / fail 0`; this ticket's own `tests 6 / pass 6 / fail 0` and `tests 3 / pass 3 / fail 0`; W6 `tests 586 / pass 586 / fail 0`; today-17 `tests 645 / pass
645 / fail 0`; measure page-stack + hermetic `tests 32 / pass 32 / fail 0`; coach `tests 231 / pass 231 / fail 0`; port `tests 65 / pass 65 / fail 0`; preflight/registration/reason-on-disk
`tests 85 / pass 85 / fail 0`; `rig187 => PASS`; `A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client)`; `b-package --ci --package S5` EXIT 0, `0 unlisted drift`, `B
PACKAGE S5 PUBLIC CI EVIDENCE PASS`.

## 5. Open items
1. P3-X9 MUST BE RE-REASONED on `rebuild/c-p3-import-ui-2`: its own comment asks whoever teaches the import lane this family to come back and say so, and this is that. It now asserts a
   refusal that no longer happens and should become the positive cell; that branch's open item 1 and its runbook line "do not open Measure before importing" both close.
2. SLEEP HAS THE SAME HOLE AND THIS TICKET DID NOT FIX IT. Class `sleep` (`earned/sleep-night/v1`) is named nowhere in `replay()`, so a night recorded before importing takes the same
   catch-all. PROBED here, not assumed: it refuses `LOCAL_SOURCE_CONTEXT_UNRESOLVED` on the op id. Joe uses the Sleep screen, so his real port would still refuse for that reason alone. It
   wants its own lane D ticket; until then the runbook must say "do not open Sleep before importing" exactly as it said for Measure. The check-in (F5, class `event`) is fine.
3. The family refuses a correction or tombstone of the measure class by name rather than interpreting it. The producer writes neither, so nothing is lost today; a later Measure undo teaches
   the family that edit rather than widening the class.
CI note (integrator): run 35154496702 at 951858f7 was red on windows-latest only, in S5-sealed measure/test/journey.test.mjs cells (a) and (d) (80 s render then null element), ubuntu green, PC green 666/666 for author and both reviewers; known one-OS flake class (DECISIONS:467); retriggered with this line.
