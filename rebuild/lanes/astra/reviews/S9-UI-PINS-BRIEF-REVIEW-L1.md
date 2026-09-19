# S9-UI-PINS brief blind review, round 1
Reviewer: Astra (Codex), commissioned under DECISIONS:412, :569 and :613; blind review, loop round 1; highest effort
Reviewed head: b1aaecf5292e6739f1a464dff013a59ffac26497
Brief: rebuild/lanes/b/S9-UI-PINS-BRIEF.md; sha256 9f7d51e49a8bf0f075fcbbb6621ebc347aac81044d43fc7f074469e2f7d62353; 81865 bytes.
VERDICT: REJECT
Scope: instructions and public, synthetic evidence only; no seal or package artifact was written.

BLOCKING
B1. Header and section 9.1: sourceBase is the post-merge HEAD, updated after every merge.
Command: node scratch/probe.cjs (exact held() from runner 397ac466, real explicit Git blobs).
Output: HEAD plus import-bundle.mjs and today-app.cjs each refuses PARENT-PIN-BROKEN-AT-SOURCEBASE; runner-head 397ac466 also refuses for b-package.cjs. Additional base-check.cjs: accepted S8 candidate 0cd07be7cf967dfbfea8c84947ba8477f58cfb5f is an ancestor of this HEAD and matches ALL 227 distinct parent product/execution pins, 227 equal/0 different.
Correction: Preserve an ancestor satisfying every S8 parent pin before the carried edits; 0cd07be7cf967dfbfea8c84947ba8477f58cfb5f is a measured candidate for the PM to name. Post-merge HEAD is the candidate-under-review, not a replacement sourceBase.

B2. Sections 5.1 fact 3 and 9.6: ui-port is the twenty-fifth CHILD_ROOTS entry, while F2's two files must be child argv targets.
Command: node scratch/probe.cjs, childArgv() from 397ac466 with each F2 target and --test.
Output: CHILD-ARGV-TARGET f2-land rebuild/lanes/d/f2/projector.test.mjs; same refusal for guard-coverage.test.mjs.
Correction: Add rebuild/lanes/d/f2/ as well as ui-port/ to CHILD_ROOTS and its literal guards; remeasure the resulting count. Keep only ui-port/ as the new PUBLIC_TAIL_ROOTS member.

B3. Section 2.4.1 option (a): new with equal sourceBase pre/post is something "the runner admits".
Command: node scratch/probe.cjs, exact product() with four synthetic unchanged document declarations and an empty parent map.
Output: PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE for all four paths, from runner lines 2447-2453.
Correction: This option is refused for an unsealed S9; retain pinned-unchanged and make a genuine reader visible to executedClosure, subject to PM ruling.

B4. Section 2.4: final SHA-256 values can be measured "by git hash-object".
Command: git hash-object --stdin, supplied the raw blob from git show b9777fe4:rebuild/lanes/d/f2/guard-coverage.test.mjs -- rebuild/lanes/d/f2/guard-coverage.test.mjs; SHA-256 over that identical input.
Output: Git blob id 91297a68de11b0b462986807c7a7c03106bc2783 versus SHA-256 78d1d73c02b115981006ab38dd0a16bfcd9fddbee8afa40c872964155281b9e7.
Correction: Use SHA-256 over raw file/blob bytes, never the Git object id; a 40-hex post fails PRODUCT-POST-IMAGE-SHAPE.

B5. Section 6 step 3: all four named spec fields are "each a sha256".
Command: node scratch/probe.cjs, exact claim() with a 64-hex string for theme and brief acceptance.
Output: Authorization claim theme; Authorization claim brief acceptance (closed-key assertion).
Correction: Only the two rulingLineSha256 fields are strings; theme and acceptedLedgerLine are four-key claim objects, as section 10.6 correctly says.

B6. Section 4 quotes the owner as "1. C-UI-0 is the long pole for the look. ... No check is dropped."
Command: node scratch/probe.cjs and check-report.cjs, raw quotation substring comparison with DECISIONS:536 and :593 at 05466ebb.
Output: point 1 exact=false, including after Markdown soft-wrap folding: the owner did not write the three-dot omission. "Yes, release the screen\n  files" is also raw exact=false but soft-wrap-folded=true; the gauge quotation is exact=true. There is one wording change and one formatting-only raw-character difference.
Correction: Quote the complete point 1 from DECISIONS:593, or quote its two unchanged sentences separately with the omission outside quotation marks; keep the release quotation on one source line for literal equality. The omission is BLOCKING under the commission's character-for-character rule.

