#!/usr/bin/env python3
"""Earned UI quality gate.

Runs every automatic check in quality/STANDARD.md against the app and prints a PASS / WARN / FAIL table.
  python3 quality/gate.py            run the checks, compare screenshots to the baseline
  python3 quality/gate.py --accept   run the checks and make this run the new baseline (on purpose only)
Exit code is 1 when anything FAILs.
"""
import asyncio, os, sys, io, json, hashlib, re
import numpy as np
from PIL import Image
from playwright.async_api import async_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
APP = os.environ.get('EARNED_APP') or f'file://{ROOT}/app/app.html'   # point at another build (the real client's preview) with EARNED_APP=<url or file://path>
QDIR = os.path.join(ROOT, 'quality')
BASE = os.path.join(QDIR, 'baseline'); os.makedirs(BASE, exist_ok=True)
OUT = os.path.join(QDIR, 'run'); os.makedirs(OUT, exist_ok=True)
ACCEPT = '--accept' in sys.argv

THEMES = ['ink', 'dawn']; SCREENS = ['today', 'workout', 'coach']
SIZES = [(393, 852), (375, 812), (360, 780)]
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
DASHES = ['—', '–', ' - ']
READINESS = ['ready', 'readiness', 'recovered', 'fatigued']
VENDORS = ['openai', 'anthropic', 'claude', 'gpt', 'gemini', 'chatgpt', 'whisper', 'elevenlabs', 'llama']

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

def lum(c):
    c = np.array(c[:3], dtype=float) / 255.0
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def contrast(a, b):
    la, lb = lum(a), lum(b); hi, lo = max(la, lb), min(la, lb); return (hi + 0.05) / (lo + 0.05)

