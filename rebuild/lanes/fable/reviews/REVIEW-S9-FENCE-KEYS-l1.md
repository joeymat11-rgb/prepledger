# REVIEW-S9-FENCE-KEYS-l1: S9 round 6 (Fable l1 D1, fence SPEC_KEYS) - independent review (claude-fable-5-1, 2026-09-24)

Reviewed: the UNCOMMITTED round 6 in %TEMP%\earned-s9int (rebuild/b-s9-integration, HEAD ffb31c6 = origin), the three
paths `git status` shows modified: rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs, rebuild/lanes/b/tooling/packages/S9.json
and rebuild/lanes/b/S9-FINAL-ASSEMBLY-PREP.md (section "Round 6"). Read-only for all three. Nothing committed, fetched,
switched, stashed or reset by me. Authorities: opus55-RULES.txt whole; DECISIONS :777-:799 from the PM tree (799 lines);
REVIEW-S9-BLOM-2B-l1.md (my l1, whose D1 this round pays) read whole. Every git query named explicit paths; no *soak* name,
no protected-five path and no rebuild/engine path was opened, hashed or loaded. Every sha256 below is node crypto over raw
bytes (git show via child_process Buffer, or fs.readFileSync); no PowerShell redirect was hashed or diffed.

## VERDICT: ACCEPT WITH NAMED DEBTS
The diff is exactly what round 6 claims and nothing more: the fence's by-value SPEC_KEYS copy becomes the runner's 22 keys,
condition (1) applies the runner's own freeze pattern, one new row (33) holds condition (1) to H5 in both directions, the
fence's S9 product pin and its child needle move with it, and the assembly report gains a "Round 6" section. Red-first evidence
is real and I reproduced it byte-for-byte; the green run, the needle and the staticcheck are reproduced too. No assertion
outside condition (1) moved, and condition (1) now admits exactly what b-package.cjs spec() admits (modulo a pre-existing
comparison nuance, D1 below, disclosed by the builder as O1 and now measured). Debts D1-D4 are named; none blocks.

## 1. Scope of the diff (measured)
- `git diff --numstat` on the three paths: fence +58 -5 (three hunks: comment :75-83 -2 +9, SPEC_KEYS :87 -1 +1, condition (1)
  :287-289 -2 +3, new row :1925-1968 +45); S9.json +2 -2; PREP.md +91 -0. No fourth path is modified in the tree.
- Fence: HEAD blob af7b6f34a10d6a36c2982ae0713ff127a26a4e34736ac69346b6f3e66822a29c (122314 B, 1942 lines) -> disk
  606ad877cdd4cc297b13384c9290967cf9112fb8f6ed1ba995efb38907c4cd78 (126228 B, 1995 lines); both CR 0, pure ASCII.
- S9.json: HEAD c05a8e34639d8545eba36d7902f442637c7037e1a1a58e077ded0e6186038c8f -> disk
  c5df18f1ec8a1e2d069fef4f46e396c81690167616cdd2373521d02cdffa4975 (91266 B and 1781 lines both). Parse-compared value by
  value: EXACTLY two leaves moved, product["rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs"].post af7b6f34 -> 606ad877
  and children[24].needle "# pass 53" -> "# pass 54". 22 top-level keys in the same order; `JSON.stringify(parsed, null, 2) +
  "\n"` byte-equal to both files; CR 0; U+2013 16 / U+2014 17 in both (none added); 32 children. The string
  "sealed-inventory-fence" occurs 3 times (product key, child name, child argv[2]); "af7b6f34" 0 times; "# pass 53" 0 times.
- PREP.md: HEAD ed2386e5 (14899 B) -> disk 637fc468827a54e7fb4e217b6cdf4e3de28fabe7cb3878463110b839e52c55d6 (24200 B, 230
  lines); the 91 added lines are pure ASCII; CR 0; U+2013/U+2014 0 in both.
- The product pin is byte-exact: sha256(disk fence) === S9.json product post 606ad877 (measured true). b-package.cjs on disk =
  HEAD = 5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22 = S9.tooling.runnerSha256 (read as text, never loaded).

