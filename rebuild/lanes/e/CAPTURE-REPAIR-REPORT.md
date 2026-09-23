# D-EPP-2 CAPTURE REPAIR, ROUND 2 (builder Claude Opus 5.5, 2026-09-23)
Worktree %TEMP%\earned-ecr2, rebuild/e-capture-repair-epp. Round 1 is committed at c596624 (red 2c7b142, EPP parent 0d38b8e).
This round is uncommitted on top and changes TEST BYTES ONLY. The product stays at engine-capture.cjs:69 (sha ae899082...).
Reviews read whole: Fable REVIEW-CAPTURE-REPAIR-l1.md (1cb74b92) and Astra ASTRA-CAPTURE-REPAIR-REVIEW-L1.md. Both ACCEPT WITH NAMED DEBTS.
Round 1: red 3/6 at the EPP head, green 6/6 after the one-line fix (the same wording as today.cjs:97 and writers.cjs:227).
It is the only by-lift debut lookup in m2/m3/m4 product code.

## Debts paid (red first)
D-CR-6 guard: the cell's Module._load guard now judges the request path BEFORE _resolveFilename, then the resolved file.
  CAP-G adds absent-path requests (seed.cjs, migrate.cjs, merge, index, oracle-shim.cjs under a nonexistent tmp rebuild/engine).
  RED with the old guard (r2-rows-oldguard.txt): 12/13 pass, CAP-G fails with "Cannot find module ...seed.cjs" and not PROTECTED.
  GREEN (r2-green.txt): 13/13, exit 0. In the mutation overlay, which holds NO protected file, the round-1 CAP-G fails and the new one passes.
D-CR-4 / Astra D4 / D-CR-5: seven new rows, each tied to a clause of :69-70.
  L1: a state-less legacy entry beside a PROPOSED is captured. D1: a done debut is ignored. O1: another lift's debut is ignored.
  K1: a same-lift non-debut kind is ignored. U1: an unlock is a move. A1: a lift that lost the structural slot keeps its old vector.
  C3: two DEBUT entries in the same state refuse.
  D1, O1, K1, U1 and A1 PIN PRE-EXISTING GATES AS-IS (!q.done, same lift, kind, 'unlock', isDebutNow). They are outside the grant; no behavior changed.
  Mutation run (mutate.cjs, 14 single-clause mutants, round-1 cell -> round-2 cell; r2-mutants.txt):
  drop PROPOSED: P1-P3 -> P1-P3 L1 U1        invert === PROPOSED: P1 P3 -> P1 P3 L1 D1 O1 K1 U1 A1
  state === 'DEBUT' (Fable M3, Astra M8): LIVE -> L1       lowercase 'proposed': P1-P3 -> P1-P3 L1 U1
  drop !q.done (Fable M4, Astra M4): LIVE -> D1            drop same lift (Astra M5): LIVE -> O1 A1
  drop kind filter (Astra M6): LIVE -> K1                  drop 'unlock' (Astra M7): C1 -> C1 U1
  drop isDebutNow gate (Fable M7): LIVE -> A1              drop plurality or >2: C1 -> C1 C3
  flatten vector: P1 P3 -> P1 P3 L1 D1 O1 K1 U1 A1
  selected[last] (Fable M9): LIVE -> LIVE. It is equivalent, because q is read only when length <= 1.
D-CR-3: engine-capture.test.cjs:80 now gives the PROPOSED newW 50 [50,30] (it was 45), and a comment is added at :82.
  Probe pin-probe2.cjs: on the pre-EPP engine (fe9f14b today.cjs:97) with the repaired capture, the OLD :80 (45) passes
  entirely (card 45, capture [45,40]), so it was blind to the engine's pick. The NEW :80 (50) gives card 50 and
  line 82 fails (RED). On the EPP engine: card 45 and [45,40] (GREEN). node --check passes. CI-only (PERFORMED_W6_DIR).

## Owed, not edited
D-CR-2 stale byte pins of engine-capture.cjs 309c75d8... (now ae899082299adfab63540d5735a889a9f99cb37588b05b23b614d6d404436c55),
  carrier entries this package owes to the EPP seal package (D-EPP-3). No sealed pin was edited.
  LIVE: rebuild/m4/spec/configured-history-candidate/run.cjs:24 (assert.equal in copy(), so the candidate run refuses).
  LIVE: rebuild/m4/import/test/s3/s3-portable-sources.json:418 (s3/current-head.cjs raises S3_SOURCE_DRIFT; the same manifest
  is already stale for today.cjs since EPP, and engine-provider.test.cjs:141-144 checks today.cjs from it: a pre-existing EPP debt).
  HISTORICAL (record past bytes by design, not re-pinned): about 60 hits under rebuild/lanes/** review evidence, annex and
  custody JSON (for example SCIENCE-AUDIT-INPUTS-SUPPLEMENT-3.json:10 and RECONCILIATION-CUSTODY.json:186).
D-CR-1 / Astra D1 / D2 (the S10 D-EPP-1 package): workflows are not edited. The exact step to add to .github/workflows/rebuild.yml
  public-gates, after the step at :272-273, named by path and not globbed:
      - name: E - D-EPP-2 workout preparation excludes an untapped PROPOSED
        run: node --test rebuild/m4/workout/test/engine-capture-proposed.test.cjs
  engine-capture.test.cjs and configuration-capture.test.cjs cannot take a plain step. They need a provisioned PERFORMED_W6_DIR,
  which no workflow sets, and the former's Source.baseline pin (3e908d2) has been stale since 0d38b8e. That package owes both.

## Files (uncommitted over c596624)
rebuild/m4/workout/test/engine-capture-proposed.test.cjs, rebuild/m4/workout/test/engine-capture.test.cjs and this report.
The sha256s are in the final summary. Scratch: %TEMP%\ecr-scratch (edit-cell.cjs, mutate.cjs, pin-probe2.cjs, r2-*.txt).
