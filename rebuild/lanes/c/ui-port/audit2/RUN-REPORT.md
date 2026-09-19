# C-UI-0 teeth audit 2: the RUN REPORT (the execution half)

This file is raw output and bookkeeping, not a verdict. Under DECISIONS:593 the owner ruled that
the second independent teeth audit of the design lane's visual quality gates runs AT ONCE as the
re-check of review R4's two fixes, with rows of its own for B1 and B2, and that the PM's Fable
final runs beside it rather than after it. Astra's sandbox is refused the gates' Python
interpreter (measured at :574), so the division is: a Claude hand EXECUTES every row mechanically
and publishes every raw output; ASTRA JUDGES what is published and writes the audit's verdict;
the PM judges Astra. Nothing below is a judgement. Where a row did not come back as the row
expected, it is marked MISMATCH and described in one factual sentence, and the judgement of it is
left to the judge.

## 0. The head under audit, and one thing that moved under it

| what | value |
|---|---|
| head under audit | `rebuild/c-ui-0-gates` at `64a9e0954232ad10f66029c3031b8048c1f82802` |
| the two R4 fix commits | `894bb406` the code, `64a9e095` the package with every digest recomputed |
| the pack | `rebuild/m1/approved-2026-09-18/`, 1319 files under `app/` and `quality/` |
| this audit's branch | `rebuild/r-cui0-audit2`, cut from `64a9e095` |
| the scratch pack every row ran against | `%TEMP%\cui-audit2\pack2\rebuild\m1\approved-2026-09-18`, made by `git archive 64a9e095`, outside every git work tree |

EVERY ROW BELOW RAN AGAINST `64a9e095`. `PACK-SHA.txt` read `64a9e095...` before the first row,
the manifest was written from that copy and was clean at 1319 files before the first row and again
after the last, and every row proved its own byte identical revert.

ONE DEVIATION THAT WAS NOT MINE, AND THE PM SHOULD SEE IT. DECISIONS:593 says "there is NO R5
ROUND by the lane's reviewer" and that the lane is told to hold its branch still at `64a9e095`.
It did not. While this audit was running the lane pushed three more commits:

    50fea4ab  C-UI-0: review R5 (ACCEPT WITH NOTES, 0 blocking)
    4bfa1606  C-UI-0 R5 notes: a negative number is opened by a space or a bracket, and every
              whitespace folds
    814f0a03  C-UI-0 R5 notes: the package, final, with the R5 entry and every current digest
              recomputed

`selftest.cmd` reads the BRANCH (`origin/rebuild/c-ui-0-gates`), so when it was re-run after the
accept rows it re-made the scratch copy at `814f0a03` and `PACK-SHA.txt` changed under the audit.
That was caught immediately, the scratch copy was re-made PINNED to the sha `64a9e095`
(`logs/phaseA/a9-repin.log`: manifest written and clean at 1319 files, `PACK-SHA.txt` back to
`64a9e095`, 86 of 86 rows DRY-OK, 0 VOID), and no executed row ran against `814f0a03`. The R5
commits touch `quality/common.py`, `quality/teeth.py`, `quality/STANDARD.md`, `README.md`, the
package and the new review file. THIS AUDIT SAYS NOTHING ABOUT THEM: they are outside the head it
was given.

## 1. The environment

The owner's PC, where every mutation row and every Phase A run below was executed:

    python    3.14.6 (tags/v3.14.6:c63aec6, Jun 10 2026, 10:26:10) [MSC v.1944 64 bit (AMD64)]
    platform  Windows-11-10.0.26200-SP0
    chromium  151.0.7922.34, playwright 1.62.0 (quality/baseline/win32/ENV.txt, and the same
              four values in quality/baseline/states/INDEX.json "env")
    launch    --allow-file-access-from-files --font-render-hinting=none
    python at %TEMP%\cui-venv\Scripts\python.exe; Chromium launched on every row, no failure

`playwright.__version__` does not exist on this build, which is why `logs/phaseA/a0-env.log`
carries a traceback for that one attribute and the version above is read from the pack's own
`ENV.txt` instead.

The PM's cloud farm, a Linux machine, where section 6's evidence was executed:

    python    3.11.15
    platform  Linux 6.18.44-fc-v37
    chromium  141.0.7390.37, playwright 1.56.0
    two cores; the pack extracted by git archive 64a9e095 outside every git work tree

That Chromium and that playwright are exactly the ones `quality/baseline/linux/ENV.txt` names as
the machine that set the Linux screen baselines. They are NOT the ones that wrote the state
records: `INDEX.json` says those were written on win32 with Chromium 151.0.7922.34. Section 6
below says what follows from that.

Other lanes were running test suites on this PC throughout. Nothing below looked load related: a
narrowed gate row at the reference size took 28.0 to 29.8 s in every one of the forty odd rows
that used it, and a `--only T-02` sheet row took 3.0 to 3.4 s in every one. No row was re-run for
a timing reason, and no row timed out.

## 2. The one table

86 rows. Expected catcher and expected result come from `rows.py`; the observed catcher line is
the FAIL line naming that catcher, verbatim from the run's own `report.json`, or, where the row
expects a refusal, the refusal line, or, where the run wrote no such line, the run's summary
line. The pipe inside an observed line is written as a slash so the table renders; everything
else is verbatim, with any character outside ASCII written as its code point so this file stays
pure ASCII. The raw logs under `logs/` carry the characters themselves.

MATCH and MISMATCH are re-judged here from the recorded output by the same test `driver.py`
makes, with one correction described in section 5: `gate.py` ends a run with
`Passed everywhere: <every check name that passed>`, so the driver's substring test could report
a catcher as caught when it had in fact PASSED. Row `x20` was judged "as expected" by the driver
for that reason and is a MISMATCH here. `driver.py` is fixed in this commit and the fix is
recorded; the rows themselves were not re-run, because the recorded output is the same either way.

