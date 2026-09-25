# REVIEW S9 EXPORTER v3 CONTAINMENT AGAINST ACTUAL FINAL INPUTS (Fable 5.1, l1, 2026-09-24)

Verdict: ACCEPT WITH NAMED DEBTS

Owed by DECISIONS:756 and :800; PROC:28 and PROC:34 (origin/rebuild/p-s9-exporter-v3 9a29c3a). Static only: nothing was
executed except read-only git verbs and two Fable mirror scripts over public JSON and hashes; no protected file was opened.

## 1. Inputs traced (all measured, not taken from the runbook)
- Exporter EXP = 9a29c3a:rebuild/lanes/astra/s9-exporter-v3/export-s9-profile-v3.cjs.txt, 195 lines,
  sha256 576fd22ea385bbd3e0fb744526988161ebfc79f37b4b2b6015e961f374eea5a5 (byte-exact cmd extract, node crypto).
- Worktree W = C:\Users\joeym\AppData\Local\Temp\earned-s9int, HEAD e3e22e2a4399278530cb45b2e98533e102538a24 (merge of
  63bf01d and cd16a38), branch rebuild/b-s9-integration, common dir C:/Users/joeym/Documents/prepledger-dev/.git.
- Runner BP = rebuild/lanes/b/tooling/b-package.cjs 5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22, 3933
  lines, marker "8. main sequence" occurs exactly once (BP:3824); split[0] = BP:1-3823.
- Spec S9.json c5df18f1ec8a1e2d069fef4f46e396c81690167616cdd2373521d02cdffa4975: BRIEF-ACCEPTED, 255 product
  (21 edited, 201 carried, 21 new, 9 pinned-unchanged, 1 superseded-by-child, 2 released), 32 children / 81 argv targets,
  dIds [] (NO_REGISTER exempt), successors null, superseded 5 carriers, release block cited, carrierSuccessor null.
- Toolchain: node v24.19.0, git version 2.55.0.windows.3 (toolchainOk true; the git= suffix matches the stdout regex).
- Chain ref moved DURING this read: 9a29c3a session start cd16a38 -> 98f0bc9 (see D3).

