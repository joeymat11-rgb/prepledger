# D2 module-link evidence and replay

All tests used invented repositories under the assigned reviewer tree. No actual historical engine or protected input was loaded. The verdict is in ../FROZEN-BUILD-MODULE-LINK-REVIEW.md. FILES.json hashes every first-verdict artifact except itself.

Input custody: admission.json records the exact candidate/tested/preimage blobs and all six SHA256 identities. applicability.json proves the entire source difference and additive test block, ties prior334 F2 RED to its immutable source, and records unchanged routes/packages. Prior raw evidence remains at561d3b2779decaaa7f5b8e8bca21f1cbdd9a08ad under reviews/frozen-build-setup-annex; its required paths/hashes are in applicability.json.

Replay only in a fresh, explicitly assigned own worktree at b54fec2de8d33d7d41f038b47e76b1e5bc1763a3 with full index before narrow hydration of package.json, package-lock.json, rebuild/conform/engines/build-engines.mjs and its test/build-engines.test.mjs. Use the approved independently owned Windows x64 Node22.23.2 binary at .tmp/tools/node.exe and verify admission.nodeSHA256. Never use another lane filesystem or resolve the production default refs.
Copy this annex admission record and corrected *.mjs helpers into .tmp; copy immutable controls exactly. Do not execute *setup-error.mjs or the correction helper during a clean replay. Read the scripts first. Obtain the two preimage text files named by d2-module-link-prepare.mjs from its pinned preimage Git blobs. The preparation helper copies named prior334 evidence/scripts via Git, checks the source delta, and records applicability; its prior copies are reused evidence, not new candidate runs.
Before invoking Node, remove inherited GIT_* and NODE_OPTIONS/NODE_PATH/ESBUILD_BINARY_PATH/NODE_V8_COVERAGE/NODE_TEST_CONTEXT variables from this shell process. Actual test child environment, cwd, executable, arguments, start/end times, stdout/stderr hashes and pre/post input identities are recorded in each run JSON. No credential values are recorded.

Commands actually executed, in order (all cwd = the assigned own tree):
1. .tmp/tools/node.exe .tmp/d2-module-link-prepare.mjs
2. .tmp/tools/node.exe .tmp/d2-install-frozen-deps.mjs — official integrity-pinned archives; only esbuild and matching host package, scripts disabled.
3. .tmp/tools/node.exe --check .tmp/d2-module-link-run.mjs
4. .tmp/tools/node.exe .tmp/d2-module-link-run.mjs loader — actual owned service invocation with invented transform input.
5. .tmp/tools/node.exe .tmp/d2-module-link-run.mjs public — committed public suite once, 12/12.
6. .tmp/tools/node.exe .tmp/d2-module-link-run.mjs controls — immutable source, pattern ^D2 F[23] only, 2/2.
7. .tmp/tools/node.exe .tmp/d2-module-link-finalize.mjs — first post-run reader failed on its own suffix assumption; failed source/error record retained. After d2-module-link-correct-analyzer.mjs, corrected finalize passed without rerunning tests.

The run helper writes an exclusive .started.json marker per mode to prevent accidental repeats; retained JSON contains the same command and before/after identity facts. The raw observation is valid JSON ending 7d0a. Final evidence parses it whole and verifies unchanged sentinels and hardlink IDs. Raw TAP/stdout/stderr/observation and all scripts are byte-preserved with annex .gitattributes; source/runtime/packages/synthetic repositories and binaries are not copied into this annex.
Preparation/install/reporting commands are tooling steps, not test counts. The metadata-reader failure is neither a candidate defect nor a meaningful regression reversal. The wrong reporting-rule path lookup failed without reading content. No extra engine/test execution was credited.
The first verdict excludes all new E outcomes. Later reconciliation will be a separate file/commit; this annex and verdict remain immutable.
