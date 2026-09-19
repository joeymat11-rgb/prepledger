# EW2 SPEC round 6 narrow re-check
Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412, :569 and :602; the last narrow re-check, spec round 6; highest effort
Head checked: f6fd29ac36b49977fa94ff6df1263598fd730276
VERDICT: DO NOT BUILD YET

One BLOCKING journey remains: the specified cross-import machine-note lookup loses a saved note from the editor. Other survivors below are NAMED DEBTS, not grounds for another general author round.
Scope: section 13, its listed in-place corrections, ew2r6 spikes, and EW-21 through EW-24. Read the requested blind review and only line 602 of the remote DECISIONS file. Read the requested spec diff. No product file changed.
All runs used the required absolute node.exe, MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York, sequentially. Scratch: C:/Users/joeym/AppData/Local/Temp/astra-ew2-r6-f6fd29ac.
Imports below use synthetic PE16-style admitted generations, not sealed-port admission. The author reruns relocated imports only; subsequent probes additionally exposed the scaffold client and installed H2 in the real host's CJS export object in memory. No authentication bypass was added to that host.
CLOSED means the narrow mechanism survived this re-check, not that EW2 has shipped. CLOSED ON PAPER means the correction requires execution after the build; no current product path implements it.

## F1 through F13

| Finding | Disposition | Measured result and remaining classification |
|---|---|---|
| F1 identity across import | STILL OPEN | J1 closes: patched real host reads sets=5 after different-id admission. Mixed stored targets remain press-old/file-press and read sets=5, hi=12. Admission's specified document fold refuses that same mixed history: PLAN_EDIT_TARGET_UNAVAILABLE. A second map can misapply a native file-id edit; full admission reachability unproved. NAMED DEBT D1. |
| F2 two owners of creation | CLOSED | Both append-to-exercises variants refuse PLAN_EDIT_ID_REUSED. Separate planRoster reads true, creates one row, saves a second add, and still refuses reused/setup ids. History consumers remain NAMED DEBT D5. |
| F3 occupied handles/rename | CLOSED ON PAPER | P3 returns PLAN_EDIT_FILE_HANDLE_OCCUPIED for equal-label lateral; mint returns lateral-2; established rename returns []; retired/tombstoned union mints lateral-4. No real admission guard or H3 read field exists yet. NAMED DEBT D6. |
| F4 discriminator/proofs | CLOSED ON PAPER | payload=null, class/kind=plan/plan-mutation, member profile=earned/plan-edit/v1. The scratch proof half accepts 2 valid retained edits with 0 captures; the separate document-state application fails for the file-id edit. E-R33 now requires proof independently of captures. D1 covers composition. |
| F5 silent fallback | CLOSED ON PAPER | Baseline still reads false over saved sets=5/raw sets=2. E-R34 explicitly requires notice and truthful fallback Start. No implemented card/Start path proves it. NAMED DEBTS D4 and D8. |
| F6 pending editor | STILL OPEN | Today omits brand-new and retains removed row-old; pending does the opposite; today sets=2/pending sets=7. Host returns only state, not current/pending dates or authenticated generation. NAMED DEBT D3. |
| F7 interrupted save | STILL OPEN | Close/cancel after commit each leave 1 plan op and return false acknowledgement. Transient-only page-loss retry saved a second Lateral under lateral-2. This retry violates the new no-new-review rule; it proves missing custody, not an unavoidable compliant-build failure. NAMED DEBT D2. |
| F8 F2 boundary/duties | CLOSED ON PAPER | Invalid head -> SETUP_TAGS_INVALID; bare validator throw -> PLAN_EDIT_READ_REFUSED; staged projector throw -> PLAN_EDIT_PROJECTION_REFUSED, 0 plan ops. Direct fold still throws raw RangeError. Taxonomy has exactly three cases. NAMED DEBT D7 preserves admission containment. |
| F9 machine notes | STILL OPEN | One conversion preserves Seat=4/Pause; two erase it. Record/ok/validation corrections are sound on paper. The new translated read key still yields null and a blank draft after import. BLOCKING B1. |
| F10 stored Start basis | STILL OPEN | createGymHost consumes day/engineState/plannedSplitSlotId; planBasis comes from the enclosing installation, not that call's options. Save reply supplies no fold state/basis. Proposed dynamic Start label lacks its handoff. NAMED DEBT D4. |
| F11 day boundary | CLOSED ON PAPER | Host day 2026-09-14, live instant 2026-09-15T04:00:01Z -> clock.today()=2026-09-14. Poll period correction stands; stored Start and readiness remain unexecuted. NAMED DEBT D10. |
| F12 re-import claim | CLOSED | The cited retract test expects false/LOCAL_IMPORT_RETRACT_REFUSED_ADMITTED. Corrected claim agrees. Importing/selecting another named file is a different path, not a retract; D1 covers it. |
| F13 contradictory directions | STILL OPEN | Corrections have precedence, but 13.9's admission-file count contradicts itself; evidence claims and admission-code expectations remain inconsistent. NAMED DEBTS D6 and D9. |

