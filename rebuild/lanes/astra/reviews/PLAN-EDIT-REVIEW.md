# PLAN EDIT COMPANION: independent Astra review

Verdict: **REJECT candidate; two blocking findings / three executed observations.** Broader editor/package NOT READY.
Reviewer: separate Astra MAX task, no product authorship or integration custody.
Tested head: `6b3465efba4a9c4de1aace60ae3dc05b28b6e71d`, `rebuild/lane-d-plan-edit-f2`.
Bar: DECISIONS:176/:193/:195; exact brief `rebuild/lanes/d/BRIEF-PLAN-EDIT-COMPANION-v1.0.md`.
Brief Git-blob SHA256 `7f595443fa6bc4454ae687cbb5e6ff01290b2dc23ef7ce06b7b2c3c75fd81979`, 21161 bytes, independently verified.
Brief and executable candidate were examined first; builder report/rationale remains unread at this verdict publication.

## Blocking findings

**R1 / P1 — cached Save bypasses current refusal and exact-intent reconciliation.** `rebuild/m3/w6/host/plan-edit-host.mjs:134` returns `entry.result` before the authenticated read and `outcome()` active-status check. I08: a successful save followed by real installation closure makes `read()` refuse, while the same review's `save()` returns `acknowledged:true`. I09: a real T2-built, HMAC-authenticated, durably committed tombstone retracts that intent; the companion reads status `tombstoned` and the original 2 sets, but the same review's Save returns the cached 3-set acknowledgment. The original commit remains a true historical fact; the defect is using that cached result as the current save/retry outcome after the required context/status checks would refuse. Brief §5.9–10 requires authenticated exact-intent reconciliation and propagation of closure/refusal. Preserve idempotency without bypassing those checks.

**R2 / P1 — an unproved rejection silently removes a valid edit from the projection.** `rebuild/m4/workout/plan-edit-model.cjs:80` and `:83` treat any object at `collections.rejected[op_id]` carrying that `op_id` as a qualified rejection. I10 writes this single synthetic fault through the real encrypting repository; every operation byte/HMAC stays unchanged and there is no disposition proof. Actual host `read(nextDay)` succeeds, labels the saved intent `rejected` and changes 3 sets back to 2. Encryption proves the generation's integrity, not the authority of that rejection. Brief §5 requires only qualified inactive operations to be excluded. Reject an unproved status or prove its source; do not silently project it as truth. This witness is a controlled storage fault, not a claim that a public UI currently exposes rejection injection.

## Executed evidence

- Same-tree companion command: **46/46 PASS**, zero skipped/cancelled; model 26, durable host 18, browser graph 2. No construction-source override.
- Supplied model mutants: **9/9 killed**; supplied host mutants: **4/4 killed**, selected assertion failures; original runtime bytes unchanged.
- Independent annex: **13/16 PASS, 3 assertion failures**: I08/I09 (R1) and I10 (R2). No fixture/import/syntax failure in the final run.
- Passing independent controls cover 20 concurrent Save calls/one operation, cancel/close during encryption, midnight, lost acknowledgment, historical equal value plus before-commit failure, other-exercise stale review, HMAC tamper refusal, retained real factual writes, invalidated ancestors, same-date names, dated replacement order and operation-derived basis.
- Actual fresh Edge module import: **PASS**, 47 compiled inputs, exported host is a function, zero page errors; `__dirname`, `require`, `process` are absent. Bundle SHA256 `51c6f649dc4cab7cfbf5f0ad1acd965b9671ee0beee612febb6b8daaa1c304a6`. Browser/server closed. This is module import, not browser save or PE12.
- Dependencies: tracked W5/W6 pnpm locks, development dependencies included; W6 completed with lifecycle scripts disabled. No root install was needed. Setup command failures were corrected before the reported test runs and are not candidate failures.

## Not proved / required before broader acceptance

- Actual C future-gym state plus operation basis, preservation of open workout/check-in drafts, editor DOM and phone behavior: **PE12/EW14/EW16 pending C**, not satisfied by helper adapters.
- F1/B2 dependent evidence, final F1/F2 composition and B's cumulative profile/pins/private verdict/receipt/rerun remain external admission gates. No private, source-history, seed or soak fixture read.
- Exact-head Windows+Ubuntu command registration and full applicable CI remain B/PM work; local tests do not supply Ubuntu evidence. DECISIONS:194 integration hold remains.
- No product files changed, acceptance/receipt issued, merge, main push or deployment performed by this reviewer.

Executable witnesses, controls and rerun commands: `PLAN-EDIT-REVIEW-ANNEX.md`, `PLAN-EDIT-REVIEW-ANNEX.mjs`, `PLAN-EDIT-BROWSER-IMPORT.mjs` beside this report. D owns fixes on a new exact head; this reviewer retests before any revised verdict.

Post-publication check: builder PLAN-EDIT-CANDIDATE-REPORT.md was read only after review/annex commit f355ccc was published. Its 46-test and 13-mutant counts reproduce, and it explicitly holds C/B admission. It contains no evidence closing R1/R2; verdict unchanged.
