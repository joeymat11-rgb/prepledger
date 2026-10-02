# Hosted NATIVE-LOAD mutation sweep

## Design
- `.github/workflows/native-load-sweep.yml` runs on a push to `obs/sweep-*` (or by hand once the file is on the
  default branch; GitHub lists workflow_dispatch only from there). Jobs: `plan` -> `sweep` (matrix of N shards,
  ubuntu-latest only, fail-fast off) -> `merge`.
- The branch carries the mutant list `.github/native-load-sweep/mutants.jsonl` (JSONL, ASCII). Header
  `# nlsweep-list/1 shards=N per_shard=P ...` sets the matrix (dispatch inputs override; else 20 and 2; capped at
  the mutant count and 256). Each line: `{id,file,mode,tests,before,after,st,re,cls,line}`; mode cjs|fs|esm.
- `allow.cjs` (D-HSW-2, DECISIONS:854): one entry rule for plan and shard, applied before anything is read. The
  target must be byte-exactly one of rebuild/engine/native-load.cjs (cjs), rebuild/m4/workout/native-load-effects.cjs
  (cjs), rebuild/m3/w6/local/today-bindings.mjs (esm), rebuild/m3/w6/local/source-admission.mjs (fs),
  rebuild/m3/w7-preview/today/today-entry.mjs (esm; the Today panel, added at DECISIONS:856 (1)), in that
  file's mode; tests a duplicate-free subset of exactly fc12, fa03. `plan` refuses the WHOLE list on any refused
  entry (ENTRY_REFUSED, positions and codes only; no shard starts); `shard` records it ERROR-LIST.
- `shard.cjs`: shard i takes list positions k with k % N == i. Per mutant: allow.cjs, then the protected-five fence
  (case-insensitive, redundant), count the anchor in the checkout text (!= 1 -> ERROR-ANCHOR, nothing runs), then
  per listed test one `node --require guard.cjs --require overlay.cjs --import deps-loader.mjs --test
  --test-reporter=tap <WHOLE FC12 | WHOLE FA03>` with TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03, cwd = root,
  300 s wall clock (TIMEOUT, process group killed). The child's overlay count must be exactly 1 (else ERROR-APPLIED),
  every GUARD line must read `none; refused: none` (else ERROR-GUARD); then red top-level row -> KILLED, all green and
  exit 0 -> LIVE, exit 1 without a row -> KILLED-NOROW, else UNKNOWN.
