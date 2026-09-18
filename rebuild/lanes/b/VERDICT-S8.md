# VERDICT - M2-S8-REAL-SHAPE · lane B seal · PASSED on the `DECISIONS:528` receipt

Branch `rebuild/d-p3-real-shape`, worktree on the owner's Windows PC (node v24, `TZ=America/New_York`,
`MEASURED_TEST_NOW=2026-09-03`), executed there under `DECISIONS:521`, `:522`, `:523`, `:524`, `:525`, `:526` and
`:527`. Head commit `8a9a359be6b0470d29ee038d01fa0738decd1246` (review ACCEPTED, tip merged); the chain tip
`2f110c11c7b4c581e05dd694b1bcaa8ffb3514ab` (receipt base) is an ancestor of this head, so the seal base is on the tip
(rule=ancestor, `DECISIONS:135 (4)`). sourceBase `8ebc860`. No private value, count, hash or prose appears in this file.
The PASS word below is the runner's, earned on the FULL run against `DECISIONS:528`.

## Authority
- Brief `rebuild/lanes/b/S8-REAL-SHAPE-BRIEF.md`, sha256 `9fbe105744ccb9295eae866e5ac28b48397ccf6c7e3ea74cc1a97a3a1833c73a`
  (35888 B), the brief of record by sha at **`DECISIONS:526`**; theme **`DECISIONS:525`**; rule of record `DECISIONS:521`
  over `rebuild/lanes/d/P3-REAL-SHAPE-SPEC.md` v2 at `6e8c9c7`; standing reseal ruling `:455`; the build rulings `:522`
  and `:523`. Gate supersession: the standing role `DECISIONS:153` granted by the token clause **`DECISIONS:527`**
  (RULED), the spec's `coverage.superseded.rulingLineSha256`, located on the chain branch by its own bytes
  (`0c2d0db53471...`).
- Parent (single, immutable): `rebuild/m4/spec/acceptance-s7-port-admission.json` sha256
  `350f56885c5eb55eecada58cadfb011656ddc58b82fc8fdc514ddc4503af791b`, receipt `DECISIONS:518`, merge `:519`.
- Receipt of record: **`DECISIONS:528`** at `2f110c11c7b4c581e05dd694b1bcaa8ffb3514ab`, carried by
  `rebuild/m4/spec/review-s8-real-shape.json` as `{status: "ACCEPTED", receipt: {commit, path, line, lineSha256}}`
  (lineSha256 `d928cfd5b192deecba23d2fc469fb553cee126aa9fd0f487b4a6f7d3081d06de`). Its reviewed commit is the lane head
  `0cd07be7cf967dfbfea8c84947ba8477f58cfb5f`.
- Judgments: `DECISIONS:520` (the S7 retry unlocked and then refused on a named field; the real file's shape is not the
  fixtures' shape; P3-REAL-SHAPE dispatched), `:521` (the P3-REAL-SHAPE brief accepted by name, option A ruled, the rule
  of record), `:522` (the P3-REAL-SHAPE build judged ACCEPT, gap 5 named as a stop, P3-LAYOUT-V2 dispatched), `:523`
  (P3-LAYOUT-V2 judged ACCEPT, gap 5 closed, S8 ruled and the S8 preparation round dispatched), `:524` (S8-PREP ACCEPTED
  with the PM rulings on N1, N2 and N3).
- Independent reviews, each a second hand, blind: `rebuild/lanes/d/P3-REAL-SHAPE-SPEC-REVIEW-R1.md` (REJECT, six
  BLOCKING) and `rebuild/lanes/d/P3-REAL-SHAPE-SPEC-REVIEW-R2.md` (ACCEPT); `rebuild/lanes/d/P3-REAL-SHAPE-REVIEW-R1.md`
  (REJECT, two BLOCKING measured) and `rebuild/lanes/d/P3-REAL-SHAPE-REVIEW-R2.md` (ACCEPT);
  `rebuild/lanes/d/P3-LAYOUT-V2-REVIEW-R1.md` (ACCEPT, 0 BLOCKING); `rebuild/lanes/b/S8-PREP-REVIEW-R1.md` (ACCEPT WITH
  NOTES, 0 BLOCKING) and `rebuild/lanes/b/S8-PREP-REVIEW-R2.md` (ACCEPT, 0 BLOCKING). The author reports that stand
  beside them are `rebuild/lanes/d/P3-REAL-SHAPE-AUTHOR-REPORT.md`, `rebuild/lanes/d/P3-LAYOUT-V2-AUTHOR-REPORT.md` and
  `rebuild/lanes/b/S8-PREP-AUTHOR-REPORT.md`. The Fable final on each round was taken by the PM per `DECISIONS:439`.

