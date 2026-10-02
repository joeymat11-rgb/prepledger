# REVIEW: NATIVE-LOAD build round 26 (test rows only, on rounds 22-25) - Fable l1

Reviewer: Claude Fable, commissioned by the Claude Opus 5.5 PM (DECISIONS:849); blind; engine tier
Head: bd7654a798592a7dae421b9d68fec850fb0993d1 (worktree %TEMP%\earned-nlr; scratch %TEMP%\review-nlr-r26-fable-scratch = S)
FC12 rebuild/m4/spec/native-load-options.test.cjs sha256 0c5c1ac40ed5ab5fd237dcb937408b5120d1f0727c582114ca390a9dacc0e88a (671323 B, 299 tests)
FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs sha256 ab678260fad0ef66530d0b1080a60ffca45940bfe0f68271aff1876d40146dd3 (165194 B, 68)
Report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md sha256 c98bfc9efdced9eff4be2be9b2c87e80c6104b6e6102bb88aef09010f133b7a0
Spec R9.13 7ef8291 extracted by cmd redirection to S\spec.md: eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb

VERDICT: REJECT (test coverage only; the product is byte-identical to bd7654a and gives the specified result on every input I
evaluated; all 14 commissioned items ARE paid, each by its own row; two NEW live single-clause mutants of my own change a
specified, reachable fold outcome and no row catches them: B-R26F-1 (FC01 :544 transition STRUCTURAL set) and B-R26F-2
(FC03 :234 movedBase wSets image); rows only, no product byte)

## Q1. Product bytes and prefix (measured)
- `git hash-object` of each working file equals `git rev-parse bd7654a:<path>`: FC03 W/native-load-effects.cjs (dde77100),
  L/source-admission.mjs (85a534d0), FC01 E/native-load.cjs (4bfd87c9), W/engine-capture.cjs (662ce020), L/today-bindings.mjs
  (e30dac1b), E/today.cjs (ba8629c3), E/writers.cjs (a6a357d4), E/progression.cjs (7eea7ee9), w6 local-source-admission.test.mjs
  (1ffbba4f): 9/9 eq=True. `git diff --name-only bd7654a -- rebuild/m3 rebuild/m4 rebuild/engine/{native-load,today,writers,
  progression}.cjs` lists only FA03 and FC12. Untracked under rebuild/lanes/e/reviews: the R22-R26 review files only.
