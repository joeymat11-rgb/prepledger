# S9 33-child public/synthetic runtime packet v2

- Replaces v1 classification only; v1 remains immutable. Static plan at clean `b46f4e3d9809efee98229e8ff1911249c6e09874`, spec SHA-256 `e1a53e35ed3841749c5fabe5d2ff8a744e28bfc658f779135c01d599a7bd4397`.
- Runtime candidate: `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` 24.19.0, SHA-256 `3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237`; `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`.
- The accepted 83-target/276-file closure proves literal source reach, not dynamic-call, bundle, subprocess, owner-data, write, or network containment.
- Each line means pinned Node plus exact argv; no line below is execution authority.
- `today-17`: `--test` `--test-reporter=tap` `rebuild/m3/w7-preview/today/test/adapter.test.mjs` `rebuild/m3/w7-preview/today/test/catalogue.test.mjs` `rebuild/m3/w7-preview/today/test/checkin.test.mjs` `rebuild/m3/w7-preview/today/test/copy.test.mjs` `rebuild/m3/w7-preview/today/test/design.test.cjs` `rebuild/m3/w7-preview/today/test/food.test.mjs` `rebuild/m3/w7-preview/today/test/gym.test.mjs` `rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs` `rebuild/m3/w7-preview/today/test/ntc-h6-delta.test.mjs` `rebuild/m3/w7-preview/today/test/package.test.cjs` `rebuild/m3/w7-preview/today/test/problem.test.mjs` `rebuild/m3/w7-preview/today/test/setup.test.mjs` `rebuild/m3/w7-preview/today/test/view.test.mjs` `rebuild/m3/w7-preview/measure/test/journey.test.mjs` `rebuild/m3/w7-preview/measure/test/lane.test.mjs` `rebuild/m3/w7-preview/measure/test/baseline.test.mjs` `rebuild/m3/w7-preview/measure/test/boundary.test.mjs`
- `measure-hermetic`: `--test` `--test-reporter=tap` `rebuild/m3/w7-preview/measure/test/model.test.mjs` `rebuild/m3/w7-preview/measure/test/adherence.test.mjs`
- `s4-real-day`: `--test` `--test-reporter=tap` `rebuild/m3/w6/host/test/local-real-day.test.mjs`
- `a0-journeys`: `--test` `--test-reporter=tap` `rebuild/m3/w6/host/test/journey.test.mjs` `rebuild/m3/w6/host/test/engine-equivalence.test.cjs`
- `s9-sup-source-carriers`: `--test` `--test-reporter=tap` `rebuild/m4/workout/test/s9-supersede-source-carriers.test.cjs`
- `s9-sup-inherited-carriers`: `--test` `--test-reporter=tap` `rebuild/m4/workout/test/s9-supersede-inherited-carriers.test.cjs`
- `s9-sup-defect-witnesses`: `--test` `--test-reporter=tap` `rebuild/m4/workout/test/s9-supersede-defect-witnesses.test.cjs`
- `s9-sup-writers-differential`: `--test` `--test-reporter=tap` `rebuild/m4/workout/test/s9-supersede-writers-differential.test.cjs`
- `s9-sup-second-gate`: `--test` `--test-reporter=tap` `rebuild/m4/workout/test/s9-supersede-second-gate.test.cjs`
- `s9-engine-files-differential`: `rebuild/m4/workout/test/s9-engine-files-differential.cjs`
- `d-plan-edit`: `--test` `--test-reporter=tap` `rebuild/lanes/d/plan-edit/model.test.cjs` `rebuild/lanes/d/plan-edit/durable-host.test.mjs` `rebuild/lanes/d/plan-edit/browser-build.test.mjs` `rebuild/lanes/d/plan-edit/client-p6.test.cjs`
- `m4-import`: `--test` `--test-reporter=tap` `rebuild/m4/import/test/prepare.test.cjs` `rebuild/m4/import/test/reading-replay.test.cjs` `rebuild/m4/import/test/engine-provider.test.cjs` `rebuild/m4/import/test/local-source-order.test.cjs` `rebuild/m4/import/test/browser-parity.test.mjs`
- `m4-import-production`: `--test` `--test-reporter=tap` `rebuild/m4/import/test/production-mapping.test.cjs` `rebuild/m4/import/test/production-admission.test.mjs`
- `d-import-retract`: `--test` `--test-reporter=tap` `rebuild/lanes/d/import-retract/retract.test.mjs`
- `d-admission-swap`: `--test` `--test-reporter=tap` `rebuild/lanes/d/p3-followons/admission-swap.test.mjs`
- `d-replay-measure`: `--test` `--test-reporter=tap` `rebuild/lanes/d/p3-replay-measure/measure-family.test.mjs` `rebuild/lanes/d/p3-replay-measure/measure-order.test.mjs`
- `d-capture-start`: `--test` `--test-reporter=tap` `rebuild/lanes/d/p3-capture-start/capture-start.test.mjs`
- `food-live-save`: `--test` `--test-reporter=tap` `rebuild/m3/w6/host/test/food-live-save.test.mjs`
- `w7-import`: `--test` `--test-reporter=tap` `rebuild/m3/w7-preview/import/test/route.test.mjs` `rebuild/m3/w7-preview/import/test/refusal-route.test.mjs` `rebuild/m3/w7-preview/import/test/live-clock.test.mjs` `rebuild/m3/w7-preview/import/test/page-bundle.test.mjs` `rebuild/m3/w7-preview/import/test/refusals.test.mjs`
- `w6-host-seams`: `--test` `--test-reporter=tap` `rebuild/m3/w6/host/test/host-seams.test.mjs`
- `w6-local-source`: `--test` `--test-reporter=tap` `rebuild/m3/w6/test/local-source-admission.test.mjs` `rebuild/m3/w6/test/local-source-consumer.test.mjs`
- `d-replay-all`: `--test` `--test-reporter=tap` `rebuild/lanes/d/p3-replay-all/class-membership.test.mjs` `rebuild/lanes/d/p3-replay-all/sleep-family.test.mjs` `rebuild/lanes/d/p3-replay-all/writer-enumeration.test.mjs` `rebuild/lanes/d/p3-replay-all/writer-order.test.mjs`
- `b-lom`: `--test` `--test-reporter=tap` `rebuild/lanes/d/b-lom/legacy-order.test.mjs` `rebuild/m4/workout/test/legacy-order-mapping.test.cjs`
- `d-port-admission`: `--test` `--test-reporter=tap` `rebuild/lanes/d/p3-port-fix/programme-rule.test.mjs` `rebuild/lanes/d/p3-port-fix/owner-route.test.mjs` `rebuild/lanes/d/p3-port-fix/capture-codes.test.mjs`
- `d-real-shape`: `--test` `--test-reporter=tap` `rebuild/lanes/d/p3-real-shape/real-shape-walk.test.mjs` `rebuild/lanes/d/p3-real-shape/real-shape-capture.test.mjs` `rebuild/lanes/d/p3-real-shape/bar-admit.test.mjs` `rebuild/lanes/d/p3-real-shape/bar-keep.test.mjs` `rebuild/lanes/d/p3-real-shape/r1-fixes.test.mjs` `rebuild/lanes/d/p3-real-shape/q1-producer.test.mjs` `rebuild/lanes/d/p3-layout-v2/layout-v2.test.mjs` `rebuild/lanes/d/p3-layout-v2/projector-parity.test.mjs`
- `sealed-inventory-fence`: `--test` `--test-reporter=tap` `rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs`
- `ui-pack-pins`: `--test` `--test-reporter=tap` `rebuild/lanes/c/ui-port/pack-pin.test.mjs` `rebuild/lanes/c/ui-port/approved-pin.test.mjs`
- `reference-closure`: `--test` `--test-reporter=tap` `rebuild/lanes/c/ui-port/reference-closure.test.mjs`
- `release-object`: `--test` `--test-reporter=tap` `rebuild/lanes/c/ui-port/release-object.test.mjs`
- `today-carry`: `--test` `--test-reporter=tap` `rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs` `rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs`
- `passphrase-normalize`: `--test` `--test-reporter=tap` `rebuild/lanes/c/passphrase-normalize/helper.test.mjs` `rebuild/lanes/c/passphrase-normalize/route.test.mjs` `rebuild/lanes/c/passphrase-normalize/unlock-forms.test.mjs`
- `w6-local-import`: `--test` `--test-reporter=tap` `rebuild/m3/w6/test/local-import.test.mjs`
- `f2-land`: `--test` `--test-reporter=tap` `rebuild/lanes/d/f2/projector.test.mjs` `rebuild/lanes/d/f2/guard-coverage.test.mjs`

