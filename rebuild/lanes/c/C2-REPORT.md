# LANE C — C2 REPORT — Joe's port script for the PC

Builder: cowork (Claude Fable 5.1). Branch `rebuild/lane-c-c2`, worktree
`work/lane-c/c2`, base `2553300`. Node 24.19.0 on Windows (PowerShell 5.1).
Owner files only: `rebuild/m3/setup/port/**` (new) + this file. Nothing under
`rebuild/engine/`, `rebuild/m4/import/`, `rebuild/conform/` or `rebuild/client/`
was edited — `git status` at the end of the build showed exactly one untracked
path, `rebuild/m3/setup/port/`.

**The private blob was never read.** `rebuild/conform/private/` does not exist in
this worktree (`Test-Path` → False) and no path under
`C:/Users/joeym/Documents/prepledger-dev/ledger` or `ledger/state.json` on main
was opened by me, by the script, or by any test. Every run below used the public
frozen preimage and the shipped synthetic fixture.

---

## WHAT WAS BUILT

| file | sha256 | bytes |
|---|---|---|
| `rebuild/m3/setup/port/port.cjs` | `4e1f24859dd1ab073febde9a2833409e69a0cb1eda767fa28db42571a9fccf91` | 19878 |
| `rebuild/m3/setup/port/unseal.cjs` | `515822a128031f03dde27d96c161d5528dd444673e00fa2e5c9a1d40719abf02` | 4883 |
| `rebuild/m3/setup/port/wordlist.cjs` | `e5ef45762e19d96e1dd2c043fec4ed1405e5bdabf3080169081c03aacd32daa7` | 14466 |
| `rebuild/m3/setup/port/README.md` | `d7b9ead51c3c43f6a4cbb609410571e3d99984c5e698e234c5a0074ee73ea4e6` | 5344 |
| `rebuild/m3/setup/port/test/port.test.cjs` | `cd0c5e8e3c08f08acf11d94d8d7a3e79c5b1a88ca70dcdc12b997a5ef73dc535` | 12029 |
| `rebuild/m3/setup/port/test/seal.test.cjs` | `c0d4d3e9dc5e533dc9461717a2939e3ec0160d600b242f21a8f3f7625d9af695` | 4517 |

All six are LF-only and end with a newline (verified byte-wise), so the hashes
above are the committed blob bytes under `core.autocrlf=false`.

**Reused, unchanged, never re-implemented**

- `rebuild/m4/import/prepare.cjs` — `createImportPreparation({engine, parseStrictJson})`,
  wired exactly as `rebuild/m4/import/test/prepare.test.cjs:13-20` wires it: an
  engine table plus the W6 parser. It does the byte snapshot, the migrate, the
  merge when `--local` is given, the strict re-parse and `dataLossGuard` against
  every preimage. `port.cjs` adds nothing to that sequence.
- `rebuild/m3/w6/strict-json.mjs` — `parseStrictJson`, loaded with a dynamic
  `import()` because the CLI is CommonJS and that module is ESM.
- `rebuild/engine/oracle-shim.cjs` — the engine. It is the same table the gate
  certifies, and it pins the clock from `MEASURED_TEST_NOW`/`TZ`, so the engine
  that migrates and the engine that is gated are one object. `engine.SCHEMA_V`,
  `migrate`, `mergeState`, `dataLossGuard` and `recordCounts` all come off it.
- `rebuild/conform/oracle/port-oracle.cjs check` — the frozen gate, run as a
  child process, twice, unmodified.

---

## THE ORACLE GATE — WHAT WAS REUSED AND WHERE IT WAS FOUND