## 2. The key closure mirrors H5 exactly
- b-package.cjs:1172-1183 (read at the numbers): SPEC_KEYS is 21 keys plus 'release' at :1183 with the H5 comment at
  :1175-1182; spec() closes it at :1852 `keys({ ...s, release: null }, SPEC_KEYS, 'Closed package-spec keys')`, and keys()
  at :681 is `assert.deepEqual(Object.keys(o).sort(), list.slice().sort(), label)`.
- Fence :84-87: SPEC_KEYS extracted from both source texts by regex: 22 and 22, equal as sets AND in the same order.
- Fence :288: `Object.keys({ ...spec, release: null }).sort().join(",") !== [...SPEC_KEYS].sort().join(",")` -> bad(1). Same
  freeze pattern; the refusal text now cites :1172-1183 and :1852 (was :1071). Nothing else in (1)-(5) moved (read :270-333).
- specFile() (:429-441) builds fixtures from SPEC_KEYS, so every fixture spec now carries release: null without any edit to
  it; row (20) at :1341 asserts Object.keys(spec) sorted == SPEC_KEYS sorted and holds unedited. No skip, no environment
  switch, no softened assertion anywhere else: the only assertion-bearing change is the new row.
- Direct probe of the working condition (1) against the REAL S9.json (%TEMP%\fable-s9r6\probe.cjs, pure expression, no test
  run): real spec admitted; release absent admitted; release null admitted; +releaseNote refused; +children2 refused;
  +freeze refused; +released refused; release standing in for a deleted required key (status) refused; empty-string key
  refused. Condition (1) refuses every unknown key I constructed. See D1 for the one comparison nuance.

