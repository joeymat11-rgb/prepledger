# VERDICT - M2-S9-UI-PINS - lane B seal - PASSED on the `DECISIONS:809` receipt

Lane `rebuild/b-s9-integration`, worktree on the owner's Windows PC, executed there by the PM seat under the seal grant
`DECISIONS:796 (d)` (pass/fail lines only; no data leaves the PC). Artifact commit
`9c95afa5b840fedbe914652b2f0bd83d1b0800c2` (A, the reviewed commit). The chain tip
`60be3c6fb53975f60d4f54922d12ea9f17fbfb33` (R, receipt base) is an ancestor of the sealing head, so the seal base is on
the tip (rule=ancestor, `DECISIONS:135 (4)`). sourceBase `e8712f48b32e33738cdf81dd8d6cd72d0a72523d` (`DECISIONS:804`).
No private value, count, hash or prose appears in this file. The PASS word below is the runner's, earned on the FULL run
against `DECISIONS:809`.

## Authority
- Brief `rebuild/lanes/b/S9-UI-PINS-BRIEF.md`, sha256 `abf3f670835803b94ac768bf0c0b0a0de5d2570302abd7651179e9005efb3f58`
  (122946 B), the brief of record by sha at **`DECISIONS:789`**; theme **`DECISIONS:788`**; standing reseal ruling
  `:455`; the `DECISIONS:732` fold.
- Release from seal: **`DECISIONS:786`** (RELEASE-FROM-SEAL of `rebuild/m3/w7-preview/today/preview.css` and
  `rebuild/m3/w7-preview/today/build.mjs`), the spec's `release.rulingLineSha256`, located by its own bytes.
- Gate supersession: the standing role `DECISIONS:153` granted by the token clause **`DECISIONS:787`** (RULED), the
  spec's `coverage.superseded.rulingLineSha256`, located on the chain branch by its own bytes (`b8d088af3eb8...`).
- Parent (single, immutable): `rebuild/m4/spec/acceptance-s8-real-shape.json` sha256
  `3cf58e0edd76a56353b35008ef154d484098b5017fedeb648eb64a0ae6568d48`, receipt `DECISIONS:528`.
- b-lom: `DECISIONS:798` (owner, BLOM-OPTIONS 2(b)) and `:799` (PM, brief 3.3 read without the b-lom child): debt
  D-BLOM below.
- sourceBase moved to `e8712f48` at `DECISIONS:804`.
- Receipt of record: **`DECISIONS:809`** (POSTFIX-ACCEPTANCE) at `60be3c6fb53975f60d4f54922d12ea9f17fbfb33`, carried by
  `rebuild/m4/spec/review-s9-ui-pins.json` (sha256 `7f372d97170cbc4f58025a84ba4c705488aae6a7ff11c61e0e97b1b2b4eddcb4`) as
  `{status: "ACCEPTED", receipt: {commit, path, line, lineSha256}}` (lineSha256
  `66ff27e7040282eede53023dfe0e1015b2664f28fbf7adfcb84dc662591dad6b`). Its reviewed commit is A
  `9c95afa5b840fedbe914652b2f0bd83d1b0800c2`. The envelope was committed as V `4d649bc`; merge-forward #2 is M2
  `c30a0bc` (the diff V..M2 is `rebuild/DECISIONS.md` and `rebuild/lanes/HANDOFF-PM-2026-09-24-B-CLAUDE-OPUS-5-5.md`
  only); the sealed-run receipt was committed as C1 `c3b04be`.
- Fable T11 seal read at A: ACCEPT WITH NAMED DEBTS D-S9SEAL-1 to D-S9SEAL-4, each carried below.

## The evidence hashes this seal stands on
- Artifact `rebuild/m4/spec/acceptance-s9-ui-pins.json` sha256 **`f24476220ec9fe187aded6d708c2371a3f604c3f2a41bb94a9594e351d8b8b1c`** (exporter v3, run `s9-final-1`).
- Spec `rebuild/lanes/b/tooling/packages/S9.json` sha256 **`bb169a67847d10963fcaa0d69c14d5e157ad0a81525e22352ef116d6071ac86c`**.
- Runner `rebuild/lanes/b/tooling/b-package.cjs` sha256 **`5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22`**.

