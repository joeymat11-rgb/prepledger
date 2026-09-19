# C-UI-0 Audit 2: R4 fixes static re-check
Judge: Astra (Codex), commissioned by PM4 under DECISIONS:412, :569 and :593; static re-check of the R4 fixes, nothing executed; highest effort
Head read: 64a9e0954232ad10f66029c3031b8048c1f82802

Verdict on the delta: FIXES SOUND WITH NOTES.
B1's seventeen Zs spaces are covered; B2's inert-clip exemption is closed for elements that reach the helper. The new negative controls name the right failures. This is conditional static acceptance of those repairs, not signature of the whole audit. The surrounding walk still has exclusions the executor must settle, and the teeth counts in the documents need correction.
Paths below are relative to P = rebuild/m1/approved-2026-09-18/, except PKG = rebuild/lanes/c/ui-port/packages/C-UI-0.json. READ means code/specification inference, never a gate run. Hashing, literal counting and read-only git inspection were performed; no Python, Playwright, imported pack module or pack script was executed.

## Findings, most severe first

1. **High, inherited target/record blind spot exposed by the B2 re-check (READ):** quality/gate.py:153, quality/statesheet.py:84 and quality/common.py:360 reject a null offsetParent. A visible, tappable viewport-fixed 20 px control can have that value even with clip:auto; it is excluded before the repaired clip helper. The helper itself correctly treats fixed and absolute alike (common.py:174), but the complete walk does not. Smallest fix: replace the offsetParent visibility shortcut in these walks with a box/renderability test that retains visible fixed controls, retaining the positioned empty-clip exemption. Do not simply remove all hidden-element filtering. Execute paired absolute/fixed controls before whole-audit acceptance. This predicate predates the delta; it is not a regression introduced by 894bb406.
2. **Medium, copy-context limitation in the changed minus rule (READ):** quality/common.py:69-75 now calls every digit + spaces + U+2212 + digit a range. `1<U+00A0><U+2212>2` could be two signed values; it passed before and now fails. A normal isolated negative number and W-18's own-line button still pass by reading. The two owner rules do not directly conflict, but the helper infers semantics from a flattened line, not from a button or numeric token. Smallest robust fix if this legitimate case is required: preserve element/token boundaries for separate numbers and control labels; keep ranges rejected. Do not replace LF with spaces, which would destroy the measured button exception.
3. **Medium, raw-text checks still differ from the normalized sweeps (READ):** quality/common.py:115-117 and quality/statesheet.py:496 read raw text/lowercase respectively. `50 <U+FF58> 8` is not caught as letter-x notation; fullwidth `optional` is not caught by the workout-only rule although sweep_form would normalize both. Cf insertion does cause a separate copy failure, so that case is not a green bypass. Smallest fix: use sweep_form for these semantic checks, keeping raw Cf/dash evidence and exact-label checks. These are inherited limits of the touched sweep, not failures of the specific Zs repair.
4. **Low, stale counts and imprecise changed prose (READ):** README.md:321 and quality/STANDARD.md:112 say 42 teeth rows; quality/teeth.py:319-427 contains 46 (43 at the parent). Update both to 46, distinguish platform non-execution, and add q9-q11 to README.md:328-333. README.md:356 calls U+2060 a drawn space, although it is a zero-width joiner; common.py:90 folds it before removing Cf, so README.md:357-359's claim that every Cf is removed is also inexact. Describe that exception. STANDARD.md:130's "any other small box" overstates the actual filters in finding 1 and table 2; enumerate the exclusions. No tolerance changed.
5. **Coverage note (READ):** quality/statesheet.py:420-423 correctly re-raises Refused to :645-646 / :622-630 (exit 2). No teeth row injects Refused inside render_one. q5 changes a JavaScript apply function and requires exit 1, T-02 and a report (teeth.py:290-295,422-423); it cannot certify this Python exception branch. Smallest addition: an executor pair raising Refused versus an ordinary exception inside render_one, asserting the distinct exit/report contracts.

## (1) B1 and the complete fold

READ: common.py:104-107 applies spaced-hyphen and minus checks to fold_spaces, NOT to the full sweep_form. The latter additionally removes remaining Cf characters, NFKC-normalizes and casefolds (:80-91). Thus R4's requested Zs coverage is complete, but these are not identical strings.

