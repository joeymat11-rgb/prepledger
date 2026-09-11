# C1 REVIEW — independent reviewer (author ≠ reviewer, told to disagree)

## VERDICT: **ACCEPT** — candidate `bcf9518`, branch `rebuild/lane-c-c1`.

Round 1 (`85425fb`) returned ACCEPT WITH CONDITIONS on four counts. All four are
met, verified by my own execution rather than by reading the report. I attacked
the fixes themselves — renewal, the sidecar self-heal, the validator table — and
found **no new defect and nothing regressed**. Three non-blocking observations are
recorded at the end; none is a condition.

Reviewed in a detached worktree `work/lane-c/review-c1` on the owner's Windows PC,
Node v24.19.0. My probes live outside the repo in `C:/Users/joeym/rvlog/`. I
committed nothing, modified no candidate file, and pushed nothing.

---

# ROUND 2 — the fix round (`bcf9518`)

## CONDITIONS: DISCHARGED

### Condition 1 — the day-401 cliff. **MET, and better than I asked.**

I asked for a test and an honest residual. The builder instead removed the cliff
where it could: the lease now **self-renews on `boot()`** while still valid and
inside its last 200 days — same `lease_id`, same `range`, `not_before` untouched,
`not_after` = now + 400 days, re-signed and written in a durable commit.

Executed (probe R1, fresh install, enroll + 2 ops, then opened at each offset):

| opened at | renewed? | durable effect |
|---|---|---|
| day+199 | no (201 d left ≥ 200) | rev 3, ops 2, outbox 2, seq 2, ckpt `{ops:2,outbox:2}` |
| day+201 | **yes** → `2028-05-04` | rev 3→**4**, ops 2, outbox 2, seq 2, ckpt unchanged |
| day+402 | **yes** → `2028-11-21` | rev 4→**5**, ops 2, outbox 2, seq 2, ckpt unchanged |
| day+500 | no (302 d left) | rev 5, ops 2, outbox 2, seq 2, ckpt unchanged |

`lease_id`, `not_before` and `range` preserved at every step. **Renewal spends no
sequence and changes no count** — the coordinator's specific worry, answered.

Probe R8 answers it exhaustively: across a renewal the whole `collections` blob is
**byte-identical** (`JSON.stringify` equal), every metadata field other than
`localEra` is unchanged, `eraId` / `identityKey` / `authorityKey` are preserved,
only the signature and `not_after` move, and the next save takes
`op-dev-phone-A-3` — the sequence continues rather than restarting.

R2: four consecutive `boot()`s at day+201 renew **once** (`3/renewed 3/no 3/no
3/no`), durable revision 3. No revision drift from repeated opens.

R3 — the payoff, and the remaining cliff:

```
day+201 boot renewedUntil = 2028-05-04 ; save ack=true
day+550 (PAST the old day-400 cliff): status=ready/LOCAL_READY, save ack=true state=1
day+1100 (app never opened for 400 d):
  status = {"state":"restore-required","code":"LOCAL_LEASE_EXPIRED"}
  boot: ready=false readable=true leaseExpired=true state=20 code=LOCAL_LEASE_EXPIRED viewPresent=true ops=3
  execute: ack=false state=20 code=LOCAL_LEASE_EXPIRED
           copy="Saving is paused: this phone's local era has lapsed. Your saved entries are intact."
  data intact, unchanged by the refusal: true
```

Every element I demanded is there: the refusal is **named**, `status()` and
`boot()` no longer say `ready`, the data stays readable, and the cliff now needs
400 days of never opening the app rather than 400 days from enrollment.

R9 — the boundary is exact and matches `lease.cjs` (`now > not_after` is expired):

```
exactly not_after : status=ready/LOCAL_PRESENT   boot.ready=true  exec.ack=true  state=1
not_after + 1 ms  : status=restore-required/LOCAL_LEASE_EXPIRED boot.ready=false exec state=20 LOCAL_LEASE_EXPIRED
```

The window is now genuinely asserted in the suite —
`local-client.test.mjs:489` asserts `not_after − not_before === LOCAL_ERA_DAYS *
DAY_MS`, `:490` pins `not_before`, `:513` pins it across a renewal. My round-1
complaint was that `not_after` appeared in **no** test file; it now appears in
fourteen assertions across cases 19–21.

