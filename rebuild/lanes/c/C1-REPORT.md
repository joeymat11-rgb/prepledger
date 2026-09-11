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

---

# C1b REPORT — the local era, spoken as a durable-client scope

Same branch, same worktree, same Node. C1 is above this line and is unchanged in
substance; everything below is the follow-on that closes the gap the A0 merge
left open.

**The gap, in one sentence.** `composeWorkoutHost` is BINDING ONLY — every
collaborator injected — and its own journey test injects SYNTHETIC ones (a
synthetic identity, a synthetic signing key, a synthetic lease, a pass-through
observation guard, `validateCommit: () => null`). `host/index.html` says "the
page's own bootstrap supplies the repository, keys, clock, engine and athlete
setup", and nothing did. C1b is that bootstrap's local half: one call that turns
a real first-run installation into the exact twelve-member durable-client scope
`createDurablePublicClient` / `composeWorkoutHost` ask for, with **no synthetic
value anywhere in it**.

**No `host/` file was edited.** `rebuild/m3/w6/host/**` is byte-identical to the
A0 merge; its 22 tests still pass unchanged. The host stays binding-only and the
local era supplies the bindings — which is the whole point of the A0 design.

## WHAT WAS BUILT (C1b)

| file | sha256 | lines |
|---|---|---|
| `rebuild/m3/w6/local/host-bindings.mjs` (new) | `aabe4f26454386d35a74bc0c74b5264592654260fc5aa1991060c29d02ffc118` | 284 |
| `rebuild/m3/w6/local/host-browser-entry.mjs` (new) | `476b6c0266ccacefa82d02d5f5f5dcdd042c11ca78af45b86f01eefca6aacecb` | 19 |
| `rebuild/m3/w6/test/local-host-journey.test.mjs` (new) | `25cea4c5e64b1a9b63039e307da12bb34a30270080979a162651bde19cb95806` | 444 |
| `rebuild/m3/w6/test/local-host-browser.mjs` (new) | `ef97680d35978879d7e025040c1856506f5153a2de7c08dcf0eb2bbc89006e33` | 186 |
| `rebuild/m3/w6/test/static-modules.mjs` (new) | `4505ba63dfb64b0bbf199b10c051ec64ffc895235534774883b01ae51c37c203` | 66 |
| `rebuild/m3/w6/local/local-client.mjs` (edited, additive) | `a055c623ca0b1c95cc5cbad3386b8cb9cdfdc58e32f5ecd549d88762d3814ea9` | 392 |
| `rebuild/m3/w6/local/build.mjs` (edited, additive) | `e500644550d6dfc922d09e8ba73b27c6eb8ef2b29a54514fb5ce847b2839e66b` | 37 |
| `rebuild/m3/w6/test/browser-check.mjs` (edited, the harness fix) | `eb1e5c8e19ced67bfca860dba7627a6950dd793cac2fe4ad48e5de130cd12b07` | 101 |

Every path is inside C1b's ownership (`rebuild/m3/w6/local/**`,
`rebuild/m3/w6/test/**`, this report). Nothing under `host/`, `client/`,
`engine/`, `m4/`, no lockfile and no `.gitignore` was touched, and no install of
any kind was run.

Changes to `local-client.mjs` are strictly additive: one import, one exported
`LOCAL_SCOPE` symbol, a `booted` flag, an internal scope reader, and one new
method `hostBindings(options)`. Every existing export and behaviour is intact —
the C1 suite, the C1 bite and the C1 browser runner all still pass (below).

## WHAT THE BINDINGS SUPPLY, AND WHY EACH VALUE IS HONEST

`localHostBindings(clientOrOpenOptions)` returns exactly twelve members —
`Object.keys()` is asserted against the list, so a thirteenth cannot creep in.

