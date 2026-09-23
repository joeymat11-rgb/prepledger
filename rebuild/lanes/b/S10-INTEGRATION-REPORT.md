# S10 integration report, round 2 (builder claude-opus-5-5, 2026-09-23)
Worktree %TEMP%\earned-s10int, branch rebuild/b-s10-integration; round 1 pushed by the PM at 7f8b228; round 2 is local commits only, nothing pushed.
Parent: S9 CANDIDATE 6dc2596 (NOT sealed; every S10-WORKING-BRIEF.md c58b892 s.2.1 value is still a STOP). Rulings: DECISIONS:792 at 25c9276.
Local runs: Windows, Node v24.19.0 (CI uses 22), runtime lock, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, preload guard that throws before any require/import/read of the protected five; guard log empty in every run.

## Round 1 (unchanged, 7f8b228)
92b7487 SPLIT b35a48e3 | 9943679 GSS 66d32530 | aae3b27 EPP 0d38b8e + D-EPP-2 5a953d5 (all 0 conflicts) | 5ad69a7/656b793 fence LOOK_EDITS row red (0/1, names the 3 keys) then green 1/1 | 8e0f507 CHILD_SPECS += S10 | 7bb11d7 D-CR-2 re-pins | e57bc80 Today line + E steps | 1cc556c S10.json draft | 7f8b228 report.
Evidence kept: engine diff = exactly today.cjs:97, writers.cjs:227, engine-capture.cjs:69; engine-capture-proposed 8/13 with the 6dc2596 capture file, 13/13 at head; gym 65/65; annex identity 7/7, g6-g8+log-timing+remount 15/15; full fence 403/404 (residue row, item 6).

## Round 2 commits
| sha | item | content and evidence |
|---|---|---|
| 88cb9ab | 1 red | F6/F7 of pinned-unchanged-and-ruled-substitutions take S10: 17 tests, 15 pass, 2 fail (F6, F7) against the unedited runner |
| d5c4138 | 1 | runner: IDS += S10 (behind S9), NO_REGISTER_IDS += S10, CHILD_ROOTS += rebuild/lanes/c/today-split/ (27); 17/17. Mirrors 085b6bc (H14-H16, F6/F7) and c4224ee (root per CI-homed lane cell, at the END). PUBLIC_TAIL_ROOTS unchanged. Runner 5321181a -> 9fbfdd2d |
| 853223d | 1 | H3, S3-S9 .json tooling.runnerSha256 5321181a -> 9fbfdd2d, one value each, after the last runner hunk (mirrors f925b6f) |
| 26d39a2 | 3 | local-source-profile.cjs:16 SOURCE_PINS today.cjs 685f6e1e -> b4ebee3c (declared edited, pre 2de07820 post 1a93f571) |
| 2d024a2 | 3 | s3-portable-sources.json re-pins local-source-profile.cjs 2de07820 -> 1a93f571 (the only other pin of that file, measured) |
| 9d39f37 | 4 | gss-annex-timing: bare `fake-indexeddb` import -> createRequire from rebuild/m3/w6/package.json (browser-check.mjs pattern); import lines only. RED before: file fails at load, 0/1. GREEN after: 3/3 |
| fdc7bce | 5 red | sealed-inventory-fence rows (32) proposed-pick, (33) engine-capture-proposed, (34) writer fence: `P-S9-3|P-FENCE-1` 6 tests, 3 pass, 3 fail (32-34) |
| f24fec1 | 5 | E steps get `if: ${{ !cancelled() }}`; writer fence gets its CI home (new step, same condition). Rows green: `P-S9-3|P-FENCE-1|D-S9G|D-CONDITION` 11/11 |
| 2262a40 | 1 | standing step flips to `--ci --package S10`, step NAME moves, one comment paragraph (ef21153 / 6dc2596 shape) |
| 2fb6c70 | 2 | six cells s10-supersede-{source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate}.test.cjs + s10-engine-files-differential.cjs |
| 5255186 | 1,2,7,8 | S10.json regenerated (sha256 3520c6eb...): 293 paths (232 carried, 19 edited, 2 released, 39 new, 1 superseded-by-child), 36 children, needles null |

