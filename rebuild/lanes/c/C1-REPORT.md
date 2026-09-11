# C1 REPORT — durable local save wired to the client ops (W6 LOCAL half)

Branch `rebuild/lane-c-c1`. Worktree `work/lane-c/c1` on the owner's Windows PC,
Node v24.19.0. Every command and number below was executed there; nothing is
quoted from another machine or from a run of a different tree.

**Base.** The branch is cut from `9aeb2cc` (the lanes-docs commit). C1-BRIEF.md
names `ffabbca` as the base; `9aeb2cc` is the commit the brief describes as
"tree = S0-JOIN + lanes docs", and it is the one in this history. They reconcile;
saying so here saves the next reader the archaeology.

**Revision 2** — this report covers the work after C1-REVIEW.md returned ACCEPT
WITH CONDITIONS on `85425fb`. What changed is in REVIEW CONDITIONS below.

**No existing file was edited.** `git diff --stat 9aeb2cc HEAD` touches only the
nine C1 paths. No additive export line was needed in any existing W6 file.
`rebuild/client/*`, `rebuild/engine/*`, `rebuild/m3/w6/host/`, `pnpm-lock.yaml`
and the root lock are untouched, and no install of any kind was run.

## WHAT WAS BUILT

| file | sha256 | lines |
|---|---|---|
| `rebuild/m3/w6/local/local-keys.mjs` | `0a7feb8af70ea62cb688a6f1e42d25e7d055cc3280e50d05043e39649a10cbc2` | 117 |
| `rebuild/m3/w6/local/local-era.mjs` | `658300a2a080981bc48042fc54b155de8826d1b845102a0222a09347ebf61e46` | 115 |
| `rebuild/m3/w6/local/local-client.mjs` | `a6784b72eb64745cf7a69ece6814dad7259a17e9b2c65da215e0f864e22941da` | 366 |
| `rebuild/m3/w6/local/browser-entry.mjs` | `e415109c5891a7316c2dbc029575a89dccb90daade035a5388055cb6c5013c4a` | 12 |
| `rebuild/m3/w6/local/build.mjs` | `666de31c2c9dd63d1da669465432f8e0a0d0a13283098a1da1edc0f94ce24424` | 26 |
| `rebuild/m3/w6/test/local-client.test.mjs` | `5519bd5418e4d5edb8b2ea38a014b379d561089d5ab6b7e6efe8c78a4878dc15` | 606 |
| `rebuild/m3/w6/test/local-bite.cjs` | `b769ddb68d1343384bac13097b1c3087c163e1cd4cefae63a31d32eb52260a06` | 89 |
| `rebuild/m3/w6/test/local-browser.mjs` | `0699c5e5723de7a50ab7ebe59537d2efcc33b76b483d55730308dfdd6d96699c` | 149 |

All LF-only (checked byte-wise, `crlf=false`), so `.gitattributes` cannot rewrite
them.

`openRepository`, `createBridge`, `createT2Stage` and `build-browser.mjs` are used
UNCHANGED. C1 supplies only the four collaborators every existing W6 test injected
synthetically — key provider, enrollment authorizer, lease source, commit
validator — plus the derived sidecar and the browser bundle entry.

## REVIEW CONDITIONS — what changed since `85425fb`

1. **Day-401 cliff (MATERIAL).** The local era's lease is now SELF-RENEWING. On
   every `boot()`, a still-valid lease inside its last 200 days
   (`LOCAL_ERA_RENEW_WITHIN_DAYS`) is re-signed with the era's own authority key —
   same `lease_id`, same `range`, `not_before` unchanged, `not_after` = now + 400
   days — and written to `metadata.localEra` in a durable `repository.commit`, so
   the very next stage reads it off disk. Opening the app is what keeps writing
   alive. An **expired** lease is never renewed: renewal extends a live
   authorization, it does not resurrect a dead one. The cliff therefore survives by
   exactly one route — not opening the app for 400 days — and is now NAMED:
   `execute()` refuses `{state: 20, code: "LOCAL_LEASE_EXPIRED"}` with its own
   copy, and `status()` / `boot()` report `restore-required / LOCAL_LEASE_EXPIRED`
   instead of `ready`. `boot()` still returns the view (`readable: true`): the data
   is intact, only writing is refused. A renewal that fails is non-fatal (the
   surviving lease has 200 days left) and is reported as `leaseRenewalCode`.