| member | value | why it is honest, not a stand-in |
|---|---|---|
| `repository` | the C1 installation's own `openRepository` handle | the same sealed IndexedDB generations C1 writes; there is no second store |
| `stage` | `createT2Stage` over `localEraConfig(metadata, …)`, `allowInbound: true` | the SAME configProvider C1's own bridge uses, so both write paths read one era from one place |
| `namespace` / `athleteId` / `deviceId` | the open options | the values the generation was sealed under; `localEraConfig` refuses a scope mismatch |
| `sessionEpoch` | the client's own per-open epoch | one process-lifetime identity, generated in the factory closure; nothing outside can set it |
| `isCurrentSession` | `epoch === sessionEpoch && !closed` | a CLOSED client is not the current session, so a retired session's write can never be Saved |
| `observationEpoch` | `() => sessionEpoch` | in a local era there is exactly one observation — this device's own — so the observation epoch IS the session epoch. Anything else would be inventing a second observer |
| `observationGuard` | pass-through for local kinds; **refuses every inbound kind** | see K1 below |
| `validateCommit` | C1's `commitFailure` over this stage's own record | the identical synchronous, reject-only validator C1 proved with its bite; adapted only in that the context comes from the public client's bridge |
| `keys` | ONE pin: this device's own P-256 verification key | see "the one thing the brief did not anticipate" below |
| `crypto` | the `crypto` the factory was opened with | the same WebCrypto that seals the generation |

### K1 is not applicable here, so the guard records nothing

The K1 fence exists to stop a client acting on knowledge it got from a hosted
authority between verification and durable outcome. **No hosted knowledge exists
on this phone.** There is nothing to have learned and nothing to fence, so the
guard passes local work straight through and keeps no state — a recorder with
one observer to record would be theatre, and a fake ledger is worse than none.

What it *does* do is the honest half: `disposition`, `pull`, `snapshot`,
`lease`, `time`, `current-head-exchange` and `time-exchange` are refused
outright, **before the callback runs and therefore before the pinned key is ever
consulted**, with `state 12` / `LOCAL_ERA_NO_INBOUND`. State 12 is the client's
own "this protocol is not installed", not a storage fault — because nothing is
wrong with the stored truth; there is simply nowhere for an inbound record to
have come from. Test 10 fires all five entry points, including with a lease this
device really did sign, and asserts the revision and token do not move.

### The one thing the brief did not anticipate: `keys` cannot be empty

The brief asked for "an empty list if the factory accepts it". It does not, and
neither does the durable client — and the reason runs deeper than the argument
check:

* `composeWorkoutHost` refuses `keys` unless `Array.isArray(keys) && keys.length`;
* `W5.createPublicVerifier` throws `TypeError` on an empty list; and, decisively,
* `public-client.mjs` `stageVerified` verifies
  `generation.metadata.authorityLease` with that P-256 verifier **on every staged
  command**, not only on inbound ones — a failure is `LEASE_PROOF_UNPROVEN` /
  state 18. So a local era that wants the public client cannot hand it "no keys":
  it has to hold a lease the W5 verifier can check.

The answer is the same one `local-era.mjs` already gives for the T2 lease: the
era issues one **to itself**. `createLocalHostAuthority` mints a P-256 keypair,
`signHostLease` signs a W5-shaped lease with it, and the pin is that keypair's
public half. The lease is the era lease **field for field** — same `lease_id`
`local-era:<eraId>`, same `range`, same `not_before`/`not_after`, same
`schema_version 2` — so both write paths stamp one `lease_id` and there is one
window, not two. The private half lives in `metadata.localHostAuthority`, i.e.
inside the same sealed generation it authorizes, encrypted at rest under the
device key, never in plaintext storage and never logged.

**This is not a dummy authority key.** A dummy would be a value that *claims* to
be someone else's decision. This one claims nothing: it is the integrity pin for
a record this device signed, it is named `local-era-<eraId>` so it cannot be
mistaken for anything else, and the observation guard makes it structurally
incapable of admitting an inbound record. `local-era.mjs`'s own header already
states the rule it inherits — "it proves the integrity of that sealed record,
NOT permission from anyone".

