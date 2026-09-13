# Shared preflight: additive CI assignment

Prospective scope under DECISIONS201, based on112/135/178/193/194/200. This is PM-owned CI plumbing assigned to B, with independent Astra MAX review and a third integrator. No engine seal or existing workflow changes.

## Purpose and custody

B's inventory99f6c0b correctly identifies rebuild.yml as H3's sealed product post-image. Adding the200 suite there must wait for the reviewed B1+B2 repinning package. This separate assignment supplies real Windows/Ubuntu proof before launch without changing that file or the seal.

B creates a fresh own worktree `work/pm-caretaker/b-preflight-ci`, branch `rebuild/astra-preflight-ci`, from the real integration tip. Verify resolved containment before creation; every command selects that tree. Exactly these writable paths:

- `.github/workflows/shared-preflight.yml`, a new PM-owned workflow.
- `rebuild/lanes/tooling/test/shared-preflight-ci-registration.test.cjs`, a new actual-YAML contract test using the already pinned root yaml dependency. This new file is explicitly assigned to B; D's existing preflight.test.cjs remains D custody.
- `rebuild/lanes/b/BUILD-REPORT-SHARED-PREFLIGHT-CI.md`, at most60 lines, and own branch coordination notes.

No package/lockfile/dependency change, other .github path, engine/client/app/conform/m4/pin/receipt/accepted artifact edit. The original proposed new test under lanes/b/tooling/test is outside this license: H3's fidelity scan closes that subtree and would refuse an unlisted source change. The shared lanes/tooling/test path above avoids changing that sealed inventory. D retains every200 runtime/test/helper byte. B must not silently cherry-pick unreviewed D bytes or mix issuer198 into this branch. Any additional path or historical input is reported before use.

## Workflow contract

1. Match the existing rebuild branch push and pull-request coverage (`rebuild/**`) and permit workflow_dispatch. No path-filter narrowing, deployment, write permission, secret, artifact upload, scheduled job or owner-data access. Set contents:read, persist-credentials:false, fail-fast:false, Windows and Ubuntu jobs, fixed Node22, finite timeout, and no cancel-in-progress of required evidence.
2. Use a partial public allowlist checkout with blob filtering and non-cone sparse paths. Do not create a broad cloud checkout or materialize ledger, conform/private, src/history.js or soak. The new workflow itself, root package.json/package-lock.json, the new registration test and D's exact200 runtime/test/helper are the only current file inputs. Fetch the commit history needed for the disclosed public historical blobs without fetching all historical blobs. Before execution assert expected files exist and prohibited paths are absent without reading them. Official actions/checkout documentation says filter overrides sparse-checkout: supplying both inputs is insufficient. Use an audited sequence that initializes Git sparsity BEFORE the first checkout/materialization, with filtered fetches and no full checkout/archive fallback. Fetch/checkout only the validated event identity; do not interpolate untrusted branch text as shell code. Missing public inputs fail, never trigger a broad checkout fallback.
3. D's disclosed historical inputs are only today/build.mjs, gym-app.mjs and plain-copy.cjs under rebuild/m3/w7-preview at2b9b09a564531d415df847cd668ea357233687b2 and0e652ce213b56cd5d73a670e0a761cca8c94b6c3, plus shared preflight.cjs at0e652ce. Test code must not introduce a broader Git read. These are public source blobs, not private/history fixtures or an H3 invocation.
4. Install only existing root locked dependencies with devDependencies included. Confirm root install hooks do not traverse omitted source or private paths. No W5/W6 install or browser/H3 process is needed for this workflow. Keep scratch output bounded and cleanup contained; only synthetic fixtures and summary test output.
5. Run exactly `node --test rebuild/lanes/tooling/test/preflight.test.cjs rebuild/lanes/tooling/test/shared-preflight-ci-registration.test.cjs` on each OS. No glob, omission, condition, retry loop, continue-on-error, swallowed exit or success fallback. The command must execute the actual candidate files, not copied stand-ins.

## Independent evidence

- Before implementation, absent workflow must fail the registration contract with the intended assertion. Execute the real YAML parser and actual files; do not mirror a generated expected report.
- Isolated source mutations remove/rename the suite command, lose either OS or replace the matrix, add job/step skipping or continue-on-error, swallow command failure, narrow triggers, replace exact test paths with a glob, or weaken checkout boundaries. Each must fail the intended assertion and restore its positive control. Parser errors are not successful mutation kills.
- Verify the actual200 regression child on the reviewed D head after composition, with its original26-hit reproduction, positives, genuine-copy negatives and classifier source mutants. Workflow scaffolding tested against the older suite is not proof of200.
- Independent MAX reviewer checks workflow, public checkout/input closure, actual registration controls and both-OS job evidence at the exact composed head. It does not run private/H3 gates. D2's separate200 runtime review remains mandatory.
- Before final200 execution, record its exact reviewed source head and close the current/historical public input list. Record real run/head/job identities and nonzero counts, zero failures/skips/cancellations. Bind evidence to actual checked-out event SHA; a PR synthetic merge is not the candidate branch head. An absent workflow, skipped job, different SHA or separate green workflow fails the PM's admission bar. Shared preflight's CI id is human-attested: verify real evidence before supplying it.

## Integration and lasting registration

This additional workflow does not replace the full existing rebuild workflow, D2's launch review, B196 H3 service or194. Both workflows must be green at the final composed candidate and final integration commit. Follow GATE-WINDOW.md: publish preparation docs before START, then own-branch/direct updates only, validate final commit before fast-forward publication.

The registration contract checks this workflow's actual command and can be run independently. Do not claim removing the entire workflow would automatically be caught by unrelated CI; PM/reviewer exact-head admission must independently verify its presence and executed jobs. Permanent independently declared package-child and pin registration still rides the reviewed B1+B2 successor as described in B's original proposal. No change to H3, new package profile, machine receipt, FULL waiver or automatic removal of this additive workflow is authorized.

B returns its isolated candidate and truthful report. Separate reviewer runs the bar before reading the builder rationale. PM judges; author and reviewer never integrate their own work. All existing release, owner-data and science controls remain.
