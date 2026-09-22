# C-UI-1 Codex author report

Role: commissioned Sol builder, not reviewer, PM or integrator.
Published red head: fa593d629d858bdd7d3d72ad8885598b1be8475e.
Status: SECOND RED READY; copy guards pass and scene fidelity is incomplete.
Browser and independent review remain owed.

The build keeps the accepted b35 Today behavior and binds the exact
2026-09-18 approved pack. Existing screen structure remains byte-pinned as a
compatibility layer; the newer approved CSS follows it and wins on overlap.

The design boundary reads and hashes four approved stylesheets, both local
font files and four scene images. The font files are inlined under the Earned
Sans and Earned Serif CSS families. All scene images become offline data URLs.
One changed approved byte and one changed font byte are durable refusals.

The simplified scene WIP reaches the actual preview bundle with its pinned
assets and review hooks, but it is not yet a faithful lift of the approved
scene. Cadence, ember depth/life, five-sheet mist, luminance occlusion and an
asset-ready reduced-motion still remain incomplete and are held red.

The actual build inventories scene.mjs, hashes it into the build identity and
ships the scene and four image URLs in its existing three-file offline bundle.
No today-entry ownership or behavior change was needed.

Meaningful unchanged-product red evidence under %TEMP%/cui1-author-red:
- design-strong-red.txt: 4 intended failures, exit 1; SHA256
  f9ac1344d3a9a315c11617939216a73ede655de05fd45c31a08f5b0e55f35fda.
- scene-final-red.txt: 3 intended failures, exit 1; SHA256
  747e39c4be82d94d38ac22da4594b22d630af6e1f9eac96195d37e35ef9c71fb.
Earlier dependency and browser failures remain explicitly non-evidence.

Focused candidate proof used pinned Node, MEASURED_TEST_NOW=2026-09-03,
TZ=America/New_York and --test-concurrency=1:
- design.test.cjs: prior 12/12 pass; copy-source/adoption guard bytes then
  measured 12/12 pass, exit 0; log SHA256
  eb89505693d8e907792b3e2dbe61a91a35ecb5034a9398d9880dc96727bb95a7.
- prior scene.test.mjs: 3/3 pass before the new fidelity rows.
- scene fidelity red: 2 pass, 3 intended failures, exit 1; cadence,
  depth classes and asset readiness each fail on the simplified WIP; SHA256
  0b5a3c50e65d04ff514380cd7530c42fd86543dd70f7150d01117de51ada4aa6.
Logs: %TEMP%/cui1-author-candidate/design-copy-guard-red-check.txt and
%TEMP%/cui1-author-candidate/scene-fidelity-red.txt.

browser-check now uses the supported explicit Today preview route with board
date and state hooks. Its reduced-motion row waits for the actual Workout
screen rather than a Today-only instruction slot. It has not been rerun.

No approved pack, baseline, quality gate, engine, storage, package, workflow,
ledger or STATUS path changed. No browser, both-theme, fresh-profile,
independent-review, Linux, seal or ticket-acceptance claim is made.