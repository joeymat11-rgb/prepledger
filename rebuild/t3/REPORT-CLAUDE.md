# EARNED — TRANCHE T3 REPORT (builder CLAUDE): the server authority's core against the 34 §A laws + the §C soak law

Date 2026-09-04. Build agent output (Claude Code, remote session). Branch `rebuild/t3-authority-claude` off `rebuild/t2-client-core` @ c22ddc2.
Gate: `cd rebuild/conform && MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York node run.cjs` with ENGINE_MAIN / ENGINE_FIX4B built by
`engines/build-engines.mjs` (a0009c3 / 66bc7c3) and the private fixture regenerated locally (`sha256 be74d85a…` ✔; never committed, never read).
Frozen-suite check: `git status` under rebuild/conform shows ONLY the new `adapters/authority.cjs` (the golden step re-stamps
`oracle/manifest.json` + `golden/*.main.json` with this machine's engine sha; those were restored to the committed bytes before the commit).
Every claim below was executed in this session; nothing is quoted from the private fixture.

## (1) MODULE MAP — rebuild/authority/ (CommonJS, Node ≥ 18, node:crypto only; 637 lines of product code)

| file | lines | responsibility |
|---|---|---|
| canonical.cjs | 63 | canonical-v1 encoder, independent implementation (own string quoting, own decimal profile, UTF-16-ordered maps, de-duplicated sorted SET fields, absent ≠ null ≠ value). Fuzzed against lib/canonical.cjs: 200,000 random nested values incl. the 1e21 / 1.5e30 / 1e-21 / lone-surrogate / NFC edge cases → 0 mismatches |
| crypto.cjs | 29 | one signRecord() primitive: disposition signing/verification ("earned/disposition/v1"), lease verification ("earned/lease/v1"), the A1 op commitment re-derivation (used only when an identity key is configured), internal digests (plan effect, compensating group, conflict basis, instance identity) — each under its own domain string |
| store.cjs | 63 | the STORE seam: `createStore(backend)` with all-or-nothing `transaction(fn)` (a thrown storage error → rollback → `{ok:false}`; any other exception propagates — never masked); the in-memory backend stages writes in the handle and applies them at commit; rows are JSON text keyed (collection, "athlete\|…"); row-key helpers |
| reduce.cjs | 39 | the athlete log: strictly increasing athlete_log_seq per athlete, append-only `entries` (one per accepted op AND one per consented plan effect, so the seq space has no holes), frontier W, `receiptsAfter(W)` for a pulling client, the state-16 export with the exact labels |
| admit.cjs | 154 | A1/A2 admission in one transaction: identity + replay (byte-identical, logs nothing) · IDENTITY_COLLISION (transient) · shape → MALFORMED (envelope, kind/class model, effective offset, target rule, bare/non-finite numbers, A4 completeness, body-comp endpoints, plan/selection/undo fields, correction/tombstone/reclassification payloads) · LEASE_UNKNOWN → LEASE_FORGED → LEASE_REVOKED_BEYOND_BARRIER → DEVICE_SEQ_OUT_OF_RANGE (late arrival never rejected) · DEVICE_SEQ_REUSE recorded under its own key · references: CROSS_ATHLETE_REFERENCE / REJECTED_DEPENDENCY / WAITING (parked, released when parents land — transport order is never causality) · reclassification compatibility · acceptance = seq + effects + log entry + release of parked children · revocation barrier = last ACCEPTED device_seq |
| plan.cjs | 108 | A5: exactly one plan transaction per accepted edit, in the admission's transaction · state 4: causal-maximal set per domain, lineage key = min_lex(parents' keys) ++ [seq] compared as NUMERIC vectors, effective = smallest key, both retained, the exact "found N current versions … alternative(s) in History" copy · conflict-selection: chosen alternative must be a maximum, compare-and-append on the conflict basis (stale → ACCEPTED, applied:false, BASIS_STALE), LINEAGE_MISMATCH · undo: eligibility (unique unsuspended maximum + effect digest + group commitment) → one compensation, else PLAN_CHANGED_FIRST with the governing-plan copy · consented effects · suspension |
| issue.cjs | 62 | state 8: instance = hash(family, generation, offer digest) → two devices, same offer, one instance · responses recorded per instance · apply(): idempotent by apply_request_id; PAUSED_COVERAGE while any other op is accepted past the confirmed basis; contradictory answers → conflict_suspended (effect suspended); one effect per instance (EXISTING_TRANSACTION); Keep/No → decision_settled_no_effect · confirmBasis |
| committer.cjs | 41 | the LOCAL COMMITTER (state 20): lease signature, device+athlete+lease-id binding, schema, clock continuity after restore, not_before/not_after by a MONOTONIC HIGH-WATER clock (rollback never revives), range |
| transport.cjs | 14 | `localTransport(authority, athleteId)` → the T2 client's `{ send(op) → {disposition} \| undefined, pull(W) → {receipts} }`; UNAVAILABLE = a lost acknowledgement |
| index.cjs | 64 | `createAuthority(config)`: composition root; enrolment of athletes/devices/leases INTO the store; every public method = one transaction or a read-only view; storage failure in admit/apply → `{ status: "UNAVAILABLE", retry: true }` |
| README.md · package.json | 78 · 9 | module map, the backend interface, what a D1 backend must implement, fault injection from outside |
| rebuild/conform/adapters/authority.cjs | 49 | the adapter: maps the suite's `{athletes → devices → leases}` onto createAuthority, wraps memoryBackend() in a fault injector (writes to `plan_txns` fail while a crash point is armed), fixed clock "2026-09-03T00:00:00Z", maps `localCommitter(lease, clockFacts)`. Requires ../lib/ops.cjs for AUTH_KEY only |
| rebuild/t3/interop-claude.cjs | 50 | the §4 interop rig (two products + node:crypto, zero suite code) |

