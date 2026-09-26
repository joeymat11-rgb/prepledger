# S12 LOOK draft rev5: blind paper review, round 2
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM; blind; paper tier; round 2
Head checked: 473a38df280c45c4738ec59acf11a2356dcf73b5 (detached; compose-pre local/origin agree).
Input: S12-LOOK-BRIEF-DRAFT-rev5.md, SHA256 c06c656d209325381350e487edc1cd2d0351e279cc1cbfbe3a2d8d413f98fbd8; 144882 bytes, 280 LF.
VERDICT: REJECT
Required-change flag: YES, L2-B1 and L2-B2. The runner schema repair does not make the proposed mirror implementation valid.
Vocabulary: T = rebuild/m3/w7-preview/today/; PACK = rebuild/m1/approved-2026-09-18/; RUN = rebuild/lanes/b/tooling/b-package.cjs; SS = PACK/quality/statesheet.py; S10J = rebuild/lanes/b/tooling/packages/S10.json.
Scope: static Git/source measurements only, 2026-09-26; no suite, application, engine, package runner, accept or receipt writer executed. Fable review files were not opened.

## Q1. Heads, bases, changed paths and line cites
Live refs differ from the dispatch and the paper's snapshot: origin/rebuild/t2-client-core = ed10468e81a3fb52e5bb512da62ff414cfe73754; local AND origin rebuild/b-s10-integration = dcb73ec7a7d77298ebdcce6d023ea3d351484e94.
Thus "now 88a6463" and "now 9849bc7" are no longer current; neither is the dispatch's local S10 = e9ff2ca. This is moving-ref drift, not evidence that the historical measurements were false.
Local/origin ticket refs equal the paper's full heads: CUI2 5296f20590b2df43b10e08769b7f8898b796c266; CUI3 8d862d1d33e29794b79614e05a4d1568ada55b7c; CUI4 d2ff8036ad6e94348e30b4341eb820890812db40; CUI6 1edf2018a20dee04fa779fd5ef61e4a8a6e46838.
Look lane local/origin = 3e1459385e54b6339cc331d37f22b03c469efe32. All four ticket merge-bases with it = df91ad1; all four with e9ff2ca = f97924a. CUI3's sole own commit has parent 5296f20; ticket counts from df91ad1 = 2/3/2/2.
Commit subjects, parent pairs and dated times match for bf8fd9b, e9ff2ca, 5b230c5, ff98500, 9849bc7, 6974f34, 3446bd3 and 473a38d. The three compose parents match section 1b; 3e14593 is an ancestor.
Measured scoped numstat outputs (files, additions, deletions):
- df91ad1..5296f20 = 10, 521, 47; 5296f20..8d862d1 = 9, 971, 11; df91ad1..8d862d1 = 15, 1483, 49.
- df91ad1..d2ff803 = 9, 955, 187; df91ad1..1edf201 = 10, 1497, 14; 3e14593..473a38d = 25, 3949, 251.
- f97924a..bf8fd9b = 12, 1762, 130; bf8fd9b..3e14593 = 2, 333, 0.
- f97924a..ccc2f63 = 184, 11798, 13540; ccc2f63..e9ff2ca = 2, 30, 0; e9ff2ca..9849bc7 = 4, 213, 5.
Path lists match: CUI2 moves design/preview/scene/screens/today-app plus look-cui2 and four reports; CUI3 adds design/preview/screens/today-app/today-model plus look-cui3 and three reports; CUI4 moves design/gym-app/preview/scene/screens plus workout-look and three reports; CUI6 adds coach-app and coach.test, moves design/preview/scene/screens/today-app and adds three reports.
Composition has eight non-test T paths, four new test paths and thirteen reports; section 1b lists all 25. CUI1's seven product/test paths and five paper paths match.
The stated NOT-MOVED scope is empty at all four tickets and CMP: tooling, workflows, PACK, engine, m4/spec, build, checkin-app, today-entry, gym-model and ui-port. Protected paths were excluded from broad metadata diffs.
All section 1a ticket/base SHA256 prefixes and section 1b composed SHA256/byte counts match. The five new tests plus coach-app/scene are absent from the five stated S10/chain trees and S10J product/argv maps.
RUN at all six cited lane revisions is blob 15c3b591, SHA256 9fbfdd2d9b09fe2aa8f8bd93090220b302414d32efba78e52a83309a61a7ec7c, 316207 bytes/3948 LF; 88a6463 has ac7a4195 as stated.
S10J@9849bc7 = 82f60c3aa66564ebfffbb2fe5cb7ce3ea25e0bde65ac75211fb06bd0b3fd0466, 107078 bytes/2063 LF; 302 roles = carried 230, new 47, edited 22, released 2, superseded-by-child 1.
PKGT ecdddd56, H3T c35ccb82, SS 3b4c3d6e, STD c37d3892 and gate b988ffa0 identities match. RY = cacbd386 at ccc2f63/e9ff2ca/9849bc7, 2048674e at CMP; LG = 7ad8862d.
PACK is unchanged at every stated ticket/lane/CMP/S10/88a6463 comparison. All nine listed pack pre hashes/byte sizes match, including both states ENV and both gate ENV files.
INDEX = 209 states (99/45/65), 418 theme records; top states directory = 421 entries; each platform = 418 PNG + ENV. INDEX env is win32 with the stated versions and app digest.
Checked implementation line cites: RUN 181/333/350/436/498/814-816/979-981/1018/1490-1510/1628/1640-1709/1937-1979/2471-2499/3131-3164/3205-3262/3386-3408/3477-3483/3759-3764 agree with the described rules.
Checked SC cites: R10 309-326; gym 494-495; GSS timing 247-249; view 301-303/517-520/529-531/556/618; PKGT 178-181/227-239/254; H3T 720-746; PUARS 273/299-300/337-338; five CHILD_SPECS locations. Their locations/content match; missing Recovery cell is L2-B2.
S10 child/product cites, SS 223-295/455-495/500-583/684/699-707, STD 57, gate 79-95/220-227/515-524, app.css 797, README 33/44-46/471-475 and LG step/key locations support the stated descriptions.
Incorrect reproducible count: section 1a CI-HOME's unescaped ERE look-cui2|look-cui3|workout-look|coach.test|scene.test gives ONE RY hit, not zero, at :402 (rebuild/coach/test/*.test.cjs). The dot matches "/". Escaping dots gives the intended zero; the four ticket tests still have no workflow home. LG gives two hits; continue-on-error gives exactly five.
No other mismatch was found in the measured source ranges above. Historical temporary-paper/review hashes and their claimed executions were not independently verified; see scope limits.

