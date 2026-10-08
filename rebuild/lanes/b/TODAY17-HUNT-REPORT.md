# today-17 flake hunt: report

Worktree earned-s11-diagc (obs/s11-diag-c at c2688c4). Only .github/workflows/s11-observe.yml changed. Nothing is committed.

## 1. What today-17 runs
- Source: child 1 of 39 in rebuild/lanes/b/tooling/packages/S11.json (needle "# pass 829").
- Spawn: `process.execPath --test --test-reporter=tap <23 files>`, cwd = repo root, timeout 1800000 ms.
- Env: process.env plus NODE_OPTIONS='' NODE_V8_COVERAGE='' TZ=America/New_York MEASURED_TEST_NOW=2026-09-03
  ENGINE_MAIN/ENGINE_OLD (load-write-reference.cjs bundles) EARNED_CLIENT_DIR, minus PL_ENGINE PL_LAWS_LIB
  CONFORM_MUTATE_LAWS CONFORM_ADAPTERS_DIR.
- Files (today/test/*.test.mjs unless marked): adapter, catalogue, checkin, copy, design.cjs, food,
  gss-annex-g6-g8, gss-annex-identity-reentrancy, gss-annex-log-timing, gss-annex-remount, gss-annex-timing, gym,
  machine-settings-ui, ntc-h6-delta, package.cjs, problem, setup, view, measure/{journey,lane,baseline,boundary},
  native-load-panel.
- node --test runs the files as concurrent processes that share the checkout's .tmp/.

## 2. Workflow diff summary (+135/-197)
- Unchanged: the trigger, permissions, job env and all 6 setup steps (YAML-parsed, deep-equal to HEAD).
- Matrix: ubuntu-latest shards 1-12 plus windows-latest shards 13-14, fail-fast false. Timeout 60 -> 40 min.
- Step: runs only today-17, with argv from S11.json. childEnv() and the spawn line stay byte-identical to
  b-package.cjs, and copyCheck() verifies that at runtime. The branch, debug and workspace guards are kept.
  S11_HUNT_SHARD is deleted before the child env is built.
- Runs: up to 2 per shard. Run 2 starts only if the step has run for less than 12 min.
- Output per run: an `S11-HUNT-RUN ... status exit signal error wall RED|GREEN` line plus the TAP counts.
- On a red run it also prints every `not ok`, leaf tests first, each with its file > test chain and YAML
  diagnostic (error, expected/actual, location, stack). That is up to 10 blocks of 40 lines, then the last
  60 lines of stdout+stderr (capped at 16 KB).
- Filtering: a line that names conform/private, src/, ledger, soak, golden or live.json (checked after
  backslashes and doubled slashes are normalised) prints as `[line filtered: path policy]`. Lines are cut
  at 400 chars.
- Artifact: `s11-today17-<OS>-<shard>`, uploaded with `if: always()` and rewritten after each block.
- Checked locally: `--list` works and spawns nothing; a synthetic TAP sample was parsed and filtered
  correctly. today-17 was NOT run.
- Caveat: in the package run, earlier children may already have built .tmp/w7-today-dist, but this job
  starts from a fresh checkout (see 1d).

## 3. Race candidates, most likely first
1. **Shared build output across concurrent file processes.** Same class as the fixed copy.test.mjs:188 race
   (1002 !== 903), but that fix moved only copy.test.mjs to its own dirs. These callers still use the default
   DIST `.tmp/w7-today-dist` and SCRATCH `.tmp/w7-today-build` (build.mjs:37-38): food.test.mjs:900,
   machine-settings-ui.test.mjs:953, package.test.cjs:27 and :370, problem.test.mjs:244, :260, :1952, :3561.
   The build reads back esbuild's SCRATCH app.js and meta.json (w6/build-browser.mjs:22, :54; build.mjs:497,
   :509), unlinks non-assets in DIST (:519), writes DIST non-atomically (:521) and asserts readdir == ASSETS
   (:522 PACKAGE-ALLOWLIST FAIL). Failure modes:
   - a) package.test.cjs:366-372 plants unapproved-test-asset.txt in the shared DIST. A concurrent build can
     delete it (:368 "Missing expected rejection"), see it after its unlink loop (build.mjs:522 fails) or race
     another unlink (build.mjs:519 ENOENT). problem.test.mjs:3578 (readdir(DIST) deep-equal) also fails then.
   - b) Readers of the shared DIST can see a truncated or partial file while another process rewrites it:
     package.test.cjs:47, :55, :307-309, :338, and problem.test.mjs:42 readAsset (used at :261, :3562).
   - c) Another process's esbuild can leave SCRATCH half-written. That gives a SyntaxError at build.mjs:497,
     or BUILD-ID/COMMIT-INJECTION FAIL at :509.
   - d) setup.test.mjs:931-932 reads DIST but never builds it, so it depends on which file runs first:
     ENOENT on a fresh checkout, or a partial read mid-rewrite.
2. **Fixed sleep, then a hard assert on a durable encrypted-store result:** setup.test.mjs:1471-1474 (50 ms),
   problem.test.mjs:989-990 (50 ms), gym.test.mjs:507-509 (60 ms) and :499-501 (20 ms), and problem.test.mjs:876
   with :884-886 (the early tap must land inside a 300 ms delayed adoption).
3. **Iteration-count waits** (a fixed number of 1 ms timers, so the real budget shrinks under load):
   - machine-settings-ui.test.mjs:139-145 waitFor, 400 x 1 ms (used at :102, :109, :484, :537-597, :929,
     :1044, :1592-1617), and :1023-1028, 600 x model.read.
   - until(), 400 x 1 ms: gss-annex-g6-g8:39-45, gss-annex-log-timing:39-45, gss-annex-timing:37-43.
4. **Tick-count settles, then an assert:**
   - copy.test.mjs:110 (60 x 2 ms), checkin.test.mjs:406 (50 x 2 ms), view.test.mjs:76.
   - gss settle(8): g6-g8:27-29, timing:31-35, remount:24.
   - A single setTimeout(0) before a durable read: food.test.mjs:88, :1050, :1150, :1170, :1209, and
     problem.test.mjs:1026, :1046, :1058, :1135, :2077, :2246, :2382, :2419, :2615, :2626, :2643, :2774,
     :3047, :3630, :3688.
5. **Wall-clock bounds:**
   - gss-annex-identity-reentrancy.test.mjs:9: a 1500 ms SYNTHETIC_TIMEOUT, with 5 s test timeouts at :29,
     :46, :66, :78. This is the tightest bound.
   - within() and painted() at 5000 ms: g6-g8:30-55, log-timing:30-55, timing:44-51.
   - 20-60 s test timeouts: g6-g8:502-527, log-timing:359-374, remount:182-370, timing:286-351.
6. **Low or none:** package.test.cjs:29 uses port 0 (127.0.0.1:4178 is only a JSDOM URL); design.test.cjs:32
   uses mkdtemp; food:915, problem:2039 and msui:55 do not walk the copy.test.mjs:363 today-plant sibling;
   no Date.now comparisons in the tests.

Suggested test-only fix for 1 (not applied): give every buildToday() caller its own dist and scratch, as
copy.test.mjs does, and have package.test.cjs plant its probe in its own dist.