## The evidence hashes this seal stands on
- Artifact `rebuild/m4/spec/acceptance-s8-real-shape.json` sha256 **`3cf58e0edd76a56353b35008ef154d484098b5017fedeb648eb64a0ae6568d48`** (89873 B).
- Spec `rebuild/lanes/b/tooling/packages/S8.json` sha256 **`6fbbb1b901c2d7cacc0595b41b41172a8c0faab12b52b470fcb85f4686878899`** (88184 B).
- Runner `rebuild/lanes/b/tooling/b-package.cjs` sha256 **`e31dd206c0fb0fc0c295df45eae3992d4c59b1a76de8da04a4d0f22948e9335e`** (259614 B).

## Sealed-run receipt (`DECISIONS:136 (3)`)
`rebuild/lanes/b/tooling/receipts/S8.json` sha256 **`3b1b8b91dd5a6ff049dffd721ec723b9fe550b0b71ba78e37574cfc96210d409`**
(28436 B), written by the runner itself on the terminal branch of the FULL run that earned
`POSTFIX PACKAGE PASS M2-S8-REAL-SHAPE` (exit 0) on the PC with the private census junction in place, and committed
unmodified. Its `sealedRun` block carries the three hashes above, `envelopeKey ACCEPTED:...`, this verdict file by name
and the 224 pinned product shas. With these bytes in Git and this sha256 named here, the `:136 (3)` byte-identity step is
AVAILABLE. The coach constant moves to `M2-S8-REAL-SHAPE@3b1b8b91dd5a6ff0` in the commit after this one; the standing CI
step already names S8 inside the package (`VERDICT-S6.md` rule (a), done in the S8-PREP round).

## Terminals - executed on the PC, exit codes measured
1. `--ci --package S8` at `d70b081` (artifact absent; log `%TEMP%\s8-ci2.log`):
   `POSTFIX M2-S8-REAL-SHAPE REVIEW-PENDING mode=--ci` ·
   `ENVELOPE ABSENT; rebuild/m4/spec/acceptance-s8-real-shape.json is not sealed yet [cut]` ·
   `PUBLIC CI EVIDENCE PASS [cut]`, exit 0. This is the public evidence only and carries no PASS word for the package.
2. `--ci --package S8` at `d70b081` (artifact `3cf58e0e...` proposed, review absent; log `%TEMP%\s8-ci4.log`):
   `POSTFIX M2-S8-REAL-SHAPE REVIEW-PENDING mode=--ci` ·
   `ENVELOPE PENDING artifact=3cf58e0edd76a56353b35008ef154d484098b5017fedeb648eb64a0ae6568d48
   spec=6fbbb1b901c2d7cacc0595b41b41172a8c0faab12b52b470fcb85f4686878899
   runner=e31dd206c0fb0fc0c295df45eae3992d4c59b1a76de8da04a4d0f22948e9335e; independent exact-artifact acceptance
   required` · `PUBLIC CI EVIDENCE PASS [cut]`, exit 0.
3. `--full --package S8` at `0cd07be` (the reviewed head, review absent; log `%TEMP%\s8-full1.log`):
   `POSTFIX M2-S8-REAL-SHAPE REVIEW-PENDING mode=--full` ·
   `ENVELOPE ABSENT; rebuild/m4/spec/acceptance-s8-real-shape.json is not sealed yet [cut]` ·
   `FIDELITY OBSERVED; sourceBase 8ebc860 ancestor of HEAD 0cd07be` ·
   `POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation(s); independent exact-artifact acceptance required`, exit 2. The
   one obligation was the acceptance itself; nothing was retried and nothing was edited.
