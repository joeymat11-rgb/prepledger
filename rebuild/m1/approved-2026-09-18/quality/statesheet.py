#!/usr/bin/env python3
"""State sheet: render every registered state in both themes, check each one, compare it to its
committed record, and tile them per screen.

  python quality/statesheet.py                  check every state against quality/baseline/states/
  python quality/statesheet.py --only T-02      one state family while iterating
  python quality/statesheet.py --accept         write the records (on purpose only)
  python quality/statesheet.py --accept-thumbs  set this platform's thumbnails, compare the rest

A record has two halves. The JSON half (the text, the rects, the colours, the families, the
sizes) is one shared set under quality/baseline/states/ and is read on every platform. The
thumbnail half is a raster, and rasterisation is a property of the machine, so thumbnails are
filed under quality/baseline/states/<sys.platform>/ the way the screen baselines already are,
with an ENV.txt beside them. --accept writes the shared records, the index and this platform's
thumbnails; --accept-thumbs is the tool for the second platform, which compares every render
against the shared records and writes only thumbnails, and only when every render was clean.

Point it at another build (the real client's preview) with EARNED_APP=<url or file:// path>: the
records are keyed by state id and theme, so the same records judge the client.

Writes quality/run/states/<id>-<theme>.png, quality/run/statesheet-<screen>.jpg and
quality/run/states-report.txt. Exit code: 0 every render clean and within tolerance, 1 any
problem, 2 refused (it could not run).
"""
import asyncio, os, io, sys, re, json, platform as plat
import numpy as np
from PIL import Image, ImageDraw
from playwright.async_api import async_playwright

try:   # a Windows console or a redirected log must not choke on the multiplication sign
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import (copy_problems, set_x_problems, tier_for, worst_ratio, app_url, label_font,
                    Refused, JS_SWEPT_TEXT, JS_SEEN, UNREADABLE_CHECK, LAUNCH_ARGS,
                    platform_key, playwright_version, env_text, app_digest,
                    TAPPABLE_SELECTOR, TARGET_PX, JS_CLIPPED_AWAY)

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
APP = app_url()
OUT = os.path.join(ROOT, 'quality', 'run', 'states'); os.makedirs(OUT, exist_ok=True)
RUN = os.path.join(ROOT, 'quality', 'run')
BASE = os.path.join(ROOT, 'quality', 'baseline', 'states')
THUMBS = os.path.join(BASE, platform_key())   # this platform's thumbnails and their ENV.txt

ARGS = sys.argv[1:]
ACCEPT = '--accept' in ARGS
ACCEPT_THUMBS = '--accept-thumbs' in ARGS
ONLY = None
for i, a in enumerate(ARGS):
    if a == '--only' and i + 1 < len(ARGS):
        ONLY = ARGS[i + 1]

W, H = 393, 852
SCALE = 16           # the thumbnail is a 1/16 scale greyscale copy: layout registers, glyph rasterisation does not.
                     # 1/8 was the shape the ticket expected, but at 1/8 a shift of 3 px, which the rect tolerance
                     # below allows, already moves the thumbnail 3.5 levels and would fail it. At 1/16 the same
                     # shift moves it 1.7 levels and a 60 px shift moves it 8.5, so the two tolerances agree.
