# BUILD REPORT — B-NTC — qualified `nativeTrendContext` provider

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
| `rebuild/lanes/b/tooling/packages/B-NTC.json` | **NEW** (allowed by `DECISIONS:103` (4)); its `brief.sha256` is the brief hash on the row above | 7 846 | `b0aec30912f67de1d88e174ab3be86c62ee68833d117d883cfb025ecf14601b4` |
| `rebuild/lanes/b/BUILD-REPORT-B-NTC.md` | **NEW** — this file | — | — |

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
| 3.4b | `node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs` | **22 tests, 22 pass, 0 fail** (17 journey steps + 5 equivalence). Step 17 diagnostic: `day two: asked=1 prepared=undefined code=WORKOUT_PREPARATION_INVALID producer={"code":"PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED","reason":"resolver_failed",…}` |
| 3.4c | `node --test rebuild/m3/w7-preview/today/test/{adapter,view,design,package,gym}` | **123 tests, 123 pass, 0 fail** — A1/A2 unchanged, as designed (the gym card is not wired by this package) |
| 3.4d | `node --test rebuild/m4/workout/test/{schema,engine-capture,engine-history,engine-order,context-history,source-control,configuration-capture,history-panel,native-trend-context}` | **62 tests, 56 pass, 6 fail.** All six live in the three files that `throw Error('Explicit retained PERFORMED_W6_DIR required')` at require time — `engine-history.test.cjs`, `history-panel.test.cjs`, `source-control.test.cjs`. Environmental, pre-existing, and B-NTC touches nothing they read |
| 3.4e | `node --test rebuild/m4/workout/test/native-next-targets{,-assembly,-correction}.test.cjs` | **BLOCKED — NOT RUN.** `Error: Cannot find module '../../../../test-support/import-engine/rebuild/m3/w7-preview/fixtures.cjs'`. They need `EARNED_NATIVE_PACKET_ROOT` + a `test-support/import-engine/` tree that does not exist in this repository — exactly A0-REPORT §"not qualified" 2. **This report does not claim they passed.** Open item O2 |

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

### 3.6 `b-package.cjs --ci --package B-NTC` — the honest lines

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

Evidence complete for a **PROPOSED** package: 45/39 laws unmoved, census byte-identical,
parent gate PASS with the second gate, 22/22 provider cells, 22/22 A0 journey including the
new end-to-end proof, 123/123 screens. **No PASS word is claimed for B-NTC itself** — the
runner refuses its package id, `--full` was never reachable, and no artifact is sealed, no
receipt exists and nothing is merged. Open items O1–O6 and PM questions Q1–Q4 are in the
brief. **Speculative until reviewed.**
