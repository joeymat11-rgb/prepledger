# C-UI-0 review R3: ACCEPT WITH NOTES, 0 blocking

Independent reviewer, third round, 2026-09-19. Branch `rebuild/c-ui-0-gates`, delta
`aadd2e5..f543489` (ten commits, HEAD `f543489`), in a clone of my own taken from the builder's
worktree and checked out at that commit. Same method as R1 and R2: a fresh `cp -r` of
`rebuild/m1/approved-2026-09-18/` per row into the session scratchpad, exactly one change per
copy, the copy's own `gate.py` and `statesheet.py`, never `teeth.py` on its own. `teeth.py` was
run once, whole, afterwards and its table is printed beside mine. Nothing in my clone was
modified except this file, and nothing in the builder's clone was touched at all.

## Summary

I could reproduce the whole of R3 on Linux and I could not break it. The three full runs on the
final tree came back `EARNED UI GATE: 0 FAIL, 0 WARN, 372 PASS` at exit 0 in 113 s,
`STATE SHEET: 418 renders, 0 with problems` at exit 0 in 890 s with a worst measured block
reading `none measured: nothing moved in 418 renders`, and `TEETH: 33 rows, 0 disagreeing, 705 s`
at exit 0. `phonesheet.py --state T-14` exits 0. That second line is the claim that matters: the
shared JSON records were written by `--accept` on the owner's Windows PC and every rect edge of
every element of all 418 renders came back 0.00 px of the 3 allowed and every colour 0.00 of 3 on
this machine. The platform difference consumes none of the rect tolerance and none of the colour
tolerance. C1 to C8 are true as far as Linux can judge them, and the one claim I could test two
ways, C4, is true to the decimal: with the `.link` line taken back out, T-88's Cancel link
measures 43.734375 px wide by 44 px high, with it in place 44 by 44, and a full 418 render sheet
of the reverted tree reports exactly two problems, `T-88 ink` and `T-88 dawn`,
`targets: link 44x44`, with `none measured: nothing moved in 418 renders` beside them. One line
of CSS, two report rows, nothing else in 418 renders either way.

All 16 rows of the audit table plus the lane's k1 to k3, review R1's m1 to m7, review R2's n1 to
n5 and this round's p1 and p2 behaved by hand exactly as the package says: the right check name,
the right words, exit 1 or exit 2 as the ticket requires, h1 passing as it should, a report
written on every non zero exit and no traceback anywhere. Every sha256 in the package verifies
(38 of them, including the 1256 file manifest of `quality/baseline/states/` at 1,397,204 bytes),
`report.json` carries exactly 372 rows over 33 distinct check names and those names are exactly
the 33 rows of STANDARD.md section 13, `quality/run/` is untracked with no report committed, and
nothing R3 added carries a U+2013, a U+2014, a hyphen with a space each side, a word off the
owner's word list, a vendor name or an absolute path. I re-derived Q10's list from the records
myself and it is right to the pixel: eight states changed line count, T-14 is the only one that
gained one, and no record's text string changed at all.

What I would still fix is below. The largest item is not a defect in the code: it is that one
line under `app/` was ruled by the lane lead under an item whose own words ask for the boards,
and the boards have not spoken. The technical case for it is proved; the authority for it is what
I am handing up. After that, the per platform thumbnail split is not enforced by anything: I
copied the committed win32 thumbnails into `quality/baseline/states/linux/` and the sheet stayed
green at 0.85 of the 2.00 budget, which is review R2's Q8 grown from six files to 418 per
platform. Neither is blocking by the standing definition, and each has a small fix.

## BLOCKING

None. Nothing I built this round is a forbidden change passing green on a rule the standard
states, a crash instead of a report, a wrong exit code, a tolerance or platform claim the code
does not implement, or a path that breaks on Windows. The four R1 raised stay closed, and so do
the six notes R2 left: I rebuilt m1 to m7 and n1 to n5 by hand and every one of them still
refuses.

## SHOULD FIX