### Condition 2 — the sidecar must not veto a save. **MET, by a better route than I proposed.**

I offered two options: self-heal (discard the bad cache) or document the brick. The
builder took a third: the validator judges the sidecar **only when this commit
authored it**. A carried cache is the host's, is never judged, and is never
rewritten or discarded. That is stronger than my suggestion — it keeps the
"C1 never touches a host value it did not produce" rule intact.

Executed (probe R4): I planted four shapes of bad cache through a raw repository,
then saved three times with **no projector**.

| planted cache | saves | boot report | cache on disk |
|---|---|---|---|
| `{basis:{opCount:1,lastOpId:"op-…-1"}}` (no `value`) | `true/1 true/1 true/1` | `derived=null derivedStale=true derivedCode=DERIVED_SIDECAR_MALFORMED` | carried **unchanged** |
| `{basis:{opCount:99,lastOpId:"op-forged"},value:{x:1}}` | `true/1 true/1 true/1` | `derivedStale=true derivedCode=DERIVED_BASIS_AHEAD_OF_OPS` | carried **unchanged** |
| `{basis:{opCount:1,lastOpId:"op-nope"},value:{x:1}}` | `true/1 true/1 true/1` | `derivedStale=true derivedCode=DERIVED_BASIS_AHEAD_OF_OPS` | carried **unchanged** |
| `{basis:7,value:{x:1}}` | `true/1 true/1 true/1` | `derivedStale=true derivedCode=DERIVED_SIDECAR_MALFORMED` | carried **unchanged** |

In round 1 every one of these refused three times out of three and never
self-healed. Now every one saves three times out of three, the athlete's entry
lands, and the host is told precisely why the cache cannot be trusted. Ops are
truth, and the code finally behaves like it.

R5 — the second half of the condition (`derivedStale` must be true whenever
`sidecarFailure` is non-null): I ran 15 sidecar shapes including `null`,
`undefined`, `7`, `"x"`, `[]`, `{}`, a negative `opCount` and a numeric
`lastOpId`. **0 violations.** A genuinely fresh cache still reports
`derivedStale: false`. The round-1 trap — a malformed cache reported as fresh with
`value: null` — is closed.

R6 — CAS retry with a stale basis under a projector. Six contended operations
across two independent factories: all six acknowledged, revision 7, `device_seq`
1–6 contiguous, and the **committed sidecar basis matches the final ops exactly**
(`{opCount:6,lastOpId:"op-dev-phone-A-6"}`, `value {n:6}`), naming a real op, with
`derivedStale=false` on boot. No stale basis survives a retry.

### Condition 3 — dead validator branches. **MET.**

Grepped all eight candidate files for `LOCAL_NAMESPACE_MISMATCH|LOCAL_SESSION_CHANGED`:
**no hits — both deleted.** `sessionEpoch` survives only in the stage context, and
the code says so in a comment: *"It is NOT a check: nothing but this closure can set
it, so it cannot disagree with itself."* That is the round-1 finding, accepted and
written down.

I checked the report's validator table line by line against the code. Every
`code: "…"` that `commitFailure` can return (`local-client.mjs:62,67,68,69,94,99,102`):

| code | in the report's table? | reachable? |
|---|---|---|
| `LOCAL_SIDECAR_UNPROVEN` | yes | yes — R5: superseded attempt returns it |
| *(null — carried cache)* | yes | yes — R5 and R4 |
| `DERIVED_SIDECAR_MALFORMED` | yes | authored only |
| `DERIVED_BASIS_AHEAD_OF_OPS` | yes | authored only |
| `DERIVED_BASIS_WITHOUT_BATCH` | yes | yes — R5 returns it directly |
| `DERIVED_BASIS_NOT_THE_COMMITTED_BATCH` | yes | yes — bite 2 turns it red |

**The table matches the code exactly — no row missing, no row that cannot fire.**
The report is also candid that the four `DERIVED_*` checks are invariant assertions
which fire when the *stage* is wrong rather than when a host misbehaves, and bite 2
breaks the stage to prove it. That is the honest framing; I agree with it.

