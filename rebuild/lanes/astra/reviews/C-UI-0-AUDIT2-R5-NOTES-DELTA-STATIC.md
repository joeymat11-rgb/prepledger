# C-UI-0 AUDIT2 R5 notes: static delta check
Judge: Astra (Codex), commissioned by PM4 under DECISIONS:412, :569 and :593; static delta check, nothing executed; high effort
Head read: 814f0a030bcc0af9447672891bf3382f1240fa0b
Verdict on the delta: NOT SOUND.

P = rebuild/m1/approved-2026-09-18/; PKG = rebuild/lanes/c/ui-port/packages/C-UI-0.json. Pack paths below are relative to P. READ means static inference, not runtime evidence. Only 64a9e095..HEAD is judged; the earlier audit remains pinned at 64a9e095.

## Findings, most severe first

1. **Medium, new false refusals (READ):** common.py:85-87 admits only start, SPACE, '(' or '[' immediately before U+2212. Honest signed values after colon, slash, multiplication, currency, equals or quotation marks now fail (table 2). Folding a browser-supplied table-cell TAB also turns separate numeric cells into the already overbroad range predicate. Neither is proof of forbidden dash prose. Preserve token/cell boundaries and distinguish numeric punctuation from word-dash use; do not declare every excluded prefix dishonest. This is a gate regression, not an app-byte change.
2. **Medium, both R5 clauses lack an independent tooth (READ):** q9 still passes with only TAB folding reverted; q11 still passes with only the opener clause reverted. PM readings (a) and (b) are CONFIRMED, with exact lines and minimal repairs in table 3. PKG:40 repeats the false q9 claim. A 46-row success cannot prove either clause.
3. **Low, paper still overclaims (READ):** old note 4 is only partly addressed. Counts, omitted q9-q11, U+2060 removal semantics, and 'any other small box' remain wrong or incomplete (table 4). The expanded fold is accurately implemented as a character rule, but treating all its inputs as displayed spaces is not a semantic guarantee.

## (1) Scope (READ)

| Status | Exact moved path |
|---|---|
| M | rebuild/lanes/c/ui-port/packages/C-UI-0.json |
| A | rebuild/lanes/c/ui-port/reviews/C-UI-0-review-R5.md |
| M | rebuild/m1/approved-2026-09-18/README.md |
| M | rebuild/m1/approved-2026-09-18/quality/STANDARD.md |
| M | rebuild/m1/approved-2026-09-18/quality/common.py |
| M | rebuild/m1/approved-2026-09-18/quality/teeth.py |

READ: Six paths; no app, baseline or state-record byte among them. 50fea4a adds the review, 4bfa160 changes the four pack files, 814f0a0 changes PKG. No tolerance or target-walk change in this delta.

## (2) Rules and table 1: exact fold (READ)

READ from known Unicode/Python classification, not an executed Python database: str.isspace() has 29 members: U+0009..U+000D, U+001C..U+0020, U+0085, U+00A0, U+1680, U+2000..U+200A, U+2028, U+2029, U+202F, U+205F, U+3000. common.py:22-24,44-61 excludes U+000A/U+000D and adds U+2060: exactly 28 members map to SPACE, including SPACE itself. Ten newly folded members; no old member stops folding. Table includes EVERY character of my earlier table 1 and the six additional control characters needed for completeness. S = U+0020; KEEP = original character.