## Item 2: S10's own supersession (not S9's reason)
Cells: a774ca3's mechanical mirror, then the reason rewritten: S10 moves today.cjs and writers.cjs, each asserted as the PARENT's Git bytes at S10's sourceBase (tied to the parent post) plus exactly the one :631 clause and nothing else, declared edited; every other engine file at the parent post; files added under rebuild/engine/ (proposed-pick cell, its report) declared new. The differential's moved half follows s3-engine-files-differential.cjs; its needle still states the compared count and "byte-identical ... rebuild/engine" (supersededGates() in b-package.cjs). Static check of the clause rule (no engine loaded): parent + clause == head, both files, true.
Red-first (local, guarded, nothing protected touched): 5/5 cells and the differential fail at load with ENOENT rebuild/m4/spec/acceptance-s9-ui-pins.json, the expected pre-seal red (S9's cells were red the same way before S9.json existed). Their real rows load the engine and run gate programmes: CI-only.
S10.json coverage.superseded: the five parent carriers (nine gates), evidence s10-sup-*, s10-engine-files-differential, a0-journeys, today-17; rulingLineSha256 null. PROPOSED token lines (drafts only; the PM appends after review; `<S10_PACKAGE_ID>` is a STOP):
`- 2026-09-DD · cowork (PM) · GATE-SUPERSESSION <S10_PACKAGE_ID> source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate · the token clause for DECISIONS:153, same conditions (i)-(iii), for the child of M2-S9-UI-PINS (grandchild of M2-S8-REAL-SHAPE and the seventh-generation descendant of M2-S3-COMPANION); the child moves rebuild/engine bytes, today.cjs and writers.cjs by one owner-worded clause each (DECISIONS:631 O-1a), both already outside the reconstruction at the parent, and retires the parent's retired gates again under this line and its own evidence - the five carriers cover the nine gates merge-source, migrate-source, writers-source, migrate-differential, witnesses-2, witnesses-5, witnesses-7, writers-differential and second-gate · RULED`
`- 2026-09-DD · cowork (PM) · RELEASE-FROM-SEAL <S10_PACKAGE_ID> rebuild/m3/w7-preview/today/today-app.cjs,rebuild/m3/w7-preview/today/gym-app.mjs · the release grant of the accepted S10 brief (S10-WORKING-BRIEF.md section 4.3) for the child of M2-S9-UI-PINS: exactly these two paths leave the seal, each at its parent pin, and no other path · RULED`

## Item 3: local-source-profile.cjs:16
Where the pin bites: qualify() compares mapping.source_pins to SOURCE_PINS (both from this module), so at runtime nothing reads disk; the disk check is engine-provider.test.cjs:136-154 (S3-PROVIDER-ENGINE-PINS): :143 SOURCE_PINS[f] == sha(disk), :144 manifest == sha(disk), for merge.cjs, today.cjs, engine-runtime.cjs. That cell reads merge.cjs (protected): CI-only.
Red-first by scratch probe of its today.cjs clause only (%TEMP%\opus55-s10build\probe-lsp.cjs, not committed): before 26d39a2 FAIL (pin 685f6e1e, disk b4ebee3c, manifest b4ebee3c); after PASS. Note: production-mapping.cjs:228 embeds Profile.SOURCE_PINS, so the production mapping's source_pins (and its context digest) move with this pin; MAPPING_ID is ENGINE_REVISION-based and unchanged here.

## Item 6: fence residue row (NOT changed; for review, then a PM ruling under :626 (4))
Row `RECORDED RESIDUE gym-app.mjs: released helper parameter mutation still passes` (fence :1442-1444 at 66d32530) plants after anchor `      () => ({ rows: paintedDraft.rows, cues: paintedDraft.cues }), async (outcome) => {`. That line existed at 04ea69e (gym-app.mjs:258; the GSS build had re-anchored the row there from b35a48e3's `recordSettings(map, view, submittedDraft)`). 46af1b8 "Preserve newer gym settings edits across save" (after 04ea69e, ancestor of 79d981a7 and 66d32530) rewrote it to add `revision: settingsDraftRevision`; at 66d32530 the snapshot is `return { rows: paintedDraft.rows, cues: paintedDraft.cues, revision: settingsDraftRevision };` (gym-app.mjs:309). The anchor matches nowhere, planted() asserts the plant landed, so the row fails before releasedRefusals runs: a stale anchor, not a fence verdict. The recorded residue (a mutation of paintedDraft passes the fence) is untested at the integrated bytes.

## Item 7 and item 8
7: the seven parent-unpinned files stay role new, pre null (as ruled). Measured: none is an S9 execution pin.
8: YES. b-package.cjs proposed() (b-package.cjs:3405 at d5c4138, :3389 at 6dc2596) pins RUNNER, packages/<ID>.json, the brief and every child argv target as executionPins; S10 edits S9.json (runnerSha256), so S9.json is declared superseded-by-child, pre a1f9fa38 (its bytes at 6dc2596, re-measure at the S9 seal), post 5369b99b. It is the only S9 execution pin S10 changes that is not an S9 product pin.

## STOPs remaining
1. Every s.2.1 placeholder, incl. S10_PACKAGE_ID, THEME, BRIEF-BY-SHA, the two token lines above, S9_PARENT_COMMIT/sourceBase and the S9 artifact sha; all child needles.
2. Fence residue row (item 6) until ruled; the fence CI step is red on that row by construction until then.
3. D-EPP-4 unpaid; D-EPP-3 gates owed (port oracle, sensitivity, private gate, exact-head CI).
4. Copy lock; D3, D5 (eslint-scope), D6, D7, D9, S-R33, six scope rows, Track A re-cut/DOM cells, M/R/N classification: not done.
5. machine-settings-ui three-way red-first on both OS; engine-capture.test/configuration-capture.test need PERFORMED_W6_DIR; coach ENGINE_REVISION moves only after a receipt.
## CI-only (not run locally)
Today step (except gym and the five annexes), measure suites, proposed-pick, engine-provider (incl. S3-PROVIDER-ENGINE-PINS) and the m4-import step, `b-package --ci --package S10`, the other tooling suites (they spawn the runner), sealed-inventory-fence's real and fixture rows, the s10-sup cells' real rows, the split instruments.
## Open questions
- Re-anchor for the residue row, if ruled: `    const paintedDraft = settingsDraft;` (gym-app.mjs:278) is one candidate; not applied.
- Should rebuild/lanes/c/today-split/ join PUBLIC_TAIL_ROOTS? Not argued here, so withheld.