B7. Section 2.6 includes "all 45 tracked rebuild/engine files and rebuild/coach/engine-revision.cjs" among files CARRIED at S8's own post.
Command: node scratch/more-measures.cjs, final-probes.cjs and remaining.cjs; S8 maps plus exact product() with synthetic carried declarations for EVERY unpinned engine path and the coach constant.
Output: engine tracked=45, parent product=18, parent execution=0, unparented=27; all 27 refuse UNLISTED-PRODUCT-DRIFT. Coach product=null, execution=null and also refuses UNLISTED-PRODUCT-DRIFT. Example: rebuild/engine/test/census-partial.cjs is not parent-pinned and is not declared new.
Correction: Carry the 18 parent-pinned engine paths and preserve all 45 tracked engine bytes, keeping the other 27 outside the product map. Leave the coach constant outside both maps, preserve its S8 value through the sealing window, then perform the separately authorized revision update.

B8. Sections 2.2 and 2.6 omit an edited declaration for tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs and carry everything else unchanged.
Command: git diff --name-status 789baf6e 397ac466 -- rebuild/lanes/b/tooling/test; node scratch/inventory.cjs.
Output: S8 product post 24525b8f97e90ef0a4501ef233c253989387281315127ed1742943acee19d3e1; runner-lane post a238242f3a78628e2235300d531a2f7a49d02c70bfc90d48190955281a79a992. final-probes.cjs executes product() with changed synthetic bytes and reproduces UNLISTED-PRODUCT-DRIFT for this carried path.
Correction: Add that cell as edited, with S8's post as pre and the final F6/F7/F8-adjusted SHA-256 as post.

B9. Sections 10.2 and 12.4 derive the supersession token's carriers from coverage.moves.
Command: node scratch/inventory.cjs, runner:1917-1920 with moves={"source-carriers":{}}.
Output: COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING source-carriers; coverage.moves must be {}.
Correction: Derive the carrier set from coverage.superseded.gates and its evidence, leaving coverage.moves empty; measure the five inherited supersessions and obtain the PM's line.

B10. Section 6 steps 3-5 and 11: cite/edit the spec, run --ci, then seal, update the constant and immediately run the byte-identity recheck; no commit checkpoints are stated.
Command: node scratch/final-probes.cjs, exact runner:1846, :1852 and sealedRunReceipt() with distinct synthetic disk/Git bytes.
Output: RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER-IN-GIT; SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT; {ok:false,code:"SEALED-RUN-RECEIPT-NOT-IN-GIT",at:"HEAD"}. The last output makes an authorized rerun FULL, not BYTE-IDENTITY.
Correction: Commit the final runner/spec before each --ci; after the authorized seal, commit the receipt and name its SHA-256 in VERDICT-S9.md before requesting BYTE-IDENTITY, as sealedRunReceiptInstruction() requires. Commit the coach update before final CI. These are instructions for the integrator, not actions performed in this review.

