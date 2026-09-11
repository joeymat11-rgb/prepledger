# C1 REVIEW — independent reviewer (author ≠ reviewer, told to disagree)

## FINAL VERDICT: **ACCEPT at `b587b2b`** — branch `rebuild/lane-c-c1`.

Three rounds plus a delta, one reviewer, everything re-executed each time.

| round | candidate | verdict |
|---|---|---|
| 1 | `85425fb` C1 | ACCEPT WITH CONDITIONS — 3 defects (1 material) |
| 2 | `bcf9518` C1 fixed | ACCEPT — all 4 conditions met, no new defect |
| 3 | `57e7212` C1b | ACCEPT — no defects; 4 non-blocking findings (F1–F4) |
| δ | `b587b2b` C1b fixed | **ACCEPT — F1–F4 closed, no defects, no new findings** |

C1b is the local era spoken as a durable-client scope, and it is the first thing
in this lane that runs the PM's real `composeWorkoutHost` over a real
installation with **zero synthetic collaborators**. I attacked its one contested
design decision — a local era issuing itself a W5 P-256 lease and pinning its own
public key — and I could not break it: the claim that forced it is true at the
line I cite, the private half never leaves the sealed generation, the pinned key
cannot admit anything inbound, and the W5 verifier structurally refuses to pin a
private JWK at all. Four findings were recorded; the builder applied all four in
`b587b2b`, and I re-verified each — including trying five different ways to break
the new allowlist pin, all of which it caught. See **DELTA `b587b2b`** at the end
of ROUND 3.

Reviewed in a detached worktree `work/lane-c/review-c1` on the owner's Windows PC,
Node v24.19.0. My probes live outside the repo in `C:/Users/joeym/rvlog/`. I
committed nothing, modified no candidate file, and pushed nothing.

---

# ROUND 3 — C1b, the host bindings (`57e7212`)

## SCOPE OF CHANGE — CLEAN

`git diff --name-status 2b40adc HEAD` — nine paths, and **nothing outside the
allowed set**:

```
M rebuild/lanes/c/C1-REPORT.md            A rebuild/m3/w6/local/host-bindings.mjs
M rebuild/m3/w6/local/build.mjs           A rebuild/m3/w6/local/host-browser-entry.mjs
M rebuild/m3/w6/local/local-client.mjs    A rebuild/m3/w6/test/local-host-browser.mjs
M rebuild/m3/w6/test/browser-check.mjs    A rebuild/m3/w6/test/local-host-journey.test.mjs
                                          A rebuild/m3/w6/test/static-modules.mjs
```

I filtered the changed-file list for anything not under `rebuild/m3/w6/local/`,
`rebuild/m3/w6/test/` or `C1-REPORT.md`: **none**. Explicitly checked and
**untouched**: `rebuild/m3/w6/host/**` (`git log 2b40adc..HEAD -- host/` is
empty), `rebuild/client/**`, `rebuild/engine/**`, `rebuild/m4/**`, every lockfile,
both `.gitignore` files, and `build-browser.mjs`.

Also untouched, which matters more than it sounds: **`local-client.test.mjs`,
`local-bite.cjs`, `local-era.mjs` and `local-keys.mjs`**. No C1 test had to
change to make C1b pass — see "the zero frontier" below.

### The `local-client.mjs` edit is genuinely additive

I read the diff line by line. It adds the `host-bindings.mjs` import, a
`LOCAL_SCOPE` symbol, a `booted` flag, an `internalScope()` closure, an `api`
indirection so the scope can reference the frozen object, and the `hostBindings()`
method. **Nothing is removed or weakened**: `Object.freeze` is retained, and the
only edits inside existing functions are `booted = false` at the top of `boot()`,
`booted = true` on the single ready path, and `booted = false` in `close()` — a
fail-closed flag. The C1 suite proves it: 21/21 unchanged, and the C1 bite still
turns all four guards red.

### The `browser-check.mjs` edit does not weaken an assertion