| row | what it mutates | expected catcher and result | observed catcher line, verbatim | exit | verdict | s |
|---|---|---|---|---|---|---|
| `rb2c` | CONTROL: an untouched run of the same narrowed gate (a comment appended to app.css only) | PASS; names '0 FAIL'; exit 0 | `EARNED UI GATE: 0 FAIL, 0 WARN, 60 PASS` | 0 | MATCH | 28.4 |
| `rb1f` | THE CONTROL: the plain spaced hyphen, an ordinary space on each side | FAIL: copy: no dashes, readiness words, vendor names; names "' - '", 'ink-today', 'dawn-today'; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / ' - '` | 1 | MATCH | 28.9 |
| `rb1a` | B1 exactly as R4 built it: the spaced hyphen with U+00A0 on each side | FAIL: copy: no dashes, readiness words, vendor names; names "' - '", 'ink-today', 'dawn-today'; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / ' - '` | 1 | MATCH | 28.7 |
| `rb1b` | the same spaced hyphen with U+202F NARROW NO-BREAK SPACE on each side | FAIL: copy: no dashes, readiness words, vendor names; names "' - '", 'ink-today', 'dawn-today'; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / ' - '` | 1 | MATCH | 28.5 |
| `rb1c` | the same spaced hyphen with U+2007 FIGURE SPACE on each side | FAIL: copy: no dashes, readiness words, vendor names; names "' - '", 'ink-today', 'dawn-today'; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / ' - '` | 1 | MATCH | 28.6 |
| `rb1d` | the same spaced hyphen with U+2009 THIN SPACE on each side | FAIL: copy: no dashes, readiness words, vendor names; names "' - '", 'ink-today', 'dawn-today'; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / ' - '` | 1 | MATCH | 28.5 |
| `rb1e` | the same spaced hyphen with U+3000 IDEOGRAPHIC SPACE on each side | FAIL: copy: no dashes, readiness words, vendor names; names "' - '", 'ink-today', 'dawn-today'; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / ' - '` | 1 | MATCH | 29.1 |
| `q9` | the lane's own B1 row: a spaced hyphen whose two spaces are no break spaces | FAIL: copy: no dashes, readiness words, vendor names; names "' - '"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / ' - '` | 1 | MATCH | 29.0 |
| `rb2a` | B2 exactly as R4 built it: a visible focusable 274x20 box with an INERT clip, no positioning | FAIL: touch targets >= 44 px; names '274x20.00', 'ink-today', 'dawn-today'; exit 1 | `touch targets >= 44 px / dawn-today 393x852 / title 274x20.00` | 1 | MATCH | 29.1 |
| `q10` | the lane's own B2 row: a visible 20 px target carrying a clip its positioning makes inert | FAIL: touch targets >= 44 px; names '274x20.00'; exit 1 | `touch targets >= 44 px / dawn-today 393x852 / title 274x20.00` | 1 | MATCH | 29.1 |
| `rb2b` | CONTROL the fix must not break: the same box with clip AND position:absolute (truly clipped) | PROBE; exit any | `visual regression vs baseline / dawn-today 393x852 / 9.708% of pixels changed, mean shift 6.280 rows 308 to 619` | 1 | MATCH | 29.0 |
| `rb2d` | SIBLING PROBE: a focusable 20 px box hidden only by a zero opacity PARENT | FAIL: touch targets >= 44 px; names '274x20.00'; exit 1 | `touch targets >= 44 px / dawn-today 393x852 / title 274x20.00` | 1 | MATCH | 29.0 |
| `rb2e` | SIBLING PROBE: the same box with visibility:hidden inherited from its parent | FAIL: touch targets >= 44 px; names '274x20.00'; exit 1 | `touch targets >= 44 px / dawn-today 393x852 / title 274x20.00` | 1 | MATCH | 29.0 |
| `q11` | a numeric range written with a minus sign (R4 SHOULD FIX 1) | FAIL: copy: no dashes, readiness words, vendor names; names "'\u2212'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / '\u2212'` | 1 | MATCH | 28.4 |
| `h1` | T-02's status line shifted 3 px: INSIDE the tolerance, must PASS | PASS; names '0 with problems'; exit 0 | `STATE SHEET: 2 renders, 0 with problems` | 0 | MATCH | 3.4 |
| `x1` | T-02 status line shifted 4 px: JUST OUTSIDE the 3 px rect tolerance | FAIL; names 'top', 'became', 'T-02'; exit 1 | `STATE SHEET: 2 renders, 2 with problems` | 1 | MATCH | 3.3 |
| `x2` | T-02 status line colour moved 3 levels: JUST INSIDE the colour tolerance | PASS; names '0 with problems'; exit 0 | `STATE SHEET: 2 renders, 0 with problems` | 0 | MATCH | 3.3 |
| `x3` | T-02 status line colour moved 4 levels: JUST OUTSIDE it | FAIL; names 'colour', 'became'; exit 1 | `STATE SHEET: 2 renders, 2 with problems` | 1 | MATCH | 3.3 |
| `x22` | a card 0.5 px off the page margin: JUST INSIDE the 0.6 px edge tolerance | PASS; names '0 FAIL'; exit 0 | `EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS` | 0 | MATCH | 3.1 |
| `x23` | a card 0.7 px off the page margin: JUST OUTSIDE it | FAIL: page margin 22 px; names 'card-eat left'; exit 1 | `page margin 22 px / dawn-today 360x780 / card-eat left 22.7` | 1 | MATCH | 3.0 |
| `k3` | a card moved 6 px off the page margin | FAIL: page margin 22 px; names 'card-eat left 28'; exit 1 | `page margin 22 px / dawn-today 393x852 / card-eat left 28` | 1 | MATCH | 28.3 |
| `x4` | an 18x18 px block on Today: 0.097% of the frame, JUST INSIDE the 0.1% pixel rule | PASS; names '0 FAIL'; exit 0 | `EARNED UI GATE: 0 FAIL, 0 WARN, 60 PASS` | 0 | MATCH | 28.4 |
| `x5` | a 19x19 px block: 0.108%, JUST OUTSIDE the 0.1% pixel rule | FAIL: visual regression vs baseline; names '% of pixels changed'; exit 1 | `visual regression vs baseline / dawn-today 393x852 / 0.108% of pixels changed, mean shift 0.264 rows 301 to 319` | 1 | MATCH | 28.4 |
| `a` | an em dash in Today's status sentence | FAIL: copy: no dashes, readiness words, vendor names; names "'\u2014'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / '\u2014'` | 1 | MATCH | 28.6 |
| `b1` | a readiness word in a card title (the R1 hole) | FAIL: copy: no dashes, readiness words, vendor names; names "'ready'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / 'ready'` | 1 | MATCH | 28.7 |
| `b2` | a vendor name in a card title | FAIL: copy: no dashes, readiness words, vendor names; names "'claude'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / 'claude'` | 1 | MATCH | 29.3 |
| `c` | the sans face pointed at the serif file | FAIL: fonts pinned by sha256; names 'Earned Sans', 'same glyphs'; exit 1 | `fonts pinned by sha256 / the build / Earned Sans: earned-serif.woff2 is ff90213df9f50596, pinned c04be0b43dc3911d` | 1 | MATCH | 28.4 |
| `d-1` | #start pushed 630 px down at 393x852 (R1 crashed here) | FAIL: primary action in first viewport; names 'bottom'; exit 1 | `primary action in first viewport / dawn-today 393x852 / #start bottom 1321 > 852` | 1 | MATCH | 27.5 |
| `d-2` | #start pushed 210 px down at 375x812 and 360x780 only | FAIL: primary action in first viewport; names 'bottom'; exit 1 | `primary action in first viewport / dawn-today 360x780 / #start bottom 829 > 780` | 1 | MATCH | 3.1 |
| `e1` | Today's titles and status line under 4.5:1 and over 3.0:1 (the R1 hole) | FAIL: contrast (measured behind the text); names '< 4.5'; exit 1 | `contrast (measured behind the text) / dawn-today 393x852 / status-line:Upper body today.  3.2 < 4.5, title:Weigh in before br 3.4 < 4.5, title:Eat about 2,300 kc 3.4 < 4.5, title:Train today. 3.4 <...` | 1 | MATCH | 28.2 |
| `e2` | the same text under 3.0:1 | FAIL: contrast (measured behind the text); names '< 4.5'; exit 1 | `contrast (measured behind the text) / ink-today 393x852 / status-line:Upper body today.  2.1 < 4.5, title:Weigh in before br 2.0 < 4.5, title:Eat about 2,300 kc 2.0 < 4.5, title:Train today. 2.0 < 4.5` | 1 | MATCH | 28.3 |
| `f` | a keyframe animation on #start, live under reduced motion | FAIL: no transitions or animations outside the embers; names 'animation start', 'px moved'; exit 1 | `no transitions or animations outside the embers / dawn-today 393x852 / animation start` | 1 | MATCH | 28.1 |
| `g` | one word of T-02's copy (the R1 hole) | FAIL; names 'the visible text changed', 'T-02'; exit 1 | `STATE SHEET: 2 renders, 2 with problems` | 1 | MATCH | 3.3 |
| `g2` | an em dash inside the same state copy | FAIL; names "copy: '\u2014'", 'T-02'; exit 1 | `STATE SHEET: 2 renders, 2 with problems` | 1 | MATCH | 3.3 |
| `h2` | T-02's status line shifted 60 px | FAIL; names 'became', 'T-02'; exit 1 | `STATE SHEET: 2 renders, 2 with problems` | 1 | MATCH | 3.4 |
| `h3` | T-02's status line shifted 4 px: the first whole pixel outside the tolerance | FAIL; names 'T-02', 'became', 'rect edge moved (px)', 'thumbnail mean shift'; exit 1 | `STATE SHEET: 2 renders, 2 with problems` | 1 | MATCH | 3.3 |
| `i` | this platform's ink-today baseline deleted | FAIL: visual regression vs baseline; names 'no baseline at'; exit 1 | `visual regression vs baseline / ink-today 393x852 / no baseline at quality/baseline/win32/ink-today.png; run "python quality/gate.py --accept" on the machine of record, then commit it` | 1 | MATCH | 28.0 |
| `j1` | EARNED_APP at an empty folder | REFUSE; names 'REFUSED'; exit 2 | `EARNED UI GATE: REFUSED. file:///C:/Users/joeym/AppData/Local/Temp/cui-audit2/empty-probe/ has no ".screen.is-active .ui" element (theme=ink, screen=today)` | 2 | MATCH | 1.0 |
| `j2` | EARNED_APP at app/compare.html, a real page of the pack | REFUSE; names 'REFUSED'; exit 2 | `EARNED UI GATE: REFUSED. file:///C:/Users/joeym/AppData/Local/Temp/cui-audit2/pack2/rebuild/m1/approved-2026-09-18/app/compare.html has no ".screen.is-active .ui" element (theme=ink, screen=today)` | 2 | MATCH | 1.0 |
| `k1` | one RIR chip dropped | FAIL: RIR chips are the five locked values; names 'is not'; exit 1 | `RIR chips are the five locked values / dawn-workout 393x852 / [('0', '0'), ('2', '2'), ('3+', '3+'), ('unsure', 'Unsure')] is not [('0', '0'), ('1', '1'), ('2', '2'), ('3+', '3+'), ('unsure', 'Unsu...` | 1 | MATCH | 28.2 |
| `k2` | a serif element switched to sans | FAIL: serif for names and numbers, sans for the rest; names '.screen-title is Earned Sans'; exit 1 | `serif for names and numbers, sans for the rest / dawn-workout 393x852 / .screen-title is Earned Sans` | 1 | MATCH | 28.2 |
| `m1` | a 4 px dot pulsing for ever on a pseudo element | FAIL: no transitions or animations outside the embers; names 'animation card-eat::after'; exit 1 | `no transitions or animations outside the embers / dawn-today 393x852 / animation card-eat::after` | 1 | MATCH | 29.3 |
| `m2` | a transition on a pseudo element | FAIL: no transitions or animations outside the embers; names 'transition start::after'; exit 1 | `no transitions or animations outside the embers / dawn-today 393x852 / transition start::after` | 1 | MATCH | 28.9 |
| `m3` | three faults in a placeholder, judged by the gate | FAIL: copy: no dashes, readiness words, vendor names; names "'ready'", "'claude'", "'8 x 1'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / 'ready', 'claude'` | 1 | MATCH | 28.8 |
| `m4` | the same three faults in CSS generated content | FAIL: copy: no dashes, readiness words, vendor names; names "'ready'", "'claude'", "'8 x 1'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / 'ready', 'claude'` | 1 | MATCH | 28.4 |
| `m5` | three faults in a placeholder, judged by the state sheet | FAIL; names "copy: 'ready'", 'set written with the letter x'; exit 1 | `STATE SHEET: 2 renders, 2 with problems` | 1 | MATCH | 3.4 |
| `m6` | T-02 dropped from the driver, its records left committed | FAIL; names 'no state T-02 in the build', 'records with no state'; exit 1 | `STATE SHEET: 14 renders, 0 with problems, 2 records with no state` | 1 | MATCH | 17.9 |
| `m7` | T-02's sample note hidden at opacity 0 | FAIL; names 'the visible text changed', 'T-02'; exit 1 | `STATE SHEET: 2 renders, 2 with problems` | 1 | MATCH | 3.3 |
| `n1` | a set string drawn by counter() in generated content | FAIL: generated content the sweep cannot read; names 'status-line::after'; exit 1 | `generated content the sweep cannot read / dawn-today 393x852 / status-line::after " " counter(revx) " x 105"` | 1 | MATCH | 28.6 |
| `n2` | T-02's sample note hidden by clip-path: inset(100%) | FAIL; names 'the visible text changed', 'T-02'; exit 1 | `STATE SHEET: 2 renders, 2 with problems` | 1 | MATCH | 3.5 |
| `n3` | T-02's sample note hidden by text-indent: -9999px | FAIL; names 'the visible text changed', 'T-02'; exit 1 | `STATE SHEET: 2 renders, 2 with problems` | 1 | MATCH | 3.4 |
| `n4` | a theme in the index that the sheet does not render | FAIL; names 'theme sepia, which the sheet does not render', 'records with no state'; exit 1 | `STATE SHEET: 2 renders, 0 with problems, 1 records with no state` | 1 | MATCH | 3.4 |
| `n5` | a theme the sheet renders that the index lost | FAIL; names 'T-02 theme dawn is in the build but not in', 'records with no state'; exit 1 | `STATE SHEET: 2 renders, 0 with problems, 1 records with no state` | 1 | MATCH | 3.4 |
| `p1` | the Chromium launch list loses --font-render-hinting=none | FAIL; names 'rect edge'; exit 1 | `STATE SHEET: 2 renders, 0 with problems` | 0 | MISMATCH | 3.3 |
| `p2` | this platform's committed thumbnail for T-02 deleted | FAIL; names 'no thumbnail at', 'T-02-ink.png', '--accept-thumbs'; exit 1 | `STATE SHEET: 2 renders, 1 with problems` | 1 | MATCH | 3.3 |
| `p3` | the hinting argument taken out of the launch list, judged by the screen gate | FAIL: visual regression vs baseline; names 'of pixels changed'; exit 1 | `EARNED UI GATE: 0 FAIL, 0 WARN, 60 PASS` | 0 | MISMATCH | 29.8 |
| `p4` | the other platform's T-02 thumbnails copied over this platform's | FAIL; names 'is byte identical to', 'never copied', 'T-02-ink.png'; exit 1 | `STATE SHEET: 2 renders, 2 with problems` | 1 | MATCH | 3.3 |
| `q1` | the gate run with a size that does not exist (the row x21 predicted green on nothing) | REFUSE; names 'REFUSED', '--sizes 390x844', 'the sizes are'; exit 2 | `EARNED UI GATE: REFUSED. --sizes 390x844: the screens are today, workout, coach and the sizes are 393x852, 375x812, 360x780` | 2 | MATCH | 0.3 |
| `q2` | a word off the owner's list split by a soft hyphen (the row x8 predicted green) | FAIL: copy: no dashes, readiness words, vendor names; names 'U+00AD', "'ready'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / 'U+00AD', 'ready'` | 1 | MATCH | 28.8 |
| `q3` | a horizontal bar and a hyphen bullet (the row x10 predicted green on U+2015) | FAIL: copy: no dashes, readiness words, vendor names; names "'\u2015'", "'\u2043'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / '\u2015', '\u2043'` | 1 | MATCH | 29.1 |
| `q4` | primary text tagged muted and painted with the muted token (the x20 pair, from the record side) | FAIL; names 'T-02', 'colour', 'became', 'colour moved (levels)'; exit 1 | `STATE SHEET: 2 renders, 2 with problems` | 1 | MATCH | 3.4 |
| `q5` | one state whose apply throws (the row x17 predicted the whole run is lost) | FAIL; names 'T-02'; exit 1 | `STATE SHEET: 16 renders, 2 with problems` | 1 | MATCH | 20.5 |
| `q6` | statesheet --accept pointed at another build by EARNED_APP | REFUSE; names 'REFUSED', 'EARNED_APP'; exit 2 | `STATE SHEET: REFUSED. the records and thumbnails of record are drawn from the pack's own prototype, so --accept and --accept-thumbs refuse to run with EARNED_APP set` | 2 | MATCH | 0.3 |
| `q8` | a minus sign doing a dash's job in Today's status sentence | FAIL: copy: no dashes, readiness words, vendor names; names "'\u2212'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / '\u2212'` | 1 | MATCH | 29.1 |
| `x6` | a readiness word split by inline markup | FAIL: copy: no dashes, readiness words, vendor names; names "'ready'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / 'ready'` | 1 | MATCH | 29.2 |
| `x7` | a readiness word in capitals | FAIL: copy: no dashes, readiness words, vendor names; names "'ready'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / 'ready'` | 1 | MATCH | 29.0 |
| `x8` | a readiness word split by a soft hyphen (U+00AD) | FAIL: copy: no dashes, readiness words, vendor names; names "'ready'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / 'U+00AD', 'ready'` | 1 | MATCH | 29.0 |
| `x9` | a readiness word split by a zero width space (U+200B) | FAIL: copy: no dashes, readiness words, vendor names; names "'ready'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / 'U+200B', 'ready'` | 1 | MATCH | 29.3 |
| `x10` | a dash the sweep does not carry: U+2015 horizontal bar | FAIL: copy: no dashes, readiness words, vendor names; names "'\u2015'"; exit 1 | `copy: no dashes, readiness words, vendor names / dawn-today 393x852 / '\u2015'` | 1 | MATCH | 29.0 |
| `x11` | a font file with the right name and different bytes | FAIL: fonts pinned by sha256; names 'pinned'; exit 1 | `fonts pinned by sha256 / the build / Earned Sans: earned-sans.woff2 is ef1e2bad6b27cee3, pinned c04be0b43dc3911d` | 1 | MATCH | 28.3 |
| `x12` | a committed RECORD edited to match a mutated render (what pins the baselines?) | FAIL; names 'thumbnail'; exit 1 | `STATE SHEET: 2 renders, 0 with problems` | 0 | MISMATCH | 3.3 |
| `x13` | a NEW state with no committed record | FAIL; names 'no record at', 'not in'; exit 1 | `STATE SHEET: 2 renders, 2 with problems, 2 records with no state` | 1 | MATCH | 3.4 |
| `x14` | a type size off the scale: the only path that can WARN and still exit 0 | WARN: type sizes and weights on the scale; exit 0 | `WARN type sizes and weights on the scale / dawn-today 360x780 / new sizes [17] new weights []` | 0 | MATCH | 3.0 |
| `x15` | a gap off the spacing scale: the second advisory path | WARN: gaps on the spacing scale; exit any | `fits without scrolling at 393x852 / dawn-today 393x852 / 647 > 641` | 1 | MISMATCH | 28.7 |
| `x16` | a crash mid-run in the gate: what is the exit code, and is a report written? | FAIL: the gate finished this screen; exit 1 | `the gate finished this screen / dawn-today 393x852 / Error: Page.evaluate: Error: audit2 crash probe\u000A    at Element.getBoundingClientRect (file:///C:/Users/joeym/AppData/Local/Temp/cui-audit2/...` | 1 | MATCH | 21.6 |
| `x17` | a crash mid-run in the state sheet, after clean renders | REFUSE; names 'REFUSED'; exit 2 | `STATE SHEET: 16 renders, 2 with problems` | 1 | MISMATCH | 19.3 |
| `x20` | primary body copy downgraded to the 3.0 tier by a class NAME alone | FAIL: contrast (measured behind the text); exit 1 | `visual regression vs baseline / dawn-today 393x852 / 0.370% of pixels changed, mean shift 0.200 rows 176 to 190` | 1 | MISMATCH | 28.9 |
| `x21` | the gate run with a size that does not exist: green on nothing | PASS; names '0 FAIL, 0 WARN, 0 PASS'; exit 0 | `EARNED UI GATE: REFUSED. --sizes 390x844: the screens are today, workout, coach and the sizes are 393x852, 375x812, 360x780` | 2 | MISMATCH | 0.2 |
| `x24` | a touch target that is not a button, an anchor or an input | FAIL: touch targets >= 44 px; exit 1 | `EARNED UI GATE: 0 FAIL, 0 WARN, 60 PASS` | 0 | MISMATCH | 28.7 |
| `f3a` | PLAN 3a: one character of a committed record far from T-02, to prove the comparison bites | FAIL; names 'W-20'; exit 1 | `STATE SHEET: 2 renders, 1 with problems` | 1 | MATCH | 3.4 |
| `f3b1` | PLAN 3b: gate.py --accept combined with --screens must refuse | REFUSE; names 'REFUSED', 'cannot be combined with --screens or --sizes'; exit 2 | `EARNED UI GATE: REFUSED. --accept sets every baseline, so it cannot be combined with --screens or --sizes` | 2 | MATCH | 0.3 |
| `f3b2` | PLAN 3b: statesheet.py --accept combined with --only must refuse | REFUSE; names 'REFUSED', 'cannot be combined with --only'; exit 2 | `STATE SHEET: REFUSED. --accept writes every record and the index, so it cannot be combined with --only` | 2 | MATCH | 0.3 |
| `x25` | the whole pack integrity check: is anything outside quality/ and README.md changed? | PASS; exit 0 | `EARNED UI GATE: REFUSED. --sizes 390x844: the screens are today, workout, coach and the sizes are 393x852, 375x812, 360x780` | 2 | MISMATCH | 0.3 |
| `x24h` | row x24's HAND mutation done as a text edit: a tertiary link turned into a div[role=button] under 44 px, wh... | FAIL: touch targets >= 44 px; names 'plans-workout'; exit 1 | `touch targets >= 44 px / dawn-workout 393x852 / plans-workout 108x20.00` | 1 | MATCH | 28.3 |
| `x18` | an accept run with nothing changed: can it be mistaken for a green run? | PASS; names 'ACCEPT RUN: regression compared nothing', 'SET'; exit 0 | `ACCEPT RUN: regression compared nothing` | 0 | MATCH | 91.3 |
| `x19` | an accept run pointed at ANOTHER build by EARNED_APP | PASS; names 'ACCEPT RUN'; exit 0 | `EARNED UI GATE: REFUSED. --accept sets the baselines of record, which are drawn from the pack's own prototype, so it refuses to run with EARNED_APP set` | 2 | MISMATCH | 0.4 |

