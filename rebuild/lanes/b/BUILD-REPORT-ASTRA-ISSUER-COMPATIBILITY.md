# Astra issuer compatibility: builder report

Candidate: rebuild/astra-issuer-compatibility, based on6a76afb. This is the six-path tooling candidate containing this report, not an engine package or H3 reseal.
Authority: DECISIONS:198; accepted brief atf669669 and mandatory astra/ISSUER-COMPATIBILITY-ACCEPTANCE-BAR.md were read before implementation. Old B work remains preserved/unknown.

## Changed behavior
- New PM claims require the case-exact Astra PM ledger header. Cowork is accepted only for exact historical claim bytes already present at the immutable193 handover, including later inherited contexts.
- Runner pins actual handover commit, owner-line position/hash and approved-document hash. Every use re-reads anchor/current-chain evidence; Astra additionally requires a valid descendant receipt context and a new line after the handover. No spec/env authority override exists.
- Applied to actual spec brief/theme/freeze, authority, own acceptance, parent option, grandparent pins and freeze escape. Owner/contract retain original roles/hashes; exact original receipt helper is unchanged.
- PM acceptance role is separate from independent reviewer identity. ACCEPTED-BY-NAME is not machine ACCEPTED; payload role words, aliases, new cowork lines and historical void Astra claims refuse.
- Existing product-phase/seal fixtures now carry a synthetic immutable handover. New freeze claims use Astra PM; old historical claims remain cowork. Existing behavior assertions are retained, including stale-tip, source/pin/receipt/verdict drift and owner/contract controls.

## Executed evidence
- Local Windows, Node24.19.0, final focused suite88/88,0failed,0skipped,0cancelled;276562ms. Named four-file invocation below, real temporary Git histories; no authority/Git/profile/pin function mocked and no full gate entered.
- Actual spec -> authority -> option/pins -> envelope positives cover Astra and mixed historical claims, historical and Astra parents, and Astra grandparent inheritance.
- Negative actual-path controls cover new cowork brief/theme/freeze/own/parent/grandparent claims, wrong/missing/ambiguous/payload roles, changed/moved/duplicate handover, copied authority without real anchor, off-chain receipt contexts, void old Astra, wrong hash/path/content/terminal and unchanged owner/contract/pin refusals.
- Nine source mutants lose the intended negative assertion: historical fence; anchored header; owner-line pin; document pin; unique owner line; real-anchor ancestry; receipt-context ancestry; pre-handover Astra epoch; declared PM review-role binding. All have a valid initial synthetic Astra spec. The historical-fence mutant additionally restores the valid claim after its negative control.
- One restored legacy guard reproduces the original defect at actual spec(): new Astra brief is refused by the old cowork-only claim. This is a controlled regression probe, not a claim that the old entire gate ran.
- Production handover coordinates were checked against real public Git blobs; frozen original helper files were compared with193 bytes. No private fixture/history blob was read by these tests.
- Initial run66/68: two old freeze-fixture cases replaced their whole ledger and removed the new synthetic handover; changing that setup to append retained the original assertions. Final rerun includes the added source mutants; no assertion skipped or relaxed.

Command: node --test --test-reporter=tap rebuild/lanes/b/tooling/test/astra-issuer-compatibility.test.cjs rebuild/lanes/b/tooling/test/product-phase-and-ledger.test.cjs rebuild/lanes/b/tooling/test/seal-tip-and-byte-identity.test.cjs rebuild/lanes/b/tooling/test/gate-supersession.test.cjs
Windows TEMP/TMP were scoped to this worktree's .tmp. Temporary synthetic repositories were removed after asserting their resolved parent/prefix. Counts were read from .tmp/issuer-tests-r2.log; raw logs are not published.

## Scope and remaining evidence
- Writable diff: runner, new issuer test, two named existing tests, README and this report only. No product/workflow/frozen helper/accepted artifact/spec/receipt/athlete-data edit. Parse and diff checks pass.
- The changed runner intentionally cannot reuse H3's old seal/pins. No H3 reseal, package PASS, private verdict, both-OS package CI or product integration is claimed here. Future authorized successor supplies registration, pins, FULL and receipt/rerun evidence.
- Separate Astra MAX review is required at this exact published candidate; builder is not reviewer or integrator. Give reviewer the prospective PM bar first; this report is rationale/evidence to read after independent execution.
- Issuer-only scope does not repair cell35, migrate page pins, register combined B/F packages or admit the companion. Those remain named successor work; current companion service head is74920fb, separately reviewedfdc4c8e, no cumulative/C-consumer completion inferred.
Runner sha256: b4fcb039e08a1e9eb55571a1940eb0867a48dc936b1b22f6cf21ff24e7abdd0b
