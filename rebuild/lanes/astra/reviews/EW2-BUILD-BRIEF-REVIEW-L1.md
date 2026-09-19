# EW2 build brief independent review, loop round 1
Reviewer: Astra (Codex), commissioned under DECISIONS:412, :569, :613 and :621; blind review, loop round 1; highest effort
Head reviewed: cecae7a8121ea19c75dde42aae8d260056a34065
VERDICT: REJECT

Two executed blocking counterexamples. The brief correctly stops all product work for E-R39; this review does not lift that STOP or authorize either E-R41 handoff.

## BLOCKING

B1 - The amended note answer does not fit the measured card hunk; Save can supersede a hidden saved setting.
Brief sentences: B6 builds the resolver "from ew2b-r42-proto-notice.mjs"; B7 says "The card reaches B6's resolver"; 6.3 recommends "1 added, 1 removed, net 0". Section 6.1 keeps machine-settings-view.mjs at zero bytes.
Invariant: a resolved saved note seeds its correction draft, and unmatched notes remain visible without blocking that note.
Input: the real durable machine host saves Seat=4/Pause and an orphan Pad=2/Slow note; a synthetic admitted generation maps the requested lift and leaves the orphan unmatched. I link cc87c072's actual gym-app and gym-settings-lane in scratch with exactly E's dynamic call replacement and B6's resolver. The real host is injected through the card's existing test seam; no read or Save is stubbed.
Command (the same environment precedes every Node run below):
```powershell
$env:MEASURED_TEST_NOW = '2026-09-03'
$env:TZ = 'America/New_York'
& 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' "$env:TEMP/astra-ew2-build-l1/linked-card.mjs"
```
Output, exit 0 (the probe asserts the counterexample):
```text
resolver draft={"rows":[{"name":"Seat","value":"4"}],"cues":"Pause"}
resolver notice=Some notes you saved could not be matched to a machine after your import.
control editor={"name":"Seat","value":"4","cues":"Pause"}
patched block=No settings saved yet.
patched notice visible=false
patched editor={"name":"","value":"","cues":""}
after card Save latest.machine={"exercise_id":"demo-press","cues":"New cue"}
old immutable op unchanged=true
```
Mechanism: latestNoteOn now returns {record,notice,...}; the unchanged cache, renderBlock and draftFrom consume a bare record. Entering one new cue and saving replaces the visible note with a cue-only note, losing the hidden setting from the latest note although the old operation survives.
Correction: specify and count the answer-to-cache/card/draft handoff and notice rendering, name every consumer file permitted to change, and execute linked EW-25 with this Save continuation. The current E count measures an incompatible call replacement; fixing the export name alone does not fix it. Do not spend an additional sealed or zero-byte file implicitly.

B2 - D3's recommended zero-byte route bypasses immutable-operation authentication and applies a saved edit to the wrong lift.
Brief sentence, 3.1: "The new lane takes ONE repository.load() and reads the PRODUCT'S OWN projector twice over that one generation object"; the table calls this an authenticated load, and recommends ROUTE 1 as equivalent to the host.
Invariant: an encrypted container is not proof of the saved operation's immutable identity.
Input: save update sets=5 on press-old through the real host; change only members[0].value.edit.exercise_id to row-old through the scaffold's encrypted repository commit, leaving the operation's commitment/signature unchanged. This is the existing PE09-auth fault class, not a changed projector or assertion.
Command:
```powershell
& 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' "$env:TEMP/astra-ew2-build-l1/d3-auth.mjs"
```
Output, exit 0:
```text
input saved press-old sets=5 ok=true
control press/row=5/2
host read=false code=LOCAL_HISTORY_IDENTITY_UNPROVEN
route1 press/row=2/5
route1 applied_ids=1
```
Correction: withdraw ROUTE 1's authenticated-equivalence claim. Preserve the host's lane.reopen/history-authentication boundary when obtaining both views; add this negative control and the refusal envelope to EW-13c/EW-14. Prefer the PM-authorized ROUTE 2 candidate, which I also executed successfully below. No authorization follows from this recommendation.

