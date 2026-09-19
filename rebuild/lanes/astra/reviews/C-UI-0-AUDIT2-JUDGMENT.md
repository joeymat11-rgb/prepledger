# C-UI-0 Audit 2 Judgment
Judge: Astra (Codex), commissioned by PM4 under DECISIONS:412, :569 and :593; judgment of the executed half; nothing executed by the judge; highest effort
Head judged: 64a9e0954232ad10f66029c3031b8048c1f82802. Evidence head: b6eb916c59bc6dcd1bcf73f9feac047bb3a38de1.
VERDICT ON THE GATES' TEETH AT 64a9e095: NOT SOUND

B1/B2 have demonstrated repairs and both platforms have clean ordinary runs. Those do not close x20's named-check bypass, x15's coverage overclaim, or the unexercised obligations below. No acceptance of 814f0a03 follows.
Paths: P = rebuild/m1/approved-2026-09-18/; A = rebuild/lanes/c/ui-port/audit2/. C/G/H/T/F = P/quality/common.py, gate.py, statesheet.py, teeth.py, phonesheet.py; S = P/quality/STANDARD.md; R = P/README.md. Source lines are at 64a9e095 unless explicitly marked delta. READ is source evidence, not execution.

## (1) The evidence itself

I parsed all 86 results, inspected their diffs and outputs, and checked all 86 corresponding logs. The logs contain driver diffs/tables, not complete gate transcripts or revert proofs; failure lists, stdout tails and revert hashes are in results.jsonl. RUN-REPORT overstates what each log contains. Logs a/g2 replace U+2014 with disclosed <U+2014>; restoring that notation makes all 86 diffs agree. Every log-table exit agrees with JSON.
All 93 touched-file hash pairs, over 12 distinct paths, match their pinned Git blobs before mutation and after revert. All 86 execution records are non-dry, without timeout or dirty revert. Commands/environment agree with the probes except the two VOID placeholders. A nonempty comment diff alone proves no behavioral mutation.
Head custody: executions span 13:19:41-13:59:13. The dry archive has 368 entries: 367 DRY-OK and an old 01:18 row i VOID for a then-missing baseline. At 14:02:04 dry p1/p3 hash common.py as 34d7e18690f1178b31f32d1c46643797d10f8df2b2f384a2ece29126327e9eae, exactly 814f0a03. At 14:05:57 it is ce6c6a04f8e8f89975a56ecc9b6bb564ee91f7fd24534bf879b712eeb34dcbf5, exactly 64a9e095; the final 86 dry rows are DRY-OK. The wrong-copy dry run occurred AFTER all recorded executions. No executed wrong-head row is evidenced. These are touched-file hashes, not full runner hashes per row; unchanged app hashes alone cannot distinguish the heads.
The worktree's entire P matches 64a9e095. My scoped 5f4cad0a..64a9e095 diff finds 1,296 changed paths, only R and app/app.css outside quality/. The sole app change is the recorded min-width: var(--hit) at app/app.css:202. This separate read supports integrity; it cannot rehabilitate x25 as a mutation.

MATCH below means the probe's expected result is supported, not that the gate is sound; MISMATCH is usable contrary evidence; VOID means the claimed probe was not performed. Commands are under quality/: G = gate.py --screens today --sizes 393x852; GS = gate.py --screens today --sizes 375x812,360x780; GW = gate.py --screens workout --sizes 393x852; GB = gate.py --screens today --sizes 390x844; S02/S0/S99/SW20 = statesheet.py --only T-02/T-0/T-99/W-20; GA/SA = gate.py/statesheet.py --accept.
Exact check names: COPY = copy: no dashes, readiness words, vendor names; TARGET = touch targets >= 44 px; CONTRAST = contrast (measured behind the text); REG = visual regression vs baseline; PRIMARY = primary action in first viewport; ANIM = no transitions or animations outside the embers; FONT = fonts pinned by sha256; FACE = serif and sans faces loaded and distinct; FAMILY = serif for names and numbers, sans for the rest; RIR = RIR chips are the five locked values; MARGIN = page margin 22 px; SET = the multiplication sign in every set string; GENERATED = generated content the sweep cannot read; TYPE = type sizes and weights on the scale; GAP = gaps on the spacing scale; FINISHED = the gate finished this screen. Aliases mean exact FAIL-name matches unless explicitly WARN. The sheet prints state problems, not gate-style FAIL-name rows.