- `merge.cjs` checks every shard 0..N-1 reported once against the same list sha256 and that every (mutant, test)
  pair has exactly one record (else MISSING); writes ONE file `native-load-sweep-results.jsonl` (header line:
  complete, clean, counts, problems, node, commit, run; then one record per pair in list order). It is uploaded as
  artifact `native-load-sweep-results` (30 days). The per-shard hand-off artifacts `nlsweep-shard-*` carry the same
  public fields and simply expire after 1 day (D-HSW-1: no job holds actions: write; every job is contents: read,
  and nothing deletes artifacts, so "re-run failed jobs" keeps the good shards' hand-offs). The last step fails when
  complete=false (after the upload). clean=false (any ERROR/TIMEOUT/UNKNOWN) is data, not a failure.
- Dependencies: exactly rebuild.yml's public-gates installs and nothing more: `npm ci --no-audit --no-fund
  --include=dev` (root: jsdom 30.0.0 for FA03, esbuild, yaml, react), `npm install -g pnpm@9`, `pnpm --dir
  rebuild/m3/w6 install --frozen-lockfile`, `pnpm --dir rebuild/m3/w5 install --frozen-lockfile --ignore-scripts
  --ignore-workspace`. FC12 needs only node: built-ins; FA03 needs jsdom; the product modules under
  rebuild/m3/w6 resolve from W6's node_modules.

## Differences from the PC runs (rounds 24-28, run2.ps1 under pm-run shared)
- OS: ubuntu-latest (case-sensitive paths, LF checkout) instead of Windows 11. The overlay compares lower-cased
  absolute paths on both, as the PC preloads did. All 3192 round-27 anchors are single-line or LF-only (106 are
  multi-line, 0 contain CR) and all 3192 are unique in today's earned-nlr text.
- Node: pinned 24.19.0 (SWEEP_NODE), the PC's version. rebuild.yml takes the newest 22.x; the esm overlay needs
  module.registerHooks (present in 24.19.0; it refuses with ESMOVERLAY_NEEDS_MODULE_REGISTERHOOKS otherwise).
- Guard: guard.cjs is byte-identical to the PC's nlr-build/guard.cjs (sha256 d559cf47...bff920). deps-loader.mjs
  is the PC loader with its two fixed PC parents replaced by NLR_DEPS_DIRS (default root/rebuild/m3/w6/node_modules
  then root/node_modules; the PC used earned-adm's W6 and earned-astra-47's root junctions); NODE_PATH is set to the
  same list, as on the PC. overlay.cjs merges the three PC preloads (r17c cjs, 21b fs, 24b esm) with the root from
  NLR_ROOT instead of the fixed earned-nlr path; same split-on-anchor rule and same exit line.
- Stricter than the PC tally: applied != 1 is an error status (the PC tally recorded it and the classifiers read
  it); guard requires the child GUARD line and no dirty GUARD line (the PC tally took any clean line); the anchor
  is pre-counted. Whole files only: no --test-name-pattern and no NLR_SKIPWALK screen. NODE_OPTIONS is cleared.
- Concurrency: per_shard (default 2) test processes on a 4-vCPU runner; the PC ran 3-4 shared slots per machine.
- Test bytes: the hosted run sweeps the test and product files COMMITTED on the pushed branch. The PC runs read
  the earned-nlr worktree, which carries uncommitted test edits (during the local proof another seat was editing
  FC12/FA03 there: FC12 grew 349 -> 387 tests between runs). Commit the exact bytes to be swept.
- Results table: the red column carries the first failing row id and `+<red rows - 1>`, not up to three ids.

## Public-log disclosure boundary (the repository is public: logs and artifacts are public)
- Logged per run: `NLSWEEP i/N <id> <file> <test> <status> applied=<n> pass=<p>/<t> fail=<f> first="<title>"`;
  per shard one count line; merge prints counts and problem codes only. Scripts never echo TAP, stderr, stack
  traces or product text; unexpected exceptions print only an error code. First failing title is cut to 200 chars.
- The results artifact holds the same fields plus exit code, seconds, guard ok and red-row count. The mutant list
  itself contains before/after fragments of public product files; it is committed on the branch, never logged.
- Side effect to know before pushing: deploy.yml triggers on push to '**', so an obs/sweep-* push also runs its
  `suite` job and its `preview` (draft deploy) job. soak.yml was not read (protected name); check its trigger.

## Expected wall time (measured on the PC proof: FC12 LIVE 18-19 s, KILLED 1-7 s; FA03 LIVE 30-32 s, KILLED 1-2 s)
- 3000 mutants, FC12 each (TB on FA03): about 36,000 run-seconds; 20 shards x 2 = 40 lanes -> about 15 min of
  runs, plus about 3 min setup and 1 min merge: 20-30 min wall if ubuntu-latest is 1-1.5x the PC per process.
- With the FA03 follow-up on every FC01/FC03 mutant (all 3192: 6135 runs): about 124,000 run-seconds -> 55-80 min.
- Worst case (every run LIVE, FC12 only): 3000 x 19 s / 40 = 24 min of runs. Job limit 350 min per shard.
- The PC equivalent: 3000 x ~11 s on 3-4 slots = 2.3-3 h.

## How the PM uses it
1. On the PC (static, one shared slot): `node pc-sweep.cjs list --generated --root <earned-nlr> --out
   mutants.jsonl` = EVERY mutant of the four files in round 27's generator output (mutB-list.txt, 3192), each
   marked `re` = confirm-killed (K R K28) | confirm-live (E SS U SL) | measure (L N MISSING). Or `--status
   L,MISSING` / `--ids F` (per-id tests), plus `--fa03-followup`, `--shards N --per-shard P`. `--te` appends the TE
   family (pass 2, DECISIONS:856 (1)): the 56 single-clause mutants gen-te.cjs writes for the Today panel's native-load
   region, today-entry.mjs:241-313 at bd7654a (answer, paint, the controller api), round 27's operator classes, ids
   S30-TE001..056, mode esm, each on FA03 (FC12 does not load the panel), re = measure. Statuses: round 27
   mutants-status.txt, overridden by round 28 A/B final-status and C tab-tbsa. It warns on anchors not unique in
   --root and refuses any target outside the five allowed files.
2. Create `obs/sweep-<name>` from the head to sweep, add this directory, the workflow file and mutants.jsonl,
   commit, push. rebuild.yml, shared-preflight.yml and slice-host.yml do not fire on obs/**; deploy.yml does.
3. Download artifact `native-load-sweep-results` from the run. Then `node pc-sweep.cjs table --results
   native-load-sweep-results.jsonl --prefix h1 --out tab-h1.txt` gives round-27 tally lines
   (`h1-S27-K001-fc12 | KILLED | 67/349 | exit 1 | applied 1/0 | guard True | N02a +260`) that status.ps1's Mark
   and the classifiers read; `compare --list mutants.jsonl` sets them beside every round-27 row of the same pair and
   counts each own-test result against its `re` mark (AGREE / DISAGREE by id; FA03 follow-ups are always measure).
4. A failed shard can be retried with "re-run failed jobs" (nothing deletes the hand-offs); a fresh push also works.

## Local proof (PC, pm-run shared, one slot, --par 1)
- 3 shards x 5 mutants (FC01 K001 K002 K004 K042 K202, FC03 P001 P004 P071 P134, SA A001 A004, TB H004 H012 H007
  H022; K042 K202 P071 also on FA03): 18 runs, KILLED 9 LIVE 9, merge complete and clean, compare SAME 18 DIFF 0
  against the decisive round-27 rows (a pattern or skip-walk pass counts only when it KILLED).
- Negatives (shard): bad anchor -> ERROR-ANCHOR (no run); FILE_NOT_ALLOWED (never read) for rebuild/engine/index.cjs,
  rebuild/m3/w7-preview/fixtures.cjs, the upper-case and the `..` spelling of native-load.cjs; MODE_NOT_FILE_MODE;
  TEST_NOT_ALLOWED for zz99, toString, FC12; S27-A003 under FA03 -> ERROR-APPLIED 0/0 (round 27 x2 had it LIVE).
  Negatives (plan): that list is refused whole (ENTRY_REFUSED 8, exit 2); allowed-only entries pass. Merge with the
  wrong shard count -> complete=false, SHARD_ABSENT, SHARD_COUNT_MISMATCH.
