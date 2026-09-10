# Workout ask-time current-head join — technical proposal v2

PROPOSED / NOT IMPLEMENTED / NOT ACCEPTED. Replaces the earlier local proposal;
its original bytes and Opus's first verdict remain preserved. Public source basis:
PR46 `5e6d86e8c91f18ecde036515e4afed241f9ac3b9` and integration
`28ff3be3a0c47fa76b642015ac3757da5c76548c`; the five W5 files reviewed are identical.
This closes only a proposed producer/consumer contract, not the workout schema,
normalizer, legacy basis, Q1, T1/K1, CLOCK, private-use or integration gates.

## 1. Existing evidence and correction

Fresh signed time does not bind a history reply; a requested-W snapshot need not
be the head; adding a nonce only to a legacy pull request cannot make its reply
echo that challenge. Altering an already signed response instead breaks its
signature. Neither is a signature forgery or an observed production issuance bug.

The existing bridge DOES guard scoped reads. `bridge.cjs:24–37` loads revision,
rows and subject bindings in one batch; `:44–55` rechecks subject/device and the
argument athlete in that staged snapshot; `:72–74` asserts the captured database
revision even for reads; `:81–91` increments, commits and retries stale work.
`invokeScoped` delegates to this `execute`; a revision argument is not required.
The worker's preliminary scope call is separate, but its subsequent scoped
receipts call reauthorizes and rejects a mismatched binding. Range and through
already come from the same returned array (`worker.cjs:87–89`). Reuse this guard;
do not add a redundant guard or describe it as absent. The new proof's coherent
range/head/scope assembly and adverse-race tests must still be demonstrated.

`WIRE.md:47` is the pull signature-domain table row, not a local compare-and-swap
contract. The SERVER database revision and CLIENT durable revision are separate
values and never compared to each other. The proposed local fence below is an
explicit consumer requirement; PR46's brief §2 currentness paragraph describes
the retained W6 mechanisms, but does not claim an implemented issuance predicate.

## 2. Exact proposed wire and consumer contract

| Boundary | Proposed requirement |
|---|---|
| Capability/request | Opt in on `POST /pull` with `history_profile: "earned/challenge-head/v1"`, `challenge` (32 random bytes, unpadded base64url), `after` (safe nonnegative integer) and the existing device binding. No request athlete selector. One outstanding history request per account/device boundary. Keep captured CLIENT durable revision and issuance-attempt identity in its local pending context; neither is server authority. |
| Producer read | After normal token validation, run the existing scoped bridge receipts read. Reuse its consistent snapshot, athlete/device checks and revision assertion. Derive the full range after the requested frontier and actual head from that one returned array. Fail if `after` exceeds head. Do not assemble independently read range/head, expose stale staged success, or substitute a requested-W snapshot. A scoped range result is evidence at its guarded read, not at arbitrary future response delivery. |
| Signed object | Pin `DOMAINS.currentHead = "earned/current-head/v1"`; require exact `history_profile: "earned/challenge-head/v1"`. Sign `wire_version`, `key_epoch`, `history_profile`, `challenge`, `athlete_id`, `device_id`, `after`, `through`, `head`, and complete ordered `receipts` under that distinct domain using existing canonical and ES256 encoding. Require `through === head`. All receipts retain their existing individual domain/signatures and canonical bytes. |
| Compatibility | Existing `WIRE_VERSION` and key-epoch/signature-kid matching remain. The new verifier requires the exact profile/domain and all required fields; legacy responses or ignored request fields mean unsupported capability, never success/fallback. Updated legacy `acceptPull` and `acceptSnapshot` explicitly refuse a present reserved `history_profile` field; original historical objects remain unchanged. An old consumer cannot verify a genuinely new-domain signature under its old domain. No historical signature, operation HMAC, identity or consent change. |
| Verification | Match pending challenge/profile/account/device/after exactly; copy and authenticate the full response and every receipt, with exact contiguous coverage. Unknown key, invalid shape/signature, wrong scope or missing coverage refuses before any state-moving callback. Check the pending context again after asynchronous verification so a replaced/consumed request cannot race into a sink. |
| Consume and durable handoff | Consume the matched pending request once before invoking its sink. The sink compares captured CLIENT revision and known-standing/context guards with the actual local store in the same atomic transaction that commits accepted history, retained signed evidence and the reviewed derived basis. A conflict reports unconfirmed/reconcile, preserves prior facts/input and cannot publish issuance. Only completed durability permits the observation to become available to the captured issuance attempt. A failed write requires a new request; it cannot erase learned adverse knowledge. The W6 knowledge-loss fence remains a hard blocker. |
| Lifetime | Replacing a request invalidates its predecessor. A restart cannot revive a volatile pending challenge or unverified marker. The proof says committed head at its producer read; it provides NO physical freshness interval. T1's server-error/rate and browser suspension questions remain separate. A same-process timeout cannot manufacture physical freshness or CLOCK PASS. |
| Issuance | The observation may support only its captured issuance attempt, after the separately reviewed normalizer/reducer establishes the full generation, basis, decision antichain and local pending-change guard in a consistent state. It is not a reusable permission for arbitrary future questions merely because no relevant change has been learned. A later new issuance attempt needs a new challenged observation; reuse of a prior accepted answer is the existing OPEN Q1 and is not decided here. Missing legacy basis or unsupported effects remain unqualified. |
| Offline answer | Preserve reviewed Q3: a question already issued on its established basis remains offline-answerable under lease, standing, durable-save and known-dependency guards. Recheck its immutable bindings in the final atomic commit; no network read is required for every answer. Preserve immutable answer bytes through pending/WAITING/accepted/rejected reconciliation. |

