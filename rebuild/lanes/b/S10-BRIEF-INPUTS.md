# S10 brief input pack

READ: Paper inputs only; Astra decides nothing and builds nothing; PM4 remains sole PM, and a Claude hand checks this paper afterwards (assignment; DECISIONS:569,603).
READ: EW2's basis here is v5 PLUS DECISIONS:602 and the intervening rulings, NOT permission to build v5; round 6 and its narrow check remain required (DECISIONS:557,568,602).
MEASURED: READ means inspected source, including another hand's reported measurements; MEASURED means this assignment's read-only source/inventory checks. No product suite, instrument, runner, receipt or artifact generator was executed (assignment command record).

Source key (1-based lines; short names always mean these explicit files):
- READ: D:N / DECISIONS:N = `rebuild/DECISIONS.md` on `refs/remotes/origin/rebuild/t2-client-core`, observed `789baf6eed5d8e95a067c0dd52a9739b1ef4c357`; cutoff 603, individual numbered lines read (D:536-603).
- READ: S = `127d35ce:rebuild/lanes/c/TODAY-SPLIT-SPEC.md`; B = that commit's `rebuild/lanes/c/TODAY-SPLIT-BUILD-REPORT.md`; instruments = `rebuild/lanes/c/today-split-spike/` on `refs/remotes/origin/rebuild/c-today-split-build` at that commit (S:217-220; B:198-375).
- READ: E = `0bf6f230:rebuild/lanes/d2/EW2-SPEC.md` (v5); F = `24bef9b9:rebuild/lanes/d/F2-LAND-AUTHOR-REPORT.md` on `refs/remotes/origin/rebuild/d-f2-land` (D:557,582).
- READ: RUN = `397ac46693c8088ce168740d35d32e2dd37d4d47:rebuild/lanes/b/tooling/b-package.cjs` on `refs/remotes/origin/rebuild/b-s9-prep-runner`; round 6 published, narrow acceptance not supplied by cutoff (D:598).
- READ: S8 = local `rebuild/lanes/b/S8-REAL-SHAPE-BRIEF.md`; S9 = local `rebuild/lanes/b/S9-RELEASE-SPEC.md`; M = local `rebuild/lanes/b/S9-BRIEF-INPUTS.md`; A8 = local `rebuild/m4/spec/acceptance-s8-real-shape.json` (M:5,12).
- MEASURED: The live EW2 ref advanced during this read and now contains a v6 header; this pack keeps the assigned v5-plus-602 basis and does not equate publication with acceptance (observed `960c416f:rebuild/lanes/d2/EW2-SPEC.md:6-19`; D:602).

## 1. WHAT S10 IS FOR

1. READ: S10 is the reseal after S9 that carries the writers-out TODAY-SPLIT (D:543,550,562).
2. READ: It puts durable Today work in sealed siblings and releases today-app.cjs and gym-app.mjs (D:543,550 S-R14).
3. READ: It must land a real copy lock before releasing on-screen copy, including a rule for screens not yet ported (D:546,549; S9:1123-1176).
4. READ: It keeps the split's own commit proof separate from later behavior changes (D:553,574).
5. READ: EW2's sealed admission/adoption hunks follow the split inside S10; v5 alone is no longer buildable (D:553,557,602).
6. READ: It retires F2's lane copy only after every importer is repointed; F2's module, tests and CI home now land in S9 (D:568,582).
7. READ: GYM-SETTINGS-WRITER-SEAL follows the pure move and precedes S10 sealing; detached frozen settings reads belong to it (D:574 S-R29).
8. READ: GYM-START-IN-PAINT is a separately queued behavior ticket; the pure move leaves its existing durable write unchanged (D:550,562,574).
9. READ: N3-B belongs to a later reseal child after S10; N3-A stays on its lane until the whole ticket can land with CI (D:595,603).
10. READ: Phone earning weights remains an owner choice; neither engine-path work nor a trial start is authorized here (D:590,603; trial after the look, D:575).

## 2. THE SECTION LIST THE S10 BRIEF WILL NEED

| Brief section | Required input, not this pack's decision | Source |
|---|---|---|
| Header / acceptance | READ: Final package id, brief bytes/sha, parent S9 identity, sourceBase and acceptance citation | S8:3-10; RUN:1794-1816 |
| 1. Why | READ: Two-file release, sealed writer boundary, copy lock, EW2 and retirement scope | S8:12; D:543,546,553,568 |
| 2. Declarations walked | READ: Actual S9 parent walk, product versus execution pins, explicit old/new/released/retired paths | S8:74-204; D:582 |
| 2.1 Product | READ: Split siblings, EW2 lane, admission/adoption edits, settings ticket and release list | S:2036-2056; E:834-885; D:574,602 |
| 2.2 Tests / ancestors | READ: Today byte-pin re-homes, F2 importer retirement, ancestor execution supersessions and retained obligations | S9:166-186; F:355-395; S8:122-145 |
| 2.3 Runner / CI | READ: Admit S10 id/roots, final workflow step, children and re-pins; no assumed ready-made S10 support | RUN:324,427-436; S8:146-161 |
| 2.4 First declarations | READ: Writer fence/copy-lock closure, EW2 tests and complete new-file execution closure | S8:163-185; D:546,574; E:862,980-983 |
| 2.5 Exclusions / 2.6 carries | READ: Unchanged engine, later macros/earning children, every other parent obligation explicitly carried | S8:186-204; D:557,590,595 |
| 3. Bar / 3.1-3.5 evidence | READ: Per-lane results, split's own commit proof, deciding cell(s), parent/own children, final integrated public CI; counts measured at final bytes | S8:206-270; D:574,588,602 |
| 4. What does not move | READ: Engine/forbidden surfaces, pure-move behavior, one-export local-source-basis licence | S8:272-288; D:550,557 |
| 5. Reseal rules / tooling | READ: Workflow flip before proposed artifact, sealing-window receipt/coach revision transition and final parent pins | S8:290-359; S9:1263-1264 |
| 6. Flow | READ: PM line kinds, independent review, integrator custody, seal/reverify and both-OS product evidence | S8:361-393; D:563,565,582 |
| 7. Carries | READ: False reds, D-A-FINAL, D-F2-1, scanner limits and open choices; no PASS inferred from a lane total | S8:395-412; D:577,587,592,598 |
| S9-style release appendix | READ: Closed list, grammar, byte-pin re-homes, tripwire and copy-lock design including eight C.6 questions | S9:94-1246; D:549,574 |