## BLOCKING

B1 - A saved machine note disappears from the prescribed editor after first admission (E-R38 F9, also E-R30).
Executed input to the REAL machine-settings host: {exercise_id:"press-old",settings:[{name:"Seat",value:"4"}],cues:"Pause"}; save.ok=true.
Install the synthetic admitted state with the same named lift at file-press and recorded correspondence {"press-old":"file-press","row-old":"row-old","squat-old":"squat-old"}. Follow 13.9/M1 exactly: query latest with the TRANSLATED key.
Measured: beforeDraft={"rows":[{"name":"Seat","value":"4"}],"cues":"Pause"}; latest("file-press")=null; afterDraft={"rows":[{"name":"","value":""}],"cues":""}.
Control: latest("press-old") still finds the note; stored operation is byte-unchanged. This is loss of the saved edit from its athlete-facing read, not deletion from disk. There are no plan edits/captures in this journey for E-R33 to refuse.
Cause: immutable notes keep their saved key; translating only the QUERY cannot change that index. apply()'s private targetIdOf is never called by machine-settings-host.latest() or the coach's latestFor(). Retaining the note at admission does not bridge its read.
Required narrow correction: resolve stored note identities into the requested lift's identity before latest selection, preserving date/order and distinguishing pre-import document notes from native file notes. Test both plus same-label re-add. A second draft conversion or an empty-state message does not close B1.
Reproduction: scratch/note-blocker.mjs and note-blocker.out.txt. This counterexample uses the author's admitted-state test boundary; real sealed-port execution remains a build gate.

## NAMED DEBTS

D1 - Define immutable per-edit id-space/basis provenance across first admission, native file-id edits, second selection and rollback; prove admission either resolves each saved target to the same lift or refuses before publishing, and make the document-state capture fold handle mixed histories without rewriting operations.
D2 - Implement cold-page recovery without depending on the attempted intent surviving in transient memory; reconcile authenticated stored intents before enabling any fresh review/id, and test a destroyed page/client context plus committed and uncommitted outcomes.
D3 - Name and authorize the authenticated-generation handoff for current/pending views and post-save refresh; one host.read() exposes neither both views nor its generation, and a successful save reply exposes no committed generation; do not satisfy E-R35 by two uncoordinated reads or a second replay implementation.
D4 - Name and authorize the per-adoption Start.plan_basis handoff through the shared gym installation; createGymHost ignores a per-call planBasis option, so the current zero-byte today-bindings contract cannot carry the proposed changing fold label by the stated route.
D5 - Wire and test every required planRoster history consumer with exact lift attribution and counts, including past/current/pending creations, tombstoned creation, removal and same-label re-add; a roster key existing in a fixture is not a history read.
D6 - Specify the admission refusal envelope/reason for occupied file handles consistently with EW-23, and place slugOf/reserved-id minting on a permitted import boundary; E6 forbids the released setup-model import that 13.4's direct provider call assumes.
D7 - Wrap setup-tag projection, validation and detached fold execution at admission as well as the editor; assert the defined default for raw throws and retain diagnostic detail internally, since the host's save-stage catch does not surround admission.
D8 - Complete E-R34's state table for pending-only edits, plan_edit_basis/default failures and failed authentication; show retention/cause claims only when proved, and replace C2's unsupported assertion that a missing correspondence means a different exercise copy.
D9 - Correct evidence/count labels: 11 executable cells include the 3 prototypes; the loader neither prints nor asserts its net count; J1 does not execute patched host/Start or prove three-copy identity; P2 prints a desired union rather than persisting it; four acceptance rows were added, not three.
D10 - Carry the host-day Start/readiness choice into the build/S10 brief and execute a stored Start across midnight; a 60-second interval is not a deadline, 13.7 contains no promised Start readiness check, and EW-19's visibility callbacks cannot prove either claim.

## Journeys driven and author-output comparison

