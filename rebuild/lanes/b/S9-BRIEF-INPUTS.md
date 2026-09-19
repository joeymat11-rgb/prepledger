# M2-S9-UI-PINS brief input pack

Source key (line numbers are 1-based):

- S = `HEAD:rebuild/lanes/b/S9-RELEASE-SPEC.md` (v4); R4 = `HEAD:rebuild/lanes/b/S9-RELEASE-SPEC-REVIEW-R4.md`; S8 = `HEAD:rebuild/lanes/b/S8-REAL-SHAPE-BRIEF.md`.
- A = `refs/remotes/origin/rebuild/b-s9-prep-runner:rebuild/lanes/b/S9-PREP-RUNNER-AUTHOR-REPORT.md`; RUN = the same ref's `rebuild/lanes/b/tooling/b-package.cjs`, snapshotted at observed head `2a8526b58da4a8bd8a57248d4aa524cb3afba21a`; A still reports round 5 (A:30-47,67; RUN:1192-1320).
- RTEST = RUN's snapshot, `rebuild/lanes/b/tooling/test/release-from-seal.test.cjs` (RTEST:1301-1310).
- B = `refs/remotes/origin/rebuild/b-s9-prep-cells:rebuild/lanes/b/S9-PREP-CELLS-AUTHOR-REPORT.md`; C = `refs/remotes/origin/rebuild/b-s9-prep-pack:rebuild/lanes/b/S9-PREP-PACK-AUTHOR-REPORT.md`.
- B-R1/B-R2/B-R3/B-R5/B-R6 = B's ref, `rebuild/lanes/b/S9-PREP-CELLS-REVIEW-R<N>.md`; B-R4 = `refs/remotes/origin/rebuild/r-astra-s9b-r4:rebuild/lanes/astra/reviews/S9-PREP-CELLS-RECHECK-R4.md`.
- C-R1/C-R2/C-R3/C-R4 = C's ref, `rebuild/lanes/b/S9-PREP-PACK-REVIEW-R<N>.md`.
- PN = `refs/remotes/origin/rebuild/c-passphrase-normalize:rebuild/lanes/c/PASSPHRASE-NORMALIZE-AUTHOR-REPORT.md`; TC = `HEAD:rebuild/lanes/c/S9-TODAY-CARRY-AUTHOR-REPORT.md`.
- F2 = `refs/remotes/origin/rebuild/d-f2-land:rebuild/lanes/d/F2-LAND-AUTHOR-REPORT.md`; PK8 = `HEAD:rebuild/lanes/b/tooling/packages/S8.json`.
- DECISIONS:N = line N of `refs/remotes/origin/rebuild/t2-client-core:rebuild/DECISIONS.md`; cutoff = DECISIONS:591 at observed chain head `4c561fe8d073b9c367a154c68109a4bb2d0390d5`; B's head is now `6f808cfa`, C's is `1d0cbffa`, and runner round 6 and its narrow re-check remain pending acceptance (DECISIONS:566,587,591).
- Reported test results below are the cited authors'/reviewers'/PM's measurements, not fresh executions by this reading assignment (A:53-54; B:10-12; C-R4:229-242; F2:13-15).

## 1. WHAT S9 IS FOR

1. S9 is S8's reseal child that releases exactly `rebuild/m3/w7-preview/today/preview.css` and `rebuild/m3/w7-preview/today/build.mjs`, with the build release conditional on H18 in the same package (S:29-31,38-90,350-375).
2. The owner's eight candidates were seven files plus a test-cell category: four named files were already free, `today-app.cjs` still writes state, and no today test cell is released (S:40-72; S:698-729).
3. S9 supplies a path-agnostic release mechanism, an inventory fence, whole-pack and approved-reference pins, and explicit remaining limits; the wording lock is S10's named precondition (S:198-217,1123-1176; DECISIONS:546,549).
4. Its carried work includes C-UI-1, S9-TODAY-CARRY, PASSPHRASE-NORMALIZE, the layout-v2 declarations and CI homes, now including F2-LAND as E fact 23 (S:1273-1296; DECISIONS:549,582).
5. TODAY-SPLIT rides S10, while S9 and the look precede the owner's trial; the new input pack must use v4 plus R4's binding corrections, not wait for a v5 (DECISIONS:543,549,575,578).

## 2. THE SECTION LIST OF THE S8 BRIEF

| S8 section | What S9's corresponding section needs | Source |
|---|---|---|
| Status/header | Package identity M2-S9-UI-PINS, parent M2-S8-REAL-SHAPE, accepted brief coordinates and measured sourceBase/parent artifact identity | S8:3-10; S:31,1261-1262; DECISIONS:549 |
| 1. Why | The two-path release, the limits of the original candidate list, the carried lanes and the reason the gates themselves become pinned | S8:12; S:38-90,859-860; DECISIONS:582 |
| 2. The declaration list, walked | A fresh Git-based parent-pin walk, final role counts and pre/post table, distinguishing released product from execution pins | S8:74-89; S:514-565,1261-1275 |
| 2.1 The product files | All carried product edits, new passphrase helper and F2 projector, two releases, and C-UI-1's eventual measured changes | S8:91; S:1273-1283; F2:67-94; DECISIONS:582 |
| 2.2 Sibling tests and ancestor specs | Five CHILD_SPECS edits, H18/H18b/H18c, moved view/adapter/import tests, and seven runner-only ancestor re-pins | S8:122-125; S:1260,1265,1269,1273-1274; DECISIONS:570,587 |
| 2.3 Runner, standing CI step, retargeted specs | Final runner after P-A1 to P-A13, S8 execution-pin supersession, combined workflow post-image and S9 flag/name before proposed() | S8:146-161; S:1260-1264; DECISIONS:587 |
| 2.4 First declarations | Six mirrors, release tooling cell, fence, pack cells, carried lane cells and F2 cells, with executed closure and measured new-file pre-images | S8:163-167; S:1258,1266-1275; F2:67-94 |
| 2.5 Not declared | Explicit exclusions: today-model, browser-check, design.cjs, withdrawn COPY-BIND, S10 split/retirement work and external generator | S8:186-197; S:1270-1272,1295-1296; DECISIONS:555,568 |
| 2.6 Everything else carried | Re-measure all other S8 product and execution obligations instead of assuming their old counts remain valid | S8:199-204; S:1261-1262 |
| 3. The bar | Separate release invariants, fence and pack evidence, carried behavior and final integrated measurements | S8:206; S:631-650; DECISIONS:566,583,587 |
| 3.1 Authors' bar tables | Attribute each lane's recorded results to its head and preserve known reds rather than adding unlike test counts | S8:208-244; A:314-379; B:70-92; C-R4:53-79; DECISIONS:581,583 |
| 3.2 Deciding cell | Release/grant equality, preserved unrelated pins, descendant release behavior and real-pack checks; no single S9 deciding-cell designation found | S8:246-255; S:631-650; A:197-228 |
| 3.3 Parent children re-executed | Re-run S8's 25 children under the runner environment, retarget the six mirrors and measure all needles at integration | S8:257-263; S:1258,1330-1332; DECISIONS:551,555 |
| 3.4 Own child | At least one declared child executing a role-new path, with roots and complete execution closure declared | S8:265-267; S:1256,1274-1275; RUN:771-788 |
| 3.5 Public CI | S9's own measured --ci outcome and proposed artifact after the wait list clears, not a copied S8 PASS claim | S8:269-270; S:1330-1332; DECISIONS:549 |
| 4. What does not move | Engine invariance, sealing-window coach revision, unchanged passphrase sealing/KDF, explicit off-seal writer exception and ASCII policy | S8:272-288; S:1264,1272; PN:29-47; DECISIONS:539,543 |
| 5. Two reseal rules | Flip the workflow before proposed(); use S8's receipt through the S9 sealing window | S8:290-318; S:1263-1264 |
| 5.1 Tooling prerequisites | E facts 1-22 plus E23, latest P-A/P-FENCE amendments, root/tail policy and re-pins last | S8:320-359; S:1248-1275; DECISIONS:567,582,587 |
| 6. Flow | Four PM line kinds after final grammar review, one integrated re-measure, review/seal/re-verify sequence and current integrator-only CI rules | S8:361-393; DECISIONS:549,563,565,582,587 |
| 7. Carries recorded, not adopted | Named debts, known reds, copy gap, writer-fence limit, browser check and pending design answers | S8:395-412; S:1343-1430; DECISIONS:570,577,587 |