## Verified, unresolved, and stopped
- Individually closed (3): `s9-engine-files-differential` was independently reviewed and ran 27/18/45 green under permission 766; `ui-pack-pins` has accepted exact-file evidence; `reference-closure` has a whole-source containment inventory and still needs exact-argv local measurement. Do not infer closure for siblings.
- Known engine/frozen boundary (11, STOP): all five `s9-sup-*`, `m4-import`, `m4-import-production`, `w7-import`, `w6-local-source`, `d-replay-all`, `w6-local-import`. Their public wrappers execute or reconstruct engine/legacy code; permission 766 authorizes protected read/hash/static checks, not this execution.
- Dynamic containment unresolved (19, STOP): `today-17`, `measure-hermetic`, `s4-real-day`, `a0-journeys`, `d-plan-edit`, `d-import-retract`, `d-admission-swap`, `d-replay-measure`, `d-capture-start`, `food-live-save`, `w6-host-seams`, `b-lom`, `d-port-admission`, `d-real-shape`, `sealed-inventory-fence`, `release-object`, `today-carry`, `passphrase-normalize`, `f2-land`. Some immediate targets look synthetic, but bundles/Git/helpers/spawns were not proved transitively safe.
- A fresh Git worktree is isolation from edits, not from reads: it still exposes tracked root old-app/ledger paths and Git history. No active file/network deny mechanism has been established, so policy words cannot be reported as runtime containment.