Every executable author file exited 0. There are 13 ew2r6 files: 8 witness programs, 3 journey programs, support, and the loader. Support is not a standalone cell. I also ran the loader, which exited 0 with no stdout.
Section 13.1 is a summary table, not a complete stdout transcript. All values it attributes to its witness programs reproduced. Additional printed lines and overclaims are identified below; no claimed raw value was silently treated as an assertion.

| Author cell | Reproduced output, including controls |
|---|---|
| w1-import-identity | First read true/2; review true/2026-09-15; save true/ack=true; stored press-old; distinct file/document lists and map as printed; second read false/PLAN_EDIT_TARGET_UNAVAILABLE; raw=2 versus saved=5; raw press-old row absent. No Start was executed. |
| w2-creation-owner | Add review/save true; folded row present; retired=true and false both fail ID_REUSED; no-append read=true, second review=true. Its extra "replay created the row itself" line is FALSE because this control reads the authored day, before starts_on. |
| w3-collision | lateral; file holds it=true; equal-label guard=[]; held=true; unequal-label=["lateral"]; renamed established=["press"]; unchanged=[]; occupied Press mints press-2. |
| w4-pending-view | Today ids press-old,row-old,squat-old; pending adds brand-new; pending_dates=["2026-09-15"], applied_ids=[]; remove retains row-old today only; second update saves; pending sets=7/today=2; payload=null/member profile correct/member field=training.exercise-edit. |
| w5-inflight | Close -> LOCAL_CLIENT_CLOSED; cancel -> PLAN_EDIT_REVIEW_REQUIRED; both ok=false/ack=false, 1 durable commit, 1 plan op, 2 total outbox entries; reopen read=true, original intent active/applied; fresh review intent-2 offered. |
| w6-f2-boundary | Invalid head/secondary and chest head -> SETUP_TAGS_INVALID; lend>1 -> PLAN_EDIT_INPUT_INVALID; null-head control true; direct invalid/null exercise tags throw SETUP_TAGS_INVALID; both null setup-tag validations true; raw validator -> READ_REFUSED; throwing projector review=true. |
| w6b-projector-latency | Healthy review=true; throwing save false/ack=false/PROJECTION_REFUSED; both subsequent reads true; plan ops=0. |
| w7-machine-note | First draft Seat=4/Pause; second draft blank/empty; machine=null; acceptable(null)=false; eight identity muscles, back/delts regions, chest null-only. |
| p1b-j1-noHostBytes | With recorded map: read OK, file-press sets=5; without map: TARGET_UNTRANSLATED; prints ready=true twice and host bytes=0. That boolean does not prove three-copy identity; this program calls Proto directly with a state-returning admittedBasisOf. |
| p2-j2-prototype | Roster read=true, replay row=true, roster key=true; second add reviewed/saved; same/setup ids fail ID_REUSED; printed desired union=[added-past,added-second]; pending_dates=[2026-09-15]. Its actual roster still contains only added-past; both edits are pending on the authored day. |
| p3-j3-prototype | Occupied/equal-label returns the named issue; reserved mint=lateral-2/collisions=[]; established rename=[]; retired+tombstoned mint=lateral-4; roster rename=[]. Pure functions, not admission/editor entry points. |

The author's programmes print expected red witnesses and still exit 0. Exit status alone is not their verdict. None executes EW-21's card and stored Start, EW-22's full history attribution, EW-23's admission refusal envelope, or EW-24's repaired cold-page recovery.