PK8's fields to account for are `version, lanePackage, packageId, status, brief, sourceBase, dIds, laws, carriedAcceptedIds, privateLiveTriggered, parent, tooling, product, coverage, carrierSuccessor, witnessFlips, protectedSurfaces, authorizations, artifact, children, notes`; the new optional `release` block is separately closed, and artifact `released` is optional (PK8; RUN:1149-1160,1781-1786,3408-3416; DECISIONS:560).

## 3. EVERY CORRECTION R4 MAKES TO SPEC v4

| Spec sentence or omission | R4 correction | Later ledger disposition |
|---|---|---|
| TOLD-3: "139 ... checked by nothing"; C.6 q3 repeats that frame (S:1156-1157, F.5 TOLD-3) | 215/218 are asserted from inside the seal in one direction; three PREVIEW_COPY entries are not; 47 occur in no sealed file, 139 occur in the 09-18 pack, and any of the 218 can leave list and screen together (R4:61-108) | Adopted; PM's own old claim withdrawn (DECISIONS:549 A) |
| "844 reference screen images" (S:F.5 TOLD-3) | 844 files = 424 PNG + 419 JSON including INDEX.json + ENV.txt (R4:110-114) | Adopted (DECISIONS:549 A) |
| Walk has no explicit portable separator/order requirement (S:859-866) | Forward-slash paths and byte ordering on both OS; execute the Git-to-working-tree check on Windows (R4:320-329) | Adopted N1.1; current P10 Windows-only evidence must remain named (DECISIONS:549 B,566) |
| File types not checked (S:859-867) | lstat, never follow links, NOT-A-REGULAR-FILE by path (R4:151-160,330-332) | Adopted N1.2, extended to root/dangling junction witnesses (DECISIONS:549,556,563) |
| Ignore list burdens future untracked outputs (S:865-866) | Optional cheaper alternative: git ls-files plus working-tree hashes, dropping ignore list (R4:333-341) | DECLINED: local untracked pack files must remain visible; anchored literal ignore list stands (DECISIONS:549 B) |
| Day-of procedure omits platform baselines (S:877-887,1082-1105) | Every platform-of-record baseline must exist before literal capture; otherwise first Windows accept forces a reseal (R4:343-354) | Adopted as literal precondition (DECISIONS:549 B) |
| C.6 has seven questions and assumes a runnable state sheet (S:1143-1170) | Add machine/browser reproduction question; gate.py must never get a CI step; static emitted assets deserve consideration (R4:191-215,356-365) | Eighth question adopted; S10 owns its answer (DECISIONS:549 B) |
| "cost to lane C" leaves normal frequency unspecified (S:913-917) | No C-UI-1 through C-UI-8 ticket writes pack bytes after C-UI-0; machine rebasing is the real cost (R4:162-189,367-371) | Document correction adopted (DECISIONS:549 B) |
| C-UI-7 "food-host.mjs, not food-*" (S:346) | Ticket says food-*; four files, only food-host sealed (R4:373-382) | Document correction adopted (DECISIONS:549 B) |
| screens.template row says tickets 2,4 and excludes 3 (S:339) | C-UI-3 names t-today markup inside that file; 2,3,4 is materially correct (R4:383-388) | Document correction adopted (DECISIONS:549 B) |
| C-UI-7's sealed hosts presented as needed edits (S:A.2.1 ticket table) | R4 records, without changing the conclusion, DECISIONS:543's map saying hosts have no DOM/copy and need no ticket edit (R4:389-394) | No new resolution found; retain both citations (DECISIONS:543,549) |
| 419 records / 210 ids / 201 texts (S:1141-1142,1156) | 418 records / 209 ids / 200 distinct texts; INDEX.json is not a record (R4:396-402) | Adopted (DECISIONS:549 A-B) |
| released today-app falls through to S8; failure "two packages downstream" (S:173-186,1363) | After S10 releases it, CHILD_SPECS finds S9's real post; same red one generation closer (R4:404-409) | Document correction adopted; S9 still does not perform S10's re-home (DECISIONS:549 B; S:180-186) |
| APPROVED-PIN lists three refusal names (S:1078) | Add UNLISTED when runtime design.APPROVED names a path absent from the literal (R4:411-418) | Adopted; ORPHAN and UNREADABLE later added too (DECISIONS:549 B,556) |
| preview.css 6310 B, build.mjs 30974 B (S:C.5.2 item 3) | Historical measurements are 6314 B and 30991 B (R4:420-422) | Document correction adopted; integration bytes still TO MEASURE (DECISIONS:549 B; S:1262) |
| "Neither released file emits a single string that reaches the screen" (S:C.5.2 item 3) | Build emits build id and short commit; sealed problem.test guards them (R4:423-429) | Document correction adopted (DECISIONS:549 B) |
| .gitignore's output exclusions described on lane branch (S:865) | They were absent from the chain tip; do not mistake lane state for chain state (R4:431-436) | Document correction adopted (DECISIONS:549 B) |
| 14 sealed importers, 11 cells (S:163) | Refine census: 16 total, 14 sealed, 11 sealed cells; unsealed checkin-app and setup-app (R4:45,263-265) | No later S9 change found in ledger through :591 (DECISIONS:549-591) |
| 904 lines, about 90 KB (S:893-903) | Measured 92372 bytes, 90.2 KB, longest path 43; these are historical shape, not final literal (R4:38-41) | Re-measure remains mandatory (DECISIONS:549 E,566) |
| 31 of 37.5 hours can start (S:1536-1538) | Add a document hour for corrections (R4:307) | No new ratified S9 completion estimate found; preparation was dispatched separately (DECISIONS:549 D) |

## 4. EVERY PM RULING SINCE THE SPEC WAS ACCEPTED

