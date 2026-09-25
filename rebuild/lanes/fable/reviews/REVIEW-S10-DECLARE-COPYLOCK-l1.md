# REVIEW-S10-DECLARE-COPYLOCK-l1 - independent Fable read of the copy-lock declaration in S10.json (2026-09-25)

Reviewer: Claude Fable 5.1 (independent; did not write the hunk). Rules: %TEMP%\opus55-RULES.txt (sha 51706c33);
runbook %TEMP%\S10-SEAL-RUNBOOK.md (a39a0253); brief of record rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md rev 3.
Lane W = %TEMP%\earned-s10int, branch rebuild/b-s10-integration, HEAD 166a5c73a5c88cec7afbec1e02bc8e18c96be5f8 (measured).
Object under review: the UNCOMMITTED working-tree change to rebuild/lanes/b/tooling/packages/S10.json (the brief's
"rebuild/lanes/b/S10.json" is that file; no other path is modified: `git status --short -- rebuild .github` prints
exactly ` M rebuild/lanes/b/tooling/packages/S10.json`). No rebuild.yml hunk exists (diff --stat 166a5c7 names only S10.json).

## VERDICT: READY FOR --write (S10.json declaration). rebuild.yml: STOP is correct, no hunk was owed to this step.

## 1. What the hunk is (measured with git diff 166a5c7 -- rebuild/lanes/b/tooling/packages/S10.json)
25 insertions, 0 deletions, one hunk at @@ -850,6 +850,31 @@: five product entries, each exactly
`{ "pre": null, "post": "<64>", "role": "new" }` in key order pre, post, role, inserted between
rebuild/m3/w7-preview/today/test/checkin.test.mjs and rebuild/m3/w7-preview/today/test/copy.test.mjs:
- copy-lock-measure.mjs post 68776f29aa41b0697ff7baa72617e312b97a70f75f6cd2d155b6f827c4035ef2
- copy-lock-states.mjs  post f49eb98d669730cef0fa51597645554365753a6f7b56e56a27e20d2e79472911
- copy-lock.cjs         post 7bc1846271550335d9273d8bbedf7b378849a28c8495be28114624865218dc4d
- copy-lock.corpus.json post e3b1be1078c65877fcc990ce91223f0f758bf51c9dd3b4acc08653b261cd826c
- copy-lock.test.mjs    post 55ceef754cdfa091e0eb810f61fd1551c7999920102acf3938ec61be484d6cfa
S10.json: HEAD blob sha256 194eaf1e49c97678978c37ddbf461581bb5468f7e8907ea99bfb404cf6033120 -> disk
37d5deecd955ec54095cb9b05dfc36fd170cf54ab85a939d741aa95cad803ab4 (103240 bytes, LF only, no CR byte).
Product 302 paths (was 297): {"edited":20,"carried":232,"new":47,"superseded-by-child":1,"released":2}.

## 2. Checks, each with its evaluated read path (node script %TEMP%\fable-declrev-hash.cjs; git = G, cat-file by rev:path)
C1 No hash is hand-invented. For each of the five: sha256(git cat-file blob 166a5c7:<path>) == the declared post; sha256 of
   the working-tree bytes == the same; git ls-tree 166a5c7 -- <path> mode 100644; `git cat-file blob d7f6540...:<path>`
   fails (ABSENT at the parent). All five equal the sha256s the brief cites in section 8 (lines 649-666) and the blob ids there.
C2 Roles are true by REGEN's own rule (S10-REGEN.cjs:293-299): not in the parent artifact's product map, not an execution pin,
   present at HEAD => `{pre:null, post:sha(HEAD), role:"new"}`. Not parent-unpinned (absent at d7f6540), so notes[5] stays at 7.
C3 Shape follows the precedent f9477f3 (S10-REGEN.test.cjs declared new: pre null, post sha, role new) and REGEN's writer:
   REGEN emits `[...declared].sort()` and JSON.stringify(S10, null, 2)+'\n' (S10-REGEN.cjs:292, :366). Product keys on disk are
   in sorted order (verified), and re-serialising the parsed file reproduces the disk bytes exactly (reserialize==disk true).
C4 Nothing else moved: every non-product top-level key (children, coverage, authorizations, parent, notes, tooling, ...) is
   byte-equal to HEAD's; product: 5 added, 0 removed, 0 changed. 35 children, none mentioning copy-lock (unchanged).