- Prefix (S\prefix.cjs, byte compare against %TEMP%\nlr-r26-scratch\pre\, whose sha256 I verified equal to the round-25 hashes
  fa271b9d / d1e7afd0): FC12 660896 B is an exact prefix of 671323 B (firstDiff -1), FA03 151338 B of 165194 B (firstDiff -1).
  The tails hold exactly 5 and 5 top-level test( calls; CR 0 and non-ASCII 0 in both files. No existing row changed.
- Heads (my runs, S\out\fc12-head.txt, fa03-head.txt): FC12 299/299, FA03 68/68, exit 0, GUARD protected-in-cache: none;
  refused: none. Every run below went through node %TEMP%\pm-run.cjs shared (jobs fable-r26-l1-job1/-job3, ONE slot, chained).

## Q2. The 14 items: my own overlays from the reviewers' TEXT, applied once (in memory), whole FC12 and whole FA03
Overlay: my R25 fov.cjs/fov-esm.mjs (CJS compile + readFileSync hook, ESM load hook; every anchor must occur exactly once in the
product, S\mkmut.cjs checked 29 anchors, 0 bad). n/a = the suite never loads that file. Each overlay is red on exactly its own
round-26 row and on no other row; the FC03/FC01 overlays reach FA03 and leave it 68/68.
| Item(s) | My clause (file: from -> to) | FC12 | FA03 | red row / first failing assertion |
| --- | --- | --- | --- | --- |
| Claude B-R25C-1 H03 | TB :707 `if (answer !== "accept") return refused(RECORD_INVALID)` dropped | n/a | 67/68 | R26-HOST-ACCEPT-ONLY: earn answer "yes" -> {acknowledged true, op_id ...-13}, 1 response |
| Astra L18-B8 M16 | TB :707 `if (answer && answer !== "accept")` | n/a | 67/68 | same row: earn answer undefined -> acknowledged true |
| Claude B-R25C-2 H02 | TB :710 `if (proposal_id !== held.proposal_id) return refused(SCOPE_MISMATCH)` dropped | n/a | 67/68 | R26-HOST-WRONG-PROPOSAL-ID |
| Astra L18-B5 M12 | TB :710 `if (false)` | n/a | 67/68 | same row: prop-0000000000000000 -> acknowledged true, 1 response |
| Astra L18-B3 M08 | TB :700 `loads: ... v.value` -> `(v.value \|\| null)` | n/a | 67/68 | R26-HOST-ZERO-LOAD-DISPLAY: [null,null] vs [0,0] |
| Astra L18-B4 M09 | TB :700 `current: ... v.value` -> `(v.value \|\| null)` | n/a | 67/68 | same row (B4 half) |
| Astra L18-B7 M15 | TB :701 `reason: offer.reason` -> `reason: null` | n/a | 67/68 | R26-HOST-DISPLAYED-REASON: null vs the saved sentence |
| Astra L18-B9 M17 | TB :700 `current: ...map(...).reverse()` | n/a | 67/68 | R26-HOST-VECTOR-ORDER-DISPLAY: [35,40] vs [40,35] |
| Astra L18-B10 M18 | TB :700 `loads: ...map(...).reverse()` | n/a | 67/68 | same row: [40,45] vs [45,40] |
| Claude B-R25C-3 C06 | FC03 :234 `\|\| !same(json(ex.forks \|\| []), forks)` dropped | 298/299 | 68/68 | R26-C06-TECHNIQUE-FORK-CONFLICT: issues [] vs [[EFFECT_CONFLICT,[fx-resp-1],load_basis,fx-press]] |
| Claude B-R25C-4 K05 | FC01 :544 `!q.done` -> `q.done !== true` | 298/299 | 68/68 | R26-K05-TRUTHY-DONE-TRANSITION: [[LEGACY_PENDING,queue]] vs [] |
| Astra L18-B1 M01 | SA :854 `q.newW<0\|\|` added | 298/299 | n/a | R26-L18B1-NEGATIVE-TARGET-ALV: newWSets undefined vs [-5,-10,-15] |
| Astra L18-B2 M02 | SA :857 `ex.w===0\|\|` added | 298/299 | n/a | R26-L18B2-ZERO-W-ALV: named [{fx-press,debut,5,0,[0,-5,0]}] vs [] |
| Astra L18-B6 M13 | SA :857 `!Number.isInteger(ex.w)\|\|` added | 298/299 | n/a | R26-L18B6-FRACTIONAL-W-ALV: named [{... 105.5, 100.5, ...}] vs [] |
14 items, 14 overlays, 10 rows: agreed with the author's pairing (one row pays two reviewers' items in four places).

## Q3. Spec fidelity of the ten new rows/cells (each read against S\spec.md, not the report)
- Every cited clause exists at the cited line (:97, :101, :110, :111, :127, :139, :149, :151, :154, :169, :170, :188, :207,
  (iv) :597, (v) :606) and every expected value is the clause's stated outcome for the reviewer's own input, not a snapshot.