### Condition 4 — CI. **MET.**

The report now carries its own section, *"CI RELEVANCE — THE AUTOMATED GATE FOR C1
IS NIL"*, stating that `.github/workflows/rebuild.yml` runs no W6 test on either
OS and that the reviewer plus the recorded Windows runs are the entire gate. I
re-read the workflow: it runs W0 (`scope-package`, `public-conformance`,
`public-oracle`, two tests), `rebuild/t2/rig187.cjs`, three `w7-preview` tests and
`rebuild/m4/spec/load-write-package.cjs --ci`. **Still no W6.** The statement is
accurate, and it credits where it came from.

### Condition 4b — residuals now true.

Both false clauses are gone. The new RESIDUALS section is more self-critical than I
required: it states the surviving cliff precisely (400 consecutive days unopened),
says plainly that **C1 designs no way out of it**, and volunteers three residuals I
had not asked for — that renewal needs writable storage and a 200-day run of failed
renewals would still lapse (*"Untested: no case simulates"*), that renewal trusts an
untrusted device clock in both directions, and that the pair-erasure matrix is
proven by my probes rather than by a case in the suite. I confirm all of these are
true and correctly stated. Nothing in the report now claims coverage it lacks.

## WHAT I EXECUTED (round 2)

| command | result |
|---|---|
| `git rev-parse HEAD` | `bcf95180308c18755f518046aebeaff194876dc6` |
| `git diff --stat 9aeb2cc HEAD` | 9 files, **1924 insertions, 0 deletions**; `git diff --name-status` shows all nine as `A`. Still exactly the allowed set — nothing under `rebuild/client/`, `rebuild/engine/`, `rebuild/m3/w6/host/`, no existing W6 file, no lockfile, no `.gitignore`. |
| `NODE --test rebuild/m3/w6/test/*.test.mjs` | `ℹ tests 456 · pass 456 · fail 0`, **EXIT=0** |
| `NODE --test rebuild/m3/w6/test/local-client.test.mjs` | `ℹ tests 21 · pass 21 · fail 0`, EXIT=0 → 456 − 21 = **435 pre-existing**, and the diff proves no existing test changed |
| `NODE rebuild/m3/w6/test/local-bite.cjs` | EXIT=0. **Four** bites, each RED as designed: `durability-gate`, `stage-basis`, `sidecar-self-heal`, `lease-self-renewal`. **My own** `Get-FileHash` before = after = `A6784B72…41DA`, length 22826 → 22826. `git status` clean afterwards. |
| `NODE rebuild/m3/w6/build-browser.mjs` | EXIT=0; `w6.js` = `b733c830…3143d`, `w6.js.meta.json` = `ffe65850…9b00c` — **still byte-identical to base**, as in round 1 |
| `NODE rebuild/m3/w6/local/build.mjs` | EXIT=0, 34 pinned inputs; `local.js` = `ab94431221197a3fcad86b9b985dc72b44892b646b7da7d2b0e28c3afcc4cb58` (matches the report; changed from round 1 because the modules changed, which is correct) |
| `W6_BROWSER_BIN=…msedge.exe; NODE rebuild/m3/w6/test/local-browser.mjs` | **EXIT=0**, real Edge `152.0.4191.66`: `8/8 real IndexedDB cases … durable lease renewal past day 401`, plus its own `iOS Safari NOT RUN` line |
| `git status --porcelain` after everything | **empty** |

Every one of the eight candidate sha256s I computed matches C1-REPORT.md rev 2
exactly (table at the end).

My own probes: **R1** renewal preservation at days 199/201/402/500; **R2** repeated
boots; **R3** writing past the old cliff and the surviving cliff at day 1100;
**R4** four bad-cache shapes with no projector; **R5** 15 sidecar shapes plus
`commitFailure` branch-by-branch; **R6** CAS retry under a projector with six
contended ops; **R7** renewal racing concurrent saves and two tabs renewing at
once; **R8** whether a renewal touches anything but `metadata.localEra`; **R9** the
exact expiry boundary. All nine ran to `EXIT=0`.