| Row | Command; exit | Applied probe and actual catcher/details | Judgment |
|---|---|---|---|
| rb2c | G; 0 | Comment control; 0 FAIL, 0 WARN, 60 PASS | MATCH |
| rb1f | G; 1 | ASCII spaced hyphen; COPY ' - ', both themes | MATCH |
| rb1a | G; 1 | U+00A0 hyphen; COPY ' - ', both themes | MATCH |
| rb1b | G; 1 | U+202F hyphen; COPY ' - ', both themes | MATCH |
| rb1c | G; 1 | U+2007 hyphen; COPY ' - ', both themes | MATCH |
| rb1d | G; 1 | U+2009 hyphen; COPY ' - ', both themes | MATCH |
| rb1e | G; 1 | U+3000 hyphen; COPY ' - ', both themes | MATCH |
| q9 | G; 1 | Lane NBSP mutation; COPY ' - ', both themes | MATCH |
| rb2a | G; 1 | Static inert-clip title; TARGET title 274x20.00, both themes | MATCH |
| q10 | G; 1 | Same inert-clip title; TARGET title 274x20.00 | MATCH |
| rb2b | G; 1 | Absolute empty-clip title; only REG fails, no TARGET | MATCH control |
| rb2d | G; 1 | Parent opacity 0; TARGET title 274x20.00 | MATCH |
| rb2e | G; 1 | Inherited hidden visibility; TARGET title 274x20.00 | MATCH |
| q11 | G; 1 | Numeric range with U+2212; COPY U+2212 | MATCH |
| h1 | S02; 0 | Margin +3; rect 3.00/3.00, thumbnail mean 1.80/2.00 | MATCH |
| x1 | S02; 1 | Margin +4; T-02 top 172 became 176 | MATCH |
| x2 | S02; 0 | RGB +3; colour moved 3.00/3.00 | MATCH |
| x3 | S02; 1 | RGB +4; colour triples became +4, both themes | MATCH |
| x22 | GS; 0 | Card margin +0.5; 0 FAIL, 0 WARN, 63 PASS | MATCH |
| x23 | GS; 1 | Card margin +0.7; MARGIN card-eat left 22.7 | MATCH |
| k3 | G; 1 | Card margin +6; MARGIN card-eat left 28 | MATCH |
| x4 | G; 0 | 18x18 block; 0 FAIL; passing pixel metrics absent from tail | MATCH pass; numeric-print claim unproved |
| x5 | G; 1 | 19x19 block; REG 0.108%, means 0.264/0.256 below 0.5 | MATCH |
| a | G; 1 | Em dash; COPY U+2014 | MATCH |
| b1 | G; 1 | Ready title; COPY 'ready' | MATCH |
| b2 | G; 1 | Claude title; COPY 'claude' | MATCH |
| c | G; 1 | Sans source becomes serif; FONT Earned Sans; FACE same glyphs | MATCH |
| d-1 | G; 1 | Start +630; PRIMARY bottom 1321 > 852; report written | MATCH |
| d-2 | GS; 1 | Start +210 at small sizes; PRIMARY bottom beyond viewport | MATCH |
| e1 | G; 1 | #8a8378 body; CONTRAST status-line 3.2 < 4.5 in Dawn | MATCH |
| e2 | G; 1 | #4a463f body; CONTRAST status-line 2.1 < 4.5 in Ink | MATCH |
| f | G; 1 | Start animation; ANIM animation start; motion checks name px moved | MATCH |
| g | S02; 1 | Sample becomes Example; the visible text changed, T-02 | MATCH |
| g2 | S02; 1 | State em dash; copy: U+2014, T-02 | MATCH |
| h2 | S02; 1 | Margin +60; top 172 became 232; worst rect 60.00 | MATCH |
| h3 | S02; 1 | Margin +4; rect 4.00 and thumbnail mean 2.39 | MATCH |
| i | G; 1 | Deleted Ink baseline; REG no baseline at named win32 path | MATCH |
| j1 | G + empty EARNED_APP; 2 | REFUSED, no active UI at supplied URL | MATCH |
| j2 | G + compare.html EARNED_APP; 2 | REFUSED, no active UI at supplied URL | MATCH |
| k1 | GW; 1 | Deleted RIR 1; RIR actual list is not locked list | MATCH |
| k2 | GW; 1 | Screen title sans; FAMILY .screen-title is Earned Sans | MATCH |
| m1 | G; 1 | Pseudo animation; ANIM animation card-eat::after | MATCH |
| m2 | G; 1 | Pseudo transition; ANIM transition start::after | MATCH |
| m3 | G; 1 | Placeholder; COPY ready/claude AND SET '8 x 1' | MATCH |
| m4 | G; 1 | Generated string; COPY ready/claude AND SET '8 x 1' | MATCH |
| m5 | S02; 1 | Placeholder; copy: 'ready', 'claude'; set written with the letter x | MATCH |
| m6 | S0; 1 | Removed T-02; no state T-02 in the build; 2 records with no state | MATCH |
| m7 | S02; 1 | Sample opacity 0; visible text changed, 24 versus 25 elements | MATCH |
| n1 | G; 1 | counter() set; GENERATED status-line::after | MATCH |
| n2 | S02; 1 | Sample inset(100%); the visible text changed | MATCH |
| n3 | S02; 1 | Block indent -9999px; the visible text changed | MATCH |
| n4 | S02; 1 | Sepia index entry; theme sepia, which the sheet does not render | MATCH |
| n5 | S02; 1 | Removed dawn entry; T-02 theme dawn is in the build but not in index | MATCH |
| p1 | S02; 0 | Removed hinting flag; no moved rect on Windows | MISMATCH: PLATFORM |
| p2 | S02; 1 | Deleted Ink thumb; no thumbnail at T-02-ink.png; --accept-thumbs remedy | MATCH |
| p3 | G; 0 | Removed hinting flag; REG passes on Windows | MISMATCH: PLATFORM |
| p4 | S02; 1 | Linux thumbs copied to win32; is byte identical to, never copied | MATCH |
| q1 | GB; 2 | Invalid size; REFUSED --sizes 390x844, allowed sizes named | MATCH |
| q2 | G; 1 | Soft-hyphen Ready; COPY U+00AD AND ready | MATCH |
| q3 | G; 1 | Two dashes; COPY U+2015 AND U+2043 | MATCH |
| q4 | S02; 1 | Title sub class/token; colour changed, size 14.5 became 13 | MATCH; not contrast-catcher proof |
| q5 | S0; 1 | T-02 apply throws; state did not apply; error: teeth q5; others clean | MATCH |
| q6 | SA + compare.html EARNED_APP; 2 | REFUSED EARNED_APP, records must use prototype | MATCH |
| q8 | G; 1 | Sentence minus; COPY U+2212 | MATCH |
| x6 | G; 1 | Inline-split Ready; COPY ready | MATCH |
| x7 | G; 1 | Uppercase READY; COPY ready | MATCH |
| x8 | G; 1 | Soft-hyphen Ready; COPY U+00AD AND ready | MATCH |
| x9 | G; 1 | Zero-width-space Ready; COPY U+200B AND ready | MATCH |
| x10 | G; 1 | Horizontal bar; COPY U+2015 | MATCH |
| x11 | G; 1 | Font byte appended; FONT Earned Sans digest differs | MATCH |
| x12 | S02; 0 | Copy AND two records edited; 0 problems, thumb 0.08/2.00, digest advisory | MISMATCH: KNOWN LIMIT |
| x13 | S99; 1 | New state; no record at both paths AND not in index | MATCH |
| x14 | GS; 0 | 17px type; TYPE WARN new sizes [17] | MATCH |
| x15 | G; 1 | Card margin +7; GAP never warns; fit and REG fail | MISMATCH: GATE DEFECT in claimed scope |
| x16 | G; 1 | Bounding-box throw; FINISHED audit2 crash probe; report written | MATCH |
| x17 | S0; 1 | T-03 bounding-box throw; the render failed; 14 other renders clean | MISMATCH: ROW DEFECT |
| x20 | G; 1 | status-line gets from + #8a8378; only REG fails, CONTRAST passes | MISMATCH: GATE DEFECT |
| x21 | GB; 2 | Invalid size; REFUSED rather than zero-check green | MISMATCH: ROW DEFECT |
| x24 | G; 0 | Only marker comment; no role-button mutation | VOID |
| f3a | SW20; 1 | Record capital E only; W-20 Ink visible text changed; Dawn clean | MATCH |
| f3b1 | GA --screens today; 2 | REFUSED cannot be combined with --screens or --sizes | MATCH |
| f3b2 | SA --only T-02; 2 | REFUSED cannot be combined with --only | MATCH |
| x25 | GB; 2 | Only marker comment and unrelated invalid-size command | VOID |
| x24h | GW; 1 | Real div role=button; TARGET plans-workout 108x20.00, both themes | MATCH |
| x18 | GA; 0 | ACCEPT RUN: regression compared nothing; six SET, 366 PASS | MATCH; not green evidence |
| x19 | GA + states.html EARNED_APP; 2 | REFUSED EARNED_APP rather than accept | MISMATCH: ROW DEFECT |

