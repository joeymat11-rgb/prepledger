# M2 module 1 — builder ASTRA

Read-side extraction candidate on `rebuild/m2-engine-1`, based on
`911e3ae02194380e9baaccbe255de58a3ad02a33` (`rebuild/t2-client-core`).
All required executed gates below pass. The owner ruled that `_mintJointEarn`
is excluded from module 1 and moves to module 5/6 with reconcileSightings.
The read side is complete within that corrected boundary; neither writer is
copied or stubbed, and the frozen rules remain unchanged.

## 1. Source and module map

Source is **src/app.jsx @ fe516c1 (v7.56.0 / schema 60)**, not the older app.jsx
checked out on the rebuild base (v7.55.9 / schema 59). A detached source checkout
provides the frozen bytes; the rebuild base's app stays untouched. Source Git blob:
`f98671d823f0d8cd83e730cdd930afe5f5e7b628`.
The final manifest's three engineCommit entries now name fe516c1; its status
sentence still begins PROVISIONAL because the unchanged golden writer hardcodes it.
The earlier stop at base 672fe10 was correct; the new committed pins clear that stop.

| File under rebuild/engine | Physical lines |
| --- | ---: |
| dates.cjs | 26 |
| constants.cjs | 399 |
| seed.cjs | 262 |
| plan.cjs | 333 |
| progression.cjs | 794 |
| index.cjs | 22 |
| oracle-shim.cjs | 25 |
| test/census-partial.cjs | 186 |
| test/defect-witnesses.cjs | 77 |

Every copied declaration carries a frozen-source range comment. Independent AST
comparison matched **113 foundation declarations/IIFE and 57 plan/progression
functions**, with **one authorized rewrite**: todayStart. Internal strings,
comments, operands, rounding, defaults and ordering remain unchanged. No frozen
defect listed in §9 was repaired. HISTORY comes from frozen src/history.js:2;
EXERCISES app.jsx:386–432, SEED 435–517, DAY 305, ROLLUPS 626. Constants contain
110 names: all 78 explicit/family RECON requirements checked, plus their domain
companions (including T_CRIT_95 and FLAT_HALFWIDTH). UI palette/theme/layout
constants, dead REFEED/PROTEIN/FAT_FLOOR declarations and lab constants are excluded.
The brief explicitly requests NOW_DOORS/TRAIN_DOORS/STATUS_WORDS, so they remain.