86 rows executed, 76 MATCH, 10 MISMATCH.
- MISMATCH `p1`: exit 0, the row expects 1; 'rect edge' is not in the output
- MISMATCH `p3`: exit 0, the row expects 1; no FAIL naming 'visual regression vs baseline'; 'of pixels changed' is not in the output
- MISMATCH `x12`: exit 0, the row expects 1
- MISMATCH `x15`: no WARN naming 'gaps on the spacing scale'
- MISMATCH `x17`: exit 1, the row expects 2; no one line refusal was printed; 'REFUSED' is not in the output
- MISMATCH `x20`: no FAIL naming 'contrast (measured behind the text)'
- MISMATCH `x21`: exit 2, the row expects 0; '0 FAIL, 0 WARN, 0 PASS' is not in the output
- MISMATCH `x24`: exit 0, the row expects 1; no FAIL naming 'touch targets >= 44 px'
- MISMATCH `x25`: exit 2, the row expects 0
- MISMATCH `x19`: exit 2, the row expects 0; 'ACCEPT RUN' is not in the output

### 2.1 The ten MISMATCH rows, one factual sentence each

No judgement here. Each sentence says what the row expected and what happened.

1. `p1` and `p3` (the hinting argument taken out of the launch list): both came back green on
   Windows, `2 renders, 0 with problems` and `0 FAIL, 0 WARN, 60 PASS`, where the rows expect
   exit 1. Executed on the farm's Linux machine at the same sha, the same two mutations came back
   `STATE SHEET: 2 renders, 2 with problems` exit 1 with
   `rect edge moved (px) 3.83 of 3.00 T-02 ink element 1 "Wed, Sep 16" left` and
   `EARNED UI GATE: 2 FAIL, 0 WARN, 58 PASS` exit 1 with
   `5.532% of pixels changed`; the full transcript is `logs/linux/lin-p1-p3.log`.
