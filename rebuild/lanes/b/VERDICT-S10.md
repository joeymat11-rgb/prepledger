# VERDICT - M2-S10-TODAY-SPLIT - lane B seal - PASS on the `DECISIONS:837` receipt

Lane `rebuild/b-s10-integration`, worktree on the owner's Windows PC, executed there by the PM seat under grant (g)
`DECISIONS:816` (`:796 (d)` extended to the S10 seal: PM seat only, pass/fail lines only, the private census and the
D-EPP-3 private gate included; no data leaves the PC). Artifact commit
`dcb73ec7a7d77298ebdcce6d023ea3d351484e94` (A, the reviewed commit; artifact only, parent M1
`e81066df1a3df1df027b4c39239c533305d9ba04`). The chain tip `ca7f676503a6f28fabebb374b052cc570879451d` (R, receipt base)
is an ancestor of the sealing head, so the seal base is on the tip (rule=ancestor, `DECISIONS:135 (4)`). sourceBase
`d7f654017962d35661adea8cf3688251ad686b9e`, the S9 seal tip (`DECISIONS:810`).
No private value, count, hash or prose appears in this file. The PASS word below is the runner's, earned on the FULL run
against `DECISIONS:837`.

## Authority
- Package id and brief of record PM RULED at `DECISIONS:816`. Brief `rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md`, sha256
  `e5aabac9809f70dc5dcc105892a4f4ff468193d713c6e6d99a044bf40e5b74c8` (81810 B), the brief of record by sha at
  **`DECISIONS:831`** (lineSha256 `1fa5309c2d70eaa39873439e85e689c43083a720eb857d8102667dd640e3bea0`); theme
  **`DECISIONS:830`** (lineSha256 `c497e941acaf414c9dfa9a2c2a562af27d02149065cee4e0b3780df141c1c17b`).
- Release from seal: **`DECISIONS:828`** (RELEASE-FROM-SEAL of `rebuild/m3/w7-preview/today/today-app.cjs` and
  `rebuild/m3/w7-preview/today/gym-app.mjs`, the release grant of brief section 4.3), the spec's
  `release.rulingLineSha256` `6f6b5410071eab452cfa0a9f46748ea08c1db8533345f46361ea91626106c525`, located by its own bytes.
- Gate supersession: the standing role `DECISIONS:153` granted by the token clause **`DECISIONS:829`** (RULED), the
  spec's `coverage.superseded.rulingLineSha256` `d8884ec6f13e0df0ff078bc2c0d2d90ffc1c06d1820c15fdcf5e3ddcaa550c92`,
  located on the chain branch by its own bytes. Unlike S9 (`:787`, "changes no engine byte"), this clause states that the
  child moves `rebuild/engine/today.cjs` and `writers.cjs` by one owner-worded clause each (`DECISIONS:631` O-1a) and
  retires the parent's nine gates again under its own evidence.
- Parent (single, immutable): `rebuild/m4/spec/acceptance-s9-ui-pins.json` sha256
  `f24476220ec9fe187aded6d708c2371a3f604c3f2a41bb94a9594e351d8b8b1c`, review
  `rebuild/m4/spec/review-s9-ui-pins.json` sha256 `7f372d97170cbc4f58025a84ba4c705488aae6a7ff11c61e0e97b1b2b4eddcb4`,
  receipt `DECISIONS:809`, reviewed commit `9c95afa5b840fedbe914652b2f0bd83d1b0800c2` (as the artifact's `parent` block
  records them).
- b-lom: `DECISIONS:798` (owner, BLOM-OPTIONS 2(b)) and `:799` (PM, the narrowing binds S10 when it re-binds to the sealed
  S9): debt D-BLOM below.
- Engine grants: the two clauses of `DECISIONS:631` O-1a; D-EPP-2 under grant (b) `DECISIONS:784-785`.
- Receipt of record: **`DECISIONS:837`** (POSTFIX-ACCEPTANCE, L5) at R `ca7f676503a6f28fabebb374b052cc570879451d`, carried by
  `rebuild/m4/spec/review-s10-today-split.json` (sha256 `8d9132787373e9e3e9a3ee1f91be8c403867acd9b8136a6390d1029a1d6a2a0a`,
  484 B, re-hashed from `git cat-file` at V) as
  `{status: "ACCEPTED", receipt: {commit, path, line, lineSha256}}` (lineSha256
  `ac7077f820a056e5711e2398f1e8762ef6159049db30c24e3a9626cad0d1785e`, re-hashed from the last line of `rebuild/DECISIONS.md`
  at R, which is line 837). The line is paraphrased here, not quoted, because its clauses are joined by the ledger's
  middle-dot separator: dated 2026-09-26, role clause cowork, then POSTFIX-ACCEPTANCE M2-S10-TODAY-SPLIT, the commit A, the
  path `rebuild/m4/spec/acceptance-s10-today-split.json`, the artifact sha256 `42a3eb02...` and the terminal word ACCEPTED.
  R (parent `48f40c0`, the `:836` chain commit) changes `rebuild/DECISIONS.md` only, was pushed, and starts the chain
  freeze. Its reviewed commit is A `dcb73ec7a7d77298ebdcce6d023ea3d351484e94`. The envelope was committed as V
  `91cf7b6681da2a698b99449efe659797a141da26` (parent A; adds that one file); merge-forward #2 is M2
  `908e8224de49de24bb6f41e29f9709138613d3d1` (parents V and R; R and A are both ancestors of M2, `merge-base
  --is-ancestor` exit 0) and the diff V..M2 is `rebuild/DECISIONS.md` only; the sealed-run receipt was committed as C1
  `1252c4292730eecf10f886281f337e250839b71f` (parent M2; adds that one file).
