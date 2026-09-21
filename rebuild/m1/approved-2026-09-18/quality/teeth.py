#!/usr/bin/env python3
"""quality/teeth.py: the executable mutation list.

Copies the pack to a scratch directory, makes one forbidden change at a time, runs the scratch
copy's own gate.py or statesheet.py against it, and asserts the exact outcome: which check FAILs
with which words, or a clean refusal, or (for one row) a PASS because the change is inside the
stated tolerance. Prints a table and exits 1 if any row disagrees.

  python quality/teeth.py                  every row
  python quality/teeth.py --only c,e1,i    a few rows while iterating
  python quality/teeth.py --keep           leave the scratch directory in place afterwards

Rows a to j2 are the mutation table of GATE-TEETH-AUDIT-R1; k1 to k3 are the lane's additions;
m1 to m7 are review R1's; n1 to n5 are review R2's; p1 to p4 are the lane lead's Windows run and
review R3's notes; q1 to q11 are the PM's leads of 2026-09-19; u1 to u9, v1 to v24, w1 to w11 and
y1 and y2 are the one list of the PM's second teeth audit. Each protection of that list has a row
that goes red when that protection alone is taken out and the row is kept; where one row is held
by two protections at once (v20 by both of the phone sheet's proofs, w9 by the opener clause and
the range clause) a second row beside it isolates each. The gate rows run with --screens and
--sizes narrowed to the screen the change is on, to stay inside the budget, so a row asserts the
named refusal only: the full gate also raises the regression rows on the screens the narrowed run
drops, and a reviewer re-running a row at full scope should expect more FAIL rows, never fewer.

A VOID row is never a pass: it says the anchor did not match, it is counted as disagreeing and
the run exits 1, so the list refuses to certify itself rather than quietly losing a tooth.

Row p1 takes the hinting argument out of the launch list. Headless Chromium hints glyphs by
default on Linux and not on win32 or darwin, so on those two the mutation changes no layout and
the row cannot fail. It is neither passed silently nor skipped silently there: the row is printed
with the words that say the argument does nothing on this platform, and counted as expected.
Exit code: 0 every row as expected, 1 any row disagrees, 2 the scratch copy could not be made
or --only named nothing this list carries.
"""
import json, os, re, shutil, subprocess, sys, tempfile, time

try:   # a Windows console or a redirected log must not choke on the multiplication sign
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass
HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.abspath(os.path.join(HERE, '..'))
ARGS = sys.argv[1:]
KEEP = '--keep' in ARGS
ONLY = None
ONLY_GIVEN = '--only' in ARGS
for i, a in enumerate(ARGS):
    if a == '--only' and i + 1 < len(ARGS):
        ONLY = [x.strip() for x in ARGS[i + 1].split(',') if x.strip()]


# How deep a teeth run is allowed to stand inside another one. Four rows run teeth.py itself, to
# hold its own --only contract, so one level of nesting is the contract; two is a loop. It is not
# hypothetical: with the selection check taken out, a row that runs "--only ," selects every row,
# reaches itself, and starts again, and the copies were still multiplying twenty minutes later.
DEPTH = int(os.environ.get('EARNED_TEETH_DEPTH', '0') or '0')
MAX_DEPTH = 1


def refuse(msg):
    """One line, exit 2. A selection that names nothing this list carries is refused before any
    row runs: it used to print "0 rows, 0 disagreeing" and exit 0, which reads exactly like a
    clean run of the whole list, and a typed id is the likeliest way anyone meets it."""
    print(f'TEETH: REFUSED. {msg}')
    sys.exit(2)

APPEND_ANCHOR = ':root { --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s6: 24px; --card-pad: 14px; --chev-right: 16px; }'


# ---------------------------------------------------------------- editing the scratch copy
def sub(work, relpath, old, new, times=1):
    """Plain string replacement that has to match exactly once, or the row is void.

    A file can sit on disk with CRLF while git holds it as LF, which is what a pre R3 accept run
    in text mode left in the owner's working tree: git status is clean and nothing looks wrong,
    but an anchor that spans a line ending matches zero times and the row goes VOID. So when the
    anchor does not match, the same anchor is tried with its newlines written the way the file
    writes them, and the file keeps its own line endings on the way out.
    """
    path = os.path.join(work, relpath.replace('/', os.sep))
    with open(path, encoding='utf-8', newline='') as f:
        s = f.read()
    if s.count(old) != times and '\r\n' in s and '\n' in old:
        old, new = old.replace('\n', '\r\n'), new.replace('\n', '\r\n')
    n = s.count(old)
    if n != times:
        raise AssertionError(f'{relpath}: the anchor matched {n} times, expected {times}: {old[:60]}')
    with open(path, 'w', encoding='utf-8', newline='') as f:   # keep the file's own line endings
        f.write(s.replace(old, new))


def append_css(work, rule):
    sub(work, 'app/app.css', APPEND_ANCHOR, APPEND_ANCHOR + '\n' + rule)


EM = '\u2014'

def mut_a(work):
    sub(work, 'app/app.html', 'Upper body today. One change to review.',
        f'Upper body today {EM} one change to review.')

def mut_b1(work):
    sub(work, 'app/app.html', '>Train today.<', '>Ready to train today.<')

def mut_b2(work):
    sub(work, 'app/app.html', '>Train today.<', '>Train today with Claude.<')

def mut_c(work):
    sub(work, 'app/app.css', 'url("fonts/earned-sans.woff2")', 'url("fonts/earned-serif.woff2")')

def mut_d1(work):
    # offset, not margin: the chassis is a flex column, so a margin is absorbed by the scrolling
    # body and the primary stays on screen. An offset moves the drawn button off the viewport,
    # which is the defect the audit hit.
    append_css(work, '#start { position: relative !important; top: 630px !important; }')

def mut_d2(work):
    append_css(work, '@media (max-height: 820px) { #start { position: relative !important; top: 210px !important; } }')

def _recolour(work, colour):
    sub(work, 'app/app.css',
        '.tcard .title { font-size: 14.5px; line-height: 1.35; color: var(--text); font-weight: 480; }',
        '.tcard .title { font-size: 14.5px; line-height: 1.35; color: ' + colour + '; font-weight: 480; }')
    sub(work, 'app/app.css',
        '.status-line { font-size: 15.5px; line-height: 1.3; color: var(--text-soft); margin-top: 8px; font-weight: 430; }',
        '.status-line { font-size: 15.5px; line-height: 1.3; color: ' + colour + '; margin-top: 8px; font-weight: 430; }')

def mut_e1(work):
    _recolour(work, '#8a8378')   # under 4.5:1, over 3.0:1

def mut_e2(work):
    _recolour(work, '#4a463f')   # under 3.0:1

def mut_f(work):
    append_css(work, '@keyframes teeth-pulse { from { opacity: 1; } to { opacity: 0.35; } }\n'
                     '#start { animation: teeth-pulse 0.7s infinite alternate !important; }')

def mut_g(work):
    sub(work, 'app/states-today.js', "'Sample data. Set up your week to start your own.'",
        "'Example data. Set up your week to start your own.'")

def mut_g2(work):
    sub(work, 'app/states-today.js', "'Upper body today. Sample data.'",
        "'Upper body today " + EM + " sample data.'")

def _shift_status(work, px):
    old = '.status-line { font-size: 15.5px; line-height: 1.3; color: var(--text-soft); margin-top: 8px; font-weight: 430; }'
    sub(work, 'app/app.css', old, old.replace('margin-top: 8px', f'margin-top: {8 + px}px'))

