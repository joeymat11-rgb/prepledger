# C-UI-0 Static Pre-Audit
Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412 and :569; static pre-audit, nothing executed; highest effort
Head: 18c3b63e5e1a4dd26885892fbc609b4825628d71

Keep the lane unready pending the two R4 fixes and focused mutation witnesses for the additional holes below. All current package pins, the state manifest and the app digest match; the only locked-pack change is precisely the owner-ratified CSS line. The next hand should first challenge visible elements excluded by the shared walks, folded set/optional copy, incomplete pressed/radius/primary checks, and the state edge comparison. This audit establishes source and byte facts, not a green gate. No Python, Playwright, gate, render or mutation was run.

Path key (all references below are file:line): P = rebuild/m1/approved-2026-09-18/; Q = P/quality/; L = rebuild/lanes/c/ui-port/; R = P/README.md; S = Q/STANDARD.md; G = Q/gate.py; H = Q/statesheet.py; C = Q/common.py; T = Q/teeth.py; J = L/packages/C-UI-0.json; I = Q/baseline/states/INDEX.json; V = P/states/STATE-INVENTORY-DRAFT.md; R4 = L/reviews/C-UI-0-review-R4.md. U+XXXX denotes the literal non-ASCII character in a source/check name. Binary artifacts have no line numbers; their declaring record's line is cited.

Findings, most severe first

1. HIGH - Shared visibility exclusions can omit visible text. S:30 promises actual visibility; C:314-335 instead (a) discards any element with null offsetParent, including a viewport-fixed element with no containing-block ancestor; (b) removes the word round from inset() but consumes the corner radii as inset distances, so inset(0 round 50%) is classified empty; (c) discards text-indent <= -1000 on an inline span even though that property does not indent that span's own inline text. G:175 and H:101,125 use this helper for contrast/records. G:153 and H:84 separately skip null-offsetParent targets; H:87,89 also lose fixed primaries/overflow candidates. A visible fixed placeholder/aria-label/pseudo string also leaves the extra copy sweep at C:358; ordinary innerText is still swept. Smallest fixes: replace the offsetParent proxy with applicable visibility/box checks, parse inset only before round, and apply indent exclusion only when it actually moves the text out. Add independent witnesses; a changed record or image may still fail another check.

2. HIGH - R4 B2 remains: an inert clip can hide a visible target from its named rule. R4:61-83 and S:130 say only a truly clipped-away assistive box is exempt. C:140-145 checks the computed rect without position; G:153/H:84 trust it. A static/relative 20 px target with clip:rect(0 0 0 0) is excluded despite remaining drawn. Require an applicable absolute/fixed positioning mode and an actually empty clip. The genuine assistive label is P/app/app.html:43 and P/app/app.css:150. This is source confirmation of R4's witness, not a re-run.

3. HIGH - R4 B1 and two raw-text siblings remain. S:47,131,133,163 forbid the copy; C:78 checks literal space-hyphen-space before C:82 folds it, so U+00A0-hyphen-U+00A0 escapes that check (R4:37-59). C:18,88-90 also matches set x on raw text: '8 U+FF58 105' folds to a forbidden set but misses it. H:492 uses swept.lower(), so 'optU+FF49onal' misses the workout optional rule (S:85). Use sweep_form for these lexical checks, retaining the raw Pd/Cf scan to preserve original character evidence. Raw U+2212 handling at C:46-51 also permits '3U+22125' and any standalone minus line without verifying it is a control; R4:88-99 already names that overbroad exception and Po U+2043. Tighten the numeric/control exception if the owner intends a semantic dash ban.

4. MEDIUM - Several universal promises are only sampled. S:42,151 says every pressed surface; G:72,567 checks only eight selectors, excluding e.g. #talk-today, Save, most chips and links. S:32,144 says the radii rule is exact and pills fully round; G:263,507 reads only borderTopLeftRadius on eight component classes, checks no pill, and accepts an empty set. S:9/139 says every margin; G:101-105,227-233 measures immediate body/stack blocks plus selected inner classes, not arbitrary nested controls. S:23 says sans 430-500; G:75,257-259,504 admits 400 without distinguishing sans from serif. Smallest fix: enumerate the promised surfaces/corners/font roles, or explicitly narrow each claim in the standard before acceptance.

5. MEDIUM - Above-fold and visibility promises have no complete check. S:16,127 promises a wholly visible primary. G:146-148,437-443 tests existence and bottom <= H only: top<0, horizontal displacement, hidden/transparent primary can pass that named check. H:87-93,500-501 neither requires a primary nor tests its top/horizontal bounds, and rounds its bottom before comparing. S:138 says all RIR chips visible; G:224-225,480 tests offsetParent only, so opacity:0, visibility:hidden, clipping or off-screen positioning does not invalidate that lock. Check the expected visible primary and all viewport edges without rounding; use an applicable visibility predicate for the chips. Other checks may catch the same edit.

6. MEDIUM - The state tolerance is not actually 'every edge'. R:149-152 and S:167 promise <=3 px on each edge; H:131 stores left/top/width/height and H:267-273 compares those four values independently. Left +3 and width +3 move right +6 while this comparison remains in tolerance; the same applies to bottom. Also H:130 rounds the new rect to two decimals before comparison despite S:202-203 saying values are read as measured; H:133 rounds font size to tenths before the 0.5 check. Compare derived right/bottom too and retain measurement precision (or document the rounding boundary). A thumbnail is a separate, unproved catcher for these examples.

