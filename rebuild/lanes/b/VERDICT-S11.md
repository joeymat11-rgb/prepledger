
# VERDICT - M2-S11-NATIVE-LOAD - lane B seal - PASS on the `DECISIONS:892` receipt

Lane `rebuild/b-s11-integration`, worktree W11 (`%TEMP%\earned-s11int`) on the owner's Windows PC, executed there by the PM seat
under grant (g) `DECISIONS:816` (PM seat only, pass/fail lines only, the private census included; no data leaves the PC).
Artifact commit `24982cf1eb92c092cfd53a70ea14269ec219d59e` (A, the reviewed commit; artifact only, parent M1
`04560046f31b1acb2da63f447b2ba40e13b8126c`, the merge of H `cb04b0d147ee997b2eaf8b6cc09234e65ddda005` with chain tip
`d01dac7b18d06bcfe0cd0fe17c14c5a015547b49`). The chain tip `84f5bca1784f726133352f3f0bc38ea343766409` (R, receipt base) is an
ancestor of the sealing head, so the seal base is on the tip (rule=ancestor, `DECISIONS:135 (4)`). sourceBase
`edb8381ea6a9f5373c8519ee7e9d7d8a303c2369`, the S10 seal tip (`DECISIONS:838`; S11.json `sourceBase`). PRODUCT FREEZE from H
`cb04b0d` (`DECISIONS:890`). The first seal pass (M1 `5ab2780`, A `c55036c`, artifact `93f55718`) is HISTORY: its reds are
recorded below and its artifact was withdrawn at `c0f0039` (`DECISIONS:889`).
No private value, count, hash or prose appears in this file. The PASS word above is the runner's, earned on the FULL run
against `DECISIONS:892` (terminal 7 below).

## Authority
- Package id M2-S11-NATIVE-LOAD, fixed by THEME **`DECISIONS:874`** (ACCEPTED; lineSha256
  `e3cfb1c0a277e438f804d3200eaa39077e309a38a1503187b141ec80864b90dd`, S11.json `authorizations.theme`) and GATE-SUPERSESSION
  **`DECISIONS:873`** (RULED). THEME states: the reseal child that places the accepted NATIVE-LOAD feature (route B, yes-only
  native load; NATIVE-LOAD closed at `DECISIONS:870`, `rebuild/e-native-load-red` `35859dc`, merged as `0b8d074`) on the sealed
  S10 parent; it moves `rebuild/engine` bytes (new `native-load.cjs`, `writers.cjs` FG01, `progression.cjs` FG02) under owner
  grants `DECISIONS:784-785 (a)`, `:796 (c)`, `:803 (e)`, `:804 (f)`; it names the FC09 A-LEGACY-VECTOR admission rule as
  outside grants (a)-(f), owner-approved at `DECISIONS:819`, under spec R9.13 (iv).
- Brief of record by sha: **`DECISIONS:875`** (BRIEF ACCEPTED BY SHA; lineSha256
  `3eae16a81e415bcc89c5f78580596469ace535f3948a9cc2874cbc2f702959f4`, S11.json `brief.acceptedLedgerLine`), naming
  `rebuild/lanes/b/S11-NATIVE-LOAD-BRIEF.md` sha256 `4f7d431f97fc16f7d0df043fcce9a8339d70e1cfb3801ec1e3447bb7cba05465`
  (352743 B; the artifact's execution pin, REVIEW-S11-SEAL-T16-FABLE-l1 section 2). S11.json notes[0]: accepted on its Fable l9
  and Astra T5 L6 reads, recorded at `DECISIONS:855 (3)`, FROZEN from T5. No amendment: the C2-FC09-BRIEF ruling (`:890 (1)`).
- Gate supersession: the standing role `DECISIONS:153` granted by the token clause **`DECISIONS:873`** (RULED, role
  "cowork (PM)"), the spec's `coverage.superseded.rulingLineSha256`
  `76c110f6f3e20092b90bce084a56378b340084ce91de402d639fbcad6b1dc82a`. Five carriers (source-carriers, inherited-carriers,
  defect-witnesses, writers-differential, second-gate) cover the nine gates merge-source, migrate-source, writers-source,
  migrate-differential, witnesses-2, witnesses-5, witnesses-7, writers-differential and second-gate (`:873`); each gate's `why`
  in S11.json cites `:873` and names its executed s11-sup-* child. The artifact's 19 gates are coverage.run 10 plus superseded 9
  exactly as `:873` names them (Fable T16 section 2).
- No RELEASE-FROM-SEAL: S11 releases nothing; neither S11.json nor the artifact has a release or released key (notes[7]; Fable
  T16 section 2). The pair released by `DECISIONS:828` is S10's, carried as S10 carries it (Inherited, below).
- Parent (single, immutable): `rebuild/m4/spec/acceptance-s10-today-split.json` sha256
  `42a3eb020557d312f4e8199eebc79101154ebe4315d2a44fd7a6e5c719450ae8`, review `rebuild/m4/spec/review-s10-today-split.json`
  sha256 `8d9132787373e9e3e9a3ee1f91be8c403867acd9b8136a6390d1029a1d6a2a0a`, receipt `DECISIONS:837`, reviewed commit `dcb73ec7`,
  sealed and merged at `DECISIONS:838` (S11.json `parent.options[0]`; the artifact's parent block, Fable T16 section 2).
- Owner authority and contract: `DECISIONS:60` and `:49`, copied byte-exact from S10.json (S11.json `authorizations.owner` and
  `.contract`, lineSha256 `ebb565c6...` and `f14f5e92...`, text- and sha-equal on the chain, Fable T16 section 3). Owner bar for
  NATIVE-LOAD: `DECISIONS:866 (2)` (owner, verbatim "Yes, do it"): NATIVE-LOAD is done when no problem reachable from genuine
  use remains; a finding that needs a hand-built or damaged record becomes a named debt, never a REJECT. CITATION CORRECTION
  RULED at `:890 (3)`: `:878` and `:885` say "the bar of :862"; the owner's words are at `:866` (`:862` is the ruling's record).
- Approved copy: `DECISIONS:798 (3)`, `:804`, `:842 (2)` (OWNER DELEGATED), re-bound from `native-load.cjs` `92a4a0b4` to
  `dd197849` at `DECISIONS:872 (1)` with no approved string changed; after FC09, RULED at `:890 (2)` (C2-COPY-BIND below).
- b-lom: `DECISIONS:798` and `:799`; debt D-BLOM below (S11.json notes[8]).
- Receipt of record: **`DECISIONS:892`** (POSTFIX-ACCEPTANCE M2-S11-NATIVE-LOAD, L5) at R `84f5bca1784f726133352f3f0bc38ea343766409`,
  carried by `rebuild/m4/spec/review-s11-native-load.json` (sha256 `0f30ed864008b2dae1d4cc4b27a8a46b4d9d592c592cb7c7d3ced0bcfcd5e0af`,
  484 B, hashed on the W11 disk at C1) as `{status: "ACCEPTED", receipt: {commit, path, line, lineSha256}}` (lineSha256
  `4a416036b436660b338e5cfbfe4824dce30f3b3d27838d7bd3882b3788ca1987`, `%TEMP%\s11-t17.json`). The line is paraphrased, not
  quoted, because its clauses are joined by the ledger's middle-dot separator: dated 2026-10-03, role clause cowork, then
  POSTFIX-ACCEPTANCE M2-S11-NATIVE-LOAD, the commit A `24982cf1eb92c092cfd53a70ea14269ec219d59e`, the path
  `rebuild/m4/spec/acceptance-s11-native-load.json`, the artifact sha256 `d5ac8ee6...` and the terminal word ACCEPTED. It
  follows the T7-T16 record line `DECISIONS:891`. R (commit "DECISIONS:892 L5 POSTFIX-ACCEPTANCE ..."; S11 chain freeze starts)
  was pushed. The envelope was committed as V `bf51eb18b00a736e9cf3bc8776b410b86fd9af6e`; merge-forward #2 is M2
  `a5a92ea381bdacaba8bd2d2b5086d0d6b4a4c059` (parents V and R); the diff V..M2 is `rebuild/DECISIONS.md` only (2 insertions,
  :891-:892) and `rebuild/lanes/STATUS.md` is unchanged (brief T19); the sealed-run receipt was committed as C1
  `f4fae8a91a95c830705831c00d2289ff97209ab3` (parent M2; that one file).
- Fable T16 seal read at A: REVIEW-S11-SEAL-T16-FABLE-l1 (`3834565d`), ACCEPT WITH NAMED DEBTS D-T16S11-1..7; nothing in A, the
  spec, the runner or the artifact had to change before L5 (a Fable read, not a stand-in, `DECISIONS:843 (2)`; Astra is not a
  gate at T16 or T22, `:844 (3)`; brief rev8 PART B NOTES, line 295). Its seven debts are carried below. Fable T22 read of this
  file: REVIEW-S11-VERDICT-C2-FABLE-l1 (`ff626435`), ACCEPT WITH NAMED DEBTS.

## The evidence hashes this seal stands on
- Artifact `rebuild/m4/spec/acceptance-s11-native-load.json` sha256 **`d5ac8ee62d1d25191deda133479b2cce71581ee6c6e8ad06b9b64abdf79b372c`** (121136 B; exporter s11 v1, run `s11-final-2`).
- Spec `rebuild/lanes/b/tooling/packages/S11.json` sha256 **`c97e468ca692240c3f4d5c8e57cd4e9ecc75fc1e408f8c1747d25687196b02da`** (132585 B).
- Runner `rebuild/lanes/b/tooling/b-package.cjs` sha256 **`bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3`** (317089 B).
Each was re-hashed by Fable T16 from `git show A:<path>` bytes (sections 1-2) and re-hashed again on the W11 disk at C1 for this
file (artifact and spec); the artifact's own `spec` and `runner` blocks carry the same two sha256, and all three equal the ci2,
full2 and T20 envelope lines (Terminals). The artifact's product map has 320 keys equal both ways to the spec's, every post
equal to the spec's post, 315 re-hashed at A equal (the protected five not hashed by the reader; the runner pinned them at T20),
and 100 execution pins (97 argv files, runner, spec, brief) all equal at A (Fable T16 section 2).

## Sealed-run receipt (`DECISIONS:136 (3)`)
`rebuild/lanes/b/tooling/receipts/S11.json` sha256 **`6ead5e9e87c0ec849cde25f95e07f4db374b8fd7a4a732ad7a18cc4d73d26af1`**
(40726 B), written by the runner itself on the terminal branch of the FULL run that earned
`POSTFIX PACKAGE PASS M2-S11-NATIVE-LOAD` (exit 0, terminal T20) with the private census junction in place, and committed
unmodified as C1 `f4fae8a91a95c830705831c00d2289ff97209ab3` (equal to the sha256 the runner printed on its SEALED RUN NEXT STEP
line; re-hashed on the W11 disk at C1). Receipt id `M2-S11-NATIVE-LOAD@6ead5e9e87c0ec84`. Its `sealedRun` block carries the
three hashes above, the `envelopeKey`, this verdict file by name (`rebuild/lanes/b/VERDICT-S11.md`) and the 320 pinned product
shas of T20's SEALED RUN RECORDED line (declared product 320: edited 52, carried 248, new 19, superseded-by-child 1
(`packages/S10.json` `0f55a704` -> `566539de`), 0 released; Fable T16 section 2). The runbook's prediction was also 320; the
runner's line, not the prediction, is of record (D-S9SEAL-1). With these bytes in Git and this sha256 named here, the
`:136 (3)` byte-identity step is AVAILABLE. The coach constant moves to `M2-S11-NATIVE-LOAD@6ead5e9e87c0ec84` in C3 (below).

