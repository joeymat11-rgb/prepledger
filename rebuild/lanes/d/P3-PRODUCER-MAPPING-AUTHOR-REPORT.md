# P3-PRODUCER-MAPPING — AUTHOR REPORT (lane D, Opus high)

DECISIONS:475 (3), the second blocker of :472. Worktree on `rebuild/d-p3-mapping` over the tip
`f7fe44d`; three junctions (root, w5, w6 `node_modules`). SYNTHETIC throughout: bundles sealed by
the real `port.cjs` from the public journey fixture through the accepted clean-init constructor,
as `w7-preview/import/test/support.mjs` does. No owner file was opened, listed or named.

## 1. What was built, and what it pins
`rebuild/m4/import/production-mapping.cjs` — the ONE production execution calendar and producer
mapping. It sits beside `local-source-profile.cjs` because that is the module whose `qualify()`
it satisfies field for field, and it pins that module's `PUBLIC_FACTORY_DIGEST` and `SOURCE_PINS`
by identity, not by copy; `m3/w6/host` holds page-safe MIRRORS of m4 modules and this mirrors
nothing. No `fs`/`path`/`crypto` import.

| field | value | recomputed from, by a cell |
| --- | --- | --- |
| `engine` | `{sha256 dd653bc170d3c5ae…c125052d, treeSha256 af5a187e0f55a307…2353f967, schemaV 60, path rebuild/engine/oracle-shim.cjs}` — the four fields `port.cjs:714` writes, no more | `port.cjs engineDigest()` over 18 modules, `SOURCE_PINS`, `oracle-shim __test.SCHEMA_V` |
| `engine_revision` | `M2-S5-TODAY-CHILD@0df73b01f3d2d935` | `coach/engine-revision.cjs`, re-derived from `receipts/S5.json` and rebuild.yml's standing `--package` |
| `gate` | `{clock:'2026-09-03', tz:'America/New_York'}` | `port.cjs GATE` |
| `id` | `earned/import/production-producer-mapping/<revision>` | the sealed package identity |
| `producers` | `earned/engine-workout-capture/v1`, `…/v2` | `m4/workout/engine-capture.cjs` PROFILE / CONFIGURATION_PROFILE |
| `dependencies.drafts` | `default-empty` | the walk's one declared input (`engine-provider.cjs`) |
| `calendar.zone` | **the device's resolved timezone**, never a literal | `Intl…resolvedOptions().timeZone`, read at qualify time |
| `calendar.range`/`.dates` | `2016-01-01`…`2032-12-31`; 68 rows, both sides of every US DST change in it | re-derived on the device by `qualify` |
| `calendar.native_date` | 4 parse + 3 constructor vectors | re-executed on the device |

## 2. The clockAt constraint, and what is NOT claimed
`clockAt` (`local-source-profile.cjs:36`) refuses unless `calendar.zone` equals the device's
resolved timezone; `qualify` separately requires `calendar.zone === mapping.gate.tz`, pinned by
law to `America/New_York`. A literal zone would be a claim about a phone this code cannot see;
reading it makes the two rules meet — on Joe's phone resolved to New York the mapping qualifies,
and on a phone that resolves to anything else it refuses SOURCE_ENGINE_CONTEXT_UNPROVEN instead
of clocking his history in a zone the gate was never run in (P3-M15). The dated rows stay New
York fact, so those vectors are evidence, not a tautology. Separately: `qualify` matches a row by
`material_digest`, which cannot exist before Joe's bundle does (brief §5), so the row is BOUND to
the material presented and that match is NOT a guard in production — the module's header says so.
Its guards are the engine identity, the gate and the calendar; the material is proved by the seal and by `source-admission.mjs:73`.

## 3. Production wiring — STOPPED, with the exact line
`createLocalSourceController` has NO production caller; every caller is TEST-ONLY. Measured with
the accepted A1 build (`buildToday()`, 121 pinned inputs): `browser-entry.mjs` **out** of the page
graph, `source-admission.mjs` **out**, `local-client.mjs` **in**, `rebuild/m4/import/` **0**
inputs — so injecting through `local-client.mjs` trips A1 at once, and exporting from `browser-entry.mjs` reaches no production caller. The line that must change first is
`rebuild/m3/w7-preview/today/build.mjs:51`, `["rebuild/m4/import/*", (p) => /^rebuild\/m4\/import\//.test(p)],` — a `today/**` byte, P3-IMPORT-UI-2's in S6 by :475 rule (1). I stopped there; this ticket moves no byte for wiring and edits no sealed file.

