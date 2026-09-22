# CLAUDE REVIEW: C-UI-0, round 3 (font transport: pinned font bytes carried as a data URI)
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1; author of rounds 1 and 2, not of this fix.
Asked at DECISIONS:733, class (b), font transport only. Run on Joe's word "review". STATIC ONLY as ordered.
Branch rebuild/c-cui-font-transport, head 0e5e1942501b333d71fd8822532a9e18f36f26ba, base 80fad72 (the :723 unit head),
red eaa4d76. Spec sha256 re-measured 81e24c3cc5d2a11e9e54e15059f48157a0a2520c5e42399807d796845457f54a (equal to :733).
PC clock 2026-09-21 22:44 to 22:47 ET. Scratch %TEMP%\claude-r2; nothing under claude-epp read or run (:658).
Author report (54 lines) and Astra a3fca86 (49 lines) read AFTER my own reading of every hunk.
## VERDICT
ACCEPT. One product hunk of 12 lines, read whole; it adds a third transport to the font-pin check without loosening
the pin. The pinned hash is still compared after the bytes arrive, whatever road they took. No debt.
## THE PRODUCT HUNK (gate.py +12 -1), and its two neighbours
face_bytes(pg, url) already read file: and http(s): fonts. It now also reads  data:font/woff2;base64,<payload>  :
exact prefix required, empty payload refused, strict base64 (validate=True) refused by name on any bad character;
anything else under data: refuses "must use base64". Every refusal is a ValueError, which the caller at :350-354
turns into a FAIL line "could not be read (...)"; a decoded payload whose sha256 differs from PINNED_FONTS is the
existing FAIL at :356-357. Not product: font_transport_test.py (+102, read whole: the two pinned faces round-trip
through the data road byte for byte and match their pins; an altered last byte fails the pin; %%% and a non-base64
data URI refuse by name; file: and a loopback http: road unchanged) and the report. No app, baseline or pin byte.
## WHAT I CHECKED MYSELF (reading)
1. NO WIDENING. The pin check itself (:341-359) is untouched: one @font-face per family, a url, bytes, sha256 equal
   to PINNED_FONTS. The new road only changes how bytes are fetched; a wrong font on the data road fails exactly as
   a wrong font on the file road does. That is the property the round was for.
2. STRICTNESS. validate=True rejects whitespace, URL-safe alphabet and stray characters; a payload with a bad
   final quantum raises binascii.Error, caught. The prefix is exact and case-sensitive, so  data:font/woff2;charset=
   utf-8;base64,  or  data:application/font-woff2;base64,  refuse with "must use base64": a true message for the
   gate ("not the one shape we accept"), a slightly wrong one for the reader. Safe side; see N1.
3. NO NETWORK. The data road never calls pg.request; a data URI cannot reach out. Good for the seal's containment.
## NOTES
N1 The two refusal messages could say which shape is accepted ("data:font/woff2;base64, only"); one string edit,
   whenever gate.py is next touched. Not a debt.
N2 On a mismatch, :357 prints os.path.basename(url); for a data URI that is the whole payload, tens of kilobytes,
   into one FAIL line and the report. Truncate to the prefix and a length for data: roads. Cosmetic, for GATES-2.
N3 The test drives face_bytes with a real Playwright request context but no page; the loopback server is the one
   network touch and it is 127.0.0.1. Fine to run anywhere; it is not yet wired into a cell list, which is the
   S9 brief's business, with the other font rows.
N4 Runtime proof is the independent reviewer's (12 of 12) and the author's; I re-ran nothing, as :733 orders.
## NOT DONE
No Python or gate run, no browser. No protected path, private fixture, ledger directory, old-app source or real
measurement was opened or reached by any process of mine.