2. `x12` (a committed record edited in the same change as the code it records): exit 0,
   `STATE SHEET: 2 renders, 0 with problems`, where the row expects exit 1. The row's own
   prediction is that it passes green because nothing ties a record to the design of record.
3. `x15` (a 7 px gap off the spacing scale): no WARN named `gaps on the spacing scale` appeared;
   what fired instead was `FAIL fits without scrolling at 393x852 647 > 641` in both themes plus
   the two regression rows, exit 1.
4. `x17` (a crash inside one state of the sheet): exit 1 with
   `STATE SHEET: 16 renders, 2 with problems` and a written `states-report-T-0.txt`, where the
   row expects exit 2, a one line refusal and every earlier render lost.
5. `x20` (primary body copy dropped to the 3.0 tier by a class NAME alone): exit 1 with only the
   two `visual regression vs baseline` rows; NO `contrast (measured behind the text)` FAIL, and
   that check is in the run's `Passed everywhere` list. Row `e1`, the same colour without the
   class, FAILs contrast at `3.2 < 4.5`. The pair is the row's point.
6. `x21` and `x25` (the gate run with a size that does not exist): exit 2 with
   `EARNED UI GATE: REFUSED. --sizes 390x844: the screens are today, workout, coach and the sizes
   are 393x852, 375x812, 360x780`, where the rows expect exit 0 and `0 FAIL, 0 WARN, 0 PASS`.
   `x25` runs no script by design; it carries the pack integrity check of section 4 below, which
   was done by hand, and its argument was only a placeholder.