| Independent journey | Executed result and classification |
|---|---|
| J1 through patched REAL host | First-run sets=5; import file-press; read=true/sets=5. Translation reads the recorded member with the real admittedLocalSourceBasis join. CLOSED for this single admission. |
| Post-import FILE edit beside first-run edit | Save hi=12 on file-press; reload -> sets=5, hi=12; stored targets remain [press-old,file-press]. Positive control. |
| Same history through specified admission fold | H1 guard-skipping composition plus H2 on tagged document state -> PLAN_EDIT_TARGET_UNAVAILABLE. Proof half alone -> active=2, captures=0. NAMED DEBT D1; host-green is not admission-green. |
| Two changed correspondences, old file id absent | press-old->file-press, save file-press hi=12, then press-old->second-press -> read=false/TARGET_UNTRANSLATED. NAMED DEBT D1. |
| Two changed correspondences, old file id reused | Second file adds {id:file-press,n:"Different incline machine",sets:2,hi:9}; file/document idCollisions=[]; read=true; second-press gets sets=5,hi=9 while DIFFERENT file-press gets sets=2,hi=12. Wrong-lift prototype result. NAMED DEBT D1: full admission reachability was not executed, and the document fold can refuse this history before publication. |
| First-run rename; file carries old name on another lift | Rename press-old to Renamed press; file-press already has that name; other-press carries Synthetic press-old. Recorded correspondence chooses other-press; read=true and other-press is renamed too. NAMED DEBT D1: names alone do not prove the intended file identity; no physical-lift identity oracle was supplied. |
| Add/import/remove/same-label re-add | lateral retained in planRoster; remove saves; reserved union mints lateral-2; read=true, old retired/new active, new w=null. Passed replay/provider control; history counts remain D5. |
| Tombstoned creation still in roster | Qualified synthetic Ops.build tombstone, pure replay: intent=tombstoned, created=false, roster=[dead-lift], next mint=dead-lift-2. Passed; not a signed host tombstone write or history-attribution test. |
| Document-id machine note/import/read | Saved=true; translated latest=null; blank draft; original note and stored op unchanged. BLOCKING B1. |
| Page loss and transient-only recovery | Commit-close reply false/LOCAL_CLIENT_CLOSED; clear transient intent; fresh host cannot match it; retry saves; two Lateral rows [lateral,lateral-2]. NAMED DEBT D2, because allowing that retry violates the spec's explicit recovery gate. |
| Two distinct devices, each saves before import | Both saved; foreign operations -> PLAN_EDIT_HISTORY_UNPROVEN; frontier W=1 -> PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE. UNSUPPORTED, not a sync correctness claim: model lines 225-227 and 274-277. |

## The two disagreements re-measured

The save-stage disagreement is upheld narrowly: review invoked projectNewExerciseTags 0 times; enabling its RangeError before save returned PLAN_EDIT_PROJECTION_REFUSED with 0 plan ops. A later read over an already-saved add with that projector throwing returned PLAN_EDIT_READ_REFUSED and preserved its 1 op. A direct model fold threw RangeError with no code. The stage contains the save; admission still needs the explicit wrapper required by E-R37 (NAMED DEBT D7). No executed host path committed through the throwing projector.
The taxonomy disagreement is upheld. I tested every shipped muscle against null and the union of all region/muscle head tokens. Eight muscles accept [null,their own name]; back accepts null/lats/upper_back/traps/lower_back; delts accepts null/delts_front/delts_side/delts_rear; chest accepts [null]. No fourth case. Duty 3's chest exception is necessary. Duties 2, 4, 5 and 6 now have explicit policy; their future host controls remain build acceptance, not executed product fixes.

## Sealed budget, ruling by ruling

Independent scratch diff: H2 is exactly 24 added, 2 removed, net 22; 9 added lines are comments. HUNK_NET_LINES exported 22. No other model lines changed in that diff. The loader's header says 23 added and it neither prints nor asserts the count (D9).
H1-H3 and A-D are seven core hunks in two files; the separately listed local-source-basis export and today-entry wiring bring the sealed file count to four. New lane/view work and CI registration are separate. No zero-byte file was edited here.

| Ruling | Can the stated budget implement it? |
|---|---|
| E-R30 | H2+D implement single-import target translation with host=0, measured. They do not implement note lookup or cross-import native-id provenance. The unconditional DOCUMENT claim for stored edit targets is contradicted by measured file-press. D1/B1 must be resolved within named hunks or explicitly re-budgeted. |
| E-R31 | Separate roster storage fits source-admission C and requires no model creation change. The quoted 6-10 lines do not demonstrate the promised re-key/history consumer work; no exact count for those consumers was supplied. D5. |
| E-R32 | H3/C can carry the reservation union and collision guard. P3 does not prove H3's authenticated return, the admission envelope, or the released slugOf import legality. D6; do not implicitly authorize bytes in setup-model/exercise-catalogue. |
| E-R33 | H1/B can run the existing proof half once with zero captures. The document-state fold's mixed-ID refusal must be settled under D1; class/kind alone is insufficient. No commands-file change is inherently required. |
| E-R34 | Display/recovery can fit the new lane and released view. The full ruling includes stored Start truth and every refusal branch; those are not discharged by that display budget. D4/D8. |
| E-R35 | NOT by the claimed host.read/save contract. read keys were applied_ids,causal_parents,intents,pending_dates,plan_basis,read,state. save supplied acknowledgement/operation metadata, not either dated view or a generation. Acknowledged save used 2 loads. Name a host hunk or another authorized authenticated composition; do not edit zero-byte plan-edit-host by implication. D3. |
| E-R36 | Exit disabling and a safe reopening gate can fit the new lane/view. A transient attempted intent cannot survive page loss; the actual custody/reconciliation method is missing. D2; no host-byte exception is justified merely by this measurement. |
| E-R37 | Caller containment can fit admission and the new lane, preserving zero bytes in host/commands/catalogue. The wrapper must include pre-fold projection as well as the detached fold. D7. |
| E-R38 | Record/ok/single-conversion fixes fit view/lane; cross-import notes still fail B1. The changing Start label needs a handoff absent from zero-byte today-bindings: its createGymHost destructures only three options (367), while planBasis is closed over from installation construction (239/487). D4. Day/prose corrections need no product bytes until the separate readiness decision. |

