# Amendment to the W5/W6 current-head contract review — v2 verdict

Reviewing model: Claude Opus 5 (claude-opus-5), High, fast off. No model switch occurred.
Scope: PUBLIC review of PROPOSED text only. Original archive
(d923cf8e63b9406c1ae746312f73f008f7c3d1f035d2c7807533fd97a996566f) and its verdict are
preserved unchanged; this amends F1, F3 and the F4 citation.

## VERDICT ON V2: ACCEPT AS PROPOSED CONTRACT TEXT

Proposal acceptance ONLY. This is not implementation acceptance, not gate acceptance, not
CLOCK/production/private/integration acceptance, and decides no OPEN join. Nothing here
authorizes writing the code, activating schema, or relaxing any existing gate.

## Reviewer errors corrected

F1 WITHDRAWN — "no revision guard exists" was FALSE.
  I reached it by grepping the token `revision` in worker.cjs and public-client.cjs. The guard
  lives one layer down in bridge.cjs, which that grep never covered. This is the same
  truncated-search error class I was corrected on previously; the fix is to execute the call
  chain, which I have now done. Executed witness (bridge-revision-witness.cjs, native 0):
    W1 read-only scoped `receipts` issues the captured-revision assertion and commits
       (assertionsSeen=1, commits=1)
    W2 a concurrent bump between the staged read and the commit makes the READ stale and
       forces a retry (reads=2, staleThrown=1, commits=1) — the first attempt publishes nothing
    W3 mismatched argument athlete denied at the staged snapshot (SCOPE_FORBIDDEN, commits=0)
    W4 unknown subject binding denied (SCOPE_FORBIDDEN, commits=0)
  Confirms bridge.cjs:24-37 one batch; :44-55 subject/device + argument-athlete recheck in that
  snapshot; :72-74 revision assertion for READS ("Even a read-only successful result is
  authorized at a checked revision"); :81-91 increment/commit/retry; invokeScoped:99 delegating
  to execute with no caller revision argument. v2 §1 is accurate; reuse the guard, add none.

F4 CITATION WITHDRAWN — WIRE.md:47 is `| Pull | earned/pull/v1 | authority_signature |`, a
  signature-domain table row, not a compare-and-swap contract. The serialize/CAS sentence is
  WIRE.md:23, the W6 CLIENT sink contract. SERVER D1 revision and CLIENT durable revision are
  distinct values and are never compared to each other. v2 §1 states this correctly.

F3 WITHDRAWN AS WORDED — my sentence ("remains usable for issuance until a locally known
  relevant transition supersedes it") framed the observation as a standing permission, which
  could grant arbitrary future issuance from old evidence. v2's Issuance row is strictly safer:
  the observation supports only its captured issuance attempt; a later attempt needs a new
  challenged observation; Q1 reuse stays OPEN. I found no ratified rule that this conflicts
  with. R570 governs re-asking an answered component, not which evidence may authorize an
  issuance attempt, so the per-attempt binding is a tightening, not a contradiction; Q3 is
  preserved verbatim.

## Evidence scope corrected

My eight consumer challenges exercised the public consumer verification boundary
(public-client.cjs + crypto.cjs). They did NOT exercise the bridge and are not presented as
bridge evidence. Within them, C1/C2 are RESPONSE-mutation tests: they show a client-added field
breaks canonicalization and an unsigned inserted field fails verification. They are NOT the
original third disproof (a nonce added only to the REQUEST); that rests on producer inspection
(worker.cjs:96 signs a fixed field list and the /pull handler never reads a request nonce) plus
the author's retained actual-handler diagnostic, which I did not re-run.

## F2 retained and adopted

D1 remains valid executed evidence: an envelope carrying challenge/head/purpose but signed under
the existing `DOMAINS.pull` is accepted by legacy `acceptPull` and forwarded to the sink. v2
adopts the distinct `DOMAINS.currentHead = "earned/current-head/v1"` plus the exact in-payload
`history_profile`, mirroring the only existing challenge-bound mode (serverTime + time_profile,
checked at public-client.cjs:163). This makes v2's reserved-field refusal in legacy
acceptPull/acceptSnapshot load-bearing rather than cosmetic — D1 is precisely the case it stops.

## Two non-blocking wording notes (no objection; adopt or discard)

N1 The Producer-read row says "Fail if `after` exceeds head" without naming the existing code.
   The current handler answers this with 409 FRONTIER_AHEAD / state 18 (worker.cjs:90,
   WIRE.md pull row). Naming it prevents an implementer inventing a new error.
N2 The Compatibility row could state WHY the reserved-field refusal is required, since strict
   canonicalization already breaks unsigned extra fields: it is required for the case where a
   producer SIGNS the reserved field under the legacy domain, which D1 shows legacy acceptPull
   accepts today. Otherwise an implementer may drop it as redundant.

## Unchanged limits

No real D1, HTTP, IndexedDB, phone or backend behaviour exercised; the W-witness uses a
synthetic in-memory D1 stub honouring only the two statement shapes the bridge issues, and
proves neither D1 semantics nor resource safety. Old signatures are not broken. The proposed
mode does not exist in the code. Schema, normalizer, legacy basis, Q1, T1/K1, CLOCK, W6
knowledge-loss fence, privacy, phone and integration gates all remain required and unaffected.
No private data, fixture or golden read; no source, branch, PR, envelope, schema, receipt or
gate touched.
