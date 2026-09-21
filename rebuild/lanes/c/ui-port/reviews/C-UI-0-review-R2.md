# C-UI-0 review R2: ACCEPT WITH NOTES, 0 blocking

Independent reviewer, second round, 2026-09-18. Same branch, delta `e7d7d536..HEAD` (five
commits, HEAD 6569b4dc). Same method as R1: a fresh `cp -r` copy of
`rebuild/m1/approved-2026-09-18/` per row in the session scratchpad, one change at a time, the
copy's own `gate.py` and `statesheet.py`, never `teeth.py` on its own. `teeth.py` was run once
afterwards and compared with my own rows. Nothing in the worktree was modified except this file.
`git diff e0a6c8ef HEAD -- rebuild/m1/approved-2026-09-18/app` is still empty (0 lines), so the
prototype is still untouched across all twelve commits.

## Summary

All four blocking findings are closed, and I proved each one by rebuilding the exact mutation
that slipped through in R1. The pseudo element pulse and the pseudo element transition now FAIL
eight rows each, naming the pseudo (`animation card-eat::after`, `transition start::after`),
under reduced motion and again with motion allowed. The three faults planted in a placeholder and
in CSS generated content now FAIL the copy sweep and the multiplication sign sweep on both gates,
at all three sizes, in both themes. T-02 removed from the driver now exits 1 with
`2 records with no state` and two lines naming the committed files. A line hidden at `opacity: 0`
now leaves the record and reads as removed, and so does `visibility: hidden`. Every one of my
eleven SHOULD FIX items is implemented and verified by execution or by reading, including the two
Windows nits: the gate now runs green from a directory whose name contains a percent escape,
where the old double unquote resolved to a different path, and `teeth.py` keeps a file's own line
endings. All eight documentation mismatches are fixed; the code now has exactly two WARN sites,
matching all three places that say so, and STANDARD.md section 13's table is still exactly the 32
check names the code emits, over 354 rows.

The prototype still passes both gates clean: `EARNED UI GATE: 0 FAIL, 0 WARN, 354 PASS` at exit 0
in 112 s, and `STATE SHEET: 418 renders, 0 with problems` at exit 0 in 841 s, with the new
"worst measured" block printing real numbers. `teeth.py` is 26 rows, 0 disagreeing, 663 s at exit
0, inside the 25 minute budget, and its seven new rows agree with my own hand runs. The records
rewritten by `--accept` still hold the tolerance where the ticket wants it: the 3 px shift passes
at rect 3.00 of 3.00 and thumbnail 1.67 of 2.00, 4 px fails both halves, and 60 px fails at 8.54.
Of the fresh mutations I aimed at the new code, three found something: generated content whose
value is a `counter()` is not swept (an `attr()` one is), and two further ways of hiding text,
`clip-path: inset(100%)` and `text-indent: -9999px`, still pass green, which is the same class as
my R1 SHOULD FIX 1 rather than a new one. None of the three is a blocking defect by the standing
definition, and each has a one line fix. I would seal this after the SHOULD FIX list below, with
the lane lead's Windows run still owed.

## BLOCKING

None. The four from R1 are closed, and nothing I could build this round is a forbidden change
passing green on a rule the standard states, a crash instead of a report, a wrong exit code, a
tolerance or platform claim the code does not implement, or a path that breaks on Windows.

## SHOULD FIX

1. **A string in generated content that is computed rather than quoted is not swept.**
   `quality/common.py:JS_SWEPT_TEXT`, the `gen()` helper, pulls only quoted literals out of
   `getComputedStyle(e, which).content` with `/"([^"]*)"|'([^']*)'/g`. I set
   `body { counter-reset: revx 8 }` and `#status-line::after { content: " " counter(revx) " x 105" }`,
   which draws `8 x 105` on the screen. The copy sweep and the multiplication sign sweep both
   stayed PASS; the run exited 1 only on `fits without scrolling at 393x852` and the two
   regression rows, both of which are geometry and both of which a client with its own baseline
   would not raise. `attr()` is fine, because Chromium resolves it into a quoted string in the
   computed value: the same three faults carried by `content: " " attr(data-rev)` FAILed the copy
   sweep and the multiplication sweep on all six rows. Either read the pseudo's rendered text
   instead of its declared value, or, cheaply, treat a `content` value that still contains
   `counter(`, `counters(` or `attr(` after the literals are pulled out as a FAIL of its own
   ("generated content this gate cannot read"). README section 4 says the sweep covers "any
   string in `::before` or `::after` generated content", which is wider than what the code does,
   so the sentence needs the same correction.