| Module | Copied function | Frozen app.jsx lines |
| --- | --- | --- |
| dates.cjs | mk | 306–306 |
| dates.cjs | isoOf | 307–307 |
| dates.cjs | todayStart | 308–308 |
| dates.cjs | daysUntil | 309–309 |
| dates.cjs | fmtShort | 310–310 |
| dates.cjs | weeksBetween | 311–311 |
| seed.cjs | weekRollups | 597–625 |
| seed.cjs | exById | 633–633 |
| seed.cjs | weave | 520–594 |
| plan.cjs | dayType | 656–667 |
| plan.cjs | forkFrom | 1773–1776 |
| plan.cjs | resetForksOf | 1795–1797 |
| plan.cjs | forksOf | 1798–1805 |
| plan.cjs | eraIdx | 1806–1810 |
| plan.cjs | sameEra | 1811–1814 |
| plan.cjs | nameAt | 1818–1830 |
| plan.cjs | pinsUnfilled | 1833–1835 |
| plan.cjs | pinsBornOf | 1844–1846 |
| plan.cjs | _bornValid | 1858–1858 |
| plan.cjs | exActive | 1859–1867 |
| plan.cjs | canonicalizePlan | 1876–1987 |
| plan.cjs | normalizePlan | 1988–2007 |
| plan.cjs | deriveInsertionSeams | 2037–2071 |
| plan.cjs | applyInsertionSeams | 2072–2089 |
| plan.cjs | eraFresh | 2093–2110 |
| plan.cjs | forkExposures | 2112–2129 |
| progression.cjs | progressStep | 926–959 |
| progression.cjs | progressAnchor | 970–995 |
| progression.cjs | maxedOut | 1003–1005 |
| progression.cjs | _padFrom9 | 1019–1022 |
| progression.cjs | _loadTenure | 1034–1046 |
| progression.cjs | _formerNames | 1064–1070 |
| progression.cjs | _volDeltas | 1071–1087 |
| progression.cjs | _setsAtTime | 1098–1112 |
| progression.cjs | targetsFor | 1113–1159 |
| progression.cjs | proposeLadder | 1196–1229 |
| progression.cjs | loadRungs | 1258–1262 |
| progression.cjs | debutDebit | 1271–1274 |
| progression.cjs | nextLoad | 1275–1287 |
| progression.cjs | prevLoad | 1289–1298 |
| progression.cjs | snapLoad | 1300–1305 |
| progression.cjs | deloadLoad | 1310–1319 |
| progression.cjs | parseRungs | 1321–1324 |
| progression.cjs | repsLostOnJump | 1376–1385 |
| progression.cjs | windowFor | 1387–1396 |
| progression.cjs | coarseLifts | 1398–1401 |
| progression.cjs | progressionSetCount | 1414–1457 |
| progression.cjs | atTopOfWindow | 1458–1468 |
| progression.cjs | buildRirSets | 1649–1657 |
| progression.cjs | deriveLastMeta | 1664–1677 |
| progression.cjs | rirSetsOf | 1679–1686 |
| progression.cjs | rirReceipt | 1704–1711 |
| progression.cjs | paceRushed | 1738–1738 |
| progression.cjs | openerRir | 1740–1740 |
| progression.cjs | terminalRir | 1742–1742 |
| progression.cjs | typicalError | 2130–2160 |
| progression.cjs | beatsNoise | 2162–2174 |
| progression.cjs | _deriveSightingFull | 2220–2262 |
| progression.cjs | deriveSighting | 2263–2263 |
| progression.cjs | sessionScore | 3145–3155 |
| progression.cjs | _tCrit | 3160–3160 |
| progression.cjs | liftTrend | 3182–3267 |
| progression.cjs | progressionTrend | 3273–3372 |
| progression.cjs | nightsBefore | 6994–6996 |
| progression.cjs | cleanAtDate | 6997–7010 |
| progression.cjs | dayWeather | 12419–12437 |

The factory functions, E forwarding wrappers, createEngine, oracle-shim clock/id
closures, and test-runner helpers are new wiring, not copied app functions.
Each engine owns its E, constant objects, HISTORY, EXERCISES and woven SEED.
Independent object-graph checking found no shared objects between two instances;
mutations and changing injected clocks stayed isolated.

## 2. Executed gates

Environment: Node 24.19.0; esbuild 0.28.1; Windows; TZ America/New_York.
Partial/suite clock: 2026-09-03. Strict app gate: MEASURED_TEST_NOW unset, so its
own 2026-07-29 default remains authoritative. Commands from repo root:

`node rebuild/engine/test/census-partial.cjs` (ENGINE_MAIN points to rebuilt fe516c1)

`node rebuild/conform/run.cjs` and `node rebuild/conform/run.cjs --selftest`
(ENGINE_MAIN=fe516c1, ENGINE_OLD=a0009c3)

`node scripts/check.mjs --strict` (MEASURED_TEST_NOW unset)

All exit 0. Partial tail, including the private **verdict only**:

```text
GREEN M2-1 manifest: fe516c1 / v7.56.0; clock, zone and census version pinned
GREEN M2-1 preimage-2026-08-15: fixture/golden/stamp pins; frozen migrated snapshot matches golden
GREEN M2-1 synthetic-pending-debut: fixture/golden/stamp pins; frozen migrated snapshot matches golden
GREEN M2-1 SEED: canonical byte equality to frozen __test.SEED in both Date modes
GREEN M2-1 preimage-2026-08-15 Date=frozen: lifts + progression byte-identical (128 leaves)
GREEN M2-1 preimage-2026-08-15 Date=unfrozen: lifts + progression byte-identical (128 leaves)
GREEN M2-1 preimage-2026-08-15: frozen/unfrozen Date outputs identical; clock still injected
GREEN M2-1 synthetic-pending-debut Date=frozen: lifts + progression byte-identical (15 leaves)
GREEN M2-1 synthetic-pending-debut Date=unfrozen: lifts + progression byte-identical (15 leaves)
GREEN M2-1 synthetic-pending-debut: frozen/unfrozen Date outputs identical; clock still injected
GREEN M2-1 live: [private fixture: detail withheld in code]
PASS M2-1 partial census: all required blobs; two Date modes; migration once per fixture
```

