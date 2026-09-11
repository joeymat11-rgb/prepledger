# LANE C — C2 REPORT — Joe's port script for the PC

**FIX ROUND APPLIED (2026-09-11), after the independent review's ACCEPT WITH
CONDITIONS.** All four conditions are closed and re-executed; the review's own
reproductions are now regression tests that RUN (not skip) on this machine. The
sections below are current as of the fix round; what changed is summarised in
FIX ROUND at the top, and the one false claim the reviewer falsified — PRIVACY
PROOF item 5 — is corrected in place rather than quietly dropped.

**REVIEW ROUND 2 (ACCEPT) — DEFECT 5, LOW, closed.** `LOCAL_UNRELATED` built its
diagnostic around the shared-readings clause and appended the schema clause to
it, so a local file with **35 readings in common** and a future format number was
told "no reading is in both files". The two conditions are independent and the
message now says which one actually fired: `unrelatedReason()` assembles the
sentence from `shared < 1` and `!lineage` separately, and both the run path and
`--local-inspect` print it. A new test drives the lineage-only case (`v = 104`,
every read identical) and asserts the schema clause appears, the readings clause
does **not**, and the run still reports `readings this file has in common with
the source: 35` — plus the three failing combinations against `unrelatedReason`
directly. Suite is now **21/21, 0 skipped**.

Builder: cowork (Claude Fable 5.1). Branch `rebuild/lane-c-c2`, worktree
`work/lane-c/c2`, base `2553300`. Node 24.19.0 on Windows (PowerShell 5.1).
Owner files only: `rebuild/m3/setup/port/**` (new) + this file. Nothing under
`rebuild/engine/`, `rebuild/m4/import/`, `rebuild/conform/` or `rebuild/client/`
was edited. After the fix round `git status --porcelain` showed exactly three
modified paths, all mine: `rebuild/m3/setup/port/port.cjs`,
`rebuild/m3/setup/port/README.md` and `rebuild/m3/setup/port/test/port.test.cjs`
(plus this report). The two Windows bypass tests write into the repository by
design — that is what they are testing — and each asserts the write did not
happen and removes anything it finds; `git status` is clean after every run.

**The private blob was never read.** `rebuild/conform/private/` does not exist in
this worktree (`Test-Path` → False) and no path under
`C:/Users/joeym/Documents/prepledger-dev/ledger` or `ledger/state.json` on main
was opened by me, by the script, or by any test. Every run below used the public
frozen preimage and the shipped synthetic fixture.

---

## FIX ROUND — the four conditions, and what each one cost

**1 (HIGH) — the `--out` guard. CLOSED.** `insideRepo` compared
`path.resolve()` strings, which normalise neither NTFS reparse points nor 8.3
short names; the reviewer walked through it twice and landed the bundle AND the
plaintext passphrase in the tracked worktree of a public repo. Now: `realPathOf`
resolves the nearest existing ancestor with **`fs.realpathSync.native`** and
re-appends the tail (`--out` usually does not exist yet), `REPO_REAL` is the
repo root put through the same function, and `outRefusal` refuses three ways —
inside this repository, inside **any** git working tree (walking up the realpath
chain for a `.git` file *or* directory, so a linked worktree and any other
checkout both count), or any path carrying a `rebuild` segment. The folder is
checked **again after `mkdirSync`**, when its own realpath can be read rather
than its ancestor's, and the empty folder is removed if that second look
refuses. Both of the reviewer's reproductions are now tests that **execute**
here: the junction one creates the junction under `%TEMP%`, asserts it really
does resolve into the worktree, asserts exit 1 and asserts nothing landed in the
tree; the 8.3 one asks Windows for the short name through a `.bat` (`%~sA`) and
does the same. Both clean up after themselves. My first attempt at these two
probes *skipped* — `spawnSync`'s quoting mangled the `cmd` line — which is
precisely how a bypass test quietly stops testing anything; they now use
argument arrays and a batch file, and the run below shows 0 skipped.

**2 (MEDIUM) — the README. CLOSED.** `queue items` is gone from the list
`dataLossGuard` covers (it never covered it), "Nothing of yours is ever deleted
or dropped" is gone, and "so your history can never end up in a commit" is gone.
What replaced them is what the code now does: two separate checks, named by the
classes each one actually covers, and an explicit sentence that some counts
legitimately rise and the feed legitimately dedupes — with every number printed
so Joe can see what moved. The `--out` paragraph says plainly why it follows
shortcuts and short names.

