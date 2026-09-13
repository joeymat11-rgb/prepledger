# Astra issuer compatibility: builder report

Candidate: rebuild/astra-issuer-compatibility, based on6a76afb. Original submission f047b5b15463044eec299696b3f470859e476134 is preserved; R1 runtime/test correction is e91f0a38d0fa4116190aa8943d6292ff5b882ebb. This is the six-path tooling candidate containing this report, not an engine package or H3 reseal.
Authority: DECISIONS:198; accepted brief atf669669 and mandatory astra/ISSUER-COMPATIBILITY-ACCEPTANCE-BAR.md were read before implementation. Old B work remains preserved/unknown.

## Changed behavior
- New PM claims require the case-exact Astra PM ledger header. Cowork is accepted only for exact historical claim bytes already present at the immutable193 handover, including later inherited contexts.
- Runner pins actual handover commit, owner-line position/hash and approved-document hash. Every use re-reads anchor/current-chain evidence; Astra additionally requires a valid descendant receipt context and a new line after the handover. No spec/env authority override exists.
- Applied to actual spec brief/theme/freeze, authority, own acceptance, parent option, grandparent pins and freeze escape. Owner/contract retain original roles/hashes; exact original receipt helper is unchanged.
- PM acceptance role is separate from independent reviewer identity. ACCEPTED-BY-NAME is not machine ACCEPTED; payload role words, aliases, new cowork lines and historical void Astra claims refuse.
- Existing product-phase/seal fixtures now carry a synthetic immutable handover. New freeze claims use Astra PM; old historical claims remain cowork. Existing behavior assertions are retained, including stale-tip, source/pin/receipt/verdict drift and owner/contract controls.

## Original submission evidence (f047b5b)
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
Original runner sha256: b4fcb039e08a1e9eb55571a1940eb0867a48dc936b1b22f6cf21ff24e7abdd0b

## R1 correction and reproduction
- Independent ER review ada12bbc6f9ad5e0943bae9e92931108e683a2b8 rejected f047b5b: grandparent pins proved issuer/context but accepted an invalid payload. B reproduced the untouched annex at f047b5b: 12 tests, 7 pass, 5 expected-refusal failures; all five were Missing expected exception. New builder probes then reproduced 9/9 intended failures against the original runtime.
- The ten-line runtime correction parses exact POSTFIX-ACCEPTANCE grammar; binds grandparent package, artifact path and hash; requires the reviewed commit behind HEAD and the actual chain; and verifies the artifact bytes at that commit. Historical receipts, optional old review shape, original helper and other authority fences remain intact.
- Nine new actual option/pins negatives cover REJECTED/PENDING/ACCEPTED-BY-NAME, wrong package, nonexistent commit, wrong path/hash despite correct mentions, an existing commit with different artifact bytes, and an off-chain commit with identical artifact bytes. Each restores a valid receipt and passes afterward.
- Six new source mutants remove the exact-terminal, package, path, hash, reviewed-byte or reviewed-ancestry guard and lose the intended negative assertion. The existing context-ancestry mutant now keeps its reviewed commit on-chain and changes only receipt context, so the new guard cannot mask the old assertion; its valid receipt is restored afterward. No assertion is relaxed.
- Focused R1 command: 16/16 pass, 0 fail/skip/cancel, 173671ms, from .tmp/issuer-r1-builder-green.tap. Both modified JavaScript files parse; diff check is clean.
- Broader four-file command above at e91f0a3: 103/103 pass, 0 fail/skip/cancel, 435672ms, from .tmp/issuer-r1-focused-all.tap. This includes all 88 original tests plus nine R1 negatives and six R1 mutants.
- Builder reproduction of the independent annex at committed correction e91f0a3: 12/12 pass, 0 fail/skip/cancel, 75839ms, .tmp/issuer-r1-review-reproduction.tap. Only its candidate SHA and two candidate byte pins were retargeted in memory; all assertions and fixture behavior are unchanged. This is builder evidence, not an independent R1 disposition. The untouched annex correctly refused the changed candidate at its original byte-identity precondition.
- Corrected runner SHA256: 6d68174177f3e9598f3680d198290a891d77d90febafc7c865cd21bf581b7ba7. Corrected issuer fixture SHA256: a90f2434e8607800ed95ea1902c886031c69297e79f92be57ed33aabbed074b9.
- Independent review of the new published candidate is still required. No package gate/FULL/private run, H3 re-pin, acceptance, merge or deployment was performed for this correction.