The source delta, after acceptance, is narrow: worker pull opt-in/signing;
crypto/public-client new domain/profile/signature methods and reserved-field
guards; public-client pending request lifecycle; retained W6 proof sink and
captured-local-revision fence. Reuse the R1 bridge unless an executed coherent
scope/range/head witness demonstrates a necessary amendment. No new bridge
resource exemption, schema activation, T3 admission rule, private fixture or
seeded-store change is authorized by this preparation.

## 3. Required future executable cases — not run by this proposal

1. Old signed pull after fresh time, requested-W export, unechoed request nonce,
   wrong profile/domain/after/head/scope or unknown key cannot establish currentness.
2. New exact object verifies full range including empty-at-head; after beyond head,
   missing, duplicate, reordered or altered receipts refuse before the sink.
3. Current-domain object fails legacy domain verification; a legacy-domain object
   with the reserved history profile refuses legacy methods; original history passes.
4. Independent local D1 invocations race head advance and ownership/revocation:
   scoped range/head comes from one guarded snapshot; stale work retries/refuses.
5. Lost response, replay, simultaneous callbacks and replacement during async
   verification allow at most one sink; failed write/restart requires a fresh request.
6. Local revision or adverse-knowledge change before commit prevents issuance;
   test the real durable store and persistent knowledge-loss fence, not callback mocks.
7. A proof cannot issue an unrelated future question. Already-issued offline answers
   retain Q3 behavior and exact immutable bytes. No test decides OPEN Q1 implicitly.
8. A later server operation does not retroactively forge a valid observed prefix;
   later learned changes update applicability through the reviewed generation rules.
9. Effective mutants ignore challenge/profile, substitute requested-W for head,
   omit a receipt, bypass the server guard or publish before local durability.

Existing D1/HTTP/resource, W6, conformance, independent integration, privacy and
phone gates remain required. The author diagnostic and reviewer eight challenges
test existing boundaries, not this unimplemented mode. Reviewer must accept or
object to these exact technical choices; remaining schema/normalizer/Q1 joins
continue to block product issuance. No owner relay or new owner question is needed.
