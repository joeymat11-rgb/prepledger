#!/usr/bin/env python3
"""State sheet: render every registered state in both themes, run the cheap checks on each, and tile them per screen.
   python3 quality/statesheet.py [--only T-] -> quality/run/states/<id>-<theme>.png, quality/run/statesheet-<screen>.jpg, quality/run/states-report.txt"""
import asyncio, os, io, sys, re, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from playwright.async_api import async_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..')); APP = os.environ.get('EARNED_APP') or f'file://{ROOT}/app/app.html'; OUT = os.path.join(ROOT, 'quality', 'run', 'states'); os.makedirs(OUT, exist_ok=True)
ONLY = None
for i, a in enumerate(sys.argv):
    if a == '--only': ONLY = sys.argv[i + 1]
TEXT_ONLY_BG_CSS = '.ui * { color: transparent !important; text-shadow: none !important; -webkit-text-fill-color: transparent !important; } .ui .link { text-decoration: none !important; } .ui svg, .ui .set-dots, .ui .tdot { visibility: hidden !important; } .ui input::placeholder { color: transparent !important; } .chrome { visibility: hidden !important; }'
def lum(c):
    c = np.array(c[:3], dtype=float) / 255.0; c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def contrast(a, b):
    la, lb = lum(a), lum(b); hi, lo = max(la, lb), min(la, lb); return (hi + 0.05) / (lo + 0.05)
DASHES = ['—', '–', ' - ']; READINESS = ['ready', 'readiness', 'recovered', 'fatigued']; VENDORS = ['openai', 'anthropic', 'claude', 'gpt', 'gemini', 'chatgpt', 'whisper', 'elevenlabs', 'llama']

