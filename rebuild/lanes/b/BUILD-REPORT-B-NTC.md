# BUILD REPORT — B-NTC — qualified `nativeTrendContext` provider

---

## 0. POST-r1 FIX PASS — what this pass did, and every number it measured

`rebuild/lanes/b/reviews/B-NTC-REVIEW-r1.md` returned **ACCEPT WITH CHANGES**. This section
is the fixer's report; §§1–6 below are the original builder's, corrected in place where the
review found a wrong figure (each correction is marked).

**Environment:** same worktree
`…\work\lane-b\ntc`, branch `rebuild/lane-b-ntc`, reset to `origin/rebuild/lane-b-ntc`
@ `afb3bf4` (the review commit) before any edit. Node
`C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
**v24.19.0**. `node_modules` at root, `rebuild/m3/w6` and `rebuild/m3/w5` were already
installed from the builder's pass; **nothing was re-installed and `package-lock.json` was
never touched**. The frozen bundles in the gitignored `rebuild/conform/engines/` were already
present (`engine-main.cjs` 813 696 B, `engine-old.cjs` 792 806 B) — `build-engines.mjs` is
still Windows-broken (review F10, open item O8) and was not run.

### 0.1 C1–C5 (required) and C6–C9 (recommended)

| item | what was done | evidence |
|---|---|---|
| **C1** identity | the claim is **withdrawn** in all six places; the module now enforces and states **a content digest of the bound facts + `source_revision` + a unique `start_op_id`**, re-checked per request inside a scoped window. New refusal `bound_facts_digest_mismatch`. Two cells record that identity is NOT enforced and that the digest catches a moved object | brief §4.4, §1.4, §3, §4.1, §8 M10, §13 O3; module header; `workout-host.mjs` H3c comment |
| **C2** §9.1 + §0 headline | rewritten to the measurement: the product's own athlete carries **28 recorded sleep nights**, G1/G2/G3 marked **NOT OBSERVED**, G5 conditional on the Q1 ruling, §0 qualified | brief §0, §9.1, §12 Q1 |
| **C3** bind window | **fixed**, not just disclosed: `withFacts(facts, run)` (bind … finally RESTORE, re-entrant) added to the module, used by H3c, and put on the engine handle by the H6 patch so `gym-model.readPrevious()` runs inside a window. Measured both ways | brief §4.1, §9.1 G6; patch header |
| **C4** journey figure | corrected to **23/23 at head** (22/22 is the base figure). §3.4b below corrected | brief §7.3; §3.4b |
| **C5** O2 / §7.4 | corrected to "green inside `native-carriers-package.cjs --ci` (child `focused`, `# pass 15`); not runnable by a bare `node --test`" | brief §7.4, §13 O2 |
| **C6** `rushedOf` | reads **both** holders; a disagreement refuses `session_pace_disagreement`; cell added | brief §4.3 |
| **C7** `bind(null)` | now **throws**; clearing is `unbind()`; `bound()`'s live-object behaviour documented | brief §4.1; module header |
| **C8** spec slips | the contradicting note fixed; the artifact/review paths kept **with the reason** (`b-package.cjs:300-303` derives them); §2 byte count corrected **7 846 → 7 862** | `packages/B-NTC.json`; §2 |
| **C9** CI home | **not done — it is a PM item.** B-NTC touches no `.github` file by design | brief §13 O7 |

### 0.2 The S2 path (PM ruling pending; option A implemented and OFF)

`createDayFactsReader({ state, engine, mapRecordedDaysWithEnginePredicates })` — **default
`false`** — chooses between `createEmptyHistoryDayFacts` (today's proof over an empty
history) and `createEnginePredicateDayFacts` (the **engine's own** `dayWeather` /
`cleanAtDate`). The engine reader is used **only** when the option is on **and**
`enginePredicatesAvailable(engine)` is true at runtime; otherwise the existing
`recorded_sleep_unmapped` refusal stands unchanged. Nothing on the accepted tree exposes
those two predicates, so the committed behaviour is identical to before.

