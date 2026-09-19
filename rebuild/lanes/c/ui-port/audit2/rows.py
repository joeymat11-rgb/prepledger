# -*- coding: utf-8 -*-
"""The mutation rows for the second C-UI gate teeth audit, as data.

Every row: id, source, what it changes, the edits (file, exact search text, replacement),
which script to run with which arguments, the expected catcher (the check that must name it)
and the expected refusal in words. Rows marked 'predict' are the auditor's own probes where
the prediction is that the gate does NOT refuse; a green run there is a finding, not a bug in
the row. Rows with 'hand' cannot be expressed as a text edit and say what to do by hand.
'needs' names a precondition the row does not create for itself.
'dirties_pack' means the run writes into the pack copy (an accept run): re-make the scratch
copy afterwards, and run those rows last.

Sources: R1 = the mutation table of GATE-TEETH-AUDIT-R1 (also C-UI-0 acceptance 1);
lane = C-UI-0 acceptance 13's three; rev-R1 / rev-R2 = the lane's own reviewers' rows,
carried in quality/teeth.py as m1 to m7 and n1 to n5; audit2 = this auditor's own.
Anchors read from origin/rebuild/c-ui-0-gates at ecbef86 (app/ is LOCKED and does not move;
the record colours in x2 and x3 were read from the win32 records committed at that sha).
"""

EM = chr(0x2014)     # em dash, written as a code point so this file carries no literal dash
HBAR = chr(0x2015)   # horizontal bar: a dash the sweep does not carry
SHY = chr(0x00ad)    # soft hyphen: invisible on the screen, and it breaks a word boundary
ZWSP = chr(0x200b)   # zero width space: the same trick again

CSS_ANCHOR = (':root { --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s6: 24px; '
              '--card-pad: 14px; --chev-right: 16px; }')
STATUS_RULE = ('.status-line { font-size: 15.5px; line-height: 1.3; color: var(--text-soft); '
               'margin-top: 8px; font-weight: 430; }')
TITLE_RULE = ('.tcard .title { font-size: 14.5px; line-height: 1.35; color: var(--text); '
              'font-weight: 480; }')
STATUS_HTML = '<p class="status-line" id="status-line">Upper body today. One change to review.</p>'
SANS_FACE = 'url("fonts/earned-sans.woff2")'
COPY_CHECK = 'copy: no dashes, readiness words, vendor names'

T02_BLOCK = (
    "  R('T-02', { screen: T, title: 'Preview before setup, sample marked', rules: 'none', "
    "component: 'sample note', apply: function (a) {\n"
    "    face(a, { status: 'Upper body today. Sample data.' }); a.noteBlock('#status-line', "
    "'Sample data. Set up your week to start your own.', 'sample'); primary(a, 'Set up your week');\n"
    "  } });\n")

T99_BLOCK = (
    "  R('T-99', { screen: T, title: 'Audit 2 probe: a state with no committed record', "
    "rules: 'none', component: 'probe', apply: function (a) {\n"
    "    face(a, { status: 'Upper body today. Sample data.' });\n"
    "  } });\n")

INDEX_T02 = '  {\n   "id": "T-02",\n   "screen": "today",\n   "themes": [\n    "ink",\n    "dawn"\n   ]\n  },'

GATE_TODAY = ['--screens', 'today', '--sizes', '393x852']
GATE_TODAY_SMALL = ['--screens', 'today', '--sizes', '375x812,360x780']
GATE_WORKOUT = ['--screens', 'workout', '--sizes', '393x852']


def css(rule):
    """Append one rule after the token block, the way quality/teeth.py does it."""
    return {'file': 'app/app.css', 'find': CSS_ANCHOR, 'replace': CSS_ANCHOR + '\n' + rule}


def html(find, replace, count=1):
    return {'file': 'app/app.html', 'find': find, 'replace': replace, 'count': count}


def js(find, replace, count=1):
    return {'file': 'app/states-today.js', 'find': find, 'replace': replace, 'count': count}


def marker(text):
    """A change that renders identically: it only proves the driver edited something."""
    return {'file': 'app/app.css', 'op': 'append', 'text': '\n/* audit2 ' + text + ' */\n'}


def recolour(colour):
    return [{'file': 'app/app.css', 'find': TITLE_RULE,
             'replace': TITLE_RULE.replace('var(--text)', colour)},
            {'file': 'app/app.css', 'find': STATUS_RULE,
             'replace': STATUS_RULE.replace('var(--text-soft)', colour)}]


def shift_status(px):
    return [{'file': 'app/app.css', 'find': STATUS_RULE,
             'replace': STATUS_RULE.replace('margin-top: 8px', 'margin-top: %dpx' % (8 + px))}]


