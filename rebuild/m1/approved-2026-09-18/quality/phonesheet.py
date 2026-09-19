#!/usr/bin/env python3
"""Phone-zoom review sheet: every screen, both themes, cut into thirds at 3x, so review happens at
the scale a phone shows.

  python quality/phonesheet.py                 the three base screens
  python quality/phonesheet.py --state T-40    one drawn state, on its own screen
  python quality/phonesheet.py --state T-40,W-20,C-05

Writes quality/run/phonesheet-<screen or state>.png (one per sheet) and phonesheet-all.png.
Exit code: 0 written, 2 refused (it could not run).
"""
import asyncio, io, os, sys
from PIL import Image, ImageDraw
from playwright.async_api import async_playwright

try:   # a Windows console or a redirected log must not choke on the multiplication sign
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import app_url, label_font, Refused, LAUNCH_ARGS

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
APP = app_url()
OUT = os.path.join(ROOT, 'quality', 'run'); os.makedirs(OUT, exist_ok=True)

ARGS = sys.argv[1:]
STATE_ARG = None
for i, a in enumerate(ARGS):
    if a == '--state' and i + 1 < len(ARGS):
        STATE_ARG = ARGS[i + 1]
STATE_IDS = [s.strip() for s in STATE_ARG.split(',') if s.strip()] if STATE_ARG else []


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=LAUNCH_ARGS)
        ctx = await b.new_context(viewport={'width': 393, 'height': 852}, device_scale_factor=3, reduced_motion='reduce')
        pg = await ctx.new_page()
        f = label_font(34)
        try:
            await pg.goto(f'{APP}?theme=ink&screen=today&chrome=1&date=board')
        except Exception as e:
            raise Refused(f'{APP} could not be opened ({type(e).__name__})')
        await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(300)
        if not await pg.evaluate("()=>!!document.querySelector('.screen.is-active .ui')"):
            raise Refused(f'{APP} has no ".screen.is-active .ui" element')

        # each sheet is one screen, or one drawn state on the screen the state driver files it under
        sheets_wanted = []
        if STATE_IDS:
            if not await pg.evaluate("()=>!!(window.earnedStates && window.earnedStates.list)"):
                raise Refused(f'{APP} has no window.earnedStates.list(): it cannot draw --state')
            known = {s['id']: s for s in await pg.evaluate('window.earnedStates.list()')}
            for sid in STATE_IDS:
                if sid not in known:
                    raise Refused(f'{APP} has no state {sid}')
                sheets_wanted.append((known[sid]['screen'], sid, f'{sid}  {known[sid]["title"]}'))
        else:
            for s in ['today', 'workout', 'coach']:
                sheets_wanted.append((s, None, s.upper()))

        sheets = []
        for screen, sid, heading in sheets_wanted:
            shots = {}
            for t in ['ink', 'dawn']:
                extra = f'&state={sid}' if sid else ''
                await pg.goto(f'{APP}?theme={t}&screen={screen}&chrome=1&date=board{extra}')
                await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(500)
                shots[t] = Image.open(io.BytesIO(await pg.screenshot()))
            W, H = shots['ink'].size; third = H // 3
            # layout: rows = thirds, columns = ink, dawn; each third shown at full 3x width
            sheet = Image.new('RGB', (W * 2 + 90, third * 3 + 4 * 60), (20, 18, 16)); d = ImageDraw.Draw(sheet)
            d.text((30, 14), f'{heading}   phone zoom, thirds   (Ink | Dawn)', fill=(230, 215, 190), font=f)
            for i in range(3):
                y = 60 + i * (third + 60)
                for c, t in enumerate(['ink', 'dawn']):
                    crop = shots[t].crop((0, i * third, W, (i + 1) * third)); sheet.paste(crop, (30 + c * (W + 30), y + 20))
                d.text((30, y - 10), ['top third', 'middle third', 'bottom third'][i], fill=(190, 180, 165), font=f)
            path = os.path.join(OUT, f'phonesheet-{sid or screen}.png'); sheet.save(path); sheets.append(sheet); print('wrote', path)
        await b.close()
    tot = Image.new('RGB', (max(x.width for x in sheets), sum(x.height for x in sheets) + 40 * (len(sheets) - 1)), (20, 18, 16)); y = 0
    for x in sheets:
        tot.paste(x, (0, y)); y += x.height + 40
    tot.save(os.path.join(OUT, 'phonesheet-all.png')); print('wrote phonesheet-all.png', tot.size)


def refuse(msg):
    print(f'PHONE SHEET: REFUSED. {msg}')
    sys.exit(2)


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except Refused as e:
        refuse(str(e))
    except SystemExit:
        raise
    except Exception as e:
        refuse(f'{APP} could not be drawn: {type(e).__name__}: {str(e)[:200]}')