| Character | 64a9e095 fold -> HEAD fold; effect on other sweeps |
|---|---|
| U+0020 SPACE | S -> S; unchanged |
| U+00A0 NO-BREAK SPACE | S -> S; unchanged |
| U+1680 OGHAM SPACE MARK | S -> S; unchanged |
| U+2000 EN QUAD | S -> S; unchanged |
| U+2001 EM QUAD | S -> S; unchanged |
| U+2002 EN SPACE | S -> S; unchanged |
| U+2003 EM SPACE | S -> S; unchanged |
| U+2004 THREE-PER-EM SPACE | S -> S; unchanged |
| U+2005 FOUR-PER-EM SPACE | S -> S; unchanged |
| U+2006 SIX-PER-EM SPACE | S -> S; unchanged |
| U+2007 FIGURE SPACE | S -> S; unchanged |
| U+2008 PUNCTUATION SPACE | S -> S; unchanged |
| U+2009 THIN SPACE | S -> S; unchanged |
| U+200A HAIR SPACE | S -> S; unchanged |
| U+202F NARROW NO-BREAK SPACE | S -> S; unchanged |
| U+205F MEDIUM MATHEMATICAL SPACE | S -> S; unchanged |
| U+3000 IDEOGRAPHIC SPACE | S -> S; unchanged |
| U+0009 CHARACTER TABULATION | KEEP -> S; newly folded, also in sweep_form |
| U+000A LINE FEED | KEEP -> KEEP; still splits minus-rule lines |
| U+000D CARRIAGE RETURN | KEEP -> KEEP; never itself splits minus-rule lines |
| U+0085 NEXT LINE | KEEP -> S; newly folded, also in sweep_form |
| U+2028 LINE SEPARATOR | KEEP -> S; newly folded, also in sweep_form |
| U+2029 PARAGRAPH SEPARATOR | KEEP -> S; newly folded, also in sweep_form |
| U+200B ZERO WIDTH SPACE | KEEP -> KEEP; sweep_form removes; raw Cf still FLAGGED |
| U+2060 WORD JOINER | S -> S; survives sweep_form as S; raw Cf still FLAGGED |
| U+FEFF ZERO WIDTH NO-BREAK SPACE | KEEP -> KEEP; sweep_form removes; raw Cf still FLAGGED |
| U+000B LINE TABULATION (VT) | KEEP -> S; newly folded, also in sweep_form |
| U+000C FORM FEED (FF) | KEEP -> S; newly folded, also in sweep_form |
| U+001C FILE SEPARATOR | KEEP -> S; newly folded, also in sweep_form |
| U+001D GROUP SEPARATOR | KEEP -> S; newly folded, also in sweep_form |
| U+001E RECORD SEPARATOR | KEEP -> S; newly folded, also in sweep_form |
| U+001F UNIT SEPARATOR | KEEP -> S; newly folded, also in sweep_form |

READ: common.py:394,407,410 uses innerText, raw getAttribute values, and LF between parts. LF from layout and joins survives; ordinary HTML TAB collapses before this helper. TAB can survive in preformatted text, raw attributes and innerText's table-cell separators. Raw FF/VT/NEL can also arrive in attributes. Thus raw `A<TAB>-<NBSP>B` newly produces the spaced-hyphen failure, but normal rendered text may already have failed before R5. `5<TAB><U+2212>2` from distinct cells newly becomes a range refusal. VT/FF/NEL/LS/PS are no longer distinguishable from spaces; this is not loss of the actual LF part boundaries. No Cf/dash raw detector is removed (common.py:117-124).

### Table 2: OLD versus NEW (READ)

M denotes the actual U+2212 character, X denotes U+00D7; <TAB>, <LF>, <CR> denote raw characters. Each verdict is for copy_problems' minus arm after that revision's fold; PASS means no minus problem, not a full gate result. common.py:79-89 splits ONLY LF, exempts strip()==M, and otherwise requires a following isdigit() character plus a nearest preceding non-SPACE that is not a digit; NEW additionally requires the immediate opener.

| Swept string | OLD | NEW | Reading |
|---|---|---|---|
| `M5 lb` | PASS | PASS | isolated negative |
| `Change:M5 lb` | PASS | FLAGGED | honest colon-prefixed value newly refused |
| `1/M2` | PASS | FLAGGED | negative denominator newly refused |
| `2XM3` | PASS | FLAGGED | negative factor newly refused |
| `$M5` | PASS | FLAGGED | negative currency value newly refused |
| `delta=M5` | PASS | FLAGGED | negative assigned value newly refused |
| `"M5"` | PASS | FLAGGED | quoted negative value newly refused |
| `{M5}` | PASS | FLAGGED | braces excluded despite 'opening bracket' prose |
| `(M5)` and `[M5]` | PASS | PASS | the two admitted brackets |
| `Upper bodyM5 today` | PASS | FLAGGED | intended opener tightening |
| `5<TAB>M2` | PASS | FLAGGED | honest separate numeric table cells conflated |
| `Change<TAB>M2` | PASS | PASS | folded TAB opens value; preceding letter is not digit |
| `Heading<LF><TAB>M5 lb` | PASS | PASS | line start after folding |
| `5<LF>M2` | PASS | PASS | actual LF preserves separate lines |
| `Heading<CR>M5` | PASS | FLAGGED | retained CR is neither opener nor split delimiter |
| `3 M5` | FLAGGED | FLAGGED | spaced range still refused |
| `M5 M2` | FLAGGED | FLAGGED | two honest signed values already refused in R4 |
| `M5, M2` | PASS | PASS | comma separates signed values |
| `<TAB>M<TAB>` | PASS | PASS | whole-line control exemption survives |