There are 84 usable probes and 2 VOID placeholders; 76 usable probes match the recorded exit/catcher requirements and 8 disagree; x4 does not substantiate its extra prose claim that passing pixel metrics were printed. x20's JSON "as expected" is wrong: the old driver accepted a check listed under Passed everywhere. The published replacement still permits substring/tail matching instead of exact structured FAIL identity. I used the actual failures, not either automatic verdict.
Clean Windows logs show 372 PASS and 418 renders/0 problems. The lane's teeth log shows 46 rows/0 disagreeing with p1/p3 explicitly NOT executed (44 attempted mutation rows). It supplies no per-row raw catches or pack hash for its separate pack3; it corroborates but cannot replace the 86 records. Independent Windows p1/p3 actually ran.

## (2) Every mismatch and the hidden-target siblings

| Rows | Classification and reason |
|---|---|
| p1, p3 | PLATFORM, predicted by C:306-311/T:499-505. Linux proves the flag-removal bite: p1 T-02 left 227.83 became 224, 3.83 > 3.00; p3 exact REG 5.469% Dawn/5.532% Ink; both exit 1 and common.py restores its pinned hash. This does not execute the lane's permanent T-84 p1 assertion. |
| x12 | KNOWN LIMIT, not a required exit-1 case. R:314-317 explicitly assigns baseline authenticity to review; S:191-200 makes provenance/app digest advisory. H:252-258 trusts supplied records. Editing reference and product together defeats that trust boundary; 0.08 thumbnail movement correctly passes 2.00. Require approved record diffs/pins, not a blanket app-digest FAIL that would also kill valid tolerance controls. |
| x15 | GATE DEFECT in advertised coverage, not an observed green build. S:10/150 promises off-scale block gaps are flagged; G:249-255 samples only immediate body/stack siblings, missing the nested timeline card. This adds 7px margin to an 8px gap, not a measured 7px gap. Fit/REG cannot substitute for GAP. Add to P-CUI-2: describe sampled scope now, retain the design rule under review, widen later. |
| x17 | ROW DEFECT: exit-2/refusal fields contradict its own desired FAIL wording. T-03 is isolated with exit 1/report and T-02/T-04..09 clean. This is correct ordinary-exception handling, not the separate Refused branch. |
| x20 | GATE DEFECT. S:31/145 requires primary 4.5; from does not put this status line inside the actual .coach-answer .from muted recipe (app/app.css:329). C:200 nevertheless grants 3.0 from the bare class. S:31's class shorthand is not permission to relabel primary copy without changing its role/paint. e1 supplies 3.2 < 4.5; q4 catches record colour/size, not this contrast loophole. |
| x21 | ROW DEFECT. Invalid size correctly refuses; q1 has the correct expectation. |
| x24 | ROW DEFECT and VOID: only a comment changed. x24h refutes the old role-button omission with exact TARGET catches. |
| x25 | ROW DEFECT and VOID: GB is no integrity check. The separate Git read in (1) proves the allowed app delta. |
| x19 | ROW DEFECT. External-build accept correctly refuses before writes; q6 covers the sheet counterpart. |
| rb2d, rb2e | KNOWN LIMIT / honest fail-closed side of S:130's narrow exemption. Both 20px boxes are measured AGAINST 44px, not AS 44px. Opacity-zero boxes may retain interaction; inherited visibility-hidden boxes are conservatively counted. These are false reds, not missed visible targets. Do not blindly reuse text visibility to exempt invisible hit areas; document the conservative target policy. |

