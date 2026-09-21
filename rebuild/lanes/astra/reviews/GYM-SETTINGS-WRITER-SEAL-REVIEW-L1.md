# GYM-SETTINGS-WRITER-SEAL independent review L1
Verdict: REJECT. One executed blocking regression; full review remains unfinished.
Reviewer: Astra, separate from author, PM and integrator. Date: 2026-09-21.
Candidate: 06d07b2eeea7007bdb07bf12bb4b811a8d0eee17.
Accepted base: b35a48e35a1f3e3c278c377934794a32b632535b.
Paper: 6fe4d12c:rebuild/lanes/c/GYM-SETTINGS-WRITER-SEAL-SPEC.md.

Blind phase: read paper and all changed product/test hunks before author report.
Read red26805bed-to-candidate assertion changes, plus untouched gym test inputs.
Read PM custody note bc25b91 and DECISIONS:628/:684/:686 after source phase.
The whole author report was read only after independent source/runtime conclusions.

GSS-L1-1 BLOCKING: an older Save leaves its replacement editor disabled.
Cause: gym-app.mjs:256 paints Save.disabled from facade.settingsBusy().
gym-settings-lane.mjs:249-255 clears that busy flag after settlement but enables
only a binding whose editor token equals the ORIGINAL operation's token.
The replacement's current Save therefore remains disabled after the slot clears.
Repro: Open, enter valid answers, Save with deferred host, Open a replacement,
type its answers, then settle the older save as success, refusal, or rejection.
The replacement remains visible and retains its answers, but its Save cannot retry.
An unrelated repaint can mask this defect; no such extra action belongs to Save.
Contradiction: B requires flags/disabled cleanup and permits retry after failure;
E requires old/new disabled/tap parity and replacement ownership on late completion.
Required correction: release current busy presentation without clearing, erroring,
focusing or taking over the replacement; retain reservation through real settlement.
Add a mounted regression for all three settlements and one exact retry afterward.

Independent contained run: replacement-editor.mjs, terminal22753, exit0.
24 completed cases: 2 immutable versions x 3 settlements x 2 theme attributes
x same/replacement editor. Actual mountGym and shipped templates, synthetic model/host.
All 6 candidate replacement cases: Save still disabled, retry leaves save calls at1.
All 6 baseline replacement cases: enabled Save, retry reaches save calls2.
Same-editor refusal/rejection controls: 8/8 retries succeed across both versions.
Both versions preserve rejection for the controlled pre-write rejected promise.
The baseline is read from its Git blobs; only module import URLs are relocated.
Original baseline blobs and transformed copies are retained with the run.
Evidence root: %TEMP%/gss-review-l1-56b98ccf87b748e48a482fb6867442c8/.
Files: replacement-editor.mjs; replacement-editor-results.json.
Runtime: pinned codex-primary-runtime Node; TZ=America/New_York;
MEASURED_TEST_NOW=2026-09-03. Sole runtime slot released after terminal completion.

Scope limits: jsdom theme attributes are not a phone-browser visual inspection.
No real repository write/reopen was involved in this bounded admission/UI proof.
All17 groups, their meaningful defect plants, full mounted Section E UI parity,
and complete serialized operation/outbox parity after reopen remain to be verified.
The author's three helper/host-reference comparisons do not discharge Section E.
D2: PM manifest/custody note read; 12 identified cells plus2 supports does not equal
the accepted13+2. Missing lifecycle APIs and reported failing cells are not passes.
No D2 cell, focused suite, browser group or further mutation was rerun in this slot.
No archived lifecycle code, guard waiver or revised acceptance count is authorized.
Stop ordered by PM after decisive proof; this is a first rejection, not full acceptance.
Candidate product bytes unchanged; no commit, push, fetch, private read or deployment.
Still owed: correction/replay, remaining independent checks, Claude final review,
exact-head Windows/Linux CI, separate integration and seal. No package accepted/sealed.