## Concrete authorized-first route
- Run only `reference-closure` next, after its independent inventory acceptance, from a new no-Git directory containing exactly its test and four public references at the bound head. It uses built-ins only, so no `node_modules` junction is needed.
- Preserve repository-relative layout in that five-file copy; verify all five SHA-256 values before launch. With no `.git`, product, engine, ledger, old app, private, soak, or dependency tree present, those paths are absent rather than merely forbidden by prose.
- Capture PID, exact argv, head/source hashes, exit, TAP tests/pass/fail/skip, and stdout/stderr hashes. Expected evidence is tests 5, pass 5, fail 0, skipped 0; bind a needle only from observed TAP.
- No external or localhost network, subprocess, or writes are used by this child. Stop if observed behavior differs; no custom guard or harness is needed for this five-file route.
- For the remaining 30, first complete per-group dynamic import/call/output review. A group may move from unresolved only with concrete evidence; otherwise it stays stopped and is covered by the later permission boundary.
- Known possible effects to bind during that review: worktree `.tmp/**`/`rebuild/lanes/.tmp/**`; OS-temp fixture prefixes; Today/import bundles; pinned Node/Git/port.cjs/whoami/icacls subprocesses; and ephemeral `127.0.0.1:0`. None is presently an enforced allowlist.
- If a later run uses shared dependencies, use only an NTFS junction to the already-proven `node_modules`; never install or modify it. Outputs remain disposable and never become product bytes.
- Reports exclude owner/private/history/soak data, secrets, raw protected source, and subprocess tails; there is no deploy/import/main/network grant. Full Windows/Linux exact-head CI remains separate.

Prepared later question, not sent: May the reviewed exact S9 children that remain stopped execute the five protected engine modules and the public wrappers that reconstruct fixed frozen legacy code, after each dynamic boundary is reviewed, using only synthetic fixtures and disposable outputs, with no owner/private/history/soak data, no raw source in reports, no deploy or import, and no network except explicitly reviewed localhost?