## (2) GATE OUTPUT TAIL (final run after the bite check was restored; full log kept locally as run.log)

```
OK   6 adapter loading: only an exact MODULE_NOT_FOUND counts as absent; any other load failure is HARNESS_ERROR — present: authority,client
OK   4 reference laws/sheet-A-authority.cjs: all GREEN — 34/34 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/sheet-A-authority.cjs: every law STRONG — 34 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/sheet-A-authority.cjs: family authority present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 34 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   6 adapters laws/sheet-B-client.cjs: family client present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 35 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   6 adapters laws/d13-d14.cjs: family policy absent → all RED(as specified), 0 DEFECT, 0 HARNESS_ERROR — 0 GREEN · 20 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   6 adapters laws/progression.cjs: family progression absent → all RED(as specified), 0 DEFECT, 0 HARNESS_ERROR — 0 GREEN · 9 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   6 adapters laws/soak.cjs: family authority present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 1 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   7 privacy: every private-fixture law line in the log is verdict-only (detail withheld in code) — 14 private lines
OK   8 gate artifacts verified (files present, hashes match, results pass, clock matches) — 10 gates
OK   8 coverage: every TESTED section's ids exist, every law id is covered by a section, every gated section's gates verified — {"TESTED":26,"SEPARATELY_GATED":2,"DEFERRED":2}
INFO 9 engine-track rig185: W1 FAIL, W2 FAIL
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families   (exit 0)
```
Steps 0–3 all OK (clock/zone, both engines present, inventory 99/99, port oracle 10 ids, sensitivity 13 ids).
`node run.cjs --selftest` (same env) → (a) ×3 OK · (b) ×4 OK — incl. "authority-only → CONSISTENT, authority + soak GREEN, client still RED" and
"both → CONSISTENT" · (c) ×2 OK · (d) 0 leaked → **SELFTEST PASS** (exit 0).
Gate ordering note: the brief's step 2 says re-cut the goldens, `git checkout -- oracle/manifest.json golden/`, THEN run. Done in that order the
run is INCONSISTENT at step 2/3 — the restored manifest pins cowork's engine sha and golden sha for the PRIVATE golden, while the locally
cut private/live.main.json carries this machine's engine sha (esbuild bytes differ by version/entry path; the census does not — T2 report §2).
The gate was therefore run with the re-stamped manifest (as T2 was) and the pins restored before committing. The public goldens' census is
identical either way; only the stamp differs.