NOTES
N1. Sections 3.5 and 5(a) predict C5 red throughout the sealing window, while 5(b) and the actual standingSeal() explicitly accept the parent receipt in that window; predict green with an accepted S9 spec and the S8 constant, red only for a violated window invariant.
N2. Section 2.4.1's design.cjs:35-46 citation does not show four runtime data paths: MOCK.md and the handoff are comments; only the two HTML paths are APPROVED entries.
N3. Section 12, item 1 calls 397ac466 accepted while section 3.1 and DECISIONS:598 leave Astra R6 pending; say built, re-check pending throughout.
N4. Section 12, item 1's historical runner hash is not the object at 2a8526b5: that object is 71c1b2592b5a3544b71c0995a9f52b88fbe24cd6b821709309aa95e5ad3012c0, not 316f86c541f109a5876f5ea8d0557164151585f4f5940ce8878c3bec02bee43e (which matches 4ccfdfcd); distinguish the stale report from its already-updated runner.
N5. Section 2.3's explicitly historical workflow hash 878baa7617f63e236d68213f672d716b67d976dcf1e4a6ce50948b7d06133499 is not b9777fe4's workflow: 5e4353267924ebca1a19d996c317864475e77e0ba4deaddea09a15cdf1e776e0; add the historical head, keeping final measurement pending.
N6. Section 8's red table mis-cites DECISIONS:552 and A:594-605: the former reports infrastructure outage/initial preparation status, the latter older tooling/mirror results; cite the actual boundary/setup output and head instead.
N7. Section 3.3's S8-PREP-AUTHOR-REPORT.md:117 is a heading; the needle instruction follows at 119 onward; cite that range.
N8. Section 1 says DECISIONS:535 took today-model.cjs out of the seal; that line says it was already unpinned; change to "already outside the seal when the hotfix landed".
N9. Sections 9.5 and 12.5 equate three N5s; keep fence paper corrections, fence byte-equal wording, and C-R5 finally/assertion behavior as separate items, routing the last to P-PACK-5 and its narrow check.
N10. Section 6 step 4 needs an explicit artifact export instruction: proposed() returns an object and --ci does not write it; serialize the recomputed object and a PENDING review envelope before review, then re-propose after any input changes.
N11. Section 5.1 fact 12 says all five CHILD_SPECS updates are BUILT at 397ac466; four contain S9, but measure/test/boundary.test.mjs still ends at S8; mark that fifth edit TO DO and measure its final post.

NAMED DEBTS
D-REFERENCE-CLOSURE: executedClosure is a bounded static literal-specifier walk, not proof of runtime reading or of authority. A reader added for the four design documents must assert their approved content, and a changed-document counterexample must fail. Re-measure the closure after C-UI-1; a computed path alone remains invisible.
D-INTEGRATION-COUNTS: all S9 product, execution, child, root, pack and test totals remain integration outputs. S8's 224/71/25/182 and preparation bars are historical inputs, never S9 needles. New compatibility, workflow-condition and R6-Z2/Z3 rows change the final totals.
D-PLATFORM-EVIDENCE: Windows scratch passes below do not establish Linux or hosted-CI outcomes. Final evidence must retain exact source heads, platform, command, test totals and named real-row refusals; an equal pass/fail total with a different refusal is not equivalent evidence.

Answers to (5) and (7)
Command convention: every "node scratch/X" above means & 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'C:\Users\joeym\AppData\Local\Temp\astra-s9-brief-l1-b1aaecf5\X'. Before tests, separate PowerShell lines set $env:MEASURED_TEST_NOW = '2026-09-03' and $env:TZ = 'America/New_York'. Source reads use git show REV:PATH -- PATH; hashes use node:crypto over raw bytes. Scratch contains the probes and raw results, outside this worktree.

(5) Declaration invariants and the three dispositions:
| Input/role | Admission at runner 397ac466 |
| --- | --- |
| Two released paths | Parent product membership and pre pins verified; post=null admitted only with exact release grant and execution-pin exclusion. No other path is granted. |
| Listed parent product edits, including Today, import, tests, runner and workflow | edited is the correct role; final distinct posts and sourceBase equality remain integration obligations. The omitted tooling cell is B8; boundary's fifth CHILD_SPECS edit is N11. |
| H3/S3/S4/S5/S6/S7 specs; parent S8 spec | Former specs are parent product edits; S8 is execution-only, so superseded-by-child is required. Re-pin after the final runner hunk and remeasure these posts. |
| New helper, setup-tags, six mirrors and new lane cells | new is admitted only when absent at sourceBase or genuinely changed since it; pre=null must mean absent. A post-merge base breaks those declarations as well as B1. Add F2 roots before its argv can be admitted. |
| Four documents; gym-model and checkin-app | All six are outside both parent maps. Real closure from problem, machine-settings-ui, checkin and design targets is 147 files, uncapped: both writers reached, zero of four documents reached. |
| Other carried declarations | Valid only for actual parent product pins whose disk bytes equal pre=post; do not turn all tracked files into parent pins (B7). Final C-UI-1 declarations cannot be known yet. |
| local-import.test.mjs, required by section 9.6 | Neither parent map contains it. Give the unchanged, directly executed file pinned-unchanged with equal measured pre/post; section 2 currently supplies no role for it. |