**3 (MEDIUM) — the state-level counts check. CLOSED, and it caught something.**
`rebuild/conform/oracle/census.cjs` exports `counts()`; `port.cjs` calls it (it
does not re-implement it) on the source state and the migrated state, and on
each input when `--local` is used. Ten guarded classes — `reads nights dailyLogs
sessionLog exercises queue earned debuts events waist`, the exact list the
oracle's own counts law iterates — and the run refuses with exit 2 and no bundle
if any of them came out smaller. It is a **decrease** rule, not the oracle's
equality rule, because migration legitimately mints queue entries and EARNED
feed lines; `sets`, `feed`, `pendingDebuts` and `volume` are printed but not
gated (the oracle allows a `sets` decrease for filed attested strikes, and
`dataLossGuard`'s D33 clause already refuses an undeclared one; `feed` dedupes
legitimately, 323→311 on the preimage).

**4 (MEDIUM) — the wrong-file `--local`. CLOSED.** A merge now needs three
things: a shared reading (same date AND same weight) between source and local, a
schema in the source's lineage (`source.v <= local.v <= SCHEMA_V`), and
`--local-confirm <first 8 hex of the local file's sha256>`. Without the shared
reading it refuses `LOCAL_UNRELATED`; without the confirmation it refuses and
points at `--local-inspect`, a dry run that writes nothing and reports the
fingerprint, the schema and the number of shared readings. **Stated honestly in
the README and below: the state carries no athlete, owner, install or device
identity, so this is a relatedness heuristic, not an identity check.** It
catches the accident that actually happens — the wrong export, zero overlap, the
ledger silently doubling — and it cannot detect a different athlete in principle.

---

## WHAT WAS BUILT

| file | sha256 | bytes |
|---|---|---|
| `rebuild/m3/setup/port/port.cjs` | `08f877c73baaea6d7ab9737df303a8bd6e83c17697780130eea64e6fc615b070` | 30692 |
| `rebuild/m3/setup/port/unseal.cjs` | `515822a128031f03dde27d96c161d5528dd444673e00fa2e5c9a1d40719abf02` | 4883 |
| `rebuild/m3/setup/port/wordlist.cjs` | `e5ef45762e19d96e1dd2c043fec4ed1405e5bdabf3080169081c03aacd32daa7` | 14466 |
| `rebuild/m3/setup/port/README.md` | `a00ecda5799fbb5ac2c137b162388261828ea17ce7478402437ad43f7127dd13` | 8374 |
| `rebuild/m3/setup/port/test/port.test.cjs` | `093cc63eb0fb6983e0c02beffd42edd375ded5808fba6e89bfdb00ac02131000` | 25316 |
| `rebuild/m3/setup/port/test/seal.test.cjs` | `c0d4d3e9dc5e533dc9461717a2939e3ec0160d600b242f21a8f3f7625d9af695` | 4517 |

(`unseal.cjs`, `wordlist.cjs` and `seal.test.cjs` are unchanged from `e8011ce`
and carry the hashes the first reviewer verified. `port.cjs` and
`test/port.test.cjs` moved again in review round 2, for DEFECT 5 below.)

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
- `rebuild/conform/oracle/census.cjs` — `counts()`, a public export, **called**
  on the states this port produced. Nothing in that file is edited or copied.

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
node rebuild/m3/setup/port/port.cjs --source rebuild/conform/fixtures/preimage-2026-08-15.json --out "$env:TEMP\c2 final out"
```

(`--out` has a space in it, under `%TEMP%`, as the fix round asked.) Exit 0.
Stdout, in full (paths shortened here only for width):

```
1. SOURCE     PASS  ...\rebuild\conform\fixtures\preimage-2026-08-15.json  sha256=b5eb62d459d6e58bfb26bfa65f772db193998825166d7538403dad41eddda499  bytes=157544
2. PREPARE    PASS  schema 54->60  migrated sha256=de3fa6fcbd1dfa9f16022497ecdaeb3477d9375cbcd9c5ea93709db9c05a0795  bytes=156087
   counts  adjustments 34->34  corrections 0->9  dailyLogs 64->64  feed 267->267  learnedAnchors 0->0  learnedTdee 13->13  nights 59->59  photos 0->0  reads 61->61  sessionLog 13->13  waist 0->0
   dataLossGuard  safe=true  lost=0  (prepare re-ran it against every preimage)