## NOTES

The two blockers and N1-N7 are the nine missing or incorrect build instructions I would return, ordered by consequence within severity.
N1 - D10 is only restated with "none in EW2", although DECISIONS:621(6) explicitly orders D10 a failing row; name the build/S10 owner, the chosen Start/readiness rule and a stored-Start journey across midnight.
N2 - D5 and D6 have only partial operational answers: name every roster consumer and its attribution/count row, then settle the admission envelope and permitted slug/reserved-id provider path instead of promising to name it later.
N3 - D8's three missing states are not completed by section 8's copy proposals: add pending-only, plan_edit_basis/default failure and failed-authentication input/output rows, with retention/proven-plan claims conditional on actual evidence.
N4 - The ordered build omits an H1 construction step, the added local-source reader and today-lanes wiring; add them, their owned paths and their predecessors, and explicitly put B11's moved adoption gate after the Today split seals.
N5 - The D11 counter misses host.all's internal load; the card-call assertion accepts an empty notice; strengthen those boundaries rather than claiming every reintroduced second load or silent card answer fails.
N6 - D4's two-line candidate is not smallest: a one-line options.planBasis handoff works; remove 3.2's contradictory ROUTE 1 "RECOMMENDED" heading, and describe its executed control as sequential era reopenings, not proof of two concurrently live clients.
N7 - Correct the evidence register: B0 needs 28 selectable IDs (27 in spec 5 plus EW-25), not 23 plus one; distinguish estimates from diff counts, replace "FINAL" with a base-specific budget, and mark the CI registration's S10-versus-EW2-child ownership/order explicitly.

## NAMED DEBTS

All fourteen quoted debt lines compare verbatim with 4c7af766's EW2-SPEC-RECHECK-L2.md: 14/14 equal. D9's labeling correction is discharged; D12's remedy is superseded by E-R42. No new spec round is requested.
Carry these remaining build obligations verbatim:
ND1 - Count machine-note reads at the shared durable boundary, including reads reached through lane.all; prove one generation supplies both note rows and correspondence, and make a two-generation mutant fail.
ND2 - Preserve the full EW-25 control set while adding E-R42: resolved document and native notes, unresolved-only refusal, confirmed absence, no notice with no orphan, both winner date orders, same-label re-add, and a linked card that renders the notice and preserves the saved draft through Save.
ND3 - Publish the exact build base and a complete owned-file/hunk budget after the Today split and the PM's E-R39/E-R41 rulings; keep D1's mixed-history/second-selection/rollback obligations and the linked-card requirement open until executed.

## Answer (2): E-R39

YES, measured through real admission. support.mjs uses custody importBundle, importCustody.load, reviewSource, prepareSource, localSourceCommitCapability.publish and reconcile. The three author cells do not directly install their admitted fixtures.
My separate routes-and-admission.mjs creates two fresh synthetic installations. One attempts both files hot; the other closes the era after A and reloads before either second attempt. Each bundle is created by the real port in OS temp. Exact output:
```text
R39 hot first-A ADMITTED view.ready=true
R39 hot same-A REFUSED custody LOCAL_IMPORT_ALREADY_PRESENT
R39 hot different-B ADMITTED view.ready=true
R39 cold first-A ADMITTED view.ready=true
R39 cold same-A REFUSED custody LOCAL_IMPORT_ALREADY_PRESENT
R39 cold different-B ADMITTED view.ready=true
```
The author's pin additionally admits a third never-carried file after reload; selections accumulate 1/2/3 and the singular derived basis moves. The open probe's cold journey instead retries already-carried B and refuses: those are different inputs, not the same journeys.
Section 0 and 2.1 correctly STOP every EW2 product byte pending the PM. No cross-second-admission plan-edit/note correctness or rollback follows from these admission-only measurements.