## 3. EVERY RULING THAT BINDS S10, BY LANE

READ: Later amendments are explicit below; older formulations remain evidence, not instructions to reverse them (D:550,553,562,574,602).

| Ruling | One-line obligation | Source |
|---|---|---|
| 536 (1)-(4) | READ: Release through reseal and explicit closed-list PM grant only; mixed writers stay sealed until split; free-only look tickets retain review/final/CI/design gates | D:536 |
| 542 / 543 / 546 | READ: S9 releases only CSS/build; S10 carries extraction; real copy lock is a landing precondition | D:542,543,546 |
| S-R1 | READ: Writers into sealed today-lanes.cjs; retain view name/router; later view modularization remains lane C | D:543; S:443-472 |
| S-R2 | READ: Sealed factory owns lanes/hosts/adoption/rebase/writes; frozen read facade/raw-value callbacks; stored-value decisions sealed | D:543; S:544-696 |
| S-R3 | READ: Preserve mount/export surface; move weigh-in writer; projection and marchingOrderSentence stay free | D:543; S:936-988,1848-1928 |
| S-R4 | READ: Extract gym settings on same lane; gym view release accompanies Today | D:543; S:1240-1332 |
| S-R5 | READ: Fence named released files and free source files; later S-R26 narrows its claim to a tripwire | S:1617-1642; D:574 |
| S-R6 | READ: Keep move/page/listener/suite/copy/crossing proofs, with witnessed substitutions and later proof corrections | S:1441-1615; D:562 |
| S-R7 | READ: Today carry first, split in S10, look tickets base on PM-named integrated split commit | S:1941-1974; D:543 |
| S-R8 | READ: Stop on behavior-changing cuts or released stored-value decisions and report evidence; pre-ruled rewrites are specifically bounded | D:543,550,584; S:2170-2202 |
| S-R9 | READ: Re-cost actual interface/review work; historical counts are not a fresh estimate | S:2135-2168 |
| S-R10 | READ: Sealed today-readings.cjs takes weighIn/reopen; projection/read composer stay free | D:550 |
| S-R11 | READ: Pin food-model.cjs, sleep-model.cjs, machine-settings-view.mjs unchanged; narrow C-UI-5/7 custody | D:550 |
| S-R12 | READ: Gesture guard changes no behavior; guard durable callbacks not reached by paint; existing paint writers named and unchanged in move | D:550 |
| S-R13 | READ: Zero athlete-facing literals in sealed lanes replaces nine widenings; readings' four constants are later named exception | D:550,562 S-R22 |
| S-R14 | READ: Release+edit today-app.cjs/gym-app.mjs together; new view bytes stand on suite/fence/CI/design gates, not post hash | D:550 |
| S-R15 | READ: mountToken increment remains released | D:550 |
| S-R16 | READ: Build need not wait for copy lock; product stays off chain until S10 | D:550 |
| S-R17 | READ: Content anchors, verbatim codemod/declared substitutions, scope census/reachability/output suite, UNMEASURED marks and seam STOP; parser instruments never CI dependencies | D:550 |
| S-R18 | READ: Split-only REQUIRED_INPUTS 48 -> 51, Today list 26 -> 29; package.test.cjs declared edit | D:550 |
| S-R19 | READ: Per-region named-ref sha witness before substitution; sleep tamper fails by region; generator cannot check itself | D:562 |
| S-R20 | READ: Refuse last-anchor ambiguity; assert per-ref moved-line totals | D:562 |
| S-R21 | READ: Five boot seams become declared replace regions; re-census/re-price interface | D:562 |
| S-R22 | READ: Name four readings refusal constants, red fifth-constant row | D:562 |
| S-R23 | READ: capture.cjs proves interface-name absence in code positions; census works on own output | D:562 |
| S-R24 | READ: Refresh callback blind edge gets paint-handle disposition; re-derive blind-edge table | D:562 |
| S-R25 | READ: R3 corrections land in first build documentation; unmeasured claims marked; no further general spec round | D:562 |
| S-R26 | READ: Scanner is tripwire, not proof; every released hunk gets independent review and PM final | D:574 |
| S-R27 (a)-(c) | READ: Pin weighIn/reopen acquisition, facade.lane and import/require/dynamic-import edges by measured sites/lists | D:574 |
| S-R27 (d)-(f) | READ: Whole-line holder pins became minimal token windows; readings closed read-use rule; free property only in declared options.readings window | D:575,577,584 |
| S-R28 | READ: Forbid/declare unreadable constructs; read split-line members; arguments zero enforced; scanner self-checks and one token-span text reader | D:574,575,584,588 |
| S-R29 | READ: Live settings cache remains laxity until detached deeply frozen copies land with GYM-SETTINGS-WRITER-SEAL | D:574 |
| 574 STOP 1 / STOP 2 | READ: Ratify fifth test edit; settings seal after pure move/before S10 seal; one paint-handle entry stands | D:574 |
| 584 / 588 part2 | READ: W2/W4/W5/W6/W8 rewrites pre-ruled as witnessed rows; others stop only their region; fence rows last, no scanner rewrite | D:584,588 |
| 592 / 603 fence | READ: Fix keyword-property slash and binding-pattern holder keys; retain N4(a) false red; job31/part2 rows share later review | D:592,603 |
| E-R1 | READ: EW2 re-cut for writers-out split; router/mount released, host/adoption/rebase sealed | D:544; E:739-813 |
| E-R2 | READ: Non-looping adoption design; imported mismatch and first-run double-apply cells | D:544; E:1104-1178 |
| E-R3 | READ: Extend provenance, no edit-time ban/disjunct; one programme effective on capture date | D:544 |
| E-R4 | READ: Fold through inspect/result proofs; no retracted/unproved edits; programme digest input unchanged | D:544 |
| E-R5 | READ: Name actual tag refusal site/dependency instead of treating unlanded collaborator as nonexistent | E:1383-1399; D:544,548 |
| E-R6 | READ: Lane D lands reviewed F2 tag half; original S10 routing later moved to S9 | D:544,557,582 |
| E-R7 | READ: Admission/adoption/F2/wiring one shipping obligation; later F2 routing keeps dependency | D:544,582; E:2787 |
| E-R8 | READ: Lane C builds; D2 implementation review additional to screen blind reviewer; after-N2 dropped | D:544 |
| E-R9 | READ: Proposed refusals/state T need ruling; Q-F remains owner's at :557 | D:544,557 |
| E-R10 | READ: Entry-point question design-first; owner later seats workout button as C-UI-9 | E:2558; D:561 (8) |
| E-R11 | READ: Restate sequencing/cost for sealed/released split, not original smaller budget | E:2712-2750; D:544 |
| E-R12 | READ: Hosts/writers/adopted-state decisions/durable projections belong in sealed edit-week-lane.cjs | D:548 |
| E-R13 | READ: F2 gates whole door and comes first as dependency, not only three tag cells | D:548; landing D:582 |
| E-R14 | READ: Contain PLAN_EDIT failures at admission in closed field vocabulary | D:548 |
| E-R15 | READ: Real client clock, frozen day/live instant/separate liveDay; DAY_TURNED stays reachable | D:548 |
| E-R16 PRIME | READ: Membership document ids at session date; attachment keeps file correspondence; additions/retirements measured; replaces crossed-space E-R16 | D:553 |
| E-R17 PRIME | READ: One added basis+generation export, existing lines unchanged, two durable loads measured; EW2 above split | D:553,557 |
| E-R18 | READ: Correct refusal wording and measured midnight window; :602 later corrects 60-second claim | E:705,1742-1776; D:602 |
| E-R19 | READ: Refusal claim cites spike row or UNMEASURED; measurement beats prose | D:548 |
| E-R20 | READ: Candidates are not pin list; five original names never sealed | D:548 |
| E-R21 | READ: Admission cells name bracket/id space; minted-id cells include file-occupied id | D:553,557 |
| E-R22 | READ: Callback names off writer-member fence, publish census | D:553 |
| E-R23 | READ: Honest per-id green column; runnable reds are not green evidence | D:553 |
| E-R24 | READ: Seat plan_edit_history/basis/context; no bypass door; replay first admission hunk inside S10, no separate child | D:553 |
| E-R25 | READ: Collision check setup/folded roster before append; shape(a), reserve either id space; later :602 separates history roster/replay base | D:557,602 |
| E-R26 | READ: Keep dynamic-import .catch(() => null); module-load failure still paints setup basis, with cell | D:557 |
| E-R27 | READ: Any F2 throw is a contained refusal, not only SETUP_TAGS_INVALID | D:568 |
| E-R28 | READ: Host refuses duplicate exercise id before projection | D:568 |
| E-R29 | READ: One catalogue-selected head encoding; null and identity-head not downstream equivalents | D:568 |
| E-R30 | READ: Immutable saved ids; one named translation boundary; null correspondence refuses; J1 import/reload/read/Start | D:602 |
| E-R31 | READ: One creator; shape(a) history roster, pristine replay base omits retained-add creations; keep ID_REUSED; union retained-edit horizon; J2 | D:602 |
| E-R32 | READ: New identity refuses any occupied file handle; established mapping survives rename; name provider/reserved set; J3 | D:602 |
| E-R33 | READ: Family by class/kind, profile from member; model proofs even with zero captures | D:602 |
| E-R34 | READ: Proven plan plus failure sentence, Start truthful/available; retain disk data; named editor recovery, never Saved | D:602 |
| E-R35 | READ: One authenticated generation supplies dated current/pending views; editor edits pending | D:602 |
| E-R36 | READ: Exits await Save; next open reconciles stable intent before new id; Cancel not undo | D:602 |
| E-R37 | READ: Every F2 throw contained in editor/admission; six host duties each get table row | D:602; F:1132-1178 |
| E-R38 | READ: Correct machine-note draft, stored basis, 60-second claim, re-import journey and contradictory instructions/register | D:602 |
| D-EW2-FINAL | READ: Round6 last general author round, narrow re-check, survivors named in build brief; no build from v5 | D:602 |
| F2 557 / 568 | READ: 198-line tag-only byte-identical landing, no volume/engine half; repoint all importers then delete; preserve PE16 runtime half | D:557,568 |
| D-F2-1 | READ: Stop general survivor hunt; eleven unrowed terms remain; future module edit reviewed term by term | D:577,581; F:1342-1352 |
| F2 581 / 582 | READ: Accepted b9777fe4, module/cells/workflow together in S9; S10 retirement outstanding | D:581,582 |
| Integrator 563 | READ: Integrator acceptance merge-forward, never lane; merge not rebase; append nothing during both-OS run | D:563 |
| Integrator 565 | READ: Evidence for product tree; DECISIONS/STATUS-only later merge can reuse with name-only proof and confirming chain run | D:565 |
| Integrator 582 (4) | READ: Before merge-forward compare lane diff to youngest product AND execution keys; sealed touch routes through reseal | D:582 |
| S9 587 / 598 / 599 | READ: Carry final runner debts/pack amendments; :566 pack acceptance withdrawn, not silently inherited | D:587,598,599 |