## (3) My three static files against execution

Sources: the named review files on origin/rebuild/r-astra-cui0-static, r-astra-cui0-recheck and r-astra-cui0-delta. An ordinary control does not refute a different bypass.

| Finding | Disposition and missing witness |
|---|---|
| Pre 1: fixed/rounded-inset/inline-indent exclusions | STILL READ. m7/n2/n3 hide block text, not visible fixed text, inset(0 round 50%) or inert inline indent. Need each plus fixed attribute/pseudo copy, both gates. |
| Pre 2: inert legacy clip exempts visible target | REFUTED BY ROW rb2a/q10 at this head; rb2b is the positioned-empty control. Relative/sticky and fixed/absolute variants broaden coverage, not reopen the demonstrated repair. |
| Pre 3: folded-copy siblings | REFUTED BY ROW rb1a-rb1f/q9 for spaced Zs hyphens and q11 for numeric ranges. STILL READ for fullwidth x/optional and standalone-minus/letter-minus-digit semantics. Need isolated normalized-word/set and honest-number controls. |
| Pre 4: pressed/radius/margin/font sampling | STILL READ. k3 proves one sampled card, not full coverage. Need unsampled pressed, another corner, pill, nested margin and sans-400 rows if widening; truthful scope can be documented now. |
| Pre 5: primary and RIR visibility | STILL READ. d-1/d-2 test bottom overflow; k1 deletion. Need above/sideways/hidden/absent primaries, fractional bottom overflow, hidden/clipped/offscreen retained chips. |
| Pre 6: every-edge and precision | STILL READ. h1/x1/h3 exercise top only. Need position+size each +3 moving right/bottom +6, representable just-over-3 rect and just-over-0.5 font-size cases. |
| Pre 7: text-source/alpha exclusions | STILL READ. e1/e2 are opaque body; m3-m5 test copy, not contrast. Need alpha/opacity, one glyph, small overflowing box, fade-edge, input/value/placeholder/pseudo contrast rows for C-UI-GATES-2. |
| Pre 8: accept exit and failed-accept writes | CONFIRMED BY ROW x18 for exit 0/SET; STILL READ for writes following failures. Need failing full accepts of both gates with baseline/index before/after hashes; transactional repair may remain deferred with custody controls. |
| Pre 9: paper drift | STILL READ against R/S/T; phaseA's 46-row summary/Linux 0.04 reinforce it; q5/m6 show actual T-0 selection. Need document/count reconciliation, not an invented mutation. |
| Re-check 1: fixed target omitted before helper | STILL READ; rb2a is static, rb2b absolute. Need visible 20px absolute/fixed pair in both gates. |
| Re-check 2: two signed values called a range | STILL READ. q11 is an intended range, not separate values. Need separate numeric elements/cells, own-line minus, W-18 controls. |
| Re-check 3: raw set-x/optional | STILL READ; m3-m5 use ASCII x. Need U+FF58 set and U+FF49 inside optional, exact named problems. |
| Re-check 4: counts/U+2060/target prose | STILL READ; same paper item as pre-9, plus target exclusions. Reconcile 46 enumerated/44 run on Windows. |
| Re-check 5: Refused versus ordinary exception | STILL READ for Refused; CONFIRMED BY ROW x17 for ordinary render-exception isolation only. Need injected Refused versus ordinary Exception inside render_one, asserting distinct exit/report/continuation contracts. |
| Delta 1: opener/TAB false refusals | STILL READ, OUTSIDE this execution: 814f0a03, not 64a9e095. Need punctuation-prefixed honest negatives and separate numeric table cells under successor code. |
| Delta 2: combined q9/q11 fail to hold new clauses | STILL READ, OUTSIDE execution. Old q9/q11 cannot validate changed rows. Need isolated raw TAB-hyphen-SPACE and letter-U+2212-digit, retaining each row while reverting only its protection. |
| Delta 3: paper overclaims | STILL READ, OUTSIDE execution. Need successor prose/pin reconciliation; no runtime row proves prose. |

