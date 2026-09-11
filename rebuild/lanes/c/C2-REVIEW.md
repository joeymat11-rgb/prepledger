# LANE C — C2 REVIEW — independent reviewer (Opus), re-executed on the owner's PC

**VERDICT: ACCEPT WITH CONDITIONS.**

The machinery is sound and the report is unusually honest about its single
biggest limitation (the oracle is engine-scoped, not state-scoped) — I set out to
falsify that reading and it is correct. Every headline claim I could re-execute,
I re-executed, and it held: 12/12, 7/7 × 2 modes, byte-identical round trip, and
a seal I could not break in eight attempts.

But the `--out` repository guard — the builder's own addition, and the one
control standing between Joe's private ledger and a PUBLIC repo — is bypassable
on Windows two different ways, and I bypassed it twice, writing the sealed
bundle **and the plaintext passphrase** into the tracked worktree. That is a
real-run risk, not a hypothetical. Three smaller gaps are named below.

**Conditions (all executable; none requires touching the frozen gate):**

- **C1 — fix the `--out` guard (blocking).** In `insideRepo()`, compare
  `fs.realpathSync.native()` of the repo root against `fs.realpathSync.native()`
  of `--out` (resolve the nearest existing ancestor when `--out` does not exist
  yet), not `path.resolve()`. Verified: `realpathSync.native` maps both the 8.3
  short path and a junction back to the true repo path. Add a regression test
  for each. Until this lands, do not post "C2 READY FOR OWNER ASK".
- **C2 — correct the README (blocking).** Remove `queue items` from the list of
  classes the guard counts, drop "Nothing of yours is ever deleted or dropped",
  and drop "so your history can never end up in a commit" (or restore it only
  after C1). Both statements are false as shipped; Joe reads this copy.
- **C3 — add the state-level counts check.** `rebuild/conform/oracle/census.cjs`
  already exports `counts()`. Call it on the source state and the migrated state
  and refuse if any class shrank, printing counts only. This closes the classes
  `dataLossGuard` does not cover, on the real blob, with no gate edit.
- **C4 — handle the wrong-file `--local`.** Refuse (or demand an explicit
  `--force`) when source and local share zero read dates, and state plainly in
  the report and README that a *different athlete* cannot be detected because
  the state carries no athlete or device identity to key on.

---

## WHAT I EXECUTED

Worktree `work/lane-c/review-c2`, detached at `e8011ce` (base `2553300`), Node
v24.19.0, PowerShell 5.1. Probes under `%TEMP%\c2rev`. I modified no candidate
file, committed nothing, pushed nothing, ran no install. `git status --porcelain`
was empty at the start and empty at the end (checked after the junction probes,
which write into the repo — I removed what they wrote).

`rebuild/conform/private/` does not exist here (`Test-Path` → False). The private
blob, `ledger/state.json` on main, and `prepledger-dev/ledger/**` were never
opened by me or by anything I ran. Inputs were the two public fixtures plus
derived copies under `%TEMP%`.

**1. Diff scope — CLEAN.** `git diff --stat 2553300 HEAD` = 7 files, 1332
insertions, 0 deletions: `rebuild/m3/setup/port/{port.cjs,unseal.cjs,wordlist.cjs,README.md,test/port.test.cjs,test/seal.test.cjs}`
and `rebuild/lanes/c/C2-REPORT.md`. Nothing under `rebuild/engine`,
`rebuild/m4/import`, `rebuild/conform` or `rebuild/client`.

**2. Suite — 12/12, exit 0.** `node --test test/port.test.cjs test/seal.test.cjs`
→ `tests 12 · pass 12 · fail 0 · cancelled 0 · skipped 0 · todo 0`, 1751 ms. No
`not ok` lines. Matches the claimed 12/12.

**3. End-to-end, my own run, `--out` a folder with a space in its name**
(`%TEMP%\c2rev\review out dir`): exit 0, two files written. Then verified
independently of the builder's tests, with my own wiring of
`createImportPreparation({engine, parseStrictJson})`:

- unseal with the generated passphrase → payload returned (6 words);
- `migrated.state` **deep-equals** my independent `prepare()` output
  (`isDeepStrictEqual`), and `migrated.sha256` equals my `candidate_sha256`
  (`de3fa6fc…a0795`);
- `source.bytes` decodes **byte-identical** to the input (157,544 = 157,544),
  `source.sha256 == sha256(file)`, and the envelope AAD carries the same hash;
- `oracle.verdict=PASS`, `laws=7`, `manifestPin="preimage-2026-08-15.main"`.

**4. The gate claim — I attacked it; the builder is RIGHT.**

