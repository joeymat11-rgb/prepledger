# VERDICT - M2-S7-PORT-ADMISSION · lane B seal · PASSED on the `DECISIONS:518` receipt

Branch `rebuild/b-s7-port-admission`, worktree on the owner's Windows PC (node v24, `TZ=America/New_York`,
`MEASURED_TEST_NOW=2026-09-03`), executed there under `DECISIONS:512`, `:513`, `:514`, `:516` and `:517`. Head commit
`254bd1272cc9b67521c5a8c63bb70796d20e1bec` (review ACCEPTED, tip merged); the chain tip
`c081cbd945cb17b4d727fcde97b572f2d85710f6` (receipt base) is an ancestor of this head, so the seal base is on the tip
(rule=ancestor, `DECISIONS:135 (4)`). sourceBase `3d002174`. No private value, count, hash or prose appears in this file.
The PASS word below is the runner's, earned on the FULL run against `DECISIONS:518`.

## Authority
- Brief `rebuild/lanes/b/S7-PORT-ADMISSION-BRIEF.md`, sha256 `e51a83297fda8a0fcbe15ffa7ce241e2dec98325c0fa72767dd36691ca660251`
  (26571 B), the brief of record by sha at **`DECISIONS:513`**; theme **`DECISIONS:512`**; rule of record `DECISIONS:508`
  over `rebuild/lanes/d/P3-PORT-FIX-SPEC.md` v2 at `1dec0410`; standing ruling `:455`; the two reseal rules of
  `VERDICT-S6.md`. Gate supersession: the standing role `DECISIONS:153` granted by the token clause **`DECISIONS:514`**
  (RULED), the spec's `coverage.superseded.rulingLineSha256`, located on the chain branch by its own bytes
  (`46622ec5a6b3...`).
- Parent (single, immutable): `rebuild/m4/spec/acceptance-s6-today-child.json` sha256
  `0e52357ed62249d4ee94b473e2dde20220b0a82c3737414bba0603fa76bf040f`, receipt `DECISIONS:500`, reviewed at `23575c0f`.
- Receipt of record: **`DECISIONS:518`** at `c081cbd945cb17b4d727fcde97b572f2d85710f6`, carried by
  `rebuild/m4/spec/review-s7-port-admission.json` as `{status: "ACCEPTED", receipt: {commit, path, line, lineSha256}}`
  (lineSha256 `285b5218b9b209dd944e61b155a32abc74e71078cfc36e2476a5e6d532556ff3`). Its reviewed commit is the lane head
  `e7fb94be36e13db1ff29d70a3e7ee3078f1e7f14`.
- Judgments: `DECISIONS:508` (P3-PORT-FIX spec accepted, the rule of record), `:509` (the FIX build judged, three rulings),
  `:510` (P3-PORT-FIX-2 judged, the `:509` retry gate closed), `:515` (S7-TOOLING judged; the three token lines stand at
  `:512`, `:513`, `:514`), `:516` (chain A: the runner's eight-hop baseline bound found), `:517` (S7-BASELINE-WALK judged;
  the artifact at `350f5688...` ACCEPTED).
- Independent reviews, each a second hand, blind: `rebuild/lanes/d/P3-PORT-FIX-REVIEW-R1.md` (ACCEPT WITH NOTES) and
  `rebuild/lanes/d/P3-PORT-FIX-REVIEW-R2.md` (ACCEPT); `rebuild/lanes/d/P3-PORT-FIX-2-REVIEW-R1.md` (ACCEPT WITH NOTES)
  and `rebuild/lanes/d/P3-PORT-FIX-2-REVIEW-R2.md` (ACCEPT); `rebuild/lanes/b/S7-TOOLING-REVIEW-R1.md` (ACCEPT WITH
  NOTES, 0 BLOCKING) and `rebuild/lanes/b/S7-TOOLING-REVIEW-R2.md` (ACCEPT); `rebuild/lanes/b/S7-BASELINE-WALK-REVIEW-R1.md`
  (ACCEPT, 0 BLOCKING). The Fable final on each round was taken by the PM per `DECISIONS:439`.

## The evidence hashes this seal stands on
- Artifact `rebuild/m4/spec/acceptance-s7-port-admission.json` sha256 **`350f56885c5eb55eecada58cadfb011656ddc58b82fc8fdc514ddc4503af791b`** (84128 B).
- Spec `rebuild/lanes/b/tooling/packages/S7.json` sha256 **`e7658e21f1178f8316ae6dadc3f13d1cd62210fd37693086fd7c4fcbe65ba285`** (83449 B).
- Runner `rebuild/lanes/b/tooling/b-package.cjs` sha256 **`0fb0570d812ea1c1a9426281ae39c8101c1ddd0206b11ad5efa7a3778339cf8d`** (257673 B).

## Sealed-run receipt (`DECISIONS:136 (3)`)
`rebuild/lanes/b/tooling/receipts/S7.json` sha256 **`3fd8d36bd4268f145b6feb8052710efca41660a8539b490f212421a9ab4013f1`**
(26098 B), written by the runner itself on the terminal branch of the FULL run that earned
`POSTFIX PACKAGE PASS M2-S7-PORT-ADMISSION` (exit 0) on the PC with the private census junction in place, and committed
unmodified. Its `sealedRun` block carries the three hashes above, `envelopeKey ACCEPTED:...`, this verdict file by name
and the 206 pinned product shas. With these bytes in Git and this sha256 named here, the `:136 (3)` byte-identity step is
AVAILABLE. The coach constant moves to `M2-S7-PORT-ADMISSION@3fd8d36bd4268f14` in the commit after this one; the standing
CI step already names S7 inside the package (`VERDICT-S6.md` rule (a), done at `49f85e3`).