def mut_h1(work):
    _shift_status(work, 2)      # inside the 3 px rect tolerance, with a pixel of headroom on it

def mut_h3(work):
    _shift_status(work, 4)      # the first whole pixel outside it, both halves together

def mut_h2(work):
    _shift_status(work, 60)     # far outside it

def mut_i(work):
    p = os.path.join(work, 'quality', 'baseline', sys.platform, 'ink-today.png')
    if not os.path.exists(p):
        raise AssertionError(f'there is no baseline to delete at {p}')
    os.remove(p)

def mut_k1(work):
    sub(work, 'app/app.html',
        '        <button class="chip" type="button" aria-pressed="false" data-rir="1">1</button>\n', '')

def mut_k2(work):
    sub(work, 'app/app.css', '.screen-title { font-family: var(--serif);', '.screen-title { font-family: var(--sans);')

def mut_k3(work):
    append_css(work, '#card-eat { margin-left: 6px !important; }')

# ---------------------------------------------------------------- review R1's rows
THREE_FAULTS = 'Ready weight for Claude, 8 x 105'   # a word off the list, a vendor name, a set with the letter x

def mut_m1(work):
    # a 4 px dot pulsing for ever on Today, drawn by a pseudo element
    append_css(work, '@keyframes teeth-blink { from { opacity: 1; } to { opacity: 0.08; } }\n'
                     '#card-eat::after { content: ""; position: absolute; right: 6px; top: 6px; width: 4px; height: 4px;'
                     ' border-radius: 50%; background: #caa98a; animation: teeth-blink 0.8s infinite alternate; }')

def mut_m2(work):
    append_css(work, '#start::after { content: ""; position: absolute; left: 0; top: 0; width: 1px; height: 1px;'
                     ' transition: opacity 0.6s ease; }')

def mut_m3(work):
    sub(work, 'app/app.html', 'placeholder="Your weight"', f'placeholder="{THREE_FAULTS}"')

def mut_m4(work):
    append_css(work, '#status-line::after { content: " ' + THREE_FAULTS + '"; }')

def mut_m5(work):
    mut_m3(work)   # the same placeholder, judged by the state sheet

def mut_m6(work):
    # a state dropped from the driver while its two records stay committed
    sub(work, 'app/states-today.js',
        "  R('T-02', { screen: T, title: 'Preview before setup, sample marked', rules: 'none', component: 'sample note', apply: function (a) {\n"
        "    face(a, { status: 'Upper body today. Sample data.' }); a.noteBlock('#status-line', 'Sample data. Set up your week to start your own.', 'sample'); primary(a, 'Set up your week');\n"
        "  } });\n", '')

def mut_m7(work):
    append_css(work, '.note-block.sample { opacity: 0 !important; }')

def mut_n1(work):
    # the number the screen draws is built by a counter, so the sweep cannot resolve it
    append_css(work, 'body { counter-reset: revx 8; }\n'
                     '#status-line::after { content: " " counter(revx) " x 105"; }')

def mut_n2(work):
    append_css(work, '.note-block.sample { clip-path: inset(100%) !important; }')

def mut_n3(work):
    append_css(work, '.note-block.sample { text-indent: -9999px !important; }')

INDEX_T02 = ('  {\n   "id": "T-02",\n   "screen": "today",\n   "themes": [\n    "ink",\n    "dawn"\n   ]\n  },')

def mut_n4(work):
    # a theme in the index that the sheet does not render
    sub(work, 'quality/baseline/states/INDEX.json', INDEX_T02,
        INDEX_T02.replace('"dawn"\n', '"dawn",\n    "sepia"\n'))

def mut_n5(work):
    # a theme the sheet renders that the index no longer carries
    sub(work, 'quality/baseline/states/INDEX.json', INDEX_T02,
        INDEX_T02.replace('    "ink",\n    "dawn"\n', '    "ink"\n'))

# ---------------------------------------------------------------- the lane lead's Windows run
# Headless Chromium hints glyphs by default on linux and on no other platform the pack runs on,
# and a hinted glyph's advance is snapped to a whole pixel, so a line of text comes out a few
# pixels wider or narrower and now and then wraps on a different word. common.LAUNCH_ARGS turns
# hinting off for every script; row p1 takes it out again, where it can make a difference.
HINTED = ('linux',)
HINTING_OFF = "LAUNCH_ARGS = ['--allow-file-access-from-files', '--font-render-hinting=none']"

def mut_p1(work):
    sub(work, 'quality/common.py', HINTING_OFF, "LAUNCH_ARGS = ['--allow-file-access-from-files']")

class NotHere(Exception):
    """This machine cannot carry out this row's change. The row is printed with the reason and
    counted as expected; it is never skipped in silence and never reported as a pass."""


def mut_p3(work):
    mut_p1(work)          # the same launch list, judged by the other gate


def mut_p4(work):
    # a platform's thumbnails copied from another platform's directory, which is the set the
    # tolerance cannot tell apart: the two differ by at most 1.26 of the 2.00 budget over all 418
    base = os.path.join(work, 'quality', 'baseline', 'states')
    others = [d for d in sorted(os.listdir(base))
              if d != sys.platform and os.path.isdir(os.path.join(base, d))]
    if not others:
        raise NotHere('this tree holds no other platform\'s thumbnails to copy, so the row has '
                      'nothing to build; it runs wherever a second platform has committed a set')
    for theme in ('ink', 'dawn'):
        shutil.copyfile(os.path.join(base, others[0], f'T-02-{theme}.png'),
                        os.path.join(base, sys.platform, f'T-02-{theme}.png'))


def mut_q2(work):
    # a word off the owner's list split by a soft hyphen: the screen still reads "Ready"
    sub(work, 'app/app.html', '>Train today.<', '>Rea\u00addy to train today.<')


def mut_q3(work):
    # U+2015 HORIZONTAL BAR, which the old two character list did not name, and U+2043 HYPHEN
    # BULLET, which Unicode files under Po so the category rule cannot reach it either
    sub(work, 'app/app.html', 'Upper body today. One change to review.',
        'Upper body today \u2015 one\u2043change to review.')


def mut_q9(work):
    # a raw TAB on one side of a hyphen and an ordinary space on the other, in an attribute value,
    # where a TAB survives: the screen reads a spaced hyphen and so must the rule. The old form of
    # this row put the TAB in element text, where the browser folds it to a space before innerText
    # answers, so the TAB half of the fold was held by no row. The no break space half is row w7,
    # on its own: with the fold narrowed back to the space separators this row goes quiet and w7
    # does not, and with the fold taken out altogether both do.
    sub(work, 'app/app.html', 'placeholder="Your weight"', 'placeholder="load\t- today"')


def mut_q10(work):
    # a visible, focusable 274 by 20 box carrying a clip that its own positioning makes inert:
    # clip applies to an absolutely or fixed positioned element and to nothing else
    sub(work, 'app/app.html', '<div class="title">Eat about 2,300 kcal today.</div>',
        '<div class="title" tabindex="0" style="height:20px;clip:rect(0 0 0 0)">'
        'Eat about 2,300 kcal today.</div>')


def mut_q11(work):
    # the sign pressed against a letter, which is a word and not a number: the opener clause alone
    # refuses it. The numeric range is row w9, on its own, because one needle over two faults could
    # not say which clause had gone.
    sub(work, 'app/app.html', 'Upper body today. One change to review.',
        'Upper body\u22125 today. One change to review.')


