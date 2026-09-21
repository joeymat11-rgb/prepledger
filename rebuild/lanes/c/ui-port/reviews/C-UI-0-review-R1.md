# C-UI-0 review R1: REJECT, 4 blocking

Independent reviewer, 2026-09-18. The worktree the ticket names, branch
`rebuild/c-ui-0-gates`, delta `e0a6c8ef..HEAD` (7 commits, HEAD 3baef85f). Nothing in the
worktree was modified except this file. Every mutation was executed by hand in a scratch copy of
`rebuild/m1/approved-2026-09-18/`, taken with `cp -r` into the session scratchpad the ticket
names, one at a time, with a fresh copy of the pack between rows. `quality/teeth.py` was run once,
separately, afterwards, and its table is printed beside mine.

## Summary

The builder's report is substantially true and I could reproduce all of it. `git diff e0a6c8ef
HEAD -- rebuild/m1/approved-2026-09-18/app` is empty, so the prototype is untouched. The gate
came back `EARNED UI GATE: 0 FAIL, 0 WARN, 354 PASS` at exit 0 in 121 s; the full state sheet
came back `STATE SHEET: 418 renders, 0 with problems` at exit 0 in 857 s; `teeth.py` came back
`TEETH: 19 rows, 0 disagreeing, 460 s` at exit 0. The report counts 32 distinct checks over 354
rows, exactly what README section 1 and STANDARD.md section 13 claim. Every sha256 in
`packages/C-UI-0.json` verifies, including the 836 file manifest of `quality/baseline/states/`
(986,461 bytes, 0.94 MB, inside the 3 MB budget). All 16 rows of the audit table plus the lane's
three behaved by hand exactly as the package says, with the right check name and the right reason,
exit 1 or exit 2 as the ticket says (h1 passing, as it should), no traceback anywhere, and a report
written on every exit 1 and every exit 2. The audit's four blocking findings and its five notes
are addressed: the word sweep matches on a real boundary, the fonts are pinned twice over,
regression FAILs and refuses to self heal, the state sheet compares and exits non zero, the 4.5:1
tier is reachable, the RIR lock exists, both sheets run with no hardcoded font path, and the three
crash paths refuse in one line. That is a large, honest piece of work and the mutation list is the right shape.

It is still a REJECT, on four things I found that the audit did not list and that the builder did
not test. Three of them let a change the design of record forbids pass with 0 FAIL, 0 WARN and
exit 0: a keyframe animation on a pseudo element (a 4 px dot pulsing for ever on Today), forbidden
copy written into a placeholder or into CSS generated content (a word off the owner's word list, a
vendor name and a set written with the letter x, all on screen, all invisible to both sweeps), and
a state deleted from the driver, which the sheet silently does not render while its two committed
records sit orphaned. The fourth is a WARN branch on the vertical streak check, which contradicts
acceptance item 15 in the ticket's own words, README section 3.1 and STANDARD.md section 13's own
header, and means a streak between 0.7 and 0.9 exits 0. Each has a small fix. None of them touches
`app/`. I also ran the full gate rather than the narrowed one for all 19 rows, which is the one
place I disagree with the package's own reasoning (Q7), and the full runs surfaced regression FAIL
rows the narrowed runs hide, so the teeth table understates how loudly each mutation is refused.

## BLOCKING

### B1. A CSS transition or keyframe animation on a pseudo element passes the gate green

`rebuild/m1/approved-2026-09-18/quality/gate.py:150` (the `JS_ANIM` script, used at `gate.py:442`
under reduced motion and again at `gate.py:368` with motion allowed).

What I did, in the scratch copy, on two separate rows. First `#start::after` given
`transition: opacity 0.6s ease`. Then, because a transition can be argued to be inert until
triggered, a real animation: a 4 px gold dot on `#card-eat::after` with
`animation: rev-blink 0.8s infinite alternate`, which pulses from opacity 1 to 0.08 for ever on
the Today screen in both themes.

What happened. Both runs: `EARNED UI GATE: 0 FAIL, 0 WARN, 354 PASS`, exit 0. Not one row moved.
The regression check did not fire either, because the dot is 16 px and the tolerance is 0.1% of
334,836 pixels; and the moving pixel check did not fire, because `gate.py:405` needs 20 changed
pixels and a 4 px dot is 16.

Why it violates the ticket. Acceptance item 12: "any CSS transition or animation on a non canvas
element FAILs under both settings". STANDARD.md section 5: "The only things that move are the
embers and the mist. No transitions, no pulsing, no parallax." STANDARD.md section 13 lists the
check as covering "a transition only disabled under reduced motion still fails". `JS_ANIM` reads
`getComputedStyle(e)` and never `getComputedStyle(e, '::before')` or `'::after'`, so the whole
pseudo element surface is outside the sweep. The pack's own design uses pseudo elements
(`.timeline::before` is named in `HIDE_TEXT_CSS` at `gate.py:123`, and `JS_SMALL` at `gate.py:145`
already reads `getComputedStyle(e,'::before')`), so this is a surface the port will use.

The fix I would demand. In `JS_ANIM`, for every element also read `getComputedStyle(e,'::before')`
and `getComputedStyle(e,'::after')` and apply the same two tests, reporting the pseudo in the
detail string (`animation card-eat::after`). `JS_SMALL` already shows the idiom. Add a row to
`teeth.py` for it.

### B2. Forbidden copy in a placeholder, or in CSS generated content, passes both copy sweeps