4. `--full --package S8` at `8a9a359` (review ACCEPTED on `:528`, tip merged; log `%TEMP%\s8-full3.log`):
   `POSTFIX M2-S8-REAL-SHAPE AUTHORIZED mode=--full` ·
   `SEAL BASE ON THE TIP; refs/remotes/origin/rebuild/t2-client-core is at 2f110c1 and that commit is an ancestor of
   this HEAD (DECISIONS:135 (4), rule=ancestor)` ·
   `ENVELOPE AUTHORIZED artifact=3cf58e0edd76a56353b35008ef154d484098b5017fedeb648eb64a0ae6568d48 reviewed at
   0cd07be7cf967dfbfea8c84947ba8477f58cfb5f; receipt base 2f110c11c7b4c581e05dd694b1bcaa8ffb3514ab; spec
   6fbbb1b901c2... and runner e31dd206c0fb... pinned inside the artifact and re-read from Git` ·
   `PARENT PINS RE-ASSERTED at run time; 2 pin(s) from rebuild/m4/spec/acceptance-s7-port-admission.json plus its 206
   product pins through the inventory below, and 1 un-superseded grandparent pin(s) from
   rebuild/m4/spec/acceptance-s6-today-child.json, byte-identical on disk AND in Git at HEAD; 207 superseded pin(s)
   preserved in Git at sourceBase 8ebc860; parent artifact byte-identical in Git at e7fb94be36e13db1ff29d70a3e7ee3078f1e7f14` ·
   `AUTHORITY OBSERVED owner DECISIONS:60 and contract DECISIONS:49 present as exact ledger line bytes at the parent
   receipt base c081cbd under their own roles; contract inherited byte-equal from the parent; theme found in Git on
   refs/remotes/origin/rebuild/t2-client-core; brief acceptance found in Git on
   refs/remotes/origin/rebuild/t2-client-core` · `LAWS 45/45 executed` · 25 of 25 children OBSERVED exit 0 ·
   `COVERAGE 0/19 original gate(s) covered by 0 executed child(ren) ...; 9 SUPERSEDED under DECISIONS:527
   (defect-witnesses 1, inherited-carriers 3, second-gate 1, source-carriers 3, writers-differential 1) ...; 10
   re-execute under --full` · `SUPERSESSIONS 5 byte-identity carrier(s) of S7 SUPERSEDED over 9 gate(s) under
   DECISIONS:527, located on refs/remotes/origin/rebuild/t2-client-core BY ITS OWN SHA256 0c2d0db53471 [cut]` ·
   `AUTHORIZED STEP UNAVAILABLE SEALED-RUN-RECEIPT-ABSENT; the FULL run with the private census is required
   (DECISIONS:136 (3))` (first authorized run on this receipt) · `PRIVATE ORACLE PRESENT; verdict-only reporting [cut]` ·
   `HISTORICAL TOTAL 45 laws · 45 RED-frozen · 45 RED-candidate · 90 GREEN repair controls · 104/104 mutant executions
   DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST OBSERVED` · 10 LEGACY gates re-executed, all PASS ·
   `FULL EVIDENCE: 10 of the 19 original gates re-executed, 0 carried by successor children that executed in this run
   and 9 SUPERSEDED under DECISIONS:527, each replaced by this package's own executed evidence; second gate included` ·
   `SEALED RUN RECORDED rebuild/lanes/b/tooling/receipts/S8.json; artifact=3cf58e0edd76 spec=6fbbb1b901c2
   runner=e31dd206c0fb over 224 pinned product file(s)` · `POSTFIX PACKAGE PASS M2-S8-REAL-SHAPE`, exit 0.
5. `--full --package S8` at the head that carries the committed receipt and the moved coach constant (log
   `%TEMP%\s8-full4.log`): PENDING - filled in by the byte-identity terminal after the coach constant moves.

## Notes recorded on this seal
- The two `rebuild/lanes/d/p3-layout-v2` cells (`layout-v2.test.mjs`, `projector-parity.test.mjs`) are CI-homed by
  exact path in the pinned `.github/workflows/rebuild.yml`, but no package declares them and their root is not a
  `CHILD_ROOT` of the runner. `DECISIONS:524` ruled this a carried note rather than a second tooling round, because
  `:523` names only the `p3-real-shape` cells and minting a root, a child and two new declarations would have reopened
  the package. It is recorded here so the next reseal child declares that root.
- The comment in `.github/workflows/rebuild.yml` says the brief predicts the exact refusal. The brief predicts `R01`
  verbatim; it is `rebuild/lanes/b/S8-PREP-AUTHOR-REPORT.md` that names `RECEIPT-EXACT-LINE-MISSING`. That is
  `DECISIONS:524` N3 and it is corrected here, in prose, rather than by moving four pinned shas.
