# C-UI-0 review R4: REJECT, 2 blocking

Independent reviewer, fourth round, 2026-09-19. Branch `rebuild/c-ui-0-gates`, delta
`1c423cb..bbfd60c` (twelve commits). Same method as R1, R2 and R3: a fresh `cp -r` of
`rebuild/m1/approved-2026-09-18/` per row, exactly one change per copy, the copy's own
`gate.py` and `statesheet.py`, never `teeth.py` on its own. Nothing in my clone was modified
except this file.

## Summary

The round does what it says on almost everything I could measure. The gate is
`EARNED UI GATE: 0 FAIL, 0 WARN, 372 PASS` at exit 0 in 113 s. The full sheet is
`STATE SHEET: 418 renders, 0 with problems` at exit 0 in 912 s, and `teeth.py` is
`TEETH: 43 rows, 0 disagreeing, 1007 s` at exit 0. The sheet's worst measured block now
carries the two numbers the round claims: `rect edge moved (px) 0.04 of 3.00 W-05 ink element 22
"Unsure" left` against the records the lead wrote on Windows, and, as an advisory row,
`thumbnail mean shift 1.26 of 2.00 C-63 ink` against the win32 thumbnails, which is the figure I
had to compute by hand in R3 and is now printed on every run. My notes 3, 6, 7 and 9 are closed
by execution: the advisory rows exist, a 3.01 px move fails and a 3.00 px move passes, the
failing side of a target prints two decimals (`title 274x20.00`), and a truncated problem list
ends in `and 19 more`. The package's current digests all verify, the states tree is 1257 files
and 1,437,414 bytes with the manifest matching, the index now carries an `app` digest, and the
owner's ratification is recorded as a dated question and a five word answer and claims nothing
beyond that.

It is a REJECT on two holes I built in the new code, both in surfaces this round created.
First, the dash rule's spaced hyphen is tested against the raw string, so drawing it with a no
break space on each side escapes every sweep, although the round's own `sweep_form` has already
turned those spaces into ordinary ones two lines later. Second, the new shared target walk skips
any element whose computed `clip` has no area, and `clip` has no visual effect at all unless the
element is absolutely positioned, so one inert declaration hides a visible, focusable 274 by 20
box from the 44 px rule. Both are one line fixes and both let a thing the standard forbids pass
the check that names it.

## BLOCKING

### B1. The spaced hyphen escapes when its two spaces are no break spaces

`quality/common.py`, `copy_problems`: `bad = [SPACED_HYPHEN] if SPACED_HYPHEN in text else []`
reads the raw string, while the word and vendor sweeps read `sweep_form(text)`, which maps
U+00A0, U+202F, U+2007 and U+2060 to ordinary spaces.

Executed, in a scratch copy, Today's status sentence changed from `Upper body today. One change
to review.` to `Upper body today<U+00A0>-<U+00A0>one change to review.`:
`python quality/gate.py --screens today --sizes 393x852` came back
`EARNED UI GATE: 2 FAIL, 0 WARN, 58 PASS`, and both FAIL rows are
`visual regression vs baseline`. No copy row fired in either theme. On the real client, whose
baselines are accepted from its own render, those two rows pass and the run is green. That is the
same shape as review R1's B2.

Directly on the helper: `copy_problems` of the same sentence with U+00A0 on each side of the
hyphen returns `[]`, and so does the same sentence built with U+202F, U+2007, U+2009 or U+3000,
while `sweep_form` of it already returns the plain spaced form the test would have caught. The screen reads exactly as the plain
spaced hyphen does, which is the thing STANDARD.md section 6 and the check named
`copy: no dashes, readiness words, vendor names` forbid.

The fix I would demand: test the spaced hyphen on `sweep_form(text)` rather than on `text`, and
widen the space set to every character of Unicode category Zs so U+2009 and U+3000 are folded
too. One line, plus a teeth row with a no break space on each side.

### B2. A `clip` that has no visual effect hides a visible target from the 44 px rule

`quality/common.py`, `JS_CLIPPED_AWAY`, used by `gate.py`'s `JS_SMALL` and `statesheet.py`'s
`JS_INFO`. It reads `getComputedStyle(e).clip` and skips the element when the rect has no area.
`clip` applies only to an absolutely positioned element; on anything else the computed value is
still the declared rect and the box is drawn in full. The walk does not test `position`.

Executed, two scratch copies differing by one attribute. With Today's `Eat about 2,300 kcal
today.` title given `tabindex="0"` and `height:20px`, the gate came back `4 FAIL` including
`FAIL  touch targets >= 44 px  ink-today 393x852  title 274x20.00` in both themes, which is the
new shared selector working. With the identical element given
`height:20px;clip:rect(0 0 0 0)` as well, the gate came back `2 FAIL, 0 WARN, 58 PASS` and both
FAIL rows are `visual regression vs baseline`: no target row at any size, in either theme, for a
box that is still 274 by 20 and still on the screen. I saw the same swallow on the primary
itself: `#start` held to 20 px with the same inert `clip` produced no target row.