## (3) Table 3: changed teeth (READ)

| PM claim | Evidence and smallest independent repair |
|---|---|
| (a) q9: CONFIRMED | teeth.py:255-259 claims BOTH folds and inserts TAB-hyphen-NBSP into app/app.html:36; default normal white-space (app.css:200) collapses TAB to SPACE before common.py:394 reads innerText. Reverting just TAB folding still leaves SPACE-hyphen-NBSP, whose NBSP folds under R4. :414-415 wants only COPY + repr(' - '). Smallest preservation repair: wrap the mutated sentence in a span with white-space:pre so the TAB survives. For TAB alone, also replace the NBSP with ASCII SPACE; keep a separate NBSP row. An attribute carrying raw TAB-hyphen-SPACE is another independent route. |
| (b) q11: CONFIRMED | teeth.py:270-274 adds letter-M-digit but retains 3M5; :418-419 has ONE repr(U+2212) needle. With only opener reverted, the letter form passes but range still triggers common.py:87-89. Smallest repair: remove 'Do 3M5 sets.' from this mutation, leaving 'Upper bodyM5 today.'; keep the original range in a separate row. |

READ: Both mutations' original status anchor occurs exactly once. teeth.py:460-465 tests exact check-name plus substring, not number/location of offending signs. No other ROWS entry independently holds either new clause; q8 still lacks a following digit, and cannot hold the opener. Literal ROWS count = 46 unique IDs (including d-1/d-2). Proposed row repairs above were not made or executed.

## (4) Table 4: changed paper and earlier note 4 (READ)

| Sentence or prior note | Disposition against HEAD |
|---|---|
| README:354-360 expanded whitespace/newlines | Character algorithm matches common.py:59-61, but name the exceptions explicitly LF/CR; 'newlines' is ambiguous when NEL/LS/PS are folded. LF safety rationale holds; CR is preserved but is not a minus-rule line delimiter. |
| README:365-372 negative-number wording | Mechanically matches except 'opening bracket' should explicitly name '(' and '['. Numeric semantics are too narrow (table 2); nearest non-space test is correctly stated. 'Digit on each side' does not establish a range for distinct table cells. |
| STANDARD:131 changed whitespace/minus sentence | Expanded fold matches, with same LF/CR ambiguity. 'No digit before that' still fails to specify the nearest non-SPACE character: `3 (M5)` passes because '(' is nearest, regardless of an earlier digit. State the predicate exactly and address honest numeric contexts. |
| Earlier note 4: 42 versus 46 | NOT corrected: README:41 says 42; :321 says 'Forty two'; STANDARD:112 says 42. PKG's teeth table correctly says 46; PKG:149's '33 rows after R3' is explicitly historical. |
| Earlier note 4: README list q9-q11 | NOT corrected: README:328-333 still lists q1-q6 and omits q9-q11 (and q8). |
| Earlier note 4: U+2060 | PARTLY corrected: README removed the claim that all these characters are drawn spaces and explicitly names U+2060 separately. Still says Cf characters are removed (:360-361); U+2060 was already replaced with SPACE before Cf removal (common.py:103). STANDARD:131 likewise needs that exception. common.py:53-54 still misleadingly likens WORD JOINER to a space; it is zero-width. |
| Earlier note 4: 'any other small box' | NOT corrected: README:273-279 / STANDARD:130 unchanged; null-offsetParent/zero-width exclusions still precede the clip helper. Inherited issue, not a new target-walk regression. |

