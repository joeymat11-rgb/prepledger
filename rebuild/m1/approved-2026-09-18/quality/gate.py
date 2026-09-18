#!/usr/bin/env python3
"""Earned UI quality gate.

Runs every automatic check in quality/STANDARD.md against the app and prints a PASS / WARN / FAIL table.
  python quality/gate.py                 run the checks, compare screenshots to this platform's baseline
  python quality/gate.py --accept        run the checks and set this platform's baseline (on purpose only)
  python quality/gate.py --screens today --sizes 393x852     narrow the run while iterating

Point it at another build (the real client's preview) with EARNED_APP=<url or file:// path>.
Exit code: 0 green, 1 any FAIL, 2 refused (it could not run). A report is written whenever the
run got as far as producing results.
"""
import asyncio, os, sys, io, json, hashlib, platform as plat, urllib.parse, urllib.request
import numpy as np
from PIL import Image
from playwright.async_api import async_playwright

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import (copy_problems, set_x_problems, tier_for, lum_array, worst_ratio, app_url,
                    sha256_bytes, platform_key, CONTRAST_TOLERANCE, Refused)

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
APP = app_url()
QDIR = os.path.join(ROOT, 'quality')
BASE = os.path.join(QDIR, 'baseline', platform_key())
OUT = os.path.join(QDIR, 'run'); os.makedirs(OUT, exist_ok=True)

ARGS = sys.argv[1:]
ACCEPT = '--accept' in ARGS


def _opt(name):
    return ARGS[ARGS.index(name) + 1] if name in ARGS and len(ARGS) > ARGS.index(name) + 1 else None


THEMES = ['ink', 'dawn']
ALL_SCREENS = ['today', 'workout', 'coach']
ALL_SIZES = [(393, 852), (375, 812), (360, 780)]
_s = _opt('--screens'); _z = _opt('--sizes')
SCREENS = [s for s in ALL_SCREENS if not _s or s in _s.split(',')]
SIZES = [wh for wh in ALL_SIZES if not _z or f'{wh[0]}x{wh[1]}' in _z.split(',')]
REF = (393, 852)   # seams, regression and the column checks are measured at the reference size

PRIMARY = {'today': '#start', 'workout': '#log', 'coach': '.mic-button'}
GLYPHS = {  # right-hand glyphs and the card whose right edge they are measured from
    'today': [('#card-eat .chev', '#card-eat'), ('#card-train .chev', '#card-train'), ('#plans-changed svg', '.plans'), ('#start .arrow', '#start'), ('#recovery .chev', '#recovery'), ('#talk-today .mic', '#talk-today')],
    'workout': [('#last-time .row-chev', '#setcard'), ('#machine .chev', '#machine'), ('#log .arrow', '#log'), ('#talk-workout .mic', '#talk-workout')],
    'coach': [],   # prompt rows carry no chevron (they are questions, not destinations)
}
ICON_COLUMNS = {  # pairs that must share a centre line, and text edges that must match
    'today': [('#recovery .icon-square', '#talk-today .orb'), ('#recovery .text', '#talk-today .label')],
    'workout': [('#machine .icon-square', '#talk-workout .orb'), ('#machine .text', '#talk-workout .label')],
    'coach': [('.prompt:nth-child(1) .icon-square', '.prompt:nth-child(2) .icon-square')],
}
ABS_COLUMNS = {  # the same columns on every screen: icon centre 54 px, text edge 88 px from the screen's left edge (393 wide)
    'today': [('#recovery .icon-square', 54), ('#talk-today .orb', 54), ('#recovery .text', 88), ('#talk-today .label', 88)],
    'workout': [('#machine .icon-square', 54), ('#talk-workout .orb', 54), ('#machine .text', 88), ('#talk-workout .label', 88)],
    'coach': [('.prompt:nth-child(1) .icon-square', 54), ('.prompt:nth-child(1) span:not(.icon-square):not(.chev)', 88)],
}
PRESSABLE = {'today': ['#card-eat', '#recovery', '#start'], 'workout': ['#rir .chip[data-rir="2"]', '#edit', '#log'], 'coach': ['.prompt:nth-child(1)', '.mic-button']}
ALLOWED_GAPS = {0, 4, 5, 8, 9, 10, 12, 14, 16, 20, 24, 44}   # 44: the Coach hero offset under the header
ALLOWED_SIZES = {12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 22, 24, 30, 31, 32, 46, 50, 52, 74}
ALLOWED_WEIGHTS = {400, 430, 450, 460, 480, 500}