2. **Sidecar self-heal (MEDIUM).** A malformed or basis-mismatched
   `collections.derived` can no longer veto a durable save. The validator judges
   the sidecar only when THIS commit authored it (projector output, or a fresh
   empty cache where none existed); a CARRIED cache is the host's and is never
   judged. `boot()` reports `derived: null`, `derivedStale: true` and a new
   `derivedCode` for an unusable cache, and `sidecarStale` now returns true
   whenever `sidecarFailure` is non-null — so a malformed cache can never read as
   fresh. C1 still never rewrites or discards a host value it did not produce.
3. **Dead validator branches (MINOR).** `LOCAL_NAMESPACE_MISMATCH` and
   `LOCAL_SESSION_CHANGED` are DELETED. The reviewer is right that they compared
   closure variables against themselves and could not fire. What remains is in
   `commitFailure`, exported and unit-tested — see the next section.
4. **CI.** Recorded below, in its own section.

The two false residual clauses are gone: the 400-day window and "a day's gap" are
now genuinely asserted with an injected clock (cases 18–21).

## WHICH VALIDATOR CHECKS CAN FIRE, AND WHAT MAKES THEM FIRE

`commitFailure({ staged, attempt, batch })` is the whole decision, synchronous and
reject-only, exported so it can be judged on its own (case 17 tests every branch).