7. MEDIUM - Contrast excludes readable cases and ignores compositing. S:31/145 promises text contrast against its background. G:176-182 and H:102-108 omit single-character text, boxes below 8 px, and text with under half its box above an assumed 22 px scroll fade; narrow/overflow-visible text can still be readable. Input values/placeholders and pseudo text have no own DOM text node, so these walks never measure them. G:178-186/H:104-112 keep RGB but drop alpha; C:328-329 only rejects near-zero opacity and G:555/H:474 compare uncomposited colour. An rgba label with reduced alpha, or an element with fractional opacity, can retain a computed RGB ratio while drawn contrast falls. H:132 likewise drops alpha from records. Measure actual glyph colour/compositing and supported text sources; remove or explicitly qualify the size/length/fade exemptions.

8. MEDIUM - Accept is distinguishable in text, not reliably by status, and can replace evidence on failure. S:56,184-191 calls neither accept evidence of green; G:668 and H:615 nevertheless return 0 on a clean accept. G:612 and H:505-512 write baselines/records even when earlier checks failed; H:427-430 then writes the full index. The detailed accept table below distinguishes this from guarded --accept-thumbs. Smallest fix: expose an explicit machine-readable mode/accept status to consumers, require a subsequent ordinary green run, and stage full-accept writes until validation succeeds.

9. LOW - Reconcile the paper now. R:41,319/S:112 say 42 teeth rows; T:298-398 has 43 (q8 exists, q7 does not, despite R4:83 mentioning q7). T:307/309 says 620/200 px; its mutations use 630/210 (T:93/96). R:223 wrongly says prefix T-0 selects T-40h; H:409 uses startswith. R:174,215/S:174 and J:597 retain 0.00 px cross-platform prose, while current J:232,605/R4:15-20 record 0.04 px. G's exceptional 'the gate finished this screen' check (G:378) is absent from S's purported full list. Refresh generated counts/prose and add the diagnostic check to the list. R4's historical-pin note is already addressed at J:531; do not report it as still missing.

Two further qualifications: S:194-199/R:201-204 promise a worst-measured block on every run with four own-platform rows, but H:591-608 omits an empty block and collapses all-zero own measures to one line; full --accept compares nothing and has no such block. R4:105-108's exception note also remains: H:420 catches Refused as Exception if one reaches render_one, so it would become a problem/exit1 rather than the S:109-110 refusal/exit2. No reachability witness was executed; re-raise Refused before that catch and align the block wording with actual output.

Pack integrity (requested comparison)

The requested git diff --name-status 5f4cad0a HEAD -- P has exactly one path outside Q and R: P/app/app.css:202, changed by 449fd73. Its diff adds only 'min-width: var(--hit);' after min-height on the existing .link line. Hashing all 53 files in that locked scope against the 5f4cad0a blobs found 52 identical and that one difference (old SHA256 a94851c76a1989864535ca8ae4f3287833945da6595530e3949f360fc71da11a; current in table). L/C-UI-0.md:3,8 locks app, :30 supplies the narrow exception; J:83-93 and R:242-251 record the lane chat's dated question and Joe's 'Yes, make it 44'. The recorded approval matches this diff exactly; the private conversation itself was not verified.

(2) Full package and cross-file hash tables