## Q2. Composition conflicts and resolution
Pairwise merge-tree outputs exactly reproduce the paper:
- CUI3 x CUI4: exit 1, tree 0081bc03fb60c9165c7b2e8e556413b9b8e86968; design.cjs, preview.css, scene.mjs.
- CUI3 x CUI6: exit 0, tree 7032b2ffb10310cfb60d4da12ddff1b8f63b7997.
- CUI4 x CUI6: exit 1, tree 3528c7590158c95a8c61f96b2e460b9f0df239d0; scene.mjs.
Actual last merge 3446bd3 x d2ff803: exit 1, tree 5514937a5e9994663995b4e115b050e38f99b3e8; same three conflicts.
CMP x 9849bc7 = clean 9272047c; CMP x e9ff2ca = clean 2aba3165; lane x 9849bc7 = clean 64f9e0da; all bases f97924a.
The four stated lane/ticket heads x ccc2f63 and x e9ff2ca are all clean, base f97924a. No current add/add pack conflict was found.
Independent multiset accounting: design 1 DROP/7 ADD; preview 0 DROP/8 ADD; gym-app and screens 0/0. Design's drop is the declared Ask-your-coach line, retaining its two line-mates.
Scene retains both screen selectors in order at :369/:372 and one shared scrollFades call at :391-392, with both comments. The 14-identity source census matches every cited CMP template line.
I1-I4 give a usable textual resolution plan. I5's 71/71 and browser equivalence are unverified lane claims here, not seal evidence. The plan remains incomplete at the sealed-cell boundary: L2-B2.