- `rebuild/lanes/b/tooling/packages/S8.json` cites this package's own three ledger lines one number low: it names the
  theme at `:524`, the brief-by-sha at `:525` and the gate-supersession token clause at `:526`, while those lines stand
  at `:525`, `:526` and `:527` on the chain branch. Every one of them is located by the runner by its own sha256, not by
  its number, and all three were found, so nothing in the seal rests on the numbers; they are corrected here rather than
  by moving the spec's pinned sha.
- Today-17 measure journey residual: chain A's first `--ci` with the pending review failed once on `P-MEASURE (a)` in
  `rebuild/m3/w7-preview/measure/test/journey.test.mjs` (681 of 682), the `DECISIONS:496` class. That file is green
  alone and green on re-run, and every run recorded above has `today-17` OBSERVED at exit 0.
- Carried from the accepted lane D rounds, none blocking, each read in the review file named:
  (a) `P3-LAYOUT-V2-REVIEW-R1.md`: the layout's `profile` is not tied to the producer's `rule_profile` in the law, so a
  v2 capture relabelled v1 reads under the v1 rules. It is unreachable in product, the performed slots are identical
  either way because the shipped law reads no `prescribed_load`, and the tie rides with whoever first carries a typed
  load onto the performed side.
  (b) `P3-LAYOUT-V2-REVIEW-R1.md`: `rebuild/m4/spec/configured-history-candidate/construct.cjs:6` patches the old
  one-profile string and will throw on the Unique projector edit. It is env-gated and in no bar row.
  (c) `DECISIONS:523`: `entry.load` is null for a configuration lift, which is the lane C design; the card still opens
  and the lift still prescribes.
  (d) `P3-REAL-SHAPE-REVIEW-R1.md` and `P3-REAL-SHAPE-REVIEW-R2.md`, restated at every round as asked: the identity
  trade. After this change the proof that an imported file is the owner's is the sealed file, the six words and his
  identity Yes. The per-lift id equality S7 kept was an accidental content guard that no fresh-start owner could
  satisfy. Kept under `DECISIONS:472 (a)` and `:521`, and told to the owner in plain words.
  (e) `P3-REAL-SHAPE-REVIEW-R1.md` and `P3-REAL-SHAPE-REVIEW-R2.md`: the programme digest changed shape and
  `listImports` on the owner's own installation was not re-verified, because no lane here may open it. It is verified at
  the owner's retry.
- The passphrase input accepts only the hyphen-joined form of the six words. That is a lane C copy and normalisation
  defect, noted at `DECISIONS:520`, queued, and deliberately not in this seal.

## What this seal carries for the athlete
An export in the OLD app's real shape is admitted as it is. Split entries that carry `from`, `map` and `why` are
admitted with the note kept; short lift handles are admitted as handles; a file with no athlete label is admitted and
takes the phone's own first-run label on adoption, while a file that names a DIFFERENT athlete is refused by that field
instead of silently failing to adopt; lifts with no increment and no ladder are admitted; bodyweight and hold loads are
admitted. And the file's own programme BECOMES the phone's programme: on adoption the file's lifts, names, muscle
groups, days, sets, rep targets, increments, ladders, tags, priorities and the whole split with its note replace the
setup document that was only ever a placeholder (option A, `DECISIONS:520` and `:521`). The same lift is decided by its
normalised name, a session logged on the phone before the import is re-keyed onto the file's lift with its loads, reps
and slot count unchanged, and every document lift that finds no match is kept, appended inactive and tombstoned, so
nothing the owner recorded is lost. Captured-lift layout v2 stands beside v1: every capture already on the phone stays
readable under v1, new captures are written under the configuration-profile producer, and a bodyweight raise or a hold
lift now prescribes instead of blocking the card. The deciding cell passes on BOTH days: the upper card ready with the
file's own total and handle ids, the lower card ready with the file's lower total and the bodyweight and hold lifts each
prescribing. The per-lift numbers stay retained from the file exactly as S7 earned them, and S7's field-named refusals
are carried unchanged, so every refusal still names the field and the lift and leaves the phone as it was. No engine
byte moves, and the only coach byte that moves is the revision constant, which moves once to name this seal.