| Ruling/event | Binding instruction | Ledger | Later status at cutoff |
|---|---|---|---|
| Pre-acceptance scope | Carry Today and passphrase; original split direction and copy-lock claims are historical inputs only | DECISIONS:539,542 | Split reversed at :543; copy claim withdrawn at :549 |
| Parallel review/process | Reviewer starts blind preparation alongside author; author, reviewer and integrator remain separate, with Fable final and both-OS evidence | DECISIONS:540 (3) | Later re-checks narrowed :563-564; no guard lowered |
| Carried-lane acceptance | Today carry has FOUR sealed edits, and passphrase has its own helper, tests and local-import CI obligation | DECISIONS:542 D,543 B | Both merged into S9 lane by :549 C |
| PM-R6 revised | Whole working-tree pack including gates/baselines; COPY-BIND withdrawn; S10 copy lock required; binding design identity is tree 6d7710467408f69e61a2917c583540fc2336a3fa | DECISIONS:546 | Stands with :549 corrections |
| E layout-v2 | Declare p3-layout-v2 cells from S9 onward | DECISIONS:547 | Stands; S:1281-1283 |
| Acceptance with corrections | v4 is accepted with R4 binding; corrections go in brief, no v5 | DECISIONS:549 | Stands |
| Pack rules / corrections | Adopt portable paths/lstat/UNLISTED/platform baselines; reject tracked-only enumeration; real rows fail by name until integrated | DECISIONS:549 A-B | Expanded at :556, accepted at :566 |
| Integration baseline | Today c26081ad and passphrase ba04c07f carried; da9f8683 removes identifying figures from a comment only | DECISIONS:549 C | Existing S9-lane base |
| Three prep lanes / wait list | Prep branches feed S9 only; literals/product map/needles/S9 CI/design cell/flag wait for audit and C-UI-1, then one re-measure; PM lines wait for final grammar | DECISIONS:549 D-E | Stands with E23 added at :582 |
| S10 boundary | Weigh-in writer moves under S10; H18's input list grows under S10, not by quiet post-release build edit | DECISIONS:550 | Split build remains S10 at :562,574,588 |
| Generator and needle question | Generator proposal/cross-check only, repeat needles twice; runner prefix matching of pass counts is a question for the S9 brief | DECISIONS:551 | Accepted for use at :555; runner question not closed by :591 |
| Pre-reseal evidence | S8 CI can refuse profile recomputation before naming moved files; X1 preserves old artifacts and X2 avoids release reads for no-release packages | DECISIONS:552 | X1/X2 confirmed at :560,573,587 |
| First CI merge rule | Lane merges tip last; PM appends nothing until checkout | DECISIONS:554 | REPLACED by :563, amended :565 |
| Generator home | Run b-seal-gen from its own worktree against --repo into scratch; never merge it into S9; fix r1-r4 on first use, read TODO, no --write, plain shell | DECISIONS:555 | Stands |
| Pack Q1-Q4 | Keep ORPHAN; add UNREADABLE and continue walk; link at quality/run refuses; no prep lane reaches chain before S9 | DECISIONS:556 | Stands; pack accepted :566 |
| Fence conditional acceptance | Name no-merge-base/deleted-runner/bad-JSON failures; require genuine added spec; tamper before reseal claim; after-merge skip limb not added | DECISIONS:559 | Reopened :570; subsequent fixes :572-583 |
| P-FENCE-1 | Fence runs after failure but not cancellation, with own row; integrator owes pack same condition and separate row | DECISIONS:559 | Fence confirmed :570; pack integration still owed :570 |
| Fence/H18 integration facts | H18b seals full bundle-list count; STOP-7 chain-ref availability answered; check runner/fence released-object compatibility | DECISIONS:559 | Stands |
| P-A1 | Both grant functions require final trimmed U+00B7 clause exactly RULED, only after standing-line compatibility measurement | DECISIONS:560 | Built/accepted :567; still stands |
| P-A2 | Release without bound parent product map refuses by name | DECISIONS:560 | Built/accepted :567; still stands |
| P-A3 | Ancestor release hash must equal grandparent pin | DECISIONS:560 | Narrowed further by P-A9 at :573 and :587 |
| P-A4 | H13 count sentence gets text-pinning evidence | DECISIONS:560 | Stands; executable spec coverage added under P-A11 |
| Runner shape deviations accepted | Optional release/released keys, no live rulingLine in artifact, Today-carry root, ui-port root deferred, deleted released files admitted | DECISIONS:560 | Stands; :567 adds explicit brief carries |
| Trial/import scope | Father starts fresh, so import-passphrase acceptance does not gate him; owner's trial day one remains undeclared | DECISIONS:561 (4)-(5) | Passphrase still carried in S9; no removal ruling |
| Integrator CI rule | PM alone merges tip at acceptance, pushes, holds ledger, waits both OS, fast-forwards then appends | DECISIONS:563 | AMENDED by :565 |
| Narrow re-check scope | Prep re-checks are narrow; S10 split starts alongside preparation but is not moved into S9 | DECISIONS:564 | Runner last-round boundary tightened :587 |
| Product-tree CI exception | Later merge bringing only DECISIONS and STATUS preserves product-tree evidence if name-only diff recorded; read confirming chain run afterwards | DECISIONS:565 | Stands; :582 adds preflight |
| Pack accepted / carries 18-20 | Accept 8d06902e, review-only head 1d0cbffa; literals integrator-only; inspect unexpectedly green real rows; use spec pack root; preserve unrowed-sort debt | DECISIONS:566 | Blind review commissioned :589, findings pending :591 |
| P-A5 | STOP-2 admits P-A3's specific assert and metadata map, nothing else | DECISIONS:567 | Expanded narrowly for P-A9 at :573,579,587 |
| P-A6 | Integration fixture for first-writer-wins ancestor tie | DECISIONS:567 | REPLACED by parent-only ancestry, P-A9 at :573 |
| P-A7 | PM says every M2-S9-UI-PINS token ends separator then bare RULED | DECISIONS:567 | No narrowing found; potential conflict with RUN's THEME/brief ACCEPTED checks |
| Runner acceptance / carries | Accept c3d58264; retain release-deletion admission, no-sourceBase drift, tail-policy limit, ui-port root/tail additions at re-measure | DECISIONS:567 | Acceptance REOPENED at :572,573,587 |
| F2 host duties | Preserve module bytes/no-drift; any throw is refusal, host rejects duplicate ids and chooses catalogue encoding; retirement deferred | DECISIONS:568 | Landing later routed into S9 at :582; host duties remain EW2 inputs |
| Review/custody process | Astra one named assignment at a time, Claude reviews Astra builds, PM sole ledger writer and Fable final | DECISIONS:569 | Budget amended :571; sealed/off-seal routing clarified :574 |
| Fence R3 corrections | Four unresolvable-parent worlds; tamper means own diff touches artifact AND absent/different worktree bytes; M29/M43; stale ci-second-gate routed to brief | DECISIONS:570 | Case-exact HEAD presence added :573; catch reversed :580 |
| CI-home conditions decision | Pack step needs condition plus own row; PM must decide whether E21/E22 steps also run after standing-step failure | DECISIONS:570 | Decision not found through :591 |
| Blind runner review | Extra Astra review may reopen prior acceptance | DECISIONS:571 | Did reopen at :572-573 |
| P-A8 | Both proposed maps preserve every own spec key, including __proto__ | DECISIONS:572-573 | Built :579; admission now further restricted by P-A12 at :587 |
| P-A9 initial | Ancestor release entries are closed four-key records | DECISIONS:572 | REPLACED/strengthened :573 and :587 |
| P-A10 | Refuse noncanonical repo-relative spellings, never normalize, after compatibility measurement | DECISIONS:573 | Built :579; witness walk widened :587 |
| P-A9 replacement | Read parent artifact only; require grandparent own PRODUCT membership, released role, hashes, sealedBy and matching product hash | DECISIONS:573 | Exact key set/own nonempty sealedBy/nonempty grandparent id ordered :587 |
| P-A11 | Execute spec() on committed synthetic packages; kill M01/M05/M06/M08/M09/M21/M23 individually | DECISIONS:573 | Built :579; confirmed :587 |
| Fence R4 | Query exact HEAD inventory spelling via Git inside touch guard; retain bytes, add X7/X8/X9 rows | DECISIONS:573 | Built :575; confirmed :580 |
| Off-seal correction / audit routing | New fence cells may be Astra builds; second teeth mutation runs outside sandbox, Astra judges/static-checks | DECISIONS:574 | Stands |
| Trial order | Look/C-UI-0 audit/C-UI-1/S9 precede trial | DECISIONS:575 | Reaffirmed :578; new trial-order question :590 is NOT RULED |
| D-F2-1 | Land unchanged module/cells/CI/no-drift, close six named rows, stop survivor hunt and record remaining coverage debt | DECISIONS:577 | Closed :581; carrier changed :582 |
| Product queue | S9/look first, then split/Edit My Week, then macros, re-plan and memory continuation | DECISIONS:578 | :582 says EW2 build cut after S10; :590 question is NOT RULED |
| Runner round 5 judgments | STOP-2 reading accepted, one red evidence commit acceptable, narrow path walk subject to reachable evidence; investigate three older maps | DECISIONS:579 | REJECT upheld and new rulings :587 |
| P-FENCE-2 | Land R5 row (6d) verbatim; REMOVE tamper-query catch and FENCE-INVENTORY-HEAD-UNREADABLE; unexpected failure must throw closed | DECISIONS:580 | Published :583; accepted :591 |
| F2 acceptance | R5 accept with notes, 81/81 and plan-edit 90/90; N1/N2 wait next cell edit | DECISIONS:581 | Standalone merge plan REVERSED :582 |
| E fact 23 | Merge entire d-f2-land into S9, including both cell paths and CI step; declare combined rebuild.yml post | DECISIONS:582 | Stands |
| Integrator preflight | Before any chain merge-forward, intersect chain...lane changed names with youngest product/executionPins; sealed hit routes lane to reseal | DECISIONS:582 | Stands |
| Fence round 6 state | 2f37a36e plus comment-only 8019abf6; 44 tests/43 pass/real row red both OS; R6 checks fail-closed removal | DECISIONS:583 | Accepted by :591; two new coverage gaps carried to integration |
| P-A12 | Refuse any exactly __proto__ path segment at admission after compatibility measurement; leave older map clauses alone | DECISIONS:587 | Implementation now on observed head, acceptance pending (:591) |
| P-A13 | Refuse two distinct walked spellings equal after lowercasing as PATH-CASE-COLLISION, report both; uppercase alone remains legal | DECISIONS:587 | Implementation now on observed head, acceptance pending (:591) |
| P-A9(b) tightened / P-A10 widened | Exact four own keys, own nonempty sealedBy, nonempty grandparent packageId; witnessPins keys and witnessFlips files, one row per walked field | DECISIONS:587 | Ordered round 6; re-pins last |
| D-A-FINAL | Last runner author round before S9, then narrow re-check of hunks/new clauses/witnesses only; surviving coverage becomes named S9 debt | DECISIONS:587 | Round 6 and its re-check not accepted at cutoff :591 |
| Additional blind looks / second teeth audit | Pack and passphrase blind reviews commissioned after acceptance; static second teeth audit starts before design PR-READY | DECISIONS:589 | Findings still require PM judgment (:591) |
| Trial-order question, not a ruling | Phone-earn placement after S9/look but before trial was put to owner and explicitly NOT RULED | DECISIONS:590 | No answer in the cutoff; do not present proposed order as accepted |
| Fence R6 acceptance / integration row | Accept B at 8019abf6, paper head 6f808cfa; integration adds one row with two assertions killing same-length and zero-byte inventory tampering | DECISIONS:591 | Stands; replaces pending B acceptance, carries R6-Z2/Z3 |
| Fence caller rule / platform limit | No caller may swallow the removed catch's throw; Y2 remains Windows-only | B-R6:320-329,483-496; DECISIONS:591 | Integration carry; no restored named refusal ordered |