One consequence worth stating plainly: because ECDSA is randomised and WebCrypto
does no low-S normalisation, about half of all raw signatures would be rejected
by the very verifier they are for (`decodeSignature` requires `0 < s <= n/2`).
`canonicalSignature` normalises S and re-draws a degenerate signature, which is
what makes the lease verifiable by the **unchanged** `rebuild/m3/w5/public-client.cjs`.
Test 1 asserts that verifier accepts it and rejects a tampered copy.

### Where renewal runs, and who commits

The brief asked the right question. C1's `boot()` is what keeps writing alive:
inside the last 200 days it re-signs the still-valid era lease for another 400
and commits it. When the HOST writes, the writer is the **public client's own
bridge**, which never calls `boot()`. So the rule is made explicit rather than
assumed, in two parts:

1. `hostBindings()` **refuses outright** unless `boot()` has already reported
   ready (`LOCAL_HOST_BINDINGS_BOOT_REQUIRED` / 18). The flag is retired by any
   non-ready `boot()` and by `close()`, so a stale earlier success cannot open
   the door. Tests: first-run before enroll, first-run after enroll, and after
   either kind of partial erasure.
2. `hostBindings()` then runs the SAME renewal check itself, inside the one
   durable commit that installs or refreshes the host lease. That is the second
   chance if `boot()`'s own attempt failed (C1 treats that as non-fatal and
   reports `leaseRenewalCode`), and it happens **before the scope object
   exists** — therefore before the public client's first write.

The decisive test drives a movable clock: enroll and `boot()` on day 0 (nothing
due, `leaseRenewedUntil: null`), then move to day 201 **with no second boot** and
call `hostBindings()`. Only the bindings can renew at that point, and they do —
`installed: true`, `not_after` moves, the W5 lease follows it exactly, and
`leaseRenewalDue(era.lease, now)` is asserted `false`, i.e. *the scope never
exists over a lease still due for renewal*. Move to day 1000 and the scope is
refused `LOCAL_LEASE_EXPIRED` / 20 rather than discovered on the first save.

A second `hostBindings()` over an installed era writes nothing: revision and
token are asserted unchanged, and a relaunch reports `installed: false`.

### The zero frontier — a C1 gap C1b found and closed

C1 seals `sync` empty. That is right for its own path (`rebuild/client` boots an
absent frontier as `{W:0, authorityW:0}`), but it leaves the host's **correction
path unreachable**: `prepareWorkoutEdit` compares
`collections.sync.frontier.authorityW` against the history's own `W`, and
`undefined !== 0` refuses `WORKOUT_EDIT_PREFIX_INCOMPLETE` / 18. So on a C1
generation the athlete could log a set and never fix it.

`installHostAuthority` writes `{W: 0, authorityW: 0}` in the same commit when the
frontier is absent. That is not an invention: it is the only frontier a local era
can have, it is exactly what T2 already defaults to, and it says the true thing —
no authority has accepted anything here, because there is no authority. C1's own
seed and its "every collection sealed empty" assertion are untouched; the
frontier appears only when a host asks for bindings. Journey step 8 proves the
correction lands and the original stays immutable.

### The derived sidecar is CARRIED on the host path, never authored

The host's derived state is the engine history projector's, computed from ops; a
projector configured for C1's commands knows nothing about a workout batch. So
the host stage carries C1's sidecar exactly as it found it and authors one only
where none exists. Consequence, asserted rather than hidden: after host writes
the cache's basis is *behind* the ops, which `boot()` reports as
`derivedStale: true` with `derivedCode: null` — older, not damaged. Ops are
truth. The only validator check that can fire on this path is therefore
`LOCAL_SIDECAR_UNPROVEN`, the fail-closed one, and test 1 fires it directly.

## THE BROWSER HARNESS — ROOT CAUSE AND FIX

DECISIONS:98 records, against the A0 merge: *"browser journey NOT RUN (retained
Chromium harness fails to fetch repository.mjs — Track C/host follow-on)"*.