2. **`clip-path` and `text-indent` still hide text that the record keeps.**
   `quality/statesheet.py:JS_RECORD`, the `seen()` helper, tests `offsetParent`, `visibility` and
   the walked `opacity` only. With `.note-block.sample { clip-path: inset(100%) }` the sheet
   reported `2 renders, 0 with problems`, exit 0; with `text-indent: -9999px`, the same. Both
   leave the rect, the colour, the family, the size and the text untouched and move the 1/16
   thumbnail less than 2.0 levels, so nothing fires. `font-size: 0` is caught, on size and
   geometry. This is the class my R1 SHOULD FIX 1 named and the builder implemented exactly as I
   specified it, so it is not a regression, but the class is wider than the two mechanisms
   STANDARD.md section 3 now enumerates. Either widen `seen()` (a `clip-path` other than `none`,
   a `text-indent` that carries the text outside the element's own rect, a zero `font-size`), or
   say in STANDARD.md section 3 that the rule names the mechanisms it checks rather than every
   way a line can be hidden.
3. **The index compares ids only, so its `themes` field is decorative.**
   `quality/statesheet.py:index_problems` flattens the index to `(id, theme)` pairs but then only
   ever tests `sid not in driver_ids` and `sid not in known`. I added a third theme, `sepia`, to
   T-02's entry in `INDEX.json`: `2 renders, 0 with problems`, exit 0. I removed `dawn` from the
   same entry: again `2 renders, 0 with problems`, exit 0. Nothing depends on the field today,
   because the sheet renders a hardcoded `['ink', 'dawn']`, so the risk is only that a wrong
   index produces a wrong orphan line. Either compare the pairs (the rendered `(id, theme)` set
   against the recorded one) or drop `themes` from the index and derive it.
4. **The new clause explaining 209 against 205 has the wrong numbers.** `README.md:33` now reads
   "the inventory below counts 205 rows because four of the proposal card's drawn variants,
   T-40b to T-40h, share one inventory row". Counted from `INDEX.json`: 209 drawn states, 201
   distinct base ids, and 8 suffixed variants, which are T-40b, T-40c, T-40d, T-40e, T-40f,
   T-40g, T-40h and C-50b. The inventory's 205 rows are the nominal id ranges, of which 4 have no
   drawn state. So it is eight variants sharing two base rows, and four inventory rows with
   nothing drawn, not four variants sharing one.
5. **The "worst measured" block names an arbitrary element when the measure is zero.** On this
   machine every measure is 0.00 and the block reports `T-02 ink element 0 "Earned"` for the
   colour and the rect, which is simply the first element compared. It reads as though that
   element were the worst. Print the state and element only when the value is above zero, or say
   "first of 418 renders, nothing moved".
6. **The record's `text` is no longer reading order, and the docs still call it the visible
   text.** Executed: with one word of a card title wrapped in a span, `JS_RECORD` returns
   `... Weigh in before . breakfast Your weight ...` where `innerText` reads
   `... Weigh in before breakfast. Your weight ...`, because `said` collects each element's own
   text nodes in element order. Detection is unaffected, and the element list already fails on a
   nesting change, so this costs nothing in teeth; but `README.md:138` still says the record holds
   "the screen's visible text with whitespace normalised", and the message a reviewer reads is
   "the visible text changed" when the visible text did not change. Either say what it is (the
   text of the elements that survive the visibility test, joined in document order) or collect
   `said` in text node order.

## NOTES

**The two deviations, judged.**

- **Visibility folded into S1, and the record's text built from the surviving elements rather
  than `innerText` (the package's Q9).** Agree, and I think it is the better shape. It is the
  only way `opacity: 0` can read as removed, which is what R1 asked for, and folding
  `visibility: hidden` into the same test replaces an accident (it used to leave the record only
  because `innerText` happens to exclude it) with a rule. The cost is that every record was
  rewritten, which I checked: 837 files, 1,005,460 bytes, 0.96 MB, still inside the 3 MB budget,
  the manifest digest in the package matches, and the full sheet is clean against them. The
  residual is SHOULD FIX 6, which is wording, not behaviour.
- **The `content: none` guard on the pseudo element sweep.** Agree. Executed both ways: a pseudo
  element carrying `animation` with no `content` draws no box, and the gate stays at 0 FAIL, 0
  WARN, which is right, because nothing is on the screen to move; and `content: ""`, which does
  draw a box, is caught (my two blocking rows both used it). The guard tests `none` and `normal`
  only, so it cannot swallow a pseudo element that renders.

**The two new open questions.**

- **Q8, a baseline carries no provenance.** Agree with the choice not to sign the baseline
  directory. A signature keyed on `ENV.txt` would refuse every legitimate machine upgrade, and
  the guard that is left (an accept run labels its own report, no report is committed, a reviewer
  reads the baseline diff) is the honest one. README section 3.1 now says so in one line, which
  is what I asked for.
- **Q9, the record's text.** Agree, with SHOULD FIX 6 on the wording. The note that a reviewer
  comparing an old record with a new one will see the text field change shape on states with
  hidden content is accurate and worth keeping in the package for the second auditor.

**The gold tier.** SHOULD FIX 11 from R1 is implemented and I verified it fires: with
`#status-line { color: var(--gold) }`, a 39 character sentence with no marker class, the gate
FAILs three Dawn rows at `status-line:Upper body today. 3.2 < 4.5`. The tier is decided by a
marker class or a string shorter than 24 characters, which is a heuristic: a marker longer than
24 characters in a later ticket will FAIL and will need one of the classes in
`GOLD_MARKER_CLASSES`. The prototype is green under it, so no current state is affected.

**A placeholder on an input that is hidden in the base render.** The gate reports 0 FAIL for
three faults planted on the coach text input while it is still `hidden`, which is correct
scoping rather than a hole: the state sheet renders the state that reveals it, and C-06 with the
same mutation came back `2 renders, 2 with problems`, exit 1,
`copy: 'ready', '<the lowered vendor name>'; set written with the letter x: '8 x 1'`. The two gates cover it between
them, which is worth saying out loud because neither does on its own.

**An ancestor at `opacity: 0.01`.** Above the 0.001 threshold, so it stays measured, and both
gates refuse it: the sheet on `contrast: save-weight:Save 1.0 < 4.5` plus a thumbnail shift of
2.19, the gate on six contrast rows at 1.0 to 1.1 and two regression rows. The threshold is in
the right place.

**Text at `color: transparent`.** Caught, and by two different measures: the record's colour
comparison (`colour (189, 184, 174) became (0, 0, 0)`) in both themes, and the contrast check in
Ink. Not a hole.

**Runtime.** Gate 112 s in the worktree and 115 to 118 s per row in the scratch copy; full state
sheet 841 s; `teeth.py` 663 s against the builder's 641 s; phone sheet 7 s for one state. The
`--only T-0` sheet rows are 28 to 32 s, the `--only T-02` rows 5 s.

**What I did not re-execute.** The Windows run, for the same reason as R1: there is no Windows
machine here, and the win32 baselines still do not exist by design. The "worst measured" block is
the instrument that makes that run reportable, and it works: on this machine it prints 0.00 for
all four measures, and under a 3 px shift it prints 1.67 of 2.00 and 3.00 of 3.00, so the lane
lead's run will produce numbers rather than a verdict. I also did not re-run a full
`statesheet.py --accept`, which is a 14 minute write of all 837 files; the committed
`INDEX.json` holds exactly the driver's 209 ids, which the clean full run proves in both
directions, and the two failure paths around it are executed below.

## The rows I re-ran, mine beside teeth.py's

Mine: the full `python quality/gate.py` (three sizes, two themes, three screens) or
`python quality/statesheet.py --only ...` in a fresh copy of the pack, one mutation per copy.
`teeth.py`: its own narrowed run. Lines are quoted from the report the run wrote.

| what I did | my exit | the line the report carried | verdict | teeth.py row |
|---|---|---|---|---|
| control, gate | 0 | `EARNED UI GATE: 0 FAIL, 0 WARN, 354 PASS` | clean | baseline |
| control, sheet (full) | 0 | `STATE SHEET: 418 renders, 0 with problems` plus a `worst measured` block of four zeroes | clean | baseline |
| B1, a 4 px dot pulsing for ever on `#card-eat::after` | 1 | `FAIL  no transitions or animations outside the embers  ink-today 393x852  animation card-eat::after`, 8 rows including both `nopref` rows | closed | m1 as expected |
| B1, a transition on `#start::after` | 1 | `FAIL  no transitions or animations outside the embers  ink-today nopref  transition start::after`, 8 rows | closed | m2 as expected |
| B2, three faults in the Today placeholder, gate | 1 | `FAIL  copy: no dashes, readiness words, vendor names  ink-today 393x852  'ready', '<the lowered vendor name>'` and `FAIL  the multiplication sign in every set string  ink-today 393x852  '8 x 1'`, 6 rows each | closed | m3 as expected |
| B2, the same placeholder, sheet | 1 | `T-02  ink  ...  copy: 'ready', '<the lowered vendor name>'; set written with the letter x: '8 x 1'` | closed | m5 as expected |
| B2, the same three faults in `#status-line::after` content, gate | 1 | the same two checks, 6 rows each, plus fits and regression | closed | m4 as expected |
| B2, generated content, sheet | 1 | `T-02  ink  ...  copy: 'ready', '<the lowered vendor name>'; set written with the letter x: '8 x 1'; element 4 ... height 20 became 40` | closed | m4 covers the gate half |
| B4, T-02 removed from the driver, `--only T-0` | 1 | `STATE SHEET: 14 renders, 0 with problems, 2 records with no state` and `INDEX  no state T-02 in the build, but quality/baseline/states/T-02-ink.json is committed` (and the dawn line) | closed | m6 as expected |
| S1, T-02's note at `opacity: 0` | 1 | `T-02  ink  ...  the visible text changed: "ample data. Sample data. Set up your" became "ample data. Weigh in before breakfas"; 24 text elements, the record ...` | closed | m7 as expected |
| S1 variant, the same note at `visibility: hidden` | 1 | the same two lines | closed | not in teeth |
| S1 on the gate, `#status-line` at `opacity: 0` | 1 | no contrast row at all, only the two regression rows: a colour nobody is shown is no longer measured | as specified | not in teeth |
| S2 and S3, only `T-02-ink.png` deleted | 1 | `no record at quality/baseline/states/T-02-ink.png; run "python quality/statesheet.py --accept" and commit it`, and the footer reads `clean:` with T-02 gone from it | both closed | not in teeth |
| S4, `statesheet.py --accept --only T-02` | 2 | `STATE SHEET: REFUSED. --accept writes every record and the index, so it cannot be combined with --only` | closed | not in teeth |
| S7, a refusal on an `--only` run | 2 | written to `states-report-T-02.txt`, the name the run would have used | closed | not in teeth |
| S8, the gate run from a directory named `a%41b` | 0 | `0 FAIL, 0 WARN, 58 PASS` with `fonts pinned by sha256` among the passes; side by side, the old double unquote resolves `/a%2541b/...` to `/aAb/...` and the new form to `/a%41b/...` | closed | not in teeth |
| S11, a 39 character sentence painted `var(--gold)` | 1 | `FAIL  contrast (measured behind the text)  dawn-today 393x852  status-line:Upper body today.  3.2 < 4.5`, 3 rows | closed | not in teeth |
| the 3 px shift against the rewritten records | 0 | `2 renders, 0 with problems`; `rect edge moved (px) 3.00 of 3.00`, `thumbnail mean shift 1.67 of 2.00`, `thumbnail pixels over 24 levels 0.47 of 1.00` | h1 still inside | h1 as expected |
| the 4 px shift | 1 | `rect edge moved (px) 4.00 of 3.00`, `thumbnail mean shift 2.19 of 2.00`: both halves cross together | the halves agree | not in teeth |
| the 60 px shift | 1 | `element 4 "Upper body today. Sample" top 172 became 232 ...`; `rect 60.00 of 3.00`, `thumbnail 8.54 of 2.00` | h2 still outside | h2 as expected |

`teeth.py` printed `TEETH: 26 rows, 0 disagreeing, 663 s`, exit 0, every row "as expected". Its
seven new rows m1 to m7 match my own results on the same changes; where I ran the full gate
rather than the narrowed one, I saw the named refusal plus the regression rows the narrowed run
drops, exactly as the new docstring now warns.

## The fresh mutations aimed at the new code

| what I did | exit | outcome |
|---|---|---|
| generated content built from a `counter()`, drawing `8 x 105` on the screen | 1 | **slipped on the rule**: no copy row and no multiplication sign row; the run failed on fits and regression only. SHOULD FIX 1. |
| generated content built from `attr()`, carrying the three faults | 1 | caught: copy and the multiplication sign, 6 rows each |
| an animation on a pseudo element whose content comes from `attr()` | 1 | caught: `animation status-line::after` on all 8 rows, plus `nothing moves except the embers  ink-today  128 px moved` and the reduced motion row |
| an animation on a pseudo element with no `content` | 0 | correctly not flagged: it draws no box and nothing moved |
| a placeholder with the three faults on the coach text input while it is `hidden` | 0 | correct scoping: the gate cannot see it, and the state that reveals it (C-06) FAILs on the sheet |
| the same placeholder with the block made visible | 1 | caught on the workout screen: copy, the multiplication sign, contrast and fits |
| an ancestor at `opacity: 0.01` | 1 | caught by both gates: contrast 1.0 to 1.1 against a 4.5 need, thumbnail 2.19 |
| an index entry for a theme that no longer renders (`sepia` added to T-02) | 0 | **slipped**: the index is compared by id only. SHOULD FIX 3. |
| an index entry that lost a theme the build renders (`dawn` removed from T-02) | 0 | **slipped**, same cause |
| a state in the build with no index entry (T-04 removed from `INDEX.json`) | 1 | caught: `state T-04 is in the build but not in quality/baseline/states/INDEX.json; run "python quality/statesheet.py --accept" and commit it` |
| `INDEX.json` deleted | 1 | caught: `no index at quality/baseline/states/INDEX.json; run "python quality/statesheet.py --accept" and commit it` |
| T-02's note at `color: transparent` | 1 | caught: the record's colour comparison in both themes, and contrast in Ink |
| T-02's note at `clip-path: inset(100%)` | 0 | **slipped**. SHOULD FIX 2. |
| T-02's note at `text-indent: -9999px` | 0 | **slipped**, same cause |
| T-02's note at `font-size: 0` | 1 | caught on size and on the geometry it moved |
| one word of a card title wrapped in a span | 0 on T-02 (the driver rewrites that line), and `JS_RECORD` returns `Weigh in before . breakfast` where the screen reads `Weigh in before breakfast.` | evidence for SHOULD FIX 6 |

## The eight documentation mismatches from R1

1. **WARN in three places.** Fixed and verified by execution and by grep: the code has exactly
   two `WARN` sites, `gate.py:493` (type scale) and `gate.py:524` (spacing scale). The streak
   check is now `rec('FAIL' if vs > 0.9 else 'PASS', ...)` with the detail line carrying the
   limit. `README.md:117`, `STANDARD.md:53` and `STANDARD.md:110` all say two, and
   `STANDARD.md:148` now reads "FAIL over 0.9, PASS otherwise".
2. **The rasterisation claim.** Fixed. `README.md:141` now separates the parts of the record that
   do not depend on rasterisation from the thumbnail that does, quotes my two measurements
   (0.73 of 2.00, and 1.67 of 2.00 at 3 px) and points at the new "worst measured" block, which I
   confirmed prints real numbers on every run.
3. **"The two font checks" at three sizes.** Fixed: `README.md:192` now says the face check runs
   at the three sizes and "The sha256 pin runs once for the build, not per size", which matches
   `report.json` (one row) and `STANDARD.md:146`.
4. **The missing comma in the shared columns tag.** Fixed, `STANDARD.md:13`.
5. **The missing comma in the serif tag.** Fixed, `STANDARD.md:22`.
6. **The bottom safe area wording.** Fixed in both places, `STANDARD.md:18` and `:133`, and it
   now says plainly that a real device's larger inset is not measured here.
7. **209 against 205.** Addressed, but the new clause has the wrong numbers. SHOULD FIX 4.
8. **The package's stale `head`.** Fixed: it is now an object carrying the commit the package was
   written at and a note that the package's own commit is its child.

I also re-checked what R1 verified and the fix round could have broken. The three tolerance
sentences still appear verbatim once in the code and once in README section 3, including the
revised contrast sentence, which changed in `common.py`, in README and in the package's
`tolerances` block together. STANDARD.md section 13's table is still exactly the 32 check names
the code emits, with nothing in the table missing from the code and nothing in the code missing
from the table, over 354 rows. Every sha256 in the package verifies, including the rewritten
`README.md`, `STANDARD.md`, `common.py`, `gate.py`, `statesheet.py` and `teeth.py`, the 837 file
manifest of `quality/baseline/states/` (1,005,460 bytes) and the digest of my own R1 review file.
There is still no `/usr`, `/tmp`, `/home` or drive letter in any of the five scripts outside the
shebangs, and `quality/run/` is still untracked with no report committed.

## Exact commands used

    git log --oneline e0a6c8ef..HEAD
    git diff e7d7d536 HEAD --stat
    git diff e0a6c8ef HEAD -- rebuild/m1/approved-2026-09-18/app        # 0 lines
    git diff e7d7d536 HEAD -- .../quality/common.py .../quality/gate.py
    git diff e7d7d536 HEAD -- .../quality/statesheet.py .../quality/teeth.py
    git diff e7d7d536 HEAD -- .../README.md .../quality/STANDARD.md

From `rebuild/m1/approved-2026-09-18`, on the committed tree:

    python3 quality/gate.py          ; echo $?    # 0 FAIL, 0 WARN, 354 PASS   exit 0   112 s
    python3 quality/statesheet.py    ; echo $?    # 418 renders, 0 with problems  exit 0  841 s
    python3 quality/teeth.py         ; echo $?    # 26 rows, 0 disagreeing, 663 s  exit 0

In the scratch copy, one row per invocation of my own driver (it makes a fresh copy of the pack,
applies exactly one change, runs the copy's own script and prints the exit code and every report
file the run wrote; it does not import or call `teeth.py`):

    python3 mut.py none none-sheet
    python3 mut.py r4 r5s r6 r7 r8          # the blocking four on the sheet
    python3 mut.py s2 s4 s7 n4 n5 n5b n6 n7 n8
    python3 mut.py none r1 r2 r3            # the blocking four on the gate
    python3 mut.py r5 r8b s11 n1
    python3 mut.py n2 n3 n3b
    python3 mut.py n4b n9

and, by hand in their own scratch copies: the 3, 4 and 60 px shifts judged against the rewritten
records; the coach placeholder judged by `statesheet.py --only C-06`; the gate run from a
directory named `a%41b`; a pseudo element carrying an animation with no `content`; the three
further ways of hiding text (`clip-path: inset(100%)`, `text-indent: -9999px`, `font-size: 0`);
one word of a card title wrapped in a span, read back through `JS_RECORD` in a browser;
`python3 quality/phonesheet.py --state T-40`.

Environment as in R1: Linux 6.18.44-fc-v37, Python 3.11.15, numpy 2.4.4, Pillow 12.2.0,
playwright 1.56.0, Chromium 141.0.7390.37, two cores.