## Terminals - executed on the PC, exit codes measured
Every line quoted below is from the PM's FILTERed run logs (`%TEMP%\s11-t16-inputs.txt` for T8-T14; the PM's T20 lines; runbook
section 0 FILTER, `-CaseSensitive`, `DECISIONS:838`); `[cut]` marks the FILTER's 200-character cut, a non-ASCII dash in the
runner's text, or the PM's own elision (`...`). Every runner line carries the prefix `B PACKAGE S11 `, dropped here. The cmd
files carry both git's and node's folders on PATH (D-PATH-NODE, `DECISIONS:836`; runbook section 0).

### First pass (HISTORY; every red RECORDED, NOT EXCUSED, `DECISIONS:888`; Fable T16 section 4)
From H `01a7050` (PRODUCT FREEZE at `:887`): T7 preflight 0 hits; M1 `5ab2780` = merge of chain tip `71dc0a8` (`:888`).
1. T8 ci0 at M1 `5ab2780`: `POSTFIX M2-S11-NATIVE-LOAD REVIEW-PENDING mode=--ci` | `ENVELOPE ABSENT;
   rebuild/m4/spec/acceptance-s11-native-load.json is not sealed yet [cut]` | `FAIL CHILD-REQUIRED-EXIT-ZERO; required evidence
   missing or failed; local diagnostics withheld`, EXIT=1 | CHILD OBSERVED 0 | LEGACY 0.
2. T8 ci0b (re-run at M1 `5ab2780`): `POSTFIX ... REVIEW-PENDING mode=--ci` | `ENVELOPE ABSENT [cut]` | `OPEN closed cumulative
   profile not sealed` | `PUBLIC CI EVIDENCE PASS [cut]`, EXIT=0 | CHILD OBSERVED 39 | LEGACY 0.
3. T10 export at M1 (`s11-final-1`): artifact `93f557187ef90b5daf70f97c3ef3ee86d89456468d944a889a20e64e2ae7ee81`, review `5c2811a4`,
   chain=`71dc0a8` (`:888`).
4. T12 ci1 at M1 with that artifact: `POSTFIX ... REVIEW-PENDING mode=--ci` | `ENVELOPE PENDING
   artifact=93f557187ef90b5daf70f97c3ef3ee86d89456468d944a889a20e64e2ae7ee81 spec=321967eeafef7477cacc14bb7d358a7b0bb9c81e357b094ad83db0970f2c11ed
   runner=bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3; independent [cut]` | `FAIL CHILD-REQUIRED-EXIT-ZERO
   [cut]`, EXIT=1 | CHILD OBSERVED 0 | LEGACY 0.
5. T12 ci1b (re-run): same ENVELOPE PENDING line | `OPEN independent exact-artifact acceptance PENDING` | `PUBLIC CI EVIDENCE
   PASS [cut]`, EXIT=0 | CHILD OBSERVED 39 | LEGACY 0.
6. T13 A `c55036c` (artifact only), pushed (`:888`).
7. T14 full1 at A `c55036c`: `POSTFIX ... REVIEW-PENDING mode=--full` | the same ENVELOPE PENDING line | `FAIL
   CHILD-REQUIRED-EXIT-ZERO [cut]`, EXIT=1 | CHILD OBSERVED 0 | LEGACY 0; the private census junction was then removed (`:888`).
The three reds (ci0, ci1, full1) are one cell, today-17 `copy.test.mjs:167` P1 (828/829; assert :188, 1002 !== 903), a TEST-ONLY
build-dir race (P1 read the shared `.tmp/w7-today-dist` while other tests rebuilt it in parallel processes); the shipped app is
unaffected. PM RULING: fixed, not re-run around (`:888`). The artifact `93f55718` of A `c55036c` was withdrawn at `c0f0039`
(`:889`); no L5 was written in the first pass.

### The fix between the passes (`DECISIONS:889`, `:890`)
- Distfix: `copy.test.mjs` `290a90ab` -> `78779d8f` (+16/-6): P1, A1, `planted()` and both `again` builds use their own dist and
  scratch directories through `buildToday()`'s existing options; every assertion byte-identical (REVIEW-S11-DISTFIX-FABLE-l1
  (1)); `build.mjs` unchanged. Red first under parallel-build hammers: OLD P1 FAILED 2/40, NEW 0/40; OLD MARKUP 0/40 then FAILED
  2/100 at 4 hammers, NEW 0/100; full today-17 argv 829/829 (`:889`). Fable distfix l1 ACCEPT WITH NAMED DEBTS (D1, D2, D5
  carried; D3 removed before commit; D4 paid by the 100-run red, `:889`). Committed `9a880d3`, fast-forwarded into W11;
  S11-REGEN --write moved one post (carried -> edited), H `48f1f20` (`:889`).
- Third T5b (run `37108132701`) all 39 green on both OS; T6 again: needles re-taken from it and UNCHANGED; only notes[14] differs
  from `48f1f20`; Fable l2 ACCEPT; H `cb04b0d`, PRODUCT FREEZE (`:890`).

### Second pass (the seal; T7-T16 recorded at `DECISIONS:891`)
1. T7 at H `cb04b0d`: preflight 0 hits (delta `rebuild/DECISIONS.md` only; `adafcc8`, `8bd959f` and `3c8af05` not ancestors; no
   `s11-observe.yml` in the tree; no `obs/s11-*` ref anywhere); M1 `04560046` = merge of chain tip `d01dac7`, pushed (`:891`).
2. T8: skipped at this M1 (the first pass ran it; runbook D4; `:891`).
3. T9 clean (junctions out, `run.log` removed, status empty under rebuild and .github). T10 EXPORT at M1 with the same exporter:
   `S11 PROFILE EXPORTED PENDING d5ac8ee62d1d25191deda133479b2cce71581ee6c6e8ad06b9b64abdf79b372c 5c2811a4... chain=d01dac7...
   node=v24.19.0 git=2.53.0.windows.3` (scratch `s11-final-2`). T11 installed (w5 and w6 junctions restored as E1 ruled at `:888`)
   (`:891`).
4. T12 ci2 at M1 `04560046`: `POSTFIX M2-S11-NATIVE-LOAD REVIEW-PENDING mode=--ci` | `ENVELOPE PENDING
   artifact=d5ac8ee62d1d25191deda133479b2cce71581ee6c6e8ad06b9b64abdf79b372c spec=c97e468ca692240c3f4d5c8e57cd4e9ecc75fc1e408f8c1747d25687196b02da
   runner=bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3; independent [cut]` | `OPEN independent exact-artifact
   acceptance PENDING` | `PUBLIC CI EVIDENCE PASS [cut]`, EXIT=0 | CHILD OBSERVED 39 | LEGACY 0. Public evidence only; no PASS word.
5. T13 commit A `24982cf1` (artifact only; diff-tree M1..A is that one file, Fable T16 section 1), pushed.
6. T14 full2 at A `24982cf1` (review absent from the tree, private census junction in place, target by Test-Path only, never
   listed): `POSTFIX M2-S11-NATIVE-LOAD REVIEW-PENDING mode=--full` | the same ENVELOPE PENDING line | `PRIVATE ORACLE PRESENT;
   verdict-only reporting [cut]` | `FULL EVIDENCE: 10 of the 19 original gates re-executed, 0 carried by successor children that
   executed in this run and 9 SUPERSEDED under DECISIONS:873, each replaced by this package's own executed evidence; second gate
   included` | `OPEN independent exact-artifact acceptance PENDING` | `POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation(s);
   independent exact-artifact acceptance required`, EXIT=2 | CHILD OBSERVED 39 | LEGACY 10. The runbook predicted ENVELOPE ABSENT;
   the line read ENVELOPE PENDING because the untracked PENDING review file from T11 was on the lane disk; same verdict path,
   recorded as D-T16S11-1 (`:891`). The junction stays until T24.