**The message points at the wrong file.** `test/browser-check.mjs` served exactly
two paths — `/` and `/repository.mjs` — and 404'd everything else. That was
complete when `repository.mjs` was self-contained. Since the K1 recovery work it
opens with

```js
import { createRecoveryStage } from './recovery-stage.mjs';
import { createImportCustody } from './import-custody.mjs';
```

so the page's `await import("/repository.mjs")` makes the browser fetch two more
modules, both of which the harness 404s. ES module resolution fails as a whole,
and Chromium reports the failure against the **entry** module, not the missing
dependency. Reproduced here on the pre-fix file, verbatim:

```
W6 BROWSER-REPOSITORY FAIL — page.evaluate: TypeError: Failed to fetch
dynamically imported module: http://127.0.0.1:62227/repository.mjs
```

Nothing is wrong with `repository.mjs`. The harness's allowlist was one commit
behind its own dependency graph. It is not an allowlist problem, not a MIME
problem and not a path-root problem: it is a **single-filename server for a
module that grew a graph**.

**The fix** is `rebuild/m3/w6/test/static-modules.mjs`: serve the W6 **directory**
rather than a hand-kept list of filenames, so a new relative import can never
silently break a harness again. Two properties of that file keep it safe, and no
caller can widen them:

* **containment** asserted on the REAL path after `realpathSync`, so no `..`,
  absolute path or symlink escapes the tree (a lexical check alone would follow
  a link out); and
* an **extension allowlist** (`.mjs .cjs .js .map .json .html .css .woff2 .txt`),
  so the harness can never hand a browser a key file, a ledger or a dotfile that
  happens to sit under the same root.

A caller may also inject files that live outside the root (`files: {"/host.js":
…}`) for a built bundle written into `.tmp/`.

`browser-check.mjs` now uses it and passes 6/6 — a harness that had been dark
since the K1 merge. **No `host/` file needed changing, so there is no REQUEST TO
PM for this item.**

## COMMANDS + RESULTS (Windows, this worktree)

`NODE` is `C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`
(v24.19.0). PowerShell blocks `npm.ps1`, so node is called directly; output was
redirected to a file with `Set-Content -Encoding UTF8` and read back, because the
shell mangles `✔`/`ℹ`. Exit codes were captured from `$LASTEXITCODE`, not inferred.

| command | before C1b | after C1b |
|---|---|---|
| `NODE --test rebuild/m3/w6/test/*.test.mjs` | `tests 456 · pass 456 · fail 0` | **`tests 470 · pass 470 · fail 0`**, exit 0 — the 456 unchanged plus 14 new |
| `NODE --test rebuild/m3/w6/test/local-host-journey.test.mjs` | — | `tests 14 · pass 14 · fail 0`, exit 0 |
| `NODE --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs` | `tests 22 · pass 22 · fail 0` | **`tests 22 · pass 22 · fail 0`**, exit 0 — unchanged, `host/` untouched |
| `NODE rebuild/m3/w6/build-browser.mjs` | `w6.js` `b733c830…3143d`, `w6.js.meta.json` `ffe65850…9b00c` | **byte-identical**: `b733c830…3143d` / `ffe65850…9b00c`, exit 0 |
| `NODE rebuild/m3/w6/local/build.mjs` | `34 pinned local inputs`; `local.js` `ab944312…4cb58` | `36 pinned local inputs`; `local.js` `7a43cdd11ee85166c6bc2ab720f2a460fc919f6f685a5e9a1a2b1b9ea14d1e30` — moved because `local-client.mjs` now imports `host-bindings.mjs` (+ `authority/canonical.cjs`), and **`W6 LOCAL-HOST BROWSER BUILD PASS — 96 pinned local inputs`**, `host.js` `9694e4a2b0ecc0d4e625db8a49382b58155159d69718819736009896b22afc48` |
| `NODE rebuild/m3/w6/test/local-bite.cjs` | RESTORED PASS | **RESTORED PASS**, exit 0 — all four bites still RED: durability-gate, stage-basis, sidecar-self-heal, lease-self-renewal; source `a055c623…14ea9` before and after |
| `NODE rebuild/m3/w6/test/local-browser.mjs` (Edge) | `8/8` | **`8/8` PASS**, exit 0; Edge 152.0.4191.66 |
| `NODE rebuild/m3/w6/test/browser-check.mjs` (Edge) | **FAIL** — `Failed to fetch dynamically imported module … /repository.mjs` | **`6/6` PASS**, exit 0 |
| `NODE rebuild/m3/w6/test/local-host-browser.mjs` (Edge) | — | **`6/6` PASS**, exit 0; Edge 152.0.4191.66; 96 pinned bundle inputs |