Full unchanged conformance SUMMARY:

```text
== SUMMARY
OK   0 clock and zone set and equal to the oracle manifest — run 2026-09-03/America/New_York manifest 2026-09-03/America/New_York
OK   0 engine artifacts present (main + old) — a missing engine is BAD, never SKIP — {"main":"C:\\Users\\joeym\\Documents\\Codex\\2026-09-04\\read-rebuild-t3-brief-md-and\\work\\m2-artifacts\\engine-main.cjs","old":"C:\\Users\\joeym\\Documents\\Codex\\2026-09-04\\read-rebuild-t3-brief-md-and\\work\\m2-artifacts\\engine-old.cjs"}
OK   1 inventory laws/sheet-A-authority.cjs == frozen manifest (34 laws, family authority)
OK   1 inventory laws/sheet-B-client.cjs == frozen manifest (35 laws, family client)
OK   1 inventory laws/d13-d14.cjs == frozen manifest (20 laws, family policy)
OK   1 inventory laws/progression.cjs == frozen manifest (9 laws, family progression)
OK   1 inventory laws/soak.cjs == frozen manifest (1 laws, family authority)
OK   1 inventory global ids unique and total == frozen total — 99 vs frozen 99
OK   2 port oracle main-vs-main under the manifest — all GREEN and exactly the frozen PORT ids — 10 ids
OK   3 sensitivity: every leaf compared + semantic mutants DETECTED + old-vs-main DETECTED, exactly the frozen PORT ids — 13 ids
OK   6 adapter loading: only an exact MODULE_NOT_FOUND counts as absent; any other load failure is HARNESS_ERROR — present: authority,client
OK   4 reference laws/sheet-A-authority.cjs: all GREEN — 34/34 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/sheet-A-authority.cjs: every law STRONG — 34 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/sheet-A-authority.cjs: family authority present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 34 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   4 reference laws/sheet-B-client.cjs: all GREEN — 35/35 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/sheet-B-client.cjs: every law STRONG — 35 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/sheet-B-client.cjs: family client present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 35 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   4 reference laws/d13-d14.cjs: all GREEN — 20/20 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/d13-d14.cjs: every law STRONG — 20 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/d13-d14.cjs: family policy absent → all RED(as specified), 0 DEFECT, 0 HARNESS_ERROR — 0 GREEN · 20 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   4 reference laws/progression.cjs: all GREEN — 9/9 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/progression.cjs: every law STRONG — 9 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/progression.cjs: family progression absent → all RED(as specified), 0 DEFECT, 0 HARNESS_ERROR — 0 GREEN · 9 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   4 reference laws/soak.cjs: all GREEN — 1/1 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/soak.cjs: every law STRONG — 1 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/soak.cjs: family authority present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 1 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   7 privacy: every private-fixture law line in the log is verdict-only (detail withheld in code) — 14 private lines
OK   8 gate artifacts verified (files present, hashes match, results pass, clock matches) — 10 gates
OK   8 coverage: every TESTED section's ids exist, every law id is covered by a section, every gated section's gates verified — {"TESTED":26,"SEPARATELY_GATED":2,"DEFERRED":2}
INFO 9 engine-track rig185: 
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
```

