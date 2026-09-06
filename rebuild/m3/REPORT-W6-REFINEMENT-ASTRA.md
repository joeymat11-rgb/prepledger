# W6-REFINEMENT v1.1 — ASTRA report

## What and why

Publishes `BRIEF-W6.md` v1.1 from `cd99918bea6e6a5b9c4d58a91e9985f7e345e71a`, the integration tip carrying accepted PRs #26/#27 and the committed Sol verdict/two ledger lines. Branch: `rebuild/m3-w6-refinement-v1-1`. Only the brief and this report change. This implements the four requested corrections and records the settled exposure; it builds no W6 code, changes no numbers and does not mark W6-REFINEMENT DONE.

| Requested correction | Published result and consistency edits |
|---|---|
| (a) ROLLBACK | `W < surviving W_last` explicitly invalidates/exhausts the restart allowance →20, including below numeric limits; not proof of expiry. Recorded default remains refusal until reconciled reconnect, subject to owner override. Observed elapsed, last-valid eligibility, state table and CLOCK case agree. |
| (b) LEASE-TIME BOUND | `max(surviving lease-time high-water, Thi + H)` is conditional on sufficient published W5 freshness/server-error/server-clock-rate assumptions. H after unproved restart is observed wall advance and can undercount; max cannot repair that. Missing sufficient bounds blocks CLOCK. W5 dependency, mapping, limits and gate agree. |
| (c) KNOWLEDGE-LOSS | Learned expiry/revocation/rejection lost after failed persistence is outside the owner's unproved-elapsed-time exception. W6-KNOWLEDGE-LOSS remains a HARD CLOCK blocker until the fence/recovery contract proves the required behavior; this refinement cannot waive it. RESTORE-BOUND is the accepted residual; LATE-CREATION is unchanged. |
| (d) STATE TABLE | Unestablished stored truth/integrity, including unavailable decryption/recovery, →18; independently known standing loss →17 for writes. Authenticated rejection is19 in-process; after failed persistence and relaunch the unresolved integrity/fence path is18 until re-proven. Sequence prose matches the split rows; B11 and17 >20 >3 remain unchanged. |

Sol point1's **complete numbered paragraph** is copied verbatim into Limits, including the 31-real-day kill and W0+1h reading. The exact source paragraph matches programmatically. No reopening of strict versus bounded. The retained numbers are 24 observed hours/64 slots;64 is only a client-policy cap, never a loss bound. Final millisecond/slot64 remain inclusive; the next edge refuses20. Version/status/base metadata and stale “Sol should choose” text were updated only to reflect the recorded verdict and pending cowork diff verification.

## Verification

Windows / Node24.19.0, real node_modules directory with unchanged pinned dependencies. The unchanged W3 tests ran with:

```text
node --test rebuild/m3/clock-spike/test/continuity.test.mjs rebuild/m3/clock-spike/test/core-witness.test.mjs
tests 39
pass 39
fail 0
SOL-POINT-1 VERBATIM PASS
DOC-ONLY SCOPE PASS: frozen/product/suite/soak/witness/dependency paths unchanged
```

These tests preserve the original red witnesses; they do not implement or pass the v1.1 CLOCK contract. A same-family read-only review found no missing requested correction or unrelated requirement change; cowork's independent diff acceptance remains required.

Required existing gates ran after AGENTS private preparation with explicit ENGINE_MAIN/ENGINE_OLD, MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York; strict used MEASURED_TEST_NOW unset. Only verdicts leave local custody; public pins restored. No new test, law, fixture, product code or runtime behavior was introduced.

```text
PUBLIC-ORACLE check PASS — 7/7 unchanged public oracle laws; private NOT RUN
PUBLIC-ORACLE sensitivity PASS — 9/9 unchanged public oracle laws; private NOT RUN
PUBLIC-CANDIDATE frozen PASS — 7/7 unchanged public oracle laws; private NOT RUN
PUBLIC-CANDIDATE native PASS — 7/7 unchanged public oracle laws; private NOT RUN
ENGINE-TRACK PASS — rig185 W1 PASS, W2 PASS on frozen engine; unchanged assertions
PRIVATE PREPARATION PASS
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
All checks passed. Safe to ship.
```

The public wrapper's private-NOT-RUN label describes that wrapper; the full suite/selftest ran separately after local preparation. The final line is the unchanged strict checker's verdict, not CLOCK or M3 release approval. PR-commit CI results are recorded in the PR once observed. `git diff --check` passes. No bite is needed for a documentation-only revision; the future implementation's required early-Saved bite remains unchanged in §3.

## Seams and uncertainty

W6 implementation can continue from published v1.0 requirements; transport binds only to the published W5 contract. CLOCK acceptance binds to v1.1 after cowork verifies this diff and still requires sufficient W5 time bounds and a proven knowledge-loss fence/recovery contract. No implementation or test here resolves those blockers. The recorded rollback default is preserved; no override is inferred.

QUEUE and DECISIONS are untouched: the source verdict/ledger already exist at the base, and cowork will record W6-REFINEMENT DONE after its check. Accepted v1.0/report evidence stays intact. Frozen app, engine, client/authority, current suite, W3 witnesses, seeded soak and dependencies/lockfiles are byte-identical to the base. Nothing private or secret is added. No merge.

## Wall-clock and NEXT

Work began 2026-09-06 05:56 UTC; document review and unchanged gates took approximately five minutes. Publication/CI and cowork acceptance are separate stages, reported in the PR.

NEXT: **W6-REFINEMENT** → cowork diffs v1.1 against recorded (a)–(d) and the verbatim point1, then records DONE. **W6** can continue independent storage work from published requirements; its transport and CLOCK gates retain the dependencies above. This PR claims no additional build or owner decision and does not duplicate the reserved W5/audit tasks.
