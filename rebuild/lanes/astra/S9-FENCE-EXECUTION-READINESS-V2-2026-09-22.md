# S9 sealed-inventory-fence execution readiness v1

- Static effect closure only at clean head `cbe5ed2edb209f04252be620a6dd3a44b5972220`; no test/module was executed and no protected/private/old-source byte was read.
- Exact child argv: `--test --test-reporter=tap rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs`.
- Target SHA-256 `9e6b9a8fa68f48a6a01bf8326bee88ff392ab25bafa5d0ae1367255c0b1afd2f`; 53 declared rows.
- Inputs: S9 spec `7b6dc0a15d4c7a15a096c78fa97f76d78bdb57b20140f70b5304a4fe4e5265c1`, S8 artifact `3cf58e0edd76a56353b35008ef154d484098b5017fedeb648eb64a0ae6568d48`, runner `5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22`, workflow `66f2ac9ceb19322a69b0b8a5ea725511fb208d546ac7662d4f0f751d9b3d9d0e`.
- Imports are built-ins only: test/assert, child_process, crypto, fs, os, path and url. No package, product, engine, protected, private or old-app module is imported or evaluated.

## Effects

- The shared fence invokes local `git -c core.quotepath=false`; it performs no fetch, push or network operation.
- Fixture rows create 62 repositories at fresh `os.tmpdir()/s9-fence-*` roots, configure only those repositories, write synthetic artifacts/runner/product/spec bytes, and run local `init`, `config`, `add`, `commit`, `update-ref`, `checkout`, `mv`, `rev-parse`, `merge-base`, `diff`, `ls-tree` and `show` operations.
- Fixture deletions are confined to files below those roots. The `after` hook recursively removes every root recorded in `MADE`; interruption can leave synthetic temp repositories, never integration bytes.
- One ENOENT control attempts the deliberately nonexistent executable `git-s9-fence-is-not-a-binary`; it does not alter PATH or the repository.
- Three workflow rows read only working-tree `.github/workflows/rebuild.yml`. The real row performs read-only Git operations against the integration repository.

## Real-row reads at this head

- Remote-tracking ref is local `refs/remotes/origin/rebuild/t2-client-core` at `7e33bb3d254673ec86b07e7dd541af7f409c3fac`; merge base is `4f89fb9b45fe7bbc548e35295cbb3993fa9df68f`.
- Commands are `rev-parse --verify`, `ls-tree --name-only` over `rebuild/m4/spec/`, `show` of the selected S8 artifact, `merge-base`, and `diff --name-status`; the verified-child branch also reads `HEAD:S9.json`, chain/HEAD runner text and uses `merge-base --is-ancestor`.
- The chain inventory selects `acceptance-s8-real-shape.json`; its JSON keys/hashes and the diff's path/status metadata are inspected. No inventoried product byte, including any protected-five source, is opened or hashed.
- Static conditions for the genuine S9 child are present: exactly one added package spec (`S9.json`), parent artifact/hash match chain S8, chain runner lacks S9, branch runner contains S9 and is touched, S9 sourceBase is an ancestor, and the S8 artifact itself is untouched. The expected real-row result is therefore verified-child `skip` returned as a passing test row; runtime must confirm it.
- The real row does not mutate integration refs, index, worktree or config. A no-Git copy cannot preserve its evidence because the remote ref, merge base and branch diff are the subject.

## Route and output

- The existing clean integration checkout is the minimal sound route; record head and chain-ref commit immediately before invoking pinned Node 24.19.0 with fixed date/TZ and the exact argv. No protected-five authority is consumed by this child.
- Success output is TAP row names/counters/timing. Failure output can include fixture paths, Git stderr, chain commit, artifact path/hash and diff path names, but the code never loads protected/private contents. Keep raw TAP local and share only PID, exit, counters, verdict and evidence hashes.
- Static conclusion: contained and ready for a bounded runtime slot; no owner permission expansion, fresh-copy harness or product change is required.
