# EW2 SPEC blind review
Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412 and :569; blind; highest effort
Head reviewed: f89ce33fba3e63c2eb9a191e1737de588a64ebec (rebuild/r-astra-ew2-spec)

VERDICT: DO NOT BUILD YET

The spec plus DECISIONS:553, :557, :568 and :577 still leaves incompatible identity and replay contracts. These are corrections to decide before implementing the affected hunks, not a request for another general prose round. The existing durable writer passed its 30 tests; the failures below concern the proposed composition.
Blind order: I wrote the initial findings in this file before opening R1-R5; only then compared reviews, read the four remote rulings, and read F2-LAND section 12 and its module at origin/rebuild/d-f2-land, head 24bef9b9f2299593488884f313363394354f99f3.

Reference key: S = EW2-SPEC.md line; all other numbers below are code lines at the reviewed head unless a remote is specified.
PH = rebuild/m3/w6/host/plan-edit-host.mjs; PM = rebuild/m4/workout/plan-edit-model.cjs; PC = rebuild/m4/workout/plan-edit-commands.cjs.
SA = rebuild/m3/w6/local/source-admission.mjs; LC = rebuild/m4/workout/lift-correspondence.cjs; TB = rebuild/m3/w6/local/today-bindings.mjs.
TE/TA/SM/SH/MSH/MSV/CAT = rebuild/m3/w7-preview/today/{today-entry.mjs,today-app.cjs,setup-model.mjs,setup-host.mjs,machine-settings-host.mjs,machine-settings-view.mjs,exercise-catalogue.mjs}.
TAG = remote rebuild/m4/workout/setup-tags.cjs (byte-identical to this head's rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs).
Witnesses used synthetic encrypted repositories and real hosts. Import-transition witnesses installed the existing PE16-style admitted-state fixture; they are NOT real sealed-port admission executions. The fold prototype removed only PM's four forbidden-context guards, as S2036-2040 proposes; it did not change identity, proofs or apply.

## Findings, most severe first

1. BLOCKER (F1) - The same saved edit cannot cross the import boundary as specified.
S1119-1122, 1531, 1829-1838, 1949-1958, 2042-2062; PM194-196, 238-240, 302-305, 320-321. Save sets=5 against document id press-old, install an admitted correspondent file-press, reopen: read=false, PLAN_EDIT_TARGET_UNAVAILABLE; raw imported sets=2. In the opposite context, a real imported host saves target file-press, but the proposed document-state fold refuses that edit with PLAN_EDIT_TARGET_UNAVAILABLE. Therefore "DOCUMENT" is not an invariant of all saved edits or captures; it describes pre-import sessions only.
Athlete impact: a successfully saved plan stops replaying after import. The basis hash contains origin and edit commitments, not the actual imported exercise state, so unchanged ids alone do not prove unchanged semantics either. Smallest correction: specify an immutable identity/creation-origin mapping and exactly which base each edit applies to before and after import; preserve native capture identities and translate only at named boundaries. Add first-run edit -> import with different ids -> reload -> read -> Start, not merely imported-host second-open.

2. BLOCKER (F2) - E-R25's append creates a row which the retained add then tries to create again.
S1792-1796, 1906-1909, 2798 plus :557 E-R25(ii); SA477-484; PM346, 358, 370-376. Executed: save add brand-new, append its folded row to the admitted base with the existing append convention, retain the saved operation, reopen: PLAN_EDIT_ID_REUSED. Making the row retired does not help: existence is the guard. The proposed raw basis plus replay cannot both own creation.
Athlete impact: importing after adding/replacing a lift can close the whole editor and trigger F5's old-plan fallback. Smallest correction: separate the admitted history roster from the pristine replay base, or specify another single owner of creation with authenticated provenance. Do not merely suppress ID_REUSED. Decide the append fold date/union across past, current and future captures; E-R25 chooses shape (a), but does not choose that date.

3. BLOCKER (F3) - E-R25's selected collision guard is weaker than its required outcome.
S1942-1958 and 2798; :557 E-R25(i)-(iv); SM255-262; LC75-88; SA389-390, 481. Actual slugOf('Lateral', setupIds) -> lateral. FILE {id:lateral,n:Lateral,mg:back} and newly added {id:lateral,n:Lateral,mg:chest}: augmented idCollisions returns [], and held.has(id) is true. No named collision prevents the new identity being treated as an existing file row. Different-name version returns ['lateral'], reproducing the already-known R5 B1 class.
The converse also needs a rule: slugOf('Press')->press; setup/file name Press has no collision, but checking its folded rename Renamed press returns ['press']. Blindly checking all current folded names rejects a legitimate rename of the same identity. Smallest correction: distinguish setup-corresponded identities from plan-created identities; a new identity must refuse ANY occupied file handle, even with an equal normalized label. Preserve established mappings across renames. Define the exercise-id provider, its reserved union including retired/tombstoned creations, and lifetime across review/retry/reload; S1124 supplies only intent ids.

4. HIGH (F4) - The retained replay family's discriminator names a field that is always null.
S1784-1790; PC95-98, 109, 118. Executed stored operation: payload=null; members[0].value.profile='earned/plan-edit/v1'. The proposed payload.value.profile either throws or cannot claim any real edit. Smallest correction: identify the family by class/kind, validate it, and read the profile from the member.
S1797-1799 additionally says the three capture checks are the only remaining evidence. PC100-127 is shape validation, whereas PM288-310 proves tombstones, basis and causal ordering. S2090 calls that proof per capture. Specify that retained edits receive the applicable proof/status treatment even when there are ZERO captures; a no-session import must not retain a history the editor cannot replay.

5. HIGH (F5) - Total fallback is not safe adoption.
S1083-1088, 1251-1258, 2313 and STOP9 at S2613-2615; TA2494-2502. A refused edit read adopts the raw state and rebases the gym. F1 demonstrates saved sets=5 versus fallback sets=2. A generation race or projection refusal can therefore silently restore an older prescription even though the saved edit still exists on disk.
Smallest correction: distinguish no edits/no editor from failed authentication or failed replay. On the latter preserve a verified appropriately dated view or refuse Start with actionable recovery; never present the raw plan as successfully reconstructed. Change EW-14's fallback assertion and STOP9 together. I disagree with R4 N3's and R5's assessment that raw fallback makes this safe.

6. HIGH (F6) - The prescribed list cannot edit the pending plan it says is saved.
S617, 641-642 versus brief:25; PH151, 169, 185-187. Executed same-day add: host.read().state omits brand-new, host.read(starts_on).state contains it, pending_dates contains the next day. A saved removal remains in today's list; a saved addition cannot be selected for rename/removal there. Fields also seed from today's values while review applies against tomorrow's.
Smallest correction: return explicitly dated current and pending views from one authenticated generation and designate the pending view for editable fields/list membership. Keep today's workout immutable. Define multiple edits for one effective day and refresh after each save; extend the one-read budget accordingly.

7. HIGH (F7) - Closing/cancelling during Save has no durable-outcome recovery contract.
S650, 655, 2306; PH229-253. Hook immediately after the REAL repository commit closes the host: reply LOCAL_CLIENT_CLOSED, acknowledged=false, operations +1, outbox +1; after reopening, the new lift exists. This is not a partial transaction; it is a committed write whose reply lost its identity/context. PH252 also drops a review synchronously during an in-flight save.
Smallest correction: say whether exit waits, is disabled, or reconciles a stable intent on reopening before a new review/id can be minted. "The draft survives" is not enough after page/host loss. Same review-id retry DID return the same op, and existing PE10 tests pass; they do not define this editor lifecycle. Specify that Cancel is not post-save Undo.

8. HIGH (F8) - F2 failures escape the promised refusal vocabulary, and later duties are missing.
S645, 647, 2060-2068, 2097-2127; PC66; TAG:14, 124, 139. Real host review with an invalid head returns SETUP_TAGS_INVALID, not PLAN_EDIT_TAGS_INVALID. S2118-2119 explicitly propagates non-PLAN_EDIT throws, contradicting E-R27's ANY-throw refusal rule. Projecting setup tags occurs before the illustrated fold try. The field table also omits reachable PLAN_EDIT_TARGET_UNAVAILABLE, WEEK_EMPTY, REJECTION_UNPROVEN, TOMBSTONE_UNPROVEN and NEW_TAG_PROJECTION_INVALID.
Smallest correction: contain the entire F2 boundary, including raw exceptions, in editor and admission; map its failures to a named refusal/recovery without reporting Saved or adopting raw data. Make the mapping exhaustive or give a defined default. Specify the primary-head encoding under E-R29 and the host policies in the duties table below.

9. MEDIUM (F9) - Two machine-note contracts conflict and can erase the draft.
S652, 656-658; MSH89, 102-103; MSV28-36, 39-56. S656 returns a DRAFT and then runs draftFrom(latest) in the view. Executed draftFrom(draftFrom({machine:{settings:[Seat=4],cues:Pause}})) produces a blank row and blank cue. MSH.save returns ok, not acknowledged, while S652 applies the same Saved rule to machine notes. S658 validates an assembled machine in the page after S657 moved assembly sealed.
Smallest correction: return either the latest record or the final view draft, once; define the callback's normalized success result and validation owner. Cross-import notes also need F1's mapping: a real saved press-old note remains readable under press-old but latest(file-press) is null after the synthetic identity bridge; SA524 merely retains it, and MSH89 does exact-id lookup.

10. MEDIUM (F10) - "New operation basis" has no defined stored-field handoff.
S1083, 2313; TE160-165; TB89, 486-490; rebuild/m4/workout/workout-basis.cjs:49-61. The proposed adoption forwards state only. The gym's plan_basis remains the constructor label, default NO_ACCEPTED_PLAN; causalTips ARE refreshed separately. These are different claims, and the spec does not choose which EW-14 must assert.
Smallest correction: name the required stored Start.plan_basis, causal parents and prescription capture after an eligible edit, and the sealed provider/custody if a new label is required. Do not let a changed card satisfy "new operation basis". Also scope the two-load metric to athleteBasisState: the spike does not execute the whole adopt/rebase/refresh chain, whose gym creation itself loads at TB447.

11. MEDIUM (F11) - The claimed measured 60-second maximum and session stamp are not established.
S1747-1767, 2312; TE474-484; TB208-214, 383. setInterval(60000) is no upper bound on scheduling or asynchronous reopen completion; standing changes before reopen finishes. EW-19 drives visibility callbacks, not elapsed time or Start. Moreover the current gym clock stamps its HOST day, not automatically the live day as S1756-1758 assumes.
Smallest correction: state the actual scheduling assumption and measure the stored Start at the day boundary; define a fresh-day readiness check if a hard bound is required. Keep capture-date proof strict. A fake watcher alone does not retire the capture question.

12. MEDIUM (F12) - The claimed admitted-phone re-import journey is false.
S1562-1565; rebuild/m3/w6/local/local-client.mjs:407-411; rebuild/lanes/d/import-retract/retract.test.mjs:138-148, 189. The cited test explicitly expects LOCAL_IMPORT_RETRACT_REFUSED_ADMITTED. Its successful re-import is of an unadmitted retracted selection. Correct the reachability claim: first-run edit -> first admission is relevant; admitted edit -> retract -> re-admit is not presently demonstrated or supported.

13. LOW (F13), but builder-facing - Remove contradictory implementation instructions.
S1018 still chooses a RELEASED adoption decision, against S1075; S769 says three admission files, S2214 says two; S2362-2367 omits the authorized local-source-basis added export; S2513-2515 and 1565 still offer an interim that S2193 explicitly kills. S2478/2746 call EW-19 the only green id while S2747 says EW-20 is green. Correct these normative duplicates, the stale citations in the table, and the later-ruling sentences below before handing this document to a builder.

## Sampled code claims (65; T=true, F=false, S=stale, A=ambiguous)
These are checks against this head, not a claim that proposed EW2 code already exists. Remote F2 facts are marked.

| # | Spec line / claim | Result | Code or executed evidence |
|---|---|---|---|
| 1 | 372-374 F2 blob, 198 lines | T | Lane copy and remote F2 same blob 68fdc6b6, SHA256 d0436809...fc94d; 198 lines |
| 2 | 375-381 F2 code never accepted | S | Historically this head; :577 accepts landing; remote author report section 12 |
| 3 | 391-401 landing all four cells and retiring copy together | S | :568/:577: tag-only cells; retirement stopped and routed to S10 |
| 4 | 543 read return contract | T | PH151-162; additional metadata does not invalidate listed fields |
| 5 | 544 review includes current/before/after | T | PH185-187 |
| 6 | 545 stale refusal carries current/basis/date | T | PH214-216 |
| 7 | 546 cancel writes nothing | T | PH252; 30-test durable suite passed |
| 8 | 547 EVERY later call refuses after close | F | PH252-253 cancel/close remain void; read/review/save refuse |
| 9 | 549-551 read defaults to local day and reopens | T | PH145-153 |
| 10 | 555-556 all ten args REQUIRED | A | PH54-55 permits client.liveDay; tags fail on read, not constructor |
| 11 | 557 identity labels mandatory | T | PH52-53 |
| 12 | 565-570 missing tags block first read | T | PM202-219; existing host tests and spike scaffold |
| 13 | 587 update closed six-field subset | T | PC69-74 |
| 14 | 588 remove shape | T | PC75 |
| 15 | 589 add shape | T | PC76-79 |
| 16 | 590 replacement must have another id | T | PC76-79 |
| 17 | 592 id/name/muscle nonempty text | T | PC45-50 |
| 18 | 592 day vocabulary U/L | T | PC49-50 |
| 19 | 593 sets/hi positive safe integers | T | PC51 |
| 20 | 593 inc finite positive | T | PC52 and plain scalar validation |
| 21 | 594 steps positive strictly ascending | T | PC53-55 |
| 22 | 617/642 today's read supplies editable pending list | F | PH169; witness today new=false, starts_on new=true |
| 23 | 645 replace checks coverage and fresh id | T | PM345-346, 389 |
| 24 | 646 remove WEEK_EMPTY but no DAY_UNCOVERED | T | PM339-343 |
| 25 | 645/647 invalid F2 tags named PLAN_EDIT_TAGS_INVALID | F | PC66 propagates provider throw; executed SETUP_TAGS_INVALID |
| 26 | 647 catalogue exports named vocabulary | T | CAT40-72 and named exports searchByName/regionsOf |
| 27 | 656 draftFrom can follow returned draft | F | MSV28-36; measured stored note blanks on second conversion |
| 28 | 652 Saved contract extends unchanged to notes | A | MSH102-103 supplies ok, not acknowledged |
| 29 | 664 onward excludes sync/inbound authority context | T | PM225-227; these are explicitly refused boundaries |
| 30 | 769 admission is THREE sealed files | F | S2212-2221 names SA and PM, two files |
| 31 | 843 product 224 keys | T | Parsed acceptance-s8-real-shape.json: 224 |
| 32 | 844 executionPins 71 | T | Same artifact: 71 |
| 33 | 845 protectedSurfaces 2, 847 union 229 | T | Counts only: 2 entries, union 229; product/execution union 227 |
| 34 | 873 original source read loads at 78 | T | today/local-source-basis.mjs:73-82; spike 3/2/1 |
| 35 | 880 setup-tags absent on reviewed tip | T/S | Absent here; exists at remote F2 build base |
| 36 | 1018 adopted decision stays RELEASED | S | Contradicts S1075 and E-R12, not an implementation option |
| 37 | 1083-1088 fallback state implies safe adoption | F | F1/F5 saved 5 -> raw 2; TA2494-2502 rebases |
| 38 | 1121/1521 origin ids read at PM112 | S | IDs are PM111; PM112 reads setup |
| 39 | 1124 host checks intent collisions | T | PH170-172; not an exercise-id provider |
| 40 | 1239 two loads | T/A | r5-adoption row B=2 for basis composition only; not full rebase |
| 41 | 1251-1257 hunk preserves module-load fallback | F | Missing dynamic import catch, TA2482-2488; R5 B2/E-R26 |
| 42 | 1367 three needed F2 functions plus factory | T | TAG:102,105,134,195; fourth validateSetupTags not needed by present flow |
| 43 | 1399-1407 setup operation carries tags | T | today/setup-commands.mjs:124,139-146; PM202-203 |
| 44 | 1479 F2 imports nothing | T | All 198 lines read; same remote blob |
| 45 | 1481-1492 four-cell landing and same-change retirement | S | :568/:577 and remote report; old volume-dependent cells stay behind |
| 46 | 1516-1523 setupsIn returns projection, not op | T | SH45-63 |
| 47 | 1529-1536 use row op_id to get raw op | T | SH57-63 and PM108-112 match that shape |
| 48 | 1563-1564 admitted retract/re-import supported | F | local-client407-411; retract.test138-148 explicitly refuses |
| 49 | 1747 maximum 60 seconds measured | F | TE474-484 only timer/callback; no completion deadline |
| 50 | 1756-1758 Start automatically stamped live TODAY | F | TB208-214/383 and TE152-165 retain host day |
| 51 | 1786 stored profile at payload.value | F | PC95/109/118; executed payload=null, profile in member |
| 52 | 1799 capture checks are only remaining proof | A | PC.validate != PM288-310 semantic/history proof; zero captures unaddressed |
| 53 | 1829-1838/1949 captures/edits always DOCUMENT space | A | Pre-import only; actual imported host stores file-press target |
| 54 | 1840-1847 remove retains row but excludes active | T | PM342-343; both spike and own history witness |
| 55 | 1851 sessionMembership warning at SA690 | S | Warning begins SA685 (R5 N3); 690 is a different comment |
| 56 | 1868-1871 membership counts | T | Rerun: variant0 16/17 current, 5/17 old rule on-date; prime 16/17 |
| 57 | 1892 no admitted row for plan-added id today | T | SA478 iterates setup only; rerun r5-idspace; changes under E-R25 |
| 58 | 1956 correspondence is DOCUMENT -> FILE | T | LC header and correspondence; SA398 |
| 59 | 1957 projected re-key always emerges FILE | F | SA733 null correspondence leaves DOCUMENT id unchanged |
| 60 | 1958 logical_set_slot is not re-keyed | T | SA731-735 only changes entry.lift_lineage_id |
| 61 | 1971 retirement at PM361 | S | PM361 finds order index; PM362 writes retirement |
| 62 | 2099-2100 every refusal has PLAN_EDIT TypeError | F | F2 throw propagation; measured SETUP_TAGS_INVALID; raw throws per report12 |
| 63 | 2297 map152-160, function170-198 | S | import/import-screen.mjs map153-161, function172-198 (R5 N3) |
| 64 | 2362-2367 permitted sealed diff exhaustive | F | Omits local-source-basis export licensed at S873/936 |
| 65 | 2746 EW-19 only green id | F | S2747/EW-20, rerun field-vocab; R5 N2 |

## Executed cells and durable/history checks

All seven committed spike file SHA256 values matched spike/README.md. Six are runnable entry cells; the seventh is support. All six exited 0, sequentially, using scratch copies with only relocated imports (and the fence's specified historical split text).
| Cell | Reproduced output / qualification |
|---|---|
| r4b-capture-lift.mjs | variant0: 12/16 differing targets, current 16/17 versus old E-R16 5/17; variant7 current16/17 versus old17/17 |
| r5-idspace.mjs | Prime active membership16/17 both variants; added row absent from raw admitted shape; retirement active before, inactive on date. Its BEFORE exercise-count label reads foldedOn, not foldedBefore (line86); already R5 N4 |
| r5-adoption.mjs | A=3, B=2, C=1 durable loads; construction0/read1; nine nonthrowing cases. This is the prototype composition, not browser/full adoption |
| r5-readday.mjs | Today new0/sets2; starts_on and after new1/sets5 |
| r5-field-vocab.mjs | Five known keys; all three new plan_edit fields printed with generic programme-mismatch sentence, on both routes |
| r5-fence-names.mjs | Historical split24b35244: 28 writer names; old callbacks2 collisions, renamed0; only this word group, not the full landed fence |
Existing rebuild/lanes/d/plan-edit/durable-host.test.mjs: 30 tests, 30 pass, 0 fail; run directly in ONE Node process. Covers precommit quota atomicity, CAS, lost confirmation, same-intent retries and encrypted rejection. It does not exercise the proposed EW2 import transition or editor callbacks.
Own executed witnesses: F1-F3/F5-F7/F8-F9 above; rename lookup returns old name before effective date/new name after; removal retains the old row; same-id re-add refuses ID_REUSED; new-id re-add has w:null and forks:[].
Every run used the exact requested Node executable; MEASURED_TEST_NOW and TZ were set on their own lines in scratch .cmd files. No whole Today or rig187 run.

## Identity crossings and recorded-history contract

| Boundary | What is proved now / what still needs a spec rule |
|---|---|
| Label -> setup id | SM255-262 reserves only the supplied set. It prevents a local collision only if the caller supplies ALL lifetime reservations; no cross-space guarantee by probability |
| Editor add/replace -> durable member | PC95-98 stores the supplied id verbatim; PM299/346/389 refuses known reuse. E-R25 extends reservation on an imported phone; the spec must name the id provider |
| Setup row -> imported edit target | PM194 chooses by exact id or unique normalized name, then PM196 requires one-to-one binding. Unequal-name shared ids rely on SA's named collision guard; this does not make a plan-created equal-label identity safe |
| Pre-import edit -> imported replay | No mapping of immutable edit.exercise_id is specified; F1 refuses or changes its base. This is neither impossible nor safely completed by E-R25 |
| Capture id -> FOLDED membership/count/order | Valid in document space for first-run captures. S1949/1954 need an origin qualifier; post-import capture ids follow the imported engine state |
| Capture id -> file history entry | SA613 and 733 use correspondence or retain original id. Both completed and incomplete sessions are re-keyed; logical_set_slot stays original. F3 shows a new identity can alias old history despite E-R25's proposed function |
| Folded new row -> admitted roster -> next replay | E-R25 establishes row existence; F2 shows creation ownership and fold horizon unresolved |
| Machine note id -> imported card | SA524 retains notes using correspondence to check existence, but MSH89/coach latestFor reads exact ids. Measured old note remains stored but new file-id lookup is null; define read/write mapping and latest ordering |

No physical deletion of old history is authorized. On a stable first-run identity, PM332 appends rename seams without forking; engine/plan.cjs:59-69 reads old names by date. PM342/362 retires rows and retains them; replacement/new add starts with no load/forks. These facts support EW-03/04/05 locally.
They do NOT prove that the prescription reader can consume all history after import/re-add. rebuild/m4/workout/engine-history.cjs:74-80 requires original captured layout identities; SA's projected-entry re-key deliberately differs. Require an actual performed-set read after rename, replacement, removal and same-label re-add on both id-space fixtures, asserting exact attribution and count, not just bytes surviving. F3 is an alias risk, not an executed end-to-end claim that a sealed import double-counted a set.

## Landed tag projector: every section-12 host duty
Remote author report:1132-1178, module unchanged at 24bef9b9; duties are not supplied by merely injecting three functions.

| Duty | Spec discharge or missing decision |
|---|---|
| 1 ANY throw refuses | CONTRADICTED by S2118-2119 and incomplete E0/E4/E6 codes. F8 requires a boundary covering projection, validation and raw throws |
| 2 reject duplicate id BEFORE projectNewExerciseTags | Existing PM346 precedes PM350; PM389 and S645/647 reference reuse guards. Locally discharged; extend reservation per E-R25 without relying on F2. Executed F2 alone projects existing press-old |
| 3 ONE catalogue encoding of primary head | MISSING. S647 imports vocabulary and S2314 tests snapshots, but neither chooses encoding/custom-picker behavior. Both null and biceps validate (executed); preserve catalogue choice and specify custom identity-muscle choices, including core null versus abs |
| 4 absent tags return state identity, no context validation; null validator returns true | S1403-1407's mandatory Setup.validate/tag map prevents this normal path; S2062 supplies full context. Add an explicit guard/test for the host boundary; do not use tagless success as validation. Executed validateSetupTags(null,null)=true and projection identity unchanged |
| 5 no total-helper-credit ceiling | MISSING UI policy. S594 is equipment validation, not helper totals. State whether the host exposes catalogue snapshots only or permits arbitrary valid helper tuples; do not invent a total cap silently |
| 6 priority_muscles accepts arbitrary nonempty text | Priorities are deferred (S2609), so preserve the selected setup value; no EW2 priority editor is authorized. Record that F2 is not an engine-vocabulary validator. No sentence currently states this fact |

## Sentences superseded by the later rulings
This is a build-instruction correction register. Historical measurements remain true of their stated old heads; they must not be presented as instructions for the new base. :553's prime-id, added-export and callback-name rulings are already incorporated; the exceptions are the duplicates identified above.

- E-R25 (:557): S1797-1799, "the three capture checks ... and nothing else", must include the folded-row collision check.
- E-R25: S1906-1909, "does NOT invent the fix" and "two shapes ... choice to the PM", is settled to append shape (a); S1910's "either way" and S2296 ROW4's "whichever way STOP18 is ruled" must require that shape.
- E-R25: S1950-1951's comparison column "nothing" no longer describes the complete admission checks; both namespaces/rosters participate in collision prevention. S1957's "no row ... STOP18" is baseline evidence, not allowed final behavior.
- E-R25: S2678-2687 and S2798 must remove the orphan-row alternative and pending-Q-M ruling request. S2798's fold-DATE omission REMAINS undecided by the ruling and must be answered, not called resolved.
- E-R25: S3238 and S3309-3311 routing the unresolved admitted-row question solely to Q-M/STOP18 must point to the adopted append plus its red-first tests. E-R21 at S2267-2275 must also include the newly required mintable-file-id collision row.
- E-R26 (:557): S1251-1257's displayed hunk is incomplete: restore the dynamic import and catch around BOTH load and call. Remeasure S1261's six-added/two-changed count. S1263's requirement to keep catches on the sealed side remains valid; it must cover both failure boundaries.
- E-R27 (:568): S364-368 and S2099-2107's universal PLAN_EDIT TypeError characterization is false at the F2 boundary; S2118-2119's explicit propagation instruction is superseded. S2126's assertion that every listed tag failure is a wiring defect also needs narrowing: supplied tag values can fail.
- E-R28/E-R29 (:568): no explicit contrary uniqueness or primary-head-encoding sentence exists; these are missing host obligations, not license to infer a convention from the vocabulary list.
- F2 landing (:568/:577): S375-381, S1411-1422 and S1495-1502's present-tense "never reviewed/accepted", "no review file", "one implementation", and "nothing ... on the tip" must become dated history; S880 must describe the new build base.
- F2 landing: S391-401 and S1480-1492's four old cell files, CI instruction, old-branch cherry-pick route and same-change retirements are superseded by tag-only landing and deferred two-step retirement. Keep the lane/landed copies equal until S10 repoints ALL importers.
- F2 landing: S1424-1436, S1457-1470, S2473 and S2634-2639 still describe F2 landing as a future blocking task. For a build cut from the accepted F2 branch this is now integration/seal custody, not missing code. Injecting it is still necessary; tests do not automatically become green.
- Adopted R5 notes (:557): S2478, S2746 and the "only id" sentence in S3285 must cease excluding EW-20; S2753's "other sixteen" must separate EW-16's design gate. Correct S1851, S2297 and the spike BEFORE label as noted above.
- :577 S-R27(e): S629-632's historical 28-name census is still a true measurement, but cannot stand in for the later full token/use-rule fence. Run that accepted fence. No historical sentence about the old census needs falsifying.
- The unchanged digest requirement S2144-2164 is NOT contradicted by appending runtime roster rows: SA779 hashes programmeBasis, not the returned runtime state. Preserve that separation explicitly while resolving F2.

## Acceptance-row sensitivity
Design audit, not execution of the unbuilt EW tests. YES means the named assertion can fail for its target defect; PART means it leaves the cited failure path green. Each selectable id in S2293-2315 is accounted for.

| Row | Can it catch its named defect? / required precision |
|---|---|
| EW-01 | YES for no-write opens/cancel and declared context boundary; not cancel DURING commit |
| EW-02 | YES for isolated values/non-chip retention; add pending-plan field seeding, not only raw/current fields |
| EW-03 | YES for same-id rename/nameAt; PART for imported identity transition or actual performed-set consumption |
| EW-04 | YES for fresh duplicate-label identity, null load and reopen; PART without a colliding FILE id and replay after import |
| EW-05 | YES for retirement/order/week-empty; assert old captured session projection, not row existence alone |
| EW-08 | YES for blank/NaN/rung ordering; requires actual parsing adapter, not pre-parsed numbers |
| EW-09 | YES if the real callbacks seed/read the draft and gym card; otherwise double conversion and ok/ack mismatch escape |
| EW-11 | YES for producer/basis/actor/causality; not the base-state change at first admission |
| EW-12 | YES for atomic precommit failure and same-review retry; PART for close-after-commit, reply loss plus page loss/new ids |
| EW-13a | YES for reopening current/pending state; PART for whether E1 can select/edit pending additions |
| EW-13b | YES for stale-cache exclusion; assert named refusal for unproven rejection rather than expecting it to apply as a valid disposition |
| EW-13c | YES for already-admitted second-open versus edited-base loop; PART for first-run edits crossing admission |
| EW-13d | YES for first-run duplicate-apply loop with explicit date; not E-R25's new imported roster |
| EW-14 | PART: changes can reach the card while stored plan_basis stays unchanged; mandated raw fallback actually codifies F5; two-load assertion must scope the same operation as the spike |
| EW-15 | YES for immutable snapshot/explicit []; PART for E-R27 raw throws, E-R29 encoding and helper policy |
| EW-16 | YES for named DOM/copy/focus states over fixtures; cannot prove durable callbacks/identity |
| EW-17a | YES: positive edited count plus named capture_sets negative control discriminates old fallback |
| EW-17b | YES: pool AND order plus order-only negative control; retain explicit capture_membership assertion |
| EW-17c | PART: differing-id fixtures and row existence are valuable; E-R25 adds unequal-name collision, but same-label new identity, valid rename and editor reopen after append remain unrequired |
| EW-17d | YES catches payload discriminator because real valid op must admit; PART: no-capture proof/status cases absent |
| EW-18 | YES for stamp/live split, stale versus DAY_TURNED and invalid wiring control |
| EW-19 | PART: catches visibility/listener behavior; cannot fail for an unbounded scheduling/reopen delay or wrongly dated stored Start |
| EW-20 | YES for the specified generic field rendering; cannot establish that its generic wrong-week sentence explains the failure or offers recovery |

Three likely build defects no listed row explicitly kills: (1) equal-label plan-added identity silently aliases a file handle despite E-R25; (2) first-run edit -> import -> reload loses replay/uses raw prescription; (3) closed-after-commit editor reopens without reconciling its intent and offers another add. Add one focused journey for each before its implementation.

## Choices the spec must settle
- Identity/creation ownership, fold horizon and id reservation lifetime (F1-F3); machine-note mapping across the same bridge (F9).
- Which dated state E1 and field defaults edit, and how successive same-day changes compose (F6).
- Exit/back/reload while reviewing/saving; post-save Undo unavailable versus a separately proven compensating action; same-label re-add always a fresh identity, never implicit resurrection.
- Exact six-field parsing/blank behavior, canonical changes-only assembly, and add defaults/tag picker policy. PC's numeric law does not define a text-input grammar or UX defaults.
- Named recovery for unknown outcome, stale/rejected replay and invalid tags; current generic import field sentences are measured but not necessarily actionable.
- Machine callback shape/validation owner, stored Start basis semantics, full adoption load metric and midnight readiness (F9-F11).
- Which sealed hunk owns each correction; current three-file diff restriction cannot license changes in TB/coach implicitly.

## NEW versus ALREADY KNOWN
NEW relative to the five EW2 reviews: F1's cross-admission replay failure; F2 append/replay conflict; F3 equal-name collision and false collision on a valid rename; F4 wrong payload and zero-capture proof gap; F5's demonstrated unsafe fallback (explicit disagreement); F6 pending-list mismatch; F7 close-after-commit lifecycle; F9 double-draft/return-shape and cross-id note read; F10 stored-basis ambiguity; F11 maximum/stamp claim; F12 admitted-retraction claim.
ALREADY KNOWN: unequal-name collision (R5 B1:64-149, now E-R25); lost dynamic-import catch (R5 B2:151-195, E-R26); old green-count/citation/spike-label/fence-scope notes (R5 N1-N5). Earlier R1-R4 raised identity, adoption, tag-boundary and midnight themes; these new findings name different residual executions, not a claim those topics were never reviewed.
F8 overlaps R3 B3's translation concern and is now explicitly ruled by E-R27; host duplicate-id and head-encoding duties are ALREADY KNOWN from F2 report12/E-R28-29, but not discharged by this spec. F13 includes previously known stale duplicates and newly checked inconsistencies. My initial blind notes were written before any of those comparisons.

## What I did not verify
- No real sealed-port import, actual phone/browser, Windows suspension, second-device synchronization, Linux/CI, full Today suite, rig187, conformance/private fixture or protected soak. The spec expressly refuses synchronized/inbound contexts (PM225-227/272); no older-device merge guarantee is claimed.
- The original M1-M7 throwaway programs are not all committed as executable entries; I reran EVERY executable under this spike directory and the support it imports, not the unavailable original farm/port runs or historical 79-cell F2 volume suite.
- No end-to-end prescription-history count after a sealed import. Rows/identity/name behavior above is executed parts-level evidence; the proposed failing admission/roster compositions must be confirmed by the new journey cells.
- No product, tracked file, decision/status file or dependency was edited. No auth file or prohibited data was read. No commit/push/checkout/reset/stash/clean/fetch, install or node_modules change.
- Scratch retained, no deletion attempted: C:/Users/joeym/AppData/Local/Temp/astra-ew2-blind-f89ce33f (relocated spikes, fold prototype, witness1-4 scripts and synthetic test output). Repository deliverable is this file only.
