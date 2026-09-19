# Passphrase normalization blind review

Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412 and :569; blind; highest effort
Reviewed head: ba04c07f42ea63857b3a3c62cb77bbce051a0465 (base 9e1ece88)
Helper SHA256 (certutil): 04688413163a1a987596185a280bad654fc11aa7c101e5ab97c63df4f1df540b

VERDICT: ACCEPT WITH NOTES

No production failure found for bundles sealed with generated passphrases. The notes below qualify the tests and their claims. All phrases below were generated synthetically in this review; none came from an owner's bundle. Findings recorded before opening the three earlier reports.

## Findings, most severe first

### F1 - Medium: the wrong-order test can falsely accuse a correct decoder

Location: rebuild/lanes/c/passphrase-normalize/unlock-forms.test.mjs:59,100.
Input: actual makePassphrase() output `baby-baby-close-soap-square-assist`; C-PN-11's purported reorder is `baby baby close soap square assist`. The first two words are equal, so the order has not changed.
Observed: both decoders opened. Running the unchanged unlock cell on that actual seal gave 5 pass / 1 fail, C-PN-11: `the right words in the wrong order opened the bundle on the node decoder`.
The phrase appeared after 1653 draws in this search. Equal first draws have probability 1/2048 with this list and generator. The risk is random rejection of a healthy import change, not an incorrect unlock.
Smallest fix: make the wrong-order control swap two unequal words; explicitly handle the all-identical case, or generate a separate control with unequal first words. Preserve compatibility testing for legitimate repeated words.

### F2 - Medium: Unicode and full-error-disclosure regressions survive the new cells

Locations: helper.test.mjs:54; unlock-forms.test.mjs:158-176 (the projected refusal surface).
M01 deletes only the FIRST `.normalize('NFKD')`. All 20 normalization assertions still pass. Exact probe: join the F1 six words using U+FF0C instead of hyphens. Original: both open. Mutant: canonical `baby,baby,close,soap,square,assist`; both refuse `BUNDLE_AUTH_FAILED`.
M16 adds `.replace(/[\ud800-\udfff]/g, '')` after lowercasing. The input `b` + U+D800 + `aby-baby-close-soap-square-assist` refuses on the original and opens through BOTH mutated decoders. All 20 normalization assertions still pass.
M18 replaces the Node decrypt catch with `const e = new Error(FAILURE); e.code = FAILURE; e.typed = passphrase; throw e;`.
M19 changes the phone decrypt catch to `fail(BUNDLE_FAILURE, 3, { typed: passphrase });`.
For `zzzzzz baby-baby-close-soap-square-assist`, M18 serialized exactly `{"code":"BUNDLE_AUTH_FAILED","typed":"zzzzzz baby-baby-close-soap-square-assist"}`. M19 serialized exactly `{"name":"StorageFailure","code":"BUNDLE_AUTH_FAILED","state":3,"retryable":false,"typed":"zzzzzz baby-baby-close-soap-square-assist"}`. Both mutations leave all 20 normalization assertions passing.
These are SCRATCH MUTANTS, not leaks or regressions present at HEAD. They show the cells would miss losing an intended phone spelling, admitting an altered word, or disclosing typed words in a serialized refusal.
Smallest fix: add end-to-end compatibility-character and surrogate-in-word controls; compare full serialized errors against fixed per-decoder constants, in addition to message/code and rendered prose. Do not scan random words as substrings of prose.
The page test retains two baseline count failures throughout; no survivor is misreported here as an all-green submitted suite.

### F3 - Low: "any Unicode whitespace" overstates the implemented separator class

Locations: passphrase.cjs:21,45,49 and port/README.md:201.
Input: generated `wing-raccoon-flush-creek-youth-couch`, replacing all five hyphens with U+0085 NEXT LINE.
Observed: both decoders refuse with code/message `BUNDLE_AUTH_FAILED`; U+0085 is left inside the words. U+FEFF, conversely, is folded. This is ECMAScript `\s`, not Unicode's White_Space property.
An uncommon pasted newline still stops the owner's otherwise correct words opening. This is not a regression from the base decoder, nor a failure of the screen's ordinary-space promise.
Smallest fix: document the exact class, or deliberately admit U+0085 with a test on both entry points. No widening was applied in this review.