# ---------------------------------------------------------------- the locks this gate holds
PINNED_FONTS = {   # sha256 of the bytes each @font-face rule actually points at
    'Earned Sans': 'c04be0b43dc3911dd36a7cb7203c5ff6daa4f42522e2bc2e6fa3325a61c43d8b',
    'Earned Serif': 'ff90213df9f50596c71ada04c34d2dee9327fe86526e713a9d49a7064b1db660',
}
KNOWN_FACE = {   # one element that must resolve to the serif, one that must resolve to the sans
    'today': ('#greeting', '#status-line'),
    'workout': ('.screen-title', '#set-count'),
    'coach': ('.coach-title', '.coach-line'),
}
# STANDARD.md section 2: serif for names, numbers and headlines; sans for everything else.
SERIF_SELECTORS = {
    'today': ['.wordmark', '#greeting', '#proposal-lift', '#start span:not(.arrow)'],
    'workout': ['.screen-title', '#w-value', '#r-value', '.numerals .times', '#machine .setting', '#log-label'],
    'coach': ['.coach-title'],
}
# BRIEF-RIR-DISPLAY: the five choices, in this order, with these labels (app/app.html:176 to 180)
RIR_LOCK = [('0', '0'), ('1', '1'), ('2', '2'), ('3+', '3+'), ('unsure', 'Unsure')]
PAGE_MARGIN = 22          # STANDARD.md section 1
CARD_INNER_PX = 14        # STANDARD.md section 1: cards use a 14 px inner edge
ICON_INSET_RANGE = (13, 14)
SAFE_AREA_PX = 24         # max(24px, env(safe-area-inset-bottom)) in app.css:642, 861 to 864
EDGE_TOL = 0.6
# cards, buttons and pills that sit inside a container and must still meet the page margin
MARGIN_INNER = {
    'today': [('.tcard', 'both')],
    'workout': [('#log', 'left'), ('#edit', 'right'), ('#rir .chip:first-child', 'left'), ('#rir .chip:last-child', 'right')],
    'coach': [('.prompt', 'both')],
}
# the card sides whose inner padding is the 14 px edge (the left gutters that carry the timeline dot,
# the chevron or the serif optical inset are named in STANDARD.md and are not this rule)
CARD_INNER = {
    'today': [('#card-weigh', 'paddingRight'), ('#card-proposal', 'paddingRight'), ('#recovery', 'paddingLeft'), ('#talk-today', 'paddingLeft'), ('#start', 'paddingRight')],
    'workout': [('#setcard', 'paddingLeft'), ('#setcard', 'paddingRight'), ('#machine', 'paddingLeft'), ('#talk-workout', 'paddingLeft'), ('#log', 'paddingRight')],
    'coach': [('.prompt', 'paddingLeft'), ('.prompt', 'paddingRight')],
}
ICON_INSET = {
    'today': [('#recovery', '#recovery .icon-square'), ('#talk-today', '#talk-today .orb')],
    'workout': [('#machine', '#machine .icon-square'), ('#talk-workout', '#talk-workout .orb')],
    'coach': [('.prompt', '.prompt .icon-square')],
}

# This sentence is quoted in README section 3 in the same words.
REGRESSION_TOLERANCE = ('The gate fails a screen when more than 0.1% of its pixels differ from the '
                        'baseline by more than 10 levels in any channel, or when the mean absolute '
                        'shift exceeds 0.5 levels.')
REG_PCT = 0.1
REG_MEAN = 0.5

HIDE_TEXT_CSS = """
.ui * { color: transparent !important; text-shadow: none !important; -webkit-text-fill-color: transparent !important; }
.ui .link { text-decoration: none !important; }
.ui svg, .ui .tdot, .ui .orb, .ui .orb-ring, .ui .orb-level, .ui .icon-square, .ui .mic-button, .chrome, .ui input, .ui .field, .ui .set-dots { visibility: hidden !important; }
.ui .tcard, .ui .rowcard, .ui .talk, .ui .primary, .ui .setcard, .ui .machine, .ui .chip, .ui .log, .ui .edit, .ui .prompt, .ui .pill, .ui .save, .ui .decision, .ui .hairline, .ui .timeline::before { visibility: hidden !important; }
"""
TEXT_ONLY_BG_CSS = """
.ui * { color: transparent !important; text-shadow: none !important; -webkit-text-fill-color: transparent !important; }
.ui .link { text-decoration: none !important; }
.ui svg, .ui .set-dots, .ui .tdot { visibility: hidden !important; }
"""

results = []
def rec(level, check, where, detail=''):
    results.append((level, check, where, detail))


# ---------------------------------------------------------------- page scripts
JS_ALIVE = "()=>!!document.querySelector('.screen.is-active .ui')"

JS_FIT = """(sel)=>{const ui=document.querySelector('.screen.is-active .ui');if(!ui)return null;
    const sc=ui.querySelector(':scope > .body')||ui;const e=document.querySelector(sel);const rr=e?e.getBoundingClientRect():null;
    return {scroll:sc.scrollHeight, client:sc.clientHeight, prim: rr?[rr.top, rr.bottom]:null, missing: !e}}"""

JS_SMALL = """()=>{const ui=document.querySelector('.screen.is-active .ui');if(!ui)return [];const out=[];
    ui.querySelectorAll('button,a,input').forEach(e=>{if(e.offsetParent===null)return;const r=e.getBoundingClientRect();if(r.width===0)return;
    const cs=getComputedStyle(e,'::before');let h=r.height,w=r.width;if(cs.content!=='none'&&cs.height&&cs.height!=='auto'){h=Math.max(h,parseFloat(cs.height));}
    if(h<44||w<44)out.push((e.id||e.className)+' '+Math.round(w)+'x'+Math.round(h))});return out}"""

JS_TEXT = "()=>{const ui=document.querySelector('.screen.is-active .ui');return ui?ui.innerText:''}"

JS_ANIM = """()=>{const out=[];document.querySelectorAll('.screen.is-active *').forEach(e=>{if(e.tagName==='CANVAS')return;const cs=getComputedStyle(e);
    if((cs.transitionDuration||'0s').split(',').some(v=>parseFloat(v)>0))out.push('transition '+(e.id||e.className));
    if(cs.animationName&&cs.animationName!=='none')out.push('animation '+(e.id||e.className))});return out.slice(0,5)}"""

JS_BOXES = """()=>{const ui=document.querySelector('.screen.is-active .ui');if(!ui)return [];const out=[];
    const cs0=getComputedStyle(document.documentElement);const tok={};
    ['--muted','--faint','--gold'].forEach(k=>{const v=cs0.getPropertyValue(k).trim().toLowerCase();if(v)tok[v]=k});
    const hex=s=>{const m=s.match(/\\d+/g);return m?'#'+m.slice(0,3).map(x=>(+x).toString(16).padStart(2,'0')).join(''):s.toLowerCase()};
    const off='button:disabled, input:disabled, select:disabled, textarea:disabled, fieldset:disabled';
    ui.querySelectorAll('*').forEach(e=>{if(!e.offsetParent)return;
      const has=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1);if(!has)return;
      const r=e.getBoundingClientRect();if(r.width<8||r.height<8)return;
      const cs=getComputedStyle(e);const m=cs.color.match(/\\d+/g);
      /* text scrolled under the fixed stack is not on screen: clip it to its own scroll region and skip what is mostly hidden */
      let sc=e.parentElement,vis=null;while(sc&&sc!==ui){const o=getComputedStyle(sc).overflowY;if(o==='auto'||o==='scroll'){vis=sc.getBoundingClientRect();break}sc=sc.parentElement}
      let y=r.top,h=r.height;
      if(vis){const top=Math.max(r.top,vis.top),bot=Math.min(r.bottom,vis.bottom-22);if(bot-top<r.height*0.5)return;y=top;h=bot-top}
      out.push({id:(e.id||e.className||e.tagName)+':'+e.textContent.trim().slice(0,18),x:r.left,y:y,w:r.width,h:h,
        c:m?m.slice(0,3).map(Number):null,size:parseFloat(cs.fontSize),
        cls:(typeof e.className==='string'?e.className:''),tok: tok[hex(cs.color)]||'', off: (e.disabled===true)||!!e.closest(off)})});
    return out}"""