def mut_q8(work):
    # a minus sign doing a dash's job in a sentence. The same character is the whole label of the
    # decrement button on W-18, which is why the rule reads the line rather than the character.
    sub(work, 'app/app.html', 'Upper body today. One change to review.',
        'Upper body today \u2212 one change to review.')


def mut_q4(work):
    # primary text tagged with a muted class and painted with the muted token: the contrast tier
    # drops to 3.0 and the tier alone stops nothing. What stops it is the record's colour half.
    sub(work, 'app/app.html', '<div class="title">Eat about 2,300 kcal today.</div>',
        '<div class="title sub">Eat about 2,300 kcal today.</div>')
    append_css(work, '.tcard .title.sub { color: var(--muted) !important; }')


def mut_q5(work):
    # one state that cannot apply: the run must carry on and still write its report
    sub(work, 'app/states-today.js',
        "  R('T-02', { screen: T, title: 'Preview before setup, sample marked', rules: 'none', component: 'sample note', apply: function (a) {\n",
        "  R('T-02', { screen: T, title: 'Preview before setup, sample marked', rules: 'none', component: 'sample note', apply: function (a) {\n"
        "    throw new Error('teeth q5: this state cannot apply');\n")


def mut_p2(work):
    p = os.path.join(work, 'quality', 'baseline', 'states', sys.platform, 'T-02-ink.png')
    if not os.path.exists(p):
        raise AssertionError(f'there is no thumbnail to delete at {p}')
    os.remove(p)

# ------------------------------------------------- the PM's second teeth audit, batch 1 and 2
TITLE = '<div class="title">Eat about 2,300 kcal today.</div>'

def mut_u1(work):
    # one control positioned absolute, one fixed, both 30 by 20. The fixed one has no offset
    # parent, which the walks used to read as hidden, so it was never measured at all.
    sub(work, 'app/app.html', TITLE, TITLE +
        '<button type="button" id="abs20" style="position:absolute;left:30px;top:300px;'
        'width:30px;height:20px">A</button>'
        '<button type="button" id="fix20" style="position:fixed;left:30px;top:340px;'
        'width:30px;height:20px">F</button>')

def mut_u2(work):
    # inset(0 round 50%) insets nothing: the radii after "round" are a corner rounding. Reading
    # them as sides made the walk call the box empty and drop the text, contrast and all.
    # The title alone is recoloured, not the status line beside it: with both of them low the row
    # went on passing with the clause reverted, because the status line supplied the same failure.
    sub(work, 'app/app.css',
        '.tcard .title { font-size: 14.5px; line-height: 1.35; color: var(--text); font-weight: 480; }',
        '.tcard .title { font-size: 14.5px; line-height: 1.35; color: #4a463f; font-weight: 480; }')
    append_css(work, '.tcard .title { clip-path: inset(0 round 50%) !important; }')

def mut_u3(work):
    # a text indent does not move an inline box's own text, so excluding it hid readable text
    sub(work, 'app/app.html', TITLE,
        '<div class="title"><span style="text-indent:-9999px;color:#4a463f">'
        'Eat about 2,300 kcal today.</span></div>')

def mut_u4(work):
    # a set written with a fullwidth letter x, which the raw scan did not see
    sub(work, 'app/app.html', 'placeholder="Your weight"', 'placeholder="8 \uff58 105"')

def mut_u5(work):
    # "optional" written with a fullwidth letter i, on a set screen
    sub(work, 'app/states-workout.js', "'Your plan does not set a rest length.'",
        "'Your plan does not set a rest length. Opt\uff29onal.'")

def mut_u6(work):
    append_css(work, '#start { position: relative !important; left: 300px !important; }')

def mut_u7(work):
    append_css(work, '#start { opacity: 0 !important; }')

def mut_u8(work):
    append_css(work, '#rir .chip[data-rir="1"] { visibility: hidden !important; }')

def mut_u9(work):
    # left plus 3 and width plus 3: every stored edge moves 3, which the tolerance allows, and
    # the right edge moves 6, which it does not
    old = '.status-line { font-size: 15.5px; line-height: 1.3; color: var(--text-soft); margin-top: 8px; font-weight: 430; }'
    sub(work, 'app/app.css', old, old + '\n.status-line { position: relative; left: 3px; width: calc(100% + 3px); }')

# ------------------------------------------------- the PM's second teeth audit, the one list
# Most of these run one screen at one size that is NOT the reference size, which is how the rows
# above are narrowed: at 375x812 the gate measures copy, targets, contrast, the primary, the
# fonts, the margins and the type scale, and it skips the reference-only passes (the mist, the
# motion pair, the columns, the pressed state, the seams and the regression), so a row that has
# nothing to say about those costs a third of the time. A row that needs one of them says so by
# running at 393x852.
GATE_TODAY_ONE = ['quality/gate.py', '--screens', 'today', '--sizes', '375x812']
GATE_WORKOUT_ONE = ['quality/gate.py', '--screens', 'workout', '--sizes', '375x812']
SHEET_W18 = ['quality/statesheet.py', '--only', 'W-18']
FIXED_COPY = ('<p id="fixcopy" aria-label="Ready for Claude" style="position:fixed;left:24px;'
              'top:420px;width:300px;color:#4a463f">Fixed copy the sweep never read.</p>')

def mut_v1(work):
    # item 1, the gate side: one viewport fixed paragraph carrying low contrast text, an
    # assistive label with two words off the owner's lists, and a set string in generated
    # content. A fixed box has no offset parent, so none of the three was ever read.
    sub(work, 'app/app.html', TITLE, TITLE + FIXED_COPY)
    append_css(work, '#fixcopy::after { content: " 8 x 1"; }')

def mut_v2(work):
    # item 1, the sheet side: a fixed 30 by 20 control and fixed low contrast text on a state
    sub(work, 'app/app.html', TITLE, TITLE +
        '<button type="button" id="fix20" style="position:fixed;left:30px;top:300px;'
        'width:30px;height:20px">F</button>' + FIXED_COPY)

def mut_v3(work):
    # item 2 on the sheet: inset(0 round 50%) insets nothing, so the text it holds is on the
    # screen and its contrast is this check's business
    append_css(work, '.note-block.sample { clip-path: inset(0 round 50%) !important;'
                     ' color: #4a463f !important; }')

def mut_v4(work):
    # item 2 on the sheet: a text indent does not carry away an inline box's own text
    sub(work, 'app/app.html', TITLE,
        '<div class="title"><span style="text-indent:-9999px;color:#4a463f">'
        'Eat about 2,300 kcal today.</span></div>')

def mut_v5(work):
    # item 3 on the sheet: a set written with a fullwidth letter x
    sub(work, 'app/app.html', 'placeholder="Your weight"', 'placeholder="8 \uff58 105"')

def mut_v6(work):
    append_css(work, '#start { position: relative !important; top: -800px !important; }')

def mut_v7(work):
    # the primary is not on the page at all, which is a failure by name and not a silent pass
    sub(work, 'app/app.html', 'id="start"', 'id="start-renamed"')

def mut_v8(work):
    # the primary's bottom edge is 0.3 px past the viewport: a rect rounded before the comparison
    # reads 852 and says nothing
    append_css(work, '#start { position: fixed !important; margin: 0 !important;'
                     ' left: 22px !important; top: 851.8px !important; width: 349px !important;'
                     ' height: 0.5px !important; }')