Other pre-audit qualifications: q5's weak tooth remains READ at T:422-423 despite q5's real apply failure. The four-worst-rows-on-every-run promise is contradicted by p1/m6 collapsing zeros and x13 omitting the block. The old catch-all Refused concern is repaired in source at H:420-423, but not witnessed. My earlier hidden-block findings must not be mistaken for proof of the visible-text bypasses.

## (4) PM rulings and eight additions

Only DECISIONS:594, :597 and :604 on origin/rebuild/t2-client-core were read for these rulings. Agreement does not turn READ into execution.

| Ruling | Evidence and judgment of class |
|---|---|
| P-CUI-1 | Agree: fix plus biting row for visible walks, normalized words, primary/RIR visibility, actual edges and q5 specificity. Mostly STILL READ, not closed by these executions; repaired B1/B2 are different witnesses. Add x20. |
| P-CUI-2 | Agree to disclose sampled automatic scope now and defer expansion to C-UI-GATES-2, retaining underlying design requirements as reviewer duties. Pre-4/pre-7 bypasses have no executed witnesses; x15 adds nested-gap evidence. This does not waive x20's primary tier. |
| P-CUI-3 | Agree to truthful paper and accept custody; x18 proves exit 0, x12 reference trust. Retain ordinary-twin-green evidence before acceptance and ordinary comparison afterwards; transactional failed-accept repair may wait. The Refused execution pair promised at :597 is still owed now even if its permanent tooth waits. |
| P-CUI-4 | Agree with honest numeric punctuation and TAB boundaries; successor algorithm has no execution here. DISAGREE with treating a character predicate as proof of meaning: require positive/negative semantic controls, LF/CR and W-18. 814f0a03 remains outside this verdict. |
| PM-1 | STILL READ at T:496-498/548; q1 tests gate.py, not teeth.py. Agree must fix with unknown-only, mixed-known/unknown and empty-selection rows. |
| PM-2 | CONFIRMED by phaseA/a6: 46 summarized, two skipped. Agree fix now without a new mutation; print enumerated/run/skipped/VOID/disagreeing counts. |
| PM-3 | STILL READ at G:579-581; no hover-only row. Agree must fix with row: move, capture idle, press; hover alone must not pass. |
| PM-4 | Published reports confirm missing immutable build identity; external-client provenance remains READ. Agree reporting repair now without permanent mutation; emitted evidence must name target URL/build/digest, mode, selection and runtime, including EARNED_APP. |
| PM-5 | Source confirms 14 G lines + 3 H + 2 C = 19 sites; no fixed witness. Agree must fix with rows, but DISAGREE with one undifferentiated visibility filter: text, targets and required-control existence differ; preserve conservative rb2d/e and explicit missing-primary failures. |
| PM-6 | STILL READ at F:69-75; clean T-40 proves no refusal behavior. DISAGREE with fix-without-row: this changes whether mislabeled evidence is emitted. Require registered apply-throw in one theme plus good-state control and refusal/no misleading sheet. |
| PM-7 | STILL READ, OUTSIDE run; old q9 tests NBSP, not the later TAB clause. Agree isolated raw TAB witness and reverted-protection control are mandatory. |
| PM-8 | STILL READ, OUTSIDE run; old q11 tests range, not later opener. Agree split clauses, independently bite, and add positive no-COPY-failure assertions. |