7. T20 full3 at M2 `a5a92ea` (review ACCEPTED on `DECISIONS:892`, tip merged, node's folder on PATH):
   `POSTFIX M2-S11-NATIVE-LOAD AUTHORIZED mode=--full` |
   `SEAL BASE ON THE TIP; [cut] at 84f5bca [cut]` |
   `ENVELOPE AUTHORIZED artifact=d5ac8ee6 [cut] reviewed at 24982cf1 [cut]; receipt base 84f5bca1 [cut]` |
   `AUTHORIZED STEP UNAVAILABLE SEALED-RUN-RECEIPT-ABSENT [cut]` |
   `PRIVATE ORACLE PRESENT [cut]` |
   `FULL EVIDENCE: 10 of the 19 original gates re-executed [cut] 9 SUPERSEDED under DECISIONS:873 [cut]` |
   `SEALED RUN RECORDED rebuild/lanes/b/tooling/receipts/S11.json; artifact=d5ac8ee62d1d spec=c97e468ca692 runner=bdbb8a938a9f over
   320 pinned product file(s)` |
   `SEALED RUN NEXT STEP [cut] sha256 6ead5e9e87c0ec849cde25f95e07f4db374b8fd7a4a732ad7a18cc4d73d26af1 [cut]` |
   `POSTFIX PACKAGE PASS M2-S11-NATIVE-LOAD`, EXIT=0 | CHILD OBSERVED 39 | LEGACY PASS 10. No red and no re-run at T20. The receipt
   it wrote was committed unmodified as C1 `f4fae8a` (T21).
8. T24, `--full --package S11` at C3 `9e98a68` (the byte-identity re-verify; C2 `763432e` carries this verdict):
   "AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY (DECISIONS:136 (3)); artifact, runner, spec and all 320 pinned product file(s) are byte-identical to the sealed run recorded in rebuild/lanes/b/tooling/receipts/S11.json 6ead5e9e87c0ec849cde25f95e07f4db374b8fd7a4a732ad7a18cc4d73d26af1, whose own bytes stand IN GIT at every base checked ...", then "POSTFIX PACKAGE PASS M2-S11-NATIVE-LOAD", 39 children OBSERVED, EXIT=0, no re-run. S11 has 0 released paths, so the S10 sentence's "plus 2 released and NOT re-verified here" clause is absent
   (runbook T24). The private census junction is removed after this run. Terminal 7 stands as the evidence for the private
   oracle, the historical audit and the 19 original gates; T24 does not re-run them.

## CI
- Before the first pass: the CI run at H `01a7050` (`37103576075`) all green on both OS (`:888`).
- First pass CI-M1 `37104337049` at M1 `5ab2780`: ubuntu rebuild-public success, windows pending at `:888`; HISTORY (that head was
  superseded by the product reopen of `:888`); its windows conclusion is not in the ledger lines read for this file.
- Second pass: the CI run at M1 `04560046` (`37109597259`) was cancelled by the workflow's concurrency when A was pushed, so CI-1
  at A is the first hosted run of this tree (A = M1 + the artifact only) (`:891`).
- CI-1 at A `24982cf1`: `rebuild` run `37110080030`, rebuild-public and C font transport success on ubuntu and windows (the S11
  package step, S11-REGEN, W6 and C4B steps green with the rest) (`:891`, T15).
- CI-2 at the sealing head C4 (the commit that carries this terminal file): its run id and both runners' conclusions are named on the
  `M2-S11-NATIVE-LOAD SEALED AND MERGED` ledger line (L6) with both runners' conclusions, b-lom included (`D:800`: D-BLOM excuses
  no red public step). This file is not edited after that run.
- Hosted observation runs (never merged): T5b run 1 `37079669559`, run 2 `37102082564`, run 3 `37108132701` (below).
- Pipeline (deploy.yml) runs at the observation heads; the cancel API answered HTTP 403 (D-S11R9-3 / D-L4-DEPLOY): `37079669266`
  (suite and draft preview success, production skipped, `:876 (5)`, `:877`); `37102082581` (success, draft preview, production
  skipped, `:887`); `37108132699` (draft deploy not cancelled, HTTP 403; completed success, suite and draft preview, production
  skipped; third T5b record RUN-NAME CHECK, `:890`).

