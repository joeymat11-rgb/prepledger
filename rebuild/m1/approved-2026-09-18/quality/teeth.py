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
review R3's notes; q1 to q6 are the PM's leads of 2026-09-19. The gate rows run with --screens and --sizes narrowed to the screen the
change is on, to stay inside the budget, so a row asserts the named refusal only: the full gate
also raises the regression rows on the screens the narrowed run drops, and a reviewer re-running
a row at full scope should expect more FAIL rows, never fewer.

A VOID row is never a pass: it says the anchor did not match, it is counted as disagreeing and
the run exits 1, so the list refuses to certify itself rather than quietly losing a tooth.

Row p1 takes the hinting argument out of the launch list. Headless Chromium hints glyphs by
default on Linux and not on win32 or darwin, so on those two the mutation changes no layout and
the row cannot fail. It is neither passed silently nor skipped silently there: the row is printed
with the words that say the argument does nothing on this platform, and counted as expected.
Exit code: 0 every row as expected, 1 any row disagrees, 2 the scratch copy could not be made.
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
for i, a in enumerate(ARGS):
    if a == '--only' and i + 1 < len(ARGS):
        ONLY = [x.strip() for x in ARGS[i + 1].split(',') if x.strip()]

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
    # the spaced hyphen drawn with a no break space on each side: the screen reads it as the
    # plain spaced hyphen, and so must the rule
    sub(work, 'app/app.html', 'Upper body today. One change to review.',
        'Upper body today\u00a0-\u00a0one change to review.')


def mut_q10(work):
    # a visible, focusable 274 by 20 box carrying a clip that its own positioning makes inert:
    # clip applies to an absolutely or fixed positioned element and to nothing else
    sub(work, 'app/app.html', '<div class="title">Eat about 2,300 kcal today.</div>',
        '<div class="title" tabindex="0" style="height:20px;clip:rect(0 0 0 0)">'
        'Eat about 2,300 kcal today.</div>')


def mut_q11(work):
    # a numeric range written with a minus sign, which is a dash and not a negative number
    sub(work, 'app/app.html', 'Upper body today. One change to review.',
        'Upper body today. Do 3\u22125 sets.')


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

def mut_none(work):
    pass


GATE_TODAY = ['quality/gate.py', '--screens', 'today', '--sizes', '393x852']
GATE_TODAY_SMALL = ['quality/gate.py', '--screens', 'today', '--sizes', '375x812,360x780']
GATE_WORKOUT = ['quality/gate.py', '--screens', 'workout', '--sizes', '393x852']
SHEET_T02 = ['quality/statesheet.py', '--only', 'T-02']
SHEET_T0 = ['quality/statesheet.py', '--only', 'T-0']
SHEET_T84 = ['quality/statesheet.py', '--only', 'T-84']
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
    ('d-1', '#start pushed 620 px down at 393x852', mut_d1, GATE_TODAY,
     dict(exit=1, fails=[('primary action in first viewport', 'bottom')], report=True)),
    ('d-2', '#start pushed 200 px down at 375x812 and 360x780 only', mut_d2, GATE_TODAY_SMALL,
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
    ('q1', 'a size the gate does not know, which used to empty the list', mut_none, GATE_BAD_SIZE,
     dict(exit=2, stdout=['REFUSED', '--sizes 390x844', 'the sizes are'])),
    ('q2', 'a word off the owner\'s list split by a soft hyphen', mut_q2, GATE_TODAY,
     dict(exit=1, fails=[(COPY_CHECK, 'U+00AD'), (COPY_CHECK, "'ready'")])),
    ('q3', 'a horizontal bar and a hyphen bullet, two dashes the old list missed', mut_q3, GATE_TODAY,
     dict(exit=1, fails=[(COPY_CHECK, repr('\u2015')), (COPY_CHECK, repr('\u2043'))])),
    ('q9', 'a spaced hyphen whose two spaces are no break spaces', mut_q9, GATE_TODAY,
     dict(exit=1, fails=[(COPY_CHECK, repr(' - '))])),
    ('q10', 'a visible 20 px target carrying a clip its positioning makes inert', mut_q10, GATE_TODAY,
     dict(exit=1, fails=[('touch targets >= 44 px', '274x20.00')])),
    ('q11', 'a numeric range written with a minus sign', mut_q11, GATE_TODAY,
     dict(exit=1, fails=[(COPY_CHECK, repr('\u2212'))])),
    ('q4', 'primary text tagged muted and painted with the muted token', mut_q4, SHEET_T02,
     dict(exit=1, stdout=['T-02', 'colour', 'became', 'colour moved (levels)'])),
    ('q8', 'a minus sign doing a dash\'s job in Today\'s status sentence', mut_q8, GATE_TODAY,
     dict(exit=1, fails=[(COPY_CHECK, repr('\u2212'))])),
    ('q5', 'one state whose apply throws', mut_q5, SHEET_T0,
     dict(exit=1, stdout=['T-02'], report='states-report-T-0.txt')),
    ('q6', '--accept pointed at another build by EARNED_APP', mut_none,
     ['quality/statesheet.py', '--accept'],
     dict(exit=2, stdout=['REFUSED', 'EARNED_APP'], app='compare')),
]


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
    fails = []
    if want.get('fails') or want.get('ratio_in'):
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
    started = time.time()
    for row_id, what, mutate, cmd, want in ROWS:
        if ONLY and row_id not in ONLY:
            continue
        if want.get('hinted') and sys.platform not in HINTED:
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
            # printed, not skipped: the row says in words why this machine cannot build it
            table.append((row_id, what, 'as expected', str(e), time.time() - t0))
            continue
        except AssertionError as e:
            table.append((row_id, what, 'VOID', str(e), time.time() - t0))
            continue
        env = dict(os.environ)
        env.pop('EARNED_APP', None)
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
    lines.append(f'TEETH: {len(table)} rows, {len(bad)} disagreeing, {time.time() - started:.0f} s')
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
    main()