Command: node scratch/closure.cjs, exact executedClosure() and spec's pinned-unchanged guard, with four synthetic public documents and a declared child.
| Disposition | Measured output | Cost, risk and recommendation |
| --- | --- | --- |
| Baseline computed reader | closure=1, documents=0, capped=false; all four PRODUCT-PINNED-UNCHANGED-IS-NOT-EXECUTED-BY-A-DECLARED-CHILD | Reproduces the reported refusal even though the reader genuinely reads the documents. |
| (a) new, equal pre/post | All four PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE (probe.cjs) | Zero code changes but refused; claiming S9 wrote unchanged documents is also false. Grandfathering an existing sealed artifact does not apply to unsealed S9. |
| (b) Four literal new URL relative reads in a declared target | closure=5, documents=4, no refusal; actual scratch reader read all four and preserved their hashes | One new declared cell/argv target, four literal references, its measured pin/needle and content-change controls. Recommended: no runner change, honest pinned-unchanged role. Merely adding a computed reader to argv is insufficient. |
| (c) Widen the runner for literal fs.readFileSync(path.join(__dirname,'relative')) | Before: closure=1/documents=0/four refusals. Scratch regex hunk plus fourth capture: closure=5/documents=4/no refusal | Runner changes, closure-specific positive/negative rows and independent review, seven ancestor re-pins, new artifact. Regex reachability can admit a dead or commented read; this is not proof of execution. Higher cost than (b). |
The PM rules the choice. The synthetic widening is a measured candidate, not a reviewed implementation or permission to edit the seal path.

(7) Section 9, all ten integration hands:
1. Merges: outstanding at this head; keep the preflight and required order, but preserve a valid sourceBase (B1). Take final accepted passphrase/pack/C-UI heads, including the pending passphrase comment correction, before measuring their pins.
2. Cross-lane cell: still unwritten; runner proposed() emits released as an object and fence reads Object.keys. Name this cell's path, child, role and CI home now; check the actual candidate artifact before final review, then commit its bytes before pinning the artifact. A fixture alone does not discharge this hand.
3. Pack workflow condition and its own row: still outstanding; the fence condition/row exists at 8019abf6. Recommend the ordered !cancelled() condition and a row inside the pack cell; update its final needle rather than retaining 58/42.
4. R6-Z2/Z3: still integration work. Add the ruled one row with both same-length and zero-byte counterexamples; neither mutation is represented by the current 44-row total. Re-measure the new total and cell hash.
5. Fence paper numbers: already corrected at 6f808cfa, not an open code defect. Recomputed 68ed616d..8019abf6 explicit three-path diff: cell 56 lines, total 222 insertions and 9 deletions. Remeasure after item 4; distinguish the three N5s (N9).
6. CI homes: incomplete; two F2 argv targets fail CHILD-ARGV-TARGET (B2). Add both missing roots, only ui-port to PUBLIC_TAIL_ROOTS; declare local-import as above. Workflow mentions local-import zero times at 789baf6e. Measure each explicit step/child after integration.
7. E21/E22 conditions: truly open through DECISIONS:609. Recommend !cancelled() for both and condition-reading rows, so their evidence survives an earlier standing-step failure; cancellation must still stop them. The PM rules it.
8. ci-second-gate: truly unresolved; absent from both S8 maps and zero workflow mentions. Its line 29 compares the entire workflow to one historical substitution. Recommend explicit retirement of that obsolete equality, with the OS-matrix and no-"|| true" invariants re-homed in a CI-executed workflow cell under a PM ruling; a quiet re-pin leaves an unobserved check.
9. Pack literals: correctly pending final C-UI-0/C-UI-1 and both platform baselines. Recompute the whole final tree and runtime APPROVED, including outside-pack references. Record approved ancestry plus the final tree identity; do not require a gate-fixed descendant to equal the old binding tree byte for byte.
10. Seven runner re-pins: built at 397ac466 and all seven equal its measured SHA-256; do again after the final runner change, then measure the ancestor spec posts and commit before --ci (B10).

Section 12's five numbered unresolved items: 12.1 truly open, choose (b) above; 12.2 truly open, recommendation above; 12.3 honestly pending final build/check, no defect inferred from pending; 12.4 requires a PM grant, but coverage.moves is the wrong input (B9). S8 already supersedes all five carriers and the six mirrors preserve that intent: recommend the same five, conditional on final executed evidence. 12.5 is an unresolved label, not interchangeable work: route each N5 separately (N9).

