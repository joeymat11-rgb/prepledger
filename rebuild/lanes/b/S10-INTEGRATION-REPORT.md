# S10 integration report (builder claude-opus-5-5, 2026-09-23)
Worktree %TEMP%\earned-s10int, branch rebuild/b-s10-integration, local commits only, nothing pushed.
Parent: S9 CANDIDATE 6dc2596 (NOT sealed; every S10-WORKING-BRIEF.md c58b892 s.2.1 value is a STOP).
Ledger read at 528970d (792 lines): :626 :628 :631-633 :644 :662 :707 :732 :765 :780 :785 :791.

## Commits (in brief order)
| sha | step | content |
|---|---|---|
| 92b7487 | 1 Track A | merge SPLIT b35a48e3 (43 files; auto-merged food/problem/machine-settings-ui tests; 0 conflicts) |
| 9943679 | 2 Track B | merge GSS 66d32530 (14 files; machine-settings-ui auto-merged; 0 conflicts) |
| aae3b27 | 3 EPP | merge 5a953d5 (EPP 0d38b8e + D-EPP-2), 9 files, 0 conflicts |
| 5ad69a7 | 4/5 | fence: red row 'S10 LOOK_EDITS' (dead keys) |
| 656b793 | 4 | fence: drop the three dead LOOK_EDITS keys (fence :1255-:1257 at 66d32530) |
| 8e0f507 | 4 | CHILD_SPECS += 'S10' in boundary, food, machine-settings-ui, problem, setup |
| 7bb11d7 | 4 | successor re-pins D-CR-2 / D-EPP-3 (run.cjs, s3-portable-sources.json) |
| e57bc80 | 4 | rebuild.yml: Today line + five gss-annex; EPP proposed-pick step; D-EPP-2 step (D-CR-1 text) |
| 1cc556c | 4 | packages/S10.json PROPOSED draft (sha256 ad84af160ccaa7aab9cf86fd6f7ffb4a9d236ea9676852f9fa8213b99408dfac) |
This report is committed after 1cc556c.

## Per-step evidence
- D-SPLIT-PARENT (s.3.1) at 6dc2596: today-app ea98aef6, today-model 6a146ff9, gym-app 48bf0531 = sourceBlobs.s9. Candidate only.
- Composed product under today/ equals 66d32530 byte for byte (git diff 66d32530 HEAD touches only 5 tests: food, machine-settings-ui, package, problem, setup = S9 side). Composed today-app.cjs sha256 d1e1f1e7... equals Astra's reconstruction recorded at :633.
- Engine diff 6dc2596..HEAD under rebuild/engine, rebuild/m4, rebuild/coach: exactly today.cjs:97 and writers.cjs:227 (x.state !== "PROPOSED") and engine-capture.cjs:69 (q.state!=='PROPOSED'), plus tests/reports. No other engine byte.
- Fence (s.4.2): fence blob at the composed candidate before my row = 09a6dd18 (= 66d32530), so no today-app exception row and no gym row changed by S10.
- D-GSS-PASSTHROUGH census (static regex, not parser): gym-app.mjs:607 lane: () => api.lane(); 0 product readers; 1 test reader machine-settings-ui.test.mjs:1253.
Local runs: Windows, Node v24.19.0 (CI uses 22), runtime lock, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, preload guard that throws before any require/import/read of the protected five; guard log empty in every run below.
- writer-fence row: RED at 5ad69a7 1 test/0 pass/1 fail, names exactly the 3 facade.lane() keys; GREEN at 656b793 1/1.
- writer-fence full at 656b793: 404 tests, 403 pass, 1 fail (not ok 324 RECORDED RESIDUE gym-app.mjs: released helper parameter mutation, 'in-memory plant did not land'). Baseline, fence bytes 09a6dd18 on the same product: 403/402/1, same row. Inherited from GSS 66d32530 (anchor text absent from gym-app.mjs).
- engine-capture-proposed.test.cjs on the composed engine: with 6dc2596 engine-capture.cjs 13 tests/8 pass/5 fail (CAP-P1 P2 P3 L1 U1); at HEAD 13/13.
- gss-annex-identity-reentrancy 7/7; gss-annex-g6-g8 + log-timing + remount 15/15 together; gym.test.mjs 65/65 (run at 7bb11d7, product equal to HEAD).
- gss-annex-timing.test.mjs: file fails at load, ERR_MODULE_NOT_FOUND 'fake-indexeddb' (bare import at :9; root package.json has no fake-indexeddb, only rebuild/m3/w6/package.json). Predicts the same red in CI: STOP 5.
- Today line (static): today/test holds 18 files; the line named 13 before e57bc80, 18 after, equal sets.

