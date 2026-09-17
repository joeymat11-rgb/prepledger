# VERDICT - M2-S6-TODAY-CHILD · lane B seal · PASSED on the `DECISIONS:500` receipt

Branch `rebuild/b-s6-today-child`, worktree on the owner's Windows PC (node v24, `TZ=America/New_York`,
`MEASURED_TEST_NOW=2026-09-03`), executed there under `DECISIONS:495`, `:496`, `:498` and `:499`. Head commit
`29181ae44a6c073bd02c83f208b878a08b76af0d` (review ACCEPTED, tip merged); the chain tip `934321f443ec55a2fdc283dffc48b3044a0337f1`
(receipt base) is an ancestor of this head, so the seal base is on the tip (rule=ancestor, `DECISIONS:135 (4)`). sourceBase
`0635f4b6`. No private value, count, hash or prose appears in this file. The PASS word below is the runner's, earned on the
FULL run against `DECISIONS:500`.

## Authority
- Brief `rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md`, sha256 `8a9a63ee49b5a95260c0102ec937f0d5558e979b75fc3b9da39368c0e4dd2d1d`
  (41900 B), accepted by name at `DECISIONS:487` and by sha at **`DECISIONS:489`**; theme **`DECISIONS:488`**; standing ruling
  `:455`, custody ruling `:473`, merge order `:484` as extended by `:486 (c)`. Gate supersession: the standing role
  `DECISIONS:153` granted by the token clause **`DECISIONS:490`** (RULED), the spec's `coverage.superseded.rulingLineSha256`,
  located on the chain branch by its own bytes (`f2e3fe7412f2...`).
- Parent (single, immutable): `rebuild/m4/spec/acceptance-s5-today-child.json` sha256
  `84e3430ddd851965d630cecffe4bf7ead88ec10ed53635c503671fd616c1169e`, receipt `DECISIONS:466`, reviewed at `5c4240e0`.
- Receipt of record: **`DECISIONS:500`** at `934321f443ec55a2fdc283dffc48b3044a0337f1`, carried by
  `rebuild/m4/spec/review-s6-today-child.json` as `{status: "ACCEPTED", receipt: {commit, path, line, lineSha256}}`
  (lineSha256 `dfbae0989cdc8348d16798314bb1c909fd1b8fef76869c1298b372b19e5e70b1`). The earlier receipt `DECISIONS:497`
  (artifact `be87e8b8...`) is SUPERSEDED by `:498`: its standing CI step flip came after the seal; it names nothing sealed.
- Judgments: `DECISIONS:493` (round 1), `:495` (round 2), `:496` (round 3, FULL-scope pin), `:498` (the seal-chain findings),
  `:499` (rounds 4 and 5, the seal-window rules).
- Independent reviews: Opus r1 `rebuild/lanes/b/S6-REVIEW-R1.md` (REJECT, closed in round 2); Opus r2 `S6-REVIEW-R2.md`
  (ACCEPT); Fable final `S6-REVIEW-R4.md` (ACCEPT, 0 BLOCKING / 0 MAJOR); Fable re-check `S6-REVIEW-R5.md` (ACCEPT, round 3);
  Fable re-check `S6-REVIEW-R6.md` (ACCEPT, rounds 4 and 5, scope b75e655..8493903 exactly the named paths).

## The evidence hashes this seal stands on
- Artifact `rebuild/m4/spec/acceptance-s6-today-child.json` sha256 **`0e52357ed62249d4ee94b473e2dde20220b0a82c3737414bba0603fa76bf040f`** (80625 B).
- Spec `rebuild/lanes/b/tooling/packages/S6.json` sha256 **`2415c473b090e808acd7b5f646e11e9b9ae28883a1ccb1974d938afbe825be57`** (84803 B).
- Runner `rebuild/lanes/b/tooling/b-package.cjs` sha256 **`8d9a94c20faa2e856db3e3bf9f9aea8e835516307c6b7c5c95b51a0b0c49a385`** (254952 B).

