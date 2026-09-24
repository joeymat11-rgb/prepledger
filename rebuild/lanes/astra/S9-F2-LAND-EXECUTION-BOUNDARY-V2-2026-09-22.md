# S9 f2-land execution boundary v2

- Supersedes v1's assignment-scoped stop; v1 remains immutable. Static whole-graph review at clean `f191b2e1bde801fdff8cce6dcc56bf24b389782f`, spec `994f9851681a743ac79002fd31d2088537558f2996f8865b15cdb388a4c47379`.
- Exact argv: `--test --test-reporter=tap rebuild/lanes/d/f2/projector.test.mjs rebuild/lanes/d/f2/guard-coverage.test.mjs`; needle null.
- Targets: projector `f74bbe5f40624237a4d24536b3ead036a75ed3bc705a52d6e55032d28bdf8dd6`; guard `78d1d73c02b115981006ab38dd0a16bfcd9fddbee8afa40c872964155281b9e7`.

## Closed seven-file graph
- Both targets load built-in test/assert/module, catalogue `9f7116bb679eb53ead6d5ea8000e8534a5bfc94e2042e3b0b36e57f272cd52e3`, athlete-state `d0e26f7401f6d04f44aef808eaca3c05e658f9c1ebd25a45ad9d2b3a3e69601c`, and setup-tags `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d`.
- Athlete-state's only import is ordinary public `rebuild/engine/constants.cjs` `106113baf0bca78d2f113b965b0902ee33acd35a96e453eed25cd79cc3bc5380`.
- It invokes that no-argument factory at module load and reads one constant. The factory imports nothing, constructs/returns data, and has no I/O, process, clock, or global mutation.
- Guard G22 resolves and reads setup-tags plus byte-identical lane adapter `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` for SHA comparison.
- Catalogue, setup-tags, and adapter have no imports or I/O. No dynamic import/require target, extension fallback, symlink, protected-five, private, oracle, port, or frozen-source edge remains.

## Runtime effects and route
- Node's test runner may use two worker processes. Repository calls are pure factory, clone, validation, projection, freeze, and date parsing; one test intentionally catches bounded TypeError/RangeError outcomes.
- Runtime filesystem effects beyond module loading are two read-only G22 reads. There is no write, temp path, subprocess from repository code, Git, dependency, environment mutation, browser, server, or network.
- Success TAP should contain 81 tests and names/counters/timing only. Failure assertions can serialize synthetic states/stacks; retain raw logs off-repo and report hashes/counts/verdict only.
- The exact child is bounded public/synthetic work and needs no new owner permission or permission 766. A PM runtime slot is still required.
- Run from a no-Git directory containing exactly the seven manifest files in repository-relative layout; no `node_modules` junction is needed.
- Verify hashes, use pinned Node/date/TZ and exact argv once, retain PID/exit/log hashes and tests/pass/fail/skip. Expected static count is 81/81, zero fail/skip; bind needle only from observed TAP.
- Any load outside the manifest or any effect beyond those above is a STOP, not a reason to add a file silently.