- Fable T16 seal read at A (REVIEW-S10-SEAL-T16-FABLE-l1): ACCEPT WITH NAMED DEBTS, nothing to fix before L5; its named
  debts D-T16-1 to D-T16-5 are carried below (Records, the Fable T16 bullet), and every item its Q6 asks this file to name
  is named here.

## The evidence hashes this seal stands on
- Artifact `rebuild/m4/spec/acceptance-s10-today-split.json` sha256 **`42a3eb020557d312f4e8199eebc79101154ebe4315d2a44fd7a6e5c719450ae8`** (exporter s10 v1, run `s10-final-1`).
- Spec `rebuild/lanes/b/tooling/packages/S10.json` sha256 **`0f55a704968f89b984c976e3ab07d105f1b1461296c13b7ddf2382ae4fdb7308`** (spec r3, committed at `ead01aa`).
- Runner `rebuild/lanes/b/tooling/b-package.cjs` sha256 **`9fbfdd2d9b09fe2aa8f8bd93090220b302414d32efba78e52a83309a61a7ec7c`**.
Each was re-hashed from a byte-exact `git show dcb73ec:<path>` extract; the artifact's own `spec` and `runner` blocks
carry the same two sha256. The artifact blob at M2 re-hashes to the same sha256.

## Sealed-run receipt (`DECISIONS:136 (3)`)
`rebuild/lanes/b/tooling/receipts/S10.json` sha256 **`3c6d1f5d1fba7699b4a5fabc9939ef84ecc5fd3b715f3df9e63399ec9b07aea4`**
(38229 B), written by the runner itself on the terminal branch of the FULL run that earned
`POSTFIX PACKAGE PASS M2-S10-TODAY-SPLIT` (exit 0, terminal T20) on the PC with the private census junction in place, and
committed unmodified as C1 `1252c4292730eecf10f886281f337e250839b71f` (re-hashed from `git cat-file` at C1; equal to the
sha256 the runner printed on its SEALED RUN NEXT STEP line). Receipt id `M2-S10-TODAY-SPLIT@3c6d1f5d1fba7699`. Its
`sealedRun` block carries the three hashes above, `envelopeKey ACCEPTED:...` (the artifact sha256, A and R),
this verdict file by name (`rebuild/lanes/b/VERDICT-S10.md`) and the 300 pinned product shas (302 product entries less
the 2 released paths, which the seal step never writes into the map; the number of record is the runner's, not a
prediction, D-S9SEAL-1; the receipt's product map has 300 keys, the artifact's 300). With
these bytes in Git and this sha256 named here, the `:136 (3)` byte-identity step is AVAILABLE. The coach constant moves to
`M2-S10-TODAY-SPLIT@3c6d1f5d1fba7699` in the commit after this one (C3).

## Terminals - executed on the PC, exit codes measured
Every line quoted below is from the PM's FILTERed run logs (T8 ci0 per `:835`; T9 onward from the seal chain log); `[cut]` marks where the FILTER's 200-character cut or a
non-ASCII dash in the runner's text ends the quotation.
1. T8, `--ci --package S10` (ci0) at `9849bc7ffff5543668d3157c997235d108c54e62`, before M1 (`DECISIONS:835`):
   `FAIL CHILD-REQUIRED-EXIT-ZERO`, child today-17 exit 1 (725 of 726; the failing cell is named only in the runner's
   child log, which stays closed). Three unguarded today-17 runs after it were 726/726 and both hosted systems passed
   today-17 at the same head. RECORDED, NOT EXCUSED (`:835`); see the today-17 hunt below. T8 was not repeated at M1
   (`:836`).
2. T12, `--ci --package S10` (ci1) at M1 `e81066d` with the exported artifact and the PENDING review on disk
   (`:836`): `POSTFIX M2-S10-TODAY-SPLIT REVIEW-PENDING mode=--ci` |
   `ENVELOPE PENDING artifact=42a3eb020557d312f4e8199eebc79101154ebe4315d2a44fd7a6e5c719450ae8
   spec=0f55a704968f89b984c976e3ab07d105f1b1461296c13b7ddf2382ae4fdb7308 runner=9fbfdd2d9b09fe2aa8 [cut]` |
   36 CHILD OBSERVED exit 0 | `PUBLIC CI EVIDENCE PASS [cut]`, EXIT=0. The PENDING review file was then removed and A
   `dcb73ec` committed the artifact only. This is the public evidence only and carries no PASS word for the package.
