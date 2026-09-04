EARNED CONFORMANCE SUITE v3 — REVIEWER COVER                                              2026-09-04
==========================================================================================================
Sol suite pass 2 (on v2): FIX AGAIN, 10 findings + "do not defer" + a 12-point bar. Every finding was
EXECUTED before this cover was written; v3 answers each with code the runner proves. `node run.cjs` →
SUITE CONSISTENT (3 s); `node run.cjs --selftest` → SELFTEST PASS (26 s; ten runner witnesses below).
Owner ruling being executed: "Go — client first, spec-as-tests now, parallel build later."

THE 12-POINT BAR, EACH WITH THE CODE THAT PROVES IT
  1  Adapter-load error handling ........ run.cjs step 6: ABSENT only on an exact MODULE_NOT_FOUND for the adapter's
     own path AND the file not existing; a syntax error, a throw at require, a missing transitive dependency, or a
     module without create() is HARNESS_ERROR → INCONSISTENT. Self-test (a): three such adapters, three INCONSISTENT.
  2  Independent T2/T3 presence ......... presence is decided PER FAMILY (authority · client · policy · progression);
     a law file's family sets its expectation. Self-test (b): none / client-only / authority-only / both → each
     CONSISTENT with client GREEN + authority RED, authority (+ soak) GREEN + client RED, both GREEN + policy RED.
  3  External frozen law manifest ........ laws/manifest.json (99 ids, per-file counts, families, cites; frozen
     2026-09-04) compared BOTH directions by run.cjs step 1; self-test (c): a deleted law and a renamed law → each
     INCONSISTENT. Coverage (coverage/manifest.cjs) maps EXACT ids to sections, both directions (an uncovered law id
     fails the run; a section naming a non-existent id fails the run). No prefix matching; the PORT ids are frozen
     per mode and the run's observed GREEN ids must equal them exactly. SEPARATELY_GATED sections now name gate
     artifacts (gates/gates.json): {gate, result, inputs[{path, sha256}], impl{path, sha256}, clock, tz} for rigs
     175–184 — the runner re-hashes every input and impl file, requires passed == total and the clock/zone to match.
  4  Canonical-v1, candidate-bound ........ lib/canonical.cjs is ONE reference encoder: NFC strings, sorted maps, sorted
     + de-duplicated SET fields (causal_parents), canonical decimals (no exponent, no trailing zeros, −0 → 0;
     non-finite encodable so an op can exist and be REJECTED), absent ≠ null ≠ value, units inside quantities.
     Law B-A1-canonical-v1 calls the CANDIDATE's commitmentOf on map-permuted, set-permuted (+ duplicate), NFC/NFD,
     160.0 vs 1.6e2 vs 160.1, 1e21 / 1e-7, lb vs kg, and absent/null/value envelopes, and checks each equals the
     reference encoder — and that the client's STORED op commitment equals its own commitmentOf on the envelope
     minus itself. Six mutants, one per dimension (maps unsorted, sets unsorted, no NFC, JSON numbers, null
     collapsed, self-included), each caught. Sol's two executed witnesses (["p1","p2"] vs ["p2","p1"]; "café" NFC vs
     NFD) now produce EQUAL commitments (verified).
  5  Real conflict-selection op ........... lib/ops.cjs builds the A3 conflict-selection kind {conflict_domain_id,
     conflict_domain_lineage_id, requested_transaction_id, seen_conflict_basis, chosen_alternative_commitment}.
     Laws: both concurrent maxima retained, NUMERIC lineage-key order (key [2] beats [10]; the string-order mutant is
     caught), admission + CAS ONE atomic commit (crash injection between them → UNAVAILABLE, nothing torn; retry
     commits once; replay returns the durable result), stale seen_conflict_basis → retained non-applied History
     (BASIS_STALE), lineage mismatch → REJECTED LINEAGE_MISMATCH, a chosen alternative that is not a maximum →
     REJECTED, N = 3 alternatives → one selection whose parents cover every maximum, exact parameterized copy
     ("Earned found 3 current versions of Press's plan … 2 alternatives are in History." / "Review 2 alternatives";
     never "arrived first").
  6  Ownership + local lease validation ... ownership is a per-op SET of athletes (never overwritten): Sol's two-
     athlete same-op-id witness now ACCEPTS the child (law A2-operation-ownership-is-PER-ATHLETE). localCommitter
     validates the lease signature (a forged lease → saved:false, state 20), device AND athlete binding, lease id,
     schema version, not_before, not_after by the monotonic high-water clock (rollback does not revive), range,
     restore continuity. Sol's executed witness (forged lease → saved:true) is now saved:false (verified).
  7  Port census v3 + semantic mutants ..... records DTO now carries queue {newWSets, state, gate, rule, text}, feed
     {how}, SIGHTINGS per lift (topAt/topRun — required, from state), VOLUME RECEIPTS parsed from the feed (engine-
     independent), lifts INCLUDING retired ones with renames/forks; migration is BOUND to behaviour ({sourceSchema,
     recordsChangedByMigrate per class}) rather than an echoed schema number. SENSITIVITY now includes SEMANTIC
     ENGINE/INPUT MUTANTS BEFORE census generation — wrong target for one lift, dropped former name, missing volume
     receipt, stale sighting record, missing proposed-debut vector, altered Today copy — each DETECTED on every
     fixture where the feature exists; a SYNTHETIC pending-debut fixture (oracle/make-synthetic.cjs: two pending
     debuts with newWSets, a two-rung PROPOSED offer, a former name, a volume receipt; generated series, shippable)
     proves the debut-vector path the live fixture cannot. Leaf sensitivity is now O(n) (all leaves perturbed at
     once + 40 single-leaf samples); diffPaths is linear (the v2 comparator was quadratic — 70 s → 1 s).
  8  Client-state witnesses ................ B10: plan(), acceptedPlanTransactions() and the face agree BEFORE any
     action; a hidden-accepted-plan mutant fails. State 17: a LIVE client with two durable unsynced entries is revoked
     → refuses new writes, keeps the typed value, RETAINS the two entries, promises no sync, names the resolution.
     State 8: the client DERIVES the instance from the stored offer content (two devices, same offer → same
     instance; a different generation → different; a counter mutant fails). State 5: the fallback is DERIVED from
     complete-group plan provenance (txn A authored 250×3 → B consented 255 inherited → C authored sets 4 with
     inherited press): suspending B yields {press 250, sets 4}, excluding the inherited 255. State 14: candidate
     edge (same slot / AD_HOC, equal dates or the 23:59→00:01 envelope, never across a week), generation advances
     on late start / tombstone, SAME WORKOUT with disagreeing starts requires a governing-basis selection that never
     mutates the plan, collisions → duplicate classes with ONE canonical op + unique slots for distinct attempts,
     gates still run, nothing deleted, History "Sets from two devices were combined." D14: TODAY-only failure,
     BOTH (sorted [PLAN_HORIZON, TODAY]), Today-governs, plan-governs and a tie (both scopes govern).
  9  PACK-3 progression witnesses .......... P6 every writer (classic, two-rung, one-sighting) carries newWSets
     ([60,60,55] / [65,65,60] / [60,60,55] from [55,55,50]); P7 taking the two-rung 65 supersedes the standing 60
     (another lift untouched); P8 completing adopts the vector (load 65, line 65·65·60). Plus P1–P5 from v2.
 10  Deferred areas closed ................. NEW LAWS for A4 payload completeness per class (+ central estimate inside
     endpoints) and reclassification compatibility (a reading's morning/late class only; otherwise a complete
     destination payload; the old payload never reinterpreted); A5 undo (eligible only when the target is the
     unique unsuspended maximum with a matching effect digest and the sealed BEFORE-group commitment; compensation
     appended by CAS; otherwise retained with "Undo couldn't be applied — the plan changed first: 170 protein_g is
     in effect."; never overwrites a later transaction); state 8 identity + coverage (an unrelated op after the
     watermark PAUSES with reason-coded copy; a basis confirmation proceeds; Keep → decision_settled_no_effect;
     contradictory answers → conflict_suspended; apply idempotent by apply_request_id; at most one effect per
     instance); states 11 (logging continues, sync paused, "Sign in to sync", never blocks a set), 12/18 (nothing
     paints before the integrity check; restore required → sign in → restoring → restored | failed; never first use;
     lost unsynced entries declared by count when the ledger survived, declared unknowable when it did not), 13
     (rebuilt from durable ops; "Last saved: Set 1 of Press."; a draft line only with a durable marker), 15
     (semantic order = causal parents; device_seq never causality; two arrival orders reduce identically), 16
     (export "Complete through W2 for all synced records"; PARTIAL with the pending count; the other-device note).
     Still DEFERRED (2, owner approval requested): state 8 consent_digest exactness + decline-fingerprint recurrence
     halves (A6's second commitment); §E blueprint (design track). The Protocol is SEPARATELY_GATED by a hash-pinned
     artifact (rig184: 10/10 over Protocol v1.1 + sheet v1.7.38 + rig184.cjs), not a string.
 11  Private-log leakage .................... every private-fixture law line carries the constant "[private fixture:
     detail withheld in code]" — no count, path, value or error text (v2 leaked "sets 321 → 321"); run.cjs step 7
     asserts every PORT-live line is verdict-only; self-test (d) plants canaries in the read COUNT, queue text, feed
     text, a lift name, a nested rule and a note, runs golden/check/sensitivity on the canary fixture and scans
     stdout + the log: 0 escaped. Permitted inventory for the private fixture = law id + verdict, nothing else.
 12  Red-first mutations for every repair ... every new or rewritten law carries targeted mutants (99 laws, 99
     STRONG, 0 WEAK, 0 NO_MUTANT); the runner's own repairs are covered by the ten self-tests.