3. COUNTS     PASS  census counts(), 10 guarded classes, source -> migrated
   source  reads 61->61  nights 59->59  dailyLogs 64->64  sessionLog 13->13  exercises 17->17  queue 18->18  earned 4->4  debuts 9->9  events 1->1  waist 0->0  sets 250->246  feed 323->311  pendingDebuts 0->0  volume 14->14
4. ORACLE     PASS  frozen 7/7  unfrozen 7/7  scope PUBLIC (2 public fixtures; rebuild/conform/private/live.json is absent)
   gate  node [--import ./tools/_fixed-now.mjs] rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs <label>  (cwd ...\work\lane-c\c2, MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York)
   engine  ...\rebuild\engine\oracle-shim.cjs  sha256=dd653bc170d3c5ae3b8cfa5c2ca8166b1de385a0903e056eab7ea062c125052d  tree(18 modules)=8a91ccb2cdb7d43e728f50e00bb4af942842648b07b33a705ee7dae5e21084e1
   source pinned by the oracle manifest: preimage-2026-08-15.main
5. SEAL       PASS  PBKDF2-SHA-256 600000 iterations -> AES-GCM-256  6 words out of 2048  sealed bytes=491500
6. WRITE      PASS  ...\c2 final out\earned-port-2026-09-11.json  sha256=cb1d3dfd801b9d5cd125ed05a1d2970b719cbc248d774db27d49765d22c7296a
   passphrase file  ...\c2 final out\earned-port-2026-09-11-PASSPHRASE.txt  (this OS does not enforce file modes - it is on your PC and only your PC)
```

Step 3 is the new one. `sets 250->246` and `feed 323->311` are printed and not
gated, for the reasons in FIX ROUND item 3; every guarded class held.

followed by the one-screen WHAT TO DO NEXT block (move the bundle, keep the
words here, import, then delete both). Every token above is a path, a count, a
hash or a verdict. `corrections 0->9` is the migration filing the known
corrections; `dataLossGuard safe=true lost=0` is the guard on the same states.

### 3. The suite

```
node --test rebuild/m3/setup/port/test/seal.test.cjs rebuild/m3/setup/port/test/port.test.cjs
```

→ **tests 21 · pass 21 · fail 0 · cancelled 0 · skipped 0 · todo 0**, exit 0
(duration 2.76 s; each port case spawns the CLI, which spawns the gate twice).
**Zero skipped** matters here: the two Windows bypass cases are the regression
for the review's HIGH defect, and a skipped bypass test is worse than none.

| case | what it proves |
|---|---|
| public preimage ports end to end | exit 0; one bundle; unseal with the generated passphrase; `migrated.state` deep-equals an independently computed `prepare()` output; `source.bytes` decodes to the exact input bytes; `oracle.verdict` PASS with clock/tz pinned and every mode `green === total` |
| stdout carries paths, counts, hashes and verdicts | the privacy case — see below |
| `--local` merges the pair, Windows paths with spaces and backslashes | merged state deep-equals `prepare(source, {localBytes})`; both the source reads and the local-only `2029-12-02` read are present; `local.bytes` round-trips; the census counts run against the local input too; `payload.local.relatedness.related === true`; `--out` is a folder with spaces, every path passed with `\` separators |
| **the counts check refuses a merge that drops a class `dataLossGuard` reads as empty** | see the finding below — `safe=true lost=0` from the engine guard, `SHRANK (source): nights 35->0` from the census counts, exit 2, no folder |
| **a wrong-file `--local` is refused** | zero shared readings → exit 2, `LOCAL_UNRELATED`, `readings this file has in common with the source: 0`, the readings clause present and the schema clause absent, nothing written; `--local-inspect` on the same file exits 2 and writes nothing |
| **a lineage-only refusal names the schema, not the readings** (DEFECT 5) | local `v = 104` with all 35 readings shared → exit 2, `lineage=false`, `readings … in common …: 35`, `format number 104 is not in the source's lineage (needs 54 to 60)`, and the readings clause **absent**; same on `--local-inspect`; plus `unrelatedReason` checked directly on all three failing combinations |
| **a genuine `--local` still needs confirming** | no `--local-confirm` → exit 2 at `CONFIRM`; a wrong token → exit 2; `--local-inspect` exits 0, prints the exact token to use and the shared-reading count, and writes nothing |
| a gate that is not GREEN stops the port | exit 2, `ORACLE FAIL`, `NO BUNDLE WRITTEN`, and the output folder is empty — not even a passphrase file |
| the CLI refuses to write inside the repository / unknown argument / missing source | exit 1 each, nothing created |
| a corrupted source is refused before anything is written | truncated JSON, a duplicate key (the W6 parser's catch, not `JSON.parse`'s), a future schema and a non-object each exit 2 with a fixed `IMPORT_SOURCE_*` code and no output folder |
| **an emptied `queue` is caught by the counts check** | `PREPARE PASS`, `dataLossGuard safe=true lost=0`, then `COUNTS FAIL`, `SHRANK (source): queue 18->0`, exit 2, no folder |
| **an emptied `exercises` list is caught too** | same, and `ORACLE` never appears — a shrink stops the run before the gate |
| **`--out` through a directory junction** | `mklink /J` under `%TEMP%` pointing at `rebuild/m3/setup/port`; the test first asserts the junction really resolves into the worktree, then exit 1, then asserts nothing landed in the tree |
| **`--out` through an 8.3 short path** | the short name from `%~sA`; same three assertions |
| **realpath is what decides** | `realPathOf(short)` equals the long path; `insideRepo` is true for the short spelling and for a not-yet-existing folder under the repo, and false for `%TEMP%` |
| the sealed bundle opens with its own passphrase | round trip, from bytes and from a string |
| a different passphrase is refused | `BUNDLE_AUTH_FAILED` |
| one flipped byte anywhere in the ciphertext | first byte, middle byte, last byte — `BUNDLE_AUTH_FAILED` each |
| re-pointing the bundle at another source (the AAD) | `BUNDLE_AUTH_FAILED` |
| a changed profile, salt, iv, iteration count, tag length, short AAD or non-base64 ciphertext | `BUNDLE_AUTH_FAILED` for all seven |
| the word list | 2048 entries, all distinct, all `^[a-z]{2,8}$`; a passphrase is 6 of them; 64 draws give 64 distinct phrases |

