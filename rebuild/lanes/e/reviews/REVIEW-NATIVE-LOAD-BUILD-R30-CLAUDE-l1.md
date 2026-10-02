# REVIEW NATIVE-LOAD BUILD round 30 (engine tier)

Reviewer: Claude (Opus), commissioned by the Earned PM (DECISIONS:860); blind; engine tier
Object (worktree %TEMP%\earned-nlr, HEAD bd7654a798592a7dae421b9d68fec850fb0993d1, uncommitted), sha256 measured on disk, all equal to the brief:
- FC01 rebuild/engine/native-load.cjs 68a04bb6ac39268185181629f2f91cc516c8b9f82fdb3bc6bb5b081fb66fbc9f
- FC03 rebuild/m4/workout/native-load-effects.cjs 33934b9cc5692c87344f67c12bdf121e75beb942e9b43dc4cb361d6323fca640
- FC12 rebuild/m4/spec/native-load-options.test.cjs 647dbe8e96962bd453b70c3a2ac268a8cb60094f702e83c491dda6d5169040ac (410)
- FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs 31e175bab8c09d5f7ab5d6d576bc1224f41ff5d194657c04d802b9a193f3be5b (95)
- report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md c972816ab3eb03e86c940e9d7a4cc6fd47c5e615c7651c6871325e7f8ea9bcab
- builder U report %TEMP%\nlr-r30u-scratch\R30U-REPORT.md 8f9a3284d9026cfab0ce6ebbba8d599725ff68860972ec65735a89deda32d8cf
- spec R9.13 (cmd /c git show 7ef8291:rebuild/coach/NATIVE-LOAD-SPEC.md) eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb

VERDICT: REJECT (B-R30C-1 product; B-R30C-2 and B-R30C-3 rows; each with executed input and output below; D-R30C-1..6 named)
REQUIRED CHANGE: yes

Method: every run via node %TEMP%\pm-run.cjs shared (job names rev30c-*), TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03, nlr-build guard.cjs and
deps-loader.mjs, overlays in memory via NLR_OVERLAY / NLR_ESMOVERLAY (my run30.ps1 = nlr-r30-scratch\run30.ps1 with only the scratch path changed);
every TAP carries "GUARD protected-in-cache: none; refused: none" and each child reports its overlay "applied 1". Probes are print-only tests appended
IN MEMORY to FC12 (probe.js, probe2.js) and FA03 (probe3.mjs). Scratch %TEMP%\review-nlb-r30-claude-scratch (mut\RC-01..24.json, out\*.txt, tally.ps1).
Baseline on the object bytes: FC12 410/410 (out\base-fc12), FA03 95/95 (out\base-fa03). Reports and the round-29 reads were read after my own
product read and my first mutant/probe runs. Fixture numbers are invented; R1 = present revision, R2 = absent.

