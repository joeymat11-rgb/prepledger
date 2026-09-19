# C-UI-0 AUDIT 3: the design lane's one list, probed RED FIRST

Written and executed by a lane hand on the owner's PC before the design lane posted its
successor head, so that the PM's executor can run the delta the moment that head exists
(owner ruling DECISIONS:593 point 1). The rows are DATA in the PM's existing kit; the kit
executes them, never the lane.

Source of the list: Astra's judgment of audit 2, origin/rebuild/r-astra-cui0-judge at
4ecc1012, rebuild/lanes/astra/reviews/C-UI-0-AUDIT2-JUDGMENT.md, section 6, read whole.
One family per item classed M or E: items 1 to 14. Items 15 to 18 are class D, document
now without a new permanent mutation, and carry no row: see "what was not written" below.

NOTATION: this file is pure ASCII. Any character outside ASCII is written as <U+XXXX>.
A verbatim minus sign in a row's expected needles therefore reads <U+2212>, a fullwidth
small x reads <U+FF58>, a no-break space reads <U+00A0> and a tab reads as itself.

## The two packs

Both are scratch copies made by selftest.cmd with git archive through the PC's read-only
worktree %TEMP%\earned-cui-audit-2, extracted under %TEMP%\cui-audit2, outside every git
work tree. The driver refuses a pack that is inside one. Neither pack was edited in place:
each row applies one mutation, proves a non-empty diff, runs, reverts in a finally block
and proves byte identity by sha256. All 54 executed records report reverted_clean true.

    head 64a9e095 (the audited head)      %TEMP%\cui-audit2\y64\rebuild\m1\approved-2026-09-18
      PACK-SHA   af27c1a522765a0cabeb19676235875622c61bcdd8e7bace4416e420e8585900
      1331 files, quality/run and __pycache__ excluded
      quality/common.py sha256 ce6c6a04f8e8f89975a56ecc9b6bb564ee91f7fd24534bf879b712eeb34dcbf5
      quality/teeth.py  sha256 c3af5f4bfe8c1baa1a7326dc67c155f5685aff7d566458368bbace8b43c5d97e

    head 814f0a03 (the lane's later head) %TEMP%\cui-audit2\y814\rebuild\m1\approved-2026-09-18
      PACK-SHA   080c6d37fa4b6618430e6a03b6e0842750bea84cb466a26c93a39309e3dd11df
      1331 files, quality/run and __pycache__ excluded
      quality/common.py sha256 34d7e18690f1178b31f32d1c46643797d10f8df2b2f384a2ece29126327e9eae
      quality/teeth.py  sha256 659eef1f071cb8c3136430c4dfbf8623b531ceb458db854728b1824bd29d5771

The two common.py digests are exactly the two Astra recorded for the two heads in section 1
of her judgment, which is how each pack's identity is pinned without trusting a folder name.
814f0a03 is accepted by nothing; it is used here only because items 13 and 14 are about code
that exists only there.

## Environment

    Windows 11 AMD64, the owner's PC, shared with other lanes while this ran
    python 3.14.6 from %TEMP%\cui-venv\Scripts\python.exe
    playwright 1.62.0
    chromium 151.0.7922.34 (the version the pack's win32 baselines were drawn under)
    MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York on every run
    one gate process at a time, never in parallel

## How to read the table

WANTED AFTER THE FIX is what the row asserts; it is never today's behaviour. WHAT HAPPENED
TODAY is the record verbatim: the exit code, every FAIL check name the run produced, the
refusal line where there was one, and the run's own summary line.

RED-TODAY means the row disagreed with what it wants, which is the evidence that the probe
bites the defect the list names. AS-WANTED-ALREADY means today's behaviour already equals
what is wanted: for a control that is the point, and for a negative probe it is a fact the
judge is owed, not a silent pass.

For items 1, 2 and 3 no exact check name is asserted. Under P-CUI-5 the lane may close those
items by forbidding the construct by name instead of teaching the walks to read it, so those
rows demand exit 1 and a FAIL row, carry the element id or the construct where both routes
would name it, and leave the catcher to the judge.

Counts: 53 rows, 54 executed records (y4d ran twice, see below), 25 RED-TODAY,
28 AS-WANTED-ALREADY, 0 VOID, 0 dirty reverts.

## The table

| row | item | mutation | head | wanted after the fix | what happened today | verdict | s |
|---|---|---|---|---|---|---|---|
| y1a | 1 | attribute copy on a POSITION:FIXED element (an empty span, no layout change at all) | 64a9e095 | exit 1; a FAIL row; P-CUI-5 leaves the check name to the lane | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | RED-TODAY | 7.0 |
| y1b | 1 | CONTROL for y1a: the same attribute on the same empty span, IN FLOW | 64a9e095 | exit 1; FAIL named exactly "copy: no dashes, readiness words, vendor names"; output carries "'ready'" | exit 1. FAIL names: copy: no dashes, readiness words, vendor names. EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | AS-WANTED-ALREADY | 3.1 |
| y1c | 1 | generated content on a POSITION:FIXED element (::after drawn on the screen) | 64a9e095 | exit 1; a FAIL row; P-CUI-5 leaves the check name to the lane | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | RED-TODAY | 3.2 |
| y1d | 1 | CONTROL for y1c: the same ::after on the same span, IN FLOW | 64a9e095 | exit 1; FAIL named exactly "copy: no dashes, readiness words, vendor names"; output carries "'ready'" | exit 1. FAIL names: copy: no dashes, readiness words, vendor names. EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | AS-WANTED-ALREADY | 3.1 |
| y1e | 1 | low contrast TEXT on a position:fixed element, which the contrast walk never measures | 64a9e095 | exit 1; a FAIL row; P-CUI-5 leaves the check name to the lane; output carries 'y1efix' | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | RED-TODAY | 3.2 |
| y1h | 1 | CONTROL of the absolute/fixed target pair: a visible 20 px focusable box, ABSOLUTE | 64a9e095 | exit 1; FAIL named exactly "touch targets >= 44 px"; output carries 'title' | exit 1. FAIL names: touch targets >= 44 px. EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | AS-WANTED-ALREADY | 3.0 |
| y1i | 1 | the other half of the pair: the same visible 20 px focusable box, FIXED | 64a9e095 | exit 1; a FAIL row; P-CUI-5 leaves the check name to the lane; output carries 'title' | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | RED-TODAY | 3.2 |
| y2a | 2 | VISIBLE text under clip-path: inset(0 round 50%), painted at 3.2:1 | 64a9e095 | exit 1; a FAIL row; P-CUI-5 leaves the check name to the lane; output carries 'status-line' | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | RED-TODAY | 3.1 |
| y2c | 2 | CONTROL the fix must not break: the same colour under a TRULY empty clip, inset(50%) | 64a9e095 | exit 0; no failure of the named check; and NO FAIL named "contrast (measured behind the text)" | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | AS-WANTED-ALREADY | 3.1 |
| y2d | 2 | a negative text-indent on an INLINE box, which hides nothing, at 3.2:1 | 64a9e095 | exit 1; a FAIL row; P-CUI-5 leaves the check name to the lane; output carries 'y2dsp' | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | RED-TODAY | 3.1 |
| y2e | 2 | CONTROL for y2d: the same inline span at the same colour, no indent | 64a9e095 | exit 1; FAIL named exactly "contrast (measured behind the text)"; output carries 'y2dsp' | exit 1. FAIL names: contrast (measured behind the text). EARNED UI GATE: 2 FAIL, 0 WARN, 61 PASS | AS-WANTED-ALREADY | 3.1 |
| y2f | 2 | CONTROL the fix must not break: the same indent on a BLOCK, where it does hide the line | 64a9e095 | exit 0; no failure of the named check; and NO FAIL named "contrast (measured behind the text)" | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | AS-WANTED-ALREADY | 3.1 |
| y3a | 3 | a set written with FULLWIDTH x (U+FF58) in Today's status sentence | 64a9e095 | exit 1; a FAIL row; P-CUI-5 leaves the check name to the lane | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | RED-TODAY | 3.0 |
| y3b | 3 | CONTROL for y3a: the honest set, written with the multiplication sign | 64a9e095 | exit 0; no failure of the named check; and NO FAIL named "the multiplication sign in every set string", "copy: no dashes, readiness words, vendor names" | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | AS-WANTED-ALREADY | 3.2 |
| y3c | 3 | "optional" on a set screen with a FULLWIDTH i (U+FF49), carried in an attribute | 64a9e095 | exit 1; a FAIL row; P-CUI-5 leaves the check name to the lane | exit 0. FAIL names: none. STATE SHEET: 2 renders, 0 with problems | RED-TODAY | 3.5 |
| y3d | 3 | CONTROL for y3c: the same attribute with an ordinary ASCII "optional" | 64a9e095 | exit 1; a FAIL row; P-CUI-5 leaves the check name to the lane; output carries 'optional' | exit 1. FAIL names: none. STATE SHEET: 2 renders, 2 with problems | AS-WANTED-ALREADY | 3.4 |
| y4a | 4 | #start pushed 400 px ABOVE the viewport | 64a9e095 | exit 1; FAIL named exactly "primary action in first viewport"; output carries '#start' | exit 1. FAIL names: contrast (measured behind the text). EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | RED-TODAY | 3.2 |
| y4b | 4 | #start pushed 500 px SIDEWAYS, off the right edge | 64a9e095 | exit 1; FAIL named exactly "primary action in first viewport"; output carries '#start' | exit 1. FAIL names: page margin 22 px. EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | RED-TODAY | 3.2 |
| y4c | 4 | #start left in place and made invisible with visibility:hidden | 64a9e095 | exit 1; FAIL named exactly "primary action in first viewport"; output carries '#start' | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | RED-TODAY | 3.1 |
| y4d | 4 | CONTROL: #start moved 40 px down and still wholly inside the viewport | 64a9e095 | exit any; no failure of the named check; and NO FAIL named "primary action in first viewport" | exit 1. FAIL names: contrast (measured behind the text). EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | AS-WANTED-ALREADY | 3.1 |
| y4e | 4 | #start pushed 161.4 px down, so its bottom lands a fraction of a pixel past 852 | 64a9e095 | exit 1; FAIL named exactly "primary action in first viewport"; output carries '#start' | exit 1. FAIL names: contrast (measured behind the text); primary action in first viewport; visual regression vs baseline. EARNED UI GATE: 6 FAIL, 2 WARN, 52 PASS | AS-WANTED-ALREADY | 28.6 |
| y5a | 5 | the RIR 2 chip painted away with opacity 0, label and order untouched | 64a9e095 | exit 1; FAIL named exactly "RIR chips are the five locked values" | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 71 PASS | RED-TODAY | 3.1 |
| y5b | 5 | CONTROL for y5a: the same narrowed workout gate with the chips untouched | 64a9e095 | exit 0; no failure of the named check; and NO FAIL named "RIR chips are the five locked values"; output carries '0 FAIL' | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 71 PASS | AS-WANTED-ALREADY | 3.1 |
| y6a | 6 | T-02 sample note moved +3.00 px left AND widened +3.00 px: the right edge moves 6 px | 64a9e095 | exit 1; a failure reported by the words below (the state sheet, the phone sheet and teeth.py print problems, not named check rows); output carries 'right' | exit 0. FAIL names: none. STATE SHEET: 2 renders, 0 with problems | RED-TODAY | 3.4 |
| y6b | 6 | CONTROL for y6a: the same note moved +3.00 px left and NOT widened | 64a9e095 | exit 0; no failure of the named check | exit 0. FAIL names: none. STATE SHEET: 2 renders, 0 with problems | AS-WANTED-ALREADY | 3.3 |
| y6c | 6 | the status line font size moved 0.6 px: the first representable step past SIZE_TOL | 64a9e095 | exit 1; a failure reported by the words below (the state sheet, the phone sheet and teeth.py print problems, not named check rows); output carries 'font size' | exit 1. FAIL names: none. STATE SHEET: 2 renders, 2 with problems | AS-WANTED-ALREADY | 3.4 |
| y7a | 7 | the x20 pair again: the same body element and colour, with the bare class name "from" | 64a9e095 | exit 1; FAIL named exactly "contrast (measured behind the text)"; output carries 'status-line' | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | RED-TODAY | 3.1 |
| y7b | 7 | CONTROL: genuinely muted copy, the muted class AND the muted token together | 64a9e095 | exit 0; no failure of the named check; and NO FAIL named "contrast (measured behind the text)" | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | AS-WANTED-ALREADY | 3.0 |
| y7c | 7 | CONTROL: large text at the same colour, which the standard allows at 3.0 | 64a9e095 | exit 0; no failure of the named check; and NO FAIL named "contrast (measured behind the text)" | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 4 WARN, 59 PASS | AS-WANTED-ALREADY | 3.1 |
| y8a | 8 | #card-eat given a hover recipe and a pressed recipe identical to it: press adds nothing | 64a9e095 | exit 1; FAIL named exactly "pressed state on every tappable surface"; output carries 'card-eat' | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 60 PASS | RED-TODAY | 28.6 |
| y8b | 8 | CONTROL for y8a: a genuine pressed recipe on #card-eat and no hover recipe at all | 64a9e095 | exit 0; no failure of the named check; and NO FAIL named "pressed state on every tappable surface" | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 60 PASS | AS-WANTED-ALREADY | 28.6 |
| y9a | 9 | teeth.py --only with one name that is not a row | 64a9e095 | exit 2; a one line refusal; output carries 'REFUSED' | exit 0. FAIL names: none. TEETH: 0 rows, 0 disagreeing, 0 s | RED-TODAY | 0.8 |
| y9b | 9 | teeth.py --only with one real row and one name that is not a row | 64a9e095 | exit 2; a one line refusal; output carries 'REFUSED' | exit 0. FAIL names: none. TEETH: 1 rows, 0 disagreeing, 1 s | RED-TODAY | 1.8 |
| y9d | 9 | CONTROL for y9a to y9c: teeth.py --only with one real row | 64a9e095 | exit 0; no failure of the named check; output carries '1 rows, 0 disagreeing' | exit 0. FAIL names: none. TEETH: 1 rows, 0 disagreeing, 1 s | AS-WANTED-ALREADY | 1.8 |
| y10a | 10 | the state sheet's apply-error detection removed, and nothing else, then teeth --only q5 | 64a9e095 | exit 1; a failure reported by the words below (the state sheet, the phone sheet and teeth.py print problems, not named check rows); output carries 'q5', 'DISAGREES' | exit 0. FAIL names: none. TEETH: 1 rows, 0 disagreeing, 20 s | RED-TODAY | 21.3 |
| y10b | 10 | CONTROL for y10a: teeth --only q5 with the state sheet untouched | 64a9e095 | exit 0; no failure of the named check; output carries '1 rows, 0 disagreeing' | exit 0. FAIL names: none. TEETH: 1 rows, 0 disagreeing, 20 s | AS-WANTED-ALREADY | 21.1 |
| y11a | 11 | a Refused raised inside render_one for one state | 64a9e095 | exit 2; a one line refusal; output carries 'REFUSED', 'audit3 probe' | exit 2. FAIL names: none. refusal: STATE SHEET: REFUSED. audit3 probe: an injected refusal inside render_one. STATE SHEET: REFUSED. audit3 probe: an injected refusal inside render_one | AS-WANTED-ALREADY | 3.3 |
| y11b | 11 | an ordinary exception raised inside render_one for the same one state | 64a9e095 | exit 1; a failure reported by the words below (the state sheet, the phone sheet and teeth.py print problems, not named check rows); output carries 'the render failed', 'T-03'; a report written | exit 1. FAIL names: none. STATE SHEET: 16 renders, 2 with problems | AS-WANTED-ALREADY | 17.2 |
| y12a | 12 | T-02's apply throws, and the phone sheet is asked for T-02 | 64a9e095 | exit 2; a one line refusal; output carries 'REFUSED' | exit 0. FAIL names: none | RED-TODAY | 3.9 |
| y12b | 12 | CONTROL for y12a: the same phone sheet with T-02 applying normally | 64a9e095 | exit 0; no failure of the named check; output carries 'phonesheet-T-02.png' | exit 0. FAIL names: none | AS-WANTED-ALREADY | 3.7 |
| y9c | 9 | teeth.py --only with a selection that strips to nothing | 64a9e095 | exit 2; a one line refusal; output carries 'REFUSED' | exit TIMED OUT at 180 s. FAIL names: none | RED-TODAY | 180.0 |
| y13a | 13 | an honest negative number opened by a colon | 814f0a03 | exit 0; no failure of the named check; and NO FAIL named "copy: no dashes, readiness words, vendor names" | exit 1. FAIL names: copy: no dashes, readiness words, vendor names. EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | RED-TODAY | 3.0 |
| y13b | 13 | honest negative numbers opened by a multiplication sign, a currency sign, an equals sign, a quotation mark, a brace and a slash, in one sentence | 814f0a03 | exit 0; no failure of the named check; and NO FAIL named "copy: no dashes, readiness words, vendor names" | exit 1. FAIL names: copy: no dashes, readiness words, vendor names. EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | RED-TODAY | 3.2 |
| y13c | 13 | two separate numeric cells, the second of them a negative number | 814f0a03 | exit 0; no failure of the named check; and NO FAIL named "copy: no dashes, readiness words, vendor names" | exit 1. FAIL names: copy: no dashes, readiness words, vendor names. EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | RED-TODAY | 3.1 |
| y13d | 13 | CONTROL, the W-18 case: a minus sign alone on its own line, as a control's label | 814f0a03 | exit 0; no failure of the named check; and NO FAIL named "copy: no dashes, readiness words, vendor names" | exit 0. FAIL names: none. EARNED UI GATE: 0 FAIL, 0 WARN, 63 PASS | AS-WANTED-ALREADY | 3.1 |
| y13e | 13 | CONTROL the fix must not lose: the two forbidden uses, a range and a sign against a letter | 814f0a03 | exit 1; FAIL named exactly "copy: no dashes, readiness words, vendor names"; output carries "'<U+2212>'" | exit 1. FAIL names: copy: no dashes, readiness words, vendor names. EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | AS-WANTED-ALREADY | 3.1 |
| y14a | 14 | a spaced hyphen whose two spaces are raw TABS, alone | 814f0a03 | exit 1; FAIL named exactly "copy: no dashes, readiness words, vendor names"; output carries "' - '" | exit 1. FAIL names: copy: no dashes, readiness words, vendor names. EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | AS-WANTED-ALREADY | 3.2 |
| y14b | 14 | a spaced hyphen whose two spaces are no-break spaces, alone, at the successor head | 814f0a03 | exit 1; FAIL named exactly "copy: no dashes, readiness words, vendor names"; output carries "' - '" | exit 1. FAIL names: copy: no dashes, readiness words, vendor names. EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | AS-WANTED-ALREADY | 3.1 |
| y14c | 14 | a raw TAB spaced hyphen carried in an attribute rather than in the body text | 814f0a03 | exit 1; FAIL named exactly "copy: no dashes, readiness words, vendor names"; output carries "' - '" | exit 1. FAIL names: copy: no dashes, readiness words, vendor names. EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | AS-WANTED-ALREADY | 3.1 |
| y14d | 14 | a minus sign pressed against a letter, alone | 814f0a03 | exit 1; FAIL named exactly "copy: no dashes, readiness words, vendor names"; output carries "'<U+2212>'" | exit 1. FAIL names: copy: no dashes, readiness words, vendor names. EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | AS-WANTED-ALREADY | 3.0 |
| y14e | 14 | a numeric range written with a minus sign, alone | 814f0a03 | exit 1; FAIL named exactly "copy: no dashes, readiness words, vendor names"; output carries "'<U+2212>'" | exit 1. FAIL names: copy: no dashes, readiness words, vendor names. EARNED UI GATE: 4 FAIL, 0 WARN, 59 PASS | AS-WANTED-ALREADY | 3.2 |
| y14f | 14 | the TAB half of the folding protection reverted alone, then teeth --only q9 | 814f0a03 | exit 1; a failure reported by the words below (the state sheet, the phone sheet and teeth.py print problems, not named check rows); output carries 'q9', 'DISAGREES' | exit 0. FAIL names: none. TEETH: 1 rows, 0 disagreeing, 29 s | RED-TODAY | 29.9 |
| y14g | 14 | the opener half of the minus rule reverted alone, then teeth --only q11 | 814f0a03 | exit 1; a failure reported by the words below (the state sheet, the phone sheet and teeth.py print problems, not named check rows); output carries 'q11', 'DISAGREES' | exit 0. FAIL names: none. TEETH: 1 rows, 0 disagreeing, 29 s | RED-TODAY | 29.9 |

## The controls that failed today

ONE, and it is a defect of this hand's row, not of the gate.

y4d, the item 4 control, expected exit 0 and got exit 1 with four contrast rows
("contrast (measured behind the text)") and NO primary row. Moving #start with
position:relative lifts the button off its own fill, so its label is measured against the
page behind it and the ratio collapses to 1.1:1 in Ink and 1.2:1 in Dawn. That is a
consequence of the mutation, not a gate defect, and not what the control guards: the
control exists to prove that an honest layout change which leaves the primary reachable
does not raise the primary row, and the primary row did not fire.

The row now drops its exit expectation, keeps expect_no_fail on the primary check, and
says all of this in a corrected field, in the same shape the PM used for x17, x19 and x21.
Both runs are in results-audit3.jsonl; the first run's log is kept beside the second as
logs/y/y4d.first-run.log and nothing was deleted. The second run is "as expected".
Nothing about the primary check was weakened to reach it.

No other control failed, and no negative probe was found already caught where the list
predicts a hole. Every control that was meant to stay red stayed red (y1b, y1d, y1h, y2e,
y3d, y6c, y13e, y14a to y14e) and every control that was meant to stay green stayed green
(y2c, y2f, y3b, y5b, y6b, y7b, y7c, y8b, y9d, y10b, y12b, y13d).

## Two notes on isolation, so the judge can weigh the exit codes

y4a and y4b are RED-TODAY with exit 1 rather than exit 0: pushing #start 400 px up raises
four contrast rows, and pushing it 500 px sideways raises the page margin row, both of them
consequences of moving a direct child of the page body. In neither run did the primary row
fire, which is the measure; the driver's judge demands the exact check name, so neither run
could be mistaken for a pass.

y8a and y8b ran at 393x852, the only size where the pressed check runs. y8b is green there
with 0 FAIL and 60 PASS, which proves the hover and active rules touch no idle pixel; that
is what makes y8a's exit 0 clean evidence of the hover-only bypass and not an absent check.

## Every driver.py line that changed

Four changes, none of them to judge(), which still demands the EXACT check name of a
report.json FAIL row and still honours expect_no_fail exactly as the PM published it.

1. RUNNERS gained one entry, 'teeth': 'quality/teeth.py', with a comment saying why: items
   9, 10 and 14 ask whether one of the PACK'S OWN rows still bites when a single protection
   is reverted, and that can only be measured by running the pack's mutation list.
2. RESULTS became os.path.join(HERE, os.environ.get('AUDIT_RESULTS', 'results.jsonl')), so
   audit 3 writes results-audit3.jsonl and the 86 records of audit 2 are never appended to.
   With the variable unset the driver behaves exactly as before.
3. The subprocess call takes timeout=row.get('timeout') or timeout, so one row can shorten
   the default 900 s. Exactly one row uses it: y9c, whose defect is that the run does NOT
   refuse and starts working through the whole list instead, and the PC is shared.
4. The result record carries two more fields, 'head' and 'expect_no_fail', so a record says
   which pack it ran against without the reader having to trust a command line.

Nothing else in driver.py was touched: the pack refusal, the sha256 proofs, the empty-diff
VOID, the revert in the finally block and the manifest are as the PM published them at
f2b0d59.

## What was NOT written, and why

Items 15, 16, 17 and 18 carry no row. Astra classes all four D, "fix or document now without
a new permanent mutation": what they require is truthful prose, disclosed scope, printed
counts and target identity, and reconciled pins. A mutation row cannot prove a paragraph, and
inventing one would be the overclaiming those items exist to stop.

Item 1's target pair was run against the screen gate only. The state sheet measures small
targets through quality/statesheet.py JS_INFO, which uses the same e.offsetParent===null test
and the same common.JS_CLIPPED_AWAY helper as the gate's JS_SMALL; a second row would exercise
one shared definition twice. The judge should decide whether she wants the duplicate anyway:
her receipt says "in both gates".

Item 3's fullwidth-set probe was run against the screen gate, and its workout counterpart
("optional" with U+FF49) against the state sheet, because the "optional" rule exists only in
statesheet.py:496. A fullwidth set on the sheet side was not written: it can only be carried
in copy the record also holds, so the record comparison fires first and the row could not
isolate the set rule.

Item 13's LF and CR variants beyond the own-line case (y13d) were not written. The successor
fold_spaces keeps '\n' and '\r' unfolded by name, and the swept string is built from innerText
and attributes, which Chromium normalises to LF; a CR row would have measured the browser and
not the rule.

Item 6's "just over 3 px rect" twin was not written: h1, x1 and h3 of audit 2 already bracket
the rect tolerance at 3 and 4 px on the same element, and y6c supplies the font-size boundary.
What was missing, and is supplied here, is the far-edge case y6a.

No accept row was written and none was run, so no scratch pack was ever dirtied and neither
pack needed re-making. No row touched quality/conform, no ledger, no file under src, no
EarnedPort, no port-real.log and no soak. The lane's branches were not written to: everything
here is published on rebuild/r-cui0-audit2 only.

## Provenance of the packs and of this hand's work

A predecessor in this seat made both scratch packs shortly before the account's five-hour
limit ended its session; it committed nothing and left rows.py and driver.py byte identical
to the versioned copies (3b0043c5... and 4780eb85...), which was verified by sha256 before
anything was continued. Its two pack folders were checked against Astra's recorded common.py
digests for both heads before being used, and nothing of its work was deleted.

The rows were authored and dry-run in the cloud reading room against a copy of the same pack,
then crossed to the PC through the airlock under fresh names with sha256 compared on both
sides, then dry-run again on the PC: 53 of 53 DRY-OK on both packs, every anchor matching
exactly once. Those dry runs are published as results-dryruns-audit3.jsonl. The previous
rows.py and driver.py are kept beside the new ones in %TEMP%\cui-audit2 as
rows.2026-09-19-f2b0d59.py and driver.2026-09-19-f2b0d59.py; nothing was deleted.

This report is a hypothesis about what the probes mean. The judge is asked to disagree
wherever the evidence lets her.