## Answer (3): E-R41

D3: ROUTE 1 costs zero existing-product bytes and one repository load, but B2 disproves its required invariant. Two ordinary host reads cost two loads and do not bind one generation. The 13-added/0-removed ROUTE 2 touches zero-byte plan-edit-host.mjs and requires the PM's grant.
I executed the actual 13-line candidate, through the same scaffold and host verification, rather than only parsing it:
```text
D3 route2 read=true current/pending=2/5 loads=1
D3 route2 bad read=false code=LOCAL_HISTORY_IDENTITY_UNPROVEN
```
Recommend ROUTE 2 with its negative controls. No globally smallest safe zero-byte route has been established. durableRevision=4 is a revision, not a generation; its presence does not contradict D3's original sentence that the save reply exposes no committed generation.
D4: the author's unmodified path stores ERA-LABEL-ONE despite the per-call label; its sequential reopen control stores ERA-LABEL-TWO. The proposed two-line patch is +2/-2 in today-bindings.mjs. My smaller same-contract patch changes only the resolver line to `planBasis: options.planBasis || planBasis`, +1/-1, leaving destructuring unchanged.
Executed on ONE era, through complete real workouts and durable session-start reads:
```text
D4 one-line Start1={"label":"CALL-ONE","starts":1}
D4 one-line Start2={"label":"CALL-TWO","starts":2}
D4 one-line default={"label":"ERA","starts":3}
```
Recommend that one-line handoff for the PM's ruling. It still touches a zero-byte file and is not authorized. My first default-control date was a rest day and correctly refused ENGINE_CAPTURE_NO_WORKOUT; rerunning that control on the fixture's next workout day preserved the default. No row was removed.

## Answer (5): D1-D14 as orders with defect-sensitive rows

| Debt | Build instruction / row assessment |
|---|---|
| D1 | STOP is correct; B1/EW-21 orders the mixed-history admission control. Cross-second-admission and rollback remain for the PM's answer. |
| D2 | B11/EW-24 orders destroyed-client recovery from stored intent; explicitly add BOTH committed and uncommitted outcomes, since the cited r6 witness only closes/cancels a host after commit. |
| D3 | B12/EW-13c/EW-14 is an order with a pending grant, but its recommended mechanism fails B2; include immutable-history authentication in the row. |
| D4 | B13/EW-14 names durable plan_basis assertions; genuine order with pending grant. One-line alternative measured above. |
| D5 | PARTLY RESTATED: B9/EW-22 adds a persisted roster/count assertion but never names/wires all required consumers or their past/current/pending/tombstoned/removed/re-added history journeys. |
| D6 | PARTLY RESTATED: B9/EW-23 says the envelope is asserted, without settling spec 13.4's LOCAL_SOURCE_PROGRAMME_UNRESOLVED versus EW-23's PLAN_EDIT_FILE_HANDLE_OCCUPIED, or naming the permitted minting boundary. |
| D7 | B10/EW-17d orders pre-fold projection and raw RangeError containment; the spec supplies the default. Add editor/admission validation and diagnostic-retention assertions so the complete debt is held. |
| D8 | PARTLY RESTATED: replacement copy exists, but no completed three-state extension; the proposed C1-versus-C2 assertion cannot hold the omitted states. |
| D9 | Explicitly restated because already discharged; no new product row owed. |
| D10 | ONLY RESTATED, explicitly no row. This does not meet :621(6). |
| D11 | B6/EW-25 is a real order and the prototype uses one load; its row misses the two-load mutant below. |
| D12 | B6/EW-25 carries the amended two-arm order; the pure function journeys fail for the five named defects. Linked notice delivery fails B1. |
| D13 | B7/EW-25 orders a linked execution and names the export, but the actual linked contract fails B1; fix the path/browser/answer contract and its counted consumers together. |
| D14 | B6/EW-25 asserts literal document provenance, refusal code and rejection keys; my independent source mutants for each are killed. |

