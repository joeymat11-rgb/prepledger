# C-UI-0 review R5: ACCEPT WITH NOTES, 0 blocking

Independent reviewer, fifth round, 2026-09-19. Branch `rebuild/c-ui-0-gates`, delta
`18c3b63..64a9e09` (two commits). This round answers my R4 REJECT. Same method as R1 to R4: a
fresh `cp -r` of `rebuild/m1/approved-2026-09-18/` per row, exactly one change per copy, the
copy's own scripts, plus direct calls on `quality/common.py` with no browser for the rules that
are pure functions. Nothing in my clone was modified except this file.

## Summary

Both blocking findings are closed and I proved each by rebuilding the exact mutation that
slipped through in R4.

B1 is closed at the root rather than at the symptom. One shared `fold_spaces` folds every
character of Unicode category Zs, plus U+2060, to an ordinary space, and the spaced hyphen test,
the minus rule and the word and vendor sweeps all read that one string. The mutation that passed
green in R4, Today's status sentence with U+00A0 on each side of a hyphen, now comes back
`EARNED UI GATE: 4 FAIL, 0 WARN, 56 PASS` with
`FAIL  copy: no dashes, readiness words, vendor names  ink-today 393x852  ' - '` in both themes.
Directly on the helper, the same sentence built with U+00A0, U+2007, U+2009, U+200A, U+202F,
U+205F, U+1680, U+3000 or U+2060 all return `[' - ']`, where in R4 only the ordinary space did.

B2 is closed and the fix is the narrow one. `JS_CLIPPED_AWAY` now skips an element only when its
computed `position` is `absolute` or `fixed` AND its clip leaves no area. The R4 mutation, a
274 by 20 focusable title carrying an inert `clip: rect(0 0 0 0)`, now comes back
`FAIL  touch targets >= 44 px  ink-today 393x852  title 274x20.00` in both themes, and so does
the same element given `position: sticky`, which is the other way a clip is inert. The assistive
label the skip exists for is still skipped: the gate is `0 FAIL, 0 WARN, 372 PASS` at exit 0, so
no new false target row appeared anywhere in the six views at three sizes.

The four should fix items are closed too. The U+2212 arm now holds only for a negative number:
`Do 3<U+2212>5 sets.`, `3 <U+2212>5`, `5<U+2212>3`, a sign at the end of a line and two signs on
a line all return the sign, while `<U+2212>5 lb`, `(<U+2212>5)`, a sign at the start of a line
and W-18's lone label all pass. U+2043 and U+2053 are named and both fail. The package's stale
block is renamed `filesTouchedAtF543489`, so every digest presented as current verifies and the
historical one carries the commit it was taken at. `Refused` is re-raised before the wide catch.

One thing I would still narrow, and it is small: a minus sign directly after a letter, with a
digit after it, still reads as a negative number and passes.

## BLOCKING

None. My two are closed by execution, and nothing I could build this round is a forbidden change
passing green on a rule the standard states, a crash instead of a report, a wrong exit code, a
tolerance or platform claim the code does not implement, or a path that breaks on Windows.

## SHOULD FIX

1. **A minus sign pressed directly against a letter still passes.** `minus_problems` asks only
   that the nearest non space character before the sign is not a digit, so
   `Upper body<U+2212>5 today` returns `[]`. A negative number is always preceded by a space, a
   line start or an opening bracket, never by a letter, so the arm can be narrowed to exactly
   those three without touching any case the round measured: `<U+2212>5 lb`, `(<U+2212>5)` and
   W-18's lone label all still pass under that. It is the last bit of slack in the exception and
   the fix is the same line that was already touched.
2. **`fold_spaces` folds the space separators and nothing else.** A tab (U+0009, category Cc) and
   U+2028 LINE SEPARATOR (Zl) around a hyphen still return `[]`. Neither reaches the swept string
   through ordinary HTML, because a tab collapses to a space in `innerText` under normal white
   space handling and U+2028 is a line break, so I do not call this a hole; but `white-space: pre`
   would preserve a tab, and the documents say "every Unicode space separator", which is category
   Zs and is not the same set as "every character a reader sees as a space". Either add the two
   to the fold or say Zs in the sentence.

## NOTES

