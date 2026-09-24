# S9 measure-hermetic six-file execution review
Verdict: ACCEPT the exact public-only no-Git copy route after the PM runtime slot is released.
STATIC only; no test/module execution or protected source read/hash occurred here.
Source head b3fb9ce92084e1dd4abe6608d2d914b79924a12d independently observed clean.
Spec SHA256 10bb848c37bb0f41ea0ad63eca6fced47bbec50da90de928387a933dc8c35ba5.
Inventory SHA256 339f231fc22f9eae4f90f39a67823cb5361e9918edc14c53bf5e8f8149eb804b.
Manifest SHA256 da0ca6a3f21195c970829eee7596a53f9392833451fa612d9b490cbf08263b95.
Both artifacts are under %TEMP%/earned-s9-spec-proposal; manifest suffix is 6FILE-MANIFEST-v1.json.

Complete six-file graph, full repository-relative path and SHA256:
rebuild/m3/w7-preview/measure/test/model.test.mjs
ff2a531fd74afe98cc9acbcfd875dc175ae3686661eda5e34e8b5d61529b566e
rebuild/m3/w7-preview/measure/test/adherence.test.mjs
219ad91f1e83ff97e1a61e2d1d609a28d4416e3a1e40768502789f3c4cda7446
rebuild/m3/w7-preview/measure/measure-model.mjs
fbdac126c2b2f3ac476bbcdf66786459f429df4a8ebc5ebe34c74b93cf91ad87
rebuild/m3/w7-preview/measure/measure-view.mjs
836bc79e07899d806d33ca680d1830ebc996adc81131b7193e1f05e1580b57ac
rebuild/m3/w7-preview/measure/measure-sources.mjs
8e7f620c5286cdde7933ec4829539b74e36f0b6aba660d89e317d468351b84d4
rebuild/m3/w7-preview/measure/measure-fixture.json
a141382091a8c6323cc4830fe093051a5506f80b38afd6cade3ec2320bbc11f5
All six hashes match raw Git/disk and S9 carried pre/post; all are regular100644 with no link components.

Own complete source trace:
Model test imports model/view; adherence test imports sources/model; view/sources import only model.
Model has no imports; test builtins are test/assert/fs/path/url, with no package dependency.
Each test file synchronously parses the single fixture once; JSON is data, never evaluated as code.
Executed callbacks use pure arithmetic, fixed UTC date construction, arrays and strings.
Every weeksFromState call omits engine; default null makes nightsIn return before cleanAtDate.
View DOM mounts, event callbacks and text export are defined but never called by these targets.
No dynamic load, engine/private/frozen import, subprocess, file write, Git, network or store path exists.
Node's own test runner can use separate test-file processes; repository code spawns none.
Success emits test names/counters/timing; failed assertions may serialize synthetic fixture values.
Keep raw stdout/stderr off-repo; shared reports contain only counts, verdict, exit and log hashes.

Approved route:
Create a fresh no-Git directory with exactly these six files at their repository-relative paths.
Verify its exact file set and hashes before launch; no node_modules junction or extra file is needed.
Use pinned Node24.19.0, TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03, cwd at that copy root.
Exact argv: --test --test-reporter=tap rebuild/m3/w7-preview/measure/test/model.test.mjs
rebuild/m3/w7-preview/measure/test/adherence.test.mjs (the same command's second file).
The source declares11 tests with no skip branches; actual counters remain unmeasured here.
Retain source/copy custody, PID, terminal exit and log hashes; bind a needle only from actual TAP.
If an undeclared load or unexpected effect appears, stop instead of extending this reviewed graph.
No new owner permission is required for these public-only calls; permission766 is not exercised.
This grants no sibling child, engine execution, full package, CI or seal acceptance.
