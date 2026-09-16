# P3-PRODUCER-MAPPING - INDEPENDENT REVIEW R1 (Opus high)

VERDICT: ACCEPT. 0 BLOCKING / 2 MAJOR / 3 MINOR / 4 NOTE.

Author sha a793ca16 on `rebuild/d-p3-mapping`, reviewed in my own detached worktree at that sha
(three junctions), my cells under `%TEMP%\p3m-rv\`, `--out` only under `%TEMP%\p3d-out\`. SYNTHETIC
only: bundles sealed by the real `port.cjs` from the public journey fixture through the accepted
clean-init constructor, as `w7-preview/import/test/support.mjs` does; no owner file, ledger or
private fixture opened, listed or named. I moved no product byte; every mutant was restored
byte-equal and `git status` was clean after each.

## Reproduced independently, not by rerunning the author's cells
- **Engine identity.** `sha256` recomputed from `rebuild/engine/oracle-shim.cjs` bytes, `treeSha256`
  by re-implementing `port.cjs:222` by hand over the 18 engine `.cjs`: `dd653bc1...c125052d` /
  `af5a187e...2353f967`, equal to the pins; `schemaV 60`, `path` and the four-field set are exactly
  `port.cjs:714`'s.
- **Trip-wire.** `sha256(receipts/S5.json)` = `0df73b01...d242` (14683 B); prefix and `packageId`
  equal the coach constant. MUTANT: receipt edited -> P3-M3 **EXIT 1**, `revision prefix does not
  match sha256(receipts/S5.json)`; restored (`Buffer.compare` 0), 16/16 green.
- **Producer ids.** `earned/engine-workout-capture/v1` and `/v2` are `engine-capture.cjs` `PROFILE`
  / `CONFIGURATION_PROFILE`, read from the tree. None invented.
- **Calendar, zone-independently.** With `TZ=UTC` I derived every America/New_York noon and offset
  through `Intl.formatToParts` and scanned all 6210 days of the range: 34 transitions, 68 boundary
  days expected, 68 pinned, **0 mismatch, 0 missing, 0 extra**.
- **What `qualify()` reads.** `dependencies.drafts === 'default-empty'` is the one input
  `engine-provider.cjs:40` honours, every other provider root stays unavailable; the TEST-ONLY
  mapping at `support.mjs:207` pins no engine and writes a literal zone, so this one is stronger.
- **Page boundary.** Mapping alone through the accepted bundler: **4 inputs**, 20,378 B, **0
  node_modules**, input law trips on **`rebuild/m4/import/*` only**, no Node import anywhere.
- **The wiring stop is real.** `createLocalSourceController` has no production caller (all are
  `w6/test`, `w7-preview/import/test`, `m4/import/test`, `lanes/astra/reviews`). Shipped page graph:
  **121 inputs, 1,660,910 B**, law PASS, `browser-entry.mjs` OUT, `source-admission.mjs` OUT,
  `local-client.mjs` IN, `rebuild/m4/import/` **0** inputs.
- **My own cells** (real fake-indexeddb stores, production mapping, two days the author did not use):
  RV1 the fall-back day 2026-11-01 EST admits; RV2 2026-10-31 EDT admits; both re-derive
  `basis.engine_digest` from `production-mapping.cjs`. RV3: two entries make admission ambiguous
  (refuse), not permissive. 3/3.
- **Mutants on the mapping** (red, then restored; final sha `d3fe7472...4e5ca`): `ENGINE.sha256` ->
  P3-M1/M2/M10 red AND summer + winter + P3-P3 red; `ENGINE.treeSha256` -> same; one calendar row's
  offset -> P3-M7/M10/M14 red AND all three admission cells red; a third producer -> P3-M5 red; a
  literal zone -> P3-M6 red. The end-to-end cells are bound to this file's bytes.
- **Drift.** `git diff --name-only f7fe44d HEAD` = the 4 new files, **728 insertions, 0 deletions**,
  so no assertion, guard or law was removed or relaxed anywhere; each `findstr`'d against
  `packages/S5.json`, no hit, all undeclared as :475 (3)/(5) intends. No engine byte, no `today/**`
  byte, no declared S5 file. LF only, 0 CRLF/tabs/trailing-WS/non-ASCII in the three source files.

## Findings

**MAJOR 1 - the report and the commit message name the WRONG line for the stop.** Both say
`rebuild/m3/w7-preview/today/build.mjs:51`. On this tree 45 is `const FORBIDDEN`, 51 is the
`rebuild/authority/*` entry, 52 is `rebuild/m3/w5/crypto.cjs`, and `["rebuild/m4/import/*", ...]` is
**line 53**. The ticket asked for exactly the line and it is the one datum the stop hands to
P3-IMPORT-UI-2. The quoted text is right, only the number is wrong: report text only, but fix it or
the S6 author edits the authority ban.

**MAJOR 2 - the production entry point cannot express the brief's reviewed execution row.** The
brief section 5 splits the mapping: the skeleton is sealed now and "the execution row is one short
reviewed addition made the day port.cjs writes the file".
`createProductionProducerRegistry({hash, materialDigest})` instead MINTS the row from whatever
digest the caller presents, so `qualify`'s `material_digest` clause is satisfied by construction for
any bundle; the only override is `executionId`, never the digest or a reviewed set of rows. The
author states this in the module header and report section 2 and no guard is weakened (the material
is proved by the seal and by `source-admission.mjs:73`; engine, gate and calendar all bite) - but the
brief's design is unreachable through the shipped API. S6 should add a `reviewedExecutions`
parameter or record the departure from the brief by name.

**MINOR 3** - report section 4's bar row reads "the zone rule holds wherever the phone is". It does
not: `qualify` requires `cal.zone === mapping.gate.tz === 'America/New_York'`, so a phone in any
other zone refuses - which is what P3-M15 proves and what section 2 says correctly.

**MINOR 4** - the field table says the zone is read "at qualify time". It is read once in
`executionCalendar()` when the registry is CONSTRUCTED, then deep-copied and frozen. Behaviour is
unchanged and fails closed either way; the sentence is wrong.

**MINOR 5** - section 7 (4) says a day outside the range "refuses at the reached operation naming
that day". `clockAt` raises a bare `SOURCE_ENGINE_CONTEXT_UNPROVEN` with no day in it and replay
names the `op_id`, never the date. Right behaviour, overstated sentence.

**NOTE 6** - `public_factory_digest` and `source_pins` are imported from `local-source-profile.cjs`,
the module that checks them, so those two `qualify()` clauses can never fail ("by identity, not by
copy"). Backstopped by P3-M1 + P3-M2, by `treeSha256` covering all 18 engine modules, and by the
standing `S3-PROVIDER-ENGINE-PINS` cell; not evidence in itself.

**NOTE 7** - nothing reads `mapping.producers`: `qualify()` ignores it and `source-admission.mjs`
hard-codes the same two ids in `resolveCapturedLayout`. My third-producer mutant left admission
green and killed only P3-M5. A real trip-wire on the capture profiles, not a guard.

**NOTE 8** - "never a literal zone" is enforced by a source-text assertion in P3-M6: my literal-zone
mutant left BOTH admission suites green on a New York device, because the two spellings are
behaviourally identical wherever the device is. The form asked for was delivered; the guard is
textual, not behavioural, and S6 should know it.

**NOTE 9** - `P3-RUNBOOK.md` correctly NOT edited: pre-check 6's caveat (:472) stands until this mapping is what the phone uses, i.e. after the `build.mjs` line in MAJOR 1.

## Tails (mine, at a793ca16, `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`)
`production-mapping.test.cjs` 16/16 · `production-admission.test.mjs` 5/5 · m4/import 83/83 ·
w7-preview/import 15/15 · `local-source-consumer` 6/6 · W6 586/586 (8,745 ms) · today-17 (the
runner's 17 files by name) 666/666 (55,682 ms) · port 65/65 · `rig187 => PASS` · my own
`rv-admit.mjs` 3/3 · `b-package.cjs --ci --package S5` **`B_PACKAGE_EXIT=0`**, `PRODUCT
IMPLEMENTED ... 0 unlisted drift`, `SEAL BASE ON THE TIP ... f7fe44d`, `PUBLIC CI EVIDENCE PASS`.