## 4. THE DECLARED INVENTORY AS FAR AS IT IS KNOWN TODAY

MEASURED: A8 has 224 product keys and 71 execution keys; P/X below are membership in those maps, not a claim that S9 has sealed. Final S10 hashes, roles and counts require its actual S9 parent (A8:201-1667; S8:74-89; M:144-145).
READ: T/ expands to `rebuild/m3/w7-preview/today/`; each grouped basename is an individual path, never a wildcard declaration (S:2036-2056; E:852-885).

| Path(s) | Known declaration / change / pin class | Source |
|---|---|---|
| T/today-app.cjs | MEASURED: P=yes X=no. READ: release+edit, pre=parent pin/post=null; no child argv may re-pin it | A8:786; D:550; RUN:1513-1547 |
| T/gym-app.mjs | MEASURED: P=yes X=no. READ: release+edit after extraction; follow-up writer work separate from move | A8:696; D:574 |
| T/build.mjs | MEASURED: P=yes X=no in S8. READ: released by S9; changes bundle/isolation inputs, not an S10 execution pin | A8:686; S:1351-1371; D:550 |
| T/today-model.cjs | READ: Already free, edited to inject readings writer; not a release out of S8 | B:379-404,488-498; D:543 |
| T/today-readings.cjs | READ: Born sealed; reported 78 physical lines, 36 moved, 42 authored; source model 497 -> 479 | B:383-386,459-488 |
| T/gym-settings-lane.mjs | READ: Born sealed; reported 103 physical lines, 41 moved, 62 authored; source gym 589 -> 560 | B:410-413,459-475,500-511 |
| T/today-lanes.cjs | READ: Born sealed in part2; source report measures 679 moved Today lines, 41 move regions overall, 20 seam+5 replace; final output size not reported here | B:286-295; D:588 |
| T/food-model.cjs; T/sleep-model.cjs; T/machine-settings-view.mjs | MEASURED: Absent from both A8 maps. READ: Add pinned-unchanged by S-R11, not release candidates | A8 product/execution key query; D:550 |
| T/gym-model.mjs; T/checkin-app.mjs | READ: Carry S9's pinned-unchanged writer protection; no release or new split edit declared | S:2047; D:542,549 |
| T/test/food.test.mjs | MEASURED: P+X. READ: Source slice repointed to today-lanes, source-order condition retained | A8:746,1609; S:1560 |
| T/test/problem.test.mjs | MEASURED: P+X. READ: sleepEntryFor slice repointed, indentation constraint retained | A8:771,1614; S:1561 |
| T/test/package.test.cjs | MEASURED: P+X. READ: Isolation plant moves to today-lanes; H18 Today list 26 -> 29 and full H18b count 48 -> 51 for split alone | A8:766,1613; S:1562-1563; M:213 |
| T/test/machine-settings-ui.test.mjs | MEASURED: P+X. READ: Ratified fifth edit points import check to sibling and forbids it in released card | A8:756,1611; B:43-54,529-531; D:574 |
| T/test/setup.test.mjs; rebuild/m3/w7-preview/measure/test/boundary.test.mjs | MEASURED: P+X. READ: Child-spec/pin reconciliation; boundary's Today byte pin must be re-homed | A8:776,661,1615,1620; S9:166-186; M:171-175 |
| T/today-entry.mjs | MEASURED: P=yes X=no. READ: EW2 createEditWeekEntry and boot site are sealed edits | A8:791; E:909-920 |
| T/local-source-basis.mjs | MEASURED: P=yes X=no. READ: One basis+generation export; existing export byte-identical under current licence | A8:1236; E:873,959-968; D:557 |
| rebuild/m4/workout/plan-edit-model.cjs | MEASURED: P=yes X=no. READ: Fold export/factored proof path; round6 must restate extra hunks | A8:1016; E:878; D:602 |
| rebuild/m3/w6/local/source-admission.mjs | MEASURED: P=yes X=no. READ: Replay, dated capture checks, fold/refusals, collision/history roster; latest mechanisms await round6 | A8:521; E:883; D:553,557,602 |
| T/edit-week-lane.cjs | READ: Born sealed; host/F2/settings/adoption/intent/callbacks; v5's ~142 total added sealed lines is a target, not measurement or current approved ceiling | E:859,916-947; D:602 |
| T/edit-week-model.mjs; T/edit-week-view.mjs; T/edit-week-check.mjs; T/test/edit-week.test.mjs | READ: Four proposed new files, view half called free; declared test argv becomes execution-pinned; final closure/role unresolved | E:854-862,889-899; RUN:1522-1547 |
| rebuild/lanes/c/today-split/writer-fence.test.mjs | READ: New sealed tripwire/child/CI input; use accepted combined allow-list/scanner/part2 rows | D:574,588,592,603 |
| Copy-lock cell(s), no path supplied | READ: New sealed guard obligation, observed client build/pinned corpus; no invented file or CI command | D:546,549; S9:1123-1176 |
| .github/workflows/rebuild.yml | MEASURED: P=yes X=no. READ: Sealed edit, S10 step/guard homes/EW2 registration in PM custody, not an S8 execution key | A8:201; E:980-983; D:582 |
| rebuild/m4/workout/setup-tags.cjs; rebuild/lanes/d/f2/projector.test.mjs; rebuild/lanes/d/f2/guard-coverage.test.mjs | READ: Inherit S9 landing, not three S10 births; guard cell loses twin-equality row only with retirement | D:582; F:331-347,389-395 |
| rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs | MEASURED: P=yes X=no. READ: Retire only after importer proof; deletion role/mechanism not supplied by retirement table | A8:421; D:568; F:362 |
| rebuild/lanes/d/plan-edit/model.test.cjs; rebuild/lanes/d/plan-edit/durable-host.test.mjs | MEASURED: P+X. READ: Repoint defaults/source allowlist; retire twin half, retain runtime-import prohibition | A8:416,426,1632-1633; F:363-364,380-395 |
| rebuild/lanes/d/p3-real-shape/real-shape-support.mjs | MEASURED: P=yes X=no. READ: Repoint shared require, five downstream cells depend on it | A8:1286; F:318-322,366 |
| rebuild/lanes/d/p3-real-shape/real-shape-capture.test.mjs; rebuild/lanes/d/p3-port-fix/owner-route.test.mjs | MEASURED: P+X. READ: Repoint direct requires | A8:1296,366,1667,1664; F:367-368 |
| rebuild/lanes/d/plan-edit/astra-rerun.mjs | READ: Unsealed codemod target string also names old copy | F:321-322,365 |
| rebuild/lanes/b/tooling/b-package.cjs; rebuild/lanes/b/tooling/packages/S10.json; unnamed S10 brief/mirrors | READ: Current IDS/NO_REGISTER_IDS omit S10; exact root/re-pin/mirror closure undeclared; old receipts/artifacts are obligations, not licence to rewrite history | RUN:177,324,1522-1547,1794-1820; F:369-378; S8:122-204 |
| rebuild/lanes/c/today-split-spike/ instruments/tables | READ: Committed lane evidence, not product declarations; instruments.test.cjs is explicitly NOT a CI cell and uses external parser instrumentation | S:2053; B:362-375 |

