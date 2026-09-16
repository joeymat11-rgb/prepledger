# P3-PRODUCER-MAPPING - INDEPENDENT REVIEW R3 (Fable FINAL, DECISIONS:439)

VERDICT: ACCEPT. 0 BLOCKING / 2 MAJOR / 3 MINOR / 5 NOTE. Merge needs the one-line docs fix in
MAJOR 1 as its own commit; MAJOR 2 is named for S6, which must land it before this file is sealed
as product. Nothing is weakened, invented or hidden; every bar item and its red side executed.

Author sha a793ca16 on `rebuild/d-p3-mapping` over f7fe44d (unchanged since R1). My detached
worktree `%TEMP%\earned-p3m-rv` (7d6ba60 = a793ca16 + the R1 file), three junctions, cells under
`%TEMP%\p3m-rv\r3\`, `--out` only under `%TEMP%\p3d-out\p3m-rv3\`. SYNTHETIC only (public journey
fixture sealed by the real `port.cjs` through the accepted clean-init constructor, as `support.mjs`
does); no owner file, ledger or private fixture opened, listed or named. No product byte moved;
every mutant restored byte-equal (`Buffer.compare` 0, `git status` clean after each).

## What I proved myself (my cells, not the author's rerun)
- **The production mapping is what qualify() reads.** `rv3-admit.mjs` 7/7: reviewSource ->
  prepareSource -> publish -> reconcile -> view against `createProductionProducerRegistry` only, on
  the SPRING-FORWARD Sunday 2026-03-08 (EDT) and on 2027-01-15 (EST, a day in no calendar row);
  each re-derives `basis.engine_digest` from `productionMapping()` and it is equal, so no harness
  mapping admitted. The mapping id carries `M2-S5-TODAY-CHILD@0df73b01f3d2d935` and no `TEST-ONLY`.
- **No producer id is invented.** `earned/engine-workout-capture/v1` and `/v2` are
  `rebuild/m4/workout/engine-capture.cjs:4` and `:6` (`PROFILE`, `CONFIGURATION_PROFILE`), the two
  ids `source-admission.mjs:143` accepts. Nothing else in the tree names a third.
- **A bundle from another engine refuses, on the tree alone.** RV3-4 copies the engine directory
  under `%TEMP%\p3d-out\p3m-rv3`, adds one comment byte to `merge.cjs` ONLY (shim byte-identical, so
  `sha256` equals the pin and only `treeSha256` and the path move), seals with the real `port.cjs
  --engine`, carries it into custody: review refuses `SOURCE_ENGINE_CONTEXT_UNPROVEN`; control RV3-5
  admits the pinned engine on the same day and path. RV3-3: a mis-derived digest also refuses.
- **The trip-wire trips and is bound to the receipt.** RV3-6: `ENGINE_REVISION` ==
  `M2-S5-TODAY-CHILD@` + sha256(`receipts/S5.json`)[0:16], and that receipt pins
  `rebuild/engine/oracle-shim.cjs` to the same `dd653bc1...c125052d` the mapping pins; `treeSha256`
  recomputed by `Port.engineDigest`. MUTANT receipt (+1 byte): P3-M3 red, EXIT 1, `revision prefix
  does not match sha256(receipts/S5.json)`; restored, sha `0df73b01f3d2d935`.
- **The zone rule, on REAL device zones (no Intl stub).** `rv3-zone.mjs` run with the process TZ
  set, the bundle sealed once in New York (port.cjs's own gate rule) and carried as bytes.
  America/New_York: calendar zone is the device's, 0/68 rows disagree, unit qualify and end-to-end
  review ADMIT. America/Los_Angeles: 68/68 rows disagree, both REFUSE `SOURCE_ENGINE_CONTEXT_UNPROVEN`.
  America/Toronto (New York's exact offsets): 0/68 rows disagree and it STILL refuses, so the refusal
  there is qualify's `cal.zone === gate.tz` clause alone. UTC: refuses. 16/16. Consequence (MINOR
  4): Joe's phone must resolve to America/New_York at admission; `local-source-profile.cjs:79` is
  the law and this mapping cannot and does not soften it.
- **Other mutants** (each red, restored): `ENGINE.treeSha256` last hex -> P3-M1 AND both P3-P1 days
  and P3-P3 red (the end-to-end cells are bound to this file's bytes); producer `/v3` -> P3-M5 red
  only; one row's `noonISO` -> P3-M7/M10/M14 and all three admission cells red; a literal
  `zone: 'America/New_York'` -> P3-M6 red only.
- **Page boundary.** Mapping alone through the accepted `w6/build-browser.mjs` into `.tmp` scratch
  (`rv3-a1.mjs`): 3 inputs (mapping, `local-source-profile.cjs`, `coach/engine-revision.cjs`),
  19,077 B, 0 node_modules, 0 engine inputs; `assertBundleInputs` trips on `rebuild/m4/import/*`
  and NO other FORBIDDEN name; no Node builtin in the output (author: 4 / 20,356 B, same one trip).
- **Drift.** `git diff --name-only f7fe44d a793ca1` = 4 NEW files, +728 / -0 (no assertion, guard
  or law removed); none in `packages/S5.json`; no `rebuild/engine/**`, no `today/**`; CRLF, tabs,
  trailing WS and non-ASCII all 0 in the three source files. `createLocalSourceController` has no
  production caller (grep: harnesses only); `browser-entry.mjs`/`local-client.mjs` import none of it.

## Findings
**MAJOR 1 (carried from R1, unaddressed at a793ca16) - the stop names the wrong line.** Report
sections 3 and 7 and the commit say `today/build.mjs:51`. On this tree `:45` is `const FORBIDDEN`,
`:51` is the `rebuild/authority/*` ban, and `["rebuild/m4/import/*", ...]` is **`:53`**. The
quoted text is right; the number is the one datum handed to P3-IMPORT-UI-2. Docs-only fix.
**MAJOR 2 (new) - the ONE production registry cannot be built from any production injection
point.** `createProductionProducerRegistry({hash, materialDigest})` needs the material digest at
construction, but the controller takes `producerRegistry` at ITS construction
(`source-admission.mjs:31-32`) and computes that digest only later, privately, at `:74`
(`rawMaterial` `:71` + `digest(... 'earned/local-source-material/v1' ...)`). No production module
exports it; the only other derivations are five harness copies (`support.mjs:167`,
`local-source-consumer.test.mjs:148`, `p2-consumer-browser-entry.mjs:42`, `s3/fixtures.mjs:156`,
`S3-R2-ADMISSION-EXTRA.mjs:125`), and the author's P3-P1 reaches it through `support.mjs`. S6's
wiring must therefore duplicate a private derivation in the page (a sixth copy; fails closed if it
drifts, RV3-3, but the wrong shape) or change this API. With R1's MAJOR 2 (brief section 5's
reviewed row unreachable through the same constructor) this is one defect with one fix: bind the
execution row at `qualify()` time from the digest presented, or have the controller surface the
digest; the header already says the material match is not a guard. Fix before S6 seals the file.

**MINOR 3** - the author report carries 11 em/en dashes (31 non-ASCII); the three source files 0.
**MINOR 4** - report section 4's "the zone rule holds wherever the phone is" is false (four-zone
cell): a phone resolved to America/New_York qualifies, anywhere else refuses by law.
P3-IMPORT-UI-2's runbook text must say so.
**MINOR 5** - section 1 says the zone is read "at qualify time"; it is read once in
`executionCalendar()` at construction, then deep-copied and frozen. Fails closed either way.
**NOTE 6** - `mapping.producers` is read by nothing (`qualify` ignores it; `source-admission.mjs:143`
hard-codes the two ids); the `/v3` mutant left admission green: a trip-wire, not a guard.
**NOTE 7** - "never a literal zone" is a text assertion (P3-M6); the literal mutant leaves both
admission suites green in New York, the two spellings being behaviourally identical everywhere.
**NOTE 8** - `b-package --ci --package S5` at this HEAD after `git fetch`: `B_PACKAGE_EXIT=0` but
`FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP`: the chain tip moved to 0986dd8 (DECISIONS:476) after the
author sealed on f7fe44d. Cherry-picked a793ca16 clean onto 0986dd8 in a scratch worktree (296cc28,
removed): `SEAL BASE ON THE TIP ... 0986dd8`, `PRODUCT IMPLEMENTED ... 0 unlisted drift`, `PUBLIC
CI EVIDENCE PASS`, EXIT 0. The integrator rebases before merge.
**NOTE 9** - `P3-RUNBOOK.md` correctly NOT edited: pre-check 6's caveat (:472) lifts only when this
mapping is what the phone uses, i.e. after `today/build.mjs:53` moves in S6.
**NOTE 10** - an `Intl` that resolves no zone yields `zone: undefined` and refuses on `gate.tz`; the
2016-2032 range is a sound judgement; outside it the refusal names no day (R1 MINOR 5 stands). In a
`port.cjs` seal the foreign engine's `path` moves with its tree (RV3-4); P3-M11 isolates the tree.

## Tails (mine, at 7d6ba60; `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`)
`production-mapping.test.cjs` + `production-admission.test.mjs` 21/21 (16 + 5); `rv3-admit.mjs` 7/7;
`rv3-zone.mjs` 4/4 in each of 4 zones = 16/16; `w7-preview/import/test/*.test.mjs` 15/15;
`local-source-consumer.test.mjs` 6/6; m4/import 83/83; W6 586/586 (8,694 ms); today-17 by name
666/666 (54,795 ms); port 65/65; `rig187 => PASS` (exit 0); `b-package --ci --package S5` EXIT 0
both runs, SEAL BASE ON THE TIP only once rebased onto 0986dd8 (NOTE 8). Mutants: receipt,
treeSha256, producer, calendar row, literal zone: 5/5 red, 5/5 restored byte-equal.
