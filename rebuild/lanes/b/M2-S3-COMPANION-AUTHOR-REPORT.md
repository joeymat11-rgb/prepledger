# AUTHOR REPORT - M2-S3-COMPANION (builder, Lane B, engine tier)

Branch `rebuild/b-s3-companion`, worktree `/home/claude/wt-p1`, base `2ae28401` (= `origin/rebuild/t2-client-core`),
Node v22.22.2, `TZ=America/New_York MEASURED_TEST_NOW=2026-09-03` on every run. Not pushed. Every command below
was executed; every tail is verbatim (truncated only at the right margin where marked `...`).

## 0. The one environmental fact that shapes this report

This sandbox has **no `node_modules` and cannot install any**: `npm ci` gets `403 Forbidden` from
`registry.npmjs.org` (the host is on the proxy's no-proxy list and the direct route is policy-denied),
`pnpm install --offline` finds an empty store, and `registry.yarnpkg.com`, `cdn.jsdelivr.net`, `npm.jsr.io`,
`codeload.github.com` are all `403` at the proxy. So `esbuild@0.28.1`, `jsdom`, `fake-indexeddb`,
`@noble/hashes` and `yaml` are absent, and everything that needs them cannot execute here:

* `b-package.cjs` (both modes) stops at `Reference.create` -> `BLOCKED BASELINE-ESBUILD-MISSING`, exit 2,
  **for H3 on the untouched tree as well as for S3**. Everything before that point (spec, parent, envelope,
  pins, product, fidelity, authority) executes and is quoted below; everything after it (the 45 laws, the
  children as spawned by the runner, coverage/supersession admission, the 19 gates) does not.
* Today (8 of 13 files), W6 (fake-indexeddb / noble), A0 `journey.test.mjs`, coach (4 files), PWA suite (esbuild, yaml),
  W0 public oracle, A1 TODAY BUILD, A5 PWA BUILD: red at module load on `ERR_MODULE_NOT_FOUND`, identically
  before and after (section 6).

Nothing was faked around this. The PM's PC has the pinned installs and Node 24; the exact commands are in
section 7. The user's PC is connected to this session but no folder is attached; I did not reach into it.

## 1. Product diff (file:line)

| File | Hunks | Change |
| --- | --- | --- |
| `rebuild/engine/merge.cjs` | :4-15 signature + seam comment; :87 `_corrOf`; :172 `_fileCorr` (at validity); :188 `_fileCorr` (`new nativeDate(nativeDate.parse(latest9) + 1).toISOString()`); :526 `_richerSession` 3:2 rule (the site the proposal calls `_mergeSession(c.at)`); :576 `_adjInstant` | `createMerge(E, { clock, nativeDate = Date })`; five parse sites + one constructor routed; nothing else. `git show 2ae28401:rebuild/engine/merge.cjs` + the 6-row carrier list in `s3-supersede-source-carriers.test.cjs` == HEAD byte for byte (S3/SUP-1), and the inverse (S3/SUP-2). |
| `rebuild/engine/today.cjs` | :62-86 `_sessionPool` + `sessionMembership`; :94 `const pool = _sessionPool(s, dt);`; :654 export | pool extracted verbatim; reader added; `genSession` byte-identical to the parent (S3/GD-1, 72 cells) and HEAD-minus-hunk == sourceBase (S3/GD-3). |
| `rebuild/m4/workout/engine-runtime.cjs` | :4; :28-37 comment; :40 EXPOSED; :69 facade | fifth name `sessionMembership`; exports unchanged. |
| `rebuild/m3/w6/host/engine-runtime-host.cjs` | :51-54; :110; :113-114 | the W6 mirror, moved with the runtime as B-NTC moved it (DECISIONS:109); `engine-equivalence.test.cjs` 5/5 here. **This is the one file beyond the proposal's three**; without it A0 and the provider cells go red by their own drift assertions. |
| `rebuild/m3/w6/host/test/journey.test.mjs` | :57-59; :406-417; :422 | runtime + mirror sha pins and the exact five-name EXPOSED list (H3 moved the same lines). |
| `rebuild/m4/workout/test/native-trend-context.test.cjs` | :451-453 | the exact five-name list on both runtimes; 39/39 here. |
| `.github/workflows/rebuild.yml` | :89-98 | the standing cumulative step becomes `--ci --package S3` (ce38aa3 / H3 r3c precedent: the child's gate replaces the parent's). |
| `rebuild/lanes/b/tooling/b-package.cjs` | :124-131 IDS; :220-232 NO_REGISTER_IDS + `/^[HFS][0-9]+$/`; :2199-2235 `parentCarrierGates`; :2244, :2252-2254 derivations; :2293-2297, :2340-2342 `supersededGates`; :2384-2389 COVERED-SET-BOUND; :2418-2420 terminal | `S3` registered; the grandchild reads its parent's `coverage.supersededByCarrier` (section 3). |
| `rebuild/lanes/b/tooling/packages/H3.json` | :45 | `tooling.runnerSha256` re-pinned onto the S3 runner (as H3 re-pinned B-NTC.json). |
| `rebuild/lanes/b/tooling/test/gate-supersession.test.cjs` (+74), `pinned-unchanged-and-ruled-substitutions.test.cjs` (F6), `README.md` (section S3) | | tooling cells and docs. |
| new: `rebuild/m4/workout/test/s3-companion-{merge-native-date,membership,gensession-differential}.test.cjs`, `s3-supersede-{source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate}.test.cjs`, `s3-engine-files-differential.cjs`, `rebuild/lanes/b/tooling/packages/S3.json`, `rebuild/m4/spec/acceptance-s3-companion.json`, `rebuild/m4/spec/review-s3-companion.json` (PENDING), `rebuild/lanes/b/M2-S3-COMPANION-BRIEF.md`, this report | | |

`git diff --stat 2ae28401`: 26 files changed, 3493 insertions(+), 53 deletions(-) (this report included). `git diff --check` clean. LF only.
No UI string touched, so no U+2013/U+2014 question arises. Nothing under `rebuild/conform/private`, `src/history.js`,
`ledger/` or a soak path was read or written. Generated engine bundles: `rebuild/conform/engines/build-engines.mjs`
builds the FROZEN app (fe516c1 / a0009c3) from history, not `rebuild/engine`, so nothing to regenerate; the only
sha lists that pin the three edited files are the sealed artifacts (immutable by design), `journey.test.mjs` (re-pinned)
and B-NTC-era gate programmes the supersession role retires.

## 2. Artifact sha256s

| Artifact | sha256 | bytes |
| --- | --- | --- |
| `rebuild/lanes/b/M2-S3-COMPANION-BRIEF.md` | `dbfeb97fa29ddb0d87b71bc8ce5f387649f4dfe1f075724e0d2f24c2ec2caac8` | 13768 |
| `rebuild/lanes/b/tooling/packages/S3.json` | `7651c3f6dde8b8cd3bdc76be17563e1d0f724d9ab355cdc3a93d7f9c80cfe655` | |
| `rebuild/m4/spec/acceptance-s3-companion.json` | `eebf9f173c68c553045eed939d00b83ecdf425dfab96df4433c3ffa04256cd2c` | 38464 |
| `rebuild/m4/spec/review-s3-companion.json` (PENDING, receipt null) | `5c2811a4eea3ad87b98753128d9f53b9b52c7ab3170aedca9964c8cf4204cb30` | |
| runner `rebuild/lanes/b/tooling/b-package.cjs` | `c8668d797559500496b65cbf796f63ae8d7256e3f310a8445e30d1e3890f8864` (was `4482bb8a...`) | |
| `packages/H3.json` (re-pinned) | `fd9c89548dc26283fa8d3d94ca7047ce6c0bb6e9d36af2e69d56220f19c79c18` (was `6c9eca87...`) | |
| `rebuild/engine/merge.cjs` | `01e9d6e6000fd625b9f50c336c3440fb8f84e61f3e77bce4a9bf93fb8fb63b00` (was `b69dd11f...`) | |
| `rebuild/engine/today.cjs` | `685f6e1e907cd9bba268e5d8f6927120172869febe1c747ffb9bd851aa17c45a` (was `397532ec...`) | |
| `rebuild/m4/workout/engine-runtime.cjs` | `95d0c6757a0e646a0bbd0f6328ccbfd70cba6c5f97f0e1009eb6ae2ccb614f30` (was `c03732e8...`) | |
| `rebuild/m3/w6/host/engine-runtime-host.cjs` | `836a369db3a94f340348fd2db02d6e8cd3ad636a851725518d583cfcbe07f334` (was `e210bfa0...`) | |
| `rebuild/m3/w6/host/test/journey.test.mjs` | `2ac6a7f23bcc079406a1493fe01629b61abc66984c04289dc40fbbec60c20af9` | |
| `rebuild/m4/workout/test/native-trend-context.test.cjs` | `cb4643af81e7a7d6082ba7c2cbd1cb51c4896aa0f82ac69d9274c683659979ab` | |
| `.github/workflows/rebuild.yml` | `60e1b94c291851d07f90dbdd41f88dbcf01418cc4c0d2fc648fe8666066d79f7` | |

The artifact was written by the runner's **own** `proposed()` (the runner source compiled to its main-sequence
delimiter, the house method of `tooling/test/*`), not re-typed: parent H3 `b457b539...`, reviewedCommit
`5f0c3781...`, `coverage.covered []`, `superseded` = the nine H3 retired, `run` = the ten H3 re-ran, 24 execution
pins. The runner's own `envelope()` confirms `ENVELOPE PENDING artifact=eebf9f17...` on the real run (section 4).

