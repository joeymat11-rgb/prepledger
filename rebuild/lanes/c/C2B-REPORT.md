# LANE C — C2B REPORT — the phone side of Joe's port

Builder: cowork (Claude Fable 5.1). Branch `rebuild/lane-c-c2b`, worktree
`work/lane-c/c2b`, base `c90d207` (accepted C1+C1b merged with accepted C2, on
the integration tip `e489932`). Node v24.19.0 on Windows, PowerShell 5.1. Every
command and number below was executed there.

**One sentence.** C2 seals Joe's migrated ledger on the PC; C2b opens that seal
on the phone with WebCrypto alone, keeps the original bytes immutably through
the existing import custody, records the import in generation metadata, and
seeds the derived cache **only** where there are no operations to contradict.

**PRIVACY.** `rebuild/conform/private/` does not exist in this worktree
(`Test-Path` → False) and nothing under `ledger/` was opened by me, by the
module, or by any test. Every bundle in every case below was sealed by the real
`rebuild/m3/setup/port/port.cjs` over the PUBLIC frozen preimage
`rebuild/conform/fixtures/preimage-2026-08-15.json`, into a folder under
`%TEMP%` that each runner removes when it finishes.

**File ownership.** `git status --porcelain` at the end of the work showed
exactly five paths, all inside C2b's ownership:

```
 M rebuild/m3/w6/local/browser-entry.mjs
 M rebuild/m3/w6/local/local-client.mjs
?? rebuild/m3/w6/local/import-bundle.mjs
?? rebuild/m3/w6/test/local-import-browser.mjs
?? rebuild/m3/w6/test/local-import.test.mjs
```

Nothing under `rebuild/m3/w6/host/`, `rebuild/client/`, `rebuild/engine/`,
`rebuild/m4/`, `rebuild/m3/setup/port/` or any non-local W6 module was edited;
no lockfile was touched and no install of any kind was run.
`rebuild/m3/setup/port/**` is **reused unchanged** — `unseal.cjs` is the
contract, `port.cjs` is spawned as the sealer, neither is modified.

---

## WHAT WAS BUILT

| file | sha256 | lines | bytes |
|---|---|---|---|
| `rebuild/m3/w6/local/import-bundle.mjs` (new) | `62fd9f975a3516b5da4c653215011d1c7f3041dd4445a9a8bce84449752c1aea` | 485 | 29636 |
| `rebuild/m3/w6/test/local-import.test.mjs` (new) | `b57a8cd99714c7d3a91a6d627ad148bf88235c8cd70c8cc58d5ea6c1a3db060d` | 541 | 33461 |
| `rebuild/m3/w6/test/local-import-browser.mjs` (new) | `226f92c1458b6c514b28dc6a30043c039a8d598e565332a3d41260d45f12cab1` | 254 | 13762 |
| `rebuild/m3/w6/local/local-client.mjs` (edited, additive) | `3bf8c01d7e2b28fd0fad66ec0b6fd60663ab8b38caa9f222e0d36772c5970899` | 416 | 26390 |
| `rebuild/m3/w6/local/browser-entry.mjs` (edited, additive) | `6bca11b92a30f83cf7076250488a4d36460995e0fcf67b39fd23e9d4458cc739` | 19 | 1422 |

All five are LF-only (checked byte-wise: `CR=0`) and end with a newline, so
`.gitattributes` cannot rewrite them and the hashes above are the committed blob
bytes under `core.autocrlf=false`.

**The edit to `local-client.mjs` is 26 added lines and ONE changed line.**
`git diff --stat` is `32 insertions(+), 1 deletion(-)` across both edited files.
The single changed line is `boot()`'s sidecar report, which used to read

```js
derivedStale: sidecarStale(sidecar, basis), derivedCode: unusable ? unusable.code : null,
```

and now folds in `rebaseCode`. With no imports present `importRebaseCode()`
returns `null`, so that line is byte-for-byte equivalent in behaviour to the old
one — which is what the 473 pre-existing cases still passing unchanged
demonstrates. Everything else added is: one import, one `rebaseCode` binding,
two new `boot()` fields (`imports`, `importRebaseRequired`) and four new methods
on the frozen client (`importBundle`, `imports`, `importOriginal`,
`markImportRebased`). Every existing export and behaviour is intact.

`browser-entry.mjs` gains one re-export block, so the phone bundle carries the
importer. No existing export was removed or renamed.

---

