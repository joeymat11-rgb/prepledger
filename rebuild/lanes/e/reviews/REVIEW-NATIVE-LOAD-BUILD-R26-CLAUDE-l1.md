# REVIEW NATIVE-LOAD BUILD ROUND 26 (test rows) - Claude l1

Reviewer: Claude (Opus), commissioned by the Claude Opus 5.5 PM (DECISIONS:849); blind; engine tier
Head: bd7654a798592a7dae421b9d68fec850fb0993d1 (worktree %TEMP%\earned-nlr; scratch %TEMP%\review-nlr-r26-claude-scratch = S)
FC12 rebuild/m4/spec/native-load-options.test.cjs 0c5c1ac40ed5ab5fd237dcb937408b5120d1f0727c582114ca390a9dacc0e88a (671323 B, 299 tests)
FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs ab678260fad0ef66530d0b1080a60ffca45940bfe0f68271aff1876d40146dd3 (165194 B, 68)
Report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md c98bfc9efdced9eff4be2be9b2c87e80c6104b6e6102bb88aef09010f133b7a0
Spec R9.13 7ef8291 extracted by cmd redirection to S\spec.md: eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb

VERDICT: REJECT (test coverage only. The product is byte-identical to bd7654a. All 14 commissioned items are paid: each
reviewer's mutant, rebuilt by me from the reviewer's text, is red on exactly its own round-26 row. But six NEW single-clause
mutants of my own are LIVE on whole FC12 299 and whole FA03 68, each changes a specified outcome on a reachable input, and the
head gives the specified outcome: B-R26C-1..6 below. Rows only; no product byte is owed.)

## Q1. Product bytes and prefix (measured; S\prefix.cjs through pm-run shared)
- git rev-parse HEAD = bd7654a. `git hash-object` equals `git rev-parse bd7654a:<path>` for W/native-load-effects.cjs (dde77100),
  L/source-admission.mjs (85a534d0), E/native-load.cjs (4bfd87c9), W/engine-capture.cjs (662ce020), L/today-bindings.mjs (e30dac1b),
  E/today.cjs, E/writers.cjs, E/progression.cjs, w6 local-source-admission.test.mjs: 9/9 equal. `git diff --name-only bd7654a --
  rebuild/m3 rebuild/m4 rebuild/engine/{native-load,today,writers,progression}.cjs` lists only FA03 and FC12.
