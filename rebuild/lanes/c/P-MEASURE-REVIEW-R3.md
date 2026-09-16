# P-MEASURE v1 - INDEPENDENT REVIEW, ROUND 3

VERDICT: ACCEPT

Reviewed 6024047 (author) as rebased in this worktree onto the current chain tip
57d056c; the rebase replayed cleanly and changed no byte of the ticket's files.
All data synthetic. Nothing personal read, written or reported.

## What the reviewer executed, independently of the author's cells

1. A 12-week hand table recomputed from `measure-fixture.json`'s RAW entries, with
   formulas written from the ticket text and NOTHING imported from
   measure-model.mjs. All 12 rows x 10 columns agree with the committed expected
   table: the rolling means (incl. wk6 196.18 over a short window and wk9 null for
   an empty one), the latest-in-week waist, the 4-week trends, 100/33.3/100 %
   training, the food-vs-energy split (wk3 100 % / 57.1 %: a `cal: null` day is a
   food day and not an energy day), the elapsed-day denominator (wk12 3 of 3, not
   3 of 7), the Epley 1RMs, and the sleep counts 7/7, 0/7, absent, 2/7.

2. A SECOND scenario of the reviewer's own making, not the fixture: day one
   2026-02-02, today 2026-02-18, gapped reads, one missing training week, a
   `cal: null` day, three nights. Driven through the REAL Today route in jsdom
   over fake-indexeddb via mountToday. Rendered: wk1 208.5 lb (mean of 3 reads),
   wk2 205, wk3 absent; 66.7 % / 0 % / 0 % training; 42.9 % food vs 28.6 % energy
   in wk1; 66.7 % of THREE elapsed days in wk3; waist absent throughout with no
   zero invented. Every cell matches this reviewer's arithmetic.

3. The 1/7 sleep count in that scenario was checked against the engine itself:
   cleanAtDate(s, morning-after) is clean only for the 7.5 h night, refuses the
   5 h one on DEBT_LAST_H and refuses the rest on a mean-3 of 6.83. The count is
   the app's own rule, correctly offset by one day, not a caller's boolean.

4. A baseline over the reviewer's own synthetic imported state (no `waist`
   member): weight, training, food, energy and both markers all render; waist and
   its trend read absent, never zero; the window is the 8 complete weeks ending
   2026-03-01 for a day one of 2026-03-02. A malformed set row is refused rather
   than counted. The author's cell (c) additionally asserts all ten columns over a
   local-source-basis-admitted C2b import and that the sleep cell is not "0/7".

5. Sealed-byte drift, proved twice. `git diff --name-only f2fc4f49 HEAD` is 19
   paths; `findstr /g` of that list against S4.json matches exactly one line,
   `rebuild/m3/w7-preview/today/today-app.cjs`. Restoring that file's base bytes
   on disk takes `b-package.cjs --ci --package S4` from FAIL WORKTREE-SOURCE-PIN
   to PUBLIC CI EVIDENCE PASS, reporting "0 unlisted drift" over the 74
   parent-pinned product files and running the today-13 child green. The 18 new
   paths are invisible to S4. machine-settings-ui.test.mjs and problem.test.mjs
   do not appear in the diff at all, so both stand at their S4 post bytes.

6. Dash and line-ending scan of all 19 drifted files: no CRLF anywhere; the only
   U+2013/U+2014 hits are 23 PRE-EXISTING comment lines in today-app.cjs, all
   present byte-identically at f2fc4f49. Of the 49 lines this ticket adds to that
   file, zero carry a dash. No product module under measure/ names a network API
   or a store outside the device store.

## Findings

1. MINOR: the branch as committed no longer sits on the chain tip. origin
   advanced one DECISIONS commit (57d056c, :456) during review, and at 6024047
   S4 now stops earlier with SEAL-BASE-IS-NOT-THE-CHAIN-TIP rather than the
   reported WORKTREE-SOURCE-PIN. Rebasing onto 57d056c reproduces the reported
   result exactly. One more rebase is needed before this is merged; no code
   change is implied.

2. MINOR: four of the six measure suites (journey, lane, baseline, boundary),
   which carry bar items (a), (d), (e) and (g), run in no workflow. The author
   discloses this and the constraint is real: shared-preflight materializes a
   closed public allowlist that cannot open this page's stack, and rebuild.yml is
   pinned. The two hermetic suites were correctly chosen and registered on the P6
   pattern. Until lane B enumerates the other four, the flagship evidence for
   this ticket is reproducible only by hand.

NOTE A: the registration regression's hardcoded "24 current / 7 historical" became
`current.length + optional.length`. That is not a weakened test: the same
`current` array is still asserted against the workflow's own CURRENT list, so the
two cannot drift apart. It removes only a literal that had to be hand-edited.

NOTE B: two W6 suites (local-import, local-source-consumer) failed once under the
full-tree glob while builds were running, then ran green alone, as a pair, and in
two later full-tree runs at this same HEAD. Flake under load, not a regression;
the base shows the identical tree count.

NOTE C: all ten round-2 findings are closed, each by a cell that reads the DOM or
the store rather than grepping source. Round-2 finding 1 (the screen rendered
nothing) is closed most convincingly: the route now renders 12 rows from data the
reviewer entered himself.

## Verbatim tails (this PC, rebased onto 57d056c)

```
[today 13 by name]     tests 645  pass 645  fail 0   duration_ms 16190.6802
[measure 6 suites]     tests  32  pass  32  fail 0   duration_ms 53542.4466
[W6 rebuild/m3/w6/test] tests 586  pass 586  fail 0
[W6 whole tree, **]    tests 633  pass 633  fail 0   duration_ms 24303.3335
[coach]                tests 218  pass 218  fail 0   duration_ms 955.201
[shared-preflight x5]  tests  96  pass  96  fail 0   duration_ms 52126.5031
[A1] A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client);
     3/3 assets free of any network reference; no em/en dash the athlete can see
[A1 dist] "Export as text", "Strength markers", "Trial day one",
     measure-export-text, measure-tile, "No baseline yet", "Not enough data yet",
     measure-waist-save, measure-marker-save and Epley all present
[A5] A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached by sha256
[rig187] rig187 => PASS
[S4, as committed] B PACKAGE S4 FAIL WORKTREE-SOURCE-PIN
[S4, rebased on 57d056c] B PACKAGE S4 FAIL WORKTREE-SOURCE-PIN
[S4, today-app.cjs at base bytes] B PACKAGE S4 PUBLIC CI EVIDENCE PASS;
     PRODUCT IMPLEMENTED ... 0 unlisted drift
```

## Drift list (19 paths)

PINNED by S4 (1): rebuild/m3/w7-preview/today/today-app.cjs
Unlisted by S4 (18): .github/workflows/shared-preflight.yml;
rebuild/lanes/c/P-MEASURE-AUTHOR-REPORT.md;
rebuild/lanes/tooling/test/shared-preflight-ci-registration.test.cjs;
rebuild/m3/w7-preview/measure/{measure-baseline,measure-host,measure-model,
measure-screen,measure-sources,measure-view}.mjs, measure-commands.cjs,
measure-fixture.json, test/{adherence,baseline,boundary,journey,lane,model}
.test.mjs, test/support.mjs