Found in **`rebuild/m2/BRIEF-5.md` §2** ("The gate for module 5 … The real FULL
port-oracle check is now mandatory. No partial mode exists."), reproduced
verbatim in **`rebuild/m2/REPORT-M2-5-ASTRA.md`:124-128**, scored in
**`rebuild/m2/SCORECARD-M2-5.md` row 1** ("all TEN required law IDs GREEN on all
THREE blobs … in BOTH Date modes"), and accepted in **`rebuild/DECISIONS.md`
2026-09-05** for module 5 and module 6 ("port-oracle 10/10 × 2 modes").

The exact command, from the repository root, in two fresh Node processes:

```
MEASURED_TEST_NOW=2026-09-03  TZ=America/New_York
node --import ./tools/_fixed-now.mjs rebuild/conform/oracle/port-oracle.cjs check <engine> <label>-frozen
node                                  rebuild/conform/oracle/port-oracle.cjs check <engine> <label>-unfrozen
```

Those clock pins are not a choice: `oracle/manifest.json` records
`clock: 2026-09-03`, `tz: America/New_York`, `censusVersion: 3`, and the gate's
first law fails closed if the run disagrees. `port.cjs` sets both, and refuses to
start if the environment already holds a different value.

**What "10/10" counts, exactly.** `port-oracle.cjs` builds one manifest law plus
three laws per blob, over the blobs that exist on disk: `fixtures/preimage-2026-08-15.json`,
`fixtures/synthetic-pending-debut.json` and `private/live.json` — `1 + 3×3 = 10`.
The private blob is absent from any public checkout, so the identical command
there builds `1 + 3×2 = 7`. That is the whole difference between the two scopes.

**So the script runs the public part here and the full gate on the real run, and
says which it got.** `port.cjs` prints `scope PUBLIC (2 public fixtures; …)` or
`scope FULL (3 blobs …)`, requires every law GREEN in both Date modes, and
records the scope, the law count and the per-mode tallies inside the sealed
bundle. On Joe's PC, with `rebuild/conform/private/live.json` present, the same
line reports `frozen 10/10  unfrozen 10/10  scope FULL`. No code path differs.

**What the gate proves, stated plainly.** `check` has no parameter for a state:
it censuses the blobs the manifest pins by hash and compares them to the frozen
golden. It therefore certifies **the engine that performed this port**, not the
individual migrated object. To close what it can of that gap the script also
reports whether the `--source` hash is itself one of the manifest's pinned blobs
(`source pinned by the oracle manifest: preimage-2026-08-15.main` on the public
run; on the real run it will say `no` unless the live blob is byte-identical to
the one the golden was cut from, and that honest `no` is recorded in the bundle).

---

## COMMANDS + RESULTS (Windows, this worktree)

Node: `C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe` (v24.19.0).

### 1. The gate on its own, to establish the baseline

```
$env:MEASURED_TEST_NOW='2026-09-03'; $env:TZ='America/New_York'
node --import ./tools/_fixed-now.mjs rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs c2-probe-frozen
```

→ `7 GREEN · 0 RED-as-specified · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR`, exit 0.
Law ids: the manifest law, plus manifest-pins / counts-law / census-identical for
each of `preimage-2026-08-15` and `synthetic-pending-debut`.

### 2. The port itself, on the public preimage

```
node rebuild/m3/setup/port/port.cjs --source rebuild/conform/fixtures/preimage-2026-08-15.json --out "$env:TEMP/c2out"
```

Exit 0. Stdout, in full (paths shortened here only for width):

```
1. SOURCE     PASS  ...\rebuild\conform\fixtures\preimage-2026-08-15.json  sha256=b5eb62d459d6e58bfb26bfa65f772db193998825166d7538403dad41eddda499  bytes=157544
2. PREPARE    PASS  schema 54->60  migrated sha256=de3fa6fcbd1dfa9f16022497ecdaeb3477d9375cbcd9c5ea93709db9c05a0795  bytes=156087
   counts  adjustments 34->34  corrections 0->9  dailyLogs 64->64  feed 267->267  learnedAnchors 0->0  learnedTdee 13->13  nights 59->59  photos 0->0  reads 61->61  sessionLog 13->13  waist 0->0
   dataLossGuard  safe=true  lost=0  (prepare re-ran it against every preimage)
3. ORACLE     PASS  frozen 7/7  unfrozen 7/7  scope PUBLIC (2 public fixtures; rebuild/conform/private/live.json is absent)
   gate  node [--import ./tools/_fixed-now.mjs] rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs <label>  (cwd ...\work\lane-c\c2, MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York)
   engine  ...\rebuild\engine\oracle-shim.cjs  sha256=dd653bc170d3c5ae3b8cfa5c2ca8166b1de385a0903e056eab7ea062c125052d  tree(18 modules)=8a91ccb2cdb7d43e728f50e00bb4af942842648b07b33a705ee7dae5e21084e1
   source pinned by the oracle manifest: preimage-2026-08-15.main
4. SEAL       PASS  PBKDF2-SHA-256 600000 iterations -> AES-GCM-256  6 words out of 2048  sealed bytes=490692
5. WRITE      PASS  ...\c2out\earned-port-2026-09-10.json  sha256=695424ebe241517eb8444c1b89daeebd2cf562ff1eeb19b1f4b8c6b5cdf87c43
   passphrase file  ...\c2out\earned-port-2026-09-10-PASSPHRASE.txt  (this OS does not enforce file modes - it is on your PC and only your PC)
```

followed by the one-screen WHAT TO DO NEXT block (move the bundle, keep the
words here, import, then delete both). Every token above is a path, a count, a
hash or a verdict. `corrections 0->9` is the migration filing the known
corrections; `dataLossGuard safe=true lost=0` is the guard on the same states.

### 3. The suite

```
node --test rebuild/m3/setup/port/test/seal.test.cjs rebuild/m3/setup/port/test/port.test.cjs
```

→ **tests 12 · pass 12 · fail 0 · cancelled 0 · skipped 0 · todo 0**, exit 0
(duration 1.82 s; each port case spawns the CLI, which spawns the gate twice).

| case | what it proves |
|---|---|
| public preimage ports end to end | exit 0; one bundle; unseal with the generated passphrase; `migrated.state` deep-equals an independently computed `prepare()` output; `source.bytes` decodes to the exact input bytes; `oracle.verdict` PASS with clock/tz pinned and every mode `green === total` |
| stdout carries paths, counts, hashes and verdicts | the privacy case — see below |
| `--local` merges the pair, Windows paths with spaces and backslashes | merged state deep-equals `prepare(source, {localBytes})`; both the source reads and the local-only `2029-12-02` read are present; `local.bytes` round-trips; counts line printed; `--out` is a folder with spaces, every path passed with `\` separators |
| a gate that is not GREEN stops the port | exit 2, `ORACLE FAIL`, `NO BUNDLE WRITTEN`, and the output folder is empty — not even a passphrase file |
| the CLI refuses to write inside the repository / unknown argument / missing source | exit 1 each, nothing created |
| a corrupted source is refused before anything is written | truncated JSON, a duplicate key (the W6 parser's catch, not `JSON.parse`'s), a future schema and a non-object each exit 2 with a fixed `IMPORT_SOURCE_*` code and no output folder |
| the sealed bundle opens with its own passphrase | round trip, from bytes and from a string |
| a different passphrase is refused | `BUNDLE_AUTH_FAILED` |
| one flipped byte anywhere in the ciphertext | first byte, middle byte, last byte — `BUNDLE_AUTH_FAILED` each |
| re-pointing the bundle at another source (the AAD) | `BUNDLE_AUTH_FAILED` |
| a changed profile, salt, iv, iteration count, tag length, short AAD or non-base64 ciphertext | `BUNDLE_AUTH_FAILED` for all seven |
| the word list | 2048 entries, all distinct, all `^[a-z]{2,8}$`; a passphrase is 6 of them; 64 draws give 64 distinct phrases |

The gate-failure case is worth its own sentence: the bitten engine migrates
perfectly (`dataLossGuard` is happy, no record moves) and only *reads* the ledger
differently — `targetsFor` returns the first target one rung high. `prepare()`
cannot see that. The port-oracle census does, on both public blobs, in both Date
modes, and the port stops. That is the gate earning its place.

---

## PRIVACY PROOF

1. **Nothing private was opened.** `rebuild/conform/private/` is absent here; the
   only inputs any command touched are `rebuild/conform/fixtures/preimage-2026-08-15.json`,
   `rebuild/conform/fixtures/synthetic-pending-debut.json`, a synthetic copy of
   the latter with one extra invented read, and four deliberately corrupted
   copies — all under the OS temp folder.
2. **The gate's stdout is captured and never echoed.** It is the one stream in
   the script that could carry a value (for public fixtures `port-oracle.cjs`
   prints counts and lift totals; for the private blob it substitutes a
   constant in code). `runGateMode` reduces it to `{verdict, law id}` and throws
   the rest away. On failure the script prints law **ids** only, never details.
3. **The executed privacy test.** It re-reads the fixture, harvests its own
   values at run time (`trend`, `phase`, `dexaPred`, `model.lean`,
   `model.anchorISO`, `model.src`, `rate.redline`, every maintenance label, every
   reading's weight, every exercise name — 4+ characters, deduped), subtracts
   anything that also occurs inside a path the script is allowed to print, and
   asserts **none** of the survivors appears in stdout. It also asserts the
   source bytes are not echoed in base64, that no state object is printed, that
   the passphrase is absent, and that nothing passphrase-shaped
   (`\b[a-z]{2,8}(-[a-z]{2,8}){5}\b`) appears anywhere. PASS.
4. **By construction.** `prepare.cjs` already collapses every engine fault to a
   fixed code with no cause attached, and `port.cjs` prints `error.code` only.
   The passphrase is written to a file, never to stdout. The bundle's payload is
   encrypted before it touches the disk.
5. **The bundle never lands in the repository.** `--out` inside the repo is
   refused outright (tested), so a port cannot leave a private file where a
   commit could pick it up.

---

## DESIGN NOTES (every place I departed from the brief, and why)

1. **"invoke that SAME gate on the migrated state" → the same gate on the same
   ENGINE.** `port-oracle.cjs check` takes `<engine> <label> [goldenLabel]` and
   censuses the blobs its manifest pins; there is no argument for a state, and
   inventing one would mean editing a frozen gate. So the script runs the gate
   verbatim on the engine that performed the migration, in both Date modes, and
   additionally reports whether the source is one of the pinned blobs. Stated in
   the file header, in the README and above.
2. **The gate is handed `--engine`'s module, not a hardcoded shim.** If `--engine`
   overrode the migration engine while the gate certified a different one, the
   PASS would be about the wrong code. This is also what makes the gate-failure
   test possible without touching `rebuild/engine/`.
3. **A third module, `wordlist.cjs`.** The brief names `port.cjs`, `unseal.cjs`
   and `README.md`. 2048 words inside the CLI would bury it, so they live in
   their own file — still embedded (no dependency, no runtime data file). The
   list is deduped and sorted in code and the module refuses to load with fewer
   than 2048 distinct entries, because a duplicate in a hand-authored list costs
   entropy silently while every test still passes.
4. **`seal()` is in `port.cjs`; the parameters are in `unseal.cjs`.** One source
   for KDF/cipher/AAD, and the file the brief calls "the reference decoder" is
   exactly that plus those constants.
5. **The payload is a superset of the brief's shape.** Added: `local:{sha256,
   bytes}` when `--local` is used (the merge has two immutable originals, not
   one), `engine.treeSha256` and `engine.path` (the engine is 18 modules, so the
   entry file's hash alone under-describes it), and `dataLoss.before/after`
   (`recordCounts` both sides, which is what "counts" means here).
6. **`--out` must be outside the repository.** Not in the brief. A bundle written
   into the worktree is one `git add -A` away from publishing his history to a
   public repo, and the whole point of this task is that it never leaves the PC.
7. **Write order and rollback.** The passphrase file is written first and removed
   again if the bundle write then fails, so the pair is never half-present. The
   script refuses to overwrite either file.
8. **ASCII-only stdout.** The Windows console renders `->` correctly and mangles
   `→`; Joe reads this output.
9. **The ORACLE-FAIL test bites the engine, not the source.** The brief suggests
   corrupting a required leaf of the state, but the oracle never reads `--source`,
   so a corrupt source can only fail at PREPARE (covered by its own case, four
   ways). The engine bite is the honest way to reach an ORACLE FAIL.
10. **No `rebuild/conform/engines/` build was needed.** `build-engines.mjs` exists
    for `run.cjs` steps 2-3 and rig185; `port-oracle.cjs check` takes the
    candidate engine directly. Nothing gitignored had to be produced.

---

## RESIDUALS

1. **The 10/10 gate has not been executed by me, and cannot be here.** Only the
   7/7 public part exists in a public checkout. The code path is identical — the
   law count comes from the blobs on disk — but the first person to see
   `frozen 10/10 · unfrozen 10/10` will be whoever runs it on Joe's PC. That is
   the intended shape of this task, not a gap I could have closed.
2. **`--source` on the real run will almost certainly report
   `source pinned by the oracle manifest: no`.** His live ledger has grown since
   the golden was cut on 2026-09-05, so its hash will not match `live.main`'s
   pinned `blobSha256`. That is honest and recorded; it is not a failure, and the
   `live` blob laws still run off `private/live.json` as they always did.
3. **File modes on Windows are advisory.** `chmod 600` is attempted and the
   script reports plainly that the OS did not enforce it, rather than claiming a
   permission it does not have.
4. **Bundle size.** 490 KB sealed from a 157 KB source: the payload carries both
   the original bytes (base64, +33%) and the migrated state. `node:zlib` would
   cut it to well under the source size, but that changes the format C2b has to
   decode, so it is a decision for C2b, not a change to make unilaterally here.
5. **Entropy is 66 bits** (6 words × 11 bits) behind 600 000 PBKDF2 rounds. Ample
   for a file that exists for an hour on Joe's own machines; worth restating if
   the bundle ever gets a longer life.
6. **The gate appends to `rebuild/conform/run.log`** (gitignored) when it runs.
   That is the frozen gate's own behaviour, unchanged by me, and the private
   blob's details are withheld there in code.
7. **No phone side yet.** `unseal.cjs` is the contract C2b must match; nothing
   here has been proved against a WebCrypto implementation, because none exists
   until C1 lands.

---

## STATUS

C2 is built and green on public fixtures. **The real run on the private blob has
not happened and must not happen until Joe asks for it in his own words** — see
the README's first section, which states that rule for whoever runs it.