| code | fires when |
|---|---|
| `LOCAL_SIDECAR_UNPROVEN` | the validator is reached without this attempt's stage record — none at all, or one from a superseded attempt (a CAS retry re-stages and bumps the attempt). Fails closed. |
| *(no refusal)* | the sidecar was CARRIED, not authored here. However broken it is, this commit claims nothing about it and ops are truth. |
| `DERIVED_SIDECAR_MALFORMED`, `DERIVED_BASIS_AHEAD_OF_OPS` | an AUTHORED sidecar that does not describe this candidate's operations. |
| `DERIVED_BASIS_WITHOUT_BATCH`, `DERIVED_BASIS_NOT_THE_COMMITTED_BATCH` | an AUTHORED sidecar whose basis is not the batch the bridge validated — the sidecar basis (from the candidate's `ops`) and the bridge's frozen batch descriptor are two independently derived facts, and they must agree. |

Be precise about what that means: a **correct** stage satisfies all four DERIVED
checks by construction, so they are invariant assertions inside the durable
transaction — they fire when the STAGE is wrong, not when a host misbehaves (a
host cannot author a basis at all; the projector returns only `value`).
`local-bite.cjs` bite 2 breaks the stage precisely to show the check catches it,
which is the only honest way to demonstrate an invariant assertion is load-bearing.
`LOCAL_SIDECAR_UNPROVEN` is the one branch with a non-stage cause.

## CI RELEVANCE — THE AUTOMATED GATE FOR C1 IS NIL

`.github/workflows/rebuild.yml` (`rebuild-public`, ubuntu-latest + windows-latest)
**runs no W6 test on either OS.** Nothing in any workflow in this repo executes
`rebuild/m3/w6/test/*`, `local-bite.cjs` or `local-browser.mjs`. So LANES.md's
plumbing tier ("one independent reviewer + CI green both OS") supplies C1 with
zero automated coverage: the independent reviewer's executed run plus the Windows
runs recorded here are the entire gate, and a future regression under
`rebuild/m3/w6/local/**` would be caught by no workflow. The PM should weigh the
merge on that basis. (First stated by the reviewer; repeated here because it
belongs in the report, not only in the review.)

## NON-GOALS RESTATED (from the brief — these are not gaps)

- **No hosted half.** No W5 wire, no Worker, no Clerk, no sync, no outbox drain.
  Outbox entries accumulate; in the local era that is correct, because there is
  nothing to drain them to.
- **No 24 h / 64-slot allowance.** The ruled budget (DECISIONS:24, BRIEF-W6 v1.1)
  bounds offline writes RELATIVE TO THE LAST RECONCILED CONNECTION. The local era
  has no authority to reconcile with, so there is nothing to bound. Format 2 is not
  implemented; `frame-repository.mjs` stays opt-in/unwired per
  FRAME-IMPLEMENTATION-STATUS.md. The lease `range` is `[1, 2**31−1]` — deliberately
  unbounded, not a smuggled slot count.
- **No knowledge fence (K1).** No hosted knowledge exists locally to lose.
- **No T2 (`rebuild/client`) edit, no engine edit, no host page, no import of Joe's
  data (C2), no phone proof (C3).**
- **"Saved" is not authority-accepted.** In the local era nothing can refuse an
  operation. Saved means DURABLY-COMMITTED-ON-THIS-PHONE. Every operation carries
  `lease_id = "local-era:<eraId>"` — including after a renewal, which keeps the
  same id — so a future hosted onboarding can identify local-era operations; that
  adoption is deferred with hosted sync (DECISIONS:88) and is not designed here.
- **Self-renewal is not authority.** The renewed lease is signed by the same
  locally generated key that sits beside it in the sealed generation. It proves the
  integrity of that sealed record and lets the unchanged `lease.cjs` verify. It
  grants nothing and asks no one.

## COMMANDS + RESULTS (Windows, this worktree)

`NODE` is
`C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`
(v24.19.0). PowerShell blocks `npm.ps1`, so node is called directly; long output
was redirected to a file and read back, because the shell mangles `✔`/`ℹ`. Each
command's exit code was captured with `&& echo OK || echo FAIL`, not inferred.

**Baseline, before any C1 file existed (same worktree):**

| command | result |
|---|---|
| `NODE --test rebuild/m3/w6/test/*.test.mjs` | `ℹ tests 435 · pass 435 · fail 0` |
| `NODE rebuild/m3/w6/build-browser.mjs` | `62 pinned local inputs`; `.tmp/browser/w6.js` = `b733c8309f4617f809b794edc39f0cf6842776d39e67fd0c26a2130e54b3143d`, `w6.js.meta.json` = `ffe65850dc0771d3982b2cc24899dff246670bafc0594e0f2706952011d9b00c` |

**After C1 (revision 2):**

| command | result |
|---|---|
| `NODE --test rebuild/m3/w6/test/local-client.test.mjs` | `ℹ tests 21 · pass 21 · fail 0`, exit 0 |
| `NODE --test rebuild/m3/w6/test/*.test.mjs` | `ℹ tests 456 · pass 456 · fail 0`, exit 0 — the 435 existing cases plus 21 new ones, none of the 435 changed |
| `NODE rebuild/m3/w6/build-browser.mjs` | `62 pinned local inputs`, exit 0; `w6.js` = `b733c830…3143d` and `w6.js.meta.json` = `ffe65850…9b00c` — **byte-identical to baseline** |
| `NODE rebuild/m3/w6/local/build.mjs` | `W6 LOCAL BROWSER BUILD PASS — 34 pinned local inputs`, exit 0; `.tmp/local/local.js` = `ab94431221197a3fcad86b9b985dc72b44892b646b7da7d2b0e28c3afcc4cb58` |
| `NODE rebuild/m3/w6/test/local-bite.cjs` | see BITE RESULT, exit 0 |
| `set "W6_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"` then `NODE rebuild/m3/w6/test/local-browser.mjs` | see BROWSER RESULT, exit 0 |

The 21 node cases, by what each proves:

1. first run → enroll → weighIn → **whole new factory on the same IndexedDB** →
   `boot()` shows the read at revision 2; a second `enroll()` is refused (state 18)
   and the revision does not move.
2. `enroll()` seals every collection in `rebuild/client/README.md` EMPTY, with
   `meta/checkpoint {counts:{ops:0,outbox:0}}`, `meta/device {device_id,
   athlete_id, seq:0}`, `derived {basis:{opCount:0,lastOpId:null}, value:<cleanInit>}`;
   every name survives the first operation.
3. the self-issued lease verifies under the **unchanged** `client/lease.cjs`
   (`check().valid === true`, `lease_id === "local-era:<eraId>"`,
   `schema_version 2`, `range [1, 2147483647]`), and is a real signature: another
   key does not verify it and another device_id is refused.
4. every stored operation carries `lease_id = local-era:<eraId>`; a 3-operation
   `logSession` commits atomically (4 ops, 4 outbox entries, `device.seq 4`,
   checkpoint `{ops:4,outbox:4}`, one revision); `resumeAfterKill()` reads
   "Last saved: Set 2 of squat." with `ghost:false`.
5. an unsupported command is refused (state 3, `LOCAL_COMMAND_UNSUPPORTED`) and the
   revision does not move.
6. **kill mid-transaction** (IDB-level delay, then abort): nothing published while
   the transaction is open, the typed input retained, result
   `acknowledged:false state:3`, the previous generation byte-exact (`deepEqual` of
   the whole loaded record), and a reopened factory shows no ghost set.
7. **quota abort**: state 3, the loaded record unchanged, and the next save still
   takes `op-dev-phone-A-2` — the aborted batch consumed no sequence.
8. two independent factories racing one revision: both acknowledged, revision 3,
   `device_seq [1,2]`, both payloads present, 2 outbox entries, predecessor chain
   intact.
9. **partial erasure** — generations record / device key / enrollment marker, each
   erased alone: `restore-required` with `STORE_MISSING` / `KEY_MISSING` /
   `ENROLLMENT_MARKER_MISSING`, `boot()` not ready, `enroll()` refused, `execute()`
   state 18, and exactly two of the three signals still present afterwards (no
   reseed, no re-key). Only all three gone reads as `first-run`.
10. a different `namespace` over the same database is `restore-required` /
    `STORED_INTEGRITY_UNPROVEN` and state 18, `enroll()` refused, and the original
    installation still loads at revision 2.
11. the derived sidecar: projector round-trip in the same commit,
    `derivedStale:false`; with no projector the cache is carried and reads
    `derivedStale:true`; **a planted basis ahead of the ops does NOT veto the save**
    — it is carried unchanged (byte-compared on disk), `boot()` reports
    `derived:null / derivedStale:true / derivedCode:DERIVED_BASIS_AHEAD_OF_OPS`,
    three further saves all succeed, and a projector then clears it.
12. a **malformed** cache (a valid object simply missing `value`): `boot()` reports
    `derived:null`, `derivedStale:true` — it used to report `false` — and
    `derivedCode:DERIVED_SIDECAR_MALFORMED`; three saves in a row all succeed.
13. a corrupt cache **rides a CAS retry**: two projector-less factories racing both
    save; then two projector-ful factories racing both save, and the surviving basis
    describes the final operations exactly (`{opCount:5, lastOpId:op-dev-phone-A-5}`,
    `derivedStale:false`).
14. the sidecar helpers as units, including that everything `sidecarFailure` refuses
    is also `sidecarStale`.
15. presence probing with `indexedDB.databases()` **hidden**: still `first-run`, and
    the marker database was probed without being created.
16. no era key material (`identityKey`, `authorityKey`, lease signature) appears in
    anything the factory returns; `eraId` does.
17. `commitFailure` as a unit: every branch in the table above, including that a
    CARRIED sidecar is never judged however broken, and that a record from a
    superseded attempt fails closed.
18. **a day's gap**: save on day 1, reopen with the clock on day 2 → ready, revision
    2, the read intact, and the next save takes `op-dev-phone-A-2` with tomorrow's
    `effective.local_date`.
19. **the lease window is exactly 400 days** (`not_after − not_before`, measured)
    and boot renews it: day 199 nothing renewed and saving works; day 201 re-signed
    to day 601 with the same `lease_id`, same `range`, `not_before` untouched, a
    different signature that still verifies under unchanged `lease.cjs` and only
    under the era's own key; **day 402 — past the original cliff — saving works**
    and renews again to day 802; day 500 saving works with nothing renewed. All five
    operations across 500 days carry the same era lease id.
20. **an era left unopened for 400 days lapses**: at day 401 `status()` is
    `restore-required / LOCAL_LEASE_EXPIRED`, `boot()` is `ready:false readable:true
    leaseExpired:true state:20 code:LOCAL_LEASE_EXPIRED` with the read still visible
    at revision 2 and no renewal, `execute()` refuses `state:20 /
    LOCAL_LEASE_EXPIRED`, `enroll()` is refused; at day 500 the same, with the
    revision still 2 — nothing was written.
21. **a lease that lapses while the client is open**: the clock crosses the window
    after `status()` was `ready`, so the refusal comes from the real client's own
    write path — `state:20` with neither code nor reason, because the face's
    write-state precedence answers before `lease.cjs` is asked — and C1 names it
    `LOCAL_LEASE_EXPIRED` by reading the sealed lease, with its own copy, leaving
    the single stored operation untouched.

## BITE RESULT

`NODE rebuild/m3/w6/test/local-bite.cjs`, exit 0, verbatim:

```
LOCAL BITE SOURCE — a6784b72eb64745cf7a69ece6814dad7259a17e9b2c65da215e0f864e22941da
LOCAL BITE DETECTED — durability-gate removed; "kill mid-transaction" fails as designed
LOCAL BITE DETECTED — stage-basis removed; "derived sidecar rides the same commit" fails as designed
LOCAL BITE DETECTED — sidecar-self-heal removed; "malformed derived cache never vetoes a save" fails as designed
LOCAL BITE DETECTED — lease-self-renewal removed; "lease window is exactly 400 days" fails as designed
LOCAL BITE RESTORED PASS — a6784b72eb64745cf7a69ece6814dad7259a17e9b2c65da215e0f864e22941da; full local client cases exit 0
```

Four guards, one at a time, on a disposable variant of `local/local-client.mjs`:

- **durability gate** — `execute()` made to return the T2 stage's OWN result instead
  of the bridge's post-commit result. That is exactly the defect the bridge exists to
  prevent (the real T2 acknowledges before the transaction completes —
  `storage.test.mjs`'s first case witnesses it). The mid-transaction case went red at
  `assert.equal(result.acknowledged, false)`: with the gate gone, an aborted
  transaction reported Saved.
- **stage basis** — the stage's basis computed from the SNAPSHOT instead of the
  candidate, so an authored cache would describe the commit before this one. The
  validator's `DERIVED_BASIS_NOT_THE_COMMITTED_BATCH` check caught it inside the
  transaction and the projector save went red. This is how the remaining validator
  branches are shown to be load-bearing rather than decorative.
- **sidecar self-heal** — a carried cache judged again, so a malformed one vetoed the
  save; the malformed-cache case went red.
- **lease self-renewal** — renewal disabled, so the era hit the day-401 cliff; the
  lease-window case went red at `leaseRenewedUntil` (`null` instead of the day-601
  timestamp).

Source sha256 before and after are the same string above, and the restored file was
byte-compared (`Buffer.equals`) inside the `finally` before anything else ran. The
full 21 cases pass on the restored file (exit 0). The original bytes are also copied
to `.tmp/local-bite/local-client.mjs.orig` before the first mutation, so a killed
process still leaves a recoverable original.

## BROWSER RESULT

`W6_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`,
`NODE rebuild/m3/w6/test/local-browser.mjs`, exit 0, verbatim:

```
W6 LOCAL-BROWSER PASS — 8/8 real IndexedDB cases; 152.0.4191.66; enroll + durable save, whole-context reopen, two-tab race, third-context read, durable lease renewal past day 401; 34 pinned bundle inputs
W6 iPhone / iOS Safari acceptance NOT RUN — Chromium-family evidence only (C3)
```

Real Microsoft Edge 152.0.4191.66, headless, launched through pinned
`playwright-core` 1.62.1 as a persistent context on a fresh profile directory, with
all non-origin requests aborted. The bundle is the one `local/build.mjs` produces,
served over 127.0.0.1 and imported as a module. The eight cases: enroll on a
genuinely first-run profile; a durable weigh-in at revision 2; **the whole browser
context closed and a NEW one opened on the same profile directory** — status
`ready/LOCAL_PRESENT`, `boot()` at revision 2 with the read, the era id and the
clean-init `derived` intact; re-enrollment refused; two tabs each with their own
factory racing one revision, both acknowledged, 3 reads at revision 4; a third
context reading all three operations back with `resumeAfterKill()` reporting no
ghost; **a context whose clock is 201 days ahead renewing the lease as a real
durable commit** (revision +1, a later `not_after`, the same `lease_id`, and a save
that works); and **a context 402 days ahead — past the original cliff — booting
ready with 4 operations and saving again.**

Edge launched on the first attempt; nothing was skipped. Exit 2 (BLOCKED) is
reserved for a missing `playwright-core` or a missing/absent `W6_BROWSER_BIN`, and
is printed rather than passing silently.

## RESIDUALS

**The lease cliff, stated precisely (was R+1 in the review).** Self-renewal removes
the fixed calendar cliff but does not remove the cliff. The exact residual:

- An installation whose app is **never opened for 400 consecutive days** lapses.
  Every save is then refused, permanently as far as C1 is concerned, with
  `state:20 / LOCAL_LEASE_EXPIRED` and `status()` reporting `restore-required` —
  never `ready`. The data stays readable (`boot()` returns the view with
  `readable:true`), so nothing is lost; only writing stops.
- **C1 designs no way out of that state.** An expired lease is deliberately not
  re-signed, `enroll()` refuses (not first-run), and there is no restore path here.
  The exit is C2's PC port or a hosted onboarding, neither of which exists yet.
- Renewal needs a **durable commit**, so a device with no writable storage left
  cannot renew. That failure is reported (`leaseRenewalCode`) and is not fatal
  while the surviving window lasts — but if it persists for 200 days, the era
  lapses. Untested: no case simulates 200 days of continuously failing renewals.
- Renewal trusts the **device clock**. A clock set far forward renews to a far
  future date; a clock set far back can read a live lease as not-yet-valid
  (`LOCAL_LEASE_NOT_YET_VALID`). There is no trusted time in the local era —
  `authenticatedTimeSample` is a hosted mechanism — so this is unavoidable here and
  is not defended against.

**What a browser cannot prove, and this evidence therefore does not:**

- **iOS Safari.** Every case ran in Node's fake-indexeddb or in Chromium (Edge).
  Joe's phone is not a Chromium browser. Safari's IndexedDB has its own eviction and
  its own transaction behaviour; that is C3, and the runner prints its own
  `NOT RUN` line rather than implying coverage.
- **Real eviction.** A scripted record delete is not the browser deciding to clear
  site data under pressure. The presence probe reports the SHAPE that results
  (partial → restore-required) — it cannot prevent eviction, cannot distinguish the
  browser's erasure from the athlete's, and cannot tell either from same-origin
  script that erased one database on purpose.
- **Real power loss.** `tx.abort()` after the write reaches IDB is the closest honest
  analogue; it is not a dead battery mid-`fsync`. The repository asks for
  `durability: "strict"` and reports `{requested, actual}`; whether the platform
  honoured it is the platform's claim, not ours.
- **Real elapsed time.** Days 199/201/401/402/500 are an injected clock (and a
  browser clock offset), not waiting. Nothing here has been left for a year.

**Deferred, by design:**

- Hosted adoption of local-era operations (identified by `lease_id`, which survives
  renewal unchanged) — with hosted sync, DECISIONS:88.
- The outbox drain. Entries accumulate; correct for the local era.
- **P1 production key custody/recovery stays BLOCKED.** Local-era custody means an
  evicted or wiped device key equals an unreadable installation: the recovery path is
  the PC port (C2), with the frozen app as the standing fallback. This is written into
  `local-keys.mjs`'s header too, so it cannot be read as solved.
- Import of Joe's real data (C2); phone proof (C3); format 2 frames.
- `execute("workout", …)` is wired and the self-issued lease is `schema_version: 2`,
  so the command is reachable — but **no workout case is proven here.** The existing
  W6 workout suites cover that surface against their own collaborators.
- The clean-init `value` at `collections.derived` is carried verbatim and never
  interpreted. Whether the engine's `s` blob is the right shape is Track A's.
- A pair-erasure matrix (two of three signals gone) is proven by the reviewer's own
  probes, not by a case in this suite; the suite tests each single erasure and the
  total erasure.

## DESIGN NOTES (every deviation from the brief, with its reason)

1. **Bundle output is `rebuild/m3/w6/.tmp/local/local.js`, not `dist/local.js`.** The
   brief asked for `dist/local.js` "gitignored like the existing bundle". The existing
   bundle is written to `rebuild/m3/w6/.tmp/browser/w6.js`, and `.tmp/` is in both
   `.gitignore` files; `dist/` is in neither, so honouring the literal path would have
   meant editing `.gitignore` — a file C1 does not own. `buildLocalBrowser({ outfile })`
   takes any path. Nothing about the bundle's content changes.
2. **The enrollment marker lives in a third database, `<databaseName>-local` (store
   `markers`, record `enrolled`).** The brief named the keys database and the
   generations store but not the marker's home. It cannot go in the generations
   database: `repository.mjs` opens that at format version 1 and creates only the
   `generations` store, so a second store there would need a version bump — and format
   1 was to stay byte-untouched. Putting it in the keys database would have collapsed
   two of the three presence signals into one. A third database keeps them genuinely
   independent, which is what makes "any partial presence = restore-required" mean
   something.
3. **`projector` returns the sidecar's `value`; C1 computes `basis`.** The brief's "its
   return value is written to `collections.derived`" is ambiguous between the whole
   `{basis, value}` and just the value. Letting the host author `basis` would let a
   cache assert coverage it does not have. So the host owns `value` and only `value`.
4. **The sidecar never vetoes a save.** REVISED after review. A basis BEHIND the
   candidate's ops is legal; a basis AHEAD of them, or a malformed record, is
   *unusable* — reported as `derived:null / derivedStale:true / derivedCode`, not
   refused. The validator judges only a sidecar THIS commit authored. The earlier
   "fail closed" framing was the wrong default for a cache: refusing every subsequent
   commit because a cache is broken is failing shut, not failing closed, and it
   contradicted this module's own "ops are truth" header. C1 still refuses to rewrite
   or discard a host value it did not produce — it declines to *report* it, which is
   the narrowest honest action.
5. **The device key is persisted only AFTER revision 1 is sealed, and the marker
   last.** A failed `initialize` leaves no key beside no generation — still a clean
   first run. A failed key persist leaves a generation with no key, which is state 18,
   never a second key and never a reseed. A failed marker write leaves generation +
   key without a marker, which reports `restore-required` rather than `first-run`: the
   conservative direction, because the alternative is reseeding over data that exists.
6. **`boot()` does not re-derive a restore-required verdict from whether the bytes
   decrypt.** Found by the partial-erasure case: with the marker erased and the
   generation perfectly readable, `bridge.reopen()` succeeded and `boot()` reported
   ready. A restore-required verdict from the presence probe stands — with one
   deliberate exception, `LOCAL_LEASE_EXPIRED`, where the data IS readable and `boot()`
   returns the view alongside the refusal.
7. **The session epoch is carried, not checked.** REVISED after review. It stays in
   the stage context for shape-compatibility with the bridge (and any future validator
   with something else to compare against), but the branches that "validated" it and
   the namespace against the same closure variables are deleted: they could not fire.
   Namespace is really enforced by `repository.mjs` on the sealed record and in the
   AAD, which is what the wrong-namespace case exercises (state 18, from `load()`).
8. **The lease is self-renewing, and self-renewal is not authority.** Lane-lead
   decision after review. The signing key sits inside the same sealed generation it
   authorizes; renewal proves the integrity of that record and lets the unchanged
   `lease.cjs` verify. `lease_id` never changes, so local-era operations stay
   identifiable across any number of renewals. An expired lease is never renewed,
   which keeps the cliff real, reachable and named instead of silently papered over.
9. **The state-20 code is derived from the sealed lease, not from a copy string.** The
   real client's refusal carries neither a code nor (here) a `reason`, because the
   face's write-state precedence answers before `lease.cjs` is asked. So on a state-20
   refusal with no code, C1 loads the sealed lease and checks the window itself; the
   `reason`→code map is kept only as a refinement for the paths that do supply one.
   The extra read happens on the refusal path only.
10. **`resumeAfterKill()` builds the unchanged client over the freshly loaded
    collections and never commits.** `t2-stage.cjs` exposes only `client.face()`, and
    adding a resume export to it would have meant editing an existing W6 file. A
    read-only `createClient` over `memoryBackend(loaded.collections)` gives the real
    resume face with no repository write and no sequence consumed.
11. **`status()` is synchronous** and reflects the last observation: the factory probes
    at open — including reading the sealed lease window, so it can never say `ready`
    about an installation that cannot be written to — and `enroll()` / `boot()` /
    `execute()` refresh it.
12. **The presence probe never creates what it asks about.** `databases()` where
    available; otherwise it opens and aborts the `versionchange` transaction, so a
    database that did not exist still does not. A database present but missing the
    expected store also reads as absent, the safe answer for a half-made one. Case 15
    hides `databases()` to exercise the fallback for real.
13. **The bite mutates the working file and restores it, rather than copying the
    tree.** `test/workout-bite.cjs` runs inside a temp tree it was handed; reproducing
    that here would mean copying a tree whose `node_modules` are junctions. The same
    contract is kept — unique needle, guaranteed `finally` restore, `Buffer.equals`
    byte check, sha256 printed before and after — plus a copy of the original in
    `.tmp/local-bite/` before the first mutation.
14. **No additive export line was needed anywhere.** Zero existing files changed.