`rebuild/m1/approved-2026-09-18/quality/gate.py:148` (`JS_TEXT`, `ui.innerText`),
`rebuild/m1/approved-2026-09-18/quality/statesheet.py:68` (`JS_INFO`, `ui.innerText`),
`rebuild/m1/approved-2026-09-18/quality/common.py:19` (`copy_problems`).

What I did. Changed the one placeholder on Today, `app/app.html:44`, from `Your weight` to a
string carrying three faults at once: a word off the owner's word list, a vendor name, and a set
written as `8 x 105`. Separately, appended
`#status-line::after { content: " <the same three faults> "; }` to `app/app.css`.

What happened. Placeholder: the state sheet reported `STATE SHEET: 2 renders, 0 with problems`,
exit 0. The gate reported 2 FAIL and exit 1, but both FAIL rows were `visual regression vs
baseline`; no copy row and no multiplication sign row fired at any of the three sizes, in either
theme. On the real client, whose baselines are accepted from its own render, those two regression
rows would PASS and the run would be green. Generated content: the sheet exited 1, but only on
geometry (`element 4 "Upper body today. Sample" height 20 became 40`); again no copy problem was
reported.

Why it violates the ticket. Acceptance item 1 and the owner's standing rules through STANDARD.md
section 6, tagged *gate (copy: no dashes, readiness words, vendor names, on both gates)*, and
README section 4, which lists the three sweeps among what is LOCKED for every ticket. The
placeholder is visible interface copy that the athlete reads; `innerText` excludes it, and
excludes generated content, so the rule has no code behind it for either. This is the same class
of defect as the audit's B1 (a sweep that cannot match), one layer further out.

The fix I would demand. Extend the swept string in both gates: `ui.innerText`, plus the
`placeholder` of every visible input, plus `::before`/`::after` `content` where it is not `none`
or `""`, plus `aria-label` if the lane wants the assistive copy held to the same rule. Put it in
`common.py` beside `copy_problems` so the two gates cannot drift, and give it a `teeth.py` row.

### B3. A third check can WARN, so a scene defect the standard forbids exits 0

`rebuild/m1/approved-2026-09-18/quality/gate.py:392`, against
`rebuild/m1/approved-2026-09-18/README.md:117` and
`rebuild/m1/approved-2026-09-18/quality/STANDARD.md:109` and `:147`.

What I did. Read every WARN site in the five scripts (`grep -n "'WARN'" quality/*.py`) and then
proved the exit rule by execution.

What happened. There are three WARN sites, not two: `gate.py:481` (type scale), `gate.py:512`
(spacing scale) and `gate.py:392`, which reads
`rec('FAIL' if vs > 0.9 else ('WARN' if vs > 0.7 else 'PASS'), 'no vertical streaks in the sky
with the mist drawn', ...)`. A run with WARN rows and no FAIL exits 0: my accept run printed
`EARNED UI GATE: 0 FAIL, 6 WARN, 6 SET, 342 PASS` and exited 0, and `write_report` at
`gate.py:643` is `sys.exit(1 if fails else 0)`. So a column variation between 0.7 and 0.9, which
STANDARD.md section 4 forbids outright ("no row anywhere where the picture switches off", and the
comment in the code records that real pillars measured 1.3), is reported and then passed.

Why it violates the ticket. Acceptance item 15, verbatim: "WARN is used only for the type scale
and the spacing scale, which are advisory by STANDARD.md's own words; nothing else WARNs."
README.md:117 states "WARN is used by two checks only, the type scale and the spacing scale".
STANDARD.md:109 states "WARN belongs to the two advisory checks only" and then STANDARD.md:147
contradicts it in the same section with "WARN over 0.7, FAIL over 0.9". This is a docs claim the
code does not implement, and it is the same shape as the audit's B4 (a check that can only WARN is
a check with no teeth), on a smaller surface.

The fix I would demand. Pick one and make all three documents agree. Either `gate.py:392` becomes
`rec('FAIL' if vs > 0.7 else 'PASS', ...)` with the threshold justified in STANDARD.md, or the
0.7 band is dropped and only `vs > 0.9` FAILs, and STANDARD.md:147 loses its WARN column. Do not
leave a third advisory tier that two documents deny.

### B4. A state deleted from the driver is silently not rendered, and its records are orphaned

`rebuild/m1/approved-2026-09-18/quality/statesheet.py:193` (the run is driven by
`window.earnedStates.list()`) and `statesheet.py:288` (`write_report` counts only the rows it
rendered).

What I did. Deleted the whole `R('T-02', ...)` registration from `app/states-today.js`, left both
committed records (`quality/baseline/states/T-02-ink.json` and `.png`, and the Dawn pair) in place,
and ran `python quality/statesheet.py --only T-0`, which covers T-02 to T-09.

What happened. `STATE SHEET: 14 renders, 0 with problems`, exit 0, `clean: T-03, T-04, T-05, T-06,
T-07, T-08, T-09`. The sheet rendered 14 where the records say 16 and said nothing. Nothing in the
file compares the set of rendered states against the set of committed records, so a state can be
dropped from the port and the second gate stays green. For contrast, the same deletion with
`--only T-02` exits 2 with `STATE SHEET: REFUSED. ... registered no states matching T-02`, which
is the right behaviour, but it only happens because the narrowing left nothing to render.