## THE SEAL-COMPAT PROOF, EXACTLY

The claim is: **a bundle sealed by `port.cjs` opens under `crypto.subtle`, and
the two decoders agree on every input, including the ones they must refuse.**
It is proved three ways, and the bundle is produced by the real CLI at test
load — there is no fixture bundle checked in and no skip anywhere.

**1. The same envelope, two decoders, one deep-equal payload.** Case 1 of
`local-import.test.mjs` runs `Unseal.unseal()` (Node `createDecipheriv`) and
`unsealBundle()` (`crypto.subtle.decrypt`) over the SAME bytes with the SAME
passphrase and asserts `assert.deepEqual(a, b)` on the whole 154 KB payload.

**2. The five sealing constants are PINNED, not copied and hoped.** The same
case asserts `BUNDLE_PROFILE === Unseal.PROFILE`, `{...KDF}` deep-equals
`{...Unseal.KDF}`, `{...CIPHER}` deep-equals `{...Unseal.CIPHER}`,
`TAG_BYTES === Unseal.TAG_BYTES` and `BUNDLE_FAILURE === Unseal.FAILURE`, and
then that `aadBytes(sha)` here is byte-identical to `Unseal.aadBytes(sha)`. A
change on either side fails in this repository rather than on Joe's phone.

**3. The parameters, restated and each one exercised.** PBKDF2-SHA-256, 600 000
iterations, 16-byte salt; AES-GCM-256, 12-byte IV, 128-bit tag APPENDED to the
ciphertext (the WebCrypto convention, so the whole buffer goes to `decrypt`
unchanged); AAD = `JSON.stringify([profile, sourceSha256])`; passphrase
normalised NFKD before UTF-8. Every one of those is a refusal path in the tests:
a changed `kdf.iterations` (to 1), a changed `kdf.hash`, a 15-byte salt, a
13-byte IV, `tagBits: 96`, a two-element AAD cut to one, a non-hex AAD, a
non-base64 ciphertext and a ciphertext shorter than the tag — ten variants, all
`BUNDLE_AUTH_FAILED`.

**What fails, and with which code**

| input | code |
|---|---|
| wrong passphrase | `BUNDLE_AUTH_FAILED` |
| one flipped byte — first, middle, last of the ciphertext | `BUNDLE_AUTH_FAILED` |
| `aad[1]` edited to a different source hash (re-pointing the bundle) | `BUNDLE_AUTH_FAILED` |
| any of the ten structural envelope edits above | `BUNDLE_AUTH_FAILED` |
| not JSON / not a byte input / empty passphrase | `BUNDLE_AUTH_FAILED` |
| a payload whose own `source.sha256` disagrees with the AAD | `BUNDLE_AUTH_FAILED` |
| a WELL-SEALED bundle whose payload is the wrong shape | `BUNDLE_PAYLOAD_INVALID` + `field` |

The last row is a deliberate split from `unseal.cjs`, and it is the one place
the two decoders differ on purpose. `unseal.cjs` returns as soon as the tag
verifies and `payload.source.sha256` matches the AAD; the tag proves nobody
edited the rest. The PHONE needs more than "unedited": it needs "this bundle
says what this importer requires, in the shape it requires", because the wrong
place to discover a missing `engine.schemaV` is halfway through a durable
commit. So after the two checks `unseal.cjs` makes — in the same order, with the
same code — `unsealBundle` strictly validates `createdAt`, `engine.sha256`,
`engine.schemaV`, `source.bytes`, `migrated.sha256`, `migrated.state`,
`oracle.verdict`, `dataLoss` and (when present) `local`. Those failures are
`BUNDLE_PAYLOAD_INVALID` with the FIELD name attached — never a value. The test
reaches each one by re-sealing a deliberately broken payload with port.cjs's own
parameters, which is the only way a well-sealed bundle with a bad payload can
exist at all.

### `migrated.sha256` — how port.cjs computes it, and why re-hashing works

`port.cjs` takes it straight from `rebuild/m4/import/prepare.cjs:67-70`:

```js
const candidateBytes = Buffer.from(JSON.stringify(candidate), 'utf8');
candidate_sha256: hash(candidateBytes)
```