## Sealed-run receipt (`DECISIONS:136 (3)`)
`rebuild/lanes/b/tooling/receipts/S9.json` sha256 **`cb31838ff0db840609adfb63476c824f28d0690913f4143f2c47ee5c05154d2e`**
(32291 B), written by the runner itself on the terminal branch of the FULL run that earned
`POSTFIX PACKAGE PASS M2-S9-UI-PINS` (exit 0, terminal T15) on the PC with the private census junction in place, and
committed unmodified as C1 `c3b04be`. Its `sealedRun` block carries the three hashes above, `envelopeKey ACCEPTED:...`,
this verdict file by name and the 254 pinned product shas (256 product entries less the 2 released paths, which the
seal step never writes into the map). With these bytes in Git and this sha256 named here, the `:136 (3)` byte-identity
step is AVAILABLE. The coach constant moves to `M2-S9-UI-PINS@cb31838ff0db8406` in the commit after this one (C3).

## Terminals - executed on the PC, exit codes measured
1. T7, `--ci --package S9` at A `9c95afa` (artifact `f2447622...` proposed, scratch review PENDING):
   `POSTFIX M2-S9-UI-PINS REVIEW-PENDING mode=--ci` |
   `ENVELOPE PENDING artifact=f24476220ec9fe187aded6d708c2371a3f604c3f2a41bb94a9594e351d8b8b1c
   spec=bb169a67847d10963fcaa0d69c14d5e157ad0a81525e22352ef116d6071ac86c
   runner=5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22; independent exact-artifact acceptance
   required` | 32 CHILD OBSERVED exit 0 | `PUBLIC CI EVIDENCE PASS [cut]`, exit 0. This is the public evidence only and
   carries no PASS word for the package.
2. T9, `--full --package S9` at A `9c95afa` (review absent, private census connected):
   `POSTFIX M2-S9-UI-PINS REVIEW-PENDING mode=--full` |
   `ENVELOPE ABSENT [cut]` | `PRIVATE ORACLE PRESENT; verdict-only reporting [cut]` | 32 CHILD OBSERVED exit 0 |
   10 LEGACY gates re-executed |
   `FULL EVIDENCE: 10 of the 19 original gates re-executed, 0 carried [cut] and 9 SUPERSEDED under DECISIONS:787 [cut]` |
   `POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation(s); independent exact-artifact acceptance required`, exit 2. The
   one obligation was the acceptance itself; nothing was retried and nothing was edited.
3. T15, `--full --package S9` at M2 `c30a0bc` (review ACCEPTED on `:809`, tip merged):
   `POSTFIX M2-S9-UI-PINS AUTHORIZED mode=--full` |
   `SEAL BASE ON THE TIP; refs/remotes/origin/rebuild/t2-client-core is at 60be3c6 and that commit is an ancestor of this HEAD
   (DECISIONS:135 (4), rule=ancestor)` |
   `ENVELOPE AUTHORIZED artifact=f24476220ec9fe187aded6d708c2371a3f604c3f2a41bb94a9594e351d8b8b1c reviewed at
   9c95afa5b840fedbe914652b2f0bd83d1b0800c2; receipt base 60be3c6fb53975f60d4f54922d12ea9f17fbfb33 [cut]` |
   `AUTHORIZED STEP UNAVAILABLE SEALED-RUN-RECEIPT-ABSENT; the FULL run with the private census is required
   (DECISIONS:136 (3))` (first sealed run on this receipt) | `PRIVATE ORACLE PRESENT; verdict-only reporting [cut]` |
   32 CHILD OBSERVED exit 0 | 10 LEGACY gates re-executed, all PASS |
   `FULL EVIDENCE: 10 of the 19 original gates re-executed, 0 carried [cut] and 9 SUPERSEDED under DECISIONS:787
   [cut]` |
   `SEALED RUN RECORDED rebuild/lanes/b/tooling/receipts/S9.json; artifact=f24476220ec9 spec=bb169a67847d
   runner=5321181a14bd over 254 pinned product file(s)` |
   `SEALED RUN NEXT STEP commit rebuild/lanes/b/tooling/receipts/S9.json and write its sha256
   cb31838ff0db840609adfb63476c824f28d0690913f4143f2c47ee5c05154d2e into rebuild/lanes/b/VERDICT-S9.md [cut]` |
   `POSTFIX PACKAGE PASS M2-S9-UI-PINS`, exit 0.
