# REVIEW NATIVE-LOAD BUILD ROUND 25 (test rows) - Claude l1

Reviewer: Claude (Opus), commissioned by the Claude Opus 5.5 PM (DECISIONS:848); blind; engine tier
Head: bd7654a798592a7dae421b9d68fec850fb0993d1 (worktree %TEMP%\earned-nlr; scratch %TEMP%\review-nlr-r25-claude-scratch = S)
FC12 rebuild/m4/spec/native-load-options.test.cjs fa271b9d7c59806fa6b3efdc45150976b9ac0fd211ef09a5858a63d699d6b633 (660896 B, 294 tests)
FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs d1e7afd0850ce64bf3d64c7102461792214e478ac530655ab4eff2a84b4a37b9 (151338 B, 63)
Report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md c6de5b23015f4ad8c5ea993cc7b4363a9f56400f3afad7812b943fd70f7929e9
Spec R9.13 7ef8291 extracted by cmd redirection: eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb (621 lines)

VERDICT: REJECT (test coverage only; the product is byte-identical to bd7654a and gives the specified result on every input I
evaluated; all 13 commissioned items ARE paid; four NEW live single-clause mutants of my own change a specified, reachable
outcome and no row catches them: B-R25C-1..4 below, rows only, no product byte)

## Q1. Product bytes and prefix (measured)
- git rev-parse HEAD = bd7654a; `git hash-object` of the working file equals `git rev-parse bd7654a:<path>` for FC03
  native-load-effects.cjs (b25d2e61...), L/source-admission.mjs (10bd5cfb...), FC01 rebuild/engine/native-load.cjs (92a4a0b4...),
  W/engine-capture.cjs (fa68a748...), L/today-bindings.mjs (91aa980f...), w6 local-source-admission.test.mjs (bcc6df4d...),
  E/today.cjs (685f6e1e...), E/writers.cjs (c7b11beb...): 8/8 eq=True. `git diff --name-only bd7654a -- rebuild/m3 rebuild/m4
  rebuild/engine/{native-load,today,writers,progression}.cjs` lists only FA03 and FC12.