Diffed line by line. It changes exactly three things: the `http` import becomes
`startModuleServer`; the hand-rolled two-path server becomes
`startModuleServer({root, index})`; and `server.close(resolve)` becomes
`closeServer()`. **Every assertion in the body is untouched.** The root cause is
real and I verified it in the source rather than taking it on trust:
`repository.mjs` lines 1–2 import `./recovery-stage.mjs` and
`./import-custody.mjs`, while the old harness served `/repository.mjs` and 404'd
everything else — so the page's module graph could not resolve, and the operator
saw "cannot fetch repository.mjs" pointing at the wrong file. The fixed harness
now passes 6/6 on Edge (below).

## THE DESIGN DECISION, ATTACKED

The builder's case is: `keys` cannot be empty, because the durable public client
verifies `metadata.authorityLease` with the W5 verifier on every staged command;
so the local era issues a W5 P-256 lease to itself and pins its own public key,
and an observation guard refuses every inbound kind before verification. I treated
each clause as a hypothesis.

### (a) Is the `stageVerified` claim true? **Yes — cited.**

`rebuild/m3/w6/public-client.mjs:212` installs `stageVerified` as the client's
`stage`. Inside it:

```
237:  const lease = copy(command === "@lease" ? activeProof?.record : generation.metadata.authorityLease);
238:  if (!lease || !await verifier.verifyLease(lease) || lease.athlete_id !== athleteId ||
        lease.device_id !== deviceId || lease.schema_version !== schemaVersion)
          throw new StorageFailure("LEASE_PROOF_UNPROVEN", 18);
```

`stageVerified` is reached by every staged path (`:293, :329, :400, :544, :564`),
so an absent or unverifiable `authorityLease` is state 18 on every command. And
`rebuild/m3/w6/host/workout-host.mjs:99` is
`if (!Array.isArray(keys) || !keys.length) need('keys');` — an empty array is
refused by name. **Both halves of the premise hold.** A local era that wants the
PM's host genuinely cannot hand it "no keys". The decision was forced, not chosen.

### (b) Is the private half only ever inside the sealed generation? **Yes.**

Probe S3, on a real installation: the raw IndexedDB record's keys are exactly
`format, namespace, revision, iv, ciphertext`, and the private `d` does **not**
appear in it (`false`). It does not appear anywhere in the bindings object
(`false`). `keys[0].publicKey` has no `d`, and both the array and the entry are
frozen. `metadata.wireProofs` is `undefined` — no inbound proof was ever admitted.
Grep confirms no `console.*` in any `local/*.mjs` but `build.mjs`'s banner.

Better than "the code is careful": **the W5 verifier structurally refuses a
private key.** `createPublicVerifier` rejects any entry with `key.privateKey` or
`jwk.d !== undefined`. I tried to pin the private JWK (S2) and got
`refused: phone accepts P-256 verification JWKs only`. The private half cannot be
pinned even by mistake.

The trade — this key is `extractable: true` at mint, unlike C1's non-extractable
AES device key — is unavoidable (WebCrypto cannot export a non-extractable key,
and the JWK must be sealed so renewal can re-sign) and is **disclosed by the
builder** as C1b residual 6. I agree with both the trade and the disclosure.

### (c) Can the self-issued lease be mistaken for an authority lease later? **No.**

Probe S2 on a real installation:

- `lease_id` = `local-era:<eraId>` — the **same** id C1's HMAC era lease carries,
  so both write paths mark their operations identically and a hosted onboarding
  reads one marker, not two.
- `kid` = `local-era-<eraId>` — the pinned key names the era too.
- It **mirrors the era lease field for field** (`lease_id, athlete_id, device_id,
  range, not_before, not_after, schema_version` all canonically equal), and there
  are **no extra fields** beyond those seven plus `signature`.
- Another era's pinned key does **not** verify it (`false`).

So identification rests on two independent `local-era` prefixes, in the lease id
and in the kid, both derived from a 128-bit era id. There is no `issuer` field —
the W5 lease grammar has none to set — which is the one thing I would have liked
and cannot fault the builder for omitting. I judge the marking sufficient:
a hosted authority would have to deliberately mint `lease_id: "local-era:…"` to
collide, and its own kid would not match the pinned one.

### (d) Does the guard block every inbound kind? **Yes — I enumerated them myself.**

