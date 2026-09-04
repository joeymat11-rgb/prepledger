# T3 bake-off — cowork's PRE-REGISTERED verification (written 2026-09-04 before either builder delivered)

Both branches get the identical treatment; the scorecard is fixed now so it cannot be bent to a result.

1. GATE (must): `node run.cjs` → authority 34 GREEN + soak 1 GREEN + client 35 GREEN, SUITE CONSISTENT, SELFTEST PASS;
   the suite's files byte-identical to the committed ones (sha256 over rebuild/conform minus adapters/authority.cjs).
2. INDEPENDENCE (must): product requires nothing under rebuild/conform; adapter never requires reference/*; product
   loads standalone; no test hooks in product code (grep for law ids, "mutant", "hook" names).
3. INTEROP RIG (rig190, must): T2 client + T3 authority via `localTransport`: (a) two devices of ath-1 each weigh in →
   syncOnce → outbox drains on the signed disposition → reduceThroughW → frontier === 2, receipts contiguous; (b) ath-2
   device isolated (frontier 1, its own log); (c) a client configured with a FORGED authority key → nothing drains,
   outbox intact; (d) replay: the same op sent twice → one log entry, same disposition bytes; (e) a lost
   acknowledgement (transport returns undefined once) → same op_id retried, then accepted once.
4. BITE CHECK (rig191, scored): TEN one-line breaks, one per rule family, applied to a COPY of each product, run through
   the real gate: replay appends a second entry · identity collision accepted · device_seq reuse accepted · cross-athlete
   reference accepted · child of a rejected parent WAITS forever · lineage key compared as strings · stale
   seen_conflict_basis applied · disposition unsigned · export not pinned to W · lease not_after ignored in the local
   committer. Score = breaks caught by the gate (out of 10); any break the gate misses is a SUITE GAP (recorded for v4),
   not a builder point.
5. SEAMS (scored, lower is better): count of test-shaped seams the report lists; count cowork finds that the report
   omits (honesty penalty ×2).
6. SIZE AND SHAPE (informational): product lines, module count, store-interface realism (could a D1 backend implement it
   without changing the core?), clock injected or not, any Node-only API in the core.
7. COST (informational): wall-clock and tokens as reported by each builder; cowork's own verification time per branch.
8. REVIEWERS: both reports go to Sol and Grok BLIND as builder A / builder B (labels randomised), one consolidated file,
   with the scorecard withheld until their verdicts return.

Ruling: the owner rules on the scorecard; the winner builds M2 module 1; the loser's branch is kept, never deleted.