## Pins re-pinned (before -> after, measured sha256)
- run.cjs:24 engine-capture.cjs 309c75d8 -> ae899082 (D-CR-2).
- s3-portable-sources.json: today.cjs 685f6e1e -> b4ebee3c; writers.cjs 0522797d -> 67033f9f; engine-capture.cjs 309c75d8 -> ae899082.
- S10.json product (pre = S9.json post at 6dc2596; 253/253 S9 posts equal the 6dc2596 bytes): today.cjs 685f6e1e -> b4ebee3c and writers.cjs 0522797d -> 67033f9f (D-EPP-3 composed pin, EPP only, no NATIVE-LOAD); machine-settings-ui.test.mjs 8e9cb020 -> e45bce7c (three-way merged bytes + CHILD_SPECS); rebuild.yml bce0594f -> 786443f0; writer-fence new 913eb27c; machine-settings-view new 1b94ddc5 (parent bytes f7e9da0d, pinned by no package); today-app.cjs released pre efaf6c0d post null; gym-app.mjs released pre 4c8ba0c9 post null.
- S10.json: 285 paths (243 carried, 8 edited, 2 released, 32 new; Markdown reports not declared); 29 children, every needle null; S9 s9-* children dropped; epp-proposed-pick and d-epp-2-capture added; today-17 gains the five annex files.

## STOPs remaining (not done, by name)
1. Every s.2.1 placeholder: S9_PARENT_COMMIT, S9 spec/receipt/CI ids, S10_PACKAGE_ID, brief path/sha, RELEASE-FROM-SEAL, GATE-SUPERSESSION, THEME, BRIEF-BY-SHA, CUI0 pins, copy-lock paths and answers, exact-head both-OS run id. All null in S10.json. Re-measure everything at the real parent.
2. Runner registration of S10 (IDS, NO_REGISTER_IDS, CHILD_ROOTS, ancestor runnerSha256 re-pins, s10-supersede cells, s10-engine-files-differential): a runner mutation, not ordered. Package step stays --ci --package S9.
3. coverage.superseded: S9's retirement reason 'changes NO engine byte' cannot carry; S10 moves engine bytes. Needs its own token and cells.
4. rebuild/m4/import/local-source-profile.cjs:16 pins today.cjs at 685f6e1e (S9 bytes) so a mutated engine byte cannot qualify a producer mapping. With EPP it no longer matches; engine-provider.test.cjs:141-144 reads the manifest row. Not re-pinned: a sealed product byte on the import path, outside the named carriers. Needs a PM ruling.
5. gss-annex-timing.test.mjs bare 'fake-indexeddb' import (accepted input bytes). A fix is a test-byte change to 66d32530 and needs its own disposition.
6. Fence RECORDED RESIDUE row red at the 66d32530 bytes. Fence rows change only under a PM ruling (:626 (4)).
7. D-EPP-4 (proposed-pick self-sensitivity guard) unpaid. D-EPP-3 gates owed: port oracle, sensitivity, private gate, exact-head CI.
8. Section 8 copy lock absent. D3, D5 (real eslint-scope stack), D6, D7, D9, the S-R33 boot row, the six inherited scope rows, Track A re-cut and DOM/listener cells, the s.3.2 M/R/N hunk classification and D-GSS-LINES counts: none run or written here.
9. machine-settings-ui.test.mjs three-way merge: red-first re-run on both OS owed (it imports build.mjs/esbuild).
10. engine-capture.test.cjs and configuration-capture.test.cjs: need PERFORMED_W6_DIR (no workflow sets it); Source.baseline base 3e908d2 stale since 0d38b8e.
11. coach ENGINE_REVISION still M2-S8-REAL-SHAPE@3b1b8b91...; moves only after a receipt (s.12.13).

## CI-only (not run locally; they load or read the protected five, spawn the runner, or build with esbuild)
Today step: adapter, catalogue, checkin, copy, design, food, machine-settings-ui, ntc-h6-delta, package, problem, setup, view, measure journey/lane/baseline/boundary; rebuild/engine/test/proposed-pick.test.cjs (requires index.cjs); m4-import step incl. engine-provider.test.cjs; b-package --ci; rebuild/lanes/b/tooling/test/*; sealed-inventory-fence, release-object, pack-pin, approved-pin, reference-closure; today-split-spike instruments and PART2-DOM-LISTENERS; configured-history-candidate/run.cjs (named in no workflow).

## Open questions for the PM
- The seven files that existed at the parent pinned by no package (machine-settings-view, today-model, engine-capture.cjs, engine-capture.test, configuration-capture.test, s3 manifest, run.cjs) are declared role new with pre null, as the runner's rule requires. Accept that, or rule another role?
- Is S9.json an execution pin of the S9 artifact that S10 must declare superseded-by-child? S10 does not edit it.
- Should the two new E steps carry if: !cancelled() with a condition-reading row (:627 P-S9-3)? Without it the standing step skips them on non-tip branches.
- Stop 4 (local-source-profile) and stop 5 (annex import): who owns each, and under which ruling?