7. `x24` (a touch target that is not a button, an anchor or an input): exit 0, `0 FAIL`, because
   the row's real mutation is marked HAND WORK in the kit and the row itself applies only a CSS
   comment, so it measured nothing. The hand mutation was then executed as row `x24h`, and it
   came back `FAIL touch targets >= 44 px plans-workout 108x20.00` in both themes, exit 1.
8. `x19` (an accept run pointed at another build by EARNED_APP): exit 2 with
   `EARNED UI GATE: REFUSED. --accept sets the baselines of record, which are drawn from the
   pack's own prototype, so it refuses to run with EARNED_APP set`, where the row expects exit 0
   and an accept banner. Nothing was written: the manifest after the accept rows is clean.

### 2.2 The re-check of review R4, gathered in one place

R4 B1, the spaced hyphen. R4 measured, before the fix, `EARNED UI GATE: 2 FAIL, 0 WARN, 58 PASS`
with both FAIL rows `visual regression vs baseline` and no copy row in either theme. At
`64a9e095`, six rows, one per space form plus the control, all came back
`EARNED UI GATE: 4 FAIL, 0 WARN, 56 PASS` at exit 1 with a copy row naming `' - '` on BOTH
`ink-today 393x852` and `dawn-today 393x852`:

| row | the space on each side of the hyphen | copy FAIL in ink | copy FAIL in dawn |
|---|---|---|---|
| `rb1a` | U+00A0 NO-BREAK SPACE (R4's own form) | yes, `' - '` | yes, `' - '` |
| `rb1b` | U+202F NARROW NO-BREAK SPACE | yes, `' - '` | yes, `' - '` |
| `rb1c` | U+2007 FIGURE SPACE | yes, `' - '` | yes, `' - '` |
| `rb1d` | U+2009 THIN SPACE | yes, `' - '` | yes, `' - '` |
| `rb1e` | U+3000 IDEOGRAPHIC SPACE | yes, `' - '` | yes, `' - '` |
| `rb1f` | CONTROL, an ordinary space | yes, `' - '` | yes, `' - '` |
| `q9` | the lane's own teeth row, U+00A0 | yes, `' - '` | yes, `' - '` |

R4 B2, the inert clip. R4 measured, before the fix, `2 FAIL, 0 WARN, 58 PASS` with both rows
regression and no target row at any size in either theme. At `64a9e095`:

| row | the element | result |
|---|---|---|
| `rb2a` | the 274 by 20 focusable title with `clip: rect(0 0 0 0)` and NO positioning, exactly as R4 built it | `4 FAIL, 0 WARN, 56 PASS`, `FAIL touch targets >= 44 px title 274x20.00` in BOTH themes, exit 1 |
| `q10` | the lane's own teeth row, the same mutation | the same four lines, the same two themes |
| `rb2b` | CONTROL, the same element with `position: absolute` AND the clip, truly clipped | `2 FAIL, 0 WARN, 58 PASS`, both rows regression, NO target row at any size in either theme |
| `rb2c` | CONTROL, an untouched run of the same narrowed gate | `0 FAIL, 0 WARN, 60 PASS`, exit 0 |

What the gate does on `rb2b` and what the standard says it should: the gate skips the element,
and `quality/STANDARD.md` section 13 says of this check, in these words, "A box that is
positioned absolute or fixed AND clipped to nothing, which is how the pack hides an assistive
label, is not a target; any other small box is, a box carrying a clip its positioning makes inert
included." The observed behaviour is the behaviour the sentence describes.

The two sibling probes, recorded as facts and not as findings. Both are the mirror image of B2:
B2 was a visible box the walk skipped, and these are boxes nobody can see that the walk counts.

| row | the element | result |
|---|---|---|
| `rb2d` | a focusable 20 px box whose PARENT card is `opacity: 0` | `6 FAIL, 0 WARN, 54 PASS`, `FAIL touch targets >= 44 px title 274x20.00` in both themes, plus `FAIL pressed state on every tappable surface #card-eat` in both themes |
| `rb2e` | the same box with `visibility: hidden` inherited from the parent card | the same six lines, the same values |

`gate.py`'s `JS_SMALL` skips an element only when `e.offsetParent === null` or `__clippedAway(e)`
is true. Neither `opacity: 0` on an ancestor nor inherited `visibility: hidden` nulls
`offsetParent`, and `__clippedAway` reads `position` and `clip` only, so both boxes are measured
against the 44 px rule.

### 2.3 The rows whose kit prediction no longer holds

The kit's `predict` fields were written at `ecbef86`. These rows expect a FAIL, got a FAIL, and
are MATCH; the prediction beside them is the part that is now stale, and the judge should read
the pair.

| row | the kit predicted | what happened at 64a9e095 |
|---|---|---|
| `x8` | "PASSES GREEN": a soft hyphen breaks the word boundary | `FAIL copy ... 'U+00AD', 'ready'` in both themes, exit 1 |
| `x9` | "PASSES GREEN", same mechanism with U+200B | `FAIL copy ... 'U+200B', 'ready'` in both themes, exit 1 |
| `x10` | "PASSES GREEN": the dash list carries only three forms | `FAIL copy ... 'U+2015'` in both themes, exit 1 |
| `x24` | "PASSES GREEN": the walk is `button,a,input` only | the row measured nothing; `x24h`, the same mutation done for real, FAILs `touch targets >= 44 px plans-workout 108x20.00` |
| `x21` | "exit 0 having measured nothing" | exit 2, a one line refusal naming the size and the sizes that exist |
| `x17` | "exit 2 and every earlier render is lost" | exit 1, 16 renders, 2 with problems, report written |
| `x19` | "the baselines of record are rewritten from a build that is not the design of record" | exit 2, a one line refusal, nothing written |

Two kit predictions DID hold: `x12` (a record edited in the same change as the code it records
passes green) and `x20` (the contrast tier is decided by the class name, so the same colour that
FAILs on `e1` passes on `x20`).

## 3. Phase A, the clean runs, verbatim

All four on the fresh scratch copy at `64a9e095`, before any mutation. Raw logs in
`logs/phaseA/`.

### A1. `python quality/gate.py`, full, no arguments. 90 s, exit 0.

    EARNED UI GATE: 0 FAIL, 0 WARN, 372 PASS

    Passed everywhere: Log in the thumb zone (centre >= 70% of height); Log label uses [the
    multiplication sign]; RIR chips are the five locked values; bottom safe area; card inner edge
    14 px; contrast (measured behind the text); copy: no dashes, readiness words, vendor names;
    fits without scrolling at 393x852; fonts pinned by sha256; gaps on the spacing scale;
    generated content the sweep cannot read; icon inset 13 to 14 px; icons share a centre line,
    text shares an edge; no page or console errors; no seams in the scene; no straight edge in
    the scene with the mist drawn; no transitions or animations outside the embers; no vertical
    streaks in the sky with the mist drawn; nothing moves except the embers; nothing moves under
    reduced motion; page margin 22 px; pressed state on every tappable surface; primary action in
    first viewport; radii: 14 px for cards, buttons and chips; full round only for pills; right
    glyph column at 24 px; same icon column (54) and text edge (88) on every screen; serif and
    sans faces loaded and distinct; serif for names and numbers, sans for the rest; tertiary
    links have no underline; the multiplication sign in every set string; touch targets >= 44 px;
    type sizes and weights on the scale; visual regression vs baseline

The one substitution in that block is the multiplication sign in the check name `Log label uses
X`, written in square brackets so this file stays pure ASCII; `logs/phaseA/a1-gate-full.log`
carries the character. There were no FAIL rows, no WARN rows and no regression rows to record:
the six `visual regression vs baseline` rows all passed, so the win32 screen baselines that
landed for this round match what this machine draws.

### A2. `python quality/statesheet.py`, full, no `--only`. 506 s, exit 0.

The whole of the run's own output, the "worst measured" block VERBATIM:

    wrote statesheet-today.jpg (2470, 29584) 99 states
    wrote statesheet-workout.jpg (2470, 13456) 45 states
    wrote statesheet-coach.jpg (2470, 19728) 65 states
    STATE SHEET: 418 renders, 0 with problems


    worst measured:
      none measured: nothing moved in 418 renders
      advisory, not a tolerance: this run against the linux thumbnails
      thumbnail mean shift                   1.26 of   2.00   C-63 ink
      thumbnail pixels over 24 levels        0.00 of   1.00   nothing moved

PLAN.md A2 asked for exactly one thing: "a clean win32 run should print 0.00 for all four
measures. Anything above zero on the machine that wrote them is a finding." Nothing is above
zero. The advisory cross platform row reads `1.26 of 2.00 C-63 ink`, which is the same figure
review R4 reported from the other side of the pair.

### A3. `phonesheet.py` and `phonesheet.py --state T-40`. Both exit 0.

    wrote quality/run/phonesheet-today.png
    wrote quality/run/phonesheet-workout.png
    wrote quality/run/phonesheet-coach.png
    wrote phonesheet-all.png (2448, 8468)

    wrote quality/run/phonesheet-T-40.png
    wrote phonesheet-all.png (2448, 2796)

(The paths are absolute in the raw logs; they are shortened here to the pack relative form.)

### A4. `driver.py --manifest check`.

    MANIFEST clean: 1319 files byte identical

### A5. The lane's own `quality/teeth.py`, whole. 781 s, exit 0.

Run on a SECOND scratch copy (`pack3`, `git archive` from the branch at the time) so that it
could never read the audit's own copy while a mutation was applied there.

    TEETH: 46 rows, 0 disagreeing, 781 s

Every one of the 46 rows is "as expected". Two carry a note, and it is the note the file's own
header promises rather than a silent pass: rows `p1` and `p3` print "glyphs are not hinted on
win32, so taking the argument out of the launch list moves nothing here and this row cannot fail;
it is a row of the platforms that hint, which are linux". The full table is
`logs/phaseA/a6-teeth-full.log`.

## 4. Phase F

### 4.1 Section 3a: is every committed record really compared?

- Count. `quality/baseline/states/` holds 418 `.json` plus `INDEX.json`, and the thumbnails now
  live in per platform subdirectories, `states/linux/` and `states/win32/`, 418 `.png` each.
  A2 reported `418 renders`. The sheet renders 209 states in 2 themes.
- The comparison bites on a record the run does not otherwise touch. Row `f3a` changed ONE
  character of `quality/baseline/states/W-20-ink.json` (`"text":"example Upper body` to
  `"text":"Example Upper body`) and ran `statesheet.py --only W-20`:
  `STATE SHEET: 2 renders, 1 with problems`, exit 1, report `states-report-W-20.txt`. One render
  of the two, which is the one whose record was touched.
- The index bites in both directions: `m6` (a state dropped, its records left committed) came
  back `14 renders, 0 with problems, 2 records with no state` exit 1; `n4` (a theme in the index
  the sheet does not render) and `n5` (a theme rendered that the index lost) both exit 1 naming
  `records with no state`; `x13` (a new state with no committed record) came back
  `2 renders, 2 with problems, 2 records with no state` exit 1.
- A state with more problems than the list shows still shows the worst one. Row `h2` (the status
  line moved 60 px) and row `h3` (moved 4 px) both print the moved edge, both measures and the
  truncation, and `h3`'s row carries `rect edge moved (px)` and `thumbnail mean shift` together.

### 4.2 Section 3b: `--accept` is the only writer, and both refusals executed

Both refusals were executed, and both refuse before anything is opened or written (the checks sit
above `asyncio.run` in each script's `__main__`):

    f3b1  python quality/gate.py --accept --screens today
          EARNED UI GATE: REFUSED. --accept sets every baseline, so it cannot be combined with
          --screens or --sizes
          exit 2

    f3b2  python quality/statesheet.py --accept --only T-02
          STATE SHEET: REFUSED. --accept writes every record and the index, so it cannot be
          combined with --only
          exit 2

Row `x18`, an accept run with nothing changed, 91.3 s, exit 0:

    ACCEPT RUN: regression compared nothing
    EARNED UI GATE: 0 FAIL, 0 WARN, 6 SET, 366 PASS

with six `SET visual regression vs baseline` rows, one per view, in place of six PASS rows.
What a reader sees: the banner on line 1, SET instead of PASS, and 366 PASS instead of 372.
What a CI step that reads only the exit code sees: 0, the same as a green run. The report is in
`quality/run/`, which the repository's `.gitignore` excludes, so for such a step the answer to
the ticket's question is that nothing outside the report distinguishes the two.

One measured fact beside it. `driver.py --manifest check` run against the scratch copy AFTER the
accept run came back `MANIFEST clean: 1319 files byte identical`
(`logs/phaseA/a7-manifest-after-x18.log`): the six baselines and the `ENV.txt` the accept run
wrote are byte for byte what was already committed, on this machine at this head.

Row `x19`, an accept run with `EARNED_APP` set, is MISMATCH and is described in section 2.1: the
gate refuses it now, so there were no before and after hashes to compare.

### 4.3 Section 3c: the records' size, and an ENV.txt per platform

    quality/baseline/states        1,437,414 bytes = 1.37 MB   under the 3 MB budget
    quality/baseline/linux/ENV.txt exists
    quality/baseline/win32/ENV.txt exists, and win32 now holds all six screen baselines

`quality/baseline/win32/ENV.txt` reads, verbatim:

    the machine that set these baselines
    os: Windows 11 (win32)
    python: 3.14.6
    playwright: 1.62.0
    chromium: 151.0.7922.34
    launch: --allow-file-access-from-files --font-render-hinting=none
    screens: ink-today, ink-workout, ink-coach, dawn-today, dawn-workout, dawn-coach
    viewport: 393x852, chrome=1, date=board

The Chromium version in it, 151.0.7922.34, is the one this PC actually has: the accept run of row
`x18` rewrote that same `ENV.txt` on this machine and the manifest stayed byte identical. So
acceptance 6 is met on this branch in a way it was not at `ecbef86`, where PLAN.md recorded that
`quality/baseline/win32/` did not exist at all and row `i` was VOID. Row `i` is no longer VOID:
deleting `quality/baseline/win32/ink-today.png` produced
`FAIL visual regression vs baseline ink-today 393x852 no baseline at
quality/baseline/win32/ink-today.png; run "python quality/gate.py --accept" on the machine of
record, then commit it`, exit 1.

The note PLAN.md asked to carry to the PM still stands as a fact: the state records are NOT filed
per platform (`statesheet.py` reads `quality/baseline/states`), while the screen baselines are
(`gate.py` reads `baseline/<sys.platform>`). The thumbnails inside the records tree ARE filed per
platform now, `states/linux/` and `states/win32/`.

### 4.4 Section 4: the pack integrity check against 5f4cad0a

    git diff --name-status 5f4cad0a..64a9e095 -- rebuild/m1/approved-2026-09-18

1296 files changed. Every path is under `rebuild/m1/approved-2026-09-18/quality/` except exactly
two:

    M  rebuild/m1/approved-2026-09-18/README.md
    M  rebuild/m1/approved-2026-09-18/app/app.css

`README.md` is allowed to move. `app/app.css` is the one app line the owner ratified, and here is
the exact diff, the whole of it:

    @@ -199,7 +199,7 @@ a { text-decoration: none; }
     .eyebrow { font-size: 12px; ... }
    -.link { display: inline-flex; align-items: center; min-height: var(--hit); font-size: 13.5px;
    +.link { display: inline-flex; align-items: center; min-height: var(--hit); min-width: var(--hit); font-size: 13.5px;
      font-weight: 450; color: var(--text); text-decoration: underline; text-underline-offset: 4px;
      text-decoration-thickness: 1px; text-decoration-color: color-mix(in srgb, var(--text) 55%, transparent); }

One declaration added to one rule: `min-width: var(--hit)` on `.link`. Nothing under `app/`
besides that line, nothing under `ref/` and nothing under `states/` has moved since `5f4cad0a`.
(The two surrounding lines are elided in the middle of `.eyebrow` for width; the full diff is
reproducible with the command above.)

### 4.5 Section 5: the two counts against STANDARD.md and README at this head

`quality/STANDARD.md:122` says "`gate.py`, 33 checks, 372 result rows" and `README.md:39` repeats
"33 distinct checks on the six views, 372 result rows". Counted mechanically from the A1 run's
own `quality/run/report.json` (`logs/phaseA/a5-counts.log`):

    RESULT ROWS: 372
    DISTINCT CHECK NAMES: 33
    LEVELS: {'PASS': 372}

Both numbers are still true after R3 and R4. The 33 names are listed in that log. `README.md:40`
says 418 renders for the state sheet; A2 reported `418 renders`.

### 4.6 Section 6: the Linux question, answered only with evidence that can be shown

PLAN.md ranked three ways to answer this and said to write "unverified" rather than infer. The
second and strongest available way was executed. The PM's cloud farm is a Linux machine with
Chromium 141.0.7390.37; the pack was extracted there by `git archive 64a9e095` outside every git
work tree and the two gates were run whole. Raw logs: `logs/linux/`.

    lin-gate-full.log        EARNED UI GATE: 0 FAIL, 0 WARN, 372 PASS          exit 0
    lin-statesheet-full.log  STATE SHEET: 418 renders, 0 with problems         exit 0
    lin-phonesheet.log       wrote phonesheet-all.png (2448, 8468)             exit 0

and the Linux run's "worst measured" block, verbatim:

    worst measured:
      colour moved (levels)                  0.00 of   3.00   nothing moved
      rect edge moved (px)                   0.04 of   3.00   W-05 ink element 22 "Unsure" left
      thumbnail mean shift                   0.00 of   2.00   nothing moved
      thumbnail pixels over 24 levels        0.00 of   1.00   nothing moved
      advisory, not a tolerance: this run against the win32 thumbnails
      thumbnail mean shift                   1.26 of   2.00   C-63 ink
      thumbnail pixels over 24 levels        0.00 of   1.00   nothing moved

So, stated as narrowly as the evidence allows: at `64a9e095`, on a Linux machine, against the
state records that were written on win32, the state sheet reports 418 renders and 0 with
problems, and the worst rect edge over all 418 renders is 0.04 px of the 3.00 allowed, at
`W-05 ink element 22 "Unsure" left`. The screen gate on the same machine is 372 PASS against
`quality/baseline/linux/`. That is acceptance 16's Linux half executed rather than inferred, and
the headroom PLAN.md asked the PM to require is 0.04 of 3.00.

Three things that number does NOT say, and the judge should hold them against it:

1. That Linux machine runs Chromium 141.0.7390.37 and playwright 1.56.0, which is exactly what
   `quality/baseline/linux/ENV.txt` names. The state records were written on win32 with Chromium
   151.0.7922.34. So the two halves of the comparison were drawn by different Chromium major
   versions, and the 0.04 px is the headroom across BOTH differences at once. It is not a
   measurement of one Linux machine against one win32 machine on the same browser.
2. It is one Linux machine, two cores, in the PM's cloud workspace. It is not the lane lead's
   Linux machine and it is not CI.
3. PLAN.md's first option, the two pre accept `states-report.txt` files from `ee1f191` diffed
   line for line, was not available to this audit: those files are not in the repository and no
   one attached them. That claim, that a hinting off Linux run and a hinting off Windows run
   produce identical report lines word for word, is still taken on the round's word.

The Windows half of the old claim in `quality/common.py`'s `LAUNCH_ARGS` comment was not re-read
here; PLAN.md records it as confirmed from the committed data at `ecbef86`.

## 5. Every deviation from PLAN.md, and why

1. **The head moved.** PLAN.md was written at `ecbef86`; the head under audit is `64a9e095`, and
   while the audit ran the lane pushed an R5 round to `814f0a03`. Section 0 records it in full.
   Every executed row ran at `64a9e095`.
2. **Step 0 found no moved anchor.** PLAN.md expected row `i` to be VOID until the win32
   baselines existed. They exist at this head, so all 57 kit rows dry-ran DRY-OK and 0 VOID, and
   no row needed fixing. The old anchors were therefore not commented out, because none changed.
3. **rows.py grew from 57 to 86 rows.** Added: the 14 rows `quality/teeth.py` carries at this
   head that the kit did not (`h3`, `p2`, `p3`, `p4`, `q1`, `q2`, `q3`, `q4`, `q5`, `q6`, `q8`,
   `q9`, `q10`, `q11`); the R4 re-check rows `rb1a` to `rb1f` and `rb2a` to `rb2e`; PLAN.md
   section 3's baseline checks as rows `f3a`, `f3b1`, `f3b2`; and `x24h`, row `x24`'s hand
   mutation expressed as a text edit so it is executed and recorded rather than described.
4. **driver.py gained one op and one fix.** `copy_from` so teeth's row `p4` (another platform's
   thumbnails copied over this one's) can be data rather than hand work. The fix is in `judge`:
   `gate.py` ends with `Passed everywhere: <every check name that passed>`, and the old test
   `catcher not in stdout_tail` therefore reported a catcher as caught when it had PASSED. Row
   `x20` was judged "as expected" by the driver for exactly that reason and is a MISMATCH in this
   report's table, which re-judges from the recorded output with that line removed. No row's raw
   output changed and no row was re-run because of it.
5. **The manifest is 1319 files, not 892.** PLAN.md's figure was `ecbef86`'s; the per platform
   thumbnail directories and the win32 screen baselines have landed since.
6. **Phase A gained a fifth step**, the lane's own `teeth.py` whole, run on its own second scratch
   copy so it could never read the audit's copy mid mutation.
7. **The order of phases B to E was not PLAN.md's.** The R4 re-check rows were run FIRST, before
   Phase B, because DECISIONS:593 makes them the point of the round and the judge can start on
   them. Then B, then C, then D plus the new teeth rows, then E, then the two accept rows last.
8. **Phase B's `x4` and `x5` no longer need a precondition.** They ran, because the win32
   baselines exist now.
9. **`x2` and `x3` were not rebuilt.** PLAN.md warned that a re-accept of the records would force
   it. The record colours read at `ee1f191` still hold at `64a9e095`: `x2` (3 levels) passes and
   `x3` (4 levels) fails, so the pair still pins the colour tolerance.
10. **`p1` and `p3` were additionally executed on Linux**, in the farm, because on Windows they
    cannot bite and PLAN.md says honest verification needs a Linux run. Both bite there.
11. **The scratch copy was re-made twice**, once after the accept rows as PLAN.md requires, and
    once more pinned to the sha after the branch moved (section 0).
12. **`compare_records.py` was not run.** PLAN.md section 6 used it to confirm the Windows half
    of the launch list claim from the `ee1f191` records, which it already records as confirmed.
    This audit answered section 6 by executing the Linux run instead, which is the stronger of the
    two, and did not repeat the weaker one.
13. **Section 4 was done by hand, as PLAN.md's row `x25` says to.** The row itself ran a
    placeholder command and is a MISMATCH for that reason alone; section 4.4 is the real check.

## 6. What I did NOT run

- **Anything at `814f0a03`.** The R5 review, the R5 code change and the R5 package are outside
  the head this audit was given. Their rows, if any are wanted, are a separate job.
- **`quality/teeth.py` on Linux.** Only the two hinting rows `p1` and `p3` were rebuilt there by
  hand. The other 44 teeth rows were run on Windows only.
- **A full `--accept` of the state sheet**, on either machine. `statesheet.py --accept` writes
  every record and the index, and the audit's mandate forbids running an accept against anything
  but the scratch copy; the two accept paths that WERE executed are `gate.py --accept` on the
  scratch copy (`x18`) and the three refusals (`f3b1`, `f3b2`, `q6`, `x19`).
- **`--accept-thumbs` in any form.** Row `p2` proves a missing thumbnail FAILs and names the
  remedy; the remedy itself was not executed.
- **The owner's ratification conversation**, which is not visible to this session and is not
  claimed here.
- **Any second run of any row.** Nothing looked load related, so nothing was re-run; had anything
  been, both runs would be recorded here.
- **`compare_records.py`** (section 5 item 12).
- **The lane lead's two pre accept `states-report.txt` files from `ee1f191`**, which are not in
  the repository (section 4.6 item 3).
- **CI.** GitHub Actions `rebuild-public` runs on every push to `rebuild/**` and will have judged
  this branch; its result is not read into this report.
- **Anything at all under `rebuild/conform/private`, `src/history.js`, any `ledger/`,
  `C:\Users\joeym\EarnedPort`, `%TEMP%\port-real.log` or the protected soak.** None of them was
  read, listed, opened or grepped on either machine. There is no owner data in this pack: it is a
  design prototype and its states are synthetic.

## 7. What is published beside this file

    RUN-REPORT.md            this file, pure ASCII
    results.jsonl            one JSON line per EXECUTED row, 86 lines, as the driver wrote them
    results-dryruns.jsonl    the dry run records the selftests appended, kept separate
    rows.py                  the final 86 rows as data
    driver.py                the final driver, with copy_from and the judge fix
    selftest.log             the last dry run of all 86 rows, against the pack pinned at 64a9e095
    selftest-console.log     the selftest's own console: MANIFEST, PACK-SHA and the DRY-OK table
    logs/<row>.log           one raw log per executed row: the diff, the table, the revert proof
    logs/phaseA/             the clean runs, the counts, the manifest checks, the re-pin
    logs/linux/              the farm's Linux runs and the script that produced the p1/p3 pair

Every path under `logs/linux/` crossed from the farm to this PC through the owner's airlock and
its sha256 was compared on both sides before it was committed; the five hashes matched.

## 8. Two substitutions in the published text, named so nothing is hidden

1. **RUN-REPORT.md is pure ASCII by measurement**, LF endings, 0 non ASCII bytes and 0 CR bytes.
   One character had to be rewritten to get there and it is named: a U+2015 HORIZONTAL BAR in the
   row `x10` line of section 2.3 is written `U+2015`. The forms in the table are
   TEXT: a character outside ASCII is written there as a backslash, the letter u and four hex
   digits, six characters, not the character it names. There are 14 of them and they were read
   back from the written file and counted as text.
2. **Three raw logs carried a literal U+2014**, because rows `a` and `g2` mutate Today's copy WITH
   an em dash, so the driver's diff and the gate's own FAIL line carry the character:
   `selftest.log` (2), `logs/a.log` (1), `logs/g2.log` (1). No authored file in this repository
   may carry U+2013 or U+2014, so in those three files, and only there, that one character is
   written `<U+2014>`, which is the notation the lane's own reviews already use. Nothing else in
   any log was touched. The scan that found them and the scan that confirms zero afterwards are
   the same script.

## 9. The count

    86 rows executed, 76 MATCH, 10 MISMATCH, 0 TIMEOUT, 0 DIRTY
    86 of 86 reverted byte identical
    manifest clean at 1319 files before the first row, after the accept row, and after the re-pin
    2 clean full gates (win32 and linux), 2 clean full state sheets (win32 and linux)
    1 clean run of the lane's own teeth.py: 46 rows, 0 disagreeing