## 3. Load proof, before any run
- Fence imports (:56-63): node:assert/strict, node:test, node:child_process, node:crypto, node:fs, node:os, node:path,
  node:url. Grep of the whole file for require(, import(, createRequire, spawn, execFileSync: the only spawns are
  execFileSync("git", ...) at :93-94 and the deliberately absent binary "git-s9-fence-is-not-a-binary" at :964 (row (10)).
  It reads b-package.cjs as TEXT out of git (idsOf), packages/S9.json at HEAD, the chain artifact at the chain ref, rebuild.yml
  and the artifact from disk. No protected-five path, no rebuild/engine module, no .cjs is loaded. (6.1's ":87" and ":956"
  are HEAD-file line numbers; the working file shifts them by +7.)
- staticcheck.cjs 96f96984dc2caaaab26056e1e6ae19c009660c00a30e2dad2869792c89d22723 (10918 B) and staticcheck-attip.cjs
  1338a921dfa12391e261eae660726f95deeb595c67db4d5dc21f5249a25fafdf (740 B) = 6.6's shas. Their requires: fs, path, crypto,
  legacy-gates.cjs (-> target.cjs -> trace-v2.cjs), strict-json.cjs; those four require node builtins only (legacy-gates
  :102's dynamic require sits inside build(), never called; target.cjs :128-129's loader only inside functions staticcheck
  never calls). The first PASS row prints the loaded set and it is exactly those five files.

## 4. Red first - REPRODUCED
- Constructed independently (%TEMP%\fable-s9r6\build-red.cjs): HEAD's fence blob with round 6's row (33) spliced in before
  THE REAL ROW, nothing else. Result b5bf8d6ba1ad01261d509b85ae08b5c43bba4d486005569a242bd1347335456e, 125492 B, BYTE-EQUAL
  to the builder's %TEMP%\opus55-s9r6\fence-RED-state.test.mjs.txt. Its SPEC_KEYS has 21 keys (no release) and its
  condition (1) is the old strict `Object.keys(spec).sort().join(",")`.
- Run under %TEMP%\earned-runtime.lock (taken exclusively 12:43:35Z after the fable-s10-l4 holder released it; released
  12:45:32Z; no lock of another job touched), MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, node 24.19.0,
  `--test --test-reporter=tap`, from a scratch root %TEMP%\fable-s9r6\redrepo (a .git pointer file to this worktree's own
  gitdir, HEAD's rebuild.yml and acceptance-s8-real-shape.json copied byte-exact from `git show HEAD:`, the red fence at its
  real relative path so REPO resolves to the scratch root; git use read-only; nothing written into the worktree).
  Observed: # tests 54, # pass 52, # fail 2, exit 1 (57.3 s). Row (33) not ok: "release present and null: (1)" and "release
  present as the block packages/S9.json carries: (1)" where skip was expected; release absent skipped; the five refusal
  worlds refused at (1), each with "... key closure (b-package.cjs:1071)". THE REAL ROW not ok: "this change drew 1
  refusal(s), 0 of them sealed path(s) that rebuild/m4/spec/acceptance-s8-real-shape.json at
  refs/remotes/origin/rebuild/t2-client-core (cd16a38d14e3236ea6f513052cc1a3c2c16dcacf) does not release", actual
  ["FENCE-RESEAL-CHILD-UNVERIFIED (1) rebuild/lanes/b/tooling/packages/S9.json is not the runner's own SPEC_KEYS key closure
  (b-package.cjs:1071)"]. That is 6.2 line for line. Log %TEMP%\fable-s9r6\red.log
  2e40b4b646bf9d34d76b62e6200d433666da7f42d48ff5454ec0a5a64af79242 (18610 B; differs from the builder's 9c0057fa only by
  paths and durations).

## 5. Green, needle, staticcheck - REPRODUCED
- Working fence, cwd the worktree, same env and argv: # tests 54, # pass 54, # fail 0, 1..54, exit 0 (59.6 s). ok 53 row
  (33); ok 54 THE REAL ROW (a verified skip: the red run above proves the real branch enters the reseal claim, and inside the
  claim the only green return is the skip after condition (5)). Log %TEMP%\fable-s9r6\green.log
  1bcce8c0b1d89b5820a000a46459738b1943e50e837fa802e8a989717b248942 (13119 B).
- Needle: the TAP summary carries the line "# pass 54" at line start, and S9.json children[24] (name sealed-inventory-fence,
  argv ["--test","--test-reporter=tap","rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs"]) declares "# pass 54".
  b-package matches a needle at line start (:2824), which this satisfies. Wording: the literal last TAP line is "# duration_ms
  ..."; "observed terminal line" in 6.4 means the summary line, and the needle grammar is what binds (see D2).
- staticcheck.cjs, cwd the worktree: 28 PASS, 0 REFUSED (28 lines); loaded set as in section 3; "32 children"; "255 pins";
  "spec sha256 | c5df18f1ec8a1e2d069fef4f46e396c81690167616cdd2373521d02cdffa4975". staticcheck-attip.cjs cd16a38d...: 28
  PASS, 0 REFUSED. Logs 6c674093... (1881 B) and afe1aa1c... (1887 B) in %TEMP%\fable-s9r6.

## 6. Round 6 report (6.1-6.9) checked claim by claim
- 6.1 load proof: true (section 3), line numbers are HEAD-relative.
- 6.2 red: reproduced exactly (section 4). 6.3 rule and fix: :1172-1183, :1183, :1852, :681 all re-read; fixtures via
  specFile() as stated; numstat +58 -5; 1995 lines ASCII LF: all true.
- 6.4 green and needle: reproduced (section 5). rebuild.yml:271 is `run: node --test rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs`
  (disk = HEAD bce0594f).
- 6.5 pins: both shas and the two-leaf S9.json delta re-measured true. The S10 facts hold, but at a NEWER tip: origin/rebuild/
  b-s10-integration now resolves to fc6561f (6.5 says 62788b1, the tip when the builder looked); at fc6561f S10.json still
  pins the fence role edited pre af7b6f34 / post 6abf4d4d, its fence child needle is still null, its S9.json pin is pre
  a1f9fa38 / post 5369b99b superseded-by-child, and its fence still cites :1071 at :75 and :281 (21 keys). So S10 still
  carries D1 and must rebase over row (33) and re-pin pre 606ad877 when it re-binds to sealed S9, as 6.5 says.
- 6.6 staticcheck: reproduced (section 5).
- 6.7 D2-D4: accurate. D2: legacy-order.test.mjs:178 skip rule re-read; the note's eight is walk-accurate and :799's nine
  counts s9-engine-files-differential.cjs; the PM's call, still open. D3: package.test.cjs:108 names packages/S9.json in a
  comment (re-read); the fence's key closure is at :287-289 now. D4: S10-INTEGRATION-REPORT.md at the S10 tip cites a1f9fa38 at
  :38, :45 and :63 (re-measured).
- 6.8 O1: real and now measured (D1). 6.9 order: consistent with my l1 section 9 (D1 precedes exporter/standing-step).

## 7. Named debts (numbered; none blocks this round)
D1 (PRE-EXISTING COMPARISON NUANCE, measured; the builder's O1). Condition (1) compares the sorted key lists JOINED WITH ","
  where the runner's keys() deepEquals the arrays. Probe against the real S9.json: sorted SPEC_KEYS has 21 adjacent pairs;
  for all 19 that do not touch release, deleting both keys and adding one key spelled "a,b" (e.g. "laws,notes",
  "children,coverage") is ADMITTED by (1) with the same key count. For pairs holding parent or sourceBase such a spec then
  fails (2) or (5); for the others the fence would skip on a spec the runner's own spec() refuses in the same CI run
  ("Closed package-spec keys"), and b-package's --ci is the standing step, so nothing seals through it. Also pre-existing: the
  fence parses HEAD:<spec> with JSON.parse (duplicate keys, last wins) where spec() uses parseExact. Both were in HEAD's
  condition (1) unchanged and are not widened by round 6. Pay as its own reviewed, red-first edit (compare
  JSON.stringify of the sorted arrays, or deepEqual) with one row; not in this round's scope.
D2 (WORDING, 6.4). "Observed terminal line" is the TAP "# pass 54" summary line, not the file's last line ("# duration_ms").
  The needle is matched at line start by b-package (:2824), so the claim binds as intended; the sentence should say "summary
  line" so a reader comparing against the raw log is not misled.
D3 (WORDING, 6.1 and 6.5). 6.1's ":87" and ":956" are HEAD-file line numbers (working file :93-94 and :963-964); 6.5's S10 tip
  62788b1 has moved to fc6561f with every cited fact unchanged. A PM commit message or the next round should carry the
  working-file numbers.
D4 (CARRIED FROM l1, unchanged). l1 D2 (the eight-vs-nine arithmetic between S9.json notes[4] and :799) and l1 D5 (brief
  :458-459 still reads 25 children under the binding sha abf3f670) remain the PM's to reconcile in the seal line; round 6
  correctly leaves both untouched.

## 8. Hygiene
- No *soak*, private, ledger/, src/ or protected-five path was opened, listed, hashed or loaded; the fence, staticcheck and
  their four postfix dependencies are the only repo code that ran, and only via the lock. The lock I created named this job
  and was deleted by the same script at the end of the run; the lock present before (fable-s10-l4) was not touched.
- The scratch red repo uses a `.git` pointer file to this worktree's gitdir for READ-ONLY git commands (rev-parse, ls-tree,
  show, merge-base, diff commit-to-commit); no index, ref or working-tree write happened there, and the worktree's status
  before and after shows the same three modified paths. Disclosed because it is a non-standard read path.
- This review is the only file I wrote in the worktree (LF, pure ASCII, no U+2013/U+2014). Scratch (outside the worktree):
  %TEMP%\fable-s9r6 (verify1.cjs, verify2.cjs, build-red.cjs, runall.cjs, probe.cjs, redrepo/, red.log, green.log,
  staticcheck.log, staticcheck-attip.log, runall.log).

## 9. What I could not do
- Audit the builder's process beyond its artifacts (red state file, logs); the red state file matched mine byte for byte.
- Run any S9 child other than the fence, or b-package.cjs itself (loads the protected five; PM-only under :796 (d)).
- Search earned-h20 hosted-blom/ or other worktrees' uncommitted files.