(6) Flow walk: the document has twelve numbered steps, not fourteen; splitting its three actions in step 11 gives fourteen operations.
| Step | Result or smallest correction |
| --- | --- |
| 1 | Name acceptance is preparatory; exact accepted brief bytes must be frozen before the later hash citation. |
| 2 | Four completed line kinds are grammatically possible; grant terminals RULED and acceptance terminals ACCEPTED must remain separate. |
| 3 | B5: two claim objects and two hash strings, then commit the measured spec/runner (B10). |
| 4 | Without that commit: SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT. proposed() is pure; specify export plus PENDING review envelope (N10). |
| 5 | Remeasure all changed inputs, commit them, re-propose the candidate after changes and repeat --ci; otherwise envelope() can refuse SEALED-PROFILE-RECOMPUTATION. |
| 6 | Fable reviews those exact final candidate bytes, including the compatibility cell; not a pre-measurement artifact. |
| 7 | Authorized operator's preliminary full evidence is before package acceptance: retain the expected pending-review obligation/exit, not a claimed authorized seal. Not run here. |
| 8 | The receipt token must name the reviewed candidate commit and artifact SHA-256; no values can be supplied before integration. |
| 9 | Write and commit the accepted review envelope citing that actual chain receipt. |
| 10 | Preserve sourceBase while merging the tip; repeat relevant byte/pin checks if the merge changes product inputs. |
| 11a | Authorized full produces the new receipt only when its obligations pass. Not run here. |
| 11b | Update the unpinned coach constant from that receipt; commit receipt/constant and record the receipt SHA-256 in the verdict. |
| 11c | B10: only then can the second authorized invocation use BYTE-IDENTITY; an uncommitted receipt forces a full run. |
| 12 | Both-platform CI and the authorized fast-forward remain later integration actions, not evidence established by this review. |

(8) Unmoved outputs: git diff --stat BASE HEAD -- rebuild/engine was empty for every lane head 397ac466, 8019abf6, 6f808cfa, d857d775, 0a74d8f2, b9777fe4, ba04c07f and 64a9e095, using BOTH 789baf6e and 05466ebb as BASE. Extra checks against 789baf6e for da9f868, 2a8526b5, dca3f959, 2f37a36e and b1aaecf5 were also empty. Coach constant at 789baf6e, 05466ebb and reviewed HEAD is M2-S8-REAL-SHAPE@3b1b8b91dd5a6ff0. Its sealing-window logic admits a synthetic S9 accepted spec with an S8 parent receipt (N1).
(9) Internal consistency: B5 versus section 10.6; N1's red versus window-green; N3's accepted versus pending; N11's five-built versus four-built; B7's tracked versus parent-pinned. The brief correctly labels 182 carried, 224 product, 71 execution and 25 children as S8 history, not final S9 counts. Its predicted 25-root outcome omits F2 and must change. Pack and new test totals remain integration outputs.
(10) Missing instructions, worst first (eight): valid pre-edit sourceBase selection; explicit source/spec commit checkpoints; receipt commit/verdict binding before recheck; the engine/coach membership distinction; the omitted tooling-cell declaration; F2 root admission; exact artifact export/PENDING-envelope procedure; ownership/path/child/CI role of the cross-lane cell and local-import declaration. The corresponding corrections are above.

Measurement table
Counts below deduplicate repeated claims; compound counts are compared as one tuple per row. Citation counts are distinct inspected source windows, not repeated mentions. No abbreviated hash is treated as a separate digest.
| Scope | Checked | Equal | Different |
| --- | ---: | ---: | ---: |
| Full SHA-256 literals, all 17, reproduced at their current/historical objects below | 17 | 17 | 0 |
| Contextual old-hash/head associations (N4/N5), separately checked | 2 | 0 | 2 |
| Seven ancestor runner pin values at 397ac466 | 7 | 7 | 0 |
| Full S8 parent union versus raw blobs at candidate sourceBase 0cd07be7 | 227 | 227 | 0 |
| Runner citation windows at 397ac466 | 35 | 35 | 0 |
| Other file citation windows, applicable heads | 53 | 50 | 3 |
| DECISIONS coordinates at 05466ebb | 52 | 50 | 2 |
| Owner quotations, raw character comparison (one wording change, one soft wrap) | 3 | 1 | 2 |
Citation misses are N2 (design:35-46), N6 (A:594-605 and DECISIONS:552), N7 (S8 report:117) and N8 (DECISIONS:535); quote miss is B6. B-R6:320-329 and :483-496 resolve at paper head 6f808cfa, not code head 8019abf6. All other inspected citations support their local code/text claim; that does not make the brief's larger inference true.