That is **PLAIN `JSON.stringify`, not a sorted or otherwise canonical form.**
Re-hashing `JSON.stringify(payload.migrated.state)` on the phone reproduces it
because the bytes that were hashed are themselves stringify output:
`JSON.stringify` emits integer-like keys first in ascending order and every
other key in insertion order, and `JSON.parse` rebuilds an object with exactly
that enumeration order, so `stringify(parse(s)) === s` for any `s` stringify
produced. That is an argument, so the test does not rest on it — case 2 asserts
the equality on the real 154 KB preimage state (`de3fa6fc…0795`), in Node, and
browser case 1 asserts it again inside Edge with `crypto.subtle.digest`.

`source.bytes` is checked the same way and more strongly: it is asserted equal
to the 157 544 bytes of the fixture ON DISK, not merely to its own hash.

---

## THE REBASE-REQUIRED DESIGN — the heart of this task

`rebuild/DECISIONS.md:100` says Joe starts **FRESH at S2** and the port lands
**UNDERNEATH** later. So the phone that imports may already hold local-era
operations, and the import must work on it. What it must not do is seed the
derived cache: the ops describe what Joe logged on the phone since the fresh
start, the imported state describes what his PC held, and writing one over the
other silently discards the difference.

**The rule, in code.**

| the generation has | the import does | result code |
|---|---|---|
| ZERO ops | `derived = {basis:{opCount:0,lastOpId:null}, value: migrated.state}` | `LOCAL_IMPORT_SEEDED` |
| ops already | **does not touch `collections.derived` at all**; records `rebaseRequired: true` on the entry | `LOCAL_IMPORT_REBASE_REQUIRED` |

In the second case `boot()` reports `derivedStale: true` and
`derivedCode: "IMPORT_REBASE_REQUIRED"`, which is C1's existing signal for "the
host must rebuild from ops". The imported base is available as bytes through
`importOriginal(name)`, and the host's projector computes engine state from
(imported base + the ops it already holds).

**C2b NEVER REPLAYS AN OPERATION.** It has no engine, it does not know what a
`weighIn` means, and a module that replayed ops would be a second engine beside
the real one — the rebase is the host/projector's job and nothing here does it.
The `ops` count is asserted unchanged across an import in both the Node case and
the browser case: no operation is replayed, invented or dropped.

### Why the flag is STICKY, and why the cheap version is wrong

The obvious cheap rule is "report the rebase while the sidecar is stale". It is
wrong, and wrong in the dangerous direction. A host whose projector kept the
cache fresh over the phone's own ops has a sidecar that is fresh **with respect
to those ops** and knows nothing about the imported history — so the cheap rule
would report "fine" over a cache missing Joe's entire PC ledger. The
fresh-start-then-port case is written with exactly such a projector, and it
asserts `derivedStale === false` immediately BEFORE the import to make the trap
visible rather than theoretical.

Nothing this module can read distinguishes a projection that folded the import
in from one that ignored it. So the flag is set by the import and cleared only
by `markImportRebased(name)` — an acknowledgement the host makes in its own
durable commit. A later save does **not** clear it; there is a case that proves
that. `LOCAL_IMPORT_UNKNOWN` for a name that was never imported,
`LOCAL_IMPORT_NOT_PENDING` for one already acknowledged.

---

## "ONE DURABLE COMMIT" — what that means here, precisely

The brief asks for ONE durable commit doing three things. Two of the three are
one `repository.commit`; the third cannot be, and saying so is more useful than
implying otherwise.

`import-custody.mjs` stages into its **own** IndexedDB transaction. It takes no
transaction parameter, and `rebuild/m3/w6/import-custody.mjs` is not a file C2b
owns. So the sequence is:

1. **unseal** — no storage touched at all;
2. **custody.stage** — the original source bytes, the migrated bytes, the local
   file if the port merged one, and the bundle's provenance as JSON, sealed
   under the device key and keyed `["earned/local-import-custody/v1", name]`,
   pinned to the current `{revision, token}`;
3. **`repository.commit`** — `metadata.imports[]` and, in the zero-ops case,
   `collections.derived`, in ONE transaction against the same basis.

**Step 3 is what makes an import real.** A crash between 2 and 3 leaves a named,
INACTIVE original and NO import — which is precisely the state
`import-custody.mjs` documents (`{staged: true, activation: 'pending'}`) and
exactly what the aborted-commit case asserts: revision unchanged,
`imports()` empty, `derived` un-seeded, and the stranded original still readable
by name. A retry then finds it and REUSES it byte for byte rather than failing
`IMPORT_CUSTODY_ID_CONFLICT` on a checkpoint that has since moved; that retry is
driven in the test by a real save landing in between.

