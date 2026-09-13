# Shared preflight additive CI: B build report

Status: REVIEW CANDIDATE under DECISIONS201; no product/package acceptance. Separate Astra MAX reviewer reads the prospective PM brief before this rationale. B author; PM judge; third integrator. Base14ed03bd961bff49a8674d63e3e3b6def8f33339, scaffold code99c73759f4e1ed45ab27b110a1ba7f8b73ba36fa, composed code2422d299a3755edac3a6d46df56c868691006e4b, branch rebuild/astra-preflight-ci, own work/pm-caretaker/b-preflight-ci. Draft [PR52](https://github.com/joeymat11-rgb/prepledger/pull/52).

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
- Local npm was unavailable on PATH. The local YAML2.9.0 module was fetched from the existing root lock URL and verified against that lock's SHA512 integrity inside this worktree. Local Node remains24.19.0; hosted scaffold Node22/npm ci evidence follows separately.
- Scaffold push CI34740611376 at3943bbaae2983cb38699568e099378375a9eee3b: Ubuntu103679565512 and Windows103679565615 both31/31,0fail/skip/cancel. Each actual checkout printed that exact head,6current/7historical inputs,12unique public blobs,no fetch remote; the exact test command executed successfully. Existing complete rebuild34740611344 FAILED; scaffold green does not waive it.
- After explicit PM201 composition routing, the exact command at composed code2422d299a3755edac3a6d46df56c868691006e4b passed67/67,0fail/skip/cancel,58483ms: the actual reviewed45-cell D200 suite plus22 registration checks. No D byte changed during adoption. Hosted composed-head evidence remains pending at this report.

## Reviewed D source identity

Source aab62dd38079b54db63fd690c908517e2c686167; independent D2 runtime ACCEPT ddba29db427ef35e1c8ee92169769c9ad78095b2. PM explicitly licensed these three unchanged source blobs for201 composition. Each disk byte equals the source Git blob; issuer198 is absent.
- rebuild/lanes/tooling/preflight.cjs:11181bytes,SHA256093876148664f3e9cad7ca4afce92c5abbba84ecc00c518b57430ce054a01499.
- rebuild/lanes/tooling/preflight-dash-scan.cjs:9260bytes,SHA25692f3b22380f9dab0266434adcd43dd6cceab89463d62bbe37ae0bf09e3ac52af.
- rebuild/lanes/tooling/test/preflight.test.cjs:21575bytes,SHA256fd1d1646e0f7b45cb7550814597ea601c10dcb2be63b9b15f262650cf93bf8b7.

Command: node --test rebuild/lanes/tooling/test/preflight.test.cjs rebuild/lanes/tooling/test/shared-preflight-ci-registration.test.cjs

## Remaining evidence and custody

- Rejected D dae1fb2 and scaffold3943bba evidence remain preserved. D retains authorship/edit custody; issuer198 and its open R1 work remain in another tree. No runtime review is self-issued here.
- The composed branch executes the actual reviewed200 suite locally. Exact composed-head both-OS hosted execution, independent MAX workflow/input review and final launch composition remain required. Record run/head/job identities and non-skipped counts; no fake preflight CI id.
- Six changed paths only: new workflow, new SHARED registration test, this report and the three exact D source blobs above. No existing .github path, b/tooling inventory, runner, app/engine/client product, pin, artifact, receipt, lockfile, private/history/soak source or old seal changes.
- This additive workflow never substitutes for the complete rebuild workflow, D2's launch/preflight acceptance or B196 service. Both workflows must execute at the final composed candidate and integration head under194/GATE-WINDOW.
- Deleting the entire workflow is not automatically detected by unrelated CI. PM/reviewer must independently check its presence and actual jobs; permanent independent package-child/pin registration remains the separately licensed B1+B2 duty. No START, integration or deployment permission is claimed.