## Export custody
Exporter: the S11 literal port `rebuild/lanes/astra/s11-exporter-v1/export-s11-profile-v1.cjs.txt` at
`e93b1ed6c31c4e3b9995f40ea440315299e74fef` (= origin `rebuild/p-s11-exporter-v1`, pushed at `:888`; 3 files: port, containment
selfcheck, word-diff vs S10 v1), sha256 `9e6ac28c64a64989ce5c5fbf87c2a316474a0d50c081bc68dcd921c4b26d6958` (14124 B); the
`%TEMP%` copy that ran is byte-identical (Fable T16 section 5). Pre-T10 obligations (D-S11T3g-2, `D:848 (4)` EXPORTER), recorded
at `:888` on the first pass's final inputs: PM selfcheck PASS 23, PENDING 2 (C6 scratch root, then created; C12 the verbatim D:49
contract line), FAIL 0; Fable containment read REVIEW-S11-EXPORTER-CONTAINMENT-FINAL-FABLE-l1 (`b3c7b565`) ACCEPT WITH NAMED
DEBTS D-S11EXP-1..3; negative control (the :114 artifact-name assert mutated) REFUSED with no output. The second pass used the
same exporter (`:891`). Seal export: `s11-final-2` at M1 `04560046`, chain=`d01dac7`: artifact `d5ac8ee6...` (121136 B) and the
fixed PENDING review `5c2811a4...` (61 B, the sha256 of the PENDING envelope, S10's value), exactly these two files in the scratch
folder; the lane copy, the scratch copy and A's blob hash identically (Fable T16 sections 1 and 5). The artifact records
lanePackage S11, packageId M2-S11-NATIVE-LOAD, sourceBase `edb8381...` and the S10 parent block (Fable T16 section 2). First export
`s11-final-1` (`93f55718`): WITHDRAWN (`:889`).

## The T5b observation record (S11's own: needles come from hosted runs, not from a seat)
S10 took needles from a PM-seat re-observation (`DECISIONS:834`); S11 takes all 39 only from a recorded hosted run on both OS
(brief 11 T5b (6) and T6 (g); rev9 PART B NOTES line 296; CI-M1 confirms, never sources).
- Run 1, `37079669559` (attempt 1) on `obs/s11-1` at O `adafcc8` = H5 `84f8421` + `.github/workflows/s11-observe.yml` only
  (`788acbd1`, Fable l2 `2b764050`); artifacts `0c0267d4` (8119 B), `6143e5b5` (8133 B); record `339ce90a`, regenerated as `645f4555`
  after the record-tool correction (`:877`, `:887`). RESULT: 38 of 39 green on both OS; child 16 d-replay-all RED on both OS, 28
  tests 27 pass 1 fail, tail withheld (path policy) (`:877`).
- Run 2, `37102082564` (attempt 1) on `obs/s11-2` at O2 `8bd959f` = H `7b1668c` + the workflow only: all 39 green on both OS;
  artifacts `756552a3` (8030 B), `de9f3b41` (8050 B); record `a96550dc` (`:887`). d-replay-all 48/48 on both OS; STOP-S11-OBSERVE for
  child 16 CLOSED (`:887`).
- Run 3, `37108132701` (attempt 1, push) on `obs/s11-3` at O3 `3c8af05` = H `48f1f20` + the workflow only (`788acbd1`; Fable job read
  `REVIEW-S11-T5B-JOB-FABLE-l2.md` `2b764050`): ALL 39 GREEN ON BOTH OS (ubuntu 07:58:39-08:06:24Z, windows 07:58:38-08:18:43Z);
  artifacts `s11-t5b-Linux.txt` `d595952f34cfe04c45adb0b52413e61fa5f8a3c584bb9a0e0a2ac8b49bc8a61b` (8001 B) and `s11-t5b-Windows.txt`
  `83c19752438a94bbff1317598e81f0ff6a701309bf2282d8ceb1aac7bb884a2b` (8056 B); record `S11-T5B-OBSERVATION-37108132701.md`
  `2e2fe4d16ae8f11d72efb416548e80822b5f41d676627b4cfd2ba2d03e538fe5` (`:890`; the record's RUN section). DERIVED FLAGS: Linux 39/39,
  Windows 39/39, red none, summary withheld none. DIFFERENCES (D-L4-INPUTS, as the job read named them): the only product byte
  moved since run 2 is `copy.test.mjs` (`78779d8f`), run by today-17 (the record's DIFFERENCES section).
- THE NEEDLES OF RECORD: the 39 taken from run 3 at T6 again, UNCHANGED from run 2 (`:890`); each begins exactly one published
  line on both OS inside its own block (Fable T16 section 3): '# pass N' for every TAP child except 20 ui-pack-pins and 22
  release-object ('# tests 121', '# tests 14'), and child 35 the S10-cut sentence ending "; 2 named files move, each" (T6 (e),
  `:887`); today-17 '# pass 829', native-load-fc12 '# pass 478', s10-copy-lock '# pass 11' (S11.json notes[14]).
- Every "summary withheld" block, by child and OS: run 1 child 16 on both OS (`:877`); run 2 none (S11.json notes[14] at `01a7050`);
  run 3 none (DERIVED FLAGS).
- Observation branches: `obs/s11-1` and `obs/s11-2` deleted on origin (`:887`); local `obs/s11-2` and both worktrees removed (`:888`);
  `obs/s11-3` deleted on origin and locally, its worktree removed (`:890`).

## Engine bytes: what S11 moves (`DECISIONS:873`, `:874`, `:879`)
- `rebuild/engine/native-load.cjs`: NEW, outside the reconstruction's closed inventory (`:873`). Its post moved once inside S11 by
  FC09: line 443 `json(state)` -> `structuredClone(state)` (as :303 already does), ruled INSIDE grant (a) of `:784` as a spec
  conformance fix of a grant-(a) file (`:879`, precedent `:853 (2)`); Astra L3 measured `git diff --numstat` over `rebuild/engine` as
  only that 1/1 hunk (S11-FC09-REVIEW-L3.md Q1). Post `ab2a1ca8` (`:881`, `:886`; Fable T16 section 3).
- `rebuild/engine/writers.cjs`: the parent post plus FG01 (the honest-opener governor moved unchanged into `updateOpenerHold`,
  called once at the original site, exported; S11.json `coverage.superseded.gates.writers-differential.why`).
- `rebuild/engine/progression.cjs`: the parent post plus its FG02 hunk (`:873`).
- Every other tracked engine file stands at the parent post: child 35's needle reads "27 tracked rebuild/engine file(s) outside
  this package's declared product, all byte-identical to the parent; 2 named files move, each" (notes[14]); the artifact declares
  21 engine paths, native-load.cjs new, writers.cjs and progression.cjs edited (Fable T16 section 3). The protected five keep
  identical blob ids at `edb8381`, `84f8421` and `7cf4a87`, contents not read (S11-FC09-REVIEW-L3.md Q1).
- Production engine digest (`production-mapping.cjs` treeSha256): `2939ccfe` -> `b8e8eb3d` by the `D:841` off-seat method,
  calibrated first, PM seat P3-M1 red then green (`:872 (1)`; the pin is at :63, not :56, `:876 (3)`); moved again by FC09 with
  P3-M1 and the port cells red first on the moved engine tree (`:880`). The sealed value is the one in `production-mapping.cjs` at
  A (post `c178c0bd`, `:886`); Astra L3 recomputed `bc45ca73...` at `7cf4a87` (reviewer-measured, S11-FC09-REVIEW-L3.md Q5).
- FC03 PRODUCER_REVISION: `3c862537` -> `a860376d` (mechanical re-bind, STOP-S11-REV, R2-REVISION red first, `:872 (2)`), then moved
  by FC09 as ruled at `:879` (no recorded Yes exists in any real install yet; option (i-b) refused); sealed in FC03 at A (post
  `80393920`, `:886`).
- D-EPP-2's capture conjunct (S10, owner Yes `:785`): unchanged; the composition-seam edit is test-only (FC12 R25-F2 (b), the card
  captures [105,105,105], a non-PROPOSED pair still refuses, `:872 (3)`).

## FC09: the reachable defect T5b found, and its cure (`DECISIONS:877`-`:886`)
- Found (`:877`): T5b run 1 child 16 d-replay-all red on both OS at P3-EN3 (`rebuild/lanes/d/p3-replay-all/writer-enumeration.test.mjs:243`):
  two shipped modules now reach the plan writer `rebuild/client/index.cjs#plan` (`rebuild/m3/w6/t2-stage.cjs` and
  `rebuild/m3/w7-preview/today/today-entry.mjs`); it was 28/28 at S10 (run `36224004547`).
- Diagnosis and ruling (`:878`, CLASS B, product; read-only diagnosis `rebuild/lanes/b/S11-FC09-EN3-DIAG.md`): a native-load Yes on
  Today writes one plan/proposal-response op, and local source admission refused it LOCAL_SOURCE_EFFECT_UNMAPPED, so a person who
  taps Yes and then uses Import my history was refused: reachable from genuine use, so FIXED, not carried. No owner question (the
  owner-approved NATIVE-LOAD spec already rules the behaviour); FC09 per spec R9.13 is inside S11's listed authority; new reader
  family F9, refusal code LOCAL_SOURCE_NATIVE_LOAD_RECORD_INVALID carrying NATIVE_LOAD_RECORD_INVALID.
- Further genuine-use defects found and fixed inside FC09, each red first: Q1 (train on the phone, then import: the check was refused
  PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED, `:879`; options (i) + (iii) ruled); Q3 (a file that names a lift by another id held the
  Yes RECORD_INVALID on no lift, `:880`; option (a) withdrawn and option (b), FC03 lineage resolution, ruled at `:881`); Astra L1
  B1/B2 (current checks and the governor lost pre-import history after correspondence, BLOCKING, `:882`); Opus l2 B1 (Today never
  listed the Yes's Undo after a renaming import, BLOCKING) and Fable l2 B3 (TARGET_QUEUED refs [] under correspondence) (`:884`).
- Builder-changed cell expectations judged by name by the readers: FC09-Q1-A offer -> NATIVE_LOAD_PLAN_CHANGED (accepted at
  `:880 (1)` subject to the reviewers; Astra L3 Q3 "CORRECT BY NAME"); FC09-Q3-G EFFECT_CONFLICT naming the Yes, KEPT (`:884 (4)`);
  caller mutant C5 CLAIMED EQUIVALENT (`:883`), judged right by Astra L2 (`:884`).
- Closed at `:885` on `7cf4a87` by three ACCEPT WITH NAMED DEBTS reads: Astra L3 (job 168, `3b26ea29`), Fable l3 (`3204042b`), Claude
  Opus l3 (`78c1ef88`). Earlier reads: Astra L1 `3dce977b` REJECT, L2 `d539449c` ACCEPT; Fable l1 `13c0f440`, l2 `905ab32f` REJECT B3;
  Claude l1 `3348e9bd`, l2 `a8492f04` REJECT B1 (`:885`). Records `9b6d2aa` fast-forwarded into W11 (`:885`). The three-read closure
  stands as T6's re-review of the product moved after T3i (`:887`).
- Declared at REGEN of record (`:886`), present at A (Fable T16 section 3): three NEW files, role new, pre null:
  `rebuild/m4/import/native-load-replay.cjs` (`82cc19d5`), `rebuild/m4/import/test/native-load-replay.test.cjs` (`132f8b09`, in child 6
  m4-import's argv) and `rebuild/lanes/d/p3-replay-all/native-load-import.test.mjs` (`fc4c9fe6`, in child 16 d-replay-all's argv); still
  39 children; 18 product posts moved (native-load.cjs `ab2a1ca8`, FC03 `80393920`, FC12 `ced43957`, today-entry `b3de1c31`,
  today-bindings `3cb27682`, source-admission `902df9ff`, production-mapping `c178c0bd`, s3-portable-sources `71e40171`,
  replay-registry `fe0b95a7`, lift-correspondence `a9640fa0`, legacy-order-mapping `73bd6da7` and seven test files). The C4b
  PAGE_PINS re-pin of `today-entry.mjs` `169d5658` -> `b3de1c31` is declared (`:885`). `copy.test.mjs` pre `290a90ab` post `78779d8f`
  edited (`:889`).
- C2-FC09-BRIEF, RULED at `:890 (1)`: no brief amendment is made; the FC09 files and moves are declared in S11.json (product and
  children), ruled at `:878`-`:885` and named in this verdict, which the brief's own ruling clauses allow; the brief of record stays
  `4f7d431f`, accepted at `:875`.
- C2-COPY-BIND, RULED at `:890 (2)`: the approved copy (`D:798`, `D:804`, `D:842 (2)`) binds to the approved strings, not to file
  bytes; FC09 and the `copy.test.mjs` fix added and changed no person-visible string (s10-copy-lock '# pass 11' and today-17 829 green
  on both OS at T5b run 3), so the THEME's `dd197849` cite is history and `native-load.cjs` `ab2a1ca8` / `today-entry.mjs` `b3de1c31`
  carry the same approved copy.

## Declared departures and owed gates
- The FC09 A-LEGACY-VECTOR admission rule is outside grants (a)-(f), owner-approved at `DECISIONS:819`, under spec R9.13 (iv)
  (THEME `:874`).
- The `native-load.cjs:443` move is ruled inside grant (a) (`:879`); no protected file moves (`:879`; Astra L3 Q1).
- D-EPP-3's owed gates, inherited from S10 and NOT claimed by this verdict: (1) the port oracle on the synthetic fixture; (2) the
  sensitivity pass; (3) the private gate on the repaired engine; (4) exact-head CI on both systems (CI-2, on L6). S11 moves further
  engine bytes (above), so these gates now owe the S11 engine too. The LEGACY conformance and selftest lines of T14 and T20 do not
  pay them (D-T16S11-5 = S10's D-T16-3: those gates run the frozen reference bundles, not D-EPP-3's gates).
- D-EPP-4's real-engine red half (D-S10I-8) is STILL OWED, as VERDICT-S10 states; no line read for this file records it run.

## Records of this seal chain (`DECISIONS:862`-`:892`)
### Every red, in order (`DECISIONS:835`: recorded, never excused; D-T16S11-2)
Red-first cells (N15 red on its cell `:862 (2)`; P3-M1 on the old digest `:872 (1)`; R2-REVISION `:872 (2)`; FC09-T5/Q1-A `:879`; the governor-alias, P3-M1 and port
cells `:880`; Q3-B..Q3-I `:881`-`:885`; M2/M3 rows `:883`; the distfix P1/MARKUP hammers `:889`) are recorded as red FIRST only, the
method, not as defects. Every other red:
1. I15 calibration red 2/4 on the parent (by I16), green 4/4 on the head: named debt D-S11-I15CAL (`:872 (5)`, `:876 (2)`).
2. PM-seat T4 candidates (`:876 (3)`): today-17 803/829, w7-import 28/35, d-replay-all 24/28, package.test 0/14 (both values), all
   on the local esbuild not resolving `@noble/hashes` (environment, not product); m4-import-production P3-M3 (the `:826`
   sealing-window rule) with X3 reopen; builder seat d-plan-edit 89/90 with its browser build unresolved locally.
3. T5b run 1 `37079669559`: child 16 d-replay-all red on both OS (P3-EN3), cured by FC09 (`:877`-`:886`), 48/48 on both OS at run 2
   (`:887`) and green at run 3 (`:890`).
4. FC09 at the PM seat: S4/2 clock cells red once then 15/15 on both trees (seat flake, `:879`); LOM-S6 (`legacy-order.test.mjs:662`)
   red (`:880`), paid by R1 (`:881`); the page-bundle counts 4 below their pins on `84f8421` and every FC09 head (`:879`-`:885`), the
   "seat offset", explained and removed at `:888` (E1: W5 and W6 deduped into one copy; page-bundle 7/7 at the pins once W5 had its
   own physical copy).
5. Review REJECTs during S11 (each fixed or turned into a named debt by ruling): NATIVE-LOAD rounds 31-34 (`:863`, `:865`, `:867`,
   `:868`, `:869`); FC09 Astra L1, Fable l2, Claude l2 (`:882`, `:884`).
6. First seal pass (`:888`; Terminals above): T8 ci0 EXIT=1, T12 ci1 EXIT=1, T14 full1 EXIT=1, each FAIL CHILD-REQUIRED-EXIT-ZERO at
   today-17 `copy.test.mjs:167` P1 (828/829), paid by `78779d8f` (`:889`); re-runs ci0b and ci1b EXIT=0, recorded with their reds.
7. Second pass T7-T20: no red; T12 ci2 EXIT=0; T14 full2 EXIT=2, the predicted REVIEW-PENDING (its envelope-line deviation is
   D-T16S11-1); CI run `37109597259` at M1 cancelled by concurrency, not red (`:891`); CI-1 green (`:891`); T20 EXIT=0, no re-run.
8. T23, T24 and CI-2: as recorded in The coach constant, terminal 8 and CI, and on L6 (the SEALED AND MERGED line).

### Every incident
- HARD-LIMIT INCIDENT (`:883`), recorded not excused: in FC09 round 8 the builder ran a one-off regex count over `rebuild/m3` that read
  files under a soak path (no content printed, zero matches, nothing used) and a `git ls-files` that listed soak path names; the
  builder was told to exclude forbidden paths by path before any read (S11-FC09-REPORT.md 16.5, 17.4; 17.4 also names one later
  `git ls-files` with five explicit name globs).
- Exclusions by path (`:884 (3)`, `:885`): LOM-S6-LITERAL and `callers()` gained src/, conform/private, private/, soak, ledger/ and
  app.js exclusions by path before any read (Fable l3 (4), Claude l3 (4)); residual debt: a symlink or junction is followed by the
  walkers (below).
- Pipeline cancel refused HTTP 403 (token) at every observation push: see CI above (`:876 (5)`, `:877`, `:887`, `:890`).
- Two dangling W11 junctions (`rebuild/m3/w5` and `rebuild/m3/w6` node_modules) re-pointed to reproduce the T5b red; git status
  clean, environment only (`:877`). E1 then fixed by a separate physical W5 copy (`:888`; D-NODE-MODULES-HOME below).
- Record-tool correction (`:887`): both T5b records printed 'run undefined' in their run-name rows; inputs re-shaped, both
  regenerated; the first record `339ce90a` is now `645f4555` (content otherwise identical). Run 3's run-name rows are correct (`:890`).
- PC unreachable 2026-09-29 to 2026-10-02 15:07Z, nothing ran; on return the five files re-verified and the tip unchanged (`:866 (3)`).
- PC rebooted at 06:46 during round-32 re-runs; bytes re-verified (`:864 (1)`).
- The PC's app restart killed Astra job 161; L24 relaunched as job 162 (`:867`, `:868 (2)`).
- The seal-runbook analyst's names-only `git ls-tree --name-only HEAD -- .github/workflows` printed six workflow file names, one a
  soak path name; nothing opened (runbook header).
- The seal runbook (`3b04bcd2`) names the first pass's values (s11-final-1, `321967ee`, `a96550dc`, `37102082564`); the chain re-ran
  from T7 under `:888` with s11-final-2, `c97e468c`, `2e2fe4d1`, `37108132701` (D-T16S11-4).
- Incidents before `:862`, named from runbook section 3: `:849 (1)` effort could not be set per agent; `:851` one red-first plan held
  a fourth shared slot for 2 s; `:847 (1)` duplicate reads and `(4)` the finisher's append slip; `:840 (6)` launcher $n/$N clash;
  `:842 (3)` capacity pause.
- The T22 builder of this file: a names-only listing of the W11 root printed the top-level names `src`, `ledger` and `app.js`, and a
  git worktree listing (gitdir paths, possibly soak-named) went to a tool output file that was not viewed; nothing under any
  forbidden path was opened or read.

### Rulings of the chain (each cited where it is used above): the owner bar `:866 (2)`; D-READER-ONLY `:868 (2)`; R8 EFFECT_CONFLICT
holding a later yes accepted `:869`; T1 CLOSED `:870`; the copy re-bind, PRODUCER_REVISION re-bind and seam edit `:872`; FC09 fix not
carry `:878`; Q1 options and the PRODUCER_REVISION move `:879`; Q1-A, LOM-S6 R1 and Q3 `:880`; Q3 option (b) `:881`; B1/B2 BLOCKING
`:882`; Opus B1, Fable B3, exclusions, D-S11-EXIT-CODE `:884`; T6 dispositions and PRODUCT FREEZE `:887`; the distfix and the product
reopen `:888`-`:889`; C2-FC09-BRIEF, C2-COPY-BIND and the `:866` citation correction `:890`. STOPs: STOP-S11-WRITERS and
STOP-S11-ECAP CLOSED, STOP-S11-OBSERVE for child 16 CLOSED (`:887`); every S11 STOP of brief section 12 is named,
closed or kept open by design, under "PM rulings recorded in this verdict" below (STOP-S11-CI until T26; STOP-S11-PHONE and
STOP-S11-R20B1 until T29/T30).

## Carried debts (each CARRIED by id, with why it is not reachable from genuine use or why it is carried)
### This seal chain: the Fable T16 read, the exporter read and the distfix read
- D-T16S11-1 (record + hygiene; REVIEW-S11-SEAL-T16-FABLE-l1): T14 full2 ran with the PENDING review envelope on the lane disk
  (ENVELOPE PENDING, not the predicted ENVELOPE ABSENT); same verdict path, EXIT=2. The file was untracked at A; T18 overwrote it with
  the ACCEPTED one (V `bf51eb1`); it was never committed as PENDING; any re-export repeats T9 first.
- D-T16S11-2 (record): every red of this seal in this verdict and L6 per `:835`; paid in text by "Every red" above, and owed again on
  L6.
- D-T16S11-3 (spec prose, stale, no edit): S11.json notes[0] ("product bytes final at ee86334") and notes[5] ("These are the final
  product bytes") predate FC09 (`:886`) and the `copy.test.mjs` fix (`:889`); notes[1] measures posts "at HEAD c0f0039". Pins,
  children and notes[14] are current and re-hashed; an edit would move the spec sha and the export, so this verdict names it.
- D-T16S11-4 (runbook stale, record): see Every incident.
- D-T16S11-5 (= S10's D-T16-3): full2's (and T20's) conformance and selftest LEGACY lines run frozen reference bundles, not
  D-EPP-3's gates.
- D-T16S11-6 (rulings carried by line): C2-FC09-BRIEF (`:890 (1)`), C2-COPY-BIND (`:890 (2)`) and the `:890 (3)` citation correction,
  all three stated in Authority and FC09 above.
- D-T16S11-7 (record): the Fable and Astra review files of this chain (the T3g exporter read, the `b3c7b565` containment read, the T6
  reads at `:887`/`:890`, the `:889` distfix read, the T16 read itself) were not in A's tree; T25 commits every one of them in C4, or
  the sealed record loses them.
- D-S11EXP-1 (REVIEW-S11-EXPORTER-CONTAINMENT-FINAL-FABLE-l1, `b3c7b565`, section 5; carried: D-S10EXP-3 = D-S11T3g-1): ":109-114
  checks require.cache only inside root; the eight imports load builtins only (unchanged blobs), so nothing outside root loads
  today; a future import would not be seen."
- D-S11EXP-2 (same read; process): paid by the `:888` record (see PAID). D-S11EXP-3 (same read): under "Carried by read or by the PM ruling"
  below.
- Distfix Fable l1 D1 (REVIEW-S11-DISTFIX-FABLE-l1 (4); `:889`): the `.tmp/w7-{p1,a1,clean,again-markup,again-string,launch-guard}`
  dist and build directories persist between runs (12 dirs, gitignored); "Stale bytes cannot satisfy an assertion (every asset is
  rewritten and extras unlinked per build)"; cost is disk only.
- Distfix Fable l1 D2: the directory names are per-file, not per-process; two concurrent processes running `copy.test.mjs` in one
  worktree would collide on `w7-p1-dist` as before; "today-17 runs the file once, so out of scope for the ruling".
- Distfix Fable l1 D5: prose drift, `package.test.cjs:139` cites `copy.test.mjs` :395/:405, now :403/:414; "Cosmetic."
  (D3, the stress leftovers, was removed before commit, and D4 was paid by the 100-run red, `:889`.)

### NATIVE-LOAD, closed at `:870` ("All named debts carry into VERDICT-S11 and the post-S11 list"), judged under the bar of `:866 (2)`
- D-R33-1 (= Fable B-R33F-1): a yes, then a set removed and re-logged or an old removal undone, refuses RECORD_INVALID evidence; the
  history is reader-admissible but not host-writable (the host refuses every write into a closed session, an undo of a removal and
  an edit of a removed set), so not reachable (`:867`); it owes a spec ruling (`:866 (1)`); residual: a second device writing after
  Close is unmeasured.
- D-READER-ONLY (`:868 (2)`): Astra L24-B1..B3 join D-R33-1; not reachable because the host cannot write those histories; REOPENS if
  any sync, import or second-device path ever writes into a closed session.
- D-R33-2..5 (`:866 (1)`), D-R33F-1..5 (`:867`; D-R33F-4: the real projector refuses every added set, so the L23-B5 shape is not
  produced today), D-R33C-1..6 (`:867`): carried by `:870`.
- D-R34F-1..3, D-R34C-1..3 (`:869`, `:870`): carried by `:870`. EFFECT_CONFLICT holding a later yes when an earlier landed earn's
  evidence is removed (D-R34F-2 = D-R34C-3) is R8 as written, accepted, held not cancelled (`:869 (1)`).
- D-L25-M08, D-L25-M09, D-L26-SCOPE (Astra L26, `:870`): carried by `:870`.
- D-R32C-3..4 and D-R32F-1..4 (`:865`): carried by `:870`.
- D-R31F-2..4, D-R31C-1..5 (`:863`): carried by `:870`; K08/K10 = D-R31C-3 and D-R30C-5 carried (`:864 (1)`); D-R31C-5 (an answered
  card keeps a dead Yes) is on the post-S11 list (`:863`). D-R31F-1 is PAID (see PAID).
- D-HSW2-1 (Fable runner pass 2, other today-entry regions unmutated, `:862 (3)`); D-HSW-3 (accepted), D-HSW-4 (carried); D-R29F-1..9,
  D-R29C-1..6; D-R30-V43-V44, D-R30-V45, D-R30F-1..8, D-R30C-1..6, D-L21-*; D-S11R11-1 (round-29 citation stale) and D-S11R11-2;
  D-L6-STOP-SCOPE: named from runbook section 3; carried by `:870`.
- H-05 (= SS-19, PM `:854 (4)` per runbook section 3) and D-R28A-1: named debts (brief section 15 rev11 map), carried.
- POST-S11 SPEC CLARIFICATION LIST, ONE carried item (spec questions; no product move in S11; brief section 15 rev10/rev11 maps):
  D-R25C-5 (alias Fable fy23), D-R26C-3 (cancel-as-answer), K766, P1470, P1483, P428, P906, H007, H022, H026, H042, H-06, H-07, the
  round-28 run-not-classified and spec-silent ids (by classifier file sha), D-R30C-1 (P405-P413 field names), D-L21-OPAQUE, TE S1-S4
  (`:862 (1)`) and D-R31C-5 (`:863`), and spec :81's refusal sentence (`:872 (3)`).
- D-R24-SPEC-SILENT: the 18 SPEC-SILENT mutants of round 24 with no row (`D:846 (1)`, `:847 (2)(a)`, brief rev8 notes); carried.
- The capture-class limit: two or more unfinished debut/unlock entries of one debut-now lift refuse that whole day
  ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED at `rebuild/m4/workout/engine-capture.cjs:72-73`; on the composed engine only non-PROPOSED
  entries count; a named limit (brief 8 (3)), carried with STOP-S11-R20B1 to T29.

### S11 reseal and FC09
- D-S11-I15CAL (`:872 (5)`, `:876 (2)`): the I15 calibration is red 2/4 on the parent and green 4/4 on the head; a calibration record,
  not a product path.
- D-S11-FC10 (`:878 (4)`, Astra L3): the portable accepted-receipt path; "unreachable in the local era, no receipts" (`:878 (4)`).
- D-S11-EN3-COPY (`:878 (4)`): no Import-screen sentence for LOCAL_SOURCE_NATIVE_LOAD_RECORD_INVALID; "only damaged or hand-built
  records reach it; new copy needs owner approval" (`:878 (4)`).
- D-S11-EXIT-CODE (`:884 (4)`): Q3-G shows EFFECT_CONFLICT naming the Yes rather than PLAN_CHANGED; identical to the one-id twin, not
  a trap; the next workout on the held card offers adopt-baseline.
- Astra L3 D1 UNKNOWN-LIFT-MAP (`:885`; S11-FC09-REVIEW-L3.md): "A hand-added futureByLift[FILE] passes the boundary unchanged; no
  current FC01 consumer was found."
- Astra L3 D2 POST-IMPORT-RENAME (`:885`): "A hand-built renamed imported base loses name correspondence ...; no shipped host writer
  sequence established."
- The admission view workout_facts split, no reader (`:882`, `:885`); F9 superseded-only refusal (Opus N2, `:882`); resolver refusal
  on two setup ops (Opus N3, `:882`): carried as "not reachable from genuine use" by the ruling of `:882`, restated at `:885`.
- Symlinked paths followed by the exclusion walkers (`:885`; REVIEW-S11-FC09-CLAUDE-l3 N1): "Not reachable in this repository as
  committed, as far as the rule's inputs show; I did not list the trees to check (hard limit)."
- OPEN QUESTION before T29 (`:885`, Opus l3): whether a first-run phone without an import ever reaches a native-load earn (FC01
  answers NO_NEXT_LOAD on a first-run ladder; Q3-I's queued earn needed a test-made rung ladder, Claude l3 N2). Owner step T29.
- Fable l3 N1 additions (F9 'applied' label for a superseded-held spend; runbook wording on PLAN_CHANGED after a moving import; the
  B-LOM reopen law; a no-queue file; the two re-key rules pinned by FC09-LINEAGE-C5), N2 (`queue[].id` not re-addressed; "harmless
  today (no evaluation reads q.id)"), N3 (`spend_lifts` and `check()` are two folds; NATIVE_LOAD_STALE_OFFER guards respond), N4 (a
  comment cites :687 for :688); Claude l3 N3 (the same :687 slip) and the clone cost under a correspondence (Opus N4)
  (REVIEW-S11-FC09-FABLE-l3.md, REVIEW-S11-FC09-CLAUDE-l3.md).
- T3M-1 (the executed-closure note understates the engine reads) and T3M-2 (fixture F3a writes the MISSED mark directly): carried in
  the ledger and here, not in S11.json (`:887`; brief section 15).
- D-S11T3k-3 (`:887`): VERIFIED for this file at C1 `f4fae8a` against W11's `rebuild/DECISIONS.md` (892 lines, holding the chain's
  lines after M2): the seven `DECISIONS:841`/`:842` citations in S11.json notes (notes[5] three, notes[7], notes[10], notes[11],
  notes[13]) each resolve. `:841` is the 2026-09-26 PM line that RULES LSP (A), C4B (A), the s3/run.mjs complete predicate, the
  native-next-targets family "decided by a static read of the runner", D-S3-PORTABLE-STALE "named debt", native-carriers-source.cjs:41
  historical, W6ADM (A), W6DIR (A) "named debt D-S11-W6DIR" and the P3-M1 digest "computed off-seat from public per-file hashes";
  `:842 (2)` is the OWNER DELEGATED approval of the copy items "APPROVED AS WRITTEN under Joe's delegation" with the copy-lock corpus
  edit's approval. 0 stale citations (names only; no other line read for this check).
- D-S11-COPY-PANEL-MOUNT (alias D-COPYLOCK-TODAY-MOUNT), CARRIED as disposed at T6 (`:887`; notes[13]): `copy-lock-states.mjs` never
  mounts `today-entry.mjs` open() or the native-load panel; the approved copy is held by the static scan (CL-HOLDS on corpus
  `58dc7a74`) and the engine templates by CL-ENGINE-COPY; a mounted panel state is later work.
- D-S11-W6DIR (notes[9]; `:841`): two R9.10 cells in `engine-capture.test.cjs` and `configuration-capture.test.cjs` throw at load
  without a retained `PERFORMED_W6_DIR`; no child or workflow runs them; R9.10 fit semantics stay CI-observed through FC12's FIT rows.
- D-S3-PORTABLE-STALE (notes[10]; `:841`): eight S3 portable-manifest entries (and two `run.cjs` pins) were stale at the parent;
  "Neither harness runs in any child or CI step, and a full re-baseline needs protected reads" (notes[10]).
- D-S11-NNT (notes[11]; `:841`): the native-next-targets family is red on the composed engine (builder-measured); "No S11 child
  executes the family" (notes[11]); re-opens if a later package re-adds an executor.
- D-S11-80-CIHOME (PM ruling in this verdict, STOP-S11-80 below): `rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs`
  has no CI step; it ran 59/59 at the PM seat with `release-from-seal.test.cjs`; a tooling test, not a product path.
- D-S11-LSP-PORT-PINS (notes[12]; `D:845 (3)`): SOURCE_PINS :6 and :7 of `local-source-profile.cjs` are stale since before the parent;
  "No test compares either entry to disk" (notes[12]).

### Brief section 8 (5) handoff list and the T22 list (brief line 243 and lines 294-298), carried by name with a reason
- D-R9.10-VECTOR-COUNT-STUCK: carried by the owner's own authority (brief 8 heading, `D:816 (5)` "VECTOR-COUNT-STUCK carried").
- SET_COUNT_BASIS_UNPROVEN generic copy: its display stays PROPOSED (spec :481), so no unapproved text is shown.
- D-L12-ISSUANCE: imported native sources stay refused by the admission gate (FC03, NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN, `D:815`;
  brief 8 (2)): a refusal, never a wrong load.
- D-R13-LEGACY-OVER-NULL-ASK: the residual trial limit of the legacy-over-null class; the day prepares the baseline ask instead of
  refusing (brief 8 (3)). D-R13L1-3: ALV P has no lower bound; it refuses, never clamps (round 23's L15-B2-NEGATIVE-SHIFT-NOT-CLAMPED
  pins it; brief 8 (5)).
- D-L14-OWNER (UNVERIFIED): physical-phone, theme, crash/reopen, two-device and live-slice checks; paid only by checks the PM
  schedules at T29 (brief 8 (1), D-L1-TRIAL-AUTHORITY); with STOP-S11-PHONE open for T29/T30.
- D-L14-HOST-MUTANTS: R7-comp-reprice-host and R16b-comp-some-host LIVE on FA03 under the bounded current-host argument (runbook
  section 3); carried.
- TODAY17-HARDEN: named OUTSIDE S11 (`D:844 (5)`, `:847 (4)`), carried by the next reseal (`86eca40` on `rebuild/c-today17-harden`),
  with the `:816`/`:835` re-run rule applied at T20/T26. Separate from it, S11 itself paid the `copy.test.mjs` P1 build-dir race
  (`:888`-`:889`).
- Astra L4/L5 and Fable l7/l8 carries (brief section 15 rev10/rev11 maps): D-L4-INPUTS / D-S11R9-2 (owner step: the T5b job read (vii)
  and (viii), then the PM's record; run 3's record names its one difference, `copy.test.mjs`); D-L4-MEASURE (owner: the T5b builder
  and the PM); D-L4-DEPLOY / D-S11R9-3 (owner: the PM at and after each observation push; recorded in CI above).
- D-S11R8-1 (T1 currency; D-R25C-5 carried to the post-S11 list, brief section 15 rev9 map); D-S11T3m-1 (the fixed-input
  returned-text pin cannot see a rewording conditional on inputs outside the fixture domain; the sha approval binding backstops;
  brief section 15 rev8 map).
- The stale "PROPOSED" comments at `today-entry.mjs` :169 and `native-load.cjs` :162 (D-S11R7-4 (c), D-S11T3l-4; notes[13] gives :170
  at `dd197849`; the line numbers at the FC09 bytes are not re-measured here): source comments, not approved copy, never shown; a
  product byte for a later NATIVE-LOAD round.

### Carried by read or by a PM ruling recorded in this verdict
Under the PM ruling in "PM rulings recorded in this verdict" (below): a debt named and accepted by a read that applied the owner's bar of `:866`
(no problem reachable from genuine use remains; findings that need hand-built or damaged records, or histories the real host cannot
write, are named debts) is carried under that read's judgment; a debt named before that bar is re-judged by the PM (see "PM rulings recorded in this verdict") only
where its own source's description shows nothing a person could hit in ordinary use. The NATIVE-LOAD closing reads of `:870`
(REVIEW-NATIVE-LOAD-BUILD-R34B-FABLE-l1 `b67d7d04`, REVIEW-NATIVE-LOAD-BUILD-R34B-CLAUDE-l1 `01a3545d`, NATIVE-LOAD-BUILD-REVIEW-L26
`0f72a516`) were searched by id for this file: none of them names RESIDUAL (iv), any D-L12-*, D-L14-* or D-L15-* debt, D-R31F-1 or
the 17 deferred files, so none of those is written as accepted by `:870`.
Accepted under the `:866` bar by the read that named it:
- D-S11T3iF-1 (S11.json notes narrate the pre-merge tree), D-S11T3iF-2 (stale provenance comments in FC12), D-S11T3iF-3 ("the real
  host cannot write one (FC01 writes DEBUT only) and no real history is admitted on the S10 slice") and D-S11T3iF-4 ("reachable only
  through imported legacy history, none admitted yet; the named limit of :72-73"): carried; accepted under the :866 bar by the Fable
  T3i read S11-T3I-REVIEW-FABLE-l1 (`d1d23246`) at `DECISIONS:876 (1)`.
- D-L3-MULTI ("no host-generated reproduction established here"), D-L3-SPEC81 (the older spec refusal sentence quoted in R25-F2) and
  D-L3-T1-CARRY (the closed T1 debts of `:870`): carried; accepted under the :866 bar by the Astra T3i read
  S11-T3-INTEGRATION-REVIEW-L3 (job 165, `ec428b8b`) at `DECISIONS:876 (1)`.
- D-S11EXP-3 (the :163-167 leak check "is seen only at T10"; both T10 exports printed EXPORTED PENDING, `:888`, `:891`) and D-S10EXP-3
  (= D-S11T3g-1, carried there as D-S11EXP-1: "nothing outside root loads today; a future import would not be seen"): carried;
  accepted under the :866 bar by the exporter containment read REVIEW-S11-EXPORTER-CONTAINMENT-FINAL-FABLE-l1 (`b3c7b565`) at
  `DECISIONS:888`.
Named before the `:866` bar and re-judged by the PM (see "PM rulings recorded in this verdict"):
- D-L13-TYPED-C2: carried; named before the :866 bar at `DECISIONS:819`; re-judged by the PM (see "PM rulings recorded in this verdict") as not reachable from genuine
  use: "typed-v2 C2 exit parity carried as D-L13-TYPED-C2 (the trial uses host v1)".
- D-L12-CONFIG: carried; named before the :866 bar at NATIVE-LOAD-BUILD-REVIEW-L12 (`e48e1b8e`) :75; re-judged by the PM (see "PM rulings recorded in this verdict") as
  not reachable from genuine use: "configuration-capture.test.cjs v1 numeric-only expects WORKOUT_CAPTURE_INVALID but receives
  ENGINE_CAPTURE_PROFILE_INVALID on both parent and head; the shared failure remains a named pre-existing test debt".
- D-L14-CALIBRATION: carried; named before the :866 bar at NATIVE-LOAD-BUILD-REVIEW-L14 (`29d23319`) :81; re-judged by the PM (see "PM rulings recorded in this verdict")
  as not reachable from genuine use: "Retain the four-seed failing-parent I15 calibration when changing the walk's capture oracle".
- D-L14-CI: carried; named before the :866 bar at NATIVE-LOAD-BUILD-REVIEW-L14 :82; re-judged by the PM (see "PM rulings recorded in this verdict") as not reachable from
  genuine use: "Full source admission/commit/consumer, protected consumers and exact-head Windows/Linux CI remain owed". (Its
  "commit" part is paid by W6ADM (A), brief line 211; CI-1 green, `:891`; exact-head CI is CI-2.)
- D-L15-EQUIVALENCE, with the live equivalents it covers (R22c-X6b, Fable l3 z01 and y07, the 23b live-equivalents; brief line 88):
  carried; named before the :866 bar at NATIVE-LOAD-BUILD-REVIEW-L15 (`fd26df6c`) :103; re-judged by the PM (see "PM rulings recorded in this verdict") as not reachable
  from genuine use: "The author's z01, y07 and R22c-X6b equivalence claims were not independently re-executed or accepted by this
  review".
- The 17 deferred files: carried; named before the :866 bar at `DECISIONS:816`; re-judged by the PM (see "PM rulings recorded in this verdict") as not reachable from
  genuine use: "Test cleanup phase 1: 3b54a72 deleted 157 of the 174 ...; 17 deferred to a declaring reseal package".
- D-S11T3c-4: carried; named before the :866 bar at brief line 225 (section 15 line 415); re-judged by the PM (see "PM rulings recorded in this verdict") as not
  reachable from genuine use: "native-trend-context.test.cjs :189-191's twelve-name comment list is stale prose".
- D-S11T3d-1 and D-S11T3d-2: carried; named before the :866 bar at brief line 416; re-judged by the PM (see "PM rulings recorded in this verdict") as not reachable from
  genuine use: "no seat has observed a whole s11 cell green or red" and "census-identity rows' green a prediction; a red is a
  STOP-S11-SUP6 ruling". (Children 30-35 green on both OS at T5b runs 2 and 3, and in ci2, full2 and T20.)
- D-S11T3e-1 and D-S11T3e-3: carried; named before the :866 bar at brief line 417; re-judged by the PM (see "PM rulings recorded in this verdict") as not reachable from
  genuine use: "the five CHILD_SPECS cells not green on T3e's edits alone" and "hosted wall time of the newly conditioned W6 steps
  unmeasured".
- D-S11T3g-2: carried; named before the :866 bar at brief line 419; re-judged by the PM (see "PM rulings recorded in this verdict") as not reachable from genuine use:
  "the containment delta read on the final inputs". (Done on the first pass's inputs, `:888`; same exporter at the second pass,
  `:891`.)
- D-S11T3l-2 and D-S11T3l-3: carried; named before the :866 bar at brief line 420 (placement of the pins accepted at
  `DECISIONS:845 (3)`); re-judged by the PM (see "PM rulings recorded in this verdict") as not reachable from genuine use: "paper: rebuild/lanes/c/COPY-LOCK.md still
  cites 958 / e3b1be10; the corpus note field" and "placement and breadth of the whole-source pins".

## PM rulings recorded in this verdict
The chain is FROZEN from L5 (`DECISIONS:892`, R `84f5bca`) until L6, so no ledger line can be appended before the seal. These PM
rulings are therefore recorded in this verdict and restated in the PM line after L6; every item of this file that cites "PM
rulings recorded in this verdict" rests on this section.
(1) RESIDUAL (iv) and D-L14-RECOVERY are CARRIED as limits the owner-approved NATIVE-LOAD spec itself names; the outcome the spec
defines in each is a safe one (no wrong load is shown, stored or adopted; pending entries are retired, or the exit is held, rather
than any load being guessed), so they are designed limits accepted with the spec, not defects:
- RESIDUAL (iv), the spec's own residual class (`DECISIONS:815`): "A dissolved hold's ref cannot be told from a never-held one with
  FC03's inputs (no op records an unordered base; the fold keeps no issue history), so a never-held exit is RESIDUAL (iv): numeric and
  null capture forms apply on the held projection like a dissolved exit, the moved-base test of UNPROVABLE ORDER is skipped for that
  shape and the lift's pending native entries are retired SUPERSEDED; nothing is raised (base_load null, target the actual loads,
  only with a recorded yes); its Undo restores the held projection".
- D-L14-RECOVERY, the spec's R9.11 and R9.9 limits (NATIVE-LOAD-BUILD-REVIEW-L14 `29d23319` :78, L15 `fd26df6c` :96):
  "D-R9.11-TWO-EXIT's after-Undo race and D-R9.9-TWO-CLOSE-LAND remain the spec's carried limits; the paid before-Undo two-exit rows
  do not discharge them".
(2) S11 STOPs of brief section 12 CLOSED by evidence:
- STOP-S11-OBSERVE: the third T5b run `37108132701`, 39/39 on both OS (`:890`).
- STOP-S11-NEEDLEFORM, STOP-S11-T4, STOP-S11-FC12N, STOP-S11-W6ADM, STOP-S11-FENCE, STOP-S11-C4B: the needles of that run, both OS,
  taken at T6 again (`:890`).
- STOP-S11-REGENCI, STOP-S11-BUNDLE, STOP-S11-COPYLOCK, STOP-S11-LSP, STOP-S11-SUP6: CI-1 `37110080030` at A green on both OS (`:891`)
  and T20 (terminal 7).
- STOP-S11-ENGINE-DIGEST, STOP-S11-RUNNER, STOP-S11-PARENT: T20's PARENT PINS RE-ASSERTED, runner and spec pinned in the artifact, and
  SEALED RUN RECORDED over 320 pinned files (terminal 7).
- STOP-S11-UNLISTED: REGEN dry 0 at H `cb04b0d` (`:890`), and no UNLISTED-SOURCE-CHANGE in ci2, full2 or T20.
- STOP-S11-EXPORTER: `:888` and `:891` (Export custody).
- STOP-S11-BASE: T19 (diff V..M2 `rebuild/DECISIONS.md` only) and T20's SEAL BASE ON THE TIP at `84f5bca`.
- STOP-S11-COPY: the `:890 (2)` copy-bind ruling and s10-copy-lock '# pass 11' on both OS.
- STOP-S11-W6DIR: carried as the named debt D-S11-W6DIR (`:841`; notes[9]; carried debts above).
- STOP-R21B-1: every suite that loads the protected files was run only at the PM seat under grant (g) or in CI.
- STOP-S11-80: CLOSED by classification at the PM seat on 2026-10-03: `edb8381`..HEAD changes 137 paths, 34 of them test files; 33 are
  run by an S11 child or by `rebuild.yml` (green in CI-1 on both OS and in T20); the one with no CI home,
  `rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs`, ran 59/59 at the seat together with
  `release-from-seal.test.cjs`. No standing failures. New named debt D-S11-80-CIHOME: that one tooling test has no CI step; carried
  until a reviewed change gives it one.
- Already closed by the record: STOP-S11-ID, STOP-S11-THEME, STOP-S11-GSUP, STOP-S11-AUTH-TEXT, STOP-S11-BRIEF, STOP-S11-REV,
  STOP-S11-R20 ("STOPs the ledger now records as met", S11.json notes[7]); STOP-S11-WRITERS and STOP-S11-ECAP (CLOSED, `:887`).
(3) Still open, by design:
- STOP-S11-CI: open until T26 (CI-2 at the exact head C4, on L6).
- STOP-S11-PHONE: open until T29/T30 (the route B phone proof on the deployed live slice, brief 8 (1)).
- STOP-S11-R20B1: open until T29/T30 (reachability on a real imported history, judged by the Fable advisor on a measured call path,
  with the capture class of `engine-capture.cjs:72-73`, brief 8 (3)).
(4) Every item written above as "re-judged by the PM in this verdict ... as not reachable from genuine use" stands as written.

## PAID (stated as paid and still true; nothing here is excused)
- FC09's reachable defects, paid in bytes and closed by three reads at `:885`: the P3-EN3 Yes-then-Import refusal (`:877`-`:878`), Q1
  (`:879`), Q3 (`:880`-`:881`), Astra L1 B1a/B1b/B1c/B2 (`:882`; re-run PAID at L2 and L3), Opus l2 B1 and Fable l2 B3 (`:884`; paid at
  `7cf4a87`, `:885`). STOP-S11-OBSERVE for child 16 CLOSED (`:887`); green again at T5b run 3 (`:890`) and at T20.
- The today-17 P1 build-dir race (`:888` found, `:889` fixed red first, Fable distfix l1 ACCEPT WITH NAMED DEBTS); green at T5b run 3
  (today-17 '# pass 829' on both OS, `:890`) and in ci2, full2 and T20 (39 CHILD OBSERVED).
- E1, the page-bundle "seat offset": paid at `:888` (W5 given its own physical copy; page-bundle 7/7 at the pins).
- E3, the local observation refs and worktrees: removed (`:888` for `obs/s11-2`, `:890` for `obs/s11-3`).
- E4 on the first pass's final inputs (`:888`); D-S11T3g-3 (the port's literals bind M2-S11-NATIVE-LOAD; THEME `:874` fixed the id
  and both exports ran); D-S11EXP-2 (the PM line records C12 as the verbatim D:49 line and C6 as paid once the folder existed:
  `:888` "PENDING 2 (C6 scratch root, then created; C12 the verbatim D:49 contract line)").
- D-S11T3d-3 (the differential needle's cut): PAID by the T6 (e) ruling (`:887`), kept at T6 again (`:890`).
- D-S11T3e-2 (the nine runnerSha256 re-pins final while no later byte lands on `b-package.cjs`): true at A and at T20 (runner
  `bdbb8a93` = S11.json `tooling.runnerSha256`, Fable T16 section 2; T20's SEALED RUN RECORDED line).
- D-S11T3k-3: the citation check above, 0 stale.
- STOP-S11-WRITERS and STOP-S11-ECAP CLOSED (T3b patch-ids and the three-way merge-file proof clean, `:887`); STOP-S11-REV
  (`:872 (2)`); STOP-S11-R20 (T1 head `35859dc`, `:870`-`:871`).
- D-L14-LEGACY-NULL: green, and red under L14-M02 (`:872 (5)`).
- D-L12-CUSTODY (brief T22 states it paid); D-R22L3-1..5, D-R22L4-1..3, D-L15-HOST-SHOW, D-R22L5-1 (23b row 266), L16 B1-B6 (round 24,
  `D:846 (1)`) (brief 8 (5)); the round-25 items L17-B1..B6 (S24-H08 paid as L17-B6), B-R24F-1..3, B-R24-O-1..4; the round-26 items
  B-R25C-1..4, L18-B1..B10; B-R26F-1..2, B-R26C-1..6, L19-B1..B6 and the round-27/28 items: each "PAID once the final closing reads
  accept" (brief 8 (5)), and they did (`:870`).
- Round 29's product change to FC03 (H-01..H-04, RECORD_INVALID, inside grant (a)) is a stated product change of S11, superseded by
  rounds 30-34b (brief 8 (5) rev11; runbook section 3).
- D-R32C-1 (= Astra L23-B5) and D-R32C-2 (= L23-B1), fixed in round 33 (`:865` ruling, `:866 (1)` built), closed at `:870`.
- D-R31F-1 (Fable R31 l1, member order deciding some compares): PAID in round 32: ruled at `:863` (semantic equality at EVERY
  comparison site), built at `:864 (1)` (one order-free comparator at every site), confirmed at `:865` (Claude (Opus) R32 l1: every
  compare order-free).
- D-S11-A1/A2 PAID in bytes (Astra 146: "paid by the measured REGEN changes"; brief 8 (5) rev8), not carried.
- D-S11T3f-1..4 (PAID at T3k); D-S11T3l-1 (PAID at `1fd16f5`); D-S11R7-1..3 and D-S11R7-4 (a), (b); D-L3-CITES (paid in text); D-L3-FILL
  (paid at T6 (g)); L4-B1, L4-B2, L5-B1 (paid in text); D-S11R9-1 (paid in text); D-S11R10-1 and D-S11R10-2 (paid in text, checked at
  the job read (5)(v)); D-S11R8-2..4 (paid in text or at T6); D-T5B-1 (paid by the PM's read of all 78 rows, `:859` per runbook
  section 3) (brief section 15 maps).
- The s10-copy-lock needle text ("# pass 9" vs measured "# pass 11"): replaced by the both-OS observation (notes[14]; Astra 148 item,
  brief section 15).
- C2-FC09-BRIEF and C2-COPY-BIND: RULED at `:890 (1)`, `(2)` (above); the `:862`/`:866` citation: corrected at `:890 (3)`.

## Inherited from S10 (carries restated; brief 8 (5): "S11 pays none of these unless its VERDICT says so")
This verdict pays none of them. Each stands as `VERDICT-S10.md` states it (`DECISIONS:838`):
- D-BLOM (`:798`/`:799`): below.
- The released pair of `DECISIONS:828` (`today-app.cjs`, `gym-app.mjs`): S10's release, not S11's; S11 declares neither path (notes[1]:
  "Parent-released paths are not declared").
- D-EPP-3's owed gates and D-EPP-4's red half: above (Declared departures); D-T16S11-5.
- D-GSS-TIMER, D-GSS-PASSTHROUGH, D-GSS-LINES; GSS-LATE-CLEAR, GSS-G5-DIAGNOSTIC, D-GSSFIX-1, D-GSSFIX-2 (`:834`).
- D-SPLIT-LISTEN (payer TODAY-OUTCOME-TYPE); the split debts D1 and D2 (payers TODAY-GESTURE-PAINT-ROOTS and TODAY-OUTCOME-TYPE, `:633`)
  with S10's OPEN ITEMS C2-OPEN-1 and C2-OPEN-2.
- The ci0 red of `:835` (recorded, not excused); D-T16-1..5.
- D-PATH-NODE (`:836`): still live; neither git nor node is on the PC's PATH (runbook section 0, MEASURED), so every S11 cmd file
  carries both folders.
- D-NODE-MODULES-HOME (`:826`): live again as E1; W11's `rebuild/m3/w5/node_modules` now junctions to a separate physical copy
  (`:888`), not a clean pinned install home. Carried until one is ruled.
- D-S9SEAL-1 (the runner's pinned count is of record): applied above (320). D-S9SEAL-2 (restate the unpaid carries): paid again by
  this section. D-S9SEAL-3 (the today-17 flake class): STILL OPEN; S11 adds evidence and one closure: the P1 build-dir race in
  `copy.test.mjs` was a test-only defect found by three local seal-run reds and fixed red first (`:888`-`:889`); a single-OS today-17
  red at CI-2 still follows the `:816` empty re-run commit rule. D-S9SEAL-4 (chain freeze): from L5 (`:892`, R `84f5bca`) to L6.
- D-CF-1..3, D-T6-STATIC, D-T6-READS, D-SEAL, D-S10I-3, D-SP-1, D-SP-3..6, D-S10R11-1..5, D-COPYLOCK-*, and the V8 carries, as
  VERDICT-S10 lists them.

## D-BLOM
The b-lom child stays undeclared, exactly as at S10 and the sealed S9 (`DECISIONS:798`, owner BLOM-OPTIONS 2(b); `:799`; S11.json
notes[8]). Its LOM-S6 walk reads code files under `rebuild/m3` and `rebuild/m4`, which is why the cell is not declared; FC09 added
by-path exclusions to that walk before any read (`:884 (3)`, `:885`). CI keeps running the b-lom step in `rebuild.yml` (rebuild.yml
:371-372, runbook T26), and D-BLOM excuses no red public step (`D:800`, runbook T26). b-lom ran 20/20 at the PM seat on the FC09
heads (`:883`, `:885`); that is seat evidence, not this tree's sealed evidence. D-BLOM is re-measured after 2026-10-05 by the
hosted-blom packet (notes[8]).

## The coach constant
`rebuild/coach/engine-revision.cjs` `ENGINE_REVISION` (the literal on :25) moves once, from `M2-S10-TODAY-SPLIT@3c6d1f5d1fba7699`
(set at the S10 seal) to `M2-S11-NATIVE-LOAD@6ead5e9e87c0ec84` (the first 16 hex of this receipt's sha256), in commit C3
`9e98a68` after this verdict. S11.json declares no `rebuild/coach` path (0 rebuild/coach paths in the product, Fable T16 section 2),
so C3 does not void the receipt. The coach suite (`rebuild/coach/test/*.test.cjs`, the `rebuild.yml` glob) ran
377/377 (EXIT=0); the production pair (production-mapping and production-admission) ran 28/28 (EXIT=0)
(child 7's needle is `# pass 28`, notes[14]).

## What this seal carries for the athlete
What the owner gets, in plain words: when the app has a next weight ready for a lift, the Today screen can offer it, and nothing
changes unless he taps Yes. A Yes can be undone. If he trains on his phone, taps Yes, and then imports his old training history, the
import is no longer refused because of that Yes: the Yes is carried through the import, and its Undo stays visible even when his
file calls the lift by a different name (FC09, `:877`-`:885`). Every sentence on the offer card and in its explanations is wording
the owner approved (`DECISIONS:798 (3)`, `:804`, `:842 (2)`), and nothing he can see changed after that approval (`:890 (2)`).
Native-load records that arrive inside an imported file, rather than made on this phone, are still refused (D-L12-ISSUANCE), and
one question stays open for the trial: whether a phone with no imported history ever reaches a native-load earn, since a first-run
ladder has no next load (`:885`, owner step T29). This all sits on the sealed S10 Today split; the only engine bytes that move are
the new native-load module and the declared FG01 and FG02 hunks in `writers.cjs` and `progression.cjs`. The owner said "Yes, at each
seal" at `DECISIONS:816` (2): the fast-forward that lands this seal updates his phone preview through `slice-host.yml`, as L6
records. The only coach byte that moves is the revision constant, which moves once to name this seal.