### 4. A FINDING the new counts check produced on its first run

The `--local` happy path used to merge the **synthetic** pair. With the census
counts in place it refuses it, and the reason is real:

- `oracle/make-synthetic.cjs` builds `sleep.nights` as an OBJECT keyed
  `"0".."34"`. The frozen preimage — and the real ledger — carries an ARRAY.
- `mergeState` unions nights with `_unionBy` (`merge.cjs:1054-1055`), which
  returns `[]` for a non-array. Merging the synthetic pair therefore drops all
  35 nights.
- `dataLossGuard` cannot see it: `recordCounts.nights` is `arr(...)`, which
  reads that object as **0 both before and after**. It answers `safe=true`.
- `census counts()` uses `Object.keys`, sees 35 → 0, and the port refuses.

Measured directly: `migrate(synthetic).nights = 35`, `mergeState(...).sleep =
{"nights":[]}`; the preimage pair merges `nights 59->59`. So this is a
**fixture-shape quirk, not an engine defect on real data**, and the oracle's own
counts law never sees it because the oracle never calls `mergeState`. I did not
touch `rebuild/conform/` — it is frozen for this task — so this is reported, not
fixed, and it is worth a line to whoever owns the conformance fixtures. The
happy path now uses the preimage pair; the synthetic pair is kept as a test that
the counts check catches exactly this class of loss.

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
5. **CORRECTED — this item was FALSE as first written.** It read: "`--out`
   inside the repo is refused outright (tested), so a port cannot leave a
   private file where a commit could pick it up." It was true only of literal
   path strings. The independent reviewer falsified it twice on Windows — a
   directory junction and an 8.3 short name — and wrote both the sealed bundle
   and the plaintext passphrase into the tracked worktree of a public repo. What
   is true now, and tested by two executing regression cases: `--out` is
   resolved with `fs.realpathSync.native` (nearest existing ancestor, tail
   re-appended) and refused if it resolves inside this repository, inside any
   git working tree, or into a folder named `rebuild`; the check runs again
   after the folder is created. Those three refusals are what the claim rests
   on — not a general guarantee that no private file can ever be committed.

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
   (`recordCounts` both sides, which is what "counts" means here). The fix round
   adds `census` (the guarded class list, the rule, and `counts()` for source,
   local and migrated) and `local.relatedness`, so the phone can display what was
   proved instead of taking the bundle's word for it.