JS_FACES = """()=>{const out=[];for(const ss of document.styleSheets){let rs;try{rs=ss.cssRules}catch(e){continue}
    for(const r of rs){const isFace=(r.type===5)||(r.constructor&&r.constructor.name==='CSSFontFaceRule');if(!isFace)continue;
      const fam=(r.style.getPropertyValue('font-family')||'').replace(/["']/g,'').trim();
      const src=r.style.getPropertyValue('src')||'';const m=src.match(/url\\(\\s*["']?([^"')]+)["']?\\s*\\)/);
      let u=null;try{u=m?new URL(m[1], ss.href||document.baseURI).href:null}catch(e){u=m?m[1]:null}
      out.push({family:fam, url:u, src:src})}}
    return out}"""

JS_FACE_STATE = """([serifSel,sansSel])=>{const out={status:{},elems:{}};
    out.check={serif:document.fonts.check('16px "Earned Serif"'), sans:document.fonts.check('16px "Earned Sans"')};
    document.fonts.forEach(f=>{if(!(f.family in out.status)||f.status==='loaded')out.status[f.family]=f.status});
    const fam=sel=>{const e=document.querySelector('.screen.is-active '+sel);return e&&e.offsetParent?getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g,'').trim():null};
    out.elems.serif=[serifSel,fam(serifSel)]; out.elems.sans=[sansSel,fam(sansSel)];
    const cv=document.createElement('canvas');cv.width=560;cv.height=72;const c=cv.getContext('2d');
    const probe='Earned 105 lb Hamburgefonstiv';
    const shot=f=>{c.clearRect(0,0,cv.width,cv.height);c.font=f;c.fillStyle='#000';c.textBaseline='top';c.fillText(probe,0,8);
      const d=c.getImageData(0,0,cv.width,cv.height).data;let h=2166136261;for(let i=3;i<d.length;i+=4){h=((h^d[i])*16777619)>>>0}
      return [h, c.measureText(probe).width]};
    const a=shot('44px "Earned Serif"'), b=shot('44px "Earned Sans"');
    out.distinct=a[0]!==b[0]; out.widths=[Math.round(a[1]*10)/10, Math.round(b[1]*10)/10];
    return out}"""

JS_FONTMAP = """(serifSels)=>{const ui=document.querySelector('.screen.is-active .ui');if(!ui)return null;
    const out={missing:[],wrongSerif:[],notSans:[]};const serifEls=new Set();
    const first=e=>getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g,'').trim();
    serifSels.forEach(s=>{const l=document.querySelectorAll('.screen.is-active '+s);
      if(!l.length){out.missing.push(s+' is not on the page');return}
      let seen=false;l.forEach(e=>{serifEls.add(e);if(!e.offsetParent)return;seen=true;
        const f=first(e);if(f!=='Earned Serif')out.wrongSerif.push(s+' is '+f)});
      if(!seen)out.missing.push(s+' is not on the page')});
    ui.querySelectorAll('*').forEach(e=>{if(!e.offsetParent||serifEls.has(e))return;
      const has=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());if(!has)return;
      const f=first(e);if(f!=='Earned Sans')out.notSans.push((e.id||e.className||e.tagName)+' is '+f)});
    return out}"""

JS_RIR = """()=>{const wrap=document.querySelector('.screen.is-active #rir');if(!wrap)return null;
    return [...wrap.querySelectorAll('.chip')].map(c=>[c.getAttribute('data-rir'), c.textContent.trim(), !!c.offsetParent])}"""

JS_MARGIN = """(inner)=>{const ui=document.querySelector('.screen.is-active .ui');if(!ui)return [];
    const body=ui.querySelector(':scope > .body'), stack=ui.querySelector(':scope > .stack');const out=[];
    const vis=l=>[...l].filter(e=>e.offsetParent&&e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0);
    const add=(e,side)=>{const r=e.getBoundingClientRect();out.push([(e.id||e.className||e.tagName),Math.round(r.left*10)/10,Math.round(r.right*10)/10,side])};
    if(body||stack){[body,stack].forEach(c=>{if(c)vis(c.children).forEach(e=>add(e,'both'))})}else{vis(ui.children).forEach(e=>add(e,'both'))}
    inner.forEach(([sel,side])=>{document.querySelectorAll('.screen.is-active '+sel).forEach(e=>{if(!e.offsetParent)return;add(e,side)})});
    return out}"""

JS_PAD = """(pairs)=>{const out=[];pairs.forEach(([sel,side])=>{const e=document.querySelector('.screen.is-active '+sel);
    if(!e||!e.offsetParent){out.push([sel,side,null]);return}out.push([sel,side,parseFloat(getComputedStyle(e)[side])])});return out}"""

JS_ICON_INSET = """(pairs)=>{const out=[];pairs.forEach(([c,i])=>{const ce=document.querySelector('.screen.is-active '+c),ie=document.querySelector('.screen.is-active '+i);
    if(!ce||!ie||!ce.offsetParent||!ie.offsetParent){out.push([c,null]);return}
    const cr=ce.getBoundingClientRect(),ir=ie.getBoundingClientRect();
    out.push([c, Math.round((ir.left-(cr.left+ce.clientLeft))*10)/10])});return out}"""

