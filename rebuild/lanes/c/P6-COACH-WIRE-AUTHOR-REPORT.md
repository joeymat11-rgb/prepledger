# P6-COACH-WIRE — author report (STOP)

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
  `rebuild/engine/index.cjs:34` exports only `{ createEngine }` — no
  version/profile/revision field anywhere in that composition chain.
- "the coach's deps" (the `world` object passed to `createCoachTools`,
  `rebuild/coach/tools.cjs:394`): the only field named `revision` anywhere
  under `rebuild/coach/**` is `rebuild/coach/local-world.mjs:350`
  (`era: { eraId, leaseId, revision: booted.revision }`), which is
  `rebuild/m3/w6/local/local-client.mjs:258/315/384` — the LOCAL DURABLE
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
169 pass, 49 fail — every failure is `ERR_MODULE_NOT_FOUND: fake-indexeddb`
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
