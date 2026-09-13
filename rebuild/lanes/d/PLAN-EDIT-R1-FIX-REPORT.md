# Plan-edit R1/R2 fix candidate

Lane D builder report, 2026-09-13. Independent review remains with the separate reviewer.
Branch rebuild/lane-d-plan-edit-r1; runtime fix 3694645; original reviewed 6b3465e and failing-test commit 7b073a8 preserved.
Responds to independent PLAN-EDIT-REVIEW.md at f355ccce4d3ac356f2c2567c8b22ca584edf44a2, findings R1 and R2.
Accepted brief under DECISIONS:195 remains byte-identical; no new scope, interface or custody requested.

## Changes

R1: save() authenticates the current generation before considering cached commit metadata, then verifies the exact intent is still active.
Closure, cancelled review, missing/changed intent and tombstone propagate a refusal. Cached metadata only identifies a proven historical commit.
The same active intent retains its original reply and operation ID; retry does not create another operation or outbox item.
Private review liveness is rechecked after asynchronous read/write/recovery boundaries, including cancellation during retry decryption.
R2: a local rejection index is not a disposition proof. Nonempty or malformed rejection collections now return PLAN_EDIT_REJECTION_UNPROVEN.
This companion's local installation has no authority-disposition admission path; hosted/imported rejection contexts remain unsupported and refuse.
The faulted records are retained unchanged. Authenticated tombstones still project their dated retraction; invalidated descendants still refuse.
One prior builder test incorrectly blessed a bare rejection index; it now demands refusal. No frozen engine/conform law or reviewer probe changed.
Runtime diff from 6b3465e: plan-edit-host.mjs +16/-2; plan-edit-model.cjs +6/-1. Commands, browser boundary, core and engine unchanged.
Runtime total: 500 lines in the same three modules; no store, authority, clock, dependency or workflow added.

## Executed proof

Before fix: two R1 durable witnesses and one R2 durable witness each fail by their named assertions on unchanged 6b3465e runtime.
After fix: same-tree companion 50/50, zero skipped; model26, durable22, browser graph/negative control2.
Mutation checks: model10/10 and host5/5 assertion kills; includes restoring the early cached reply and admitting an unproved rejection index.
Unmodified independent reviewer annex: 16/16 in D's own worktree, including I08/I09/I10 and all 13 retained controls.
Annex source Git-blob SHA256: 5662293f8c6f976c9ebbb1a8f19dbac4534744b085ac2ff1537cd76644732c7e; no assertion or fixture change.
It was materialized at a same-depth D scratch path for execution, removed afterwards, with exact source retained in .tmp.
Logs: .tmp/plan-edit-r1-red.tap, plan-edit-r2-red.tap, plan-edit-r1-final.tap, plan-edit-r1-independent.tap.
Mutation logs: .tmp/plan-edit-r1-model-mutants.log and plan-edit-r1-host-mutants-final.log; git diff --check passes.

## Handoff

Return the new exact head to the same independent reviewer; builder execution of its annex is not a revised independent verdict.
Fresh browser graph was built; the reviewer's earlier actual Edge result belongs to 6b3465e and is not claimed for this fix.
C real PE12/EW14/EW16, B successor/cumulative/private/receipt/rerun and exact-head Windows/Ubuntu CI remain open; :194 hold remains.
No private/source-history/seed/soak reads, new agent dispatch, acceptance line, merge, main push or deployment.