## 5. THE DECLARED INVENTORY AS FAR AS IT IS KNOWN TODAY

All final S9 pre/post values are TO MEASURE from Git at the chosen sourceBase; historical lane hashes below are evidence, not values to paste into S9 (S:1261-1262).
"New" means the source's requested declaration role, not proof of absence at S9's eventual sourceBase; carried tests without a ruled product role are marked TO MEASURE (S8:86-89; S:1262,1282-1283).
Paths below are written in full; final carried rows still require the inherited inventory walk (S8:199-204; S:1262).

| Path | Role / lane statement | Reported pre -> post sha256; final integration value | Source |
|---|---|---|---|
| rebuild/m3/w7-preview/today/preview.css | released, retained audit baseline, no post pin | parent post 7cf97598c2c2cb2390dd0a7a855f322b68b27f4fa801df3e23536e4846126ea1 -> null; verify pre TO MEASURE | PK8:product; S:38-58,514-565 |
| rebuild/m3/w7-preview/today/build.mjs | released only with H18 in the same package | parent post d04a10ef406708b801749b1118246e82fecc53bbbafe1ac11068eb24bc52cf9c -> null; verify pre TO MEASURE | PK8:product; S:350-375 |
| rebuild/lanes/b/tooling/b-package.cjs | edited product plus execution pin; final admissions | A's pre e31dd206c0fb0fc0c295df45eae3992d4c59b1a76de8da04a4d0f22948e9335e -> round-5 post 316f86c541f109a5876f5ea8d0557164151585f4f5940ce8878c3bec02bee43e; round-6/final TO MEASURE | A:60-67; S:1266; DECISIONS:587 |
| rebuild/lanes/b/tooling/packages/H3.json | edited, runnerSha256 only | TO MEASURE -> TO MEASURE | S:1260 |
| rebuild/lanes/b/tooling/packages/S3.json | edited, runnerSha256 only | TO MEASURE -> TO MEASURE | S:1260 |
| rebuild/lanes/b/tooling/packages/S4.json | edited, runnerSha256 only | TO MEASURE -> TO MEASURE | S:1260 |
| rebuild/lanes/b/tooling/packages/S5.json | edited, runnerSha256 only | TO MEASURE -> TO MEASURE | S:1260 |
| rebuild/lanes/b/tooling/packages/S6.json | edited, runnerSha256 only | TO MEASURE -> TO MEASURE | S:1260 |
| rebuild/lanes/b/tooling/packages/S7.json | edited, runnerSha256 only | TO MEASURE -> TO MEASURE | S:1260 |
| rebuild/lanes/b/tooling/packages/S8.json | runner re-pin; parent execution obligation superseded-by-child | TO MEASURE -> TO MEASURE; ancestor product runner pins not retargeted | S:1260-1261 |
| rebuild/lanes/b/tooling/packages/S9.json | new package file / own execution pin | TO MEASURE -> TO MEASURE | S:1261-1262; RUN:3320-3327 |
| rebuild/lanes/b/tooling/test/release-from-seal.test.cjs | new tooling cell; add to TOOLING_FILES | TO MEASURE -> TO MEASURE; product declaration treatment TO MEASURE | S:1266; A:554-568 |
| rebuild/lanes/b/tooling/test/gate-supersession.test.cjs | edited tooling cell for shared P-A1 terminal | TO MEASURE -> TO MEASURE; product declaration treatment TO MEASURE | A:561; DECISIONS:560,567 |
| rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs | edited product/tooling literals: IDS, roles, roots and public tails | TO MEASURE -> TO MEASURE | PK8:product; S:1259; DECISIONS:560,567 |
| rebuild/lanes/b/tooling/test/seal-tip-and-byte-identity.test.cjs | edited tooling receipt/released-path controls | TO MEASURE -> TO MEASURE; product declaration treatment TO MEASURE | A:567; DECISIONS:560,567 |
| rebuild/m4/workout/test/s9-supersede-source-carriers.test.cjs | new mirror / execution pin | TO MEASURE -> TO MEASURE | S:1258; A:582-588 |
| rebuild/m4/workout/test/s9-supersede-inherited-carriers.test.cjs | new mirror / execution pin | TO MEASURE -> TO MEASURE | S:1258; A:582-588 |
| rebuild/m4/workout/test/s9-supersede-defect-witnesses.test.cjs | new mirror / execution pin | TO MEASURE -> TO MEASURE | S:1258; A:582-588 |
| rebuild/m4/workout/test/s9-supersede-writers-differential.test.cjs | new mirror / execution pin | TO MEASURE -> TO MEASURE | S:1258; A:582-588 |
| rebuild/m4/workout/test/s9-supersede-second-gate.test.cjs | new mirror / execution pin | TO MEASURE -> TO MEASURE | S:1258; A:582-588 |
| rebuild/m4/workout/test/s9-engine-files-differential.cjs | new mirror / execution pin | TO MEASURE -> TO MEASURE | S:1258; A:582-588 |
| rebuild/m3/w7-preview/measure/test/boundary.test.mjs | edited product/execution; youngest CHILD_SPECS and C.2 removal of only shaOf/declaredPost pair, preserving loop/ownership guard | TO MEASURE -> TO MEASURE | S:682-696,1265; B:79-92 |
| rebuild/m3/w7-preview/today/test/food.test.mjs | edited product/execution; youngest CHILD_SPECS | TO MEASURE -> TO MEASURE | S:1265 |
| rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs | edited product/execution; youngest CHILD_SPECS | TO MEASURE -> TO MEASURE | S:1265 |
| rebuild/m3/w7-preview/today/test/problem.test.mjs | edited product/execution; youngest CHILD_SPECS | TO MEASURE -> TO MEASURE | S:1265 |
| rebuild/m3/w7-preview/today/test/setup.test.mjs | edited product/execution; youngest CHILD_SPECS | TO MEASURE -> TO MEASURE | S:1265; A:590-605 |
| rebuild/m3/w7-preview/today/test/package.test.cjs | edited product/execution, H18 + H18b + H18c | TO MEASURE -> TO MEASURE | S:1269; DECISIONS:570 |
| rebuild/m3/w7-preview/today/test/design.test.cjs | conditional edited product/execution if C-UI-1 moves design.APPROVED; zero to three hunks, STOP-10 applies | TO MEASURE -> TO MEASURE | S:1323; C:624-627 |
| .github/workflows/rebuild.yml | edited combined post: standing S9 flag/name, fence, pack, Today, passphrase, local-import and F2 homes | F2 historical pre 8403d10b1a54d721a17e92cc0c2eb7fe119379b65cc4ba9625e6a7196ad9d532 -> old post 878baa7617f63e236d68213f672d716b67d976dcf1e4a6ce50948b7d06133499; combined pre/post TO MEASURE | S:1263,1267,1271,1273-1275; F2:334-339; DECISIONS:582 |
| rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs | new product/execution; add R6-Z2/Z3 row at integration | round-6 post 43bcda207174397681fb616b884bb951924250d48091b91bc0983d17762077e6 superseded by accepted post 673a02f9334af5e6a4469a4085ead55bcc465b1a62650a49da3896207986b199; integrated pre/post TO MEASURE | S:1267; DECISIONS:583,591 |
| rebuild/lanes/c/ui-port/pack-pin.test.mjs | new product/execution, final whole-pack literal | TO MEASURE -> TO MEASURE | S:1271; C-R4:162-169 |
| rebuild/lanes/c/ui-port/approved-pin.test.mjs | new product/execution, final design.APPROVED literal | TO MEASURE -> TO MEASURE | S:1271; C-R4:162-169 |
| rebuild/m1/approved-2026-09-08/Earned-refinement-A.html | proposed pinned-unchanged; final reference membership depends on C-UI-1 | TO MEASURE -> TO MEASURE | S:1270; S:C.5.3 |
| rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html | proposed pinned-unchanged; same qualification | TO MEASURE -> TO MEASURE | S:1270; S:C.5.3 |
| rebuild/m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md | proposed pinned-unchanged; same qualification | TO MEASURE -> TO MEASURE | S:1270; S:C.5.3 |
| rebuild/m1/MOCK.md | proposed pinned-unchanged; same qualification | TO MEASURE -> TO MEASURE | S:1270; S:C.5.3 |
| rebuild/m3/w7-preview/today/gym-model.mjs | pinned-unchanged writer brought inside seal | TO MEASURE -> same TO MEASURE | S:1270 |
| rebuild/m3/w7-preview/today/checkin-app.mjs | pinned-unchanged writer brought inside seal | TO MEASURE -> same TO MEASURE | S:1270 |
| rebuild/m3/w7-preview/today/today-app.cjs | edited, Today carry; not released | TO MEASURE -> TO MEASURE | S:1273; TC:27-35; DECISIONS:542 (D) |
| rebuild/m3/w7-preview/today/test/view.test.mjs | edited product/execution, Today carry | TO MEASURE -> TO MEASURE | S:1273; TC:27-35 |
| rebuild/m3/w7-preview/today/test/adapter.test.mjs | edited product/execution, Today carry | TO MEASURE -> TO MEASURE | S:1273; TC:27-35 |
| rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs | CI/child execution input; product role disputed by E20's exclusion, TO MEASURE | TO MEASURE -> TO MEASURE | S:1256,1273; A:410-421 |
| rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs | CI/child execution input; product role disputed by E20's exclusion, TO MEASURE | TO MEASURE -> TO MEASURE | S:1273; A:410-421; DECISIONS:560,567 |
| rebuild/m3/w6/local/import-bundle.mjs | edited product, passphrase carry | TO MEASURE -> TO MEASURE | S:1274; DECISIONS:543 (B) |
| rebuild/m3/w7-preview/import/import-screen.mjs | edited product, passphrase carry | TO MEASURE -> TO MEASURE | S:1274 |
| rebuild/m3/w7-preview/import/test/page-bundle.test.mjs | edited product/execution; module counts 142->143 and 20->21 | TO MEASURE -> TO MEASURE | S:1274 |
| rebuild/m3/setup/port/passphrase.cjs | new sealed product; key-material decision | TO MEASURE -> TO MEASURE | S:1274 |
| rebuild/lanes/c/passphrase-normalize/helper.test.mjs | new lane cell, CI/child execution | TO MEASURE -> TO MEASURE | S:1274 |
| rebuild/lanes/c/passphrase-normalize/route.test.mjs | new lane cell, CI/child execution | TO MEASURE -> TO MEASURE | S:1274 |
| rebuild/lanes/c/passphrase-normalize/unlock-forms.test.mjs | new lane cell, CI/child execution | TO MEASURE -> TO MEASURE | S:1274 |
| rebuild/m3/w6/test/local-import.test.mjs | E22 CI home and declared child; product role TO MEASURE | TO MEASURE -> TO MEASURE | S:1275 |
| rebuild/lanes/d/p3-layout-v2/layout-v2.test.mjs | carried lane cell/child; product role TO MEASURE | TO MEASURE -> TO MEASURE | S:1256,1282-1283; DECISIONS:549 |
| rebuild/lanes/d/p3-layout-v2/projector-parity.test.mjs | carried lane cell/child; product role TO MEASURE | TO MEASURE -> TO MEASURE | S:1256,1282-1283; DECISIONS:549 |
| rebuild/m4/workout/setup-tags.cjs | E23 new sealed product | reported absent -> d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d; final pre/post TO MEASURE | F2:331; DECISIONS:582 |
| rebuild/lanes/d/f2/projector.test.mjs | E23 new test, explicit two-cell CI/child | reported absent -> f74bbe5f40624237a4d24536b3ead036a75ed3bc705a52d6e55032d28bdf8dd6; final pre/post TO MEASURE | F2:332; DECISIONS:582 |
| rebuild/lanes/d/f2/guard-coverage.test.mjs | E23 new test, explicit two-cell CI/child | reported absent -> historical b84b0b4056fbb1f82b11dd63d4a335674e57176ced31b2defd6748ed0c1002da; later round moved it, final pre/post TO MEASURE | F2:333; DECISIONS:581-582 |
| rebuild/lanes/b/S9-UI-PINS-BRIEF.md | brief execution pin | TO MEASURE -> TO MEASURE | S:1329; RUN:3320-3327 |
| rebuild/m4/spec/acceptance-s9-ui-pins.json | generated artifact, not its own product pin; two release records | final artifact/parent hashes TO MEASURE | S:1206,1261,1268; RUN:1987-1989 |
| rebuild/m4/spec/review-s9-ui-pins.json | review envelope, not a product declaration supplied by this pack | final review/receipt coordinates TO MEASURE | RUN:1987-1989; S8:361-393 |

