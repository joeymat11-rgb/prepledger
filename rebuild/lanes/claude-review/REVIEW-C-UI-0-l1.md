# CLAUDE REVIEW: C-UI-0 (the design quality gates, the 18-item closure), round 1
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1; no hand in this lane, its audit or its reviews.
Asked at DECISIONS:697, class (b), pinned at S9. Run on Joe's word "review".
Head cf14982050a8169c7f4848ec0bf1f69c2bb5759f, base 6c5936036c58b2381ebd56551888ea0e5867719e, red f8a68ced / 103ad57 / cf31f82.
Spec rebuild/lanes/c/ui-port/C-UI-0.md sha256 re-measured 81e24c3cc5d2a11e9e54e15059f48157a0a2520c5e42399807d796845457f54a
(equal to :697); not read whole: scope was held to :616/:625 as the ledger states them and the eight changed paths.
PC clock 2026-09-21 19:30 to 19:33 ET. Fresh scratch %TEMP%\claude-r2; nothing under claude-epp read or run (:658).
Author report (60 lines) and Astra 082a1997 (58 lines) read whole AFTER my own reading of every hunk.
## VERDICT
ACCEPT WITH ONE NAMED DEBT. The six gate hunks do what the report says, the item-4 contract is the right shape
(the expectation is frozen in code and cannot be moved by the thing it judges), the minus channel binds each
boundary to its own DOM occurrence, and app/ is untouched (diff --stat over app: 0). The debt is a width in the
new numeric-sibling exception that the order of :625 did not ask for.
## EVERY PRODUCT HUNK (DECISIONS:439), base..head under rebuild/m1/approved-2026-09-18/quality, all read
STANDARD.md +13 -12 (disclosures: eight pressed samples, top-left radius only, sans 400 admitted, conservative
  target walk, the state-primary contract, the external digest, 105 teeth rows). common.py +48 -11 (minus channel,
  external_app_digest, report_identity). gate.py +4 -2, phonesheet.py +4 -1 (refuse an external run without a
  digest; consume minusText). statesheet.py +43 -20 (NO_PRIMARY 29, PANEL_PRIMARY 32, SCREEN_PRIMARY by screen,
  required_primary; JS_INFO takes the required selector; present / drawn / edge are three named problems).
  teeth.py +115 -4 (rows z1 to z13; launched / skipped / VOID counted apart; z7). Not product: the package
  (27 pins, roles and dispositions rewritten, read) and the author report. No workflow, runner or app byte.
## WHAT I CHECKED, by reading (no gate was run by me; both ordinary runs exist independently on both systems)
1. ITEM 4. required_primary answers from the frozen lists, never from what rendered; JS_INFO looks up only that
   selector; a present-but-hidden node is "not drawn", a removed node "not on the page", an overlay state in
   NO_PRIMARY gets no requirement. z1, z2, z3 are the three shapes. A state added to app/ later and to no list
   defaults to its screen's control, so an overlay state that forgets the list fails closed. Good.
2. THE MINUS CHANNEL. Eligibility is decided on the untouched DOM (two seen elements, both wholly numeric, only
   whitespace text nodes between them); the marker is written into exactly those nodes, innerText is re-read,
   every node is restored and a failed restoration is itself an UNREADABLE failure. Equal flat text elsewhere is
   untouched (z11, z12, z13). The word, vendor, Cf and set-x sweeps keep the flat text, so a split "Ready" cannot
   pass (common.py comment and copy_problems). Sound.
3. IDENTITY. EARNED_APP without a 64-hex EARNED_APP_DIGEST is refused before a browser starts, at all three entry
   points; the report says "caller-supplied" and never "verified". z5, z6. Right words.
4. TEETH. A VOID anchor no longer counts as run (z7); the rows line prints four numbers. Right.
## NAMED DEBT
D-CUI-UNIT THE UNIT CLAUSE IS ANY WORD. common.py's numeric test is  ^[+-U+2212]?\d+(?:[.,]\d+)?(?:\s*[A-Za-z%]+\.?)?$
  so a "numeric element" may end in any single word: "-5 lb." (z4, the ordered case) but also "-5 reps",
  "-5 sets", "-5 today". Hence  <span>3</span> <span>-5 sets</span>  renders as "3 -5 sets", the range the
  rule exists to catch, and passes as two cells. :625 ordered green for two signed VALUES in separate spans; it
  did not order that a value may carry a word. Smallest shape: a closed unit list (lb, kg, %, s, min, and what
  the pack actually paints; STANDARD names them) or a bare number in at least the second span, one teeth row
  each way. READ, not executed (I ran no gate); a debt, not a blocker: it is a copy tripwire, no athlete data.
  PAYS: before the S9 pin if the PM wants no re-pin, else C-UI-GATES-2 with the other sampled widenings.
## NOTES
N1 SCREEN_PRIMARY[st['screen']] raises KeyError for a fourth screen name; the sheet would die with a traceback
   instead of a one-line refusal naming the state. Three screens exist today. For C-UI-GATES-2.
N2 The old "3 -5 in two inline spans is a known false red that fails closed" sentence is gone from STANDARD and
   from y13c's disposition, replaced by the exception. That is :625's order and is recorded as superseded, not
   hidden. Fine; the debt above is only about how wide the exception grew.
N3 I did not re-run the 372-row gate, the 418-render sheet or the 105 teeth rows: Windows and Linux ordinary runs
   and the 26-kill guard sweep are the independent reviewer's and the hosted witness's, with hashes in the ledger.
## NOT DONE
No Python, browser or gate run; no visual look at any state; no read of the 53-row audit table itself. No
protected path, private fixture, ledger directory, old-app source or real measurement was opened or reached.