READ: Part1's counts describe different things: 1,218 physical lines = 1,079 verbatim + 139 novel; 149 authored slots; 156 including seven substitution lines. Do not add these categories (B:459-475; D:574).
READ: Split-only build count is 48 -> 50 -> 51; EW2 inputs and later macros mean 51 is not a measured final integrated S10 count (B:524-527; D:588; E:869; D:595).
READ: Five CHILD_SPECS cells and six mirrors already need generation-specific treatment in S9; S10 must inspect integrated descendants rather than blindly change old ancestor lists (M:31-40,165-176; S9:166-207).
READ: F2 retirement dependency table also names packages/S6.json, S7.json, S8.json; receipts/S6.json, S7.json, S8.json under rebuild/lanes/b/tooling/; rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md; and acceptance-s6-today-child.json, acceptance-s7-port-admission.json, acceptance-s8-real-shape.json under rebuild/m4/spec/. These are historical pin obligations to account for, not approved edits (F:369-378).

## 5. THE ORDER OF COMMITS AND SHARED FILES

1. READ: S9 first: release machinery, Today carry, passphrase, design pins and F2/CI; no split product on chain beforehand (D:549,582; S:2022-2030).
2. READ: Instruments/corrections first; small-cut products accepted; corrected fence before big cut, part2 fence rows last (D:564,574,584,588,592).
3. READ: Split proof at its OWN commits before EW2 rewrites; EW2 sealed hunks ON TOP inside S10 (D:553; E:939-947).
4. READ: Plan-class replay FIRST among EW2 admission hunks, own cell; all admission/adoption/wiring ship together, no separate early child (D:553,557).
5. READ: GYM-SETTINGS-WRITER-SEAL/S-R29 after part2 pure move and before S10 seal; Start-in-paint separate, exact commit position not ruled (D:562,574).
6. READ: F2 retirement: repoint every importer and prove it, then delete copy/twin checks; retain PE16 runtime half (D:568; F:380-402).
7. READ: Copy lock before release; final map/pins/needles/workflow after actual composition, runner re-pins last in applicable tooling sequence (D:546,549,598; S8:320-359).
8. READ: Integrator sealed-touch check before merge-forward; product CI/acceptance/fast-forward with only documented paper-only exception (D:563,565,582).