- Prefix (S\prefix.cjs, byte compare against %TEMP%\nlr-r25-scratch\pre\, whose sha256 I verified equal to the round-24 hashes
  cc187757 / 320a453b): FC12 640260 B is an exact prefix of the 660896 B file (firstDiff -1), FA03 141025 B of 151338 B
  (firstDiff -1). The tails hold exactly 8 and 3 top-level test( calls. CR 0, non-ASCII 0 in both. No existing row changed.
- Heads (my runs): FC12 294/294, FA03 63/63, exit 0, GUARD protected-in-cache: none; refused: none.

## Q2. The 13 items: my own overlay from the reviewer's TEXT, applied once, whole FC12 and whole FA03
Overlay: S\ovr.cjs (CJS compile + string readFileSync) and S\ovr-esm.mjs (ES modules only), path-suffix matched, every `to`
carries /*RVMUT*/ so no text is ever patched twice (no prefix-anchor double application); every anchor checked unique on the
product (S\mk.cjs: 0 bad). Built from the review texts; the author's and reviewers' JSON files were not used.
| Item(s) | My clause (file: from -> to) | FC12 | FA03 | red row |
| --- | --- | --- | --- | --- |
| Fable B-R24F-1(a) fx05 | FC03 :270 nullW filter `x.w == null` -> `... && x.wSets == null` | 293/294 | 63/63 | 290 R25-NULLW-STORED-VECTOR-HIDDEN |
| Claude B-R24-O-3 C05 | same filter -> `... && !Array.isArray(x.wSets)` | 293/294 | 63/63 | 290 (same row) |
| Fable B-R24F-1(b) = Claude B-R24-O-2 a34 | FC03 :271 hide gains `&& q.newWSets === undefined` | 293/294 | 63/63 | 291 R25-NEWWSETS-ENTRY-OVER-NULL-HIDDEN |
| Fable B-R24F-2 fx06 | FC03 :271 `nullW.has(q.exId)` -> `(nullW.has(q.exId) || q.state === 'PROPOSED')` | 293/294 | 63/63 | 292 R25-F2-PROPOSED-ON-NUMERIC-W-KEPT |
| Fable B-R24F-3 fx07b | FC01 :222 whole line `!q.done` -> `q.done !== true` | 293/294 | 63/63 | 293 R25-F3-TRUTHY-DONE-CHECK |
| Claude B-R24-O-1 a30 | FC03 :271 `!q.done` -> `(!q.done || q.state !== 'ESTABLISH')` | 293/294 | 63/63 | 294 R25-O1-DONE-ANY-STATE-OVER-NULL-SHOWN |
| Claude B-R24-O-4 = Astra L17-B4 (C07/M11) | TB :681 `cancelled: !!x.cancelled_by` -> `cancelled: false` | n/a | 62/63 | 61 R25-HOST-CANCELLED-SPEND |
| Astra L17-B1 M01 | SA :857 out-of-P test gains `ex.w<0||` | 293/294 | n/a | 287 R25-L17B1-NEGATIVE-W-ALV |
| Astra L17-B2 M06 | SA :859 `.map(...)` -> `.map(...).slice(0,Math.max(1,ex.sets||1))` | 293/294 | n/a | 288 R25-L17B2-FULL-STORED-VECTOR-ALV |
| Astra L17-B3 M07 | SA :859 `if(q.newW!==ex.w)` guards the write | 293/294 | n/a | 289 R25-L17B3-EQUAL-TARGET-ALV |
| Astra L17-B5 M12 | TB :708 `alive &&` dropped from the held-handle lookup | n/a | 62/63 | 62 R25-HOST-CLOSED-HANDLE |
| Astra L17-B6 S24-H08 | TB :667 `&& JSON.stringify(o.payload.issuance) === JSON.stringify(held.issuance)` dropped | n/a | 62/63 | 63 R25-HOST-SAVED-NEEDS-EXACT-ISSUANCE |
Every overlay reports applied in the child (tally cjs/esm columns); n/a = the suite never loads that file (FC12 never imports
today-bindings; FA03 never reads the A-LEGACY-VECTOR text). Each is red on exactly its own round-25 row and on no other row;
the FC03/FC01 overlays reach FA03 and leave it green, as the author reports. 12 overlays, 13 items: agreed with the author.

## Q3. Spec fidelity of the eleven new rows
- Each row cites the clause it asserts and uses the reviewer's input; every expected value I checked against (iv) (:597), (v)
  (:606), :81, :127, :149, :154, :158, :169-:172, :188 is the specified one, not a snapshot. No row would pass for the wrong
  product its own item names (Q2). Per row, what else could be wrong and still pass:
- R25-HOST-SAVED-NEEDS-EXACT-ISSUANCE (the collision seam): the seam replaces NLE.issuanceFor on the one shared CJS module
  object that today-bindings calls through a property lookup at call time, so the second handle really carries the first's
  proposal_id; the first yes is a real durable commit and savedResponse really reads it from the log and finds its spend in the
  real fold (that is why my H08 overlay turns the answer into {acknowledged true, alreadySaved true}). So it DOES exercise the
  real already-saved early return. Limits: (a) the forced second issuance is internally inconsistent (its digest is not its
  proposal_id), which the real host cannot mint without a sha256-prefix collision, so the head's STALE_OFFER is overdetermined:
  sameIssued's own digest test would refuse it even if its body comparison were broken (R6-B17 pins that part). (b) The natural
  duplicate, two held handles of the SAME offer at two moments (same proposal_id, issuances differing only in `moment`), is not
  pinned either way: my mutant H10 (savedResponse compares the body only) is LIVE 63/63. Spec :149 lists body/reason/producer
  and semantic basis (not moment) while :172 says "exact issuance/spend": a ruling first (D-R25C-5), as the author says.
- Shared rows: R25-NULLW-STORED-VECTOR-HIDDEN is red under fx05 and under C05 separately (measured). The two clauses differ only
  on a non-array non-null wSets, which FC01 :201 refuses RECORD_INVALID before any hide matters, so one row is enough.
  R25-NEWWSETS-ENTRY-OVER-NULL-HIDDEN pays one mutant named by two reviewers. Both loop w null and ABSENT, v1/v2, R1/R2.
- R25-F3-TRUTHY-DONE-CHECK pins the EVALUATION reader only (:222). The same predicate in the TRANSITION (:544, named beside
  :222 in (v)) is unpinned: B-R25C-4.
- R25-F2 (b) asserts the day refusal ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED, the spec :81 DEPENDENCY: correct today; when the third
  engine change lands it must flip (the title names "the NAMED LIMIT"; keep it under the carried-limit convention, never delete).
- R25-HOST-CLOSED-HANDLE, R25-HOST-CANCELLED-SPEND: correct. My H13 (project() drops cancelled spends) is also killed by
  CANCELLED-SPEND (62/63), so its "the tombstone is kept" half discriminates too.

## Q4. My own single-clause mutants (32; S\muts*.cjs; whole FC12 and/or whole FA03; 77 TAPs, GUARD ok in every one)
| id | clause (file: from -> to) | FC12 | FA03 | status |
| --- | --- | --- | --- | --- |
| H01 | TB :641 project(): `if (!alive) return {... CAPABILITY_REQUIRED}` dropped | n/a | 63/63 | LIVE: D-R25C-1 |
| H02 | TB :710 `if (proposal_id !== held.proposal_id) return refused("NATIVE_LOAD_SCOPE_MISMATCH")` dropped | n/a | 63/63 | LIVE: B-R25C-2 |
| H03 | TB :707 `if (answer !== "accept") return refused("NATIVE_LOAD_RECORD_INVALID")` dropped | n/a | 63/63 | LIVE: B-R25C-1 |
| H04 | TB :668 savedResponse: `|| !p.fold.spent.some(...)` (the "and folded" test) dropped | n/a | 63/63 | LIVE: D-R25C-3 |
| H05 | TB :727 lost-ack recovery `const late = await savedResponse(held)` -> `null` | n/a | 63/63 | LIVE: D-R25C-2 |
| H06 | TB :677 project() state unprojected (`p.fold.state`) | n/a | 50/63 | KILLED (13) |
| H07 | TB :678 project() `status: p.fold.status` -> `"ready"` | n/a | 63/63 | EQUIVALENT (proof 1) |
| H08 | TB :528 registrar `if (fold.status !== "ready")` -> `if (false)` | n/a | 63/63 | LIVE: D-R25C-4 |
| H09 | TB :549 registrar `{ ...held.state }` -> `{ ...fold.state }` | n/a | 48/63 | KILLED (15) |
| H10 | TB :667 savedResponse compares issuance.body only | n/a | 63/63 | LIVE: D-R25C-5 (ruling) |
| H11 | TB :679 `effects: []` | n/a | 61/63 | KILLED (R3-B1, R9-B24) |
| H12 | TB :679 issues without superseded ones | n/a | 63/63 | LIVE: = Fable fx09, carried D-R24-F-3 half |
| H13 | TB :681 spent without cancelled spends | n/a | 62/63 | KILLED (R25-HOST-CANCELLED-SPEND) |
| H14 | TB :666 `!rejected[o.op_id] &&` dropped | n/a | 63/63 | LIVE: = builder S24-H05 (carried D-S24-H05) |
| H15 | TB :648 STALE guard `read.source_revision !== snap.revision` dropped | n/a | 63/63 | LIVE: = carried D-R24-O-3 |
| A01 | SA :853 `q.state==='PROPOSED'||` dropped | 293/294 | n/a | KILLED |
| A02 | SA :853 unlock kind dropped | 292/294 | n/a | KILLED |
| A03 | SA :854 `q.newWSets!==undefined` -> `Array.isArray(q.newWSets)` | 293/294 | n/a | KILLED |
| A04 | SA :857 P `every` -> `some` | 288/294 | n/a | KILLED |
| C01 | FC03 :271 hide any kind | 291/294 | 62/63 | KILLED |
| C02 | FC03 :271 hide native entries too | 294/294 | 63/63 | EQUIVALENT (proof 2) |
| C03 | FC03 :256 held arm hides done legacy entries | 293/294 | 63/63 | KILLED |
| C04 | FC03 :256 held marker `typeof ==='string'` -> `!= null` | 293/294 | 63/63 | KILLED |
| C05 | FC03 :237 BASIS_REPAIR_REQUIRED not a hold | 284/294 | 59/63 | KILLED |
| C06 | FC03 :234 movedBase: `|| !same(json(ex.forks || []), forks)` dropped | 294/294 | 63/63 | LIVE: B-R25C-3 |
| C07 | FC03 :266 superseded hold issues still hold | 290/294 | 60/63 | KILLED |
| C08 | FC03 :256 held legacy arm hides every kind | 293/294 | 63/63 | KILLED |
| K01 | FC01 :201 present-null wSets refused | 253/294 | 57/63 | KILLED |
| K02 | FC01 :222 LEGACY_PENDING over any lift | 293/294 | 63/63 | KILLED |
| K03 | FC01 :246 set-count test `!==` -> `<` | 293/294 | 63/63 | KILLED |
| K04 | FC01 :229 planNow `ex.w == null` -> `=== null` | 293/294 | 63/63 | KILLED |
| K05 | FC01 :544 TRANSITION `!q.done` -> `q.done !== true` | 294/294 | 63/63 | LIVE: B-R25C-4 |
Totals: 18 killed; 14 live = 4 blockers, 5 new debts, 3 carried debts, 2 equivalent with proof.
- Proof 1 (H07): foldNativeLoad's success return is `status: blocked ? 'refused' : 'ready'` with `const blocked = false` (FC03
  :947, :952); its only other status comes from refusedFold (:550), reached from :554 (base not an array: the host refuses it
  first at TB :642), :555 (engine missing: the host's engine is a constant) and :566 (imports carrying native records: the host
  refuses EVERY nonempty imported collection first at TB :645). So project() never sees a non-ready fold: equivalent.