```text
== SELFTEST
OK   selftest (a) adapter that throws at require → INCONSISTENT
OK   selftest (a) adapter with a syntax error → INCONSISTENT
OK   selftest (a) adapter with a missing transitive dependency → INCONSISTENT (not treated as absent)
OK   selftest (b) no adapters → CONSISTENT, every family RED
OK   selftest (b) client-only → CONSISTENT, client family GREEN, authority family still RED
OK   selftest (b) authority-only → CONSISTENT, authority + soak GREEN, client still RED
OK   selftest (b) both → CONSISTENT, both families GREEN, policy/progression still RED
OK   selftest (c) a deleted law → INCONSISTENT (inventory)
OK   selftest (c) a renamed law → INCONSISTENT (inventory)
OK   selftest (d) privacy canaries (count, queue text, feed text, lift name, nested rule, note) never reach stdout or the log — 0 leaked across golden/check/sensitivity output + log
SELFTEST PASS
```

Strict gate tail (this checks the rebuild base's frozen v7.55.9 app, not the new
engine; the partial census separately checks v7.56.0 extraction):

```text
Suite
  PASS  engine suite — 2951 assertions passed
  PASS  render smoke — RENDER-SMOKE: all tabs alive in all states — no silent fallbacks
  PASS  dom smoke — DOM-SMOKE: the shipped bundle boots clean, both hostile-storage boots banner without touching the blob, and reset over a corrupt blob stashes before it overwrites
  PASS  split smoke — SPLIT-SMOKE: both modes drive the debut load and the pre-upgrade draft through the REAL handlers — render, type, finish, persist
  PASS  beacon smoke — BEACON-SMOKE: records faults, redacts tokens, and cannot break the app

Gate
  PASS  app.js matches a fresh build of src/ (1069 KB)
  PASS  no tool runs esbuild's binary through node — the build API is the only path, so the gate means the same thing on Windows, Linux and CI
  PASS  contrast audit: 124 resolved pairs, both themes, all >= 4.5:1
  PASS  affordance lint: the tap-color grammar holds (gauge tappable, jade/orange state, brass never a control)
  PASS  SYNC-LAWS: 17 laws hold across 56 committed seeds · superset exemption taken 8× (14431, 14433, 14434, 14435) — convergence, associativity, idempotence, non-shrink, correction survival, athlete-word priority, stamp/value coupling, load-on-ladder, receipt truth, reseed integrity
  PASS  the suite reads no moving file — 9 gate readers pinned to the frozen preimage (ledger-preimage-2026-08-15.json); ledger/state.json is exercised out of band
  PASS  APP_V 7.55.9 === sw cache earned-v7.55.9
  PASS  health data stays unreadable from the public site
  PASS  no token-shaped string anywhere in the tree
  PASS  117 files ship; ledger/, src/, tools/ and scripts/ stay off the CDN
  PASS  CI parses, deploy needs test, production is main-only, ship merges and never rebases
  PASS  engine outputs byte-identical to the frozen baseline (R15 freeze)

All checks passed. Safe to ship.
```

The informational rig185 does **not** succeed: a0009c3 has no _setsAtTime, and
rig185's source-slice loader throws `TypeError: setsAtTime is not a function`.
run.cjs ignores that informational process status and still exits 0. No gate was
edited to hide this; the blank INFO 9 verdict above is reproduced verbatim.
The 29 absent policy/progression adapter laws remain RED-as-specified; this module
does not implement those rebuild policy families.

Windows preparation: the committed build-engines script uses POSIX URL/path
handling. A scratch helper performed the same pinned esbuild operation with
Windows paths and source-worktree checks. Artifacts stayed outside the product.
Bundle hashes differ from the integrator's packaging hash, as the committed build
script documents; their census must match the pinned golden. Private live.json
was regenerated only from fe516c1. The omitted private golden was restored from
the frozen census and published stamp **only after the entire byte stream matched
the pre-existing goldenSha256**. No new golden, manifest or pin was cut or changed.
No private contents were printed or included in this report, tests or commit.
The final strict run includes all new staged paths. Windows sandbox directory
resolution first prevented esbuild from loading src/main.jsx; the same unchanged
gate passed outside that restriction with a process-local Git safe-directory setting.

