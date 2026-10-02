# REVIEW NATIVE-LOAD BUILD rounds 27, 28, 29b (S11 T1 candidate)

Reviewer: Claude (Opus), commissioned by the Claude Opus 5.5 PM (DECISIONS:855); blind; engine tier
Object: worktree %TEMP%\earned-nlr, HEAD bd7654a798592a7dae421b9d68fec850fb0993d1 plus uncommitted bytes, sha256 measured on disk:
- FC03 rebuild/m4/workout/native-load-effects.cjs b7d90a15337865f161780ce6d114e63b29db1e22c87fa9cf35cd06873411fac2
- FC12 rebuild/m4/spec/native-load-options.test.cjs 19c1f073e48ab62cc294676d9dfde6bc50ef12e8d24b4367d43744dbb4706641 (393 tests)
- FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs 6954e210515059684215f2bae15677717cb6b5f1c1796a5ef67b8a46819190f0 (88)
- report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md b56680fcd9eff3338c5b45a0bfa254f4a2a361a39bd0bcd935a0b370c484c30d
- spec R9.13 (cmd /c git show 7ef8291:rebuild/coach/NATIVE-LOAD-SPEC.md) eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb; ":N" = its 1-based LF line.

VERDICT: REJECT (B-R29C-1 product, B-R29C-2 and B-R29C-3 rows; each has a measured counterexample and a small measured fix; D-R29C-1..6 named)

Method: every run via node %TEMP%\pm-run.cjs shared, one slot, TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03, nlr-build guard.cjs and
deps-loader.mjs; every TAP "GUARD protected-in-cache: none; refused: none". Probes are print-only tests appended IN MEMORY to FC12; mutants are
in-memory overlays (nlr-build r17c overlay.cjs for CJS, my own esm-overlay.mjs load hook for today-bindings.mjs); every overlay reports "applied 1".
Nothing written in earned-nlr but this file. Scratch %TEMP%\review-nlr-r29-claude-scratch (probe1-5.js, mutants.cjs 04307091..., mrun/prun/
walk/hmut.cjs; out\res-fc12.txt 82d58243..., res-fa03.txt 615830ac..., res-host.txt fc176864..., walks.txt b90bdcff...). Fixture numbers invented.
R1 = record sealed under the evaluating revision (present), R2 = under an absent revision. Baseline on the object bytes: FC12 393/393, FA03 88/88.
The author's round sections were read last, after every measurement below.

## Q1 PRODUCT
- Only FC03 differs among product files: git diff --stat bd7654a -- rebuild lists FC03 (14 +-), FC12, FA03, the report; git status shows no other
  modified or untracked product path. rebuild/engine has no diff, so PRODUCER_REVISION (FC03:1139, ...1d7dbe40) is unchanged. 7 hunks, 11/3.
- Clause per hunk (spec quotes):
  H1 structural :341-:343: :117 "Basis is exactly {athlete_id,source,coverage,order,plan,technique,load_basis,effect_frontier}"; :61 "own
     enumerable data properties only ... no extras"; :175 "recognizes malformed native accepts and refuses NATIVE_LOAD_RECORD_INVALID rather than
     dropping them". Conforms for the members it checks (depth: D-R29C-1).
  H2 structural :348 (skip a malformed item), H4 evidenceChanged :527 (malformed = changed), H6 dayOf :542 (null item): :155 S4 "the {start,close}
     pairs of body.evidence equal the consumes roots' pairs exactly; each evidence set item's slot, position, origin and original equal that
     authentic session's typed slot", field evidence. Conform, but the H-03 class is not closed: B-R29C-1.
  H3 correspondence S8 :475: :119 "load_basis is {authority_refs,tenure_start,...}, preserving missing fields explicitly"; :155 "an adopt-observed
     with [] is anchored to the capture cells exactly as S8 says" (field base_load). Conforms; adopt-baseline over a NULL capture is not covered.
  H5 correspondence :516: :111 "target_load | {scalar:LoadOrNull,vector:[LoadOrNull]}"; FC01 DERIVABLE then refuses field decision. Conforms.
  H7 reproducible gate :769-:770: :155 ORIGINAL CUT "a present-revision record is re-evaluated only when today's reconstruction reproduces its
     cut" with N (i) (R1 = R2). Conforms.
