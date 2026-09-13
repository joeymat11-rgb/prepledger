# Shared preflight CI — execution annex

Candidate `b09d55a83a95bc1dba2e633990b2d24690510b56`; own fresh public sparse tree `work/pm-caretaker/review-preflight-ci-r1`, branch `rebuild/astra-review-preflight-ci-r1`. Earlier scaffold3943bba remains in the separate own `review-preflight-ci` tree; its22/22 registration run is preliminary evidence only.

Node22.23.2 was downloaded only into the own scaffold tree's `.tmp/reviewer-node22` from the official Node Windows distribution and verified against its published SHA256: archive `node-v22.23.2-win-x64.zip`, 35,683,585 bytes, `1177b4137ba5adaa56354ae40f1080c7450e8ae09cecb47da459d1c52ac99f97`. No global runtime install occurred. Its `node.exe` ran the commands below; TEMP/TMP and npm cache were scoped to own review scratch directories.

```text
node <same-runtime>/node_modules/npm/bin/npm-cli.js ci --no-audit --no-fund --include=dev --ignore-scripts
node --test --test-reporter=tap rebuild/lanes/astra/reviews/SHARED-PREFLIGHT-CI-REVIEW-ANNEX.cjs
```

The annex's I08 executes the actual workflow Node body with no source, remote, SHA, Git or filesystem substitution. It starts in an empty isolated directory, uses the real public HTTPS repository and exact candidate event SHA, checks the closed14-blob inventory, then removes the remote. Inside that resulting partial repository it executes:

```text
node <same-runtime>/node_modules/npm/bin/npm-cli.js ci --no-audit --no-fund --include=dev --ignore-scripts
node --test rebuild/lanes/tooling/test/preflight.test.cjs rebuild/lanes/tooling/test/shared-preflight-ci-registration.test.cjs
```

That command measured67/67 (D45 + registration22), 0 failures/skips/cancellations, 71,022.6046 ms. The outer independent annex measured8/8 with no failures/skips/cancellations, 137,731.249 ms; I08 includes the67-test child and is not claimed as67 extra independent review cases. All fixtures were removed with resolved-directory/prefix containment assertions. Raw logs remain ignored locally.

I01–I07 reuse the exact candidate registration file's real YAML contract and synthetic Git fixture constructor, suppressing only that file's original test registrations. No contract, Git, blob inventory, filesystem or workflow-boundary function is mocked. New reviewer assertions test actual missing-workflow files, repository attributes, a symlink entry, absent remote/undeclared blob, wrong repository, occupied root, missing historical file and materialized-file mutant/restoration. Fake excluded paths contain only declared synthetic canaries. The registration file is pinned by hash before this construction is loaded.

The current input closure is exactly workflow, package.json, package-lock.json, preflight.cjs, preflight-dash-scan.cjs and the two named test files. Historical closure is today/{build.mjs,gym-app.mjs,plain-copy.cjs} at2b9b09a and0e652ce, plus shared preflight.cjs at0e652ce; full SHAs are pinned in the actual workflow and regression. All seven current files were compared again against the candidate Git blobs after the real partial-checkout test run.

Git can fetch missing partial-clone objects on demand, which is why testing the actual object inventory and removed remote matters ([Git partial-clone documentation](https://git-scm.com/docs/partial-clone)). A pull-request GITHUB_SHA can identify a synthetic merge; this workflow explicitly selects the PR head and its logs prove the checked-out value ([GitHub event documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request)). These documentation checks supplement, rather than replace, the executed evidence.

| File/evidence | SHA256 |
| --- | --- |
| Workflow | `ea2b42cf978ae030604e0fd9de69c0b0981b24264c67d02742fb44def12198c2` |
| Registration test | `14bf8033b31d8886414238745d19c1a1360fabf49447356f1a4acbd496a646b5` |
| D preflight | `093876148664f3e9cad7ca4afce92c5abbba84ecc00c518b57430ce054a01499` |
| D lexical helper | `92f3b22380f9dab0266434adcd43dd6cceab89463d62bbe37ae0bf09e3ac52af` |
| D regression test | `fd1d1646e0f7b45cb7550814597ea601c10dcb2be63b9b15f262650cf93bf8b7` |
| Independent executable annex,10955 bytes | `06dfb0bf21f17c7f318bbdaab719652a41d56f37c90214d5ce62f35ddf424ca4` |
| Independent TAP,2019 bytes | `7f07f354547031c2c8151d5758f606a9292d243367c423d8fd8597a14a5f3475` |
| Actual composed suite log,12958 bytes | `bbd3abda02c5135489819accb1691b35a9c1ddd7791067035a27ede34d06a6cc` |
| Real public checkout line,141 bytes | `93d6315262f190827d17b1402a05870e0f5f8f294362c31fa9219549efd1f9ff` |
| Hosted shared-workflow evidence JSON,8113 bytes | `4903e81b5b7df54e36e26a7214a4e0103975a7b9b6d129d7d8041950992e68d2` |
| Existing rebuild metadata JSON,551 bytes | `17b5bc4e3e8abdf0085659d5e770671a009f293db2edb2e6b32dc35ec3c19687` |

Hosted push34740950707 and PR34740952921 each have two successful Node22.23.2 jobs. Windows push103680447178 measured67/67 in53,476.4808 ms; Ubuntu push103680447244 in9,958.93673 ms; Windows PR103680452806 in46,205.7031 ms; Ubuntu PR103680452671 in10,658.957268 ms. Every log identifies the exact b09d55a full SHA,7 current/7 historical/14 unique public blobs, no fetch remote and the exact required command. Job metadata and logs were independently read; raw private/H3 logs were not accessed. Full rebuild run metadata still reports FAILURE at the same head, so final integration remains blocked as recorded in the review.