The four reference rows do not require every pack file to become an individual product row: approved-pin derives its literal from live design.APPROVED, including approved paths outside the new pack, while pack-pin holds the entire approved-2026-09-18 tree through one sealed cell (S:C.5.1,C.5.3; R4:123-131).
Final inherited S8 rows and C-UI-1's moved files require the complete Git walk; this table does not assert a final declaration count (S8:74-89,199-204; S:1262; A:582-588).
E21 needs a passphrase step and root; E22 needs local-import's explicit step and declared child but no new root; E23 needs both F2 cells in one explicit step/child and the combined workflow pin (S:1274-1275; DECISIONS:582).
H18 fixes the 26 Today entries in the 48-input build; H18b holds the full 48 and H18c the engine pack, with future deliberate input changes routed through S10 (S:1269; DECISIONS:570).
Neither today-model.cjs, browser-check.mjs, design.cjs nor withdrawn copy-bind.test.mjs is a new declaration merely because this spec discusses it; browser-check still needs the PC pre-seal verdict (S:1270-1272).

The release must not coincide with any of the five execution-pin routes: runner, this package file, brief, carrier successor or a child argv target; release deletion is admitted, unrelated drift/completeness/held checks remain, and a ticket that moves a released file before sourceBase stops S9 sealing (RUN:1519-1547,3320-3327; DECISIONS:567).
E facts 1-6 require IDS thirteen with S9 after S8/before B1, NO_REGISTER_IDS nine, six product roles, whole-list root literals and matching F6/F7/F8 evidence; the new roots are layout-v2, p3-today-hotfix, passphrase-normalize and s9-today-carry, with ui-port added at integration and only ui-port added to public tails (S:1254-1259; A:400-421; DECISIONS:560,567).
The brief inherits F.2's eleven stop conditions, read with later rulings: no real grant; forbidden seal-core hunk (STOP-2 amended only for named P-A asserts); unexpected --ci refusal; dishonest cell re-home; quoting the split-dependent estimate without the split; missing H18; absent chain inventory; unverified skip; unnamed/narrowed pack pin; dishonest design-reference retarget; or claiming S9 has closed the wording lock (S:1367-1430; DECISIONS:559-560,567,573,587).