3. T14, `--full --package S10` (full1) at A `dcb73ec` (review absent, private census junction in place, Test-Path only):
   `POSTFIX M2-S10-TODAY-SPLIT REVIEW-PENDING mode=--full` | `ENVELOPE ABSENT; rebuild/m4/spec/acceptance-s10-today-split.json
   is not sealed yet [cut]` | `PRIVATE ORACLE PRESENT; verdict-only reporting [cut]` |
   `FAIL; required evidence missing or failed; local diagnostics withheld`, EXIT=1 | 36 CHILD OBSERVED | 7 LEGACY lines.
   Cause (`:836`): the conformance gate reported BAD at steps 2, 3 and 7 because `rebuild/conform/run.cjs` spawns bare
   `node` for the port oracle and node is not on the PC's PATH since the S9 seal; no product or gate defect (D-PATH-NODE
   below). The `rebuild/conform/engines` folder was present after this run (Test-Path True; never opened).
4. T14b, the same command with node's folder added to PATH, at A `dcb73ec`:
   `POSTFIX M2-S10-TODAY-SPLIT REVIEW-PENDING mode=--full` | `ENVELOPE ABSENT [cut]` |
   `PRIVATE ORACLE PRESENT; verdict-only reporting [cut]` | 36 CHILD OBSERVED | 10 LEGACY lines |
   `FULL EVIDENCE: 10 of the 19 original gates re-executed, 0 carried by successor children that executed in this run and
   9 SUPERSEDED under DECISIONS:829, each replaced by this package's own executed evidence [cut]` |
   `POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation(s); independent exact-artifact acceptance required`, EXIT=2. The
   one obligation was the acceptance itself. The junction stayed until T24.
5. T20, `--full --package S10` (full2) at M2 `908e8224de49de24bb6f41e29f9709138613d3d1` (review ACCEPTED on `:837`, tip
   merged, node's folder on PATH), queued exclusive, ended 01:57:34:
   `POSTFIX M2-S10-TODAY-SPLIT AUTHORIZED mode=--full` |
   `SEAL BASE ON THE TIP; refs/remotes/origin/rebuild/t2-client-core is at ca7f676 and that commit is an ancestor of this
   HEAD (DECISIONS:135 (4), rule=ancestor)` |
   `ENVELOPE AUTHORIZED artifact=42a3eb020557d312f4e8199eebc79101154ebe4315d2a44fd7a6e5c719450ae8 reviewed at
   dcb73ec7a7d77298ebdcce6d023ea3d351484e94; receipt base ca7f676503a6f28fabebb374b052cc570879451d; spec
   0f55a704968f89b984c976e3ab07d105f1b146 [cut]` |
   `AUTHORIZED STEP UNAVAILABLE SEALED-RUN-RECEIPT-ABSENT; the FULL run with the private census is required
   (DECISIONS:136 (3))` |
   `PRIVATE ORACLE PRESENT; verdict-only reporting [cut]` |
   `FULL EVIDENCE: 10 of the 19 original gates re-executed, 0 carried by successor children that executed in this run and
   9 SUPERSEDED under DECISIONS:829, each replaced by this package's own executed evidence; second gate included [cut]` |
   `SEALED RUN RECORDED rebuild/lanes/b/tooling/receipts/S10.json; artifact=42a3eb020557 spec=0f55a704968f
   runner=9fbfdd2d9b09 over 300 pinned product file(s)` |
   `SEALED RUN NEXT STEP commit rebuild/lanes/b/tooling/receipts/S10.json and write its sha256
   3c6d1f5d1fba7699b4a5fabc9939ef84ecc5fd3b715f3df9e63399ec9b07aea4 into rebuild/lanes/b/VERDICT-S10.md; the
   DECISIONS:136 (3) byte-identity step is UNAVAILAB [cut]` |
   `POSTFIX PACKAGE PASS M2-S10-TODAY-SPLIT`, EXIT=0 | CHILD OBSERVED count 36 | LEGACY PASS lines 10 (10 LEGACY gates
   re-executed, all PASS). No red and no re-run at T20. The receipt it wrote was committed unmodified as C1 (T21).
6. T24, `--full --package S10` (full3) at the head that carries the committed receipt, this verdict and the moved coach
   constant (the byte-identity re-verify), at C3 `<C3>` (C2, the commit that adds this file, carries this verdict): `<T24-RESULT>`
   [expected: AUTHORIZED | SEAL BASE ON THE TIP | ENVELOPE AUTHORIZED | `AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY
   (DECISIONS:136 (3)); artifact, runner, spec and all 300 pinned product file(s), plus 2 released and NOT
   re-verified here, are byte-identical to the sealed run recorded in rebuild/lanes/b/tooling/receipts/S10.json
   3c6d1f5d1fba7699b4a5fabc9939ef84ecc5fd3b715f3df9e63399ec9b07aea4 [cut]` | 36 CHILD OBSERVED exit 0 | no new SEALED RUN
   RECORDED | `POSTFIX PACKAGE PASS M2-S10-TODAY-SPLIT`, EXIT=0.] The private census junction is removed after this run.
   Terminal 5 stands as the evidence for the private oracle, the historical audit and the 19 original gates; T24 does not
   re-run them.

## CI
- CI-M1, three runs, every red recorded:
  (a) run 36199898809 at `ccc2f63` (the first T7 merge, of chain tip `194f03f`): RED on both hosted systems at step 13,
  `B PACKAGE S10 FAIL CHILD-REQUIRED-EXIT-ZERO`, child today-17 exit 1. This was the brief's section 13 STOP (a red
  exact-head both-OS run), not the single-OS re-run case of `:816`; the remedy is the GSS settle fix below (`:832`).
  (b) run 36214720524 at `9849bc7` (CI-M1b): windows-latest rebuild-public SUCCESS (all 36 children OBSERVED, PUBLIC CI
  EVIDENCE PASS); ubuntu-latest step 13 FAIL `CHILD-NEEDLE-NOT-A-TERMINAL-LINE` at child 20 ui-pack-pins, whose direct
  ubuntu step printed tests 121, pass 118, skipped 3 (platform-keyed skips in pack-pin.test.mjs and approved-pin.test.mjs).
  Spec r3 restored the S9 `# tests N` needles of ui-pack-pins and release-object byte for byte (`:835`).
  (c) run 36217102675 at M1 `e81066d` (CI-M1c): rebuild-public ubuntu and windows success, both C font transport jobs
  success; the first all-green hosted run of the composed S10 (`:836`).