## (5) Package pins and ancestry

READ/hash: certutil recalculated all 26 current files pins and all 7 review/brief/audit pins: **33/33 matched**, zero missing/mismatched. The 16 pins under r3.filesTouchedAtF543489 are explicitly historical, outside the current-pin denominator. Both aggregate manifests were independently rebuilt by file-byte SHA-256, ordinal-sorted relative forward-slash paths plus hashes, LF joins without a trailing LF, then SHA-256; no pack code imported.

| Manifest | Hashed members / bytes | Matched/total and current SHA-256 |
|---|---|---|
| PKG.stateRecords | 1,257 / 1,437,414 | 1/1; 74995f1581cc03dc21796a71c2cc8fcce17c45c844dacdea4808b7221c10c10b |
| INDEX.env.app | 42 / 6,367,301 | 1/1; b391366fd413130672bd524c7af40046185029ca52f6c13516868393dde54550 |

READ: Aggregate pins **2/2 matched**; current file plus aggregate pins **35/35**. 4bfa16062ead9cd2a8bba860b5f6701ad00cbb24 has parent 50fea4ab9fcd4ecff5aea3fad36bf8a903141c09, whose parent is 64a9e0954232ad10f66029c3031b8048c1f82802. PKG:56 correctly names 4bfa160 as its content head; :60-61 lists that fix and its review parent; HEAD 814f0a0 is 4bfa160's direct child as :57 explains. R5 entry :35-40 pins the correct review, but that review's :3-4 explicitly audits 18c3b63..64a9e09: it is not independent acceptance of the subsequent 4bfa160 changes. No literal parent field exists in that entry. Changed file without a current re-pin: PKG itself only (normal self-digest omission); the new review and all four changed pack files have current pins.

## Rows I need executed

- Retain all already commissioned 64a9e095 audit obligations. These are additional delta rows, not a replacement audit or a request to execute here. Record candidate SHA, raw swept code points, mutation, exit and named catcher.
- q9: show current normal-text row still 'as expected' after reverting TAB folding alone. Then use isolated raw TAB-hyphen-SPACE under pre or an attribute, with current/reverted helper: COPY must fail only with the protection. Keep separate NBSP and each newly folded character from table 1; exercise both gates and LF/CR control labels.
- q11: show current combined row still 'as expected' with opener alone reverted. Execute isolated letter-M-digit row current/reverted, with separate original range control; require the named COPY U+2212 failure, not screenshot regression.
- Execute table 2 with actual punctuation/code points through helper and rendered/attribute routes, including two numeric table cells, raw FF/VT/NEL, line boundaries, and W-18 both themes. Resolve the honest-value false refusals before delta acceptance; preserve forbidden-range coverage. Correct paper and re-pin changed files afterwards.

## What I did not verify

No pack script, Python, gate, browser, mutation, CI or timing was executed. Unicode membership and browser text behavior above are READ predictions, not local runtime measurements. Matching hashes prove bytes only; package run summaries are not independent evidence for this delta. No tracked file was edited; no commit/push/fetch, protected data/auth access or deletion was performed. Only this review file was written. Final worktree command outputs follow.

```text
> git status --porcelain
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
?? rebuild/lanes/astra/reviews/C-UI-0-AUDIT2-R5-NOTES-DELTA-STATIC.md
> git diff --stat -- rebuild/lanes/c/ui-port/packages/C-UI-0.json rebuild/lanes/c/ui-port/reviews/C-UI-0-review-R5.md rebuild/m1/approved-2026-09-18/README.md rebuild/m1/approved-2026-09-18/quality/STANDARD.md rebuild/m1/approved-2026-09-18/quality/common.py rebuild/m1/approved-2026-09-18/quality/teeth.py rebuild/lanes/astra/reviews/C-UI-0-AUDIT2-R5-NOTES-DELTA-STATIC.md
```
The stat command emitted no output; the sole new file is untracked. Both commands exited 0. Paths after -- enforce the commissioned explicit-path restriction.