Why it violates the ticket. Acceptance item 2 requires the sheet to compare "each state against a
committed baseline" and item 13 requires a missing record to be a FAIL that names the state; the
mirror case, a missing state with a present record, is the one a port actually produces, and
STANDARD.md section 10 says every state in the inventory is drawn and rendered by the sheet. C-UI-2
to C-UI-7 all accept on "statesheet green for the states covered", which a port can satisfy by not
implementing them.

The fix I would demand. After the render loop, list `quality/baseline/states/*.json`, subtract the
ids and themes actually rendered, and record one problem per orphan: `no state <ID> in the build,
but quality/baseline/states/<ID>-<theme>.json is committed`. Under `--only`, restrict the
comparison to records whose id matches the same prefix. Add a `teeth.py` row.

## SHOULD FIX

1. **Text hidden by `opacity: 0` passes both gates.** `statesheet.py:104` and `gate.py:159` gate on
   `offsetParent`, which is unaffected by opacity, and no check anywhere reads `opacity`. I set
   `.note-block.sample { opacity: 0 !important; }` and T-02 came back `2 renders, 0 with problems`,
   exit 0: the text is still counted as present, the rect and the colour are unchanged, and the
   thumbnail shift stayed inside 2.0. A state whose note the athlete cannot see is green, and the
   contrast check is measured on a colour nobody is shown. Either skip an element whose effective
   opacity is 0 (so the text check notices it went missing) or record opacity in the state record
   beside colour.
2. **A missing record names the wrong file.** `statesheet.py:131` returns the `.json` path whether
   the `.json` or the `.png` is missing. I deleted only `T-02-ink.png` and got
   `no record at quality/baseline/states/T-02-ink.json; run "python quality/statesheet.py --accept"
   and commit it`. Name the file that is actually absent.
3. **The `clean:` footer lists a state that failed.** `statesheet.py:295` builds the clean set from
   `{r[0] for r in rows if not r[4]}`, so with T-02 ink failing and T-02 dawn passing the report
   says `2 renders, 1 with problems` and then `clean: T-02`. Key the clean set on id and theme, or
   subtract the failed ids.
4. **`statesheet.py --accept --only T-02` writes a partial record set with no guard.** The gate
   refuses the equivalent (`gate.py:670`, executed: `REFUSED. --accept sets every baseline, so it
   cannot be combined with --screens or --sizes`, exit 2). The sheet accepts it and rewrote two
   records in 5 s. The blast radius is smaller, because the states it did not render keep their
   records, but the asymmetry is the kind of thing that gets used at 2 am. Either refuse it too, or
   say in the report's first line which states were set.
5. **README section 3 overstates the font checks' coverage.** `README.md:170` puts "the two font
   checks" in the list of checks that "run at 393x852, 375x812 and 360x780". `fonts pinned by
   sha256` runs once (`gate.py:350`, one result row in the report; STANDARD.md:145 correctly says
   "once"). Say "the face check at all three sizes, the sha256 pin once".
6. **README section 3.1 overstates the record's platform independence.** `README.md:141`: "Nothing
   in the record depends on how the machine rasterises a glyph, so the same records judge a Windows
   run, a Linux run and the real client." I changed glyph rendering only, with
   `text-rendering: geometricPrecision`, and the thumbnail moved 0.73 of its 2.00 level budget and
   one element's rect moved 4 px. The thumbnail is a downsampled raster; it depends on
   rasterisation less, not not at all. At the stated 3 px rect limit the ink thumbnail already sits
   at 1.67 of 2.00, so there is 0.33 of a level of headroom for a second machine's differences, and
   no Windows run has ever been made against these records. Soften the sentence to what the code
   does, and make the lane lead's Windows run report the measured thumbnail means, not just a
   verdict.
7. **A refusal on an `--only` run writes the unsuffixed report.** `statesheet.py:298` writes
   `states-report-T-02.txt` on a normal narrowed run, `statesheet.py:308` writes
   `states-report.txt` on a refusal, so a refusal leaves a stale suffixed report in place next to
   a fresh unsuffixed one. Write the refusal to the same name the run would have used.
8. **A file URL is unquoted twice.** `gate.py:262` does
   `urllib.request.url2pathname(urllib.parse.unquote(p.path))`, and `url2pathname` unquotes again
   on both POSIX and Windows. A pack path containing a literal `%` resolves to the wrong file.
   Drop the outer `unquote`.
9. **`teeth.py:36` rewrites every line ending of the file it edits.** It reads in text mode and
   writes in text mode with the platform default, so on Windows the scratch copy's `app.html` and
   `app.css` come back with different line endings from the pack's. Nothing depends on it today.
   Pass `newline=''` on the write.
10. **The package's `head` is stale.** `packages/C-UI-0.json:18` says `df3622a03e33...` and lists
    six commits; the delta is seven and HEAD is `3baef85f`, the package commit itself. Expected, but
    the field should say so or name the commit it was written at.
11. **The gold tier is keyed on the token, not on whether the gold text carries a sentence.**
    `common.py:73` drops anything whose computed colour equals `--gold` to the 3.0 tier. Q1's
    reasoning is that the state colour "marks a state and never carries a sentence", but the code
    cannot tell. A port that paints a paragraph gold gets the lower tier in silence.

## NOTES

**Baselines have no provenance.** I wrote a `quality/baseline/win32/` by hand, filled it with this
platform's PNGs and a fabricated `ENV.txt`, and the linux run stayed at `0 FAIL, 0 WARN, 354 PASS`,
exit 0. Nothing checks that a platform's baselines were drawn by that platform, or by `--accept`,
or from an unmutated tree. The guard the pack relies on is that an accept run labels its own report
and that no report is committed, which is sound as far as it goes; a reviewer still has to look at
the baseline diff in the PR. Worth one line in README section 3.1.

**Reproducibility is good on this machine.** Two renders of the same state are byte identical
(thumbnail mean 0.00, 0.00% of pixels over 24 levels). The committed Linux baselines were drawn on
kernel 6.18.44-fc-v33 per `ENV.txt`; this machine is 6.18.44-fc-v37 and all six regression rows
PASS, so the per platform mechanism survives at least one machine change. The regression tolerance
is tight enough to catch a single changed word: mutation a moved 0.368% of pixels at mean shift
0.425, against limits of 0.1% and 0.5.

**Runtime.** Gate 121 s in the worktree, 112 to 114 s per run in the scratch copy. Full state sheet
857 s. `teeth.py` 460 s, against the 25 minute budget in acceptance item 13 and the builder's
claimed 462 s. Phone sheet 20 s for the three base screens, 21 s for `--state T-40,W-20,C-05`.

**Windows, by reading.** I found no Windows breaking path. There is no `/usr`, `/tmp`, `/home` or
drive letter anywhere in the five scripts; the only `/usr` strings are the `#!/usr/bin/env python3`
shebangs, which are inert on Windows. Every path is built with `os.path.join`; `rel()` in both
gates converts `os.sep` to `/` for display only; `teeth.py:38` converts `/` to `os.sep` before
opening; `common.app_url()` uses `pathlib.Path(...).as_uri()`, which writes a drive letter URL
correctly; `platform_key()` is `sys.platform`, which is the intended keying and is `win32` there;
`common.label_font` tries eight bare file names (Pillow searches `%WINDIR%\Fonts` for those) and
then `ImageFont.load_default(size=...)` inside a try, with a bare `load_default()` fallback for a
Pillow older than 10.1. The hardcoded DejaVu path the audit found at the old `statesheet.py:73` and
`phonesheet.py:14` is gone. Every report is opened with `encoding='utf-8'` explicitly, and the
UTF-8 commit only calls `sys.stdout.reconfigure` inside a try, so a stream without `reconfigure`
degrades instead of raising; the console may show the multiplication sign as a substitute character
under a legacy code page, but nothing crashes and the files on disk are correct. Documented commands
say `python`, not `python3`. The two Windows relevant nits are SHOULD FIX 8 and 9.