I did not take the list on trust. `public-client.mjs` routes exactly ten kinds
through `observationGuard.run`: five from `accept()`'s method map (`:526`
`{disposition, pull, snapshot, lease, time}`), two explicit exchanges (`:628`
`current-head-exchange`, `:669` `time-exchange`), and three **local** reads
(`:541` `local-recovery-basis`, `:559` `workout-history`, `:579`
`workout-edit-history`). The builder's `INBOUND_KINDS` is exactly the first seven.

Probe S4 ran all ten through the real guard:

```
disposition / pull / snapshot / lease / time / current-head-exchange / time-exchange
  -> state=12 code=LOCAL_ERA_NO_INBOUND accepted=false stored=false durable=false
     confirmed=false | inner ran=FALSE   (all seven)
local-recovery-basis / workout-history / workout-edit-history -> passed through
```

**`inner ran = false` on all seven** is the load-bearing part: the refusal happens
before the inner function, so the pinned key is never consulted on an inbound
record. The three that pass through are reads of this device's own generation, not
records from elsewhere — passing them is required for the host to read history at
all, and is not an inbound door.

### (e) Is the low-S normalisation correct? **Yes, and it is load-bearing.**

`rebuild/m3/w5/public-client.cjs:31` accepts only
`/^ES256\.([A-Za-z0-9_-]{1,64})\.([A-Za-z0-9_-]{86})$/` and `:37` rejects unless
`0 < r < n` and `0 < s <= n/2`. WebCrypto returns raw `r||s` with no normalisation,
so roughly half of all signatures would be rejected by the very verifier they are
for. The builder's `canonicalSignature` maps `s > n/2` to `n - s`, which is the
standard low-S form and **does not change what verifies** — ECDSA accepts `(r, s)`
and `(r, n-s)` identically, so normalising preserves validity rather than
weakening it. I checked the arithmetic too: for `s >= (n+1)/2`, `n - s <= (n-1)/2
= HALF`, so the output always satisfies the verifier's bound.

Probe S7, 24 independently minted eras: **decoded 24/24, verified 24/24, high-S
0**. Without normalisation about twelve would have failed `decodeSignature`
outright. The kid is 41 chars of `[a-z0-9-]`, inside the verifier's 64-char limit.

## THE SCOPE, THE BOOT FENCE AND RENEWAL-BEFORE-WRITE

Probe S1 — the shape:

- `hostBindings()` **before enroll**, **after enroll but before boot**, and
  **after `close()`** all refuse `LOCAL_HOST_BINDINGS_BOOT_REQUIRED / 18`.
- The returned scope has **exactly twelve enumerable members**, and they are
  exactly the twelve `composeWorkoutHost` names: `athleteId, crypto, deviceId,
  isCurrentSession, keys, namespace, observationEpoch, observationGuard,
  repository, sessionEpoch, stage, validateCommit`. No thirteenth.
- The object is frozen; the owning client and the install summary hang off
  symbols, so a spread into `composeWorkoutHost` carries nothing extra.

Probe S5 — renewal through the bindings path, and what the install commit costs:

```
day+201, boot() then hostBindings():
  ops 2->2  outbox 2->2  seq 2->2  ckpt {"ops":2,"outbox":2}   counts unchanged: TRUE
  sync frontier now = {"frontier":{"W":0,"authorityW":0}}      derived unchanged: TRUE
second hostBindings():  installed=false   revision 5 -> 5      unchanged: TRUE
day+1000 (era lapsed): status=restore-required/LOCAL_LEASE_EXPIRED, boot.ready=false,
  hostBindings -> refused; revision 5, ops 2 — nothing written by the refusal
```

Probe S6 — the **second chance** the builder claims. Going straight through
`localHostBindings(options)` at day 201 with no prior boot in that session moved
the era lease `2027-10-16 → 2028-05-04`, and the host lease's `not_after` tracked
it exactly. So renewal really does happen *before the scope exists*, therefore
before the public client's first write — which is the point, since the public
client's own bridge never calls `boot()`.

**The install commit changes no count.** That was the specific worry and the
answer is clean: ops, outbox, `device.seq` and the checkpoint are identical
across it, the derived sidecar is carried byte-identical, and a second
`hostBindings()` over an installed era writes nothing at all.

## THE ZERO FRONTIER — is `{W:0, authorityW:0}` the only honest value?

