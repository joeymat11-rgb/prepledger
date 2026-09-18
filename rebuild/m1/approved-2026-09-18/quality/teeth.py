#!/usr/bin/env python3
"""quality/teeth.py: the executable mutation list.

Copies the pack to a scratch directory, makes one forbidden change at a time, runs the scratch
copy's own gate.py or statesheet.py against it, and asserts the exact outcome: which check FAILs
with which words, or a clean refusal, or (for one row) a PASS because the change is inside the
stated tolerance. Prints a table and exits 1 if any row disagrees.

  python quality/teeth.py                  every row
  python quality/teeth.py --only c,e1,i    a few rows while iterating
  python quality/teeth.py --keep           leave the scratch directory in place afterwards

Rows a to j2 are the mutation table of GATE-TEETH-AUDIT-R1; k1 to k3 are the lane's additions.
Exit code: 0 every row as expected, 1 any row disagrees, 2 the scratch copy could not be made.
"""
import json, os, re, shutil, subprocess, sys, tempfile, time

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
    """Plain string replacement that has to match exactly once, or the row is void."""
    path = os.path.join(work, relpath.replace('/', os.sep))
    with open(path, encoding='utf-8') as f:
        s = f.read()
    n = s.count(old)
    if n != times:
        raise AssertionError(f'{relpath}: the anchor matched {n} times, expected {times}: {old[:60]}')
    with open(path, 'w', encoding='utf-8') as f:
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
    _shift_status(work, 3)      # inside the 3 px rect tolerance

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

def mut_none(work):
    pass


GATE_TODAY = ['quality/gate.py', '--screens', 'today', '--sizes', '393x852']
GATE_TODAY_SMALL = ['quality/gate.py', '--screens', 'today', '--sizes', '375x812,360x780']
GATE_WORKOUT = ['quality/gate.py', '--screens', 'workout', '--sizes', '393x852']
SHEET_T02 = ['quality/statesheet.py', '--only', 'T-02']

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
    ('h1', 'T-02\'s status line shifted 3 px (inside the tolerance)', mut_h1, SHEET_T02,
     dict(exit=0, stdout=['0 with problems'])),
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
    if want.get('report'):
        if not os.path.exists(os.path.join(work, 'quality', 'run', 'report.txt')):
            wrong.append('no report.txt was written')
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
        t0 = time.time()
        fresh(pristine, work)
        try:
            mutate(work)
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