4. T19, `--full --package S9` at the head that carries the committed receipt, this verdict and the moved coach
   constant (the byte-identity re-verify):
   at C3 `5beae3f` (C2 `9a7773a` carries this verdict; log `%TEMP%\s9-full3.log`):
   `POSTFIX M2-S9-UI-PINS AUTHORIZED mode=--full` |
   `SEAL BASE ON THE TIP; refs/remotes/origin/rebuild/t2-client-core is at 60be3c6 and that commit is an ancestor of this HEAD
   (DECISIONS:135 (4), rule=ancestor)` |
   `ENVELOPE AUTHORIZED artifact=f24476220ec9fe187aded6d708c2371a3f604c3f2a41bb94a9594e351d8b8b1c reviewed at
   9c95afa5b840fedbe914652b2f0bd83d1b0800c2; receipt base 60be3c6fb53975f60d4f54922d12ea9f17fbfb33 [cut]` |
   `AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY (DECISIONS:136 (3)); artifact, runner, spec and all 254 pinned product file(s),
   plus 2 released and NOT re-verified here, are byte-identical to the sealed run recorded in
   rebuild/lanes/b/tooling/receipts/S9.json cb31838ff0db840609adfb63476c824f28d0690913f4143f2c47ee5c05154d2e [cut]` |
   32 CHILD OBSERVED exit 0 | no new SEALED RUN RECORDED (the committed receipt is unchanged) |
   `POSTFIX PACKAGE PASS M2-S9-UI-PINS`, exit 0. The private census junction was removed after this run.
   Terminal 3 stands as the evidence for the private oracle, the historical audit and the 19 original gates; T19 does
   not re-run them.

## CI
- CI-1 at A `9c95afa`: `rebuild` run 36048172480 success, all four jobs (rebuild-public ubuntu and windows, C font
  transport ubuntu and windows); `pipeline` run 36048172469 success; `shared-preflight` run 36048172482 success.
- CI-2 at the sealing head:
  named on the `M2-S9-UI-PINS SEALED AND MERGED` ledger line (runbook T23), with its run id and both runners'
  conclusions, taken at the exact lane head that carries this file. This file is not edited after that run, because a
  later commit would move the head the run must stand on.

## Source custody
Re-pointed at helper `38a9f2f8`, CANDIDATE `b44ec01`, SOURCE_BASE `e8712f48`; the `rebuild/lanes/b/tooling/packages/S9.json`
blob is identical at `b44ec01` and at A. `VERDICT PASS scope=SOURCE_CUSTODY_CLOSURE`, exit 0.

## The released pair, and why T19 does not re-verify it
`rebuild/m3/w7-preview/today/preview.css` and `rebuild/m3/w7-preview/today/build.mjs` are released from the seal by
`DECISIONS:786` and declared `role: released` in the spec. A released path is not a pinned product file: this package
stopped standing its bytes the moment the PM's line was ruled. The seal step never writes a released path into the
receipt's product map (runner H12), and the byte-identity re-verify skips it in both directions (runner H13), so the
first lane C edit to a released stylesheet does not void the receipt and force every authorized rerun back to a FULL
run with the private census. Every other product file (254) is re-verified in both directions exactly as before.

## Debts named on this seal (Fable T11, ACCEPT WITH NAMED DEBTS)
- D-S9SEAL-1: the seal pins 254 product files, not the 253 the runbook predicted. The runner count (256 product entries
  less the 2 released) is the one of record; the runbook number was wrong, not the seal.
- D-S9SEAL-2: this verdict restates the unpaid V8 prose carries (below), D-BLOM and the released pair (above); the p3-layout-v2 note is paid (below).
- D-S9SEAL-3: the today-17 `P-MEASURE` flake class (`rebuild/m3/w7-preview/measure/test/journey.test.mjs`, the
  `DECISIONS:496` class, first recorded at `DECISIONS:496` on S6, seen again on S8) is still open. Every run recorded above has its children OBSERVED at exit 0;
  a single red on that cell is re-run, not edited.
- D-S9SEAL-4: the chain branch stays frozen from T12 to T22. A chain move in that window takes the seal base off the tip
  and needs a PM FREEZE line naming the base before any authorized rerun can pass.

