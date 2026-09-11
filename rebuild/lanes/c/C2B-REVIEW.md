# LANE C — C2B INDEPENDENT REVIEW

# VERDICT: ACCEPT WITH CONDITIONS

Reviewer: a second Opus session that did not write C2b. Worktree
`work/lane-c/review-c2b`, detached at `ab52e30` (candidate head of
`rebuild/lane-c-c2b`), base `c90d207`. Node v24.19.0, Windows, PowerShell 5.1,
Edge 152.0.4191.66. `git status --porcelain` was EMPTY before my first command
and empty after my last; nothing was committed, pushed, installed or edited
except this file. Probes and bundles lived under `%TEMP%\c2brev`.

**PRIVACY.** `rebuild/conform/private` does not exist here (`Test-Path` False).
I opened nothing under `ledger/`. Every bundle I attacked was sealed by me from
the PUBLIC frozen preimage `rebuild/conform/fixtures/preimage-2026-08-15.json`.

**Why not a plain ACCEPT.** Every number in C2B-REPORT.md reproduced exactly,
and the seal-compat claim survived a harder attack than the candidate's own
tests apply — including NFKD composed-vs-decomposed, which no C2b test covers
and which I confirmed works in all four directions. But two defects that no
candidate test reaches are real, reproduced, and one of them is an undisclosed
judgement call on the single field that says whether the migration can be
trusted at all. Neither loses data and neither breaks the seal, so this is not
a REJECT; both fixes are small and I have proved the second one safe.

**Why not ACCEPT-as-is with the defects filed as residuals.** Because D1 is the
class of failure CLAUDE.md names as this codebase's dominant defect: research
written down and never enforced in code. The report's own prose lists
`oracle.verdict` among the fields "strictly validated". It is validated for
being a string. A bundle whose own oracle said FAIL is adopted durably and, on
a zero-op phone, becomes the engine state Joe sees.

---

## THE CONDITIONS (specific, executable)

**C1 — gate the oracle verdict, or say out loud that you are not going to.**
In `payloadOf` (`import-bundle.mjs`, the `oracle.verdict` line) EITHER refuse a
payload whose `oracle.verdict !== "PASS"` with its own code
(`BUNDLE_ORACLE_NOT_PASS`, state 3 — not `BUNDLE_PAYLOAD_INVALID`, because the
bundle IS well-formed; it is the migration that is not vouched for), and add a
case that seals a `FAIL` payload with the test's own `reseal()` and asserts the
refusal plus an unmoved revision — OR, if the judgement is that the HOST must
decide and offer Joe the choice, add it to DESIGN NOTES as decision 11 and to
the module header, and change the report sentence that lists `oracle.verdict`
among the strictly-validated fields so it does not read as a check. Either
closes it. Silently accepting is what must not ship. Same paragraph should say
what `dataLoss` is and is not: it is validated as an object and its CONTENTS
are never read, so a bundle that records losses imports without comment.

**C2 — compare the provenance, not just the payload bytes, before reusing a
stranded custody record.** In `keepOriginal`, add
`existing.engineContextJson !== material.engineContextJson` to the mismatch test
that already covers `sourceBytes` and `candidateBytes`. **I proved this is safe
for the legitimate retry**: `custodyMaterial` builds `engineContextJson` from
payload fields only (`createdAt` comes from the payload, never the clock), so
re-opening the SAME bundle produces a byte-identical string — executed, see
WHAT I EXECUTED probe 4, "CONFIRMED SAFE". Add a case that aborts the commit
with bundle A and retries with a bundle B that shares source+migrated bytes but
carries a different `engine.sha256` / `oracle.verdict` / `createdAt`, and
assert the refusal.

**C3 — one line in the report.** Residual 8 says C2b's invariants are proved by
direct assertions instead of a bite. Both defects below are invariants nothing
asserted. Say so when you close them.

---

## WHAT I EXECUTED

**Scope.** `git diff --stat c90d207 HEAD` = exactly six paths:
`rebuild/lanes/c/C2B-REPORT.md`, `rebuild/m3/w6/local/{browser-entry,
import-bundle,local-client}.mjs`, `rebuild/m3/w6/test/local-import{,-browser}`
— 1798 insertions, **1 deletion**. Nothing under `rebuild/m3/setup/port/**`,
`rebuild/engine`, `rebuild/conform`, `rebuild/m4`, `.github`, no lockfile. The
report's "26 added + ONE changed line" in `local-client.mjs` checks out
(25 + 7 = 32 insertions across the two edited files, 1 deletion).

**The one changed line is behaviour-preserving with no import** — executed, not
argued: `importRebaseCode({metadata:{}})` → `null`,
`importRebaseCode(undefined)` → `null`; a booted client with no import reports
`derivedStale=false, derivedCode=null, imports=[], importRebaseRequired=false`,
and one op with no projector still reports `derivedStale=true,
derivedCode=null` — C1's answer unchanged. Corroborated by the pre-existing
suites passing untouched: **C1 `local-client.test.mjs` 21/21**, **host journey
`local-host-journey.test.mjs` 17/17**, both `fail 0 skipped 0`.

