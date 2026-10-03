# REVIEW-S11-EXPORTER-CONTAINMENT-FINAL-FABLE-l1 (Fable, independent containment read on the FINAL inputs, 2026-10-03)

VERDICT: ACCEPT WITH NAMED DEBTS (D-S11EXP-1..3 below). The port at e93b1ed may be the T10 exporter on the
lane head 5ab2780 with runner bdbb8a93 and spec 321967ee, once T9 has cleared the three ignored entries under
rebuild/. Nothing was executed except the parse-only self-check (read first, then run once; it reproduced the
PM's RESULT PASS=23 PENDING=2 FAIL=0 byte for byte). No exporter run, no runner run, no child, no protected
file opened: every protected-five fact below is a sha256 over `git show` bytes.

## 0. Objects (MEASURED; git 2.53.0.windows.3 at G, node v24.19.0 at N; scratch %TEMP%\s11-t10-fable-scratch)
- W11 HEAD 5ab278069e8ffaf811a1770b410616bcd009a70a = merge of 01a7050 (runbook H) and chain 71dc0a83 (chain
  tip at this read); `git diff --name-only 01a7050 HEAD` = rebuild/DECISIONS.md only. status: 5 `!!` (.tmp/,
  node_modules/ at the root, which cleanTree admits; rebuild/conform/run.log and the w5/w6 node_modules
  junctions, which it refuses until T9); ls-files -v non-'H' = 0.
- Exporter: %TEMP%\export-s11-profile-v1.cjs sha256 9e6ac28c... 14124 B = e93b1ed blob, byte-equal; S10 v1
  text de3aeb76... 13799 B; e93b1ed holds exactly the three s11-exporter-v1 files (word-diff df8bf19a...,
  self-check a6f2cf35... = %TEMP%\s11-containment-selfcheck.cjs byte-equal), parent 9288adf.
- BP HEAD = disk = bdbb8a93... 317089 B; SP HEAD = disk = 321967ee... 132546 B; the eight imports HEAD = disk,
  and each is blob-identical to its f97924a and edb8381 version (the S10 read's inputs): run.cjs 654288e0,
  legacy-gates b8891d9b, strict-json 5722f233, target e19f3399, trace-v2 5804390b, native-carriers-errors
  ddcfa7d2, load-write-reference dfc836b3, load-write-source 77bd6b71. Parent files 42a3eb02 / 8d913278 on disk.

## 1. What the run does (static, on these bytes; EXP:n = exporter line)
Reads: git only through :54 (bare `git`, -C root, --no-replace-objects, GIT_* stripped, HOME and
XDG_CONFIG_HOME pointed inside the not-yet-created destination, GIT_CONFIG_GLOBAL=NUL, NOSYSTEM=1): rev-parse
--show-toplevel / --version / HEAD / chainRef, status, ls-files, and `show <head>:<file>` for runner, spec, the
eight imports and every pin. Disk under root only: runner :78, spec :81, imports :85, every pin :146, and the
protected five :148/:151. The compile (:107) executes BP:1-3849 with argv --ci --package S11 and stdout/stderr
silenced, then spec(), parent(), proposed() only (:92-93). Writes: mkdir destination :179 and two 'wx' files
:182-183 under realpath(C:/Users/joeym/AppData/Local/Temp/earned-s11-profile-export-results)/s11-final-1, a
root asserted to be a real directory outside W11 (:40-44) with the output folder absent (:46, :178). Spawns:
git only (execFileSync; C13 confirms no other cp use, no process.exit). The protected five: hashed as carried
pins (:146-147), their text held in memory as the negative witness of the leak check (:163-167) and dropped
(:169); never compiled, required, spawned or written. All 98 execution pins proposed() adds (brief file, 97
child targets; carrierSuccessor null) are tracked at HEAD, under rebuild/ or .github/, none malformed; all 320
product posts equal their HEAD blob and the disk bytes, so :125 and :145-147 do not refuse on these inputs.
The one artifact-bound path under rebuild/engine/ in a child argv is rebuild/engine/test/proposed-pick.test.cjs.
Precondition the exporter enforces by refusal (not a defect): T10 argv must carry THIS head 5ab27806... (the
runbook's E4/T7 text still names 01a7050) and the chain40 re-read at T10 (71dc0a83... now).

## 2. The compiled prefix at bdbb8a93 vs the S10-reviewed prefix 9fbfdd2d (MEASURED, LCS line diff)
Marker found exactly once in each; prefix 3850 lines vs 3839. The whole diff is 15 lines: BP:181-186 and
:339-343 are 11 new comment lines; BP:187 IDS gains 'S11' (between 'S10' and 'B1'); BP:344 NO_REGISTER_IDS gains
'S11'. No other prefix byte moved; the suffix after the marker is byte-identical. So every top-level effect is
the S10-reviewed set shifted by 11 lines: five requires (BP:90-95, node builtins and the eight imports, whose
load-time behaviour the S10 read measured and whose blobs are unchanged), the argv gate BP:700-702 (satisfied:
'S11' in IDS), and the assert loops (BP:200, :349-352, :613, :631). The brief's "five CHILD_SPECS lists gain
S11" is not a runner fact (no CHILD_SPECS in BP); the runner delta is the two literal lines. The self-check's
closure (35 definitions; no laws/children/authority/historical/writeSealedRunReceipt; no write/spawn/exit
site; L.git/L.object/J.parseExact/L.verifyReceipt only) agrees with the S10 read's 34-function closure; the
value-mentions it lists (gates, children, pins) are same-named locals, as the S10 read followed by hand.

## 3. Artifact-bound strings (every one from SP, BP:3415-3501; 2967 strings walked over the bound keys)
630 are sha1/sha256, 2247 are bare tokens or paths (422 slash-bearing, all under rebuild/ or .github/, none
under src/, conform/private, ledger/, soak or an app.js; the five appear only as product keys with hex64 /
'carried' leaves, pre == post == S10 artifact post for each: seed a67ace26, migrate 60959d58, merge 01e9d6e6,
index 40ccc489, oracle-shim dd653bc1). 90 are prose: 39 '--test-reporter=tap', 38 needles ('# pass n', '# tests
n', one 160-char ENGINE FILES DIFFERENTIAL line), the five coverage.superseded why texts, the three
authorizations lines (owner = D:60, contract = D:49, the 2026-10-02 THEME line), the review prefix, two
protectedSurfaces names (one NAMES rebuild/conform/private/live.json and says "never opened"; no value). A
pattern scan (emails, drive letters, backslashes, phone shapes, secret/token/password words, EarnedPort,
src/, ledger/, soak) hits only prose that uses the words "token"/"ledger" and that protectedSurfaces name.
No user data, no path outside the repo, no engine line, no code shape (C12: code-shaped 0). Not exported:
notes (15), brief.*, tooling, status, parent.option.note (BP:3466 picks the option's id/paths/shas only, so
the self-check's "13 >= 24 chars" overcounts by that note; the exported long prose is 12 strings).

## 4. The C12 PENDING (claim VERIFIED)
The only artifact-bound string containing "PENDING" is authorizations.contract.line ("... must report
BASELINE PASS / FIXES PENDING ..."). It is byte-equal to rebuild/DECISIONS.md line 49 at HEAD and at the chain
tip 71dc0a83, byte-equal to S10.json's and to the sealed S10 artifact 42a3eb02's contract.line, and its
sha256 (line bytes, no LF) is f14f5e9280bc4a4316757ccfb5ed68e57152f8913bbe6979d6c1ad4f2cefac52 =
authorizations.contract.lineSha256. owner.line likewise = DECISIONS:60, sha ebb565c6... Non-ASCII in the line:
U+00B7, U+2014, U+2013, U+2192, U+2026, U+00A7, as a byte-exact copy must carry. The exporter has no PENDING
check, so this cannot refuse at T10; C12-ARTIFACT-PROSE is a self-check heuristic that cannot tell a fill
placeholder from a word inside a verbatim ruling, and it will stay PENDING on the final SP by construction.

## 5. Named debts
D-S11EXP-1 (carried: D-S10EXP-3 = D-S11T3g-1): :109-114 checks require.cache only inside root; the eight
  imports load builtins only (unchanged blobs), so nothing outside root loads today; a future import would
  not be seen. Owner: VERDICT-S11 by name.
D-S11EXP-2 (process, PM at T9/T10 record): the brief's expected self-check outcome "PENDING only
  C6-SCRATCH-ROOT" is off by one; the PM line must record C12-ARTIFACT-PROSE PENDING as the verbatim D:49
  line (section 4), not as an unfilled string, and C6 as paid when the empty folder exists.
D-S11EXP-3 (runtime, text-free): the :163-167 leak check is dynamic over the final strings and the five's
  text; this read did not open them, so its result is seen only at T10. A REFUSED there is attributed by one
  variable at a time (runbook T10 STOP). The runbook's H/argv cites (01a7050) are stale: use 5ab27806... and
  the chain40 of the moment; P3 of the S10 read still holds (G's folder first on PATH, bare `git` at :54).

## 6. Method and limits
Static only, plus one run of the parse-only self-check. Scripts m1..m4.cjs and grep.cjs in the scratch folder:
m1 hashes and status, m2 the prefix LCS diff and top-level census, m3 the artifact-string walk and the D:49/
D:60 comparison (the only ledger lines read, by index, for section 4), m4 the pin pre-flight. No src/,
conform/private, ledger/, soak, EarnedPort or app.js path was opened or listed; the five passed through
sha256 only. Nothing in W11 was edited, staged, committed or pushed.