- *Arithmetic.* `port-oracle.cjs:14` builds `BLOBS` and `.filter(existsSync)`;
  `:31` pushes one manifest law; `:32-43` push three laws per surviving blob in
  `check` mode. Two public fixtures → `1 + 3×2 = 7`. With `private/live.json`
  → `1 + 3×3 = 10`. The "10/10 = 1 + 3 blobs × 3" reading is **correct**, and
  10/10 is reachable only where the private blob exists. Confirmed.
- *Scope.* `check` takes `<engine> <label> [goldenLabel]`. There is no state
  parameter; every law re-reads `b.file` from disk and censuses it with the
  supplied engine against the manifest-pinned golden. It certifies the **engine**,
  not the migrated `--source`. The builder's reading is **correct**.
- *Pins.* `manifest.json` records `clock 2026-09-03`, `tz America/New_York`,
  `censusVersion 3` — exactly `GATE.clock`/`GATE.tz` in `port.cjs`. Law 1 fails
  closed on any drift.
- *Can one engine migrate while the oracle checks another?* **No — probed.** I
  wrote my own bitten shim (passes `migrate`/`mergeState`/`dataLossGuard`/
  `recordCounts`/`SCHEMA_V` straight through; only `targetsFor` returns the first
  target one rung high) and ran `--engine %TEMP%\c2rev\bitten-shim.cjs`. The
  migrated hash came out **identical** (`de3fa6fc…`) — `prepare()` and
  `dataLossGuard` are blind to it — and the gate still caught it:
  `ORACLE FAIL frozen 5/7 unfrozen 5/7`, both
  `…-census-v2-required-identical-to-golden` laws RED, `NO BUNDLE WRITTEN`,
  exit 2, output dir never created. `runGate` is handed the same `--engine` path
  that `require()` loaded, so the two cannot diverge. Claim **confirmed**.
- *Wrong `--engine` path* → exit 1, `Cannot find module`, nothing written.
- *Clock pins.* `MEASURED_TEST_NOW=2026-01-01` → exit 1, "…but the gate is
  pinned to 2026-09-03", nothing written. `TZ=Europe/London` → exit 1, same
  shape. Missing → the script sets both itself. Refuses correctly.
- *Fail-closed* → confirmed above: on oracle FAIL no bundle and no passphrase
  file exist, not even an empty directory.