All 31 current hash declarations below exist and match their recorded SHA256. The 16 r3.filesTouched entries were also hashed: nine still match HEAD; seven differ as listed separately, and all 16 match the explicitly named historical f543489 blobs (J:531). No hash-named file is missing. Table references identify the declaring line, not a claim that binary files have lines.
| File | Record | Actual SHA256 (= current pin) |
|---|---|---|
| L/reviews/C-UI-0-review-R1.md | J:10 | e8534309659b3c7b1e535beeec44c609fa365398acd7ba27b87eb7c0227333fe |
| L/reviews/C-UI-0-review-R2.md | J:17 | 774066c3f6bc5797633fa0a9f6d21e3dfce90298fbcc06a59a215d580c3fe42b |
| L/reviews/C-UI-0-review-R3.md | J:24 | 0dfb54be3d20161b786dda38b3370c63422685a50c04259e3f790e64a1ab8e12 |
| L/C-UI-0.md | J:32 | 81e24c3cc5d2a11e9e54e15059f48157a0a2520c5e42399807d796845457f54a |
| L/GATE-TEETH-AUDIT-R1.md | J:36 | c2093d23abdb17a4bc88962f6c75d38314c6b50ce350f48cb52089817012f110 |
| .gitignore | J:98 | d2261f8459d658135f9654605a3f19e460ee9ebd6c678eb30fd08037aa7c0fe5 |
| P/app/app.css | J:102 | bf4924e74fc4edc5cebf7fba6519613d9eec7f44397db990396fe402c124edc2 |
| P/README.md | J:106 | 371e7eda6cc4059eee193f05ed26ba8bb5a8704a1f496b83ef38ea3d5e3d5a0b |
| Q/STANDARD.md | J:110 | 3abf257d00ae904f4db07c0396f75c271cfe4329684a3dac6a2774ff8a1bf26c |
| Q/common.py | J:114 | 6ddf79ab56fcaa6fdae45e20d52ce53f43ce6e3bece32addac2bb87d5feefb0b |
| Q/gate.py | J:118 | 62baa10f0707c48ed6a1eb70ec89dad8dff261fa376935357323da583616211e |
| Q/statesheet.py | J:122 | 6627331fb9ca4546e1eaa22f6c016ce6b13ed489cd2971635b6ad345f232559e |
| Q/phonesheet.py | J:126 | ef5fd386d49e88c8576a5610cda71a1ed3a537c91564fb93cd4dc048b0f0713b |
| Q/teeth.py | J:130 | 0b8027da3320469a8a6302437754ce7d35efbc43c6138dce831e3084b45f5b5f |
| Q/baseline/linux/ENV.txt | J:134 | c4bb05a2c2d9cf7ab9d6717e905aee809defe8056f6ad1b88c4702a2d4620ecb |
| Q/baseline/linux/ink-today.png | J:138 | 32f52cfd814e23e2bc688861dba4c028dea3d277ba9f33f46037aab5ad101813 |
| Q/baseline/linux/ink-workout.png | J:142 | 7cd837db28d1403628599d495b6f49757cdbb44f985bd0a36e77b4b0dd83bcf3 |
| Q/baseline/linux/ink-coach.png | J:146 | 0c9b741a7174042f8f04dd338c50933c4137f784d06fb2be275e4b5f17c5c425 |
| Q/baseline/linux/dawn-today.png | J:150 | e5417552426859f2e2f5514aa160f33d69dfb049cdd3951a08a164a90236de31 |
| Q/baseline/linux/dawn-workout.png | J:154 | 925e0fd1dc3c9aae6591aacd5d4464731c1bc0bdbff85661460920c9cfde30cc |
| Q/baseline/linux/dawn-coach.png | J:158 | c40a1f0e8a67a9618849cc90f3d3cc14226eea0157136aa15d714765881a27f0 |
| Q/baseline/states/INDEX.json | J:162 | 1a68c1c3a22efd7980ad8f3cbad322765176f6c2e73012679612244f3923b837 |
| Q/baseline/states/linux/ENV.txt | J:166 | f388bb6d58d2d4501380e76335f611a5ebe664f8650b89df07e953d778b7197a |
| Q/baseline/win32/ink-today.png | J:170 | 8b825dfb9e7f2222e83570585d63eeb40ea3e1c458b428e277fc4015115305de |
| Q/baseline/win32/ink-workout.png | J:174 | 6c6d8c6c5fe983eab78035389ded6995c28eb0cea49ba113760718141415bb15 |
| Q/baseline/win32/ink-coach.png | J:178 | f563a3a61571fd48332780065a14a457ebfb67fbd762c19b93ac9469afd6430c |
| Q/baseline/win32/dawn-today.png | J:182 | 4527c68efb5aaf850089f7e2ee3a33e918ee621ccc29d3db5b16fc5b23d8aa47 |
| Q/baseline/win32/dawn-workout.png | J:186 | 62929ffa8b46dbb9c6c48a17f44c121092573bafb92d7839ec58adad3d461632 |
| Q/baseline/win32/dawn-coach.png | J:190 | 42058579b3b12a38664edcd7c631ab4b27a8557982c1393057ed8b3d21965bb0 |
| Q/baseline/win32/ENV.txt | J:194 | 4943aa6d57603ae5ccf08387b253d3356d0375a0c30a118a734aa8669befaf56 |
| Q/baseline/states/win32/ENV.txt | J:198 | 1c1e166caa460dc043af91a78c6b959b22c6d4824e3c3da3f1e1f88d9e410d3a |

| Historical mismatch at HEAD | Record | Historical expected SHA256; current value above |
|---|---|---|
| P/README.md | J:514 | deb51a00f49426333e671a1784341b610a0ec21ae17af6000195772107cefbee |
| Q/STANDARD.md | J:516 | a573d5d70231140e584e9cf0c69ff764b115d23fc779028cb3bf34176349b878 |
| Q/baseline/states/INDEX.json | J:524 | fbfa03366de62a1ef936f6a900dd79f4134299c7caae4f2639160e908eaccf43 |
| Q/common.py | J:526 | 8ee065776c4fd912ea41455312e5c9497d8a8e0e15efaaef44da53d42a956326 |
| Q/gate.py | J:527 | f86e7d911a401141e5c22e98aaf7cc67bbc734625c3655603ac567698569d248 |
| Q/statesheet.py | J:528 | bf794ff9ecd7269dc1029960f3664d12c3fe37a2b7596a1b9a4665dc5c552332 |
| Q/teeth.py | J:529 | 75f308fa8fa0e3ac9a7cc796a8ef323701f7c5d3c008095ea0ccadd19e49eaaf |

The nine historical matches are J:515 (app.css), :517-523 (linux ENV and six screen PNGs), and :525 (states/linux/ENV). The historical/current distinction is explicit, so these seven differences are provenance, not damaged pins.

| Additional record / changed-path coverage | Declaring file:line | Recomputed result |
|---|---|---|
| State-tree aggregate | J:203-216 | 1,257 files; 1,437,414 bytes; SHA256 74995f1581cc03dc21796a71c2cc8fcce17c45c844dacdea4808b7221c10c10b: MATCH; <3 MB. |
| State subtrees | J:208-211 | shared 419 / 654,203 bytes; linux 419 / 390,586; win32 419 / 392,625: all MATCH. |
| App aggregate (sorted relative paths + SHA256, LF join, no final LF) | I:1685; R:208-209; C:235-253 | b391366fd413130672bd524c7af40046185029ca52f6c13516868393dde54550: MATCH. |
| Font pins (additional code pins) | G:79-80; P/app/app.css:5 | Sans c04be0b43dc3911dd36a7cb7203c5ff6daa4f42522e2bc2e6fa3325a61c43d8b; Serif ff90213df9f50596c71ada04c34d2dee9327fe86526e713a9d49a7064b1db660: MATCH. |
| All pack README / STANDARD / INDEX / ENV declarations | R:208; S:155; I:1685; four Q/baseline[/states]/{linux,win32}/ENV.txt:1-9 | These seven files contain only one literal cross-file digest, I:1685, verified above; no other literal SHA256 to check. ENV counts/dimensions verified below. |
| Changed state artifacts not individually named in files | J:161-216,531; I:3-1674 | 1,254 paths: Q/baseline/states/<ID>-<theme>.json (418) and Q/baseline/states/{linux,win32}/<ID>-<theme>.png (836). All are covered by the matching manifest, none individually pinned. Exact ID set: T-02..T-95 excluding T-34/T-35, plus T-40b..T-40h; W-01..W-45; C-02..C-65 plus C-50b. Themes: ink,dawn. |
| Added lane paths absent from the package's file list | L/C-UI-0.md:34; J:6-27,96-200 | L/reviews/C-UI-0-review-R4.md; L/packages/C-UI-0.json itself (self-hash would be circular). R1-R3 are pinned separately. Add R4 as the new review record when reconciling this early package. |
| Deleted screen baselines not individually named | L/C-UI-0.md:28; J:96-200 | Q/baseline/dawn-coach.png, dawn-today.png, dawn-workout.png, ink-coach.png, ink-today.png, ink-workout.png. Their new platform paths are pinned. |
| Deleted run files not individually named | L/C-UI-0.md:28; J:97-99 | Q/run/dawn-coach.png, dawn-today.png, dawn-workout.png, ink-coach.png, ink-today.png, ink-workout.png, report.txt, states-report-C.txt, states-report-T.txt, states-report-W.txt, states-report.txt. Removal is authorized by the untracking requirement. |