- Prefix: %TEMP%\nlr-r26-scratch\pre copies hash to the round-25 values (fa271b9d, d1e7afd0; also report c6de5b23). FC12 660896 B
  is an exact byte prefix of 671323 B; FA03 151338 B of 165194 B. The tails hold exactly 5 and 5 top-level test( calls. CR 0 and
  non-ASCII 0 in both files. No earlier row changed.
- Heads (my runs): FC12 299/299, FA03 68/68, exit 0, "GUARD protected-in-cache: none; refused: none" in every TAP.

## Q2. The 14 items: my own overlays from the reviewers' TEXT, each applied once, whole FC12 and whole FA03
The overlay runner is S\ovr.cjs (CJS compile and string readFileSync) plus S\ovr-esm.mjs (ES modules). I copied the pattern from my
own R25 scratch. Every anchor was checked unique on the product (S\mk.cjs: 36 overlays, 0 bad). No JSON from the author or from
another reviewer was used.
| Item | My clause (file: from -> to) | FC12 | FA03 | red row |
| --- | --- | --- | --- | --- |
| Claude B-R25C-1 H03 | TB :707 `if (answer !== "accept") return refused(...RECORD_INVALID)` removed | 299/299 | 67/68 | 64 R26-HOST-ACCEPT-ONLY |
| Astra L18-B8 M16 | same line -> `if (answer && answer !== "accept") ...` | 299/299 | 67/68 | 64 (same row) |
| Claude B-R25C-2 H02 | TB :710 `if (proposal_id !== held.proposal_id) return refused(...SCOPE_MISMATCH)` removed | 299/299 | 67/68 | 65 R26-HOST-WRONG-PROPOSAL-ID |
| Astra L18-B5 M12 | same test -> `if (false)` | 299/299 | 67/68 | 65 (same row) |
| Claude B-R25C-3 C06 | FC03 :234 movedBase `|| !same(json(ex.forks || []), forks)` dropped | 298/299 | 68/68 | 295 R26-C06-TECHNIQUE-FORK-CONFLICT |
| Claude B-R25C-4 K05 | FC01 :544 whole line `!q.done` -> `q.done !== true` | 298/299 | 68/68 | 296 R26-K05-TRUTHY-DONE-TRANSITION |
| Astra L18-B1 M01 | SA :854 eligibility gains `q.newW<0||` | 298/299 | 68/68 | 297 R26-L18B1-NEGATIVE-TARGET-ALV |
| Astra L18-B2 M02 | SA :857 out-of-P test gains `ex.w===0||` | 298/299 | 68/68 | 298 R26-L18B2-ZERO-W-ALV |
| Astra L18-B6 M13 | SA :857 out-of-P test gains `!Number.isInteger(ex.w)||` | 298/299 | 68/68 | 299 R26-L18B6-FRACTIONAL-W-ALV |
| Astra L18-B3 M08 | TB :700 `loads: ...(v ? v.value : null)` -> `(v ? v.value || null : null)` | 299/299 | 67/68 | 66 R26-HOST-ZERO-LOAD-DISPLAY |
| Astra L18-B4 M09 | TB :700 the `current:` twin, same change | 299/299 | 67/68 | 66 (same row) |
| Astra L18-B7 M15 | TB :701 `reason: offer.reason` -> `reason: null` | 299/299 | 67/68 | 67 R26-HOST-DISPLAYED-REASON |
| Astra L18-B9 M17 | TB :700 `current:` map + `.reverse()` | 299/299 | 67/68 | 68 R26-HOST-VECTOR-ORDER-DISPLAY |
| Astra L18-B10 M18 | TB :700 `loads:` map + `.reverse()` | 299/299 | 67/68 | 68 (same row) |
Every overlay reports as applied in its child (tally columns cjs and esm). FC12 never imports today-bindings and FA03 never reads
the A-LEGACY-VECTOR text, so those pairs are n/a. Each overlay is red on exactly its own round-26 row and on no other row.
The FC03/FC01 overlays reach FA03 and leave it green. The author's plan-d table (report section 3) agrees cell for cell.

## Q3. Spec fidelity of the ten new rows
- Each row cites its clause and uses the reviewer's own input. Every expected value I checked is the specified one, not a
  snapshot: :97, :101, :110, :111, :139, :149, :151, :154, :169, :170, :188, :207, and (iv)/(v). No row would pass for the wrong
  product that its own item names (Q2).
- Host rows run through the genuine durable host: real faultDatabase, reopenAt, genuine handles and proposal IDs, and a real
  commit read back via responsesOf. ZERO-LOAD and VECTOR-ORDER compare the display with the saved issuance's vectors, so a
  display-only mutant cannot pass.
- What the rows still leave open, measured in Q4:
  - R26-C06 pins the technique third of movedBase. The wSets third of the same :165/:207 clause is unpinned (B-R26C-1).
  - R26-HOST-ACCEPT-ONLY pins invalid answers. The DECLINE return shape (:170) is pinned by no cell (B-R26C-3).
  - No host cell answers the second of two displayed offers (B-R26C-2).
- R26-L18B1 correctly makes no card claim, since both sides refuse that day.

## Q4. My own single-clause mutants (22; S\mk.cjs; each against whole FC12 299 AND whole FA03 68; 44 TAPs, GUARD ok in all)
Picked in the least-covered clauses: host respond/project/check (TB), the ALV (SA), FC03 movedBase/holds/landing/refs, and
FC01 step 3, the adoption transition and the landing transition. Probes are print-only tests appended in memory through the
overlay (S\mkprobe.cjs, mkprobe3.cjs, mkprobe4.cjs), run on the head and under the mutant. No worktree byte was written.
| id | clause (file: from -> to) | FC12 | FA03 | status |
| --- | --- | --- | --- | --- |
| N-A1 | SA :856 `!Array.isArray(ex.wSets)` -> `ex.wSets==null` | 298/299 | 68/68 | KILLED (277) |
| N-A2 | SA :857 P bound `x<=ex.w` -> `x<=Math.max(ex.w,q.newW)` | 295/299 | 68/68 | KILLED |
| N-F1 | FC03 :728 overlap refs drop the overlapped spends' refs | 299/299 | 68/68 | LIVE: D-R26C-1 (argued unreachable) |
| N-F2 | FC03 :234 movedBase `|| !same(img('wSets'), f.wSets)` dropped | 299/299 | 68/68 | LIVE: B-R26C-1 |
| N-F3 | FC03 :237 SOURCE_OVERLAP removed from HOLD_CODES | 299/299 | 68/68 | EQUIVALENT (proof 1) |
| N-F4 | FC03 :934 spend close_ref written for a missed debut too | 296/299 | 68/68 | KILLED |
| N-F5 | FC03 :992 undo refusal without `holds.length &&` | 295/299 | 68/68 | KILLED |
| N-F6 | FC03 :780 dependent-of-held test dropped | 298/299 | 68/68 | KILLED (81) |
| N-F7 | FC03 :924 DEBUT_BASIS_UNPROVEN refs lose the accept refs | 295/299 | 68/68 | KILLED |
| N-H1 | TB :718 sameIssued tested against `offers[0]` only | 299/299 | 68/68 | LIVE: B-R26C-2 |
| N-H2 | TB :697 displayed `state:` -> null | 299/299 | 68/68 | LIVE: D-R26C-2 (spec-silent) |
| N-H3 | TB :706 decline returns `{acknowledged:false}` (no dismissed) | 299/299 | 68/68 | LIVE: B-R26C-3 |
| N-H4 | TB :706 `cancel` removed from the dismiss branch | 299/299 | 68/68 | LIVE: D-R26C-3 (ruling first) |
| N-H5 | TB :656 `newest` keeps the OLDEST completion per lift | 299/299 | 29/68 | KILLED (39) |
| N-H6 | TB :657 `normal: e.completion.kind === "normal"` -> `true` | 299/299 | 68/68 | LIVE: D-R26C-4 (reach not shown) |
| N-H7 | TB :686 check refusal code -> constant SOURCE_FRONTIER_UNPROVEN | 299/299 | 68/68 | LIVE: D-R26C-5 |
| N-H8 | TB :549 registrar keeps state.workoutFacts | 299/299 | 68/68 | EQUIVALENT (argument 2) |
| N-K1 | FC01 :565 adoption `ex.topRun = 0` dropped | 299/299 | 68/68 | LIVE: B-R26C-4 |
| N-K2 | FC01 :550 queued debut `gate: reason` -> `gate: null` | 297/299 | 68/68 | KILLED |
| N-K3 | FC01 :256 step 3 `|| Array.isArray(ex.wSets)` dropped | 299/299 | 68/68 | LIVE: B-R26C-5 |
| N-K4 | FC01 :257 `ex.w == null` -> `ex.w === null` | 297/299 | 68/68 | KILLED |
| N-K5 | FC01 :647 landing `ex.own = false` dropped | 299/299 | 68/68 | LIVE: B-R26C-6 |
Totals: 9 killed; 11 live (6 blockers, 5 new debts); 2 equivalent.
- Proof 1 (N-F3): a fold issue gets the code SOURCE_OVERLAP only if some path can emit it.
  - Literal codes: FC03 pushes RECORD_INVALID, EFFECT_CONFLICT, COMPENSATION_DESCENDANTS, BASIS_REPAIR_REQUIRED, PLAN_CHANGED,
    PRODUCER_REVISION_ABSENT_APPLIED and DEBUT_BASIS_UNPROVEN, never SOURCE_OVERLAP.
  - Relayed codes: FC03 relays only transition refusals (:777, :807, :936, :945). FC01 throws SOURCE_OVERLAP only at :260 and
    :347, inside evaluate/earn, which no transition calls.
  - The re-evaluation branch (:861) relays only PLAN_CHANGED.
  - So no fold issue carries that code today. It becomes live when FC09/FC10 add one (:176).
- Argument 2 (N-H8): the fold state's workoutFacts is json(args.workoutFacts) (FC03 :93). The real registrar also receives
  `workoutFacts` and returns it beside the state (W/source-projection.cjs:51, :58), so the extra copy inside the state has the
  same content. This is not a proof for every downstream reader.

## BLOCKING (each LIVE on whole FC12 299 and whole FA03 68; each a measured head/mutant difference; the head is right)
- B-R26C-1 (N-F2; FC03 :234)
  - Spec: :165 UNPROVABLE ORDER ("when the reconstructed base's w/wSets/technique ... differs from an accepted effect's recorded
    base_load ... EFFECT_CONFLICT for THAT LIFT only, refs = the accept's response_refs, field 'load_basis'") and :207.
  - Input: landingScenario's yes fx-resp-1 (DEBUT 105, issued over wSets ABSENT and w 100), folded over F0 {wSets [100,100,95]}
    with w unchanged; and again with {wSets null}.
  - Head, R1 and R2: issues [[EFFECT_CONFLICT, load_basis, fx-press]]; queued 105 pending; spent 1; registered card
    [null,null,null] (the baseline ask).
  - Mutant R1: issues [] and the yes applies; the registered card THROWS ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED, so the whole
    day is refused. Mutant R2: only PRODUCER_REVISION_ABSENT_APPLIED.
  - Reachable: same footing as R4-N24 and R26-C06 (a re-admitted base; the athlete cannot write wSets,
    plan-edit-commands.cjs:46).
  - Row owed: R26-C06's assertions on a wSets-moved base, R1 and R2. Evidence: S\out\probe-head.txt, probe-F2.txt.
- B-R26C-2 (N-H1; TB :718)
  - Spec: :149 ("the host re-evaluates ... checks the ENTIRE issued body ... Stale means STALE_OFFER"); :97. Each displayed
    offer is a genuine one: r2 is derivable per :156.
  - Input: genuine durable host. demo-press steps [40,45,50,55,60]; D1 and D2 trained with effort '3+'. The host on D2
    displays two offers, [earn PROPOSED [50,50], earn DEBUT [45,45]]. Accept the SECOND with its own handle and ID.
  - Head: acknowledged true, 1 response, queue [[DEBUT,45]].
  - Mutant: acknowledged false, NATIVE_LOAD_STALE_OFFER, 0 responses. The athlete's yes to a displayed, current offer is lost.
  - Row owed: an FA03 cell that answers each of the two offers. Evidence: S\out\probeh-head.txt, probeh-H1.txt.
- B-R26C-3 (N-H3; TB :706)
  - Spec: :170 "Host decline returns {acknowledged:false,dismissed:true} without staging"; :101.
  - Input: the genuine adopt-observed offer [45,45] (r26Offer 'observed'), answered 'decline'.
  - Head: {acknowledged:false, dismissed:true}, 0 writes. Mutant: {acknowledged:false}, 0 writes.
  - No cell asserts the decline return. It is reachable from the "Not now" button (today-entry.mjs:288).
  - Row owed: the exact decline result and 0 responses.
- B-R26C-4 (N-K1; FC01 :565)
  - Spec: :150 "At accept/adoption it ... clears native run/anchor caches and begins a new authority/tenure"; topRun is a
    FieldImage field (:110).
  - Input: F0 {topAt 100, topRun 2}; C1 performed at 95 on the 100 card; its adopt-observed yes.
  - Head: w 95, topAt null, topRun 0. Mutant: w 95, topAt null, topRun 2.
  - Durable effect: the next adopt-observed (C2 at 90) issues base_load.fields.topRun value 0 on the head and value 2 under the
    mutant, so a different issuance (prop-b80eda6a9cc vs prop-8a1d9e94dd1).
  - Reachable: admitted old-app states carry topRun, which classic earn writes (E/earn.cjs:36-37).
  - Row owed: the adopted state's topAt and topRun. Evidence: S\out\probe-K1.txt, proben-*.txt.
- B-R26C-5 (N-K3; FC01 :256)
  - Spec: :144; :150 ("An array wSets still refuses VECTOR_ADOPTION_UNDEFINED (:144; FC01:540)"); :152 ("a vector plan refuses
    VECTOR_ADOPTION_UNDEFINED (:144)"); :199.
  - Input: F0 {wSets [100,100,95]}; C1 captured [100,100,95], performed 95 on every set; check.
  - Head: refused VECTOR_ADOPTION_UNDEFINED [C1 Close Ref], no offer.
  - Mutant: offers adopt-observed [95,95,95]. Its yes folds to a VECTOR_ADOPTION_UNDEFINED issue, spend kept, nothing applied:
    a consent that can never apply.
  - Rows cover unequal loads only (N11, N30, the [100,95,95] case).
  - Row owed: this check. Evidence: S\out\probe-head.txt, probe-K3.txt.
- B-R26C-6 (N-K5; FC01 :647)
  - Spec: :153 "At qualified landing ... last from performedLine, own=false,std=null".
  - Input: the N05 landing (landingScenario; C3 lands 105) over a base with own absent and over a base with own true; R1 and R2.
  - Head: own false, std null every time. Mutant: own ABSENT and own true respectively.
  - Durable effect: the next adopt-observed (C4 at 100 on the 105 card) issues base_load.fields.own {present:true,value:false}
    on the head vs {present:false} under the mutant (prop-debba15ff25 vs prop-137784713fd).
  - N05 asserts w, wAt, last and the queue, not own/std.
  - Row owed: own false and std null after the landing. Evidence: S\out\probe-K5.txt, proben-*.txt.

## NAMED DEBTS (new; none blocks alone)
- D-R26C-1 (LOW; N-F1): the fold's own overlap refusal (FC03 :728) drops the overlapped spends' refs under the mutant, but it
  looks unreachable for host-issued records:
  - :651-652 conflicts every same-lift pair of groups with shared consumes before any event.
  - Consumed roots carry the lift ([start, lift, close]).
  - So a spent entry and a later non-conflicted body never overlap. Only an external record could reach it (ADMISSION GATE).
- D-R26C-2 (LOW; N-H2): the displayed candidate `state` (PROPOSED/DEBUT) is pinned by no host cell. view() carries it; the
  panel does not render it; the spec names no display of it.
- D-R26C-3 (ruling first; N-H4): respond(answer 'cancel').
  - Head: {acknowledged:false, dismissed:true}. Mutant: RECORD_INVALID. Both write nothing.
  - :97 lists answer 'accept'|'decline'; :101 says cancel only dismisses the view. Whether cancel is a respond answer is open.
- D-R26C-4 (LOW-MED; N-H6): project().lifts[].normal is never false in any cell.
  - The controller's check targets and its Undo "newest" completion both filter on it (today-entry.mjs:201, :227).
  - I did not build a non-normal Close through the host, so no measured difference is claimed.
- D-R26C-5 (LOW; N-H7): check() relays project()'s refusal code. Under the mutant a closed host's check says
  SOURCE_FRONTIER_UNPROVEN instead of NATIVE_LOAD_CAPABILITY_REQUIRED (probe: head [refused, CAPABILITY_REQUIRED, 0], mutant
  [refused, SOURCE_FRONTIER_UNPROVEN, 0]). Fail-closed either way; :188's code. It joins D-R25C-1: one cell can assert both.
- HELD, not a blocker, as ruled: D-R25C-5 / the moment-only re-issuance (:149 vs :172), pending a spec clarification after S11.
- CARRIED unchanged (report Round 26 section 8, the full list is there): D-R25C-1..-4; the re-measured H12, H14, H15 (D-R24-F-3
  half, S24-H05, D-R24-O-3); Astra D-L18-M11, D-L16-T11, D-L16-T14, D-L18-BYTES, D-L18-PRIOR; Fable D-R24-F-2..-5; Claude
  D-R24-O-1..-5; the D-S24-* and D-L17-* set; D-L12-ISSUANCE, D-L14-HOST-MUTANTS, D-L13-TYPED-C2, D-R13-LEGACY-OVER-NULL-ASK,
  D-R13L1-3, D-R13L1-2, D-L14-RECOVERY, D-L12-CUSTODY, D-L12-CONFIG, D-L14-CALIBRATION, D-L14-CI, D-L14-OWNER,
  D-L15-EQUIVALENCE, and the multi-entry capture NAMED LIMIT.

## Q5. Property walks (head; new seed ranges; _ALL=1, so no early stop; S\plan-w.txt)
- R8 propertySequence8, seeds 26261001..26262800 in three shards of 600 (s1 26261001, s2 26261601, s3 26262201): 0, 0, 0
  counterexamples; union 1800 seeds, 0.
  - Coverage (s1/s2/s3): train 2315/2330/2332, capture-card 2753/2876/2759, capture-ask 911/816/924, legacy 266/248/278,
    reopen 252/277/290, undo 593/555/578, effect:adopted 221/228/214, effect:queued 161/143/121.
  - Also: missed-consumed 15 (s1), issue:EFFECT_CONFLICT 94/-/114, issue:RECORD_INVALID -/-/47 (S\out\walk8-s*.json).
- R7 walk, seeds 26263001..26264000 (1000): 0 counterexamples (train 2964, undo 497, reopen 521, effect:landed 7, effect:missed
  1, EFFECT_CONFLICT 37).
- Every walk TAP: 1/1 pass, GUARD none/none. The walk did not reach B-R26C-1..6: its generator uses a fixed base shape per run
  (no moved wSets, no topRun, no own) and a host with a single offer.

## Q6. Owed
- Six rows (test bytes only), each red first under its mutant, then a re-read:
  - FC12: B-R26C-1 (wSets-moved base, R1/R2), B-R26C-4 (adoption clears topAt/topRun), B-R26C-5 (equal loads on a vector
    plan refuse VECTOR_ADOPTION_UNDEFINED), B-R26C-6 (landing writes own false, std null).
  - FA03: B-R26C-2 (answer the second of two offers) and B-R26C-3 (decline returns dismissed true, 0 writes).
- Unchanged and not run here: the w6 admission cells and the local-source-commit/-consumer suites (CI only, STOP-R21B-1); the
  80-file set (exclusive); exact-head Windows/Linux CI; protected conformance; successor pins/receipts; seal custody; every
  owner gate.

## What I did not verify
- The builder's round-24 160-mutant sweep and its 48-overlay kill table were not re-run by me. I ran only my 14 + 22.
- D-R26C-4 (non-normal Close through the host) was argued, not executed. D-R26C-1's unreachability and N-H8's equivalence are
  arguments from code, not proofs over every input.
- B-R26C-4 and -6 are measured on FC12 synthetic states. That admitted old-app data carries topRun or own true is taken from the
  classic engine's writers (read statically), not from any real data.
- Old-app src is not readable here; reachability is judged over the readable rebuild writers and the spec's named classes.
- Disclosures:
  - Runner and overlay code were copied from my own R25 scratch (ovr.cjs, ovr-esm.mjs, run.ps1, tally.cjs, walksum.cjs); no
    mutant JSON was reused.
  - Read only: my R25 review file and scratch; Astra's L18 review file (commissioned); the author's pre\ copies (hash and prefix
    only). No other R26 review or scratch was opened; I did not look for the Fable reader's file.
  - Every node run went through node %TEMP%\pm-run.cjs shared (jobs claude-r26-prefix, -mk, -l1-ab, -l1-q, -l1-h, -l1-n), ONE
    slot, chained by done markers. No lock file was touched by hand.
  - The author's Round 26 section was read LAST, after every measurement above; its tables agree with mine.
- Protected five, src/, ledger, conform/private, soak and prepledger-dev paths were never read, listed, grepped or loaded.
  - Content greps named explicit product files, or rebuild/m3/w6, rebuild/m4 and rebuild/m3/w7-preview with node_modules,
    soak, ledger, private and test paths excluded.
  - Engine greps listed rebuild/engine/*.cjs names with the five filtered out by name before any content was read.
- No commit, push, stage, fetch or DECISIONS write. This is the only file written in earned-nlr.