| Character (all 17 Zs) | fold_spaces, common.py:41-52 (READ) |
|---|---|
| U+0020 SPACE | ordinary space, unchanged |
| U+00A0 NO-BREAK SPACE | ordinary space |
| U+1680 OGHAM SPACE MARK | ordinary space |
| U+2000 EN QUAD | ordinary space |
| U+2001 EM QUAD | ordinary space |
| U+2002 EN SPACE | ordinary space |
| U+2003 EM SPACE | ordinary space |
| U+2004 THREE-PER-EM SPACE | ordinary space |
| U+2005 FOUR-PER-EM SPACE | ordinary space |
| U+2006 SIX-PER-EM SPACE | ordinary space |
| U+2007 FIGURE SPACE | ordinary space |
| U+2008 PUNCTUATION SPACE | ordinary space |
| U+2009 THIN SPACE | ordinary space |
| U+200A HAIR SPACE | ordinary space |
| U+202F NARROW NO-BREAK SPACE | ordinary space |
| U+205F MEDIUM MATHEMATICAL SPACE | ordinary space |
| U+3000 IDEOGRAPHIC SPACE | ordinary space |

| Other requested character | fold_spaces / sweep_form / separate copy failure (READ, common.py:51,90-91,108) |
|---|---|
| U+0009 CHARACTER TABULATION | retained / retained / none solely for this character |
| U+000A LINE FEED | retained / retained / none; also splits minus-rule lines |
| U+000D CARRIAGE RETURN | retained / retained / none; not itself a minus-rule line separator |
| U+0085 NEXT LINE | retained / retained / none |
| U+2028 LINE SEPARATOR | retained / retained / none |
| U+2029 PARAGRAPH SEPARATOR | retained / retained / none |
| U+200B ZERO WIDTH SPACE | retained / removed / U+200B Cf failure |
| U+2060 WORD JOINER | ordinary space / ordinary space / U+2060 Cf failure on original text |
| U+FEFF ZERO WIDTH NO-BREAK SPACE | retained / removed / U+FEFF Cf failure |

READ: `<tab>-<tab>` has no literal ` - ` after this fold. Whether the DOM supplies tabs or collapsed spaces depends on the source/style; execute visible placeholders and preformatted copy as well as helper inputs. Blanket whitespace collapsing would erase the newline exception. The docstring's "a dozen" at common.py:44 is approximate; there are seventeen Zs entries above.
READ: raw tests remaining are is_dash (:106), Cf detection (:108), letter-x (:117), gate.py:463-464's exact Log-label multiplication sign, statesheet.py:496's optional rule, and gate.py:475-482's exact RIR labels. Raw dash/Cf detection preserves original forbidden characters; Log/RIR exactness is intentional. phonesheet.py performs no copy test. teeth.py judges exact output strings, not normalized UI copy.
READ: for a whole-line U+2212 label, strip()==MINUS_SIGN still wins before numeric analysis; Zs padding is harmless and LF survives. `<U+2212>5 lb`, `Change: <U+2212>5 lb`, ASCII `-5`, and ISO date `2026-09-19` still pass. `3<U+2212>5` and a numeric date range using U+2212 now fail intentionally; a spaced ASCII-hyphen range with Zs now fails intentionally. A Zs-padded ASCII `-` control also newly fails, but 8c117f36 exempted U+2212, not ASCII hyphen. Plain fullwidth-x notation remains a raw-test gap; no inference here claims every newly rejected mathematical string is a range.

## (2) B2: exact walk conditions and adversarial cases

