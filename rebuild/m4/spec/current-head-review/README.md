# Current-head contract review evidence

NON-SHIPPING. Opus 5 / High / fast off reviewed the exact public proposal
`../current-head-contract-v2.md` (SHA256
`0f8e8c10ca0766b0ce875ab3fd11926056756f5240f180d4c468440e7a6201f1`).
Its later verdict, preserved unchanged in `AMENDMENT.md`, is **ACCEPT AS PROPOSED
CONTRACT TEXT**. This supersedes the proposal's original NOT ACCEPTED header only
for text review. It grants no implementation, schema, CLOCK, private-use or
integration acceptance. The proposed mode still does not exist.

Source basis: PR46 `5e6d86e8c91f18ecde036515e4afed241f9ac3b9`; integration
`28ff3be3a0c47fa76b642015ac3757da5c76548c`. The reviewed W5 worker, public client,
crypto, bridge and WIRE files are byte-identical at those revisions. Publication
does not change them. Run these unchanged reviewer scripts from the repository
root with Node; `.` supplies this public checkout, never a private fixture:

```sh
node rebuild/m4/spec/current-head-review/current-head-challenges.cjs .
node rebuild/m4/spec/current-head-review/bridge-revision-witness.cjs .
```

Required observed lines on the reviewed source:

```text
W5 CURRENT-HEAD CHALLENGE SUMMARY: 8 claims; 8 confirmed; 0 not confirmed
BRIDGE WITNESS: 4 claims; 4 confirmed; 0 not confirmed
```

Both exited 0 in the independent reviewer environment and the author's unchanged
Windows replay. The first uses actual consumer verification/signing with per-run
synthetic keys, callback stubs and one disposable verifier mutant. The second uses
the actual bridge with a synthetic D1/core stub to observe read revision assertions,
stale retry and binding refusals. Neither is real D1/HTTP/IndexedDB/phone evidence.
No new current-head mode, its nine future cases, or issuance reducer is tested here.

## Provenance and corrections

Retained review session: `session_01SAJZorAhzfSEv3oE6xibr9`, same bounded assignment,
no model switch. Original archive: 7,942 bytes, SHA256
`d923cf8e63b9406c1ae746312f73f008f7c3d1f035d2c7807533fd97a996566f`.
Amendment archive: 4,980 bytes, SHA256
`3b26b2b08a715847fd5818faf144b54c5d39b686e35ce366cc70726151d3b027`.
All four original and three amendment manifest entries independently verified.
Both archives, original CHANGES-REQUIRED verdict, manifests and replay logs remain
in the coordinator's existing handoff; no original finding was silently rewritten.

Published original-byte SHA256 pins:

| File | SHA256 |
|---|---|
| current-head-challenges.cjs | 190fe30f3dd334e97a0217e6a2d85e55fd4c4f9172cb315a27dcaa6198e75ce4 |
| bridge-revision-witness.cjs | c2d6bbcb21976c548655125a0bf60461b39ec054dcfd02098d165b3f6e285d7b |
| AMENDMENT.md | f7e131242a9520faad1a443eeaea8ec6da7279b215acaf4582ed9963314dfb70 |

The reviewer withdrew its nonexistent-server-guard claim after executing the full
bridge call chain. Its cited WIRE line47 was a signature-domain table row; actual
local sink serialization/CAS is line23. Server and client revisions stay distinct.
Its unrestricted proof-reuse wording was narrowed to the captured issuance attempt;
Q3 offline answers and the existing OPEN Q1 reuse decision remain unchanged.

Publication clarifications permitted by the reviewer, with no semantic edit to the
preserved proposal: use existing `409 FRONTIER_AHEAD / state18` for after beyond
head (`worker.cjs:90`, `WIRE.md:12,31`); reserved-profile refusal covers a producer
signing that field under a legacy domain. The original D1 challenge has challenge,
head and purpose but no `history_profile`: it illustrates the domain-reuse risk,
not execution of the future reserved-profile guard. Its C1/C2 alter RESPONSE bytes;
they do not execute the separate nonce-only-on-REQUEST disproof. The latter rests
on producer inspection and the retained author's actual-handler diagnostic.

One author coordinate in v2 says PR46 brief §2; the intended currentness paragraph
is §1, line115 at 5e6d86e. This corrects a citation only. Exact reviewed text remains
unchanged for reproducibility. No new rule or gate follows from these notes.