**The seven open questions.**

- **Q1, the Dawn gold at about 3.4:1 held to the 3.0 tier.** Agree. STANDARD.md section 10 makes
  the ember gold the one state colour, the Dawn token is the boards' call, and changing `app/` is
  out of scope for this ticket. See SHOULD FIX 11 for the cost of implementing it as a token test.
- **Q2, a disabled control's label held to 3.0.** Agree. STANDARD.md section 10 already calls it a
  muted label, and `common.tier_for` keys on the real `:disabled` state rather than on how it
  looks, which errs in the safe direction: a control merely styled to look inactive keeps 4.5.
- **Q3, a 1/16 thumbnail rather than the 1/8 the ticket named.** Agree, and I checked the number
  rather than the claim. At 1/16 a 3 px shift moves the ink thumbnail 1.67 levels and a 60 px shift
  8.54; at 1/8, which I reproduced by rewriting the records at that scale, the same 3 px shift
  moves it 3.51, so the ticket's 1/8 would have made the rect half and the thumbnail half
  contradict each other and mutation h1 could not have passed. The builder's figures (3.5, 1.7,
  8.5) are right. The records come to 0.94 MB. The residual is SHOULD FIX 6: 1.67 of 2.00 is not
  much headroom for a second machine.
- **Q4, no win32 baselines yet.** Agree. This is exactly what the ticket asked for ("leave the
  mechanism in place and no Windows PNGs are invented), and the missing baseline path is a FAIL
  naming the exact path and the remedy, not a silent set.
- **Q5, `quality/common.py`, a file the ticket did not name.** Agree. The ticket's MAY CHANGE line
  covers everything under `quality/`, the drift it prevents is the audit's B1 (one gate had the
  broken sweep and the other did not), and it adds no dependency.
- **Q6, "fits without scrolling at 393x852" promoted from WARN to FAIL.** Agree for this ticket,
  because acceptance item 15 leaves no third tier. I would ask the lane to write the reason down in
  STANDARD.md next to the check, since the chassis is designed to scroll and the first ticket that
  grows the default Today will hit a FAIL for a screen that is behaving as ruled.
- **Q7, `teeth.py` narrowing the gate rows with `--screens` and `--sizes`.** Agree with the choice,
  disagree with the reasoning. "The narrowed run is the same code on fewer iterations" is true, but
  it is not the same evidence: I ran all 19 rows against the full gate and every row also produced
  `visual regression vs baseline` FAILs on the screens `teeth.py` drops, so the narrowed run
  understates the refusal and would not notice a mutation that only the regression check on another
  screen would catch. Keep the narrowing for the budget, and say in the docstring that the narrowed
  row asserts the named refusal only.

