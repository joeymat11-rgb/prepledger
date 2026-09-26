# REVIEW-NATIVE-LOAD-BUILD-R22-l3 (Fable, independent reviewer l3 of NATIVE-LOAD build round 22 + 22b + 22c; CONVERGENCE sweep; blind to the builder's reasoning)

Reviewed: earned-nlr, branch rebuild/e-native-load-red, HEAD bd7654a798592a7dae421b9d68fec850fb0993d1, the UNCOMMITTED working tree
after round 22c (git status --porcelain: M FC12 rebuild/m4/spec/native-load-options.test.cjs, M FA03
rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs, M rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md, ?? the l1 and l2 reviews;
git diff --numstat with the eight explicit product/test paths: FC12 +202/-0, FA03 +63/-0, report +208/-0, nothing else). Inputs read in
this order: the l1 review (B-R22-1, D-R22-1), the l2 review (B-R22L2-1, D-R22L2-1, D-R22L2-2), the object diff (cmd-redirected git diff
with one explicit path each, into scratch: FC12 210 lines and FA03 71 lines, read whole; the 22c hunks are FC12 :5284-5341 and FA03
:1333-1373), spec R9.13 at 7ef8291 (cmd-redirected git show 7ef8291:rebuild/coach/NATIVE-LOAD-SPEC.md, 384796 B; section N (iv) and (v)
read whole and enumerated below), the product regions the rows and my mutants exercise (FC03 :244-273 HIDDEN_LEGACY_KINDS, projectHeld,
heldProjection, :755 the present-revision gate; L/source-admission.mjs :840-863 A-LEGACY-VECTOR; FC01 E/native-load.cjs :16-24 STRUCTURAL,
:216-226 and :540-548 the two LEGACY_PENDING sites; E/today.cjs :51-58 pickStructural and :94-100 the card pick; E/writers.cjs :284-333
the own/reclaim/ladder queue readers; L/today-bindings.mjs :536-605 and :677 the host's registrar and project() calls of heldProjection;
FC12 :3181-3216 the ALV text read and the walk's base(); none of the protected five), and the builder's Round 22c report section LAST
(report :1163-1240). Every node run went through node %TEMP%\pm-run.cjs shared (jobs fable-r22-l3-A/B/C/D and fable-r22-l3-probe; all
four slots taken 03:00:33Z, all freed by 03:11:02Z), guard preload nlr-build\guard.cjs ("GUARD protected-in-cache: none; refused: none"
present in all 88 TAPs, checked programmatically), TZ America/New_York, MEASURED_TEST_NOW 2026-09-03, NODE_PATH via the existing
junctions. Mutants are my own in-memory overlays: ov3.cjs (CJS preload; one replacement that must occur exactly once, on the source the
CJS loader compiles and on the text fs.readFileSync returns; "# L3MUT <id> applied {...}" in every TAP) and ov3-esm.mjs (a node:module
register() load hook for the ESM host file L/today-bindings.mjs; "# L3ESM <id> applied [...]" marker file); every anchor was checked
exactly-once against the product bytes before any run (mk3.cjs: 43 anchors, 0 bad). Anchors are mine, from the product bytes, not the
builder's, not l1's, not l2's, not Astra's. No product file was written. Scratch: %TEMP%\nlr-r22-l3-scratch (hash.cjs, mk3.cjs,
mkplans.cjs, ov3.cjs, ov3-esm.mjs, run3.ps1, planA-D.txt, jobA-D.cmd, mut-*.json, probe3.cjs, probe.cmd, witness3.cjs, tally3.cjs,
grep-kinds.cmd, diff-fc12.txt, diff-fa03.txt, spec-7ef8291.md, out\*.txt, progress.txt). This review is the only new file; no tracked
file was edited; nothing committed, pushed, fetched, checked out or written to DECISIONS/STATUS; nothing run or written in any other
worktree. Every fixture value below is invented.

## Q1. Product bytes byte-identical to bd7654a? YES (node sha256 of each working file vs `git cat-file blob bd7654a:<path>` stdout, byte-exact)
- FC03 rebuild/m4/workout/native-load-effects.cjs SAME b25d2e611245cc5725ff79040cfcc60dcda1f05856f2ea51fcd71ea8c4cfc522 (92274 B)
- L/source-admission.mjs rebuild/m3/w6/local/source-admission.mjs SAME 10bd5cfbf0f591dbfba652b64c514d270345230664c5785c33aea8cabf07157d (74465 B)
- FC01 rebuild/engine/native-load.cjs SAME 92a4a0b4e693af00dcbfe0bfdf6fa75a9a2026690ff11ff674f58bae4755fdd1 (51352 B)
- W/engine-capture.cjs rebuild/m4/workout/engine-capture.cjs SAME fa68a748680b5b646c52c769f9a2ff2d30b0846417887a9e0a5374e55f43aee4 (11278 B)
- w6 admission test rebuild/m3/w6/test/local-source-admission.test.mjs SAME bcc6df4d02a9c3cf71af50410996b5cebfee4bc830040c27eb1e0f119c53ec4e (20125 B)
- also SAME (read for the host-tier and card mutants): L/today-bindings.mjs 91aa980fc51e78c36f6946a3141e71e3a679ae74b8c78bfba44a805fa4b1d797
  (68749 B), E/today.cjs 685f6e1e907cd9bba268e5d8f6927120172869febe1c747ffb9bd851aa17c45a (47806 B).
- FC12 DIFF: head 76dbee6d422df1f8a2e2bbf548360adcb111910ec379e58c6163c4c94f93ecbd (516028 B) -> work
  fd90657c722845a6971775f4bd2789185fd26c73214d8418432b39165d4b9119 (547570 B); FA03 DIFF: head 285027b08279297df233eaf532d2f4eb6c527f73b0420457e2f680a4e08297f4
  (106387 B) -> work d3f06697e01d658f7c212d539ffe0ada463c5e4028aa118fce5ebac1b9a17d65 (114249 B); report DIFF: head 0657385e... -> work
  d07fb5cefcf0caf1eaa7b550b97991080546cdd0da3db6eeb30cfba2b4cabddb (266644 B). CR 0 and non-ASCII 0 in FC12, FA03 and the report.
- The builder's claim "product bytes byte-identical before and after, and equal to the bd7654a blobs" is what the bytes measure.

## VERDICT: REJECT (one blocker, B-R22L3-1, test bytes only; B-R22L2-1, D-R22L2-1 and D-R22L2-2 are PAID; the head product is correct)

All three l2 items are paid exactly as the builder says: the three unlock rows/cells are the only killers of my own X6 overlay (FC12
245/247, FA03 49/50), R22L2-TRUTHY-DONE-ALV is the only killer of my own X4 (246/247), and R22L2-ABSENT-DONE-HOST is the only killer of
my own E1 at the host tier (49/50) while R22-ABSENT-DONE-HIDDEN still kills it at FC12 (Q3). The six earlier overlays go red only on
round-22/22b/22c rows, and every pre-round row stays green under every overlay. The reject rests on the commissioned Q4 convergence
criterion: one of my 34 new single-clause mutants, z09 (FC03 :272, the registered projection hides only the FIRST hideable entry:
`state.queue.filter((q) => !hide(q))` -> `state.queue.filter((q, i) => !hide(q) || i !== state.queue.findIndex(hide))`), survives all
247 FC12 rows and all 50 FA03 cells, and differs from spec (v) RULE ("hides EVERY unfinished LEGACY debut/unlock entry ... of EVERY lift
whose projected w is null or ABSENT") and INVARIANT on an in-rule input shown by probe: every fixture in both files has exactly one
hideable entry at a time. The fix is one FC12 row (below); no product byte needs to move; no STOP.

## Q2. Does each new (round 22c) row assert the SPECIFIED R9.13 outcome, not the head's incidental output? YES, all five
- R22L2-UNLOCK-OVER-NULL-UNHELD (FC12 test 245; FC12 :5298): legacyOverNullBase() with fx-press's entry replaced by r22cUnlockQ()
  (kind 'unlock', done false, state 'DEBUT', newW 60; fx-row at w 55 keeps its own pending DEBUT 60). Per v1/v2 x R1/R2 it asserts:
  the fold state keeps both entries pending with fx-press's kind still 'unlock' and no issue ((v) "the entry, its history and the fold
  state are unchanged"); the registered projection shows 0 unfinished fx-press entries and 1 fx-row entry, the card is [null,null,null]
  ((v) RULE with kind in HIDDEN_LEGACY_KINDS = {debut, unlock}, EXPECTED CARD); it deep-equals the debut twin's projection ((v)
  INVARIANT: the same registered projection); cardLoads(ROW) = [60,60,60] ((v) "the hidden entry no longer takes the day's structural
  slot"); the check on fx-press's baseline-ask completion refuses NATIVE_LOAD_LEGACY_PENDING refs [C1 Close Ref] field 'queue' ((v) THE
  CHECK, derived from FC01 :222 whose STRUCTURAL :20 includes 'unlock'; my mutant c04 below shows this assertion has teeth: with 'unlock'
  dropped from STRUCTURAL the check OFFERS an adoption instead); afterwards w null, no authority, no 'adopt:' receipt, the unlock still
  pending ((v) "nothing durable is written"). Every clause maps to a sentence of (v) quoted in the title; every value invented.
- R22L2-UNLOCK-OVER-ABSENT-W (246; :5314): absentW(r22cUnlockQ()), so the w field is deleted (F0({w:undefined}) deletes it; wField
  asserts Object.hasOwn false). The same seven assertions in the ABSENT form ((v) "null or ABSENT"), the twin being
  absentW(LEGQ({newW:60})). Under M01 (=== null) it goes red too, as its fixture predicts.
- R22L2-TRUTHY-DONE-ALV (247; :5331): alvState with a finished legacy DEBUT newW 105 whose done is 1, and again 'yes' (state
  'ESTABLISH' as the file's done twin): ALV.fn names nothing, JSON byte-identical, Object.hasOwn newWSets false, done unchanged; the
  done:true twin (R913-ALV-KINDS's fixture) likewise; the two deep-equal once done is read as true. That is (iv) DEFINITIONS "q.done
  falsy" (1 and 'yes' are truthy, so the entry is not a legacy scalar structural entry) and UNCHANGED BY THE RULE "done entries". A pure
  ALV row (no fold, no card), which is the clause's whole content.
- FA03 R22L2-UNLOCK-OVER-NULL-HOST [Y] (cell 49; FA03 :1337): withPress(day,{w:null}) plus a pending legacy UNLOCK 60, through the
  durable host on D1 and after a cold reopen on D3: gym.read phase 'ready'; every demo-press slot load.state 'not_prescribed' (the
  baseline ask); demo-row 40 lb; host projection: w null, 0 visible unfinished demo-press debut/unlock, no active demo-press issue.
  (v) EXPECTED CARD and INVARIANT at the host tier for the unlock kind (the cell the l2 fix paragraph offered).
- FA03 R22L2-ABSENT-DONE-HOST [Y] (50; :1354): basisFor(day) with demo-press's w DELETED and a pending DEBUT 60 with NO done key (both
  absences asserted per day on the basis), the same host outcomes on D1 and D3. (v) RULE "not done" (an entry without the key is
  unfinished) and "null or ABSENT" at the host tier; D-R22L2-2. The builder shaped it beside L14-B1-ABSENT-W-HOST (ABSENT w) rather than
  beside R913-LEGACY-OVER-NULL-HOST (present null) as the l2 text named; the done key is its only difference from L14-B1-ABSENT-W-HOST,
  so E1 is its own kill and M01 also kills it. Acceptable: the present-null no-done form is pinned at FC12 by R22-ABSENT-DONE-HIDDEN,
  and the host tier's claim is EXPECTED CARD, which is asserted. INFO (as at l1): the host projection assertion is `pressOf(p).w ==
  null` (null or absent); the ABSENT form is pinned on the basis.
- Round-22 and 22b rows are unchanged since l2 (their hunks precede :5284; FA03 :1310-1331 unchanged); the l1 and l2 Q2 readings stand.

## Q3. My own overlays for X6, X4, E1 and M01/M02/M03/M10/N5/N4, whole FC12 (247 rows) and whole FA03 (50 cells)
Mechanism: ov3.cjs (mine) patches one anchor in memory; applied counts in the child TAP were {source-admission.mjs:1} for every ALV
mutant at FC12, {native-load-effects.cjs:2} for every FC03 mutant at FC12 (the loader compile plus FC12's own utf8 text read of FC03,
as l2 saw) and :1 at FA03. FA03 never reads the ALV text, so the ALV overlays apply 0 times there (n/a, reported as such, not as a kill).
| Overlay (my anchor -> mutant) | FC12 | rows red (test no.) | FA03 | cells red |
| --- | --- | --- | --- | --- |
| head (no overlay) | 247/247 exit 0 | none | 50/50 exit 0 | none |
| M01 FC03 :270 `filter((x) => x && x.w == null)` -> `=== null` | 244/247 | L14-B1-ABSENT-W-PROJECTION (236), L14-B1-ABSENT-W-UNDO (237), R22L2-UNLOCK-OVER-ABSENT-W (246) | 48/50 | L14-B1-ABSENT-W-HOST (48), R22L2-ABSENT-DONE-HOST (50) |
| M02 ALV `||q.newWSets!==undefined)continue;` -> `!=null` | 246/247 | L14-B2-EXPLICIT-NULL-NEWWSETS (238) | n/a 50/50 | |
| M03 ALV shift anchored on `ex.wSets[0]` | 244/247 | L14-B3 (239), L14-B3b (241), L14-B3b-FRACTIONAL (242) | n/a | |
| M10 ALV `Math.round(x+(q.newW-ex.w))` | 245/247 | L14-B3 (239), L14-B4 (240) | n/a | |
| N5 ALV shift anchored on `Math.max(...ex.wSets)` | 245/247 | L14-B3b (241), L14-B3b-FRACTIONAL (242) | n/a | |
| N4 ALV `||q.done||q.state` -> `||q.done!==false||q.state` | 246/247 | R22-ABSENT-DONE-ALV (243) | n/a | |
| E1 FC03 :271 `!== 'string' && !q.done && HIDDEN...` -> `q.done === false` | 246/247 | R22-ABSENT-DONE-HIDDEN (244) | 49/50 | R22L2-ABSENT-DONE-HOST (50) |
| X6 FC03 :271 `!q.done && HIDDEN_LEGACY_KINDS.has(q.kind);` -> `q.kind === 'debut';` | 245/247 | R22L2-UNLOCK-OVER-NULL-UNHELD (245), R22L2-UNLOCK-OVER-ABSENT-W (246) | 49/50 | R22L2-UNLOCK-OVER-NULL-HOST (49) |
| X4 ALV `||q.done||q.state` -> `||q.done===true||q.state` | 246/247 | R22L2-TRUTHY-DONE-ALV (247) | n/a 50/50 | |
Red-first witnesses from my TAPs (actual for expected): X6 on 245 [1, 1, 'ENGINE_CAPTURE_BASELINE_UNPROVEN'] for [0, 1, [null,null,null]]
and on 246 [1, 'ENGINE_CAPTURE_BASELINE_UNPROVEN'] for [0, [null,null,null]] (the unlock shown; the capture refuses the whole day at
W/engine-capture.cjs :67); X6 on FA03 49 gym.read 'blocked' for 'ready'; X4 on 247 [[], false, true, 1] for [[], true, false, 1] at
"done 1: ... [105,105,100]" (newWSets written onto the finished entry); E1 on FA03 50 gym.read 'blocked' for 'ready'. Under every
overlay all 235 pre-round-22 rows, all 47 pre-round-22 cells and every round-22/22b/22c row not named for that overlay stay green: only
new rows fail, each new row fails under its own mutant and passes on the head. B-R22L2-1 PAID (X6 killed only by the three unlock
rows/cells, at both tiers), D-R22L2-1 PAID (X4 killed only by 247), D-R22L2-2 PAID (E1 killed at FA03 by 50 only).

## Q4. CONVERGENCE: the clauses of R9.13 (iv) and (v), and 34 NEW single-clause mutants, whole FC12 and whole FA03 under each
Clauses of (iv) A-LEGACY-VECTOR (spec 7ef8291): D1 q.done falsy; D2 q.state !== 'PROPOSED'; D3 q.kind 'debut' or 'unlock'; D4 typeof
q.native_load_spend !== 'string'; D5 typeof q.newW === 'number' and finite; D6 q.newWSets === undefined; D7 the lift is the exercise
whose id is q.exId; P1 Array.isArray(ex.wSets); P2 ex.w a finite number; P3 every element a finite number <= ex.w; C1 the ONE write
q.newWSets = ex.wSets.map(x => x + (q.newW - ex.w)) (anchor ex.w, delta sign, per element, exact value); C2 nothing else written
(q.newW, q.state, q.t, every other entry, ex.w, ex.wSets); C3 placement in replay() (after the document-lift append, before any family
read); IDEMPOTENT; DIGESTS unchanged; UNCHANGED BY THE RULE (PROPOSED, own-newWSets, native, done, no array wSets, present-null wSets,
null-w lift); OUT OF PRECONDITION named and unconverted. Clauses of (v) LEGACY-OVER-NULL: V1 legacy only (native entries keep the
held-only rule); V2 not done; V3 kind in HIDDEN_LEGACY_KINDS (debut, unlock, :250); V4 w null or ABSENT; V5 held lifts as today AND
unheld null-w lifts; V6 numeric-w lifts stay visible; V7 only the registered projection changes (projectHeld legacy:false and the check
unchanged); V8 nothing durable written, fold state unchanged, nothing raised; EXPECTED CARD (baseline ask, :67 passes, the day
prepares, other lifts unaffected, no structural slot taken); THE CHECK (LEGACY_PENDING, [Close Ref], 'queue'); INVARIANT ("EVERY
unfinished ... entry of EVERY lift"); host tier (durable host and reopen); rows under R1 and R2. C3 and DIGESTS are testable only by
the w6 admission cells (CI-only, STOP-R21B-1) and the static R913-ALV-PRODUCT row; not mutated here. R1 vs R2: neither (iv) nor (v)
has a revision-dependent product clause; every row loops both revisions, so each mutant below is evaluated under both; z10 (the fold's
present-revision gate) shows the R2 loop is live.
| Mutant (clause; file, my anchor -> clause) | FC12 (pass/247) | FA03 (pass/50) | Result; killed by |
| --- | --- | --- | --- |
| y01 D3 kind set narrowed: `(q.kind!=='debut'&&q.kind!=='unlock')` -> `(q.kind!=='debut')` (unlock not converted) | 246 | n/a 50 | K: R913-ALV-KINDS |
| y02 D3 kind set widened: `||(q.kind!=='debut'&&q.kind!=='unlock')||` -> `||` (any kind converted) | 247 | n/a 50 | LIVE: D-R22L3-3 |
| y03 D1 done clause dropped: `||q.done||q.state==='PROPOSED'||` -> `||q.state==='PROPOSED'||` | 245 | n/a | K: R913-ALV-KINDS, R22L2-TRUTHY-DONE-ALV |
| y04 D2 PROPOSED clause dropped: `||q.state==='PROPOSED'||` -> `||` | 246 | n/a | K: R913-ALV-KINDS |
| y05 D2 state clause narrowed to DEBUT: `q.state==='PROPOSED'` -> `q.state!=='DEBUT'` | 247 | n/a | LIVE: D-R22L3-4 |
| y06 D4 native clause dropped: `||typeof q.native_load_spend==='string'||` -> `||` | 246 | n/a | K: R913-ALV-KINDS |
| y07 D5 finiteness dropped: `typeof q.newW!=='number'||!Number.isFinite(q.newW)||` -> `typeof q.newW!=='number'||` | 247 | n/a | LIVE, EQUIVALENT on the admitted domain (below) |
| y08 D6/IDEMPOTENT guard dropped: `||q.newWSets!==undefined)continue;` -> `)continue;` (re-conversion) | 246 | n/a | K: L14-B2-EXPLICIT-NULL-NEWWSETS only (R913-ALV-KINDS's own-newWSets [110,110,105] re-converts to itself) |
| y09 D7 lift lookup: `find(x=>x&&x.id===q.exId)` -> `find(x=>x&&Array.isArray(x.wSets))` (first vector lift) | 246 | n/a | K: R913-ALV-IDEMPOTENT (fx-row's entry read fx-press's vector) |
| y10 P3 bound strict: `&&x<=ex.w)){` -> `&&x<ex.w)){` | 239 | n/a | K: R913-ALV-CONVERT, -KINDS, -IDEMPOTENT, -LAND, L14-B2, L14-B3, L14-B4, R22-ABSENT-DONE-ALV |
| y11 P3 bound vs newW: `&&x<=ex.w)){` -> `&&x<=q.newW)){` | 245 | n/a | K: R913-ALV-P ([100,105] at w 100 converted), R913-ALV-IDEMPOTENT |
| y12 C1 delta sign: `x+(q.newW-ex.w)` -> `x-(q.newW-ex.w)` | 238 | n/a | K: nine ALV-reading rows |
| y13 C1 per element: `map(x=>x+(q.newW-ex.w))` -> `map((x,i)=>i===0?q.newW:x+(q.newW-ex.w))` (first set snapped) | 244 | n/a | K: L14-B3, L14-B3b, L14-B3b-FRACTIONAL |
| y14 C2 also lands the vector: `...;ex.wSets=q.newWSets.slice();` | 240 | n/a | K: seven rows ("nothing else is written") |
| y15 C2 also writes newW: `...;q.newW=Math.max(...q.newWSets);` (differs only when max(wSets) < w) | 245 | n/a | K: L14-B3b, L14-B3b-FRACTIONAL ("newW unchanged") only |
| y16 P2 w type: `typeof ex.w!=='number'||!Number.isFinite(ex.w)||` -> `ex.w==null||` (a numeric-string w converts) | 247 | n/a | LIVE: D-R22L3-5 |
| y17 OUT-OF-P naming dropped: `named.push({...});continue;}` -> `continue;}` | 245 | n/a | K: R913-ALV-P, R913-ALV-IDEMPOTENT |
| z01 V1 native also hidden: hide `nullW.has(q.exId) && typeof q.native_load_spend !== 'string' && !q.done` -> `nullW.has(q.exId) && !q.done` | 247 | 50 | LIVE, EQUIVALENT under the :158 INVARIANT (below) |
| z02 V4/V6 w scope dropped: `const hide = (q) => !!q && nullW.has(q.exId) &&` -> `!!q &&` (hide on numeric w too) | 234 | 50 | K at FC12: R913-LEGACY-OVER-NULL-CONTROL, N27 (f), R913-LEGACY-OVER-NULL-UNHELD, the nine ALV card rows, R22-ABSENT-DONE-HIDDEN, R22L2-UNLOCK-OVER-NULL-UNHELD; FA03 has no numeric-w-with-legacy-entry control cell (FC12 pins the same function) |
| z03 V5 held only (the 40eb702 shape): `filter((x) => x && x.w == null)` -> `... && lifts.has(x.id))` | 239 | 46 | K: R8-PROPERTY walk, R20-RESTORE-OVER-LEGACY, R913-LEGACY-OVER-NULL-UNHELD, L14-B1 x2, R22-ABSENT-DONE-HIDDEN, both R22L2-UNLOCK rows; FA03 all four (v) host cells |
| z04 V4 w falsy: `filter((x) => x && x.w == null)` -> `filter((x) => x && !x.w)` (w 0 read as null) | 247 | 50 | LIVE: D-R22L3-1 |
| z05 V8 fold write: `? { ...state, queue: ... } : state` -> `? Object.assign(state, { queue: ... }) : state` | 240 | 50 | K at FC12: R8-PROPERTY walk, R913-LEGACY-OVER-NULL-UNHELD, L14-B1 x2, R22-ABSENT-DONE-HIDDEN, both R22L2-UNLOCK rows (the fold-state assertions after heldProjection); FA03 cells never re-read the fold |
| z06 V3 kind set widened: `new Set(['debut', 'unlock'])` -> `new Set(['debut', 'unlock', 'own', 'reclaim', 'ladder'])` (FC01's STRUCTURAL) | 247 | 50 | LIVE: D-R22L3-2 |
| z07 V7 projectHeld default `{ legacy = false } = {}` -> `{ legacy = true } = {}` (hiding in the check's call) | 245 | 50 | K: R15-LEGACY-ON-HELD, R8-PROPERTY walk |
| z08 V1 show side, native entries of held lifts not hidden in the check's call: `(typeof ... === 'string' || (legacy && !q.done` -> `((legacy && typeof ... === 'string') || (legacy && !q.done` | 223 | 47 | K: 24 held-lift rows; FA03 N27 (a), (c), N27-B39-HOST |
| z09 INVARIANT "EVERY": `queue: state.queue.filter((q) => !hide(q)) }` -> `filter((q, i) => !hide(q) || i !== state.queue.findIndex(hide)) }` (only the first hideable entry hidden) | 247 | 50 | LIVE: BLOCKER B-R22L3-1 |
| z10 R1 vs R2: FC03 :755 `const present = iss.revision === engine.revision;` -> `const present = true;` | 238 | 50 | K: N22 REVISION-RETENTION, R12, R16b, R16-D-FRESH-2, N29 x3, R17-ANCHOR-STRUCTURAL, N28 EXTERNAL-GATE (the R2 loop is live) |
| c01 CHECK code: FC01 :222 `refuse('LEGACY_PENDING', [closeRef], 'queue')` -> `refuse('RECORD_INVALID', ...)` | 239 | 50 | K: R15-LEGACY-ON-HELD, R20-RESTORE-OVER-LEGACY, R913-LEGACY-OVER-NULL-UNHELD, L14-B1 x2, R22-ABSENT-DONE-HIDDEN, both R22L2-UNLOCK rows; FA03 has no check cell for a legacy entry (FC12 pins it) |
| c02 CHECK field: `'queue'` -> `'exercise'` | 240 | 50 | K: the same minus R15 |
| c03 CHECK refs: `[closeRef]` -> `[]` | 239 | 50 | K: the same eight as c01 |
| c04 STRUCTURAL without unlock: FC01 :20 `['debut', 'unlock', 'own', 'reclaim', 'ladder']` -> `['debut', 'own', 'reclaim', 'ladder']` | 245 | 50 | K: R22L2-UNLOCK-OVER-NULL-UNHELD, R22L2-UNLOCK-OVER-ABSENT-W ONLY (witness: the check returns 'offer' with an adopt-baseline for 'refused' LEGACY_PENDING) |
| c05 the transition-side LEGACY_PENDING (FC01 :544) dropped: `refuse('LEGACY_PENDING', responseRefs, 'queue')` -> `void 0` | 245 | 50 | K: R8-P2, R17-ANCHOR-LEGACY-LATER |
| h01 host tier, registrar: L/today-bindings.mjs :549 `const state = { ...held.state };` -> `{ ...fold.state }` (gym.read on the raw fold) | n/a 247 | 39 | K: R3-B2, R4-DB21, N27 (a) (b) (c) (f), N27-B39-HOST, R913-LEGACY-OVER-NULL-HOST, L14-B1-ABSENT-W-HOST, both R22L2 host cells |
| h02 host tier, project(): :677 `heldProjection(p.fold, engine.at(day), day).state : null;` -> `p.fold.state : null;` | n/a 247 | 41 | K: R5-B12a, R5-B12b, N27 (a) (c) (f), R913-LEGACY-OVER-NULL-HOST, L14-B1-ABSENT-W-HOST, both R22L2 host cells |
Kill rate: 26 of 34 killed (76%); of the 8 live, 2 are equivalent with proof (z01, y07), 1 is the blocker (z09) and 5 are named
debts (y02, y05, y16, z04, z06); excluding the two equivalents, 26 of 32 (81%). Every kill is by a non-revision-pin assertion. Only
the round-22c rows kill c04 and only they and their debut twins kill X6: the round added exactly the sensitivity B-R22L2-1 asked for.

### B-R22L3-1 (BLOCKING under the Q4 criterion; test bytes only): (v) "EVERY entry of EVERY lift" is pinned one hidden entry at a time
- z09 makes FC03 :272 hide only the first entry the hide predicate matches. Spec (v) RULE hides "every unfinished LEGACY debut/unlock
  entry ... of EVERY lift whose projected w is null or ABSENT" and its INVARIANT reads "no registered projection carries an unfinished
  debut/unlock entry, native or legacy, of a lift whose w is null or ABSENT". Every fixture in FC12 and FA03 carries exactly one hideable
  entry at a time: legacyOverNullBase (fx-press null, fx-row 55), absentW, R20-RESTORE-OVER-LEGACY, the L14 and R22/R22L2 rows, FA03's
  demo-press cells (demo-row at 40 lb), and the walk at its default seeds (I16 did not trip). So z09 survives 247 + 50.
- Observable difference on an in-rule input (probe3.cjs, FC03.heldProjection over a minimal fold with no hold, head vs z09 under the
  guard; out\probe.txt): (a) two never-held lifts both at w null, each with a pending legacy DEBUT 60: head hides both (fx-press [],
  fx-row []); z09 hides fx-press's and SHOWS fx-row's (['debut']); (b) one w-null lift with a pending DEBUT 60 and a pending UNLOCK 65:
  head hides both; z09 shows the unlock; (c) the same with w ABSENT: z09 shows the unlock. In each case the fold state keeps both
  entries (the fold is untouched, as (v) requires). Derived consequence at the card, the same path the X6 witness measures: E/today.cjs
  :55 picks the visible legacy entry, :98 gives card.w = newW over a null w, and W/engine-capture.cjs :67 refuses the whole day
  ENGINE_CAPTURE_BASELINE_UNPROVEN, the failure (v) exists to remove, for the second lift (or the second entry).
- Reachable: input (a) is the R913-LEGACY-OVER-NULL-UNHELD / R20-RESTORE-OVER-LEGACY class applied to two lifts of one base (a
  re-admitted base whose two never-trained lifts each sit under an old pending debut; or two RESTORE Undos, one per lift, as
  L14-B1-ABSENT-W-UNDO records one), which the rows already model as reachable; the walk's base() starts BOTH lifts at w null whenever
  baseline and rowOn are drawn (FC12 :3191-3196). Input (b) is one old-app lift carrying a debut and an unlock at once, inside the
  rule's stated domain ("every ... entry").
- Fix (one FC12 row, test bytes only, e.g. R22L3-EVERY-ENTRY-OVER-NULL): legacyOverNullBase() with fx-row ALSO at w null (both lifts
  never held, each with its pending legacy DEBUT 60): the fold keeps both pending; the registered projection hides BOTH (0 visible for
  each lift), both cards are the baseline ask and the day prepares (cardLoads null for LIFT and for ROW, no structural slot taken), the
  check on each lift's baseline-ask completion refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] 'queue', afterwards both w null, no
  authority, no receipt; plus, in the same row or a twin, one lift (w null, then ABSENT via absentW) with a pending DEBUT and a pending
  UNLOCK: both hidden, the card the baseline ask. Red under z09 (probe: fx-row's debut visible; by the X6 witness the card assertion
  reads ENGINE_CAPTURE_BASELINE_UNPROVEN for fx-row), green on the head (probe: both []). One FA03 cell with demo-press AND demo-row at
  w null, each under a pending legacy DEBUT, closes the host tier (the PM's call, as with D-R22L2-2). No product byte moves.

### Equivalent live mutants (not findings; proof)
- z01 (native entries of an UNHELD w-null lift also hidden): the probe shows the difference (head shows a pending native DEBUT on an
  unheld w-null lift; z01 hides it), but (v) itself rests on the R9.11 :158 INVARIANT "already exclud[ing] an unfinished native entry
  on a w-null lift": native entries are minted only by FC01 :549 on an earn over a numeric w (FC01 :501 refuses an earn over a
  non-numeric base_load); the invariant is pinned by N27-B39-INVARIANT and the walk's I16 across the R9.11 return, RESTORE and hold
  rows. A fold state that broke it would be an R9.11 finding, not a (v) one. I did not re-prove the invariant over every fold path;
  it is the spec's own premise for the clause.
- y07 (newW finiteness dropped): the admitted state is parseStrictJson output (L/source-admission.mjs :184, :189, :413), and JSON has
  no NaN or Infinity, so no admitted entry carries a non-finite newW; the probe's difference (y07 writes newWSets [NaN,NaN,NaN] or
  [Infinity,...]; the head leaves the entry alone) needs a value the admission cannot mint. Residual, named not exempted: E/writers.cjs
  :296 computes a newW as `ex.w + 5` on the 'extension' branch, which is NaN only for an absent w on a lift with an owned standard; not
  shown reachable; on the head such an entry is left unconverted and its day refuses at W/engine-capture.cjs :83 as today.

## Q5. Did any existing row change, weaken or disappear? NO
git diff --numstat -- FC12 FA03 report: +202/-0, +63/-0, +208/-0; 0 deleted lines anywhere. One hunk per test file, appended after the
last existing row (FC12 @@ -5137,3 +5137,205 after R913-TYPED-C2-CARRIED; FA03 @@ -1307,3 +1307,66 after R913-LEGACY-OVER-NULL-HOST);
the 22c rows follow the 22b rows (FC12 :5284 onward; FA03 :1333 onward). New top-level names in 22c (r22cUnlockQ, r22cNullBase,
r22cKinds) collide with nothing (the file parses and runs; a duplicate const would be a SyntaxError); FA03's cells use cell-local
bases only. Every pre-existing row passes on the head (244 -> 247, 48 -> 50) and, per Q3 and Q4, stays green under all 43 overlays,
so none was weakened to pass. No walk byte moved.

## Q6. Counts (final bytes, my runs)
FC12 whole: 247 tests, 247 pass, 0 fail, 0 todo, 0 skipped, exit 0 (18 s; the R7 and R8 walks at their defaults). FA03 whole: 50
tests, 50 pass, 0 fail, 0 todo, 0 skipped, exit 0 (25 s). FC12 235 -> 240 (round 22) -> 244 (22b) -> 247 (22c: tests 245, 246, 247);
FA03 47 -> 48 (round 22) -> 50 (22c: cells 49, 50). 88 whole-file runs in all (44 FC12, 44 FA03), every one with the GUARD line.

## Q7. Hygiene
- FC12 547570 B sha256 fd90657c722845a6971775f4bd2789185fd26c73214d8418432b39165d4b9119; FA03 114249 B
  d3f06697e01d658f7c212d539ffe0ada463c5e4028aa118fce5ebac1b9a17d65; report 266644 B
  d07fb5cefcf0caf1eaa7b550b97991080546cdd0da3db6eeb30cfba2b4cabddb; CR 0, non-ASCII 0 in all three (no U+2013/U+2014); LF. The
  builder's FC12 and FA03 hashes (report section 5) re-measure equal. The l1 (241e3bad...) and l2 (b2fcd37d...) reviews are untracked
  and untouched.
- Unchanged product (Q1): FC03 b25d2e61..., L/source-admission.mjs 10bd5cfb..., FC01 92a4a0b4..., W/engine-capture.cjs fa68a748...,
  w6 admission test bcc6df4d..., L/today-bindings.mjs 91aa980f..., E/today.cjs 685f6e1e... (full hashes above; equal to the bd7654a
  blobs byte-exact). No FC03 hunk, so no ISSUANCE hunk and no revision move (D-R13L1-2 unchanged).
- GUARD "protected-in-cache: none; refused: none" in all 88 TAPs and in the probe; no protected-five file read, listed, grepped or
  loaded (every git grep, show and diff named explicit FILE paths after --; no directory-wide or revision-wide search); the w6
  admission cells not run (STOP-R21B-1 stands, CI-only). Overlays applied exactly once per file per child; the only applied-0 runs are
  the expected n/a pairs (17 ALV mutants at FA03, which never reads that text; h01/h02 at FC12, which never loads the host file).
- The builder's own disclosures (report section 7): (1) one Select-String with the glob rebuild\engine\*.cjs scanned the text of the
  protected five before its filename filter; nothing displayed, executed or loaded. Reported to the PM as the builder wrote it; not
  mine to adjudicate. (2) Five scratch launchers written with [IO.File]::WriteAllText, no worktree file: cosmetic.
- Carried debts (Astra L14 and earlier, the PM's): D-L12-ISSUANCE, D-L14-HOST-MUTANTS, D-L13-TYPED-C2, D-R13-LEGACY-OVER-NULL-ASK,
  D-R13L1-3, D-R13L1-2, D-L14-RECOVERY, D-L12-CUSTODY, D-L12-CONFIG, D-L14-CALIBRATION, D-L14-CI, D-L14-OWNER. PAID: D-L14-LEGACY-NULL
  (round 22), B-R22-1 and D-R22-1 (22b), B-R22L2-1, D-R22L2-1 and D-R22L2-2 (22c). The builder's X6b (projectHeld's legacy arm
  narrowed to debut) is reported by the builder as live and equivalent; my z07/z08 mutate the same arm from the other sides and are
  killed; I did not re-run X6b (its equivalence argument, nullW containing every held lift, reads correctly from FC03 :255 and :270).

## NAMED DEBTS (new; each LIVE with a specified difference shown by probe, on an input not shown reachable from this seat; carry by name unless the PM closes them; one FC12 row each, test bytes only)
- D-R22L3-1 (LOW; (v) V4, z04): a lift at w 0 is read as null (`!x.w`), so its pending legacy debut is hidden and its card is the
  baseline ask; spec (v) hides for "null or ABSENT" only, and (iv) P admits w 0 as a finite number, so the entry must stay visible and
  the card prescribe newW (E/today.cjs :98). Probe: head shows the debut on a w-0 lift, z04 hides it. Not shown reachable: an old-app
  lift at w 0 (E/writers.cjs :311 mints a newW of `Number(ex.w) || 0`, so numeric 0 is in the engine's vocabulary; whether a w of 0
  is, is not readable from this seat). Row: w 0, no wSets, pending legacy DEBUT newW 5 -> visible in the registered projection, the
  card [5,5,5] through the real capture.
- D-R22L3-2 (LOW; (v) V3 from the widening side, z06): HIDDEN_LEGACY_KINDS widened to FC01's STRUCTURAL set ('own', 'reclaim',
  'ladder') hides such pending entries of a w-null (or held) lift from the registered projection; spec :250 names debut and unlock
  only. Probe: head keeps a pending 'own'/'reclaim'/'ladder' entry on a w-null lift visible, z06 hides it ('info' stays visible under
  both). No card difference (E/today.cjs :55 picks debut/unlock only); the projection's queue differs. Not shown reachable: a pending
  own/reclaim/ladder queue entry on a w-null lift (E/writers.cjs :287/:309/:329 read those kinds only to mark them done). Row: a
  w-null lift with a pending 'own' entry and a pending legacy DEBUT -> the debut hidden, the 'own' entry kept.
- D-R22L3-3 (LOW; (iv) D3 from the widening side, y02): the ALV kind clause dropped converts any pending entry with a finite numeric
  newW and no newWSets on a vector lift (probe: an 'own', 'reclaim', 'ladder' or 'info' entry gets newWSets [105,105,100]; head leaves
  it); spec converts debut/unlock only and says "every other entry ... unchanged". No card difference (:55). Not shown reachable:
  such an entry carrying a numeric newW (the engine's own 'info' push at E/writers.cjs :331 carries none). Row beside R913-ALV-KINDS:
  an 'own' entry with newW 105 on the vector lift is byte-identical after the conversion, nothing named.
- D-R22L3-4 (LOW; (iv) D2, y05): the state clause narrowed to `q.state!=='DEBUT'` leaves a pending debut/unlock in any other
  non-PROPOSED state (or with no state key) unconverted; spec DEFINITIONS say `q.state !== 'PROPOSED'`. Probe: head converts a pending
  debut in state 'ESTABLISH', 'UNLOCK', 'X' or undefined; y05 leaves all four. Consequence at the card: E/today.cjs :55 picks it (its
  filter is non-PROPOSED, not equal-to-DEBUT), so its day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED at :83 instead of capturing
  the vector. Not shown reachable: every rebuild writer pushes state 'DEBUT' (E/writers.cjs :292, :296, :312); the old app's state
  vocabulary for pending entries is not readable from this seat. Row: a pending legacy DEBUT with an invented non-PROPOSED state
  ('QUEUED') converts to [105,105,100] like the DEBUT-state one, and one with NO state key likewise.
- D-R22L3-5 (LOW; (iv) P2, y16): the w-type clause replaced by `ex.w==null` converts under a NUMERIC-STRING w ('100': JS coerces
  `x<='100'` and `105-'100'`), where spec P requires typeof number (named, unconverted, the day refuses at :83); R913-ALV-P's 'BW'
  string cannot tell them apart (NaN comparisons fail P under both). Probe: head names fx-press and leaves it; y16 writes [105,105,100].
  Not shown reachable: a numeric-string w in old-app JSON. Row beside R913-ALV-P: w '100' (string), wSets [100,100,95], newW 105 ->
  named [{... w:'100' ...}], unconverted, the day refuses.

## Builder's Round 22c section (report :1163-1240, read LAST): TRUE on every point I could measure
The counts (247/247, 50/50), the kill table (rows 236-247 and cells 48-50 by test number, identical to mine cell for cell, including
M01's three FC12 kills and two FA03 kills), the red-first witnesses (the same failing assertions and actual values as under my
overlays), the sha256 list, the numstat (+202/-0, +63/-0), the hygiene line, the placement of R22L2-ABSENT-DONE-HOST (ABSENT w, no done
key) and its reason, the measured THE-CHECK outcome for an unlock (LEGACY_PENDING [Close Ref] 'queue' in all eight runs; my c04 shows
what the check does without 'unlock' in STRUCTURAL: an offer), the X6c kill (245/247, 49/50) and the X6b equivalence reading all
re-measure or read as stated. The builder's overlays were built from the l2 descriptions; mine are independent and agree. The section
could not mention B-R22L3-1 (a quantifier mutant outside every anchor family the l1 and l2 reviews named) or D-R22L3-1..5.

## What I could not do
Run the w6 admission cells or anything loading the protected five (C3 placement and DIGESTS are CI-only; R913-ALV-PRODUCT pins the
placement statically); the 80-file broad set (exclusive; not in the brief; no product byte moved); read the old app's src to settle
the reachability of a w-0 lift, an own/reclaim/ladder entry with newW, a non-DEBUT pending state or a numeric-string w; re-prove the
R9.11 :158 INVARIANT over every fold path (z01 rests on it as the spec does); re-run the builder's X6b.

## AAR
- Asked: blind level-3 CONVERGENCE review of rounds 22 + 22b + 22c (test-only payment of l2's B-R22L2-1, D-R22L2-1, D-R22L2-2):
  Q1-Q7, own overlays for X6/X4/E1 and the six earlier mutants, a clause enumeration of (iv) and (v) with at least 16 new
  single-clause mutants over whole FC12 and FA03, kill rate, verdict with named debts.
- Happened: product bytes re-hashed unchanged against the bd7654a blobs; five 22c rows read against (iv)/(v); nine own overlays each
  red only on the intended rows with 235 + 47 pre-round rows green; 34 new mutants (17 ALV, 10 FC03, 5 FC01 check, 2 host tier via an
  ESM load hook): 26 killed, 2 equivalent with proof, 5 live on inputs not shown reachable (debts), 1 live with a specified difference
  at the card on an in-rule input (z09, "EVERY"): blocker, one FC12 row to close.
- Went well: one exactly-once overlay preload plus a load hook for the ESM host file made the host tier mutable for the first time
  (h01/h02 killed by 11 and 9 cells); 88 whole-file runs in about 11 minutes across four shared slots; the builder's numbers reproduced
  cell for cell; c04 proved the new unlock rows' check assertion is real.
- Went badly: the live mutant is again a quantifier the rounds pinned in the singular; three rounds hid one entry at a time and no
  reviewer before this one mutated the filter's cardinality.
- Change next time: when a rule says EVERY, build the two-instance row (two lifts, two entries) before the first review, and mutate
  the quantifier (first-only, last-only, at-most-one) as a standing member of every projection sweep.
- Verdict: REJECT on B-R22L3-1 (one FC12 row, test bytes only; probe red/green shown); B-R22L2-1, D-R22L2-1 and D-R22L2-2 PAID;
  D-R22L3-1..5 named.
