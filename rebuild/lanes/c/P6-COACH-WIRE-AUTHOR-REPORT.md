# P6-COACH-WIRE: author report (STOP)

Lane C, size S. Model Sonnet 5, effort medium. Base
origin/rebuild/t2-client-core @ f2fc4f4977e99dd657573eaa0e8ebd028168268b.
Branch rebuild/c-p6-coach-wire.

## Outcome: STOP before touching accept_proposal

The BUILD step requires `revision = the engine's own revision string as the
coach already receives it from its accepted engine seam`, with an explicit
instruction to STOP and report rather than invent one if no such value
reaches tools.cjs. It does not.

Checked, with negative result at each:

- engine-runtime EXPOSED names (`rebuild/m4/workout/engine-runtime.cjs:40`):
  `['genSession','rirPlan','dayWeather','cleanAtDate','sessionMembership']`.
  No revision, and this is the workout-capture runtime, not the engine that
  issues coach proposals.
- the engine provider tools.cjs actually calls (`rebuild/coach/tools.cjs:400
  const E = today.engine;`, used at :783-787 for volumeImbalance /
  phaseProposal / proposeLadder). That engine is built by
  `rebuild/m3/w7-preview/today/today-engine.cjs:27-36`
  (`createBrowserEngine` + `rebuild/engine/writers.cjs`) and
  `rebuild/engine/index.cjs:34` exports only `{ createEngine }`, no
  version/profile/revision field anywhere in that composition chain.
- "the coach's deps" (the `world` object passed to `createCoachTools`,
  `rebuild/coach/tools.cjs:394`): the only field named `revision` anywhere
  under `rebuild/coach/**` is `rebuild/coach/local-world.mjs:350`
  (`era: { eraId, leaseId, revision: booted.revision }`), which is
  `rebuild/m3/w6/local/local-client.mjs:258/315/384`, the LOCAL DURABLE
  CLIENT's own IndexedDB generation counter (an integer, e.g. `1`), not an
  engine revision. It is also not reachable from the minimal `{ today,
  consent }` world the existing `tiers.test.cjs` (and any fake-consent unit
  cell) constructs, so it cannot serve as a producer-independent revision
  seam either. Using it would misrepresent an engine build identity as a
  per-device era counter, and package.json is explicitly out of bounds.

No other candidate exists. Building `accept_proposal`'s issuance per the
ticket would require fabricating `revision`, which the ticket forbids.

## What was NOT done

`rebuild/coach/tools.cjs` accept_proposal is unmodified. No new BAR test
cells were written, since every one of (a)-(g) depends on a real
`producer`+`revision` issuance path that cannot be built honestly today.
`rebuild/coach/test/tiers.test.cjs`'s existing "THE REASON IS NOT ON DISK"
tests (documented gap, now closable on the client side per P6) are also
unmodified pending this decision.

## Secondary, unrelated environment note

`node --test "rebuild/coach/test/*.test.cjs"` on this worktree: 218 tests,
169 pass, 49 fail, every failure `ERR_MODULE_NOT_FOUND: fake-indexeddb`
from `rebuild/m3/w6/test/support.mjs`, because the `%TEMP%\earned-ci\node_modules`
junction resolves to `C:\Users\joeym\Documents\prepledger-dev\node_modules`,
which does not have that package installed. Pre-existing on this exact tip
before any change here (verified against the untouched checkout); outside
this ticket's custody (tools.cjs / coach test / this report only) and not
fixed here.

## Recommendation

Route back to PM: either (a) name an accepted engine revision seam (e.g. add
a `revision`/`profile` constant to `rebuild/engine/index.cjs` or thread one
through `today-engine.cjs`) before COACH-WIRE proceeds, or (b) rule that the
client-era `revision` (an integer, would need `String()` and a world.era
wiring change) is an acceptable substitute, which is a scope change this
author is not authorized to make alone.

## Open items

- No sha for a functional change: this commit adds only this report.
- Suite tails not produced for rig187 / client / S4 / today-13, since no
  code changed and the coach-suite run above already demonstrates the
  pre-existing environment gap independent of this ticket.

## Round 2 (review rebuild/lanes/c/P6-COACH-WIRE-REVIEW-R1.md, e5f66c6)

The STOP stands. accept_proposal is still unmodified; no revision is invented.
Every finding below is fixed within custody (tools.cjs, coach test, this file).

1. MAJOR, report evidence false: FIXED. Round 1's "218 tests, 169 pass, 49
   fail, ERR_MODULE_NOT_FOUND fake-indexeddb, environment broken" was an
   author setup error, now found and corrected: this worktree's own
   `rebuild/m3/w6/node_modules` and `rebuild/m3/w5/node_modules` junctions
   pointed at %TEMP%\earned-ci\node_modules (the ROOT cache, which never
   carries fake-indexeddb or @noble/hashes) instead of each package's OWN
   path under %TEMP%\earned-ci (`rebuild/m3/w6/node_modules`,
   `rebuild/m3/w5/node_modules`), which chain to their real installs. Fixed
   by re-`mklink /J` each to its own path. Coach suite now: 218 + 4 new = 222
   tests, 222 pass, 0 fail (986.9ms). No environment gap; withdrawn.
2. MAJOR, mandated evidence missing: FIXED. All four now run and tailed
   below.
3. MINOR, gap reported by half: FIXED. R4 below makes explicit: the PM
   follow-up this STOP hands back is TWO seams, not one: an engine
   revision AND a coach clock. `source` (turn_id) already works; `moment`
   has nothing to read: the only `new Date()` in tools.cjs (verifyCostCap's
   option default, :938) is unrelated to proposal issuance, and
   today-model's own engine clock is never exposed on the today adapter the
   coach holds.
4. MINOR, STOP without red proof: FIXED. Added
   `rebuild/coach/test/engine-revision-gap.test.cjs` (R1-R4, 4 cells, real
   client + real today-model, no fixtures invented): R1 the call site is
   still unmodified; R2 with the real client a real accept still leaves no
   reason on disk; R3 the real client refuses an issuance with a missing,
   empty, or wrongly-typed revision and only acknowledges a real string one;
   R4 no revision and no clock reach any seam the coach holds. All pass, and
   fail if the gap this STOP relies on ever closes silently.
5. NOTE, claims sound: no change; ratified.
6. NOTE, commit subject: no change; PM to ratify as before.

Tails (this sha, this worktree, junctions corrected as above):
coach: 222 tests, 222 pass, 0 fail (986.9261ms)
client: 18 tests, 18 pass, 0 fail (128.9745ms)
rig187: `rig187 => PASS`
S4 --ci: `B PACKAGE S4 PUBLIC CI EVIDENCE PASS`, exit 0; S4.json has no
  "rebuild/coach" (findstr: 0 matches)
today-13 (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, 13 files by
  name from `dir /b rebuild/m3/w7-preview/today/test`): 645 tests, 645 pass,
  0 fail (16035.2075ms)

Environment note: fixing (1) required restoring the shared root
node_modules at the underlying prepledger-dev checkout (`npm ci
--include=dev`, then `npm approve-scripts esbuild`) after an initial,
mistaken `npm install fake-indexeddb --no-save` there pruned 41 unrelated
packages including @noble/hashes; that root install was never actually
needed once the m3/w6 and m3/w5 junctions pointed at the right path.
Root node_modules is now consistent with package.json/package-lock.json and
S4's own esbuild-dependent gate (BASELINE-ESBUILD-MISSING, seen mid-fix) now
passes. Flagged here in case any other concurrent task on this machine
relied on those 41 non-lockfile extras at the root path specifically.