## (5) The Linux half

Raw full logs show gate 372 PASS/exit 0 and sheet 418 renders/0 problems/exit 0. Worst shared-record movement: 0.04 of 3.00px, W-05 Ink element 22 "Unsure" left; colour zero. Own-platform thumbs have zero movement; cross-win32 thumbs are advisory, worst mean 1.26 of 2.00 at C-63 Ink. There is 2.96px remaining in the measured component tolerance, not "0.04px headroom."
lin-p1-p3.log and its shell source show the flag diff, commands, named failures, and matching common.py before/revert hash. They prove the Linux bite at T-02 and base Today, not the permanent T-84 p1 assertion, all mutations on Linux, or correct derived right/bottom-edge comparisons.
This is one cloud machine, Chromium 141/Playwright 1.56 versus PC Chromium 151/Playwright 1.62 as recorded in the pack/report. Clean-run logs do not print those versions/full pack digests. It is not same-browser OS isolation, CI, the lane lead's machine, a physical phone, or universal Linux portability. It cannot prove older word-for-word report identity or S:174's 0.00px prose. No threshold increase is justified.

## (6) Consolidated design-lane list

Required before acceptance, deduplicated across all sources. M = fix with an independent executed row that fails for the named reason when protection is removed; D = fix/document now without a new permanent mutation; E = missing execution owed now. Successor-only items do not claim new code existed at 64a9e095.