- FA03 cells: all five run the REAL durable host (reopenAt + createNativeLoadHost over the faultDatabase repository), genuine
  handles minted by check(), real proposalIds, and re-read the DURABLE proposal-response op (responsesOf) to compare the
  displayed vectors/reason with what was saved (:139). None uses a test seam. Per cell, what else could be wrong and still pass:
  - R26-HOST-ACCEPT-ONLY: pins RECORD_INVALID for 'yes', 'ACCEPT', undefined and ABSENT, with the "0 responses, w 40, no native
    entry" after-image. It does not pin decline/cancel -> {dismissed:true} (:170), which remains unpinned (see FN01 below).
  - R26-HOST-WRONG-PROPOSAL-ID: pins SCOPE_MISMATCH on a live handle with two wrong ids. Correct; closed/cloned rows stay separate.
  - R26-HOST-ZERO-LOAD-DISPLAY: w 0 -> current [0,0], loads [5,5]; yes stores 5; Undo displays loads [0,0], current [5,5] and
    restores w 0 (:154). The vectors are checked against the ISSUED body. A mutant mapping null -> 0 in the same map is NOT
    caught here (both values numeric); it is caught by R4-B10 and N27 (d) (my FN02: 66/68). Fidelity holds.
  - R26-HOST-DISPLAYED-REASON: display reason === saved issuance.reason, nonempty string. Correct.
  - R26-HOST-VECTOR-ORDER-DISPLAY: wSets [40,35] -> current [40,35], loads [45,40], issued vectors equal, queued newWSets
    [45,40]. Correct; a uniform vector could not discriminate, this one does.
- FC12 rows: R26-C06 asserts the :207 tuple (code, refs [fx-resp-1], field load_basis, lift) under R1 and R2 with the entry
  pending, spend kept, w 100, then the retire-only compensation. R26-K05 asserts no LEGACY_PENDING and effects [queued] for done
  1/'yes'/true under R1 and R2 and that the finished entry is untouched. R26-L18B1/B2/B6 use ALV.fn (the product's own bytes
  between the markers, R913-ALV-PRODUCT pins that) and the REAL capture (alvCard) for B2/B6, with an unconverted control that
  refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED first. None would pass for a wrong product on its own item.
- One wording note, not a defect: R26-L18B1's title says "No card claim: both sides refuse that day on the negative load" and
  asserts no card; consistent with D-R13L1-3 CARRIED.