- Diagnostic runs, never merged, on `diag/s10-today17-hosted`: 36204552778 and 36206163821 (`:832`, `:833`).
- CI-1 at A `dcb73ec`: `rebuild` run 36219778403, all four jobs success (rebuild-public and C font transport, ubuntu and
  windows) (`:836`, T15).
- CI-2 at the sealing head: run `<CI-2-RUN-ID>` at `<C4>`, named on the `M2-S10-TODAY-SPLIT SEALED AND MERGED` ledger line
  with both runners' conclusions, taken at the exact lane head that carries this file. This file is not edited after that
  run, because a later commit would move the head the run must stand on (brief OWED-T26).

## Export custody
Exporter `rebuild/lanes/astra/s10-exporter-v1/export-s10-profile-v1.cjs.txt` at `d8ffbcf`, blob sha256
`de3aeb76fc7b81d70829f6a27aa52d7d56eeaadfe30a972158740eca73c93301` (13799 B). T9 CLEAN (the ignored
`rebuild/conform/run.log` that ci0 wrote was removed). T10 at M1: `S10 PROFILE EXPORTED PENDING
42a3eb020557d312f4e8199eebc79101154ebe4315d2a44fd7a6e5c719450ae8
5c2811a4eea3ad87b98753128d9f53b9b52c7ab3170aedca9964c8cf4204cb30 chain=ed10468e81a3fb52e5bb512da62ff414cfe73754
node=v24.19.0 git=2.53.0.windows.3`, EXIT=0. T11 installed both files at those sha256 (the second is the PENDING review,
never committed). The artifact records lanePackage S10, packageId M2-S10-TODAY-SPLIT, sourceBase `d7f65401...` and the S9
parent block above.

## The released pair, and why T24 does not re-verify it
`rebuild/m3/w7-preview/today/today-app.cjs` (pre `efaf6c0dbb871730788d8953ed470f2650d739b5de7c52fa7f779f2c125df933`) and
`rebuild/m3/w7-preview/today/gym-app.mjs` (pre `4c8ba0c93f48b1b38be34d08ee23d274841c55680e51a61954754d17bcf8ec53`) are
released from the seal by `DECISIONS:828` and declared `role: released`, post null, in the spec. Each pre is the S9
artifact's post for that path; neither is an S9 execution pin nor an argv target of any S10 child (REVIEW-S10-SEAL-PREP-l1,
REVIEW-S10-CLAUDE-FINAL-l1 section 1). A released path is not a pinned product file: this package stopped standing its
bytes the moment `:828` was ruled. The runner's released-path handling is S9's unchanged (the S10 runner differs from S9's
only by IDS, NO_REGISTER_IDS and CHILD_ROOTS additions, REVIEW-S10-CLAUDE-FINAL-l1 section 4): the seal step never writes
a released path into the receipt's product map, and the byte-identity re-verify skips it in both directions, so the first
lane C edit to either file does not void the receipt. Every other product file (300) is re-verified in both
directions. S9's own released pair (`build.mjs`, `preview.css`) stays undeclared here (spec notes[1]); S10 adds exactly
three REQUIRED_INPUTS to `build.mjs` under brief 4.1 (REVIEW-S10-CLAUDE-FINAL-l1 section 1).

## Engine bytes: the two `:631` clauses and D-EPP-2
This package moves engine bytes, and only these (REVIEW-S10-CLAUDE-FINAL-l1 section 5):
- `rebuild/engine/today.cjs` :97 and `rebuild/engine/writers.cjs` :227 each add exactly the exclusion
  `x.state !== "PROPOSED"` to the debut/unlock queue find, the exclusion the structural pick already has, and nothing else:
  `DECISIONS:631` O-1a verbatim. Both are the EPP input `0d38b8e` (spec notes[3]). The spec's engine keys are exactly
  today.cjs, writers.cjs, proposed-pick.test.cjs and PROPOSED-PICK-REPAIR-REPORT.md; `s10-engine-files-differential`
  states that 2 named files move.