## Q3. Red-first declarations and prior B1-B4
Prior B1: the OWN supersession block, own token, per-carrier children, distinct differentials, census and runner-count needle are now declared correctly against RUN. Payment is PARTIAL: the mirror construction prescription contradicts the zero-engine-change invariant (L2-B1).
Prior B2: PAID at paper tier. s12-look names five role-new/pre-null argv targets; source/map absence must be rechecked at S11. RUN 815 derives ownChildren from role new; :3408 pins all argv targets; :1628 forbids their release; :3759-3764 requires execution. Mirrors alone are no longer the proposed look evidence.
Prior B3: PAID at paper tier. P5d/P5e name both ENV files, SC-11 covers their re-pin, and accept/accept-thumbs census requires explicit rows for every unexpected changed existing output.
Prior B4: the impossible new-id green-before-record rule has a mechanically coherent replacement in section 5a, pending its explicit ruling. SS :295 and :245 necessarily emit missing-record/index rows; render_one's independent checks still run. Accept writes all reachable records, thumbnails, INDEX and ENV; accept-thumbs writes only after clean rows/index. The preserved expected-red set, complete census and post-accept green match those mechanics.
B4 has a remaining contradictory sentence: section 13 still stops ANY baseline "accepted without a green ordinary twin", without section 5a's new-id exception. See D-L2-BASELINE-TEXT.
Red-first rows exist for sealed tests, REQUIRED_INPUTS, H3/13, pack pins, copy-lock re-measure, runner literals and SC-14/15. LG-COE expressly removes :240/:249 and requires recorded step outcomes, not job colour.
H3/13 selects the run line, not the step title; CMP has 23 test files but 18 names, missing exactly the five look tests. S10 has 19 test files plus four helpers. The final S11 inventory and step names correctly remain STOPs.
build.mjs:98 omits coach-app and scene; coach addition requires 29/51 -> 30/52, or 31/53 with scene, conditional on the S11 pre-image. No blanket count increase is authorized.
Copy-lock exists and is child s10-copy-lock with "# pass 6"; corpus/template hits for "Ask your coach" = 2/2 at 9849bc7 and template = 0 at CMP. Its re-measure declaration is present; source provenance still must be paid.

## Q4. Owner choices and guessed values
Read only D:817/820/824/826/827/832/833 at the measured remote chain ref. The quoted serif/card/timing/pack-list and O1-O4 answers and R1/R2/R3 rules match those lines.
No new owner assent is inferred for JOE1/JOE2: section 11 now requires the owner's recorded answer and exact sheet/head. Silence stays open.
Package id, sealed S11 pins, engine count, needles, native-load ids, copy home, role decisions, baseline issuance and composition adoption are named STOPs rather than measured final values.
A name-only mirror template is an unjustified implementation assumption, not owner authorization (L2-B1). No cited ruling makes two engine changes true in a zero-change child.
D:834 was not read: the dispatch authorizes only the seven lines above. No conclusion here depends on its unverified owner/PM statements.
INDEX/env prove the last shared-record writer's platform; they alone do not prove Linux's historical command was --accept-thumbs. Treat that history in section 5a as unverified provenance, while retaining the explicit prospective machine-order ruling.