## V8 carries restated (unpaid, from `VERDICT-S8.md`)
- The comment in `.github/workflows/rebuild.yml` says the brief predicts the exact refusal. The S8 brief predicts `R01`
  verbatim; it is `rebuild/lanes/b/S8-PREP-AUTHOR-REPORT.md` that names `RECEIPT-EXACT-LINE-MISSING` (`DECISIONS:524`
  N3). Still corrected in prose only, not by moving pinned shas.
- `rebuild/lanes/b/tooling/packages/S8.json` cites its own three ledger lines one number low (theme `:524`, brief-by-sha
  `:525`, token clause `:526`, which stand at `:525`, `:526` and `:527`). The runner locates each by its own sha256, so
  nothing rests on the numbers; still corrected here rather than by moving a pinned sha.
- Lane D carries, none blocking:
  (a) the layout's `profile` is not tied to the producer's `rule_profile` in the law (`P3-LAYOUT-V2-REVIEW-R1.md`);
  unreachable in product; the tie rides with whoever first carries a typed load onto the performed side.
  (b) `rebuild/m4/spec/configured-history-candidate/construct.cjs:6` patches the old one-profile string and will throw on
  the Unique projector edit; env-gated and in no bar row (`P3-LAYOUT-V2-REVIEW-R1.md`).
  (c) `entry.load` is null for a configuration lift, the lane C design (`DECISIONS:523`).
  (d) The identity trade (`P3-REAL-SHAPE-REVIEW-R1.md`, `-R2.md`), restated at every round as asked: the proof that an
  imported file is the owner's is the sealed file, the six words and his identity Yes; kept under `DECISIONS:472 (a)`
  and `:521`.
  (e) The programme digest changed shape and `listImports` on the owner's own installation was not re-verified, because
  no lane may open it; it is verified at the owner's retry.
- The S8 note on the two `rebuild/lanes/d/p3-layout-v2` cells (`layout-v2.test.mjs`, `projector-parity.test.mjs`;
  `DECISIONS:524` N1) is PAID here, not carried: both are declared product (role pinned-unchanged) and are executed by
  the `d-real-shape` child under the runner's `rebuild/lanes/d/p3-layout-v2/` child root.

## D-BLOM
The parent's child b-lom (`rebuild/lanes/d/b-lom/legacy-order.test.mjs` and
`rebuild/m4/workout/test/legacy-order-mapping.test.cjs`) is not declared by this package: the owner chose BLOM-OPTIONS
2(b) at `DECISIONS:798` and the PM read the brief at `:799`, because its walk reads every code file under `rebuild/m3`
and `rebuild/m4`, a protected path included, which stays protected until 2026-10-05. Both cell files stay role carried
at the parent's bytes. S8's `# pass 30` stays the last sealed b-lom evidence. It is re-measured after 2026-10-05, and
the hosted-blom packet needs a reviewed re-point before it runs.

## No engine byte
This package changes no `rebuild/engine` byte (`DECISIONS:787` and the theme at `:788`); every engine file in the spec
is role carried at the parent's post. The nine superseded gates are retired because the package moves nothing they
could mend, not because anything moved.

## The coach constant
`rebuild/coach/engine-revision.cjs` `ENGINE_REVISION` moves once, from `M2-S8-REAL-SHAPE@3b1b8b91dd5a6ff0` to
`M2-S9-UI-PINS@cb31838ff0db8406` (the first 16 hex of this receipt's sha256), in commit C3 after this verdict. The
production pair (production-mapping and production-admission) ran 28/28, exit 0.
The coach suite (`rebuild/coach/test/*.test.cjs`, on the C3 bytes) ran 377/377, exit 0.

## What this seal carries for the athlete
The Today preview's UI is pinned to the whole approved 09-18 design pack, with the actual 09-08 runtime references
retained; its stylesheet and its build step are released from the seal so lane C can keep shaping the look without
reopening the package. No CUI1 product or reference promotion rides here (`DECISIONS:732`), and no engine byte moves.
The owner said "Yes, deploy at seal" at `DECISIONS:800`: the fast-forward that lands this seal updates his phone
preview through `slice-host.yml`, on the synthetic athlete, not his own history. The only coach byte that moves is the
revision constant, which moves once to name this seal.