All 17 digest inputs, with unique prefix identifying the full literal printed in the brief:
| Input and measured head | Expected prefix = measured prefix |
| --- | --- |
| S8 artifact, 789baf6e | 3cf58e0edd76 |
| S8 receipt, 789baf6e | 3b1b8b91dd5a |
| S8 preview.css post | 7cf97598c2c2 |
| S8 build.mjs post | d04a10ef4067 |
| S8 runner post | e31dd206c0fb |
| S8 workflow post | 8403d10b1a54 |
| setup-tags.cjs, b9777fe4 | d0436809e9e5 |
| runner, 397ac466 | 71c1b2592b5a |
| Historical workflow, 797b05c | 878baa7617f6; current b9777fe4 instead 5e4353267924 (N5) |
| F2 projector test, b9777fe4 | f74bbe5f4062 |
| F2 guard test, b9777fe4 | 78d1d73c02b1 |
| Historical F2 guard test, b954d17 | b84b0b4056fb |
| Fence, 8019abf6 | 673a02f9334a |
| Historical fence, 2f37a36e | 43bcda207174 |
| Pack cell, d857d775 | 82efbae2e677 |
| Approved cell, d857d775 | cdf4a6b4ee97 |
| Historical runner, 4ccfdfcd | 316f86c541f1; input head 2a8526b5 instead 71c1b2592b5a (N4) |
The four S8 post literals were also recomputed over raw blobs at the accepted S8 candidate 0cd07be7cf967dfbfea8c84947ba8477f58cfb5f; all equal. The two full differing values are printed in N4/N5. Commands: measure.cjs, inventory.cjs, final-probes.cjs and check-report.cjs; raw-blob hashes, never checkout-translated text.

Numeric measurements (18 checked tuples: 16 equal, 2 different; the untested historical tuples are enumerated below):
| Claim/head | Expected | Measured |
| --- | --- | --- |
| S8 artifact 789baf6e: bytes/product/execution/children | 89873/224/71/25 | equal |
| S8 roles edited/new/carried/superseded | 24/17/182/1 | equal |
| Engine tracked and claimed carried | 45/45 | 45 tracked, 18 parent product; 27 cannot be carried (B7) |
| Runner IDS/NO_REGISTER/CHILD_ROOTS/PUBLIC_TAIL/roles/min-own | 13/9/24/6/6/1 | equal; prior S8 roots=20 |
| CHILD_SPECS cells with S9, 397ac466 | 5 | 4 (N11) |
| Seven ancestor re-pins | 7 | 7 equal to runner hash |
| Build inputs total/Today subset, 789baf6e | 48/26 | 48/26 |
| Six unparented pinned-unchanged candidates; reached documents | 6; 0 of 4 | 6; 0 of 4 in the four-target closure |
| R5 check file LF lines at 0a74d8f2 | 515 | 515 |
| Copy arrays APPROVED/RUNTIME+CHECKIN/PREVIEW_RUNTIME/PREVIEW; total/asserted/distinct | 60/39/116/3;218/215/200 | equal (runtime split=21+18); assertion sites inspected |
| Copy entries absent/distinct absent; present in old 53-file subset | 47/39;139 | 47/39;139 across all 227 unique S8 pinned paths |
| R4 baseline at ecbef86a: files/png/json/ENV | 844/424/419/1 | equal; whole pack 904, non-quality/non-README 53 |
| R4 state records/ids/distinct texts | 418/209/200 | 418/209/200 |
| Fence diffstat 68ed616d..8019abf6: cell lines/insertions | 56/222 | 56/222; 3 files, 9 deletions |
| Workflow occurrences local-import/ci-second-gate at 789baf6e | 0/0 | 0/0 |
| Fence touched sealed paths, 789baf6e...8019abf6 | 9 | 9 by explicit parent-union path diff; not a replay of real-row refusal |
| Brief non-ASCII alphabet; U+2013/U+2014 | only U+00B7;0/0 | equal; brief has 989 LF lines and 81865 bytes |
| C-UI offsetParent sites, 64a9e095 | 19 | 19 source locations across common.py/gate.py/statesheet.py; 20 occurrences because gate.py:239 checks two elements |
The R4 counts are historical: the named current design head 64a9e095 has 1271 baseline files (848 png, 419 json, 4 ENV), not 844. The brief expressly orders final remeasurement; this is not an S9 count defect.

