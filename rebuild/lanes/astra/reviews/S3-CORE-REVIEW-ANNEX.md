# S3 independent execution record

Review target and scope are in S3-CORE-REVIEW.md. No builder rationale was read to produce this record. S3-CORE-REVIEW-EVIDENCE.json records exact hashes and results; S3-CORE-REVIEW-EVIDENCE.mjs independently collects and verifies them without executing the product or reading the builder report.

Root R = C:/Users/joeym/Documents/prepledger-dev/work/pm-caretaker/review-s3-core.
Run A = R/.tmp/s3/4b3d74ae-2800-46e5-b29e-28308fe27f68; run B = R/.tmp/s3/39c85ddf-ac41-4663-a90a-c31375db7143.
Each has its own tree, installed dependencies, cache, store, temp and logs. Both setup invocations use the exact unchanged candidate dispatcher and fresh generated run ID. No borrowed project dependencies.
Node = own review-preflight-ci/.tmp/reviewer-node22/node-v22.23.2-win-x64/node.exe, version22.23.2; npm CLI beside it,10.9.8. Tool-only pnpm9.15.9 path is the exact PM4f750480 TOOL-RUNTIME-LOCATIONS.md grant. W6_BROWSER_BIN = C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe,153.0.4234.32, SHA25681ee5ff42fcec883312170606b10ebbb2b01f5b4cddc2cf485290e40c15b027d.

## Candidate commands

From R, with S3_NPM_CLI/S3_PNPM_CLI set to the verified tool CLIs: `node rebuild/m4/import/test/s3/run.mjs setup`, twice, yielding A and B. Actual dispatcher installation preserves root/W6 postinstall and W5 --ignore-scripts --ignore-workspace. Versions and installed:true are in each run.json.
From R: `node rebuild/m4/import/test/s3/run.mjs suite-core <A>`; 45/45, per-file14+9+4+2+9+7.
From R: `node rebuild/m4/import/test/s3/run.mjs suite-import <A>`; 41/41, per-file14+27.
From R: `node rebuild/m4/import/test/s3/run.mjs mutations-core <A>`;10 prepare,20 reading-replay,16 core mutants; all46 named assertions and individual restored controls independently verified.
From R with verified W6_BROWSER_BIN: `node rebuild/m4/import/test/s3/run.mjs browser-core <A>`;19 portable-only checks (10 initial,8 reopen/descendant/rollback,1 context refusal), owned persistent profile/process-tree kill, product62/test71 fresh build inputs.
Full suite-new/workout/mutations/real-C2 modes were not executed; their explicit BLOCKED branches and visible deferred inventory were read.

## Independent commands and results

For the three node:test annexes, cwd B/tree; S3_SCRATCH=B/tree, S3_RUN_ROOT=B, TZ=America/New_York, TEMP/TMP=B/temp, NODE_OPTIONS empty and S3_MUTATION absent. Invoke the same verified Node22 with `--require ./rebuild/m4/import/test/s3/current-head.cjs --test --test-reporter=tap <absolute annex>`. Direct candidate imports are restricted to independently verified manifest members; any dependency resolution stays in B's own installs.
S3-ADMISSION-REVIEW-ANNEX.mjs:8 tests,4 positive PASS/4 expected-refusal ERR_ASSERTION; zero skips/cancellations. All four negative outcomes open an actual ready:true view. The namespace negative authenticates metadata.namespace first. The plan probe is an unexplained stored input, not an assertion that a current UI writes that shape. Real capture/command producer builds the missing-lift witness. The target probe uses the existing Ops.build extra hook and real commitment.
S3-PROVIDER-REVIEW-ANNEX.mjs:4 tests,2 positive PASS/2 expected-refusal ERR_ASSERTION. The actual controller opens ready:true regression n28, from2026-02-15/to2026-03-14 under a September-only calendar. Both controller attempts preserve the exact durable generation. A first run had the same2/2 result; the final annex adds safe outcome diagnostics and moves custody assertion before the refusal assertion. Initial log retained and separately hashed; do not count twice.
S3-PROVIDER-DRAFT51-ANNEX.mjs: one reviewer discrimination assertion FAIL after full actual provider original7/7, registered one-site empty-drafts mutant7/7, finally restored7/7 and all111 pins. No candidate test/manifest edit. Mutant SHA2560a8b7226df0d21dbac3504cafd79fff4988603e4ad1756155787a29568d3d856; original providerf8b3d4cb7f8a7fd2c414a83b54cc497ca3aee71be90269ddd30b3eeb9c231a3e. Outputs B/review-draft51-OdYGYu, not a successful mutation kill.
From A/tree after browser/restoration, `node <absolute S3-HARNESS-REVIEW-ANNEX.mjs> --tree <A/tree> --browser-evidence <A/browser-core-evidence.json>`:4 controls PASS/5 failures; all owned111 sources hash-equal before/after. Actual two-test TAP children and harmless CJS/ESM sentinel witness. Outputs A/reviewer-s3-harness-IFuJNo. Browser schema defect is separate from19 completed browser checks.
Final independent boundary inventory:22 cells across the four annexes,10 controls pass/12 required assertions fail. This combines node:test cells and explicitly named harness probes, not a claim of22 discovered node:test cases. The three provider control suites are separately7/7 each.

## Provenance and constraints

Raw logs stay in owned scratch. The JSON evidence pins actual logs, each of46 selected mutation diagnostic records and restored totals, browser build hashes, all reviewer sources, the ten pre-read binding documents, original Git blobs and both scratch restorations. The evidence collector's final111-source verification passed across all three trees.
No new production bug is alleged solely because a requirement belongs to deferred B/C/P1. R10 asks only for portable Node/browser core comparison already required by the construction bar; actual production producer/run/output correspondence is still unavailable and cannot be manufactured from these synthetic tests.
No execution touched the original checkout, another lane's project dependencies, owner data, private/seed/history/oracle/port, final protected capture/consumer suites or production. No source code fix, acceptance receipt, integration or deployment is made by this reviewer.