**5. Seal / unseal — every parameter verified in code and by probe.** Read off
the written envelope: `PBKDF2-SHA-256`, `iterations=600000`, `saltBytes=16`,
`AES-GCM-256`, `ivBytes=12`, `tagBits=128` (tag appended), `aad=[profile,
sourceSha256]`, `NFKD` normalisation at `unseal.cjs:40`. My own eight tamper
probes (not the builder's tests) each raised `BUNDLE_AUTH_FAILED` and nothing
else: wrong passphrase · flipped middle ciphertext byte · AAD `sourceSha256`
edited · iterations lowered to 1000 · salt replaced · IV replaced · tag
truncated; and the correct passphrase still opened it. One failure code for all
of them, as designed.

**6. Passphrase entropy and RNG.** `WORDS.length === 2048`, all 2048 distinct,
all `^[a-z]{2,8}$`; drawn with `crypto.randomInt(WORDS.length)`; no `Math.random`
anywhere in `port.cjs`. 6 × log2(2048) = **66.0 bits**, as the report states.

**7. Privacy — my own scan, not the builder's test.** I harvested 1,201 distinct
values from the preimage fixture (every string ≥4 chars, every non-integer, every
integer ≥1000) and searched the captured stdout. Two raw hits, both triaged and
both **false positives of my scan**: `2026-08-15` occurs only inside the public
fixture filename and the public manifest pin key `preimage-2026-08-15.main`, and
`2249` occurs only as a substring of the sha256 `…16022497…`. Blanking hash runs
and the fixture name removes both. Also confirmed: no base64 of the source in
stdout, the passphrase absent from stdout, nothing passphrase-shaped in stdout,
and the passphrase written to the claimed file (36 chars, 6 words). **No ledger
value reaches stdout.**

**8. `--local`.** Same ledger + one extra read at `2029-12-02`, `--out` with a
space, backslash-separated paths: exit 0; merged state contains the local-only
read **and** all 35 source reads (`reads 35->36`), `local.bytes` round-trips
byte-identical. Future schema (`v=104` vs `SCHEMA_V 60`) → `PREPARE FAIL
IMPORT_SOURCE_FUTURE_SCHEMA`, exit 2, nothing written — **refuses correctly**.

---

## WHERE I DISAGREE

I do **not** disagree with the report's central re-reading of the brief. "Invoke
that same gate on the migrated state" is not implementable against a gate with no
state parameter, and inventing one would mean editing a frozen gate. Running it on
the engine that performed the port, in both Date modes, is the right call and the
report says so plainly in DESIGN NOTE 1 and RESIDUAL 2. I tried to break that
claim from three directions and could not.

Where I disagree is with how the report **prices** the leftover gap, and with two
lines of copy that assert protections the code does not provide.

1. **RESIDUAL 2 says the `no` pin "is not a failure". That is true but
   incomplete.** It records *that* the real blob is unpinned without saying *what
   goes unchecked as a result*. Measured (see DEFECT 3): the oracle's counts law
   guards five record classes that `dataLossGuard` does not, and on the real run
   the oracle sees only the 2026-09-05 snapshot. The report should name those
   five classes and the window, because that is the actual residual.

2. **The report's PRIVACY PROOF item 5 — "`--out` inside the repo is refused
   outright (tested), so a port cannot leave a private file where a commit could
   pick it up" — is false as shipped.** It is true only for literal paths. See
   DEFECT 1. This is the one claim in the report I was able to falsify outright,
   and it is the claim that matters most for a public repo.

3. **The brief's `--local` "must refuse" requirement is unmet and unmentioned.**
   Future schema refuses; a different ledger does not, and the report's DESIGN
   NOTES do not record the departure. See DEFECT 4.

I also note one thing in the builder's favour that the report undersells: because
`oracle-shim.cjs` derives its clock from `MEASURED_TEST_NOW`, the engine that
migrates is pinned to the same 2026-09-03 clock the gate is pinned to, and the
gate passing in *both* Date modes proves the frozen/unfrozen difference is
immaterial. The migration is not running against an unpinned wall clock. That is
a real property and it is not claimed anywhere.

---

## DEFECTS

### DEFECT 1 — HIGH — the `--out` repository guard is bypassable on Windows; the bundle *and the passphrase* land in the tracked worktree

`port.cjs:230-233` decides with `path.relative(REPO, dir)` over a `path.resolve()`d
argument. `path.resolve` normalises `.`/`..` and separators but resolves **neither
NTFS reparse points nor 8.3 short names**, so two ordinary Windows spellings of an
in-repo path read as outside.

**Reproduction A — directory junction (no admin needed).**

```
cmd /c mklink /J "%TEMP%\c2rev\junc" "<worktree>\rebuild\m3\setup\port"
node rebuild/m3/setup/port/port.cjs --source rebuild\conform\fixtures\preimage-2026-08-15.json ^
     --out "%TEMP%\c2rev\junc\viajunction"
```

→ `EXIT=0`, `5. WRITE PASS`, and
`<worktree>\rebuild\m3\setup\port\viajunction\` then contains
`earned-port-2026-09-11.json` **and** `earned-port-2026-09-11-PASSPHRASE.txt`.

**Reproduction B — 8.3 short path (no junction, no admin).**

```
--out "C:\Users\joeym\DOCUME~1\Codex\2026-0~1\READ-R~1\work\lane-c\REVIEW~2\rebuild\m3\setup\port\viashort"
```

→ `EXIT=0`, same two files inside the worktree. (I removed both afterwards;
`git status --porcelain` is empty.)

**Why it matters.** On the real run that file is Joe's entire private ledger, and
the plaintext passphrase is written *beside it*, so the seal protects nothing in
this scenario. `rebuild/m3/setup/port/` is a tracked directory and the repo is
public. This is exactly the outcome DESIGN NOTE 6 exists to prevent.

**Fix, verified executable.** `fs.realpathSync.native()` normalises both cases —
I confirmed it returns the true worktree path for the 8.3 spelling
(`insideRepo(realpath(short)) === true`, vs `false` today) and for a junction.
Resolve the nearest existing ancestor when `--out` does not exist yet, then
compare. Add a regression test per spelling.

### DEFECT 2 — MEDIUM — the README names a protection that does not exist

`README.md` "What it does, in order", step 2:

> a guard counts every class of record — readings, nights, food days, sessions,
> **queue items**, corrections — and refuses to go on if any count came out
> smaller. **Nothing of yours is ever deleted or dropped.**

Measured. `recordCounts` returns exactly these classes:
`adjustments corrections dailyLogs feed learnedAnchors learnedTdee nights photos
reads sessionLog waist`. There is **no `queue` class** — nor `exercises`,
`earned`, `debuts` or `events`. Probing `dataLossGuard(prev, next)` on the
migrated preimage:

| mutation applied to `next` | `dataLossGuard` |
|---|---|
| drop all 18 `queue` entries | `safe=true  lost=[]` |
| drop all 17 `exercises` | `safe=true  lost=[]` |
| drop all `earned` | `safe=true  lost=[]` |
| drop every rep-set in `sessionLog` (246 sets) | `safe=false  lost=["setidentity …"]` |

Sets *are* protected (the D33 identity clause). Queue, exercises and earned are
not. The README names `queue items` specifically — the strongest of the three
counter-examples — and then generalises to "nothing … is ever deleted or
dropped". `CLAUDE.md`'s own standing rule applies: *a rule surviving only in copy
is still a rule, because he reads the copy.*

Also in the same file: "The script refuses anything inside it, so your history
can never end up in a commit" — falsified by DEFECT 1.

**Fix.** Delete `queue items` from the list, replace the absolute sentence with
what the guard actually promises, and either implement C3 or say which classes
are counted.

### DEFECT 3 — MEDIUM — nothing checks the migrated REAL state in five classes the oracle does check

**What actually validates the migrated `--source` state.** Only `prepare.cjs`:
strict-JSON parse, `v` in `[3, SCHEMA_V]`, lossless JSON re-parse
(`IMPORT_MIGRATION_NOT_LOSSLESS_JSON`), `candidate.v === SCHEMA_V`, and
`dataLossGuard` against every preimage. The oracle adds nothing here — it never
receives the state.

**Is that enough for the brief's intent?** Not quite, and the shortfall is
measurable. The oracle's counts law checks
`reads nights dailyLogs sessionLog exercises queue earned debuts events waist`
plus the struck-sets rule; `dataLossGuard` covers none of
**`exercises queue earned debuts events`** (DEFECT 2 table). The oracle runs those
laws only over the blobs on disk — on the real run that is `private/live.json`,
the 2026-09-05 snapshot — while `--source` is today's `ledger/state.json`, which
the report itself predicts will be unpinned. So anything Joe added after
2026-09-05 in those five classes is ported with **no count check of any kind**,
and the window widens the longer the real run is deferred.

The engine is still certified on a near-identical blob, so this is a bounded
residual rather than an unguarded port — but it is the residual, and it is not
stated.

**Fix, verified executable and gate-free.** `rebuild/conform/oracle/census.cjs`
exports `counts` (`census.cjs:59`). Call `counts(sourceState)` and
`counts(migratedState)`, assert no class shrank, print counts only, and fail
closed like the other steps. That applies the oracle's own counts law to the real
blob without editing a frozen file.

### DEFECT 4 — MEDIUM — the brief's `--local` refusal is unmet, and the wrong-file accident merges silently

The brief asks what happens if `--local` is a different athlete/era: *must
refuse*. Future schema refuses. A different ledger does not.

**Reproduction — the realistic accident (Joe picks the wrong export).** I took
the synthetic fixture and shifted every date +3 years, giving **zero** read-date
overlap with the source, then:

```
port.cjs --source rebuild\conform\fixtures\synthetic-pending-debut.json ^
         --local "%TEMP%\c2rev\local-shifted.json" --out "%TEMP%\c2rev\j1"
```

→ `EXIT=0`, bundle written, `ORACLE PASS frozen 7/7 unfrozen 7/7`, counts
`dailyLogs 35->70  learnedTdee 13->26  reads 35->70  sessionLog 2->4`. The ledger
is **doubled** into a fictional history, sealed, and stamped `oracle.verdict:
PASS`. Nothing warns. (Merging the preimage into the synthetic behaves the same:
`reads 35->67`, `feed 0->267`, exit 0 — though that pair is legitimately the same
athlete, see below.)

**An honest limit the report should state.** A true *different athlete* check is
**not implementable in-band**: I looked for an identity to key on and there is
none. The two fixtures share `model.anchorISO ("2026-07-21")` and `model.src
("coach's eye")`, there is no `id`/`installId`/`athlete`/`owner`/`era`/`deviceId`
at top level, and 29 of 35 read dates overlap — the synthetic *is* the same
athlete. So the brief asked for a refusal the state format cannot support, and
that should be recorded rather than left silently unmet.

**Fix.** Refuse (or require `--force`) on zero read-date overlap — that catches
the wrong-file accident above while passing every legitimate merge — and state
the identity limitation in the report and README.

---

## RESIDUALS CONFIRMED

The report's seven residuals are accurate as written. Specifically re-checked:

1. **10/10 not executed here — CONFIRMED and unavoidable.** `private/live.json`
   is absent; the same command yields 7 laws. The law count is data-driven
   (`BLOBS.filter(existsSync)`), so no code path differs between 7 and 10. The
   "10/10 only on the PC" statement is **honest**, and correctly framed as
   something the owner's run will be the first to see.
2. **The real-run pin will say `no` — CONFIRMED**, and on the public run it
   correctly said `preimage-2026-08-15.main`. See DEFECT 3 for what the report
   omits about the consequence.
3. **Windows file modes advisory — CONFIRMED.** Output read
   `(this OS does not enforce file modes …)`; the script does not claim a
   permission it did not get.
4. **Bundle size — CONFIRMED.** 490,704 sealed bytes from a 157,544-byte source.
5. **66 bits — CONFIRMED** by measurement (2048 distinct words, `randomInt`).
6. **`run.log` appended by the frozen gate — CONFIRMED**, unchanged behaviour.
7. **No phone side yet — CONFIRMED.** `unseal.cjs` is a clean single source of
   the parameters for C2b.

### On report honesty, overall

I went looking for overclaim and found one false statement (PRIVACY PROOF item 5,
DEFECT 1), one unstated brief departure (DEFECT 4), and one under-priced residual
(DEFECT 3). Everything else I could check was accurate to the digit: all six file
hashes, the 12/12, the `7/7 × 2 modes`, the source and migrated sha256s, the
counts line, the 2048-word list, the 66 bits, the 490 KB. DESIGN NOTE 1 and
RESIDUAL 2 volunteer the weakest point of the design rather than burying it,
which is the opposite of the failure mode I was sent to look for. The README is
genuinely Eli15, and it states the owner-ask rule in its own section, before the
instructions, in Joe's terms ("If you did not say 'run the port now', it does not
run"), together with the never-in-the-cloud rule ("Nothing leaves this PC on its
own. There is no upload, no server, no account."). Both required rules are
present and prominent.

---

## FILES REVIEWED (sha256, as they stand at `e8011ce`)

| file | sha256 | bytes |
|---|---|---|
| `rebuild/m3/setup/port/port.cjs` | `4e1f24859dd1ab073febde9a2833409e69a0cb1eda767fa28db42571a9fccf91` | 19878 |
| `rebuild/m3/setup/port/unseal.cjs` | `515822a128031f03dde27d96c161d5528dd444673e00fa2e5c9a1d40719abf02` | 4883 |
| `rebuild/m3/setup/port/wordlist.cjs` | `e5ef45762e19d96e1dd2c043fec4ed1405e5bdabf3080169081c03aacd32daa7` | 14466 |
| `rebuild/m3/setup/port/README.md` | `d7b9ead51c3c43f6a4cbb609410571e3d99984c5e698e234c5a0074ee73ea4e6` | 5344 |
| `rebuild/m3/setup/port/test/port.test.cjs` | `cd0c5e8e3c08f08acf11d94d8d7a3e79c5b1a88ca70dcdc12b997a5ef73dc535` | 12029 |
| `rebuild/m3/setup/port/test/seal.test.cjs` | `c0d4d3e9dc5e533dc9461717a2939e3ec0160d600b242f21a8f3f7625d9af695` | 4517 |
| `rebuild/lanes/c/C2-REPORT.md` | `0896ffd19c9414d85682b8850928c9c40f6d9edb81f81767f7fde9c2cd8378eb` | 17819 |

All six code/doc hashes match the report's own table exactly.

Read for context, not modified: `rebuild/conform/oracle/port-oracle.cjs`,
`rebuild/conform/oracle/manifest.json`, `rebuild/conform/oracle/census.cjs`,
`rebuild/m4/import/prepare.cjs`, `rebuild/engine/oracle-shim.cjs`,
`rebuild/engine/migrate.cjs` (`recordCounts`/`dataLossGuard`),
`rebuild/lanes/c/C2-BRIEF.md`.

— independent reviewer, 2026-09-11


---
---

# ROUND 2 — re-review at `fa46aa4` (round 1 above is unchanged)

**FINAL VERDICT: ACCEPT at fa46aa4.**

All four round-1 conditions are met, verified by execution, not by reading the
report. Both defects I landed in round 1 are closed and are now regression tests
that **actually run** (`skipped 0`). I threw six further bypass spellings at the
new guard, including three the coordinator asked for and two I added; all six
refused, and the legitimate control path still writes a bundle. One new
**LOW** defect — a diagnostic message that states a false reason — is recorded
below. It fails closed, risks no data, and does not block acceptance.

## WHAT I EXECUTED (round 2)

Same worktree, now at `fa46aa4`, Node v24.19.0, PowerShell 5.1. Round 1's file
was preserved and this section appended. `git status --porcelain` at the end
shows exactly one untracked path, my own `rebuild/lanes/c/C2-REVIEW.md` — the
two bypass tests and my nine probes cleaned up after themselves.

**1. Scope — still clean.** `git diff --name-status 2553300 HEAD` = 7 paths, all
`A`, all owner files: `rebuild/m3/setup/port/**` + `rebuild/lanes/c/C2-REPORT.md`.
Nothing under `rebuild/engine`, `rebuild/m4/import`, `rebuild/conform` or
`rebuild/client`. `unseal.cjs`, `wordlist.cjs` and `seal.test.cjs` carry
**byte-identical hashes to round 1** — the seal layer I cleared was not touched.

| file | sha256 | bytes |
|---|---|---|
| `port.cjs` | `394d7fc4f62d31a5cd8f9d648dab101f954f1d4f7904596d7188485d063177b6` | 30074 |
| `unseal.cjs` *(unchanged)* | `515822a128031f03dde27d96c161d5528dd444673e00fa2e5c9a1d40719abf02` | 4883 |
| `wordlist.cjs` *(unchanged)* | `e5ef45762e19d96e1dd2c043fec4ed1405e5bdabf3080169081c03aacd32daa7` | 14466 |
| `README.md` | `a00ecda5799fbb5ac2c137b162388261828ea17ce7478402437ad43f7127dd13` | 8374 |
| `test/port.test.cjs` | `1bbc65d22cbcf03d332b4cd1946f947c7460f1d2cc4b15a37f4b78227d4497e0` | 22789 |
| `test/seal.test.cjs` *(unchanged)* | `c0d4d3e9dc5e533dc9461717a2939e3ec0160d600b242f21a8f3f7625d9af695` | 4517 |
| `C2-REPORT.md` | (regenerated this round) | 460 lines |

**2. Suite — 20/20, `skipped 0`, exit 0.** `tests 20 · pass 20 · fail 0 ·
cancelled 0 · skipped 0 · todo 0`. The claim I was asked to distrust is that the
two Windows bypass probes *really* execute rather than quietly skipping. They
carry `t.skip()` escape hatches (`skipUnlessWindows`, `mklink /J unavailable`,
`8.3 short names are off on this volume`) — so a silent skip was possible — but
`skipped 0` proves neither fired. Better, each probe asserts the bypass **really
reaches the worktree before** it asserts the refusal:
`assert.ok(fs.existsSync(path.join(junction, 'port.cjs')))` and the same for the
short path, plus `assert.notEqual(short, IN_REPO_TARGET)` so a probe that
silently produced the long name would fail rather than pass. That is the right
construction: a bypass test that stops testing anything now fails loudly.

**3. The guard — I re-ran my two round-1 bypasses and four more. All refused.**

| # | `--out` spelling | result |
|---|---|---|
| 1 | junction → `rebuild/m3/setup/port` (my round-1 defect) | exit 1, `inside this repository`, nothing landed |
| 2 | junction → **repo root**, out two levels deep (`…/rebuild/m3/deep`) | exit 1, `inside this repository`, nothing landed |
| 3 | 8.3 short name `DOCUME~1…REVIEW~2` (my round-1 defect) | exit 1, `inside this repository`, nothing landed |
| 4 | **sibling git worktree** `work/lane-c/c1` | exit 1, `inside a git working tree (…/c1)`, nothing landed |
| 5 | `rebuild` segment **outside** the repo (`%TEMP%\somewhere\rebuild\out`) | exit 1, `inside a folder called "rebuild"`, nothing landed |
| 6 | **relative** path `rebuild\m3\setup\port\viarel` | exit 1, `inside this repository`, nothing landed |
| 7 | `\\?\` extended-length prefix | exit 1, `inside this repository`, nothing landed |
| 8 | UNC `\\localhost\C$\…\review-c2\…` | exit 1, `inside a git working tree`, nothing landed |
| 9 | **CONTROL** — plain folder with a space, outside everything | **exit 0**, bundle + passphrase written |

Both of my round-1 reproductions are dead. Case 8 is worth a note: realpath did
not normalise the UNC spelling back to `C:`, but the `.git`-walk caught it
anyway — the three rules are genuinely belt-and-braces rather than one rule
wearing three hats. Case 9 confirms the guard did not simply refuse everything.

**4. The census counts check — correct, unmodified, and it refuses.**

- **It calls the real thing.** `port.cjs:53` is
  `require('../../../conform/oracle/census.cjs').counts`, aliased `censusCounts`.
  `rebuild/conform/` is absent from the diff, so `census.cjs` is provably
  unmodified — the frozen gate is called, never edited, exactly as C3 asked.
- **It covers the oracle's ten classes.** `GUARDED` = `reads nights dailyLogs
  sessionLog exercises queue earned debuts events waist`, which is the oracle
  counts law's `k` list verbatim. I read `counts()` and confirmed all ten keys
  are returned (plus `sets feed pendingDebuts volume`, which are printed but not
  gated). The five classes I proved unguarded in round 1 — `exercises queue
  earned debuts events` — are all now inside `GUARDED`.
- **A decrease refuses, before the gate, with nothing written.** Verified live
  twice (cases F and H below): `4. COUNTS FAIL`, `SHRANK (source): nights 35->0`,
  `FILES_OUT=NO-DIR`, exit 2. The check runs *ahead* of the oracle step, so a
  shrink stops the port before the gate is even spawned.
- **Gating on decrease rather than the oracle's equality is right, and is
  justified in code.** I confirmed the legitimate movers: `corrections 0->9`,
  `sets 250->246` and `feed 323->311` all move on a clean preimage port, and none
  of the three is in `GUARDED`. An equality rule would have refused every port.
- **Both preimages are checked when merging** — `source -> migrated` *and*
  `local -> migrated` (case F prints both lines). That is more than C3 asked for.

**5. The fixture finding reproduces EXACTLY as described.** I re-derived every
step independently rather than taking the report's word:

| claim | measured |
|---|---|
| `make-synthetic.cjs` builds `sleep.nights` as an OBJECT | OBJECT, 35 keys, `["0","1","2","3"…]` |
| the frozen preimage carries an ARRAY | ARRAY, length 59 |
| merging the synthetic pair drops all 35 nights | `mergeState(...).sleep = {"nights":[]}`, census nights `35 -> 0` |
| `dataLossGuard` cannot see it | `recordCounts.nights` = **0 before and 0 after**; `safe=true, lost=[]` |
| `census counts()` sees it and the port refuses | `nights 35->0`, `COUNTS FAIL`, exit 2, no folder |
| the preimage (array) pair merges cleanly | `nights 59 -> 59`, still an ARRAY |

**Can it affect the REAL ledger? No — and I checked rather than assumed.** The
live ledger is array-shaped, like the frozen preimage. The loss is caused by
`_unionBy` returning `[]` for a non-array input, so it is reachable **only**
through an object-shaped `sleep.nights`, which only `oracle/make-synthetic.cjs`
produces. I proved the array path end to end: an array-shaped merge carried
`nights 59->59` and wrote a bundle. So the report's classification — *a
fixture-shape quirk, not an engine defect on real data* — is **correct**, and
escalating it to the fixture owner without touching `rebuild/conform/` was the
right call for a task whose brief freezes that directory. This is a genuine
catch: the new check found a real bug on its first run, in the fixture that
exists precisely to exercise paths the live one cannot.

**6. `--local` relatedness — every flow behaves.**

| case | result |
|---|---|
| wrong-file local (dates +3y, zero overlap) | exit 2, `LOCAL_UNRELATED`, `in common: 0`, nothing written |
| `--local-inspect`, related file | exit 0, writes nothing, prints `--local-confirm 07d1b850` — which matches the sha256 prefix **I computed independently** |
| `--local-inspect`, wrong file | exit 2, `LOCAL_UNRELATED`, writes nothing |
| merge with **no** `--local-confirm` | exit 2, `CONFIRM FAIL --local-confirm is required`, nothing written |
| merge with **wrong** token (`deadbeef`) | exit 2, `CONFIRM FAIL does not match this file`, nothing written |
| merge with **right** token | passes CONFIRM and merges (`reads 35->36`), then correctly stops at `COUNTS FAIL nights 35->0` — the fixture quirk, not a confirm failure |
| schema lineage (local `v104`, engine `SCHEMA_V 60`) | `lineage=false`, exit 2, nothing written |

Because every synthetic merge now dies on the nights quirk, I checked separately
that the **merge happy path is not dead on real-shaped data**: preimage +
preimage-with-one-extra-read, right token → `COUNTS PASS` (both preimages),
`ORACLE PASS 7/7 × 2`, bundle **written**, `reads 61->62`. The merge path works
on the shape the real ledger actually has.

**7. README — now true, and still Eli15.** Both round-1 falsehoods are gone.
`queue items` no longer appears in the `dataLossGuard` list; the README now
splits the two checks and says exactly which classes each covers, then states
the promise precisely — *"no class of record comes out of the walk smaller than
it went in"* — and immediately disclaims the overclaim it replaced: *"That is
not the same as 'nothing can ever change'"*, naming corrections and minted queue
entries going up and the deduplicated feed going down. The `--out` paragraph no
longer promises the impossible; it explains in plain words that the script
follows junctions and `DOCUME~1` names back to the true folder, and says why.
The `--local` section teaches inspect-then-confirm in two steps, and the **honest
limit** is stated in Joe's terms: it checks *same ledger*, not *same person*,
"because the state carries no name, no account and no device id". Both required
rules survive the rewrite and are still prominent: the owner-ask rule has its own
section before the instructions (*"If you did not say 'run the port now', it does
not run"*), and the never-in-the-cloud rule is line 8 (*"Nothing leaves this PC
on its own. There is no upload, no server, no account."*).

**8. Report honesty — the falsified claim is corrected, not quietly dropped.**
PRIVACY PROOF item 5 now carries the old sentence, states that the independent
reviewer falsified it twice on Windows with a junction and an 8.3 short name,
says the bundle *and the passphrase* landed in the tracked worktree, and states
what replaced it. The fix round is summarised at the top with the four conditions
and what each cost. RESIDUALS now price what the unpinned real blob leaves
unchecked, which is the round-1 gap I said the report under-priced, and add the
`make-synthetic` finding as residual 10. The report volunteers that the `rebuild`
rule will occasionally refuse an innocent folder. I found no new overclaim.

## NEW DEFECT (round 2)

### DEFECT 5 — LOW — `LOCAL_UNRELATED` states a reason that is false when the failure is schema lineage

`relatedness()` fails on either of two conditions — no shared reading, **or**
broken schema lineage — but both refusal messages hardcode the first reason.

**Reproduction (both paths).** A local with 35 readings in common but schema
`v104`:

```
--source …\synthetic-pending-debut.json --local …\local-future-schema.json --local-inspect
   schema 104 (source 54, engine 60)  lineage=false  readings this file has in common with the source: 35
   LOCAL_UNRELATED  This does NOT look like the same ledger: no reading (same date AND same weight) is in both files.
```

The line directly above says **35** readings are in common; the diagnostic says
none is. The non-inspect path is the same shape:

```
   LOCAL_UNRELATED  No reading (same date AND same weight) is in both files, and its schema is not in the source's lineage.
```

— the first clause is still false. The inspect branch (`port.cjs`, the
`opts.inspect` block) hardcodes the string with no conditional at all; the merge
branch appends the lineage clause but leaves the false first clause standing.

**Impact.** Diagnostic only. It fails **closed** — the merge is correctly refused
and nothing is written — and no data is at risk. But `--local-inspect` is the
tool the README tells Joe to reach for when a merge is refused, and in this case
it would send him looking for a date/weight mismatch that does not exist while
the real problem is the file's format number, which is printed two lines up. This
project's own standing rule is that a rule surviving only in copy is still a
rule, because he reads the copy.

**Fix (one line each).** Build the reason from the two booleans rather than
asserting one: report `shared === 0` and `lineage === false` independently, e.g.
`no reading (same date AND same weight) is in both files` when `shared === 0`,
and `its schema (v104) is not in this ledger's lineage (source v54, engine v60)`
when `!lineage`, joining with "and" when both fail. Add a test for the
lineage-only refusal, which the current suite does not distinguish.

## ROUND-1 DEFECTS — STATUS

| # | round-1 defect | status at `fa46aa4` |
|---|---|---|
| 1 | HIGH — `--out` guard bypassable (junction, 8.3) | **CLOSED.** realpath + git-working-tree + `rebuild`-segment rules; my 2 reproductions plus 6 further spellings all refuse; both are executing regression tests (`skipped 0`) |
| 2 | MEDIUM — README claims a protection that does not exist | **CLOSED.** `queue items` removed from the guard's list; absolute claim replaced with a precise one plus an explicit disclaimer |
| 3 | MEDIUM — nothing checks the migrated real state in 5 classes | **CLOSED.** `census.cjs counts()` called unmodified over all ten guarded classes, on source *and* local, refusing any decrease before the gate runs |
| 4 | MEDIUM — `--local` "must refuse" unmet and unstated | **CLOSED.** relatedness + inspect/confirm two-step + lineage rule; the identity limitation is now stated plainly in code, README and report |

## RESIDUALS — round 2

Unchanged and still accurate: 10/10 cannot be executed on a public checkout
(`skipped 0` here is the 7-law public gate; the law count is data-driven, so no
code path differs); the real-run manifest pin will read `no`, now with its
consequence priced; Windows file modes stay advisory; 66 bits of passphrase
entropy; the frozen gate still appends to `run.log`; no phone side until C2b.

Two carried forward that the merge should not lose sight of:

1. **The `rebuild`-segment rule is deliberately over-broad.** It refuses any
   `--out` with a `rebuild` path segment even outside this repo (probe 5). The
   report says so. Cost is one retry with a different folder; correct trade.
2. **`make-synthetic.cjs`'s `sleep.nights` object shape** is a live bug in the
   conformance fixtures, reproduced here in full and confirmed not to reach the
   real ledger. It belongs to whoever owns `rebuild/conform/`, and it should not
   be lost when this branch merges.

**FINAL VERDICT: ACCEPT at fa46aa4**

— independent reviewer, round 2, 2026-09-11
