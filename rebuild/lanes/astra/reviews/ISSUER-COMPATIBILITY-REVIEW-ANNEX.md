# Issuer compatibility — independent execution annex

Candidate: `f047b5b15463044eec299696b3f470859e476134`. Reviewer worktree: `work/pm-caretaker/review-issuer-compatibility`; branch `rebuild/astra-review-issuer-compatibility`. The real integration ref resolved to `ee3d1d9fcc832a45d61f8425b52029ef53a93bff` when the evidence was recorded. No real Git ref was changed by a fixture.

`node` below was `C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`. Working directory was the fresh reviewer tree. Each child inherited TEMP and TMP set to that tree's `.tmp`; this also confines the older suites' `os.tmpdir()` fixtures. Tests use Node built-ins and Git. Output was retained locally and only bounded verdicts are published.

```text
node --test rebuild/lanes/b/tooling/test/astra-issuer-compatibility.test.cjs rebuild/lanes/b/tooling/test/product-phase-and-ledger.test.cjs rebuild/lanes/b/tooling/test/seal-tip-and-byte-identity.test.cjs rebuild/lanes/b/tooling/test/gate-supersession.test.cjs
node --test --test-reporter=tap rebuild/lanes/astra/reviews/ISSUER-COMPATIBILITY-REVIEW-ANNEX.cjs
git diff --check
git diff --exit-code HEAD -- rebuild/lanes/b/tooling rebuild/conform/v4/postfix/legacy-gates.cjs
```

The first command measured 88/88 passing. The second measured 7/12 passing, with five missing-refusal assertion failures that reproduce the one R1 finding. An earlier annex start had a reviewer-only relative-root setup error; it was corrected before the measured run and did not enter candidate checks. No candidate edit or weakened assertion was used to obtain these results.

The executable annex pins and checks the exact runner and builder fixture bytes against the candidate Git blobs. It reuses only the audited builder's temporary-Git fixture constructor, stopping before any builder test registration, and adds independent assertions. The constructor changes only the closed chain-ref and synthetic handover literals, as its own two-line assertion verifies; the real checker functions, original helper, Git reads, ancestry and artifact checks execute. I01–I03 additionally compile the unchanged production runner, with neither literal substituted, against the real public ledger and an existing public parent option. The full main sequence is never entered.

I04–I06 use a genuine synthetic Astra grandparent below a genuine synthetic Astra parent. A positive `option()` and `pins()` call precedes each mutation. Each replacement grandparent receipt is committed on the synthetic chain and its disk bytes are checked against Git; the parent option is then verified again. Only the grandparent payload terminal, package id or reviewed commit is changed. Every corresponding negative assertion is red because `pins()` does not refuse it. No authority helper is stubbed and no frozen source is changed.

I07 separately damages handover-document bytes in the receipt's historical context and restores the current chain tip: the new issuer code correctly rejects that receipt. I08 proves the receipt line-position check independently of historical-line membership. I09 proves duplicate exact-line refusal; I10 proves a role name in a grandparent payload is not PM authority. These controls are green.

| Evidence | Bytes | SHA256 |
| --- | ---: | --- |
| Exact candidate runner | 231640 | `b4fcb039e08a1e9eb55571a1940eb0867a48dc936b1b22f6cf21ff24e7abdd0b` |
| Builder fixture source | 25471 | `e0ce341048f29ff8bb5a85152e52f48888e5d891375c95ed1861ef74808094d5` |
| Independent executable annex | 8643 | `16942a2dc344aa210b4c83e76d1c3ba582beeba6c7dd0802f7f72c9e0b602126` |
| Local candidate-suite log `.tmp/issuer-candidate-tests.tap` | 77715 | `f46ed4db71e642b94b84e1bc61eff49dc7f7c92783f7db59279fdcc05e73e728` |
| Local independent TAP `.tmp/issuer-independent-annex.tap` | 27867 | `8eb63b99de79bd4cfc977ffdd76248080fa0605c8a06cb8f7961df744b5b78d3` |

Only the review documents and executable annex are public artifacts; raw logs remain ignored in the reviewer tree. These hashes cover synthetic/public test evidence only. No private gate, historical source assembly, product or phone evidence is claimed.