Changed-path accounting uses the package's sourceBase e0a6c8ef (J:40) through HEAD for the lane, and 5f4cad0a through HEAD for pack integrity. The matching aggregate names its entire subtree rather than listing each image. No other lane-changed path is omitted from those current pins/aggregate except the paths enumerated above.

(3) Full documented-check / code comparison

Names below reproduce S:127-159 (Unicode written U+XXXX); all 33 ordinary screen-check names match what the code prints, including the two formatted 22/14 px names. Existence is not complete enforcement: limitations are stated in each row. S:29's shorter 'contrast' tag resolves to its full name at S:145.

| Documented rule/check (S line) | Enforcing code | Scope / static verdict |
|---|---|---|
| primary action in first viewport (:16,127) | G:146-148,437-443; H:87-93,500-501 | 3 sizes in G, reference only in H; incomplete bounds/visibility and absent state primary, finding 5. |
| fits without scrolling at 393x852 (:128) | G:444-446 | Reference size; compares body scrollHeight/clientHeight, as documented. |
| Log in the thumb zone (centre >= 70% of height) (:17,129) | G:447-449 | Workout/reference only; >=0.70 matches. |
| touch targets >= 44 px (:43,130) | C:126-145; G:150-156,451-452; H:81-86,490 | Shared selector and 44 match; fixed/clip/zero-width exclusions. ::before height alone can inflate claimed hit area without verifying width, position or pointer response. |
| copy: no dashes, readiness words, vendor names (:47,131) | C:12-90,344-362; G:454-457; H:482-486 | Rule/name exists; raw-space/fixed extra-copy holes, findings 1-3. Vendor matching is substring (C:84), not the word-boundary wording of S:47. |
| generated content the sweep cannot read (:132) | C:352-367; G:458-459; H:484,487 | Exact shared name; counter/counters outside quoted strings fail. Extra walk's fixed-element omission still applies. |
| the multiplication sign in every set string (:24,133) | C:18,88-90; G:460-461; H:488-489 | Raw digit-x-digit regex; normalized-letter sibling, finding 3. |
| Log label uses U+00D7 (:24,134) | G:462-464 | Requires literal multiplication sign and no literal ' x '; workout/all sizes. Rawness here preserves the deliberate literal-sign requirement; full-screen set sweep is separate. |
| no transitions or animations outside the embers (:41,135) | G:160-167,389,465-467 | Elements and both pseudos, all sizes reduced + reference allowed; all CANVAS elements excluded, not just named embers/mist. |
| serif and sans faces loaded and distinct (:136) | G:197-209,325-341 | Loaded statuses, known elements and different canvas glyphs; exact name. |
| serif for names and numbers, sans for the rest (:22,137) | G:88-92,211-222,470-472 | Fixed serif selector list; other own-text nodes sans. Null-offsetParent nodes excluded; not a semantic classifier of new headings/numbers. |
| RIR chips are the five locked values (:138) | G:94,224-225,474-486 | Values/labels/order/count match; 'visible' is only offsetParent, finding 5. |
| page margin 22 px (:9,139) | G:95,99,101-105,227-233,344-352 | 22 +/-0.6 px, positions rounded to tenths; immediate blocks plus listed inner elements, not all nested surfaces. |
| card inner edge 14 px (:11,140) | G:96,108-112,235-236,489-491 | 14 +/-0.6 on named sides only; querySelector checks first matching .prompt, not every prompt. |
| icon inset 13 to 14 px (:11,141) | G:97,113-117,238-241,492-494 | Accepts 12.4..14.6 after tenths rounding; named pairs, first prompt only. |
| bottom safe area (:18,142) | G:98,243-247,495-501 | Last qualifying child must clear >=23.4 px; no real-device inset check (explicitly disclosed at S:18). A fixed last row can be skipped. |
| type sizes and weights on the scale (:22-23,143) | G:74-75,257-259,503-505 | WARN only; hardcoded sizes; weights {400,430,450,460,480,500}, so 400 sans is allowed contrary to S:23. |
| radii: 14 px for cards, buttons and chips; full round only for pills (:32,144) | G:263,506-507 | Top-left only; no pill roundness check and empty set passes, finding 4. |
| contrast (measured behind the text) (:25,29,31,145) | C:99-118,154-190; G:169-187,542-562; H:95-113,463-478,499 | 4.5/3.0 and large >=24 px match. Gold lower tier requires marker class or <24 characters. H runs only reference size, despite S:31's 'both gates, at all three sizes'. See finding 7. |
| tertiary links have no underline (:25,146) | G:514-515 | Reference .link elements with offsetParent only. No separate test ensures they are muted rather than merely meeting contrast. |
| right glyph column at 24 px (:12,147) | G:57-61,516-521 | Named glyph/card pairs, +/-1 px; coach list empty. 'Every' new glyph is not discovered. |
| icons share a centre line, text shares an edge (:13,148) | G:62-66,522-528 | Named pairs, +/-1 px at reference, as a sample rather than all rows. |
| same icon column (54) and text edge (88) on every screen (:13,149) | G:67-71,529-533 | Named elements at 54/88 +/-1 px; reference only. |
| gaps on the spacing scale (:10,150) | G:73,249-255,534-536 | WARN; {0,4,5,8,9,10,12,14,16,20,24,44}, +/-0.6. 0/44 extra; 4/5/9/10 allowed everywhere, not header/title only; negative gap before a class/id containing 'title' exempt. |
| pressed state on every tappable surface (:42,151) | G:72,565-586 | Eight selectors only; compares idle/down screenshot MD5. New/unlisted targets have no enforcing pressed test. |
| no seams in the scene (:36,152) | G:589-597 | Reference 1.5 mean, >50% pixels over 2, >4x local baseline; pixel heuristic does not independently pin 41/48/27% mountain positions (regression does). |
| visual regression vs baseline (:37,56,153) | G:600-629 | FAIL >0.1% with max-channel delta>10 OR mean of max-channel delta>0.5. Documents match numeric bounds; 'mean absolute shift' does not spell out max-channel aggregation. |
| no page or console errors (:154) | G:364,379 | One row per size; errors accumulate over that size's six views. |
| fonts pinned by sha256 (:155) | G:78-81,189-195,297-322 | Once; actual @font-face source bytes against two pins. Current local bytes verified above. |
| no straight edge in the scene with the mist drawn (:36,156) | G:392-409 | Reference at 3x, two frames; geometric/brightness heuristic exists. |
| no vertical streaks in the sky with the mist drawn (:36,157) | G:410-413 | FAIL >0.9, equality PASS; 1.3 is a historical measured comparison, not a second limit. |
| nothing moves except the embers (:41,158) | G:417-428 | Reference/all themes/screens; hide canvas.embers, count max-channel delta>6; PASS fewer than 20 moved pixels. Literal 'nothing' has an undocumented noise allowance. |
| nothing moves under reduced motion (:41,159) | G:417-428 | Same <20 pixels/>6-level allowance; no hidden embers in reduced mode. |
| State applied / errors / copy / x (:78,161-164) | H:480-489 | Applied attribute and errors since each navigation; same C helpers. Diagnostic label is 'state did not apply', 'error:', 'copy:' or 'set written with the letter x:'. |
| State targets / label overflow / optional (:85,98,163) | H:81-93,490-493 | Targets same exclusions; overflow only .primary,#log,.decision,.chip,.save with >1 px scroll excess. Two lines fitting a tall button pass although S:98 promises one line. Optional is raw lower(), finding 3. |
| State seams / contrast / primary (:99,164) | H:494-501 | Both margins >5 levels, same-sign step, adjacent flatness <1.5; shared contrast tiers; primary limited as finding 5. |
| State text / elements / geometry / colour / fonts (:166-169,202) | H:121-134,237-286 | Exact normalized own-text sequence/count, RGB delta>3, family unequal, size delta>0.5; rect limitation finding 6. Attributes and pseudo text are swept but not separately recorded. |
| State thumbnail / missing files (:168-182) | H:248-255,282-315,347-370 | 24x53 grayscale; FAIL mean>=2 OR >=1% pixels delta>24; missing JSON/thumb fails. Identical-other-platform-byte guard exists; hashes of all 418 committed pairs are distinct. |
| State index / accept / provenance (:184-200) | H:178-234,427-443,523-540,570-646 | Bidirectional ID/theme comparison; narrowed prefixes; mode rules below. App digest advisory; env metadata not used to validate platform. |
| Code-only diagnostic absent from S's full list | G:377-378 | 'the gate finished this screen' is a 34th possible distinct name on exceptions; ordinary 33/372 excludes it. |