- D-EPP-2: `rebuild/m4/workout/engine-capture.cjs` :69, the same exclusion in the capture's selected-move filter, the
  input `5a953d5` under grant (b) `DECISIONS:784-785`. It is not a `rebuild/engine` byte. Its executed evidence is the
  `d-epp-2-capture` child; `engine-capture.test.cjs` and `configuration-capture.test.cjs` carry the D-EPP-2
  re-expressions but run in no child and no CI step: they are sealed unexecuted (D-CF-2).
- Mirrors of those moves, all re-pinned to the S10 posts: `local-source-profile.cjs` SOURCE_PINS, `s3-portable-sources.json`,
  `configured-history-candidate/run.cjs`, and `rebuild/m4/import/production-mapping.cjs` ENGINE.treeSha256 (fix `dc08f36`,
  `:826`), whose value is proven only inside the m4-import-production child at the PM seat (D-CF-3).
- The nine superseded gates are retired again under `:829` and this package's own `s10-sup-*` cells and
  `s10-engine-files-differential`, not under S9's "no engine byte" reason.

## D-EPP-3, the declared departure: owed gates named, not claimed
`rebuild/engine/today.cjs` and `writers.cjs` are sealed S8 product keys declared edited here. For an untapped PROPOSED
entry the repaired engine deliberately departs from the frozen app's behaviour although no golden row moves; the file
headers still say they were copied from frozen (spec notes[4]; payer the S10 seal chain by `:780` Q3). Owed, and NOT
claimed by this verdict: (1) the port oracle on the synthetic fixture; (2) the sensitivity pass; (3) the private gate;
(4) exact-head CI on both systems (CI-2 above, `<CI-2-RUN-ID>`). Grant (g) `:816` covers (3) at the PM seat; no line
this verdict stands on records (1), (2) or (3) as run. The LEGACY conformance and selftest lines of T14b and T20 do not
pay them: those gates run `rebuild/conform/run.cjs` against the pinned public reference bundles (the frozen app's engine
against itself), not against the repaired `rebuild/engine` bytes (D-T16-3, REVIEW-S10-SEAL-T16-FABLE-l1 section 4).

## D-EPP-4, the real-engine red half
Paid in bytes at `12be4ea` (row EPP-R9, the self-sensitivity guard for proposed-pick). The real cell's GREEN half is
measured on hosted CI (run 36158401022 at `f97924a`, step `E - EPP proposed-pick` success on ubuntu-latest and
windows-latest, a step conclusion, not a row count; spec notes[8]). Its four-deletion RED half on the real engine
(D-S10I-8) is STILL OWED: it has no CI job, it loads the protected engine locally, and no line this verdict stands on
records it as run.

## D-GSS: the `:832` STOP and the settle fix `e9ff2ca`
- STOP (`:832`): CI-M1 (a) red on both systems at today-17. The PM seat found D-GSS-G6 red again under load
  (`GSS-G6-SAVED-SCREEN`: the saved screen was asserted after a fixed settle of 8 macrotask turns, not after a bounded wait
  on a condition), and corrected `:827`: the two D-GSS reds at `92be4e3` had been dispositioned as load timing and
  today-17 re-observed alone, which let a load-sensitive cell into the needle table.
- Cause (`:833`): `settle()` is 8 timer turns, about 123 ms on the PC and about 8 ms on 1 ms-tick hosted runners, and the
  saved screen needs up to 8 of those turns. The hosted diag run failed exactly D-GSS-G6, both D-GSS-NEUTRAL-REPAINT,
  D-GSS-G7 clean and D-GSS-G5.
- Fix `e9ff2ca` on `rebuild/c-s10-gss-settle-fix`: test-only, two files, +30/-0 (`gss-annex-g6-g8.test.mjs`,
  `gss-annex-log-timing.test.mjs`): a wall-clock `painted()` wait before each Log-success oracle; every assertion, plant,
  negative site, `until()`, `within()` and timeout byte-identical. Red-first under a deterministic slowdown (unchanged
  bytes red, fixed bytes green), product probe: every saved screen appears and none is cleared (no product race);
  never-paints and paints-then-clears mutants red on the fixed bytes. S10-REGEN re-pinned the two posts
  (`64b0875225bcd7f64009f1ab67a10c88c542821f3b794794fee36c9cbb4718fd`,
  `ae42d717897e00d2b532ba8fd420abe7c9fdc3d631c5fbea685766441b26a7c0`); every needle was voided and all 36 children were
  re-observed at `e9ff2ca` (`:834`).
- Reads: Fable l1 (REVIEW-S10-GSS-SETTLE-FIX-FABLE-l1) ACCEPT WITH NAMED DEBTS D-GSSFIX-1 (`until()` is an iteration
  budget, host-specific in wall clock like `settle()` was) and D-GSSFIX-2 (a stale clear is caught only inside the
  `settle()` drain, unchanged by the fix; the neutral-repaint pair is the product-level guard); Astra L1 (job 134) ACCEPT
  WITH NAMED DEBTS GSS-LATE-CLEAR and GSS-G5-DIAGNOSTIC. All four are carried here (`:834`).