| ID | One sentence and source at 64a9e095 | Class; present proof | Required row/receipt afterwards |
|---|---|---|---|
| 1 | Replace null-offsetParent shortcuts without losing visible fixed content or invisible hit targets (C:360,393; G:153,200-263,514; H:84,87,89). | M; STILL READ, PM-5 | Absolute/fixed 20px pair, fixed contrast/record/attribute/pseudo text in both gates; computed parent/rect; retain rb2b/d/e. |
| 2 | Parse inset before round and apply indent hiding only when it hides the text (C:349-370). | M; STILL READ | Visible rounded-inset/inline-indent probes plus truly hidden controls in both gates. |
| 3 | Normalize set-x and workout optional consistently (C:115-117; H:496). | M; STILL READ | U+FF58 set in both gates; U+FF49 optional in workout; exact SET/state-copy catches. |
| 4 | Check required primary existence, visibility and every viewport edge without rounding away overflow (G:146-148,437-443; H:87-93,504-505). | M; STILL READ | Above/sideways/hidden/absent/fractional-bottom cases; state-specific expected-primary contract; retain d-1/d-2. |
| 5 | Require every retained RIR chip to be visible (G:224-225,475-486). | M; STILL READ | Opacity/inherited hidden/clipped/offscreen chips with unchanged labels/count; exact RIR failure. |
| 6 | Compare right/bottom edges and preserve advertised measurement precision (H:130-133,267-281; S:167,202). | M; STILL READ | +3 position/+3 size yields +6 far edge; exact and representable just-over rect/font boundaries, not screenshot-only catches. |
| 7 | Prevent unrelated class names lowering primary copy to 3.0 (C:126-132,189-203; G:557; H:480). | M; x20/e1 | Same body element/color with/without from; CONTRAST <4.5; real muted/disabled/large-text controls pass. |
| 8 | Compare press against hover-settled idle (G:579-584). | M; STILL READ, PM-3 | Hover-only/no-active fails pressed; genuine active passes on sampled surfaces. |
| 9 | Refuse unknown/empty teeth selections before reporting success (T:496-498,530-548). | M; STILL READ, PM-1 | Unknown-only, mixed valid/invalid, empty-effective selections refuse; valid selection runs nonzero rows. |
| 10 | Make q5 require its state-apply error rather than any T-02 problem (T:422-423,446-448). | M; behavior q5, weak tooth STILL READ | Remove only apply-error detection, retain unrelated record failures: tooth disagrees; exact error/continuation/report asserted. |
| 11 | Supply the Refused/ordinary-exception pair promised in batch 2 (H:418-429,622-650). | E; x17 ordinary only | Injected Refused: one-line exit 2; ordinary Exception: state problem, other states continue, report/exit 1; permanent pair may wait. |
| 12 | Verify phone-sheet state application before labeling its picture (F:65-81). | M, promoted from PM's D; STILL READ | Registered apply-throw in one theme refuses without successful mislabeled sheet; valid control renders both themes. |
| 13 | Repair successor minus/TAB rules while preserving honest numeric contexts (C:41-77 is old; new opener absent here). | M, successor only; delta-1 STILL READ | Colon/slash/multiply/currency/equals/quotes/braces, numeric cells, TAB/LF/CR, own-line minus/W-18 and forbidden word/range controls; assert named-check absence. |
| 14 | Split successor q9/q11 so every new clause has its own tooth (T:254-272,412-417 are old rows). | M, successor only; delta-2/PM-7/8 STILL READ | Raw TAB under pre/attribute with ASCII space; separate NBSP; isolated letter-minus-digit; separate range; revert each protection alone with its row retained. |
| 15 | State the sampled surfaces/corners/gaps/fonts/text sources and retain visual review duties (G:72-75,101-117,176-185,249-263; H:102-110; S:9-32,144-151). | D now; expansion C-UI-GATES-2; x15 plus pre-4/7 READ | Disclose nested gaps, eight pressed selectors, top-left radii/no pill check, sans-400, small/single-glyph/fade/input/pseudo exclusions and no alpha compositing; later independent expansion rows. |
| 16 | Document trusted baselines/nontransactional accept/exit-0 limits and ordinary-twin-green custody (R:314-317; S:56,184-200; G:612,668; H:431-433,509-516,619). | D now; x12/x18; failed-write behavior READ | Approved reference diffs/pins, same-input ordinary green evidence before acceptance and comparison after; retain external/narrow-accept refusals; failed-accept hash rows with later transactional repair. |
| 17 | Print actual run/skipped counts and immutable target identity (T:499-512,531; G:636-656; H:574-618; F:81). | D now; phaseA, PM-2/4 | Published ordinary reports name mode/scope/URL/build digest/versions; 46 enumerated/44 run/2 skipped distinguished; external report identifies actual client. |
| 18 | Reconcile stale prose/pins/report language with actual code and receipts (R:41,174,216,223,321-333,355-359; S:112,130-131,174,194-203; T:329-331; H:595-607). | D now; READ, p1/m6/x13/Linux | Correct 46/42, 630/210, q8-q11 list, T-0 prefix, 0.04/0.00, U+2060, target exclusions, FINISHED name and zero/empty worst blocks; re-pin changed declared artifacts. |