The remaining zero-byte commitments (workout-host, host-bindings, coach including machine-settings-commands, machine-settings-host, gym-app, setup-host) were not shown to require changes by these probes. In particular, machine-settings-host.all() offers a possible immutable-note read source for a corrected lane; B1 does not authorize rewriting notes or silently editing that host. Sharing an identity resolver with apply() needs a stated contract, not the nonexistent call claimed by 13.9.

## EW-21 through EW-24: can the assertion fail for its defect?

| Row | Sensitivity and what could pass while the defect stands |
|---|---|
| EW-21 | Yes: missing H2 gives TARGET_UNAVAILABLE instead of saved sets=5. It can pass with direct Proto invocation/admitted-state injection while real admission rejects retained edits, or with a painted card while Start keeps the wrong label/capture. Require real admission, new-host reload and stored Start assertions; do not mark the current P1 programme green for the whole row. D1/D4/D9. |
| EW-22 | Yes: append-to-exercises fails ID_REUSED on reopen. It can pass with no history roster consumer, a one-entry dummy roster, or a printed union; P2 currently does exactly that last one. Assert actual union and attributed history counts, and both reuse controls. D5/D9. |
| EW-23 | Yes: equal-label guard misses lateral and name-based checking rejects a valid rename. Pure P3 can pass while admission still runs old logic or emits only LOCAL_SOURCE_PROGRAMME_UNRESOLVED/field=exercise_id, as 13.4 also prescribes. Assert the actual published refusal envelope and a successful established-rename import, plus real reserved-id mint/reload. D6. |
| EW-24 | Yes: w5 exposes the committed operation plus a failed reply and fresh intent. It can pass on component close/reopen that preserves transient state while a cold page duplicates the add. Destroy that state, inspect durable op/outbox cardinality and prevent fresh minting until reconciliation; also test noncommit. D2. |

## E-R34 proposed copy

Measured C1-C4 block: U+2013=0, U+2014=0. No punctuation defect.
C1: plain enough except "the plan your phone can prove" is technical. "Nothing you saved has been deleted" is broader than what a failed authentication establishes. NAMED DEBT D8.
C2: not established by the refusal. Missing/absent map in P1 produces TARGET_UNTRANSLATED without proving a different exercise copy. State inability to match/apply, not an inferred cause. NAMED DEBT D8.
C3: "Your saved changes need attention" is plain and does not invent a cause; CLOSED ON PAPER.
C4: plain, but "still on your phone" requires authenticated presence; use only for verified retained records. NAMED DEBT D8. The general promise of one sentence also differs from C1/C2, each of which contains two.

## What I did not verify

No real sealed bundle, source-admission end-to-end execution, prescription-history attribution/count, stored Start, browser DOM, phone, suspension, real page kill, synchronization success, full Today step, conformance/private fixture, protected soak, CI or deployment. No claim that a synthetic admitted-state substitution proves admission will publish it.
No new general spec hunt. No auth files, protected paths, personal data, package install/node_modules change, deletion, commit, push, checkout, reset, stash, clean or fetch. Only this review was written in the worktree; scratch probes and changed copies are outside it.
The wrong-lift second-map replay and transient-loss retry are explicitly debts because their complete compliant-build reachability was not established. B1 is the independently executed saved-note read loss under the exact round 6 lookup rule.

Final commands and stdout (the report is untracked, so its contents do not appear in git diff --stat):
```
git status --porcelain
?? rebuild/lanes/astra/reviews/EW2-SPEC-RECHECK-R6.md
git diff --stat -- rebuild/lanes/astra/reviews/EW2-SPEC-RECHECK-R6.md
```
