#!/usr/bin/env python3
"""What the three gates share: the copy sweeps, the contrast tiers, the label font, the refusals.

Kept in one file so gate.py and statesheet.py cannot drift apart on the same rule.
Nothing here opens a browser; it is pure helpers and constants.
"""
import os, sys, re, hashlib, pathlib
import numpy as np
from PIL import ImageFont

# ---------------------------------------------------------------- copy sweeps
DASHES = ['—', '–', ' - ']
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
PRIMARY_RATIO = 4.5
MUTED_RATIO = 3.0
LARGE_TEXT_PX = 24

# This sentence is quoted in README section 3 in the same words.
CONTRAST_TOLERANCE = ('Primary text needs 4.5:1 against what is actually behind it; muted text and '
                      'text 24 px or larger needs 3.0:1.')


def tier_for(cls, size, muted_colour):
    """4.5:1 for primary text, 3.0:1 for muted text and for text 24 px or larger."""
    classes = set((cls or '').split())
    if muted_colour or (classes & MUTED_CLASSES) or size >= LARGE_TEXT_PX:
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