## WHAT THE FIX ROUND COULD HAVE BROKEN — CHECKED, IT DID NOT

The coordinator named three risks. Each is answered by execution:

- **Does renewal-at-boot spend a sequence or consume anything?** No. R1: across
  every renewal, `ops`, `outbox`, `device.seq` and `meta.checkpoint.counts` are
  unchanged. R8: the entire `collections` blob is byte-identical and only
  `metadata.localEra` differs. The save after a renewal takes the *next* sequence
  (`op-dev-phone-A-3`), not a restarted one.
- **Can renewal race a concurrent `execute()` in a second tab?** Yes, and it is
  handled. R7: tab A boots (renewing) while tab B runs two saves — both saves
  acknowledged, `ops 1 → 3`, `outbox 1 → 3`, `seq 1 → 3`, checkpoint consistent,
  **no op lost**. The renewal commits outside the bridge's queue, so a collision
  surfaces as a retryable `STALE_REVISION` that the bridge retries from the new
  snapshot.
- **Can two tabs renewing at once corrupt anything?** No. R7: one renews, the other
  reports `leaseRenewalCode: STALE_REVISION` and still boots `ready` — the
  documented non-fatal path, with ≥200 days of surviving window. Ops preserved.
- **Does a renewal change the ops/outbox counts or the checkpoint?** No (R1, R8).

## DEFECTS FOUND IN ROUND 2

**None.** No round-1 defect survives, and I found no new one.

## OBSERVATIONS (non-blocking — recorded, not conditions)

1. **Renewal lives only in `boot()`.** A host that opens the factory and calls
   `execute()` without ever calling `boot()` never renews. It would take a single
   session running 200+ days to matter, and `boot()` is the documented open path
   (the browser runner boots), so this is not a risk today — but it is worth
   knowing that *writing* does not keep the lease alive, only *opening* does.
2. **The renewal commit is a second durable write path that does not go through
   `validateCommit`.** It passes its own validator (a closed-client check). I proved
   by execution (R8) that it writes only `metadata.localEra` and leaves
   `collections` byte-identical — so it cannot introduce a bad sidecar — but no bite
   guards that *scope*. A future edit that widened the renewal block to touch
   collections would be caught by no test. A case asserting collections byte-identity
   across a renewal would close that, cheaply.
3. **`revision` is no longer `ops + 1`.** A renewal advances the revision without an
   operation. Any host or future test asserting that invariant will break. Correct
   behaviour, worth naming because round 1's evidence implied the old relation.

## RESIDUALS I CONFIRM (round 2)