**What the ticket asked that I confirmed by execution.** Exit 0 on the clean tree for both gates;
exit 1 with a written `report.txt` and `report.json` on every FAIL row; exit 2 with a written
`report.txt` or `states-report.txt` on every refusal (empty folder, a real non Earned page of the
pack, an http URL that is down, and `--accept` combined with `--screens`); `--accept` writes
`ACCEPT RUN: regression compared nothing` as the report's first line, marks all six screens SET
rather than PASS, counts FAIL, WARN, SET and PASS separately, and rewrites `ENV.txt` with this
machine's OS, Python, playwright and Chromium; the next ordinary run then compares against exactly
what was written (PASS), and reverting the app under that new baseline turns the same two rows FAIL
again, which is the proof that the comparison is live. `quality/run/` is untracked, no report is
committed, and the six screen baselines now live under `quality/baseline/linux/`.

## The mutation table I executed, beside teeth.py's

Mine: full `python quality/gate.py` or `python quality/statesheet.py --only T-02` in a fresh copy
of the pack, one mutation per copy. `teeth.py`: its own narrowed run, one row per copy. Refusal
lines are quoted from the report file the run wrote.

| row | what I changed | my exit | the line the report carried | right check, right reason | teeth.py |
|---|---|---|---|---|---|
| a | an em dash into Today's status sentence, `app/app.html` | 1 | `FAIL  copy: no dashes, readiness words, vendor names  ink-today 393x852  '<em dash>'` (6 rows, both themes, all three sizes) plus `FAIL  visual regression vs baseline  ink-today 393x852  0.368% of pixels changed, mean shift 0.425 rows 175 to 190` | yes | as expected |
| b1 | a word off the owner's word list into a card title | 1 | `FAIL  copy: no dashes, readiness words, vendor names  ink-today 393x852  'ready'` (6 rows) plus 2 regression rows | yes | as expected |
| b2 | a vendor name into the same title | 1 | the same check, 6 rows, the detail being the lowered vendor name, plus 2 regression rows | yes | as expected |
| c | the sans `@font-face` pointed at the serif file | 1 | `FAIL  fonts pinned by sha256  the build  Earned Sans: earned-serif.woff2 is ff90213df9f50596, pinned c04be0b43dc3911d` and 18 rows of `FAIL  serif and sans faces loaded and distinct  ...  the serif and the sans draw the same glyphs: one face is pointed at the other file`; 25 FAIL | yes, both counts | as expected |
| d-1 | `#start` offset 620 px down at every size | 1 | `FAIL  primary action in first viewport  ink-today 393x852  #start bottom 1311 > 852` and `FAIL  pressed state on every tappable surface  ink-today 393x852  #start (outside the viewport at 22,1251)`; 10 FAIL, 2 WARN, no traceback | yes, a FAIL line and not a stack trace | as expected |
| d-2 | `#start` 200 px down at 375x812 and 360x780 only | 1 | exactly four rows, `FAIL  primary action in first viewport  ink-today 375x812  #start bottom 851 > 812` and its three siblings | yes | as expected |
| e1 | Today's titles and status line at `#8a8378` | 1 | `FAIL  contrast (measured behind the text)  dawn-today 393x852  status-line:Upper body today.  3.2 < 4.5, title:Weigh in before br 3.4 < 4.5, ...` (3 rows) plus 2 regression rows | yes, the 4.5 tier the audit found unreachable now fires | as expected |
| e2 | the same text at `#4a463f` | 1 | `FAIL  contrast (measured behind the text)  ink-today 393x852  status-line:Upper body today.  2.1 < 4.5, ...` (3 rows) plus 2 regression rows | yes | as expected |
| f | a keyframe animation on `#start`, live under reduced motion | 1 | 8 rows of `FAIL  no transitions or animations outside the embers  ink-today 393x852  animation start`, including the two `nopref` rows, plus `FAIL  nothing moves except the embers  ink-today  20542 px moved` and `FAIL  nothing moves under reduced motion  ink-today  20589 px moved`; 19 FAIL | yes, under both settings | as expected |
| g | one word of T-02's copy | 1 | `T-02  ink  LIVE  Preview before setup, sample marked  the visible text changed: "ample data. Sample data. Set up your" became "ample data. Example data. Set up you"; element 5 text ...` | yes, names the state, the element and the measure | as expected |
| g2 | an em dash inside the same state copy | 1 | `T-02  ink  ...  copy: '<em dash>'; the visible text changed: "r body today. Sample data. ..." became "r body today <em dash> sample data. ..."` | yes, and it now exits 1 rather than 0 | as expected |
| h1 | T-02's status line shifted 3 px | 0 | none; `STATE SHEET: 2 renders, 0 with problems` | correct, inside the tolerance; instrumented, the thumbnail moved 1.67 of 2.00 (ink) and 1.48 (dawn), 0.47% of pixels over 24 levels | as expected |
| h2 | T-02's status line shifted 60 px | 1 | `T-02  ink  ...  element 4 "Upper body today. Sample" top 172 became 232; element 5 "Sample data. Set up your" top 204 became 264; ...`; instrumented, thumbnail mean 8.54, 9.98% | yes | as expected |
| i | this platform's `ink-today` baseline deleted | 1 | `FAIL  visual regression vs baseline  ink-today 393x852  no baseline at quality/baseline/linux/ink-today.png; run "python quality/gate.py --accept" on the machine of record, then commit it`; 1 FAIL, 353 PASS, no extra PASS | yes, no vacuous pass and no silent set | as expected |
| j1 | `EARNED_APP` at an empty folder | 2 | `EARNED UI GATE: REFUSED. file:///.../empty-folder/ has no ".screen.is-active .ui" element (theme=ink, screen=today)`, written to `report.txt`, no traceback, 1 s | yes | as expected |
| j2 | `EARNED_APP` at `app/compare.html` | 2 | the same line naming `compare.html`, report written, no traceback | yes | as expected |
| k1 | one RIR chip dropped | 1 | `FAIL  RIR chips are the five locked values  ink-workout 393x852  [('0', '0'), ('2', '2'), ('3+', '3+'), ('unsure', 'Unsure')] is not [('0', '0'), ('1', '1'), ...]` (6 rows) plus 2 regression rows | yes, BRIEF-RIR-DISPLAY held | as expected |
| k2 | a serif element switched to the sans | 1 | `FAIL  serif and sans faces loaded and distinct  ink-workout 393x852  .screen-title resolves to Earned Sans, not Earned Serif` and `FAIL  serif for names and numbers, sans for the rest  ink-workout 393x852  .screen-title is Earned Sans` (6 rows each) plus 2 regression rows | yes, both checks | as expected |
| k3 | `#card-eat` moved 6 px off the page margin | 1 | `FAIL  page margin 22 px  ink-today 393x852  card-eat left 28` (6 rows) plus 2 regression rows | yes | as expected |