## 6. THE PM TOKEN LINES S9 NEEDS

SEP below means the single U+00B7 character, represented here as \u00b7 to keep this document ASCII, not a literal backslash sequence in the ledger (RUN:980-1013).
Both grant parsers split on SEP, trim each clause and require an anchored full-clause match: negation, wrappers, extra prose and whitespace inside a comma list grant nothing (RUN:971-995).

| Kind | Exact implemented grammar/predicates at the observed runner head | S9 input still needed |
|---|---|---|
| RELEASE-FROM-SEAL | ^RELEASE-FROM-SEAL\s+(M2-[A-Za-z0-9-]+)\s+([A-Za-z0-9_.\/-]+(?:,[A-Za-z0-9_.\/-]+)*)$; final trimmed SEP clause exactly RULED | PM clause naming M2-S9-UI-PINS and both paths below; unique whole-line sha256 in release.rulingLineSha256 (RUN:993-1013,1474-1504; DECISIONS:560,567) |
| GATE-SUPERSESSION | ^GATE-SUPERSESSION\s+(M2-[A-Za-z0-9-]+)\s+([a-z0-9]+(?:-[a-z0-9]+)*(?:,[a-z0-9]+(?:-[a-z0-9]+)*)*)$; same terminal rule | PM grant for declared carriers; sha256 in coverage.superseded.rulingLineSha256 (RUN:980-983,1405-1446; DECISIONS:560,567) |
| THEME | claim role cowork; cited line includes packageId and ends exactly SPACE SEP SPACE ACCEPTED; no THEME-token regex | Real PM theme citation; P-A7 terminal conflict remains (RUN:1976-1982; DECISIONS:567) |
| BRIEF-BY-SHA | claim role cowork; non-null citation requires BRIEF-ACCEPTED status; line includes packageId and brief.file and matches (?:^\|[ \u00b7])ACCEPTED$; no BRIEF-BY-SHA-token regex | Final brief bytes/hash and PM citation; P-A7 terminal conflict remains (RUN:1798-1812; S8:3-10; DECISIONS:567) |