- Proof 2 (C02): C02 differs only on an unfinished NATIVE entry of an UNHELD lift whose w is null, which the R9.11 INVARIANT
  (:158, widened by (v)) excludes. Probe (S\out\probe2-*.txt): the natural input, an accepted yes then a base with w null, is
  HELD on head and mutant alike (EFFECT_CONFLICT load_basis; registered queue [] ; card [null,null,null]).
- Probes (in memory, appended to the test file through the overlay, print only; no byte written): S\out\probe-*.txt (FA03 host)
  and S\out\probe2-*.txt (FC12), each run on the head and under the mutant. They measure every blocker below.

## BLOCKING (each LIVE on whole FC12 294 and whole FA03 63; each an evaluated head/mutant difference; the head is right)
- B-R25C-1 (H03; TB :707): spec :97 "answer='accept'|'decline'", :170 "only accept reaches this command". Input: D1 and D2
  sessions, the durable host on D2 offers demo-press, respond({handle, proposal_id: offer.proposalId, answer}) with answer 'yes',
  'ACCEPT' or undefined. Head: {acknowledged false, code NATIVE_LOAD_RECORD_INVALID}, 0 responses. Mutant: {acknowledged true},
  1 durable proposal-response written (a yes the athlete never gave). Reachable by any caller of the host's public respond()
  (FC08 is the trust boundary; the page is not trusted, I1/I2). Row: one FA03 cell, the three answers, 0 responses each.