def mut_v9(work):
    append_css(work, '#rir .chip[data-rir="1"] { opacity: 0 !important; }')

def mut_v10(work):
    append_css(work, '#rir .chip[data-rir="1"] { clip-path: inset(100%) !important; }')

def mut_v11(work):
    append_css(work, '#rir .chip[data-rir="1"] { position: relative !important; left: 1000px !important; }')

def mut_v12(work):
    # top plus 3 and height plus 3: both stored edges move 3, which the tolerance allows, and the
    # bottom edge moves 6, which it does not
    append_css(work, '.status-line { position: relative !important; top: 3px !important;'
                     ' padding-bottom: 3px !important; }')

def mut_v13(work):
    _shift_status(work, 3.05)   # the smallest move a two decimal record can hold past 3 px

def mut_v14(work):
    # 15.5 px becomes 16.01 px: 0.51 px, which the tolerance does not allow, and which a record
    # holding one decimal reads as exactly 0.50 and passes
    append_css(work, '.status-line { font-size: 16.01px !important; }')

def mut_v15(work):
    # a surface with a hover style and no pressed style of its own: with the pointer resting on
    # it, the idle photograph and the pressed photograph are the same picture
    append_css(work, '#recovery:hover, #recovery:active { background: #3a2f26 !important;'
                     ' border-color: #3a2f26 !important; }')

def mut_z1(work):
    # T-02's definition draws #start as its required action. Keeping the node while hiding it
    # must fail the state-primary contract by name, not only through a changed baseline record.
    append_css(work, '#start { visibility: hidden !important; }')

def mut_z2(work):
    # Remove only the action T-02's existing definition declares. The state still applies and
    # renders, so only a state-specific required-primary contract can name the missing control.
    sub(work, 'app/states-today.js',
        "    face(a, { status: 'Upper body today. Sample data.' }); a.noteBlock('#status-line', 'Sample data. Set up your week to start your own.', 'sample'); primary(a, 'Set up your week');",
        "    face(a, { status: 'Upper body today. Sample data.' }); a.noteBlock('#status-line', 'Sample data. Set up your week to start your own.', 'sample');")

T02_APPLY = ("  R('T-02', { screen: T, title: 'Preview before setup, sample marked', rules: 'none', "
             "component: 'sample note', apply: function (a) {\n")

def mut_v22(work):
    # the apply throws in one theme only: the first theme's picture is already taken when the
    # second one refuses, and no sheet may be written from the half that worked
    sub(work, 'app/states-today.js', T02_APPLY, T02_APPLY +
        "    if (document.documentElement.getAttribute('data-theme') === 'dawn') "
        "throw new Error('teeth v22: this state cannot apply in dawn');\n")

def mut_v23(work):
    # no error at all, and the driver's applied marker names another state: only the marker
    # clause can refuse this one
    sub(work, 'app/states.js', "document.documentElement.setAttribute('data-state', id);",
        "document.documentElement.setAttribute('data-state', 'T-01');")

def mut_v24(work):
    # the marker is right and an error is raised behind it: only the error clause can refuse this
    sub(work, 'app/states-today.js', T02_APPLY, T02_APPLY +
        "    setTimeout(function () { throw new Error('teeth v24: raised behind the marker'); }, 0);\n")

def mut_w1(work):
    # honest negative numbers: a colon, a slash, the multiplication sign and an equals sign
    sub(work, 'app/app.html', 'Upper body today. One change to review.',
        'Rest:\u22125 s, gain/\u22125 kg, set \u00d7\u22125 reps, delta =\u22125 kg.')

def mut_w2(work):
    # honest negative numbers: a currency sign, a quotation mark, a brace and two brackets
    sub(work, 'app/app.html', 'Upper body today. One change to review.',
        'Cost $\u22125, note "\u22125", pair {\u22125}, span (\u22125) and [\u22125].')

def mut_w3(work):
    # a comma is not on the opener list, so the sign after it is a dash
    sub(work, 'app/app.html', 'Upper body today. One change to review.',
        'Upper body today,\u22125 change to review.')

def mut_w4(work):
    # two numeric cells split by a raw TAB, which survives in an attribute value. Folded to a
    # space the pair reads as one range and the honest number is refused.
    sub(work, 'app/app.html', 'placeholder="Your weight"', 'placeholder="\u22125\t\u22128"')

def mut_w5(work):
    # the same pair split by a line break
    sub(work, 'app/app.html', 'placeholder="Your weight"', 'placeholder="\u22125\n\u22128"')

def mut_w10(work):
    # the same pair split by a carriage return. A raw one in the markup is turned into a line feed
    # by the parser before any script sees it, so it is written as a character reference, which is
    # how a carriage return really reaches an attribute value.
    sub(work, 'app/app.html', 'placeholder="Your weight"', 'placeholder="\u22125&#13;\u22128"')

def mut_w11(work):
    # two numbers drawn as two real cells in the status line: the browser puts a TAB between the
    # cells of one row when it answers innerText, and the rule reads each cell on its own
    sub(work, 'app/app.html', 'Upper body today. One change to review.',
        'Upper body today. <span style="display:table-cell;padding-right:8px">3</span>'
        '<span style="display:table-cell">\u22125</span>')

def mut_w7(work):
    # the spaced hyphen drawn with a no break space on each side, and no TAB anywhere: the screen
    # reads it as the plain spaced hyphen, and so must the rule
    sub(work, 'app/app.html', 'Upper body today. One change to review.',
        'Upper body today\u00a0-\u00a0one change to review.')

def mut_w8(work):
    # a range written with a space: the sign is opened by a space, and the nearest character
    # before that space which is not a space is a digit, so the pair is a range and not a number
    sub(work, 'app/app.html', 'Upper body today. One change to review.',
        'Upper body today. Do 3 \u22125 sets.')

def mut_w9(work):
    # a numeric range written with the minus sign and no space: a digit stands directly in front
    # of the sign, which is not on the opener list, and a digit follows it
    sub(work, 'app/app.html', 'Upper body today. One change to review.',
        'Upper body today. Do 3\u22125 sets.')

def mut_y1(work):
    # primary copy relabelled with a class off the muted list and painted a colour that is not any
    # of the pack's quiet tokens: the class alone used to buy it the 3.0 tier and 3.2 passed
    sub(work, 'app/app.html', 'class="status-line" id="status-line"',
        'class="status-line from" id="status-line"')
    append_css(work, '#status-line { color: #8a8378 !important; }')

def mut_y2(work):
    # the same colour, inside the pack's own muted recipe this time: a class off the list painted
    # with a quiet token. It sits at 3.0 and it passes, which is the tier the standard gives it.
    append_css(work, ':root[data-theme="dawn"] { --muted: #8a8378 !important; }')

def mut_none(work):
    pass


GATE_TODAY = ['quality/gate.py', '--screens', 'today', '--sizes', '393x852']
GATE_TODAY_SMALL = ['quality/gate.py', '--screens', 'today', '--sizes', '375x812,360x780']
GATE_WORKOUT = ['quality/gate.py', '--screens', 'workout', '--sizes', '393x852']
SHEET_T02 = ['quality/statesheet.py', '--only', 'T-02']
SHEET_T0 = ['quality/statesheet.py', '--only', 'T-0']
SHEET_T84 = ['quality/statesheet.py', '--only', 'T-84']
SHEET_T57 = ['quality/statesheet.py', '--only', 'T-57']
GATE_BAD_SIZE = ['quality/gate.py', '--screens', 'today', '--sizes', '390x844']