- Carried, not paid by this seal (REVIEW-S10-CLAUDE-FINAL-l1 section 6): D-GSS-TIMER (a named residue present exactly as
  `:628` ruled), D-GSS-PASSTHROUGH (`api.lane()` returns the live host, the one pinned passthrough), D-GSS-LINES.

## D-SPLIT-LISTEN, D1 and D2
- D-SPLIT-LISTEN: carried, not paid by this seal (REVIEW-S10-CLAUDE-FINAL-l1 section 6). Its payer by the brief of record
  (section 7.1, `:662`) is TODAY-OUTCOME-TYPE.
- D1 and D2: the brief of record, section 7.1, states the payers as "D1 and D2 remain owned by TODAY-GESTURE-PAINT-ROOTS
  and TODAY-OUTCOME-TYPE (:633). Their inherited behavior is reported, not fixed or declared accepted by S10." So neither
  is paid by this seal; both are carried to those two packages.
  OPEN ITEM C2-OPEN-1 (named, not ruled here): the brief names the two owning packages jointly and does not say which of
  them pays D1 and which pays D2 (no "respectively"); the per-debt payer is left to the PM.
- OPEN ITEM C2-OPEN-2 (named, not measured here): brief section 7.1 also carries the split debts D3, D5, D6, D7 and D9
  (L3 175f6323, repeated by Astra L4 84302990) and L4's D4 boot-contract row (S-R33, `:633`), and section 6.2 carries the
  six inherited scope rows (`:653`, `:662`) "still owed at integration". D5 and the six 6.2 scope rows are CARRIED
  under D-S10R11-2 (PM RULED `:818`; brief section 13), not paid; for D3, D4, D6, D7 and D9 this verdict does not state
  whether the integration paid them, and the PM names each as paid (with its evidence) or carried before C4.

## Records and debts of this seal chain (`DECISIONS:826`-`:837`)
- Needles (`:826`, `:827`, `:834`, `:835`): the T4 fix `dc08f36` (Fable REVIEW-S10-T4-FIX-l1 ACCEPT) paid two real import-side
  defects found only locally; the needle table of record is the re-observation at `e9ff2ca` (all 36 green, sha256
  `064ff80ed2cd6d2c7abeb950951065df00814bdbf8d9b8b5ca4f37ccffcdcf3f`), which supersedes the `f4125cd` table; spec r3
  restores the S9 `# tests N` form for ui-pack-pins and release-object.
- D-CENSUS-STAGED-COUNT: PAID by the census addendum commit `2c4d24e` (REVIEW-S10-T6F-FABLE-l1 section 5). Census addendum 2
  (`f4125cd..e9ff2ca`, `:834`; `5b230c5`): 277 paths, 518 staged rows, 496 physical hunks, M 173 R 143 N 202; 0 UNCLASSIFIED under
  census limit (5), TSV self-reference excluded (D-SP-2), the wording D-T6F-2 asks for.
- D-R2F-1 (T6e needle constant read the superseded table): paid when T6e r4 re-pointed its needle check to the `e9ff2ca`
  table (REVIEW-S10-SPEC-R3-FABLE-l1 Q5). D-R2F-2 (m4-import-production `# pass 28` unrecorded): paid by `:834`.
  D-R2F-3 (census row 150): PM RULED at `:834`, class M when the lane's `rebuild/DECISIONS.md` equals the chain tip the lane
  last merged. The census-rule ruling stands as the rule for later addenda.
- D-R3F-1 (T6e r4 lost the 36-children clause): restored by the PM before its run (`:835`); T6e static r4 33 PASS
  0 REFUSED (`:836`). D-R3F-2 (ten children observed on windows only at `9849bc7`): its proof is the first ubuntu run at
  spec r3, CI-M1c 36217102675 (success on ubuntu, `:836`).