Not required as new blockers: repeat-fixing demonstrated NBSP/inert-clip repairs (retain regressions); forcing Windows hinting rows red (Linux bites); making x12 an automatic integrity FAIL (review owns trusted references); exempting rb2d/e (conservative policy); transactional accept or complete pressed/radius/margin/spacing/type/contrast/hit-area coverage or every CSS hiding mechanism (C-UI-GATES-2, truthful scope now). G:154/H:85 pseudo-height is not an actual hit test and belongs in that disclosed later scope.
Do not count x24/x25, dry success, Passed everywhere, clean full runs or skipped teeth as missing negative witnesses. Publish affected rows on an immutable successor head, ordinary clean full runs for affected gates, and the reviewed delta before acceptance; this judgment does not accept an unexecuted repair.

## What I did not verify

No Python, pack module, gate, browser, mutation, accept, CI or phone test was executed by me. I inspected recorded evidence and hashes with read-only Git, PowerShell and the supplied Node executable. No independent screenshot render/visual judgment. Executor machine custody is not proof of every unseen execution-time file.
No exhaustive Unicode/attribute, fixed/rounded-inset/inline-indent, alpha, Refused injection, failed full accept, accept-thumbs, hover-only, invalid teeth selection, failed phone-state, or 814f0a03 delta execution is in these 86 rows. The permanent Linux T-84 p1 tooth also remains unexecuted here. None is silently credited.
No protected data/auth path was accessed; no tracked file edited; no commit/push/fetch, deletion or dependency operation. The only written file is this judgment. Final worktree command outputs follow.

```text
> git status --porcelain
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
?? rebuild/lanes/astra/reviews/C-UI-0-AUDIT2-JUDGMENT.md
> git diff --stat -- rebuild/lanes/astra/reviews/C-UI-0-AUDIT2-JUDGMENT.md

```
Both commands exited 0/0. The diff contains no tracked changes; this judgment is the sole untracked file.
