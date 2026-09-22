# CLAUDE REVIEW: GYM-SETTINGS-WRITER-SEAL, round 2 (D-GSS-ANNEX-SILENT closure)
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1; named D-GSS-ANNEX-SILENT at 50e2886, no byte here.
Asked at DECISIONS:755, class (a)(b). Run on Joe's word "review". No runtime slot granted: STATIC, no cell run.
Head 79d981a7cf96d65a7a125c680c7a9df05aca7fc1, base 04ea69e60dea5875a5a82b562af24b2f2f71c7be.
Spec eca353a:rebuild/lanes/c/GSS-ANNEX-CLOSURE-BRIEF.md (56 lines) sha256 re-measured
feaaad6fe039462b67041cd15c92276096294d8db331acd3a29e28eb18983749, equal to :755 (same bytes at f93f214).
Owner's PC, PC clock 2026-09-22 14:08 to 14:13 ET. Scratch %TEMP%\claude-r3 only.
Author report (52 lines), Astra cf94e16 (58 lines) and packet f93f214 (47 lines) read whole AFTER my own reading.
## VERDICT
ACCEPT WITH ONE NAMED DEBT. The eight journeys the brief orders are each covered by a real-store row with a
plant, and I found no durable-write defect in either product file. The G6 repair is narrower than the defect it
answers: it hands a delayed Log result on only when a settings editor was open. The same slot-advance can be
caused by repaints that do not need an editor, and no row tries one. I cannot show it without a run, so it is a
debt that a row decides, not a blocker.
## EVERY PRODUCT HUNK (2 of 10 paths; +1858 -13 overall; the other 8 are 5 proof files and 3 reports)
gym-app.mjs: SETTINGS_DRAFT_CARRY, a module WeakMap keyed by the caller's gym draft, holds a detached copy of the
  open editor's rows/cues/revision/error, never the token; restored only for the same startId and lift through a
  fresh settingsEditOpened(), else cleared. settingsDraftStart joins the lift in the context check. A revision
  counter (renderEditor onChanged and a guarded editor input listener) is snapshotted at Save; a saved outcome with
  a later revision keeps the newer draft under a fresh token instead of closing it. Cancel now also needs owns.
  The read branch keeps the carry across a same-workout, same-lift Saved screen and clears it on any other exit.
gym-settings-lane.mjs: copySettingsRaw carries revision; machineFromDraft (:28-:34, unchanged) still takes only
  rows and cues, so revision never reaches the stored settings. The saved callback no longer falls back to the
  submitting binding; it needs a live, registered, connected, same-context control. deliver() gains the same
  connected/registered checks and continuedLogBinding, the G6 handoff (:207-:219).
Read by static check: the raw copy is taken synchronously at the click, before any await (:255-:259), so edits
during a held Save cannot change the submitted payload. Lane sha256 c162a0ba... and G6-G8 proof e2bd176f...
re-measured, equal to both reports.
## FINDING (the input nobody tried), unmeasured
continuedLogBinding returns null unless capturedEditor and activeEditor are the same live token (:211). Any other
repaint during the hold (the Why, Setup or clean-rep help toggles call paint() with no busy check; a settings
read that resolves calls repaint()) reads the advanced slot, installView revokes the old Log binding, and with no
editor open the real ok result is delivered to no one. By static reading: no Saved/Undo screen, no onChanged,
held.entry and effort not cleared, so the next card shows the old values and one more Log tap records them as
the next set. That is the exact G6 red (GSS-G6-SAVED-SCREEN) with a different repaint source. G6's proof opens
the editor first in both seams (g6-g8.test.mjs runG6); G8's pending read ends in Back, not in a held Log ack.
## NAMED DEBT
D-GSS-NEUTRAL-REPAINT  One row beside runG6: after-commit hold, editor never opened, tap the Why toggle (and a
  second variant: let a held settings read resolve) before release. Expect Saved/Undo, one onChanged, cleared
  entry/effort, exactly one set after reopen. If it is red: the smallest shape is to drop the two editor clauses
  from continuedLogBinding and keep every mount/workout/lift/slot/connected check, red first. PAYS: the same Sol
  author, before the S10 reseal (GSS is sealed there, not at S9). If it goes green unchanged, the debt closes on
  that row alone; if it needs a product change, that change is data path and comes back to Claude.
## NOTES (not blockers)
N1 logOutcome (unchanged) clears the whole held entry on success, so an entry typed between submission and ack is
   dropped on the ordinary path too. Transient UI, nothing durable; the brief's "clear only the performed entry"
   is argued through G5, not asserted for that input. Worth a sentence in the S10 brief.
N2 A revised Save reopens with the old token's message (gym-app :319-:323); if that message was an earlier
   refusal, the card can say "Nothing was recorded" beside a save that was recorded. Copy only; unmeasured.
N3 Exact-head CI run 35685091003 is not green per the packet; not my measurement. Both-OS CI and reseal owed.
## WHAT D-GSS-ANNEX-SILENT NOW HAS (from the rows' text and the two independent logs, not re-run by me)
G1/G2 caec517 (23/23), G3 320d192 (19/19, 2 kills), G4/G5 588c840, G6/G7/G8 79d981a (6/6, removal kills G6).
The debt closes on this head, on the condition that D-GSS-NEUTRAL-REPAINT is paid by S10.
## NOT DONE
No cell, suite, CI or seal tooling run: the ask gave no runtime slot. The five proof files were read where they
bear on a finding (all of runG6 and its helpers), not line by line; the independent reviews cover their runs.
No protected path, private fixture, ledger directory, old-app source, quarantined scratch or real measurement
was opened or reached.