- D-T6-STATIC, D-T6-READS and D-SEAL: named by Astra L3 (job 138) at `:835`, ACCEPT WITH NAMED DEBTS; carried as named.
- D-S10I-3 (the today-17 child's name, spec notes[2]): carried as named.
- The runner move `5321181a` -> `9fbfdd2d` (the S10 runner), with the seven ancestor spec re-pins and `packages/S9.json`
  declared superseded-by-child in the S10 product map (REVIEW-S10-SEAL-T16-FABLE-l1 sections 3 and 6): recorded.
- The ci0 red (`:835`): RECORDED, NOT EXCUSED (terminal 1 above). The report-only hunt for remaining load-sensitive cells
  in the guard-clean today-17 files is NOT FINISHED: the PM ended its workflow and in-flight runs so the seal kept the
  PC; it is relaunched after the SEALED AND MERGED line with a one-slot cap (`:836`). This keeps D-S9SEAL-3 open (below).
- D-PATH-NODE (`:836`): node is not on the PC's PATH since the S9 seal, and `rebuild/conform/run.cjs` spawns bare `node`
  for the port oracle; T14's first run failed on it (terminal 3) with no product or gate defect. T14b, T20 and T24 carry
  node's folder on PATH. Carried until the PC's PATH or the spawn is fixed by a reviewed change.
- The T23 coach red (PM log, 01:58:10): the first coach run used the runbook's bare directory form
  (`rebuild/coach/test`), which node 24 refuses, and exited 1; it was re-run on the same bytes with the `rebuild.yml`
  glob `rebuild/coach/test/*.test.cjs` (377/377, exit 0; the coach constant below). RECORDED: a runbook command defect,
  not a product or test defect; whether the runbook's T23 form is corrected to the glob is the PM's to rule.
- D-NODE-MODULES-HOME (`:826`, `:827`, `:834`): the lane's root `node_modules` junction, used by the S9 and S10 PM runs,
  resolves into the old-app checkout's `node_modules`; packages load from there and no file of that checkout is opened.
  Carried until a clean pinned install home is ruled.
- Claude final (REVIEW-S10-CLAUDE-FINAL-l1, at `4dc2029`) ACCEPT WITH NAMED DEBTS, carried here as it asks:
  D-CF-1 (wording): S10 comments in `.github/workflows/rebuild.yml`, `b-package.cjs` and the Today test CHILD_SPECS cite
  the working paper `S10-WORKING-BRIEF.md c58b892`, not the brief of record; the cited sections are carried unchanged
  into the brief of record; not fixed in S10, because editing the runner re-pins every ancestor spec.
  D-CF-2: `engine-capture.test.cjs` and `configuration-capture.test.cjs` are sealed unexecuted (above).
  D-CF-3: ENGINE.treeSha256 in `production-mapping.cjs` is proven only by the PM-seat m4-import-production child.
- D-T6F-1 (m4-import-production `# pass 28` a PM measurement): recorded at `:834`.
- Paid within the chain: D-R2-1 and D-R2C-1 (all 36 needles re-observed and notes re-authored, `:834`), D-R2-2 and
  D-R2C-2 (census addendum 2, `:834`), D-R2C-3 (the lane took `e9ff2ca`, `:833`), D-R2C-4 (T6e re-run and the reads,
  `:834`); D-R2-3 concerned the review worktree, not the lane, and T9 measured the lane clean.
- Carried as named, none blocking (REVIEW-S10-SEAL-PREP-l1, REVIEW-S10-CLAUDE-FINAL-l1 section 6): D-SP-1, D-SP-3 to
  D-SP-6; D-S10R11-1 to D-S10R11-5; D-COPYLOCK-*.
- Chain freeze: from L5 (`:837`, R `ca7f676`) to the SEALED AND MERGED line nothing is appended or committed to
  `rebuild/t2-client-core` (`:836`); lane and prep branches keep working.
- Fable T16 (REVIEW-S10-SEAL-T16-FABLE-l1, ACCEPT WITH NAMED DEBTS), its five debts carried as named:
  D-T16-1 (procedure): the chain moved to `48f40c0` (`:836`) after M1; the freeze is announced at R and the V..M2 diff is
  `rebuild/DECISIONS.md` only (measured, Authority above); a second chain move after R needs the FREEZE ruling of
  D-S9SEAL-4.
  D-T16-2 (record): the first T14 red (EXIT=1, the conformance gate stopped by the PATH cause, 7 LEGACY lines, the tree
  unchanged when T14b re-ran it) and the T8 ci0 red are recorded in terminals 1 and 3 above and owed on the L6 line, per
  `:835`.
  D-T16-3 (owed, carried): D-EPP-3's port oracle, sensitivity pass and private gate on the repaired engine are not paid by
  the LEGACY conformance and selftest lines (D-EPP-3 above).
  D-T16-4 (hygiene): the lane worktree holds the ignored `rebuild/conform/run.log` and `rig185.log` (regenerated by the
  --full runs) and the `rebuild/conform/engines` folder; harmless to the byte-identity step, but any re-export repeats T9
  first, because the exporter refuses ignored entries under `rebuild/`.
  D-T16-5 (record): the Fable and Astra review files after `9479958` (T6f, R2 l1, R2F, r3, the GSS fix reads, the
  exporter containment read, census addendum 2 and the T16 read itself) are not in the lane at A; T25 commits every one of
  them, or the sealed record loses them.
- Every red of this seal, in order (`:835`): CI-M1 (a) 36199898809 at `ccc2f63`, both OS red at today-17; CI-M1 (b)
  36214720524 at `9849bc7`, ubuntu needle red; T8 ci0 at `9849bc7`, today-17 725 of 726; the first T14 full1 at A, EXIT=1
  (PATH); the first T23 coach run, exit 1 (bare directory form). Then green: CI-M1 (c) 36217102675, T14b REVIEW-PENDING
  EXIT=2 as predicted, CI-1 36219778403, T20 PASS EXIT=0 with no re-run, the T23 coach re-run 377/377 and the production
  pair 28/28. CI-2 (`<CI-2-RUN-ID>`) and T24 (`<T24-RESULT>`) are recorded at C4.

## V9 carries restated (from `VERDICT-S9.md`)
- D-S9SEAL-1 (the runbook's predicted pinned-file count was wrong, the runner's is of record): the rule is applied here;
  the count of record is 300 from T20's SEALED RUN RECORDED line (the T16 prediction was also 300, the artifact's product
  key count; the runner's line, not the prediction, is of record).
- D-S9SEAL-2 (restate the unpaid carries): paid again by this section, D-BLOM and the released pair above.
- D-S9SEAL-3, the today-17 flake class (`rebuild/m3/w7-preview/measure/test/journey.test.mjs`, the `DECISIONS:496` class):
  STILL OPEN, now joined by the D-GSS load-sensitive class (`:832`, `:833`, `:835`). S10 adds evidence, not closure: the
  GSS annex reds were a timer-quantum defect in test bytes, fixed at
  `e9ff2ca`; the ci0 red (725 of 726) is recorded, not excused; the hunt is unfinished. A single red on that cell is
  re-run, not edited, and every red is recorded in the ledger line and here (`:835`); a single-OS today-17 red at CI-2
  follows the `:816` empty re-run commit rule.
- D-S9SEAL-4 (the chain branch stays frozen through the seal window): carried in S10's form, from L5 (`:837`, R
  `ca7f676`) to the SEALED AND MERGED line (`:836`). A chain move in that window takes the seal base off the tip and needs
  a PM FREEZE line naming the base before any authorized rerun can pass.