JS_SAFE = """()=>{const ui=document.querySelector('.screen.is-active .ui');if(!ui)return null;
    const stack=ui.querySelector(':scope > .stack')||ui;
    const kids=[...stack.children].filter(e=>e.offsetParent&&e.getBoundingClientRect().height>0);
    const last=kids[kids.length-1];if(!last)return null;
    return {id:(last.id||last.className), bottom:Math.round(last.getBoundingClientRect().bottom*10)/10}}"""

JS_GAPS = """()=>{const ui=document.querySelector('.screen.is-active .ui');if(!ui)return [];
    const body=ui.querySelector(':scope > .body'),stack=ui.querySelector(':scope > .stack');
    const vis=l=>[...l].filter(e=>e.offsetParent&&!e.classList.contains('chrome')&&e.getBoundingClientRect().height>0);
    /* gaps are measured between siblings of one container; the seam between a scrolling body and its fixed stack is set by the content, not the scale */
    const groups=body?[vis(body.children),vis(stack?stack.children:[])]:[vis(ui.children)];const out=[];
    groups.forEach(kids=>{for(let i=1;i<kids.length;i++){const a=kids[i-1].getBoundingClientRect(),b=kids[i].getBoundingClientRect();
      out.push([kids[i-1].id||kids[i-1].className, kids[i].id||kids[i].className, Math.round((b.top-a.bottom)*10)/10])}});return out}"""

JS_TYPE = """()=>{const sizes=new Set(),weights=new Set();document.querySelectorAll('.screen.is-active .ui *').forEach(e=>{if(!e.offsetParent)return;
    const has=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());if(!has)return;const cs=getComputedStyle(e);
    sizes.add(parseFloat(cs.fontSize));weights.add(parseInt(cs.fontWeight))});return {sizes:[...sizes],weights:[...weights]}}"""

JS_RADII = """()=>{const out=new Set();document.querySelectorAll('.screen.is-active .tcard,.screen.is-active .rowcard,.screen.is-active .setcard,.screen.is-active .prompt,.screen.is-active .primary,.screen.is-active .log,.screen.is-active .edit,.screen.is-active .chip').forEach(e=>{if(e.offsetParent)out.add(getComputedStyle(e).borderTopLeftRadius)});return [...out]}"""


async def goto(pg, theme, screen, chrome=0, extra=''):
    url = f'{APP}?theme={theme}&screen={screen}&chrome={chrome}&date=board{extra}'
    try:
        await pg.goto(url)
    except Exception as e:
        raise Refused(f'{APP} could not be opened ({type(e).__name__})')
    await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(350)


async def guard(pg, theme, screen):
    """A build that carries no active screen is not an Earned build: refuse in one line."""
    if not await pg.evaluate(JS_ALIVE):
        raise Refused(f'{APP} has no ".screen.is-active .ui" element (theme={theme}, screen={screen})')


def file_url_to_path(u):
    p = urllib.parse.urlparse(u)
    return urllib.request.url2pathname(urllib.parse.unquote(p.path))


async def face_bytes(pg, url):
    if url.startswith('file:'):
        with open(file_url_to_path(url), 'rb') as f:
            return f.read()
    resp = await pg.request.get(url)
    if not resp.ok:
        raise IOError(f'{url} answered {resp.status}')
    return await resp.body()


async def check_fonts_pinned(pg):
    """sha256 of the bytes each @font-face rule actually points at, against the pinned values."""
    try:
        faces = await pg.evaluate(JS_FACES)
    except Exception as e:
        rec('FAIL', 'fonts pinned by sha256', 'the build', f'the stylesheets could not be read: {e}')
        return
    bad = []
    for fam, want in PINNED_FONTS.items():
        mine = [f for f in faces if f['family'] == fam]
        if len(mine) != 1:
            bad.append(f'{fam}: {len(mine)} @font-face rules, expected 1')
            continue
        url = mine[0]['url']
        if not url:
            bad.append(f'{fam}: no url in {mine[0]["src"][:40]}')
            continue
        try:
            got = sha256_bytes(await face_bytes(pg, url))
        except Exception as e:
            bad.append(f'{fam}: {os.path.basename(url)} could not be read ({e})')
            continue
        if got != want:
            bad.append(f'{fam}: {os.path.basename(url)} is {got[:16]}, pinned {want[:16]}')
    rec('FAIL' if bad else 'PASS', 'fonts pinned by sha256', 'the build',
        '; '.join(bad) if bad else ', '.join(f'{k} {v[:12]}' for k, v in PINNED_FONTS.items()))


async def check_face_state(pg, screen, where):
    serif_sel, sans_sel = KNOWN_FACE[screen]
    st = await pg.evaluate(JS_FACE_STATE, [serif_sel, sans_sel])
    bad = []
    for name, key in (('Earned Serif', 'serif'), ('Earned Sans', 'sans')):
        if not st['check'][key]:
            bad.append(f'document.fonts.check says {name} is not available')
        if st['status'].get(name) != 'loaded':
            bad.append(f'{name} is {st["status"].get(name) or "not in document.fonts"}')
    for key, want in (('serif', 'Earned Serif'), ('sans', 'Earned Sans')):
        sel, fam = st['elems'][key]
        if fam != want:
            bad.append(f'{sel} resolves to {fam or "nothing"}, not {want}')
    if not st['distinct']:
        bad.append('the serif and the sans draw the same glyphs: one face is pointed at the other file')
    rec('FAIL' if bad else 'PASS', 'serif and sans faces loaded and distinct', where,
        '; '.join(bad) if bad else f'widths {st["widths"][0]} and {st["widths"][1]}')


def check_margin(rows, W, where):
    bad = []
    for name, left, right, side in rows:
        if side in ('both', 'left') and abs(left - PAGE_MARGIN) > EDGE_TOL:
            bad.append(f'{name} left {left}')
        if side in ('both', 'right') and abs(right - (W - PAGE_MARGIN)) > EDGE_TOL:
            bad.append(f'{name} right {right}')
    rec('FAIL' if bad else 'PASS', f'page margin {PAGE_MARGIN} px', where,
        ', '.join(bad) if bad else f'{len(rows)} blocks on the margin')