- B-R25C-2 (H02; TB :710): spec :169 "Refuse ... wrong proposal ID before staging", :188 "CAPABILITY_REQUIRED or SCOPE_MISMATCH".
  Input: the same genuine handle with proposal_id 'prop-0000000000000000'. Head: {acknowledged false, NATIVE_LOAD_SCOPE_MISMATCH},
  0 responses. Mutant: {acknowledged true}, 1 response. No FA03 cell passes a wrong proposal_id (the string NATIVE_LOAD_SCOPE_MISMATCH
  occurs in no .mjs/.cjs/.js file under rebuild/m3 or rebuild/m4 except its own line, TB :710). Row: that FA03 cell.
- B-R25C-3 (C06; FC03 :234 movedBase): spec :207 "Base load/technique differs from an accepted effect's recorded base and no
  authenticated plan op orders the change -> EFFECT_CONFLICT for that lift only, refs = accept response_refs, field 'load_basis'".
  Input: R4-N24's scenario (landingScenario: C1, C2 tops, the yes fx-resp-1) with the base's technique moved instead of its w
  (fx-press forks [{from: dayAt(5), kind 'reset'}], w 100). Head, R1 and R2: issues [[EFFECT_CONFLICT, load_basis, fx-press]],
  the queued DEBUT 105 kept, spent 1. Mutant: R1 issues [], R2 only PRODUCER_REVISION_ABSENT_APPLIED: the yes applies over a
  changed technique. R4-N24 pins the w half only. Reachable on the same footing as R4-N24 (a re-admitted base; the athlete
  cannot write forks, W/plan-edit-commands.cjs:46). Row: R4-N24's assertions on the fork-moved base, R1 and R2.