### F4 - Inherited limitation: "the entire refused screen is identical" is too broad

Location: route.test.mjs:117-139; import-screen.mjs:574,582.
Inputs: `baby baby close soap square zzzzzz` (from the F1 generated seal), versus `qqqqqq xxxxxx wwwwww vvvvvv uuuuuu tttttt`.
Observed at BOTH base and head: textContent equal; refusal equal to `{"code":"BUNDLE_AUTH_FAILED","detail":null}`; input.type=`text`; input.value still equals each respective typed string, so the two visible editable inputs differ.
The existing sentence stays `That passphrase or file did not unlock. Check the six words and the file.` No new error-text disclosure was observed. The input remains useful for correcting a typo, but textContent omits its value.
Smallest fix: scope the test's claim to refusal/prose independence and explicitly state the retained editable draft; an assertion about the entire screen must also inspect input properties.

### Measurements with no production defect found

- Head seal: 96 independently generated phrases, 96/96 Node opens and 96/96 phone opens, exact payload equality.
- Base seal: 12 generated phrases sealed by port.cjs copied with `git show 9e1ece88:<path>`; all 12 opened in base and head, on BOTH entry points (48 successful opens).
- Real wordlist: 2048 unique ASCII words; 0 changed by normalization; 0 containing folded separators; 0 word collisions. 10,000 generated six-word phrases unchanged.
- All 4,194,304 ordered, hyphen-joined real-word pairs normalized and split back to their exact two original words. No delimiter loss or word merging. This measures the boundary property underlying unique six-word encodings; it is not a brute-force enumeration of 2^66 phrases.
- Exhaustive 1,112,064 Unicode scalar scan: 59 single characters behave as separators between ASCII words; 1062 non-ASCII scalars normalize to ASCII letters or letter sequences. This includes compatibility ligatures and letter styles; it does not collapse two real list words.
- Raw class: U+0009-U+000D, U+0020, U+002C-U+002E, U+005F, U+00A0, U+1680, U+2000-U+200A, U+2010-U+2015, U+2028-U+2029, U+202F, U+205F, U+2212, U+3000, U+FEFF.
- Additional single-character separator preimages through NFKD: U+2024-U+2026, U+207B-U+208B, U+FE10, U+FE19, U+FE30-U+FE34, U+FE4D-U+FE50, U+FE52, U+FE58, U+FE63, U+FF0C-U+FF0E, U+FF3F. Runs collapse; leading/trailing runs disappear. Decompositions leaving a combining mark do not become a plain separator.
- 106 actual-input cases on BOTH entry points at BOTH revisions: head accepted 68, base 6; head refused 38. No head decoder disagreement and no refusal-code/message change for cases refused by both revisions.
- Cases include every one of the 59 effective separators; mixed/repeated separators; case; whitespace ends; fullwidth letters; U+212A Kelvin; U+017F long s; U+FB02 fl ligature; composed/decomposed accented i; U+0130 dotted capital I; U+0131 dotless i; U+1E9E capital sharp s; wrong valid/nonsense word, wrong order, 5/7 words, split/joined words; non-string primitives, boxed string, array, objects with throwing methods, throwing Proxy; empty/separator-only input; lone high/low surrogates; 1,000,000-character text and 1,000,000 characters of padding.
- Long s and the ligature already opened at base. Kelvin and fullwidth uppercase spellings newly open. Accents, dotted/dotless i and sharp s do not turn into a different real word. No altered ASCII word/order/count opened.
- Full refusal JSON at head is constant per decoder: Node `{"code":"BUNDLE_AUTH_FAILED"}`; phone `{"name":"StorageFailure","code":"BUNDLE_AUTH_FAILED","state":3,"retryable":false}`. No typed or normalized text in either. Their different error classes are inherited; code/message agree.
- Entire port.cjs and wordlist.cjs are byte-identical to git-show base; both deriveKey function bodies are byte-identical. Cipher, parameters, randomness and seal body unchanged.
- Scoped tracked-source key-derivation search found exactly seal -> unchanged deriveKey, unseal -> helper -> deriveKey, and unsealBundle -> helper -> deriveKey. The other PBKDF2 caller is a test fixture. Protected/auth paths were excluded from the search.
- Scratch graph comparison adds exactly `rebuild/m3/setup/port/passphrase.cjs`, removes nothing, and changes only the two already-present product inputs import-bundle.mjs/import-screen.mjs. Route-only set remains the exact 19 names; the new helper is on boot.