## 3. Clock and memo inventory

One ambient-clock source site rewritten: app.jsx:308 todayStart now returns
mk(clock.today()). daysUntil:309 preserves its Math.round and routes through that
function. mk:306, isoOf:307, fmtShort:310 and weeksBetween:311 keep explicit local-date
arithmetic. Five reader defaults indirectly use todayStart unchanged:
progressAnchor:983; progressionSetCount:1421; eraFresh:2104; typicalError:2132;
liftTrend:3188. dayWeather:12428 keeps its explicit-argument Date arithmetic.

No ambient Date construction or Date.now call remains in the product. A trapping
Date implementation recorded **zero attempted ambient reads**, including attempts
that a copied try/catch might swallow. The shim creates local noon from explicit
numeric date arguments and supplies today/hour/dow/nowISO/nowMs/tz; seeded ids are
provided but unused by these readers. Its process.env reads are test-boundary
configuration, not domain logic.

No WeakMap/shared memo is in this extraction. typicalError's fkCache:2133–2134 is a
call-local object, rebuilt each call. SEED's weave mutation and ROLLUPS evaluation
are preserved but happen per engine factory, not once globally. The larger-engine
identity memos named by RECON remain outside Module 1.

## 4. Bite and restore

Temporarily wrapped targetsFor to add one rep to its first returned target, with
the original calculation otherwise untouched. The partial gate exited 1 by
comparison: 16 differing public-preimage target paths and 2 synthetic paths in
**each** Date mode; private verdict FAIL. No candidate exception substituted for
a failed assertion. Restored the original bytes in a finally block and reran the
full partial gate: PASS in both modes on every required blob.

Restored progression.cjs SHA256:
`a2c0aa0361902f3d0e28f2e3315774177e9a7a5c966d31d0f0757cf467bfc706`.

## 5. SEAMS — complete extraction/gate inventory

1. Frozen-source checkout: source is fe516c1, while the named rebuild base retains
   the older app. This is necessary to reproduce the final golden without touching
   the frozen base files; it is not a source rewrite.
2. Factory-local E forwarding preserves cyclic call names without importing the
   monolith. Constants and seed data move to per-instance ownership. IDs are accepted
   but unused; no replacement writer is invented.
3. Read closure adds thirteen supporting functions from RIR/trend/sleep/weather
   sections (the function map identifies every one). Omitting dayWeather or
   cleanAtDate would let copied catch blocks silently substitute different behavior.
   No placeholder predicate is used.
4. The oracle offers no partial mode. census-partial uses the **unchanged** census
   and harness, then projects only lifts and progression. Its test-only migrate
   function is identity over one JSON dump of each golden-migrated state; it does
   not test candidate migration. No golden selector enters the candidate table.
5. Unimplemented energy/Today selectors remain absent. The frozen census catches
   their absence, but their sections are outside this comparison. All tested names
   are explicitly required to exist; THREW in a compared group fails closed.
6. Each Date mode runs in a fresh child process, receiving the same in-memory
   snapshot. The unfrozen worker restores native Date **before** loading the
   candidate. Both modes match pinned groups and each other; no migrated snapshot
   is committed. Private subprocess output is captured and never forwarded.
7. The tests pin the mandated clock, timezone, final source label and fixture/
   golden/stamp hashes. Default requires all three blobs; --public is a labelled
   subset, not full acceptance. Locally rebuilt packaging SHA is provenance, not
   a substitute golden. Canonical SEED equality is separately enforced.
8. deriveSighting and _volDeltas are required callable and evaluated by census,
   but remain OPTIONAL in the frozen oracle and are not part of lifts/progression
   acceptance. Synthetic defect witnesses and exact-source checks additionally
   exercised them; this does not claim the oracle covers every behavior.
9. _mintJointEarn:2277–2318 is excluded by the owner's explicit ruling because it
   calls earnWalk:2304 and writes feed:2314. It moves to module 5/6 with
   reconcileSightings. There is no stub or silently false writer.