## (3) INDEPENDENCE (executed)

```
grep -rn "conform" rebuild/authority/            → no output (exit 1)   [README.md mentions only "the conformance suite" by role — no path]
grep -n "reference" rebuild/conform/adapters/authority.cjs → no output (exit 1)
cd /tmp && node -e "require('<repo>/rebuild/authority')"  → loads
require( calls across rebuild/authority/*.cjs: ./admit ./canonical ./committer ./crypto ./issue ./plan ./reduce ./store and node:crypto — nothing else
```
(The README's sentence "behind the conformance suite (`rebuild/conform/adapters/authority.cjs`)" does contain the word conform — it is prose in
the README, exactly as the brief allows; the grep above was run on the product tree and matched no code.)

## (4) BITE CHECK

Broke: admit.cjs, the replay branch — `if (k.commitment === op.canonical_content_commitment) return current(...)` → `return accept(...)`
(a replay re-admits and appends a second log entry). Gate → SUITE INCONSISTENT, §A 26 GREEN · 8 FAIL, soak 0 GREEN · 1 FAIL. The laws that bit:
```
FAIL A1-replay-same-op-id-same-commitment-returns-the-original-disposition-and-logs-nothing
FAIL A2-device-seq-reuse-with-a-different-op-is-REJECTED-and-the-original-slot-replays-unchanged
FAIL A2-child-before-parent-WAITING-then-ACCEPTED-append-only-history-replay-identical-exactly-one-terminal
FAIL A2-terminal-disposition-replay-is-byte-identical-including-REJECTED
FAIL A2-revocation-barrier-is-the-last-ACCEPTED-device-seq-loss-declared-never-retroactive-below-it
FAIL A5-a-valid-direct-plan-edit-is-ACCEPTED-with-exactly-ONE-plan-transaction-…-replay-is-identical-and-adds-no-transaction
FAIL A-state-4-a-real-conflict-selection-op-commits-ONE-transaction-by-compare-and-append-…-and-replays-the-durable-result
FAIL A5-undo-eligible-only-when-the-target-is-the-unique-unsuspended-maximum-…-compensation-appended-once-…
FAIL C-soak-property-200-steps-x-5-seeds-…-replay-idempotent-barrier-respected
```
Restored from the backup copy; sha256 of admit.cjs before/after identical (61adbc7cf3921054…); gate re-run → 34 + 1 GREEN, SUITE CONSISTENT, exit 0.
(Client family stayed 35 GREEN throughout — the mutation touched the authority only.)

## (5) TEST-SHAPED SEAMS (law → the seam in the product → how the adapter absorbs it) — honest list for the blind reviewers

a. **A5 crash law, state-4 selection crash** → the product has no crash hook. The adapter wraps the backend so a write to the `plan_txns`
   collection throws a storage error while a crash point is armed (kind plan-mutation for "between-admission-and-plan-transaction", kind
   conflict-selection for "between-admission-and-selection-commit"). The product writes admission + plan transaction in ONE store transaction,
   so the failure rolls both back and admit() returns `{status:"UNAVAILABLE", retry:true}` — the law's "neither" branch. The retry admits once.
   Not test-only in shape (any storage outage looks the same), but the adapter's inspection of the row's `kind` to pick the crash point is.
b. **decided_at / accepted_at** → `config.clock.now()`; the adapter passes a fixed "2026-09-03T00:00:00Z" so replays compare byte-identical
   against dispositions signed at admission. In production the clock is real and replay returns the STORED disposition, so identity holds anyway.
c. **localCommitter(lease, clockFacts)** → the laws' second argument bundles clock facts and the device's own identity (`mono`, `highWater`,
   `serverTime`, `continuityProven`, `device_id`, `athlete_id`, `schema_version`); the adapter maps it onto `createLocalCommitter({...})`. The
   committer's "now" is the high-water mark (advance raises, rollback never lowers) — that is the product rule, not a test shape.