`teeth.py` printed `TEETH: 19 rows, 0 disagreeing, 460 s`, exit 0, every row "as expected". Its
verdict agrees with mine on all 19 rows. The only difference is coverage: because it narrows each
run to the screen the change is on, it never sees the regression rows that the full gate raises on
the other screens, and it asserts one or two named refusals per row where the full gate raised up
to 25.

## The extra mutations, chosen to hit what I thought was weakest

| # | what I did | exit | outcome |
|---|---|---|---|
| x1 | appended 8 bytes to `app/fonts/earned-sans.woff2` (sha moves) | 1 | caught: `fonts pinned by sha256 ... earned-sans.woff2 is 15af54092858621d, pinned c04be0b43dc3911d`, and 18 rows of `document.fonts.check says Earned Sans is not available`. The intended half of this test (the sha moves but the face still loads) was not reached, because the appended bytes broke the parse. x11 covers that half. |
| x11 | replaced `earned-sans.woff2` with the serif file's bytes: a valid face, same family name, face loads | 1 | caught twice: the sha pin, and `the serif and the sans draw the same glyphs: one face is pointed at the other file`. This is the strongest font row and it holds. |
| x13 | added a second `@font-face` for Earned Sans pointed at the serif, leaving the first intact | 1 | caught: `Earned Sans: 2 @font-face rules, expected 1`. The pin is not fooled by a shadowing rule. |
| x2 | a serif element given `font-weight: 777`, off the scale | 1 | WARN only on `type sizes and weights on the scale` (6 rows). The run exited 1 solely because the regression check also moved (0.581%). A weight change too small to move 0.1% of the pixels would be WARN and exit 0. That is by design (STANDARD.md calls the type scale advisory), recorded so the lane knows. |
| x3 | the soft text colour drifted exactly 4 levels in every channel, text identical | 1 | caught: `element 4 "Upper body today. Sample" colour (220, 215, 205) became (216, 211, 201)`. The 3 level colour tolerance does what it says. |
| x4 | a set written with the letter x between digits, `8 x 105`, in a Today card | 1 | caught: `FAIL  the multiplication sign in every set string  ink-today 393x852  '8 x 1'` at all three sizes, both themes. The rule now covers the whole screen, not only `#log-label`. |
| x5 | a `transition` on `#start::after` | **0** | **SLIPPED.** 0 FAIL, 0 WARN, 354 PASS. See B1. |
| x5b | a keyframe animation on `#card-eat::after`: a 4 px gold dot pulsing for ever | **0** | **SLIPPED.** 0 FAIL, 0 WARN, 354 PASS. See B1. |
| x15 | a placeholder carrying a word off the list, a vendor name and `8 x 105` | **sheet 0, gate 1** | **SLIPPED on the rule.** The sheet said `2 renders, 0 with problems`; the gate's only two FAIL rows were regression. See B2. |
| x16 | the same three faults injected through `#status-line::after { content: ... }` | 1 | **SLIPPED on the rule.** The sheet exited 1, but on geometry only (`height 20 became 40`); no copy problem was reported. See B2. |
| x8b | T-02 deleted from the driver, records left committed, run with `--only T-0` | **0** | **SLIPPED.** `14 renders, 0 with problems`. See B4. |
| x8 | the same deletion run with `--only T-02` | 2 | refused correctly: `STATE SHEET: REFUSED. ... registered no states matching T-02`, report written. |
| x9 | T-02's sample note at `opacity: 0` | **0** | **SLIPPED.** `2 renders, 0 with problems`. See SHOULD FIX 1. |
| x12 | the same line at `visibility: hidden` | 1 | caught: the visible text changed, and the thumbnail moved. The two ways of hiding text are treated differently. |
| x6 | a hand written `quality/baseline/win32/` holding this platform's PNGs and a fabricated `ENV.txt` | 0 | ignored on a linux run, as designed. Nothing checks a baseline's provenance anywhere. See NOTES. |
| x7 | `EARNED_APP` at `http://127.0.0.1:9/earned/app.html`, which is down | 2 | refused in one line: `EARNED UI GATE: REFUSED. http://127.0.0.1:9/earned/app.html could not be opened (Error)`, report written, no traceback, 1 s. |
| x14 | the committed `T-02-ink.json` hand edited so its text no longer matches the render | 1 | caught: `the visible text changed: "body today. Example data. ..." became "body today. Sample data. ..."`. A doctored record fails against an honest render. |
| x17 | `T-02-ink.png` deleted, the json left | 1 | caught and named: `no record at quality/baseline/states/T-02-ink.json; run "python quality/statesheet.py --accept" and commit it`, but it names the json when the png is the missing file, and the footer then says `clean: T-02`. See SHOULD FIX 2 and 3. |
| x10 | a card radius of 15 px | 1 | caught: `FAIL  radii: 14 px for cards, buttons and chips; full round only for pills  ink-today 393x852  14px, 15px` at all three sizes. |
| x18 | the tolerance halves, instrumented: the same shift at 0, 3, 4 and 60 px | 0/0/1/1 | 0 px: thumbnail mean 0.00, 0.00% (two renders of one state are byte identical here). 3 px: 1.67 ink, 1.48 dawn, 0.47%; both halves pass together, which is what acceptance item 21 demands. 4 px: 2.19 ink, 1.96 dawn, 0.86%; the rect half and the thumbnail half both fail, so the two agree. 60 px: 8.54, 9.98%. |
| x19 | the records rewritten at 1/8 and the 3 px shift re-judged | 1 | thumbnail mean 3.51 ink, 3.26 dawn, against the 2.0 limit, so at the ticket's 1/8 the h1 row could not pass. Q3 is correct. |
| x20 | glyph rendering changed with `text-rendering: geometricPrecision`, no layout rule touched | 1 | thumbnail mean 0.73 of the 2.00 budget and one rect moved 4 px. Evidence for SHOULD FIX 6. |