Thus D10 is wholly restated; D5, D6 and D8 remain partly restated despite their row labels. D9 is intentionally and correctly restated after discharge. Other rows are build orders, not claims that their future implementation already passes.

## Measurements (1), (4), (6) and (7)

All runs used the mandated Node executable and separately set environment variables, sequentially. Scratch is C:/Users/joeym/AppData/Local/Temp/astra-ew2-build-l1. Copied spike/support modules have only their module locations relocated; no source file in the worktree was patched. The resolver was also imported alone (silent exit 0), and is exercised by the journey.

| ew2b program | Observed result versus brief |
|---|---|
| r39-probe | Exit 0; hot different B admits; cold already-carried B refuses. |
| r39-second-admission | Exit 0; hot B and cold never-carried C admit; all pin assertions hold. |
| r39-retention | Exit 0; both selections retain basis/identity_review/order_map member; both order_map values are null. |
| r40-hunk-e-base | Exit 0 at reviewed head and extracted cc87c072 Today blobs; static/dynamic counts reproduced. |
| r41-d3-generation | Exit 0; healthy-input 2-versus-1 loads, revision 4, different 2/5 views equal to host; its 13-line candidate count reproduced. B2 breaks equivalence. |
| r41-d4-planbasis | Exit 0; ignored per-call option, sequential second era label and +2/-2 patch reproduced. |
| r42-proto-notice | Silent import/exit 0; exercised through real durable host journeys. |
| r42-journeys | Exit 0; both arms and all five output-wrapper mutants reproduce. |

Line-for-line comparison of all eight printed transcript blocks: 33 nonblank quoted lines, 22 exact and 11 differing only in horizontal whitespace; zero different values. The brief combines lines from distinct R39 cells. The pin prints "operations written by either admission 1", actually the setup-inclusive total; its equality assertion proves zero increment, not that the total is zero or that all disk bytes are unchanged.
E-R42: both pure answer arms have journeys. I separately changed sixteen individual source clauses, without changing any journey assertion: nine killed, seven survived. Killed: missing notice, removed refusal, wrong refusal literal, wrong provenance, wrong unmatched key, missing rejection keys, dropped card record, vetoing a resolved match, and an extra direct load.
Survived, each exit 0: replace machineSettingsIn(generation) with await lane.all(); return an empty notice from latestNoteOn; replace the notice with "All notes matched."; refuse confirmed absence; remove native fallback; remove first-run fallback; choose resolved[0] instead of coach latestFor. The first two specifically refute 4.4/4.5's coverage claims; other survivors identify controls the complete EW-25 must retain. No survival is itself claimed as an additional executed athlete-data loss.
The "confirmed absence" control actually queries file-press, which has a resolved note. It proves no notice when all notes match; it does not exercise blank absence. D11's counter wraps counted.repository.load, while counted.all invokes host.all outside that counter.

Independent budget diffs use `git diff --no-index --numstat -- <scratch-before> <scratch-after>`; zero-context physical hunks were counted separately. Existing Unicode is escaped equally on both sides. The reviewed head has no product diff from 1ad61cfe on the measured files.

