# VERDICT - M2-S3-COMPANION · lane B seal · PASSED on the `DECISIONS:423` receipt

Branch `rebuild/b-s3-companion`, worktree on the owner's Windows PC (node v24, `TZ=America/New_York`,
`MEASURED_TEST_NOW=2026-09-03`), executed there under `DECISIONS:417`. Artifact commit
`ee8fdbbb3045999ba15d70e86c36684c73611668`; the chain tip `601ced4899ff5b4a4ee69ce348ee6493bd6121ea` (receipt base,
docs-only past `2ea42e8e`) merged at `125a5e6` so `ee8fdbbb` stays an ancestor and the seal base is on the tip
(H3 precedent `b111615e`). sourceBase `2ae28401d65453dc59c68a9a804e32dda44a8d83`. No private value, count, hash or
prose appears in this file. The PASS word below is the runner's, earned on the FULL run against `DECISIONS:423`.

## Authority
- Brief `rebuild/lanes/b/M2-S3-COMPANION-BRIEF.md` v1.3, sha256 `d366386f72f69d76426a4e4a1d5e636bcbfbdf20ff934903f7fb2aec6dfc8352`
  (15151 B), accepted by name at `DECISIONS:418` and by sha at **`DECISIONS:420`**; theme **`DECISIONS:419`**; owner `:60`;
  contract `:49` byte-equal to the parent's. Gate supersession: the standing role `DECISIONS:153` granted by the token
  clause **`DECISIONS:421`** (RULED), the spec's `coverage.superseded.rulingLineSha256`, located on the chain branch by
  its own bytes (`21252b845fb6...`).
- Parent (single, immutable): `rebuild/m4/spec/acceptance-h3-clean-init.json` sha256
  `b457b539a384d8c72531b880cd771e996c6b231f034a49272e899c1fba61e61f`, receipt `DECISIONS:187`, reviewed at `5f0c3781`.
- Receipt of record: **`DECISIONS:423`** at `601ced4899ff5b4a4ee69ce348ee6493bd6121ea`, carried by
  `rebuild/m4/spec/review-s3-companion.json` as `{status: "ACCEPTED", receipt: {commit, path, line, lineSha256}}`
  (lineSha256 `8b3ff9636f064eb31909623f91b3dfcb8908d3e643534d60af57c00c4c7f0a81`); judgment `DECISIONS:422`.

## The evidence hashes this seal stands on
- Artifact `rebuild/m4/spec/acceptance-s3-companion.json` sha256 **`fb2f6a023ac6bcfc584c115078b16fb8ec21eba3a71c1c231c573d52dbab74f2`** (39692 B).
- Spec `rebuild/lanes/b/tooling/packages/S3.json` sha256 **`8f0452feb525228073ea58af50c4bee1f61518d04bb384029fc79e84155f3642`** (38502 B).
- Runner `rebuild/lanes/b/tooling/b-package.cjs` sha256 **`c8668d797559500496b65cbf796f63ae8d7256e3f310a8445e30d1e3890f8864`**.

## Sealed-run receipt (`DECISIONS:136 (3)`)
`rebuild/lanes/b/tooling/receipts/S3.json` sha256 **`1c73d5d44d482301fd9fa388555e5691853f5eb5cf6161481553bc91dd22be5b`**,
written by the runner itself on the terminal branch of the FULL run that earned `POSTFIX PACKAGE PASS M2-S3-COMPANION`
(exit 0) on the PC with the private fixture in place, and committed unmodified. Its `sealedRun` block carries the three
hashes above, `envelopeKey ACCEPTED:...`, this verdict file by name and the 74 pinned product shas. With these bytes
in Git and this sha256 named here, the `:136 (3)` byte-identity step is AVAILABLE.

## Terminals - executed on the PC, exit codes measured
1. `--ci --package S3` at `ee8fdbbb`: `B PACKAGE S3 PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict; ...`, exit 0; all 13 declared children OBSERVED.
2. `--full --package S3` at `68dee36f` (review ACCEPTED, tip merged): `POSTFIX M2-S3-COMPANION AUTHORIZED mode=--full` ·
   `ENVELOPE AUTHORIZED artifact=fb2f6a02... reviewed at ee8fdbbb...; receipt base 601ced48...` · `LAWS 45/45 executed` ·
   `AUTHORIZED STEP UNAVAILABLE SEALED-RUN-RECEIPT-ABSENT` (first full run) · `SEALED RUN RECORDED rebuild/lanes/b/tooling/receipts/S3.json` ·
   `POSTFIX PACKAGE PASS M2-S3-COMPANION`, exit 0. Verdict words only; the private oracle is reported by the runner as verdict-only.
The author report `rebuild/lanes/b/M2-S3-COMPANION-AUTHOR-REPORT.md` carries every earlier tail.