There is code behind every gate tag, but no complete enforcement of the universal subrules identified above: every pressed target, all corners/pill roundness, every nested margin/glyph/column, sans-only weight limits, wholly visible primary/RIR, one-line labels, and full contrast sources/compositing. Rules marked eye/reviewer are not falsely counted as automated. No further ordinary named screen check is missing from S:127-159; state diagnostics and index/copy guards are documented at S:161-200.

| Count / number claimed | Static count / constant and evidence |
|---|---|
| 33 screen checks; 372 result rows (R:39, S:122) | 33 ordinary names above. G:362-429,435-539 gives 18*15 general +6*2 workout +6 fit +2 thumb +6*8 reference +1 font pin +3 error +6 allowed-motion sweep +12 mist +12 motion =372; not an executed result. |
| Three sizes / two themes / three screens | G:43-45: 393x852,375x812,360x780; ink,dawn; today,workout,coach. Screen regression writes only six reference renders (G:606-610), not 18 baselines. |
| 209 drawn states, 201 base IDs, 99/45/65 (R:33); 205 inventory rows (R:46) | I:3-1674 recount agrees; 8 suffixed variants; four absent base IDs T-01,T-34,T-35,C-01. V:91-342 recount=205, total at V:355. Source registrations: 93 literal Today +6 at states-today.js:226-231; 45 Workout; 35 literal Coach +30 at states-coach.js:277-308. |
| 418 records/renders; platform sets (R:40,43-45; ENV:7) | Exactly 418 JSON records matching all I ID/theme pairs; 418 linux and 418 win32 thumbnails; six screen PNGs per platform plus ENV. H:414-416 yields 209*2 nominal renders. |
| Thumbnail 1/16, 24x53; phone sheet thirds at 3x (R:147,520; ENV:9) | H:56-61 floor-divides 393/16 and 852/16; PNG headers agree. H:395 captures at 2x before resize. Q/phonesheet.py:39,72-80 captures 3x and cuts three thirds. |
| 42 teeth rows (R:41,319; S:112) | 43 row definitions at T:298-398; 41 potentially executed on win32 because p1/p3 are counted expected without running (T:471-477). q7 absent. |
| Tolerance numbers | Screen >10/>0.1%/>0.5: G:123-124,623-627; state >3/>3/>0.5 and >=2/>=1% over24: H:69-74,267-281,365-368; all match stated numeric limits, subject to edge/rounding and max-channel qualifications above. |
| Literal margins/scales/counts needing qualification | 22/14/13..14/24 constants match S:9,11,18; hidden +/-0.6 and column +/-1 allowances in G:99,347-350,490-501,520-535. 44 target exact C:133/G:155; gold <24 chars and large >=24 C:115-118,165-168. |
| Historical measured numbers, not constants | R:124-125,163-198,215 and J:232,605 report raster distances/platform runs. No static recount establishes 170 px, 1.26/1.66/1.67, 254 failures or runtimes; current recorded cross-platform rect maximum is 0.04, not the older 0.00 prose. |