READ: both 44 px walks are the same (gate.py:150-156; statesheet.py:81-86). Only descendants of `.screen.is-active .ui` matching common.py:153-159 are candidates. Missing UI yields no targets (the sheet separately reports missing UI at :464-466). Candidate exclusion is exactly offsetParent===null OR __clippedAway(e) OR bounding-rect width===0. There is no height-zero exclusion. An included candidate fails when width<44 or effective height<44; height is max(rect.height, parseFloat(::before.height)) when content!='none' and height is nonempty/non-auto. This is not a hit-test and does not prove that the pseudo-element actually supplies that area.
READ: __clippedAway (common.py:171-180) is true only for computed position absolute/fixed, nonempty non-auto clip, at least four numeric regex matches, and first-four bottom-top<=0 OR right-left<=0. It does not resolve auto edges, ancestor clips, clip/border-box intersection, or clip-path. Static, relative and sticky elements do not qualify. Its ordinary four-length empty rect cannot leave the element visible/tappable; inert clips on other positioning no longer exempt it. An off-box positive-area clip or an empty clip containing auto may remain counted.
READ: the state RECORD is a separate walk (statesheet.py:121-138), not JS_INFO's targets. It rejects failed __seen plus elements with no non-whitespace direct text node; it never calls __clippedAway. __seen (common.py:348-371) rejects: falsy offsetParent; own computed visibility!='visible'; multiplied opacity<=0.001 from element through ancestors excluding documentElement; rect width<=0 or height<=0; bottom<=0, right<=0, top>=innerHeight or left>=innerWidth; parseFloat(textIndent)<=-1000; or a recognized inset clip-path whose opposing parsed insets sum to at least the transformed rect dimension minus 0.01. All other conditions pass this helper.

| Condition / ordinary declaration | 44 px walk (READ) | State record (READ) | Can it still be visible and tappable? / source |
|---|---|---|---|
| static/relative/sticky + clip:rect(0 0 0 0) | included if normal box; under 44 fails | included if text and __seen pass | Yes; B2 repaired. common.py:174; gate.py:153 |
| absolute + empty numeric clip | skipped | retained if __seen passes | No visible area; record deliberately retains assistive text. common.py:180; statesheet.py:125 |
| fixed + clip:auto, no fixed containing ancestor | skipped by null offsetParent | skipped likewise | YES; finding 1. Same fixed/absolute treatment exists only inside the clip helper |
| fixed inside an ancestor establishing its containing block | depends on actual offsetParent, then same clip test as absolute | generic __seen tests | Yes with nonempty clip; executor must record computed parent. common.py:174,360 |
| display:none on self/ancestor | null/no box, skipped | skipped | No; ordinary hidden subtree. gate.py:153; common.py:360 |
| width:0, overflow:visible; or record height:0 | target skips width zero, not height zero | skips either zero dimension | Visible overflowing text/descendants can survive a zero host box; descendants are walked separately. common.py:366 |
| visibility:hidden inherited | no visibility test, normally counted | skipped via computed visibility | Hidden control no; descendant visibility:visible can restore itself and is recorded. common.py:362 |
| opacity:0 on parent only | no opacity test, counted if box remains | skipped, except root html opacity is not multiplied | Invisible but can still receive taps; not visible AND tappable. common.py:363-364 |
| opacity product 0.0005 | counted | skipped at <=0.001, not just zero | Nonzero paint alpha, still interactive; actual perceivability requires render. common.py:364 |
| clip-path:inset(100%) on self | not excluded by this property | skipped by __clipEmpty | No area. Non-inset shapes and ancestor clip-path are not recognized. common.py:349-359,369 |
| clip-path:inset(0px round 50px) on an 80 px box | included | parser may falsely skip: removes 'round', reads radius as second inset | YES; valid rounded shape, inherited parser limit. common.py:350-359; execute computed serialization |
| zero-size overflow:hidden parent | no ancestor overflow check | no ancestor overflow check | Ordinary contained child is hidden, yet may remain recorded; absolute descendants whose containing block is outside can escape the clip. common.py:360-371 |
| content-visibility:hidden/auto | no explicit check; only resulting offsetParent/rect can exclude | same generic filtering; no contentVisibility check | Skipped contents not painted/tappable; host border/background can remain, auto can render relevant contents. Geometry/style forcing needs execution |
| transform translates off-screen box onto screen | positive-width target retained, no viewport check | post-transform bounding rect determines inclusion | Yes if final rect is on screen. common.py:365-367 |
| transform moves on-screen box wholly off viewport | still counted unless width collapses to zero | skipped by final rect | Not currently visible/tappable in viewport; no stale pre-transform rectangle is used |
| pointer-events:none on visible control | counted | text retained | Visible, not pointer-targetable itself; keyboard focus can remain and child pointer-events:auto can restore hits. No such filter in either walk |
| inside closed details, excluding its visible summary | no details/open test; incidental null/zero box only | generic __seen only | Default collapsed contents not visible/tappable; summary is a candidate. Executor must settle the browser's reported geometry |
| aria-hidden=true, still focusable | counted | retained if text visible | YES; aria-hidden alone changes neither geometry nor pointer/focus eligibility |
| negative text-indent <=-1000 | counted | skipped even if some text remains in a sufficiently wide box | YES, control background/other contents can remain; this is a heuristic. common.py:368 |
| selector omitted / no own text / UI itself | unmatched element not measured; selector does include tabindex and roles | only descendants with direct text recorded | YES; selector and text-bearing scope are independent of visibility. common.py:155; statesheet.py:125-127 |