- Valid records unchanged (measured): seven TRIPWIRES (each 29b branch replaced by a throw, TW1-TW7) on whole FC12 trip ONLY in forged-record
  rows (TW1 R27S-K110-K123-K527 case (a) and R29-H04-BASIS-MEMBERS; TW2/TW4/TW6 R29-H03; TW3 R29-H04-ADOPT-OBSERVED; TW5 R29-H02; TW7 R29-H01,
  R29-H04-ADOPT-OBSERVED). All seven at once: FA03 88/88 (applied through the host's ESM import of FC03), R8 walk seeds 29270001+1000 green.
  Genuine earn, adoption, adopt-baseline 60 over a null capture, compensation, duplicate compensation: each folds as the unforged head, R1 and R2.
- Cannot throw: every new expression guards (map/isArray before a member read; item && item.close); no new call.
- No ISSUANCE hunk: checkNativeLoad (:964-:1118) reaches structural/correspondence/evidenceChanged/refsArm only through foldNativeLoad, and dayOf
  only with {evidence: []} (:951, :1062), where H6 cannot fire. All seven are FOLD-ONLY by N (ii); no revision move due. Agrees with the report.

## BLOCKING
B-R29C-1 (PRODUCT; the H-03 class the PM ruled FIX NOW at DECISIONS:853 (2)/:854 (1) is still open at the same line). Input: the round-29 fixture
  (r29two; fx-row genuine yes fx-resp-0), fx-press's genuine earn re-issued (re-digested) with evidence[1].sets[0].edits = 5, {} or true, R1 and R2.
  Output: foldNativeLoad THROWS "(s.edits || []) is not iterable" at FC03 :349 (structural's reference loop, which H2 skips only for a non-map set).
  edits = [null] passes structural (its null is filtered) and THROWS "Cannot read properties of null (reading 'op_id')" at evidenceChanged :525.
  The same on an adopt-baseline 60 (null capture) and on an Undo record; checkNativeLoad for the OTHER lift (fx-row) throws too, so it is the
  whole-day failure H-03 was: host project() (L/today-bindings.mjs:639-658) has no catch. Control: edits null -> RECORD_INVALID evidence.
  Spec: :109 evidence sets[{...,edits,...}] "edits is ordered [Ref]"; :155 S4 (field evidence); :175; :185 (no raw exception).
  Reachability: as H-01..H-04, a hand-built record in the installation's own log only (triage vocabulary (c)).
  Fix, measured (overlay FIX1, two clauses, FOLD-ONLY): in H2 and H4 replace `!item.sets.every(map)` by
  `!item.sets.every((s) => map(s) && (s.edits == null || (Array.isArray(s.edits) && s.edits.every(map))))`. Result: every case above
  RECORD_INVALID evidence [fx-resp-1], fx-row unaffected, R1 = R2; whole FC12 393/393, whole FA03 88/88. Side effect to rule on: edits [5] moves
  from field consumes (head) to evidence. Row owed: this input, red first on the object bytes.
B-R29C-2 (ROWS: the R1 half of every R29 row runs a non-reproducible layout, so H4 and H7 are never decisive). In r29two, fx-row's yes (fx-resp-0)
  folds before fx-press's (op id tie-break) and moves the structural queue digest, so every fx-press record takes correspondence under R1 exactly as
  under R2 (the author says so for H-02 in Round 29 section 2). The triage's H-04 R1 mechanism (single lift, cut reproduced, FC01 echoes the basis)
  is therefore unpinned. Measured on the single-lift fixtures (landingScenario earn; C1 top, C2 at 95 adopt-observed), R1:
  - C14 (H7's authority_refs clause dropped): adopt-observed 95 without load_basis.authority_refs -> head RECORD_INVALID base_load, w 100;
    mutant w 95 APPLIED, no issue (the triage's exact H-04 input); authority_refs null: same; earn without it: mutant DEBUT 105 queued.
  - C15 (H7's map(load_basis) guard dropped): load_basis null -> head RECORD_INVALID base_load; mutant THROWS "reading 'authority_refs'".
  - C13 (H4 returns true -> continue): last item null / sets deleted -> head evidence; mutant target_load; first item null -> mutant issuance.
  - C16 (H7's isArray(start_ids) dropped): start_ids 'x' or '' -> head basis.order; mutant issuance.
  All four: FC12 393/393 and FA03 unaffected, i.e. LIVE. Specified: :854 (1) "each refusing RECORD_INVALID with the field the spec names",
  R1 = R2 (N (i)); the R29 row titles claim R1. Fix: add a single-lift R1 case to R29-H01 (start_ids 'x'), R29-H03 (last item null) and
  R29-H04-ADOPT-OBSERVED (and an earn), plus load_basis null; each kills its mutant above (measured by the probe: head vs mutant outputs differ).
B-R29C-3 (ROWS: H1/H3 shape guards whose removal re-opens a throw or applies the record; no row kills them). Measured, R29 fixture, R1 and R2:
  - C05 (H1 `!map(body.base_load)` dropped): base_load null -> head RECORD_INVALID payload; mutant THROWS "reading 'fields'" (earn and adoption).
  - C11 (H3 `map(body.basis.load_basis)` dropped): load_basis null -> head base_load; mutant THROWS "reading 'authority_refs'".
  - C03 (H1 `text(f.spend_id)` dropped): effect_frontier [{spend_id:5}] or [{}] -> head payload; mutant APPLIED (DEBUT 105), R1 and R2.
  - C10 (H3 limited to adopt-observed): earn without authority_refs -> head base_load; mutant APPLIED (DEBUT 105), R1 and R2.
  Fix: extend R29-H04-BASIS-MEMBERS with base_load null, effect_frontier [{spend_id:5}], load_basis null and an earn without authority_refs.

## Q2 ROWS OF ROUNDS 27, 28, 29b
- Read: every R29 row, R28B-S3/S4/S5/S6/ISSUANCE/BODY-NULL/TECHNIQUE/MISSED-CLAIM/REMOVAL/FOLD-COVERAGE/GATE/UNATTRIBUTED, R28A-01..05,
  R27S-K110, the four R28-HOST rows, and a scan of lines 6119-7079 for early returns, try/catch, skip/todo: one early return only (7007).
- Spec fidelity: the asserted outcomes match the quoted clauses, with two exceptions of precision, not of behaviour: (a) the R1 halves of the R29
  rows (B-R29C-2); (b) citation drift (D-R29C-3). The three rows :854 (1) protects (R28B-S6-ORDER, R28B-FORGED-UNDO-TARGET, R28B-EXIT-REFS-MISSING)
  are green and unchanged.
- Rows pinning what the spec does not state: R29-H04-BASIS-MEMBERS pins field payload (no S clause names basis members; the author says so; it
  follows the head's 'decision shape' precedent under :854 (1)); R28-HOST-INTERLEAVED-WRITE pins project()'s code STALE_OFFER and a two-read
  structure (:149 names STALE_OFFER for respond, not project; a single-snapshot host would fail the row): D-R29C-5.
- R28B-UNATTRIBUTED-REFUSAL-SHAPE (builder flag): it returns early unless the check refuses. Measured on the object bytes, the check DOES refuse:
  RECORD_INVALID field lift_lineage_id refs [fx-resp-1], so today it asserts the shape; it would pass silently for a product that stops refusing,
  which is the spec-silent D-R27-1 / SS-08. Acceptable while D-R27-1 is open; pin the refusal once the post-S11 clarification rules (D-R29C-4).
- R27S-K110-K123-K527 case (a) (extra basis member, R1) is now refused by H1 in structural (TW1 trips there) before FC01 re-evaluates, so its
  title ("under each mutant the malformed basis re-evaluates to the same body") is stale. Re-measured: FC01 K110 (the :72 basis-keys line
  removed) is killed only by R28A-01 (392/393), as the report says (D-R29C-4).
- The two test-only IndexedDB seams test the real paths. Re-measured with my own host mutants on today-bindings.mjs (ESM overlay, FA03 whole):
  HM1 lost-ack recovery `const late = await savedResponse(held)` -> `null`: 87/88, killed only by R28-HOST-LOST-ACK-ALREADY-SAVED;
  HM2 project()'s `read.source_revision !== snap.revision` STALE guard removed: 87/88, killed only by R28-HOST-INTERLEAVED-WRITE;
  HM3 savedResponse without its folded-spend test: 87/88, killed only by R28-HOST-RETRY-OVER-AN-UNFOLDED-BASIS; head 88/88.
  Each seam asserts its own firing (fired === 1) and drives the product's own respond/project code; only event delivery is synthetic.
  So D-R25C-2 (HM1 = my R25 H05) and D-R24-O-3 (HM2 = my R24 C13) are PAID.

## Q3 MUTATION TABLE (my own, single clause unless marked; FC12 whole unless marked; head outputs from probes 1-5)
| id | clause | result | class |
|---|---|---|---|
| C01 | H1 extra-key test dropped | killed R29-H04-BASIS-MEMBERS | killed |
| C02 | H1 plan/technique `||` -> `&&` (multi-token) | killed R29-H04-BASIS-MEMBERS | killed |
| C03 | H1 frontier entry `text(f.spend_id)` dropped | LIVE: [{spend_id:5}] applied | B-R29C-3 |
| C04 | H1 frontier-entry test dropped | killed R29-H04-BASIS-MEMBERS | killed |
| C05 | H1 `!map(body.base_load)` dropped | LIVE: THROW reading 'fields' | B-R29C-3 |
| C06 | H1 `!map(base_load.fields)` dropped | killed R29-H04-BASIS-MEMBERS | killed |
| C07 | H1 moved after the lineage test (ordering, 2 edits) | LIVE: absent lineage + extra key -> lift_lineage_id vs payload | SPEC-SILENT (two defects) |
| C08 | H2 continue -> 'consumed reference absent' | killed R29-H03 | killed |
| C09 | H2 set-maps test dropped | killed R29-H03 | killed |
| C10 | H3 limited to adopt-observed | LIVE: earn without authority_refs applied | B-R29C-3 |
| C11 | H3 map(load_basis) guard dropped | LIVE: THROW reading 'authority_refs' | B-R29C-3 |
| C12 | H3 moved after the target_load test (ordering, 2 edits) | LIVE: field base_load vs target_load on a two-defect record | SPEC-SILENT |
| C13 | H4 `return true` -> `continue` | LIVE: R1 single lift, evidence -> target_load/issuance | B-R29C-2 |
| C14 | H7 authority_refs clause dropped | LIVE: R1 single lift, adopt-observed w 95 applied | B-R29C-2 |
| C15 | H7 map(load_basis) guard dropped | LIVE: R1 single lift THROW | B-R29C-2 |
| C16 | H7 isArray(start_ids) dropped | LIVE: R1 single lift, basis.order -> issuance | B-R29C-2 |
| C17 | H7 adopt-baseline exemption dropped | LIVE on FC12; no probe difference | EQUIVALENT (proof 1) |
| C18 | H7 tests `body` instead of each member `b` (cross-member) | LIVE on FC12; no probe difference | EQUIVALENT (proof 2) |
| X01 | gate refsArm given issues [] (cross-function, argument) | LIVE | UNCLASSIFIED, outside 29b |
| X02 | overlap conflict moved after correspondence (ordering) | killed R28B-CROSS-LIFT-OVERLAP | killed |
| X03 | gate ignores `changed` (cross-function) | killed R11-FORGED-EVIDENCE-VALUE, R27S-P653.., R28B-REMOVAL-AFTER-YES | killed |
| X04 | dayOf takes the FIRST matching close (loop order) | LIVE | UNCLASSIFIED, outside 29b |
| HM1-HM3 | host, see Q2 | killed by the seam rows | killed (FA03) |
- Proof 1 (C17): for an adopt-baseline the H7 clause only decides reproducibility; a genuine one always carries an array; one without it that the
  mutant sends to correspondence is admitted there by REFS-ARM exactly when the head's re-evaluation reproduces it (FC01 echoes the basis), and
  a numeric capture fails REFS-ARM in both; measured equal on AB-NO-AR/AR-NULL/AR-STR/LB-NULL, R1 and R2.
- Proof 2 (C18): members differ only for a compensation with alt bodies; an alt whose order is not a map with an array start_ids gives cutOf 0, so
  the cancellation's event sits at -0.5, before the effect it cancels, and sameCut(representative, first in members) is false by its programme/
  queue digest, so every() stops before atCut(alt); measured equal on ALT-ORDER-NULL, ALT-ORDER-IDS-STR (both RECORD_INVALID compensates).
- X01/X04 are outside the 29b hunks and not in the sweep's operator classes as written; no distinguishing input found in the time spent. X04
  candidate input: an earn over C1 and C2 on dates straddling a date-dependent reader (a reset fork dated between them), R1.

## Q4 PROPERTY WALK (seeds I picked; NATIVE_LOAD_PROPERTY8_ALL=1, report JSON kept in out\)
- R8 oracle walk, object bytes: seeds 29270001-29271500 and 29271501-29273000 (two shards, same slot, in sequence): 3000 runs, 0 counterexamples,
  135 s + 142 s; union coverage includes RECORD_INVALID 245, EFFECT_CONFLICT 544, BASIS_REPAIR_REQUIRED 28, LEGACY_PENDING 45, adopted 747,
  compensated 118, landed 18, twoDevice moved 5564.
- R8 under TWALL (all seven tripwires): seeds 29270001-29271000, 0 counterexamples, no trip: no walk-generated record, genuine or forged,
  reaches a 29b branch (the walk's forgeries are refused before, or pass, the new guards). R7 walk seeds 29270001-29271000: 0 counterexamples.

## Q5 OWED
- B-R29C-1..3 (above): one FC03 edit (FIX1, measured green) and about ten row cases, red first on the object bytes.
- The hosted sweep of these bytes (running separately) and the 80-file / w6 admission cells (CI only, report disclosure (4)).
- D-R25C-2 and D-R24-O-3: PAID (Q2). D-R27-2 (R27S-H111 SOURCE_FRONTIER_UNPROVEN on the accept retry): not examined here.

## NAMED DEBTS
- D-R29C-1 (H-04 depth; refusal shape only, nothing raised beyond S4-bound actual loads). Measured APPLIED with no issue under R1 (R2: only
  ABSENT_APPLIED), R29 fixture: basis.plan {} or with an extra key, technique {} or forks 'x', effect_frontier [{spend_id:'x'}], load_basis
  without hi (any member but authority_refs), order.frontier 'x'; an Undo without basis.coverage or with plan {}; an adopt-baseline 60 over a null
  capture with authority_refs absent, null or 'x' (w 60). :117/:119/:61/:175 call each invalid. The report's section 1 "adopt-baseline, whose
  absent member REFS-ARM already refuses base_load under every revision" is true for a numeric capture only.
- D-R29C-2 (R1 != R2 fields on the same record, pre-existing, not ruled): order.start_ids [null] or [{}]: R1 issuance, R2 basis.order; an Undo
  without basis.source: R1 issuance, R2 basis.source; an Undo with target_load null: R1 issuance, R2 decision.
- D-R29C-3 (citation drift; quoted text right, lines wrong): R29 rows and H1's comment cite :120 for the member definitions (:119), :111 for
  base_load (:110), :112 target_load (:111), :110 evidence (:109), :104 all required (:103); R28A-02/-03 cite :176 for :185's refusal shape and
  unexpected-exception text; R28A-05 cites :123 for effect_frontier (:119).
- D-R29C-4 (row descriptions): R27S-K110-K123-K527 case (a) no longer reaches FC01 (Q2); R28B-UNATTRIBUTED-REFUSAL-SHAPE is conditional on
  spec-silent D-R27-1 (Q2).
- D-R29C-5 (over-pinning): R28-HOST-INTERLEAVED-WRITE pins project()'s STALE_OFFER and the two-read design (Q2); keep if the PM treats the w6
  host contract as sealed, as :852 (c) did for H011/H016/H018.
- D-R29C-6 (unclassified, outside 29b): X01 (the REFS-ARM gate given no issues) and X04 (dayOf's loop order) are LIVE on FC12 with no input found;
  for the post-S11 list with the sweep's other unclassified ids.

## NOT VERIFIED
- The hosted mutation sweep and the 80-file set; any browser or phone harness; the protected five (never loaded; guard line in every TAP).
- Rounds 27 and 28 rows were sampled (Q2 list), not re-derived one by one; the round-28 red-first set (321) and the 182 overlays were not re-run
  except K110 (F01).
- X01 and X04 are not classified; C07/C12 are called spec-silent by my reading of :155 (the order among two simultaneous defects).
- Nothing committed, staged or pushed; DECISIONS untouched; only this file written in the worktree.