**The scratch proof.** A copy of this branch at
`C:\Users\joeym\AppData\Local\Temp\ntc-fix\scratch` (robocopy, `node_modules` junctioned,
`ledger/` and `rebuild/conform/private` deleted from the copy and never opened) with (i) the
H6 patch applied and (ii) an **env-gated widening of `EXPOSED`** in the scratch
`engine-runtime-host.cjs` only. Four arms, all driven through the product path
(`createGymHost` + `createGymModel`, encrypted `fake-indexeddb` store) on the athlete
`createTodayModel({}).stateFromOps()` with `sessionLog = {}` — **28 recorded nights,
0 events**:

```
ARM 1  option OFF, predicates ABSENT   (the shipped default)
  dayReader {"enginePredicates":false,"enginePredicatesAvailable":false,"optionRequested":false}
  day1 ready/closed 0->6 · day2 ready/closed 6->12
  day4 {"phase":"blocked","code":"PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED","copy":"resolver_failed","ops":12}

ARM 2  option ON,  predicates ABSENT   (no re-seal yet)
  dayReader {"enginePredicates":false,"enginePredicatesAvailable":false,"optionRequested":true}
  day4 {"phase":"blocked","code":"PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED","copy":"resolver_failed","ops":12}
        -- byte-for-byte the same refusal as ARM 1: never a silent downgrade

ARM 3  option ON,  predicates PRESENT  (scratch EXPOSED re-seal)
  dayReader {"enginePredicates":true,"enginePredicatesAvailable":true,"optionRequested":true}
  day4 {"phase":"ready","code":null,"copy":null,"ops":12}
  readPreviousSeam {"genSession":"ANSWERED","cards":2,"cardsWithPrev":2,"nativeSessionsInInput":2}
  day4Conducted {"probe":"ready","closed":true,"settled":"finished","before":12,"after":18}
        -- THE GYM CARD OPENS: Started, every set logged, closed. ops 12 -> 18

ARM 4  ARM 3 but with the ORIGINAL narrow bind window   (the F3 control)
  day4 {"phase":"ready", ...}   -- the day still opens
  readPreviousSeam {"genSession":"THREW","code":"PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED",
                    "reason":"resolver_failed"}
  model.previous().size === 0   -- swallowed at gym-model.mjs:136; the card shows nothing
```

The scratch widening and the two scratch test files are **NOT committed** and are not
proposed as a diff: widening `EXPOSED` re-seals an accepted artifact and that is the PM's
decision (brief §12 Q1).

### 0.3 H6 as a patch file

`rebuild/lanes/b/ntc/gym-host.wiring.patch` (14 626 B, sha256
`91cf70bd75ec0b29d62f78e9b3a455835465909a14b2b2ca0b5828d30979a386`) — a prose header (custody,
the three corrections, the **measured** §9.1 table) followed by a unified diff against
`rebuild/m3/w7-preview/today/gym-host.mjs` at this branch tip.

```
$ git apply --check rebuild/lanes/b/ntc/gym-host.wiring.patch     -> exit 0
$ git apply        rebuild/lanes/b/ntc/gym-host.wiring.patch      -> exit 0
  applied file sha256 == scratch file sha256  -> True
$ git checkout -- rebuild/m3/w7-preview/today/gym-host.mjs        -> status for that path: []
```

**`gym-host.mjs` is NOT committed and is byte-identical to the tip on this branch.**

With the patch applied in the scratch copy:

| run | result |
|---|---|
| `node --test` over the five today test files **+ `ntc-h6-delta.test.mjs`** | **tests 129 · pass 129 · fail 0** (123 unchanged + 6 corrected A2 delta cells) |
| `node --test ntc-h6-reseal.test.mjs` (scratch-widened `EXPOSED` only) | **tests 4 · pass 4 · fail 0** — D5 day 4 opens and conducts 12→18; D6 previous performance present; D6-control previous EMPTY with the narrow window |
| `node rebuild/m3/w7-preview/today/build.mjs` | **`A1 TODAY BUILD PASS`: 3 assets; 84 pinned inputs (13 engine, 12 client); 2 pinned typefaces inlined; 3/3 assets free of any network reference** — so esbuild resolves the DEFAULT CJS import in the browser bundle |

### 0.4 Every gate re-run on the COMMITTED tree