The required clause is RELEASE-FROM-SEAL M2-S9-UI-PINS rebuild/m3/w7-preview/today/preview.css,rebuild/m3/w7-preview/today/build.mjs, standing alone on the PM's real line; this is required text, not an issued authorization (S:38-58,350-375; RUN:993-995,1485-1504).
The supported carrier vocabulary is source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate, and every granted carrier must belong to that closed set (RUN:926-927,1440-1444).
For grants the runner re-reads DECISIONS at CHAIN_REF on EVERY call, splits CRLF/LF, hashes each complete UTF-8 line without its newline and requires exactly one match; local-branch prose or a cached earlier read cannot substitute (RUN:1412-1421,1485-1488).
Release clauses for this package are unioned and must equal the declared released set in both directions; parent ownership and execution-pin exclusion are additional checks (RUN:1465-1471,1496-1504).
P-A1 replaces final-word matching with final-CLAUSE RULED for both grant functions after compatibility checks; P-A11's M23 removes the release regex's leading anchor and now turns its named row red, so the anchoring must survive integration (RUN:996-1013; RTEST:1301-1310; A:217,227; DECISIONS:560,573).
P-A7 says S9 token lines end with bare RULED, which disagrees with THEME and brief's current ACCEPTED predicates; a PM resolution is needed, not a silently invented grammar (DECISIONS:567; RUN:1805-1806,1981-1982).

## 7. NAMED DEBTS AND KNOWN REDS

| Item | What the brief must state, with its boundary |
|---|---|
| D-A-FINAL | Round 6 is the last runner author round before S9, then narrow review of hunks/new clauses/witnesses; ten of twenty new-clause mutations survived round 5, and remaining final survivors become named S9 debt (DECISIONS:587) |
| D-F2-1 / F2-GUARD-TERM-COVERAGE | Five looks leave eleven projector terms without a row; carry the list as debt and require term-by-term evidence before calling a term redundant (DECISIONS:577,581; F2:1342-1352) |
| Stale red / homeless cell | rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs:29 pins workflow bytes against a777f643 and has no CI home; PM names its unresolved disposition, not an unrecorded deletion or re-pin (DECISIONS:570; B:1341-1355) |
| Two pre-reseal reds | measure/test/boundary.test.mjs P-MEASURE(g) and today/test/setup.test.mjs re-pin were red for carried bytes undeclared by S9; prep adds its own edits to the named lists (DECISIONS:552; B:79-92; A:594-605) |
| Six mirror load reds | Each s9 mirror has 0 pass/1 fail with ENOENT packages/S9.json, whose inventory waits for C-UI-1; these are not skips (A:582-588) |
| Pack / approved real reds | C's accepted bar is pack 41/40/1 and approved 26/25/1: PACK-ROOT-ABSENT now, then LITERAL-EMPTY after pack arrival; approved row names the two 09-08 HTML paths UNLISTED until filled; Q4 prevents these reds reaching chain before S9 (DECISIONS:556,566; C-R4:60-77; C:202-214,628-632) |
| Fence real red | Accepted B is 44/43/1 on both systems, real row naming nine touched sealed paths; the real S9 child must satisfy verified reseal conditions at integration (DECISIONS:591; B-R6:220-249) |
| Fence R6-Z2/Z3 | ONE new integration row, TWO asserts: same-length inventory forgery and zero-byte inventory each fail; both non-equivalent substitutions survive the existing rows (DECISIONS:591; B-R6:332-393) |
| Fence platform/callers | Y2 is killed only on Windows; no caller may swallow the removed catch's throw, because fail-closed behavior now relies on the callers (B-R6:320-329,483-496; DECISIONS:591) |
| Fence's explicit limit | D.2 says "until then this fence passes a lane C branch that rewrites the weigh-in admission bounds": today-model.cjs remains outside until TODAY-SPLIT, while gym-model and checkin-app enter S9's seal (S:1215,1270-1272) |
| Wording lock | 215 of 218 entries have the existing forward assertion, but simultaneous list-and-screen removal is not held; COPY-BIND is withdrawn and reverse/list completeness is S10's precondition (R4:73-108; DECISIONS:546,549) |
| Whole-pack residuals | The real rows are held only by the eventual seal; PACK_ROOT_REL lacks a protecting row; P37/P39 output-order sorts remain unrowed because deterministic filesystem enumeration was unavailable (C-R4:181-196; C:723-746) |
| Non-ASCII / ignored subtrees | Accepted pack paths are ASCII; comparator rows do not prove a non-ASCII filename on disk, and ignored subtrees remain a stated boundary rather than a widened ignore list (C-R4:210-216; C:914-918) |
| F2 class / twin | setup-tags makes the closed workout class four files and calls for law 17 supersession by name; twin retirement waits until reseal (F2:341-347; DECISIONS:568,582) |
| Browser checks | browser-check.mjs is neither sealed nor CI-homed; its PC pre-seal result belongs in the verdict (S:1272) |