## Q4. My own single-clause mutants (15 new; S\mut-FN*.json; whole FC12 and/or whole FA03; GUARD ok in every run)
| id | clause (file: from -> to) | FC12 | FA03 | status |
| --- | --- | --- | --- | --- |
| FN01 | TB :706 `answer === "decline" \|\| answer === "cancel"` -> decline only (cancel falls to RECORD_INVALID) | n/a | 68/68 | LIVE, spec :100 "decline/Not now and cancel only dismiss"; probe: cancel -> head [false, dismissed true, 0 responses], mutant [false, dismissed null, RECORD_INVALID, 0]. Fail-closed, 0 writes; the page sends only accept/decline (today-entry.mjs:304). D-R26F-1 |
| FN02 | TB :700 `loads: v ? v.value : null` -> `: 0` | n/a | 66/68 | KILLED (R4-B10, N27 (d)) |
| FN03 | TB :700 `current: v ? v.value : null` -> `: 0` | n/a | 68/68 | LIVE; probe: a baseline-ask completion at 45 over w null: head current [null,null], mutant [0,0] (loads [45,45] both). Spec :110 "vector null positions mean not prescribed"; the page forwards o.current (today-entry.mjs:306). D-R26F-2 |
| FN04 | TB :549 registrar keeps state.workoutFacts | n/a | 68/68 | LIVE, no specified outcome named (real registrar drops/ignores it); not a debt |
| FN05 | TB :693 held request `intent` forced to "check" | n/a | 51/68 | KILLED (17 rows) |
| FN06 | TB :715 STALE_OFFER without `refusal` | n/a | 68/68 | LIVE; probe: no head/mutant difference on my inputs (an undo yes after a fresh plan gave STALE_OFFER + refusal PLAN_CHANGED only under FN05). The refusal payload on STALE is spec-silent (:149 names the code). Not a debt |
| FN07 | FC01 :547 `\|\| c.newW !== d.target_load.scalar.value` dropped | 299/299 | 68/68 | EQUIVALENT (proof 1) |
| FN08 | FC01 :222 STRUCTURAL -> ['debut','unlock'] | 298/299 | 68/68 | KILLED (R22L4-OTHER-KINDS-CHECK) |
| FN09 | FC01 :544 STRUCTURAL -> ['debut','unlock'] (transition) | 299/299 | 68/68 | LIVE, SPECIFIED, REACHABLE: B-R26F-1 |
| FN10 | FC01 :540 consumes-clash EFFECT_CONFLICT dropped | 299/299 | 68/68 | LIVE-equivalent under FC03 (FC03 :727-:728 refuses the overlap first for every accept; :540 is FC01's own defence for a direct caller). Not a debt |
| FN11 | FC01 :219 DEBUT_LANDED without `close_op_id === cur.close` | 298/299 | 68/68 | KILLED (FIT-DEVICE) |
| FN12 | FC03 :234 movedBase drops the wSets clause | 299/299 | 68/68 | LIVE, SPECIFIED, REACHABLE: B-R26F-2 |
| FN13 | FC03 :780 `\|\| held.has(authorityRoot(...))` dropped | 298/299 | 68/68 | KILLED (R7-P1) |
| FN14 | SA :858 named `w: ex.w===undefined?null:ex.w` -> `w: ex.w` | 299/299 | n/a | LIVE; only the diagnostic's w for an ABSENT w (undefined vs null); N-Q1 open; not a debt |
| FN15 | FC01 :212 pending native entries include done ones | 254/299 | 65/68 | KILLED (45 + 3) |
- Proof 1 (FN07): derivable() (:514, :519) already refuses RECORD_INVALID 'target_load' unless c.newW === r1/r2 AND ts === c.newW,
  and FC03 calls the transition only after derivable (:537 runs first inside transition, :776 disputes UNDERIVABLE fields). Probe:
  candidate.newW 110 over target 105 -> RECORD_INVALID 'payload' (digest) and, re-digested, RECORD_INVALID 'target_load' on head
  and mutant alike. :547's second clause is unreachable.
- Probes (S\out\probe-*.txt, hprobe-*.txt, probe2-*.txt): print-only rows appended in memory through the overlay; no byte written.

## Q5. Property walk (R8-PROPERTY MODEL WITH ORACLE, propertySequence8, NATIVE_LOAD_PROPERTY8_ALL=1)
- Shard A seeds 26260001..26261500 (1500 runs, 141 s): 0 counterexamples; shard B 26261501..26263000 (1500): 0. Union 3000
  seeds, 0. Coverage A/B: train 5851/5772, capture-ask 2174/2209, capture-card 7052/6950, legacy 626/666, legacy-held-projected
  160/106, reopen 630/703, undo 1448/1413, vector 585/524, effect:adopted 594/554, effect:missed 26/19, effect:compensated
  156/170, effect:landed 17/8, missed-consumed 42/31, twoDevice moved/kept 2840/726, 2824/628 (S\out\walk-a.json, walk-b.json).
  The walk is the inspected invariant walk on a new seed range, not an independent oracle.

## BLOCKING (each LIVE on whole FC12 299 and whole FA03 68; each an evaluated head/mutant difference; the head is right)
- B-R26F-1 (FN09; FC01 :544, the transition's STRUCTURAL set narrowed to debut/unlock): spec B / :127 "Existing active legacy
  debut/unlock/OWN/RECLAIM/LADDER/pendingThird branches ... return LEGACY_PENDING", :151 "Reject an existing unresolved same-lift
  structural entry (legacy: LEGACY_PENDING ...)", :205, and R9.13 (v) "FC01's LEGACY_PENDING rules (:221-222 in evaluation,
  :544 in transition) are unchanged". Input (S\out\probe-FN09-fc12.txt): the landingScenario yes fx-resp-1 (DEBUT 105 over w 100)
  folded over a base carrying a pending legacy entry of kind 'own' (and, the same, 'reclaim', 'ladder'; state DEBUT, newW 95,
  done false). Head, R1: issues [[LEGACY_PENDING, queue]], effects [], 0 native entries (the yes is held back as accepted
  history). Mutant: issues [], effects [queued], 1 native entry: the accepted yes applies beside an unresolved own/reclaim/ladder
  entry. The CHECK half is pinned (R22L4-OTHER-KINDS-CHECK refuses the check; my FN08 red there), the TRANSITION half is not: no
  FC12 row folds a yes over a pending own/reclaim/ladder entry. Reachable as R26-K05 is (an admitted base carrying the entry after
  the yes; the same footing the PM paid for K05). Row: R26-K05's fold with LEGQ kind own/reclaim/ladder, done false, R1 and R2:
  issues exactly [[LEGACY_PENDING, queue]] and no queued entry; control kind debut/unlock already covered by other rows.
- B-R26F-2 (FN12; FC03 :234 movedBase drops the wSets image): spec :207 "Base LOAD/technique differs from an accepted effect's
  recorded base ... -> EFFECT_CONFLICT for that lift only, refs = accept response_refs, field 'load_basis'", :165 "the
  reconstructed base's w/wSets/technique". Input (S\out\probe2-FN12-fc12.txt): R4-N24's scenario (C1, C2 tops, the yes fx-resp-1
  issued over w 100 with wSets ABSENT) with the base's wSets changed instead of its w: (a) wSets [100,100,95] added, (b) wSets
  present-null; w 100 unchanged. Head, R1 and R2: issues [[EFFECT_CONFLICT, load_basis, fx-press]], the DEBUT 105 pending, w 100.
  Mutant: R1 issues [], R2 only PRODUCER_REVISION_ABSENT_APPLIED: the yes applies over a changed set vector. R4-N24 pins the w
  half, R26-C06 the technique half; the wSets third of :165's triple is unpinned. Reachable on R4-N24's footing (a re-admitted
  base; the athlete cannot write wSets, W/plan-edit-commands.cjs:46). Row: R4-N24's assertions on the wSets-moved base (both
  shapes), R1 and R2.