Yes, and I checked the mechanism rather than the argument.
`public-client.mjs:332` is
`if(snapshot.generation.collections.sync?.frontier?.authorityW!==history.frontier)
throw new StorageFailure('WORKOUT_EDIT_PREFIX_INCOMPLETE',18);`
With `sync` sealed empty, `authorityW` is `undefined`, `undefined !== 0` is true,
and **the athlete's ability to correct a recorded set is silently gone**. So the
frontier had to be written.

Is `0` an invention? No. `rebuild/client` boots an absent frontier as
`{W:0, authorityW:0}` already, so this writes down what T2 defaults to; and it
states the true thing — no authority has accepted anything here, because there is
no authority. Any other value would be a claim about an authority that does not
exist.

**Did any C1 test have to change? No.** `local-client.test.mjs` and
`local-bite.cjs` are byte-untouched on this branch, and both still pass (21/21,
four bites red). The reason is structural and I like it: the zero frontier is
written by `installHostAuthority`, which is only on the **bindings** path. C1's
own `enroll()` still seals `sync` empty, so C1's accepted behaviour is
bit-for-bit what I accepted in round 2, and the frontier appears only for an
installation that has asked for the host scope. That is the legitimate shape —
the new value is added where the new requirement is, not retrofitted into the
path that never had it.

## THE JOURNEY: IS IT REALLY THE PM's HOST, WITH NOTHING SYNTHETIC?

Yes. `local-host-journey.test.mjs` imports the **real**
`composeWorkoutHost` from `../host/workout-host.mjs` (:26), the real
`createDurablePublicClient` from `../public-client.mjs` (:23), and the real
engine runtime, capture, commands, adapter, history, source-projection,
athlete-state, workout-basis and resume-policy from `m4/workout/**`. It calls
`composeWorkoutHost({ createDurablePublicClient, …bindings })` (:77–79) over the
local-era scope and nothing else. **`host/` is untouched by this branch** — the
A0 suite (`journey.test.mjs` + `engine-equivalence.test.cjs`) still passes 22/22
against it.

I grepped the test for any injected key, lease, identity, stub or pass-through
guard. The only `synthetic` hits are (a) a header comment *describing* what A0's
own test injected, (b) engine-provenance labels in `PRODUCER`, and (c) case 9,
which asserts the opposite — that no fixture value reached the sealed metadata.

I verified case 9's claim independently and it is stronger than stated. Probe S8,
on a real installation after enroll + bindings + a save:

```
metadata keys: profile,namespace,enrolledAt,localEra,localHostAuthority,authorityLease
'synthetic' in metadata:    false
'synthetic' in collections: false
```

Case 9 scopes its claim to metadata; in fact nothing synthetic reaches the
collections either. The A0 fixture is used only for the clock and the athlete
setup shape.

## WHAT I EXECUTED (round 3)

| command | result |
|---|---|
| `git rev-parse HEAD` | `57e72124d6414d7a2f4911d22a0e4afeb80530ec` |
| `git diff --stat 2b40adc HEAD` | 9 files, 1474 insertions, 15 deletions — deletions are the 11 replaced harness lines in `browser-check.mjs` plus the 4 restructured lines in `local-client.mjs`/`build.mjs`; allowed set exactly |
| `NODE --test rebuild/m3/w6/test/*.test.mjs` | `ℹ tests 470 · pass 470 · fail 0`, **EXIT=0** (435 base + 21 C1 + 14 C1b) |
| `NODE --test …/test/local-host-journey.test.mjs` | `ℹ tests 14 · pass 14 · fail 0`, EXIT=0 |
| `NODE --test …/host/test/journey.test.mjs …/host/test/engine-equivalence.test.cjs` | `ℹ tests 22 · pass 22 · fail 0`, EXIT=0 — **A0's own suite still green** |
| `NODE --test …/test/local-client.test.mjs` | `ℹ tests 21 · pass 21 · fail 0`, EXIT=0 — C1 unregressed |
| `NODE …/test/local-bite.cjs` | EXIT=0, all **four** bites RED; my own `Get-FileHash` before = after = `A055C623…4EA9`, len 24534 → 24534 |
| `NODE …/build-browser.mjs` | EXIT=0; `w6.js` = `b733c830…3143d`, `w6.js.meta.json` = `ffe65850…9b00c` — **still byte-identical to base** |
| `NODE …/local/build.mjs` | EXIT=0; `local.js` = `7a43cdd11ee85166c6bc2ab720f2a460fc919f6f685a5e9a1a2b1b9ea14d1e30` (36 inputs), `host.js` = `9694e4a2b0ecc0d4e625db8a49382b58155159d69718819736009896b22afc48` (96 inputs) |
| `NODE …/test/browser-check.mjs` on Edge | **EXIT=0**, `6/6 real IndexedDB cases; Chromium 152.0.4191.66` — the harness fix works |
| `NODE …/test/local-browser.mjs` on Edge | **EXIT=0**, `8/8`, 36 pinned inputs |
| `NODE …/test/local-host-browser.mjs` on Edge | **EXIT=0**, `6/6 … composeWorkoutHost over the local era: enroll, self-issued P-256 lease, prepared workout, durable set, whole-context reopen, history and resume`, 96 pinned inputs |
| `git status --porcelain` after everything | **empty** |

