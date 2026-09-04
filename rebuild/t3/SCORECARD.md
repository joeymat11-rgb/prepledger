# T3 bake-off — SCORECARD (cowork, 2026-09-04; scored against RIGS-PREREGISTERED.md, fixed before either delivery)

Builder CLAUDE = Claude Code, branch rebuild/t3-authority-claude @ 0c3e7ce.
Builder ASTRA  = Codex / GPT-6 Astra, branch rebuild/t3-authority-astra @ 9034025.
Both branches were checked out fresh, engines rebuilt, private/live.json regenerated from `git show a0009c3:ledger/state.json`,
and every rig below was RUN by cowork — nothing here is taken from a builder's report unless marked "reported".

| # | Item (must / scored / info)          | CLAUDE                                   | ASTRA                                     |
|---|--------------------------------------|------------------------------------------|-------------------------------------------|
| 1 | GATE (must)                          | 34+1+35 GREEN · CONSISTENT · SELFTEST PASS | 34+1+35 GREEN · CONSISTENT · SELFTEST PASS |
| 2 | INDEPENDENCE (must)                  | clean (node:crypto only; no conform refs; standalone load; no hooks) | clean (same) |
| 3 | rig190 INTEROP (must)                | 9/9 PASS                                 | 9/9 PASS                                  |
| 4 | rig191 TEN BREAKS (scored)           | 10/10 BITE                               | 9/10 BITE — the one NO-BITE (B1 replay) was probed and is INEFFECTIVE: its later accept path is idempotent (1 log entry, identical disposition), so the break never changed behaviour. Effective score 9/9. Not a suite gap. |
| 5 | SEAMS (scored, lower better)         | listed 11 (a–k) · cowork-found omission **1** → penalty 2 → **13** | listed 9 · cowork-found omissions **0** → **9** |
| 6 | SIZE / SHAPE (info)                  | 637 lines · 10 modules · store = createStore(backend) with transaction(fn) rollback — D1-implementable · clock injected · no Node-only API in core · adapter imports only ../lib/ops.cjs | 898 lines (report says 998) · 11 modules (+validate.cjs) · store = copied rows, staged writes, rollback, README specifies the D1 bridge — D1-implementable · clock injected · no Node-only API in core · adapter imports product internals (store.copy, crypto.signLease/verifyLease/signServerTime) |
| 7 | COST (info, reported)                | ≈43 min incl. ~30 min reading (build 13 min) · ≈230k tokens | ≈18 min incl. reading · tokens not exposed |

## The seam CLAUDE's report omits (item 5)
`plan.cjs:14  const DEFAULT_PLAN = { protein_g: 150, steps: 8000 };` — the A5 undo law's fixture plan is baked into the PRODUCT and
handed to every new athlete (`index.cjs:23`). ASTRA moved the same value into the adapter and says so ("an empty account receives no
fabricated prescription"). A test constant in product code is exactly what item 5 was written to catch; CLAUDE's report lists 11 seams
and this is not one of them.

## One security difference, verified by probe (not a pre-registered item; recorded for the owner)
An op for ath-2 sent under a lease bound to ath-1: CLAUDE → ACCEPTED (its report DISCLOSES this as seam j and blames the suite fixture,
correctly — finding 6a); ASTRA → REJECTED LEASE_FORGED (it rebinds the broken fixture lease in its adapter and enforces the binding in
the product). Same suite defect, two responses: CLAUDE conformed to the fixture and documented it; ASTRA fixed around it and enforced.

## Reading
Musts: tie. Breaks: tie in effect (10/10 vs 9/9 effective). Seams: ASTRA wins (9 vs 13, and the honesty penalty is CLAUDE's).
Shape: CLAUDE is smaller and its adapter is cleaner; ASTRA enforces athlete binding at the authority and ships a validate.cjs and a
written D1 bridge spec. Cost: CLAUDE faster; ASTRA's tokens unknown.
cowork's recommendation to the owner: ASTRA on the pre-registered scorecard, by the seams item — with the note that CLAUDE's suite
findings 6a–6g are the more valuable review of the SUITE and go into v4 regardless of who wins.
Verification time (cowork): ≈35 min per branch.