This also contradicts the comment above the helper, which says "Anything else 1 px wide is still
a failing target: only a clip that leaves no area is skipped, never a small box". A clip that
leaves no area in the computed style is not the same thing as an element that cannot be seen.

The fix I would demand: skip only when the element is also `position: absolute` or `fixed` (the
assistive label at `app/app.html:43` is, through `app/app.css:150`), or, better, test that the
clip rect really removes the border box. One line, and the existing row q7 for the label still
passes.

## SHOULD FIX

1. **The U+2212 exception is wider than the case that justifies it.** `minus_problems` allows the
   sign whenever a digit directly follows, and the round's own measurement justifies only the
   other arm, a control whose entire label is the sign on its own line of the swept string.
   Executed: Today's status sentence changed to `Upper body today. Do 3<U+2212>5 sets.` produced
   no copy row, `2 FAIL, 0 WARN, 58 PASS`, both FAIL rows regression. A numeric range and a
   sentence like "cut it<U+2212>5 today" are dash uses and both pass. Narrow the arm to a sign
   that is not directly preceded by a digit, or drop it and keep the own line arm the W-18
   measurement actually supports.
2. **U+2043 HYPHEN BULLET is filed under Po, so the "every Pd character" rule does not reach
   it**, although it draws the same stroke; `copy_problems` of a U+2043 between two letters returns `[]` while U+2010,
   U+2012, U+2015, U+FE58 and U+FF0D all fail. The documents say Pd, so they are honest about it,
   but Q11 or the `is_dash` comment should name the one neighbour the category leaves out.
3. **Seven digests in the package's `r3` object no longer verify.** `README.md`, `STANDARD.md`,
   `INDEX.json`, `common.py`, `gate.py`, `statesheet.py` and `teeth.py` all moved in this round,
   so `r3.filesTouched` is now a historical record rather than a checkable one. Everything in
   `files` and in `r3notes.filesTouched` verifies. One clause in the `r3` object saying its
   digests are as of R3 turns seven apparent failures back into provenance.
4. **`render_one`'s `except Exception` is wide enough to swallow a refusal.** The guard that
   closes lead L5 catches everything a render raises, including `Refused`, and turns it into a
   problem row and exit 1 where the contract is a one line refusal and exit 2. Re-raise `Refused`
   before the catch. I did not build a case that reaches it; it is a reading, not a measurement.

## NOTES

**What I verified by execution and found true.** The advisory cross platform rows print on every
run and read `1.26 of 2.00 C-63 ink` against the win32 thumbnails, which is the number I computed
by hand in R3, so note 3 is closed in the strongest form. Sub pixel records behave: a record
nudged by exactly 3.00 px passes at `rect edge moved (px) 3.00 of 3.00`, 2.99 passes, and 3.01
fails and prints `element 0 "Earned" left 29.01 became 26` with `and 19 more` at the end of the
row. The worst measured rect over the whole 418 is `0.04 of 3.00` at `W-05 ink element 22
"Unsure" left`, exactly as the round reports, so the cross platform rect claim now has a real
number under it rather than a rounded zero. No app advisory line printed, so the index digest
matches this tree.

**Q11's disclosed limit, reproduced.** I copied the committed win32 T-02 thumbnails over this
platform's and re-encoded them so no byte matches: `2 renders, 0 with problems`, exit 0, with
`thumbnail mean shift 0.85 of 2.00`, and the advisory row reading the same 0.85. That is exactly
what Q11 says the byte identity FAIL does not catch, including the 0.85 figure, so the documents
say what the code does. It stays a question for the lane lead, not a finding against this round.