## Sealed-run receipt (`DECISIONS:136 (3)`)
`rebuild/lanes/b/tooling/receipts/S6.json` sha256 **`5bff018d56223d9876c6e5600616e7c52550343daded088bc2dd95fdae7ba4c1`**
(24760 B), written by the runner itself on the terminal branch of the FULL run that earned `POSTFIX PACKAGE PASS M2-S6-TODAY-CHILD`
(exit 0) on the PC with the private fixture in place, and committed unmodified. Its `sealedRun` block carries the three
hashes above, `envelopeKey ACCEPTED:...`, this verdict file by name and the 196 pinned product shas. With these bytes
in Git and this sha256 named here, the `:136 (3)` byte-identity step is AVAILABLE. The coach constant moves to
`M2-S6-TODAY-CHILD@5bff018d56223d98` in the commit after this one; the standing CI step already names S6 inside the package.

## Terminals - executed on the PC, exit codes measured
1. `--full --package S6` at `a32e606e` (round 2 head plus the tip, review absent): 20 of 23 children OBSERVED, then
   `FAIL CHILD-REQUIRED-EXIT-ZERO` on `w6-local-source` (cell P2-W1 pinned the public oracle scope; `DECISIONS:496`), exit 1.
2. `--full --package S6` at `d4ed1413` (round 3, review absent): all 23 children OBSERVED exit 0, `PRIVATE ORACLE PRESENT`
   (verdict-only), `HISTORICAL TOTAL 45 laws · 45 RED-frozen · 45 RED-candidate · 90 GREEN repair controls · 104/104 mutant
   executions DETECTED · 0 HARNESS_ERROR`, `POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation(s)`, exit 2.
3. `--full --package S6` at `3d4529ce` under the superseded receipt `:497`: `POSTFIX PACKAGE PASS`, exit 0, then the
   byte-identity run refused `WORKTREE-SOURCE-PIN` because the standing CI step had been flipped AFTER the seal (`:498`);
   that receipt and its `receipts/S6.json` were withdrawn; nothing from it stands.
4. `--full --package S6` at `23575c0f` (round 5 head plus the tip, review absent): all 23 children OBSERVED exit 0
   (m4-import-production included, under the seal-window rule), `POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation(s)`, exit 2.
5. `--full --package S6` at `29181ae4` (review ACCEPTED on `:500`, tip merged): `POSTFIX M2-S6-TODAY-CHILD AUTHORIZED mode=--full` ·
   `SEAL BASE ON THE TIP` · `ENVELOPE AUTHORIZED artifact=0e52357ed622... reviewed at 23575c0f1e61...; receipt base
   934321f443ec...` · `PARENT PINS RE-ASSERTED` (2 + 114 product pins, 1 grandparent pin, byte-identical on disk AND in Git) ·
   `LAWS 45/45 executed` (declared-state; NO-REGISTER OBLIGATION 12 of 12) · 9 gates SUPERSEDED under `DECISIONS:490` ·
   `AUTHORIZED STEP UNAVAILABLE SEALED-RUN-RECEIPT-ABSENT` (first authorized run on this receipt) · 10 LEGACY gates re-executed ·
   `SEALED RUN RECORDED rebuild/lanes/b/tooling/receipts/S6.json` · `POSTFIX PACKAGE PASS M2-S6-TODAY-CHILD`, exit 0.
   Verdict words only; the private oracle is reported by the runner as verdict-only.

## Rules this seal established for every reseal after it
- The standing CI step names the new package INSIDE the package's own post, before `proposed()`, never at the fast-forward.
- A cell that recomputes the engine revision from the standing package's receipt reads the SEALING WINDOW (the parent seal
  while the standing receipt does not exist yet); the trip-wire stays as sharp as before once the receipt exists.

## What this seal carries for the athlete
A fresh install opens on setup first (`DECISIONS:463`), the sample athlete is labelled, the late-evening header is fixed and
the build footer shows (c-s6-small); the Import screen on Today and on Measure, only after setup is saved, with the identity
question before custody and a clean retract on every refusal (P3-IMPORT-UI-2); the replay families for measure, sleep and every
page writer, the pre-import workout admitted through F3, and B-LOM so the day after an imported history opens with the right
prescription (lane D, folded in by `:486 (c)`); the Windows CI flake's cause fixed in the measure journey cells; the runner's
child-tail diagnostics (b-s6-child-tail); and custody of 81 first-declared files across the `:473` hole. No engine byte moves.