PACK-3 CARRY-FORWARD (engine track, unchanged): FIX AGAIN stands; FIX-4c is with Claude Code (same-day maximum,
former-name mint, and the §6 prose: the queue-order divergence does NOT settle — a disclosed REBUILD obligation,
law P5). rig185 on the frozen main engine (fe516c1): W1 PASS, W2 PASS (informational step 9).

WHAT THE SUITE FOUND THIS ROUND (its own defects, fixed): the v2 comparator re-canonicalized every subtree at
every level (quadratic); the reference authority's global op-owner map (Sol's finding 6a); the undo law's and the
state-19 law's evaluation-order bugs in their own assertions; the canary self-test's first fixture collided read
dates that migrate de-duplicates (a fixture defect, not a leak).

ADAPTER CONTRACTS (the laws are the spec; the reference models show one conforming shape)
  authority.create(cfg, hooks?) → admit · log · frontier · disposition · dispositionHistory · verifyDisposition ·
    injectCrash/clearCrash · plan · planTransactions · planOfDomain · planState · txnDigests · revokeDevice ·
    issue · apply · confirmBasis · instanceOf · instanceState · exportSnapshot · localCommitter(lease, clock)
  client.create(opts, hooks?) → (v2 surface) + revoke · outboxRetained · signInRequired · syncStatus · storageLost ·
    restoreFlow · resumeAfterKill · acceptedPlanTransactions · deriveInstance · planHistory · fallbackBefore ·
    candidateComponent · advanceGeneration · resolveSameWorkout · resolveCollisions · conflictFace · commitmentOf
  policy.create(cfg, hooks?) → protein() · floor() · governingSource() · leanInterval()
  progression.create(cfg, hooks?) → setsAtTime · mintJointEarn · queueAppend · reconcileDebuts · mergeQueues ·
    writers{classic, twoRung, oneSighting} · takeProposedDebut · completeDebut
  engine (censused): migrate exActive targetsFor currentRate regime progressionTrend calorieTarget cutRateBand
    calorieFloor proteinTarget observedTDEE statusFace statusTarget + records(state) → the RECORDS DTO v3

VERDICT REQUESTED: RATIFY (build authorization), or OBJECT with the law id and the sheet line it misreads, or
FIX AGAIN naming the laws to add. Owner: please rule on the 2 remaining DEFERRED sections.

RUN SUMMARY (2026-09-04, clock 2026-09-03 America/New_York)
  OK 0 env · OK 1 frozen inventory (34 + 35 + 20 + 9 + 1 = 99) · OK 2 port (10 frozen ids) · OK 3 sensitivity
  (13 frozen ids; 6 semantic mutants detected) · OK 4 reference 99/99 · OK 5 mutants 99 STRONG · OK 6 adapter
  loading + families absent → 99 RED(as specified) · OK 7 privacy · OK 8 gates 10/10 verified + coverage 26 TESTED /
  2 SEPARATELY_GATED / 2 DEFERRED, 0 uncovered ids · INFO 9 rig185 W1 FAIL W2 FAIL · SUITE CONSISTENT
  SELFTEST PASS: (a) ×3 (b) ×4 (c) ×2 (d) ×1