| Shared file / boundary | Competing work | Source |
|---|---|---|
| T/today-app.cjs / T/today-lanes.cjs | READ: Split cut/boot/adoption; EW2 wiring/adoption; C-UI-2/3/6/7 views; later macros/phone-earn composition | S:1950-1993; E:909-947; D:595,603 |
| T/gym-app.mjs / T/gym-settings-lane.mjs | READ: Split, settings seal/cache copies, Start-in-paint, C-UI-4/5; EW2 v5 claims zero direct gym edit | D:562,574; S:1979-1984; E:955-958 |
| T/build.mjs / T/test/package.test.cjs | READ: S9 H18 family, split modules/isolation, EW2 inputs, later macros preference import | S:1351-1371,1559-1563; E:869; D:595 |
| T/food-model.cjs / T/test/food.test.mjs | READ: Split pins/repoints; N3-A model edit held on branch; N3-B save rule/UI later | D:550,595,603; S:1560 |
| T/machine-settings-view.mjs | READ: Whole-file S-R11 pin versus C-UI-5 and EW2 editor reuse | D:550; S:1982; E:864,955-958 |
| T/local-source-basis.mjs / source-admission / plan-edit-model | READ: EW2 export/admission/fold plus round6 identity/replay/proven-basis corrections; later earning scope unruled | E:873,878,883; D:602,590 |
| Today/measure cells / F2 cells | READ: S9 pin/spec lists, split re-homes, F2 importer retirement, EW2 tests; avoid byte-pin re-sealing of free views | S9:166-207; M:165-176; F:355-395 |
| .github/workflows/rebuild.yml | READ: S9 carry/F2 steps; S10 package flip/fence/copy lock/EW2; later child homes require combined post-image | D:549,582; E:980-983 |
| T/screens.template.html / design.cjs / approved records | READ: C-UI port, EW2 editor, copy lock; legitimate corpus text changes may require reseal | E:863,889-899; S9:1158-1166 |