async def main():
    started = False
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files'])
        chromium_version = b.version

        # ---------- errors, motion, transitions, copy, targets, fit, thumb, columns, spacing, type, pressed, contrast, seams, regression ----------
        for W, H in SIZES:
            ctx = await b.new_context(viewport={'width': W, 'height': H}, reduced_motion='reduce'); pg = await ctx.new_page()
            errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            for t in THEMES:
                for s in SCREENS:
                    where = f'{t}-{s} {W}x{H}'
                    await goto(pg, t, s)
                    await guard(pg, t, s)
                    if not started:
                        started = True
                        await check_fonts_pinned(pg)
                    try:
                        await one_screen(pg, t, s, W, H, where)
                    except Refused:
                        raise
                    except Exception as e:   # a defect must be reported, never crash the run
                        rec('FAIL', 'the gate finished this screen', where, f'{type(e).__name__}: {str(e)[:160]}')
            rec('FAIL' if errs else 'PASS', 'no page or console errors', f'{W}x{H}', '; '.join(errs[:3]))
            await ctx.close()

        if REF in SIZES:
            # ---------- the same transition sweep with motion allowed: a transition that is only disabled under reduced motion is still a transition ----------
            ctx = await b.new_context(viewport={'width': REF[0], 'height': REF[1]}, reduced_motion='no-preference'); pg = await ctx.new_page()
            for t in THEMES:
                for s in SCREENS:
                    await goto(pg, t, s); await guard(pg, t, s)
                    anim = await pg.evaluate(JS_ANIM)
                    rec('FAIL' if anim else 'PASS', 'no transitions or animations outside the embers', f'{t}-{s} nopref', ', '.join(anim))
            await ctx.close()

            # ---------- mist edges: with the mist drawn, the page margins must carry no straight step (the UI and status bar are hidden) ----------
            ctx = await b.new_context(viewport={'width': REF[0], 'height': REF[1]}, device_scale_factor=3, reduced_motion='no-preference'); pg = await ctx.new_page()
            for t in THEMES:
                for s in SCREENS:
                    await goto(pg, t, s); await guard(pg, t, s); await pg.wait_for_timeout(1100)
                    await pg.add_style_tag(content='.ui,.chrome{visibility:hidden!important}'); await pg.wait_for_timeout(150)
                    frames = []
                    for _ in range(2):   # two frames: a static edge is in both; an ember or a wisp passing through is not
                        frames.append(np.asarray(Image.open(io.BytesIO(await pg.screenshot())).convert('L')).astype(float)); await pg.wait_for_timeout(450)
                    sets = []
                    for im in frames:
                        m = np.concatenate([im[:, :180], im[:, -180:]], axis=1).mean(axis=1); dm = np.diff(m); hits = set()
                        for y in range(210, int(len(dm) * 0.66)):   # below the status-bar rows, above the fully present range (whose own ridges step naturally)
                            # a step must be visible: 1.2 levels on a dark scene, about 1% of the local brightness on a light one (Weber), or it is 8-bit banding, not an edge
                            if abs(dm[y]) > max(1.2, 0.008 * m[y]) and abs(dm[y]) > 5 * (np.median(np.abs(dm[y-6:y+7])) + 0.05) and (np.abs(im[y+1] - im[y]) > 0.8).mean() > 0.4: hits.add(int(y / 3))
                        sets.append(hits)
                    hits = sorted(h for h in sets[0] if any(abs(h - k) <= 1 for k in sets[1])); im = frames[0]
                    rec('FAIL' if hits else 'PASS', 'no straight edge in the scene with the mist drawn', f'{t}-{s}', f'rows {hits[:6]}' if hits else '')
                    # vertical structure in the sky (light pillars): high-frequency variation of column means over the top 45%
                    topband = im[int(im.shape[0] * 0.22):int(im.shape[0] * 0.45)]; cols = topband.mean(axis=0); hf = cols - np.convolve(cols, np.ones(121) / 121, mode='same'); vs = float(hf[120:-120].std())
                    rec('FAIL' if vs > 0.9 else ('WARN' if vs > 0.7 else 'PASS'), 'no vertical streaks in the sky with the mist drawn', f'{t}-{s}', f'column variation {vs:.2f} (pillars measured 1.3)')
            await ctx.close()

            # ---------- motion: with embers hidden nothing moves; under reduced motion nothing moves at all ----------
            for rm in ['no-preference', 'reduce']:
                ctx = await b.new_context(viewport={'width': REF[0], 'height': REF[1]}, reduced_motion=rm); pg = await ctx.new_page()
                for t in THEMES:
                    for s in SCREENS:
                        await goto(pg, t, s); await guard(pg, t, s); await pg.wait_for_timeout(900)
                        if rm == 'no-preference': await pg.evaluate("document.querySelectorAll('canvas.embers').forEach(e=>e.style.visibility='hidden')")
                        await pg.wait_for_timeout(150)
                        a = await pg.screenshot(); await pg.wait_for_timeout(900); c = await pg.screenshot()
                        da = np.asarray(Image.open(io.BytesIO(a)).convert('RGB')).astype(int); dc = np.asarray(Image.open(io.BytesIO(c)).convert('RGB')).astype(int)
                        moved = int((np.abs(da - dc).max(axis=2) > 6).sum())   # 1-level anti-aliasing noise is not motion
                        same = moved < 20
                        rec('PASS' if same else 'FAIL', 'nothing moves except the embers' if rm == 'no-preference' else 'nothing moves under reduced motion', f'{t}-{s}', f'{moved} px moved' if not same else '')
                await ctx.close()
        await b.close()

    write_report(chromium_version)


