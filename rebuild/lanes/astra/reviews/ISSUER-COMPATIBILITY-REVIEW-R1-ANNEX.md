# Issuer R1 independent evidence and reproduction

Candidate f195b7fe69c8ede31c322f5da72481e63b8c3b0b. Run from an isolated public checkout beneath work/pm-caretaker. Use existing Node24.19.0, Windows PowerShell, and own .tmp for TEMP/TMP. No dependency install or full gate is required.

```powershell
$env:TEMP = Join-Path (Get-Location) '.tmp'
$env:TMP = $env:TEMP
$reviewNode = 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
& $reviewNode --test --test-reporter=tap rebuild/lanes/b/tooling/test/astra-issuer-compatibility.test.cjs rebuild/lanes/b/tooling/test/product-phase-and-ledger.test.cjs rebuild/lanes/b/tooling/test/seal-tip-and-byte-identity.test.cjs rebuild/lanes/b/tooling/test/gate-supersession.test.cjs
& $reviewNode --test --test-reporter=tap rebuild/lanes/astra/reviews/ISSUER-COMPATIBILITY-REVIEW-R1-ANNEX.cjs
& $reviewNode --test --test-reporter=tap rebuild/lanes/astra/reviews/ISSUER-COMPATIBILITY-R1-ANCESTRY.cjs
```

Measured results respectively:103/103 in389194.5651ms;12/12 in68606.8202ms;2/2 in46844.9031ms. Each had exit0 and zero failed/skipped/cancelled/todo tests. These are distinct commands; builder-reported targeted16 cases were not counted as another independent execution.

| Exact input/evidence | Bytes | SHA256 |
| --- | ---: | --- |
| b/tooling/b-package.cjs | 232392 | 6d68174177f3e9598f3680d198290a891d77d90febafc7c865cd21bf581b7ba7 |
| b/tooling/test/astra-issuer-compatibility.test.cjs | 31543 | a90f2434e8607800ed95ea1902c886031c69297e79f92be57ed33aabbed074b9 |
| [Retargeted original reviewer annex](ISSUER-COMPATIBILITY-REVIEW-R1-ANNEX.cjs) | 8643 | ed27b2f05961d02b6cb897ec27bf2744ebd93ac1dfa6513ef01646464d07db34 |
| [Separate ancestry controls](ISSUER-COMPATIBILITY-R1-ANCESTRY.cjs) | 6042 | e3b17fad67d8035a1a6bd695e8e0a276ae624662e4f6ce99458b0674fe6402f7 |

The original annex at ada12bbc6f9ad5e0943bae9e92931108e683a2b8 is8643 bytes, SHA25616942a2dc344aa210b4c83e76d1c3ba582beeba6c7dd0802f7f72c9e0b602126. Only three unique literals were retargeted: candidate commit, runner hash and fixture hash. Reverse substitution equals the original byte-for-byte, including its historical f047b5b comment. No assertion or fixture-construction logic was edited.

Both reviewer scripts load only the candidate fixture constructor before its first test.after registration, not builder assertions. Synthetic histories execute the candidate checker with exactly the fixture's two declared authority-coordinate substitutions; no Git/authority/checker stub is added. The original annex also executes the unmodified production selector and option against public published authority/receipt blobs. No main sequence, historical full gate or private path is entered.

Additional ancestry test anatomy:

- HEAD-only: identical legitimate artifact at a newer commit on fixture-chain; detach at the preceding parent head and stage only the newer grandparent review. Assert reviewed commit is on chain and outside HEAD. option succeeds; pins must issue the exact NOT-BEHIND-HEAD refusal.
- Chain-only: create an identical-artifact candidate side commit, cite it in an on-chain receipt, then merge fixture-chain into the candidate branch. Assert reviewed commit is behind HEAD and outside fixture-chain. option succeeds; pins must issue the exact NOT-ON-THE-CHAIN-BRANCH refusal.
- Each repeats its history with only its own source ancestry guard removed from a temporary module. The outer assertion accepts only ERR_ASSERTION with Missing expected exception, so an unrelated runtime/parser/Git refusal cannot kill the mutant. Each concludes with a fresh original-source positive and disk-byte identity check.

Raw synthetic logs are retained only in ignored own .tmp: issuer-r1-candidate-tests.tap, issuer-r1-independent-annex.tap, issuer-r1-ancestry.tap. The initial2/2 harness-predicate failure is preserved as issuer-r1-ancestry-initial-predicate-error.tap. The final predicate checks the exact named Error emitted by ancestor(); this correction changed no candidate bytes. All synthetic fixture directories were cleaned by verified own-root teardown after execution.

No whole PACKAGE PASS, engine law, private/FULL, integration or launch claim follows from these probes. Shared integration stayed at START205 T=ea0a011f540448a5ece05d4c0ab7e0c8af17fedc; issuer adoption is excluded from launch. Builder rationale is read only after publication of the independent verdict.