## 6. THE PM TOKEN LINES, BY KIND

READ: Grammar is RUN at 397ac466, not a proposal. SEP means actual U+00B7; this ASCII file's `\u00b7` is notation, not bytes to paste. Final S10 suffix/brief path are not invented (RUN:980-1013,1794-1806).

| Kind | Enforced grammar / predicate and input | Source |
|---|---|---|
| RELEASE-FROM-SEAL | READ: `^RELEASE-FROM-SEAL\s+(M2-[A-Za-z0-9-]+)\s+([A-Za-z0-9_.\/-]+(?:,[A-Za-z0-9_.\/-]+)*)$`; entire trimmed SEP clause; final trimmed clause exactly RULED | RUN:993-1013,1485-1504 |
| Release list | READ: Exactly `rebuild/m3/w7-preview/today/today-app.cjs,rebuild/m3/w7-preview/today/gym-app.mjs`; grant union equals declared released set both ways; actual package id still needed | D:550 S-R14; RUN:1496-1520 |
| GATE-SUPERSESSION | READ: `^GATE-SUPERSESSION\s+(M2-[A-Za-z0-9-]+)\s+([a-z0-9]+(?:-[a-z0-9]+)*(?:,[a-z0-9]+(?:-[a-z0-9]+)*)*)$`; entire SEP clause, final clause RULED; exact carriers/evidence to declare | RUN:980-983,1408-1446 |
| Carrier vocabulary | READ: source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate; grant not a substitute for evidence | RUN:926-927,1555-1622,3127-3179 |
| THEME | READ: No THEME-token regex: role cowork; line includes packageId, ends exactly SPACE SEP SPACE ACCEPTED; citation/hash self-consistent | RUN:1292-1295,1975-1982 |
| BRIEF-BY-SHA / acceptance | READ: No BRIEF-BY-SHA-token regex: cowork citation, packageId/brief.file present, terminal `(?:^|[ \u00b7])ACCEPTED$`, status BRIEF-ACCEPTED; final bytes/sha and line needed | RUN:1799-1812; S8:363-374 |
| Later review/receipt | READ: S8 flow: `POSTFIX-ACCEPTANCE <packageId> <commit> <artifact-path> <sha256> ACCEPTED`; S10 coordinates follow reviewed bytes | S8:381-389 |
| Conditional FREEZE | READ: If populated, cowork citation says FREEZE and names 40-hex base; no authority issued here | RUN:1969-1972 |

READ: Grants resolve one unique SHA-identified UTF-8 ledger line at CHAIN_REF without newline; theme/brief additionally carry ledgerLine/role/line/lineSha256. Local-author prose is not authority (RUN:1292-1295,1485-1488,2578-2600).
READ: Release requires bound parent product/pre pin and disjoint runner/package/brief/carrier/child-argv execution routes; a cell importing a module does not make that module an argv target (RUN:1513-1547; S:2001-2020).
READ: Canonical forward-slash paths forbid empty/dot/dot-dot/__proto__ segments; distinct walked case aliases refuse PATH-CASE-COLLISION; uppercase alone allowed (RUN:1223-1287).
READ: Product roles are exactly edited,carried,new,superseded-by-child,pinned-unchanged,released; there is no deleted role. F2's deletion needs an explicit supported declaration/retirement design, not an invented seventh role (RUN:367,1855; F:362).
READ: P-A7's RULED instruction differs from theme/brief's ACCEPTED predicates; this pack records the mismatch and supplies no fabricated PM line (D:567; RUN:1805-1806,1981-1982).