async def one_screen(pg, t, s, W, H, where):
    # ---------- fit and primary action ----------
    r = await pg.evaluate(JS_FIT, PRIMARY[s])
    if r is None or r.get('missing'):
        rec('FAIL', 'primary action in first viewport', where, f"{PRIMARY[s]} is not on the page")
    elif r['prim'][1] > H:
        rec('FAIL', 'primary action in first viewport', where, f"{PRIMARY[s]} bottom {r['prim'][1]:.0f} > {H}")
    else:
        rec('PASS', 'primary action in first viewport', where, f"{PRIMARY[s]} at {r['prim'][0]:.0f} to {r['prim'][1]:.0f}")
    if (W, H) == REF:
        if r['scroll'] > r['client']: rec('FAIL', 'fits without scrolling at 393x852', where, f"{r['scroll']} > {r['client']}")
        else: rec('PASS', 'fits without scrolling at 393x852', where)
        if s == 'workout' and r['prim']:
            c = (r['prim'][0] + r['prim'][1]) / 2 / H
            rec('PASS' if c >= 0.70 else 'FAIL', 'Log in the thumb zone (centre >= 70% of height)', where, f'centre at {c*100:.0f}%')
    # ---------- touch targets ----------
    small = await pg.evaluate(JS_SMALL)
    rec('FAIL' if small else 'PASS', 'touch targets >= 44 px', where, ', '.join(small))
    # ---------- copy ----------
    text = await pg.evaluate(JS_TEXT)
    bad = copy_problems(text)
    rec('FAIL' if bad else 'PASS', 'copy: no dashes, readiness words, vendor names', where, ', '.join(repr(x) for x in bad))
    xbad = set_x_problems(text)
    rec('FAIL' if xbad else 'PASS', 'the multiplication sign in every set string', where, ', '.join(repr(x) for x in xbad))
    if s == 'workout':
        lab = await pg.evaluate("()=>{const e=document.querySelector('#log-label');return e?e.innerText:null}")
        rec('PASS' if lab is not None and '×' in lab and ' x ' not in lab else 'FAIL', 'Log label uses ×', where, lab if lab is not None else '#log-label is not on the page')
    # ---------- transitions and animations (under reduced motion here; the free pass runs later) ----------
    anim = await pg.evaluate(JS_ANIM)
    rec('FAIL' if anim else 'PASS', 'no transitions or animations outside the embers', where, ', '.join(anim))
    # ---------- the fonts on this screen ----------
    await check_face_state(pg, s, where)
    fm = await pg.evaluate(JS_FONTMAP, SERIF_SELECTORS[s])
    fbad = (fm['missing'] + fm['wrongSerif'] + fm['notSans']) if fm else ['the screen could not be read']
    rec('FAIL' if fbad else 'PASS', 'serif for names and numbers, sans for the rest', where, ', '.join(fbad[:5]))
    # ---------- the RIR lock ----------
    if s == 'workout':
        chips = await pg.evaluate(JS_RIR)
        if chips is None:
            rec('FAIL', 'RIR chips are the five locked values', where, '#rir is not on the page')
        else:
            got = [(c[0], c[1]) for c in chips]
            hidden = [c[0] for c in chips if not c[2]]
            if got != RIR_LOCK:
                rec('FAIL', 'RIR chips are the five locked values', where, f'{got} is not {RIR_LOCK}')
            elif hidden:
                rec('FAIL', 'RIR chips are the five locked values', where, f'not visible: {", ".join(str(h) for h in hidden)}')
            else:
                rec('PASS', 'RIR chips are the five locked values', where, '0, 1, 2, 3+, Unsure')
    # ---------- the page margin, the card inner edge, the icon inset, the bottom safe area ----------
    check_margin(await pg.evaluate(JS_MARGIN, MARGIN_INNER[s]), W, where)
    pads = await pg.evaluate(JS_PAD, CARD_INNER[s])
    padbad = [f'{sel} {side} {v}' for sel, side, v in pads if v is None or abs(v - CARD_INNER_PX) > EDGE_TOL]
    rec('FAIL' if padbad else 'PASS', f'card inner edge {CARD_INNER_PX} px', where, ', '.join(padbad))
    ins = await pg.evaluate(JS_ICON_INSET, ICON_INSET[s])
    insbad = [f'{sel} {v}' for sel, v in ins if v is None or not (ICON_INSET_RANGE[0] - EDGE_TOL <= v <= ICON_INSET_RANGE[1] + EDGE_TOL)]
    rec('FAIL' if insbad else 'PASS', 'icon inset 13 to 14 px', where, ', '.join(insbad))
    safe = await pg.evaluate(JS_SAFE)
    if not safe:
        rec('FAIL', 'bottom safe area', where, 'the fixed stack has no visible last row')
    else:
        clear = H - safe['bottom']
        rec('PASS' if clear >= SAFE_AREA_PX - EDGE_TOL else 'FAIL', 'bottom safe area', where,
            f'{safe["id"]} clears {clear:.1f} px' + ('' if clear >= SAFE_AREA_PX - EDGE_TOL else f' (needs {SAFE_AREA_PX})'))
    # ---------- type scale and radii ----------
    ty = await pg.evaluate(JS_TYPE)
    ns = [x for x in ty['sizes'] if x not in ALLOWED_SIZES]; nw = [x for x in ty['weights'] if x not in ALLOWED_WEIGHTS]
    rec('WARN' if (ns or nw) else 'PASS', 'type sizes and weights on the scale', where, f'new sizes {ns} new weights {nw}' if (ns or nw) else '')
    rad = await pg.evaluate(JS_RADII)
    rec('PASS' if set(rad) <= {'14px'} else 'FAIL', 'radii: 14 px for cards, buttons and chips; full round only for pills', where, ', '.join(rad))
    # ---------- contrast, measured behind the text ----------
    await check_contrast(pg, W, H, where)
    if (W, H) != REF:
        return
    # ---------- the column checks, the spacing scale, the underlines, the pressed states ----------
    await goto(pg, t, s)
    ul = await pg.evaluate("()=>[...document.querySelectorAll('.screen.is-active .link')].filter(e=>e.offsetParent&&getComputedStyle(e).textDecorationLine.includes('underline')).map(e=>e.id||e.textContent)")
    rec('FAIL' if ul else 'PASS', 'tertiary links have no underline', where, ', '.join(ul))
    offs = []
    for gsel, csel in GLYPHS[s]:
        d = await pg.evaluate("([g,c])=>{const ge=document.querySelector(g),ce=document.querySelector(c);if(!ge||!ce)return null;const a=ge.getBoundingClientRect();const b=ce.getBoundingClientRect();return b.right-(a.left+a.right)/2}", [gsel, csel])
        if d is None: offs.append(f'{gsel} is not on the page')
        elif abs(d - 24) > 1: offs.append(f'{gsel} {d:.1f}')
    rec('FAIL' if offs else 'PASS', 'right glyph column at 24 px', where, ', '.join(offs))
    if s in ICON_COLUMNS:
        bad = []
        for a, bsel in ICON_COLUMNS[s]:
            d = await pg.evaluate("([a,b])=>{const ea=document.querySelector(a),eb=document.querySelector(b);if(!ea||!eb)return null;const ra=ea.getBoundingClientRect(),rb=eb.getBoundingClientRect();return a.includes('text')||a.includes('label')?ra.left-rb.left:(ra.left+ra.right)/2-(rb.left+rb.right)/2}", [a, bsel])
            if d is None: bad.append(f'{a} vs {bsel}: not on the page')
            elif abs(d) > 1: bad.append(f'{a} vs {bsel}: {d:.1f}')
        rec('FAIL' if bad else 'PASS', 'icons share a centre line, text shares an edge', where, ', '.join(bad))
    badabs = []
    for sel, want in ABS_COLUMNS.get(s, []):
        v = await pg.evaluate("(a)=>{const e=document.querySelector(a);if(!e)return null;const r=e.getBoundingClientRect();return (a.includes('text')||a.includes('label')||a.includes('span'))?r.left:(r.left+r.right)/2}", sel)
        if v is None or abs(v - want) > 1: badabs.append(f'{sel} {v}')
    rec('FAIL' if badabs else 'PASS', 'same icon column (54) and text edge (88) on every screen', where, ', '.join(badabs))
    gaps = await pg.evaluate(JS_GAPS)
    odd = [f'{a} to {b} {g}' for a, b, g in gaps if not any(abs(g - k) <= 0.6 for k in ALLOWED_GAPS) and not (g < 0 and 'title' in b)]
    rec('WARN' if odd else 'PASS', 'gaps on the spacing scale', where, ', '.join(odd))
    await check_pressed(pg, t, s, W, H, where)
    await check_seams(pg, t, s, where)
    await check_regression(pg, t, s, where)


