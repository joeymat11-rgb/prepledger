# C-UI Linux witness author report

Role: auxiliary Sol workflow builder, not reviewer or PM.
Status: PROPOSED workflow only; it has not been pushed or executed.
Bound candidate: cf14982050a8169c7f4848ec0bf1f69c2bb5759f.
Auxiliary branch: rebuild/ops-cui-linux.

## Scope

The workflow runs only after a push to the auxiliary branch changes this
workflow. It has contents:read, no persisted credentials, no
deployment, no secret input, no pull-request target and no manual command.
It uses non-cone sparse checkout for only the exact candidate's
approved-2026-09-18 pack. Before helpers run, it verifies the single sparse
pattern and the populated-file footprint, and refuses if old app, source,
ledger or private paths are populated.

Python is fixed at 3.11.15. Disposable-runner dependencies are Playwright
1.56.0, numpy 2.3.5 and Pillow 12.0.0. Playwright 1.56.0 installs its Chromium
revision 1194, version 141.0.7390.37. The last two pins are compatible available
Linux wheels; they are not claimed equal to unrecorded baseline versions.

## Execution contract

The environment fixes MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York and
PYTHONDONTWRITEBYTECODE=1. EARNED_APP and its digest are unset before execution.
No accept flag is present. Shared launch arguments and thresholds are unchanged.

The ordinary gate and full state sheet run sequentially. Their exit codes are
captured separately, so the state sheet still runs after a red or refused gate.
The final step fails for either nonzero outcome.

Before execution, the job proves HEAD equals the 40-character candidate and
records the workflow event SHA and ref. It records tracked and actual pack and
baseline file counts and digests, the prototype app digest, effective dependency
and browser versions, ordinary report identity and both gate outcomes.

After execution, it recomputes tracked and actual pack and baseline digests and
counts. Only intended quality/run output is excluded. Added, removed or changed
source or baseline files make the final job red, including untracked additions.
Symlinks refuse before hashing, so custody cannot read outside the pack.

The seven-day artifact is limited to the concise metadata, two ordinary gate
reports, gate JSON and three synthetic contact sheets. It excludes the repo,
.git, environment, credentials, broad logs and individual state images.

## Limits and next hand

No workflow run, dependency install, baseline write, prototype edit, acceptance
flag, remote action, account change or purchase occurred during authoring.
Hosted Ubuntu rendering may disagree with the committed Linux baseline. That is
a measured red for review, not permission to change a baseline or threshold.

An independent workflow review must approve exact YAML and shell semantics
before PM publication can trigger it. The eventual run must be tied to its run
and job IDs and reviewed as Linux evidence only. It is not C-UI acceptance,
S9/S10 acceptance or an exact-head whole-rebuild green claim.
