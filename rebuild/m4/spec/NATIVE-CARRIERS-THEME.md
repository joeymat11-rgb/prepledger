# NATIVE-CARRIERS THEME — the behaviour/delta contract for M2-NATIVE-CARRIERS

Package `M2-NATIVE-CARRIERS`. Successor of `M2-LOAD-WRITES`
(`rebuild/m4/spec/acceptance-load-writes.json`
`5073977b3f612f0e6212f4d47ddc5f45f044897f0dc51b1d81b4840f6b099d82`, receipt at
`rebuild/DECISIONS.md` line 86). sourceBase `189523bdb2fa37187ce9e08b93c4e6dc27d41efd`.

This document is the theme the PM accepted. The resulting ledger line is
`rebuild/DECISIONS.md` **line 93** (role `cowork`, NATIVE-CARRIERS THEME ACCEPTED,
sha256 `5fc93a7c4bf5ac60a4fe9a1819b51a6fd339c98c9f4dfc8f02d52d1d456c901d`), and the
profile now binds it in place of the earlier `THEME_PENDING` sentinel. The owner
authority is **line 92** (role `owner`, SLICE RATIFICATION, sha256
`0c2aed9fec3202b074256d0e25f5406c65f1bb3497b7db7ed4e21fda984be621`). Both stand on
`origin/rebuild/t2-client-core` @ `cb900a62b70997b534de40d5329d8cd6e2dae769`.

## 1. What is adopted, and its exact bytes

The engine carriers of native candidate **L**
(`.../WORKOUT-EDIT-SEMANTICS-01/native-candidate-L/`, pins
`hashes/HASHES-L-AFTER.sha256`; predecessor pins `hashes/CORRECTION-01-BEFORE.sha256`),
accepted by independent reviews rev171/173/174/175 and never yet through the engine gate.
Branch `rebuild/slice-a0` @ `729d49ad` staged the same bytes under
`rebuild/m4/spec/native-next-target-candidate/engine/`; every hash below matches it.

### 1.1 Engine product — carried from sourceBase by exact literal carriers

| file | before (sourceBase) | after (adopted) | carriers |
|---|---|---|---|
| `rebuild/engine/plan.cjs` | `2b834933ce0b9316…` | `1b26c87f6fa03725…` | 1 |
| `rebuild/engine/progression.cjs` | `adeb1b1032602784…` | `7031838d37cfc522…` | 28 |
| `rebuild/engine/sleep.cjs` | `2dde4a082ba72d61…` | `3dd34e111fe56f75…` | 4 |
| `rebuild/engine/today.cjs` | `af4c65d2998c2fd5…` | `397532ecf20a4f5a…` | 9 |
| `rebuild/engine/writers.cjs` | `008d92961d210ed0…` | `00291236ee0fe5a5…` | 3 |
| `rebuild/engine/index.cjs` | `2f6e35e649984551…` | `40ccc489a44dfdb4…` | 1 |
| `rebuild/m3/w7-preview/browser-engine.cjs` | `9b0ae9234e111271…` | `4b1b19c0b7dcabb8…` | 1 |
| `rebuild/m3/w7-preview/build.mjs` | `d6c5253c067441e8…` | `dc5bc77d468b0933…` | 1 |

48 carriers total, listed verbatim in `rebuild/m4/spec/native-carriers-changes.json`
(sha256 `9e6f608a322ac077…`), each a unique literal replacement.

### 1.2 Engine product — whole-file adoptions

| file | sha256 | origin |
|---|---|---|
| `rebuild/engine/performed.cjs` | `2372e66ba4e31f72…` | candidate L, new file |
| `rebuild/engine/entered-load.cjs` | `2a0cd97ec843924e…` | `rebuild/m4/spec/configured-load-candidate/entered-load.cjs` @ sourceBase, verbatim |

`performed.cjs` requires `./entered-load.cjs`; L never listed the latter because its
own base already had it. Adopting it is required, not optional.

### 1.3 Support / execution, adopted verbatim at the L pins

`native-next-target-candidate/{fixture,import-engine-assembly,reach,source-delta}.cjs`,
`rebuild/m4/workout/{engine-runtime,source-projection}.cjs`, and the three tests
`native-next-targets{,-assembly,-correction}.test.cjs` (`8ab8ac5b…`, `eb755290…`, `ffed53fd…`).

## 2. Two carriers that are NOT in the L bytes, and why they are required

The L candidate was constructed over an accepted preimage
(`ENGINE-COMPOSITION-v089 / NATIVE-TREND-ACCEPTED`) whose engine index already
registered `performed.cjs`. **This base has no `performed.cjs` at all.** Adopting the
L bytes alone therefore breaks the legacy engine:

- `rebuild/engine/index.cjs` — without `require("./entered-load.cjs")` and
  `require("./performed.cjs")` the composed legacy engine throws
  `TypeError: E.performedRirSets is not a function` at `progression.cjs:523`, and the
  frozen public census cannot be computed at all (2 HARNESS_ERROR, 1 FAIL with 22
  differing census paths). With the carrier the census is byte-identical (§4).