## 7. NAMED DEBTS AND KNOWN REDS

| Debt / red | What remains visible, not a new verdict | Source |
|---|---|---|
| Writer fence N4(a) | READ: Mount option appended after settings falsely reds; same option before settings passes; explicitly NOT fixed for S10 | D:592 |
| Scanner residues | READ: Tripwire only, every released hunk reviewed; part2/job31 combined review owed; 309/309 not proof of all JS spellings | D:574,592,603 |
| GYM-SETTINGS-WRITER-SEAL | READ: Released recordSettings chooses stored values and facade exposes live cached objects until ticket closes, before S10 seal | D:574 |
| GYM-START-IN-PAINT | READ: Existing paint -> model.start durable put preserved by split, correction separately queued | D:550,562 |
| D-A-FINAL | READ: Last general runner round then narrow check; old maps unreachable rather than repaired; lone uppercase alias raw failure; Windows spellings no clause; spec exercised, not covered | D:587,598 |
| F2-GUARD-TERM-COVERAGE / D-F2-1 | READ: Eleven terms lack behavior rows after five looks; never called redundant; future module edits require term-by-term evidence | D:577,581; F:756-781,1342-1352 |
| F2 host contract | READ: Contain all throws (null exercise/id object/deep nesting examples); reject duplicate id; one head encoding; tagless identity/no validation; total lend unbounded; priority muscle accepts nonempty text | F:1132-1178; D:568,602 |
| F2 cell notes | READ: Construction-breaking variants make 21 bad()-rows green for wrong reason while suite red; wrappers use this though module does not; next cell edit carries notes | D:581 |
| Part1 pre-reseal reds | READ: Today 682/680/2 before/after: P-MEASURE(g), setup re-pin; S8 profile recomputation refusal not a new behavior failure | B:29-39 |
| S9 inventory fence | READ: 44/43/1 real-row red; integration owes R6-Z2/Z3 two-assert row; Windows-only Y2 and fail-closed callers remain named | D:583,591; M:249-251 |
| S9 pack cells | READ: :566 acceptance withdrawn; amended 58/57/1 and 42/41/1, real literals empty; R5/trusted-root/8.3/read-error/performance questions pending | D:599 |
| S9 runner / mirrors | READ: Round6 150/150 not seal PASS; S8 cumulative red expected; old mirrors need S9.json; final check required | D:598; M:247 |
| S9 stale cell / path notes | READ: ci-second-gate.test.cjs workflow pin/home unresolved; public-tail policy length-only; release deletion admitted; browser-check PC pre-seal evidence | M:245,257,264,267; D:567 |
| Copy gap / design limits | READ: Coordinated array+screen deletion still unheld; exact-text lock owed; C-UI-GATES-2 carries sampled/accept-path limits | D:546,549,594,597 |
| D-EW2-FINAL | READ: No final survivor count claimed; narrow round6 check yields named build-brief debts; v5 acceptance not current authority | D:602 |

READ: The eleven F2 debt terms are setup-tags.cjs:16 !Array.isArray(x), :19 day regex, :29 typeof value, :41 descriptor value ownership, :58 b===null, :74 freeze(regionsByMuscle), :86 head fallback, :124 snapshot id ownership, both :154 head/secondary ownership terms, and :181 !plain(facts); none is labelled redundant (F:756-781,1342-1352; M:265).

## 8. WHAT WAITS ON OTHER LANES AND THE OWNER

- READ: S9 accepted integrated parent, final runner/pack checks, real literals, C-UI-0 second audit and C-UI-1 are prerequisite chain facts; dispatch/publication are not those facts (D:549,594,597-599).
- READ: C-UI/B owe copy-lock answers: comparison unit, observed build, state coverage, unported states, legitimate text-change price, array relationship, coordinated-deletion red and machine/browser reproduction; gate.py gets no CI step by :549 (S9:1147-1170; D:549).
- READ: Part2 proof/report/review, combined fence check, settings writer/cache ticket and exact Start-in-paint scope remain inputs; B is part1, not part2 acceptance (B:1,16-19; D:588,592,603).
- READ: EW2 round6 reproduces witnesses with its own cells, prototypes J1-J3 and restates sealed hunks; narrow check/PM judgment precede build; all six F2 host duties explicit (D:602; F:1132-1178).
- READ: Owner seats EW2 entry inside workout as C-UI-9; proposed refusal copy and E-R34's proven-plan default remain subject to his ruling (D:561 (8),557,602).
- READ: No engine byte authorized by tag-only F2; phone earning needs owner's own A/B/C timing answer and specified/reviewed scope (D:557,590,603).
- READ: Day one AFTER new look on his phone, two real-use days before Dad; no calendar start here. Dad starts fresh and chooses days (D:561,575).
- READ: N3-A held under Claude review; N3-B required-calories/protein rule, UI/copy/sealed cells ride later child after S10; no fat floor/warning, recap later (D:561,595,603).
- READ: Coach work not automatically S10 payload: P4b-1 merged outside seal; text-tag sweep accepted for merge, proposed screen copy awaits C-UI-6 (D:545,565,600).

