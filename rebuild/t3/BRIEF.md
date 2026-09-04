# EARNED — TRANCHE T3 BUILD BRIEF: THE SERVER AUTHORITY'S CORE, BUILT AGAINST THE 34 §A LAWS (+ the §C soak law)

Date 2026-09-04. This brief is a BAKE-OFF: two builders receive this identical file and work independently, neither sees
the other's output, and the result is judged by the same automatic gate plus the owner's verification rigs. Builder
CLAUDE = Claude Code on the owner's PC, branch `rebuild/t3-authority-claude`. Builder ASTRA = OpenAI Codex (GPT-6 Astra)
in its cloud environment, branch `rebuild/t3-authority-astra`. Base for both: branch `rebuild/t2-client-core` at the
commit that carries this file. You are told which builder you are by the branch name you were given. Do not look for,
guess at, or reference the other builder's work.

## 0. WHAT EXISTS (read-only for you)

    rebuild/conform/                      the CONFORMANCE SUITE v3 (spec-as-tests; 99 laws). THE GATE is run.cjs.
      laws/sheet-A-authority.cjs          THE 34 §A LAWS your authority must satisfy — read every one; the exact codes,
                                          shapes, strings and ordering rules in them are the contract
      laws/soak.cjs                       the §C SOAK law (1): a seeded property test that drives your authority through
                                          random interleavings (two devices of one athlete + a second athlete) and checks
                                          the invariants after every step
      reference/authority.cjs             the REFERENCE authority (an in-memory MODEL that proves the laws satisfiable;
                                          NOT the product). Read it for semantics. You may NOT re-export it, copy it
                                          wholesale, or require it from product code or from the adapter.
      lib/canonical.cjs, lib/ops.cjs      the suite's canonical-v1 encoder and A3/A4 operation fixtures (ops, signed leases,
                                          AUTH_KEY "authority-signing-key-1", K_IDENTITY, hmac). The laws feed your
                                          authority complete A3/A4 operations built by lib/ops.cjs.
      adapters/client.cjs                 the T2 adapter — the worked example of an adapter (product behind the suite)
      gates/inputs/EARNED-RUNTIME-SHEET-v1.7.38.txt   the ratified sheet; every law's `cite:` points at its lines
    rebuild/client/                       the T2 product client (12 modules). Its `ops.cjs` has an independent canonical-v1
                                          encoder and `signatureOver()`; its `sync.cjs` shows the disposition shape the
                                          client verifies. Your authority must interoperate with it (see §4).
    rebuild/t2/BRIEF.txt, REPORT.txt      how T2 was briefed and reported — the report format to match.
    rebuild/ROADMAP.md                    the plan. Read it first.

