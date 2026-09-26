# REVIEW-S10-SEAL-T16-FABLE-l1 - S10 seal read at A (runbook T16, checklist T16)

Reviewer: Claude Fable 5.1 (high), static only, 2026-09-26. Role: REVIEWER; nothing decided, nothing committed, no test
or package command run; helpers in %TEMP%\s10-t16-fable\ (read-only git cat-file / rev-parse / diff-tree / grep with
explicit paths; node sha256 over blob bytes). Protected five never read (their five product pins are covered by the
runner's own SEALED-PROFILE-RECOMPUTATION at T12, not by me). No private value, count, hash or prose appears here.

OBJECT: lane W = %TEMP%\earned-s10int, branch rebuild/b-s10-integration, HEAD = A =
dcb73ec7a7d77298ebdcce6d023ea3d351484e94 (origin/rebuild/b-s10-integration = A). Parent e81066df (M1, "S10: merge tip
ed10468 into the lane (DECISIONS:563; preflight 0 hits; DECISIONS:835)", parents ead01aa + ed10468). ead01aa = "S10:
final spec r3"; ed10468 = chain commit for DECISIONS:835. merge-base --is-ancestor: e81066d, ed10468 and ead01aa are all
ancestors of A (exit 0 each).

VERDICT: ACCEPT WITH NAMED DEBTS (D-T16-1 .. D-T16-5). Nothing must be fixed before L5; every debt is a VERDICT-S10 /
T19 / T25 obligation, not an artifact, spec, runner or evidence defect. L5 may be appended.

## 1. Commit A and the artifact bytes (Q1)
- git show --stat A -- rebuild .github: exactly `rebuild/m4/spec/acceptance-s10-today-split.json | 2201 +` (1 file);
  diff-tree --name-status -r A (no path filter, names only): `A rebuild/m4/spec/acceptance-s10-today-split.json`. A adds
  the artifact and nothing else. Commit subject: "S10: proposed artifact (exporter s10 v1 s10-final-1, sha256 42a3eb02...)".
- Blob at A 2abe0fdc; git cat-file bytes 112116, sha256
  42a3eb020557d312f4e8199eebc79101154ebe4315d2a44fd7a6e5c719450ae8 = the T10 exporter line's artifact64. The lane's disk
  copy and the exporter scratch copy (%TEMP%\earned-s10-profile-export-results\s10-final-1\) hash identically.
- The exporter's review envelope (scratch, 61 bytes, sha256 5c2811a4ea...4204cb30 = the T10 line's review64) is
  `{"version":1,"status":"PENDING","receipt":null}`; it is NOT in A's tree (ls-tree: absent) and NOT on the lane disk
  (removed after T12 as the runbook requires; the T14 lines print ENVELOPE ABSENT, which confirms it). git status
  --short --ignored -- rebuild .github at A shows only `!!` entries (the private junction, run.log, rig185.log and the
  two node_modules junctions); no `??`, no ` M`.

## 2. The artifact's pins (Q2)
- packageId M2-S10-TODAY-SPLIT; lanePackage S10; sourceBase d7f65401...; parent {S9, acceptance-s9-ui-pins.json
  f24476220ec9..., review 7f372d97..., receiptLedgerLine 809, reviewedCommit 9c95afa5}.
- spec.file rebuild/lanes/b/tooling/packages/S10.json, spec.sha256 0f55a704968f89b984c976e3ab07d105f1b1461296c13b7ddf2382ae4fdb7308
  = sha256 of the S10.json blob at A (bbfe0002; identical blob at e81066d and at ead01aa). runner.file b-package.cjs,
  runner.sha256 9fbfdd2d9b09fe2aa8f8bd93090220b302414d32efba78e52a83309a61a7ec7c = the b-package.cjs blob at A (15c3b591,
  316207 bytes, identical at e81066d) = SP.tooling.runnerSha256.
- product: 300 keys = SP's 302 less the 2 released (H12: released paths never enter the artifact product map); key sets
  equal in both directions (0 missing, 0 extra); every artifact product sha equals SP.product[path].post (0 mismatches);
  295 of the 300 re-hashed from the blobs at A equal the pin (0 mismatches); the 5 skipped are the protected five.
- executionPins: 94 keys, all 94 re-hashed at A equal the pin (b-package.cjs, S10.json, the brief e5aabac9 (81810 B),
  ... ). The two released paths are in neither product nor executionPins (BP:1628-1630, runbook Q25 satisfied at A).
- children: 36 entries, byte-identical to SP.children in order, argv and needle.
- authorizations: owner :60 and contract :49 lines and sha256 match the chain byte for byte; theme :830 line text and
  sha256 c497e941 match; review {role cowork, prefix "POSTFIX-ACCEPTANCE M2-S10-TODAY-SPLIT", terminal ACCEPTED} =
  the L5 shape the runner will verify (BP:2068-2070, :3772-3775). released: today-app.cjs and gym-app.mjs, role
  released, sealedBy M2-S9-UI-PINS, lastSealedSha256 efaf6c0d.../4c8ba0c9... (the S9 parent pins), rulingLineSha256
  6f6b5410 = :828. coverage.supersessions.rulingLineSha256 d8884ec6 = :829; coverage.run = the 10 executed gates
  (conformance, merge-differential, merge-laws, migrate-full, selftest, strict, witnesses-1/3/4/6); coverage.superseded
  = the 9 (merge-source, migrate-differential, migrate-source, second-gate, witnesses-2/5/7, writers-differential,
  writers-source), under the five carriers exactly as :829 names them. dIds [], laws {}, carriedAcceptedIds
  D12,D33,D34,D35,D41,D43, witnessFlips [], carrierSuccessor null, privateLiveTriggered [].
- The artifact carries no review/receipt field of its own; the runner reads those from the separate review envelope
  (BP:3706-3716: keys version/status/receipt; PENDING => receipt null; ACCEPTED => receipt {commit,...}). Before T17 the
  correct state is exactly what A has: artifact committed, envelope absent from Git (T18 writes the ACCEPTED one).

## 3. S10.json at A (Q3)
- status BRIEF-ACCEPTED; brief {file S10-TODAY-SPLIT-BRIEF.md, sha256 e5aabac9..., acceptedLedgerLine :831 with
  lineSha256 1fa5309c}; the brief blob at A hashes e5aabac9 (81810 bytes) = :831's stated sha and byte count.
- release.rulingLineSha256 6f6b5410 = sha256 of :828 (RELEASE-FROM-SEAL M2-S10-TODAY-SPLIT today-app.cjs,gym-app.mjs
  ... RULED; role clause "cowork (PM)"; last clause exactly RULED). coverage.superseded.rulingLineSha256 d8884ec6 =
  sha256 of :829 (GATE-SUPERSESSION ... five carriers ... nine gates ... RULED). authorizations.theme = :830 (ends
  " <U+00B7> ACCEPTED", role clause "cowork", contains the package id). brief line = :831 (ends ACCEPTED). All four
  measured on refs/remotes/origin/rebuild/t2-client-core (48f40c0), line numbers and sha256 both equal the spec's claims
  and the checklist's predicted L1..L4 values.
- 36 children, 0 null needles: 33 of the form '# pass N' (today-17 '# pass 726', measure-hermetic 11, m4-import-
  production 28, today-split-fence 404, s10-copy-lock 6, ...), 2 of the form '# tests N' (ui-pack-pins '# tests 121',
  release-object '# tests 14': the S9 precedent restored by spec r3, DECISIONS:835, because a pass count differs by OS),
  1 script terminal line (s10-engine-files-differential: "ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine file(s)
  outside this package's declared product, all byte-identical to the parent; 2 named files move, each ..."). Every
  needle is at least 8 characters, no line break (BP:1966 / :2839 grammar).
- notes[0]: reseal child of M2-S9-UI-PINS, cites :816 (package id / brief ruling), :831 (brief by sha), :830 (THEME),
  :829 (GATE-SUPERSESSION), :828 (RELEASE-FROM-SEAL), each by its own sha256; needles re-observed at e9ff2ca under
  grant (g) :816, recorded :834 (needle table sha256 064ff80e...), the '# tests N' clause citing :835. notes[2] today-17
  name (D-S10I-3). notes[3] inputs b35a48e3 / 66d32530 / EPP 0d38b8e2 + D-EPP-2 5a953d59. notes[4] D-EPP-3 declared
  departure, "Owed and NOT run: the port oracle on the synthetic fixture, the sensitivity pass, the private gate,
  exact-head CI on both systems". notes[7] S10's own gate supersession under :829 with the released pair under :828.
  notes[8] D-EPP-4 green half hosted (run 36158401022), RED half owed (D-S10I-8). notes[9] D-BLOM carried (:798, :799;
  re-measure after 2026-10-05). Five coverage whys all cite ":829 (RULED) ... located by its own sha256 d8884ec6f13e..."
  and name the executing s10-sup-* cell; no PROPOSED word.
- product 302 = edited 22, carried 230, new 47, superseded-by-child 1 (packages/S9.json pre bb169a67 post a66530aa),
  released 2. rebuild/engine: 20 paths, today.cjs and writers.cjs edited, the rest carried; 0 rebuild/coach paths (C3
  cannot void the receipt). The S9-released pair build.mjs / preview.css is declared nowhere (notes[1]).

## 4. The FILTERed T12 / T14 / T14b lines against the runbook (Q4)
- T12 (--ci, artifact + PENDING envelope on disk): "POSTFIX M2-S10-TODAY-SPLIT REVIEW-PENDING mode=--ci" | "ENVELOPE
  PENDING artifact=42a3eb02... spec=0f55a704... runner=9fbfdd2d9b09fe2aa8[cut at 200]" | "PUBLIC CI EVIDENCE PASS -
  public evidence only, NOT the package verdict; ...[cut]" | EXIT=0 | CHILD OBSERVED count 36. Every runbook T12 /
  checklist T12 expectation met; spec= is the H sha (r3 0f55a704). NO MISMATCH.
- T14b (--full, envelope removed, private junction in place, node folder on PATH): "POSTFIX ... REVIEW-PENDING
  mode=--full" | "ENVELOPE ABSENT; rebuild/m4/spec/acceptance-s10-today-split.json is not sealed yet - no PASS word is
  available" (BP:3704) | "PRIVATE ORACLE PRESENT; verdict-only reporting - ..." (BP:3799) | "FULL EVIDENCE: 10 of the
  19 original gates re-executed, 0 carried by successor children that executed in this run and 9 SUPERSEDED under
  DECISIONS:829, each replaced by this package's own executed evidence; second gate include[cut]" (BP:3832-3836, L2 =
  :829 as required) | "POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation(s); independent exact-artifact acceptance
  required" (BP:3927) | EXIT=2 | CHILD OBSERVED 36 | LEGACY lines 10 (the predicted 10). NO MISMATCH.
- The first T14 (full1, 01:11): the same first three lines, then "B PACKAGE S10 FAIL; required evidence missing or
  failed; local diagnostics withheld", EXIT=1, CHILD OBSERVED 36, LEGACY lines 7, engines folder present. Static
  reading of the cause:
  (a) b-package.cjs spawns every child (BP:2812) and the laws run (BP:2696) with process.execPath; the gate runner
  rebuild/conform/v4/postfix/run.cjs:121 spawns every legacy gate with process.execPath; legacy-gates.cjs:119 likewise.
  None of those depends on PATH for node. That is why all 36 children were OBSERVED and the laws ran in the failed run.
  (b) The `conformance` and `selftest` gates (GATES rows :20-21) execute rebuild/conform/run.cjs, whose helper
  `sh(cmd,...)` (:23, execFileSync with env {...process.env}, errors caught to code 1 and the empty output) is called
  with the bare command "node" at :39 (port oracle check main-vs-main), :40 (sensitivity), :63 (rig185, informational),
  :68 and :90 (selftest re-spawns of run.cjs and the port oracle). With no node on PATH, :39/:40 return code 1 and an
  empty `out`, so ids2/ids3 are [] ("0 PORT ids"), steps 2 and 3 are BAD, SUITE CONSISTENT never prints, and gateRun
  fail('LEGACY-GATE-conformance') (:124) throws: the matrix stops at that gate. GATES order gives exactly 7 executed
  gates before conformance (witnesses-1, -3, -4, -6, merge-differential, merge-laws, migrate-full) = the 7 LEGACY lines
  measured; selftest and strict never ran. The FAIL line carries no code because FAIL_CODES harvests only upper-kebab
  names from b-package.cjs (BP:658-670) and 'LEGACY-GATE-conformance' is not one.
  (c) The environment fix: s10-full1.cmd (01:17:19) prepends the git folder and then
  ...\dependencies\node\bin to PATH. That folder contains node.exe only (listed by name; `node -v` = v24.19.0 = the
  %NODE% binary the runner itself runs under). So the change makes bare "node" resolve to the same binary process.execPath
  already is; it adds no other executable, git resolution is unchanged (the git folder stays first), and nothing in
  b-package.cjs, legacy-gates.cjs, v4/postfix/run.cjs, scripts/check.mjs (:76/:81/:94 process.execPath),
  port-oracle.cjs or lib/harness.cjs reads PATH or spawns a bare node. VERDICT: the first T14 red is an environment
  (PATH) defect of the PC, not a product or gate defect; node on PATH changes nothing but letting rebuild/conform/run.cjs
  reach node for its child spawns (port oracle, sensitivity, rig185, selftest). Under it the identical tree produced the
  runbook's predicted REVIEW-PENDING at EXIT=2 with 10 LEGACY lines.
  (d) Q22 answered by measurement: rebuild/conform/engines is present after the --full run (the PM's "engines folder
  present: True"; BP:3862 `Reference.create(root)` builds the pinned public bundles), never opened by me.
- What the T14b LEGACY lines do NOT pay: the conformance/selftest gates run rebuild/conform/run.cjs against
  ENGINE_MAIN/ENGINE_OLD = the pinned public reference bundles (v4/postfix/run.cjs:119 from BP:3862), i.e. the frozen
  app's engine against itself. D-EPP-3's owed port oracle on the synthetic fixture, sensitivity pass and private gate on
  the repaired rebuild/engine bytes therefore remain owed as SP notes[4] says (D-T16-3).

## 5. Hosted runs (Q5)
- pm4-ci.cjs rebuild/b-s10-integration 6: dcb73ec7 rebuild run 36219778403 completed success (2026-09-26T05:05:51Z),
  plus pipeline 36219778378 and shared-preflight 36219778334 success; e81066df rebuild run 36217102675 completed
  success (04:11:50Z), plus pipeline 36217102705 and shared-preflight 36217102665 success.
- pm4-ci-jobs.cjs 36219778403 (CI-1 at A): rebuild-public ubuntu-latest and windows-latest completed | success; C font
  transport ubuntu-latest and windows-latest completed | success. pm4-ci-jobs.cjs 36217102675 (CI-M1c at M1): the same
  four jobs completed | success. Ids and conclusions are exactly as stated. CI-M1c at r3 on ubuntu is the "first ubuntu
  run at r3" that D-R3F-2 (:835) asked for: paid by run 36217102675; CI-1 repeats it at A.

## 6. What VERDICT-S10 must name (Q6): the V9 carries and the open S10 debts
V9 carries (VERDICT-S9.md at A, 171 lines):
- D-S9SEAL-1 pattern: the pinned count is the runner's; S10's n is PREDICTED 300 (the artifact has 300 product keys)
  and is recorded from the SEALED RUN RECORDED line, never asserted.
- D-S9SEAL-2, the V8 prose carries restated again: the rebuild.yml comment vs S8-PREP-AUTHOR-REPORT.md
  (RECEIPT-EXACT-LINE-MISSING, :524 N3); S8.json's three ledger citations one number low (:525-:527); lane D carries
  (a) layout profile not tied to rule_profile, (b) construct.cjs:6 patch, (c) entry.load null for a configuration lift
  (:523), (d) the identity trade (:472 (a), :521), (e) listImports on the owner's installation verified only at his
  retry. The p3-layout-v2 note stays PAID.
- D-S9SEAL-3: the today-17 P-MEASURE flake class (:496), now joined by the D-GSS load-sensitive class (:832, :833,
  :835): every red is re-run and recorded, never edited around; the report-only hunt of :835 runs in parallel.
- D-S9SEAL-4: chain freeze L5..L6; S10's form is :816's (every chain commit: ledger, cleanup phases, NATIVE-LOAD, Astra).
- D-BLOM (:798, :799; SP notes[9]; V9 section D-BLOM): re-measured after 2026-10-05 by the re-pointed hosted-blom packet.
- The S9 released pair preview.css / build.mjs: parent-released, declared nowhere in S10 (notes[1]).
S10's own, open at A:
- D-EPP-3 owed gates (notes[4]): port oracle on the synthetic fixture, sensitivity pass, private gate on the repaired
  engine, exact-head CI both OS (the last is paid by CI-2 at T26; the first three stay owed, section 4 above).
- D-EPP-4 real-engine RED half, D-S10I-8 (notes[8]); its GREEN half hosted (run 36158401022 at f97924a).
- The two engine moves today.cjs / writers.cjs (:631 O-1a, one clause each) and D-EPP-2 at engine-capture.cjs (:785),
  under the :829 token clause; the released pair today-app.cjs / gym-app.mjs under :828 and why T24 does not re-verify
  them (runner H12/H13).
- D-GSS-TIMER, D-SPLIT-LISTEN, D1/D2 payers (checklist T22; not re-measured here), D-GSS-PASSTHROUGH if unpaid (Q8).
- D-GSSFIX-1, D-GSSFIX-2 (Fable, :833) and GSS-LATE-CLEAR, GSS-G5-DIAGNOSTIC (Astra job 134, :834) on the settle fix.
- D-NODE-MODULES-HOME (:826, :827); D-R2F-1 (T6e needle constant = the f4125cd table, low, :834); D-R3F-1 (paper,
  restored); D-R3F-2 PAID by 36217102675 (section 5); D-T6-STATIC, D-T6-READS, D-SEAL (Astra L3 job 138, :835);
  D-CF-1..3 (Claude final at 4dc2029); D-S10I-3 (today-17 name); D-CENSUS-STAGED-COUNT PAID (2c4d24e, addendum 2
  5b230c5); the runner move 5321181a -> 9fbfdd2d with the seven ancestor spec re-pins and S9.json superseded-by-child.
- Every red of this seal, per the :835 ruling: CI-M1 36199898809 (ccc2f63, both OS red), CI-M1b 36214720524
  (9849bc7, ubuntu needle), T8 ci0 at 9849bc7 (today-17 725/726), the first T14 full1 (EXIT=1, PATH), then CI-M1c
  36217102675 green, T14b REVIEW-PENDING, CI-1 36219778403 green; CI-2's id at T26 (D:627 sentence form).
- The receipt sha256 (T21), artifact 42a3eb02..., spec 0f55a704..., runner 9fbfdd2d... (BP:3664, :3670) or T24 stays FULL.

## 7. Before L5 (Q7) - nothing to fix; obligations that follow
- No fix is required in A, the spec, the runner or the evidence. L5's shape: "- 2026-09-DD <U+00B7> cowork <U+00B7>
  POSTFIX-ACCEPTANCE M2-S10-TODAY-SPLIT dcb73ec7a7d77298ebdcce6d023ea3d351484e94 rebuild/m4/spec/acceptance-s10-today-
  split.json 42a3eb020557d312f4e8199eebc79101154ebe4315d2a44fd7a6e5c719450ae8 ACCEPTED" (role clause cowork, LG:24).
- The chain tip is 48f40c0 (:836, "S10 seal chain T7-T15 ..."), one commit past the ed10468 that M1 merged; the diff
  ed10468..48f40c0 -- rebuild .github is rebuild/DECISIONS.md only. L5 will be :837 if nothing else lands first; T19's
  merge-forward #2 carries :836-:837 into M2 and T20's SEAL BASE ON THE TIP needs R to be an ancestor (D-T16-1).

## Named debts
- D-T16-1 (procedure, low): chain moved to 48f40c0 after M1; announce the freeze at R and expect the V..M2 diff to be
  DECISIONS.md (+ STATUS.md at most); a second chain move after R needs the FREEZE ruling of D-S9SEAL-4.
- D-T16-2 (record): the first T14 red (EXIT=1, LEGACY-GATE-conformance by PATH, 7 LEGACY lines) and the T8 ci0 red
  (:835) must appear in VERDICT-S10 and the L6 line, with the PATH cause and the unchanged tree, per the :835 ruling.
- D-T16-3 (owed, carried): D-EPP-3's port oracle / sensitivity / private gate on the repaired engine are NOT paid by
  T14b's conformance and selftest lines (frozen reference bundles, BP:3862; run.cjs:20, :39-40); name them owed.
- D-T16-4 (hygiene): W holds ignored rebuild/conform/run.log and rig185.log (regenerated by the --full runs) and the
  engines folder; harmless to T17-T28 (ignored; the byte-identity step reads product pins) but EXP:59-67 refuses ignored
  entries under rebuild/, so any re-export repeats T9 first.
- D-T16-5 (record): the Fable/Astra review files after 9479958 (T6f, R2 l1, R2F, r3, the GSS fix reads, the exporter
  containment read, census addendum 2, this T16 file) are not in the lane at A (ls-tree of both review folders); T25
  must commit every one of them (checklist T25) or the sealed record loses them.

## AAR (6 lines)
1. Verified: A adds only the artifact; artifact/spec/runner bytes at A = 42a3eb02 / 0f55a704 / 9fbfdd2d; 295+94 pins re-hashed equal; 36 children identical; 4 token lines sha-matched on the chain; T12/T14b lines match the runbook; CI-1 and CI-M1c success on all 4 jobs.
2. Found: the first T14 red is a PATH-only environment defect (rebuild/conform/run.cjs:39-40 bare "node"); the fix adds one folder holding node.exe alone and changes no verdict.
3. Found: T14b's legacy conformance lines run frozen reference bundles and do not pay D-EPP-3's owed engine gates; they stay named owed.
4. Missed by me: D-GSS-TIMER / D-SPLIT-LISTEN / D1-D2 payers and the brief's own debt list were not re-measured (out of the T16 object); T22's drafter must take them from the brief and IR.
5. Rule check: no protected five, src/, private, ledger, soak, log or old-app path read; git reads carried explicit paths; only my scratch folder and this file were written.
6. Verdict ACCEPT WITH NAMED DEBTS D-T16-1..5; L5 may be appended now.
