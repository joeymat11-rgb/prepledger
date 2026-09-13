# Shared preflight regression CI: prospective registration

Status: PROPOSED, docs only. B author; PM accepts scope, a different reviewer checks implementation, a third role integrates. Audit base a9b444e7d5fb86ac5047c72320a75ed34d3b2471. DECISIONS135/178/184/194/200 and112/136/186/193 govern. This does not expand issuer198 or license workflow/pin edits.

## Finding and the existing authorized route

No current workflow command names `rebuild/lanes/tooling/test/preflight.test.cjs`; no H3 child invokes it. The shared scanner/test are not directly pinned by the accepted H3 artifact. Consequently a green existing rebuild run does not prove the200 regression suite on either OS.

The existing both-OS home is `.github/workflows/rebuild.yml`. Its current SHA256 is `34bec65a549a8d29128da3fe1bf08398c0cab47298c094c154f0e42a3614e882`, exactly H3's **product** post-image in `rebuild/m4/spec/acceptance-h3-clean-init.json`. It is not an unpinned file. The older execution-pin description does not describe its current H3 role.

DECISIONS112(1) allows a lane to edit this workflow only inside a reviewed engine package that re-pins it. All other `.github` paths are PM-owned and require a REQUESTS assignment. Existing slice-host is Ubuntu-only, integration-only and deploys; prod-check/deploy are other PM-owned jobs. None is an existing authorized B both-OS regression slot. Mere absence from a pin map grants no ownership.

Under178/186/191, the next registered workflow inventory change rides B1+B2 after launch. Do not patch rebuild.yml beside H3, rewrite an accepted H3 pin or quietly register this through issuer198.

## Exact proposed CI surface

1. `.github/workflows/rebuild.yml`: one named shared-preflight step in existing `public-gates`, before the cumulative package step. Preserve both OS entries, existing commands, branch/PR triggers, permissions, installs and failure propagation. No glob, path-trigger narrowing, conditional skip, continue-on-error or shell success fallback.
2. `rebuild/lanes/b/tooling/test/shared-preflight-ci-registration.test.cjs`: new B-owned workflow contract and fail-first tests. Parse actual YAML with the already pinned root `yaml` dependency, like A5's workflow test; no package/lockfile edit. Do not verify a copied sample or a report's claim.
3. `rebuild/lanes/b/BUILD-REPORT-SHARED-PREFLIGHT-CI.md`: bounded executed evidence and exact heads. This brief and STATUS/REQUESTS are the only present writes.

D retains200 custody: `rebuild/lanes/tooling/preflight.cjs`, `rebuild/lanes/tooling/test/preflight.test.cjs`, optional `rebuild/lanes/tooling/preflight-dash-scan.cjs`. Registration consumes independently reviewed exact bytes without modifying them. D reports only these historical Git reads: today/{build.mjs,gym-app.mjs,plain-copy.cjs} under rebuild/m3/w7-preview at2b9b09a564531d415df847cd668ea357233687b2 and0e652ce213b56cd5d73a670e0a761cca8c94b6c3, plus original preflight.cjs at0e652ce. Missing blobs fail. The existing full-history checkout supplies them; this command introduces no new checkout, cloud data-copy route or private/H3 invocation. Final D source head and independent review remain pending.

Regression command: `node --test rebuild/lanes/tooling/test/preflight.test.cjs`

Proposed workflow step: `node --test rebuild/lanes/tooling/test/preflight.test.cjs rebuild/lanes/b/tooling/test/shared-preflight-ci-registration.test.cjs`

## Package obligations, never edits to the old seal

The licensed B1+B2 successor must declare this workflow as an edited H3 **product**, with the exact pre-image above and reviewed new post-image. The registration test and shared runtime/test/helper closure need execution pins and a mandatory actual child invocation. Deleting the workflow step must also fail that independently declared package child; self-registration alone is insufficient.

B1.json/B2.json under `rebuild/lanes/b/tooling/packages/` are old separate PROPOSED profiles; the runner has no combined B1+B2 id. Before implementation, the combined-package brief must name its exact profile/runner/child/artifact/review/receipt paths and reviewed successor changes. This brief invents no accepted profile. Do not edit H3.json, acceptance-h3-clean-init.json, review-h3-clean-init.json or receipts/H3.json to admit this hunk.

Review must cover the changed workflow and pins with the bundle. Preserve136's first FULL/private verdict, original/cumulative evidence and successor duties, current-chain ancestry, machine receipt and authorized post-receipt rerun. Use byte-identity reuse only when its existing conditions hold; changed required bytes demand the prescribed FULL. The separate issuer successor must be accepted before a package depends on its new authority semantics. No receipt, supersession token or package PASS is issued here.

## Fail-first acceptance controls

- Baseline workflow fails because the exact command is absent; restored candidate passes. Run the actual200 regression child, including its positive, visible-copy negative and source-mutant controls, on both OS.
- Mutate real workflow bytes: omitted/renamed regression command, missing either OS, one-OS override, job/step condition, continue-on-error, success fallback, lost rebuild push/PR trigger, glob or narrower selection must each cause the intended assertion failure. Restore bytes and positive assertion after each; unrelated YAML parse errors do not count.
- Remove the workflow step: the independently declared package child must fail. Remove that child or omit a test/runtime/helper pin: the reviewed profile's closed inventory/admission checks must fail. Prove both routes before claiming registration is self-protecting.
- Record actual workflow run id, exact head, both job conclusions and named test step success with nonzero counts, zero failures/skips/cancellations. A different head, one successful OS, a skipped step or another green workflow does not qualify. The entire required rebuild workflow, including Today and H3, remains mandatory.
- `--ci-run` is a human-attested identifier; shared preflight does not verify GitHub results. Check real job evidence before supplying it. Synthetic fixture ids prove parser controls only. Preserve the old26-hit FAIL and200's corrected CI-UNVERIFIED boundary.

## Scheduling consequence for PM

The current route creates a dependency conflict:200 requires both-OS proof before adoption,178 puts workflow repinning in B1+B2, and194 holds that bundle behind launch. This proposal waives none of those conditions. Keep full launch validation held before explicit START until PM routes the CI home.

Earlier proof would require a separately assigned PM-owned additive workflow with its own concrete scope, public-input/custody audit, independent review and fail-first registration evidence under112/193. That is not an already authorized unpinned B slot. This is routine PM routing, not a new owner product decision. Current acceptance requested is for this inventory and prospective registration bar; implementation remains held for the named package or separately licensed PM route.
