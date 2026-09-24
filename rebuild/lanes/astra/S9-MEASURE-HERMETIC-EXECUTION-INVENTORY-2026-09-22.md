# S9 measure-hermetic execution inventory v1

- Static whole-graph inspection at clean `b3fb9ce92084e1dd4abe6608d2d914b79924a12d`; spec SHA-256 `10bb848c37bb0f41ea0ad63eca6fced47bbec50da90de928387a933dc8c35ba5`.
- Declared argv: `--test --test-reporter=tap rebuild/m3/w7-preview/measure/test/model.test.mjs rebuild/m3/w7-preview/measure/test/adherence.test.mjs`; needle is null.
- Runtime candidate remains pinned Node 24.19.0 SHA-256 `3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237`, `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`.

## Exact six-file graph
- `model.test.mjs` `ff2a531fd74afe98cc9acbcfd875dc175ae3686661eda5e34e8b5d61529b566e` imports built-ins plus model/view.
- `adherence.test.mjs` `219ad91f1e83ff97e1a61e2d1d609a28d4416e3a1e40768502789f3c4cda7446` imports built-ins plus sources/model.
- `measure-model.mjs` `fbdac126c2b2f3ac476bbcdf66786459f429df4a8ebc5ebe34c74b93cf91ad87` has no imports.
- `measure-view.mjs` `836bc79e07899d806d33ca680d1830ebc996adc81131b7193e1f05e1580b57ac` imports only model.
- `measure-sources.mjs` `8e7f620c5286cdde7933ec4829539b74e36f0b6aba660d89e317d468351b84d4` imports only model.
- `measure-fixture.json` `a141382091a8c6323cc4830fe093051a5506f80b38afd6cade3ec2320bbc11f5` is synchronously read and parsed once by each test process.
- All six are regular Git files and S9 `role:carried` entries with `pre===post===disk`; there is no symlink, extension fallback, dynamic import, or undeclared load.

## Calls and effects
- Node's test runner may launch the two test files in separate child processes; repository code starts no subprocess.
- Executed repository calls are pure date/arithmetic/array/string helpers plus synchronous reads of the one public fixture. All dates are fixed UTC inputs; no wall clock is read.
- `weeksFromState` receives no engine, so its guarded `engine.cleanAtDate` callback is unreachable. DOM mounts, callbacks, and text export in view are defined but never called.
- No write, temp path, Git, dependency, environment mutation, DOM, browser, server, network, protected engine, frozen legacy, owner store, or private path is reached.
- Success TAP should contain 11 tests and only public test names/counters/timing. No fixture values or hashes are intentionally printed.
- Failure assertions can serialize synthetic fixture-derived values and stacks. Keep raw stdout/stderr off-repo and out of shared reports; report only hashes, counts, exit, and verdict.

## Bounded route
- Content execution needs no new owner permission and does not use permission 766. A PM runtime slot is still required.
- Strongest route is a no-Git directory containing exactly these six files in repository-relative layout; no `node_modules` junction is needed because every import is built-in or local.
- Verify six hashes, run the exact declared argv once, and retain PID/exit/stdout/stderr hashes plus tests/pass/fail/skip. Expected source count is 11/11, zero fail/skip; bind a needle only from observed TAP.
- First blocker if the six-file copy loads anything else is `ERR_MODULE_NOT_FOUND`; stop rather than adding a file outside this reviewed graph.