1. **The one line under `app/` was ruled by the lane lead, and ticket item 16 asks for the
   boards.** `rebuild/m1/approved-2026-09-18/app/app.css:202`. I have no technical objection: I
   measured the defect (43.734375 px wide against the owner's standing 44 px rule), I measured the
   fix (44.0), and I proved by a full 418 render sheet of the reverted tree that the line moves
   nothing either gate records and closes exactly the two rows it claims to close. The objection
   is procedural and it is not mine to settle. Item 16's exception is "a one line copy or
   attribute fix that the boards agree with, and then say so". This is a CSS declaration, which is
   neither copy nor an attribute, and the agreement on record is the lane lead's ruling, quoted in
   the package's `locked` object and in README section 3.1, not the boards'. The ticket's opening
   paragraph is also flat: "Nothing on this branch touches `app/`; the pack's prototype is the
   fixed target the gates are proved against." Two honest ways out: the PM or the owner ratifies
   the line and the package records who ratified it, or the line comes out and T-88 becomes an
   open question beside Q10, which is what item 16's default branch says. The round does say it
   out loud in four places, which is the part of item 16 it does satisfy.
2. **A platform's thumbnail directory is trusted on its name alone.** I copied the committed
   `quality/baseline/states/win32/T-02-ink.png` and `T-02-dawn.png` over this platform's own and
   the sheet reported `2 renders, 0 with problems`, exit 0, `thumbnail mean shift 0.85 of 2.00`.
   Measured over all 418 pairs of committed thumbnails, the two platforms differ by at most 1.26
   levels (C-63 ink), median 0.20, and not one pair reaches either half of the tolerance, so a
   whole wrong platform's set fits inside it with room to spare. The `ENV.txt` beside them is not
   read by anything: I rewrote its `launch:` line to claim the hinting argument was absent and the
   run stayed green at exit 0. This is R2's Q8 with the surface multiplied from six files to 418
   per platform, so it deserves its own sentence in the package rather than inheriting Q8's. The
   cheap guard is the one R2 declined for the screen baselines, and it is cheaper here: an
   advisory line in the worst measured block giving this platform's distance from the other
   committed platforms' thumbnails, which would have printed 0.85 on my mutation and 0.00 on a
   clean run.
3. **The worst measured block no longer carries cross platform information about the raster
   half.** README section 3.1 says the block exists "so a run on a second machine reports its
   headroom in numbers rather than a bare verdict". After the split, a second machine compares its
   thumbnails against its own thumbnails, so the two thumbnail rows print 0.00 by construction,
   which is exactly what my clean full run printed. The number that matters, the 1.26 of 2.00
   between the two machines, is no longer produced by any run on any platform: I had to compute it
   by hand from the two committed sets. Either add the advisory line of item 2, or say in README
   3.1 that the block's two thumbnail rows are within platform only.
4. **Teeth row p1 is narrowed to the state where the mutation is weakest.** The row runs
   `statesheet.py --only T-02`, where taking the hinting argument out moves one element by 4 px
   against a 3 px tolerance, a margin of one pixel, and the thumbnail half does not fire at all
   (`thumbnail mean shift 0.37 of 2.00`). The round's own evidence names a state where the same
   mutation moves a rect by 170 px (T-84 ink, element 10). Point p1 at that state, or at `T-8`,
   and the row stops depending on a single pixel of headroom. Worth adding beside it: the same
   mutation is caught far more loudly by the other gate, which no row records. My own run of
   `gate.py --screens today --sizes 393x852` with the argument removed came back
   `2 FAIL, 0 WARN, 58 PASS`, `visual regression vs baseline ink-today 393x852 5.532% of pixels
   changed, mean shift 4.345 rows 24 to 809`.
5. **`teeth.py`'s `sub()` cannot match an anchor that spans a line ending in a file that is CRLF
   on disk.** Reported to me from a run of the R3 code on the owner's Windows PC, not executed by
   me: rows n4 and n5
   came back VOID with `INDEX.json: the anchor matched 0 times` because the `INDEX.json` sitting
   in the owner's working tree had been written CRLF by a pre R3 accept run in text mode, while
   git holds it as LF, so `git status` is clean and nothing looks wrong. I checked the exposure by
   reading: `sub()` opens with `newline=''`, which preserves CRLF, and four rows carry an anchor
   that spans a newline, k1, m6, n4 and n5, so the same condition on `app/app.html` or
   `app/states-today.js` would void k1 and m6 as well. Three things keep it out of the blocking
   list: the repository's own `.gitattributes` is `* text=auto eol=lf`, so a fresh checkout on
   Windows gets LF; R3's own `newline='\n'` change is what stops an accept run reintroducing it,
   and the lead's owed accept run clears the file that is stale today; and a VOID row prints the
   reason and exits 1 rather than passing, so the mutation list refuses to certify itself instead
   of quietly losing two teeth. Still worth one line: in `sub()`, when the anchor does not match,
   retry against the text with `\r\n` folded to `\n` and write the result back in the file's own
   line ending, which keeps the R2 behaviour the comment promises.
6. **README section 3.1 quotes 1.67 for the h1 thumbnail and the final tree prints 1.66.** The
   sentence is "the 3 px shift `teeth.py` row h1 must PASS measures 1.67 on the machine that drew
   the thumbnails". 1.67 is review R2's measurement against the shared thumbnails that R3 replaced;
   against the thumbnails `--accept-thumbs` wrote on this machine my run prints
   `thumbnail mean shift 1.66 of 2.00`. One digit, but it is a number quoted as reproducible on
   the machine of record and it is not.
7. **`targets: link 44x44` rounds away the number that failed.** `quality/statesheet.py:83` pushes
   `Math.round(w) + 'x' + Math.round(h)` after testing `h < 44 || w < 44`, so the one real defect
   the round found reads as a 44 by 44 target failing a 44 px rule. It is not an R3 regression, but
   README section 3.1 and the package now quote that exact line as the evidence for changing
   `app/`, which makes it worth two decimal places or a "(43.73)" beside it.

## NOTES

**The headroom, which is the question the round turns on.** Against records written by `--accept`
on the owner's PC, judged here: rect edge 0.00 px of 3.00 and colour 0.00 levels of 3.00 on every
element of every one of 418 renders. So the platform difference consumes none of either tolerance,
and both halves of R2's tolerance pair still agree on these records: 3 px passes at
`rect edge moved (px) 3.00 of 3.00` with `thumbnail mean shift 1.66 of 2.00`, 4 px fails both
halves together at `4.00 of 3.00` and `2.21 of 2.00`, and 60 px fails at `60.00 of 3.00` and
`8.51 of 2.00`. The answer does not depend on which platform wrote the records for the rect half,
because the difference is exactly zero. It does for the thumbnail half, and that is the whole
reason the round split the thumbnails: 1.26 of the 2.00 budget goes to rasterisation alone, and
h1 needs 1.66 of it, so a Linux run judged against win32 drawn thumbnails could not keep h1
passing. Two things follow that the package does not say. First, the split is conservative rather
than forced: not one of the 418 committed thumbnail pairs reaches the 2.00 mean or the 1% over 24
levels, so the shared thumbnail would have held for the prototype itself; what it would not have
held is the teeth row. Second, h1 now passes with exactly zero headroom on the rect half, 3.00 of
3.00, so any future machine that moves one rect by a single pixel turns the row that must PASS
into a FAIL. That is a property of choosing the shift to sit on the boundary, not of this round,
but the second auditor should know the row is one pixel from flipping.

**The launch list.** There are exactly three `launch(` calls in the pack, `gate.py:349`,
`statesheet.py:309` and `phonesheet.py:38`, and all three pass `LAUNCH_ARGS` and nothing else. No
other code path opens a browser. `teeth.py` opens none of its own; it runs the scratch copy's
scripts as subprocesses, so a row is judged by the copy's own launch list, which is what makes p1
meaningful.

**The index `env`, judged by execution.** `index_problems()` reads `states` and nothing else, and
I proved it two ways: I wrote a nonsense `env` into `INDEX.json` (`Plan 9`, `launch: --nonsense`)
and the run came back `2 renders, 0 with problems`, exit 0; then I wrote a plausible lie, an `env`
claiming the shared records were written on the other platform with the hinting argument absent,
and again `2 renders, 0 with problems`, exit 0. It is provenance, exactly as the docstring and
README say, and no hand edit of it turns anything green or red. The committed `INDEX.json` has no
`env` key today, which matches what the round declares it owes.

**The missing thumbnail FAIL.** Deleting one thumbnail gives `2 renders, 1 with problems` and
`no thumbnail at quality/baseline/states/linux/T-02-ink.png; run "python quality/statesheet.py
--accept-thumbs" on the machine of record, then commit it`, exit 1. Deleting the whole platform
directory gives two such lines, one per theme, each naming its own file. The missing shared record
keeps its own separate line and its own remedy. A platform that has never run gets 418 FAILs and
no silent set, which is the shape the ticket asks for. The path in the line is normalised to
forward slashes by `rel()` in both gates, so it reads the same on Windows.

**The two new refusals.** `--accept-thumbs --only T-02` exits 2 with
`STATE SHEET: REFUSED. --accept-thumbs writes every thumbnail this platform has, so it cannot be
combined with --only`, and `--accept --accept-thumbs` exits 2 with
`STATE SHEET: REFUSED. --accept already writes this platform's thumbnails, so --accept-thumbs
cannot be combined with it`. Both write the refusal to the report file the run would have used.

**The p1 row on a platform that does not hint.** I ran the row from a scratch copy of `teeth.py`
whose `HINTED` list was flipped to the other platform. It printed
`p1 ... as expected  glyphs are not hinted on linux, so taking the argument out of the launch
list moves nothing here and this row cannot fail; it is a row of the platforms that hint`, exit 0,
and launched no browser. So the branch behaves as C5 claims. The cost is that the table on a non
hinting platform still reads `33 rows, 0 disagreeing` while one of the 33 ran nothing; the note
column says so on the row, which I think is the right trade, but the second auditor should read
the note column rather than the count.

**Q10, re-derived.** I read all 418 records at `ee1f191` and at `ecbef86` with `git show` and
compared them element by element. Every one of the 418 has at least one element that moved; not
one has a changed `text` string; and the elements whose recorded height moved by 12 px or more are
exactly the eight states the package lists, with exactly the heights it gives: T-14 element 9
17 to 34, C-28 element 3 81 to 61, C-37 element 3 41 to 20, C-47 element 3 81 to 61, T-71 element
3 36 to 17, T-72 element 4 93 to 74, T-84 element 10 36 to 17, W-19 element 10 38 to 19, each in
both themes. T-14 is the only state that gained a line. The question is correctly filed for the
boards: the unhinted layout is what every real device draws, and the boards were shown the hinted
one.

**A raster only change is thinly held.** A `text-shadow` on T-02's sample note, which moves no
rect and changes no computed colour, is caught in Dawn by the contrast check at
`contrast: note-block sample:Sample data. Set u 1.3 < 3.0` and not at all in Ink, and the
thumbnail measures only 0.47 of 2.00. That is not new in R3, but it is the surface `--accept-thumbs`
now sits on, so it is worth stating beside item 2 above.

**Counts and documents.** `report.json` from my own clean run is 372 rows, all PASS, over 33
distinct check names; STANDARD.md section 13's table is 33 rows and the two sets match exactly in
both directions. `INDEX.json` carries 209 states, 99 today, 45 workout, 65 coach, with eight
suffixed variants (T-40b to T-40h and C-50b) over 201 distinct base ids, and T-01, T-34, T-35 and
C-01 are the four nominal inventory rows with nothing drawn, so README section 1's arithmetic is
right. `quality/baseline/states/` is 1256 files and 1,397,204 bytes, 1.397 MB, split 419 shared,
418 win32 thumbnails and 419 linux thumbnails, and the manifest digest in the package matches the
form the package describes. The three tolerance sentences each appear once in the code and once in
README section 3.1, word for word. All 38 sha256 values in the package verify against my clone.

**Hygiene.** Over the 994 lines R3 adds to the pack, the package and `.gitignore`, and over all
ten commit messages: no U+2013, no U+2014, no hyphen with a space on each side, no word off the
owner's list, no vendor name outside the `Co-Authored-By` trailer, no absolute path and no drive
letter. The one hit for a hyphen between two spaces is a subtraction inside a numpy expression in
`statesheet.py`, which is arithmetic. No `/usr`, `/tmp`,
`/home` or drive letter appears in any of the five scripts outside the shebangs. `quality/run/` is
gitignored and no file under it is tracked.

## What I did not execute

- **Anything on Windows.** There is no Windows machine in my sandbox. Everything above is Linux.
  The Windows halves of C1 ("on Windows the argument changes nothing"), C3 (the `--accept` run
  that wrote the shared records) and the committed win32 thumbnails are taken on the round's word,
  as is the lane lead's red run that started R3. I was told, and did not verify, that a helper ran
  the R3 code on the owner's PC with the files verified by sha256: gate 372 PASS exit 0, full
  sheet 418 renders 0 problems exit 0, accept runs writing LF with an `env` object and byte
  identical records, and `teeth.py` 33 rows with n4 and n5 VOID for the CRLF reason in SHOULD FIX
  5. If that report holds, it closes the platform claim from the other side; I judge only my own
  side of it.
- **`--accept-thumbs` writing nothing on an unclean run.** I ran it, and the result is in the
  fresh mutation table below; it is the one row I could not narrow, because `--accept-thumbs`
  refuses `--only` by design.
- **`--accept-thumbs` laundering a raster only change on a clean run.** I did not run the 15
  minute full sheet for it. By reading, a `text-shadow` change that moves no rect and no colour
  leaves every row clean and the run would then write this platform's thumbnails over the record
  of the change. That is the same authority `--accept` already has and the report labels itself,
  so I do not call it a hole, but it is untested by me.
- **A full `statesheet.py --accept`.** Fourteen minutes of writing all 419 shared files from the
  wrong machine, which the round explicitly does not want done from Linux.
- **The 3 px thumbnail figure on a second machine**, for the same reason as the first item.

## The rows I re-ran, mine beside teeth.py's

Mine: a fresh copy of the pack per row, one change, the copy's own script. Where I narrowed I say
so in the command column; the gate rows are narrowed the way `teeth.py` narrows them, with
`--screens` and `--sizes`, and I ran the full `gate.py` on the unmutated tree to hold the baseline.
Lines are quoted from the report the run wrote.

| what I did | how I ran it | my exit | the line the report carried | verdict | teeth.py row |
|---|---|---|---|---|---|
| control, gate | full | 0 | `EARNED UI GATE: 0 FAIL, 0 WARN, 372 PASS`, 113 s | clean | baseline |
| control, gate | `--screens today --sizes 393x852` | 0 | `0 FAIL, 0 WARN, 60 PASS` | clean | baseline |
| control, sheet | full | 0 | `STATE SHEET: 418 renders, 0 with problems`, 890 s, `none measured: nothing moved in 418 renders` | clean | baseline |
| control, sheet | `--only T-02` | 0 | `2 renders, 0 with problems` | clean | baseline |
| a, a U+2014 in Today's status sentence | narrowed gate | 1 | `FAIL  copy: no dashes, readiness words, vendor names  ink-today 393x852  '<U+2014>'`, both themes, plus two regression rows | refuses | a as expected |
| b1, a word off the owner's list | narrowed gate | 1 | the same check, `'ready'`, both themes, plus two regression rows | refuses | b1 as expected |
| b2, a vendor name | narrowed gate | 1 | the same check, `'<the lowered vendor name>'`, both themes | refuses | b2 as expected |
| c, the sans face pointed at the serif file | narrowed gate | 1 | `FAIL  fonts pinned by sha256  the build  Earned Sans: earned-serif.woff2 is ff90213df9f50596, pinned c04be0b43dc3911d` and `serif and sans faces loaded and distinct ... one face is pointed at the other file` | refuses on both counts | c as expected |
| d-1, `#start` pushed 620 px down | narrowed gate | 1 | `FAIL  primary action in first viewport  ink-today 393x852  #start bottom 1321 > 852` and `pressed state on every tappable surface  #start (outside the viewport at 22,1261)`, report written, no traceback | refuses | d-1 as expected |
| d-2, the same at the two small sizes | `--sizes 375x812,360x780` | 1 | `#start bottom 861 > 812` and `#start bottom 829 > 780`, four rows | refuses | d-2 as expected |
| e1, primary text between 3.0 and 4.5 | narrowed gate | 1 | `FAIL  contrast (measured behind the text)  dawn-today 393x852  status-line:Upper body today.  3.2 < 4.5, title:... 3.4 < 4.5` | refuses in the upper tier | e1 as expected |
| e2, the same text under 3.0 | narrowed gate | 1 | the same check at `2.1 < 4.5` and `2.0 < 4.5` | refuses | e2 as expected |
| f, a keyframe animation on `#start` | narrowed gate | 1 | `no transitions or animations outside the embers ... animation start` on all four rows including both `nopref`, plus `nothing moves except the embers  ink-today  20510 px moved` and `nothing moves under reduced motion  20587 px moved` | refuses | f as expected |
| g, one word of T-02's copy | `--only T-02` | 1 | `the visible text changed: "ample data. Sample data. Set up your" became "ample data. Example data. Set up you"; element 5 text ...` | refuses | g as expected |
| g2, a U+2014 inside the same copy | `--only T-02` | 1 | `copy: '<U+2014>'; the visible text changed ...` | refuses | g2 as expected |
| h1, T-02's status line shifted 3 px | `--only T-02` | 0 | `2 renders, 0 with problems`; `rect edge moved (px) 3.00 of 3.00`, `thumbnail mean shift 1.66 of 2.00`, `thumbnail pixels over 24 levels 0.47 of 1.00` | inside, as it should be | h1 as expected |
| the same shifted 4 px | `--only T-02` | 1 | `rect edge moved (px) 4.00 of 3.00`, `thumbnail mean shift 2.21 of 2.00` | both halves cross together | not in teeth |
| h2, the same shifted 60 px | `--only T-02` | 1 | `element 4 "Upper body today. Sample" top 172 became 232 ...`; `60.00 of 3.00`, `8.51 of 2.00` | refuses | h2 as expected |
| i, this platform's `ink-today` baseline deleted | narrowed gate | 1 | `FAIL  visual regression vs baseline  ink-today 393x852  no baseline at quality/baseline/linux/ink-today.png; run "python quality/gate.py --accept" on the machine of record, then commit it` | refuses, no self heal | i as expected |
| j1, `EARNED_APP` at an empty folder | narrowed gate | 2 | `EARNED UI GATE: REFUSED. file:///.../empty/ has no ".screen.is-active .ui" element (theme=ink, screen=today)`, one line, no traceback | refuses cleanly | j1 as expected |
| j2, `EARNED_APP` at `app/compare.html` | narrowed gate | 2 | the same one line naming `compare.html` | refuses cleanly | j2 as expected |
| k1, one RIR chip dropped | `--screens workout` | 1 | `FAIL  RIR chips are the five locked values  ink-workout 393x852  [('0','0'),('2','2'),('3+','3+'),('unsure','Unsure')] is not [('0','0'),('1','1'),...]` | refuses | k1 as expected |
| k2, a serif element switched to sans | `--screens workout` | 1 | `serif and sans faces loaded and distinct ... .screen-title resolves to Earned Sans, not Earned Serif` and `serif for names and numbers, sans for the rest ... .screen-title is Earned Sans` | refuses on both | k2 as expected |
| k3, a card 6 px off the margin | narrowed gate | 1 | `FAIL  page margin 22 px  ink-today 393x852  card-eat left 28` | refuses | k3 as expected |
| m1, a 4 px dot pulsing on a pseudo element | narrowed gate | 1 | `no transitions or animations outside the embers ... animation card-eat::after`, four rows including both `nopref` | still closed | m1 as expected |
| m2, a transition on a pseudo element | narrowed gate | 1 | the same check, `transition start::after`, four rows | still closed | m2 as expected |
| m3, three faults in a placeholder, gate | narrowed gate | 1 | `copy: ... 'ready', '<the lowered vendor name>'` and `the multiplication sign in every set string ... '8 x 1'`, both themes | still closed | m3 as expected |
| m4, the same faults in generated content | narrowed gate | 1 | the same two checks, plus `fits without scrolling at 393x852  660 > 641` and two regression rows | still closed | m4 as expected |
| m5, the placeholder judged by the sheet | `--only T-02` | 1 | `T-02  ink  ...  copy: 'ready', '<the lowered vendor name>'; set written with the letter x: '8 x 1'` | still closed | m5 as expected |
| m6, T-02 dropped from the driver | `--only T-0` | 1 | `14 renders, 0 with problems, 2 records with no state` and `INDEX  no state T-02 in the build, but quality/baseline/states/T-02-ink.json is committed`, and the dawn line | still closed | m6 as expected |
| m7, T-02's note at `opacity: 0` | `--only T-02` | 1 | `the visible text changed ...; 24 text elements, the record has 25; element 5 text ...` | still closed | m7 as expected |
| n1, a set string drawn by `counter()` | narrowed gate | 1 | `FAIL  generated content the sweep cannot read  ink-today 393x852  status-line::after " " counter(revx) " x 105"` | closed as R2 specified | n1 as expected |
| n2, the note at `clip-path: inset(100%)` | `--only T-02` | 1 | `the visible text changed ...; 24 text elements, the record has 25` | closed | n2 as expected |
| n3, the note at `text-indent: -9999px` | `--only T-02` | 1 | the same two lines | closed | n3 as expected |
| n4, a theme in the index the sheet does not render | `--only T-02` | 1 | `2 renders, 0 with problems, 1 records with no state` and `INDEX  the index records T-02 in theme sepia, which the sheet does not render` | closed | n4 as expected |
| n5, a theme the index lost | `--only T-02` | 1 | `INDEX  T-02 theme dawn is in the build but not in quality/baseline/states/INDEX.json; run "python quality/statesheet.py --accept" and commit it` | closed | n5 as expected |
| p1, the hinting argument out of the launch list | `--only T-02` | 1 | `T-02  ink  ...  element 1 "Wed, Sep 16" left 228 became 224`; `rect edge moved (px) 4.00 of 3.00`, thumbnail only `0.37 of 2.00` | refuses, by one pixel | p1 as expected |
| p1 on the other gate | narrowed gate | 1 | `2 FAIL, 0 WARN, 58 PASS`, `visual regression vs baseline  ink-today 393x852  5.532% of pixels changed, mean shift 4.345 rows 24 to 809` | refuses far more loudly | not in teeth |
| p2, this platform's T-02 ink thumbnail deleted | `--only T-02` | 1 | `no thumbnail at quality/baseline/states/linux/T-02-ink.png; run "python quality/statesheet.py --accept-thumbs" on the machine of record, then commit it` | refuses, names the path | p2 as expected |

`teeth.py` printed `TEETH: 33 rows, 0 disagreeing, 705 s`, exit 0, every row "as expected". Its 33
rows match my own results on the same changes. Where I ran the wider gate rather than the narrowed
one I saw the named refusal plus the regression rows the narrowed run drops, exactly as the
docstring warns, so the teeth table understates how loudly each mutation is refused, not how
quietly.

## The fresh mutations aimed at the new code

| what I did | how I ran it | exit | outcome |
|---|---|---|---|
| this platform's whole thumbnail directory deleted | `--only T-02` | 1 | caught: one line per render, each naming its own missing file and the `--accept-thumbs` remedy. A platform that has never run gets 418 of these, no silent set |
| the committed win32 thumbnails for T-02 copied over this platform's | `--only T-02` | 0 | **slipped**: `2 renders, 0 with problems`, `thumbnail mean shift 0.85 of 2.00`. SHOULD FIX 2 |
| the `launch:` line in `quality/baseline/states/linux/ENV.txt` rewritten to drop the hinting argument | `--only T-02` | 0 | **slipped**, and correctly so by the round's own words: nothing reads an `ENV.txt`. It is documentation, not a check, which is worth saying because README now puts the launch list in it |
| a nonsense `env` object written into `INDEX.json` | `--only T-02` | 0 | ignored, as documented: `2 renders, 0 with problems` |
| an `env` object that lies about the machine and the launch list | `--only T-02` | 0 | ignored, same. No hand edit of `env` turns anything green or red |
| `--accept-thumbs --only T-02` | as written | 2 | refused in one line, report written |
| `--accept --accept-thumbs` | as written | 2 | refused in one line, report written |
| a `text-shadow` on T-02's note, which moves no rect and no colour | `--only T-02` | 1 | caught in Dawn only, by contrast at `1.3 < 3.0`; the thumbnail measured 0.47 of 2.00 and Ink was clean |
| `--accept-thumbs` on a tree with a 60 px shift in it | full, 418 renders, 914 s | 1 | **the guard holds**: `ACCEPT THUMBS RUN: every record compared except its thumbnail, which this run did not write, because the run is not clean`, then `STATE SHEET: 418 renders, 112 with problems` with no `SET` in the head line, and afterwards all 419 files under `quality/baseline/states/linux/`, `ENV.txt` included, were byte identical to the committed ones |
| the one line under `app/` taken back out, judged by the full sheet | full, 418 renders | 1 | `418 renders, 2 with problems`, `T-88 ink` and `T-88 dawn`, `targets: link 44x44`, and `none measured: nothing moved in 418 renders`. The line closes exactly two rows and moves nothing in the other 416 renders |
| the same tree measured in a browser | one page each | n/a | T-88's Cancel link is `w=43.734375 h=44` without the line and `w=44 h=44` with it; the other `.link` boxes that are drawn at all (T-02's `Why 105 lb?` at 72.95 and `Plans changed?` at 134.47) are unchanged, being already wider than 44 |
| `teeth.py` row p1 with `HINTED` flipped in a scratch copy | `--only p1` | 0 | the not applicable branch runs: the row is printed with `glyphs are not hinted on linux, so taking the argument out of the launch list moves nothing here and this row cannot fail`, counted as expected, no browser launched |
| the two committed thumbnail sets compared to each other, 418 pairs | no browser | n/a | worst mean shift 1.26 (C-63 ink), median 0.20, none at or over the 2.00 mean, none at or over the 1% over 24 levels. The round's 1.26 reproduces exactly, and no render would have failed cross platform on the thumbnail alone |