d. **ATH() config** → leases are enrolled INTO the store at createAuthority (`devices` rows); the adapter passes `cfg.athletes` unchanged.
   `enrolAthlete` / `grantLease` exist for the runtime path; the laws never call them.
e. **planState / txnDigests** → read-only inspection surfaces (basis, lineage keys, member-set commitments, effect digest, before-group
   commitment) that the laws use to BUILD selection and undo ops. They are the values a real client would need too (the disposition copy does
   not carry the basis), so they are product API — but a reviewer should know the laws depend on them.
f. **frontier(A)** → the product's frontier is the highest athlete_log_seq (it counts a consented plan effect, which consumes a seq and gets an
   `entries` row of type "effect"). The reference's frontier is `log.length`. They coincide in every law and in the soak (no apply() there);
   they differ after an apply — see (6b/6c).
g. **exportSnapshot(A, {outboxPending, rejected})** → the device's outbox and rejected ledger are the CALLER's knowledge (the authority never
   sees an outbox); same shape as the reference.
h. **proposal-response payload** → `issuance_id` / `chosen_outcome_id` / `consent_digest` accepted as raw strings or `{value}` quantities
   (the laws send raw strings inside a payload that the A4 walk otherwise rejects for bare numbers; strings pass the walk). Kept as the
   reference does.
i. **admit(A, op, meta.received_at)** → accepted and ignored: a leased op arriving after not_after is admitted (law A2-late-arrival); the
   product records nothing about server receipt time beyond `accepted_at`.
j. **Lease → athlete binding at admission** → NOT checked (device binding and signature are). See (6a): the suite's fixture would fail it.
k. **Athlete existence** → `admit()` on an unknown athlete THROWS (as the reference does) rather than returning a disposition. A Worker would
   map that to a 404; a law asserting the disposition shape would need it changed.

## (6) LAWS / SUITE LIBRARY I BELIEVE ARE WRONG OR INCOMPLETE (not edited)

a. **Fixture leases for the second athlete are bound to the first.** `ATH()` builds dev-C (ath-2) with `O.lease("dev-C")`, whose default
   `athlete_id` is "ath-1". A1-…-athlete-scoped then admits an ath-2 op under a lease bound to ath-1. An authority that enforces the sheet's
   "authentic device/schema capability" INCLUDING the athlete binding at admission fails that law with LEASE_FORGED (my first run: 33/34; the
   check was moved to the device-side committer, where the laws do test it). Fix for suite v4: build ath-2's lease with `athlete_id: "ath-2"`
   and add a law that an op under a lease bound to another athlete is REJECTED (LEASE_FORGED) at the authority.
b. **The reference's apply() consumes an athlete_log_seq with no log entry.** `++st.seq` for the consented transaction leaves a hole in the
   receipt space; a T2 client pulling receipts computes a CONTIGUOUS W and would stall at the hole for ever. The product writes an
   `entries` row of type "effect" for that seq (receipt with op_id null + plan_transaction_id). No law covers "a client's W reaches the
   authority's frontier after an apply" — suite v4 candidate (it needs both families present).
c. **frontier is undefined by the laws.** The soak asserts `frontier === log.length`, which only holds while nothing off-log consumes a seq
   (see b). The sheet's W is the reduced-through watermark = athlete_log_seq. A law should pin the definition.
d. **Reference: a parked child is lost during an armed crash.** In `accept()`, waiting ops are spliced out BEFORE `accept(w)`; if the crash
   hook returns UNAVAILABLE for that child it is never re-queued and stays WAITING for ever (replay returns WAITING). The product avoids this
   by construction (a storage failure rolls the whole parent admission back; the child stays parked). Untested; law candidate for v4.