(4) Full teeth table: anchors and named catchers, not mutation verdicts

Literal old strings were counted in the current target bytes, including LF-spanning anchors; every replacement anchor is exactly 1, none is 0 or 2. Shared append anchor = P/app/app.css:454 (T:45,70-71); X = 'the multiplication sign in every set string'; COPY = 'copy: no dashes, readiness words, vendor names'; ANIM = 'no transitions or animations outside the embers'; REG = 'visual regression vs baseline'. Non-replacement mutations have no text anchor to count. T:61-65 has a CRLF retry and refuses a nonunique anchor; none needed it here.

| Row / definition | Target and anchor occurrences | Expected catcher exists at exact name / text |
|---|---|---|
| a T:298 | app/app.html:36, 1 (T:77) | COPY + repr(U+2014), G:457/C:79. |
| b1 T:300 | app/app.html:60, 1 (T:81) | COPY + 'ready', G:457/C:83. |
| b2 T:302 | app/app.html:60, 1 (T:84) | COPY + 'claude', G:457/C:84. |
| c T:304 | app/app.css:5, 1 (T:87) | 'fonts pinned by sha256' / Earned Sans, G:319-322; 'serif and sans faces loaded and distinct' / same glyphs, G:338-341. |
| d-1 T:307 | append anchor 1; top 630px (T:93) | 'primary action in first viewport' / bottom, G:440-441. Label says 620. |
| d-2 T:309 | append anchor 1; top 210px (T:96) | Same primary catcher, G:440-441. Label says 200. |
| e1 T:311 | app/app.css:209 and :200, 1 each (T:100,103) | 'contrast (measured behind the text)' / <4.5, G:559-562; ratio assertion 3.0<=minimum<4.5, T:436-441. |
| e2 T:314 | Same two anchors, 1 each | Same contrast name/<4.5; 0<=minimum<3.0. This tests low primary text, not a dedicated muted-tier failure. |
| f T:317 | append anchor 1 (T:113) | ANIM / animation start G:163-167,467; 'nothing moves under reduced motion' / px moved G:428. |
| g T:320 | app/states-today.js:50, 1 (T:117) | 'the visible text changed', H:258; state T-02 H:586. |
| g2 T:322 | app/states-today.js:50, 1 (T:121) | 'copy: '+repr(U+2014), H:485-486; T-02 H:586. |
| h1 T:327 | app/app.css:200, 1 (T:125-129) | Positive control: exit0/'0 with problems', H:572,615; mutation is 2px. |
| h3 T:329 | app/app.css:200, 1; 4px (T:132) | 'became', 'rect edge moved (px)', 'thumbnail mean shift', H:271-273,366,603; T-02. |
| h2 T:331 | app/app.css:200, 1; 60px (T:135) | 'became', H:273; T-02 H:586. |
| i T:333 | No text anchor; Q/baseline/{linux,win32}/ink-today.png exists (T:138) | REG / 'no baseline at', G:615-617. |
| j1 T:335 | No text mutation; empty folder is created later (T:459-460,492) | REFUSED/exit2, G:275-278,671-683. Future scratch folder is not a missing package file. |
| j2 T:337 | No text mutation; app/compare.html exists (T:494) | REFUSED/exit2, same guard. |
| k1 T:339 | app/app.html:177, 1 including LF (T:145) | 'RIR chips are the five locked values' / 'is not', G:481-482. |
| k2 T:341 | app/app.css:266, 1 (T:148) | 'serif for names and numbers, sans for the rest' / '.screen-title is Earned Sans', G:217,472. |
| k3 T:343 | append anchor 1 (T:151) | 'page margin 22 px' / 'card-eat left 28', G:347-352. |
| m1 T:345 | append anchor 1 (T:158) | ANIM / 'animation card-eat::after', G:161-167,467. |
| m2 T:347 | append anchor 1 (T:163) | ANIM / 'transition start::after', same code. |
| m3 T:349 | app/app.html:44, 1 (T:167) | COPY/'ready','claude'; X/'8 x 1', G:457,461/C:18. Regex intentionally returns one digit after x. |
| m4 T:352 | append anchor 1 (T:170) | Same COPY/X names, with generated-string input C:352-361. |
| m5 T:355 | app/app.html:44, 1 via mut_m3 (T:173) | "copy: 'ready'" and 'set written with the letter x', H:486,489. |
| m6 T:357 | app/states-today.js:49-51, whole block 1 (T:178-180) | 'no state T-02 in the build', H:195; 'records with no state', H:573. |
| m7 T:359 | append anchor 1 (T:183) | 'the visible text changed', H:258; T-02. |
| n1 T:361 | append anchor 1 (T:187) | 'generated content the sweep cannot read' / 'status-line::after', C:356-365/G:459. |
| n2 T:363 | append anchor 1 (T:191) | 'the visible text changed', H:258; T-02. |
| n3 T:365 | append anchor 1 (T:194) | Same visible-text catcher. |
| n4 T:367 | Q/baseline/states/INDEX.json:3-10, block 1 (T:196,200) | 'theme sepia, which the sheet does not render', H:197; 'records with no state', H:573. |
| n5 T:369 | Same INDEX block 1 (T:205) | 'T-02 theme dawn is in the build but not in', H:200; 'records with no state', H:573. |
| p1 T:375 | Q/common.py:276, 1 (T:214-217) | 'element 10 "Nothing was recorded." left' and 'rect edge moved (px)', H:271-273; both T-84 JSON files:1 have that element10. Linux-only execution. |
| p2 T:378 | No text anchor; Q/baseline/states/{linux,win32}/T-02-ink.png exists (T:277) | 'no thumbnail at', filename and '--accept-thumbs', H:354-356. |
| p3 T:380 | Q/common.py:276, 1 via mut_p1 (T:224-225) | REG / 'of pixels changed', G:628-629. Linux-only execution. |
| p4 T:382 | No text anchor; both themes' T-02 PNGs exist in both platform dirs (T:231-239) | 'is byte identical to', 'never copied', filename, H:313-314. Missing second platform is counted expected (T:482-485). |
| q1 T:384 | No text anchor; command supplies 390x844 (T:292) | REFUSED/'--sizes 390x844'/'the sizes are', G:687-689. |
| q2 T:386 | app/app.html:60, 1 (T:244) | COPY / 'U+00AD' and 'ready', C:81-84/G:457. |
| q3 T:388 | app/app.html:36, 1 (T:249) | COPY + repr(U+2015), C:79/G:457. |
| q4 T:390 | app/app.html:53 and append anchor, 1 each (T:263-265) | 'colour ... became' and 'colour moved (levels)', H:275-277; T-02. |
| q8 T:392 | app/app.html:36, 1 (T:256) | COPY + repr(U+2212), C:80/G:457. |
| q5 T:394 | app/states-today.js:49, registration prefix 1 (T:271) | Only exit1 + substring 'T-02' + report existence required (T:395,413-420,445-447). No exact render-error catcher asserted; any other T-02 problem could satisfy it. J:595's T-04 story differs from this row. |
| q6 T:396 | No text mutation; app/compare.html exists | REFUSED/'EARNED_APP'/exit2, H:636-638,618-626. Tests state --accept only, not G --accept or H --accept-thumbs. |