## 4. The bar, cell by cell (executed, real stores, no stubs)
| bar item | cells |
| --- | --- |
| a port.cjs-sealed bundle qualifies against the PRODUCTION mapping end to end through reviewSource -> prepareSource -> publish -> reconcile -> view, summer and winter | P3-P1 SUMMER 2026-09-16 EDT and P3-P1 WINTER 2026-11-20 EST, each re-deriving `basis.engine_digest` from `production-mapping.cjs` to prove WHICH mapping admitted |
| a bundle from a different engine identity refuses SOURCE_ENGINE_CONTEXT_UNPROVEN, mapping named | P3-P2 (engine dir copied to temp, one comment byte, real `port.cjs --engine` seal); control P3-P3 on the same day and path; unit form P3-M11 |
| the trip-wire goes red when `receipts/S5.json`'s sha changes | P3-M3; mutant run EXIT 1, `revision prefix does not match sha256(receipts/S5.json)`, file restored byte-equal |
| no fs/path import, and the A1 input law when included | P3-M9 (graph is exactly three files, no Node import); accepted bundler in a scratch copy: 4 inputs, 20,356 B, 0 node_modules, trips ONLY `rebuild/m4/import/*` (the entry :475 re-reasons), every engine name clear |
| every existing TEST-ONLY registry cell still green | W6 586/586 (incl. `local-source-admission`, `local-source-consumer`), w7 import 15/15, m4/import 83/83 |
| the zone rule holds wherever the phone is | P3-M6, P3-M14, P3-M15 |

## 5. Tails
- `production-mapping.test.cjs` 16/16 (P3-M0…M15) · `production-admission.test.mjs` 5/5 (P3-P0…P3) · `w7-preview/import/test/*.test.mjs` 15/15 · `local-source-consumer` 6/6 · m4/import 83/83
- W6 `w6/test/*.test.mjs` 586/586 · today-17 666/666 (53,352 ms) · port 65/65 · `rig187 ⇒ PASS`
- `b-package --ci --package S5` → **EXIT 0**; `PRODUCT IMPLEMENTED … 0 unlisted drift`; `PUBLIC CI EVIDENCE PASS`; `SEAL BASE ON THE TIP … f7fe44d`

## 6. Drift
`git diff --name-only f7fe44d HEAD` is three NEW files, none declared in `packages/S5.json`
(each `findstr`'d against it, no hit) — `rebuild/m4/import/production-mapping.cjs` and
`rebuild/m4/import/test/production-{admission,mapping}.test.{mjs,cjs}` — plus this report. New
files under a fixed root are undeclared, which is why `--ci` stays green, exactly as the
plan-edit companion's did (:473); S6 must declare the runtime file as product (role new) and add
the two suites to rebuild.yml. No engine byte, no `today/**` byte and no declared S5 file was
touched, so there is no WORKTREE-SOURCE-PIN or SEALED-PROFILE-RECOMPUTATION red.

## 7. Stops and open items
1. **Wiring** stops at `today/build.mjs:51` (§3) — P3-IMPORT-UI-2, S6.
2. **Runbook pre-check 6 caveat (:472)**: every admitting cell before this ticket qualified
   through a TEST-ONLY mapping, so it can be lifted only when this mapping is what the PHONE
   uses, i.e. after (1). I did NOT edit `P3-RUNBOOK.md`; naming it here is my whole change to it.
3. `m4/import/test/s3/harness.test.mjs` refuses under a bare glob (it wants its dispatcher's
   `S3_RUN_ROOT`): pre-existing, untouched, not a lane suite.
4. The range 2016-2032 is a reviewed judgement; a day outside it refuses at the reached
   operation naming that day, and widening is a reviewed edit here, never a runtime decision.
   `GATE-AUDIT-SPEC-P2` finding 2 is discharged by P3-M1 + P3-M11 + P3-P2.