EVERYTHING under rebuild/conform is FROZEN except the new `adapters/authority.cjs`. DO NOT modify laws/, reference/,
oracle/, lib/, coverage/, gates/, fixtures/, golden/, run.cjs, rig185.cjs, README-suite.txt, adapters/client.cjs.
If a law seems wrong, do not edit it — write it up in your report. NEVER commit anything under rebuild/conform/private/
or rebuild/conform/engines/*.cjs (both gitignored); never paste their contents anywhere.

## 1. WHAT YOU BUILD

(a) THE PRODUCT: `rebuild/authority/` — the server authority's core as REAL PRODUCT MODULES (CommonJS, Node ≥ 18, zero
    npm dependencies, node:crypto only). It is the code that will run inside a Cloudflare Worker over D1 (decided by
    the owner 2026-09-04), so: pure logic over an injected STORE interface (no Node-only APIs in the core, no file
    system, no timers, no globals), one composition root, storage and clock injected. Suggested decomposition — refine
    it, but keep one responsibility per module and keep the store seam real:

      canonical.cjs     canonical-v1 encoder — an INDEPENDENT implementation (spec in §3; must match lib/canonical.cjs
                        byte-for-byte; you may not require the suite's encoder from product code)
      crypto.cjs        HMAC-SHA256 primitives; disposition signing over "earned/disposition/v1" || encode(disposition
                        minus authority_signature) with the authority key; lease signing/verification over
                        "earned/lease/v1"; the op commitment derivation the authority re-checks (A1)
      store.cjs         the STORE interface the authority runs on: per-athlete append-only log, per-device slots
                        (device_id + device_seq → disposition history, append-only), plan transactions, issuances,
                        instances, revocations, ownership sets — with real all-or-nothing transactions (the A5 crash
                        law: a crash between admission and the plan transaction leaves BOTH or NEITHER). Ship an in-
                        memory backend; the interface must be implementable over SQLite/D1 (row writes, one writer,
                        transactions), not over JS object identity.
      admit.cjs         A1/A2 admission: replay (same op_id + same commitment → the original disposition, log
                        untouched), IDENTITY_COLLISION, device_seq reuse, cross-athlete references, WAITING on unknown
                        parents / REJECTED_DEPENDENCY on rejected parents, exactly-one-terminal history, athlete-scoped
                        ownership SETS (two athletes may share an op_id), lease checks (range, time, revocation barrier
                        = last ACCEPTED device_seq), MALFORMED admission (unitless quantity, non-finite, stray/missing
                        target, missing offset), corrections/tombstones as NEW ops, A4 payload completeness and
                        reclassification compatibility
      plan.cjs          A5 plan transactions (exactly one per accepted direct edit; replay adds none), state 4
                        concurrent transactions with NUMERIC lineage-key order (vector compare: key [2] beats [10]),
                        conflict-selection by compare-and-append on seen_conflict_basis (BASIS_STALE retained non-applied,
                        LINEAGE_MISMATCH rejected, chosen alternative must be a maximum, N-way selection covers every
                        maximum), undo eligibility (unique unsuspended maximum + effect digest + compensating group)
      issue.cjs         state 8: issuance; instance identity = hash(family, generation, offer_digest) — two devices,
                        same offer → one instance; coverage pause behind an unrelated op; basis confirmation; Keep
                        settles; apply results idempotent
      reduce.cjs        state 15: semantic order is causal parents only (two arrival orders reduce identically); the
                        contiguous frontier; state 16 export pinned to W, labelled Complete-through-W or PARTIAL with
                        the pending count
      committer.cjs     the LOCAL COMMITTER (state 20): a client-side lease validator the authority hands out —
                        signature, device + athlete binding, lease id, schema, not_before, not_after by a MONOTONIC
                        high-water clock (rollback never revives), range, restore continuity (writes refused until a
                        signed server time)
      index.cjs         createAuthority(config) — composition root. config: { authorityKey, identityKeys or a key
                        lookup by athlete, store/backend, clock, athletes: { id: { devices: { id: { lease } } } } }

    Put a short README.md in rebuild/authority/ (module map, the store interface, how faults are injected from outside,
    what a D1 backend must implement).

(b) THE ADAPTER: `rebuild/conform/adapters/authority.cjs` — `module.exports = { create(cfg, hooks) }`. It maps the
    suite's config (see `ATH()` in the laws: athletes → devices → signed leases) onto createAuthority, supplies the
    in-memory backend and a test clock, and returns the API object the laws call. The method inventory the laws use
    (read the laws for exact signatures and return shapes; the reference's returned object is the normalized shape):
    admit(athleteId, op) · log(athleteId) · frontier(athleteId) · disposition(athleteId, deviceId, seq) ·
    dispositionHistory(athleteId, deviceId, seq) · verifyDisposition(d) · injectCrash(point) · clearCrash() ·
    plan(athleteId) · planTransactions(athleteId) · planState(athleteId, domain) · planOfDomain · txnDigests(athleteId,
    txnId) · revokeDevice(athleteId, deviceId) · issue(athleteId, issuance) · apply(athleteId, request) ·
    confirmBasis(athleteId, instance) · instanceOf(athleteId, issuanceId) · instanceState · exportSnapshot(athleteId,
    {outboxPending, rejected}) · localCommitter(lease, clock) → { commitLocal, advance, rollback, restore,
    syncedServerTime }. `hooks` is ignored (mutants apply only to the reference). The adapter MAY require ../lib/ops.cjs
    for the shared test constants (AUTH_KEY, K_IDENTITY) — it MUST NOT require ../reference/* — and product code must
    not require anything under rebuild/conform. injectCrash is a fault the ADAPTER injects into the store from outside
    (a backend whose commit fails at the named point); the product contains no test hooks.

## 2. THE GATE (must pass before you report)

    cd rebuild/conform
    node engines/build-engines.mjs <repo root>          # builds the old-engine artifacts into engines/ (gitignored)
    export ENGINE_MAIN=$PWD/engines/engine-main.cjs ENGINE_FIX4B=$PWD/engines/engine-fix4b.cjs
    mkdir -p private && git show a0009c3:ledger/state.json > private/live.json     # gitignored, never committed
    MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York node oracle/port-oracle.cjs golden $ENGINE_MAIN main "a0009c3 (v7.55.9, deployed main)"
    git checkout -- oracle/manifest.json golden/        # the golden step re-stamps them; the committed pins stay
    MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York node run.cjs
      → "6 adapters laws/sheet-A-authority.cjs: family authority present → all GREEN" with 34 GREEN · 0 FAIL · 0 DEFECT ·
        0 HARNESS_ERROR; "6 adapters laws/soak.cjs: family authority present → all GREEN" 1 GREEN; the client family
        still 35 GREEN; policy and progression still "absent → all RED(as specified)"; final line
        "SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against
        present families"; exit 0.
    MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York node run.cjs --selftest   → SELFTEST PASS (10/10), unchanged.
    Independence: grep -rn "conform" rebuild/authority/ → nothing but README prose; grep -n "reference" adapters/authority.cjs
    → nothing; cd /tmp && node -e "require('<repo>/rebuild/authority')" → loads.
    Bite check: break ONE product rule on purpose (e.g. make replay append a second log entry), run the gate, confirm
    the matching law FAILs, restore. Report which law bit.

## 3. CANONICAL-v1 (your encoder must produce the same bytes as lib/canonical.cjs, implemented independently)

    strings → Unicode NFC, then JSON string quoting · numbers → canonical decimal (0 and -0 → "0"; no exponent for
    values toString() would print with one — reproduce lib/canonical.cjs's decimal() exactly, including its known
    quirks, which are documented in rebuild/t2/REPORT.txt §6; the product client's canonical.cjs already does this) ·
    booleans true|false · null → the literal null; absent → the key is omitted · arrays → "[" items "," "]"; the SET
    field causal_parents is de-duplicated and sorted by encoding · maps → keys sorted by UTF-16 code unit order (JS
    default sort), "{" "\"key\":" value "," "}" · commitment = hex HMAC-SHA256(K_identity, "earned/op/v1" + encode(op
    minus canonical_content_commitment, authority_signature, athlete_log_seq, accepted_at, decided_at,
    sealing_transitions, sealed)).

## 4. INTEROPERABILITY (a second gate the owner will run; build for it)

    The T2 client (rebuild/client) talks to an authority through `transport.send(op) → { disposition } | undefined` and
    `transport.pull(W) → { receipts }`. Provide `rebuild/authority/transport.cjs` exporting `localTransport(authority,
    athleteId)` that adapts your authority to exactly that transport shape (dispositions signed with the authority key
    the client was configured with; receipts = { seq, op_id, canonical_content_commitment, accepted_at, op? }). The owner's
    rig will run: client.weighIn → client.syncOnce → the disposition drains the outbox → client.reduceThroughW pulls the
    receipt → client.frontier() === 1 — with two devices of one athlete and a second athlete, and with a forged
    authority key (nothing drains). Include your own run of that scenario in the report (a few lines of node).

## 5. DELIVERABLE

    rebuild/t3/REPORT-<builder>.md (CLAUDE or ASTRA): (1) module map with line counts; (2) the gate output tail (the two
    §A/soak adapter lines, the §B line, the SUMMARY block, the SELFTEST line); (3) independence outputs; (4) the bite
    check; (5) every place a law forced a test-shaped seam into the product (law id, the seam, how the adapter absorbs
    it) — honest, this list goes to two blind reviewers; (6) anything in a law you believe is wrong (not edited);
    (7) what T3 does NOT cover (no HTTP layer, no D1 backend yet, no auth, no key rotation, …); (8) your interop run
    (§4); (9) wall-clock time and, if you can see it, tokens used. Factual and short. No claims you did not execute.
    Commit the product, the adapter and the report on your branch; push; open a PR against rebuild/t2-client-core
    titled "T3 authority — builder <CLAUDE|ASTRA>". Do NOT merge.

## 6. RULES

    No network beyond package install. No git operations under rebuild/conform except adding adapters/authority.cjs.
    Never print or expose tokens. Never touch src/, index.html, ledger/, scripts/, tools/ (the frozen app). Never
    commit private/ or engines/*.cjs. Work until the gate passes; if one law resists after real effort, leave the
    adapter in place so the runner shows exactly which law FAILs, and say why in the report — an explained FAIL beats a
    hack that makes it green.