COPY_CHECK = 'copy: no dashes, readiness words, vendor names'

# id, what it changes, how to change it, what to run, what must come back
ROWS = [
    ('a',  'an em dash in Today\'s status sentence', mut_a, GATE_TODAY,
     dict(exit=1, fails=[(COPY_CHECK, repr(EM))])),
    ('b1', 'a word from the owner\'s word list in a card title', mut_b1, GATE_TODAY,
     dict(exit=1, fails=[(COPY_CHECK, "'ready'")])),
    ('b2', 'a vendor name in a card title', mut_b2, GATE_TODAY,
     dict(exit=1, fails=[(COPY_CHECK, "'claude'")])),
    ('c',  'the sans face pointed at the serif file', mut_c, GATE_TODAY,
     dict(exit=1, fails=[('fonts pinned by sha256', 'Earned Sans'),
                         ('serif and sans faces loaded and distinct', 'same glyphs')])),
    ('d-1', '#start pushed 630 px down at 393x852', mut_d1, GATE_TODAY,
     dict(exit=1, fails=[('primary action in first viewport', 'bottom')], report=True)),
    ('d-2', '#start pushed 210 px down at 375x812 and 360x780 only', mut_d2, GATE_TODAY_SMALL,
     dict(exit=1, fails=[('primary action in first viewport', 'bottom')])),
    ('e1', 'Today\'s titles and status line under 4.5:1 and over 3.0:1', mut_e1, GATE_TODAY,
     dict(exit=1, fails=[('contrast (measured behind the text)', '< 4.5')],
          ratio_in=[('contrast (measured behind the text)', 3.0, 4.5)])),
    ('e2', 'the same text under 3.0:1', mut_e2, GATE_TODAY,
     dict(exit=1, fails=[('contrast (measured behind the text)', '< 4.5')],
          ratio_in=[('contrast (measured behind the text)', 0.0, 3.0)])),
    ('f',  'a keyframe animation on #start, live under reduced motion', mut_f, GATE_TODAY,
     dict(exit=1, fails=[('no transitions or animations outside the embers', 'animation start'),
                         ('nothing moves under reduced motion', 'px moved')])),
    ('g',  'one word of T-02\'s copy', mut_g, SHEET_T02,
     dict(exit=1, stdout=['the visible text changed', 'T-02'])),
    ('g2', 'an em dash inside the same state copy', mut_g2, SHEET_T02,
     dict(exit=1, stdout=['copy: ' + repr(EM), 'T-02'])),
    # h1 sat on the boundary at 3 px, 3.00 of 3.00, so one pixel of drift on any future machine
    # turned the row that must PASS into a FAIL (review R3's note). It is 2 px now, with headroom
    # in both halves, and h3 holds the other side of the line at 4 px.
    ('h1', 'T-02\'s status line shifted 2 px (inside the tolerance)', mut_h1, SHEET_T02,
     dict(exit=0, stdout=['0 with problems'])),
    ('h3', 'T-02\'s status line shifted 4 px (outside it)', mut_h3, SHEET_T02,
     dict(exit=1, stdout=['T-02', 'became', 'rect edge moved (px)', 'thumbnail mean shift'])),
    ('h2', 'T-02\'s status line shifted 60 px', mut_h2, SHEET_T02,
     dict(exit=1, stdout=['became', 'T-02'])),
    ('i',  'this platform\'s ink-today baseline deleted', mut_i, GATE_TODAY,
     dict(exit=1, fails=[('visual regression vs baseline', 'no baseline at')])),
    ('j1', 'EARNED_APP at an empty folder', mut_none, GATE_TODAY,
     dict(exit=2, stdout=['REFUSED'], app='empty')),
    ('j2', 'EARNED_APP at app/compare.html, a real page of the pack', mut_none, GATE_TODAY,
     dict(exit=2, stdout=['REFUSED'], app='compare')),
    ('k1', 'one RIR chip dropped', mut_k1, GATE_WORKOUT,
     dict(exit=1, fails=[('RIR chips are the five locked values', 'is not')])),
    ('k2', 'a serif element switched to sans', mut_k2, GATE_WORKOUT,
     dict(exit=1, fails=[('serif for names and numbers, sans for the rest', '.screen-title is Earned Sans')])),
    ('k3', 'a card moved 6 px off the page margin', mut_k3, GATE_TODAY,
     dict(exit=1, fails=[('page margin 22 px', 'card-eat left 28')])),
    ('m1', 'a 4 px dot pulsing for ever on a pseudo element', mut_m1, GATE_TODAY,
     dict(exit=1, fails=[('no transitions or animations outside the embers', 'animation card-eat::after')])),
    ('m2', 'a transition on a pseudo element', mut_m2, GATE_TODAY,
     dict(exit=1, fails=[('no transitions or animations outside the embers', 'transition start::after')])),
    ('m3', 'three faults in a placeholder, judged by the gate', mut_m3, GATE_TODAY,
     dict(exit=1, fails=[(COPY_CHECK, "'ready'"), (COPY_CHECK, "'claude'"),
                         ('the multiplication sign in every set string', "'8 x 1'")])),
    ('m4', 'the same three faults in CSS generated content', mut_m4, GATE_TODAY,
     dict(exit=1, fails=[(COPY_CHECK, "'ready'"), (COPY_CHECK, "'claude'"),
                         ('the multiplication sign in every set string', "'8 x 1'")])),
    ('m5', 'three faults in a placeholder, judged by the state sheet', mut_m5, SHEET_T02,
     dict(exit=1, stdout=["copy: 'ready'", 'set written with the letter x'])),
    ('m6', 'T-02 dropped from the driver, its records left committed', mut_m6, SHEET_T0,
     dict(exit=1, stdout=['no state T-02 in the build', 'records with no state'])),
    ('m7', "T-02's sample note hidden at opacity 0", mut_m7, SHEET_T02,
     dict(exit=1, stdout=['the visible text changed', 'T-02'])),
    ('n1', 'a set string drawn by counter() in generated content', mut_n1, GATE_TODAY,
     dict(exit=1, fails=[('generated content the sweep cannot read', 'status-line::after')])),
    ('n2', "T-02's sample note hidden by clip-path: inset(100%)", mut_n2, SHEET_T02,
     dict(exit=1, stdout=['the visible text changed', 'T-02'])),
    ('n3', "T-02's sample note hidden by text-indent: -9999px", mut_n3, SHEET_T02,
     dict(exit=1, stdout=['the visible text changed', 'T-02'])),
    ('n4', 'a theme in the index that the sheet does not render', mut_n4, SHEET_T02,
     dict(exit=1, stdout=['theme sepia, which the sheet does not render', 'records with no state'])),
    ('n5', 'a theme the sheet renders that the index lost', mut_n5, SHEET_T02,
     dict(exit=1, stdout=['T-02 theme dawn is in the build but not in', 'records with no state'])),
    # p1 is judged on T-84, where the round's own evidence says the mutation is loudest: the
    # unhinted line wraps and "Nothing was recorded." moves 170 px of the 3 allowed, instead of the
    # 4 px of 3 it moves on T-02, which was one pixel of headroom. The pixel values belong to this
    # machine, so the row asserts the words around them.
    ('p1', 'the hinting argument taken out of the launch list', mut_p1, SHEET_T84,
     dict(exit=1, stdout=['T-84', 'element 10 "Nothing was recorded." left', 'rect edge moved (px)'],
          hinted=True)),
    ('p2', "this platform's thumbnail for T-02 deleted", mut_p2, SHEET_T02,
     dict(exit=1, stdout=['no thumbnail at', 'T-02-ink.png', '--accept-thumbs'])),
    ('p3', 'the same launch list, judged by the screen gate', mut_p3, GATE_TODAY,
     dict(exit=1, fails=[('visual regression vs baseline', 'of pixels changed')], hinted=True)),
    ('p4', "the other platform's T-02 thumbnails copied over this platform's", mut_p4, SHEET_T02,
     dict(exit=1, stdout=['is byte identical to', 'never copied', 'T-02-ink.png'])),
    ('u1', 'a 20 px control positioned absolute and one positioned fixed', mut_u1,
     GATE_TODAY_ONE,
     dict(exit=1, fails=[('touch targets >= 44 px', 'abs20 30.00x20.00'),
                         ('touch targets >= 44 px', 'fix20 30.00x20.00')])),
    ('u2', 'text hidden from the walk by inset(0 round 50%), which insets nothing', mut_u2,
     GATE_TODAY_ONE,
     dict(exit=1, fails=[('contrast (measured behind the text)', '< 4.5')])),
    ('u3', 'an inline span excluded by a text indent that does not move its text', mut_u3,
     GATE_TODAY_ONE,
     dict(exit=1, fails=[('contrast (measured behind the text)', '< 4.5')])),
    ('u4', 'a set written with a fullwidth letter x', mut_u4, GATE_TODAY_ONE,
     dict(exit=1, fails=[('the multiplication sign in every set string', "'8 x 1'")])),
    ('u5', '"optional" written with a fullwidth letter, on a set screen', mut_u5,
     ['quality/statesheet.py', '--only', 'W-43'],
     dict(exit=1, stdout=['copy: "optional" on a set screen'])),
    ('u6', 'the primary pushed sideways out of the viewport', mut_u6, GATE_TODAY_ONE,
     dict(exit=1, fails=[('primary action in first viewport', 'right')])),
    ('u7', 'the primary at opacity 0', mut_u7, GATE_TODAY_ONE,
     dict(exit=1, fails=[('primary action in first viewport', 'is not drawn on the screen')])),
    ('u8', 'an RIR chip at visibility hidden', mut_u8, GATE_WORKOUT_ONE,
     dict(exit=1, fails=[('RIR chips are the five locked values', 'not visible')])),
    ('u9', "T-02's status line moved 3 px left and widened 3 px, so its right edge moves 6",
     mut_u9, SHEET_T02,
     dict(exit=1, stdout=['T-02', 'right', 'rect edge moved (px)'])),
    # ---------------------------------------------------------- the one list of the second audit
    ('v1', 'a viewport fixed paragraph: its label, its generated set and its contrast', mut_v1,
     GATE_TODAY_ONE,
     dict(exit=1, fails=[(COPY_CHECK, "'ready'"), (COPY_CHECK, "'claude'"),
                         ('the multiplication sign in every set string', "'8 x 1'"),
                         ('contrast (measured behind the text)', '< 4.5')])),
    ('v2', 'a fixed 20 px control and fixed text on a state', mut_v2, SHEET_T02,
     dict(exit=1, stdout=['fix20 30.00x20.00', 'contrast:', 'T-02'])),
    ('v3', 'a state\'s note under inset(0 round 50%), which insets nothing', mut_v3, SHEET_T02,
     dict(exit=1, stdout=['contrast:', 'T-02'])),
    ('v4', 'an inline span on a state under an indent that does not move its text', mut_v4,
     SHEET_T02, dict(exit=1, stdout=['contrast:', 'T-02'])),
    ('v5', 'a set written with a fullwidth letter x, judged by the state sheet', mut_v5, SHEET_T02,
     dict(exit=1, stdout=['set written with the letter x', 'T-02'])),
    ('v6', 'the primary pushed above the top of the viewport', mut_v6, GATE_TODAY_ONE,
     dict(exit=1, fails=[('primary action in first viewport', '< 0')])),
    ('v7', 'the primary not on the page at all', mut_v7, GATE_TODAY_ONE,
     dict(exit=1, fails=[('primary action in first viewport', 'is not on the page')])),
    ('v8', "the primary's bottom edge 0.3 px past the viewport", mut_v8, SHEET_T02,
     dict(exit=1, stdout=['outside the first viewport: bottom 852.3', 'T-02'])),
    ('v9', 'an RIR chip at opacity 0', mut_v9, GATE_WORKOUT_ONE,
     dict(exit=1, fails=[('RIR chips are the five locked values', 'not visible')])),
    ('v10', 'an RIR chip clipped away by clip-path: inset(100%)', mut_v10, GATE_WORKOUT_ONE,
     dict(exit=1, fails=[('RIR chips are the five locked values', 'not visible')])),
    ('v11', 'an RIR chip pushed off the side of the viewport', mut_v11, GATE_WORKOUT_ONE,
     dict(exit=1, fails=[('RIR chips are the five locked values', 'not visible')])),
    ('v12', "T-02's status line moved 3 px down and grown 3 px, so its bottom edge moves 6",
     mut_v12, SHEET_T02, dict(exit=1, stdout=['" bottom ', 'rect edge moved (px)', 'T-02'])),
    ('v13', "T-02's status line moved 3.05 px, the smallest move a record can hold past 3",
     mut_v13, SHEET_T02, dict(exit=1, stdout=['became', 'rect edge moved (px)', 'T-02'])),
    ('v14', "T-02's status line at 16.01 px, which is 0.51 px off the record", mut_v14, SHEET_T02,
     dict(exit=1, stdout=['" font size ', 'T-02'])),
    ('v15', 'a surface with a hover style and no pressed style of its own', mut_v15, GATE_TODAY,
     dict(exit=1, fails=[('pressed state on every tappable surface', '#recovery')])),
    ('z1', "T-02's required primary retained but hidden", mut_z1, SHEET_T02,
     dict(exit=1, stdout=['required primary action #start is not drawn', 'T-02'])),
    ('z2', "T-02's required primary absent from the page", mut_z2, SHEET_T02,
     dict(exit=1, stdout=['required primary action #start is not on the page', 'T-02'])),
    ('z3', 'T-57 explanation-only panel intentionally has no primary', mut_none, SHEET_T57,
     dict(exit=0, stdout=['0 with problems'], not_stdout=['required primary action'])),
    ('v16', 'teeth --only with an id this list does not carry', mut_none,
     ['quality/teeth.py', '--only', 'zzz'],
     dict(exit=2, stdout=['REFUSED', 'zzz', 'does not carry'])),
    ('v17', 'teeth --only with one id it carries and one it does not', mut_none,
     ['quality/teeth.py', '--only', 'q1,zzz'],
     dict(exit=2, stdout=['REFUSED', 'zzz'], not_stdout=['enumerated'])),
    ('v18', 'teeth --only with a selection that names nothing', mut_none,
     ['quality/teeth.py', '--only', ','],
     dict(exit=2, stdout=['REFUSED', 'was given no id'])),
    ('v19', 'teeth --only with an id it carries, which must run a row', mut_none,
     ['quality/teeth.py', '--only', 'q1'],
     dict(exit=0, stdout=['TEETH: 1 rows, 0 disagreeing',
                          'rows: 1 enumerated, 1 run, 0 not run'])),
    ('v20', 'the phone sheet asked for a state whose apply throws', mut_q5,
     ['quality/phonesheet.py', '--state', 'T-02'],
     dict(exit=2, stdout=['REFUSED', 'T-02', 'no sheet is written'],
          nofiles=['quality/run/phonesheet-T-02.png'])),
    ('v21', 'the phone sheet asked for a state that applies', mut_none,
     ['quality/phonesheet.py', '--state', 'T-14'],
     dict(exit=0, stdout=['wrote'], files=['quality/run/phonesheet-T-14.png'])),
    ('v22', 'the phone sheet asked for a state whose apply throws in one theme only', mut_v22,
     ['quality/phonesheet.py', '--state', 'T-02'],
     dict(exit=2, stdout=['REFUSED', 'T-02', 'theme dawn', 'no sheet is written'],
          nofiles=['quality/run/phonesheet-T-02.png'])),
    ('v23', 'the phone sheet asked for a state whose applied marker names another state', mut_v23,
     ['quality/phonesheet.py', '--state', 'T-02'],
     dict(exit=2, stdout=['REFUSED', 'T-02', "marker reads 'T-01'", 'no sheet is written'],
          nofiles=['quality/run/phonesheet-T-02.png'])),
    ('v24', 'the phone sheet asked for a state that raises an error behind a correct marker',
     mut_v24, ['quality/phonesheet.py', '--state', 'T-02'],
     dict(exit=2, stdout=['REFUSED', 'T-02', 'raised an error while it applied', 'teeth v24'],
          nofiles=['quality/run/phonesheet-T-02.png'])),
    ('w1', 'negative numbers after a colon, a slash, the multiplication sign and an equals sign',
     mut_w1, GATE_TODAY_ONE, dict(exit=0, absent=[(COPY_CHECK, '\u2212')],
                                  stdout=['0 FAIL'])),
    ('w2', 'negative numbers after a currency sign, a quotation mark, a brace and a bracket',
     mut_w2, GATE_TODAY_ONE, dict(exit=0, absent=[(COPY_CHECK, '\u2212')],
                                  stdout=['0 FAIL'])),
    ('w3', 'a minus sign after a comma, which is not on the opener list', mut_w3, GATE_TODAY_ONE,
     dict(exit=1, fails=[(COPY_CHECK, repr('\u2212'))])),
    ('w4', 'two signed numbers in two cells split by a raw TAB', mut_w4, GATE_TODAY_ONE,
     dict(exit=0, absent=[(COPY_CHECK, '\u2212')], stdout=['0 FAIL'])),
    ('w5', 'two signed numbers split by a line break', mut_w5, GATE_TODAY_ONE,
     dict(exit=0, absent=[(COPY_CHECK, '\u2212')], stdout=['0 FAIL'])),
    ('w10', 'two signed numbers split by a carriage return', mut_w10, GATE_TODAY_ONE,
     dict(exit=0, absent=[(COPY_CHECK, '\u2212')], stdout=['0 FAIL'])),
    ('w11', 'two numbers in two real cells of one row, the second of them signed', mut_w11,
     GATE_TODAY_ONE, dict(exit=0, absent=[(COPY_CHECK, '\u2212')], stdout=['0 FAIL'])),
    ('w6', "W-18's decrement button, whose whole label is the sign", mut_none, SHEET_W18,
     dict(exit=0, stdout=['0 with problems'])),
    ('w7', 'a spaced hyphen whose two spaces are no break spaces', mut_w7,
     GATE_TODAY_ONE, dict(exit=1, fails=[(COPY_CHECK, repr(' - '))])),
    ('w8', 'a minus sign after a space, with a digit before that space', mut_w8, GATE_TODAY_ONE,
     dict(exit=1, fails=[(COPY_CHECK, repr('\u2212'))])),
    ('w9', 'a minus sign written as a numeric range', mut_w9, GATE_TODAY_ONE,
     dict(exit=1, fails=[(COPY_CHECK, repr('\u2212'))])),
    ('y1', 'primary copy relabelled with a muted class and painted no quiet token', mut_y1,
     GATE_TODAY_ONE,
     dict(exit=1, fails=[('contrast (measured behind the text)', '< 4.5')],
          ratio_in=[('contrast (measured behind the text)', 3.0, 4.5)])),
    ('y2', 'the same colour inside the muted recipe, which sits at 3.0 and passes', mut_y2,
     GATE_TODAY_ONE, dict(exit=0, absent=[('contrast (measured behind the text)', '<')],
                          stdout=['0 FAIL'])),
    ('q1', 'a size the gate does not know, which used to empty the list', mut_none, GATE_BAD_SIZE,
     dict(exit=2, stdout=['REFUSED', '--sizes 390x844', 'the sizes are'])),
    ('q2', 'a word off the owner\'s list split by a soft hyphen', mut_q2, GATE_TODAY,
     dict(exit=1, fails=[(COPY_CHECK, 'U+00AD'), (COPY_CHECK, "'ready'")])),
    ('q3', 'a horizontal bar and a hyphen bullet, two dashes the old list missed', mut_q3, GATE_TODAY,
     dict(exit=1, fails=[(COPY_CHECK, repr('\u2015')), (COPY_CHECK, repr('\u2043'))])),
    ('q9', 'a spaced hyphen whose two spaces are a raw TAB and an ordinary space', mut_q9,
     GATE_TODAY_ONE,
     dict(exit=1, fails=[(COPY_CHECK, repr(' - '))])),
    ('q10', 'a visible 20 px target carrying a clip its positioning makes inert', mut_q10, GATE_TODAY,
     dict(exit=1, fails=[('touch targets >= 44 px', '274x20.00')])),
    ('q11', 'a minus sign pressed against a letter', mut_q11, GATE_TODAY_ONE,
     dict(exit=1, fails=[(COPY_CHECK, repr('\u2212'))])),
    ('q4', 'primary text tagged muted and painted with the muted token', mut_q4, SHEET_T02,
     dict(exit=1, stdout=['T-02', 'colour', 'became', 'colour moved (levels)'])),
    ('q8', 'a minus sign doing a dash\'s job in Today\'s status sentence', mut_q8, GATE_TODAY,
     dict(exit=1, fails=[(COPY_CHECK, repr('\u2212'))])),
    # the catcher names the guarded render's own line: the state, and the first line of the
    # error it raised. An exit code and a bare "T-02" could be supplied by any other problem.
    ('q5', 'one state whose apply throws', mut_q5, SHEET_T0,
     dict(exit=1, stdout=['T-02', 'state did not apply',
                          'teeth q5: this state cannot apply'],
          report='states-report-T-0.txt')),
    ('q6', '--accept pointed at another build by EARNED_APP', mut_none,
     ['quality/statesheet.py', '--accept'],
     dict(exit=2, stdout=['REFUSED', 'EARNED_APP'], app='compare')),
]


