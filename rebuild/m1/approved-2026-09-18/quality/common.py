#!/usr/bin/env python3
"""What the three gates share: the copy sweeps, the contrast tiers, the label font, the refusals.

Kept in one file so gate.py and statesheet.py cannot drift apart on the same rule.
Nothing here opens a browser; it is pure helpers and constants.
"""
import os, sys, re, hashlib, pathlib, platform as plat
import numpy as np
from PIL import ImageFont

# ---------------------------------------------------------------- copy sweeps
DASHES = ['\u2014', '\u2013', ' - ']
READINESS = ['ready', 'readiness', 'recovered', 'fatigued']
VENDORS = ['openai', 'anthropic', 'claude', 'gpt', 'gemini', 'chatgpt', 'whisper', 'elevenlabs', 'llama']
# a set written with the letter x instead of the multiplication sign: "50 x 8", "3x8", "50 X 8"
SET_LETTER_X = re.compile(r'\d\s*[xX]\s*\d')


def copy_problems(text):
    """The three copy sweeps on one screen's visible text.

    The word list is matched on a real word boundary: the pattern is built with r'\\b' + word,
    which is backslash b, so "Ready to train" matches and "already" does not. The earlier form
    doubled the backslash and could never match anything.
    """
    low = text.lower()
    bad = [d for d in DASHES if d in text]
    bad += [w for w in READINESS if re.search(r'\b' + w + r'\b', low)]
    bad += [v for v in VENDORS if v in low]
    return bad


def set_x_problems(text):
    """Every set written with the letter x. The multiplication sign is the only form allowed."""
    return sorted({m.group(0) for m in SET_LETTER_X.finditer(text)})


# ---------------------------------------------------------------- contrast
# Muted is not "the colour differs from the body colour". It is the pack's own token, or one of the
# classes the pack's stylesheets paint with --muted, --faint or the eyebrow recipe. Read off
# app/app.css (lines 192, 201, 210, 220, 224, 233, 253, 264, 270, 277, 278, 287, 294, 299, 329, 434,
# 435, 439, 444, 611, 646, 663), app/states.css (5, 33, 38, 50, 52, 57, 58, 70, 74, 77, 82, 89, 104,
# 107), app/states-workout.css (8, 16, 37, 38, 41) and app/states-coach.css (5, 8, 37).
MUTED_CLASSES = frozenset([
    'date', 'eyebrow', 'sub', 'unit', 'weigh-note', 'reason', 'kind', 'state', 'times', 'when',
    'unsure', 'last', 'opt', 'link', 'why', 'undo', 'from', 'row-chev',
    'status-pill', 'sample', 'refusal-tail', 'muted', 'pfield-label', 'pfield-unit', 'pfield-hint',
    'recorded-stamp', 'recorded-source', 'kv-k', 'marker-k', 'marker-v', 'marker', 'said', 'quoted',
    'w-more', 'w-hint', 'w-facts', 'w-rest-line', 'w-next-aim', 'tail', 'coach-marker',
])
# The two quiet greys are never body copy anywhere (app/app.css:36, 37 for Ink, 92, 93 for Dawn).
QUIET_TOKENS = frozenset(['--muted', '--faint'])
# The state colour (app/app.css:38 and 93) is the lower tier only where it is doing the job
# STANDARD.md section 10 gives it, marking a state: the element carries one of the marker or
# eyebrow classes, or its text is too short to be a sentence. A paragraph painted gold is body
# copy and stays at 4.5:1.
GOLD_TOKEN = '--gold'
GOLD_MARKER_CLASSES = frozenset(['kind', 'state-word', 'eyebrow', 'marker', 'marker-k', 'marker-v',
                                 'coach-marker', 'status-pill', 'panel-h'])
GOLD_MARKER_CHARS = 24
PRIMARY_RATIO = 4.5
MUTED_RATIO = 3.0
LARGE_TEXT_PX = 24

# This sentence is quoted in README section 3 in the same words.
CONTRAST_TOLERANCE = ("Primary text needs 4.5:1 against what is actually behind it; muted text, a "
                      "disabled control's label, the state colour where it is marking a state and "
                      "text 24 px or larger need 3.0:1.")


def tier_for(cls, size, token, disabled=False, textlen=0):
    """Primary text needs 4.5:1 against what is actually behind it; muted text, a disabled
    control's label, the state colour where it is marking a state and text 24 px or larger need
    3.0:1.

    A disabled control sits at the lower tier because STANDARD.md section 10 calls its label a
    muted label, and because an inactive control is not something the athlete is being asked to
    read. The state colour sits there only when it is marking a state: a gold marker class, or a
    string shorter than a sentence. Gold on a paragraph is body copy and keeps 4.5:1.
    """
    classes = set((cls or '').split())
    if disabled or token in QUIET_TOKENS or (classes & MUTED_CLASSES) or size >= LARGE_TEXT_PX:
        return MUTED_RATIO
    if token == GOLD_TOKEN and ((classes & GOLD_MARKER_CLASSES) or textlen < GOLD_MARKER_CHARS):
        return MUTED_RATIO
    return PRIMARY_RATIO