## Exact commands used

    git clone <the builder's worktree> <my own clone>
    git checkout rebuild/c-ui-0-gates                 # f543489
    git log --oneline aadd2e5..HEAD                   # ten commits
    git diff aadd2e5 HEAD --stat
    git diff aadd2e5 HEAD -- .../quality/common.py .../quality/gate.py .../quality/phonesheet.py
    git diff aadd2e5 HEAD -- .../quality/statesheet.py .../quality/teeth.py
    git diff aadd2e5 HEAD -- .../README.md .../quality/STANDARD.md
    git diff aadd2e5 HEAD -- rebuild/lanes/c/ui-port/packages/C-UI-0.json
    git diff e0a6c8ef HEAD -- rebuild/m1/approved-2026-09-18/app     # 13 lines, one file, 1 added 1 removed

From `rebuild/m1/approved-2026-09-18`, on the committed tree:

    python3 quality/gate.py            ; echo $?   # 0 FAIL, 0 WARN, 372 PASS   exit 0   113 s
    python3 quality/statesheet.py      ; echo $?   # 418 renders, 0 with problems  exit 0  890 s
    python3 quality/teeth.py           ; echo $?   # 33 rows, 0 disagreeing, 705 s  exit 0
    python3 quality/phonesheet.py --state T-14     # exit 0