**Saved semantics.** `imported: true` is returned only after the IDB transaction
COMPLETED — `repository.commit` resolves on `tx.oncomplete`, the same guard C1's
bridge depends on. An abort returns `imported: false` and changes nothing. Both
a wrong passphrase and a tampered bundle fail before the first `load()`, so "no
write" is a property of the sequence and not of a cleanup path; the test asserts
the raw store's revision directly, without going through the factory.

**Contention.** The import commits outside the bridge's queue (as `boot()`'s own
lease renewal already does), so `repository.commit`'s CAS is what protects it: a
`STALE_REVISION` is retryable and the loop retries up to 4 times, then reports
`LOCAL_IMPORT_CONTENDED`.

### Idempotency, and the one thing a name cannot be trusted for

The default name is `"port:" + sourceSha256.slice(0,16)`, derived from the
source, so a repeat is a no-op BY CONSTRUCTION — checked before staging, so a
second import writes nothing at all and reports
`{imported: false, code: "LOCAL_IMPORT_ALREADY_PRESENT", …}` with the recorded
basis. But **"same name" is not "same file"**: a caller may pass its own `name`.
So the recorded `sourceSha256` decides, and a different bundle under a taken
name is `LOCAL_IMPORT_NAME_TAKEN`, refused before staging, rather than the
reassuring ALREADY_PRESENT. That was found by a test I wrote expecting the
opposite result, and the module was changed rather than the assertion.

---

## COMMANDS + RESULTS (Windows, this worktree)

`NODE` is
`C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`
(v24.19.0). PowerShell 5.1 blocks `npm.ps1`, so node is called directly; output
was redirected to a file under `%TEMP%` and read back, because the console
mangles `✔`/`ℹ`. Exit codes were captured from `$LASTEXITCODE`, not inferred.
No install of any kind was run.