The whole-pack input is rebuild/m1/approved-2026-09-18/**, including README.md and quality/**; the binding identity is tree 6d7710467408f69e61a2917c583540fc2336a3fa rather than the README's unreproducible claimed composite sha, and the final sorted path/hash literal is TO MEASURE (DECISIONS:546,549; R4:302,306; S:C.5.1).
The day-of pack procedure requires all platform baselines first, the design lane's actual checkout, the spec's pack root, forward-slash byte-sorted paths and a Windows working-tree comparison; the obsolete 53-file literal is not reused (C:594-627,732-737).
Pack/approved cells stay outside TOOLING_FILES; both vocabularies now have seven refusals, the real rows use no injected reader, unreadable files are named while the walk continues, and an unreadable directory still throws loud red (C:637-651,672-683).
Additional residuals to state: an importable Python file inside an ignored __pycache__ directory is invisible by construction; future extra output directories count as ADDED rather than justifying a wider ignore list; match full APPROVED-PIN refusal strings, not the prefix already used by design.cjs (C:684-703).
The fence's non-NUL diff parsing still relies on Windows forbidding quote/tab filenames; this is a platform constraint, not a guarantee supplied by the fence, and its release-object shape needs one cross-lane cell against the runner's artifact (B:1352-1358; DECISIONS:559).
The eleven F2 debt terms are setup-tags.cjs:16 !Array.isArray(x), :19 day regex, :29 typeof value, :41 descriptor value ownership, :58 b===null, :74 freeze(regionsByMuscle), :86 head fallback, :124 snapshot id ownership, both :154 head/secondary ownership terms and :181 !plain(facts); none is declared redundant (F2:756-781,1342-1352).

The PM also carries release deletion admission, unnamed/unreachable-in-CI RELEASE-CHAIN-REF-ABSENT, root-tail policy held only by the list length, and the residual B.8 behavior-recording row; these must not disappear under a green tooling total (DECISIONS:567).
Both grants use SHA-identified exact lines, while THEME/brief claims additionally carry ledgerLine, role, line and lineSha256; claim() checks one-line text and self-hash, and authority() resolves their bytes from Git (RUN:1161,1292-1295,2566-2600).

## 8. WHAT WAITS ON OTHER LANES

| Dependency | Concrete input or action |
|---|---|
| Design pack / C-UI-1 | C-UI-0 PR-READY, second teeth audit and C-UI-1 precede final inventory/literals; OQ2's approved-reference decision feeds the final design.APPROVED measurement (DECISIONS:549,591; S:C.5.1,C.5.3) |
| Second teeth audit | Static half was pulled forward at design head 18c3b63e; dispatch is not completion of the full second audit (DECISIONS:589,591) |
| C blind review after acceptance | C remains accepted at :566, but the new blind review can yield findings for PM judgment before integration (DECISIONS:589,591) |
| Passphrase blind review | Accepted at :543(B); additional blind review dispatched at :589 is neither acceptance nor reversal (DECISIONS:543,589) |
| Runner round 6 | P-A12/P-A13, tightened P-A9(b), widened P-A10, witnesses and final seven re-pins await completion/narrow re-check; observed implementation commits are not acceptance (DECISIONS:587,591; RUN:1192-1320) |
| Fence check R6 | Wait now CLOSED by :591; its two-assert row remains the integration hand's task, reviewed by Astra with integration (DECISIONS:591) |
| Declarations / CI | Measure combined posts after carries, write S9.json, reconcile roots/public tails and needles, move standing S9 flag/name before proposed(), then measure integrated bar (S:1256-1265,1273-1275; DECISIONS:567,582) |
| Seal generator | First use closes r1 output-inside-generator-repo, r2 newline command splitting, r3 template-literal specifiers and r4 fetch-log redirection on b-seal-gen; read TODO, no --write, --needle-repeat 2 in plain shell, watch first real writing stages; never merge generator into S9 (DECISIONS:555) |
| PM authorizations | Real release/theme/brief/gate citations depend on final brief/package inputs and resolution of terminal mismatch (DECISIONS:567; RUN:1405-1446,1798-1812,1976-1982) |
| S10 boundary | TODAY-SPLIT and wording lock remain later work, not unfinished implementation to declare in S9 (DECISIONS:543,549,575) |

## 9. CONTRADICTIONS YOU FOUND

The paired statements below are retained for PM/brief-author judgment without a resolution supplied by this input pack (R4:61-114; DECISIONS:549).

| Source statement A | Source statement B |
|---|---|
| P-A7 says S9 token lines finish with bare RULED (DECISIONS:567) | THEME ends SPACE SEP SPACE ACCEPTED; brief acceptance matches terminal ACCEPTED (RUN:1805-1806,1981-1982) |
| Spec ancestry unions parent and grandparent released maps (S:B.3; RUN:2178-2194) | P-A9(a) orders parent-only closed chain and removes union (DECISIONS:573; RUN:2200-2221) |
| E20 says the two unpinned Today lane cells are therefore not declarations (S:1273) | Preparation requires both cells in child argv, and the runner's root comment says every executed file is declared product (A:410-421; RUN:470-474) |
| Original D.2 refuses differing chain/worktree artifact bytes, without touch qualification (S:1207) | Accepted fence requires touch and case-exact HEAD check; byte-equal touches pass that check (B-R6:179-195,517-532; DECISIONS:591) |
| Spec draws a live rulingLine field and required release/released keys (S:B.4; DECISIONS:560) | Runner drops live line number and closes optional keys to preserve old artifact recomputation (RUN:1149-1160,3337-3349; DECISIONS:560) |
| D.2 supplies after-merge condition-(3) exception (S:1210) | B ruling says not to add it because the walk already handles the merged branch (DECISIONS:559) |
| R4's proposed replacement says locked tests check every one of 218 entries (R4:103-105) | R4's table says 215 asserted and three PREVIEW_COPY entries not asserted (R4:73) |
| Spec has 419 records/210 ids/201 texts and calls 844 files images (S:C.6,F.5) | R4 measures 418 records/209 ids/200 texts and 424 PNG + 419 JSON + one ENV file (R4:49,110-114) |
| F2 declaration table and law-17 instruction name S10 (F2:324-347) | PM moves F2-LAND's sealed workflow hunk/declarations to S9 as E23 (DECISIONS:582) |
| F2 declaration table gives earlier guard/workflow post-images (F2:333-339) | Later round changes guard suite and workflow comment; those are not final integrated posts (DECISIONS:581-582) |
| R6 reports four B report statements stale at review time (B-R6:534-559) | PM's later paper commit says all four corrected at 6f808cfa (DECISIONS:591) |

## 10. NOT FOUND

NOT FOUND means no final S9 value in the cited inputs through DECISIONS:591, not permission to invent one (S:1262; DECISIONS:591).

| S8 brief item / required detail | Missing S9 input and searched boundary |
|---|---|
| Accepted header / sourceBase | NOT FOUND: final accepted S9 brief coordinates, measured size/sha and sourceBase after C-UI-1/carries; preparation base da9f8683 is not proof of final package base (S8:3-10; S:1261-1262; DECISIONS:591) |
| Full walked declaration list | NOT FOUND: final inventory/role totals, C-UI-1 edits and all measured Git pre/post values (S8:74-204; S:1262; A:582-588) |
| Complete package fields | NOT FOUND: S9.json with final children/needles, laws, coverage evidence, carrier-successor coordinates, witness flips, authorization hashes and exact parent artifact hash (PK8; S:1261-1262; A:582-588) |
| Deciding cell / final bar | NOT FOUND: final deciding-cell designation and executed integrated table, including hosted ubuntu/windows run identifiers (S8:206-279; DECISIONS:591) |
| Final design-reference choice | NOT FOUND: C-UI-1's resulting design.APPROVED list, approved/whole-pack literals and final platform evidence (S:C.5.1,C.5.3; DECISIONS:591) |
| Actual PM token lines | NOT FOUND: final four citations/hashes and ruling on P-A7 versus THEME/brief ACCEPTED; required grammar is not an issued line (S8:3-10,280-287; DECISIONS:567; RUN:1805-1806,1981-1982) |
| Final runner debt | NOT FOUND: round-6 completion, narrow verdict and D-A-FINAL survivor count (DECISIONS:587,591) |
| CI conditions | NOT FOUND: PM decision on run-after-failure conditions for E21/E22 and final public-tail/root evidence after integration (DECISIONS:570; A:400-421) |
| Stale cell disposition | NOT FOUND: final CI home, explicit retirement or authorized re-pin for ci-second-gate.test.cjs:29 (DECISIONS:570) |
| Carried open choices | NOT FOUND: final child needles and S9 law-17 supersession text after F2 carrier changed; E23 is not the finished package (F2:341-350; DECISIONS:582) |
| Artifact / review / receipt | NOT FOUND: final S9 bytes/hashes, reviewed commit and POSTFIX-ACCEPTANCE line (S8:361-393; RUN:1987-1989; DECISIONS:591) |
| Owner handoff | NOT FOUND: S9 equivalent of S8's final deploy/port-retry evidence and declared trial day one; the later fresh-start answer does not supply that date (S8:390-393; DECISIONS:561) |
| Post-seal sequence/evidence | NOT FOUND: final sealing-window transition, browser-check verdict, released-path demonstration and integrated CI result (S8:289-337; S:1264,1272; DECISIONS:591) |
| Final report/verdict | NOT FOUND: S9 builder report and verdict grounded in completed integration; lane reports remain separate attributed evidence (S8:339-412; DECISIONS:591) |