async def check_contrast(pg, W, H, where):
    boxes = await pg.evaluate(JS_BOXES)
    await pg.add_style_tag(content=TEXT_ONLY_BG_CSS); await pg.wait_for_timeout(80)
    bg = np.asarray(Image.open(io.BytesIO(await pg.screenshot())).convert('RGB')).astype(float)
    if bg.shape[0] != H or bg.shape[1] != W:
        bg = np.asarray(Image.fromarray(bg.astype(np.uint8)).resize((W, H), Image.BILINEAR)).astype(float)
    low = []; tiers = {4.5: 0, 3.0: 0}
    for bx in boxes:
        if not bx['c']: continue
        ix, iy = bx['w'] * 0.15, bx['h'] * 0.15   # sample behind the glyphs, not the element's border or rim
        x0, y0 = int(max(0, bx['x'] + ix)), int(max(0, bx['y'] + iy))
        x1, y1 = int(min(W, bx['x'] + bx['w'] - ix)), int(min(H, bx['y'] + bx['h'] - iy))
        if x1 <= x0 or y1 <= y0: continue
        ratio = worst_ratio(bx['c'], bg[y0:y1, x0:x1].reshape(-1, 3))
        if ratio is None: continue
        need = tier_for(bx['cls'], bx['size'], bx['tok'], bx['off'])
        tiers[need] = tiers.get(need, 0) + 1
        if ratio < need:
            low.append(f"{bx['id']} {ratio:.1f} < {need}")
    rec('FAIL' if low else 'PASS', 'contrast (measured behind the text)', where,
        ', '.join(low[:6]) if low else f'{tiers.get(4.5,0)} at 4.5:1, {tiers.get(3.0,0)} at 3.0:1')


async def check_pressed(pg, t, s, W, H, where):
    same = []
    for sel in PRESSABLE[s]:
        el = await pg.query_selector(sel)
        box = await el.bounding_box() if el else None
        if not box:
            same.append(sel + ' (not on the page)'); continue
        x0, y0 = max(0.0, box['x']), max(0.0, box['y'])
        x1, y1 = min(float(W), box['x'] + box['width']), min(float(H), box['y'] + box['height'])
        if x1 - x0 < 1 or y1 - y0 < 1:
            # an element pushed outside the viewport cannot be photographed: report it, do not crash
            same.append(f'{sel} (outside the viewport at {box["x"]:.0f},{box["y"]:.0f})'); continue
        clip = {'x': x0, 'y': y0, 'width': x1 - x0, 'height': y1 - y0}
        try:
            idle = await pg.screenshot(clip=clip)
            await pg.mouse.move(x0 + (x1 - x0) / 2, y0 + (y1 - y0) / 2); await pg.mouse.down(); await pg.wait_for_timeout(40)
            down = await pg.screenshot(clip=clip); await pg.mouse.up(); await pg.wait_for_timeout(40)
        except Exception as e:
            same.append(f'{sel} ({type(e).__name__})'); continue
        if hashlib.md5(idle).hexdigest() == hashlib.md5(down).hexdigest(): same.append(sel)
        await goto(pg, t, s)  # reset any state the tap changed
    rec('FAIL' if same else 'PASS', 'pressed state on every tappable surface', where, ', '.join(same))