### The 14 node cases, by what each proves

`local-host-journey.test.mjs` imports the host's own fixture
(`host/test/journey-fixture.cjs`) rather than copying it, so both journeys are
talking about the same athlete on the same day. 2026-09-04 is a Friday; the
engine's fallback week would serve `leg-press`, and this athlete's own split
says `U` — so every assertion about which lifts appear is also an assertion that
the fallback week was never consulted.

1. **first run → enroll → boot → bindings.** The scope is refused before enroll
   AND after enroll-but-before-boot. Then: exactly the twelve members;
   `isCurrentSession` true for its own epoch and false for another; the
   validator fails closed when reached without a stage record; the sealed
   generation carries `localHostAuthority` and an `authorityLease` that mirrors
   the era lease field for field and verifies under the unchanged W5 verifier
   (and does not verify with `device_id` swapped); `sync.frontier {W:0,authorityW:0}`.
2. **a second `hostBindings()` writes nothing** — revision and token unchanged.
3. **`prepareWorkout` + `startPreparedWorkout` through the real host.** Five
   slots across `db-bench` / `lat-pulldown`; the stored Start is a real
   `session-start`, `schema_version 2`, v2 capture profile, `lease_id
   local-era:<eraId>`.
4. **three sets** through `host.client.execute('workout', …)`, all with the same
   `lease_id`.
5. **ONE GENERATION.** A `weighIn` through C1's own bridge plus the four session
   ops: five operations, one `meta/checkpoint` whose counts describe the whole
   generation, `meta/device.seq 5`, `device_seq` 1–5 with no gap, ONE distinct
   `lease_id` across both write paths, and the carried sidecar reported
   `derivedStale: true` / `derivedCode: null`.
6. **close.** The scope's `isCurrentSession` goes false; a late host write is
   refused and nothing is Saved.
7. **RELAUNCH** a new factory over the same store: `ops 5`, same `eraId`,
   `installed: false`; history reads the original capture byte for byte; the
   session resumes with three recoveries and no second Start; the two remaining
   slots are logged through `executeResumedWorkout`; C1's own `resumeAfterKill()`
   still reads the same store.
8. **finish + correct.** `session-close`, then `prepareWorkoutEdit` /
   `commitWorkoutEdit` — reachable only because of the zero frontier — with
   `original.reps 9` and `current.reps 10`.
9. **NOTHING SYNTHETIC in the sealed metadata.** The fixture key (`O.AUTH_KEY`),
   the fixture identity key (`O.K_IDENTITY`), the fixture lease id `L-dev-A` and
   `synthetic-enrollment-only` are all absent; so are the substrings
   `synthetic`, `fixture` and `test-identity`. Every lease-shaped record in
   metadata carries this era's `lease_id`; the pinned kid names this era; no
   `wireProofs` were ever admitted. And the clincher: all eight-plus stored
   commitments are recomputed with `Ops.commitmentOf(op,
   metadata.localEra.identityKey)` and must match — the identity every operation
   was taken under is the installation's own, not a fixture's.
10. **every inbound path refuses cleanly and writes nothing** — four
    `acceptResponse` kinds plus `exchangeServerTime`, all `state 12` /
    `LOCAL_ERA_NO_INBOUND` / `stored: false`, revision and token unmoved.