async def goto(pg, theme, screen, chrome=0, extra=''):
    await pg.goto(f'{APP}?theme={theme}&screen={screen}&chrome={chrome}&date=board{extra}')
    await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(350)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files'])

        # ---------- errors, motion, transitions, copy, targets, fit, thumb, columns, spacing, type, pressed, contrast, seams, regression ----------
        for W, H in SIZES:
            ctx = await b.new_context(viewport={'width': W, 'height': H}, reduced_motion='reduce'); pg = await ctx.new_page()
            errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            for t in THEMES:
                for s in SCREENS:
                    where = f'{t}-{s} {W}x{H}'
                    await goto(pg, t, s)
                    # fit and primary action
                    r = await pg.evaluate("""(sel)=>{const ui=document.querySelector('.screen.is-active .ui');const sc=ui.querySelector(':scope > .body')||ui;const e=document.querySelector(sel);const rr=e.getBoundingClientRect();
                        return {scroll:sc.scrollHeight, client:sc.clientHeight, prim:[rr.top, rr.bottom], pad:getComputedStyle(ui).paddingBottom}}""", PRIMARY[s])
                    if r['prim'][1] > H: rec('FAIL', 'primary action in first viewport', where, f"{PRIMARY[s]} bottom {r['prim'][1]:.0f} > {H}")
                    else: rec('PASS', 'primary action in first viewport', where, f"{PRIMARY[s]} at {r['prim'][0]:.0f}–{r['prim'][1]:.0f}")
                    if (W, H) == (393, 852):
                        if r['scroll'] > r['client']: rec('WARN', 'fits without scrolling at 393x852', where, f"{r['scroll']} > {r['client']}")
                        else: rec('PASS', 'fits without scrolling at 393x852', where)
                    if s == 'workout' and (W, H) == (393, 852):
                        c = (r['prim'][0] + r['prim'][1]) / 2 / H
                        rec('PASS' if c >= 0.70 else 'FAIL', 'Log in the thumb zone (centre >= 70% of height)', where, f'centre at {c*100:.0f}%')
                    # touch targets
                    small = await pg.evaluate("""()=>{const ui=document.querySelector('.screen.is-active .ui');const out=[];ui.querySelectorAll('button,a,input').forEach(e=>{if(e.offsetParent===null)return;const r=e.getBoundingClientRect();if(r.width===0)return;
                        const cs=getComputedStyle(e,'::before');let h=r.height,w=r.width;if(cs.content!=='none'&&cs.height&&cs.height!=='auto'){h=Math.max(h,parseFloat(cs.height));}
                        if(h<44||w<44)out.push((e.id||e.className)+' '+Math.round(w)+'x'+Math.round(h))});return out}""")
                    rec('FAIL' if small else 'PASS', 'touch targets >= 44 px', where, ', '.join(small))
                    if (W, H) != (393, 852): continue
                    # copy rules
                    text = await pg.evaluate("()=>document.querySelector('.screen.is-active .ui').innerText")
                    low = text.lower()
                    bad = [d for d in DASHES if d in text] + [w for w in READINESS if re.search(r'\\b' + w + r'\\b', low)] + [v for v in VENDORS if v in low]
                    rec('FAIL' if bad else 'PASS', 'copy: no dashes, readiness words, vendor names', where, ', '.join(repr(x) for x in bad))
                    if s == 'workout':
                        lab = await pg.inner_text('#log-label'); rec('PASS' if '×' in lab and ' x ' not in lab else 'FAIL', 'Log label uses ×', where, lab)
                    # transitions and animations
                    anim = await pg.evaluate("""()=>{const out=[];document.querySelectorAll('.screen.is-active *').forEach(e=>{if(e.tagName==='CANVAS')return;const cs=getComputedStyle(e);
                        if((cs.transitionDuration||'0s').split(',').some(v=>parseFloat(v)>0))out.push('transition '+(e.id||e.className));if(cs.animationName&&cs.animationName!=='none')out.push('animation '+(e.id||e.className))});return out.slice(0,5)}""")
                    rec('FAIL' if anim else 'PASS', 'no transitions or animations outside the embers', where, ', '.join(anim))
                    # underlines on links
                    ul = await pg.evaluate("()=>[...document.querySelectorAll('.screen.is-active .link')].filter(e=>e.offsetParent&&getComputedStyle(e).textDecorationLine.includes('underline')).map(e=>e.id||e.textContent)")
                    rec('FAIL' if ul else 'PASS', 'tertiary links have no underline', where, ', '.join(ul))
                    # right glyph column
                    offs = []
                    for gsel, csel in GLYPHS[s]:
                        d = await pg.evaluate("([g,c])=>{const a=document.querySelector(g).getBoundingClientRect();const b=document.querySelector(c).getBoundingClientRect();return b.right-(a.left+a.right)/2}", [gsel, csel])
                        if abs(d - 24) > 1: offs.append(f'{gsel} {d:.1f}')
                    rec('FAIL' if offs else 'PASS', 'right glyph column at 24 px', where, ', '.join(offs))
                    # icon columns and text edges
                    if s in ICON_COLUMNS:
                        bad = []
                        for a, bsel in ICON_COLUMNS[s]:
                            d = await pg.evaluate("([a,b])=>{const ra=document.querySelector(a).getBoundingClientRect(),rb=document.querySelector(b).getBoundingClientRect();return a.includes('text')||a.includes('label')?ra.left-rb.left:(ra.left+ra.right)/2-(rb.left+rb.right)/2}", [a, bsel])
                            if abs(d) > 1: bad.append(f'{a} vs {bsel}: {d:.1f}')
                        rec('FAIL' if bad else 'PASS', 'icons share a centre line, text shares an edge', where, ', '.join(bad))
                    badabs = []
                    for sel, want in ABS_COLUMNS.get(s, []):
                        v = await pg.evaluate("(a)=>{const e=document.querySelector(a);if(!e)return null;const r=e.getBoundingClientRect();return (a.includes('text')||a.includes('label')||a.includes('span'))?r.left:(r.left+r.right)/2}", sel)
                        if v is None or abs(v - want) > 1: badabs.append(f'{sel} {v}')
                    rec('FAIL' if badabs else 'PASS', 'same icon column (54) and text edge (88) on every screen', where, ', '.join(badabs))
                    # spacing scale between top-level blocks
                    gaps = await pg.evaluate("""()=>{const ui=document.querySelector('.screen.is-active .ui');const body=ui.querySelector(':scope > .body'),stack=ui.querySelector(':scope > .stack');const vis=l=>[...l].filter(e=>e.offsetParent&&!e.classList.contains('chrome')&&e.getBoundingClientRect().height>0);
                        /* gaps are measured between siblings of one container; the seam between a scrolling body and its fixed stack is set by the content, not the scale */
                        const groups=body?[vis(body.children),vis(stack?stack.children:[])]:[vis(ui.children)];const out=[];groups.forEach(kids=>{for(let i=1;i<kids.length;i++){const a=kids[i-1].getBoundingClientRect(),b=kids[i].getBoundingClientRect();out.push([kids[i-1].id||kids[i-1].className, kids[i].id||kids[i].className, Math.round((b.top-a.bottom)*10)/10])}});return out}""")
                    odd = [f'{a}→{b} {g}' for a, b, g in gaps if not any(abs(g - k) <= 0.6 for k in ALLOWED_GAPS) and not (g < 0 and 'title' in b)]
                    rec('WARN' if odd else 'PASS', 'gaps on the spacing scale', where, ', '.join(odd))
                    # type scale
                    ty = await pg.evaluate("""()=>{const sizes=new Set(),weights=new Set();document.querySelectorAll('.screen.is-active .ui *').forEach(e=>{if(!e.offsetParent)return;const has=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());if(!has)return;const cs=getComputedStyle(e);sizes.add(parseFloat(cs.fontSize));weights.add(parseInt(cs.fontWeight))});return {sizes:[...sizes],weights:[...weights]}}""")
                    ns = [x for x in ty['sizes'] if x not in ALLOWED_SIZES]; nw = [x for x in ty['weights'] if x not in ALLOWED_WEIGHTS]
                    rec('WARN' if (ns or nw) else 'PASS', 'type sizes and weights on the scale', where, f'new sizes {ns} new weights {nw}' if (ns or nw) else '')
                    # radii
                    rad = await pg.evaluate("""()=>{const out=new Set();document.querySelectorAll('.screen.is-active .tcard,.screen.is-active .rowcard,.screen.is-active .setcard,.screen.is-active .prompt,.screen.is-active .primary,.screen.is-active .log,.screen.is-active .edit,.screen.is-active .chip').forEach(e=>{if(e.offsetParent)out.add(getComputedStyle(e).borderTopLeftRadius)});return [...out]}""")
                    rec('PASS' if set(rad) <= {'14px'} else 'FAIL', 'radii: 14 px for cards, buttons and chips; full round only for pills', where, ', '.join(rad))
                    # pressed states
                    same = []
                    for sel in PRESSABLE[s]:
                        el = await pg.query_selector(sel); box = await el.bounding_box()
                        clip = {'x': box['x'], 'y': box['y'], 'width': box['width'], 'height': box['height']}
                        idle = await pg.screenshot(clip=clip)
                        await pg.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2); await pg.mouse.down(); await pg.wait_for_timeout(40)
                        down = await pg.screenshot(clip=clip); await pg.mouse.up(); await pg.wait_for_timeout(40)
                        if hashlib.md5(idle).hexdigest() == hashlib.md5(down).hexdigest(): same.append(sel)
                        await goto(pg, t, s)  # reset any state the tap changed
                    rec('FAIL' if same else 'PASS', 'pressed state on every tappable surface', where, ', '.join(same))
                    # contrast, measured behind the text
                    boxes = await pg.evaluate("""()=>{const out=[];document.querySelectorAll('.screen.is-active .ui *').forEach(e=>{if(!e.offsetParent)return;const has=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1);if(!has)return;const r=e.getBoundingClientRect();if(r.width<8||r.height<8)return;
                        const cs=getComputedStyle(e);const m=cs.color.match(/\\d+/g);out.push({id:(e.id||e.className||e.tagName)+':'+e.textContent.trim().slice(0,18),x:r.left,y:r.top,w:r.width,h:r.height,c:m?m.slice(0,3).map(Number):null,size:parseFloat(cs.fontSize),muted:cs.color!==getComputedStyle(document.body).color})});return out}""")
                    await pg.add_style_tag(content=TEXT_ONLY_BG_CSS); await pg.wait_for_timeout(80)
                    bg = np.asarray(Image.open(io.BytesIO(await pg.screenshot())).convert('RGB')).astype(float)
                    lowc = []
                    for bx in boxes:
                        if not bx['c']: continue
                        ix, iy = bx['w'] * 0.15, bx['h'] * 0.15   # sample behind the glyphs, not the element's border or rim
                        x0, y0 = int(max(0, bx['x'] + ix)), int(max(0, bx['y'] + iy)); x1, y1 = int(min(W, bx['x'] + bx['w'] - ix)), int(min(H, bx['y'] + bx['h'] - iy))
                        if x1 <= x0 or y1 <= y0: continue
                        region = bg[y0:y1, x0:x1].reshape(-1, 3)
                        # worst case: the 25% of the region that is closest in luminance to the text colour
                        tl = lum(bx['c']); lums = np.array([lum(px) for px in region[::max(1, len(region)//400)]])
                        near = np.sort(np.abs(lums - tl))[: max(1, len(lums)//4)]
                        ratio = min(contrast(bx['c'], px) for px in region[::max(1, len(region)//400)][np.argsort(np.abs(lums - tl))[: max(1, len(lums)//4)]])
                        need = 3.0 if (bx['muted'] or bx['size'] >= 24) else 4.5
                        if ratio < 3.0: lowc.append(f"{bx['id']} {ratio:.1f}")
                        elif ratio < need: rec('WARN', 'contrast (measured behind the text)', where, f"{bx['id']} {ratio:.1f} < {need}")
                    rec('FAIL' if lowc else 'PASS', 'contrast (measured behind the text)', where, ', '.join(lowc))
                    # seams: scene + scrims only, single-row steps
                    await goto(pg, t, s); await pg.add_style_tag(content=HIDE_TEXT_CSS)
                    await pg.evaluate("document.querySelectorAll('canvas.embers').forEach(e=>e.style.visibility='hidden')"); await pg.wait_for_timeout(80)
                    im = np.asarray(Image.open(io.BytesIO(await pg.screenshot())).convert('L')).astype(float)
                    d = np.abs(np.diff(im, axis=0)); frac = (d > 2.0).mean(axis=1); mean = d.mean(axis=1); hits = []
                    for y in range(8, len(mean) - 8):
                        nb = np.concatenate([mean[y-8:y-1], mean[y+2:y+9]]); base = np.median(nb) + 0.3
                        if mean[y] > 1.5 and frac[y] > 0.5 and mean[y] > 4 * base: hits.append(int(y))
                    rec('FAIL' if hits else 'PASS', 'no seams in the scene', where, f'rows {hits}' if hits else '')
                    # visual regression against the baseline
                    await goto(pg, t, s, chrome=1)
                    png = await pg.screenshot(); cur = Image.open(io.BytesIO(png)).convert('RGB')
                    name = f'{t}-{s}.png'; cur.save(os.path.join(OUT, name)); bp = os.path.join(BASE, name)
                    if os.path.exists(bp) and not ACCEPT:
                        base = Image.open(bp).convert('RGB')
                        if base.size != cur.size: rec('FAIL', 'visual regression vs baseline', where, 'size changed')
                        else:
                            diff = np.abs(np.asarray(base).astype(int) - np.asarray(cur).astype(int)).max(axis=2)
                            changed = (diff > 10).mean() * 100; tone = float(diff.mean())
                            rows = np.where((diff > 10).mean(axis=1) > 0.02)[0]
                            span = f'rows {rows.min()}–{rows.max()}' if len(rows) else ''
                            rec('PASS' if (changed < 0.05 and tone < 0.5) else 'WARN', 'visual regression vs baseline', where, f'{changed:.2f}% of pixels changed, mean shift {tone:.2f} {span}')
                    else:
                        cur.save(bp); rec('PASS', 'visual regression vs baseline', where, 'baseline set')
            rec('FAIL' if errs else 'PASS', 'no page or console errors', f'{W}x{H}', '; '.join(errs[:3]))
            await ctx.close()

        # ---------- mist edges: with the mist drawn, the page margins must carry no straight step (the UI and status bar are hidden) ----------
        ctx = await b.new_context(viewport={'width': 393, 'height': 852}, device_scale_factor=3, reduced_motion='no-preference'); pg = await ctx.new_page()
        for t in THEMES:
            for s in SCREENS:
                await goto(pg, t, s); await pg.wait_for_timeout(1100)
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
            ctx = await b.new_context(viewport={'width': 393, 'height': 852}, reduced_motion=rm); pg = await ctx.new_page()
            for t, s in [('ink', 'today'), ('dawn', 'coach')]:
                await goto(pg, t, s); await pg.wait_for_timeout(900)
                if rm == 'no-preference': await pg.evaluate("document.querySelectorAll('canvas.embers').forEach(e=>e.style.visibility='hidden')")
                await pg.wait_for_timeout(150)
                a = await pg.screenshot(); await pg.wait_for_timeout(900); c = await pg.screenshot()
                da = np.asarray(Image.open(io.BytesIO(a)).convert('RGB')).astype(int); dc = np.asarray(Image.open(io.BytesIO(c)).convert('RGB')).astype(int)
                moved = int((np.abs(da - dc).max(axis=2) > 6).sum())   # 1-level anti-aliasing noise is not motion
                same = moved < 20
                rec('PASS' if same else 'FAIL', 'nothing moves except the embers' if rm == 'no-preference' else 'nothing moves under reduced motion', f'{t}-{s}', f'{moved} px moved' if not same else '')
            await ctx.close()
        await b.close()

    # ---------- report ----------
    order = {'FAIL': 0, 'WARN': 1, 'PASS': 2}
    results.sort(key=lambda r: (order[r[0]], r[1], r[2]))
    fails = [r for r in results if r[0] == 'FAIL']; warns = [r for r in results if r[0] == 'WARN']; passes = [r for r in results if r[0] == 'PASS']
    lines = [f'EARNED UI GATE  —  {len(fails)} FAIL · {len(warns)} WARN · {len(passes)} PASS' + ('   (baseline accepted)' if ACCEPT else ''), '']
    for lv, ch, wh, de in fails + warns: lines.append(f'{lv:4s}  {ch:52s} {wh:22s} {de}')
    checks = sorted({r[1] for r in passes} - {r[1] for r in fails + warns})
    lines += ['', 'Passed everywhere: ' + '; '.join(checks)]
    report = '\n'.join(lines); print(report)
    open(os.path.join(OUT, 'report.txt'), 'w').write(report)
    json.dump([list(r) for r in results], open(os.path.join(OUT, 'report.json'), 'w'), indent=1)
    sys.exit(1 if fails else 0)

asyncio.run(main())