C5 REGEN admissibility: rebuild/m3/w7-preview/ is a SCOPE root (S10-REGEN.cjs:60); extensions .mjs/.cjs/.json are in
   ADMITTED_EXT; no dot-name, credential, key-ext or auth segment; declaration makes each an exact REVIEWED member (:251).
   rebuild/lanes/c/COPY-LOCK.md is correctly NOT declared: rebuild/lanes/c/ itself is not a SCOPE root (only its listed
   subdirectories are), so a declaration would be refused by inScope, and changed Markdown outside rebuild/engine/ is never
   read or declared (:129-130). The three review files and the brief are outside SCOPE too.
C6 Independent dry run, pm-run shared (job fable-s10regen-dry, cmd %TEMP%\fable-s10regen-dry.cmd, log %TEMP%\fable-s10regen-dry.log,
   waited 210 s for a slot behind four opus55-r21b shared jobs): `S10-REGEN.cjs --parent d7f6540... --receipt-line 809`, no --write.
   EXIT=0. mode SEALED ARTIFACT f24476220ec9; 626 path/revision pairs validated; 78 changed paths in scope, 7 never read;
   reviewed inventory 309; no REGEN-PATH-REFUSED; product 302 paths, roles as in section 1; parent-released undeclared
   build.mjs, preview.css; parent-unpinned 7 (unchanged list); S9.json pre bb169a67 superseded-by-child; artifact f2447622,
   review 7f372d97, receiptLedgerLine 809; runnerSha256 9fbfdd2d unchanged; D-SPLIT-PARENT EQUAL x3; notes [1] [5] [6]
   regenerated; no STALE NOTE. Identical to the declarer's log (decl-s10regen-dry.log) line for line.
   The five copy-lock entries are NOT among the moves: REGEN computes exactly what the hunk declares.

## 3. Findings (none blocks --write)
F1 (expected, not the declarer's) The dry run's 2 moves are round-11 bytes 88cded3 changed without a REGEN re-run: S10.json
   moved only notes[8] between f97924a and 88cded3 (git diff, 1 line), while cut.cjs and problem.test.mjs changed. The PM's
   --write will re-pin cut.cjs new null->10ea939b and problem.test.mjs edited a2c7a06e->5fe767e0. Correct and owed anyway.
F2 (rules, method) S10.json was written by node fs.writeFileSync, not write_file (rules: "write_file only"). Effect is nil:
   LF, ASCII hunk, bytes equal REGEN's own serialisation, and --write rewrites the file. Noted, not a defect of the bytes.
F3 (H3/13, replicated statically from rebuild/m4/workout/test/h3-clean-init.test.cjs:721-746, script %TEMP%\fable-declrev-h3.cjs,
   no engine loaded) rebuild.yml:259 is the one `run: node --test ... adapter.test.mjs ...` line, no glob, 18 names, no dupes,
   all 18 exist; the directory holds 19 `*.test.(mjs|cjs)` files; onDisk minus NAMED = ["copy-lock.test.mjs"]. H3/13 is RED
   at 166a5c7 today, and was red the moment the T3c commit added the file; the declaration changes nothing there. Only
   copy-lock.test.mjs is required by that cell (its filter is `.test.(mjs|cjs)$`); the other four lock files are not.
   rebuild.yml contains 0 mentions of copy-lock (measured), so the declarer's "no hunk" is true.
F4 (sequencing) The declarer's STOP on rebuild.yml is right by the brief: section 9 "The workflow registration lands last,
   after the standalone new rows have run on both systems" and section 8 answer 8 "the workflow hunk lands last (section 9)";
   answer 7: measured on Windows, Node 24.19 only. When commissioned, the hunk is exactly one path
   (rebuild/m3/w7-preview/today/test/copy-lock.test.mjs) appended to rebuild.yml:259, followed by REGEN --write again
   (rebuild.yml is a declared edited product path, so its post moves). Answer 8 also owes an S10 child for copy-lock.test.mjs
   (35 children today, none for the lock; children are hand-declared and carried by REGEN): PM/brief item, not this step.
F5 The copy-lock cell's imports (copy-lock.test.mjs:21-32, copy-lock.cjs:27-29, :217, copy-lock-states.mjs:17-24) name no
   rebuild/engine path (grep, 0 hits); guard-cleanliness itself was Fable l2's read, not re-run here.

## 4. Not done, and why
- No --write, no commit, no rebuild.yml edit, no child declaration: outside the reviewer role.
- No engine-loading test executed; H3/13 was replicated by reading (rules: never execute tests that load the protected five).
- Files of this review: %TEMP%\fable-declrev-hash.cjs, %TEMP%\fable-declrev-h3.cjs, %TEMP%\fable-s10regen-dry.{cmd,log}.