THUMB = (W // SCALE, H // SCALE)

# This sentence is quoted in README section 3 in the same words.
STATE_TOLERANCE = ('A state fails when its visible text differs at all, when an element moves more '
                   'than 3 px on any edge, when its colour moves more than 3 levels in any channel, '
                   'when its font family changes or its size moves more than 0.5 px, or when its '
                   'thumbnail mean absolute shift reaches 2.0 levels or 1% of the thumbnail pixels '
                   'differ by more than 24 levels.')
RECT_TOL = 3
COLOUR_TOL = 3
SIZE_TOL = 0.5
THUMB_MEAN = 2.0
THUMB_PCT = 1.0
THUMB_LEVELS = 24

TEXT_ONLY_BG_CSS = ('.ui * { color: transparent !important; text-shadow: none !important; -webkit-text-fill-color: transparent !important; }'
                    ' .ui .link { text-decoration: none !important; }'
                    ' .ui svg, .ui .set-dots, .ui .tdot { visibility: hidden !important; }'
                    ' .ui input::placeholder { color: transparent !important; } .chrome { visibility: hidden !important; }')

JS_INFO = """()=>{const ui=document.querySelector('.screen.is-active .ui');if(!ui)return null;const text=ui.innerText;const small=[];
    __CLIP__
    const side=v=>v<__PX__?v.toFixed(2):String(Math.round(v));   /* the side that failed prints the number that failed */
    ui.querySelectorAll('__TAPPABLE__').forEach(e=>{if(e.offsetParent===null||__clippedAway(e))return;const r=e.getBoundingClientRect();if(r.width===0)return;
      const cs=getComputedStyle(e,'::before');let h=r.height,w=r.width;if(cs.content!=='none'&&cs.height&&cs.height!=='auto')h=Math.max(h,parseFloat(cs.height));
      if(h<__PX__||w<__PX__)small.push((e.id||e.className||e.tagName)+' '+side(w)+'x'+side(h))});
    const prim=Array.from(document.querySelectorAll('.screen.is-active #start, .screen.is-active #log, .screen.is-active .mic-button, .screen.is-active .panel-primary')).find(e=>e.offsetParent!==null&&e.getBoundingClientRect().width>0)||null;
    const pr=prim?prim.getBoundingClientRect():null;
    const overflow=[];ui.querySelectorAll('.primary, #log, .decision, .chip, .save').forEach(e=>{if(e.offsetParent===null)return;
      if(e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1)overflow.push((e.id||e.className)+' '+e.textContent.trim().slice(0,24))});
    const sc=ui.querySelector(':scope > .body')||ui;
    return {text, small, overflow, scroll: sc.scrollHeight, client: sc.clientHeight,
      prim: pr?[Math.round(pr.top), Math.round(pr.bottom)]:null, applied: document.documentElement.getAttribute('data-state')}}"""

JS_BOXES = """()=>{const ui=document.querySelector('.screen.is-active .ui');if(!ui)return [];const out=[];
    __SEEN__
    const cs0=getComputedStyle(document.documentElement);const tok={};
    ['--muted','--faint','--gold'].forEach(k=>{const v=cs0.getPropertyValue(k).trim().toLowerCase();if(v)tok[v]=k});
    const hex=s=>{const m=s.match(/\\d+/g);return m?'#'+m.slice(0,3).map(x=>(+x).toString(16).padStart(2,'0')).join(''):s.toLowerCase()};
    const off='button:disabled, input:disabled, select:disabled, textarea:disabled, fieldset:disabled';
    ui.querySelectorAll('*').forEach(e=>{if(!__seen(e))return;
      const has=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1);if(!has)return;
      const r=e.getBoundingClientRect();if(r.width<8||r.height<8||r.top>852)return;
      const cs=getComputedStyle(e);const m=cs.color.match(/\\d+/g);
      /* text scrolled out of its own scroll region (Today's day under the fixed stack) is not on screen */
      let sc=e.parentElement,vis=null;while(sc&&sc!==ui){const o=getComputedStyle(sc).overflowY;if(o==='auto'||o==='scroll'){vis=sc.getBoundingClientRect();break}sc=sc.parentElement}
      let y=r.top,h=r.height;
      if(vis){const top=Math.max(r.top,vis.top),bot=Math.min(r.bottom,vis.bottom-22);if(bot-top<r.height*0.5)return;y=top;h=bot-top}
      out.push({id:(e.id||e.className||e.tagName)+':'+e.textContent.trim().slice(0,18),x:r.left,y:y,w:r.width,h:h,
        c:m?m.slice(0,3).map(Number):null,size:parseFloat(cs.fontSize),cls:(typeof e.className==='string'?e.className:''),
        tok: tok[hex(cs.color)]||'', off: (e.disabled===true)||!!e.closest(off),
        len: e.textContent.trim().length})});
    return out}"""

# the committed record: every text bearing element the athlete can actually see, in document
# order, with its own text, its rounded rect, its computed colour, its first font family and its
# font size; the screen's visible text is those strings in order, so hiding a line changes it.
# what counts as on the screen is common.JS_SEEN, shared with the contrast walk: display:none,
# visibility, the walked opacity, a rect with no area or wholly outside the viewport, a clip path
# that leaves no area, and a text indent that carries the line off its own box.
JS_RECORD = """()=>{const ui=document.querySelector('.screen.is-active .ui');if(!ui)return null;
    const norm=s=>s.replace(/\\s+/g,' ').trim();
    const els=[],said=[];
    __SEEN__
    ui.querySelectorAll('*').forEach(e=>{if(!__seen(e))return;
      const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ');
      if(!own.trim())return;
      const r=e.getBoundingClientRect();const cs=getComputedStyle(e);const m=cs.color.match(/\\d+/g);
      said.push(norm(own));
      const px=v=>Math.round(v*100)/100;   /* two decimals: "more than 3 px" then means what it says */
      els.push([norm(own), [px(r.left),px(r.top),px(r.width),px(r.height)],
        m?m.slice(0,3).map(Number):[0,0,0], cs.fontFamily.split(',')[0].replace(/["']/g,'').trim(),
        Math.round(parseFloat(cs.fontSize)*10)/10])});
    return {text: norm(said.join(' ')), els: els}}"""


JS_BOXES = JS_BOXES.replace('__SEEN__', JS_SEEN)
JS_RECORD = JS_RECORD.replace('__SEEN__', JS_SEEN)
JS_INFO = JS_INFO.replace('__TAPPABLE__', TAPPABLE_SELECTOR).replace('__PX__', str(TARGET_PX)).replace('__CLIP__', JS_CLIPPED_AWAY)


def rel(p):
    return os.path.relpath(p, ROOT).replace(os.sep, '/')


def num(v):
    """A recorded number as it reads: a whole pixel stays whole, anything else keeps two places."""
    return str(int(v)) if float(v) == int(v) else f'{float(v):.2f}'


def other_platform_dirs():
    """Every sibling platform directory under quality/baseline/states/ that is not this one."""
    try:
        names = sorted(os.listdir(BASE))
    except OSError:
        return []
    return [os.path.join(BASE, n) for n in names
            if n != platform_key() and os.path.isdir(os.path.join(BASE, n))]


def record_paths(sid, theme):
    """The shared record, read on every platform, and this platform's thumbnail of it."""
    return os.path.join(BASE, f'{sid}-{theme}.json'), os.path.join(THUMBS, f'{sid}-{theme}.png')


INDEX = os.path.join(BASE, 'INDEX.json')


def read_index():
    """The list of state ids and themes the last accept run recorded, or None when there is none."""
    try:
        with open(INDEX, encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return None


def index_problems(rendered, only):
    """A state that leaves the driver while its records stay committed is the case a port
    actually produces, so the run compares the two lists in both directions, by id and by theme:
    a theme in the index that the sheet does not render, and a theme the sheet renders that the
    index does not carry, are both wrong in the same way a missing id is."""
    idx = read_index()
    if idx is None:
        return [f'no index at {rel(INDEX)}; run "python quality/statesheet.py --accept" and commit it']
    recorded = [(e['id'], t) for e in idx.get('states', []) for t in e.get('themes', [])]
    if only:
        recorded = [(sid, t) for sid, t in recorded if sid.startswith(only)]
    drawn_ids = {sid for sid, _ in rendered}
    out = []
    for sid, t in recorded:
        if (sid, t) in rendered:
            continue
        if sid not in drawn_ids:
            out.append(f'no state {sid} in the build, but {rel(record_paths(sid, t)[0])} is committed')
        else:
            out.append(f'the index records {sid} in theme {t}, which the sheet does not render')
    for sid, t in sorted(rendered):
        if (sid, t) not in recorded:
            out.append(f'{sid} theme {t} is in the build but not in {rel(INDEX)}; run "python quality/statesheet.py --accept" and commit it')
    return out


def write_index(states, chromium_version=''):
    """The ids and themes --accept recorded, and the machine that recorded them.

    "env" is provenance, not a measure. index_problems() reads "states" and nothing else, so a
    record set written on one machine is judged on another without the env entering any
    comparison; it is there so a reader of the diff can see which machine and which launch list
    the shared records came from. newline='\\n': this file is committed, so it has to land on
    disk as the same bytes on every platform.
    """
    with open(INDEX, 'w', encoding='utf-8', newline='\n') as f:
        json.dump({'states': [{'id': st['id'], 'screen': st['screen'], 'themes': ['ink', 'dawn']} for st in states],
                   'env': {'os': f'{plat.system()} {plat.release()} ({platform_key()})',
                           'python': plat.python_version(),
                           'playwright': playwright_version(),
                           'chromium': chromium_version,
                           'launch': list(LAUNCH_ARGS),
                           'app': app_digest(ROOT)}},
                  f, ensure_ascii=False, indent=1)
        f.write('\n')


def write_env(chromium_version, states):
    """ENV.txt beside this platform's thumbnails, in the form gate.py writes beside the screen
    baselines. Written by --accept and by --accept-thumbs, and by neither unless it wrote."""
    os.makedirs(THUMBS, exist_ok=True)
    with open(os.path.join(THUMBS, 'ENV.txt'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(env_text(chromium_version, [
            f'states: {len(states)} ids, {2 * len(states)} renders, themes ink and dawn',
            f'viewport: {W}x{H}, chrome=1, date=board',
            f'thumbnail: {THUMB[0]}x{THUMB[1]} greyscale, 1/{SCALE} scale',
        ]))


def compare_record(sid, theme, rec, thumb, worst=None):
    """Compare one render against its committed record. Returns a list of problems.

    A state fails when its visible text differs at all, when an element moves more than 3 px on any
    edge, when its colour moves more than 3 levels in any channel, when its font family changes or
    its size moves more than 0.5 px, or when its thumbnail mean absolute shift reaches 2.0 levels or
    1% of the thumbnail pixels differ by more than 24 levels.

    thumb is None on an --accept-thumbs run, which compares every other half of the record and no
    thumbnail, because it is the run that is about to write this platform's thumbnails.
    """
    jp, pp = record_paths(sid, theme)
    if not os.path.exists(jp):
        return [f'no record at {rel(jp)}; run "python quality/statesheet.py --accept" and commit it']
    try:
        with open(jp, encoding='utf-8') as f:
            want = json.load(f)
    except Exception as e:
        return [f'the record at {rel(jp)} could not be read ({type(e).__name__})']
    problems = []
    if want.get('text') != rec['text']:
        problems.append('the visible text changed: ' + first_text_difference(want.get('text', ''), rec['text']))
    a, b = want.get('els', []), rec['els']
    if len(a) != len(b):
        problems.append(f'{len(b)} text elements, the record has {len(a)}')
    for i, (wa, wb) in enumerate(zip(a, b)):
        name = (wb[0] or wa[0])[:24]
        if wa[0] != wb[0]:
            problems.append(f'element {i} text "{wa[0][:24]}" became "{wb[0][:24]}"')
            continue
        for k, edge in enumerate(['left', 'top', 'width', 'height']):
            # the two values are compared as they were measured, never rounded first: a record
            # holds each edge to two decimals, so "more than 3 px" means more than 3 px
            moved = abs(float(wa[1][k]) - float(wb[1][k]))
            note(worst, 'rect edge moved (px)', moved, RECT_TOL, f'{sid} {theme} element {i} "{name}" {edge}')
            if moved > RECT_TOL:
                problems.append(f'element {i} "{name}" {edge} {num(wa[1][k])} became {num(wb[1][k])}')
        dcol = max(abs(x - y) for x, y in zip(wa[2], wb[2]))
        note(worst, 'colour moved (levels)', dcol, COLOUR_TOL, f'{sid} {theme} element {i} "{name}"')
        if dcol > COLOUR_TOL:
            problems.append(f'element {i} "{name}" colour {tuple(wa[2])} became {tuple(wb[2])}')
        if wa[3] != wb[3]:
            problems.append(f'element {i} "{name}" font {wa[3]} became {wb[3]}')
        if abs(wa[4] - wb[4]) > SIZE_TOL:
            problems.append(f'element {i} "{name}" font size {wa[4]} became {wb[4]}')
    problems += copied_thumb_problems(pp)
    if thumb is not None:
        problems += compare_thumb(sid, theme, pp, thumb, worst)
    # a problem is never dropped in silence: the count of what is not shown is shown
    return problems[:6] + ([f'and {len(problems) - 6} more'] if len(problems) > 6 else [])


def copied_thumb_problems(pp):
    """A platform's thumbnails are drawn on that platform, never copied from another's.

    Of the 418 committed thumbnail pairs not one is byte identical across platforms, because every
    drawn state carries text and two text stacks never rasterise text to the same bytes. So a byte
    for byte match with another platform's file of the same name is a copy, and a copied set would
    otherwise sit inside the tolerance unnoticed (the reviewer measured 0.85 of 2.00 on T-02 and at
    most 1.26 over all 418). It is checked on an ordinary run and on an --accept-thumbs run.
    """
    if not os.path.exists(pp):
        return []
    try:
        with open(pp, 'rb') as f:
            mine = f.read()
    except OSError:
        return []
    for d in other_platform_dirs():
        q = os.path.join(d, os.path.basename(pp))
        try:
            with open(q, 'rb') as f:
                if f.read() != mine:
                    continue
        except OSError:
            continue
        return [f'{rel(pp)} is byte identical to {rel(q)}: a platform\'s thumbnails are drawn on '
                'that platform with "python quality/statesheet.py --accept-thumbs", never copied']
    return []


def cross_platform(sid, theme, pp, thumb, cross):
    """How far this run's render sits from the OTHER platforms' committed thumbnails.

    Advisory and nothing else: it is never a problem and never an exit code, because a thumbnail
    is a raster and the platforms are expected to differ. It is measured on every run so the cross
    platform raster distance is a number the sheet prints rather than one somebody computes by
    hand once. On Linux against the committed win32 set it reads about 1.26 of 2.00 at C-63 ink.
    """
    cur = np.asarray(thumb).astype(float)
    for d in other_platform_dirs():
        q = os.path.join(d, os.path.basename(pp))
        if not os.path.exists(q):
            continue
        try:
            base = np.asarray(Image.open(q).convert('L')).astype(float)
        except Exception:
            continue
        if base.shape != cur.shape:
            continue
        diff = np.abs(base - cur)
        k = os.path.basename(d)
        for measure, value in (('thumbnail mean shift', float(diff.mean())),
                               ('thumbnail pixels over 24 levels', float((diff > THUMB_LEVELS).mean() * 100))):
            row = cross.setdefault((k, measure), None)
            if row is None or value > row[0]:
                cross[(k, measure)] = (value, THUMB_MEAN if 'mean' in measure else THUMB_PCT,
                                       f'{sid} {theme}')


def compare_thumb(sid, theme, pp, thumb, worst=None):
    """The thumbnail half of a record, which is this platform's own.

    A thumbnail is a raster and rasterisation is a property of the machine, so a missing one for
    the current platform is a FAIL that names the path and the remedy, the way a missing screen
    baseline is in gate.py. It is never set silently.
    """
    if not os.path.exists(pp):
        return [f'no thumbnail at {rel(pp)}; run "python quality/statesheet.py --accept-thumbs" '
                'on the machine of record, then commit it']
    try:
        base = np.asarray(Image.open(pp).convert('L')).astype(float)
    except Exception as e:
        return [f'the thumbnail at {rel(pp)} could not be read ({type(e).__name__})']
    cur = np.asarray(thumb).astype(float)
    if base.shape != cur.shape:
        return [f'thumbnail {cur.shape} against the record\'s {base.shape}']
    d = np.abs(base - cur)
    mean = float(d.mean()); pct = float((d > THUMB_LEVELS).mean() * 100)
    note(worst, 'thumbnail mean shift', mean, THUMB_MEAN, f'{sid} {theme}')
    note(worst, 'thumbnail pixels over 24 levels', pct, THUMB_PCT, f'{sid} {theme}')
    if mean >= THUMB_MEAN or pct >= THUMB_PCT:
        return [f'thumbnail mean shift {mean:.2f}, {pct:.2f}% of pixels over {THUMB_LEVELS} levels']
    return []


def note(worst, measure, value, limit, where):
    """Keep the largest of each measure the run saw, so a run on a second machine shows its
    headroom in numbers instead of a bare verdict."""
    if worst is None:
        return
    cur = worst.get(measure)
    if cur is None or value > cur[0]:
        worst[measure] = (value, limit, where)


def first_text_difference(a, b):
    n = min(len(a), len(b)); i = 0
    while i < n and a[i] == b[i]:
        i += 1
    return f'"{a[max(0,i-12):i+24]}" became "{b[max(0,i-12):i+24]}"'


async def main():
    rows = []; worst = {}; pending = []; cross = {}
    async with async_playwright() as p:
        b = await p.chromium.launch(args=LAUNCH_ARGS)
        chromium_version = b.version
        ctx = await b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2, reduced_motion='reduce')
        pg = await ctx.new_page()
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        try:
            await pg.goto(f'{APP}?theme=ink&screen=today&chrome=1&date=board')
        except Exception as e:
            raise Refused(f'{APP} could not be opened ({type(e).__name__})')
        await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(300)
        if not await pg.evaluate("()=>!!document.querySelector('.screen.is-active .ui')"):
            raise Refused(f'{APP} has no ".screen.is-active .ui" element')
        if not await pg.evaluate("()=>!!(window.earnedStates && window.earnedStates.list)"):
            raise Refused(f'{APP} has no window.earnedStates.list(): it carries no state driver')
        states = await pg.evaluate('window.earnedStates.list()')
        if ONLY:
            states = [s for s in states if s['id'].startswith(ONLY)]
        if not states:
            raise Refused(f'{APP} registered no states' + (f' matching {ONLY}' if ONLY else ''))
        if ACCEPT:
            os.makedirs(BASE, exist_ok=True); os.makedirs(THUMBS, exist_ok=True)
        rendered_pairs = {(st['id'], t) for st in states for t in ('ink', 'dawn')}
        for st in states:
            for t in ['ink', 'dawn']:
                n0 = len(errs)
                try:
                    await render_one(pg, st, t, n0, errs, rows, worst, cross, pending)
                except Refused:
                    # a refusal is one line and exit 2 by contract, never a problem row: the guard
                    # below is for a state that throws, not for a run that cannot run at all
                    raise
                except Exception as e:
                    # one state that throws must not end the run with no report: gate.py already
                    # records a failing element rather than crashing, and the sheet does now too
                    first = (str(e).splitlines() or [''])[0][:100]
                    rows.append((st['id'], t, st['title'], st['status'],
                                 [f'the render failed: {type(e).__name__}: {first}']))
        await b.close()
    if ACCEPT:
        write_index(states, chromium_version)
        write_env(chromium_version, states)
        orphans = []
    else:
        orphans = index_problems(rendered_pairs, ONLY)
    # --accept-thumbs writes nothing at all unless every render came back clean against the
    # shared records, so a second platform cannot bless its own thumbnails over a real defect.
    written = 0
    if ACCEPT_THUMBS and not any(r[4] for r in rows) and not orphans:
        os.makedirs(THUMBS, exist_ok=True)
        for pp, thumb in pending:
            thumb.save(pp, optimize=True)
        write_env(chromium_version, states)
        written = len(pending)
    write_sheets(states)
    write_report(rows, orphans, worst, written, cross, app_advisory())


async def render_one(pg, st, t, n0, errs, rows, worst, cross, pending):
    """One state in one theme: render it, check it, compare it and file its row.

    Its own function so that a state that throws is one problem row and not the end of the
    run: the caller catches, names the state and the first line of the error, and the sheet
    still writes its report and exits 1.
    """
    await pg.goto(f'{APP}?theme={t}&screen={st["screen"]}&chrome=1&date=board&state={st["id"]}')
    await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(420)
    png = await pg.screenshot()
    shot = Image.open(io.BytesIO(png))
    shot.save(os.path.join(OUT, f'{st["id"]}-{t}.png'))
    thumb = shot.convert('L').resize(THUMB, Image.LANCZOS)
    info = await pg.evaluate(JS_INFO)
    if info is None:
        rows.append((st['id'], t, st['title'], st['status'], ['the screen has no ".screen.is-active .ui"']))
        return
    boxes = await pg.evaluate(JS_BOXES)
    rec = await pg.evaluate(JS_RECORD)
    await pg.add_style_tag(content=TEXT_ONLY_BG_CSS); await pg.wait_for_timeout(60)
    bg = np.asarray(Image.open(io.BytesIO(await pg.screenshot())).convert('RGB').resize((W, H), Image.BILINEAR)).astype(float)
    lowc = []
    for bx in boxes:
        if not bx['c']: continue
        ix, iy = bx['w'] * 0.15, bx['h'] * 0.15
        x0, y0 = int(max(0, bx['x'] + ix)), int(max(0, bx['y'] + iy))
        x1, y1 = int(min(W, bx['x'] + bx['w'] - ix)), int(min(H, bx['y'] + bx['h'] - iy))
        if x1 <= x0 or y1 <= y0: continue
        ratio = worst_ratio(bx['c'], bg[y0:y1, x0:x1].reshape(-1, 3))
        if ratio is None: continue
        need = tier_for(bx['cls'], bx['size'], bx['tok'], bx['off'], bx.get('len', 0))
        if ratio < need:
            lowc.append(f"{bx['id']} {ratio:.1f} < {need}")
    problems = []
    if info['applied'] != st['id']: problems.append('state did not apply')
    if len(errs) > n0: problems.append('error: ' + errs[-1][:80])
    sweep = await pg.evaluate(JS_SWEPT_TEXT)
    swept = sweep['text']
    unread = sweep.get('unreadable') or []
    bad = copy_problems(swept)
    if bad: problems.append('copy: ' + ', '.join(repr(x) for x in bad))
    if unread: problems.append(UNREADABLE_CHECK + ': ' + ', '.join(unread[:3]))
    xbad = set_x_problems(swept)
    if xbad: problems.append('set written with the letter x: ' + ', '.join(repr(x) for x in xbad))
    if info['small']: problems.append('targets: ' + ', '.join(info['small'][:3]))
    if info.get('overflow'): problems.append('label overflows its button: ' + ', '.join(info['overflow'][:3]))
    if st['screen'] == 'workout' and re.search(r'\boptional\b', swept.lower()):
        problems.append('copy: "optional" on a set screen')
    # seams: a single-row step of the scene in both margins at once, with the text hidden
    lm = bg[60:830, 4:18].mean(axis=(1, 2)); rm = bg[60:830, 375:389].mean(axis=(1, 2))
    def flat(a, y): return y >= 4 and y + 4 <= len(a) and np.abs(np.diff(a[y - 4:y])).max() < 1.5 and np.abs(np.diff(a[y + 1:y + 5])).max() < 1.5   # flat on both sides: a drawn edge, not a photograph
    seam = [int(y) + 60 for y in range(1, len(lm)) if abs(lm[y] - lm[y - 1]) > 5 and abs(rm[y] - rm[y - 1]) > 5 and (lm[y] - lm[y - 1]) * (rm[y] - rm[y - 1]) > 0 and flat(lm, y) and flat(rm, y)]
    if seam: problems.append('seam at rows ' + ', '.join(str(y) for y in seam[:4]))
    if lowc: problems.append('contrast: ' + ', '.join(lowc[:3]))
    if info['prim'] and info['prim'][1] > H:
        problems.append(f'primary action below the fold (bottom {info["prim"][1]} > {H})')
    # the committed record
    if rec is None:
        problems.append('the screen could not be recorded')
    elif ACCEPT:
        jp, pp = record_paths(st['id'], t)
        # newline='\n': a record is committed, so it has to land on disk as the same
        # bytes on every platform, whatever the platform's own line ending is.
        with open(jp, 'w', encoding='utf-8', newline='\n') as f:
            json.dump({'id': st['id'], 'theme': t, 'text': rec['text'], 'els': rec['els']}, f,
                      ensure_ascii=False, separators=(',', ':'))
        thumb.save(pp, optimize=True)
    else:
        problems += compare_record(st['id'], t, rec, None if ACCEPT_THUMBS else thumb, worst)
        cross_platform(st['id'], t, record_paths(st['id'], t)[1], thumb, cross)
        if ACCEPT_THUMBS:
            pending.append((record_paths(st['id'], t)[1], thumb))
    rows.append((st['id'], t, st['title'], st['status'], problems))




def app_advisory():
    """One line, and only when this run judged the pack's own prototype against committed records.

    A record set is a record of one prototype. --accept writes a digest of app/ into the index, and
    an ordinary run says here when the pack's app/ no longer matches it. It is advisory: it is not
    a problem, it is not counted, and it does not touch the exit code, because a teeth row's whole
    job is to change app/ in a scratch copy and the row that must PASS still has to exit 0.
    """
    if ACCEPT or os.environ.get('EARNED_APP'):
        return ''
    want = ((read_index() or {}).get('env') or {}).get('app')
    if want == app_digest(ROOT):
        return ''
    if not want:
        return ('advisory, not a problem: the index carries no app digest, so nothing says which '
                'prototype these records were written against; the next "--accept" writes one')
    return ('advisory, not a problem: the pack\'s app/ does not match the digest in '
            + rel(INDEX) + ' that the records were written against')


def write_sheets(states):
    f = label_font(22)
    for screen in ['today', 'workout', 'coach']:
        ids = [s['id'] for s in states if s['screen'] == screen]
        if not ids: continue
        cols = 6; scale = 0.5; tw, th = int(W * scale * 2), int(H * scale * 2)
        tiles = []
        for sid in ids:
            for t in ['ink', 'dawn']:
                path = os.path.join(OUT, f'{sid}-{t}.png')
                if not os.path.exists(path): continue
                im = Image.open(path).resize((tw, th), Image.LANCZOS)
                tiles.append((im, f'{sid} {t}: ' + next(s['title'] for s in states if s['id'] == sid)[:40]))
        if not tiles: continue
        rowsN = (len(tiles) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * (tw + 16) + 16, rowsN * (th + 44) + 16), (20, 18, 16)); d = ImageDraw.Draw(sheet)
        for i, (im, lab) in enumerate(tiles):
            x = 16 + (i % cols) * (tw + 16); y = 16 + (i // cols) * (th + 44)
            sheet.paste(im, (x, y + 28)); d.text((x, y), lab, fill=(230, 215, 190), font=f)
        sheet.save(os.path.join(RUN, f'statesheet-{screen}.jpg'), quality=80)
        print('wrote', f'statesheet-{screen}.jpg', sheet.size, len(ids), 'states')


def report_name():
    return 'states-report' + ('-' + ONLY.rstrip('-') if ONLY else '') + '.txt'


def write_report(rows, orphans, worst, written=0, cross=None, advisory=''):
    bad = [r for r in rows if r[4]]
    head = (f'STATE SHEET: {len(rows)} renders, {len(bad)} with problems'
            + (f', {len(orphans)} records with no state' if orphans else '')
            + (f', {len(rows)} SET' if ACCEPT else '')
            + (f', {written} SET' if written else ''))
    lines = [head, '']
    if ACCEPT:
        lines = ['ACCEPT RUN: the state records compared nothing'] + lines
    elif ACCEPT_THUMBS:
        # never evidence of a green run: it wrote half of every record it just judged
        lines = ['ACCEPT THUMBS RUN: every record compared except its thumbnail, which this run '
                 + (f'wrote: {written} thumbnails and ENV.txt in {rel(THUMBS)}'
                    if written else 'did not write, because the run is not clean')] + lines
    for sid, t, title, status, probs in rows:
        if probs:
            lines.append(f'{sid:7s} {t:5s} {status:10s} {title[:44]:44s} {"; ".join(probs)}')
    for o in orphans:
        lines.append(f'{"INDEX":7s} {"":5s} {"":10s} {"":44s} {o}')
    if advisory:
        lines += ['', advisory]
    if worst or cross:
        # what the run actually measured, so a second machine can read its headroom in numbers.
        # The first rows are this platform against its own records and are the tolerance. The rows
        # marked advisory are this platform against the other platforms' committed thumbnails: they
        # are not a tolerance and nothing fails on them, and they are here so the cross platform
        # raster distance is measured on every run rather than once by hand.
        lines += ['', 'worst measured:']
        if worst and all(v[0] <= 0 for v in worst.values()):
            lines.append(f'  none measured: nothing moved in {len(rows)} renders')
        else:
            for measure in sorted(worst):
                value, limit, where = worst[measure]
                lines.append(f'  {measure:34s} {value:8.2f} of {limit:6.2f}   ' + (where if value > 0 else 'nothing moved'))
        for name in sorted({k[0] for k in (cross or {})}):
            lines.append(f'  advisory, not a tolerance: this run against the {name} thumbnails')
            for key in sorted(k for k in cross if k[0] == name):
                value, limit, where = cross[key]
                lines.append(f'  {key[1]:34s} {value:8.2f} of {limit:6.2f}   ' + (where if value > 0 else 'nothing moved'))
    # the clean list is keyed on the render, so one theme failing cannot mark the other clean
    lines += ['', 'clean: ' + ', '.join(sorted({r[0] for r in rows if not r[4]} - {r[0] for r in bad}))]
    rep = '\n'.join(lines)
    print(rep)
    with open(os.path.join(RUN, report_name()), 'w', encoding='utf-8') as f:
        f.write(rep)
    sys.exit(1 if (bad or orphans) else 0)


def refuse(msg):
    line = f'STATE SHEET: REFUSED. {msg}'
    print(line)
    try:
        with open(os.path.join(RUN, report_name()), 'w', encoding='utf-8') as f:
            f.write(line + '\n')
    except Exception:
        pass
    sys.exit(2)


if __name__ == '__main__':
    if ACCEPT and ONLY:
        refuse('--accept writes every record and the index, so it cannot be combined with --only')
    if ACCEPT_THUMBS and ONLY:
        refuse('--accept-thumbs writes every thumbnail this platform has, so it cannot be combined with --only')
    if ACCEPT and ACCEPT_THUMBS:
        refuse('--accept already writes this platform\'s thumbnails, so --accept-thumbs cannot be combined with it')
    if (ACCEPT or ACCEPT_THUMBS) and os.environ.get('EARNED_APP'):
        refuse('the records and thumbnails of record are drawn from the pack\'s own prototype, so '
               '--accept and --accept-thumbs refuse to run with EARNED_APP set')
    try:
        asyncio.run(main())
    except Refused as e:
        refuse(str(e))
    except SystemExit:
        raise
    except Exception as e:
        refuse(f'{APP} could not be measured: {type(e).__name__}: {str(e)[:200]}')