def lum_array(a):
    """Relative luminance of an array of sRGB triples, shape (..., 3), values 0 to 255."""
    c = np.asarray(a, dtype=float) / 255.0
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def worst_ratio(colour, region):
    """The worst contrast between one text colour and the 25% of the region closest to it in luminance."""
    samp = region[:: max(1, len(region) // 400)]
    if len(samp) == 0:
        return None
    tl = float(lum_array(np.array(colour, dtype=float)))
    ls = lum_array(samp)
    keep = np.argsort(np.abs(ls - tl))[: max(1, len(ls) // 4)]
    near = ls[keep]
    hi = np.maximum(near, tl) + 0.05
    lo = np.minimum(near, tl) + 0.05
    return float((hi / lo).min())


# ---------------------------------------------------------------- label font
# No absolute path: Pillow looks in the platform's own font directories for a bare file name
# (%WINDIR%\Fonts on Windows, the share and home font directories elsewhere), and when none of
# them answers the built in bitmap face draws the labels instead.
FONT_CANDIDATES = ('DejaVuSans.ttf', 'LiberationSans-Regular.ttf', 'NotoSans-Regular.ttf',
                   'FreeSans.ttf', 'segoeui.ttf', 'arial.ttf', 'Arial.ttf', 'Helvetica.ttc')


def label_font(size):
    for name in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(name, size)
        except Exception:
            pass
    try:
        return ImageFont.load_default(size=size)
    except Exception:
        return ImageFont.load_default()


# ---------------------------------------------------------------- refusals
class Refused(Exception):
    """The gate could not run at all: one line, no traceback, exit 2."""


def app_url():
    """The build under test. EARNED_APP points the gates at the real client's preview build.

    Path.as_uri() writes the file URL the way each platform needs it, so the default works
    from a Windows drive letter as well as from a POSIX path.
    """
    root = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
    env = os.environ.get('EARNED_APP')
    if env:
        return env
    return pathlib.Path(os.path.join(root, 'app', 'app.html')).as_uri()


def sha256_bytes(b):
    return hashlib.sha256(b).hexdigest()


def platform_key():
    """Renders differ by machine, so baselines are filed under the platform that drew them."""
    return sys.platform


# ---------------------------------------------------------------- one browser for every script
# gate.py, statesheet.py and phonesheet.py launch Chromium with this list and nothing else, so a
# screen is laid out the same way whichever script draws it and whichever machine runs it.
#
# The second argument is there for the layout, not for the look. Headless Chromium on Linux hints
# glyphs by default, and a hinted glyph's advance is snapped to a whole pixel, so a line of text
# comes out a few pixels wider or narrower than the same line on Windows, on macOS or on a phone,
# and now and then it wraps on a different word. Measured on 2026-09-19 against the records this
# pack first committed, which a hinted Linux run had written: the owner's Windows PC failed 254 of
# 418 renders (worst rect edge 170 px against a tolerance of 3), and a Linux run launched with
# this argument failed the same 254 renders with the same 254 report lines, word for word and
# number for number. With hinting off, Linux lays text out at the font's own fractional advances,
# as the other platforms always do; on Windows the argument changes nothing (372 PASS against
# screen baselines drawn without it). quality/teeth.py row p1 takes the argument out and expects
# the state sheet to FAIL on Linux, so the list cannot quietly lose it.
LAUNCH_ARGS = ['--allow-file-access-from-files', '--font-render-hinting=none']


# ---------------------------------------------------------------- who drew a committed baseline
def playwright_version():
    try:
        from importlib.metadata import version
        return version('playwright')
    except Exception:
        return 'unknown'


def env_text(chromium_version, drew):
    """ENV.txt beside a committed set of baselines: the machine that drew them, how the browser
    was launched, and what was drawn. One form, written by gate.py beside the screen baselines
    and by statesheet.py beside this platform's thumbnails, so the two cannot drift.

    The launch list is on it because a render is a property of the arguments as well as of the
    machine: quality/teeth.py row p1 takes one argument out of LAUNCH_ARGS and the state sheet
    fails on a moved rect, so a baseline set drawn under a different list is a different set.
    """
    return '\n'.join([
        'the machine that set these baselines',
        f'os: {plat.system()} {plat.release()} ({platform_key()})',
        f'python: {plat.python_version()}',
        f'playwright: {playwright_version()}',
        f'chromium: {chromium_version}',
        f'launch: {" ".join(LAUNCH_ARGS)}',
    ] + list(drew)) + '\n'


# ---------------------------------------------------------------- what counts as on the screen
# One definition, injected into both gates wherever they walk elements, so the two cannot drift.
# It names the mechanisms it checks, which is not every way a line can be hidden: a shape function
# other than inset(), a colour matched to its background, a transform off the plate and a parent
# that paints over it are not read here. Each of these was found by a reviewer rebuilding the
# defect, and the list grows the same way.
JS_SEEN = """
    const __clipEmpty=(cp,r)=>{const m=cp.match(/^inset\\(([^)]*)\\)/);if(!m)return false;
      const parts=m[1].trim().split(/\\s+/).filter(x=>x&&x!=='round');
      const v=(x,base)=>x.endsWith('%')?parseFloat(x)*base/100:parseFloat(x);
      const p=parts.slice(0,4);let t,rr,b,l;
      if(p.length===1){t=v(p[0],r.height);b=t;rr=v(p[0],r.width);l=rr}
      else if(p.length===2){t=v(p[0],r.height);b=t;rr=v(p[1],r.width);l=rr}
      else if(p.length===3){t=v(p[0],r.height);rr=v(p[1],r.width);l=rr;b=v(p[2],r.height)}
      else if(p.length>=4){t=v(p[0],r.height);rr=v(p[1],r.width);b=v(p[2],r.height);l=v(p[3],r.width)}
      else return false;
      if([t,rr,b,l].some(x=>isNaN(x)))return false;
      return (t+b)>=r.height-0.01||(l+rr)>=r.width-0.01};
    const __seen=e=>{if(!e.offsetParent)return false;
      const cs=getComputedStyle(e);
      if(cs.visibility!=='visible')return false;
      let op=1,a=e;while(a&&a!==document.documentElement){op*=parseFloat(getComputedStyle(a).opacity||'1');a=a.parentElement}
      if(op<=0.001)return false;
      const r=e.getBoundingClientRect();
      if(r.width<=0||r.height<=0)return false;
      if(r.bottom<=0||r.right<=0||r.top>=window.innerHeight||r.left>=window.innerWidth)return false;
      if(parseFloat(cs.textIndent||'0')<=-1000)return false;
      const cp=(cs.clipPath||'none').trim();
      if(cp!=='none'&&__clipEmpty(cp,r))return false;
      return true};
"""

# ---------------------------------------------------------------- what the copy sweeps read
# innerText is not the interface copy the athlete sees. A placeholder, an assistive label, a
# tooltip, an image's alternative text, a filled in value and a string in CSS generated content
# are all read off the screen or read out loud, and all of them are outside innerText. Both gates
# sweep this one string so neither can be stricter than the other.
JS_SWEPT_TEXT = """()=>{const ui=document.querySelector('.screen.is-active .ui');
    if(!ui)return {text:'', unreadable:[]};
    const parts=[ui.innerText], unreadable=[];
    const attrs=['placeholder','aria-label','title','alt'];
    const push=v=>{if(typeof v==='string'&&v.trim())parts.push(v)};
    /* attr() is resolved into a quoted string by the time getComputedStyle answers, so it is swept.
       counter() and counters() are not: the computed value still carries the call, and the number
       the screen draws is not available here. That is its own FAIL, never a silent pass. */
    const gen=(e,which)=>{const c=getComputedStyle(e,which).content;
      if(!c||c==='none'||c==='normal')return;
      const m=c.match(/"([^"]*)"|'([^']*)'/g);
      if(m)m.forEach(q=>push(q.slice(1,-1)));
      if(/counters?\\(/.test(c.replace(/"[^"]*"|'[^']*'/g,'')))
        unreadable.push((e.id||e.className||e.tagName)+which+' '+c.slice(0,60))};
    ui.querySelectorAll('*').forEach(e=>{if(!e.offsetParent)return;
      attrs.forEach(a=>push(e.getAttribute(a)));
      if(('value' in e)&&e.tagName!=='BUTTON')push(e.value);
      gen(e,'::before');gen(e,'::after')});
    return {text: parts.join('\\n'), unreadable: unreadable}}"""

# the check name both gates use when generated content carries a value the sweep cannot resolve
UNREADABLE_CHECK = 'generated content the sweep cannot read'
UNREADABLE_WHY = ('a counter() or counters() in ::before or ::after draws a string the gate cannot '
                  'resolve, so the copy rules cannot be held over it')
