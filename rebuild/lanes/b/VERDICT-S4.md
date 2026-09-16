# VERDICT - M2-S4-REAL-DAY · lane B seal · PASSED on the `DECISIONS:449` receipt

Branch `rebuild/b-s4-real-day`, worktree on the owner's Windows PC (node v24, `TZ=America/New_York`,
`MEASURED_TEST_NOW=2026-09-03`), executed there under `DECISIONS:448`. Head commit
`351079c363551e556b5c8a17e30708411a320237` (review ACCEPTED, tip merged); the chain tip `03afc18192455aa5cc51695fc5fb2d4c98a23c29`
(receipt base) is an ancestor of this head, so the seal base is on the tip. sourceBase `f84e694`. No private value, count,
hash or prose appears in this file. The PASS word below is the runner's, earned on the FULL run against `DECISIONS:449`.

## Authority
- Brief `rebuild/lanes/b/S4-REAL-DAY-BRIEF.md`, sha256 `5f1ee6f36c1d59087ef12a5819cbf338347e4dc0529ad6954630ea32e434bc09`
  (12244 B), accepted by name at `DECISIONS:440` and by sha at **`DECISIONS:442`**; theme **`DECISIONS:441`**; owner `:60`;
  contract `:49` byte-equal to the parent's. Gate supersession: the standing role `DECISIONS:153` granted by the token
  clause **`DECISIONS:444`** (RULED), the spec's `coverage.superseded.rulingLineSha256`, located on the chain branch by
  its own bytes (`a1d96976ed87...`).
- Parent (single, immutable): `rebuild/m4/spec/acceptance-s3-companion.json` sha256
  `fb2f6a023ac6bcfc584c115078b16fb8ec21eba3a71c1c231c573d52dbab74f2`, receipt `DECISIONS:423`, reviewed at `ee8fdbbb`.
- Receipt of record: **`DECISIONS:449`** at `03afc18192455aa5cc51695fc5fb2d4c98a23c29`, carried by
  `rebuild/m4/spec/review-s4-real-day.json` as `{status: "ACCEPTED", receipt: {commit, path, line, lineSha256}}`
  (lineSha256 `e59e328cff220b3698f35b24e78c7115d93873f7e3a5b45dc3da662421db14da`); judgment `DECISIONS:448`.

## The evidence hashes this seal stands on
- Artifact `rebuild/m4/spec/acceptance-s4-real-day.json` sha256 **`12779767123e5b0983bcce4028c2c3213b0a6bf05a1661909ee5949f96d8a972`** (44303 B).
- Spec `rebuild/lanes/b/tooling/packages/S4.json` sha256 **`b2eb5eb8ef42d45063eea440319f4e5fde1b4a0c8aa55eaa5ac500e3f6edd4f5`** (42919 B).
- Runner `rebuild/lanes/b/tooling/b-package.cjs` sha256 **`422d1e9fd5174047a2eb5f92845826e22023d6d297a54e7a6a796f6824e20340`** (234590 B).

## Sealed-run receipt (`DECISIONS:136 (3)`)
`rebuild/lanes/b/tooling/receipts/S4.json` sha256 **`171ebcd4d4b3b2b43707d681cf0511c9eb9d609e3fc32e699a94d88ff7f5dcc1`**
(11559 B), written by the runner itself on the terminal branch of the FULL run that earned `POSTFIX PACKAGE PASS M2-S4-REAL-DAY`
(exit 0) on the PC with the private fixture in place, and committed unmodified. Its `sealedRun` block carries the three
hashes above, `envelopeKey ACCEPTED:...`, this verdict file by name and the 90 pinned product shas. With these bytes
in Git and this sha256 named here, the `:136 (3)` byte-identity step is AVAILABLE.

## Terminals - executed on the PC, exit codes measured
1. `--full --package S4` at `351079c` (review ACCEPTED, tip merged): `POSTFIX M2-S4-REAL-DAY AUTHORIZED mode=--full` ·
   `ENVELOPE AUTHORIZED artifact=12779767123e... reviewed at e0c4e3c949a5...; receipt base 03afc18192455aa5...` ·
   `LAWS 45/45 executed` (declared-state; NO-REGISTER OBLIGATION applies) · 9 gates SUPERSEDED under `DECISIONS:444` ·
   `AUTHORIZED STEP UNAVAILABLE SEALED-RUN-RECEIPT-ABSENT` (first full run) · 10 LEGACY gates PASS ·
   `SEALED RUN RECORDED rebuild/lanes/b/tooling/receipts/S4.json` · `POSTFIX PACKAGE PASS M2-S4-REAL-DAY`, exit 0.
   Verdict words only; the private oracle is reported by the runner as verdict-only.