| command | before C2b | after C2b |
|---|---|---|
| `NODE --test rebuild/m3/w6/test/*.test.mjs` | `tests 473 · pass 473 · fail 0 · skipped 0` | **`tests 489 · pass 489 · fail 0 · skipped 0`**, exit 0 — the 473 unchanged plus 16 new |
| `NODE --test rebuild/m3/w6/test/local-import.test.mjs` | — | `tests 16 · pass 16 · fail 0 · skipped 0`, exit 0, ~4.6 s |
| `NODE rebuild/m3/w6/test/local-bite.cjs` | RESTORED PASS | **RESTORED PASS**, exit 0 — all four bites still RED (durability-gate, stage-basis, sidecar-self-heal, lease-self-renewal); source `3bf8c01d…0899` before and after (the hash moved from C1's `a055c623…14ea9` because `local-client.mjs` was edited) |
| `NODE rebuild/m3/w6/build-browser.mjs` | `w6.js` `b733c830…3143d`, meta `ffe65850…9b00c` | **byte-identical**: `b733c830…3143d` / `ffe65850…9b00c`, exit 0 |
| `NODE rebuild/m3/w6/local/build.mjs` | `36` / `96` pinned inputs | `38` / `97` pinned inputs, exit 0; `local.js` `a0efa4887ce5088ad6b64cfe67b23c226a31c7f1cb07b3235c54d08fa026e5a8`, `host.js` `fbcab6424bd7f42e2ca2058409ce6796762dd4efe13ce816f4f06650923796c7` — both moved because the entry now carries `import-bundle.mjs` (+ `strict-json.mjs`, already in the host bundle, hence +1 there and +2 here) |
| `NODE rebuild/m3/w6/test/local-import-browser.mjs` (Edge) | — | **`7/7` PASS**, exit 0; Edge 152.0.4191.66 |
| `NODE rebuild/m3/w6/test/local-browser.mjs` (Edge) | `8/8` | **`8/8` PASS**, exit 0 |
| `NODE rebuild/m3/w6/test/local-host-browser.mjs` (Edge) | `6/6` | **`6/6` PASS**, exit 0 |
| `NODE rebuild/m3/w6/test/browser-check.mjs` (Edge) | `6/6` | **`6/6` PASS**, exit 0 |
| `NODE rebuild/m3/setup/port/port.cjs --source rebuild/conform/fixtures/preimage-2026-08-15.json --out "%TEMP%\c2b-bundle"` | — | exit 0; `ORACLE PASS frozen 7/7 unfrozen 7/7 scope PUBLIC`; sealed bytes 491 504; source `b5eb62d4…a499`, migrated `de3fa6fc…0795`, schema 54→60 |

Edge launched on the first attempt in all four browser runners; nothing was
skipped, and `local-import-browser.mjs` prints its own `BLOCKED` (exit 2) rather
than passing silently if `playwright-core` or `W6_BROWSER_BIN` is missing.
`$env:W6_BROWSER_BIN` was
`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`.

### The 16 node cases, by what each proves

1. **Seal compat.** A bundle sealed by the real `port.cjs` this run opens under
   `crypto.subtle`, and its payload deep-equals `unseal.cjs`'s. The five sealing
   constants and the AAD bytes are pinned to `unseal.cjs`.
2. **The payload's own hashes, recomputed.** `source.bytes` decode to the 157 544
   bytes of the fixture ON DISK; `migrated.sha256` is reproduced by plain
   `JSON.stringify` over the parsed 154 KB state; the 490 KB ciphertext
   round-trips through `atob`/`btoa`.
3. **Wrong passphrase, three flipped bytes, a re-pointed AAD** — all
   `BUNDLE_AUTH_FAILED`.
4. **Ten structural envelope edits**, plus non-JSON, a non-byte input and an
   empty passphrase — all `BUNDLE_AUTH_FAILED`.
5. **Eight broken payloads in well-sealed bundles** — `BUNDLE_PAYLOAD_INVALID`
   with the right `field` each time; plus the one payload disagreement that is
   correctly an AUTH failure, so the two decoders do not diverge there.
6. **Import on a fresh enrolled phone.** One durable revision; `derived` is the
   migrated state; `derivedStale false`, `derivedCode null`; the whole
   `imports[0]` entry asserted field by field; then a WHOLE NEW FACTORY over the
   same IndexedDB reads it all back, and `importOriginal` returns bytes
   deep-equal to the fixture with the provenance decrypting to the bundle's own
   engine sha, schemaV, oracle verdict and source hash.
7. **A second import is a named no-op** — revision unchanged, one entry, across
   a new factory too.
8. **A wrong passphrase and a tampered bundle each write NOTHING** — revision
   unchanged at the raw store, `imports()` empty, no custody original left
   behind, and a good bundle still imports afterwards.
9. **FRESH START THEN PORT.** Two weigh-ins under a projector that keeps the
   cache genuinely fresh, then the import: `derived.value` untouched and
   asserted NOT equal to the migrated state, `derivedStale true`,
   `derivedCode IMPORT_REBASE_REQUIRED`, `ops` still 2, the entry's
   `opsBasisAtImport` `{opCount: 2, lastOpId: "op-dev-phone-A-2"}`.
10. **Saving still works after an import**, and the sidecar follows C1's rules
    unchanged: the seeded value is CARRIED (no projector), its basis falls behind
    the ops, so `derivedStale true` / `derivedCode null` — older, not damaged —
    and the import consumed no device sequence (`op-dev-phone-A-1`). Three more
    saves in a row all succeed and the entry rides every commit.
11. **`markImportRebased` is the only thing that clears the flag**, a later save
    does not, an unknown name is refused, and a second acknowledgement is
    `LOCAL_IMPORT_NOT_PENDING`.
12. **An aborted commit imports NOTHING** (injected quota fault at the IDB API),
    and the inactive original it leaves is reused byte for byte on a retry whose
    checkpoint has since moved.
13. **Refused before `boot()`** (both first-run and enrolled-but-not-booted),
    after `close()`, and under an unusable name — the revision never moves.
14. **A LAPSED era refuses an import `LOCAL_LEASE_EXPIRED` / 20, not 18.** The
    data is readable; 18 would say "stored truth needs recovery" about a
    generation that is fine. Same correction C1b review F3 made for
    `hostBindings()`. Reads still work, nothing is written.
15. **A different bundle under a taken name** is `LOCAL_IMPORT_NAME_TAKEN`, the
    first original survives, and the other bundle imports cleanly under its own
    derived name.
16. **The module-level entry points** accept a client and delegate to the same
    code path; the pure helpers judge a generation shape.

### The 7 browser cases (`local-import-browser.mjs`, real Edge, fresh profile)

Verbatim:

```
W6 LOCAL-IMPORT-BROWSER PASS — 7/7 real IndexedDB + real WebCrypto cases;
152.0.4191.66; port.cjs seal opened by crypto.subtle in 69 ms (PBKDF2 600000),
enroll + import + seeded cache, wrong passphrase and repeat write nothing,
WHOLE-CONTEXT REOPEN with a byte-identical custody original, save after import,
fresh-start-then-port leaves derived alone; 38 pinned bundle inputs
W6 iPhone / iOS Safari acceptance NOT RUN — Chromium-family evidence only (C3)
```

Real Microsoft Edge 152.0.4191.66, headless, launched through pinned
`playwright-core` as a persistent context on a fresh profile directory, with all
non-origin requests aborted. The bundle is the one `local/build.mjs` produces,
served over 127.0.0.1 and imported as a module; the sealed port bundle is fetched
as bytes from the same origin rather than pasted into a JS literal.

1. **600 000 PBKDF2 rounds and AES-GCM with an appended tag in REAL
   `crypto.subtle`** — this is the case Node cannot stand in for, because Node's
   webcrypto is the same spec and a different implementation. 69 ms. The
   payload's source hash and migrated hash are recomputed IN THE PAGE and match.
2. Enroll and boot a genuinely first-run profile, then import: `imported: true`,
   `LOCAL_IMPORT_SEEDED`, `durableRevision 2`.
3. The derived cache holds Joe's real history in real IndexedDB — 56 top-level
   keys, `v` equal to the bundle's `engine.schemaV`, `derivedStale false`.
4. A wrong passphrase writes nothing (revision still 2) and a repeat is
   `LOCAL_IMPORT_ALREADY_PRESENT`.
5. **The whole browser context goes away** — process, page, every in-memory
   handle — and a NEW one opens on the same profile directory: the import, the
   seeded cache and the custody original are all still there, and the original's
   bytes hash IN THE PAGE to the file Joe's PC read.
6. A durable save in the reopened context, `op-dev-phone-A-1` at revision 3.
7. **Fresh-start-then-port in a real browser**, on a second database: two
   weigh-ins first, then the import underneath them — `derived` still the
   phone's own cache, `derivedStale true`, `derivedCode IMPORT_REBASE_REQUIRED`,
   both reads intact.

---

## DESIGN NOTES — every decision taken without asking, and why

1. **`markImportRebased(name)` is not in the brief.** Without it
   `IMPORT_REBASE_REQUIRED` would be permanent and every boot would report it
   forever, which trains a host to ignore it. Inferring the clear is unsound
   (see the sticky-flag reasoning above), so the host acknowledges it. Small,
   owned, and it closes the loop the brief opened.
2. **`BUNDLE_PAYLOAD_INVALID` is a second code, deliberately.**
   `unseal.cjs`'s single-code rule exists so a decoder does not tell an attacker
   which half to keep working on. That reasoning covers the tag and the key; it
   does not cover "the passphrase was right, the bytes are intact, and this
   encoder does not speak the profile". The field name is structure, never a
   value, and `dataLoss`/`census` are carried into custody but never printed.
3. **The result's `state` is `null` on success and on ALREADY_PRESENT.**
   Borrowing a failure state to describe something already durable would be a
   lie in a field hosts branch on.
4. **`atob`/`btoa`, chunked, instead of `node:buffer`.** The module has to run in
   the phone bundle, and `build-browser.mjs`'s Node-import allowlist is not a
   file C2b owns. `String.fromCharCode(...)` overflows the argument stack around
   100k characters, so the encode walks in 32 KB chunks. The round-trip check
   `unseal.cjs` performs (because `Buffer.from` is lenient) is kept even though
   `atob` is stricter — it is what makes both decoders refuse the same inputs.
5. **Custody stages BEFORE the generation commit, not after.** After would mean
   a window where metadata claims an import whose original does not exist. Before
   means a window where an inactive original exists with no import — which is the
   state `import-custody.mjs` already names, and which a retry absorbs.
6. **`keepOriginal` reuses an existing record instead of re-staging.** Without
   it, a retry after a `STALE_REVISION` would hand custody a moved checkpoint and
   get `IMPORT_CUSTODY_ID_CONFLICT`, stranding the import permanently. The bytes
   are compared before any reuse.
7. **Two imports onto a zero-op generation are LAST-WINS for the cache.** Not a
   workflow — there is one port — but it is what the code does, it loses nothing
   (both originals stay in custody under their own names, both entries stay in
   `metadata.imports`), and the test asserts it rather than leaving it to be
   discovered.
8. **The import is fenced behind `boot()`,** exactly as `hostBindings()` is, and
   for the same reason: `boot()` is where the era's lease self-renewal runs, and
   a durable write must never be the thing that discovers a lapsed era. A
   lapsed era is refused `LOCAL_LEASE_EXPIRED` / 20 before the boot fence speaks.
9. **`metadata.imports` is a plain array on the sealed generation.** No schema
   version is bumped: nothing in an older local-era generation can be *restated*
   as an import, so a patch could only write `[]`, and absent already reads as
   "no import" at every call site (`importEntries` returns `[]`). That is the
   same reasoning `pace` (v3.99.10) was filed under.
10. **No fixture bundle is checked in.** The tests spawn the real `port.cjs`
    every run (~2 s of the 4.6 s), so the seal-compat proof is against the code
    that actually ships rather than against a file that could drift from it.

---

## RESIDUALS

1. **NO PHONE. Nothing here has run on Joe's iPhone.** Every case ran in Node's
   fake-indexeddb or in Chromium (Edge 152), and Joe's phone is not a Chromium
   browser. Safari has its own IndexedDB eviction and its own transaction
   behaviour, and — specifically relevant here — its own `crypto.subtle`
   performance envelope: 600 000 PBKDF2 rounds took 69 ms in Edge on a desktop
   and will be materially slower on an iPhone. That is C3's, and the runner
   prints its own `NOT RUN` line rather than implying coverage.
2. **NO REAL RUN. The private blob has not been ported and must not be until Joe
   asks in his own words** — C2's README states that rule and it is unchanged.
   Every bundle in this report came from the public frozen preimage, so the full
   `10/10` oracle scope (C2 residual 1) is still unexecuted by anyone.
3. **The passphrase UI is the HOST's.** C2b takes a passphrase string and a byte
   array. Nothing here asks for the words, hides them, retries, rate-limits, or
   tells Joe which of six words he mistyped — and a wrong passphrase is
   deliberately indistinguishable from a corrupt file, so the host's copy cannot
   say which it was. There is no file picker either. That surface does not exist
   yet in any lane.
4. **NO REPLAY, by design and therefore a real gap in the product.** After a
   rebase-required import the phone holds the imported base and the ops and
   *nothing folds them together* until a host projector does it. No projector in
   this repository currently does. So the fresh-start-then-port path is CORRECT
   and INCOMPLETE: the import is durable, named and reported, and the engine
   state Joe sees does not yet include his PC history. Whoever owns the
   projector owns that step.
5. **`markImportRebased` is the host's word and is not verified.** The
   acknowledgement clears the flag whether or not the host really rebased.
   Nothing in the sidecar could tell the difference; a check that could not fail
   would be worse than an honest acknowledgement.
6. **The bundle is held in memory whole.** 491 KB sealed, 154 KB of state, 157 KB
   of source — decoded, hashed and cloned several times inside one import. Fine
   on a desktop and untested under iOS memory pressure. C2 residual 4 (no
   compression, deferred to C2b) is NOT taken: adding `zlib` would change the
   format and the reference decoder, and the size is not a problem worth a
   format change before the phone has ever seen one.
7. **Custody re-parses the source bytes with the strict W6 parser.** A bundle
   whose source carries a duplicate key or a BOM would be refused at
   `IMPORT_CUSTODY_JSON_INVALID` rather than at unseal. In practice `port.cjs`
   already refuses those at PREPARE, so any bundle that exists has passed the
   same parser once — but the phone-side failure mode is untested because no such
   bundle can be produced by the CLI.
8. **No C2b bite.** C1's bite still proves C1's four invariants on the edited
   `local-client.mjs` (all four still RED, RESTORED PASS). C2b's own invariants —
   the seal compatibility, the no-write-on-refusal sequence, the untouched
   `derived.value` — are proved by direct positive AND negative assertions rather
   than by a mutate-and-restore runner. A C2b bite is a reasonable ask and is not
   done.
9. **CI still runs no W6 test on either OS** (C1's finding, unchanged). Nothing
   in any workflow executes `rebuild/m3/w6/test/*`, so a future regression under
   `rebuild/m3/w6/local/**` would be caught by no workflow. The independent
   reviewer's run plus the Windows runs recorded here are the entire gate.

## STATUS

C2b is built. Suite 489/489 with 0 skipped, four browser runners green on real
Edge, the C1 bite still RED-and-restored, `w6.js` byte-identical. Nothing was
pushed.