- B-R25C-4 (K05; FC01 :544): (v) "FC01's LEGACY_PENDING rules (E/native-load.cjs:221-222 in evaluation, :544 in transition) are
  unchanged", spec B/:127 (a finished entry is not active), the same reading the PM paid for :222 as B-R24F-3. Input: the
  landingScenario yes over a base with a FINISHED legacy DEBUT (done 1, state ESTABLISH, newW 95). Head, R1 and R2: effects
  [queued], the native DEBUT 105 pending, no LEGACY_PENDING. Mutant: issues [LEGACY_PENDING queue], effects [], no queued entry:
  the athlete's accepted yes never applies. done true: equal on both (control). Row: that fold, done 1 and 'yes', R1 and R2.

## NAMED DEBTS (new; none blocks alone)
- D-R25C-1 (LOW; H01): after close(), project() and check() still refuse (0 writes) but with SESSION_CHANGED instead of
  NATIVE_LOAD_CAPABILITY_REQUIRED (probe after-close: head [false, CAPABILITY_REQUIRED, refused, 0 offers], mutant
  [false, SESSION_CHANGED, refused, 0]). Fail-closed either way; the code is :170/:188's. One assertion on an existing cell.
- D-R25C-2 (MED; H05): the lost-acknowledgement recovery of :172 ("read the authenticated operation log ...; report
  already-saved only if found and folded") has no cell; every retry cell reaches the EARLY lookup. Needs a fault seam that
  commits then throws; I did not build one, so no measured difference is claimed.
- D-R25C-3 (LOW; H04): savedResponse's "and folded" clause (:172) is unpinned; I found no guarded-host input where a response
  with the held issuance is on disk and not folded. Reachability not shown.
- D-R25C-4 (LOW-MED; H08): the registrar's own refusal of a non-ready fold (TB :528) is pinned by no host cell. A generation with a
  nonempty sourceImports AND a native record (committed through the repository as R24S-HOST-IMPORTED-SOURCE-REFUSAL commits its
  collection) would reach FC03 :566 in the registrar, where the mutant registers an empty state; not measured here.
- D-R25C-5 (ruling first; H10): the moment-only duplicate (see Q3). :149 vs :172.
- CARRIED, re-measured LIVE here: Fable D-R24-F-3's superseded-issues half (H12), builder S24-H05 (H14), Claude D-R24-O-3 (H15).
- CARRIED unchanged (the report's Round 25 section 8 list): Fable D-R24-F-2/-4/-5; Claude D-R24-O-1/-2/-4/-5; Astra's eighteen
  D-S24-* and D-L17-BYTES/-ADMISSION/-WALK/-UI/-MULTI-ENTRY; D-L12-ISSUANCE, D-L14-HOST-MUTANTS, D-L13-TYPED-C2,
  D-R13-LEGACY-OVER-NULL-ASK, D-R13L1-3, D-R13L1-2, D-L14-RECOVERY, D-L12-CUSTODY, D-L12-CONFIG, D-L14-CALIBRATION, D-L14-CI,
  D-L14-OWNER, D-L15-EQUIVALENCE, the spec :81 multi-entry capture limit.

## Q5. Property walks (head, new seed ranges, NATIVE_LOAD_PROPERTY8_ALL / _ALL=1 so no early stop)
- R8 propertySequence8, seeds 20295001..20296500 in three shards of 500 (s1 20295001, s2 20295501, s3 20296001): 0, 0, 0
  counterexamples; union 1500 seeds, 0. Coverage (s1/s2/s3): train 1915/1900/1903, capture-ask 666/751/626, capture-card
  2346/2247/2378, legacy 230/216/228, reopen 242/256/238, undo 454/465/470, effect:adopted 166/187/186, effect:missed 11/-/-,
  issue:EFFECT_CONFLICT -/84/70, issue:RECORD_INVALID 43/-/45 (S\out\walk8-s*.json).
- R7 walk, seeds 20297001..20298000 (1000): 0 counterexamples (train 2997, undo 458, reopen 497, effect:landed 6).

## Q6. Owed
- The four blocker rows above (test bytes only), each red first under its mutant; then a re-read.
- Unchanged and not run here: the w6 admission cells and local-source-commit/-consumer suites (CI only, STOP-R21B-1); the 80-file
  set (exclusive); exact-head Windows/Linux CI; protected conformance; successor pins/receipts; seal custody; every owner gate.

## What I did not verify
- The builder's 160-mutant sweep and 55 NOT-RUN were not re-run; the round-24 kill table re-run is the author's (not repeated).
- The lost-ack path (D-R25C-2) and the registrar non-ready path (D-R25C-4) were argued from code, not executed.
- Old-app src is not readable here; reachability is judged over the readable rebuild writers and the spec's named classes.
- Disclosures: my scratch runner reused the r24 reviewer's runner pattern (own files, S\run.ps1). Every node run went through
  node %TEMP%\pm-run.cjs shared (jobs claude-r25-l1-a..e), ONE slot, chained by done markers; a duplicate waiting launcher
  (launche.cmd, started twice) was stopped before it took a slot, so jobe ran once. No lock file touched by hand. Read-only
  looks at other scratch: %TEMP%\nlr-r25-scratch\pre (hashes and prefix only), the r24 Claude scratch (runner pattern only).
  No other R25 review file was opened. DECISIONS.md was read at origin/rebuild/t2-client-core :847 only (extracted to S).
- Protected five, src/, ledger, conform/private, soak and prepledger-dev paths were never read, listed, grepped or loaded.
  One Get-ChildItem -Recurse over rebuild/m3 and rebuild/m4 listed file names (node_modules, soak, ledger, private, src excluded
  by path filter before any content was searched) to look for SCOPE_MISMATCH and createNativeLoadHost users.
- No commit, push, stage, fetch into another worktree or DECISIONS write; this is the only file written in earned-nlr.