The CSS premises above are READ from [CSSOM offsetParent](https://drafts.csswg.org/cssom-view/#dom-htmlelement-offsetparent), [CSS clipping](https://www.w3.org/TR/CSS22/visufx.html#clipping), and [content skipping](https://drafts.csswg.org/css-contain-2/#skips-its-contents); none is a browser result. Top three B2 execution priorities: visible fixed versus absolute 20 px control; rounded inset() on a visible control; zero-size overflow-hidden parent with ordinary and escaping positioned children.

## (3) Teeth rows touched or targeting touched files

Literal occurrence counts below were counted in file bytes as UTF-8, without importing Python. Behavior/catcher/reversion columns are READ. `COPY` means the exact name `copy: no dashes, readiness words, vendor names` at gate.py:457; `TARGET` means `touch targets >= 44 px` at :452. teeth.py:458-463 requires a FAIL row with exact check-name equality AND the detail substring; unrelated regression FAILs cannot satisfy it.

| Row; mutation / expectation lines in teeth.py | Target anchor, occurrence count at head | Catcher exists under exact name? (READ) | Would retaining this row and reverting its protection make teeth red? (READ) |
|---|---|---|---|
| q9 (B1), :254-258 / :412-413 | app/app.html:36, `Upper body today. One change to review.`; EXACTLY 1 | Yes, COPY and repr(' - ') | Yes: old raw spaced-hyphen test yields no COPY detail; exit 1 for regression alone is insufficient |
| q10 (B2), :261-266 / :414-415 | app/app.html:53, `<div class="title">Eat about 2,300 kcal today.</div>`; EXACTLY 1 | Yes, TARGET plus `274x20.00`; side formatting at gate.py:152 | Yes: restoring clip-only skip removes TARGET's required detail. Width 274 is browser-dependent and must be measured |
| q11, :269-272 / :416-417 | same status anchor as q9; EXACTLY 1 | Yes, COPY plus repr(U+2212) | Yes: prior following-digit exception admits `3<U+2212>5`; no required copy detail |
| q3 revised, :247-251 / :410-411 | same status anchor; EXACTLY 1 | Yes, COPY separately requiring repr(U+2015) AND repr(U+2043) | Yes for reverting EXTRA_DASHES: old U+2015 failure alone cannot satisfy both. U+2053 has no independent tooth |
| p1, :214-217 / :397-399 | quality/common.py:311, exact HINTING_OFF assignment; EXACTLY 1 | Yes: state record emits `element ... left`, `rect edge moved (px)` (statesheet.py:267-273,601-607); exact T-84/element-10 identity still needs Linux output | R4 reversion does not affect it. Removing hint-off protection makes anchor absent/VOID, not a demonstrated runtime bite. On Windows it is not executed at all (:499-505) |
| p3, :224-225 / :402-403 | same common.py:311 anchor via mut_p1; EXACTLY 1 | Yes, `visual regression vs baseline`, `of pixels changed` at gate.py:628-629 | Same reversion/VOID and Windows non-execution qualifications as p1 |
| q8 compatibility control, :275-279 / :420-421 | same status anchor; EXACTLY 1 | Yes, COPY plus repr(U+2212) | Reverting new preceding-digit restriction leaves q8 satisfied; it protects sentence-dash use, not q11's numeric-range repair |

p1 and p3 are the ONLY existing mutation rows whose literal target file this delta changed. None mutates statesheet.py, teeth.py, STANDARD.md, README.md or PKG. q5's app/states-today.js anchor at teeth.py:293 also occurs exactly once, but its catcher does not exercise the newly changed Refused branch (finding 5). R4's reference to an existing "q7" is inaccurate: there is no q7 in ROWS. Existing prototype/full-sheet success must preserve the assistive label; no missing row is silently credited. Reverting a commit must retain the new row definitions for this negative control, otherwise the proof disappears with the test.

## (4) Changed documents and counts

| Sentence / number | Static reconciliation (READ) |
|---|---|
| README.md:273-279; STANDARD.md:130 target wording | Absolute/fixed AND empty legacy clip matches the repaired helper. "Any other small box" is too broad because the preceding null-parent/zero-width exclusions survive. Record/copy retention is true for the pack's absolute assistive label, not every fixed/clipped element |
| README.md:352-369; STANDARD.md:131 dash wording | Pd except ASCII hyphen, Po U+2043/U+2053, Zs folding, and own-line U+2212 match code. README correctly explains nearest prior non-space; STANDARD's shorter "no digit before" should say that. U+2060 is folded despite being Cf and is separately forbidden; prose should say so |
| 33 checks / 372 result rows, README.md:39; STANDARD.md:122 | Unchanged and consistent with normal full-run control flow: 15 common checks x18 + 2 workout checks x6 + 6 fit + 2 thumb + 8 reference checks x6 + 1 font pin + 3 error rows + 6 extra animation + 12 mist + 12 motion = 372; 33 distinct normal check names. Exceptions/refusals need not produce that count |
| 418 renders, README.md:40,369 | INDEX has 209 states x2 themes; unchanged. The quoted old 2-problem W-18 measurement is historical evidence, not a current claimed failure |
| Teeth count and changed PKG:245,264,337 | Code has 46 unique row IDs; PKG says 46 correctly. README:321 / STANDARD:112 still say 42. Windows p1/p3 and an unavailable p4 can count as expected without execution (teeth.py:499-513) |
| statesheet.py:420-423 refusal change | Refused escapes the per-render generic catch to the existing one-line refusal/exit-2 path. Normal exceptions still add render problem rows. No new check or render is introduced |

## (5) Package hashes, missing names and delta scope

Hash results below are file-byte calculations, not gate executions. All 26 current `files` pins (PKG:105-209) and all 6 brief/audit/review pins (:6-44) exist and match: 32/32, zero current mismatches. Every one of the 1,257 state-tree files was hashed; 1,437,414 bytes; shared/linux/win32 each 419 files (654203/390586/392625 bytes). Manifest = `74995f1581cc03dc21796a71c2cc8fcce17c45c844dacdea4808b7221c10c10b`, matching PKG:223. All 42 app files were also hashed; app manifest `b391366fd413130672bd524c7af40046185029ca52f6c13516868393dde54550` matches INDEX.env.app.

| Historical pin differing from current bytes (PKG:528-544) | Recorded at f543489 | Current SHA-256 |
|---|---|---|
| README.md (:529) | deb51a00f49426333e671a1784341b610a0ec21ae17af6000195772107cefbee | 5d5b7a9a971aef5be3830f251f38ce679f0a5ea2258fb0e69af74fbc6972b21a |
| quality/STANDARD.md (:531) | a573d5d70231140e584e9cf0c69ff764b115d23fc779028cb3bf34176349b878 | 3f3f4489c61bfe2c774fa081ae801c5cec5e1a25fe6c44371b9c857d83c351b7 |
| quality/baseline/states/INDEX.json (:539) | fbfa03366de62a1ef936f6a900dd79f4134299c7caae4f2639160e908eaccf43 | 1a68c1c3a22efd7980ad8f3cbad322765176f6c2e73012679612244f3923b837 |
| quality/common.py (:541) | 8ee065776c4fd912ea41455312e5c9497d8a8e0e15efaaef44da53d42a956326 | ce6c6a04f8e8f89975a56ecc9b6bb564ee91f7fd24534bf879b712eeb34dcbf5 |
| quality/gate.py (:542) | f86e7d911a401141e5c22e98aaf7cc67bbc734625c3655603ac567698569d248 | 62baa10f0707c48ed6a1eb70ec89dad8dff261fa376935357323da583616211e |
| quality/statesheet.py (:543) | bf794ff9ecd7269dc1029960f3664d12c3fe37a2b7596a1b9a4665dc5c552332 | 5ecacb66b6bcfc15a278d285d2656e3ab1fbf18b3590fad39e26954953d23868 |
| quality/teeth.py (:544) | 75f308fa8fa0e3ac9a7cc796a8ef323701f7c5d3c008095ea0ccadd19e49eaaf | c3af5f4bfe8c1baa1a7326dc67c155f5685aff7d566458368bbace8b43c5d97e |

All 16 historical pins match bytes read with `git show f543489:<named path>`; the seven differences above are expressly historical under PKG:525,528, not broken current pins. Current repeated ENV paths and INDEX agree with the current map/manifest. Concrete app filenames mentioned only in prose also exist and were hashed: app/app.html, app/compare.html, app/states-today.js, app/states-workout.js, app/states.js; no expected per-file hash is supplied for those five.

| Missing or unnamed item | Result |
|---|---|
| Named committed inputs/baselines/reviews | None missing |
| quality/run/phonesheet-T-14.png; quality/run/phonesheet-all.png | Absent here; named historical generated outputs (PKG:251,482), not pinned committed deliverables |
| quality/run/report.json | Absent here; PKG:329 names a generated run output, not a committed input |
| Changed file not named in the package's file record | PKG itself only; ordinary self-record omission, not an unpinned product change |
| PKG:49 head | 894bb4068f30f66699b635c1d942e322bd9e4ae4 is exactly 64a9e095's parent as PKG:50 explains |
| `git diff --name-status 18c3b63e 64a9e095` | Exactly six M entries: P/README.md; P/quality/STANDARD.md; P/quality/common.py; P/quality/statesheet.py; P/quality/teeth.py; PKG. No other path moved |
| Per-commit scope | 894bb406 changes those five pack files, including README; 64a9e095 changes PKG only. Nothing outside quality/, README.md and lane paper; no app/baseline byte changed |

## Rows I need executed

- Preserve EVERY already commissioned Audit 2 row and the PM's parallel checks; this list adds delta obligations and removes none. Publish commands, candidate hash, mutation, exit, stdout/stderr and named catcher evidence, including non-execution notes. No fifth review round is requested.
- B1/q9: all 17 Zs, plus each of the nine other characters in table 1, via helper and rendered text/attribute routes in BOTH gates; required specific COPY failure where applicable. Retain q9 and restore only the old raw test: teeth must disagree even if screenshot regression still fails.
- B2/q10: visible 20 px title AND ordinary button with inert clip under static/relative/sticky, and empty/nonempty/auto clip under absolute/fixed; BOTH gates, with computed style, offsetParent, bounding rect and actual click/focus evidence. Retain q10 and revert only the position guard: it must disagree for the named target reason.
- The three highest-priority B2 adversaries are the fixed/absolute pair, rounded inset(), and zero-size overflow-hidden parent/escaping child pair. Also execute every remaining table-2 case: inherited visibility/opacity, content-visibility, transforms in both directions, pointer-events, closed details and aria-hidden. State-record membership and target failure are separate assertions.
- Copy compatibility: W-18 both themes and the ordinary own-line decrement label; isolated negative numbers; two separately intended signed values; numeric/date ranges; q3 with U+2043 removed from protection, separate U+2053; q8/q11; fullwidth x/optional. Keep line boundaries visible in raw evidence.
- New refusal branch: inject Refused and ordinary exception inside render_one in separate executor scratch copies. Require one-line exit 2 versus a state problem/report and exit 1, with ordinary remaining states continuing for the latter.
- Current full gate (normal 33 names/372 rows), full sheet (418 renders), and all 46 teeth rows; p1/p3 need Linux execution to prove their bite, while Windows must explicitly disclose non-execution. Reconcile every disagreement before whole-audit signature; package summaries are not substitutes for raw outputs.

## What I did not verify

- No gate run, mutation run, browser render, click, screenshot, Python Unicode database, timing budget, CI result or platform comparison was independently executed here. READ predictions above remain executor obligations.
- No new runtime evidence is inferred from matching hashes. PKG's Linux and earlier Windows run summaries are author-provided historical claims; PKG:597-620 explicitly concerns bbfd60c, not the fixed head.
- The other worktree's pre-audit was neither awaited nor read; its full tables and unrelated whole-pack issues are not repeated. No tracked file was edited, no commit/push/fetch was attempted, and no protected data/auth path was accessed.