| File / named item | Independent finding |
|---|---|
| plan-edit-model.cjs H1 | No completed hunk in ew2b; "unchanged from v4" is a design reference, not a diff count. Its export is absent at HEAD. |
| plan-edit-model.cjs H2 | +24/-2, net 22; three zero-context physical hunks; author loader's exact transform captured independently. |
| plan-edit-model.cjs H3 | "about 4 added, 1 changed" remains an estimate, not an executable diff in this package. |
| source-admission.mjs A | No implemented per-capture hunk to diff; depends on absent H1 and F2. |
| source-admission.mjs B | "v4's estimate plus" is unmeasured, including the zero-capture proof. |
| source-admission.mjs C | 6-10 plus 8-12 lines are estimates; reader/provider integration is not priced. |
| source-admission.mjs D | My view-member insertion is +1/-1, one hunk; programmeBasis already returns the map. Count-only: no provenance/second-admission correctness credit. |
| local-source-basis.mjs added export | Named authorization inherited; export absent at HEAD, no ew2b implementation to diff. |
| today-entry.mjs createEditWeekEntry | Named allocation, not an implemented or counted patch here. |
| edit-week-lane.cjs / machine-note-identity.mjs | New product allocations, absent at HEAD; the Node prototype is not a verified browser module. |
| gym-app.mjs E at HEAD | Static +2/-1 (two physical hunks); dynamic +1/-1 (one). |
| gym-settings-lane.mjs E at cc87c072 | Static +3/-1 (two physical hunks); dynamic +1/-1 (one). Count correct, integration fails B1. |
| plan-edit-host.mjs optional D3 | +13/-0, two hunks; executed both valid and tampered histories. Pending authorization. |
| today-bindings.mjs optional D4 | Author +2/-2, two hunks; independent alternative +1/-1, one. Pending authorization. |
| today-lanes.cjs | Missing from brief 6.1 despite spec 3.3 expressly allocating wiring and the moved adoption gate. |
| .github/workflows/rebuild.yml | Registration remains a PM-owned, unimplemented allocation; no exact hunk to diff. |

No aggregate exact sealed-byte total is justified by this table. "Nothing here is estimated" is false against its own H3/B/C entries. The remaining zero-byte names receive no implied permission from these measurements. The F2 setup-tags landing is a separate prerequisite allocation, not a hidden EW2 hunk.
Build order: HEAD lacks setup-tags.cjs, today-lanes.cjs, gym-settings-lane.mjs, edit-week-lane.cjs, the note resolver and edit-week.test.mjs; foldPlanEditsAt and admittedLocalSourceRead are absent. cc87c072 is measurable history, not the future sealed base; the local remote-tracking split ref had already moved to 2df2f32dc450a7813f21a55f66b9589810f3ebab. Section 6.3's instruction to remeasure remains necessary, so its condition cannot be marked finally DONE. B10 needs an explicit H1 predecessor; B11 needs the split, added reader, lane wiring and the ruled D3/D4 handoffs before its whole adoption/Start row can be green. B6 can prototype before D, but cannot close real-admission EW-25 before the recorded correspondence exists. None of these observations licenses work past section 0.

## What I did not verify

No build acceptance, complete EW-01..25 implementation, naturally occurring corruption, real athlete data, second-admission edit/note survival, rollback, real page/process kill, phone, suspension, sync, farm/CI run, full Today suite, conformance/private fixtures, protected soak, deployment, package seal or receipt. The linked card uses jsdom and a directly installed synthetic admitted generation; only E-R39 uses sealed bundles through real admission. The D3 fault uses a test repository commit; no claim is made that an ordinary Save produces corrupt operations.
No tracked file was edited. No credentials/auth files, prohibited source/data paths, install, node_modules change, git mutation or cleanup was used. Synthetic cell outputs and my own probes remain in OS temp; nothing was deleted. Only this review file was written in the worktree.

Final commands and stdout (the untracked review is not included in git diff):
```text
git status --porcelain
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
?? rebuild/lanes/astra/reviews/EW2-BUILD-BRIEF-REVIEW-L1.md
git diff --stat -- rebuild/lanes/d2/EW2-BUILD-BRIEF.md rebuild/lanes/d2/EW2-SPEC.md rebuild/lanes/d2/spike rebuild/m4/workout/plan-edit-model.cjs rebuild/m3/w6/local/source-admission.mjs rebuild/m3/w6/host/plan-edit-host.mjs rebuild/m3/w6/local/today-bindings.mjs rebuild/m3/w7-preview/today .github/workflows/rebuild.yml rebuild/lanes/astra/reviews/EW2-BUILD-BRIEF-REVIEW-L1.md
(no stdout)
```