def check_selection():
    """--only must name rows this list carries, and must name at least one."""
    ids = [r[0] for r in ROWS]
    if ONLY_GIVEN and not ONLY:
        refuse('--only was given no id: name at least one of the ' + str(len(ids))
               + ' rows this list carries, or leave --only off to run them all')
    if ONLY:
        unknown = [x for x in ONLY if x not in ids]
        if unknown:
            refuse('--only names ' + ', '.join(unknown) + ', which this list does not carry; it '
                   'carries ' + str(len(ids)) + ' rows, and "python quality/teeth.py" prints them')


def fresh(pristine, work):
    if os.path.exists(work):
        shutil.rmtree(work)
    os.makedirs(work)
    for part in ('app', 'quality'):
        shutil.copytree(os.path.join(pristine, part), os.path.join(work, part))


def judge(row_id, want, proc, work):
    """Return an empty list when the row came back exactly as the table says."""
    wrong = []
    if proc.returncode != want['exit']:
        wrong.append(f'exit {proc.returncode}, expected {want["exit"]}')
    out = proc.stdout + proc.stderr
    if 'Traceback' in out:
        wrong.append('it printed a traceback')
    for needle in want.get('stdout', []):
        if needle not in out:
            wrong.append(f'"{needle}" is not in the output')
    for needle in want.get('not_stdout', []):
        if needle in out:
            wrong.append(f'"{needle}" is in the output and this row says it must not be')
    fails = []
    if want.get('fails') or want.get('ratio_in') or want.get('absent'):
        rp = os.path.join(work, 'quality', 'run', 'report.json')
        try:
            with open(rp, encoding='utf-8') as f:
                rows = json.load(f)
        except Exception:
            wrong.append('no report.json was written')
            rows = []
        fails = [r for r in rows if r[0] == 'FAIL']
        for check, needle in want.get('fails', []):
            hit = [r for r in fails if r[1] == check and needle in r[3]]
            if not hit:
                near = '; '.join(sorted({r[1] for r in fails})) or 'nothing failed'
                wrong.append(f'no FAIL on "{check}" saying "{needle}" (the run failed: {near})')
    # a row can assert that a check did NOT fail, which is how an honest case is held: a negative
    # control that only says "exit 0" would go on passing if the check stopped running at all
    for check, needle in want.get('absent', []):
        hit = [r for r in fails if r[1] == check and needle in r[3]]
        if hit:
            wrong.append(f'"{check}" failed saying "{hit[0][3][:70]}" and this row says it must not')
    for f in want.get('files', []):
        if not os.path.exists(os.path.join(work, f.replace('/', os.sep))):
            wrong.append(f'{f} was not written')
    for f in want.get('nofiles', []):
        if os.path.exists(os.path.join(work, f.replace('/', os.sep))):
            wrong.append(f'{f} was written and this row says it must not be')
    for check, lo, hi in want.get('ratio_in', []):
        vals = [float(m) for r in fails if r[1] == check for m in re.findall(r'(\d+\.\d+) <', r[3])]
        if not vals:
            wrong.append(f'no contrast ratio was printed for "{check}"')
        elif not (lo <= min(vals) < hi):
            wrong.append(f'the worst ratio on "{check}" is {min(vals)}, expected {lo} to {hi}')
    name = want.get('report')
    if name is True or want.get('report') is True:
        name = 'report.txt'
    if name:
        if not os.path.exists(os.path.join(work, 'quality', 'run', name)):
            wrong.append(f'no {name} was written')
    return wrong