My own probes S1–S8 (scope shape and boot fence; the W5 lease under the unchanged
verifier; secrets; all ten guard kinds; renewal through the bindings path;
`localHostBindings(options)`; 24-era low-S; synthetic-label scan) all ran to
`EXIT=0`.

### The `local.js` hash change is explained and correct

`local.js` moved `ab944312… → 7a43cdd1…` and its input count 34 → 36, because
`local-client.mjs` now imports `host-bindings.mjs`, which pulls in
`authority/canonical.cjs`. The report discloses both hashes and the reason.

I checked the thing that disclosure does not cover: **is an `authority/` import
legal in a phone bundle?** `build-browser.mjs` — unchanged — blocks it at two
places, and both carve out this one file:
`:41 /(?:^|[\\/])authority[\\/](?!canonical\.cjs$)/ → "Authority private
implementation cannot enter the phone bundle"`, and `:49
name !== "rebuild/authority/canonical.cjs" → "Unapproved authority code in
browser graph"`. So `canonical.cjs` is a pre-existing, explicitly approved
exception and the gate enforced it on this build rather than being relaxed for it.

## DEFECTS FOUND IN ROUND 3

**None.** Every C1b claim I tested reproduced, and nothing C1 proved regressed.

## FINDINGS (non-blocking — where I disagree, or would have done it differently)

### F1 — the observation guard is a DENYLIST, and nothing pins it to its source

`INBOUND_KINDS` is a hard-coded set of seven, and **any kind not in it passes
through**. Probe S4: `observationGuard.run("totally-unknown-kind", inner)` runs
the inner function.

Today that is safe, and I verified it exhaustively rather than assuming: the seven
are exactly the inbound kinds `public-client.mjs` can pass. But this is a
security-relevant guard whose correctness depends on a list in *another file*
staying in sync, with **no test pinning one to the other**. If W5 or the public
client later adds an eighth inbound kind, it will silently pass the guard and
reach verification against this device's self-pinned key, and every test here will
still be green. The safer shape is the inverse: allow the three known-local kinds
(`local-recovery-basis`, `workout-history`, `workout-edit-history`) and refuse
everything else, so a new kind fails closed.

*Remedy (executable):* invert the set, or add a case that imports the kind list
from `public-client.mjs` (or asserts against a committed snapshot of its
`accept()` method map plus the two exchange call sites) and fails when the two
diverge.

### F2 — the journey test probes 4 of the 7 inbound kinds

`local-host-journey.test.mjs:340` loops over
`['disposition', 'pull', 'snapshot', 'lease']`. It does not exercise `time`,
`current-head-exchange` or `time-exchange`. All seven do refuse — I proved it in
S4 — but three of them are refused only by code no test touches. Cheap to widen
to the full seven; it is one array literal.

### F3 — `hostBindings()` on a lapsed era reports the less specific code