- V8 carries, still unpaid; nothing in the records this verdict stands on pays them:
  the `.github/workflows/rebuild.yml` comment that says the brief predicts the exact refusal (the S8 brief predicts `R01`
  verbatim; `S8-PREP-AUTHOR-REPORT.md` names `RECEIPT-EXACT-LINE-MISSING`, `DECISIONS:524` N3), corrected in prose only;
  `rebuild/lanes/b/tooling/packages/S8.json` citing its own three ledger lines one number low (`:524`, `:525`, `:526` for
  `:525`, `:526`, `:527`), located by sha256 so nothing rests on the numbers (S10 moves S8.json by its runnerSha256 line
  only); lane D (a) the layout's `profile` not tied to the producer's `rule_profile` in the law; (b)
  `rebuild/m4/spec/configured-history-candidate/construct.cjs:6` patching the old one-profile string (env-gated, in no bar
  row); (c) `entry.load` null for a configuration lift (`DECISIONS:523`); (d) the identity trade (the proof that an
  imported file is the owner's is the sealed file, the six words and his identity Yes; `DECISIONS:472 (a)` and `:521`);
  (e) `listImports` on the owner's own installation not re-verified, verified at the owner's retry.
- The S8 p3-layout-v2 note was paid at S9 and is not carried.

## D-BLOM
The parent's child b-lom (`rebuild/lanes/d/b-lom/legacy-order.test.mjs` and
`rebuild/m4/workout/test/legacy-order-mapping.test.cjs`) is not declared by this package, exactly as the sealed parent
M2-S9-UI-PINS does not declare it (`DECISIONS:798`, owner BLOM-OPTIONS 2(b); `:799` binds the same narrowing on S10 when it
re-binds to the sealed S9; spec notes[9]). Its LOM-S6 walk reads every code file under `rebuild/m3` and `rebuild/m4`, a
protected path included, which stays protected until 2026-10-05. Both cell files keep whatever role the product map gives
them, and CI keeps running the test in its `rebuild.yml` step. S8's `# pass 30` stays the last sealed b-lom evidence; it
does not prove this tree. D-BLOM is re-measured after 2026-10-05 by the hosted-blom packet once it is re-pointed and
reviewed.

## The coach constant
`rebuild/coach/engine-revision.cjs` `ENGINE_REVISION` moves once, from `M2-S9-UI-PINS@cb31838ff0db8406` (set at the S9 seal)
to `M2-S10-TODAY-SPLIT@3c6d1f5d1fba7699` (the first 16 hex of this receipt's sha256), in commit C3 `<C3>` after this
verdict. The edit is made in the lane worktree (one line, `:25`; C1 still carries the S9 value) and is committed as C3 after
C2. The production pair (production-mapping and production-admission) ran 28/28, exit 0.
The coach suite (`rebuild/coach/test/*.test.cjs`, the `rebuild.yml` glob, on the working tree that differs from C1 only by the one ENGINE_REVISION line C3 commits) ran 377/377 (tests 377, pass
377, fail 0), exit 0; the runbook's bare directory form was refused by node 24 and exited 1 first (Records above).

## What this seal carries for the athlete
The Today screen's writers leave the view files: the accepted writers-out Today split (`b35a48e3`) and the accepted
gym-settings writer change (`66d32530`) are sealed as their writer siblings, while `today-app.cjs` and `gym-app.mjs` are
handed out of the seal so lane C can keep shaping them without reopening the package. The engine stops treating an
untapped PROPOSED entry as the next debut or unlock (the two `:631` clauses), and the workout capture no longer captures
it (D-EPP-2). No other engine byte moves. The owner said "Yes, at each seal" at `DECISIONS:816` (2): the fast-forward that
lands this seal updates his phone preview through `slice-host.yml`. The only coach byte that moves is the revision
constant, which moves once to name this seal.