ROWS = [

 dict(id='a', source='R1', minutes=3,
      what='an em dash in Today\'s status sentence',
      edits=[html('Upper body today. One change to review.',
                  'Upper body today ' + EM + ' one change to review.')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=[repr(EM)], expect_report=True,
      expect_words='FAIL on the copy sweep naming the em dash, on ink-today and dawn-today, exit 1'),

 dict(id='b1', source='R1', minutes=3,
      what='a readiness word in a card title (the R1 hole)',
      edits=[html('>Train today.<', '>Ready to train today.<')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=["'ready'"], expect_report=True,
      expect_words='FAIL on the copy sweep naming ready: the word boundary pattern must match'),

 dict(id='b2', source='R1', minutes=3,
      what='a vendor name in a card title',
      edits=[html('>Train today.<', '>Train today with Claude.<')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=["'claude'"], expect_report=True,
      expect_words='FAIL on the copy sweep naming claude'),

 dict(id='c', source='R1', minutes=4,
      what='the sans face pointed at the serif file',
      edits=[{'file': 'app/app.css', 'find': SANS_FACE, 'replace': 'url("fonts/earned-serif.woff2")'}],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='fonts pinned by sha256',
      expect_needles=['Earned Sans', 'same glyphs'], expect_report=True,
      expect_words='two FAILs: the sha256 pin on Earned Sans, and the two faces drawing the same glyphs'),

 dict(id='d-1', source='R1', minutes=4,
      what='#start pushed 630 px down at 393x852 (R1 crashed here)',
      edits=[css('#start { position: relative !important; top: 630px !important; }')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='primary action in first viewport',
      expect_needles=['bottom'], expect_report=True,
      expect_words='a FAIL line naming #start below the fold and a written report, never a Playwright stack trace'),

 dict(id='d-2', source='R1', minutes=4,
      what='#start pushed 210 px down at 375x812 and 360x780 only',
      edits=[css('@media (max-height: 820px) { #start { position: relative !important; top: 210px !important; } }')],
      runner='gate', args=GATE_TODAY_SMALL, expect_exit=1, expect_kind='FAIL',
      expect_catcher='primary action in first viewport', expect_needles=['bottom'],
      expect_words='FAIL at both small sizes, nothing at the reference size'),

 dict(id='e1', source='R1', minutes=4,
      what='Today\'s titles and status line under 4.5:1 and over 3.0:1 (the R1 hole)',
      edits=recolour('#8a8378'),
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='contrast (measured behind the text)', expect_needles=['< 4.5'],
      expect_report=True,
      expect_words='FAIL naming a ratio between 3.0 and 4.5 against the 4.5 tier: the primary tier must be reachable'),

 dict(id='e2', source='R1', minutes=4,
      what='the same text under 3.0:1',
      edits=recolour('#4a463f'),
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='contrast (measured behind the text)', expect_needles=['< 4.5'],
      expect_words='FAIL with the worst ratio under 3.0'),

 dict(id='f', source='R1', minutes=4,
      what='a keyframe animation on #start, live under reduced motion',
      edits=[css('@keyframes teeth-pulse { from { opacity: 1; } to { opacity: 0.35; } }\n'
                 '#start { animation: teeth-pulse 0.7s infinite alternate !important; }')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='no transitions or animations outside the embers',
      expect_needles=['animation start', 'px moved'],
      expect_words='two FAILs: the animation sweep names start, and nothing moves under reduced motion counts moved pixels'),

 dict(id='g', source='R1', minutes=3, only='T-02',
      what='one word of T-02\'s copy (the R1 hole)',
      edits=[js("'Sample data. Set up your week to start your own.'",
                "'Example data. Set up your week to start your own.'")],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['the visible text changed', 'T-02'],
      expect_words='the sheet names T-02, the changed words, and exits 1'),

 dict(id='g2', source='R1', minutes=3, only='T-02',
      what='an em dash inside the same state copy',
      edits=[js("'Upper body today. Sample data.'",
                "'Upper body today " + EM + " sample data.'")],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['copy: ' + repr(EM), 'T-02'],
      expect_words='the sheet names the dash AND exits 1 (in R1 it named it and exited 0)'),

 dict(id='h1', source='R1', minutes=3, only='T-02',
      what='T-02\'s status line shifted 3 px: INSIDE the tolerance, must PASS',
      edits=shift_status(3),
      runner='sheet', expect_exit=0, expect_kind='PASS',
      expect_needles=['0 with problems'],
      expect_words='exit 0: 3 px is inside the 3 px rect tolerance and inside the 2.0 level thumbnail budget'),

 dict(id='h2', source='R1', minutes=3, only='T-02',
      what='T-02\'s status line shifted 60 px',
      edits=shift_status(60),
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['became', 'T-02'],
      expect_words='the sheet names T-02, the element, the edge and the two numbers'),

 dict(id='i', source='R1', minutes=4,
      what='this platform\'s ink-today baseline deleted',
      edits=[{'file': 'quality/baseline/win32/ink-today.png', 'op': 'delete'}],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='visual regression vs baseline', expect_needles=['no baseline at'],
      needs='quality/baseline/win32/ must exist: the lane lead sets it with gate.py --accept on this PC before PR-READY. Until then this row is VOID and the whole gate run FAILs regression on all six screens.',
      expect_words='FAIL naming the missing path and the --accept remedy, never a silent set'),

 dict(id='j1', source='R1', minutes=3,
      what='EARNED_APP at an empty folder',
      edits=[marker('j1 marker, the mutation is the environment')],
      runner='gate', args=GATE_TODAY,
      env={'EARNED_APP': 'file:///C:/Users/joeym/AppData/Local/Temp/cui-audit2/empty-probe/'},
      expect_exit=2, expect_kind='REFUSE', expect_needles=['REFUSED'],
      needs='the folder %TEMP%\\cui-audit2\\empty-probe must exist and be empty (it is created by the selftest; it is outside the pack on purpose, because the driver clears quality/run before every row)',
      expect_words='exit 2, one line naming the URL and what was missing, no traceback'),

 dict(id='j2', source='R1', minutes=3,
      what='EARNED_APP at app/compare.html, a real page of the pack',
      edits=[marker('j2 marker, the mutation is the environment')],
      runner='gate', args=GATE_TODAY, env={'EARNED_APP': 'file:///<PACK>/app/compare.html'},
      expect_exit=2, expect_kind='REFUSE', expect_needles=['REFUSED'],
      expect_words='exit 2, one line naming compare.html and the missing .screen.is-active .ui'),

 dict(id='k1', source='lane', minutes=4,
      what='one RIR chip dropped',
      edits=[html('        <button class="chip" type="button" aria-pressed="false" data-rir="1">1</button>\n', '')],
      runner='gate', args=GATE_WORKOUT, expect_exit=1, expect_kind='FAIL',
      expect_catcher='RIR chips are the five locked values', expect_needles=['is not'],
      expect_words='FAIL naming the four chips that remain against the five locked values'),

 dict(id='k2', source='lane', minutes=4,
      what='a serif element switched to sans',
      edits=[{'file': 'app/app.css', 'find': '.screen-title { font-family: var(--serif);',
              'replace': '.screen-title { font-family: var(--sans);'}],
      runner='gate', args=GATE_WORKOUT, expect_exit=1, expect_kind='FAIL',
      expect_catcher='serif for names and numbers, sans for the rest',
      expect_needles=['.screen-title is Earned Sans'],
      expect_words='FAIL naming .screen-title and the face it resolved to'),

 dict(id='k3', source='lane', minutes=4,
      what='a card moved 6 px off the page margin',
      edits=[css('#card-eat { margin-left: 6px !important; }')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='page margin 22 px', expect_needles=['card-eat left 28'],
      expect_words='FAIL naming the card and its left edge at 28'),

 # ---------------- the lane's own reviewers' rows (teeth.py m1 to m7, n1 to n5) ----------------
 dict(id='m1', source='rev-R1', minutes=4,
      what='a 4 px dot pulsing for ever on a pseudo element',
      edits=[css('@keyframes teeth-blink { from { opacity: 1; } to { opacity: 0.08; } }\n'
                 '#card-eat::after { content: ""; position: absolute; right: 6px; top: 6px; width: 4px;'
                 ' height: 4px; border-radius: 50%; background: #caa98a;'
                 ' animation: teeth-blink 0.8s infinite alternate; }')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='no transitions or animations outside the embers',
      expect_needles=['animation card-eat::after'],
      expect_words='the sweep names the pseudo element, not just its host'),

 dict(id='m2', source='rev-R1', minutes=4,
      what='a transition on a pseudo element',
      edits=[css('#start::after { content: ""; position: absolute; left: 0; top: 0; width: 1px;'
                 ' height: 1px; transition: opacity 0.6s ease; }')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='no transitions or animations outside the embers',
      expect_needles=['transition start::after'], expect_words='FAIL naming start::after'),

 dict(id='m3', source='rev-R1', minutes=4,
      what='three faults in a placeholder, judged by the gate',
      edits=[html('placeholder="Your weight"', 'placeholder="Ready weight for Claude, 8 x 105"')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=["'ready'", "'claude'", "'8 x 1'"],
      expect_words='the copy sweep and the multiplication sweep both read the placeholder'),

 dict(id='m4', source='rev-R1', minutes=4,
      what='the same three faults in CSS generated content',
      edits=[css('#status-line::after { content: " Ready weight for Claude, 8 x 105"; }')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=["'ready'", "'claude'", "'8 x 1'"],
      expect_words='the sweep reads quoted generated content'),

 dict(id='m5', source='rev-R1', minutes=3, only='T-02',
      what='three faults in a placeholder, judged by the state sheet',
      edits=[html('placeholder="Your weight"', 'placeholder="Ready weight for Claude, 8 x 105"')],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=["copy: 'ready'", 'set written with the letter x'],
      expect_words='the sheet is not looser than the gate on the same string'),

 dict(id='m6', source='rev-R1', minutes=5, only='T-0',
      what='T-02 dropped from the driver, its records left committed',
      edits=[js(T02_BLOCK, '')],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['no state T-02 in the build', 'records with no state'],
      expect_words='the index comparison names the orphaned record, exit 1'),

 dict(id='m7', source='rev-R1', minutes=3, only='T-02',
      what='T-02\'s sample note hidden at opacity 0',
      edits=[css('.note-block.sample { opacity: 0 !important; }')],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['the visible text changed', 'T-02'],
      expect_words='hiding a line reads as removing it'),

 dict(id='n1', source='rev-R2', minutes=4,
      what='a set string drawn by counter() in generated content',
      edits=[css('body { counter-reset: revx 8; }\n'
                 '#status-line::after { content: " " counter(revx) " x 105"; }')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='generated content the sweep cannot read',
      expect_needles=['status-line::after'],
      expect_words='a string the sweep cannot resolve is its own FAIL, never a silent pass'),

 dict(id='n2', source='rev-R2', minutes=3, only='T-02',
      what='T-02\'s sample note hidden by clip-path: inset(100%)',
      edits=[css('.note-block.sample { clip-path: inset(100%) !important; }')],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['the visible text changed', 'T-02'],
      expect_words='the clip path leaves no area, so the line leaves the record'),

 dict(id='n3', source='rev-R2', minutes=3, only='T-02',
      what='T-02\'s sample note hidden by text-indent: -9999px',
      edits=[css('.note-block.sample { text-indent: -9999px !important; }')],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['the visible text changed', 'T-02'],
      expect_words='a text indent at or below minus 1000 px carries the line off its box'),

 dict(id='n4', source='rev-R2', minutes=3, only='T-02',
      what='a theme in the index that the sheet does not render',
      edits=[{'file': 'quality/baseline/states/INDEX.json', 'find': INDEX_T02,
              'replace': INDEX_T02.replace('"dawn"\n', '"dawn",\n    "sepia"\n')}],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['theme sepia, which the sheet does not render', 'records with no state'],
      expect_words='the index is compared as (id, theme) pairs, not ids only'),

 dict(id='n5', source='rev-R2', minutes=3, only='T-02',
      what='a theme the sheet renders that the index lost',
      edits=[{'file': 'quality/baseline/states/INDEX.json', 'find': INDEX_T02,
              'replace': INDEX_T02.replace('    "ink",\n    "dawn"\n', '    "ink"\n')}],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['T-02 theme dawn is in the build but not in', 'records with no state'],
      expect_words='a render with no index entry is wrong in the same way as a missing state'),

 dict(id='p1', source='R3', minutes=6,
      what='the Chromium launch list loses --font-render-hinting=none',
      edits=[{'file': 'quality/common.py',
              'find': "LAUNCH_ARGS = ['--allow-file-access-from-files', '--font-render-hinting=none']",
              'replace': "LAUNCH_ARGS = ['--allow-file-access-from-files']"}],
      runner='sheet', only='T-02', expect_exit=1, expect_kind='FAIL',
      expect_needles=['rect edge'],
      hand='R3 is not on origin yet: at ee1f191 quality/teeth.py has no p1 row and the launch list is the only R3 change pushed. Re-read quality/common.py and quality/teeth.py at the PR-READY sha before running this. The row is a LINUX row by construction: the lane measured that on Windows the argument changes nothing (common.py, the LAUNCH_ARGS comment), so on this PC it is expected to stay green and proves nothing. Honest verification needs a Linux run.',
      needs='a Linux machine, or the lane lead\'s Linux evidence',
      expect_words='on Linux: rect edges move far past 3 px and the sheet FAILs. On Windows: no change, which is itself the row\'s point'),

 # ---------------- audit 2's own rows, aimed where a freshly fixed gate is still soft -------------
 dict(id='x1', source='audit2', minutes=3, only='T-02',
      what='T-02 status line shifted 4 px: JUST OUTSIDE the 3 px rect tolerance',
      edits=shift_status(4),
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['top', 'became', 'T-02'],
      expect_words='the edge above the tolerance must fail: with h1 (3 px PASS) this pins the rect tolerance from both sides'),

 dict(id='x2', source='audit2', minutes=3, only='T-02',
      what='T-02 status line colour moved 3 levels: JUST INSIDE the colour tolerance',
      edits=[css(':root[data-theme="dawn"] #status-line { color: rgb(47, 43, 38) !important; }\n'
                 ':root:not([data-theme="dawn"]) #status-line { color: rgb(223, 218, 208) !important; }')],
      runner='sheet', expect_exit=0, expect_kind='PASS',
      expect_needles=['0 with problems'],
      needs='the record colours read at ee1f191: T-02 ink element 4 is [220,215,205], dawn is [44,40,35]. If R3 re-accepts the records, re-read them and rebuild this row and x3.',
      expect_words='exit 0: 3 levels is inside the 3 level tolerance'),

 dict(id='x3', source='audit2', minutes=3, only='T-02',
      what='T-02 status line colour moved 4 levels: JUST OUTSIDE it',
      edits=[css(':root[data-theme="dawn"] #status-line { color: rgb(48, 44, 39) !important; }\n'
                 ':root:not([data-theme="dawn"]) #status-line { color: rgb(224, 219, 209) !important; }')],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['colour', 'became'],
      expect_words='FAIL naming the element and the two colour triples'),

 dict(id='x4', source='audit2', minutes=4,
      what='an 18x18 px block on Today: 0.097% of the frame, JUST INSIDE the 0.1% pixel rule',
      edits=[css('#card-eat { position: relative !important; }\n'
                 '#card-eat::before { content: "" !important; position: absolute !important;'
                 ' right: 2px !important; top: 2px !important; width: 18px !important;'
                 ' height: 18px !important; background: #ff0000 !important; z-index: 9 !important; }')],
      runner='gate', args=GATE_TODAY, expect_exit=0, expect_kind='PASS',
      expect_needles=['0 FAIL'],
      needs='quality/baseline/win32/ set by the lane lead first. 393x852 is 334,836 px, so 0.1% is 334.8 px: 18x18 = 324 px = 0.0968%, and the mean shift stays near 0.2 of the 0.5 budget.',
      expect_words='PASS with the numbers printed: the regression tolerance must be reachable from below'),

 dict(id='x5', source='audit2', minutes=4,
      what='a 19x19 px block: 0.108%, JUST OUTSIDE the 0.1% pixel rule',
      edits=[css('#card-eat { position: relative !important; }\n'
                 '#card-eat::before { content: "" !important; position: absolute !important;'
                 ' right: 2px !important; top: 2px !important; width: 19px !important;'
                 ' height: 19px !important; background: #ff0000 !important; z-index: 9 !important; }')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='visual regression vs baseline', expect_needles=['% of pixels changed'],
      needs='quality/baseline/win32/ set by the lane lead first. 19x19 = 361 px = 0.1078%.',
      expect_words='FAIL on the pixel rule alone, with the mean shift still inside its own budget'),

 dict(id='x6', source='audit2', minutes=3,
      what='a readiness word split by inline markup',
      edits=[html('>Train today.<', '>R<span>eady</span> to train today.<')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=["'ready'"],
      expect_words='innerText joins inline runs, so the word is still one word to the sweep'),

 dict(id='x7', source='audit2', minutes=3,
      what='a readiness word in capitals',
      edits=[html('>Train today.<', '>READY to train today.<')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=["'ready'"],
      expect_words='the sweep lowercases before matching'),

 dict(id='x8', source='audit2', minutes=3,
      what='a readiness word split by a soft hyphen (U+00AD)',
      edits=[html('>Train today.<', '>Rea' + SHY + 'dy to train today.<')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=["'ready'"],
      predict='PASSES GREEN. common.py:copy_problems matches r"\\bready\\b" on the raw string; a soft hyphen is invisible on the screen but breaks the match. The screen reads "Ready to train today." and the gate says nothing.',
      expect_words='the owner\'s standing rule is about the word the athlete reads, not the code points'),

 dict(id='x9', source='audit2', minutes=3,
      what='a readiness word split by a zero width space (U+200B)',
      edits=[html('>Train today.<', '>Rea' + ZWSP + 'dy to train today.<')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=["'ready'"],
      predict='PASSES GREEN, same mechanism as x8. Fix for both: normalise the swept text (strip U+00AD, U+200B to U+200D, U+FEFF) before the word sweep.',
      expect_words='same rule, same expectation'),

 dict(id='x10', source='audit2', minutes=4,
      what='a dash the sweep does not carry: U+2015 horizontal bar',
      edits=[html('Upper body today. One change to review.',
                  'Upper body today ' + HBAR + ' one change to review.')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=[repr(HBAR)],
      predict='PASSES GREEN. common.py:DASHES carries only U+2014, U+2013 and " - ". U+2015, U+2010, U+2012 and U+2212 all draw a dash and none is on the list. STANDARD.md section 6 says "No dashes in interface copy", without a list.',
      expect_words='a dash is a dash on the screen'),

 dict(id='x11', source='audit2', minutes=5,
      what='a font file with the right name and different bytes',
      edits=[{'file': 'app/fonts/earned-sans.woff2', 'op': 'append_bytes', 'bytes': [0]}],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='fonts pinned by sha256', expect_needles=['pinned'],
      expect_words='the pin is on the bytes, not on the file name: one appended byte must FAIL'),

 dict(id='x12', source='audit2', minutes=5, only='T-02',
      what='a committed RECORD edited to match a mutated render (what pins the baselines?)',
      edits=[js("'Sample data. Set up your week to start your own.'",
                "'Example data. Set up your week to start your own.'"),
             {'file': 'quality/baseline/states/T-02-ink.json',
              'find': 'Sample data. Set up your week', 'replace': 'Example data. Set up your week',
              'count': 2},
             {'file': 'quality/baseline/states/T-02-dawn.json',
              'find': 'Sample data. Set up your week', 'replace': 'Example data. Set up your week',
              'count': 2}],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['thumbnail'],
      predict='PASSES GREEN. The record is a committed file like any other; nothing ties it to the design of record at 5f4cad0a. The thumbnail is 24x53 greyscale, so one changed word is far under the 2.0 level mean. A port that edits its records and its code in the same commit is green. The only guard is human review of the record diff, and README section 1 does not say so.',
      expect_words='the sheet should notice through the thumbnail, or the pack should say out loud that records are trusted input'),

 dict(id='x13', source='audit2', minutes=4, only='T-99',
      what='a NEW state with no committed record',
      edits=[js(T02_BLOCK, T02_BLOCK + T99_BLOCK)],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['no record at', 'not in'],
      expect_words='two FAILs: no record for T-99, and T-99 is in the build but not in INDEX.json'),

 dict(id='x14', source='audit2', minutes=4,
      what='a type size off the scale: the only path that can WARN and still exit 0',
      edits=[css('#status-line { font-size: 17px !important; }')],
      runner='gate', args=GATE_TODAY_SMALL, expect_exit=0, expect_kind='WARN',
      expect_catcher='type sizes and weights on the scale',
      expect_words='exit 0 with a WARN: run at the two small sizes on purpose, so the regression check (reference size only) does not mask the point. STANDARD.md section 7 item 2 calls this advisory; the audit records that a green run can carry it.'),

 dict(id='x15', source='audit2', minutes=4,
      what='a gap off the spacing scale: the second advisory path',
      edits=[css('#card-eat { margin-top: 7px !important; }')],
      runner='gate', args=GATE_TODAY, expect_exit=None, expect_kind='WARN',
      expect_catcher='gaps on the spacing scale',
      expect_words='the gaps check runs at the reference size only, where the regression check also fires on the moved card, so the exit code is not the measure here: read the WARN row'),

 dict(id='x16', source='audit2', minutes=5,
      what='a crash mid-run in the gate: what is the exit code, and is a report written?',
      edits=[html('</body>',
                  '<script>if (location.search.indexOf("screen=today") >= 0) {'
                  ' Element.prototype.getBoundingClientRect = function () {'
                  ' throw new Error("audit2 crash probe"); }; }</script>\n</body>')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='the gate finished this screen', expect_report=True,
      expect_words='exit 1, a FAIL row naming the screen and the exception, a written report: one screen dying must not lose the others'),

 dict(id='x17', source='audit2', minutes=6, only='T-0',
      what='a crash mid-run in the state sheet, after clean renders',
      edits=[html('</body>',
                  '<script>if (location.search.indexOf("state=T-03") >= 0) {'
                  ' Element.prototype.getBoundingClientRect = function () {'
                  ' throw new Error("audit2 crash probe"); }; }</script>\n</body>')],
      runner='sheet', expect_exit=1, expect_kind='FAIL', expect_needles=['the render failed'], expect_report=True,
      corrected='judgment 4ecc1012: ROW DEFECT. The prediction below was REFUTED at 64a9e095 (exit 1, T-03 isolated, the other renders clean, a written report); the row now expects the behaviour wanted, and a return to the predicted defect DISAGREES.',
      predict='exit 2 and every earlier render is lost. statesheet.py runs its whole render loop with no per state try/except (gate.py has one: "the gate finished this screen"), so one bad state ends the run, write_report never runs, and states-report-T-0.txt holds a single REFUSED line. A run of 418 renders can be killed by render 3 and look exactly like a wrong EARNED_APP.',
      expect_words='a defect in one state should be a FAIL line for that state, not a refusal for the sheet'),

 dict(id='x18', source='audit2', minutes=8, dirties_pack=True,
      what='an accept run with nothing changed: can it be mistaken for a green run?',
      edits=[marker('x18 marker: the mutation is the --accept flag')],
      runner='gate', args=['--accept'], expect_exit=0, expect_kind='PASS',
      expect_needles=['ACCEPT RUN: regression compared nothing', 'SET'],
      expect_words='exit 0, SET rows instead of PASS, the banner on line 1. Record what a CI step that reads only the exit code would see: 0, the same as green. Then read whether anything outside the report distinguishes the two.'),

 dict(id='x19', source='audit2', minutes=8, dirties_pack=True,
      what='an accept run pointed at ANOTHER build by EARNED_APP',
      edits=[marker('x19 marker: the mutation is --accept plus the environment')],
      runner='gate', args=['--accept'], env={'EARNED_APP': 'file:///<PACK>/app/states.html'},
      expect_exit=2, expect_kind='REFUSE', expect_needles=['REFUSED', 'EARNED_APP'],
      corrected='judgment 4ecc1012: ROW DEFECT. The prediction below was REFUTED at 64a9e095 (the accept run refuses before any write); the row now expects the refusal.',
      predict='the baselines of record are rewritten from a build that is not the design of record. gate.py refuses --accept with --screens or --sizes, and statesheet.py refuses --accept with --only, but neither refuses --accept with EARNED_APP set. Compare quality/baseline/win32/*.png before and after (the driver hashes them).',
      expect_words='an accept run should refuse to write the pack\'s baselines from a build it was pointed at, or say so on line 1'),

 dict(id='x20', source='audit2', minutes=4,
      what='primary body copy downgraded to the 3.0 tier by a class NAME alone',
      edits=[html(STATUS_HTML, STATUS_HTML.replace('class="status-line"', 'class="status-line from"')),
             css('#status-line { color: #8a8378 !important; }')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='contrast (measured behind the text)',
      predict='PASSES GREEN. common.py:tier_for drops to MUTED_RATIO when the element carries any word in MUTED_CLASSES, whatever the stylesheet actually paints. "from" is in that set. Run e1 first to see the same colour FAIL without the class: the pair is the finding.',
      expect_words='the tier must follow the paint, not the class name; a port renames a class and the 4.5 tier is gone'),

 dict(id='x21', source='audit2', minutes=2,
      what='the gate run with a size that does not exist: green on nothing',
      edits=[marker('x21 marker: the mutation is the argument')],
      runner='gate', args=['--screens', 'today', '--sizes', '390x844'],
      expect_exit=2, expect_kind='REFUSE', expect_needles=['REFUSED', '--sizes 390x844'],
      corrected='judgment 4ecc1012: ROW DEFECT. The prediction below was REFUTED at 64a9e095 (exit 2, a one line refusal); the row now expects the refusal, as q1 does.',
      predict='exit 0 having measured nothing. gate.py builds SIZES by filtering ALL_SIZES, so an unknown size leaves it empty, every loop is skipped and write_report prints 0 FAIL, 0 WARN, 0 PASS. The same holds for a misspelt --screens (3 PASS, one per size, from the console error row). A green exit code with no checks behind it is what the whole ticket exists to prevent.',
      expect_words='the gate should refuse an argument that selects no screen and no size'),

 dict(id='x22', source='audit2', minutes=4,
      what='a card 0.5 px off the page margin: JUST INSIDE the 0.6 px edge tolerance',
      edits=[css('#card-eat { margin-left: 0.5px !important; }')],
      runner='gate', args=GATE_TODAY_SMALL, expect_exit=0, expect_kind='PASS',
      expect_needles=['0 FAIL'],
      expect_words='PASS: EDGE_TOL is 0.6 px, and the small sizes keep the regression check out of the way'),

 dict(id='x23', source='audit2', minutes=4,
      what='a card 0.7 px off the page margin: JUST OUTSIDE it',
      edits=[css('#card-eat { margin-left: 0.7px !important; }')],
      runner='gate', args=GATE_TODAY_SMALL, expect_exit=1, expect_kind='FAIL',
      expect_catcher='page margin 22 px', expect_needles=['card-eat left'],
      expect_words='FAIL naming the card and 22.7: with k3 (6 px) this pins the margin tolerance'),

 dict(id='x24', source='audit2', minutes=3, void='judgment 4ecc1012: VOID, only a marker comment changed; row x24h is the real probe',
      what='a touch target that is not a button, an anchor or an input',
      edits=[marker('x24 marker: the real mutation is by hand, see hand')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='touch targets >= 44 px',
      hand='This one cannot be a one line text edit: it needs a tappable element that is not button/a/input. By hand, in the scratch copy, replace one tertiary link element in app/app.html with <div role="button" tabindex="0" class="link" style="height:20px">Plans changed?</div> and re-run. gate.py:JS_SMALL and statesheet.py:JS_INFO both walk "button,a,input" only, so a div with role=button is never measured, against STANDARD.md section 5 ("every target ... including the invisible hit area"). Predicted: PASSES GREEN.',
      predict='PASSES GREEN (by reading gate.py:JS_SMALL)',
      expect_words='the 44 px rule is about what the thumb can hit, not about the tag name'),

 dict(id='x25', source='audit2', minutes=6, void='judgment 4ecc1012: VOID, this row ran an unrelated command; the pack integrity check is the PM\'s own git diff of the delta, by hand',
      what='the whole pack integrity check: is anything outside quality/ and README.md changed?',
      edits=[marker('x25 marker: this row runs no script')],
      runner='gate', args=['--screens', 'today', '--sizes', '390x844'],
      expect_exit=0, expect_kind='PASS',
      hand='Run it by hand in the audit worktree, not through the driver: git diff --stat 5f4cad0a..<PR-READY sha> -- rebuild/m1/approved-2026-09-18 and read every path. C-UI-0 says app/ is LOCKED and only quality/ plus README.md may move. Anything else on that list is a blocking finding.',
      expect_words='the diff touches quality/*.py, quality/STANDARD.md, quality/baseline/** and README.md, and nothing else'),

]

ROW_BY_ID = {r['id']: r for r in ROWS}

for _r in ROWS:
    _r.setdefault('args', None)
    _r.setdefault('runner', 'gate')


# ==================== added at 64a9e095 by the second audit's executing hand ====================
# (a) every row quality/teeth.py carries at this head that the kit did not already have:
#     h3, p2, p3, p4, q1, q2, q3, q4, q5, q6, q8, q9, q10, q11. teeth.py is 46 rows at 894bb406.
# (b) the audit's own re-check rows for review R4's two blockers, with their controls and two
#     sibling probes for the judge: rb1a to rb1f (B1) and rb2a to rb2e (B2).
# Every anchor below was re-read from origin/rebuild/c-ui-0-gates at 64a9e095.
# The selftest at 64a9e095 reported 57 of 57 DRY-OK, so no anchor of the original kit moved.

NBSP = chr(0x00A0)      # NO-BREAK SPACE, the form review R4 built B1 with
NNBSP = chr(0x202F)     # NARROW NO-BREAK SPACE
FIGSP = chr(0x2007)     # FIGURE SPACE
THINSP = chr(0x2009)    # THIN SPACE
IDSP = chr(0x3000)      # IDEOGRAPHIC SPACE
MINUS = chr(0x2212)
HBULLET = chr(0x2043)   # HYPHEN BULLET, filed under Po
STATUS_SENTENCE = 'Upper body today. One change to review.'
EAT_TITLE = '<div class="title">Eat about 2,300 kcal today.</div>'
THREE_FAULTS = 'Ready weight for Claude, 8 x 105'
TARGET_CHECK = 'touch targets >= 44 px'
T02_HEAD = ("  R('T-02', { screen: T, title: 'Preview before setup, sample marked', rules: 'none', "
            "component: 'sample note', apply: function (a) {\n")
LAUNCH_ON = "LAUNCH_ARGS = ['--allow-file-access-from-files', '--font-render-hinting=none']"
GATE_BAD_SIZE = ['--screens', 'today', '--sizes', '390x844']


def spaced(ch):
    """Today's status sentence with the hyphen drawn between two copies of ch."""
    return 'Upper body today' + ch + '-' + ch + 'one change to review.'


MORE = [

 dict(id='h3', source='teeth-R3', minutes=3, only='T-02',
      what="T-02's status line shifted 4 px: the first whole pixel outside the tolerance",
      edits=shift_status(4),
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['T-02', 'became', 'rect edge moved (px)', 'thumbnail mean shift'],
      expect_words='teeth.py h3: FAIL naming T-02, the moved edge and both measures'),

 dict(id='p2', source='teeth-R3', minutes=3, only='T-02',
      what="this platform's committed thumbnail for T-02 deleted",
      edits=[{'file': 'quality/baseline/states/win32/T-02-ink.png', 'op': 'delete'}],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['no thumbnail at', 'T-02-ink.png', '--accept-thumbs'],
      expect_words='teeth.py p2: a missing thumbnail is a FAIL that names the path and the remedy'),

 dict(id='p3', source='teeth-R3', minutes=5,
      what='the hinting argument taken out of the launch list, judged by the screen gate',
      edits=[{'file': 'quality/common.py', 'find': LAUNCH_ON,
              'replace': "LAUNCH_ARGS = ['--allow-file-access-from-files']"}],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher='visual regression vs baseline', expect_needles=['of pixels changed'],
      predict='ON WINDOWS THIS ROW IS EXPECTED TO STAY GREEN. teeth.py marks p1 and p3 hinted=True: '
              'headless Chromium hints glyphs by default on linux and on no other platform the pack '
              'runs on, so on win32 the argument changes no layout and the row cannot fail. A MISMATCH '
              'here is the platform, not the gate; the honest verification is a Linux run.',
      expect_words='on Linux the rendered pixels move past the 0.1% rule; on Windows nothing moves'),

 dict(id='p4', source='teeth-R3', minutes=4, only='T-02',
      what="the other platform's T-02 thumbnails copied over this platform's",
      edits=[{'file': 'quality/baseline/states/win32/T-02-ink.png', 'op': 'copy_from',
              'from': 'quality/baseline/states/linux/T-02-ink.png'},
             {'file': 'quality/baseline/states/win32/T-02-dawn.png', 'op': 'copy_from',
              'from': 'quality/baseline/states/linux/T-02-dawn.png'}],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['is byte identical to', 'never copied', 'T-02-ink.png'],
      expect_words='teeth.py p4: a thumbnail byte identical to another platform\'s is a FAIL, '
                   'because the tolerance alone cannot tell the two sets apart'),

 dict(id='q1', source='teeth-PM', minutes=2,
      what='the gate run with a size that does not exist (the row x21 predicted green on nothing)',
      edits=[marker('q1 marker: the mutation is the argument')],
      runner='gate', args=GATE_BAD_SIZE, expect_exit=2, expect_kind='REFUSE',
      expect_needles=['REFUSED', '--sizes 390x844', 'the sizes are'],
      expect_words='exit 2 and a one line refusal naming the unknown size and the sizes that exist'),

 dict(id='q2', source='teeth-PM', minutes=3,
      what="a word off the owner's list split by a soft hyphen (the row x8 predicted green)",
      edits=[html('>Train today.<', '>Rea' + SHY + 'dy to train today.<')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=['U+00AD', "'ready'"],
      expect_words='two copy rows: the format character named by its code point, and the word the '
                   'screen reads once the format characters are stripped'),

 dict(id='q3', source='teeth-PM', minutes=3,
      what='a horizontal bar and a hyphen bullet (the row x10 predicted green on U+2015)',
      edits=[html(STATUS_SENTENCE,
                  'Upper body today ' + HBAR + ' one' + HBULLET + 'change to review.')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=[repr(HBAR), repr(HBULLET)],
      expect_words='both dashes named: U+2015 by the Pd category, U+2043 by EXTRA_DASHES'),

 dict(id='q4', source='teeth-PM', minutes=4, only='T-02',
      what='primary text tagged muted and painted with the muted token (the x20 pair, from the record side)',
      edits=[html(EAT_TITLE, '<div class="title sub">Eat about 2,300 kcal today.</div>'),
             css('.tcard .title.sub { color: var(--muted) !important; }')],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['T-02', 'colour', 'became', 'colour moved (levels)'],
      expect_words='the contrast tier alone stops nothing; what stops it is the record colour half'),

 dict(id='q5', source='teeth-PM', minutes=6, only='T-0',
      what='one state whose apply throws (the row x17 predicted the whole run is lost)',
      edits=[js(T02_HEAD, T02_HEAD + "    throw new Error('teeth q5: this state cannot apply');\n")],
      runner='sheet', expect_exit=1, expect_kind='FAIL', expect_needles=['T-02'],
      expect_report=True,
      expect_words='exit 1 with T-02 named and states-report-T-0.txt still written: one bad state '
                   'must not lose the other renders'),

 dict(id='q6', source='teeth-PM', minutes=3,
      what='statesheet --accept pointed at another build by EARNED_APP',
      edits=[marker('q6 marker: the mutation is --accept plus the environment')],
      runner='sheet', args=['--accept'],
      env={'EARNED_APP': 'file:///<PACK>/app/compare.html'},
      expect_exit=2, expect_kind='REFUSE', expect_needles=['REFUSED', 'EARNED_APP'],
      expect_words='exit 2: the sheet must refuse to write the pack records from a build it was '
                   'pointed at (the hole row x19 names on the screen gate side)'),

 dict(id='q8', source='teeth-PM', minutes=3,
      what="a minus sign doing a dash's job in Today's status sentence",
      edits=[html(STATUS_SENTENCE, 'Upper body today ' + MINUS + ' one change to review.')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=[repr(MINUS)],
      expect_words='the sign between two spaces is a dash, not a negative number'),

 dict(id='q9', source='teeth-R4', minutes=3,
      what="the lane's own B1 row: a spaced hyphen whose two spaces are no break spaces",
      edits=[html(STATUS_SENTENCE, spaced(NBSP))],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=[repr(' - ')],
      expect_words='teeth.py q9, the row the R4 fix added: the copy check names the spaced hyphen'),

 dict(id='q10', source='teeth-R4', minutes=3,
      what="the lane's own B2 row: a visible 20 px target carrying a clip its positioning makes inert",
      edits=[html(EAT_TITLE, '<div class="title" tabindex="0" style="height:20px;clip:rect(0 0 0 0)">'
                             'Eat about 2,300 kcal today.</div>')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=TARGET_CHECK, expect_needles=['274x20.00'],
      expect_words='teeth.py q10, the row the R4 fix added: the target rule names the 274 by 20 box'),

 dict(id='q11', source='teeth-R4', minutes=3,
      what='a numeric range written with a minus sign (R4 SHOULD FIX 1)',
      edits=[html(STATUS_SENTENCE, 'Upper body today. Do 3' + MINUS + '5 sets.')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=[repr(MINUS)],
      expect_words='a digit on each side is a range, which is a dash, not a negative number'),

 # ------------- the audit's own re-check of review R4 B1: the spaced hyphen, five spaces -------
 # R4 B1 built it as "Upper body today<U+00A0>-<U+00A0>one change to review." and measured
 # "2 FAIL, 0 WARN, 58 PASS", both rows visual regression, no copy row in either theme.
 # After the fix each of these must FAIL the copy check BY NAME in BOTH themes.
 dict(id='rb1a', source='audit2-R4', minutes=3,
      what="B1 exactly as R4 built it: the spaced hyphen with U+00A0 on each side",
      edits=[html(STATUS_SENTENCE, spaced(NBSP))],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=[repr(' - '), 'ink-today', 'dawn-today'],
      expect_words='a copy FAIL naming the spaced hyphen on ink-today AND on dawn-today'),

 dict(id='rb1b', source='audit2-R4', minutes=3,
      what='the same spaced hyphen with U+202F NARROW NO-BREAK SPACE on each side',
      edits=[html(STATUS_SENTENCE, spaced(NNBSP))],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=[repr(' - '), 'ink-today', 'dawn-today'],
      expect_words='a copy FAIL naming the spaced hyphen in both themes'),

 dict(id='rb1c', source='audit2-R4', minutes=3,
      what='the same spaced hyphen with U+2007 FIGURE SPACE on each side',
      edits=[html(STATUS_SENTENCE, spaced(FIGSP))],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=[repr(' - '), 'ink-today', 'dawn-today'],
      expect_words='a copy FAIL naming the spaced hyphen in both themes'),

 dict(id='rb1d', source='audit2-R4', minutes=3,
      what='the same spaced hyphen with U+2009 THIN SPACE on each side',
      edits=[html(STATUS_SENTENCE, spaced(THINSP))],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=[repr(' - '), 'ink-today', 'dawn-today'],
      expect_words='U+2009 is one of the two forms R4 named that the old NO_BREAK_SPACES list '
                   'did not carry at all: a copy FAIL in both themes'),

 dict(id='rb1e', source='audit2-R4', minutes=3,
      what='the same spaced hyphen with U+3000 IDEOGRAPHIC SPACE on each side',
      edits=[html(STATUS_SENTENCE, spaced(IDSP))],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=[repr(' - '), 'ink-today', 'dawn-today'],
      expect_words='the other form R4 named that the old list did not carry: a copy FAIL in both themes'),

 dict(id='rb1f', source='audit2-R4', minutes=3,
      what='THE CONTROL: the plain spaced hyphen, an ordinary space on each side',
      edits=[html(STATUS_SENTENCE, spaced(' '))],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=COPY_CHECK, expect_needles=[repr(' - '), 'ink-today', 'dawn-today'],
      expect_words='the case that always worked: it must still FAIL, in both themes, after the fix'),

 # ------------- the audit's own re-check of review R4 B2: the inert clip and its controls -------
 # R4 B2 built it as Today's "Eat about 2,300 kcal today." title given tabindex="0" and
 # height:20px;clip:rect(0 0 0 0) and NO positioning, and measured "2 FAIL, 0 WARN, 58 PASS",
 # both rows visual regression, no target row at any size in either theme.
 dict(id='rb2a', source='audit2-R4', minutes=3,
      what='B2 exactly as R4 built it: a visible focusable 274x20 box with an INERT clip, no positioning',
      edits=[html(EAT_TITLE, '<div class="title" tabindex="0" style="height:20px;clip:rect(0 0 0 0)">'
                             'Eat about 2,300 kcal today.</div>')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=TARGET_CHECK,
      expect_needles=['274x20.00', 'ink-today', 'dawn-today'],
      expect_words='a touch target FAIL naming title 274x20.00 on ink-today AND on dawn-today'),

 dict(id='rb2b', source='audit2-R4', minutes=3,
      what='CONTROL the fix must not break: the same box with clip AND position:absolute (truly clipped)',
      edits=[html(EAT_TITLE, '<div class="title" tabindex="0" '
                             'style="height:20px;position:absolute;clip:rect(0 0 0 0)">'
                             'Eat about 2,300 kcal today.</div>')],
      runner='gate', args=GATE_TODAY, expect_exit=None, expect_kind='PROBE',
      expect_words='NO touch target row for the title at any size in either theme. STANDARD.md '
                   'section 13 says: "A box that is positioned absolute or fixed AND clipped to '
                   'nothing, which is how the pack hides an assistive label, is not a target". The '
                   'exit code is not the measure here: taking the box out of the flow moves the '
                   'render, so the regression rows are expected to fire. Read the target rows.'),

 dict(id='rb2c', source='audit2-R4', minutes=3,
      what='CONTROL: an untouched run of the same narrowed gate (a comment appended to app.css only)',
      edits=[marker('rb2c marker: renders identically, this row is the untouched control')],
      runner='gate', args=GATE_TODAY, expect_exit=0, expect_kind='PASS',
      expect_needles=['0 FAIL'],
      expect_words='the narrowed gate is green on the unmutated pack, so every red row above is '
                   'the mutation and not the machine'),

 # Two sibling probes for the judge: neither opacity nor visibility is read by the walk, and
 # neither nulls offsetParent, so a box nobody can see is still measured against the 44 px rule.
 # The mirror image of B2: B2 was a visible box the walk skipped; these are invisible boxes the
 # walk counts. Both are recorded as facts, not as findings.
 dict(id='rb2d', source='audit2-R4', minutes=3,
      what='SIBLING PROBE: a focusable 20 px box hidden only by a zero opacity PARENT',
      edits=[html(EAT_TITLE, '<div class="title" tabindex="0" style="height:20px">'
                             'Eat about 2,300 kcal today.</div>'),
             css('#card-eat { opacity: 0 !important; }')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=TARGET_CHECK, expect_needles=['274x20.00'],
      predict='EXPECTED TO FAIL, and that is the probe. JS_SMALL skips only e.offsetParent===null '
              'and __clippedAway(e); opacity 0 on an ancestor nulls neither, so a box no eye can '
              'see and no finger can aim at is still measured against the 44 px rule.',
      expect_words='record what the walk does with an element hidden by a zero opacity parent'),

 dict(id='rb2e', source='audit2-R4', minutes=3,
      what='SIBLING PROBE: the same box with visibility:hidden inherited from its parent',
      edits=[html(EAT_TITLE, '<div class="title" tabindex="0" style="height:20px">'
                             'Eat about 2,300 kcal today.</div>'),
             css('#card-eat { visibility: hidden !important; }')],
      runner='gate', args=GATE_TODAY, expect_exit=1, expect_kind='FAIL',
      expect_catcher=TARGET_CHECK, expect_needles=['274x20.00'],
      predict='EXPECTED TO FAIL, same mechanism as rb2d: visibility:hidden does not null '
              'offsetParent and is not read by __clippedAway, while it does take the box out of '
              'the tab order, so the element is neither visible nor focusable and is still counted.',
      expect_words='record what the walk does with visibility hidden inherited'),

 # ------------- PLAN.md section 3's baseline checks, carried as rows so they land in the file ----
 dict(id='f3a', source='audit2-F', minutes=3, only='W-20',
      what='PLAN 3a: one character of a committed record far from T-02, to prove the comparison bites',
      edits=[{'file': 'quality/baseline/states/W-20-ink.json',
              'find': '"text":"example Upper body', 'replace': '"text":"Example Upper body'}],
      runner='sheet', expect_exit=1, expect_kind='FAIL',
      expect_needles=['W-20'],
      expect_words='a record the run does not otherwise touch must FAIL and name W-20'),

 dict(id='f3b1', source='audit2-F', minutes=2,
      what='PLAN 3b: gate.py --accept combined with --screens must refuse',
      edits=[marker('f3b1 marker: the mutation is the argument pair')],
      runner='gate', args=['--accept', '--screens', 'today'],
      expect_exit=2, expect_kind='REFUSE',
      expect_needles=['REFUSED', 'cannot be combined with --screens or --sizes'],
      expect_words='exit 2 before anything is written: an accept run sets EVERY baseline or none'),

 dict(id='f3b2', source='audit2-F', minutes=2,
      what='PLAN 3b: statesheet.py --accept combined with --only must refuse',
      edits=[marker('f3b2 marker: the mutation is the argument pair')],
      runner='sheet', args=['--accept', '--only', 'T-02'],
      expect_exit=2, expect_kind='REFUSE',
      expect_needles=['REFUSED', 'cannot be combined with --only'],
      expect_words='exit 2 before anything is written: an accept run writes every record or none'),

 dict(id='x24h', source='audit2-F', minutes=4,
      what="row x24's HAND mutation done as a text edit: a tertiary link turned into a "
           "div[role=button] under 44 px, which the old button,a,input walk could not see",
      edits=[html('<div class="links bottom"><button class="link" type="button" '
                  'id="plans-workout">Plans changed?</button></div>',
                  '<div class="links bottom"><div role="button" tabindex="0" '
                  'id="plans-workout" style="height:20px">Plans changed?</div></div>')],
      runner='gate', args=GATE_WORKOUT, expect_exit=1, expect_kind='FAIL',
      expect_catcher=TARGET_CHECK, expect_needles=['plans-workout'],
      predict='x24 predicted PASSES GREEN at ecbef86, when gate.py JS_SMALL walked '
              '"button,a,input" only. At this head common.TAPPABLE_SELECTOR carries [role=button] '
              'and [tabindex]:not([tabindex="-1"]) as well, so the row is expected to FAIL now. '
              'x24 itself ran only its marker edit and measured nothing about this.',
      expect_words='a touch target FAIL naming plans-workout, in both themes'),

]

ROWS.extend(MORE)
ROW_BY_ID = {r['id']: r for r in ROWS}
for _r in ROWS:
    _r.setdefault('args', None)
    _r.setdefault('runner', 'gate')