- `rebuild/m3/w7-preview/{browser-engine.cjs,build.mjs}` — the same gap in the preview
  composition surfaces as `TypeError: E.performedNumericEntry is not a function`
  (w7-preview suite 0/19). With the carrier it is 19/19.

Both are pure composition/registration edits: two `require` lines and two allow-list
entries. No adopted L byte was altered.

## 3. Behavioural deltas per carrier, with the controls

The candidate's own published expectations (`source-delta.cjs` `EXPECTED`, 10 items,
verbatim in the adopted bytes) are the contract. Restated per file:

**`performed.cjs` (new).**
`performedStepWhy` names the actual state of an original hole — "A skipped / An
unlogged / A removed / An unresolved original position sits before the final set;
only the performed positions before it anchor the line, and the hole supplies no
value." (the rev174 O1 copy fix). `performedLine` enumerates the contiguous performed
prefix of the **original** positions of a typed entry: positions never compact, an
original hole ends the prefix, added positions never enter it and never end it.
`performedLoadMatches` compares each performed load with the applicable current
prescribed vector position **in its own domain** — pounds against a finite number,
configuration text against the same configuration key; mixed domains, a missing
position or any other prescribed value never match; a vector is never scalarised.
`performedOriginalRirSets` carries the original-position efforts only.
*Control:* `performedRirSets`, `rirSetsOf` and every receipt still map **every** slot,
added included, for history display.

**`progression.cjs`.** With a registered native view (`s.workoutFacts`) the governing
last line, last metadata and eligible anchor derive from `performedHistoryRows` in
causal order instead of the `exercise.last` / `lastMeta` cache; a contradictory cache
never wins; removing the latest contributor recomputes from what remains.
Native rows require the `nativeTrendContext` resolver for rushed/debt — a missing or
mismatched context is an explicit `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` refusal,
never a defaulted flag. Native rows dated **on** a RESET APPLIED day refuse with
`PROGRESSION_RESET_MAPPING_REQUIRED`; rows before the reset never undo the consented
null last; rows after it set the line. A native entry holding no original position for
the lift (an added-only session) is not a row of the lift at all.
*Control:* legacy-only inputs (no `workoutFacts`) are unchanged, byte for byte.

**`today.cjs`.** `genSession` reads the governing last line and metadata through the
shared helpers for the debut, reallocation, ladder, runway and `prev` outputs.
*Control:* legacy-only cards are byte-identical.

**`plan.cjs`.** `eraFresh` also sees native sessions of the same era through
`performedHistoryRows`, so a first native session under a new era is no longer
"fresh". *Control:* an added-only session of the lift does not end freshness;
legacy-only inputs read the log exactly as before.

**`sleep.cjs`.** `bodyAlarmSignal` is the shared detection/tier extraction —
same thresholds, same pulse/pattern logic, same null/RED/AMBER semantics.
`bodyAlarm` now calls it and keeps its full presentation (canary/lab details).
`liftCall`'s default alarm path reads the **signal** only.
*Control:* an explicit `opts.alarm` keeps its original meaning.

**`writers.cjs`.** `rirPlan` floors the terminal set from `bodyAlarmSignal`: the old
call built the whole presentation (lab groups, canary, HISTORY) merely to test
truthiness, so a presentation failure after a real signal silently became an
all-clear. The hot-opener count reads `performedOriginalRirSets(rich)[0]`, and under a
native view the "upper-median ≤ 0" rule is expressed as a strict majority of *known*
hot openers with the same minimum of three.
*Control:* detection failure on an invalid state still yields no floor, exactly as
before; every completion/adaptive writer body is unchanged; a 3+ bound stays a bound
and never becomes an exact rating.

**rev173 N2 (across `performed`/`progression`/`writers`).** An added position (origin
`"added"`, appended after every original position) is a fact of the session and never
determines the original progression-bearing count, the opener/terminal effort, the
step or its why — this is the correction that removed the earlier
**step 3 → step 1 overshoot** caused by an added slot entering the original line. A
session holding only added positions for a lift has no original line and stays
non-eligible. The why names added sets as "recorded after the original positions" and
never calls an added slot removed or unresolved.

## 4. What stays byte-identical for legacy rows

- The frozen public census is **byte-identical** on both public goldens through the
  unchanged `rebuild/conform/oracle/port-oracle.cjs` against the live engine:
  `preimage-2026-08-15` (3897 leaves, 16 active lifts) and `synthetic-pending-debut`
  (736 leaves, 2 active lifts), 7/7 GREEN on both the frozen and the native clock.
- `rebuild/m3/w0/public-oracle.mjs` PASSes end to end, including the frozen
  engine-track witnesses rig185 W1/W2.
- `rebuild/m3/w0/public-conformance.cjs` PASSes: 99 reference GREEN, 99 STRONG
  (141 targeted mutants detected), 70 adapter GREEN.
- The legacy differential (`native-carriers-legacy.cjs`) composes the recovered
  ACCEPTED preimage engine beside the adopted engine and finds 9/9 legacy-only
  `genSession`/`rirPlan` comparisons identical across all three alarm branches.