| # | command | outcome |
|---|---|---|
| 0.4a | `node --test rebuild/m4/workout/test/native-trend-context.test.cjs` | **tests 36 · pass 36 · fail 0**, exit 0 (22 → 36; 14 new cells for C1/C3/C6/C7 and the S2 path) |
| 0.4b | `node --test …/journey.test.mjs …/engine-equivalence.test.cjs` | **tests 23 · pass 23 · fail 0**, exit 0 — unmoved by the H3c rewrite, step 17 still green, same diagnostic line |
| 0.4c | `node --test` over the five `rebuild/m3/w7-preview/today/test/*` files | **tests 123 · pass 123 · fail 0** — unchanged on the committed tree, as designed |
| 0.4d | `node rebuild/conform/v4/run-defect-laws.cjs` | `TOTAL 45 laws · **45 RED-frozen** · **39 RED-candidate** · 89 GREEN repair controls · 97/104 mutant executions DETECTED · **0 HARNESS_ERROR** · AUDIT RED-FIRST FAIL` — **45/39 unmoved** |
| 0.4e | `node rebuild/conform/run.cjs` on the candidate, then with all three modified tracked files stashed, then popped | both logs 84 lines, **sha256 `7EA1E04BBB2847738BCDC7793DA8365E3EAF59F849FC8BC54A355487EC58A37C` on BOTH**, `Compare-Object` → **0 differing rows**. Terminal line on both: `SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families`. `git status` identical before and after |
| 0.4f | `node rebuild/m4/spec/native-carriers-package.cjs --ci` | `POSTFIX M2-NATIVE-CARRIERS AUTHORIZED artifact=295762f0…`, **13 children each `OBSERVED; exit 0 and exact declared verdict`**, terminal `NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`, **exit 0** (90.4 s) |

### 0.5 `b-package.cjs --ci --package B-NTC` — the honest lines (v1.1)

The runner was fetched from `origin/rebuild/lane-b-tooling` **@ `477b025`** with
`git archive` into `C:\Users\joeym\AppData\Local\Temp\ntc-fix\tooling`
(`b-package.cjs` 65 367 B, sha256
`6f69aa8ee6667f27b92166dd981ba9c15078f7e77fc2692130950a2ab8be2c3b`), copied into this
worktree, run, and **deleted again**. `git status --porcelain` afterwards lists no
`rebuild/lanes/b/tooling/b-package.cjs`.

That commit's usage line is `--ci|--full --package <B-NTC|B-LOM|B1|B2|B3|B4>`, so unlike
v1's measurement at `572a8c2` the id is **accepted by the guard**. What it then says:

```
$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
B PACKAGE B-NTC FAIL; required evidence missing or failed; local diagnostics withheld
exit 1

$ node rebuild/lanes/b/tooling/b-package.cjs --full --package B-NTC
B PACKAGE B-NTC FAIL; required evidence missing or failed; local diagnostics withheld
exit 1

$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B1     (control, same tree)
B PACKAGE B1 FAIL; required evidence missing or failed; local diagnostics withheld
exit 1
```

**No PASS word is claimed, and the FAIL is reported as it happened.** It is also not
B-NTC-specific: the control package `B1` fails identically on the same tree. The runner
requires an ACCEPTED envelope and a receipt chain that a **PROPOSED** package cannot have —
`brief.acceptedLedgerLine` is `null`, `tooling.runnerSha256` is `null`, every authorization
is `null`, and no `rebuild/m4/spec/acceptance-b-ntc-native-trend-context.json` exists because
the PM writes it at acceptance. Diagnostics are withheld by the runner's own design, so no
finer statement is available to a builder. **`--full` reaches the same refusal**, which means
open item O4 (the standing `DECISIONS:97` BLOCKED-private line) is still not producible for
this package id; the parent gate's line (0.4f) remains the closest true statement.

Also found and recorded: `477b025` carries its **own** `rebuild/lanes/b/tooling/packages/B-NTC.json`
(21 159 B) beside the one this package committed (7 862 B). Two specs, one id — PM question
Q2, brief O9.

### 0.6 Boundaries honoured in this pass

* **Never opened:** `ledger/`, `rebuild/conform/private/` (both also removed from the scratch
  copy before anything ran in it).