async def main():
    rows = []
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files'])
        ctx = await b.new_context(viewport={'width': 393, 'height': 852}, device_scale_factor=2, reduced_motion='reduce'); pg = await ctx.new_page()
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        await pg.goto(f'{APP}?theme=ink&screen=today&chrome=1&date=board'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(300)
        states = await pg.evaluate('window.earnedStates.list()')
        if ONLY: states = [s for s in states if s['id'].startswith(ONLY)]
        for st in states:
            for t in ['ink', 'dawn']:
                n0 = len(errs)
                await pg.goto(f'{APP}?theme={t}&screen={st["screen"]}&chrome=1&date=board&state={st["id"]}'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(420)
                png = await pg.screenshot(); Image.open(io.BytesIO(png)).save(os.path.join(OUT, f'{st["id"]}-{t}.png'))
                info = await pg.evaluate("""()=>{const ui=document.querySelector('.screen.is-active .ui');const text=ui.innerText;const small=[];ui.querySelectorAll('button,a,input').forEach(e=>{if(e.offsetParent===null)return;const r=e.getBoundingClientRect();if(r.width===0)return;const cs=getComputedStyle(e,'::before');let h=r.height,w=r.width;if(cs.content!=='none'&&cs.height&&cs.height!=='auto')h=Math.max(h,parseFloat(cs.height));if(h<44||w<44)small.push((e.id||e.className||e.tagName)+' '+Math.round(w)+'x'+Math.round(h))});
                    const prim=Array.from(document.querySelectorAll('.screen.is-active #start, .screen.is-active #log, .screen.is-active .mic-button, .screen.is-active .panel-primary')).find(e=>e.offsetParent!==null&&e.getBoundingClientRect().width>0)||null;const pr=prim?prim.getBoundingClientRect():null;
                    const overflow=[];ui.querySelectorAll('.primary, #log, .decision, .chip, .save').forEach(e=>{if(e.offsetParent===null)return;if(e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1)overflow.push((e.id||e.className)+' '+e.textContent.trim().slice(0,24))});
                    const sc=ui.querySelector(':scope > .body')||ui;return {text, small, overflow, scroll: sc.scrollHeight, client: sc.clientHeight, primBelow: pr? pr.bottom>852 : false, applied: document.documentElement.getAttribute('data-state')}}""")
                boxes = await pg.evaluate("""()=>{const out=[];const ui=document.querySelector('.screen.is-active .ui');document.querySelectorAll('.screen.is-active .ui *').forEach(e=>{if(!e.offsetParent)return;const has=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1);if(!has)return;const r=e.getBoundingClientRect();if(r.width<8||r.height<8||r.top>852)return;
                    const cs=getComputedStyle(e);const m=cs.color.match(/\\d+/g);
                    /* text scrolled out of its own scroll region (Today's day under the fixed stack) is not on screen: clip to the region and skip what is mostly hidden */
                    let sc=e.parentElement,vis=null;while(sc&&sc!==ui){const o=getComputedStyle(sc).overflowY;if(o==='auto'||o==='scroll'){vis=sc.getBoundingClientRect();break}sc=sc.parentElement}
                    if(vis){const top=Math.max(r.top,vis.top),bot=Math.min(r.bottom,vis.bottom-22);if(bot-top<r.height*0.5)return;out.push({id:(e.id||e.className||e.tagName)+':'+e.textContent.trim().slice(0,18),x:r.left,y:top,w:r.width,h:bot-top,c:m?m.slice(0,3).map(Number):null,size:parseFloat(cs.fontSize)});return}
                    out.push({id:(e.id||e.className||e.tagName)+':'+e.textContent.trim().slice(0,18),x:r.left,y:r.top,w:r.width,h:r.height,c:m?m.slice(0,3).map(Number):null,size:parseFloat(cs.fontSize)})});return out}""")
                await pg.add_style_tag(content=TEXT_ONLY_BG_CSS); await pg.wait_for_timeout(60)
                bg = np.asarray(Image.open(io.BytesIO(await pg.screenshot())).convert('RGB').resize((393, 852), Image.BILINEAR)).astype(float)
                lowc = []
                for bx in boxes:
                    if not bx['c']: continue
                    ix, iy = bx['w'] * 0.15, bx['h'] * 0.15
                    x0, y0 = int(max(0, bx['x'] + ix)), int(max(0, bx['y'] + iy)); x1, y1 = int(min(393, bx['x'] + bx['w'] - ix)), int(min(852, bx['y'] + bx['h'] - iy))
                    if x1 <= x0 or y1 <= y0: continue
                    region = bg[y0:y1, x0:x1].reshape(-1, 3); samp = region[::max(1, len(region)//400)]
                    tl = lum(bx['c']); lums = np.array([lum(px) for px in samp]); worst = samp[np.argsort(np.abs(lums - tl))[: max(1, len(lums)//4)]]
                    ratio = min(contrast(bx['c'], px) for px in worst)
                    if ratio < 3.0: lowc.append(f"{bx['id']} {ratio:.1f}")
                low = info['text'].lower(); bad = [d for d in DASHES if d in info['text']] + [w for w in READINESS if re.search(r'\b' + w + r'\b', low)] + [v for v in VENDORS if v in low]
                problems = []
                if info['applied'] != st['id']: problems.append('state did not apply')
                if len(errs) > n0: problems.append('error: ' + errs[-1][:80])
                if bad: problems.append('copy: ' + ', '.join(repr(x) for x in bad))
                if info['small']: problems.append('targets: ' + ', '.join(info['small'][:3]))
                if info.get('overflow'): problems.append('label overflows its button: ' + ', '.join(info['overflow'][:3]))
                if st['screen'] == 'workout' and re.search(r'\boptional\b', low): problems.append('copy: "optional" on a set screen')
                # seams: a single-row step of the scene in both margins at once, with the text hidden
                lm = bg[60:830, 4:18].mean(axis=(1, 2)); rm = bg[60:830, 375:389].mean(axis=(1, 2))
                def flat(a, y): return y >= 4 and y + 4 <= len(a) and np.abs(np.diff(a[y - 4:y])).max() < 1.5 and np.abs(np.diff(a[y + 1:y + 5])).max() < 1.5   # flat on both sides: a drawn edge, not a photograph
                seam = [int(y) + 60 for y in range(1, len(lm)) if abs(lm[y] - lm[y - 1]) > 5 and abs(rm[y] - rm[y - 1]) > 5 and (lm[y] - lm[y - 1]) * (rm[y] - rm[y - 1]) > 0 and flat(lm, y) and flat(rm, y)]
                if seam: problems.append('seam at rows ' + ', '.join(str(y) for y in seam[:4]))
                if lowc: problems.append('contrast: ' + ', '.join(lowc[:3]))
                if info['scroll'] > info['client'] + 2 and info.get('primBelow'): problems.append(f'primary action below the fold ({info["scroll"]}>{info["client"]})')
                rows.append((st['id'], t, st['title'], st['status'], problems))
        await b.close()
    # tiles per screen
    f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22)
    for screen in ['today', 'workout', 'coach']:
        ids = [s['id'] for s in states if s['screen'] == screen]
        if not ids: continue
        W, H = 393, 852; cols = 6; scale = 0.5; tw, th = int(W * scale * 2), int(H * scale * 2)
        tiles = []
        for sid in ids:
            for t in ['ink', 'dawn']:
                im = Image.open(os.path.join(OUT, f'{sid}-{t}.png')).resize((tw, th), Image.LANCZOS); tiles.append((im, f'{sid} {t}: ' + next(s['title'] for s in states if s['id'] == sid)[:40]))
        rowsN = (len(tiles) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * (tw + 16) + 16, rowsN * (th + 44) + 16), (20, 18, 16)); d = ImageDraw.Draw(sheet)
        for i, (im, lab) in enumerate(tiles):
            x = 16 + (i % cols) * (tw + 16); y = 16 + (i // cols) * (th + 44); sheet.paste(im, (x, y + 28)); d.text((x, y), lab, fill=(230, 215, 190), font=f)
        sheet.save(os.path.join(ROOT, 'quality', 'run', f'statesheet-{screen}.jpg'), quality=80)
        print('wrote', f'statesheet-{screen}.jpg', sheet.size, len(ids), 'states')
    bad = [r for r in rows if r[4]]
    lines = [f'STATE SHEET  —  {len(rows)} renders, {len(bad)} with problems', '']
    for sid, t, title, status, probs in rows:
        if probs: lines.append(f'{sid:7s} {t:5s} {status:10s} {title[:44]:44s} {"; ".join(probs)}')
    lines += ['', 'clean: ' + ', '.join(sorted({r[0] for r in rows if not r[4]}))]
    rep = '\n'.join(lines); print(rep); open(os.path.join(ROOT, 'quality', 'run', 'states-report' + ('-' + ONLY.rstrip('-') if ONLY else '') + '.txt'), 'w').write(rep)
asyncio.run(main())
