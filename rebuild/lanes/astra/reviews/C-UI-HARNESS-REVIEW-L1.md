# CUI harness narrow independent static review L1
VERDICT: NOT READY for a pass claim; narrow correction remains incompletely demonstrated.
Candidate: 86007bca0c5879a6cbb34ad666291eba89f710b9.
Base: fa59c85a35be012cfc4ede66ca444e80c5fb5057.
Harness bytes equal 02079e026dd7985fef0f58d91f031a56667987e7.
Harness SHA256: 792c15a03b2351c30e45f94a0f6cee6de454d2dab161bcab7c6ebb3e195cff9a.
Author report SHA256: 6fbe05c7859fb47207b6fa987e74e431d1108f672970e07b87c82a8ba90a1280.
Reviewer: Astra; separate from author and PM/integrator. STATIC ONLY, no runtime.
Scope: complete browser-check.mjs and its one changed block against base;
then complete 60-line C-UI-1-CODEX-REPORT.md. No other source or retained log read.
Blind source observations were registered with PM before reading the author report.
Source references below mean rebuild/m3/w7-preview/today/browser-check.mjs.
Preserved: all earlier assertions, exact reduced hook equality, draws=1, scheduled=0,
error propagation, context cleanup and final failure exit (484-487, 491-521).
The prior title selector is replaced by session-title plus lift, retaining readiness intent.
Lifecycle at 460-470 visits public Today then hard-navigates to Workout in the same context.
It does not inject a fixture store, fake DOM, scene snapshot or bypass branch.
However instruction/scene readiness alone does not establish completed durable installation
or an active workout. Application lifecycle correctness is not provable from this file alone.
B1: the new visible/active claim at 471-482 is stronger than its actual predicate.
Document-wide first matches need only nonempty text and their own hidden/display/visibility.
A title and lift beneath a hidden or display:none ancestor can satisfy all those checks
while drawing no content; no rendered box or active-container ownership is required.
This is a source counterexample, not an executed reproduction or claimed current product state.
Smallest harness correction must prove the real title/lift are drawn in the active view;
retain genuine element ownership, nonempty checks and every reduced-scene assertion.
Author report 45-46 cannot yet claim that these checks prove visible active content.
Reported run, not independently replayed: author report 49-55 says exit at the existing
33px floor assertion (218/231), with NaNpx; reduced PNG and summary were not produced.
The reported failure precedes the changed block, so this run proves no reduced-block success.
No claim of an actual too-small font follows from NaN; raw style/element identity is needed.
Smallest later diagnostic: instrument only the existing failing long-template sweep row
(203-219), keeping the same input, two-frame wait and 33px assertion unchanged.
Capture raw fontSize, isConnected and identity versus the current matching node before/after
those frames, plus current-node style and rectangle. This distinguishes a stale captured
node from an actual style/fitter failure; detached-node causation is only a hypothesis.
Do not lower the floor, substitute prototype DOM, add arbitrary waits or accept absent proof.
No product repair, full CUI1 audit, runtime replay, visual acceptance or gate bypass performed.
Runtime was already released; this reviewer holds no process or slot.
Full CUI1/fidelity, reduced proof, Linux/CI, Claude, seal and integration remain separate gates.
