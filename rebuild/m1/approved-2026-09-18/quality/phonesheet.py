#!/usr/bin/env python3
"""Phone-zoom review sheet: every screen, both themes, cut into thirds at 3x, so review happens at the scale a phone shows.
   python3 quality/phonesheet.py            -> quality/run/phonesheet-<screen>.png (one per screen) and phonesheet-all.png
"""
import asyncio, os
from PIL import Image, ImageDraw, ImageFont
from playwright.async_api import async_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..')); APP = os.environ.get('EARNED_APP') or f'file://{ROOT}/app/app.html'; OUT = os.path.join(ROOT, 'quality', 'run'); os.makedirs(OUT, exist_ok=True)
STATES = [('today', ''), ('workout', ''), ('coach', '')]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files'])
        ctx = await b.new_context(viewport={'width': 393, 'height': 852}, device_scale_factor=3, reduced_motion='reduce'); pg = await ctx.new_page()
        f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 34)
        sheets = []
        for s, extra in STATES:
            shots = {}
            for t in ['ink', 'dawn']:
                await pg.goto(f'{APP}?theme={t}&screen={s}&chrome=1&date=board{extra}'); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(500)
                shots[t] = Image.open(__import__('io').BytesIO(await pg.screenshot()))
            W, H = shots['ink'].size; third = H // 3
            # layout: rows = thirds, columns = ink, dawn; each third shown at full 3x width
            sheet = Image.new('RGB', (W * 2 + 90, third * 3 + 4 * 60), (20, 18, 16)); d = ImageDraw.Draw(sheet)
            d.text((30, 14), f'{s.upper()}   phone zoom, thirds   (Ink | Dawn)', fill=(230, 215, 190), font=f)
            for i in range(3):
                y = 60 + i * (third + 60)
                for c, t in enumerate(['ink', 'dawn']):
                    crop = shots[t].crop((0, i * third, W, (i + 1) * third)); sheet.paste(crop, (30 + c * (W + 30), y + 20))
                d.text((30, y - 10), ['top third', 'middle third', 'bottom third'][i], fill=(190, 180, 165), font=f)
            path = os.path.join(OUT, f'phonesheet-{s}.png'); sheet.save(path); sheets.append(sheet); print('wrote', path)
        await b.close()
    tot = Image.new('RGB', (max(x.width for x in sheets), sum(x.height for x in sheets) + 40 * (len(sheets) - 1)), (20, 18, 16)); y = 0
    for x in sheets: tot.paste(x, (0, y)); y += x.height + 40
    tot.save(os.path.join(OUT, 'phonesheet-all.png')); print('wrote phonesheet-all.png', tot.size)
asyncio.run(main())