**Folding does not hide anything from another sweep, which was the risk worth checking.** The
dash sweep, the format character sweep and the multiplication sign check all still read the raw
string, and I confirmed each one against a folded neighbour: U+2013 with U+00A0 on both sides is
still reported as a dash, U+200B between a space and a hyphen is still reported as `U+200B`, and
`8<U+2007>x<U+2007>105` is still reported as a set written with the letter x. The one visible
change in the other direction is correct rather than a loss: a vendor name or a word off the
owner's list split by U+00A0 now reads as two words after folding, which is what the screen
shows, and a split by a format character is still caught because those are removed rather than
folded and are a problem in their own right.

**The clip skip, judged from both sides.** It has to keep skipping one real element and stop
skipping everything else, and it does both: the full gate is green at 372 PASS, which is the
assistive label still skipped, and the two inert clips both fail. I did not find a third way to
make a clip inert that the pair of conditions misses, because `position` has only the two values
that make `clip` apply.

**The package.** Twenty two digests are presented as file digests and fifteen of them verify;
the seven that do not are all inside `r3.filesTouchedAtF543489`, whose key now names the commit
they were taken at, which is exactly what my R4 SHOULD FIX 3 asked for. The states tree is
unchanged at 1257 files and 1,437,414 bytes with the manifest digest matching, and all four
review files verify, including my own R4.

**The documents.** README section 3.1, section 4 and STANDARD.md section 13 now state the two
conditions for the clip skip, the Zs fold, U+2043 and U+2053 by name, and the negative number
reading of U+2212 in the same words the code uses. Every sentence I checked describes what I
measured. Hygiene over the 157 added lines and the two commit messages: no U+2013, no U+2014, no
vendor name, and every hit for a word off the owner's list or a hyphen between two spaces is
quoted evidence inside a code span or a quoted sentence, including the `' - '` literal the round
is about.

## The rows I ran

| what I did | how | exit | what came back |
|---|---|---|---|
| gate, final tree | full | 0 | `EARNED UI GATE: 0 FAIL, 0 WARN, 372 PASS`, 113 s |
| teeth, final tree | full | 0 | `TEETH: 46 rows, 0 disagreeing, 1021 s`, every row as expected, and q3, q9, q10 and q11 are the four this round added or changed |
| B1, the spaced hyphen with U+00A0 each side | gate, today, 393x852 | 1 | **closed**: `copy: no dashes, readiness words, vendor names  ' - '` in both themes, plus the two regression rows |
| B2, a 274x20 focusable title with an inert `clip` | gate, today, 393x852 | 1 | **closed**: `touch targets >= 44 px  title 274x20.00` in both themes |
| B2 variant, the same title at `position: sticky` with a clip | gate, today, 393x852 | 1 | **closed**: the same target rows |

Directly on `quality/common.py`, with no browser: `copy_problems` of a hyphen with each of
U+0020, U+00A0, U+2007, U+2009, U+200A, U+202F, U+205F, U+1680, U+3000, U+2060, a tab and U+2028
on both sides; U+200B between a space and a hyphen; a mixed pair; U+2013 with U+00A0 around it; a
vendor name and a word off the owner's list split by U+00A0; U+2043, U+2053, U+2010 and U+2015;
and the minus sign as a lone label, as `3<U+2212>5`, `3 <U+2212>5`, `5<U+2212>3`, `<U+2212>5 lb`,
at a line start, in brackets, at the end of a line, doubled, after U+00A0 with a digit before it,
directly after a letter and between two words. `set_x_problems` with U+2007 around the letter x.

## What I did not execute

The `Refused` re-raise. Nothing inside `render_one` raises one today, so building a case means
injecting a raise into a scratch copy's own `statesheet.py`; I judged that not worth the browser
time inside this round's budget and I report S4 as closed by reading, not by measurement, the way
the builder does. I also did not re-run the full state sheet: nothing this round changed touches
the record, the thumbnails or the tolerances, the sheet's four changed lines are the re-raise,
and the gate exercises the same shared `common.py` rules that did change. Anything on Windows,
as in every round of mine.

## Environment

Linux 6.18.44-fc-v37, Python 3.11.15, numpy, Pillow, playwright 1.56.0, Chromium 141.0.7390.37,
two cores. Narrowed gate rows are `--screens today --sizes 393x852` at about 37 s each.