### Build-count qualification

Unmodified page assertions fail locally at BOTH revisions: head probe count 139 instead of 143; shipped count 138, hence delta 17 instead of 21. Base shipped count 137 (rather than the pins' implied 141); boot 118 -> 119. The structural changes are exactly +1, matching the requested 142 -> 143 and 20 -> 21 deltas, but I have not reproduced those absolute counts.
Native esbuild initially could not read an ancestor directory (`Access is denied`). Scratch-only file resolution/load hooks, existing installed packages, and explicit nodePaths let it build. No dependency installation or assertion adjustment. The count difference must not be relabeled PASS. Post-blind resolution check found w5 and w6 resolve @noble/hashes to the SAME physical pnpm package; this is consistent with dependency deduplication affecting counts, but I did not reconstruct the earlier reviewers' installations. Final head run: 25/27; base page run: 5/7, actual/expected counts 138/142 and 16/20.

## Code changes and which tests noticed

Every row is a separate scratch mutation; all three cells and the page test executed each time. Product files were restored between rows.
C numbers mean C-PN-N. Every run also fails the SAME baseline P3-B2/P3-B5 count assertions; other page assertions pass. The column below lists ADDITIONAL failures only. Baseline-equivalent survivors have 25 pass / 2 fail; no raw run has every test green.

| ID | Exact change or clause | Additional tests that noticed |
|---|---|---|
| M01 | Delete first `.normalize('NFKD')` | NONE |
| M02 | Delete `.toLowerCase()` | C2, C9, C10, C15 |
| M03 | SEPARATOR_RUNS flags `gu` -> `u` | C2, C4, C9, C10, C14, C15, C19, C20 |
| M04 | Delete `\s` from separator class | C2, C4, C5, C9, C10, C14, C19, C20 |
| M05 | Delete `.replace(ENDS, '')` | C2, C4, C9, C10 |
| M06 | Delete final `.normalize('NFKD')` | NONE (possibly equivalent; see below) |
| M07 | Non-string guard returns typed instead of empty string | C4 |
| M08 | Separator range endpoint U+2015 -> U+2014 | C2, C5 |
| M09 | Remove comma from class | C2, C5 |
| M10 | ENDS `/^-+|-+$/g` -> `/^-+/g` | C2, C4, C9, C10 |
| M11 | Node derive argument `normalisePassphrase(passphrase)` -> `passphrase` | C6, C10 |
| M12 | Phone derive argument same replacement | C6, C9, C14, C15 |
| M13 | Node derive argument `(normalisePassphrase(passphrase), passphrase)` | C10 |
| M14 | Phone derive argument same comma expression | C9, C14, C15 |
| M15 | After lowercasing, `.replace(/\p{M}/gu, '')` | C3 |
| M16 | After lowercasing, `.replace(/[\ud800-\udfff]/g, '')` | NONE |
| M17 | After lowercasing, `.replace(/\u0085/g, '-')` | NONE |
| M18 | Node decrypt refusal carries `e.typed = passphrase` | NONE |
| M19 | Phone decrypt catch `fail(BUNDLE_FAILURE, 3, { typed: passphrase })` | NONE |
| M20 | Exported PASSPHRASE_SEPARATORS flags `u` -> `gu` | C19 |

14 mutations detected; 6 baseline-equivalent survivors. M01/M16/M18/M19 have separately reproduced behavioral counterexamples above. M17 widens the boundary in F3. M06 is not claimed as a defect: exhaustive scalar comparison found zero cases where the final NFKD changed the earlier pipeline's result, and both KDFs normalize again.

## NEW versus ALREADY KNOWN

The reports were first opened AFTER F1-F4 and the full mutation table were written above.

- F1 NEW: not R1 B1's substring false alarms. R1 B1, author section 11/B1, and R2 section 1/B1 address C-PN-13/C-PN-16; none catches C-PN-11's equal-word swap.
- F2 NEW: author section 11/B1 and R2 section 1/B1 mutate rendered prose (whole phrase/first character). They do not exercise first-NFKD removal, surrogate deletion, or extra serialized error fields.
- F3 NEW: R1 N1 and R2 N1/R2-N4 already know Cf format characters refuse; U+0085 is White_Space, not that format-character issue. Post-blind runtime check confirmed U+0085 has White_Space and U+FEFF does not (Unicode 17.0).
- F4 NEW qualification of the existing evidence: R2 P7 and author section 11/B1 establish identical textContent/refusal prose, without inspecting the retained input.value. The retention itself is inherited from base.
- ALREADY KNOWN and independently reproduced: injectivity over list words, old-bundle compatibility, unchanged sealer/KDF, two normalized opening sites, refused format characters, and helper added on boot (R1 P1-P5/N1/N6; R2 P1-P7/N6; author sections 2/6/7c). Absolute local count failures are NEW to this environment; earlier reviewers report green counts.
- Post-blind correction to R2 P2's claim that Unicode expansions cannot reach wordlist words: my stored scalar scan includes U+3374 -> `bar`. Follow-up generated `lock-shield-over-doll-weird-bar`; replacing `bar` with U+3374 opened on base/head, Node/phone (4 OPEN). This is an inherited compatibility spelling, not a collision between two valid generated phrases. The correct collision proof is injectivity ON the list plus preserved word boundaries, not absence of Unicode preimages.

## What I did not verify

- No deliberate access to private fixtures, owner bundles/passphrases, ledgers, protected soak, auth files or src/history.js; see the search-scoping qualification below. No private conformance gate, whole Today test step or rig187 executed. No real-phone Safari/keyboard run, hosted deployment, durable adoption, or end-to-end port CLI/gate run.
- Scratch fixture preparation replaces only sealInventedBundle's CLI/gate orchestration with actual makePassphrase()/seal() over a tiny invented state. Tests retain their assertions. Node runs one process at a time using the specified v24.19.0 executable; every test command sets MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York on separate lines.
- Helper/decoder behavior tested in Node WebCrypto and the rendered route in jsdom, not physical iOS. Exhaustive Unicode work tests helper output, not a million PBKDF2 calls. No proof for arbitrary custom noncanonical secrets sealed outside the port generator or resource exhaustion near the maximum JS string size.
- Exact submitted build counts and an entirely green unmodified four-file run remain unverified as explained above. Mutation conclusions compare to the same measured baseline, not waived test failures.
- Search-scoping qualification: one native git-grep package-version command lost its intended package-file scope under argument quoting and returned 25 root build/documentation matches. No personal data appeared in the returned output or this report, but I cannot certify which tracked paths that command scanned internally. Subsequent searches used explicit named files. This prevents an unqualified claim that every internal read stayed within the requested boundary.
- One report file written in the worktree; no tracked product edit, commit, push, checkout, reset, stash, clean, fetch, install, or dependency edit. Scratch retained at C:\Users\joeym\AppData\Local\Temp\astra-passphrase-ba04c07f-20260919; no cleanup deletion attempted.