In scratch copies, one row per invocation of my own driver, which makes a fresh copy of the pack,
applies exactly one change, runs the copy's own script and prints the exit code and every report
the run wrote. It never imports or calls `teeth.py`:

    python3 mut.py none noneg
    python3 mut.py a b1 b2 c d1 d2 e1 e2 f i j1 j2 k1 k2 k3 p1g
    python3 mut.py g g2 h1 h4 h2 p1 p2
    python3 mut.py m1 m2 m3 m4 m5 m6 m7 n1 n2 n3 n4 n5
    python3 mut.py x1 x2 x3 x4 x6 x7 x8 x11          # the fresh rows at the new code
    python3 mut.py x9                                 # the app line reverted, full sheet
    python3 mut.py x5                                 # --accept-thumbs on an unclean tree, full

and, by hand in their own scratch copies: `teeth.py --only p1` with `HINTED` flipped; a browser
measurement of every `.link` box on T-88 and T-02 with and without the `app/` line, launched with
the pack's own `LAUNCH_ARGS`; the 418 way comparison of the two committed thumbnail sets; the
element by element comparison of all 418 records at `ee1f191` and `ecbef86`; the sha256 of every
file the package names and of the whole `quality/baseline/states/` manifest; and the hygiene greps
over the 994 added lines and the ten commit messages.

## Environment

Linux 6.18.44-fc-v37, Python 3.11.15, numpy, Pillow, playwright 1.56.0, Chromium 141.0.7390.37,
two cores. No Windows machine, no network. Runtimes here: gate 113 s full and 35 to 38 s narrowed
to one screen at one size, full state sheet 890 s, `--only T-0` 31 s, `--only T-02` 5 to 7 s,
`teeth.py` 705 s against the builder's 711 s, phone sheet 7 s for one state.
