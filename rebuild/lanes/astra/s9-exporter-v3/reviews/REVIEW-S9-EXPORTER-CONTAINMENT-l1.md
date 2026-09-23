# REVIEW S9 exporter final-input containment (l1, static only)
Reviewer: Claude Fable 5.1, independent, 2026-09-23. Nothing executed; no engine/repository module loaded.
Under review: %TEMP%/earned-s9-profile-export-preparation/export-s9-profile.cjs, sha256 verified
7541ad0eddf124dc61f08ffe2aeae97c583f61d351bf618b40c15b0344deddc4 (102 lines). Procedure read at
origin/rebuild/t2-client-core 37a18d2:rebuild/lanes/astra/S9-PROFILE-EXPORT-PROCEDURE-2026-09-22.md.
Runner traced at fe9f14b:rebuild/lanes/b/tooling/b-package.cjs (3933 lines, sha256 5321181a..fd22 =
S9.json tooling.runnerSha256 at fe9f14b; marker at line 3824, exactly one occurrence, byte-equal to exporter:10).

## VERDICT: ACCEPT WITH NAMED DEBTS (D1..D3 must be fixed or explicitly ruled before the final run)

## 1. Every input the exporter can read (exporter line : evaluated path)
argv (17-24): exactly 5; head 40-hex, runner sha 64-hex, outputName /^s9-[a-z0-9-]{1,80}$/; root = realpath(argv[3]).
env: reads only GIT_NO_REPLACE_OBJECTS (52); sets it to 1 for the run and restores (94-97). Rest of env inherited.
child_process (28-29): only `git --no-replace-objects -C <root> ...` via PATH: rev-parse HEAD, status --porcelain,
rev-parse refs/remotes/origin/rebuild/t2-client-core, show HEAD:<file> for runner, spec and every pin (30-37,64-65,77,82-84).
fs reads: <root>/rebuild/lanes/b/tooling/b-package.cjs (36,61), .../packages/S9.json (38,62), every product/executionPins/
parent file at <root>/<file> (78), realpath/lstat of the fixed scratch root (20-22) and destination (25,86-88).
Compiled runner prefix (lines 1-3823 of b-package.cjs, compiled with its real filename, 45-56) then reads, at fe9f14b:
 requires (b-package 92-95, transitively 6 more): conform/v4/postfix/{run,legacy-gates,strict-json,target,trace-v2}.cjs,
 m4/spec/{native-carriers-errors,load-write-reference,load-write-source}.cjs. Import-time effects traced: only
 native-carriers-errors.cjs:5 reads run.cjs source; run.cjs:176 and target.cjs:183 are require.main-guarded, so no
 spawn, no write, no env change at import. Reference.create (the .tmp writer) is called only in main (3847), never here.
 top-level reads: run.cjs (609), b-package.cjs itself (644), the six ORIGINAL_CODE_SOURCES (641-660); process.argv (673)
 is the exporter's substituted ['--ci','--package','S9'] (53), so the usage branch (675) cannot exit.
 spec() 1847-2085: packages/S9.json; git HEAD runner+spec (1908-1921); brief on disk if present (2082); every child argv
 target statSync (726) and executedClosure (775-793) READS THE SOURCE of each target and of every relative require it
 reaches (limit 512 files) under CHILD_ROOTS incl. rebuild/engine/test/ (427); commitExists(sourceBase) via git (700).
 parent() 2092-2199: parent artifact+review on disk (2098,2110), DECISIONS.md at the parent receipt commit via git
 (legacy-gates 21), merge-base against CHAIN_REF and HEAD (2119,2139-2140), `git show CHAIN_REF:` artifact/review
 (2137-2138), readdirSync(packages/) + parseExact of EVERY .json there (2175-2177), ls-tree HEAD and CHAIN_REF scans
 with parseExact of every acceptance-*.json on CHAIN_REF (2180-2193).
 proposed() 3389-3476: diskSha of runner, brief, carrierSuccessor, child targets (3390-3393); releaseRuling (1543-1561)
 reads rebuild/DECISIONS.md at CHAIN_REF when any product role is "released" (S9 declares 2); rulingText (1397) only
 when coverage.successors is non-null (null in S9).