## Terminals - executed on the PC, exit codes measured
1. `--full --package S7` at `742f3543` (artifact `6e6ed8a6...`, review absent; log `%TEMP%\s7-full1.log`):
   `POSTFIX M2-S7-PORT-ADMISSION REVIEW-PENDING mode=--full` · `PARENT PINS RE-ASSERTED` (2 + 196 product pins, 1
   grandparent pin) · `LAWS 45/45 executed` · 24 of 24 children OBSERVED exit 0 · `PRIVATE ORACLE PRESENT`, verdict-only ·
   9 gates SUPERSEDED under `DECISIONS:514` · `POSTFIX PACKAGE REVIEW-PENDING: 2 open obligation(s)`, exit 2. The second
   obligation was `HISTORICAL AUDIT SKIPPED`: `baselineOf` walked the parent chain with a hard-coded bound of eight hops
   and S7's baseline-bearing artifact sits at hop 8 (`DECISIONS:516`). Deterministic, not a flake; nothing retried.
2. `--full --package S7` at `e7fb94be` (artifact `350f5688...` after S7-BASELINE-WALK, review absent; log
   `%TEMP%\s7-full2.log`): `POSTFIX M2-S7-PORT-ADMISSION REVIEW-PENDING mode=--full` · `ENVELOPE ABSENT` ·
   `PARENT PINS RE-ASSERTED` · `LAWS 45/45 executed` · `PRIVATE ORACLE PRESENT`, verdict-only · `HISTORICAL TOTAL 45 laws ·
   45 RED-frozen · 45 RED-candidate · 90 GREEN repair controls · 104/104 mutant executions DETECTED · 0 HARNESS_ERROR ·
   AUDIT RED-FIRST OBSERVED` · `FULL EVIDENCE 10 of 19 original gates re-executed, 9 SUPERSEDED` ·
   `POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation(s)` (the acceptance), 24/24 children OBSERVED exit 0, exit 2.
3. `--full --package S7` at `254bd127` (review ACCEPTED on `:518`, tip merged; log `%TEMP%\s7-full3.log`):
   `POSTFIX M2-S7-PORT-ADMISSION AUTHORIZED mode=--full` · `SEAL BASE ON THE TIP` (rule=ancestor) ·
   `ENVELOPE AUTHORIZED artifact=350f56885c5e... reviewed at e7fb94be36e1...; receipt base c081cbd945cb...` ·
   `PARENT PINS RE-ASSERTED` (2 + 196 product pins, 1 grandparent pin, byte-identical on disk AND in Git; 197 superseded
   pins preserved at sourceBase `3d00217`) · `AUTHORITY OBSERVED` (theme `DECISIONS:512` and brief acceptance `:513` found
   in Git on the chain branch) · `LAWS 45/45 executed` · 24 of 24 children OBSERVED exit 0 · 9 gates SUPERSEDED under
   `DECISIONS:514` · `AUTHORIZED STEP UNAVAILABLE SEALED-RUN-RECEIPT-ABSENT` (first authorized run on this receipt) ·
   `PRIVATE ORACLE PRESENT`, verdict-only · `HISTORICAL TOTAL 45 laws · 45 RED-frozen · 45 RED-candidate · 90 GREEN repair
   controls · 104/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST OBSERVED` · 10 LEGACY gates
   re-executed, all PASS · `SEALED RUN RECORDED rebuild/lanes/b/tooling/receipts/S7.json` ·
   `POSTFIX PACKAGE PASS M2-S7-PORT-ADMISSION`, exit 0.
4. `--full --package S7` byte-identity re-verify at the head that carries the receipt and the moved coach constant
   (log `%TEMP%\s7-full4.log`): PENDING.

## Notes recorded on this seal
- The brief's section 3.3 says five children execute the six `s7-*` cells; it is six. The slip was left uncorrected on
  purpose so the brief's sha256 and `DECISIONS:513` stay fixed, and it is corrected here instead.
- The brief's section 5.1 names the runner sha `a07df1e0...`, which S7-BASELINE-WALK superseded with
  `0fb0570d...` when it raised the baseline walk bound. That is by design: the brief's bytes are bound by `:513` and
  cannot move, so the standing runner sha is the one recorded above under "The evidence hashes this seal stands on".
- The edited tooling suite `rebuild/lanes/b/tooling/test/parent-pin-shapes-and-spec-successors.test.cjs`, which carries
  the S7-BASELINE-WALK cell, passes fidelity through the runner's fixed `TOOLING_FILES` inventory rather than as a
  declared path in the package. That is the shape the runner has; it is recorded here so the next reseal does not read it
  as an omission.

## What this seal carries for the athlete
The owner's own history can be imported. The file is proved to be his programme by SHAPE: every split period's week map,
the lift id multiset, each lift's day and muscle group, the exercise count. His per-lift numbers are RETAINED from the
file, not from the phone: sets, rep targets, increments, ladders, head and secondary tags, priority muscles, and after an
admitted import the Train screen shows the FILE's numbers on the file's split map. A session he recorded on this phone
BEFORE importing is admitted: its provenance is proved against the phone's own setup document, the programme that
actually produced it, and it rides into the admitted state as recorded, so the next morning's card opens on his real
programme. Every refusal names the field and the lift and says a true sentence keyed on that field, including the two the
PM wrote for a recorded workout whose set count differs and for a phone with no saved setup, and every refusal leaves the
phone unchanged. The four retained numbers are bounded by the document constructor's own rules, so a file the constructor
would refuse is refused at admission rather than dead-ending the gym card. Edit My Week moved with the rule, so the
companion accepts exactly the programme admission accepted. No engine byte moves and no coach byte moves beyond the
revision constant.