* **Never edited:** `rebuild/engine/**`, `rebuild/conform/**`, `rebuild/m4/spec/**`,
  `.github/**`, `src/**`, `package.json`, `package-lock.json`, frozen laws/witnesses/tools/
  goldens, and **`rebuild/m3/w7-preview/today/gym-host.mjs`** (patched only in scratch, and
  once in this worktree to verify `git apply`, then restored — `git status` proves it).
* **Never touched:** any other worktree. No worktree was created, moved or removed; the
  tooling runner came from `git archive`, not from the sibling `…/work/lane-b/tooling`
  checkout.
* Files committed by this pass: `native-trend-context.cjs`, its test, `workout-host.mjs`,
  the brief, `packages/B-NTC.json`, and the new `rebuild/lanes/b/ntc/gym-host.wiring.patch`.

---

Lane B builder (Opus), lane B. **Speculative until reviewed.** Every command below was run on
the owner's PC (Windows, PowerShell / cmd) in the worktree
`C:\Users\joeym\Documents\Codex\2026-09-04\read-rebuild-t3-brief-md-and\work\lane-b\ntc`,
branch `rebuild/lane-b-ntc`, with
`C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
(**Node v24.19.0**). Outcomes are recorded as they happened, failures included.

**Base:** `origin/rebuild/t2-client-core` @ `12cfdb9d58fbcab10faacdaff8ef886ca79ab9c2`
(the tip `DECISIONS:103` names). **Brief:**
`rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md`.

---

## 1. Setup

| # | command | outcome |
|---|---|---|
| 1.1 | `git -C <design-pin> fetch origin` + `git rev-parse origin/rebuild/t2-client-core` | `12cfdb9d58fbcab10faacdaff8ef886ca79ab9c2` — matches the ruled tip |
| 1.2 | `git -C <design-pin> worktree add …/work/lane-b/ntc -b rebuild/lane-b-ntc origin/rebuild/t2-client-core` | OK — `HEAD is now at 12cfdb9` |
| 1.3 | `npm ci --include=dev` (root) | OK — 44 packages. **`package.json` / `package-lock.json` never committed** |
| 1.4 | `npm i --no-save --no-package-lock fake-indexeddb` | **wrong turn, recorded:** it removed 41 packages (re-resolved from `package.json` alone). Undone by re-running `npm ci --include=dev`; `git status package.json package-lock.json` clean afterwards |
| 1.5 | `cd rebuild/m3/w6 && set NODE_ENV= && npx pnpm@9 install --frozen-lockfile` | `+ @noble/ciphers 2.4.0`, `+ @noble/hashes 2.2.0`, `+ esbuild 0.28.1`, `+ fake-indexeddb 6.2.5`, `+ playwright-core 1.62.1`. **First attempt without clearing `NODE_ENV` printed `devDependencies: skipped because NODE_ENV is set to production`** — the exact F-G2 finding in `DECISIONS:105` |
| 1.6 | `cd rebuild/m3/w5 && set NODE_ENV= && npx pnpm@9 install --frozen-lockfile --ignore-scripts --ignore-workspace` | `+ esbuild 0.28.1`, `+ wrangler 4.129.0` |
| 1.7 | `node rebuild/conform/engines/build-engines.mjs <root>` | **FAILED** on Windows: `ERR_UNSUPPORTED_ESM_URL_SCHEME` — the script `import()`s `path.join(root,"node_modules/esbuild/lib/main.js")` as a bare Windows path. Pre-existing tool limitation, not touched |
| 1.8 | workaround: copied the already-built frozen bundles from the sibling lane-B worktree (read-only) | `engine-main.cjs` 813 696 B sha256 `0810d9b43e1ed3f286521ae6d8ffd306f55860056daf9836d1c42dc6221a3d69`; `engine-old.cjs` 792 806 B sha256 `9060d7dc36ede09e390217968a393c776034528ee1836ee9780f3ee46848b261`. `rebuild/conform/engines/` is gitignored; nothing committed. The `$TMPDIR/earned-engine-wt/{main,old}` worktrees already stood at `fe516c1` / `a0009c3`; **no worktree was created, moved or removed by this build** |

---

## 2. What was written

| file | change | bytes | sha256 |
|---|---|---|---|
| `rebuild/m4/workout/native-trend-context.cjs` | **NEW** — the provider | 12 375 | `cf8b50955ad0dca5ff91e528ae0abc48611cebeadc586e2759ec0ec587c22356` |
| `rebuild/m4/workout/test/native-trend-context.test.cjs` | **NEW** — 22 cells | 13 164 | `f0879ca2b6d2fd65cb125d2d013e64efd89f236a4893dcec7245bf460dc52559` |
| `rebuild/m3/w6/host/workout-host.mjs` | 3 additive hunks (optional `nativeTrendBinding`) | 12 000 → 13 409 | `4029a5404cd34aac56da0af89c4ae6e0e2868353ab758d0f778c9d9f29190a8b` → `2d160c1c79fd7957febe964db523bc53dbb9a32fa571895f30e1a279a77fc480` |
| `rebuild/m3/w6/host/test/journey.test.mjs` | 1 import + new step 17; steps 1–16 unmodified | 27 838 → 37 419 | `57566afd36ea913da4b9eaeed8f7a358479381606a9b6f92fc5e562d85d58cda` (the sha `DECISIONS:98` pins) → `d4c68645474eb8f6b4acbd252b35b9f0ca31225f6269fea53416a8c8a712af96` |
| `rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md` | **NEW** | 56 010 | `0ba59cca3bd70383330fa59a4ae86a971108a64594933d5c6388bca6c45e16b8` |
| `rebuild/lanes/b/tooling/packages/B-NTC.json` | **NEW** (allowed by `DECISIONS:103` (4)); its `brief.sha256` is the brief hash on the row above | **7 862** *(review r1 C8/F8: this row said 7 846; the sha256 matched, so the byte count was the slip — corrected)* | `b0aec30912f67de1d88e174ab3be86c62ee68833d117d883cfb025ecf14601b4` |
| `rebuild/lanes/b/BUILD-REPORT-B-NTC.md` | **NEW** — this file | — | — |

**AFTER THE r1 FIX PASS (§0), the same files on disk:**

| file | bytes | sha256 |
|---|---|---|
| `rebuild/m4/workout/native-trend-context.cjs` | 25 319 | `7f34754fcada67a0403315c22bf66724cdcbdca5052e8e8f16f789fdb012054a` |
| `rebuild/m4/workout/test/native-trend-context.test.cjs` (**36 cells**) | 29 437 | `443448d0643b32416a92b63af91d1ad8d75bd5e3571ca33086bc94851748e14d` |
| `rebuild/m3/w6/host/workout-host.mjs` | 14 536 | `262d7d5f65e736bb2592da6cd2f4bf883f30842d4dbbec97653b610e5f79d6fe` |
| `rebuild/m3/w6/host/test/journey.test.mjs` | 37 419 | `d4c68645474eb8f6b4acbd252b35b9f0ca31225f6269fea53416a8c8a712af96` — **unchanged by the fix pass** |
| `rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md` (**v1.1**) | 88 089 | `3e8fa02ba58fafea3cb12c40f46c2bed3ff91500e4436330b660cb947828df3c` |
| `rebuild/lanes/b/ntc/gym-host.wiring.patch` (**NEW**) | 14 626 | `91cf70bd75ec0b29d62f78e9b3a455835465909a14b2b2ca0b5828d30979a386` |
| `rebuild/lanes/b/tooling/packages/B-NTC.json` (re-pinned to the v1.1 brief hash; `product` / `coverage` / `parent` unchanged) | 9 225 | `e9b1603c9545cabfa01a9af4d28c339bce60a730f79881c5a166645994455b86` |

Unchanged pins re-verified on disk after the fix pass: `rebuild/engine/performed.cjs`
`2372e66b…` (19 479 B) and `rebuild/m4/workout/engine-runtime.cjs` `9be21897…` (3 947 B).

**Not touched, verified:** anything under `rebuild/engine`, `rebuild/conform`,
`rebuild/m4/spec`, `.github`, `src`, `ledger`, `rebuild/conform/private`,
`rebuild/m3/w7-preview/today`. `git status --short` before commit listed exactly the seven
paths above plus the gitignored `.tmp-ntc/` scratch.

**Unchanged pins re-verified on disk at the package head:**
`rebuild/engine/performed.cjs` `2372e66ba4e31f7229c870e4d1e2e95855d7a49ee705394c23b53b84ec249f3a` ·
`rebuild/m4/workout/engine-runtime.cjs` `9be218975e39d84465f6c337d48b60c5009f268eb68d7b9808871ad867c61b23` ·
`rebuild/m4/spec/acceptance-native-carriers.json` `295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1` ·
`rebuild/m4/spec/NATIVE-CARRIERS-THEME.md` `9de320a80acf5bb11da59f552bd885b2e162b7c0a842bdc6c569198caef39173` ·
**all 20 files the parent artifact pins in its `product` map: 20/20 byte-identical on disk**
(printed by the spec generator).

---

## 3. Evidence — every gate run, and its outcome

### 3.1 v4 register laws — 45 RED-frozen / 39 RED-candidate, no law moves

```
$ node rebuild/conform/v4/run-defect-laws.cjs
TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls ·
97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
```

**Expected 45 / 39 — measured 45 / 39, 0 HARNESS_ERROR. No row moves.**
(A first run before §1.8 returned `0 RED-frozen · 39 RED-candidate · 142 HARNESS_ERROR`
because the frozen bundle was absent; that is the harness, not the laws, and it is recorded
here rather than dropped.)

### 3.2 Public conformance census — byte-identical to base

```
$ node rebuild/conform/run.cjs                                  # candidate
… SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
$ git stash push -- rebuild/m3/w6/host/workout-host.mjs         # restore base
$ node rebuild/conform/run.cjs                                  # base
$ git stash pop
```

| log | sha256 |
|---|---|
| candidate | `CAAB2293006821770F0F6E27909A16D474066CCEB0FEF2C022478F0817C5604E` |
| base | `CAAB2293006821770F0F6E27909A16D474066CCEB0FEF2C022478F0817C5604E` |

`Compare-Object base candidate` → **no differences. IDENTICAL.** The 99/141/70 figures match
`DECISIONS:93`. The `BAD 7` (privacy, 0 private lines), `BAD 8` (gate artifacts) and
`BAD 8` (coverage) rows stand identically on both trees — they are the known
private-fixture rows on a builder machine.

### 3.3 The parent package gate — PASS, second gate included

```
$ node rebuild/m4/spec/native-carriers-package.cjs --ci
POSTFIX M2-NATIVE-CARRIERS AUTHORIZED artifact=295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1
… 13 children, each "OBSERVED; exit 0 and exact declared verdict", including second-gate
NATIVE CARRIERS PUBLIC CI EVIDENCE PASS; the inherited full gate matrix, the private oracle, all FULL gates and independent acceptance remain separate
exit 0   (86.98 s)
```

A first attempt returned `NATIVE CARRIERS PACKAGE BLOCKED BASELINE-ESBUILD-MISSING`, caused
by the §1.4 wrong turn having removed root `esbuild`; re-running `npm ci --include=dev`
fixed it. Recorded because a BLOCKED line must never be quietly re-rolled.

### 3.4 Test suites

| # | command | outcome |
|---|---|---|
| 3.4a | `node --test rebuild/m4/workout/test/native-trend-context.test.cjs` | **22 tests, 22 pass, 0 fail** |
| 3.4b | `node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs` | **CORRECTED (review r1 C4/F4): 23 tests, 23 pass, 0 fail** at the package head — 17 journey steps + 5 equivalence + the suite node, which `node --test` counts. This row originally said 22/22; **22/22 is the BASE figure** (`DECISIONS:102`, 16 `await t.test(` calls at `12cfdb9`). Both are stated so no later reader concludes a test vanished. Re-measured after the r1 fix pass: still 23/23. Step 17 diagnostic: `day two: asked=1 prepared=undefined code=WORKOUT_PREPARATION_INVALID producer={"code":"PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED","reason":"resolver_failed",…}` |
| 3.4c | `node --test rebuild/m3/w7-preview/today/test/{adapter,view,design,package,gym}` | **123 tests, 123 pass, 0 fail** — A1/A2 unchanged, as designed (the gym card is not wired by this package) |
| 3.4d | `node --test rebuild/m4/workout/test/{schema,engine-capture,engine-history,engine-order,context-history,source-control,configuration-capture,history-panel,native-trend-context}` | **62 tests, 56 pass, 6 fail.** All six live in the three files that `throw Error('Explicit retained PERFORMED_W6_DIR required')` at require time — `engine-history.test.cjs`, `history-panel.test.cjs`, `source-control.test.cjs`. Environmental, pre-existing, and B-NTC touches nothing they read |
| 3.4e | `node --test rebuild/m4/workout/test/native-next-targets{,-assembly,-correction}.test.cjs` | **BLOCKED by a bare `node --test`.** `Error: Cannot find module '../../../../test-support/import-engine/rebuild/m3/w7-preview/fixtures.cjs'` — they need `EARNED_NATIVE_PACKET_ROOT` + a `test-support/import-engine/` tree that does not exist in this repository. **CORRECTED (review r1 C5/F5): they DO run and DO pass inside `native-carriers-package.cjs --ci`** — the gate's `focused` child is exactly those three files asserting `# pass 15` (`native-carriers-package.cjs:61-64`) and it reported `OBSERVED; exit 0 and exact declared verdict` in §3.3, in the reviewer's re-run and in §0.4f. The original "could not be run / claims nothing about them" was overstated |

### 3.5 The journey step that had to be built three times — recorded in full

Step 17 is the only end-to-end proof that the wall is real and that this provider removes it,
and it took three shapes before it was true. All three are recorded because the first two are
findings, not noise:

1. **over the journey's own repository** → `WORKOUT_HISTORY_RECONCILIATION_REQUIRED`: step 12
   leaves an open, unclosed session. Fixed by giving step 17 its own `scaffold()`.
2. **one conducted day, one lift, clean-init state** → `asked=0`, the day **prepared**. The
   resolver was never called.
3. **two conducted days, every slot, clean-init state** → `asked=0` again.

The cause is a real property of A0's fixture, not of this package: `createCleanInitState`
writes `w: null` on every exercise, `rebuild/engine/today.cjs` `genSession` reads that as a
permanent DEBUT, and a DEBUT never reaches `liftTrend`. That is why A0-REPORT could only say
the containment path was *"not exercised end to end"*. Step 17 therefore states one fact
explicitly in the test and in a comment — **one lift carries a working load from its own
declared `steps`** (`db-bench.w = 35`) — and then `asked=1` and the wall appears. A2 does not
hit this because it uses `today.stateFromOps()`, a seeded Joe-shaped state. **Open item O1.**

### 3.6 `b-package.cjs --ci --package B-NTC` — the honest lines (v1 pass; **v1.1's run is §0.5**)

The accepted runner is on `rebuild/lane-b-tooling` @ `572a8c2`, not on this branch. It was
copied into the worktree, run, then **deleted without ever being committed** (`git status`
after the run showed no `rebuild/lanes/b/tooling/b-package.cjs`):

```
$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B1|B2|B3|B4
exit 1

$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B1          # control, same tree
B PACKAGE B1 FAIL; required evidence missing or failed; local diagnostics withheld
exit 1
```

**Exit 1, one line, no PASS word.** That is the runner behaving exactly as its README
specifies (*"Two modes, no third. Anything else refuses in one line with exit 1"*), and
B-NTC does not work around it: widening the package list is a change to the runner, whose
bytes are pinned by each spec's `tooling.runnerSha256` and re-verified in Git. **PM question
Q2 in the brief.**

`--full` refuses at the same usage guard, **before** the private-fixture check, so the
standing `DECISIONS:97` rule (every builder runs `--full` without the private fixture and
reports `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING`) **could not be satisfied for the
package id `B-NTC`**. Recorded as open item O4 rather than substituted with a different
run's line. `rebuild/conform/private` was never opened, and no private value, count, hash or
prose appears anywhere in this package.

---

## 4. Scope discipline

* **Never opened:** `ledger/`, `rebuild/conform/private/`.
* **Never edited:** frozen laws, witnesses, tools, goldens, the oracle, `rebuild/engine/**`,
  `rebuild/conform/**`, `rebuild/m4/spec/**`, `.github/**`, `src/**`, `package-lock.json`.
* **Never touched:** any other worktree. The two `earned-engine-wt` worktrees already existed
  at the commits the builder needs; the frozen bundles were **read** from a sibling lane-B
  worktree and copied into this one's gitignored `rebuild/conform/engines/`.
* **Deliberately NOT edited, with a reason:** `rebuild/m3/w7-preview/today/gym-host.mjs` and
  `gym.test.mjs` — `DECISIONS:106` (b) gives lane C an explicit licence to edit the former,
  and the latter is A2 custody. The exact one-line wiring and the three delta cells are
  written out in the brief §6 H6 and §9.1 instead. **Consequence, stated plainly: the gym
  card still hits the wall on this branch. B-NTC delivers and proves the provider; one line
  in A-lane/lane-C custody turns it on.**

## 5. Upstream drift during the pass

`origin/rebuild/t2-client-core` advanced 34 commits to `da63053` (ledger 104–106) while this
was being built.

```
$ git diff --name-only 12cfdb9 da63053 -- rebuild/engine rebuild/conform
(nothing)
$ git diff --name-only 12cfdb9 da63053 -- rebuild/m4/workout rebuild/m3/w6/host rebuild/m3/w7-preview/today
(nothing)
$ git diff --name-only 12cfdb9 da63053 -- rebuild/m4/spec
rebuild/m4/spec/NATIVE-CARRIERS-BUILD-REPORT.md
rebuild/m4/spec/NATIVE-CARRIERS-THEME.md
rebuild/m4/spec/acceptance-native-carriers.json
rebuild/m4/spec/review-native-carriers.json
```

Parent artifact: `295762f0…` at `12cfdb9` → `e940359b684b90e2e92ae325a86c018f91a7aa27bec7c5466165116657c2201a`
at `da63053` (the CI re-seal, receipt `DECISIONS:104`, product/coverage/gates/authorizations
byte-identical). **Every hunk applies unchanged at the new tip**; the rebase and the parent
re-pin are real work before merge. Also: the batched `rebuild.yml` re-seal item ruling (5)
told the first package to carry is **already closed** by `DECISIONS:105`, so B-NTC carries no
`rebuild.yml` change — a deliberate scope reduction, not an omission.

## 6. Verdict

**v1 (the builder's):** Evidence complete for a **PROPOSED** package: 45/39 laws unmoved,
census byte-identical, parent gate PASS with the second gate, 22/22 provider cells, 22/22 A0
journey including the new end-to-end proof, 123/123 screens. *(The journey figure is
corrected to 23/23 at head — §3.4b.)*

**v1.1 (after review r1 — §0):** C1–C5 applied, C6–C8 applied, C9 left as the PM item it is.
The measured state of the tree now:

* **36/36** provider cells · **23/23** A0 journey + equivalence · **123/123** today/gym,
  unchanged on the committed tree
* **45 RED-frozen / 39 RED-candidate**, 0 HARNESS_ERROR — unmoved
* census **byte-identical** to base (same sha256 on both runs, 0 differing rows)
* `native-carriers-package.cjs --ci` → **PASS, exit 0**, 13/13 children OBSERVED
* `b-package.cjs --ci --package B-NTC` @ tooling `477b025` → **`B PACKAGE B-NTC FAIL;
  required evidence missing or failed; local diagnostics withheld`, exit 1** — the same line
  the control package `B1` gets on the same tree, because a PROPOSED package has no accepted
  envelope. **No PASS word is claimed for B-NTC.**
* H6 as a patch: `git apply --check` **exit 0**; applied in scratch → **129/129** today suite
  (123 + 6 delta cells), `A1 TODAY BUILD PASS`; `gym-host.mjs` **not committed**
* the S2 path: **implemented, OFF by default, inert on this tree**, and proven in scratch to
  open the 28-night athlete's day 4 (ops 12 → 18) only with the option on *and* a widened
  `EXPOSED` — which is the PM's ruling to make (brief §12 Q1)

Open items O1–O10 and PM questions Q1–Q4 are in the brief. **Still speculative; still
PROPOSED; nothing merged.**
