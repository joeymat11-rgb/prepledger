# Shared preflight additive CI: B build report

Status: REVIEW CANDIDATE under DECISIONS201; no product/package acceptance. Separate Astra MAX reviewer reads the prospective PM brief before this rationale. B author; PM judge; third integrator. Base14ed03bd961bff49a8674d63e3e3b6def8f33339, code99c73759f4e1ed45ab27b110a1ba7f8b73ba36fa, branch rebuild/astra-preflight-ci, own work/pm-caretaker/b-preflight-ci.

## Changed behavior

- New shared-preflight workflow covers rebuild/** pushes and PRs plus manual dispatch, Windows and Ubuntu, Node22, contents:read, finite timeout and no cancellation/skip/failure fallback. Its exact command is below.
- Anonymous Git initializes non-cone sparsity before source materialization, checks server filtering capability, then fetches only the validated candidate SHA and the two disclosed historical commits with blob:none/depth1. PR checkout uses the PR head SHA, not its synthetic merge SHA. Inputs are environment data, never interpolated shell code.
- The bootstrap writes only six required current blobs plus the optional200 helper. It reads the seven disclosed historical public blobs into Git without writing their source files. It never invokes Git checkout/attribute filters, an archive download or a private/H3 gate. The local blob inventory must exactly match the named public blob IDs; filesystem inventory must exactly match the materialized allowlist. No denied file is opened for a content check.
- No credential/token is supplied or persisted; credential helpers are cleared for Git calls and the fetch remote is removed before tests. This supplies persist-credentials:false semantics without the checkout action's built-in archive fallback. The explicit blob filter follows the [Git fetch contract](https://git-scm.com/docs/git-fetch); the fallback was audited in [pinned checkout source](https://github.com/actions/checkout/blob/11d5960a326750d5838078e36cf38b85af677262/src/git-source-provider.ts).
- Root package/lock files have no root install lifecycle hooks. Workflow npm ci uses the existing lock, --include=dev and --ignore-scripts; no W5/W6 dependency, browser, new dependency, upload, secret or deployment step. TEMP/TMP point to the checked-out workspace's .tmp.

## Exact public input closure

Current: .github/workflows/shared-preflight.yml; package.json; package-lock.json; rebuild/lanes/tooling/preflight.cjs; rebuild/lanes/tooling/test/preflight.test.cjs; rebuild/lanes/tooling/test/shared-preflight-ci-registration.test.cjs; optional rebuild/lanes/tooling/preflight-dash-scan.cjs.
Historical: at2b9b09a564531d415df847cd668ea357233687b2 and0e652ce213b56cd5d73a670e0a761cca8c94b6c3, only rebuild/m3/w7-preview/today/build.mjs, gym-app.mjs and plain-copy.cjs; additionally rebuild/lanes/tooling/preflight.cjs at0e652ce. Missing required input, nonregular file, unsupported filtering or extra fetched blob fails without a broader fallback.

## Executed local evidence

- Before workflow creation: actual registration contract17/17 RED, all WORKFLOW-MISSING assertions, not YAML setup errors. Then actual YAML/source controls22/22 PASS,0fail/skip/cancel,51002ms.
- Exact command at code99c7375:31/31 PASS,0fail/skip/cancel,53709ms, local Windows Node24.19.0. This is the existing nine-cell preflight suite plus22 new registration checks; it is **not200 execution**.
- Sixteen valid-YAML mutations each hit their intended assertion: absent/renamed command, either missing OS, OS override, job/step skip, continue-on-error, swallowed exit, trigger narrowing/lost PR, glob, wrong PR identity, filter removal, added current source and retained remote. Each restores the original positive contract.
- Actual YAML Node body ran over real filtered file:// Git transports in contained synthetic repositories. Only remote URL and the two historical coordinates were substituted; no Git/filesystem/authority function was mocked. Exact current/history reads succeed with no remote remaining; synthetic ledger/private/history/soak canaries stay unmaterialized and their blobs are absent.
- Invalid event SHA, unavailable server filter and a missing public source fail at their intended runtime boundaries. Disabling filter requests/config fetches synthetic excluded blobs and fails UNEXPECTED-FETCHED-BLOB. Removing that inventory assertion makes the same negative unexpectedly succeed; restoring the actual source passes again. No real private data was involved.
- YAML and embedded Node syntax parse; git diff --check is clean. Tests clean only resolved .tmp/preflight-registration-* children after containment checks. Raw synthetic logs stay ignored locally.
- Local npm was unavailable on PATH. The local YAML2.9.0 module was fetched from the existing root lock URL and verified against that lock's SHA512 integrity inside this worktree. Hosted npm ci and Node22 remain actual CI obligations, not claimed as local executions.

Command: node --test rebuild/lanes/tooling/test/preflight.test.cjs rebuild/lanes/tooling/test/shared-preflight-ci-registration.test.cjs

## Remaining evidence and custody

- D200 source aab62dd38079b54db63fd690c908517e2c686167 is separately awaiting D2 review after rejected dae1fb2. No D runtime/test/helper byte is changed or cherry-picked here. Issuer198 and its open R1 work remain in another tree.
- This branch proves workflow scaffolding against the old suite. Exact-head both-OS hosted execution, independent MAX review and final composition with the independently accepted200 bytes remain required. Record run/head/job identities and non-skipped counts; no fake preflight CI id.
- Three changed paths only: new workflow, new SHARED registration test, this report. No existing .github path, b/tooling inventory, runner, product, pin, artifact, receipt, lockfile, private/history/soak source or old seal changes.
- This additive workflow never substitutes for the complete rebuild workflow, D2's launch/preflight acceptance or B196 service. Both workflows must execute at the final composed candidate and integration head under194/GATE-WINDOW.
- Deleting the entire workflow is not automatically detected by unrelated CI. PM/reviewer must independently check its presence and actual jobs; permanent independent package-child/pin registration remains the separately licensed B1+B2 duty. No START, integration or deployment permission is claimed.