async def check_seams(pg, t, s, where):
    await goto(pg, t, s); await pg.add_style_tag(content=HIDE_TEXT_CSS)
    await pg.evaluate("document.querySelectorAll('canvas.embers').forEach(e=>e.style.visibility='hidden')"); await pg.wait_for_timeout(80)
    im = np.asarray(Image.open(io.BytesIO(await pg.screenshot())).convert('L')).astype(float)
    d = np.abs(np.diff(im, axis=0)); frac = (d > 2.0).mean(axis=1); mean = d.mean(axis=1); hits = []
    for y in range(8, len(mean) - 8):
        nb = np.concatenate([mean[y-8:y-1], mean[y+2:y+9]]); base = np.median(nb) + 0.3
        if mean[y] > 1.5 and frac[y] > 0.5 and mean[y] > 4 * base: hits.append(int(y))
    rec('FAIL' if hits else 'PASS', 'no seams in the scene', where, f'rows {hits}' if hits else '')


async def check_regression(pg, t, s, where):
    """Registration against the committed baseline for this platform.

    The gate fails a screen when more than 0.1% of its pixels differ from the baseline by more
    than 10 levels in any channel, or when the mean absolute shift exceeds 0.5 levels.
    """
    await goto(pg, t, s, chrome=1)
    cur = Image.open(io.BytesIO(await pg.screenshot())).convert('RGB')
    name = f'{t}-{s}.png'
    cur.save(os.path.join(OUT, name))
    bp = os.path.join(BASE, name)
    if ACCEPT:
        os.makedirs(BASE, exist_ok=True); cur.save(bp)
        rec('SET', 'visual regression vs baseline', where, f'baseline written to {rel(bp)}')
        return
    if not os.path.exists(bp):
        rec('FAIL', 'visual regression vs baseline', where,
            f'no baseline at {rel(bp)}; run "python quality/gate.py --accept" on the machine of record, then commit it')
        return
    base = Image.open(bp).convert('RGB')
    if base.size != cur.size:
        rec('FAIL', 'visual regression vs baseline', where, f'size changed: {base.size} to {cur.size}')
        return
    diff = np.abs(np.asarray(base).astype(int) - np.asarray(cur).astype(int)).max(axis=2)
    changed = (diff > 10).mean() * 100; tone = float(diff.mean())
    rows = np.where((diff > 10).mean(axis=1) > 0.02)[0]
    span = f'rows {rows.min()} to {rows.max()}' if len(rows) else ''
    ok = changed <= REG_PCT and tone <= REG_MEAN
    rec('PASS' if ok else 'FAIL', 'visual regression vs baseline', where,
        f'{changed:.3f}% of pixels changed, mean shift {tone:.3f} {span}'.strip())


def rel(p):
    return os.path.relpath(p, ROOT).replace(os.sep, '/')


def write_report(chromium_version=''):
    order = {'FAIL': 0, 'WARN': 1, 'SET': 2, 'PASS': 3}
    results.sort(key=lambda r: (order[r[0]], r[1], r[2]))
    fails = [r for r in results if r[0] == 'FAIL']
    warns = [r for r in results if r[0] == 'WARN']
    sets = [r for r in results if r[0] == 'SET']
    passes = [r for r in results if r[0] == 'PASS']
    head = f'EARNED UI GATE: {len(fails)} FAIL, {len(warns)} WARN, ' + (f'{len(sets)} SET, ' if sets else '') + f'{len(passes)} PASS'
    lines = (['ACCEPT RUN: regression compared nothing'] if ACCEPT else []) + [head, '']
    for lv, ch, wh, de in fails + warns + sets:
        lines.append(f'{lv:4s}  {ch:52s} {wh:22s} {de}')
    checks = sorted({r[1] for r in passes} - {r[1] for r in fails + warns})
    lines += ['', 'Passed everywhere: ' + '; '.join(checks)]
    report = '\n'.join(lines)
    print(report)
    with open(os.path.join(OUT, 'report.txt'), 'w', encoding='utf-8') as f:
        f.write(report)
    with open(os.path.join(OUT, 'report.json'), 'w', encoding='utf-8') as f:
        json.dump([list(r) for r in results], f, indent=1)
    if ACCEPT:
        os.makedirs(BASE, exist_ok=True)
        with open(os.path.join(BASE, 'ENV.txt'), 'w', encoding='utf-8') as f:
            f.write('\n'.join([
                'the machine that set these baselines',
                f'os: {plat.system()} {plat.release()} ({sys.platform})',
                f'python: {plat.python_version()}',
                f'playwright: {playwright_version()}',
                f'chromium: {chromium_version}',
                f'screens: {", ".join(f"{t}-{s}" for t in THEMES for s in SCREENS)}',
                f'viewport: {REF[0]}x{REF[1]}, chrome=1, date=board',
            ]) + '\n')
    sys.exit(1 if fails else 0)


def playwright_version():
    try:
        from importlib.metadata import version
        return version('playwright')
    except Exception:
        return 'unknown'


def refuse(msg):
    line = f'EARNED UI GATE: REFUSED. {msg}'
    print(line)
    try:
        body = [line]
        for lv, ch, wh, de in results:   # whatever the run did manage to measure is still written down
            if lv != 'PASS':
                body.append(f'{lv:4s}  {ch:52s} {wh:22s} {de}')
        with open(os.path.join(OUT, 'report.txt'), 'w', encoding='utf-8') as f:
            f.write('\n'.join(body) + '\n')
    except Exception:
        pass
    sys.exit(2)


if __name__ == '__main__':
    if ACCEPT and (SCREENS != ALL_SCREENS or SIZES != ALL_SIZES):
        refuse('--accept sets every baseline, so it cannot be combined with --screens or --sizes')
    try:
        asyncio.run(main())
    except Refused as e:
        refuse(str(e))
    except SystemExit:
        raise
    except Exception as e:
        refuse(f'{APP} could not be measured: {type(e).__name__}: {str(e)[:200]}')
