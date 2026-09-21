# CLAUDE REVIEW: GYM-SETTINGS-WRITER-SEAL (GSS), round 1, STATIC ONLY as :701 orders
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1; no hand in the paper, the build or its reviews.
Asked at DECISIONS:701, classes (a) and (b). Run on Joe's word "review". Head 04ea69e60dea5875a5a82b562af24b2f2f71c7be,
base b35a48e35a1f3e3c278c377934794a32b632535b (the split's accepted build base). Paper 6fe4d12c sha256 re-measured
8d13d269a9badbf513ea27fdae7563656821ff2610fbf41fe6dc20f0ab88e643 (equal to :701); sections A to H read whole.
PC clock 2026-09-21 19:32 to 19:38 ET. Fresh scratch %TEMP%\claude-r2; nothing under claude-epp read or run (:658).
The 60-line build report and Astra L3 (a802905f, 60 lines) read whole AFTER my own reading of every hunk.
## VERDICT
ACCEPT WITH NAMED DEBTS, on reading alone. Every product hunk is read and I found no input, by the code, that
lets a stale, replayed, nested or outside-gesture tap reach a writer, or lets a late completion take over a newer
editor. Two debts below; neither is a defect in the writer. Runtime proof is Astra's (L3) and the hosted CI's,
not mine, and the exact-head CI is red at S8 step 13 for the reason :627 names.
## EVERY PRODUCT HUNK (DECISIONS:439): 3 files, an 886-line diff, all read line by line
gym-app.mjs (+96 -113): busy flag gone; leaveCard calls hooks.leave; 19 addEventListener sites become
  hooks.listen (base count 19, none with a third argument); Open mints through settingsEditOpened; Cancel
  closes by token; Save becomes bindSettingsSave with a raw reader and a typed-outcome mapper; released
  recordSettings deleted; logSet / finish / undo / forget become bindGymAction with outcome mappers; the six
  paint returns wrapped in hooks.paint exactly at G-R5's sites; model.start at paint unchanged; first.settings
  maps pending/ready/lane/read/stateFor to api, owns kept, key order kept.
gym-settings-lane.mjs (+360 -45): helpers moved in; refusal depth; bindings keyed by control; context string
  per view; readSequence; editor token as a frozen empty object compared by identity; detached deep-frozen
  reads and outcomes; dispatch with the ordered admission; facade / hooks / api frozen.
machine-settings-view.mjs (+4 -27): helpers re-exported from the lane; machineOf no longer imported here.
## WHAT I CHECKED MYSELF (static, on the PC)
1. GSS-CUSTODY. The 22-line helper span removed from the base view (sha256 824e9dba...) occurs byte for byte,
   exactly once, in the head lane. Read-only node script of mine over two git show blobs.
2. THE ADMISSION SEQUENCE against the paper's steps 1 to 5: bindingLive checks depth zero, live mount, binding
   current for its control, isConnected and phone.contains, enabled, click, currentTarget, unconsumed event, same
   context, editor identity and view match, action fits phase; busy returns before the event is consumed and
   before api.pending moves; readRaw runs under depth and is copied; ownership rechecked after it and again
   inside recordSettings before host.save; outcomes are delivered under depth and awaited for cleanup only;
   flags release in finally; a rejected host rejects api.pending and never becomes saved. As specified.
3. THE L2 FOCUS FINDING. A stale success now refreshes only the cache (startSettingsRead repaints only when no
   editor, or the same token, is open) and delivers to no callback (deliver finds no current binding); the
   replacement editor is never repainted under it. Right fix, in the lane, not in the view.
4. DISPATCH SPELLINGS. Fixed-string git grep at the head over the five named files: zero .click( and zero
   dispatchEvent. Every one of the three bound controls in screens.template.html is type="button".
5. THE D2 CENSUS, as :701 asks me to judge. My own count over rebuild/lanes/d2/reviews (343 files): 12 files name
   settings-save, the same 12 name settings.pending: 11 test cells plus LAUNCH-ADOPTION-SETTINGS-PROBES.mjs.
   The two supports carry neither literal. So the population is 12 direct cells, at the paper's own base too
   (L3 says the 14 blobs equal e08bc11c). The paper's 13 is a miscount, not a missing cell: no name exists for
   it in the tree at either head. JUDGED: the count question closes at 12; no cell is owed.
## NAMED DEBTS
D-GSS-ANNEX-SILENT The annex was run, which is what :628 ordered, but its evidence is thin: 6 launch cases pass,
  209 cases fail on missing non-ancestral APIs before their lifecycle assertions run. That is the "silent stop
  proves nothing" the paper warns of, now in numbers. The cells belong to the D2 lane and their missing APIs are
  not GSS's to add; but the settings-save journeys those cells were written to prove have not been proved by
  them. PAYS: before package acceptance, either the D2 lane supplies the APIs on its own ticket, or the PM
  records that the annex's settings coverage is superseded by GSS's 17 groups and 74 mounted comparisons, by
  name. Not a blocker: the 17 groups are the paper's own bar and L3 reports them green.
D-GSS-LISTEN hooks.listen(element, type, listener) drops a fourth argument silently, the same shape as the split's
  D-SPLIT-LISTEN (:662 sent it to TODAY-OUTCOME-TYPE). Base gym-app passed none, so nothing is lost today.
  PAYS: the same ticket, one refusal for both shims.
## NOTES
N1 The 12-versus-13 judgment above is mine to give and the PM's to record; I inferred no all-green rule.
## NOT DONE
No cell, no runtime, no browser, no CI, no seal tooling (static only until the PM coordinates runtime). Test
hunks (+461 UI test, +222 fence) read in the diff for shape, not audited row by row. No protected path, private
fixture, ledger directory, old-app source or real measurement was opened or reached by any process of mine.