10. The base's strict app test, copied-source comparisons, partial census and defect
    witnesses establish different claims. None is presented as a full extracted
    engine/migration/merge/production-system gate.

## 6. RECON / brief corrections (not edited)

The final pin prerequisite is now met, but RECON's introduction still calls it
provisional. RECON's function line counts often include comments through the next
declaration; the precise source ranges above use declaration boundaries. Its
constants list omits explicitly naming T_CRIT_95/FLAT_HALFWIDTH, both needed by the
read closure.

**Owner-ratified RECON §4 correction:** `_mintJointEarn` is a writer affecting
queue/feed and calling earnWalk inside reconcileSightings({mint:true}) at the
merge/boot exit. It is excluded from module 1 and moves to module 5/6 with
reconcileSightings. Module 1 keeps deriveSighting/_deriveSightingFull and the rest
of the read side unchanged. This records the owner's ruling without editing RECON.

The proposed daysUntil rewrite in RECON §3 drops the frozen Math.round; this extraction preserves
the original rounding. Engine source TZ is still the runtime's local zone; merely
passing clock.tz does not re-zone explicit Date arithmetic.

The partial gate compares the **normalized census**, not every raw return byte:
loads round to 2 decimals, targets to integers and trend fields to 3 decimals.
Exact function copying and the separate full public progressionTrend comparison
are additional evidence. The census alone cannot prove all uncensused functions.

## 7. Not covered

No migration, merge, completeSession, earnWalk, sweep writers, _mintJointEarn,
session generation, full energy/policy/sleep/Today modules, new policy/progression
adapters, storage, HTTP, UI or integration into the client. No defect correction,
data port or deployment. No claim that the extracted code is suitable as a new
athlete's default data: HISTORY/SEED are copied provenance, not onboarding.
All tested calendar behavior remains tied to the oracle's timezone/date; the DST
witness exposes an unchanged assumption rather than expanding certification.

## 8. Time and executed review

Approximately 25 minutes from this run's initial fetch through final report review;
the source checkout was created 21:31:55 UTC. The earlier prerequisite stop and the
separate process audit are not included. Publication may follow this report.
Exact model token usage is unavailable. Independent copy/dependency/instance/clock
review passed. Full unprojected progressionTrend matched the golden bundle on both
public migrated fixtures. The deliberate bite failed and restoration passed.

## 9. DEFECT LOG — preserved, not fixed

All source lines below refer to **app.jsx @ fe516c1**. These are evidence-backed
candidates for later red-first laws and owner rulings, not medical guidance or
changes smuggled into this copy. Synthetic witnesses were run both on exact frozen
source declarations and the extraction; their observations matched. Reproduce
the retained diagnostics with TZ=America/New_York and
`node rebuild/engine/test/defect-witnesses.cjs`.