| run | result |
|---|---|
| `--test rebuild/m3/w6/test/*.test.mjs` | **tests 489 · pass 489 · fail 0 · skipped 0**, exit 0 |
| `--test .../local-import.test.mjs` | **16 · 16 · 0 · 0**, exit 0 |
| `local-bite.cjs` | all four bites RED, **RESTORED PASS**, exit 0 |
| `build-browser.mjs` | exit 0, `w6.js` `b733c830…3143d`, meta `ffe65850…9b00c` — **byte-identical to the report** |
| `local/build.mjs` | exit 0, **38** / **97** pinned inputs; `local.js` `a0efa488…e5a8`, `host.js` `fbcab642…96c7` |
| `local-import-browser.mjs` (Edge) | **7/7**, exit 0, PBKDF2 600000 in 70 ms |
| `local-browser.mjs` | **8/8** · `local-host-browser.mjs` **6/6** · `browser-check.mjs` **6/6**, all exit 0 |

**The bite hash is mine.** `Get-FileHash -Algorithm SHA256` on
`local-client.mjs` before the bite and after it: both
`3bf8c01d7e2b28fd0fad66ec0b6fd60663ab8b38caa9f222e0d36772c5970899`, and
`git status` empty afterwards — the runner restored what it mutated.

### My own bundle, my own attacks

I sealed a bundle myself: `port.cjs --source
rebuild/conform/fixtures/preimage-2026-08-15.json --out %TEMP%\c2brev\bundle`,
exit 0, `ORACLE PASS frozen 7/7 unfrozen 7/7 scope PUBLIC`, schema 54→60,
sealed bytes 491 512, bundle sha256 `43f9f930…b043`, source
`b5eb62d4…a499`, migrated `de3fa6fc…0795`. Two probe scripts under `%TEMP%`,
**104 assertions, 0 failures**.

**Probe 1 — seal compat and refusal (49/49).**
* Candidate `unsealBundle` vs `unseal.cjs` over the same bytes: payloads
  identical; `source.bytes` === the 157 544-byte fixture on disk;
  `migrated.sha256` reproduced by plain `JSON.stringify`. Also via the DEFAULT
  `globalThis.crypto` path, not only an injected `webcrypto`.
* **Byte flips, 15 of them, all `BUNDLE_AUTH_FAILED`**: salt bytes 0/7/15 (a
  valid-length salt with a flipped byte — the candidate's own tests only change
  salt *length*), IV bytes 0/11, ciphertext body at 0/1/1000/mid/L−17, and the
  **TAG REGION** at L−16 / L−9 / L−1, plus tag truncated by one byte and tag
  removed entirely.
* Six passphrase near-misses (trailing space, leading space, upper-cased, one
  character short, `-`→`_`) — all `BUNDLE_AUTH_FAILED`.
* `aad[1]` re-pointed to a different source hash, and `aad[1]` upper-cased —
  both `BUNDLE_AUTH_FAILED`.

* **NFKD, which no C2b test covers.** The word list is ASCII, so the candidate's
  suite never exercises normalisation at all. I sealed with `port.cjs`'s OWN
  `seal()` using a non-ASCII passphrase in both spellings —
  `café-naïve-über-résumé-ñandú-ångström` composed (U+00E9 …) and its NFD
  decomposition — and opened each with each. **All four combinations open**, and
  both also open under `unseal.cjs`. So the seal side really does NFKD-normalise
  and the two implementations agree on it. The ASCII-folded spelling
  (`cafe-naive-…`) correctly does NOT open: this is NFKD, not ASCII folding.
* **Nine well-sealed bundles with broken payloads**, re-sealed with port.cjs's
  parameters → `BUNDLE_PAYLOAD_INVALID` with the right `field` each time
  (`createdAt`, `engine.sha256`, `engine.schemaV`, `migrated.state` ×2,
  `oracle.verdict`, `dataLoss`, `local`, `source.bytes`). The deliberate
  divergence holds: a payload whose own `source.sha256` disagrees with the AAD
  stays `BUNDLE_AUTH_FAILED`, exactly as `unseal.cjs` decides it.
* The error carries a field NAME and no value; the message carries no hash.

**Probe 2 — import semantics, the two-transaction shape, privacy (55/55).**
* **Fresh client, 0 ops** → `LOCAL_IMPORT_SEEDED`, **exactly one** durable
  revision (1→2, read at the raw store without the factory), `derived` ===
  `migrated.state`, `derivedStale false`, `derivedCode null`, and the whole
  `imports[0]` entry correct field by field (name `port:b5eb62d459d6e58b`,
  schemaV 60, engine `dd653bc1…`, verdict PASS, `opsBasisAtImport
  {0,null}`, `rebasedAt null`). A `weighIn` after it works (`op-dev-phone-A-1`
  — the import consumed no device sequence). Reopened under a WHOLE NEW FACTORY:
  entry identical, custody original byte-identical to the fixture. Same name
  again → `LOCAL_IMPORT_ALREADY_PRESENT`, revision unchanged, still one entry.
* **Ops present** → `LOCAL_IMPORT_REBASE_REQUIRED`. I set the trap the report
  describes: a projector keeping the cache genuinely fresh, asserted
  `derivedStale === false` immediately before the import. After it,
  `derived.value` is **byte-identical to before** and is NOT the migrated state;
  `derivedStale true` / `derivedCode IMPORT_REBASE_REQUIRED`;
  `imports[].rebaseRequired true`; `ops` still 2 — nothing replayed, invented or
  dropped. A `weighIn` after works and does NOT clear the flag.
  `markImportRebased(unknown)` → `LOCAL_IMPORT_UNKNOWN`; on the real name →
  `LOCAL_IMPORT_REBASED`, flag cleared, `rebasedAt` stamped; again →
  `LOCAL_IMPORT_NOT_PENDING`.