## BLOCKING
B-R30C-1 PRODUCT (a record still takes the whole fold down; same class as B-R29F-1/L20-B2, which :856 (1) (b) ruled "no record may make the fold or
  check throw"). Input: r30fx().one (one lift), fx-press's genuine earn re-issued and re-digested (r27forge) with body.basis.load_basis.sets = N, R2.
  Output (probe RVC-SETS): N=1e5 -> RECORD_INVALID base_load in 12 ms; 1e6 -> 121 ms; 1e7 -> 1110 ms, and fx-row's check on the two-lift fixture
  1183 ms (R1 the same); N=1e8 -> foldNativeLoad never returns: "FATAL ERROR: Ineffective mark-compacts near heap limit ... JavaScript heap out of
  memory", exit 134 after 10.8 s (out\p2-sets1e8.txt). Cause: the validator leaves load_basis.sets unchecked (its DEPTH note: a value for DERIVABLE),
  S1-S8 never read it, and FC01 derivable (:481-:485) builds wantVector of length max(1, sets) BEFORE comparing it with base_load.vector.
  Containment cannot catch an OOM. The host projects on every boot, so one such record in the local log loses every lift every day.
  Spec: :156 (c2) (base_load must EQUAL the projection of length max(1, sets)); :155 per lift; :175. Reachability: a hand-built record in the
  installation's own log, the same vocabulary as B-R29F-1. Fix (small): in FC01 derivable refuse base_load when base_load.vector.length is not
  max(1, sets) (with sets read as today) before any allocation (an FC01 byte: the revision moves again), or an FC03 validator bound derived from
  (c2); row: this input at 1e8, red first.
B-R30C-2 ROWS (today-entry.mjs native-load region; genuine use). Mutant RC-21: decline's `set({ ...view, offers: view.offers.filter(o => o.proposalId
  !== proposalId) })` -> `set({ ...view })`. FA03 95/95 LIVE. Input (probe RVC-NOTNOW, R30-L20B10's own fixture): w 40, D1 two sets at 45, real panel,
  Check next weight, click the adopt-observed card's real Not now. Head: press cards rendered [], view offers [], responses 0. Mutant: press cards
  ["adopt-observed"], view offers ["adopt-observed"], responses 0 (the button does nothing visible). Spec :101 "Native decline/Not now and cancel only
  dismiss the view". R30-L20B10 re-checks before it looks, so it cannot see this. Fix: assert no press card right after the click.
B-R30C-3 ROWS (the round's own field and R1 = R2 contract, :856 (1) (b); forged records). (a) RC-01 isLoad without `x.unit === 'lb' &&`: FC12
  410/410. Input: one-lift earn re-issued with target_load.vector[0] (or .scalar) = {value, unit:'kg'}. Head: RECORD_INVALID target_load under R1 and
  R2. Mutant: R1 issuance, R2 decision.target_load (R1 != R2). Spec :110 Load {value,unit:'lb'}, :156 "field target_load". (b) RC-07 edits
  `every(isRef)` -> `every(map)`: 410/410. Input: set edits [{op_id}] (no commitment). Head evidence (R1, R2); mutant consumes (R1, R2); the round's
  answer to D-R29F-4 is S4 evidence. Fix: three cases in R30-RECORD-DEPTH (out\p2-pf-head, p2-pf-RC-01, p2-pf-RC-07).

## Q1 PRODUCT (measured)
- Other product files: git diff --name-only bd7654a -- rebuild = FC01, FC03, FC12, FA03, report only; today-entry.mjs, today-bindings.mjs unchanged.
- FC01 hunk: one refusal line plus three comment lines; no string literal but 'adopt-observed', 'RECORD_INVALID', 'base_load'; every template,
  reason and copy string byte-identical. It refuses exactly c3's case (adopt-observed over a w that is not a finite number) and nothing c3 allows:
  RC-15 (hunk disabled) is killed by R28B-CONFIGURATION-CAPTURE, R30-L20B1 (FC12) and R30-L20B1-HOST (FA03); RC-14 (`Number.isFinite` dropped) is
  EQUIVALENT (w is never NaN/Infinity: JSON base, writers' finite newW (:358) and step-3 finite loads, no athlete op writes w). Refs [] with field
  base_load mirrors the SUPPORTED-wSets issuance refusal; :185 is silent for this case (D-R30C-6).
- Validator: I found no genuine record it refuses. Every producer emits exactly its member sets (FC01 evidenceOf :130-:138, baseLoad/fieldImage
  :119-:130, loadOf :116, candidate :360; FC03 basisOf :305-:327, exit and missed authority_refs fills); every op carries a text commitment
  (client/ops.cjs:76). Genuine controls green: base FC12 and FA03, fuzz controls. What it lets through: B-R30C-1 (sets), D-R30C-3 (value domains).
- Containment: the catch restores state, issues, spent and the books; RC-08 (issues not restored) and RC-11 (landing `judging` dropped) are
  killed by R30-CONTAINMENT; RC-09/RC-10 are the builder's V45/V43 (below). Other lifts stay exactly as without the record (fuzz 1000 default seeds,
  R30-CONTAINMENT). One oddity: D-R30C-2.
- PRODUCER_REVISION: recomputed from the 14 engine files by my rev.cjs: 51730efcd11d615e88e409c664a425af4e4aa7fbcf9d7b136c29c44f939ec06c = the
  constant; R2-REVISION green. The FC01 hunk is an ISSUANCE change in an engine file, so the move is due (N (ii)); consequence as the report states
  (:155): 1d7dbe40 records apply from their body after structural checks, S1-S8 and DERIVABLE, with PRODUCER_REVISION_ABSENT_APPLIED (R2 rows).

## Q2 THE ROUND-29 ITEMS (re-applied)
- Round-29 mutants on the head product: I re-ran the builder's 18 overlays (my C03 C05 C10 C11 C13 C14 C15 C16, Fable M02 M03 M04 M08 M11 M12 M13
  M15, Astra L20-M07 L20-M10) over its in-memory head restore under the final FC12 (pattern ^R30,^R28B-CONFIGURATION; out\rm-head-*): head 10/18
  (8 R30 rows red), each mutant 9/18 = the head's 8 plus exactly one R30 row (BASIS-CONTAINERS, BASE-LOAD-AND-LOAD-BASIS-NULL, AUTHORITY-REFS,
  EVIDENCE-ITEMS-PRESENT-REVISION or ORDER-SHAPES as the report's table f says). 18/18 killed, reproduced.
- Their inputs on the final product: B-R29C-1/B-R29F-1/L20-B2 (edits 5, {}, true, [null]) green in R30-EDITS-NOT-ITERABLE; D-R29C-2 paid: R1 = R2 on
  every shape case I probed (profile, spend_id, consumes, evidence, basis, Refs, units: out\p2-pf-head); D-R29F-5 contained, not fixed: a genuine
  Undo folded with workoutFacts undefined/null no longer throws, the fold refuses fx-row and fx-press RECORD_INVALID consumes and the Undo payload
  (RVC-NOFACTS). D-R29C-1/D-R29F-3 remainder carried (D-R30C-3).
- Astra L20: U30-M01..M06 (= L20-M01..M06) on the joint FA03: 6/6 KILLED (94/95, 94/95, 92/95, 94/95, 94/95, 94/95; the cells U's report names).
  L20-B1 is green on genuine use: R30-L20B1-HOST-CONFIGURATION-NO-ADOPTION drives the durable host (BW card, two sets at 45: no offer, no lost
  acknowledgement) and FC12 R30-L20B1 accepts every minted offer under R1 and R2 and folds it; both green on the object.
- R28B-CONFIGURATION-CAPTURE: the first assertion (never PLAN_CHANGED) is unchanged; the old second assertion pinned the offer c3 forbids; the new
  one pins the exact tuple ['refused', [], {RECORD_INVALID, [], base_load}]. A correction to the spec's outcome and strictly stronger, not a weakening.

## Q3 SPEC FIDELITY OF THE NEW ROWS AND CELLS
- FC12 R30-*: each asserts a spec outcome (RECORD_INVALID with the owning field, nothing applied, other lift unchanged, R1 = R2), both fixtures,
  both revisions. Exceptions: R30-CONTAINMENT's landing case pins a state :155 does not allow (D-R30C-2); R30-L20B1 and the corrected row pin
  refs [] (D-R30C-6). Gaps: B-R30C-3 (no unit-'kg' Load case, no Ref-shaped-map edit case).
- Fuzz: the schema is the builder's reading of :101-:120 and shares the validator's blind spots by construction ('any' members are never mutated,
  so sets/hi/source_member are out of reach: B-R30C-1, D-R30C-3); its assertions (never throw, RECORD_INVALID for the record, nothing applied,
  other lift and its check equal the control) are the right ones and load-bearing: RC-02, RC-03, RC-04, RC-05 are killed ONLY by the fuzz at the
  default 1000 seeds (seeds 20301069, 20301326, 20300931, 20300981 in my TAPs). It does not assert the field (B-R30C-3 slips through).
- FA03 R30-L20B* cells: genuine installation, real Today entry, gym model training, JSDOM panel, real button clicks, durable ops read back; they
  drive the genuine host and the rendered panel. L20B10 misses the dismissal (B-R30C-2).

## Q4 MY MUTANTS (24, single clause, in memory; FC03/FC01 on whole FC12 (walks, fuzz at defaults), FC01 also FA03, today-entry on whole FA03)
| id | clause | result | class |
|---|---|---|---|
| RC-01 | isLoad: drop unit 'lb' | 410/410 LIVE | B-R30C-3 (a) |
| RC-02..05 | isWrapper (present or value null) dropped; candidate kind 'debut' dropped; coverage text(commitment) dropped; wrappers only w, wSets | each killed by R30-FUZZ only | killed |
| RC-06, 12, 13, 23 | basis extra-member test; kind/reason_key pairing; consumes every(text); current exact members -> map | killed R29-H04-BASIS-MEMBERS, R30-DECISION-MEMBERS-PRESENT-REVISION, R30-RECORD-DEPTH, R30-CURRENT-SHAPE | killed |
| RC-07 | edits every(isRef) -> every(map) | 410/410 LIVE | B-R30C-3 (b) |
| RC-08, 11 | catch: issues not restored; landing `judging = g` dropped | killed R30-CONTAINMENT | killed |
| RC-09 | catch: stale repair/held kept | 410/410 LIVE | EQUIVALENT (= D-R30-V45, proof Q5) |
| RC-10 | catch: state not restored | 410/410 LIVE | EQUIVALENT (= D-R30-V43, proof Q5) |
| RC-14 | FC01 hunk: drop Number.isFinite | 410/410, 95/95 LIVE | EQUIVALENT (proof Q1) |
| RC-15 | FC01 hunk disabled (ex.w == null) | killed FC12 x2, FA03 L20B1 | killed |
| RC-16, 17 | route B checks every lift, not the Close's; route B also lists Undo offers | 95/95 LIVE | D-R30C-4 |
| RC-18, 20 | notices: drop !superseded_by; Undo saved copy -> saved | killed N27 (b), R4-D9 | killed |
| RC-19, 22 | after a yes keep the lift's other offers; adoption heading ": next weight" | 95/95 LIVE | D-R30C-4 |
| RC-21 | Not now keeps the view | 95/95 LIVE | B-R30C-2 |
| RC-24 | catch refs: first op only (alt dropped) | 410/410 LIVE | D-R30C-5 |

## Q5 THE BUILDER'S OPEN POINTS
- S27-P405/P407/P408/P409/P413/P429 (probe RVC-PFIELD, one-lift earn, R1/R2, out\p2-pf-*): under every one nothing applies (w 100, queue [],
  RECORD_INVALID for fx-press only), so FIELD-ONLY is right. "Spec-silent" is not: spend_id 5 is an S2 failure (:155 names field spend_id), and the
  validator's own ownership rule names 'decision' for profile 'x' and lift_lineage_id/evidence for consumes 'x'/evidence {}; the head's
  pre-validator 'decision shape' check says payload for all of them, and P405/P407/P413 turn R1 = R2 into R1 issuance vs R2 decision/spend_id.
  P429: a well-formed edit Ref with a forged commitment is 'consumes' on the head, 'evidence' (S4) under the mutant. No row can pin the head's
  field as the spec's: a product field ruling, D-R30C-1.
- D-R30-V43-V44 and D-R30-V45: I agree, EQUIVALENT on every reachable input (my RC-10 and RC-09 are the same clauses, LIVE 410/410). Proof: the
  catch runs only on an unexpected exception (none known after the validator: fuzz 1000, my probes); inside an accept event every `state =`,
  spent.push and book write that precedes a possible throw is either rolled back or keyed by the refused record's spend, which then has no queue
  entry and whose lift is held log-ordered, so later records are `behind`; two pending native entries of one lift need FC01's transition to
  skip TARGET_QUEUED or a forged base.
- V28/V29: agree EQUIVALENT: under RC-01 a base_load vector unit 'kg' still refuses base_load R1 and R2 (DERIVABLE c2), measured.

## Q6 NEW, AND NAMED DEBTS
- D-R30C-1 the structural 'decision shape' pre-check field (payload) disagrees with S2 and the validator's ownership rule (Q5); rule and pin.
- D-R30C-2 a contained LANDING throw leaves the refused record applied: issues [RECORD_INVALID payload fx-resp-0], queue DEBUT 105 pending,
  spent keeps fx-resp-0, effects [queued fx-resp-0]; registered projection w null, entry hidden (RVC-LANDING-THROW). :155 RECORD_INVALID
  means nothing applied; R30-CONTAINMENT pins this state. Reachable only through an unexpected exception.
- D-R30C-3 value domains the validator leaves to no clause, applied silently (one-lift earn, RVC-DEPTH): coverage source_member 5,
  disposition 5, coverage reversed (:118 "sorted"), technique forks 'x', technique/order extra member, tenure_start 7, hi 'x', prefix 'x':
  applied, no issue, R1 and R2; order.frontier 'x' and effect_frontier [{spend_id:'x'}]: R1 issuance, R2 applied (D-R29F-3, D-R29C-1 remainder).
  Inert today (the applied effect equals the genuine one); sets is not inert (B-R30C-1).
- D-R30C-4 today-entry region LIVE without a constructed input: RC-16/RC-17 need a Close that omits a lift with an unanswered offer or held
  spend (FA03's demo programme trains both lifts every day; :356 "check completed lifts"), RC-19 two alternatives of one lift, RC-22 the
  adoption heading. For the hosted sweep's today-entry pass.
- D-R30C-5 RC-24: the containment refs of a compensation group with alt records are unpinned (:155 refs = the record's response Refs).
- D-R30C-6 the c3 check refusal is RECORD_INVALID refs [] field base_load; :185 gives judged-completion refusals [Close Ref]; spec silent; ruled
  implicitly by :856 (1) (a); the rows pin the builder's tuple.

## NOT VERIFIED
- The hosted sweep of the joint bytes, the 80-file set, any browser/phone harness; the protected five (never read, loaded or run).
- The builder's tables b, c, d, e, h were not re-run (I re-ran table f, the six U30 overlays, the baseline and my 24 mutants); the extended fuzz
  shards and the R7/R8 walks beyond FC12's defaults were not run.
- B-R30C-1 was measured on the fold (FC12 fixture), not through the durable host or a browser tab; the 1e8 crash is at node's default heap.
- RC-16/17/19/22 reachability in FA03 (D-R30C-4) was argued, not constructed.
- Disclosure: once, about 6 s at 20:29, my probe plan p1 held a second shared slot while m1 ran (two slots); every other run used one slot.
- Nothing committed, staged or pushed; DECISIONS/STATUS untouched; only this file written in the worktree.