def main():
    try:
        tmp = tempfile.mkdtemp(prefix='earned-teeth-')
        pristine = os.path.join(tmp, 'pristine')
        os.makedirs(pristine)
        for part in ('app', 'quality'):
            shutil.copytree(os.path.join(PACK, part), os.path.join(pristine, part),
                            ignore=shutil.ignore_patterns('run', '__pycache__'))
        empty = os.path.join(tmp, 'empty-folder')
        os.makedirs(empty, exist_ok=True)
    except Exception as e:
        print(f'TEETH: REFUSED. the scratch copy of {PACK} could not be made: {type(e).__name__}: {e}')
        sys.exit(2)

    work = os.path.join(tmp, 'work')
    table = []
    enumerated = [r for r in ROWS if not ONLY or r[0] in ONLY]
    skipped = []
    started = time.time()
    for row_id, what, mutate, cmd, want in enumerated:
        if want.get('hinted') and sys.platform not in HINTED:
            skipped.append(row_id)
            # neither passed silently nor skipped silently: the row is printed, with the reason
            table.append((row_id, what, 'as expected',
                          f'glyphs are not hinted on {sys.platform}, so taking the argument out of '
                          'the launch list moves nothing here and this row cannot fail; it is a '
                          f'row of the platforms that hint, which are {", ".join(HINTED)}', 0.0))
            continue
        t0 = time.time()
        fresh(pristine, work)
        try:
            mutate(work)
        except NotHere as e:
            # printed, not skipped in silence: the row says in words why this machine cannot
            # build it, and it is counted as a row this platform did not run
            skipped.append(row_id)
            table.append((row_id, what, 'as expected', str(e), time.time() - t0))
            continue
        except AssertionError as e:
            table.append((row_id, what, 'VOID', str(e), time.time() - t0))
            continue
        env = dict(os.environ)
        env.pop('EARNED_APP', None)
        env['EARNED_TEETH_DEPTH'] = str(DEPTH + 1)
        if want.get('app') == 'empty':
            env['EARNED_APP'] = _file_url(empty) + '/'
        elif want.get('app') == 'compare':
            env['EARNED_APP'] = _file_url(os.path.join(work, 'app', 'compare.html'))
        proc = subprocess.run([sys.executable] + cmd, cwd=work, env=env,
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        wrong = judge(row_id, want, proc, work)
        table.append((row_id, what, 'as expected' if not wrong else 'DISAGREES',
                      '' if not wrong else '; '.join(wrong), time.time() - t0))

    lines = []
    bad = [r for r in table if r[2] != 'as expected']
    # The head line keeps the form every earlier receipt and the audit's own rows read ("N rows, M
    # disagreeing, S s"), and the line under it says what that N is made of: what this machine
    # ENUMERATED, what it RAN, and what it could not run here. A row counted as expected because
    # the platform cannot build its change is not a row that ran, and a head line alone cannot be
    # read for how much of the list this machine actually proved.
    lines.append(f'TEETH: {len(table)} rows, {len(bad)} disagreeing, {time.time() - started:.0f} s')
    lines.append(f'rows: {len(enumerated)} enumerated, {len(table) - len(skipped)} run, '
                 f'{len(skipped)} not run on {sys.platform}'
                 + (f' ({", ".join(skipped)})' if skipped else ''))
    lines.append(f'pack under test: {PACK}')
    lines.append(f'selection: {", ".join(ONLY) if ONLY else "every row"}')
    lines.append('')
    lines.append(f'{"row":5s} {"mutation":58s} {"verdict":12s} note')
    for row_id, what, verdict, note, secs in table:
        lines.append(f'{row_id:5s} {what[:58]:58s} {verdict:12s} {note}')
    print('\n'.join(lines))
    try:
        out = os.path.join(PACK, 'quality', 'run')
        os.makedirs(out, exist_ok=True)
        with open(os.path.join(out, 'teeth-report.txt'), 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines) + '\n')
    except Exception:
        pass
    if KEEP:
        print('scratch copy left at', tmp)
    else:
        shutil.rmtree(tmp, ignore_errors=True)
    sys.exit(1 if bad else 0)


def _file_url(path):
    import pathlib
    return pathlib.Path(path).as_uri()


if __name__ == '__main__':
    if DEPTH > MAX_DEPTH:
        refuse(f'this run stands {DEPTH} deep inside another teeth run, and the list nests one '
               'level only, for the rows that hold teeth.py\'s own --only contract')
    check_selection()
    main()