All named catchers exist; their firing is unverified. The harness proves exact gate names only for fails entries (T:430-435); stdout entries are unstructured substring checks (T:418-420). q5 needs a render-error-specific assertion. There is no q7 row or mutation witness for R4 B2 at this head.

(5) Remaining raw-text and measuring-walk siblings

The raw Pd/Cf scans C:79,81 are necessary character-category evidence, not normalization defects. C:46-51's raw minus exceptions are noted in finding 3. G:463-464 deliberately requires a literal Log multiplication sign; H:122,257-265 deliberately preserves exact record copy after whitespace normalization. The additional lexical misses are C:88-90 and H:492, not those exact-record comparisons. Q/phonesheet.py:36-86 has no copy/target/contrast measuring walk of its own.

| Requested style/attribute case | Static behavior and what would have to escape |
|---|---|
| Parent-only zero opacity | C:328-329 multiplies ancestors up to but excluding documentElement, rejects <=0.001: ordinary parent opacity0 hides text and is correctly excluded from record/contrast; no visible descendant can undo opacity. html opacity is not read. Target walks G:153/H:84 do not exclude opacity; transparent targets may still be tappable. Fractional-opacity contrast problem: finding 7. |
| Inherited visibility | C:327 tests the element's computed visibility; inherited hidden is excluded, a descendant explicitly visible is included if other tests pass. Target walks do not check it, so hidden chips may satisfy G's visibility lock (G:225). |
| Transform | C:330-335 reads the transformed bounding rect but compares inset pixel distances against that rect rather than the untransformed clip reference box. A 100x100 box, inset(30px) and scale(.5) leaves painted area but is classified empty (60>=50). A translate bringing a box into the viewport is measured there. Zero scale truly hides its text. Validate this candidate by browser mutation. |
| Clip-path | Own inset() only, not ancestor clipping or other shapes (C:314-335). inset(0 round 50%) false exclusion is finding 1; circle/polygon/ancestor clipping have no explicit hidden-text test, the opposite blind spot. Target walkers do not inspect clip-path. |
| Font size zero | No explicit font-size visibility exclusion (C:325-336); zero dimensions or G:177/H:103's <8 cutoff may exclude it. A fixed-size zero-font element can remain recorded; readable child text restoring its font is considered separately. A zero-height/width overflow-visible text box can remain readable yet fail __seen's area test. |
| Off-screen position | C:332 excludes wholly offscreen element boxes; ordinary offscreen glyphs are not visible. Overflow-visible glyphs/pseudos extending on screen from an offscreen box can still escape the element-box test. Target walkers do not exclude offscreen nonzero-width boxes; primary bounds are incomplete (finding 5). |
| aria-hidden | No walk branches on it (C:325-362; G:153; H:84). It cannot alone evade visual checks; it can remove readable text from assistive output, which these scripts do not audit. |
| hidden attribute | No direct attribute exemption. P/app/app.css:146 applies display:none!important, causing absent layout; a winning display override makes it visible and generally measurable again. Attribute alone is not an inert-style bypass. |
| content-visibility | No explicit check in C:325-336/G:153/H:84. Descendants skipped by browser rendering may or may not retain measurable boxes; no static claim of a rendered pass. Test retained-box versus actual-paint behavior; the gates do not audit this mechanism directly. |
| Zero-size overflow-hidden parent | C:325-336 does not intersect ancestor clips. G:180-182/H:106-108 only treat auto/scroll and impose a fixed 22px exclusion; JS_RECORD has no such ancestor intersection. Hidden text can remain in records if its own rect survives. Conversely a readable overflow-visible zero-size element itself is excluded by C:331; a zero-width target is skipped outright at G:153/H:84. |
| Other inexpensive exclusions | G:251 excludes any child classed chrome from gaps; G:535 exempts negative gaps whose next id/class contains title, regardless of semantic role. C:358 skips fixed extra copy; G:219,257,263,514 skips fixed sans/type/radius/underline candidates. Named pad/icon checks G:236,239 fail missing candidates rather than silently accepting them. Use measurement applicability, not convenient style/class proxies. |

