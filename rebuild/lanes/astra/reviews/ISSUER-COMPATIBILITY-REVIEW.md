# Astra issuer compatibility — independent review

Verdict: **REJECT / R1 open** for candidate `f047b5b15463044eec299696b3f470859e476134`, branch `rebuild/astra-issuer-compatibility`. Separate Astra MAX reviewer, 2026-09-13 00:58 ET. B is the author; Astra PM judges; this reviewer issues no PM acceptance or integration permission.

The six-path tooling change follows the allowed file scope, but the new Astra grandparent-receipt path does not meet the exact acceptance contract in DECISIONS:198 and its mandatory acceptance bar.

## R1 / P1 — Grandparent receipts bypass the exact acceptance payload

At `rebuild/lanes/b/tooling/b-package.cjs:1651`, `pins()` calls `pmReceipt()` with only the grandparent artifact path and hash as content mentions. `pmReceipt()` proves issuer, exact ledger-line bytes and handover/context ancestry. It does not parse a POSTFIX-ACCEPTANCE payload. Unlike `option()` and `envelope()`, the grandparent caller never follows it with exact package, reviewed-commit, artifact/hash and ACCEPTED-terminal verification.

Independent I04–I06 execute a valid synthetic Astra parent and grandparent through the actual `option()` and `pins()` first. They then commit a replacement grandparent receipt on that same synthetic chain, keeping the handover, issuer, artifact/hash and parent's accepted option valid. Actual `option()` still verifies the parent. Actual `pins()` returns successfully for all five invalid grandparent claims: terminal REJECTED, PENDING, ACCEPTED-BY-NAME; a different package id; and an all-zero nonexistent reviewed commit. Each expected-refusal assertion fails with ERR_ASSERTION / Missing expected exception, not a fixture or parser error.

The `status: ACCEPTED` field in the review JSON therefore substitutes for the missing machine acceptance. This is an existing weak grandparent check carried into the new issuer path, not a claim that this patch introduced every part of the weakness. It fails the explicitly required own/parent/grandparent acceptance bar for the candidate.

Required correction: enforce the exact accepted grandparent payload and its reviewed artifact/commit binding, preserving historical receipts and the new authority fences. Add actual-path negative controls and a source-mutant control. B authors the fix on a new exact candidate; this reviewer does not implement it.

## Executed evidence

- Accepted brief read before implementation/report: `f669669b04856ac9065e7d2eecf79cfe285aa315`, SHA256 `dce98625f3374d8dcb57210bf2e311113b1df62dea1f50fff39877b753eaec9c`, 6,534 bytes; DECISIONS:198 and the PM acceptance bar also read first.
- Exact runner SHA256 `b4fcb039e08a1e9eb55571a1940eb0867a48dc936b1b22f6cf21ff24e7abdd0b`, 231,640 bytes. Candidate runner and fixture disk bytes equal their Git blobs.
- Four permitted candidate suites: **88 tests, 88 pass, 0 fail**, exit 0, 270,143.6605 ms. This includes the actual spec/authority/option/pins/envelope paths, nine source-mutant controls and the old-role red control.
- Independent annex: **12 tests, 7 pass, 5 fail**, exit 1, 71,753.0202 ms. The five failures all reproduce R1. The seven passing controls include the unchanged production runner against real public authority/history/parent records, receipt-context corruption despite a restored tip, pre-handover line position, duplicate exact claims and payload-role forgery.
- Commands, fixture method, hashes and the executable reproducer are in `ISSUER-COMPATIBILITY-REVIEW-ANNEX.md` and `.cjs` beside this report. No candidate runtime, test, helper, accepted artifact or receipt was edited. `git diff --check` is clean.

## Limits and disposition

All execution stayed in a new public sparse reviewer tree under `work/pm-caretaker/review-issuer-compatibility`; TEMP/TMP also pointed inside that tree. All synthetic Git scratch directories were closed and removed by their bounded test cleanup. No private data, historical engine construction, H3/full gate, workflow, product code, phone or companion test was executed or changed.

This proves an invalid receipt passing the affected `pins()` stage; it does not claim a forged production PACKAGE PASS. The candidate's 88 green tests do not close R1. No tool adoption, old-seal reuse, successor package acceptance, product integration or release follows. DECISIONS:194/198 successor FULL, pins, registration/CI, private verdict, receipt/rerun and third-integrator requirements remain open. The builder report remains unread at this independent verdict.

Post-verdict read: after publishing the independent verdict at `ada12bbc6f9ad5e0943bae9e92931108e683a2b8`, I read the exact candidate's builder report and README change. Its measured 88/88 matches my execution. Its general claim that ACCEPTED-BY-NAME never satisfies machine acceptance is too broad for the grandparent path, as R1 demonstrates. This read changes neither the finding nor the verdict.