## 9. CONTRADICTIONS YOU FOUND

READ: Paired source statements only; no resolution, priority choice or permission supplied (assignment; D:602).

| Statement A | Statement B |
|---|---|
| READ: v5 accepted, last document round, build can start (D:553,557) | READ: No build from v5, round6 required (D:602) |
| READ: EW2 sealed hunks atop split INSIDE S10 (D:553,557; E:939-947) | READ: EW2 BUILD cut after S10 in any case (D:582 (3)) |
| READ: F2 first on S10, ahead of S9 role/carry in v5 order (E:969-979) | READ: F2 module/cells/workflow in S9 E fact23 (D:582) |
| READ: N3/P4b share S10 in v5 (E:969-971) | READ: P4b-1 merged off seal; macros whole ticket child after S10 (D:565,595) |
| READ: No released file calls/imports/holds writer (D:543) | READ: facade.lane returns actual writer host, recordSettings remains released until follow-up, fence tripwire (D:574,584) |
| READ: Zero athlete-facing literals in sealed lanes (D:550 S-R13) | READ: Readings four constants include refusal sentences, later ruled exception (S:1571-1578; D:562 S-R22) |
| READ: machine-settings-view/food-model/sleep-model pinned unchanged (D:550 S-R11) | READ: C-UI-5 may touch settings view; C-UI-7 model non-refusal halves (S:1982-1984) |
| READ: Split declaration requests today-model.cjs role released and totals three released entries (S:2046,2055) | READ: S9 leaves it unsealed; release requires own parent product key, while S-R14 names two releases (D:542,550; RUN:1513-1520) |
| READ: Split declares writer-fence at rebuild/lanes/c/ui-port/writer-fence.test.mjs (S:2051) | MEASURED: Build ref holds rebuild/lanes/c/today-split/writer-fence.test.mjs; report names that cell's first rows (B:36; scoped tree listing at 127d35ce) |
| READ: D.2 input inventory differs by EXACTLY two paths (S:1536-1538) | READ: S-R18 adds three modules, 48 -> 51 (D:550; S:1563) |
| READ: E-R25 appends added lifts to admitted state (D:557) | READ: Retained add refuses ID_REUSED; history roster/pristine replay base must differ (D:602 F2/E-R31) |
| READ: E-R25 applies existing collision treatment to folded ids (D:557) | READ: Equal-label new identity can occupy handle and legitimate rename refuse; identity rule re-taken (D:602 F3/E-R32) |
| READ: R4 N3/R5 called total fallback safe, as PM records (D:602 F5) | READ: Silent raw-plan fallback forbidden; disclose failure/store proven basis (D:602 E-R34) |
| READ: Acquisition pin turns every acquiring spelling red (D:574) | READ: settings binding-pattern duplicate key defeats it; claim withdrawn until fix (D:592) |
| READ: Pack cells accepted after four reviews (D:566) | READ: Acceptance withdrawn after independent findings (D:599) |
| READ: Every PM S9 token ends bare RULED (D:567 P-A7) | READ: Theme/brief predicates require ACCEPTED (RUN:1805-1806,1981-1982) |
| READ: S9 spec unions parent/grandparent releases (S9:204) | READ: Later parent-only chain ruling removes union (M:292; D:573) |
| READ: Built-page equality in original pure-move demand (D:542) | READ: Split D.2 says bundle byte identity impossible, uses other observations (S:1525-1540) |
| READ: F2 S10 table's needle 64 passes (F:324-353) | READ: Final landing 81, carrier now S9 (D:581,582) |

## 10. NOT FOUND

- READ: No accepted S10 brief/id suffix/sourceBase, parent S9 acceptance hash, complete declaration map, integrated needles/mirrors/children/verdict supplied; placeholders not authority (S8:74-270,361-393; D:598-603).
- READ: No completed copy-lock specification/paths/CI reproduction answer in inspected split/S9 inputs; joint design remains prerequisite (S9:1123-1176; S:2022-2030; D:549).
- READ: No part2 final output count, accepted reconstruction, runtime-gesture proof or final review in part1 report/ledger through :603 (B:1,16-19; D:588,603).
- READ: No accepted EW2 round6 verdict/current sealed budget in v5-plus-602 basis; observed v6 publication is not acceptance (E:921-947; D:602).
- READ: No GYM-START-IN-PAINT final brief, exact S10 inclusion/order or replacement behavior in cited rulings; separate queued ticket/pure-move exclusion found (D:550,562,574).
- READ: No final F2 deletion mechanism, complete repointed-importer run or authority to rewrite old accepted receipts/artifacts; table is dependencies, not permission (F:355-402; D:568).
- READ: No final S10 grant/theme/brief/supersession lines or PM terminal-mismatch resolution; section6 is implementation grammar only (RUN:980-1013,1799-1812,1975-1982; D:567).
- READ: No final D-A-FINAL verdict/survivors, pack R5 acceptance or passphrase note-fix acceptance by cutoff; checks pending (D:598,599,601).
- READ: No owner earning A/B/C answer, engine scope or calendar trial start; after-the-look order is found (D:575,590,603).
- MEASURED: Only this new paper was edited; source/inventory queries were read-only, with no product/test/runner execution used as evidence (assignment command record; final status supplied separately).
