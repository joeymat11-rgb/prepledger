# P-MEASURE (a) "week 12 as rendered" flake: report

Tree earned-s11int (rebuild/b-s11-integration, HEAD d7b4cc2). Nothing committed. rebuild.yml edit untouched.

## Location
- Cell: rebuild/m3/w7-preview/measure/test/journey.test.mjs:49, assertion :69 ('week N as rendered').
- Harness: measure/test/support.mjs typeWaist :107, settle :205, quiet :233, page() :246 (post-edit).
- Product: today-app.cjs renderMeasure :471, show :623, render :1694 (same-screen repaint keeps
  mountToken, :1717); measure-screen.mjs saveWaist :84, paint :128; measure-host.mjs save;
  today-lanes.cjs measureDeps repaint :327.

## Mechanism (TEST defect)
- The fixture's last two waist rows are typed into the screen; they fall in weeks 11 and 12 (all other
  waist rows are weeks 1-10). Weeks 1-11 passing and week 12 failing = the read table had the first typed
  row but not the second.
- saveWaist does `await lane.save(...)` and only then `repaint()`. A repaint of the same route keeps the
  mount token, so an earlier paint (the marker pick's, or the first waist row's) stays alive and still
  mounts its table while a later save is in flight. Each render shows a NEW section synchronously, so
  once the save is answered the stale paint writes only into a detached section.
- Old typeWaist waited for "table text != text before the click" then quiet() = 3 unchanged
  setTimeout(0) turns. On a slow runner a lane read/decrypt or save takes longer than 3 turns, so quiet()
  ends inside a gap. The next click then captures a "before" from a half-built screen, and the table from
  the PREVIOUS paint (begun before the last save was answered) satisfies both "changed" and "still".
  waitForTrialTable only checks presence. The cell reads week 12 without the last reading.
- Rare: it needs still gaps of 3+ turns at the right moments AND the stale paint to finish before the
  save is answered (131 s cell = heavily loaded runner). The old comment's "repaint in stages" was this
  same stale paint: mountMeasureComparison swaps the whole table in with one replaceChildren.

## Product verdict: not a product defect
The visible section always belongs to the latest render, and the render after an answered save reads
after the write. A paint begun earlier can only fill its own detached section. A user can briefly see the
pre-save table while their save is in flight; that table is true to what was stored then. It is replaced
when the save is answered. No user is left looking at a wrong week-12 row.
Ruled out: DST/TZ (measure date math is Date.UTC on ISO strings, and would be deterministic); shared
.tmp (journey/support build and read nothing there); per-test timeout (a missed settle throws
MEASURE-SETTLE-DEADLINE, not a deepEqual).

## Red-first (scratch only, %TEMP%\s11-p17)
mk.mjs copies the tree's support.mjs + journey.test.mjs into a scratch dir, re-points imports at the
tree, swaps createMeasureHost for delay-host.mjs (each real lane read waits P17_READ_MS, each waist save
P17_SAVE_MS, then calls the real method) and logs saves started/answered when (a) reads the table.
Run: node --test --test-name-pattern "P-MEASURE \(a\)", TZ=America/New_York MEASURED_TEST_NOW=2026-09-03.
Pre-fix (pre/):
- delays 0/0 x2, 5/60 x1, 30/400 x1: ok 1 - P-MEASURE (a), trace started=11 answered=11
- delays 15/150 x5: 4 x `not ok 1 - P-MEASURE (a)`, assertion `week 12 as rendered`, trace
  started=11 answered=10 (the table was read before the last save was answered); 1 x ok (answered=11)
Red iff answered=10. No pure CPU-load stress: one cell takes 50-70 s locally.

## Fix (test-only, applied uncommitted: measure/test/support.mjs, +38/-26 incl. comments, LF, ASCII)
```
 page():
-  const lane = measure || await createMeasureHost({ day: today,
+  const host = measure || await createMeasureHost({ day: today,
     indexedDB: fault.indexedDB, crypto: webcrypto });
+  const saves = [];
+  const lane = Object.freeze({ ...host, save(entry) {
+    const record = { answered: false };
+    saves.push(record);
+    const pending = host.save(entry);
+    pending.then(() => { record.answered = true; }, () => { record.answered = true; });
+    return pending;
+  } });
-  return { dom, doc, api, model, setup, lane, pick, all, phone,
+  return { dom, doc, api, model, setup, lane, saves, pick, all, phone,
 typeWaist(), after the two boxes are filled:
-  const before = renderedTableText(view);
-  view.pick('measure-waist-save').click();
-  await settle(() => renderedTableText(view) !== before, ...);
-  await quiet(() => renderedTableText(view), ...);
+  const saved = view.saves.length;
+  view.pick('measure-waist-save').click();
+  await settle(() => view.saves.length > saved && view.saves[saved].answered,
+    'the measure lane to answer the waist save for ' + row.date);
+  await settle(() => view.pick('measure-trial-table'),
+    'the trial table to repaint after the waist save for ' + row.date + ' was answered');
```
Why sound: the record's .then is registered before the screen's await on the same promise, so on the
first macrotask turn where answered is true, saveWaist's continuation has already run render(), which
shows a fresh table-less section; any later table comes from reads begun after the save was answered.
No assertion, check, tolerance or deadline changed. Note: support.mjs is "carried" at f72c6176 in
S11.json/acceptance-s11, so it needs the S11-REGEN --write step that copy.test.mjs got (48f1f20).

## After fix
- Scratch post/ (fixed support.mjs + same delays): 15/150 x5, 30/400 x1, 5/60 x1, 0/0 x1: all
  `ok 1 - P-MEASURE (a)`, trace answered=11. Full journey file at 15/150: ok (a), ok (d), ok (e); pass 3.
- Tree, normal run of journey + baseline + boundary + lane (all importers of support.mjs + lane):
  tests 22, pass 21, fail 1. The fail is boundary `not ok 8 - P-MEASURE (g) - no S4-sealed file
  drifts...`, and its message names only '.github/workflows/rebuild.yml' (the pre-existing reviewed
  edit), not support.mjs. ok 12 (a), ok 13 (d), ok 14 (e).