**The owner's word.** README section 3.1 and the package's `locked.ratification` record who was
asked, who asked, the date and time, the question in full and the answer `Yes, make it 44`, and
nothing is claimed beyond that: no board, no ruling, no second voice. I cannot verify the
conversation and I do not try to; what I checked is that the documents do not say more than they
were given, and they do not.

**Hygiene and counts.** Over the 1211 lines this round adds to the pack and the package, and over
all twelve commit messages: no U+2013, no U+2014, no vendor name, and every hit for a word off
the owner's list or for a hyphen between two spaces is either quoted evidence inside a code span,
the `SPACED_HYPHEN` literal itself, a Python or JavaScript subtraction, or `document.fonts.ready`,
which is an API name. The states tree is 1257 files and 1,437,414 bytes, the manifest digest
matches, and `INDEX.json` now carries `env` with `os`, `python`, `playwright`, `chromium`,
`launch` and `app`.

## The rows I ran

| what I did | how | exit | what came back |
|---|---|---|---|
| gate, final tree | full | 0 | `EARNED UI GATE: 0 FAIL, 0 WARN, 372 PASS`, 113 s |
| state sheet, final tree | full | 0 | `418 renders, 0 with problems`, 912 s, worst rect `0.04 of 3.00 W-05 ink element 22 "Unsure" left`, advisory `1.26 of 2.00 C-63 ink` |
| teeth, final tree | full | 0 | `TEETH: 43 rows, 0 disagreeing, 1007 s`, every row as expected, inside the 25 minute budget |
| control, sheet | `--only T-02` | 0 | `2 renders, 0 with problems` |
| the spaced hyphen with no break spaces | gate, today, 393x852 | 1 | **slipped**: no copy row, only the two regression rows. B1 |
| a range written with U+2212 | gate, today, 393x852 | 1 | **slipped**: no copy row, only the two regression rows. SHOULD FIX 1 |
| a 274x20 focusable title | gate, today, 393x852 | 1 | caught: `touch targets >= 44 px  title 274x20.00`, both themes |
| the same title plus an inert `clip` | gate, today, 393x852 | 1 | **slipped**: no target row at all. B2 |
| `#start` held to 20 px with the same inert `clip` | gate, today, 393x852 | 1 | **slipped** on targets; caught only on contrast and regression |
| the record nudged by exactly 3.00 px | `--only T-02` | 0 | `3.00 of 3.00`, inside |
| the record nudged by 3.01 px | `--only T-02` | 1 | `3.01 of 3.00`, two decimals in the row, `and 19 more` |
| the record nudged by 2.99 px | `--only T-02` | 0 | `2.99 of 3.00`, inside |
| the other platform's thumbnails copied and re-encoded | `--only T-02` | 0 | slipped, as Q11 discloses: `thumbnail mean shift 0.85 of 2.00` |

Directly on `quality/common.py`, with no browser: `copy_problems` against the plain spaced
hyphen, the same with U+00A0, U+202F, U+2007, U+2009 and U+3000, the lone U+2212 on its own line,
U+2212 followed by a digit, U+2212 followed by a space, U+2010, U+2012, U+2015, U+2043, U+FE58,
U+FF0D, a soft hyphen inside a word off the owner's list, a zero width space inside a vendor
name, and a fullwidth vendor name; and `set_x_problems` against ordinary, no break space and
fullwidth set strings.

## What I did not execute

The owner's conversation, which I cannot see. Anything on Windows: the two accept commits the
lead made there, the win32 screen baselines and both win32 `ENV.txt` files are taken on the
round's word, and so is the builder's own Windows teeth run. A full `--accept` or
`--accept-thumbs` run: the re-encoded copy was judged by an ordinary run, which calls the same
`copied_thumb_problems`, so the accept path is a reading rather than a measurement. A case that
makes a render raise `Refused` from inside `render_one`, which is why SHOULD FIX 4 is a reading.
Rows a to n of the mutation table, which I ran by hand in R3 and did not repeat here; `teeth.py`
covers them and I compared its table against my R3 rows rather than rebuilding them.

## Environment

Linux 6.18.44-fc-v37, Python 3.11.15, numpy, Pillow, playwright 1.56.0, Chromium 141.0.7390.37,
two cores. Narrowed gate rows are `--screens today --sizes 393x852` at about 40 s each; the
`--only T-02` sheet rows are 5 to 7 s.