## Q5. Additional seal stops
The missing Recovery assertion and a copied mirror's engine-change assertion would stop S12 even after the paper's specifically listed rows were paid. Generic STOP-SEALEDCELLS/STOP-SUPERSESSION do not replace naming these now-visible inputs.
Only coach-app installs earnedStates among the eight selected product sources (three hits at :636/:642/:652). Today/Workout inventory and exact-head rendered font/layout/phone evidence remain genuine, already named stops.
No seal availability, exact-head hosted outcome, or end date is inferred from advanced branch refs or historical green claims.

## BLOCKING
L2-B1 (HIGH; draft :175, section 3c): replace the unconditional "byte-exact ... ONLY mechanical substitution ... no assertion ... changes" recipe with a declared, independently reviewed zero-engine-change proof adaptation, or STOP explicitly if the measured S11 template cannot satisfy it.
Counterexample input: S12 carries its sealed parent's engine byte-for-byte, as required. The permitted S10 fallback source-carriers mirror@9849bc7:122-124 demands moved == [today.cjs,writers.cjs]; output is a failed equality for moved == []. Its differential :107-126 demands the unrepaired parent lookup, role edited and exactly those two moved files; writers mirror :171-173 calls that same clause-only proof.
Package-name, token, path and generation substitutions change none of these predicates. The S11 source is not available to validate a different template. Preserve reconstruction refusal and mutation controls, declare the changed parent-equality assertions, and review them before execution; do not weaken an old test or silently expand the substitution list.
L2-B2 (HIGH; draft SC-14 :160): declare T/test/view.test.mjs:526-528 red-first alongside :517-520 and obtain the same explicit R2 scope ruling before editing.
Counterexample input: CMP's Today face has "Recovery check in" at screens.template.html:122; look-cui2.test.mjs:117 explicitly forbids "How are you feeling today?" in that template. view.test :526 searches that old phrase and :527 requires it present. It is the next failure in the same cell after the coach-label failure.
Output: the old sealed assertion and approved Today words cannot both hold. S10J carries view.test (3736dfa2) in today-17; D:820 R2 and SC-14 name nearby ranges but neither names :526-528. Rebind the wired-Recovery assertion to the approved row while keeping its durable marker and NOT_WIRED exclusion checks.

## NAMED DEBTS
D-L2-SNAPSHOT: label 88a6463/9849bc7 explicitly as the immutable rev5 snapshot; rebind to the sealed parents, not moving branch labels. Current refs above are observations only.
D-L2-BASELINE-TEXT: qualify section 13's blanket green-twin sentence with the ruled section 5a new-id sequence; until ruled, STOP-S12-BASELINE-ISSUE remains open. The proposal grants no accept today.
D-L2-CI-PATTERN: escape the regex dots or use exact filenames and record the literal command; raw hit counts must distinguish rebuild/coach/test from T/test/coach.test.mjs.
D-L2-BASELINE-PROVENANCE: cite execution provenance for historical Linux --accept-thumbs, or label it unverified. Keep the new issuance order a prospective ruling.
All existing S11-parent, own-child, pack issuance/census, copy, fixture, state-driver, review and rendered-evidence STOPs remain open; none is accepted by this paper.

## What was not verified
No test run or dynamic counterexample execution; the two blockers are source-derived contradictions. No browser, phone, CSS layout, fixture-shape equivalence, timing, install, CI API or seal run.
No protected/private/legacy source, auth file, old temporary EPP output or Fable review read. Versioned S10 mirror text was inspected, never imported or executed; no transitive helper was run.
No D:834, D:816, historical plans/briefs, temporary composition reports, prior review hashes or claimed historical execution totals independently validated. This is not an exhaustive validation of inaccessible evidence citations.
Scratch Git objects only: C:/Users/joeym/AppData/Local/Temp/astra-s12-l2-eu0aetkg; shared objects were read through alternates. Scratch retained; no deletion attempted.
AAR: the runner schema and template semantics are different obligations. Checking only the newly added runner citations would have missed the zero-change mirror contradiction; checking the next assertion in the same view cell exposed the incomplete red-first list.