6. **`--out` must be outside the repository.** Not in the brief. A bundle written
   into the worktree is one `git add -A` away from publishing his history to a
   public repo, and the whole point of this task is that it never leaves the PC.
   The first implementation of this compared strings and was bypassable; see
   FIX ROUND item 1. It now refuses on realpath, and refuses two more ways
   (any git working tree, any `rebuild` segment) because over-refusing costs one
   retry and under-refusing publishes his ledger.
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
11. **The counts check is a DECREASE rule, not the oracle's equality rule**, and
    `sets`/`feed`/`pendingDebuts`/`volume` are printed but not gated. Migration
    legitimately mints queue entries and EARNED lines, the feed legitimately
    dedupes (323→311 on the preimage), and the oracle itself allows a `sets`
    decrease for filed attested strikes. Gating on equality would refuse honest
    ports; gating on decrease refuses loss. Stated so a reviewer does not have to
    infer it from the code.
12. **No engine bytes are ever mutated by a test.** The fix round's brief
    suggested a "disposable mutation of a COPY of the engine, restore bytes".
    Each bitten case instead writes a NEW module under the scratch folder that
    `require`s the real shim and overrides one function. Nothing in
    `rebuild/engine/` is written, so there is nothing to restore and no window in
    which a crashed test leaves the engine modified.
13. **`--local-confirm` takes the file's own hash prefix, not a `--force` flag.**
    The reviewer suggested `--force`. A bare force flag is muscle memory after
    the second use; a token derived from the file he named cannot be supplied
    without looking at THAT file. `--local-inspect` is the dry run that prints
    it, along with the schema and the shared-reading count.

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
   **What that leaves unchecked, now priced** (the reviewer was right that the
   first version recorded the fact without the consequence): the oracle censuses
   the September snapshot, so anything added to the live ledger after 2026-09-05
   is seen by the oracle's counts law only through that snapshot. The five
   classes `dataLossGuard` does not cover — `exercises queue earned debuts
   events` — used to fall entirely into that window. The new COUNTS step closes
   exactly that: it runs the oracle's own `counts()` on TODAY's states, so those
   five are count-checked on the blob actually being ported. What remains
   unchecked on post-snapshot data is the oracle's *semantic* census (records
   DTO, lifts, energy, progression, today), which no in-band check can reproduce
   without the golden — that is the residual, and it is bounded by the engine
   being certified on a near-identical blob.
3. **File modes on Windows are advisory.** `chmod 600` is attempted and the
   script reports plainly that the OS did not enforce it, rather than claiming a
   permission it does not have.
4. **Bundle size.** 491 KB sealed from a 157 KB source: the payload carries both
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
8. **NEW — the relatedness guard is a heuristic, by necessity.** The state
   carries no athlete, owner, install or device identity, so a *different
   athlete* cannot be detected in band; the reviewer looked for a key and found
   none, and I confirmed it. What the guard detects is a `--local` file with no
   reading (same date AND same weight) in common with the source — the wrong-file
   accident. Two genuine exports of the same ledger always share readings; two
   ledgers of different people could in principle share a date and a weight by
   coincidence. Treat it as accident prevention, not identity.
9. **NEW — over-refusal in the `--out` guard is deliberate.** Any folder inside
   any git working tree, or with a `rebuild` segment anywhere in its realpath, is
   refused even if it has nothing to do with this repo. That will occasionally
   refuse a folder Joe considers fine. The trade is one retry against publishing
   his ledger, and the message names the reason.
10. **NEW — `make-synthetic.cjs` builds `sleep.nights` as an object** where the
    real ledger uses an array, so the synthetic pair cannot be merged without
    losing 35 nights (COMMANDS §4). Reported, not fixed: `rebuild/conform/` is
    frozen for this task. Worth a look from whoever owns the fixtures, because
    the synthetic exists precisely to exercise paths the live fixture cannot.

---

## STATUS

C2 is built, the four review conditions and round 2's DEFECT 5 are closed, and
the suite is 21/21 with 0 skipped on public fixtures. **The real run on the private blob has not happened
and must not happen until Joe asks for it in his own words** — see the README's
first section, which states that rule for whoever runs it.