## The docs mismatch list

Every rule tagged *gate* in STANDARD.md names a check that exists in the code: I matched all 21
tags against the 32 check names in `report.json`, and section 13's table is exactly those 32 names,
in one to one correspondence, with the right sizes. The three tolerance sentences appear verbatim,
once each, in both the code and README section 3 after markdown normalisation (regression in
`gate.py`, state in `statesheet.py`, contrast in `common.py`). What follows is everything that does
not match, in descending order of consequence.

1. `README.md:117` "WARN is used by two checks only" and `STANDARD.md:109` "WARN belongs to the two
   advisory checks only" against `gate.py:392`, a third WARN branch, and against
   `STANDARD.md:147`, which documents that third branch in the same section. B3.
2. `README.md:141` "Nothing in the record depends on how the machine rasterises a glyph, so the
   same records judge a Windows run, a Linux run and the real client." Measured: a glyph level
   change costs 0.73 of the 2.00 thumbnail budget. SHOULD FIX 6.
3. `README.md:170` puts "the two font checks" among the checks that run at all three sizes. The
   sha256 pin runs once (`gate.py:350`), as `STANDARD.md:145` correctly says. SHOULD FIX 5.
4. `STANDARD.md:13` writes the check name as "icons share a centre line text shares an edge"; the
   code and `STANDARD.md:138` write "icons share a centre line, text shares an edge". One comma.
5. `STANDARD.md:22` writes "serif for names and numbers sans for the rest"; the code and
   `STANDARD.md:127` write "serif for names and numbers, sans for the rest". One comma.
6. `STANDARD.md:18` and `:132` say the bottom safe area check holds "max(24 px,
   env(safe-area-inset-bottom))". `gate.py:475` compares the last row's clearance against the
   literal 24 and never reads `env()`. The two agree in the test browser, where the inset is 0, so
   this is wording rather than behaviour, but the sentence promises a computation the code does not
   perform.
7. `README.md:33` says "209 drawn states (99 Today, 45 Workout, 65 Coach)" and `README.md:45` says
   the inventory has 205 rows. Both are true of different things (the sheet rendered 418, which is
   209 times two), but the two numbers sitting four lines apart with no explanation will be read as
   a contradiction. One clause would fix it.
8. `packages/C-UI-0.json:18` `head` is not HEAD. SHOULD FIX 10.

Everything else I checked in README sections 1, 3, 4 and 7 is accurate and I verified it by
running: the exit code table, the per platform baseline path, `ENV.txt`'s contents, the missing
baseline FAIL, the `--accept` labelling and the SET rows, `--accept` refusing `--screens` and
`--sizes`, the 1/16 thumbnail (24 by 53, mode L), the missing record FAIL, the contrast tiers and
the muted class list, which check runs at which size (I counted the rows per check in
`report.json`: 18 for the three size checks, 6 for the reference size checks, 24 for the animation
sweep, 3 for the console error row, 1 for the sha256 pin, 2 for the thumb zone), the transition
sweep running twice, the motion check running on every theme and screen under both settings, and
the phone sheet with no argument, with `--state T-40,W-20,C-05`, and refusing in one line for an
unknown state and for a build it cannot open.

## Exact commands used

    cd $WORKTREE                                   # the worktree the ticket names
    git log --oneline e0a6c8ef..HEAD
    git diff e0a6c8ef HEAD --stat
    git diff e0a6c8ef HEAD -- rebuild/m1/approved-2026-09-18/app        # empty, 0 lines
    git ls-files rebuild/m1/approved-2026-09-18/quality/                # no report committed