(6) Accept path

| Command | Baseline writes, refusals and external status |
|---|---|
| python quality/gate.py --accept | G:611-614 writes six platform PNGs as encountered; G:657-667 writes ENV even if FAILs exist. G:690 refuses effective narrowed screen/size lists, not the mere flags: explicitly listing all screens/sizes is allowed despite R:137. Nonempty EARNED_APP refused G:692-694. Clean exit0, failures exit1; text header ACCEPT and report.json SET rows distinguish it if consumed (G:643-668). |
| python quality/statesheet.py --accept | H:505-512 writes each available JSON+platform thumb regardless of other problems; H:427-429 writes INDEX+ENV. H:630-638 refuses a nonempty --only, combination with --accept-thumbs, and nonempty EARNED_APP. Empty/missing --only value does not narrow and is not refused. Clean exit0, failure exit1; same states-report.txt and sheets/images as ordinary runs, text SET/ACCEPT only (H:570-615). |
| python quality/statesheet.py --accept-thumbs | H:436-441 writes platform thumbs+ENV only if all rows and index checks are clean; shared JSON/index unchanged. Refuses nonempty --only, --accept combination, nonempty EARNED_APP (H:632-638). Clean exit0 still equals ordinary green; failed validation writes no baseline, but run images/reports/sheets are still written (H:457,442-443). |
| Other commands / refusal leftovers | Ordinary G/H and phonesheet.py write only run artifacts (G:609,653-656; H:457,562,613; phonesheet.py:81,86). teeth.py mutates scratch baselines for i/p2/p4, not committed ones (T:137-141,228-239,276-280,479). G's refusal rewrites report.txt only, leaving any older report.json untouched (G:671-683). Fail-closed consumers must inspect exit, mode and fresh artifact identity, not just an existing JSON. |

Thus the external-build accept refusal exists on all three accept paths for the nonempty variable that actually redirects C:225-228. An empty variable is ignored and uses the pack. An accept can look green to an exit-code-only consumer; G has structured SET rows, H has no separate structured mode record. Full accepts are not transactional; --accept-thumbs gates writes on validation but filesystem write failures can still leave a partial set.

(7) Platform evidence

I:1676-1685 identifies the shared JSON writer as Windows 11 (win32), Python 3.14.6, playwright 1.62.0, Chromium 151.0.7922.34. Q/baseline/states/win32/ENV.txt:2-9 assigns its 418 thumbnails to that same environment; Q/baseline/states/linux/ENV.txt:2-9 assigns the other 418 to Linux 6.18.44-fc-v37, Python 3.11.15, playwright 1.56.0, Chromium 141.0.7390.37. Both screen ENV files:2-8 give those respective environments for their six PNGs. All four ENV files and I list allow-file-access-from-files plus font-render-hinting=none. Metadata is an attribution, not authenticated evidence of which process wrote bytes (R:312-315; H:207-210).

There IS written evidence of Linux judging Windows records: J:219-232 gives the builder's ordinary full run and 0.04 px worst edge, :575-579 dates the Windows record rewrite, :604-605 explicitly describes its Linux judgement; independent R4:3-4,11-23,146-148 reports a full 418-render run against those records at bbfd60c. HEAD's only later commit 18c3b63 adds that review. Earlier J:440-460 describes the coarser record round. These are attributed execution receipts, not this reviewer's executions; no committed raw run report or CI run proves them independently (R:51-53 says run output is uncommitted). Do not use C:268-275's source comment as a PASS receipt. The current 0.04 receipt supersedes the 0.00 prose for the current records.

What I did not verify
- gate.py ordinary full/narrowed runs, its --accept writes/refusals, fresh refusal artifacts, contrast/pressed/motion/seam/font behavior, or the 372 actual result rows.
- statesheet.py full/narrowed runs, --accept/--accept-thumbs write safety/refusals, rendered ID registration, per-state visibility/geometry/contrast, raster tolerances or cross-platform reproducibility.
- teeth.py's 43 outcomes, manual mutation witnesses (R4 and all additional static candidates), expected Linux-only p1/p3 failures, q5's runtime catcher, or runtime/time-budget claims; anchor counts establish buildability only.
- phonesheet.py base/state/multiple-state renders, live phone/assistive behavior, boards versus screenshots, hosted CI, or the owner's private ratification conversation. No conformance/private data, protected app history, auth, personal log, soak, installs, commits or tracked-file edits were needed.
