# S11 DISTFIX - builder report (PM ruling DECISIONS:888, plus coordinator round 2)

Worktree C:\Users\joeym\AppData\Local\Temp\earned-s11-dist, branch rebuild/b-s11-distfix at
c55036c (confirmed from the worktree HEAD ref). One file edited:
rebuild/m3/w7-preview/today/test/copy.test.mjs. No test run, nothing built, no commit, no push.
`git status --porcelain`: ` M rebuild/m3/w7-preview/today/test/copy.test.mjs` only.

Round 2 (coordinator): the three default buildToday() calls that read only in-memory results
were ALSO moved to their own directories, because a default build still writes and re-reads the
shared SCRATCH bundle and meta.json inside build.mjs and so can collide with a parallel default
build. No test in copy.test.mjs now builds into the shared .tmp/w7-today-dist or
.tmp/w7-today-build.

## Hashes
- pre  copy.test.mjs sha256 290a90ab6d79c5558a01067b9755192655cd1fe465581bdb8cc358e24fd9f9e5
  (kept at s11-distfix-scratch\pre\copy.test.mjs; git blob 2659dcb)
- post copy.test.mjs sha256 78779d8f3f73f9ddf368e39550e8eec005bb5f1da3ef647ee20c4856d53d9d3e
  (git blob d733659ddcc48ea73ca64fd8f9c15e2862638d70; 45616 bytes, LF, 0 CR; added lines ASCII)
- diff: 16 insertions, 6 deletions. Exact `git diff` in s11-distfix-scratch\copy.diff
  (sha256 25a020f15581ddec884b7d5e1d6348887e0ec1eaf910bd0237f361940d5cbd48).
- Every removed line is a `buildToday()` call or P1's asset-read line (DIST -> result.dist);
  no assert line is touched (checked on the diff's -/+ lines).

## Sites CHANGED (old line -> new line, own directories beside DIST)
1. P1 "the built page carries no dash..." old :168-169 -> :171-173: w7-p1-dist / w7-p1-build,
   assets now read from result.dist (it re-read the shared DIST from disk).
2. A1 "the built bundle EVALUATES..." old :209 -> :214-215: w7-a1-dist / w7-a1-build
   (it read app.js and index.html from result.dist = shared DIST).
3. planted() `const clean` old :385 -> :392-393: w7-clean-dist / w7-clean-build (round 2).
   planted() runs from both REFUSES tests, sequentially in one process, so one name is enough.
4. REFUSES-in-markup `const again` old :401 -> :409-410: w7-again-markup-dist / -build (round 2).
5. REFUSES-in-string `const again` old :411 -> :420-421: w7-again-string-dist / -build (round 2).

## Sites LEFT, with reason
- Launch guard old :273-274 -> :279-280: already on its own w7-launch-guard-* dirs (the pattern).
- planted() copy-tree build old :381 -> :387: already on its own per-pid w7-plant-* dirs.
- No other buildToday() call and no other DIST read in the file.

## Prose citing copy.test.mjs line numbers elsewhere (listed, not edited)
- package.test.cjs:116 cites copy.test.mjs:36 (import line, unchanged).
- package.test.cjs:139 cites copy.test.mjs:395 and :405 (the two REFUSES tests); they are now
  :403 and :414. Prose drift only.
- Only package.test.cjs was searched for copy.test.mjs line citations (as the brief named it).
  Separately, nothing in rebuild/m3/w7-preview, rebuild/lanes/b/tooling, .github or .gitignore
  names the .tmp/w7-* output dirs except build.mjs and copy.test.mjs itself (forbidden paths
  excluded by path first). .tmp/ is ignored (.gitignore:4).

## Diff (-/+ lines and hunk heads; exact bytes, with context, in copy.diff)
```
@@ -165,8 +165,12 @@  (P1)
-  const result = await buildToday();
-  const assets = ASSETS.map((name) => [name, fs.readFileSync(path.join(DIST, name))]);
+  /* ITS OWN OUTPUT DIRECTORIES, as the launch guard below: other suites rebuild the
+     SHARED dist in parallel processes, so reading it back could see a half-written
+     app.js. The accepted build is byte-for-byte the same; only the path moves. */
+  const result = await buildToday({ dist: path.join(DIST, '..', 'w7-p1-dist'),
+    scratch: path.join(DIST, '..', 'w7-p1-build') });
+  const assets = ASSETS.map((name) => [name, fs.readFileSync(path.join(result.dist, name))]);
@@ -206,7 +210,9 @@  (A1)
-  const result = await buildToday();
+  /* Its own output directories too, for the same reason as P1 above. */
+  const result = await buildToday({ dist: path.join(DIST, '..', 'w7-a1-dist'),
+    scratch: path.join(DIST, '..', 'w7-a1-build') });
@@ -382,7 +388,9 @@ async function planted(file, find, replace) {
-    const clean = await buildToday();
+    /* (its own output directories, as every build in this file: see P1 above) */
+    const clean = await buildToday({ dist: path.join(DIST, '..', 'w7-clean-dist'),
+      scratch: path.join(DIST, '..', 'w7-clean-build') });
@@ -398,7 +406,8 @@  (REFUSES in the markup)
-  const again = await buildToday();
+  const again = await buildToday({ dist: path.join(DIST, '..', 'w7-again-markup-dist'),
+    scratch: path.join(DIST, '..', 'w7-again-markup-build') });
@@ -408,7 +417,8 @@  (REFUSES in a string)
-  const again = await buildToday();
+  const again = await buildToday({ dist: path.join(DIST, '..', 'w7-again-string-dist'),
+    scratch: path.join(DIST, '..', 'w7-again-string-build') });
```

## Checks the builder ran (none executes a test or builds)
- `node --check` on the new copy.test.mjs and on hammer.mjs: exit 0.
- PowerShell parser on stress.ps1: 0 parse errors.

## PM-RUN (s11-distfix-scratch\PM-RUN.txt, sha256 bfb6496f35ed9a6a4431edf376052c9e51d8bf1db58a77a3f88e7cee5e4a1659)
Harness: hammer.mjs (sha256 ab11a2c10bc6b6984b75caf2a551a015df7d3cf14ce9d9497eca838d3f284ad9),
stress.ps1 (sha256 9b7dd5d42857b0ade477e21dfff6b56c8a3e1df4824672f915e3eac1599d40eb), now with
-Target P1 (default) | MARKUP. From the worktree root, TZ=America/New_York,
MEASURED_TEST_NOW=2026-09-03:
- (a)  RED   P1:     `stress.ps1 -Pre -Iterations 40 -Hammers 3` -> FAILED k/40, k >= 1.
- (b)  GREEN P1:     `stress.ps1 -Iterations 40 -Hammers 3` -> FAILED 0/40.
- (a2) RED   MARKUP: `stress.ps1 -Pre -Target MARKUP -Iterations 40 -Hammers 3` -> k >= 1
  (narrower window than P1; escalate to 100/4; if still 0, record NOT OBSERVED, not shown).
- (b2) GREEN MARKUP: `stress.ps1 -Target MARKUP -Iterations 40 -Hammers 3` -> FAILED 0/40.
- (c)  full today-17 argv (S11.json children[0].argv verbatim) once, no hammers alive ->
  "# pass 829", "# fail 0".
Full commands and expectations are in PM-RUN.txt.