## 3. Two things the runner architecture forced, said plainly

**(a) A child of H3 could not declare the supersession at all.** `supersededGates()` derived parent carriers from
`bound.acceptance.coverage.byChild` alone; H3's artifact carries `byChild: {}` (it covered nothing, retired nine,
re-ran ten). Measured before the change: `GATE-SUPERSESSION-CARRIER-IS-NOT-A-PARENT-CARRIER` on all five, and
`supersededGateIds` empty, so `--full` would have re-run the nine byte-identity reconstructions the role exists
to retire - for S3 and for every later package :153 names, all children of H3. Fix: `parentCarrierGates(bound)`
reads the parent's own `coverage.supersededByCarrier` as the second half of the map; a carrier the parent retired
may be retired AGAIN by the child under the child's OWN token line and OWN evidence; the terminal says
"retired by H3's own seal and retired AGAIN here ... not inherited" per carrier; COVERED-SET-BOUND counts the
reclaimed gates on the right; two refusals added by name; a parent sealed by an older runner reads as before.
Two new cells in `gate-supersession.test.cjs`; tooling suite 90/90 (was 88/88). Reviewer: this is a tooling change
and needs the r-review the lane gives every runner change.

**(b) The id is `S3`, not `S3C`.** `spec()` binds `packageId` to `^M2-<ID>-` and derives the artifact path from
the id, so `M2-S3-COMPANION` / `acceptance-s3-companion.json` (the plan's own names) admit exactly `S3`.
`NO_REGISTER_IDS` asserted `/^[HF][0-9]+$/` for non-B ids; the letter S (a slice-plan item, DECISIONS:93's own
class) joins it, with the plan :414 (2) adopts as the cited authority for "no D-id". F6 asserts both.

**(c) The runner sha moved, so H3's sealed artifact no longer recomputes** - `--ci --package H3` and `--full
--package H3` now print `FAIL SEALED-PROFILE-RECOMPUTATION` exit 1 (before: `BLOCKED BASELINE-ESBUILD-MISSING` here;
`PUBLIC CI EVIDENCE PASS` / byte-identity re-verify on the PM's PC). This is exactly what H3 measured and recorded
for B-NTC in BUILD-REPORT-H3 section r3c and DECISIONS:189 ("cannot recompute beside the r10 runner"); the CI
step is replaced by S3's for the same reason. B1/B2/B4/B3/B-LOM specs still pin `4482bb8a...` and re-pin at
their own rebase (their briefs contemplate it, :113 (6)).

## 4. Commands, verbatim tails

### `node rebuild/lanes/b/tooling/b-package.cjs --ci --package S3` (HEAD, this sandbox) - exit 2

```
B PACKAGE S3 SPEC OBSERVED packages/S3.json 7651c3f6dde8b8cd3bdc76be17563e1d0f724d9ab355cdc3a93d7f9c80cfe655; runner c8668d797559500496b65cbf796f63ae8d7256e3f310a8445e30d1e3890f8864 byte-identical on disk and in Git at HEAD; status=PROPOSED; 0 D-ids ; 74 declared product files; 13 declared child(ren), ... 5 byte-identity carrier(s) declared SUPERSEDED under a PM line recorded by sha256 NOT YET CITED — the run will refuse GATE-SUPERSESSION-RULING-NOT-CITED
B PACKAGE S3 PARENT OPTION H3 M2-H3-CLEAN-INIT rebuild/m4/spec/acceptance-h3-clean-init.json b457b539a384d8c72531b880cd771e996c6b231f034a49272e899c1fba61e61f ACCEPTED at 5f0c3781a227e18ffdf8236090fe2499ecd8782b (DECISIONS:187); artifact byte-identical on disk, in Git at that commit and on refs/remotes/origin/rebuild/t2-client-core; ...
B PACKAGE S3 PARENT BOUND H3 rebuild/m4/spec/acceptance-h3-clean-init.json b457b539...; single-parent chain holds — no sibling spec claims it on disk or in Git at HEAD, and no sealed artifact on refs/remotes/origin/rebuild/t2-client-core names it as parent
B PACKAGE S3 POSTFIX M2-S3-COMPANION REVIEW-PENDING mode=--ci
B PACKAGE S3 ENVELOPE PENDING artifact=eebf9f173c68c553045eed939d00b83ecdf425dfab96df4433c3ffa04256cd2c spec=7651c3f6dde8b8cd3bdc76be17563e1d0f724d9ab355cdc3a93d7f9c80cfe655 runner=c8668d797559500496b65cbf796f63ae8d7256e3f310a8445e30d1e3890f8864; independent exact-artifact acceptance required
B PACKAGE S3 PARENT PINS RE-ASSERTED at run time; 1 pin(s) from rebuild/m4/spec/acceptance-h3-clean-init.json plus its 64 product pins through the inventory below, and 1 un-superseded grandparent pin(s) from rebuild/m4/spec/acceptance-b-ntc-native-trend-context.json, byte-identical on disk AND in Git at HEAD; ...
B PACKAGE S3 PRODUCT IMPLEMENTED; 18 at the declared post-image / 0 at the pinned pre-image / 56 carried byte-identical from the parent / 0 declared role "pinned-unchanged" ... / 0 unlisted drift; the inventory covers all 64 parent-pinned product files; 1 declared role "superseded-by-child" over a parent EXECUTION pin, each equal to the parent byte (rebuild/lanes/b/tooling/packages/H3.json)
B PACKAGE S3 FIDELITY OBSERVED; sourceBase 2ae2840 ancestor of HEAD ...; 10 engine/conform/m4-spec/lane-b-tooling file(s) changed since sourceBase, all in the fixed inventory; runner c8668d797559 and spec 7651c3f6dde8 pinned inside the sealed artifact; 16 of 18 PIN_PATHS present in this tree and byte-identical Git vs disk; ...
B PACKAGE S3 AUTHORITY OBSERVED owner DECISIONS:60 and contract DECISIONS:49 present as exact ledger line bytes at the parent receipt base a4ed5ce under their own roles; contract inherited byte-equal from the parent; theme NULL — no PASS word is available; brief acceptance NULL — the obligation stays open; ...
B PACKAGE S3 PROTECTED SURFACES 2 declared by the spec and echoed here, asserted by nothing in this line: ...
B PACKAGE S3 PRIVATE LIVE-TRIGGERED none; a census change on any other declared D-id is a RED stop for a reviewed successor cell, never a golden regeneration
B PACKAGE S3 BLOCKED BASELINE-ESBUILD-MISSING
```

### `node rebuild/lanes/b/tooling/b-package.cjs --full --package S3` - exit 2

Identical lines through `PRIVATE LIVE-TRIGGERED none`, then:
```
B PACKAGE S3 BLOCKED BASELINE-ESBUILD-MISSING
```
The FULL run never reaches `privateOracle()`, so the token this sandbox would otherwise print,
`BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING`, is not reached; `BASELINE-ESBUILD-MISSING` is the earlier member
of the same closed BLOCKED list (legacy-gates.cjs `publicReferences`). On a machine with esbuild 0.28.1 and no
private fixture the expected terminal is `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING`.

### H3, before and after (this sandbox)

```
baseline (2ae28401)  --ci  --package H3 : ... B PACKAGE H3 ENVELOPE AUTHORIZED artifact=b457b539... reviewed at 5f0c3781...; B PACKAGE H3 BLOCKED BASELINE-ESBUILD-MISSING   exit 2
baseline (2ae28401)  --full --package H3: B PACKAGE H3 BLOCKED BASELINE-ESBUILD-MISSING   exit 2
after                --ci  --package H3 : B PACKAGE H3 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld   exit 1
after                --full --package H3: B PACKAGE H3 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld   exit 1
```
Expected: section 3 (c).

### REHEARSAL (throwaway clone, never the evidence)

To prove the spec is right once the PM's lines exist, a `--shared` clone of this branch got a fake
`refs/remotes/origin/rebuild/t2-client-core` = tip + one docs commit appending the three lines drafted in the brief
(section 6), the spec cited them by their own bytes (theme :416, brief :417, token :418 on that ref), the artifact
was recomputed, and:

* `--ci --package S3` there: `AUTHORITY OBSERVED ... theme DECISIONS:416 found in Git on refs/remotes/origin/rebuild/t2-client-core; brief acceptance DECISIONS:417 found ...`, then `BLOCKED BASELINE-ESBUILD-MISSING` (same wall).
* The post-laws half of the runner (`children`, `coverage`, `noRegister`, end-of-run `envelope`) driven directly
  on that clone with the runner's own functions: the 10 executable children spawned by the runner and `OBSERVED;
  exit 0, ... exact declared verdict at line start`; the 3 dependency-blocked children (`h3-cells`, `a0-journeys`,
  `today-suites`) spawned, seen to fail on `Cannot find package 'jsdom' / 'fake-indexeddb' / 'esbuild'`, and
  **marked green by the rehearsal script only** so the admission could run. Result:
  `SUPERSESSIONS 5 byte-identity carrier(s) of H3 SUPERSEDED over 9 gate(s) under DECISIONS:418, located ... BY ITS OWN SHA256 21252b845fb6`;
  five `SUPERSEDED <carrier> <- <gates>; retired by H3's own seal and retired AGAIN here ...` lines;
  `NO-REGISTER OBLIGATION S3 registers no D-id ... 9 of 9 declared child(ren) executing one of this package's own role:"new" product file(s) ran in this process, exit 0 ... 1 required at the seal (13 child(ren) declared in total ...)`;
  `end-of-run envelope key PENDING:...; open obligations 0 (ciBlocking 0)` - i.e. with the real `laws()` and the
  three real suites green, the real run prints one non-blocking `OPEN independent exact-artifact acceptance PENDING`
  and `PUBLIC CI EVIDENCE PASS`, exit 0. Logs: scratchpad `s3-rehearsal-ci.log`, `s3-rehearsal-tail.log`.

### The declared children, spawned directly with their exact argv (HEAD, this sandbox)

```
s3-sup-source-carriers      exit=0  needle "# pass 4" at line start   (RED on the parent bytes: 1 pass / 3 fail)
s3-sup-inherited-carriers   exit=0  "# pass 3"                          (RED on the parent bytes: 1 / 2)
s3-sup-defect-witnesses     exit=0  "# pass 3"                          (RED: 0 / 3)
s3-sup-writers-differential exit=0  "# pass 3"                          (RED: 2 / 1)
s3-sup-second-gate          exit=0  "# pass 3"                          (RED: 2 / 1)
engine-files-differential   exit=0  "ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine file(s) outside this package's declared product, all byte-identical to the parent; 2 named files move and each stands at its declared post-image;"   (RED: exit 1)
s3-merge-native-date        exit=0  "# pass 9"                          (RED: 0 / 9)
s3-membership               exit=0  "# pass 9"                          (RED: 0 / 9)
s3-gensession-differential  exit=0  "# pass 3"                          (RED: 1 / 2)
ntc-provider-cells          exit=0  "# pass 39"
h3-cells                    exit=1  # pass 11 # fail 3   Cannot find package 'jsdom' / 'fake-indexeddb'   (baseline identical)
a0-journeys                 exit=1  # pass 5  # fail 1   Cannot find package 'fake-indexeddb' (journey.test.mjs at load); engine-equivalence.test.cjs 5/5   (baseline identical)
today-suites                exit=1  # pass 11 # fail 16  jsdom / esbuild / fake-indexeddb at load   (baseline identical)
```
"RED on the parent bytes" = the four product files reverted to `2ae28401` in place, the cell run, the files restored.
The `today-suites` needle `# pass 321` is H3's, over eight test files whose bytes are byte-identical to H3's seal
(the parent pins hold at HEAD); it could not be re-measured here and is an open item for the PC.

## 5. The bar (CRITICAL-PATH section 4 P1), item by item

| Item | Result here |
| --- | --- |
| Brief file, sha recorded | DONE - `rebuild/lanes/b/M2-S3-COMPANION-BRIEF.md` `dbfeb97f...` (13768 B); PM acceptance by name and the :135 (2) lines are the PM's (drafted in brief section 6). |
| Closed cumulative profile on H3's artifact, five carriers SUPERSEDED as H3, registered so `--ci/--full --package S3` run | DONE - artifact `eebf9f17...` from the runner's own `proposed()`, parent `b457b539...`, `superseded` = H3's nine; `S3` registered; both modes run and stop only at the environment. `rulingLineSha256` is `null` until the PM's token line exists (documented pre-ruling state; refusal `GATE-SUPERSESSION-RULING-NOT-CITED` by name once esbuild is present). |
| 45/45 laws executed, no new D-id | NOT EXECUTED HERE - `Reference.create` -> `BLOCKED BASELINE-ESBUILD-MISSING` (esbuild 0.28.1 uninstallable). `dIds: []`; the Y1 own-child obligation is met by 9 declared own children (rehearsal line above). PC. |
| `genSession` byte-identical to the parent on ordinary + pending-hack-debut | DONE - S3/GD-1: 6 fixtures x 4 days x 3 sleep readings, `genSession` and `pickStructural` JSON byte-identical to the sourceBase today.cjs compiled privately; S3/SUP-7 and S3/SUP-11 corroborate. |
| Native-vs-injected Date equivalence, 5 sites + constructor, March DST pair, malformed/NaN, +1 ms | DONE - S3/MD-1..9, 9/9; S3/SUP-12 corroborates site reach. |
| Membership vs `genSession(..., recordedFixtureSleep).ex` ids; ordering, retirement, rest-day | DONE - S3/SM-1..9, 9/9. |
| `--ci --package S3` PUBLIC CI EVIDENCE PASS exit 0 in the sandbox | NOT REACHABLE HERE - (i) environment: `BLOCKED BASELINE-ESBUILD-MISSING` exit 2; (ii) even with esbuild, the PM's theme / brief-by-sha / token lines are not on the chain, so the honest outcome is `FAIL GATE-SUPERSESSION-RULING-NOT-CITED` exit 1 until they land, then PASS (rehearsed above). |
| `--full --package S3` honest BLOCKED here; POSTFIX PACKAGE PASS on the PC | `BLOCKED BASELINE-ESBUILD-MISSING` exit 2 here (the earlier BLOCKED member; `REQUIRED-PRIVATE-PREPARATION-MISSING` is what a machine with esbuild and no fixture prints). PC with the private census: the PM's step. |
| H3 `--ci` / `--full` still behave, or explain | EXPLAINED - `FAIL SEALED-PROFILE-RECOMPUTATION` exit 1 both, the runner sha moved; identical to H3's own finding on B-NTC (section 3 (c)); CI step replaced. |
| Existing suites unchanged-green | Executable subset identical before/after (section 6); the rest blocked identically before/after on missing packages. |

## 6. Baseline (untouched 2ae28401) vs after (HEAD), this sandbox

| Suite / command | Baseline | After | Note |
| --- | --- | --- | --- |
| tooling `node --test rebuild/lanes/b/tooling/test/*.test.cjs` | 88/88 | **90/90** | +2 grandchild cells |
| `node rebuild/m3/w0/public-conformance.cjs` | `PUBLIC-CONFORMANCE PASS: 99 reference GREEN; 99 STRONG (141 targeted mutants detected); 70 adapter GREEN; 29 RED-as-specified (policy/progression absent)` exit 0 | identical | |
| `node rebuild/t2/rig187.cjs` | `rig187 => PASS` exit 0 | identical | |
| `node rebuild/m3/w0/scope-package.mjs` / w0 tests | `OLD-PACKAGE PASS`; 10/10 | identical | |
| `ntc-provider-cells` (native-trend-context 39) | 39/39 | 39/39 | with the five-name pin |
| `engine-equivalence.test.cjs` | 5/5 | 5/5 | |
| Today 13 files (`node --test .../today/test/*.test.{mjs,cjs}`) | 68 pass / 20 fail (jsdom, esbuild, fake-indexeddb) | 68 / 20, **same ok/not-ok lines** | 553/553 needs the PC |
| W6 `cd rebuild/m3/w6 && node --test test/*.test.mjs` | 14 / 20 (fake-indexeddb, noble) | 14 / 20 identical | 552/552 needs the PC |
| A0 journey + engine-equivalence | 5 / 1 (journey.test.mjs at load, fake-indexeddb) | 5 / 1 identical | 23/23 needs the PC |
| coach | 152 / 49 (fake-indexeddb) | 152 / 49 identical | 201/201 needs the PC |
| PWA | 36 / 12 (esbuild, yaml) | 36 / 12 identical | 55/55 needs the PC |
| W0 public oracle, A1 TODAY BUILD, A5 PWA BUILD | `Cannot find package 'esbuild'` exit 1 | identical | PC |
| `--ci --package H3` / `--full --package H3` | `BLOCKED BASELINE-ESBUILD-MISSING` exit 2 | `FAIL SEALED-PROFILE-RECOMPUTATION` exit 1 | expected, section 3 (c) |
| H3's own five supersede cells on this tree | 4/3/3/3/3 | source-carriers 3/1 (H3/SUP-3), inherited 2/1 (H3/SUP-5), others green; H3's engine-files differential exit 1 | the parent's byte-identity claims over its own sourceBase, now moved by the child - exactly the class the role names; not S3 children |

## 7. Open items (for the reviewer and the PM)

1. **PM lines** (the PM's alone; drafted verbatim in the brief section 6): THEME, BRIEF ACCEPTED BY SHA
   (`dbfeb97f...`, 13768 bytes), and the token `GATE-SUPERSESSION M2-S3-COMPANION source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate` alone in its own `·` clause on a RULED line.
   Then a three-field spec edit (theme, `brief.acceptedLedgerLine`, `rulingLineSha256`; status `BRIEF-ACCEPTED`),
   artifact regenerated from `proposed()` (the spec sha moves), and a fourth line for the receipt.
2. **On the PC** (Node 24, pinned installs): `node rebuild/lanes/b/tooling/b-package.cjs --ci --package S3`
   (expect `PUBLIC CI EVIDENCE PASS` once item 1 is done; before it, `FAIL GATE-SUPERSESSION-RULING-NOT-CITED`),
   `--full --package S3` with the private census (verdict only), Today 553/553, W6 552/552, A0 23/23, coach 201/201,
   PWA 55/55, public oracle, A1/A5 builds, and the `today-suites` needle `# pass 321` re-measured.
3. **Tooling change** (section 3 (a)/(b)) wants its r-review: `parentCarrierGates`, the `S` letter, the F6 cell.
4. **Fourth file** `rebuild/m3/w6/host/engine-runtime-host.cjs` beyond the proposal's three (the B-NTC precedent);
   the PM may prefer it named in the brief acceptance.
5. `rebuild/m4/spec/b-ntc-profile-refusals.test.cjs` (H3 product, carried) asserts B-NTC's own four-name surface and
   B-NTC.json's engine-runtime post; it is executed by no standing child since H3 retired the B-NTC step, and is red
   on this tree by construction (as it would be for any child re-pinning the runtime). Not edited: it is B-NTC's
   own gate-era cell and editing B-NTC.json's posts was refused by H3 for the same reason.
6. B1/B2/B4/B3/B-LOM specs pin the old runner sha; re-pin at their own rebase.

## 8. Commit

One commit on `rebuild/b-s3-companion` over `2ae28401` (the two WIP commits squashed), author
`cowork (Earned PM) <joeymat11@gmail.com>`, message
`M2-S3-COMPANION: createMerge nativeDate seam, sessionMembership reader, runtime EXPOSED 4->5, closed profile on H3`.
Not pushed (cloud push is 403).

## 9. v1.1 - the P0 HIS NUMBERS disclosed hunk absorbed (PM routing, DECISIONS:117 (4) precedent)

Lane C committed `4eec4738` over `80b54c5d` (`today-entry.mjs`, `test/setup.test.mjs` +5 cells P0.1-P0.5 and the
chain helper, `test/food.test.mjs` one chain-aware cell, `rebuild/m3/w6/test/local-today-journey.test.mjs` PAGE_PINS;
report `rebuild/lanes/c/P0-HIS-NUMBERS-AUTHOR-REPORT.md`). Re-pinned here:

| `packages/S3.json` entry | role | pre | post |
| --- | --- | --- | --- |
| `rebuild/m3/w7-preview/today/test/setup.test.mjs` | edited (H3 product pin) | `e4b797eb...` | `498fcadedc3af11998426000cfaefe2d0dba25733677ba76a9fbedf4a129eb57` |
| `rebuild/m3/w6/test/local-today-journey.test.mjs` | edited (H3 product pin) | `4572517c...` | `99935dee07f30efa86a85c0cad5e0f6e7d8ce295c45e58f09f2e16487e29c78a` |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | new (pinned by no parent, not a child target; declared so the seal pins the hunk, as H3 declared setup.test.mjs) | `b50b9231...` (sourceBase blob) | `ac4cbb74648912ee4a6f8d174bebd1bfef12a38db70dab95ced63d02112267c4` |
| `rebuild/m3/w7-preview/today/test/food.test.mjs` | new (same) | `0d4933f4...` (sourceBase blob) | `6929e7442465693711ddb175d8526d8a9b94f21c97922e55ad3d22b13ddbeb8d` |

The `today-suites` child needle moves `# pass 321` -> `# pass 326` (five new top-level `test(` cells, no subtests;
derived, NOT executed here - jsdom). Brief v1.1 (section 1a) `077ddffaa267b1876ff8f5d345a0c6fb1757a4f6e52a99249e8f280cf092b908`,
17059 bytes; `packages/S3.json` `404118aa0cd6bafe028b88844bac0de8b20626be698b38e9715e1b69f28a164f`; artifact
`rebuild/m4/spec/acceptance-s3-companion.json` `c690846bf9c88980f6d3a16a4434d087b042d9e366a2647a6bb69a9225b12e04`
(38951 B, from the runner's own `proposed()`, `rulingLineSha256` still null). These supersede the section 2 values.

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S3` at this head, exit 2:
```
B PACKAGE S3 ENVELOPE PENDING artifact=c690846bf9c88980f6d3a16a4434d087b042d9e366a2647a6bb69a9225b12e04 spec=404118aa0cd6bafe028b88844bac0de8b20626be698b38e9715e1b69f28a164f runner=c8668d797559500496b65cbf796f63ae8d7256e3f310a8445e30d1e3890f8864; independent exact-artifact acceptance required
B PACKAGE S3 PRODUCT IMPLEMENTED; 22 at the declared post-image / 0 at the pinned pre-image / 54 carried byte-identical from the parent / 0 declared role "pinned-unchanged" ... / 0 unlisted drift; the inventory covers all 64 parent-pinned product files; 1 declared role "superseded-by-child" over a parent EXECUTION pin, each equal to the parent byte (rebuild/lanes/b/tooling/packages/H3.json)
B PACKAGE S3 BLOCKED BASELINE-ESBUILD-MISSING
```
No `UNLISTED-PRODUCT-DRIFT`. Open items added to section 7: the P0 bar items 1-6 (brief section 1a) are the third
reviewer's to reproduce on the PC, and the `# pass 326` needle is to be measured there.

## 10. v1.2 - the P0 hunk WITHDRAWN (DECISIONS:416 (a)); branch rebased onto 47d31806

Owner ruling DECISIONS:416 (a): P0 leaves this package. Lane C's `4eec4738` and the v1.1 commit are dropped from
the branch; the four files (`today-entry.mjs`, `test/setup.test.mjs`, `test/food.test.mjs`,
`rebuild/m3/w6/test/local-today-journey.test.mjs`) stand at their `2ae28401` bytes (verified `git diff --quiet`),
`rebuild/lanes/c/P0-HIS-NUMBERS-AUTHOR-REPORT.md` is not on this branch, `packages/S3.json` carries the v1.0
declarations again (56 carried / 8 edited / 1 superseded-by-child / 9 new; `today-suites` needle `# pass 321`),
and section 9's values are superseded by these. The S3 commit was cherry-picked onto the tip `47d31806`
(docs-only: DECISIONS :415/:416), so the seal-on-tip rule (:145, ancestry) holds; `sourceBase` stays `2ae28401`,
an ancestor of HEAD, and the fidelity scan (engine/conform/m4-spec/tooling) sees no tip change.

Brief v1.2 `138d4627f410810548dc5a5a89c002f599f75bd834d9fc2771fa7688828bbc0f`, 14059 bytes;
`packages/S3.json` `a9d0976a2c09781b4bb96854d610e407cc47c76b496daf745d374d6d927a1d46`;
artifact `rebuild/m4/spec/acceptance-s3-companion.json` `fe5ab7c0d5a9abb40ed4b510d28d814adb02626d5b709cc6895d94bc133da7d7`
(38464 B, from the runner's own `proposed()`; `rulingLineSha256` null; review PENDING). `--ci --package S3` tail on
the v1.2 head is quoted in the reply of record: `PRODUCT IMPLEMENTED; 18 at the declared post-image / 0 at the pinned
pre-image / 56 carried ... / 0 unlisted drift`, then `BLOCKED BASELINE-ESBUILD-MISSING`, exit 2.

## 11. Executed on the PC (DECISIONS:417): the v1.2 build re-written onto `%TEMP%\earned-s3`, gate run there

Re-written by hand through the desktop link onto the PC worktree (branch `rebuild/b-s3-companion` at `f5fe2bf7`,
one ledger line beyond `47d31806`), Node v24, pinned installs, `TZ=America/New_York MEASURED_TEST_NOW=2026-09-03`.
All 26 files of `dc5adc2e` verified sha256-identical on the PC (this report at its pre-section-11 bytes); `S3.json`,
`acceptance-s3-companion.json` (38464 B) and `review-s3-companion.json` were NOT copied but regenerated there by the
same generators (`packages/S3.json` from the declarations, the artifact from the runner's own `proposed()`) and came
out byte-identical (`a9d0976a...`, `fe5ab7c0...`, `5c2811a4...`). The PC tree equals the cloud tree
`aa744bb7...` in every blob except `rebuild/DECISIONS.md` (the PC base carries :417). No CR byte in any file.

### `node rebuild/lanes/b/tooling/b-package.cjs --ci --package S3` (PC) - exit 1

Lines SPEC OBSERVED through PRIVATE LIVE-TRIGGERED as in section 4 (spec `a9d0976a...`, artifact `fe5ab7c0...`,
`PRODUCT IMPLEMENTED; 18 at the declared post-image / 0 at the pinned pre-image / 56 carried ... / 0 unlisted drift`), then:
```
B PACKAGE S3 LAWS 45/45 executed | TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
B PACKAGE S3 LAWS DECLARED-STATE 45/45 rows agree with the spec at product phase IMPLEMENTED; this package declares NO D-id, so these rows are the register BASELINE and prove nothing about it — its obligation is the Y1 own-child rule reported below
B PACKAGE S3 CARRIERS NONE DECLARED; 0 witness flip(s) declared
B PACKAGE S3 CHILD s3-sup-source-carriers OBSERVED; exit 0, 1300 bytes of stdout, exact declared verdict at line start; ...
B PACKAGE S3 CHILD s3-sup-inherited-carriers OBSERVED; exit 0 ...   s3-sup-defect-witnesses OBSERVED; exit 0 ...   s3-sup-writers-differential OBSERVED; exit 0 ...   s3-sup-second-gate OBSERVED; exit 0 ...
B PACKAGE S3 CHILD engine-files-differential OBSERVED; exit 0 ...   s3-merge-native-date OBSERVED; exit 0 ...   s3-membership OBSERVED; exit 0 ...   s3-gensession-differential OBSERVED; exit 0 ...
B PACKAGE S3 CHILD h3-cells OBSERVED; exit 0, 3420 bytes of stdout, exact declared verdict at line start; ran rebuild/m4/workout/test/h3-clean-init.test.cjs
B PACKAGE S3 CHILD a0-journeys OBSERVED; exit 0, 5240 bytes of stdout, exact declared verdict at line start; ran rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs
B PACKAGE S3 FAIL CHILD-REQUIRED-EXIT-ZERO; required evidence missing or failed; local diagnostics withheld
```

**The one blocker, and it is not the ruling.** The child that fails is `today-suites` (`.tmp/b-package/S3/today-suites.log`):
`# tests 321 / # pass 320 / # fail 1`, the one red cell being `setup.test.mjs:2302`
`re-pin - every file the B-NTC package pins is untouched by A4b, on disk`:
```
a file the B-NTC artifact pins moved on disk and no package on this branch declares it
+ 'rebuild/engine/today.cjs on disk 685f6e1e907c but pinned 397532ecf20a', 'rebuild/engine/merge.cjs on disk 01e9d6e6000f but pinned b69dd11f6a44',
+ 'rebuild/m4/workout/test/native-trend-context.test.cjs on disk cb4643af81e7 but pinned 8c28ccd082ae', 'rebuild/m4/workout/engine-runtime.cjs on disk 95d0c6757a0e but pinned c03732e896a9',
+ '.github/workflows/rebuild.yml on disk 60e1b94c2918 but pinned 839a79ab2eec', 'rebuild/m3/w6/host/engine-runtime-host.cjs on disk 836a369db3a9 but pinned e210bfa04ce6',
+ 'rebuild/m3/w6/host/test/journey.test.mjs on disk 2ac6a7f23bcc but pinned 228c076dbc0b'
```
Mechanism: H3 amended that cell (its own comment, `setup.test.mjs:2310-2319`) to license a moved B-NTC pin only while
the file stands at the post-image `packages/H3.json` declares for it. S3 moves seven B-NTC pins that `H3.json` does
not declare (all seven are S3's declared `edited` posts in `packages/S3.json`), so the cell is red by construction on
the S3 tree - the same class of finding H3 recorded on B-NTC's carriers. It is a lane-C file and an H3 product pin
carried byte-identical by S3, outside this package's custody, so it is NOT edited here (DECISIONS:417 scope: only
transcription/environment errors, never a weakened cell). The fix that follows H3's own precedent exactly: the cell
reads the next package's spec (`packages/S3.json` in place of `packages/H3.json`, comment updated), which keeps the
guard (an undeclared move or a declared move that has not landed stays red) and licenses exactly the declared posts;
`setup.test.mjs` then becomes role `edited` in `packages/S3.json` (an H3 product pin, so the runner admits the
role), brief v1.3 custody row, spec and artifact regenerated from `proposed()`. That is a custody change and waits
for the PM's word. Because the runner stops at the first failed required child, `GATE-SUPERSESSION-RULING-NOT-CITED`
was not reached on this run; it is the next refusal in sequence once `today-suites` is green (rehearsed, section 4).
The cloud could not measure this (jsdom absent; section 4 recorded the `# pass 321` needle as an open PC item).

### The rest of the gate on the PC (all with the same env)

```
--ci --package H3                                   B PACKAGE H3 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld   exit 1   (expected, section 3 (c))
node --test rebuild/lanes/b/tooling/test/*.test.cjs  tests 90 / pass 90 / fail 0   exit 0
Today, 13 files by name                              tests 553 / pass 552 / fail 1 (the re-pin cell above)   exit 1
today-suites eight-file argv (tap)                   # tests 321 / # pass 320 / # fail 1   exit 1
W6  cd rebuild\m3\w6 && node --test test/*.test.mjs  tests 552 / pass 552 / fail 0   exit 0
A0  journey.test.mjs + engine-equivalence.test.cjs   tests 23 / pass 23 / fail 0   exit 0
coach  node --test rebuild/coach/test/*.test.cjs     tests 201 / pass 201 / fail 0   exit 0
PWA  pwa + workflow + package                        tests 55 / pass 55 / fail 0   exit 0
node rebuild/m3/w0/public-oracle.mjs                 PUBLIC-ORACLE check PASS — 7/7 ...; sensitivity PASS — 9/9 ...; PUBLIC-CANDIDATE frozen PASS — 7/7 ...; native PASS — 7/7 ...; private NOT RUN   exit 0
node rebuild/m3/w7-preview/today/build.mjs           A1 TODAY BUILD PASS: 3 assets; 110 pinned inputs (13 engine, 12 client); build earned-83aa7db2dba8; ...   exit 0
node rebuild/slice/pwa/build-pwa.mjs                 A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256; cache name earned-slice-4f498b5233b5e9377652c09d51f28a60 ...   exit 0
node rebuild/t2/rig187.cjs                           rig187 ⇒ PASS  — SUITE GAP: both subjects are 35 GREEN under run.cjs; ...   exit 0
```
`--full` was not run (the PM runs the private census). `git status` clean after the builds. Not pushed.

## 12. v1.3 - the B-NTC re-pin cell reads the youngest declaring spec (PM-approved; PC)

PM routing on section 11: the single hunk is licensed to lane B as a disclosed custody row, H3's precedent exactly.
`rebuild/m3/w7-preview/today/test/setup.test.mjs` :2320 `packages/H3.json` -> `packages/S3.json` plus six comment
lines saying so (:2318-2323); nothing else in the file moves. The cell stays the guard it was: a B-NTC pin that has
moved is licensed only while it stands at the post the youngest declaring spec pins for it, and S3 carries every H3
post it does not move (pre == post), so H3's licences survive through it. `packages/S3.json`: `setup.test.mjs`
role `edited`, pre `e4b797eb...` (H3's post) -> post `f97cb66b...`; brief v1.3 custody row and changelog line.
Spec and artifact regenerated on the PC by the same generators, this time from the runner's own `proposed()` on the
v1.3 tree. Not fixed by weakening: the cell's assertion, its `missed`/`licensed` split and its `entries.length >= 40`
floor are byte-unchanged.

| Artifact | sha256 | bytes |
| --- | --- | --- |
| `rebuild/lanes/b/M2-S3-COMPANION-BRIEF.md` (v1.3) | `d366386f72f69d76426a4e4a1d5e636bcbfbdf20ff934903f7fb2aec6dfc8352` | 15151 |
| `rebuild/lanes/b/tooling/packages/S3.json` | `4326f68354f16c4ef88aa3b05dc549ab75eedb9771946a5ee9eb88a9e0d96299` | 36758 |
| `rebuild/m4/spec/acceptance-s3-companion.json` | `d86ce82bb88ca29e54ce0dffd40aaa51c09a20a0afdae9fdc21840b29bbecd1d` | 38463 |
| `rebuild/m3/w7-preview/today/test/setup.test.mjs` | `f97cb66bce930aa6cd82cd3737de53afb2c4527baa0fa44e041a7b9b12d5920c` (was `e4b797eb...`) | 132370 |

These supersede the section 2 / section 10 values. `runner` unchanged `c8668d79...`; review still PENDING `5c2811a4...`.

### `node rebuild/lanes/b/tooling/b-package.cjs --ci --package S3` (PC, v1.3) - exit 1

```
B PACKAGE S3 ENVELOPE PENDING artifact=d86ce82bb88ca29e54ce0dffd40aaa51c09a20a0afdae9fdc21840b29bbecd1d spec=4326f68354f16c4ef88aa3b05dc549ab75eedb9771946a5ee9eb88a9e0d96299 runner=c8668d797559500496b65cbf796f63ae8d7256e3f310a8445e30d1e3890f8864; independent exact-artifact acceptance required
B PACKAGE S3 PRODUCT IMPLEMENTED; 19 at the declared post-image / 0 at the pinned pre-image / 55 carried byte-identical from the parent / 0 declared role "pinned-unchanged" ... / 0 unlisted drift; the inventory covers all 64 parent-pinned product files; 1 declared role "superseded-by-child" over a parent EXECUTION pin, each equal to the parent byte (rebuild/lanes/b/tooling/packages/H3.json)
B PACKAGE S3 LAWS 45/45 executed | TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
B PACKAGE S3 LAWS DECLARED-STATE 45/45 rows agree with the spec at product phase IMPLEMENTED; this package declares NO D-id ...
B PACKAGE S3 CHILD s3-sup-source-carriers ... s3-sup-inherited-carriers ... s3-sup-defect-witnesses ... s3-sup-writers-differential ... s3-sup-second-gate ... engine-files-differential ... s3-merge-native-date ... s3-membership ... s3-gensession-differential ... h3-cells ... a0-journeys OBSERVED; exit 0, exact declared verdict at line start
B PACKAGE S3 CHILD today-suites OBSERVED; exit 0, 71491 bytes of stdout, exact declared verdict at line start; ran ... setup.test.mjs rebuild/m3/w7-preview/today/test/view.test.mjs
B PACKAGE S3 CHILD ntc-provider-cells OBSERVED; exit 0, 8589 bytes of stdout, exact declared verdict at line start; ran rebuild/m4/workout/test/native-trend-context.test.cjs
B PACKAGE S3 FAIL GATE-SUPERSESSION-RULING-NOT-CITED; required evidence missing or failed; local diagnostics withheld
```
All 13 declared children green; the one remaining refusal is the documented pre-ruling state (the PM's token line).
Today 13 files by name: `tests 553 / pass 553 / fail 0`, exit 0 (was 552/1). Tooling suite: 90/90, exit 0.
Section 11's other suites are untouched by this hunk (only `setup.test.mjs` moved, and it is in the today suite).
Next: the PM appends THEME / BRIEF-BY-SHA (this brief `d366386f...`, 15151 bytes) / token lines; then the
three-field spec edit (theme, `brief.acceptedLedgerLine`, `rulingLineSha256`; status `BRIEF-ACCEPTED`) and the
artifact regenerated from `proposed()`.