11–12. **partial erasure stays restore-required**, twice: the enrollment marker
    erased (data perfectly readable) and the device key erased. Both give
    `status restore-required`, `boot().ready false` state 18, `hostBindings()`
    rejected `LOCAL_HOST_BINDINGS_BOOT_REQUIRED`, and `enroll()` still refused —
    no reseed over an existing installation.
13. **renewal before the scope exists** (the movable-clock case described above),
    including the expired-era refusal at day 1000.
14. **`localHostBindings` accepts an open client or the open options**, returns
    the same twelve members either way, gives a new session epoch for a new open,
    does not re-install an era it finds installed, and refuses a first-run
    installation through the options form too.

### The 6 browser cases (`local-host-browser.mjs`, real Edge, fresh profile)

1. first run in a real browser: enroll, boot, bindings install the era's own
   P-256 lease; the twelve members, `kid local-era-<eraId>`, `leaseId
   local-era:<eraId>`;
2. the real host prepares today's workout off the athlete's own split (five
   slots, `db-bench` / `lat-pulldown` — not the fallback week);
3. Start and ONE logged set: real durable commits through the public client into
   real IndexedDB, `ops 2`;
4. **the whole browser context goes away** — process, page, every in-memory
   handle — and a new context on the same profile directory reopens it: `ops 2`,
   same `eraId`, `installed: false`, same kid;
5. history read in the new context: one session, the prescription byte-identical,
   and the logged set's `reps 9` still there;
6. the session continues in the new context with one completion recovered and no
   second Start; reading and resuming wrote nothing.

## DESIGN NOTES (C1b) — every decision taken without asking, and why

1. **`keys` is one self-issued P-256 pin, not an empty list.** The brief offered
   "empty if the factory accepts it". It does not, and the durable client needs
   a verifiable `authorityLease` on every staged command, not just inbound ones.
   Full reasoning above. The alternative — refusing to compose the host at all in
   a local era — would have left the gap exactly where A0 left it.
2. **The observation guard refuses inbound rather than passing everything
   through.** The brief said "a pass-through that records nothing". It is that,
   for the local kinds. But once a pinned key exists, "pass-through" would mean
   an inbound record could be *verified* — so the guard refuses every inbound
   kind first. Refusing is what makes the pin harmless.
3. **`allowInbound: true` on the host stage.** Not a contradiction of (2). The
   public client hands the stage a `historyAuthentication` set on every workout
   read; with `allowInbound` false, `t2-stage.cjs` refuses that read
   `LOCAL_HISTORY_IDENTITY_UNPROVEN`/18 before the host sees it. The inbound
   *commands* it also enables need a verified `record` + `proof`, which the guard
   makes unreachable.
4. **The host lease MIRRORS the era lease instead of having its own window.**
   One installation, one window, one `lease_id`, one renewal rule. Two windows
   would be two things to expire and a second way to be wrong.
5. **A missing or malformed `localHostAuthority` is re-minted, not refused.**
   Re-minting loses nothing: no operation is bound to the kid — operations carry
   `lease_id`, which is the era's and is unchanged by a re-mint. So this is
   self-healing rather than a new way to need recovery.
6. **The zero frontier is written.** Reasoned above. It is the one frontier a
   local era can have; leaving it absent silently removed the athlete's ability
   to correct a recorded set.
7. **`hostBindings()` requires `boot()`.** The alternative — booting implicitly
   inside `hostBindings()` — would have hidden the renewal instead of making it
   explicit, and would let a host skip the C1 status semantics entirely.
8. **`isCurrentSession` goes false on `close()`.** A closed client is not the
   current session. In practice the closed repository handle usually answers
   first with state 18; the session fence is what stops a *still-open* store
   accepting a retired session's write. The test says exactly that rather than
   claiming an ordering it does not control.