The module header says "An expired era is refused here, not discovered on the
first save," and `installHostAuthority` does throw `LOCAL_LEASE_EXPIRED / 20`.
But on a **fresh open** of a lapsed installation (probe S5, day+1000) the refusal
is `LOCAL_HOST_BINDINGS_BOOT_REQUIRED / 18`, because `boot()` fails first and the
boot fence answers before the expiry check. The specific 20 is reachable only when
a client booted ready and the clock then advanced within that open session (which
is what the journey's case at `:416` exercises). Not misleading in practice —
`status()` and `boot()` both say `LOCAL_LEASE_EXPIRED`, and a host reads those —
but the header promises a code the common path does not produce.

### F4 — a comment in `static-modules.mjs` overstates its own allowlist

The header says the extension allowlist means the harness "can never hand a
browser a key file, a **.json ledger** or a dotfile". `.json` **is** in `TYPES`
and is served. The practical risk is nil — the root is the W6 directory, `ledger/`
is nowhere near it, and `node_modules` is a junction whose realpath resolves
outside `realBase` so the containment check 404s it — but the sentence claims a
protection the code does not implement. Test-harness only; fix the comment or drop
`.json`.

The containment itself I checked and approve of: it resolves symlinks *before*
comparing (`fs.realpathSync`, then `real === realBase || real.startsWith(realBase
+ sep)`), which a lexical check alone would not catch.

## REPORT HONESTY (C1b section)

I went looking for overclaims and found the opposite — the report volunteers
things I would otherwise have had to find:

- **Residual 1, the missing `subtle` seam, is real and self-reported.** I
  confirmed it by execution: `workout-host.mjs` contains no `subtle` at all, while
  `public-client.mjs:21` destructures it and `:26` hands it to
  `createPublicVerifier`, whose default is `globalThis.crypto && …subtle`. So the
  injected `crypto` is genuinely not the object doing the verifying. The builder
  found this, declared it, and routed it to the PM rather than editing a
  `host/`-owned file to fix it. That is the right call on both counts.
- **Residual 4 admits there is no C1b bite.** True — the four bites are C1's. I
  agree a C1b bite is a reasonable ask and agree it does not block; C1b's own
  invariants are carried by positive *and* negative assertions.
- **Residual 6 discloses the extractable P-256 private JWK** before a reviewer
  could raise it, with the correct reason (WebCrypto cannot export a
  non-extractable key, and the JWK must be sealed so renewal can re-sign).
- **Residual 3** correctly says the C1b bundle is larger (96 vs 36 inputs) and
  that nothing about iOS changes.
- **The two REQUESTS TO PM are legitimately scoped.** Both are `host/`-owned,
  neither was touched, and both are one-line asks stated precisely enough to act
  on. The report also notes "No `host/` file needed changing, so there is no
  REQUEST TO PM" for the harness work — which my diff confirms.
- **The base-commit reconciliation** (`ffabbca` in the brief vs `9aeb2cc` in the
  history), which was a round-1 disagreement of mine, now opens the report.
- **The `local.js` hash change is disclosed with both hashes and the cause.**

I found **no false coverage claim** in the C1b section.

## RESIDUALS I CONFIRM (round 3)

All seven of the builder's C1b residuals, plus everything still standing from C1:
the surviving 400-day-unopened cliff with no exit designed in C1b either; renewal
needing writable storage and trusting an untrusted device clock; iOS Safari
unproven (Edge 152 only — and all three browser runners print their own `NOT RUN`
line); real eviction and real power loss unproven; elapsed time injected, not
waited; P1 key custody still **BLOCKED**, now covering the host authority as well
as the device key; hosted adoption still deferred, with C1b only making the
`lease_id` marking consistent across both write paths; and
`WORKOUT_PREPARATION_INVALID` still masking the specific code (an A0 carry-over,
screen-tier).

I add only F1–F4 above, none of which is a residual so much as a place I would
have built it differently.

## CI (unchanged, and still worth repeating)

`.github/workflows/rebuild.yml` runs **no W6 test on either OS**, so C1b — like
C1 — has zero automated coverage. This review plus the builder's recorded Windows
runs are the entire gate. The report carries this in its own section.

## DELTA `b587b2b` — all four findings applied, re-verified

The builder applied F1–F4 as one commit. `git diff 57e7212 b587b2b` touches four
files (`host-bindings.mjs`, `local-host-journey.test.mjs`, `static-modules.mjs`,
`C1-REPORT.md`) and nothing outside `local/**`, `test/**` and the report;
`local-client.mjs`, `local-era.mjs` and `local-keys.mjs` are untouched, which the
bite confirms byte-wise (`a055c623…4EA9` before and after).

**F1 — fixed, and the pin is load-bearing.** The guard is now an allowlist:
`ALLOWED_KINDS = new Set(LOCAL_OBSERVATION_KINDS)` (the three purely-local kinds),
and `run()` refuses everything else by default. Probe D1: all 7 inbound kinds and
all 9 adversarial strings I tried — including `""`, `"  "`, `"toString"`,
`"constructor"`, `"__proto__"`, a case variant and a trailing-space variant — are
`blocked/12/LOCAL_ERA_NO_INBOUND`; exactly the 3 local kinds run. A `Set` means no
prototype-pollution bypass.

I then attacked the new pin itself (probe D2) by replicating its parsing and
feeding it five mutated copies of `public-client.mjs`. **All five trip it**:
an 8th kind in `accept()`'s method map (`declared != modelled`), an 8th kind as a
new literal call site (`call-site count 7 !== 6`), an 8th kind via a new *variable*
call site (same), an existing kind renamed (`declared != modelled`), and the map
reshaped so the pin cannot read it (`kind map not found` — it fails **closed**).
The unmutated source passes. So the answer to "what if an eighth kind is added" is:
the guard refuses it anyway, and the test goes red naming the drift.

**F2 — fixed.** Case 10 now probes all seven inbound kinds plus
`'a-kind-that-does-not-exist-yet'` and `''`, asserting `ran === false`, state 12
and `LOCAL_ERA_NO_INBOUND` for each, and asserts the three local kinds **do** run.
A new case 11 separately drives the caller-reachable entry points
(`acceptResponse` ×4, `exchangeServerTime`, `exchangeCurrentHead`) and names in a
comment that `time` has no reachable entry point rather than skipping it quietly.

**F3 — fixed, and the 18/20 split is exactly right.** `refuseLapsedEra()` reads
the era before the boot fence and throws 20 only when the generation is genuinely
readable; an unreadable or absent one is swallowed so the fence's 18 stands.
Probe D3: lapsed-but-readable → `LOCAL_LEASE_EXPIRED/20` from both `hostBindings()`
and `localHostBindings(options)`; first-run → 18; enrolled-but-not-booted with a
valid era → 18; device key erased → 18; generations record erased → 18; lapsed
then closed → 18. No case leaks 20 where the data is not readable, and none leaks
18 where it is.

**F4 — fixed.** The comment now states plainly that `.json` *is* served, that
containment (not the extension list) is the defence, and that `root` is the W6
directory. It also writes down the `node_modules`-junction behaviour I reported.

Re-executed at `b587b2b`: W6 suite **473/473** exit 0; `local-host-journey`
**17/17**; `local-client.test.mjs` **21/21** (C1 unregressed); A0 host suite
**22/22**; bite **4 RED + bytes restored** under my own `Get-FileHash`;
`build-browser` output **byte-identical** (`b733c830…3143d` / `ffe65850…9b00c`);
`local-host-browser` **6/6 on real Edge 152.0.4191.66**, exit 0. `local.js`
(`68825b6a…e49e`) and `host.js` (`6e13f09a…b323`) moved, as they must, since
`host-bindings.mjs` changed. `git status` clean apart from this review file.

Changed-file sha256 at `b587b2b`:
`89aaad7aae51555f627f8e2cf8d56b05e060382e426e7b232fa9c9a82fde490d` host-bindings.mjs,
`223310ba75f008adcd0e11ed14f8395cbe8a4ee729d820b20ee6be8306e8ce43` local-host-journey.test.mjs,
`4ea0b2cf3f43a1acf9b97836253ea034222983851d326ee390a9326fefd9a6f4` static-modules.mjs,
`1939c6bb5a6af5e6f79e87ba42b04096ccc705ae968da88cfa1daa917b07a651` C1-REPORT.md.

No defects. No new findings. F1–F4 are closed.

**FINAL VERDICT: ACCEPT at b587b2b**

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

---

# FILES REVIEWED — ROUND 3 (sha256, computed by me at `57e7212`)

**New in C1b**

| sha256 | file |
|---|---|
| `aabe4f26454386d35a74bc0c74b5264592654260fc5aa1991060c29d02ffc118` | `rebuild/m3/w6/local/host-bindings.mjs` |
| `476b6c0266ccacefa82d02d5f5f5dcdd042c11ca78af45b86f01eefca6aacecb` | `rebuild/m3/w6/local/host-browser-entry.mjs` |
| `25cea4c5e64b1a9b63039e307da12bb34a30270080979a162651bde19cb95806` | `rebuild/m3/w6/test/local-host-journey.test.mjs` |
| `ef97680d35978879d7e025040c1856506f5153a2de7c08dcf0eb2bbc89006e33` | `rebuild/m3/w6/test/local-host-browser.mjs` |
| `4505ba63dfb64b0bbf199b10c051ec64ffc895235534774883b01ae51c37c203` | `rebuild/m3/w6/test/static-modules.mjs` |

**Modified by C1b**

| sha256 | file | change |
|---|---|---|
| `a055c623ca0b1c95cc5cbad3386b8cb9cdfdc58e32f5ecd549d88762d3814ea9` | `rebuild/m3/w6/local/local-client.mjs` | additive: `hostBindings()`, `booted`, `LOCAL_SCOPE` |
| `e500644550d6dfc922d09e8ba73b27c6eb8ef2b29a54514fb5ce847b2839e66b` | `rebuild/m3/w6/local/build.mjs` | additive: `buildLocalHostBrowser()` |
| `eb1e5c8e19ced67bfca860dba7627a6950dd793cac2fe4ad48e5de130cd12b07` | `rebuild/m3/w6/test/browser-check.mjs` | harness server only; no assertion touched |
| `a82f0e2f74a77a198b364bc413399bed35cd34a515ef2feb80e30dc2c3e94185` | `rebuild/lanes/c/C1-REPORT.md` | C1b section |

**Unchanged from the C1 I accepted at `bcf9518` — byte-identical hashes, which is
the cleanest proof C1b did not disturb what was already reviewed:**

| sha256 | file |
|---|---|
| `658300a2a080981bc48042fc54b155de8826d1b845102a0222a09347ebf61e46` | `rebuild/m3/w6/local/local-era.mjs` |
| `0a7feb8af70ea62cb688a6f1e42d25e7d055cc3280e50d05043e39649a10cbc2` | `rebuild/m3/w6/local/local-keys.mjs` |
| `e415109c5891a7316c2dbc029575a89dccb90daade035a5388055cb6c5013c4a` | `rebuild/m3/w6/local/browser-entry.mjs` |
| `5519bd5418e4d5edb8b2ea38a014b379d561089d5ab6b7e6efe8c78a4878dc15` | `rebuild/m3/w6/test/local-client.test.mjs` |
| `b769ddb68d1343384bac13097b1c3087c163e1cd4cefae63a31d32eb52260a06` | `rebuild/m3/w6/test/local-bite.cjs` |
| `0699c5e5723de7a50ab7ebe59537d2efcc33b76b483d55730308dfdd6d96699c` | `rebuild/m3/w6/test/local-browser.mjs` |

Build products (gitignored, reproduced by me): `w6.js` = `b733c830…3143d` and
`w6.js.meta.json` = `ffe65850…9b00c` (**unchanged vs base, across all three
rounds**); `local.js` = `7a43cdd11ee85166c6bc2ab720f2a460fc919f6f685a5e9a1a2b1b9ea14d1e30`;
`host.js` = `9694e4a2b0ecc0d4e625db8a49382b58155159d69718819736009896b22afc48`.

Also read for round 3 and confirmed unmodified by the diff:
`rebuild/m3/w6/public-client.mjs`, `rebuild/m3/w6/host/workout-host.mjs`,
`rebuild/m3/w6/host/test/journey-fixture.cjs`, `rebuild/m3/w5/public-client.cjs`,
`rebuild/m3/w6/build-browser.mjs`, `rebuild/m3/w6/repository.mjs`,
`rebuild/m3/w6/bridge.mjs`, `.github/workflows/rebuild.yml`.

**I committed nothing, modified no candidate file, and pushed nothing.** My probes
live outside the repo at `C:/Users/joeym/rvlog/r3probe*.mjs`. `git status
--porcelain` was empty after every command in all three rounds; this review file
is the only thing I wrote inside the worktree.