| ID | Frozen lines | Finding and evidence | Candidate change for a later ruled law |
|---|---|---|---|
| D1 | 1123 (`targetsFor`) | `ex.first` bypasses `fitN`. With `sets:3`, `last:null`, `first:[8,7]`, the target is `[8,7]` (length 2), whereas the adjacent std/reclaim branches fit the current set count. A set-count change before a lift's first performance can prescribe too few sets. | Apply the authored-array fit discipline to first targets after the owner rules on its intended semantics. |
| D2 | 1858 (`_bornValid`), 1901 (`canonicalizePlan`), 1123 | Shape validity checks only `typeof ... === "number"`. A record with `sets:-1`, numeric hi, string setup/mg and day U passes `_bornValid`; canonicalization clears its quarantine; targetsFor then throws **RangeError** allocating a negative-length Array. | Require finite, positive, integral set counts and validate other numeric domains before declaring a record valid. |
| D3 | 1077 (`_volDeltas`) | Volume ownership is a substring match on display names. For lift **Press**, another lift's receipt `VOLUME +1 — CHEST via Press incline` returns `[["2026-09-02",1]]` for Press. The other lift's volume change can alter Press's reconstructed historical set count. | Bind receipts by stable lift identity; define an unambiguous legacy-title match during migration. |
| D4 | 2232 (`_deriveSightingFull`) | Earn ownership is an unbounded prefix match. A two-top Press history derives `{topAt:100,topRun:2}`. Adding only `PRESS INCLINE 100 EARNED` on the second date changes Press to `{topAt:null,topRun:0}` even though Press incline is a different lift. | Use identity-bearing earn records; avoid treating one name as the prefix of another. |
| D5 | 1260–1261 (`loadRungs`), 1323 (`parseRungs`) | Both minimum-size checks occur **before** deduplication. `parseRungs("100,100")` and `loadRungs({steps:[100,100]})` return `[100]`. At working load 100 with inc 5, this marks the lift `maxedOut:true` instead of using the ordinary next increment. | Check the number of distinct valid rungs; rule whether a one-rung equipment record is legal and what it means. |
| D6 | 1311–1314 (`deloadLoad`) | Missing load is coerced to zero. `nextLoad({w:null,inc:5})` returns null, but `deloadLoad` on the same shape returns **5**. It invents a load where the neighboring next/previous helpers explicitly preserve absence. | Apply an absence guard consistently before numerical conversion. |
| D7 | 983–985 (`progressAnchor`), 3188–3191 (`liftTrend`) | The date limits the **era**, not the rows. At injected today 2026-09-03, four sessions from 2026-09-10 through 09-13 anchor the current target to `[11,10]`. `liftTrend(...,{asOf:"2026-09-03"})` includes all four and reports n=4 with those future dates as its range rather than no historical evidence. | Make the as-of contract explicit and, where intended, exclude later sessions; add a boundary law for future-dated logs. |
| D8 | 6994–7001 (`nightsBefore` / `cleanAtDate`) | Missing recent sleep is interpreted using the last logged night regardless of age. A lone 5-hour night on 2026-01-01 makes `cleanAtDate(...,"2026-09-03")` false eight months later. This silently treats stale data as current recovery context. | Establish an explicit recency/unknown rule rather than assuming the newest logged night was last night. |
| D9 | 660 (`dayType`) | The latest qualifying split is the **last array row**, not the maximum effective date. On 2026-09-03, split rows `[2026-08-01:L, 2026-09-01:U]` return U, while reversing the same records returns L. The reader assumes sorted input and does not enforce or document that precondition locally. | Specify and test the ordering invariant, or select by effective date in a future ruled change. |
| D10 | 306,311 (mk/weeksBetween) | Two dates seven calendar days apart across New York DST produce approximately 0.994047619 weeks in March and 1.005952381 in November, not 1. Synthetic 2026-03-08→03-15 and 11-01→11-08 reproduce this. | Rule whether this API means elapsed-time weeks or calendar weeks; use calendar arithmetic only if the latter is intended. |

```text
REPRODUCED D1 first targets bypass the current set count (app.jsx:1123)
REPRODUCED D2 negative sets pass validity and unquarantine, then throw (app.jsx:1858,1901)
REPRODUCED D3 a longer lift name claims another lift's volume receipt (app.jsx:1077)
REPRODUCED D4 a longer lift name clears another lift's sightings (app.jsx:2232)
REPRODUCED D5 duplicate-only rungs become a one-rung maximum (app.jsx:1260,1323)
REPRODUCED D6 missing load is converted into deload 5 (app.jsx:1311)
REPRODUCED D7 future sessions enter an earlier anchor and trend (app.jsx:983,3188)
REPRODUCED D8 an eight-month-old night controls current sleep context (app.jsx:6997)
REPRODUCED D9 split selection depends on array order (app.jsx:660)
REPRODUCED D10 calendar-week arithmetic counts elapsed DST hours (app.jsx:311)
DEFECT WITNESSES: 10/10 reproduced; behavior intentionally unchanged
```

The copied beatsNoise comments 2167–2172 also disclose an independence assumption
when aggregating per-set noise by square-root n. No statistical calibration or
scientific correction was performed, so it is recorded as a disclosed assumption,
not an experimentally established defect. No statement here claims production
impact beyond the demonstrated input shapes.
