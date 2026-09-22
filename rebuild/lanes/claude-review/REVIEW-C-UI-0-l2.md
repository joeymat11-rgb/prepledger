# CLAUDE REVIEW: C-UI-0, round 2 (the D-CUI-UNIT fix)
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1; author of round 1 (0ca3c8f4), not of this fix.
Asked at DECISIONS:723, class (b), D-CUI-UNIT only. Run on Joe's word "review". STATIC ONLY as ordered.
Head 80fad72b62577900ce07a2910a9b6a1db47d7cca, base cf14982050a8169c7f4848ec0bf1f69c2bb5759f, red f1f283b.
Spec sha256 re-measured 81e24c3cc5d2a11e9e54e15059f48157a0a2520c5e42399807d796845457f54a (equal to :723); not read whole.
PC clock 2026-09-21 22:42 to 22:45 ET. Scratch %TEMP%\claude-r2; nothing under claude-epp read or run (:658).
Author report (57 lines) and Astra ac1b092 read AFTER my own reading of every hunk.
## VERDICT
ACCEPT. The debt is paid as named: the unit clause is a closed list, the five words that slipped through are red
rows, and app/ is untouched. No new debt.
## EVERY PRODUCT HUNK (rebuild/m1/approved-2026-09-18/quality), all read
common.py +4 -2: the numeric test's suffix becomes  (?:\s*(?:lb\.?|kg|g|kcal|%|s))?  ; the comment says so.
teeth.py +51: numeric_suffix helper; z14 sets, z15 reps, z16 today, z17 lbs, z18 kgs must each FAIL the copy check;
  z19 keeps bare values and the seven approved forms green in one status line.
STANDARD.md +1: section 6 names the list. Package +22 -8 (pins and dispositions, read); C-UI-UNIT-REPORT.md +57.
No workflow, runner, app or baseline byte. Nothing removed, no row weakened.
## WHAT I CHECKED MYSELF (reading, plus one read-only count)
1. THE REGEX. Case-sensitive, anchored, one suffix at most, optional whitespace before it. "-5 sets", "-5 reps",
   "-5 today", "-5 lbs", "-5 kgs", "-5 LB" and "-5 lb kg" all fail the numeric test, so the pair is not a cell and
   the flat range fails as before. "-5", "-5 lb", "-5 lb.", "-5 kg", "-5 g", "-5 kcal", "-5%", "-5 s" pass.
2. IS THE LIST THE PACK'S? My own count of the words that follow a number in the approved app/ text (html and js,
   read-only): lb 41, reps 23, g 10, kcal 8, h 8, sets 6, deg 5, grams 3, plus CSS units. So lb, g and kcal are
   real pack units; kg, % and s are anticipations; "h" (hours) and "deg" are painted and are NOT on the list.
   That falls safe: a signed pair ending in "h" is not a cell and reads as a range, the old known false red. It is
   a note, not a debt, because no state paints a signed hours pair today (the 418 renders are clean).
3. THE ROWS. z14 to z18 are the exact shapes I named in round 1 plus two near-spellings; z19 is the positive that
   keeps the ordered :625 case green. Each plant changes one status line in a scratch copy, never the tree.
## NOTES
N1 If a later screen needs "h", "min" or "deg" beside a signed value, the standard's list changes on the record
   and z19 grows; the gate must not be widened back to any word. Say so in the C-UI-GATES-2 brief.
N2 Runtime proof is the independent reviewer's (13/13 focused, 372 PASS, 418 clean, 1320 hashes) and the hosted
   Linux run's (:724). I re-ran nothing; :723 orders static.
## NOT DONE
No Python, gate or browser run; no visual look at any state. No protected path, private fixture, ledger directory,
old-app source or real measurement was opened or reached by any process of mine.