* **A well-sealed bundle with a broken payload writes NOTHING** — the brief's
  explicit ask, and a case the candidate suite proves only at the unseal level.
  `importBundle` → `BUNDLE_PAYLOAD_INVALID` / `field: dataLoss`, revision
  unmoved, `imports()` empty, **no custody original staged** (`importOriginal`
  → `IMPORT_CUSTODY_MISSING`), and a good bundle still imports afterwards.
* **The two-transaction shape, under my own injected quota fault.** Commit
  aborts → `imported:false` (`TRANSACTION_WRITE_FAILED`/3), revision unmoved,
  `imports()` empty, `boot().importRebaseRequired false`, `derived` still the
  host's clean init — **nothing is visible as imported**. The custody record IS
  there and is inert: readable by name, pinned to the pre-import checkpoint
  (revision 1). I then moved the checkpoint with a real `weighIn` and retried:
  the retry succeeded, **reused the stranded original byte for byte** (source
  and candidate hashes identical), and the custody checkpoint is still the
  ORIGINAL one — it was reused, not re-staged.
* A DIFFERENT bundle under a taken name → `LOCAL_IMPORT_NAME_TAKEN`, refused
  before staging, first original untouched.
* **Privacy, at the raw IDB records.** Three rows: `"active"`, `"previous"`,
  `["earned/local-import-custody/v1","port:b5eb62d459d6e58b"]`. I serialised all
  three (decoding `Uint8Array`/`ArrayBuffer` to latin1) and searched: the
  passphrase does not appear; no individual passphrase word appears as a word;
  the fixture's first 60 plaintext bytes do not appear — custody is sealed under
  the device key, and the active generation record is encrypted too
  (`host-clean-init` is not findable in it). The passphrase does not appear in a
  success result, a refusal result, or a thrown error's message or stack.

**Probe 4 — is my C2 fix safe?** Executed: after an aborted commit, the stranded
record's `engineContextJson` is byte-identical to what a legitimate retry of the
same bundle builds (`createdAt` is payload-derived, not clock-derived).
**CONFIRMED SAFE.**

**File hashes are mine** (`Get-FileHash`), and all five match C2B-REPORT.md's
table exactly; every file is LF-only (`CR=0`). Listed at the end.

---

## WHERE I DISAGREE

**1. The report presents `oracle.verdict` as strictly validated. It is not.**
The section "THE PAYLOAD SHAPE, CHECKED STRICTLY" lists `oracle.verdict` among
the fields `unsealBundle` "strictly validates", and design note 2 defends the
second failure code on the grounds that the phone must refuse "an encoder that
does not speak the profile". A reader finishes that section believing the
verdict is checked. The code is `typeof payload.oracle.verdict !== "string"`.
That is a type check on the one field that states whether the migration this
bundle carries was ever vouched for. See D1.

**2. Design note 6 says "The bytes are compared before any reuse."** Two of the
four material fields are compared. `engineContextJson` — which carries
`createdAt`, the engine sha, the oracle verdict, `dataLoss` and `census` — is
not, and `localBytes` is not. See D2.

**3. "ONE durable commit" is defended well, and I agree with the defence.** I
had expected to push back on the custody-then-commit split; executing it
changed my mind. The stranded-original state is exactly what
`import-custody.mjs` documents, the retry absorbs it byte for byte, and nothing
is observable as imported in between — I verified all three at the raw store.
The report is right to say so plainly rather than implying a single
transaction. No condition here.