## NAMED DEBTS (D-R26F-n; none blocks alone)
- D-R26F-1 (LOW; FN01): respond({answer:'cancel'}) -> {acknowledged:false, dismissed:true} (:100 "decline/Not now and cancel
  only dismiss") is unpinned; under the mutant cancel refuses RECORD_INVALID (0 writes either way). The page sends only accept
  and decline (today-entry.mjs:304), so cancel is a host-contract cell: one assertion beside R26-HOST-ACCEPT-ONLY, and one for
  decline -> dismissed true (Fable R25 fy05, still live, carried in D-R25F-5).
- D-R26F-2 (LOW-MED; FN03): the display of a NULL base position as null (:110 "vector null positions mean not prescribed") is
  pinned for loads (R4-B10 :377, :872) but not for current: a baseline-ask completion (w null) displays current [null,null] on
  the head and [0,0] under the mutant, loads [45,45] both. The page forwards o.current (today-entry.mjs:306) although its
  renderer today lists loads only, so the wrong value reaches the view model, not the DOM. One assertion on an existing
  baseline cell (R4-B10 or N27 (d)): offer.current deepEqual [null, null].
- CARRIED, re-measured here: none of Fable R25's D-R25F-1..5 was paid by round 26 except fy01 (= B-R25C-4, paid by R26-K05) and
  fy04 (= B-R25C-2, paid by R26-HOST-WRONG-PROPOSAL-ID); fy05 (decline dismissed), fy10, fy14, fy21, fy22, fy23, fy18 remain as
  named. The moment-only re-issuance case (D-R25C-5 = D-R25F-3's fy23) is held per the commission, not a blocker.
- CARRIED unchanged (the report's list): Claude D-R25C-1..4 as paid or held; D-R24-F-2/-3/-4/-5; D-R24-O-1..5; Astra's D-L18-M11,
  D-L16-T11/T14, D-S24-*, D-L17-*; D-L12/L13/L14/L15/R13 set; the spec :81 multi-entry capture limit.

## Q6. Owed
- Two blocker rows (test bytes only, FC12), each red first under its mutant (FN09 at :544, FN12 at :234), then a re-read.
- Unchanged and not run here: the w6 admission cells and local-source-commit/-consumer suites (CI only); the 80-file set
  (exclusive); exact-head Windows/Linux CI; protected conformance; successor pins/receipts; seal custody; every owner gate.

## Mutation table (one line per overlay; whole-file passes; applied = the child's own count)
Commissioned (14, all KILLED by their R26 row, each on that row only): H03 67/68; M16 67/68; H02 67/68; M12 67/68; M08 67/68;
M09 67/68; M15 67/68; M17 67/68; M18 67/68; C06 298/299 + 68/68; K05 298/299 + 68/68; M01 298/299; M02 298/299; M13 298/299.
Mine (15): FN01 LIVE 68 (D-R26F-1); FN02 K 66; FN03 LIVE 68 (D-R26F-2); FN04 LIVE 68 (unspecified); FN05 K 51; FN06 LIVE 68
(spec-silent); FN07 EQUIV 299/68 (proof 1); FN08 K 298; FN09 LIVE 299/68 BLOCKING B-R26F-1; FN10 LIVE-equiv under FC03 299/68;
FN11 K 298; FN12 LIVE 299/68 BLOCKING B-R26F-2; FN13 K 298; FN14 LIVE 299 (diagnostic only); FN15 K 254/65.
Totals: 6 killed; 2 equivalent/unreachable with a proof or a code path; 7 live = 2 blockers, 2 new debts, 3 not debts (FN04,
FN06, FN14: no specified outcome differs). 41 TAPs + 2 walk shards + 15 probe runs, GUARD protected-in-cache none / refused none
in every one.

## Author's Round 26 section (read last)
Its per-item table, first differing assertions (H03 "earn answer yes" acknowledged true op ...-13; M16 answer undefined; M12
prop-0000000000000000; M08/M09 [null,null] vs [0,0]; M15 null vs the sentence; M17 [35,40]; M18 [40,45]; C06 [] vs the conflict
tuple; K05 [[LEGACY_PENDING,queue]] vs []; M01 undefined vs [-5,-10,-15]; M02/M13 the named entry), whole-file counts (299/68),
hashes and the "one row kills both" pairings agree with every value I measured independently. Its section-4 kill table (48
earlier overlays) was not re-run by me; node:test runs top-level tests independently and the R25 bytes are an exact prefix,
so no earlier kill can be lost by appended rows. Its debt list matches mine except that it does not name the two new gaps
above (B-R26F-1/-2), which no reviewer had named before this read.

## What I did not verify
- The w6 admission cells and the local-source-commit/-consumer suites (CI-only); the 80-file set; exact-head CI; protected
  conformance; custody; receipts; phone/theme; the old app's src (reachability is judged over the readable rebuild writers and
  the spec's own legacy classes); the builder's earlier 160-mutant sweep and 48-overlay kill table (not re-run); the lost-ack
  path (no harness hook).
- Disclosures: every node run went through node %TEMP%\pm-run.cjs shared (jobs fable-r26-l1-job1 and -job3, chained, ONE slot
  at a time; no lock file touched by hand). My overlay preloads are my own R25 files (%TEMP%\review-nlr-r25-fable-scratch
  fov.cjs, fov-esm.mjs), reused read-only; the round-25 bytes were taken from %TEMP%\nlr-r26-scratch\pre\ (hashes verified,
  nothing else read there). The two reviewer inputs named in the commission were read whole; no other R26 review file was
  opened (REVIEW-NATIVE-LOAD-BUILD-R26-CLAUDE-l1.md exists in reviews\; I did not read it). DECISIONS.md was not read.
  Protected five, src/, ledger, conform/private, soak and prepledger-dev paths were never read, listed, grepped or loaded.
- No commit, push, stage, fetch into another worktree or DECISIONS write; this is the only file written in earned-nlr.