9. **The scope is frozen with exactly twelve enumerable keys**; the owning client
   and the install summary hang off symbols (`LOCAL_HOST_CLIENT`,
   `LOCAL_HOST_INSTALL`) so `Object.keys` stays the contract and a spread into
   `composeWorkoutHost` carries nothing extra.
10. **`local-client.mjs` ↔ `host-bindings.mjs` is a deliberate import cycle.**
    Neither side touches the other's bindings at module-evaluation time, only
    inside functions called later; it is what lets `local.hostBindings()` exist
    without a dynamic `import()` chunk in the phone bundle. Both Node and esbuild
    handle it, and all three browser runners prove the bundled form works.
11. **The static server serves a directory, not a filename list.** The defect it
    fixes was a filename list going stale; replacing it with a longer filename
    list would have been the same defect with a later expiry date.
12. **`host-browser-entry.mjs` lives in `local/`, not `host/`.** It re-exports
    `host/host-entry.mjs` unchanged and adds the local exports, so a local-era
    page gets one bundle without a single edit to a PM-owned file.

## RESIDUALS (C1b)

1. **No `subtle` seam.** `composeWorkoutHost` has no `subtle` parameter, so
   `createDurablePublicClient` falls back to `globalThis.crypto.subtle` for the
   W5 verifier even though the bindings inject `crypto`. Correct in Node 24 and
   in every browser this targets, and harmless — but it means the verifier is not
   using the injected object. Listed under REQUEST TO PM.
2. **`WORKOUT_PREPARATION_INVALID` still masks the specific code.** Unchanged
   from the A0 note; a host refusal surfaces the generic code, so the split-guard
   and basis refusals are not distinguishable to a screen yet. Screen-tier.
3. **iOS Safari is NOT covered.** Chromium-family (Edge 152) only, as in C1. C3's
   job. The C1b bundle is larger (96 pinned inputs vs 36) because it carries the
   engine and the prepared panel; nothing about iOS storage eviction changes.
4. **No C1b bite.** The C1 bite still proves C1's four invariants. C1b's own
   invariants — the lease mirror, the boot fence, the inbound refusal — are
   proved by direct positive AND negative assertions, not by a mutate-and-restore
   runner. A C1b bite is a reasonable ask and is not done.
5. **Key custody is unchanged and still local-only.** A browser that evicts site
   data destroys the device key and with it the era, the host authority and every
   sealed generation. P1 stays BLOCKED; the recovery path is C2's port.
6. **The host authority's private JWK is extractable in memory at mint time**
   (WebCrypto cannot export a non-extractable key, and the JWK must be sealed so
   the lease can be re-signed at renewal). It is written only into the encrypted
   generation, never logged, and `publicEra()` still exposes only identifiers and
   a window. This is the same trade `local-era.mjs` already makes for
   `authorityKey`.
7. **Nothing here adopts local-era operations into a hosted era.** Still deferred
   with hosted sync (DECISIONS:88). C1b only makes the `lease_id` marking
   consistent across both write paths, which is what a future adoption would read.

## REQUEST TO PM

Neither item below blocks C1b; both are `host/`-owned and were therefore not
touched.

1. **`composeWorkoutHost` could pass `subtle` through to
   `createDurablePublicClient`.** Add `subtle` to its destructured parameters and
   to the `createDurablePublicClient({…})` call, defaulting to `crypto.subtle`
   when not supplied. One line each; it makes the injected `crypto` actually the
   one that verifies, and removes a `globalThis` read from the phone path.
2. **`host/index.html` + `host-entry.mjs` can now name their bootstrap.** The
   comment "the page's own bootstrap supplies the repository, keys, clock, engine
   and athlete setup" has an answer as of this branch:
   `rebuild/m3/w6/local/host-bindings.mjs` `localHostBindings(client)`. If the PM
   wants the host page itself to boot on a phone, `host-entry.mjs` re-exporting
   `openLocalDurableClient` / `localHostBindings` would make
   `rebuild/m3/w6/local/host-browser-entry.mjs` unnecessary. Lane C did not make
   that edit because `host/**` is PM-owned.