The two baseline runs, from `rebuild/m1/approved-2026-09-18`, on the committed tree:

    python3 quality/gate.py          ; echo $?      # 0 FAIL, 0 WARN, 354 PASS   exit 0   121 s
    python3 quality/statesheet.py    ; echo $?      # 418 renders, 0 with problems   exit 0   857 s
    python3 quality/teeth.py         ; echo $?      # 19 rows, 0 disagreeing, 460 s  exit 0

The scratch copy and the mutation driver (my own, 394 lines, one row per invocation; it makes a
fresh copy of the pack, applies exactly one change, runs the copy's own script and prints the exit
code and every non PASS line of the report it wrote; it does not import or call `teeth.py`):

    SCRATCH=$SCRATCHPAD/cui0-review/r1                 # the scratchpad the ticket names
    cp -r $WORKTREE/rebuild/m1/approved-2026-09-18 $SCRATCH/pristine
    rm -rf $SCRATCH/pristine/quality/run $SCRATCH/pristine/quality/__pycache__
    python3 $SCRATCH/mut.py none none-sheet
    python3 $SCRATCH/mut.py a b1 b2
    python3 $SCRATCH/mut.py c d-1 d-2
    python3 $SCRATCH/mut.py e1 e2 f
    python3 $SCRATCH/mut.py g g2 h1 h2
    python3 $SCRATCH/mut.py i j1 j2
    python3 $SCRATCH/mut.py k1 k2 k3
    python3 $SCRATCH/mut.py x1 x2 x4
    python3 $SCRATCH/mut.py x3 x8 x9 x12 x14 x7
    python3 $SCRATCH/mut.py x8b
    python3 $SCRATCH/mut.py x5 x10 x13
    python3 $SCRATCH/mut.py x5b x11 x6

Each row above ran the full `python quality/gate.py` (all three sizes, both themes, three screens)
or `python quality/statesheet.py --only T-02` inside the fresh copy, never a narrowed gate.

The accept discipline sequence, in one scratch copy:

    python3 quality/gate.py --accept --screens today      # REFUSED, exit 2
    python3 quality/statesheet.py --accept --only T-02    # ACCEPT RUN ..., 2 SET, exit 0
    # then, with .screen-title at font-weight 777:
    python3 quality/gate.py --accept                      # ACCEPT RUN: regression compared nothing
                                                          # 0 FAIL, 6 WARN, 6 SET, 342 PASS, exit 0
    python3 quality/gate.py                               # 0 FAIL, 6 WARN, 348 PASS, exit 0
    cp pristine/app/app.css work/app/app.css
    python3 quality/gate.py                               # 2 FAIL (regression), exit 1

The tolerance probes ran the scratch copy's `statesheet.py` with one added `print` of the measured
thumbnail mean and percentage, so the numbers inside the tolerance are visible; the tolerance
constants themselves were not touched. The 1/8 probe set `SCALE = 8` in the scratch copy only,
rewrote the two T-02 records with `--accept`, and then applied the 3 px shift.

The phone sheet:

    python3 quality/phonesheet.py                                  # exit 0, 20 s
    python3 quality/phonesheet.py --state T-40,W-20,C-05           # exit 0, 21 s
    python3 quality/phonesheet.py --state T-99                     # REFUSED, exit 2
    EARNED_APP="file:///nonexistent-earned-dir/" python3 quality/phonesheet.py   # REFUSED, exit 2

The package was verified with a script that recomputes the sha256 of every file in
`packages/C-UI-0.json`, of the brief and of the audit, and rebuilds the 836 file manifest of
`quality/baseline/states/` by the stated rule. All 15 file digests, both document digests, the
manifest digest, the file count and the byte count match.

Environment: Linux 6.18.44-fc-v37, Python 3.11.15, numpy 2.4.4, Pillow 12.2.0, playwright 1.56.0,
Chromium 141.0.7390.37, 2 cores. The committed `quality/baseline/linux/ENV.txt` records kernel
6.18.44-fc-v33, a different machine, and the six regression rows still PASS here.

## What I could not execute, and why

- **The Windows half of acceptance item 3.** There is no Windows machine in this environment. The
  finding "no Windows breaking path" is by reading, listed in NOTES, and covers the five scripts
  line by line. The two things a Windows run must report before the lane's PR line are (a) that both gates
  reach their reports, and (b) the measured thumbnail means for the states, because SHOULD FIX 6
  says the 2.00 level budget has 0.33 of a level of headroom at the stated 3 px rect limit and
  nobody has yet judged Linux made records against a Windows render.
- **The win32 baselines.** They do not exist by design (Q4). I proved the missing baseline path
  refuses correctly, which is the only part that can be proved from here.
- **A real client preview build.** C-UI-1 has not sealed, so `EARNED_APP` was only pointed at the
  pack's own pages, an empty folder and a dead http URL. Every statement about how the gates behave
  against the client is inference from the code.
- **A genuine vertical streak in the sky.** B3 is proved from the code path plus an executed
  demonstration that a run with WARN rows and no FAIL exits 0; I did not manufacture a scene whose
  column variation lands between 0.7 and 0.9.
- **A font whose bytes change while the face still loads and keeps the same metrics.** x1 broke the
  parse and x11 swapped in the serif, which changes the glyphs. A same metrics, different bytes
  face would need a font tool that is not installed. The sha256 pin caught both cases I could
  build, so I have no reason to doubt it catches the third.