## 2. What runs (compile of BP:1-3823 + spec(), parent(), proposed())
Top-level effects of the prefix, in order: require of the 8 imports (BP:92-95; transitively run->target->trace-v2,
legacy-gates, load-write-reference->load-write-source; run.cjs:143 requires acceptance.cjs only inside main(), never
reached); IDS/RETIRED asserts; R.GATES reads (BP:580-605); PIN_PATHS regex over run.cjs (BP:608); FAIL_CODES reads
b-package.cjs and the 6 ORIGINAL_CODE_SOURCES (BP:641-668); argv gate satisfied by the exporter's fake argv (EXP:100);
everything else in the prefix is a const or a function. No import has a load-time side effect: target.cjs:184 and
run.cjs:176 are behind require.main===module (false under the exporter); load-write-reference.create() and
load-write-source.verify() (the two that would read rebuild/engine text and mkdir .tmp) are called only from laws()/main
(BP:3847), which is behind the marker. Reference.create is NOT called. No node child is spawned (runRaw/gateRun/children
unreached). require.cache under W after the compile = exactly the 8 pinned imports (EXP:106-110 would refuse otherwise).
spec() (BP:1847-2085): reads S9.json (disk), runner (disk), git show HEAD:runner, HEAD:S9.json, rev-parse --verify
sourceBase, brief on disk (sha matches spec, measured), 81 argv targets exist (measured 0 missing), executedClosure over
the targets (see D1), ledger claims by sha only (claim() reads nothing), supersededSpecShape/successorSpecShape pure.
parent() (BP:2147-2227): reads acceptance-s8-real-shape.json and review-s8-real-shape.json from disk (sha = spec pins,
measured true on disk and on the tip), git show <receiptBase>:rebuild/DECISIONS.md (verifyReceipt), show m[2]:artifact,
show CHAIN:artifact, show CHAIN:review, 3x merge-base --is-ancestor, readdir + parseExact of the 13 packages/*.json on
disk and via ls-tree/show at HEAD, ls-tree CHAIN rebuild/m4/spec/ + show of 10 acceptance-*.json blobs. Measured: no
sibling spec claims the S8 artifact (only S9.json chooses S8) and no sealed artifact on the tip names it as parent.
proposed() (BP:3389-3476): diskSha of runner, spec, brief, 81 targets; releaseRuling() reads DECISIONS.md at CHAIN
(release line hashes to exactly 1 line on the tip; supersession, owner, contract, theme and brief lines also 1 each,
measured at 98f0bc9); supersededGateIds/ByCarrier pure over the parent artifact. Returns the artifact object.

## 3. Every child process
All are git, read-only, stdio ignore/pipe/pipe: from EXP, rev-parse --show-toplevel, --version, rev-parse HEAD x4,
status --porcelain -z --untracked-files=all --ignored=matching x2, ls-files -v -z x2, rev-parse CHAIN x4, show HEAD:
runner, HEAD:spec, HEAD:<8 imports>, HEAD:<266 pins>; from the runner (L.git, BP:684/691/699, inherits the scrubbed
compile env EXP:92-96), the verbs in section 2. No node child; no network verb; no write verb. The exporter's git env
drops every GIT_* and HOME/XDG_CONFIG_HOME and sets GIT_NO_REPLACE_OBJECTS=1, GIT_CONFIG_NOSYSTEM=1, GIT_CONFIG_GLOBAL=NUL.
Config actually in force under that env (measured): the shared repo-local config gives core.autocrlf=false,
core.filemode=false, core.symlinks=false, so hiding the PortableGit system config (autocrlf=true) changes nothing.
Under an exporter-like env, status lists the same 7 entries as plain status: !! .tmp/, !! node_modules/ (root,
unguarded, admitted) and the 5 under rebuild/ the clean step removes; ls-files -v non-H count 0; the common dir's
info/exclude names only _lane-c-transfer/, absent from W; ~/.config/git/ignore exists but hides nothing here.

## 4. Every write
mkdir %TEMP%\earned-s9-profile-export-results\s9-final-1 and two wx writes acceptance-s9-ui-pins.json,
review-s9-ui-pins.json (EXP:176-182), after the last read and after cleanTree() again. Nothing in W. The only other
side effect is git status refreshing the linked worktree's index under the common dir (D4). One stdout line.

## 5. Every value that reaches the output files
artifact = proposed(): version 1, lanePackage S9, packageId, sourceBase, parent {S8 coordinates, sha256s, receiptLedgerLine
528, reviewedCommit}, spec/runner {file, sha256}, dIds [], laws {}, carriedAcceptedIds, privateLiveTriggered, gates (19 ids
from run.cjs), coverage {covered [], superseded, supersededByCarrier, run, moves {}, successors null, supersessions (spec
block: whys + evidence child names), byChild {}}, authorizations (the 4 spec claims: ledger line TEXT of DECISIONS:60, :49,
:788 and review shape), product (253 x {pre, post, role}), released (2 x {role, lastSealedSha256, sealedBy,
rulingLineSha256}), carrierSuccessor null, witnessFlips [], protectedSurfaces (2 spec strings), children (32 x name,
argv, needle), artifact paths, executionPins (84: runner, spec, brief, 81 targets; all disk sha). review = the fixed
PENDING envelope. Every string is a spec-declared string, a path, a hash, a runner constant or a public ledger line;
notes are NOT exported. Scan of every non-notes spec string for measurement units, names, e-mail, EarnedPort or drive
paths: 0 hits (one false positive, "PR #34"). No private, census, golden, history or Joe value can enter: nothing under
rebuild/conform/private is read (Test-Path False at W; pin guard EXP:131), and no runner output line is captured.

## 6. Pins against the real product and pin lists (Fable mirror of EXP:113-142, hashes only)
266 distinct pins (84 execution + 253 product post + parent artifact/review + 8 imports, 0 conflicting duplicates);
0 with post not a string; 0 outside rebuild/ or .github/ (2 under .github/, 5 under rebuild/conform/, none under
rebuild/conform/private/); git(HEAD) mismatches 0; disk mismatches 0. So at e3e22e2 the pin loop passes.
Paths matching the forbidden patterns (private, ledger/, src/, *soak*): NONE among the 266. Nearest names are
rebuild/m4/import/daily-history.cjs and rebuild/m4/workout/engine-history.cjs (role carried; hashed disk + HEAD only;
neither is src/history.js). The protected five are all pinned, role carried: read by fs.readFileSync for sha256 and by
git show for sha256; never required, never compiled, never spawned; their utf8 text is held only for the leak check
(EXP:143-165) and cleared (EXP:166). Under a protected key the artifact carries {pre, post, role="carried"} only.

## 7. Compile cannot pull in the engine
The prefix requires only absolute paths to the 8 imports; none of the 8 requires rebuild/engine at load (load-write-source
only names engine paths in constants and inside functions). EXP:106-110 refuses any 9th module under W. Reference.create
and S.verify sit behind the marker. executedClosure/closure/parentClosure READ text and never require (BP:733-796,817-905).

## 8. Clean step (T3) sufficiency
Measured today the 5 ignored entries under rebuild/ are exactly the runbook's (engine-main.cjs, engine-old.cjs, run.log,
w5/w6 node_modules junctions to %TEMP%\earned-adm\...). After T3 nothing ignored remains under rebuild/ or .github/;
root .tmp/ and node_modules/ are ignored and unguarded, so admitted. Any OTHER ignored entry under rebuild/ or .github/
(a child's coverage dir or log left by a T2 --ci, a re-created junction, rebuild/conform/private) and ANY untracked file
anywhere, including this review (D2), refuses text-free. Re-run the runbook's two verify commands immediately before T4.

## 9. Named debts (none blocking; each has a one-line disposition for the PM)
D1 (wording of D2 / DECISIONS:766 "hashed only"). The protected five are also READ AS TEXT, twice, without compile or
   emission: (a) spec() -> executedClosure (BP:775-796) walks relative specifiers from the 81 argv targets; my mirror
   (274 files, uncapped, all under rebuild/, 16 under rebuild/engine/) reaches rebuild/engine/index.cjs (#86),
   merge.cjs (#153) and migrate.cjs (#248) and would then read their text for the regex scan (my mirror stopped at them,
   so seed.cjs/oracle-shim.cjs are reached via their requires by inference, not measurement); the result is only a
   Set of paths used in an assertion. (b) EXP:141 keeps their utf8 text in memory for the leak check. Disposition:
   record as read-not-execute, or have the PM restate D2 as "hashed and pattern-scanned, never compiled or emitted".
D2 (operational). This review file is untracked in W; cleanTree() refuses on any "??" entry anywhere. Commit it (PM) or
   move it out of W before T4, and re-check git status is empty of "??" and of "!!" under rebuild/ or .github/.
D3 (chain motion). refs/remotes/origin/rebuild/t2-client-core moved from cd16a38 to 98f0bc9 while I read (a fetch in the
   PM tree moves it for W because the .git is shared). EXP asserts start/mid/end identity (D1 of l1), so any fetch or push
   in P during T4 refuses text-free: announce the freeze (runbook Q8) before T4 and pass chain40 = rev-parse at that
   moment. The export at e3e22e2 stays valid across this motion: chain-side diff merge-base..98f0bc9 under rebuild/
   .github is 1 .md file, 0 intersect with the 266 pins; but T15 will need the T14 merge-forward (98f0bc9 is not an
   ancestor of e3e22e2, measured exit 1). Re-run the D:582 preflight against the new tip before that merge.
D4 (benign write). git status refreshes .git/worktrees/earned-s9int/index in the common dir; not a worktree file.
D5 (limits of this read, carried from EREP). Refusals are text-free; a refusal at T4 is attributed by one variable at a
   time (PROC/EREP:50ff). GIT_CONFIG_NOSYSTEM live effect and the D5 toolchain refusal branch remain unit-tested only.

## 10. Confirmations asked by DECISIONS:800, one line each
protected five: hash + text-scan only, never required/compiled/spawned, no byte in output (sections 6, 9 D1)  | forbidden
paths: none read; no pin under private/, ledger/, src/ or *soak* (section 6) | writes: only %TEMP%\earned-s9-profile-
export-results\s9-final-1\{acceptance,review}-s9-ui-pins.json (section 4) | 8-import compile cannot load the engine
(section 7) | clean step sufficient given today's tree, with D2 (section 8) | output carries no private or Joe data
(section 5). Planned command shape (EXP:36-39) matches: --execute-reviewed-export W <e3e22e2 40-hex> 5321181a... s9-final-1
<chain40>; s9-final-1 is absent (the results root itself does not exist yet: mkdir it plain, EXP:40-42).