All of the builder's, and I agree each is stated truthfully: the surviving cliff
(400 consecutive days unopened, with **no way out designed in C1** — the exit is
C2's port or a hosted onboarding, neither of which exists); renewal requires
writable storage, is reported via `leaseRenewalCode` when it fails, and is
untested against a 200-day run of failures; renewal trusts an untrusted device
clock in both directions (`LOCAL_LEASE_NOT_YET_VALID` exists for the backward
case); iOS Safari unproven (C3, and the runner prints its own `NOT RUN`); real
eviction unproven; real power loss unproven (`tx.abort()` is the honest analogue,
and `durability {requested, actual}` is the platform's claim); real elapsed time
unproven — days 199/201/401/402/500 are an injected clock, now stated as such;
hosted adoption and the outbox drain deferred; **P1 key custody BLOCKED**, also
written into `local-keys.mjs`'s header; C2 import and C3 phone proof out of scope;
`execute("workout", …)` reachable but with no workout case proven here; the
clean-init `value` carried verbatim and never interpreted; and the pair-erasure
matrix proven by my probes rather than by a suite case.

I add nothing. Round 1's two extra residuals (R+1 the cliff, R+2 the sidecar
brick) are both discharged — the first by self-renewal plus a named refusal, the
second by the carried-cache rule.

## NON-GOALS — STILL HONEST AND COMPLETE

No hosted half; no 24 h / 64-slot allowance (with the lease `range` correctly
called out as deliberately unbounded rather than a smuggled slot count); no K1; no
T2/engine edit, no host page, no C2 import, no C3 proof; "Saved" is not
authority-accepted; and a new one that needed saying — **self-renewal is not
authority**: the renewed lease is signed by the same local key sitting beside it in
the sealed generation, it grants nothing and asks no one. Correct, and important
to have written down before anyone reads a 400-day renewal as a permission.

---

# ROUND 1 — the original review (`85425fb`)

Verdict at the time: **ACCEPT WITH CONDITIONS**. Retained here so the PM can see
what was found and judge whether the fixes answer it. The full round-1 text is
also at `%TEMP%/C1-REVIEW-r1.md` (24,511 bytes).

## Round-1 verdict text

> The durability core is real and load-bearing. `openRepository`, `createBridge`,
> `createT2Stage` and `build-browser.mjs` are used unchanged; no existing file was
> edited; every executable number in C1-REPORT.md reproduced exactly on my runs,
> including all eight sha256s and both build hashes. The bite goes red and restores
> byte-identically under my own `Get-FileHash`. There is no fourth enrollment state.
> The device key is genuinely non-extractable and no era material reaches disk in
> plaintext or any returned surface. Three things are nevertheless wrong or
> undisclosed, and one of them is material.

## Round-1 defects (all now discharged — see Round 2)

- **D1 (MATERIAL) — the day-401 cliff, undisclosed, and the report misstated its own
  coverage.** `not_after` = enrolledAt + 400 days exactly. At day+401 and +500,
  `execute()` returned `{acknowledged:false, state:20, code:undefined}` — every save
  refused permanently, with no renewal path — while `status()` still read
  `ready/LOCAL_PRESENT` and `boot()` returned `ready:true`. `not_after` /
  `LOCAL_ERA_DAYS` appeared in **zero test files**, and no test advanced the clock at
  all, yet RESIDUALS claimed *"The 400-day lease window and 'a day's gap' are asserted
  with an injected clock."* The refusal also carried no code, unlike every other C1
  refusal. → **Fixed** by self-renewal, `LOCAL_LEASE_EXPIRED`, a
  `restore-required` status, dedicated copy, and 14 new assertions.
- **D2 (MEDIUM) — a corrupt derived cache permanently vetoed durable saves.** With a
  planted `{basis:{opCount:1,lastOpId:"op-dev-phone-A-1"}}` (object, no `value`),
  three successive projector-less factories each refused with `state 3 /
  DERIVED_SIDECAR_MALFORMED`; it never self-healed. Same for a basis ahead of the
  ops. And `boot()` reported that cache as `derived:null, derivedStale:false` — the
  host told a malformed cache was current. A cache vetoing the truth contradicts the
  module's own "OPS ARE TRUTH" header. → **Fixed** by judging only authored
  sidecars, plus `sidecarStale ⇐ sidecarFailure`.
- **D3 (MINOR) — two of the validator's three checks could not fire.** `stage()`
  built `context.namespace` / `sessionEpoch` from the same closure the validator
  compared them against, so `LOCAL_NAMESPACE_MISMATCH` and `LOCAL_SESSION_CHANGED`
  were dead code; the real namespace protection was `repository.mjs`'s
  (`restore-required / STORED_INTEGRITY_UNPROVEN`, state 18). → **Fixed** by
  deletion, and the remaining checks are now tabulated and unit-tested.

## Round-1 disagreements with the builder

The false RESIDUALS sentence (the only outright incorrect claim found); RESIDUALS
being incomplete rather than merely cautious; DESIGN NOTE 4's "fail closed" framing
being failing *shut* for a cache; DESIGN NOTE 7 overselling a check that proved
nothing; and the brief's base `ffabbca` vs the actual `9aeb2cc` going unexplained.
**All five are addressed in rev 2** — the base paragraph now opens the report.

## Round-1 findings that still stand as accepted evidence

These were proven in round 1 against `85425fb` and re-confirmed by the round-2
suite; they are what the ACCEPT rests on beyond the fixes.

- **Saved-only-after-complete.** An abort after the write reached IDB and after the
  T2 stage had acknowledged → `acknowledged:false, state:3, TRANSACTION_ABORTED`;
  the whole loaded record byte-identical before/after by my own comparison;
  revision unmoved; input retained; a reopened factory shows no ghost. Bite 1 proves
  the module depends on the bridge's completion gate.
- **First-run vs restore-required.** All three single-record erasures, all three
  *pair* erasures and all three pair *whole-database* deletions are
  `restore-required` with `enroll()` refused at state 18. Only all three signals
  absent reads `first-run`. **No fourth state exists** — `authorizeEnrollment`
  accepts nothing but a nonce minted at open when all three probes came back absent.
- **Local lease under unchanged `lease.cjs`.** `check().valid === true`,
  `lease_id === "local-era:<eraId>"`, `schema_version 2`, `range [1, 2**31−1]`;
  another key does not verify it; another `device_id` is refused. `rebuild/client/**`
  is untouched, as the diff proves.
- **Key custody.** The stored value is a `CryptoKey`, `AES-GCM`/256,
  `extractable:false`, usages `["encrypt","decrypt"]`; `exportKey("raw")` and
  `("jwk")` both throw `InvalidAccessError`. The raw generations record holds only
  `format, namespace, revision, iv, ciphertext` — `identityKey`, `authorityKey`, the
  signature and `eraId` are all absent from it in plaintext.
- **No smuggling.** A projector returning a forged `{basis, value}` has its whole
  object stored as `value`; the basis on disk is C1's own.
- **No secret logging.** The only `console.*` in `local/*.mjs` is `build.mjs`'s
  banner (re-grepped in round 2).

---

# FILES REVIEWED (sha256, computed by me in this worktree at `bcf9518`)

| sha256 | file | vs round 1 |
|---|---|---|
| `0a7feb8af70ea62cb688a6f1e42d25e7d055cc3280e50d05043e39649a10cbc2` | `rebuild/m3/w6/local/local-keys.mjs` | unchanged |
| `658300a2a080981bc48042fc54b155de8826d1b845102a0222a09347ebf61e46` | `rebuild/m3/w6/local/local-era.mjs` | changed (renewal) |
| `a6784b72eb64745cf7a69ece6814dad7259a17e9b2c65da215e0f864e22941da` | `rebuild/m3/w6/local/local-client.mjs` | changed (all three fixes) |
| `e415109c5891a7316c2dbc029575a89dccb90daade035a5388055cb6c5013c4a` | `rebuild/m3/w6/local/browser-entry.mjs` | changed (re-exports) |
| `666de31c2c9dd63d1da669465432f8e0a0d0a13283098a1da1edc0f94ce24424` | `rebuild/m3/w6/local/build.mjs` | unchanged |
| `5519bd5418e4d5edb8b2ea38a014b379d561089d5ab6b7e6efe8c78a4878dc15` | `rebuild/m3/w6/test/local-client.test.mjs` | changed (14 → 21 cases) |
| `b769ddb68d1343384bac13097b1c3087c163e1cd4cefae63a31d32eb52260a06` | `rebuild/m3/w6/test/local-bite.cjs` | changed (2 → 4 bites) |
| `0699c5e5723de7a50ab7ebe59537d2efcc33b76b483d55730308dfdd6d96699c` | `rebuild/m3/w6/test/local-browser.mjs` | changed (6 → 8 cases) |

Every hash matches C1-REPORT.md rev 2.

Build products (gitignored, reproduced by me): `w6.js` =
`b733c830…3143d` and `w6.js.meta.json` = `ffe65850…9b00c` (**unchanged vs base**);
`local.js` = `ab94431221197a3fcad86b9b985dc72b44892b646b7da7d2b0e28c3afcc4cb58`.

Also read, and confirmed unmodified by the diff: `rebuild/m3/w6/repository.mjs`,
`bridge.mjs`, `build-browser.mjs`, `README.md`, `rebuild/client/lease.cjs`,
`rebuild/client/index.cjs`, both `.gitignore` files,
`.github/workflows/rebuild.yml`, `rebuild/lanes/c/C1-BRIEF.md` and
`rebuild/lanes/c/C1-REPORT.md`.

**I committed nothing, modified no candidate file, and pushed nothing.**
`git status --porcelain` was empty after every command; this review file is the
only thing I wrote inside the worktree, and it is left uncommitted for the PM.