- No file under `rebuild/engine` other than the eight above changed, and the closed
  engine inventory is the parent's sixteen plus exactly `performed.cjs` and
  `entered-load.cjs`.

The **private** oracle is not run here and is not claimed; it runs only in the PM's FULL.

## 5. The `hack` Joe-ism — reported, not changed

`rebuild/engine/today.cjs` line 92 (adopted bytes) special-cases one athlete's lift id:
`else if (e.id === "hack" && e.pendingThird && isDebutNow) { tgt = [...targetsFor(e, s), Math.max(8, e.hi - 3)]; note = "DEBUT — third set banks whatever it gives"; }`

Findings: (a) it is **inherited**, not introduced — the identical line is present at
sourceBase `189523b` and is untouched by any of the 48 carriers; (b) it is a
data-shaped special case living in engine code, which the census pins, so any repair
is a behaviour change needing its own owner/theme authority; (c) it is therefore left
byte-for-byte alone here, and is raised for the PM as a separate item. **No accepted
byte was silently changed.**

## 6. Open boundaries (carried forward, none closed by this package)

- **N175-1** — the null lane proves "no source import and no accepted prefix"; it does
  **not** prove the state. `register({generation,state,workoutFacts})` never compares
  `state` against `generation`; whoever calls `register()` supplies the athlete facts,
  and in this packet that caller is only the fixture. A product host needs a qualified
  state supplier before the null lane means anything about a real athlete.
- **N175-2** — the string-lane frontier/cut proof is an echo. `log_digest` is a
  constant and `readSourceCuts` echoes the requested frontier, so the test proves
  routing, that `projectLineage`'s own checks execute and refuse
  (`SOURCE_WORKOUT_BASIS_UNPROVEN` ×2, `SESSION_CHANGED`, `SOURCE_LINEAGE_INPUT`), and
  the consumer contract — not a real frontier-cut binding, activation, currentness,
  issuance or admission. No product `resolveWorkoutBasis` / `inspectSourceCuts` exists.
- **Trend context** — `nativeTrendContext` is a declared **test assumption**
  (`assumed = request => ({...request, hard:false, rushed:false, debt:false})`). No
  qualified product provider exists; the refusal, not a default, is the product
  behaviour that is proven.
- **String lane / host assembly (L §2, rev174 N174-1)** — no product module in this
  tree composes `createDurablePublicClient` with a `workoutProducer`, or calls
  `createEngineRuntime` / `createEngineWorkoutCapture`. The host seam is unbuilt.
- **Added-slot composition** — one subtest of `native-next-targets-correction.test.cjs`
  is SKIPPED in this root with its reason ("no static extension capture; accepted
  added-slot correction not composed here"), exactly as in the L author's native root.
- **Packet prerequisites** — the ACCEPTED preimage and `test-support/import-engine`
  are reconstructed (§3 of the build report), not shipped by the packet; the recovery
  is verified against the candidate's own published pins but the reconstruction itself
  is a builder act and should be reviewed.

## 7. Status

Accepted by the PM at `rebuild/DECISIONS.md` line 93, with conditions C1 (independent review of
the recovered ACCEPTED preimage / test-support reconstruction), C2 (`run-current-head --all`
435/435 reproduced in the joined tree at the package head — **done: 435/435, 0 fail, 0 skipped**),
C3 (`today.cjs:92` `e.id === "hack"` recorded as register item H1 for Track B, byte-untouched here)
and C4 (FULL including the private oracle is the PM's own execution before any receipt).

**C4 note.** The PM's FULL executions at `821234e` found three PACKAGE-TOOLING defects — engine
bytes were never in question. F-PM-3: the wrapper's `historical()` read the historical-audit baseline
off the immediate parent artifact, which is a closed cumulative profile with no `baseline` key, so
FULL threw a `TypeError` there on every run; the chain is now resolved to the grandparent
M2-STEP-EFFICACY acceptance (`A.load` + `A.verifyReceipts`, pins asserted) once inside
`native-carriers-profile.cjs verify()` and handed to the wrapper as `context.grandparent`.
F-PM-1: the traces child asserted the public `7 GREEN` summary
literally, which the private fixture's three additional `PORT-live-*` laws made unreachable inside
FULL; it now counts the public laws exactly and the private ones only as a count, naming none.
F-PM-2: the wrapper re-ran all 19 originals, nine of which compare against the FROZEN `fe516c1`
source and were already RED by design in the accepted parents; those nine are now carried by five
named B0 successor children (build report §2), and the wrapper seeds `done` from the artifact's own
`coverage` record so the closed 19-gate assertion still holds. No original gate, `rebuild/engine/test`
file or `rebuild/conform` file was edited, and no covered gate maps to a skip.
No receipt, execution, product acceptance or merge follows from this document.

The bytes line 93 reviewed are this file **as of `f8cbf98face943b34ccfc1ecffb1e608a56084b6`**.
The only later edits are this status section and the authority header above; §§1–6 — the
behaviour/delta substance the line accepted — are unchanged.