Test-count tuples (11 checked: 11 equal on Windows scratch; none establishes Linux):
| Exact source head/input | Expected tests/pass/fail | Executed output |
| --- | --- | --- |
| 397ac466, ten tooling suites, sequential | 150/150/0 | 150/150/0; per-suite tests 11,9,16,14,9,17,7,41,17,9 |
| b9777fe4, both F2 cells | 81/81/0 | 81/81/0 |
| d857d775, pack-pin | 58/57/1 | 58/57/1, real row PACK-ROOT-ABSENT |
| d857d775, approved-pin | 42/41/1 | 42/41/1, real row UNLISTED, both 09-08 HTML paths |
| 8019abf6, fence | 44/43/1 | 44/43/1, BUT real row FENCE-CHAIN-REF-ABSENT in scratch; claimed nine-path refusal not verified by this run |
| 397ac466, six s9 mirrors, each separately | each 1/0/1 | all six 1/0/1, ENOENT packages/S9.json at module load |
All these rows have zero skips. Test commands used --test on each exact scratch source, one invocation at a time; the six mirrors used the same flag and each child was waited for. Missing-dependency failures during initial harness assembly were corrected with exact public source blobs before the reported reruns; no test row was weakened.

Token execution: probe.cjs fed the exact release clause into releaseRuling, and completed it with the required terminal on a synthetic chain line: admitted, two granted paths. Each of five carrier tokens and their combined comma list was admitted by supersessionRuling. Literal <carrier> placeholders were refused, as expected for an unfilled template. Completed theme and brief claim objects were admitted by claim() and the exact acceptance predicates. Bare-hash replacements refused (B5). A clause alone without terminal refused, as section 10 correctly predicts. U+00B7 was constructed as \u00b7; no PM line was issued or written.

What I did not verify
No actual S9 spec/artifact/token/receipt exists in this review, so no integrated --ci, --full, sealing, private census, final needles, final sourceBase, pack literals, or final C-UI declarations were verified. No hosted CI, Linux, browser/phone trial, auth file, protected data, node_modules or generator was accessed. A and C's pending independent checks remain pending.
Seven historical test/measurement bundles were attributed to their cited reports/DECISIONS but NOT replayed: A's old 145 and 47 executed/47 killed/0 live/4 N/A mutation table; C's older 41/40/1 and 26/25/1 bars; C's cross-drive 50-of-58 failure; F2 plan-edit 90/90; F2's five looks/960 executions/eleven unrowed behavioral terms; passphrase's 96/2048/4194304 sweeps and 139-versus-143 plus 142-to-143/20-to-21 bundle counts; C-UI's 57-row audit and 42-versus-46 documentation mismatch. The eleven F2 term locations were read; that is not mutation evidence.
Also not verified: the brief's whole-rebuild zero-specifier search (I measured the relevant four-target closure instead); exact mechanical equivalence of all six S8-to-S9 mirror bodies; the fence's real nine-path refusal under its original Git ref; pack unreadable-parent/cross-drive mutants; historical both-platform runs and their step numbers; browser-check results; final integration and review outcomes. No all-claims replay is implied by the checked counts above.
Scratch retained: C:\Users\joeym\AppData\Local\Temp\astra-s9-brief-l1-b1aaecf5 and the test suites' own disposable temp fixtures. No scratch cleanup was attempted. Only this report was added to the worktree; no tracked file was edited.

Last shell commands and outputs (both exit 0; the diff produced no output):
```text
git status --porcelain
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
?? rebuild/lanes/astra/reviews/S9-UI-PINS-BRIEF-REVIEW-L1.md

git diff --stat -- rebuild/lanes/b/S9-UI-PINS-BRIEF.md rebuild/lanes/astra/reviews/S9-UI-PINS-BRIEF-REVIEW-L1.md
```