**4. A small mismatch, not a defect.** `durableRevision` means "the revision
this import produced" on the success path and "the current durable revision" on
`LOCAL_IMPORT_ALREADY_PRESENT` — in my probe the repeat reported 3 while the
import had landed at 2. Both readings are defensible ("the revision as of this
answer"), so I am not making it a condition, but a host that treats the field
as "where my import is" will be wrong. One sentence of doc would settle it.

---

## DEFECTS

### D1 — a bundle whose own ORACLE VERDICT is not PASS is adopted durably, and seeds the cache

**Severity: medium.** Not reachable through `port.cjs` today (it seals only
after `ORACLE PASS`), so this is a defensive gap plus an undisclosed judgement
call — not a live data fault. It matters because the verdict is the only field
that says the migration was checked, and because the report's prose implies it
is checked.

**Mechanism.** `import-bundle.mjs`, `payloadOf`:
`if (!object(payload.oracle) || typeof payload.oracle.verdict !== "string")
bad("oracle.verdict");` — type only. Nothing downstream reads the value except
`importEntryFor`, which copies it into `metadata.imports[].oracleVerdict`.
`dataLoss` is the same: `!object(payload.dataLoss)` and nothing reads it.

**Repro (executed, `%TEMP%\c2brev\attack3.mjs`, section H1).** Re-seal the real
payload with `oracle.verdict: "FAIL"` and an extra `dataLoss.__probe`, using
port.cjs's own parameters. On a fresh enrolled, booted, zero-op client:

```
result: {"imported":true,"code":"LOCAL_IMPORT_SEEDED","state":null,
         "name":"port:b5eb62d459d6e58b","durableRevision":2,
         "opsAtImport":0,"rebaseRequired":false}
entry.oracleVerdict = "FAIL"
derived seeded from it? true
```

So the migration the oracle rejected becomes `collections.derived.value` — the
engine state the host renders — with no refusal, no flag and no distinct code.
The only trace is `imports[].oracleVerdict`, which nothing in this repository
reads (grep: no consumer of `imports()` outside C2b's own files and tests).

**Fix:** condition C1.

### D2 — provenance drift: `metadata.imports[]` and the custody record can disagree about the same import

**Severity: low-medium.** Needs an aborted commit AND a re-seal of the same
ledger by a changed engine. Both are ordinary: `port.cjs` is re-runnable, and
the aborted-commit path is one C2b deliberately supports and tests.

**Mechanism.** `keepOriginal` decides reuse on `sourceBytes` and
`candidateBytes` only:

```js
if (!sameBytes(existing.sourceBytes, material.sourceBytes) ||
    !sameBytes(existing.candidateBytes, material.candidateBytes)) fail("LOCAL_IMPORT_NAME_TAKEN", 3);
return "reused";
```

`engineContextJson` is not compared. The custody record is immutable, so the
reused record keeps bundle A's provenance — while `importEntryFor` writes
bundle B's into `metadata.imports[]`. Two durable records of one import then
disagree about which engine did the migration, what its oracle said, and when
it was created. Because the default name is `port:<sourceSha256[0..16]>`, two
seals of the same ledger always collide on the name.

**Repro (executed, `attack3.mjs`, section H2).** Import bundle A with the commit
faulted (quota) → stranded custody. Re-seal the same source and the same
migrated state with a different `engine.sha256`, `oracle.verdict: "SUSPECT"` and
`createdAt: 2030-01-01`. Import it:

```
B result: {"imported":true,"code":"LOCAL_IMPORT_SEEDED","name":"port:b5eb62d459d6e58b"}
metadata.imports[0]: engineSha256=5f05458b3d0a  oracleVerdict=SUSPECT  createdAt=2030-01-01T00:00:00.000Z
custody context    : engine.sha256=dd653bc170d3  oracle.verdict=PASS   createdAt=2026-09-11T05:42:50.475Z
```

**Fix:** condition C2, proved safe for the legitimate retry in probe 4.

---

## RESIDUALS CONFIRMED

I checked each of the report's nine residuals rather than taking them on trust.
All nine are truthfully stated. The four the brief named:

1. **NO PHONE — confirmed.** Every browser run here is Edge 152 (Chromium).
   All four runners print their own `iPhone / iOS Safari acceptance NOT RUN`
   line; none of them passes silently. Safari's IndexedDB and `crypto.subtle`
   remain untouched by any evidence in this lane.
2. **PBKDF2 cost on the iPhone — confirmed unmeasured.** I measured 70 ms for
   600 000 rounds in Edge on this desktop (the report says 69 ms; same order).
   That is a desktop number and the report says so. No iPhone figure exists,
   and nothing here bounds it.
3. **No replay / no projector — confirmed by grep and by execution.** Nothing
   in `rebuild/` references `IMPORT_REBASE_REQUIRED` outside `import-bundle.mjs`
   and C2b's two test files, and nothing calls `importBundle` / `importOriginal`
   / `markImportRebased` outside `browser-entry.mjs`, `local-client.mjs` and the
   tests. So after a rebase-required import the imported base and the ops sit
   side by side and nothing folds them together. I confirmed the consequence
   directly: `derived.value` stays the phone's own cache. The path is CORRECT
   and INCOMPLETE, exactly as residual 4 says.
4. **No UI — confirmed.** `importBundle` takes a byte array and a string. There
   is no file picker, no passphrase prompt, no retry and no rate limit anywhere
   in the tree, and a wrong passphrase is deliberately indistinguishable from a
   corrupt file (I verified both return `BUNDLE_AUTH_FAILED`), so a host cannot
   tell Joe which it was.

Also confirmed: **residual 9 — CI runs no W6 test.** Grepping
`.github/workflows/*.yml` for `w6` finds only `slice-host.yml` installing the
W6 browser-build dependencies. Nothing executes `rebuild/m3/w6/test/*` on
either OS. The runs in the report plus the runs in this review are the entire
gate for this change. **Residual 8 — no C2b bite** is true, and D1 and D2 are
both invariants that no direct assertion covered.

### The two judgement calls

Both are disclosed in DESIGN NOTES, both behave as described, and I agree with
both.

**`markImportRebased(name)` (design note 1, not in the brief).** I tried to
find the cheaper rule the note rejects and could not. I reproduced the trap
myself: a projector that keeps the cache fresh over the phone's own ops leaves
`derivedStale === false` while the cache knows nothing about the PC ledger, so
"stale means rebase outstanding" would report fine over a missing history. The
flag has to be sticky, and nothing the module can read can clear it. Adding a
host acknowledgement is the right call, and the refusals around it are complete
(`LOCAL_IMPORT_UNKNOWN`, `LOCAL_IMPORT_NOT_PENDING`, and it never touches
`derived`). Residual 5 — that the acknowledgement is the host's unverified word
— is the honest way to state the cost.

**`BUNDLE_PAYLOAD_INVALID` as a second code (design note 2).** The reasoning
holds: `unseal.cjs`'s single-code rule protects the key and the tag, and a
passphrase that worked plus bytes that verified is not that situation. I
confirmed the two decoders do NOT diverge where they must agree — a payload
whose `source.sha256` disagrees with the AAD stays `BUNDLE_AUTH_FAILED` on both
sides — and that the field carries a NAME and never a value. The one thing this
note should also have said is what it does NOT check: see D1.

---

## FILES REVIEWED (sha256, my own `Get-FileHash`, LF-only)

| file | sha256 | bytes |
|---|---|---|
| `rebuild/m3/w6/local/import-bundle.mjs` | `62fd9f975a3516b5da4c653215011d1c7f3041dd4445a9a8bce84449752c1aea` | 29636 |
| `rebuild/m3/w6/local/local-client.mjs` | `3bf8c01d7e2b28fd0fad66ec0b6fd60663ab8b38caa9f222e0d36772c5970899` | 26390 |
| `rebuild/m3/w6/local/browser-entry.mjs` | `6bca11b92a30f83cf7076250488a4d36460995e0fcf67b39fd23e9d4458cc739` | 1422 |
| `rebuild/m3/w6/test/local-import.test.mjs` | `b57a8cd99714c7d3a91a6d627ad148bf88235c8cd70c8cc58d5ea6c1a3db060d` | 33461 |
| `rebuild/m3/w6/test/local-import-browser.mjs` | `226f92c1458b6c514b28dc6a30043c039a8d598e565332a3d41260d45f12cab1` | 13762 |
| `rebuild/lanes/c/C2B-REPORT.md` | `79405af4e1fab3f471633cdc0e16ae349c7be5dc1cbe6cc7f9a202e98b19f530` | 29605 |

Also read for context, unmodified: `rebuild/m3/w6/import-custody.mjs`,
`repository.mjs`, `rebuild/m3/setup/port/unseal.cjs` and `port.cjs`,
`rebuild/DECISIONS.md` (the 2026-09-10 ruling — "Joe starts using Earned FRESH
at S2 … the private port (S3) lands underneath later" — which is the rule the
rebase-required path implements), and C1-BRIEF / C1-REPORT / C2-REPORT.

Head at review: `ab52e30414ead56975bb6e4142cebd6439a63d8f`. Tree clean.

---
---

# ROUND 2 — re-review at `f2aed42`

Same reviewer, same worktree, now detached at
`f2aed42febc891b614b75402277a7727e0fb674c` ("read the bundle's own verdicts (D1),
compare custody provenance (D2)"), parent `ab52e30`. `git status --porcelain`
showed only my own untracked `C2B-REVIEW.md` before and after every command.
Nothing committed, pushed or installed. I re-executed everything rather than
reading the diff and believing it.

**Both conditions are closed. I could not break either fix.** One new finding,
described below, is pre-existing, writes nothing, and is not blocking.

## SCOPE — unchanged in kind

`git diff --stat c90d207 HEAD` is the same six paths, still **1 deletion**
(2226 insertions). The round-1 delta `ab52e30..HEAD` touches only
`import-bundle.mjs` (+104/−…), `browser-entry.mjs` (+4/−2),
`local-import.test.mjs` (+171) and the report. **`local-client.mjs` was not
touched this round** — its hash is still
`3bf8c01d7e2b28fd0fad66ec0b6fd60663ab8b38caa9f222e0d36772c5970899`, so round 1's
behaviour-preservation finding for the one changed `boot()` line stands
unaltered, and `local-import-browser.mjs` is byte-unchanged at
`226f92c1…2cab1`.

## RE-EXECUTED

| run | result |
|---|---|
| full W6 suite | **tests 493 · pass 493 · fail 0 · skipped 0**, exit 0 (473 pre-existing + 20) |
| `local-import.test.mjs` | **20 · 20 · 0 · 0**, exit 0 |
| C1 `local-client.test.mjs` | **21/21** · host journey **17/17**, both 0 fail 0 skipped |
| `local-bite.cjs` | four bites RED, **RESTORED PASS**; my own `Get-FileHash` identical before and after |
| `build-browser.mjs` | `w6.js` **still `b733c830…3143d`**, meta `ffe65850…9b00c` — byte-identical |
| `local/build.mjs` | exit 0, 38 / 97 pinned inputs; `local.js` `0bc46e6f…bb42`, `host.js` `c0ff2227…6bf7` (both moved — `import-bundle.mjs` changed, as expected) |
| Edge `local-import-browser.mjs` | **7/7**, exit 0, PBKDF2 600000 in 69 ms |
| Edge `local-browser` / `local-host-browser` / `browser-check` | **8/8**, **6/6**, **6/6**, all exit 0 |

**No regression on the round-1 attack surface.** I re-ran my own round-1 probes
unchanged against `f2aed42`: **attack1 49/49** (15 byte flips incl. the tag
region and salt, six passphrase near-misses, AAD re-pointing, nine broken
payloads, NFKD in all four directions) and **attack2 55/55** (import semantics,
the two-transaction abort, raw-IDB privacy, no passphrase anywhere). Both exit 0.
My round-1 defect probes now refute themselves: H1 → `BUNDLE_NOT_QUALIFIED`,
H2 → refused.

## ATTACKING THE D1 GATE — 37 assertions, 0 failures

**A non-PASS verdict is refused, and NOTHING is written.** Four spellings
(`FAIL`, `SUSPECT`, `pass`, `""`) → `BUNDLE_NOT_QUALIFIED` / `oracle-verdict`.
For every one I asserted, at the raw store and through a fresh client: revision
unmoved, `imports()` empty, and **`importOriginal` → `IMPORT_CUSTODY_MISSING`**
— no custody original is staged either, because the gate runs before the first
`load()`.

**Recorded loss is refused.** `safe:false` → `data-loss-unsafe`; `lost:1` and
`lost:99` → `data-loss-classes`; a one-lower count in each of `reads`, `nights`
and `dailyLogs` → `count-decrease` with `detail` naming the class
(`reads 61->60`); and a class **deleted from `after` entirely** → `count-decrease`
`reads 61->0`, i.e. the missing-key-reads-as-0 rule really does fire. Revision
unmoved and nothing staged in all eleven cases.

**Malformed `dataLoss` is a profile problem, not a qualification one** — and the
split is right. Nine variants (`safe` missing / `"true"` / `1`, `lost` missing /
1.5 / −1, `before` missing, `after` missing, `{}`) all return
`BUNDLE_PAYLOAD_INVALID` / `field: dataLoss`, never `BUNDLE_NOT_QUALIFIED`. A
bundle that cannot be judged is refused as unreadable rather than as failing.

**The gate genuinely runs LAST.** This was the sharpest thing to check, because a
gate that ran early would turn a forged file into a helpful oracle. Four
combinations, each an unqualified payload plus one integrity fault:
a flipped ciphertext byte → `BUNDLE_AUTH_FAILED`; a wrong passphrase →
`BUNDLE_AUTH_FAILED`; a broken `migrated.sha256` → `BUNDLE_PAYLOAD_INVALID` /
`migrated.state`; a payload/AAD source mismatch → `BUNDLE_AUTH_FAILED`. **Not one
of them leaks `NOT_QUALIFIED`.** Integrity first, every time.

**`allowUnqualified` cannot become a way in.** It returns the payload with
`qualification = {code:"BUNDLE_NOT_QUALIFIED", state:3, reason:"oracle-verdict",
detail:"FAIL"}` instead of throwing — and writes nothing, because `unsealBundle`
touches no storage at all; I asserted the revision and `imports()` either side
anyway. The default (no flag) still throws. **`importBundle` never passes the
flag and cannot be talked into it**: the same `FAIL` bundle through the client is
`BUNDLE_NOT_QUALIFIED` with the revision unmoved. A qualifying bundle under the
flag has `qualification === null`.

**`detail` names a class and two counts, never a value.** `"reads 61->60"`
matches `^[A-Za-z0-9_.]+ \d+->\d+$` and does not occur anywhere in the ledger
source text.

**The legitimate path is untouched.** The real `port.cjs` bundle I sealed myself
still imports (`LOCAL_IMPORT_SEEDED`, one revision), still seeds `derived` with
the migrated state, and a `weighIn` after it still works. `qualifyBundle(REF)`
is `null` on the real payload (`safe:true, lost:0`, 11 classes each side), and
the Edge runner's 7/7 confirms the same end to end in a real browser.

## ATTACKING THE D2 FIX — 22 assertions, 0 failures

**The round-1 defect is gone.** With A's commit faulted and its custody record
stranded, a bundle B that is identical except for `engine.sha256` and
`createdAt` — and which still qualifies — is now
**`LOCAL_IMPORT_NAME_TAKEN`**, revision unmoved, `imports()` empty, and the
stranded record's provenance unchanged (`engine=dd653bc170d3`,
`createdAt=2026-09-11T05:42:50.475Z`). A bundle differing only in `census`
(inside `engineContextJson`, and never gated) is caught too.

**And the legitimate retry still works, byte for byte.** After moving the
checkpoint with a real `weighIn`, re-importing A succeeds, reuses the stranded
record (source and candidate hashes identical, `checkpointRevision` still the
original — reused, not re-staged), its provenance is identical, and
`metadata.imports[]` and the custody record now **agree** on engine sha, oracle
verdict and `createdAt`. That is exactly the pairing D2 asked for: the false
reuse closed without breaking the true one.

**`localBytes` is material, and it is compared.** A bundle carrying `--local`
imports; `importOriginal` returns the local file byte-identical and
`context.local.sha256` is in the provenance. A second bundle with the *same*
source and candidate but a *different* local file is `LOCAL_IMPORT_NAME_TAKEN`,
nothing written, A's local file untouched — the null-vs-non-null case too. Under
an explicit name it imports cleanly with its own local file.

## R2-1 — NEW FINDING, NOT BLOCKING: two seals of one ledger collide as `ALREADY_PRESENT`

The coordinator asked whether two `--local` merges of the same source can
collide under one name. **They can, and the answer is not the one the D2 fix
gives.** This is pre-existing (identical at `ab52e30`), writes nothing and loses
nothing, so it is recorded rather than blocking.

**Mechanism.** `runImport` checks the committed entry *before* `keepOriginal`:

```js
const already = importEntries(snapshot.generation).find(e => e.name === chosen);
if (already) {
  if (already.sourceSha256 !== opened.payload.source.sha256) … NAME_TAKEN
  return existingResult(already, snapshot.revision);   // ALREADY_PRESENT
}
```

The default name is `port:<sourceSha256[0..16]>` and the comparison is on
`sourceSha256` only. `migratedSha256` is recorded on the entry but never
consulted. So a second seal of the *same ledger file* producing a *different
migration* never reaches the hardened `keepOriginal` at all.

**Repro (executed, `%TEMP%\c2brev\attack7.mjs`).** Bundle B = the same
`ledger/state.json` re-ported **with `--local`** (a documented flag whose whole
purpose is this: `port.cjs:422` passes `localBytes` into `prepare`, so the
candidate is richer while the source file is unchanged). B qualifies on its own
(`qualifyBundle(B) === null`).

```
source.sha256 A === B ? true
migrated.sha256 A  = de3fa6fcbd1dfa9f
migrated.sha256 B  = 70e5f6fcd9d8674a   (DIFFERENT migration of the SAME file)
default name A === B ? true  -> port:b5eb62d459d6e58b
B -> {"imported":false,"code":"LOCAL_IMPORT_ALREADY_PRESENT",...}
revision 2 -> 2   entries=1
the stored entry still describes A: migratedSha256=de3fa6fcbd1dfa9f
```

Joe's merged phone history is silently not adopted, under the reassuring code.

**Why it is not blocking.** Nothing is written (revision unmoved, one entry, A's
custody intact); nothing is lost; A's import stands; the workaround is an
explicit `name`, and the module already supports it. It is a silent *skip*, not
a silent *overwrite*. It predates this round and is not something the fixes
introduced or made worse.

**Why it is on the record anyway.** The report's new design note 6 says "two
seals of the SAME ledger always collide on the name, so this is ordinary rather
than exotic" — true, and the fix handles that collision only on the
stranded-custody path. On the ordinary path (A committed) the same collision
answers `ALREADY_PRESENT`. The report does not claim otherwise — the
idempotency paragraph states plainly that "the recorded `sourceSha256` decides"
— but the two paths now disagree about what a second seal of one ledger means,
and nobody reading design note 6 would guess that.

**Suggested follow-up (not a condition):** in the `already` branch, compare
`already.migratedSha256` as well and answer `LOCAL_IMPORT_NAME_TAKEN` when it
differs, so the committed path matches the custody path. That is the same
one-line shape as the D2 fix and would make "this is a different migration of
the same ledger" say so.

## REPORT HONESTY — ROUND 2

Checked line by line against what the code now does. It is honest, and
unusually so in three places:

* The "strictly validated" sentence is **corrected in place** to say SHAPE, with
  a paragraph naming what the blur cost, rather than quietly deleted. Design
  note 6 is corrected the same way. Both name the review as the finder.
* **Residual 10 is new and volunteers a gap in its own favour's opposite
  direction**: NFKD is implemented and this suite still cannot cover it, because
  the word list is ASCII — so the evidence lives only in my review file, and
  nothing here would go red if the normalisation were dropped. That is exactly
  right, and it is the kind of thing a report usually omits.
* **Residual 11** states the gate's real limit: it reads what the bundle claims
  about itself and cannot tell whether the claimed `PASS` was earned; the tag
  only proves the claim was not edited after sealing. No overclaiming.
* Design note 12 adopts my round-1 `durableRevision` observation and says the
  field can be read the other way "because the review read it the other way".

Numbers I verified independently: 493/493, 20/20, the 473 unchanged, 38/97
pinned inputs, `w6.js` byte-identical, and the `port.cjs` line references
(`:422` local merge, `:440` seal guard, `:497` dataLoss shape) are real.

## FILES REVIEWED AT `f2aed42` (sha256, my own `Get-FileHash`)

| file | sha256 | bytes | |
|---|---|---|---|
| `rebuild/m3/w6/local/import-bundle.mjs` | `6c3cf6ed630bc5f38ad3cef12c901408fe0d0f05267659b7440d4ab7f48ae24e` | 35734 | CR=0 |
| `rebuild/m3/w6/local/local-client.mjs` | `3bf8c01d7e2b28fd0fad66ec0b6fd60663ab8b38caa9f222e0d36772c5970899` | 26390 | CR=0 (unchanged) |
| `rebuild/m3/w6/local/browser-entry.mjs` | `c672a3302ed71cf70ab60f9018173186e0208bfe9757113cc66918919e41b145` | 1465 | CR=0 |
| `rebuild/m3/w6/test/local-import.test.mjs` | `0ffe0740baf2710b8c2ae75fa5f59af3affbef1aca91436c0609af309a670a48` | 43501 | CR=0 |
| `rebuild/m3/w6/test/local-import-browser.mjs` | `226f92c1458b6c514b28dc6a30043c039a8d598e565332a3d41260d45f12cab1` | 13762 | CR=0 (unchanged) |
| `rebuild/lanes/c/C2B-REPORT.md` | `8fe3b16c4dbcbd6bfeae0bd4626b08d8ef60d5bae5957c7be087216f27bc78c4` | 40917 | CR=0 |

All six match the report's own updated table. Every file is LF-only.

## RESIDUALS — STILL TRUE AT `f2aed42`

No phone (all evidence Chromium/Edge 152; every runner prints its own NOT RUN
line). PBKDF2 on an iPhone still unmeasured — 69 ms is a desktop number. No
projector and no consumer of `imports()` anywhere in the tree, so a
rebase-required import remains correct and incomplete. No UI. CI still runs no
W6 test on either OS, so this review plus the builder's runs remain the entire
gate. Residual 10 (NFKD uncovered by the suite) and residual 11 (the gate reads
claims, it cannot verify them) are new, accurate, and volunteered.

## VERDICT

Both round-1 conditions are met and independently verified by execution, not by
reading the diff. D1 is closed with a gate that refuses before the first
`load()`, runs after every integrity check, names a reason without leaking a
value, and keeps an explicit, fail-closed inspection path. D2 is closed by
comparing all four material fields, with the legitimate retry proved still
byte-for-byte. 59 round-2 attack assertions passed with none failing against the
fixes, plus 104 round-1 assertions re-run clean. The report corrects its own two
overstatements in place and adds two residuals against its own interest.

R2-1 is recorded as a follow-up, not a condition: it writes nothing, loses
nothing, predates this round, and has a supported workaround.

**FINAL VERDICT: ACCEPT at f2aed42**

---

## DELTA `50bb7bf` — R2-1 closed

Re-checked at `50bb7bf912793b14bfe0bf7c1af9a93a71554b7c` ("R2-1 — 'same source'
is not 'same bundle'"), parent `f2aed42`. `git diff f2aed42 50bb7bf` is four
paths — `import-bundle.mjs` (+44/−…), `browser-entry.mjs` (+3/−1),
`local-import.test.mjs` (+125) and the report; `local-client.mjs` and
`local-import-browser.mjs` are untouched again (`local-client.mjs` still
`3bf8c01d…0899`). `git status` showed only my own untracked review file
throughout. Nothing committed, pushed or installed.

**The fix.** `sameImport(entry, payload)` replaces the bare `sourceSha256`
comparison in the committed-entry branch, over a seven-field identity
(`sourceSha256`, `migratedSha256`, `engineSha256`, `createdAt`, `oracleVerdict`,
`schemaV`, `localSha256`) — the same ground `keepOriginal` already covers
through `engineContextJson`, so the committed path and the custody path now
agree about what "a different bundle" means instead of disagreeing at the two
ends of one import. `localSha256` is newly recorded on the entry, and
`importSummaries` reports it, so a host can see that a merged port landed.

**Re-executed:** full W6 suite **495/495 · fail 0 · skipped 0** (473 pre-existing
+ 22), `local-import.test.mjs` **22/22**, C1 **21/21**, `local-bite.cjs` four
bites RED and **RESTORED PASS** with the source hash unchanged either side,
`build-browser.mjs` `w6.js` still byte-identical `b733c830…3143d`.

**My R2-1 probe now refutes itself — 27/27 assertions, 0 failures.** The same
`--local` re-port that returned `LOCAL_IMPORT_ALREADY_PRESENT` at `f2aed42`
(same source hash, same derived name `port:b5eb62d459d6e58b`, qualifying on its
own, so the D1 gate is not what stops it) is now **`LOCAL_IMPORT_NAME_TAKEN`**,
naming the taken name, with the revision unmoved, one entry still describing A,
and A's custody candidate untouched. The **same** bundle offered again is still
the reassuring `LOCAL_IMPORT_ALREADY_PRESENT`, also with no write — the no-op
that should stay a no-op did. Under an explicit name the merged bundle imports
cleanly and `imports()` reports its `localSha256`.

**The compatibility case the coordinator asked about holds.** I built an entry
in the exact shape `importEntryFor` produced at `ab52e30`/`f2aed42` — with **no
`localSha256` key at all** — and asserted it directly against the exported
helper: `sameImport(oldEntry, nonLocalPayload) === true`. The `?? null` on the
entry side is what does it, and `importIdentityOf(nonLocalPayload).localSha256`
is `null`, so absent and null meet. `sameImport(oldEntry, localPayload)` is
correctly `false`. I also confirmed every one of the seven identity fields is
load-bearing (flipping each gives `false`), that `importedAt` is deliberately
NOT part of identity — it records when *this phone* adopted it, not which bundle
it is — and that a missing entry is not the same import.

**No regression anywhere.** My earlier probes re-run unchanged at `50bb7bf`:
attack1 **49/49**, attack2 **55/55**, and the round-2 suite now **61/61** —
the two assertions that previously surfaced R2-1 (a different `--local` merge
and a no-local bundle colliding on the default name) now pass, which is the same
fix confirmed from the other direction.

**One conservative edge, not a defect.** A `--local` bundle imported by the
*old* code leaves an entry with no `localSha256`; re-offering that same bundle
now reads as a different import and is refused `LOCAL_IMPORT_NAME_TAKEN` rather
than `ALREADY_PRESENT`. It is a refusal with no write, in the safe direction,
and no installation anywhere holds such an entry — nothing has shipped. Worth a
sentence only because it is the one asymmetry the `?? null` compatibility does
not cover.

**Files at `50bb7bf`** (my own `Get-FileHash`, all LF-only):
`import-bundle.mjs` `5db842a96a94db7df91b4eaec28c82522e4aa50edc1d3b19607bf1200b4d2b54` (37665) ·
`browser-entry.mjs` `3b0d4d02abaca46989f3347d5982d3343efa1a2833ba603ee84c3487ad0c9c87` (1497) ·
`local-import.test.mjs` `f7ea519ac46b19a4b58792ac69515f076f3ceeb20365b7bccd28ebb36ab2ac95` (50121) ·
`local-client.mjs` `3bf8c01d…0899` and `local-import-browser.mjs` `226f92c1…2cab1` unchanged ·
`C2B-REPORT.md` `d6a84f2e45de83f19c5656fb7b0565b24773a7a658ee89183d1683ed07f9bacf` (44684).

R2-1 was raised as a follow-up rather than a condition and was closed anyway,
with the identity made explicit and exported rather than patched in place. Every
residual recorded above still stands: no phone, PBKDF2 unmeasured on iOS, no
projector, no UI, no W6 test in CI, NFKD uncovered by the suite, and the gate
reads claims it cannot verify.

**FINAL VERDICT: ACCEPT at 50bb7bf**