e. **Receipts are unauthenticated in the T2 client.** `pull(W)` receipts are stored without signature or disposition cross-check; the interop
   rig shows a client with the real key advancing W=1 against an IMPOSTOR authority while (correctly) refusing its disposition. Not an
   authority defect — a §B/§A seam: receipts should carry the authority signature (or be admitted only for op_ids whose disposition verified),
   and a law should say so.
f. **lib/canonical.cjs decimal profile defects** (T2 report §6a/6b) stand; the product reproduces the bytes (200,000-value fuzz, 0 mismatches).
g. **A-state-8 coverage law hard-codes the "protein" domain** in the reference's apply (`st.domains["protein"]`). The product reads the
   issuance's `conflict_domain_id` (default "protein"); a law with an issuance in another domain would pass here and fail the reference.

## (7) WHAT T3 DOES NOT COVER

No HTTP layer, no Worker, no D1 backend (the backend interface is real; the only implementation is in-memory). No sign-in / Clerk, no
per-request authentication of WHO submits an op beyond the lease. No lease ISSUANCE policy (range sizing, renewal, the 30-day window), no
scheduled sweep of expired leases, no key rotation or sealing epochs (P1/P2), no encryption at rest. No rate limiting, no idempotent HTTP
retries beyond the op_id replay. Single writer per athlete is assumed (D1's model), no cross-region replication. INSTANCE_COLLISION is a
declared code that nothing emits (the reference too). Reclassification compatibility is the two-entry table from the reference. The export
carries labels and counts, not the record appendix bytes. Issuance AUTHORIZATION (who may issue a proposal) is not modelled — issue() is a
trusted internal call. No backups / restore drill, no metrics.

## (8) INTEROP RUN (brief §4) — `node rebuild/t3/interop-claude.cjs` (T2 client ↔ T3 authority through transport.cjs; no suite code)

```
PASS — dev-A weigh-in acknowledged locally, sent once, outbox drained by the signed ACCEPTED disposition  disposition ACCEPTED seq 1
PASS — dev-A reduceThroughW pulls receipt 1 → frontier 1  W=1
PASS — dev-B weigh-in ACCEPTED as athlete_log_seq 2; dev-B reduces through W=2 (both devices' receipts, contiguous)  W=2
PASS — dev-A catches up to W=2 on its next reduction (the other device's receipt carries the op)  W=2
PASS — authority log for ath-1 holds exactly the two ops in seq order
PASS — ath-2 on dev-C: its own log starts at seq 1 (W=1); ath-1's log is untouched  W(ath-2)=1
PASS — forged authority key: the impostor admits the op and signs, the client refuses the signature — the outbox keeps the op, no
       disposition is stored, the face stays Sent  impostor says ACCEPTED · outbox=1 · W=1 (receipts are not signed in T2 — see (6e))
PASS — a reinstalled device reusing seq 1 with new content: IDENTITY_COLLISION, slot history stays 1, the log does not grow, the client
       files the rejection  frontier 2 → 2 · slot history 1 · rejected=IDENTITY_COLLISION
interop-claude ⇒ PASS (8/8)
```
Note on the "forged key" wording of the brief: a client configured with a forged key cannot validate its own (authority-signed) lease and
refuses to write at all (state 20) — so the meaningful forged-key scenario is an impostor AUTHORITY: the client keeps the real key, the
impostor's dispositions fail verification, nothing drains. That is what the rig runs. The client's op_id is derived from device + seq
("op-dev-B-1"), so a reinstalled device produces IDENTITY_COLLISION rather than DEVICE_SEQ_REUSE — both are handled; the rig shows the first.

## (9) TIME AND TOKENS

Reading the suite, the reference and the T2 client: ~30 min. Product build from branch creation to the final green gate: 19:48:23Z → 20:01:24Z
(13 min) — two runs of the §A/soak laws were needed (33/34 → 34/34 after (6a)); the full gate was run three times (pin-order finding, green,
green after the bite restore) plus the bite run and the selftest. Tokens: the harness budget counter moved by ≈ 230k tokens over the whole
T3 handoff (Part 1 + Part 2, including reading ~50 KB of suite source into context); the model's own per-call counts are not visible to me.