No read of rebuild/conform/private, ledger/, src/, EarnedPort, soak, history.js or the built app is on any traced path;
exporter:73-76 also refuses any pin outside rebuild/ or .github/ or under rebuild/conform/private/.

## 2. Binding to sealed identity
Sealed by argv: HEAD (30), runner bytes disk == git == argv sha (36-37,61), spec bytes disk == git (38-39,62), every
product/executionPins/parent pin disk == git HEAD == declared sha (77-78), rechecked after the compile (61-65,82-84).
Bound only indirectly (clean tracked tree, 31 and 82): the 8 imported modules above, every child target and every file
executedClosure reads, the brief, packages/*.json siblings. Not bound at all: CHAIN_REF (see D1), git binary (PATH), node.

## 3. Outputs and overwrite
Only <fixed scratch root>/<outputName>/ created with mkdirSync (86, refuses if it exists 26) and two files written with
flag wx (89-90): acceptance-s9-ui-pins.json = JSON.stringify(artifact,null,2)+LF, review = {version:1,status:PENDING,
receipt:null}. Nothing under <root> is written by the traced path (logDir/mkdirSync live in main, 3827). Stdout: one
success line with two sha256 (91) or the bare word REFUSED (93); console.log/error silenced during compile (54);
git stderr is piped, never inherited (29, legacy-gates 7). Artifact content = spec fields + sha256 pins + parent
coordinates (3445-3475): no raw values, no private census, no protected-source text. A failed write after mkdir leaves
an incomplete directory (procedure says so; not a defect).

## 4. Findings
D1 (MEDIUM, fix): refs/remotes/origin/rebuild/t2-client-core is a REAL input (parent ancestry 2119/2140, artifact and
 review bytes 2137-2138, sealed-rival scan 2191-2193, release ruling line 1554) but the exporter only asserts it did not
 move during the run (33-35,65,84); its sha is not taken from argv and not recorded in either output. Add a 6th argv
 (expected chain sha) asserted at 34 and record it in the review envelope, else the export is not reproducible.
D2 (MEDIUM, authority): exporter:77-78 does `git show HEAD:` and fs.readFileSync on EVERY product pin, and S9 product at
 fe9f14b carries all five protected engine files (seed/migrate/merge/index/oracle-shim.cjs) as carried pins; executed
 Closure (783) may also read them through relative requires from rebuild/engine/test/. Hash-only, never executed, never
 emitted, but it is a protected-source READ that the procedure itself says is not yet authorized. Needs an explicit PM line.
D3 (LOW, fix): the 8 imported modules are not sha-pinned by exporter or spec; they ride on `status --porcelain` alone,
 which ignores .gitignore/info/exclude entries and trusts GIT_DIR/GIT_WORK_TREE from the caller's env. Scrub GIT_* env
 (keep the one it sets), add `git rev-parse --show-toplevel` == root, and hash those 8 files against HEAD in the 77-78 loop.
D4 (INFO): fe9f14b S9.json is NOT a runnable final input: 20 of 33 children carry needle null (refused at 1951), coverage.
 superseded is {status:TO_COMPLETE_BY_PM} (keys refused at 1631), no release block while 2 files are "released"
 (RELEASE-NOT-RULED 1551). The exporter would print REFUSED: correct. D5 (INFO): git (PATH) and node are unpinned by the script.
Refusal paths verified: every assert/throw (argv, sha, dirty tree, moved HEAD/CHAIN_REF, existing destination, junction
scratch, pin outside rebuild|.github, private prefix, missing marker) lands in the one catch (92-93): exit 1, no text.
Not done: nothing executed (rules); chain ledger lines 756/771-776 not opened (ledger paths are forbidden to this role).
